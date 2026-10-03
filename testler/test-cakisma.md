# testler/test-cakisma.js

"Aynı kişi iki hesap açamaz" kuralını (aynı e-posta, aynı kullanıcı adı, aynı T.C. no) yazımın her hilesine (büyük harf,
boşluk, Türkçe İ, tam genişlikli harf, görünmez karakter, Kiril harf) ve aynı anda gelen isteklere karşı; kayıttan
Excel'e, nakilden yedekten geri yüklemeye kadar hesap yazan her yolda ve doğrudan veritabanı düzeyinde deneyen sunuculu
test paketi (120 denetim).

## Bu dosya ne yapar?

Bir okul portalında "çift hesap" sinsi bir sorundur: "Ayse@X.com " ile "ayse@x.com" aynı adrestir; "AYSE.İNCE" yazan
telefonla "ayse.ince" yazan bilgisayar aynı kişidir; tam genişlikli "ａｙｓｅ" ekranda "ayse" gibi görünür; iki kişi aynı
saniyede aynı kullanıcı adını alabilir. Eğitim Evi bunu iki katmanda çözer:

1. **Uygulamada:** kimlik alanları karşılaştırılmadan önce tek biçime indirilir (`normEmail`, `normKullaniciAdi`,
   `normTc` — [../sunucu/ortak.md](../sunucu/ortak.md)): NFKC, görünmez karakterler silinir, Türkçe `İ` → `i`, küçük harf.
   E-posta ve kullanıcı adında Türkçe ya da başka alfabeden harf kabul edilmez.
2. **Veritabanında:** her kuralın tekil indeksi var (031 şema dosyası, [../sunucu/veri/sema/SEMA.md](../sunucu/veri/sema/SEMA.md));
   sistem yöneticisinin kullanıcı adı ise iki ad alanını (okul içi ve okul dışı) aştığı için bir **tetikleyiciyle**
   korunur. Aynı anda gelen iki istekten kaybeden 500 değil, alanıyla birlikte açık bir ileti alır (`hataCevir` /
   `cakisma`, [../sunucu/veri/baglanti.md](../sunucu/veri/baglanti.md)).

Bu paket iki katmanı birlikte dener: önce normalleştirme işlevlerini doğrudan çağırır, sonra hesap yazan her uçta çift
denemesi yapar, sonra uygulamayı atlayıp veritabanına doğrudan yazar, en sonda yedekten geri yüklemeyi dener.

Dosya başı yorumu sözünü şöyle özetliyor: büyük/küçük harf, baştaki/sondaki boşluk, Türkçe İ/ı, tam genişlikli harf,
birleşik aksan ve görünmez karakter ayrı hesap açtırmaz (ya aynı hesaba iner ya reddedilir); veritabanında her kuralın
tekil indeksi (ve yönetici adı için tetikleyicisi) var; kayıt ve e-posta onayı, e-posta ve kullanıcı adı değiştirme, okulun
açtığı öğrenci/servisçi, Excel ile toplu açma, nakil, kişi koduyla öğretmen ekleme, veli bağlama, `admins.json` ve yedekten
geri yükleme yollarında çift denenir; aynı anda gelen istekler çift hesap açamaz, kaybeden açık bir ileti ve doğru `alan`
alır; aynı kullanıcı adı iki okulda olabilir, giriş okul adresinden ayrılır; yöneticinin kullanıcı adı hiçbir hesapla
çakışmaz (yarış dahil); eski sürümde saklanmış e-posta açılışta bugünkü biçime getirilir (`admins.json`'dan önce), aynı
biçimde başka hesap varsa dokunulmaz, raporlanır. **Yalnız test veritabanında (`_test`) çalışır.**

## İçinde neler var?

### Yardımcılar

- `kontrol(ad, sart, detay)`, `J(x)` (260 harflik JSON), `bekle(ms)`.
- `testDeposu()` — `EE_DATA`'yı `testler/testdata`'ya çevirir, ayarları oradan yükler (`ayarlariYukle`), bağlanılacak
  veritabanının adı `_test` ile bitmiyorsa `null` döner; bitiyorsa `{ baglanti, kullanicilar, genel }` (bağlantı ve iki
  depo modülü). Paket `null`'da "test veritabanı değil" diye 1 ile çıkar, hiçbir şeye dokunmaz.
- `kayit(g)` — bot sorusunu çözüp `POST /api/register` (`kvkkOnay`, telefon, şifre `Test1234!` varsayılan); onaylamaz.
- `onayAnahtarlari(eposta)` — sunucu günlüğünden (`LOG`) o adrese giden **bütün** onay anahtarları, sırayla (aynı adrese
  iki bağlantı gittiğinde ikisini de almak için); `sonAnahtar(eposta)` sonuncusu; `onayla(anahtar)` →
  `POST /api/eposta-onay`.
- `giris(kimlik, sifre, kodKimlik, okul)` — iki adımlı giriş; kodu günlükte `kodKimlik` için arar; `okul` verilirse okul
  adresinden (kısa ad) giriş.
- Ana gövdede: `say(sql, p)` (`count(*)` sayısı), `z` (`Date.now().toString(36)`, bu koşuya özgü ek), `logBas` (paket
  başladığında günlüğün boyu; 10b'nin sonunda yalnız bu paketin yazdıkları taranır), `hesapAcOkul(T, g)` →
  `POST /api/school/hesap-ac` (varsayılan `rol: 'student'`, şifre `Test1234!`), `ham(g)` (veritabanına doğrudan yazılacak
  hesap nesnesi), `hata(fn)` (fırlatılan hatayı döndürür).

Ortak yardımcılar [giris.md](giris.md) üzerinden ([../araclar/giris.md](../araclar/giris.md)): `iste`, `girisYap`,
`botCevabi`, `hesapAc`, `kisiKodu`, `kisilikGec`, `sonKod`, `tcUret`, `LOG`.

### Hesaplar ve veriler

Seed'den ([seed.md](seed.md)): yönetici (`A`), müdür (`M`; okulu `okulA`, adresi `kisaA`), `mudur@test.com` ve
`mat@test.com` adresleri, `ogrenci1` (kullanıcı adı ve T.C. no'su "alınmış" örneği olarak), `admin` kullanıcı adı.
Paketin açtıkları `z` ekiyle adlanır: yetişkin hesapları (`cakA<z>`, `ilkercak<z>`, `cakb<z>`, `cakc<z>`, `cakmudur<z>`,
`tcak<z>`, `tcakiki<z>`, `vcak<z>`, `vcakiki<z>` …), okul öğrencileri ve servisçileri, ikinci okul "Çakışma Ortaokulu <z>"
(`cakisma-<z>`), bir `admins.json` dosyası ve doğrudan yazılan "ham" hesaplar.

### 1) Normalleştirme (14)

Sunucusuz, `sunucu/ortak.js` doğrudan çağrılır:

- E-posta: `'  Ayse@X.com '` → `ayse@x.com`; `AYSE.İNCE@X.COM` → `ayse.ince@x.com`; tarayıcının küçülttüğü `i̇` (i +
  birleşik nokta) da `i`; tam genişlikli `ＡＹＳＥ＠ｘ．ｃｏｍ` → `ayse@x.com`; sıfır genişlikli boşluk ve yumuşak tire
  silinir; küçük `ı` içeren adres "Türkçe" iletisiyle reddedilir; Kiril `а` reddedilir; birleşik aksan tek harfe (`é`)
  iner ve reddedilir; `+` ve `.` içeren ASCII adres geçer.
- Kullanıcı adı: büyük harf ve boşluk aynı ad; `İSMAİL` → `ismail` ve geçerli; tam genişlikli harfler (`ａｙｓｅ` →
  `ayse`) ve Kelvin işareti (U+212A, koddaki `'Kemal'` → `kemal`) ASCII olur; `ı` ve Kiril harf reddedilir.
- T.C.: tam genişlikli rakam, boşluk ve görünmez karakterli yazım 11 haneli düz sayıya iner.

### 2) Veritabanı: tekil indeksler ve tetikleyici (10)

`pg_indexes`'te `kullanicilar` için şu dokuz indeks var: `kullanicilar_eposta_key`, `kullanicilar_kadi_okul`,
`kullanicilar_kadi_genel`, `kullanicilar_tc_okul`, `kullanicilar_tc_genel`, `kullanicilar_tc_ogrenci`,
`kullanicilar_okul_no`, `kullanicilar_ana_okul`, `kullanicilar_yonetici_adi`; `pg_trigger`'da `kullanicilar_yonetici_adi`
tetikleyicisi var. (Sonuncu indeks tekil değildir: yalnız yöneticilerin adlarını tutar, tetikleyici okul hesabı yazılırken
aynı adlı yöneticiyi onunla arar — 031.)

### 3) Kayıt ve e-posta onayı (23)

- Büyük harfli ve boşluklu adresle kayıt kabul, onayla hesap açılır; e-posta ve kullanıcı adı küçük harfle, boşluksuz
  saklanmış (veritabanından okunur).
- Aynı adres büyük harfle, tam genişlikli ve sıfır genişlikli boşlukla ikinci kez kayıt olamaz (400, `alan: 'email'`,
  "kayıtlı"); Türkçe büyük `İ` ile yazılan aynı adres de. `ı` içeren ve Kiril harfli adresler reddedilir.
- Aynı kullanıcı adı büyük harfle, tam genişlikli ve boşluklu alınamaz (`alan: 'kullaniciAdi'`); okuldaki bir öğrencinin
  adı (`OGRENCI1`) ve yöneticinin adı (`Admin`) da. Aynı T.C. (araya boşluk konmuş) ikinci yetişkin hesabına yazılamaz
  (`alan: 'tc'`).
- Girişte büyük harfli ve boşluklu e-posta, `İ` ile yazılmış kullanıcı adı aynı hesabı bulur.
- **Yarışlar:** aynı adla iki kayıt bekler (ikisi de 200; hesap henüz yok); iki onay aynı anda tıklanır → biri açılır,
  öteki 400 `alan: 'kullaniciAdi'`; veritabanında o adla tek hesap. Aynı T.C. ile iki bekleyen kayıt aynı anda onaylanır →
  biri açılır, öteki `alan: 'tc'`; o T.C. ile tek yetişkin. Aynı bağlantıya aynı anda üç tıklama → tek 200, tek hesap.

### 4) E-posta ve kullanıcı adı değiştirme (10)

`POST /api/hesap/bilgi` ile (`cakb<z>` = B, `cakc<z>` = C): başkasının e-postasına (büyük harfle) geçilemez
(`alan: 'eposta'`); aksanlı harfli e-postaya geçilemez; başkasının, yöneticinin ve okuldaki bir öğrencinin kullanıcı
adına geçilemez (`alan: 'kullaniciAdi'`). B ve C aynı anda aynı yeni ada geçer → biri alır, öteki `alan: 'kullaniciAdi'`; o
adla tek hesap. İkisi aynı yeni adrese (biri büyük harfle) bağlantı ister (ikisi de `onayBekliyor`); iki bağlantı aynı
anda tıklanır → adres birinde, öteki 400 `alan: 'email'`; o adres tek hesapta.

### 5) Okulun açtığı hesaplar: öğrenci, servisçi (13)

`POST /api/school/hesap-ac` (müdür) ile: okulda aynı kullanıcı adı (`' OGRENCI1 '`) → `kullaniciAdi`; `ogrenci1`'in T.C.
no'su → `tc`; başka hesabın e-postası (`MUDUR@TEST.COM `) → `eposta`; Türkçe harfli e-posta → `eposta`; servisçi okuldaki
öğrencinin T.C. no'sunu alamaz → `tc`; öğrenciye `ADMIN` adı verilemez → `kullaniciAdi`; ama öğrenci bir yetişkinin
adını alabilir (okul hesapları ayrı ad alanında, 009) → 200.

Aynı anda: aynı adla 4 öğrenci → 1 açıldı, 3 `kullaniciAdi`; aynı T.C. ile 4 → 1 açıldı, 3 `tc`; aynı e-postayla (biri
küçük, ikisi büyük harfle) 3 → 1 açıldı, 2 `eposta`; veritabanında üçünden de birer hesap. `POST /api/school/hesap-guncelle`
ile başka öğrencinin adı (büyük harfle) verilemez; iki öğrenci aynı anda aynı yeni ada → biri alır, öteki `kullaniciAdi`.

### 6) Excel ile toplu açma (6)

`xlsx.yaz` ile bellekte bir "Öğrenciler" sayfası kurulur (başlıklar: Ad, Soyad, T.C. Kimlik No, Kullanıcı adı, E-posta,
Şifre) ve `POST /api/school/kisi-aktarim`'a base64 gönderilir.

- Önizleme (`uygula: false`), altı satır: yalnız ilk satır hazır (`hazir === 1`); ikinci satır ilkinin adını ve
  e-postasını harf ve boşluk farkıyla tekrarlar → "dosyada 2. satırda da var" (başlık 1. satır olduğu için ilk veri
  satırı); okuldaki öğrencinin adı → "alınmış", başka hesabın e-postası → "başka bir hesapta", yönetici adı → "alınmış";
  okulda kayıtlı bir T.C. no yeni hesap açmaz, satır `guncel…` (güncelleme) sayılır.
- Aynı üç satırlık liste aynı anda iki kez uygulanır (`uygula: true`) → bu T.C.'lerle tam 3 hesap; yüklemelerden biri
  `acilan: 3` ile 200, öbürü ya 200 (güncelleme) ya da 409 + `alan` + "Hiçbir hesap açılmadı".

### 7) İkinci okul: aynı ad, aynı T.C., nakil, giriş (9)

- `cakmudur<z>` için yönetici "Çakışma Ortaokulu <z>"u (`cakisma-<z>`, Ankara / Çankaya) açar; müdür girişi tek portalda
  doğrudan müdür değilse `kisilikGec` ile müdür rolüne geçilir (`MB`).
- Aynı kullanıcı adı (`ayniogr<z>`, birinde büyük harfle) iki okulda açılabilir; okul adresiyle (`okul: kisaA` /
  `cakisma-<z>`) giriş doğru okulun hesabını bulur; okul seçmeden aynı adla giriş → 400 `okulSec: true`.
- Aynı T.C. ile iki okulda aynı anda öğrenci → veritabanında tek öğrenci; kaybeden okul ya 400 `alan: 'tc'` ya da 409
  `nakil: 'dogum'` (nakil sorusu) alır.
- `okulA`'da doğum tarihli bir öğrenci, B okulunda aynı T.C. ile servisçi var; B okulu o T.C. ve doğum tarihiyle öğrenci
  açmaya (nakle) kalkar → 400 `alan: 'tc'`; öğrenci eski okulunda kalır.

### 8) Kişi koduyla öğretmen, veli bağlama (5)

- Bir öğretmenin kullanıcı adı okulda bir öğrencide zaten var; müdür onu kişi koduyla ekleyince öğretmenin rol satırı
  **başka** (aynı adla başlayan) bir ad alır.
- Aynı kişi koduyla aynı anda iki `POST /api/school/ogretmen-ekle` → tek öğretmen rolü.
- Veli aynı veli kodunu aynı anda iki kez girer (`POST /api/parent/link`) → tek bağ (`veli_baglari`).
- Okul veliyi büyük harfle yazılan kullanıcı adıyla bulur (`GET /api/school/veli-bul`); aynı veliyi aynı anda iki kez
  bağlar (`POST /api/school/veli-bagla`) → tek bağ.

### 9) `admins.json` (6)

`testler/testdata/admins-cakisma-<z>.json` yazılır ve `sunucu/yonetici-dosyasi.js`'in `uygula`'sı doğrudan çağrılır
(şifre üreticisi sabit); dosya hemen silinir. Beş satır: büyük harfli `mudur@test.com` ve tam genişlikli `mat@test.com`
yönetici yapılmaz ("yönetici olmayan…"), okuldaki bir hesabın kullanıcı adı yöneticiye verilmez ("kullanıcı adı başka bir
hesapta"), Türkçe harfli e-posta atlanır ("Türkçe"), geçerli satır açılır ve e-postası ile adı küçük harfle saklanır. Sonra
okul bu yeni yöneticinin adını öğrenciye veremez, kimse o adla kaydolamaz.

### 10) Veritabanı düzeyi (11)

Uygulama denetimi atlanıp `depo.kullanicilar.ekle`/`guncelle` doğrudan çağrılır:

- Aynı e-posta → `23505` ve `hataCevir` → 400, `alan: 'eposta'`. Okulda aynı ad → `kullanicilar_kadi_okul`,
  `alan: 'kullaniciAdi'`. Öğrencinin T.C. no'su başka okulda → `kullanicilar_tc_ogrenci`, `alan: 'tc'`. Yetişkinde aynı T.C. →
  `kullanicilar_tc_genel`.
- Yöneticiye okuldaki bir hesabın adı, okul hesabına yöneticinin adı, var olan öğrencinin adını `admin` yapmak (UPDATE) →
  üçü de tetikleyiciden `kullanicilar_kadi_yonetici`.
- **Yarış 1:** bir işlemde yönetici satırı yazılır ve işlem açık tutulur; 300 ms sonra aynı adla öğrenci yazılmaya
  başlar; 500 ms sonra öğrenci yazması hâlâ bitmemiş olmalı (yöneticinin tablo kilidini bekliyor); işlem bitince öğrenci
  tetikleyiciye takılır.
- **Yarış 2:** tersi — öğrenci işlemi açıkken yönetici yazılır; yönetici öğrenci işlemini bekler, sonra takılır.
- İki yarışın adları toplam iki hesapta. Açılış raporu (`cakismaRaporu`): yöneticiyle aynı adlı hesap yok, e-posta çifti
  yok, öğrenci T.C. çifti yok. Ardından paket kendi açtığı yönetici satırlarını siler.

### 10b) Eski sürümde saklanmış e-posta (8)

Eski `normEmail` yalnız kırpıp küçültüyordu; `İ` bu yüzden `i̇` (i + birleşik nokta) olarak saklanmış olabilir.

- Veritabanına doğrudan üç rolsüz hesap yazılır: eski biçimli `eski<z>.i̇nce@test.com` (`ESKI<z>.İNCE@TEST.COM`'un
  yalnız kırpılıp küçültülmüş hâli, şifreli); bugünkü biçimiyle `cakis<z>.ince@test.com`; ve aynı adresin eski biçimli
  kopyası (`CAKIS<z>.İNCE@TEST.COM`'dan).
- Ön koşul: eski biçim bugünkünden farklı ve düzeltmeden önce e-postayla giriş 401.
- `eskiEpostalariSadelestir()` eski adresi bugünkü biçime getirir; sonra büyük `İ` ile de düz `i` ile de giriş 200; aynı
  adresle yeni kayıt `alan: 'email'` alır. Bugünkü biçimi başka hesapta olan eski adrese dokunulmaz, `cakisan` listesinde
  ve açılış raporunun `epostaCift`'inde görünür. İkinci çağrıda düzeltilecek adres kalmaz.
- **Açılış sırası:** eski biçimli bir adres ve aynı adresi büyük `İ` ile yönetici yapmaya çalışan bir `admins-sira-<z>.json`
  hazırlanır; `require('../sunucu/veri').acilisHesaplari({ dosya, sessiz: true })` çağrılır. Eski adres önce düzeltildiği
  için dosyadan yönetici açılmaz ("yönetici olmayan bir hesapta"), hesap rolsüz kalır, o adresle tek hesap var. (Bu çağrı
  ekrana "Eski biçimde saklanmış 1 e-posta adresi bugünkü biçime getirildi…" satırını basar; denetim değildir.)
- Son denetim: paket başladığından beri sunucu günlüğünde `API hatası` ya da `Veritabanı hatası` yok (`sunucu/index.js`
  bunları yakalanmamış hatada 500 dönerken ve veritabanı hatası 5xx'e çevrilirken yazar; yani hiçbir yarış 500'e
  düşmedi).

### 11) Yedekten geri yükleme (5) — son adım, veriyi yeniden yazar

`json-aktarim`'in `disaAktar()`'ı ile bütün veri alınır, içine dört çiftli hesap eklenir (yöneticinin adını taşıyan
öğrenci; okulda bir öğrencinin T.C. no'sunu taşıyan servisçi; başka okulda aynı T.C.'li öğrenci; büyük harfle yazılmış
`mudur@test.com`'lu veli) ve `iceAktar()` ile geri yüklenir: 23505 olmadan biter; yönetici adlı öğrenci başka ad alır,
yönetici `admin` kalır; servisçi ve öbür okuldaki öğrenci T.C.'siz yüklenir; çift e-postalı veli atlanır; öğrencinin T.C.
no'su yine tek.

Sonunda havuz kapatılır, boş satır ve `GECTI: 120  KALDI: 0` (başında boşluk yok, arada iki boşluk; `tumtest.sh`
`GECTI: [0-9]+` aradığı için fark etmez); `KALDI` varsa çıkış kodu 1. Beklenmeyen hata `TEST HATASI:` ile yığını yazar,
çıkış kodu 1.

## Kimle konuşur?

- **Modüller** (paket sunucu kodunu doğrudan da yükler):

  | Modül | Ne için |
  |---|---|
  | [giris.md](giris.md) (`araclar/giris.js`) | istek, giriş, kayıt, kişi kodu, rol geçişi, günlükteki kod |
  | [../sunucu/ortak.md](../sunucu/ortak.md) | `normEmail`, `normKullaniciAdi`, `normTc`, `epostaSorunu`, `kullaniciAdiSorunu`, `uid`, `now` |
  | [../sunucu/yardimci/xlsx.md](../sunucu/yardimci/xlsx.md) | `yaz`: bellekte Excel |
  | [../sunucu/ayarlar.md](../sunucu/ayarlar.md) | `ayarlariYukle` (`testler/testdata/ayarlar.json`) |
  | [../sunucu/veri/baglanti.md](../sunucu/veri/baglanti.md) | `veritabaniAdi`, `sorgu`, `tek`, `islem`, `hataCevir`, `kapat` |
  | [../sunucu/veri/depo/kullanicilar.md](../sunucu/veri/depo/kullanicilar.md) | `ekle`, `guncelle`, `sil`, `cakismaRaporu`, `eskiEpostalariSadelestir` |
  | [../sunucu/veri/depo/genel.md](../sunucu/veri/depo/genel.md) | `yonetici-dosyasi`'na verilen depo nesnesinin parçası |
  | [../sunucu/yonetici-dosyasi.md](../sunucu/yonetici-dosyasi.md) | `uygula` |
  | [../sunucu/sifre.md](../sunucu/sifre.md) | `hashPw` (10b'deki eski hesabın şifresi) |
  | [../sunucu/veri/index.md](../sunucu/veri/index.md) | `acilisHesaplari` |
  | [../sunucu/veri/json-aktarim.md](../sunucu/veri/json-aktarim.md) | `disaAktar`, `iceAktar` |

- **Sunucu uçları:**

  | Uç | Ne için | Belge |
  |---|---|---|
  | `POST /api/register`, `POST /api/eposta-onay`, `GET /api/challenge`, `POST /api/login`, `POST /api/login/dogrula` | kayıt, onay, giriş | [../sunucu/bolumler/kayit.md](../sunucu/bolumler/kayit.md) |
  | `POST /api/hesap/bilgi`, `GET /api/kisilikler`, `POST /api/kisilik/gec` | e-posta ve ad değiştirme, kişi kodu | [../sunucu/bolumler/kisilik.md](../sunucu/bolumler/kisilik.md) |
  | `POST /api/school/hesap-ac`, `POST /api/school/hesap-guncelle`, `GET /api/school/adres`, `POST /api/school/ogretmen-ekle`, `GET /api/school/veli-bul`, `POST /api/school/veli-bagla` | okulun açtığı hesaplar | [../sunucu/bolumler/hesaplar.md](../sunucu/bolumler/hesaplar.md) |
  | (hesap-ac içinden) nakil | başka okuldaki öğrenci | [../sunucu/bolumler/nakil.md](../sunucu/bolumler/nakil.md) |
  | `POST /api/school/kisi-aktarim` | Excel | [../sunucu/bolumler/kisi-aktarim.md](../sunucu/bolumler/kisi-aktarim.md) |
  | `POST /api/admin/okul-ac` | ikinci okul | [../sunucu/bolumler/yonetici-okul.md](../sunucu/bolumler/yonetici-okul.md) |
  | `POST /api/parent/link` | veli kodu | [../sunucu/bolumler/veli.md](../sunucu/bolumler/veli.md) |

- **Koruduğu kod:** `sunucu/veri/sema/031-cakismalar.sql` (indeksler ve tetikleyici; [../sunucu/veri/sema/SEMA.md](../sunucu/veri/sema/SEMA.md)),
  `CAKISMALAR` / `cakisma` / `hataCevir` ([../sunucu/veri/baglanti.md](../sunucu/veri/baglanti.md)), `kimlikSade` ve
  doğrulayıcılar ([../sunucu/ortak.md](../sunucu/ortak.md)), kayıt ve onay ([../sunucu/bolumler/kayit.md](../sunucu/bolumler/kayit.md),
  [../sunucu/veri/depo/onaylar.md](../sunucu/veri/depo/onaylar.md)), `hesapDogrula` ([../sunucu/bolumler/hesaplar.md](../sunucu/bolumler/hesaplar.md)),
  Excel aktarımı, nakil, `yonetici-dosyasi.js`, açılıştaki eski e-posta düzeltmesi ve yedekten geri yüklemedeki çift
  ayıklaması (`iceAktar`'ın kullanıcı döngüsü: yönetici adlarını baştan ayırır, ad ve T.C. alanlarını okul/yetişkin ad
  alanına göre tekler, aynı e-postalı ikinci hesabı atlar; [../sunucu/veri/json-aktarim.md](../sunucu/veri/json-aktarim.md)).
- **Tablolar:** doğrudan `kullanicilar`, `pg_indexes`, `pg_trigger`, `veli_baglari`; dolaylı `eposta_onaylari`,
  `okullar`, `oturumlar` ve 11. bölümde **bütün tablolar** (geri yükleme hepsini yeniden yazar).
- **Ön yüz** (aynı kuralları gösterir, bu pakette tarayıcı yok): alanlı hatalar [../public/js/parcalar/04a-form-alanlari.md](../public/js/parcalar/04a-form-alanlari.md),
  giriş [../public/js/parcalar/05-giris.md](../public/js/parcalar/05-giris.md), hesaplar [../public/js/parcalar/10b-hesaplar.md](../public/js/parcalar/10b-hesaplar.md),
  Excel [../public/js/parcalar/15-aktarim.md](../public/js/parcalar/15-aktarim.md), `admins.json` ekranı
  [../public/js/yonetim/09c-yonetici-dosyasi.md](../public/js/yonetim/09c-yonetici-dosyasi.md).
- **Onu çalıştıran:** `testler/tumtest.sh`, sunuculu paket döngüsünün sonlarında (`test-site-ayarlari`'ndan sonra,
  `test-okul-agi`'ndan önce); her paketten önce `testler/test-ayarlari.js` `testler/testdata/ayarlar.json`'u yazar,
  sunucu sıfırlanmış veritabanıyla açılır ve [seed.md](seed.md) çalışır.

## Nasıl çalışır (adım adım)?

```
testDeposu(): EE_DATA=testler/testdata ─► ayarlar ─► veritabanı adı _test mi? ── hayır ─► KALDI, çık
A, M girer ; okulA (veritabanından), kisaA
1) ortak.js normalleştiricileri (sunucusuz)
2) pg_indexes / pg_trigger
3) kayıt + onay: biçim hileleri ─► 400 alanlı ; yarışlar (iki onay, üç tıklama) ─► tek hesap
4) hesap/bilgi: başkasının adresi/adı ─► 400 ; B ve C aynı anda ─► biri
5) hesap-ac: okul içi çiftler ─► 400 ; 4/4/3'lü eşzamanlı açılış ─► birer hesap ; hesap-guncelle yarışı
6) kisi-aktarim: önizleme raporu ; aynı liste aynı anda iki kez ─► 3 hesap
7) ikinci okul: aynı ad iki okulda, okul adresiyle giriş, okulSec ; aynı T.C. iki okulda ─► tek öğrenci ; nakil reddi
8) ogretmen-ekle (ad çakışması, eşzamanlı) ; parent/link ve veli-bagla eşzamanlı ─► tek bağ
9) yonetici-dosyasi.uygula(admins-cakisma-<z>.json) ─► atlananlar + 1 eklenen
10) depo.ekle/guncelle doğrudan ─► 23505 + hataCevir ; tetikleyici ; iki kilit yarışı ; cakismaRaporu
10b) eski biçimli e-postalar ─► eskiEpostalariSadelestir ─► acilisHesaplari sırası ; günlükte 500 yok
11) disaAktar ─► çiftler ekle ─► iceAktar ─► çiftler ayıklandı
kapat()
```

## Dikkat!

- **Veritabanına doğrudan yazar ve en sonda bütün veriyi yeniden yazar.** Koruma `testDeposu()`'dur: adı `_test` ile
  bitmeyen veritabanında paket hiçbir şeye dokunmadan çıkar. Ad, `testler/testdata/ayarlar.json`'dan (ya da ortamda
  `DATABASE_URL` varsa ondan) okunur; `EE_DATA` paketin içinde zorla `testler/testdata` yapılır. Bu yüzden 3200'deki
  sunucu ile paketin doğrudan bağlandığı veritabanı **aynı** olmalı (ikisi de `test-ayarlari.js`'in yazdığı ayardan);
  değilse uç denetimleri bir veritabanına, doğrudan sorgular başka birine bakar.
- **`EE_DATA` sırası kırılgan.** `testDeposu()` ortam değişkenini `sunucu/ayarlar` ilk kez yüklenmeden önce değiştirir;
  dosyanın başındaki `require`'lar (`ortak.js`, `xlsx.js`) bugün `yollar.js`'i yüklemediği için bu çalışır. Başa `yollar`'ı
  yükleyen bir modül eklenirse ayarlar gerçek `data/`'dan okunur; o zaman koruma devreye girer ve paket "test veritabanı
  değil" diye çıkar (zarar vermez ama test çalışmaz).
- **Kilit yarışları zamana bağlı.** Yarış 1 ve 2, ilk işlemin tablo kilidini 300 ms içinde almasına güvenir. Çok yavaş ya
  da meşgul bir makinede ikinci yazma kilitten önce davranırsa (ör. yarış 1'de öğrenci önce yazılırsa yöneticinin işlemi
  fırlatır) `await yonIs` satırında paket `TEST HATASI` ile durabilir (koddan çıkarım; görülmedi).
- **"İki yarışta da ad tek hesapta" toplam sayar.** İki adın toplamı 2 mi diye bakar; bir adda 2, ötekinde 0 olsa da
  geçerdi. Asıl güvence önceki iki denetimdeki tetikleyici hatasıdır.
- **"Sunucu 500 vermedi" denetimi 11. bölümden önce.** Geri yükleme paketin kendi sürecinde çalışır (sunucuda değil); o
  bölümdeki bir hata ancak `TEST HATASI` olarak görünür. `tumtest.sh` ise günlüğü paket döngüsünde ayrıca taramaz.
- **11. bölümden sonra sunucunun altındaki veri değişmiştir.** Geri yükleme bütün tabloları yeniden yazar; sunucu açık
  kalır. Bu bölüme yeni bir adım eklemek ya da sonrasına başka denetim koymak gerekirse bunu hesaba kat; paket bu yüzden
  ona "son adım" diyor.
- **Bellekteki sınırlar:** `POST /api/hesap/bilgi` hesap başına saatte 10 istek (reddedilenler de sayılır); 4. bölümde B
  bunun 7'sini kullanır. Aynı adrese saatte 3 kayıt postası; paket her adrese en çok bir kayıt postası gönderir. Kayıt
  denemesi bağlantı başına saatte 100, bekleyen kayıt saatte 60; bu paket 28 kayıt isteği yapar, 14'ü onaya düşer. Aynı
  sunucuyu yeniden başlatmadan paketi art arda koşarsan bu sayaçlar birikir.
- **Geçici dosyalar:** `testler/testdata/admins-cakisma-<z>.json` ve `admins-sira-<z>.json` yazılıp silinir; paket arada
  çökerse kalır (bir sonraki sıfırlamada `testdata` zaten silinir).
- **Kendi açtıklarını kısmen temizler:** 10. bölümün yöneticileri (`cakyon<z>`, `yarisyon<z>`) ve 10b'nin dört ham hesabı
  silinir; öbür hesaplar kalır (veritabanı her pakette sıfırlanır).
- **Günlüğe bağlı:** onay anahtarları ve iki adımlı kodlar `EE_LOG`'dan okunur; sunucunun e-postası ayarsız ve çıktısı o
  dosyaya gidiyor olmalı ([giris.md](giris.md)).
- **Seed'e bağlı:** `mudur@test.com`, `mat@test.com`, `ogrenci1`, `admin` ve okul adresi (`/api/school/adres`).
- **Varsayılan adres 3000.** `EE_BASE` vermeden çalıştırırsan uç istekleri kendi sunucuna gider (hesap, okul, Excel
  açar); doğrudan veritabanı adımları ise `testdata` ayarı `_test`'i gösterdiği sürece yalnız test veritabanına gider. İkisi
  ayrışır ve paket anlamsızlaşır; her zaman test sunucusunu kullan.

## Testleri

- Bu dosyanın kendisi testtir; `testler/tumtest.sh` her tam koşuda çalıştırır. Aynı alanda: [test-giris-kayit.md](test-giris-kayit.md)
  (kayıt hataları, kilit, T.C. çakışmasında sorunun yanması), `testler/test-kisi-kodu.js`, `testler/test-yetiskin.js`,
  `testler/test-nakil.js` (nakil kuralları), [test-aktarim.md](test-aktarim.md) (Excel aktarımı),
  `testler/test-yonetici-dosyasi.js` (`admins.json`), `testler/test-yedek.js` (yedek ve geri yükleme),
  [sql-denetimi.md](sql-denetimi.md) (SQL'in parametreli yazılması).
- Elle (Git Bash, proje kökünde; 3200'de `tumtest.sh`'deki gibi açılmış, `testler/testdata/ayarlar.json`'u test
  veritabanını gösteren ve [seed.md](seed.md) ile tohumlanmış test sunucusu varken):

  ```
  EE_BASE=http://localhost:3200 EE_LOG=testler/test-sunucu.log node testler/test-cakisma.js
  ```

- 3 Ekim sabahı bu belge için 3200'de, sıfırlanmış `egitimevi_test` ve seed'le koşuldu: `GECTI: 120  KALDI: 0`, yaklaşık
  6 saniye; çıktıda 10b'nin bilgi satırı göründü; sunucu günlüğünde `API hatası` ya da `Veritabanı hatası` yok; koşudan
  sonra `testler/testdata`'da yalnız `ayarlar.json` ve `okullar.json` kaldı (geçici `admins-*.json`'lar silinmişti).
  Belgenin denetiminde yeniden koşuldu, aynı sonuç (yaklaşık 6 saniye, aynı bilgi satırı, aynı iki dosya). Aynı
  veritabanında ikinci koşu denenmedi; ne olacağı belirsiz (11. bölüm ilk koşuda eklediği `u_cak_*` kimlikli satırları
  yeniden eklemeye çalışır).

## Son durum

- `git log`: tek commit. Dosya `276c0a0 commit 521` (2026-09-27) ile 553 satır olarak eklendi; o günden beri değişmedi.
  Aynı commit korunan kodun hepsini getirdi: `sunucu/veri/sema/031-cakismalar.sql`, `sunucu/ortak.js`'teki
  normalleştirme, `sunucu/veri/baglanti.js`'teki `CAKISMALAR`/`cakisma`, `sunucu/yonetici-dosyasi.js` (yeni dosya),
  `sunucu/veri/index.js`'teki açılış hesapları, `sunucu/veri/depo/kullanicilar.js`, `sunucu/veri/json-aktarim.js`,
  kayıt/hesap/aktarım/nakil bölümlerindeki değişiklikler (ve aynı günün yönetim paneli işleri).
- Açık iş yok; kod değiştirilmedi. Zayıf noktalar (zamana bağlı yarışlar, toplam sayan denetim) "Dikkat!"te.
- Planlı işlerden bu dosyayı etkileyecekler:
  - **"Tek kişi tek hesap + portallar öğrencide de"** (onaylı; canlıdan önce) — **kullanıcı adı site genelinde tek** olacak
    ("Okul seç" ile); 5. bölümdeki "öğrenci bir yetişkinin adını alabilir (009)" ve 7. bölümdeki "aynı kullanıcı adı iki
    okulda" denetimleri tersine döner; T.C. + doğum tarihiyle eşleşme ve Excel'de "Eşleyelim mi?" 6. ve 7. bölümleri
    değiştirir.
  - **"T.C. kimlik no bütün hesaplarda zorunlu"** (kod Linux'ta) — paketteki T.C.'siz kayıtlar ve `hesapAc` çağrıları 400
    alır; 3. ve 4. bölümler T.C. göndermeli.
  - **"Kullanıcı arama + hesap penceresinde yöneticinin ve desteğin … e-posta, ad/kullanıcı adı değiştirmesi"** — hesap
    yazan yeni yollar; her biri bu pakete bir çift denemesiyle eklenmeli.
  - **"Çalışan olarak ekleme"** — 8. bölümdeki kişi koduyla öğretmen ekleme rolsüz çalışana dönüşür.
  - **"Güvenlik denetimi"** ve **"Özel branş / ders"** (8. bölümde `brans: 'Türkçe'`, `'Matematik'`) dolaylı dokunabilir.
