# public/js/parcalar/04f-resim-kucult.js

Büyük fotoğrafı yüklemeden önce tarayıcıda (çoğu zaman telefonda) küçülten parça: türünü ve yönünü dosyanın ilk
baytlarından okur, fotoğraf mı ekran görüntüsü mü diye ölçer, uzun kenarı 2048 px'e indirip JPEG 0,82 (ya da PNG) olarak
yeniden kodlar; olmazsa asıl dosyayı hiç hata vermeden geri verir.

## Bu dosya ne yapar?

Telefonla çekilen bir fotoğraf birkaç megabayt tutar. Öğrenci ödevini fotoğraflayıp teslim ederken, öğretmen mesaja
fotoğraf eklerken ya da müdür okul sayfasına galeri fotoğrafı koyarken bu megabaytların hepsinin okulun internetinden ve
sunucunun diskinden geçmesine gerek yok: 4032×3024'lük bir fotoğraf 2048×1536'ya inince gözle fark edilmez ama boyutu
çok düşer (KILAVUZ'daki ölçümde fotoğrafların JPEG hâlleri %71–93 küçüldü). Bu dosya o işi yükleme başlamadan, kişinin
kendi cihazında yapar.

Üç yer onu kullanır (hepsi aynı üç işlevle):

1. Mesaj ve ödev ekleri ([04d-ekler.md](04d-ekler.md)),
2. öğrencinin ödev teslim dosyaları (`14b-odev-teslim.js`),
3. okul sayfası fotoğrafları (`19g-okul-sayfasi.js`).

Kurallar kabaca şunlar (ayrıntısı aşağıda ve [KILAVUZ "Telefonda küçültme"](../../../belge/KILAVUZ.md) bölümünde):

- Yalnız JPEG, PNG, WebP ve (tarayıcı açabiliyorsa) HEIC/HEIF; 500 KB'tan küçük dosyaya dokunulmaz.
- Uzun kenar en çok 2048 px; ama kısa kenar 1024 px'in altına indirilmez (uzun, kaydırmalı bir ekran görüntüsündeki
  yazı okunur kalsın). Büyütme hiç yapılmaz.
- Fotoğraf yeniden çizildiği için içindeki EXIF (konum/GPS, tarih, cihaz) gider; yön (EXIF orientation) önce uygulanır,
  fotoğraf yan yatmaz.
- PNG ve WebP'de "bu bir fotoğraf mı, yoksa ekran görüntüsü/çizim mi?" diye küçük bir örnek üzerinde ölçülür: fotoğrafsa
  JPEG olur (adı `.jpg`), ekran görüntüsü PNG kalır (JPEG'de yazılar bulanıklaşırdı), saydam resim saydam kalır.
- Sonuç asıl dosyadan en az %20 küçük değilse asıl dosya gider.
- Bir şey ters giderse (eski tarayıcı, bellek yetmedi, dosya açılamadı) **hata yoktur**: asıl dosya olduğu gibi döner,
  yükleme her zamanki gibi sürer.

Arayüz donmasın diye çözme `createImageBitmap` ile ana iş parçacığının dışında yapılır, adımların arasında tarayıcıya
sıra verilir; telefonun belleği şişmesin diye aynı anda yalnız TEK resim işlenir.

Bu dosya ekrana hiçbir şey çizmez (yalnız bellekte görünmez tuvaller kullanır); "Küçültülüyor…" ve "8,4 MB → 620 KB"
yazılarını çağıran ekranlar gösterir.

## İçinde neler var?

### Dışa açık üç işlev (ekranların kullandığı)

- `resimKucultulebilir(dosya)` → `true`/`false`, ANINDA (dosyayı okumadan). Dosya boş değil, en az 500 KB, tarayıcıda
  `FileReader` ve `Blob` var, ve uzantısı (`jpg jpeg png webp heic heif`, büyük/küçük harf fark etmez) ya da türü
  (`image/jpeg|png|webp|heic|heif`) tanıdıksa `true`. Ekranlar bununla "yer denetimini şimdi mi yapayım, küçüldükten
  sonra mı?" kararını verir. `true` demesi küçüleceği anlamına gelmez; yalnız aday olduğunu söyler.
- `resimKucult(dosya)` → `Promise` → sonuç nesnesi:
  `{ dosya, ad, tur, once, sonra, kuculdu, cevrildi, sebep }`
  - `dosya`: yüklenecek şey. Küçüldüyse yeni bir `Blob` (adı YOK, adı `ad`'da), küçülmediyse asıl `File`'ın kendisi.
  - `ad`: yüklenecek ad; tür değiştiyse uzantısı da değişir (`odev.PNG` → `odev.jpg`, `IMG_1.HEIC` → `IMG_1.jpg`).
  - `tur`: `image/jpeg` ya da `image/png` (küçüldüyse), yoksa dosyanın kendi türü (boş olabilir).
  - `once`, `sonra`: bayt olarak boyutlar (küçülmediyse ikisi aynı).
  - `kuculdu`: `true`/`false`.
  - `cevrildi`: tür değiştiyse `"PNG → JPEG"`, `"WebP → JPEG"`, `"HEIC → JPEG"`; değişmediyse `''`.
  - `sebep`: küçülmediyse neden: `'aday değil'`, `'tanınmayan tür'`, `'hareketli resim'`, `'çok büyük resim'`,
    `'saydam'`, `'ekran görüntüsü'`, `'kodlanamadı'`, `'küçülmedi'`, `'okunamadı'`, `'açılamadı'` ya da tarayıcının
    kendi hata iletisi (yoksa `'hata'`). `cevrildi` ve `sebep` bugün hiçbir ekranda gösterilmez; testler ve hata ayıklama
    için durur.
  Söz hiçbir zaman reddedilmez (gerçek bir `File` verildiği sürece); işler bir zincirde sıraya girer, aynı anda tek resim.
- `kucultmeYazisi(sonuc)` → `"8,4 MB → 620 KB"`; küçülmediyse ya da `sonuc` boşsa `''`. Sayıları [04d-ekler.md](04d-ekler.md)'deki
  `boyutYazi` yazar.

### Ayarlar ve durum

- `KUCULT` — bütün eşikler tek yerde:

  | Ad | Değer | Anlamı |
  |---|---|---|
  | `altSinir` | 500 KB | bundan küçük dosyaya dokunulmaz |
  | `uzunKenar` | 2048 | uzun kenar en çok bu kadar |
  | `kisaKenar` | 1024 | kısa kenar bunun altına indirilmez (uzun kenar kuralından önce gelir) |
  | `kalite` | 0,82 | JPEG kalitesi |
  | `kazanc` | 0,8 | yeni hâl asılın en çok %80'i olmalı, yoksa asıl gider |
  | `enCokPiksel` | 60 000 000 | 60 MP'den büyük resim tarayıcıda açılmaz (bellek) |
  | `tuvalSiniri` | 16 000 000 | son tuval en çok ~16 MP (iPhone'un 4096×4096 tuval sınırının altı) |
  | `ornek` | 256 | "fotoğraf mı" ölçümü için örneğin uzun kenarı |
  | `fotoRenk` | 0,03 | fotoğraf eşiği: farklı renk / nokta sayısı |
  | `fotoEsit` | 0,6 | fotoğraf eşiği: yan yana iki noktanın aynı renk olma oranı bundan az |
  | `gurultuEsit` | 0,2 | bundan az "eşit" varsa renk sayısına bakmadan fotoğraf (siyah-beyaz fotoğraf, taranmış sayfa) |

  Eşiklerin nereden geldiği dosyanın yorumunda ve KILAVUZ'da yazılı: başsız Edge'de gerçek tuvalle 26 duvar kâğıdı
  fotoğrafı, ekran görüntüleri, çizimler, fotoğraflı ekran görüntüleri ve taranmış sayfalarla ölçüldü (2026-09).
- `KUCULT_TURLER` — uzantı → iç tür adı (`jpg`/`jpeg` → `jpeg`, `png`, `webp`, `heic`/`heif` → `heic`).
- `KUCULT_ADLAR` — iç tür → ekrandaki ad (`JPEG`, `PNG`, `WebP`, `HEIC`); `cevrildi` metni için.
- `KUCULT_YON` — çözme yolu (`'bit'` = `createImageBitmap`, `'img'` = `<img>`) → bu tarayıcı EXIF yönünü kendisi
  uyguluyor mu (bir kez denenir, burada saklanır).
- `kucultZinciri` — sıradaki işin sözü; "aynı anda tek resim" bununla sağlanır.

### İç işlevler (sırayla, dosyadaki bölümlere göre)

**Yol ve yardımcılar**

- `kucultIsle(dosya)` — asıl iş; adımları "Nasıl çalışır"da. `resimKucult` her dosyayı zincire bunu çağıran bir iş olarak
  ekler.
- `kucultAsil(dosya, sebep)` — "olduğu gibi gider" sonucu (`kuculdu: false`, `once === sonra`).
- `kucultBekle()` — `setTimeout(…, 0)` ile tarayıcıya sıra verir: "Küçültülüyor…" yazısı ekrana çıkar, dokunuşlar beklemez.
- `kucultUzanti(ad)` — son noktadan sonrası, küçük harfle; nokta yoksa ya da ad noktayla başlıyorsa `''`.
- `kucultHedef(tur, olcu)` — hangi türe yazılacağı (`''` = dokunma):
  - JPEG → her zaman `image/jpeg`;
  - saydamsa: PNG → `image/png`, WebP ve HEIC → `''`;
  - fotoğraf gibiyse (`kucultFotoMu`) → `image/jpeg`;
  - değilse: PNG → `image/png`, WebP ve HEIC → `''`.
- `kucultFotoMu(o)` — `o.esit < 0,2` YA DA (`o.renk >= 0,03` VE `o.esit < 0,6`).
- `kucultAd(ad, tur)` — tür değişmediyse ad aynı; değiştiyse uzantı `.jpg` ya da `.png` olur, uzantısız ada eklenir,
  boş ada `resim.jpg`. (`a.b.png` PNG kalırsa aynı kalır; `x.webp` JPEG olursa `x.jpg`.)

**Dosyanın başı (tür, boyut, yön, saydamlık olabilir mi)** — dosyanın ilk 256 KB'ı okunur, resim çözülmez:

- `kucultOkuBayt(blob)` — `FileReader` ile `Uint8Array`; hata → "okunamadı".
- `kucultMetin(b, i, n)`, `kucultU32(b, i)` — baytlardan ASCII metin ve büyük sonlu 32 bit sayı.
- `kucultBaslik(dosya)` → `{ tur, en, boy, yon, alfa, hareketli }`. Tür imzadan bulunur, uzantıdan değil: `FF D8` → JPEG
  (`alfa: false`), `\x89PNG…` → PNG, `RIFF….WEBP` → WebP, `….ftyp` + marka `heic heix heim heis mif1` → HEIC (resim
  dizisi markaları tanınmaz, dokunulmaz). `alfa: false` "kesin saydam değil", `null` "noktalara bakılmalı" demek.
- `kucultJpegBaslik(b, s)` — JPEG bölümlerini gezer: APP1 bölümlerinde (`FF E1`; yön henüz 1'se, yani XMP gibi başka bir
  APP1 önce gelse de sonraki EXIF okunur) EXIF yönü, SOF bölümünde (`C0–CF`, ama `C4`, `C8`, `CC` hariç) boy ve en; SOF'u
  bulunca, görüntü verisine (`SOS`) ya da dosya sonuna (`EOI`) gelince durur.
- `kucultExifYon(b, bas, uz)` — APP1 "Exif\0\0" + TIFF başlığı (küçük sonlu `II` ya da büyük sonlu `MM`), ilk IFD'deki
  `0x0112` (yön) girişi; 1–8 değilse ya da bulunamazsa 1.
- `kucultPngBaslik(b, s)` — IHDR'den en/boy; parçaları görüntü verisine (`IDAT`) kadar gezer: `acTL` varsa hareketli
  (APNG), renk türü 4/6 (alfa kanalı) ya da `tRNS` yoksa `alfa: false`.
- `kucultWebpBaslik(b, s)` — `VP8X` (alfa ve hareket bayrakları, tuval boyutu), `VP8L` (kayıpsız: 14 bitlik en/boy, alfa
  biti), `VP8 ` (kayıplı: en/boy, saydam değil).

**Çözme**

- `kucultCoz(blob)` — `createImageBitmap` varsa onu dener, olmazsa `<img>`.
- `kucultBitmapCoz(blob)` → `{ kaynak, en, boy, yol: 'bit', kapat }` (`kapat` = `bitmap.close()`).
- `kucultResimCoz(blob)` → aynı biçim, `yol: 'img'`. Dosya `FileReader` ile `data:` adresine çevrilir, çünkü sitenin
  güvenlik kuralı (CSP `img-src 'self' data: …`, [../../../sunucu/http.md](../../../sunucu/http.md)) `blob:` resme izin vermez.
  Varsa `img.decode()` beklenir.
- `kucultYonUygulaniyor(yol)` — tarayıcı EXIF yönünü kendisi uyguluyor mu: tuvalden 2×1'lik bir JPEG kodlanır, araya yönü 6
  (90°) yazılmış 36 baytlık bir APP1 konur, çözülür; 1×2 çıkarsa "uyguluyor". Sonuç `KUCULT_YON[yol]`'da saklanır. Deneme
  hiç yapılamazsa "uyguluyor" sayılır (bugünkü tarayıcıların hepsi uyguluyor).

**Ölçme**

- `kucultOlc(kaynak, en, boy, alfaBak)` → `{ saydam, renk, renkSayisi, esit }`. Resim en yakın nokta yöntemiyle
  (yumuşatmasız: ekran görüntüsünün az sayıdaki gerçek rengi karışıp çoğalmasın) en çok 256 px'e indirilir. Sayılanlar:
  farklı renklerin nokta sayısına oranı (`renk`; 2^24 bitlik bir tabloyla, 2 MB) ve yatayda yan yana iki noktanın aynı renk
  olma oranı (`esit`: ekran görüntüsünde düz zemin çok, fotoğrafta hemen hiç). `alfaBak` yanlışsa `saydam` hep `false`.

**Çizme ve kodlama**

- `kucultOlcek(en, boy)` — ölçek = `min(1, max(2048 / uzun, 1024 / kısa))`; sonuç 16 MP'yi aşarsa tuval sınırına indirilir.
  Örnekler (testteki altı boyut): 4032×3024 → 2048×1536; dik çekilmiş 3024×4032 → 1536×2048; 1170×2532 (telefon ekran
  görüntüsü) → 1024×2216; 1080×8000 → 1024×7585; 800×600 → aynı; 20000×1000 panorama → 17889×894 (tuval sınırı kısa kenar
  kuralından baskın).
- `kucultTuval(en, boy)` → `{ t, ctx }`, yumuşatma açık, `imageSmoothingQuality = 'high'`.
- `kucultCiz(c, yon, beyazZemin)` — `imageSmoothingQuality`'yi bilen tarayıcı tek adımda küçültür; bilmeyende (Firefox)
  hedefin iki katından büyük kaldıkça yarıya yarıya inilir, her adımda sıra verilir. Son adımda EXIF yönü dönüşüm
  matrisiyle uygulanır (5–8 arası yönlerde en/boy yer değiştirir). JPEG'e yazılacaksa zemin önce beyaza boyanır (saydam
  nokta JPEG'de siyah çıkmasın). Ara tuvaller hemen sıfırlanır.
- `kucultKodla(tuval, tur, kalite)` → `Promise<Blob|null>`: `toBlob`; o yoksa ya da hata atarsa `toDataURL` + `atob`;
  o da olmazsa `null`.

## Kimle konuşur?

- Çağırdıkları: yalnız tarayıcının kendisi (`FileReader`, `Blob`, `createImageBitmap`, `Image`, `<canvas>`, `Promise`,
  `setTimeout`) ve [04d-ekler.md](04d-ekler.md)'deki `boyutYazi` (`kucultmeYazisi` içinde). Sunucuya HİÇ istek atmaz, `/api`
  ucu çağırmaz.
- Onu kullananlar (parçalar ad sırasıyla tek IIFE'de birleştiği için hepsi aynı kapsamda görür; [../../../sunucu/http.md](../../../sunucu/http.md) `birlesikOku`):
  - [04d-ekler.md](04d-ekler.md) — `ekDosyalariEkle`: `resimKucultulebilir(f)` ise yer denetimi sonraya kalır;
    `ekKucultYukle`: `resimKucult(f)` → `k.sonra` ile `ekSigmiyor`, `k.ad`, `k.dosya`, `kucultmeYazisi(k)`. Sonra
    `POST /api/ek/yukle` ([../../../sunucu/bolumler/ekler.md](../../../sunucu/bolumler/ekler.md)).
  - `14b-odev-teslim.js` — `teslimKuyruk`: `resimKucultulebilir`; yükleme satırında `resimKucult(f)` → yer ayırma küçülmüş
    boyutla, `k.ad`, `k.dosya`, `kucultmeYazisi`; küçültülürken "İptal" edilirse gönderilmez. Sonra
    `POST /api/odev-dosya/yukle` ([../../../sunucu/bolumler/odev-dosya.md](../../../sunucu/bolumler/odev-dosya.md)).
  - `19g-okul-sayfasi.js` — `osDosyaSecildi`: yalnız PNG/JPEG/WebP kabul eder; `resimKucultulebilir` ise "Küçültülüyor…",
    `resimKucult` → `k.dosya`, `k.tur` (`Content-Type` olur), `kucultmeYazisi`; 3 MB sınırı küçülmüş hâline uygulanır.
    Sonra `POST /api/okul-sayfa/foto` ([../../../sunucu/bolumler/okul-sayfasi.md](../../../sunucu/bolumler/okul-sayfasi.md)); orada
    sunucu da meta veriyi siler ([../../../sunucu/yardimci/resim.md](../../../sunucu/yardimci/resim.md)).
- Küçülmüş boyut okulun disk sayacına da o hâliyle yazılır ([../../../sunucu/bolumler/okul-disk.md](../../../sunucu/bolumler/okul-disk.md)).
- CSS: yok. Bu dosya DOM'a bir şey koymaz; satırlardaki yazıların biçimi çağıranların CSS'inde (ekler için
  `public/css/parcalar/02-form.css`'teki `.ek-satir`, teslim için `public/css/parcalar/26-anket-okul-hayati.css`'teki
  `.yukleme-satir` ve `.kucultme`).
- Rol: dosya yükleyen herkes — mesaj eki koyan öğrenci, veli, öğretmen, müdür, servisçi; ödev eki koyan öğretmen ve
  müdür; ödev teslim eden öğrenci; okul sayfasını düzenleyen müdür (ya da `okul.sayfa` yetkili öğretmen).

## Nasıl çalışır (adım adım)?

```
ekran: resimKucultulebilir(f)?  ── hayır ─► olduğu gibi yükle
          │ evet
          ▼  satırda "Küçültülüyor…"
resimKucult(f) ─► zincirin sonuna eklenir (önceki resim bitmeden başlamaz)
   kucultIsle:
   1. kucultBaslik (ilk 256 KB)   tür yok → 'tanınmayan tür' · APNG/hareketli WebP → 'hareketli resim'
                                  en×boy > 60 MP → 'çok büyük resim'
   2. kucultBekle                 (ekrana sıra ver)
   3. kucultCoz                   createImageBitmap ─(olmazsa)─► <img src="data:…">
                                  çözülen > 60 MP → 'çok büyük resim'
   4. kucultYonUygulaniyor        tarayıcı yönü kendi uyguluyorsa yon = 1, değilse EXIF yönü
   5. JPEG değilse kucultOlc      256 px örnek: saydam? renk oranı? yan yana eşit?
   6. kucultHedef                 '' → 'saydam' / 'ekran görüntüsü' (asıl gider)
   7. kucultCiz                   ölçek (2048 / 1024 / 16 MP), yön, JPEG'se beyaz zemin
   8. kapat + kucultBekle + kucultKodla(tuval, hedef, 0,82) → tuval 0×0 (bellek geri)
   9. blob yok / türü yanlış / < 64 bayt → 'kodlanamadı'
      blob > asıl × 0,8            → 'küçülmedi'
  10. { dosya: blob, ad: kucultAd(...), kuculdu: true, ... }
   herhangi bir hata ─► kapat, { dosya: asıl, kuculdu: false, sebep }
          ▼
ekran: "8,4 MB → 620 KB · yükleniyor", yer denetimi k.sonra ile, gövde k.dosya, ad k.ad
```

Örnek bir yol (boyutlar örnektir): telefondan 3000×2250'lik, yönü 6 (dik çekilmiş) birkaç MB'lık bir JPEG → başlık JPEG,
yön 6 → bugünkü tarayıcı yönü kendisi uyguluyor, çözülen resim zaten dik (2250×3000) → ölçüm yok (JPEG) → hedef JPEG →
ölçek `max(2048/3000, 1024/2250)` = 0,683 → 1536×2048, beyaz zeminli tuvale çizilir → 0,82 ile kodlanır → birkaç yüz KB;
yeni dosyada EXIF (GPS dahil) yok → satırda "3,4 MB → 410 KB" gibi bir yazı.

## Dikkat!

- **Meta veriyi bugün yalnız okul sayfasında sunucu siliyor.** Koddaki yorum ve KILAVUZ "küçülmezse asıl dosya gider
  (meta veriyi sunucu siler)" diyor; ama sunucudaki temizleyici (`resmiTemizle`, [../../../sunucu/yardimci/resim.md](../../../sunucu/yardimci/resim.md))
  yalnız okul sayfası fotoğraflarında çağrılıyor. Mesaj/ödev ekinde ve ödev tesliminde küçültülmeyen resim (500 KB altı,
  %20 kazanç yok, hareketli, saydam ya da ekran görüntüsü gibi WebP/HEIC, açılamayan HEIC, herhangi bir hata) EXIF'iyle
  — telefonun koyduğu GPS konumu dahil — olduğu gibi sunucuya gider ve öyle saklanır. Bu açığı planlı "Sunucuda küçültme"
  işi kapatacak (küçülmese de meta veri silinecek). Kod değiştirilmedi.
- **`kazanc` yorumundaki "sunucudaki kuralla aynı" bugün doğru değil:** sunucuda böyle bir kural henüz yok; tanımdaki
  (sunucuda küçültme işi) %20 kuralına işaret ediyor.
- **HEIC her zaman JPEG olmaz.** Yorum ve KILAVUZ "HEIC JPEG olur" diyor; `kucultHedef` ise HEIC'i yalnız fotoğraf
  gibiyse JPEG'e çevirir, saydam ya da ekran görüntüsü gibi bir HEIC'e dokunmaz. Test yalnız fotoğraf ve saydam
  durumlarını dener. Windows'taki Chrome/Edge HEIC açamaz; orada her HEIC olduğu gibi gider.
- **"Kısa kenar 1024'ün altına inmez" mutlak değil:** son tuval 16 MP'yi geçecekse ölçek küçülür; 20000×1000'lik bir
  panoramanın kısa kenarı 894 olur (test bunu bekler). Kısa kenar kuralı yüzünden uzun ekran görüntülerinin uzun kenarı
  2048'i çok aşabilir (1080×8000 → 1024×7585); bilerek böyle.
- **Küçülen `dosya` bir `Blob`'dur, `File` değil:** adı yoktur. Çağıran ad olarak `k.ad`'ı kullanmalı (ekler ve teslim
  `X-Dosya-Adi` başlığına onu koyar). Tür PNG → JPEG olduysa adın uzantısı da değişmiştir.
- **Başlık yalnız ilk 256 KB'tan okunur.** Tek bir JPEG bölümü en çok 64 KB olabildiği için (EXIF ve içindeki önizleme
  resmi de bu sınıra sığar) boyutun (SOF) 256 KB'tan sonra kalması ancak SOF'tan önce birçok büyük bölüm varsa olur
  (parçalara bölünmüş büyük renk profili, genişletilmiş XMP, Photoshop bilgisi). O zaman başlıktan boyut 0 okunur ve
  60 MP ön denetimi atlanır; çözmeden sonraki ikinci denetim yakalar, ama resim o ana kadar çözülmüş, bellek harcanmış
  olur. HEIC'te başlıktan boyut hiç okunmaz (`kucultBaslik` yalnız imzaya bakar): 60 MP ön denetimi HEIC'e hiç
  uygulanmaz, yalnız çözmeden sonrakine kalır. PNG'de
  `IDAT`'tan önce 256 KB'tan uzun parçalar (büyük renk profili ya da metin) varsa `alfa` belirsiz kalır (noktalara
  bakılır) ve arkadaki bir `acTL` görülmeyebilir: o zaman hareketli PNG'nin yalnız ilk karesi yüklenir. Bu son durum kod
  okumasına göre yazıldı, denenmedi.
- **Aynı anda tek resim:** on fotoğraf birden seçilirse sırayla küçülür; arkadakiler "Küçültülüyor…" durumunda bekler.
  Zincir hiç kopmaz (her iş kendi hatasını yakalar). `resimKucult(null)` gibi dosyasız bir çağrı ise zincir boşken
  hemen hata atar; bugünkü çağıranların hepsi gerçek bir dosya verir.
- **Yön denemesi bir kez yapılır:** sonucu `KUCULT_YON`'da kalır. Deneme hiç yapılamazsa "tarayıcı uyguluyor" sayılır;
  gerçekten uygulamayan çok eski bir tarayıcıda fotoğraf yan yatık yüklenebilir.
- **Bellek:** 60 MP'lik bir resim çözülünce ~240 MB tutar; telefonda bu başarısız olabilir, o zaman asıl dosya gider.
  Çözülen resim ve tuvaller iş biter bitmez bırakılır (`bitmap.close()`, `tuval.width = 0`), iOS'ta birikmesin diye.
- **`data:` yolu pahalıdır:** `createImageBitmap` olmayan tarayıcıda dosyanın tamamı metne çevrilir (20 MB dosya → ~27 MB
  metin). CSP `blob:` resme izin verseydi gerekmezdi; CSP'yi değiştirmeyi düşünürsen güvenlik etkisine bak.
- **Test bu dosyanın iç adlarına dayanır:** `testler/test-resim-kucult.js` parçaları birleştirmeden, ayrı ayrı genel alana
  yükler ve `kucultCoz`, `KUCULT_YON` gibi adların üzerine yazar, `kucultOlcek`, `kucultAd`, `kucultOlc`, `kucultFotoMu`,
  `kucultHedef`, `kucultBaslik`, `kucultYonUygulaniyor`, `KUCULT`'u doğrudan çağırır. Bunların adını değiştirirsen testi de
  değiştir. Test sayfaya yalnız `00-durum`, `01-yardimcilar`, `02-ikonlar`, `03-mesaj-modal`, `04d-ekler`, `04f-resim-kucult`,
  `14b-odev-teslim`, `19g-okul-sayfasi` parçalarını koyar; bu dosyaya başka bir parçadan işlev çağrısı eklersen o listeye de ekle.
- ES5 kuralı: `.catch` yerine `['catch']`, ok işlevi yok. `Promise`, `Uint8Array`, `createImageBitmap` modern tarayıcı
  varsayar; yoksa `resimKucultulebilir` ya da `kucultCoz` yedek yolu devreye girer.

## Testleri

- `testler/test-resim-kucult.js` (sunucusuz; `testler/tumtest.sh`'in sunucusuz grubunda) — başsız Edge'de (yoksa Chrome;
  `EE_TARAYICI` ile yol verilebilir; hiçbiri yoksa ATLANDI) gerçek tuvalle, üç bölüm:
  1. **Kurallar ve sınıflandırma:** ölçek örnekleri (yukarıdaki altı boyut), ad değişimi, aday seçimi (400 KB jpg hayır, pdf
     hayır, 600 KB heic evet, türü `image/png` evet, `.JPG` evet), eşiklerin değerleri; fotoğraf / az gürültülü fotoğraf /
     ekran görüntüsü / çizim / taranmış sayfa / saydam logo / fotoğraflı ekran görüntüsü / eğimli slayt ayrımı; hedef tür
     tablosu; JPEG başı (boyut, büyük ve küçük sonlu EXIF yönü), elle yapılmış PNG'ler (RGB, `tEXt`, `tRNS`, RGBA, gri, APNG),
     hareketli WebP başı, gerçek WebP'ler (VP8/VP8L/VP8X), HEIC imzası.
  2. **Küçültme:** 3000×2250 EXIF'li (yön 6, GPS, üretici) JPEG küçülür, yön uygulanır, EXIF/GPS/cihaz bilgisi gider,
     arayüz 300 ms'den uzun donmaz; tarayıcı yönü uygulamıyormuş gibi elle döndürme (3, 6, 8); 500 KB altı ve küçülmeyen
     JPEG olduğu gibi; fotoğraf PNG → `odev.jpg`; hareketli PNG'ye dokunulmaz; saydam PNG PNG kalır (köşe saydam);
     ekran görüntüsü PNG kalır; fotoğraf WebP → `foto.jpg`; açılamayan HEIC hata vermeden gider; üç dosya birlikte
     verilince aynı anda tek resim çözülür.
  3. **Arayüz:** ekler (`04d-ekler.js`), ödev teslimi (`14b-odev-teslim.js`) ve okul sayfası (`19g-okul-sayfasi.js`) sahte
     istekle: "Küçültülüyor…", "3,3 MB → … KB", küçülmüş dosyanın yeni adıyla gitmesi, yer denetiminin küçülmüş boyutla
     yapılması, küçültülürken kaldırılan/iptal edilen dosyanın gönderilmemesi, okul sayfasında 3 MB altına inmesi.
- Elle: `node testler/test-resim-kucult.js`. Tarayıcıda: öğretmenle "Yeni mesaj"a telefonda çekilmiş büyük bir fotoğraf
  bırak; satırda önce "Küçültülüyor…", sonra "… MB → … KB" görmelisin. Bilgisayarın geliştirici araçlarında Ağ sekmesinde
  giden gövdenin küçük olduğuna bak.

## Son durum

- `git log`: tek commit. Dosya `40fc7e7 commit 525` (2026-09-27, "okul disk sınırı + telefonda küçültme") ile 415 satır
  olarak eklendi ve o günden beri değişmedi. Aynı commit onu üç ekrana bağladı (`04d-ekler.js`'e `ekKucultYukle` ve
  `kucultuluyor` durumu, `14b-odev-teslim.js`'e küçülmüş boyutla yer ayırma ve iptal, `19g-okul-sayfasi.js`'e 3 MB
  sınırının küçülmüş hâle uygulanması), KILAVUZ'a "Telefonda küçültme" bölümünü ve `testler/test-resim-kucult.js`'i
  (623 satır) ekledi, testi `tumtest.sh`'e koydu.
- Bilinen açıklar (kod değiştirilmedi): ek ve teslimde küçültülmeyen resmin meta verisinin sunucuda silinmemesi; `kazanc`
  yorumunun var olmayan bir sunucu kuralına işaret etmesi; HEIC için yorumun kodla tam örtüşmemesi.
- Planlı işlerden bu dosyayı etkileyecekler:
  - "Sunucuda küçültme (kendi JPEG/PNG kodlayıcısı, worker, güvenli değiştirme, meta veri silme…)" — sunucu aynı kuralları
    (2048 px, JPEG 0,82, yön, %20 kazanç, PNG kararı, bu dosyadaki "kısa kenar 1024 px altına inmez") uygulayacak ve
    küçülmeyen dosyada da meta veriyi silecek; o zaman buradaki "meta veriyi sunucu siler" her yükleme için doğru olur.
    Eşiklerden birini burada değiştirirsen sunucudakini de aynı yap.
  - "Paneller … okul simgesi" — müdürün yüklediği okul simgesi 128×128'e getirilecek (oran korunur, boşluk beyaz);
    tanım küçültmenin tarayıcıda "bu dosyanın kalıbıyla" yapılmasını söylüyor.
  - "Başarılarım" — PNG/JPEG/PDF belge ekleme mevcut dosya altyapısını (telefonda küçültme dahil) kullanacak.
  - "Android yerel uygulama" — KILAVUZ'a göre uygulama aynı küçültme kuralını kendi tarafında uygulayacak.
