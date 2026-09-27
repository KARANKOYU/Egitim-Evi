-- =============================================================================
-- 033: ödeve dosya yükleme izni ve okulun dosya alanı uyarısı
--
--   Öğretmen ödevi verirken (ve Ödevi düzenle'de) "Öğrenciler bu ödeve dosya
--   yükleyebilsin" kutusunu işaretler; yeni ödevde varsayılan KAPALI. Kapalıysa
--   öğrenci teslim dosyası yükleyemez; önceden yüklenmiş dosyalar silinmez,
--   yalnız yeni yükleme durur. Quiz bundan bağımsızdır.
--
--   Bu dosyadan önce verilmiş ödevlerde izin AÇIK kalır (canlıdaki ödevlerin
--   davranışı değişmesin): sütun önce true varsayılanıyla eklenir (var olan
--   satırlar true olur), sonra yeni satırlar için varsayılan false yapılır.
--
--   Teslim dosyasının silinme zamanı yüklemeye değil ödeve bağlıdır ve her
--   seferinde ödevden hesaplanır (sunucu/veri/depo/odev-dosyalari.js SILINME);
--   ayrı sütun yoktur. Son teslim ileri alınınca ya da ödev yeniden açılınca
--   kendiliğinden yeniden hesaplanır.
--
--   okul_dosya_uyarilari: okulun teslim dosyası alanı (EE_OKUL_DOSYA_GB) %80'i
--   geçince ve dolunca müdüre ve sistem yöneticisine birer kez bildirim gitsin
--   diye hangi uyarının verildiği. Kullanım %70'in altına inince satır silinir
--   (alan yeniden dolarsa uyarı yeniden gider). Yedeğe girmez; okul silinince
--   ya da içeri aktarımda (TRUNCATE okullar CASCADE) kendiliğinden gider.
-- =============================================================================

ALTER TABLE odevler ADD COLUMN dosya_yukleme boolean NOT NULL DEFAULT true;
ALTER TABLE odevler ALTER COLUMN dosya_yukleme SET DEFAULT false;

CREATE TABLE okul_dosya_uyarilari (
  okul_id  text        PRIMARY KEY REFERENCES okullar (id) ON DELETE CASCADE,
  seviye   smallint    NOT NULL CHECK (seviye IN (80, 100)),   -- %80 uyarısı ya da "doldu"
  zaman    timestamptz NOT NULL DEFAULT now()
);
