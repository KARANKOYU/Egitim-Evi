-- =============================================================================
-- 028: servis yoklaması, okulun servis saatleri, sıra, notlar; tek uygulamanın
--      cihaz anahtarı ve 30 günlük uygulama oturumu
--
--   * Servis saatleri okul düzeyindedir: sabah ve akşam aralığı ('SS:DD',
--     Türkiye saati). Veli canlı bilgiyi (aracın yeri, bugünkü durum, sıra)
--     yalnız bu aralıkta ya da açık sefer sürerken görür; servisçi yoklamayı
--     ve seferi yalnız bu aralıkta açar. Varsayılan 07:00-09:20 / 16:30-19:00.
--     "En az 30 dakika" kuralı uygulamada denetlenir.
--   * Servisteki öğrencinin sabah alma ve akşam bırakma sırası. Mevcut
--     öğrencilere ad sırasıyla numara verilir; yeni öğrenci sona eklenir.
--   * Günlük yoklama: sabah bindi / binmedi; akşam geldi / gelmedi, sonra indi.
--     servis_gunleri o günün seferinin ne zaman başladığını ve bittiğini
--     ("Okula vardık", akşam herkes inince) tutar.
--   * servis_olaylari: veliye giden yoklama bildiriminin bir kez gitmesi için.
--   * Servisçinin tarihli notu (öğrenciye ya da bütün servise) ve velinin
--     "binmeyecek" işareti (sabah, akşam ya da ikisi, kısa notla).
--   * Yoklama, olaylar, notlar ve işaretler 30 gün sonra silinir.
--   * Cihaz anahtarı: telefon uygulaması girişten sonra bir kez alır; yalnız
--     bildirim yoklamaya ve servisçinin sefer konumunu göndermeye yarar, hesaba
--     giriş vermez. Anahtarın kendisi değil SHA-256 özeti saklanır. Anahtar
--     yetişkinin ana hesabına (ya da öğrenci / servisçi hesabına) aittir.
--   * Uygulamadan açılan oturum 30 gün, tarayıcıdaki oturum 7 gün geçerlidir.
-- =============================================================================

ALTER TABLE okullar
  ADD COLUMN servis_sabah_bas text NOT NULL DEFAULT '07:00',
  ADD COLUMN servis_sabah_bit text NOT NULL DEFAULT '09:20',
  ADD COLUMN servis_aksam_bas text NOT NULL DEFAULT '16:30',
  ADD COLUMN servis_aksam_bit text NOT NULL DEFAULT '19:00';
ALTER TABLE okullar ADD CONSTRAINT okullar_servis_saat_bicimi CHECK (
  servis_sabah_bas ~ '^([01][0-9]|2[0-3]):[0-5][0-9]$' AND servis_sabah_bit ~ '^([01][0-9]|2[0-3]):[0-5][0-9]$' AND
  servis_aksam_bas ~ '^([01][0-9]|2[0-3]):[0-5][0-9]$' AND servis_aksam_bit ~ '^([01][0-9]|2[0-3]):[0-5][0-9]$');
ALTER TABLE okullar ADD CONSTRAINT okullar_servis_saat_sirasi CHECK (
  servis_sabah_bas < servis_sabah_bit AND servis_sabah_bit <= servis_aksam_bas AND servis_aksam_bas < servis_aksam_bit);

ALTER TABLE servis_ogrencileri
  ADD COLUMN sira_sabah smallint CHECK (sira_sabah >= 1),
  ADD COLUMN sira_aksam smallint CHECK (sira_aksam >= 1);

-- Mevcut öğrencilere servis içinde ad sırasıyla numara.
UPDATE servis_ogrencileri so SET sira_sabah = x.n, sira_aksam = x.n
  FROM (SELECT s2.ogrenci_id, row_number() OVER (PARTITION BY s2.servis_id ORDER BY k.ad_soyad, s2.ogrenci_id) AS n
          FROM servis_ogrencileri s2 JOIN kullanicilar k ON k.id = s2.ogrenci_id) x
  WHERE x.ogrenci_id = so.ogrenci_id;

CREATE TABLE servis_yoklamalari (
  tarih         date        NOT NULL,
  donem         text        NOT NULL CHECK (donem IN ('sabah', 'aksam')),
  ogrenci_id    text        NOT NULL REFERENCES kullanicilar (id) ON DELETE CASCADE,
  servis_id     text        NOT NULL REFERENCES servisler (id) ON DELETE CASCADE,
  durum         text        NOT NULL CHECK ((donem = 'sabah' AND durum IN ('bindi', 'binmedi')) OR
                                            (donem = 'aksam' AND durum IN ('geldi', 'gelmedi', 'indi'))),
  bindi_zaman   timestamptz,          -- sabah: servise bindi; akşam: okulda servise bindi (geldi)
  indi_zaman    timestamptz,          -- akşam: eve bırakıldı
  alan_id       text        REFERENCES kullanicilar (id) ON DELETE SET NULL,
  guncelleme    timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (tarih, donem, ogrenci_id)
);
CREATE INDEX servis_yoklamalari_servis ON servis_yoklamalari (servis_id, tarih, donem);

CREATE TABLE servis_gunleri (
  servis_id     text        NOT NULL REFERENCES servisler (id) ON DELETE CASCADE,
  tarih         date        NOT NULL,
  donem         text        NOT NULL CHECK (donem IN ('sabah', 'aksam')),
  basladi       timestamptz,          -- sefer başladı (sabah ilk "Bindi" ya da "Seferi başlat"; akşam "Başlat")
  bitti         timestamptz,          -- sabah "Okula vardık"; akşam son öğrenci indi
  PRIMARY KEY (servis_id, tarih, donem)
);

CREATE TABLE servis_olaylari (
  tarih         date        NOT NULL,
  donem         text        NOT NULL CHECK (donem IN ('sabah', 'aksam')),
  ogrenci_id    text        NOT NULL REFERENCES kullanicilar (id) ON DELETE CASCADE,
  olay          text        NOT NULL CHECK (olay IN ('bindi', 'binmedi', 'vardi', 'geldi', 'gelmedi', 'indi', 'duzeltme')),
  gonderilme    timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (tarih, donem, ogrenci_id, olay)
);

CREATE TABLE servis_notlari (
  id            text        PRIMARY KEY,
  servis_id     text        NOT NULL REFERENCES servisler (id) ON DELETE CASCADE,
  ogrenci_id    text        REFERENCES kullanicilar (id) ON DELETE CASCADE,   -- NULL: bütün servise
  tarih         date        NOT NULL,
  metin         text        NOT NULL CHECK (length(metin) BETWEEN 1 AND 200),
  yazan_id      text        REFERENCES kullanicilar (id) ON DELETE SET NULL,
  olusturma     timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX servis_notlari_servis ON servis_notlari (servis_id, tarih);
CREATE INDEX servis_notlari_ogrenci ON servis_notlari (ogrenci_id) WHERE ogrenci_id IS NOT NULL;

CREATE TABLE servis_binmeyecek (
  ogrenci_id    text        NOT NULL REFERENCES kullanicilar (id) ON DELETE CASCADE,
  tarih         date        NOT NULL,
  sabah         boolean     NOT NULL DEFAULT false,
  aksam         boolean     NOT NULL DEFAULT false,
  aciklama      text        NOT NULL DEFAULT '' CHECK (length(aciklama) <= 200),
  yazan_id      text        REFERENCES kullanicilar (id) ON DELETE SET NULL,
  guncelleme    timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (ogrenci_id, tarih),
  CHECK (sabah OR aksam)
);

CREATE TABLE cihaz_anahtarlari (
  id            text        PRIMARY KEY,
  kullanici_id  text        NOT NULL REFERENCES kullanicilar (id) ON DELETE CASCADE,
  anahtar_ozeti text        NOT NULL UNIQUE CHECK (length(anahtar_ozeti) = 64),
  ad            text        NOT NULL DEFAULT '' CHECK (length(ad) <= 80),
  platform      text        NOT NULL DEFAULT '' CHECK (length(platform) <= 20),
  surum         text        NOT NULL DEFAULT '' CHECK (length(surum) <= 20),
  olusturma     timestamptz NOT NULL DEFAULT now(),
  son_gorulme   timestamptz,
  son_bildirim  text        NOT NULL DEFAULT '' CHECK (length(son_bildirim) <= 200)   -- son verilen imleç
);
CREATE INDEX cihaz_anahtarlari_kullanici ON cihaz_anahtarlari (kullanici_id);

ALTER TABLE oturumlar ADD COLUMN uygulama boolean NOT NULL DEFAULT false;
