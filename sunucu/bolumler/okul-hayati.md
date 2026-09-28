# sunucu/bolumler/okul-hayati.js

Okulun gündelik hayatı: yemek listesi (`/api/yemek`), servisler ve servis yoklaması, canlı servis konumu (`/api/servis`),
kulüpler (`/api/kulupler`).

## Bu dosya ne yapar?

Bir okulda derslerin dışında da dönen işler var: bu hafta yemekte ne var, çocuğum hangi serviste, servis şu an nerede,
bindi mi, hangi kulüplere üye. Bu dosya bu üç konunun bütün `/api` uçlarını tek yerde toplar.

- **Yemek listesi**: okuldaki herkes haftalık menüyü görür; veli (ve çocuğu olan öğretmen) çocuğunun okulunun menüsünü de
  görür. Müdür ya da `yemek.yonet` yetkili öğretmen bir seferde 1–31 günü yazar.
- **Servis**: yönetim (müdür ya da `servis.yonet` yetkilisi) servisleri açar, servisçi hesabını atar, öğrencileri servise
  yazar ve okulun servis saatlerini seçer. Öğrenci kendi servisini, veli yalnız çocuğunun servisini (şoför telefonu dahil)
  görür. Servisçi (şoför hesabı, rolü `servisci`) telefondan ya da tarayıcıdan yoklama alır (sabah bindi/binmedi, akşam
  geldi/gelmedi/indi), seferi başlatır, konum gönderir, alma/bırakma sırasını düzenler, not yazar. Veli "binmeyecek"
  işareti koyar. Araç eve 500 m ve 100 m yaklaşınca öğrenciye ve velisine bildirim gider.
- **Kulüpler**: yönetim (müdür ya da `kulup.yonet` yetkilisi) kulüp açar, danışman öğretmen ve kontenjan belirler; öğrenci
  başvurusu açık kulübe kendisi katılır ya da ayrılır; üye listesini yalnız yönetim ve kulübün danışmanı görür.

Dosyanın en uzun ve en ince kısmı servis: saat aralıkları, sefer, yoklama ve bildirimlerin "bir kez" gitmesi birbirine
bağlı. Aşağıda adım adım anlattım.

## İçinde neler var?

### Kim girebilir (bütün uçlar için)

`uclar(k)` yalnız yolun ilk parçası `yemek`, `servis` ya da `kulupler` ise çalışır, yoksa `false` döner. Sonra `need(...)`:

- `yemek` ve `kulupler`: `student`, `parent`, `teacher`, `principal`;
- `servis`: bunlara ek olarak `servisci`.

Oturum yoksa 401, rol listede yoksa 403 "Bu işlem için yetkin yok" (bkz. [api.md](../api.md)). Okul bu bölümü
kapattıysa istek buraya hiç gelmez: [ozellikler.md](ozellikler.md)'deki `YOL` tablosu `yemek → yemek`, `servis → servis`,
`kulupler → kulup` eşler ve `api.js` 403 `ozellikKapali` döner. Rolsüz yetişkin hesabı da `api.js`'in rolsüz kapısında
403 `rolsuz` alır.

Yetki denetimi `yetkiVarMi(me, izin)` ile (`sunucu/yetki.js`): müdür (ve sistem yöneticisi, ama o bu uçlara `need` yüzünden
zaten giremez) her zaman geçer; öteki roller yalnız rollerinde o izin varsa. Hesap onaylı değilse (`status !== 'approved'`)
izin yok sayılır. Uçlar ayrıca rol süzer: yemek ve servis yönetiminde veli (servis yönetiminde öğrenci de), kulüp
yönetiminde öğretmen/müdür dışındaki herkes izin olsa bile dışarıda kalır.

### Sabitler

- `KONUM_TAZE_MS` — 3 dakika. Aracın son konumu bundan eskiyse haritada gösterilmez.
- `YAKLASMA_ESIKLERI` — `[500, 100]` metre; her seferde öğrenci başına her eşik için bir bildirim.
- `EN_KOTU_DOGRULUK` — 150 metre; GPS doğruluğu bundan kötüyse (ya da hiç gelmediyse) yaklaşma bildirimi denenmez.
- `DURUMLAR` — `{ sabah: ['bindi', 'binmedi'], aksam: ['geldi', 'gelmedi', 'indi'] }`.
- `ILERI_GUN` — 7: servisçi notu ve velinin "binmeyecek" işareti en çok 7 gün sonrası için.
- `SAKLAMA_GUN` — 30: yoklama, bildirim işaretleri, notlar ve "binmeyecek" işaretleri 30 gün sonra silinir.
- `TARIH` (`YYYY-AA-GG` düzenli ifadesi), `GUN_MS`, `AYLAR` (bildirim metinlerinde "28 Eylül" yazmak için).

### Yemek listesi uçları

- **`GET /api/yemek?bas=YYYY-AA-GG`** — `bas` verilen günün haftasının pazartesisine yuvarlanır (`haftaBasi`), boşsa bu hafta.
  Kişinin kendi okulu (veli değilse) ve çocuklarının okulları (aynı okul bir kez) toplanır. Cevap:
  `{ bas, bit, okullar: [{ id, ad, gunler: [{ tarih, menu, kalori }] }], duzenleyebilir }`. `bit` = `bas` + 6 gün.
  `duzenleyebilir` yalnız okulu olan, veli olmayan ve `yemek.yonet` yetkilisi için `true`.
- **`POST /api/yemek`** — gövde `{ gunler: [{ tarih, menu, kalori }] }`. Okulu olmayan, veli ya da yetkisiz kişiye 403
  "Yemek listesini düzenleme yetkin yok". Kurallar: 1–31 gün ("Bir seferde 1-31 gün kaydedilebilir"); tarih geçerli olmalı
  ("Geçersiz tarih") ve bugünden 60 gün önce ile 400 gün sonra arasında ("Tarih bu yılın dışında"); aynı tarih ikinci kez
  gelirse atlanır; menü satır satır kırpılır (satır başına 120, en çok 8 satır, boş satırlar atılır, toplam 500'ü geçerse
  "Bir günün menüsü çok uzun"); kalori 1–5000 değilse boş. Boş menü o günü siler (`depo.okulHayati.yemekYaz`). İşlem
  kaydına `yemek.kaydedildi` yazılır. Cevap `{ message: 'Yemek listesi kaydedildi.' }`.

### Servis uçları

`yonetir` = okulu var, veli ya da öğrenci değil ve `servis.yonet` yetkisi var (müdür dahil).

**Herkesin gördükleri**

- **`GET /api/servis`** — cevap `{ yonetir, benim, cocuklar, saatler?, servisler?, okulOgrencileri?, saatDuzenleyebilir? }`:
  - `saatler` — okulun servis saatleri (`sabahBas`, `sabahBit`, `aksamBas`, `aksamBit`), veli dışında okulu olan herkese;
  - `benim` — öğrencinin kendi servisi: `{ ad, plaka, sofor, soforTel, rehber, rehberTel, sabah, aksam, guzergah, durak,
    bugun }`; servisi yoksa `null`. Şoför adı/telefonu serviste yazılı değilse atanmış servisçi hesabınınki gelir;
  - `cocuklar` — velinin (ya da çocuğu olan öğretmenin) her çocuğu: `{ id, ad, servis, bugun }`; `bugun` içinde
    `binmeyecekDuzenleyebilir: true`. Çocuğun okulunda servis kapalıysa o çocuğun `servis`i `null` gelir;
  - `bugun` (`ogrenciBugunu`) — `{ canli, donem, tarih, saatler, aralik, sonraki, seferVar, durum, bindiSaat, indiSaat,
    vardiSaat, seferBasladi, seferBitti, sira, toplam, onunde, binmeyecekBugun, notlar, binmeyecek }`. Notlar ve
    "binmeyecek" işaretleri her zaman; durum, sıra ve `onunde` ("önünde N öğrenci") yalnız servis saatinde ya da sefer
    sürerken dolar;
  - yönetime ek olarak `servisler` (her servis öğrencileri, durakları ve sabah/akşam sıralarıyla, `soforId`, `soforAdi`,
    `ogrenciSayisi`), `okulOgrencileri` (seçim listesi: `{ id, ad, sinif }`) ve `saatDuzenleyebilir: true`.
- **`GET /api/servis/harita?ogrenci=<id>`** — öğrenci için kendi kimliği kullanılır. Yetki `haritaYetkisi` ile: öğrencinin
  kendisi, bağlı velisi (öğrenci olmayan ve `bagliMi`), aynı okulun `servis.yonet` yetkili öğretmeni/müdürü, ya da o
  öğrencinin servisinin servisçisi (ev konumunu görür ama değiştiremez). Değilse 403 "Bu haritayı görme yetkin yok".
  Cevap `{ ogrenci, okul: { ad, enlem, boylam }, ev: { enlem, boylam } | null, servis, sefer, bugun, evDuzenleyebilir }`.
  `sefer` yalnız sefer sürerken dolar; `sefer.konum` yalnız son konum 3 dakikadan tazeyse ve seferin servisçisi varsa.
- **`POST /api/servis/ev`** — ev konumu. Gövde `{ ogrenciId?, enlem, boylam }` ya da silmek için `{ ogrenciId?, sil: true }`.
  Hız sınırı: kişi başına saatte 30 (429 "Çok sık değiştirdin..."). Yetki `haritaYetkisi` + `evDuzenle` (servisçi
  değiştiremez; 403). Koordinat `koordinatAl` ile: sayı ya da sayı yazılmış metin, |enlem| ≤ 90, |boylam| ≤ 180, (0,0)
  kabul edilmez, 6 haneye yuvarlanır; anlaşılmazsa 400 "Konum anlaşılmadı. Haritada evin olduğu yere dokun."

**Servisçinin uçları** (rol `servisci`; servis ona atanmış olmalı — `servisimAl`: değilse 403 "Bu işi servisin
servisçisi yapar" ya da "Bu servis sana atanmamış")

- **`GET /api/servis/yoklama?servisId=`** — servisçi kendi servislerinden birini (verilmezse ilkini), yönetim (`yonetir`)
  okulun herhangi bir servisini salt okunur görür; ötekilere 403. Bilinmeyen `servisId` 404. Servisi olmayan servisçiye
  boş liste ve "Sana henüz bir servis atanmadı..." engeli (`bosYoklama`). Cevap (`yoklamaCevabi`): `{ tarih, donem,
  listeDonemi, aralikta, uzatma, acik, engel, duzenleyebilir, saatler, aralik, sonraki, servisler, servis, okul, sefer,
  gun: { basladi, basladiSaat, bitti, bittiSaat }, sayilar: { toplam, bekleyen, binmeyecek, <durum>: n }, ogrenciler:
  [{ id, ad, sinif, durak, sira, siraSabah, siraAksam, ev, durum, bindiSaat, indiSaat, binmeyecek, veliIsareti }], notlar,
  binmeyecekler }`. Saat aralığı dışındaysa liste bir sonraki aralığın sırası ve işaretleriyle gelir (servisçi yarının
  "binmeyecek"lerini görür).
- **`POST /api/servis/yoklama`** — gövde `{ servisId, ogrenciId, durum, donem? }`. Dönemi sunucunun saati belirler.
  Hatalar: öğrenci bu serviste değil 404; aralık dışı ya da dönem bitti 409 `{ error, aralikDisi, kapandi }`; istemcinin
  gönderdiği `donem` sunucununkiyle uyuşmazsa 409 `{ donemDegisti: true, donem }` ("Yoklamanın dönemi değişti; sayfayı
  yenile."); dönemde olmayan durum 400; `indi` sefer başlamadan 409 `{ baslamadi: true }`; `indi` yalnız "Geldi"
  işaretli öğrenciye (409); "indi" işaretli öğrencinin durumu artık değişmez (409). Cevap `{ message, bitti, sefer,
  yoklama }` (`sefer` bu işaretle yeni sefer açıldıysa `{ id, yon }`, `yoklama` yenilenmiş ekran).
- **`POST /api/servis/okula-vardik`** — gövde `{ servisId }`. Yalnız sabah döneminde (ya da sabahın 60 dakikalık
  uzatmasında, aralıkta başlamış seferde); değilse 409 `{ aralikDisi: true }`. Günü "bitti" yapar, açık seferi kapatır;
  ilk kez bittiyse "Bindi" işaretli öğrencilerin velilerine "… okula vardı." gider. Cevap `{ message, bildirilen, yoklama }`;
  ikinci basışta "Okula varış zaten kaydedildi."
- **`POST /api/servis/sira`** — gövde `{ servisId, donem: 'sabah'|'aksam', sira: [ogrenciId, ...] }`. Liste servisin
  öğrencileriyle birebir aynı olmalı (eksik, fazla, tekrar yok); değilse 400. Cevap `{ message, donem, sira }`.
- **`POST /api/servis/not`** — gövde `{ servisId, ogrenciId?, tarih?, metin }`. Hız sınırı: servisçi başına saatte 60 (429).
  `ogrenciId` boşsa bütün servise. Tarih bugün ile 7 gün sonrası arası (boşsa bugün); metin tek satıra indirilir, en çok 200.
  Velilere "Servisçiden not: …" bildirimi gider; kardeşlerin velisi tek bildirim alır. Cevap `{ not, message }`.
- **`POST /api/servis/not-sil`** — gövde `{ id }`. Yalnız notun yazıldığı servisin şu anki servisçisi; değilse 404 "Not
  bulunamadı" (servisçi olmayana 403).
- **`GET /api/servis/seferim`** — servisçinin servisleri, öğrencileri (ad, sınıf, durak, ev konumu) ve süren seferi:
  `{ servisler: [{ id, ad, plaka, sabah, aksam, ogrenciler, sefer }], okul }`.
- **`POST /api/servis/sefer-basla`** — gövde `{ servisId }`. Yalnız servis saatinde; değilse 409 `{ aralikDisi, sonraki }`
  ("Sefer yalnız servis saatlerinde başlar: …"). Dönem bitmişse 409 `{ kapandi: true }`. Süren sefer varsa o döner ("Sefer
  zaten sürüyor."). Akşam cevabı ayrıca `bekleyen` (henüz işaretsiz) ve `serviste` ("Geldi" sayısı) içerir; serviste kimse
  yoksa mesaja "sefer kendiliğinden bitmez" uyarısı eklenir.
- **`POST /api/servis/konum`** — gövde `{ seferId, enlem, boylam, dogruluk }`. Hız sınırı: servisçi başına dakikada 60
  (429 "Konum çok sık gönderiliyor."). İşi `seferKonumuYaz` yapar. Bu uç "sefer bulunamadı"yı da 409'a çevirir (tarayıcı
  sayfası 409'da göndermeyi durdurur).
- **`POST /api/servis/sefer-bitir`** — gövde `{ seferId }`. Yalnız seferin kendi servisçisi kapatabilir (depo sorgusu
  `sofor_id` ile süzer). Cevap "Sefer bitti; konumun artık paylaşılmıyor." ya da "Sefer zaten bitmiş.".

**Velinin ucu**

- **`POST /api/servis/binmeyecek`** — gövde `{ ogrenciId, tarih?, sabah: bool, aksam: bool, not? }`. Öğrenciye 403
  ("işareti velin koyar"); bağlı veli değilse 403. Hız sınırı: kişi başına saatte 60. Öğrencinin servisi yoksa 404. Tarih
  bugün ile 7 gün sonrası arası. O dönemin yoklaması alındıysa o dönemin işareti değiştirilemez (409). İkisi de `false`
  ise işaret kalkar (satır silinir). Bir şey değiştiyse servisçiye bildirim gider ("Ayşe Yılmaz yarın sabah servise
  binmeyecek. Velinin notu: …" ya da "… işareti kaldırıldı."). Cevap `{ binmeyecek: { tarih, sabah, aksam, not } | null,
  message }`.

**Yönetimin uçları** (`yonetir` değilse bütün POST'lar 403 "Servisleri düzenleme yetkin yok")

- **`POST /api/servis/saatler`** — gövde `{ sabahBas, sabahBit, aksamBas, aksamBit }` ("07:30"). `saatDuzelt` ile
  düzeltilir, `pencere.saatlerSorunu` denetler (biçim, bitiş başlangıçtan sonra, her aralık en az 30 dakika, sabah akşamdan
  önce biter). Kaydeder, işlem kaydına `servis.saatler` yazar ve hemen `servisTemizle()` çalıştırır (yeni aralığın dışında
  kalan seferler kapansın). Cevap `{ saatler, message }`.
- **`POST /api/servis/kaydet`** — gövde `{ id?, ad, plaka, sofor, soforTel, rehber, rehberTel, sabah, aksam, guzergah,
  soforId? }`. `id` varsa bu okulun servisi olmalı (404). Ad zorunlu (60), okulda tekil. Plaka büyük harfe çevrilir,
  `^[0-9A-ZÇĞİÖŞÜ ]{4,15}$` olmalı. Telefonlar isteğe bağlı ama yazıldıysa geçerli (`telefonSorunu`), `normTelefon` ile
  saklanır. Saatler "07:30" biçiminde. `soforId` gövdede HİÇ yoksa servisçi ataması değişmez; boşsa kaldırılır; doluysa bu
  okulun `servisci` rolündeki hesabı olmalı. Cevap `{ id, message }`.
- **`POST /api/servis/sil`** — `{ id }`; öğrencilerin servis kaydı da kalkar (veritabanı zinciri). Başka okulun servisi 404.
- **`POST /api/servis/ogrenci`** — `{ servisId, ogrenciId, durak }`. Öğrenci başka servisteyse taşınır; yeni gelen sıranın
  sonuna eklenir, aynı serviste kalıyorsa sırası korunur. Servis ya da öğrenci bu okulda değilse 404.
- **`POST /api/servis/ogrenci-cikar`** — `{ ogrenciId }`; bu okulun bir servisinde değilse 404.

### Kulüp uçları

`yonetir` = okulu var, öğretmen ya da müdür ve `kulup.yonet` yetkisi var. `kulupAl(id)` kulübü yalnız kendi okulundaysa ve
kişi veli değilse verir (veliye her kulüp "bulunamadı"dır). `uyeleriGorur(u)` = yönetim ya da kulübün danışmanı.

- **`GET /api/kulupler`** — `{ yonetir, kulupler, cocuklar, ogretmenler? }`. `kulupler` (veli dışında okulu olan herkese):
  `{ id, ad, aciklama, danismanId, danisman, kontenjan, uyeSayisi, basvuruAcik, gunSaat, uyesin, uyeleriGorur }`.
  `cocuklar`: veli çocuklarının üye olduğu kulüpler (`{ ad, kulupler: [{ ad, gunSaat, danisman }] }`). `ogretmenler`
  yalnız yönetime (danışman seçimi için).
- **`GET /api/kulupler/uyeler?id=`** — üye listesi `{ kulup, uyeler: [{ id, ad, sinif, tarih }], adaylar }`. Kulüp
  yoksa 404, yönetim ya da danışman değilse 403.
- **`POST /api/kulupler/katil`**, **`POST /api/kulupler/ayril`** — `{ id }`, yalnız öğrenci kendisi (öteki rollere 403
  "Kulübe öğrenci kendisi katılır"). Başvuru kapalıyken ne katılabilir ne ayrılabilir. Hatalar: "Zaten bu kulübün
  üyesisin", "Kulübün kontenjanı dolu", "Bu kulübe başvuru kapalı", ayrılmada "Kulüp değişikliği kapalı; danışman
  öğretmenine başvur."
- **`POST /api/kulupler/uye-ekle`**, **`POST /api/kulupler/uye-cikar`** — `{ id, ogrenciId }`, yönetim ya da danışman.
  Başvuru kapalı olsa da ekler; kontenjanı aşamaz.
- **`POST /api/kulupler/kaydet`** — yalnız yönetim. `{ id?, ad, aciklama, danismanId, kontenjan, basvuruAcik, gunSaat }`.
  Ad zorunlu (80) ve okulda tekil; danışman bu okulun onaylı öğretmeni ya da müdürü olmalı; kontenjan 0 (sınırsız) ile 1000
  arası; `basvuruAcik` yalnız açıkça `false` gelirse kapalı. Cevap `{ id, message }`.
- **`POST /api/kulupler/sil`** — yalnız yönetim, `{ id }`.

### Dışa açılan işlevler

- `uclar(k)` — yukarıdaki bütün uçlar.
- `seferKonumuYaz(sofor, body)` — servisçinin konumunu yazar. Dönen `{ durum: 200 }` ya da `{ durum, hata }`: koordinat
  anlaşılmadı 400, sefer yok 404, sefer bitmiş ya da başkasının 409, servis saati (ve 60 dakikalık uzatma) bittiyse seferi
  kapatır ve 409 "Servis saati bitti; sefer kapandı.". `dogruluk` 0–100000 arasına kırpılır; 150 m ya da daha iyiyse
  `yaklasmaBildir` çalışır. Hem `/api/servis/konum` hem telefonun `/api/cihaz/servis-konum` ucu bunu kullanır.
- `surenSefer(servisId, okul)` — servisin açık ve saat bakımından hâlâ süren seferi ya da `null`.
- `servisTemizle()` — arka iş: 45 dakikadır konum gelmeyen ya da servisçisi olmayan açık seferleri kapatır, 30 günden eski
  seferleri siler (`depo.okulHayati.seferTemizle`); saat aralığı ve 60 dakikalık uzatması biten açık seferleri kapatır;
  30 günü geçen yoklama, olay, not ve "binmeyecek" kayıtlarını siler; bellekteki yaklaşma listesini boşaltır. Kapatılan
  sefer sayısını döner.
- `haftaBasi(gun)` — `YYYY-AA-GG` gününün haftasının pazartesisi (bozuk ya da boşsa bugünün haftası).
- `onbellekSil(servisId?)` — yaklaşma listesi önbelleğinden bir servisi ya da hepsini siler.

`haftaBasi` ve `onbellekSil` bugün başka bir dosyadan çağrılmıyor (grep); dışa açık duruyorlar.

### Önemli iç işlevler

- `mesafe(a, b)` — iki nokta arası metre (haversine).
- `koordinatAl(body)`, `sayiAl(v)` — koordinat okuma (yukarıda).
- `yaklasmaAdaylari(sefer)` / `yaklasmaOnbellek` — bildirim alabilecek öğrenciler 60 saniye bellekte tutulur (her konum
  güncellemesinde veritabanına gidilmesin). Sabah: henüz işaretlenmemiş ve "binmeyecek" denmemiş öğrenciler; akşam:
  "Geldi" işaretli ve henüz inmemiş öğrenciler. 500 servisi geçince süresi dolanlar atılır.
- `yaklasmaBildir(sefer, konum)` — eşiğe giren her öğrenci için `seferBildirimiIsaretle` ile "ilk mi" bakar; öğrenciye
  "Servis evine yaklaşıyor (yaklaşık 500 m)." / "Servis evine 100 metreden yakın, hazırlan.", velisine başında çocuğun adı
  olan aynı metin gider.
- `haritaYetkisi(me, ogrenciId)` — `{ st, evDuzenle }` ya da `null` (yukarıda).
- `ogrenciBugunu`, `yoklamaCevabi`, `bosYoklama` — ekran nesneleri.
- `isaretDonemi(p)`, `yoklamaEngeli(p, is, gunSatiri)`, `araliktaBasladi(p, is, g)` — işaret atılabilir mi, atılamıyorsa
  Türkçe nedeni.
- `seferAc(servis, okul, soforId, donem)` — `depo.okulHayati.seferAcYaDaBul` ile süren seferi bulur ya da açar.
- `yoklamaBildir(o, is, durum)` — veliye tek seferlik yoklama bildirimi (Dikkat bölümünde ayrıntı).
- `servisVelilerineBildir(ogrenciId, metin)` — yalnız velilere, bağlantı `#/servis?c=<öğrenci>`.
- `onundeKac`, `siraliListe` — "önünde N öğrenci" hesabı ve sıraya dizme (sırası olmayanlar sonda, ada göre).
- `ileriTarih(v)` — bugün ile 7 gün sonrası arasındaki geçerli tarih ya da `null`; `tarihYazisi` — "bugün", "yarın",
  "28 Eylül".
- `telefonAl(deger, ad)`, `servisGorunumu`, `kulupGorunumu`, `okulOgrencileri`, `cocuklar(me)`.

## Kimle konuşur?

- Çağırdıkları:
  - `../guvenlik` → `hizSinir`; `../http` → `bad`, `ok`, `sendJSON`; `../iliskiler` → `saatDuzelt`;
    `../ortak` → `clean`, `normTelefon`, `telefonSorunu`, `uid`; `../yetki` → `yetkiVarMi`;
    `./islem-kaydi` → `islemYaz` (`yemek.kaydedildi`, `servis.saatler`);
  - `../veri` → `depo` ve `cokluBildirim` (bildirimler; hepsi `{ veliye: false }` ile, çünkü veli metni burada ayrıca yazılıyor);
  - `sunucu/yardimci/servis-pencere.js` → saat aralıkları (`servisPenceresi`, `seferSuruyorMu`, `aralikIcindeMi`,
    `saatlerSorunu`, `saatleri`, `aralikMetni`, `seferDonemi`, `donemYonu`, `trSaat`, `saatEki`, `ilkAd`);
  - `sunucu/yardimci/hatirlatici-zaman.js` → `trGun`, `gunEkle` (Türkiye günü).
- Depo işlevleri ve arkalarındaki tablolar:
  - `depo.okulHayati` (`sunucu/veri/depo/okul-hayati.js`) → `yemek_listesi`, `servisler`, `servis_ogrencileri`,
    `ogrenci_konumlari`, `servis_seferleri`, `sefer_bildirimleri`, `kulupler`, `kulup_uyeleri` (okurken `kullanicilar`,
    `siniflar`, `okullar` ile birleşir);
  - `depo.servisYoklama` (`sunucu/veri/depo/servis-yoklama.js`, şema 028) → `servis_yoklamalari`, `servis_gunleri`,
    `servis_olaylari`, `servis_notlari`, `servis_binmeyecek`;
  - `depo.okullar` → `okullar` (`bul`, `servisSaatleriYaz`); `depo.kullanicilar` → `kullanicilar` ve veli bağları
    (`bul`, `okulun`, `cocuklari`, `bagliMi`, `veliHaritasi`); `depo.siniflar.okulun`; `depo.ozellikler.kapaliMi`.
- Onu çağıranlar:
  - `sunucu/api.js` — `BOLUM` tablosunda `yemek`, `servis`, `kulupler` → `uclar(k)`;
  - `sunucu/index.js` — `servisTemizle()` her 10 dakikada bir (`setInterval`);
  - `sunucu/bolumler/cihaz.js` — `surenSefer` (telefonun `/api/cihaz/ayar` cevabındaki `acikSefer`) ve `seferKonumuYaz`
    (`POST /api/cihaz/servis-konum`; orada ayrıca servis kapalıysa 403).
- Ön yüz:
  - `public/js/parcalar/19c-okul-hayati.js` — Yemek, Servis ve Kulüpler sayfaları (`/yemek`, `/servis`, `/servis/saatler`,
    `/servis/yoklama` (yönetimin salt okunur görünümü), `/servis/binmeyecek`, `/servis/kaydet`, `/servis/sil`,
    `/servis/ogrenci`, `/servis/ogrenci-cikar`, `/kulupler` ve alt uçları, `uye-ekle`/`uye-cikar` dahil);
  - `public/js/parcalar/19e-servis-konum.js` — harita (`/servis/harita`), ev konumu (`/servis/ev`), tarayıcıdan konum
    (`/servis/konum`), `/servis/sefer-bitir`;
  - `public/js/parcalar/19i-servis-yoklama.js` — servisçi ekranı (`/servis/yoklama`, `/servis/sefer-basla`,
    `/servis/okula-vardik`, `/servis/sira`, `/servis/not`, `/servis/not-sil`);
  - `public/js/parcalar/26-baslat.js` — çıkışta açık seferi kapatır (`/servis/sefer-bitir`);
  - `public/js/parcalar/06-menu.js` — menüde bölüm adları ve servisçinin "Yoklama" sayfası; `08-ana-sayfa.js` —
    servisçinin ana sayfası doğrudan yoklama ekranıdır.
  - `GET /api/servis/seferim` bugün ön yüzden çağrılmıyor (servisçi ekranı `/servis/yoklama`'ya geçti); yalnız
    `testler/test-servis-konum.js`, `test-servis-yoklama.js` ve `yetki-denetimi.js` kullanıyor.
- Android uygulaması bu dosyanın uçlarını doğrudan çağırmaz; servisçi telefonu konumu `SeferServisi.java` ile
  `/api/cihaz/servis-konum`'a gönderir (oradan `seferKonumuYaz`), bildirim bağlantısı `#/servis?c=...` web sayfasına götürür.

## Nasıl çalışır (adım adım)?

### Servis saatleri ve sefer

```
okulun saatleri: sabah 07:00-09:20, akşam 16:30-19:00 (varsayılan; müdür değiştirir)
   │
   ├─ aralık içinde        → canlı bilgi açık, yoklama açık, sefer başlayabilir
   ├─ aralık bitti, ≤60 dk → "uzatma": yalnız aralıkta başlamış sefer sürer, işaret alınır
   └─ dışarıda             → canlı bilgi yok; yoklama ekranı bir sonraki aralığın listesini gösterir

servisTemizle (10 dk'da bir): uzatması biten / 45 dk konumsuz sefer kapanır,
                              30 günü geçen yoklama-not-işaret silinir
```

### Sabah

```
servisçi "Bindi" (ilk) ─► yoklamaYaz ─► seferAc (servis satırı kilitli, tek sefer) ─► gunBasladi
        │                                    │
        │                                    └─ telefon/tarayıcı konum yollar ─► seferKonumuYaz
        │                                                   └─ 500 m / 100 m ─► öğrenci + veli bildirimi (bir kez)
        └─► yoklamaBildir: veliye "Ayşe 07:42'de servise bindi." (bir kez)
"Binmedi" ─► veli "binmeyecek" demediyse "bu sabah servise binmedi." (bir kez);
             önce "bindi" bildirildiyse bir kez "Düzeltme: …"
"Okula vardık" ─► gunBitti (ilk kez mi?) ─► sefer kapanır ─► binenlerin velisine "okula vardı."
```

### Akşam

```
okulda "Geldi" / "Gelmedi" ─► "Başlat" (sefer-basla) ─► konum, yaklaşma bildirimleri
   ─► her öğrencide "İndi" ─► serviste "Geldi" kalmadı ve en az biri indi ─► gunBitti ─► sefer kapanır
```

### İşaret isteğinin kapıları (`POST /api/servis/yoklama`)

1. İstek sahibinin servisi mi (`servisimAl`), öğrenci bu serviste mi?
2. `pencere.servisPenceresi(okul)` → `isaretDonemi`: aralıkta mıyız, uzatmada mıyız?
3. `yoklamaEngeli`: dönem bitmişse ya da uzatmada aralıkta başlamış sefer yoksa 409.
4. İstemcinin `donem`i uyuşuyor mu, durum dönemde var mı, "İndi" kuralları.
5. Durum değiştiyse yaz, önbelleği sil; sabah ilk "Bindi"de sefer aç.
6. Bildirimi dene (hata olsa bile), sonra hatayı fırlat.
7. Akşam son öğrenci indiyse günü ve seferi bitir; yenilenmiş yoklama ekranını dön.

## Dikkat!

- **Saat Türkiye saatidir, istemcinin saatine güvenilmez.** Dönemi sunucu hesaplar; istemci eski ekranla işaret atarsa
  `donemDegisti` 409'u alır ve sayfayı yeniler.
- **Aynı anda iki "ilk Bindi" ya da iki kez "Başlat":** `seferAcYaDaBul` servis satırını `FOR UPDATE` ile kilitleyip tek
  işlemde bakar; tek sefer açılır, biri "zaten var" hatası almaz.
- **Bildirim tekilliği veritabanında:** yoklama bildirimleri `servis_olaylari` (`olayIlkMi`), yaklaşma bildirimleri
  `sefer_bildirimleri` (`seferBildirimiIsaretle`), "okula vardı" hem `gunBitti`'nin "ilk kez mi" cevabı hem `vardi` olayı
  ile korunur. Aynı işaret yeniden gönderilirse sefer açma ve bildirim yeniden denenir (önceki deneme yarıda kaldıysa
  tamamlansın) ama ikinci kez gitmez.
- **Bildirim yarıda kalırsa:** sefer açma hatası yakalanır, bildirim yine denenir, sonra hata fırlatılır. Böylece "Yeniden
  dene" diyen servisçi hem seferi hem bildirimi tamamlar.
- **Öğrenciye yoklama bildirimi gitmez**, yalnız velilere. Yaklaşma bildirimi ise öğrenciye de gider.
- **"İndi" kalıcıdır:** eve bırakılan öğrencinin işareti değiştirilemez. "İndi" için önceki `bindi_zaman` korunur.
- **Akşam seferi kendiliğinden bitmesi için** en az bir "İndi" olmalı; "Başlat"a basıldığında serviste "Geldi" kimse yoksa
  servisçi uyarılır ve "Seferi bitir"e basması gerekir.
- **Saatler değişince** `servisTemizle()` hemen çalışır; kayıtlı "başladı" anı yeni aralığın dışında kalırsa
  (`araliktaBasladi` yanlış) uzatma yoktur ve bir sonraki "Bindi"/"Başlat" günü yeniden başlatır (`gunBasladi(..., bayat)`).
- **Canlı konum gizliliği:** aracın konumu yalnız sefer sürerken ve son 3 dakikada geldiyse döner; yalnız son konum tutulur,
  geçmiş iz saklanmaz. Servisçi değişince (`servisSoforYaz`) eski servisçinin açık seferi kapanır.
- **Veli yalnız çocuğunun servisini görür:** şoför telefonu yalnız o servisteki öğrenciye, velisine ve yönetime gider.
  Çocuğun okulunda servis kapalıysa o çocuğun servis kartı gelmez (öteki çocuğun okulunda açık olabilir; kapı
  `ozellikler.kapaliysaReddet` bu durumda veli isteğini geçirir).
- **"binmeyecek" kilidi:** o dönemin yoklaması alındıysa işaret değişmez; yoksa servisçi yanlış listeyle yola çıkardı.
  Önbellek her "binmeyecek", yoklama, sıra ve öğrenci değişikliğinde silinir, yaklaşma listesi eskimesin.
- **Kulüp kontenjanı yarışı:** `uyeEkle` kulüp satırını `FOR UPDATE` ile kilitler; aynı anda gelen iki katılma isteği
  kontenjanı aşamaz (test var). Danışman da kontenjanı aşamaz ama başvuru kapalıyken ekleyebilir.
- **Başka okulun verisi:** servis/kulüp kimliği her uçta `okul_id` ile süzülür; başka okul "bulunamadı" (404) alır, var olduğu
  bile anlaşılmaz. `servisOgrenciYaz` öğrenci ile servis aynı okulda değilse hiçbir şey yazmaz.
- **Küçük tutarsızlıklar (koddan):** yemek listesinde "bugün" UTC günüyle hesaplanıyor (`new Date().toISOString()`),
  servis kısmında Türkiye günüyle (`trGun`); gece 00:00–03:00 arasında `haftaBasi` ve yemek tarih sınırı bir gün geride
  kalabilir. "Tarih bu yılın dışında" mesajı aslında "60 gün önce – 400 gün sonra" aralığını anlatıyor.
- `POST /api/servis/sefer-bitir` başkasının seferini kapatamaz (sorgu `sofor_id` ile süzer) ama bu durumda da "Sefer zaten
  bitmiş." der; ayrı bir hata dönmez.

## Testleri

- `testler/test-okul-hayati.js` — yemek (görme, yazma yetkisi, boş satır, kalori, pazartesi başlangıcı, veli, başka okul,
  boş menü siler, bozuk tarih ve 31 günden fazla, `yemek.yonet` verilen öğretmen), servis (ekleme, aynı ad, bozuk telefon,
  öğrenciyi yazma/taşıma/çıkarma, şoför telefonunu kimlerin gördüğü, başka okul), kulüpler (danışman kuralı, aynı ad,
  kontenjan, aynı anda iki istek, başvuru kapalı, üye listesi yetkisi, veli, `kulup.yonet`).
- `testler/test-servis-konum.js` — servisçi atama, okul ve ev konumu, harita yetkisi, servisçi ekranı, sefer ve konum,
  500/100 m bildirimi ve GPS doğruluğu, servisçi değişince seferin kapanması.
- `testler/test-servis-yoklama.js` — servis saatleri, aralık dışı, sıra, sabah ve akşam yoklaması, notlar, "binmeyecek",
  uzatma ve aralık bitince kapanma, aynı anda gelen işaretler, cihaz anahtarı ile konum.
- `testler/test-servis-pencere.js` — saat aralığı hesabı (sunucusuz, `servis-pencere.js`).
- `testler/test-ozellikler.js` — servis kapalıyken yoklama ve telefon konumu reddi.
- `testler/yetki-denetimi.js` (her uç × her rol), `testler/girdi-denetimi.js` (bozuk gövde), `testler/test-yedek.js`
  (yedekte bu tablolar), `testler/test-aktarim.js` (hazırlıkta `/api/servis/kaydet` ile servis açar; servisçi listesinde
  servis sütunu).
- Elle: sunucuyu 3200'de aç, `testler/seed.js`'teki müdürle gir, Servis sayfasında bir servis aç ve servisçi hesabı ata;
  servisçiyle girip Yoklama ekranında "Bindi" de; veliyle girip Servis sayfasında bildirimi ve haritayı gör.

## Son durum

- Son commit `24050a2 commit 518` (2026-09-27): servis yoklaması işi. Servis saatleri (`/servis/saatler`), yoklama
  (`/servis/yoklama` GET/POST), "Okula vardık", sıra, servisçi notu, velinin "binmeyecek" işareti, `bugun` ve "önünde N
  öğrenci" eklendi; sefer yalnız servis saatinde başlar ve 60 dakikalık uzatmadan sonra kapanır oldu (`servisTemizle`
  genişledi); konum yazma `seferKonumuYaz`'a taşınıp telefon ucu için dışa açıldı; eski sefer-öğrenci önbelleği
  servis başına `yaklasmaOnbellek`'e dönüştü (yalnız bekleyen öğrenciler bildirim alsın).
- Ondan önce dosya üç adımda kuruldu (hepsi 2026-09-26): `c9e9a89 commit 305` dosyayı açtı (baş yorum ve `require`'lar),
  `7e3bf79 commit 306` konum yardımcılarını (`mesafe`, `sayiAl`, `koordinatAl`) ve `haftaBasi`'yı ekledi, `8b6934a commit 313` yemek,
  servis (harita, ev, seferim, sefer-basla, konum, sefer-bitir, kaydet, sil, ogrenci, ogrenci-cikar) ve kulüp uçlarının
  hepsini içeren `uclar`'ı ve yaklaşma bildirimlerini ekledi.
- Açık iş: yukarıdaki UTC/Türkiye günü farkı (küçük). Sıradaki işlerden "Mesaj ayarları, Ajanda, ... ödev hatırlatma
  otomasyonu" ve "Optimizasyon + saklama süreleri" bu dosyanın saklama kurallarına dokunabilir.
