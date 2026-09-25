-- =============================================================================
-- 003: kullanıcı adı, rolsüz kayıt, T.C. kimlik no, kolay veli kodu
--
--   * Herkesin bir kullanıcı adı var; girişte e-posta ya da kullanıcı adı
--     yazılabilir. Mevcut hesaplara e-postanın @ öncesinden türetilir
--     (çakışırsa sonuna sayı eklenir).
--   * Kayıt olan kişinin rolü yoktur (NULL); okul onu öğretmen ya da öğrenci
--     olarak ekler, veli kodunu giren veli olur, müdür başvurusu yapan müdür.
--   * Okulun açtığı hesapta e-posta olmayabilir (küçük öğrenciler).
--   * T.C. kimlik no isteğe bağlı; girilmişse iki hesapta aynı olamaz.
--   * Veli kodları büyük harf + rakam, 10 karakter olarak yeniden üretilir
--     (eskisinde büyük/küçük harf ve işaretler karışıktı).
-- =============================================================================

ALTER TABLE kullanicilar ADD COLUMN kullanici_adi text;

DO $$
DECLARE
  r record;
  kok text;
  aday text;
  n int;
BEGIN
  FOR r IN SELECT id, eposta FROM kullanicilar ORDER BY olusturma, id LOOP
    kok := regexp_replace(lower(split_part(r.eposta, '@', 1)), '[^a-z0-9._]', '', 'g');
    kok := regexp_replace(kok, '^[^a-z]+', '');
    IF length(kok) < 3 THEN kok := 'kullanici' || kok; END IF;
    kok := left(kok, 24);
    aday := kok;
    n := 1;
    WHILE EXISTS (SELECT 1 FROM kullanicilar WHERE kullanici_adi = aday) LOOP
      n := n + 1;
      aday := kok || n;
    END LOOP;
    UPDATE kullanicilar SET kullanici_adi = aday WHERE id = r.id;
  END LOOP;
END $$;

ALTER TABLE kullanicilar ALTER COLUMN kullanici_adi SET NOT NULL;
ALTER TABLE kullanicilar ADD CONSTRAINT kullanici_adi_bicimi
  CHECK (kullanici_adi ~ '^[a-z][a-z0-9._]{2,29}$');
CREATE UNIQUE INDEX kullanicilar_kullanici_adi ON kullanicilar (kullanici_adi);

-- Rolsüz hesap ve e-postasız hesap
ALTER TABLE kullanicilar ALTER COLUMN rol DROP NOT NULL;
ALTER TABLE kullanicilar ALTER COLUMN eposta DROP NOT NULL;

-- T.C. kimlik no: 11 hane, 0 ile başlamaz (algoritma denetimi uygulamada)
ALTER TABLE kullanicilar ADD COLUMN tc_kimlik text
  CHECK (tc_kimlik IS NULL OR tc_kimlik ~ '^[1-9][0-9]{10}$');
CREATE UNIQUE INDEX kullanicilar_tc_kimlik ON kullanicilar (tc_kimlik) WHERE tc_kimlik IS NOT NULL;

-- Veli kodları: yeni biçimde, güçlü rastgele (gen_random_uuid) ile üretilir.
-- 32 harflik alfabede her bayt mod 32 eşit dağılır. UUID'nin 6. ve 8.
-- baytında sürüm bitleri sabit olduğu için o baytlar kullanılmaz.
DO $$
DECLARE
  r record;
  h text;
  kod text;
  b int;
  alfabe constant text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
BEGIN
  FOR r IN SELECT id FROM kullanicilar WHERE rol = 'student' ORDER BY id LOOP
    LOOP
      h := replace(gen_random_uuid()::text, '-', '');
      kod := '';
      FOREACH b IN ARRAY ARRAY[0, 1, 2, 3, 4, 5, 7, 9, 10, 11] LOOP
        kod := kod || substr(alfabe, (('x' || substr(h, b * 2 + 1, 2))::bit(8)::int % 32) + 1, 1);
      END LOOP;
      EXIT WHEN NOT EXISTS (SELECT 1 FROM kullanicilar WHERE veli_kodu = kod);
    END LOOP;
    UPDATE kullanicilar SET veli_kodu = kod WHERE id = r.id;
  END LOOP;
END $$;
