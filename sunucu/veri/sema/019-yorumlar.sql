-- =============================================================================
-- 019: açılış sayfasındaki yorumlar
--
--   Eğitim Evi'ni kullanan yetişkinler (veli, öğretmen, müdür) bir yorum ve
--   0-5 yıldız bırakır; açılış sayfasının altında görünür. Hesap başına tek
--   yorum (sonradan değiştirilebilir). Ad tam yazılmaz, kısaltılır
--   ("Faruk Yıldız" -> "Fa. Yı."); kısaltma yazıldığı anda saklanır.
--   Uygunsuz kelime süzgeci: badwordsfilter.json (sunucu/yardimci/kufur-suzgeci.js).
--   Sistem yöneticisi bir yorumu gizleyebilir (silinmez, görünmez olur).
-- =============================================================================

CREATE TABLE yorumlar (
  id          text        PRIMARY KEY,
  hesap_id    text        NOT NULL UNIQUE REFERENCES kullanicilar (id) ON DELETE CASCADE,  -- yetişkin (ana) hesap
  yildiz      smallint    NOT NULL CHECK (yildiz BETWEEN 0 AND 5),
  metin       text        NOT NULL CHECK (length(metin) BETWEEN 3 AND 500),
  ad_kisa     text        NOT NULL CHECK (length(ad_kisa) <= 40),
  rol         text        NOT NULL DEFAULT '' CHECK (length(rol) <= 60),                -- "Veli", "Öğretmen, veli"
  gizli       boolean     NOT NULL DEFAULT false,
  olusturma   timestamptz NOT NULL DEFAULT now(),
  guncelleme  timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX yorumlar_gorunen ON yorumlar (guncelleme DESC) WHERE NOT gizli;
