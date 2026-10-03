# testler/test-giris-kayit.js

Kayıt ve girişin bütün kapılarını (e-posta onaylı rolsüz kayıt, kullanıcı adı ya da e-postayla giriş, "hesap yok" ile
"şifre yanlış" ayrımı ve hesaba bağlı kilit, alanlı kayıt hataları, doğrulama sorusu, rolsüz hesabın sınırı, veli kodu,
T.C. no'nun kime gittiği, şifre değişince oturumlar, kişi koduyla okul açma yarışı, okul araması, genel istek sınırları)
gerçek uçlardan deneyen sunuculu test paketi (86 denetim).

## Bu dosya ne yapar?

Eğitim Evi'nde kendisi kaydolan tek hesap türü **yetişkin hesabıdır** ve rolsüz açılır: veli çocuğunun veli kodunu girince
veli olur; öğretmen kişi kodunu müdüre verir, müdür onu okula ekler; okulunu açtırmak isteyen kişi kişi kodunu yöneticiye
verir, yönetici okulu açıp onu müdür yapar (eski "müdür başvurusu" kalktı). Hesap ancak e-postadaki onay bağlantısına
tıklanınca açılır. Bu paket bu kapıların her birini tek tek dener; sunucu tarafının çoğu
[../sunucu/bolumler/kayit.md](../sunucu/bolumler/kayit.md) ve [../sunucu/guvenlik.md](../sunucu/guvenlik.md)'de, ön yüzü
[../public/js/parcalar/05-giris.md](../public/js/parcalar/05-giris.md).

Dosya başı yorumu sözünü şöyle özetliyor: kayıt rolsüzdür (veli veli kodunu girer, öğretmeni ve müdürü kişi koduyla
okul/yönetici ekler); girişte kullanıcı adı ya da e-posta, büyük/küçük harf fark etmez; "hesap yok" ile "şifre yanlış" ayrı
söylenir, kalan hak yazılır, kilit hesaba bağlıdır (e-posta ile kullanıcı adını sırayla denemek kilidi aşmaz); müdür
başvurusu yoktur, aynı kişi koduyla aynı anda iki okul açılmaz; kayıt hataları alanını söyler, doğrulama sorusu yalnız
hesap açılınca harcanır; T.C. kimlik no isteğe bağlıdır, algoritmayla denetlenir, yalnız kişinin kendisine gider; veli kodu
büyük/küçük harf duyarlıdır, boşluklar fark etmez (7. bölümün başlığına göre tireler de); şifre değişince öbür oturumlar
kapanır; okul araması kelime sırasına, noktalamaya, büyük harfe dayanıklıdır; genel istek sınırı aynı ağdaki bir sınıfı
engellemez.

## İçinde neler var?

### Yardımcılar

- `kontrol(ad, sart, detay)`, `J(x)` (160 harflik JSON).
- `giris(kimlik, password)` — tek adımlık giriş denemesi: bot sorusunu çözer, `POST /api/login`'e `kimlik` alanıyla
  gönderir, cevabı olduğu gibi döner (iki adımlı kodu girmez). Hatalı şifre ve kilit denemeleri için.
- `kayit(govde, bot)` — `POST /api/register`; varsayılan `kvkkOnay: true`, telefon ve şifre (`Deneme2026!`), verilmezse
  yeni bir bot cevabı. **Onay bağlantısına tıklamaz**; hesabı açmak gerekiyorsa paket ayrıca `epostaOnayla` çağırır.
- `alanDene(ad, govde, alan)` — 4. bölümde: tek bir alanı bozulmuş kayıt gönderir, 400 ve doğru `alan` bekler.
- `z = Date.now()` — bu koşuya özgü ek.

Ortak yardımcılar [giris.md](giris.md) üzerinden ([../araclar/giris.md](../araclar/giris.md)): `BASE`, `iste`,
`girisYap`, `botCevabi`, `hesapAc`, `okulHesabi`, `tcUret`, `epostaOnayla`, `sonOnayAnahtari`.

### Hesaplar ve veriler

Seed'den ([seed.md](seed.md)) müdür (`M`), yönetici (`A`, test sunucusunun açılışta kurduğu ilk yönetici), öğretmen `mat`
(kullanıcı adı ve e-postası "alınmış" örneği), okulun öğrenci listesinin ilki (ad sırasıyla Burak Öztürk) ve "Test
Ortaokulu". Paketin açtıkları: "AYŞE YILMAZ" (`Ayse.Yilmaz<z>`, sabit bir T.C. no ile), `kilit<z>`, `roldeneme<z>`,
`soru<z>` (kaydı onaylanmaz), `veli<z>`, `katilan<z>` (öğretmen), `aday<z>`, `tcsrv<z>` (servisçi, sabit bir T.C. no
ile), `sifre<z>`, `paralel<z>`, `paralel.iki<z>`, `kod0.<z>` … `kod6.<z>`; beş "Paralel Okul" adayından ikisi gerçekten
açılır. Okul araması için sunucunun
okul listesi (MEB listesi, `okullar.json`) gerekir.

### 1) Rolsüz kayıt (5)

Kayıt → 200, `onayGerekli: true`, `user` yok, maskeli e-posta (`*` içerir). Onaylanmadan o e-postayla giriş → 401. 64
harflik uydurma onay anahtarı → 400. Günlükteki gerçek anahtarla onay → hesap açıldı (`tur: 'kayit'`, iletide "Kullanıcı
adın: ayse.yilmaz…"). Aynı anahtar ikinci kez → 400.

### 2) Giriş: kullanıcı adı ya da e-posta (9)

- Büyük harfle yazılmış kullanıcı adıyla iki adımlı giriş olur; hesap rolsüz (`role: ''`), okulsuz, kullanıcı adı küçük
  harfle saklanmış, ad "Ayşe Yılmaz" diye düzeltilmiş.
- `POST /api/hesap/bilgi { eposta, sifre }` ile yeni adres istenir → `onayBekliyor: true`, ama `GET /api/hesap`'ta adres
  hâlâ eskisi; yeni adresin bağlantısına tıklanınca (`tur: 'eposta'`) adres değişir. Sonra eski adrese geri dönülür
  (denetlenmez).
- Kişinin kendi T.C. no'su giriş cevabında kendisine geliyor. Büyük harfli e-postayla giriş de olur.
- Boş kimlik → 400 `alan: 'kimlik'`. Olmayan e-posta → 401, `hesapYok` ve "e-posta adresiyle kayıtlı bir hesap yok";
  olmayan kullanıcı adı → 401 ve "kullanıcı adıyla kayıtlı bir hesap yok".

### 3) Yanlış şifre, kalan hak, hesaba bağlı kilit (4)

`kilit<z>` hesabına kullanıcı adıyla yanlış şifre → 401, `alan: 'sifre'`, ileti "Şifre yanlış." ile başlıyor,
`kalanHak: 4`. E-postayla ikinci yanlış → `kalanHak: 3` ve "3 deneme hakkın kaldı" (aynı sayaç). İki yanlış daha, beşincide
"kilitlendi". Kilitliyken **doğru** şifre öbür kimlikle (e-posta) → 429 ve `kilitli`.

### 4) Kayıt hataları alanıyla (14)

`alanDene` ile her biri 400 ve şu `alan`: tek kelimelik ad → `ad`; boş kullanıcı adı, Türkçe harfli (`şule…`), rakamla
başlayan (`1abc`), alınmış (`MAT`) → `kullaniciAdi`; `eksik@adres`, kayıtlı `mat@test.com` → `email`; kısa şifre →
`sifre`; `123` → `telefon`; algoritmaya uymayan T.C. ve 1. bölümde kullanılmış T.C. → `tc`; `kvkkOnay: false` → `kvkk`.
Uydurma doğrulama sorusu → `alan: 'bot'`. Kayıtta `role: 'principal'` ve `schoolId` gönderilse de hesap rolsüz ve okulsuz
açılır.

### 5) Doğrulama sorusu yalnız hesap açılınca harcanır (3)

Aynı bot cevabıyla: önce e-postası hatalı kayıt → `alan: 'email'` (soru harcanmadı); düzeltilmiş kayıt → 200; aynı
cevapla üçüncü kayıt → `alan: 'bot'` (soru harcandı).

### 6) Rolsüz hesabın sınırı (6)

Rolsüz Ayşe'nin oturumuyla `GET /api/progress`, `/api/mesajlar/kutu`, `/api/takvim?ay=2026-09`, `/api/school/students`,
`/api/assignments` → hepsi 403. `GET /api/notifications` → 200.

### 7) Veli kodu (5)

Okulun ilk öğrencisinin veli kodu 16 karakter (`/^[A-Za-z][A-Za-z0-9!?#*+=]{15}$/`). `veli<z>` hesabıyla: `ZZZZZ-ZZZZZ`
→ 400; kodun harflerinin büyük/küçüğü çevrilmiş hâli → 400 (başka bir koddur); kod 4'erli, aralarda boşluk ve tireyle
(`' XXXX - XXXX-XXXX  XXXX '`) yazılınca → 200 ve bir çocuk. Bundan sonra `GET /api/me`'de `role: 'parent'`.

### 8) Öğretmen hesabını okul açar (4)

- `okulHesabi(M, 'teacher', …)`: öğretmen kendi hesabını açar, kişi kodunu verir, müdür
  `POST /api/school/ogretmen-ekle { kod, brans: 'Fen Bilimleri' }` ile ekler. Öğretmen girince rolü `teacher`, branşı "Fen Bilimleri".
- `POST /api/school/hesap-ac { rol: 'teacher', brans: 'Uydurma' }` → 400 ("Dikkat!"e bak: reddin nedeni branş değil).
- `rol: 'principal'` ile hesap açma → 400. Eski `POST /api/school/kisi-ekle` → 404.

### 9) Müdür başvurusu yok (4)

`aday<z>` (rolsüz) `POST /api/okul-basvurusu` → 404; `GET /api/school/students` → 403 ve `rolsuz: true`. Yönetici için de
`POST /api/okul-basvurusu`, `GET /api/admin/pending`, `POST /api/admin/decide` → üçü de 404. `GET /api/kisilikler`'de rol
yok, 16 karakterli kişi kodu hazır.

### 10) T.C. no: kişinin kendisi ve okul yönetimi (5)

Müdür bir servisçi açar (`okulHesabi(M, 'servisci', …)`, sabit T.C. no ile). `GET /api/school/servisciler` satırında
`tc` yok; `GET /api/school/hesap?id=` (hesap penceresi) T.C. no'yu gösteriyor; servisçi girince kendi T.C. no'sunu görüyor.
Okulun açtığı hesapta `POST /api/profile { tc: '' }` → 400 (T.C. no profilden değişmez); velinin profilinde `tc: '123'`
→ 400.

### 11) Şifre değişince öbür oturumlar kapanır (3)

`sifre<z>` iki ayrı oturum açar; birincisiyle `POST /api/password` → 200; birinci oturum açık (`/api/me` 200), ikincisi
kapalı (401).

### 12) "Şifremi unuttum" yalnız e-postayla (1)

`POST /api/sifre-unuttum`'a kullanıcı adı yazılınca → 400 `alan: 'email'`.

### 12b) Güvenlik: yarış, red, T.C., veli kodu (6)

- Müdür onaylı öğretmen `mat`'ı `POST /api/school/teacher-decide { approve: false }` ile "reddedemez" → 400.
- Aynı kişi koduyla aynı anda beş ayrı okul açılmak istenir (`Promise.all`, beş `POST /api/admin/okul-ac`, farklı ad ve
  adres) → yalnız biri 200. Geçmeyenlerden birinin adı ve adresiyle başka bir kişinin kodu → 200 (yarım kalan okul ya da
  adres yolu tıkamıyor).
- 1. bölümdeki T.C. no ile yeni kayıt → 400, `alan: 'tc'`, `yeniSoru: true` (soru harcandı; ileti numaranın kime ait
  olduğunu söylemez); aynı soruyla ikinci deneme → `alan: 'bot'`.
- Yedi yeni yetişkin hesabından sırayla beşer yanlış veli kodu denenir (hesap başına dakikada 5 sınırına takılmadan);
  "bağlantıdan" geçen ilk 429 en geç 31. denemede gelmeli (IP başına saatte 30 yanlış kod).

### 13) Okul araması (14)

`GET /api/okullar/ara?limit=25&q=…&il=…` ile: "atatürk ortaokulu" ile "ortaokulu   ATATÜRK" aynı sayı ve aynı ilk okul;
"m.akif" Mehmet Akif'leri bulur; anlamsız bir kelime eklenince boş değil `yakin: true`; "cankaya ataturk" ilçe adıyla
arar; tamamı büyük harfli MEB adları düzeltilmiş gelir; "cUmHuRiYeT oRtAoKuLu" düz yazımla aynı sonucu verir ve düzeltme
önermez; "ortaoklu cumhuriyet" → `duzeltme: 'ortaokulu cumhuriyet'`, bütün sonuçlar Cumhuriyet Ortaokulu ve ilkinde iki
vurgu; "tefik fikret" → Tevfik Fikret; "aihl" → yalnız Anadolu İmam Hatip Liseleri; "ataturkortaokulu" → "ataturk
ortaokulu"; "mtal cankaya" → Çankaya'daki Mesleki ve Teknik Anadolu Liseleri; beş yazım hatalı arama 1,5 saniyeden kısa;
art arda 150 arama hiç 429 almıyor.

### 14) Genel sınır: aynı ağdaki sınıf engellenmez (3)

400 kez `/css/style.css` ve 350 kez `GET /api/meta` → hiç 429 yok (bir sınıfın aynı IP'den gelmesi gibi). Son olarak
müdürün oturumuyla 320 kez `GET /api/me` → en az 15 kez 429 (tek oturum dakikada 300). Yorumun dediği gibi bu en sona
konuldu: o oturum bir dakika kilitli kalır.

Sonunda boş bir satır ve `GECTI: 86   KALDI: 0` (başında boşluk yok); `KALDI` varsa çıkış kodu 1. Beklenmeyen hata
`TEST HATASI:` ile hata nesnesini yazar, çıkış kodu 1.

## Kimle konuşur?

- **Modüller:** yalnız [giris.md](giris.md) (`araclar/giris.js`); 14. bölümde dosya isteği için genel `fetch` (`BASE`).
- **Sunucu uçları:**

  | Uç | Ne için | Belge |
  |---|---|---|
  | `POST /api/register`, `POST /api/eposta-onay`, `GET /api/challenge`, `POST /api/login`, `POST /api/login/dogrula`, `GET /api/me`, `POST /api/password`, `POST /api/profile`, `POST /api/sifre-unuttum`, `GET /api/notifications`, `GET /api/meta`, `GET /api/okullar/ara`, `POST /api/kvkk-onay` | kayıt, giriş, şifre, profil, arama | [../sunucu/bolumler/kayit.md](../sunucu/bolumler/kayit.md) |
  | `POST /api/hesap/bilgi`, `GET /api/hesap`, `GET /api/kisilikler` | e-posta değiştirme, kişi kodu | [../sunucu/bolumler/kisilik.md](../sunucu/bolumler/kisilik.md) |
  | `POST /api/parent/link` | veli kodu | [../sunucu/bolumler/veli.md](../sunucu/bolumler/veli.md) |
  | `POST /api/school/ogretmen-ekle`, `POST /api/school/hesap-ac`, `GET /api/school/servisciler`, `GET /api/school/hesap` | okulun açtığı hesaplar, T.C. no | [../sunucu/bolumler/hesaplar.md](../sunucu/bolumler/hesaplar.md) |
  | `GET /api/school/students`, `GET /api/school/teachers`, `POST /api/school/teacher-decide` | öğrenci listesi, öğretmen reddi | [../sunucu/bolumler/okul.md](../sunucu/bolumler/okul.md) |
  | `POST /api/admin/okul-ac` | aynı kodla eşzamanlı okul açma | [../sunucu/bolumler/yonetici-okul.md](../sunucu/bolumler/yonetici-okul.md) |
  | `GET /api/progress`, `GET /api/mesajlar/kutu`, `GET /api/takvim`, `GET /api/assignments` | rolsüz kapısı (403) | [../sunucu/api.md](../sunucu/api.md) |
  | `POST /api/okul-basvurusu`, `GET /api/admin/pending`, `POST /api/admin/decide`, `POST /api/school/kisi-ekle` | kaldırılmış uçlar (404) | [../sunucu/api.md](../sunucu/api.md) |
  | `/css/style.css` | dosya isteklerinin genel sınırı | [../sunucu/http.md](../sunucu/http.md), [../sunucu/index.md](../sunucu/index.md) |

- **Koruduğu kod:** [../sunucu/bolumler/kayit.md](../sunucu/bolumler/kayit.md) (`register`, `epostaOnayi`, giriş adımları,
  şifre ve profil); [../sunucu/guvenlik.md](../sunucu/guvenlik.md) (hesaba bağlı kilit ve kalan hak, bot sorusunun yalnız
  hesap açılınca harcanması, `hizSinir`/`hataSay`, `GENEL_SINIR` — IP başına dakikada 6000 API ve 15000 dosya, oturum başına
  300); [../sunucu/ortak.md](../sunucu/ortak.md) (`normEmail`, `adDuzelt`, `kullaniciAdiSorunu`, `tcSorunu`,
  `telefonSorunu`, `sifreSorunu`); [../sunucu/bolumler/veli.md](../sunucu/bolumler/veli.md) (`cocukBagla`: hesap başına
  dakikada 5, IP başına saatte 30 yanlış kod, harf duyarlı, boşluk ve tire silinir); [../sunucu/api.md](../sunucu/api.md)
  (rolsüz kapısı); [../sunucu/bolumler/yonetici-okul.md](../sunucu/bolumler/yonetici-okul.md) (kişi kodunun tek
  kullanımlık olması, yarışta yarım okul kalmaması); [../sunucu/okullar.md](../sunucu/okullar.md) ve
  [../sunucu/yardimci/bulanik-arama.md](../sunucu/yardimci/bulanik-arama.md) (okul araması);
  [../sunucu/veri/depo/onaylar.md](../sunucu/veri/depo/onaylar.md) (onay bağlantıları).
- **Tablolar** (dolaylı): `kullanicilar`, `eposta_onaylari`, `oturumlar`, `veli_baglari`, `okullar`, `bildirimler`.
- **Ön yüz** (aynı uçları çağırır, bu pakette tarayıcı yok): [../public/js/parcalar/05-giris.md](../public/js/parcalar/05-giris.md),
  [../public/js/parcalar/08b-rolsuz.md](../public/js/parcalar/08b-rolsuz.md), [../public/js/parcalar/10b-hesaplar.md](../public/js/parcalar/10b-hesaplar.md).
- **Onu çalıştıran:** `testler/tumtest.sh`, sunuculu paket döngüsünde (`test-bildirim`'den sonra, `test-veli-coklu`'dan
  önce); her paketten önce sunucu yeniden açılır (bellekteki sınırlar ve kilitler sıfırlanır), veritabanı sıfırlanır,
  `data/okullar.json` test klasörüne kopyalanır ve [seed.md](seed.md) çalışır.

## Nasıl çalışır (adım adım)?

```
M, A girer
1) AYŞE YILMAZ kaydolur ─► onay bekliyor ─► (giriş 401, uydurma anahtar 400) ─► onay ─► açıldı ─► 2. tıklama 400
2) kullanıcı adı / e-postayla giriş ; e-posta değişir (bağlantıyla) ; "hesap yok" iletileri
3) kilit<z>: 4 hak ─► 3 hak (e-postayla, aynı sayaç) ─► 5.'de kilit ─► doğru şifre de 429
4) 12 alan hatası + bot + rol gönderme
5) aynı soru: hata (harcanmaz) ─► başarı (harcanır) ─► tekrar "bot"
6) rolsüz: 5 bölüm 403, bildirimler 200
7) veli kodu: yanlış / harfi çevrilmiş 400 ─► boşluklu-tireli 200 ─► rol parent
8) öğretmen kişi koduyla ; hesap-ac teacher/principal 400 ; kisi-ekle 404
9) başvuru uçları 404 ; rolsüz okul ucu 403 ; kişi kodu hazır
10) servisçinin T.C.'si: listede yok, pencerede var, kendisinde var ; profilden değişmez
11) şifre değişince öbür oturum 401
12) şifremi unuttum: kullanıcı adı ─► 400 email
12b) mat reddedilemez ; aynı kodla 5 okul ─► 1 ; T.C. çakışması soruyu yakar ; veli kodu IP sınırı ≤31
13) okul araması (MEB listesi)
14) 400 dosya + 350 API ─► 0 kez 429 ; aynı oturumla 320 /api/me ─► ≥15 kez 429
```

Bölümler aynı sunucu sürecinin bellekteki sayaçlarını paylaşır: 7. bölümdeki iki yanlış veli kodu 12b'deki IP sayacına
girer, 13. bölümün aramaları ile 14. bölümün istekleri aynı IP'nin sayaçlarına yazılır.

## Dikkat!

- **"Listede olmayan branş reddedildi" yanlış nedenle geçer.** `POST /api/school/hesap-ac` `rol: 'teacher'`'ı branşa hiç
  bakmadan reddeder ("Öğretmen hesabını öğretmen kendisi açar…", koddan). Yani bu denetim branş doğrulamasını denemiyor;
  geçersiz branşın reddi `testler/test-yonetim.js`'te (`hesap-guncelle` ile `Uydurma`) denenir. Denetimin adı ve
  gövdesi düzeltilmeli (kod değiştirilmedi).
- **Okul araması gerçek MEB listesine bağlı.** Sunucu listeyi `EE_DATA/okullar.json`'dan okur; bu dosya depoda yoktur,
  `tumtest.sh` onu kurulumun veri klasöründen kopyalar. Dosya yoksa arama 503 döner, 13. bölümün ilk denetimi kalır ve
  `a3.okullar.some(...)` satırında paket `TEST HATASI` ile çöker (koddan çıkarım; denenmedi). Liste güncellenip "Tevfik
  Fikret", "Mehmet Akif", Ankara'da "Atatürk Ortaokulu" ya da "Cumhuriyet Ortaokulu", Çankaya'da MTAL gibi okullar
  değişirse denetimler kalabilir.
- **"5 arama < 1,5 sn" makineye bağlı.** Yavaş ya da meşgul bir bilgisayarda kalabilir.
- **14. bölüm sıralamaya bağlı.** Müdürün oturumu pencere bitene kadar (en çok 1 dakika) kilitlenir; bu bölümden sonra
  müdürle istek atan bir adım eklersen 429 alır. Oturum sayacı 60 saniyelik sabit bir pencereyle sayılır
  (`genelSinir`, ilk istekte başlar) ve müdürün paket boyunca yaptığı istekleri de içerir: pencere döngüden önce dolmaya
  başlamışsa 429 sayısı 20'den çok, döngünün ortasında yenilenirse az olabilir. Denetim bu yüzden kesin 20 değil "en az 15"
  bekler. Dosya istekleri yalnız 429'a bakar, 200'ü denetlemez.
- **Taze sunucu ve veritabanı ister.** Aynı sunucu ve veritabanında ikinci koşu (3 Ekim denetiminde denendi) 1. bölümde
  durur: sabit T.C. no (`10000000146`) ilk koşudaki Ayşe'de olduğu için kayıt 400 `alan: 'tc'` alır, iki denetim daha
  geçer, sonra `sonOnayAnahtari` günlükte bu adresin anahtarını bulamaz ve paket 49. satırda `TEST HATASI: Error:
  Günlükte … için onay anahtarı yok.` ile biter. O engel aşılsa bile (koddan): ilk koşu yanlış veli kodu IP sayacını 30'a
  getirir (429 alan deneme sayılmaz), sayaç bir saat sürer ve 30'dayken doğru kod da 429 alır (7. bölüm kalır);
  servisçinin sabit T.C.'si (`11111111110`) okulda dolu olduğundan 10. bölümdeki `okulHesabi` fırlatır. Hesaba bağlı kilit ise her koşuda yeni
  hesapla (`kilit<z>`) denendiği için taşınmaz; kayıt denemesi sınırı (bağlantı başına saatte 100; paket her koşuda 34 kayıt
  isteği yapar) ancak üçüncü koşuda dolar. `tumtest.sh` her paketten önce sunucuyu yeniden açar ve veritabanını sıfırlar.
- **12b'deki 429 sayısı önceki bölümlere bağlı.** 7. bölümün iki yanlış kodu IP sayacına girdiği için 30'luk sınır 29.
  denemede dolar (koddan hesap); denetim "≤ 31" der. 7. bölüme yanlış kod denemesi eklersen eşik kayar.
- **Yönetici girişi günlükteki koda dayanır.** `A` için iki adımlı kod `EE_LOG` günlüğünden okunur ve şifre ancak sunucu
  `EE_ADMIN_SIFRE=admin123` ile açıldıysa doğrudur ([seed.md](seed.md)).
- **Seed'e bağlı:** `mat` adı ve e-postası (alınmış örnekleri), okulun öğrenci listesinin ilk öğrencisi (veli kodu), seed
  öğretmeni `mat`'ın "onaylı" olması.
- **Varsayılan adres 3000.** `EE_BASE` vermeden çalıştırırsan kendi sunucunda on altı yetişkin hesabı, bir
  servisçi ve iki okul açar, bağlantının yanlış veli kodu sayacını doldurur (bir saat veli kodu girilemez) ve müdür
  oturumunu bir dakika kilitler; her zaman test sunucusunu kullan.

## Testleri

- Bu dosyanın kendisi testtir; `testler/tumtest.sh` her tam koşuda çalıştırır. Aynı alanda: [test-cakisma.md](test-cakisma.md)
  (aynı e-posta, kullanıcı adı ve T.C. no; eşzamanlı onay), `testler/test-yetiskin.js` (yetişkin hesabı ve kişi kodu),
  `testler/test-kisi-kodu.js`, `testler/test-sifre.js` ("Şifremi unuttum"), `testler/test-vekil-ip.js` (istemci IP'si),
  [guvenlik-test.md](guvenlik-test.md), [yetki-denetimi.md](yetki-denetimi.md), [girdi-denetimi.md](girdi-denetimi.md).
- Elle (Git Bash, proje kökünde; 3200'de `tumtest.sh`'deki gibi açılmış, `okullar.json` test klasörüne kopyalanmış ve
  [seed.md](seed.md) ile tohumlanmış test sunucusu varken):

  ```
  EE_BASE=http://localhost:3200 EE_LOG=testler/test-sunucu.log node testler/test-giris-kayit.js
  ```

- 3 Ekim sabahı bu belge için 3200'de, sıfırlanmış `egitimevi_test`, kopyalanmış okul listesi ve seed'le koşuldu:
  `GECTI: 86   KALDI: 0`, yaklaşık 16 saniye (en uzunu 13–14. bölümlerin yüzlerce isteği); sunucu günlüğünde `API hatası`
  ya da `Veritabanı hatası` yok. Belgenin denetiminde yeniden koşuldu, sonuç aynı (yaklaşık 15 saniye); ardından aynı
  sunucuda ikinci koşu "Dikkat!"teki `TEST HATASI`'nı verdi.

## Son durum

- `git log`: 3 commit.
  - `153d63d commit 522` (2026-09-27): veli kodu ve kişi kodu 15'ten 16 karaktere çıktı (`=` işareti girdi, `-` çıktı); 7.
    bölümün başlığı "BOŞLUK VE TİRE FARK ETMEZ" oldu ve kod 4'erli, boşluk ve tireyle karışık yazılarak denenmeye
    başlandı.
  - `0acca75 commit 516` (2026-09-27, kişi kodu ve portallar): müdür başvurusu kalktı — 9. bölüm "bekleyen ve reddedilen
    başvuru" yerine "başvuru uçları 404, kişi kodu hazır" oldu; 12b'deki eşzamanlı beş başvuru, aynı kişi koduyla beş
    `admin/okul-ac`'a çevrildi; "onaylı müdür reddedilemiyor" denetimi silindi; veli kodu 10 haneli büyük harf/rakamdan
    15 karakterli (harfle başlar, işaret içerebilir) biçime geçti ve büyük/küçük harf **duyarlı** oldu (harfi çevrilmiş
    kodun reddi eklendi; doğru kod artık küçük harf ve tireyle değil, 5'erli boşluklu yazılarak denendi); başlık yorumu yeni
    düzene göre yazıldı.
  - `139b8de commit 17` (2026-08-28): dosyanın ilk hâli (344 satır), `testler/giris.js` ve
    `testler/test-giris-bilgisi.js` ile birlikte.
- Açık iş: "listede olmayan branş" denetiminin yanlış nedenle geçmesi (yukarıda); kod değiştirilmedi.
- Planlı işlerden bu dosyayı etkileyecekler:
  - **"Sistem"** — yöneticiye **zorunlu doğrulama uygulaması (TOTP)**: `A`'nın girişi günlükteki e-posta koduyla olmaz;
    9. ve 12b. bölümler yönetici oturumuna dayanıyor.
  - **"T.C. kimlik no bütün hesaplarda zorunlu"** — yorumdaki "T.C. isteğe bağlı" kuralı değişir; T.C.'siz kayıtlar
    (`hesapAc` çağrılarının hepsi, `kayit` varsayılanı) 400 alır; 1., 4. ve 12b. bölümler yeniden yazılmalı.
  - **"Tek kişi tek hesap + portallar öğrencide de"** (kullanıcı adı site genelinde tek, e-posta tek) — giriş ve kayıt
    kuralları ile "alınmış ad" örnekleri değişebilir.
  - **"Çalışan olarak ekleme"** — 8. bölümde kişi koduyla eklenen kişi rolsüz çalışan olacak; "rolü `teacher`, branşı
    müdürden" beklentisi değişir.
  - **"Güvenlik denetimi"** (IPv6 /64 anahtarı, okulun verdiği her şifrede ilk girişte değiştirme) — IP sayaçları ve
    servisçinin (10. bölüm) ilk girişi etkilenir.
  - **"Özel roller"** (ortak bilgisayarda giriş) ve **"Okul cihazı"** (öneri) — iki adımlı kodun sorulmadığı yeni giriş
    yolları gelirse bu pakete eklenmeli.
