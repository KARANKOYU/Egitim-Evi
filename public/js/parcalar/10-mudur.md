# public/js/parcalar/10-mudur.js

Müdürün (ve yetkili öğretmenin) iki liste sayfası — "Öğretmenler" ve "Öğrenciler" (`okul-ogrenciler`) — ile öğrencinin
hesap penceresindeki veli bağlama (bul, bağla, kaldır) ve müdürün bir öğrencinin portalını açması.

## Bu dosya ne yapar?

Okulun insanları iki listede durur:

- **Öğretmenler:** okulun öğretmenleri (ad, kullanıcı adı, e-posta varsa, branş) ve "Hesap" düğmesi. Üstte "Öğretmen ekle"
  kartı: öğretmen Eğitim Evi'nde kendi yetişkin hesabını açar, "+ Ekle → Öğretmen" ekranındaki kişi kodunu müdüre
  verir; müdür "Kodla ekle"ye basar, kodu girer, maskeli adı görüp ekler (pencere `10b-hesaplar.js`'te). Eski düzenden
  kalma bekleyen başvuru varsa "Onay bekleyenler" bölümü ve Onayla/Reddet.
- **Öğrenciler:** okulun bütün öğrencileri sınıfa, okul numarasına ve ada göre sıralı; her satırda sınıf ve "No"
  etiketi, kullanıcı adı, veli kodu (4'erli tireli), "kendi şifresini belirlemedi" notu; "Hesap" ve "Portalını aç"
  düğmeleri. Üstte sayfanın kendi arama kutusu ("ad, sınıf, okul no ya da kullanıcı adı"), "Excel ile toplu", "Öğrenci
  ekle" ve "Giriş bilgisi dağıt" (toplu şifre ve mektup; [10a-giris-bilgisi.md](10a-giris-bilgisi.md)). Öğrenci hesabını
  okul açar: ad, soyad ve T.C. no yeter.
- **Veli bağlama:** öğrencinin "Hesap" penceresinde (`10b-hesaplar.js` çizer) "Veliler" listesi ve "Veli bağla" kutusu
  buradaki eylemlerle çalışır: velinin T.C. kimlik numarası ya da kullanıcı adı yazılır, sunucu maskeli adı gösterir,
  "Veli olarak bağla". Veli önce Eğitim Evi'ne kaydolmuş olmalıdır; kendisi de veli koduyla bağlanabilir.
- **Portalını aç:** müdür (ya da `ogrenci.portal` yetkisi olan, ör. rehber öğretmen) öğrencinin gördüğü ekranı —
  ilerleyiş, ödevler, sınavlar, program, devamsızlık — birebir açar; menüde "Öğrenci Listesi" ile döner.

Hangi düğmenin görüneceği müdürün verdiği yetkilere bağlıdır; müdürde hepsi görünür. Kim görür: müdür; menüde bu
sayfalar açık olan (ilgili yetkisi olan) öğretmen ([06-menu.md](06-menu.md)).

## İçinde neler var?

### `SAYFALAR.ogretmenler`

- `GET /api/school/teachers` — düşerse (ör. yalnız `ogretmen.onayla` yetkisi olan kişi `ogretmen.duzenle` isteyen
  listeyi göremez) sayfa yine açılır, liste boş sayılır.
- `bek` = durumu `pending`, `onay` = `approved` olanlar. Başlık "ÖĞRETMENLER" + okul adı.
- `yetkim('ogretmen.onayla')` ise "Öğretmen ekle" kartı ve "Kodla ekle" (`data-act="ogretmen-kodla"`).
- Bekleyen varsa "Onay bekleyenler (N)": ad, branş · kullanıcı adı; "Onayla" / "Reddet" (`data-act="ogretmen-onay"`,
  `data-ok="1"|"0"`).
- "Okulun öğretmenleri (N)": yoksa "Henüz öğretmen hesabı yok."; varsa her biri `avatar`, ad, "kullanıcı adı · e-posta",
  branş etiketi ve (`ogretmen.duzenle` ise) "Hesap" (`data-act="hesap-duzenle"`). Satırlar `data-ara` taşır: üst arama
  kutusu süzer.

### `SAYFALAR['okul-ogrenciler']`

- `GET /api/school/students` ve `GET /api/school/classes` birlikte; her biri kendi başına düşebilir (yalnız "öğrenci
  ekler" yetkisi olan listeyi ya da sınıfları göremeyebilir), düşen boş liste sayılır.
- `S._sinifListe` ve `S._ogrListe` bu cevaplarla doldurulur: [10a-giris-bilgisi.md](10a-giris-bilgisi.md) ve
  `10b-hesaplar.js` pencerelerde bunları kullanır.
- Başlık "ÖĞRENCİLER — N öğrenci kayıtlı." Üst kart: `input#ogrAra`; düğmeler yetkiye göre:
  - `ogrenci.hesap-ac` + `aktarim.yap` → "Excel ile toplu" (`data-nav="aktarim"`);
  - `ogrenci.hesap-ac` → "Öğrenci ekle" (`data-act="hesap-yeni" data-rol="student"`, pencere `10b-hesaplar.js`);
  - `ogrenci.sifre` ve en az bir öğrenci → "Giriş bilgisi dağıt" (`data-act="giris-bilgisi-ac"`);
  - ipucu: "Öğrenci hesabını okul açar. Ad, soyad ve T.C. no yeter; kullanıcı adı ve şifre boşsa T.C. no olur, öğrenci
    ilk girişte kendi şifresini belirler."
- Öğrenci yoksa "Henüz öğrenci kaydı yok." Varsa sıralama: sınıf adı (Türkçe; sınıfsız en sona), okul numarası
  (sayı; numarasız sona), ad. Her satır `div.satir[data-ara]` (ad, kullanıcı adı, e-posta, sınıf, okul no): `avatar`,
  ad + mavi sınıf etiketi + gri "No 123"; kullanıcı adı varsa altında "kullanıcı adı · veli kodu `ABCD-…`" (`code`
  varsa, `kisiKoduBicim`) ve `sifreDegismeli` ise "kendi şifresini belirlemedi"; düğmeler `ogrenci.duzenle` → "Hesap",
  `ogrenci.portal` → "Portalını aç" (`data-act="ogrenci-portal"`, `data-ad`).
- `#ogrAra`'ya yazınca yalnız `#ogrListe .satir`'lar `nrm` (Türkçe harf düzleme, küçük harf) ile süzülür. Üstte açık
  pencere yoksa (`#modalKok` boş) sayfa açılınca odak arama kutusuna gider.

### Veli bağlama (öğrencinin "Hesap" penceresinde)

Üç eylem de `25-tiklama.js`'in çağırdığı biçimdedir: `EYLEMLER[ad](düğme, düğmenin data-id'si)`; burada `data-id`
öğrencinin kimliği, velinin kimliği `data-veli`'dedir.

- `velileriYukle(ogrenciId)` — `GET /api/school/ogrenci-velileri?studentId=` → `#hVeliler`'e her veli: ad, kullanıcı
  adı (rolü veli değilse yanında rol adı, `ROL_AD`) ve "Kaldır" (`data-act="veli-coz"`, `data-id` öğrenci, `data-veli`).
  Hiç yoksa "Bağlı veli yok."; hata iletisi kutuya yazılır. Öğrencinin "Hesap" penceresi açılınca `10b-hesaplar.js`,
  bağlama ya da kaldırmadan sonra bu dosyadaki `veli-bagla` / `veli-coz` çağırır.
- `EYLEMLER['veli-bul']` — `#hVeliAra` boşsa "Velinin T.C. kimlik numarasını ya da kullanıcı adını
  yaz."; "Aranıyor..." → `GET /api/school/veli-bul?kimlik=<yazılan>`. `kisi.durum !== 'uygun'` ise "Bu hesap veli olarak
  bağlanamaz (öğrenci ya da yönetici hesabı)."; uygunsa küçük kartta maskeli ad, kullanıcı adı ve "Veli olarak bağla"
  (`data-act="veli-bagla"`, `data-veli`). Hata (ör. 404 "Veli önce Eğitim Evi'ne kaydolmalı.", geçersiz T.C.) kutunun altına.
- `EYLEMLER['veli-bagla']` — "Bağlanıyor..." → `POST /api/school/veli-bagla { studentId, veliId }` →
  yeşil ileti, kutu boşalır, liste tazelenir. Hata kırmızı iletiyle, düğme geri gelir.
- `EYLEMLER['veli-coz']` — onay "Bu kişinin veli bağı kaldırılsın mı? Öğrencinin bilgilerini artık
  göremez." → `POST /api/school/veli-coz { studentId, veliId }` → liste tazelenir; hata `alert`.

### Portal

- `ogrenciPortalAc(studentId, ad)` — `S.viewStudentId`, `S.viewStudentName` → `git('ilerleyisim')`. Menü öğrenci
  portalı görünümüne geçer ([06-menu.md](06-menu.md) `navTanim` 1. durum); sayfalar `?studentId=` ile ister
  (`13-ogrenci-veli.js` `hedefOgrenci()`: `S.viewStudentId` doluysa `'?studentId=<kimlik>'`, değilse `''`). Çağıran:
  `25-tiklama.js` `ogrenci-portal` eylemi (`data-ad` yoksa ad "Öğrenci" olur).

### Başka dosyalarda ele alınan düğmeler

`ogretmen-kodla`, `hesap-duzenle`, `hesap-yeni` → `10b-hesaplar.js`; `ogretmen-onay` → `25-tiklama.js`
(`POST /api/school/teacher-decide { userId, approve }` → `git('ogretmenler')`); `ogrenci-portal` → `25-tiklama.js`
(→ `ogrenciPortalAc`); `giris-bilgisi-ac` → [10a-giris-bilgisi.md](10a-giris-bilgisi.md).

## Kimle konuşur?

- Çağırdıkları: `S`, `$`, `esc`, `api`, `EYLEMLER` ([00-durum.md](00-durum.md), [01-yardimcilar.md](01-yardimcilar.md));
  `avatar`, `nrm`, `ik`, `ROL_AD` ([02-ikonlar.md](02-ikonlar.md)); `alanHatasi`, `alanTemizle`
  ([04a-form-alanlari.md](04a-form-alanlari.md)); `kisiKoduBicim`, `dugmeBekle`, `dugmeBitir` ([05-giris.md](05-giris.md));
  `yaz`, `hero`, `bosKutu`, `git` ([07-yonlendirme.md](07-yonlendirme.md)); `SAYFALAR` ([08-ana-sayfa.md](08-ana-sayfa.md));
  `yetkim` (`21-ders-programi.js`); `hataGoster` (`25-tiklama.js`).
- Sunucu uçları:
  - [../../../sunucu/bolumler/okul.md](../../../sunucu/bolumler/okul.md): `GET /api/school/teachers` (`ogretmen.duzenle`;
    yalnız rolü öğretmen olanlar, `bagli` işaretiyle), `GET /api/school/students` (`ogrenci.duzenle` ya da
    `ogrenci.portal`; yalnız `ogrenci.portal`'ı olana dar liste: ad, sınıf, okul no — kullanıcı adı, e-posta, veli kodu
    boş), `GET /api/school/classes` (`sinif.yonet`), `POST /api/school/teacher-decide` (`ogretmen.onayla`; yalnız
    `pending` başvuru).
  - [../../../sunucu/bolumler/hesaplar.md](../../../sunucu/bolumler/hesaplar.md) (hepsi `ogrenci.duzenle`):
    `GET /api/school/ogrenci-velileri?studentId=` → `{ veliler: [{ id, fullName, username, role }] }`;
    `GET /api/school/veli-bul?kimlik=` → `{ kisi: { id, fullName (maskeli), username, durum: 'uygun' } }` ya da
    `{ kisi: { durum: 'uygun-degil' } }`, yoksa 404 (kişi başına dakikada 60 arama); `POST /api/school/veli-bagla`
    (bağ varsa 400; rolsüz hesap veli olur; veliye bildirim); `POST /api/school/veli-coz`.
  - Portal görünümündeki sayfalar `GET /api/progress?studentId=` vb. ister (yetki `canSeeStudent`,
    [../../../sunucu/bolumler/ilerleyis.md](../../../sunucu/bolumler/ilerleyis.md)).
- Onu kullananlar:
  - `SAYFALAR.ogretmenler`, `SAYFALAR['okul-ogrenciler']` — menü ([06-menu.md](06-menu.md)), müdürün ana sayfa
    kutucukları ([08-ana-sayfa.md](08-ana-sayfa.md)), öğrenci portalından "Öğrenci Listesi" dönüşü (`25-tiklama.js`
    `geri-veli`), [10a-giris-bilgisi.md](10a-giris-bilgisi.md) (pencere kapanınca `git('okul-ogrenciler')`),
    `10b-hesaplar.js` (hesap açılınca ya da değişince açık listeyi `git(S.page)` ile yeniler; öğretmen ekleyince
    `git('ogretmenler')`).
  - `velileriYukle` — `10b-hesaplar.js` (öğrencinin "Hesap" penceresi; `#hVeliler`, `#hVeliAra`, `#hVeliSonuc` orada çizilir).
  - `veli-bul` düğmesi `10b-hesaplar.js`'teki pencerede; `veli-bagla`, `veli-coz` düğmeleri bu dosyada üretilir.
  - `ogrenciPortalAc` — `25-tiklama.js`.
- Görünüm: `public/css/parcalar/04-kartlar.css` (`.kart`, `.satir`, `.etiket` renkleri), `12-ikonlar.css` (`.avatar`),
  `22-cesitli.css` (`.ara-kutu`), `28-yetiskin-hesap.css` (`.kisi-kodu.satir-ici`), `09-kayit-ekrani.css`
  (`.okul-bilgi`, `.rolsuz-satir`), `03-iskelet.css` (`h3.sb`), `02-form.css` (`.btn.ghost`, `.btn.tehlike` "Reddet",
  `.msg`), `27-harita-ortak.css` (`.soluk`: "kendi şifresini belirlemedi" notunun gri rengi).
- Rol: müdür; ilgili yetkileri olan öğretmen (`ogretmen.onayla`, `ogretmen.duzenle`, `ogrenci.duzenle`,
  `ogrenci.hesap-ac`, `ogrenci.portal`, `ogrenci.sifre`, `aktarim.yap`).

## Nasıl çalışır (adım adım)?

### Öğrenciler sayfası

```
menü "Öğrenciler" ─► git('okul-ogrenciler') ─► Promise.all
     GET /school/students  (düşerse [])     GET /school/classes (düşerse [])
  S._ogrListe, S._sinifListe ─► sırala (sınıf, no, ad) ─► yaz(...)
  #ogrAra oninput ─► nrm ile satırları gizle/göster
  "Hesap" ─► 10b-hesaplar.js penceresi ─► velileriYukle(öğrenci)
       T.C. yaz ─► veli-bul ─► GET /school/veli-bul?kimlik=... ─► maskeli ad ─► "Veli olarak bağla"
                ─► veli-bagla ─► POST /school/veli-bagla ─► yeşil ileti ─► velileriYukle
  "Portalını aç" ─► 25-tiklama.js ─► ogrenciPortalAc ─► S.viewStudentId ─► git('ilerleyisim')
       menü: "Öğrenci Listesi" ─► geri-veli ─► S.viewStudentId = null ─► git('okul-ogrenciler')
```

## Dikkat!

- **Düşen liste "boş okul" gibi görünür.** İki sayfa da liste isteğinin HER hatasını yutar ve boş liste kabul eder: yalnız
  yetki eksikliği değil, bağlantı kopması ya da sunucu hatası da "Henüz öğretmen hesabı yok." / "0 öğrenci kayıtlı. Henüz
  öğrenci kaydı yok." olarak görünür. Müdür okulunun boşaldığını sanabilir. Yetki eksikliğinde bile ileti yanıltıcı:
  yalnız "Kodla ekle" yetkisi olan öğretmen, okulda öğretmen olduğu hâlde "Henüz öğretmen hesabı yok." görür.
- **"Onay bekleyenler" ve "Reddet" eski düzenin kalıntısı.** Bugün öğretmen kişi koduyla eklenir, başvuru oluşmaz;
  bölüm yalnız eski `pending` satırlar için durur. "Reddet" onay sormadan çalışır (kişi rolsüz yetişkin hesabına döner,
  kilitlenmez). Planlı temizlikte kaldırılacak ("çok gerekli olmayanlar" listesinde).
- **`veli-bul` T.C. kimlik numarasını adrese yazar.** İstek `GET …/veli-bul?kimlik=<T.C.>`; uygulama adresleri
  günlüğe yazmaz ama önündeki ters vekil erişim günlüğü tutuyorsa T.C. oraya düşer. `ogretmen-bul` aynı sebeple (kişi
  kodu adrese yazılmasın) POST'a taşınmıştı; bu uç hâlâ GET ("Güvenlik denetimi" işinde ele alınacak;
  [../../../sunucu/bolumler/hesaplar.md](../../../sunucu/bolumler/hesaplar.md) Dikkat).
- **"Uygun değil" iletisi eksik söylüyor.** Ekran "öğrenci ya da yönetici hesabı" der; sunucunun `uygun-degil` saydıkları
  bu okulun öğrencisi, servisçisi, sistem yöneticisi ve onaylı olmayan hesaptır.
- **Maskeli ad bilerek.** `veli-bul` tam adı vermez: yoksa T.C. ya da kullanıcı adıyla ad öğrenme aracına dönerdi.
  Müdür adı kişiyle telefonda/yüz yüze doğrular.
- **İki arama aynı satırları süzer.** Üst çubuktaki genel arama (`araUygula`, `data-ara`) ve sayfanın `#ogrAra`'sı aynı
  satırların `display`'ini değiştirir; ikisi birlikte kullanılırsa sonuncusu kazanır, öbürünün süzmesi bozulur.
- **Portal görünümü sayfa yenilenince kaybolur.** `S.viewStudentId` yalnız bellekte; yenilemede (`26-baslat.js`
  `uygulamayiBaslat`) sıfırlanır ama adres `#/ilerleyisim` kalır. Müdür bu durumda kendi adına `/api/progress` ister ve
  "Öğrenci bulunamadı" iletisini görür (kod okumasına göre; denenmedi). Çıkışta ve portal geçişinde `S.viewStudentId`
  silinir, `S.viewStudentName` silinmez (zararsız, bir sonraki açılışta üzerine yazılır).
- **Sınıf listesi `sinif.yonet` ister.** Yalnız öğrenci yetkileri olan öğretmende `S._sinifListe` boş kalır; "Giriş
  bilgisi dağıt" penceresinde yalnız "Bütün okul" seçilebilir ([10a-giris-bilgisi.md](10a-giris-bilgisi.md)).
- **"Giriş bilgisi dağıt" yalnız `ogrenci.sifre` ile görünmez.** Düğmenin şartı `yetkim('ogrenci.sifre') && st.length`:
  öğrenci listesi gelmezse (liste `ogrenci.duzenle` ya da `ogrenci.portal` ister) düğme hiç çıkmaz; menüde de "Okul
  Öğrencileri" satırı `ogrenci.sifre` ile açılmaz ([06-menu.md](06-menu.md)). Yani müdürün bir role yalnız "Öğrenci
  şifresi sıfırlar" yetkisini vermesi ekranda bu işi açmaz (sunucu `POST /api/school/giris-bilgisi`'ye yine izin verir).
  Kod okumasına göre.
- **Sıralama tarayıcıda.** Sunucu listeyi sıralı göndermiyor olsa da ekran sınıf, numara, ad sırasıyla dizer; `'ZZZ'` ve
  `1e9` yer tutucuları sınıfsızı ve numarasızı sona atar.
- **HTML güvenliği:** bütün adlar, kullanıcı adları ve sunucu iletileri `esc`'ten geçer; `data-ara` de `esc`'li.

## Testleri

- `testler/test-veli-coklu.js` — `veli-bul` (boşluklu T.C., maskeli ad, geçersiz T.C. 400, kayıtlı olmayan T.C. 404,
  kullanıcı adıyla), öğrencinin veli olamaması (`uygun-degil`), `veli-bagla` (aynı bağ ikinci kez olmaz, rolsüz hesap veli
  olur, bildirim), `ogrenci-velileri`, `veli-coz` (bağ kalkınca veli artık göremiyor), başka okulun müdürünün
  bağlayamaması (404), başka okulun öğretmeninin yetişkin hesabının bulunması ama rol satırının veli yapılamaması,
  yetkisiz öğretmenin veli arayamaması (403).
- `testler/test-yetiskin.js` — müdürün kişi koduyla öğretmen eklemesi, maskeli ad, yetkisiz öğretmenin kod
  arayamaması, hesap penceresinde "bağlı" işareti, kişi adını değiştirince okulun öğretmen listesinde (`teachers`) de
  güncel olması, B müdürünün A okulunun öğrencilerini (`students`) görmemesi.
- `testler/test-kisi-kodu.js` — "Reddet"in sunucu tarafı: `teacher-decide { approve: false }` ile reddedilen eski usul
  öğretmen başvurusunun rolsüz yetişkin hesabına dönmesi ve kişi kodunun hemen üretilmesi.
- `testler/yetki-denetimi.js` — `GET /api/school/students` dahil her ucu her rolle deneyip yetkisiz geçen olmadığını
  denetler (düğmelerin gizlenmesine güvenilmediğinin kanıtı).
- `testler/buton-denetimi.js` — `veli-bul`, `veli-bagla`, `veli-coz`, `ogretmen-onay`, `ogrenci-portal`,
  `giris-bilgisi-ac`, `hesap-yeni`, `hesap-duzenle`, `ogretmen-kodla` eylemlerinin karşılığı.
- Elle (3200, `testler/seed.js`): müdürle Öğrenciler → arama kutusuna sınıf adı yaz; bir öğrencinin "Hesap"ına gir →
  "Veli bağla"ya kayıtlı bir velinin kullanıcı adını yaz → maskeli ad → bağla → "Veliler"de görünür, "Kaldır";
  "Portalını aç" → öğrencinin ilerleyişi, menüde "Öğrenci Listesi" ile dönüş.

## Son durum

- `git log`: 6 commit. Dosya `2b32396 commit 66` (2026-08-29) ile doğdu; `9f4b104 commit 67` (2026-08-29) ilk düzenleme.
- Son değişiklik `0acca75 commit 516` (2026-09-27, kayıt/kişi kodu/portallar): metinler "kişisel kod" → "kişi kodu",
  "okula verir" → "müdüre verir"; öğrenci satırında veli kodu `kodBicimle` ile kalın yazı yerine `kisiKoduBicim` ile
  `code.kisi-kodu.satir-ici` (kod yoksa hiç yazılmıyor).
- Ondan önce `d7c56b4 commit 260` (2026-09-25): `veli-coz` (veli bağını kaldırma) eklendi; `a29df96 commit 259`
  (2026-09-25): `veli-bagla` eklendi; `2b560ac commit 258` (2026-09-25): veli bağlamanın ilk parçası (`velileriYukle`,
  `veli-bul`).
- Bilinen açıklar (kod değiştirilmedi): hataların boş liste olarak görünmesi, "Onay bekleyenler" kalıntısı ve onaysız
  "Reddet", `veli-bul`'un T.C.'yi adreste taşıması, eksik "uygun değil" iletisi, yenilemede kaybolan portal görünümü,
  yalnız `ogrenci.sifre` yetkisiyle "Giriş bilgisi dağıt"ın görünmemesi (Dikkat).
- Planlı işlerden bu dosyaya dokunacaklar: "Çalışan olarak ekleme" (iş 2: "Öğretmenler → Kodla ekle" → "Çalışanlar →
  Kodla ekle", kişi rolsüz çalışan olarak eklenir, müdür Öğretmen/özel rol/Kodlayıcı atar; müdür çalışanı "Müdür yap"
  ile müdür yapar; "Öğretmenler" listesi öğretmen rolü olanları gösterir); "Paneller" (iş 5: "Onay bekleyenler"
  kalıntısının temizliği); "Güvenlik denetimi" (iş 3: `veli-bul`'un POST'a taşınması, okulun verdiği şifrede ilk girişte
  değiştirme); "Tek kişi tek hesap + portallar öğrencide de" (iş 19: Excel'de kayıtlı öğrenciyi eşleme, T.C. + doğum
  tarihiyle eşleşme); "Başarılarım" (iş 16: müdür/yetkili öğrenciye belge ekler); "Kullanıcı arama" (iş 6); "Yıl geçişi"
  (iş 9: mezunlar); "Toplantılar" (iş 21: tahta hesabı); "Çok dil" (iş 22).
