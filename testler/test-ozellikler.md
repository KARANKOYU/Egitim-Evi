# testler/test-ozellikler.js

Müdürün okulunda bir bölümü kapatmasını (`/api/ozellikler`) uçtan uca deneyen sunuculu paket: yalnız müdürün görmesi, kapalı
bölümün bütün uçlarının 403 `ozellikKapali` dönmesi, karışık sayfaların kapalı bölümü atlaması, velinin çocuğun okuluna
bakması, başka okulun öğrenci kimliğiyle kapının atlatılamaması ve yeniden açınca kayıtların yerinde olması (31 denetim).

## Bu dosya ne yapar?

Her okul her bölümü kullanmaz; müdür Özellikler sayfasından ödevleri, sınavları, devamsızlığı, etüdü, servisi, yemek listesini,
kulüpleri ya da anketleri kapatabilir ([../sunucu/bolumler/ozellikler.md](../sunucu/bolumler/ozellikler.md)). Kapatmanın üç sözü
var ve bu paket üçünü de gerçek uçlarla dener:

1. **Kapalı bölüm gerçekten kapalıdır:** yalnız menüden kalkmaz, sunucu o bölümün her isteğini 403 `{ ozellikKapali: '<anahtar>' }`
   ile reddeder. Bu, tek bir kapıdan (`kapaliysaReddet`) değil birkaç yerden geçer: genel kapı, `api.js`'teki iki yükleme kapısı
   (ödev eki, teslim dosyası), telefonun `cihaz.js`'teki konum ucu ve "karışık" sayfaların (ilerleyiş, takvim, servis kartı)
   kendi süzgeçleri. Paket teslim dosyası yükleme kapısı dışında hepsine ayrı ayrı dokunur.
2. **Veli çocuğunun okuluna tabidir** ve istekteki öğrenci kimliği ancak kişinin bağlı olduğu çocuksa sayılır; yani bir
   servisçi ya da müdür isteğe servisi açık başka bir okulun öğrencisini ekleyerek kendi okulundaki kapalı bölümü açamaz.
3. **Kayıt silinmez:** yeniden açınca ödev de quizi de yerindedir.

Sıfırlanmış test veritabanında, seed'in okulunda çalışır; ikinci bir okul ve iki okullu bir veli de kendisi kurar.

## İçinde neler var?

### Yardımcılar ve hesaplar

- `kontrol(ad, sart, detay)` — `GECTI` / `KALDI` satırı; `J(x)` — `JSON.stringify(x).slice(0, 220)` (ayrıntı satırı ve bir
  denetimin kendisi bunu kullanır, "Dikkat!"e bak); `gun(n)` — bugünden `n` gün sonrası, `toISOString` ile (UTC günü).
- `z` — `Date.now().toString(36)`: bu koşunun adlarına eklenen ek (ödev başlığı, servis adı, veli, ikinci müdür, ikinci okul,
  yabancı öğrenci).
- **Seed hesapları** ([seed.md](seed.md)): müdür `mudur@test.com` (`M`), Matematik öğretmeni `mat@test.com` (`mat`), öğrenci
  `ogrenci1@test.com` (`o1`), sistem yöneticisi `admin@egitimevi.com` (şifresi test sunucusunun `EE_ADMIN_SIFRE`'si).
- **Paketin açtıkları** (hepsi uydurma test verisi; şifreler `Test1234!`):
  - veli `ozveli<z>` (`V`) — `hesapAc` ile rolsüz yetişkin açılır, `POST /api/parent/link { code: <o1'in kodu> }` ile `o1`'in
    velisi olur; 5. bölümde ikinci okuldaki öğrenciye de bağlanır;
  - servisçi `ozsrv<sayı>` (`S`; sayı `Date.now() % 100000`) — `okulHesabi(M, 'servisci', …)`;
  - ikinci müdür `ozmudur<z>` (`M2`) — `hesapAc` + `mudurYap` ile yönetici "Özellik Okulu <z>" (Ankara / Mamak) okulunu açıp
    onu müdür yapar;
  - yabancı öğrenci `ozogr<z>` — `okulHesabi(M2, 'student', …)`, ikinci okulun öğrencisi (servisi açık).
- Ortak yardımcılar [giris.md](giris.md) üzerinden ([../araclar/giris.md](../araclar/giris.md)): `BASE`, `iste`, `girisYap`,
  `hesapAc`, `okulHesabi`, `mudurYap`. İki tür istek `iste` yerine çıplak `fetch` ile gider: ödev eki yüklemesi (gövde JSON
  değil, dosyanın kendisi) ve `X-Cihaz` başlıklı telefon uçları (`servis-konum` iki kez, `bildirimler` bir kez; oturum değil,
  cihaz anahtarı).

### 1) Kim görür (5)

- Müdür `GET /api/ozellikler` → 200, 8 özelliğin hepsi `acik: true`.
- Öğretmen aynı uca → 403; öğrenci `POST /api/ozellikler { kapali: ['odev'] }` → 403.
- Müdür `{ kapali: ['mesaj'] }` → 400 (mesaj kapatılabilen bir bölüm değil: "Bilinmeyen özellik: mesaj").
- Kapatmadan önce öğretmen `o1`'e quizli bir ödev verir ("Özellik denemesi <z>", tek Doğru/Yanlış sorulu) → 200 ve cevapta
  `quiz` var. Bu ödev 4. bölümde "silinmemiş mi" diye aranacak.

### 2) Ödev ve etüt kapalı (11)

Müdür `{ kapali: ['odev', 'etut'] }` kaydeder; cevaptaki `kapali` tam olarak `['odev', 'etut']`. Sonra:

| Deneme | Kim | Beklenen |
|---|---|---|
| `GET /api/assignments` | öğretmen | 403, `ozellikKapali: 'odev'` |
| `POST /api/assignments` (yeni ödev) | öğretmen | 403 |
| `GET /api/etut` | öğretmen | 403, `ozellikKapali: 'etut'` |
| `GET /api/exams` | öğretmen | 200 (sınavlar açık kaldı) |
| `POST /api/ek/yukle?tur=odev` (gövde `%PDF-1.4`, `X-Dosya-Adi: kagit.pdf`) | öğretmen | 403 (`api.js`'in ayrı yükleme kapısı) |
| `GET /api/me` | öğrenci | `kapaliOzellikler` tam olarak `['odev', 'etut']` |
| `GET /api/progress` | öğrenci | 200, `assignments` boş, `kapaliOzellikler` içinde `odev` |
| `GET /api/takvim?yil=…&ay=…` (bu ay) | öğrenci | 200, hiçbir günde ödev yok (`odevler` boş, `olaylar`'da `tur: 'odev'` yok) |
| `GET /api/odev-dosya?odev=<id>` | öğrenci | 403 |
| quiz: öğrenci `GET …/quiz` ve `POST …/quiz/basla`, öğretmen `GET …/quiz` ve `POST …/quiz { quiz: null }`, öğretmen `POST /api/assignments/quiz-metin` (beşi aynı anda) | ikisi | hepsi 403, `ozellikKapali: 'odev'` |

### 3) Veli çocuğun okuluna bakar (3)

- Veli `GET /api/devamsizlik/ogrenci?studentId=<o1>` → 200 (açıkken).
- Müdür `{ kapali: ['odev', 'etut', 'devamsizlik'] }` kaydeder; aynı istek → 403, `ozellikKapali: 'devamsizlik'`.
- Velinin `GET /api/me` cevabındaki `kapaliOzellikler` içinde `devamsizlik` var (tek çocuğu var, onun okulunda kapalı).

### 4) Yeniden aç (4)

- Müdür `{ kapali: [] }` → 200, `kapali` boş.
- Öğretmenin ödev listesinde "Özellik denemesi <z>" duruyor; öğrenci `GET …/quiz` → 200, `soruSayisi === 1`.
- Müdür `GET /api/islem-kaydi` → cevabın (220 harfe kırpılmış) JSON'unda `okul.ozellik` geçiyor.

### 5) Servis kapalı: yoklama, sıra, not, binmeyecek, saatler, telefon (8)

Hazırlık: servisçi açılır ve girer; müdür "Özellik servisi <z>"i açıp servisçiyi atar (`soforId`), `o1`'i servise yazar;
servisçi `POST /api/servis/sefer-basla` ile seferi başlatır (seed servis saatlerini günün her anına açtığı için her saatte
olur); `POST /api/cihaz { ad: 'Servis telefonu' }` ile telefon anahtarı alır. Yönetici girer, ikinci okul ve yabancı öğrenci
kurulur.

- Servis açıkken telefon `POST /api/cihaz/servis-konum` (`X-Cihaz`, `{ seferId, enlem: 39.9, boylam: 32.8, dogruluk: 10 }`)
  → 200.
- Müdür `{ kapali: ['servis'] }` kaydeder. Yedi istek aynı anda, hepsi 403 `ozellikKapali: 'servis'`: servisçinin
  `GET /api/servis/yoklama`, `POST /api/servis/yoklama` (`bindi`), `POST /api/servis/sira`, `POST /api/servis/not`,
  `POST /api/servis/okula-vardik`; velinin `POST /api/servis/binmeyecek`; müdürün `POST /api/servis/saatler`.
- **Atlatma denemesi** (altı istek, hepsi 403 `servis`): servisçi `GET /api/servis/yoklama?ogrenci=<yabancı>`,
  `POST /api/servis/sira`, `sefer-basla` ve `okula-vardik` gövdesine `ogrenciId: <yabancı>`; müdür `saatler` gövdesine
  aynısı; servisçi `GET /api/servis/harita?ogrenci=<yabancı>`. Yabancı öğrencinin okulunda servis açık ama kişiler ona bağlı
  olmadığı için kapı kendi okullarına bakar.
- **İki okullu veli:** veli yabancı öğrenciye de bağlanır (`parent/link { code }`). `GET /api/servis` (çocuk seçmeden) → 200;
  `o1`'in kartında `servis: null` ve `bugun: null`, yabancı öğrencinin kartı var.
- Aynı veli `GET /api/servis/harita?ogrenci=<o1>` → 403 `servis` (belli bir çocuk seçildi, onun okulu kapalı).
- Telefonun konum isteği yeniden → 403 `ozellikKapali: 'servis'` (`cihaz.js`'in kendi kapısı).
- Telefon `GET /api/cihaz/bildirimler` → 200 ama `servisSaatleri === null` (bildirim yoklaması sürer, kapalı okulun saatleri
  gelmez).
- Müdür `{ kapali: [] }`; servisçi `GET /api/servis/yoklama` → 200.

Toplam 5 + 11 + 3 + 4 + 8 = 31. Sonunda `GECTI: 31   KALDI: 0`; `KALDI` varsa çıkış kodu 1; beklenmeyen hata `TEST HATASI:`
ile iletiyi ve yığını yazar.

## Kimle konuşur?

- **Modüller:** yalnız [giris.md](giris.md) (`araclar/giris.js`); Node'un genel `fetch`'i.
- **Sunucu uçları:**

  | Uç | Ne için | Belge |
  |---|---|---|
  | `GET/POST /api/ozellikler` | denenen bölüm | [../sunucu/bolumler/ozellikler.md](../sunucu/bolumler/ozellikler.md) |
  | `GET/POST /api/assignments`, `…/quiz`, `…/quiz/basla`, `POST /api/assignments/quiz-metin` | ödev ve quiz kapısı | [../sunucu/bolumler/odev.md](../sunucu/bolumler/odev.md), [../sunucu/bolumler/quiz.md](../sunucu/bolumler/quiz.md) |
  | `POST /api/ek/yukle?tur=odev` | ödev eki kapısı | [../sunucu/bolumler/ekler.md](../sunucu/bolumler/ekler.md) |
  | `GET /api/odev-dosya?odev=` | teslim dosyaları | [../sunucu/bolumler/odev-dosya.md](../sunucu/bolumler/odev-dosya.md) |
  | `GET /api/etut`, `GET /api/exams` | etüt kapalı, sınav açık | [../sunucu/bolumler/etut.md](../sunucu/bolumler/etut.md), [../sunucu/bolumler/sinav.md](../sunucu/bolumler/sinav.md) |
  | `GET /api/progress` | ilerleyişin kendi süzgeci | [../sunucu/bolumler/ilerleyis.md](../sunucu/bolumler/ilerleyis.md) |
  | `GET /api/takvim` | takvimin kendi süzgeci | [../sunucu/bolumler/takvim.md](../sunucu/bolumler/takvim.md) |
  | `GET /api/devamsizlik/ogrenci` | veli kuralı | [../sunucu/bolumler/devamsizlik.md](../sunucu/bolumler/devamsizlik.md) |
  | `GET /api/me`, `GET /api/challenge`, `POST /api/register`, `POST /api/eposta-onay`, `POST /api/login`, `POST /api/login/dogrula` | `kapaliOzellikler`, hesaplar ve girişler | [../sunucu/bolumler/kayit.md](../sunucu/bolumler/kayit.md) |
  | `POST /api/parent/link` | velinin çocuklara bağlanması | [../sunucu/bolumler/veli.md](../sunucu/bolumler/veli.md) |
  | `GET /api/islem-kaydi` | `okul.ozellik` kaydı | [../sunucu/bolumler/islem-kaydi.md](../sunucu/bolumler/islem-kaydi.md) |
  | `POST /api/servis/kaydet`, `ogrenci`, `sefer-basla`, `yoklama`, `sira`, `not`, `okula-vardik`, `binmeyecek`, `saatler`, `GET /api/servis`, `GET /api/servis/harita` | servis kapısı ve veli kartları | [../sunucu/bolumler/okul-hayati.md](../sunucu/bolumler/okul-hayati.md) |
  | `POST /api/cihaz`, `POST /api/cihaz/servis-konum`, `GET /api/cihaz/bildirimler` | telefon anahtarı ve kendi kapısı | [../sunucu/bolumler/cihaz.md](../sunucu/bolumler/cihaz.md) |
  | `POST /api/school/hesap-ac` | `okulHesabi` içinde (servisçi, yabancı öğrenci) | [../sunucu/bolumler/hesaplar.md](../sunucu/bolumler/hesaplar.md) |
  | `POST /api/kvkk-onay`, `POST /api/logout` | `okulHesabi` ve `mudurYap` içinde | [../sunucu/bolumler/kayit.md](../sunucu/bolumler/kayit.md) |
  | `GET /api/kisilikler` | `mudurYap` içinde (kişi kodu) | [../sunucu/bolumler/kisilik.md](../sunucu/bolumler/kisilik.md) |
  | `POST /api/admin/okul-ac` | `mudurYap` içinde (ikinci okul) | [../sunucu/bolumler/yonetici-okul.md](../sunucu/bolumler/yonetici-okul.md) |

- **Koruduğu kod:** `sunucu/bolumler/ozellikler.js` — `uclar`, `kapaliysaReddet` (veli kuralı dahil), `bakilanOkul` ve
  `istekteOgrenci` (bağlı çocuk şartı), `kullanicininKapalilari` (`/api/me`); `sunucu/api.js`'teki ödev eki yükleme kapısı
  (yanındaki teslim dosyası yükleme kapısı denenmiyor; [../sunucu/api.md](../sunucu/api.md)); depo
  [../sunucu/veri/depo/ozellikler.md](../sunucu/veri/depo/ozellikler.md) (`OZELLIKLER`, `kapaliMi`, `yaz`, bellekteki kopya);
  kapalı bölümü kendi atlayanlar: `sunucu/bolumler/ilerleyis.js`, `sunucu/bolumler/takvim.js`, `sunucu/bolumler/okul-hayati.js`
  (velinin servis kartı), `sunucu/bolumler/cihaz.js` (`servis-konum` kapısı ve `servisSaatleri`).
- **Tablolar:** `okul_kapali_ozellikler`, `islem_kaydi`; dolaylı olarak `odevler`, `quizler`, `servisler`, `servis_seferleri`,
  `cihaz_anahtarlari`, `veli_baglari`, `kullanicilar`, `okullar` ([../sunucu/veri/sema/SEMA.md](../sunucu/veri/sema/SEMA.md)).
- **Ön yüz** (bu pakette tarayıcı yok): müdürün sayfası [../public/js/parcalar/16c-ozellikler.md](../public/js/parcalar/16c-ozellikler.md),
  menüyü süzen [../public/js/parcalar/06-menu.md](../public/js/parcalar/06-menu.md).
- **Onu çalıştıran:** `testler/tumtest.sh`, sunuculu döngüde `test-nakil`'den sonra, `test-hatirlatici`'dan önce; her paketten
  önce veritabanı sıfırlanır ve [seed.md](seed.md) çalışır.

## Nasıl çalışır (adım adım)?

```
M, mat, o1 girer
1) M liste (8 açık) ; mat 403 ; o1 POST 403 ; 'mesaj' 400 ; mat quizli ödev verir
2) M kapat [odev, etut] ─► ödev listesi / yeni ödev / etüt 403 ; sınav 200 ; ek yükleme 403
                         ─► /me ve /progress kapalıyı söyler ; takvimde ödev yok ; teslim 403 ; quiz uçları 403
3) V (hesapAc ─► parent/link o1) ─► devamsızlık 200 ─► M kapat [+devamsizlik] ─► V 403 ; V'nin /me'si biliyor
4) M aç [] ─► ödev ve quiz yerinde ; işlem kaydında okul.ozellik
5) S açılır, servis + o1, sefer başlar, telefon anahtarı ─► konum 200
   yönetici ─► M2 + yabancı öğrenci
   M kapat [servis] ─► 7 servis ucu 403 ; yabancı kimlikle 6 deneme 403
   V yabancıya da bağlanır ─► /servis 200 (o1 kartı boş) ; o1 haritası 403
   telefon konumu 403 ; bildirimler 200 ama servisSaatleri null
   M aç [] ─► yoklama 200
```

## Dikkat!

- **İşlem kaydı denetimi kırpılmış metne bakıyor.** `J(kayit.body)` cevabın ilk 220 harfidir; `okul.ozellik` orada geçtiği için
  geçiyor, çünkü cevabın başındaki `turler` listesi en son yazılan türe göre sıralı ve son işlem yeniden açmaktır. 3 Ekim'de
  paket bittikten sonra aynı uca bakıldı: `okul.ozellik` 29. harfte, `turler` = `okul.ozellik`, `hesap.acildi`,
  `ogretmen.eklendi`, `servis.saatler`. Yeniden açma ile okuma arasına işlem kaydı yazan bir adım eklenirse denetim yanlışlıkla
  kalabilir; sağlamı `kayitlar` içinde `islem === 'okul.ozellik'` aramak.
- **`J` boş değerde patlar.** `JSON.stringify(undefined)` metin dönmediği için `.slice` hata atar; ayrıntı olarak verilen değer
  yoksa (ör. `/api/me` cevabında `kapaliOzellikler` hiç gelmezse) paket `KALDI` yazmak yerine `TEST HATASI:` ile durur.
  Ayrıntı argümanı denetim geçse de hesaplanır.
- **Her bölüm denenmiyor.** Kapatılan bölümler yalnız `odev`, `etut`, `devamsizlik` ve `servis`; `sinav` için yalnız "açık
  kaldı" bakılır. `yemek`, `kulup`, `anket` hiç kapatılmaz; `examgroups` yolu, teslim dosyası YÜKLEME kapısı (`POST
  /api/odev-dosya/yukle`) ve mesaj ekinin kapıya takılmaması denenmez. Teslim dosyası listesinde (`/api/odev-dosya`) yalnız
  durum koduna bakılır, `ozellikKapali` alanına değil.
- **5. bölüm seed'in servis saatlerine dayanır.** Seed sabah 00:00–11:59, akşam 12:00–23:59 yazar; bu yüzden seferi her saatte
  başlatabilir ve telefonun ilk konumu 200 alır. Seed değişirse "servis açıkken telefon konumu alınıyor" kalır.
- **Velinin oturumu:** `hesapAc` rolsüz yetişkin açar; paket `parent/link`'ten sonra veliye yeniden giriş yaptırmaz ve buna
  gerek de yok. Veli kodu girilince `veli.js`'teki `cocukBagla` aynı işlemde hesabı `parent` yapar (`rolsuzuVeliYap`) ve okulu
  boşsa çocuğun okulunu yazar; `currentUser` (`sunucu/guvenlik.js`) kişiyi her istekte veritabanından okuduğu için aynı oturum
  anahtarı bir sonraki istekte veli olarak, `o1`'in okuluyla işler. Bu yüzden 5. bölümde velinin `GET /api/servis` isteğinde
  kapının "belli çocuk seçmeyen veli" kuralı (çocuklardan birinin okulunda açıksa geç) çalışır.
- **Yeniden çalıştırılabilir.** Adlar `z` ekli, sonunda bütün bölümler yeniden açılır. 3 Ekim'de 3200'de aynı veritabanında art
  arda iki kez çalıştırıldı (denetimde yeni bir sunucu açılışında bir kez daha denendi): iki koşu da `GECTI: 31   KALDI: 0`.
- **Varsayılan adres 3000.** `EE_BASE` vermezsen istekler kendi sunucuna gider: orada bu hesaplar varsa okulun ödev, etüt,
  devamsızlık ve servis bölümleri kapatılıp açılır, veli/okul/öğrenci hesapları açılır. İki adımlı kodlar ve onay anahtarları
  `EE_LOG`'daki sunucu günlüğünden okunur ([giris.md](giris.md)).
- Paket aynı anda giden istekleri (`Promise.all`) kullanır; bunlar yarış denemesi değil, yalnız hız için.

## Testleri

- Bu dosyanın kendisi testtir; `testler/tumtest.sh` her tam koşuda çalıştırır. Aynı kapının başka yönleri:
  `testler/test-quiz.js` 13. bölüm (ödevler kapalıyken quiz uçları 403, bkz. [test-quiz.md](test-quiz.md)).
  `testler/yetki-denetimi.js` ve `testler/girdi-denetimi.js` `/api/ozellikler`'i denemiyor (3 Ekim'de `grep` ile bakıldı).
- Elle (Git Bash, proje kökünde; 3200'de sıfırlanmış `egitimevi_test` ile açılmış ve [seed.md](seed.md) ile tohumlanmış test
  sunucusu varken):

  ```
  EE_BASE=http://localhost:3200 EE_LOG=testler/test-sunucu.log node testler/test-ozellikler.js
  ```

- 3 Ekim'de bu belge için 3200'de, yeni sıfırlanmış test veritabanı ve seed'le çalıştırıldı: `GECTI: 31   KALDI: 0`, çıkış 0,
  yaklaşık 2 saniye; sunucu günlüğünde `API hatası` ya da `Veritabanı hatası` yok. Ardından aynı veritabanında ikinci koşu (yine
  31 / 0) ve yukarıdaki işlem kaydı yoklaması yapıldı.

## Son durum

- `git log`: 3 commit.
  - `8a275f9 commit 431` (2026-09-26): dosya Özellikler bölümüyle (`sunucu/bolumler/ozellikler.js`, `16c-ozellikler.js`) birlikte
    93 satır olarak eklendi: kim görür, ödev ve etüt kapalı (yükleme, `/api/me`, ilerleyiş, takvim, teslim dosyaları dahil), veli
    çocuğun okuluna bakar, yeniden aç ve işlem kaydı.
  - `24050a2 commit 518` (2026-09-27, servis yoklaması): 5. bölüm eklendi — servis kapalıyken yoklama, sıra, not, binmeyecek,
    saatler, okula varış ve telefon konumunun reddi; başka okulun öğrenci kimliğiyle atlatma denemesi; iki okullu velinin servis
    sayfası; telefonun bildirim yoklamasında `servisSaatleri`. `require` satırına `okulHesabi` ve `mudurYap` eklendi, baş yorumu
    "başka okulun öğrencisinin kimliğini isteğe eklemek kapıyı açmaz" diye genişledi.
  - `3b8fd36 commit 519` (2026-09-27, quiz): kapatmadan önce verilen ödev quizli oldu; ödev kapalıyken beş quiz ucunun 403
    `ozellikKapali` dönmesi ve yeniden açınca quizin yerinde olması denetlendi. O günden beri değişmedi.
- Bilinen açıklar (kod değiştirilmedi): işlem kaydı denetiminin kırpılmış metne bakması, `J`'nin boş değerde patlaması.
- Planlı işlerden bu dosyayı etkileyecekler:
  - **"KULÜPLER KALDIRILACAK"** — Özellikler'deki `kulup` anahtarı kalkacak; 1. bölümdeki "8 özellik" denetimi 7 olmalı.
  - **"Sistem: yöneticiye ZORUNLU TOTP …"** — 5. bölümdeki yönetici girişi günlükteki e-posta koduyla yapılamayacak;
    `mudurYap` için yönetici girişinin yolu değişmeli.
  - **"T.C. KİMLİK NO BÜTÜN HESAPLARDA ZORUNLU"** (kod Linux'ta) — `hesapAc` ile açılan veli ve ikinci müdür kaydı T.C. no
    göndermeli (`araclar/giris.js`).
  - **"Güvenlik denetimi"** (okulun verdiği her şifrede ilk girişte değiştirme) — bugün `okulHesabi` şifre verdiği için kişi
    şifre değiştirmeden girer. Bu iş gelince `okulHesabi` ile açılan servisçi `Test1234!` ile girse de `api.js`'teki
    `sifreDegismeli` kapısına takılır (servis uçları 403 `sifreDegismeli`); testlerin yardımcısı önce şifreyi değiştirmeli.
  - **"Tek kişi tek hesap + portallar öğrencide de"** (servisçi de portal) — servisçi hesabının açılış yolu değişirse 5. bölümün
    hazırlığı da değişir.
