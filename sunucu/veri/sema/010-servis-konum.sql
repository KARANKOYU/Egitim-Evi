-- =============================================================================
-- 010: servisçi, okul/ev konumu, sefer
--
--   * Okulun konumu (servis haritasında okul işareti) — müdür haritadan seçer.
--   * Servisin servisçisi (şoför hesabı, müdür açar).
--   * Öğrencinin ev konumu: öğrenci, velisi ya da okul yönetimi haritadan
--     işaretler. Yalnızca öğrencinin kendisi, velisi, o servisin servisçisi
--     ve okul yönetimi görür.
--   * Sefer: servisçi "sefere başla" deyince açılır, "bitir" deyince kapanır.
--     Aracın YALNIZCA son konumu tutulur; geçmiş iz saklanmaz. Konum yalnızca
--     açık seferde, o servisteki öğrencilere ve velilerine gösterilir.
--   * Yaklaşma bildirimi (500 m, 100 m) her seferde öğrenci başına bir kez.
-- =============================================================================

ALTER TABLE okullar
  ADD COLUMN enlem double precision CHECK (enlem BETWEEN -90 AND 90),
  ADD COLUMN boylam double precision CHECK (boylam BETWEEN -180 AND 180);

ALTER TABLE servisler ADD COLUMN sofor_id text REFERENCES kullanicilar (id) ON DELETE SET NULL;
CREATE INDEX servisler_sofor ON servisler (sofor_id) WHERE sofor_id IS NOT NULL;

CREATE TABLE ogrenci_konumlari (
  ogrenci_id    text             PRIMARY KEY REFERENCES kullanicilar (id) ON DELETE CASCADE,
  enlem         double precision NOT NULL CHECK (enlem BETWEEN -90 AND 90),
  boylam        double precision NOT NULL CHECK (boylam BETWEEN -180 AND 180),
  giren_id      text             REFERENCES kullanicilar (id) ON DELETE SET NULL,
  guncelleme    timestamptz      NOT NULL DEFAULT now()
);

CREATE TABLE servis_seferleri (
  id            text             PRIMARY KEY,
  servis_id     text             NOT NULL REFERENCES servisler (id) ON DELETE CASCADE,
  sofor_id      text             REFERENCES kullanicilar (id) ON DELETE SET NULL,
  yon           text             NOT NULL CHECK (yon IN ('gidis', 'donus')),
  baslangic     timestamptz      NOT NULL DEFAULT now(),
  bitis         timestamptz,
  son_enlem     double precision CHECK (son_enlem BETWEEN -90 AND 90),
  son_boylam    double precision CHECK (son_boylam BETWEEN -180 AND 180),
  son_dogruluk  real,
  son_konum     timestamptz
);
-- Bir serviste aynı anda tek açık sefer
CREATE UNIQUE INDEX servis_seferleri_tek_acik ON servis_seferleri (servis_id) WHERE bitis IS NULL;

CREATE TABLE sefer_bildirimleri (
  sefer_id      text        NOT NULL REFERENCES servis_seferleri (id) ON DELETE CASCADE,
  ogrenci_id    text        NOT NULL REFERENCES kullanicilar (id) ON DELETE CASCADE,
  esik          smallint    NOT NULL,
  tarih         timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (sefer_id, ogrenci_id, esik)
);
