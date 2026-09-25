-- =============================================================================
-- 005: son giriş zamanı
--
-- Okul, öğrencilere toplu giriş bilgisi (kullanıcı adı + yeni şifre) dağıtırken
-- yalnızca "hiç giriş yapmamış" hesapları seçebilsin: kendi şifresini belirlemiş
-- ve kullanan öğrencinin şifresi yanlışlıkla değişmesin.
--
-- Eski hesaplar için açık oturumlarının en yenisi yazılır (hiç oturumu kalmamış
-- hesap "hiç girmemiş" sayılır; dağıtım ekranı bunu ayrıca uyarır).
-- =============================================================================

ALTER TABLE kullanicilar ADD COLUMN son_giris timestamptz;

UPDATE kullanicilar k
   SET son_giris = (SELECT max(o.olusturma) FROM oturumlar o WHERE o.kullanici_id = k.id);
