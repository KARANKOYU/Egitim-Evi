-- =============================================================================
-- 012: yetişkin hesabı ve okul rolleri
--
--   * Kendisi kaydolan tek tür hesap vardır: yetişkin hesabı (veli, öğretmen,
--     müdür adayı). Girişi bu hesap yapar: kullanıcı adı ya da e-posta, şifre,
--     e-postaya giden kod.
--   * Bir yetişkin birden çok okulda rol alabilir: A okulunda öğretmen, B
--     okulunda müdür. Her okul rolü ayrı bir kullanıcı satırıdır ve yetişkin
--     hesabına bağlıdır (ana_hesap_id). Oturum her zaman seçilen satırla açılır;
--     ödev, ders, yetki, mesaj kayıtları rolün kendisine bağlı kalır.
--   * Rol satırının e-postası ve kullanılabilir bir şifresi yoktur; girişte
--     aranmaz. Yetişkin hesabı silinince rolleri de silinir.
--   * Öğretmen kendi eşleme kodunu okulun müdürüne verir; müdür kodu girince
--     öğretmen rolü açılır ve kod yenilenir (tek kullanımlık).
--   * Öğrenci ve servisçi hesaplarını okul açar (009); bunlarda değişiklik yok.
-- =============================================================================

ALTER TABLE kullanicilar ADD COLUMN ana_hesap_id text
  REFERENCES kullanicilar (id) ON DELETE CASCADE;
CREATE INDEX kullanicilar_ana_hesap ON kullanicilar (ana_hesap_id) WHERE ana_hesap_id IS NOT NULL;

-- Rol satırı: yalnızca öğretmen ya da müdür, bir okula bağlı, e-postasız.
ALTER TABLE kullanicilar ADD CONSTRAINT kullanicilar_rol_satiri CHECK (
  ana_hesap_id IS NULL OR (
    rol IS NOT NULL AND rol IN ('teacher', 'principal') AND okul_id IS NOT NULL AND eposta IS NULL
  )
);

-- Bir kişi bir okulda tek rol alır.
CREATE UNIQUE INDEX kullanicilar_ana_okul ON kullanicilar (ana_hesap_id, okul_id)
  WHERE ana_hesap_id IS NOT NULL;

-- Öğretmenin okula verdiği tek kullanımlık eşleme kodu (yalnızca yetişkin hesabında).
ALTER TABLE kullanicilar ADD COLUMN eslesme_kodu text NOT NULL DEFAULT ''
  CHECK (eslesme_kodu = '' OR eslesme_kodu ~ '^[A-Z0-9]{10}$');
CREATE UNIQUE INDEX kullanicilar_eslesme_kodu ON kullanicilar (eslesme_kodu) WHERE eslesme_kodu <> '';

-- Bir hesabın aynı anda tek bekleyen okul başvurusu olur (aynı anda gönderilen
-- başvurular da birbirini geçemez).
CREATE UNIQUE INDEX kullanicilar_bekleyen_basvuru ON kullanicilar (ana_hesap_id)
  WHERE ana_hesap_id IS NOT NULL AND rol = 'principal' AND durum = 'pending';
