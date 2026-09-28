# sunucu/yardimci/servis-pencere.js

Okulun servis saat aralıkları (sabah alma, akşam bırakma): geçerlilik denetimi, "şu an hangi aralıktayız?", seferin hâlâ
sürüp sürmediği ve bildirim metinleri için küçük Türkçe yardımcılar (saf hesap, veritabanı yok).

## Bu dosya ne yapar?

Servis yoklaması ve servis konumu yalnız belli saatlerde açıktır: sabah öğrenciyi evden alma aralığı, akşam okuldan eve bırakma
aralığı. Okul bu iki aralığı kendisi seçer. Aralık bitince yoldaki sefer trafik yüzünden 60 dakika daha sürebilir
("uzatma"). Bu dosya bütün bu saat kararlarını tek yerde, Türkiye saatiyle (sunucunun saat dilimine bakmadan) verir; okul hayatı
bölümü, cihaz (telefon uygulaması) bölümü ve JSON aktarımı aynı kurala uyar.

Kurallar kısaca:

- Her gün geçerlidir; hafta sonu ya da tatil ayrımı yoktur.
- Bitiş dakikası DAHİLDİR: 07:00–09:20 aralığı 09:20:59'a kadar açıktır.
- Sefer yalnız aralık içinde başlar; aralık bitince 60 dakikalık uzatma bitince kapanır.

## İçinde neler var?

### Sabitler

- **`VARSAYILAN`** — `{ sabahBas: '07:00', sabahBit: '09:20', aksamBas: '16:30', aksamBit: '19:00' }` (dondurulmuş).
  Okulun saatleri yoksa ya da bozuksa bu kullanılır.
- **`UZATMA_DK`** — 60: aralık bittikten sonra seferin sürebileceği dakika.
- **`EN_KISA_DK`** — 30: bir aralık en az bu kadar olmalı.
- İç: `SAAT` (`/^([01]\d|2[0-3]):[0-5]\d$/`, yani 00:00–23:59, iki haneli), `PAY_MS` (2 dakika, aşağıda).

### Doğrulama ve okuma

- **`saatlerSorunu(s)`** — `{ sabahBas, sabahBit, aksamBas, aksamBit }` geçerliyse `null`, değilse kısa Türkçe neden:
  - nesne değilse: "Servis saatlerini yaz."
  - dört alandan biri eksik ya da `SS:DD` değilse: "Saatleri 07:00 biçiminde yaz."
  - sabah bitişi başlangıçtan sonra değilse: "Sabah aralığının bitişi başlangıcından sonra olmalı."
  - akşam için aynısı: "Akşam aralığının bitişi başlangıcından sonra olmalı."
  - aralıklardan biri 30 dakikadan kısaysa: "Her aralık en az 30 dakika olmalı."
  - sabah bitişi akşam başlangıcından SONRAysa: "Sabah aralığı akşam aralığı başlamadan bitmeli." (Eşit olabilir.)
- **`saatleri(okul)`** — okulun aralıkları. `okul` ya `esleme.okul()` nesnesidir (`{ servisSaatleri: {...} }`) ya da doğrudan dört
  alanlı nesne. Eksik ya da `saatlerSorunu`'ndan geçmeyen her durumda `VARSAYILAN`'ın kopyası döner; hata atmaz.
- **`aralikMetni(s)`** — "sabah 07:00–09:20 ve akşam 16:30–19:00" (uzun tire ile). Hata mesajlarında ve işlem kaydında kullanılır.

### "Şu an neredeyiz?"

- **`servisPenceresi(okul, simdi?)`** — `simdi` verilmezse `Date.now()`. Dönen nesne:
  - `donem`: `'sabah'`, `'aksam'` ya da `null` (aralık dışı);
  - `tarih`: dönemin Türkiye günü (aralık dışındaysa bugün);
  - `bas`, `bit`: içinde bulunulan aralığın saatleri ya da `null`;
  - `uzatma`: aralık biteli 60 dakika olmadıysa `{ donem, tarih, bit }`, yoksa `null`;
  - `sonraki`: bundan sonra başlayacak ilk aralık `{ donem, tarih, bas, bit }`;
  - `saatler`: kullanılan aralıklar.

  Dün, bugün ve yarının iki dönemine bakar; böylece gece yarısını geçen uzatma (ör. 23:59'da biten akşam) ve "sonraki yarın
  sabah" doğru bulunur. Örnek (varsayılan saatlerle): 09:21 → `donem: null`, `uzatma.donem: 'sabah'`; 10:21 → uzatma bitti;
  17:00 → `donem: 'aksam'`, `sonraki` yarın sabah 07:00.
- **`aralikIcindeMi(okul, tarih, donem, anMs)`** — `anMs` o günün o dönem aralığında mı? Uçlarda 2 dakika pay var
  (`PAY_MS`): veritabanının saati (seferin başlangıcı, günün "başladı" anı) ile sunucunun saati arasındaki küçük fark yüzünden.
  `anMs` sayı değilse `false`.
- **`seferSuruyorMu(okul, sefer, simdi?)`** — sefer (`{ yon: 'gidis'|'donus', baslangic: ISO }`) hâlâ açık kalabilir mi?
  Sefer başladığı günün KENDİ dönem aralığında başladıysa (gidiş = sabah, dönüş = akşam; 2 dk paylı) o aralığın uzatması
  bitene kadar sürer. Aralığın dışında başlamış sefer (aralık sonradan değişti, ya da eski koddan kaldı) hiç sürmez.
  `baslangic` yoksa ya da bozuksa `false`.
- **`seferDonemi(yon)`** — `'gidis'` → `'sabah'`, başka her şey → `'aksam'`.
- **`donemYonu(donem)`** — `'sabah'` → `'gidis'`, başka her şey → `'donus'`.
- **`saatZarfi(liste)`** — birden çok okulun aralıklarını kapsayan en geniş aralık: en erken başlangıçlar, en geç bitişler.
  Çocukları farklı okullarda olan velinin telefonu için (bildirim yoklama sıklığı). Boş listede `null`. Her okul önce
  `saatleri`'nden geçer (bozuksa varsayılan). Zarfın kendisi `saatlerSorunu`'ndan geçmeyebilir (ör. bir okulun sabah bitişi
  ötekinin akşam başından sonra); telefon için yalnız sınır olarak kullanılır.

### Bildirim metni yardımcıları

- **`trSaat(ms)`** — anın Türkiye saati `'SS:DD'`: `trSaat(Date.parse('2026-09-28T04:42:10Z'))` → `'07:42'`.
- **`saatEki(hhmm)`** — saatten sonra gelen bulunma eki, saat okunduğu gibi çekimlenir: dakika sıfırsa saat, değilse dakikanın
  son sözcüğü. `"07:42'de"` (iki), `"08:05'te"` (beş), `"16:40'ta"` (kırk), `"17:10'da"` (on), `"16:00'da"` (on altı),
  `"20:00'de"` (yirmi), `"00:00'da"` (sıfır). Biçim bozuksa `"'de"`.
- **`ilkAd(adSoyad)`** — soyadını atar: "Zeynep Şahin" → "Zeynep", "Ali Rıza Kaya" → "Ali Rıza"; tek kelimeyse kendisi,
  boşsa `''`. Veliye giden servis bildirimlerinde (çocuğun tam adı yerine).

## Kimle konuşur?

- Çağırdığı: [hatirlatici-zaman.md](hatirlatici-zaman.md) — `an`, `trGun`, `gunEkle` (Türkiye saati).
- Onu çağıranlar:
  - [../bolumler/okul-hayati.md](../bolumler/okul-hayati.md) — neredeyse hepsi: yoklama ekranının penceresi
    (`servisPenceresi`), "Yoklama … arasında açılır" mesajı (`aralikMetni`), sefer başlatma (aralık dışında 409
    `aralikDisi: true`), açık seferlerin kapanması (`seferSuruyorMu`), "okula vardı" bildirimleri (`ilkAd`, `trSaat`,
    `saatEki`), yetkilinin saatleri kaydetmesi (`saatlerSorunu` + işlem kaydı `servis.saatler`). Ayrıca servis ekranının
    GET cevabındaki `saatler` alanı (`saatleri`), uzatmada işaret için "sefer kendi aralığında mı başladı?" denetimi
    (`aralikIcindeMi`) ve yön/dönem çevirisi (`seferDonemi`, `donemYonu`).
  - [../bolumler/cihaz.md](../bolumler/cihaz.md) — `saatZarfi`: telefonun servis bildirimi için öğrencinin/velinin çocuklarının
    okullarının (servis özelliği açık, onaylı okullar) zarfı.
  - `sunucu/veri/json-aktarim.js` — eski `data/db.json`'dan aktarılan okulun `servisSaatleri`'ni `saatlerSorunu` ile süzer
    (bozuksa almaz).
- Veritabanı tablosu kullanmaz; okulun saatleri okul satırında (`servisSaatleri`), seferler okul hayatı deposunda durur ve
  çağıran tarafından buraya verilir.

## Nasıl çalışır (adım adım)?

`servisPenceresi` bir anı şöyle sınıflar (varsayılan saatlerle bir gün):

```
00:00        07:00        09:21      10:21        16:30        19:01      20:01      24:00
  |  (dünün    |  SABAH     | uzatma   |              |  AKŞAM     | uzatma   |          |
  |  uzatması  |  donem     | (sabah)  |  aralık dışı |  donem     | (akşam)  | dışı     |
  |  olabilir) |            |          |              |            |          |          |
```

Her dönem için `donemAnlari` üç an hesaplar: `bas = an(tarih, bas)`, `bit = an(tarih, bit) + 1 dk` (bitiş dakikası dahil),
`uzatmaBit = bit + 60 dk`. Dün, bugün, yarın × sabah, akşam = 6 dönem sırayla denenir; ilk içine düşülen dönem `donem` olur,
uzatma içindeki dönem `uzatma`, başlangıcı henüz gelmemiş ilk dönem `sonraki`.

`seferSuruyorMu`: seferin başlangıç anından Türkiye günü ve yönünden dönem bulunur → başlangıç o dönemin aralığında mı (2 dk
paylı)? Değilse `false`. Öyleyse `simdi < uzatmaBit` mi?

## Dikkat!

- Sunucunun yerel saati hiç kullanılmaz; bütün anlar `+03:00` üzerinden (`hatirlatici-zaman.js`). Testte "07:00 Türkiye = 04:00
  UTC" ayrıca denenir.
- Sabah bitişi akşam başlangıcına EŞİT olabilir (`saatlerSorunu` yalnız `>`'ü reddeder). Ama bitiş dakikası dahil olduğu için o
  dakikada iki aralık üst üste gelir; `servisPenceresi` döngüde ilk bulduğunu (sabahı) seçer. Testlerdeki geniş aralık 11:59 /
  12:00 kullanır, bu çakışma denenmiyor.
- `seferSuruyorMu` aralık değişince eski seferleri kapatır: saatler ileri alınırsa önceki aralıkta açılmış sefer yeni aralıkta
  "sürmez". Bu kasıtlı (testte deneniyor).
- `saatleri` bozuk veride sessizce varsayılana döner; okul yanlış kaydedilmiş saat yüzünden hata görmez ama varsayılan saatlerle
  çalışır.
- `seferDonemi`/`donemYonu` bilinmeyen değeri akşam/dönüş sayar; çağıranlar yönü önceden `gidis`/`donus` diye doğrular.
- `saatEki` yalnız `SS:DD` için doğrudur; dakika 59'u, saat 23'ü geçmez varsayımıyla tablolar kısadır.

## Testleri

- `testler/test-servis-pencere.js` (sunucusuz, `tumtest.sh`'nin sunucusuz paket listesinde; 36 denetim) — varsayılanın
  geçerliliği, biçim/ters/kısa/çakışan/eksik aralığın reddi, 30 dakikalık aralığın kabulü, bozuk okulda varsayılan, aralık metni;
  07:00 başı, 09:20:59'un hâlâ sabah olması, 09:21 uzatma, 10:21'de uzatmanın bitmesi, 06:59, 17:00, 19:30, 23:30, gece 00:20
  (yeni günün sabahı, dünün akşamı uzatmada), günün her dakikasının geniş aralıkta bir döneme düşmesi; seferin uzatmada sürmesi ve
  kapanması, dünkü seferin bugün sürmemesi, gece yarısını geçen uzatma, aralık dışında ya da aralık değişince açılmış seferin
  sürmemesi, 2 dakikalık pay; zarf, boş zarf, `trSaat`, saat ekleri, `ilkAd`.
- Okul hayatı ve cihaz uçlarının sunuculu testleri (bkz. o bölümlerin belgeleri) bu kuralları uçtan dener.
- Elle: `node testler/test-servis-pencere.js`.

## Son durum

- Dosya `24050a2 commit 518` (2026-09-27, servis yoklaması + `/api/cihaz` + 30 gün uygulama oturumu) ile eklendi, o günden beri
  değişmedi.
- Açık iş yok. Sıradaki işlerden "Android yerel uygulama" telefonun bildirim sıklığında `saatZarfi`'nın sonucunu (cihaz ucu
  üzerinden) kullanmaya devam edecek; bu dosyayı değiştirmesi planlanmış değil.
