-- =============================================================================
-- 004: okul davetleri
--
-- Okul, rolsüz bir kişiyi kullanıcı adıyla öğretmen ya da öğrenci olarak
-- ekler; ama kişi daveti kendi başlangıç sayfasından kabul edene kadar okula
-- bağlanmaz. Böylece bir okul, kullanıcı adını bildiği herhangi bir hesabı
-- kişinin haberi olmadan kendine bağlayıp (e-posta, şifre) üzerinde söz
-- sahibi olamaz.
--
-- Bir okul bir kişiye tek davet gönderir (yenisi eskisinin yerine geçer).
-- Kişi kabul edince bütün davetleri silinir; reddedince yalnızca o davet.
-- =============================================================================

CREATE TABLE okul_davetleri (
  id            text        PRIMARY KEY,
  okul_id       text        NOT NULL REFERENCES okullar (id) ON DELETE CASCADE,
  kullanici_id  text        NOT NULL REFERENCES kullanicilar (id) ON DELETE CASCADE,
  rol           text        NOT NULL CHECK (rol IN ('teacher', 'student')),
  brans         text        NOT NULL DEFAULT '',
  sinif_id      text        REFERENCES siniflar (id) ON DELETE SET NULL,
  dogum_tarihi  date,
  davet_eden_id text        REFERENCES kullanicilar (id) ON DELETE SET NULL,
  olusturma     timestamptz NOT NULL DEFAULT now(),
  UNIQUE (okul_id, kullanici_id)
);
CREATE INDEX okul_davetleri_kullanici ON okul_davetleri (kullanici_id);
