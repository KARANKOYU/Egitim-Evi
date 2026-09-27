-- =============================================================================
-- 034: teslim dosyalarının en erken silinme anı
--
--   Teslim dosyasının silinme anı ödevden hesaplanır (033; son teslim + 7 gün,
--   son teslimsiz ödevde sonuçlanma + 7 gün ya da yüklemeden 60 gün). Öğretmen
--   son teslimi yanlışlıkla geçmişe yazarsa (yılı 2025 gibi) bu an da geçmişte
--   kalır ve saatlik temizlik bütün öğrencilerin dosyalarını uyarısız, geri
--   dönüşsüz silerdi; tarih sonra düzeltilse de dosyalar geri gelmez.
--
--   dosya_saklama: bu ödevin teslim dosyaları bu andan önce silinmez. Son teslim
--   (gün ya da saat) değiştirilince, kaldırılınca ya da ödev yeniden açılınca
--   "şimdi + 7 gün"e çekilir (daha geçse değişmez). Silinme anı hesaptaki an ile
--   bu andan geç olanıdır (sunucu/veri/depo/odev-dosyalari.js SILINME). Boşsa
--   (ödev hiç düzenlenmediyse) yalnızca hesaptaki an geçerlidir.
-- =============================================================================

ALTER TABLE odevler ADD COLUMN dosya_saklama timestamptz;
