# testler/test-push.js

Telefon/tarayıcı bildiriminin (Web Push) güvenlik çekirdeğini, `sunucu/push.js`'i, sunucusuz ve veritabanısız deneyen birim test
paketi: RFC 8291 şifrelemesi, VAPID imzası, abonelik adresi süzgeci ve tarayıcı anahtarlarının denetimi (21 denetim).

## Bu dosya ne yapar?

Bir öğrenciye "Servis evine 100 metreden yakın" bildirimi düştüğünde sunucu bunu kişinin tarayıcısının push servisine
(Google, Mozilla, Apple, Microsoft) gönderir. Bu yolun üç değişmezi var ([../sunucu/push.md](../sunucu/push.md)):

1. **İçerik uçtan uca şifreli:** push servisi bildirimin metnini okuyamamalı. Şifreleme paketsiz, elle yazılmış
   (RFC 8291 + RFC 8188, `aes128gcm`); küçük bir hata bildirimin hiç açılmamasına ya da güvenliğin sessizce bozulmasına yol açar.
2. **Sunucu kim olduğunu imzayla söyler (VAPID, RFC 8292):** imza sunucunun açık anahtarıyla doğrulanabilmeli, anahtar yeniden
   açılışta değişmemeli.
3. **Sunucu rastgele adrese istek atmaz:** abonelik adresi yalnız bilinen push servislerinden biri olabilir; yoksa bir kullanıcı
   "abonelik" diye iç ağ adresi (`127.0.0.1`, bulut üst veri adresi `169.254.169.254`) verip sunucuya oraya istek attırabilirdi
   (SSRF).

Paket bu işlevleri doğrudan çağırır ve sonucu **tarayıcının yapacağı hesapla** karşılaştırır: kendi içinde RFC'deki çözme
adımlarını (`coz`) yazar, sunucunun şifrelediğini onunla açar. RFC 8291'in Ek A örneğini de birebir üretir. Yaklaşık
0,2 saniye sürer, ağ ya da veritabanı kullanmaz.

## İçinde neler var?

### Hazırlık ve yardımcılar

- `GECICI` — işletim sisteminin geçici klasöründe `ee-push-…` adlı yeni bir klasör (`fs.mkdtempSync`). `process.env.EE_DATA`
  ona çevrilir, `sunucu/push.js` ANCAK BUNDAN SONRA `require` edilir: VAPID anahtar dosyası (`push-anahtar.json`) gerçek
  `data/` yerine bu klasöre yazılır. Sonda klasör silinir (`fs.rmSync`).
- `kontrol(ad, sart, detay)` — `GECTI` / `KALDI` satırı.
- `coz(govde, uaEcdh, authSir)` — tarayıcının çözmesi (RFC 8291 §3.4 + RFC 8188): gövdenin başından tuz (16 bayt), kayıt boyu
  (`rs`, 4 bayt), anahtar boyu ve sunucunun geçici açık anahtarını okur; ECDH ortak sırrından HKDF ile `"WebPush: info\0"`
  bilgisiyle anahtar malzemesini, sonra `"Content-Encoding: aes128gcm\0"` ile 16 baytlık içerik anahtarını ve
  `"Content-Encoding: nonce\0"` ile 12 baytlık nonce'u türetir; AES-128-GCM ile açar (etiket son 16 bayt), sondaki sıfır
  dolguyu atar. Dönen `{ rs, ayrac, icerik }` (`ayrac` son kaydın ayracı).

### 1) RFC 8291 örneği (1)

`push.sifrele` RFC 8291 Ek A'nın düz metni ("When I grow up, I want to be a watermelon"), tarayıcı açık anahtarı ve auth sırrıyla,
örneğin sabit sunucu gizli anahtarı ve tuzu verilerek (`sifrele`'nin yalnız testler için olan dördüncü argümanı `{ asGizli, tuz }`)
çağrılır; base64url çıktı RFC'deki sonuçla harfi harfine aynı olmalı.

### 2) Şifrele / çöz turu (5)

Rastgele bir tarayıcı anahtar çifti (`prime256v1`) ve 16 baytlık auth sırrı üretilir; içerik Türkçe harfli bir bildirim JSON'u
(`{ t, b, u }`).

- `coz` sunucunun şifrelediğini açıyor, içerik birebir aynı.
- Son kayıt ayracı `2`, kayıt boyu `4096`.
- Aynı içerik ikinci kez şifrelenince tuz (ilk 16 bayt) ve geçici sunucu anahtarı (21.–86. baytlar) farklı.
- Tek biti değiştirilmiş gövde açılmıyor (GCM bütünlüğü).
- Başka bir cihazın anahtarıyla açılmıyor.

### 3) VAPID (8)

`push.vapidBasligi('https://fcm.googleapis.com/fcm/send/abc')`:

- biçim `vapid t=<başlık>.<yük>.<imza>, k=<açık anahtar>`;
- başlıkta `alg: 'ES256'`, yükte `aud` yalnız servisin kökü (`https://fcm.googleapis.com`, yol yok);
- `exp` şimdiden sonra ve en çok 24 saat ileride (kod 12 saat koyar);
- `sub` `https://` ya da `mailto:` ile başlıyor;
- imza `k`'daki açık anahtarla (JWK'ye çevrilip, `ieee-p1363` biçiminde) doğrulanıyor;
- `k`, `push.anahtarlar().acik` ile aynı (sunucunun `GET /api/push/anahtar` ucunun verdiği değer bu);
- anahtar dosyası `GECICI/push-anahtar.json` yazılmış ve içindeki açık anahtar kullanılanla aynı (yeniden açılışta değişmez).

Biçim eşleşmezse ortadaki beş denetim hiç çalışmaz (yalnız "başlık biçimi doğru" kalır).

### 4) Abonelik adresi süzgeci (2)

- `adresGecerli` beş gerçek biçimi kabul ediyor: `fcm.googleapis.com`, `updates.push.services.mozilla.com`,
  `wns2-db5p.notify.windows.com`, `web.push.apple.com`, `android.googleapis.com` (hepsi `https`).
- Şunların hiçbiri geçmiyor: `http://`, `localhost`, `127.0.0.1`, `[::1]`, `fcm.googleapis.com.saldiri.com`,
  `sahtefcm.googleapis.com`, `:8443` portu, `kullanici:sifre@`, `fcm.googleapis.com@saldiri.com`, `169.254.169.254`,
  `file:///etc/passwd`, `javascript:alert(1)`, boş metin, `null`, `42`.

### 5) Tarayıcı anahtarları (5)

- Geçerli `p256dh` + `auth` kabul (`anahtarGecerli` doluyu döner).
- Dolgulu standart base64 (`+`, `/`, `=`) base64url'e çevrilip kabul.
- Yanlış boy (64 bayt), sıkıştırılmış nokta (33 bayt), kısa auth (`'abc'`), nesne ve dizi → reddediliyor.
- Eğri dışı nokta (`0x04` + 64 tane `7`): `sifrele` hata atıyor (gerçek gönderimde `tekGonder` bunu yakalayıp o aboneyi
  sessizce atlar).
- Aynı nokta abonelikte reddediliyor (`anahtarGecerli`, P-256 üstünde mi diye bakar).

Toplam 1 + 5 + 8 + 2 + 5 = 21. Sonunda `GECTI: 21   KALDI: 0`; `KALDI` varsa çıkış kodu 1.

## Kimle konuşur?

- **Modüller:** Node'un `crypto`, `fs`, `os`, `path`'i ve `sunucu/push.js` ([../sunucu/push.md](../sunucu/push.md)). `push.js`
  yüklenince `./ayarlar`, `./guvenlik`, `./yollar` ve `./veri`'yi de yükler; ama paket ne ayarları okutur ne veritabanına
  bağlanır ne de ağa çıkar.
- **Kullandığı işlevler:** `sifrele`, `vapidBasligi`, `anahtarlar`, `adresGecerli`, `anahtarGecerli`.
- **Koruduğu kod:** `sunucu/push.js` — şifreleme ve VAPID; ayrıca bu işlevleri kullanan abonelik ucu
  [../sunucu/bolumler/push.md](../sunucu/bolumler/push.md) (`POST /api/push/abone` adres ve anahtar denetimini bunlarla yapar).
  Tarayıcı tarafı: [../public/js/parcalar/04b-bildirim-izni.md](../public/js/parcalar/04b-bildirim-izni.md) (abonelik) ve
  [../public/sw.md](../public/sw.md) (bildirimi gösteren hizmet çalışanı); paket bunları çalıştırmaz.
- **Tablolar:** yok.
- **Onu çalıştıran:** `testler/tumtest.sh`, sunucusuz paketler döngüsünde ikinci sırada (`test-xlsx`'ten sonra, `test-kucult`'tan
  önce).

## Nasıl çalışır (adım adım)?

```
GECICI klasör ─► EE_DATA = GECICI ─► require(sunucu/push.js)
1) RFC 8291 Ek A: sabit anahtar + tuz ─► çıktı = RFC'deki
2) rastgele tarayıcı anahtarı ─► sifrele ─► coz (tarayıcı hesabı) = aynı içerik
   ayraç 2, rs 4096 ; ikinci şifrelemede tuz + geçici anahtar yeni ; bozuk bit / başka cihaz açamaz
3) vapidBasligi ─► biçim, ES256, aud = kök, exp ≤ 24 sa, sub, imza doğru, k = anahtarlar().acik
   GECICI/push-anahtar.json var ve aynı anahtar
4) adresGecerli: 5 kabul, 15 red
5) anahtarGecerli: geçerli / dolgulu kabul ; bozuklar red ; eğri dışı nokta: sifrele hata, abonelik red
GECICI silinir ─► GECTI / KALDI
```

## Dikkat!

- **Yakalayıcı yok.** Dosyanın gövdesi düz sıralı koddur; `try/catch` yalnız beklenen üç hatanın çevresindedir. Beklenmeyen bir
  hata (ör. anahtar dosyası yazılmadıysa 3. bölümdeki `readFileSync`) Node'un kendi hata çıktısıyla süreci düşürür:
  `GECTI:` satırı basılmaz (`tumtest.sh` "PAKET CALISMADI" yazar) ve geçici klasör silinmeden kalır.
- **Red listesinin son öğesi denenmiyor.** `ret` dizisinin sonundaki `{ toString: () => 'https://fcm.googleapis.com/x' }`
  nesnesi `slice(0, -1)` ile dışarıda bırakılır; çünkü `adresGecerli` girdisini `String()`'e çevirdiği için bu nesneyi KABUL
  eder (3 Ekim'de sunucusuz denendi: `true`). Gerçekte sorun değil: abonelik ucu adresi yalnız metinse alır
  (`typeof body.endpoint === 'string'`), JSON gövdesinden de böyle bir nesne gelemez.
- **`sub` varsayılanı deneniyor.** Paket ayarları yüklemediği için `ayarlar.site` boştur ve VAPID `sub`'ı koddaki varsayılan
  `https://egitimevi.org` olur; ayardaki site adresi (`site.adres`) bu pakette hiç denenmez.
- **Yorumla kod arasında küçük fark:** denetim adı "süre 24 saati geçmiyor" der; kod 12 saat koyar, denetim 24 saate kadar her
  değeri kabul eder (RFC 8292'nin üst sınırı).
- **`sifrele`'nin dördüncü argümanı yalnız test içindir:** sabit sunucu anahtarı ve tuz vermek RFC örneğini üretmek için;
  gerçek gönderimde (`tekGonder`) hiç verilmez, her gönderimde yeni anahtar ve tuz üretilir (2. bölüm bunu da denetler).
- **Denenmeyenler:** gönderim kuyruğu (aynı anda 8, en çok 20 000 bekleyen), `404`/`410` gelen aboneliğin silinmesi, kişi başına
  dakikada 20 bildirim sınırı, `bildirimAdresi`, `baslat` ve gerçek bir push servisine gönderim. Test sunucusu
  `EE_PUSH_GONDERME=0` ile açıldığı için sunuculu paketlerde de dışarıya bildirim gitmez. `bildirimAdresi`'nin adı `testler/`
  altında hiçbir dosyada geçmez (3 Ekim'de `grep` ile bakıldı), ama çıktısı başka yoldan denenir: telefonun bildirim
  yoklaması (`GET /api/cihaz/bildirimler`, `sunucu/bolumler/cihaz.js`) bağlantıyı bu işlevle kurar ve
  `testler/test-servis-yoklama.js` dönen `baglanti`'nın `/school/<kısa ad>/?k=<kişi>#/…` biçiminde olduğuna bakar. Push
  kuyruğuna giren `u` alanı ise hiçbir pakette denenmez.
- Paralel koşularda çakışmaz: her koşu `mkdtemp` ile kendi rastgele adlı klasörünü açar.

## Testleri

- Bu dosyanın kendisi testtir; `testler/tumtest.sh` her tam koşuda (sunucusuz paketler arasında) çalıştırır. Aynı kodun uç
  tarafı: `testler/test-servis-konum.js` (`/api/push/anahtar`, `/api/push/abone` — iç ağ adresinin reddi, kişi başına abonelik,
  `/api/push/durum`), `testler/test-yetiskin.js`, [yetki-denetimi.md](yetki-denetimi.md) (push uçlarının rolleri),
  `testler/test-servis-yoklama.js` (`bildirimAdresi`'nin kurduğu bağlantı, telefonun bildirim yoklamasında).
- Elle (proje kökünde; sunucu gerekmez):

  ```
  node testler/test-push.js
  ```

- 3 Ekim'de bu belge için iki kez çalıştırıldı (geçici klasör `TEMP`/`TMP` ile çalışma klasörüme yönlendirilerek): ikisinde de
  `GECTI: 21   KALDI: 0`, çıkış 0, yaklaşık 0,2 saniye; paket iki seferde de kendi geçici klasörünü sildi.

## Son durum

- `git log`: tek commit. Dosya `1a4e368 commit 326` (2026-09-26) ile 125 satır olarak eklendi (bütün bölümler o günden) ve o
  günden beri değişmedi. Koruduğu `sunucu/push.js`'in son değişikliği `24050a2 commit 518`'dedir (açılacak adresin
  `bildirimAdresi()`'ne çıkarılması); bu paket o işleve dokunmaz.
- Bilinen açıklar (kod değiştirilmedi): yakalayıcı olmaması; `bildirimAdresi`'nin bu pakette denenmemesi (yalnız
  `test-servis-yoklama.js`'te telefonun bildirim yoklaması üzerinden dolaylı olarak deneniyor).
- Planlı işlerden bu dosyayı doğrudan etkileyen yok: 4. bölümdeki sıradaki işlerin hiçbiri push şifrelemesini, VAPID'i ya da
  abonelik süzgecini değiştirmeyi tanımlamıyor (Android uygulaması bildirimi push ile değil `/api/cihaz/bildirimler` yoklamasıyla
  alıyor).
