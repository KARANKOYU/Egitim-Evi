# testler/test-sifre.js

"Şifremi unuttum" akışını (bağlantı isteği, tek kullanımlık anahtar, yeni şifre, eski oturumların kapanması) ve kayıt
formunun aydınlatma onayı ile telefon kurallarını uçtan uca deneyen, başına da MEB okul listesi aramasını ekleyen sunuculu
test paketi (27 denetim).

## Bu dosya ne yapar?

Şifresini unutan kişi giriş ekranında "Şifremi unuttum"a basar, e-posta adresini yazar; sunucu o adrese bir saatlik, tek
kullanımlık bir bağlantı gönderir; bağlantıyı açan kişi yeni şifresini yazar. Bu küçük akışta güvenlik açısından çok şey
ters gidebilir: "bu adres kayıtlı mı" sorusunun cevabı sızabilir, bir botun binlerce istek atması mümkün olabilir, anahtar
iki kez kullanılabilir, zayıf bir şifre kabul edilebilir ya da şifre değişse bile hesabı ele geçirmiş biri açık oturumuyla
devam edebilir. Bu paket bunların her birini sırayla dener.

Dosyanın adı yalnız şifreyi anlatsa da paket iki başka konuyu da taşıyor (tarihsel olarak aynı yerde büyüdü):

- **MEB okul listesi:** yöneticinin "Okul aç" penceresinin kullandığı il/ilçe listesi ve okul araması (`/api/okullar/...`)
  doğru yükleniyor mu, özel okul bayrağı ve kurum kodu geliyor mu. (Kayıt formu bugün il/ilçe sormuyor; bu uçları ön yüzde
  yalnız o pencere çağırır.)
- **Kayıt formunun kuralları:** aydınlatma metni onayı olmadan hesap açılmaz (KVKK md. 10), onay alanı gerçekten `true`
  olmalı, telefon zorunlu ve geçerli olmalı, `+90 532 …` gibi yazımlar tek biçime (`+905321234567`) çevrilir, aydınlatma
  metni sayfası yayında.

Sunucunun e-postası test ortamında ayarsız olduğu için sıfırlama anahtarı postayla gitmez, sunucu günlüğüne yazılır; paket
anahtarı oradan okur ([test-ayarlari.md](test-ayarlari.md) e-postanın test sunucusunda neden kapalı olduğunu anlatır).

## İçinde neler var?

### Yardımcılar

- `LOG` — `process.env.EE_LOG`; varsayılanı **yok** (ortak yardımcıdaki gibi `sunucu.log`'a düşmez).
- `kontrol(ad, sart, detay)` — `GECTI` / `KALDI` satırı yazar, sayaçları artırır.
- `sonAnahtar()` — sunucu günlüğünün tamamında `Anahtar : <64 onaltılık hane>` satırlarını arar (`/Anahtar\s*:\s*([a-f0-9]{64})/g`),
  **sonuncusunu** döner; yoksa `''`. Bu satırı sunucu, e-posta gidemediğinde `sifirlamaKonsolaYaz` ile basar
  ([../sunucu/guvenlik.md](../sunucu/guvenlik.md)).
- `baglantiIste(email)` — bot sorusunu çözer (`botCevabi`), `POST /api/sifre-unuttum { email, challengeId, challengeAnswer }`.

Ortak yardımcılar [giris.md](giris.md) üzerinden ([../araclar/giris.md](../araclar/giris.md)): `iste`, `girisYap`, `botCevabi`,
`epostaOnayla`.

### Hesaplar ve veriler

- Seed'den ([seed.md](seed.md)): müdür `mudur@test.com` / `Test1234!` (şifresi bu pakette değiştirilir).
- Paketin denediği adresler: `boyle-biri-yok@test.com` (hiç olmayan hesap), `onaysiz@test.com`, `sahteonay@test.com`,
  `telsiz@test.com`, `bozuktel@test.com` (hepsi reddedilir, hesap açılmaz) ve `bicimlitel@test.com` (kayıt olur, onaylanır,
  girilir). Yeni şifre `YeniSifre123!`.
- Okul listesi: test sunucusunun veri klasöründeki `okullar.json` (`testler/tumtest.sh` gerçek kurulumdaki listeyi oraya
  kopyalar).

### 1) Okul listesi (7)

- `GET /api/okullar/iller` → 200, `toplam` 60.000'den büyük, `iller` dizisinde tam 81 il.
- `GET /api/okullar/ara?q=Bahçeşehir Koleji&il=Ankara` → en az 3 sonuç; ilk sonucun `ozel` alanı `1`, `resmiTur`'unda "Özel"
  geçiyor.
- `GET /api/okullar/ara?q=Atatürk Lisesi&il=Ankara` → ilk sonucun `ozel` alanı `0`, `kod`'u (kurum kodu) en az 5 karakter.

### 2) Sıfırlama bağlantısı (2)

`baglantiIste('mudur@test.com')` → 200; hemen ardından `sonAnahtar()` 64 haneli bir anahtar buluyor.

### 3) Hesap varlığı sızdırılmıyor (1)

`baglantiIste('boyle-biri-yok@test.com')` → 200 ve `message` 2. adımdakiyle birebir aynı ("Bu adres kayıtlıysa şifre
sıfırlama bağlantısı gönderildi. …").

### 4) Bot doğrulaması zorunlu (1)

`POST /api/sifre-unuttum { email: 'mudur@test.com', challengeId: 'uydurma', challengeAnswer: 42 }` → 400.

### 5) Geçersiz anahtar (1)

`POST /api/sifre-yenile { token: 'aaaa…' (64 'a'), password: 'YeniSifre123!' }` → 400.

### 6) Zayıf şifre (2)

`POST /api/sifre-yenile { token: <gerçek anahtar>, password: '123' }` → 400. İkinci satır ("anahtar hala gecerli…")
`kontrol(…, true)` ile yazılır, yani **her zaman geçer**; anahtarın yanmadığının asıl kanıtı 7. bölümde aynı anahtarın
çalışmasıdır.

### 7) Eski oturum kapanıyor (3)

Müdür eski şifresiyle girer; `GET /api/me` → 200. Aynı anahtarla `YeniSifre123!` yazılır → 200. Eski oturumla `GET /api/me`
→ 401.

### 8) Anahtar tek kullanımlık (1)

Aynı anahtarla bir kez daha `POST /api/sifre-yenile { password: 'BaskaSifre123' }` → 400.

### 9) Yeni şifre işe yarıyor (2)

`girisYap('mudur@test.com', 'YeniSifre123!')` oturum anahtarı döndürüyor; `Test1234!` ile giriş hata fırlatıyor.

### 10) KVKK onayı ve telefon (7)

Hepsi `POST /api/register` (bot sorusu çözülerek):

- `kvkkOnay` hiç yok → 400 ve hata metninde "aydınlatma" geçiyor.
- `kvkkOnay: 'evet'` (metin) → 400 (alan gerçekten `true` olmalı).
- Telefon yok → 400, metinde "Telefon"/"telefon".
- `phone: '123'` → 400.
- `phone: '+90 532 123 45 67'` → 200; cevap `onayGerekli` ise `epostaOnayla` ile bağlantıya "tıklanır"; sonra
  `girisYap('bicimlitel@test.com', …)` cevabındaki `user.phone` `+905321234567`.
- `GET /kvkk/kvkk.html` → 200 (aydınlatma metni yayında).

Sonunda boş satır ve `  GECTI: 27   KALDI: 0`; `KALDI` varsa çıkış kodu 1. Beklenmeyen hata `TEST HATASI:` ile iletiyi ve
yığını yazar, çıkış kodu 1.

## Kimle konuşur?

- **Modüller:** [giris.md](giris.md) (`araclar/giris.js`: istek, bot sorusu, iki adımlı giriş, e-posta onayı); Node'un `fs`'i
  (sunucu günlüğünü okumak için).
- **Sunucu uçları:**

  | Uç | Ne için | Belge |
  |---|---|---|
  | `GET /api/okullar/iller`, `GET /api/okullar/ara` | MEB okul listesi (arama motoru `okulArama`) | [../sunucu/bolumler/kayit.md](../sunucu/bolumler/kayit.md), [../sunucu/okullar.md](../sunucu/okullar.md) |
  | `POST /api/sifre-unuttum`, `POST /api/sifre-yenile` | şifremi unuttum | [../sunucu/bolumler/kayit.md](../sunucu/bolumler/kayit.md) |
  | `GET /api/challenge`, `POST /api/login`, `POST /api/login/dogrula`, `GET /api/me` | bot sorusu, giriş, oturum denemesi | [../sunucu/bolumler/kayit.md](../sunucu/bolumler/kayit.md) |
  | `POST /api/register`, `POST /api/eposta-onay` | kayıt ve e-posta onayı | [../sunucu/bolumler/kayit.md](../sunucu/bolumler/kayit.md) |
  | `GET /kvkk/kvkk.html` | statik sayfa | [../sunucu/http.md](../sunucu/http.md) |

- **Koruduğu kod:**
  - `sunucu/bolumler/kayit.js` — `sifre-unuttum` (IP başına 15 dakikada 20 istek, bot sorusu, `@` yoksa "e-posta yaz"
    uyarısı, her durumda aynı cevap, aynı adrese saatte en çok 3 posta, yalnız onaylı hesaba anahtar) ve `sifre-yenile`
    (IP başına 15 dakikada 30, anahtar yoksa ya da süresi geçtiyse 400, şifre kuralı, anahtarın hemen düşmesi, şifre ile
    bütün oturumların tek işlemde kapanması), `register` (bot, telefon, `kvkkOnay !== true` ise 400), okul listesi uçları.
  - [../sunucu/guvenlik.md](../sunucu/guvenlik.md) — `sifirlamaGonder` (kişinin eski anahtarlarını düşürür, 32 baytlık anahtar,
    `SIFIRLAMA_OMRU_MS` 1 saat), `sifirlamaKayit`, `sifirlamaTemizle`, `sifirlamaKonsolaYaz`, `botCevapDogru`.
  - [../sunucu/ortak.md](../sunucu/ortak.md) — `sifreSorunu`, `gucluSifreli`, `telefonSorunu`, `normTelefon`.
  - [../sunucu/okullar.md](../sunucu/okullar.md) — `okullariYukle`, `okulArama` (`ozel`, `resmiTur`, `kod` alanları).
  - [../sunucu/veri/depo/oturumlar.md](../sunucu/veri/depo/oturumlar.md) — `hesabinOturumlariniKapat`.
  - `public/kvkk/kvkk.html` — yerinde ve sunuluyor mu.
- **Tablolar** (uçlar üzerinden): `kullanicilar` (şifre özeti, telefon), `oturumlar` (kapanan oturumlar), `eposta_onaylari`
  (bekleyen kayıtlar), `islem_kaydi` (`sifre.sifirlandi`).
- **Ön yüz** (bu pakette tarayıcı yok): giriş ekranındaki "Şifremi unuttum" ve yeni şifre formu
  [../public/js/parcalar/05-giris.md](../public/js/parcalar/05-giris.md) (`api('/sifre-unuttum')`, `api('/sifre-yenile')`);
  il/ilçe seçimi ve okul araması [../public/js/parcalar/08b-rolsuz.md](../public/js/parcalar/08b-rolsuz.md)
  (`okulSecimAlani`, `okulSecimiKur`; yöneticinin "Okul aç" penceresi [../public/js/yonetim/09-yonetici.md](../public/js/yonetim/09-yonetici.md)
  kullanır).
- **Onu çalıştıran:** `testler/tumtest.sh`, sunuculu paket döngüsünde (`test-aktarim`'dan sonra, `test-mesaj`'dan önce);
  her paketten önce veritabanı sıfırlanır, [seed.md](seed.md) çalışır.

## Nasıl çalışır (adım adım)?

```
1) /api/okullar/iller ─► 81 il, 60 binden çok okul
   /api/okullar/ara  ─► özel okul (ozel 1, resmiTur "Özel…") ; devlet okulu (ozel 0, kurum kodu)
2) sifre-unuttum(mudur) ─► 200 ─► sunucu günlüğü: "Anahtar   : <64 hane>" ─► sonAnahtar()
3) sifre-unuttum(olmayan) ─► 200, aynı ileti
4) sifre-unuttum(uydurma bot cevabı) ─► 400
5) sifre-yenile(uydurma anahtar) ─► 400
6) sifre-yenile(anahtar, '123') ─► 400 (anahtar düşmez)
7) girisYap(mudur, eski) ─► /api/me 200 ─► sifre-yenile(anahtar, YeniSifre123!) 200 ─► /api/me 401
8) sifre-yenile(aynı anahtar) ─► 400
9) girisYap(yeni) çalışır ; girisYap(eski) hata
10) register: onaysız / 'evet' / telefonsuz / '123' ─► 400 ; '+90 532 …' ─► 200 ─► onay ─► giriş ─► phone '+905321234567'
    GET /kvkk/kvkk.html ─► 200
```

## Dikkat!

- **Müdürün şifresini kalıcı olarak değiştirir.** 7. bölümden sonra `mudur@test.com`'un şifresi `YeniSifre123!`. Aynı
  sunucuda (veritabanı sıfırlanmadan) paketi ikinci kez koşarsan 7. bölümdeki `girisYap(…, 'Test1234!')` fırlatır ve paket
  `TEST HATASI` ile durur; ardından koşulan başka paketler de müdürle giremez. `tumtest.sh` her paketten önce veritabanını
  sıfırladığı için orada sorun yok. (3 Ekim'de 3200'de denendi: ikinci koşu 7. bölümde `TEST HATASI: giriş 1. adım: 401
  Şifre yanlış…` ile durdu.)
- **`EE_LOG` şart, `EE_BASE` de verilmeli.** `LOG` varsayılansız olduğu için `EE_LOG` yoksa `sonAnahtar()` hata atar.
  `EE_BASE` verilmezse istekler ortak yardımcının varsayılanı `http://localhost:3000`'e, yani kendi sunucuna gider (şifre
  sıfırlama ister, deneme hesapları kaydeder). Her zaman test sunucusuyla çalıştır.
- **`sonAnahtar()` kişiye bakmaz.** Günlükteki SON anahtarı alır. Günlüğe başka biri için sıfırlama anahtarı düşerse (aynı
  sunucuda başka bir süreç) yanlış anahtarı okur. Ayrıca sunucu bir adrese saatte en çok 3 sıfırlama postası gönderir;
  sınır dolunca yine aynı "gönderildi" cevabı döner ama anahtar üretilmez, paket önceki (kullanılmış) anahtarı okur.
- **"Anahtar hâlâ geçerli" satırı bir şey denemez** (`kontrol(…, true)`); kanıt 7. bölümdedir.
- **8. bölüm iki nedeni ayırt edemez.** İkinci denemedeki `BaskaSifre123` özel karakter içermediği için yetişkin şifre
  kuralına da takılır. Sunucu bugün önce anahtara baktığı için 400'ün nedeni anahtardır; ama anahtar bir gün tek
  kullanımlık olmaktan çıksa bu denetim yine geçerdi (zayıf şifre yüzünden). Daha sağlam olması için ikinci denemede
  kurala uyan bir şifre kullanılmalı (kod değiştirilmedi).
- **3. bölüm yalnız iletiyi karşılaştırır.** Kayıtlı ve kayıtsız adres için durum kodu ve `message` aynı; cevap süresi
  ölçülmez. Kayıtlı adreste sunucu ayrıca anahtar üretip posta göndermeye çalıştığı için süre farkı olabilir; bu paket
  bunu denetlemez.
- **9. bölümdeki "eski şifre geçersiz" her hatayı kabul eder.** `girisYap` hangi nedenle fırlatırsa fırlatsın (yanlış şifre,
  hız sınırı, kilit) denetim geçer.
- **Okul listesi gerçek veriye bağlı.** Test veri klasöründe `okullar.json` yoksa `/api/okullar/...` 503 "Okul listesi
  yüklenmemiş" döner ve 1. bölümün 7 denetimi kalır (`tumtest.sh` dosyayı her pakette kopyalar; kopyalamada hata olursa
  sessiz geçer). "Bahçeşehir Koleji"nin Ankara'da en az 3 şubesinin olması ve "Atatürk Lisesi" aramasında ilk sonucun devlet
  okulu çıkması MEB listesine dayanır; liste yenilenince kayabilir.
- **`/api/okullar/iller`'in `tipler` alanı denetlenmiyor.** Bu alan bugün hep boş geliyor: `sunucu/okullar.js` `okulVeri`'yi
  dosya yüklenmeden önce (henüz `null` iken) dışa açıyor, sonradan yapılan atama dışarıya geçmiyor (bilinen hata;
  "Güvenlik denetimi" işinde düzeltilecek). Sonucu: "Okul aç" penceresindeki "Okul türü" kutusunda yalnız "Tüm türler"
  var. Paket yalnız `iller` ve `toplam`'a baktığı için bunu yakalamıyor.
- **Kayıt gövdesindeki `role`, `city`, `district` alanları kullanılmıyor.** `register` bunları okumaz (kaydolan her hesap
  rolsüz yetişkin hesabıdır); eski API'den kalma, zararsız.
- **10. bölümün sırası sunucudaki denetim sırasına dayanır.** "Onaysız kayıt" denetimi hata metninde "aydınlatma" arar;
  sunucu aydınlatma onayına telefon ve T.C. denetiminden SONRA bakar. Bu yüzden onaysız istekte geçerli bir telefon
  gönderiliyor. Sunucuya onaydan önce yeni bir zorunlu alan eklenirse bu denetim yanlış nedenle kalır.
- **Hız sınırları bellekte.** Paket `sifre-unuttum`'a 3, `sifre-yenile`'ye 4 istek atar; sınırlar (15 dakikada 20 ve 30)
  uzakta. Ama aynı sunucuyu yeniden başlatmadan elle defalarca koşarsan sayaçlar birikir.

## Testleri

- Bu dosyanın kendisi testtir; `testler/tumtest.sh` her tam koşuda çalıştırır.
- Aynı alanda: [test-giris-kayit.md](test-giris-kayit.md) — şifremi unuttum'a kullanıcı adı yazılınca 400 `alan: 'email'`,
  kayıt hataları, şifre değiştirince öbür oturumların kapanması, 13. bölümde okul aramasının ayrıntıları (kelime sırası,
  yazım hatası düzeltme, kısaltmalar, 150 aramada hız sınırına takılmama); [test-cakisma.md](test-cakisma.md) — kayıtta
  e-posta, kullanıcı adı ve T.C. çakışmaları; [test-okul-agi.md](test-okul-agi.md) — sunucusuz bölümünde
  `sifre-yenile`'nin çağırdığı `girisBasarili('', id)`'nin hesabın toplam hata kilidini kaldırdığını dener.
  `testler/girdi-denetimi.js` ve `testler/yetki-denetimi.js` bu paketin uçlarını (`sifre-unuttum`, `sifre-yenile`,
  `register`, `okullar`) denemez; `yetki-denetimi` `register`'ı yalnız deneme velisini açmak için kullanır.
- Elle (Git Bash, proje kökünde; 3200'de `tumtest.sh`'deki gibi açılmış, [seed.md](seed.md) ile tohumlanmış test sunucusu
  varken):

  ```
  EE_BASE=http://localhost:3200 EE_LOG=testler/test-sunucu.log node testler/test-sifre.js
  ```

- 3 Ekim 2026'da bu belge için 3200'de, sıfırlanmış `egitimevi_test` ve seed'le koşuldu: `GECTI: 27   KALDI: 0`, yaklaşık
  1 saniye. Sunucu günlüğünde `API hatası` / `Veritabanı hatası` yoktu; günlükte tek sıfırlama kaydı ve "Şifre sıfırlandı …
  (2 oturum kapatıldı)" satırı vardı (seed'in müdür oturumu ve paketin açtığı eski oturum). Belge denetiminde aynı gün
  yeniden koşuldu, sonuç ve günlük aynıydı.

## Son durum

- `git log`: 5 commit. Dosya 2026-08-29'da dört parçada eklendi: `1f8a3ae commit 72` (11 satır: başlık yorumu, `require`'lar,
  `LOG`, `kontrol`), `1ae95bc commit 73` (7 satır: `sonAnahtar`), `c071939 commit 74` (6 satır: `baglantiIste`) ve
  `b038226 commit 75` (140 satır: on bölümün hepsi; telefon ve aydınlatma denetimleri dahil).
- Son değişiklik `b6bfc03 commit 517` (2026-09-27, sayfa klasörleri işi): aydınlatma metni `public/kvkk.html`'den
  `public/kvkk/kvkk.html`'e taşındığı için son denetimin adresi `/kvkk.html` → `/kvkk/kvkk.html` oldu (tek satır). Aynı
  commit eski kısa adresleri kalıcı yönlendirmeye bağladı ve `testler/test-adresler.js`'i ekledi.
- Açık iş yok; kod değiştirilmedi. Zayıf noktalar (her zaman geçen satır, 8. bölümün iki nedeni, kişiye bakmayan anahtar
  okuma) "Dikkat!"te.
- Planlı işlerden bu dosyayı etkileyecekler:
  - **"T.C. kimlik no bütün hesaplarda zorunlu"** (kod Linux'ta) — 10. bölümdeki kayıtlar T.C. göndermiyor; o iş gelince
    "+90 biçimli telefon kabul" denetimi 400 alır, "onaysız kayıt" denetimi de (T.C. hatası aydınlatma hatasından önce
    dönerse) yanlış nedenle kalır. Gövdelere geçerli bir T.C. (`tcUret`) eklenmeli.
  - **"Güvenlik denetimi"** — `okulVeri` hatası düzelince `tipler` dolacak (bu pakete bir denetim eklenebilir); "okulun
    verdiği her şifrede ilk girişte değiştirme" şifre akışlarına dokunur.
  - **"Sistem"** (yeni cihaz uyarısı + açık oturumlar) ve **"Kullanıcı arama + hesap penceresinde yöneticinin ve desteğin
    şifre değiştirmesi"** — şifre ve oturum kapatma kurallarına yeni yollar ekler; her biri bu pakettekine benzer bir
    "eski oturum kapanıyor" denemesi ister.
  - **"Tek kişi tek hesap"** — e-posta site genelinde tek kalacak; sıfırlama bağlantısının hangi hesaba gideceği değişmez,
    ama kayıt denetimlerinin sırası değişebilir.
