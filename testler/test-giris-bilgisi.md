# testler/test-giris-bilgisi.js

Okulun toplu giriş bilgisi dağıtımını (sunucunun ürettiği şifreler, "yalnız henüz girmemişler" seçimi, eski şifre ve açık
oturumların düşmesi, öğrenciye bildirim, Excel çıktısı, yetki ve okul sınırı) gerçek uçlardan deneyen sunuculu test paketi
(23 denetim).

## Bu dosya ne yapar?

Okul öğrenci hesaplarını açınca öğrencilere kullanıcı adı ve şifreyi bir kâğıtla (K12'deki "öğrenci-veli mektubu" gibi)
dağıtır. Müdür "Giriş bilgisi dağıt" penceresinde bir sınıf (ya da bütün okul) seçip "Şifreleri yenile ve listeyi
hazırla"ya basınca sunucu seçilen her öğrenciye rastgele, okunaklı bir şifre üretir, şifrenin yalnız özetini saklar ve kullanıcı adı + şifre + veli kodu listesini **bir kez** geri verir (ekranda
yazdırılabilir mektup ve Excel). Liste bir daha üretilemez. Varsayılan olarak yalnız henüz hiç giriş yapmamış öğrenciler
seçilir; yeni şifre verilen öğrencinin eski şifresi ve bütün açık oturumları düşer, öğrenci ilk girişte kendi şifresini
koymak zorunda kalır ve bir bildirim alır. Sunucu tarafı [../sunucu/bolumler/okul.md](../sunucu/bolumler/okul.md)
(`POST /api/school/giris-bilgisi`), ön yüz [../public/js/parcalar/10a-giris-bilgisi.md](../public/js/parcalar/10a-giris-bilgisi.md).

Dosya başı yorumu sözünü şöyle özetliyor: şifreleri sunucu üretir, yalnızca özetini saklar, liste bir kez döner;
varsayılan olarak yalnızca henüz giriş yapmamış öğrenciler seçilir; eski şifre ve açık oturumlar geçersiz olur, öğrenciye
bildirim gider; yetkisiz öğretmen ve başka okulun sınıfı reddedilir.

## İçinde neler var?

### Yardımcılar

- `kontrol(ad, sart, detay)`, `J(x)` (160 harflik JSON).
- `z = Date.now()` — bu koşuya özgü ek; hesap ve okul adları onunla tekleşir.

Ortak yardımcılar [giris.md](giris.md) üzerinden ([../araclar/giris.md](../araclar/giris.md)): `iste`, `girisYap`,
`hesapAc`, `mudurYap`, `tcUret`.

### Hesaplar ve hazırlık

- Seed hesapları ([seed.md](seed.md)): müdür (`mudur@test.com`, `M`), sistem yöneticisi (`admin@egitimevi.com`, `A`;
  seed'in değil, test sunucusunun açılışta kurduğu ilk yönetici), 1. bölümde Matematik öğretmeni (`mat`, kullanıcı adıyla).
- **Ayrı bir sınıf:** dosyadaki yorumun dediği gibi seed öğrencilerinin şifresine dokunmamak için müdür `9-Z` sınıfını açar
  ve içine üç öğrenci koyar: `dagit.bir<z>`, `dagit.iki<z>`, `dagit.uc<z>` (`POST /api/school/student-create`, şifre
  `Eski2026x`, T.C. no `tcUret()` ile). Paket içinde `adlar[0..2]` diye anılırlar.
- 1. bölümde "Diger Mudur" adlı bir yetişkin hesabı açılır ve yönetici onun için "Diger Okul <z>" (Ankara / Mamak) okulunu
  açıp onu müdür yapar (`hesapAc` + `mudurYap`) → `M2`.

### 1) Yetki ve doğrulama (3)

- `mat` (öğretmenin varsayılan yetkilerinde `ogrenci.sifre` yok) `9-Z` için dağıtım ister → 403.
- Müdür `onay: true` göndermeden ister → 400 (sunucu: "Şifreler yenilenecek; onaylaman gerekiyor.").
- Başka okulun müdürü (`M2`) bu okulun `9-Z`'si için ister → 400, iletide "Sınıf bulunamadı".

### 2) Henüz girmemişler (15)

- `adlar[0]` eski şifresiyle girer (artık "giriş yapmış" sayılır). Okulun öğrenci listesinde (`GET /api/school/students`)
  `adlar[0]` için `girisYapti: true`, `adlar[1]` için `false`.
- Müdür `{ classId: 9-Z, sadeceGirmeyen: true, onay: true }` ile dağıtır → 200 ve `adet === 2`.
- Cevabın `Cache-Control` başlığında `no-store` (liste tarayıcı önbelleğine düşmesin).
- `satirlar`'da `adlar[0]` yok; `adlar[1]` ve `adlar[2]` var.
- Her şifre `/^[A-HJ-NP-Za-km-z]{8}[2-9]{2}$/`: sekiz harf (karışan `I`, `O`, `l`, `o` yok) + iki rakam (`2`–`9`; `0` ve
  `1` yok); hepsi birbirinden farklı.
- Her veli kodu 4'erli dört grup, aralarında tire: ilki harfle başlar, gerisi harf, rakam ya da `! ? # * + =`
  (`/^[A-Za-z][A-Za-z0-9!?#*+=]{3}(-[A-Za-z0-9!?#*+=]{4}){3}$/`).
- Her satırın sınıfı `9-Z`.
- `xlsx` alanı base64 bir dosya ve ilk iki baytı `PK` (Excel bir zip'tir).
- Satırların JSON'unda `scrypt`, `$` ya da `"id"` geçmiyor (şifre özeti ya da kişi kimliği sızmıyor).
- `adlar[1]`'in eski şifresiyle giriş (`POST /api/login`) → 401.
- `adlar[1]` yeni şifresiyle girer → oturum geliyor ve `user.sifreDegismeli === true`. Aydınlatma metni güncel değilse
  onaylanır (`POST /api/kvkk-onay`; okulun açtığı hesap ilk girişte onaylar), sonra `POST /api/password` ile kendi şifresini
  (`Kendi2026x`) koyar → 200.
- `adlar[1]`'in bildirimlerinde "yenilendi" geçen bir bildirim var (sunucunun metni: "Giriş bilgilerin okul yönetimi
  tarafından yenilendi. …").
- Seçilmeyen `adlar[0]`'ın açık oturumu hâlâ geçerli (`GET /api/me` → 200).

### 3) Herkes seçilirse (5)

- `sadeceGirmeyen: false` ile dağıtım → `adet === 3` (giriş yapmış olanlar dahil bütün sınıf).
- `adlar[0]`'ın 2. bölümden kalan oturumu artık kapalı (`GET /api/me` → 401).
- Hemen ardından `sadeceGirmeyen: true` → yine `adet === 3`: yeni şifre verilen herkes yeniden "girmemiş" sayılır (sunucu
  dağıtımda son giriş zamanını siler).
- `adlar[2]` en son şifresiyle girer; bir sonraki `sadeceGirmeyen: true` dağıtımında `adet === 2` ve `adlar[2]` listede
  yok.
- İşlem kaydı (`GET /api/islem-kaydi`, müdür) "sifre.toplu-dagitildi" ya da "Toplu giriş" içeriyor — ya da uç 200
  dönmüyor ("Dikkat!"e bak).

Sonunda boş bir satır ve `GECTI: 23   KALDI: 0` (başında boşluk yok; `tumtest.sh` `GECTI: [0-9]+` aradığı için fark
etmez); `KALDI` varsa çıkış kodu 1. Beklenmeyen hata `TEST HATASI:` ile hata nesnesini yazar, çıkış kodu 1.

## Kimle konuşur?

- **Modüller:** yalnız [giris.md](giris.md) (`araclar/giris.js`).
- **Sunucu uçları:**

  | Uç | Ne için | Belge |
  |---|---|---|
  | `POST /api/school/giris-bilgisi` | paketin asıl konusu | [../sunucu/bolumler/okul.md](../sunucu/bolumler/okul.md) |
  | `POST /api/school/class`, `GET /api/school/students` | `9-Z` sınıfı, `girisYapti` | [../sunucu/bolumler/okul.md](../sunucu/bolumler/okul.md) |
  | `POST /api/school/student-create` | üç öğrenci (`hesap-ac`'ın öğrenciye özel eski adı) | [../sunucu/bolumler/hesaplar.md](../sunucu/bolumler/hesaplar.md) |
  | `POST /api/login`, `POST /api/login/dogrula`, `GET /api/me`, `POST /api/kvkk-onay`, `POST /api/password`, `GET /api/notifications`, `POST /api/register`, `POST /api/eposta-onay`, `POST /api/logout` | giriş, şifre, bildirim, ikinci müdürün hesabı | [../sunucu/bolumler/kayit.md](../sunucu/bolumler/kayit.md) |
  | `GET /api/kisilikler`, `POST /api/admin/okul-ac` (`mudurYap` içinde) | ikinci okul ve müdürü | [../sunucu/bolumler/kisilik.md](../sunucu/bolumler/kisilik.md), [../sunucu/bolumler/yonetici-okul.md](../sunucu/bolumler/yonetici-okul.md) |
  | `GET /api/islem-kaydi` | dağıtımın kayda geçmesi | [../sunucu/bolumler/islem-kaydi.md](../sunucu/bolumler/islem-kaydi.md) |

- **Koruduğu kod:** [../sunucu/bolumler/okul.md](../sunucu/bolumler/okul.md)'deki dağıtım bloğu (`ogrenci.sifre` yetkisi,
  onay, okul başına saatte 30 dağıtım, `sadeceGirmeyen`, `rastgeleSifre` — harfler `SIFRE_HARF`, rakamlar `SIFRE_RAKAM` —,
  veli kodunun yalnız `ogrenci.duzenle` yetkisi olana gitmesi, `no-store`); [../sunucu/veri/depo/kullanicilar.md](../sunucu/veri/depo/kullanicilar.md)
  (`topluSifreYaz`: özeti yazar, `son_giris`'i siler, `sifre_degismeli`'yi açar, oturumları ve telefon anahtarlarını
  siler); [../sunucu/sifre.md](../sunucu/sifre.md) (`hashPwToplu`); [../sunucu/ortak.md](../sunucu/ortak.md)
  (`kisiKoduBicim`); [../sunucu/yardimci/aktarim.md](../sunucu/yardimci/aktarim.md) (Excel); şifre değiştirme ve "kendi
  şifreni belirle" kapısı [../sunucu/bolumler/kayit.md](../sunucu/bolumler/kayit.md) ve [../sunucu/api.md](../sunucu/api.md).
- **Tablolar** (dolaylı): `kullanicilar`, `oturumlar`, `cihaz_anahtarlari`, `bildirimler`, `islem_kaydi`, `siniflar`.
- **Rol:** dağıtımı müdür ya da `ogrenci.sifre` yetkili rol yapar; şifreyi öğrenci kullanır. Ön yüzde aynı ucu
  [../public/js/parcalar/10a-giris-bilgisi.md](../public/js/parcalar/10a-giris-bilgisi.md) çağırır, ilk girişteki şifre
  ekranı [../public/js/parcalar/05b-sifre-zorunlu.md](../public/js/parcalar/05b-sifre-zorunlu.md).
- **Onu çalıştıran:** `testler/tumtest.sh`, sunuculu paket döngüsünde (`test-veli-coklu`'dan sonra, `test-anket`'ten önce);
  her paketten önce sıfırlanmış veritabanı ve [seed.md](seed.md).

## Nasıl çalışır (adım adım)?

```
M, A girer ; M: 9-Z + 3 öğrenci (şifre Eski2026x)
1) mat ─► 403 ; M onaysız ─► 400 ; "Diger Okul" müdürü (M2) bu sınıfı ─► 400 "Sınıf bulunamadı"
2) adlar[0] eski şifreyle girer (sonGiris dolar)
   M: dağıt (yalnız girmeyenler) ─► adet 2 (adlar[1], adlar[2]) ; no-store ; şifre ve veli kodu biçimi ; Excel PK
   adlar[1]: eski şifre 401 ─► yeni şifre ─► sifreDegismeli ─► (aydınlatma onayı) ─► kendi şifresi ─► bildirim "yenilendi"
   adlar[0]'ın oturumu hâlâ açık
3) M: dağıt (herkes) ─► adet 3 ─► adlar[0]'ın oturumu 401
   M: dağıt (girmeyenler) ─► adet 3 (son giriş silindi)
   adlar[2] girer ─► M: dağıt (girmeyenler) ─► adet 2, adlar[2] yok
   işlem kaydı
```

Sunucuda bir dağıtım tek işlemde şunları yapar: seçilen öğrencilere yeni şifre özeti, `son_giris = NULL`,
`sifre_degismeli = true`; onların bütün oturumlarını ve telefon anahtarlarını silme. Ardından eski şifreye yapılan
denemelerin hesap kilidi kalkar, bildirim gider, işlem kaydına "<sınıf>: N öğrenci" yazılır.

## Dikkat!

- **İşlem kaydı denetimi gevşek.** Koşul `kayit.status !== 200 || …` olduğu için `GET /api/islem-kaydi` 403 ya da 404
  dönse de denetim geçer. Bugün müdürde bütün yetkiler olduğundan uç 200 döner ve içerik gerçekten aranır; ama uç bozulsa
  bu satır bunu göstermez.
- **Taze seed ister.** Sınıf adı (`9-Z`) sabit; aynı veritabanında ikinci koşuda sınıf açılamaz ("Bu adda bir sınıf zaten
  var"), `snf` boş kalır ve paket hiçbir denetim yapmadan 25. satırda (`snf.id`) `TEST HATASI: TypeError: Cannot read
  properties of undefined (reading 'id')` ile durur — 3 Ekim denetiminde aynı veritabanında art arda iki kez koşularak
  görüldü. Öğrenci adları `z` ile tekleşir.
- **Okul başına saatte 30 dağıtım** (bellekte, sunucu açık kaldıkça). Bu paket birinci okulda 4 dağıtım yapar. Aynı
  sunucuyu yeniden başlatmadan (ve veritabanını sıfırlamadan) paketi defalarca koşarsan sınır dolabilir; `tumtest.sh` her
  pakette sunucuyu yeniden açar.
- **Veli kodu denetimi müdüre dayanır.** Sunucu veli kodunu yalnız `ogrenci.duzenle` yetkisi olana verir; yalnız
  `ogrenci.sifre`'si olan bir rol dağıtırsa `veliKodu` boş gelir. Bu durum hiçbir pakette denenmiyor (`testler/` altında
  `giris-bilgisi` geçen öbür tek dosya [yetki-denetimi.md](yetki-denetimi.md), 3 Ekim); buradaki biçim denetimi müdürle
  yapıldığı için geçer.
- **Denenmeyenler:** sınıf verilmeden bütün okula dağıtım ("Bütün okul"), 600 öğrenci sınırı, rol kapsamı
  (`ogrenciKapsamindaMi`), "seçilen kapsamda öğrenci yok" cevabı, dağıtımdan sonra telefon anahtarlarının silinmesi.
- **Eski şifre denemesi bilerek hatalıdır.** `adlar[1]`'in eski şifreyle girişi hatalı deneme sayılır; aynı hesaba bu
  bağlantıdan art arda 5 hata kilit açar. Paket bir kez dener; bir sonraki doğru girişte sayaç zaten temizlenir.
- **Öğrenci girişi tek adımlıdır.** Öğrenciye iki adımlı kod gönderilmez; `girisYap` öğrencide günlüğe bakmadan biter.
  E-postası olan öbür hesaplarda — müdür (`mudur@test.com`), öğretmen (`mat`), yönetici ve ikinci müdür — kod `EE_LOG`
  günlüğünden okunur (`sonKod`); sunucunun çıktısı o dosyaya gitmiyorsa paket ilk girişte durur.
- **Varsayılan adres 3000.** `EE_BASE` vermeden çalıştırırsan kendi okulunda öğrenci açar, şifre dağıtır ve bir okul daha
  açtırır; her zaman test sunucusunu kullan.

## Testleri

- Bu dosyanın kendisi testtir; `testler/tumtest.sh` her tam koşuda çalıştırır. Aynı alanda: [yetki-denetimi.md](yetki-denetimi.md)
  (`giris-bilgisi` ucunun her rolle denenmesi), [test-giris-kayit.md](test-giris-kayit.md) (şifre değişince öbür
  oturumların kapanması, veli kodunun biçimi), `testler/test-sifre.js` ("Şifremi unuttum" akışı; şifrenin öbür yolu).
- Elle (Git Bash, proje kökünde; 3200'de `tumtest.sh`'deki gibi açılmış ve [seed.md](seed.md) ile tohumlanmış test
  sunucusu varken):

  ```
  EE_BASE=http://localhost:3200 EE_LOG=testler/test-sunucu.log node testler/test-giris-bilgisi.js
  ```

- 3 Ekim sabahı bu belge için 3200'de, sıfırlanmış `egitimevi_test` ve seed'le koşuldu: `GECTI: 23   KALDI: 0`, 1–2
  saniye; sunucu günlüğünde `API hatası` ya da `Veritabanı hatası` yok. Belgenin denetiminde (aynı sabah) yeniden koşuldu,
  sonuç aynı; hemen ardından aynı veritabanında ikinci koşu yukarıdaki `TEST HATASI`'nı verdi.

## Son durum

- `git log`: 4 commit.
  - `153d63d commit 522` (2026-09-27): veli kodu denetimi "5'erli gruplar, arada boşluk"tan "4'erli dört grup, arada
    tire"ye geçti (16 karakterli yeni kod, izinli işaretlerde `-` yerine `=`).
  - `0acca75 commit 516` (2026-09-27, kişi kodu ve portallar): "veli kodu tireli" (`XXXXX-XXXXX`, yalnız büyük harf ve
    rakam) denetimi "5'erli gruplar, arada boşluk" biçimine çevrildi.
  - `139b8de commit 17` (2026-08-28): paketin gövdesi (83 satır) — hazırlık ve üç bölüm; aynı commit `testler/giris.js`'i
    ve `testler/test-giris-kayit.js`'i ekledi. Dosyanın ilk 14 satırı (başlık yorumu, `kontrol`, `J`) `778c7a7 commit 6`
    (2026-08-28) ile gelmişti.
- Açık iş yok; kod değiştirilmedi. Gevşek işlem kaydı denetimi "Dikkat!"te.
- Planlı işlerden bu dosyayı etkileyecekler:
  - **"Güvenlik denetimi"** ("okulun verdiği her şifrede ilk girişte değiştirme") — dağıtılan şifrede bugün zaten
    `sifreDegismeli` açık; kural genelleşince 2. bölümdeki akış aynı kalmalı, öbür okul şifreleri için yeni denetim gerekir.
  - **"T.C. kimlik no bütün hesaplarda zorunlu"** — `M2`'nin `hesapAc` kaydı T.C. no göndermiyor; zorunlu olunca 1. bölüm
    hazırlıkta durur.
  - **"Özel roller"** (yeni yetkiler ve hazır şablonlar) — `ogrenci.sifre` ve `ogrenci.duzenle`'nin dağılımı değişirse
    1. bölümdeki 403 ve veli kodu denetimi gözden geçirilmeli.
  - **"Sistem"** işindeki "yeni cihaz uyarısı + açık oturumlar" — dağıtımın oturumları kapatması o ekrana da yansımalı.
