# testler/test-yonetici-dosyasi.js

Sistem yöneticisi hesaplarını açan `data/admins.json` dosyasını deneyen test paketi (49 denetim): dosyanın yokluğu ve bozukluğu,
satır satır açma ve atlama nedenleri, dosyadan açılan yöneticinin girişi ve şifre değiştirmesi, var olan hesaba dokunulmaması, işlem
kaydı, sunucu çalışırken "Şimdi oku", değişme zamanı/boyut yoklaması ve aralıkla kendiliğinden okuma. Yarısını test sürecinin içinden,
yarısını sunucu üzerinden yapar; yalnız adı `_test` ile biten veritabanında çalışır.

## Bu dosya ne yapar?

Eğitim Evi'nde sistem yöneticisi hesabı web'den açılamaz: sunucuyu kuran kişi `data/admins.json`'a (depoya girmez) yöneticileri yazar,
sunucu açılışta ve çalışırken belli aralıklarla bu dosyayı okuyup veritabanında olmayanları açar
([../sunucu/yonetici-dosyasi.md](../sunucu/yonetici-dosyasi.md)). Bu dosya en yüksek yetkiyi veren yol olduğu için kuralları sıkıdır:

- dosya yalnız hesap AÇAR; var olan yöneticinin şifresine dokunmaz (bir şifre sıfırlama yolu değildir);
- başka bir hesabın (ör. bir öğretmenin) e-postası ya da kullanıcı adı yazılırsa o hesap yönetici YAPILMAZ: dosyaya yazılan bir
  satırla sessizce yetki yükseltilmesin;
- dosyadaki ya da üretilen şifre panele, işlem kaydına, hiçbir cevaba gitmez; açılan yönetici ilk girişte şifresini değiştirmeden
  `/admin` çerezini almaz;
- bozuk dosya sunucuyu düşürmez, sorun Türkçe ve satır numarasıyla söylenir.

Paket bu kuralların hepsini dener. Dosya başındaki yorum maddeleri tam olarak bunları sayar ve "Yalnız test veritabanında (_test)
çalışır." diye biter.

## İçinde neler var?

### Yardımcılar ve sabitler

- `kontrol(ad, sart, detay)` — `GECTI`/`KALDI` satırı. `J(x)` — 260 karakterlik JSON.
- `testDeposu()` — test sürecini sunucuyla aynı veritabanına bağlar: `EE_DATA`'yı `testler/testdata` yapar,
  [../sunucu/ayarlar.md](../sunucu/ayarlar.md)'deki `ayarlariYukle()`'yi çağırır (sunucunun `testdata/ayarlar.json`'unu okur),
  [../sunucu/veri/baglanti.md](../sunucu/veri/baglanti.md)'yi alır; veritabanının adı `_test` ile bitmiyorsa `null` döner. Dönen küçük
  "depo": `{ baglanti, kullanicilar, genel }` (`sunucu/veri/depo/kullanicilar.js` ve `sunucu/veri/depo/genel.js`; tam `depo` değil,
  yalnız `yonetici-dosyasi.js`'in kullandıkları). `null` ise paket `  KALDI  test veritabanı değil (adı _test ile bitmeli)` yazıp
  çıkış kodu 1 ile biter (özet satırı basılmaz).
- `yd` — `require('../sunucu/yonetici-dosyasi')`: `uygula`, `oku`, `denetle`, `gorunum`, `zamanla` test sürecinin içinden çağrılır.
- `dosya` — `testler/testdata/admins-deneme-<z>.json` (`z = Date.now().toString(36)`); `yaz(v)` metni ya da JSON'u bu dosyaya yazar.
- `URETILEN` — `'Uretilen-Sifre-9!'`: şifre yazılmamış satır için üretici bunu döner (`sifreUret: () => URETILEN`), böylece üretilen
  şifre sınanabilir.
- `uygula()` — `yd.uygula(depo, { dosya, sifreUret })`.
- Ortak yardımcılar [giris.md](giris.md) üzerinden: `iste`, `girisYap` (iki adımlı kodu `EE_LOG`'dan okur).

### Hesaplar ve veriler

Sunucunun ilk sistem yöneticisi (`A`; test sunucusunda şifresi `EE_ADMIN_SIFRE`; e-postası "zaten yönetici" satırında kullanılır) ve
seed'den ([seed.md](seed.md)) Matematik öğretmeni (e-postası "yönetici olmayan hesap" satırında, oturumu 6. bölümde). Paketin açtıkları: `yon1<z>` ("Deneme Yönetici") ve `yon2<z>` ("ikinci
yönetici") — 2. bölümde; `canli<z>` ("Canlı Yönetici") ve `canli2<z>` ("Üretilen Canlı") — 6. bölümde sunucunun okumasıyla;
`izlenen<z>` ve `aralik<z>` — 7. bölümde. Hepsi `@test.com` uzantılı uydurma adreslerdir.

### 1) Dosya yok / bozuk (7)

- Dosya yok → `dosyaVar: false`, hata yok, kimse açılmaz.
- Yarıda biten JSON → `dosyaVar`, `hata` "JSON" içerir, istisna atılmaz. İleti Türkçe: ayrıştırıcının İngilizce sözcükleri
  (`Unexpected`, `Expected`, `position`, `token`, `input`) yok, "virgül" ya da "yarıda" var.
- Üç satırlı dosyada virgülü eksik satır → iletide "dosyanın 3. satırı".
- Yalnız boşluk → `hata` tam olarak "dosya boş".
- `{ baska: [] }` → hata "yoneticiler" listesini anar.
- 51 satır → "en fazla" (sınır 50), kimse açılmaz.

### 2) Açma ve atlama (17)

Tek dosyada 13 satır:

| # | Satır | Beklenen |
|---|---|---|
| 1 | "Deneme Yönetici", e-posta BÜYÜK harfle, `kullaniciAdi`, güçlü şifre | açılır; e-posta küçük harfe çevrilir; `uretilenSifre: ''` |
| 2 | "ikinci yönetici", yalnız e-posta | açılır; kullanıcı adı e-postadan (`yon2<z>`); `uretilenSifre` = `URETILEN` |
| 3 | ilk yöneticinin (`A`) e-postası | "zaten yönetici" |
| 4 | Matematik öğretmeninin e-postası, güçlü şifre | "yönetici olmayan" bir hesap: YAPILMADI; o e-postanın hesabının (öğretmenin yetişkin hesabı; öğretmenlik ayrı bir rol satırındadır) rolü ve şifre özeti aynen |
| 5 | şifre `abc12345` | neden "şifrede bir büyük harf…" ile başlar, "şifre" kökü bir kez geçer |
| 6 | boş ad | "ad yazılmamış" |
| 7 | e-posta `bozuk-adres` | "geçerli bir e-posta" |
| 8 | 1. satırın e-postası yine | "iki kez" |
| 9 | `kullaniciAdi: 'admin'` | "başka bir hesapta" |
| 10 | `kullaniciAdi: 'çağla'` | neden "kullanıcı adında Türkçe harf" ile başlar, "kullanıcı ad" bir kez geçer |
| 11 | düz metin `'metin satırı'` | "nesne değil" |
| 12 | ad `'x'` | tam olarak "ad en az 2 harf olmalı" ("ad yazılmamış" değil) |
| 13 | şifre `Ab1!` | tam olarak "şifre en az 8 karakter olmalı" |

Ayrıca sonucun JSON'unda dosyadaki şifre hiç geçmez; 1. satırın hesabı veritabanında `role: 'admin'`, `status: 'approved'`,
`sifreDegismeli: true`, okulsuz. Atlama nedenlerinin "doğal" denetimleri, ortak kuralın iletisinin olduğu gibi (küçük harfle,
noktasız) kullanıldığını kanıtlar ("kullanıcı adı: Kullanıcı adında…" gibi tekrar yok).

### 3) Giriş (4)

- 1. satırın yöneticisi dosyadaki şifreyle iki adımlı girer: `role: 'admin'`, `sifreDegismeli: true`. 2. satırınki `URETILEN` ile girer.
- İkisinin giriş cevabında `yonetimAdresi` yok (şifresini değiştirmemiş yönetici `/admin` çerezi almaz).
- 2. satırın yöneticisi `POST /api/password` ile kendi şifresini koyar: 200, `yonetimAdresi: '/admin'` ve `Set-Cookie`'de
  `ee_yonetim=<64 onaltılık>`.

### 4) İkinci okuma: var olana dokunulmaz (2)

Dosyaya yalnız 1. satırın e-postası BAŞKA bir şifreyle yazılır ve yeniden uygulanır: kimse açılmaz, neden "zaten yönetici"; eski şifreyle
giriş olur, dosyadaki yeni şifreyle olmaz.

### 5) İşlem kaydı (1)

İlk yönetici (`A`) `GET /api/islem-kaydi?islem=yonetici.eklendi` → bir kaydın ayrıntısında 1. satırın e-postası (kaydı test süreci
`depo.genel.islemYaz` ile yazdı; aynı veritabanı olduğu için sunucudan okunur).

### 6) Canlı okuma: sunucu çalışırken "Şimdi oku" (8)

Test sunucusu `EE_DATA=testler/testdata` ile açıldığı için onun `data/admins.json`'u `testler/testdata/admins.json`'dur. Paket oraya üç
satır yazar: "Canlı Yönetici" (şifresi dosyada), "Üretilen Canlı" (şifresiz), "Zayıf Canlı" (şifre `zayif`).

- `POST /api/admin/yonetici-dosyasi/oku` → 200, `dosyaVar`, iki hesap açılmış, `sonOkuma` dolu. (Sunucunun 1 dakikalık yoklaması tam
  öncesinde davranmışsa iki satır "zaten yönetici" görünür; paket ikisini de kabul eder.)
- Zayıf satır nedeniyle (`şifre`) `atlanan`'da.
- Cevapta hiçbir şifre yok: dosyadaki, `uretilenSifre` alanı, `"sifre"` anahtarı, `zayif` sözcüğü geçmez.
- `GET /api/admin/yonetici-dosyasi` (kart): `dosya: 'data/admins.json'`, aynı `sonOkuma`, `dosyaDegisme` dolu, `aralikDk: 1`, şifre yok.
- "Canlı Yönetici" dosyadaki şifreyle girer, `sifreDegismeli: true`.
- `GET /api/islem-kaydi?islem=yonetici.dosya-okundu` en az bir kayıt.
- Matematik öğretmeni kartı ve "Şimdi oku"yu isterse cevap, aynı yöntemle `/api/boyle-bir-uc-yok`'a verilen cevapla birebir aynı 404.
- Dosya silinir, yeniden "Şimdi oku": `dosyaVar: false`; açılan yönetici veritabanında duruyor (dosyadan silinen yönetici silinmez).

### 7) Değişme zamanı/boyut yoklaması ve aralık (10)

Test sürecinde `testler/testdata/admins-izlenen-<z>.json` ile (`sessiz: true`, pencereye yazmaz):

- İlk `yd.denetle` dosyayı okur, `izlenen<z>`'i açar; ikinci `denetle` `null` döner (değişmeyen dosya okunmaz).
- `yd.gorunum(dosya)`: okunduktan sonra değişmeyende `okunmadanDegisti: false`, `simdiVar: true`. Dosya başka biçimde (girintili,
  boyutu farklı) yeniden yazılınca `okunmadanDegisti: true`; `dosyaVar` ve `eklenen` hâlâ SON OKUMANIN sonucu. Üçüncü `denetle` okur
  (`eklenen` boş, "zaten yönetici"), işaret kalkar.
- Ayrı bir dosya (`admins-sonradan-<z>.json`) YOKKEN okunur, sonra yazılır: önce `simdiVar: false`, `okunmadanDegisti: false`; sonra
  `simdiVar: true`, `dosyaVar: false` (son okuma "yok" diyor), `okunmadanDegisti: true`, `dosyaDegisme` dolu (kart çelişkili iki bilgiyi
  yan yana vermez, bir sonraki okumayı bekler).
- Görünümde şifre yok.
- `yd.zamanla(depo, { aralikMs: () => 1000, … })`: dosyaya `aralik<z>` satırı eklenince en çok 40 × 250 ms beklenir; hesap
  kendiliğinden açılır (`role: 'admin'`) ve kart son okumada onu gösterir.

Sonunda geçici dosyalar silinir, havuz kapatılır (`baglanti.kapat()`), boş satır ve `GECTI: 49   KALDI: 0`; `KALDI` varsa çıkış kodu 1.
Beklenmeyen hata `TEST HATASI:` ile, çıkış kodu 1.

## Kimle konuşur?

- **Modüller (test sürecinin içinde):** [../sunucu/yonetici-dosyasi.md](../sunucu/yonetici-dosyasi.md) (`uygula`, `oku`, `denetle`,
  `gorunum`, `zamanla`), [../sunucu/ayarlar.md](../sunucu/ayarlar.md) (`ayarlariYukle`), [../sunucu/veri/baglanti.md](../sunucu/veri/baglanti.md)
  (`veritabaniAdi`, `kapat`), [../sunucu/veri/depo/kullanicilar.md](../sunucu/veri/depo/kullanicilar.md) (`epostayla`; `uygula` içinde
  `kullaniciAdiHerhangiYerde`, `ekle`), [../sunucu/veri/depo/genel.md](../sunucu/veri/depo/genel.md) (`uygula` içinde `islemYaz`);
  [giris.md](giris.md); Node'un `fs` ve `path`'i.
- **Sunucu uçları:**

  | Uç | Ne için | Belge |
  |---|---|---|
  | `POST /api/login`, `POST /api/login/dogrula` (`girisYap`), `POST /api/password` | giriş, şifre değiştirme, `/admin` çerezi | [../sunucu/bolumler/kayit.md](../sunucu/bolumler/kayit.md), [../sunucu/yonetim-cerezi.md](../sunucu/yonetim-cerezi.md) |
  | `GET /api/admin/yonetici-dosyasi`, `POST /api/admin/yonetici-dosyasi/oku` | kart ve "Şimdi oku" | [../sunucu/bolumler/yonetici.md](../sunucu/bolumler/yonetici.md) |
  | `GET /api/islem-kaydi?islem=` | `yonetici.eklendi`, `yonetici.dosya-okundu` | [../sunucu/bolumler/islem-kaydi.md](../sunucu/bolumler/islem-kaydi.md) |
  | `GET`/`POST /api/boyle-bir-uc-yok` | bilinmeyen adresin cevabı (karşılaştırma için) | [../sunucu/api.md](../sunucu/api.md) |

- **Koruduğu kod:**
  - [../sunucu/yonetici-dosyasi.md](../sunucu/yonetici-dosyasi.md) — bütünüyle: `dosyayiOku` (`EN_COK` 50, "yoneticiler" listesi),
    `jsonHatasi` (Türkçe ileti, satır numarası, "dosya boş"), `uygula`'nın satır kuralları ve nedenleri (`nedenYap`), `kullaniciAdiBul`,
    var olan hesaba dokunmama, `sifresiz`, `oku`/`denetle` (imza: değişme zamanı + boyut), `gorunum` (`okunmadanDegisti`, `simdiVar`),
    `zamanla`.
  - [../sunucu/bolumler/yonetici.md](../sunucu/bolumler/yonetici.md) — kart ve "Şimdi oku" uçları (`aralikDk`, işlem kaydı, şifresiz cevap);
    [../sunucu/api.md](../sunucu/api.md) — yönetici ucunun yönetici olmayana bilinmeyen adresle aynı 404'ü.
  - [../sunucu/yonetim-cerezi.md](../sunucu/yonetim-cerezi.md) — `yoneticiMi` (şifresini değiştirmemiş yöneticiye çerez yok) ve
    [../sunucu/bolumler/kayit.md](../sunucu/bolumler/kayit.md) — şifre değiştirince çerezin verilmesi.
  - [../sunucu/site.md](../sunucu/site.md) — `adminsAralikDk` (1–60, varsayılan 1); [../sunucu/veri/index.md](../sunucu/veri/index.md) —
    sunucunun şifre üreticisi `ilkSifreUret`; [../sunucu/index.md](../sunucu/index.md) — açılışta `zamanla`'nın site ayarıyla kurulması.
  - [../sunucu/ortak.md](../sunucu/ortak.md) — `sifreSorunu` ve `kullaniciAdiSorunu`'nun iletileri (atlama nedenleri onlardan gelir).
- **Tablolar:** `kullanicilar` (yönetici satırları), `islem_kaydi`; disk: `testler/testdata/admins.json` ve `admins-*-<z>.json` geçici
  dosyaları.
- **Ön yüz** (bu pakette tarayıcı yok): yönetim panelinin "Yönetici Dosyası" kartı
  [../public/js/yonetim/09c-yonetici-dosyasi.md](../public/js/yonetim/09c-yonetici-dosyasi.md), okuma aralığı ayarı
  [../public/js/yonetim/09b-site-ayarlari.md](../public/js/yonetim/09b-site-ayarlari.md), şifresini değiştirmesi gereken yöneticinin
  ekranı [../public/js/parcalar/05b-sifre-zorunlu.md](../public/js/parcalar/05b-sifre-zorunlu.md).
- **Onu çalıştıran:** `testler/tumtest.sh`, sunuculu paketlerde `test-quiz`'den sonra, `test-admin-gizli`'den önce. Ek ortam değişkeni
  almaz; `tumtest.sh`'in yazdığı `testler/testdata/ayarlar.json`'a (test veritabanı adı) yaslanır.

## Nasıl çalışır (adım adım)?

```
testDeposu: EE_DATA=testler/testdata ─► ayarlar ─► veritabanı adı _test mi? (değilse dur)
1) uygula(yok / yarım JSON / virgülsüz / boş / listesiz / 51 satır) ─► hata metinleri
2) 13 satır ─► 2 açıldı, 11 atlandı (nedenler) ; öğretmen hesabı aynen
3) sunucuya giriş: dosyadaki şifre / üretilen ─► çerez yok ─► şifre değiş ─► /admin çerezi
4) aynı e-posta yeni şifreyle ─► "zaten yönetici", şifre değişmedi
5) sunucu: islem-kaydi yonetici.eklendi
6) testdata/admins.json yaz ─► POST …/yonetici-dosyasi/oku ─► kart ─► giriş ─► öğretmene 404 ─► dosyayı sil ─► "dosya yok"
7) test sürecinde: denetle ×3, gorunum (okunmadanDegisti), yokken okunup yazılan dosya, zamanla(1 sn) ─► yeni satır açıldı
temizlik: geçici dosyalar, havuzu kapat
```

## Dikkat!

- **Test süreci veritabanına doğrudan yazar.** 1–4. ve 7. bölümlerde hesaplar SUNUCU üzerinden değil, test sürecinin içindeki
  `yonetici-dosyasi.js` ile açılır; sonra sunucuya bu hesaplarla girilir. Bu yüzden test süreci ile sunucu AYNI veritabanında olmalı:
  sunucu `testler/testdata/ayarlar.json`'la (test sunucusu betiği ve `tumtest.sh` böyle yazar) açılmış olmalı. Başka bir veritabanıyla
  açılmış sunucuya karşı koşarsan 3. bölümde giriş "Bu e-posta adresiyle kayıtlı bir hesap yok" ile düşer.
- **Koruma yalnız ada bakar.** Bağlanılan veritabanının adı `_test` ile bitmiyorsa paket hiçbir şey yazmadan durur. Gerçek
  `egitimevi` veritabanında asla koşmaz. `testler/testdata/ayarlar.json` yoksa `ayarlariYukle()` oraya varsayılan ayarları YAZAR;
  içinde veritabanı bilgisi olmadığı için `veritabaniAdi()` "Veritabanı ayarı yok…" hatası fırlatır ve paket `TEST HATASI` ile durur
  (koddan; `sunucu/ayarlar.js`, `sunucu/veri/baglanti.js`). `DATABASE_URL` ortam değişkeni verilmişse ayar dosyası yerine o kullanılır;
  adı yine `_test` ile bitmelidir.
- **6. bölüm sunucunun gerçek yönetici dosyası yoluna yazar** — test sunucusunda bu `testler/testdata/admins.json`'dur, `data/`'ya
  dokunulmaz. Paket arada çökerse dosya kalır ve sunucunun 1 dakikalık yoklaması onu (yalnız test veritabanında) uygulamayı sürdürür;
  bir sonraki sıfırlama `testdata`'yı siler.
- **Zamana bağlı iki yer.** 6. bölümde sunucunun kendi yoklaması "Şimdi oku"dan önce davranabilir (paket buna izin verir). 7. bölümde
  aralıkla yoklama en çok 10 saniye beklenir (aralık 1 sn'nin altına inmez); çok yavaş bir makinede `KALDI` olabilir.
- **7. bölüm sunucunun değil, test sürecinin durumunu sınar.** `gorunum`, `denetle` ve `zamanla` modül içindeki bir haritada (`durumlar`)
  ve tek bir izleyicide tutulur; testte bunlar test sürecinin kopyasıdır. Sunucudaki kart aynı kodu kullanır ama kendi durumuyla.
  `zamanla`'nın zamanlayıcısı `unref` edilir; paket sonunda `process.exit` ile çıkar.
- **Kartın `dosya` alanı sabittir.** `gorunum` hangi dosyaya bakarsa baksın `dosya: 'data/admins.json'` döner (panel göstermek için);
  test 6. bölümde bunu bekler.
- **Dosya izni uyarısı Windows'ta denenmez.** `uygula` Linux/macOS'ta başkalarının okuyabildiği dosya için `uyari` ("chmod 600")
  doldurur; Windows'ta boş döner. Paket `uyari`'ya hiç bakmaz; Linux'ta koşarken bu alan dolu gelir, denetimler etkilenmez.
- **Seed'e ve sırasına bağlı.** "zaten yönetici" ve "yönetici olmayan" satırları ilk yöneticinin ve seed'deki Matematik öğretmeninin
  e-postalarını kullanır; 4. bölüm 2. bölümde açılan hesaba, 3. bölümün şifre değişimi 2. satırın hesabına yaslanır.
- **Yanlış şifre denemesi.** 4. bölüm dosyadaki yeni şifreyle bir kez yanlış giriş dener; kaba kuvvet sayacına bir hata yazılır (sınır 5),
  sorun olmaz.
- **Aynı sunucuda yeniden koşmak sorun değil.** Her koşu yeni `z` ile yeni adresler kullanır; 3 Ekim'de sıfırlanmış sunucuda arka arkaya
  iki koşu 49/0 geçti. Açılan yöneticiler test veritabanında kalır.
- **Varsayılan adres 3000.** `EE_BASE` vermezsen giriş istekleri 3000'deki sunucuna gider (veritabanı işlemleri yine test
  veritabanında yapılır); her zaman test sunucusunu ver.

## Testleri

- Bu dosyanın kendisi testtir; `testler/tumtest.sh` her tam koşuda çalıştırır. Aynı alanda: [test-cakisma.md](test-cakisma.md)
  ("9) admins.json": büyük harfli ve tam genişlikli yazılmış başka hesabın e-postası yönetici yapılmaz, okuldaki bir kullanıcı adı
  verilmez, Türkçe harfli e-posta atlanır), [test-site-ayarlari.md](test-site-ayarlari.md) (`adminsAralikDk` ayarı: sınırları ve
  60 dk yapılınca kartın `GET /api/admin/yonetici-dosyasi` cevabında `aralikDk: 60` görünmesi),
  [test-admin-gizli.md](test-admin-gizli.md) (kart ve "Şimdi oku" uçlarının her rolde bilinmeyen adresle aynı cevabı vermesi; yönetim
  kodunun `app.js`'e girmemesi), [yetki-denetimi.md](yetki-denetimi.md) (iki uç yalnız yöneticiye),
  [test-gizli-dosyalar.md](test-gizli-dosyalar.md) (`data/admins.json` depoya girmez).
- Elle (Git Bash, proje kökünde): sunucu 3200'de sıfırlanmış `egitimevi_test` ve [seed.md](seed.md) ile açık olmalı (test sunucusu
  betiği `testler/testdata/ayarlar.json`'u da yazar):

  ```
  EE_BASE=http://localhost:3200 EE_LOG=testler/test-sunucu.log node testler/test-yonetici-dosyasi.js
  ```

  Tarayıcıda: test sunucusunun `testler/testdata/admins.json`'una bir satır yaz, yönetim panelinde **Yönetici Dosyası → Şimdi oku**:
  hesap açılmalı, kartta şifre görünmemeli; o hesapla girince önce şifre değiştirme ekranı gelmeli.
- 3 Ekim 2026'da bu belge için 3200'de (sıfırlanmış `egitimevi_test`, seed) koşuldu: `GECTI: 49   KALDI: 0`, yaklaşık 3 saniye; sunucu
  günlüğünde `API hatası` ya da `Veritabanı hatası` yoktu, `testdata`'da geçici dosya kalmadı. Sıfırlayıp arka arkaya iki kez koşulunca
  ikisi de 49/0. Belge denetiminde (aynı gün) yeniden koşuldu: yine 49/0 ve 49/0 (~2 sn), günlükte hata yok, `testdata`'da
  `admins*` dosyası kalmadı.

## Son durum

- `git log`: tek commit. Dosya `276c0a0 commit 521` (2026-09-27; gizli `/admin`, site ayarları, `admins.json` canlı okuma, çakışmalar)
  ile 235 satır olarak eklendi ve o günden beri değişmedi. Aynı commit koruduğu kodun hepsini getirdi: `sunucu/yonetici-dosyasi.js`'in
  tamamı (313 satır: açma kuralları, Türkçe JSON hatası, canlı okuma `oku`/`denetle`/`zamanla`/`gorunum`), yönetici bölümündeki kart ve
  "Şimdi oku" uçları, `sunucu/yonetim-cerezi.js` (şifresini değiştirmemiş yöneticiye çerez verilmemesi), `sunucu/site.js`'teki
  `adminsAralikDk` ayarı ve panelin "Yönetici Dosyası" ekranı (`public/js/yonetim/09c-yonetici-dosyasi.js`).
- Açık iş yok; kod değiştirilmedi.
- Planlı işlerden bu dosyayı etkileyecekler:
  - **"Paneller /panel/admin ve /panel/destek … destek.json"** — `/admin` adresi `/panel/admin`'e taşınacak: 3. bölümün beklediği
    `yonetimAdresi: '/admin'` ve çerezin yolu değişir. Tanıma göre destek ekibi `data/destek.json`'dan, `yonetici-dosyasi.js`
    GENELLEŞTİRİLEREK ve aynı kurallarla açılacak (aynı e-posta iki dosyada varsa yönetici sayılır, destek satırı "zaten yönetici" diye
    atlanır): bu paketin denediği modül değişeceği için paket de genişler. Aynı tanımın 29 Eylül kararları iki şeyi daha getiriyor:
    (a) panel hesabı kaldırılırken ya da e-postası değişirken sunucu `data/admins.json` / `data/destek.json`'daki satırı kendisi
    siler ya da günceller — bugün modül dosyayı yalnız OKUR, "dosya yalnız hesap açar, dosyadan silinen yönetici silinmez" kuralı
    ve 6. bölümdeki "dosya silinince açılan yönetici yerinde" denetimi bu yeni yolla birlikte yeniden düşünülmeli; (b) site rolleri
    (yönetici, destek, eğitmen, çevirmen) ayrı bir `site_rolleri` tablosuna geçecek — paketteki `role === 'admin'` denetimleri
    (2., 3., 6. ve 7. bölüm) buna göre değişir.
  - **"Sistem: yöneticiye ZORUNLU TOTP (desteğe de)"** — tanıma göre yönetici doğrulama uygulamasını kurmadan panel, panel uçları ve
    yönetim çerezi açılmaz; giriş e-posta kodu yerine uygulama kodu ister. 3. bölümdeki "şifresini değiştirince çerez gelir" ve 3. ile
    6. bölümdeki e-posta koduyla girişler değişir. Ayrıca `admins.json`'a yöneticinin uygulamasını sıfırlayan `"totpSifirla": true`
    satırı eklenecek (dosya okununca bir kez sıfırlar) — yeni bir satır kuralı, burada denenmesi gerekecek.
