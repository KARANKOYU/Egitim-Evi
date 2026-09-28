# sunucu/bolumler/aile.js

Eğitim Evi Aile (`/api/aile`): öğrencinin telefonundaki uygulamanın gönderdiği konum ve ekran sürelerini alır, veliye
gösterir, velinin seçtiği gönderme sıklığını ve süre sınırlarını uygular, sınır aşılınca veliye haber verir.

## Bu dosya ne yapar?

Android uygulaması (ayrı depo, `Egitim-Evi-App`) öğrencinin telefonunda "Aile" modunda çalışınca, telefonun konumunu ve
uygulama kullanım sürelerini belli aralıklarla sunucuya gönderir. Veli sitenin "Aile" sayfasında çocuğunun son
konumlarını, bugünkü ve haftalık ekran sürelerini görür; konumun Wi-Fi'de ve mobil veride kaç dakikada bir
gönderileceğini, konum ve kullanım paylaşımının açık olup olmadığını, günlük toplam ve uygulama başına süre sınırlarını
seçer. Sınır aşılınca veliye günde bir kez bildirim gider; uygulama KAPATILMAZ (dosya başı yorumu).

Mahremiyet kuralları kodda: okul (müdür, öğretmen) bu verileri görmez — yalnız çocuğa veli bağıyla bağlı hesap görür;
konum ve kullanım 7 gün sonra silinir; telefon ancak öğrencinin KENDİ hesabıyla ve açık onayıyla (`onay: true`) bağlanır;
her bağlama ve bağlantı kaldırma veliye bildirilir.

Telefon oturumla değil, yalnız bu uçlara yarayan 64 haneli bir **cihaz anahtarıyla** (`X-Aile-Cihaz` başlığı) konuşur;
anahtar hesaba giriş vermez, sunucuda yalnız SHA-256 özeti tutulur.

## İçinde neler var?

### Sabitler

- `ARALIKLAR` — `[1, 5, 10, 15, 30, 60]` dakika: Wi-Fi ve mobil gönderme aralığı seçenekleri (varsayılan Wi-Fi 5, mobil
  15; `depo.aile.ayar`).
- `EN_FAZLA_KONUM` — 500 (bir istekte işlenen konum). `EN_FAZLA_UYGULAMA` — 300 (bir günde işlenen uygulama).
  `EN_FAZLA_SINIR` — 50 (uygulama sınırı sayısı).
- `PAKET` — Android paket adı biçimi `^[A-Za-z0-9._-]{1,200}$`.
- `YEDI_GUN_MS` — 7 gün; konumun zaman damgası bundan eski olamaz.

### Dışa açılan işlevler

- `uclar(k)` — öğrencinin ve velinin oturumlu uçları.
- `cihazUclari(k)` — telefonun anahtarlı uçları; `api.js` bunları gövde okunduktan sonra, oturum kapılarından
  (aydınlatma, şifre, rolsüz, özellik) GEÇİRMEDEN çağırır: `p === 'aile' && segs[2] === 'cihaz' && segs[3]`.

### İç işlevler

- `ozet(anahtar)` — anahtarın SHA-256 özeti (veritabanında yalnız bu durur).
- `bugun()` — Türkiye saatine göre bugünün `YYYY-AA-GG`'si (`yardimci/hatirlatici-zaman.js` → `trGun`).
- `uygulamaAdi(ad, paket)` — denetim ve yön değiştirme (bidi) karakterlerini atar, 100 harf; boşsa paket adı.
- `sureYaz(dk)` — "2 sa 40 dk", "45 dk".
- `velilerineBildir(ogrenci, metin)` — öğrencinin onaylı velilerine `#/aile?c=<öğrenci>` bağlantılı bildirim.
- `sinirlariDenetle(ogrenci, ayar)` — bugünün süreleri toplam sınırı ya da bir uygulamanın sınırını geçtiyse velilere
  "Ayşe Yılmaz bugün telefonda toplam 2 sa 40 dk geçirdi (sınır 2 sa)." / "… YouTube uygulamasında …" bildirimi; her
  anahtar (`toplam` ya da paket adı) için günde BİR kez (`depo.aile.uyariIlkMi`).

### Telefonun uçları (`X-Aile-Cihaz: <64 onaltılık>`)

Önce anahtar: biçimsiz ya da tanınmayan anahtar 401 "Cihaz tanınmadı. Uygulamadan yeniden bağlan.". Cihaz başına saatte
240 istek (429 "Çok sık istek geldi. Biraz sonra dene."). Öğrenci silinmiş, öğrenci değil ya da onaylı değilse cihaz
kaydı silinir, 401 "Hesap artık kullanılamıyor.". Her istekte cihazın "son görülme" zamanı yazılır.

- **`GET /api/aile/cihaz/ayar`** → `{ ayar: { wifiDk, mobilDk, konumAcik, kullanimAcik } }` (uygulama sıklığı buradan
  öğrenir).
- **`POST /api/aile/cihaz/konum`** — gövde `{ konumlar: [{ enlem, boylam, dogruluk, zaman, ag, pil }] }`, ilk 500.
  Veli konumu kapattıysa `{ alinan: 0, kapali: true }`. Geçersiz enlem/boylam, 7 günden eski ya da 5 dakikadan ileri
  zaman atılır; `dogruluk` 0–100000'e kırpılır, `pil` 0–100 tam sayı değilse `null`, `ag` `wifi|mobil` değilse `''`.
  Aynı zaman damgası ikinci kez yazılmaz. Cevap `{ alinan }`.
- **`POST /api/aile/cihaz/kullanim`** — gövde `{ gunler: [{ gun, uygulamalar: [{ paket, ad, dakika }] }] }`, en çok 8 gün.
  Veli kullanımı kapattıysa `{ kapali: true }`. Son 7 gün ile bugün dışındaki günler, bozuk paket adı, aynı günde tekrar
  eden paket, 0–1440 dışındaki ya da tam sayı olmayan dakika atılır. Satırlar (öğrenci, gün, paket) başına üzerine
  yazılır; sonra `sinirlariDenetle`. Cevap `{ alinan }`.
- **`POST /api/aile/cihaz/sil`** — telefon kendi bağlantısını kaldırır; velilere "<ad> telefonunun (<cihaz>) Eğitim Evi
  Aile bağlantısını kaldırdı." Cevap `{ message: 'Bağlantı kaldırıldı.' }`.
- Başka her yol/yöntem 404 "Böyle bir adres yok".

### Oturumlu uçlar (`uclar`)

Önce `need(null)` (girişsiz 401, onaysız 403). `aile` `ROLSUZ_SERBEST`'te olmadığı için rolsüz yetişkin hesabı
`api.js`'te 403 `rolsuz` alır; ama çocuğu olan veli hesabı rol taşır.

- **`POST /api/aile/cihaz`** — öğrenci telefonunu bağlar. Öğrenci değilse 403 "Telefonu çocuğun kendi öğrenci hesabıyla
  bağla."; `onay` tam `true` değilse 400 "Paylaşımı kabul etmeden bağlanamaz."; öğrenci başına saatte 10 bağlama (429).
  32 bayt rastgele anahtar üretilir, yalnız özeti saklanır; cihaz `{ id: 'ac…', ad (80, varsayılan "Telefon"),
  platform (varsayılan android), surum }`. Öğrenci başına en çok 3 cihaz tutulur (`depo.aile.cihazEkle`): 4. telefon
  bağlanınca en eski cihaz kaydı uyarısız silinir ve onun anahtarı artık 401 alır. Velilere "<ad> telefonunu (<cihaz>)
  Eğitim Evi Aile'ye bağladı. Konum ve ekran süresi Aile sayfasında." Cevap `{ cihazAnahtari, cihazId, ogrenci: { ad },
  ayar }` — anahtar YALNIZ burada, bir kez gösterilir.

Bundan sonrası yalnız çocuğa bağlı veli: `studentId` (ozet'te sorguda, ötekilerde gövdede) bir öğrenci olmalı, bakan
öğrenci olmamalı ve `depo.kullanicilar.bagliMi` doğru olmalı; değilse 403 "Bu öğrencinin velisi değilsin". Veli bağı
rolden bağımsızdır (kendi çocuğunun velisi olan öğretmen de görür), ama okulun personeli olmak tek başına yetmez.

- **`GET /api/aile/ozet?studentId=`** → `{ ogrenci: { id, ad }, cihazlar, ayar, sinirlar, saklamaGun (7), sonKonum,
  konumlar (son 30, yeniden eskiye), kullanim: { bugun: [{ gun, paket, ad, dakika }] (büyükten küçüğe), gunler: [{ gun,
  toplam }] (son 8 gün, bugün dahil), hafta: [{ paket, ad, dakika }] (8 günün toplamı, ilk 30) } }`.
- **`POST /api/aile/ayar`** — gövde `{ studentId, wifiDk, mobilDk, konumAcik, kullanimAcik, toplamSinir, sinirlar:
  [{ paket, ad, dakika }] }`. Aralıklar `ARALIKLAR`'da değilse 400 "Aralık 1, 5, 10, 15, 30 ya da 60 dakika olabilir";
  `toplamSinir` `null`/boş (sınır yok) ya da 5–1440 tam sayı (400 "Günlük toplam sınır 5 dakika ile 24 saat arasında
  olmalı"); en çok 50 uygulama sınırı; paket biçimi bozuksa 400 "Uygulama geçersiz"; sınır 5–1440 (400). `konumAcik`
  ve `kullanimAcik` yalnız `false` gelirse kapanır. Ayar ve sınırlar tek işlemde yazılır (sınırlar bütünüyle yenilenir).
  Cevap `{ ayar, sinirlar, message: 'Kaydedildi.' }`.
- **`POST /api/aile/cihaz-kaldir`** — gövde `{ studentId, cihazId }`; cihaz o öğrencinin değilse 404 "Cihaz bulunamadı".
  Cevap `{ message: 'Telefonun bağlantısı kaldırıldı.' }` (bu yolda bildirim gitmez).
- Başka her yol 404 "Böyle bir adres yok" — ama veli denetimi yoldan ÖNCE yapıldığı için, geçerli bir `studentId`
  (ve veli bağı) olmadan gelen bilinmeyen yol ya da yanlış yöntem (ör. `GET /api/aile/cihaz`) 403 "Bu öğrencinin velisi
  değilsin" alır.

## Kimle konuşur?

- Çağırdıkları: `crypto`; `../http` (`bad`, `ok`); `../guvenlik` (`hizSinir`); `../ortak` (`clean`, `uid`); `../veri`
  (`depo`, `topluBildir`); `sunucu/yardimci/hatirlatici-zaman.js` (`trGun`, `gunEkle`).
- Depo ve tablolar: `depo.aile` (`sunucu/veri/depo/aile.js`, şema 026) → `aile_cihazlari` (`cihazEkle` — öğrenci başına
  en çok 3 cihaz bırakır, `cihazOzetle`,
  `cihazGoruldu`, `cihazSil`, `cihazlari`), `aile_ayarlari` (`ayar`, `ayarYaz`), `aile_sinirlari` (`sinirlari`),
  `aile_konumlari` (`konumEkle`, `sonKonumlar`), `aile_kullanim` (`kullanimYaz`, `kullanimlari`), `aile_uyarilari`
  (`uyariIlkMi`); `SAKLAMA_GUN`. `depo.kullanicilar` → `bul`, `bagliMi`, `veliHaritasi`. Bildirimler → `bildirimler`.
- Onu çağıranlar: `sunucu/api.js` (`BOLUM.aile` → `uclar`; anahtarlı yollar → `cihazUclari`); 7 günlük temizliği
  (`depo.aile.temizle`) `sunucu/index.js` saatte bir çalıştırır.
- Ön yüz: `public/js/parcalar/27b-aile.js` (velinin Aile sayfası: `ozet`, `ayar`, `cihaz-kaldir`).
- Android: `org/egitimevi/aile/AileEkrani.java` (`POST /api/aile/cihaz` öğrencinin oturumuyla, `/api/aile/cihaz/sil`),
  `IzlemeServisi.java` (`/api/aile/cihaz/konum`, `/kullanim`, `/ayar`).

## Nasıl çalışır (adım adım)?

```
Öğrencinin telefonu:
  (oturumla) POST /api/aile/cihaz {onay:true} ─> anahtar (bir kez) ─> velilere "bağladı"
  (anahtarla, döngüde)
     GET  /cihaz/ayar      ─> aralıklar, açık/kapalı
     POST /cihaz/konum     ─> süz ─> aile_konumlari (aynı zaman bir kez)
     POST /cihaz/kullanim  ─> süz ─> aile_kullanim (gün+paket üzerine yaz) ─> sinirlariDenetle
                                                           └─ aşım ─> velilere günde bir kez
Veli (sitede):  GET ozet ─> konumlar + süreler      POST ayar ─> aralık/sınırlar
Temizlik: index.js saatte bir ─> 7 günden eski konum/kullanım/uyarı silinir
```

## Dikkat!

- **Anahtar yalnız özetiyle saklanır** ve yalnız bu uçlara yarar: oturum yerine geçmez, telefon uygulamasının öteki
  anahtarlı uçlarında (`/api/cihaz/...`, [cihaz.md](cihaz.md)) da geçmez (testler bunu ayrıca dener).
- **Okul görmez.** Özet ve ayar yalnız `bagliMi` ile açılır; müdür ve öğretmen 403 alır (test). Bu, KVKK ve aile
  mahremiyeti için bilinçli.
- Hesap kapanınca (silinmiş, onayı kalkmış) telefonun ilk isteği cihaz kaydını siler; uygulama "yeniden bağlan" ister.
- Gövde süzgeci (`ortak.govdeTemizle`) dizileri zaten 500 ögede keser (kod yorumu); uygulama konumları 500'erli gönderir.
- `cihaz-kaldir` (veli) bildirim göndermez, `cihaz/sil` (telefon) velilere bildirir.
- Sınır uyarısının günlük tekliği `aile_uyarilari`'ndaki `(öğrenci, gün, anahtar)` satırıyla sağlanır; toplam sınırın
  anahtarı düz `'toplam'` metnidir (paket adları noktalı olduğundan çakışmaz).
- `bugun()` Türkiye saatine göredir (`trGun`), sunucunun saat diliminden bağımsız.
- Uygulama adları düz metin saklanır; ön yüz kaçışla basar (test).
- Aile uçları okulun "özellik" kapısına bağlı değildir (`ozellikler.js` listesinde `aile` yok): okul bölümleri kapatsa da
  aile bağı çalışır.

## Testleri

- `testler/test-aile.js` — bağlama (onaysız olmaz, veli kendi hesabıyla bağlayamaz, 64 haneli anahtar, veliye
  bildirim), anahtarın oturum yerine ve telefon uygulamasının uçlarında geçmemesi, anahtarsız/yanlış/biçimsiz 401,
  konum süzgeci (geçerli olanlar, aynı zaman bir kez, 500 sınırı), kullanım süzgeci, velinin özeti (son konum, bugünün
  süreleri, 8 günlük çizelge), bağlı olmayan veli / müdür / öğretmen / öğrencinin kendisi 403, ayar doğrulamaları, telefonun
  yeni aralığı alması, toplam ve uygulama sınırı bildirimleri (günde bir kez, Aile sayfasına götürür), konum kapalıyken
  alınmaması, bağlantı kaldırma (veli ve telefon), kaldırılan anahtarın 401 olması.
- `testler/test-servis-yoklama.js` — telefon uygulamasının (`/api/cihaz`) anahtarı Aile uçlarında geçmez.
- Elle: öğrenci hesabıyla (`testler/seed.js`) `POST /api/aile/cihaz` `{ "onay": true, "ad": "Deneme" }`; dönen anahtarla
  `curl -H "X-Aile-Cihaz: <anahtar>" http://localhost:3200/api/aile/cihaz/ayar`.

## Son durum

- Son commit `c1d27a2 commit 462` (2026-09-26): `module.exports` eklendi (aynı commit velinin Aile sayfasını,
  `27b-aile.js`'i getirdi).
- `833e7b4 commit 461` (2026-09-26): dosyanın ilk hâli (231 satır; depo tarafına 4 satır).
- Açık iş yok. Sıradaki planlı değişiklik: "Android yerel uygulama (bütün roller)…" işi uygulama tarafını genişletecek;
  sunucu uçlarında değişiklik yazılı değil.
