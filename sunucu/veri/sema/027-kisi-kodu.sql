-- =============================================================================
-- 027: kişi kodu; müdür başvurusunun kalkması
--
--   * Herkesin kendine ait bir kişi kodu vardır. Öğrencide bu "veli kodu"dur
--     (veli_kodu: veli çocuğunu onunla ekler), yetişkin hesabında "kişi kodu"
--     (eslesme_kodu: müdür onunla öğretmen ekler, yönetici onunla müdür yapar;
--     tek kullanımlık). Servisçi, sistem yöneticisi ve okul rolü satırlarında
--     kod yoktur.
--   * Yeni biçim 15 karakter, yalnız ASCII: büyük harf, küçük harf, rakam ve
--     ! ? # * + -; ilk karakter harf; büyük/küçük harf duyarlı. Karışan
--     karakterler (I, L, O, l, o, 0, 1) üretilmez. "Her sınıftan en az bir
--     karakter" koşulu uygulamada denetlenir (sunucu/ortak.js KISI_KODU_DESENI).
--   * Eski 10 haneli kodların hepsi geçersiz: boşaltılır. Sunucu açılışta boş
--     kodların yerine yenilerini üretir (depo.kullanicilar.eksikKodlariDoldur).
--   * Müdür başvurusu kalktı: okulu sistem yöneticisi açar ve kişiyi kişi
--     koduyla müdür yapar. Bekleyen başvurular silinir; içinde onaylı kimse
--     kalmayan bekleyen okullar reddedilir (MEB kodu ve adresi boşa çıkar).
--     Öğretmeni ya da öğrencisi olan bekleyen okul (müdürü kaldırılmış) kalır:
--     yönetici "Okul aç" ile ona yeni müdür atar.
-- =============================================================================

-- eslesme_kodu üzerindeki eski CHECK (adı otomatik verildi; pg_constraint'ten bulunur).
DO $$
DECLARE
  ad text;
BEGIN
  FOR ad IN
    SELECT c.conname FROM pg_constraint c
    WHERE c.conrelid = 'kullanicilar'::regclass AND c.contype = 'c'
      AND pg_get_constraintdef(c.oid) LIKE '%eslesme_kodu%'
  LOOP
    EXECUTE format('ALTER TABLE kullanicilar DROP CONSTRAINT %I', ad);
  END LOOP;
END $$;

-- Yeni desene uymayan (eski 10 haneli) kodlar boşaltılır.
UPDATE kullanicilar SET eslesme_kodu = ''
  WHERE eslesme_kodu <> '' AND eslesme_kodu !~ '^[A-Za-z][A-Za-z0-9!?#*+-]{14}$';
UPDATE kullanicilar SET veli_kodu = ''
  WHERE veli_kodu <> '' AND veli_kodu !~ '^[A-Za-z][A-Za-z0-9!?#*+-]{14}$';

ALTER TABLE kullanicilar ADD CONSTRAINT kullanicilar_eslesme_kodu_bicimi
  CHECK (eslesme_kodu = '' OR eslesme_kodu ~ '^[A-Za-z][A-Za-z0-9!?#*+-]{14}$');
ALTER TABLE kullanicilar ADD CONSTRAINT kullanicilar_veli_kodu_bicimi
  CHECK (veli_kodu = '' OR veli_kodu ~ '^[A-Za-z][A-Za-z0-9!?#*+-]{14}$');
-- Tekil indeksler (kullanicilar_veli_kodu_tekil, kullanicilar_eslesme_kodu) aynen kalır.

-- Bekleyen müdür başvuruları: yetişkin hesabına bağlı onay bekleyen müdür satırları
-- silinir (kişinin hesabı ve öteki rolleri durur). Eski usul, kendi e-postasıyla
-- açılmış bekleyen müdür hesabına dokunulmaz: yönetici "Müdürler" listesinden kaldırır.
DELETE FROM kullanicilar WHERE rol = 'principal' AND durum = 'pending' AND ana_hesap_id IS NOT NULL;

-- İçinde onaylı kimse kalmayan bekleyen okullar reddedilir; adresleri boşa çıkar.
UPDATE okullar o SET durum = 'rejected', kisa_ad = NULL
  WHERE o.durum = 'pending'
    AND NOT EXISTS (SELECT 1 FROM kullanicilar k WHERE k.okul_id = o.id AND k.durum = 'approved');
