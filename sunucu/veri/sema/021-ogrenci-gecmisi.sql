-- =============================================================================
-- 021: öğrenci hesabı kişiye ait (nakil) ve öğrencinin geçmiş okulları
--
--   Öğrenci hesabı okula değil kişiye aittir: T.C. kimlik no bütün sistemde
--   tek öğrencidedir. Başka okul aynı T.C. ile öğrenci eklemek isterse doğum
--   tarihi de eşleşirse hesap o okula taşınır (nakil); eşleşmezse eklenemez.
--   Eski okulun ödevleri, notları ve devamsızlığı o okulun kaydı olarak kalır:
--   yeni okul görmez; öğrenci ve velisi eğitim yılı seçicisinde
--   "2025-2026 · Eski Okul · 6-A" diye seçip görür (salt okunur).
--
--   ogrenci_gecmisi: taşınırken eski okulun her eğitim yılı için bir satır
--     (okulda yıl tanımlı değilse yil_id boş tek satır). Adlar o anki hâliyle
--     saklanır: eski okul adını değiştirse de öğrencinin geçmişi değişmez.
--   kullanicilar.secili_gecmis: kişinin baktığı geçmiş dönem (yoksa boş).
-- =============================================================================

CREATE TABLE ogrenci_gecmisi (
  id          text        PRIMARY KEY,
  ogrenci_id  text        NOT NULL REFERENCES kullanicilar (id) ON DELETE CASCADE,
  okul_id     text        NOT NULL REFERENCES okullar (id) ON DELETE CASCADE,
  yil_id      text        REFERENCES egitim_yillari (id) ON DELETE CASCADE,
  okul_adi    text        NOT NULL,
  yil_adi     text        NOT NULL DEFAULT '',
  sinif_adi   text        NOT NULL DEFAULT '',
  ayrilis     timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX ogrenci_gecmisi_tekil ON ogrenci_gecmisi (ogrenci_id, okul_id, COALESCE(yil_id, ''));

ALTER TABLE kullanicilar ADD COLUMN secili_gecmis text REFERENCES ogrenci_gecmisi (id) ON DELETE SET NULL;

-- T.C. bütün sistemde tek öğrencide. Eskiden aynı T.C. iki okulda açılmış
-- olabilir: öyleyse indeks kurulmaz (uygulama yine denetler), uyarı yazılır.
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM kullanicilar WHERE rol = 'student' AND tc_kimlik IS NOT NULL
                 GROUP BY tc_kimlik HAVING count(*) > 1) THEN
    CREATE UNIQUE INDEX kullanicilar_tc_ogrenci ON kullanicilar (tc_kimlik) WHERE tc_kimlik IS NOT NULL AND rol = 'student';
  ELSE
    RAISE NOTICE 'Aynı T.C. kimlik no ile birden çok öğrenci var; tekil indeks kurulmadı.';
  END IF;
END $$;
