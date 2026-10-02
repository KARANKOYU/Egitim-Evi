# public/js/yonetim/09a-yonetim-paneli.js

Yönetim panelinin kancası: uygulamanın ortak parçalarının yöneticiye baktığı `YONETIM` nesnesini (menü, ana sayfa,
"bu adreste yönetici mi?" denetimi) doldurur ve yönetim adresinde oturumsuz açılışta doğrudan giriş kartını göstertir.

## Bu dosya ne yapar?

Sistem yöneticisinin ekranları herkese giden `/js/app.js`'te yoktur; yalnız yönetici çereziyle inen
`/admin/yonetim.js` paketinde bulunur (bkz. [09-yonetici.md](09-yonetici.md) "Bu dosya ne yapar?"). Ama menü, ana sayfa
ve giriş sonrası yönlendirme uygulamanın ortak parçalarında yazılı. Ortak parçalar yöneticiyi tanımak için tek bir
kancaya bakar: [../parcalar/00-durum.md](../parcalar/00-durum.md)'deki `var YONETIM = null;`. Bu dosya, yalnız yönetim
paketinde yüklendiği için, o kancayı doldurur:

- **Menü** — yöneticinin sol menüsü (Ana Sayfa, Müdürler, Okullar, Yorumlar, Hatırlatıcılar, "Site" başlığı altında Site
  Ayarları, Yönetici Dosyası, Yedekleme, İşlem Kaydı).
- **Ana sayfa** — "EĞİTİM EVİNE HOŞ GELDİNİZ" başlığı, altı renkli kutucuk ve beş sayı (okul, müdür, öğretmen, öğrenci,
  veli).
- **`disariMi`** — yönetim adresinde yönetici olmayan bir oturum açıldıysa (aynı tarayıcının başka sekmesinden kalan
  anahtar) sitenin köküne gönderir.

Ayrıca dosya yüklenirken `S.genelGiris = true` yazar: yönetim adresinde oturum yoksa açılış sayfası değil giriş kartı
görünür.

`app.js`'te bu dosya olmadığı için `YONETIM` orada `null` kalır: yönetici herkese giden sayfada menüde yalnız "Ana
Sayfa"yı (ve en alttaki Ayarlar / Çıkış Yap'ı), ana sayfada "Bu hesabın ekranları bu adreste açılmıyor. Sayfayı
yenile." kutusunu görür (normalde girişte ve `/api/me`'den sonra zaten `/admin`'e geçirilir). Böylece yönetim ekranlarının adları ve uçları `app.js`'e hiç girmez.

Rol: yalnız sistem yöneticisi.

## İçinde neler var?

### `YONETIM.menu()`

Her çağrıda yeni bir dizi döner (06-menu.js `navTanim` yönetici için bunu kullanır). Öğeler `{ k: sayfa, g: simge, ad }`,
ayraç `{ ayrac: 1 }`, başlık `{ baslik }`:

| Sıra | Menü adı | Sayfa (`k`) | Simge | Sayfayı tanımlayan |
|---|---|---|---|---|
| 1 | Ana Sayfa | `ana` | `ev` | [../parcalar/08-ana-sayfa.md](../parcalar/08-ana-sayfa.md) (`YONETIM.anaSayfa`'ya devreder) |
| 2 | Müdürler | `mudurler` | `mudur` | [09-yonetici.md](09-yonetici.md) |
| 3 | Okullar | `okullar` | `okul` | [09-yonetici.md](09-yonetici.md) |
| 4 | Yorumlar | `yorumlar` | `posta` | [09-yonetici.md](09-yonetici.md) |
| 5 | Hatırlatıcılar | `hatirlaticilar` | `bildirim` | [../parcalar/19h-hatirlaticilar.md](../parcalar/19h-hatirlaticilar.md) (herkesin kişisel hatırlatıcıları) |
| — | ayraç, başlık "Site" | | | |
| 6 | Site Ayarları | `site-ayarlari` | `ayar` | [09b-site-ayarlari.md](09b-site-ayarlari.md) |
| 7 | Yönetici Dosyası | `yonetici-dosyasi` | `kilit` | [09c-yonetici-dosyasi.md](09c-yonetici-dosyasi.md) |
| 8 | Yedekleme | `yedekler` | `kutu` | [09-yonetici.md](09-yonetici.md) |
| 9 | İşlem Kaydı | `islem-kaydi` | `belge` | [../parcalar/15-aktarim.md](../parcalar/15-aktarim.md) (yönetici bütün okulların kayıtlarını görür) |

Listede olmayan iki satırı `navCiz` ([../parcalar/06-menu.md](../parcalar/06-menu.md)) herkesin menüsüne olduğu gibi
en alta kendisi ekler: ayraç, **Ayarlar** (`profil`, [../parcalar/23-veli-ayarlar.md](../parcalar/23-veli-ayarlar.md)) ve
**Çıkış Yap** (`data-act="cikis"`). Ayarlar ayrıca ana sayfa kutucuğundan ve üst şeritteki ayar/profil düğmelerinden
açılır. Başlık satırı `nav-baslik`, ayraç `nav-ayrac` olarak çizilir.

### `YONETIM.anaSayfa(ad)`

`ad`: yöneticinin adının ilk kelimesi ([../parcalar/08-ana-sayfa.md](../parcalar/08-ana-sayfa.md) `SAYFALAR.ana`
verir). `GET /api/admin/overview` → yalnız `d.stats` (`okul`, `mudur`, `ogretmen`, `ogrenci`, `veli`) kullanılır.
Çizilen sayfa (`yaz`):

1. `hero('EĞİTİM EVİNE HOŞ GELDİNİZ', 'Merhaba <ad>, sistem yöneticisi panelindesin.')`.
2. `kutucuklar([...])` ([../parcalar/07-yonlendirme.md](../parcalar/07-yonlendirme.md)); her kutucuk
   `data-nav="<k>"` düğmesidir:

   | Kutucuk | Renk | Simge | Alt yazı | Açtığı |
   |---|---|---|---|---|
   | Okullar | lacivert | `okul` | "N okul kayıtlı · Okul aç" | `okullar` |
   | Müdürler | yeşil | `mudur` | "N müdür" | `mudurler` |
   | Site Ayarları | mor | `ayar` | "İletişim, yapımcılar, okul adresleri" | `site-ayarlari` |
   | Yönetici Dosyası | turuncu | `kilit` | "admins.json" | `yonetici-dosyasi` |
   | Yedekleme | camgöbeği | `kutu` | "Veri kopyaları" | `yedekler` |
   | Ayarlar | gri | `ayar` | "Yönetici hesabın" | `profil` |

3. `<div class="grid k4">` içinde beş `stat` ([../parcalar/08-ana-sayfa.md](../parcalar/08-ana-sayfa.md)): Okul, Müdür,
   Öğretmen, Öğrenci, Veli.

Söz döner; `git('ana')` çizim bitince çözülür. Hata (ör. ağ) `git`'in yakalayıcısında kırmızı ileti olur.

Sayıların anlamı (sunucudaki `depo.kullanicilar.sayimlar`): **okul** yalnız açık (`approved`) okullar; **müdür** ve
**öğretmen** onaylı rol satırları; **öğrenci** bütün öğrenci hesapları; **veli** çocuğu bağlı yetişkin hesapları
(`rol = 'parent'`).

### `YONETIM.disariMi()`

`S.user` yoksa ya da rolü `admin` ise `false`. Değilse `location.replace('/')` ve `true` döner. Yorumdaki durum: aynı
tarayıcıda yönetici çerezi geçerli ama bu sekmede saklı anahtar başka (ör. öğretmen) hesabınki; yönetim adresi
yöneticiden başkasına çalışmasın.

### `S.genelGiris = true`

Dosya yüklenirken bir kez çalışır. [../parcalar/05a-dis-sayfalar.md](../parcalar/05a-dis-sayfalar.md)'deki
`girisEkraniGoster` bu bayrak doğruyken adres ne olursa olsun **giriş kartını** açar. `/admin` adresi dış sayfalar
listesinde olmadığından bayrak olmasa açılış sayfası (vitrin) görünürdü. Bayrak, kişi üst şeritten başka bir dış sayfaya
geçince (`siteGit`) ya da geri/ileri tuşunda (`popstate`) `false` olur.

## Kimle konuşur?

- **Kancayı okuyan ortak parçalar:**
  - [../parcalar/00-durum.md](../parcalar/00-durum.md) — `var YONETIM = null;` (kancanın tanımı ve "null ise bu
    ekranlar bu sayfada yok" sözleşmesi); `S`.
  - [../parcalar/06-menu.md](../parcalar/06-menu.md) — `navTanim`: rol `admin` ise `YONETIM ? YONETIM.menu() : [Ana
    Sayfa]`; ardından `menuSuz` (kapalı bölüm süzgeci; yöneticide etkisiz) ve `navCiz`.
  - [../parcalar/08-ana-sayfa.md](../parcalar/08-ana-sayfa.md) — `SAYFALAR.ana`: rol `admin` ise `YONETIM.anaSayfa(ad)`,
    kanca yoksa "Bu hesabın ekranları bu adreste açılmıyor. Sayfayı yenile.".
  - [../parcalar/05b-sifre-zorunlu.md](../parcalar/05b-sifre-zorunlu.md) — `girisSonrasi`: önce `yonetimeGec(d)`
    (yönetici yönetim adresinde değilse tam sayfa geçiş), sonra `YONETIM && YONETIM.disariMi()`.
  - [../parcalar/26-baslat.md](../parcalar/26-baslat.md) — `cikisYap`: `YONETIM` doluysa çıkışta `location.replace('/login')`
    (yönetim paketi o sayfada kalmasın, giriş sayfası herkese giden dosyayla açılsın).
  - [../parcalar/05a-dis-sayfalar.md](../parcalar/05a-dis-sayfalar.md) — `S.genelGiris` (`girisEkraniGoster`, `siteGit`,
    `popstate`); şifre sıfırlama bağlantısıyla gelişte [../parcalar/26-baslat.md](../parcalar/26-baslat.md) de bayrağı
    doğru yapar.
- **Çağırdıkları:** `api` ([../parcalar/01-yardimcilar.md](../parcalar/01-yardimcilar.md)), `yaz`, `hero`, `kutucuklar`
  ([../parcalar/07-yonlendirme.md](../parcalar/07-yonlendirme.md)), `stat`
  ([../parcalar/08-ana-sayfa.md](../parcalar/08-ana-sayfa.md)); `S.user`.
- **Sunucu ucu:** `GET /api/admin/overview` ([../../../sunucu/bolumler/yonetici.md](../../../sunucu/bolumler/yonetici.md));
  aynı uç Okullar sayfasını da besler ([09-yonetici.md](09-yonetici.md)).
- **Yükleyen:** [../../../sunucu/http.md](../../../sunucu/http.md) `yonetimJsOku` / `birlesikOku` — `parcalar/` ile
  `yonetim/` parçaları ad sırasıyla tek IIFE'de: bu dosya `09-yonetici.js`'ten sonra, `09b-site-ayarlari.js`'ten önce
  gelir; `00-durum.js`'teki `YONETIM` ve `S` çoktan tanımlıdır. Paket yalnız geçerli yönetici çereziyle verilir
  ([../../../sunucu/yonetim-cerezi.md](../../../sunucu/yonetim-cerezi.md)); akışın bütünü
  [../../../TANITIM.md](../../../TANITIM.md) "Gizli yönetim paketi ve çerezi".
- **CSS:** `public/css/parcalar/10-ana-sayfa-kutucuklari.css` (`.kutucuklar`, `.kutucuk` ve renkleri `lacivert`, `yesil`,
  `mor`, `turuncu`, `camgobegi`, `gri`), `04-kartlar.css` (`.grid.k4`, `.stat`), `03-iskelet.css` (`.hero`; menü
  satırları `.navlink`, ayraç `.nav-ayrac`), menüyü daraltma `08-menu-filtre.css`.
- **Rol:** yalnız sistem yöneticisi.

## Nasıl çalışır (adım adım)?

```
Yönetici /login'den girer ─► sunucu yönetim çerezi + { yonetimAdresi: '/admin' }
  05b girisSonrasi ─► yonetimeGec ─► location.replace('/admin')        (tam sayfa: çerez ancak böyle gider)
/admin ─► http.js yonetimSun: çerez geçerli ─► index.html (app.js yerine /admin/yonetim.js?v=…)
/admin/yonetim.js yüklenir:
  … 00-durum.js (YONETIM = null) … 09a-yonetim-paneli.js:  YONETIM = { menu, anaSayfa, disariMi };  S.genelGiris = true
  26-baslat.js: anahtar var mı? (önce yonetimeGec'in bu sekmeye bıraktığı geçiş anahtarı, yoksa saklı anahtar)
     yok ─► girisEkraniGoster ─► S.genelGiris ─► giriş kartı
     var ─► /api/me ─► girisSonrasi ─► yonetimeGec (zaten /admin: hayır) ─► YONETIM.disariMi()
                 yönetici değil ─► location.replace('/')
                 yönetici       ─► uygulamayiBaslat ─► navCiz: YONETIM.menu() ─► git('ana') ─► YONETIM.anaSayfa(ad)
                                                         ─► GET /api/admin/overview ─► kutucuklar + sayılar
Çıkış ─► cikisYap ─► YONETIM dolu ─► location.replace('/login')   (herkese giden app.js ile)
```

## Dikkat!

- **`YONETIM`'e atama yapılır, yeniden `var` yazılmaz.** Kancanın tanımı `00-durum.js`'te; burası yalnız doldurur. Ortak
  parçalarda yöneticiye özel yeni bir davranış gerekirse kancaya yeni bir alan eklenir ve parça `YONETIM && YONETIM.x`
  diye bakar; yönetici ekranının kodu ve uç adları `public/js/parcalar/`'a yazılmaz (`testler/test-admin-gizli.js`
  `app.js`'te `/admin` ve yönetim uçlarını arar).
- **Ana sayfa ağır bir uçla çiziliyor.** Yalnız beş sayı için `GET /api/admin/overview` çağrılır; bu uç her okulun disk
  kullanımını, sistem diskini (`statfs`) ve veritabanı boyutunu da hesaplar ([../../../sunucu/bolumler/okul-disk.md](../../../sunucu/bolumler/okul-disk.md)
  `sistem`). Okul sayısı arttıkça ana sayfa yavaşlayabilir. Kod okumasına göre; ölçülmedi. Planlı "Sistem" ve
  "Optimizasyon" işleri ölçecek.
- **"N okul kayıtlı" iki yerde farklı.** Kutucuktaki sayı yalnız açık okulları, Okullar sayfasının başlığı bütün okulları
  (müdürü kaldırılmış ve kapalılar dahil) sayar ([09-yonetici.md](09-yonetici.md) Dikkat).
- **`disariMi` anahtarı silmez.** Yönetici olmayan hesabın anahtarı tarayıcıda kalır; kök adreste o hesap normal açılır.
  Kodda bunun gerekçesi yazılı değil, ama silmemek doğru görünüyor: o anahtar aynı tarayıcıdaki başka bir sekmenin geçerli
  oturumudur, silinse o sekme de düşerdi.
- **`S.genelGiris` yükleme anında yazılır.** Dış sayfaya geçiş ya da geri tuşu bayrağı `false` yapar; o andan sonra
  `/admin`'e geri/ileri ile dönülürse `disSayfa()` `/admin`'i tanımadığı için giriş kartı yerine açılış sayfası
  görünebilir. Kod okumasına göre; olağan akışta (giriş kartı → giriş) etkisi yok.
- **Menüdeki iki sayfa uygulama parçasından gelir.** "Hatırlatıcılar" ve "İşlem Kaydı" herkese giden `app.js`'te de
  vardır (öteki roller de kullanır); yönetim paketine ayrıca kopyalanmaz. "İşlem Kaydı"nda yönetici bütün okulların ve
  okulsuz (site ayarı, okul açma…) kayıtları görür.
- Ana sayfadaki "Okullar" kutucuğunun alt yazısı "· Okul aç" der ama kutucuk yalnız Okullar sayfasını açar; pencereyi
  açmak için oradaki **Okul aç** düğmesine basılır.

## Testleri

- `testler/test-admin-gizli.js` — `/admin` kabuğu `/js/app.js` yerine `/admin/yonetim.js?v=…` yükler; paket yalnız geçerli
  çerezle iner ve derlenir; `app.js`'te yönetim kodu yok, yönetim paketi `app.js`'ten büyük; giriş, `/api/me` ve şifre
  değiştirme cevaplarında `yonetimAdresi` yalnız yöneticiye gelir; çıkışta çerez silinir.
- `testler/buton-denetimi.js` — menüdeki ve kutucuklardaki her sayfa anahtarının (`k`) bir `SAYFALAR` karşılığı var mı,
  tanımlı her sayfaya bir menü/kutucuk yolu var mı (yönetim parçaları dahil birleştirilir).
- `testler/test-kucult.js` — yönetim paketi yorumsuz hâliyle derleniyor mu.
- `testler/yazim-denetimi.js` — metinlerde yazım hataları.
- Sunucu tarafı: `testler/guvenlik-test.js` (öğrenci `/api/admin/overview`'da bilinmeyen adresle aynı 404 alır),
  `testler/yetki-denetimi.js` (bu uç yalnız yöneticiye), `testler/test-okul-disk.js` (aynı cevabın disk alanları).
  Ana sayfadaki beş sayıyı (`stats`) doğrudan denetleyen test yok.
- Elle: yönetici hesabıyla `/login`'den gir → adres `/admin` olmalı, sol menüde dokuz bağlantı, "Site" başlığı ve en
  altta Ayarlar / Çıkış Yap; ana sayfada altı kutucuk ve beş sayı. Çıkış yap → `/login`. Aynı tarayıcıda başka sekmede bir öğretmenle girip "beni
  hatırla" seçtiysen ve yönetici çerezi hâlâ geçerliyse `/admin`'i açınca kök adrese gönderilmelisin.

## Son durum

- `git log`: 1 commit. Dosya `276c0a0 commit 521` (2026-09-27, gizli yönetim paneli) ile doğdu ve o günden beri
  değişmedi. O commit'te yöneticinin menüsü `06-menu.js`'ten, ana sayfası `08-ana-sayfa.js`'ten buraya taşındı;
  `00-durum.js`'e boş `YONETIM` kancası, ortak parçalara `YONETIM ? … : …` dalları eklendi. Taşınırken menüye "Site"
  başlığı ile **Site Ayarları** ve **Yönetici Dosyası**, ana sayfaya bu ikisinin kutucukları geldi; `disariMi` yeni.
  `S.genelGiris` bayrağı ise daha önce de vardı (şifre sıfırlama bağlantısıyla gelişte giriş kartını açmak için,
  `05a-dis-sayfalar.js` ve `26-baslat.js`); yeni olan, bu dosyanın onu yönetim adresinde açılışta doğru yapması.
- Açık iş yok; bilinen küçük noktalar yukarıda (ağır ana sayfa ucu, iki farklı okul sayısı).
- Planlı işlerden bu dosyaya dokunacaklar:
  - "Paneller" (iş 5): adres `/panel/admin` (ve `/panel/destek`) olur; menüye "Kullanıcılar", "Destek talepleri",
    "Destek dosyası" gelir; "Okullar" okul gezginine döner. Kullanıcının 27 Eylül kararıyla yönetici girişte OTOMATİK
    panele atılmaz (bugünkü `yonetimeGec` akışı değişir); alt bilginin solunda yalnız yönetici/destek için "Yönetim" /
    "Destek paneli" düğmesi çıkar ve bağlantı yalnız `/api/me` cevabından gelir. Site rolleri çoklu (eğitmen, çevirmen,
    destek): `/panel/<ad>` için tek kapı tablosu.
  - "Sistem" (iş 4): "Sistem durumu" ekranı, bakım modu, site duyurusu, yöneticiye zorunlu doğrulama uygulaması (TOTP)
    kurulumu, tarayıcı hata günlüğü — yeni menü öğeleri ve büyük olasılıkla ana sayfaya özet.
  - "Kullanıcı arama" (iş 6, `/users/<ad>`), "Eğitim içerikleri" (iş 17: eğitmen başvurusu ve video bildirimleri panelde),
    "Çok dil" (iş 22: çevirmen rolü, `/panel/translate`), "Eklentiler" (iş 35; şimdilik yalnız belgelenir: yayıncı
    hesabını yönetici açar) — yeni panel bölümleri.
