# sunucu/push.js

Telefon/tarayıcı bildirimi (Web Push): sunucunun VAPID anahtarı, abonelik denetimi, RFC 8291 uçtan uca şifreleme ve
sınırlı eşzamanlı gönderim kuyruğu — hiçbir paket kullanmadan.

## Bu dosya ne yapar?

Eğitim Evi'nde bir bildirim (yeni ödev, mesaj, duyuru…) veritabanına yazıldığında, kişi tarayıcısında ya da telefonunda
bildirim iznini vermişse aynı bildirim telefonuna da düşer. Bunu tarayıcıların ortak standardı Web Push ile yapar:
tarayıcı bir "abonelik" (push servisinin adresi + iki anahtar) verir, sunucu içeriği o tarayıcının anahtarıyla
şifreleyip push servisine (Google FCM, Mozilla, Apple, Microsoft) gönderir, servis de cihaza iletir. İçerik şifreli
olduğu için push servisi bildirimi okuyamaz.

Standart işi yapan hazır bir `web-push` paketi var ama projenin tek bağımlılığı `pg`; bu yüzden üç RFC (8030 gönderim,
8291 şifreleme, 8292 VAPID kimliği) Node'un `crypto` ve `https` modülleriyle burada yazıldı.

Yerel Android uygulaması Web Push değil, `/api/cihaz` yoklamasını kullanır; ama bildirime dokununca açılacak adresi o da
bu dosyadan (`bildirimAdresi`) alır.

## İçinde neler var?

- `baslat()` — `depo.genel.olaylar`'daki `'bildirim'` olayına abone olur: her bildirim yazımında `bildirimGeldi`
  çalışır. `index.js` açılışta çağırır.
- `anahtarlar()` → `{ acik, gizli }` — sunucunun VAPID anahtar çifti (P-256). `DATA/push-anahtar.json`'dan okunur; yoksa
  üretilir ve dosyaya `0600` izniyle yazılır. `acik`: 65 baytlık sıkıştırılmamış nokta, base64url (tarayıcıya verilir);
  `gizli`: PKCS#8 PEM (hiç dışarı çıkmaz).
- `adresGecerli(endpoint)` — abonelik adresi `https`, kullanıcı adı/şifresiz, port yok ya da 443, IP değil ve
  `fcm.googleapis.com`, `android.googleapis.com`, `push.services.mozilla.com`, `notify.windows.com`, `push.apple.com`
  ya da bunların alt alan adı mı.
- `anahtarGecerli(p256dh, auth)` → `{ p256dh, auth }` ya da `null` — base64/base64url'i base64url'e çevirir; `p256dh`
  65 bayt ve `0x04` ile başlamalı, `auth` 16 bayt; nokta gerçekten P-256 eğrisinde mi (`createPublicKey` ile) denetlenir.
- `sifrele(icerik, p256dh, auth, test?)` → `Buffer` — RFC 8291 `aes128gcm`: geçici ECDH anahtarı, ortak sır, HKDF ile
  anahtar ve nonce, AES-128-GCM, 21 baytlık başlık (tuz, kayıt boyutu 4096, anahtar uzunluğu) + geçici açık anahtar +
  şifreli gövde. `test` yalnız testte RFC örneğini birebir üretmek için sabit gizli anahtar ve tuz verir.
- `vapidBasligi(endpoint)` → `'vapid t=<JWT>, k=<açık anahtar>'` — ES256 imzalı JWT: `aud` = push servisinin kökü,
  `exp` = 12 saat sonra, `sub` = `ayarlar.site.adres` (yoksa `https://egitimevi.org`).
- `bildirimAdresi(kisaAd, kime, baglanti)` — dokununca açılacak adres: `/school/<okul>/?k=<kişi>#/...` (`baglanti`
  `#/` ile başlamıyorsa `#/ana`). `?k=` bildirimin hangi rolüne (rol satırına) geldiğini söyler; uygulama o role geçer.
- İç: `tekGonder` (10 sn zaman aşımı, `TTL: 86400`, `Urgency: high`; ağ hatasında 0 döner), `sirayaAl`, `isle` (en çok
  `ES_ZAMAN = 8` eşzamanlı istek, kuyruk en çok `KUYRUK_SINIRI = 20000`), `bildirimGeldi`.

## Kimle konuşur?

- Çağırdıkları: `crypto`, `fs`, `https`, `path`; `./ayarlar` (site adresi), `./guvenlik` (`hizSinir`), `./yollar`
  (`DATA`), `./veri` → `depo.push.abonelikler`, `depo.push.gecersizSil`, `depo.push.basariYaz`, `depo.genel.olaylar`.
- Onu çağıranlar (grep): `sunucu/index.js` (`baslat`), `sunucu/bolumler/push.js` (`GET /api/push/anahtar` →
  `anahtarlar().acik`; abonelik kaydında `adresGecerli`, `anahtarGecerli`), `sunucu/bolumler/cihaz.js`
  (`bildirimAdresi`), `testler/test-push.js`.
- Tablo: bildirim abonelikleri (şema `011`; depo `push`), okunur, geçersizler silinir, başarı zamanı yazılır.
- Dışarıya giden istekler: yalnız abonelik adresine (izinli push servisleri).

## Nasıl çalışır (adım adım)?

```
bildirim yazıldı (depo.genel → 'bildirim' olayı, liste)
  → bildirimGeldi: alıcıların abonelikleri
      her bildirim: kişi başına dakikada 20'yi aştı mı? (hizSinir 'pushKisi:<id>') → aştıysa atla
      her abonelik: sirayaAl({ t:'Eğitim Evi', b: metin(≤300), u: bildirimAdresi })
  → isle: 8'e kadar eşzamanlı tekGonder
        içerik JSON → sifrele (tarayıcının p256dh/auth) → POST endpoint (VAPID başlığı)
        404/410 → aboneliği sil ; 2xx → başarı zamanı ; diğer → hiçbir şey
```

## Dikkat!

- **SSRF kapalı:** sunucu kullanıcının verdiği rastgele bir adrese istek atmaz; abonelik adresi yalnız bilinen push
  servislerinden biri olabilir, IP yazılamaz, port 443 dışı olamaz.
- Gizli VAPID anahtarı `data/` altında durur (web'den sunulmaz, depoya girmez); kaybolursa yeni çift üretilir ve eski
  abonelikler çalışmaz (tarayıcılar yeniden abone olmalı) — KILAVUZ "yedekle" der.
- `EE_PUSH_GONDERME=0` (testler) iken kuyruğa hiçbir şey alınmaz, dışarı istek gitmez. Değer süreç başında okunur.
- Kişi başına dakikada 20 telefon bildirimi: toplu duyuru yağmurunda telefon susmasın diye. Bildirim veritabanına yine
  yazılır, yalnız telefona gitmez.
- Kuyruk 20000'i geçerse yeni gönderimler sessizce atılır (bellek şişmesin).
- Gönderim hatası (ağ, şifreleme) işi durdurmaz; bildirim ikinci plandadır.
- `bildirimAdresi`'ndeki okul yolu `/school/<kısa-ad>`; eskiden `/<kısa-ad>`'dı (bkz. Son durum).

## Testleri

- `testler/test-push.js` (sunucusuz) — RFC 8291 örneği birebir üretiliyor; rastgele anahtarla şifrelenen içerik tarayıcı
  tarafının hesabıyla geri açılıyor; VAPID imzası açık anahtarla doğrulanıyor; abonelik adresi yalnız bilinen
  servislerden; tarayıcı anahtarları boyut ve biçimce denetleniyor.
- `testler/test-bildirim.js` — bildirimlerin yazılması (telefon gönderimi testte kapalı).
- Elle: gerçek bir tarayıcıda (https ya da localhost) bildirime izin ver; test sunucusunu `EE_PUSH_GONDERME` vermeden
  aç; kendine mesaj gönderttir → telefona/masaüstüne bildirim düşmeli.

## Son durum

- Son commit `24050a2 commit 518` (2026-09-27, servis yoklaması + `/api/cihaz`): açılacak adres hesabı
  `bildirimAdresi()` işlevine çıkarıldı ve dışa açıldı; telefon uygulamasının bildirim yoklaması (`cihaz.js`) aynı
  adresi kullanıyor.
- `fe018dd commit 513`: okul adresi `/<kısa-ad>` → `/school/<kısa-ad>` (okul sayfası adresi değişikliği). Önceki
  `8207ee3 commit 323`, `bd7d108 commit 322` (2026-09-26) dosyanın ilk hâlleri.
- Açık iş yok.
