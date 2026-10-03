# testler/test-ayarlari.js

Test sunucusunun veri klasörüne (`testler/testdata/`) gerçek kurulumun veritabanı bağlantı bilgisini, yalnız veritabanı
adını test veritabanınınkiyle (`egitimevi_test`) değiştirerek yazan 29 satırlık hazırlık betiği.

## Bu dosya ne yapar?

Adı `test-` ile başlasa da bu bir test paketi değil: hiçbir şeyi denemez, `GECTI`/`KALDI` yazmaz. `testler/tumtest.sh`'in
her sunuculu paketten önce çalıştırdığı bir **hazırlık adımıdır**.

Çözdüğü sorun şu: sunucu, veri klasöründeki `ayarlar.json`'da bir `veritabani` bölümü bulamazsa "Veritabanı ayarı yok"
deyip açılmaz ([../sunucu/veri/baglanti.md](../sunucu/veri/baglanti.md)). Testler ise gerçek veriye asla dokunmamalı; bu
yüzden test sunucusu ayrı bir veri klasörüyle (`EE_DATA=testler/testdata`) ve ayrı bir veritabanıyla açılır. İki
veritabanı da aynı PostgreSQL sunucusunda, aynı kullanıcıyla durur; değişen tek şey veritabanının **adı**. Bu betik
bağlantı bilgisini gerçek ayar dosyasından alır, adı test adıyla değiştirir ve test klasörüne yazar. Böylece sen test
için ayrıca kullanıcı adı, şifre, port yazmak zorunda kalmazsın.

Gerçek veriyi koruyan iki ayrı kilit var ve bu dosya birincisi:

1. Bu betik `testAd` yoksa ya da `_test` ile bitmiyorsa hiçbir şey yazmadan durur.
2. Sunucu `EE_DB_SIFIRLA=1` ile açılınca bütün tabloları siler, ama yalnız adı `_test` ile biten veritabanında; öbüründe
   hata verip açılmaz (`testIcinSifirla`, [../sunucu/veri/sema.md](../sunucu/veri/sema.md)).

`testAd`'ı veritabanı kurulum aracı yazar ([../araclar/veritabani-kur.md](../araclar/veritabani-kur.md)): o araç
`egitimevi` ve `egitimevi_test` adlı iki veritabanını açar ve ikisinin adını da `data/ayarlar.json`'a koyar.

## İçinde neler var?

İşlev, dışa açılan ad yok; dosya baştan sona tek akış (`'use strict'`, `fs`, `path`):

- `kaynak` — `<proje kökü>/data/ayarlar.json`. Yol betiğin kendi yerinden (`__dirname`) kurulur; komutu hangi klasörde
  çalıştırdığın önemli değildir.
- `hedefKlasor` — komut satırının ilk argümanı (`path.resolve` ile; göreli verirsen çalışma klasörüne göre çözülür), argüman
  yoksa `testler/testdata`.
- Okuma: dosya okunamaz ya da JSON bozuksa ekrana `data/ayarlar.json okunamadı: önce npm run veritabani-kur çalıştır.`
  yazar, çıkış kodu 1.
- Denetim: `ayar.veritabani` yoksa, içinde `testAd` yoksa ya da `testAd` `_test` ile bitmiyorsa
  `ayarlar.json içinde test veritabanı (testAd) yok: npm run veritabani-kur yeniden çalıştırılmalı.`, çıkış kodu 1.
- Yazma: hedef klasör yoksa açılır (`mkdirSync(..., { recursive: true })`), içine `ayarlar.json` yazılır:

  ```
  { "veritabani": { ...gerçek dosyadaki veritabani bölümünün aynısı..., "ad": "<testAd>" } }
  ```

  `Object.assign({}, v, { ad: v.testAd })` olduğu için sunucu adresi, port, kullanıcı adı, şifre, `testAd` ve kurulum
  aracının bıraktığı `_aciklama` notu aynen geçer; yalnız `ad` değişir. Dosya `mode: 0o600` ile açılır (yalnız sahibi okuyabilsin diye; Windows bu izin bitlerini büyük
  ölçüde yok sayar, Linux'ta gerçekten uygulanır).
- Başarıda ekrana hiçbir şey yazmaz, çıkış kodu 0. Dosya yorumundaki "Şifre ekrana yazılmaz." sözü kodda da doğru: ekrana
  giden yalnız yukarıdaki iki hata iletisi.

**Yalnız `veritabani` bölümü kopyalanır.** Gerçek dosyadaki e-posta, site adresi ve ters vekil ayarları test klasörüne
gitmez; sunucu açılırken bunları varsayılanla doldurur ([../sunucu/ayarlar.md](../sunucu/ayarlar.md)). Bunun testlere
üç etkisi var ve üçü de bilerek kullanılıyor:

- E-posta kapalı olduğu için iki adımlı giriş kodları ve onay bağlantıları sunucu günlüğüne yazılır; testlerin ortak
  yardımcısı kodları oradan okur ([../araclar/giris.md](../araclar/giris.md) → `sonKod`, `sonOnayAnahtari`).
- Site adresi boş olduğu için sunucu kendini `https` saymaz; yöneticinin `/admin` çerezi `Secure` taşımaz
  ([test-admin-gizli.md](test-admin-gizli.md) bunu ayrıca bekler).
- Vekil güveni kapalı (`vekil.guven: false`): test sunucusu istemcinin adresini ve `https` olup olmadığını vekil
  başlıklarından değil, bağlantının kendisinden alır.

## Kimle konuşur?

- **Okuduğu:** `data/ayarlar.json` (git dışında; yalnız bu bilgisayarda). Bölümün biçimi
  [../araclar/veritabani-kur.md](../araclar/veritabani-kur.md)'nin "Ayar dosyasına yazılan" kısmında.
- **Yazdığı:** `testler/testdata/ayarlar.json` (klasör `.gitignore`'da: `testler/testdata/`; içinde veritabanı şifresi
  durduğu için depoya hiç girmemeli — `testler/test-gizli-dosyalar.js` bu yolun yok sayıldığını denetler).
- **Onu çalıştıran:** `testler/tumtest.sh` — sunuculu paket döngüsünde (her paketten önce, `testdata/` silinip yeniden
  açıldıktan sonra) ve iki sunuculu denetimden (`yetki-denetimi`, `girdi-denetimi`) önce:
  `node "$SP/test-ayarlari.js" "$SP/testdata" || exit 1`. Betik hata verirse bütün test koşusu orada durur.
- **Yazdığı dosyayı okuyanlar:**
  - Test sunucusu: `EE_DATA=testler/testdata` ile açılır; `sunucu/yollar.js` veri klasörünü, `sunucu/ayarlar.js`
    `ayarlar.json`'u, [../sunucu/veri/baglanti.md](../sunucu/veri/baglanti.md) `ayarlar.veritabani`'yı okur.
  - Veritabanına kendi süreçlerinden doğrudan bağlanan **on** test paketi bu dosyaya dayanır (`git grep EE_DATA testler`
    ve `git grep testdata testler`, 3 Ekim):
    - Dokuzu `process.env.EE_DATA`'yı `testler/testdata`'ya çevirip doğrudan bu dosyadan bağlanır: `test-admin-gizli`,
      `test-cakisma`, `test-kisi-kodu`, `test-odev-dosya`, `test-okul-agi`, `test-okul-disk`, `test-quiz`,
      `test-servis-yoklama`, `test-yonetici-dosyasi`.
    - Onuncusu `test-site-ayarlari`: kendi veri klasörünü (`testler/testdata/site-ayar-deneme/`, içine bir `config.yml`
      yazar) kullanır, ama bağlantı için bu betiğin yazdığı `ayarlar.json`'u oraya **kopyalar** (`fs.copyFileSync`). Bu
      dosya yoksa kopyalama hata atar ve o paket daha başta `TEST HATASI` ile durur.

    On paketin hepsi bağlandıktan sonra `veritabaniAdi()` `_test` ile bitiyor mu diye ayrıca bakar (bkz.
    [test-admin-gizli.md](test-admin-gizli.md) → `testDeposu`). Sunucusuz `test-push` ve `test-vekil-ip` ise `EE_DATA`'yı
    işletim sisteminin geçici klasöründe açtıkları bir klasöre çevirir; bu dosyayı okumazlar.
  - Araç: yük testi ([../araclar/yuk-testi.md](../araclar/yuk-testi.md)) belgesindeki komutla
    `EE_DATA=testler/testdata` verilerek çalıştırılır ve aynı dosyadan bağlanır; dosya yoksa önce bu betik çalışmalı.
- `TANITIM.md`'nin "8. Testler ve denetimler" ve "13. Nasıl çalıştırılır, nasıl test edilir?" bölümleri bu betiği anar;
  tek paketi elle koşarken ilk adım odur.

## Nasıl çalışır (adım adım)?

```
tumtest.sh (her sunuculu paket için)
  sunucu_durdur (3200)
  rm -rf testler/testdata ; mkdir testler/testdata ; cp data/okullar.json testler/testdata/
  node testler/test-ayarlari.js testler/testdata
     data/ayarlar.json ──oku──► veritabani { sunucu, port, kullanici, sifre, ad: egitimevi, testAd: egitimevi_test }
     testAd var ve _test ile bitiyor mu? ── hayır ─► ileti, çıkış 1 (tumtest.sh de durur)
     evet ─► testler/testdata/ayarlar.json = { veritabani: { ...aynısı, ad: egitimevi_test } }
  EE_DATA=testler/testdata EE_DB_SIFIRLA=1 ... node server.js   (egitimevi_test sıfırlanır, şema kurulur)
  seed.js, sonra paket
```

`data/okullar.json`'u test klasörüne kopyalayan bu betik değil, `tumtest.sh`'in kendisidir.

## Dikkat!

- **`DATABASE_URL` her şeyin önüne geçer.** Bu ortam değişkeni tanımlıysa sunucu `ayarlar.json`'a hiç bakmaz
  ([../sunucu/veri/baglanti.md](../sunucu/veri/baglanti.md) → `baglantiAyari`), yani bu betiğin yazdığı test adı boşa
  gider. O zaman tek koruma sunucunun sıfırlama kilididir: adres `_test` ile bitmeyen bir veritabanını gösteriyorsa
  `EE_DB_SIFIRLA=1` ile açılan sunucu hata verip açılmaz, testler "SUNUCU ACILMADI" der. Testleri koşacağın kabukta
  `DATABASE_URL` tanımlı olmasın.
- **`testAd` yoksa testler hiç başlamaz.** `testAd` alanını yalnız veritabanı kurulum aracı yazar; `data/ayarlar.json` elle
  yazıldıysa ya da araçtan önceki bir kurulumdan kaldıysa bu alan olmayabilir. O zaman betik durur ve
  `npm run veritabani-kur`'u yeniden çalıştırmanı ister (araç öbür bölümleri olduğu gibi korur).
- **Test klasöründe gerçek veritabanı şifresi durur.** Yazılan dosya kopya bir bağlantı bilgisidir (aynı kullanıcı, aynı
  şifre). `testler/testdata/` `.gitignore`'da; o klasörü başka bir yere kopyalama, paylaşma.
- **Ayar değişince test kopyası eskir.** `tumtest.sh` her pakette yeniden yazdığı için sorun olmaz; ama sunucuyu elle
  açıyorsan (`TANITIM.md`'deki adımlar) gerçek ayarı değiştirdikten sonra bu betiği yeniden çalıştır.
- **Ad yalnız sona bakılarak denetlenir.** `/_test$/` deseni; gerçek veritabanına `_test` ile biten bir ad verilirse bu
  kilit (ve sunucununki) onu test sanar. Kurulum aracı adları sabit yazdığı için bugün böyle bir durum yok.
- Betik, hedef klasördeki öbür dosyalara dokunmaz; yalnız `ayarlar.json`'un üzerine yazar. Klasörü boşaltan
  `tumtest.sh`'tir.

## Testleri

- Kendi testi yok. Bozulursa ilk sunuculu pakette görünür: `tumtest.sh` `|| exit 1` ile hemen durur; betik yanlış bir
  dosya yazarsa sunucu açılamaz ("SUNUCU ACILMADI") ya da `seed.js` bağlanamaz ("SEED BASARISIZ").
- `testler/test-gizli-dosyalar.js` — yazdığı `testler/testdata/ayarlar.json`'un git tarafından yok sayıldığını denetler.
- Elle (Git Bash, proje kökünde; gerçek ayarı okur ama ekrana bir şey yazmaz):

  ```
  node testler/test-ayarlari.js testler/testdata && echo tamam
  node -e "const a=require('./testler/testdata/ayarlar.json').veritabani; console.log(a.ad, a.testAd)"
  ```

  İkinci satır `egitimevi_test egitimevi_test` yazmalı (şifreyi yazdırmamak için yalnız iki alan istenir).
- Bu belge yazılırken (3 Ekim sabahı) betiğin kendisi çalıştırılmadı: belgeleme kuralı gereği `data/` okunmadı.
  `testler/testdata/ayarlar.json` önceki bir koşudan (2 Ekim) duruyordu; aynı belgeleme işinde altı sunuculu paket
  (`test-admin-gizli`, `test-adresler`, `test-aile`, `test-aktarim`, `test-anket`, `test-bildirim`) o dosyayla 3200'de
  açılan sunucuda, her biri sıfırlanmış `egitimevi_test`'le koşuldu; hepsi `KALDI: 0` bitti.

## Son durum

- `git log`: tek commit. Dosya `778c7a7 commit 6` (2026-08-28) ile 29 satır olarak eklendi; aynı commit `package.json`,
  `package-lock.json`, `.gitignore`, `public/index.html`, `testler/test-kucult.js` ve `testler/test-giris-bilgisi.js`'i de
  getirdi. O günden beri hiç değişmedi.
- Açık iş yok.
- Planlı işlerden doğrudan bu dosyaya dokunan yok. "TAM DEBUG" işi testleri Linux'ta koşacak: betik yalnız `fs`/`path`
  kullandığı için orada da çalışır (asıl uyarlama `tumtest.sh`'in `netstat`/`taskkill` kısmında gerekir); Linux'ta
  `0o600` izni gerçekten uygulanır.
