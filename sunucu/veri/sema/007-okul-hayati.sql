-- =============================================================================
-- 007: yemek listesi, servisler, kulüpler
--
-- Yemek listesi: okulun günlük menüsü, bir güne bir kayıt. Okuldaki herkes
-- (veli çocuğunun okulununkini) görür; yetkisi olan düzenler.
--
-- Servis: okulun servis araçları ve hangi öğrencinin hangi serviste, hangi
-- durakta bindiği. Bir öğrenci tek serviste olur. Şoför ve rehber telefonu
-- yalnızca o servisteki öğrenciye, velisine ve okul yönetimine görünür.
--
-- Kulüp: danışman öğretmen, kontenjan, başvurunun açık olup olmadığı.
-- Kontenjan kulüp satırı kilitlenerek denetlenir (aynı anda gelen iki
-- katılma isteği kontenjanı aşamaz).
-- =============================================================================

CREATE TABLE yemek_listesi (
  okul_id       text        NOT NULL REFERENCES okullar (id) ON DELETE CASCADE,
  tarih         date        NOT NULL,
  menu          text        NOT NULL CHECK (length(menu) BETWEEN 1 AND 500),   -- her satır bir yemek
  kalori        smallint    CHECK (kalori BETWEEN 1 AND 5000),
  PRIMARY KEY (okul_id, tarih)
);

CREATE TABLE servisler (
  id            text        PRIMARY KEY,
  okul_id       text        NOT NULL REFERENCES okullar (id) ON DELETE CASCADE,
  ad            text        NOT NULL CHECK (length(ad) BETWEEN 1 AND 60),
  plaka         text        NOT NULL DEFAULT '' CHECK (length(plaka) <= 15),
  sofor         text        NOT NULL DEFAULT '' CHECK (length(sofor) <= 80),
  sofor_tel     text        NOT NULL DEFAULT '' CHECK (length(sofor_tel) <= 20),
  rehber        text        NOT NULL DEFAULT '' CHECK (length(rehber) <= 80),
  rehber_tel    text        NOT NULL DEFAULT '' CHECK (length(rehber_tel) <= 20),
  sabah         text        NOT NULL DEFAULT '' CHECK (sabah = '' OR sabah ~ '^[0-2][0-9]:[0-5][0-9]$'),
  aksam         text        NOT NULL DEFAULT '' CHECK (aksam = '' OR aksam ~ '^[0-2][0-9]:[0-5][0-9]$'),
  guzergah      text        NOT NULL DEFAULT '' CHECK (length(guzergah) <= 500),
  olusturma     timestamptz NOT NULL DEFAULT now(),
  UNIQUE (okul_id, ad)
);

CREATE TABLE servis_ogrencileri (
  ogrenci_id    text        PRIMARY KEY REFERENCES kullanicilar (id) ON DELETE CASCADE,
  servis_id     text        NOT NULL REFERENCES servisler (id) ON DELETE CASCADE,
  durak         text        NOT NULL DEFAULT '' CHECK (length(durak) <= 120)
);
CREATE INDEX servis_ogrencileri_servis ON servis_ogrencileri (servis_id);

CREATE TABLE kulupler (
  id            text        PRIMARY KEY,
  okul_id       text        NOT NULL REFERENCES okullar (id) ON DELETE CASCADE,
  ad            text        NOT NULL CHECK (length(ad) BETWEEN 1 AND 80),
  aciklama      text        NOT NULL DEFAULT '' CHECK (length(aciklama) <= 1000),
  danisman_id   text        REFERENCES kullanicilar (id) ON DELETE SET NULL,
  kontenjan     smallint    CHECK (kontenjan BETWEEN 1 AND 1000),        -- NULL: sınırsız
  basvuru_acik  boolean     NOT NULL DEFAULT true,
  gun_saat      text        NOT NULL DEFAULT '' CHECK (length(gun_saat) <= 60),  -- "Çarşamba 15.00"
  olusturma     timestamptz NOT NULL DEFAULT now(),
  UNIQUE (okul_id, ad)
);

CREATE TABLE kulup_uyeleri (
  kulup_id      text        NOT NULL REFERENCES kulupler (id) ON DELETE CASCADE,
  ogrenci_id    text        NOT NULL REFERENCES kullanicilar (id) ON DELETE CASCADE,
  tarih         timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (kulup_id, ogrenci_id)
);
CREATE INDEX kulup_uyeleri_ogrenci ON kulup_uyeleri (ogrenci_id);
