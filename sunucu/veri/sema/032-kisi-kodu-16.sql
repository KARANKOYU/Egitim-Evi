-- =============================================================================
-- 032: kişi kodu 16 karakter, 4'erli gruplar
--
--   * Kişi kodu (yetişkinde eslesme_kodu, öğrencide veli_kodu) artık 16
--     karakter. Ekranda, kâğıtta ve Excel'de tireyle 4'erli dört grup hâlinde
--     görünür (Ab3#-kQx9-+mPt-7?zR). Tire ayırıcıdır, kodun karakteri değildir:
--     alfabeden çıktı, yerine '=' girdi. Özel karakterler: ! ? # * + =
--     Harfler ve rakamlar değişmedi; ilk karakter harf; büyük/küçük harf duyarlı.
--     "Her sınıftan en az bir karakter" koşulu uygulamada denetlenir
--     (sunucu/ortak.js KISI_KODU_DESENI).
--   * 027'deki 15 haneli kodların hepsi boşaltılır. Sunucu açılışta boş
--     kodların yerine yenilerini üretir (depo.kullanicilar.eksikKodlariDoldur).
--     Veli bağları ve okul rolü satırları koda bağlı değildir: etkilenmez.
--   * Tekil indeksler (kullanicilar_veli_kodu_tekil, kullanicilar_eslesme_kodu)
--     boş kodu saymaz; aynen kalır.
-- =============================================================================

ALTER TABLE kullanicilar DROP CONSTRAINT IF EXISTS kullanicilar_eslesme_kodu_bicimi;
ALTER TABLE kullanicilar DROP CONSTRAINT IF EXISTS kullanicilar_veli_kodu_bicimi;

-- Yeni desene uymayan (15 haneli) kodlar boşaltılır.
UPDATE kullanicilar SET eslesme_kodu = ''
  WHERE eslesme_kodu <> '' AND eslesme_kodu !~ '^[A-Za-z][A-Za-z0-9!?#*+=]{15}$';
UPDATE kullanicilar SET veli_kodu = ''
  WHERE veli_kodu <> '' AND veli_kodu !~ '^[A-Za-z][A-Za-z0-9!?#*+=]{15}$';

ALTER TABLE kullanicilar ADD CONSTRAINT kullanicilar_eslesme_kodu_bicimi
  CHECK (eslesme_kodu = '' OR eslesme_kodu ~ '^[A-Za-z][A-Za-z0-9!?#*+=]{15}$');
ALTER TABLE kullanicilar ADD CONSTRAINT kullanicilar_veli_kodu_bicimi
  CHECK (veli_kodu = '' OR veli_kodu ~ '^[A-Za-z][A-Za-z0-9!?#*+=]{15}$');
