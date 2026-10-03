# testler/test-admin-gizli.js

Gizli yönetim panelinin (`/admin`) dışarıdan hiçbir yolla ayırt edilemediğini, yönetici çerezinin doğru verilip geri
alındığını, herkese giden `app.js`'in yönetim kodu taşımadığını ve `.md` belgelerinin web'den okunmadığını deneyen sunuculu
test paketi (52 denetim).

## Bu dosya ne yapar?

Sistem yöneticisinin ekranları herkese açık uygulamanın içinde değil, ayrı bir pakette durur ve yalnız `/admin`
adresinden açılır. İstenen şey şu: yönetici olmayan biri (tarayıcıyla gezen meraklı da, adres deneyen bir dizin tarayıcısı
da) `/admin` diye bir yer **olduğunu bile anlayamasın**. Bunun için `/admin`'in cevabı bilinmeyen herhangi bir adresin
cevabıyla bayt bayt aynı olmalı: durum kodu, başlıklar (sıraları ve `ETag` dahil), gövde, sıkıştırmalı ya da sıkıştırmasız.
Daha da ince olanı **süre**: `/admin` veritabanına ya da diske bilinmeyen adresten farklı sayıda gitseydi, cevap süresi onu
ele verirdi. Bu paket bütün bunları tek tek dener.

Denedikleri, sırasıyla:

1. Çerezsiz (ya da uydurma/biçimsiz çerezli) `/admin` ve altı bilinmeyen adresle aynı 404; ön yüz parça klasörleri de
   öyle; süre farkı yaratacak veritabanı ve disk erişimleri iki yolda da aynı sayıda.
2. (1b) Kod dosyalarının yanındaki `.md` belgeleri `public/` altında diskte dursa bile web'den okunmaz; bilinmeyen adresle
   aynı 404. Bu, belgeleme işinin "statik sunucu `.md` sunmaz" kuralının testi.
3. Yöneticiye girişte `HttpOnly`, `SameSite=Strict`, `Path=/admin` çerez verilir; yönetici olmayana çerez de `/admin`
   adresi de hiç gitmez.
4. Geçerli çerezle `/admin` yönetim kabuğunu, `/admin/yonetim.js` yönetim paketini verir; ikisi de önbelleğe alınmaz. Çerez
   API için hiçbir şey ifade etmez.
5. Herkese giden `/js/app.js` yönetim uçlarının adlarını ve `/admin` adresini taşımaz; `robots.txt` ve `/api/site` de
   adresi ele vermez.
6. `/api/me` çerezi yeniler; oturumun en yeni üç çerezi geçerlidir.
7. Çıkış, şifre değişimi ve oturum süresinin dolması çerezi geçersiz yapar.
8. Yönetici uçları (`/api/admin/...`, yorum yönetimi) yönetici olmayan herkese bilinmeyen API adresiyle aynı cevabı verir.

Asıl kod: [../sunucu/http.md](../sunucu/http.md) (statik sunucu ve `/admin` kapısı),
[../sunucu/yonetim-cerezi.md](../sunucu/yonetim-cerezi.md) (çerez), [../sunucu/api.md](../sunucu/api.md) (yönetici
uçlarının gizlenmesi), [../sunucu/bolumler/kayit.md](../sunucu/bolumler/kayit.md) (girişte, `/api/me`'de ve şifre
değişiminde çerez verme, çıkışta silme), [../sunucu/veri/depo/oturumlar.md](../sunucu/veri/depo/oturumlar.md) (çerezlerin
saklanması).

## İçinde neler var?

### Yardımcılar

- `kontrol(ad, sart, detay)` — `GECTI`/`KALDI` satırı yazar ve sayar. `J(x)` — kısaltılmış JSON (260 harf).
- `TABAN` — `EE_BASE` ya da `http://localhost:3000` (`URL` nesnesi).
- `ham(yol, yontem, baslik)` — Node'un `http.request`'iyle tek istek. `fetch` kullanılmaz, çünkü burada başlıkların
  **sırası** (`rawHeaders`) ve gövdenin **ham baytları** (sıkıştırılmışsa açılmadan) gerekir. Döner:
  `{ durum, ham, baslik, govde: Buffer }`. Yol olduğu gibi gider (`%00`, `::$DATA` gibi bozuk yollar da).
- `basliklar(h)` — `rawHeaders`'tan karşılaştırılacak metin: `Date`, `Connection`, `Keep-Alive` dışındaki her başlık,
  geldiği sırayla.
- `ayniMi(a, b)` — durum, başlık metni ve gövde baytları aynı mı. `farkAnlat(a, b)` — ilk farkı yazı olarak verir (durum,
  başlık ya da gövde uzunluğu); `KALDI` satırında görünür.
- `testDeposu()` — testin kendi sürecinden test veritabanına bağlanır: `process.env.EE_DATA`'yı `testler/testdata`'ya
  çevirir, `sunucu/ayarlar.js`'in `ayarlariYukle()`'sini çağırır, `sunucu/veri/baglanti.js`'i yükler; veritabanının adı
  `_test` ile bitmiyorsa `null` döner ve paket hemen `KALDI  test veritabanı değil` yazıp 1 ile çıkar. Bitiyorsa
  `{ baglanti, oturumlar }` (`sunucu/veri/depo/oturumlar.js`).
- `yoneticiGirisi(eposta, sifre)` — iki adımlı girişi elle yapar, çünkü iki adımın **cevap başlıkları** da gerekir:
  `botCevabi()` → `POST /api/login` (`a1`); cevapta `twoFactor` varsa `POST /api/login/dogrula` kodu `sonKod(eposta)`'dan
  (sunucu günlüğü) alarak (`a2`). Döner `{ a1, a2 }` (tek adımlıysa `a2 = a1`).
- `cerezAl(r)` — cevabın `Set-Cookie`'sinden `ee_yonetim=<hex>`'i çıkarır: `{ ham, deger, cerez }` (`cerez` istek
  başlığına konacak `ee_yonetim=…` metni).

Ortak giriş yardımcıları [giris.md](giris.md) üzerinden gelir: `iste`, `girisYap`, `botCevabi`, `sonKod`, `hesapAc`.

### 1) Çerezsiz `/admin` = bilinmeyen adres (8 denetim)

On bir çift adres, dört kodlama (`Accept-Encoding` yok, `gzip`, `br`, `gzip, deflate, br`) ve iki yöntemle (GET, HEAD)
**88 deneme**; her denemede iki adres aynı anda istenir ve sonuç 404 ve bayt bayt aynı olmalı:

| Gizli taraf | Karşılaştırılan bilinmeyen adres |
|---|---|
| `/admin`, `/admin/`, `/ADMIN`, `/admin?x=1`, `/admin%00` | `/olmayan-sayfa`, `/olmayan-sayfa/`, `/OLMAYAN`, `/olmayan-sayfa?x=1`, `/olmayan%00` |
| `/admin/yonetim.js`, `/admin/site-ayarlari`, `/admin/a/b/c.html`, `/admin/.env` | `/olmayan-klasor/...` karşılıkları |
| `/js/yonetim/09-yonetici.js`, `/js/parcalar/06-menu.js` (parça klasörleri) | `/js/olmayan/09-yonetici.js`, `/js/olmayan/06-menu.js` |

Sonra: `/admin`'in gövdesi "Sayfa bulunamadı" sayfası, `Cache-Control: no-store` ve `ETag` var; `POST /admin` ile
`POST /olmayan-sayfa` ikisi de 405 ve aynı; biçimli ama uydurma çerezle (`ee_yonetim=` + 64 onaltılık hane) ve biçimsiz
çerezle (`ee_yonetim=xyz`) de aynı 404.

**Süre farkı denetimi (süre ölçülmez, erişim sayılır).** Kod yorumunun dediği gibi süre makineye bağlı olduğu için
ölçülmez; onun yerine sunucunun statik kodu (`sunucu/http.js` → `serveStatic`) testin kendi sürecinde sahte istek ve cevap
nesneleriyle çalıştırılır ve iki şey sayılır:

- Veritabanında çerez araması: `depo.oturumlar.yonetimCereziSahibi` geçici olarak sayan bir sarmalayıcıyla değiştirilir.
- Disk yoklaması: `fs.stat` da geçici olarak sayan bir sarmalayıcıyla değiştirilir.

Beklenen (sonuç `durum:arama sayısı`):

| İstek | Çerez | Beklenen |
|---|---|---|
| `/admin`, `/olmayan-sayfa`, `/.env`, `/js/parcalar/06-menu.js` | uydurma biçimli | hepsi `404:1` (bir arama) |
| `/admin`, `/olmayan-sayfa` | yok ya da biçimsiz | hepsi `404:0` (veritabanına hiç gitmez) |
| `/admin` ↔ `/olmayan-sayfa`, `/admin/site-ayarlari` ↔ `/olmayan-klasor/site-ayarlari` | yok / uydurma | `fs.stat` sayıları eşit ve `/admin`'de sıfırdan büyük |

Ölçümden sonra iki sarmalayıcı da asıl işlevlere geri döndürülür.

### 1b) Belgeler (`.md`) web'den okunmaz (4 denetim)

`public/`, `public/js/` ve `public/kvkk/` altına `zz-belge-denetimi-<süreç no>.md` adlı geçici belgeler, `public/` altına da
karşılaştırma için aynı adlı bir `.txt` yazılır. Önce `.txt`'nin 200 geldiği görülür (sunucu gerçekten bu klasörden
okuyor). Sonra on altı adres × dört kodlama × iki yöntem = **128 deneme**, her biri `/olmayan-belge-sayfasi` ile bayt bayt
aynı 404 olmalı:

- diskte gerçekten olan belgeler: `/js/belge.md`, `/js/parcalar/05-giris.md` ve geçici `.md`'ler;
- `public/` dışında duran ya da hiç olmayanlar: `/TANITIM.md`, `/tanitim.md`, `/sunucu/api.md`, `/kvkk/x.md`;
- Windows'un aynı dosyayı açtığı yazılışlar: `.MD`, sondaki nokta (`.md.`), sondaki boşluk (`.md%20`), `.md::$DATA`, sondaki
  `/`, `%2Emd`, sorgu dizesi (`.md?v=1`).

Uydurma çerezle `.md` de aynı 404. En sonda (`finally` içinde ve ayrıca `process.on('exit')`'te) geçici dosyalar silinir ve
silindiği denetlenir.

### 2) Yönetici girişi: çerez (9 denetim)

- Yöneticinin şifre adımında (`a1`) `Set-Cookie` YOK; kod adımında (`a2`) 64 onaltılık haneli `ee_yonetim` çerezi var.
- Çerez `HttpOnly`, `SameSite=Strict`, `Path=/admin` ve `Max-Age` taşıyor; test sunucusu http olduğu için `Secure` YOK
  (https'te olur; bkz. [test-ayarlari.md](test-ayarlari.md): test klasörüne site adresi gitmez).
- Giriş cevabında `yonetimAdresi: '/admin'`.
- Öğretmen (iki adımlı): çerez yok, `yonetimAdresi` yok, cevabın hiçbir yerinde `/admin` yok. Öğrenci (tek adım): çerez
  yok. Öğretmenin `/api/me`'sinde çerez ve `/admin` yok; öğretmenin çıkışında çerez silme başlığı da yok (silme başlığı bile
  adresi ele verirdi).

### 3) Geçerli çerezle panel (10 denetim)

- `GET /admin` → 200, `text/html`, `id="authWrap"` (uygulamanın kabuğu); içinde `"/admin/yonetim.js?v=<hex>"` var,
  `"/js/app.js` YOK.
- Kabuk `Cache-Control: no-store`, `X-Robots-Tag` içinde `noindex`, `ETag` YOK.
- `/admin/site-ayarlari/alt` aynı kabuk (gövde aynı); `HEAD /admin` 200 ve gövdesiz.
- `/admin/yonetim.js` 200, `javascript` türünde, 1000 bayttan büyük ve `vm.Script` ile **derleniyor** (sözdizimi hatası
  yok); `no-store`; `gzip` istenince sıkıştırılmış ve daha küçük.
- Yalnız çerezle `GET /api/me` → 401 (API çereze bakmaz, yalnız `Authorization`); yalnız çerezle
  `GET /api/admin/overview` → 404 `{"error":"Böyle bir adres yok"}`.

### 4) Herkese giden `app.js` yönetim kodu taşımıyor (5 denetim)

`public/js/yonetim/` klasörü varsa (bugün var): `/js/app.js`'te şu dizelerin hiçbiri geçmiyor — `/admin`,
`yorumlar/hepsi`, `yorumlar/gizle`, `backup-restore`, `site-ayarlari`, `yonetici-dosyasi`, `okul-adresleri`,
`okul-disk-siniri`; `/admin/yonetim.js`'te `/admin/` geçiyor; yönetim paketi `app.js`'ten büyük (uygulama parçaları +
yönetim parçaları). Klasör yoksa üç denetim yerine `ATLANDI` satırı yazılır. Ardından: `robots.txt` 404 ya da içinde
`admin` yok; `GET /api/site`'nin JSON'unda `admin` yok.

### 5) `/api/me` çerezi yeniler (4 denetim)

Yönetici dört kez `/api/me` çağırır, her cevaptan yeni çerez alınır. İlk cevapta `yonetimAdresi` ve çerez var; en yeni
çerez ve ondan önceki iki çerez geçerli (aynı anda açık iki sekme birbirini düşürmesin); daha eskiler (ilk `/api/me`
çerezi ve 2. bölümdeki giriş çerezi) geçersiz, çünkü oturum başına en yeni üç çerez saklanır (`YONETIM_CEREZ_SAKLA`).
Geçerlilik `/admin`'in 200 dönmesiyle ölçülür.

### 6) Çıkış (2 denetim)

`POST /api/logout` cevabında `ee_yonetim=;` … `Max-Age=0` … `Path=/admin`; çıkıştan sonra en yeni çerezle `/admin`
yine bilinmeyen adresle bayt bayt aynı 404.

### 7) Şifre değişince (4 denetim)

Yönetici yeniden girer (yeni çerez geçerli); `POST /api/password` ile şifresini uydurma bir test şifresine çevirir —
cevapta yeni çerez ve `yonetimAdresi` var; girişteki çerez geçersiz, yenisi geçerli; sonra şifreyi ikinci bir uydurma
şifreye çevirir (200).

### 8) Oturum süresi dolunca (2 denetim)

Son çerez geçerli; `depo.oturumlar.geriTarihle(anahtar, 8)` oturumun açılışını 8 gün geri çeker (tarayıcı oturumu 7 gün);
çerez artık geçersiz.

### 9) Yönetici uçları yönetici olmayana bilinmeyen adres (3 denetim)

Yeni bir rolsüz yetişkin hesabı açılır (`hesapAc`, adı `rolsuz<zaman>`). Beş kişi — giriş yapmamış, öğrenci, öğretmen,
müdür, rolsüz yetişkin — × on üç uç = **65 karşılaştırma**: `GET /api/admin/overview`, `GET`/`POST
/api/admin/site-ayarlari`, `GET /api/admin/yonetici-dosyasi`, `POST /api/admin/yonetici-dosyasi/oku`,
`POST /api/admin/okul-adres`, `GET /api/admin/okul-adresleri`, `POST /api/admin/backup-restore`,
`POST /api/admin/okul-disk-siniri`, `GET /api/admin/olmayan-alt-uc`, `GET /api/yorumlar/hepsi`, `POST /api/yorumlar/gizle`,
`GET /api/admin`. Her biri aynı kişi, aynı yöntem ve aynı gövdeyle (`POST`'ta `{ anahtar: 'iletisim', deger: {} }`)
`/api/boyle-bir-uc-yok`'a giden istekle karşılaştırılır: durum, JSON gövde ve `Content-Type` aynı olmalı; bilinmeyen adres
404 aldıysa yönetici ucu da 404 almalı. (Kod yorumu: şifresini değiştirmesi gereken kişi ikisinde de 403 alır; yani kural
"hep 404" değil, "bilinmeyen adresin aldığının aynısı".) Ayrıca bilinmeyen adresin cevabı tam olarak
`404 {"error":"Böyle bir adres yok"}` ve rolsüz kişinin var olan bir okul ucu (`/api/school/students`) hâlâ
`403 { rolsuz: true }` (gizleme rolsüz kapısını bozmamış).

### Kapanış (1 denetim)

Yöneticinin şifresi, test sunucusunun açılışta kurduğu ilk şifreye (`tumtest.sh`'in verdiği `EE_ADMIN_SIFRE`; seed ve öbür
paketler de bu şifreyle girer) **doğrudan veritabanından** geri konur (`sunucu/sifre.js` → `hashPw`,
`sunucu/veri/depo/kullanicilar.js` → `guncelle`) ve o şifreyle giriş denenir. Sonra veritabanı bağlantısı kapatılır
(`baglanti.kapat()`), `GECTI: N   KALDI: M` yazılır; `KALDI` varsa çıkış kodu 1. Beklenmeyen bir hata `TEST HATASI:` ile
iletiyi ve yığını yazar, çıkış kodu 1.

## Kimle konuşur?

- **Modüller:** `fs`, `path`, `http`, `vm`; [giris.md](giris.md) → `araclar/giris.js`. Testin kendi sürecinde doğrudan
  yüklenen sunucu dosyaları: `sunucu/ayarlar.js` ([../sunucu/ayarlar.md](../sunucu/ayarlar.md)),
  `sunucu/veri/baglanti.js` ([../sunucu/veri/baglanti.md](../sunucu/veri/baglanti.md): `veritabaniAdi`, `kapat`),
  `sunucu/veri/depo/oturumlar.js` ([../sunucu/veri/depo/oturumlar.md](../sunucu/veri/depo/oturumlar.md):
  `yonetimCereziSahibi` — sayılır, `geriTarihle`), `sunucu/http.js` ([../sunucu/http.md](../sunucu/http.md):
  `serveStatic`), `sunucu/sifre.js` ([../sunucu/sifre.md](../sunucu/sifre.md): `hashPw`),
  `sunucu/veri/depo/kullanicilar.js` ([../sunucu/veri/depo/kullanicilar.md](../sunucu/veri/depo/kullanicilar.md):
  `guncelle`).
- **Sunucu uçları ve adresler:**

  | Uç / adres | Ne için | Belge |
  |---|---|---|
  | `/admin`, `/admin/...`, `/admin/yonetim.js`, bilinmeyen adresler, `/js/...`, `/robots.txt`, `.md` adresleri | 404 eşitliği, kabuk, paket | [../sunucu/http.md](../sunucu/http.md), [../sunucu/yonetim-cerezi.md](../sunucu/yonetim-cerezi.md) |
  | `POST /admin` (405) | statik olmayan yöntem | [../sunucu/index.md](../sunucu/index.md) |
  | `GET /api/challenge`, `POST /api/login`, `POST /api/login/dogrula`, `GET /api/me`, `POST /api/logout`, `POST /api/password` | çerez verme, yenileme, silme | [../sunucu/bolumler/kayit.md](../sunucu/bolumler/kayit.md) |
  | `POST /api/register`, `POST /api/eposta-onay` | rolsüz hesap (`hesapAc`) | [../sunucu/bolumler/kayit.md](../sunucu/bolumler/kayit.md) |
  | `GET /api/site` | adres sızmıyor mu | [../sunucu/site.md](../sunucu/site.md) |
  | `/api/admin/...` | gizlenen yönetici uçları | [../sunucu/api.md](../sunucu/api.md), [../sunucu/bolumler/yonetici.md](../sunucu/bolumler/yonetici.md), [../sunucu/bolumler/site-ayarlari.md](../sunucu/bolumler/site-ayarlari.md), [../sunucu/bolumler/okul-disk.md](../sunucu/bolumler/okul-disk.md) |
  | `GET /api/yorumlar/hepsi`, `POST /api/yorumlar/gizle` | yorum yönetimi (yönetici ucu sayılır) | [../sunucu/bolumler/yorum.md](../sunucu/bolumler/yorum.md) |
  | `GET /api/school/students` | rolsüz kapısı | [../sunucu/bolumler/okul.md](../sunucu/bolumler/okul.md) |

- **Hesaplar:** Matematik öğretmeni (`mat`), müdür (`mudur`), öğrenci (`ogrenci1`) — seed'in açtığı hesaplar ve test
  şifreleri ([seed.md](seed.md)). Yönetici (`admin`) seed'in değil, test sunucusunun kendi hesabıdır: sunucu açılırken hiç
  yönetici yoksa ilk yöneticiyi `EE_ADMIN_SIFRE` şifresiyle açar (`sunucu/veri/index.js` → `baslat`,
  [../sunucu/veri/index.md](../sunucu/veri/index.md)). Paket ayrıca bir rolsüz yetişkin açar.
- **Tablolar** (dolaylı; çerez araması ve kapanıştaki şifre doğrudan): `oturumlar`, `yonetim_cerezleri`, `kullanicilar`.
- **Koruduğu ön yüz:** `public/404.html` (bilinmeyen adreslerin, gizli dosyaların, parça klasörlerinin, `.md`'lerin ve
  çerezsiz `/admin`'in ortak 404 gövdesi; yalnız olmayan okul adresi kendi `okul-bulunamadi.html`'ini alır),
  `public/index.html` (yönetim kabuğunun kaynağı), `public/js/yonetim/*.js` ([../public/js/yonetim/09-yonetici.md](../public/js/yonetim/09-yonetici.md) ve kardeşleri:
  yalnız yönetim paketine girer), `public/js/parcalar/*.js` (herkese giden `app.js`; ör.
  [../public/js/parcalar/05b-sifre-zorunlu.md](../public/js/parcalar/05b-sifre-zorunlu.md) `/admin`'i sabit yazmaz, sunucunun
  verdiği `yonetimAdresi`'ni kullanır).
- **Onu çalıştıran:** `testler/tumtest.sh`, sunuculu paket döngüsünde (`test-yonetici-dosyasi`'ndan sonra,
  `test-site-ayarlari`'ndan önce); her pakette olduğu gibi önce sıfırlanmış veritabanı ve [seed.md](seed.md).

## Nasıl çalışır (adım adım)?

```
testDeposu()  ── test veritabanı mı (_test)? ── hayır ─► KALDI, çıkış 1
1)  ham(/admin…) ∥ ham(/olmayan…)   × 4 kodlama × GET/HEAD   → 88 eşitlik
    POST, uydurma çerez, biçimsiz çerez
    test sürecinde: yonetimCereziSahibi ve fs.stat SAYAÇLA sarılır
        serveStatic(sahte istek) ─► "404:1" / "404:0" + stat sayıları eşit mi ─► sarmalayıcılar geri
1b) public/ altına geçici .md/.txt ─► .txt 200 ─► 16 .md adresi × 4 × 2 = 128 eşitlik ─► sil
2)  yoneticiGirisi(yönetici): a1 çerezsiz, a2 ee_yonetim (HttpOnly, Strict, Path=/admin, Max-Age, Secure yok)
    öğretmen, öğrenci: çerez ve /admin yok
3)  çerezle /admin (kabuk), /admin/yonetim.js (derlenir, gzip); çerez /api'de işe yaramaz
4)  app.js'te yönetim dizeleri yok; robots.txt, /api/site
5)  /api/me × 4 ─► en yeni 3 çerez geçerli, eskiler değil
6)  logout ─► Max-Age=0 ─► eski çerez = bilinmeyen adres
7)  yeniden giriş ─► şifre değiştir ×2 ─► eski çerez geçersiz
8)  geriTarihle(oturum, 8 gün) ─► çerez geçersiz
9)  rolsüz hesap aç; 5 kişi × 13 uç ↔ /api/boyle-bir-uc-yok  → 65 eşitlik
    yönetici şifresi veritabanından geri ─► giriş dene ─► bağlantıyı kapat ─► GECTI/KALDI
```

## Dikkat!

- **Paket çalışırken `public/` altına dosya yazar.** 1b bölümü üç geçici `.md` ve bir `.txt` oluşturur
  (`zz-belge-denetimi-<süreç no>.*`). `finally` ve `process.on('exit')` siler; ama süreç zorla öldürülürse (ör. `taskkill
  /F`) dosyalar kalabilir: `git status`'ta izlenmeyen dosya olarak görünür, elle sil. O birkaç saniye içinde aynı
  `public/` klasöründen sunan başka bir sunucu (ör. 3000'deki kendi sunucun) da `.txt`'yi verir; zararsızdır.
- **Süre farkı sayılarak ölçülür, testin kendi sürecinde.** 1. bölümdeki arama/stat sayımı 3200'deki sunucuda değil, test
  sürecine ayrıca yüklenen `sunucu/http.js` üzerinde yapılır (aynı test veritabanına bağlanır). Yani kanıtlanan,
  kodun davranışıdır. Sayım iki varsayıma dayanır: `sunucu/yonetim-cerezi.js` işlevi her çağrıda
  `depo.oturumlar.yonetimCereziSahibi(...)` diye nesne üzerinden çağırıyor ve `sunucu/http.js` `fs.stat(...)`'ı `fs`
  nesnesi üzerinden çağırıyor. Biri ileride işlevi yükleme anında bir değişkene alırsa (`const { yonetimCereziSahibi } =
  ...`) sayaç hiç artmaz ve bu denetim, ortada bir sızıntı yokken kalır. Yeniden düzenlemede buna dikkat et.
- **Yönetici şifresi API'den geri konamaz.** Test sunucusunun yöneticiye verdiği ilk şifre (`EE_ADMIN_SIFRE`) yetişkin
  şifre kuralını (büyük harf, özel karakter; `sunucu/ortak.js` → `sifreSorunu`) karşılamaz; `POST /api/password` onu yeni
  şifre olarak kabul etmez. Bu yüzden kapanışta şifre depo üzerinden doğrudan yazılır. Paket 7. bölümle kapanış
  arasında çökerse yöneticinin şifresi uydurma ikinci şifrede kalır. `tumtest.sh` her paketten önce
  veritabanını sıfırladığı için sorun olmaz; ama birden çok paketi tek seed'le aynı sunucuda koşturuyorsan sonraki
  paketlerin yönetici girişi bozulur — veritabanını sıfırla.
- **`robots.txt` denetimi bugün kendiliğinden geçiyor:** `public/robots.txt` yok, 404 dönüyor. "Arama motorunda görünme"
  işi `robots.txt` eklediğinde dosyada `admin` sözcüğü hiç geçmemeli — `Disallow: /admin` yazmak bile adresi ele verir ve
  bu test kalır.
- **`/api/site` denetimi metin aramasıdır.** JSON'un herhangi bir yerinde `admin` geçerse kalır. Test sunucusunda iletişim
  bilgisi boş olduğu için sorun yok; ama yapımcılar listesine ya da varsayılan bir metne `admin` içeren bir şey girerse bu
  denetim, sızıntı olmasa da kalır.
- **`app.js` denetimi de metin aramasıdır.** `/admin` alt dizesi `app.js`'teki her `/admin/...` API yolunu yakalar; ama
  `/admin` altında olmayan yeni bir yönetici ucu (ör. `yorumlar/...` gibi) listeye ayrıca eklenmezse `app.js`'e sızsa da
  fark edilmez. Tersine, yönetimle ilgisi olmayan bir yerde listedeki bir sözcüğü (ör. `site-ayarlari`) kullanmak da testi
  kaldırır. Yeni yönetici ucu eklerken hem bu listeye hem 9. bölümdeki `uclar` listesine ekle.
- **9. bölümün öğrencisi 2. bölümün oturumudur.** Öğrenci 2. bölümde girer ve çıkmaz; öğretmen 2. bölümde çıkış yaptığı
  için 9. bölümde yeniden girer. Bölümlerin sırasını değiştirirken buna bak.
- **`yoneticiGirisi` iki adım bekler.** Yönetici tek adımda girseydi (`twoFactor` gelmeseydi) `a2 = a1` olur ve "şifre
  adımında çerez yok" denetimi kalırdı; bugün yöneticiye her zaman iki adımlı giriş uygulanıyor.
- **Varsayılan adres 3000.** `EE_BASE` vermeden çalıştırırsan istekler kendi sunucuna gider; ayrıca `testDeposu` test
  veritabanını `testler/testdata/ayarlar.json`'dan bulur. Her zaman `tumtest.sh` ya da aşağıdaki elle koşma yolu.
- `ATLANDI` satırı sayılmaz: `public/js/yonetim/` olmasaydı 4. bölümde üç denetim eksik kalır, `GECTI` 49 olurdu.

## Testleri

- Bu dosyanın kendisi testtir; `testler/tumtest.sh` onu her tam koşuda çalıştırır. Koruduğu kod yukarıda ("Kimle
  konuşur?"). Aynı alanı tamamlayan öbür paketler: [guvenlik-test.md](guvenlik-test.md) (güvenlik başlıkları, yol kaçışı,
  ön yüz parçalarının web'den okunamaması), `testler/test-yonetici-dosyasi.js` (şifresini değiştirmemiş yönetici `/admin`
  çerezini ve adresini almaz, değiştirince alır), `testler/test-site-ayarlari.js` (site ayarları uçları),
  [yetki-denetimi.md](yetki-denetimi.md) (her uç × her rol).
- Elle (Git Bash, proje kökünde; 3200'de `tumtest.sh`'teki ortamla açılmış, sıfırlanmış ve seed'lenmiş test sunucusu
  varken):

  ```
  EE_BASE=http://localhost:3200 EE_LOG=testler/test-sunucu.log node testler/test-admin-gizli.js
  ```

- 3 Ekim sabahı bu belge için 3200'de, sıfırlanmış `egitimevi_test` ve seed'le koşuldu: `GECTI: 52   KALDI: 0`, yaklaşık 6
  saniye (seed dahil); 1. bölümde 88, 1b'de 128, 9. bölümde 65 karşılaştırma; sunucu günlüğünde `API hatası` yok;
  geçici dosyalar silinmişti (`git status` temiz).
- Elle tarayıcıda: çerezsiz `/admin`'i aç → "Sayfa bulunamadı"; yöneticiyle gir → giriş sonrası tam sayfa `/admin`'e
  geçer; geliştirici araçlarında `ee_yonetim` çerezinin `HttpOnly` ve `Path=/admin` olduğunu gör.

## Son durum

- `git log`: 3 commit.
  - `920986f commit 526` (2026-09-27, belgelemenin 1. parçası): 1b bölümü eklendi — `public/` altına geçici `.md`/`.txt`
    yazıp on altı `.md` adresinin (Windows'un `::$DATA`, sondaki nokta/boşluk biçimleri dahil) bilinmeyen adresle bayt bayt
    aynı 404 verdiğini, uydurma çerezle de aynı kaldığını ve geçici dosyaların silindiğini deneyen dört denetim; dosya başı
    yorumuna ".md belgeleri" eklendi. Aynı commit `sunucu/http.js`'e `.md` kapısını (`BELGE_DOSYASI`) getirdi.
  - `40fc7e7 commit 525` (2026-09-27, okul disk sınırı): `okul-disk-siniri` hem `app.js`'te geçmemesi gereken dizelere
    hem 9. bölümün uç listesine (`POST /api/admin/okul-disk-siniri`) eklendi.
  - `276c0a0 commit 521` (2026-09-27, yönetim paneli): dosya 308 satır olarak eklendi (1–9. bölümler).
- Açık iş yok; bilinen zayıflıklar yukarıda (`robots.txt`'nin bugün kendiliğinden geçmesi, metin aramalı denetimler,
  sarmalayıcıya dayanan sayım).
- Planlı işlerden bu dosyayı etkileyecekler:
  - **"Paneller (/panel/admin ve /panel/destek) …"** — yönetim paneli `/panel/admin`'e taşınacak; `/admin` kendisi
    bilinmeyen adres olacak; `/panel`, `/panel/...`, `/duzenle`, `/duzenle/...` yetkisi olmayana bayt bayt aynı 404
    verecek; çerez `Path`'i `/panel` ve `/duzenle`'yi kapsayacak; yeni "destek" rolü kendi paneline girip yöneticininkine
    giremeyecek; herkese giden `app.js`'te `/panel` adresi ya da "Yönetim" sabit metni olmayacak (alt bilgideki "Yönetim"
    düğmesi yalnız yönetici/destek için, otomatik yönlendirme yok). Tanım bu testin genişletileceğini açıkça yazıyor:
    adresler, çerez yolu, destek rolü ve yasak dizeler değişir.
  - **"Sistem"** (yöneticiye zorunlu doğrulama uygulaması, TOTP) — `yoneticiGirisi` bugün kodu sunucu günlüğünden okuyor;
    TOTP gelince kodu testin kendisi üretmeli. Aynı işin yeni yönetici uçları (bakım modu, site duyurusu, sistem durumu,
    açık oturumlar…) 9. bölümdeki listeye eklenmeli.
  - **"Kullanıcı arama … hesap penceresinde yöneticinin ve desteğin şifre … işlemleri"** — yeni yönetici/destek uçları;
    aynı şekilde gizlenmeleri bu pakete eklenmeli.
  - **"Arama motorunda görünme"** (`robots.txt`, `sitemap.xml`) — yukarıdaki `robots.txt` uyarısı.
