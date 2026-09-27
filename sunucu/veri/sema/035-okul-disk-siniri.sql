-- =============================================================================
-- 035: okul başına disk sınırı
--
--   Her okulun dosyaları (ödev teslim dosyaları, ödev ve mesaj ekleri, okul
--   sayfası fotoğrafları) kendi sınırına sayılır: bir diskin bölümleri gibi.
--   Sınırı yönetici okulu açarken verir (öneri: öğrenci sayısı × 10 MB, en az
--   2 GB) ve Okullar ekranında değiştirir.
--
--   disk_siniri_mb: okulun sınırı (MB). Boşsa (NULL) site ayarındaki
--   "Varsayılan okul disk sınırı" geçerlidir (site_ayarlari.okulDiskMb; o da
--   yoksa EE_OKUL_DOSYA_GB ya da 5 GB: sunucu/site.js). Bu dosyadan önce açılmış
--   okullar varsayılanla kalır. Sınır küçültülürse var olan dosya silinmez,
--   yalnız yeni yükleme durur.
--
--   Kullanım dosya kayıtlarından toplanır (dizin gezilmez): odev_dosyalari
--   (ödevin okulu), ekler (silinmemiş, okul_id) ve okul_fotolari. Eklerde
--   okula göre toplamak için indeks.
--
--   okul_dosya_uyarilari (033) aynı kalır; %80 ve "doldu" artık okulun kendi
--   sınırına göre hesaplanır ve bütün dosyaları sayar.
-- =============================================================================

ALTER TABLE okullar ADD COLUMN disk_siniri_mb integer
  CHECK (disk_siniri_mb IS NULL OR disk_siniri_mb BETWEEN 1 AND 10485760);   -- en çok 10 TB

CREATE INDEX ekler_okul ON ekler (okul_id) WHERE NOT silindi AND okul_id IS NOT NULL;
