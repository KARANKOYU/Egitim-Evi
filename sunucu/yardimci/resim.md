# sunucu/yardimci/resim.js

Yüklenen fotoğrafın güvenlik kapısı: türü adına değil ilk baytlarına bakarak bulur (yalnız PNG, JPEG, WebP) ve içindeki gizli
bilgileri (konum, tarih, cihaz — EXIF/XMP/IPTC, yazı parçaları) kaydetmeden önce siler.

## Bu dosya ne yapar?

Okul sayfası herkese açıktır; müdür ya da yetkili oraya kapak, logo ve galeri fotoğrafı yükler. İki tehlike var:

1. **Sahte tür.** Dosya adı `.png` diye gelen bir HTML ya da SVG, tarayıcıda kod çalıştırabilir. Bu yüzden tür, dosyanın adına
   ya da tarayıcının gönderdiği `Content-Type`'a değil, dosyanın İLK BAYTLARINA ("sihirli imza") bakılarak bulunur. SVG hiç
   kabul edilmez: içinde `<script>` çalışabilir.
2. **Gizli bilgi.** Telefonla çekilen fotoğrafın içinde çekildiği yerin GPS konumu, tarih ve cihaz bilgisi (EXIF/XMP) durur.
   Herkese açık sayfada bu, okulun ya da kişinin konumunu dağıtır. Bu dosya bunları siler. JPEG'de yalnız fotoğrafın YÖNÜ
   (dik/yatık) korunur: o da silinirse telefonda dik çekilen fotoğraf yan yatık görünür.

Görüntünün kendisine (pikseller) dokunulmaz, yeniden kodlama yoktur; yalnız dosyanın kabuğundaki üst veri parçaları ayıklanır.

## İçinde neler var?

- **`resimTuru(b)`** — `Buffer` alır, `'image/png'`, `'image/jpeg'`, `'image/webp'` ya da `''` döndürür:
  - PNG: ilk 8 bayt `89 50 4E 47 0D 0A 1A 0A`.
  - JPEG: ilk 3 bayt `FF D8 FF`.
  - WebP: en az 16 bayt, 0–4 `RIFF`, 8–12 `WEBP`.
  - Başka her şey (GIF, SVG, HEIC, BMP, PDF, HTML…): `''`.
- **`resmiTemizle(b)`** — türü bulur ve türüne göre temizler. Dönüş `{ tur, veri }` (temizlenmiş `Buffer`) ya da tanınmayan
  veya bozuk dosyada `null`. İçerideki her hata yakalanır (`try/catch`), dışarı hata atmaz.

### Neyi atar, neyi bırakır? (tam liste)

**PNG** (`pngTemizle`) — dosya "parça"lardan (chunk) oluşur: 4 bayt uzunluk + 4 harf tür + veri + 4 bayt CRC.

- ATILAN: `tEXt`, `iTXt`, `zTXt` (yazı parçaları; programlar buraya konum, yazar, yorum koyar), `eXIf` (EXIF), `tIME` (son
  değişiklik zamanı).
- KALAN: bunların dışındaki her parça (`IHDR`, `PLTE`, `IDAT`, `IEND`, `tRNS`, `gAMA`, `iCCP`, `sRGB`, `pHYs`… ve bilinmeyen özel
  parçalar dahil).
- `IEND`'den SONRAKİ her şey atılır (dosyanın sonuna eklenmiş başka veri gitmez).
- `IEND` yoksa ya da bir parçanın uzunluğu dosyayı aşıyorsa → `null` (bozuk ya da yarım). CRC denetlenmez.

**JPEG** (`jpegTemizle`) — dosya `FF xx` işaretli "bölüm"lerden oluşur.

- ATILAN: `APP1` (`FF E1`: EXIF ve XMP), `APP13` (`FF ED`: IPTC/Photoshop), `COM` (`FF FE`: yorum).
- EKLENEN: ilk EXIF'teki yön değeri 2–8 ise onun yerine yalnız yönü taşıyan 26 baytlık yeni küçük bir EXIF (`yonBolumu`). Yön 1
  (normal) ya da okunamıyorsa hiç EXIF yazılmaz.
- KALAN: diğer bütün bölümler — `APP0` (JFIF), `APP2` (renk profili), öteki `APPn`'ler (ör. `APP14` Adobe), nicemleme ve
  Huffman tabloları, çerçeve başlığı; bağımsız işaretler (`RST0–7`, `TEM`) ve dolgu baytları olduğu gibi.
- `SOS` (`FF DA`, görüntü verisinin başı) ve SONRASI olduğu gibi kopyalanır.
- Bölüm `FF` ile başlamıyorsa, uzunluk 2'den küçükse ya da dosyayı aşıyorsa, ya da `SOS`'a varmadan dosya bitiyorsa → `null`.

**WebP** (`webpTemizle`) — `RIFF` kabı, içinde parçalar (4 harf tür + 4 bayt küçük uçlu uzunluk + veri + tek sayıysa 1 bayt
dolgu).

- ATILAN: `EXIF` ve `XMP ` parçaları.
- DEĞİŞEN: `VP8X` başlık parçasının bayrak baytında "EXIF var" (`0x08`) ve "XMP var" (`0x04`) işaretleri silinir (yoksa
  okuyucu olmayan parçayı arar).
- KALAN: `VP8 `, `VP8L`, `VP8X`, `ALPH`, `ICCP`, `ANIM`/`ANMF` ve diğer bütün parçalar.
- `RIFF` başlığı yeni gövde boyuyla yeniden yazılır. Bir parça dosyayı aşıyorsa ya da hiç parça yoksa → `null`.

İç yardımcılar: `exifYonu(veri)` — `APP1` verisinde `Exif\0\0` + TIFF başlığını (küçük uçlu `II` ya da büyük uçlu `MM`) okur,
ilk dizinde `0x0112` (Orientation) etiketini arar; 1–8 dışı ya da okunamazsa 0. `yonBolumu(yon)` — tek kayıtlı küçük uçlu TIFF
dizini ile `FF E1` bölümü üretir.

## Kimle konuşur?

- Çağırdığı: hiçbir modül (yalnız `Buffer`).
- Onu çağıran: [../bolumler/okul-sayfasi.md](../bolumler/okul-sayfasi.md) — fotoğraf yükleme ucu. Akış: yetki ve yer (`kapak`,
  `logo`, `galeri`) denetimi → saatte 40 yükleme hız sınırı → en çok 3 MB gövde → `resmiTemizle(ham)`; `null` ise 400 "Bu dosya
  fotoğraf olarak tanınmadı. PNG, JPEG ya da WebP yükle." → okul disk sınırı TEMİZLENMİŞ boyutla hesaplanır (kapak ve logo eskisinin yerine geçtiği için yalnız fark sayılır) → dosya rastgele
  adla (`wx`, `0600`) yazılır, türü (`resim.tur`) ve boyutu okul sayfası fotoğraf tablosuna kaydedilir. Fotoğraf sunulurken
  kaydedilen tür `Content-Type` olur; `sunucu/http.js` her cevapta `X-Content-Type-Options: nosniff` gönderir.
- Veritabanı kullanmaz.

## Nasıl çalışır (adım adım)?

```
resmiTemizle(b)
  tur = resimTuru(b)          ilk baytlar → png | jpeg | webp | ''
  png  → parça parça yürü: atılacak türleri alma, IEND'de dur
  jpeg → bölüm bölüm yürü: APP1'den yönü al (bir kez), APP1/APP13/COM'u alma, SOS'ta kalanı olduğu gibi ekle
  webp → 12. bayttan parça parça yürü: EXIF/XMP'yi alma, VP8X bayrağını düzelt, RIFF başlığını yeniden yaz
  sonuç null ya da hata → null  (tanınmadı)
  değilse { tur, veri }
```

## Dikkat!

- Tür kararı yalnız imzaya dayanır; imzası doğru ama içi bozuk bir dosya (ör. `IDAT` verisi çöp) kabul edilebilir. Tarayıcı onu
  bozuk resim olarak gösterir; kod çalıştırma riski yok (`nosniff` + resim türü).
- JPEG'de `SOS`'tan sonrası (görüntü verisi VE dosya sonu `FF D9`'dan sonra eklenmiş olası ek veri) olduğu gibi kalır; PNG'deki
  gibi "sondan fazlası kırpılır" kuralı JPEG'de yok. `nosniff` ve `image/jpeg` türüyle sunulduğu için tarayıcı bunu çalıştırmaz,
  ama dosyanın sonuna gizlenmiş veri silinmemiş olur.
- PNG'de bilinmeyen özel parçalar ve JPEG'de `APP1`/`APP13` dışındaki `APPn`'ler (ör. bazı üreticilerin `APP3`–`APP12`
  bölümleri) kalır; bunlarda cihaz bilgisi olabilir. Konum bilgisi pratikte EXIF/XMP'dedir ve o gider.
- JPEG'de yalnız İLK dizindeki yön okunur; `APP1` birden çoksa (EXIF + XMP) yalnız ilk bulunan yön yazılır.
- Temizlik sonrası boyut küçülebilir; disk sınırı bu yüzden temizlenmiş boyutla hesaplanır.
- GIF, HEIC, BMP kabul edilmez; bu türde yükleme "tanınmadı" hatası alır.

## Testleri

- `testler/test-okul-sayfasi.js` (sunucu ister) — `.png` diye gönderilen HTML'in reddi, `<script>`'li SVG'nin reddi, PNG kapağın
  yüklenmesi ve girişsiz açılıp `image/png` türüyle gelmesi, PNG içindeki yazı parçasına konmuş konumun silinmesi (PNG imzası
  korunarak), JPEG'deki EXIF konumunun silinmesi ve yön değeri 6'nın korunması.
- WebP temizliği ve JPEG `APP13`/`COM` atımı için test yok.
- `testler/test-resim-kucult.js` bu dosyayı DEĞİL, tarayıcıdaki küçültmeyi (EXIF yönü dahil) dener.
- Elle: `node -e "const r=require('./sunucu/yardimci/resim');console.log(r.resimTuru(require('fs').readFileSync('public/simge-192.png')))"`
  → `image/png`.

## Son durum

- Dosya `ed9c5b0 commit 389` (2026-09-26, okul sayfası) ile okul sayfası bölümüyle birlikte eklendi ve o günden beri değişmedi.
- Açık: WebP temizliği testsiz; JPEG sonundaki ek veri kırpılmıyor (yukarıda).
- Sıradaki işlerden "Sunucuda küçültme (kendi JPEG/PNG kodlayıcısı, worker, güvenli değiştirme, meta veri silme …)" meta veri
  silmeyi bütün yüklemelere genişletecek; bu dosyanın temizleyicileri orada yeniden kullanılabilir ya da yerini kodlayıcı alabilir.
  "Başarılarım" işi (PNG/JPEG/PDF belge) ve "Düzenleyiciler" (quiz sorusuna resim) da tür denetimine ihtiyaç duyacak.
