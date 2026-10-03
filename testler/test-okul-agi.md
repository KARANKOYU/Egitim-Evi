# testler/test-okul-agi.js

"Okulun ağı" yük ve saldırı paketi (59 denetim): 300 öğrenci aynı ağdan (tek IP) birkaç saniye içinde okul sayfasını açıp
girer ve ana sayfa, Ödevler, Program'ı gezer; hiçbiri 429, 503 ya da kopan bağlantı almamalı. Ardından tek kötü niyetli kişinin
(oturumdan sel, şifre denemesi, şifre taraması, oturumsuz sel) yine durdurulduğunu, sonda da giriş ve genel istek sınırlarının
kendisini sunucusuz gösterir.

## Bu dosya ne yapar?

Bir okulda bütün öğrenciler okulun ağından girer: dışarıdan bakınca hepsi **tek bir IP** (NAT). Birinci derste 300 öğrenci
aynı dakikada tabletini açar, okulun sayfasına gelir, şifresini yazar. IP başına dar bir hız sınırı ("dakikada 100 istek" gibi)
bütün okulu durdururdu. Eğitim Evi bu yüzden sınırları okul ölçeğinde tutar ve asıl korumayı hesaba ve oturuma koyar
([../sunucu/guvenlik.md](../sunucu/guvenlik.md), [../sunucu/index.md](../sunucu/index.md)). Ama sınırları gevşetmek kolay;
gevşek sınırın kötü niyetli birini hâlâ durdurduğunu göstermek zor. Bu paket ikisini birden yapar:

1. **Okul ağı senaryosu:** 300 öğrenci tarayıcıda ölçülmüş gerçek istek dizisiyle, her biri kendi 6 bağlantısıyla, 5 saniyeye
   yayılarak girer. 30'u şifresini önce yanlış yazar. Kimse "çok fazla istek" ya da "sunucu yoğun" görmemeli.
2. **Saldırılar:** tek oturumdan sel, tek hesaba şifre denemesi, bir hesaba birçok bağlantıdan deneme (hedefli kilit), çok
   hesaba şifre taraması (üç çeşit bağlantıdan), oturumsuz sel. İlk ikisi okulun kendi ağından, öbürleri ayrı bağlantılardan
   yapılır; her birinde saldırganın durduğu, okulun ağındaki öbür öğrencilerin ya da hesabın sahibinin etkilenmediği gösterilir.
3. **Sunucusuz:** aynı sınırlar `sunucu/guvenlik.js` bu sürecin içine yüklenip bellekte, birçok uydurma IP ile denenir.

Bağlantıları ayırmak için bir hile kullanılır: bütün `127.0.0.0/8` geri döngüdür. Okulun ağı `::1`, "dışarıdaki başka bir
bağlantı" `127.0.0.1`, öbür saldırgan bağlantılar `127.0.0.N` kaynak adresinden gelir; sunucu her birini ayrı IP olarak görür.

## İçinde neler var?

### Ortam değişkenleri ve sabitler

| Ad | Ne | Varsayılan |
|---|---|---|
| `EE_AG_OLCUM=1` (`OLCUM`) | uzun ölçüm: 10 sn yayılma, daha gerçekçi bekleme | kapalı |
| `EE_AG_KISI` (`KISI`) | öğrenci sayısı (dosya başı yorumunda geçmez) | 300 |
| `EE_AG_YAYILMA_MS` (`YAYILMA_MS`) | girişlerin yayıldığı süre | 5000 (ölçümde 10000) |
| `EE_AG_SALDIRI=0` (`SALDIRI`) | saldırı bölümlerini kapatır | açık |
| `EE_AG_VEKIL=1` (`VEKIL`) | sunucu ters vekil arkasındaymış gibi: her isteğe `X-Forwarded-For` | kapalı |

- `PORT` — `BASE`'in (giris.js: `EE_BASE` ya da `http://localhost:3000`) portu. Bütün istekler bu porta, aşağıdaki adreslere gider.
- `OKUL_IP = '::1'` (okulun ağı), `DIS_IP = '127.0.0.1'` (başka bir bağlantı), `SIFRE` (300 öğrencinin ortak test şifresi).
- `VEKIL_IP` — vekil kipinde başlığa yazılan adresler: okul `85.105.1.1`, öbür bağlantı `85.105.9.9`; `127.0.0.N` → `85.105.50.N`.
- `tohum`, `rastgele()`, `aralik(a, b)` — sabit tohumlu (20260927) basit rastgele üreteç: her koşuda aynı yayılma, aynı bekleme.

### Yardımcılar

- `kontrol`, `J(x)` (300 karakterlik JSON), `bekle(ms)`.
- `testDeposu()` — `EE_DATA`'yı `testler/testdata` yapar, ayarları oradan yükler; veritabanının adı `_test` ile bitmiyorsa `null`
  (paket hiçbir şeye dokunmadan "test veritabanı değil" deyip 1 ile çıkar), bitiyorsa `sunucu/veri/baglanti`.
- `istek(ajan, host, yol, sec, olcum)` — paketin kendi HTTP istemcisi (Node `http.request`). `Accept-Encoding: br, gzip` ister ve
  cevabı açar (gövdeyi yalnız `sec.oku`, 400 ve üstü ya da JSON'da okur), `sec.json` gövdesi, `sec.token` oturumu, vekil kipinde
  `X-Forwarded-For`. 30 saniyede cevap yoksa keser (`ZAMAN_ASIMI`). Ölçüm nesnesine istek sayısını (API / dosya ayrımıyla; okul
  fotoğrafları dosya sayılır, sunucuda da öyle), durum kodlarını, 429'u hangi sınırın verdiğini, bağlantı hatalarını, aynı anda
  süren API isteğini, açık soket sayısını ve süreleri yazar. Döner: `{ durum, metin, json }` ya da hata `{ durum: 0, hata }`.
- `adres(host)` — `127.0.0.N` (N ≥ 2) için `127.0.0.1`'e `127.0.0.N` **kaynak adresinden** bağlanılır (`localAddress`).
- `sinirAdi(yol, govde)` — 429'un adı: cevaptaki `sinir` alanı ("genel oturum/ip/dosya"), `kilitli`, iletiden ya da yoldan
  (okul adresi, okul fotoğrafı, doğrulama sorusu).
- `soruCevabi(soru)` — "a + b" doğrulama sorusunu çözer (betik soruyu kolayca çözer; asıl koruma sayılardır).
- `yeniOlcum()`, `yuzdelik(dizi, p)`, `senaryoYaz(ad, o)` (sonuç tablosu ve tek satır `OLCUM {…}` JSON).

### Bir öğrencinin sayfa açılışı: `ogrenci(i, o)`

Tarayıcıda ölçülmüş dizi (okul adresinden ilk açılış, tarayıcı önbelleği boş). Her öğrencinin kendi `http.Agent`'ı vardır:
`keepAlive`, en çok 6 bağlantı (vekil kipinde herkes 512 bağlantılık ortak bir havuzdan geçer). Kullanıcı adı `agogr<i+1>`.

1. `GET /school/<kısa ad>`; sayfadaki `?v=` sürümleriyle `tema.js`, `style.css`, `app.js` ve iki Plex yazı tipi.
2. `app.js` çalıştı: `GET /api/meta`, `/api/okul-adres?kisa=`, `/api/site`, iki Newsreader yazı tipi, `manifest.json`,
   `simge-192.png?v=2`; okul sayfasının fotoğrafları (`/api/okul-foto/<id>`, 6 tane).
3. Servis çalışanı: `/sw.js` ve kurulumda istediği 7 adres (`public/sw.js`'teki `KABUK` listesinden yazı tipleri ve `simge-192`
   dışında kalanlar: `/`, `/index.html`, `/css/style.css`, `/js/tema.js`, `/js/app.js`, `/manifest.json`, `/simge-512.png?v=2`).
4. Yazma beklemesi (800–1600 ms; ölçümde 2000–4000), `POST /api/login { kimlik, password, okul }`. Her onuncu öğrenci
   (`i % 10 === 5`, 300'de 30 kişi) önce yanlış şifre yazar: 401 (ya da 400 `soruGerekli`) görülürse sayılır, sonra
   `GET /api/challenge`, yeniden bekleme ve soruyu çözerek doğru şifre.
5. Ana sayfa: `GET /api/egitim-yili`, `/api/site`, `/api/progress`, `/api/notifications`; gezinme beklemesi (400–800 ms; ölçümde
   1000–2000); Ödevler: `/api/progress`; bekleme; Program: `/api/myschedule`. Hepsi 200 ise "sayfa tamam".

Öğrenci başına 24 dosya ve 10 API isteği (yanlış şifre yazanda 12). 300 kişide 10 260 istek: 7 200 dosya, 3 060 API.

### Bölümler ve denetimler

- **Hazırlık (3).** Seed okulunun kısa adı ve `ogrenci1`'in sınıfı veritabanından okunur. 300 öğrenci **doğrudan veritabanına**
  yazılır (`id` `u_ag<n>`, kullanıcı adı `agogr<n>`, ad "Ağ Öğrencisi <n>", `ogrenci1`'in okulunda ve sınıfında, onaylı, aydınlatma
  metni onaylı, şifre özeti `sunucu/sifre.js` `hashPw`); `ogrenci1`'in ödevleri hepsine kopyalanır (`odev_ogrencileri`). Okul
  sayfasında fotoğraf yoksa müdür bir kapak, bir logo ve dört galeri fotoğrafı (1 × 1 PNG) yükler. Denetimler: okul ve kısa ad var;
  en az 300 `agogr` hesabı; okul sayfasında 6 fotoğraf.
- **Okul ağı: 300 öğrenci aynı anda (6).** `senaryo` her öğrencinin başlangıcını yayılma süresine dağıtır (yayılma ≤ 2 sn ise "ani
  yük", değilse "kademeli"), hepsini bekler, tabloyu basar. Denetimler: hiç 429 yok; hiç 503 yok; hiç bağlantı kesilmedi; yanlış
  şifre yazan 30 kişinin hepsi reddedildi; 300/300 girdi; 300/300'ün ana sayfası, Ödevler ve Program'ı açıldı.
- **Tek oturumdan sel (3).** İlk giren öğrencinin oturumuyla, okulun ağından, 18 × 20 = 360 `GET /api/me`: en az 50'si 429 almalı ve
  429'lardan birinde `sinir: 'oturum'` olmalı; ardından aynı ağdaki 10 öğrencinin `GET /api/progress`'i 200.
- **Tek hesaba şifre denemesi (4).** `agogr8`'e okulun ağından 5 yanlış (ikinciden itibaren soruyla): beşincide 401 ve "kilitlendi";
  kilitliyken doğru şifre 429 `kilitli: true`; başka bağlantıdan (`127.0.0.1`) sorusuz giriş 400 `soruGerekli` (hesaba her yerden
  3 hata olduysa soru); soruyu çözünce sahibi oradan girer (200).
- **Hesaba birçok bağlantıdan 20 hata (6).** `agogr9`'a `127.0.0.11`–`15`'ten 4'er yanlış = 20 hata (her bağlantıda 5'in altında
  kalır). Tanımadığı `127.0.0.16`'dan doğru şifre 429 `kilitli`; sahibinin daha önce girdiği okul ağından 200; sahibi girince toplam
  kilit kalkar, `127.0.0.16`'dan da 200. `agogr10`'a `127.0.0.21`–`25`'ten 20 hata → `127.0.0.26`'dan 429; müdür
  `POST /api/school/student-password { studentId: 'u_ag10', password }` ile yeni şifre verir → yeni şifreyle `127.0.0.26`'dan 200
  (e-postası olmayan öğrencinin "Şifremi unuttum"u budur).
- **Şifre taraması: hiç kimsenin girmediği bağlantı (3).** `tara('127.0.0.3', 100)`: her denemede başka bir `agogr` hesabına bir
  yanlış şifre (soru istenirse çözülür). Bağlantı 50 hatada durur (ilk 429 50–52. denemede); o bağlantıdan doğru şifre de 429
  ("bağlantıdan"); okulun ağından temiz bir hesap (`ogrenci2@test.com`) sorusuz girer.
- **Şifre taraması: 10 hesabın girdiği bağlantı (3).** `127.0.0.4`'ten önce 10 öğrenci doğru şifreyle girer (bağlantının hata
  sınırı 50 + 10 × 2 = 70 olur). Taramada 50 hatadan sonra o bağlantıdan her girişte soru istenir (ilk soru 49–52. denemede
  beklenir), bağlantı 70 hatada durur (ilk 429 69–72. denemede).
- **Şifre taraması: kendi açtığı hesaplarla sınırı büyütme denemesi (2).** `127.0.0.5`'ten 5 yetişkin hesabı açılıp doğru şifreyle
  girilir (şifre adımı 200 döner; iki adımlı kod istenir ama tanıdık kaydı o adımda yazılır). Bağlantının sınırı yine 50'de kalır:
  herkesin kendisi açabildiği yetişkin hesabı sınırı büyütmez.
- **Oturumsuz sel (3).** `127.0.0.1`'den 25'lik partilerle `GET /api/meta` (en çok 7000): ilk 429 `sinir: 'ip'` ile ve 4000.
  istekten sonra gelmeli (sınır dakikada 6000); bu arada okulun ağından `GET /api/meta` 200.
- **Giriş sınırları, birçok IP, sunucusuz (20).** `../sunucu/guvenlik` bu sürece yüklenir, işlevleri doğrudan çağrılır (anahtar
  `'giris:' + ip + ':' + id`, sunucunun kullandığı biçim): okul ağında 300 giriş ve 30 hata engel ve kilit doğurmaz, soruyu yalnız
  yanlış yazan 30 kişi görür, bağlantının sınırı 300 olur; sahibi `60.0.0.1`'den girmiş hesaba 5 IP'den 4'er hata → 3 hatadan sonra
  yeni IP'de de soru, 4 hatada kilit yok, 20 hatada tanımadığı IP'den ve saldıran IP'lerden kilitli, sahibinin IP'sinden değil, başka
  hesap etkilenmez; sahibi girince toplam hata silinir; yeniden 20 hata ve `girisBasarili('', id)` (şifre sıfırlama) kilidi kaldırır;
  tanıdıksız IP 49 hatada durmaz, 50'de durur; 10 okul hesabının girdiği IP'nin sınırı 70, üstüne 40 yetişkin girse de 70, yetişkin
  hesabı için bağlantı yine tanıdık; o IP'de 50 hatada temiz hesaba da soru ama durma yok, 70'te durur.
- **Genel istek sınırı, sunucusuz (6).** `genelIstekSiniri` ile: bir IP'den 6000 API isteği geçer, 6001. `'ip'`; IP sınırı dolunca 2000
  uydurma oturum anahtarı yeni sayaç açmaz (`genelKayit` büyümez); tek oturum 300 istekten sonra `'oturum'`'da durur ve durdurulan
  700 istek IP sayacından düşülür (IP sayacı 300); sayaç haritası `EN_FAZLA_GENEL_SAYAC` (100 000) kayda varınca yeni anahtar sayılmaz,
  harita büyümez. Sonda `genelKayit.clear()`.

Sonunda havuz kapatılır, boş satır ve `GECTI: 59   KALDI: 0` (`EE_AG_SALDIRI=0` ile 35 denetim). `KALDI` varsa çıkış kodu 1;
beklenmeyen hata `TEST HATASI:` ile, çıkış kodu 1.

## Kimle konuşur?

- **Modüller:** [giris.md](giris.md) (`girisYap`, `hesapAc`, `BASE`); [../sunucu/ayarlar.md](../sunucu/ayarlar.md) (`ayarlariYukle`),
  [../sunucu/veri/baglanti.md](../sunucu/veri/baglanti.md) (`veritabaniAdi`, `sorgu`, `tek`, `kapat`),
  [../sunucu/sifre.md](../sunucu/sifre.md) (`hashPw`), [../sunucu/guvenlik.md](../sunucu/guvenlik.md) (sunucusuz bölümler: `girisHatasi`,
  `girisBasarili`, `girisTanidik`, `tanidikMi`, `girisIpEngeli`, `girisKilitSn`, `girisSoruLazim`, `ipHataSiniri`, `GENEL_SINIR`,
  `genelIstekSiniri`, `genelKayit`, `EN_FAZLA_GENEL_SAYAC`); Node'un `http`, `path`, `zlib`, `crypto`'su. Okul sayfasının
  fotoğraflarını yüklerken `fetch`.
- **Sunucu uçları ve dosyaları:**

  | İstek | Ne için | Belge |
  |---|---|---|
  | `GET /school/<kısa ad>`, `/js/tema.js`, `/css/style.css`, `/js/app.js`, `/yazitipi/*.woff2`, `/manifest.json`, `/simge-*.png`, `/sw.js`, `/`, `/index.html` | sayfa ve dosyalar (sıkıştırmalı) | [../sunucu/http.md](../sunucu/http.md) |
  | `GET /api/meta`, `GET /api/okul-adres?kisa=`, `GET /api/challenge`, `POST /api/login`, `GET /api/notifications`, `GET /api/me` | açılış, giriş, sel denemeleri | [../sunucu/bolumler/kayit.md](../sunucu/bolumler/kayit.md) |
  | `GET /api/site` | site bilgisi | [../sunucu/site.md](../sunucu/site.md) |
  | `GET /api/okul-foto/<id>`, `POST /api/okul-sayfa/foto?yer=` | okul sayfası fotoğrafları | [../sunucu/bolumler/okul-sayfasi.md](../sunucu/bolumler/okul-sayfasi.md) |
  | `GET /api/egitim-yili` | ana sayfa | [../sunucu/bolumler/egitim-yili.md](../sunucu/bolumler/egitim-yili.md) |
  | `GET /api/progress`, `GET /api/myschedule` | ana sayfa, Ödevler, Program | [../sunucu/bolumler/ilerleyis.md](../sunucu/bolumler/ilerleyis.md) |
  | `POST /api/school/student-password` | müdürün verdiği yeni şifre | [../sunucu/bolumler/hesaplar.md](../sunucu/bolumler/hesaplar.md) |
  | `POST /api/register`, `POST /api/eposta-onay` | `hesapAc` ile 5 yetişkin hesabı | [../sunucu/bolumler/kayit.md](../sunucu/bolumler/kayit.md) |

- **Koruduğu kod:**
  - [../sunucu/index.md](../sunucu/index.md) — genel hız sınırı ve 429 cevabındaki `sinir`, olay döngüsü gecikmesinde ve aynı anda
    1000 API isteğinde 503, vekilsiz kurulumda IP başına 2048 bağlantı (300 öğrenci en çok 1800 açtı).
  - [../sunucu/guvenlik.md](../sunucu/guvenlik.md) — `GIRIS_SINIR` (hesap + IP 5 hatada kilit; hesaba 3 hatada soru, 20 hatada
    tanımadığı bağlantılardan kilit; bağlantıda 50 hata + okul hesabı başına 2, en çok 300; 5 dakikada 1200 deneme), tanıdık
    bağlantılar (`tanidik`, `ipHesaplari`), `GENEL_SINIR` (`ip` 6000, `oturum` 300, `dosya` 15000, dakikada), `genelGeriAl`,
    `EN_FAZLA_GENEL_SAYAC`, `istemciIp` (vekil kipinde başlığın son girdisi).
  - [../sunucu/bolumler/kayit.md](../sunucu/bolumler/kayit.md) — girişin sırası: bağlantı engeli 429 ("Bu bağlantıdan çok fazla giriş
    denemesi…") → hesap kilidi 429 `kilitli` → soru 400 `soruGerekli` → şifre 401 → doğruysa `girisTanidik(ip, id, okulHesabı)`;
    okul adresi sorgusunun dakikada 3000, doğrulama sorusunun 10 dakikada 1500 IP sınırı.
  - [../sunucu/bolumler/hesaplar.md](../sunucu/bolumler/hesaplar.md) — `student-password`'ün `girisBasarili('', id)` ile hesabın
    toplam hata kilidini kaldırması.
  - [../sunucu/bolumler/okul-sayfasi.md](../sunucu/bolumler/okul-sayfasi.md) — okul fotoğrafı okumanın IP başına dakikada 4000 sınırı.
  - [../public/sw.md](../public/sw.md) — `KABUK` listesi (paket 7 adresini elle taşır).
- **Tablolar:** doğrudan `kullanicilar` (300 satır `INSERT`, sayım), `okullar` (okulun kısa adı), `odev_ogrencileri` (ödev
  kopyası); uçlar üzerinden `oturumlar`, `okul_fotolari`, `bildirimler` ve `islem_kaydi` (müdürün şifre vermesi), `kullanicilar`
  (5 yetişkin hesabı, `agogr10`'un şifresi).
- **Ön yüz** (paket tarayıcının isteklerini taklit eder; tarayıcı yok): giriş [../public/js/parcalar/05-giris.md](../public/js/parcalar/05-giris.md),
  okul sayfası [../public/js/parcalar/05a-dis-sayfalar.md](../public/js/parcalar/05a-dis-sayfalar.md), ana sayfa
  [../public/js/parcalar/08-ana-sayfa.md](../public/js/parcalar/08-ana-sayfa.md), Program
  [../public/js/parcalar/22-programim.md](../public/js/parcalar/22-programim.md), servis çalışanı [../public/sw.md](../public/sw.md).
- **Onu çalıştıran:** `testler/tumtest.sh`, sunuculu paketlerin sondan bir öncekisi (`test-cakisma`'dan sonra, `guvenlik-test`'ten
  önce); kısa sürüm (5 sn yayılma, saldırılar açık). **Onu anan kod:** `sunucu/index.js`'in baştaki yük koruması yorumu ("bu
  açılışı gerçek istek dizisiyle ölçer": öğrenci başına ~10 API, ~24 dosya isteği) ve `sunucu/guvenlik.js`'in "giriş sınırları
  (okul ağı)" yorumu; sınır sayıları değişirse bu paket de gözden geçirilmeli.

## Nasıl çalışır (adım adım)?

```
testDeposu(): EE_DATA=testler/testdata ─► veritabanı _test mi? ── hayır ─► "KALDI test veritabanı değil", çık(1)
HAZIRLIK: okulun kısa adı ─► 300 agogr hesabı + ödevleri (SQL) ─► okul sayfasına 6 fotoğraf (yoksa)
OKUL AĞI (::1): 300 × ogrenci()  başlangıçlar 5 sn'ye yayılır, her biri 6 bağlantı
   sayfa + dosyalar ─► meta, okul-adres, site, fotoğraflar ─► sw.js + 7 ─► login (30'u önce yanlış) ─► ana sayfa ─► Ödevler ─► Program
   tablo + OLCUM satırı ; 429 = 0, 503 = 0, kopma = 0, 300/300
SALDIRILAR (EE_AG_SALDIRI=0 değilse):
   ::1  tek oturum 360 istek ─► sinir: oturum ; öbürleri 200
   ::1  agogr8 5 yanlış ─► kilit ; 127.0.0.1 soru ─► sahibi girer
   127.0.0.11-15 agogr9 20 hata ─► 127.0.0.16 kilitli ─► ::1 sahibi girer ─► kilit kalkar
   127.0.0.21-25 agogr10 20 hata ─► 127.0.0.26 kilitli ─► müdür yeni şifre ─► girer
   127.0.0.3 tarama ─► 50'de durur ; 127.0.0.4 (10 giriş) ─► 50'de soru, 70'te durur ; 127.0.0.5 (5 yetişkin) ─► 50
   127.0.0.1 oturumsuz sel ─► ~6000'de sinir: ip ; ::1 etkilenmez
SUNUCUSUZ: guvenlik.js giriş sınırları (20) + genel istek sınırı (6)
kapat()
```

## Dikkat!

- **Veritabanına doğrudan yazar.** 300 hesap ve ödev bağları SQL ile eklenir; koruma `testDeposu()`'dur (adı `_test` ile bitmeyen
  veritabanında hiçbir şey yazılmadan çıkılır). Ad `testler/testdata/ayarlar.json`'dan (ya da `DATABASE_URL`'den) okunur; 3200'deki
  sunucu ile aynı veritabanı olmalı. Paket bu hesapları silmez (sonraki paket sıfırlanmış veritabanıyla başlar).
- **Sunucu taze açılmış, veritabanı sıfırlanmış olmalı.** Giriş sayaçları, kilitler, tanıdık bağlantılar ve genel sayaçlar sunucunun
  belleğindedir (giriş için 15 dakikalık, genel istek için 1 dakikalık pencereler). 3 Ekim öğlen denetiminde aynı sunucuda hemen
  ikinci kez koşuldu: `GECTI: 42   KALDI: 17`, yalnız 147/300 öğrenci girdi. Nedenleri (çıktıdaki örneklerle):
  - Okulun ağından (`::1`) 15 dakika içindeki hatalı girişler iki koşuda 50'yi geçer (ilk koşunun 30 yanlış şifresi ve `agogr8`'in
    5 hatası, sonra ikinci koşunun yanlışları); 50 hatadan sonra o bağlantıdan her girişte soru istenir, soru göndermeyen öğrenciler
    400 "Devam etmek için doğrulama sorusunu cevapla." alır.
  - `agogr8` okulun ağından hâlâ kilitli (429 `kilitli`); `agogr10`'un şifresi ilk koşuda müdürce değiştirildiği için 401 "Şifre
    yanlış." Bu ikincisi veritabanındadır: sunucu yeniden açılsa da veritabanı sıfırlanmadıkça `agogr10` girmez (hesaplar
    `ON CONFLICT DO NOTHING` ile eklendiği için şifre geri yazılmaz).
  - `127.0.0.1`'in dakikalık API sayacı ilk koşunun oturumsuz seliyle dolu (429 `sinir: 'ip'`); `127.0.0.3`, `.4`, `.5` 15 dakika
    boyunca durmuş kalır (taramalar 1. denemede 429). Saldırı denetimlerinin çoğu `KALDI` olur.
  - Senaryoda yalnız 1 kez 429 görüldü (hesap kilidi); okul ağının dakikalık API sınırı bu koşuda dolmadı, çünkü girişlerin yarısı
    soruda kaldı.

  `tumtest.sh` her paketten önce veritabanını sıfırlar ve sunucuyu yeniden açar.
- **`::1` ve `127.0.0.N` gerekir.** Okulun ağı IPv6 geri döngüsüdür; IPv6'sı kapalı bir makinede (sunucu `0.0.0.0`'a düşer,
  `sunucu/yollar.js` yorumu) okul ağı istekleri bağlanamaz. Saldırgan bağlantılar `127.0.0.N` kaynak adresinden bağlanmayı ister;
  bu, işletim sisteminin bütün `127/8`'i yerel adres saymasına bağlıdır. Bu bilgisayarda (Windows) ikisi de çalıştı; başka bir
  sistemde denenmedi.
- **"Oturumsuz sel" sayısı tam 6001 çıkmaz.** IP sayacı o adresten aynı dakikada gelen bütün API isteklerini sayar (sayaç `127.0.0.1`
  için; o adres paketin başka yerlerinde de kullanılır) ve istekler 25'lik partilerle gittiği için ilk 429'un sırası yaklaşıktır.
  3 Ekim'deki iki temiz koşuda da (sabah ve öğlen denetimi) 5997. istekte geldi: 6000 − 3, `agogr8` bölümünde `127.0.0.1`'den giden
  üç API isteğiyle (sorusuz giriş, soru, giriş) uyumlu. Denetim yalnız "4000'den sonra ve `sinir: 'ip'`"e bakar.
- **"Kendi açtığı hesaplarla" bölümü iki adımlı girişi tamamlamaz.** Yetişkinin şifre adımı 200 ve `twoFactor` döner; paket bunu
  "girdi" sayar. Sunucu bağlantıyı o hesap için tanıdık sayar ama okul hesabı olmadığından hata sınırını büyütmez; denenen kural
  budur.
- **Dosya başı yorumu üç yerde koddan farklı.** Yorum öğrenci başına dosya isteklerini "(19)" diye sayar; kodda fotoğraflar hariç
  18 dosya isteği var (fotoğraflarla 24; 3 Ekim koşusunda 300 kişi için 7200 dosya). Yorum okul fotoğraflarını API listesinde anar;
  kod (sunucu gibi) onları dosya sayar. Ayrıca yorum "Ölçüm"de "sonuç tablosu ve OLCUM satırı" der; tablo ve `OLCUM` satırı kısa
  sürümde de basılır (fark yalnız yayılma ve beklemeler).
- **`EE_AG_KISI` belgelenmemiş ve sınırlı denenmiş.** Değişken kodda var, yorumda yok. Saldırı bölümlerinin hedefleri sabittir
  (`agogr8`, `agogr9`, `agogr10` / `u_ag10`; tek oturum selinde ilk giren ve sonraki 10 kişi), bu yüzden değer en az 10 olmalı
  (küçük değerde hesaplar bölümler arasında çakışır, sonuç anlamını yitirir); `127.0.0.4`'te girilen hesaplar (300'de
  `agogr200`–`209`) ve taramanın hesapları `% KISI` ile kayar. Yanlış şifre yazanların beklenen sayısı `Math.floor(KISI / 10)`.
  Sunucusuz bölüm sabit 300 kullanır. Yalnız 300 ile koşuldu.
- **Vekil kipi test ayarında hazır değil.** `EE_AG_VEKIL=1` sunucunun `vekil.guven: true` ve `x-forwarded-for` başlığıyla açılmasını
  ister; `testler/test-ayarlari.js` test klasörüne yalnız `veritabani`'nı yazar ([test-ayarlari.md](test-ayarlari.md)). Bu kipte
  `testler/testdata/ayarlar.json`'a vekil ayarını elle eklemen gerekir. Bu belge için denenmedi.
- **Paket sürecinin içinde de bir `guvenlik.js` var.** Sunucusuz bölümler sunucuyu değil, bu sürece yüklenen kopyayı dener; sunucunun
  sayaçlarına dokunmaz. O kopya `sunucu/veri`'yi de yükler (aynı havuz). Sayaç haritasını 100 000 kayda kadar doldurur (bellek kısa
  süre büyür), sonra temizler.
- **Okul sayfası fotoğraf yüklemesi denetlenmez.** Fotoğraf yoksa müdür altı fotoğraf yükler ama cevaplara bakılmaz; ardından "6
  fotoğraf var" denetimi sonucu gösterir.
- **Seed'e bağlı.** `ogrenci1@test.com` (okul ve sınıf), `ogrenci2@test.com` (temiz hesap), `mudur@test.com` ([seed.md](seed.md)).
- **Varsayılan adres 3000.** `BASE` `araclar/giris.js`'ten gelir; `EE_BASE` vermezsen yük ve saldırı kendi sunucuna gider (doğrudan
  veritabanı adımları ise `testdata` ayarı `_test`'i gösterdiği sürece test veritabanına). İkisi ayrışır, sonuç anlamsızlaşır ve kendi
  sunucunun giriş sayaçları dolar. Her zaman test sunucusunu kullan.

## Testleri

- Bu dosyanın kendisi testtir; `testler/tumtest.sh` her tam koşuda kısa sürümünü çalıştırır. Aynı alanda: `testler/test-vekil-ip.js`
  (sunucusuz; vekil başlığından gerçek IP'nin okunması), [guvenlik-test.md](guvenlik-test.md) (sahte oturum, kaba kuvvet ve öbür
  saldırılar), [test-giris-kayit.md](test-giris-kayit.md) (giriş hataları ve kilit), [../araclar/yuk-testi.md](../araclar/yuk-testi.md)
  (kalabalık okul verisiyle ekran ölçümü; okul ağı yükü bu pakette ölçülür).
- Elle (Git Bash, proje kökünde; 3200'de sıfırlanmış, [seed.md](seed.md) ile tohumlanmış ve **yeni açılmış** test sunucusu varken):

  ```
  EE_BASE=http://localhost:3200 EE_LOG=testler/test-sunucu.log node testler/test-okul-agi.js
  ```

  Uzun ölçüm için başına `EE_AG_OLCUM=1`, ani yük için `EE_AG_YAYILMA_MS=1000`, yalnız yük için `EE_AG_SALDIRI=0` ekle.
- 3 Ekim sabahı bu belge için 3200'de, sıfırlanmış `egitimevi_test` ve seed'le, varsayılan ayarlarla koşuldu: `GECTI: 59   KALDI: 0`,
  yaklaşık 24 saniye. Senaryo: 300/300 girdi, 10 260 istek (API 3060, dosya 7200), 429 / 503 / kopma 0, en çok 1800 açık bağlantı,
  en çok 157 aynı anda süren API isteği, giriş süresi ortanca 293 ms (%95 638 ms); tek oturum seli 360 istekte 65 kez 429; taramalar
  51., 71. (soru 51.) ve 51. denemede durdu; oturumsuz selde ilk 429 5997. istekte. Sunucu günlüğünde `API hatası` ya da
  `Veritabanı hatası` yoktu. Ölçüm, ani yük ve vekil kipleri koşulmadı.
- Öğlen denetiminde yeni açılmış sunucuda yeniden koşuldu: yine 59/0, yaklaşık 18 saniye. Sayılar (300/300, 10 260 istek, 1800
  bağlantı, 65 kez 429, 51. / 71. / 51. deneme, 5997. istek) aynı çıktı; süreler makinenin o anki yüküne göre değişir (bu koşuda
  giriş ortanca 54 ms, %95 100 ms, en çok 42 aynı anda süren API isteği). Aynı sunucuda hemen ikinci koşu 42/17 verdi ("Dikkat!"e
  bak).

## Son durum

- `git log`: tek commit. Dosya `566b917 commit 524` (2026-09-27, canlı hazırlık) ile 587 satır olarak eklendi; o günden beri değişmedi.
  Aynı commit koruduğu kodu da getirdi ya da değiştirdi: `sunucu/guvenlik.js` (giriş sınırları, tanıdık bağlantılar, genel istek
  sınırının oturum/IP ayrımı; 222 satır eklendi, 3 silindi), `sunucu/index.js` (genel sınır, 503 ve bağlantı sınırının okul
  ölçeğine çıkması), `sunucu/bolumler/kayit.js` (girişin yeni sırası), `sunucu/bolumler/hesaplar.js` ve `okul.js` (müdürün tek tek
  ya da toplu verdiği yeni şifrenin `girisBasarili('', id)` ile hesap kilidini kaldırması); `testler/tumtest.sh` paketi listeye
  `test-cakisma`'nın arkasına ekledi.
- Açık iş yok; kod değiştirilmedi. Dosya başı yorumundaki küçük farklılıklar, aynı sunucuda ikinci koşunun tutmaması ve sınırlı
  denenmiş kipler "Dikkat!"te.
- Planlı işlerden bu dosyayı etkileyecekler:
  - **"Güvenlik denetimi (… + IPv6 /64 anahtarı …)"** — hız sınırı, kilit ve bağlantı sayaçlarında IPv6 adresi /64 ağı olarak sayılacak.
    Okulun ağı burada `::1`; sayaçların anahtarı değişince okul ağı ile IPv6 saldırganı ayırmanın yolu ve sunucusuz bölümün anahtarları
    gözden geçirilmeli.
  - **"Tek kişi tek hesap + portallar öğrencide de"** (kullanıcı adı site genelinde tek, "Okul seç") ve **"T.C. kimlik no bütün
    hesaplarda zorunlu"** (kod Linux'ta) — paket 300 hesabı T.C.'siz SQL ile ve okul adresiyle (`okul: <kısa ad>`) girer; 5 yetişkin
    hesabını T.C.'siz açar. İkisi de bu adımları değiştirebilir.
  - **"Sistem: … yeni cihaz uyarısı + açık oturumlar"** ve **"Okul cihazı"** (öneri) — girişe yeni adımlar ekleyebilir; 300 öğrencinin
    açılışındaki istek dizisi yeniden ölçülmeli.
  - **"Çok dil"** ve **"Üst şerit sadeleştirme"** — sayfa açılışına yeni dosya ya da API isteği ekleyebilir (ör. dil kataloğu);
    `ogrenci()` dizisi tarayıcıda ölçülüp elle güncellenir, `public/sw.js`'teki `KABUK` değişirse buradaki 7 adres de değişmeli.
