-- =============================================================================
-- 030: gizli yönetim paneli (/admin) ve site ayarları
--
--   site_ayarlari: sistem yöneticisinin /admin > "Site ayarları"ndan
--   değiştirdiği ayarlar (iletişim, yapımcılar, Play Store bağlantısı,
--   bildirim yoklama aralığı, çevrimiçi sayma süresi, admins.json okuma
--   aralığı). Öncelik: bu tablodaki değer > data/config.yml > kodun
--   varsayılanı. Değer JSON'dur (jsonb); doğrulama sunucudadır
--   (sunucu/bolumler/site-ayarlari.js). Güncelleyen kişiye yabancı anahtar
--   yoktur: yedekten geri yüklemede kullanıcılar tablosu boşaltılır
--   (TRUNCATE ... CASCADE), site ayarları silinmesin; adı ayrıca yazılır.
--   Site ayarları yedeğe girmez, geri yüklemede olduğu gibi kalır.
--
--   yonetim_cerezleri: yönetici oturumuna bağlı /admin çerezleri. Çerezin
--   kendisi değil SHA-256 özeti saklanır. Oturum kapanınca (çıkış, süre
--   dolumu, şifre değişimi, hesap silinmesi) çerez de silinir (ON DELETE
--   CASCADE). Çerez her girişte ve /api/me'de yenilenir; bir oturumun en
--   yeni birkaç çerezi geçerli kalır (sunucu/veri/depo/oturumlar.js).
-- =============================================================================

CREATE TABLE site_ayarlari (
  anahtar         text        PRIMARY KEY CHECK (anahtar ~ '^[a-zA-Z][a-zA-Z0-9]{1,39}$'),
  deger           jsonb       NOT NULL,
  guncelleyen_id  text,
  guncelleyen_ad  text        NOT NULL DEFAULT '',
  guncelleme      timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE yonetim_cerezleri (
  ozet          text        PRIMARY KEY CHECK (ozet ~ '^[a-f0-9]{64}$'),
  oturum_ozeti  text        NOT NULL REFERENCES oturumlar (anahtar_ozeti) ON DELETE CASCADE,
  olusturma     timestamptz NOT NULL DEFAULT clock_timestamp()
);
CREATE INDEX yonetim_cerezleri_oturum ON yonetim_cerezleri (oturum_ozeti, olusturma DESC);
