# public/KLASOR.md

Tarayıcıya giden her şeyin klasörü: tek sayfalık uygulamanın kabuğu `index.html`, iki "bulunamadı" sayfası, telefona kurulum için
`manifest.json` ve simgeler, servis çalışanı `sw.js`; alt klasörlerde ön yüz betikleri (`js/`), stiller (`css/`), düz belge
sayfaları (`kvkk/`, `kosullar/`, `indir/`) ve yazı tipleri (`yazitipi/`).

## Bu dosya ne yapar?

Sunucunun "statik dosya" kökü bu klasördür (`PUB`, [../sunucu/yollar.md](../sunucu/yollar.md)). `/api/` ile başlamayan her GET ya da
HEAD isteği [../sunucu/http.md](../sunucu/http.md)'deki `serveStatic`'e gider ve adres bu klasörde bir dosyaya çevrilir: `/` →
`index.html`, `/manifest.json` → `manifest.json`, `/kvkk/kvkk.html` → `kvkk/kvkk.html` (öbür yöntemler 405 alır). Burası
**herkese açıktır**: buraya konan her dosya, aşağıdaki istisnalar dışında, internetteki herkesin indirebileceği bir dosyadır.
Gizli hiçbir şey (ayar, anahtar, kişisel veri) buraya girmez; onlar `data/`'dadır.

Ama klasördeki her şey olduğu gibi sunulmaz, diskte olmayan bazı adresler de sunulur:

| Adres | Ne olur |
|---|---|
| `/js/app.js`, `/css/style.css` | Diskte böyle dosya yok. Sunucu `js/parcalar/*.js`'i ve `css/parcalar/*.css`'i ad sırasıyla birleştirir, yorumlarını atar, tek dosya verir. |
| `/admin/yonetim.js`, `/admin`, `/admin/...` | Diskte yok. Geçerli yönetici çereziyle `index.html`'in yönetim kabuğu ve `js/parcalar/` + `js/yonetim/` paketi; çerezsiz bilinmeyen adresle aynı 404. |
| `/js/parcalar/...`, `/js/yonetim/...`, `/css/parcalar/...` | Diskte var ama tek tek **sunulmaz**: 404. |
| `*.md` (bu belge dahil) | Diskte var ama **sunulmaz**: bilinmeyen adresle bayt bayt aynı 404 (`BELGE_DOSYASI`). |
| `_` ya da `.` ile başlayan ad (`.well-known` hariç) | **Sunulmaz**: 404. (`public/_*` ayrıca `.gitignore`'da; yerel denemeler içindir.) |
| `/login`, `/giris`, `/signup`, `/kayit`, `/hakkinda`, `/about`, `/sss/sss.html` | Dosyası yok; `index.html` (tek sayfalık uygulama) döner, sayfayı ön yüz seçer. |
| `/school/<okul>` | Okul varsa `index.html`, yoksa `okul-bulunamadi.html` (404). |
| `/kvkk`, `/kvkk.html`, `/kosullar`, `/indir`, `/download`, `/sss`, `/faq` … | 301 ile asıl adrese (`/kvkk/kvkk.html` …). |
| Başka her bilinmeyen adres | `404.html` (404). |

Bu belge klasörün kök dosyalarını tek tek, alt klasörleri de kısaca anlatır; her alt klasörün ve her betiğin kendi belgesi var
(aşağıdaki bağlantılar).

## İçinde neler var?

### Kök dosyalar

| Dosya | Boyut | Ne |
|---|---|---|
| `index.html` | 874 satır, 63 329 B | tek sayfalık uygulamanın kabuğu: açılış/Hakkında/SSS, giriş-kayıt kartı, okul sayfası yeri, uygulama iskeleti |
| `404.html` | 110 satır, 8 611 B | "Sayfa bulunamadı" |
| `okul-bulunamadi.html` | 110 satır, 8 516 B | "Okul bulunamadı" |
| `manifest.json` | 34 satır, 804 B | telefona/bilgisayara uygulama olarak kurulumun (PWA) tanımı |
| `simge-192.png` | 3 171 B | 192×192 simge |
| `simge-512.png` | 8 377 B | 512×512 simge |
| `simge-maskeli-512.png` | 4 895 B | 512×512 Android maskeli simge |
| `simge-rozet.png` | 558 B | 96×96 bildirim rozeti |
| `simge.svg` | 1 116 B | simgenin vektör kopyası |
| `sw.js` (+ `sw.md`) | 118 satır | servis çalışanı; kendi belgesi [sw.md](sw.md) |

#### `index.html` — uygulamanın kabuğu

Uygulamanın girişli ve girişsiz bütün ekranları bu tek HTML'dedir (düz sayfalar hariç); içindeki bölümleri `/js/app.js` (ön yüz
parçaları) gösterir, gizler ve doldurur. Üç iş görür: herkese açık site (açılış, Hakkında, SSS, giriş, kayıt), okulun kendi sayfası (`/school/<okul>`) ve gizli yönetim
paneli (`/admin`; sunucu aynı dosyada `/js/app.js`'i `/admin/yonetim.js` ile değiştirip verir).

**`<head>`:**

- `viewport-fit=cover`; iki `theme-color` (açık `#d62839`, koyu ekran tercihi için `#15181d`).
- `<script src="/js/tema.js">` — eş zamanlı, sayfa çizilmeden temayı uygular ([js/tema.md](js/tema.md)); yorumda nedeni:
  güvenlik başlığı satır içi betiğe izin vermez.
- `description` ve `<title>Eğitim Evi</title>`.
- İki yazı tipi ön yüklemesi (`preload`, `as="font"`, `crossorigin`): `/yazitipi/plex-sans-400-700-latin.woff2` ve
  `…-latin-ext.woff2` ([yazitipi/KLASOR.md](yazitipi/KLASOR.md)).
- `/css/style.css`, `<link rel="manifest" href="/manifest.json">`, `apple-touch-icon` ve `icon` `/simge-192.png?v=2`,
  `apple-mobile-web-app-capable`, `-status-bar-style`, `-title`, `mobile-web-app-capable`.

**`<body>`, sırasıyla:**

1. `#dis` — **dış sayfalar** (başta `display:none`). Giriş yapmamış ziyaretçinin gördüğü her şey:
   - `header.site-ust`: logo (`data-site="/"`), "Giriş" / "Kayıt ol", "İndir" (`#sUygulama` → `/indir/indir.html`), ay/güneş
     (`data-act="tema-degis"`), "Hakkında", "SSS", "Yapımcılar" (`#btnYapimcilar`, `data-act="yapimcilar"`, açılır
     `#yapimciListe` içinde `ul[data-yapimcilar]` ve projenin GitHub deposu bağlantısı).
   - `main#vitrin`:
     - `#vAna` (açılış `/`): büyük başlık ("Ödev, not, devamsızlık ve servis tek yerde."), "Hesap aç" / "Giriş yap", çizim yeri
       (`data-cizim="sinif"`); üç sayaç (`data-sayi="okul|kisi|cevrimici"`); "Neler var?" 12 özellik (`data-ikon`); "Okulun nasıl
       başlar?" 4 adım; dört rol kartı (`data-cizim="ogrenci|veli|ogretmen|mudur"`); "Kullananlar ne diyor?" yorumları
       (`#vYorumOzet`, `#vYorumListe`).
     - `#vHakkinda` (`/hakkinda`, `hidden`): Nasıl çalışır, Bilgiler nerede, Nasıl yapıldı, Yapımcılar, gizli "İletişim"
       (`#hIletisimBolum`, `#hIletisim`) ve sayaçlar.
     - `#vSss` (`/sss/sss.html`, `hidden`): **46 soru**, `<details>` içinde, altı grupta — Başlarken (7), Hesap ve giriş (11),
       Okul hayatı (17), Gizlilik (4), Telefon ve uygulama (5), Sorun ve iletişim (2).
2. `#authWrap` — **giriş/kayıt** (başta gizli):
   - `section#okulSayfa` — okulun kendi sayfası (kapak, tanıtım, fotoğraflar) buraya çizilir.
   - `.auth-card`: `#authOkul` (okul adresinden gelindiyse okulun adı ve il/ilçesi; okulun kendi sayfası varsa gizli),
     "Giriş Yap / Hesap Aç" sekmeleri (`#tabGiris`,
     `#tabKayit`), `#authMesaj`;
     - `#kodEkran` / `#formKod`: iki adımlı girişin 6 haneli kodu (`#kodGiris`, `#kodTekrar`, `#kodVazgec`);
     - `#formGiris`: "Kullanıcı adı / E-posta" seçimi (`#gKimlikKadi`, `#gKimlikEposta`), `#gEmail`, `#gSifre`, robot sorusu
       (`#gBotSoru`, `#gBot`, `#gBotYenile`), "Beni hatırla" (`#gHatirla`), "Bilgilerimi bu cihaza kaydetme" (`#gKaydetme`),
       gizlilik notu (`#gizlilikNot`), `#btnSifremiUnuttum`, `#btnOkulDegis`;
     - `#sifreEkran` / `#formSifreUnuttum`: e-posta ve robot sorusu (`#sEmail`, `#sBot…`);
     - `#yeniSifreEkran` / `#formYeniSifre`: `#ySifre1`, `#ySifre2`;
     - `#formKayit`: Ad, Soyad, Kullanıcı adı, E-posta, Şifre ve canlı kural listesi (`#kSifreKural`: uzun, büyük, küçük, rakam,
       özel), Telefon, "T.C. kimlik no (isteğe bağlı)" (`#kTc`), Adres (isteğe bağlı), robot sorusu, aydınlatma metni ve kullanım
       koşulları onay kutusu (`#kKvkk`);
     - `#okulSecAlan`: öğrenci ve servisçi için okul arama (`#vOkulForm`, `#vOkulAra`, `#vOkulSonuc`) ve son okul (`#vSonOkul`).
   - `footer.site-alt`: "Okul portalı · 2026", "Kaynak kodu", Hakkında, SSS, Kullanım koşulları, Aydınlatma metni, iletişim yeri
     (`#sIletisim`).
3. `#app` — **uygulama iskeleti** (giriş yapınca):
   - `.topbar`: `#hamburger`, arama (`#araKutu`), "+ Ekle" (`#btnEkle`, `data-act="kisilik-ekle"`, başta `hidden`), görünüm
     (`#btnTema`, `data-act="tema-degis"`), `#btnYenile`, `#btnBildirim` + `#bildirimRozet`, `#btnAyarlar`, "Uygulamayı yükle"
     (`#btnKur`, başta gizli), `#btnProfil` (`#profilAvatar`, `#profilEtiket`), `#bildirimPanel`.
   - `.shell`: `#sidebarPerde`, `nav#sidebar` (marka + `#navListe`), `main.content` > `#sayfa` ("Yükleniyor...").
4. `#modalKok` — açılır pencerelerin yeri.
5. `<script src="/js/app.js">` — bütün ön yüz.

Sayfadaki `data-act` değerleri yalnız üç: `tema-degis` (iki kez), `yapimcilar`, `kisilik-ekle`; geri kalan her şey `id` ile
bulunur ya da sonradan çizilir.

#### `404.html` — "Sayfa bulunamadı"

Bilinmeyen her adresin cevabı. Düz sayfa: `/js/tema.js`, `/js/belge.js` (`defer`), `<meta name="robots" content="noindex">`,
başlık "Sayfa bulunamadı · Eğitim Evi", `/css/style.css`, simge; gömülü `<style>`'da düz sayfaların `.belge` düzeni ve
`.bulunamadi` (ortalanmış blok, başlık yazı tipiyle büyük soluk "404"). Üst şerit ve alt bilgi açılış sayfasınınkiyle aynı. Metin:
"Aradığın adres Eğitim Evi'nde yok…", okul adresinin `egitimevi.org/school/okulun-adi` biçiminde olduğu; düğmeler "Ana sayfaya
dön" (`/`) ve "Okulunu ara" (`/login`).

Sunucu bu sayfayı yalnız gerçekten bilinmeyen adreste değil, gizlemek istediği her şeyde de verir: `_`/nokta ile başlayan
dosyalar, parça klasörleri, `.md` belgeler, adreste boş bayt (`%00`), çerezsiz ya da geçersiz çerezli `/admin`. Cevap hep aynıdır
(durum 404, `Cache-Control: no-store`, aynı ETag ve gövde); böylece bir adresin "var ama gizli" olduğu cevaptan anlaşılmaz.

#### `okul-bulunamadi.html` — "Okul bulunamadı"

`/school/<kısa ad>` biçimine uyan ama böyle bir okulun (kodun yorumuna göre yalnız onaylı okul sayılır) olmadığı adresin cevabı,
durum 404. `404.html` ile aynı iskelet; metin "Okul bulunamadı", `p#okulYok` "Bu adreste bir okul yok." —
[js/belge.md](js/belge.md) tarayıcıda bunu adresteki adla (`"<ad>" adresinde bir okul yok.`, en çok 60 karakter, metin olarak)
değiştirir; adresin değişmiş olabileceği; aynı iki düğme.

#### `manifest.json` — uygulama olarak kurulum

```
name / short_name "Eğitim Evi" · description · start_url "/" · scope "/" · display "standalone"
orientation "portrait-primary" · background_color "#fff9f5" · theme_color "#d62839" · lang "tr" · dir "ltr"
categories ["education"] · icons: simge-192.png?v=2 (any), simge-512.png?v=2 (any), simge-maskeli-512.png?v=2 (maskable)
```

Tarayıcı bununla "Uygulamayı yükle" önerir (Chrome/Edge'de `beforeinstallprompt`, [js/parcalar/04-pwa.md](js/parcalar/04-pwa.md));
iPhone'da Safari "Ana Ekrana Ekle"de simgeyi ve adı buradan ve `apple-*` etiketlerinden alır. `index.html` ve
`indir/indir.html` bağlar; servis çalışanı da önbelleğe alır. Sunucu `.json` uzantısı yüzünden `application/json` olarak verir.

#### Simgeler

Hepsini [../araclar/simge-uret.md](../araclar/simge-uret.md)'deki araç tek bir çizimden (kırmızı zeminde beyaz ev, bacası ve hafif
aralık kapısı, aralıktan sarı ışık) dış paket kullanmadan üretir; elle düzenlenmez.

| Dosya | Çizim | Kim kullanır |
|---|---|---|
| `simge-192.png` | 192 px, yuvarlak köşe, kenar payı 18 | bütün HTML sayfalarının sekme simgesi (`rel="icon"`), `index.html` ve `indir.html`'de `apple-touch-icon`, manifest (`any`), `sw.js` bildirim simgesi (`icon`) ve önbellek listesi |
| `simge-512.png` | 512 px, yuvarlak köşe, pay 48 | manifest (`any`), `sw.js` önbellek listesi |
| `simge-maskeli-512.png` | 512 px, köşesiz kare, pay 96 (ev ortadaki alana sığar; Android daire/kare kırpar) | manifest (`maskable`) |
| `simge-rozet.png` | 96 px, şeffaf zeminde beyaz siluet | `sw.js` bildirim rozeti (`badge`; telefon yalnız saydamlığını kullanır) |
| `simge.svg` | 192 viewBox, vektör | hiçbir sayfa bağlamıyor; aracın ürettiği vektör kopya ("elle değiştirme" yorumu içinde) |

Bütün bağlantılar `?v=2` taşır (yeni simge `commit 523` ile geldi; eski simge tarayıcılarda takılı kalmasın diye).

#### `sw.js` — servis çalışanı (kısaca)

Kurulunca uygulama kabuğunu (`/`, `/index.html`, `/css/style.css`, `/js/tema.js`, `/js/app.js`, dört yazı tipi, `/manifest.json`,
`/simge-192.png?v=2`, `/simge-512.png?v=2`) `egitim-evi-v9` adlı önbelleğe alır; sitenin kendi GET isteklerini "önce ağ, ağ yoksa
önbellek" diye karşılar, `/api/` isteklerine hiç karışmaz; telefon bildirimini (başlık, metin, `simge-192` ve `simge-rozet` ile)
gösterir, dokununca sitenin içindeki adresi açar. Ayrıntısı [sw.md](sw.md). Kaydını `index.html`'de çalışan uygulama yapar
(`navigator.serviceWorker.register('/sw.js')`, yalnız güvenli bağlamda — HTTPS ya da `localhost`).

### Alt klasörler

| Klasör | İçi | Belgesi |
|---|---|---|
| `js/` | `tema.js` (her sayfada, temayı ilk çizimden önce uygular), `belge.js` (uygulama paketinin yüklenmediği beş düz sayfanın küçük betiği), `indir.js` (indirme sayfası) | [js/tema.md](js/tema.md), [js/belge.md](js/belge.md), [js/indir.md](js/indir.md) |
| `js/parcalar/` | 57 parça; ad sırasıyla tek IIFE'de birleşip `/js/app.js` olur. Her `.js`'in yanında aynı adlı `.md`. | ör. [js/parcalar/05a-dis-sayfalar.md](js/parcalar/05a-dis-sayfalar.md), [js/parcalar/26-baslat.md](js/parcalar/26-baslat.md) |
| `js/yonetim/` | 5 parça; herkese giden pakete girmez, yalnız geçerli yönetici çereziyle `/admin/yonetim.js` içinde uygulama parçalarıyla birleşir | ör. [js/yonetim/09-yonetici.md](js/yonetim/09-yonetici.md) |
| `css/parcalar/` | 38 CSS parçası; ad sırasıyla birleşip `/css/style.css` olur | [css/parcalar/CSS.md](css/parcalar/CSS.md) |
| `kvkk/` | `kvkk.html` — aydınlatma metni (`/kvkk/kvkk.html`) | [kvkk/KLASOR.md](kvkk/KLASOR.md) |
| `kosullar/` | `kosullar.html` — kullanım koşulları | [kosullar/KLASOR.md](kosullar/KLASOR.md) |
| `indir/` | `indir.html` — Android sürümleri ve iPhone'a ekleme | [indir/KLASOR.md](indir/KLASOR.md) |
| `yazitipi/` | dört `.woff2` (IBM Plex Sans, Newsreader) | [yazitipi/KLASOR.md](yazitipi/KLASOR.md) |

### Düz sayfaların ortak iskeleti

`404.html`, `okul-bulunamadi.html`, `kvkk/kvkk.html`, `kosullar/kosullar.html`, `indir/indir.html` uygulama paketini yüklemez.
Hepsinde aynı şeyler tekrar eder (her dosyada ayrı ayrı yazılı): iki `theme-color`, `/js/tema.js`, `/js/belge.js` (`defer`),
`/css/style.css`, `/simge-192.png?v=2`, `.belge` düzeninin gömülü `<style>`'ı, `index.html`'deki üst şeridin ve alt bilginin
kopyası (bağlantıları `data-site`'sız düz bağlantılardır). Şeritteki tema düğmesini ve Yapımcılar listesini `belge.js` çalıştırır.

| Sayfa | tema.js | belge.js | indir.js | app.js | manifest | robots noindex |
|---|---|---|---|---|---|---|
| `index.html` | evet | — | — | evet | evet | — |
| `404.html`, `okul-bulunamadi.html` | evet | evet | — | — | — | evet |
| `kvkk/kvkk.html`, `kosullar/kosullar.html` | evet | evet | — | — | — | — |
| `indir/indir.html` | evet | evet | evet | — | evet | — |

## Kimle konuşur?

- **Sunan:** [../sunucu/http.md](../sunucu/http.md) — `serveStatic` (adres → dosya, yönlendirme, gizli adresler), `statikOku`
  (bellek önbelleği; birleşik dosyalar), `htmlSurumle` (HTML içindeki `"/css/style.css"`, `"/js/app.js"`, `"/js/tema.js"`
  adreslerine `?v=<ETag>`), `statikGonder` (önbellek başlıkları, gzip/brotli, 304), `bulunamadi` (404.html), `yonetimSun`
  (`/admin`), `okulVarMi` (okul adresi, 30 saniyelik bellek). İstek önce [../sunucu/index.md](../sunucu/index.md)'den geçer
  (dosya istekleri IP başına dakikada 15 000 sınırı). Yönetim çerezi: [../sunucu/yonetim-cerezi.md](../sunucu/yonetim-cerezi.md).
- **`index.html`'in parçalarını yöneten ön yüz parçaları** (`/js/app.js` içinde):
  - [js/parcalar/05a-dis-sayfalar.md](js/parcalar/05a-dis-sayfalar.md) — `#dis`, `#vitrin`, `#vAna`/`#vHakkinda`/`#vSss` arasında geçiş,
    `data-site` bağlantıları, sayaçlar (`data-sayi`, `GET /api/site`), yorumlar (`GET /api/yorumlar`), çizimler (`data-cizim`),
    özellik simgeleri (`data-ikon`), Yapımcılar (`EYLEMLER['yapimcilar']`), iletişim (`#sIletisim`, `#hIletisim`), okul arama.
  - [js/parcalar/05-giris.md](js/parcalar/05-giris.md) — giriş, kod, şifremi unuttum, yeni şifre ve kayıt formları, robot sorusu,
    şifre kuralı listesi.
  - [js/parcalar/19g-okul-sayfasi.md](js/parcalar/19g-okul-sayfasi.md) — `#okulSayfa`.
  - [js/parcalar/26-baslat.md](js/parcalar/26-baslat.md) — açılışta `#dis` mi `#app` mi; aydınlatma metni yeniden onayı.
  - [js/parcalar/06-menu.md](js/parcalar/06-menu.md) (`#navListe`, `#btnEkle`), [js/parcalar/07-yonlendirme.md](js/parcalar/07-yonlendirme.md)
    (`#sayfa`, `#btnYenile`), [js/parcalar/24-bildirim-arama-mobil.md](js/parcalar/24-bildirim-arama-mobil.md) (`#bildirimPanel`,
    `#hamburger`, `#araKutu`), [js/parcalar/25-tiklama.md](js/parcalar/25-tiklama.md) (genel tıklama, `tema-degis`, `#btnBildirim`,
    `#btnAyarlar`, `#btnProfil`), [js/parcalar/08c-kisilikler.md](js/parcalar/08c-kisilikler.md) (`kisilik-ekle`),
    [js/parcalar/04-pwa.md](js/parcalar/04-pwa.md) (`#btnKur`, `sw.js` kaydı), [js/parcalar/03-mesaj-modal.md](js/parcalar/03-mesaj-modal.md)
    (`#modalKok`), [js/parcalar/02b-cizimler.md](js/parcalar/02b-cizimler.md) ve [js/parcalar/02-ikonlar.md](js/parcalar/02-ikonlar.md)
    (çizim ve simge kaynakları).
- **Düz sayfaların betikleri:** [js/belge.md](js/belge.md) (`GET /api/site`), [js/indir.md](js/indir.md) (`GET /api/uygulama`);
  uçlar [../sunucu/site.md](../sunucu/site.md)'de.
- **Görünüm:** [css/parcalar/CSS.md](css/parcalar/CSS.md) — üst şerit, alt bilgi, vitrin, Hakkında, SSS, Yapımcılar
  `29-dis-sayfalar.css`; giriş kartı `01-giris-kayit.css`, `16-giris-sekme.css`, `09-kayit-ekrani.css` (robot sorusu, okul seçimi);
  uygulama iskeleti `03-iskelet.css`, `07-mobil.css`; okul sayfası `31-okul-sayfasi.css`. Düz sayfaların `.belge`, `.bulunamadi`,
  `.indir-*`, `.ios-*` sınıfları CSS parçalarında değil, sayfaların kendi `<style>`'ında.
- **Üreten araçlar:** [../araclar/simge-uret.md](../araclar/simge-uret.md) (beş simge dosyası),
  [../araclar/yazitipi-indir.md](../araclar/yazitipi-indir.md) (`yazitipi/`). [../araclar/gezinti.md](../araclar/gezinti.md) ekran
  turunda açılış, Hakkında, SSS, kvkk, koşullar ve indirme sayfalarını gezip fotoğraflar.
- **Klasör adlarıyla ilgili kural:** `sunucu/ortak.js` `KISA_AD_YASAK` ([../sunucu/ortak.md](../sunucu/ortak.md)) — `yazitipi`,
  `kvkk`, `sw`, `manifest`, `simge`, `index`, `indir`, `kosullar`, `css`, `js`… okul adresi (kısa ad) olarak seçilemez.
- **Kim görür:** açılış, Hakkında, SSS, giriş/kayıt, düz sayfalar — herkes, girişsiz. `#app` — giriş yapan her rol (öğrenci, veli,
  öğretmen, müdür, servisçi; `#btnEkle` yalnız yetişkin hesabında ya da okul rolü olanda görünür). `/admin` kabuğu — yalnız
  geçerli yönetici çereziyle.

## Nasıl çalışır (adım adım)?

### Bir dosya isteğinin yolu

```
GET /x  (sunucu/index.js: /api/ değil, GET ya da HEAD; değilse 405)
  └─ serveStatic
       adres çözülür; %00 varsa ─────────────────────────────► 404.html
       '/' ─► '/index.html'
       kısa/eski adres mi? (YONLENDIRMELER) ────────────────► 301 Location: /kvkk/kvkk.html …
       _ ya da . ile başlayan parça var mı? (.well-known hariç) ► 404.html
       public/ dışına çıkıyor mu? ──────────────────────────► 403 "Yasak"
       parça klasörü mü? (js/parcalar, js/yonetim, css/parcalar) ► 404.html
       /admin ya da altı mı? ───────────────────────────────► yonetimSun: geçerli çerez ─► yönetim kabuğu / yonetim.js
                                                                           yoksa ──────► 404.html (bayt bayt aynı)
       .md mi? ─────────────────────────────────────────────► 404.html
       statikOku(dosya)
         var ─► HTML ise htmlSurumle (?v=ETag) ─► statikGonder 200 / 304
         yok ─► /school/<okul> mu? ─► okulVarMi ─► var: index.html · yok: okul-bulunamadi.html (404)
                                                  veritabanına ulaşılamadı: index.html
                uygulama adresi mi? (/login, /signup, /hakkinda, /sss/sss.html …) ─► index.html
                değilse ─► 404.html (404)
```

`/js/app.js` ve `/css/style.css` için `statikOku` diskteki dosya yerine birleşik paketi verir: parça klasörünü en sık saniyede
bir yoklar, bir parça değişmişse yeniden birleştirir.

### Önbellek ve sıkıştırma (`statikGonder`)

| Ne | `Cache-Control` |
|---|---|
| HTML sayfaları | `no-cache` (her açılışta sorulur; değişmediyse 304) |
| `?v=<güncel ETag>` taşıyan `/css/style.css`, `/js/app.js`, `/js/tema.js` | `public, max-age=31536000, immutable` |
| bütün resimler (`image/…`) ve yazı tipleri (`font/…`) | `public, max-age=31536000, immutable` (adresinde `?v` olsun olmasın) |
| `manifest.json`, `belge.js`, `indir.js`, `sw.js` | `no-cache` (ETag ile) |
| 404 cevapları (`404.html`, `okul-bulunamadi.html`) | `no-store` |
| `/admin` kabuğu ve paketi | `no-store`, `X-Robots-Tag: noindex, nofollow` |

`text/…`, `application/javascript|json|manifest` türünde ve 1 KB'tan büyük dosyalar bir kez gzip ve brotli ile sıkıştırılıp
bellekte tutulur; tarayıcının kabul ettiği gönderilir. Her cevapta sitenin güvenlik başlıkları (içerik güvenlik politikası dahil)
vardır.

### Açılış sayfasının yüklenişi

```
GET / ─► index.html (style.css?v=…, app.js?v=…, tema.js?v=… yazılmış)
  tema.js (eş zamanlı) ─► <html data-tema>, adres çubuğu rengi
  preload: iki Plex yazı tipi ─► style.css ─► app.js
  app.js (26-baslat): oturum var mı?
     yok ─► #dis görünür; 05a-dis-sayfalar adrese göre #vAna / #vHakkinda / #vSss / giriş kartı / okul sayfası
     var ─► #app görünür (menü, sayfa); aydınlatma metni onayı eskiyse önce onay penceresi
  04-pwa: güvenli bağlamsa sw.js kaydı; tarayıcı kurulum önerirse #btnKur görünür
```

## Dikkat!

- **`.md` belgeleri web'den okunmaz — bu belge de.** `BELGE_DOSYASI` deseni `.md`'yi ve aynı dosyayı açan yazılışları (`.md.`,
  `.md%20`, `.md::$DATA`, sondaki `/`, büyük harf) yakalar; cevap bilinmeyen adresle bayt bayt aynıdır. Klasöre konan her
  `KLASOR.md` ve betiklerin yanındaki `.md`'ler bu sayede güvende; yine de `.md`'lere gizli bilgi yazılmaz (depo herkese açık).
- **`_` ile başlayan dosya sunulmaz.** Yerel deneme sayfası koymak istersen `public/_…` hem `.gitignore`'da hem sunucuda kapalıdır;
  sayfayı sitede görmek istiyorsan başka ad ver (ve depoya girdiğini unutma).
- **`index.html`'de üç adres yazılışı değişmemeli.** `htmlSurumle` metinde tam olarak `"/css/style.css"`, `"/js/app.js"`,
  `"/js/tema.js"` (çift tırnakla) arar; yönetim kabuğu da `"/js/app.js"`'i düzenli ifadeyle bulup değiştirir. Tek tırnak ya da
  göreli yol yazarsan sürüm eklenmez (tarayıcı eski dosyada takılır) ve `/admin` paneli yönetim paketini yükleyemez.
  `htmlSurumle` her HTML cevabında çalışır; beş düz sayfadaki `"/css/style.css"` ve `"/js/tema.js"` da aynı yazılışla kalmalı.
- **Üst şerit ve alt bilgi altı dosyada kopya.** `index.html` ile beş düz sayfa aynı şeridi ve alt bilgiyi ayrı ayrı taşır. Bir
  bağlantıyı (ör. yeni bir sayfa) değiştirirsen altısını da değiştir; `testler/test-adresler.js` her sayfanın asıl adresleri
  gösterdiğini ve eski adres kalmadığını denetler.
- **Mutlak yollar.** Alt klasördeki sayfalar (`/kvkk/…`, `/indir/…`) göreli yolla yanlış klasöre bakar; bütün `src`/`href` `/` ile
  başlamalı (test denetler).
- **Satır içi betik yok.** Güvenlik başlığı `script-src 'self'`; bu yüzden `tema.js`, `belge.js`, `indir.js` ayrı dosyalar. Gömülü
  `<style>` ve `style="…"` nitelikleri serbest (`style-src 'unsafe-inline'`). Yazı tipi ve resim yalnız sitenin kendisinden ya da
  `data:` adresinden gelebilir (`font-src 'self' data:`); resimde tek dış kaynak OpenStreetMap harita döşemeleridir.
- **Simge değişince `?v=` artırılır.** Resimler bir yıl "değişmez" diye önbelleğe alınır. Çizim değişince bütün HTML'lerdeki,
  `manifest.json`'daki ve `sw.js`'teki `?v=` sayısı birlikte artar, `sw.js`'te `SURUM` da artar (aracın yorumu). Aynı kural yazı
  tipleri için de geçerli: içerik değişirse ad değişmeli.
- **`404.html` her istekte aynı kalmalı.** `/admin`'in gizliliği, çerezsiz `/admin`'e verilen cevabın bilinmeyen adresinkiyle bayt
  bayt aynı olmasına dayanır. Bu sayfaya isteğe göre değişen bir şey (adres, saat) sunucu tarafında eklenmemeli; okul adını
  yazmak gibi işler tarayıcıda yapılır (`belge.js`, `textContent`).
- **"Okul bulunamadı" yalnız geçerli biçimdeki adreste.** `/school/` sonrası İngilizce harf (büyük yazılsa da küçüğe çevrilir),
  rakam ve tireden oluşan 1–40 karakter (başta ve sonda tire yok; sonda `/` olabilir) değilse adres okul sayılmaz, "Sayfa
  bulunamadı" gelir. Okulun var/yok bilgisi 30 saniye bellekte durur (adres değişince boşaltılır); veritabanına ulaşılamazsa
  sayfa yine açılır, durumu uygulama söyler.
- **Kayıt formu ile aydınlatma metni şu an uyuşmuyor.** `#kTc`'nin etiketi "T.C. kimlik no (isteğe bağlı)" ve altındaki not
  "Zorunlu değil…" diyor; aydınlatma metni 1.15'ten beri "bütün hesaplarda zorunlu" diyor. Zorunluluğun kodu planlı iştir
  (aşağıda); o iş bu etiketi ve notu da değiştirecek.
- **Yeni şifre ekranının ipucu eksik.** `#yeniSifreEkran` "En az 8 karakter, harf ve rakam içermeli." yazıyor; yetişkin hesabının
  şifresi sunucuda büyük/küçük harf, rakam ve özel karakter de ister (`sifreSorunu`). Bağlantıyla şifre yenileyenlerin çoğu
  yetişkin olduğu için sunucu ipucundaki şifreyi reddedebilir. Kod değiştirilmedi; ayrıntı
  [js/parcalar/05-giris.md](js/parcalar/05-giris.md).
- **Düz sayfalarda iletişim satırı boş.** `#sIletisim`'i yalnız açılış sayfasında uygulama paketi doldurur; beş düz sayfada boş kalır
  ([js/belge.md](js/belge.md)).
- **`simge.svg` kullanılmıyor.** Araç üretir, hiçbir sayfa bağlamaz; 16 piksellik sekme simgesinde kapı seçilmiyor, istenirse ayrı
  sadeleştirilmiş bir sekme simgesi yapılabilir (kullanıcının bekleyen kararları arasında).
- **Servis çalışanının kapsamı bütün site.** `sw.js` kökte durduğu için bir kez kurulunca düz sayfaların istekleri de ondan geçer
  (önce ağ). Önbellek listesini değiştirirsen `SURUM`'u artır ([sw.md](sw.md)).
- **`KISA_AD_YASAK` ile bu klasörün adları.** Kodun yorumu listeyi "sitenin kendi yollarıyla karışmasın" diye tutar. Okul
  adresleri artık `/school/` altında olduğundan bugün gerçek bir yol çakışması yok (`/school/kvkk` ile `/kvkk` ayrı adreslerdir);
  yine de buraya yeni bir kök klasör ya da sayfa eklersen adını listeye de eklemek tutarlı olur (öneri).

## Testleri

- `testler/test-adresler.js` (sunucu ister) — asıl adresler (`/kvkk/kvkk.html`, `/kosullar/kosullar.html`, `/indir/indir.html`,
  `/sss/sss.html`) 200 ve doğru içerik; kısa ve eski adreslerin 301'i (büyük/küçük harf, Türkçe İ/ı, sondaki `/`, sorgu dizesi);
  `Location`'ın başka siteye gidememesi ve başlığa satır eklenememesi; `%00`'lı adreslerin 404 olması ve sunucunun ayakta kalması;
  tanınmayan adreslerin ve parça klasörlerinin 404'ü, `/olmayan`'da "Sayfa bulunamadı"; `/hakkinda`, `/login`, `/signup`, `/`…
  `index.html`; düz sayfalarda ve 404 sayfalarında eski adrese bağlantı olmaması, asıl adreslerin gösterilmesi, bütün
  `src`/`href`'in mutlak olması, stil ve betiklerin yüklenmesi; sekme başlığı; `sw.js`'in önbellek listesinde eski adres
  olmaması.
- `testler/test-etut.js` — `/boyle-bir-sayfa-yok` 404 "Sayfa bulunamadı" + "Ana sayfaya dön"; `/test-ortaokulu` (okul `/school/`
  dışında) 404; `/school/boyle-bir-okul-yok` 404 "Okul bulunamadı"; uygulama adresleri açılıyor; `/api/site`, `/api/uygulama`
  girişsiz; indirme sayfası.
- `testler/test-admin-gizli.js` — çerezsiz `/admin`, parça klasörleri ve `.md` adresleri (bu klasöre, `js/`'e ve `kvkk/`'ye
  geçici `.md` yazıp, sonunda silerek) bilinmeyen adresle bayt bayt aynı 404 (GET/HEAD, sıkıştırmalı/sıkıştırmasız); aynı yere
  yazılan `.txt`'nin 200 olması (sunucunun bu klasörden okuduğunu kanıtlar).
- `testler/test-okul-agi.js` — 300 öğrencinin aynı ağdan ilk açılışı: `/school/<kısa ad>`, `tema.js`, `style.css`, `app.js`, dört
  yazı tipi, `manifest.json`, `simge-192.png?v=2`, `sw.js` ve servis çalışanının önbelleğe aldıkları; hiçbiri 429/503 almamalı.
- `testler/test-gizli-dosyalar.js` (sunucusuz) — `public/_deneme.html` depoya giremez, `public/index.html` girer.
- `testler/buton-denetimi.js` (sunucusuz) — `index.html`'deki ve parçalardaki her `data-act`'in bir karşılığı var mı.
- `testler/yazim-denetimi.js` (sunucusuz) — `index.html` ve `kvkk/kvkk.html` Türkçe yazım listesinden geçer.
- `testler/girdi-denetimi.js` — `/../../server.js` gibi yol kaçışı denemeleri sunucu dosyasını vermez.
- Hepsi `bash testler/tumtest.sh` içinde (3200 portu, adı `_test` ile biten veritabanı). Tek paket: test sunucusu açıkken
  `EE_BASE=http://localhost:3200 node testler/test-adresler.js`. `EE_BASE`'i unutma: verilmezse testler varsayılan olarak
  `http://localhost:3000`'e (kullanıcının kendi sunucusuna) gider.
- Klasör belgeleri: `node .claude/gelistirme/betikler/belge-denetle.js --haritasiz --klasor public` (yerel betik) — bu klasörün ve
  alt klasörlerin `KLASOR.md`'lerinde (ve `css/parcalar/CSS.md`'de) her dosyanın adının geçtiğini ve bağlantıların kırık
  olmadığını denetler; `public/` altındaki betiklerin `.md`'lerini de birlikte denetler.
- Elle: `/olmayan` → "Sayfa bulunamadı"; `/school/yok-boyle` → "Okul bulunamadı" ve adın yazılması; `/kvkk` → `/kvkk/kvkk.html`;
  Geliştirici Araçları → Ağ: `style.css?v=…` ve simgeler `immutable`, HTML `no-cache`; `/index.md` ya da `/KLASOR.md` → 404.

## Son durum

- Kök dosyaların commit sayıları: `index.html` 27 (ilk `bc554fb commit 5`, 2026-08-28), `404.html` 3 (ilk `dc17651 commit 514`),
  `okul-bulunamadi.html` 3 (ilk `115a906 commit 515`), `manifest.json` 2 ve `simge-192.png`, `simge-512.png` 2 (ilk `c17612e
  commit 329`), `simge-maskeli-512.png` 2 (ilk `c48182d commit 330`), `simge-rozet.png` ve `simge.svg` 1 (`0d27eba commit 523`).
- `4d392e0 commit 554` (2026-10-02): `index.html`'de Hakkında → "Bilgiler nerede?" ve SSS → "Bilgilerim nerede duruyor?"
  cevaplarında "Okulun kullandığı sunucuda" yerine "Eğitim Evi'nin sunucusunda; her okulun verisi ayrıdır (ve yalnız o okulun
  yetkilileri erişir)" (aynı commit aydınlatma metni 1.16).
- `7fda2ee commit 543` (2026-09-30): giriş formundaki gizlilik notu (`#gizlilikNot`) "Bilgilerin yalnızca okulunun kendi
  sunucusunda tutulur…" yerine "Bilgilerin Eğitim Evi'nin sunucusunda tutulur ve yalnız okulunun yetkilileri görür. Giriş
  bilgilerin Google'a ya da başka bir servise gönderilmez."
- `566b917 commit 524` (2026-09-27): SSS'te ödev teslimi 150 MB → 50 MB, doluluk çubuğu, dosya yükleme alanının yalnız öğretmen
  açtıysa çıkması; "Yüklenen dosyalar ne kadar saklanır?" cevabı yeni sürelerle.
- `0d27eba commit 523` (2026-09-27): yeni simge — dört PNG yeniden üretildi, `simge-rozet.png` ve `simge.svg` eklendi; bütün simge
  bağlantılarına `?v=2`; altı sayfanın şerit logosu (`.site-marka` SVG) ve `index.html`'deki yan menünün logosu (`.brand`)
  bacalı, aralık kapılı yeni çizgi ev; `sw.js` `SURUM` v9 ve bildirim rozeti `simge-192.png` yerine `simge-rozet.png`.
- Bilinen açıklar (kod değiştirilmedi): kayıt formunda T.C. "isteğe bağlı"; yeni şifre ekranının ipucu; düz sayfalarda boş iletişim
  satırı; kullanılmayan `simge.svg`.
- Planlı işlerden bu klasörü etkileyecekler:
  - "T.C. kimlik no bütün hesaplarda zorunlu" — `#kTc` zorunlu olacak, notu aydınlatma metnine uyacak (Linux oturumunda).
  - "Üst şerit sadeleştirme" — `#app .topbar`'daki düğmeler azalacak (Ayarlar, Uygulama, Yenile profil menüsüne), ⌂ ve
    uygulamada ← → eklenecek; doğrulama ekranlarına "←".
  - "Çok dil" — üstte "TR ▾" dil seçici; düz sayfaların arayüz metni seçili dile göre, hukuki metinler Türkçe.
  - "Arama motorunda görünme" (canlıya çıkınca) — sayfa başlıkları ve açıklamaları, kanonik adres, Open Graph resmi (1200×630),
    `robots.txt`, `sitemap.xml`, ayrı dosyada JSON-LD; büyük olasılıkla bu klasöre yeni dosyalar.
  - "Sistem" işi — site duyurusu şeridi (açılış, giriş, uygulama, kvkk/koşullar/indir/SSS sayfaları), bakım modunda öteki bütün
    sayfaların yerine "Kısa bir bakım yapıyoruz…" sayfası (503; tanım dosya adı vermiyor).
  - "Kulüpler kaldırılacak" — SSS'te kulüp geçen üç cevap ("Eğitim Evi nedir?", bölümleri kapatma, rol şablonlarındaki "Kulüp
    Danışmanı") değişecek.
  - "Eğitim içerikleri" (girişsiz ziyaretçiye açılış sayfasında da görünüp görünmeyeceği soruldu, karar bekliyor) ve bilgisayar
    için tarayıcıdan kurulum kararı (indirme sayfası; [indir/KLASOR.md](indir/KLASOR.md)).
  - "Ekran turu + albüm" — özellikler bitince bu sayfaların fotoğrafları baştan çekilecek.
  - Kişisel veri işleyen her yeni özellik aynı commit'te `kvkk/kvkk.html`'i günceller ([kvkk/KLASOR.md](kvkk/KLASOR.md)).
