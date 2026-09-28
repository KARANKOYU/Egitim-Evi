# sunucu/bolumler/site-ayarlari.js

Yönetim panelinin "Site ayarları" ekranının sunucu tarafı: ayarları gösterir, doğrular, kaydeder ya da varsayılana
döndürür; bütün okulların adreslerini listeler ve yöneticinin bir okulun adresini değiştirmesini sağlar.

## Bu dosya ne yapar?

Sitenin birkaç ayarı vardır: iletişim bilgileri (e-posta, telefon), yapımcılar listesi, Play Store bağlantısı,
bildirim yoklama aralığı, "çevrimiçi" sayma süresi, `admins.json` okuma aralığı ve varsayılan okul disk sınırı. Bir
ayarın değeri üç yerden gelebilir; öncelik **veritabanı > `data/config.yml` > varsayılan** (disk sınırında
`EE_OKUL_DOSYA_GB` ortam değişkeni, yapımcılarda `yapimcilar.json` da kaynak olabilir). Ayarların anlamı ve bu
öncelik [site.md](../site.md)'de; bu dosya yöneticinin panelden yaptığı değişikliğin kapısıdır: doğrular, veritabanına
yazar (bellek de hemen güncellenir, sunucuyu yeniden başlatmak gerekmez), işlem kaydına OKULSUZ yazar (yalnız
yönetici görür).

`data/config.yml` web'den YAZILMAZ: "sıfırla" veritabanındaki değeri siler, ayar config.yml'deki (yoksa varsayılan)
değere döner.

Okul adresleri kısmı: yönetici her okulun `egitimevi.org/school/<kısa ad>` adresini görür ve değiştirebilir. Müdürün
kendi değiştirmesi ([hesaplar.md](hesaplar.md) `POST /api/school/adres`) aynen durur.

Uçlar [yonetici.md](yonetici.md)'den çağrılır; yönetici olmayana [api.md](../api.md) bilinmeyen adresle aynı 404'ü
verir.

## İçinde neler var?

### Sabitler (iç)

- `AD` — ayar anahtarı → ekrandaki adı: `iletisim` "İletişim bilgileri", `yapimcilar` "Yapımcılar", `playStore`
  "Play Store bağlantısı", `bildirimAralikDk` "Bildirim yoklama aralığı", `cevrimiciDk` "Çevrimiçi sayma süresi",
  `adminsAralikDk` "admins.json okuma aralığı", `okulDiskMb` "Varsayılan okul disk sınırı".
- `ISLEM` — ayar → işlem kaydı türü: `site.iletisim`, `site.yapimcilar`, `site.playstore`, üç aralık için
  `site.aralik`, disk için `site.okul-disk-siniri`.

### Dışa açık işlevler

- `gorunum()` → `{ ayarlar: { <anahtar>: { deger, kaynak, guncelleyen, zaman, en?, cok?, varsayilan? } }, sinirlar:
  { yapimciEnCok, adEnCok, katkiEnCok } }`. `kaynak`: `veritabani`, `config`, `dosya`, `ortam` ya da `varsayilan`.
  Aralık ayarlarına sınırlar (`site.ARALIKLAR`: bildirim 1–30, varsayılan 5; çevrimiçi 1–60, varsayılan 5; admins
  1–60, varsayılan 1 dakika), disk ayarına `site.OKUL_DISK` (1 MB – 10 TB, varsayılan 5120 MB) eklenir. Çevrimiçi
  süresinde ek alanlar: `etkin` (kullanılan değer: yoklama aralığından en az 1 dakika uzun olmalı), `not` (etkin
  değer farklıysa açıklama) ve `uyari` (yalnız yöneticinin kaydettiği ya da config.yml'deki değer kullanılamıyorsa;
  varsayılanlarla 5 ve 5 → 6 zaten kuralın kendisi, not yeter).
- `dogrula(anahtar, deger)` → `{ deger }` ya da `{ hata, alan, sira?, altAlan? }`:
  - `iletisim` — nesne olmalı; e-posta hesap e-postalarıyla aynı kuralda (`epostaSorunu`; Türkçe harf iletisi aynen
    gider) ve `site.EPOSTA`'ya uymalı (sayfadaki bağlantıya girdiği için `< > " '` olmaz); telefon en çok 24
    karakter, yalnız rakam, boşluk, `+`, tire, parantez ve `telefonSorunu`'ndan geçmeli;
  - `yapimcilar` — dizi, en çok `site.YAPIMCI_EN_COK` (50) kişi; her birinde ad zorunlu (en çok 60), GitHub adı
    `site.GITHUB_ADI`'na uymalı (harf, rakam, tire; en çok 39), katkı en çok 80 karakter. Hata satırın sırasını
    (`sira`) ve kutusunu (`altAlan`: `ad`, `github`, `katki`) söyler;
  - `playStore` — boş ya da `https://play.google.com/` ile başlayan bağlantı (`site.PLAY_STORE`);
  - `okulDiskMb` — `site.okulDiskTemizle`: 1 MB ile 10 TB arası tam sayı MB;
  - aralıklar — tam sayı (sayı ya da 1–4 haneli metin), sınırlar içinde;
  - başka anahtar: "Böyle bir ayar yok." Dışa açık ama bugün yalnız bu dosyada kullanılıyor.
- `ayarKaydet(req, res, me, body)` — `POST /api/admin/site-ayarlari`:
  - anahtar `site.AYAR_ANAHTARLARI`'nda değilse `400 { alan: 'anahtar' }`;
  - `{ anahtar, sifirla: true }`: değer veritabanındaysa silinir ve işlem kaydına "… değerine döndü (…)" yazılır;
    değilse yalnız ileti ("zaten panelden kaydedilmemiş."). `adminsAralikDk` ise yönetici dosyasının zamanlayıcısı
    yeniden kurulur (`yoneticiDosyasi.aralikDegisti()`);
  - `{ anahtar, deger }`: `deger` yoksa 400; doğrulanır (hata `400 { error, alan, sira?, altAlan? }`); değer ve kaynak
    aynıysa yazılmaz ("zaten böyle."); değer aynı ama config.yml'den ya da varsayılandan geliyorsa panelden
    SABİTLENİR (kayıtta "… değeri panelden sabitlendi"); değişiyorsa yazılır, kayıtta aralık ve diskte "eski → yeni";
  - cevap: `gorunum()` + `message`.
- `okulAdresleri(res)` — `GET /api/admin/okul-adresleri` → `{ okullar: [{ id, ad, il, ilce, durum, kisaAd, adres:
  '/school/<kısa ad>' }], siteAdresi }` (`siteAdresi` `data/config.yml`'deki site adresi, sondaki `/` atılmış).
- `okulAdresiDegistir(req, res, me, body)` — `POST /api/admin/okul-adres { okulId, kisaAd }`: okul yoksa ya da
  reddedilmişse 404 (`alan: 'okulId'`); `kisaAd` küçük harfe çevrilip `kisaAdSorunu` ile denetlenir; aynıysa
  "Okulun adresi zaten bu."; başka okuldaysa 400 (`alan: 'kisaAd'`; aynı anda alınırsa tekil indeks `23505` da aynı
  iletiye çevrilir). Yazınca okul önbelleği boşalır (eski adres hemen "Okul bulunamadı"), işlem kaydı
  `okul.adres-yonetici` ("<okul>: <eski> → <yeni>"), okulun onaylı müdürlerine bildirim ("… Eski adres artık
  açılmıyor.") → `{ okul: { id, ad, kisaAd, adres }, eskiKisaAd, message }`.

### İç işlevler

- `ozet(anahtar, deger)` — işlem kaydındaki kısa açıklama (iletişimde e-posta ve telefon, yapımcılarda sayı ve adlar,
  diskte okunur boyut `okulDisk.boyutYaz`, aralıklarda "N dk").
- `kaynakAdi(kaynak)` — `config.yml`, `yapimcilar.json`, `EE_OKUL_DOSYA_GB` ya da `varsayılan`.
- `siteAdresi()` — `ayarlar.site.adres`'ten.

## Kimle konuşur?

- Çağırdıkları:
  - `../site` ([site.md](../site.md)) — `AYAR_ANAHTARLARI`, `ayarKaynakli`, `ARALIKLAR`, `OKUL_DISK`,
    `cevrimiciEtkinDk`, `YAPIMCI_EN_COK`, `YAPIMCI_AD_EN_COK`, `YAPIMCI_KATKI_EN_COK`, `EPOSTA`, `GITHUB_ADI`,
    `PLAY_STORE`, `okulDiskTemizle`;
  - `../ayarlar` ([ayarlar.md](../ayarlar.md)) — `ayarlar.site.adres`;
  - `../ortak` ([ortak.md](../ortak.md)) — `clean`, `epostaSorunu`, `kisaAdSorunu`, `telefonSorunu`;
  - `../http` ([http.md](../http.md)) — `ok`, `sendJSON`, `okulOnbellekBosalt`;
  - `../yonetici-dosyasi` ([yonetici-dosyasi.md](../yonetici-dosyasi.md)) — `aralikDegisti` (gerektiğinde içeride
    `require`);
  - [okul-disk.md](okul-disk.md) — `boyutYaz`, `MB`;
  - `./islem-kaydi` — `islemYaz`; `../veri` — `depo`, `topluBildir`.
- Veri tabloları:
  - `depo.siteAyarlari` → `site_ayarlari` (`yaz`, `sil`; açılışta belleğe okunur, yazınca bellek de güncellenir);
  - `depo.okullar` → `okullar`: `bul`, `adresListesi` (+ `kullanicilar`), `kisaAdVarMi`, `kisaAdYaz`,
    `mudurKimlikleri` (`kullanicilar`'dan onaylı müdürler);
  - `topluBildir` → `bildirimler`; `islemYaz` → `islem_kaydi`.
- Onu çağıran: [yonetici.md](yonetici.md) (`site-ayarlari` GET/POST, `okul-adresleri`, `okul-adres`).
- Ön yüz: `public/js/yonetim/09b-site-ayarlari.js`.
- Ayarların kullanıldığı yerler: `GET /api/site`, `/api/me` (`bildirimAralikDk`), `/api/uygulama`
  ([site.md](../site.md), [uygulama-surum.md](../uygulama-surum.md)), yönetici dosyası zamanlayıcısı, okul disk
  sınırı.
- Android uygulaması bu uçları çağırmıyor; herkese açık `/api/site`'yi okur.

## Nasıl çalışır (adım adım)?

```
POST /api/admin/site-ayarlari { anahtar, deger }
  anahtar bilinen mi?                         hayır → 400
  onceki = site.ayarKaynakli(anahtar)          (değer + kaynak)
  dogrula(anahtar, deger)                     hata → 400 { alan, sira?, altAlan? }
  değer aynı ve kaynak veritabanı?            → "zaten böyle." (yazılmaz)
  değilse depo.siteAyarlari.yaz (tablo + bellek)
          işlem kaydı (eski → yeni ya da "sabitlendi")
          adminsAralikDk ise zamanlayıcı yeniden kurulur
  → gorunum() + message
```

## Dikkat!

- **Hemen geçerli, tek süreç varsayımı:** ayar belleğe de yazılır; sunucu yeniden başlamadan `/api/site` ve
  `/api/me` yeni değeri verir. Aynı veritabanını kullanan ikinci bir süreç olsaydı değişikliği ancak yeniden
  açılınca görürdü (depo dosyasının notu).
- **config.yml web'den yazılmaz:** "Sıfırla" yalnız veritabanı kaydını siler; dosyayı yalnız sunucuyu kuran kişi
  elle değiştirir.
- **Sabitleme:** config.yml'den gelen değer panelden aynen kaydedilirse veritabanına yazılır; sonra config.yml
  değişse de panel değeri kalır. İşlem kaydı bunu açıkça söyler.
- **Çevrimiçi süre ≥ yoklama + 1 dakika:** daha kısa bir değer kaydedilebilir ama kullanılmaz; ekran `uyari` ile
  söyler. Sebep (`site.js`): açık sayfa ancak yoklama aralığıyla istek gönderir; süre ondan kısa olsaydı açık olan
  kişi iki yoklama arasında "kapalı" görünürdü.
- **İletişim e-postası sayfaya bağlantı olarak girer:** bu yüzden hesap e-postalarından da sıkı (`site.EPOSTA`), HTML
  kıran karakterlere izin yok.
- **Okul adresi değişince eski adres hemen ölür** ve müdür bildirim alır; eski bağlantıları paylaşan okul yeni
  adresi duyurmalı.
- İşlem kaydı okulsuz yazılır (yöneticinin okulu yok): müdürlerin işlem kaydı ekranında görünmez.
- Varsayılan disk sınırı değişince yalnız KENDİ sınırı olmayan okulları etkiler (okulun sınırı `null` ise
  varsayılan kullanılır; hesap `okul-disk.js`'te).

## Testleri

- `testler/test-site-ayarlari.js` — öncelik (veritabanı > config.yml > varsayılan; geçici config.yml ile);
  iletişim, yapımcılar, Play Store ve üç aralık için kaydetme, doğrulama ve hata alanları, "sıfırla"; değişikliğin
  sunucu yeniden başlamadan `/api/site`, `/api/me`, `/api/uygulama`'da görünmesi; çevrimiçi sürenin yoklama + 1 dakika
  kuralı; işlem kaydının okulsuz yazılması (müdür görmez); okul adresi değiştirme (doğrulama, eski adresin hemen
  "Okul bulunamadı" olması, müdüre bildirim, müdürün kendi değiştirmesinin çalışması); yönetici olmayana 404.
- `testler/test-okul-disk.js` — "Varsayılan okul disk sınırı" (kaynak "ortam", kaydetme, "Varsayılana dön",
  doğrulama, işlem kaydı `site.okul-disk-siniri`).
- `testler/test-admin-gizli.js`, `testler/girdi-denetimi.js`, `testler/yetki-denetimi.js` — gizlilik, bozuk girdi,
  rol × uç.
- Elle: yöneticiyle `/admin` panelinde Site Ayarları; bir aralığı değiştirip `/api/site`'ye bak.

## Son durum

- Son commit `40fc7e7 commit 525` (2026-09-27, okul disk sınırı): yeni ayar `okulDiskMb` ("Varsayılan okul disk
  sınırı"): doğrulama, sınırlar (`site.OKUL_DISK`), işlem kaydı türü `site.okul-disk-siniri`, kaynak `ortam`
  (`EE_OKUL_DOSYA_GB`); kayıtta diskin eski değeri de yazılır.
- Ondan önce `276c0a0 commit 521` (gizli yönetim paneli, site ayarları): dosya bu işte eklendi.
- Açık iş yok. Sıradaki "Sistem" işi (bakım modu, site duyurusu, e-posta sağlığı) buraya yeni ayar anahtarları
  ekleyecek.
