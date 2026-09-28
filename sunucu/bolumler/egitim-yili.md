# sunucu/bolumler/egitim-yili.js

Eğitim yılı: müdür yıl açar ve aktif yılı seçer, kayıtlar açıldıkları yıla damgalanır, herkes geçmiş bir yıla (ve
nakil olmuş öğrenci eski okuluna) salt okunur bakabilir; öteki bölümler listelerini bu dosyayla yıla göre süzer.

## Bu dosya ne yapar?

Okul her yıl sıfırdan başlar: yeni sınıflar, yeni program, yeni ödevler. Ama eski yılın kaydı kaybolmamalı — veli
geçen yılın devamsızlığına, müdür geçen yılın programına bakabilmeli. Çözüm: kayıtlar açıldıkları yıla damgalanır
(`yilId`). Yılı olmayan eski kayıtlar okulun İLK yılına aitmiş gibi davranır.

Her kayıt ayrıca bir okula aittir. Başka okuldan gelen (nakil) öğrencinin eski okulundaki kayıtları yeni okulun
hiçbir yılında görünmez. Öğrencinin (ve velisinin) yıl listesinde eski okulun dönemleri de vardır: "2025-2026 · Eski
Okul · 6-A" — onları seçince eski kayıtlar salt okunur görünür ([nakil.md](nakil.md)).

Bu dosyanın iki yüzü var:

1. **Uçlar** (`/api/egitim-yili`): yıl listesi, yıl açma, bakılacak yılı seçme, aktif yılı değiştirme.
2. **Yardımcılar**: öteki bölümler (ödev, sınav, devamsızlık, takvim, program, ilerleyiş, öğretmen) yeni kayda
   yıl damgası basmak için `yilDamgasi`'nı, listeyi bakılan yıla süzmek için `yilSuz`'u, velinin çocuğun gözünden
   bakması için `bakisKisisi`'ni kullanır; [api.md](../api.md)'deki arşiv kapısı `arsivdeMi`'ye sorar.

"Aktif yıl" okulundur (yeni kayıtlar ona yazılır); "bakılan yıl" kişinindir (`kullanicilar.secili_yil_id`, ekrandaki
yıl seçicisi). Bakılan yıl aktif yıldan farklıysa kişi "arşivde"dir. Arşivdeki ÖĞRETMEN ve MÜDÜR yıla bağlı kayıt
yazamaz ([api.md](../api.md)'deki kapı yalnız bu iki role bakar); öğrenci ve veli için `arsiv` yalnız ekrandaki
işarettir, sunucu onların isteklerini bu yüzden durdurmaz.

## İçinde neler var?

### Dışa açık yardımcılar

- `okulYillari(schoolId)` — okulun yılları, yeniden eskiye (`depo.okullar.yillari`).
- `aktifYil(schoolId)` — okulun aktif yılı (yoksa en yenisi, o da yoksa `null`).
- `yilBilgisi(me)` → `{ liste, aktif, bakilan, enEskiId, enEskiGecmis }`. Bir istekte bir kez sorgulanır ve
  `me._yilBilgisi`'nde saklanır (kullanıcı nesnesi her istekte yeniden okunduğu için bayat kalmaz).
  - `liste`: okulun yılları + (öğrencide) geçmiş okul dönemleri (`ogrenci_gecmisi`; `{ id, ad: "yıl · okul · sınıf",
    okulId, yilId, gecmis: true }`).
  - Yeni okulda hiç yıl tanımlı değilse ve öğrencinin geçmişi varsa tek bir `{ id: 'simdiki', ad: 'Şimdiki okul',
    simdiki: true }` seçeneği eklenir ki öğrenci geçmiş okuldan geri dönebilsin.
  - `aktif`: okulun aktif yılı (yoksa listedeki ilk). `bakilan`: kişinin seçtiği geçmiş dönem ya da yıl
    (`seciliGecmis`, `seciliYil`) listede varsa o, yoksa aktif.
  - `enEskiId`: okulun en eski yılı (damgasız kayıtlar ona sayılır); `enEskiGecmis`: her eski okul için en eski
    dönemin kimliği (eski okulun damgasız kayıtları oraya sayılır).
- `bakilanYil(me)` — kişinin baktığı yıl; okulu yoksa `null`.
- `yilaAitMi(kayit, yil, enEskiId, okulId, enEskiGecmis)` — kayıt bu döneme ait mi:
  - kaydın okulu (`schoolId`/`okulId`) biliniyorsa bakılan dönemin okulu olmalı (geçmiş dönemde eski okul, değilse
    kişinin okulu);
  - yıl yoksa ya da "Şimdiki okul" seçiliyse hepsi;
  - geçmiş dönemde: damgasız kayıt yalnız o okulun en eski dönemine; damgalı kayıt dönemin `yilId`'sine (dönemin
    yılı yoksa hepsi);
  - okulun yılında: damgasız kayıt en eski yıla, damgalı kayıt kendi yılına.
- `yilSuz(me, liste)` — listeyi bakılan döneme süzer. Okulu olmayan (öğrenci değilse) kişide liste aynen döner.
- `yilDamgasi(me)` — yeni kayda basılacak yıl kimliği (bakılan yıl; yoksa `''`). Arşivde yazma zaten kapalı olduğu
  için pratikte aktif yıldır.
- `bakisKisisi(bakan, ogrenci)` — velinin çocuğun kayıtlarına ÇOCUĞUN gözünden bakması için: çocuğun nesnesi +
  velinin seçtiği yıl/dönem. Bakan öğrencinin kendisiyse, yöneticiyse ya da öğrencinin okulundaki öğretmen/müdürse
  kendisi döner (başka okuldaki öğretmen ancak velisiyse bu yolla görür).
- `arsivdeMi(me)` — bakılan dönem geçmiş bir okul dönemi mi ya da aktif yıldan farklı bir yıl mı. `true` ise
  [api.md](../api.md) ÖĞRETMEN ve MÜDÜRÜN yıla bağlı kayıt yazan POST isteklerini (`arsivYazmasiMi`: ödev, sınav,
  yoklama, takvim etkinliği, ders programı) 409 `{ arsiv: true }` ile durdurur. Okulu olmayan (öğrenci de değilse)
  kişide her zaman `false`.
- `uclar(k)` — aşağıdaki uçlar.

### İç

- `kayitOkulu(k)` — kaydın `schoolId` ya da `okulId`'si.

### Uçlar (`/api/egitim-yili/...`, hepsi `need()`: giriş + onaylı hesap)

Önce kimin gözünden bakılacağı belirlenir: `?ogrenci=` (ya da gövdede `ogrenci`) verilmiş ve kişi öğrenci değilse,
o öğrenciyi görebilmeli (`canSeeStudent`; yoksa 403 "Bu öğrenciyi görme yetkin yok") ve bakış `bakisKisisi` olur;
verilmemişse kişinin bir okulu olmalı (`okulGerek`: velinin okulu yoksa ilk çocuğunun okulu yazılır; çocuğu yoksa
403 "Önce çocuğunu hesabına bağlaman gerekiyor."; okulsuz öteki hesaplara — yönetici gibi — 403).

| Uç | Kim | Gövde → cevap |
|---|---|---|
| `GET /api/egitim-yili[?ogrenci=]` | okulu olan herkes / çocuğunun velisi | `{ yillar: [{ id, ad, bas, bit, gecmis, aktif, bakilan }], yonetebilir, arsiv }` |
| `POST /api/egitim-yili/ekle` | `yil.yonet` (müdür) | `{ ad: '2026-2027', aktifYap? }` → `{ yil, message }` |
| `POST /api/egitim-yili/bak` | herkes (kendi seçimi) | `{ id, ogrenci? }` → `{ yil: { id, ad }, arsiv, message }` |
| `POST /api/egitim-yili/aktif-yap` | `yil.yonet` | `{ id }` → `{ message }` |

- **`GET`** — `yonetebilir`: kişi kendi gözünden bakıyor ve `yil.yonet` yetkisi var; `arsiv`: `arsivdeMi`.
- **`ekle`** — yetki yoksa 403 "Eğitim yılı açma yetkin yok". Ad `YYYY-YYYY` biçiminde olmalı ("2026-2027 biçiminde
  yaz"), ikinci yıl birincinin bir fazlası ("İkinci yıl birincinin bir fazlası olmalı"), okulda aynı ad olmamalı.
  Başlangıç `<ilk yıl>-09-01`, bitiş `<ikinci yıl>-06-30` (sabit). `aktifYap: false` verilmezse yeni yıl aktif olur;
  depo ötekileri AYNI İŞLEMDE pasife çeker (tek yıl aktif). Açan kişinin bakılan yılı yeni yıl olur. İşlem kaydı
  `yil.acildi`.
- **`bak`** — seçilebilenler bakışın `liste`'si (okulun yılları, öğrencide geçmiş dönemler); yoksa 404 "Yıl
  bulunamadı". Geçmiş dönem → `seciliGecmis`; "Şimdiki okul" → `seciliGecmis` boşalır; okulun yılı → `seciliYil`, geçmiş
  boşalır. Seçim KİŞİYE özeldir ve veriyi değiştirmez; velinin seçimi velinin hesabına yazılır.
- **`aktif-yap`** — yetki yoksa 403 "Yetkin yok"; yıl başka okulunsa 404. Depo tek işlemde hepsini pasif, bunu aktif
  yapar; kişinin bakılan yılı da bu olur. İşlem kaydı `yil.aktif-degisti`.

## Kimle konuşur?

- Çağırdıkları: `../http` ([http.md](../http.md): `bad`, `ok`), `../ortak` ([ortak.md](../ortak.md): `clean`, `now`,
  `uid`), `../yetki` ([yetki.md](../yetki.md): `okulGerek`, `yetkiVarMi`), `../iliskiler`
  ([iliskiler.md](../iliskiler.md): `canSeeStudent`), `../veri` (`depo`), `./islem-kaydi` (`islemYaz`).
- Veri tabloları:
  - `depo.okullar` → `egitim_yillari`: `yillari`, `yilEkle`, `yilBul`, `yilAktifYap`;
  - `depo.ogrenciGecmisi.listesi` → `ogrenci_gecmisi`;
  - `depo.kullanicilar` → `kullanicilar` (`bul`, `guncelle`: `secili_yil_id`, `secili_gecmis` sütunları);
  - `islemYaz` → `islem_kaydi`.
- Onu çağıranlar:
  - `sunucu/api.js` — `'egitim-yili'` yolu ve arşiv kapısı (`arsivdeMi`);
  - [okul.md](okul.md) — `yilDamgasi` (program ekleme, Excel'den program), `yilSuz` (müdürün ödev bakışı);
  - `sunucu/bolumler/odev.js`, `sinav.js` — `yilDamgasi`, `yilSuz`; `devamsizlik.js`, `takvim.js` — `yilDamgasi`,
    `yilSuz`, `bakisKisisi`; `ilerleyis.js` — `yilSuz`, `bakisKisisi`; `ogretmen.js` — `yilSuz`.
  - `okulYillari`, `aktifYil`, `bakilanYil`, `yilaAitMi`, `yilBilgisi` dışa açık ama bugün yalnız bu dosyada
    kullanılıyor (grep).
- Ön yüz (`public/js/parcalar/`): `16-egitim-yili.js` (yıl seçicisi ve yıl listesi: `GET`), `25-tiklama.js` (ekle,
  bak, aktif-yap), `07-yonlendirme.js` (bak).
- Android uygulaması kullanmıyor.

## Nasıl çalışır (adım adım)?

```
yeni kayıt (ör. ödev)                 liste (ör. ödevler)
  odev.js → yilDamgasi(me)              odev.js → yilSuz(me, liste)
            = bakılan yıl                         yilBilgisi(me) (istekte bir kez)
                                                  her kayıt: yilaAitMi(kayıt, bakılan, ...)

yazma isteği (api.js)
  öğretmen/müdür + POST + yıla bağlı kayıt + arsivdeMi(me) → 409 arsiv

yıl seçici
  GET /api/egitim-yili → yıllar (+ geçmiş dönemler)
  POST /bak { id }     → kullanicilar.secili_yil_id / secili_gecmis
                          (bakılan ≠ aktif → arşiv: salt okunur)
```

Veli: `GET /api/egitim-yili?ogrenci=<çocuk>` → çocuğun okulunun yılları ve geçmiş dönemleri; seçim velinin
hesabına yazılır, çocuğun kayıtlarına `bakisKisisi` ile bu seçimle bakılır.

## Dikkat!

- **Arşiv salt okunurdur:** geçmiş yıla bakarken açılan kayıt eski yıla damgalanıp aktif yılda kaybolurdu; bu yüzden
  [api.md](../api.md) yıla bağlı yazmaları 409 ile durdurur. Sınıflar, öğrenciler ve sınav şablonları yıllar arası
  ortaktır, damgasızdır.
- **Damgasız kayıt en eski yıla sayılır:** yıl özelliği eklenmeden önce açılmış kayıtlar böylece okulun ilk yılında
  görünür. Okulda hiç yıl yoksa süzgeç bir şey elemez.
- **Okul süzgeci yıl süzgecinden önce gelir:** nakil olmuş öğrencinin eski okul kayıtları yeni okulun hiçbir yılında
  görünmez; yeni okul da eski dönemi seçemez (liste yalnız bakış kişisinin geçmişini içerir).
- **Velinin seçimi tek:** `bak` seçimi velinin hesabına yazar. Velinin iki çocuğu farklı okullardaysa birinin okulunda
  seçilen yıl ötekinin okulunda listede bulunmaz; orada aktif yıl açılır (koddan çıkan davranış).
- **Yıl tarihleri sabit** (1 Eylül – 30 Haziran); formda değiştirilemez.
- **`_yilBilgisi` önbelleği** istek boyunca kullanıcı nesnesinde durur; `bak` onu sıfırlar. Aynı istekte yıl
  değiştirip yeniden okumak isteyen kod `_yilBilgisi`'ni `null` yapmalı.
- Eğitim yılı uçları arşiv kapısına takılmaz (yol `arsivYazmasiMi` listesinde değil): geçmiş yıla bakarken de yıl
  açılabilir, aktif yıl değiştirilebilir.

## Testleri

- `testler/test-egitim-yili.js` — boş liste, müdürün yönetebilmesi, ilk yıl (aktif gelir), biçim denetimleri (tek
  yıl, atlamalı yıl, aynı yıl iki kez); eski yılda ödev ve devamsızlık, yeni yıl açılınca yeni yılda görünmemeleri;
  eski yıla bakınca arşiv işareti ve kayıtların geri gelmesi; geçmiş yıla bakarken yeni kayıt açılamaması (409);
  öğrencinin yıl açamaması, aktif yılı değiştirememesi ama yıllara bakabilmesi; müdürün aktif yılı değiştirmesi ve tek
  yılın aktif kalması.
- `testler/test-nakil.js` — öğrenci ve velinin yıl listesinde önceki okul, salt okunur bakış, yeni okulun eski dönemi
  seçememesi, ilgisiz kişinin yıllara bakamaması.
- `testler/test-quiz.js`, `testler/test-okul-agi.js`, `testler/yetki-denetimi.js`, `testler/girdi-denetimi.js` — yıl
  açma ve bakış başka akışların içinde; rol × uç; bozuk girdi.
- Elle: `testler/seed.js`'teki müdürle gir, eğitim yılı ekranından (`16-egitim-yili.js`) yeni yıl aç; eski yıla geçip ödev açmayı dene (409 "arşiv").

## Son durum

- Son commit `fb65e8d commit 422` (2026-09-26, öğrenci nakli): `yilBilgisi` öğrencinin geçmiş okul dönemlerini
  listeye ekler ("Şimdiki okul" seçeneği dahil), `bakisKisisi` eklendi (veli çocuğun gözünden bakar), `yilaAitMi`
  kaydın okulunu da denetler, `bak` geçmiş dönemi seçebilir, uçlar `?ogrenci=` ile çocuğun yıllarını verir.
- `ca7b9b8 commit 357`: dışa açılan adlar bugünkü `module.exports` listesinde toplandı.
- Açık iş yok. Sıradaki "Yıl geçişi" işi (yeni yıl sihirbazı, mezunlar, okul yedeği) yıl açmayı bu dosyanın `ekle`
  ucundan sihirbaza taşıyacak; "Optimizasyon + saklama süreleri" işi (öğrenci/veli yalnız son 1 geçmiş yıl) `liste`'yi
  kısaltacak.
