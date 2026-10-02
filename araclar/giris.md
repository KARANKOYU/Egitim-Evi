# araclar/giris.js

Araçların ve bütün test paketlerinin ortak giriş ve hesap açma yardımcısı: JSON isteği, bot sorusu, iki adımlı giriş kodunu
ve e-posta onay anahtarını sunucu günlüğünden okuma, yetişkin kaydı, kişi koduyla öğretmen ya da müdür yapma, okul hesabı
açma, geçerli T.C. kimlik no üretme.

## Bu dosya ne yapar?

Eğitim Evi'nde yetişkin hesaplarına (müdür, öğretmen, veli, yönetici) iki adımlı giriş zorunludur: şifreden sonra e-postaya
6 haneli bir kod gider. Bir betik e-posta kutusunu okuyamaz. Ama sunucu, e-posta ayarlı değilken, adres hiçbir yere
teslim edilmeyen bir uzantıdaysa (`.test` gibi) ya da gönderim hata verdiyse kodu kendi penceresine yazar
([../sunucu/guvenlik.md](../sunucu/guvenlik.md)). Bu dosya o pencerenin çıktısını bir dosyaya yönlendirdiğini varsayar
(`node server.js > sunucu.log`) ve kodu oradan okur. Kayıttaki e-posta onay bağlantısı için de aynısını yapar. Bu yüzden
yalnız kendi bilgisayarında, çıktısını dosyaya yazan bir sunucuyla işe yarar.

İkinci işi, "bir hesap nasıl doğar" sorusunun cevabını tek yerde tutmak. Bugünkü düzende kendi kendine kaydolan tek hesap
yetişkin hesabıdır; veli çocuğunun veli kodunu girer, öğretmen kişi kodunu müdüre, okulunu açtırmak isteyen kişi kişi kodunu
yöneticiye verir; öğrenci ve servisçi hesabını okul açar. Testler ve araçlar bu yolları kısayol kullanmadan, gerçek uçlardan
yürür: `hesapAc`, `ogretmenYap`, `okulHesabi`, `mudurYap` bu yolların her biridir.

`testler/giris.js` yalnız bu dosyayı yeniden dışa açar (`module.exports = require('../araclar/giris')`). Yani pratikte 46
test dosyası ve 4 araç bu dosyaya bağlıdır: burada yapılan bir değişiklik neredeyse bütün test takımını etkiler.

"Neden hepsi bunu kullanıyor, her test kendi girişini yazsa olmaz mı?" diye sorarsan: olur ama her biri aynı üç tuzağı
yeniden çözmek zorunda kalırdı. Kod günlükte başkasınınkiyle karışır (yanlış kod hesabı kilide sokar, bu yüzden kişiye göre
aranır), bot sorusu ve e-posta onayı her kayıtta aynı adımlarla geçilir, hesap açma kuralı değişince (ör. müdür başvurusu
kalkıp kişi koduyla okul açmaya geçilince) yalnız bu dosya değişir. Bir test bunlardan birini bilerek kendisi yapmak
istiyorsa (ör. `testler/test-giris-kayit.js` kaydı adım adım dener) uçları `iste` ile doğrudan çağırır.

## İçinde neler var?

### Ortam değişkenleri

- `BASE` (dışa açık) — `EE_BASE` ya da **`http://localhost:3000`**. Bütün istekler buraya gider.
- `LOG` (dışa açık) — `EE_LOG` ya da proje kökündeki `sunucu.log`. Kodlar ve onay anahtarları buradan okunur.

### İstek

- `iste(yol, method, body, token)` — `fetch(BASE + yol)`. `body` varsa `Content-Type: application/json` ile JSON gönderir,
  `token` varsa `Authorization: Bearer <token>` ekler; `method` verilmezse `GET`. Dönen: `{ status, body, headers }`; cevap
  JSON değilse `body = { raw: <ilk 200 karakter> }`. HTTP hata kodlarında **hata fırlatmaz** (durumu çağıran denetler);
  yalnız bağlantı kurulamazsa `fetch`'in hatası yukarı çıkar.

### Günlükten okuyanlar

Sunucunun yazdığı bloklar ([../sunucu/guvenlik.md](../sunucu/guvenlik.md), `kodKonsolaYaz` ve `onayKonsolaYaz`):

```
   GIRIS KODU (e-posta ayarlanmamis)            E-POSTA ONAYI (e-posta ayarlanmamis)
   Kullanici : Ad Soyad <eposta> [kullanici.adi]  Eposta    : <adres>
   KOD       : 123456                           ONAY ANAHTARI : <64 onaltılık karakter>
```

- `deseneKacir(metin)` (iç) — düzenli ifadede özel anlamı olan karakterleri kaçırır (e-postadaki `.` ve `+` gibi).
- `sonKod(eposta)` (dışa açık) — günlük dosyası yoksa "Sunucu günlüğü bulunamadı … `node server.js > sunucu.log` ile başlat"
  hatası. `eposta` verilirse (e-posta ya da kullanıcı adı; küçük harfe çevrilir) `Kullanici :` satırında `<eposta>` ya da
  `[eposta]` geçen bloklardan sonuncusunun `KOD`'unu döner. Verilmezse ya da o kişiye ait blok yoksa **günlükteki en son
  kodu** döner (kimin olursa olsun). Hiç kod yoksa "Günlükte giriş kodu yok. E-posta ayarlıysa kod ekrana yazılmaz.".
  Kişiye göre arama sonradan eklendi: art arda birkaç giriş olunca son kod başkasına ait olabiliyor, yanlış kod da hesabı
  kaba kuvvet kilidine sokuyordu (dosyadaki yorum).
- `sonOnayAnahtari(eposta)` (dışa açık) — `Eposta : <adres>` satırından sonraki ilk `ONAY ANAHTARI`'nı arar, sonuncusunu
  döner; yoksa "Günlükte <adres> için onay anahtarı yok." hatası. (Günlük dosyası yoksa `readFileSync`'in ham hatası çıkar.)
- `epostaOnayla(eposta)` (dışa açık) — onay bağlantısına "tıklar": `POST /api/eposta-onay { token }`; 200 değilse
  `e-posta onayı (<adres>): <hata>`. Dönen: cevabın gövdesi.

### Giriş

- `botCevabi()` (dışa açık) — `GET /api/challenge`; soru `"a + b = ?"` biçimindedir, toplar ve
  `{ challengeId, challengeAnswer }` döner. Soru okunamazsa "Doğrulama sorusu okunamadı".
- `girisYap(email, sifre, okul)` (dışa açık) — iki adımlı girişin tamamı:
  1. Bot sorusunu her seferinde çözer (sunucu soruyu yalnız önceki hatalı denemelerden sonra ister; fazladan göndermek
     zararsız).
  2. `POST /api/login { email, password, okul, challengeId, challengeAnswer }`. Alanın adı `email` ama sunucu orada e-posta
     da kullanıcı adı da kabul eder. `okul`, okul adresinin kısa adıdır (`/school/<kısa ad>`): verilirse kullanıcı adı yalnız o
     okulun içinde aranır. 200 değilse hata fırlatır; hatada `e.status` ve `e.body` vardır (çağıran 401/400'ü ayırt edebilsin).
  3. Cevapta `twoFactor` yoksa (öğrenci ya da e-postası olmayan hesap: kod gönderilmez) o cevabı döner.
  4. Varsa `sonKod(email)` ile kodu günlükten alır, `POST /api/login/dogrula { challengeId, code }`; 200 değilse hata (bu
     hatada `status` alanı yok). Dönen: oturum cevabı (`token`, `user`, `kvkkGuncel`, birden çok portal varsa `kisilikSec`…).
- `kisilikGec(token, tur, id)` (dışa açık) — `POST /api/kisilik/gec`; `tur` `'rol'` (okul rolü satırının kimliği), `'veli'`
  (çocuğun kimliği) ya da `'hesap'`. Dönen: yeni oturumun gövdesi (`token`); 200 değilse "rol değiştirme: …".
- `kisiKodu(token)` (dışa açık) — `GET /api/kisilikler` cevabındaki `kisiKodu`: ekranda `XXXX-XXXX-XXXX-XXXX` görünen kodun
  ham, tiresiz hâli (sunucu tireli ya da tiresiz ikisini de kabul eder). Yoksa "kişi kodu: …".

### Hesap açma

- `tcUret()` (dışa açık) — algoritmaya uyan rastgele T.C. kimlik no: ilk hane 1–9, dokuz rastgele hane, 10. hane
  `(tek sıradakilerin toplamı × 7 − çift sıradakilerin toplamı) mod 10`, 11. hane ilk on hanenin toplamı mod 10.
- `hesapAc(g)` (dışa açık) — rolsüz yetişkin hesabı: `POST /api/register`. Gövde: varsayılanlar (`kvkkOnay: true`, uydurma bir
  telefon, dosyadaki test şifresi) ← `g` (`{ fullName, username, email, password, phone, … }`) ← bot cevabı. 200 değilse
  `kayıt (<e-posta ya da kullanıcı adı>): <hata>`. Cevap `onayGerekli` ise günlükteki onay anahtarıyla hesabı açar ve onay
  cevabını `onay` alanına ekler. Hesap açıldığında hiçbir okulda rolü yoktur.
- `ogretmenYap(token, g)` (dışa açık) — öğretmenin yolculuğu: kendi yetişkin hesabını açar (`hesapAc`; kullanıcı adı yoksa
  `ogretmen<zaman><rastgele>`, e-posta yoksa `<kullanıcı adı>@test.com`, şifre yoksa test şifresi), girer, kişi kodunu
  alır; müdür (`token`) `POST /api/school/ogretmen-ekle { kod, brans }` ile onu okula ekler (`g.brans` ya da `g.branch`).
  Sonra öğretmenin oturumunu kapatır. Dönen: `{ email, …cevap.hesap }` — öğretmenin bu okuldaki rol satırı.
- `okulHesabi(token, rol, g, onaylat)` (dışa açık) — okulun hesap açması. `rol === 'teacher'` ise `ogretmenYap`'a devreder.
  Öteki roller (`'student'`, `'servisci'`): `POST /api/school/hesap-ac { rol, tc: tcUret(), password: test şifresi, …g }`
  (`g` T.C.'yi ve şifreyi ezebilir). `onaylat !== false` ise kişiyle bir kez girip (`g.email || g.username`, okul adresi
  vermeden) aydınlatma metni eskiyse `POST /api/kvkk-onay` gönderir: testlerde her uç açık olsun. Şifre verildiği için kişi
  ilk girişte şifre değiştirmeye zorlanmaz (sunucu bunu yalnız şifre boş bırakılıp T.C. no'ya düşünce ya da şifre T.C. no ile
  aynıyken ister; [../sunucu/bolumler/hesaplar.md](../sunucu/bolumler/hesaplar.md)).
  Dönen: `cevap.hesap`.
- `mudurYap(kimlik, sifre, okul, adminToken)` (dışa açık) — okul açtırmanın yolculuğu: kişi girer, kişi kodunu alır;
  yönetici (`adminToken`) `POST /api/admin/okul-ac { …okul, kisaAd, mudurKodu }` ile okulu açar ve onu müdür yapar. `okul`:
  `{ schoolName, city, district }` ya da `{ mebSchoolId }`, isteğe bağlı `kisaAd`. Kısa ad verilmezse adaylar sırayla
  denenir: okul adından türetilen (`kisaAdUret`), `…-<ilçe>`, sonra `…-2` … `…-9`. Cevap 400 ve `alan: 'kisaAd'` ise
  sıradakine geçilir; uç bunu yalnız "adres başka bir okulda" için değil, kısa adın biçimi uygun değilse (`kisaAdSorunu`) ya
  da adres aynı anda başka okula verildiyse de döner. Başka her cevapta döngü durur. Bu sıra sunucudaki `okulKisaAdiBul`'un
  ([../sunucu/veri/index.md](../sunucu/veri/index.md)) kopyasıdır, üç farkla: 9'da durur; ilçe verilmezse sunucu ilçeli adayı
  atlar, bu dosya ilçe yerine `ilce` sözcüğünü koyar; `mebSchoolId` ile açılan okulda kök okulun adından değil
  `okul <MEB kodu>`'ndan türetilir (okulun gerçek adı uçta MEB listesinden gelir). Sonunda kişinin oturumunu kapatıp yeniden
  girer ve o girişi döner (tek portalı varsa doğrudan müdür rolünde).

Dışa açılanlar: `BASE`, `LOG`, `iste`, `sonKod`, `sonOnayAnahtari`, `epostaOnayla`, `girisYap`, `botCevabi`, `hesapAc`,
`okulHesabi`, `ogretmenYap`, `kisiKodu`, `kisilikGec`, `mudurYap`, `tcUret`.

## Kimle konuşur?

- **Çağırdıkları:** Node'un `fs` ve `path`'i, genel `fetch` (Node 18+; `package.json` Node 20 ve üstünü ister); `mudurYap`
  içinde geç yüklenen [../sunucu/ortak.md](../sunucu/ortak.md) → `kisaAdUret`. Sunucu günlüğünün biçimi
  [../sunucu/guvenlik.md](../sunucu/guvenlik.md)'den gelir: oradaki `Kullanici :`, `KOD :`, `Eposta :`, `ONAY ANAHTARI :`
  satırları değişirse bu dosya kodu bulamaz.
- **Çağırdığı uçlar:**

  | Uç | İşlev | Bölüm |
  |---|---|---|
  | `GET /api/challenge`, `POST /api/register`, `POST /api/eposta-onay`, `POST /api/login`, `POST /api/login/dogrula`, `POST /api/kvkk-onay`, `POST /api/logout` | `botCevabi`, `hesapAc`, `epostaOnayla`, `girisYap`, `okulHesabi`, `ogretmenYap`, `mudurYap` | [../sunucu/bolumler/kayit.md](../sunucu/bolumler/kayit.md) |
  | `GET /api/kisilikler`, `POST /api/kisilik/gec` | `kisiKodu`, `kisilikGec` | [../sunucu/bolumler/kisilik.md](../sunucu/bolumler/kisilik.md) |
  | `POST /api/school/hesap-ac`, `POST /api/school/ogretmen-ekle` | `okulHesabi`, `ogretmenYap` | [../sunucu/bolumler/hesaplar.md](../sunucu/bolumler/hesaplar.md) |
  | `POST /api/admin/okul-ac` | `mudurYap` | [../sunucu/bolumler/yonetici-okul.md](../sunucu/bolumler/yonetici-okul.md) |

- **Onu kullananlar:** `testler/giris.js` (yeniden dışa açar) üzerinden `testler/` altındaki 46 dosya (`seed.js`, bütün
  `test-*.js`'lerin çoğu, `guvenlik-test.js`, `girdi-denetimi.js`, `yetki-denetimi.js`, `debug-hazirlik.js`,
  `hazirlik-aktarim.js`); doğrudan dört araç: [deneme-okulu.md](deneme-okulu.md), [gezinti.md](gezinti.md),
  [gorsel-veri.md](gorsel-veri.md), `araclar/zengin-veri.js`. 2 Ekim'deki sayım (hangi ad kaç dosyada alınıyor):

  | Ad | Dosya | Not |
  |---|---|---|
  | `girisYap` | 49 | neredeyse her test |
  | `iste` | 46 | |
  | `hesapAc` | 31 | |
  | `botCevabi` | 14 | `/api/register`'ı ya da girişi kendisi çağıran testler, `zengin-veri.js` |
  | `mudurYap` | 14 | `seed.js` ve kendi okulunu açan testler |
  | `okulHesabi` | 13 | `seed.js`, testler, `deneme-okulu.js` |
  | `tcUret` | 12 | testler, `gorsel-veri.js`, `zengin-veri.js` |
  | `BASE` | 11 | ham `fetch` yapanlar (dosya yükleme gibi) |
  | `kisiKodu` | 9 | testler, `gezinti.js`, `gorsel-veri.js` |
  | `epostaOnayla` | 8 | kaydı kendisi yapıp onay bağlantısına "tıklayan" testler |
  | `kisilikGec` | 7 | testler, `gezinti.js`, `gorsel-veri.js` |
  | `sonKod` | 4 | `guvenlik-test.js` (e-postasız: son kod), `test-admin-gizli.js`, `test-cakisma.js`, `test-servis-yoklama.js` |
  | `LOG` | 1 | `test-cakisma.js` (günlüğü kendisi de okur) |
  | `sonOnayAnahtari` | 1 | `test-giris-kayit.js` |
  | `ogretmenYap` | 1 | `test-yonetim.js` |

## Nasıl çalışır (adım adım)?

### Bir yetişkinin girişi

```
girisYap(<e-posta>, şifre)
  GET  /api/challenge            → "3 + 4 = ?"  → { challengeId, challengeAnswer: 7 }
  POST /api/login                → 200 { twoFactor: true, challengeId: <kod kimliği> }
          sunucu: e-posta gidemiyor → günlüğe  "Kullanici : … <e-posta> [kullanici.adi]" / "KOD : 123456"
  sonKod(<e-posta>)              → günlüğü baştan okur, o kişinin SON kodunu alır
  POST /api/login/dogrula        → 200 { token, user, kvkkGuncel, … }
```

Öğrenci ya da e-postasız hesapta (`twoFactor` yok) ikinci adım hiç olmaz.

### Bir okulun açılması (seed.js'in ilk işi)

```
hesapAc(müdür adayı)  → /api/register → günlükten onay anahtarı → /api/eposta-onay   (rolsüz yetişkin)
mudurYap(aday, şifre, { schoolName, city, district }, yöneticiOturumu)
  girisYap(aday) → kisiKodu → /api/admin/okul-ac (kısa ad adayları sırayla) → /api/logout → girisYap(aday)
okulHesabi(müdür, 'teacher', …)  → ogretmenYap: kayıt → giriş → kişi kodu → müdür ogretmen-ekle → öğretmen çıkış
okulHesabi(müdür, 'student', …)  → /api/school/hesap-ac → öğrenciyle bir giriş → gerekirse aydınlatma onayı
```

### Çalıştırma ön koşulu

Sunucunun çıktısı `EE_LOG`'daki dosyaya gitmeli ve kod oraya yazılabilmeli. Testlerde `testler/tumtest.sh` bunu kendisi
kurar: sunucuyu 3200'de, `EE_DATA=testler/testdata` (e-postası ayarsız) ile açar, çıktıyı `testler/test-sunucu.log`'a yazar
ve her paketi `EE_BASE=http://localhost:3200 EE_LOG=testler/test-sunucu.log` ile çalıştırır. Bir aracı elle çalıştırırken aynı
iki değişkeni sen vermelisin.

## Dikkat!

- **Varsayılan adres 3000.** `EE_BASE` verilmezse her istek `http://localhost:3000`'e, yani kullanıcının kendi (gerçek
  veritabanlı) sunucusuna gider. Bu projede 3000'e dokunulmaz: araç ve testleri her zaman `EE_BASE=http://localhost:3200`
  ile çalıştır. (`testler/seed.js` de aynı varsayılanı taşır.)
- **Kod yalnız günlükteyse çalışır.** Sunucu e-posta ayarlıysa ve adres teslim edilen bir alan adındaysa kod e-postayla gider,
  günlükte o kişiye ait blok olmaz. O zaman `sonKod(eposta)` sessizce **günlükteki en son koda** düşer (başka birinin olabilir),
  `/api/login/dogrula` 401 verir; her yanlış kod sayılır (kodun kendi 5 hakkı, bağlantı başına 5 dakikada 25 yanlış kod).
  Bu dosyadaki ve testlerdeki varsayılan adresler `@test.com`. `test.com` ayrılmış bir ad değildir (`.test` uzantısı gibi
  teslimsiz sayılmaz), kayıtlı gerçek bir alan adıdır; 2 Ekim'de DNS'te MX de A kaydı da yoktu. Testler e-postası ayarsız
  test sunucusunda çalıştığı için sorun yok. Ama e-postası ayarlı bir sunucuda bu yardımcılar çalışmaz: kayıt adımı alan adını
  DNS'te denetler (`epostaAlaniVarMi`) ve `"test.com" alan adı e-posta almıyor` diye reddeder; var olan hesaplarda kod
  günlüğe değil o adrese gönderilmeye çalışılır, `sonKod` da başkasının koduna düşer. Elle deneme verisi için `.test`
  uzantılı adres kullan ([deneme-okulu.md](deneme-okulu.md) öyle yapar).
- **Şifre sıfırlama bloğu da `Kullanici :` satırı taşır.** Sunucunun "SIFRE SIFIRLAMA" bloğunda kişinin adı ve `<e-posta>`'sı
  vardır ama `KOD` yoktur. `sonKod(eposta)`'nın düzenli ifadesi bu satırdan başlarsa kodu bulmak için günlükte ileri gider ve
  bir sonraki bloğun `KOD`'unu alır; o blok başka birinin girişi olabilir. `girisYap` ve testlerdeki doğrudan `sonKod`
  çağrıları kodu girişten hemen sonra aradığı için kişinin günlükteki son bloğu o giriş kodudur ve son eşleşme doğru çıkar.
  Yanlış kod yalnız kişinin son bloğu sıfırlama bloğuysa döner, yani giriş kodu günlüğe hiç yazılmadığında (e-posta gitti)
  — yukarıdaki "en son kod" sorunuyla aynı durum (koddan çıkarım).
- **Günlük her çağrıda baştan okunur.** `sonKod` ve `sonOnayAnahtari` bütün dosyayı okuyup düzenli ifadeyle tarar; uzun
  çalışan bir sunucuda dosya büyür, yavaşlar. `tumtest.sh` her paketten önce sunucuyu yeniden başlatıp dosyayı `>` ile
  sıfırladığı için testlerde sorun değil.
- **Arama küçük harfle yapılır, ifadede `i` bayrağı yok.** `eposta` küçük harfe çevrilir; günlükteki e-posta ve kullanıcı
  adı da küçük harftir (sunucu ikisini küçük harfle saklar). Bu varsayım bozulursa (ör. büyük harfli bir alan günlüğe yazılırsa)
  kişiye göre arama boşa düşer ve yine "en son kod" kuralı devreye girer.
- **`okulHesabi`'nin onay girişi okul adresi vermez.** Kullanıcı adıyla açılan bir okul hesabı (servisçi, e-postasız öğrenci)
  aynı adla başka bir okulda da varsa giriş "Bu kullanıcı adı birden çok okulda var" (400) alır ve `okulHesabi` hata fırlatır.
  Böyle bir test yazacaksan `onaylat: false` ver, sonra `girisYap(ad, şifre, kısaAd)` ile kendin gir.
- **`ogretmenYap` öğretmeni çıkarır.** Dönüşte öğretmenin oturumu kapalıdır; öğretmen olarak iş yapacaksan yeniden
  `girisYap` ile gir (çoğu test öyle yapar).
- **Hata nesneleri farklı.** Yalnız girişin 1. adımındaki hata `status` ve `body` taşır; [deneme-okulu.md](deneme-okulu.md)'deki
  `gir` eski şifreyi denemek için buna güvenir. 2. adım ve öteki yardımcıların hataları yalnız iletidir.
- **`iste` HTTP hatasında fırlatmaz.** Bir uç 403 ya da 500 dönerse `iste` bunu normal sonuç gibi döner; çağıran durumu
  denetlemezse hata gözden kaçar (araçlar bunun için `beklenen` gibi küçük yardımcılar yazar).
- **`tcUret` geçerli ama rastgele bir sayı üretir.** Aynı test veritabanında iki kez aynı sayının çıkma olasılığı çok
  düşük ama sıfır değildir; çıkarsa hesap açma T.C. çakışmasıyla reddedilir. Sayı gerçek bir kişininkiyle denk
  gelebilir; yalnız test veritabanında kullanıldığı için sorun değil, gerçek veritabanına bu yardımcılarla kayıt açma.
- **Şifreler test değerleridir.** Dosyadaki varsayılan şifre ve telefon herkese açık depoda durur; yalnız test ve deneme
  hesapları içindir.

## Testleri

- Bu dosyanın kendine ait bir testi yok; ama `tumtest.sh`'in her paketi onu kullanır: önce `testler/seed.js` (`hesapAc`,
  `mudurYap`, `okulHesabi`) temel okulu kurar, sonra her paket kendi hesaplarını aynı yardımcılarla açıp girer. Yani bir
  bozulma ilk paketlerde "giriş 1. adım" ya da "Günlükte giriş kodu yok" hatası olarak hemen görünür.
- `testler/guvenlik-test.js` kodun cevapta sızmadığını `sonKod()` ile denetler (günlük biçimine dolaylı bir bakış);
  `testler/test-giris-kayit.js` onay anahtarını `sonOnayAnahtari` ile okur; `testler/test-cakisma.js` günlüğü (`LOG`)
  kendisi de tarar.
- Elle: test sunucusu açıkken (3200, çıktı `testler/test-sunucu.log`'a)
  `EE_BASE=http://localhost:3200 EE_LOG=testler/test-sunucu.log node -e "require('./araclar/giris').botCevabi().then(console.log)"`
  → `{ challengeId: …, challengeAnswer: <sayı> }`. 2 Ekim'de test veritabanında (deneme okulu kurulmuşken) `hesapAc` ile
  alınmış bir kullanıcı adı denendi: "kayıt (…): Bu kullanıcı adı alınmış. Başka bir ad dene." hatası beklendiği gibi geldi.
  Aynı gün yeni sıfırlanmış test veritabanında `testler/seed.js`, `araclar/zengin-veri.js` ve [gorsel-veri.md](gorsel-veri.md)
  bu yardımcılarla (kayıt, onay, iki adımlı giriş, kişi kodu, okul açma, rol değiştirme) hatasız çalıştı.

## Son durum

- `git log --follow`: 8 commit. İlk hâli `3ccf162 commit 18` (2026-08-28): `iste`, `sonKod`, `sonOnayAnahtari`,
  `epostaOnayla`, `botCevabi`, `girisYap`, `hesapAc`, `ogretmenYap`; `ac1f8f0 commit 19` `okulHesabi`'yi, `6fefa52 commit 20`
  o günkü `mudurYap`'ı (müdür başvurusu + yönetici onayı), `5a010c6 commit 21` dışa açılanları ekledi; `804f2b4 commit 327`
  (2026-09-26) `tcUret`'i, `e08eaef commit 353` (2026-09-26) `kisilikGec`'i.
- `0acca75 commit 516` (2026-09-27, kişi kodu ve portallar): müdür başvurusu kalktı → `mudurYap` baştan yazıldı (kişi kodu
  + `/api/admin/okul-ac`, kısa ad adayları; `/api/okul-basvurusu`, `/api/admin/pending`, `/api/admin/decide` çağrıları gitti);
  `kisiKodu` eklendi ve dışa açıldı; `ogretmenYap` eski `ogretmenKodu` alanı yerine `kisiKodu`'nu kullanır oldu; "kayıt ve okul
  hesapları" yorumu ve `girisYap`'taki okul adresi örneği (`/school/<kısa ad>`) güncellendi.
- `153d63d commit 522` (2026-09-27, kişi kodu 16 hane): yalnız `kisiKodu`'nun yorumu — ekranda 4'erli tireli görünen kodun
  ham hâli, sunucu ikisini de kabul eder. Kod değişmedi.
- Bilinen açıklar: `sonKod`'un "en son kod"a sessizce düşmesi ve şifre sıfırlama bloğundan başlayan eşleşme (yukarıda).
  Kod değiştirilmedi.
- Planlı işlerden bu dosyayı etkileyecekler: "Sistem" işindeki yöneticiye zorunlu doğrulama uygulaması (TOTP) — yöneticinin
  girişi artık günlükteki e-posta koduyla yapılamayacak; yönetici olarak giren her yer (`mudurYap`'ı çağıran `seed.js` ve
  testler, [gorsel-veri.md](gorsel-veri.md), [gezinti.md](gezinti.md)) için TOTP kodu üreten bir yol gerekecek. "T.C. kimlik
  no bütün hesaplarda zorunlu" — `hesapAc` ve `ogretmenYap` kayıtta T.C. göndermeli. "Çalışan olarak ekleme" — kişi koduyla
  eklenen kişi rolsüz gelecek; `ogretmenYap`'ın "öğretmen rolü açılır" varsayımı değişir. "Güvenlik denetimi"ndeki "okulun
  verdiği her şifrede ilk girişte değiştirme" — `okulHesabi`'nin "şifre verildiği için değiştirme zorunlu değil" varsayımı
  bozulur, onay girişinden sonra şifre değiştirme adımı gerekir. "Tek kişi tek hesap + portallar öğrencide de" — giriş kimliği
  ve "Okul seç" kuralları; `girisYap`'ın `okul` parametresi ve `sonKod`'un eşleştirmesi gözden geçirilmeli.
