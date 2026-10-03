# testler/test-servis-pencere.js

Servis saat aralıklarının saf hesabını (`sunucu/yardimci/servis-pencere.js`) sunucusuz, saati elle seçerek deneyen paket
(36 denetim): aralık doğrulaması, "şu an hangi dönem?", 60 dakikalık uzatma, gece yarısı, seferin sürüp sürmediği, birden çok
okulun zarfı, "07:42'de" gibi saat ekleri ve bildirimdeki ad.

## Bu dosya ne yapar?

Servis yoklaması ve canlı konum yalnız okulun seçtiği iki aralıkta açık: sabah (evden alma) ve akşam (okuldan bırakma).
Aralık bitince yoldaki sefer 60 dakika daha sürebilir ("uzatma"). Bütün bu saat kararları tek bir saf dosyada verilir
([../sunucu/yardimci/servis-pencere.md](../sunucu/yardimci/servis-pencere.md)); okul hayatı bölümü, telefonun cihaz ucu ve JSON
aktarımı onu kullanır.

Sunuculu servis testleri ([test-servis-yoklama.md](test-servis-yoklama.md), [test-servis-konum.md](test-servis-konum.md)) yalnız
"şu an"ı deneyebilir: aralığı o anki saate göre kurarlar. Sınırlar ise tam dakikasında sınanmalı: 07:00 aralığa dahil mi, 09:20:59
hâlâ sabah mı, 09:21 uzatma mı, 10:21'de uzatma bitti mi, gece 00:20'de dünün akşamı hâlâ uzatmada mı? Bu paket her anı
kendisi verir (`servisPenceresi(okul, an)`, `seferSuruyorMu(okul, sefer, an)`), bu yüzden günün hangi saatinde koşulursa koşulsun
aynı sonucu verir. Sunucu, veritabanı ya da ağ istemez.

Dosya başındaki yorum kapsamı tek cümlede özetliyor: Türkiye saati, bitiş dakikası dahil, 60 dakikalık uzatma, sonraki aralık,
gece yarısı, doğrulama kuralları, seferin sürüp sürmediği, birden çok okulun zarfı, saat eki, bildirimdeki ad; "sunucunun kendi saat
dilimi sonucu değiştirmez".

## İçinde neler var?

### Yardımcılar ve örnek saatler

- `p` — `require('../sunucu/yardimci/servis-pencere')`; denetimlerin hepsi bu nesnenin işlevlerini çağırır.
- `kontrol(ad, sart, detay)` — `GECTI`/`KALDI` satırı basar, sayar. `J(x)` — `JSON.stringify` kısaltması.
- `TR(s)` — `Date.parse(s + '+03:00')`: "2026-09-28T08:30:00" metnini Türkiye saatiyle gerçek ana (ms) çevirir. Bütün anlar böyle
  verildiği için yerel saat dilimi hesaba hiç girmez.
- `OKUL` — `{ servisSaatleri: { sabahBas: '07:00', sabahBit: '09:20', aksamBas: '16:30', aksamBit: '19:00' } }` (değerleri
  koddaki `VARSAYILAN` ile aynı, ama okul nesnesi biçiminde).
- `GENIS` — `{ sabahBas: '00:00', sabahBit: '11:59', aksamBas: '12:00', aksamBit: '23:59' }`: [seed.md](seed.md)'nin test okuluna
  yazdığı "günün her anı bir dönem" saatleri (düz nesne biçiminde).
- `pen(okul, s)` — `p.servisPenceresi(okul, TR(s))`.

Bütün örnek tarih 2026-09-28 ve komşu günleri; gün adına bakan bir kural yok (her gün geçerli).

### 1) DOĞRULAMA (7)

- Varsayılan aralıklar (`p.VARSAYILAN`) ve `GENIS` geçerli (`saatlerSorunu` → `null`).
- Sabah bitişi akşam başına eşit olabilir (07:00–12:00 / 12:00–19:00 → `null`).
- 11 bozuk girdinin her biri Türkçe bir neden (metin) döner: tek haneli saat `'7:00'`, `'24:00'`, `'09:60'`, ters sabah
  (09:20–07:00), başı ve sonu aynı akşam (19:00–19:00), 29 dakikalık sabah (07:00–07:29), 29 dakikalık akşam (16:30–16:59),
  akşama taşan sabah (07:00–17:00, akşam 16:30), `aksamBit` eksik, `null` ve `'x'`. Kalırsa detayda bütün nedenler `|` ile basılır.
- Tam 30 dakikalık aralık kabul (07:00–07:30 / 16:30–17:00).
- `saatleri`: `null` → `VARSAYILAN`; `{ servisSaatleri: { sabahBas: 'x' } }` → `VARSAYILAN`; `OKUL` → kendi saatleri; düz `GENIS` →
  aynen kendisi (iki biçim de okunuyor).
- `aralikMetni(OKUL.servisSaatleri)` → `'sabah 07:00–09:20 ve akşam 16:30–19:00'` (uzun tire `–`).

### 2) HANGİ DÖNEM (10) — `OKUL` saatleriyle

| An (Türkiye) | Beklenen |
|---|---|
| 07:00 | `donem: 'sabah'`, `bas: '07:00'`, `bit: '09:20'`, `tarih: '2026-09-28'` |
| 04:00 UTC (`Date.parse('…T04:00:00Z')`) | sabah (07:00 Türkiye) |
| 07:00 | `sonraki` = aynı günün akşamı, 16:30 |
| 09:20:59 | hâlâ sabah (bitiş dakikası dahil) |
| 09:21:00 | `donem: null`, `bas: null`, `uzatma: { donem: 'sabah', tarih: '2026-09-28', bit: '09:20' }` |
| 10:20:59 / 10:21:00 | uzatma sürüyor / `uzatma: null` |
| 06:59 | aralık dışı, uzatma yok, `sonraki` bugünün sabahı |
| 17:00 | akşam (`bas: '16:30'`), `sonraki` yarının (2026-09-29) sabahı |
| 19:30 | aralık dışı, akşam uzatmasında |
| 23:30 | aralık dışı, uzatma yok, `sonraki` yarın 07:00 |

### 3) TEST ARALIKLARI VE GECE YARISI (2) — `GENIS` saatleriyle

- Gün boyunca 7 dakikada bir (00:00:30, 00:07:30, … 23:55:30; 206 an) hepsinde bir dönem dolu; ayrıca 11:59:59 sabah, 12:00:00
  akşam, 23:59:59 akşam. Kalırsa detayda boş kalan an sayısı.
- 2026-09-29 00:20 → yeni günün sabahı (`tarih: '2026-09-29'`); dünün (2026-09-28) akşamı uzatmada.

### 4) SEFER SÜRÜYOR MU (12)

Sefer nesnesi `{ yon: 'gidis'|'donus', baslangic: ISO }`; `baslangic` `TR(...)` ile kurulur.

- 08:00'de başlamış sabah (gidiş) seferi 09:00'da ve 10:20'de sürüyor; 10:21'de kapanmış.
- 18:50'de başlamış akşam (dönüş) seferi 19:59'da sürüyor, 20:01'de kapanmış.
- Dünkü sefer ertesi gün 08:00'de sürmüyor.
- `GENIS`'te 23:40'ta başlamış dönüş seferi gece 00:30'da hâlâ sürüyor (uzatma gece yarısını geçiyor).
- `seferDonemi('gidis') === 'sabah'`, `seferDonemi('donus') === 'aksam'`, `donemYonu` tersi.
- `baslangic`'ı olmayan sefer ve `null` sefer sürmüyor.
- 13:00'te (akşam aralığından önce) açılmış dönüş seferi ne 13:05'te ne de akşam aralığının içinde (17:00) sürüyor: sefer yalnız
  kendi günündeki kendi dönem aralığında başladıysa sürer.
- Aralık ileri alınınca: 04:05'te açılmış gidiş seferi `GENIS`'te 04:10'da sürüyor, ama saatler 20:00–20:30 / 21:00–21:30 (`SONRA`)
  olunca hem 04:10'da hem 20:10'da sürmüyor.
- Sabah aralığı bittikten sonra (09:25) açılmış sefer 09:30'da uzatmada bile sürmüyor.
- Veritabanı saati için aralığın iki ucunda 2 dakikalık pay: 06:59'da ve 09:21:30'da başlamış seferler sürüyor, 06:57'de başlamış
  sürmüyor.
- `aralikIcindeMi`: 08:00 sabah aralığında; 09:40 sabah aralığında değil; 08:00 akşam aralığında değil; `NaN` her zaman `false`.

### 5) ZARF, SAAT EKİ, AD (5)

- `saatZarfi([OKUL, 06:45–09:00 / 17:00–19:30])` → `{ sabahBas: '06:45', sabahBit: '09:20', aksamBas: '16:30', aksamBit: '19:30' }`
  (en erken başlangıçlar, en geç bitişler); `saatZarfi([])` → `null`.
- `trSaat(Date.parse('2026-09-28T04:42:10Z'))` → `'07:42'`.
- `saatEki` 16 saatte: `07:42'de`, `08:05'te`, `16:40'ta`, `17:10'da`, `09:00'da`, `12:00'de`, `10:00'da`, `20:00'de`, `00:00'da`,
  `07:30'da`, `08:50'de`, `08:03'te`, `08:04'te`, `08:06'da`, `08:01'de`, `23:00'te`. Kalırsa detayda yanlış çıkanlar ekleriyle.
- `ilkAd`: "Zeynep Şahin" → "Zeynep", "Ali Rıza Kaya" → "Ali Rıza", "Tek" → "Tek", `''` → `''` (veliye giden bildirimde soyadı atılır).

Toplam 7 + 10 + 2 + 12 + 5 = 36. Sonunda boş satır ve `  GECTI: 36   KALDI: 0`; `KALDI` varsa çıkış kodu 1. Paketin bir `catch`'i
yok: beklenmeyen bir hata (ör. dosya bulunamadı) Node'un kendi hata çıktısıyla süreci düşürür, `GECTI:` satırı basılmaz.

## Kimle konuşur?

- **Çağırdığı:** yalnız `sunucu/yardimci/servis-pencere.js`; o da [../sunucu/yardimci/hatirlatici-zaman.md](../sunucu/yardimci/hatirlatici-zaman.md)'deki
  `an`, `trGun`, `gunEkle`'yi kullanır. Sunucu, veritabanı, ağ, dosya yazma yok.
- **Koruduğu kod:** [../sunucu/yardimci/servis-pencere.md](../sunucu/yardimci/servis-pencere.md) — dışa açılan işlevlerin hepsi doğrudan
  denenir (`VARSAYILAN`, `saatlerSorunu`, `saatleri`, `aralikMetni`, `servisPenceresi`, `aralikIcindeMi`, `seferSuruyorMu`,
  `seferDonemi`, `donemYonu`, `saatZarfi`, `trSaat`, `saatEki`, `ilkAd`); `UZATMA_DK` (60) ve `EN_KISA_DK` (30) değerleriyle değil,
  etkileriyle (10:21, 20:01, 29/30 dakika) korunur. Dolaylı olarak bu işlevleri kullananlar:
  - [../sunucu/bolumler/okul-hayati.md](../sunucu/bolumler/okul-hayati.md) — yoklama penceresi, sefer başlatma ve kapatma, "okula vardı"
    ve yoklama bildirimlerindeki "Zeynep 07:42'de servise bindi." metni, `POST /api/servis/saatler` doğrulaması;
  - [../sunucu/bolumler/cihaz.md](../sunucu/bolumler/cihaz.md) — telefona giden `servisSaatleri` (`saatZarfi`);
  - [../sunucu/veri/json-aktarim.md](../sunucu/veri/json-aktarim.md) — eski veriden gelen okul saatlerini `saatlerSorunu` ile süzer.
- **Onu çalıştıran:** `testler/tumtest.sh` — sunucusuz paketler döngüsünde altıncı (`test-hatirlatici-zaman`'dan sonra,
  `test-vekil-ip`'ten önce). [giris.md](giris.md)'yi kullanmaz.

## Nasıl çalışır (adım adım)?

```
require servis-pencere ─► p
1) saatlerSorunu(VARSAYILAN, GENIS, eşit uç)  = null
   saatlerSorunu(11 bozuk)                    = metin
   saatleri(null | bozuk | OKUL | GENIS) ; aralikMetni
2) pen(OKUL, '2026-09-28T07:00') … '23:30'    donem / bas / bit / uzatma / sonraki
3) 7 dakikada bir GENIS ; 00:20 (dünün akşamı uzatmada)
4) seferSuruyorMu(okul, { yon, baslangic: TR(..) }, TR(..))  ─ uzatma, gün, aralık dışı başlangıç, 2 dk pay
   aralikIcindeMi(..)
5) saatZarfi ; trSaat ; saatEki × 16 ; ilkAd
GECTI: n   KALDI: m   (KALDI > 0 ise çıkış 1)
```

## Dikkat!

- **Yerel saat dilimine bağlı değil (beş dilimde denendi).** Anların hepsi `+03:00` ya da `Z` ekli metinden ms'ye çevrilir;
  `trSaat` ve `hatirlatici-zaman.js` UTC hesabıyla çalışır. 3 Ekim'de paket, Node'un saat dilimi süreç içinden değiştirilerek
  (`process.env.TZ`) UTC, `America/New_York`, `Asia/Tokyo`, `Pacific/Kiritimati` ve `America/Adak`'ta koşuldu; beşinde de
  `GECTI: 36   KALDI: 0`. Tuzak: bu Windows makinesinde Git Bash'ten `TZ=America/New_York node …` etkisiz kalıyor (ofset yine
  −180, `Europe/Istanbul`), `TZ=UTC node …` ise işliyor; başka dilimi denemek için "Testleri"ndeki yolu kullan.
- **"Günün her dakikası" denetimi her dakikaya bakmaz.** 3. bölümün adı "günün her dakikası bir dönemde" diyor; döngü ise 7 dakikada
  bir (206 an) ve her birinin 30. saniyesine bakıyor, üstüne üç uç an. Boşluk bu örneklerin arasına düşerse görülmez. Sorun
  çıkarmıyor çünkü kod sürekli aralıklarla çalışıyor; ama ad abartılı. (Kod değiştirilmedi.)
- **`'7:00'` burada reddedilir, sunucuda kabul edilir.** `saatlerSorunu` iki haneli saat ister; `POST /api/servis/saatler` ise değerleri
  önce `saatDuzelt` ([../sunucu/iliskiler.md](../sunucu/iliskiler.md)) ile `'07:00'`'a çevirir, sonra bu işlevi çağırır.
  [test-servis-yoklama.md](test-servis-yoklama.md)'nin 1. bölümü sunucu tarafını ayrıca dener. İkisi çelişmez.
- **Sabah bitişi = akşam başı, o dakika denenmez.** 1. bölüm bu düzenin geçerli sayıldığını dener; ama o tek dakikada iki aralık üst
  üste biner ve `servisPenceresi` sabahı seçer. Bu paket o dakikayı sormuyor (`GENIS` 11:59/12:00 kullanır). Sunuculu
  [test-servis-yoklama.md](test-servis-yoklama.md) ise kendi kurduğu aralıklarda sabah bitişini akşam başına eşit yapar
  (`sabahAraligi`), yani bu davranışa dayanır.
- **Yalnız geçerli girdiler.** `saatEki` bozuk biçimde `"'de"` döner, `seferDonemi`/`donemYonu` bilinmeyen değeri akşam/dönüş sayar;
  bunlar denenmiyor (çağıranlar yönü önceden doğruluyor).
- **Pay sınırının tam ucu denenmez.** 2 dakikalık payda 06:57 (dışarıda) ve 06:59 (içeride) denenir; tam sınır olan 06:58 ve üst
  uçtaki 09:23 sorulmaz.
- Bildirim metinlerindeki ekler ve ad kısaltması Türkçe'ye özgüdür; bu paket metnin kendisini değil yalnız eki ve adı dener
  (tam metinler sunuculu pakette).

## Testleri

- Bu dosyanın kendisi testtir; `testler/tumtest.sh` her tam koşuda sunucusuz paketler arasında çalıştırır.
- Elle (proje kökünde): `node testler/test-servis-pencere.js`. Sunucu ve veritabanı gerekmez; `EE_BASE` vermene gerek yok.
- 3 Ekim'de bu belge için çalıştırıldı: `GECTI: 36   KALDI: 0`, çıkış 0, 0,1–0,2 saniye.
- Başka saat diliminde (proje kökünde):
  `node -e "process.env.TZ='America/New_York'; require('./testler/test-servis-pencere.js')"`. 3 Ekim'de UTC, New York, Tokyo,
  Kiritimati (+14) ve Adak (−9/−10) ile koşuldu, hepsi 36/0.
- Aynı kuralları uçtan deneyen sunuculu paketler: [test-servis-yoklama.md](test-servis-yoklama.md) (aralık dışı 409, uzatmada işaret,
  aralık bitince ve saatler değişince seferin kapanması, cihaz ayarındaki `servisSaatleri`), [test-servis-konum.md](test-servis-konum.md)
  (sefer yönünün dönemden gelmesi), [test-ozellikler.md](test-ozellikler.md) (servis kapalıyken uçlar).

## Son durum

- `git log`: tek commit. Dosya `24050a2 commit 518` (2026-09-27, servis yoklaması + `/api/cihaz` + 30 günlük uygulama oturumu) ile
  125 satır olarak eklendi; o günden beri değişmedi. Aynı commit koruduğu `sunucu/yardimci/servis-pencere.js`'i (155 satır, yeni) ve
  [test-servis-yoklama.md](test-servis-yoklama.md)'yi getirdi; `tumtest.sh`'in sunucusuz listesine bu paket
  `test-hatirlatici-zaman` ile `test-vekil-ip` arasına eklendi, [seed.md](seed.md) test okulunun saatlerini 00:00–11:59 / 12:00–23:59 yaptı.
- Açık iş yok; kod değiştirilmedi. Zayıf noktalar ("her dakika" adı, denenmeyen eşit uç dakikası) "Dikkat!"te.
- Planlı işlerden bu dosyayı doğrudan değiştirecek olan yok. "Android yerel uygulama" işi telefonun bildirim sıklığında `saatZarfi`
  sonucunu (`/api/cihaz` üzerinden) kullanmaya devam edecek; "Çok dil" işi bildirim metinlerini çeviriye açarsa `saatEki` ve
  `ilkAd` gibi Türkçe'ye özgü yardımcılar ve buradaki 5. bölüm o işle birlikte gözden geçirilmeli (tanımda bu iki işlev için ayrıca
  bir şey yazılı değil).
