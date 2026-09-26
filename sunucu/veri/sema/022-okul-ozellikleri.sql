-- =============================================================================
-- 022: okulun kapattığı özellikler
--
--   Müdür "Özellikler" sayfasından okulunda kullanmadığı bölümleri kapatır:
--   ödevler, sınavlar, devamsızlık, etüt, servis, yemek listesi, kulüpler,
--   anketler. Kapalı bölüm o okuldaki herkesin menüsünden kalkar, sunucu da
--   o bölümün isteklerini reddeder. Kayıtlar silinmez: yeniden açılınca
--   eskisi gibi görünür.
--
--   Satır yoksa özellik açıktır (yeni okulda her şey açık).
-- =============================================================================

CREATE TABLE okul_kapali_ozellikler (
  okul_id     text        NOT NULL REFERENCES okullar (id) ON DELETE CASCADE,
  ozellik     text        NOT NULL CHECK (ozellik IN ('odev', 'sinav', 'devamsizlik', 'etut', 'servis', 'yemek', 'kulup', 'anket')),
  kapatan_id  text        REFERENCES kullanicilar (id) ON DELETE SET NULL,
  kapanma     timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (okul_id, ozellik)
);
