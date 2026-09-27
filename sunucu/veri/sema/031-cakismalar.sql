-- =============================================================================
-- 031: aynı T.C., e-posta ve kullanıcı adı (çakışmalar)
--
--   Kurallar ve onları veritabanında koruyan yer:
--     * E-posta bütün sistemde tektir: kullanicilar.eposta UNIQUE (001). Uygulama
--       adresi hep aynı biçimde saklar (ortak.js normEmail: NFKC, görünmez
--       karakterler silinir, İ -> i, küçük harf; yalnız ASCII kabul edilir).
--     * Kullanıcı adı okul hesaplarında okul içinde (kullanicilar_kadi_okul),
--       yetişkin/veli/yönetici hesaplarında kendi aralarında tektir
--       (kullanicilar_kadi_genel) (009).
--     * YENİ: sistem yöneticisinin kullanıcı adı hiçbir hesapla (hiçbir okulun
--       hesabıyla da) aynı olamaz. Bu iki ad alanını aşan bir kural olduğu için
--       tekil indeksle değil tetikleyiciyle korunur (aşağıda).
--     * T.C. no okulda tektir (kullanicilar_tc_okul), yetişkin hesaplarında kendi
--       aralarında tektir (kullanicilar_tc_genel) (009); öğrencinin T.C. no'su
--       bütün sistemde tektir (kullanicilar_tc_ogrenci, 021). 021'de eski veride
--       aynı T.C. ile iki öğrenci varsa indeks kurulmamıştı: burada yeniden
--       denenir; çift hâlâ varsa kurulmaz, uyarı yazılır (sunucu düşmez; uygulama
--       yine denetler, sunucu açılışta çiftleri pencereye yazar).
--
--   Aynı anda gelen iki istek tekil indekse takılırsa (23505) sunucu bunu
--   alanıyla birlikte açık bir iletiye çevirir (veri/baglanti.js CAKISMALAR).
-- =============================================================================

-- Öğrencinin T.C. no'su bütün sistemde tek: 021'de kurulamadıysa yeniden dene.
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE schemaname = current_schema() AND indexname = 'kullanicilar_tc_ogrenci') THEN
    IF NOT EXISTS (SELECT 1 FROM kullanicilar WHERE rol = 'student' AND tc_kimlik IS NOT NULL
                   GROUP BY tc_kimlik HAVING count(*) > 1) THEN
      CREATE UNIQUE INDEX kullanicilar_tc_ogrenci ON kullanicilar (tc_kimlik)
        WHERE tc_kimlik IS NOT NULL AND rol = 'student';
    ELSE
      RAISE NOTICE 'Aynı T.C. kimlik no ile birden çok öğrenci var; kullanicilar_tc_ogrenci indeksi kurulmadı.';
    END IF;
  END IF;
END $$;

-- Yöneticilerin adları (tetikleyici her okul hesabı yazılırken buna bakar).
CREATE INDEX kullanicilar_yonetici_adi ON kullanicilar (kullanici_adi) WHERE rol = 'admin';

-- Yönetici adı hiçbir hesapla çakışmasın.
--   * Yönetici yazılırken (ekleme ya da adı/rolü değişirken) tablo SHARE ROW
--     EXCLUSIVE kipinde kilitlenir: o sırada hesap yazan öteki işlemler bitene
--     kadar beklenir, sonra ad bütün hesaplarda aranır. Yönetici çok seyrek
--     açılır (admins.json, ilk kurulum); bekleme kısadır.
--   * Okul hesabı (müdür, öğretmen, öğrenci, servisçi) yazılırken aynı adlı
--     yönetici aranır. Aynı anda açılan bir yönetici varsa onun kilidi bu
--     yazmayı bekletir; yönetici işlemi bitince bu arama onu görür.
--   Hata 23505 (tekillik) ve kısıt adı kullanicilar_kadi_yonetici ile döner:
--   uygulama onu "kullanıcı adı alınmış" iletisine çevirir.
--   Yetişkin/veli hesaplarıyla çakışmayı kullanicilar_kadi_genel zaten önler.
CREATE FUNCTION kullanicilar_yonetici_adi_denetle() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.kullanici_adi IS NULL THEN
    RETURN NEW;
  END IF;
  IF TG_OP = 'UPDATE' AND NEW.kullanici_adi IS NOT DISTINCT FROM OLD.kullanici_adi
     AND NEW.rol IS NOT DISTINCT FROM OLD.rol THEN
    RETURN NEW;
  END IF;
  IF NEW.rol = 'admin' THEN
    LOCK TABLE kullanicilar IN SHARE ROW EXCLUSIVE MODE;
    IF EXISTS (SELECT 1 FROM kullanicilar WHERE kullanici_adi = NEW.kullanici_adi AND id <> NEW.id) THEN
      RAISE EXCEPTION USING ERRCODE = 'unique_violation', CONSTRAINT = 'kullanicilar_kadi_yonetici',
        MESSAGE = 'Yönetici kullanıcı adı başka bir hesapta: ' || NEW.kullanici_adi;
    END IF;
  ELSIF NEW.rol IN ('principal', 'teacher', 'student', 'servisci') THEN
    IF EXISTS (SELECT 1 FROM kullanicilar WHERE rol = 'admin' AND kullanici_adi = NEW.kullanici_adi AND id <> NEW.id) THEN
      RAISE EXCEPTION USING ERRCODE = 'unique_violation', CONSTRAINT = 'kullanicilar_kadi_yonetici',
        MESSAGE = 'Kullanıcı adı bir yöneticide: ' || NEW.kullanici_adi;
    END IF;
  END IF;
  RETURN NEW;
END $$;

CREATE TRIGGER kullanicilar_yonetici_adi
  BEFORE INSERT OR UPDATE OF kullanici_adi, rol ON kullanicilar
  FOR EACH ROW EXECUTE FUNCTION kullanicilar_yonetici_adi_denetle();

-- Var olan veride yöneticiyle aynı adı taşıyan hesap varsa dokunulmaz (tetikleyici
-- yalnız yeni yazılanlara bakar); uyarı yazılır, sunucu açılışta pencereye de yazar.
DO $$
DECLARE n integer;
BEGIN
  SELECT count(*) INTO n FROM kullanicilar a JOIN kullanicilar b
    ON b.kullanici_adi = a.kullanici_adi AND b.id <> a.id
   WHERE a.rol = 'admin';
  IF n > 0 THEN
    RAISE NOTICE 'Yöneticiyle aynı kullanıcı adını taşıyan % hesap var; değiştirilmedi.', n;
  END IF;
END $$;
