-- =============================================================================
-- 017: öğrencinin ödevi yıldızlaması
--
--   Öğrenci önemli bulduğu ödevi yıldızlar, listeyi "yıldızlı" diye süzer.
--   Yıldız yalnızca öğrencinin kendisi içindir: öğretmen, müdür ve veli
--   görmez. Ödevi alan öğrencinin satırında durur; ödev ya da öğrenci
--   silinince kendiliğinden gider.
-- =============================================================================

ALTER TABLE odev_ogrencileri ADD COLUMN yildiz boolean NOT NULL DEFAULT false;
