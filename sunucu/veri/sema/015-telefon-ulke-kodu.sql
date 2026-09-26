-- =============================================================================
-- 015: telefon numaraları ülke koduyla
--
--   Telefon artık uluslararası biçimde (E.164) saklanır: "+905321234567".
--   Yurt dışındaki veli ya da servisçi de numarasını yazabilsin diye. Eski
--   "05321234567" biçimindeki numaralar Türkiye numarasıdır, +90'a çevrilir.
-- =============================================================================

ALTER TABLE kullanicilar DROP CONSTRAINT IF EXISTS kullanicilar_telefon_check;
UPDATE kullanicilar SET telefon = '+90' || substr(telefon, 2) WHERE telefon ~ '^0[0-9]{10}$';
ALTER TABLE kullanicilar ADD CONSTRAINT kullanicilar_telefon_check
  CHECK (telefon = '' OR telefon ~ '^\+[1-9][0-9]{6,14}$');

-- Servisteki şoför ve rehber telefonu (serbest yazılmış olabilir; yalnızca
-- Türkiye biçimindekiler çevrilir).
UPDATE servisler SET sofor_tel = '+90' || substr(sofor_tel, 2) WHERE sofor_tel ~ '^0[0-9]{10}$';
UPDATE servisler SET rehber_tel = '+90' || substr(rehber_tel, 2) WHERE rehber_tel ~ '^0[0-9]{10}$';
