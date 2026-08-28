-- =============================================================================
-- Eğitim Evi — veritabanı şeması, sürüm 1
--
-- Bu dosya uygulama ilk açıldığında bir kez çalışır (sunucu/veri/sema.js).
-- Sonraki değişiklikler yeni numaralı dosyalarla gelir (002-..., 003-...);
-- hangi dosyaların uygulandığı sema_surumleri tablosunda tutulur.
--
-- Kurallar:
--   * Tablo ve sütun adları Türkçe, küçük harf, alt çizgili (ASCII).
--   * Kimlikler metindir (u_6eec2a1a..., s_7af5...): uygulama üretir; eski
--     JSON verisi ve yedekler kimlik değişmeden içeri alınabilsin diye.
--   * Silme kuralları uygulamanın davranışıyla birebir aynıdır:
--       - Okullar silinmez (müdür silinince okul "beklemede"ye alınır).
--       - Bir kullanıcı silinince KENDİSİNE AİT kayıtlar silinir (bildirim,
--         oturum, veli bağı, ödev sonucu, notu, devamsızlığı); BAŞKALARINI
--         ilgilendiren kayıtlarda (verdiği ödev, gönderdiği mesaj) adı boşa
--         düşer (SET NULL), kayıt kalır.
--       - Sınıf silinince dersleri ve programı gider; öğrencileri sınıfsız kalır.
--   * Değer kuralları (CHECK) koddaki doğrulamanın ikinci katmanıdır: kodda
--     bir hata olsa bile veritabanı geçersiz veriyi kabul etmez.
-- =============================================================================


-- -----------------------------------------------------------------------------
-- OKULLAR
-- MEB listesinden seçilen ya da elle yazılan okul. Müdür başvurusuyla açılır,
-- sistem yöneticisi onaylar.
-- -----------------------------------------------------------------------------
CREATE TABLE okullar (
  id            text        PRIMARY KEY,
  meb_kodu      text        NOT NULL DEFAULT '',          -- MEB kurum kodu; elle yazılan okulda boş
  ad            text        NOT NULL CHECK (length(ad) BETWEEN 2 AND 140),
  il            text        NOT NULL,
  ilce          text        NOT NULL DEFAULT '',
  tur           text        NOT NULL DEFAULT '',          -- Ortaokul, Lise ...
  durum         text        NOT NULL DEFAULT 'pending'
                            CHECK (durum IN ('pending', 'approved', 'rejected')),
  olusturma     timestamptz NOT NULL DEFAULT now()
);

-- Aynı MEB okuluna ikinci bir (reddedilmemiş) başvuru olamaz.
CREATE UNIQUE INDEX okullar_meb_kodu_tekil
  ON okullar (meb_kodu) WHERE meb_kodu <> '' AND durum <> 'rejected';
CREATE INDEX okullar_il_durum ON okullar (il, durum);


-- -----------------------------------------------------------------------------
-- EĞİTİM YILLARI
-- "2026-2027" gibi. Ödev, program, devamsızlık gibi kayıtlar bir yıla bağlıdır;
-- geçmiş yıla salt okunur bakılır. Bir okulda aynı anda tek aktif yıl olur.
-- -----------------------------------------------------------------------------
CREATE TABLE egitim_yillari (
  id            text        PRIMARY KEY,
  okul_id       text        NOT NULL REFERENCES okullar (id),
  ad            text        NOT NULL CHECK (ad ~ '^[0-9]{4}-[0-9]{4}$'),
  baslangic     date        NOT NULL,
  bitis         date        NOT NULL,
  aktif         boolean     NOT NULL DEFAULT false,
  olusturma     timestamptz NOT NULL DEFAULT now(),
  UNIQUE (okul_id, ad),
  CHECK (bitis > baslangic)
);

-- Okul başına en fazla bir aktif yıl.
CREATE UNIQUE INDEX egitim_yillari_tek_aktif ON egitim_yillari (okul_id) WHERE aktif;


-- -----------------------------------------------------------------------------
-- SINIFLAR ve ÖZEL ROLLER (okula ait yapılar)
-- -----------------------------------------------------------------------------
CREATE TABLE siniflar (
  id            text        PRIMARY KEY,
  okul_id       text        NOT NULL REFERENCES okullar (id),
  ad            text        NOT NULL CHECK (length(ad) BETWEEN 1 AND 30),   -- "7-A"
  olusturma     timestamptz NOT NULL DEFAULT now(),
  UNIQUE (okul_id, ad)
);

-- Müdürün tanımladığı rol ("Zümre Başkanı", "Müdür Yardımcısı"...)
CREATE TABLE roller (
  id            text        PRIMARY KEY,
  okul_id       text        NOT NULL REFERENCES okullar (id),
  ad            text        NOT NULL CHECK (length(ad) BETWEEN 1 AND 60),
  olusturma     timestamptz NOT NULL DEFAULT now(),
  UNIQUE (okul_id, ad)
);

-- Rolün verdiği yetkiler ("odev.ver", "program.duzenle" ...)
CREATE TABLE rol_yetkileri (
  rol_id        text        NOT NULL REFERENCES roller (id) ON DELETE CASCADE,
  yetki         text        NOT NULL,
  PRIMARY KEY (rol_id, yetki)
);

-- Yetkinin daraltılması: yalnızca belirli dersler ve/veya sınıflar.
-- deger '*' ise "hepsi" demektir. Hiç satır yoksa yetki okulun tamamında geçer.
CREATE TABLE rol_yetki_kapsamlari (
  rol_id        text        NOT NULL,
  yetki         text        NOT NULL,
  tur           text        NOT NULL CHECK (tur IN ('ders', 'sinif')),
  deger         text        NOT NULL,       -- ders adı ya da sınıf kimliği ya da '*'
  PRIMARY KEY (rol_id, yetki, tur, deger),
  FOREIGN KEY (rol_id, yetki) REFERENCES rol_yetkileri (rol_id, yetki) ON DELETE CASCADE
);


-- -----------------------------------------------------------------------------
-- KULLANICILAR
-- Beş rol tek tabloda: admin (sistem yöneticisi), principal (müdür),
-- teacher (öğretmen), student (öğrenci), parent (veli).
-- Şifre asla düz metin tutulmaz: sifre_ozeti = scrypt tuzu + özeti.
-- -----------------------------------------------------------------------------
CREATE TABLE kullanicilar (
  id            text        PRIMARY KEY,
  eposta        text        NOT NULL UNIQUE
                            CHECK (eposta = lower(eposta) AND eposta LIKE '%_@_%'),
  sifre_ozeti   text        NOT NULL,
  ad_soyad      text        NOT NULL CHECK (length(ad_soyad) BETWEEN 3 AND 80),
  rol           text        NOT NULL
                            CHECK (rol IN ('admin', 'principal', 'teacher', 'student', 'parent')),
  durum         text        NOT NULL DEFAULT 'approved'
                            CHECK (durum IN ('pending', 'approved', 'rejected')),

  okul_id       text        REFERENCES okullar (id),                        -- yönetici ve velide boş
  sinif_id      text        REFERENCES siniflar (id) ON DELETE SET NULL,    -- yalnızca öğrenci
  ozel_rol_id   text        REFERENCES roller (id) ON DELETE SET NULL,      -- müdürün verdiği rol
  secili_yil_id text        REFERENCES egitim_yillari (id) ON DELETE SET NULL, -- baktığı eğitim yılı
  olusturan_id  text        REFERENCES kullanicilar (id) ON DELETE SET NULL,   -- hesabı müdür açtıysa

  telefon       text        NOT NULL DEFAULT '' CHECK (telefon = '' OR telefon ~ '^05[0-9]{9}$'),
  il            text        NOT NULL DEFAULT '',
  ilce          text        NOT NULL DEFAULT '',
  adres         text        NOT NULL DEFAULT '',
  dogum_tarihi  date        CHECK (dogum_tarihi IS NULL OR dogum_tarihi >= DATE '1920-01-01'),
  brans         text        NOT NULL DEFAULT '',          -- öğretmenin dersi
  sinif_etiketi text        NOT NULL DEFAULT '',          -- öğrencinin kayıtta yazdığı "7-A"
  veli_kodu     text        NOT NULL DEFAULT '',          -- öğrencinin veliyle paylaştığı kod
  okul_notu     text        NOT NULL DEFAULT '',          -- müdürün hesap açarken yazdığı not

  tema          text        NOT NULL DEFAULT 'sistem' CHECK (tema IN ('sistem', 'acik', 'koyu')),
  mesaj_kimden  text        NOT NULL DEFAULT 'herkes'
                            CHECK (mesaj_kimden IN ('herkes', 'personel', 'kapali')),

  -- Kişisel verilerin korunması: hangi sürümü ne zaman onayladı
  kvkk_onay     boolean     NOT NULL DEFAULT false,
  kvkk_tarih    timestamptz,
  kvkk_surum    text        NOT NULL DEFAULT '',

  olusturma     timestamptz NOT NULL DEFAULT now(),

  -- Öğretmen/müdür/öğrenci bir okula bağlı olmak zorunda
  CHECK (rol IN ('admin', 'parent') OR okul_id IS NOT NULL)
);

CREATE UNIQUE INDEX kullanicilar_veli_kodu_tekil ON kullanicilar (veli_kodu) WHERE veli_kodu <> '';
CREATE INDEX kullanicilar_okul_rol ON kullanicilar (okul_id, rol);
CREATE INDEX kullanicilar_sinif    ON kullanicilar (sinif_id) WHERE sinif_id IS NOT NULL;

-- Kişinin "bana yazamasın" listesi
CREATE TABLE mesaj_engelleri (
  kullanici_id  text        NOT NULL REFERENCES kullanicilar (id) ON DELETE CASCADE,
  engellenen_id text        NOT NULL REFERENCES kullanicilar (id) ON DELETE CASCADE,
  PRIMARY KEY (kullanici_id, engellenen_id),
  CHECK (kullanici_id <> engellenen_id)
);

-- Veli ile çocuğu arasındaki bağ (veli, çocuğun veli koduyla kurar)
CREATE TABLE veli_baglari (
  id            text        PRIMARY KEY,
  veli_id       text        NOT NULL REFERENCES kullanicilar (id) ON DELETE CASCADE,
  ogrenci_id    text        NOT NULL REFERENCES kullanicilar (id) ON DELETE CASCADE,
  olusturma     timestamptz NOT NULL DEFAULT now(),
  UNIQUE (veli_id, ogrenci_id)
);
CREATE INDEX veli_baglari_ogrenci ON veli_baglari (ogrenci_id);


-- -----------------------------------------------------------------------------
-- DERSLER ve DERS PROGRAMI
-- Ders = bir sınıfta okutulan bir branş ("7-A Matematik"), öğretmeni atanır.
-- Öğretmen-öğrenci ilişkisi YALNIZCA buradan türer: öğretmen, dersine girdiği
-- sınıfların öğrencilerinin öğretmenidir.
-- -----------------------------------------------------------------------------
CREATE TABLE dersler (
  id            text        PRIMARY KEY,
  okul_id       text        NOT NULL REFERENCES okullar (id),
  sinif_id      text        NOT NULL REFERENCES siniflar (id) ON DELETE CASCADE,
  konu          text        NOT NULL,                     -- "Matematik"
  ogretmen_id   text        REFERENCES kullanicilar (id) ON DELETE SET NULL,
  haftalik_saat smallint    NOT NULL DEFAULT 0 CHECK (haftalik_saat BETWEEN 0 AND 20),
  olusturma     timestamptz NOT NULL DEFAULT now(),
  UNIQUE (sinif_id, konu)
);
CREATE INDEX dersler_ogretmen ON dersler (ogretmen_id) WHERE ogretmen_id IS NOT NULL;
CREATE INDEX dersler_okul     ON dersler (okul_id);

-- Haftalık programdaki bir ders saati: hangi gün, kaçta başlar, kaçta biter.
CREATE TABLE ders_programi (
  id            text        PRIMARY KEY,
  okul_id       text        NOT NULL REFERENCES okullar (id),
  sinif_id      text        NOT NULL REFERENCES siniflar (id) ON DELETE CASCADE,
  ders_id       text        NOT NULL REFERENCES dersler (id) ON DELETE CASCADE,
  gun           smallint    NOT NULL CHECK (gun BETWEEN 1 AND 7),   -- 1 = Pazartesi
  baslangic     time        NOT NULL,
  bitis         time        NOT NULL,
  yil_id        text        REFERENCES egitim_yillari (id) ON DELETE SET NULL,
  olusturma     timestamptz NOT NULL DEFAULT now(),
  CHECK (bitis > baslangic AND bitis - baslangic <= interval '8 hours')
);
CREATE INDEX ders_programi_sinif_gun ON ders_programi (sinif_id, gun, baslangic);
CREATE INDEX ders_programi_ders      ON ders_programi (ders_id);
CREATE INDEX ders_programi_okul      ON ders_programi (okul_id);


-- -----------------------------------------------------------------------------
-- ÖDEVLER
-- Bir ödev birden çok öğrenciye verilir; her öğrencinin sonucu ayrı satırdır.
-- -----------------------------------------------------------------------------
CREATE TABLE odevler (
  id            text        PRIMARY KEY,
  okul_id       text        NOT NULL REFERENCES okullar (id),
  ogretmen_id   text        REFERENCES kullanicilar (id) ON DELETE SET NULL,
  ders          text        NOT NULL,                     -- "Matematik"
  baslik        text        NOT NULL CHECK (length(baslik) BETWEEN 1 AND 200),
  aciklama      text        NOT NULL DEFAULT '',
  baslangic     date,
  bitis         date,                                     -- boşsa süresiz
  bitis_saati   time        NOT NULL DEFAULT '12:00',
  durum         text        NOT NULL DEFAULT 'active' CHECK (durum IN ('active', 'finished')),
  yil_id        text        REFERENCES egitim_yillari (id) ON DELETE SET NULL,
  olusturma     timestamptz NOT NULL DEFAULT now(),
  sonuclanma    timestamptz,
  CHECK (bitis IS NULL OR baslangic IS NULL OR bitis >= baslangic)
);
CREATE INDEX odevler_ogretmen ON odevler (ogretmen_id, olusturma DESC);
CREATE INDEX odevler_okul     ON odevler (okul_id, olusturma DESC);
CREATE INDEX odevler_bitis    ON odevler (bitis) WHERE durum = 'active';

-- Ödevin hangi sınıflara verildiği (öğrenci seçimi sınıf sınıf yapılır)
CREATE TABLE odev_siniflari (
  odev_id       text        NOT NULL REFERENCES odevler (id) ON DELETE CASCADE,
  sinif_id      text        NOT NULL REFERENCES siniflar (id) ON DELETE CASCADE,
  PRIMARY KEY (odev_id, sinif_id)
);

-- Ödevi alan öğrenci ve sonucu. sonuc boşsa henüz değerlendirilmedi.
--   yapti · yapmadi · eksik · gec (geç yaptı)
--   izinli  = gelmedi, izinli   (başarı oranını düşürmez)
--   gelmedi = gelmedi, izinsiz  (başarı oranını düşürür)
CREATE TABLE odev_ogrencileri (
  odev_id       text        NOT NULL REFERENCES odevler (id) ON DELETE CASCADE,
  ogrenci_id    text        NOT NULL REFERENCES kullanicilar (id) ON DELETE CASCADE,
  sonuc         text        CHECK (sonuc IN ('yapti', 'yapmadi', 'eksik', 'gec', 'izinli', 'gelmedi')),
  acilma        timestamptz,                              -- öğrenci ödevi ilk açtığında
  PRIMARY KEY (odev_id, ogrenci_id)
);
CREATE INDEX odev_ogrencileri_ogrenci ON odev_ogrencileri (ogrenci_id);


-- -----------------------------------------------------------------------------
-- SINAVLAR
--
-- Şablon ("Yazılı", "LGS Denemesi") bir kez tanımlanır: hangi ölçümler var,
-- her birinin aralığı ne. Örnek LGS şablonu:
--     01.D Doğru Sayısı 0-90 · 02.Y Yanlış Sayısı 0-90 · 05.N Net 0-90
--     LGS  LGS Puanı 100-500 (ana ölçüm)
-- Sınav açılırken şablonun ölçümleri sınava KOPYALANIR (sinav_olcumleri):
-- şablon sonradan değişse de eski sınavların sonuçları bozulmaz.
-- Şablonsuz sınav tek bir "Puan" (0-100) ölçümüyle açılır.
--
-- Sınav grubu ("1. Dönem Yazılıları") isteğe bağlıdır; gruptaki sınavlar
-- ağırlıklarıyla (%50, %50) ortalamaya girer.
--
-- Değerler ondalıklı olabilir (490,161). Tek sınır: -10000 ile 10000.
-- -----------------------------------------------------------------------------
CREATE TABLE sinav_sablonlari (
  id            text        PRIMARY KEY,
  okul_id       text        NOT NULL REFERENCES okullar (id),
  olusturan_id  text        REFERENCES kullanicilar (id) ON DELETE SET NULL,
  ad            text        NOT NULL CHECK (length(ad) BETWEEN 1 AND 60),
  olusturma     timestamptz NOT NULL DEFAULT now(),
  UNIQUE (okul_id, ad)
);

CREATE TABLE sablon_olcumleri (
  id            text        PRIMARY KEY,
  sablon_id     text        NOT NULL REFERENCES sinav_sablonlari (id) ON DELETE CASCADE,
  sira          smallint    NOT NULL,
  kod           text        NOT NULL CHECK (length(kod) BETWEEN 1 AND 12),     -- "01.D", "LGS"
  ad            text        NOT NULL CHECK (length(ad) BETWEEN 1 AND 60),      -- "Doğru Sayısı"
  alt_sinir     numeric(12,3) NOT NULL DEFAULT 0,
  ust_sinir     numeric(12,3) NOT NULL DEFAULT 100,
  ana           boolean     NOT NULL DEFAULT false,   -- ortalamaya ve grafiğe giren ölçüm
  UNIQUE (sablon_id, kod),
  CHECK (alt_sinir >= -10000 AND ust_sinir <= 10000 AND alt_sinir < ust_sinir)
);
CREATE UNIQUE INDEX sablon_olcumleri_tek_ana ON sablon_olcumleri (sablon_id) WHERE ana;

CREATE TABLE sinav_gruplari (
  id            text        PRIMARY KEY,
  okul_id       text        NOT NULL REFERENCES okullar (id),
  ogretmen_id   text        REFERENCES kullanicilar (id) ON DELETE SET NULL,
  ders          text        NOT NULL,
  ad            text        NOT NULL CHECK (length(ad) BETWEEN 1 AND 100),
  yil_id        text        REFERENCES egitim_yillari (id) ON DELETE SET NULL,
  olusturma     timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX sinav_gruplari_ogretmen ON sinav_gruplari (ogretmen_id);

CREATE TABLE sinavlar (
  id            text        PRIMARY KEY,
  okul_id       text        NOT NULL REFERENCES okullar (id),
  grup_id       text        REFERENCES sinav_gruplari (id) ON DELETE CASCADE,  -- isteğe bağlı
  sablon_id     text        REFERENCES sinav_sablonlari (id) ON DELETE SET NULL,
  ogretmen_id   text        REFERENCES kullanicilar (id) ON DELETE SET NULL,
  ders          text        NOT NULL DEFAULT '',
  ad            text        NOT NULL CHECK (length(ad) BETWEEN 1 AND 100),
  tarih         date        NOT NULL DEFAULT CURRENT_DATE,
  agirlik       numeric(5,2) CHECK (agirlik > 0 AND agirlik <= 100),   -- yalnızca gruptaysa
  yil_id        text        REFERENCES egitim_yillari (id) ON DELETE SET NULL,
  olusturma     timestamptz NOT NULL DEFAULT now(),
  CHECK (grup_id IS NULL OR agirlik IS NOT NULL)
);
CREATE INDEX sinavlar_grup     ON sinavlar (grup_id) WHERE grup_id IS NOT NULL;
CREATE INDEX sinavlar_ogretmen ON sinavlar (ogretmen_id, tarih DESC);
CREATE INDEX sinavlar_sablon   ON sinavlar (sablon_id, tarih) WHERE sablon_id IS NOT NULL;

CREATE TABLE sinav_olcumleri (
  id            text        PRIMARY KEY,
  sinav_id      text        NOT NULL REFERENCES sinavlar (id) ON DELETE CASCADE,
  sira          smallint    NOT NULL,
  kod           text        NOT NULL,
  ad            text        NOT NULL,
  alt_sinir     numeric(12,3) NOT NULL,
  ust_sinir     numeric(12,3) NOT NULL,
  ana           boolean     NOT NULL DEFAULT false,
  UNIQUE (sinav_id, kod),
  CHECK (alt_sinir < ust_sinir)
);
CREATE UNIQUE INDEX sinav_olcumleri_tek_ana ON sinav_olcumleri (sinav_id) WHERE ana;

-- Bir öğrencinin bir ölçümdeki değeri (ör. Doğru Sayısı = 72, LGS = 490,161)
CREATE TABLE sinav_degerleri (
  olcum_id      text        NOT NULL REFERENCES sinav_olcumleri (id) ON DELETE CASCADE,
  ogrenci_id    text        NOT NULL REFERENCES kullanicilar (id) ON DELETE CASCADE,
  deger         numeric(12,3) NOT NULL CHECK (deger BETWEEN -10000 AND 10000),
  PRIMARY KEY (olcum_id, ogrenci_id)
);
CREATE INDEX sinav_degerleri_ogrenci ON sinav_degerleri (ogrenci_id);


-- -----------------------------------------------------------------------------
-- DEVAMSIZLIK
-- Bir öğrencinin bir dersteki bir günlük durumu. Yalnızca "var" dışındaki
-- durumlar yazılır; kaydı olmayan öğrenci derste sayılır.
-- -----------------------------------------------------------------------------
CREATE TABLE devamsizlik (
  id            text        PRIMARY KEY,
  okul_id       text        NOT NULL REFERENCES okullar (id),
  sinif_id      text        REFERENCES siniflar (id) ON DELETE SET NULL,
  ders_id       text        REFERENCES dersler (id) ON DELETE SET NULL,
  ogrenci_id    text        NOT NULL REFERENCES kullanicilar (id) ON DELETE CASCADE,
  tarih         date        NOT NULL,
  durum         text        NOT NULL CHECK (durum IN ('var', 'yok', 'gec', 'izinli')),
  aciklama      text        NOT NULL DEFAULT '',
  alan_id       text        REFERENCES kullanicilar (id) ON DELETE SET NULL,   -- yoklamayı alan
  yil_id        text        REFERENCES egitim_yillari (id) ON DELETE SET NULL,
  olusturma     timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX devamsizlik_ogrenci   ON devamsizlik (ogrenci_id, tarih DESC);
CREATE INDEX devamsizlik_ders_gun  ON devamsizlik (ders_id, tarih);
CREATE INDEX devamsizlik_okul_gun  ON devamsizlik (okul_id, tarih);


-- -----------------------------------------------------------------------------
-- MESAJLAR ve DUYURULAR
-- Bir mesajın birden çok alıcısı olur. Öğrenciye giden mesajın bir kopyası
-- velisine de gider; o satırda ogrenci_id "kimin için" olduğunu söyler.
-- -----------------------------------------------------------------------------
CREATE TABLE mesajlar (
  id            text        PRIMARY KEY,
  okul_id       text        NOT NULL REFERENCES okullar (id),
  gonderen_id   text        REFERENCES kullanicilar (id) ON DELETE SET NULL,
  tur           text        NOT NULL CHECK (tur IN ('mesaj', 'duyuru')),
  konu          text        NOT NULL CHECK (length(konu) BETWEEN 1 AND 120),
  govde         text        NOT NULL CHECK (length(govde) <= 4000),
  hedef_ozet    text        NOT NULL DEFAULT '',          -- "7-A velileri", "Tüm okul"
  tarih         timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX mesajlar_gonderen ON mesajlar (gonderen_id, tarih DESC);

CREATE TABLE mesaj_alicilari (
  id            bigint      GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  mesaj_id      text        NOT NULL REFERENCES mesajlar (id) ON DELETE CASCADE,
  alici_id      text        NOT NULL REFERENCES kullanicilar (id) ON DELETE CASCADE,
  ogrenci_id    text        REFERENCES kullanicilar (id) ON DELETE CASCADE,    -- veli kopyasıysa çocuk
  UNIQUE NULLS NOT DISTINCT (mesaj_id, alici_id, ogrenci_id)
);
CREATE INDEX mesaj_alicilari_alici ON mesaj_alicilari (alici_id);

-- Kim hangi mesajı ne zaman okudu
CREATE TABLE mesaj_okumalari (
  mesaj_id      text        NOT NULL REFERENCES mesajlar (id) ON DELETE CASCADE,
  kullanici_id  text        NOT NULL REFERENCES kullanicilar (id) ON DELETE CASCADE,
  tarih         timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (mesaj_id, kullanici_id)
);


-- -----------------------------------------------------------------------------
-- TAKVİM (okul etkinlikleri; resmî tatiller kodda hesaplanır)
-- -----------------------------------------------------------------------------
CREATE TABLE takvim_etkinlikleri (
  id            text        PRIMARY KEY,
  okul_id       text        NOT NULL REFERENCES okullar (id),
  tarih         date        NOT NULL,
  bitis         date,
  baslik        text        NOT NULL CHECK (length(baslik) BETWEEN 1 AND 120),
  tur           text        NOT NULL,
  aciklama      text        NOT NULL DEFAULT '',
  ekleyen_id    text        REFERENCES kullanicilar (id) ON DELETE SET NULL,
  yil_id        text        REFERENCES egitim_yillari (id) ON DELETE SET NULL,
  olusturma     timestamptz NOT NULL DEFAULT now(),
  CHECK (bitis IS NULL OR bitis >= tarih)
);
CREATE INDEX takvim_okul_tarih ON takvim_etkinlikleri (okul_id, tarih);


-- -----------------------------------------------------------------------------
-- BİLDİRİMLER, OTURUMLAR, HATIRLATMALAR, İŞLEM KAYDI
-- -----------------------------------------------------------------------------
CREATE TABLE bildirimler (
  id            text        PRIMARY KEY,
  kullanici_id  text        NOT NULL REFERENCES kullanicilar (id) ON DELETE CASCADE,
  metin         text        NOT NULL,
  baglanti      text        NOT NULL DEFAULT '',          -- tıklayınca gidilecek sayfa
  okundu        boolean     NOT NULL DEFAULT false,
  olusturma     timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX bildirimler_kullanici ON bildirimler (kullanici_id, olusturma DESC);

-- Oturum anahtarının kendisi değil SHA-256 özeti saklanır: veritabanı sızsa
-- bile açık oturumlar ele geçirilemez.
CREATE TABLE oturumlar (
  anahtar_ozeti text        PRIMARY KEY,
  kullanici_id  text        NOT NULL REFERENCES kullanicilar (id) ON DELETE CASCADE,
  olusturma     timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX oturumlar_kullanici ON oturumlar (kullanici_id);
CREATE INDEX oturumlar_olusturma ON oturumlar (olusturma);

-- Gönderilmiş otomatik hatırlatmalar: aynısı iki kez gitmesin.
CREATE TABLE hatirlatmalar (
  anahtar       text        PRIMARY KEY,                  -- "odev:<odev>:<ogrenci>"
  gonderilme    timestamptz NOT NULL DEFAULT now()
);

-- Kim, ne zaman, ne yaptı (müdür ve yönetici görür)
CREATE TABLE islem_kaydi (
  id            text        PRIMARY KEY,
  okul_id       text        REFERENCES okullar (id),
  kullanici_id  text        REFERENCES kullanicilar (id) ON DELETE SET NULL,
  kullanici_ad  text        NOT NULL DEFAULT '',          -- silinse de kimin yaptığı okunsun
  kullanici_rol text        NOT NULL DEFAULT '',
  islem         text        NOT NULL,
  detay         text        NOT NULL DEFAULT '',
  ip            inet,
  tarih         timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX islem_kaydi_okul_tarih ON islem_kaydi (okul_id, tarih DESC);
