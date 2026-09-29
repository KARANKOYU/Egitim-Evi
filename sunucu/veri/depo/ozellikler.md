# sunucu/veri/depo/ozellikler.js

Okulun kapattığı bölümlerin (`okul_kapali_ozellikler`) kaydı ve bellekteki kopyası: özellik listesi, açılışta
belleğe okuma, "bu okulda kapalı mı?" (veritabanına gitmeden) ve müdürün kapalı listesini yazması.

## Bu dosya ne yapar?

Müdür "Özellikler" sayfasından okulunda kullanmadığı bölümleri kapatır: ödevler, sınavlar, devamsızlık, etüt, servis,
yemek listesi, kulüpler, anketler. Kapalı bölüm o okuldaki herkesin menüsünden kalkar, sunucu da o bölümün isteklerini
reddeder. Kayıtlar SİLİNMEZ: bölüm yeniden açılınca her şey eskisi gibi görünür (şema 022). Tabloda satır yoksa özellik
açıktır; yeni okulda her şey açık gelir.

"Bu bölüm bu okulda açık mı?" sorusu HER API isteğinde sorulur. Bu yüzden bu dosya tabloyu açılışta belleğe okur ve
soruyu bellekten cevaplar (okul başına en çok 8 satır); müdür değiştirince bellek de hemen güncellenir. Hangi adresin
hangi özelliğe ait olduğu, velinin birden çok okulda çocuğu olması gibi kurallar ve uçlar
[../../bolumler/ozellikler.md](../../bolumler/ozellikler.md)'dedir.

## İçinde neler var?

### Sabitler

- `OZELLIKLER` — ekrandaki sırayla sekiz özellik `{ k, ad, aciklama }`: `odev` (Ödevler), `sinav` (Sınavlar),
  `devamsizlik` (Devamsızlık), `etut` (Etütler), `servis` (Servis), `yemek` (Yemek listesi), `kulup` (Kulüpler), `anket`
  (Anketler). `aciklama` o bölümün neleri kapsadığını müdüre söyler.
- `ANAHTARLAR` — yalnız anahtarlar (`['odev', 'sinav', …]`), aynı sırayla. Şemadaki `CHECK (ozellik IN (…))` listesiyle
  aynı olmalıdır.

### İşlevler

- `yukle()` — `SELECT okul_id, ozellik FROM okul_kapali_ozellikler` → bellek (`Map(okulId → Set(kapalı özellik))`).
  Yeni haritayı kurup bir hamlede değiştirir (yarım okunmuş bellek görünmez). Açılışta ve JSON/yedek içeri aktarımından
  sonra çağrılır.
- `kapalilar(okulId)` — okulun kapalı özellikleri, `ANAHTARLAR` sırasıyla (bellekten). Okul boşsa ya da kapalı yoksa `[]`.
- `kapaliMi(okulId, ozellik)` — `true`/`false` (bellekten; okul boşsa `false`).
- `yaz(okulId, kapali, kapatanId)` — okulun kapalı listesini baştan yazar: gelen listeden yalnız bilinen anahtarları
  `ANAHTARLAR` sırasıyla alır; tek işlemde `DELETE FROM okul_kapali_ozellikler WHERE okul_id = $1` ve her biri için
  `INSERT (okul_id, ozellik, kapatan_id)`. İşlem BAŞARILI olursa belleği günceller (liste boşsa okulu bellekten siler).
  Yazılan listeyi döner.

### Tablolar ve şema

| Tablo | Şema dosyası |
|---|---|
| `okul_kapali_ozellikler` (`PRIMARY KEY (okul_id, ozellik)`, `ozellik` sekiz değerden biri, `kapatan_id` `ON DELETE SET NULL`, `kapanma`; okul silinince CASCADE) | `022-okul-ozellikleri.sql` |

## Kimle konuşur?

- Çağırdıkları: [../baglanti.md](../baglanti.md) (`sorgu`, `calistir`, `islem`).
- Çağıranlar ([../index.md](../index.md)'deki `depo.ozellikler`):
  - [../index.md](../index.md) — açılışta `yukle()` (şema güncellendikten hemen sonra).
  - [../json-aktarim.md](../json-aktarim.md) — içeri aktarımda `ANAHTARLAR` ile satırları süzer, bitince `yukle()`
    ("bellekteki kopya yedekle aynı olsun").
  - [../../bolumler/ozellikler.md](../../bolumler/ozellikler.md) — `GET/POST /api/ozellikler` (müdür: `kapalilar`,
    `OZELLIKLER`, `ANAHTARLAR`, `yaz`), her istekte `kapaliysaReddet` (`kapaliMi`, `OZELLIKLER`), menü için
    `kullanicininKapalilari` (`kapalilar`, `ANAHTARLAR`, `kapaliMi`).
  - [../../api.md](../../api.md) — gövdesi dosya olan iki yüklemede (ödev teslim dosyası, ödev eki) ödev kapalıysa
    403 (`kapaliMi(me.schoolId, 'odev')`; bu uçlar bölüm kapısından önce yönlendirilir).
  - [../../bolumler/ilerleyis.md](../../bolumler/ilerleyis.md) (ödev/sınav kapalıysa ilerleyişte gelmez,
    `kapaliOzellikler`), [../../bolumler/takvim.md](../../bolumler/takvim.md) (takvimde ödev),
    [../../bolumler/cihaz.md](../../bolumler/cihaz.md) ve [../../bolumler/okul-hayati.md](../../bolumler/okul-hayati.md)
    (servis), [../../hatirlatma.md](../../hatirlatma.md) (ödev hatırlatması).
- Tablo: `okul_kapali_ozellikler`.

## Nasıl çalışır (adım adım)?

```
açılış: veri/index.js baslat() → semayiGuncelle → ozellikler.yukle() → bellek
istek:  api.js → ozellikler bölümü kapaliysaReddet(res, me, p)
          YOL[p] → özellik ; bakılan okul ; kapaliMi(okul, özellik) (bellek) → kapalıysa 403 { ozellikKapali }
müdür:  POST /api/ozellikler { kapali: [...] }
          bilinmeyen var mı? → yaz(okul, liste, me.id): islem { DELETE ; INSERT … } → bellek güncellenir
          → işlem kaydı ("kapandı: …; açıldı: …")
içeri aktarım: json-aktarim iceAktar → satırlar yazılır → yukle()
```

## Dikkat!

- **Bellek tek süreçliktir:** sunucu birden çok süreçle çalıştırılırsa bir süreçteki `yaz` ötekilerin belleğini
  güncellemez; kapatılan bölüm o süreçlerde yeniden başlatılana kadar açık kalır. Dosyanın yorumu bunu bilerek kabul
  eder ("tek süreçli sunucu için yeterli").
- **Veritabanını elle değiştirirsen** (SQL ile satır ekleyip silmek) bellek bilmez; sunucuyu yeniden başlat ya da
  `yukle()` çağrılsın.
- **Anahtar listesi üç yerde:** `OZELLIKLER`, şemadaki `CHECK` ve bölümdeki `YOL` (adres → özellik). Yeni özellik eklemek
  yeni bir şema dosyası (CHECK'i genişletmek), bu dosyada yeni satır ve bölümde yol eşlemesi ister.
- **Kapatmak veri silmez:** yalnız erişimi keser. Zamanlayıcılardan ödev hatırlatması ([../../hatirlatma.md](../../hatirlatma.md))
  kendi içinde `kapaliMi(…, 'odev')`'ye bakar; telefonun servis saatleri ve servis konumu da ([../../bolumler/cihaz.md](../../bolumler/cihaz.md))
  öyle. Kapalıyken yeni ödev verilemez, var olan ödevler yerinde durur.
- **Eşzamanlı iki kayıt:** aynı okul için iki `yaz` aynı anda gelirse (iki müdür; `READ COMMITTED`) ikinci işlemin
  `DELETE`'i birincinin YENİ eklediği satırları görmez. İki liste aynı anahtarı içeriyorsa ikincisi birincil anahtar
  çakışmasıyla (`23505`) reddedilir; ortak anahtar yoksa ikisi de başarılı olur ve tabloda iki listenin BİRLEŞİMİ kalır,
  bellek ise yalnız son biten `yaz`'ın listesini tutar. Bu ayrılık bir sonraki `yukle()`'ye (yeniden başlatma) kadar
  sürer. Olasılık çok düşük; kod değiştirilmedi.
- **Yönetici etkilenmez:** bölüm `admin` rolünü hiç reddetmez; bu dosya rol bilmez.
- **Güvenlik:** değerler parametreyle; `yaz` bilinmeyen anahtarları sessizce atar (bölüm ayrıca 400 verir).

## Testleri

- `testler/test-ozellikler.js` — müdürün 8 özelliği görmesi, öğretmen/öğrencinin giremediği, bilinmeyen özelliğin reddi,
  ödev ve etüdün kapatılması (öğretmen ödev listesine giremez, yeni ödev verilemez, ödeve ek yüklenemez, sınavlar açık
  kalır), `/api/me`'nin kapalı listeyi söylemesi, ilerleyiş ve takvimde ödevin gelmemesi, teslim dosyası ve quiz
  uçlarının kapanması, devamsızlığın veli için de kapanması, velinin menüsü, yeniden açınca her şeyin yerinde olması,
  işlem kaydı, servis (telefon konumu, iki okullu veli, kapalı okuldaki çocuğun haritası, telefonun bildirim yoklaması).
- İçeri aktarımdan sonraki `yukle()` için ayrı bir test yok (`testler/test-yedek.js` kapalı özellikleri denetlemiyor).
- Elle: müdür olarak "Anketler"i kapat → öğretmen menüsünden Anketler kalkmalı, `/api/anketler` 403 `ozellikKapali:
  'anket'` dönmeli; yeniden aç → eski anketler görünmeli.

## Son durum

- Tek commit: `f2330da commit 430` (2026-09-26) — dosya 022 şema dosyasıyla bu hâliyle eklendi.
- Bilinen açıklar (kod değiştirilmedi): belleğin tek süreçlik olması (bilinçli karar); eşzamanlı iki `yaz`'da tablo ile
  belleğin ayrışabilmesi (Dikkat!).
- Sıradaki planlı işler (DEVAM.md 4. bölüm): "Eğitim içerikleri", "Başarılarım", "Anket düzenleyici" gibi yeni bölümler
  gelirse okulun kapatabileceği özellik listesine eklenmeleri istenebilir (yeni anahtar = yeni şema dosyası + bu
  dosyada satır). "Sistem" işindeki "bakım modu" site genelinde bir kapatmadır ve bu okul bazlı düzenden ayrı
  tutulmalıdır.
