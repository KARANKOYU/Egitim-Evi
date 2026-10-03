# public/yazitipi/KLASOR.md

Sitenin iki yazı tipinin klasörü: gövde yazısı IBM Plex Sans ve başlık yazısı Newsreader, her biri Türkçe için iki alt küme
(latin, latin-ext) olmak üzere dört `.woff2` dosyası; hepsi SIL Open Font License ile dağıtılan, sunucunun kendisinin verdiği
dosyalar.

## Bu dosya ne yapar?

Eğitim Evi tarayıcıya hiçbir zaman dışarıdan (Google Fonts gibi) yazı tipi çektirmez. Üç nedeni var: okulun ağında internet
olmayabilir ya da yavaş olabilir; her açılışta Google'a istek gitmesi öğrencinin hangi siteye girdiğini üçüncü bir tarafa söylemek
demektir; ve sunucunun güvenlik başlığı (`font-src 'self' data:`, [../../sunucu/http.md](../../sunucu/http.md)) başka adresten
yazı tipini zaten yüklettirmez. Bu yüzden yazı tipi dosyaları depoda, bu klasörde durur; sunucu onları `/yazitipi/<ad>.woff2`
adresinden kendisi verir.

Dosyaları elle indirmezsin: [../../araclar/yazitipi-indir.md](../../araclar/yazitipi-indir.md)'deki araç Google Fonts'tan bir kez
indirir, anlamlı adlarla buraya koyar ve onlara bakan `@font-face` kurallarını
`public/css/parcalar/00a-yazitipi.css`'e yazar ([../css/parcalar/CSS.md](../css/parcalar/CSS.md)).

Herkes görür: girişsiz açılış sayfası da, uygulamanın her ekranı da, düz sayfalar (aydınlatma metni, koşullar, indirme,
"bulunamadı") da bu yazı tipleriyle çizilir.

Bu `KLASOR.md` web'den okunamaz: sunucu `.md` uzantılı her adrese bilinmeyen adresle aynı 404'ü verir. Klasörde başka hiçbir
dosya (lisans dosyası da) yoktur.

## İçinde neler var?

### Dört dosya

| Dosya | Bayt | Aile, kalınlık | Alt küme | Ne çizer |
|---|---|---|---|---|
| `plex-sans-400-700-latin.woff2` | 45 712 | IBM Plex Sans, 400–700 (tek değişken dosya) | latin: `U+0000-00FF`, `U+0131` (ı) … | gövde yazısı; ç, ö, ü, ı ve bütün ASCII |
| `plex-sans-400-700-latin-ext.woff2` | 30 964 | IBM Plex Sans, 400–700 | latin-ext: `U+0100-02BA` … | gövde yazısında ğ, ş, İ ve öteki genişletilmiş Latin harfleri |
| `newsreader-700-latin.woff2` | 61 956 | Newsreader, 700 | latin | başlıklar (`h1`, `h2`, büyük sayılar) |
| `newsreader-700-latin-ext.woff2` | 38 484 | Newsreader, 700 | latin-ext | başlıklarda ğ, ş, İ … |

Toplam 177 116 bayt (~173 KB). Türkçe bir metin iki alt kümeye de dokunduğu için her ailenin iki dosyası da iner; tarayıcı
`unicode-range` sayesinde yalnız sayfada geçen harflerin dosyasını ister. (Aracın yorumundaki "652 KB -> 248 KB", 600
kalınlığını bırakmanın kazancını anlatır; bugün klasördeki dört dosyanın toplamı 173 KB'tır.)

`00a-yazitipi.css`'teki dört `@font-face` bloğu bu dosyalara bakar: `font-family` `'IBM Plex Sans'` (`font-weight: 400 700`) ve
`'Newsreader'` (`font-weight: 700`), hepsi `font-style: normal`, `font-display: swap`. Kullanan değişkenler `00-temel.css`'te:
`--f-govde: 'IBM Plex Sans', "Segoe UI Variable Text", "Segoe UI", system-ui, …` ve
`--f-baslik: 'Newsreader', Georgia, "Times New Roman", serif`. `h1, h2` başlık yazısını kullanır; ayrıca sayaç rakamları ve bazı
büyük başlıklar (örneğin `04-kartlar.css`, `22-cesitli.css`, `24-veli.css`, `25-grafik-sinav.css`, `29-dis-sayfalar.css`'te) ve
"bulunamadı" sayfalarındaki büyük "404".

### Lisanslar (dosyaların içinden)

Dört dosyanın ad tablosu (`name`) 3 Ekim'de salt okunur bir betikle açılıp okundu (dosyalar değiştirilmedi):

| Dosya | Telif satırı (ad 0) | Tam ad, sürüm | Lisans adresi (ad 14) |
|---|---|---|---|
| `plex-sans-…` (ikisi) | "Copyright 2019 IBM Corp. All rights reserved." | IBM Plex Sans Regular, Version 3.201 | `http://scripts.sil.org/OFL` |
| `newsreader-…` (ikisi) | "Copyright 2020 The Newsreader Project Authors (http://github.com/productiontype/Newsreader)" | Newsreader 16pt Bold, Version 1.003 | `http://scripts.sil.org/OFL` |

Yani iki aile de **SIL Open Font License** (OFL) ile dağıtılır: yazı tipini bir yazılımla birlikte depoda tutmak ve sunmak
serbesttir. Lisans metninin kendisi (ad 13, "License Description") dosyaların içinde yoktur, yalnız adresi vardır; klasörde de ayrı
bir lisans dosyası yoktur (aşağıda "Dikkat!").

Dört dosya da değişken yazı tipidir (içlerinde `fvar` tablosu var), ama eksenleri farklı:

- Plex dosyalarında tek eksen kalınlıktır (`wght`) ve dosyanın kendisi 100–700 arasını taşır. `@font-face` `font-weight: 400 700`
  dediği için tarayıcı bu dosyayı 400–700 aralığında kullanır.
- Newsreader dosyalarında kalınlık ekseni yoktur, kalınlık sabit 700'dür; tek eksen optik boyuttur (`opsz`, 6–72). Bu, aracın
  Google'dan `opsz,wght@6..72,700` diye istemesinin sonucudur.

### Adların kuralı

Araç her dosyayı `<aile önadı>-<kalınlık ya da aralık>-<alt küme>.woff2` diye adlandırır: `plex-sans` + `400-700` + `latin`.
Ad yalnız bu üç şeye bağlıdır, içeriğe değil (önemi "Dikkat!"te).

## Kimle konuşur?

- **Üreten:** [../../araclar/yazitipi-indir.md](../../araclar/yazitipi-indir.md) — `AILELER` (`IBM+Plex+Sans:wght@400;700`,
  `Newsreader:opsz,wght@6..72,700`), `ALT_KUMELER` (`latin`, `latin-ext`), modern tarayıcı kimliği (`UA`) ile woff2 ister; aynı
  dosya iki kalınlığa verilmişse bir kez indirir ve aralık yazar. Aynı çalıştırmada `00a-yazitipi.css`'i baştan yazar. İnternet
  ister; elle, yalnız yazı tipi değişecekse çalıştırılır.
- **Sunan:** [../../sunucu/http.md](../../sunucu/http.md) — `MIME['.woff2'] = 'font/woff2'`; `statikGonder` `font/` türünü
  `Cache-Control: public, max-age=31536000, immutable` ile gönderir (bir yıl, "değişmez"); woff2 zaten sıkıştırılmış olduğundan
  gzip/brotli uygulanmaz (yalnız `text/` ve bazı `application/` türleri sıkıştırılır).
- **İsteyenler:**
  - `public/css/parcalar/00a-yazitipi.css` (birleşik `/css/style.css` içinde) — dört `@font-face`.
  - `public/index.html` ([../KLASOR.md](../KLASOR.md)) — iki Plex dosyasını `<link rel="preload" … as="font" type="font/woff2"
    crossorigin>` ile stilden önce indirtir (ilk çizimde yazı değişimi görünmesin). Newsreader ön yüklenmez.
  - [../sw.md](../sw.md) — `sw.js`'in `KABUK` listesinde dört dosya da var: servis çalışanı kurulunca önbelleğe alınır.
- **Adı geçen yer:** `sunucu/ortak.js` `KISA_AD_YASAK` — `yazitipi` okul adresi (kısa ad) olarak seçilemez.
- **Testte adıyla isteyen:** `testler/test-okul-agi.js` (aşağıda).
- **Laboratuvar:** `tasarim/tema-secimi.html` bu klasörü kullanmaz; denediği bütün aileleri (IBM Plex Sans ve Newsreader dahil;
  ayrıca Source Sans 3, Source Serif 4, Figtree, Public Sans) Google Fonts'tan çeker
  ([../../tasarim/KLASOR.md](../../tasarim/KLASOR.md)).

## Nasıl çalışır (adım adım)?

```
Yazı tipi değişecek (geliştirici):
  node araclar/yazitipi-indir.js        (internet gerekir)
     Google Fonts CSS ─► latin + latin-ext blokları ─► public/yazitipi/<aile>-<kalınlık>-<alt küme>.woff2
     ─► public/css/parcalar/00a-yazitipi.css baştan yazılır
  ad değiştiyse elle: index.html preload satırları, sw.js KABUK (+ SURUM), test-okul-agi.js, eski .woff2'leri sil

Sayfa açılışı (tarayıcı):
  index.html ─► preload: plex-sans-400-700-latin(.woff2), -latin-ext
            ─► /css/style.css?v=… ─► @font-face'ler; metin önce sistem yazı tipiyle (swap), dosya gelince değişir
            ─► başlık çizilince newsreader-700-latin(-ext) istenir
  GET /yazitipi/x.woff2 ─► 200 font/woff2, Cache-Control: public, max-age=31536000, immutable
  sonraki açılışlarda tarayıcı önbelleğinden (ve servis çalışanının önbelleğinden) gelir, istek gitmez
```

## Dikkat!

- **Aynı adla yeni içerik tarayıcıya ulaşmaz.** Dosyalar bir yıl "değişmez" diye önbelleğe alınır ve servis çalışanı da saklar.
  Aracı aynı ayarla yeniden çalıştırıp Google'dan güncellenmiş bir dosya alırsan ad aynı kalır, daha önce girmiş tarayıcılar
  eskisini kullanmaya devam eder. İçerik değişiyorsa adı da değiştir (aracın `dosya` önekini).
- **Ad değişirse dört yer elle güncellenir:** `public/index.html`'deki iki `preload` satırı, `public/sw.js`'teki `KABUK` listesi
  (ve `SURUM`'u artır ki eski önbellek silinsin), `testler/test-okul-agi.js`'teki adlar, ve artık kullanılmayan eski `.woff2`'leri
  bu klasörden silmek (araç eskileri silmez).
- **Lisans dosyası yok.** OFL, yazı tipi yeniden dağıtılırken telif bildiriminin ve lisansın yanında bulunmasını ister; bunlar
  ayrı bir metin dosyasında ya da yazı tipinin içindeki meta veri alanlarında durabilir. Telif satırları dosyaların içinde var;
  lisansın metni (ad 13) yok, yalnız adresi (ad 14) var. Depo herkese açık olduğundan (yazı tipleri de onunla
  dağıtılıyor) buraya `OFL.txt` gibi bir lisans dosyası eklenmesi önerilir — bu belge hukuki değerlendirme değildir; dosya
  eklenmedi. Eklenirse bilmen gereken: sunucunun tür tablosunda `.txt` yok, böyle bir dosya `/yazitipi/OFL.txt` adresinden
  `application/octet-stream` olarak (indirilecek dosya gibi) verilir; ve bu belge onu adıyla anmalı (klasör denetçisi arar).
- **Newsreader yalnız 700.** CSS'te bir başlığa `font-weight: 600` verilirse tarayıcı 700'ü kullanır; Plex ise 400–700 arasını
  gerçekten çizer (500 ve 600 de doğru görünür).
- **Yalnız Latin alfabesi.** Kiril, Yunan, Arap harfleri bu dosyalarda yok; tarayıcı onları sistem yazı tipiyle çizer. "Çok dil"
  işinde Arapça (sağdan sola) eklenirse o dil için yeni bir aile ya da alt küme gerekir.
- **`ı` ile `İ` ayrı dosyalarda.** `ı` (U+0131) latin dosyasının `unicode-range`'inde ayrıca yazılıdır; `İ` (U+0130), `ğ`, `ş`
  latin-ext'tedir. Bir alt kümeyi kaldırırsan Türkçe harflerin bir kısmı sistem yazı tipiyle çizilir.
- **Bu klasöre başka şey koyma.** Klasördeki her dosya herkese açık sunulur (`.md`, `_` ya da nokta ile başlayanlar hariç).

## Testleri

- `testler/test-okul-agi.js` (sunucu ister) — 300 öğrencinin okul adresinden ilk açılışını taklit eder; her öğrenci önce iki Plex
  dosyasını (`/yazitipi/plex-sans-400-700-latin.woff2`, `…-latin-ext.woff2`), uygulama çalıştıktan sonra iki Newsreader dosyasını
  ister; hiçbirinin 429/503 almaması beklenir. Dosyalardan biri silinir ya da adı değişirse orada görünür.
- `testler/test-kucult.js` (sunucusuz) — bütün CSS parçalarını (`00a-yazitipi.css` dahil) birleştirip yorumların atıldığını ve
  süslü parantezlerin dengeli olduğunu denetler; aracın yazdığı CSS bozuksa orada görünür.
- Bu dosyaları doğrudan açıp içeriğini denetleyen bir test yok.
- Elle: siteyi aç, tarayıcının Geliştirici Araçları → Ağ sekmesinde `/yazitipi/…woff2` isteklerinin 200 (`font/woff2`) döndüğünü,
  yanıt başlığında `max-age=31536000, immutable` olduğunu ve başlıkların Newsreader, gövdenin IBM Plex Sans ile çizildiğini gör.

## Son durum

- `git log -- public/yazitipi`: 3 commit, hepsi 2026-09-08. `668a907 commit 154`: `newsreader-700-latin-ext.woff2` (aynı commit
  `00a-yazitipi.css`'i ekledi). `a2362e8 commit 155`: `newsreader-700-latin.woff2` ve `plex-sans-400-700-latin-ext.woff2`.
  `4ba12d6 commit 156`: `plex-sans-400-700-latin.woff2` (aynı commit aracın ilk satırlarını ekledi). O günden beri hiçbiri
  değişmedi.
- Açık iş: lisans dosyası önerisi (yukarıda; karar kullanıcının).
- Planlı işlerden etkileyebilecekler: "Arayüz önizlemesi" — kullanıcı üç tasarımdan birini seçince bir "tasarım dili" tanımı
  yazılacak; başka yazı tipleri seçilirse yeni dosyalar bu klasöre araçla gelir ve yukarıdaki dört yer güncellenir. "Çok dil"
  (Arapça gibi Latin dışı alfabeler) yeni alt küme ya da aile gerektirebilir; tanımda yazı tipinden söz edilmiyor.
