-- =============================================================================
-- 020: ekler (mesaja ve öğretmenin verdiği ödeve eklenen dosyalar)
--
--   Dosya seçilir seçilmez yüklenir: önce "taslak"tır (mesaj_id ve odev_id
--   boş), yalnızca yükleyen görür. Mesaj gönderilince ya da ödev kaydedilince
--   o mesaja/ödeve bağlanır. Bir mesajın ya da ödevin ekleri toplam 150 MB.
--   Dosya 7 gün sonra diskten silinir; satır "silindi" diye kalır ki mesajda
--   "süresi doldu" yazsın. Bağlanmayan taslak 6 saat sonra silinir.
--   Dosyanın kendisi data/ekler/<id> içindedir (sunucu/bolumler/ekler.js).
--
--   Öğrencinin ödev teslim dosyaları ayrı tabloda (008 odev_dosyalari); onlar
--   da 150 MB ve 7 gün kuralına uyar.
-- =============================================================================

CREATE TABLE ekler (
  id           text        PRIMARY KEY CHECK (id ~ '^[0-9a-f]{32}$'),   -- diskteki dosya adı
  yukleyen_id  text        NOT NULL REFERENCES kullanicilar (id) ON DELETE CASCADE,
  okul_id      text        REFERENCES okullar (id) ON DELETE CASCADE,
  tur          text        NOT NULL CHECK (tur IN ('mesaj', 'odev')),
  mesaj_id     text        REFERENCES mesajlar (id) ON DELETE CASCADE,
  odev_id      text        REFERENCES odevler (id) ON DELETE CASCADE,
  ad           text        NOT NULL CHECK (length(ad) BETWEEN 1 AND 150),
  boyut        bigint      NOT NULL CHECK (boyut > 0),
  sha256       text        NOT NULL CHECK (sha256 ~ '^[0-9a-f]{64}$'),
  yuklenme     timestamptz NOT NULL DEFAULT now(),
  bitis        timestamptz NOT NULL,
  silindi      boolean     NOT NULL DEFAULT false,
  CHECK (mesaj_id IS NULL OR odev_id IS NULL),
  CHECK ((tur = 'mesaj' AND odev_id IS NULL) OR (tur = 'odev' AND mesaj_id IS NULL))
);
CREATE INDEX ekler_mesaj ON ekler (mesaj_id) WHERE mesaj_id IS NOT NULL;
CREATE INDEX ekler_odev ON ekler (odev_id) WHERE odev_id IS NOT NULL;
CREATE INDEX ekler_taslak ON ekler (yukleyen_id) WHERE mesaj_id IS NULL AND odev_id IS NULL;
CREATE INDEX ekler_bitis ON ekler (bitis) WHERE NOT silindi;
