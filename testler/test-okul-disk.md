# testler/test-okul-disk.js

Okul başına disk sınırını uçtan uca deneyen sunuculu test paketi (46 denetim): site ayarındaki varsayılan sınır ve kaynağı,
okul açarken ve okul ekranında sınır verme, teslim dosyası + ek + okul fotoğrafı sayımı, %80 ve "doldu" bildirimlerinin bir kez
gitmesi, dolunca üç yükleme türünün de 507 alması, sınır küçülünce dosyaların silinmemesi, sistem geneli ve saatlik mutabakat.

## Bu dosya ne yapar?

Bir sunucuda birçok okul var; her okulun dosyaları (öğrencilerin ödev teslimleri, ödev ve mesaj ekleri, okul sayfasının
fotoğrafları) diskte yer tutar. Bir okul bütün diski doldurup öbürlerini durdurmasın diye her okulun bir **disk sınırı** var,
tıpkı bir diskin bölümleri gibi ([../sunucu/bolumler/okul-disk.md](../sunucu/bolumler/okul-disk.md)). Sınırı yönetici okulu
açarken verir, Okullar ekranında değiştirir; vermezse site ayarındaki "Varsayılan okul disk sınırı" geçerlidir (o da yoksa
`EE_OKUL_DOSYA_GB` ortam değişkeni, o da yoksa 5 GB). Alan %80'e gelince müdür ve sistem yöneticisi bir kez uyarılır; dolunca
yeni yükleme açık bir iletiyle durur ve yine bir kez haber gider. Sınır küçültülürse hiçbir dosya silinmez, yalnız yeni yükleme
durur. Saatte bir de kayıtlar diskteki dosyalarla karşılaştırılır.

Bu paket o kuralların hepsini sırayla dener. Dosya başındaki yorum maddeleri şöyle özetliyor: varsayılan sınır ve kaynağı
(panelden kaydedilmediyse `EE_OKUL_DOSYA_GB`; `tumtest` bu pakete 0.001 = 1 MB verir, kaynak "ortam"; kaydedilince veritabanı;
"Varsayılana dön" ile yine ortam), doğrulama ve işlem kaydı; okul açarken `diskMb`; okul ekranında sınırı değiştirme ve yönetici
olmayana "bilinmeyen adres" (404); sayım ve müdürün `/school/ozet`'te görmesi; %80 bildirimi bir kez; dolunca ek, fotoğraf ve
teslimin 507 `{ okulDolu }` alması; sınır küçülünce dosyanın silinmemesi, büyüyünce uyarının yeniden kurulması; sistem geneli
(ayrılan, kullanılan, diskteki boş yer, veritabanı, boş yerden fazla ayrılınca uyarı); saatlik mutabakat (sahipsiz dosya). Teslim
dosyasının kendi kuralları (yükleme, indirme, silinme anı) ayrı pakettedir: [test-odev-dosya.md](test-odev-dosya.md).

## İçinde neler var?

### Sabitler ve yardımcılar

- `BASE` — `EE_BASE` ya da `http://localhost:3000` (dosyanın kendi kopyası). `MB`, `GB`.
- `ORTAM_MB` — test sürecine verilen `EE_OKUL_DOSYA_GB`'nin MB karşılığı (`Math.round(GB * 1024)`, en az 1); değişken yoksa `0`.
  1. bölümün ilk denetimi buna göre iki daldan birini seçer. Sunucuya da aynı değer verilmiş olmalı.
- `DOLU` — beklenen 507 iletisi: "Okulunun dosya alanı doldu. Okul yönetimi eski dosyaları sildirebilir ya da yöneticiden alan
  isteyebilir." (sunucudaki `OKUL_DOLU` ile aynı).
- `kontrol`, `J(x)` (220 karakterlik JSON; `undefined` → `null`), `gun(n)` (UTC takvim günü), `bekle(ms)`.
- `hamYukle(token, yol, ad, veri, tur)` — gövdesi dosyanın kendisi olan `POST` (`Content-Type` varsayılan
  `application/octet-stream`, ad verilirse `X-Dosya-Adi`). Üç kısa yolu:
  `teslimYukle(tok, odev, ad, veri)` → `/api/odev-dosya/yukle?odev=`, `ekYukle(tok, ad, veri)` → `/api/ek/yukle?tur=mesaj`,
  `fotoYukle(tok, veri)` → `/api/okul-sayfa/foto?yer=galeri` (`image/png`).
- `pngUret(w, h)` — sunucunun gerçekten çözebileceği, rastgele renkli, sıkıştırılmamış (zlib düzey 0) bir PNG üretir; boyutu
  önceden bellidir. 4. bölüm 80 × 80'lik bir tane kullanır.
- Ana gövdedeki kısa işlevler: `genel()` (`GET /api/admin/overview`), `okulum(id)` (o okulun `disk` görünümü; varsayılan seed
  okulu), `sinirYaz(id, mb, tok)` (`POST /api/admin/okul-disk-siniri`, varsayılan yönetici), `kayitlar(islem)`
  (`GET /api/islem-kaydi?islem=`), `say(tok, parca)` (bildirimlerde metin sayar), `sayBekle(tok, parca, n)` ("doldu" bildirimi
  yüklemeyi bekletmeden gittiği için 150 ms aralıkla en çok 20 kez bakar).

Ortak yardımcılar [giris.md](giris.md) üzerinden ([../araclar/giris.md](../araclar/giris.md)): `iste`, `girisYap`, `hesapAc`,
`kisiKodu`, `mudurYap`.

### Hesaplar ve veriler

Seed'den ([seed.md](seed.md)): sistem yöneticisi (`A`), müdür (`M`), Matematik öğretmeni (`mat`), öğrenci `ogrenci1` (`o1`);
okul "Test Ortaokulu" (yöneticiye giden bildirimler bu adla başlar). Paketin açtıkları (`z = Date.now().toString(36)`): yetişkin
hesapları `diskmudur<z>` ve `disksiz<z>`; onların müdürü olduğu iki yeni okul "Disk Okulu <z>" (3 GB ile) ve "Varsayılan Okulu <z>"
(özel sınırı yok, varsayılanı kullanır); "Disk ödevi <z>" (`dosyaYukleme: true`); yüklenen ekler, bir teslim dosyası, bir galeri
fotoğrafı.

### 1) Varsayılan okul disk sınırı: site ayarı (8)

`GET /api/admin/site-ayarlari` → `ayarlar.okulDiskMb`:

- `EE_OKUL_DOSYA_GB` verildiyse değer `ORTAM_MB`, kaynak `'ortam'`; verilmediyse 5120 ve `'varsayilan'` (iki daldan biri sayılır).
- Sınırlar ve kodun varsayılanı: `en: 1`, `cok: 10485760` (10 TB), `varsayilan: 5120`.
- Seed okulunun özel sınırı yok: `ozel: false`, `siniriMb: null`, `sinir` = varsayılan.
- Bozuk değerlerin hepsi 400 ve `alan: 'okulDiskMb'`: `0`, `-5`, `2.5`, `10485761`, `'abc'`, `''`, `{}`, `[1]`, `null`, `true`.
- 2048 kaydedilir: kaynak `'veritabani'`; varsayılanı kullanan okulun sınırı hemen 2 GB; işlem kaydında
  `site.okul-disk-siniri`, adı "Varsayılan okul disk sınırı değişti", ayrıntı "… → 2 GB" ile biter.
- `{ sifirla: true }` ("Varsayılana dön") → kaynak yine `'ortam'` (ya da `'varsayilan'`). Buradaki değer paketin geri kalanında
  `VARSAYILAN_MB` olarak kullanılır.

### 2) Okul açarken disk sınırı (5)

`diskmudur<z>` hesabını açar, kişi kodunu alır. `POST /api/admin/okul-ac`'a bozuk `diskMb`'lerle (`0`, `-1`, `2.5`, `'abc'`,
`10485761`, `{}`, `true`) gider: hepsi 400, `alan: 'diskMb'`. Sonra `mudurYap` ile "Disk Okulu"nu `diskMb: 3072` ile açar:
`siniriMb: 3072`, `ozel: true`, `sinir` 3 GB, kullanım 0; işlem kaydında (`okul.acildi`) ayrıntı "disk sınırı 3 GB" ile biter. "Varsayılan
Okulu" `diskMb` verilmeden açılır: `siniriMb: null`, `ozel: false`, `sinir` = varsayılan. Öneri: seed okulunda öğrenci sayısı × 10
MB, en az 2 GB (iki öğrenciyle 2048); öğrencisiz yeni okulda `oneriMb: null`.

### 3) Okul ekranı: sınırı değiştirme (7)

- Müdür `POST /api/admin/okul-disk-siniri`'ni çağırırsa 404 ve "Böyle bir adres yok" (yönetici uçları yönetici olmayana bilinmeyen
  adresle aynı cevabı verir).
- Olmayan okul 404 `alan: 'okulId'`; bozuk `mb`'ler (`0`, `-1`, `2.5`, `'x'`, `10485761`, `{}`, `[]`, `true`, hiç gönderilmemiş,
  `''`) 400 `alan: 'mb'`.
- 3 GB → 2 GB: 200, `siniriMb: 2048`, iletide "kaydedildi: 2 GB."; işlem kaydı (`okul.disk-siniri`, "Okulun disk sınırı değişti")
  ayrıntısı tam olarak "Disk Okulu <z>: 3 GB → 2 GB".
- Aynı sınır metin olarak (`'2048'`) yeniden: "zaten böyle", işlem kaydı yazılmaz (`okul.disk-siniri` kayıtlarının sayısı
  bölümün başındakinden yalnız bir fazla: 3 GB → 2 GB değişikliği).
- `mb: null` → varsayılana döner; işlem kaydında ": 2 GB → varsayılan (…".

### 4) Sayım: teslim, ek, fotoğraf (6)

Seed okulunun sınırı 50 MB yapılır. "Disk ödevi"ne `o1` 100 000 baytlık teslim, `mat` 50 000 baytlık mesaj eki (taslak) yükler,
müdür galeriye 80 × 80'lik PNG koyar; fotoğrafın boyutu `GET /api/okul-sayfa`'daki kayıttan okunur (sunucu fotoğrafı temizleyip
yeniden yazdığı için yüklenenle aynı olmayabilir).

- Üçü de 200; dağılımda `teslim` +100 000, `ek` +50 000, `foto` + kayıttaki boyut; `kullanilan = teslim + ek + foto`, `sinir`
  50 MB, `ozel: true`.
- Müdür aynı sayıları `GET /api/school/ozet`'in `disk`'inde görür; öğretmenin cevabında `disk` yok.
- Ek (`POST /api/ek/sil`) ve teslim (`POST /api/odev-dosya/sil`) silinince ikisi de sayımdan düşer (kullanım tam 150 000 azalır).

### 5) %80 ve dolu: ek, fotoğraf, teslim (8)

Sınır 1 MB yapılır (kullanım %80'in yeterince altında olmalı).

- %80'in 1000 bayt altına kadar ek: bildirim yok. 2000 bayt daha: müdüre "Okulun dosya alanının %80'i doldu", yöneticiye "Test
  Ortaokulu: dosya alanının %80'i doldu" birer kez. 1000 bayt daha: yine birer tane.
- Kalan yerden 1000 bayt büyük ek → 507, `okulDolu: true`, ileti `DOLU`. Müdüre "Okulun dosya alanı doldu (", yöneticiye "Test
  Ortaokulu: dosya alanı doldu (" birer kez (`sayBekle`).
- Kalan yerin 5000 bayt altındaki ek hâlâ sığar (200); ardından galeri fotoğrafı (507, `okulDolu`, ileti `DOLU`) ve teslim (507,
  `okulDolu`) reddedilir. 300 ms sonra "doldu" bildirimi hâlâ birer tane.

### 6) Sınır büyüyünce uyarı yeniden kurulur, küçülünce dosya silinmez (6)

- Sınır 2 MB: kullanım %70'in altında kalır, sunucu uyarı kaydını siler. %80 yeniden geçilince müdüre ikinci "%80" bildirimi gider.
- Sınır 1 MB'a, kullanımın altına küçülür: 200, `kullanilan > sinir`, `oran > 100`, iletide "aşıyor: var olan dosyalar silinmez,
  yalnız yeni yükleme durur".
- 5. bölümün ilk eki hâlâ indirilebilir (`GET /api/ek/bilet` 200), fotoğraf hâlâ açılır (`GET /api/okul-foto/<id>` 200); küçücük
  bir ek bile 507 `okulDolu`; kullanım küçültmeden önceki değerle aynı (hiçbir dosya silinmedi).

### 7) Sistem geneli (4)

Yönetim panelinin `disk`'i: `ayrilan` durumu `rejected` olmayan okulların sınırlarının toplamı, `kullanilan` bütün okulların
kullanımının toplamı (`rejected` olanlar dahil), `okul` durumu `rejected` olmayan okul sayısı; `bos` ya `null` (diskin boş yeri
okunamadı) ya da 0'dan büyük, `veritabani > 0`, `varsayilanMb` 1. bölümdeki değer. "Disk Okulu"na 10 TB verilince 200 alınır ama `sistem.asim: true` ve "diskteki boş yerden"
uyarısı gelir (izin verilir, yalnız uyarılır). Sınır geri alınınca uyarı kalkar.

### 8) Saatlik mutabakat: sunucu içinden (2)

Test süreci `EE_DATA`'yı `testler/testdata` yapar, ayarları oradan yükler; veritabanı `_test` ile bitmiyorsa
"(test veritabanı değil: mutabakat denenmedi)" yazar ve atlar. Bitiyorsa `testler/testdata/ekler/` içine 32 haneli rastgele adla
1234 baytlık **kaydı olmayan** bir dosya yazar, site ayarlarını veritabanından belleğe alır (`depo.siteAyarlari.yukle()`),
`sunucu/bolumler/okul-disk.js`'in `mutabakat()`'ını kendi sürecinde çağırır ve dosyayı siler. Beklenen: `sahipsiz` tam 1 dosya,
1234 bayt; `kayip` 0, `boyutFarki` 0, `kayitli.adet > 0` ve diskteki toplam = kayıtlı + sahipsiz + yarım. (Mutabakat ekrana
"! Dosya mutabakatı: 1 sahipsiz dosya (0,1 MB)." satırını basar; denetim değildir.)

Sonunda boş satır ve `GECTI: 46   KALDI: 0`; `KALDI` varsa çıkış kodu 1. Beklenmeyen hata `TEST HATASI:` ile, çıkış kodu 1.

## Kimle konuşur?

- **Modüller:** [giris.md](giris.md) (`iste`, `girisYap`, `hesapAc`, `kisiKodu`, `mudurYap`); 8. bölümde test sürecinin içinden
  [../sunucu/ayarlar.md](../sunucu/ayarlar.md) (`ayarlariYukle`), [../sunucu/veri/baglanti.md](../sunucu/veri/baglanti.md)
  (`veritabaniAdi`, `kapat`), [../sunucu/veri/index.md](../sunucu/veri/index.md) (`depo.siteAyarlari.yukle`) ve
  [../sunucu/bolumler/okul-disk.md](../sunucu/bolumler/okul-disk.md) (`mutabakat`); Node'un `fs`, `path`, `zlib`, `crypto`'su.
- **Sunucu uçları:**

  | Uç | Ne için | Belge |
  |---|---|---|
  | `GET /api/admin/site-ayarlari`, `POST /api/admin/site-ayarlari { anahtar: 'okulDiskMb', deger \| sifirla }` | varsayılan sınır | [../sunucu/bolumler/site-ayarlari.md](../sunucu/bolumler/site-ayarlari.md) |
  | `POST /api/admin/okul-ac { …, diskMb }` (ve `mudurYap` içinde) | okul açarken sınır | [../sunucu/bolumler/yonetici-okul.md](../sunucu/bolumler/yonetici-okul.md) |
  | `POST /api/admin/okul-disk-siniri { okulId, mb }` | okulun sınırı | [../sunucu/bolumler/okul-disk.md](../sunucu/bolumler/okul-disk.md) |
  | `GET /api/admin/overview` | okulların `disk`'i, sistem geneli | [../sunucu/bolumler/yonetici.md](../sunucu/bolumler/yonetici.md) |
  | `GET /api/islem-kaydi?islem=` | işlem kaydı | [../sunucu/bolumler/islem-kaydi.md](../sunucu/bolumler/islem-kaydi.md) |
  | `GET /api/school/ozet` | müdürün disk kartı | [../sunucu/bolumler/okul.md](../sunucu/bolumler/okul.md) |
  | `POST /api/assignments`, `POST /api/odev-dosya/yukle?odev=`, `POST /api/odev-dosya/sil` | teslim dosyası | [../sunucu/bolumler/odev.md](../sunucu/bolumler/odev.md), [../sunucu/bolumler/odev-dosya.md](../sunucu/bolumler/odev-dosya.md) |
  | `POST /api/ek/yukle?tur=mesaj`, `POST /api/ek/sil`, `GET /api/ek/bilet?id=` | ekler | [../sunucu/bolumler/ekler.md](../sunucu/bolumler/ekler.md) |
  | `POST /api/okul-sayfa/foto?yer=galeri`, `GET /api/okul-sayfa`, `GET /api/okul-foto/<id>` | okul sayfası fotoğrafı | [../sunucu/bolumler/okul-sayfasi.md](../sunucu/bolumler/okul-sayfasi.md) |
  | `GET /api/notifications`, `POST /api/register`, `POST /api/eposta-onay`, girişler | bildirim sayımı, hesaplar | [../sunucu/bolumler/kayit.md](../sunucu/bolumler/kayit.md) |
  | `GET /api/kisilikler` | kişi kodu | [../sunucu/bolumler/kisilik.md](../sunucu/bolumler/kisilik.md) |

- **Koruduğu kod:**
  - [../sunucu/bolumler/okul-disk.md](../sunucu/bolumler/okul-disk.md) — bütünüyle: `mbOku`, `sinirAdi`, `oneriMb`, `durum` /
    `gorunum`, `sigmaz` / `ayir` / `birak`, `doldu`, `yuklendi`, `uyar` (bildirim metinleri), `sistem` (`asim`, `uyari`),
    `mutabakat`, `siniriDegistir` ("zaten böyle", işlem kaydı, uyarının yeniden kurulması).
  - [../sunucu/veri/depo/okul-disk.md](../sunucu/veri/depo/okul-disk.md) — kullanımın kayıtlardan toplanması (teslim, silinmemiş ek
    taslak dahil, fotoğraf), `uyariYaz` (seviye başına bir kez), `uyarilariSifirla` (%70'in altında), `kayitlar`,
    `veritabaniBoyutu`.
  - [../sunucu/site.md](../sunucu/site.md) — `OKUL_DISK` (`en`, `cok`, `varsayilan`), `okulDiskTemizle`, ortam değişkeninin
    okunması ve `okulDiskMb`'nin kaynağı (`veritabani` > `ortam` > `varsayilan`);
    [../sunucu/bolumler/site-ayarlari.md](../sunucu/bolumler/site-ayarlari.md) — doğrulama, `sifirla`, işlem kaydı.
  - [../sunucu/bolumler/yonetici-okul.md](../sunucu/bolumler/yonetici-okul.md) — `diskMb` ve `okul.acildi` kaydı;
    [../sunucu/bolumler/yonetici.md](../sunucu/bolumler/yonetici.md) — `overview`'daki `disk` ve `oneriMb`;
    [../sunucu/bolumler/okul.md](../sunucu/bolumler/okul.md) — `ozet`'te yalnız müdüre `disk`.
  - Üç yükleme yolunun okul sınırı kapısı: [../sunucu/bolumler/odev-dosya.md](../sunucu/bolumler/odev-dosya.md),
    [../sunucu/bolumler/ekler.md](../sunucu/bolumler/ekler.md), [../sunucu/bolumler/okul-sayfasi.md](../sunucu/bolumler/okul-sayfasi.md).
  - [../sunucu/api.md](../sunucu/api.md) — yönetici uçlarının yönetici olmayana 404 "Böyle bir adres yok" vermesi.
  - Şema ([../sunucu/veri/sema/SEMA.md](../sunucu/veri/sema/SEMA.md)): `035-okul-disk-siniri.sql` (`okullar.disk_siniri_mb`,
    eklerin okul indeksi), `033-odev-dosya-izni.sql` (`okul_dosya_uyarilari`).
- **Tablolar:** uçlar üzerinden `okullar`, `odev_dosyalari`, `ekler`, `okul_fotolari`, `okul_dosya_uyarilari`, `site_ayarlari`,
  `islem_kaydi`, `bildirimler`, `kullanicilar`; 8. bölümde `mutabakat` doğrudan bu tablolardan okur ve `okul_dosya_uyarilari`'ndan
  siler. Disk: `testler/testdata/` altındaki `dosyalar/`, `ekler/`, `okul-fotolari/`.
- **Ön yüz** (bu pakette tarayıcı yok): müdürün ana sayfasındaki disk kartı
  [../public/js/parcalar/08d-okul-disk.md](../public/js/parcalar/08d-okul-disk.md), yönetim panelinin okul disk ekranı
  [../public/js/yonetim/09d-okul-disk.md](../public/js/yonetim/09d-okul-disk.md) ve varsayılan sınır
  [../public/js/yonetim/09b-site-ayarlari.md](../public/js/yonetim/09b-site-ayarlari.md); dolunca görünen iletiler
  [../public/js/parcalar/04d-ekler.md](../public/js/parcalar/04d-ekler.md),
  [../public/js/parcalar/14b-odev-teslim.md](../public/js/parcalar/14b-odev-teslim.md),
  [../public/js/parcalar/19g-okul-sayfasi.md](../public/js/parcalar/19g-okul-sayfasi.md).
- **Onu çalıştıran:** `testler/tumtest.sh`, `test-odev-dosya`'dan sonra, `test-quiz`'den önce. `paket_ortami` bu pakete (hem
  sunucuya hem pakete) `EE_OKUL_DOSYA_GB=0.001` verir; tek paket böyle bir ek değişken alır. `testler/test-odev-dosya.js`'in başlık
  yorumu eklerin ve okul sayfası fotoğraflarının disk sayımı için bu pakete gönderir.

## Nasıl çalışır (adım adım)?

```
A, M, mat, o1 girer
1) site-ayarlari okulDiskMb: kaynak ortam|varsayilan ─► bozuk değerler 400 ─► 2048 kaydet ─► işlem kaydı ─► sifirla
2) diskmudur<z>: okul-ac bozuk diskMb 400 ─► mudurYap(Disk Okulu, 3072) ─► okul.acildi kaydı
   disksiz<z>: mudurYap(Varsayılan Okulu) ─► varsayılan ; öneri 2048 / null
3) müdür 404 ; okulId yok 404 ; bozuk mb 400 ; 3 GB → 2 GB ; '2048' zaten böyle ; null → varsayılan
4) seed okulu 50 MB ─► teslim 100000 + ek 50000 + foto ─► dağılım ─► /school/ozet ─► sil ─► düştü
5) seed okulu 1 MB ─► ek ile %80 (bir kez) ─► 507 + doldu (bir kez) ─► foto 507, teslim 507
6) 2 MB ─► %80 yeniden ─► 1 MB (kullanımın altı) ─► dosyalar duruyor, yeni ek 507
7) overview.disk: ayrılan / kullanılan / boş / veritabanı ; 10 TB ─► uyarı ; geri al ─► uyarı yok
8) testdata/ekler/<rastgele> (1234 B) ─► mutabakat() (test sürecinde) ─► sahipsiz 1 ─► dosyayı sil ─► havuzu kapat
```

## Dikkat!

- **Ortam değişkeni iki yere birden.** `tumtest.sh` `EE_OKUL_DOSYA_GB=0.001`'i hem sunucuya hem pakete verir. Yalnız birine
  verirsen 1. bölümün kaynağa bakan iki denetimi (ilki ve "Varsayılana dön") yanlış dalı bekler (`ORTAM_MB` paketten, kaynak
  sunucudan). Değişkensiz de çalışır: o zaman "varsayılan 5 GB" dalı denenir. 3 Ekim'de ikisi de koşuldu (sabah ve öğlen
  denetiminde), hepsi 46/0.
- **8. bölüm test veritabanına ve test klasörüne doğrudan dokunur.** `testler/testdata/ekler/` içine bir dosya yazıp siler;
  `mutabakat()` kullanımı %70'in altındaki okulların uyarı kayıtlarını siler. Koruma: veritabanı adı `_test` ile bitmiyorsa bu bölüm
  atlanır. Ad `testler/testdata/ayarlar.json`'dan (ya da `DATABASE_URL`'den) okunur; 3200'deki sunucu ile aynı veritabanı olmalı.
  Paket arada çökerse sahipsiz dosya klasörde kalır (bir sonraki sıfırlamada `testdata` zaten silinir).
- **`EE_DATA` sırası kırılgan.** `EE_DATA` 8. bölümde, `sunucu/ayarlar` ilk kez yüklenmeden hemen önce değiştirilir. Daha önce
  yüklenen tek sunucu modülü `mudurYap`'ın çektiği `sunucu/ortak.js`'tir ve o yalnız `crypto` ister; bu yüzden bugün çalışır.
  Başa ya da 2–7. bölümlere `sunucu/yollar.js`'i yükleyen bir modül girerse ayarlar gerçek `data/`'dan okunur, koruma devreye girer ve
  mutabakat denenmeden geçilir (zarar vermez, iki denetim eksik kalır).
- **Mutabakat denetimi temiz bir klasör ister.** "Sahipsiz tam 1 dosya" beklenir; sunucunun veri klasöründe başka kaydı silinmiş
  dosya varsa (ör. aynı `testdata` ile önce `test-odev-dosya` koşulduysa ve bir ödev silindiyse) sayı tutmaz. `tumtest.sh` her
  paketten önce `testdata`'yı siler.
- **Seed okuluna ve adına bağlı.** Yöneticiye giden bildirim metinleri "Test Ortaokulu: …" diye aranır; öneri denetimi seed'in iki
  öğrencisine (2048 MB) yaslanır.
- **Sınırları paket sonunda geri alınmaz; aynı veritabanında ikinci koşu çöker.** Seed okulu 1 MB özel sınırla kalır, "Disk
  Okulu" varsayılanda; ilk koşunun ekleri (~1,6 MB) ve fotoğrafı da kayıtlı durur. `tumtest.sh` her paketten önce veritabanını
  sıfırladığı için orada önemli değil. 3 Ekim öğlen denetiminde aynı sunucuda (değişkenle) hemen ikinci kez koşuldu: 1. bölümde
  "özel sınırı olmayan okul varsayılanı kullanıyor" ve "varsayılanı kullanan okulun sınırı hemen değişti (2 GB)" `KALDI` (seed
  okulu artık `ozel: true`, 1 MB); 4. bölüm geçer (sınır 50 MB yapılır); 5. bölümde "okulun sınırı 1 MB; kullanım %80 altında"
  `KALDI` (kullanım 1 698 070 bayt), ardından ilk ekin boyutu eksi çıkar, `crypto.randomBytes` `RangeError` atar ve paket
  `TEST HATASI` ile durur; `GECTI:` satırı basılmaz. Elle koşarken her seferinde sunucuyu sıfırlayıp yeniden aç.
- **Sistem geneli denetimlerinin kaçış yolları.** Diskin boş yeri okunamazsa (`bos: null`) iki uyarı denetimi kendiliğinden geçer;
  sınır geri alındıktan sonraki denetim de, okullara ayrılan toplam diskteki boş yerden büyükse uyarının kalktığına bakmadan geçer
  (dolu bir makinede yanlış alarm vermesin diye). Böyle bir makinede o iki denetim bir şey kanıtlamaz.
- **Zamana bağlı yerler.** "Doldu" bildirimi en çok 20 × 150 ms beklenir; son "bir kez" denetimi 300 ms bekler. Çok yavaş bir
  makinede bildirim geç yazılırsa denetim `KALDI` olabilir.
- **Fotoğrafın boyutu kayıttan okunur.** Sunucu fotoğrafı temizleyip yeniden yazdığı için sayıma yüklenen bayt değil kayıttaki boyut
  girer; denetim bunu bilerek kayda bakar.
- **Varsayılan adres 3000.** `EE_BASE` vermezsen istekler kendi sunucuna gider; seed hesapları orada yoksa ilk girişte durur. Her
  zaman test sunucusunu kullan.

## Testleri

- Bu dosyanın kendisi testtir; `testler/tumtest.sh` her tam koşuda (ortam değişkeniyle) çalıştırır. Aynı alanda:
  [test-odev-dosya.md](test-odev-dosya.md) (teslim yüklemesinde okul sınırı, %80 ve "doldu"), `testler/test-yedek.js` (okulun disk
  sınırının yedekte saklanıp geri gelmesi), [test-admin-gizli.md](test-admin-gizli.md) (yönetim kodunun herkese giden `app.js`'e
  girmemesi: yasaklı adres listesinde `okul-disk-siniri` de var; yönetici uçlarının oturumsuz isteğe bilinmeyen adres 404'ü),
  [girdi-denetimi.md](girdi-denetimi.md) (site ayarı `okulDiskMb`, `okul-disk-siniri` ve okul açarken `diskMb`'ye bozuk girdiler),
  [yetki-denetimi.md](yetki-denetimi.md) (`okul-disk-siniri` ve site ayarları yalnız yönetici).
- Elle (Git Bash, proje kökünde). Sunucuyu da paketi de aynı değişkenle çalıştır; sunucu 3200'de sıfırlanmış, [seed.md](seed.md)
  ile tohumlanmış ve bu paket o veritabanında daha önce koşmamış olmalı:

  ```
  EE_OKUL_DOSYA_GB=0.001 EE_BASE=http://localhost:3200 EE_LOG=testler/test-sunucu.log node testler/test-okul-disk.js
  ```

- 3 Ekim sabahı bu belge için 3200'de, sıfırlanmış `egitimevi_test` ve seed'le iki kez koşuldu: sunucu ve paket
  `EE_OKUL_DOSYA_GB=0.001` ile `GECTI: 46   KALDI: 0` (yaklaşık 7 saniye); ikisi de değişkensiz `GECTI: 46   KALDI: 0` (yaklaşık
  8 saniye). Her ikisinde de mutabakat satırı göründü, sunucu günlüğünde `API hatası` ya da `Veritabanı hatası` yoktu. Öğlen
  denetiminde iki kip yeniden koşuldu (ikisi de 46/0); değişkenli sunucuda hemen ardından yapılan ikinci koşu çöktü ("Dikkat!"e
  bak).

## Son durum

- `git log`: tek commit. Dosya `40fc7e7 commit 525` (2026-09-27, okul disk sınırı) ile 292 satır olarak eklendi; o günden beri
  değişmedi. Aynı commit koruduğu kodun hepsini getirdi: `sunucu/bolumler/okul-disk.js` ve `sunucu/veri/depo/okul-disk.js` (yeni),
  `035-okul-disk-siniri.sql`, `site.js`'teki `okulDiskMb`, `yonetici-okul.js`'teki `diskMb`, `yonetici.js`'teki `okul-disk-siniri` ve
  `overview`'daki `disk`, `odev-dosya.js` / `ekler.js` / `okul-sayfasi.js`'in ortak sayaca geçmesi; ön yüzde
  `08d-okul-disk.js` ve `yonetim/09d-okul-disk.js`. `tumtest.sh`'te `EE_OKUL_DOSYA_GB=0.001` o commit'te `test-odev-dosya`'dan
  alınıp bu pakete verildi ve paket listeye `test-odev-dosya`'nın arkasına eklendi.
- Açık iş yok; kod değiştirilmedi. Zayıf noktalar (sistem geneli kaçış yolları, zamana bağlı bekleyişler, aynı veritabanında
  ikinci koşunun çökmesi) "Dikkat!"te.
- Planlı işlerden bu dosyayı etkileyecekler:
  - **"Sunucuda küçültme … aynı dosya tek kopya"** (sıradaki iş 1) — sayım "son (küçültülmüş) boyut" olacak ve aynı içerik diskte
    tek kopya tutulacak; tanıma göre her okul başvurduğu dosyayı kendi boyutuyla sayar. 4. bölüm fotoğrafın boyutunu zaten kayıttan
    okur ve teslim/ek dosyaları rastgele baytlıdır, bu yüzden dağılım denetimleri büyük olasılıkla tutar (tanımdan çıkarım); asıl
    değişecek olan 8. bölümün mutabakatı: bugün her kaydın kendi dosyası var, tek kopyada bir dosyaya birden çok kayıt bağlanır.
  - **"Paneller … /duzenle okul sayfaları (disk + yedek sınırı alanları)"** — okulun disk sınırı yeni okul düzenleme sayfasına
    taşınacak; 3. bölümün kullandığı uç ya da cevabı değişebilir.
  - **"Sistem: yöneticiye ZORUNLU TOTP"** — paket yöneticiyle e-posta koduyla girer; doğrulama uygulaması zorunlu olunca giriş yolu
    değişir.
  - **"T.C. kimlik no bütün hesaplarda zorunlu"** (kod Linux'ta) — `hesapAc` ile açılan iki müdür adayı T.C.'siz kaydolur; tanıma
    göre kayıtta T.C. zorunlu olunca bu kayıtlar reddedilecek, `hesapAc` (ya da paketin çağrısı) T.C. göndermeli.
