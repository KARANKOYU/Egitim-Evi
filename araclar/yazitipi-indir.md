# araclar/yazitipi-indir.js

Sitenin iki yazı tipini (IBM Plex Sans ve Newsreader) Google Fonts'tan bir kez indirip `public/yazitipi/`'ye `.woff2` olarak
koyar ve `public/css/parcalar/00a-yazitipi.css`'teki `@font-face` kurallarını baştan yazar.

## Bu dosya ne yapar?

Eğitim Evi tarayıcıya hiçbir zaman dışarıdan yazı tipi çektirmez. Üç nedeni var: okulun ağında internet olmayabilir ya da
yavaş olabilir (site okulun kendi sunucusundan da açılabilmeli); her sayfa açılışında Google'a istek gitmesi, öğrencinin hangi
siteye girdiğini üçüncü bir tarafa söylemek demektir; ve sunucunun güvenlik başlığı (`Content-Security-Policy`'de
`font-src 'self' data:`, [../sunucu/http.md](../sunucu/http.md)) başka bir adresten yazı tipi yüklenmesine zaten izin vermez.

Bu yüzden yazı tipi dosyaları depoda durur ve sunucu onları kendisi verir. Bu araç o dosyaları üretmenin yoludur: Google
Fonts'un tarayıcılara verdiği CSS'i okur, içinden Türkçe için gereken alt kümelerin (latin ve latin-ext) adreslerini çıkarır,
dosyaları indirir, anlamlı adlarla kaydeder ve onlara bakan `@font-face` kurallarını yazar. Elle yapılsa hem uzun hem hataya
açık bir iş olurdu (Google dosya adlarını rastgele verir, her aile için birden çok blok döner).

Yalnız yazı tipini değiştirmek ya da yeniden indirmek istediğinde, elle çalıştırılır. Sunucu, testler ve öteki araçlar bu
dosyayı kullanmaz; çalışması için internet gerekir.

Bugün depoda bu araçla üretilmiş 4 dosya var (toplam yaklaşık 173 KB):

| Dosya | Boyut | Ne |
|---|---|---|
| `plex-sans-400-700-latin.woff2` | 45 712 bayt | gövde yazısı, temel Latin (ç, ö, ü; `unicode-range`'inde ayrıca `U+0131` yani ı) |
| `plex-sans-400-700-latin-ext.woff2` | 30 964 bayt | gövde yazısı, genişletilmiş Latin (ğ, ş, İ dahil) |
| `newsreader-700-latin.woff2` | 61 956 bayt | başlıklar |
| `newsreader-700-latin-ext.woff2` | 38 484 bayt | başlıklar, genişletilmiş Latin |

Türkçe bir metin iki alt kümeye de dokunduğu için her ailenin iki dosyası da gerekir.

## İçinde neler var?

### Sabitler

- `HEDEF` — `public/yazitipi/` (yoksa açılır).
- `CSS_CIKTI` — `public/css/parcalar/00a-yazitipi.css`.
- `AILELER` — indirilecek aileler; her biri `{ ad, dosya, sorgu }`:

  | `ad` (CSS'teki aile adı) | `dosya` (dosya adı öneki) | `sorgu` (Google Fonts `css2` sorgusu) |
  |---|---|---|
  | `IBM Plex Sans` | `plex-sans` | `IBM+Plex+Sans:wght@400;700` |
  | `Newsreader` | `newsreader` | `Newsreader:opsz,wght@6..72,700` (optik boyut ekseni 6–72, kalınlık 700) |

  Koddaki yorum 600 kalınlığının bilerek istenmediğini söyler: tarayıcı 600 isteyince 700'ü kullanır, dosya sayısı ve indirilen
  boyut yarıya iner (yorumdaki ölçüm: 652 KB → 248 KB; bugünkü dört dosya toplam ~173 KB).
- `ALT_KUMELER` — `['latin', 'latin-ext']`. Google'ın verdiği öteki alt kümeler (Kiril, Yunan, Vietnam…) atlanır.
- `UA` — bir Chrome 126 tarayıcı kimliği. Google Fonts CSS'i isteyen tarayıcıya göre biçim seçer; `woff2` almak için modern bir
  tarayıcı gibi görünmek gerekir.

### `indir(url)`

`https.get` ile `UA` başlığıyla indirir ve gövdeyi tek bir `Buffer` olarak döner. Cevap 200 değilse `<adres> -> <durum>` hatası;
ağ hatası olduğu gibi yukarı çıkar. Yönlendirmeyi izlemez, zaman aşımı yoktur.

### Ana akış (adsız `async` işlev)

Dosya çalıştırılınca başlar (ayrıntısı "Nasıl çalışır"da). Bir hata olursa `HATA: <ileti>` yazar ve 1 koduyla çıkar. Bitince
her dosyanın adını ve KB'ını, sonra toplamı ve CSS dosyasının yolunu yazar:

```
  plex-sans-400-700-latin-ext.woff2       30 KB
  plex-sans-400-700-latin.woff2           45 KB
  newsreader-700-latin-ext.woff2          38 KB
  newsreader-700-latin.woff2              61 KB

  toplam 173 KB -> <proje>\public\yazitipi
  CSS -> <proje>\public\css\parcalar\00a-yazitipi.css
```

(Satırların sırası Google'ın CSS'indeki blok sırasıdır; bugünkü `00a-yazitipi.css`'te her ailede önce `latin-ext`, sonra
`latin` gelir.)

Dışa açılan bir şey yok (`module.exports` yok).

### Ürettiği dosyalar

- **`.woff2` dosyaları** — adı `<dosya>-<kalınlık>-<alt küme>.woff2`; kalınlık tek değerse o (`700`), aralıksa tireli (`400-700`).
- **`00a-yazitipi.css`** — baştaki açıklama yorumu ("kendi sunucumuzdan gelir… elle düzenlenmez… `font-display: swap`") ve her
  dosya için bir `@font-face`: `font-family`, `font-style: normal`, `font-weight` (tek değer ya da `400 700` aralığı),
  `font-display: swap`, `src: url('/yazitipi/<dosya adı>') format('woff2')`, `unicode-range` (Google'ın verdiği aralık aynen).
  `font-display: swap` sayesinde yazı önce sistem yazı tipiyle hemen görünür, dosya gelince değişir; yavaş bağlantıda boş ekran
  olmaz.

## Kimle konuşur?

- **Çağırdıkları:** Node'un `fs`, `path` ve `https`'i. Dışarıya iki adrese gider: `https://fonts.googleapis.com/css2?family=…`
  (CSS) ve o CSS'in içindeki `url(…)` adresleri (Google'ın yazı tipi dosyaları). Uygulamanın kendi modüllerinden hiçbirini
  yüklemez; `EE_DIS_ISTEK` gibi dış istek ayarlarına bakmaz.
- **Yazdığı yerler:** `public/yazitipi/*.woff2` ve `public/css/parcalar/00a-yazitipi.css` (ikisi de depoya girer).
- **Ürettiklerini kullananlar:**
  - [../sunucu/http.md](../sunucu/http.md) — `/yazitipi/*.woff2`'yi `font/woff2` türüyle verir ve **bir yıl değişmez**
    (`public, max-age=31536000, immutable`) diye önbelleğe aldırır ("içerikleri değişmez, değişirse dosya adı değişir");
    `00a-yazitipi.css`'i öteki CSS parçalarıyla ad sırasıyla birleştirip `/css/style.css` yapar (yorumlar atılır; `00-temel.css`'ten
    hemen sonra gelir).
  - `public/css/parcalar/00-temel.css` — `--f-govde: 'IBM Plex Sans', …` (bütün gövde yazısı) ve `--f-baslik: 'Newsreader', …`
    (`h1`, `h2`). `--f-baslik`'ı ayrıca büyük sayı göstergeleri kullanır: `.stat .n` (`04-kartlar.css`), `.seri-sayi b` ve
    `.snf-ad` (`22-cesitli.css`), `.alt-sayim b` (`24-veli.css`).
  - `public/index.html` — iki Plex Sans dosyasını adıyla `<link rel="preload">` eder (sayfa açılırken hemen insin).
  - [../public/sw.md](../public/sw.md) — servis çalışanı (`public/sw.js`) dört dosyayı adıyla "kabuk" listesinde önbelleğe alır
    (`SURUM = 'egitim-evi-v9'`).
  - `testler/test-okul-agi.js` — 300 öğrencinin aynı ağdan siteyi açışını taklit ederken dört dosyayı adıyla ister.
  - `sunucu/ortak.js` — `yazitipi` sözcüğü okul adresi olarak alınamaz (`KISA_AD_YASAK`; sitenin kendi yolu).
- **Belgelerde:** [../TANITIM.md](../TANITIM.md) (klasör ağacı ve araçlar tablosu), [../belge/KILAVUZ.md](../belge/KILAVUZ.md)
  (klasör ağacı).

## Nasıl çalışır (adım adım)?

```
public/yazitipi/ yoksa aç
css = [açıklama yorumu]
her aile için (IBM Plex Sans, Newsreader):
  GET fonts.googleapis.com/css2?family=<sorgu>&display=swap   (UA: Chrome)
  CSS'i "/* " ile böl → her parça: "/* latin-ext */ @font-face { … }"
    alt küme latin ya da latin-ext değilse atla
    font-weight, font-style, url(…), unicode-range'i çıkar; stil normal değilse ya da adres yoksa atla
    aynı adres daha önce geldiyse yalnız kalınlığını ekle (dosyalar: adres → { alt küme, kalınlıklar, aralık })
  her farklı adres için:
    kalınlık = en az == en çok ? "700" : "400 700"
    ad = <dosya>-<kalınlık, boşluk yerine tire>-<alt küme>.woff2
    indir → public/yazitipi/<ad>'a yaz → ekrana "<ad>  <KB>"
    css'e @font-face ekle
00a-yazitipi.css'i baştan yaz → toplam ve yollar
```

### Neden "aynı adres bir kez"?

Değişken yazı tiplerinde Google 400 ve 700 için iki ayrı `@font-face` bloğu döner ama ikisinde de **aynı dosya adresi** vardır.
Araç bunu fark etmeseydi aynı dosyayı iki adla iki kez indirir, tarayıcı da iki kez indirirdi. Bunun yerine tek dosya ve tek
`@font-face` yazılır, kalınlık aralık olarak verilir: `font-weight: 400 700`. IBM Plex Sans'ın bugünkü dosyaları gerçekten
değişkendir (3 Ekim'de dosyaların içindeki eksen tablosuna bakıldı: kalınlık ekseni 100–700); Newsreader dosyalarında yalnız optik
boyut ekseni (6–72) vardır, kalınlık sabit 700'dür.

### Çalıştırma

```
node araclar/yazitipi-indir.js
```

Proje kökünden ya da başka bir yerden fark etmez; yollar dosyanın kendi yerine göre hesaplanır. Sonra değişiklikleri gözden
geçir (yeni ya da artık kullanılmayan dosya adları için "Dikkat!"teki listeye bak) ve commit'le.

## Dikkat!

- **Dosya adı değişirse dört yer elle güncellenmeli.** Aileyi, kalınlığı ya da alt kümeyi değiştirirsen dosya adları da değişir.
  Araç yalnız CSS'i günceller; şunları elle yapman gerekir: `public/index.html`'deki iki `preload` satırı, `public/sw.js`'teki
  dosya listesi (ve `SURUM`'u bir artır ki eski önbellek silinsin), `testler/test-okul-agi.js`'teki dosya adları, ve artık
  kullanılmayan eski `.woff2` dosyalarını `public/yazitipi/`'den silmek (araç klasörü temizlemez; eski dosyalar depoda ve
  sunucuda kalır).
- **Aynı adla yeni içerik tarayıcıya geç ulaşır.** Sunucu yazı tiplerini bir yıl "değişmez" diye önbelleğe aldırır; servis
  çalışanı da kendi önbelleğinde tutar. Ama aracın verdiği adlar yalnız aile, kalınlık ve alt kümeye bağlıdır: aynı ayarla
  yeniden çalıştırıp Google'dan güncellenmiş bir dosya alırsan ad aynı kalır, siteye daha önce girmiş tarayıcılar eski dosyayı
  kullanmaya devam eder. İçerik değiştiyse `dosya` önekini değiştir (ve yukarıdaki dört yeri güncelle).
- **600 notu bugün yalnız Newsreader için doğru.** Koddaki yorum "tarayıcı 600 isteyince 700'ü kullanır" der. CSS parçalarında
  99 yerde `font-weight: 600` ve 3 yerde `500` var. Gövde yazısı (IBM Plex Sans) tek bir değişken dosyadan `400 700` aralığıyla
  geldiği için bu kalınlıklar gerçek 600 ve 500 olarak çizilir. Başlık yazısı (Newsreader) yalnız 700'dür; `h1`/`h2`'de 600
  istenirse 700 görünür.
- **Ayrıştırma Google'ın CSS biçimine güvenir.** Bloklar `/* <alt küme> */` yorumlarıyla ayrılır; `font-weight`, `font-style` ve
  `unicode-range` her blokta olmalıdır. Biri eksik gelirse `(… || [])[1].trim()` korumaya rağmen "Cannot read properties of
  undefined (reading 'trim')" hatasıyla durur (`|| []` yalnız `match`'in `null` olmasını karşılar, `[1]` yine tanımsızdır). Google
  `woff2` yerine başka bir biçim döndürürse (örneğin tarayıcı kimliği eskiyip tanınmazsa) araç yine `.woff2` adıyla kaydeder ve
  `format('woff2')` yazar; dosya tarayıcıda açılmaz. (Koddan çıkarım; denenmedi.)
- **Yarıda kalırsa karışık durum kalır.** Dosyalar indirildikçe yazılır, CSS en sonda. İkinci ailenin indirmesinde ağ koparsa
  ilk ailenin dosyaları yenilenmiş, CSS ise eski kalmış olur. Ad değişmediyse zararsızdır; değiştiyse aracı yeniden çalıştır.
  Araç yalnız `public/yazitipi/`'yi kendisi açar; `public/css/parcalar/` yoksa (depoda hep vardır, ama boş bir kopyada olmaz)
  bütün dosyalar indirildikten sonra CSS yazılırken `ENOENT` hatasıyla düşer.
- **`00a-yazitipi.css`'i elle düzenleme.** Araç her çalıştığında dosyayı baştan yazar; elle eklediğin her şey gider. Değişiklik
  gerekiyorsa `AILELER`'i ya da aracın ürettiği satırları değiştir.
- **Yalnız Latin alfabesi.** Kiril, Yunan, Arap, Kore… harfleri bu yazı tiplerinde yoktur; tarayıcı onları sistem yazı tipiyle
  çizer (`unicode-range` sayesinde gereksiz indirme de olmaz). Latin dışı bir dil eklenirse görünüm farklı olur.
- **İnternet ister, `EE_DIS_ISTEK`'e bakmaz.** Araç bilerek dışarıya istek atar; sunucunun dış istekleri kapatan ayarı onu
  etkilemez. Okul ağındaki sunucuda değil, kendi bilgisayarında çalıştır.
- **Lisans dosyası yok.** İki aile de açık yazı tipi lisansıyla (SIL Open Font License) dağıtılır, depoda durmaları bu yüzden
  serbesttir; ama araç lisans metnini indirmez ve depoda (`public/yazitipi/` dahil) bir lisans dosyası yok.

## Testleri

- Bu aracı çalıştıran otomatik test yok; belgeleme sırasında (2–3 Ekim) da çalıştırılmadı: depodaki yazı tipi dosyalarının ve
  `00a-yazitipi.css`'in üstüne yazar ve dışarıya istek atar. Bu belge koda ve depodaki çıktılara bakılarak yazıldı: dört dosyanın
  adı ve `00a-yazitipi.css`'teki dört blok aracın kurallarıyla birebir uyuşuyor.
- Ürettiklerini dolaylı kullanan testler: `testler/test-okul-agi.js` (dört dosyayı adıyla ister); `testler/test-kucult.js`
  (sunucusuz) bütün CSS parçalarını — `00a-yazitipi.css` dahil — birleştirip yorumların atıldığını ve süslü parantezlerin dengeli
  olduğunu denetler, yani aracın yazdığı CSS bozuksa orada görünür.
- Elle, depoyu bozmadan deneme: dosyayı geçici bir klasörün `araclar/` alt klasörüne kopyala, aynı geçici klasörde
  `public/css/parcalar/` klasörünü de aç (yoksa araç en sonda düşer, "Dikkat!") ve orada çalıştır; çıktı o geçici klasörün
  `public/` altına yazılır. Ekranda dört dosya ve "toplam … KB" görmelisin; üretilen CSS'i depodakiyle karşılaştır.
  Gerçekten değiştirdiysen siteyi aç, Geliştirici Araçları → Ağ sekmesinde `/yazitipi/…woff2` isteklerinin 200 döndüğünü ve
  yazıların değiştiğini gör (eski dosya önbellekte kalabilir: "Dikkat!").

## Son durum

- `git log --follow`: 3 commit. `4ba12d6 commit 156` (2026-09-08): baştaki açıklama, `require`'lar, `HEDEF`, `CSS_CIKTI`,
  `AILELER`, `ALT_KUMELER` (aynı commit `plex-sans-400-700-latin.woff2`'yi ekledi). `c8edf60 commit 157` (2026-09-08): `UA` ve
  `indir`. `b26ce1d commit 465` (2026-09-26): ana akışın tamamı — CSS'i bloklara ayırma, aynı adresi bir kez indirme, kalınlık
  aralığı, dosya adları, `@font-face` üretimi, özet satırları. O günden beri değişmedi.
- Ürettiği dosyalar ayrı commit'lerle girdi: `668a907 commit 154` (`00a-yazitipi.css` ve `newsreader-700-latin-ext.woff2`),
  `a2362e8 commit 155` (`newsreader-700-latin.woff2`, `plex-sans-400-700-latin-ext.woff2`), `4ba12d6 commit 156` (son Plex
  dosyası). Hepsi 2026-09-08'den beri değişmedi.
- Bilinen açıklar ("Dikkat!"te, kod değiştirilmedi): ad değişince elle güncellenecek dört yer, eski dosyaların silinmemesi, aynı
  adla gelen yeni içeriğin önbellekte takılması, 600 yorumunun Plex için artık geçerli olmaması, ayrıştırmadaki etkisiz `|| []`
  koruması, CSS klasörünün kendiliğinden açılmaması.
- Planlı işlerden etkileyebilecekler: "Arayüz önizlemesi" sonunda seçilecek tasarım dili başka yazı tipleri getirirse (kullanıcının
  seçimi bekleniyor; önizlemelerden biri farklı aileler kullanıyor) yeni aileler bu araçla indirilir ve yukarıdaki dört yer
  güncellenir. "Çok dil" (Arapça gibi sağdan sola diller dahil) tanımında yazı tipinden söz edilmiyor; Latin dışı alfabeler için
  aynı görünüm istenirse buraya yeni aileler ya da alt kümeler eklenmesi gerekir.
