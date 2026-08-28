-- =============================================================================
-- 002: hız indeksleri
--
-- Bir yıllık, 720 öğrencilik bir okulla yapılan yük testinde (araclar/yuk-testi.js)
-- bu sorgular tablonun tamamını tarıyordu:
--
--   * Müdürün "Ders ödevleri" ekranı ödevleri sınıftan buluyor
--     (odev_siniflari.sinif_id); birincil anahtar (odev_id, sinif_id)
--     sırasında olduğu için sınıftan aramada işe yaramıyordu.
--   * Takvim, ayın içinde biten ödevleri okula göre arıyor
--     (okul_id + bitis).
--   * Hatırlatma işaretleri 30 günden eskiyse siliniyor (gonderilme).
-- =============================================================================

CREATE INDEX odev_siniflari_sinif ON odev_siniflari (sinif_id);
CREATE INDEX odevler_okul_bitis   ON odevler (okul_id, bitis);
CREATE INDEX hatirlatmalar_zaman  ON hatirlatmalar (gonderilme);
