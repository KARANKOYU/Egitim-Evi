# public/js/belge.js

Uygulama paketinin (`/js/app.js`) yüklenmediği düz sayfaların küçük betiği: üst şeritteki "Yapımcılar" açılır listesi,
ay/güneş tema düğmesi, "Okul bulunamadı" sayfasında adresteki okul adının yazılması ve yapımcı listesinin `/api/site`'tan
yenilenmesi.

## Bu dosya ne yapar?

Sitenin çoğu tek sayfalık uygulamadır: `public/index.html` açılır, `/js/app.js` her şeyi çizer. Ama birkaç sayfa düz HTML
dosyasıdır ve uygulama paketini hiç yüklemez:

| Sayfa (dosya) | Adres |
|---|---|
| `public/kvkk/kvkk.html` | `/kvkk/kvkk.html` — aydınlatma metni |
| `public/kosullar/kosullar.html` | `/kosullar/kosullar.html` — kullanım koşulları |
| `public/indir/indir.html` | `/indir/indir.html` — indirme sayfası (ayrıca [indir.md](indir.md)) |
| `public/404.html` | bilinmeyen her adres — "Sayfa bulunamadı" |
| `public/okul-bulunamadi.html` | `/school/<kısa ad>` ama böyle bir okul yok — "Okul bulunamadı" |

Bu sayfaların üst şeridi açılış sayfasınınkiyle aynıdır (Giriş, Kayıt ol, İndir, ay/güneş, Hakkında, SSS, Yapımcılar).
Açılış sayfasında bu düğmeleri uygulama paketi çalıştırır ([parcalar/05a-dis-sayfalar.md](parcalar/05a-dis-sayfalar.md),
[parcalar/25-tiklama.md](parcalar/25-tiklama.md)); düz sayfalarda o paket yok. Düğmeler ölü kalmasın diye bu dosya aynı
davranışı küçük bir betikle kurar.

Neden ayrı bir dosya da sayfanın içine yazılmamış? Sunucunun İçerik Güvenlik Politikası (CSP, `script-src 'self'`) satır
içi `<script>`'e izin vermiyor; betik mutlaka sitenin kendi adresinden bir dosya olarak gelmeli
([../../sunucu/http.md](../../sunucu/http.md), `GUVENLIK_BASLIKLARI`). Bu kural sayfaya enjekte edilen bir betiğin
çalışmasını engeller; bedeli de bu tür küçük dosyalardır.

Dosya ES5 yazılmıştır (`var`, `function`), tek bir kendini çağıran işlevin (IIFE) içindedir ve dışarıya hiçbir ad
açmaz. Uygulama parçaları gibi birleştirilmez; tarayıcıya `/js/belge.js` olarak olduğu gibi gider.

## İçinde neler var?

Dosyada dışa açılan bir şey yok; hepsi IIFE'nin içindeki yerel adlardır.

- `esc(s)` — HTML kaçışı: `& < > " '` → `&amp; &lt; &gt; &quot; &#39;`. Uygulamadaki `esc`'in kopyası (burada uygulama
  paketi olmadığı için).
- `dugme`, `liste` — `#btnYapimcilar` (Yapımcılar düğmesi) ve `#yapimciListe` (başta `hidden` açılır kutu).
- `acKapa(ac)` — listeyi açar/kapatır: `liste.hidden = !ac`, düğmenin `aria-expanded`'ı `'true'`/`'false'`.
- Yapımcılar olayları (ikisi de varsa kurulur):
  - düğmeye tıklama → aç/kapa (`acKapa(liste.hidden)`);
  - sayfanın başka bir yerine tıklama → liste açıksa ve tıklanan yer `.yapimci-kutu`'nun içinde değilse kapanır.
    `closest` olmayan çok eski tarayıcıda bu denetim her tıklamayı "dışarı" sayar; düğmenin kendi tıklaması da belgeye
    kadar kabardığı için liste açıldığı anda yeniden kapanır, yani orada liste hiç açılamaz (bugünkü tarayıcıların
    hepsinde `closest` var);
  - `Escape` → liste açıksa kapanır ve odak düğmeye döner (klavyeyle gezen kaybolmasın).
- Tema düğmesi — sayfadaki ilk `[data-act="tema-degis"]` (şeritteki `.site-tema`). Tıklanınca şu an görünen tema
  hesaplanır: `<html data-tema>` `koyu` ise ya da etiket yoksa ve işletim sistemi koyu tercih ediyorsa (`matchMedia
  ('(prefers-color-scheme: dark)')`) "koyu görünüyor" sayılır; `window.temaAyarla` ile tersi seçilir (`'acik'` ya da
  `'koyu'`). `temaAyarla` [tema.md](tema.md)'deki `public/js/tema.js`'tendir; yoksa (o dosya yüklenmediyse) düğme bir şey
  yapmaz. Yani "Sistem" seçiliyken basınca seçim açığa ya da koyuya sabitlenir — uygulamadaki `tema-degis` ile aynı kural.
- "Okul bulunamadı" yazısı — sayfada `#okulYok` varsa ve adres `/school/<ad>` (sonda `/` olabilir, büyük/küçük harf fark
  etmez) biçimindeyse: `<ad>` `decodeURIComponent` ile çözülür (çözülemezse olduğu gibi kalır), ilk 60 karakteri alınır ve
  paragrafa **metin olarak** (`textContent`) yazılır: `"ornek-okul" adresinde bir okul yok.` Öğe yoksa ya da adres
  uymazsa sayfadaki hazır yazı ("Bu adreste bir okul yok.") kalır. `#okulYok` yalnız `public/okul-bulunamadi.html`'de var.
- Yapımcı listesi — sayfadaki bütün `[data-yapimcilar]` öğeleri (açılır listedeki `ul.yapimci-satirlar`). Hiç yoksa ya da
  tarayıcıda `fetch` yoksa burada durulur. Varsa `GET /api/site` (`credentials: 'omit'`: çerez gitmez; oturum anahtarı da
  gönderilmez). Cevap başarılı (2xx) değilse, JSON bozuksa, ağ hatası olursa ya da `yapimcilar` boş bir diziyse **hiçbir şey
  değişmez**: HTML'deki hazır satır (proje sahibinin GitHub bağlantısı) kalır. Liste doluysa her yapımcı için:
  - `github` varsa `<li><a href="https://github.com/<encodeURIComponent(github)>" target="_blank" rel="noopener">` + düğmedeki
    GitHub simgesinin kopyası (`#btnYapimcilar .gh`'nin `outerHTML`'i; bulunamazsa simgesiz) + `<span class="yapimci-ad">`;
  - yoksa `<li><div class="yapimci-satir"><span class="yapimci-ad">…`;
  - `yapimci-ad`'ın içinde `<span>ad</span>` ve `katki` varsa `<small>katkı</small>` — ikisi de `esc`'li.
  Üretilen HTML bütün `[data-yapimcilar]` öğelerine aynen yazılır.

Sunucudan beklenen cevap ([../../sunucu/site.md](../../sunucu/site.md)):
`{ sayilar, iletisim: { eposta, telefon }, yapimcilar: [{ ad, github, katki }], bildirimAralikDk, cevrimiciDk }`. Bu dosya
yalnız `yapimcilar`'ı kullanır; `sayilar` ve `iletisim`'e bakmaz.

## Kimle konuşur?

- Onu yükleyen sayfalar (hepsi `<head>`'de `<script src="/js/belge.js" defer>`; önce eş zamanlı `/js/tema.js` gelir):
  `public/kvkk/kvkk.html`, `public/kosullar/kosullar.html`, `public/indir/indir.html` (orada ardından `/js/indir.js` da
  `defer` ile gelir; `defer` sırası korunduğu için önce bu dosya çalışır), `public/404.html`, `public/okul-bulunamadi.html`.
  `public/index.html` bu dosyayı yüklemez.
- Sayfalarda dayandığı öğeler: `.yapimci-kutu` > `button#btnYapimcilar[data-act="yapimcilar"]` (içinde `svg.gh`) +
  `div#yapimciListe[hidden]` > `ul.yapimci-satirlar[data-yapimcilar]` (listenin altındaki "Projenin GitHub sayfası"
  bağlantısına dokunmaz); `button.site-tema.tema-dugme[data-act="tema-degis"]`; `p#okulYok`. `data-act` öznitelikleri
  burada yalnız seçici olarak kullanılır; düz sayfalarda uygulamanın `EYLEMLER` tablosu yoktur.
- Çağırdığı: `window.temaAyarla` — [tema.md](tema.md).
- Sunucu: `GET /api/site` — `sunucu/site.js` ([../../sunucu/site.md](../../sunucu/site.md)), girişsiz açık uç. Yapımcı
  listesi yöneticinin "Site ayarları"nda kaydettiği listedir; kaydedilmemişse depodaki `yapimcilar.json`
  ([../../sunucu/bolumler/site-ayarlari.md](../../sunucu/bolumler/site-ayarlari.md), yönetim ekranı
  [yonetim/09b-site-ayarlari.md](yonetim/09b-site-ayarlari.md)). Sunucu GitHub adını `GITHUB_ADI` kalıbıyla (harf, rakam,
  tire) süzer; ad en çok 60, katkı en çok 80 karakter, en çok 50 yapımcı.
- "Okul bulunamadı" sayfasını kimin verdiği: `sunucu/http.js` `serveStatic` — `/school/<kısa ad>` biçimine uyan ama
  veritabanında onaylı okulu olmayan adrese `okul-bulunamadi.html`'i 404 ile gönderir (sonuç 30 sn bellekte; `okulVarMi`).
  Kısa ad biçimine hiç uymayan adres (ör. Türkçe harfli) `404.html`'e düşer; orada `#okulYok` olmadığı için bu dosyanın o
  parçası çalışmaz ([../../sunucu/http.md](../../sunucu/http.md)).
- Aynı işin uygulamadaki karşılığı: [parcalar/05a-dis-sayfalar.md](parcalar/05a-dis-sayfalar.md) — `yapimcilariCiz`,
  `yapimcilarAcKapa`, `EYLEMLER['yapimcilar']`, dış tıklama ve `Escape`; [parcalar/25-tiklama.md](parcalar/25-tiklama.md) —
  `tema-degis` (orada girişliyse hesaba da yazılır).
- CSS: `public/css/parcalar/29-dis-sayfalar.css` (`.site-ust`, `.site-menu`, `.site-yapimci` — `aria-expanded="true"` iken
  vurgulu —, `.yapimci-kutu`, `.yapimci-liste`, `.yapimci-satirlar`, `.yapimci-satir`, `.yapimci-ad`, `.yapimci-depo`,
  `.site-tema`, `.site-alt`); `public/css/parcalar/12-ikonlar.css` (`.tema-dugme`'de ay/güneş simgesinin hangisinin
  görüneceği — betik beklemeden `html[data-tema]` ve işletim sistemi tercihine göre); sayfaların kendi `<style>` blokları
  (`.belge`, `.bulunamadi`, indirme sayfasının tablosu). Satır içi stil CSP'de serbest (`style-src 'unsafe-inline'`).
- Rol: herkes; giriş yapmamış ziyaretçi dahil. Bu sayfalarda oturum hiç kullanılmaz.

## Nasıl çalışır (adım adım)?

```
tarayıcı /kvkk/kvkk.html'i ister
  sunucu HTML'i verir (htmlSurumle: /js/tema.js?v=…, /css/style.css?v=…; belge.js sürümsüz)
  <head>: tema.js eş zamanlı çalışır ─► <html data-tema=…> (beyaz yanıp sönme yok)
  sayfa ayrıştırıldı ─► belge.js (defer)
     1. #btnYapimcilar + #yapimciListe ─► tıklama / dış tıklama / Esc dinleyicileri
     2. [data-act="tema-degis"] ─► tıklayınca temaAyarla(görünenin tersi)
     3. #okulYok ve adres /school/<ad> ─► '"<ad>" adresinde bir okul yok.'
     4. [data-yapimcilar] varsa ─► GET /api/site
           yapimcilar dolu ─► her [data-yapimcilar] yeniden çizilir
           boş / hata     ─► hazır satır kalır
```

Kişinin gözünden: aydınlatma metnini okurken sağ üstte "Yapımcılar"a basar, liste açılır (her satır GitHub profiline
yeni sekmede gider); sayfanın boş bir yerine basınca ya da `Esc` ile kapanır. Ay simgesine basınca sayfa koyulaşır,
seçim bu tarayıcıda kalır; sonra açtığı her sayfa (uygulama dahil) koyu açılır.

## Dikkat!

- **İletişim satırı bu sayfalarda boş kalıyor.** Beş sayfanın da alt bilgisinde `<span class="site-iletisim"
  id="sIletisim"></span>` var; açılış sayfasında onu uygulama paketi `/api/site`'taki `iletisim`'le doldurur
  (`iletisimleriDoldur`, [parcalar/05a-dis-sayfalar.md](parcalar/05a-dis-sayfalar.md)). Bu dosya aynı cevabı alıyor ama
  `iletisim`'i kullanmıyor: aydınlatma metni, koşullar, indirme ve "bulunamadı" sayfalarının altında yöneticinin
  e-postası/telefonu hiç görünmez. Kod değiştirilmedi; düzeltme bu dosyaya `iletisimleriDoldur`'un küçük bir kopyasını
  koymak olur (e-posta yine HTML'e yazılmadan, metin olarak). Dikkat: uygulamada e-posta bağlantısı `href` taşımaz,
  `data-act="site-eposta"` ile tıklanınca `mailto:` açılır (`EYLEMLER['site-eposta']`); kopyada bu tıklamanın da burada
  kurulması gerekir, yoksa e-posta görünür ama tıklanmaz.
- **Tema seçimi burada hesaba yazılmaz.** Düz sayfalarda oturum yok; ay/güneş yalnız tarayıcıya (`localStorage`) yazar.
  Kişi sonra giriş yapınca hesabında `sistem` dışında bir tema kayıtlıysa hesaptaki kazanır
  ([parcalar/26-baslat.md](parcalar/26-baslat.md), `uygulamayiBaslat`). Yani aydınlatma metninde koyuya geçen kişi,
  hesabı "Açık" ise girişte yeniden açık görür.
- **İki kopya, birlikte değiştir.** Yapımcı listesinin HTML'i hem burada hem
  [parcalar/05a-dis-sayfalar.md](parcalar/05a-dis-sayfalar.md)'deki `yapimcilariCiz`'de üretilir; açılır listenin
  aç/kapa, dış tıklama ve `Esc` davranışı da iki yerde yazılı. Birini değiştirirsen öbürünü de değiştir, yoksa açılış
  sayfasıyla düz sayfalar farklı görünür. Küçük farklar bugün de var: burada GitHub adı `encodeURIComponent`'ten geçiyor,
  orada `esc`'ten; burada `.gh` simgesi bulunamazsa simgesiz satır çizilir, orada bulunamazsa hata atılır. İkisi de
  güvenli, çünkü sunucu GitHub adını zaten harf/rakam/tireyle sınırlıyor.
- **Okul adı metin olarak yazılır.** `textContent` kullanıldığı için adrese HTML ya da betik yazan biri sayfaya bir şey
  sokamaz. `decodeURIComponent` bozuk `%` dizisinde hata atar; yakalanır, ad olduğu gibi gösterilir.
- **Hata sessiz.** `/api/site` gelmezse kişi bir şey görmez, yalnız hazır satır kalır; konsola da yazılmaz.
- **Dosyadaki yorumlar biraz eski.** Baştaki yorum yalnız "aydınlatma metni, kullanım koşulları" der; bugün indirme ve
  iki "bulunamadı" sayfası da bu dosyayı yükler. Yapımcı listesinin "sunucudaki yapimcilar.json'dan" geldiği yazıyor;
  `commit 521`'den beri öncelik yöneticinin panelde kaydettiği listededir, `yapimcilar.json` yalnız kaydedilmemişse
  kullanılır.
- **Sürümsüz adres.** Sunucu yalnız `/js/tema.js`, `/js/app.js` ve `/css/style.css`'e `?v=<ETag>` ekler; bu dosya
  `Cache-Control: no-cache` ile gelir, tarayıcı her açılışta sorar (değişmediyse 304). Değişikliğin ziyaretçiye hemen
  gitmesi için bir şey yapman gerekmez.
- Bu `.md` dosyası `public/` altında dursa da sunucu `.md` dosyalarını hiç sunmaz (`/js/belge.md` bilinmeyen adresle aynı
  404); belge yalnız depoda okunur.

## Testleri

- Bu dosyayı tarayıcıda çalıştıran bir test yok (yazım denetimi `testler/yazim-denetimi.js` ve düğme denetimi
  `testler/buton-denetimi.js` de bu dosyayı ve düz sayfaları taramaz).
- `testler/test-adresler.js` — kvkk, koşullar, indirme, "Sayfa bulunamadı" ve "Okul bulunamadı" sayfaları açılıyor; bu
  sayfaların `/css` ve `/js` varlıklarının (bu dosya dahil) hepsi 200 dönüyor; üst şerit ve alt bilgi asıl adreslere
  bağlanıyor; varlıklar mutlak yolla yazılmış (klasör altındaki sayfada da yüklenir).
- `testler/test-etut.js` — `/api/site` girişsiz açık ve yalnız `sayilar`, `iletisim`, `yapimcilar` ve iki aralık dönüyor;
  her yapımcıda yalnız `ad`, `github`, `katki`; olmayan okul 404 ve "Okul bulunamadı" + "Ana sayfaya dön".
- `testler/test-site-ayarlari.js` — yöneticinin kaydettiği yapımcı listesi sırasıyla `/api/site`'ta; bozuk GitHub adı,
  boş ad, 60/80 karakter ve 50 kişi sınırı reddediliyor; sıfırlayınca `yapimcilar.json`'a dönülüyor; `/api/site`
  tarayıcıda saklanmıyor (`no-store`), yani yeni liste sayfa yenilenince görünür.
- `testler/test-admin-gizli.js` — `/js/belge.md` (bu belge) bilinmeyen adresle bayt bayt aynı 404.
- Elle: `http://localhost:3200/kvkk/kvkk.html` aç → "Yapımcılar"a bas, liste açılsın; boş yere bas ya da `Esc`, kapansın
  (odak düğmede). Ay simgesine bas, sayfa koyulaşsın; yenile, koyu kalsın. `http://localhost:3200/school/boyle-bir-okul-yok`
  → `"boyle-bir-okul-yok" adresinde bir okul yok.` yazmalı.

## Son durum

- `git log`: 4 commit. Son değişiklik `115a906 commit 515` (2026-09-26): "Okul bulunamadı" sayfası için adresteki okul
  adını `#okulYok`'a yazan parça eklendi; aynı commit `public/okul-bulunamadi.html`'i ve `sunucu/http.js`'teki okul
  denetimini (olmayan okula 404) getirdi.
- Ondan önce `fa9a072 commit 510` (2026-09-26): `/api/site` cevabındaki `android` bağlantısıyla şeritteki `#sUygulama`'nın
  adresini değiştiren iki satır silindi; o commit indirme sayfasını (`/indir`) ve sunucunun GitHub sürüm listesini getirdi,
  "İndir" artık hep o sayfaya gidiyor. `f9a3978 commit 505` (2026-09-26) o iki satırı eklemişti. Dosyanın ilk hâli
  `2917a72 commit 452` (2026-09-26): `esc`, yapımcılar açılır listesi, tema düğmesi, yapımcı listesinin `/api/site`'tan
  çizilmesi.
- Bilinen açıklar (kod değiştirilmedi): alt bilgideki iletişim satırının boş kalması; eski yorumlar.
- Planlı işlerden bu dosyaya dokunması beklenenler: "Sistem" işindeki site geneli duyuru şeridi kvkk, koşullar ve
  indirme sayfalarının üstünde de görünecek (tanım; duyuru `/api/site` cevabında da gelecek) — bu sayfalarda uygulama
  paketi olmadığı için şeridi çizecek yer bu dosya ya da benzeri olur. "Çok dil" işinde 404, indirme ve "Okul bulunamadı"
  sayfalarının arayüz metni seçili dile göre olacak (buradaki `adresinde bir okul yok` cümlesi dahil); hukuki metinler
  (KVKK, koşullar) şimdilik Türkçe kalacak. "Üst şerit sadeleştirme" işinde açılış şeridindeki Hakkında, SSS ve
  Yapımcılar dar ekranda bir "⋯" menüsüne toplanacak; düz sayfalar aynı şeridi taşıdığı için buradaki açılır liste kodu da
  o işte elden geçmeli.
