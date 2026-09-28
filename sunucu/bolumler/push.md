# sunucu/bolumler/push.js

Tarayıcı/telefon bildirimi aboneliği (`/api/push`): sunucunun açık VAPID anahtarını verme, Web Push aboneliğini yazma,
"bu cihazdaki abonelik benim mi" sorusu ve aboneliği iptal etme.

## Bu dosya ne yapar?

Kişi sitede "Bildirimleri aç"a basıp tarayıcıya izin verince, tarayıcı bir abonelik üretir (push servisinin adresi
`endpoint` + iki anahtar `p256dh`, `auth`). Ön yüz bu aboneliği buraya yazar; sonra kişiye bir bildirim düştüğünde (yeni
mesaj, servis yaklaştı…) sunucu onu telefonuna/tarayıcısına gönderir. Gönderme, şifreleme ve VAPID işi bu dosyada DEĞİL,
`sunucu/push.js`'tedir ([push.md](../push.md)); bu dosya yalnız aboneliklerin kapısıdır.

Dosya başı yorumu iki güvenlik kararını söyler: abonelik adresi yalnız bilinen push servislerinden kabul edilir (FCM,
Mozilla, Apple, Microsoft — sunucu iç ağa ya da rastgele bir adrese istek atmaya zorlanamasın); adres URL'ye değil
GÖVDEYE yazılır (günlüklere düşmesin). Abonelik kişinindir: okul rolüyle girilse de bağlı olduğu yetişkin (ana)
hesabına yazılır, böylece kişinin her rolüne gelen bildirim aynı cihaza düşer.

Yerel Android uygulaması Web Push kullanmaz; bildirimleri `/api/cihaz/bildirimler` ile yoklar ([cihaz.md](cihaz.md)).

## İçinde neler var?

### Sabit

- `KISI_BASINA` — 5: sahibin en çok 5 aboneliği kalır, fazlası (en eskiler) silinir.

### Dışa açılan

- `uclar(k)` — `p === 'push'` ise `pushUclari(k)`, değilse `false`.

### İç işlev: `pushUclari(k)`

Önce `need()` (girişsiz 401, onaysız 403). `push` `ROLSUZ_SERBEST`'te: rolsüz yetişkin de abone olabilir. Sahip =
`me.anaHesapId || me.id`.

- **`GET /api/push/anahtar`** → `{ anahtar }` — sunucunun açık VAPID anahtarı (base64url, 65 bayt); tarayıcı abonelik
  açarken `applicationServerKey` olarak kullanır.

GET dışındaki yöntemler: POST değilse hiçbir şey yazılmaz (yönlendirici 404 verir). POST'larda önce `endpoint`: metin, 10–1000
harf ve `push.adresGecerli` (https, bilinen push servisi ya da alt alanı, port yok/443, IP değil, kullanıcı adı/şifresiz)
olmalı; değilse 400 "Bu tarayıcının bildirim adresi tanınmadı.".

- **`POST /api/push/abone`** — gövde `{ endpoint, keys: { p256dh, auth } }`. Kişi başına saatte 20 (429 "Çok sık denedin.
  Biraz sonra tekrar dene."). Anahtarlar `push.anahtarGecerli`'den geçmeli (p256dh 65 bayt ve P-256 eğrisinde, auth 16
  bayt; standart base64 da düzeltilip kabul) — değilse 400 "Bu tarayıcının bildirim anahtarı geçersiz.". Yazım
  (`depo.push.aboneYaz`): adres yeni ise eklenir; adres ZATEN kayıtlıysa ancak AYNI anahtarlarla gelirse (aynı tarayıcı)
  yeni sahibe taşınır; farklı anahtarla gelirse 409 "Bu bildirim adresi başka bir abonelikte kayıtlı. Bildirimleri
  kapatıp yeniden aç." (depo yorumu: adresi bir yerden öğrenip kendi anahtarıyla gönderen başkasının bildirimlerini
  devralamaz). Sonra sahibin 5'ten fazla aboneliği silinir. Cevap `{ ok: true }`.
- **`POST /api/push/durum`** — gövde `{ endpoint }` → `{ benim: true|false }`. Kod yorumu: ortak cihazda başka hesaba ait
  kalmış abonelik tarayıcıda kapatılır (ön yüz `benim: false` görünce aboneliği bırakır).
- **`POST /api/push/iptal`** — gövde `{ endpoint }`; yalnız SAHİBİNİN aboneliği silinir (başkasınınkine dokunmaz, yine de
  `{ ok: true }` döner).

## Kimle konuşur?

- Çağırdıkları: `../guvenlik` (`hizSinir`); `../http` (`bad`, `ok`); `../ortak` (`uid`); `../push` (`anahtarlar`,
  `adresGecerli`, `anahtarGecerli`); `../veri` (`depo`).
- Depo ve tablo: `depo.push` (`sunucu/veri/depo/push.js`) → `push_abonelikleri`: `aboneYaz`, `fazlasiniSil`,
  `kisiAbonesiMi`, `aboneSil`. (Gönderim sırasında `sunucu/push.js` aynı tablodan `abonelikler`, `gecersizSil`,
  `basariYaz` kullanır.)
- Onu çağıran: yalnız `sunucu/api.js` (`BOLUM.push`).
- Ön yüz: `public/js/parcalar/04b-bildirim-izni.js` (izin iste, `anahtar` al, `abone`, `durum`, `iptal`); bildirimi
  gösteren servis çalışanı `public/sw.js`.
- Android uygulaması bu uçları çağırmıyor (grep).

## Nasıl çalışır (adım adım)?

```
Tarayıcı: Notification.requestPermission()
   GET  /api/push/anahtar            -> VAPID açık anahtar
   pushManager.subscribe(anahtar)    -> { endpoint, keys }
   POST /api/push/abone { endpoint, keys }
        need ─ endpoint bilinen serviste mi ─ 20/saat ─ anahtarlar geçerli mi
        aboneYaz: yeni -> ekle ; var + aynı anahtar -> bu hesaba taşı ; var + başka anahtar -> 409
        fazlasiniSil(5)
Açılışta:  POST /api/push/durum -> benim değilse tarayıcı aboneliği bırakır
Kapatma:   POST /api/push/iptal
Gönderim:  sunucu/push.js (bildirim yazılınca, bu dosyadan bağımsız)
```

## Dikkat!

- **Sunucu tarafı istek sahteciliğine karşı** (SSRF) adres süzgeci şarttır: sunucu her bildirimde bu adrese istek atar;
  süzgeç olmasa bir kullanıcı sunucuyu iç ağdaki bir adrese vurdurabilirdi. Süzgecin kendisi `sunucu/push.js`'te.
- **Devralma koruması** veritabanı sorgusunda: `ON CONFLICT (endpoint) DO UPDATE … WHERE` anahtarlar aynıysa. Ortak
  cihazda hesap değişince aynı tarayıcı aboneliği (aynı anahtarlar) yeni hesaba taşınır, eskisinden düşer (test).
- Abonelik ana hesaba yazılır; rol satırıyla girilse de `durum` ve `iptal` ana hesaba göre çalışır.
- Geçersiz `endpoint` denetimi alt yoldan ÖNCE yapılır: `/api/push/<bilinmeyen>`'e geçerli adresli POST 404, geçersiz
  adresli POST 400 alır.
- 5 abonelik sınırı sessizdir: 6. cihaz eklenince en eski cihazın aboneliği uyarısız silinir.
- Push servisi aboneliği geçersiz sayarsa (404/410) silinmesi gönderim tarafında (`sunucu/push.js`) yapılır.

## Testleri

- `testler/test-servis-konum.js` — açık anahtar giriş yapana veriliyor; geçerli abonelik yazılıyor; iç ağ, http, sahte
  alan, uzun adres, bozuk anahtar reddi; `durum` sahibine "benim", başkasına değil; aynı cihaz başka hesaba geçince
  eskisinden düşüyor; başka anahtarla aynı adres devralınamıyor; başkasının aboneliği iptal edilemiyor, kendi aboneliğini
  iptal ediyor.
- `testler/test-push.js` — `sunucu/push.js`'in şifreleme, VAPID ve adres/anahtar denetimleri (açık anahtarın
  `/api/push/anahtar` ile aynı olduğu, eğri dışı noktanın abonelikte reddi).
- `testler/test-yetiskin.js` — abonelik kişinindir (her rolünden aynı).
- `testler/yetki-denetimi.js`.
- Elle: tarayıcıda giriş yap, Ayarlar'da bildirimleri aç; geliştirici araçlarında `POST /api/push/abone` isteğini gör.

## Son durum

- Son commit `86af98a commit 506` (2026-09-26): `aboneYaz` sonucu denetlenmeye başladı — adres başka anahtarla kayıtlıysa
  409 (abonelik devralma koruması).
- `a1c5d41 commit 324` (2026-09-26): dosyanın ilk hâli (56 satır) ve ön yüzün `04b-bildirim-izni.js` parçası.
- Açık iş yok. Sıradaki işlerden "Sistem: … yeni cihaz uyarısı + açık oturumlar" bildirim tarafına dokunabilir; bu dosya
  için yazılı bir değişiklik yok.
