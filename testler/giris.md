# testler/giris.js

Testlerin ortak giriş yardımcısına giden kısa yol: üç satırlık bu dosya `araclar/giris.js`'i olduğu gibi yeniden dışa açar,
böylece her test `require('./giris')` yazabilir.

## Bu dosya ne yapar?

Test paketlerinin neredeyse hepsi aynı işlerle başlar: bot sorusunu çöz, şifreyle gir, iki adımlı giriş kodunu sunucu
günlüğünden oku, yetişkin hesabı aç, e-posta onay bağlantısına "tıkla", kişi koduyla öğretmen ya da müdür yap… Bunların
hepsi tek bir yerde yazılı: [../araclar/giris.md](../araclar/giris.md). Araçlar da testler de aynı yardımcıyı kullansın diye
kod `araclar/` altında durur.

Bu dosyanın tek işi yolu kısaltmak. Testler `testler/` klasöründe olduğu için `require('../araclar/giris')` yazmak yerine
`require('./giris')` yazarlar; bu dosya da isteği oraya iletir:

```js
module.exports = require('../araclar/giris');
```

Yani burada kendi başına bir mantık yok: `require('./giris')` ile alınan nesne, `araclar/giris.js`'in dışa açtığı nesnenin
**ta kendisidir** (kopya değil; Node'un modül önbelleği aynı nesneyi verir). 3 Ekim'de denendi:
`require('./testler/giris') === require('./araclar/giris')` → `true`.

## İçinde neler var?

Kendi işlevi, sabiti, değişkeni yok; yalnız `'use strict'`, bir satırlık yorum ("Testler araclar/giris.js'i kullanır; bu dosya
yalnızca yolu kısaltır.") ve yeniden dışa açma. Dışa açtığı 15 ad `araclar/giris.js`'ten gelir (ayrıntıları
[../araclar/giris.md](../araclar/giris.md)'de):

| Ad | Kısaca |
|---|---|
| `BASE` | İsteklerin gittiği adres: `EE_BASE` ya da `http://localhost:3000` |
| `LOG` | Kodların okunduğu sunucu günlüğü: `EE_LOG` ya da proje kökündeki `sunucu.log` |
| `iste(yol, method, body, token)` | JSON isteği; HTTP hatasında fırlatmaz, `{ status, body, headers }` döner |
| `sonKod(eposta)` | Günlükteki iki adımlı giriş kodu (kişiye göre, bulamazsa en sonuncusu) |
| `sonOnayAnahtari(eposta)` | Günlükteki e-posta onay anahtarı |
| `epostaOnayla(eposta)` | Onay bağlantısına "tıklar" (`POST /api/eposta-onay`) |
| `girisYap(kimlik, sifre, okul)` | Şifre + iki adımlı girişin tamamı; oturum cevabını döner |
| `botCevabi()` | `GET /api/challenge` sorusunu çözer |
| `hesapAc(g)` | Rolsüz yetişkin hesabı açar (kayıt + e-posta onayı) |
| `okulHesabi(token, rol, g, onaylat)` | Okulun öğrenci/servisçi hesabı açması (öğretmende `ogretmenYap`) |
| `ogretmenYap(token, g)` | Öğretmen kendi hesabını açar, müdür kişi koduyla okula ekler |
| `kisiKodu(token)` | Kişinin kişi kodu (`GET /api/kisilikler`) |
| `kisilikGec(token, tur, id)` | Rol değiştirme (`POST /api/kisilik/gec`) |
| `mudurYap(kimlik, sifre, okul, adminToken)` | Yönetici okulu açıp kişiyi müdür yapar (`POST /api/admin/okul-ac`) |
| `tcUret()` | Algoritmaya uyan rastgele T.C. kimlik no |

## Kimle konuşur?

- **Çağırdığı:** yalnız `../araclar/giris.js` ([../araclar/giris.md](../araclar/giris.md)). Hangi sunucu uçlarına gidildiği o
  belgede tablo hâlinde yazılı.
- **Onu kullananlar:** `testler/` altında **46 dosya** `require('./giris')` yazar (3 Ekim'de `git grep` ile sayıldı): bütün
  sunuculu `test-*.js` paketleri, [seed.md](seed.md), [guvenlik-test.md](guvenlik-test.md),
  [girdi-denetimi.md](girdi-denetimi.md), [yetki-denetimi.md](yetki-denetimi.md), [debug-hazirlik.md](debug-hazirlik.md),
  [hazirlik-aktarim.md](hazirlik-aktarim.md).
- **Kullanmayanlar:** sunucusuz paketler (`test-xlsx`, `test-push`, `test-kucult`, `test-resim-kucult`,
  `test-hatirlatici-zaman`, `test-servis-pencere`, `test-vekil-ip`, `test-uygulama-surum`, `test-quiz-metin`,
  `test-gizli-dosyalar`), `test-ayarlari.js` ve sunucusuz denetimler: [buton-denetimi.md](buton-denetimi.md),
  [sql-denetimi.md](sql-denetimi.md), [yazim-denetimi.md](yazim-denetimi.md). Bunlar sunucuya bağlanmaz, yalnız dosya okur
  ya da kendi işini görür.
- **Araçlar** bu dosyadan geçmez: `araclar/` içindeki dört araç (`deneme-okulu.js`, `gezinti.js`, `gorsel-veri.js`,
  `zengin-veri.js`) `require('./giris')` ile asıl dosyayı doğrudan alır.

## Nasıl çalışır (adım adım)?

```
testler/test-mesaj.js:  const { iste, girisYap } = require('./giris');
        │
        ▼
testler/giris.js:       module.exports = require('../araclar/giris');
        │
        ▼
araclar/giris.js:       BASE = EE_BASE || 'http://localhost:3000'
                        LOG  = EE_LOG  || '<proje kökü>/sunucu.log'
                        module.exports = { BASE, LOG, iste, …, tcUret }
```

`BASE` ve `LOG` modül **ilk yüklendiğinde** ortam değişkenlerinden okunur. Bu yüzden `EE_BASE` ve `EE_LOG`'u testi başlatan
komutta vermelisin (`tumtest.sh` öyle yapar: `EE_BASE=http://localhost:3200 EE_LOG=testler/test-sunucu.log`); test
çalışırken `process.env`'i değiştirmek işe yaramaz.

## Dikkat!

- **Varsayılan adres 3000.** `EE_BASE` vermeden bir test çalıştırırsan bütün istekler `http://localhost:3000`'e, yani kendi
  (gerçek veritabanlı) sunucuna gider. Testleri her zaman `testler/tumtest.sh` ile ya da elle
  `EE_BASE=http://localhost:3200 EE_LOG=testler/test-sunucu.log` vererek çalıştır.
- **Burada değişiklik yapma, `araclar/giris.js`'te yap.** Bu dosyaya yardımcı eklenirse araçlar onu göremez; iki yer
  ayrışır. Yeni bir ortak yardımcı gerekiyorsa `araclar/giris.js`'e ekle ve orada dışa aç; testler kendiliğinden görür.
- **Bir değişiklik bütün takımı etkiler.** 46 test dosyası bu yoldan aynı yardımcıyı kullanır; `araclar/giris.js`'teki bir
  bozulma ilk sunuculu paketten itibaren "giriş 1. adım" ya da "Günlükte giriş kodu yok" hatalarıyla görünür.
- **`giris` adı üç yerde var.** `araclar/giris.js` asıl dosya, `testler/giris.js` bu kısa yol,
  `public/js/parcalar/05-giris.js` ise tarayıcıdaki giriş ekranı ([../public/js/parcalar/05-giris.md](../public/js/parcalar/05-giris.md)).
  Hata iletilerinde ve belgelerde hangisinin kastedildiğine bak.
- Bazı testler bu yardımcının yanında kendi küçük `iste`'sini ve `BASE`'ini de yazar ([seed.md](seed.md)'deki fırlatan
  `api`, [guvenlik-test.md](guvenlik-test.md)'deki kopya `iste`); onlar da aynı `EE_BASE` varsayılanını taşır.

## Testleri

- Kendi testi yok (içinde mantık yok). Doğru çalıştığını dolaylı olarak her sunuculu paket gösterir: `testler/tumtest.sh`
  her paketten önce [seed.md](seed.md)'yi çalıştırır, seed bu yoldan `girisYap`, `hesapAc`, `okulHesabi`, `mudurYap`'ı
  kullanır; bu dosya bozulursa (ör. yol yanlışsa) her paket "SEED BASARISIZ" olur.
- Elle (proje kökünde, sunucu gerekmez; dosya yüklenirken istek atılmaz):
  `node -e "console.log(Object.keys(require('./testler/giris')))"` → 15 ad: `BASE LOG iste sonKod sonOnayAnahtari
  epostaOnayla girisYap botCevabi hesapAc okulHesabi ogretmenYap kisiKodu kisilikGec mudurYap tcUret` (3 Ekim'de böyle çıktı).

## Son durum

- `git log`: tek commit. Dosya `139b8de commit 17` (2026-08-28) ile, `testler/test-giris-bilgisi.js` ve
  `testler/test-giris-kayit.js` ile birlikte 3 satır olarak eklendi; o günden beri değişmedi.
- Açık iş yok.
- Planlı işler bu dosyaya değil `araclar/giris.js`'e dokunacak (ayrıntısı [../araclar/giris.md](../araclar/giris.md) "Son
  durum"da): "Sistem" işindeki yöneticiye zorunlu doğrulama uygulaması (TOTP), "T.C. kimlik no bütün hesaplarda zorunlu",
  "Çalışan olarak ekleme", "Güvenlik denetimi"ndeki "okulun verdiği her şifre ilk girişte değişir". Bunlar değişince bu dosya
  aynı kalır ama onu kullanan 46 test dosyasının davranışı değişir.
