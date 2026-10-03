# public/css/parcalar/CSS.md

Eğitim Evi'nin bütün görünümünü taşıyan 38 CSS parçasının (`00-temel.css` … `36-ayar-kartlari.css`) tek belgesi: hangi
sırayla birleşip `/css/style.css` oldukları, renk değişkenleri ve koyu tema, her parçanın neyi biçimlendirdiği ve kimin
çizdiği, ortak kalıplar, telefon kırılma noktaları ve bilinen tuzaklar.

## Bu dosya ne yapar?

Bu klasörde JavaScript yok: 38 `.css` dosyası ve bu belge var. Bu belge klasörün belgesidir; öteki klasörlerdeki
`KLASOR.md`'nin buradaki karşılığı (şema klasöründeki [SEMA.md](../../../sunucu/veri/sema/SEMA.md) gibi).

Eğitim Evi'nde derleyici yok: Sass, PostCSS ya da paketleyici kullanılmıyor. Stiller konularına göre küçük dosyalara
bölünmüş durur, ama tarayıcıya tek dosya gider. Sunucu (`sunucu/http.js`'teki `birlesikOku`,
[../../../sunucu/http.md](../../../sunucu/http.md)) bu klasördeki `.css` ile biten dosyaları **dosya adı sırasıyla** uç uca
ekler, yorumlarını atar, gzip ve brotli ile bir kez sıkıştırıp bellekte tutar ve `/css/style.css` adresinden verir. Parçalar
tek tek web'den okunamaz (`/css/parcalar/...` her zaman 404); bu belge de pakete girmez, çünkü birleştirici yalnız `.css`
okur ve `.md` adresleri de 404 döner.

Sıra önemlidir. CSS'te aynı özgüllükteki iki kuraldan sonra geleni kazanır; dosya adlarının başındaki numara (`00-`,
`01-` … `36-`) bu yüzden var. Değişkenler ilk dosyada tanımlanır, sonraki dosyalar onları kullanır; dokunmatik ekran ve
dar ekran düzeltmeleri gibi "ezen" kurallar ezdikleri kurallardan sonra gelmelidir.

Renklerin tek kaynağı `00-temel.css`'teki değişkenlerdir (`--ana`, `--zemin`, `--yazi`…). Koyu tema yeni kurallar yazarak
değil, bu değişkenlerin değerini değiştirerek çalışır; öteki dosyalar renkleri `var(--...)` ile alır (birkaç istisna
"Dikkat!"te).

Kim kullanır: uygulamanın tek sayfası `public/index.html` (girişsiz sayfalar, giriş kartı ve giriş yapılmış uygulama aynı
sayfada), yöneticinin gizli kabuğu (sunucu `index.html`'i alıp yalnız `/js/app.js`'i `/admin/yonetim.js` ile değiştirir;
stil aynıdır) ve beş ayrı sayfa: `public/404.html`, `public/okul-bulunamadi.html`, `public/kvkk/kvkk.html`,
`public/kosullar/kosullar.html`, `public/indir/indir.html` (bu beşinin kendi `<style>` blokları da var).

Bugünkü boyutlar (sunucu açılmadan, sunucunun yorum atıcısı ve sıkıştırma ayarlarıyla hesaplandı): 38 dosya, 4 525 satır;
birleşik paket parça işaretleriyle ve yorumlarıyla yaklaşık 203 KB, yorumsuz yaklaşık 176 KB, gzip ile yaklaşık 31 KB,
brotli (kalite 5) ile yaklaşık 30 KB.

Belgeyi şöyle okursun: "İçinde neler var?" önce birleşme sırasını, değişken tablosunu ve koyu temayı, sonra her parçayı
kendi alt bölümünde (ne biçimler, sınıf adları, hangi JS çizer, kim görür) anlatır; sonunda ortak kalıplar, kırılma
noktaları, katmanlar ve hiçbir yerde kullanılmayan kurallar var.

## İçinde neler var?

### Birleşme sırası

Sunucu adları JavaScript'in metin karşılaştırmasıyla (`<`, `>`) dizer. Bu yüzden `00-temel.css`, `00a-yazitipi.css`'ten
önce gelir (`-` işaretinin kodu `a`'dan küçüktür). `testler/test-kucult.js` aynı sırayı `sort()` ile kurar; ikisi aynı
sonucu verir.

| Sıra | Dosya | Satır | Ne biçimler |
|---|---|---|---|
| 1 | `00-temel.css` | 243 | renk, köşe, süre ve yazı tipi değişkenleri; açık ve koyu palet; sayfa tabanı |
| 2 | `00a-yazitipi.css` | 40 | dört `@font-face` (IBM Plex Sans, Newsreader) |
| 3 | `01-giris-kayit.css` | 58 | giriş/kayıt kartı, "Giriş Yap / Hesap Aç" sekmeleri |
| 4 | `02-form.css` | 176 | form alanları, düğmeler, uyarı kutuları, alan hatası, şifre gözü, telefon, dosya ekleme, doluluk çubuğu |
| 5 | `03-iskelet.css` | 170 | üst çubuk, sol menü, içerik alanı, sayfa başlığı |
| 6 | `04-kartlar.css` | 69 | kart, ızgara, sayaç, liste satırı, etiket, boş durum |
| 7 | `05-tablo-grafik.css` | 69 | tablo, HTML yığılı sütun grafiği, lejant, ortalama çubuğu |
| 8 | `06-modal.css` | 71 | açılır pencere ve perdesi, bildirim paneli, uygulamanın alt bilgisi, "Yükleniyor" |
| 9 | `07-mobil.css` | 100 | 860/500/420/359 px uyarlamaları, yazdırma (giriş kâğıtları), bir kez gösterilen şifre |
| 10 | `08-menu-filtre.css` | 40 | masaüstünde menüyü daraltma, ödev filtre çubuğu |
| 11 | `09-kayit-ekrani.css` | 222 | bot sorusu, MEB okul arama, iki adımlı kod ekranı, şifre kuralları, `.baglanti` |
| 12 | `10-ana-sayfa-kutucuklari.css` | 106 | ana sayfanın renkli kutucukları |
| 13 | `11-haftalik-program-tablosu.css` | 107 | eski haftalık program tablosu (bugün hiçbir ekran çizmiyor) |
| 14 | `12-ikonlar.css` | 82 | çizgi ikonlar, tema düğmesi, baş harfli yuvarlak (avatar) |
| 15 | `13-tipografi.css` | 30 | başlık harf aralığı, eş genişlikli rakamlar, kart gölgesi |
| 16 | `14-ders-programi.css` | 308 | ders programı: gün ve hafta görünümü |
| 17 | `15-roller.css` | 32 | rol yetki listesi |
| 18 | `16-giris-sekme.css` | 63 | giriş/kayıt formu geçişi, onay kutuları, çakışma listesi |
| 19 | `17-odev-secim.css` | 102 | ödevde öğrenci seçimi, yetki kapsamı (ders/sınıf) |
| 20 | `18-aktarim-kvkk.css` | 63 | Excel aktarım, rapor tablosu, durum hapı, özel okul rozeti, KVKK kutusu |
| 21 | `19-mesajlar.css` | 97 | sekmeler, mesaj listesi ve okuma, okundu bilgisi |
| 22 | `20-devamsizlik.css` | 53 | yoklama düğmeleri, durum etiketleri, etüt |
| 23 | `21-takvim.css` | 89 | takvim ızgarası, işaretler, günün olayları |
| 24 | `22-cesitli.css` | 217 | aktarım adımları, arama kutusu, ders ağacı, gün gün devamsızlık, yıl şeridi, özellik anahtarı, teslim öğeleri ve medya, ödev serisi, programdan yoklama, hatırlatıcı seçimi, Sınıflarım |
| 25 | `23-hareket.css` | 63 | açılış, pencere ve kutucuk canlandırmaları, geçişler |
| 26 | `24-veli.css` | 41 | veli: çocuk rozeti ve şeridi, özet sayılar |
| 27 | `25-grafik-sinav.css` | 185 | SVG grafikler, sınav değer tablosu ve ölçümler, açılmamış ödev, yıldız, ödev kontrolü |
| 28 | `26-anket-okul-hayati.css` | 85 | anket, yemek listesi, servis kartı, ödev teslim dosyaları, kulüp düğmeleri |
| 29 | `27-harita-ortak.css` | 136 | küçük ortak parçalar, harita, servis seferi durumu |
| 30 | `28-yetiskin-hesap.css` | 197 | kayan sekme, el çizimleri, portallar, "+ Ekle", kişi kodu, yıldız seçimi |
| 31 | `29-dis-sayfalar.css` | 368 | girişsiz sayfalar: üst şerit, açılış, Hakkında, SSS, giriş kartının çevresi, alt bilgi |
| 32 | `30-dokunmatik.css` | 30 | parmakla kullanılan ekranda 44 px dokunma hedefleri, 16 px yazı kutuları |
| 33 | `31-okul-sayfasi.css` | 130 | okulun tanıtım sayfası ve düzenleme ekranı |
| 34 | `32-tarih-secici.css` | 77 | ödevin tarih seçicisi (açılır takvim) |
| 35 | `33-aile.css` | 32 | veli: "Çocuğumun telefonu" |
| 36 | `34-servis-yoklama.css` | 151 | servisçinin yoklaması, servis kartında "bugün", servis saatleri |
| 37 | `35-quiz.css` | 354 | quiz düzenleyici, çözme, sonuçlar |
| 38 | `36-ayar-kartlari.css` | 69 | yönetici ayar kartları, sıralı liste, okulun disk alanı |

### Renk ve ölçü değişkenleri

Hepsi `00-temel.css`'te `:root` üzerinde tanımlı. "Koyu" sütunu koyu temadaki değerdir; "aynı" yazan değişken koyu
temada yeniden tanımlanmaz. "Kullanım" sütunu değişkenin bugün hangi işte geçtiğini söyler (`var(--...)` sayılarak bakıldı).

**Marka ve vurgu**

| Değişken | Açık | Koyu | Kullanım |
|---|---|---|---|
| `--ana` | `#d62839` | `#ff5c6c` | markanın canlı kırmızısı: `.btn` zemini, bağlantı, seçili sekme/gün/çip, odak çerçevesi, başlık ikonları; en çok kullanılan renk (CSS parçalarında 151 `var(--ana)`) |
| `--ana-koyu` | `#a51d2c` | `#ff8f9a` | düğme üstüne gelince, `.btn.ghost` yazısı, seçili menü yazısı |
| `--ana-acik` | `#fdecee` | `#35191e` | soluk kırmızı zemin: seçili satır, `.btn.ghost`, `.msg.bilgi`, hover |
| `--ana-cizgi` | `#f6c3c9` | `#5c2830` | kırmızı ailesinin çizgisi; `.hero h1` altı vurgusu |
| `--ustune-yazi` | `#ffffff` | `#15181d` | marka ya da anlam renkli zeminin üstündeki yazı (koyuda koyu yazı) |
| `--ikinci` | `#0fa3b1` | `#2cc6d4` | ikinci renk turkuaz: quiz, el çizimleri, aile çubukları |
| `--ikinci-koyu` | `#0a6f79` | `#7fe0e9` | turkuazın yazı tonu: varsayılan `.etiket` yazısı |
| `--ikinci-acik` | `#e2f6f8` | `#0f2e33` | turkuazın zemin tonu: varsayılan `.etiket` zemini |
| `--vurgu` | `#f7b32b` | `#ffc44d` | güneş sarısı: üst çubuktaki sayı rozeti, dolu yıldız |
| `--vurgu-acik` | `#fff4d9` | `#3a2f14` | okunmamış bildirim/mesaj satırı zemini |
| `--vurgu-yazi` | `#3b2a00` | `#2b1f00` | sarı zemin üstündeki yazı |
| `--vurgu-sayi` | `#b36f00` | `#f7b32b` | sarının yazı olarak okunan tonu (açılıştaki ikinci rakam, tarih seçicide "Ödev" etiketinin yazısı) |
| `--bant-1`, `--bant-2`, `--bant-3` | `#d62839`, `#ec3f45`, `#ff7a4d` | `#a91c2b`, `#c9303a`, `#e25a3a` | açılış ve giriş sayfalarının renk bandı gradyanı |
| `--bant-yazi` | `#ffffff` | aynı | bandın üstündeki yazı |
| `--bant-doku` | `rgba(255,255,255,.08)` | `.06` saydamlık | bandın kareli defter dokusu |

**Zemin, yazı, çizgi**

| Değişken | Açık | Koyu | Kullanım |
|---|---|---|---|
| `--zemin` | `#fff9f5` | `#15181d` | sayfa zemini; kartın içinde "bir kat aşağı" alanlar |
| `--kart` | `#ffffff` | `#1d2127` | kart, pencere, panel zemini |
| `--kart-ust` | `#ffffff` | `#252a31` | kartın içinde "bir kat yukarı": yazı kutuları, Ekle kutuları |
| `--yazi` | `#1d1f24` | `#eef0f3` | ana yazı |
| `--soluk` | `#6b6566` | `#9aa1ab` | ikincil yazı, etiketler (CSS parçalarında 185 `var(--soluk)`) |
| `--cizgi` | `#f0e6e1` | `#2c323a` | çerçeve ve ayraçlar |
| `--cizgi-koyu` | `#e2d5cf` | `#3a414b` | daha belirgin çerçeve (büyük dokunma düğmeleri, seçenek kutuları) |
| `--medya-zemin` | `#000000` | aynı | fotoğraf/video kutusunun çevresi |

**Anlam renkleri** (her birinin dolgu, soluk zemin ve o zeminde yazı tonu var; markanın kırmızısıyla karışmasın diye "tehlike"
kırmızısı ayrıdır)

| Değişken | Açık | Koyu | Kullanım |
|---|---|---|---|
| `--yesil` / `--yesil-zemin` / `--yesil-yazi` | `#15803d` / `#dcfce7` / `#14532d` | `#4ade80` / `#14301f` / `#86efac` | yaptı, geldi, bindi, doğru, tamam |
| `--kirmizi` / `--kirmizi-zemin` / `--kirmizi-yazi` | `#dc2626` / `#fee2e2` / `#991b1b` | `#f87171` / `#3a1a1a` / `#fca5a5` | hata, yapmadı, gelmedi, çakışma, `.btn.tehlike` |
| `--turuncu` / `--turuncu-zemin` / `--turuncu-yazi` | `#c2410c` / `#ffedd5` / `#9a3412` | `#fb923c` / `#3a2414` / `#fdba74` | uyarı, eksik, geç, açılmamış ödev, az kalan yer |
| `--mavi` / `--mavi-zemin` / `--mavi-yazi` | `#1d4ed8` / `#dbeafe` / `#1e40af` | `#60a5fa` / `#172036` / `#93c5fd` | izinli, geç teslim, özel gün, devam eden quiz |
| `--mor` | `#7c3aed` | `#a78bfa` | yalnız takvimdeki toplantı işareti |
| `--gri-zemin` / `--gri-zemin-koyu` | `#eceaf3` / `#e0ddea` | `#2a2324` / `#362d2e` | `.btn.gri` ve hover'ı, nötr çip ve numaralar |
| `--bordo` / `--bordo-yazi` | `#7f1d1d` / `#ffffff` | `#7f1d1d` / `#fecaca` | "gelmedi (izinsiz)" etiketi, grafik ve sonuç kutusu |
| `--camgobegi` | `#0d9488` | `#2dd4bf` | tanımlı ama hiçbir kural kullanmıyor |

**Ana sayfa kutucukları** (iki temada aynı; beyaz alt yazı her zeminde en az 4,5:1 olsun diye koyu tonlar seçilmiş)

| Değişken | Değer | Not |
|---|---|---|
| `--kutu-yazi` | `#ffffff` | kutucuk yazısı |
| `--kutu-turuncu`, `--kutu-yesil`, `--kutu-kirmizi` | `#c2410c`, `#15803d`, `#dc2626` | |
| `--kutu-mor`, `--kutu-mavi`, `--kutu-gri` | `#7c3aed`, `#0369a1`, `#6b7280` | `--kutu-gri` sınıfsız kutucuğun da zeminidir |
| `--kutu-camgobegi`, `--kutu-lacivert` | `#0f766e`, `#4338ca` | |
| `--kutu-sari` | `#b5b508` | beyazla 2,19:1; bu yüzden hiçbir kutucuk sarı değil |
| `--kutu-rozet-zemin`, `--kutu-rozet-yazi` | `rgba(255,255,255,.95)`, `#1f2937` | sağ üstteki sayı hapı |

**Harita** (işaretler hep açık renkli döşemenin üstünde durduğu için iki temada aynı): `--harita-okul` `#1d4ed8`,
`--harita-ev` `#15803d`, `--harita-servis` `#d62839`, `--harita-secim` `#c2410c`, `--harita-ben` `#0d9488`,
`--harita-beyaz` `#ffffff`, `--harita-yazi` `#241a1b`, `--harita-baglanti` `#1d4ed8`, `--harita-dugme-ust` `#f4eeee`,
`--harita-dugme-cizgi` `rgba(0,0,0,.15)`, `--harita-etiket-zemin` `rgba(255,255,255,.94)`, `--harita-atif-zemin`
`rgba(255,255,255,.85)`, `--harita-golge`, `--harita-golge-kucuk`, `--canli-halka` / `--canli-halka-bos` (canlı konum
noktasının yeşil halkası). Hepsini yalnız `27-harita-ortak.css` kullanır.

**Gölge, perde, odak**

| Değişken | Açık | Koyu | Kullanım |
|---|---|---|---|
| `--golge` | iki katlı yumuşak gölge (`rgba(36,26,27,.06/.07)`) | `rgba(0,0,0,.35/.40)` | giriş kartı, bildirim paneli, düğme hover'ı |
| `--golge-yumusak` | `0 1px 2px` | daha koyu | kartlar (`13-tipografi.css`), kutucuklar, seçili sekme |
| `--golge-kalkik` | `0 10px 28px` | daha koyu | pencere, telefonda açık menü, tıklanır kartın hover'ı |
| `--perde` | `rgba(31,27,46,.45)` | `rgba(0,0,0,.62)` | pencere ve telefon menüsünün arkası |
| `--odak` | `rgba(214,40,57,.18)` | `rgba(255,92,108,.28)` | yazı kutusunun 3 px odak halkası |
| `--hata-odak` | `rgba(220,38,38,.18)` | `rgba(248,113,113,.28)` | hatalı alanın odak halkası |

**Köşe, hareket, yazı tipi** (koyu temada değişmez; "hareketi azalt" açıksa süreler sıfırlanır)

| Değişken | Değer | Kullanım |
|---|---|---|
| `--r-buyuk` | `28px` | kutucuk, pencere, giriş kartı, okul sayfası |
| `--r` | `22px` | kartlar |
| `--r-kucuk` | `14px` | düğme, yazı kutusu, menü satırı |
| `--r-mini` | `9px` | küçük rozet, sekme, hücre |
| `--sure` / `--sure-kisa` | `280ms` / `160ms` (azaltılınca `0ms`) | geçiş ve canlandırma süreleri |
| `--egri` | `cubic-bezier(.16, .84, .28, 1)` | bütün geçişlerin eğrisi |
| `--kalkis` | `3px` (azaltılınca `0px`) | kart/kutucuk üstüne gelince yükselme |
| `--f-govde` | `'IBM Plex Sans'`, sonra sistem yazı tipleri | gövde yazısı |
| `--f-baslik` | `'Newsreader'`, Georgia, serif | `h1`, `h2`, büyük rakamlar |
| `--f-kod` | `ui-monospace`, Consolas… | kod, kişi kodu, adres kutusu |

Başka dosyalarda tanımlanan yerel değişkenler: `--igne` (harita iğnesinin rengi, `27-harita-ortak.css`), `--sira` (kayan
sekmede seçili düğmenin sırası; `05-giris.js` yazar), `--av` (avatarın zemin rengi; `02-ikonlar.js` `avatar()` yazar),
`--os-renk`, `--os-zemin`, `--os-yazi`, `--os-sutun` (okul sayfasının ayarları; `19g-okul-sayfasi.js` yazar). Açılıştaki
`.v-gorsel` kutusu `--yazi`, `--kart`, `--ana`, `--ana-acik`, `--ikinci`, `--ikinci-koyu`, `--vurgu`'yu kendi içinde açık
temanın değerlerine geri çevirir: el çizimi her temada beyaz kartta durur.

### Koyu tema nasıl çalışır

Üç durum var:

1. Kişi seçmedi ("Sistem", varsayılan): `<html>`'de `data-tema` yoktur; işletim sistemi koyu istiyorsa
   `@media (prefers-color-scheme: dark) { :root:not([data-tema="acik"]) { … } }` bloğu koyu değerleri yazar.
2. "Açık" seçti: `<html data-tema="acik">`; `:not([data-tema="acik"])` koşulu yüzünden sistem koyu olsa da açık palet kalır.
3. "Koyu" seçti: `<html data-tema="koyu">`; ayrı `:root[data-tema="koyu"] { … }` bloğu koyu değerleri yazar.

Koyu değerler bu yüzden **iki kez** yazılıdır (aynı liste iki blokta). Seçimi `public/js/tema.js`
([../../js/tema.md](../../js/tema.md)) sayfa çizilmeden önce `localStorage`'daki `ee_tema` anahtarından okuyup uygular;
böylece koyu temayı seçen kişi bir an beyaz ekran görmez. `color-scheme: light` / `dark` da değiştiği için tarayıcının
kendi çizdiği parçalar (kaydırma çubuğu, tarih kutusu, onay kutusu) temaya uyar.

Değişken dışında temaya bakan üç kural daha var; ikisi aynı iki koşulu tekrar yazar:

- `12-ikonlar.css` — tema düğmesi görünen temanın tersini gösterir (açıkta ay, koyuda güneş): `.tema-dugme .tema-gunes`
  ve `.tema-ay` görünürlüğü `:root[data-tema="koyu"]` ve sistem koyuyken `:root:not([data-tema="acik"])` için ayrı ayrı.
- `27-harita-ortak.css` — koyu temada harita döşemeleri `filter: brightness(.78) contrast(1.08) saturate(.85)` ile
  karartılır; yine iki koşul için ayrı ayrı.
- `29-dis-sayfalar.css` — `.v-gorsel` yerel değişkenlerle açık kalır (yukarıda).

### 00-temel.css

**Ne biçimler:** yukarıdaki bütün değişkenler ve iki koyu blok; "hareketi azalt" (`prefers-reduced-motion: reduce`) açıksa
`--sure`, `--sure-kisa` `0ms`, `--kalkis` `0px`. Ardından sayfanın tabanı: `* { box-sizing: border-box }`;
`[hidden] { display: none !important }` (bir sınıfın `display: flex`'i `hidden` niteliğini ezmesin diye; yorumuna göre
yetki penceresinde kapalı yetkinin sınıf listesi görünüyordu); `html, body` zemin, yazı rengi, `--f-govde`, 15 px,
satır yüksekliği 1.55, tema değişirken zemin ve yazı renginin yumuşak geçişi; `button, input, select, textarea` yazı
tipini ve rengini miras alır; `a` `--ana` renginde; `h1, h2` Newsreader; `code, .kod, .veli-kodu` eş genişlikli.

**Kim görür:** herkes, her sayfa.

### 00a-yazitipi.css

**Ne biçimler:** dört `@font-face`. IBM Plex Sans 400–700 ağırlık aralığıyla (`font-weight: 400 700`, tek dosyada bütün
ağırlıklar) `latin` ve `latin-ext` alt kümesi; Newsreader yalnız 700, yine iki alt küme. Dosyalar
`/yazitipi/plex-sans-400-700-latin.woff2`, `…-latin-ext.woff2`, `/yazitipi/newsreader-700-latin.woff2`,
`…-latin-ext.woff2`. `unicode-range` sayesinde tarayıcı yalnız sayfadaki harflerin gerektirdiği dosyayı indirir (Türkçe
metin ikisine de dokunur: ı temel alt kümede, ğ ş İ genişletilmişte). `font-display: swap`: yazı önce sistem yazı tipiyle
anında görünür, dosya gelince değişir.

**Üreten:** `araclar/yazitipi-indir.js` ([../../../araclar/yazitipi-indir.md](../../../araclar/yazitipi-indir.md)); dosya
elle düzenlenmez, araç baştan yazar. Sunucu `.woff2` dosyalarını `font/woff2` türüyle bir yıllık kalıcı önbellek başlığıyla
(`public, max-age=31536000, immutable`; `http.js` `statikGonder`) verir: yazı tipi dosyasının içeriği değişirse adı da
değişmeli, yoksa tarayıcılar eskisini kullanmaya devam eder. `index.html` iki Plex dosyasını `<link rel="preload">` ile
erkenden ister; `public/sw.js` ([../../sw.md](../../sw.md)) dördünü de çevrimdışı önbelleğine koyar. **Kim görür:** herkes.

### 01-giris-kayit.css

**Ne biçimler:** giriş/kayıt ekranının çerçevesi. `.auth-wrap` en az ekran boyu, `align-items: flex-start` ve kartta
`margin: auto` (yorumuna göre: ortalanan uzun kayıt formunun üstü kaydırmayla erişilemez oluyordu), köşede `--ana-acik`
hâlesi. `.auth-card` en çok 460 px, `--r-buyuk`, `--golge`, açılışta `belir` canlandırması (`23-hareket.css`). `.tabs` ve
`.tabs button(.on)` "Giriş Yap / Hesap Aç" sekmeleri. `.auth-logo` (`.mark`, `h1`, `p`) bugün HTML'de yok.

**Çizen:** `public/index.html` (giriş kartı), [05-giris](../../js/parcalar/05-giris.md). **Kim görür:** girişsiz ziyaretçi.

### 02-form.css

**Ne biçimler:** bütün formların temel parçaları.

- Alan: `.field` (+ `label`, `input`, `select`, `textarea`; odakta `--ana` çerçeve ve `--odak` halkası; `textarea` dikey
  büyür), `.row2` (iki sütun; 860 px altında tek sütun, `07-mobil.css`), `.hint` (alttaki küçük açıklama).
- Düğme: `.btn` (marka zemini, `--ustune-yazi`, hover'da `--ana-koyu` ve 1 px yükselme) ve türleri `.full`, `.ghost`,
  `.gri`, `.kucuk`, `.tehlike` (`--kirmizi`, hover'da `brightness(.9)`), `.bekliyor` (imleç `progress`), `:disabled`
  (`.55` saydam); `a.btn` bağlantıyı düğme gibi gösterir.
- Uyarı kutusu: `.msg` ve `.hata`, `.iyi`, `.bilgi`, `.uyari`.
- Alan hatası: `.field.hatali` kırmızı çerçeve ve kırmızı odak halkası; `.alan-hata` (ikon + yazı, içinde `.baglanti`);
  `.kvkk-alan.hatali` onay kutusuna kırmızı çerçeve.
- Şifre: `.sifre-kap`, `.sifre-goz` (göster/gizle; `aria-pressed="true"` iken `--ana`), Edge'in kendi göz düğmesi
  `::-ms-reveal` ile gizlenir (iki göz olmasın); `.caps-uyari` (Caps Lock uyarısı).
- `.tarih-secici`: gün / ay / yıl üç açılır listesi (doğum tarihi; `04a-form-alanlari.js` `tarihSecici`). Ödevin açılır
  takvimi bu değildir, o `32-tarih-secici.css`'te.
- Telefon: `.tel-kutu`, `.field .tel-kutu .tel-ulke` (solda ülke kodu).
- Dosya ekleme: `.ek-alan` (`.dolu` iken `.ek-birak` gizli), `.ek-birak` (`.uzerinde`), `.ek-liste`, `.ek-satir`
  (`.hatali`), `.ek-ad`, `.ek-cubuk`.
- Doluluk: `.doluluk` (`.az-kaldi` turuncu, `.dolu` kırmızı), `.doluluk-ust`, `.doluluk-cubuk`, `.doluluk-uyari`; okul disk
  alanı aynı düzeni `36-ayar-kartlari.css`'teki renklerle kullanır.
- `.dosya-izin` ("Öğrenciler bu ödeve dosya yükleyebilsin" kutusu; yönetici okul düzenleme penceresinde "Varsayılan sınırı
  kullan" kutusu da bu sınıfla çizilir), `.ekler-kutu` (okunan mesajın/ödevin ekleri; velinin quiz satırı da bu kutuda).

**Çizen:** hemen her ekran (`.field`, `.btn`, `.msg`); özel parçalar: [04a-form-alanlari](../../js/parcalar/04a-form-alanlari.md)
(alan hatası, şifre gözü, Caps Lock, gün/ay/yıl), [04c-telefon](../../js/parcalar/04c-telefon.md),
[04d-ekler](../../js/parcalar/04d-ekler.md) (ek alanı, doluluk), [14b-odev-teslim](../../js/parcalar/14b-odev-teslim.md)
(doluluk), [11-ogretmen-odev](../../js/parcalar/11-ogretmen-odev.md) (`.dosya-izin`),
[08d-okul-disk](../../js/parcalar/08d-okul-disk.md) ve [09d-okul-disk](../../js/yonetim/09d-okul-disk.md) (doluluk;
09d `.dosya-izin`'i de kullanır), [14c-quiz](../../js/parcalar/14c-quiz.md) (`.alan-hata`, velinin `.ekler-kutu` quiz
satırı). **Kim görür:** herkes.

### 03-iskelet.css

**Ne biçimler:** giriş yapılmış uygulamanın iskeleti.

- `.app` (`.on` olunca görünür), `.shell` (menü + içerik yan yana).
- `.topbar`: yapışkan, 62 px, `z-index: 40`; `.hamburger`; `.search` (`input` yuvarlak, solda `.ico` büyüteç);
  `.topbar-right`; `#bildirimPanel { display: contents }` (kap boşken de üst çubukta aralık yiyordu; içindeki `.panel` üst
  çubuğa göre konumlanır).
- `.iconbtn` (üst çubuk düğmesi; `.on`; `.donuyor` iken ikon `donme` canlandırmasıyla döner, "hareketi azalt"ta durur ve
  soluklaşır), `.rozet` (sarı sayı hapı).
- `.sidebar`: 232 px, `top: 62px` yapışkan, kendi kaydırması; `.brand` (`.mark`), `.navlink` (`.on`, `.g`), `.nav-ayrac`,
  `.nav-baslik`.
- `.content` (22 px boşluk), `.page-inner` (en çok 1040 px, ortada).
- `.hero` sayfa başlığı: `h1` Newsreader, altı `--ana-cizgi` fosforlu kalem gibi; `.alt`, `hr`. `h2.sb`, `h3.sb` bölüm
  başlıkları.

**Çizen:** `public/index.html` (çubuk ve menü kabı), [06-menu](../../js/parcalar/06-menu.md) (`.navlink`, `.nav-baslik`,
`.nav-ayrac`), [07-yonlendirme](../../js/parcalar/07-yonlendirme.md) (`hero()`, Yenile'nin `.donuyor`'u),
[24-bildirim-arama-mobil](../../js/parcalar/24-bildirim-arama-mobil.md). **Kim görür:** giriş yapmış herkes.

### 04-kartlar.css

**Ne biçimler:** içerik yapı taşları. `.kart` (+ `h3`; `.tikla` iken hover'da yükselir ve `--golge-kalkik`), `.grid`
`.k2` / `.k3` / `.k4` (en dar sütun 260 / 190 / 150 px, `auto-fill`), `.stat` (`.n` büyük Newsreader rakam, `.l` etiket),
`.satir` (liste satırı: `.buyu`, `.ad`, `.alt`; sonuncunun çizgisi yok), `.etiket` (hap; varsayılan turkuaz, `.yesil`,
`.kirmizi`, `.turuncu`, `.gri`, `.mavi`, `.bordo`), `.bos` (kesik çizgili boş durum kutusu, `.g`).

**Çizen:** neredeyse her ekran; `.bos` kutusunu [07-yonlendirme](../../js/parcalar/07-yonlendirme.md) `bosKutu()` kurar,
`.stat` [08-ana-sayfa](../../js/parcalar/08-ana-sayfa.md). **Kim görür:** giriş yapmış herkes.

### 05-tablo-grafik.css

**Ne biçimler:** `.tablo-sar` (tabloyu yatay kaydırır), `table.t` (en az 460 px; başlıklar küçük büyük harf; içindeki sayı
ve metin kutuları 90 px). HTML ile çizilen yığılı sütun grafiği: `.grafik`, `.sutun-sar`, `.sutun-yigin` (`i.yapti`,
`.eksik`, `.yapmadi`, `.izinli`, `.gelmedi`; `.gec` `25-grafik-sinav.css`'te), `.sutun-ad`, `.sutun-us`. `.gosterge`
(lejant; `i` renk karesi), `.cubuk` (ince ilerleme/ortalama çubuğu).

**Çizen:** `table.t` ve `.tablo-sar` — [10a-giris-bilgisi](../../js/parcalar/10a-giris-bilgisi.md),
[12-ogretmen-sinav](../../js/parcalar/12-ogretmen-sinav.md), [14-odev-filtre](../../js/parcalar/14-odev-filtre.md),
[28-grafik](../../js/parcalar/28-grafik.md), [09-yonetici](../../js/yonetim/09-yonetici.md); yığılı sütunlar
[13-ogrenci-veli](../../js/parcalar/13-ogrenci-veli.md); `.cubuk` 12, 13, 14, 14b, 19, 19b (anket sonuçları).
**Kim görür:** giriş yapmış herkes; tablolar çoğunlukla öğretmen, müdür ve yönetici ekranlarında, yığılı sütunlar öğrenci
ve velinin ilerleyiş sayfasında.

### 06-modal.css

**Ne biçimler:** `.perde` (tam ekran, `--perde` zemin, `z-index: 60`, ortalar; `perde` canlandırması), `.modal` (en çok
560 px, en çok ekranın %88'i kadar uzun, kendi içinde kayar, `pencere` canlandırması), `.modal h3`, `.modal-alt` (alttaki
düğme satırı, sağa yaslı). Bildirim paneli `.panel` (üst çubuğa göre `top: 58px; right: 12px`, genişlik
`min(360px, 100vw - 24px)`, `z-index: 50`) ve `.bildirim` (`.yeni` sarımsı, `.tikla`, `.z` zaman). Uygulamanın alt bilgisi
`.footer` (`h4`, `p`), `.footer-iletisim` (sitenin iletişim bilgileri ayarlıysa; `margin-top: 6px !important`),
`.yukleniyor` (ortalı "Yükleniyor..."), `.sidebar-perde` (gizli; telefonda `07-mobil.css` açar). Dosyada içi boş bir
"rozet / başarı" başlık yorumu kalmış.

**Çizen:** [03-mesaj-modal](../../js/parcalar/03-mesaj-modal.md) (`modalAc` → `.perde` / `.modal`), perdeyi ayrıca 05b,
10a, 10b, 14c, 25, 26 kullanır; `.panel` [24-bildirim-arama-mobil](../../js/parcalar/24-bildirim-arama-mobil.md);
`.footer` (`altBilgi()`), `.yukleniyor` [07-yonlendirme](../../js/parcalar/07-yonlendirme.md) (sayfa yüklenirken);
`.yukleniyor`'u ayrıca [19c-okul-hayati](../../js/parcalar/19c-okul-hayati.md) servisin "bugünkü yoklama" penceresinde,
[08b-rolsuz](../../js/parcalar/08b-rolsuz.md) okul aramasında kullanır (bkz. Dikkat!). **Kim görür:** giriş yapmış herkes.

### 07-mobil.css

**Ne biçimler:**

- 860 px ve altı: sol menü ekranın dışına itilir (`position: fixed; transform: translateX(-101%)`, `.acik` olunca içeri
  kayar, `z-index: 45`), `.sidebar-perde.acik` arkasını karartır (`z-index: 44`, üst çubuğun altından başlar); içerik
  boşluğu daralır; `.iconbtn` yazısız (`font-size: 0`) ve ikon büyür; `.hero h1` 21 px; arama kutusu tam genişlik ve
  yer tutucu yazısı saydam (dar ekranda "İçerik Ara" "İçer" diye kesiliyordu); `.row2` tek sütun.
- 500 px ve altı: `#btnAyarlar` ve `#btnTema` gizlenir (Ayarlar Profil'le aynı sayfayı açıyor, tema Ayarlar'da seçiliyor),
  aralıklar daralır. 359 px ve altı: `#btnYenile` de gizlenir. 420 px ve altı: `.auth-card` boşluğu daralır, `.grid.k3` ve
  `.grid.k4` iki sütun.
- Yazdırma: menü, üst çubuk ve ☰ gizlenir. Giriş kâğıtları: `#yazdirKap` ekranda gizli; `body.yazdiriliyor` iken yazdırmada
  yalnız o görünür; `.mektup` (kesik çizgili kesme kâğıdı, sayfada bölünmez) ve `.m-ust`, `.m-ad`, `.m-kod`, `.m-not`,
  `.m-veli` (punto ve gri tonlar sabit).
- `.kod-hucre` (tablodaki şifre/kod hücresi), `.kod-goster` (bir kez gösterilen şifre: büyük, eş aralıklı, kesik çizgili,
  tek tıkla bütünü seçilir).

**Çizen:** `public/index.html` (`#btnAyarlar`, `#btnTema`, `#btnYenile`), [24-bildirim-arama-mobil](../../js/parcalar/24-bildirim-arama-mobil.md)
(`sidebarAc`/`sidebarKapat`), [10a-giris-bilgisi](../../js/parcalar/10a-giris-bilgisi.md) (`#yazdirKap`,
`body.yazdiriliyor`, `.mektup`, `.kod-hucre`), [10b-hesaplar](../../js/parcalar/10b-hesaplar.md) (`.kod-goster`); giriş
kâğıtlarını Excel aktarımı da yazdırır ([15-aktarim](../../js/parcalar/15-aktarim.md), "Giriş kâğıtlarını yazdır").
**Kim görür:** telefon uyarlamalarını herkes; giriş kâğıtlarını "Giriş bilgisi dağıt"tan müdür ve `ogrenci.sifre` yetkili
öğretmen, Excel aktarımının sonunda aktarımı yapan (müdür ya da `aktarim.yap` yetkili öğretmen).

### 08-menu-filtre.css

**Ne biçimler:** 861 px ve üstünde ☰ menüyü daraltır: `body.sidebar-kapali .sidebar { display: none }`; açılırken yalnız
opaklık canlandırması (`menuBelir`). Yorumuna göre genişliğe geçiş verilmiyor, çünkü bazı tarayıcılarda canlandırma yarıda
takılıp menüyü 0 px bırakıyordu. Ödev filtre çubuğu: `.kart.filtre`, `.filtre-satir` (alanlar sarar, en az 130 px; 640 px
altında tam genişlik), `.filtre-satir .field` küçük etiket ve 14 px kutular, `.filtre-ozet`.

**Çizen:** [24-bildirim-arama-mobil](../../js/parcalar/24-bildirim-arama-mobil.md) (`masaustuDaralt`,
`body.sidebar-kapali`), [14-odev-filtre](../../js/parcalar/14-odev-filtre.md), [18-devamsizlik](../../js/parcalar/18-devamsizlik.md),
[21-ders-programi](../../js/parcalar/21-ders-programi.md) (`.filtre-satir`). **Kim görür:** menü daraltmayı giriş
yapmış herkes (masaüstünde); filtre çubuğunu ödev, devamsızlık ve program sayfalarını açanlar.

### 09-kayit-ekrani.css

**Ne biçimler:**

- Kayıt formunun bot sorusu: `.bot-satir`, `.bot-soru` (seçilemeyen, soluk kırmızı zeminli soru kutusu).
- MEB okul arama: `.okul-ust` (arama kutusu ve yanında açılır liste), `.okul-sonuc` (boş değilse çerçeveli; `.yukleniyor` iken eski sonuç silinmez,
  `.55` saydam olur), `.okul-bilgi` (`.hata`, içinde `.baglanti`), `.okul-satir` (`.ad`, `.yer`; eşleşen harfler `mark`
  ile altı çizili kalın), `.okul-secili` (yeşil kutu: `.secili-ic`, `.buyu`, `.ad`, `.yer`, `.secili-ikon`), `.okul-elle`
  ("Okul listede yok", `details`). Yorum "müdür kaydı" diyor; bugün bu alanı yalnız yöneticinin "Okul aç" penceresi
  kullanıyor ([08b-rolsuz](../../js/parcalar/08b-rolsuz.md), [09-yonetici](../../js/yonetim/09-yonetici.md)).
- İki adımlı giriş kod ekranı: `.kod-baslik`, `.kod-simge`, `.kod-kutu` (26 px, harf aralığı 10 px), `.kod-alt`.
- `.baglanti`: düğme olan ama bağlantı gibi görünen öğe (altı çizili `--ana`; `:disabled` soluk). Dokunmatikte
  `30-dokunmatik.css` büyütür.
- Kayıt şifre kuralları: `.sifre-kurallar li` (boş yuvarlak), `li.tamam` yeşil ve içinde satır içi SVG tik
  (`data:` adresi; CSP `img-src 'self' data:` izin verir).
- `.kayit-sonrasi`; `.rolsuz-satir` (yazı kutusu + düğme satırı; bugün kişi kodu girme ve benzeri satırlar); `.rolsuz-kart`
  ve `details.rolsuz-kart` ("Aç/Kapat" yazılı özet) bugün hiçbir yerde çizilmiyor.

**Çizen:** `public/index.html` (bot sorusu, kod ekranı, kayıt formunun şifre kuralları, `.kayit-sonrasi`),
[05-giris](../../js/parcalar/05-giris.md) (`sifreKuralListesi`: şifre kuralı listesini zorunlu şifre değişiminde
[05b-sifre-zorunlu](../../js/parcalar/05b-sifre-zorunlu.md) ve Ayarlar'da [23-veli-ayarlar](../../js/parcalar/23-veli-ayarlar.md) da kurar),
[08b-rolsuz](../../js/parcalar/08b-rolsuz.md) (okul arama), `.rolsuz-satir` [08c-kisilikler](../../js/parcalar/08c-kisilikler.md),
[10b-hesaplar](../../js/parcalar/10b-hesaplar.md), [23-veli-ayarlar](../../js/parcalar/23-veli-ayarlar.md),
[09-yonetici](../../js/yonetim/09-yonetici.md). **Kim görür:** kayıt olan ziyaretçi; girişte sunucu iki adımlı kod
isterse (`twoFactor`) giriş yapan kişi (kod ekranı); şifresini değiştiren herkes (şifre kuralları); sistem yöneticisi
(okul arama).

### 10-ana-sayfa-kutucuklari.css

**Ne biçimler:** her rolün ana sayfasındaki renkli bölüm kutucukları. `.kutucuklar` (ızgara, en dar 168 px; 520 px altında
140 px), `.kutucuk` (düğme; en az 116 px yüksek, `--r-buyuk`, beyaz yazı, hover'da yükselir, klavye odağında 3 px
`--yazi` çerçeve), `.kutucuk-ad`, `.kutucuk-alt` (saydamlık yok: küçük yazı zeminle tam kontrastta kalsın),
`.kutucuk-ikon` (sağ altta `.22` saydam büyük filigran), `.kutucuk-rozet` (sağ üstte sayı). Renkler düz, gradyan yok:
`.turuncu`, `.yesil`, `.kirmizi`, `.sari`, `.mor`, `.mavi`, `.gri`, `.camgobegi`, `.lacivert` (`--kutu-*`). Bugün JS'te
kullanılan renkler: turuncu, yeşil, kırmızı, mor, mavi, gri, camgöbeği, lacivert; `.sari` kullanılmıyor.

**Çizen:** [07-yonlendirme](../../js/parcalar/07-yonlendirme.md) `kutucuklar()`, verisi [08-ana-sayfa](../../js/parcalar/08-ana-sayfa.md)
ve [09a-yonetim-paneli](../../js/yonetim/09a-yonetim-paneli.md). **Kim görür:** her rolün ana sayfası, yönetici paneli.

### 11-haftalik-program-tablosu.css

**Ne biçimler:** eski haftalık program ızgarası: `table.program` (`th.saat-sutun`), `.hucre` (`.dolu`, `.cakisma`,
`.salt`), `.hucre-ders`, `.hucre-ogretmen`, `.hucre-bos`, ders seçme listesi `.ders-secim` (`.secili`, `.ad`, `.alt`);
640 px altı küçülür.

**Bugün hiçbir JS ya da HTML bu sınıfları çizmiyor**; ders programı `14-ders-programi.css`'in gün/hafta görünümüne geçti.
Kalıntıdır; silinirse `23-hareket.css`'teki `.hucre` geçiş kuralı da anlamsız kalır.

### 12-ikonlar.css

**Ne biçimler:** `02-ikonlar.js`'in `ik()` ile çizdiği çizgi SVG ikonlar: `.ikon` (1.15em, `currentColor`; bulunduğu
yerin rengini ve boyunu alır), `.ikon.buyuk` (2.4em; boş durum kutusunda). Yer yer boy ve hiza: `.navlink .ikon` (18 px,
seçiliyken tam opak), `.iconbtn .ikon` (19 px), `.hamburger .ikon`, `.search .ico .ikon`, `.kutucuk .kutucuk-ikon .ikon`
(62 px, ince çizgi), `.bos` (dikey ortalı), `.satir .ad .ikon`, `.msg .ikon`, `.brand .mark`, `.kod-simge .ikon`,
`.auth-logo .mark` (kullanılmıyor; yorumu: SVG'ye boy yüzde değil sabit verilmeli, yoksa kabı kaplayıp devleşiyor).
Tema düğmesi `.tema-dugme .tema-gunes` / `.tema-ay` (görünen temanın tersini gösterir, JS beklemeden doğru çizilir).
Baş harfli yuvarlak `.avatar` (zemin `var(--av, var(--ana))`; `--av`'yi `avatar()` verilen anahtarın (yoksa adın) karmasına
göre `AVATAR_RENKLERI`'nden seçip satır içi yazar; yazı beyaz; `.kucuk` 28 px, `.buyuk` 56 px; `.satir >
.avatar`, `.iconbtn .avatar`).

**Çizen:** [02-ikonlar](../../js/parcalar/02-ikonlar.md) (`ik`, `avatar`), tema düğmesi `public/index.html` ve beş ayrı
HTML sayfası. **Kim görür:** herkes.

### 13-tipografi.css

**Ne biçimler:** küçük yazı rötuşları. `h1`–`h4` hafif dar harf aralığı (`-0.015em`; `00-temel.css`'teki `h1, h2 {
letter-spacing: .01em }` bu yüzden hiç uygulanmaz) ve `text-wrap: balance`; `.hero h1` geniş aralık (`03-iskelet.css`'teki
değerin aynısı);
`.field label`, `.sutun-basi`, `.mudur-notu .baslik` harf aralığı; rakam sütunları hizalansın diye
`font-variant-numeric: tabular-nums` (`.stat .n`, `.t td`, `.ders-saat`, `.sutun-saat`, `.kod-goster`); bütün `.kart`'lara
`--golge-yumusak`. `.mudur-notu` ve `.ders-saat` bugün çizilmiyor. **Kim görür:** herkes.

### 14-ders-programi.css

**Ne biçimler:** ders programının iki görünümü.

- Görünüm seçici: `.gorunum-secici`, `.gorunum-dugme` (`.secili`) — "Gün / Hafta".
- Gün şeridi: `.gun-seridi`, `.gun-nokta` (`.bos`, `.dolu`, `.bugun` kesik çerçeve, `.secili` marka zemini; `.nokta-ad`,
  `.nokta-adet`).
- Gün gezgini: `.gun-gezgin`, `.gun-ok`, `.gun-orta`, `.gun-buyuk`, `.gun-kucuk`.
- Günlük görünüm: `.ders-sutunlar` (ızgara, en dar 178 px), `.ders-sutun` (`.cakisma` kırmızı, `.simdi` + `.simdi-etiket`
  şu anki ders, `.bos-saat`, `.ekle` kesik çizgili "ders ekle"), `.sutun-basi`, `.sutun-saat`, `.sutun-ders`, `.sutun-kisi`,
  `.sutun-islem`, `.sutun-uyari`, `.bos-yazi`, `.bos-ders`, `.hafta-ayrac`, `.ekle-arti`, `.ekle-yazi`.
- Haftalık görünüm: `.hafta-sar` (yatay kaydırma), `table.hafta` (en az 640 px; `th.gun-sutun`, `tr.bugun`, `.bugun-etiket`,
  `td.bos-hucre`, `td.cakisma`, `td.ekle-sutun` / `th.ekle-sutun`), `.hafta-saat`, `.hafta-ders`, `.hafta-kisi`,
  `.hafta-islem`, `.hafta-ekle`.
- 520 px altı: gezgin alt alta, ders sütunları tek sütun.

**Çizen:** [21-ders-programi](../../js/parcalar/21-ders-programi.md) (`programGovdesi`, `gunlukGorunum`,
`haftalikGorunum`); salt okunur programı [22-programim](../../js/parcalar/22-programim.md) aynı `programGovdesi` ile çizer.
**Kim görür:** düzenleme — müdür ve `program.duzenle` yetkili öğretmen; görüntüleme — öğretmen, müdür (kendi dersleri),
öğrenci, veli, öğrenci portalına bakan okul personeli.

### 15-roller.css

**Ne biçimler:** rol penceresinin yetki listesi: `.yetki-liste`, `.yetki-grup`, `.yetki-grup-ad` (küçük büyük harf
`--ana`), `.yetki-satir` (`input`, `b`), `.yetki-aciklama`; devre dışı kutunun yazısı soluk (`input:disabled + span`).

**Çizen:** [19f-roller](../../js/parcalar/19f-roller.md). **Kim görür:** müdür, `rol.yonet` yetkili öğretmen.

### 16-giris-sekme.css

**Ne biçimler:** başlık yorumuna göre "program stilleri temizlenirken yanlışlıkla silinmişti", sonra geri kondu.
Giriş ve kayıt formu arasında geçiş: `.form-cikis` (`formCik`: solar ve 6 px yukarı), `.form-giris` (`formGel`), `.tabs
button` geçişi; "hareketi azalt"ta kapalı. Onay kutuları: `.secenekler` (alt alta), `.onay` (satır; kutu 17 px,
`accent-color: var(--ana)`), `#gizlilikNot`. `.cakisma-liste` (uzun çakışma listesi kendi içinde kayar, en çok 190 px),
`.msg.hata .baglanti`.

**Çizen:** `public/index.html`, [05-giris](../../js/parcalar/05-giris.md) (form geçişi); `.onay` hemen her pencerede;
`.cakisma-liste` [21-ders-programi](../../js/parcalar/21-ders-programi.md). **Kim görür:** form geçişini girişsiz
ziyaretçi; onay kutularını herkes; çakışma listesini programı düzenleyen.

### 17-odev-secim.css

**Ne biçimler:** ödev verirken öğrenci seçimi: `.secim-ust`, `.secim-sayac`, `.hedef-liste` (en çok 300 px, kayar),
`.hedef-sinif`, `.hedef-baslik`, `.hedef-adet`, `.hedef-ogrenciler` (ızgara), `.hedef-ogrenci`. Yetki kapsamı (yetkiyi
ders/sınıfla daraltma): `.yetki-blok`, `.kapsam-alan`, `.kapsam-kutu`, `.kapsam-basi`, `.kapsam-hepsi`,
`.kapsam-secenekler`, `.kapsam-secenek`. "Müdürün ders bazlı ödev görünümü" kuralları (`.ders-blok-basi`, `.ders-blok-ad`,
`.ders-blok-alt`, `.ders-blok-bos`) bugün çizilmiyor.

**Çizen:** [11-ogretmen-odev](../../js/parcalar/11-ogretmen-odev.md) (öğrenci seçimi), [19f-roller](../../js/parcalar/19f-roller.md)
(kapsam). **Kim görür:** ödev veren öğretmen ve müdür; rolleri yöneten.

### 18-aktarim-kvkk.css

**Ne biçimler:** `.tur-sec` (büyük seçenek düğmesi; `.secili`, `.ad`, `.alt`), `.rapor-kaydir`, `.rapor-tablo` (`th`,
`td`, `code`), `.rapor-no`, durum hapı `.durum` (`.hazir`, `.hata`, `.uyari`, `.atlandi`), okul aramasında özel okul
rozeti `.ozel-rozet`, giriş formunun altı `.giris-alt` ("Şifremi unuttum"; `29-dis-sayfalar.css` esnek yapar), KVKK onay
kutusu `.kvkk-alan` (`.onay`, `span`, `a`, `.hint`; hatalıyken `02-form.css`).

**Çizen:** [15-aktarim](../../js/parcalar/15-aktarim.md) (`.tur-sec`, `.rapor-tablo`, `.durum`), `.tur-sec` ve
`.rapor-tablo` ayrıca [18-devamsizlik](../../js/parcalar/18-devamsizlik.md), `.rapor-tablo` [17-takvim](../../js/parcalar/17-takvim.md);
`.ozel-rozet` [08b-rolsuz](../../js/parcalar/08b-rolsuz.md); `.giris-alt`, `.kvkk-alan` `public/index.html` ve
[04a-form-alanlari](../../js/parcalar/04a-form-alanlari.md). **Kim görür:** aktarımı müdür ve `aktarim.yap` yetkili
öğretmen; giriş formu ve KVKK kutusunu ziyaretçi; özel okul rozetini sistem yöneticisi.

### 19-mesajlar.css

**Ne biçimler:**

- Sekmeler (bütün uygulamanın ortak sekmesi): `.sekme-satir`, `.sekme` (hap; `.secili` marka zemini, `.kucuk`),
  `.sekme-rozet` (kırmızı sayı; seçili sekmede yarı saydam beyaz).
- Mesaj listesi: `.mesaj-satir` (`.yeni` sarımsı; solda avatar), `.mesaj-govde-kutu`, `.mesaj-avatar`, `.mesaj-kimden`,
  `.mesaj-ust`, `.mesaj-kim`, `.mesaj-tarih`, `.mesaj-konu`, `.mesaj-onizleme` (tek satır, üç nokta), `.duyuru-rozet`,
  `.cocuk-not`.
- Okuma: `.mesaj-govde` (`pre-wrap`), `.mesaj-detay-ust`, `.mesaj-alicilar` (`.okuma-bolum`), `.alici-satir` (`.okudu`,
  `.okumadi`).
- Okundu bilgisi (gönderen görür): `.okuma-rozet` (`.tam` yeşil), `.okuma-ozet`, `.okuma-roller`, `.okuma-rol` (`.secili`),
  `.okuma-arac`, `.okuma-liste`.
- Alıcı seçimi: `.secim-kutu` (kayan liste), `.onay.pasif` (seçilemeyen alıcı soluk).

**Çizen:** [19-mesajlar](../../js/parcalar/19-mesajlar.md); `.secim-kutu` ayrıca [19b-anketler](../../js/parcalar/19b-anketler.md)
ve [19c-okul-hayati](../../js/parcalar/19c-okul-hayati.md); `.sekme` 12, 13, 14c, 15, 19, 19b, 19i, 27, 27b, 28 parçalarında.
**Kim görür:** herkes (mesaj kutusu).

### 20-devamsizlik.css

**Ne biçimler:** yoklama satırı `.yoklama-satir`, `.durum-secim`, `.durum-dugme` (hap; `.secili` iken `.var` yeşil, `.yok`
kırmızı, `.gec` turuncu, `.izinli` mavi zemin), `.durum-etiket` (`.yok`, `.gec`, `.izinli`, `.var`), `.tarih-kutu` (düz
tarih kutusu; aşağıdaki çakışmaya bak), `.satir.tiklanir` (tıklanır satır; yorumu "ana sayfadaki duyuru satırları" diyor,
bugün yalnız `17-takvim.js` kullanıyor). Etüt: `.etut-tarih`, `.etut-tarih-yazi`, `.ters` (oku yatayda çevirir),
`.durum-grup`, `.etut-ogrenci-liste` (en çok ekranın %46'sı); 560 px altında `.etut-yoklama-satir` alt alta.

**Çizen:** [18-devamsizlik](../../js/parcalar/18-devamsizlik.md), [18b-etut](../../js/parcalar/18b-etut.md),
`.durum-etiket` [27-veli-panel](../../js/parcalar/27-veli-panel.md), `.tarih-kutu` ve `.satir.tiklanir`
[17-takvim](../../js/parcalar/17-takvim.md). **Kim görür:** yoklama alan öğretmen ve müdür; öğrenci ve veli dökümde.

### 21-takvim.css

**Ne biçimler:** `.takvim-ust`, `.takvim-baslik`, `.takvim-izgara` (7 sütun), `.takvim-gun-basligi` (`.haftasonu`
kırmızı), `.takvim-hucre` (`.bos`, `.haftasonu`, `.tatil`, `.bugun` 2 px çerçeve, `.secili`; `.gun-no`, `.gun-ders`,
`.gun-etiket`), `.gun-isaretler`, `.isaret` (7 px nokta: `.odev` turuncu, `.tatil` kırmızı, `.ozel` mavi, `.etkinlik`
yeşil, `.sinav` kırmızı, `.toplanti` mor), `.takvim-lejant`, `.gun-olaylar`, `.olay-satir` (`.tatil`, `.ozel`, `.sinav`,
`.etkinlik`) ve `.olay-tur`, `.alt-baslik` (küçük büyük harf ara başlık; pencere içinde `27-harita-ortak.css` küçültür).
720 px altında hücreler küçülür, etiket ve ders sayısı gizlenir. Toplantı (takvime eklenen olayın dört türünden biri:
`tatil`, `etkinlik`, `sinav`, `toplanti`; [../../../sunucu/bolumler/takvim.md](../../../sunucu/bolumler/takvim.md))
gün hücresinde mor nokta alır, ama `17-takvim.js`'in lejantında yok ve `.olay-satir.toplanti` için renk kuralı
yazılmadığından günün listesinde türü gri (varsayılan `.olay-tur`) görünür.

**Çizen:** [17-takvim](../../js/parcalar/17-takvim.md); `.alt-baslik` ayrıca 10b, 18b, 19g, 09-yonetici, 09d.
**Kim görür:** öğrenci, veli, öğretmen, müdür, servisçi.

### 22-cesitli.css

Başlık yorumu yalnız ilk beş konuyu sayar; dosya sonradan büyüdü. İçindekiler:

- Excel aktarım adımları: `.adim`, `.adim-no` — [15-aktarim](../../js/parcalar/15-aktarim.md).
- Sayfa içi arama kutusu `.ara-kutu` — [10-mudur](../../js/parcalar/10-mudur.md), 19-mesajlar, 19b-anketler, 19c-okul-hayati.
- Ders ağacı (klasör görünümü): `.ders-dal`, `.dal-basi` (`.acik`), `.dal-ok`, `.dal-ad`, `.dal-alt`, `.dal-sayi`,
  `.dal-icerik`, `.dal-grup`, `.dal-grup-baslik`, `.dal-bos`; 620 px altı sarar — [11-ogretmen-odev](../../js/parcalar/11-ogretmen-odev.md).
- Gün gün devamsızlık: `.ders-satir`, `.ders-sira`, `.durum-kutu` (açılır liste) — [18-devamsizlik](../../js/parcalar/18-devamsizlik.md).
- Eğitim yılı şeridi: `.yil-seridi` (`.arsiv` turuncu), `.yil-etiket`, `.yil-not` — [16-egitim-yili](../../js/parcalar/16-egitim-yili.md).
- `.soluk-satir` (gizlenen yorum, süresi dolmuş ek gibi pasif satır) — 04d-ekler, 19h-hatirlaticilar, 09-yonetici.
- Özellik anahtarı: `.ozellik-satir`, `.anahtar` (içindeki gerçek onay kutusu şeffaf ama klavye ve ekran okuyucu onu
  kullanır), `.anahtar-iz` (açıkken yeşil), `.oz-durum` — [16c-ozellikler](../../js/parcalar/16c-ozellikler.md).
- Öğretmenin ek penceresi: `.teslim-ogeler`, `.teslim-oge-kap`, `.teslim-oge` (`.video`, `.ses`, `.resim`), `.teslim-oge-ikon`,
  `.teslim-oge-ad` (iki satırda kesilir), `.teslim-oge-boyut`, `.teslim-oge-silinme`, `.kucuk-baglanti`; medya kutusu
  `.medya-kap` (sabit `min(62vh, 560px)` yükseklik: dosya yüklenince pencere büyüyüp kaymasın; `.ses` iken otomatik),
  `.medya-oge` — [14b-odev-teslim](../../js/parcalar/14b-odev-teslim.md).
- Ödev serisi şeridi (öğrenci): `.seri-serit` (`.uyari`, `.bozuk`), `.seri-ikon`, `.seri-sayi`, `.seri-yazi` —
  [14-odev-filtre](../../js/parcalar/14-odev-filtre.md).
- Ders programından yoklama (telefonda tek elle): `.yoklama-al`, `.py-ust`, `.py-liste`, `.py-satir`, `.py-ad`, `.py-secim`
  (üç eşit sütun), `.py-dugme` (48 px; `.var`, `.izinli`, `.yok` + `.secili`) — [22-programim](../../js/parcalar/22-programim.md).
- Hatırlatıcı seçimi: `.secim-dugmeler`, `.secim-dugme` (içinde gerçek radyo/onay kutusu, 44 px hap), `.etiket-baslik`,
  `.hatirlatici-ikon` — [19h-hatirlaticilar](../../js/parcalar/19h-hatirlaticilar.md), 19c-okul-hayati.
- Sınıflarım: `#snfOgrenciler` (`.snf-bekliyor` iken soluk ve tıklanmaz), `.snf-kartlar`, `.snf-kart` (`.secili`), `.snf-ad`,
  `.snf-alt`, `.snf-ogrenci`, `.snf-ok`, `.snf-kisi`, `.snf-ozet`, `.snf-sinav`, `.snf-ort` —
  [11b-siniflarim](../../js/parcalar/11b-siniflarim.md).

**Kim görür:** maddeye göre değişir; her maddenin bağlandığı JS belgesinin "Rol" satırında yazar (ör. özellik anahtarı
yalnız müdür, ödev serisi öğrenci, Sınıflarım öğretmen, hatırlatıcı herkes).

### 23-hareket.css

**Ne biçimler:** canlandırmaların çoğu burada tanımlı (`@keyframes` bütün pakette geçerli olduğu için önceki dosyalar da
kullanır):

- `.page-inner > *` her sayfa açılışında `belir` ile sırayla belirir (her blok 40 ms sonra; 7. ve sonrası 240 ms).
  `yaz()` içeriği yeniden kurduğu için her sayfa geçişinde tekrarlanır. `belir` giriş kartında da kullanılır.
- `perde` (solarak gelme) ve `pencere` (12 px aşağıdan, `.985` ölçekten süzülme): `.perde`, `.modal`, `.panel`.
- Sık dokunulan parçalara yumuşak geçiş: `.satir`, `.etiket`, `.iconbtn`, `.tabs button`, `.durum-dugme`, `.sekme`,
  `.hucre`, `.gun-nokta`, `.tur-sec`, `.durum-kutu`, `.agac-satir` (bunlardan `.hucre` ve `.agac-satir` bugün çizilmiyor).
- `.satir:hover` her liste satırına `--ana-acik` zemin verir.
- `.kutucuklar .kutucuk` `kutu` ile hafif büyüyerek gelir (50 ms arayla).
- "Hareketi azalt"ta yukarıdakilerin hepsi kapanır; `.kart`, `.kutucuk`, `.btn`, `.navlink` hover yükselmesi de.

Canlandırma tanımlayan başka dosyalar: `03-iskelet.css` (`donme`), `08-menu-filtre.css` (`menuBelir`), `16-giris-sekme.css`
(`formCik`, `formGel`), `25-grafik-sinav.css` (`sutunBuyu`, `cizgiCiz`, `yerTutucu`), `27-harita-ortak.css`
(`harita-dalga`, `canli`); hepsinin "hareketi azalt" karşılığı var. **Kim görür:** herkes.

### 24-veli.css

**Ne biçimler:** veli panelinin küçük parçaları: `.cocuk-rozet` (satır başında "kimin"; en az 74 px ki farklı uzunluktaki
adlar hizalı dursun), `.cocuk-seridi` ("Hepsi · Zeynep · Burak" seçme şeridi), `.alt-sayim` (devamsızlık özetinde üç
büyük rakam).

**Çizen:** [27-veli-panel](../../js/parcalar/27-veli-panel.md); `.cocuk-seridi` ayrıca [19i-servis-yoklama](../../js/parcalar/19i-servis-yoklama.md)
ve [27b-aile](../../js/parcalar/27b-aile.md). **Kim görür:** veli; "Velisi olduğum" bölümü olan öğretmen ve müdür.

### 25-grafik-sinav.css

**Ne biçimler:**

- SVG grafik: `.svg-grafik` ve içindeki `.izgara`, `.eksen-yazi` (`.soluk`, `.kucuk` — telefonda yan yana sütun adları
  birbirine değmesin), `.deger-yazi`, `.sutun` (`.yapti`, `.gec`, `.eksik`, `.yapmadi`, `.izinli`, `.gelmedi`,
  `.belirsiz`), `.sutun-grup`, `.cizgi`, `.nokta`, `.bant`, `.bant-ort`, `.bant-tek`. Sütunlar aşağıdan büyür
  (`sutunBuyu`), çizgi kendini çizer (`cizgiCiz`) — yalnız `prefers-reduced-motion: no-preference` iken. Lejant ekleri
  `.gosterge i.g-cizgi`, `.g-bant`, `.g-ort`.
- Ödev grafiği kartı: `.grafik-bas`, `.odev-grafik[data-gorunum="sonuc"]` / `"ders"` (ilgisiz görünümü gizler),
  `body.odev-grafik-kapali` iken `.g-govde` gizli, `.gizle-dugme` (`.goster-yazi` / `.gizle-yazi`), `.sutun-yigin i.gec`,
  `.odev-sutun` (çizilene kadar 250 px yer ayırır).
- Sınav grafiği: `.sinav-grafik .yer-tutucu` (veri gelene kadar 300 px kayan ışık; sayfa kaymaz), `.sg-araclar`, `.sg-alt`,
  `.sg-sablon-ad`, `.sg-cizim`, `.sg-bos`, `table.t td.sayi` / `th.sayi` (sağa yaslı; `.ana` kalın kırmızı).
- Sınav değer tablosu: `.deger-tablo` (`th small`, `th.ana`, `tr.gizli`, `td.sinif-hucre`; ilk sütun yatay kaydırmada
  yapışık), `table.t input.deger` (`.degisti` mavi, `.hatali` kırmızı), `.sinav-ust`, `.olcum-cipleri`, `.olcum-cip`
  (`.ana`), `.sinav-alt` (altta yapışık kaydet çubuğu).
- Ölçüm düzenleyici: `.olcum-liste`, `.olcum-satir`, `.olcum-baslik` (beş sütunlu ızgara; 520 px altında dört, `.o-ana`,
  `.o-sil`); şablonlar `.sablon-kart`, `.hazir-sablon` (kesik çerçeve).
- Açılmamış ödev: `.satir.acilmadi` (turuncu zemin, adın önünde turuncu nokta; içindeki turuncu etiket kart zemini alır ki
  kaybolmasın), `.satir.odev-satir` (aynı iç boşluk), `.satir.tikla-odev`, `.acilma-yazi` (`.acilmadi`), `.odev-aciklama`.
- Öğrencinin yıldızı `.yildiz-btn` (40 px; `.on` sarı dolgu, `:disabled` bekler).
- Ödev kontrolü: `.odev-bas` (`.odev-ad`, `.odev-konu`, `.odev-meta`), `.ok-ust`, `.ok-satir`, `.ok-sira`, `.sonuc-kutu`
  (açılır liste; `data-deger` `yapti` / `gec` / `eksik` / `yapmadi` / `izinli` / `gelmedi` rengine boyanır; 520 px altında
  adın altına iner), `.ok-sayim` (boşken gizli).

**Çizen:** [28-grafik](../../js/parcalar/28-grafik.md) (SVG, sınav grafiği), [13-ogrenci-veli](../../js/parcalar/13-ogrenci-veli.md)
(ödev grafiği, gizle düğmesi), [12-ogretmen-sinav](../../js/parcalar/12-ogretmen-sinav.md) (değer tablosu, ölçümler,
şablonlar), [11-ogretmen-odev](../../js/parcalar/11-ogretmen-odev.md) (kontrol ekranı), [14-odev-filtre](../../js/parcalar/14-odev-filtre.md)
(yıldız, açılmamış ödev), [27-veli-panel](../../js/parcalar/27-veli-panel.md), [14b-odev-teslim](../../js/parcalar/14b-odev-teslim.md).
**Kim görür:** grafikleri, yıldızı ve açılmamış ödev vurgusunu öğrenci ve veli; sınav tablosunu, ölçümleri ve ödev
kontrolünü öğretmen ve müdür.

### 26-anket-okul-hayati.css

**Ne biçimler:**

- Anket: `.anket-ust`, `.anket-soru`, `.anket-aciklama`, `.anket-secenekler`, `.anket-secenek` (`.secili`, `:disabled`),
  `.anket-isaret`, `.anket-alt`, `.anket-sonuclar`, `.anket-sonuc-ust`, `.anket-sonuc` (`.benim` çubuğu yeşil) — [19b-anketler](../../js/parcalar/19b-anketler.md).
- Yemek listesi: `.hafta-gezgin` (520 px altında `.genis` yazı gizli), `.yemek-hafta`, `.yemek-gun` (`.bugun`),
  `.yemek-gun-ust`, `.yemek-duzen` — [19c-okul-hayati](../../js/parcalar/19c-okul-hayati.md).
- Servis kartı: `.servis-kart h3`, `.bilgi-satir` (solda 90 px etiket), `.servis-yonetim`, `.satir.alt-satir` — 19c-okul-hayati.
- Ödev teslim dosyaları: `.teslim-bolum`, `.teslim-dosya`, `#teslimYuklemeler` (tek `minmax(0, 1fr)` sütun: uzun dosya
  adı üç noktayla kısalır, telefonda satır taşmaz), `.yukleme-satir` (`.hata`), `.yukleme-ust` (`b`, `.yuzde`,
  `.kucultme` "8,4 MB → 620 KB", boşken gizli), `.teslim-rozet` — [14b-odev-teslim](../../js/parcalar/14b-odev-teslim.md).
- Kulüpler: `.kulup-dugmeler` (boşken gizli) — 19c-okul-hayati.

**Kim görür:** anketi hedefteki öğrenci, veli, öğretmen ve müdür; yemek listesini öğrenci, veli, öğretmen, müdür; servis
kartını servisi olan öğrenci, veli ve okul yönetimi; teslim dosyalarını öğrenci (yükler), veli, ödevi veren öğretmen ve müdür.

### 27-harita-ortak.css

**Ne biçimler:**

- Küçük ortak parçalar: `.soluk` (soluk yazı), `.hata-yazi`, `.dugme-satir` (sarılan düğme satırı; içindeki `.btn` ikonlu),
  `.onay-satiri` (uzun metinli onay kutusu satırı), `.salt-okunur` (kesik çerçeveli, eş aralıklı değer), `.ayrac-cizgi`,
  `.modal .alt-baslik`, `.sifre-satir`, `.kayit-kimler`, okul adresi girişi `.adres-girdi` (solda sabit
  "`<sitenin adresi>/school/`" yazısı, sağda kutu; `:focus-within` halkası), `.adres-goster`.
- Harita (kendi döşeme haritası, kütüphane yok): `.harita-kap` (340 px; 600 px altında 280), `.harita` (`touch-action: none`,
  tutup sürükleme imleci, klavye odağında iç çerçeve), `.harita-doseme img` (256 px döşeme; koyu temada filtre),
  `.harita-isaret`, `.harita-nokta` (`.okul`, `.ev`, `.servis` büyük ve dalgalı, `.secim`, `.ben` ortalı), `.harita-igne`
  (renk `--igne`, alttaki kuyruk `::before`), `.harita-etiket`, `.harita-dugmeler`, `.harita-dugme`, `.harita-atif`
  (OpenStreetMap atfı), `.harita-bilgi`, `.harita-durum` (`.canli`), `.canli-nokta` (`canli` halkası),
  `.harita-secim-bilgi`.
- Servisçi sefer durumu `.sefer-durum` (`.canli`, boşken gizli), `.bildirim-oneri .ad .ikon`, `.kart > h3 > .ikon:first-child`.

**Çizen:** [19d-harita](../../js/parcalar/19d-harita.md) (harita bileşeni), [19e-servis-konum](../../js/parcalar/19e-servis-konum.md)
(durum, seçim bilgisi, sefer), [19i-servis-yoklama](../../js/parcalar/19i-servis-yoklama.md), [16b-okul-ayarlari](../../js/parcalar/16b-okul-ayarlari.md)
(okul konumu, adres), [27b-aile](../../js/parcalar/27b-aile.md); ortak parçalar 10b-hesaplar (`.sifre-satir`, `.onay-satiri`,
`.ayrac-cizgi`), 23-veli-ayarlar (`.salt-okunur`), 26-baslat (`.onay-satiri`), [09-yonetici](../../js/yonetim/09-yonetici.md)
ve [09b-site-ayarlari](../../js/yonetim/09b-site-ayarlari.md) (`.adres-girdi`, `.ayrac-cizgi`), `.kayit-kimler`
`public/index.html`. **Kim görür:** haritayı servisi olan öğrenci ve veli, servis yönetimi, okul konumunu ayarlayan müdür,
"Çocuğumun telefonu"nda veli; sefer durumunu servisçi; ortak parçaları herkes.

### 28-yetiskin-hesap.css

**Ne biçimler:**

- Kayan sekme: `.kayan-sekme`, `.kayan-isaret` (seçili düğmenin zemini ayrı bir parça; `05-giris.js` `kayanGuncelle`
  seçili düğmenin sırasını `--sira` olarak yazar, parça `translateX(--sira × 100%)` ile oraya kayar). Genişliği
  `calc((100% - 8px) / 2)`: iki düğme varsayar (bugün iki yerde, ikisi de iki düğmeli). `.kimlik-sec` ("Kullanıcı adı |
  E-posta", bir boy küçük), `#gKimlikIpucu:empty`.
- El çizimleri (`02b-cizimler.js`): `.cizim` ve `.c-cizgi`, `.c-vurgu`, `.c-dolgu`, `.c-vurgu-dolgu`, `.c-sari-dolgu`,
  `.c-tahta`, `.c-tebesir`, `.c-yaprak`; `.vitrin-kim-cizim` (açılış).
- Portallar: sol menüde `.navlink.portal-link` (`.on`, `.kapali`), `.portal-yazi`, `.portal-rol`, `.portal-alt`,
  `.navlink.portal-ekle`; yetişkin hesabının ana sayfası `.portal-kartlar`, `.portal-kart` (`.kapali`, `.ekle`),
  `.portal-kart-rol`, `.portal-kart-alt`, `.portal-kart-okul`, `.portal-kart-arti`; portalı olmayan için `.portal-bos`,
  `.portal-bos-cizim`, `.btn.portal-bos-dugme`; Ayarlar'daki "Portallarım" kartı `.kart-ust-satir`, `.portal-satir`,
  `.portal-islem`.
- Üstteki "+ Ekle": `.iconbtn.ekle-dugme`, `#btnEkle[hidden]`. Ekle penceresi: `.ekle-secenek` (üç sütun; 640 px altında
  tek ve yatay kutular), `.ekle-kutu`, `.ekle-ad`, `.ekle-alt`, `.ekle-panel`, `.ekle-panel-cizim`, `.ekle-iletisim`,
  `.ekle-iletisim-baslik`, `.ekle-iletisim-bag`.
- Kişi kodu: `.kisi-kodu` (eş aralıklı, kesik çerçeve, tek tıkla seçilir; `.satir-ici` çerçevesiz), `.kisi-kodu-satir`
  (`.buyuk` iken 25 px ortalı; 480 px altında 20, 360 px altında 17 px — 16 karakter + 3 tire = 19 karakter tek satıra
  sığsın), `.kisi-kodu-dugmeler`, `.kisi-kodu-girdi`.
- Ayarlar'da açılış sayfasına yorum: `.yildiz-sec`, `.yildiz-sec-btn` (44 px; `.dolu`, `.secili`).

**Çizen:** `public/index.html` (kayan sekmeler, `#btnEkle`, `.vitrin-kim-cizim`), [05-giris](../../js/parcalar/05-giris.md)
(`kayanGuncelle`, `kisiKoduKutusu`), [02b-cizimler](../../js/parcalar/02b-cizimler.md), [08c-kisilikler](../../js/parcalar/08c-kisilikler.md)
(portallar, Ekle), [06-menu](../../js/parcalar/06-menu.md) (`#btnEkle`), kişi kodu ayrıca 10-mudur, 10b-hesaplar,
15-aktarim; [23-veli-ayarlar](../../js/parcalar/23-veli-ayarlar.md) (yıldız seçimi). **Kim görür:** girişsiz ziyaretçi
(kayan sekme, çizimler), yetişkin hesabı (veli, öğretmen, müdür adayı), herkes (kişi kodu, Ayarlar).

### 29-dis-sayfalar.css

**Ne biçimler:** giriş yapmamış ziyaretçinin bütün sayfaları (yönlendirmesi `05a-dis-sayfalar.js`).

- Sarmal: `.dis` (en az ekran boyu, `overflow-x: clip`); `.dis .auth-wrap::before` giriş, kayıt ve okul sayfasında kartın
  arkasına açılıştaki renk bandının 300 px'lik üst şeridini çizer (kareli doku, alt kenarı eğik kesik).
- Üst şerit: `.site-ust` (yapışkan, `z-index: 20`), `.site-ust-ic` (en çok 1120 px), `.site-marka`, `.site-hesap`,
  `.site-menu` (`a[aria-current="page"]`), `.site-yapimci`, `.site-tema` (ay/güneş), `.site-uygulama` (Android uygulamasını
  indir; 640 px altında yazısı yalnız ekran okuyucuya), yapımcılar listesi `.yapimci-kutu`, `.yapimci-liste` (`z-index: 30`),
  `.yapimci-satirlar`, `.yapimci-satir`, `.yapimci-ad`, `.yapimci-depo`, `.gh` (GitHub ikonu).
- Açılış: `.vitrin` (1120 px sütun), `.v-bas` (renk bandı ekranı boydan boya kaplar: `margin-inline: calc(50% - 50vw)`;
  kareli doku, `clip-path` ile eğik alt kenar), `.v-etiket`, `.v-bas h1` / `.hakkinda h1` (`clamp(34px, 5vw, 56px)`),
  `.v-vurgu` (sarı fosforlu kalem altı), `.v-alt`, `.v-dugmeler`, `.v-btn-ana`, `.v-btn-cizgi`, `.v-gorsel` (yerel açık
  palet, `-1.5deg` eğik), `.v-sahne`; `.v-sayilar` (bandın alt kenarına −78 px binen üç rakam), `.v-ozellikler` (4 → 2 → 1
  sütun; `.v-oz-ikon` rengi `nth-child(4n + …)` ile döner), `.v-baslangic` (sıralı dört adım, `counter(adim)`),
  `.v-baslangic-sss`, `.vitrin-kimler` / `.vitrin-kim`.
- Yorumlar: `.v-yorumlar`, `.v-yorum-ust`, `.v-yorum-ozet`, `.v-yorum-liste` (3 → 1 sütun), `.v-yorum` (`blockquote`,
  `figcaption`), `.v-yorum-not`, `.v-yorum-bos`, `.yildizlar`, `.yildiz` (`.dolu`).
- Hakkında: `.hakkinda`, `.hakkinda-bolumler`, `.hakkinda-yapimcilar`, `.hakkinda-iletisim`, `.site-iletisim-bag`,
  `.hakkinda .v-sayilar` (bant yok, kart yerinde durur).
- SSS: `.sss-grup`, `.sss details` / `summary` (sağda `+` / `−` yuvarlak).
- Giriş kartının çevresi: `.auth-okul` (okulun sayfasında okul adı kutusu: `.auth-okul-ad`, `.auth-okul-yer`), `.giris-alt`;
  `/login` okul arama `.okul-sec`, `.vitrin-ara`, `.vitrin-sonuc`, `.vitrin-sonuc-bilgi` (`.hata`), `.vitrin-liste`,
  `.vitrin-okul` (`-ad` ve `mark`, `-yer`), `.vitrin-son-okul`, `.vitrin-son-git`.
- Alt bilgi: `.site-alt`, `.site-alt-ic` (üç sütun; 860 px altında tek ve ortalı), `.site-alt-marka`, `.site-github`,
  `.site-alt-menu`, `.site-iletisim` (boşken gizli).
- Kırılmalar: 960, 860, 640 (yalnız "Uygulamayı indir" yazısı), 560, 520 px.

**Çizen:** `public/index.html` ve [05a-dis-sayfalar](../../js/parcalar/05a-dis-sayfalar.md); üst şerit ve alt bilgi
`public/404.html`, `public/okul-bulunamadi.html`, `public/kvkk/kvkk.html`, `public/kosullar/kosullar.html`,
`public/indir/indir.html`'de de aynı sınıflarla durur. **Kim görür:** girişsiz ziyaretçi.

### 30-dokunmatik.css

**Ne biçimler:** yalnız `@media (pointer: coarse)` (parmakla kullanılan ekran). Her düğme en az 44 px (`.btn`; `.btn.kucuk`
40 px), `.iconbtn` 44×44, `.navlink` 46, `.baglanti` ve `.sekme` 40, `.durum-dugme` 40×44, `.tabs button` ve
`.kimlik-sec button` 44; `input`, `select`, `textarea` (ve `.field`, `.filtre-satir .field` içindekiler) 16 px — iPhone
16 px'ten küçük kutuya odaklanınca sayfayı büyütür; onay kutuları 22 px, `.onay` / `.onay-satiri` 40 px; yan yana düğmeler
arasında 10 px (`.satir`, `.dugme-satir`, `.kisilik-islem`, `.modal-alt`); `.footer a` 40 px; hover'da yükselme kapalı
(telefonda "ilk dokunuşta kıpırdayıp ikincide basılma" hissi veriyordu). `.kisilik-islem` bugün çizilmiyor.

Başlık yorumu "bilerek en son dosya" diyor; artık değil (bkz. Dikkat!). **Kim görür:** telefon ve tablette herkes.

### 31-okul-sayfasi.css

**Ne biçimler:** okulun giriş adresinde (`/school/<okul>`) kartın üstündeki tanıtım sayfası ve onu düzenleme ekranı.

- Kutu: `.okul-sayfa` (en çok 860 px geniş, **en çok 1600 px uzun**, `overflow: hidden`, `contain: layout paint`,
  `isolation: isolate`: içindeki hiçbir şey dışarıya, giriş kartının üstüne çizilemez), `[hidden]`, `.genislik-dar` (460 px;
  JS `genislik-dar` / `genislik-genis` yazar, `genis` için ayrı kural yok).
- İçerik: `.os-kutu` (`--os-renk`, `--os-zemin`, `--os-yazi`, `--os-sutun`; varsayılanları `--ana`, `--kart`, `--yazi`, 3),
  `.os-kapak` (`data-kapak` `kisa` 130 / varsayılan 200 / `uzun` 300 px), `.os-ust` (`data-hiza="orta"` ortalı), `.os-logo`
  (kapak varsa −46 px biner), `.os-baslik` (`data-baslik` `kucuk` 22 / 28 / `buyuk` 36 px), `.os-yer`, `.os-tanitim`,
  `.os-galeri` (`repeat(var(--os-sutun), …)`; 560 px altında 2), `.os-foto` (4:3).
- Giriş sayfasında: `.auth-wrap.okul-sayfali` (sayfa ve kart alt alta).
- Düzenleme: `.os-duzen` (iki sütun; 1100 px altında tek), `.os-onizleme-kap` (yapışık, `top: 78px`), `.os-renk-satir`
  (`input[type="color"]` 48×44), `.os-renk-durum`, `.os-foto-satir`, `.os-kucuk` (`.bos`), `.os-css` (`details`; `+` / `−`),
  `.os-parcalar`, `.os-css-kutu`, `.os-uyarilar`, `.os-kaydet`, `#osMesaj`.

Okulun kendi yazdığı CSS buraya girmez: `19g-okul-sayfasi.js` onu `<head>`'e eklediği `<style id="okulSayfaStil">`'e
yazar; içerik sunucuda [css-temizle](../../../sunucu/yardimci/css-temizle.md)'den geçmiştir, yalnız `.os-kutu`, `.os-kapak`,
`.os-ust`, `.os-logo`, `.os-baslik`, `.os-yer`, `.os-tanitim`, `.os-galeri`, `.os-foto` seçilebilir ve her kural
`.okul-sayfa ` önekiyle bağlanır ([../../../sunucu/bolumler/okul-sayfasi.md](../../../sunucu/bolumler/okul-sayfasi.md)).

**Çizen:** [19g-okul-sayfasi](../../js/parcalar/19g-okul-sayfasi.md), kap `public/index.html`'deki `#okulSayfa`.
**Kim görür:** okulun adresine giren herkes (girişsiz); düzenleme müdür ve `okul.sayfa` yetkili öğretmen.

### 32-tarih-secici.css

**Ne biçimler:** ödev başlama/son tarihinin açılır takvimi (`04e-tarih-secici.js`). `.tarih-alan`, `.tarih-dugme`
(`aria-expanded="true"` iken halka; `.tarih-simge`, `.tarih-gun`, `.tarih-bos`, `.tarih-yazi`), `.tarih-kutu` (açılır kutu:
`position: absolute`, 328 px, `z-index: 60`; `.saga` iken sağa yaslı; **560 px altında ekranın altından açılan sayfa**:
`position: fixed; bottom: 0`, güvenli alan boşluğu, en çok %88), `.tk-ust`, `.tk-ok`, `.tk-izgara` (26 px hafta numarası + 7
gün), `.tk-bas`, `.tk-hf`, `.tk-gun` (`.diger`, `.tatil`, `.bugun` turkuaz çerçeve, `.secili` turkuaz zemin, `.odak`,
`:disabled`; telefonda 44 px), `.tk-isaret` ve noktalar `.tarih-kutu i.tatil` / `.etkinlik` / `.odev`, `.tk-ajanda`,
`.tk-ajanda-satir`, `.tk-tur` (`.tatil`, `.etkinlik`, `.odev`), `.tk-alt` (`.tk-bugun`, `.tk-temizle`, `.tk-tamam`).
Ödev penceresinin `.odev-tarihler .saat-sec` (tarihin altındaki saat listesi), `.zorunlu` (etiketteki `*` işareti,
`--ana` renginde), `.gizli-etiket` (görünmez ama ekran okuyucunun okuduğu etiket). `.tk-anahtar` bugün çizilmiyor.

**Çizen:** [04e-tarih-secici](../../js/parcalar/04e-tarih-secici.md), [11-ogretmen-odev](../../js/parcalar/11-ogretmen-odev.md)
(`.odev-tarihler`, `.zorunlu` "Başlama tarihi *", "Son tarih *", `.gizli-etiket`), `.gizli-etiket` ayrıca
[09-yonetici](../../js/yonetim/09-yonetici.md). **Kim görür:** ödev veren öğretmen ve müdür.

### 33-aile.css

**Ne biçimler:** velinin "Çocuğumun telefonu" sayfası: `.aile-izgara` (iki sütun; 900 px altında tek), `.aile-kurulum ol`,
`.aile-cihazlar .satir`, `.aile-simge`, `.aile-konum-bilgi`, `.aile-dugmeler`, `.aile-toplam`, son 8 günün çubukları
`.aile-gunler` (8 sütun, 110 px), `.aile-gun`, `.aile-cubuk` (`.asti` sınırı aştı: kırmızı), uygulama başına süre
`.aile-uygulamalar`, `.aile-uyg-ust`, `.aile-bar` (`span.asti`), `.aile-ayar .onay`, `.aile-sinir`, `.aile-sinir-ekle`.

**Çizen:** [27b-aile](../../js/parcalar/27b-aile.md). **Kim görür:** veli.

### 34-servis-yoklama.css

**Ne biçimler:**

- Servisçinin Yoklama sayfası: `.sy-servisler`, `.sy-ust-baslik`, `.sy-ust .msg`, `.sy-sayilar`, `.sy-sefer`,
  `.sy-liste-ust`, `.sy-aciklama`; öğrenci satırı `.sy-satir` (ızgara: 30 px numara | ad | düğmeler; `.soluk` velisi
  "binmeyecek" dedi, `.bitti`), `.sy-no`, `.sy-bilgi`, `.sy-saat`, `.sy-veli` (turuncu not), `.sy-not` (mavi not), `.sy-yol`
  (yol tarifi bağlantısı), `.sy-hata`; büyük işaret düğmeleri `.sy-islem`, `.sy-dugmeler` (`.tek`), `.sy-dugme` (52 px;
  `.bindi` / `.geldi` / `.indi` + `.secili` yeşil, `.binmedi` / `.gelmedi` + `.secili` kırmızı), `.sy-alt`, `.sy-buyuk`,
  `.sy-notlar`, `.sy-not-metin`; "Sırayı düzenle" penceresi `.sy-sira-liste`, `.sy-sira-satir`, `.btn.sy-ok`,
  `.yon-yukari` / `.yon-asagi` (ok ikonu 90° döndürülür); yönetimin salt okunur penceresi `.sy-yonetim`.
- 640 px altı: düğmeler adın altında tam genişlik.
- `(pointer: coarse), (max-width: 640px)`: servis sayfalarındaki her dokunma hedefi en az 44 px (servisçi araç başında
  basar; `30-dokunmatik.css` küçük düğmeleri 40'ta bırakır); `.servis-kart a.servis-tel` satır yüksekliği değişmeden
  basılacak alanı büyütür.
- Veli/öğrencinin servis kartında "bugün": `.servis-kart` (`scroll-margin-top: 80px`: bildirimden gelince kart üst
  çubuğun altında kalmasın), `.servis-bugun`, `.servis-bugun-ust`, `.servis-bugun-baslik`, `.servis-bugun-satir`
  (`.soluk`), `.servis-not` (`.binmez` turuncu), `.harita-sira`.
- Yönetimin servis saatleri kartı: `.servis-saat-aciklama`, `.servis-saat-izgara`, `.servis-saat-grup` (`legend`),
  `.servis-saat-cift`, `.servis-saat-alan` (`input`), `#ssMesaj`.

**Çizen:** [19i-servis-yoklama](../../js/parcalar/19i-servis-yoklama.md), [19c-okul-hayati](../../js/parcalar/19c-okul-hayati.md)
(servis kartı, servis saatleri), [19e-servis-konum](../../js/parcalar/19e-servis-konum.md) (`.harita-sira`). **Kim görür:**
servisçi; okul yönetimi (müdür, `servis.yonet`); servisi olan öğrenci ve veli.

### 35-quiz.css

**Ne biçimler:** quizin bütün yüzü (`14c-quiz.js`).

- Listeler ve ekler: `.etiket.qz-etiket`, `.qz-liste-durum` (`.devam`, `.bitti`), `.ek-satir.qz-ek-satir` (ek listesinde
  quiz satırı), `.qz-ek-dugmeler`, `.qz-veli-kutu`, kontrol ekranındaki `.qz-rozet` (`.devam`, `.bitti`, `.cikti` turuncu
  halka; düğme olan rozetin üstüne gelince yazısının altı çizilir).
- Düzenleyici (ödev penceresinde; pencere `.modal.qz-genis` ile 760 px'e genişler): `.qz-alan`, `.qz-ekle`, `.qz-baslik`,
  `.qz-baslik-sayi`, `.qz-ayar` (`.hatali`), `.qz-cikinca-not`, `.qz-ayar-ad`, `.qz-cipler`, `.qz-cip` (içindeki radyo görünmez,
  `:focus-within` halkası; `.secili`), `.qz-dk`, `.qz-girdi` (`.field` dışındaki kutular), `.qz-sorular`, `.qz-soru-yok`,
  `.qz-soru` (`.hatali`), `.qz-soru-ust`, `.qz-no`, `.qz-sure-kutu`, `.qz-bosluk`, `.qz-soru-dugmeler`, `.qz-ikon-btn`
  (`.sil`), `textarea.qz-metin`, `.qz-dy`, `.qz-siklar`, `.qz-sik` (`.dogru` yeşil çerçeve), `.qz-sik-metin`, `.qz-dogru-kutu`,
  `.qz-sik-alt`, `.qz-alt`, `.qz-bilgi`, `.qz-bilgi-liste`, `.qz-kilit`, `.qz-harf` (A, B, C yuvarlağı).
- "Metinden ekle": `.qz-metin-panel`, `textarea.qz-yapistir` (eş aralıklı 13 px), `.qz-bicim` (yazım biçimi `details`),
  `.qz-metin-sonuc`, `.qz-metin-ozet`, `.qz-hata-sayi`, `.qz-metin-hatalar`, `.qz-metin-liste` (`li.dogru`), `.qz-metin-cevap`.
- Soru (çözme ve önizleme): `.qz-ust` (yapışık, `top: 70px`, 520 px altında 66; `.onizleme` iken yapışmaz), `.qz-ust-bilgi`,
  `.qz-ust-ad`, `.qz-ust-sira`, `.qz-kalan` (kalan süre; `.az` turuncu, `.cok-az` kırmızı), `.qz-cubuk` (rengi kardeş
  `.qz-kalan`'ın durumuna göre), `.qz-soru-kart` (`.kapali`), `.qz-soru-bas`, `.qz-tur-ad`, `.qz-soru-metin`, `.qz-bos-yazi`,
  `.qz-coklu-not`, `.qz-secenekler` (`.dy` yan yana), `.qz-secenek` (50 px; `.secili`, `.kapali`), `.qz-sec-metin`,
  `textarea.qz-cevap-metin` (`[readonly]`), `.qz-karakter`, `.qz-kayit` (`-tamam`, `-bekle`, `-hata`), `.qz-noktalar`,
  `.qz-nokta` (`.cevapli`, `.kapali` üstü çizili, `.simdiki`), `.qz-alt-dugmeler`, `.qz-onizle`.
- Öğrencinin başlangıç ve bitiş ekranı: `.qz-sayfa` (820 px), `.qz-sayfa-bas`, `.qz-sayfa-ad`, `.qz-sayfa-alt`, `.qz-kurallar`,
  `.qz-engel`, `.qz-geri`, `.qz-bitti-neden`, `.qz-cikis-not`, `.qz-puan`, `.qz-bitti`.
- Sonuçlar: `.qz-sonuc-liste`, `.qz-sonuc-soru` (`.dogru`, `.yanlis`, `.acik`; solda 5 px renkli kenar), `.qz-soru-bilgi`,
  `.qz-sonuc-siklar li` (`.dogru`, `.yanlis`), `.qz-isaret`, `.qz-acik-cevap` (`.cevapsiz`); öğretmenin öğrenci ayrıntısı
  `.qz-ayrinti`, `.qz-bilgiler` (`dt` / `dd`, `dd.qz-cikti`).
- 520 px ve altı: üst çubuk (`top: 66px`) ve kalan süre hapı küçülür, soru kartı ve düzenleyicinin soru kutusu sıkışır, alt
  düğmeler esner, şık satırı daralır, ek satırındaki quiz düğmeleri alta iner, `.qz-bilgiler` tek sütun olur.
- `(pointer: coarse)`: ikon düğmeleri ve soru numaraları 44×44, çipler, "Doğru" kutusu ve "Yazım biçimi" en az 44 px;
  `.qz-girdi`, `select.qz-girdi`, süre ve dakika kutuları 44 px ve 16 px yazı; kontrol ekranının `.qz-rozet`'i 40 px.
  Yorumu: "Bu dosya ondan [30-dokunmatik] sonra geldiği için burada." `textarea.qz-yapistir` da `.qz-girdi`'dir, ama kendi
  13 px'i (`textarea.qz-yapistir`, daha özgül) kazanır; `textarea.qz-cevap-metin` bu blokta hiç yok (bkz. Dikkat!).

**Çizen:** [14c-quiz](../../js/parcalar/14c-quiz.md); `.qz-ikon-btn` ayrıca [09b-site-ayarlari](../../js/yonetim/09b-site-ayarlari.md)
(yapımcı listesinde yukarı/aşağı/sil). **Kim görür:** öğretmen ve müdür (düzenleyici, rozetler, sonuçlar), öğrenci (çözme,
sonuç), veli (durum).

### 36-ayar-kartlari.css

**Ne biçimler:** ayar kartlarının küçük parçaları: `.kart-aciklama`, `.ayar-kart h3 .ikon`, `.kaynak-satir` (değerin nereden
geldiği), `.ayar-blok + .ayar-blok` (her biri kendi Kaydet'iyle), `.sayi-satir` (`.birim`; `.field .sayi-satir input` 104 px,
`select` kendi genişliğinde), sıralı liste `.sirali-liste`, `.sirali-satir` (numara | ad | bağlantı | açıklama | düğmeler;
760 px altında kutular alt alta), `.sirali-no`, `.sirali-dugmeler`. Dokunmatikte `.ayar-kart .btn.kucuk` ve
`.yonetim-gecis .btn.kucuk` 44 px. Okulun disk alanı: `.doluluk.okul-disk` (olağan hâli **yeşil**, çünkü ana renk kırmızı
"dolu" ile karışmasın; `.az-kaldi` %80'de turuncu, `.dolu` %95'te kırmızı — eşikleri `08d-okul-disk.js`
`okulDiskSinifi` koyar), `.disk-siniri` (kapalı kutular soluk), `.okul-disk-kart`, `.doluluk.sikisik` (okullar tablosu
hücresi, en az 150 px), `.okul-tablo td`, sistem geneli `.disk-ozet` (`dt` / `dd`).

**Çizen:** [09b-site-ayarlari](../../js/yonetim/09b-site-ayarlari.md), [09d-okul-disk](../../js/yonetim/09d-okul-disk.md),
[08d-okul-disk](../../js/parcalar/08d-okul-disk.md), [09-yonetici](../../js/yonetim/09-yonetici.md) (`.okul-tablo`,
`.yonetim-gecis`), [09c-yonetici-dosyasi](../../js/yonetim/09c-yonetici-dosyasi.md) (`.ayar-kart` başlık ikonları). **Kim görür:** sistem yöneticisi; müdür kendi okulunun doluluk kartını ana sayfasında görür.

### Ortak kalıplar

Yeni bir ekran yazarken önce bunlara bak; çoğu şey hazır.

- **Düğme** — `<button class="btn">` (marka), `.btn ghost` (soluk kırmızı, ikincil), `.btn gri` (nötr), `.btn tehlike`
  (silme), `.btn kucuk` (satır içi), `.btn full` (tam genişlik); bağlantı da olur (`a.btn`). İş sürerken `.bekliyor` ve
  `disabled`. Düğme satırı: pencerede `.modal-alt`, kartta `.dugme-satir`. Bağlantı gibi görünen düğme: `.baglanti`. Üst
  çubuk düğmesi: `.iconbtn`. Dokunmatikte hepsi en az 40–44 px (`30-dokunmatik.css`).
- **Kart** — `.kart` (+ `h3` başlık), tıklanırsa `.kart.tikla`; kart ızgarası `.grid.k2/.k3/.k4`; sayaç `.stat`; liste
  satırı `.satir` (`.buyu` esner, `.ad`, `.alt`); boş durum `bosKutu()` → `.bos`; başlık `hero()` → `.hero`; bölüm başlığı
  `h2.sb` / `h3.sb`.
- **Pencere** — `modalAc` (`03-mesaj-modal.js`) `.perde` > `.modal` kurar; başlık `h3`, gövde, altta `.modal-alt`. Geniş
  içerik için `.modal` yanına ek sınıf (ör. `.qz-genis`). Pencere kendi içinde kayar (en çok %88 yükseklik).
- **Form** — her alan `.field` içinde `label` + kutu (+ `.hint`); iki alan yan yana `.row2`; hata `alanHatasi` →
  `.field.hatali` + `.alan-hata`; genel ileti `.msg.hata/.iyi/.bilgi/.uyari`; onay kutusu `.onay` (kısa) ya da
  `.onay-satiri` (uzun metin), birden çoğu `.secenekler`.
- **Etiket ve rozet** — durum hapı `.etiket` (renkleri yukarıda), sayı `.rozet` (üst çubuk), `.sekme-rozet`,
  `.kutucuk-rozet`; devamsızlık `.durum-etiket`; aktarım `.durum`.
- **Seçim** — sekmeler `.sekme-satir` > `.sekme(.secili)`; iki seçenekli kayan sekme `.kayan-sekme`; çip/hap seçimi
  `.secim-dugme` (gerçek radyo/onay içinde), quizde `.qz-cip`; büyük seçenek kutusu `.tur-sec`.
- **Çubuk** — `.cubuk` (ince ilerleme), `.doluluk` (etiketli doluluk; `.az-kaldi`, `.dolu`).
- **Bekleme** — sayfa `.yukleniyor`; grafik `.yer-tutucu`; düğme `.bekliyor`; liste soluklaşma `.okul-sonuc.yukleniyor`,
  `#snfOgrenciler.snf-bekliyor`.
- **Durum sınıfı adları** (her yerde aynı anlam, hep başka bir sınıfla birlikte): `.on`, `.secili`, `.acik`, `.dolu`,
  `.bos`, `.hata` / `.hatali`, `.yeni`, `.bugun`, `.kapali`, `.soluk`.

### Kırılma noktaları

| Koşul | Dosyalar | Ne olur |
|---|---|---|
| `max-width: 1100px` | 31 | okul sayfası düzenleyicisi tek sütun, önizleme yapışmaz |
| `max-width: 960px` | 29 | açılıştaki özellik kartları 4 → 2 sütun |
| `max-width: 900px` | 33 | aile sayfası tek sütun |
| `max-width: 860px` / `min-width: 861px` | 07, 29 / 08 | **ana eşik**: sol menü ekran dışına (☰ ile açılır) ya da masaüstünde daraltılır; içerik boşluğu, ikon düğmeleri yazısız; açılış bandı ve alt bilgi tek sütun, başlangıç adımları 2 sütun, yorumlar tek sütun |
| `max-width: 760px` | 36 | sıralı liste satırı alt alta |
| `max-width: 720px` | 21 | takvim hücreleri küçülür, etiket ve ders sayısı gizlenir |
| `max-width: 640px` | 08, 11, 28, 29, 34 | filtre alanları tam genişlik, Ekle seçenekleri ve portal kartları tek sütun, "Uygulamayı indir" yazısı gizli, servisçi düğmeleri adın altında |
| `max-width: 620px` | 22 | ders ağacı satırı sarar |
| `max-width: 600px` | 27 | harita 340 → 280 px |
| `max-width: 560px` | 20, 22, 29, 31, 32 | etüt yoklama ve gün gün devamsızlık alt alta; üst şerit menüsü ikinci satıra; açılış rakamları küçülür; okul sayfası galerisi 2 sütun; **tarih seçici ekranın altından açılır** |
| `max-width: 520px` | 10, 14, 25, 26, 29, 35 | kutucuklar küçülür, ders sütunları tek, ölçüm satırı 4 sütun, sonuç kutusu adın altında, yemek listesi düzenleyicisi tek sütun ve hafta gezgininde uzun yazı gizli, başlangıç adımları tek sütun, quiz üst çubuğu ve soru kartı sıkışır |
| `max-width: 500px` | 07 | Ayarlar ve tema düğmesi gizli |
| `max-width: 480px` | 28 | büyük kişi kodu 20 px |
| `max-width: 420px` | 07 | giriş kartı boşluğu, `.grid.k3/.k4` iki sütun |
| `max-width: 360px` | 28 | büyük kişi kodu 17 px |
| `max-width: 359px` | 07 | Yenile düğmesi de gizli |
| `pointer: coarse` | 30, 34, 35, 36 | dokunma hedefleri 40–44 px, kutular 16 px |
| `prefers-reduced-motion: reduce` | 00, 03, 08, 10, 14, 16, 22, 23, 25, 27, 28 | süreler sıfır, canlandırmalar kapalı (`25` canlandırmayı tersinden yalnız `no-preference`'ta açar) |
| `prefers-color-scheme: dark` | 00, 12, 27 | koyu palet (`data-tema="acik"` değilse) |
| `print` | 07 | menü ve üst çubuk gizli; giriş kâğıtları düzeni |

860 px eşiği JavaScript'te de var: `24-bildirim-arama-mobil.js`'teki `masaustuMu()` `window.innerWidth > 860`'a bakar ve
☰'nin menüyü daraltacağını mı (masaüstü) açılır menü mü göstereceğini (telefon) buna göre seçer.

### Katmanlar (z-index)

| Değer | Öğe | Dosya |
|---|---|---|
| 60 | açılır pencere perdesi `.perde`; tarih seçici `.tarih-kutu` | 06, 32 |
| 50 | bildirim paneli `.panel` | 06 |
| 45 / 44 | telefonda açık sol menü / arkasındaki perde | 07 |
| 40 | uygulamanın üst çubuğu `.topbar` | 03 |
| 30 | yapımcılar listesi `.yapimci-liste` | 29 |
| 20 | girişsiz sayfaların üst şeridi `.site-ust` | 29 |
| 5 | quizin yapışık üst çubuğu `.qz-ust` | 35 |
| 2 / 1 | sınavın yapışık kaydet çubuğu `.sinav-alt` / değer tablosunun yapışık ilk sütunu | 25 |
| 1 / 0 / −1 | kayan sekmenin düğmeleri ve işareti; özellik anahtarının şeffaf kutusu; açılışın rakam kartı; giriş kartının arkasındaki bant | 28, 22, 29 |

### Kullanılmayan kurallar

Kod (`public/` altındaki bütün `.js` ve `.html`) taranarak bulundu; sınıfı dinamik kuran yerler (ör. `'kutucuk ' + renk`,
`'genislik-' + ayar`) ayrıca denetlendi. Bugün hiçbir ekranın çizmediği seçiciler:

- `11-haftalik-program-tablosu.css`'in tamamı (`table.program`, `.saat-sutun`, `.hucre*`, `.ders-secim`) ve ona bağlı
  `23-hareket.css`'teki `.hucre` geçişi.
- `.auth-logo` (`01-giris-kayit.css`, `12-ikonlar.css`), `.veli-kodu` (`00-temel.css`), `.rolsuz-kart` ve
  `details.rolsuz-kart` (`09-kayit-ekrani.css`), `.kutucuk.sari` (`10-ana-sayfa-kutucuklari.css`), `.mudur-notu`,
  `.ders-saat` (`13-tipografi.css`), `.ders-blok-*` (`17-odev-secim.css`), `.agac-satir` (`23-hareket.css`),
  `.kisilik-islem` (`30-dokunmatik.css`), `.tk-anahtar` (`32-tarih-secici.css`).
- Değişkenlerden `--camgobegi` hiçbir kuralda geçmiyor; `--kutu-sari` yalnız kullanılmayan `.kutucuk.sari`'de.

Silmek zararsızdır ama istenmediği için dokunulmadı (öneri; bkz. Son durum).

## Kimle konuşur?

- **Birleştiren ve sunan:** `sunucu/http.js` ([../../../sunucu/http.md](../../../sunucu/http.md)) — `BIRLESIK` tablosunda
  `public/css/style.css` ← bu klasör (`uzanti: '.css'`, başına ve sonuna bir şey eklenmez); `birlesikOku` okur, dizer,
  birleştirir; `statikOku` adres `/css/style.css` olunca birleşik dosyayı verir (klasör yoksa diskteki düz
  `style.css`'e düşer; bugün öyle bir dosya yok); `htmlSurumle` HTML'deki `"/css/style.css"`'i `?v=<ETag>` ile sürümler;
  `serveStatic` `/css/parcalar/...` adreslerini ve `.md` adreslerini bilinmeyen adresle aynı 404'le geri çevirir.
- **Yorum atıcı:** `sunucu/yardimci/kucult.js` `cssYorumSil` ([../../../sunucu/yardimci/kucult.md](../../../sunucu/yardimci/kucult.md));
  `EE_ACIK_KAYNAK=1` ortam değişkeniyle yorumlar ve parça işaretleri korunur.
- **Bağlayan sayfalar:** `public/index.html` (önce `tema.js`, sonra iki yazı tipi `preload`, sonra `style.css`), `public/404.html`,
  `public/okul-bulunamadi.html`, `public/kvkk/kvkk.html`, `public/kosullar/kosullar.html`, `public/indir/indir.html`.
  Depodaki `tasarim/onizleme.html` (tasarım önizlemesi) de `/css/style.css`'i bağlar; `public/` dışında olduğu için
  uygulamanın sunucusu onu sunmaz, uygulamaya girmez.
- **Önbellek:** `public/sw.js` ([../../sw.md](../../sw.md)) `/css/style.css`'i (sürümsüz adresle) ve dört yazı tipini
  kabuk listesinde çevrimdışı önbelleğe alır; strateji önce ağ.
- **Tema:** `public/js/tema.js` ([../../js/tema.md](../../js/tema.md)) `<html data-tema>`'yı yazar ve telefon adres çubuğunun
  rengini (`meta theme-color`) değiştirir; Ayarlar'daki Sistem/Açık/Koyu (`tema-sec`) ve üst çubuktaki ay/güneş
  (`tema-degis`) `25-tiklama.js`'te `temaAyarla`'yı çağırır ve seçimi `POST /api/profile { tema }` ile hesaba yazar
  ([../../../sunucu/bolumler/kayit.md](../../../sunucu/bolumler/kayit.md)); girişte hesaptaki tercih "Sistem" değilse ve
  tarayıcıdakinden farklıysa `26-baslat.js` onu uygular.
- **Çalışırken sınıf ya da değişken yazan JS:** `05-giris.js` (`--sira`), `02-ikonlar.js` (`--av`), `19g-okul-sayfasi.js`
  (`--os-*`, `data-kapak/hiza/baslik`, `genislik-*`, `<style id="okulSayfaStil">`), `24-bildirim-arama-mobil.js`
  (`.sidebar.acik`, `.sidebar-perde.acik`, `body.sidebar-kapali`), `07-yonlendirme.js` (`.iconbtn.donuyor`),
  `10a-giris-bilgisi.js` (`body.yazdiriliyor`), `13-ogrenci-veli.js` ve `28-grafik.js` (`body.odev-grafik-kapali`),
  `04d-ekler.js` (`.ek-alan.dolu`, `.ek-birak.uzerinde`), `08b-rolsuz.js` (`.okul-sonuc.yukleniyor`), `04e-tarih-secici.js`
  (`.tarih-kutu.saga`), çubuk genişlikleri satır içi `style="width:…%"`.
- **Parçaları çizen JS:** her parçanın bölümünde "Çizen" satırı; belgeleri `public/js/parcalar/*.md` ve
  `public/js/yonetim/*.md`.
- **Dış kaynaklar:** yazı tipleri `public/yazitipi/*.woff2` (`araclar/yazitipi-indir.js`); harita döşemeleri
  `tile.openstreetmap.org`'dan `<img>` olarak gelir (CSS onları yalnız boyar). Sunucunun güvenlik başlığı
  `style-src 'self' 'unsafe-inline'`, `font-src 'self' data:`, `img-src 'self' data: https://tile.openstreetmap.org`:
  dışarıdan stil ya da yazı tipi yüklenemez; satır içi `style=""` serbesttir.
- **Okul sayfasının CSS'i:** `sunucu/yardimci/css-temizle.js` ([../../../sunucu/yardimci/css-temizle.md](../../../sunucu/yardimci/css-temizle.md))
  `SAYFA_PARCALARI` listesindeki `os-*` adlarına bağlıdır.
- **Görsel tur:** `araclar/gezinti.js` ([../../../araclar/gezinti.md](../../../araclar/gezinti.md)) ekranları açık temada,
  koyu temada ve telefon boyunda fotoğraflar ve yüklenirken kaymayı (CLS) ölçer.

## Nasıl çalışır (adım adım)?

### Bir ziyaretin stili

```
tarayıcı ─► GET /            http.js: index.html'i okur, htmlSurumle:
                                "/css/style.css" ─► "/css/style.css?v=<ETag>"
<head>: tema.js (eşzamanlı) ─► <html data-tema="koyu"> ya da nitelik yok
        preload: plex-sans latin + latin-ext
tarayıcı ─► GET /css/style.css?v=<ETag>
   statikOku ─► BIRLESIK'te var ─► birlesikOku
      son bakıştan 1 sn geçmediyse ─► bellekteki kayıt
      readdirSync(public/css/parcalar).filter(.css)   (CSS.md alınmaz)
      ad sırası: 00-temel, 00a-yazitipi, 01-giris-kayit, …, 36-ayar-kartlari
      imza = her dosyanın ad:mtime:boyut ─► değişmediyse eski kayıt
      her parçanın başına  /* ==== parcalar/<ad> ==== */  ─► uç uca
      cssYorumSil (yorumlar ve parça işaretleri gider; EE_ACIK_KAYNAK=1 ise kalır)
      ETag + gzip + brotli ─► bellekte
   statikGonder: ?v ETag'e eşit ─► "public, max-age=31536000, immutable"
                 eşit değil     ─► "no-cache"; If-None-Match tutarsa 304
CSS çözülür: :root değişkenleri ─► koyu blok (koşul tutarsa) ─► 37 parça sırayla
yazı tipi: Plex/Newsreader gelene kadar sistem yazısı (font-display: swap)
```

Bir parçayı değiştirip kaydedince sunucuyu yeniden başlatmana gerek yok: en geç 1 saniye sonra imza değişir, paket yeniden
kurulur, ETag değişir; bir sonraki HTML isteğinde adres yeni `?v=` ile gelir ve tarayıcı yenisini indirir.

### Kurallar nasıl üst üste biner

```
00-temel   :root { --ana: #d62839 … }               değişkenler
02-form    .btn { background: var(--ana) }          temel kural
07-mobil   @media (max-width: 860px) { … }          dar ekran düzeltmesi (sonra geldiği için ezer)
30-dokunm. @media (pointer: coarse) { .btn { min-height: 44px } }
34/35/36   kendi (pointer: coarse) blokları          30'dan sonra gelen dosyaların kendi dokunmatik ölçüleri
```

Aynı özgüllükte sonraki kazanır; daha özgül seçici (ör. `.filtre-satir .field select`, `.ara-kutu`) dosya sırasına bakmadan
kazanır. Durum sınıfları hep bileşik yazılır (`.kart.tikla`, `.takvim-hucre.bugun`): aynı kısa ad (`.bos`, `.secili`,
`.dolu`) farklı dosyalarda farklı şey demek olabilir.

### Tema değişimi

```
Ayarlar → Görünüm: Sistem / Açık / Koyu  ─► data-act="tema-sec"
üst çubuk ay/güneş                         ─► data-act="tema-degis" (görünenin tersi)
   25-tiklama.js ─► window.temaAyarla(…) ─► localStorage ee_tema + <html data-tema> + meta theme-color
                 ─► POST /api/profile { tema }  (hesaba yazılır; başka cihazda girişte 26-baslat.js uygular,
                                                 hesaptaki seçim "sistem" değilse)
CSS: değişkenler anında değişir; html, body zemin/yazı geçişi --sure ile yumuşak
```

### Yeni bir stil eklerken

1. Önce "Ortak kalıplar"a ve ilgili parçaya bak; aynı işi yapan sınıf çoğu zaman vardır.
2. Yeni sınıf adı seçmeden `public/` altında ara (`.tarih-kutu` ve `.yukleniyor` çakışmalarını hatırla, Dikkat!'e bak).
3. Renk yazma, değişken kullan; yeni renk gerekiyorsa `00-temel.css`'te **üç yere** (açık `:root`, sistem koyu bloğu,
   `data-tema="koyu"` bloğu) ekle ve iki temada okunurluğu (en az 4,5:1) denetle.
4. Hareket ekliyorsan `prefers-reduced-motion: reduce` karşılığını yaz; dokunulacak bir şeyse dokunmatikte 44 px ve
   yazı kutusunda 16 px olmasını kendi dosyanda sağla (`30-dokunmatik.css` artık son dosya değil).
5. Yeni parça gerekiyorsa sıradaki numarayla (`37-…css`) bu klasöre koy; yalnız `.css` uzantısı birleşir.
6. `node testler/test-kucult.js` (sunucusuz) çalıştır: paket yorumsuz, süslü parantezler dengeli mi.
7. Açık ve koyu temada, 360 / 500 / 860 px genişlikte ve "hareketi azalt" açıkken gözle bak.
8. Bu belgede ilgili parçanın bölümünü ve "Son durum"u aynı işte güncelle (kural: kodu değiştiren yanındaki belgeyi de
   günceller).

## Dikkat!

- **`30-dokunmatik.css` artık son dosya değil.** Başlık yorumu "bilerek en son dosya: buradaki kurallar öncekileri ezer"
  diyor; sonradan `31`–`36` eklendi. Onlardan dokunma hedefi isteyenler kendi `(pointer: coarse)` bloğunu yazdı
  (`34-servis-yoklama.css`, `35-quiz.css`, `36-ayar-kartlari.css`). `31`–`36`'da `30`'un bir kuralını aynı özgüllükle yeniden
  yazarsan dokunmatik ölçü kaybolur.
- **16 px kuralını ezen kutular (iPhone büyütmesi).** `30-dokunmatik.css` kutuları `input`, `select`, `textarea` gibi öğe
  seçicileriyle 16 px yapar; kendi yazı boyunu sınıfla veren kutu onu ezer. Kod okumasına göre (özgüllük ve dosya sırası
  hesaplanarak; telefonda denenmedi) dokunmatik ekranda 16 px'in altında kalanlar: `.ara-kutu` (`font: inherit` → 15 px;
  müdürün öğrenci araması `#ogrAra`, mesajın okundu listesindeki `#okumaAra`, anketin oy listesindeki `#anketAra`),
  `.tarih-kutu` (15 px; Takvim yıl seçimi, yoklama tarihi), `.durum-kutu` (14 px; gün gün devamsızlık), `.sonuc-kutu` (14 px;
  ödev kontrolü), `.yil-seridi select` (14 px), `.servis-saat-alan input` (15 px), `textarea.qz-yapistir` (13 px; `.field`
  içinde ama `35-quiz.css` `30`'dan sonra geldiği ve eşit özgüllükte olduğu için), `textarea.qz-cevap-metin` (15 px;
  öğrencinin açık uçlu cevap kutusu, `35`'in dokunmatik bloğunda yok). `.field` içindeki kutular kurtulur: servis ve kulüp
  pencerelerindeki `.ara-kutu`'lar (`#svAra`, `#kuAra`), `.adres-girdi input`, `.os-css-kutu` 16 px olur, çünkü
  `30`'daki `.field input` / `.field textarea` onlardan özgül ya da onlarla eşit ve sonra gelir. iPhone'da 16 px'in altındaki
  sekiz kutuya dokununca sayfa yakınlaşır.
- **`.tarih-kutu` iki ayrı şey (görünür hata).** `20-devamsizlik.css`'te düz bir tarih kutusu (Takvim'in yıl seçimi
  `#takvimYilSec`, yoklamanın tarihi `#yoklamaTarih`), `32-tarih-secici.css`'te ödev takviminin açılır kutusu
  (`position: absolute`, 328 px; 560 px altında `position: fixed; bottom: 0`). `32` sonra geldiği için açılır kutunun
  konumlandırması o iki sıradan kutuya da uygulanır. Ayrıntı ve ölçüm [04e-tarih-secici.md](../../js/parcalar/04e-tarih-secici.md)
  "Dikkat!"te; önerilen düzeltme açılır kutunun sınıfını (JS + CSS) `tk-kutu` gibi başka bir ada taşımak. Kod değiştirilmedi.
- **`.yukleniyor` da iki işte.** `06-modal.css`'te sayfa yer tutucusu (`text-align: center; padding: 34px`), `09-kayit-ekrani.css`'te
  okul aramasının soluklaşması (`.okul-sonuc.yukleniyor { opacity: .55 }`). `08b-rolsuz.js` arama sürerken sonuç kutusuna
  `yukleniyor` ekleyince `06`'nın 34 px iç boşluğu ve ortalaması da gelir: kod okumasına göre "Okul aç" penceresinde sonuç
  listesi her aramada içe kayıp geri döner. Kod değiştirilmedi.
- **Koyu palet iki kez yazılı.** `00-temel.css`'te sistem koyu bloğu ve `data-tema="koyu"` bloğu aynı listedir; biri
  değişip öteki unutulursa "Sistem" ile "Koyu" farklı görünür. Aynı ikilik `12-ikonlar.css` (tema düğmesi) ve
  `27-harita-ortak.css`'te (döşeme filtresi) de var.
- **Değişken dışı sabit renkler** (TANITIM.md'deki "renkler yalnız `00-temel.css` değişkenlerinden" kuralının istisnaları):
  `07-mobil.css` yazdırma rengi (`#fff`, `#000`, `#333`, `#444`, `#888`, `#ccc`; kâğıt için bilerek), `09-kayit-ekrani.css`
  şifre kuralının `data:` SVG tikindeki `stroke='white'`, `12-ikonlar.css` `.avatar` beyaz yazı (zemini `--av`'yi
  `02-ikonlar.js`'teki `AVATAR_RENKLERI` dizisinin sekiz sabit renginden biri olarak satır içi yazar; iki temada aynı),
  `19-mesajlar.css` seçili sekmenin rozeti `rgba(255,255,255,.28)`, `22-cesitli.css` anahtar topunun gölgesi,
  `29-dis-sayfalar.css` açılış bandının parçaları (`.v-etiket` `#0a8f9c`, `.v-btn-ana` `#fff`/`#fff4f2`, sarı vurgu,
  `.v-gorsel`, `.v-oz-ikon` beyaz yazı), `32-tarih-secici.css` (beyaz yazılar, `.tk-tamam` sabit yeşil `#2f9e44`, yedek
  değerli `var(--ikinci, #0fa3b1)` gibi yazımlar), `02-form.css` `var(--kirmizi, #d62839)` yedekleri.
- **Koyu temada tarih seçicide okunurluk düşük.** `32-tarih-secici.css` seçili günü `--ikinci-koyu` zemin + sabit beyaz
  yazıyla çizer; koyu temada `--ikinci-koyu` açık turkuaz `#7fe0e9` olduğu için beyaz yazının karşıtlığı **1,53:1**
  (hesaplandı; okunabilirlik için en az 4,5:1 gerekir). Aynı nedenle koyu temada "Bugün" düğmesi 2,07:1 (`--ikinci` +
  beyaz; açık temada da 3,05:1), "Temizle" 3,00:1 (`--ana` + beyaz); "Tamam" iki temada 3,45:1. Marka ve anlam zeminli
  düğme, sekme ve rozetlerin çoğu bu sorunu yaşamaz, çünkü `--ustune-yazi` kullanır (koyuda koyu yazı). Ekranda bakılmadı;
  kod değiştirilmedi.
- **Sabit beyazla çizilen öteki yerler de düşük karşıtlıkta** (WCAG formülüyle hesaplandı; ekranda bakılmadı; kod
  değiştirilmedi): açılıştaki özellik kartlarının ikonu `.v-oz-ikon` beyaz — her dördüncü kartta (`--ikinci-koyu` zemin)
  koyu temada 1,53:1, ikinci, altıncı, onuncu kartta (`--ikinci`) koyuda 2,07:1, açıkta 3,05:1, birinci, beşinci, dokuzuncu
  kartta (`--ana`) koyuda 3,00:1 (ikon için bile en az 3:1 beklenir; açılışta 12 kart var); kayıtta ve şifre
  değiştirmede karşılanan şifre kuralının beyaz tiki koyu temada `--yesil` `#4ade80` üstünde 1,74:1; açılıştaki
  `.v-etiket` (12 px beyaz yazı, `#0a8f9c`) 3,87:1; baş harfli yuvarlaklarda (`.avatar`, 13,5 px kalın beyaz harf)
  `AVATAR_RENKLERI`'nden `#d9820b` 2,94:1, `#0a8f9c` 3,87:1 (öteki altı renk 4,5:1'in üstünde).
- **860 px iki yerde.** CSS'teki 860/861 eşiğini değiştirirsen `24-bildirim-arama-mobil.js`'teki `masaustuMu()`'yu da
  değiştir; yoksa ☰ yanlış davranır (menü gizliyken daraltma ya da tersi).
- **Üst çubuğun 62 px'ine bağlı sabitler.** `.topbar` 62 px; `.sidebar` `top: 62px` ve `calc(100vh - 62px)`,
  `.sidebar-perde.acik` `inset: 62px 0 0 0`, `.panel` `top: 58px`, `.qz-ust` `top: 70px` (520 px altında 66),
  `.os-onizleme-kap` `top: 78px`, `.servis-kart` `scroll-margin-top: 80px`. Çubuğun boyu değişirse (planlı "üst şerit
  sadeleştirme") hepsi elle güncellenmeli.
- **`.satir:hover` her satırı boyar.** `23-hareket.css` bütün `.satir`'lara hover'da `--ana-acik` verir; tıklanmayan
  satırlar da pembeleşir, dokunmatik ekranda dokunulan satır boyalı kalabilir. Bazı listeler kendi
  hover'ını yazar (`.satir.tiklanir`, `.satir.tikla-odev`).
- **`[hidden]` her şeyi gizler (`!important`).** Bir öğeyi `hidden` niteliğiyle gizleyip CSS'le göstermeye çalışma; nitelik
  kazanır. `#btnEkle[hidden]`, `.v-yorumlar[hidden]`, `.okul-sayfa[hidden]` kuralları bu yüzden artık gereksiz (zararsız).
- **Okul sayfası 1600 px'te kesilir.** `.okul-sayfa` `max-height: 1600px; overflow: hidden`: çok uzun tanıtım ya da kalabalık
  galeri altta görünmez olur (bilerek: sayfa sonsuz uzamasın). `os-*` sınıf adlarını değiştirirsen `css-temizle.js`'teki
  `SAYFA_PARCALARI` ve okulların kaydettiği CSS'ler de bozulur.
- **Kayan sekme iki düğme varsayar.** `.kayan-isaret` genişliği `(100% - 8px) / 2`; üç düğmeli bir `.kayan-sekme` yanlış
  çizilir.
- **Sağdan sola dil hazır değil.** Kurallar fiziksel yönlerle yazılmış (`left`, `margin-left`, `border-left`, `padding-left`,
  `translateX`, `text-align: left`); planlı "Çok dil" işinde Arapça için mantıksal özelliklere (`inset-inline-start`,
  `margin-inline-start`…) ya da `[dir="rtl"]` düzeltmelerine geçmek gerekecek.
- **Yorum atıcı CSS'i doğrulamaz.** JS'ten farklı olarak birleşik CSS derlenip denetlenmez; kapanmamış bir tırnak ya da
  süslü parantez kendi dosyasından sonraki bütün parçaları bozabilir. `test-kucult.js` yalnız süslü parantez sayılarının
  eşit olduğuna bakar.
- **Üretimde parça adları görünmez.** Tarayıcıdaki `style.css`'te `/* ==== parcalar/... ==== */` işaretleri yoktur; bir
  kuralın hangi parçadan geldiğini bulmak için sunucuyu `EE_ACIK_KAYNAK=1` ile aç ya da sınıf adını bu klasörde ara.
- **Yazdırma yalnız giriş kâğıtları için düzenli.** Başka bir sayfa yazdırılınca yalnız menü, üst çubuk ve ☰ gizlenir;
  sayfanın kendisi için ayrı bir yazdırma düzeni yoktur.
- **Eskimiş yorumlar:** `09-kayit-ekrani.css` okul aramasını "müdür kaydı" diye anlatıyor (bugün yöneticinin "Okul aç"
  penceresi), `20-devamsizlik.css` `.satir.tiklanir`'ı "ana sayfadaki duyuru satırları" diye (bugün yalnız Takvim),
  `22-cesitli.css`'in başlığı içeriğin yarısını sayıyor, `06-modal.css`'te içi boş "rozet / başarı" başlığı var,
  `30-dokunmatik.css` "en son dosya" diyor. `28-grafik.js`'in yorumu bu klasördeki dosyayı `25-grafik.css` diye anıyor
  (doğrusu `25-grafik-sinav.css`).
- **Kontrast için koyu kutucuk tonları seçildi.** `commit 521`'de kutucuk renkleri beyaz alt yazıyla en az 4,5:1 olacak
  kadar koyulaştırıldı ve `.kutucuk-alt`'ın saydamlığı kaldırıldı; `--kutu-*` değerlerini açarken bunu bozma.

## Testleri

- `testler/test-kucult.js` ([../../../testler/test-kucult.md](../../../testler/test-kucult.md); sunucusuz, `tumtest.sh`'in
  sunucusuz turunda) — bu klasörü sunucuyla aynı sırayla (`sort()`) ve aynı parça işaretleriyle birleştirir, `cssYorumSil`'den
  geçirir: "style.css yorumsuz" (çıktıda `/*` kalmadı ve küçüldü), "style.css süslü parantezleri dengeli"; ayrıca
  "CSS: dizgi içi korunuyor" (`content: "/*x*/"` silinmez). Bu klasörü doğrudan okuyan tek test.
- `testler/guvenlik-test.js` ([../../../testler/guvenlik-test.md](../../../testler/guvenlik-test.md); sunucu ister) —
  `/CSS/Parcalar/00-temel.css` büyük harfle de 404; birleşik `/css/style.css` 200.
- `testler/test-adresler.js` ([../../../testler/test-adresler.md](../../../testler/test-adresler.md)) — `/css/parcalar/00-temel.css`
  404; boş baytlı `/css/style.css%00?v=1` 404 ve sunucu ayakta.
- `testler/test-admin-gizli.js` ([../../../testler/test-admin-gizli.md](../../../testler/test-admin-gizli.md)) — JS parça
  adresi (`/js/parcalar/06-menu.js`) ve `.md` adresleri (diskte olsa da; `/js/parcalar/05-giris.md`, `/TANITIM.md`,
  geçici bir `.md` ve onun `.md.`, `.md%20`, `::$DATA` gibi biçimleri) bilinmeyen adresle aynı 404. CSS klasörünü ya da bu
  belgeyi adıyla denemez; bu belge de aynı `.md` kuralına girdiği için web'den okunamaz.
- `testler/test-okul-agi.js` ([../../../testler/test-okul-agi.md](../../../testler/test-okul-agi.md)) — okul ağı
  senaryosunda 300 öğrencinin her biri okulun sayfasını açarken `style.css`'i sayfadaki `?v=` sürümüyle, servis çalışanı
  kurulurken de sürümsüz adresle indirir; hiçbiri 429 ya da 503 almamalı (CSS'in içeriğine değil, sunulmasına bakar).
- `testler/test-giris-kayit.js` ([../../../testler/test-giris-kayit.md](../../../testler/test-giris-kayit.md)) — aynı IP'den
  400 kez `/css/style.css` hiç 429 almıyor (bir sınıfın aynı ağdan girmesi).
- `testler/test-okul-sayfasi.js` (belgesi `testler/test-okul-sayfasi.md`) — okul sayfasının kısıtlı CSS'i (`@import`, `url`
  atılıyor, dışarı yalnız temizlenmiş CSS gidiyor); `31-okul-sayfasi.css`'in `os-*` adlarına bağlı.
- Görsel: otomatik renk, karşıtlık, kullanılmayan sınıf ya da sınıf çakışması denetimi **yok**. En yakın şey
  `araclar/gezinti.js` ekran turu (açık/koyu/telefon fotoğrafları, yüklenirken kayma ölçümü); planlı "Ekran turu" işinde
  yeniden koşacak. Bu belge yazılırken çalıştırılmadı.
- Elle deneme:
  1. Siteyi aç, üst çubuktaki ay/güneşle temayı değiştir; Ayarlar → Görünüm'de "Sistem" seç ve işletim sisteminin koyu
     modunu aç/kapat: renkler sayfa yenilenmeden değişmeli.
  2. Pencereyi 1200 → 860 → 500 → 360 px'e daralt: menü ☰'ye geçmeli, 500'de Ayarlar ve tema düğmesi, 359'da Yenile
     kaybolmalı; yatay kaydırma çıkmamalı.
  3. İşletim sisteminde "hareketi azalt"ı aç: sayfa açılışı, pencere ve kutucuklar canlandırmasız gelmeli.
  4. Öğretmenle "Yeni ödev"de tarih seçiciyi telefonda aç: alttan açılan sayfa olmalı; koyu temada seçili günün yazısına bak.
  5. Müdürle Öğrenciler sayfasında "Giriş bilgisi dağıt" → "Şifreleri yenile ve listeyi hazırla" → "Yazdır / PDF":
     önizlemede yalnız kesme kâğıtları çıkmalı (bu işlem seçilen öğrencilerin şifrelerini yeniler; yalnız deneme okulunda
     yap).
  6. `EE_ACIK_KAYNAK=1` ile açılan sunucuda `/css/style.css`'te parça işaretlerini gör.

## Son durum

- **Bu klasörde 81 commit var**; ilk `a780f62 commit 4` (2026-08-28), son `40fc7e7 commit 525` (2026-09-27). Ondan bu yana
  (bugünkü `commit 565`'e kadar) hiçbir CSS parçası değişmedi.
- **`40fc7e7 commit 525`** (2026-09-27, okul disk sınırı + telefonda küçültme): `26-anket-okul-hayati.css`'te
  `#teslimYuklemeler` tek `minmax(0, 1fr)` sütuna bağlandı (uzun dosya adı telefonda satırı taşırmasın) ve küçültülen
  fotoğrafın notu için `.yukleme-ust .kucultme` (boşken gizli) eklendi; `36-ayar-kartlari.css`'e okulun disk alanı bölümü
  eklendi: `.doluluk.okul-disk` yeşil/turuncu/kırmızı, `.field .sayi-satir select`, `.disk-siniri`, `.okul-disk-kart`,
  `.doluluk.sikisik`, `.okul-tablo td`, `.disk-ozet`.
- **`566b917 commit 524`** (2026-09-27, canlı hazırlık): `02-form.css`'e dosya alanının doluluğu (`.ek-alan.dolu .ek-birak`
  gizli, `.doluluk`, `.doluluk-ust`, `.doluluk-cubuk`, `.az-kaldi`, `.dolu`, `.doluluk-uyari`) ve ödev penceresinin
  `.dosya-izin` kutusu; `22-cesitli.css`'e `.teslim-oge-silinme` ("N gün sonra silinir").
- **`153d63d commit 522`** (2026-09-27): `28-yetiskin-hesap.css`'te kişi kodu yorumu yeni biçime göre düzeltildi ("15
  karakter, 5'erli gruplar, boşluk" → "16 karakter, 4'erli dört grup, tire") ve 360 px altında büyük kişi kodu 17 px'e
  indirildi (19 karakter tek satıra sığsın).
- Ondan önce `276c0a0 commit 521` (2026-09-27): kutucuk renkleri beyaz alt yazıyla en az 4,5:1 olacak kadar koyulaştırıldı
  (`--kutu-turuncu` `#ea580c` → `#c2410c`, `--kutu-yesil` `#16a34a` → `#15803d`, `--kutu-mavi` `#0284c7` → `#0369a1`,
  `--kutu-camgobegi` `#0d9488` → `#0f766e`), `.kutucuk-alt`'ın `.92` saydamlığı kaldırıldı, `36-ayar-kartlari.css` ilk
  hâliyle eklendi (ayar kartları, sıralı liste).

Dosya başına geçmiş:

| Dosya | Commit | İlk | Son |
|---|---|---|---|
| `00-temel.css` | 4 | commit 4 (08-28) | commit 521 (09-27) |
| `00a-yazitipi.css` | 1 | commit 154 (09-08) | commit 154 |
| `01-giris-kayit.css` | 1 | commit 16 (08-28) | commit 16 |
| `02-form.css` | 7 | commit 4 (08-28) | commit 524 (09-27) |
| `03-iskelet.css` | 3 | commit 4 (08-28) | commit 516 (09-27) |
| `04-kartlar.css` | 1 | commit 5 (08-28) | commit 5 |
| `05-tablo-grafik.css` | 4 | commit 238 (09-25) | commit 241 (09-25) |
| `06-modal.css` | 1 | commit 5 (08-28) | commit 5 |
| `07-mobil.css` | 2 | commit 24 (08-28) | commit 516 (09-27) |
| `08-menu-filtre.css` | 2 | commit 24 (08-28) | commit 373 (09-26) |
| `09-kayit-ekrani.css` | 1 | commit 16 (08-28) | commit 16 |
| `10-ana-sayfa-kutucuklari.css` | 3 | commit 35 (08-28) | commit 521 (09-27) |
| `11-haftalik-program-tablosu.css` | 2 | commit 59 (08-29) | commit 60 (08-29) |
| `12-ikonlar.css` | 2 | commit 421 (09-26) | commit 435 (09-26) |
| `13-tipografi.css` | 1 | commit 5 (08-28) | commit 5 |
| `14-ders-programi.css` | 3 | commit 60 (08-29) | commit 62 (08-29) |
| `15-roller.css` | 1 | commit 351 (09-26) | commit 351 |
| `16-giris-sekme.css` | 1 | commit 16 (08-28) | commit 16 |
| `17-odev-secim.css` | 5 | commit 81 (08-29) | commit 351 (09-26) |
| `18-aktarim-kvkk.css` | 3 | commit 93 (08-29) | commit 159 (09-08) |
| `19-mesajlar.css` | 2 | commit 106 (08-29) | commit 107 (08-29) |
| `20-devamsizlik.css` | 2 | commit 39 (08-28) | commit 351 (09-26) |
| `21-takvim.css` | 1 | commit 121 (08-29) | commit 121 |
| `22-cesitli.css` | 9 | commit 5 (08-28) | commit 524 (09-27) |
| `23-hareket.css` | 1 | commit 145 (09-08) | commit 145 |
| `24-veli.css` | 2 | commit 278 (09-25) | commit 279 (09-25) |
| `25-grafik-sinav.css` | 14 | commit 219 (09-25) | commit 373 (09-26) |
| `26-anket-okul-hayati.css` | 5 | commit 300 (09-26) | commit 525 (09-27) |
| `27-harita-ortak.css` | 2 | commit 316 (09-26) | commit 518 (09-27) |
| `28-yetiskin-hesap.css` | 6 | commit 342 (09-26) | commit 522 (09-27) |
| `29-dis-sayfalar.css` | 6 | commit 377 (09-26) | commit 505 (09-26) |
| `30-dokunmatik.css` | 1 | commit 374 (09-26) | commit 374 |
| `31-okul-sayfasi.css` | 2 | commit 391 (09-26) | commit 392 (09-26) |
| `32-tarih-secici.css` | 3 | commit 458 (09-26) | commit 502 (09-26) |
| `33-aile.css` | 1 | commit 463 (09-26) | commit 463 |
| `34-servis-yoklama.css` | 1 | commit 518 (09-27) | commit 518 |
| `35-quiz.css` | 1 | commit 519 (09-27) | commit 519 |
| `36-ayar-kartlari.css` | 2 | commit 521 (09-27) | commit 525 (09-27) |

- **Bilinen açıklar (kod değiştirilmedi):** `.tarih-kutu` çakışması; okul aramasında `.yukleniyor` çakışması; koyu temada
  tarih seçicinin beyaz yazıları ve öteki düşük karşıtlıklı beyaz yazı/ikonlar; dokunmatikte 16 px'in altında kalan sekiz
  kutu; `30-dokunmatik.css`'in "en son dosya" varsayımı; takvimde toplantının lejantta olmaması ve günün listesinde
  renksiz kalması; kullanılmayan kurallar ("Kullanılmayan kurallar"); eskimiş yorumlar. Hepsi öneri; kullanıcı istemeden
  düzeltilmedi.
- **Planlı işlerden bu klasöre dokunacaklar:**
  - "Arayüz önizlemesi" — kullanıcı üç tasarımdan birini seçince "tasarım dili" tanımı yazılacak; değişkenler, kart, düğme
    ve sayfa düzeni büyük ölçüde bu seçime göre yeniden yapılır.
  - "Üst şerit sadeleştirme" — `03-iskelet.css`, `07-mobil.css` (`#btnAyarlar`, `#btnTema`, `#btnYenile` gizleme kuralları),
    `12-ikonlar.css` (tema düğmesi), `28-yetiskin-hesap.css` ("+ Ekle"); çubuğun boyu değişirse 62 px'e bağlı sabitler.
  - "Çok dil" — üstte dil seçici ve sağdan sola yazım: fiziksel yönlü kurallar.
  - "Kulüpler kaldırılacak" — `26-anket-okul-hayati.css`'teki `.kulup-dugmeler`.
  - "Devamsızlık: tarih aralığı + filtre" — `20-devamsizlik.css`, `22-cesitli.css` (gün gün satırı); `.tarih-kutu` çakışması
    o işte görülecek.
  - "Mesaj ayarları, Ajanda, sınav planlama" (bildirim paneli sekmeler hâlinde) ve "Mesaj etiketleri" — `06-modal.css`
    (`.panel`), `19-mesajlar.css`.
  - "Düzenleyiciler" (ortak yazı editörü, quiz soru editörü) ve "Anket düzenleyici" — `35-quiz.css`, `26-anket-okul-hayati.css`
    ve büyük olasılıkla yeni parçalar.
  - "Sınav: formüllü ölçüm, bağlı kaydırıcılar" — `25-grafik-sinav.css` (ölçüm düzenleyici, değer tablosu).
  - "Paneller ve okul gezgini", "Eğitim içerikleri" (kendi video oynatıcısı), "Toplantılar" — yeni parçalar; takvimde
    toplantı işareti (`.isaret.toplanti`) zaten var.
  - "Özel branş / ders" — okul dersine ad, kısaltma ve **renk** verecek; bu renkler `00-temel.css`'ten değil okuldan
    gelecek (bugünkü `--av` gibi satır içi), iki temada okunurluk o işte düşünülmeli. "Etüt planlama" (canlı boş zaman
    ızgarası), "Başarılarım" ve "Sistem" işi (bakım modu, site duyurusu, Yardım, Yenilikler) de büyük olasılıkla yeni
    ekran parçası ister.
  - "Ekran turu + albüm" — bütün parçaların açık/koyu/telefon görüntüleri yeniden çekilecek.
