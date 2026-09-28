# sunucu/bolumler/ozellikler.js

Okulun özellikleri (`/api/ozellikler`): müdürün okulunda kullanmadığı bölümleri (ödev, sınav, servis…) kapatması ve her
API isteğinde "bu bölüm bu okulda kapalı mı" kapısı.

## Bu dosya ne yapar?

Her okul her bölümü kullanmaz: servisi olmayan bir okul "Servis" sayfasını, anket yapmayan bir okul "Anketler"i görmek
istemez. Müdür Özellikler sayfasından bu bölümleri kapatır. Kapalı bölüm:

- menülerden kalkar (ön yüz `/api/me` ve giriş cevabındaki `kapaliOzellikler` listesine bakar),
- sunucuda da kapanır: `api.js` her isteği bölüme vermeden önce bu dosyanın `kapaliysaReddet`'ine sorar; kapalıysa 403
  `{ ozellikKapali }` döner,
- ama kayıtları SİLİNMEZ; müdür yeniden açınca her şey yerindedir.

Kapatılabilen sekiz bölüm (`sunucu/veri/depo/ozellikler.js` `OZELLIKLER`, ekrandaki sırayla): `odev` (Ödevler: ödev verme,
teslim dosyaları, ödev ekleri, hatırlatmaları), `sinav` (Sınavlar), `devamsizlik` (Devamsızlık), `etut` (Etütler), `servis`
(Servis), `yemek` (Yemek listesi), `kulup` (Kulüpler), `anket` (Anketler).

İşin inceliği veli: bir velinin iki çocuğu farklı okullarda olabilir. Veli hangi okulun kuralına tabi olacak? Bu dosya bunu
çözer (aşağıda `bakilanOkul` ve `kapaliysaReddet`).

## İçinde neler var?

### Sabit

- `YOL` (dışa açık) — yolun ilk parçası → özellik: `assignments` ve `odev-dosya` → `odev`; `exams`, `examgroups` → `sinav`;
  `devamsizlik` → `devamsizlik`; `etut` → `etut`; `servis` → `servis`; `yemek` → `yemek`; `kulupler` → `kulup`;
  `anketler` → `anket`. Burada OLMAYAN yollar (ilerleyiş, takvim, ana sayfa) karışıktır: birden çok bölümün verisini bir
  arada döndürdükleri için kapalı bölümü kendi içlerinde atlarlar. Quiz `assignments` altında olduğu için ödevle birlikte
  kapanır. Gövdesi dosyanın kendisi olan iki yükleme ucu bu kapıya varmadan `api.js`'te ayrılır; onlar için `api.js` ayrıca
  `odev`'e bakar: teslim yüklemesi (`POST /api/odev-dosya/yukle`) ve ödev eki yüklemesi (`POST /api/ek/yukle?tur=odev`; mesaj
  eki bu kapıya takılmaz). `ek` yolu `YOL`'da olmadığı için ek bileti, indirme ve silme uçları bu kapıdan geçmez.

### Uçlar (`uclar(k)`, yol `ozellikler`)

Yalnız müdür (`need(['principal'])`: oturum yoksa 401, onaylı değilse ya da müdür değilse 403). Müdürün okulu yoksa 404
"Okul bulunamadı".

- **`GET /api/ozellikler`** — `{ ozellikler: [{ acik, k, ad, aciklama }] }` (sekizi de, ekrandaki sırayla).
- **`POST /api/ozellikler`** — gövde `{ kapali: ['servis', 'anket', …] }` (okulun kapalı listesinin TAMAMI; listede
  olmayan açılır). Dizi değilse 400 "Kapalı özellik listesi gerekli"; bilinmeyen anahtar varsa 400 "Bilinmeyen özellik: …".
  Liste baştan yazılır; değişiklik varsa işlem kaydına `okul.ozellik` ("kapandı: Servis, Anketler; açıldı: Kulüpler")
  yazılır. Cevap `{ kapali, message }`; bir şey kapandıysa mesaj "Kapanan bölümler okulda kimseye görünmez; kayıtları
  silinmedi." der.
- Başka yöntem: 404 "Böyle bir adres yok".

`api.js`'te `ozellikler` yolu `ROLSUZ_SERBEST`'te değildir; rolsüz yetişkin 403 `rolsuz` alır.

### Dışa açılan işlevler

- `kapaliysaReddet(res, me, p, q, body)` — `api.js`'in kapısı. Bölüm kapalıysa 403 yazar ve `true` döner:
  `{ error: '<Bölüm adı> bu okulda kapalı. Okul müdürü Özellikler sayfasından açabilir.', ozellikKapali: '<anahtar>' }`.
  Kapıdan her zaman geçenler: yolu `YOL`'da olmayan istek, oturumsuz istek ve sistem yöneticisi. Adımlar:
  1. `bakilanOkul` ile isteğin baktığı okulu bul;
  2. o okulda özellik açıksa geç;
  3. istek belli bir çocuk seçmiyorsa ve kişi veli (ya da rolsüz yetişkin) ise: çocuklarından BİRİNİN okulunda bölüm
     açıksa geç (menüdeki kuralla aynı; kapalı okuldaki çocuğu bölümün kendisi atlar — ör. [okul-hayati.md](okul-hayati.md)
     servis kartı);
  4. değilse 403.
- `bakilanOkul(me, q, body)` — isteğin baktığı okul. İstekte öğrenci kimliği varsa (`?studentId=`, `?ogrenci=`, gövdede
  `studentId`, `ogrenciId`) ve kişi öğrenci değilse: o öğrenci başka okuldaysa ve kişi o çocuğa BAĞLIYSA (`bagliMi`)
  çocuğun okulu; öteki her durumda kişinin kendi okulu (okulu yoksa `''`, kapalı sayılmaz).
- `kullanicininKapalilari(u, cocuklar)` — menü için kişinin görmeyeceği bölümler. Veli (ya da çocuğu olan rolsüz yetişkin)
  için çocuklarının okullarının HEPSİNDE kapalı olanlar (bir çocuğun okulunda açıksa görünür); öteki herkes için kendi
  okulunun kapalıları.
- `YOL`, `uclar`.

`YOL` ve `bakilanOkul` bugün başka bir dosyadan çağrılmıyor (grep); dışa açık duruyorlar.

### İç işlev

- `istekteOgrenci(q, body)` — istekteki öğrenci kimliği (sorgu ya da gövde), yoksa `''`.

## Kimle konuşur?

- Çağırdıkları: `../http` → `bad`, `ok`, `sendJSON`; `../ortak` → `clean`; `../veri` → `depo`; `./islem-kaydi` →
  `islemYaz`.
- Depo ve tablo: `depo.ozellikler` (`sunucu/veri/depo/ozellikler.js`) → `okul_kapali_ozellikler` (şema 022; okul başına en
  çok 8 satır): `OZELLIKLER`, `ANAHTARLAR`, `kapalilar`, `kapaliMi`, `yaz`. Tablo açılışta (`sunucu/veri/index.js`
  `baslat`) ve yedekten/JSON'dan içe aktarımdan sonra (`sunucu/veri/json-aktarim.js`) BELLEĞE okunur; `kapaliMi` her
  istekte veritabanına gitmez. `yaz` belleği de günceller. Ayrıca `depo.kullanicilar.bul`, `bagliMi`, `cocuklari`.
- Onu çağıranlar:
  - `sunucu/api.js` — `kapaliysaReddet(res, me, kp, q, body)` her istekte (oturum kapılarından sonra, bölümden önce) ve
    `BOLUM['ozellikler']`;
  - [kayit.md](kayit.md) — `kullanicininKapalilari` (giriş cevabı ve `/api/me`'deki `kapaliOzellikler`).
- `depo.ozellikler.kapaliMi`'yi doğrudan kullanan öteki yerler (kendi içinde kapalı bölümü atlayanlar): `sunucu/api.js`
  (yükleme uçları), [okul-hayati.md](okul-hayati.md), `sunucu/bolumler/ilerleyis.js`, `sunucu/bolumler/takvim.js`,
  `sunucu/bolumler/cihaz.js`, [hatirlatma.md](../hatirlatma.md).
- Ön yüz: `public/js/parcalar/16c-ozellikler.js` (müdürün Özellikler sayfası: `GET`/`POST /ozellikler`); menüyü süzen
  `S.kapali` listesi `05-giris.js`, `26-baslat.js`, `08c-kisilikler.js`'te `kapaliOzellikler`'den dolar, `06-menu.js`
  `ozellikAcik(k)` ona bakar.
- Android uygulaması kullanmaz.

## Nasıl çalışır (adım adım)?

```
her /api isteği ─► api.js kapıları (kvkk, şifre, rolsüz) ─► ozellikler.kapaliysaReddet(kp)
     YOL[kp] yok / oturum yok / yönetici ─────────────────────────────► geç
     okul = bakilanOkul(me, q, body)
        istekte öğrenci var, kişi öğrenci değil, öğrenci başka okulda ve kişi ona bağlı ─► çocuğun okulu
        değilse ─► kişinin kendi okulu
     depo.ozellikler.kapaliMi(okul, özellik)?  hayır ─► geç
     veli/rolsüz ve çocuk seçilmemiş ve bir çocuğun okulunda açık ─► geç
     ─► 403 { error: 'Servis bu okulda kapalı. …', ozellikKapali: 'servis' }
```

Müdür kaydedince: `depo.ozellikler.yaz` (tek işlemde sil + ekle, sonra bellek) → işlem kaydı → cevap. Müdürün kendi ekranı
menüyü hemen yeniler (`16c-ozellikler.js` cevaptaki `kapali`'yı `S.kapali`'ya yazıp `navCiz()` çağırır); öteki kişilerin
menüsü sayfayı yeniden açtıklarında (`/api/me`) güncellenir, o arada kapalı bölüme tıklarlarsa sunucu 403 verir.

## Dikkat!

- **Başka okulun öğrencisiyle kapı atlanamaz:** istekteki öğrenci kimliği yalnız kişinin BAĞLI olduğu çocuksa sayılır. Yoksa
  bir öğretmen isteğe özelliği açık başka bir okulun öğrencisini ekleyip kendi okulunda kapalı bölümü açabilirdi (commit
  518'de kapatıldı; test var).
- **Veli kuralı menüyle aynı:** çocuk seçmeyen veli isteği bir çocuğun okulunda bölüm açıksa geçer; kapalı okuldaki çocuğun
  verisini bölüm kendisi süzmelidir. Yeni bir bölüm yazarken veli için "hangi çocuğun okulu kapalı" denetimini unutma.
- **Kayıt silinmez:** kapatmak yalnız görünmez yapar; yeniden açınca ödevler, servisler, kulüpler yerindedir.
- **Bellekteki kopya:** kapalı liste süreç belleğindedir; tek süreçli sunucu için yeterli. Veritabanını elle değiştirirsen
  sunucuyu yeniden başlatmalısın.
- **Karışık sayfalar:** ilerleyiş, takvim ve ana sayfa `YOL`'da yok; kapalı bölümü kendileri atlar (ör. ilerleyişte kapalı
  ödevler gelmez). Yeni bir karışık sayfa eklersen aynısını yapmalısın.
- Sistem yöneticisi kapıdan her zaman geçer (okulu yok).
- `kapaliysaReddet` `api.js`'te `kp` ile çağrılır: yönetici olmayana gizlenen yönetici uçları bu kapıda da "boş ad"la
  görünür (bkz. [api.md](../api.md)).

## Testleri

- `testler/test-ozellikler.js` — kim görür (yalnız müdür; bilinmeyen özellik reddi), ödev ve etüt kapalıyken bütün uçların
  403 `ozellikKapali` dönmesi (teslim dosyaları, ek yükleme, quiz uçları dahil), ilerleyiş ve takvimin kapalı bölümü atlaması,
  `/api/me`'nin kapalı listeyi söylemesi, velinin çocuğun okuluna bakması ve başka okulun öğrencisini eklemenin kapıyı
  açmaması, iki okullu velinin bir okulda servis kapalıyken sayfayı açabilmesi (kapalı okuldaki çocuğun haritası yine 403),
  işlem kaydında `okul.ozellik`, yeniden açınca kayıtların yerinde olması, servis kapalıyken yoklama/sıra/not/binmeyecek/saatler ve telefon
  konumunun reddi.
- `testler/yetki-denetimi.js` — her uç × her rol.
- Elle: müdürle Özellikler sayfasında "Yemek listesi"ni kapat; öğrenciyle girince menüde görünmez ve
  `curl -H "Authorization: Bearer <öğrenci oturumu>" http://localhost:3200/api/yemek` 403 `ozellikKapali: "yemek"` döner.

## Son durum

- Son commit `24050a2 commit 518` (2026-09-27): istekteki öğrencinin yalnız kişinin bağlı olduğu çocuksa sayılması
  (`istekteOgrenci` + `bagliMi`) ve çocuk seçmeyen veli isteğinin bir çocuğun okulunda bölüm açıksa geçmesi eklendi.
- Dosya `8a275f9 commit 431` (2026-09-26) ile eklendi.
- Açık iş yok. Sıradaki işlerden "Sistem: … bakım modu" ve "Paneller" okul ayarlarına dokunabilir; yeni bir bölüm eklenirse
  `YOL`'a ve `depo/ozellikler.js` `OZELLIKLER`'e (yeni şema dosyasıyla) eklenmeli.
