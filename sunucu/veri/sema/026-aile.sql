-- =============================================================================
-- 026: Eğitim Evi Aile (çocuğun telefonu)
--
--   Öğrencinin telefonundaki uygulama (ayrı depo: KARANKOYU/Egitim-Evi-App)
--   velinin seçtiği aralıkla konumu ve uygulama kullanım sürelerini gönderir.
--   Yalnızca öğrenciye bağlı onaylı veliler görür; okul (müdür, öğretmen)
--   görmez. Konumlar ve kullanım 7 gün sonra silinir. Uygulama kapatma ya da
--   kilitleme yoktur; sınır aşılınca veliye bildirim gider.
--
--   Cihaz, öğrenci hesabıyla bir kez bağlanır ve kendi anahtarını alır. Anahtar
--   yalnızca bu tablolara yazmaya yarar, hesaba giriş vermez; veritabanında
--   yalnızca özeti (SHA-256) tutulur.
-- =============================================================================

CREATE TABLE aile_cihazlari (
  id             text        PRIMARY KEY,
  ogrenci_id     text        NOT NULL REFERENCES kullanicilar (id) ON DELETE CASCADE,
  anahtar_ozeti  text        NOT NULL UNIQUE CHECK (length(anahtar_ozeti) = 64),
  ad             text        NOT NULL DEFAULT '' CHECK (length(ad) <= 80),
  platform       text        NOT NULL DEFAULT 'android' CHECK (length(platform) <= 20),
  surum          text        NOT NULL DEFAULT '' CHECK (length(surum) <= 20),
  son_gorulme    timestamptz,
  olusturma      timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX aile_cihazlari_ogrenci ON aile_cihazlari (ogrenci_id);

CREATE TABLE aile_konumlari (
  id             bigserial   PRIMARY KEY,
  ogrenci_id     text        NOT NULL REFERENCES kullanicilar (id) ON DELETE CASCADE,
  cihaz_id       text        REFERENCES aile_cihazlari (id) ON DELETE SET NULL,
  enlem          double precision NOT NULL CHECK (enlem BETWEEN -90 AND 90),
  boylam         double precision NOT NULL CHECK (boylam BETWEEN -180 AND 180),
  dogruluk       integer     CHECK (dogruluk IS NULL OR dogruluk BETWEEN 0 AND 100000),
  ag             text        NOT NULL DEFAULT '' CHECK (ag IN ('', 'wifi', 'mobil')),
  pil            smallint    CHECK (pil IS NULL OR pil BETWEEN 0 AND 100),
  zaman          timestamptz NOT NULL,
  UNIQUE (ogrenci_id, zaman)
);
CREATE INDEX aile_konumlari_ogrenci_zaman ON aile_konumlari (ogrenci_id, zaman DESC);

-- Günlük uygulama süreleri (Türkiye günü); aynı gün yeniden gelince üzerine yazılır.
CREATE TABLE aile_kullanim (
  ogrenci_id     text        NOT NULL REFERENCES kullanicilar (id) ON DELETE CASCADE,
  gun            date        NOT NULL,
  paket          text        NOT NULL CHECK (length(paket) BETWEEN 1 AND 200),
  ad             text        NOT NULL CHECK (length(ad) BETWEEN 1 AND 100),
  dakika         integer     NOT NULL CHECK (dakika BETWEEN 0 AND 1440),
  PRIMARY KEY (ogrenci_id, gun, paket)
);

-- Velinin seçtikleri (çocuk başına; birden çok veli aynı ayarı paylaşır).
CREATE TABLE aile_ayarlari (
  ogrenci_id     text        PRIMARY KEY REFERENCES kullanicilar (id) ON DELETE CASCADE,
  wifi_dk        smallint    NOT NULL DEFAULT 5 CHECK (wifi_dk IN (1, 5, 10, 15, 30, 60)),
  mobil_dk       smallint    NOT NULL DEFAULT 15 CHECK (mobil_dk IN (1, 5, 10, 15, 30, 60)),
  konum_acik     boolean     NOT NULL DEFAULT true,
  kullanim_acik  boolean     NOT NULL DEFAULT true,
  toplam_sinir   smallint    CHECK (toplam_sinir IS NULL OR toplam_sinir BETWEEN 5 AND 1440),
  guncelleyen    text        REFERENCES kullanicilar (id) ON DELETE SET NULL,
  guncelleme     timestamptz NOT NULL DEFAULT now()
);

-- Uygulama başına günlük sınır (dakika).
CREATE TABLE aile_sinirlari (
  ogrenci_id     text        NOT NULL REFERENCES kullanicilar (id) ON DELETE CASCADE,
  paket          text        NOT NULL CHECK (length(paket) BETWEEN 1 AND 200),
  ad             text        NOT NULL CHECK (length(ad) BETWEEN 1 AND 100),
  dakika         smallint    NOT NULL CHECK (dakika BETWEEN 5 AND 1440),
  PRIMARY KEY (ogrenci_id, paket)
);

-- Sınır aşımı bildirimi günde bir kez: anahtar 'toplam' ya da uygulamanın paketi.
CREATE TABLE aile_uyarilari (
  ogrenci_id     text        NOT NULL REFERENCES kullanicilar (id) ON DELETE CASCADE,
  gun            date        NOT NULL,
  anahtar        text        NOT NULL,
  PRIMARY KEY (ogrenci_id, gun, anahtar)
);
