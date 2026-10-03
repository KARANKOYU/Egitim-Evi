# testler/test-yedek.js

Yönetim panelindeki yedeklemeyi uçtan uca deneyen sunuculu test paketi (32 denetim): elle yedek alma, listeleme, indirme, yol kaçışı,
yetki, geri yükleme (yeni tablolar dahil her şeyin geri gelmesi, `/admin` çerezinin ve telefon anahtarının korunması, yedekte olmayan
oturumun kapanması), olmayan yedek ve silme.

## Bu dosya ne yapar?

Eğitim Evi'nin bütün verisi her gün (ve yönetici isterse elle) tek bir JSON dosyasına yedeklenir; yönetici bu dosyayı yönetim
panelinin **Yedekleme** ekranından indirir, geri yükler ya da siler ([../sunucu/veri/yedek.md](../sunucu/veri/yedek.md),
[../sunucu/veri/json-aktarim.md](../sunucu/veri/json-aktarim.md)). Geri yükleme yıkıcı bir iştir: yedekten sonra yapılan her şey
gider. Bu yüzden iki şeyin kesin doğru çalışması gerekir: (1) yedek gerçekten HER ŞEYİ taşımalı (yeni bir tablo eklenip yedeğe
eklenmeyi unutulursa o veri sessizce kaybolur), (2) geri yükleme yöneticiyi panelden atmamalı, telefonlardaki uygulama anahtarlarını
bozmamalı.

Bu paket önce veritabanına "yedeğe girmesi gereken" her türden bir şey yazar (gizli bir anket ve oyu, yemek listesi, servis ve
durakları, servisçinin düzenlediği sıra ve servis saatleri, kulüp ve üyeliği, dosya yüklemeli ödev ve yüklenmiş teslim dosyası,
doğru şıklı bir quiz ve öğrencinin bitmiş denemesi, okulun disk sınırı), sonra elle yedek alır, yedekten sonra bir şeyleri
değiştirir, yedeği geri yükler ve hepsinin yedekteki hâline döndüğüne tek tek bakar. Dosyanın başındaki yorum bunu "Yeni tablolar
da yedeğe girsin" diye özetliyor: yedeğe yeni bir tablo ekleyen her iş buraya bir hazırlık adımı ve bir "geri geldi" denetimi ekler.

## İçinde neler var?

### Yardımcılar

- `kontrol(ad, sart, detay)` — her denetim bir satır: `GECTI <ad>` ya da `KALDI <ad> -> <detay>`; sayaçlar `gecti`, `kaldi`.
- Ortak yardımcılar [giris.md](giris.md) üzerinden ([../araclar/giris.md](../araclar/giris.md)): `iste` (JSON istek), `girisYap`
  (şifre + gerekirse günlükten iki adımlı kod), `okulHesabi` (okulun hesap açması; şifre verildiği için şifre değişimi istenmez,
  aydınlatma metni onaylanır).
- Dosya yükleme, `/admin` ve telefon anahtarı istekleri `iste` ile değil doğrudan `fetch` ile yapılır; adres her seferinde
  `process.env.EE_BASE || 'http://localhost:3000'` (`TABAN` adıyla da bir kez).
- `yarin` — yarının tarihi (`toISOString().slice(0, 10)`, UTC'ye göre); anketin bitişi, yemek günü ve ödevlerin son teslimi.

### Hesaplar ve veriler

Sunucunun ilk yöneticisi (`T`; test sunucusunda şifresi `EE_ADMIN_SIFRE` ile verilir) ve seed'den ([seed.md](seed.md)): müdür (`M0`, sonra `mudur`,
`mudur2`, `M3`), Matematik öğretmeni `mat` (adı "Ayşe Kaya"; okul kimliği `okulId` buradan alınır), öğrenciler `ogrenci1` (`o1`,
sonra `o1b`) ve `ogrenci2` (`o2`). Paketin yarattıkları:

| Ne | Kim | Ayrıntı |
|---|---|---|
| Anket "Yedek anketi" | müdür | seçenekler "Bir", "İki"; hedef yalnız öğrenciler; **gizli**; bitişi yarın. `o1` "İki"ye oy verir |
| Yemek listesi | müdür | yarın: menü "Yedek çorbası\nPilav", 700 kalori |
| Servis "Yedek servisi" | müdür | şoför telefonu `0532 000 11 22`, sabah 07:15; `o1` "Köşe", `o2` "Park" durağında |
| Servisçi `yedeksrv<sayı>` ("Yedek Sürücü") | müdür (`okulHesabi`) | servise şoför olarak bağlanır; servisçi sabah sırasını `[o2, o1]` yapar |
| Servis saatleri | müdür | sabah 00:00–11:30, akşam 12:00–23:59 (seed'de sabah 11:59'a kadar) |
| Kulüp "Yedek kulübü" | müdür | danışman `mat`, kontenjan 12; `o1` katılır |
| Ödev "Yedek ödevi" | `mat` | yalnız `o1`'e, `dosyaYukleme: true`; `o1` `yedek.txt` ("yedek dosyası") yükler |
| Quizli ödev "Yedek quizi" | `mat` | bütün quiz için 20 dk, "çıkınca kapanır", sonuç "hemen"; iki soru: çoktan seçmeli (a ve c doğru) ve açık uçlu. `o1` başlar, a ile c'yi seçer, açık uca "Yedekteki cevap" yazar, bitirir |
| Okulun disk sınırı | yönetici | yedekten önce 3072 MB (3 GB) |

### 1) Yedek alma (4)

`POST /api/admin/backup-now` → 200 ve `yedek.ad` dolu; `yedek.boyut > 100` bayt. `GET /api/admin/backups` → liste boş değil ve
yeni yedek (`yedek-elle-<tarih>_<saatdakika>.json`) listede.

### 2) İndirme (3)

`GET /api/admin/backup-download?ad=<ad>` → 200; içerik JSON ve `users` bir dizi; `schools` içindeki seed okulunun `diskSiniriMb`'si
3072 (şema 035'in alanı yedeğe giriyor).

### 3) Yol kaçışı (2)

İndirmede `ad=../../server.js`, silmede `{ ad: '../db.json' }`: ikisi de 400 ya da 404 olmalı. Sunucu adda harf, rakam, `.`, `_`, `-`
dışındaki her şeyi siler ve `^yedek-.*\.json$` arar; bugün iki istek de 400 "Geçersiz yedek adı" alır.

### 4) Yetki (2)

Müdür `GET /api/admin/backups` ve `POST /api/admin/backup-now` çağırırsa 404 (403 değil): yönetici uçları yönetici olmayana
bilinmeyen adresle aynı cevabı verir ([../sunucu/api.md](../sunucu/api.md)).

### 5) Geri yükleme (6)

1. Yedekten SONRA bir değişiklik: müdür "YEDEK-DENEME" sınıfını açar (200 denetlenir); yönetici disk sınırını 4096 MB yapar.
2. Yöneticinin oturumu (`T`) yedekten önce açıldığı için yedekte de var. `GET /api/me` cevabının `Set-Cookie` başlığından
   `ee_yonetim=<64 onaltılık>` çerezi alınır; bu çerezle `GET /admin` 200.
3. `POST /api/admin/backup-restore { ad }` → 200.
4. Cevapta `oturumKaldi: true`; AYNI çerezle `GET /admin` yine 200 ve sayfada "Sayfa bulunamadı" yok (geri yüklemeden sonra panel
   yenilenince 404'e düşülmez; [../sunucu/yonetim-cerezi.md](../sunucu/yonetim-cerezi.md)).
5. Müdür yeniden girer: sınıf listesinde "YEDEK-DENEME" yok.
6. Yedek listesinde `yedek-geri-alma-` ile başlayan bir dosya var (geri yüklemeden hemen önceki hâl).

### 5b) Yeni tablolar geri geldi (12)

Paket müdür (`mudur2`, `M3`), `o1` (`o1b`) ve `mat` (`matB`) ile yeniden girer ve bakar. 4. bölümde açılan `mudur` oturumu
yedekten SONRA açıldığı için geri yüklemede kapandı; paket onunla devam edemez, müdürle yeniden girer. `M0`, `mat`, `o1` ve
servisçinin ilk oturumları ise yedekten önce açıldığı için geçerli kaldı: bu yeniden girişler aslında zorunlu değil, `M0` da iş
görürdü (denetimde 3200'de ayrı bir betikle denendi: yedekten önce açılan müdür oturumu geri yüklemeden sonra `/api/me` 200, sonra
açılanı 401).

- **Anket:** `GET /api/anketler/sonuc?id=` (müdür) → `gizli: true`, `oySayisi: 1`, `sayimlar: null` (gizli anket açıkken sayımlar
  gösterilmez).
- **Yemek:** `GET /api/yemek?bas=<yarın>` (`o1`) → menü ve 700 kalori aynen.
- **Servis:** `GET /api/servis` (`o1`) → `benim.durak` "Köşe", `soforTel` `+905320001122` (sunucu biçimine çevrilmiş), `sabah` 07:15.
- **Kulüp:** `GET /api/kulupler` (`o1`) → `uyesin`, `kontenjan: 12`, `danisman: 'Ayşe Kaya'`.
- **Disk sınırı:** `GET /api/admin/overview` → seed okulunun `disk.siniriMb` 3072 (sonradan verilen 4096 değil), `disk.ozel: true`.
- **Teslim dosyası:** `GET /api/odev-dosya?odev=` (`o1`) → `yedek.txt` kaydı aynı kimlikle var; `dosyaYukleme: true` ve
  `yukleyebilir: true` (ödevin dosya yükleme izni yedeğe giriyor).
- **Quiz (öğretmen):** `GET /api/assignments/<id>/quiz` (`mat`) → `sureTuru: 'quiz'`, `toplamDk: 20`, `cikincaKapanir`,
  `sonucGorunum: 'hemen'`, iki soru, ilk soruda iki doğru şık, ikinci sorunun metni, `kilitli: true` (bir öğrenci başlamış).
- **Quiz (öğrenci):** aynı uç (`o1`) → `durum: 'bitti'`, `sonucAcik`, `dogruSayisi: 1`, `puanliSayisi: 1` (açık uçlu puana
  girmez), ikinci sorunun cevabı "Yedekteki cevap".
- **Servis saatleri ve sıra:** `GET /api/servis` (müdür) → `saatler.sabahBit` 11:30; sabah sırasında `o2` 1., `o1` 2.
- **Telefon anahtarı:** servisçi girer, `POST /api/cihaz { ad: 'Geri yükleme telefonu' }` ile `cihazAnahtari` alır (yedekten SONRA).
  Sonra yönetici YENİ bir oturumla (`T2`, yedekte yok) aynı yedeği bir daha geri yükler: 200 ve
  `GET /api/cihaz/ayar` (`X-Cihaz: <anahtar>`) 200. Anahtarlar yedekte yoktur; geri yüklemede sahibi hâlâ varsa korunur.
- **Yedekte olmayan oturum:** ikinci geri yüklemenin cevabında `oturumKaldi: false` ve iletide "yeniden giriş"; `T2` ile
  `GET /api/me` 401 (ön yüz bu durumda giriş sayfasına döner).

### 6) Bozuk yedek (1)

`POST /api/admin/backup-restore { ad: 'yedek-yok-boyle.json' }` → 400 ("Yedek bulunamadı"; indirmede aynı durum 404'tür).

### 7) Silme (2)

`POST /api/admin/backup-delete { ad }` → 200 ve cevaptaki `yedekler` listesinde o ad yok.

Sonunda boş satır ve `GECTI: 32   KALDI: 0`; `KALDI` varsa çıkış kodu 1. Beklenmeyen hata `TEST HATASI:` ile, çıkış kodu 1.

## Kimle konuşur?

- **Modüller:** [giris.md](giris.md) (`iste`, `girisYap`, `okulHesabi`); Node'un yerleşik `fetch`'i. Sunucu modülü `require` etmez:
  her şey HTTP üzerinden.
- **Sunucu uçları:**

  | Uç | Ne için | Belge |
  |---|---|---|
  | `POST /api/admin/backup-now`, `GET /api/admin/backups`, `GET /api/admin/backup-download?ad=`, `POST /api/admin/backup-restore { ad }`, `POST /api/admin/backup-delete { ad }` | yedekleme | [../sunucu/bolumler/yonetici.md](../sunucu/bolumler/yonetici.md) |
  | `POST /api/admin/okul-disk-siniri { okulId, mb }`, `GET /api/admin/overview` | okulun disk sınırı | [../sunucu/bolumler/okul-disk.md](../sunucu/bolumler/okul-disk.md), [../sunucu/bolumler/yonetici.md](../sunucu/bolumler/yonetici.md) |
  | `GET /api/me` (yöneticiye `Set-Cookie: ee_yonetim=…`), `GET /admin` | yönetim çerezi | [../sunucu/bolumler/kayit.md](../sunucu/bolumler/kayit.md), [../sunucu/yonetim-cerezi.md](../sunucu/yonetim-cerezi.md), [../sunucu/http.md](../sunucu/http.md) |
  | `POST /api/anketler`, `GET /api/anketler`, `POST /api/anketler/oy`, `GET /api/anketler/sonuc?id=` | anket | [../sunucu/bolumler/anket.md](../sunucu/bolumler/anket.md) |
  | `POST/GET /api/yemek`, `POST /api/servis/kaydet`, `/servis/ogrenci`, `/servis/sira`, `/servis/saatler`, `GET /api/servis`, `POST /api/kulupler/kaydet`, `/kulupler/katil`, `GET /api/kulupler` | okul hayatı | [../sunucu/bolumler/okul-hayati.md](../sunucu/bolumler/okul-hayati.md) |
  | `POST /api/assignments`, `POST /api/odev-dosya/yukle?odev=`, `GET /api/odev-dosya?odev=` | ödev ve teslim dosyası | [../sunucu/bolumler/odev.md](../sunucu/bolumler/odev.md), [../sunucu/bolumler/odev-dosya.md](../sunucu/bolumler/odev-dosya.md) |
  | `GET /api/assignments/<id>/quiz`, `POST …/quiz/basla`, `…/quiz/cevap`, `…/quiz/bitir` | quiz | [../sunucu/bolumler/quiz.md](../sunucu/bolumler/quiz.md) |
  | `POST /api/cihaz { ad }`, `GET /api/cihaz/ayar` (`X-Cihaz`) | telefon uygulamasının anahtarı | [../sunucu/bolumler/cihaz.md](../sunucu/bolumler/cihaz.md) |
  | `POST /api/school/hesap-ac` (`okulHesabi`), `POST /api/school/class`, `GET /api/school/classes` | servisçi hesabı, geçici sınıf | [../sunucu/bolumler/hesaplar.md](../sunucu/bolumler/hesaplar.md), [../sunucu/bolumler/okul.md](../sunucu/bolumler/okul.md) |

- **Koruduğu kod:**
  - [../sunucu/veri/yedek.md](../sunucu/veri/yedek.md) — `yedekAl` (elle yedeğin `yedek-elle-` adı), `yedekListesi`,
    `yedekGeriYukle` (ad temizliği ve deseni, "Yedek bulunamadı", önce `yedek-geri-alma-` kopyası).
  - [../sunucu/veri/json-aktarim.md](../sunucu/veri/json-aktarim.md) — `disaAktar` / `iceAktar`: `TABLOLAR` listesi (anket, yemek,
    servis, kulüp, teslim dosyası, quiz tabloları), okulun `diskSiniriMb`'si, servis saatleri ve sırası, ödevin `dosyaYukleme`'si;
    geri yüklemede push aboneliklerinin, cihaz anahtarlarının ve `/admin` çerezlerinin (oturumu yedekte varsa) korunması;
    [../sunucu/veri/esleme.md](../sunucu/veri/esleme.md) — yedeğe giren alanlar.
  - [../sunucu/bolumler/yonetici.md](../sunucu/bolumler/yonetici.md) — yedek uçları ve geri yüklemenin `oturumKaldi`'si;
    [../sunucu/api.md](../sunucu/api.md) — yönetici ucunun müdüre 404 vermesi; [../sunucu/yonetim-cerezi.md](../sunucu/yonetim-cerezi.md)
    ve [../sunucu/http.md](../sunucu/http.md) — çerezle `/admin`'in açılması.
- **Tablolar:** uçlar üzerinden yedeğin bütün tabloları (`TABLOLAR`); ayrıca `cihaz_anahtarlari`, `yonetim_cerezleri`, `oturumlar`.
  Disk: `testler/testdata/yedek/` (yedek dosyaları), `testler/testdata/dosyalar/` (teslim dosyası).
- **Ön yüz** (bu pakette tarayıcı yok): yönetim panelinin Yedekleme ekranı
  [../public/js/yonetim/09-yonetici.md](../public/js/yonetim/09-yonetici.md) — `yedek-al`, `yedek-indir`, `yedek-geri` (cevaptaki
  `oturumKaldi` doğruysa sayfayı yeniler, değilse sitenin ana adresine döner), `yedek-sil`.
- **Onu çalıştıran:** `testler/tumtest.sh`, sunuculu paketlerde `test-kapsam`'dan sonra, `test-aktarim`'dan önce; her paketten önce
  `egitimevi_test` sıfırlanır ve seed yeniden yazılır. Ek ortam değişkeni almaz.

## Nasıl çalışır (adım adım)?

```
T (yönetici, yedekten ÖNCE), M0, mat, o1 girer
hazırlık: anket+oy, yemek, servis+durak, servisçi+sıra, servis saatleri, kulüp+üyelik,
          dosyalı ödev + yedek.txt, quizli ödev + bitmiş deneme, okul disk sınırı 3 GB
1) backup-now ─► yedek-elle-…json ─► backups listesinde
2) backup-download ─► users[] ; schools[okul].diskSiniriMb = 3072
3) ../../server.js, ../db.json ─► 400
4) müdür: backups, backup-now ─► 404
5) YEDEK-DENEME sınıfı + disk 4 GB ─► /api/me'den ee_yonetim ─► /admin 200
   backup-restore (T) ─► oturumKaldi ─► /admin hâlâ 200 ─► sınıf yok ─► yedek-geri-alma-… var
5b) yeniden gir ─► anket, yemek, servis, kulüp, disk 3 GB, teslim, izin, quiz, deneme, saatler+sıra
    servisçi cihaz anahtarı alır ─► T2 (yedekte yok) ile ikinci restore ─► anahtar çalışıyor, T2 401
6) olmayan yedek ─► 400
7) backup-delete ─► listeden düştü
```

## Dikkat!

- **Hazırlık adımları denetlenmez; hata yanlış yerde görünür.** Hazırlık istekleri cevaplarının durumuna bakılmadan yapılır. Yemek,
  servis, servisçi sırası ya da kulüp isteği başarısız olursa paket "yedeğe girmedi" der gibi 5b'de `KALDI` verir. Anket, ödev, quiz ya
  da teslim dosyası isteği başarısız olursa paket cevabın içine doğrudan girdiği için (`anket.body.id`, `.body.assignment.id`,
  `qb.sorular[0]`, `dosya.id`) daha 1. bölüme gelmeden `TEST HATASI` ile durur. 3 Ekim'de aynı sunucuda (sıfırlamadan) ikinci kez
  koşuldu: `GECTI: 30   KALDI: 2` — "kulüp, danışmanı ve üyeliği geri geldi" ve "servis saatleri ve sabah sırası geri geldi" (sıra
  `{}`). Asıl neden yedek değil, okulda "Yedek kulübü" ve "Yedek servisi" adlarının zaten olması ("Bu adda bir kulüp/servis zaten
  var"): `kulup.body.id` ve `servis.body.id` boş kaldı. Her koşudan önce sunucuyu sıfırla.
- **Geri yükleme yedekten sonra açılan oturumları kapatır** (`oturumlar` tablosu yedektekiyle değiştirilir). Yedekten önce açılanlar
  (`T`, `M0`, `mat`, `o1`, servisçinin ilk oturumu) geçerli kalır; 4. bölümdeki `mudur` ilk geri yüklemede, 5b'de yedekten sonra açılan
  bütün oturumlar (`mudur2`, `M3`, `o1b`, `matB`, `srv2`, `T2`) ikinci geri yüklemede kapanır. 6. ve 7. bölüm bu yüzden `T` ile yapılır.
  Bölümlerin sırasını değiştirirsen hangi oturumun yedekte olduğuna dikkat et.
- **Yedek adları dakikaya kadardır; aynı dakikadaki ikinci yedek ilkinin ÜSTÜNE yazar.** `yedekAdi` saniye içermez ve sunucunun
  yerel saatini kullanır: `yedek-elle-…_SSDD.json`, `yedek-geri-alma-…_SSDD.json`. Paket iki geri yükleme yapar; paket birkaç saniye
  sürdüğü için ikisi neredeyse her zaman aynı dakikaya düşer (dakika sınırına denk gelirse iki ayrı dosya olur). 3 Ekim'deki
  koşularda (denetimdeki koşu dahil) klasörde yalnız BİR `yedek-geri-alma-…` dosyası kaldı (ikincisi birincinin üstüne yazdı). Test bunu sorun saymaz
  (yalnız "en az bir geri-alma kopyası var" der), ama gerçek kullanımda şu anlama gelir: yönetici bir yedeği geri yükleyip aynı dakika
  içinde başka bir yedeği daha geri yüklerse, İLK geri yüklemeden önceki hâl kaybolur (kod okumasına ve klasördeki sonuca göre; kod
  değiştirilmedi). Aynı dakikada iki elle yedek de tek dosya olur.
- **Günlük yedek zamanlayıcısı araya girebilir.** Sunucu açıldıktan 20 saniye sonra (sonra 6 saatte bir) "son otomatik yedek 20 saatten
  eskiyse" `yedek-<tarih>.json` alır. `tumtest.sh`'te seed ve bu paket o 20 saniyeye denk gelebilir; 3 Ekim'deki ikinci denemede günlük
  yedek tam geri yüklemelerden sonra alındı. Denetimler `some` ile baktığı için etkilenmez, ama klasörün içeriği koşudan koşuya değişir.
- **Yol kaçışı denetimi gevşek.** 400'ün yanında 404'ü de kabul eder; bugünkü kodda iki istek de ad temizliği yüzünden 400 alır. Asıl
  güvence sunucudaki temizlik + desen + `path.join(YEDEK_KLASOR, ad)`'dır.
- **Yetki yalnız iki uçla ve yalnız müdürle denenir.** İndirme, geri yükleme ve silme yetkisiz kişiyle bu pakette denenmez;
  `testler/yetki-denetimi.js` liste ve elle yedeği her rolle, `testler/test-admin-gizli.js` geri yüklemenin yönetici olmayana bilinmeyen
  adres cevabını dener.
- **Teslim dosyasının yalnız KAYDI denenir.** JSON yedek dosyaların kendisini taşımaz (`data/dosyalar/` ayrıca yedeklenmeli; KILAVUZ);
  dosya geri yüklemede diskten silinmediği için kayıt geri gelince dosya da yerinde olur. Site ayarları da yedeğe girmez; bu paket onlara
  bakmaz.
- **Sonuçta veritabanı yedekteki hâlde kalır** (geçici sınıf yok, disk sınırı 3 GB), elle yedek silinir; geri-alma kopyası ve (alındıysa)
  günlük yedek `testler/testdata/yedek/`'te durur. `tumtest.sh` sonraki paketten önce hepsini siler.
- **Kulüp tabloları planlı olarak kalkacak** (aşağıda "Son durum"): o iş yapılırken buradaki kulüp hazırlığı ve denetimi de çıkarılmalı.
  Çıkarılmazsa yalnız bir denetim düşmez: 5b `GET /api/kulupler` cevabının `kulupler` dizisinde doğrudan `find` çağırdığı için uç
  kalkınca paket `TEST HATASI` ile durur ve sonraki denetimler hiç koşmaz (kod okumasına göre).
- **Varsayılan adres 3000.** `EE_BASE` vermezsen istekler 3000'deki sunucuna gider; seed hesapları orada yoksa ilk girişte
  `TEST HATASI` ile durur. Paket yedek alıp GERİ YÜKLEYEN bir pakettir: gerçek veriyle çalışan bir sunucuya asla yöneltme, her zaman
  `EE_BASE` ile sıfırlanmış test sunucusunu ver.

## Testleri

- Bu dosyanın kendisi testtir; `testler/tumtest.sh` her tam koşuda çalıştırır. Aynı alanda: [test-admin-gizli.md](test-admin-gizli.md)
  (yönetim kodunun `app.js`'e girmemesi, `backup-restore`'un yönetici olmayana 404'ü), [yetki-denetimi.md](yetki-denetimi.md) (yedek
  listesi ve elle yedek yalnız yöneticiye), [test-cakisma.md](test-cakisma.md) ("YEDEKTEN GERİ YÜKLEME": içine çift kullanıcı adı,
  T.C. ve e-posta konmuş bir yedeğin aktarımın ayıklamasıyla tekillik hatası vermeden yüklenmesi; `iceAktar`'ı süreç içinden çağırır),
  [test-okul-disk.md](test-okul-disk.md) (disk sınırının kendisi).
- Elle (Git Bash, proje kökünde): sunucu 3200'de sıfırlanmış `egitimevi_test` ve [seed.md](seed.md) ile açık olmalı, bu paket o
  veritabanında daha önce koşmamış olmalı:

  ```
  EE_BASE=http://localhost:3200 EE_LOG=testler/test-sunucu.log node testler/test-yedek.js
  ```

  Tarayıcıda: yönetim panelinde **Yedekleme → Yedek al**, bir sınıf aç, yedeği **Geri yükle**: sayfa yenilenmeli, sınıf gitmeli,
  listede `yedek-geri-alma-…` görünmeli.
- 3 Ekim 2026'da bu belge için 3200'de (sıfırlanmış `egitimevi_test`, seed) koşuldu: `GECTI: 32   KALDI: 0`, yaklaşık 6 saniye; sunucu
  günlüğünde `API hatası` ya da `Veritabanı hatası` yoktu. Sıfırlayıp hemen ardından iki kez koşulunca ilki 32/0, ikincisi 30/2
  ("Dikkat!"teki kulüp/servis adı). Belge denetiminde (aynı gün) yeniden koşuldu ve aynı sonuçlar alındı: temiz veritabanında 32/0
  (~8 sn), ardından aynı veritabanında 30/2; ilk koşudan sonra `testler/testdata/yedek/`'te bir günlük yedek ve tek bir
  `yedek-geri-alma-…` dosyası vardı.

## Son durum

- `git log`: 7 commit. Son üçü (hepsi 2026-09-27):
  - `40fc7e7 commit 525` (okul disk sınırı) — yedekten önce okulun disk sınırı 3072 MB yapılır, yedekten sonra 4096; indirilen
    yedekte `diskSiniriMb: 3072` ve geri yüklemeden sonra `overview`'da yine 3072 (`ozel: true`) denetimleri eklendi.
  - `566b917 commit 524` (canlı hazırlık) — "Yedek ödevi" `dosyaYukleme: true` ile verilir; "ödevin dosya yükleme izni geri geldi
    (açık)" denetimi eklendi.
  - `276c0a0 commit 521` (gizli `/admin`) — müdürün yedek uçlarına erişimi 403 yerine 404 bekleniyor; geri yüklemeden önce ve sonra
    aynı `ee_yonetim` çereziyle `/admin`'in açılması; ikinci geri yükleme artık yedekten sonra açılmış yeni bir yönetici oturumuyla
    (`T2`) yapılır ve `oturumKaldi: false`, "yeniden giriş" iletisi, `T2`'nin 401'i denetlenir.
- Öncesi: `3b8fd36 commit 519` (quiz: quizli ödev, öğrencinin denemesi ve cevaplarının geri gelmesi), `24050a2 commit 518` (servis
  yoklaması: servisçi, sabah sırası, servis saatleri ve geri yüklemeden sonra telefon anahtarının çalışması), `d5e5d5b commit 195`
  (2026-09-25; paketin asıl gövdesi: yedek alma, indirme, yol kaçışı, yetki, geri yükleme, anket/yemek/servis/kulüp/teslim dosyası,
  bozuk yedek, silme) ve dosyanın ilk hâli `198df21 commit 194` (2026-09-25; yalnız `kontrol` iskeleti).
- Açık iş: aynı dakikadaki ikinci geri yüklemenin geri-alma kopyasını ezmesi ("Dikkat!"). Kod değiştirilmedi.
- Planlı işlerden bu dosyayı etkileyecekler:
  - **"Optimizasyon + saklama süreleri … günlük yedek .tar.gz"** — sunucunun yedeği JSON yerine akışla yazılan `.tar.gz` olacak
    (en yeni 7 otomatik + elle alınanlar; geri yükleme eski `.json`'ları da okuyacak). 2. bölümdeki "içerik geçerli JSON, `users`
    dizisi" denetimi ve `yedek-*.json` ad deseni değişir; tanım `tar -xzf` ile açılabildiğinin testte gösterilmesini istiyor.
  - **"KULÜPLER KALDIRILACAK"** — kulüp hazırlığı ve "kulüp, danışmanı ve üyeliği geri geldi" denetimi çıkar.
  - **"Paneller /panel/admin ve /panel/destek …"** — `/admin` adresi `/panel/admin`'e taşınacak, `/admin` bilinmeyen adres olacak:
    5. bölümdeki iki `/admin` isteği ve çerezin yolu değişir; okulun disk sınırı da `/duzenle` okul sayfasına geçebilir.
  - **"Sistem: yöneticiye ZORUNLU TOTP"** — paket yöneticiyle e-posta koduyla girer (`girisYap`); doğrulama uygulaması zorunlu olunca
    giriş yolu değişir.
  - **"Güvenlik denetimi"** (okulun verdiği her şifrede ilk girişte değiştirme) — servisçi `okulHesabi` ile şifresi verilerek açılıyor ve
    hemen sırayı düzenliyor; kural gelince servisçi önce kendi şifresini koymalı (yardımcı ya da paket buna göre değişir).
  - "Yıl geçişi"ndeki okul yedeği (.7z, okul başına) bu paketin denediği sunucu yedeğinden ayrı bir özellik olarak tanımlandı; bu dosyaya
    doğrudan dokunması beklenmez.
