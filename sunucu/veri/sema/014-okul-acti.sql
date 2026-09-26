-- =============================================================================
-- 014: "hesabı okul açtı" bilgisi kendi sütununda
--
--   Öğrenci ve servisçi hesabını okul açar; böyle bir hesapta T.C. numarasını
--   ve e-postayı okul yönetimi düzenler. Bu bilgi eskiden hesabı açan kişinin
--   kimliğinden (olusturan_id) çıkarılıyordu. Açan kişi (ör. okuldan ayrılan
--   öğretmenin rol satırı) silinince o sütun boşalıyor, hesap "kendisi
--   kaydolmuş" sayılıyordu. Artık ayrı ve silinmeyen bir işaret var.
-- =============================================================================

ALTER TABLE kullanicilar ADD COLUMN okul_acti boolean NOT NULL DEFAULT false;
UPDATE kullanicilar SET okul_acti = true WHERE olusturan_id IS NOT NULL;
