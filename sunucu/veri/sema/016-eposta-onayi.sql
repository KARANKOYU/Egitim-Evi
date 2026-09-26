-- =============================================================================
-- 016: e-posta onayı
--
--   Hesap, e-postadaki bağlantıya tıklanmadan açılmaz: kimse sahibi olmadığı
--   bir adresle (başkasının ya da bir şirketin adresiyle) hesap açamasın.
--   Kayıt formu doldurulunca bilgiler burada bekler (şifre özetlenmiş hâlde),
--   adrese tek kullanımlık bir bağlantı gider; tıklanınca hesap açılır ve
--   satır silinir. Yetişkin hesabında e-posta değiştirmek de aynı yoldan
--   geçer: yeni adrese giden bağlantı tıklanınca adres değişir.
--
--   Bağlantıdaki anahtarın kendisi saklanmaz, SHA-256 özeti saklanır.
--   Bağlantı 24 saat geçerlidir.
-- =============================================================================

CREATE TABLE eposta_onaylari (
  anahtar_ozeti text        PRIMARY KEY,
  tur           text        NOT NULL CHECK (tur IN ('kayit', 'eposta')),
  eposta        text        NOT NULL CHECK (length(eposta) BETWEEN 3 AND 254),
  -- e-posta değişikliğinde: adresi değişecek hesap
  kullanici_id  text        REFERENCES kullanicilar (id) ON DELETE CASCADE,
  -- kayıtta: açılacak hesabın bilgileri
  kullanici_adi text,
  ad_soyad      text,
  sifre_ozeti   text,
  telefon       text        NOT NULL DEFAULT '',
  tc_kimlik     text,
  adres         text        NOT NULL DEFAULT '',
  kvkk_surum    text,
  olusturma     timestamptz NOT NULL DEFAULT now(),
  bitis         timestamptz NOT NULL,
  CHECK (
    (tur = 'eposta' AND kullanici_id IS NOT NULL) OR
    (tur = 'kayit' AND kullanici_adi IS NOT NULL AND ad_soyad IS NOT NULL AND sifre_ozeti IS NOT NULL
      AND kvkk_surum IS NOT NULL)
  )
);
CREATE INDEX eposta_onaylari_eposta ON eposta_onaylari (eposta);
CREATE INDEX eposta_onaylari_bitis ON eposta_onaylari (bitis);
