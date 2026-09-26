-- =============================================================================
-- 006: anketler
--
-- Okul (toplu mesaj yetkisi olan kişi) bir gruba tek soruluk anket açar:
-- "Gezi için hangi gün uygun?", "Veli toplantısına katılacak mısınız?".
--
--   * Kimin oy verebileceği anket açılırken anket_hedefleri'ne yazılır
--     (duyurudaki gibi; öğrenciye açılan anket velisine de düşer).
--   * Kişi başına tek oy; bitişe kadar fikrini değiştirebilir.
--   * Oy satırı hedef listesine ve anketin kendi seçeneklerine yabancı
--     anahtarla bağlı: listede olmayan kişinin ya da başka anketin
--     seçeneğine verilmiş oy veritabanına hiç yazılamaz.
--   * gizli: anketi açan kimin neyi seçtiğini görmez, yalnızca sayıları.
-- =============================================================================

CREATE TABLE anketler (
  id            text        PRIMARY KEY,
  okul_id       text        NOT NULL REFERENCES okullar (id) ON DELETE CASCADE,
  olusturan_id  text        REFERENCES kullanicilar (id) ON DELETE SET NULL,
  soru          text        NOT NULL CHECK (length(soru) BETWEEN 1 AND 200),
  aciklama      text        NOT NULL DEFAULT '' CHECK (length(aciklama) <= 1000),
  hedef_ozet    text        NOT NULL DEFAULT '',
  gizli         boolean     NOT NULL DEFAULT false,
  bitis         timestamptz NOT NULL,
  kapandi       timestamptz,                       -- süresinden önce kapatıldıysa
  olusturma     timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX anketler_okul ON anketler (okul_id, olusturma DESC);

CREATE TABLE anket_secenekleri (
  id            text        PRIMARY KEY,
  anket_id      text        NOT NULL REFERENCES anketler (id) ON DELETE CASCADE,
  sira          smallint    NOT NULL,
  metin         text        NOT NULL CHECK (length(metin) BETWEEN 1 AND 120),
  UNIQUE (anket_id, sira),
  UNIQUE (anket_id, id)
);

CREATE TABLE anket_hedefleri (
  anket_id      text        NOT NULL REFERENCES anketler (id) ON DELETE CASCADE,
  kullanici_id  text        NOT NULL REFERENCES kullanicilar (id) ON DELETE CASCADE,
  PRIMARY KEY (anket_id, kullanici_id)
);
CREATE INDEX anket_hedefleri_kisi ON anket_hedefleri (kullanici_id);

CREATE TABLE anket_oylari (
  anket_id      text        NOT NULL,
  kullanici_id  text        NOT NULL,
  secenek_id    text        NOT NULL,
  tarih         timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (anket_id, kullanici_id),
  FOREIGN KEY (anket_id, kullanici_id) REFERENCES anket_hedefleri (anket_id, kullanici_id) ON DELETE CASCADE,
  FOREIGN KEY (anket_id, secenek_id) REFERENCES anket_secenekleri (anket_id, id) ON DELETE CASCADE
);
