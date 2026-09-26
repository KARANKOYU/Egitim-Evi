-- =============================================================================
-- 023: hazır Öğretmen rolüne "Sınav oluşturur" ve "Öğrenci sonuçlarını görür"
--
--   "Sınav oluşturur" yetkisi sunucuda eskiden denetlenmiyordu: her öğretmen
--   sınav açabiliyordu. Artık denetleniyor. Öğretmenler sınav açmaya devam
--   etsin diye bu yetki okulların hazır Öğretmen rolüne eklenir; müdür
--   istemezse Roller ve Yetkiler sayfasından kapatır.
-- =============================================================================

INSERT INTO rol_yetkileri (rol_id, yetki)
SELECT id, 'sinav.olustur' FROM roller WHERE tur = 'ogretmen'
ON CONFLICT DO NOTHING;

-- Aynı zamanda yeni yetki "Girdiği sınıfların öğrenci sonuçlarını görür"
-- (Sınıflarım bölümü) hazır Öğretmen rolünde açık gelir; müdür kapatabilir.
INSERT INTO rol_yetkileri (rol_id, yetki)
SELECT id, 'ogretmen.sonuclar' FROM roller WHERE tur = 'ogretmen'
ON CONFLICT DO NOTHING;
