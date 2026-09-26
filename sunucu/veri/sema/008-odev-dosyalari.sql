-- =============================================================================
-- 008: ödev teslim dosyaları
--
-- Öğrenci ödevine dosya yükler (fotoğraf, PDF, sunum, video...). Dosyanın
-- kendisi diskte, public klasörünün DIŞINDA (data/dosyalar) rastgele bir adla
-- durur; adresi tahmin edilemez ve doğrudan açılamaz, yalnızca yetki
-- denetimi yapan uçtan indirilir. Burada yalnızca bilgisi tutulur.
--
-- Satır, ödevin öğrenci listesine bağlı: öğrenci ödevden çıkarılırsa ya da
-- ödev silinirse kayıtları da silinir (diskteki artıklar periyodik temizlikte
-- kaldırılır).
-- =============================================================================

CREATE TABLE odev_dosyalari (
  id            text        PRIMARY KEY CHECK (id ~ '^[0-9a-f]{32}$'),   -- diskteki dosya adı
  odev_id       text        NOT NULL,
  ogrenci_id    text        NOT NULL,
  ad            text        NOT NULL CHECK (length(ad) BETWEEN 1 AND 150),
  boyut         bigint      NOT NULL CHECK (boyut > 0),
  crc32         bigint      NOT NULL,
  sha256        text        NOT NULL CHECK (sha256 ~ '^[0-9a-f]{64}$'),
  yuklenme      timestamptz NOT NULL DEFAULT now(),
  FOREIGN KEY (odev_id, ogrenci_id) REFERENCES odev_ogrencileri (odev_id, ogrenci_id) ON DELETE CASCADE
);
CREATE INDEX odev_dosyalari_odev ON odev_dosyalari (odev_id, ogrenci_id);
