# public/sw.js

Sitenin servis çalışanı (service worker): kurulunca uygulama kabuğunu önbelleğe alır, sitenin kendi GET isteklerini "önce
ağ, ağ yoksa önbellek" diye karşılar (`/api/` asla), telefon bildirimlerini (Web Push) gösterir ve bildirime dokununca
uygulamayı açar.

## Bu dosya ne yapar?

Servis çalışanı, tarayıcının sayfadan ayrı, arka planda çalıştırdığı bir betiktir. Sitenin bütün sayfalarının ağ
isteklerinin arasına girebilir ve sayfa kapalıyken bile tarayıcı onu uyandırıp bir telefon bildirimi teslim edebilir.
Eğitim Evi'nde üç işe yarar:

1. **Kurulabilir uygulama (PWA).** Sitenin telefona/bilgisayara "uygulama gibi" kurulabilmesinin parçası; öbür parçası
   `public/manifest.json`. Kurulum düğmesi ve kayıt [js/parcalar/04-pwa.md](js/parcalar/04-pwa.md)'de.
2. **Ağ yokken açılış.** Kurulurken uygulamanın kabuğunu (ana sayfa, birleşik stil ve betik, yazı tipleri, simgeler)
   önbelleğe alır; sonra gezilen sayfa ve dosyaları da biriktirir. Ağ yoksa bunlardan verir.
3. **Telefon bildirimi.** Sunucu bir bildirim yazınca abone olmuş cihaza şifreli bir push gönderir; bu dosya onu açıp
   ekranda gösterir, dokununca doğru okula, role ve sayfaya götürür.

Strateji bilerek sade: **`/api/` istekleri hiç önbelleğe alınmaz** (ders programı, notlar, giriş kodu bayat olmamalı) ve
sayfa/dosyalar **önce ağdan** denenir. Böylece yeni bir sürüm yüklendiğinde kişi eski kodda takılı kalmaz; önbellek
yalnız ağ yokken devreye girer.

Uygulama parçaları gibi birleştirilmez, `/sw.js` olarak olduğu gibi sunulur. Ön yüzün ES5 kuralının bilinen istisnasıdır:
`const`/`let` kullanır (servis çalışanını zaten yalnız modern tarayıcılar çalıştırır).

## İçinde neler var?

### Sabitler

- `SURUM` — önbelleğin adı, bugün `'egitim-evi-v9'`. Yanındaki yorum kuralı söyler: dosya listesi ya da sayfa adresleri
  değişince bir artır (`v9`: yeni simge ve simge adreslerindeki `?v=2`). Ad değişince eski önbellek `activate`'te silinir.
- `KABUK` — kurulumda önbelleğe alınan 12 adres: `/`, `/index.html`, `/css/style.css`, `/js/tema.js`, `/js/app.js`, dört
  yazı tipi (`/yazitipi/plex-sans-400-700-latin.woff2`, `…-latin-ext.woff2`, `/yazitipi/newsreader-700-latin.woff2`,
  `…-latin-ext.woff2`), `/manifest.json`, `/simge-192.png?v=2`, `/simge-512.png?v=2`.

### Olay dinleyicileri

- **`install`** — `caches.open(SURUM)` → `addAll(KABUK)`. Bir dosya alınamazsa hata yutulur ("kurulum tamamen çökmesin");
  her durumda `skipWaiting()`: yeni sürüm, eskisinin kapanmasını beklemeden etkinleşir.
- **`activate`** — adı `SURUM`'dan farklı bütün önbellekleri siler, sonra `clients.claim()`: açık sayfalar yeniden
  yüklenmeden bu çalışanın denetimine geçer.
- **`push`** — gelen veri JSON'dur: `{ t: başlık, b: metin, u: uygulama içi adres }`. Çözülemezse `{}` sayılır. Bildirim:
  başlık `t` (en çok 80 karakter; yoksa `"Eğitim Evi"`), gövde `b` (en çok 300), simge `/simge-192.png?v=2`, rozet
  `/simge-rozet.png?v=2` (tek renk siluet: telefon rozetin yalnız saydamlığını kullanır), `data.adres` = `u` (yoksa `/`).
  Push geldiğinde **her zaman** bir bildirim gösterilir (veri boş olsa bile).
- **`notificationclick`** — bildirimi kapatır; `data.adres`'ten sitenin kökenine göre bir `URL` kurar (bozuksa `/`); başka
  bir siteye çıkıyorsa `/`'a çevirir. Sonra açık pencerelere bakar (`clients.matchAll({ type: 'window',
  includeUncontrolled: true })`): sitenin kendi kökenindeki listede ilk pencereyi (standart listeyi en son odaklanan
  pencere önce gelecek biçimde sıralar) öne getirir (`focus`) ve o adrese götürür
  (`navigate`); hiç pencere yoksa yeni pencere açar (`openWindow`). Öne getirme ya da yönlendirme hatası sessizce yutulur.
- **`fetch`** — yalnız şu isteklere karışır: yöntem `GET`, köken sitenin kendisi, yol `/api/` ile başlamıyor. Öbürleri
  (POST'lar, `/api/…`, harita döşemeleri gibi başka kökenler) hiç dokunulmadan tarayıcıya bırakılır. Karıştığı istekte:
  1. önce ağ (`fetch(istek)`). Bu `fetch` tarayıcının kendi HTTP önbelleğinden de geçer: bir yıllık `immutable` saklanan
     dosyalar (`?v=`'li betik ve stil, yazı tipleri, simgeler) ağ olmasa da buradan başarıyla gelir; `no-cache`'li olanlar
     (sayfalar, `belge.js`, `indir.js`, `sw.js`) ise sunucuya sorulmadan verilmez, ağ yoksa bu adım hata verir;
  2. cevap 200, aynı kökenden (`type === 'basic'`) ve `Cache-Control`'unda `no-store` yoksa bir kopyası `SURUM`
     önbelleğine yazılır (beklenmeden; yazma hatası yutulur) ve cevap verilir. Yazma `e.waitUntil`'e bağlanmadığı için
     tarayıcı çalışanı cevaptan hemen sonra durdurursa o kopya yazılmadan kalabilir; zararı yalnız bir sonraki
     çevrimiçi açılışa kadar o dosyanın ağsız bulunamamasıdır;
  3. ağ hatasında önbellekte aynı istek aranır; varsa o;
  4. yoksa ve istek bir sayfa gezinmesiyse (`mode === 'navigate'`) önbellekteki `/index.html` (o da önbellekte yoksa
     `respondWith`'e `undefined` gider; bu ağ hatası sayılır ve tarayıcı kendi "bağlantı yok" sayfasını gösterir);
  5. yoksa `503` ve düz metin `Çevrimdışısın`.

## Kimle konuşur?

- Kaydeden: [js/parcalar/04-pwa.md](js/parcalar/04-pwa.md) — `pwaKur()`, `navigator.serviceWorker.register('/sw.js')`
  (kapsam varsayılan `/`: bütün site). Yalnız güvenli bağlamda (`https://` ya da `localhost`); `http://192.168…` gibi bir
  ağ adresinde kayıt olmaz. Kayıt `index.html`'i yükleyen her açılışta yapılır (giriş ekranında da); düz sayfalar
  (`kvkk`, `kosullar`, `indir`, `404`, `okul-bulunamadi`) kaydetmez ama kayıt bir kez yapılınca kapsam `/` olduğu için onlar
  da bu çalışanın denetimindedir.
- Kayda dayanan: [js/parcalar/04b-bildirim-izni.md](js/parcalar/04b-bildirim-izni.md) — `navigator.serviceWorker.ready`
  (en çok 8 sn), `pushManager.subscribe` ile abonelik; abonelik sunucuya yazılır.
- Sunucu tarafı:
  - [../sunucu/push.md](../sunucu/push.md) — bildirim yazılınca abonelere `{ t: 'Eğitim Evi', b: metin (≤300), u:
    bildirimAdresi }` gönderir; içerik cihazın anahtarıyla şifrelenir (RFC 8291), push servisi okuyamaz. `u` okul rolünde
    `/school/<kısa ad>/?k=<alıcı>#/<sayfa>` biçimindedir; bildirimin bağlantısı yoksa `#/ana`.
  - [../sunucu/http.md](../sunucu/http.md) — `/sw.js` düz statik dosya: `text/javascript`, `Cache-Control: no-cache` +
    `ETag` (tarayıcı yeni sürüm var mı diye her seferinde sorar). CSP'de `worker-src 'self'` (yalnız sitenin kendi
    çalışanı). Bu dosyanın saygı gösterdiği `no-store` başlıkları da orada: gizli yönetim kabuğu ve `/admin/yonetim.js`,
    bütün 404 cevapları, bütün JSON cevapları.
- Bildirime dokununca açılan adresi uygulama karşılar: [js/parcalar/26-baslat.md](js/parcalar/26-baslat.md) `?k=`'yı okur,
  adresten siler ve gerekiyorsa bildirimin geldiği role geçer (`POST /api/kisilik/gec`); `#/<sayfa>` yönlendirmeyle açılır.
- Önbelleğe aldığı dosyalar: `public/index.html` (kabuk; sunucu içindeki betik/stil adreslerine `?v=` ekler), birleşik
  `/css/style.css` ve `/js/app.js` (sunucu parçalardan üretir), [js/tema.md](js/tema.md), `public/yazitipi/` altındaki
  yazı tipleri, `public/manifest.json`, simgeler (`araclar/simge-uret.js` üretir; o aracın yorumu simge değişince buradaki
  `?v=` ve `SURUM`'un da artırılmasını söyler).
- Önbelleğe ALMADIKLARI: `/api/…` (ödev ekleri, okul fotoğrafları ve indirme biletleri de bunun altında), başka kökenler
  (OpenStreetMap döşemeleri — [js/parcalar/19d-harita.md](js/parcalar/19d-harita.md)), GET dışı istekler, `no-store`'lu
  cevaplar, 200 dışı cevaplar.
- Rol: kayıt herkese (giriş yapmamış ziyaretçiye de); bildirim yalnız girişli olup bildirim iznini veren ve abone olan
  kişiye.

## Nasıl çalışır (adım adım)?

### Yaşam döngüsü

```
ilk açılış (https)          04-pwa: register('/sw.js')
  install   ─► caches.open('egitim-evi-v9').addAll(KABUK)  (hata → yut) ─► skipWaiting
  activate  ─► başka adlı önbellekleri sil ─► clients.claim (açık sayfalar artık denetimde)
sw.js değişti (sunucu no-cache; tarayıcı farkı görür)
  yeni install ─► skipWaiting ─► activate: SURUM arttıysa eski önbellek silinir
```

### Bir istek

```
GET /school/ornek-okul         (sayfa gezinmesi)
  ağ var  ─► 200, no-store değil ─► önbelleğe kopya ─► sayfa
  ağ yok  ─► önbellekte bu adres? ─► evet: o / hayır: /index.html
GET /js/app.js?v=abc           ağ yok: tarayıcının HTTP önbelleğinde (1 yıl) varsa oradan gelir
                               orada da, çalışanın önbelleğinde de yoksa ─► 503 "Çevrimdışısın"
GET /api/me                    çalışan karışmaz ─► ağ (yoksa sayfanın kendi hatası)
GET /admin/yonetim.js          ağ ─► no-store ─► önbelleğe YAZILMAZ
```

### Bir bildirim

```
sunucu: bildirim yazıldı ─► push.js ─► şifreli push ─► tarayıcı çalışanı uyandırır
push ─► showNotification("Eğitim Evi", "Matematik ödevin açıklandı…", data.adres)
dokunma ─► notificationclick
   açık site penceresi var ─► focus ─► navigate("/school/ornek-okul/?k=…#/odevler")
   yok                    ─► openWindow(aynı adres)
   26-baslat: ?k= ─► gerekirse role geç ─► sayfa
```

## Dikkat!

- **`SURUM`'u artırmayı unutma.** `KABUK`'taki bir adres ya da sayfa adresleri değişince (simge `?v=`'si dahil) `SURUM`
  bir artırılmalı; yoksa eski önbellek ve içindeki eski adresler kalır. `testler/test-adresler.js` listede eski sayfa
  adreslerinin (`/kvkk.html`, `/indir`, `/sss`…) olmadığını denetler.
- **Kabuktaki betik ve stil, sayfanın istediği adresler değil.** Sunucu HTML'deki `/js/app.js`, `/css/style.css`,
  `/js/tema.js` adreslerine `?v=<ETag>` ekliyor; `KABUK` ise bunları `?v=`'siz önbelleğe alıyor. Önbellekte arama sorgu
  dizisini de karşılaştırdığı için kabuk sayfası `?v=`'li adresleri isteyince bu `?v=`'siz kopyalar hiç kullanılmaz
  (yalnız sunucu `htmlSurumle`'de bir varlığı okuyamayıp sayfayı sürümsüz verdiğinde işe yarar). Sürümlü adresler
  çalışanın önbelleğine ancak çalışanın denetimindeki bir açılışta (ilk kayıttan sonraki ziyaretlerde) girer. İlk
  ziyaretin hemen ardından ağsız açılışı bugün çoğu zaman tarayıcının kendi HTTP önbelleği kurtarır: sayfa bu dosyaları
  ilk açılışta `max-age=31536000, immutable` ile almıştı, çalışanın `fetch`'i onları ağ olmadan oradan verir. Tarayıcı o
  önbelleği boşalttıysa (yer darlığı, "önbelleği temizle") ve çalışan henüz denetimli bir açılış görmediyse kabuk açılır
  ama betik ve stil `503 Çevrimdışısın` alır; stilsiz ve çalışmayan bir sayfa görünür. Kod okumasına göre; tarayıcıda
  denenmedi. Düzeltme önerisi: kurulumda kabuğun içindeki sürümlü adresleri de almak (ya da bu üç adreste
  `ignoreSearch` ile aramak); o zaman `?v=`'siz kopyalara da gerek kalmaz.
- **Ağsız açılış pratikte giriş ekranında biter.** Kabuk açılsa bile uygulama `/api/me`'yi ağdan ister; bu başarısız
  olunca [js/parcalar/26-baslat.md](js/parcalar/26-baslat.md)'ye göre oturum yerelde silinir. Yani "çevrimdışı çalışma"
  bugün yalnız sayfanın açılmasıdır, veri gösterilmez.
- **Önbellek kendiliğinden küçülmez.** Ağdan gelen her başarılı aynı-köken GET (her sayfa adresi, her `?v=` sürümü, her
  resim/yazı tipi) `SURUM` önbelleğine yazılır ve `SURUM` değişene kadar silinmez. Her güncellemede yeni `app.js?v=…` ve
  `style.css?v=…` eklenir, eskiler kalır. Ayrıca her açılışta tarayıcı önbelleğinden gelen dosyalar bile yeniden yazılır
  (gereksiz disk yazımı). Kod okumasına göre; ölçülmedi.
- **`no-store` önbelleğe girmez.** Gizli yönetim paneli (`/admin`, `/admin/yonetim.js`) `no-store` ile gelir; bu kural
  sayesinde yönetici paketi cihazın diskine yazılmaz. Gelecekte `/api` dışında hassas bir cevap verirsen ona da `no-store`
  koy.
- **`addAll` ya hep ya hiç.** `KABUK`'taki tek bir dosya başarılı (2xx) dönmezse (silindi, adı değişti) hiçbiri önbelleğe
  girmez; hata yutulduğu için kurulum başarılı görünür ama kabuk boş kalır. Ağsız açılış o zaman yalnız sonraki
  çevrimiçi ziyaretlerde `fetch` dinleyicisinin biriktirdiği adreslerle çalışır; gezilmemiş bir adrese ağsız gidilince
  `/index.html` yedeği de olmadığı için tarayıcının "bağlantı yok" sayfası çıkar. Liste değişirse her adresin gerçekten
  sunulduğunu dene.
- **Yeni sürüm hemen devralır.** `skipWaiting` + `clients.claim`: değişen `sw.js` açık sekmeleri de anında denetimine
  alır. Strateji "önce ağ" olduğu için bugün zararsız; `fetch` mantığını değiştirirsen değişikliğin açık oturumlara
  sayfa yenilenmeden uygulanacağını hesaba kat.
- **Zaman aşımı yok.** Ağ yavaşsa (kopuk değilse) çalışan ağı bekler; önbellek yalnız ağ hatasında kullanılır.
- **Bildirime dokununca açık pencere değişir.** Sitenin listede ilk (genelde en son kullanılan) açık penceresi
  bildirimin adresine götürülür; orada yarım kalmış bir iş varsa sayfanın kendi "ayrılınsın mı" sorusuna kalır. Seçilen pencere bu çalışanın denetiminde değilse
  (`includeUncontrolled` onları da listeler; ör. Shift ile zorla yenilenmiş sayfa) `navigate` reddedilir, hata yutulur:
  pencere öne gelir ama sayfa değişmez. Kod okumasına göre; denenmedi.
- **Bildirim başlığı bugün hep "Eğitim Evi".** Sunucu `t`'yi sabit gönderiyor; `tag` verilmediği için her bildirim ayrı
  durur (üst üste binmez). Bildirimin metni kilit ekranında telefonun ayarına göre görünür; içerik yol boyunca şifrelidir.
- **Yalnız sitenin kendi adresine gidilir.** `data.adres` başka bir kökene çıkıyorsa `/` açılır (bildirimden dışarı
  yönlendirme yok).
- **Geliştirirken:** sunucu yeniden başlarken (bağlantı kurulamazken) açılan sayfada, önbellekte olmayan dosyalar
  `503 Çevrimdışısın` alabilir; sunucu açılınca sayfayı yenile. Tarayıcının geliştirici araçlarında Application → Service
  Workers'tan çalışanı kaldırabilir ya da "Update on reload" seçebilirsin.
- **`testler/test-okul-agi.js` listeyi elle taşır.** Yük testi, çalışanın kurulumda isteyeceği dosyaları (`KABUK`'un
  12 adresinden, tarayıcı önbelleğinde henüz olmayan 7'si: `/`, `/index.html`, `/css/style.css`, `/js/tema.js`,
  `/js/app.js`, `/manifest.json`, `/simge-512.png?v=2`) elle yazar; `KABUK` değişirse oradaki liste kendiliğinden
  değişmez.
- Bu `.md` dosyası `public/` altında dursa da sunucu `.md` dosyalarını sunmaz (bilinmeyen adresle aynı 404).

## Testleri

- Bu dosyayı tarayıcıda çalıştıran bir test yok (kurulum, önbellek ve push olayları başsız denemede yok).
- `testler/test-adresler.js` — `/sw.js` 200 dönüyor ve `KABUK`'ta eski sayfa adresleri (`/kvkk.html`, `/kosullar.html`,
  `/indir.html`, `/indir`, `/sss`, `/faq`) yok.
- `testler/test-okul-agi.js` — 300 öğrencinin aynı anda açılışında `/sw.js` ve çalışanın kurulumda istediği dosyalar
  (`/`, `/index.html`, `/css/style.css`, `/js/tema.js`, `/js/app.js`, `/manifest.json`, `/simge-512.png?v=2`) da isteniyor;
  hiçbiri hız sınırına takılmamalı.
- `testler/test-push.js` (sunucusuz) — bu dosyanın çözdüğü içeriğin sunucu tarafı: RFC 8291 şifreleme, VAPID imzası,
  yalnız bilinen push servisleri.
- `testler/test-servis-konum.js` "TELEFON BİLDİRİMİ ABONELİĞİ" bölümü — bu çalışanın kaydı üzerinden yapılan aboneliğin
  sunucu tarafı: açık anahtar yalnız girişliye, iç ağ/`http`/sahte alan/uzun adres/bozuk anahtar reddediliyor, aynı
  cihaz başka hesaba geçince eskisinden düşüyor, başka anahtarla devralınamıyor, kişi başına en çok 5 cihaz.
- `testler/test-bildirim.js` — push'u tetikleyen bildirimlerin kendisi: aynı olayda fazladan bildirim gitmiyor, öğrencinin
  bildiriminin kopyası velisine gidiyor. `testler/tumtest.sh` sunucuyu `EE_PUSH_GONDERME=0` ile açtığı için testlerde
  gerçek push gönderilmez.
- Elle: Chrome'da `http://localhost:3200` aç → geliştirici araçları → Application → Service Workers: `/sw.js` etkin;
  Cache Storage'da `egitim-evi-v9` ve kabuk dosyaları. Giriş yapmadan Network'te "Offline" seç, sayfayı yenile → sayfa
  önbellekten gelmeli; stil ve betik Network sekmesinde ya "(disk cache)" (tarayıcının HTTP önbelleği) ya da
  "(ServiceWorker)" olarak görünür. Yukarıdaki 503 durumunu denemek için önce yalnız "önbelleğe alınmış resim ve
  dosyalar"ı temizle (site verisine dokunmadan), sonra çevrimdışı yenile. Girişliyken denersen `/api/me` başarısız olur ve oturum
  bu tarayıcıda silinir. Bildirim: sunucuyu `EE_PUSH_GONDERME=0` olmadan aç (push, tarayıcının push servisinden geçtiği
  için internet gerekir); girişli bir hesapla Ayarlar'daki "Telefon bildirimleri" kartından aç, başka hesapla ona mesaj
  gönder → bildirim çıkmalı, dokununca doğru sayfa açılmalı.

## Son durum

- `git log`: 5 commit. Son değişiklik `0d27eba commit 523` (2026-09-27, yeni simge): `SURUM` `v8` → `v9`; `KABUK`'taki
  simgeler `?v=2`'li oldu; bildirim simgesi `/simge-192.png?v=2`, rozet `/simge-192.png`'den yeni tek renkli
  `/simge-rozet.png?v=2`'ye geçti. Aynı commit simgeleri yeniden üretti (`araclar/simge-uret.js`) ve sayfalardaki,
  `manifest.json`'daki simge adreslerine `?v=2` ekledi.
- `276c0a0 commit 521` (2026-09-27): `SURUM` `v7` → `v8`; `fetch`'te `Cache-Control: no-store` diyen cevapların önbelleğe
  yazılmaması eklendi. Aynı commit gizli yönetim panelini ve onun `no-store` cevaplarını getirdi; bu satır yönetici
  paketinin cihaz diskine düşmemesi içindir.
- `b6bfc03 commit 517` (2026-09-27, sayfa klasörleri): `SURUM` `v6` → `v7` (eski `/kvkk.html` gibi adresler önbellekten
  düşsün). Ondan önce `abc93b1 commit 331` (2026-09-26) `fetch` dinleyicisini (önce ağ, `/api` hariç, ağsız yedek) ekledi;
  dosyanın ilk hâli `c48182d commit 330` (2026-09-26): `KABUK`, `install`, `activate`, `push`, `notificationclick`.
- Bilinen açıklar (kod değiştirilmedi): kabuktaki `?v=`'siz betik/stil adresleri (sayfanın istediği `?v=`'li adresler
  çalışanın önbelleğine ilk kurulumda girmiyor; tarayıcının HTTP önbelleği boşaldıysa ağsız açılan sayfa stilsiz ve
  çalışmaz kalır); önbelleğin sınırsız büyümesi; denetimsiz pencerede `navigate`'in sessizce başarısız olması;
  `addAll` hatasının yutulması.
- Planlı işlerden bu dosyayı etkileyecekler: "Üst şerit sadeleştirme" tanımı çıkıştan sonra geri/ileri sorununa karşı
  uygulama kabuğu (`index.html`) ve `/api` cevaplarına `no-store` öneriyor ve "servis çalışanı `/api`'yi önbelleğe almaz"
  denetimini istiyor (bugün zaten almıyor). Kabuk `no-store` olursa bu dosya sayfa adreslerini artık hiç önbelleğe
  yazmaz; ağsız gezinme yalnız kurulumdaki `/` ve `/index.html`'e kalır ve onlar kurulum anındaki (eski `?v=`'li) hâlde
  donar — o iş yapılırken buradaki strateji de birlikte düşünülmeli. "Sistem" işindeki bakım modu (sayfalar 503) bu
  dosyadan geçer: 503 önbelleğe yazılmaz, ağ hatası sayılmaz, kişiye bakım sayfası gider. "Eğitim içerikleri" işindeki
  çevrimdışı izlenecek videolar tarayıcıda IndexedDB'de tutulacak; "İndirilenler" sayfasının ağsız açılması bu dosyanın
  ağsız kabuğuna dayanacak, yukarıdaki `?v=` sorunu o zaman önem kazanır. Simge yeniden çizilirse `?v=` ve `SURUM` yine
  artırılmalı.
