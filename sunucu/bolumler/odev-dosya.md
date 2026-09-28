# sunucu/bolumler/odev-dosya.js

Öğrencinin ödeve yüklediği teslim dosyaları (`/api/odev-dosya`): akışla güvenli yükleme, listeleme, biletle indirme,
tarayıcıda gösterme, öğretmene zip, silme ve saatlik temizlik.

## Bu dosya ne yapar?

Öğretmen ödev verirken "Öğrenciler bu ödeve dosya yükleyebilsin" kutusunu işaretlerse (`dosyaYukleme`, bkz.
[odev.md](odev.md)) öğrenci ödevine dosya (PDF, Word, resim, video…) yükler. Ödevi veren öğretmen ve okulun müdürü
dosyaları tek tek ya da hepsini tek bir zip olarak indirir; veli çocuğunun dosyalarını görür ve indirir. Fotoğraf, video
ve ses tarayıcıda açılabilir.

Dosya yükleme sitenin en tehlikeli işlerinden biri: büyük gövdeler belleği doldurabilir, disk dolabilir, yüklenen bir
HTML ya da SVG tarayıcıda çalışıp oturumu çalabilir, aynı anda gelen yüklemeler sınırları aşabilir. Bu dosya bunların
hepsine karşı tek tek önlem alır ve aynı yardımcıları mesaj/ödev ekleri için [ekler.md](ekler.md)'ye de verir.

Sınırlar kısaca: tek dosya en çok 50 MB; bir öğrencinin bir ödevdeki dosyaları en çok 10 adet ve toplam 50 MB. Dosyalar
kendiliğinden silinir: son teslimden 7 gün sonra (son teslim yoksa sonuçlandırmadan 7 gün sonra, hiç sonuçlandırılmazsa
yüklemeden 60 gün sonra). Her dosya okulun disk sınırına sayılır ([okul-disk.md](okul-disk.md)).

## İçinde neler var?

### Sabitler

- `KLASOR` — `DATA/dosyalar` (public klasörünün dışında). Dosya adı 32 haneli rastgele onaltılık; yarım yükleme
  `<id>.yukleniyor`.
- `DOSYA_SINIR` — 50 MB; `OGRENCI_SINIR` — `{ adet: 10, toplam: 50 MB }` (bir öğrencinin bir ödevde).
- `BOS_YER_PAYI` — 2 GB: diskte her zaman bu kadar boş yer kalmalı.
- `ZIP_SINIR` — 3500 MB (zip32 biçiminin 4 GB sınırının altında); zip en çok 65000 dosya.
- `BOSTA_MS` — 60 sn veri gelmezse yükleme kesilir; `EN_UZUN_MS` — 1 saat; `EN_AZ_HIZ` — 8 KB/sn (ilk dakikadan sonra
  ortalama bunun altındaysa kesilir).
- `TESLIM_PAYI_MS` — 10 dakika: süre dolmadan başlamış yükleme süre dolduktan en çok 10 dakika sonra bitebilir.
- `AYNI_ANDA_KISI` 3, `AYNI_ANDA_OKUL` 20, `AYNI_ANDA_TOPLAM` 60 — aynı anda süren yükleme sayıları.
- `UZANTILAR` — izinli uzantılar: belgeler (pdf, doc(x), odt, rtf, txt, xls(x), ods, csv, ppt(x), odp, key, pages, numbers),
  resimler (jpg, jpeg, png, gif, webp, heic, heif, bmp, tif(f), svg, psd, ai), ses/video (mp3, m4a, wav, ogg, aac, flac,
  mp4, mov, m4v, webm, avi, mkv, 3gp), arşiv ve kod (zip, rar, 7z, sb3, ggb, py, ipynb, html, css, js, java, c, cpp).
  Listede olmayan (ör. `.exe`, `.bat`) yüklenmez.
- `MEDYA` — tarayıcıda açılabilen türler ve gönderilecek `Content-Type`: jpg/jpeg/png/gif/webp/bmp (resim), mp4/m4v/
  webm/mov (video), mp3/m4a/wav/ogg/aac (ses). SVG ve HTML BİLEREK yok.
- Mesajlar: `DOSYA_KAPALI` ("Bu ödev için dosya yüklenmiyor."), `ALAN_DOLDU`, `SAYI_DOLDU`.

### Uçlar

`uclar(k)` yalnız `p === 'odev-dosya'` iken çalışır. Okulda "Ödevler" bölümü kapalıysa (`api.js`, `odev-dosya → odev`)
oturumlu istek buraya gelmez; yüklemede bu denetimi `api.js` gövdeyi okumadan önce ayrıca yapar. Oturumsuz biletle
indirme (`?bilet=`) bu kapıya takılmaz (kapı oturumlu kişiye bakar); bilet zaten ödevler açıkken alınmış olmalıdır ve 60 sn
(gösterme bileti 5 dk) yaşar.

- **`POST /api/odev-dosya/yukle?odev=<id>`** — gövde dosyanın KENDİSİ (JSON değil). Başlıklar: `Content-Length`
  (zorunlu), `X-Dosya-Adi` (`encodeURIComponent` ile). `api.js` bu isteği `readBody`'den önce ayırıp doğrudan `yukle(k)`'ya
  verir; denetimlerin hepsi buradadır (sırayla):
  1. giriş yoksa 401; aydınlatma onayı eskiyse 403; şifresini değiştirmesi gerekiyorsa 403 "Önce kendi şifreni belirle.";
  2. onaylı öğrenci değilse 403 "Ödeve yalnızca öğrenci dosya yükler";
  3. hız sınırı: öğrenci başına saatte 60 yükleme (429);
  4. ödev yok ya da ona verilmemiş 404; `dosyaYukleme` kapalıysa 403 `{ dosyaKapali: true }`;
  5. teslim kapalı (`teslimKapali`): "Ödev sonuçlandırıldı; dosya yüklenemez.", "Ödev henüz başlamadı.", "Teslim süresi
     doldu." (400);
  6. `Content-Length` yok/bozuk 411; 50 MB'tan büyük 413; ad temizlendikten sonra boşsa 400; uzantı listede yoksa 415;
  7. öğrencinin bu ödevde 10 dosyası varsa 400 `SAYI_DOLDU`; toplam 50 MB'ı aşacaksa 413 ("Bu dosya sığmıyor: … boş yerin
     kaldı");
  8. okulun disk sınırı dolacaksa 507 `{ okulDolu: true }` (ve müdüre/yöneticiye bir kez "doldu" bildirimi); diskteki boş
     yer 2 GB payın altına inecekse 507 "Sunucuda yer kalmadı."; aynı anda çok yükleme varsa 429;
  9. yer ayrılır, dosya `<id>.yukleniyor`'a akarak yazılır (boyut, CRC32, SHA-256 akarken hesaplanır);
  10. bitince ödev YENİDEN okunur: silinmiş, sonuçlandırılmış ya da süresi 10 dakikadan çok geçmişse "Teslim kapandı;
      dosya kaydedilmedi." (400); öğretmen bu arada yüklemeyi kapattıysa 403 `dosyaKapali`;
  11. dosya kalıcı adına taşınır, kayıt kilitli satırla yazılır (`depo.odevDosyalari.ekle`: sayı ve toplam bir kez daha);
      sığmazsa dosya silinir ve 400/413;
  12. okulun doluluğu %80'i geçtiyse müdüre ve yöneticiye bir kez haber (`okulDisk.yuklendi`).
  Cevap `{ dosya: { id, ad, boyut, yuklenme }, message: '<ad> yüklendi.' }`. Ayrılan yer her durumda bırakılır (`finally`).
- **`GET /api/odev-dosya?odev=<id>[&ogrenci=<id>]`** — liste. Rol `student`, `parent`, `teacher`, `principal`.
  - Ödevi yöneten (veren öğretmen ya da okulun müdürü) `ogrenci` vermezse bütün dosyalar: `{ dosyalar, yonetir: true,
    toplam, dosyaYukleme, saklama }`.
  - Öteki durumlar (öğrenci kendisi; veli `?ogrenci=` ile çocuğu; yöneten `?ogrenci=` ile tek öğrenci): `gorebilir` değilse
    403. Cevap `{ dosyalar, dosyaYukleme, yukleyebilir, silebilir, kapali, kullanilan, saklama, sinir: { dosya, adet,
    toplam, uzantilar } }`.
  - Her dosya: `{ id, ad, boyut, yuklenme, bitis (silinme anı), ogrenciId, ogrenci }`. `saklama` silinme kuralını Türkçe
    anlatır.
- **`GET /api/odev-dosya/bilet?tur=dosya&id=<dosya>`**, **`?tur=goster&id=<dosya>`**, **`?tur=zip&odev=<ödev>`** —
  indirme bileti. Cevap `{ yol }`: `tur=dosya` (ya da `tur` hiç verilmezse) `/api/odev-dosya/indir?bilet=…`, `tur=goster`
  `/api/odev-dosya/goster?bilet=…` ve ayrıca `tur: 'resim'|'video'|'ses'` (tarayıcıda açılamayan türde 400 "Bu dosya
  tarayıcıda açılamaz; indir."), `tur=zip` `/api/odev-dosya/zip?bilet=…`. Yetki `dosyaErisimi`/`zipErisimi` ile: dosya yoksa
  404 "Dosya bulunamadı", göremiyorsa 403 "Bu dosyayı görme yetkin yok"; zipte ödev yoksa 404, ödevi yönetmiyorsa 403
  "Toplu indirmeyi yalnızca ödevi veren öğretmen yapabilir" (müdür de yönetir sayılır). Hız sınırı: tek dosya ve gösterme
  için ortak sayaçla saatte 300, zipte saatte 20. Bilet deposu 5000'i geçerse 503.
- **`GET /api/odev-dosya/indir?bilet=`**, **`/goster?bilet=`**, **`/zip?bilet=`** — oturum başlığı OLMADAN, yalnız biletle
  (tarayıcı indirmeyi doğrudan diske alsın diye). Bilet yok/süresi dolmuş/türü tutmuyorsa 410 "İndirme bağlantısının süresi
  doldu. Yeniden dene.". Bilet sahibinin hesabı yeniden okunur (onaylı değilse 403 "Yetkin yok") ve yetkisi yeniden
  denetlenir (bilet ucundaki 404/403'ler). Adreste `bilet` yoksa istek oturumlu uçlara düşer (aşağıda).
- **`GET /api/odev-dosya/indir?id=<dosya>`** — oturumla doğrudan indirme (aynı yetki, saatte 300).
- **`GET /api/odev-dosya/zip?odev=<id>`** — oturumla zip (yalnız ödevi yöneten, saatte 20).
- **`POST /api/odev-dosya/sil`** — gövde `{ id }`. Yöneten her zaman siler. Öğrenci yalnız kendi dosyasını, teslim açıkken
  ve dosya yükleme açıkken siler (kapalıysa 400 "… Dosya silinemez." ya da 403 `dosyaKapali`). Başkası 403. Kayıt silinir,
  sonra diskteki dosya. Cevap `{ message: '<ad> silindi.' }`.

### Dışa açılan işlevler ve değerler

- `uclar(k)` — yukarıdaki uçlar.
- `dosyaSupur()` — saatlik temizlik: silinme anı gelen dosyaların kaydını siler (`depo.odevDosyalari.eskileriSil`) ve
  dosyalarını diskten kaldırır; `KLASOR`'de 2 saatten eski yarım yüklemeleri (`.yukleniyor`) ve kaydı olmayan 1 saatten
  eski dosyaları siler. Silinen artık sayısını döner.
- `dosyaAdi(ham)` — kullanıcının verdiği adı temizler: `decodeURIComponent`, yol parçaları atılır (yalnız son parça),
  NFC, denetim karakterleri, Windows'ta yasak işaretler (`<>:"|?*`) ve yön değiştirme karakterleri atılır, baştaki noktalar
  atılır, en çok 150 karakter (uzantı korunur). Bozuk kodlamada `''`.
- `teslimKapali(a)` — `''` ya da Türkçe neden (sonuçlandı / başlamadı / süre doldu).
- `KLASOR`, `UZANTILAR`, `uzanti(ad)` (küçük harfli uzantı).
- `akisiYaz(req, hedef, beklenen)` — gövdeyi diske akıtır; `{ boyut, crc32, sha256 }` ya da `kod`lu hata (408 yavaş/kopuk,
  400 fazla/eksik veri, 500 yazılamadı). Hata olursa yarım dosyayı siler. Dosya `wx` (var olanın üstüne yazmaz) ve `0600`
  izniyle açılır.
- `reddet(req, res, mesaj, kod, ek)` — reddedilen yüklemede gövdenin geri kalanını okumadan cevap yazar,
  `Connection: close` der ve 1,5 sn sonra bağlantıyı keser (istemci cevabı görebilsin).
- `ekBasliklari(ad, boyut)` — "ek olarak indir" başlıkları: `application/octet-stream`, `Content-Disposition: attachment`
  (ASCII ad + UTF-8 `filename*`), `Cache-Control: private, no-store`, `nosniff`, `Content-Security-Policy: default-src
  'none'; sandbox`.
- `biletVer(kullaniciId, tur, hedef)`, `biletKullan(bilet)` — bellekte bilet: 24 baytlık rastgele; `goster` bileti 5 dakika
  ve çok kullanımlık (video parça parça istenir), öbürleri 60 sn ve tek kullanımlık.

### Önemli iç işlevler

- `yonetir(me, a)` — ödevi veren öğretmen ya da aynı okulun müdürü.
- `gorebilir(me, a, ogrenciId)` — öğrenci ödevde olmalı; kendisi, yöneten ya da bağlı veli (öğrenci olmayan ve `bagliMi`).
- `dosyaErisimi(kisi, id)`, `zipErisimi(kisi, odevId)` — indirmede ve bilet verirken AYNI kural.
- `biletleIndir(req, res, bilet, tur)`.
- `dosyaGonder(res, d)` — ek olarak gönderir; diskte yoksa 404 "Dosya sunucuda bulunamadı".
- `medyaGonder(req, res, d)` — tarayıcıda gösterir: `inline`, gerçek tür, `Accept-Ranges`, `Range` isteğine 206 (bozuk
  aralığa 416), `Cache-Control: private, max-age=300`, `nosniff`, CSP `default-src 'none'; img-src 'self'; media-src
  'self'; sandbox`. `MEDYA`'da olmayan tür `dosyaGonder`'e düşer.
- `zipGonder(res, a, dosyalar)` — sıkıştırmasız zip, akışla: başlıklar önceden hesaplanır (boyut ve CRC32 yüklemede
  saklanmıştı), dosyalar sırayla diskten akar. Dosya adları `Öğrenci Adı/dosya.pdf`; aynı ad ikinci kez gelirse
  `dosya (2).pdf`. Diskte olmayan ya da boyutu kayıtla tutmayan dosya zipe girmez. Hiç dosya yoksa 404, sınır aşılırsa 413
  "öğrenci öğrenci indir". Zip adı `<Ödev adı> - teslimler.zip`.
- `dosDamga`, `yerelBaslik`, `merkezBaslik`, `zipAdi` — zip biçimi yardımcıları (UTF-8 ad bayrağı `0x0800`).
- `suren`, `ayir`, `birak` — süren yüklemelerin sayısı ve ayrılan baytlar (okulun baytı `okulDisk.ayir/birak` ile).
- `bosYer()` — `fs.statfs` ile diskteki boş yer (bilinmiyorsa `null`, denetim atlanır).
- `mbYaz`, `sigmiyor`, `saklamaYazisi`, `gorunum`, `medya`.

## Kimle konuşur?

- Çağırdıkları: `crypto`, `fs`, `path`, `zlib` (`crc32`), `events.once`; `../guvenlik` → `hizSinir`; `../http` → `bad`,
  `baslikEkle` (ortak güvenlik başlıkları), `ok`, `sendJSON`; `../ortak` → `clean`; `../yollar` → `DATA`;
  [odev.md](odev.md) → `odevBitisAni`; [okul-disk.md](okul-disk.md) → `durum`, `sigmaz`, `doldu`, `OKUL_DOLU`, `yuklendi`,
  `ayir`, `birak`.
- Depo ve tablolar: `depo.odevDosyalari` (`sunucu/veri/depo/odev-dosyalari.js`) → `odev_dosyalari` (şema 008; `odevler`,
  `kullanicilar` ile birleşir; `bul`, `odevin`, `ekle`, `sil`, `kayitlilar`, `eskileriSil`); `depo.odevler.bul` → `odevler`,
  `odev_ogrencileri`; `depo.kullanicilar.bul`, `bagliMi` → `kullanicilar` ve veli bağları.
- Onu çağıranlar:
  - `sunucu/api.js` — yüklemeyi gövde okunmadan önce `odev_dosya.uclar(...)` ile (bağlamda `kvkkGuncel`, `sifreTamam`,
    `need: () => false`), öbür yolları `BOLUM['odev-dosya']` ile;
  - `sunucu/index.js` — `dosyaSupur()` açılıştan 1 dakika sonra ve saatte bir, ardından `okul-disk.mutabakat`;
  - `araclar/gorsel-veri.js` — ekran turu için örnek veri kurarken öğrenci adına teslim dosyası yükler (`/yukle?odev=`);
  - [ekler.md](ekler.md) — `akisiYaz`, `reddet`, `ekBasliklari`, `dosyaAdi`, `uzanti`, `UZANTILAR`, `biletVer`,
    `biletKullan`.
- Ön yüz: `public/js/parcalar/14b-odev-teslim.js` — öğrencinin teslim kutusu (liste, `XMLHttpRequest` ile ilerleme çubuklu
  yükleme, silme), öğretmen/veli listesi, biletle indirme, `goster` ile önizleme, zip.
- Android uygulaması bu uçları çağırmaz.

## Nasıl çalışır (adım adım)?

### Yükleme

```
tarayıcı ──POST /api/odev-dosya/yukle?odev=ID (gövde = dosya)──► api.js
   api.js: ödev özelliği kapalı mı? → readBody'ye SOKMADAN yukle(k)
yukle:
   kimlik, onay, şifre, rol ─► hız ─► ödev, izin, teslim ─► boyut, ad, uzantı
   ─► öğrencinin alanı ─► okulun disk sınırı ─► diskte boş yer ─► aynı anda kaç yükleme
   ─► ayir()                                  (buraya kadar await yok: yarışsız ayırma)
   ─► akisiYaz → <id>.yukleniyor              (SHA-256 + CRC32, yavaş/kopuk bağlantı kesilir)
   ─► ödevi yeniden oku (sonuçlandı mı, süre+10 dk, izin kapandı mı)
   ─► rename → <id> ─► depo ekle (kilitli satır, sayı/toplam tekrar)
   ─► okulDisk.yuklendi (%80 uyarısı) ─► birak()
```

### İndirme

```
GET /api/odev-dosya/bilet?tur=dosya&id=X   (oturumlu; yetki denetlenir) → { yol: …/indir?bilet=B }
tarayıcı yeni pencerede/indirme olarak açar: GET …/indir?bilet=B   (oturumsuz)
   → bilet tek kullanımlık, 60 sn → sahibinin hesabı ve yetkisi YENİDEN denetlenir → attachment
```

### Silinme anı

`odev_dosyalari`'da silinme anı saklanmaz, her sorguda ödevden hesaplanır (`depo/odev-dosyalari.js` `SILINME`):
son teslim varsa son teslim + 7 gün; yoksa sonuçlandırma + 7 gün; hiç sonuçlandırılmadıysa yükleme + 60 gün. Hiçbir zaman
ödevin `dosya_saklama` anından önce değil (şema 034; son teslim değişince/ödev yeniden açılınca "şimdi + 7 gün").

## Dikkat!

- **Yüklenen içerik asla sayfa olarak çalışmaz.** İndirme her zaman `attachment` + `octet-stream` + `nosniff` +
  `sandbox`. Tarayıcıda gösterilen türler yalnız resim/video/ses ve tür uzantıdan belirlenir, içerikten sezdirilmez: uzantısı
  `.mp4` olan bir HTML dosyası yalnız bozuk bir video olarak görünür. SVG ve HTML bu yüzden `MEDYA`'da yok.
- **Adres tahmin edilemez ama yine de her indirmede yetki denetlenir.** Dosya adı 32 haneli rastgele; biletle indirmede
  bile bilet sahibinin hesabı ve yetkisi yeniden okunur (bilet verildikten sonra veli bağı kopmuş olabilir).
- **Gövde JSON okuyucusuna girmez:** yükleme `api.js`'te `readBody`'den önce ayrılır, yoksa 2 MB sınırına takılır ve belleğe
  alınırdı. Bu yüzden `api.js`'in kvkk/şifre/rol kapıları da bu uçta işlemez; `yukle` aynılarını kendisi yapar (`need:
  () => false`). Rolsüz kapısı ve arşiv yılı kapısı yükleme için yoktur (öğrenci rolü şartı rolsüzü zaten dışarıda tutar).
- **Yarış durumları:** (1) boş yer, okulun disk sınırı ve "aynı anda kaç yükleme" denetimi ile `ayir()` arasında `await`
  yok, iki yükleme aynı boş yeri paylaşamaz; (2) sayı ve toplam boyut son olarak veritabanında öğrencinin ödev satırı
  `FOR UPDATE` kilitliyken bir kez daha denetlenir; (3) yükleme sürerken ödev silinebilir/sonuçlanabilir/izni
  kapanabilir, bitişte ödev yeniden okunur.
- **Reddedilen yüklemede gövde okunmaz:** 50 MB'lık bir dosya 413 almak için sonuna kadar gönderilmesin diye cevap hemen
  yazılır ve bağlantı kapatılır.
- **Bildirilen boyuta güven yok:** `Content-Length`'ten fazla veri gelirse yükleme kesilir; eksik gelirse "yarıda kaldı".
- **Yavaş bağlantı saldırısı:** 60 sn veri gelmezse, 1 saati geçerse ya da ilk dakikadan sonra ortalama hız 8 KB/sn'nin
  altındaysa yükleme kesilir.
- **Teslim payı:** süre dolmadan başlayan yükleme 10 dakika geç bitebilir (büyük dosya son dakikada başladıysa).
- **Dosya yükleme kapatılınca teslim donar:** öğrenci ne yeni dosya yükleyebilir ne yüklediğini silebilir (öğretmen
  değerlendirirken dosya kaybolmasın); yalnız öğretmen/müdür siler.
- **Sunucu saati:** `teslimKapali` "bugün"ü sunucunun yerel saatiyle, `odevBitisAni` de yerel saatle hesaplar; silinme
  sorgusu sunucunun UTC farkını parametre olarak verir. Sunucu Türkiye saatinde çalışmalı (`TZ=Europe/Istanbul`,
  `belge/SUNUCUYA-KURULUM.md`).
- **Kaydı silinen dosya diskte bir saat kalabilir:** ödev silinince (`ON DELETE CASCADE` ile kayıtlar gider) dosyalar
  `dosyaSupur`'un "kaydı olmayan dosya" kuralıyla, dosyanın değişme anından 1 saat sonra silinir.
- **Zip belleğe alınmaz:** geri basınç (`drain`/`close` yarışı) ile yazılır; kaybeden bekleyici `AbortController` ile iptal
  edilir, yoksa her beklemede bir dinleyici birikirdi. Başlık gittikten sonra hata olursa yarım zip yerine bağlantı kesilir.
- `dosyaGonder`'deki yol birleştirme güvenlidir çünkü `id` veritabanında `^[0-9a-f]{32}$` denetimiyle (şema 008) saklanır.

## Testleri

- `testler/test-odev-dosya.js` — yükleme (yalnız ödevdeki öğrenci, teslim açıkken, izinli tür), ad temizliği, içeriğin
  bayt bayt geri gelmesi, ek başlıkları, başka öğrenci/öğretmen ve bağsız velinin erişememesi, zip'in geçerliliği (öğrenci
  klasörleri, CRC32), sayı sınırı, sonuçlandırılmış ve süresi geçmiş ödev, büyük dosya, tarayıcıda açma (`goster`, Range),
  "dosya yükleyebilsin" izninin varsayılan kapalı olması, 50 MB sınırı ve doluluk, silinme anı (son teslim ileri alınınca,
  son teslimsiz ödev, geçmişe yazılan tarih), okulun disk sınırı (%80 ve dolu, 507 `okulDolu`).
- `testler/test-okul-disk.js` — okulun disk sayacı (ekler ve okul fotoğraflarıyla birlikte).
- `testler/test-ozellikler.js` — ödev kapalı okulda öğrencinin teslim listesi 403.
- `testler/test-yedek.js` — yüklenen teslim dosyasının kaydının yedekten geri dönmesi; `testler/test-resim-kucult.js` —
  tarayıcının küçültüp yükleme adresine gönderdiği istek (sunucusuz, istek adresini denetler); `testler/yetki-denetimi.js`.
- Elle: öğretmenle "dosya yükleyebilsin" işaretli bir ödev ver, öğrenciyle Ödevler sayfasında ödeve bir PDF yükle, öğretmenle
  ödev ayrıntısında "Hepsini indir (zip)" de.

## Son durum

- Son commit `40fc7e7 commit 525` (2026-09-27, okul disk sınırı): okul kotası (`EE_OKUL_DOSYA_GB`, `OKUL_SINIR`, `okulUyar`,
  `alanYaz`) bu dosyadan çıkıp [okul-disk.md](okul-disk.md)'ye taşındı; artık ekler ve okul fotoğraflarıyla birlikte tek
  sayaç; dolunca 507 cevabına `okulDolu: true` eklendi.
- Ondan önce `566b917 commit 524` (2026-09-27, canlı hazırlık): sınırlar 150 MB'tan 50 MB'a indi; "dosya yükleyebilsin"
  izni (`dosyaKapali`), öğrencinin alanı dolunca açık mesajlar (`ALAN_DOLDU`, `SAYI_DOLDU`, `sigmiyor`), silinme kuralı
  (son teslim + 7 gün / 60 gün) ve okul kotası uyarıları eklendi.
- Dosya `942bcfd commit 363`, `5887a71 commit 364`, `7332f32 commit 365` (2026-09-26) ile kuruldu.
- Açık iş: sıradaki iş "Sunucuda küçültme (… aynı dosya tek kopya …)" teslim dosyalarının saklanmasına dokunacak (aynı
  dosyanın tek kopya tutulması, resim/video küçültme).
