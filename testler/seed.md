# testler/seed.js

Her sunuculu test paketinden önce boş test veritabanına temel okulu kurar: "Test Ortaokulu" ve müdürü, iki öğretmen, iki
öğrenci, 6-A sınıfı ve dersleri, beş ödev (ikisi sonuçlandırılmış) ve günün her saatinde açık servis saatleri.

## Bu dosya ne yapar?

Test paketleri boş bir veritabanıyla başlar (`testler/tumtest.sh` her paketten önce sunucuyu `EE_DB_SIFIRLA=1` ile açar,
yalnız adı `_test` ile biten veritabanı sıfırlanır). Ama hemen her test "bir okul, bir müdür, bir öğretmen, bir öğrenci"
ister. Her paket bunu kendisi kursa aynı yirmi satır elli yerde tekrarlanırdı. Bu dosya o ortak başlangıcı bir kez kurar;
`tumtest.sh` onu her sunuculu paketten ve iki sunuculu denetimden hemen önce çalıştırır (tam bir koşuda 41 paket + 2 denetim
= 43 kez).

Önemli olan, verinin **gerçek uçlardan** geçmesi: veritabanına doğrudan hiçbir şey yazılmaz. Müdür önce yetişkin hesabı
açar, e-posta onay bağlantısına "tıklar", kişi kodunu yöneticiye verir, yönetici okulu açıp onu müdür yapar; öğretmen kendi
hesabını açıp kişi kodunu müdüre verir; öğrenci hesabını okul açar. Yani seed çalışabiliyorsa kayıt, onay, iki adımlı
giriş, kişi kodu ve okul açma yolları da çalışıyor demektir; bir paketin "SEED BASARISIZ" olması çoğu zaman bu temel
yollardan birinin bozulduğunu söyler.

Testler dışında da kullanılır: ekran görüntüsü verisini kuran araçlar ([../araclar/zengin-veri.md](../araclar/zengin-veri.md),
[../araclar/gorsel-veri.md](../araclar/gorsel-veri.md)) önce bunun çalışmış olmasını ister; [debug-hazirlik.md](debug-hazirlik.md)
ve [hazirlik-aktarim.md](hazirlik-aktarim.md) da bu hesaplarla girer.

## İçinde neler var?

### Yardımcılar

- `BASE` — `EE_BASE` ya da `http://localhost:3000`. [giris.md](giris.md)'deki `BASE` ile aynı kural, ayrı bir kopya.
- `api(yol, method = 'GET', body = null, token = null)` — `fetch(BASE + '/api' + yol)`; her istekte
  `Content-Type: application/json`, varsa `Authorization: Bearer <token>`. Cevap JSON değilse `{ raw: <metin> }`.
  **Ortak `iste`'den farkı:** cevap 2xx değilse hata fırlatır: `"POST /school/class -> 400 Bu adda bir sınıf zaten var"`
  gibi (yöntem, yol, durum, sunucunun `error`'u ya da cevabın ilk 120 karakteri). Böylece bir adım bozulunca seed hemen
  durur, sessizce eksik veri kurmaz.
- `gun(n)` — bugünden `n` gün sonrası (eksiyse öncesi), `YYYY-AA-GG` metni. `toISOString()` ile yazıldığı için UTC
  takvim günüdür ("Dikkat!"e bak).

Giriş ve hesap açma işleri [giris.md](giris.md) üzerinden `araclar/giris.js`'ten gelir: `girisYap`, `hesapAc`,
`okulHesabi`, `mudurYap` ([../araclar/giris.md](../araclar/giris.md)).

### Kurduğu veri

Hesaplar (hepsi uydurma test verisi; şifreler herkese açık depoda yazılı test değerleridir):

| Kim | Giriş (e-posta / kullanıcı adı) | Şifre | Nasıl doğar |
|---|---|---|---|
| Sistem yöneticisi | `admin@egitimevi.com` / `admin` | `admin123` | Seed açmaz: sunucu boş veritabanında ilk açılışta kendisi kurar, şifreyi `EE_ADMIN_SIFRE`'den alır ([../sunucu/veri/index.md](../sunucu/veri/index.md)). Seed yalnız girer. |
| Müdür Mehmet Demir | `mudur@test.com` / `mudur` | `Test1234!` | `hesapAc` (kayıt + e-posta onayı) → `mudurYap` (kişi kodu → `POST /api/admin/okul-ac`) |
| Matematik öğretmeni Ayşe Kaya | `mat@test.com` / `mat` | `Test1234!` | `okulHesabi(müdür, 'teacher', …, brans: 'Matematik')` → `ogretmenYap` |
| Fen öğretmeni Ali Yıldız | `fen@test.com` / `fen` | `Test1234!` | aynı yol, `brans: 'Fen Bilimleri'` |
| Öğrenci Zeynep Şahin | `ogrenci1@test.com` / `ogrenci1` | `Test1234!` | `okulHesabi(müdür, 'student', …, dogum: '2011-05-10')`; T.C. no `tcUret()` ile rastgele |
| Öğrenci Burak Öztürk | `ogrenci2@test.com` / `ogrenci2` | `Test1234!` | aynı yol |

Okul: **Test Ortaokulu**, Ankara / Çankaya, kısa adı (adresi) `test-ortaokulu` (`/school/test-ortaokulu`). Okul onaylı ve
müdürlü açıldığı için `GET /api/schools?city=Ankara` listesinde görünür (seed okulun kimliğini oradan bulup yazdırır).

Okulun içi:

- **Servis saatleri:** sabah 00:00–11:59, akşam 12:00–23:59. Günün her anında bir servis dönemi açık olsun diye; aralık
  dışını deneyen paket aralığı kendisi daraltıp sonra geri açar (dosyadaki yorum).
- **Sınıf 6-A**, iki öğrenci de içinde.
- **Dersler:** öğretmen listesindeki her öğretmen (rolü `teacher` olan; müdür atlanır) için 6-A'da kendi branşının dersi,
  haftada 4 saat, o öğretmene atanmış: Matematik (Ayşe Kaya), Fen Bilimleri (Ali Yıldız). Öğrenci–öğretmen ilişkisi yalnız
  sınıf ve ders üzerinden kurulur; "öğrenciyi öğretmene ata" diye bir adım yok (dosyadaki yorum).
- **Beş ödev** (her biri öğretmenin ulaşabildiği bütün öğrencilere, yani 6-A'nın ikisine; ders gönderilmez, sunucu
  öğretmenin branşını alır; son teslim saati gönderilmediği için sunucunun varsayılanı 12:00):

  | Öğretmen | Ödev | Açıklama | Başlangıç | Son teslim | Durum |
  |---|---|---|---|---|---|
  | Ayşe Kaya | Kesirler alıştırması | Sayfa 42-45 arası tüm sorular | `gun(-10)` | `gun(-3)` | sonuçlandırıldı |
  | Ayşe Kaya | Üslü sayılar testi | Testi çözüp getir | `gun(-2)` | `gun(5)` | açık |
  | Ayşe Kaya | Geometri problemleri | Üçgenler konusu | `gun(0)` | `gun(12)` | açık |
  | Ali Yıldız | Bitki hücresi çizimi | A4 kağıda renkli çizim | `gun(-8)` | `gun(-1)` | sonuçlandırıldı |
  | Ali Yıldız | Güneş sistemi maketi | Grup çalışması | `gun(-1)` | `gun(20)` | açık |

  Sonuçlandırılan iki ödevde sonuçlar `['yapti', 'yapmadi', 'eksik', 'izinli']` dizisinden sırayla dağıtılır; öğrenci sırası
  ödev ayrıntısının ad sırasıdır (Burak, Zeynep). Bugünkü iki öğrenciyle: "Kesirler alıştırması" Burak `yapti`, Zeynep
  `yapmadi`; "Bitki hücresi çizimi" Burak `yapmadi`, Zeynep `eksik`.

### Ekrana yazdıkları

Adım adım `admin girisi OK`, `mudur atandi`, `okul id: …`, servis saatleri, `ogretmenler eklendi`, öğrencilerin **veli
kodları** (uzunluklarıyla; bugün 16), `sinif 7-A kuruldu, dersler ogretmenlere baglandi` (yanlış ad, aşağıda),
`5 odev olusturuldu`, iki `sonuclandi:` satırı, `ogrenci1`'in `/api/progress`'teki ödev listesi (ders, ad, durum, sonuç, son
teslim) ve sonunda dört giriş bilgisi. Hata olursa `HATA: <ileti>` ve çıkış kodu 1.

## Kimle konuşur?

- **Çağırdıkları:** [giris.md](giris.md) → `araclar/giris.js` (`girisYap`, `hesapAc`, `okulHesabi`, `mudurYap`); genel
  `fetch` (Node 18+).
- **Sunucu uçları** (sırayla):

  | Uç | Ne için | Bölüm |
  |---|---|---|
  | `GET /api/challenge`, `POST /api/login`, `POST /api/login/dogrula` | her giriş (`girisYap`) | [../sunucu/bolumler/kayit.md](../sunucu/bolumler/kayit.md) |
  | `POST /api/register`, `POST /api/eposta-onay` | müdürün ve öğretmenlerin yetişkin hesabı (`hesapAc`) | [../sunucu/bolumler/kayit.md](../sunucu/bolumler/kayit.md) |
  | `GET /api/kisilikler` | kişi kodu (`mudurYap`, `ogretmenYap`) | [../sunucu/bolumler/kisilik.md](../sunucu/bolumler/kisilik.md) |
  | `POST /api/admin/okul-ac` | yönetici okulu açar, müdürü atar | [../sunucu/bolumler/yonetici-okul.md](../sunucu/bolumler/yonetici-okul.md) |
  | `POST /api/logout` | `mudurYap` ve `ogretmenYap` içinde | [../sunucu/bolumler/kayit.md](../sunucu/bolumler/kayit.md) |
  | `GET /api/schools?city=Ankara` | okulun kimliğini bulmak | [../sunucu/bolumler/kayit.md](../sunucu/bolumler/kayit.md) |
  | `POST /api/servis/saatler` | servis saatleri | [../sunucu/bolumler/okul-hayati.md](../sunucu/bolumler/okul-hayati.md) |
  | `POST /api/school/ogretmen-ekle`, `POST /api/school/hesap-ac` | öğretmeni kodla ekleme, öğrenci hesabı | [../sunucu/bolumler/hesaplar.md](../sunucu/bolumler/hesaplar.md) |
  | `POST /api/kvkk-onay` | öğrencinin ilk girişinde aydınlatma onayı (`okulHesabi`, gerekirse) | [../sunucu/bolumler/kayit.md](../sunucu/bolumler/kayit.md) |
  | `POST /api/school/class`, `GET /api/school/teacher-list`, `POST /api/school/lesson`, `POST /api/school/lesson-update`, `GET /api/school/students`, `POST /api/school/class-assign` | sınıf, dersler, öğretmen ataması, öğrencileri sınıfa koyma | [../sunucu/bolumler/okul.md](../sunucu/bolumler/okul.md) |
  | `GET /api/assignments/hedefler`, `POST /api/assignments`, `GET /api/assignments/<id>`, `POST /api/assignments/<id>/finish` | ödevler ve sonuçlandırma | [../sunucu/bolumler/odev.md](../sunucu/bolumler/odev.md) |
  | `GET /api/progress` | öğrencinin ödev listesini yazdırmak | [../sunucu/bolumler/ilerleyis.md](../sunucu/bolumler/ilerleyis.md) |

- **Onu çalıştıranlar:** `testler/tumtest.sh` — sunuculu her paketten önce ve `yetki-denetimi` ile `girdi-denetimi`'nden
  önce, `EE_BASE=http://localhost:3200 EE_LOG=testler/test-sunucu.log` ile; çıktısı atılır (`>/dev/null`).
- **Hesaplarına güvenenler:** `testler/` altında seed dışında `mudur@test.com` 42 dosyada, `mat@test.com` 29,
  `admin@egitimevi.com` 26, `ogrenci1@test.com` 21, `fen@test.com` ve `ogrenci2@test.com` 9'ar dosyada geçiyor (3 Ekim'de
  `git grep` ile sayıldı). `test-adresler`, `test-etut`, `test-okul-disk`, `test-servis-yoklama`, `test-site-ayarlari` okulun
  adını ya da `test-ortaokulu` adresini kullanır. Araçlardan `zengin-veri.js`, `gorsel-veri.js` ve `gezinti.js` bu hesaplarla
  girer; `gezinti-metin.js`'in fotoğraf altı metinleri de bu adları anar.
- **Tablolar:** doğrudan hiçbirine dokunmaz; uçlar üzerinden `kullanicilar`, `okullar`, `siniflar`, `dersler`, `odevler`,
  `odev_ogrencileri`, `eposta_onaylari`, `oturumlar`, `bildirimler` gibi tablolar dolar.

## Nasıl çalışır (adım adım)?

```
1) girisYap(admin@egitimevi.com, admin123)                         yönetici oturumu
2) hesapAc(mudur) ─► mudurYap(mudur, Test Ortaokulu, yönetici)       okul açıldı, müdür girdi
   GET /api/schools?city=Ankara ─► okul.id (yalnız yazdırmak için)
   POST /api/servis/saatler 00:00-11:59 / 12:00-23:59
3) her öğretmen: okulHesabi(müdür,'teacher') ─► ogretmenYap
       hesapAc ─► girisYap ─► kisiKodu ─► müdür ogretmen-ekle {kod, brans} ─► öğretmen logout
4) her öğrenci: okulHesabi(müdür,'student') ─► /api/school/hesap-ac {rol, tc, şifre, e-posta, doğum}
       ─► öğrenciyle bir giriş ─► aydınlatma eskiyse /api/kvkk-onay ─► veli kodu (h.code) not edilir
5) POST /school/class 6-A ─► teacher-list: her 'teacher' için lesson {6-A, branş, 4 saat} + lesson-update {teacherId}
   GET /school/students ─► her öğrenciye class-assign 6-A
6) mat ve fen girer ─► her ödev: hedefler ─► öğrencileri topla ─► POST /assignments
7) ödev 1 ve 4: GET /assignments/<id> ─► sonuçları dağıt ─► POST /assignments/<id>/finish
8) ogrenci1 girer ─► GET /progress ─► listeyi yaz ─► giriş bilgilerini yaz
```

Her adım bir öncekinin sonucuna dayanır; herhangi bir uç 2xx dışı dönerse `api` fırlatır, ana işlev `HATA: …` yazıp 1 ile
çıkar. `tumtest.sh` paket döngüsünde bunu "SEED BASARISIZ" diye yazar ve o paketi çalıştırmadan bir "kaldı" sayar.

## Dikkat!

- **Varsayılan adres 3000.** Hem bu dosyanın `BASE`'i hem `araclar/giris.js`'inki `EE_BASE` verilmezse
  `http://localhost:3000`'e, yani kendi (gerçek veritabanlı) sunucuna gider. Gerçek veritabanına müdür, öğretmen,
  öğrenci ve ödev açmamak için seed'i her zaman `EE_BASE=http://localhost:3200` ile, sıfırlanmış test sunucusuna çalıştır.
- **Yalnız boş veritabanında çalışır.** İkinci kez çalıştırırsan 2. adımda `hesapAc` "kayıt (mudur@test.com): Bu e-posta
  zaten kayıtlı. Giriş yapmayı dene." ile durur. Önce veritabanını sıfırla (`tumtest.sh` her pakette yapar).
- **Yönetici şifresi sunucudan gelir.** `admin123` ancak sunucu boş veritabanında `EE_ADMIN_SIFRE=admin123` ile açıldıysa
  doğrudur; yoksa sunucu rastgele bir şifre üretir ve seed 1. adımda "giriş 1. adım: 401" ile durur.
- **Kodlar günlükten okunur.** Müdür, öğretmen ve yönetici girişinde iki adımlı kod `EE_LOG`'daki sunucu günlüğünden
  alınır; sunucunun çıktısı o dosyaya gitmeli ve e-postası ayarsız olmalı ([giris.md](giris.md)).
- **`gun()` UTC günü verir.** Türkiye'de gece 00:00–03:00 arasında `gun(0)` dünün tarihini döner (`toISOString`). O saatte
  çalışan seed'de bütün ödev tarihleri bir gün geri kayar. 3 Ekim saat 02:16'da çalıştırıldığında öyle oldu: "Kesirler
  alıştırması"nın son teslimi yerel takvime göre 30 Eylül olması gerekirken `2026-09-29`, "Geometri problemleri"
  `2026-10-14` (yerel takvimle 15 Ekim) yazıldı. Testlerin çoğu göreli tarihlere baktığı için etkilenmez;
  [../araclar/zengin-veri.md](../araclar/zengin-veri.md) aynı kusuru taşır.
- **Yazdırılan sınıf adı yanlış.** 5. adımın sonunda "sinif 7-A kuruldu" yazar ama kurulan sınıf **6-A**'dır (koddaki ileti;
  kod değiştirilmedi).
- **Testler buradaki sayılara bağlı.** [guvenlik-test.md](guvenlik-test.md) `ogrenci1`'in `/api/progress`'inde tam **5** ödev
  bekler; birçok paket "Ayşe Kaya", "Ali Yıldız", `6-A`, `test-ortaokulu` gibi değerleri adıyla arar. Seed'e ödev, öğrenci ya
  da ders eklemeden önce bu değerleri `git grep` ile ara; sayıyı değiştirirsen o testleri de güncelle.
- **Öğrenci sırası ada göre.** Okulun öğrenci listesi ad sırasıyla gelir (Burak Öztürk, sonra Zeynep Şahin). Denetimler
  "ilk öğrenci" diye `students[0]`'ı alır; bu bugün `ogrenci2`'dir, giriş yapılan `ogrenci1` değil
  ([yetki-denetimi.md](yetki-denetimi.md), [girdi-denetimi.md](girdi-denetimi.md)).
- **`izinli` sonucu hiç verilmez.** Sonuç dizisi dört elemanlı ama iki öğrenci olduğu için yalnız ilk üçü kullanılır.
- **Öğrencinin e-postası var ama kodu yok.** Öğrenciler `@test.com` adresiyle açılır; sunucu öğrenciye iki adımlı kod
  göndermez, `girisYap` tek adımda biter.
- **Veli kodları ekrana basılır.** Elle çalıştırınca öğrencilerin veli kodları görünür; yalnız test veritabanındaki uydurma
  hesaplarındır. `tumtest.sh` çıktıyı zaten atar.
- **T.C. no her koşuda farklı.** `okulHesabi` T.C. no'yu `tcUret()` ile rastgele üretir; bir testin seed öğrencisinin T.C.
  no'suna ihtiyacı varsa onu uçtan okumalı.
- **Ders adları sabit listeden.** Dersin konusu öğretmenin branşıdır ve sunucunun sabit ders listesinde (`SUBJECTS`,
  [../sunucu/ortak.md](../sunucu/ortak.md)) olmalı; listede olmayan bir branş verirsen `POST /school/lesson` "Geçerli bir ders
  seç" ile reddeder.

## Testleri

- Seed'in kendine ait bir testi yok; ama `tumtest.sh`'in her sunuculu paketi ondan sonra çalıştığı için bir bozulma hemen
  görünür: paket döngüsünde çıkış kodu 0 değilse "SEED BASARISIZ" yazılır ve bir "kaldı" sayılır. (Denetim döngüsünde seed'in
  çıkış kodu denetlenmez; bkz. [girdi-denetimi.md](girdi-denetimi.md) "Dikkat!".)
- Elle (Git Bash, proje kökünde; 3200'deki test sunucusu `tumtest.sh`'deki gibi açık ve çıktısı
  `testler/test-sunucu.log`'a gidiyorken):

  ```
  EE_BASE=http://localhost:3200 EE_LOG=testler/test-sunucu.log node testler/seed.js
  ```

  Beklenen: `admin girisi OK`, `mudur atandi`, iki veli kodu, `5 odev olusturuldu`, iki `sonuclandi:` satırı ve
  `OGRENCI ODEVLERI (5 adet)`.
- 3 Ekim gecesi (02:16'dan başlayarak) 3200'de, her seferinde yeni sıfırlanmış test veritabanında beş kez çalıştırıldı
  (güvenlik testi, yetki denetimi, iki kez girdi denetimi ve `debug-hazirlik.js` öncesinde):
  her seferinde çıkış 0, yaklaşık 4 saniye. Çıktıda iki veli kodu (uzunluk 16), "Kesirler alıştırması" Burak `yapti` / Zeynep
  `yapmadi`, "Bitki hücresi çizimi" Burak `yapmadi` / Zeynep `eksik`; `ogrenci1`'in listesinde 5 ödev (Fen Bilimleri 2,
  Matematik 3; ikisi `finished`). Sunucu iş bitince kapatıldı.

## Son durum

- `git log`: 4 commit. `0c178e3 commit 289` (2026-09-25) dosyayı başlattı: `require('./giris')`, `BASE` ve fırlatan `api`
  yardımcısı. `bb20f57 commit 325` (2026-09-26) geri kalanını ekledi: `gun`, yönetici girişi, o günün müdür yolu ("rolsüz
  kayıt → okulunu kaydeder → yönetici onaylar" yorumuyla), öğretmenler ("eşleme kodu" yorumuyla), öğrenciler, 6-A ve
  dersler, beş ödev, iki sonuçlandırma, öğrenci görünümü.
- `0acca75 commit 516` (2026-09-27, kişi kodu ve portallar): yalnız yorumlar ve bir ileti — müdürün yolu artık "yetişkin
  hesabı → kişi kodu → yönetici okulu açıp onu müdür yapar (admin/okul-ac)", öğretmen "kişi kodunu verir", ekrandaki
  "mudur onaylandi" → "mudur atandi". (Asıl değişiklik `araclar/giris.js`'in `mudurYap`'ındaydı.)
- `24050a2 commit 518` (2026-09-27, servis yoklaması): servis saatlerini 00:00–11:59 / 12:00–23:59 yapan adım ve yorumu
  eklendi. O günden beri değişmedi.
- Bilinen açıklar (kod değiştirilmedi): "sinif 7-A" iletisi, `gun()`'ün UTC günü.
- Planlı işlerden bu dosyayı etkileyecekler: "Sistem" işindeki yöneticiye zorunlu doğrulama uygulaması (TOTP) — 1.
  adımdaki yönetici girişi günlükteki e-posta koduyla yapılamayacak; "T.C. kimlik no bütün hesaplarda zorunlu" (kod Linux'ta) —
  müdürün ve öğretmenlerin `hesapAc` kaydı T.C. no göndermeli; "Çalışan olarak ekleme" — kişi koduyla eklenen öğretmen rolsüz
  çalışan olarak gelecek, seed ona ayrıca Öğretmen rolü vermeli (tanımda veri modeli henüz seçilmedi; rolsüz çalışan
  `teacher-list`'te `teacher` rolüyle çıkmazsa 5. adımda hiç ders atanmaz, 6. adımdaki ödevler de verilemez ve seed durur); "Güvenlik denetimi"ndeki "okulun verdiği her şifre ilk girişte değişir" — öğrencilerin `Test1234!`'ü ilk
  girişte değiştirilmeli (`okulHesabi`'nin onay girişi ve bütün öğrenci girişleri buna göre); "Özel branş / ders" — ders adları
  sabit listeden çıkarsa 5. adım gözden geçirilmeli; "TAM DEBUG" (Linux) işi tohum veri olarak bu dosyayı kullanacak.
