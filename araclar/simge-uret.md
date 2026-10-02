# araclar/simge-uret.js

Eğitim Evi'nin uygulama simgesini (kırmızı zeminde bacalı, kapısı hafif aralık beyaz ev) tek bir şekil listesinden hem SVG
hem dört PNG olarak, dış paket kullanmadan üretir: `public/simge.svg`, `simge-192.png`, `simge-512.png`,
`simge-maskeli-512.png` ve bildirim rozeti `simge-rozet.png`.

## Bu dosya ne yapar?

Site telefona ya da bilgisayara uygulama gibi kurulabilir (PWA). Kurulunca ana ekranda, sekmede ve bildirimlerde bir simge
görünür; her yer başka boyut ve biçim ister: tarayıcı sekmesi ve iPhone ana ekranı için 192 px, kurulum ve açılış
ekranı için 512 px, Android'in daire ya da kare kırptığı "maskeli" simge için kenarında boşluk bırakılmış 512 px, bildirim
çubuğu için tek renkli küçük bir rozet. Bunları bir çizim programında ayrı ayrı çizmek hem zahmetli hem tutarsızlık
kaynağıdır.

Bu araç evi `0..100`'lük bir iç alanda **tek bir şekil listesi** (`EV`) olarak tanımlar ve bütün dosyaları o listeden
üretir; SVG ile PNG'lerden biri değişip öbürü eski kalamaz. PNG'yi de kendisi kurar: her pikseli 8×8 noktadan örnekleyerek
(kenar yumuşatma) boyar, sonra PNG dosyasının parçalarını (imza, `IHDR`, `IDAT`, `IEND`) Node'un kendi `zlib`'iyle yazar.
Projenin "tek npm bağımlılığı `pg`" kuralı bu yüzden bozulmaz.

Çizimin anlamı dosyanın başında yazılı: bacası olan bir ev, kapısı hafif aralık, aralıktan içerideki sarı ışık görünüyor ve
zemine düşüyor — "kapımız herkese açık". Kullanıcının seçtiği bu çizim 27 Eylül'de (`commit 523`) geldi; önceki bacasız,
kapısı yalnız bir boşluk olan evin yerini aldı.

## İçinde neler var?

### PNG yazımı

- `crc32(buf)` (iç) — PNG parçalarının sağlama toplamı; 256'lık tabloyu ilk çağrıda kurup işlevin üstünde saklar.
- `chunk(tur, veri)` (iç) — bir PNG parçası: 4 bayt uzunluk + 4 harflik tür + veri + CRC.
- `pngYaz(boyut, piksel)` (iç) — kare, 8 bit RGBA (renk türü 6) PNG: her satırın başında filtre baytı `0` (filtresiz),
  `piksel(x, y)` → `[r, g, b, a]`; satırlar `zlib.deflateSync(…, { level: 9 })` ile sıkıştırılır.

### Çizim verisi

- `RENK` (dışa açık) — `zeminUst` `#d62839` (sitenin ana kırmızısı), `zeminAlt` `#a51d2c` (zemin yukarıdan aşağı buna
  koyulaşır), `beyaz`, `isik` `#ffd35a` (içerideki ışık ve kulp), `kanat` `#a51d2c` (aralık duran kapı kanadı).
- `KOSE` (dışa açık) — `0.22`: yuvarlak köşenin yarıçapı, kenar uzunluğunun oranı.
- `EV` (dışa açık) — boyama sırasıyla şekiller (sonraki üstte kalır):

  | Sıra | Ad | Tür | Ölçü (0..100) | Renk | Rozette |
  |---|---|---|---|---|---|
  | 1 | kapı aralığındaki ışık | `dortgen` | 41.5..58.5 × 59.5..84 (kapıdan biraz taşkın, kenarı duvarın altında) | ışık | yok |
  | 2 | ev | `delikli` | çatı tepesi 50,16, saçaklar 10,46 / 90,46; gövde 20..80 × 46..84; baca 66..76, tepesi 20 | beyaz | var |
  |   |  |  | delikler: kapı 42..58 × 60..84, pencereler 27..37 ve 63..73 × 54..64 |  |  |
  | 3 | zemine düşen ışık | `cokgen` | 52.3,84 · 58,84 · 68,96 · 50.5,96; saydamlık yukarıda 0.75, aşağıda 0 | ışık | yok |
  | 4 | kapı kanadı | `cokgen` | 42,60 · 52.3,62 · 52.3,84 · 42,84 (açık kalan yarık 52.3..58) | kanat | var |
  | 5 | kulp | `daire` | merkez 50.3,73.5, yarıçap 1 | ışık | yok |

  Ev (çatı + baca + gövde) tek bir dış çizgidir, kapı ve pencereler onda deliktir: ayrı parçalar yan yana çizilince
  tarayıcıda ve Android'de birleşim yerinde ince bir çizgi kalıyordu (dosyadaki yorum). Baca da bu dış çizginin parçasıdır:
  sol kenarı çatıya 28'de, sağ kenarı 35.5'te kavuşur. `EV`'in üstündeki yorum bacayı ayrı bir dikdörtgen gibi
  "66..76 x 20..38 (alt ucu çatının içinde kalır)" diye anlatır; görünen şekil aynıdır, çünkü 38'e inen kısım zaten çatının
  beyazında kalırdı.
- `SEKILLER` (iç) — her şeklin sınır kutusu ve RGB rengi önceden hesaplanmış hâli; `EV_KUTUSU` (iç) hepsini saran kutu.

### Geometri yardımcıları (iç)

- `kutuda(u, v, k)` — nokta dikdörtgende mi; `cokgende(u, v, n)` — çift-tek kuralıyla (ışın sayma) nokta çokgende mi;
  `sinirKutusu(s)` — şeklin `[sol, üst, sağ, alt]`'ı; `sekildeMi(s, u, v)` — türüne göre (delikli şekilde: çokgende ve
  hiçbir delikte değil).
- `zeminRengi(t)` — `t` (0 üst, 1 alt) için iki kırmızı arasında doğrusal geçiş.
- `noktaRengi(X, Y, boyut, kenarPay, yuvarlak)` — tek bir örnek noktasının rengi: yuvarlak köşenin dışındaysa saydam; değilse
  zemin rengi, üstüne sırayla her şeklin rengi (saydamlıklı şekilde saydamlık şeklin kendi yüksekliği boyunca değişir).
- `simgeCiz(boyut, kenarPay, yuvarlak)` — piksel boyacısı: evden ve yuvarlak köşelerden uzak pikseller düz zemin renginde
  (geçiş doğrusal olduğu için ortalaması piksel ortasındaki renktir; hız için örneklenmez), öteki pikseller 64 noktanın
  saydamlıkla ağırlıklı ortalaması.
- `rozetCiz(boyut, kenarPay)` — bildirim rozeti: şeffaf zeminde beyaz siluet. Yalnız `siluet: true` şekiller (ev ve kapı
  kanadı) girer; saydamlık, 64 noktadan kaçının siluete düştüğüdür. Kapının açık yarığı boş kalır, ışık ve kulp yoktur.

### SVG

- `onalti(c)` (iç) — `[r, g, b]` → `#rrggbb`; `sayi(n)` (iç) — 2 ondalığa yuvarlar.
- `svgUret()` (dışa açık) — 192×192 `viewBox`'lı SVG metni: `rx` = 192 × 0.22 yuvarlak köşeli, dikey geçişli zemin
  (`linearGradient id="zemin"`), kenar payı 18 ile ölçeklenen bir grup (`translate(18 18) scale(1.56)`) içinde `EV`'in her
  şekli (`rect`, `polygon`, `circle`; delikli ev `fill-rule="evenodd"` bir `path`); saydamlıklı şekle kendi geçişi
  (`gecis<n>`). İçinde "araclar/simge-uret.js üretir; elle değiştirme" yorumu ve `<title>Eğitim Evi</title>` vardır.

### Dosyalar

- `pngUret(boyut, kenarPay, yuvarlak)` (dışa açık) — `pngYaz(boyut, simgeCiz(…))`.
- `rozetUret(boyut)` (dışa açık) — kenar payı 0 ile rozet; ev genişliğin %80'i olduğu için (10..90) bildirim simgesi payı
  kendiliğinden kalır.
- `uret(dosya, boyut, kenarPay, yuvarlak)` (iç) — üretip `public/`'e yazar, boyutu ve KB'yi yazdırır; `yuvarlak === 'rozet'`
  ise rozet üretir.

| Dosya | Boyut | Kenar payı | Köşe | Nerede kullanılır |
|---|---|---|---|---|
| `simge.svg` | 192 (vektör) | 18 | yuvarlak | hiçbir sayfa bağlamıyor (2 Ekim, `git grep`); vektör kopya olarak duruyor |
| `simge-192.png` | 192 | 18 (iç alan %81) | yuvarlak | `<link rel="icon">` (`index.html`, `404.html`, `okul-bulunamadi.html`, `kvkk/`, `kosullar/`, `indir/`), `apple-touch-icon` (`index.html`, `indir/`), `manifest.json` (`any`), `sw.js` (önbellek + bildirim `icon`) |
| `simge-512.png` | 512 | 48 (%81) | yuvarlak | `manifest.json` (`any`), `sw.js` önbelleği |
| `simge-maskeli-512.png` | 512 | 96 (ev ortadaki %62,5'te) | kare | `manifest.json` (`maskable`): telefon kırpar; Android'in daire maskesi (ortadaki %80) evi kesmez |
| `simge-rozet.png` | 96 | 0 | — (tek renk siluet) | `sw.js` bildirim `badge`; 24 dp'de gösterilir, 96 px = 4× |

Dışa açılanlar: `EV`, `RENK`, `KOSE`, `pngUret`, `rozetUret`, `svgUret`. Bugün depoda bunları `require` eden yok; dosya
yalnız `node araclar/simge-uret.js` ile çalıştırılır (`require.main === module` iken üretir; yüklenince hiçbir şey yazmaz).

## Kimle konuşur?

- **Çağırdıkları:** yalnız Node'un `fs`, `path` ve `zlib`'i.
- **Yazdıkları:** `public/simge.svg`, `public/simge-192.png`, `public/simge-512.png`, `public/simge-maskeli-512.png`,
  `public/simge-rozet.png` (beşi de depoda izlenir ve web'den sunulur).
- **Dosyaları kullananlar:** sayfaların `<link rel="icon">` ve `apple-touch-icon` satırları (`public/index.html` ve dış
  sayfalar); `public/manifest.json`; [../public/sw.md](../public/sw.md) (kabuk önbelleği ve bildirimin `icon`/`badge`'i);
  [../public/js/parcalar/04-pwa.md](../public/js/parcalar/04-pwa.md) (kurulum). Sunucu bunları düz statik dosya olarak verir;
  [../sunucu/http.md](../sunucu/http.md) resimleri **bir yıl** önbellekte tutturur (`image/*` → `max-age=31536000, immutable`).
- **Elle eşlenmesi gerekenler** (araç bunları üretmez):
  - Android deposundaki simgeler (`simge_on`, `simge_tek`, `simge_marka`, `bildirim_simge`) aynı sayılarla elle yazılmıştır.
  - Sitenin sol üstündeki ince çizgili ev logosu: `public/index.html`'deki `.brand` ve `.site-marka` SVG'leri ile
    `404.html`, `okul-bulunamadi.html`, `kvkk/kvkk.html`, `kosullar/kosullar.html`, `indir/indir.html`'deki `.site-marka`
    (24×24, `currentColor`, açık/koyu temada çalışır). Aynı evi çizgiyle anlatır ama koordinatları ayrı yazılmıştır.
- Belgeler: [belge/KILAVUZ.md](../belge/KILAVUZ.md) ("Telefona uygulama olarak kurma" sonu: "Simgeleri yeniden üretmek
  için"), `belge/NASIL-YAPILDI.html` ("PNG üretici").

## Nasıl çalışır (adım adım)?

```
node araclar/simge-uret.js
  simge.svg              ← svgUret()                       (EV listesinden SVG öğeleri)
  simge-192.png          ← pngYaz(192, simgeCiz(192, 18, yuvarlak))
  simge-512.png          ← pngYaz(512, simgeCiz(512, 48, yuvarlak))
  simge-maskeli-512.png  ← pngYaz(512, simgeCiz(512, 96, kare))
  simge-rozet.png        ← pngYaz(96, rozetCiz(96, 0))

her piksel (x, y):
  evden ve yuvarlak köşeden uzak mı? → düz zemin rengi (piksel ortası)
  değilse 8×8 örnek: noktaRengi → köşe dışında mı (saydam) → zemin → EV şekilleri sırayla üstüne
          → saydamlıkla ağırlıklı ortalama → [r, g, b, a]
```

Çizimi değiştirmek istersen (ör. pencereyi büyütmek):

1. `EV`'deki sayıları değiştir; `node araclar/simge-uret.js` çalıştır (2 Ekim'de bu bilgisayarda iki ölçümde 6 ve 8,6 saniye).
2. Tarayıcı resimleri bir yıl önbellekte tuttuğu için adreslerdeki `?v=` sayısını **her yerde** bir artır: bütün `.html`
   sayfalar (`index.html` dahil), `manifest.json`, `sw.js` (bildirimin `icon` ve `badge`'i dahil). `sw.js`'te `SURUM`'u da
   artır. Bugün hepsi `?v=2`, `SURUM` `egitim-evi-v9`. `?v`'siz simge bağlantısı kalmadığını dosyadaki komutla denetle:
   `grep -rn "simge-[a-z0-9-]*\.png\"\|simge-[a-z0-9-]*\.png'" public`
3. Android simgelerini ve sitenin çizgi logosunu aynı ölçülere göre elle güncelle.

## Dikkat!

- **`?v=` artırılmazsa eski simge takılı kalır.** `sunucu/http.js` `image/*` türündeki her dosyayı bir yıl, `immutable`
  önbelleğe aldırır; dosya adı ya da `?v=` değişmezse tarayıcı yeni simgeyi hiç istemez. Servis çalışanı da simgeleri
  kendi önbelleğinde tutar (`SURUM`).
- **Simgeler ve çizgi logo ayrı ayrı bakım ister.** Araç yalnız `public/simge*` dosyalarını üretir. Dosyanın başındaki yorum
  Android simgelerini hatırlatır ama sitenin çizgi logosunu (`.brand`, `.site-marka`) anmaz; ev değişirse onlar da elle
  değişmeli.
- **`simge.svg` sayfada kullanılmıyor.** 2 Ekim'de bütün depo tarandı (`git grep`): hiçbir sayfa, `manifest.json` ya da
  `sw.js` onu bağlamıyor; kodda adı yalnız bu araçta geçiyor (belgelerden de yalnız TANITIM.md'nin klasör ağacında). Elle düzenlemenin anlamı yok: araç her çalıştığında üzerine yazar
  (SVG'deki yorum da bunu söyler).
- **Belirlenimci çıktı.** Aynı kodla her çalıştırma bayt bayt aynı dosyaları üretir. 2 Ekim'de aracın bir kopyası çıktıyı
  geçici bir klasöre yazacak biçimde iki ayrı kez (belge yazılırken ve denetimde) çalıştırıldı: ikisinde de beş dosyanın
  SHA-1'i depodakilerle aynıydı. Yani aracı gereksiz yere
  çalıştırmak `git status`'ta değişiklik göstermez; gösteriyorsa çizim gerçekten değişmiştir.
- **Maskeli simgenin payı.** 512'de 96 piksel pay, evi ortadaki 320 piksele (%62,5) sığdırır. W3C'nin maskeli simge
  "güvenli bölgesi" ortadaki %80'lik dairedir; payı küçültürsen saçaklar ve ışık kırpılabilir.
- **Rozet yalnız saydamlıktır.** Telefon bildirim rozetinin rengini değil saydamlığını kullanır; renkli bir simge verilirse
  bildirim çubuğunda düz beyaz kare görünür. Bu yüzden rozet beyaz siluettir ve ışık/kulp gibi iç ayrıntılar girmez.
- **`public/`'e doğrudan yazar.** Çıktı yolu (`CIKTI`) sabittir; aracı çalıştırmak depodaki izlenen dosyaların üzerine
  yazar. Yalnız çizimi gerçekten değiştirdiğinde çalıştır ve ayrı bir commit'te `?v=` artışıyla birlikte gönder.
- **Okul simgesi bu değil.** Planlı "Paneller" işindeki okul simgesini (müdürün yüklediği 128×128 görsel) bu araç üretmez; o
  okulun kendi dosyası olacak.

## Testleri

- Simgelerin içeriğini denetleyen otomatik test yok.
- `testler/test-okul-agi.js` bir öğrencinin ilk açılışını taklit ederken `/simge-192.png?v=2` ve `/simge-512.png?v=2`'yi de
  ister (ağ yükü ölçümü); dosyaların varlığına dolaylı bir bakıştır, içeriğe bakmaz.
- Elle: aracı çalıştır → `git status` temiz kalmalı (çizim değişmediyse). Çizimi değiştirdiysen `public/simge.svg`'yi ve
  PNG'leri tarayıcıda aç; siteyi koyu ve açık temada, telefona kurulu hâlde ve bir bildirimde (rozet) gör.

## Son durum

- `git log --follow`: 3 commit. `abc93b1 commit 331` (2026-09-26): ilk hâl (PNG yazıcı ve o günkü çizim).
  `05812f9 commit 332` (2026-09-26): üç PNG'yi üreten `uret` ve çağrıları eklendi (192, 512, maskeli 512).
- `0d27eba commit 523` (2026-09-27, logo): çizim baştan değişti. Önceki simge kırmızı zeminde beyaz bir evdi (üçgen çatı,
  dikdörtgen gövde, zemin renginde kapı ve iki pencere boşluğu; baca, ışık ve kapı kanadı yoktu) ve doğrudan piksel
  kurallarıyla çiziliyordu. Yeni hâlde tek `EV` listesi, 8×8 kenar yumuşatma, SVG çıktısı (`public/simge.svg`) ve bildirim
  rozeti (`simge-rozet.png`) geldi; dosya `require.main` denetimi ve `module.exports` aldı. Aynı commit PNG'leri yeniden
  üretti ve sayfalardaki, `manifest.json`'daki, `sw.js`'teki simge adreslerine `?v=2` ekleyip `SURUM`'u `v9`'a çıkardı.
- 2 Ekim'de araç geçici bir kopyayla iki kez çalıştırıldı; depodaki beş dosyayla bayt bayt aynı çıktı verdi. Denetimde
  kodda hata bulunmadı; tek bakım notu, baştaki yorumun sitenin çizgi logosunu anmaması ("Dikkat!").
- Planlı işlerden ilgili olanlar: Android uygulamasının simgeleri (ayrı depo) bu ölçülerle eşli kalmalı; "Arama motorunda
  görünme" işindeki Open Graph önizlemesi bir paylaşım görseli isteyecek (bu araçla üretilebilir; henüz istenmedi).
