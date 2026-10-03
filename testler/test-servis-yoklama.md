# testler/test-servis-yoklama.js

Servis yoklamasının bütününü uçtan uca deneyen en büyük sunuculu servis paketi (113 denetim): okulun servis saatleri, aralık dışı,
alma/bırakma sırası, sabah ve akşam yoklaması ile veliye giden bildirimler, servisçi notları, velinin "binmeyecek" işareti,
60 dakikalık uzatma ve aralık bitince seferin kapanması, aynı anda gelen işaretler, telefon uygulamasının cihaz anahtarı ve 30 günlük
uygulama oturumu.

## Bu dosya ne yapar?

Servisçi sabah öğrenciyi evden alırken her birine **Bindi / Binmedi**, okula varınca **Okula vardık** der; akşam okulda **Geldi /
Gelmedi**, sonra **Başlat**, evin önünde **İndi**. Veli çocuğunun bindiğini, okula vardığını, eve bırakıldığını bildirimle öğrenir;
"bu sabah binmeyecek" diye önceden haber verebilir; haritada "önünde 2 öğrenci" görür. Bütün bunlar okulun seçtiği saat aralıklarında
açıktır, aralık bitince yoldaki sefer 60 dakika daha sürebilir. Telefon uygulaması (yerel Android) girişten sonra oturumla bir kez
bir **cihaz anahtarı** alır; bildirimleri bu anahtarla yoklar, servisçinin telefonu sefer konumunu da bununla gönderir (anahtar hesaba
giriş vermez). Uygulamadan açılan oturum 30 gün, tarayıcıdaki 7 gün geçerlidir. Kurallar
[../sunucu/bolumler/okul-hayati.md](../sunucu/bolumler/okul-hayati.md), [../sunucu/bolumler/cihaz.md](../sunucu/bolumler/cihaz.md) ve
[../sunucu/yardimci/servis-pencere.md](../sunucu/yardimci/servis-pencere.md)'de.

Bu paket o işlerin hepsini gerçek bir test sunucusunda, gerçek saatle dener. Dosya başındaki yorum 12 madde sayar: okulun servis
saatlerini müdürün seçmesi (doğrulama, işlem kaydı), aralık dışında yoklama ve sefer açılmaması; sabah bindi/binmedi (ilk "bindi"
seferi başlatır), "Okula vardık"; akşam geldi/gelmedi, "Başlat", indi (hepsi inince sefer biter); veliye giden bildirimlerin bir kez
gitmesi, bindi → binmedi düzeltmesinin bir kez gitmesi, veli "binmeyecek" dediyse binmedi bildiriminin gitmemesi, bildirimin öğrenciye
gitmemesi; sıra ve "önünde N öğrenci", yeni öğrencinin sona eklenmesi; servisçi notu ve velinin "binmeyecek" işareti (7 gün, yoklama
alınınca kilit); yetkiler (başka servisçi, başka okul, velinin başka çocuğu; yönetim salt okunur); aralık bitince 60 dakikalık uzatma;
telefonun cihaz anahtarı; uygulama oturumu 30 gün, tarayıcı oturumu 7 gün, portal değişince sürenin uzamaması; aralık sonradan
değişirse seferin kapanması; aynı anda gelen ilk "Bindi"ler ve "Başlat"ların tek sefer açması; akşam serviste kalan son öğrenci
"Gelmedi"ye çevrilince seferin bitmesi.

Saat aralığına bağlı bölümler aralığı **o anki Türkiye saatine göre** kurar (ör. "şu an sabah aralığındayız" diye saatleri
kaydırır); kurulamıyorsa (gece yarısına çok yakın) o bölüm `ATLANDI` yazar. Uzatma ve oturum süresi bölümleri zamanı beklemez:
test veritabanında seferin, günün ve oturumun başlama anını geriye çeker (yalnız adı `_test` ile biten veritabanında).

Daha küçük kardeş paketler: [test-servis-konum.md](test-servis-konum.md) (servisçi atama, harita yetkisi, canlı konum, yaklaşma
bildirimi, Web Push) ve sunucusuz [test-servis-pencere.md](test-servis-pencere.md) (saat aralığı hesabı).

## İçinde neler var?

### Yardımcılar

- `BASE`, `iste`, `girisYap`, `hesapAc`, `okulHesabi`, `mudurYap`, `botCevabi`, `sonKod`, `kisilikGec` — [giris.md](giris.md)
  üzerinden ([../araclar/giris.md](../araclar/giris.md)). `path` — Node'un modülü.
- `kontrol(ad, sart, detay)`; `atla(ad)` — `  ATLANDI  <ad>` basar, sayıya girmez; `J(x)` — JSON'un ilk 260 karakteri.
- Türkiye saati: `trDk()` — şu anki Türkiye saatinin gün içindeki dakikası (0–1439); `trGun(n)` — bugünden n gün sonrasının Türkiye
  günü (`YYYY-AA-GG`); `hm(d)` — dakikayı `SS:DD`'ye çevirir; `SAAT_EKLI` (tanımlı, kullanılmıyor).
- Aralık kurucular (hepsi `[sabahBas, sabahBit, aksamBas, aksamBit]` dakika dizisi döner):
  - `sabahAraligi(m)` — şu an sabah aralığında: sabah `[m-30, m+20]` (günün ilk yarım saatinde 00:00'dan başlar, en az 30 dk), akşam
    sabahın bittiği dakikada başlar ve 60 dk sürer (gün sonunda kırpılır); sabah bitişi + 30 dk gün sonunu aşarsa `null`.
  - `aksamAraligi(m)` — şu an akşam aralığında: akşam yaklaşık `[m-30, m+20]` (en az 30 dk; günün başında 00:30'dan başlar, sonunda
    23:59'da kırpılır), sabah akşamın hemen önünde 30 dk; kurulamazsa `null`.
  - `disAraligi(m)` — şu an hiçbir aralıkta ve uzatmada değil: 04:00'ten sonra 01:00–01:30 / 02:00–02:30, öncesinde
    20:00–20:30 / 21:00–21:30.
- `cihaz(yol, yontem, govde, anahtar, bearer)` — `fetch` ile `/api/cihaz<yol>`; `anahtar` verilirse `X-Cihaz` başlığı, `bearer` verilirse
  oturum. `{ status, body }` döner.
- `bildirimler(token)` — `GET /api/notifications` → metinler (en yenisi başta; sunucu en yeni 100'ü verir); `say(liste, re)`.
- `uygulamaGirisi(kimlik, sifre, asama)` — telefon uygulaması gibi girer: gövdeye `uygulama: true` bayrağını giriş adımında
  (varsayılan ya da `'giris'`) ya da iki adımlı kodun doğrulama adımında (`'dogrula'`) koyar; kodu günlükten (`sonKod`) okur.
- `testDeposu()` — `EE_DATA`'yı `testler/testdata` yapar, `sunucu/ayarlar`'ı yükler, `sunucu/veri/baglanti`'yı alır; veritabanının adı
  `_test` ile bitmiyorsa ya da bir hata olursa `null`. Bitiyorsa `{ baglanti, oturumlar, okulHayati, servisYoklama }` depo modüllerini
  döner. 8., 8b ve 10. bölüm bunu kullanır.
- Ana gövdedeki kısa işlevler: `saatYaz(a)` (`POST /api/servis/saatler`, müdürle), `genis()` (saatleri 00:00–11:59 / 12:00–23:59'a geri
  açar; neredeyse her bölümün sonunda), `yoklama(tok, servisId?)` (`GET /api/servis/yoklama`), `isaret(tok, ogrenciId, durum, ek)`
  (`POST /api/servis/yoklama`, servis A için), `harita(tok, ogrenciId?)`, 3. bölümde `sira(...)`, 6. bölümde `not(b)`, 7. bölümde
  `bm(tok, b)`, 8. bölümde `konumB(anahtar, ek)` (`/api/cihaz/servis-konum`, B servisinin seferine), `geriCek(dk)`, 8b'de `isaretR`,
  `basR`, `seferId(r)`.

### Hesaplar ve veriler

`z = Date.now().toString(36)`. Seed'den ([seed.md](seed.md)): müdür (`M`), yönetici `admin@egitimevi.com` (`A`; yalnız ikinci okulu
açmak için), öğrenciler `ogrenci1` "Zeynep Şahin" (`me1`) ve `ogrenci2` "Burak Öztürk" (`me2`), öğretmen `mat`. Okul "Test Ortaokulu"
(adres kısa adı `test-ortaokulu`).

Paketin açtıkları:

| Kim | Ne |
|---|---|
| `V` (`yveli<z>`) | Zeynep'in velisi (rolsüz yetişkin hesabı, `parent/link` ile bağlanır) |
| `V2` (`yveli2<z>`) | Burak'ın velisi |
| `o3h` / `o3` | öğrenci "Can Yolcu" (okul açar) |
| `o4h` | öğrenci "Ece Durak" |
| `S1`, `S2` | servisçiler "Yoklama Sürücü", "İkinci Sürücü" (kullanıcı adı `yok1`/`yok2` + `Date.now() % 100000`) |
| `M2`, `S3` | ikinci okul "Yoklama Okulu <z>" ve onun servisçisi "Yabancı Sürücü" |
| servis A (`svA`) | "Yoklama A <z>", plaka "06 YK 01", servisçi `S1`; Zeynep, Burak, Can ("Durak") |
| servis B (`svB`) | "Yoklama B <z>", plaka "06 YK 02", servisçi `S2`; 3. bölümde Ece buraya taşınır |
| servis C (`svC`) | "Yoklama C <z>", ikinci okulda, servisçi `S3` |
| 8b | servisçi `S5` "Yarış Sürücü", servis R (`svR`), öğrenciler "Deniz Yarış", "Ada Yarış", "Mert Yarış", Deniz'in velisi `VR` |
| 9 | silinecek servisçi `S4` "Silinecek Sürücü" |

### 1) SERVİS SAATLERİ (5)

- Müdür `GET /api/servis` → `saatDuzenleyebilir: true` ve `saatler` seed'in 00:00–11:59 / 12:00–23:59'u.
- Altı bozuk `POST /api/servis/saatler`, hepsi 400: `'25:00'`, ters sabah, 20 dakikalık sabah, akşama taşan sabah (07:00–17:00,
  akşam 16:30), eksik `aksamBit`, alanlar nesne/dizi/`null`/`true`.
- `mat`, `o1`, `S1`, `V` ile kaydetmek → hepsi 403.
- `'7:00'`, `'9:20'` gibi tek haneli saatler `'07:00'` olarak kaydedilir (200); sabah bitişi akşam başına eşit (12:00) olabilir (200).
- `GET /api/islem-kaydi` cevabında `servis.saatler` geçiyor.

### 2) ARALIK DIŞI (4) — saatler `disAraligi`

- `S1`'in `GET /api/servis/yoklama`'sı: `donem: null`, `acik: false`, `engel` "… arasında açılır." içeriyor, `sonraki` dolu, üç öğrenci,
  `servis.id` A.
- Aralık dışında `POST /api/servis/yoklama` (bindi), `sefer-basla` → 409 `aralikDisi: true`; `okula-vardik` → 409.
- Velinin haritasında `sefer: null`, `bugun.canli: false`, `durum` ve `sira` `null`.
- Velinin `GET /api/servis`'inde çocuğun servis kartı yine geliyor (plaka "06 YK 01"), `bugun.canli: false`,
  `binmeyecekDuzenleyebilir: true`.

### 3) SIRA (5)

- `S1` sabah sırasını Can, Zeynep, Burak; akşam sırasını Burak, Zeynep, Can diye kaydeder (`POST /api/servis/sira`) → 200, 200.
- Eksik (2 öğrenci), fazla (servis dışı Ece ile 4), tekrarlı liste, bilinmeyen dönem `'gece'`, liste yerine `'x'` → hepsi 400.
- `S2`, `S3`, müdür, veli, öğrenci sırayı değiştiremez → hepsi 403.
- Müdürün `GET /api/servis`'inde: Can `siraSabah` 1, Zeynep 2, Burak 3; Burak `siraAksam` 1, Can 3.
- Ece A'ya yazılınca sabah ve akşam 4. sıraya eklenir; durağı değişince ("Yeni durak") sırası 4 kalır; B'ye taşınınca orada 1.

### 4) SABAH YOKLAMASI (23) — saatler `sabahAraligi`

- `V2` bugün sabah için Burak'a "binmeyecek" der (not "Hasta") → 200; `S1`'e tam olarak "Burak Öztürk bugün sabah servise
  binmeyecek. Velinin notu: Hasta." gider.
- `S1`'in yoklaması: `donem: 'sabah'`, `acik: true`, `duzenleyebilir: true`, öğrenciler sabah sırasıyla (Can, Zeynep, Burak), ilkinin
  `sira` 1. Burak'ta `binmeyecek: true` ve `veliIsareti.not` "Hasta"; `sayilar.binmeyecek` 1, `bekleyen` 2.
- Velinin haritası: Zeynep 2. sırada, önünde 1 öğrenci, `canli: true`, sefer yok. Burak'ın (binmeyecek) `onunde`'si `null`,
  `binmeyecekBugun: true`.
- Can'a ilk "Bindi" (`donem: 'sabah'` ile) seferi kendiliğinden başlatır: cevapta `sefer.yon: 'gidis'`, `yoklama.sefer` ve
  `yoklama.gun.basladi` dolu. Velinin haritasında Zeynep'in önünde 0, haritada sabah seferi var.
- Zeynep "Bindi" → `V`'ye bir bildirim, "Zeynep HH:MM'de servise bindi." (ek `'de/'da/'te/'ta`); öğrenciye bildirim yok; aynı işaret
  tekrarlanınca yeni bildirim yok; velinin haritasında `durum: 'bindi'`, `bindiSaat` `SS:DD`, `onunde: null`.
- Zeynep binmedi → bindi → binmedi: "Düzeltme: Zeynep bu sabah servise binmedi." tam bir kez; "servise bindi." yine tek; veliye toplam iki
  bildirim. Sonra Zeynep yeniden "Bindi".
- Burak "Binmedi" → 200 ama `V2`'ye bildirim gitmez (velisi "binmeyecek" demişti). `V2` artık o sabahın işaretini kaldıramaz → 409.
- `S2`, `S3`, müdür, veli, öğrenci işaretleyemez → hepsi 403.
- Sabahta `'geldi'` → 400; gövdede `donem: 'aksam'` → 409 `donemDegisti: true`; servisin öğrencisi olmayan Ece ve kimliği `'yok'` → 404;
  `durum` nesne → 400.
- `POST /api/servis/okula-vardik` → 200, `bildirilen: 1` (yalnız Zeynep'in velisi var), `yoklama.sefer: null`, `gun.bitti` dolu,
  `V`'ye "Zeynep HH:MM'de okula vardı." tam bir kez. İkinci basış bildirim göndermez.
- Okula varınca: Can'ı "Binmedi" yapmak → 409 `kapandi: true`; `sefer-basla` → 409. Velinin haritasında `durum: 'bindi'`, `vardiSaat`
  `SS:DD`, `seferBitti: true`.
- Müdür A'nın yoklamasını salt okunur görür (`duzenleyebilir: false`, `acik: false`, Zeynep `bindi`); ikinci okulun müdürü 404; `mat`,
  veli, öğrenci 403; `S2` A'nın yoklamasını açamaz → 404.

### 5) AKŞAM YOKLAMASI (16) — saatler `aksamAraligi`

- Yoklama `donem: 'aksam'`, akşam sırasıyla (Burak, Zeynep, Can).
- "Başlat"tan önce "İndi" → 409 `baslamadi: true`.
- Zeynep "Geldi", Burak "Gelmedi", Can "Geldi": `V`'ye "Zeynep HH:MM'de okuldan servise bindi.", `V2`'ye "Burak akşam servise gelmedi."
  (sabah için demişti, akşam için "binmeyecek" yok) — her biri tam bir kez.
- Burak "Geldi" sonra "Gelmedi": `V2`'ye "Burak HH:MM'de okuldan servise bindi." ve "Düzeltme: Burak akşam servise gelmedi." birer kez
  (toplam üç).
- "Geldi" olmayan Burak'a "İndi" → 409.
- Haritalar: Zeynep'in önünde 0 (Burak gelmedi), `durum: 'geldi'`; Can'ın önünde 1.
- Müdür Burak'ın ve Can'ın evini aynı noktaya koyar (39.95, 32.85). `S1` "Başlat" der (gövdede `yon: 'gidis'` olsa da) → `sefer.yon:
  'donus'`, `donem: 'aksam'`, `bekleyen: 0`, `serviste: 2`; ikinci "Başlat" aynı seferi döner.
- Evden 300 m'den konum (`POST /api/servis/konum`, doğruluk 10) → yaklaşma bildirimi yalnız servisteki ("Geldi") Can'a gider, gelmeyen
  Burak'a gitmez.
- Zeynep "İndi" → `V`'ye "Zeynep HH:MM'de eve bırakıldı.", `bitti: false`; haritada `durum: 'indi'`, `indiSaat`; Can'ın önünde 0.
  Eve bırakılan Zeynep'i "Gelmedi" yapmak → 409.
- Can "İndi" (serviste son öğrenci) → `bitti: true`, `yoklama.sefer: null`, `gun.bitti` dolu. Sonra Burak'ı "Geldi" yapmak → 409
  `kapandi: true`; akşam "Okula vardık" → 409.

### 6) NOTLAR (9)

- `S1` Zeynep'e yarın için not ("Yarın 07:35'te hazır ol") → 200, `not.tarih` yarın; `V`'ye tam olarak "Servisçiden not: Yarın 07:35'te
  hazır ol", öğrenciye bildirim yok.
- Bütün servise not ("Bugün 16:00'da erken alacağım") → `not.genel: true`; `V` ve `V2` birer bildirim daha alır.
- Boş metin, dün, 8 gün sonra, `'2026-13-45'`, metin nesne → 400; başka servisin öğrencisi (Ece) → 404.
- 260 harflik not 200 harfe kısaltılır.
- `S2`, `S3`, müdür, veli, öğrenci not yazamaz → hepsi 403.
- `V` çocuğunun ve servisin notlarını görür; `V2` servisin notunu görür ama Zeynep'inkini görmez. Öğrenci (`o1`) `benim.bugun.notlar`'da
  kendi notunu görür. `S1`'in yoklama ekranında 3 not.
- Notu `S2` silemez (404), yazan `S1` siler (200) → 2 not kalır.

### 7) BİNMEYECEK (6)

- `V` yarın sabah için Zeynep'e "binmeyecek" der (not "Dişçi") → 200, `binmeyecek.sabah: true`; `S1`'e tam olarak "Zeynep Şahin yarın
  sabah servise binmeyecek. Velinin notu: Dişçi." gider.
- `V` (Burak için), öğrenci, müdür, servisçi işaretleyemez → hepsi 403.
- 8 gün sonrası, dün ve `'dün'` metni → 400.
- `sabah: false, aksam: false` işareti kaldırır (`binmeyecek: null`); `S1`'e "… işareti kaldırıldı." gider.
- 2 gün sonrası için sabah + akşam: veli kartında görünür; öğrenci de görür (`binmeyecek` 1 kayıt) ama düzenleyemez.
- `S1`'in yoklama ekranındaki `binmeyecekler`'de Zeynep'in o günü var.

### 8) UZATMA VE ARALIK BİTİNCE (8)

Servis B (`S2`, Ece) kullanılır. Önce üç cihaz anahtarı alınır: `S2`'ninki (`cK1`), velininki (`cKV`), `S1`'inki (`cKS1`).
`d0` = Türkiye saatiyle öğleden önceyse `'sabah'`, sonraysa `'aksam'`.

- `S2` geniş saatlerde sefer başlatır; `cK1` ile `POST /api/cihaz/servis-konum` → 200; müdürün Ece haritasında `sefer.konum` dolu.
- `GET /api/cihaz/ayar` (`cK1`) → `rol: 'servisci'`, `servisci: true`, `acikSefer.id` bu sefer, `servisSaatleri.sabahBas` `'00:00'`.
- Aynı uca veli anahtarı 403, `S1`'in anahtarı 409 (sefer onun değil), `seferId: 'yok'` 404, `enlem: 'x'` 400.
- (Test veritabanına bağlanılabildiyse ve sabahın ilk 100 dakikası değilse) `geriCek(25)`: seferin ve günün başlama anı 25 dk geriye
  çekilir, saatler "aralık 10 dakika önce bitmiş" olacak biçimde yazılır → sefer sürüyor (harita, konum 200), `S2`'nin yoklaması
  `donem: d0`, `uzatma: true`, `acik: true`; uzatmada işaret 200, yeni `sefer-basla` 409 `aralikDisi`.
- `geriCek(60)` (toplam 85 dk) ve "aralık 70 dakika önce bitmiş" saatler → sefer kapanmış: haritada yok, `canli: false`, konum 409,
  işaret 409, `seferim`'de `sefer: null`; cihaz ayarında `acikSefer: null`.
- Saatler geniş açılır, `S2` yeni sefer başlatır, konum 200; saatler ileri alınır (yeni aralık 20 dk sonra başlar) → sefer hemen
  kapanır: harita sefer yok, konum 409, cihaz ayarında ve yoklamada sefer yok.

### 8b) AYNI ANDA GELEN İŞARETLER VE AKŞAM KENARLARI (9)

Ayrı servis R (`S5`) ve üç yeni öğrenci; Deniz'in velisi `VR`.

- Sabah aralığında üç ilk "Bindi" aynı anda (`Promise.all`) → üçü de 200, cevaplarda tek bir yeni sefer kimliği, yoklamadaki sefer o,
  `sayilar.bindi` 3. `VR`'ye "Deniz HH:MM'de servise bindi." tam bir kez; aynı işaret yeniden gönderilince yine tek.
- Saatler geçmişe kaydırılır (sabah aralığı 10 dk önce bitmiş, sefer onun dışında başlamış) → uzatma YOK: haritada sefer yok,
  `canli: false`, Ada'ya işaret 409, yoklama `acik: false`, `sefer: null`. Sonra sabah aralığı geri yazılır.
- Sefer bitirilir; "Seferi başlat"a aynı anda iki kez basılır → ikisi de 200 ve aynı sefer.
- (Test veritabanı varsa) günün "başladı" anı 90 dk geriye çekilir (aralığın dışına düşer); yeniden başlatmada an tazelenir (önce 80 dk'dan
  eski, sonra 5 dk'dan yeni).
- Akşam aralığında, "Geldi" işaretli kimse yokken "Başlat" → 200, `serviste: 0`, mesajda `"Geldi"` uyarısı (sefer kendiliğinden bitmez).
  Sefer bitirilir.
- Deniz ve Ada "Geldi", Mert "Gelmedi" → "Başlat": `serviste: 2`; Deniz "İndi" → `bitti: false`, sefer sürüyor; serviste kalan son
  öğrenci Ada "Gelmedi"ye çevrilince `bitti: true`, `gun.bitti` dolu, sefer yok, `acik: false`.

### 9) CİHAZ ANAHTARI (21)

- `V` oturumla `POST /api/cihaz { ad: 'Pixel 8', platform: 'android', surum: '2.0.0' }` → 200, 64 haneli onaltılık anahtar ve
  `cihazId`. Oturumsuz → 401.
- Anahtar hesaba giriş vermez: `/api/me` hem `Authorization: Bearer <anahtar>` hem `X-Cihaz: <anahtar>` ile 401.
- `GET /api/cihaz/bildirimler` başlıksız (yalnız oturumla), bilinmeyen 64 haneli anahtarla ve `' OR 1=1 --` ile → üçü de 401.
- İlk yoklama (imleçsiz): eski bildirimler gelmez (boş liste), imleç `<ISO zaman>Z|<kimlik>` biçiminde, `servisSaatleri.aksamBit`
  `'23:59'`.
- `S1` Zeynep'e not yazar → imleçle sorulunca tek bildirim: metin "Servisçiden not: Cihaz denemesi <z>", bağlantı `/?k=<veliId>#/servis?c=<Zeynep>`
  ile biter, `zaman` ve `id` dolu. Aynı imleçle tekrar: boş liste, imleç aynı.
- Bir not daha, ardından veli bildirimlerini okundu yapar (`POST /api/notifications/read`) → okunmuş bildirim telefona gelmez, imleç
  ilerler.
- 25 not art arda → telefona en çok 20 gelir, eskiden yeniye: ilki "Toplu 5", sonuncusu "Toplu 24"; bir sonraki yoklama boş ("yağmur
  yok"). Bozuk imleç (`son=abc`) ilk yoklama gibi davranır.
- Öğretmenin (`mat`) anahtarı: müdürden gelen mesajın bildirimi `/school/test-ortaokulu/?k=<mat rol satırı>#/` bağlantısıyla gelir;
  servisle ilgisi olmadığı için `servisSaatleri: null`.
- `GET /api/cihaz` hesabın telefonlarını listeler ("Pixel 8" var), cevapta anahtarın kendisi geçmez.
- `POST /api/cihaz/sil` oturumla: hangi telefon belli değilse 400, başkasının telefonu 404; `cihazAnahtari` ile kaldırınca o anahtar 401.
  Anahtarın kendisiyle (`X-Cihaz`) `POST /api/cihaz/sil` → 200, sonra 401 (uygulamadan çıkış).
- `V2` 6 anahtar alır → ilki 401, altıncısı 200 (hesap başına 5).
- Öğrencinin anahtarı: `rol: 'student'`, `servisci: false`, `acikSefer: null`, `servisSaatleri` dolu (serviste olduğu için).
- Uygulama anahtarı eski Aile uçlarında geçmez: `GET /api/aile/cihaz/ayar` + `X-Aile-Cihaz` → 401.
- `V2` şifresini değiştirir (`POST /api/password`) → telefon anahtarı 401 (denenen, en son alınan anahtar; sunucu hesabın bütün
  anahtarlarını siler).
- Servisçi `S4` anahtar alır, müdür hesabı siler (`POST /api/school/hesap-sil`) → anahtar 401.
- `cK1` ile 70 eşzamanlı konum → en az 5 tanesi 429 (anahtar başına dakikada 60).

### 10) UYGULAMA OTURUMU — 30 GÜN (7)

Test veritabanına bağlanılamadıysa bütün bölüm `ATLANDI`.

- `ogrenci2` tarayıcıdan (`girisYap`) ve uygulamadan girer; müdür uygulamadan iki kez girer: bayrak giriş adımında ve doğrulama
  adımında. Dördünün açılış anı 8 gün geriye çekilir → tarayıcı oturumu 401, üç uygulama oturumu 200.
- `V` uygulamadan girip portal değiştirir (`kisilikGec(…, 'hesap')`); yeni oturum 8 gün geriye çekilince de 200 (uygulama oturumu
  olarak kalır).
- 29 günlük uygulama oturumundan portal değiştirilir: yeni oturum hemen 200, 1 gün daha geriye çekilince 401; eski oturum da 401 (portal
  değişince kapanır). Süre portal değiştirerek uzamaz.
- 6 günlük tarayıcı oturumundan portal değiştirilir: yeni oturum 1 gün sonra 401 (7 gün).
- `ogrenci2`'nin uygulama oturumu 23 gün daha (toplam 31) → 401.
- Çıkış (`POST /api/logout`) uygulama oturumunu kapatır.
- `V2` hem tarayıcıdan hem uygulamadan girer, tarayıcıdan şifre değiştirir → uygulama oturumu 401, şifreyi değiştiren tarayıcı oturumu
  200.
- Sonda veritabanı bağlantı havuzu kapatılır.

Toplam 5 + 4 + 5 + 23 + 16 + 9 + 6 + 8 + 9 + 21 + 7 = 113 (hiçbir bölüm atlanmazsa). Sonunda boş satır ve
`  GECTI: 113   KALDI: 0`; `KALDI` varsa çıkış kodu 1. Beklenmeyen hata `  TEST HATASI: <yığın>` ile, çıkış kodu 1.

## Kimle konuşur?

- **Modüller:** [giris.md](giris.md); 8., 8b ve 10. bölümde test sürecinin içinden [../sunucu/ayarlar.md](../sunucu/ayarlar.md)
  (`ayarlariYukle`), [../sunucu/veri/baglanti.md](../sunucu/veri/baglanti.md) (`veritabaniAdi`, `kapat`) ve depolar:
  [../sunucu/veri/depo/oturumlar.md](../sunucu/veri/depo/oturumlar.md) (`geriTarihle`),
  [../sunucu/veri/depo/okul-hayati.md](../sunucu/veri/depo/okul-hayati.md) (`seferiGeriTarihle`),
  [../sunucu/veri/depo/servis-yoklama.md](../sunucu/veri/depo/servis-yoklama.md) (`gunuGeriTarihle`). Node'un `path`'i ve genel `fetch`'i.
- **Sunucu uçları:**

  | Uç | Ne için | Belge |
  |---|---|---|
  | `GET /api/servis`, `POST /api/servis/saatler`, `GET`/`POST /api/servis/yoklama`, `/sefer-basla`, `/okula-vardik`, `/sira`, `/not`, `/not-sil`, `/binmeyecek`, `GET /api/servis/harita`, `/seferim`, `POST /api/servis/ev`, `/konum`, `/sefer-bitir`, `/kaydet`, `/ogrenci` | servis yoklaması ve sefer | [../sunucu/bolumler/okul-hayati.md](../sunucu/bolumler/okul-hayati.md) |
  | `POST`/`GET /api/cihaz`, `POST /api/cihaz/sil`, `GET /api/cihaz/bildirimler`, `/ayar`, `POST /api/cihaz/servis-konum` | telefon uygulamasının cihaz anahtarı | [../sunucu/bolumler/cihaz.md](../sunucu/bolumler/cihaz.md) |
  | `GET /api/aile/cihaz/ayar` | eski Aile uygulamasının ucu (geçmemeli) | [../sunucu/bolumler/aile.md](../sunucu/bolumler/aile.md) |
  | `POST /api/login` (`uygulama`), `/api/login/dogrula` (`uygulama`), `/api/logout`, `/api/password`, `/api/me`, `GET /api/notifications`, `POST /api/notifications/read`, `/api/register` | oturum, şifre, bildirim | [../sunucu/bolumler/kayit.md](../sunucu/bolumler/kayit.md) |
  | `POST /api/kisilik/gec` | portal değiştirme (oturum türü ve açılış anı devralınır) | [../sunucu/bolumler/kisilik.md](../sunucu/bolumler/kisilik.md) |
  | `POST /api/school/hesap-ac`, `/hesap-sil` | öğrenci ve servisçi açma, servisçi silme | [../sunucu/bolumler/hesaplar.md](../sunucu/bolumler/hesaplar.md) |
  | `POST /api/parent/link` | veliyi çocuğa bağlama | [../sunucu/bolumler/veli.md](../sunucu/bolumler/veli.md) |
  | `POST /api/mesajlar` | öğretmene bildirim düşürmek için mesaj | [../sunucu/bolumler/mesaj.md](../sunucu/bolumler/mesaj.md) |
  | `GET /api/islem-kaydi` | `servis.saatler` kaydı | [../sunucu/bolumler/islem-kaydi.md](../sunucu/bolumler/islem-kaydi.md) |
  | `POST /api/admin/okul-ac` (`mudurYap` içinde) | ikinci okul | [../sunucu/bolumler/yonetici-okul.md](../sunucu/bolumler/yonetici-okul.md) |

- **Koruduğu kod:**
  - [../sunucu/bolumler/okul-hayati.md](../sunucu/bolumler/okul-hayati.md) — servis uçlarının hemen hepsi: `isaretDonemi`,
    `yoklamaEngeli`, `araliktaBasladi`, `yoklamaBildir` (tekillik, düzeltme, "binmeyecek" dediyse bildirim yok, öğrenciye yok),
    `seferAc` (aynı anda tek sefer), `okula-vardik`, akşamın kendiliğinden bitişi (son "İndi" ya da son "Gelmedi"), `sira`, `not`,
    `binmeyecek` (7 gün, yoklama alınınca kilit), `ogrenciBugunu` (`onunde`, `vardiSaat`, `seferBitti`), `yoklamaCevabi`
    (yönetim salt okunur), `servisTemizle` (saatler değişince çalışır), `seferKonumuYaz`, `yaklasmaAdaylari` (akşam yalnız "Geldi").
  - [../sunucu/yardimci/servis-pencere.md](../sunucu/yardimci/servis-pencere.md) — gerçek saatle `servisPenceresi`, `seferSuruyorMu`,
    `aralikIcindeMi`, `saatEki`, `ilkAd`.
  - [../sunucu/veri/depo/servis-yoklama.md](../sunucu/veri/depo/servis-yoklama.md) — `olayIlkMi`, `gunBasladi` (yenile), `gunBitti`
    (ilk kez mi), `binmeyecekYaz`; [../sunucu/veri/depo/okul-hayati.md](../sunucu/veri/depo/okul-hayati.md) — `seferAcYaDaBul` (satır
    kilidi), `siraYaz`, `servisOgrenciYaz` (sona ekleme).
  - [../sunucu/bolumler/cihaz.md](../sunucu/bolumler/cihaz.md) — anahtar biçimi ve özeti, `EN_FAZLA_BILDIRIM` 20, imleç, okunmuşları
    atlama, `servisSaatleri` (zarf ya da `null`), hız sınırı, `sil`; [../sunucu/veri/depo/cihazlar.md](../sunucu/veri/depo/cihazlar.md) —
    hesap başına 5, `alicilar` (okul rolü satırları), `bildirimleri`; [../sunucu/push.md](../sunucu/push.md) — `bildirimAdresi`
    (`/school/<kısa ad>/?k=…#/…`); [../sunucu/api.md](../sunucu/api.md) — `/api/cihaz/*`'ın oturum kapılarından önce yönlendirilmesi.
  - [../sunucu/veri/depo/oturumlar.md](../sunucu/veri/depo/oturumlar.md) — 7 / 30 gün, `oturumBilgisi`, şifre değişince öteki oturumların
    ve cihaz anahtarlarının silinmesi; [../sunucu/bolumler/kisilik.md](../sunucu/bolumler/kisilik.md) — portal değişiminde eski oturumun
    kapanması ve açılış anının devralınması; [../sunucu/bolumler/kayit.md](../sunucu/bolumler/kayit.md) — `uygulama` bayrağının iki
    adımda da okunması.
  - Şema ([../sunucu/veri/sema/SEMA.md](../sunucu/veri/sema/SEMA.md)): `028-servis-yoklama.sql` — okulların servis saatleri,
    `servis_ogrencileri.sira_sabah`/`sira_aksam`, `servis_yoklamalari`, `servis_gunleri`, `servis_olaylari`, `servis_notlari`,
    `servis_binmeyecek`, `cihaz_anahtarlari`, `oturumlar.uygulama`.
- **Ön yüz** (bu pakette tarayıcı yok): servisçinin yoklama ekranı
  [../public/js/parcalar/19i-servis-yoklama.md](../public/js/parcalar/19i-servis-yoklama.md); servis sayfası, saatler kartı ve
  "binmeyecek" [../public/js/parcalar/19c-okul-hayati.md](../public/js/parcalar/19c-okul-hayati.md); harita
  [../public/js/parcalar/19e-servis-konum.md](../public/js/parcalar/19e-servis-konum.md). Telefon uygulaması ayrı depoda.
- **Onu çalıştıran:** `testler/tumtest.sh` — sunuculu döngüde `test-servis-konum`'dan sonra, `test-yetiskin`'den önce.

## Nasıl çalışır (adım adım)?

```
hesaplar: M, A, o1, o2, mat ; V→Zeynep, V2→Burak ; Can, Ece ; S1 (A), S2 (B), M2 + S3 (C)
1) saatler: görme, bozuk 400, yetkisiz 403, '7:00' → 07:00, işlem kaydı ─► genis()
2) disAraligi ─► yoklama kapalı, işaret/sefer/vardık 409, harita canlı değil ─► genis()
3) sıra kaydet ; bozuk 400 ; yetkisiz 403 ; Ece sona, taşınınca B'de 1.
4) sabahAraligi ─► V2 "binmeyecek" ─► yoklama ─► Can bindi (sefer açılır) ─► Zeynep bindi/düzeltme
   ─► Burak binmedi (bildirim yok) ─► kilit ─► yetkisiz/bozuk ─► okula vardık ─► kapalı ─► yönetim salt okunur ─► genis()
5) aksamAraligi ─► İndi erken 409 ─► geldi/gelmedi/düzeltme ─► Başlat (dönüş) ─► 300 m yaklaşma
   ─► Zeynep indi ─► Can indi (sefer biter) ─► kapalı ─► genis()
6) not (kişiye / herkese) ; bozuk ; yetkisiz ; görünürlük ; sil
7) binmeyecek: yarın ; yetkisiz ; tarih ; kaldır ; 2 gün sonra ; servisçi listesi
8) cihaz anahtarları ─► B seferi + telefon konumu ─► [testDeposu] geriCek(25) uzatma açık ─► geriCek(60) kapandı
   ─► saatler ileri ─► sefer kapandı ─► genis()
8b) R: üç Bindi aynı anda ─► tek sefer ; geçmiş aralık ─► uzatma yok ; iki Başlat ─► tek sefer ; "başladı" tazelenir
    akşam: boş Başlat uyarısı ; Geldi/Gelmedi ─► İndi ─► son Gelmedi ─► sefer biter
9) /api/cihaz: anahtar, 401'ler, imleç, 20 sınırı, okunmuşlar, okul rolü bağlantısı, liste, sil, 5 sınırı, öğrenci, Aile, şifre, silme, 429
10) [testDeposu] oturumlar: 8 gün, portal değişimi, 29+1, 6+1, 31, çıkış, şifre ─► havuzu kapat
GECTI: n   KALDI: m
```

## Dikkat!

- **Saate bağlı atlamalar.** Hangi bölümün koşacağı Türkiye saatine bağlı. Paketin kendi aralık kurucuları günün 1440 dakikasında tek
  tek çalıştırılarak hesaplandı: sabah yoklaması ve 8b'nin sabah kısmı 23:10–23:59; akşam yoklaması ve 8b'nin akşam kısmı 00:00–00:30
  ile 23:55–23:59; "saatler ileri alınınca" 23:00–23:59; 8b'deki "geçmiş aralık" 00:00–00:39 ile 23:00–23:09 (23:10'dan sonra 8b'nin
  bütün sabah kısmı zaten atlanır); uzatma 00:00–01:39 arasında `ATLANDI` olur. Kurulabildiği her dakikada aralıklar sunucunun
  `saatlerSorunu` doğrulamasından geçiyor ve "şu an" gerçekten beklenen dönemde kalıyor. Atlanan denetim sayılmaz,
  `KALDI` da sayılmaz: gece koşulan bir `tumtest` bu paketi daha az denetimle "geçti" gösterir. Atlanan satırlar `  ATLANDI  ` diye
  basılır; `tumtest.sh` yalnız `KALDI` ve `HATASI` satırlarını gösterdiği için bunlar orada görünmez.
- **Gün değişimi.** Paket `trGun(0)`'ı ve aralıkları bölüm başında hesaplar; koşu tam gece yarısını geçerse tarihler kayar. Koşu
  8–11 saniye sürdüğü için pratikte nadir.
- **Aynı veritabanında ikinci koşu kalır.** Yoklama işaretleri ve bildirim tekilliği servise değil `(tarih, dönem, öğrenci)`'ye bağlı
  (`servis_yoklamalari`, `servis_olaylari`). Seed öğrencileri Zeynep ve Burak'ın o güne ait işaretleri ve "bildirildi" kayıtları ilk
  koşudan kaldığı için ikinci koşuda velilere bildirim gitmez, sıra/önünde hesapları da değişir. 3 Ekim'de iki ayrı sunucuda hemen
  ikinci kez koşuldu, ikisinde de `GECTI: 98   KALDI: 15`. Kalan 15'in 9'u 4. bölümden (servisçiye "binmeyecek" haberi, velinin
  işaretinin sayılarda görünmesi, iki "önünde" denetimi, "bindi", aynı işaret, düzeltme, "okula vardı" ve ikinci "Okula vardık"
  bildirimleri), 6'sı 5. bölümden ("okuldan servise bindi", "akşam servise gelmedi" ve düzeltme bildirimleri, "önünde", akşam
  "Başlat"ın `serviste` sayısı — 2 yerine 1 —, "eve bırakıldı" bildirimi). `tumtest.sh` her paketten önce veritabanını sıfırladığı
  için orada sorun yok; elle koşarken sunucuyu sıfırla.
- **Test veritabanına doğrudan dokunur.** `testDeposu` süreç içinde `testler/testdata/ayarlar.json`'daki veritabanına bağlanır ve
  oturumların, seferin ve günün başlama anını geriye yazar. Koruma: ad `_test` ile bitmiyorsa bağlanmaz, ilgili bölümler atlanır.
  Bağlantının 3200'deki sunucuyla aynı veritabanı olması gerekir (ikisi de `testler/testdata`'dan okur). `testler/testdata` yoksa
  `ayarlariYukle` oraya varsayılan bir `ayarlar.json` yazar (veritabanı ayarı olmadığı için bağlantı kurulmaz, bölümler atlanır).
- **`EE_DATA` sırası kırılgan.** `EE_DATA`, `sunucu/ayarlar` ilk kez yüklenmeden hemen önce (8. bölümde) değiştirilir; o ana kadar
  yüklenen tek sunucu modülü `mudurYap`'ın çektiği `sunucu/ortak.js`'tir (yalnız `crypto` ister). Başa `sunucu/yollar.js`'i yükleyen
  bir modül eklenirse ayarlar gerçek veri klasöründen okunur; ad `_test` ile bitmeyeceği için koruma devreye girer, bölümler atlanır
  (zarar vermez, denetimler eksik kalır). [test-okul-disk.md](test-okul-disk.md)'de aynı düzen var.
- **Telefona en çok 20 bildirim: eskiler hiç gelmez.** 9. bölüm bunu "yağmur yok" diye dener: 25 yeni bildirimden telefona en yeni
  20'si gelir, imleç en yeniye atlar, ilk 5'i telefona HİÇ gelmez (sitedeki bildirim kutusunda durur). Bilinçli bir tasarım; ama
  uygulama uzun süre kapalı kalırsa servisle ilgili eski bildirimlerin kaybolacağını bil.
- **Bildirim sayımı en yeni 100 kayda dayanır.** `GET /api/notifications` en yeni 100 bildirimi verir; bu pakette kişi başına bundan çok
  az bildirim olduğu için sayılar doğru çıkar. Yeni denetimler eklerken (özellikle 9. bölümdeki toplu notlar) bu sınırı aşma.
- **Servisçinin not hız sınırı.** `S1` bu pakette 36 not isteği atar (hatalılar da sayılır); sınır servisçi başına saatte 60. Not
  ekleyen yeni denetimler bu sınıra yaklaşır.
- **`'7:00'` kabulü sunucudan.** 1. bölüm tek haneli saatin kaydedildiğini dener; sunucu önce `saatDuzelt` ile düzeltir. Saf işlev
  (`saatlerSorunu`) `'7:00'`'ı reddeder ([test-servis-pencere.md](test-servis-pencere.md)); ikisi çelişmez.
- **Sabah bitişi = akşam başı.** `sabahAraligi` akşamı sabahın bittiği dakikada başlatır; o tek dakikada iki aralık üst üste biner ve
  sunucu sabahı seçer. Bölümler bir dakikadan kısa sürdüğü için sorun çıkmıyor, ama çok yavaş bir makinede 4. bölüm aralığın sonuna
  denk gelirse dönem beklenmedik biçimde değişebilir (20 dakika pay var).
- **Yön gövdeden alınmaz.** 5. bölüm `sefer-basla`'ya bilerek `yon: 'gidis'` gönderir; sunucu yönü dönemden (akşam → dönüş) belirler.
  Gövdedeki `yon` yok sayılır.
- **Hata kodları uçtan uca farklı:** aynı "sefer bulunamadı" durumu tarayıcı ucunda (`/api/servis/konum`) 409, telefon ucunda
  (`/api/cihaz/servis-konum`) 404 döner; 8. bölüm 404'ü bekler. Bilerek (tarayıcı sayfası 409'da göndermeyi durdurur).
- **`SAAT_EKLI` kullanılmıyor.** Dosyanın başında tanımlı düzenli ifade hiçbir denetimde geçmiyor (denetimler aynı kalıbı satır içinde
  yazıyor). Zararsız artık; kod değiştirilmedi.
- **Varsayılan adres 3000.** `EE_BASE` vermezsen istekler kendi sunucuna gider; `testDeposu` ise yine `testler/testdata`'ya bakar. İkisi
  ayrı veritabanlarına gider ve denetimler anlamsızlaşır. Her zaman test sunucusunu kullan.

## Testleri

- Bu dosyanın kendisi testtir; `testler/tumtest.sh` her tam koşuda çalıştırır.
- Elle (Git Bash, proje kökünde): sunucu 3200'de sıfırlanmış `egitimevi_test`, `EE_DATA=testler/testdata`, `EE_PUSH_GONDERME=0` ve
  [seed.md](seed.md) ile açık olmalı (`tumtest.sh` ya da yerel, git dışındaki `.claude/gelistirme/betikler/test-sunucu-ac.sh` böyle açar); sonra
  `EE_BASE=http://localhost:3200 EE_LOG=testler/test-sunucu.log node testler/test-servis-yoklama.js`.
- 3 Ekim'de bu belge için 3200'de, sıfırlanmış ve tohumlanmış `egitimevi_test` üzerinde 13:22'de koşuldu: `GECTI: 113   KALDI: 0`,
  hiçbir bölüm atlanmadı, çıkış 0, yaklaşık 8 saniye; sunucu günlüğünde `API hatası` ya da `Veritabanı hatası` yoktu. Hemen ardından aynı
  sunucuda ikinci koşu 98/15 ("Dikkat!"e bak). Belge denetlenirken (13:57) yeni bir test sunucusunda yeniden: 113/0, hiçbir bölüm
  atlanmadı, 10,8 saniye; ikinci koşu yine 98/15; günlükte hata yok.
- Aynı alanda: [test-servis-konum.md](test-servis-konum.md), [test-servis-pencere.md](test-servis-pencere.md),
  [test-okul-hayati.md](test-okul-hayati.md), [test-ozellikler.md](test-ozellikler.md) (servis kapalıyken yoklama, sıra, not ve telefon
  konumunun reddi), [test-aile.md](test-aile.md) (eski Aile uygulamasının cihaz anahtarı), `testler/test-yedek.js` (servis ve cihaz
  tablolarının yedekte), [yetki-denetimi.md](yetki-denetimi.md) ve [girdi-denetimi.md](girdi-denetimi.md) (servis ve cihaz uçları).

## Son durum

- `git log`: tek commit. Dosya `24050a2 commit 518` (2026-09-27, servis yoklaması + `/api/cihaz` + 30 günlük uygulama oturumu) ile
  718 satır olarak eklendi; o günden beri değişmedi. Aynı commit koruduğu kodun hepsini getirdi: `028-servis-yoklama.sql`,
  `sunucu/yardimci/servis-pencere.js`, `sunucu/veri/depo/servis-yoklama.js` ve `cihazlar.js` (yeni), `sunucu/bolumler/cihaz.js` (yeni),
  `okul-hayati.js`'e saatler/yoklama/okula vardık/sıra/not/binmeyecek, `oturumlar.js`'e 30 günlük uygulama oturumu, `kisilik.js`'e
  açılış anının devralınması; ön yüzde `19i-servis-yoklama.js` (yeni) ve `19c-okul-hayati.js`. Paket `tumtest.sh`'e `test-servis-konum`'un
  arkasına eklendi; [seed.md](seed.md) test okulunun saatlerini 00:00–11:59 / 12:00–23:59 yaptı.
- Açık iş yok; kod değiştirilmedi. Zayıf noktalar (saate bağlı atlamalar, ikinci koşu, 20 bildirim sınırının eskileri düşürmesi)
  "Dikkat!"te.
- Planlı işlerden bu dosyayı etkileyecekler:
  - **"Android yerel uygulama"** — uygulama bu paketin denediği cihaz anahtarını, `uygulama: true` bayrağını ve servis uçlarını
    kullanıyor; uygulamanın kendini güncellemesi, sol menü gibi eklerde uç değişirse 9. ve 10. bölüm güncellenmeli.
  - **"T.C. kimlik no bütün hesaplarda zorunlu"** (kod Linux'ta) — `hesapAc` ile açılan üç veli ve müdür adayı bugün T.C.'siz kaydolur;
    kayıtta T.C. zorunlu olunca paketin (ya da `araclar/giris.js`'in) T.C. göndermesi gerekir. Öğrenci ve servisçiler `okulHesabi` ile
    zaten T.C.'li açılıyor.
  - **"Tek kişi tek hesap + portallar"** — tanımda "servisçi de portal". Servisçi hesabı yetişkin hesabının altında bir rol satırı olursa
    cihaz anahtarının sahibi (bugün servisçi hesabının kendisi) ve `hesap-sil` denetimi değişir.
  - **"Sistem: yöneticiye ZORUNLU TOTP … yeni cihaz uyarısı + açık oturumlar"** — yönetici girişi (ikinci okulu açmak için) ve oturum
    listesi bu paketin 10. bölümüne dokunabilir.
  - **"Optimizasyon + saklama süreleri"** — servis kayıtları bugün 30 gün tutuluyor; saklama işi bunu değiştirirse yeni bir denetim
    eklenmeli (bu paket saklamayı denemiyor).
