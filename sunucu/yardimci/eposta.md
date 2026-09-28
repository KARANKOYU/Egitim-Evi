# sunucu/yardimci/eposta.js

Dış paket kullanmadan, Node'un kendi `net`/`tls` modülleriyle yazılmış küçük SMTP istemcisi: bir e-posta gönderir ve sık
kullanılan sağlayıcıların hazır ayarlarını tutar.

## Bu dosya ne yapar?

Eğitim Evi'nin tek npm bağımlılığı `pg`'dir; e-posta için `nodemailer` gibi bir paket yok. Giriş kodu (iki adımlı giriş),
şifre sıfırlama ve e-posta onay bağlantısı gibi postalar bu dosyadaki `gonder` ile doğrudan SMTP konuşarak gönderilir.
Yalnız düz metin, tek alıcı, tek gövde gönderir; ek, HTML ya da çok parçalı ileti yoktur.

İki bağlantı biçimi desteklenir:

- **port 465** — baştan TLS (`guvenli: true`);
- **port 587** — önce düz bağlantı, sonra `STARTTLS` ile TLS'e yükseltme (`guvenli: false`).

Kimlik doğrulama yalnız `AUTH LOGIN`'dir (kullanıcı adı ve şifre base64).

## İçinde neler var?

- **`gonder(ayar, alici, konu, govde)`** — `async`; başarıda `undefined` ile çözülür, sorunda hata atar.
  - `ayar`: `{ sunucu, port, guvenli, kullanici, sifre, gonderen, gorunenAd }`. `sunucu`, `kullanici` ya da `sifre` eksikse hemen
    `Error('E-posta ayarları eksik (sunucu / kullanıcı / şifre)')`. `gonderen` yoksa `kullanici` kullanılır; `gorunenAd` yoksa
    "Eğitim Evi".
  - `alici`: tek e-posta adresi. Bu dosya adresi DENETLEMEZ (aşağıya bak).
  - `konu`: Türkçe karakterli olabilir; MIME ile kodlanır.
  - `govde`: düz metin (UTF-8); base64 ile 76 karakterlik satırlara bölünerek gönderilir.
  - Hatalar: bağlantı ya da her komut için 15 saniyelik zaman aşımı (`SMTP zaman aşımı: <komutun ilk 40 karakteri>`,
    `SMTP bağlantı zaman aşımı`), sunucunun beklenmeyen yanıt kodu (`SMTP beklenmeyen yanıt (535): …` — ilk 160 karakter),
    soket hatası (olduğu gibi). Hata mesajında şifre geçmez; ama `AUTH` aşamasında zaman aşımı olursa mesajdaki "komutun ilk 40
    karakteri" base64 kullanıcı adı ya da şifre olabilir (bkz. Dikkat).
- **`basligiKodla(metin)`** — `=?UTF-8?B?<base64>?=` biçiminde MIME kodlu başlık. Türkçe konu ve görünen ad bozulmasın diye.
  Örnek: `basligiKodla('Giriş')` → `=?UTF-8?B?R2lyacWf?=`.
- **`SAGLAYICILAR`** — hazır ayarlar (anahtar → `{ ad, sunucu, port, guvenli, not }`): `gmx` (587, STARTTLS), `gmail` (465, TLS;
  2 adımlı doğrulama + uygulama şifresi), `yandex` (465), `zoho` (465), `brevo` (587), `mailjet` (587), `smtp2go` (587). `not`
  alanı kurulum aracında kullanıcıya gösterilen kısa ipucudur.

İç işlevler:

- `komut(sok, metin, beklenen)` — satırı `\r\n` ile yollar (`metin === null` ise hiçbir şey yollamaz, yalnız karşılama
  bekler), gelen veriyi biriktirir; son satır `NNN ` (üç rakam + boşluk) biçiminde gelince yanıt bitmiş sayılır — çok satırlı
  yanıtların ara satırları `NNN-` ile gelir. Kod `beklenen` listesinde değilse hata. Dinleyicileri her durumda temizler.
- `baglantiBekle(sok, olay)` — `connect` ya da `secureConnect` olayını 15 saniye bekler.

## Kimle konuşur?

- Çağırdığı: yalnız Node'un `net` ve `tls` modülleri; ayarlarda yazan SMTP sunucusuna bağlanır.
- Onu çağıranlar:
  - [../guvenlik.md](../guvenlik.md) — iki adımlı giriş kodu (`girisKoduGonder`), şifre sıfırlama bağlantısı (`sifirlamaGonder`)
    ve e-posta onay bağlantısı
    (`onayBaglantisiGonder`: kayıt ve e-posta değiştirme). Ayar `ayarlar.eposta`'dan gelir (bkz. [../ayarlar.md](../ayarlar.md)).
  - `araclar/eposta-ayarla.js` — kurulumda sağlayıcı seçtirir (`SAGLAYICILAR`) ve "Egitim Evi deneme e-postasi" konulu deneme
    postası gönderir.
- Veritabanı kullanmaz.

## Nasıl çalışır (adım adım)?

```
gonder
  1. ayar denetimi (sunucu, kullanici, sifre)
  2. guvenli ? tls.connect (secureConnect bekle) : net.connect (connect bekle)
  3. 220 karşılamayı bekle
  4. EHLO egitimevi                          → 250
  5. (587 ise) STARTTLS → 220; aynı soketi TLS'e sar; yeniden EHLO → 250
  6. AUTH LOGIN → 334; base64(kullanici) → 334; base64(sifre) → 235
  7. MAIL FROM:<gonderen> → 250;  RCPT TO:<alici> → 250/251;  DATA → 354
  8. Başlıklar (From görünen ad kodlu, To, Subject kodlu, MIME-Version, Content-Type text/plain utf-8,
     Content-Transfer-Encoding base64, Date) + boş satır + base64 gövde + "." → 250
  9. QUIT (221 beklenir; hata verse de önemsenmez)
 10. finally: sok.end()
```

TLS sertifikası Node'un varsayılan denetimiyle doğrulanır (`servername` ayarlı, `rejectUnauthorized` kapatılmamış).

## Dikkat!

- **Adres denetimi çağıranın işi.** `alici` ve `gonderen` `RCPT TO:<…>`, `MAIL FROM:<…>` ve `To:` satırlarına olduğu gibi
  yazılır. İçinde satır sonu olan bir adres SMTP komutu ekleyebilirdi. Bugün adresler kayıtta `sunucu/ortak.js`'teki
  `EPOSTA_DESENI` (`/^[!#-?A-~]+@[!#-?A-~]+\.[!#-?A-~]{2,}$/` — boşluk, satır sonu ve denetim karakteri içermez) ile
  süzüldüğü için güvenli; yeni bir çağıran eklerken adresi aynı desenden geçir.
- Konu base64 kodlandığı için başlık eklemeye kapalı; gövde base64 olduğu için "." ile başlayan satır (SMTP nokta sorunu) da
  çıkmaz.
- Dosya başındaki yorum "server.js (giriş kodu göndermek için)" diyor; bugün giriş kodunu `sunucu/guvenlik.js` gönderiyor
  (yorum eski kalmış).
- Bağlantı kurulamazsa (adım 2'de hata) soket `end` edilmeden bırakılır; `try/finally` bağlantıdan sonra başlar. Soket
  hatası (ör. bağlantı reddedildi) soketi zaten kapatır; ama 15 saniyelik `SMTP bağlantı zaman aşımı` durumunda söz yalnız
  reddedilir, soket kapatılmaz (`destroy` yok) ve işletim sistemi vazgeçene kadar askıda kalabilir. Küçük bir sızıntı; testsiz.
- Zaman aşımı hata mesajına yollanan komutun ilk 40 karakteri eklenir; `AUTH LOGIN` sonrasında bu, base64 kullanıcı adı ya da
  base64 şifre olabilir. `sunucu/guvenlik.js` bu hata mesajını `console.error` ile sunucu günlüğüne yazar (istemciye
  göndermez); yani zaman aşımı AUTH adımında olursa şifrenin base64 başı günlükte görünür. (Kodda değişiklik yapılmadı; güvenlik
  işine not.)
- `baglantiBekle`'nin taktığı `once('error')` dinleyicisi başarılı bağlantıdan sonra da takılı kalır; komutlar arasında (dinleyici
  yokken) gelen ilk soket hatasını o yutar.
- Tek gönderim tek bağlantıdır; toplu gönderim ya da kuyruk yoktur. Gmail gibi sağlayıcıların günlük sınırı (~500) var; bu
  dosya sayaç tutmaz.

## Testleri

- Sunucusuz birim testi yok; SMTP konuşması testlerde gerçek sunucuya gönderilmez.
- Sunuculu testler gerçek posta göndermez. `sunucu/guvenlik.js` e-posta gidemediğinde (ayar yok ya da `gonder` hata attı) kodu
  sunucu penceresine yazar ve `yontem: 'konsol'` döner; giriş kodu ve sıfırlama akışları bu yedek yolla denenir (bkz.
  [../guvenlik.md](../guvenlik.md)).
- Elle: `node araclar/eposta-ayarla.js` ile sağlayıcı seçip deneme postası gönder (kendi SMTP bilgilerinle; bilgiler `data/`
  altına yazılır, depoya girmez).

## Son durum

- Dosya `67bfabe commit 29` (2026-08-28) ile geldi; `4b887db commit 30` `SAGLAYICILAR` listesini ve dışa açılmasını ekledi
  (kurulum aracı `araclar/eposta-ayarla.js` ile birlikte). O günden beri değişmedi.
- Sıradaki işlerden "Sistem" işi "e-posta sağlığı + sayaç" getirecek (gönderim sayısı ve hata durumunun izlenmesi); bu dosyaya
  gönderim sonucu sayacı eklenebilir. Kullanıcı e-posta servisini seçmedi ("sonra bakarım"); seçilirse `SAGLAYICILAR`'a eklenir.
