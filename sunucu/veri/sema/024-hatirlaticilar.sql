-- =============================================================================
-- 024: kişisel hatırlatıcılar
--
--   Her kullanıcı (öğrenci, veli, öğretmen, müdür, servisçi) kendine
--   hatırlatıcı kurar: başlık, açıklama ve sıklık. Zamanı gelince bildirim
--   (ve telefon bildirimi) gider. Saatler Türkiye saatidir.
--     bir-kez   : belli bir gün ve saat (tarih)
--     her-gun   : her gün aynı saat
--     her-hafta : seçilen günler (hatirlatici_gunleri: 1 Pazartesi ... 7 Pazar)
--     her-ay    : ayın belli günü (ay_gunu; kısa ayda ayın son günü)
-- =============================================================================

CREATE TABLE hatirlaticilar (
  id            text        PRIMARY KEY,
  kullanici_id  text        NOT NULL REFERENCES kullanicilar (id) ON DELETE CASCADE,
  baslik        text        NOT NULL CHECK (length(baslik) BETWEEN 1 AND 120),
  aciklama      text        NOT NULL DEFAULT '' CHECK (length(aciklama) <= 1000),
  siklik        text        NOT NULL CHECK (siklik IN ('bir-kez', 'her-gun', 'her-hafta', 'her-ay')),
  tarih         date,
  saat          time        NOT NULL,
  ay_gunu       smallint    CHECK (ay_gunu BETWEEN 1 AND 31),
  aktif         boolean     NOT NULL DEFAULT true,
  son_gonderim  timestamptz,
  olusturma     timestamptz NOT NULL DEFAULT now(),
  CHECK (siklik <> 'bir-kez' OR tarih IS NOT NULL),
  CHECK (siklik <> 'her-ay' OR ay_gunu IS NOT NULL)
);
CREATE INDEX hatirlaticilar_kisi ON hatirlaticilar (kullanici_id, olusturma);
CREATE INDEX hatirlaticilar_aktif ON hatirlaticilar (id) WHERE aktif;

CREATE TABLE hatirlatici_gunleri (
  hatirlatici_id  text      NOT NULL REFERENCES hatirlaticilar (id) ON DELETE CASCADE,
  gun             smallint  NOT NULL CHECK (gun BETWEEN 1 AND 7),
  PRIMARY KEY (hatirlatici_id, gun)
);
