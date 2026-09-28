# sunucu/veri/baglanti.js

PostgreSQL'e giden tek kapı: bağlantı havuzu, `sorgu`/`tek`/`calistir`, iç içe geçebilen `islem`, tarih/saat tür
dönüşümleri, Türkçe sıralama eki `tr()` ve veritabanı hatalarını kullanıcıya gösterilecek Türkçe cevaba çeviren `hataCevir`.

## Bu dosya ne yapar?

Uygulamanın veritabanıyla konuştuğu her şey sonunda bu dosyadan geçer. Bütün istekler tek bir `pg.Pool`'u paylaşır; depo
dosyaları (`sunucu/veri/depo/*.js`) SQL'lerini buradaki `sorgu`, `tek` ve `calistir` ile çalıştırır. Değerler her zaman
`$1, $2 …` parametresiyle gider, SQL metnine yapıştırılmaz: SQL enjeksiyonuna karşı asıl koruma budur ve
`testler/sql-denetimi.js` bütün kodda bunu denetler.

İkinci büyük iş `islem(fn)`: bir işin bütün sorguları ya birlikte yazılır ya hiç yazılmaz (ör. bir ödev 30 öğrenciye ya
hepsine gider ya hiçbirine). İşin güzel yanı, işlem içindeki kodun bağlantıyı elden ele taşımaması: `AsyncLocalStorage`
sayesinde `islem` içinde çağrılan her `sorgu` kendiliğinden o işlemin bağlantısını kullanır. Depo işlevleri "işlemde miyim"
diye bilmek zorunda değildir.

Üçüncü iş hata çevirisi: PostgreSQL bir kısıtı ihlal edince (tekillik, yabancı anahtar, uzunluk…) istemciye tablo ya da
kısıt adı değil, "Bu kayıt zaten var" gibi Türkçe ve anlaşılır bir cevap gider; ayrıntı yalnız sunucu günlüğüne yazılır.
Tekillik çakışmalarında hangi form alanı olduğu da söylenir (`alan`), ön yüz o kutuyu kırmızı gösterir.

## İçinde neler var?

### Tür dönüşümleri (dosya yüklenince bir kez)

Uygulama tarih ve saatleri metin olarak kullanır; `pg`'nin ayrıştırıcıları buna göre değiştirilir (bütün süreç için
geçerlidir, `pg`'yi kullanan her yer etkilenir):

| PostgreSQL türü | Uygulamaya gelen | Neden |
|---|---|---|
| `date` | `'2026-09-25'` (dokunulmaz) | JavaScript `Date`'e çevrilse saat dilimi yüzünden bir gün kayabilirdi |
| `time` | `'12:00'` (saniyesiz, `slice(0, 5)`) | ön yüz `SS:DD` bekler |
| `timestamptz` | ISO metni (`toISOString()`, UTC, `Z` ile biter) | API baştan beri ISO metin kullanıyor |
| `numeric` | `parseFloat` ile sayı | not, ağırlık, koordinat |
| `int8` (`bigint`, `count(*)`) | `Number` | `count(*)` metin olarak gelmesin |

### Havuz ve ayarı

- `baglantiAyari()` (iç) — `DATABASE_URL` ortam değişkeni varsa `{ connectionString }`; yoksa
  [../ayarlar.md](../ayarlar.md)'deki `ayarlar.veritabani` (`data/ayarlar.json`; `araclar/veritabani-kur.js` yazar):
  `sunucu` (varsayılan `localhost`), `port` (varsayılan 5432), `kullanici`, `sifre`, `ad`. Ayar yoksa ya da `kullanici`
  boşsa hata fırlatır: "Veritabanı ayarı yok. Önce kurulum yapılmalı: npm run veritabani-kur" (sunucu/index.js bu metni
  tanıyıp kuruluş komutunu gösterir).
- `havuzuAc()` — havuzu ilk çağrıda açar, sonra aynısını döner. Ayarlar: en çok 10 bağlantı, boşta 30 sn bekleyen bağlantı
  kapanır, bağlantı kurmak için 5 sn beklenir, ve her bağlantıya `-c timezone=UTC -c statement_timeout=15000` gider:
  oturum saat dilimi UTC, 15 saniyeyi aşan TEK bir komut kesilir. Havuzun `error` olayı yakalanır: boştaki bir bağlantı
  koparsa (veritabanı yeniden başladı vb.) süreç çökmez, günlüğe "Veritabanı bağlantı hatası" yazılır. Dışa açık ama
  bugün bu dosya dışında çağıran yok.
- `aktifIstemci()` (iç) — işlem içindeysek o işlemin bağlantısı, değilsek havuz.

### Sorgu işlevleri

- `sorgu(sql, parametreler)` → satır dizisi.
- `tek(sql, parametreler)` → ilk satır ya da `null`.
- `calistir(sql, parametreler)` → etkilenen satır sayısı (`rowCount`; UPDATE/DELETE için).
- `metinCalistir(sqlMetni)` — parametresiz, noktalı virgülle ayrılmış çok komutlu SQL metni. Yalnız şema dosyaları
  ([sema.md](sema.md)) ve içeri aktarmadaki `TRUNCATE` ([json-aktarim.md](json-aktarim.md)) için; kullanıcıdan gelen bir şey
  asla buraya girmemeli.

### `islem(fn)`

`fn`'yi tek bir işlemde çalıştırır ve `fn`'nin döndürdüğünü döner. Havuzdan bir bağlantı alır, `BEGIN`, `fn` bu bağlantı
"bağlam"dayken çalışır, sonra `COMMIT`. `fn` hata fırlatırsa `ROLLBACK` (o da başarısızsa yutulur, bağlantı zaten kopmuştur)
ve hata aynen yukarı atılır. Her durumda bağlantı havuza bırakılır. Zaten bir işlemin içindeyken çağrılırsa yeni işlem
açmaz, `fn()`'yi doğrudan çalıştırır: dıştaki işleme katılır. Yalıtım düzeyi PostgreSQL'in varsayılanıdır (READ COMMITTED);
satır kilidi isteyen depolar `FOR UPDATE` kullanır.

### Türkçe sıralama

- `tr()` — `' COLLATE "tr-x-icu"'` ya da (ICU yoksa) boş metin. Depolar `ORDER BY ad_soyad' + tr()` gibi kullanır ki
  "Cem < Çağ < Işık < İpek" sırası doğru olsun. Kullananlar: `depo/etutler.js`, `depo/kullanicilar.js`, `depo/okullar.js`,
  `depo/roller.js`, `depo/sinavlar.js`, `depo/siniflar.js`.
- `turkceSiralamaKontrol()` — `pg_collation`'da `tr-x-icu` var mı bakar, sonucu saklar ve döner. Açılışta bir kez
  [index.md](index.md)'deki `baslat` çağırır. ICU yoksa sıralama bayt sırasına düşer, uygulama yine çalışır.

### Yardımcılar

- `veritabaniAdi()` — bağlanılan veritabanının adı (`ad` ya da `DATABASE_URL`'nin yolu; ayrıştırılamazsa `''`). "Yalnız
  adı `_test` ile biten veritabanı sıfırlanır" korumaları bunu kullanır: [sema.md](sema.md)'deki `testIcinSifirla`,
  `araclar/yuk-testi.js` ve testler.
- `kapat()` — havuzu kapatır ve unutur (sonraki `sorgu` yeni bir havuz açar). Sunucu kapanırken (`SIGINT`/`SIGTERM`,
  [../index.md](../index.md)) ve araçlar/testler işini bitirince çağrılır.

### Hata çevirisi

- `HATA_KODLARI` (iç) — PostgreSQL hata kodu → `[HTTP kodu, ileti]`: `23505` 400 "Bu kayıt zaten var", `23503` 400 "Bağlı
  olduğu kayıt bulunamadı ya da silinmiş", `23514` ve `22P02` 400 "Geçersiz değer", `23502` 400 "Eksik bilgi", `22001` 400
  "Metin çok uzun", `22003` 400 "Sayı izin verilen aralığın dışında", `22007`/`22008` 400 "Geçersiz tarih", `40001`/`40P01`
  (serileştirme hatası, kilitlenme) 503 "Aynı anda başka bir işlem yapıldı, tekrar dene", `57014` (zaman aşımı, ör. 15 sn
  sınırı) 503 "İşlem çok uzun sürdü, tekrar dene".
- `BAGLANTI_HATALARI` (iç) — Node'un ağ hataları (`ECONNREFUSED`, `ECONNRESET`, `ETIMEDOUT`, `ENOTFOUND`) ve PostgreSQL'in
  "kapanıyor / açılıyor / bağlanamadı" kodları (`57P01`, `57P03`, `08001`, `08006`): hepsi 503 "Veritabanına şu an
  ulaşılamıyor, biraz sonra tekrar dene".
- `CAKISMALAR` (iç) — 031 şema dosyasındaki tekil indeks adı → `[alan, ileti]`: `kullanicilar_eposta_key` → `eposta`;
  `kullanicilar_kadi_okul`, `kullanicilar_kadi_genel`, `kullanicilar_kadi_yonetici` → `kullaniciAdi`; `kullanicilar_tc_okul`,
  `kullanicilar_tc_genel`, `kullanicilar_tc_ogrenci` → `tc` (öğrencininki "Öğrenci ekle"den doğum tarihiyle eklemeyi
  önerir); `kullanicilar_okul_no` → `okulNo`; `kullanicilar_ana_okul` → `kod` ("Bu kişinin bu okulda zaten bir rolü var.");
  `okullar_kisa_ad` → `kisaAd`; `okullar_meb_kodu_tekil` → `okul`.
- `cakisma(err)` — hata `23505` ve kısıt adı listedeyse `{ alan, mesaj }`, yoksa `null`. Bölümler bunu yakalayıp kendi
  iletisini seçer (ör. kayıtta "Bu e-posta bu arada başka bir hesaba kaydedilmiş.").
- `hataCevir(err)` — sırasıyla: kodu yoksa `null`; bağlantı hatasıysa 503; bilinen çakışmaysa `{ kod: 400, mesaj, alan }`;
  tablodaysa oradaki; beş karakterli başka bir PostgreSQL koduysa 500 "Sunucu hatası"; değilse `null` (veritabanı hatası
  değil, çağıran kendi yolunu izlesin). Dönüş: `{ kod, mesaj }` ya da `{ kod, mesaj, alan }` ya da `null`.

Dışa açılanlar: `sorgu`, `tek`, `calistir`, `islem`, `metinCalistir`, `veritabaniAdi`, `kapat`, `havuzuAc`, `tr`,
`turkceSiralamaKontrol`, `hataCevir`, `cakisma`.

## Kimle konuşur?

- Çağırdıkları: `pg` (tek npm bağımlılığı; `Pool`, `types`), Node'un `async_hooks` → `AsyncLocalStorage`,
  [../ayarlar.md](../ayarlar.md) → `ayarlar.veritabani`.
- Onu çağıranlar:
  - Bütün depo dosyaları (`sunucu/veri/depo/*.js`, 28 dosya) — çoğu `sorgu`, `tek`, `calistir`, bir kısmı `islem` ve `tr`.
  - [index.md](index.md) — `turkceSiralamaKontrol`, `tek`; `islem`, `kapat`, `hataCevir`, `cakisma`'yı uygulamaya aynen
    dışa açar. Uygulamanın geri kalanı bu dosyayı doğrudan değil, `require('../veri')` üzerinden alır:
    [../index.md](../index.md) API hata yakalayıcısında `hataCevir`; `hesaplar`, `kayit`, `kisi-aktarim`, `yonetici-okul`
    bölümleri `cakisma`; on iki bölüm `islem` (ör. [../bolumler/odev.md](../bolumler/odev.md),
    [../bolumler/quiz.md](../bolumler/quiz.md), [../bolumler/kayit.md](../bolumler/kayit.md)).
  - [sema.md](sema.md) — `sorgu`, `islem`, `metinCalistir`, `veritabaniAdi`.
  - [json-aktarim.md](json-aktarim.md) — `sorgu`, `islem`, `metinCalistir`; [yazici.md](yazici.md) — `calistir`;
    [yedek.md](yedek.md) — `cakisma`.
  - Araçlar: `araclar/deneme-okulu.js` (`islem`, `kapat`), `araclar/yuk-testi.js` (`veritabaniAdi` ile `_test` koruması,
    `sorgu`, `tek`, `kapat`).
  - Testler (doğrudan `require('../sunucu/veri/baglanti')`): `test-admin-gizli`, `test-cakisma`, `test-kisi-kodu`,
    `test-odev-dosya`, `test-okul-agi`, `test-okul-disk`, `test-quiz`, `test-servis-yoklama`, `test-site-ayarlari`,
    `test-yonetici-dosyasi` — hepsi yalnız adı `_test` ile biten veritabanına bağlanır.
- Tablolar: kendisi yalnız `pg_collation`'a bakar; geri kalan her tablo depolar üzerinden.

## Nasıl çalışır (adım adım)?

### İşlem içindeki bir sorgu

```
bölüm: await islem(async () => {            islemBaglami boş mu?
          await depo.odevler.ekle(...)  ──►   evet: havuzdan bağlantı al, BEGIN
          await depo.genel.topluBildir(...)        islemBaglami.run(istemci, fn)
       })                                             depo → sorgu() → aktifIstemci()
                                                         = islemBaglami.getStore() (aynı bağlantı)
                                                   fn bitti → COMMIT / hata → ROLLBACK, hata yukarı
                                                   finally: bağlantıyı havuza bırak
```

İç içe: `islem` içinde bir depo işlevi yine `islem` çağırırsa (ör. `depo/quiz.js`), ikinci çağrı `getStore()` dolu
olduğu için yeni `BEGIN` yazmaz; bütün iş tek işlemdir.

### Bir API hatasının yolculuğu

```
depo → pg hata { code: '23505', constraint: 'kullanicilar_eposta_key' }
  bölüm yakalamadıysa → sunucu/index.js .catch → hataCevir(err)
     → { kod: 400, mesaj: 'Bu e-posta başka bir hesapta kayıtlı.', alan: 'eposta' }
     → istemciye { error, alan }; 5xx ise ayrıntı günlüğe
```

## Dikkat!

- **SQL yalnız `sunucu/veri/` altında, değerler yalnız parametreyle.** `sorgu`'nun ilk argümanına kullanıcıdan gelen hiçbir
  şey birleştirilmez; tablo/sütun adı gerekiyorsa [yazici.md](yazici.md)'deki `adDogrula`'dan geçer. `testler/sql-denetimi.js`
  ilk argümanın yalnız sabit metin, BÜYÜK_HARFLİ sabit, `tr()`, `kosul` gibi izinli parçalardan kurulduğunu denetler.
- **İç içe `islem` kayıt noktası (SAVEPOINT) açmaz.** İçteki işte bir sorgu hata verirse PostgreSQL bütün işlemi "bozuk"
  sayar; dıştaki kod hatayı yakalayıp devam etmeye kalkarsa sonraki her sorgu "current transaction is aborted" hatası
  alır. İşlem içinde hata yakalanacaksa (ör. `cakisma` ile) yakalama `islem`'in DIŞINDA olmalı — bugünkü bölümler öyle
  yapıyor (`hesaplar.js`, `kayit.js`, `kisi-aktarim.js`, `yonetici-okul.js`).
- **İşlem içinden `await`'siz sorgu başlatma.** `AsyncLocalStorage` bağlamı sonradan çalışan işlere de geçer: `islem`
  içinde `await` edilmeden başlatılan bir sorgu (ya da `setTimeout` içindeki) işlem bittikten, bağlantı havuza döndükten
  sonra çalışırsa o bağlantıyı kullanmaya çalışır. İşlem içindeki her sorguyu `await` et; arka plan işini `islem`'in dışında
  başlat.
- **Aynı işlemde `Promise.all` paralel değildir:** tek bağlantı olduğu için `pg` sorguları sıraya koyar. Doğru çalışır ama
  hız kazandırmaz.
- **15 saniye sınırı her komut için geçerli:** uzun bir şema dosyası komutu ya da büyük bir geri yüklemedeki tek bir
  komut 15 sn'yi geçerse `57014` ile kesilir (işlem geri alınır). Şema dosyası yazarken büyük tablolarda toplu `UPDATE`'e
  dikkat: sunucu açılamaz. Kilit bekleyen istekler de bu süreyi aşarsa 503 "İşlem çok uzun sürdü" alır.
- **Havuz dolunca 500 döner, 503 değil:** 10 bağlantının hepsi meşgulken 5 sn içinde bağlantı alınamazsa `pg-pool`
  kodsuz bir `Error` ("timeout exceeded when trying to connect") fırlatır; `hataCevir` kodsuz hatada `null` döndüğü için
  bu istek genel yoldan 500 "Sunucu hatası" alır, "biraz sonra tekrar dene" iletisi gitmez. (`node_modules/pg-pool` 3.14.0
  koduna bakılarak yazıldı; test yok.) Havuzu dolduran bilinen bir iş: yedek alınırken
  [json-aktarim.md](json-aktarim.md)'deki `disaAktar` 67 `SELECT`'i birden gönderir, bu sorgular bitene kadar 10
  bağlantının hepsini tutar.
- **Saat dilimi:** veritabanı oturumu UTC'dir (`timezone=UTC`); `now()` ve `timestamptz` hesapları UTC yapılır. Yerel saatle
  (Türkiye) hesap gereken yerler (son teslim, servis saatleri) bunu uygulamada kendi yapar.
- **`tr()` açılıştan önce `COLLATE` ekler:** `trSiralamaVar` başta `true`'dur; `turkceSiralamaKontrol` çağrılmadan (yani
  `baslat` çalışmadan) depo kullanan bir araç ICU'suz bir veritabanında `tr()` kullanan sorguda hata alır. Sunucuda sorun
  yok (açılışta denetlenir).
- **`int8` → `Number`:** 2^53'ten büyük sayılar kesinliğini yitirir; bugünkü `bigint` sütunlar (sayaç, bayt boyutu) bunun
  çok altında.
- **Tür ayrıştırıcıları süreç geneli:** bu dosya yüklenince aynı süreçte `pg` kullanan her şey (testlerdeki doğrudan
  sorgular da) tarihleri metin olarak alır.
- **Kısıt adı dışarı sızmaz:** `hataCevir` yalnız Türkçe ileti ve alan adı döner. Yeni bir tekil indeks eklersen
  `CAKISMALAR`'a da ekle; eklemezsen genel "Bu kayıt zaten var" gider (hangi kutu olduğu söylenmez).

## Testleri

- `testler/test-cakisma.js` — "VERİTABANI DÜZEYİ" bölümü uygulama denetimini atlayıp çift e-posta, kullanıcı adı, T.C. ve
  yönetici adı yazar; `hataCevir`'in doğru `alan`'ı (`eposta`, `kullaniciAdi`, `tc`) döndüğünü ve aynı anda gelen
  isteklerde sunucunun 500 vermediğini dener.
- `testler/sql-denetimi.js` (sunucusuz, `tumtest.sh` sonunda) — parametre kuralı.
- Dolaylı olarak bütün test paketleri: her istek bu dosyadan geçer; `tumtest.sh` sunucuyu `_test` veritabanıyla açar.
- Elle: PostgreSQL servisini durdurup bir sayfa yenile → 503 "Veritabanına şu an ulaşılamıyor…" görmelisin; sunucu çökmemeli.

## Son durum

- Son değişiklik `276c0a0 commit 521` (2026-09-27): `CAKISMALAR` tablosu, `cakisma(err)` işlevi ve `hataCevir`'in
  tekillik çakışmasında `{ alan }` dönmesi eklendi (031 şema dosyasıyla gelen çakışma işi). Öncesi: `713c269 commit 103`
  (2026-08-29) ve dosyanın ilk hâli `4a7ca51 commit 8` (2026-08-28).
- Bilinen açıklar: havuz zaman aşımının 500'e düşmesi (yukarıda). Kod değiştirilmedi.
- Planlı işlerden "Optimizasyon + saklama süreleri" (ölçek raporu) havuz boyutu ve sorgu sürelerine dokunabilir;
  "Güvenlik denetimi" bu dosyanın hata çevirisini de gözden geçirecek.
