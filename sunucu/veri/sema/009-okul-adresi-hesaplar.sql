-- =============================================================================
-- 009: okul adresi, okul içi hesaplar, servisçi
--
--   * Her okulun kısa adı olur: egitimevi.org/<kisa_ad>. O adreste yalnızca
--     o okulun girişi vardır.
--   * Öğrenci, öğretmen, müdür ve servisçi hesapları OKULA aittir: kullanıcı
--     adı ve T.C. kimlik no okul içinde benzersizdir (iki okulda aynı
--     "ahmet.yilmaz" olabilir). Veli, sistem yöneticisi ve rolsüz hesaplar
--     okuldan bağımsızdır; kendi aralarında benzersizdir.
--   * Okulun açtığı hesapta kullanıcı adı T.C. kimlik no olabilir (11 hane).
--   * Servisçi (servis şoförü) rolü: hesabını müdür açar.
--   * Okul no (öğrenci numarası) okul içinde benzersizdir.
--   * sifre_degismeli: şifreyi başkası belirlediyse (T.C. ile varsayılan,
--     toplu dağıtım) kişi ilk girişte kendi şifresini koymadan devam edemez.
--   * Öğrenci ve öğretmen artık kendisi kaydolmaz; hesaplarını okul açar.
--     Kayıt olmuş kişiyi okula çağıran davetler kalktı.
-- =============================================================================

ALTER TABLE okullar ADD COLUMN kisa_ad text
  CHECK (kisa_ad IS NULL OR kisa_ad ~ '^[a-z0-9][a-z0-9-]{1,38}[a-z0-9]$');
CREATE UNIQUE INDEX okullar_kisa_ad ON okullar (kisa_ad) WHERE kisa_ad IS NOT NULL;

-- Rol listesine servisçi (okula bağlı olma şartı mevcut kısıtta: yalnızca
-- admin ve veli okulsuz olabilir).
DO $$
DECLARE r record;
BEGIN
  FOR r IN SELECT conname FROM pg_constraint
           WHERE conrelid = 'kullanicilar'::regclass AND contype = 'c'
             AND pg_get_constraintdef(oid) LIKE '%''student''%'
             AND pg_get_constraintdef(oid) NOT LIKE '%okul_id%' LOOP
    EXECUTE 'ALTER TABLE kullanicilar DROP CONSTRAINT ' || quote_ident(r.conname);
  END LOOP;
END $$;
ALTER TABLE kullanicilar ADD CONSTRAINT kullanicilar_rol_gecerli
  CHECK (rol IS NULL OR rol IN ('admin', 'principal', 'teacher', 'student', 'parent', 'servisci'));

-- Kullanıcı adı: harfle başlayan ad ya da (okulun açtığı hesapta) T.C. no
ALTER TABLE kullanicilar DROP CONSTRAINT kullanici_adi_bicimi;
ALTER TABLE kullanicilar ADD CONSTRAINT kullanici_adi_bicimi
  CHECK (kullanici_adi ~ '^[a-z][a-z0-9._]{2,29}$' OR kullanici_adi ~ '^[1-9][0-9]{10}$');

-- Benzersizlik: okul hesapları okul içinde, ötekiler kendi aralarında
DROP INDEX kullanicilar_kullanici_adi;
CREATE UNIQUE INDEX kullanicilar_kadi_okul ON kullanicilar (okul_id, kullanici_adi)
  WHERE rol IN ('principal', 'teacher', 'student', 'servisci');
CREATE UNIQUE INDEX kullanicilar_kadi_genel ON kullanicilar (kullanici_adi)
  WHERE rol IS NULL OR rol IN ('admin', 'parent');

DROP INDEX kullanicilar_tc_kimlik;
CREATE UNIQUE INDEX kullanicilar_tc_okul ON kullanicilar (okul_id, tc_kimlik)
  WHERE tc_kimlik IS NOT NULL AND rol IN ('principal', 'teacher', 'student', 'servisci');
CREATE UNIQUE INDEX kullanicilar_tc_genel ON kullanicilar (tc_kimlik)
  WHERE tc_kimlik IS NOT NULL AND (rol IS NULL OR rol IN ('admin', 'parent'));

ALTER TABLE kullanicilar ADD COLUMN okul_no text NOT NULL DEFAULT ''
  CHECK (length(okul_no) <= 20);
CREATE UNIQUE INDEX kullanicilar_okul_no ON kullanicilar (okul_id, okul_no)
  WHERE okul_no <> '' AND rol = 'student';

ALTER TABLE kullanicilar ADD COLUMN sifre_degismeli boolean NOT NULL DEFAULT false;

-- 005'te son giriş yalnızca açık oturumlardan dolduruldu; oturumu süresi
-- dolmuş hesaplar "hiç girmemiş" görünüyordu. Aydınlatma metnini onaylamış
-- kişi (kayıtta ya da ilk girişte) hesabını kullanmıştır.
UPDATE kullanicilar SET son_giris = kvkk_tarih
 WHERE son_giris IS NULL AND kvkk_tarih IS NOT NULL;

DROP TABLE okul_davetleri;
