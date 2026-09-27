-- =============================================================================
-- 029: ödevin quizi
--
-- Öğretmen ödeve bir quiz ekler (ödev başına tek quiz); öğrenci ödevi açıp
-- quizi çözer. Soru türleri: Doğru/Yanlış ('dy'), çoktan seçmeli ('coktan';
-- bir ya da birden çok doğru şık) ve açık uçlu ('acik'; puanlanmaz, yalnız
-- saklanır, öğretmen okur). Doğru/Yanlış sorusunun iki şıkkı vardır
-- ("Doğru", "Yanlış"); hangisinin doğru olduğu şıkta işaretlidir.
--
--   * Süre türü: 'yok' (süresiz), 'soru' (her sorunun kendi süresi; sırayla,
--     geri dönülmez), 'quiz' (bütün quiz için toplam süre).
--   * Tek deneme: deneme satırının anahtarı (odev_id, ogrenci_id); ikinci
--     deneme veritabanına yazılamaz.
--   * Deneme ve cevaplar ödevin öğrenci listesine (odev_ogrencileri) bileşik
--     yabancı anahtarla bağlı: ödevde olmayan öğrencinin denemesi ya da cevabı
--     yazılamaz. Cevap ayrıca aynı ödevin sorusuna ve o öğrencinin denemesine
--     bağlıdır. Ödev (ya da quiz) silinince hepsi silinir.
--   * Sekme/uygulama değiştirme: kaç kez ve toplam kaç saniye (cikis_*).
--   * Doğru şıklar yalnız bu tablolarda durur; ödev nesnesine hiç girmez.
-- =============================================================================

CREATE TABLE quizler (
  odev_id          text        PRIMARY KEY REFERENCES odevler (id) ON DELETE CASCADE,
  sure_turu        text        NOT NULL DEFAULT 'yok' CHECK (sure_turu IN ('yok', 'soru', 'quiz')),
  toplam_sn        integer     CHECK (toplam_sn BETWEEN 60 AND 10800),              -- bütün quiz: 1-180 dk
  cikinca_kapanir  boolean     NOT NULL DEFAULT false,   -- sekmeden/uygulamadan çıkınca o soru kapanır
  sonuc_gorunum    text        NOT NULL DEFAULT 'teslim' CHECK (sonuc_gorunum IN ('teslim', 'hemen')),
  sonuc_acildi     timestamptz,                         -- sonuçlar kalıcı açıldı (öğretmen açtı ya da son teslimle açıldı)
  olusturma        timestamptz NOT NULL DEFAULT now(),
  guncelleme       timestamptz NOT NULL DEFAULT now(),
  CHECK ((sure_turu = 'quiz') = (toplam_sn IS NOT NULL))
);

CREATE TABLE quiz_sorulari (
  id            text        PRIMARY KEY,
  odev_id       text        NOT NULL REFERENCES quizler (odev_id) ON DELETE CASCADE,
  sira          smallint    NOT NULL CHECK (sira BETWEEN 1 AND 100),
  tur           text        NOT NULL CHECK (tur IN ('dy', 'coktan', 'acik')),
  metin         text        NOT NULL CHECK (length(metin) BETWEEN 1 AND 1000),
  sure_sn       integer     CHECK (sure_sn BETWEEN 10 AND 600),                    -- soru başına: 10 sn - 10 dk
  UNIQUE (odev_id, sira),
  UNIQUE (odev_id, id)
);

CREATE TABLE quiz_secenekleri (
  id            text        PRIMARY KEY,
  soru_id       text        NOT NULL REFERENCES quiz_sorulari (id) ON DELETE CASCADE,
  sira          smallint    NOT NULL CHECK (sira BETWEEN 1 AND 10),
  metin         text        NOT NULL CHECK (length(metin) BETWEEN 1 AND 300),
  dogru         boolean     NOT NULL DEFAULT false,
  UNIQUE (soru_id, sira)
);

CREATE TABLE quiz_denemeleri (
  odev_id          text        NOT NULL REFERENCES quizler (odev_id) ON DELETE CASCADE,
  ogrenci_id       text        NOT NULL,
  baslama          timestamptz NOT NULL DEFAULT now(),
  bitis            timestamptz,
  bitis_nedeni     text        CHECK (bitis_nedeni IN ('ogrenci', 'sure', 'teslim', 'sonuclandi', 'cikis')),
  soru_sira        smallint    NOT NULL DEFAULT 1 CHECK (soru_sira BETWEEN 1 AND 101),   -- soru başına sürede şu anki soru
  soru_baslama     timestamptz NOT NULL DEFAULT now(),                                  -- şu anki sorunun başladığı an
  cikis_sayisi     integer     NOT NULL DEFAULT 0 CHECK (cikis_sayisi >= 0),
  cikis_sn         integer     NOT NULL DEFAULT 0 CHECK (cikis_sn >= 0),
  dogru            smallint    CHECK (dogru >= 0),        -- bitince: doğru cevaplanan puanlı soru
  puanli           smallint    CHECK (puanli >= 0),       -- bitince: puanlı soru sayısı (açık uçlular hariç)
  sonuc_bildirildi boolean     NOT NULL DEFAULT false,    -- "quizinin sonucu açıklandı" bildirimi gitti
  PRIMARY KEY (odev_id, ogrenci_id),
  FOREIGN KEY (odev_id, ogrenci_id) REFERENCES odev_ogrencileri (odev_id, ogrenci_id) ON DELETE CASCADE,
  CHECK ((bitis IS NULL) = (bitis_nedeni IS NULL))
);
CREATE INDEX quiz_denemeleri_ogrenci ON quiz_denemeleri (ogrenci_id);
CREATE INDEX quiz_denemeleri_acik ON quiz_denemeleri (odev_id) WHERE bitis IS NULL;

CREATE TABLE quiz_cevaplari (
  odev_id       text        NOT NULL,
  ogrenci_id    text        NOT NULL,
  soru_id       text        NOT NULL,
  secilenler    text[]      NOT NULL DEFAULT '{}' CHECK (cardinality(secilenler) <= 10),   -- şık kimlikleri
  metin         text        NOT NULL DEFAULT '' CHECK (length(metin) <= 2000),             -- açık uçlu cevap
  kayit         timestamptz,                    -- cevabın son kaydedildiği an (boşsa cevap verilmedi)
  acilis        timestamptz,                    -- soru başına sürede sorunun açıldığı an
  kapanis       timestamptz,                    -- soru kapandı (süre doldu, çıkınca kapandı, sonrakine geçildi)
  kapandi       text        CHECK (kapandi IN ('sure', 'cikis', 'gecildi')),
  PRIMARY KEY (odev_id, ogrenci_id, soru_id),
  FOREIGN KEY (odev_id, ogrenci_id) REFERENCES odev_ogrencileri (odev_id, ogrenci_id) ON DELETE CASCADE,
  FOREIGN KEY (odev_id, ogrenci_id) REFERENCES quiz_denemeleri (odev_id, ogrenci_id) ON DELETE CASCADE,
  FOREIGN KEY (odev_id, soru_id) REFERENCES quiz_sorulari (odev_id, id) ON DELETE CASCADE
);
