-- =============================================================================
-- 025: ödevin başlama saati
--
--   Öğretmen ödevi verirken başlama tarihinin yanında saatini de seçer
--   (K12net'teki gibi: Başlama Tarihi 08.09.2025 · 08:00, Son Tarih
--   15.09.2025 · 23:00). Eski ödevlerde boştur (yalnız gün yazılır).
-- =============================================================================

ALTER TABLE odevler ADD COLUMN baslangic_saati time;
