# testler/girdi-denetimi.js

Sunucuya 24 bozuk ve kötü niyetli değeri (`KOTU`) 25 alan grubunda tek tek gönderip, ayrıca yol kaçışı, sahte oturum ve
uygulama anahtarı, uydurma öğrenci kimliği, başka okulun verisi, yönetici ayarları ve 3 MB'lık gövdeyle sunucunun **500
vermediğini**, sızdırmadığını ve ayakta kaldığını denetleyen sunuculu denetim.

## Bu dosya ne yapar?

Eğitim Evi'nde girdi doğrulaması bir çerçeveyle değil, her uçta elle yazılır: `clean(body.ad, 80)`, `Array.isArray(...)`,
`parseInt(...)`. Bir alana beklenmedik türde bir değer gelirse (metin yerine dizi, sayı yerine nesne, 50 000 karakter, NUL
karakteri) yazılmış bir `.trim()` ya da `.map()` patlayabilir ve istek 500 "Sunucu hatası" ile döner. 500 kötü bir şeydir: kişi
neyi yanlış yaptığını öğrenemez, ve çoğu zaman bir doğrulamanın atlandığını gösterir.

Bu dosya kötü niyetli birinin yapacağını yapar: her alana sırayla `KOTU` listesindeki bütün değerleri gönderir. Tek kural:
**500 asla dönmemeli** (400, 403, 404, 409, 413, 429 olabilir). Üstüne birkaç özel soruya da bakar: statik dosyalardan proje
kodu sızıyor mu, uydurma bir öğrenci kimliği ödeve giriyor mu, sahte bir oturum anahtarı ya da telefon anahtarı çalışıyor mu,
bir okulun müdürü başka okulun öğrencisini görüp düzenleyebiliyor mu, yöneticinin ayar uçları bozuk değeri kaydediyor mu, 3 MB
gövde reddediliyor mu, ve bütün bunlardan sonra sunucu hâlâ cevap veriyor mu.

`testler/tumtest.sh` onu denetimler döngüsünde, [yetki-denetimi.md](yetki-denetimi.md)'nden sonra çalıştırır: sunucu yeniden
açılır (`_test` veritabanı sıfırlanır), [seed.md](seed.md) çalışır, sonra bu dosya. Çıktısında `KALDI  ` varsa ya da denetim
sırasında sunucu günlüğüne `API hatası` / `Veritabanı hatası` düştüyse `DENETIM SORUNU` sayılır. Günlük denetimi önemlidir:
[../sunucu/index.md](../sunucu/index.md) `API hatası`'nı yakalanmamış bir hatayla 500'e düşen her API isteğine,
`Veritabanı hatası`'nı 5xx'e çevrilen her veritabanı hatasına (ör. bağlantı kopunca 503) yazar. Böylece bu dosyanın durum
koduna hiç bakmadığı isteklerdeki (hazırlık adımları, quizin başlatılması, 4. bölümün ödev ayrıntısı gibi) 500'ler ve 503'ler
de yakalanır. 400, 404, 429 gibi beklenen retler günlüğe yazılmaz. İki istisna: bir bölümün kendisinin `bad(res, …, 500)` diye
döndüğü birkaç yer (yedek alma, ders programı şablonu, ödev dosyası yazma; bu dosya bunların hiçbirini çağırmaz) bu satırı
yazmaz; statik dosya yolundaki bir 500 de günlüğe `Statik dosya hatası` diye geçer ve `tumtest`'in süzgecine takılmaz.

## İçinde neler var?

### Yardımcılar ve değerler

- `kontrol(ad, sart, detay)` — `  GECTI  <ad>` ya da `  KALDI  <ad>  -> <detay>` yazar, sayaçları artırır.
- `sunucuHatasiYok(ad, c)` — cevabın durumu 500 değilse geçer.
- `KOTU` — 24 değer: boş ve boşluk (`''`, `'   '`), `null`, `undefined`, `0`, `-1`, `999999999999`, 50 000 karakterlik `a`,
  iki betik enjeksiyonu (`<script>…`, `"><img … onerror=…>`), SQL enjeksiyonu (`'; DROP TABLE users; --`), iki yol kaçışı
  (`../../../etc/passwd`, `..\..\..\windows\system32`), NUL karakterli metin, şablon enjeksiyonları (`{{7*7}}`,
  `${process.env}`), Türkçe harfler, emoji, `true`, `false`, `[]`, `{}`, `[1, 2, 3]`, `{ a: 1 }`.
- `soruBozuk(v)` — quiz gövdesi şablonu: `sureTuru`, `toplamDk`, `sonucGorunum`, `cikincaKapanir`, sorunun türü, metni,
  süresi, doğrusu ve şıkları hep `v`; araya bir de çıplak `v` soru ve şıkları `v` olan bir çoktan seçmeli soru konur.

### Hazırlık (denetimden önce kurulanlar)

- Girişler: müdür `mudur@test.com` (`M`), Matematik öğretmeni `mat@test.com` (`O`), öğrenci `ogrenci1@test.com` (`S`).
- Servisçi `girdisrv<sayı>` (`okulHesabi`, okulun açtığı hesap), müdürün açtığı "Girdi servisi" (şoförü bu servisçi), okulun
  ilk öğrencisi o servise; veli `girdiveli<zaman>` (`hesapAc`), ilk öğrencinin veli koduyla çocuk bağlar ve veli rolü
  oturumuna gelsin diye yeniden girer (`V`). "İlk öğrenci" ad sırasıyla Burak Öztürk'tür (`o1Id`).
- Quiz: öğretmen `ogrenci1`'e "Girdi quizi" ödevini verir (iki doğrulu bir çoktan seçmeli + bir açık uçlu soru), öğrenci
  quizi başlatır; böylece öğrencinin cevap/sekme/sonraki uçlarının arkasında yaşayan bir deneme olur ve quiz kilitlenir (bir
  öğrenci başladı). İlk kontrol bunun kurulduğunu doğrular.

### Bölümler

| Bölüm | Ne yapar | Kontrol |
|---|---|---|
| 1) PROTOTIP KIRLENMESI | `POST /api/school/class` gövdesine `__proto__: { yonetici: true }` ve `constructor: { prototype: { hack: 1 } }` | 4: ikisinde 500 yok, test sürecinde `({}).yonetici` ve `({}).hack` tanımsız ("Dikkat!"e bak) |
| (hazırlık) | quizli ödev ve başlamış deneme | 1 |
| 2) BOZUK ALANLAR | 25 alan grubu × 24 değer; ilk 500'de o grubu bırakır | 25 |
| 3) YOL KACISI | `/../../server.js`, `/..%2F..%2Fserver.js`, `/....//server.js`, `//etc/passwd`, `/C:\Windows\win.ini`: gövdede `require(` ya da `scryptSync` olmamalı (SPA kabuğunun dönmesi normal) | 1 |
| 4) BASKASININ KAYDINI DUZENLEME | öğretmen iki gerçek öğrenci + `u_uydurma_kimlik` ile ödev verir; uydurma kimlik ödevin öğrencilerinde olmamalı (ödev reddedilirse de geçer) | 1 |
| 5) BASKASININ OTURUMU | 7 sahte anahtarla `GET /api/me` 200 olmamalı; sahte `X-Cihaz` başlığıyla `/api/cihaz/bildirimler` ve `/api/cihaz/ayar` ne 200 ne 500; gerçek bir telefon anahtarıyla 18 bozuk `son=` imleci 500 vermemeli, 1000 karakterden kısaysa 200 dönmeli (ilk yoklama gibi davranmalı; çok uzun adresi HTTP katmanı 431'le reddedebilir) | 3 |
| 6) BASKA OKULUN VERISI | ikinci okul: `mudur2@test.com` yetişkin hesabı açar, yönetici "İkinci Test Okulu"nu (İzmir/Konak) açıp onu müdür yapar; ikinci müdür birinci okulun öğrencilerini görmemeli, `student-update` ile düzenleyememeli, devamsızlığını okuyamamalı | 3 |
| 6b) YONETICI | `POST /api/admin/site-ayarlari`: 8 anahtar × 28 değer + 24 bozuk anahtar (248 istek) 500 vermemeli; 7 anahtar `sifirla` ile geri alınır ve `GET /api/site` sağlam olmalı (`yapimcilar` dizi, `bildirimAralikDk` sayı); `okul-adres` 24 bozuk değerle ne 200 ne 500; `okul-disk-siniri` (bozuk okul ya da bozuk MB) ve bozuk `diskMb`'li `okul-ac` 500 ve (geçerli değer dışında) 200 vermemeli; sonda okulun sınırı `null`'a döndürülür | 4 |
| 7) BUYUK GOVDE | 3 MB'lık sınıf adı: 400 ya da 413 (ya da bağlantı hatası) | 1 |
| 8) SUNUCU AYAKTA MI | müdürle `GET /api/me` 200 | 1 |

Toplam 44 kontrol. Sonunda `  GECTI: N   KALDI: M`; bir kontrol bile kaldıysa çıkış 1. Beklenmeyen bir hata olursa
`DENETIM HATASI: <ileti> <yığın>` ve çıkış 1.

### 2. bölümün alan grupları

| Grup | Uç | Kim |
|---|---|---|
| sınıf adı | `POST /api/school/class` | müdür |
| ödev başlığı | `POST /api/assignments` (öğrencisiz) | öğretmen |
| mesaj konusu | `POST /api/mesajlar` (kişisiz) | öğretmen |
| takvim başlığı | `POST /api/takvim/etkinlik` | müdür |
| yıl adı | `POST /api/egitim-yili/ekle` | müdür |
| servis saatleri | `POST /api/servis/saatler` (dört saat de bozuk) | müdür |
| servis yoklama işareti / durumu | `POST /api/servis/yoklama` | servisçi |
| servis sırası, notu, not silme | `POST /api/servis/sira`, `/not`, `/not-sil` | servisçi |
| binmeyecek | `POST /api/servis/binmeyecek` | veli |
| uygulama anahtarı, anahtar silme | `POST /api/cihaz`, `POST /api/cihaz/sil` | veli |
| ödevle gelen quiz, quiz soruları ve şıkları | `POST /api/assignments { quiz }` | öğretmen |
| quiz yaz, quiz kaldır/yaz | `POST /api/assignments/<id>/quiz` | öğretmen |
| quiz metin önizlemesi | `POST /api/assignments/quiz-metin` | öğretmen |
| quiz cevap (soru, şıklar, şık listesi, açık uçlu) | `POST …/quiz/cevap` | öğrenci |
| quiz sekme kaydı, sonraki | `POST …/quiz/odak`, `POST …/quiz/sonraki` | öğrenci |

### 3 Ekim'deki çıktı

Gece 3200'de yeni sıfırlanmış test veritabanında (seed'den sonra) çalıştırıldı: **44 GECTI, 0 KALDI**, 29 saniye, sunucu
günlüğünde `API hatası` yok. İkinci bir koşuda `fetch` sayan bir ön yükleme betiğiyle (`node -r`, kod değiştirilmeden)
cevaplar sayıldı: toplam 1058 istek; 429'lar "Dikkat!"te.

## Kimle konuşur?

- **Çağırdıkları:** [giris.md](giris.md) üzerinden `araclar/giris.js` → `BASE`, `iste`, `girisYap`, `hesapAc`, `mudurYap`,
  `okulHesabi` ([../araclar/giris.md](../araclar/giris.md)); 5. bölümde `X-Cihaz` başlığı için doğrudan `fetch(BASE + …)`.
- **Sunucu tarafında sınadığı yerler:**

  | Ne | Nerede |
  |---|---|
  | gövdenin 2 MB sınırı (413), JSON çözümü, statik dosya sunumu ve yol kaçışı | [../sunucu/http.md](../sunucu/http.md) (`readBody`, `serveStatic`) |
  | `__proto__`, `constructor`, `prototype`, `toString`, `valueOf` anahtarlarını atan, NUL karakterini silen, nesneleri metne çevrilince boş metin veren bir ilk örnekle kuran gövde temizliği | [../sunucu/ortak.md](../sunucu/ortak.md) (`govdeTemizle`) |
  | oturum çözümü, genel istek sınırı (oturum başına dakikada 300) | [../sunucu/guvenlik.md](../sunucu/guvenlik.md), [../sunucu/index.md](../sunucu/index.md) |
  | 500'e düşen hataların çevirisi ve günlüğe `API hatası` yazımı | [../sunucu/index.md](../sunucu/index.md), [../sunucu/veri/baglanti.md](../sunucu/veri/baglanti.md) (`hataCevir`) |
  | sınıf, öğrenci listesi | [../sunucu/bolumler/okul.md](../sunucu/bolumler/okul.md) |
  | `student-update`, servisçi hesabı | [../sunucu/bolumler/hesaplar.md](../sunucu/bolumler/hesaplar.md) |
  | ödev ve quiz | [../sunucu/bolumler/odev.md](../sunucu/bolumler/odev.md), [../sunucu/bolumler/quiz.md](../sunucu/bolumler/quiz.md) |
  | mesaj, takvim, eğitim yılı | [../sunucu/bolumler/mesaj.md](../sunucu/bolumler/mesaj.md), [../sunucu/bolumler/takvim.md](../sunucu/bolumler/takvim.md), [../sunucu/bolumler/egitim-yili.md](../sunucu/bolumler/egitim-yili.md) |
  | servis (saatler, yoklama, sıra, not, binmeyecek) | [../sunucu/bolumler/okul-hayati.md](../sunucu/bolumler/okul-hayati.md) |
  | telefon anahtarları ve anahtarlı uçlar | [../sunucu/bolumler/cihaz.md](../sunucu/bolumler/cihaz.md) |
  | veli kodu | [../sunucu/bolumler/veli.md](../sunucu/bolumler/veli.md) |
  | devamsızlık | [../sunucu/bolumler/devamsizlik.md](../sunucu/bolumler/devamsizlik.md) |
  | yönetici: okul açma, genel bakış | [../sunucu/bolumler/yonetici.md](../sunucu/bolumler/yonetici.md), [../sunucu/bolumler/yonetici-okul.md](../sunucu/bolumler/yonetici-okul.md) |
  | site ayarları, okul adresi | [../sunucu/bolumler/site-ayarlari.md](../sunucu/bolumler/site-ayarlari.md), [../sunucu/site.md](../sunucu/site.md) (`GET /api/site`) |
  | okulun disk sınırı | [../sunucu/bolumler/okul-disk.md](../sunucu/bolumler/okul-disk.md) |
  | `GET /api/me` | [../sunucu/bolumler/kayit.md](../sunucu/bolumler/kayit.md) |

- **Ön koşulu:** [seed.md](seed.md) (müdür, `mat`, `ogrenci1`, yönetici, iki öğrenci, okul).
- **Onu çalıştıran:** `testler/tumtest.sh` (denetimler döngüsü). Başka hiçbir dosya çağırmaz.
- **Tablolara yazdıkları** (yalnız test veritabanında): tuhaf adlı sınıflar ve takvim etkinlikleri, servis ve servisçi,
  veli ve bağı, ödevler (quizli ve quizsiz), quiz denemesi, ikinci okul ve müdürü, velinin 20 telefon anahtarı, site
  ayarları (sonda geri alınır).

## Nasıl çalışır (adım adım)?

```
tumtest: sunucu (3200, _test sıfır) ─► seed.js ─► girdi-denetimi.js
  M, O, S girer
  1) __proto__ / constructor gövdeleri
  hazırlık: servisçi + servis + veli + quizli ödev, ogrenci1 quizi başlatır
  2) for grup in 25 grup: for v in KOTU (24): istek ─► 500 mü? ─► evet: KALDI, grubu bırak
  3) yol kaçışı   4) uydurma öğrenci kimliği   5) sahte oturum / telefon anahtarı / bozuk imleç
  6) yönetici girer ─► mudur2 + İkinci Test Okulu ─► yabancı müdür denemeleri
  6b) site ayarları (248 istek) ─► sıfırla ─► /api/site sağlam mı ─► okul adresi ─► disk sınırı + okul açma
  7) 3 MB gövde   8) /api/me hâlâ 200 mü
  GECTI: 44  KALDI: 0
tumtest: çıktıda "KALDI  " ya da günlükte "API hatası" var mı ─► DENETIM SORUNU
```

Elle çalıştırmak için önce test sunucusunu `tumtest.sh`'teki ortam değişkenleriyle 3200'de aç (çıktısı
`testler/test-sunucu.log`'a), sonra:

```
EE_BASE=http://localhost:3200 EE_LOG=testler/test-sunucu.log node testler/seed.js
EE_BASE=http://localhost:3200 EE_LOG=testler/test-sunucu.log node testler/girdi-denetimi.js
grep -c "API hatası" testler/test-sunucu.log      # 0 olmalı
```

## Dikkat!

- **Çökerse `tumtest` bunu sorun saymaz.** Denetim yarıda bir hata fırlatırsa (`DENETIM HATASI: …`) çıktıda ne `KALDI  ` ne
  de `GUVENLIK ACIGI (` olur; `tumtest.sh` bu döngüde çıkış kodunu da seed'in çıkış kodunu da denetlemez. Sunucu günlüğüne
  `API hatası` düşmediyse sonuç "DENETIM SORUNU: 0" görünür. Örneğin seed bozulursa ilk `girisYap` fırlatır ve denetim hiç
  çalışmadan "temiz" geçer. `tumtest` çıktısında bu bölümün altında `GECTI: 44` satırını gördüğünden emin ol.
- **`__proto__` gövdesi sunucuya hiç gitmiyor.** JavaScript nesne yazımında `'__proto__': { … }` bir özellik değil, nesnenin
  ilk örneğini belirler; `JSON.stringify` onu yazmaz. 3 Ekim'de denendi: gönderilen gövde yalnız `{"name":"PT"}`. `constructor`
  gövdesi ise gerçekten gider. Ayrıca "prototip kirlenmedi" denetimleri **test sürecinin** `Object.prototype`'ına bakar,
  sunucununkine değil; sunucuda kirlenme olsa bile bu iki kontrol geçerdi. Sunucudaki asıl koruma
  [../sunucu/ortak.md](../sunucu/ortak.md)'deki `govdeTemizle` (anahtarları atar, nesneleri `Object.prototype`'sız kurar).
  `__proto__`'yu gerçekten gönderen tek test [guvenlik-test.md](guvenlik-test.md)'nin 5. bölümü (`JSON.parse` ile). Kod
  değiştirilmedi.
- **Yol kaçışı denemelerinin bir kısmını `fetch` sunucuya göndermeden düzeltir.** Adres ayrıştırıcısı `..` parçalarını çözer ve
  `\`'yi `/` yapar: `/../../server.js` sunucuya `/server.js` olarak, `C:\Windows\win.ini` `/C:/Windows/win.ini` olarak gider
  (3 Ekim'de Node'un adres ayrıştırıcısıyla denendi). Olduğu gibi ulaşanlar yüzde kodlu `..%2F..%2Fserver.js`, `....//server.js`
  ve `//etc/passwd`'dir; sunucuya `..` taşıyan yalnız yüzde kodlu olanıdır. Ham `..` göndermek için `fetch` yerine
  `http.request` ya da ham soket gerekir. 3 Ekim'de `testler/` tarandı: bugün hiçbir paket statik dosya sunucusuna ham `..`
  göndermiyor (parametre içindeki `../` denemeleri ayrı iş: `testler/test-yedek.js`, `testler/test-odev-dosya.js`,
  `testler/test-okul-sayfasi.js`).
- **Bu bölüm `server.js` sızıntısını yakalayacak durumda değil.** Statik dosyalar `public/` klasöründen sunulur; projenin
  kökündeki `server.js` oradan **bir** üst klasördedir. Yüzde kodlu `..%2F..%2Fserver.js` ise çözülünce iki kez yukarı çıkar,
  yani projenin dışını (`public/../../server.js`) hedefler; öteki yolların hedefi `public/` içindedir (`/server.js`,
  `/....//server.js`, `/etc/passwd`, `/C:/Windows/win.ini`). Üstelik [../sunucu/http.md](../sunucu/http.md)'deki `serveStatic`
  adresi `path.normalize` ile kökten çözer (`/../../server.js` → `/server.js`) ve sonra `public/` dışına çıkan yolu 403'le
  reddeder; bugünkü kodla bu yollar `public/` dışına zaten çıkamaz. Yani kontrol bugün düşemez, ama kaçış koruması bozulsa bile
  bu beş yoldan hiçbiri projenin `server.js`'ine varmazdı (3 Ekim'de `path.join` ile hesaplandı). Gerçek bir sınama için tek
  `..` taşıyan yüzde kodlu bir yol (`/..%2Fserver.js`) gerekir. Kod değiştirilmedi.
- **6b'nin disk sınırı kısmı büyük ölçüde boşa çalışıyor.** Genel istek sınırı oturum başına dakikada 300'dür ve sabit
  pencerelidir. Yönetici oturumu 6. bölümdeki okul açmadan sonra 248 ayar + 7 sıfırlama + 24 okul adresi + 1 genel bakış ile
  281'e ulaşır; disk döngüsü her değer için 3 istek atar. 300'ü geçen her istek 429 alır ve denetim 429'u "ne 500 ne 200"
  diye geçmiş sayar. 3 Ekim'deki ölçüm: `okul-disk-siniri` 49 isteğin **36'sı**, bozuk `diskMb`'li `okul-ac` 24 isteğin
  **18'i** 429 aldı; yani yalnız ilk altı değer (`''`, `'   '`, `null`, `undefined`, `0`, `-1`) üç uçta da, yedincisi
  (`999999999999`) yalnız ilkinde gerçekten sınandı, sondaki
  `mb: null` geri alma isteği de 429 aldı (o okulun sınırı zaten `null` kaldığı için zararsız). Dosyadaki yorum "~200 istek"
  diyor; `okulDiskMb` anahtarı (commit 525) ve disk döngüsü eklenince bu hesap bozuldu. Düzeltme önerisi: disk denemeleri
  için ayrı bir yönetici girişi ya da istekleri iki dakikaya yaymak. Kod değiştirilmedi.
- **Telefon anahtarı grubunun son dört değeri 429 alıyor.** Bir hesap saatte en çok 20 telefon anahtarı alabilir; velinin 24
  denemesinin son dördü (`[]`, `{}`, `[1, 2, 3]`, `{ a: 1 }`) sınıra takılır (ölçüldü: `/api/cihaz` 4 kez 429). Grup yine
  geçer.
- **Yalnız 500 sayılır.** 2. bölümde bozuk değerin reddedilip reddedilmediğine bakılmaz: `'🎓📚🏫'` adlı sınıf ya da
  `{{7*7}}` başlıklı etkinlik açılırsa (200) bu da geçer. Bozuk değerin kaydedilmediğini ayrıca yalnız okul adresi, disk sınırı
  ve okul açma denetler. Bir grupta ilk 500'den sonra öteki değerler denenmez; çıktı yalnız o ilk değeri gösterir.
- **"İkinci okul kurulamadı (atlandı)" dalı ölü.** `mudurYap` başarısızlıkta `undefined` dönmez, fırlatır; ikinci okul
  açılamazsa bütün denetim `DENETIM HATASI` ile durur (ve yukarıdaki maddeye göre `tumtest`'te görünmeyebilir).
- **Aynı veritabanında iki kez çalışmaz.** `mudur2@test.com` sabittir; ikinci koşuda `hesapAc` "Bu e-posta zaten kayıtlı" ile
  fırlatır. Her koşudan önce veritabanını sıfırla (`tumtest` yapar).
- **Sıra önemli.** Öğrenci quizi 2. bölümden önce başlatır: cevap ve sekme uçlarının arkasında gerçek bir deneme olsun, öğretmenin
  "quiz kaldır/yaz" denemeleri de kilit yüzünden (409) quizi silemesin.
- **Varsayılan adres 3000.** `EE_BASE` vermezsen yüzlerce bozuk istek kendi (gerçek veritabanlı) sunucuna gider, orada sınıf,
  ödev, ikinci okul açar ve site ayarlarını değiştirir. Her zaman `EE_BASE=http://localhost:3200`.
- 6. bölümün iletisindeki "mudurü" yazımı ASCII ile Türkçenin karışımıdır; yazım denetimi `testler/` klasörüne bakmadığı
  için yakalanmaz.

## Testleri

- Kendisi bir denetim. Koruduğu dosyalar: [../sunucu/http.md](../sunucu/http.md) (gövde sınırı, statik dosyalar),
  [../sunucu/ortak.md](../sunucu/ortak.md) (gövde temizliği, `clean`), [../sunucu/guvenlik.md](../sunucu/guvenlik.md) (oturum,
  istek sınırı) ve yukarıdaki tablodaki bölüm dosyalarının girdi doğrulaması: `okul`, `hesaplar`, `odev`, `quiz`, `mesaj`,
  `takvim`, `egitim-yili`, `okul-hayati`, `cihaz`, `veli`, `devamsizlik`, `yonetici`, `yonetici-okul`, `site-ayarlari`,
  `okul-disk`. Rol × uç yetkilerini (tek okulla) [yetki-denetimi.md](yetki-denetimi.md) dener; iki denetimde okullar arası
  ayrıma bakan tek yer bu dosyanın 6. bölümüdür.
- Elle: yukarıdaki komutlar. 3 Ekim gecesi böyle koşuldu: 44/0, 29 sn, günlükte `API hatası` 0; sunucu iş bitince kapatıldı.
- Kendi kurallarını denemek istersen: bir bölüm dosyasında bir alanın doğrulamasını geçici olarak kaldır (ör.
  `clean(body.name, 30)` yerine `body.name.trim()`), sunucuyu yeniden aç ve denetimi koş: ilgili grup `KALDI` olmalı (geri al).

## Son durum

- `git log`: 7 commit. `5b59043 commit 135` (2026-08-29) ilk 32 satır: açıklama, `kontrol`, `sunucuHatasiYok`, `KOTU`.
  `ebc83c1 commit 136` (2026-08-29) sekiz bölümün ilk hâli (prototip, bozuk alanlar, yol kaçışı, uydurma kimlik, sahte
  oturum, başka okul, büyük gövde, sunucu ayakta mı). `0acca75 commit 516` (2026-09-27): yalnız ikinci okulun kuruluşunu
  anlatan yorum ("Rolsüz kayıt -> okulunu kaydeder -> yönetici onaylar" → "Kayıt -> kişi kodunu yöneticiye verir -> yönetici
  okulu açıp onu müdür yapar"); asıl değişiklik `araclar/giris.js`'in `mudurYap`'ındaydı.
- `24050a2 commit 518` (2026-09-27, servis yoklaması): servisçi, servis ve veli hazırlığı; `BASE` ve `okulHesabi` alındı;
  servis saatleri, yoklama, sıra, not, binmeyecek ve telefon anahtarı grupları; 5. bölüme sahte `X-Cihaz` ve bozuk imleç
  denetimleri.
- `3b8fd36 commit 519` (2026-09-27, quiz): quizli ödev ve başlamış deneme hazırlığı, `soruBozuk`, 11 quiz grubu.
- `276c0a0 commit 521` (2026-09-27, gizli `/admin` ve site ayarları): 6b bölümü — site ayarları, `/api/site`'nin sağlamlığı,
  okul adresi.
- `40fc7e7 commit 525` (2026-09-27, okul disk sınırı): site ayarı anahtarlarına `okulDiskMb`, sıfırlama 6 → 7 anahtar; okulun
  disk sınırı ve bozuk `diskMb`'li okul açma denetimi. O günden beri değişmedi.
- Bilinen açıklar (kod değiştirilmedi): 6b'deki 429'lar, gövdeye girmeyen `__proto__`, istemci sürecine bakan kirlenme
  denetimi, `fetch`'in düzelttiği yol kaçışları ve 3. bölümün hiçbir yolunun projenin `server.js`'ine varmaması, çökmenin
  `tumtest`'te görünmemesi.
- Planlı işlerden etkileyecekler: "T.C. kimlik no bütün hesaplarda zorunlu" — veli ve `mudur2` kayıtları T.C. göndermiyor;
  `araclar/giris.js`'teki `hesapAc` T.C. eklemezse kayıtlar reddedilir, denetim hazırlıkta çöker (ve yukarıdaki maddeye göre
  `tumtest`'te sessiz kalır); "Sistem" işindeki yöneticiye zorunlu TOTP — 6. bölümdeki
  yönetici girişi; "Mesaj ayarları" ve "Mesaj etiketleri" (mesaj gövdesine yeni alanlar), "Kulüpler kaldırılacak" (burada kulüp
  yok, etkilemez), "Sunucuda küçültme" ve "Paneller" (yeni yönetici uçları) — her yeni uç ya da gövde alanı buraya bir grup
  olarak eklenmeli (quiz ve servis işlerinde yapıldığı gibi).
