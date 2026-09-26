-- =============================================================================
-- 013: hazır "Öğretmen" rolü, etütler, mesaj düzeltme
--
--   * Her okulun bir hazır "Öğretmen" rolü olur (tur = 'ogretmen'). Okuldaki
--     her öğretmen bu rolün yetkilerine kendiliğinden sahiptir; müdür bu
--     yetkileri öteki roller gibi açıp kapatabilir. Bir öğretmene ayrıca özel
--     rol verilirse iki rolün yetkileri birleşir. Rol yoksa (eski okul) ilk
--     açılışta varsayılan yetkilerle kurulur.
--   * Etüt: okulun belli bir gününde, belli saatleri arasında yapılan ders
--     dışı çalışma. Bir öğretmene verilir; o öğretmen ya da "etüt yoklaması"
--     yetkisi olan kişi yoklamayı alır: geldi, gelmedi (izinsiz), izinli.
-- =============================================================================

ALTER TABLE roller ADD COLUMN tur text NOT NULL DEFAULT 'ozel'
  CHECK (tur IN ('ozel', 'ogretmen'));
-- Bir okulda tek hazır öğretmen rolü.
CREATE UNIQUE INDEX roller_okul_ogretmen ON roller (okul_id) WHERE tur = 'ogretmen';

CREATE TABLE etutler (
  id            text        PRIMARY KEY,
  okul_id       text        NOT NULL REFERENCES okullar (id) ON DELETE CASCADE,
  ad            text        NOT NULL CHECK (length(ad) BETWEEN 1 AND 80),
  gun           smallint    NOT NULL CHECK (gun BETWEEN 1 AND 7),        -- 1 pazartesi ... 7 pazar (ders programı gibi)
  baslangic     time        NOT NULL,
  bitis         time        NOT NULL,
  yer           text        NOT NULL DEFAULT '' CHECK (length(yer) <= 60),   -- derslik, kütüphane...
  ogretmen_id   text        REFERENCES kullanicilar (id) ON DELETE SET NULL,
  olusturma     timestamptz NOT NULL DEFAULT now(),
  CHECK (bitis > baslangic)
);
CREATE INDEX etutler_okul ON etutler (okul_id, gun, baslangic);
CREATE INDEX etutler_ogretmen ON etutler (ogretmen_id) WHERE ogretmen_id IS NOT NULL;

CREATE TABLE etut_ogrencileri (
  etut_id       text        NOT NULL REFERENCES etutler (id) ON DELETE CASCADE,
  ogrenci_id    text        NOT NULL REFERENCES kullanicilar (id) ON DELETE CASCADE,
  PRIMARY KEY (etut_id, ogrenci_id)
);
CREATE INDEX etut_ogrencileri_ogrenci ON etut_ogrencileri (ogrenci_id);

-- Bir etütün bir günkü yoklaması: öğrenci başına tek satır.
CREATE TABLE etut_yoklamalari (
  etut_id       text        NOT NULL REFERENCES etutler (id) ON DELETE CASCADE,
  tarih         date        NOT NULL,
  ogrenci_id    text        NOT NULL REFERENCES kullanicilar (id) ON DELETE CASCADE,
  durum         text        NOT NULL CHECK (durum IN ('var', 'yok', 'izinli')),
  alan_id       text        REFERENCES kullanicilar (id) ON DELETE SET NULL,   -- yoklamayı alan
  guncelleme    timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (etut_id, tarih, ogrenci_id)
);
CREATE INDEX etut_yoklamalari_ogrenci ON etut_yoklamalari (ogrenci_id, tarih DESC);

-- Gönderilmiş mesajı gönderen sonradan düzeltebilir; ne zaman düzeltildiği görünür.
ALTER TABLE mesajlar ADD COLUMN duzenlenme timestamptz;
