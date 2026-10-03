# testler/test-site-ayarlari.js

Yönetim panelinin "Site ayarları" bölümünü (iletişim, yapımcılar, Play Store bağlantısı, bildirim yoklama aralığı,
çevrimiçi sayma süresi, `admins.json` okuma aralığı: öncelik sırası, doğrulama, sıfırlama, işlem kaydı) ve yöneticinin
okul adreslerini değiştirmesini deneyen, bir bölümü sunucu kodunu kendi sürecinde doğrudan çağıran sunuculu test paketi
(65 denetim).

## Bu dosya ne yapar?

Sitenin birkaç ayarı koda gömülmek yerine sistem yöneticisinin elindedir: sayfaların altındaki iletişim e-postası ve
telefonu, "Yapımcılar" listesi, Android uygulamasının Play Store bağlantısı ve üç zaman aralığı (sitenin bildirimleri ne
sıklıkla yokladığı, "şu an açık" kişi sayısının hangi süreye göre sayıldığı, `data/admins.json`'a ne sıklıkla bakıldığı).
Her ayarın değeri üç yerden gelebilir ve öncelik sabittir ([../sunucu/site.md](../sunucu/site.md)):

```
1. veritabanı (yöneticinin panelden kaydettiği)  >  2. data/config.yml (yapımcılar için yapimcilar.json)  >  3. kodun varsayılanı
```

Bu paket bu kuralı ve panelin arkasındaki uçları ([../sunucu/bolumler/site-ayarlari.md](../sunucu/bolumler/site-ayarlari.md))
sırayla dener:

- Öncelik: sunucu kodunu (`sunucu/site.js`) kendi sürecinde, geçici bir `config.yml`'li ayrı bir veri klasörüyle yükler;
  veritabanında değer yokken config.yml'in, varken veritabanının kazandığını, sınır dışı config değerinin yok sayıldığını
  görür.
- Varsayılanlar ve sınırlar; her ayarın kaydedilmesi, hatalı değerin alanıyla reddedilmesi, "sıfırla".
- Değişikliğin sunucu yeniden başlamadan `/api/site`, `/api/me`, `/api/uygulama`'da görünmesi ve bu cevapların tarayıcıda
  saklanmaması (`Cache-Control: no-store`).
- Çevrimiçi sayma süresinin yoklama aralığından kısa olamayacağı (en az yoklama + 1 dk kullanılır) ve bunun panelde not /
  uyarı olarak söylenmesi.
- Ayar değişikliklerinin işlem kaydına okulsuz yazılması (müdür görmez).
- Okul adresi (`egitimevi.org/school/<kısa ad>`): yönetici değiştirebilir, eski adres hemen "Okul bulunamadı" olur, müdüre
  bildirim gider, kısa ad kuralları, müdürün kendi değiştirmesi aynen çalışır.
- Yönetici olmayan için bu uçlar bilinmeyen bir adresle birebir aynı 404'ü verir.

Dosya başındaki yorumun son cümlesi önemli: **yalnız test veritabanında (`_test`) çalışır**.

## İçinde neler var?

### Yardımcılar

- `kontrol(ad, sart, detay)` — `GECTI` / `KALDI` satırı, sayaçlar; `J(x)` — JSON'un ilk 300 karakteri.
- `DENEME` — `testler/testdata/site-ayar-deneme/`.
- `testDeposu()` — `DENEME`'yi açar; test sunucusunun bağlantı ayarını (`testler/testdata/ayarlar.json`) oraya kopyalar; içine
  şu `config.yml`'i yazar:

  ```
  iletisim:      eposta "dosya@egitimevi.org", telefon "0312 123 45 67"
  uygulama:      playstore "https://play.google.com/store/apps/details?id=org.dosya"
  araliklar:     bildirim_dk 7, cevrimici_dk 12, admins_dk 99 (sınır dışı: yok sayılmalı)
  ```

  Sonra `process.env.EE_DATA = DENEME` yapar, `sunucu/ayarlar`'ın `ayarlariYukle()`'sini çağırır, `sunucu/veri/baglanti`'yı
  yükler; bağlanılacak veritabanının adı `_test` ile bitmiyorsa `null` döner (paket "test veritabanı değil" diye `KALDI`
  yazıp 1 ile çıkar). Bitiyorsa `{ baglanti, veri, site }` (bağlantı, `sunucu/veri` ve `sunucu/site` modülleri).
- Ana gövdede: `kaydet(anahtar, deger, tok)` → `POST /api/admin/site-ayarlari { anahtar, deger }` (varsayılan yönetici
  oturumuyla), `sifirla(anahtar)` → `{ anahtar, sifirla: true }`.

Ortak yardımcılar [giris.md](giris.md) üzerinden ([../araclar/giris.md](../araclar/giris.md)): `iste`, `girisYap`, `hesapAc`,
`mudurYap`.

### Hesaplar ve veriler

Seed'den ([seed.md](seed.md)): sistem yöneticisi `admin@egitimevi.com` / `admin123` (`A`), müdür `mudur@test.com` (`M`),
öğretmen `mat@test.com` (`O`); okul "Test Ortaokulu", adresi `test-ortaokulu`. Depodaki `yapimcilar.json` (içinde
`KARANKOYU` GitHub adı geçen liste). Paketin açtıkları: ikinci okul "Adres Deneme Okulu <z>" (`adres-deneme-<z>`, Ankara /
Mamak) ve müdürü `adresmudur<z>`; `z` `Date.now()`'ın 36 tabanındaki son 5 hanesi.

### 1) Öncelik: veritabanı > config.yml > varsayılan (7) — paketin kendi sürecinde

`depo.siteAyarlari.yukle()` ile tablo belleğe okunur, sonra `site.ayarKaynakli` / `site.ayar` doğrudan çağrılır:

- `iletisim` config'den (`kaynak: 'config'`, e-posta ve telefon config'deki gibi).
- `bildirimAralikDk` 7, `cevrimiciDk` 12; `adminsAralikDk` için 99 yok sayılmış: `kaynak: 'varsayilan'`, değer 1.
- `playStore` config'deki adres; `yapimcilar` `kaynak: 'dosya'`.
- `depo.siteAyarlari.yaz` ile veritabanına `iletisim { eposta: 'db@egitimevi.org', telefon: '' }` ve `bildirimAralikDk: 3`
  (güncelleyen "Deneme") yazılır → `iletisim` artık `veritabani`'dan, telefon boş, `guncelleyen` "Deneme"; `cevrimiciEtkinDk()`
  12 (12 > 3 + 1).
- İki satır silinir → `iletisim` yine config'den, `bildirimAralikDk` yine 7.

### 2) Varsayılanlar (sunucu) (4)

Bundan sonrası 3200'deki test sunucusuna gider (onun veri klasöründe `config.yml` yok):

- `GET /api/admin/site-ayarlari` → altı ayar da geliyor.
- `bildirimAralikDk` 5 (en 1, en çok 30, kaynak `varsayilan`), `cevrimiciDk` 5 (en çok 60), `adminsAralikDk` 1 (en çok 60).
- `cevrimiciDk.etkin` 6, `uyari` boş, `not`'ta "Kullanılan: 6 dakika" ve "5 dakika".
- `yapimcilar` dosyadan, dizi.

### 3) İletişim (9)

- `{ eposta: ' iletisim@egitimevi.org ', telefon: '+90 (312) 555 12 34' }` → 200, kaynak `veritabani`, e-posta kırpılmış,
  `guncelleyen` "Sistem Yöneticisi"; `GET /api/site` hemen yenisini veriyor (telefon yazıldığı gibi).
- Reddedilenler (400): `eposta: 'bozuk-adres'` (`alan: 'eposta'`); `eposta: 'ayşe@örnek.com'` (`alan: 'eposta'`, metinde
  "Türkçe"; `/api/site` eski değeri vermeye devam ediyor); `telefon: 'ara beni'` (`alan: 'telefon'`); `telefon: '0532 12'`
  (`alan: 'telefon'`, "10 haneli"); `deger: 'metin'` (nesne değil).
- İkisi boş `{ eposta: '', telefon: '' }` → 200, `/api/site`'ta ikisi de boş, kaynak `veritabani` (boş değer config'i de gizler).
- Aynı değer yeniden → 200, iletide "zaten".

### 4) Yapımcılar (10)

- Üç kişilik liste kaydedilir; `/api/site` aynısını aynı sırayla veriyor. Sırası değiştirilmiş liste → yeni sıra.
- Reddedilenler (400, `alan: 'yapimcilar'`): GitHub adı `-kotu-ad-` (`sira: 1`, `altAlan: 'github'`); adı yalnız boşluk
  (`sira: 0`, `altAlan: 'ad'`); 61 karakterlik ad (`altAlan: 'ad'`); 81 karakterlik katkı (`altAlan: 'katki'`); 51 kişilik
  liste (metinde "50"); liste yerine nesne.
- 50 kişilik liste kabul.
- `sifirla('yapimcilar')` → kaynak yine `dosya`, `/api/site`'ın listesinde `github: 'KARANKOYU'` olan biri var.

### 5) Play Store (4)

- `https://play.google.com/store/apps/details?id=org.egitimevi.aile` → 200; `GET /api/uygulama`'nın `playStore`'u bu.
- `/api/site` ve `/api/uygulama` cevaplarında `Cache-Control: no-store`.
- `http://play.google.com/…`, `https://play.google.com.kotu.site/x`, `https://ornek.com/store` → 400 (ilkinde
  `alan: 'playStore'`).
- Boş metin → 200; `/api/uygulama`'da `playStore: ''`.

### 6) Aralıklar (7)

- `bildirimAralikDk: 10` → `GET /api/me` (öğretmen) ve `/api/site` 10 diyor; `/api/site`'ın `cevrimiciDk`'sı 11, panelde
  `etkin` 11, uyarı yok, notta "Kullanılan: 11 dakika" ve "10 dakika".
- `cevrimiciDk: 3` → 200 ama `etkin` 11; uyarıda "Kaydettiğin 3 dakika" ve "11 dakika".
- `cevrimiciDk: '20'` (metin) → 200, `/api/site` 20, not ve uyarı boş.
- Hepsi 400 ve `alan` ayarın adı: `bildirimAralikDk` 0, 31, 2.5, `'abc'`; `cevrimiciDk` 61, -1; `adminsAralikDk` 0, 61,
  `null`.
- `adminsAralikDk: 60` → `GET /api/admin/yonetici-dosyasi`'nın `aralikDk`'sı 60; `adminsAralikDk: 1` → 200.

### 7) Hatalı istek ve sıfırlama (5)

- `anahtar: 'boyleBirAyar'` → 400 `alan: 'anahtar'`; `{ anahtar: 'playStore' }` (değersiz) → 400.
- Beş ayar sıfırlanır → hepsinin kaynağı `varsayilan`, yoklama aralığı 5; `/api/me` yeniden 5.
- Varsayılanla aynı değer (`adminsAralikDk: 1`) kaydedilir → kaynak `veritabani`, iletide "değer aynı"; işlem kaydında
  (`GET /api/islem-kaydi?islem=site.aralik`) "…: 1 dk (varsayılan değeri panelden sabitlendi)" satırı var, "1 → 1" yok.
  Sonra yine sıfırlanır.

### 8) İşlem kaydı (okulsuz) (3)

- Yöneticinin `GET /api/islem-kaydi`'ndaki türler arasında `site.iletisim`, `site.yapimcilar`, `site.playstore`,
  `site.aralik` var; bir `site.aralik` kaydı "Bildirim yoklama aralığı: 5 → 10 dk".
- Müdürün işlem kaydında `site.` ile başlayan hiçbir kayıt yok.

### 9) Okul adresleri (14)

- `GET /api/admin/okul-adresleri` → "Test Ortaokulu", `kisaAd: 'test-ortaokulu'`, `adres: '/school/test-ortaokulu'`.
- `GET /school/test-ortaokulu` (sayfanın kendisi) → 200 (okul önbelleğe girer).
- `POST /api/admin/okul-adres { okulId, kisaAd: 'yeni-test-okulu-<z>' }` → 200, `eskiKisaAd: 'test-ortaokulu'`, iletide
  "artık açılmıyor". Hemen ardından eski adres 404 ve sayfada "bulunamad…", yeni adres 200, `GET /api/okul-adres?kisa=…`
  okulu yeni adıyla buluyor; müdürün bildirimlerinde "sistem yöneticisi tarafından değiştirildi".
- Reddedilenler (400, `alan: 'kisaAd'`): `admin`, `a b`, `ab`; `school`, `SCHOOL`, `schools` (metinde "sitenin kendi");
  ikinci okulun adresi `adres-deneme-<z>` (metinde "başka bir okulda"). `okulId: 'yok-boyle'` → 404 `alan: 'okulId'`.
- Aynı adres yeniden → 200, iletide "zaten".
- `GET /api/islem-kaydi?islem=okul.adres-yonetici` → kayıt yeni adı içeriyor.
- Müdür kendi ucuyla (`POST /api/school/adres { kisaAd: 'test-ortaokulu' }`) adresi geri alır → 200; yöneticinin verdiği
  adres hemen 404, `test-ortaokulu` yeniden 200.

### 10) Yönetici olmayana uç yok (2)

Girişsiz, müdür ve öğretmen için dört istek (`GET` ve `POST /api/admin/site-ayarlari`, `GET /api/admin/okul-adresleri`,
`POST /api/admin/okul-adres { kisaAd: 'ele-gecir' }`) aynı anda `/api/boyle-bir-uc-yok`'a atılan istekle karşılaştırılır:
hepsi 404 ve gövdeleri birebir aynı. Sonra `GET /api/okul-adres?kisa=ele-gecir` hiçbir okul bulmuyor.

Sonunda `DENEME` silinir, bağlantı havuzu kapatılır, boş satır ve `  GECTI: 65   KALDI: 0`; `KALDI` varsa çıkış kodu 1.
Beklenmeyen hata `TEST HATASI:` ile iletiyi ve yığını yazar, çıkış kodu 1.

## Kimle konuşur?

- **Modüller** (paket sunucu kodunu kendi sürecinde de yükler):

  | Modül | Ne için |
  |---|---|
  | [giris.md](giris.md) (`araclar/giris.js`) | istek, giriş, kayıt, müdür yapma |
  | [../sunucu/ayarlar.md](../sunucu/ayarlar.md) | `ayarlariYukle` (`DENEME/ayarlar.json`) |
  | [../sunucu/veri/baglanti.md](../sunucu/veri/baglanti.md) | `veritabaniAdi` (`_test` koruması), `kapat` |
  | [../sunucu/veri/index.md](../sunucu/veri/index.md) → [../sunucu/veri/depo/site-ayarlari.md](../sunucu/veri/depo/site-ayarlari.md) | `depo.siteAyarlari.yukle`, `yaz`, `sil` |
  | [../sunucu/site.md](../sunucu/site.md) | `ayarKaynakli`, `ayar`, `cevrimiciEtkinDk` (`DENEME/config.yml` ile) |

- **Sunucu uçları:**

  | Uç | Ne için | Belge |
  |---|---|---|
  | `GET/POST /api/admin/site-ayarlari`, `GET /api/admin/okul-adresleri`, `POST /api/admin/okul-adres` | panel uçları | [../sunucu/bolumler/site-ayarlari.md](../sunucu/bolumler/site-ayarlari.md) (yönlendirme [../sunucu/bolumler/yonetici.md](../sunucu/bolumler/yonetici.md)) |
  | `GET /api/admin/yonetici-dosyasi` | `aralikDk` | [../sunucu/bolumler/yonetici.md](../sunucu/bolumler/yonetici.md) |
  | `GET /api/site`, `GET /api/uygulama` | herkese açık site bilgisi | [../sunucu/site.md](../sunucu/site.md) |
  | `GET /api/me`, `GET /api/notifications`, `GET /api/okul-adres` | yoklama aralığı, bildirim, okul adresi | [../sunucu/bolumler/kayit.md](../sunucu/bolumler/kayit.md) |
  | `GET /api/islem-kaydi` | işlem kaydı | [../sunucu/bolumler/islem-kaydi.md](../sunucu/bolumler/islem-kaydi.md) |
  | `POST /api/school/adres` | müdürün kendi adres değişikliği | [../sunucu/bolumler/hesaplar.md](../sunucu/bolumler/hesaplar.md) |
  | `POST /api/admin/okul-ac` (ve kayıt uçları) | ikinci okul (`mudurYap`) | [../sunucu/bolumler/yonetici-okul.md](../sunucu/bolumler/yonetici-okul.md) |
  | `GET /school/<kısa ad>` | okul sayfası, "Okul bulunamadı" | [../sunucu/http.md](../sunucu/http.md) |
  | `GET/POST /api/boyle-bir-uc-yok` | yönetici uçlarının gizli 404'ü ile karşılaştırma | [../sunucu/api.md](../sunucu/api.md) |

- **Koruduğu kod:**
  - [../sunucu/site.md](../sunucu/site.md) — `yamlOku`, `configGuncel`, `iletisimTemizle`, `playStoreTemizle`, `aralikTemizle`,
    `yapimcilariTemizle`, `ARALIKLAR` (1–30 / 1–60 / 1–60; varsayılan 5, 5, 1), `ayarKaynakli`, `cevrimiciEtkinDk`
    (`max(cevrimiciDk, bildirimAralikDk + 1)`), `istemciAyarlari` (`/api/me`'deki `bildirimAralikDk`), `EPOSTA`, `PLAY_STORE`,
    `GITHUB_ADI`, `YAPIMCI_EN_COK` (50), `YAPIMCI_AD_EN_COK` (60), `YAPIMCI_KATKI_EN_COK` (80).
  - [../sunucu/bolumler/site-ayarlari.md](../sunucu/bolumler/site-ayarlari.md) — `gorunum` (`etkin`, `not`, `uyari`),
    `dogrula`, `ayarKaydet` ("zaten böyle", "panelden sabitlendi", sıfırlama), `okulAdresleri`, `okulAdresiDegistir`.
  - [../sunucu/veri/depo/site-ayarlari.md](../sunucu/veri/depo/site-ayarlari.md) — bellek önbelleği.
  - [../sunucu/ortak.md](../sunucu/ortak.md) — `epostaSorunu`, `telefonSorunu`, `kisaAdSorunu` (ayrılmış adlar).
  - [../sunucu/http.md](../sunucu/http.md) — `okulOnbellekBosalt`, JSON cevaplarındaki `Cache-Control: no-store`, okul sayfası.
  - [../sunucu/api.md](../sunucu/api.md) — yönetici uçlarının yönetici olmayana bilinmeyen adresle aynı 404'ü vermesi.
  - [../sunucu/bolumler/islem-kaydi.md](../sunucu/bolumler/islem-kaydi.md) — okulsuz kayıt ve türler listesi.
- **Tablolar:** doğrudan `site_ayarlari` (1. bölüm yazıp siler); uçlar üzerinden `site_ayarlari`, `islem_kaydi`, `okullar`
  (`kisa_ad`), `bildirimler`, `kullanicilar`.
- **Ön yüz** (bu pakette tarayıcı yok): panel [../public/js/yonetim/09b-site-ayarlari.md](../public/js/yonetim/09b-site-ayarlari.md);
  yönetici dosyası kartı [../public/js/yonetim/09c-yonetici-dosyasi.md](../public/js/yonetim/09c-yonetici-dosyasi.md);
  iletişim ve yapımcıları gösteren dış sayfalar [../public/js/parcalar/05a-dis-sayfalar.md](../public/js/parcalar/05a-dis-sayfalar.md);
  bildirim yoklaması [../public/js/parcalar/24-bildirim-arama-mobil.md](../public/js/parcalar/24-bildirim-arama-mobil.md);
  indirme sayfası [../public/js/indir.md](../public/js/indir.md) (`playStore`).
- **Onu çalıştıran:** `testler/tumtest.sh`, sunuculu döngünün sonlarında (`test-admin-gizli`'den sonra, `test-cakisma`'dan
  önce). Her paketten önce `testler/test-ayarlari.js` `testler/testdata/ayarlar.json`'u yazar; bu paket onu kendi klasörüne
  kopyalar.

## Nasıl çalışır (adım adım)?

```
testDeposu(): testdata/site-ayar-deneme/ (ayarlar.json kopyası + config.yml) ─► EE_DATA ─► _test mi? ── hayır ─► KALDI, çık
A, M, O girer
1) KENDİ SÜRECİNDE: siteAyarlari.yukle ─► config kazanır ─► yaz(iletisim, bildirim 3) ─► veritabanı kazanır ─► sil ─► config
2) SUNUCU: site-ayarlari GET ─► varsayılanlar 5/5/1, etkin 6
3) iletisim: kaydet ─► /api/site ; bozuk / Türkçe / harfli tel / kısa tel / nesne değil ─► 400 ; boş ; aynı ─► "zaten"
4) yapimcilar: liste ─► sıra ; bozuk satırlar (sira, altAlan) ─► 400 ; 50 tamam, 51 değil ; sifirla ─► yapimcilar.json
5) playStore ─► /api/uygulama ; no-store ; yabancı adresler 400 ; boş
6) bildirim 10 ─► /api/me ve /api/site, çevrimiçi 11 ; çevrimiçi 3 ─► uyarı ; '20' ; sınır dışılar 400 ; admins 60 ─► 1
7) bilinmeyen anahtar, değersiz ─► 400 ; beşi sıfırla ─► varsayılan ; admins 1 ─► "sabitlendi"
8) islem-kaydi: site.* türleri, "5 → 10 dk" ; müdür görmez
9) okul-adresleri ─► /school/test-ortaokulu 200 ─► okul-adres yeni ─► eski 404, yeni 200, bildirim
   red: admin, a b, ab, school, schools, başka okulun adı, olmayan okul ; aynı ─► "zaten" ; müdür geri alır
10) girişsiz/müdür/öğretmen × 4 uç  ==  /api/boyle-bir-uc-yok (404, aynı gövde)
DENEME silinir, havuz kapanır
```

## Dikkat!

- **1. bölüm veritabanına doğrudan yazar, sunucunun belleğini atlar.** Paket `site_ayarlari`'na kendi sürecinden iki satır
  yazıp siler; 3200'deki sunucunun önbelleği (`depo/site-ayarlari.js`, açılışta okunur) bundan habersiz kalır. Satırlar
  hemen silindiği için sonraki bölümler etkilenmez; ama paket ikisinin arasında çökerse veritabanında sunucunun görmediği
  iki satır kalır (sunucu yeniden açılınca görür). Koruma `testDeposu()`'dur: adı `_test` ile bitmeyen veritabanında paket
  veritabanına ve uçlara hiç dokunmadan çıkar.
- **Yarıda kalırsa `site-ayar-deneme/` kalır.** Klasör yalnız paket sonuna kadar gidince silinir; "test veritabanı değil"
  çıkışında ya da `TEST HATASI`'nda `testler/testdata/site-ayar-deneme/` (içinde `ayarlar.json` kopyası ve `config.yml`)
  yerinde kalır. `tumtest.sh` ve `test-sunucu-ac.sh` her açılışta `testler/testdata`'yı sildiği için birikmez.
- **`EE_DATA` sırası kırılgan.** `testDeposu()` ortam değişkenini `sunucu/ayarlar` ve `sunucu/site` ilk kez yüklenmeden önce
  değiştirir (`yollar.js` veri klasörünü yüklenirken bir kez okur). Dosyanın başındaki `require('./giris')` bugün `yollar`'ı
  yüklemediği için çalışır; başa `yollar`'ı yükleyen bir modül eklenirse config.yml yanlış klasörde aranır.
- **`testler/testdata/ayarlar.json` önceden yazılmış olmalı.** `testDeposu()` onu kopyalar; dosya yoksa `copyFileSync`
  hata atar ve paket `TEST HATASI` ile durur (`tumtest.sh` ve `test-sunucu-ac.sh` her açılışta yazar).
- **`EE_BASE` şart.** Okul sayfaları (`/school/…`) ortak `iste` ile değil, `fetch(process.env.EE_BASE + …)` ile istenir;
  `EE_BASE` yoksa adres `undefined/school/…` olur ve paket 9. bölümde `TEST HATASI` ile durur. Daha önceki uç istekleri ise
  varsayılan 3000'e, yani kendi sunucuna gitmiş olur (site ayarlarını değiştirir). Her zaman test sunucusunu kullan.
- **Test sunucusunda `config.yml` olmamalı.** 2. ve 7. bölüm "kaynak `varsayilan`" bekler; sunucunun veri klasörüne
  (`testler/testdata/`) bir `config.yml` konursa bu denetimler kalır. Paketin yazdığı config.yml bir alt klasörde
  (`site-ayar-deneme/`) durduğu için sunucuyu etkilemez.
- **Depodaki `yapimcilar.json`'a bağlı.** 4. bölümün sonu sıfırlanan listede `github: 'KARANKOYU'` arar; dosyadaki liste
  değişirse bu denetim de güncellenmeli.
- **config.yml 30 saniyede bir yoklanır.** `site.js` dosyayı en çok 30 saniyede bir yeniden okur; paket config'i bir kez
  yazıp hiç değiştirmediği için etkilemez. Config'i paketin ortasında değiştiren bir adım eklenirse 30 saniye beklemek
  gerekir.
- **`okulDiskMb` burada denenmez.** Panelin yedinci ayarı (varsayılan okul disk sınırı) [test-okul-disk.md](test-okul-disk.md)'nin
  işi; 2. bölüm yalnız altı ayarın geldiğine bakar.
- **9. bölüm adresi değiştirip geri alır.** Geri alma müdürün kendi ucuyla yapılır; bu uç okul başına günde 10 gerçek
  değişikliğe izin verir (bellekte). Paket bunun birini kullanır. Paket 9. bölümün ortasında durursa okul
  `yeni-test-okulu-<z>` adresinde kalır; sonraki bir paket `test-ortaokulu` adresine güveniyorsa kalır
  (`tumtest.sh` her pakette sıfırladığı için sorun olmaz).
- **Paket iz bırakır:** ikinci okul ve müdürü, `islem_kaydi` satırları, müdüre bildirim. Bütün ayarlar sonunda sıfırlanır.
- **"Yönetici olmayanın isteği adresi değiştirmedi" zayıf bir denetim.** Yalnız `ele-gecir` adında bir okulun olmadığına
  bakar; asıl güvence bir önceki denetimdeki birebir 404'tür.

## Testleri

- Bu dosyanın kendisi testtir; `testler/tumtest.sh` her tam koşuda çalıştırır.
- Aynı alanda: [test-admin-gizli.md](test-admin-gizli.md) (`/admin` çerezi ve yönetici uçlarının gizliliği),
  `testler/test-yonetici-dosyasi.js` (`admins.json`'un canlı okunması; aralığı bu paket değiştirir),
  [test-okul-disk.md](test-okul-disk.md) (`okulDiskMb`), [test-adresler.md](test-adresler.md) (sitenin sayfa adresleri,
  bulunamayan adresler), [test-okul-sayfasi.md](test-okul-sayfasi.md) (okulun herkese açık giriş sayfası), [test-etut.md](test-etut.md)
  (`/api/uygulama`'nın girişsiz açık olması); `testler/girdi-denetimi.js` `POST /api/admin/site-ayarlari`'na ve
  `POST /api/admin/okul-adres`'e bozuk girdi gönderir; `testler/yetki-denetimi.js` `GET`/`POST /api/admin/site-ayarlari`'yı
  ve `GET /api/admin/okul-adresleri`'ni her rolle dener (yalnız yönetici geçmeli).
- Elle (Git Bash, proje kökünde; 3200'de [seed.md](seed.md) ile tohumlanmış test sunucusu ve `testler/testdata/ayarlar.json`
  varken):

  ```
  EE_BASE=http://localhost:3200 EE_LOG=testler/test-sunucu.log node testler/test-site-ayarlari.js
  ```

- 3 Ekim 2026'da bu belge için 3200'de, sıfırlanmış `egitimevi_test` ve seed'le koşuldu: `GECTI: 65   KALDI: 0`, yaklaşık
  2,3 saniye; sunucu günlüğünde `API hatası` / `Veritabanı hatası` yoktu; koşudan sonra `testler/testdata`'da yalnız
  `ayarlar.json` ve `okullar.json` kaldı (`site-ayar-deneme/` silinmişti). Belge denetiminde aynı gün yeniden koşuldu,
  sonuç aynıydı.

## Son durum

- `git log`: tek commit. Dosya `276c0a0 commit 521` (2026-09-27) ile 294 satır olarak eklendi; o günden beri değişmedi. Aynı
  büyük commit korunan kodun hepsini getirdi: `sunucu/bolumler/site-ayarlari.js` (yeni), `sunucu/veri/depo/site-ayarlari.js`
  (yeni), `sunucu/veri/sema/030-yonetim-paneli.sql` (`site_ayarlari` tablosu), `sunucu/site.js`'teki öncelik düzeni,
  `public/js/yonetim/09b-site-ayarlari.js` (panel), `sunucu/yonetici-dosyasi.js`, gizli `/admin`, çakışmalar
  (`test-cakisma.js`, `test-admin-gizli.js`, `test-yonetici-dosyasi.js` de o commit'te).
- Açık iş yok; kod değiştirilmedi.
- Planlı işlerden bu dosyayı etkileyecekler:
  - **"Sistem: … bakım modu, site duyurusu (zengin editör), sistem durumu, e-posta sağlığı + sayaç …"** — yeni site ayarları
    gelirse bu paket her biri için kaydetme / doğrulama / sıfırlama ve öncelik denemesiyle genişlemeli.
  - **"Paneller /panel/admin ve /panel/destek … /duzenle okul sayfaları"** — panelin adresi ve okul adresi düzenleme ekranı
    değişebilir; destek rolü geldiğinde 10. bölümdeki "yönetici olmayana 404" listesine destek de eklenmeli.
  - **"Arama motorunda görünme"** — `sitemap.xml` okul adreslerine dayanacak; adres değişince haritanın da yenilenmesi
    denenmeli.
  - **"Çok dil"** — `/api/site`'ın metinleri ve hata iletileri; paketteki "zaten", "Türkçe", "sitenin kendi" gibi metin
    aramaları dil seçiminden etkilenebilir.
