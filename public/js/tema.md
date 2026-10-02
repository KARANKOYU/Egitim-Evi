# public/js/tema.js

Açık / koyu / sistem temasını sayfa çizilmeden önce uygulayan küçük betik: tarayıcıdaki seçimi (`localStorage` `ee_tema`)
okur, `<html data-tema>`'yı ve telefonun adres çubuğu rengini ayarlar, uygulamaya `window.temaAyarla` ve `window.temaOku`'yu
açar.

## Bu dosya ne yapar?

Eğitim Evi'nin iki görünümü var: açık ve koyu. Kişi üç şeyden birini seçer: **Sistem** (bilgisayarın/telefonun kendi
ayarına uy; varsayılan), **Açık** ya da **Koyu**. Bütün renkler CSS değişkenleridir
(`public/css/parcalar/00-temel.css`); hangi paletin geçerli olacağına `<html>` etiketindeki `data-tema` karar verir:

| Seçim | `<html>` | Geçerli palet |
|---|---|---|
| Sistem | `data-tema` yok | işletim sistemi koyu istiyorsa koyu (`@media (prefers-color-scheme: dark)`), değilse açık |
| Açık | `data-tema="acik"` | açık, sistem ne derse desin |
| Koyu | `data-tema="koyu"` | koyu |

Sorun şu: uygulama paketi (`/js/app.js`) büyük ve sayfanın sonunda yüklenir. Seçimi o uygulasaydı, koyu tema seçmiş kişi
her açılışta bir an bembeyaz bir sayfa görürdü. Bu dosya bu yüzden ayrı ve küçük: `<head>`'in içinde, stil dosyasından
önce, `defer` olmadan (eş zamanlı) yüklenir; sayfa daha çizilmeden `data-tema`'yı yazar. CSS de betik beklemeden doğru
paleti seçer.

Satır içi betik yazılamıyor (İçerik Güvenlik Politikası `script-src 'self'`), bu yüzden iş dosyada. ES5, tek IIFE; dışarıya
yalnız iki işlev açar (`window.temaAyarla`, `window.temaOku`).

## İçinde neler var?

### Sabitler

- `ANAHTAR` — `'ee_tema'`: seçimin `localStorage`'daki anahtarı.
- `GECERLI` — `['sistem', 'acik', 'koyu']`.

### İç işlevler

- `oku()` — `localStorage`'dan seçimi okur; değer yoksa, listede değilse ya da `localStorage`'a erişilemiyorsa (bazı özel
  pencereler, kapalı çerezler) `'sistem'`.
- `cubukRengi(koyuMu)` — sayfadaki `media`'sız `<meta name="theme-color">`'ın rengini değiştirir: koyuda `#15181d` (koyu
  paletin zemini, `--zemin`), açıkta `#d62839` (markanın kırmızısı, `--ana`). Telefon tarayıcısı adres çubuğunu, kurulu
  uygulama da başlık çubuğunu bu renge boyar. Meta yoksa bir şey yapmaz.
- `uygula(deger)` — `'sistem'` ise `data-tema`'yı kaldırır, değilse yazar (`acik`/`koyu`); sonra görünen temanın koyu olup
  olmadığını hesaplar (`koyu` seçili, ya da `sistem` seçili ve `matchMedia('(prefers-color-scheme: dark)')` eşleşiyor) ve
  `cubukRengi`'ni çağırır.

### Dışarı açılanlar

- `window.temaAyarla(deger)` — `deger` `GECERLI`'de değilse `'sistem'` sayılır; `localStorage`'a yazar (yazılamazsa
  sessizce geçer: seçim yalnız bu sayfa için geçerli olur), `uygula` eder ve **gerçekten uygulanan değeri döner**. Çağıranlar
  dönen değeri hesaba yazmak için kullanır.
- `window.temaOku()` — `oku()`'nun kendisi: tarayıcıdaki seçim (`'sistem'`, `'acik'`, `'koyu'`).

### Yüklenince

1. `uygula(oku())` — seçim hemen uygulanır.
2. `matchMedia('(prefers-color-scheme: dark)')`'a `change` dinleyicisi: işletim sisteminin teması değişince, seçim
   `sistem` ise `uygula('sistem')`. Paleti zaten CSS değiştirir; bu dinleyici yalnız adres çubuğunun rengini günceller.
   `addEventListener` olmayan eski tarayıcıda (eski Safari'nin `MediaQueryList`'i) hata yakalanır, çubuk rengi o oturumda
   güncellenmez.

## Kimle konuşur?

- Onu yükleyen sayfalar (hepsinde `<head>`'de, iki `theme-color` meta'sından hemen sonra, `defer`siz):
  `public/index.html` (uygulama; gizli yönetim kabuğu da `index.html`'den üretildiği için yönetim paneli de),
  `public/kvkk/kvkk.html`, `public/kosullar/kosullar.html`, `public/indir/indir.html`, `public/404.html`,
  `public/okul-bulunamadi.html`.
- Sunucu: `sunucu/http.js`'teki `htmlSurumle` HTML'deki `"/js/tema.js"`'yi `"/js/tema.js?v=<ETag>"` yapar
  ([../../sunucu/http.md](../../sunucu/http.md)); bu sürümlü adres tarayıcıda bir yıl (`immutable`) saklanır, ikinci
  açılışta istek bile gitmez. Dosya değişince ETag, dolayısıyla adres değişir; yenisi iner.
- `window.temaAyarla` / `window.temaOku`'yu kullananlar:
  - [parcalar/25-tiklama.md](parcalar/25-tiklama.md) — `tema-degis` (üst şeritteki ay/güneş: görünenin tersini seçer;
    girişliyse dönen değeri `POST /api/profile { tema }` ile hesaba da yazar) ve `tema-sec` (Ayarlar → Görünüm'deki
    Sistem/Açık/Koyu düğmeleri; hesaba da yazar).
  - [parcalar/26-baslat.md](parcalar/26-baslat.md) — `uygulamayiBaslat`: hesapta `sistem` dışında bir tema kayıtlıysa ve
    tarayıcıdakinden farklıysa hesaptaki uygulanır (başka cihazda seçilen tema buraya da gelir).
  - [parcalar/23-veli-ayarlar.md](parcalar/23-veli-ayarlar.md) — Ayarlar → Görünüm kartında hangi düğmenin seçili
    görüneceği `temaOku()` ile.
  - [belge.md](belge.md) — düz sayfalardaki ay/güneş düğmesi (yalnız tarayıcıya yazar).
  - `araclar/gezinti.js` — ekran turu her adımdan önce `temaAyarla("sistem")` çağırır; yalnız `tema: 'serbest'`
    işaretli adımlar (ay/güneş düğmesine basıp temayı değiştiren adımlar) bunu atlar. Koyu görüntüleri işletim sistemi
    tercihini taklit ederek çeker.
- Hesaptaki tema: `POST /api/profile { tema }` — [../../sunucu/bolumler/kayit.md](../../sunucu/bolumler/kayit.md) (yalnız
  `sistem`/`acik`/`koyu`; okul rolündeyken yetişkin hesabına ve rol satırına yazılır); oturumla gelen `tema` alanı
  [../../sunucu/yetki.md](../../sunucu/yetki.md) (`u.tema || 'sistem'`); veritabanında `kullanicilar.tema`.
- CSS: `public/css/parcalar/00-temel.css` (açık palet `:root`; koyu palet hem `@media (prefers-color-scheme: dark)
  { :root:not([data-tema="acik"]) }` hem `:root[data-tema="koyu"]`), `public/css/parcalar/12-ikonlar.css` (ay/güneş
  simgesinden hangisinin görüneceği aynı kuralla), `public/css/parcalar/27-harita-ortak.css` (koyu temada harita
  döşemelerinin karartılması).
- Servis çalışanı ([../sw.md](../sw.md)) kurulurken `/js/tema.js`'i (sürümsüz adresiyle) önbelleğe alır; sayfalar ise
  hep `?v=`'li adresi ister. O adres çalışanın önbelleğine ancak çalışanın denetimindeki bir açılışta girer; o zamana
  kadar ağsız açılışta tarayıcının kendi HTTP önbelleğinden (bir yıllık `immutable`) gelir (ayrıntısı orada).
- Rol: herkes; giriş yapmamış ziyaretçi dahil. Seçim hesaba yalnız girişliyken ve uygulamanın düğmelerinden yazılır.

## Nasıl çalışır (adım adım)?

```
sayfa açılır
  <head>
    <meta theme-color #d62839>  <meta theme-color #15181d media=dark>
    <script src="/js/tema.js?v=…">        ← eş zamanlı, gövde henüz yok
        oku(): localStorage ee_tema ─► 'koyu'
        uygula('koyu'): <html data-tema="koyu">, theme-color #15181d
    <link style.css>  ─► CSS :root[data-tema="koyu"] ─► koyu palet, ilk çizimden itibaren

kişi Ayarlar → Görünüm → "Açık"
  25-tiklama: temaAyarla('acik') ─► localStorage, data-tema="acik", çubuk kırmızı ─► 'acik'
              POST /api/profile { tema: 'acik' }  (hata yutulur)

başka cihazda giriş (orada localStorage 'koyu')
  26-baslat uygulamayiBaslat: hesapta 'acik' ≠ temaOku() 'koyu' ─► temaAyarla('acik')
```

## Dikkat!

- **Yerini değiştirme.** Betik `<head>`'de, `theme-color` meta'larından SONRA ve `defer`/`async` olmadan kalmalı: önce
  gelirse `cubukRengi` meta'yı bulamaz; `defer` olursa koyu temada beyaz yanıp sönme geri gelir. Yeni bir HTML sayfası
  eklersen bu satırı da aynı yere koy.
- **Seçim önce tarayıcıda, sonra hesapta.** Girişsiz sayfalarda yalnız `localStorage` var. Girişte hesapta `sistem`
  dışında bir değer varsa hesap kazanır; hesapta `sistem` kayıtlıysa tarayıcının seçimi kalır (yani hesaptaki "Sistem"
  başka bir tarayıcıdaki "Koyu"yu ezmez). Hesaba yazmak tema.js'in işi değil, çağıranın.
- **Sekmeler arası eşitleme yok.** `storage` olayı dinlenmiyor: bir sekmede tema değişince açık öbür sekmeler ancak
  yenilenince değişir.
- **Renkler iki yerde.** `#15181d` ve `#d62839` hem burada hem HTML sayfalarının `theme-color` meta'larında elle yazılı;
  `00-temel.css`'teki `--zemin` (koyu) ve `--ana` ile aynı olmalı. "Renkler yalnız `00-temel.css`'te" kuralının bilerek
  yapılmış istisnası: betik CSS'ten önce çalışıyor, değişkeni okuyamaz. Palet değişirse bunları ve `public/manifest.json`'daki
  `theme_color`'ı birlikte değiştir.
- **İkinci `theme-color` meta'sı fiilen devre dışı.** Sayfalarda `media`'sız (kırmızı) meta önce,
  `media="(prefers-color-scheme: dark)"`'lı (koyu) meta sonra geliyor. HTML standardına göre tarayıcı belge sırasında
  eşleşen İLK `theme-color`'ı kullanır; `media`'sız olan her zaman eşleştiği için kazanan hep odur, rengi de bu dosya
  ayarlar. Betik çalışmazsa (JavaScript kapalı) koyu sistemde de çubuk kırmızı kalır. Zararı yok; kod değiştirilmedi.
- **Geçersiz değer `sistem` olur.** `temaAyarla('mavi')` hata vermez, `'sistem'` uygular ve yazar; dönen değere bak.
- **`localStorage` kapalıysa** seçim her sayfa açılışında `sistem`'e döner; girişliyse `uygulamayiBaslat` hesaptakini her
  seferinde yeniden uygular (o ana kadar sayfa bir an "Sistem" görünümünde kalır), girişsiz sayfalarda ise seçim kalıcı
  olmaz.
- Bu `.md` dosyası `public/` altında dursa da sunucu `.md` dosyalarını sunmaz (bilinmeyen adresle aynı 404).

## Testleri

- Bu dosyayı tarayıcıda çalıştıran bir test yok; yazım denetimi (`testler/yazim-denetimi.js`) de onu taramaz.
- `testler/test-adresler.js` — düz sayfaların `/css` ve `/js` varlıkları (bu dosya dahil, `?v=` olmadan) 200 dönüyor.
- `testler/test-okul-agi.js` — 300 öğrencinin aynı anda açılışında sayfanın verdiği sürümlü `/js/tema.js?v=…` adresi ve
  servis çalışanının önbelleğe aldığı `/js/tema.js` isteniyor; hiçbiri 429/503 almamalı.
- Ekran turu (`araclar/gezinti.js`, test değil) `tema: 'serbest'` olmayan her adımdan önce `temaAyarla("sistem")`
  çağırır; koyu görüntüler için tarayıcının `prefers-color-scheme`'ını `dark` yapar (yani "Sistem" yolunu dener). Ay/güneş
  düğmesine basan `serbest` adımlar (`#btnTema`, `.site-tema`) da var.
- Elle: `http://localhost:3200`'de ay simgesine bas → koyu; geliştirici araçları → Application → Local Storage'da
  `ee_tema = koyu`; sayfayı yenile → beyaz yanıp sönme olmamalı. Ayarlar → Görünüm → Sistem; işletim sisteminin temasını
  değiştir → sayfa kendiliğinden geçmeli (telefonda adres çubuğu rengi de). Girişliyken Koyu seç, başka bir tarayıcıda
  aynı hesapla gir → koyu açılmalı.

## Son durum

- `git log`: 1 commit. Dosya `2b2105a commit 144` (2026-09-08) ile depoya girdi. Aynı commit'in diff'i: bu dosyanın
  bugünkü 56 satırı; `00-temel.css`'e 98 satırlık koyu palet (iki kopya: `@media (prefers-color-scheme: dark)` içinde
  `:root:not([data-tema="acik"])` ve `:root[data-tema="koyu"]`; açık palet dosyada zaten vardı); `26-baslat.js`'e 37
  satırlık `uygulamayiBaslat` işlevi (hesaptaki temayı `temaAyarla` ile uygulayan satırlar bunun içinde). İlginç bir
  ayrıntı: `public/index.html` `<script src="/js/tema.js">` satırını bu commit'ten önce de taşıyordu (`commit 143`'teki
  hâlinde var); dosyanın kendisi depoya ancak `commit 144`'te girdi. O günden beri dosya değişmedi; sonraki işler yalnız
  onu yükleyen sayfaları çoğalttı (düz sayfalar, sayfa klasörleri).
- Bilinen açık iş yok; sekmeler arası eşitlemenin olmaması ve ikinci `theme-color` meta'sının etkisizliği küçük notlardır.
- Planlı işlerden bu dosyayı etkileyebilecekler: arayüz önizlemesindeki tasarımlardan biri seçilince yazılacak "tasarım
  dili" paleti değiştirirse buradaki iki renk de değişir. "Çok dil" işi sağdan sola diller için `<html dir="rtl">`
  istiyor; dil seçimi de tema gibi sayfa çizilmeden önce uygulanacaksa yeri bu dosya ya da yanında benzer küçük bir betik
  olabilir (tanım bunu belirlemiyor). "Üst şerit sadeleştirme" tema düğmesini telefonda menüye taşıyacak; bu dosyanın
  işlevleri aynı kalır.
