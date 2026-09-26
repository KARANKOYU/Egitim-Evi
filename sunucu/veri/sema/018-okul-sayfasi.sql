-- =============================================================================
-- 018: okul sayfası (egitimevi.org/<okulun-adi>)
--
--   Okulun giriş sayfasında, giriş kartının üstünde okulun kendi tanıtımı
--   durur: kapak ve logo fotoğrafı, tanıtım yazısı, fotoğraf galerisi, renk
--   ve boyut ayarları, bir de kısıtlı CSS. Müdür ya da "okul.sayfa" yetkisi
--   verilen kişi ("Kodlayıcı" rolü) düzenler.
--
--   okul_sayfalari.css: kişinin yazdığı metin olduğu gibi saklanır (düzenlerken
--     geri gelsin). Sayfaya giderken her seferinde yeniden temizlenir
--     (sunucu/yardimci/css-temizle.js); temizlenmemiş CSS hiç dışarı çıkmaz.
--   okul_fotolari: dosyanın kendisi data/okul-fotolari/<id> içinde durur;
--     konum ve cihaz bilgisi kaydetmeden önce silinmiştir.
-- =============================================================================

CREATE TABLE okul_sayfalari (
  okul_id        text        PRIMARY KEY REFERENCES okullar (id) ON DELETE CASCADE,
  tanitim        text        NOT NULL DEFAULT '' CHECK (length(tanitim) <= 1500),
  ayarlar        jsonb       NOT NULL DEFAULT '{}'::jsonb,   -- renk, zemin, başlık ve kapak boyu, hiza
  css            text        NOT NULL DEFAULT '' CHECK (length(css) <= 8000),
  guncelleyen_id text        REFERENCES kullanicilar (id) ON DELETE SET NULL,
  guncelleme     timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE okul_fotolari (
  id          text        PRIMARY KEY CHECK (id ~ '^[0-9a-f]{32}$'),
  okul_id     text        NOT NULL REFERENCES okullar (id) ON DELETE CASCADE,
  yer         text        NOT NULL CHECK (yer IN ('kapak', 'logo', 'galeri')),
  tur         text        NOT NULL CHECK (tur IN ('image/png', 'image/jpeg', 'image/webp')),
  boyut       integer     NOT NULL CHECK (boyut > 0),
  aciklama    text        NOT NULL DEFAULT '' CHECK (length(aciklama) <= 120),
  olusturma   timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX okul_fotolari_okul ON okul_fotolari (okul_id, olusturma);
