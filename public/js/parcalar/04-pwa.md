# public/js/parcalar/04-pwa.js

Siteyi telefona/bilgisayara uygulama gibi kurdurma (PWA): servis çalışanını (`/sw.js`) kaydeder, tarayıcının kurulum
önerisini yakalayıp üst çubuktaki kurulum düğmesine (`#btnKur`) bağlar, elle kurulum yardımını gösterir.

## Bu dosya ne yapar?

Eğitim Evi bir web sitesi ama telefonda ana ekrana eklenip ayrı bir simgeyle, tarayıcı çubuğu olmadan açılabilir
("Progressive Web App"). Bunun iki şartı var: bir `manifest.json` (ad, simgeler, renk; `public/manifest.json`) ve kayıtlı bir
servis çalışanı (`public/sw.js`). Bu dosya ikincisini kaydeder ve kurulum düğmesini yönetir.

Servis çalışanı ayrıca iki işe yarar: ağ yokken uygulamanın kabuğunu önbellekten açmak ve telefon bildirimlerini (Web Push)
almak. Yani [04b-bildirim-izni.md](04b-bildirim-izni.md)'deki bildirimler de bu kayda dayanır.

Chrome ve Edge bir siteyi "kurulabilir" bulduğunda `beforeinstallprompt` olayı gönderir. Dosya bu olayı saklar, tarayıcının
kendi çubuğunu bastırır ve üst çubuktaki düğmeyi görünür yapar; kişi düğmeye basınca tarayıcının kurulum penceresi açılır.

(Android için ayrıca yerel bir uygulama da var. `/indir` sayfası — açılış ve giriş sayfalarının üst şeridindeki "İndir"
bağlantısı; `public/indir/indir.html` ve `public/js/indir.js` — hem onu hem iPhone/iPad'de Safari'den "Ana Ekrana Ekle"
adımlarını anlatır. O sayfa bu dosyayı kullanmaz, kendi başına çalışır.)

## İçinde neler var?

- `kurulumOlayi` — saklanan `beforeinstallprompt` olayı ya da `null`.
- `kurButonu(goster)` — `#btnKur`'u gösterir/gizler (`style.display`). Düğme `public/index.html`'de uygulamanın üst
  çubuğunda, başta `display:none`; üzerinde yazı yok, indirme simgesi ve "Uygulamayı telefonuna/bilgisayarına kur" ipucu
  (`title`) var.
- `pwaKur()` — açılışta bir kez:
  1. Tarayıcı servis çalışanını destekliyor ve bağlam güvenliyse (`https://` ya da `localhost`): `navigator.serviceWorker
     .register('/sw.js')`. Sayfa zaten yüklendiyse hemen, değilse `load` olayında. Başarısızsa yalnız konsola uyarı
     yazılır ("Servis işçisi kaydedilemedi"), uygulama çalışmaya devam eder.
  2. `beforeinstallprompt` → `preventDefault()`, olayı sakla, düğmeyi göster.
  3. `appinstalled` → olayı unut, düğmeyi gizle, `localStorage`'a `ee_kuruldu = '1'` yaz.
  4. Düğmeye tıklama: saklı olay varsa `prompt()`; kişi ne seçerse seçsin (`userChoice`) olay unutulur, düğme gizlenir.
     Saklı olay yoksa `kurulumYardimi()`.
- `kurulumYardimi()` — "Uygulamayı yükle" penceresi ([03-mesaj-modal.md](03-mesaj-modal.md) `modalAc`):
  - bağlam güvenli değilse: "Site http:// üzerinden açıldığı için tarayıcı otomatik kurulum önermiyor…" bilgi kutusu;
  - iPhone/iPad (tarayıcı kimliğinde `iPhone|iPad|iPod`): Safari'de Paylaş → Ana Ekrana Ekle → Ekle;
  - öteki cihazlar: Android Chrome (⋮ menüsü → Uygulamayı yükle / Ana ekrana ekle) ve bilgisayarda Chrome/Edge (adres
    çubuğundaki kurulum simgesi ya da menüden Uygulamayı yükle);
  - altta: "Kurunca uygulama ayrı bir simgeyle açılır, tarayıcı çubuğu görünmez."

## Kimle konuşur?

- Çağırdıkları: `$` ([01-yardimcilar.md](01-yardimcilar.md)), `modalAc` ([03-mesaj-modal.md](03-mesaj-modal.md)),
  tarayıcının `navigator.serviceWorker`, `localStorage`.
- Dosyalar: `public/sw.js` (servis çalışanı: kurulumda kabuk dosyalarını önbelleğe alır; `/api/` isteklerini asla
  önbelleğe almaz; sayfa ve dosyalarda önce ağ, ağ yoksa önbellek; `push` ve `notificationclick` olayları),
  `public/manifest.json` ve `public/simge-192.png`, `public/simge-512.png`. Sunucu bunları düz statik dosya olarak verir
  ([../../../sunucu/http.md](../../../sunucu/http.md)).
- Onu kullananlar: `26-baslat.js` — açılışta `pwaKur()` (giriş ekranındayken de; kurulum girişten bağımsız). Başka hiçbir
  parça bu dosyanın adlarını kullanmaz.
- Bu kayda dayananlar: [04b-bildirim-izni.md](04b-bildirim-izni.md) (`navigator.serviceWorker.ready`, `pushManager`).
- CSS: `#btnKur` üst çubuk düğmesi olarak `.iconbtn` görünümünü alır (`public/css/parcalar/03-iskelet.css`,
  `07-mobil.css`, `12-ikonlar.css`); pencere `06-modal.css`, bilgi kutusu `.msg.bilgi` ve `.hint` `02-form.css`.
- Rol: servis çalışanı herkese (giriş yapmamış ziyaretçi dahil) kaydedilir; kurulum düğmesi giriş yapmış herkesin üst
  çubuğundadır.

## Nasıl çalışır (adım adım)?

```
26-baslat.js ─► pwaKur()
   ├─ güvenli bağlam + serviceWorker ─► register('/sw.js')   (http:// LAN adresinde bu adım atlanır)
   ├─ beforeinstallprompt (Chrome/Edge "kurulabilir" dedi)
   │     preventDefault, kurulumOlayi = e, #btnKur görünür
   ├─ #btnKur tıklandı
   │     kurulumOlayi var ─► tarayıcının kurulum penceresi ─► (kabul/ret) düğme gizlenir
   │     yok             ─► kurulumYardimi() penceresi
   └─ appinstalled ─► düğme gizlenir, ee_kuruldu = '1'
```

## Dikkat!

- **`kurulumYardimi` bugün ulaşılamaz durumda.** Düğme başta gizli ve yalnız `beforeinstallprompt` gelince görünür; olay
  gelmişse tıklama `prompt()`'u açar, sonra düğme yine gizlenir. Yani düğme "saklı olay yokken" hiç görünmez ve elle kurulum
  yardımı (özellikle `beforeinstallprompt` hiç göndermeyen iPhone Safari için yazılan adımlar) açılmaz. Uygulamanın
  içinde iPhone'lu kişi kurulumu yalnız [04b-bildirim-izni.md](04b-bildirim-izni.md)'nin uyarısından ("iPhone'da önce
  Paylaş > Ana Ekrana Ekle ile uygulamayı kur") öğrenir; uygulamanın dışında `/indir` sayfası aynı adımları ayrıntılı
  anlatır. Kod değiştirilmedi; düğme iOS'ta ve olaysız tarayıcılarda da gösterilirse pencere işe yarar.
- **`ee_kuruldu` yazılıyor ama hiçbir yerde okunmuyor.**
- **Güvenli bağlam şart.** Okul ağında `http://192.168…` gibi bir adresle açılan sitede servis çalışanı kaydedilmez:
  kurulum önerisi, çevrimdışı açılış ve telefon bildirimi olmaz. `localhost` güvenli sayılır (geliştirmede çalışır).
- **Kayıt hatası sessiz.** `/sw.js` bulunamaz ya da hatalıysa kişi bir şey görmez; yalnız konsolda uyarı. Bildirimler bu
  durumda [04b-bildirim-izni.md](04b-bildirim-izni.md)'deki 8 saniyelik bekleme sonunda "Uygulama bileşeni yüklenemedi"
  der.
- **`pwaKur`'u bir kez çağır.** Olay dinleyicilerini her çağrıda yeniden ekler.
- **Servis çalışanının önbellek sürümü `public/sw.js`'teki `SURUM`'dadır**; kabuk dosyalarının listesi değişince orada
  artırılmalı (bu dosyada değil).
- iPhone tanıma tarayıcı kimliğine bakar; yeni iPad'lerin Safari'si masaüstü (Macintosh) kimliği gönderdiği için
  Android/bilgisayar adımlarını görebilir. `public/js/indir.js` bunu ayrıca `navigator.maxTouchPoints > 1` ile yakalıyor;
  bu dosya yakalamıyor.

## Testleri

- Bu dosyanın doğrudan testi yok (kurulum olayı başsız tarayıcıda denenemiyor).
- Servis çalışanının kendisi: `testler/test-okul-agi.js` (açılışta `/sw.js` ve önbelleğe aldığı dosyalar ağ ölçümüne
  giriyor), `testler/test-adresler.js` (`/sw.js` 200 ve önbellek listesinde eski sayfa adresleri yok).
- Elle: Chrome'da `http://localhost:3200` ile gir; adres çubuğunda kurulum simgesi çıkınca uygulamanın üst çubuğunda
  indirme simgeli kurulum düğmesi (`#btnKur`) görünmeli, basınca tarayıcının penceresi açılmalı. Geliştirici araçları → Application → Service Workers'ta `/sw.js`
  etkin görünmeli.

## Son durum

- `git log`: 1 commit. Dosya `c17612e commit 329` (2026-09-26) ile `public/manifest.json`, `public/simge-192.png`,
  `public/simge-512.png` birlikte eklendi ve o günden beri değişmedi.
- Bilinen açıklar (kod değiştirilmedi): `kurulumYardimi`'ne ulaşılamaması, okunmayan `ee_kuruldu`, yeni iPad'lerin
  tanınmaması.
- Planlı işlerden bu dosyaya doğrudan dokunan yok; "Çok dil" işi pencere metinlerini katalogdan alacak. "Android yerel
  uygulama" işindeki "uygulama kendini güncellesin" yerel uygulamayla ilgili, bu PWA'yla değil.
