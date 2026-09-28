# sunucu/yardimci/css-temizle.js

Okul sayfasının kısıtlı CSS'i için güvenlik kapısı: kişinin yazdığı CSS'i kurallara ayırır, yalnız izin verilen seçici, özellik
ve değerleri geçirir, her kuralı `.okul-sayfa` içine bağlar ve atılan her şeyin nedenini Türkçe söyler.

## Bu dosya ne yapar?

Okulun "Kodlayıcı" yetkilisi (ya da müdür) okulun herkese açık giriş sayfasının görünümünü CSS ile ayarlayabilir. Serbest CSS
tehlikelidir:

- **dışarıya istek attırabilir** — `url(...)`, `@import`, `image-set(...)`: ziyaretçinin IP'si başka bir sunucuya gider;
- **giriş kartını örtebilir** — `position`, `z-index`, `transform`: sahte bir giriş formu gerçeğinin üstüne konabilir (şifre
  avcılığı);
- **sahte yazı gösterebilir** — `content`: "Şifreni buraya yaz" gibi;
- **eski tarayıcılarda kod çalıştırabilir** — `expression(...)`, `behavior`, `-moz-binding`, `javascript:`;
- **`<style>`'dan kaçabilir** — `</style><script>` ya da ters bölü kaçışlarıyla gizlenmiş yasak kelimeler.

Bu dosya "kara liste" değil "BEYAZ liste" çalışır: tanımadığı her şeyi atar. Kaydedilen ham metin olduğu gibi saklanır (kişi
düzenlemeye devam edebilsin), ama sayfaya ve dışarıya HER ZAMAN yalnız bu dosyadan geçmiş hâli gider.

## İçinde neler var?

### Dışa açık

- **`cssTemizle(css)`** → `{ css, uyarilar }`.
  - `css`: temizlenmiş kurallar, her biri tek satır: `.okul-sayfa <seçici> { özellik: değer; özellik: değer; }`. Hiç kural
    geçmezse `''`.
  - `uyarilar`: atılan her parça için kısa Türkçe açıklama (en çok 30 tane). Örnek:
    `".os-kutu { position }: kullanılamaz, sayfanın dışına, giriş kartının üstüne taşınabilir."`
  - Girdi dize değilse `String(css || '')`; hiç hata atmaz.
- **`SAYFA_PARCALARI`** — seçilebilen sayfa parçaları: `os-kutu`, `os-kapak`, `os-ust`, `os-logo`, `os-baslik`, `os-yer`,
  `os-tanitim`, `os-galeri`, `os-foto`. (Bugün dışarıda kullanan yok; ön yüzde aynı liste `OKUL_SAYFA_PARCALARI` adıyla ayrıca
  yazılı.)

### Sınırlar

- `EN_UZUN` 8000 karakter — fazlası kesilir (uyarıyla). Kaydetme ucu 8000'den uzun CSS'i zaten 400 ile reddeder.
- `EN_FAZLA_KURAL` 200 — fazlası atılır (uyarıyla).
- `EN_FAZLA_UYARI` 30.
- Tek değer en çok 200 karakter.

### İzin verilen SEÇİCİLER (tam liste)

- Yalnız sayfa parçalarının sınıfları: `.os-kutu`, `.os-kapak`, `.os-ust`, `.os-logo`, `.os-baslik`, `.os-yer`, `.os-tanitim`,
  `.os-galeri`, `.os-foto`.
- Her birinin arkasında sıfır ya da daha çok: `:hover`, `:first-child`, `:last-child`, `:nth-child(...)` — parantez içinde
  `odd`, `even`, 1–2 haneli sayı ya da `an+b` biçimi (`2n`, `2n+1`, `n+3`; `a` ve `b` en çok 2 hane, eksi yok).
- Birleştirme: boşluk (torun) ya da `>` (çocuk). Virgülle birden çok seçici.
- GEÇMEYENLER: etiket adı (`body`, `div`, `a`…), `#kimlik`, `[öznitelik]`, `*`, `::before`/`::after`, `+`/`~` kardeş birleşimi,
  `:not()`, `:focus` ve öteki sözde sınıflar, sayfanın kutusu `.okul-sayfa`'nın kendisi ve uygulamanın başka sınıfları
  (`.auth-card` gibi). Virgülle ayrılmış seçicilerden BİRİ geçmezse bütün kural atılır.
- Çıktıda her seçicinin başına `.okul-sayfa ` eklenir, `>` çevresindeki boşluk tek biçime getirilir, seçici küçük harfe
  çevrilir.

### İzin verilen ÖZELLİKLER ve DEĞERLER (tam liste)

Değerler karşılaştırmadan önce küçük harfe çevrilir, fazla boşluk teke iner, sondaki `!important` atılır.

Ortak değer türleri:

- **renk**: `#rgb`, `#rgba`, `#rrggbb`, `#rrggbbaa`; `rgb()`/`rgba()` (sayılar ya da yüzdeler, virgülle; saydamlık 0–1 ya da %);
  `hsl()`/`hsla()` (ton isteğe bağlı `deg`, doygunluk ve açıklık %); adlı renkler: `transparent`, `currentcolor`, `white`,
  `black`, `red`, `green`, `blue`, `yellow`, `orange`, `purple`, `pink`, `brown`, `gray`, `grey`, `navy`, `teal`, `maroon`,
  `olive`, `silver`, `gold`, `crimson`, `tomato`, `coral`, `salmon`, `turquoise`, `indigo`, `violet`, `beige`, `ivory`,
  `khaki`, `lavender`, `darkred`, `darkgreen`, `darkblue`, `lightgray`, `lightgrey`, `whitesmoke`.
- **uzunluk**: `0` ya da `px`, `rem`, `em`, `%` birimli sayı (en çok 4 hane + 3 ondalık). Sınırlar px cinsinden, `1rem = 1em
  = 16px` sayılır. `%` yalnız izin verilen yerlerde, 0–100. `calc()`, `vw`, `vh` vb. geçmez.

| Özellik | İzin verilen |
|---|---|
| `color`, `background-color`, `border-color` | renk |
| `background` | renk ya da geçiş |
| `background-image` | geçiş: `linear-gradient(` isteğe bağlı yön (`to top/bottom/left/right` [+ ikinci yön] ya da `-999..999deg`), 2–5 renk durağı; durakta renk + isteğe bağlı `0` ya da `%` konum `)` |
| `opacity` | `0`, `1`, `0.xxx` |
| `font-size` | 8–72 px |
| `font-weight` | `normal`, `bold`, `bolder`, `lighter`, `100`…`900` |
| `font-style` | `normal`, `italic` |
| `font-family` | en çok 3 aile, virgülle: `sans-serif`, `serif`, `monospace`, `system-ui`, `cursive`, `"ibm plex sans"` (tek ya da çift tırnaklı), `newsreader`, `georgia`, `arial`, `verdana`, `tahoma` |
| `line-height` | çarpan `0`–`3` (en çok 2 ondalık) ya da 8–96 px |
| `letter-spacing` | -2–12 px |
| `text-align` | `left`, `right`, `center`, `justify`, `start`, `end` |
| `text-transform` | `none`, `uppercase`, `lowercase`, `capitalize` |
| `text-decoration` | `none`, `underline`, `line-through` |
| `text-shadow` | `none` ya da en çok 2 gölge: `x y [bulanıklık] renk` (x, y -50–50 px; bulanıklık 0–100 px) |
| `padding`, `margin` | 1–4 değer, her biri 0–120 px, % ya da `auto` (eksi YOK) |
| `padding-*`, `margin-*` (top/right/bottom/left) | tek değer 0–120 px ya da % |
| `border`, `border-top/right/bottom/left` | `none`, `0` ya da en çok birer tane: kalınlık 0–20 px, tür, renk |
| `border-width` | 0–20 px |
| `border-style` | `solid`, `dashed`, `dotted`, `double`, `none` |
| `border-radius` | 1–4 değer, 0–200 px ya da %, `auto` |
| `box-shadow` | `none` ya da en çok 2 gölge: `[inset] x y [bulanıklık [yayılma]] renk` (x, y -50–50; bulanıklık 0–100; yayılma 0–50 px) |
| `width`, `min-width`, `max-width` | 0–1200 px ya da % |
| `height`, `min-height`, `max-height` | 0–800 px (% yok) |
| `aspect-ratio` | `auto` ya da `16/9` biçimi (1–2 haneli) |
| `display` | `block`, `inline`, `inline-block`, `flex`, `inline-flex`, `grid`, `none` |
| `flex-direction` | `row`, `column`, `row-reverse`, `column-reverse` |
| `flex-wrap` | `wrap`, `nowrap` |
| `flex` | `none`, `auto`, 1–2 haneli bir ya da iki sayı |
| `justify-content` | `flex-start`, `flex-end`, `center`, `space-between`, `space-around`, `space-evenly`, `start`, `end` |
| `align-items` | `stretch`, `flex-start`, `flex-end`, `center`, `baseline`, `start`, `end` |
| `gap` | 1–4 değer, her biri 0–80 px ya da `auto` (% yok) |
| `row-gap`, `column-gap` | 0–80 px |
| `grid-template-columns` | `repeat(1–6, 1fr)`, `repeat(auto-fill|auto-fit, minmax(NNpx|NNNpx, 1fr))`, ya da 1–6 tane `1fr`–`4fr` |
| `object-fit` | `cover`, `contain`, `fill`, `none`, `scale-down` |
| `object-position` | `center`, `top`, `bottom`, `left`, `right` (bir ya da iki) |

Listede olmayan HER özellik atılır. Bazıları için kişiye özel neden söylenir (`YASAK_NEDEN`): `position`, `z-index`,
`transform` ("sayfanın dışına, giriş kartının üstüne taşınabilir"), `content` ("sayfaya yazı ekler; yazıyı Tanıtım kutusuna
yaz"), `behavior`, `-moz-binding` ("kod çalıştırabilir"). Ötekiler için "bu özellik kullanılamaz."

### Her durumda atılanlar

- Değerde `url(`, `expression`, `javascript:`, `image-set`, `attr(`, `var(`, `env(` geçen bildirim ("dış adres, değişken ve işlev
  kullanılamaz; fotoğrafı Fotoğraflar bölümünden ekle").
- Ters bölü `\` ya da `<` içeren KURAL BÜTÜNÜYLE (seçici ya da gövde). Bunun için metin başına tek genel uyarı verilir, kural
  başına ayrı uyarı yoktur.
- Bütün `@` kuralları: bloksuz olanlar (`@import …;`, `@charset …;`) noktalı virgüle kadar, bloklu olanlar (`@media`,
  `@font-face`, `@keyframes`, `@supports`…) blok sonuna kadar.
- İç içe süslü parantezli gövde ("iç içe kural yazılamaz").
- Yorumlar (`/* … */`, kapanmamışı sonuna kadar) en başta silinir.
- Süslü parantezi olmayan artık metin, kapanmayan son kural.
- `:` içermeyen bildirim ("anlaşılamadı"), boş ya da 200 karakterden uzun değer.

## Kimle konuşur?

- Çağırdığı: hiçbir modül.
- Onu çağıran: [../bolumler/okul-sayfasi.md](../bolumler/okul-sayfasi.md):
  - herkese açık okul sayfası görünümü (`okulSayfasiGorunumu`) — dışarıya YALNIZ `cssTemizle(s.css).css` gider;
  - düzenleme ekranının okuması (`GET /api/okul-sayfa`) — ham `css` + `temizCss` + `uyarilar`;
  - önizleme (`POST /api/okul-sayfa/onizle`) — kaydetmeden `cssTemizle` sonucu;
  - kaydetme (`POST /api/okul-sayfa`) — 8000 karakter üstü 400; ham CSS (satır sonları `\n`'e çevrilmiş) kaydedilir, cevapta
    temizlenmiş hâli ve uyarılar döner.
- Ön yüzde `public/js/parcalar/19g-okul-sayfasi.js` temizlenmiş CSS'i bir `<style>` öğesine `textContent` ile koyar (HTML olarak
  okunmaz); `public/css/parcalar/31-okul-sayfasi.css` `.okul-sayfa` kutusuna `contain: layout paint` verir, içindeki hiçbir şey kutunun
  dışına çizilemez.
- Tablo: `okul_sayfalari` satırındaki `css` sütunu (`sunucu/veri/sema/018-okul-sayfasi.sql`; ham metin, veritabanında
  da `length(css) <= 8000` denetimi var); bu dosya tabloya dokunmaz.

## Nasıl çalışır (adım adım)?

```
cssTemizle(ham)
  1. 8000'e kes, yorumları sil, "\" ya da "<" varsa genel uyarı
  2. döngü (en çok 200 kural):
       boşlukları atla
       "@" ile başlıyor ve ";" "{"den önce → @ kuralı, ";"e kadar atla
       "{" yok → artık metin, uyar, bitir
       eşleşen "}"yi bul (iç içe sayarak); yoksa uyar, bitir
       seçicide "@"         → uyar, atla
       "\" ya da "<" var    → sessizce atla (genel uyarı verildi)
       gövdede "{"          → uyar, atla
       seciciTemizle        → geçmezse uyar (ilk seferde izinli parça listesiyle), atla
       gövdeyi ";" ile böl, her bildirim:
           özellik listede mi → değerde yasak işlev var mı → değer denetçisi geçiyor mu
           geçerse "özellik: değer" olarak ekle
       en az bir bildirim kaldıysa ".okul-sayfa <seçici> { …; }" satırı
  3. { css: satırlar, uyarilar }
```

Örnek:

```
girdi : .os-baslik:hover > .os-foto:nth-child(2n+1) { color: RED !important; margin: -5px }
        @import url(x);
        body { color: red }
çıktı : .okul-sayfa .os-baslik:hover > .os-foto:nth-child(2n+1) { color: red; }
uyarı : … { margin: -5px }: değer kabul edilmedi …
        "@import url(x)": @ kuralları … kullanılamaz.
        "body": bu seçici kullanılamaz. Yalnızca sayfanın parçaları seçilebilir: .os-kutu, …
```

## Dikkat!

- Temizlik HER OKUMADA yeniden yapılır (ham metin saklanır). Bu dosyada bir kural gevşetilirse ya da sıkılaştırılırsa bütün okulların
  sayfası hemen etkilenir; eski kayıtlarda "önceden temizlenmiş" bir şey yoktur.
- Ön yüzdeki `OKUL_SAYFA_PARCALARI` listesi ile buradaki `SAYFA_PARCALARI` elle eş tutulmalı; biri değişip öteki değişmezse
  düzenleme ekranı yanlış parça önerir.
- `display: none` izinli: yetkili kendi sayfasının parçalarını gizleyebilir (giriş kartı `.okul-sayfa` dışında olduğu için
  gizlenemez).
- Eksi `margin` izinli DEĞİL (sayfanın dışına taşmayı önlemek için); gölge kaydırması -50–50 px arasıdır ve `contain: paint`
  onu da kutuda keser.
- `padding` ve `margin` çok değerli yazımda `auto` kabul edilir (`padding: auto` CSS'te geçersizdir; tarayıcı yok sayar,
  zararı yok).
- `line-height` çarpanı `0`–`2.99` ve tam `3` kabul edilir; `3.5` geçmez.
- Değer denetçileri düzenli ifadelere dayanır; yeni bir özellik eklerken değer denetçisini de yaz (denetçisiz özellik
  eklenemez: `OZELLIKLER`'de işlev olmalı).

## Testleri

- `testler/test-okul-sayfasi.js` (sunucu ister) — izinli kuralların kalması ve `.okul-sayfa` içine bağlanması; `url`, `@import`,
  `position`, `z-index`, `transform`, `content` olmaması; başka seçici ve `body` olmaması; eksi boşluk ve ters bölünün atılması;
  her kuralın `.okul-sayfa ` ile başlaması; en az 6 uyarı; 8000 karakter üstünün 400 ile reddi; önizlemenin kaydetmeden
  temizlemesi; herkese açık sayfaya yalnız temizlenmiş CSS'in gitmesi.
- Sunucusuz birim testi yok.
- Elle: `node -e "console.log(require('./sunucu/yardimci/css-temizle').cssTemizle('.os-kutu{position:absolute;color:red}'))"`.

## Son durum

- Dosya parça parça geldi: `44c2bb6 commit 388` (2026-09-26) seçici ve değer denetçileri; `ed9c5b0 commit 389` `YASAK_NEDEN`,
  `kisalt` ve dışa açılış (okul sayfası bölümüyle); `f2330da commit 430` `cssTemizle` ayrıştırıcısını ekledi. Sonra değişmedi.
- Açık: sunucusuz birim testi yok; seçici ve değer denetçilerinin sınırları yalnız uçtan uca testte ve kısmen deneniyor.
- Sıradaki işlerden "Düzenleyiciler" 6. madde "okul sayfası blokları" okul sayfasına blok düzeni getirecek; yeni blokların sınıfları
  `SAYFA_PARCALARI`'na (ve ön yüzdeki kopyasına) eklenmeli. "Paneller" işindeki `/duzenle` okul sayfaları da bu süzgeçten geçen
  CSS'i gösterecek.
