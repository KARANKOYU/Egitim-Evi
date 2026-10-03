# testler/test-resim-kucult.js

Tarayıcıda resim küçültmeyi (`public/js/parcalar/04f-resim-kucult.js`) başsız Edge'de (yoksa Chrome) gerçek tuvalle, sunucusuz deneyen
paket (67 denetim): ölçek ve ad kuralları, fotoğraf / ekran görüntüsü / saydam ayrımı, dosya başından tür-boyut-yön okuma, gerçek
küçültme (yön, EXIF silme, arayüzün donmaması) ve küçültmeyi kullanan üç ekranın (ek, ödev teslimi, okul sayfası) davranışı.

## Bu dosya ne yapar?

Telefonla çekilen fotoğraf yüklenmeden önce kişinin kendi cihazında küçültülür: uzun kenar 2048 px, JPEG 0,82, yön uygulanır, içindeki
konum/tarih/cihaz bilgisi gider; ekran görüntüsü PNG kalır, saydam resim saydam kalır, bir şey ters giderse asıl dosya hatasız gider
([../public/js/parcalar/04f-resim-kucult.md](../public/js/parcalar/04f-resim-kucult.md)). Bu kararların çoğu ancak gerçek bir
tarayıcıda denenebilir: `<canvas>`, `createImageBitmap`, `toBlob`, tarayıcının JPEG/PNG/WebP kodlayıcısı ve EXIF yönünü kendisinin
uygulayıp uygulamadığı Node'da yok. Bu yüzden paket bilgisayardaki Edge'i (yoksa Chrome'u) başsız açar, ön yüz parçalarını sayfaya
yükler, test resimlerini sayfanın içinde üretir ve sonuçları Node'a geri alır.

Dosya başındaki yorum kapsamı şöyle sayar: kurallar (uzun kenar 2048 / kısa kenar 1024 sınırı, ad değişimi, aday seçimi); fotoğraf /
ekran görüntüsü / çizim / taranmış sayfa / saydam ayrımı (eşikler); dosya başı (JPEG boyutu ve EXIF yönü büyük ve küçük sonlu, PNG
saydamlık olasılığı, hareketli PNG / WebP, WebP boyutu, HEIC imzası); büyük JPEG'in küçülmesi, yönün uygulanması (tarayıcının kendisi ve
elle: 3, 6, 8), EXIF / GPS / cihaz bilgisinin gitmesi, arayüzün donmaması; 500 KB altı ve küçülmeyen dosyaya dokunulmaması, PNG
fotoğrafın JPEG olması, saydam ve ekran görüntüsü PNG'nin PNG kalması, hareketli PNG'ye dokunulmaması, WebP fotoğrafın JPEG olması,
açılamayan HEIC'in olduğu gibi gitmesi, aynı anda tek resim; arayüzde "Küçültülüyor…" ve "8,4 MB → 620 KB" yazıları, küçülmüş dosyanın
yeni adıyla gitmesi, yer denetiminin küçülmüş boyutla yapılması, kaldırılan / iptal edilen dosyanın gönderilmemesi. Tarayıcı
`--remote-debugging-pipe` ile sürülür (TCP portu açılmaz), test verisi sayfada üretilir (en büyüğü ~3,5 MB), Edge ya da Chrome yoksa
paket atlanır.

## İçinde neler var?

### Node tarafı: sabitler ve tarayıcı

- `KOK`, `PARCA` (`public/js/parcalar`), `PARCALAR` — sayfaya sırayla yüklenen sekiz parça: `00-durum.js`, `01-yardimcilar.js`,
  `02-ikonlar.js`, `03-mesaj-modal.js`, `04d-ekler.js`, `04f-resim-kucult.js`, `14b-odev-teslim.js`, `19g-okul-sayfasi.js`. Gerçek
  pakette bütün parçalar tek bir IIFE'de birleşir ([../sunucu/http.md](../sunucu/http.md)); burada her biri ayrı ayrı genel alanda
  çalıştırılır, böylece test iç adlara (`kucultCoz`, `KUCULT_YON`, `teslimCiz`…) erişip üzerine yazabilir.
- `TARAYICILAR` — sırayla denenen yollar: `EE_TARAYICI` ortam değişkeni, Edge (`C:/Program Files (x86)/…/msedge.exe`,
  `C:/Program Files/…/msedge.exe`), Chrome (`C:/Program Files/Google/Chrome/…/chrome.exe`), Linux'ta `/usr/bin/microsoft-edge`,
  `google-chrome`, `chromium`, `chromium-browser`. İlk var olan kullanılır.
- `kontrol(ad, sart, detay)` — detay metin değilse JSON'a çevrilerek basılır.
- `tarayiciAc(exe)` — işletim sisteminin geçici klasöründe `ee-kucult-*` profil klasörü açar; tarayıcıyı `--headless=new --disable-gpu
  --no-first-run --no-default-browser-check --disable-extensions --remote-debugging-pipe --user-data-dir=<profil> about:blank` ile başlatır
  (`windowsHide`). Chrome DevTools Protokolü (CDP) iletileri 3. ve 4. dosya tanıtıcısındaki borudan, `\0` ile ayrılmış JSON olarak
  gider gelir. `Target.getTargets` → sayfa → `Target.attachToTarget` (flatten) ile oturum alınır. Dönen nesne:
  - `calistir(ifade)` — `Runtime.evaluate` (`awaitPromise`, `returnByValue`); sayfada hata atılırsa Node'da `Error` fırlatır.
  - `kapat()` — `Browser.close` (en çok 3 sn bekler), süreci öldürür, 800 ms bekler, profil klasörünü siler (kilitliyse sessizce bırakır).
- `pngYap(renkTuru, trns, metin, actl)` — 64×48'lik elle yapılmış PNG (base64): renk türü (2 RGB, 6 RGBA, 0 gri), isteğe bağlı `tRNS`,
  300 baytlık `tEXt` ve `acTL` (hareket) parçası. CRC'ler `zlib.crc32` ile hesaplanır. Altı tane gönderilir: `rgb`, `rgbMetin`, `rgbTrns`,
  `rgba`, `gri`, `apng`.

### Sayfa tarafı (işlevler `toString()` ile sayfaya gönderilir)

- `sayfaHazirla(pngler)` — `window.T`'yi kurar: sabit tohumlu (12345) rastgele sayı üreteci (`rnd`; her koşuda aynı resimler), `tuval`,
  `kodla` (`toBlob`), `bayt`, örnek resim üreticileri — `foto(en, boy, gurultu)` (eğim, yarı saydam daireler, sensör gürültüsü, sol üstte
  kırmızı kare: yön denemesi için), `ekran` (düz zemin, başlık çubuğu, yazılar), `cizim`, `griTarama` (gürültülü siyah-beyaz taranmış
  sayfa), `saydam` (saydam zeminde logo), `karisik` (dörtte biri fotoğraf olan telefon ekran görüntüsü), `egim` (eğimli zeminli slayt) —;
  `exifYap(yon, kucukSonlu)` (üretici "TestTelefon", yön, GPS enlemi 41° içeren 116 baytlık TIFF'i APP1'e sarar), `exifEkle` (JPEG'in
  `FF D8`'inden hemen sonra APP1'i ekler), `coz`, `nokta`, `kirmizi`, `icerir` (baytlarda metin arar), `bekleKi(kosul, ms)` (20 ms
  aralıkla, varsayılan 20 sn), `sirayiBekle` (küçültme kuyruğunun boşalmasını bekler), `png` (Node'dan gelen PNG'ler `Blob` olarak),
  `SAKLA`.
- `grupBirim()` — 1. bölümün verisi: `kucultOlcek` ile altı boyut, `kucultAd` ile altı ad, `resimKucultulebilir` ile beş aday, `KUCULT`
  eşikleri, `kucultOlc` + `kucultFotoMu` ile sekiz örnek resmin ölçümü, `kucultHedef` tablosu, `kucultBaslik` ile JPEG/PNG/WebP/HEIC
  başları, `kucultYonUygulaniyor('bit')`.
- `grupAkis()` — 2. bölümün verisi: `resimKucult` ile gerçek küçültmeler. Elle döndürme için `kucultCoz`'u EXIF'siz ham resmi çözen bir
  işlevle, `KUCULT_YON`'u `{ bit: false, img: false }` ile değiştirir (tarayıcı yönü uygulamıyormuş gibi); "aynı anda tek resim" için
  `kucultCoz`'u açık çözme sayısını sayan bir sarmalayıcıyla değiştirir. İkisini de `finally` ile geri koyar.
- `grupArayuz()` — 3. bölümün verisi: `XMLHttpRequest`'i giden istekleri biriktiren `SahteXHR` ile değiştirir, `S.token = 'deneme'`;
  ödev tesliminde `teslimCiz`'i, okul sayfasında `fetch`, `osFotolariCiz`, `osOnizlemeCiz`'i sahteleriyle değiştirir, sonra hepsini geri koyar.

### 1) KURALLAR VE SINIFLANDIRMA (31)

- Ölçek (6): 4032×3024 → 2048×1536; 3024×4032 → 1536×2048; 1170×2532 → 1024×2216 (kısa kenar 1024 altına inmez); 1080×8000 → 1024×7585;
  800×600 büyütülmez; 20000×1000 → 17889×894 (16 MP tuval sınırı kısa kenar kuralından baskın).
- Ad (1): `odev.PNG` → `odev.jpg`, `IMG_1.HEIC` → `IMG_1.jpg`, `foto.jpeg` aynı, uzantısız `resim` → `resim.jpg`, `a.b.png` (PNG kalırsa) aynı,
  `x.webp` → `x.jpg`.
- Aday (1): 400 KB `a.jpg` hayır, 600 KB PDF hayır, 600 KB türsüz `a.heic` evet (uzantıdan), uzantısız `x` adlı ama türü `image/png`
  olan 600 KB'lık dosya evet (türden), 600 KB türsüz `a.JPG` evet (büyük harf uzantı).
- Eşikler (1): `altSinir` 500 KB, `uzunKenar` 2048, `kisaKenar` 1024, `kalite` 0,82, `kazanc` 0,8. (`fotoRenk`, `fotoEsit`, `gurultuEsit`
  da okunur ama denetlenmez.) Ardından ekrana bilgi satırı basılır: her örneğin "renk oranı / yan yana eşit" ölçüsü.
- Sınıflandırma (8): fotoğraf ve az gürültülü fotoğraf "fotoğraf"; ekran görüntüsü, çizim, dörtte biri fotoğraf olan ekran görüntüsü ve
  eğimli slayt "fotoğraf değil"; gürültülü taranmış sayfa "fotoğraf gibi"; saydam logo "saydam".
- Hedef tür (2): JPEG → JPEG; PNG fotoğraf → JPEG; PNG ekran → PNG; PNG saydam → PNG; WebP fotoğraf → JPEG; WebP ekran ve saydam → dokunma
  (`''`); HEIC fotoğraf → JPEG; HEIC saydam → dokunma.
- JPEG başı (3): EXIF yönü 6 (büyük sonlu; üretici ve GPS girişlerinin arasında), 640×480, `alfa: false`; küçük sonlu EXIF'te yön 3; EXIF yoksa
  yön 1.
- PNG başı (4): RGB, `tRNS` yok → `alfa: false` (araya giren `tEXt` parçası atlanır); `tRNS` varsa ya da RGBA ise `alfa: null` (noktalara
  bakılır); gri ve `tRNS` yok → `alfa: false`; `acTL` varsa hareketli, yoksa değil.
- WebP başı (4): elle yapılmış `VP8X` başı (alfa + hareket bayrakları) → hareketli, 100×50; tarayıcının kodladığı opak (300×200, saydam
  değil), saydam (320×240, `alfa: null`) ve kalite 1 ile kodlanmış (330×210) WebP'ler. Denetim adlarında tarayıcının seçtiği parça adı
  (`VP8 `, `VP8L`, `VP8X`) yazılır.
- HEIC imzası (1): `ftyp` + `heic` + `mif1` baytları → `tur: 'heic'`.
- Sonda bilgi satırı: "bu tarayıcı EXIF yönünü kendisi uyguluyor: evet/hayır".

### 2) KÜÇÜLTME (20)

- Girdi: 3000×2250, kalite 0,92 JPEG + EXIF (yön 6, GPS, "TestTelefon"), 1,5 MB'tan büyük; üretici ve `Exif` baytları içinde.
- Küçüldü (en az %20 kazanç, `image/jpeg`, JPEG imzası); ad aynı (`IMG_0001.jpg`), tür dönüşümü yok; yön uygulandı: 1536×2048 ve kırmızı
  işaret sağ üstte; çıktıda `Exif` ve "TestTelefon" yok; `kucultmeYazisi` `"N(,N) MB → N KB"` biçiminde.
- Arayüz donmadı: küçültme sürerken 4 ms'lik bir sayaç işler; iki tık arasındaki en uzun süre 300 ms'den az olmalı.
- Elle döndürme (3): yön 3 → 2048×1536, işaret sağ altta; yön 6 → 1536×2048, sağ üstte; yön 8 (küçük sonlu EXIF) → 1536×2048, sol altta.
- 900×675'lik 500 KB altı JPEG olduğu gibi (aynı nesne, yazı boş); 1600×1200 çok gürültülü JPEG (500 KB üstü) `sebep: 'küçülmedi'` ile olduğu
  gibi, adı aynı.
- 1600×1200 fotoğraf gibi PNG (`odev.png`) → `odev.jpg`, `cevrildi: 'PNG → JPEG'`, JPEG imzası. Bu dosya (`T.SAKLA.pngFoto`, 3 MB'tan büyük)
  3. bölümde de kullanılır.
- Aynı PNG'ye IHDR'den sonra `acTL` eklenince (hareketli) olduğu gibi gider, `sebep: 'hareketli resim'`.
- 3200×1600 saydam PNG: PNG kalır (`logo.png`), 2048×1024'e küçülür, köşe noktası tam saydam (alfa 0), ortası dolu (255).
- 2800×2000 ekran görüntüsü PNG: PNG kalır (`ekran.png`); küçüldüyse 2048×1463 olmalı (küçülmediyse de geçer).
- 2400×1800 fotoğraf gibi WebP (kalite 0,95) → `foto.jpg`, `cevrildi: 'WebP → JPEG'`.
- Açılamayan 600 KB'lık sahte HEIC hata vermeden olduğu gibi gider (bir `sebep` ile).
- Üç dosya birlikte verilince (`Promise.all`) aynı anda en çok bir resim çözülür, üçü de küçülür, açık çözme kalmaz.

### 3) ARAYÜZ (16)

Ekler (`04d-ekler.js`, 7):

- `ekAlani('t', 'mesaj')` + `ekAlaniKur('t')`, sonra 3 MB'lık PNG fotoğraf eklenir: satırda önce "Küçültülüyor…", henüz istek gitmedi,
  `ekYukleniyor('t')` doğru (kaydetme bekler).
- Kutudaki ipucu "Büyük fotoğraflar küçültülerek yüklenir." içeriyor.
- Giden istek: `X-Dosya-Adi` (çözülmüş) ve satırdaki ad `odev.jpg`, gövde `image/jpeg` ve asılın %80'inden küçük, adres
  `…/api/ek/yukle?tur=mesaj` ile bitiyor.
- Yüklenirken satır `"N MB → N KB · yükleniyor"`; sahte 200 + `{"ek":{"id":"e1"}}` sonrası `"… · yüklendi"`, `ekIdleri('t')` `['e1']`,
  `ekYukleniyor` yanlış.
- Aynı fotoğraf yeniden eklenip küçültülürken `EYLEMLER['ek-kaldir']` ile kaldırılınca hiç gönderilmez (giden istek 1'de kalır, liste tek satır).
- 2048 baytlık `not.pdf` beklemeden hemen gönderilir.

Ödev teslimi (`14b-odev-teslim.js`, 6) — `teslimDurum`: ödev `o1`, toplam alan 1 MB, dosya başına 50 MB, uzantılar `jpg jpeg png pdf`:

- 3 MB'lık fotoğraf 1 MB'lık alan yüzünden REDDEDİLMEZ (yer denetimi küçültmeden sonraya kalır): satırda "Küçültülüyor…",
  `yukleniyor` 1, hata yok.
- Küçülmüş dosya `odev.jpg` adıyla, 1 MB'tan küçük gövdeyle `…/api/odev-dosya/yukle?odev=o1`'e gider; satırda `"N MB → N KB"` ve `%0`.
- Sahte 200 sonrası liste bir kez yeniden çizilir (`teslimCiz`) ve "odev.jpg — küçültülerek yüklendi, N MB → N KB" notu kalır,
  `yukleniyor` 0.
- Alan 100 KB'a indirilince küçülmüş hâli de sığmaz: gönderilmez, neden "sığmıyor: bu ödev için 100 KB boş yerin kaldı".
- Küçültülürken `EYLEMLER['teslim-iptal']` → gönderilmez, satırda "İptal edildi", `yukleniyor` 0.

Okul sayfası (`19g-okul-sayfasi.js`, 3) — `OS.veri = { fotolar: [] }`, yer `galeri`:

- 3 MB'tan büyük fotoğraf reddedilmez, `#osFotoMesaj`'da "Küçültülüyor…".
- Giden istek `Content-Type: image/jpeg`, gövde 3 MB'tan küçük, adres `…/api/okul-sayfa/foto?yer=galeri` ile bitiyor.
- Son ileti "Fotoğraf küçültülerek yüklendi (N MB → N KB)."

Toplam 31 + 20 + 16 = 67. Sonunda boş satır ve `  GECTI: 67   KALDI: 0`; `KALDI` varsa çıkış kodu 1.

### Özel çıkışlar

- Tarayıcı bulunamazsa: `  ATLANDI  Edge ya da Chrome bulunamadı (EE_TARAYICI ile yol verilebilir)`, ardından `GECTI: 0   KALDI: 0`,
  çıkış 0.
- Sayfadaki adımlardan biri hata atarsa: `KALDI  sayfadaki test çalıştı -> <ileti>`; o ana kadar biten grupların denetimleri yine basılır.
- 180 saniyede bitmezse: `KALDI  test 180 saniyede bitmedi` ve çıkış 1.
- Node tarafında beklenmeyen hata: `KALDI  test çöktü -> <ileti>` ve çıkış 1.

## Kimle konuşur?

- **Node modülleri:** `fs`, `path`, `os`, `zlib`, `child_process.spawn`. [giris.md](giris.md)'yi kullanmaz; sunucuya, veritabanına,
  `localhost`'a istek atmaz (sayfa `about:blank`, yüklemeler sahte `XMLHttpRequest` ve sahte `fetch` ile yakalanır). Diske yalnız geçici
  profil klasörünü yazar; proje klasörüne hiçbir şey yazmaz.
- **Tarayıcı:** bilgisayardaki Edge ya da Chrome (CDP, boru üzerinden).
- **Koruduğu kod:**
  - [../public/js/parcalar/04f-resim-kucult.md](../public/js/parcalar/04f-resim-kucult.md) — bütünüyle: `KUCULT` eşikleri,
    `resimKucultulebilir`, `resimKucult` (zincir, hiç reddetmeme, `sebep`), `kucultmeYazisi`, `kucultOlcek`, `kucultAd`, `kucultOlc`,
    `kucultFotoMu`, `kucultHedef`, `kucultBaslik` (JPEG/PNG/WebP/HEIC), `kucultYonUygulaniyor`, `kucultCoz` / `kucultBitmapCoz`, `KUCULT_YON`.
  - [../public/js/parcalar/04d-ekler.md](../public/js/parcalar/04d-ekler.md) — `ekAlani`, `ekAlaniKur`, `ekDosyalariEkle`, `ekKucultYukle`,
    `ekYukle`, `ekIdleri`, `ekYukleniyor`, `EYLEMLER['ek-kaldir']`, kutunun ipucu yazısı, satır yazıları.
  - [../public/js/parcalar/14b-odev-teslim.md](../public/js/parcalar/14b-odev-teslim.md) — `teslimDurum`, `teslimKuyruk` (yer ayırmanın
    küçültmeden sonra yapılması), `teslimTekYukle`, `teslimBoyutSorunu`, `EYLEMLER['teslim-iptal']`.
  - [../public/js/parcalar/19g-okul-sayfasi.md](../public/js/parcalar/19g-okul-sayfasi.md) — `osDosyaSecildi` (3 MB sınırının küçülmüş
    hâle uygulanması, `Content-Type`'ın küçültmenin türünden gelmesi), `OS`.
  - Yardımcı olarak yüklenenler: [../public/js/parcalar/00-durum.md](../public/js/parcalar/00-durum.md) (`S`),
    [../public/js/parcalar/01-yardimcilar.md](../public/js/parcalar/01-yardimcilar.md) (`$`, `esc`, `EYLEMLER`, `sayiTR`),
    [../public/js/parcalar/02-ikonlar.md](../public/js/parcalar/02-ikonlar.md), [../public/js/parcalar/03-mesaj-modal.md](../public/js/parcalar/03-mesaj-modal.md)
    (`mesajGoster`). `SAYFALAR` normalde [../public/js/parcalar/08-ana-sayfa.md](../public/js/parcalar/08-ana-sayfa.md)'de tanımlanır;
    test onu sayfaya kendisi koyar (`var SAYFALAR = {}`), çünkü `19g` yüklenirken ona yazar.
  - Bu ekranların gerçek uçları (bu pakette çağrılmaz, yalnız adresleri denetlenir): `POST /api/ek/yukle`
    ([../sunucu/bolumler/ekler.md](../sunucu/bolumler/ekler.md)), `POST /api/odev-dosya/yukle`
    ([../sunucu/bolumler/odev-dosya.md](../sunucu/bolumler/odev-dosya.md)), `POST /api/okul-sayfa/foto`
    ([../sunucu/bolumler/okul-sayfasi.md](../sunucu/bolumler/okul-sayfasi.md)).
- **Onu çalıştıran:** `testler/tumtest.sh` — sunucusuz paketler döngüsünde dördüncü (`test-kucult`'tan sonra, `test-hatirlatici-zaman`'dan
  önce); döngünün başındaki yorum "tarayıcıda resim küçültme (başsız Edge; yoksa atlanır)" der.

## Nasıl çalışır (adım adım)?

```
TARAYICILAR'dan ilk var olan ─(yoksa)─► ATLANDI, GECTI: 0 KALDI: 0
180 sn zamanlayıcı
tarayiciAc: geçici profil + spawn(--headless=new --remote-debugging-pipe) ─► CDP oturumu
  calistir('var SAYFALAR = {}')
  8 parça sırayla (her biri genel alanda)
  sayfaHazirla(6 elle yapılmış PNG) ─► window.T
  grupBirim  ─► birim   (ölçek, ad, aday, eşik, sınıf, hedef, başlıklar)
  grupAkis   ─► akis    (resimKucult: JPEG, elle yön 3/6/8, küçük, küçülmeyen, PNG→JPEG, APNG, saydam, ekran, WebP, HEIC, sıra)
  grupArayuz ─► arayuz  (SahteXHR / sahte fetch: ekler, teslim, okul sayfası)
kapat (Browser.close, süreç, profil klasörü)
Node'da denetle: 1) 31  2) 20  3) 16
GECTI: n   KALDI: m
```

## Dikkat!

- **Bu belge yazılırken ve denetlenirken paket çalıştırılmadı.** Paralel belgeleme kuralları başsız tarayıcı açmayı ve süreç başlatan
  testleri yasakladığı için 3 Ekim'de koşulmadı; yukarıdaki sayılar (31 + 20 + 16 = 67) koddan iki kez ayrı ayrı sayıldı. En son hangi sonuçla koşulduğu burada
  doğrulanmadı; `tumtest.sh`'in tam koşusunda bu paketin satırına bakılmalı.
- **Tarayıcı yoksa sessizce "geçer".** Edge ya da Chrome bulunamazsa paket `GECTI: 0   KALDI: 0` ile ve çıkış 0 ile biter; `tumtest.sh`
  bunu hata saymaz, toplamda yalnız 67 denetim eksik görünür. Linux'ta ya da tarayıcısız bir sunucuda küçültme hiç denenmemiş olur;
  `EE_TARAYICI` ile yol verilebilir.
- **Makineye bağlı denetimler.** "Arayüz donmadı" 300 ms sınırına bakar: yüklü ya da yavaş bir makinede kalabilir. Sınıflandırma eşikleri
  (renk oranı, yan yana eşit) Edge'de ölçülmüş değerlere dayanır; başka bir tarayıcının kodlayıcısı ya da yeniden örneklemesi sınırdaki
  örnekleri ("az gürültülü fotoğraf", "taranmış sayfa") öbür tarafa düşürebilir. "Küçülmeyen JPEG" ve "ekran görüntüsü" denetimleri de
  tarayıcının kodlayıcısının ürettiği boyuta bağlıdır (ekran görüntüsü denetimi bu yüzden iki sonucu da kabul eder; yani o denetim zayıf).
- **Zaman aşımında temizlik yapılmaz.** 180 saniyelik zamanlayıcı `process.exit(1)` ile çıkar; `t.kapat()` çağrılmaz. Geçici
  `ee-kucult-*` profil klasörü silinmez; tarayıcı sürecinin kendiliğinden kapanıp kapanmadığı denenmedi (kod okumasına göre). Böyle bir
  koşudan sonra açık kalmış başsız tarayıcı var mı bak.
- **Tarayıcının arka plan istekleri kapatılmamış.** Başlatma bayraklarında `--disable-background-networking` gibi bir bayrak yok; sayfa
  `about:blank` ve testin kendisi ağa çıkmasa da tarayıcının kendi güncelleme/bileşen istekleri olabilir (kod okumasına göre, denenmedi).
- **Genel alan ile gerçek paket farklı.** Parçalar gerçekte tek bir `'use strict'` IIFE'de birleşir; burada her biri ayrı bir betik olarak
  genel alanda çalışır. Test bu farkı bilerek kullanır (iç adların üzerine yazmak için), ama paketleme hatalarını (birleşince derlenmeme,
  ad çakışması) yakalamaz; onu [test-kucult.md](test-kucult.md) yapar. Parçalardan birine yükleme anında başka bir parçaya dayanan kod
  eklenirse (bugünkü `SAYFALAR` gibi) bu paket "sayfadaki test çalıştı" ile kalır; `PARCALAR` listesine o parçayı ekle.
- **İç adlara ve DOM seçicilerine sıkı bağlı.** `kucultCoz`, `KUCULT_YON`, `kucultBitmapCoz`, `teslimCiz`, `teslimDurum`, `OS`,
  `osFotolariCiz`, `osOnizlemeCiz` gibi adlar ve `.ek-birak small`, `#ekListe-t .ek-satir small`, `.yukleme-satir .yuzde`, `.kucultme`,
  `#osFotoMesaj` seçicileri değişirse paket kalır. Ön yüzü yeniden düzenlerken (ör. planlı tasarım işi) burayı da güncelle.
- **`zlib.crc32` yeni Node ister.** Elle PNG yapan `pngYap` Node'un `zlib.crc32`'sini kullanır (Node 20.15 / 22.2'den beri var); proje
  Node 24 kullanıyor. Daha eski bir Node'da paket "sayfadaki test çalıştı" ile kalır.
- **Hareketli PNG'nin yalnız başı denenir.** `acTL` parçası IHDR'den hemen sonraya konur; 256 KB'tan sonraya düşen bir `acTL`'nin görülmemesi
  (04f belgesinin "Dikkat!"indeki durum) denenmez.
- **Sahte istekler gerçek sunucu cevabını taklit etmez.** Ek yüklemesinde yalnız `{"ek":{"id":"e1"}}`, teslimde `{}`, okul sayfasında
  `{ foto: {…} }` döndürülür; sunucunun 413/415/429/507 cevapları burada denenmez (sunuculu paketlerde denenir).

## Testleri

- Bu dosyanın kendisi testtir; `testler/tumtest.sh` her tam koşuda sunucusuz paketler arasında çalıştırır.
- Elle (proje kökünde): `node testler/test-resim-kucult.js`. Sunucu ve veritabanı gerekmez; Edge ya da Chrome kurulu olmalı (başka bir
  yerdeyse `EE_TARAYICI=<tarayıcının yolu> node testler/test-resim-kucult.js`). Yaklaşık süre ve son sonuç bu belgede doğrulanmadı.
- Aynı alanda: [test-kucult.md](test-kucult.md) (ön yüz paketinin yorumsuz hâliyle derlenmesi; bütün parçaların ES5 ve şablon dizgisiz
  olması), [test-odev-dosya.md](test-odev-dosya.md) ve [test-okul-disk.md](test-okul-disk.md) (yüklemelerin sunucu tarafı: boyut
  sınırları, okulun disk sayacı), [test-okul-sayfasi.md](test-okul-sayfasi.md) (okul sayfası fotoğrafının sunucuda temizlenmesi),
  `testler/test-yorum-ek.js` (eklerin sunucu tarafı), [buton-denetimi.md](buton-denetimi.md) (`ek-kaldir`, `teslim-iptal` eylemlerinin
  karşılığı).

## Son durum

- `git log`: tek commit. Dosya `40fc7e7 commit 525` (2026-09-27, okul disk sınırı + telefonda küçültme) ile 623 satır olarak eklendi; o
  günden beri değişmedi. Aynı commit koruduğu kodu getirdi: `public/js/parcalar/04f-resim-kucult.js` (415 satır, yeni), `04d-ekler.js`'e
  küçültülerek yükleme (`ekKucultYukle`, "Küçültülüyor…"), `14b-odev-teslim.js`'e küçülmüş boyutla yer ayırma ve iptal, `19g-okul-sayfasi.js`'e
  3 MB sınırının küçülmüş hâle uygulanması; KILAVUZ'a "Telefonda küçültme" bölümü. Paket `tumtest.sh`'in sunucusuz listesine `test-kucult`'un
  arkasına eklendi ve döngünün yorumuna "tarayıcıda resim küçültme (başsız Edge; yoksa atlanır)" yazıldı.
- Açık iş yok; kod değiştirilmedi. Zayıf noktalar (tarayıcısız sessiz geçiş, makineye bağlı eşikler, zaman aşımında temizlik yapılmaması)
  "Dikkat!"te.
- Planlı işlerden bu dosyayı etkileyecekler:
  - **"Sunucuda küçültme … aynı dosya tek kopya"** (sıradaki iş 1) — tanıma göre sunucu aynı kuralları (uzun kenar 2048 px, JPEG 0,82,
    yön, meta veri silme, PNG kararı, en az %20 kazanç) kendi kodlayıcısıyla uygulayacak ve küçülmeyen dosyada da meta veriyi silecek.
    İki fark gözetilmeli: tanımdaki sunucu eşiği "1,5 MB üstü ya da uzun kenarı 2048 px üstü" (tarayıcıda 500 KB), ve tanımda
    tarayıcının "kısa kenar 1024 px altına inmez" kuralı geçmiyor; ikisi aynı resimden farklı boyut üretmesin diye o işte
    netleştirilmeli. Bu paket tarayıcı tarafının ölçüsü olarak kalır; eşiklerden biri değişirse iki taraf ve iki test birlikte değişmeli.
  - **"Paneller … okul simgesi"** — müdürün yüklediği okul simgesi 128×128'e getirilecek (oran korunur, boşluk beyaz); tanıma göre küçültme
    tarayıcıda "04f-resim-kucult kalıbı"yla yapılacak. Yeni ekran gelince 3. bölüme eklenmeli.
  - **"Düzenleyiciler"** (onaylı) — ortak yazı düzenleyicisinin "Fotoğraf ekle"si fotoğrafı tarayıcıda bu parçayla küçültecek (tanım:
    meta veri/konum silinir). Bu da 3. bölüme yeni bir ekran olarak girmeli.
  - **"Başarılarım"** — PNG/JPEG/PDF belge ekleme mevcut dosya altyapısını (telefonda küçültme dahil) kullanacak.
  - **"Android yerel uygulama"** — tanıma göre uygulama dosyayı sitedeki ek ve ödev dosyası uçlarına akışla yükler; tanımda telefonda
    küçültmeden söz edilmiyor ve uygulamanın Java kaynaklarında bugün resim küçülten kod yok. Yani uygulamadan yüklenen büyük fotoğraf
    (sunucuda küçültme gelene kadar) küçülmeden ve meta verisiyle gider. Bu paket uygulamayı denemez; uygulamaya küçültme eklenirse
    buradaki kuralların (2048 / 1024 px, 0,82, %20) aynısı kullanılmalı.
