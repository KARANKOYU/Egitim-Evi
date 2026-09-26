-- =============================================================================
-- 011: telefon bildirimi (Web Push) abonelikleri
--
-- Kişi "Telefon bildirimlerini aç" deyince tarayıcı bir abonelik verir: push
-- servisinin adresi (endpoint) ve uçtan uca şifreleme anahtarları. Bildirim
-- içeriği bu anahtarlarla şifrelenip gönderilir; push servisi (Google, Mozilla,
-- Apple) içeriği okuyamaz. Aynı cihaz başka hesaba geçerse abonelik yeni
-- hesaba taşınır (endpoint tektir).
-- =============================================================================

CREATE TABLE push_abonelikleri (
  id            text        PRIMARY KEY,
  kullanici_id  text        NOT NULL REFERENCES kullanicilar (id) ON DELETE CASCADE,
  endpoint      text        NOT NULL UNIQUE CHECK (length(endpoint) BETWEEN 10 AND 1000),
  p256dh        text        NOT NULL CHECK (p256dh ~ '^[A-Za-z0-9_-]{80,100}$'),
  auth          text        NOT NULL CHECK (auth ~ '^[A-Za-z0-9_-]{16,30}$'),
  olusturma     timestamptz NOT NULL DEFAULT now(),
  son_basari    timestamptz
);
CREATE INDEX push_abonelikleri_kisi ON push_abonelikleri (kullanici_id);
