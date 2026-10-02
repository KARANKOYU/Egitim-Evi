# public/js/yonetim/09b-site-ayarlari.js

Yönetim paneli > Site Ayarları: sitenin herkese görünen iletişim bilgileri, yapımcılar listesi, Play Store bağlantısı,
üç zamanlama, varsayılan okul disk sınırı ve okulların giriş adresleri; her kartın "Kaydet" / "Varsayılana dön" akışı.

## Bu dosya ne yapar?

Bazı bilgiler koda yazılamaz: depo herkese açık, sitenin iletişim e-postası ya da telefonu oraya konmaz; yapımcı listesi,
uygulamanın Play Store adresi, bildirimlerin ne sıklıkla yoklandığı da sunucuyu yeniden başlatmadan değişebilmeli. Bu
ekran yöneticinin bunları değiştirdiği yerdir. Kaydedilen değer veritabanına yazılır ve **hemen** geçerli olur.

Bir ayarın değeri şu sırayla bulunur (kurallar [../../../sunucu/site.md](../../../sunucu/site.md)'de):
**panelden kaydedilen (veritabanı)** > sunucudaki `data/config.yml` > varsayılan. Yapımcılarda config yerine depodaki
`yapimcilar.json`, varsayılan okul disk sınırında `EE_OKUL_DOSYA_GB` ortam değişkeni vardır. Her kart değerin şu an
nereden geldiğini yazar ("Panelden kaydedildi · Ad Soyad · 27.09.2026 13:20", "data/config.yml", "Varsayılan"…);
panelden kaydedilmiş değer **Varsayılana dön** ile bırakılır (veritabanındaki satır silinir, değer bir alttaki kaynağa
düşer). `data/config.yml` web'den hiç yazılmaz.

Kartlar, sayfadaki sırayla:

1. **İletişim bilgileri** — e-posta ve telefon: sayfaların alt bilgisinde, Hakkında'da ve "+ Ekle > Müdür" penceresinde.
2. **Yapımcılar** — üst şeritteki "Yapımcılar" listesi ve Hakkında: ad, isteğe bağlı GitHub kullanıcı adı ve katkı;
   satır ekleme, sıralama, çıkarma.
3. **Play Store bağlantısı** — İndir sayfasındaki "Google Play'den yükle" düğmesinin adresi (boşsa düğme yok).
4. **Zamanlamalar** — bildirim yoklama aralığı, çevrimiçi sayma süresi, `admins.json` okuma aralığı (dakika).
5. **Varsayılan okul disk sınırı** — özel sınırı olmayan okulların dosya alanı.
6. **Okul adresleri** — her okulun `<site>/school/<ad>` adresi; değiştirme penceresi.

Doğrulama sunucudakinin aynısıdır (kişi beklemeden kutunun altında görsün); sunucu yine her şeyi baştan denetler, onun
hatası da ilgili kutunun altına yazılır. Ekranı yalnız **sistem yöneticisi** görür; dosya yalnız yönetim paketindedir
(`/admin/yonetim.js`, bkz. [09-yonetici.md](09-yonetici.md) "Bu dosya ne yapar?").

## İçinde neler var?

### Durum ve sabitler

- `SA` — `{ veri, yapimcilar, okullar, siteAdresi }`: `veri` = `GET /api/admin/site-ayarlari` cevabı (`{ ayarlar, sinirlar }`);
  `yapimcilar` = ekrandaki yapımcı satırlarının kopyası (`{ ad, github, katki }`); `okullar` ve `siteAdresi` =
  `GET /api/admin/okul-adresleri` cevabı.
- `SA_KAYNAK` — kaynak kodu → etiket: `veritabani` "Panelden kaydedildi", `config` "data/config.yml", `dosya`
  "yapimcilar.json", `ortam` "EE_OKUL_DOSYA_GB ortam değişkeni", `varsayilan` "Varsayılan".
- `SA_ARALIK` — üç zamanlama, her biri `{ k, id, ad, aciklama }`:
  - `bildirimAralikDk` / `#saBildirim` — "Bildirim yoklama aralığı": açık sayfalar bu aralıkla yeni bildirim sorar;
    sekmeye dönülünce ve bildirim paneli açılınca beklemeden sorulur.
  - `cevrimiciDk` / `#saCevrimici` — "Çevrimiçi sayma süresi": son bu kadar dakikada sayfası açık olan açılış sayfasında
    "şu an açık" sayılır; sunucu en az yoklama aralığı + 1 dakika kullanır.
  - `adminsAralikDk` / `#saAdmins` — "admins.json okuma aralığı": sunucu `data/admins.json` değişti mi diye bu aralıkla
    bakar.
  Sınırlar (en az, en çok, varsayılan) sunucudan gelir (`a.en`, `a.cok`, `a.varsayilan`; bugün 1–30/5, 1–60/5, 1–60/1).
- `SA_ALAN` — sunucunun hata cevabındaki `alan` → kutu: `eposta` → `#saEposta`, `telefon` → `#saTelefon`, `playStore` →
  `#saPlay`, üç zamanlama → kendi kutuları, `okulDiskMb` → `#saDiskDeger`. Yapımcı satırları ayrıca (`saHata`).
- `SA_EPOSTA`, `SA_PLAY`, `SA_GITHUB` — sunucudaki `site.js` `EPOSTA`, `PLAY_STORE`, `GITHUB_ADI` desenlerinin
  aynısı: e-posta yalnız ASCII ve `< > " '` yok; Play adresi `https://play.google.com/` ile başlar (4–300 karakter
  devamı, boşluk ve tırnak yok); GitHub adı harf/rakam/tire, tireyle başlayıp bitmez, en çok 39.

### Küçük yardımcılar

- `saHost()` — okul adreslerinde gösterilen site adı: sunucunun `data/ayarlar.json`'daki site adresi (`https://`
  ve sondaki `/` atılır), yoksa bu sayfanın `location.host`'u.
- `saKopya(liste)` — yapımcı listesinin kopyası (eksik alanlar `''`).
- `saAralik(anahtar)` — `SA_ARALIK`'taki tanım ya da `null`.
- `saMesajYeri(anahtar)` — kartın ileti yeri: zamanlamada `<id>Mesaj` (`#saBildirimMesaj`…), ötekilerde
  `#saIletisimMesaj`, `#saYapimciMesaj`, `#saPlayMesaj`, `#saDiskMesaj`; bilinmeyen anahtarda iletişiminki.

### Sayfa

- **`SAYFALAR['site-ayarlari']`** (`#/site-ayarlari`) — iki isteği birlikte atar (`Promise.all`): `GET
  /api/admin/site-ayarlari` ve `GET /api/admin/okul-adresleri`. `SA`'yı doldurur ve çizer: başlık "SİTE AYARLARI" ("…
  Kaydettiğin değer hemen geçerli olur; sunucuyu yeniden başlatmak gerekmez."), mavi bilgi kutusu (değerin geldiği
  yerler) ve altı kart.

### Kartların ortak parçaları

- `saKaynak(a)` — "Şu anki değer: [etiket]" satırı (`.kaynak-satir`); panelden kaydedildiyse mavi etiket ve "kaydeden ·
  tarih saat", değilse gri etiket.
- `saDugmeler(anahtar, a, kaydetAd, donusAd)` — **Kaydet** (`data-act="sa-kaydet" data-anahtar="<anahtar>"`) ve yalnız
  değer panelden geliyorsa **Varsayılana dön** (`sa-sifirla`). Yapımcılarda adları "Listeyi kaydet" / "yapimcilar.json
  listesine dön".
- `saKartDegistir(id, html)` — yalnız o kartı yeni HTML ile değiştirir; öbür kartlardaki yazılanlar yerinde kalır.

### 1. İletişim bilgileri — `saIletisimKarti()` (`#saKartIletisim`)

`ayarlar.iletisim.deger = { eposta, telefon }`. Kutular: **E-posta** `#saEposta` (`type=email`, en çok 254,
örnek "iletisim@ornek.org") ve **Telefon** `#saTelefon` (`type=text`, `inputmode=tel`, en çok 24; "Ülke koduyla ya da
başında 0 ile yaz; sayfada yazdığın gibi görünür."). Telefon kutusu `type="tel"` değil (kodda gerekçesi yazılı değil,
ama ipucu "yazdığın gibi görünür" diyor): öyle olsaydı [../parcalar/04c-telefon.md](../parcalar/04c-telefon.md) onu
kendiliğinden ülke seçicili alana çevirirdi. İkisi de boş bırakılabilir.

### 2. Yapımcılar — `saYapimciKarti()` (`#saKartYapimci`)

- Açıklama: üst şeritteki Yapımcılar listesi ve Hakkında; GitHub adı yazılırsa ad o kişinin GitHub sayfasına bağlanır;
  en fazla `sinirlar.yapimciEnCok` kişi (bugün sunucu sabiti); sıra oklarla değişir.
- `saYapimciSatirlari()` — liste boşsa "Listede kimse yok. Boş liste kaydedilirse sayfalarda yalnız projenin sahibi
  görünür." Her satır (`.sirali-satir`): sıra numarası, **Ad** `#saYAd<i>` (en çok `sinirlar.adEnCok`), **GitHub
  kullanıcı adı** `#saYGh<i>` (en çok 60 karakter yazılabilir; denetim 39), **Katkısı** `#saYKatki<i>` (en çok
  `sinirlar.katkiEnCok`); simge düğmeleri **Yukarı taşı** / **Aşağı taşı** (`sa-yapimci-tasi`, `data-sira`, `data-yon`
  -1/1; uçtakiler kapalı) ve **Listeden çıkar** (`sa-yapimci-sil`), her birinde "N. yapımcıyı …" `aria-label`'ı.
- `saYapimcilariOku()` — kutulardaki yazılanları `SA.yapimcilar`'a geri yazar (yeniden çizmeden önce, yazılan
  kaybolmasın).
- `saYapimcilariCiz(odak)` — `#saYapimciListe`'yi yeniden çizer, odağı verilen seçicideki öğeye koyar.
- **`EYLEMLER['sa-yapimci-ekle']`** — sınır doluysa "En fazla N yapımcı eklenebilir."; değilse boş satır ekler, odak yeni
  satırın Ad kutusuna; `S._sayfaDegisti = true`.
- **`EYLEMLER['sa-yapimci-sil']`** (`el`: basılan düğme) — satırı çıkarır; odak aynı sıradaki (yoksa bir öncekindeki) "çıkar" düğmesine,
  liste boşaldıysa "Yapımcı ekle"ye; `S._sayfaDegisti = true`.
- **`EYLEMLER['sa-yapimci-tasi']`** (`el`: basılan düğme) — satırı bir yukarı/aşağı alır; odak taşınan satırla gider, uca vardıysa öbür
  yöndeki ok düğmesine; `S._sayfaDegisti = true`.

### 3. Play Store bağlantısı — `saPlayKarti()` (`#saKartPlay`)

**Bağlantı** `#saPlay` (`type=url`, en çok 330); "Yalnız https://play.google.com/ ile başlayan adres." Değişiklik İndir
sayfası yeniden açılınca görünür.

### 4. Zamanlamalar — `saAralikKarti()` (`#saKartAralik`)

`SA_ARALIK`'taki her ayar için bir blok (`.ayar-blok`): sayı kutusu (`min`/`max` sunucudan), "dakika", kendi küçük
**Kaydet** ve (panelden geliyorsa) **Varsayılana dön** düğmesi; altta açıklama + ayarın kendi sınırları ("1–30 dakika;
varsayılan 5." bildirimde, "1–60 dakika; varsayılan 5." çevrimiçinde, "1–60 dakika; varsayılan 1." admins.json'da);
kaynak satırı; ileti yeri `<id>Mesaj`. Ek olarak:
- `cevrimiciDk`'da sunucu `uyari` gönderdiyse sarı kutu (kaydedilen ya da config'teki süre kullanılamıyor: yoklama
  aralığından kısa), yalnız `not` geldiyse soluk not ("Kullanılan: 6 dakika (…)").
- `adminsAralikDk`'da "Son okuma, açılan ve atlanan satırlar:" + **Yönetici Dosyası** (`data-nav="yonetici-dosyasi"`,
  [09c-yonetici-dosyasi.md](09c-yonetici-dosyasi.md)).

### 5. Varsayılan okul disk sınırı — `saDiskKarti()` (`#saKartDisk`)

Açıklama (okulun dosyaları sınıra sayılır; okul açılırken ve Okullar listesinde her okula ayrı sınır verilebilir; ayrı
sınırı olmayan okullar bu değeri kullanır; sınır küçülürse dosya silinmez, yalnız yeni yükleme durur), kaynak satırı,
`diskSiniriAlani('saDisk', a.deger, null, 'Sınır', true)` ([09d-okul-disk.md](09d-okul-disk.md); sayı `#saDiskDeger` +
birim `#saDiskBirim`, öneri satırı ve "Öneriyi kullan" YOK), "1 MB ile 10 TB arası; kodun varsayılanı 5 GB. Panelden
kaydedilmediyse sunucudaki EE_OKUL_DOSYA_GB ortam değişkeni (verilmişse) geçerlidir.", Kaydet / Varsayılana dön ve
"Her okulun sınırı, doluluğu ve diskteki boş yer:" + **Okullar** (`data-nav="okullar"`, [09-yonetici.md](09-yonetici.md)).

### Kaydet ve varsayılana dön

- **`saDegerOku(anahtar)`** — kartın kutularından değeri okur; sorun varsa `alanHatasi` ile kutunun altına yazar (kart
  `.hatali` taşır):
  - `iletisim` → `{ eposta, telefon }`. E-posta: adres `x@y.zz` biçimindeyken içinde ASCII dışı (Türkçe ya da başka
    alfabeden) harf varsa "E-posta adresinde Türkçe ya da başka alfabeden harf olamaz (ı, ş, ğ, ü, ö, ç gibi); İngilizce
    harflerle yaz."; öbür durumlarda 254'ten uzun ya da `SA_EPOSTA`'ya uymuyorsa "E-posta adresi geçerli değil (ör.
    iletisim@egitimevi.org)." Telefon (birden çok boşluk teke iner): 24'ten uzun ya
    da rakam, boşluk, `+`, tire, parantez dışında karakter → "Telefonda yalnız rakam, boşluk, +, tire ve parantez olabilir
    (en fazla 24 karakter)."; sonra `telefonSorunuTR` ("Telefon numarasını ülke koduyla yaz.", "Türkiye numarası 10 haneli
    olmalı (5xx xxx xx xx).").
  - `playStore` → metin; boş değilse `SA_PLAY` → "Bağlantı https://play.google.com/ ile başlamalı (ör. …)."
  - `yapimcilar` → `{ liste, sira }`. Önce kutular okunur. Bütünüyle boş satır atlanır (gönderilmez). Ad ve katkıdaki
    boşluklar teke iner; GitHub kutusuna `@ad` ya da `https://github.com/ad/` yapıştırıldıysa yalnız ad alınır. Ad yoksa
    "Adını yaz.", uzunsa "Ad en fazla N karakter olabilir."; GitHub adı uymuyorsa "Yalnız harf, rakam ve tire olabilir;
    tireyle başlayıp bitemez (en fazla 39 karakter)."; katkı uzunsa "Katkı en fazla N karakter olabilir." `sira[k]`:
    gönderilen k. satırın ekrandaki sırası (boş satırlar atlandığı için ikisi farklı olabilir).
  - `okulDiskMb` → `diskSiniriOku('saDisk')` (MB; geçersizse hata yazılır ve 0 döner — kaydetme hata yüzünden zaten
    gitmez).
  - zamanlamalar → 1–4 haneli tam sayı ve `a.en`–`a.cok` arası; değilse "<ad> <en az> ile <en çok> dakika arasında bir
    tam sayı olmalı." (ör. "Bildirim yoklama aralığı 1 ile 30 dakika arasında bir tam sayı olmalı.", öbür ikisinde 1 ile
    60; sınırlar sunucudan gelir, sunucunun iletisiyle aynı kalıp). Sayı döner.
- **`EYLEMLER['sa-kaydet']`** (`el`: basılan düğme) — düğmenin kartındaki eski hataları ve iletiyi siler, `saDegerOku`; hata varsa ilk hatalı
  kutuya gider. Yoksa düğme "Kaydediliyor..." → `POST /api/admin/site-ayarlari { anahtar, deger }` → `saSonuc`; hata →
  düğme açılır, `saHata`.
- **`EYLEMLER['sa-sifirla']`** (`el`: basılan düğme) — onay. Metinler: yapımcılarda "Panelden kaydedilen yapımcı listesi silinsin mi? Liste
  depodaki yapimcilar.json dosyasından gelir.", disk sınırında "… Sunucuda EE_OKUL_DOSYA_GB verilmişse o, verilmemişse 5 GB
  geçerli olur.", ötekilerde "… Ayar sunucudaki data/config.yml dosyasındaki değere, orada da yoksa varsayılana döner."
  Evet → "Siliniyor..." → `POST /api/admin/site-ayarlari { anahtar, sifirla: true }` → `saSonuc`; hata kartın ileti
  yerine.
- **`saSonuc(anahtar, d)`** — cevaptaki `{ ayarlar, sinirlar }` `SA.veri` olur; yalnız o kart yeniden çizilir ve bu
  sekmede hemen etkisi görülür:
  - `iletisim` → kart + `iletisimCiz(deger)` (bu sayfanın alt bilgisindeki iletişim satırı,
    [../parcalar/05a-dis-sayfalar.md](../parcalar/05a-dis-sayfalar.md));
  - `yapimcilar` → `SA.yapimcilar` sunucunun temizlediği listeyle yenilenir, kart + `yapimcilariCiz(liste)` (üst şerit ve
    Hakkında listeleri);
  - `playStore`, `okulDiskMb` → yalnız kart;
  - zamanlamalar → bütün zamanlama kartı yeniden çizilir (çevrimiçi uyarısı yoklama aralığına bağlı), ama öbür iki kutuya
    yazılmış, kaydedilmemiş sayılar geri konur; `bildirimAralikDk` ise bu sekmenin yoklama sayacı da yeni aralıkla kurulur
    (`bildirimAraligiAl`, [../parcalar/24-bildirim-arama-mobil.md](../parcalar/24-bildirim-arama-mobil.md)).
  Sonra kartın ileti yerine sunucunun yeşil iletisi ("… kaydedildi.", "… zaten böyle.", "… panelden kaydedildi; değer aynı
  kaldı.", "… panelden kaydedilen değeri bıraktı."); 6 sn sonra kaybolur.
- **`saHata(e, anahtar, sira)`** — `e.veri.alan === 'yapimcilar'` ve `sira` sayıysa: sunucunun söylediği gönderilen satır
  `sira[]` ile ekrandaki satıra çevrilir, `altAlan`'a göre (`github` → `#saYGh`, `katki` → `#saYKatki`, değilse
  `#saYAd`) kutunun altına yazılır. Başka alanlar `SA_ALAN` ile kutuya. Kutu bulunamazsa ileti kartın ileti yerine
  (ör. "En fazla N yapımcı eklenebilir.", "Böyle bir ayar yok.").

### 6. Okul adresleri — `saOkulKarti()` (`#saKartOkul`)

- Açıklama: öğrenci, öğretmen ve servisçiler okullarına bu adresten girer (`<site>/school/…`); müdür kendi okulunun
  adresini de değiştirebilir; adres değişince eski adres hemen çalışmaz olur; "Üstteki arama kutusu listeyi süzer." İleti
  yeri `#saOkulSonuc`.
- Okul yoksa "Henüz okul yok."; varsa her okul (kapatılmış/`rejected` okullar listede yok) bir satır: ad, "ilçe, il",
  adres (`<site>/school/<ad>` ya da "Adresi yok"), müdürü kaldırılmış okulda turuncu **Müdür bekliyor**; düğme **Adresi
  değiştir** ya da **Adres ver** (`data-act="sa-okul-adres"`, `data-id`). Satırın `data-ara`'sı ad + il + ilçe + adres:
  sayfanın arama kutusu yalnız bu listeyi süzer (öbür kartlarda `data-ara` yok).
- `saOkulBul(id)` — `SA.okullar`'da okul.
- **`EYLEMLER['sa-okul-adres'](el, id)`** — pencere "Okulun adresi": okul adı · ilçe, il; **Adres adı** `#saOkulKisa`
  (önünde `<site>/school/`, en çok 40); ipucu "Küçük harf (Türkçe harf olmadan), rakam ve tire; 3–40 karakter."; okulun
  adresi varsa sarı uyarı (eski adres hemen çalışmaz olur, onu kaydetmiş öğrenci ve öğretmenler okulu bulamaz; müdüre
  bildirim gider; yeni adresi okula duyurmak gerekir); ileti yeri `#saOkulMesaj`; **Vazgeç** / **Adresi kaydet**
  (`sa-okul-adres-kaydet`). Kutu yazarken adres kuralına çevrilir ([../parcalar/16b-okul-ayarlari.md](../parcalar/16b-okul-ayarlari.md)
  gibi): `aramaSadeTR` ile Türkçe harfler düzlenir, büyük harf küçülür, boşluk ve noktalama tireye döner; yazılan son
  karakter tire/boşluksa sonda bir tire bırakılır (yazmaya devam edilebilsin). Enter kaydeder; açılınca odak kutuda.
- **`EYLEMLER['sa-okul-adres-kaydet'](el, id)`** — sondaki tireler atılır, `okulAdresiSorunuTR` (boş, 3'ten kısa, 40'tan
  uzun, biçim, çift tire) hatası kutunun altına; adres değişmediyse "Okulun adresi zaten bu." (bilgi). Değilse
  "Kaydediliyor..." → `POST /api/admin/okul-adres { okulId, kisaAd }` → `SA.okullar`'daki okulun adresi güncellenir,
  pencere kapanır, kart yeniden çizilir, arama süzgeci yeniden uygulanır (`araUygula`), `#saOkulSonuc`'a sarı ileti
  (sunucunun "Okulun adresi değişti. Eski adres (/school/…) artık açılmıyor. Okulun müdürüne bildirildi."; kendiliğinden
  kaybolmaz) ve o yere kaydırılır. Hata: `alan === 'kisaAd'` (yasak ad, başka okulda, biçim) kutunun altına, başkası
  pencerenin ileti yerine.

### Eylem ve kutu özeti

| `data-act` | Kart | Gönderilen |
|---|---|---|
| `sa-kaydet` (`data-anahtar`) | her kart | `POST /api/admin/site-ayarlari { anahtar, deger }` |
| `sa-sifirla` (`data-anahtar`) | panelden kaydedilmişse | `POST /api/admin/site-ayarlari { anahtar, sifirla: true }` |
| `sa-yapimci-ekle`, `sa-yapimci-sil`, `sa-yapimci-tasi` | Yapımcılar | yok (yalnız ekranda; "Listeyi kaydet" gönderir) |
| `sa-okul-adres` | Okul adresleri | yok (pencere) |
| `sa-okul-adres-kaydet` | Okul adresi penceresi | `POST /api/admin/okul-adres { okulId, kisaAd }` |

`anahtar` değerleri: `iletisim`, `yapimcilar`, `playStore`, `bildirimAralikDk`, `cevrimiciDk`, `adminsAralikDk`,
`okulDiskMb` (sunucudaki `AYAR_ANAHTARLARI`).

## Kimle konuşur?

- **Sunucu uçları** ([../../../sunucu/bolumler/site-ayarlari.md](../../../sunucu/bolumler/site-ayarlari.md); yönlendirme
  [../../../sunucu/bolumler/yonetici.md](../../../sunucu/bolumler/yonetici.md)):
  - `GET /api/admin/site-ayarlari` → `{ ayarlar: { <anahtar>: { deger, kaynak, guncelleyen, zaman, en?, cok?, varsayilan?,
    etkin?, not?, uyari? } }, sinirlar: { yapimciEnCok, adEnCok, katkiEnCok } }`;
  - `POST /api/admin/site-ayarlari` → aynı görünüm + `message`; hata `{ error, alan, sira?, altAlan? }`; işlem kaydına
    okulsuz yazılır (yalnız yönetici görür);
  - `GET /api/admin/okul-adresleri` → `{ okullar: [{ id, ad, il, ilce, durum, kisaAd, adres }], siteAdresi }`;
  - `POST /api/admin/okul-adres` → `{ okul, eskiKisaAd, message }`; okul önbelleği boşalır, müdürlere bildirim, işlem
    kaydı.
  - Ayarların anlamı, öncelik sırası ve desenler: [../../../sunucu/site.md](../../../sunucu/site.md); sitenin adresi
    `data/ayarlar.json` ([../../../sunucu/ayarlar.md](../../../sunucu/ayarlar.md)); `admins.json` aralığı değişince sunucu
    bekleyen yoklamayı yeni aralıkla kurar ([../../../sunucu/yonetici-dosyasi.md](../../../sunucu/yonetici-dosyasi.md)).
- **Çağırdıkları (ön yüz):**
  - [../parcalar/01-yardimcilar.md](../parcalar/01-yardimcilar.md) — `$`, `esc`, `api`, `EYLEMLER`;
  - [../parcalar/02-ikonlar.md](../parcalar/02-ikonlar.md) — `ik` (`posta`, `grup`, `ekle`, `hayir`, `indir`, `saat`,
    `kutu`, `okul`), `tarihSaat`; `ik('yukari')` / `ik('asagi')` simgeleri ise [../parcalar/14c-quiz.md](../parcalar/14c-quiz.md)'nin
    `IKONLAR`'a eklediği oklar;
  - [../parcalar/03-mesaj-modal.md](../parcalar/03-mesaj-modal.md) — `mesajGoster`, `modalAc`, `modalKapat`;
  - [../parcalar/04a-form-alanlari.md](../parcalar/04a-form-alanlari.md) — `alanHatasi`, `alanTemizle`, `formHatalariniSil`,
    `ilkHatayaGit`;
  - [../parcalar/04c-telefon.md](../parcalar/04c-telefon.md) — `telefonSorunuTR`;
  - [../parcalar/05-giris.md](../parcalar/05-giris.md) — `aramaSadeTR`, `dugmeBekle`, `dugmeBitir`;
  - [../parcalar/05a-dis-sayfalar.md](../parcalar/05a-dis-sayfalar.md) — `iletisimCiz`, `yapimcilariCiz`;
  - [../parcalar/07-yonlendirme.md](../parcalar/07-yonlendirme.md) — `hero`, `yaz`, `bosKutu`; `S._sayfaDegisti`
    ("Yenile" düğmesi kaydedilmemiş değişiklikte sorar);
  - [../parcalar/08d-okul-disk.md](../parcalar/08d-okul-disk.md) — `diskYaz`;
  - [09d-okul-disk.md](09d-okul-disk.md) — `diskSiniriAlani`, `diskSiniriOku`, `OKUL_DISK_MB`;
  - [../parcalar/16b-okul-ayarlari.md](../parcalar/16b-okul-ayarlari.md) — `okulAdresiSorunuTR`;
  - [../parcalar/24-bildirim-arama-mobil.md](../parcalar/24-bildirim-arama-mobil.md) — `bildirimAraligiAl`, `araUygula`.
- **Onu açanlar:** [09a-yonetim-paneli.md](09a-yonetim-paneli.md) (menü ve kutucuk "Site Ayarları"),
  [09-yonetici.md](09-yonetici.md) (Okullar sayfasının altındaki geçiş), [09c-yonetici-dosyasi.md](09c-yonetici-dosyasi.md)
  ("Aralığı değiştir"), [09d-okul-disk.md](09d-okul-disk.md) (Disk kartındaki "Site Ayarları"); `araclar/gezinti.js`
  ekran turu (sayfa, yapımcı ekleme ve hatalar, okul adresi penceresi).
- **Ayarların göründüğü yerler (herkes):** alt bilgi ve Hakkında'daki iletişim, "+ Ekle > Müdür" penceresi, üst şeritteki
  Yapımcılar, İndir sayfası (Play düğmesi), bildirim sayacı, açılış sayfasındaki "şu an açık" sayısı, okulların disk sınırı,
  `/school/<ad>` adresleri.
- **CSS:** `public/css/parcalar/36-ayar-kartlari.css` (`.ayar-kart`, `.kart-aciklama`, `.kaynak-satir`, `.ayar-blok`,
  `.sayi-satir`, `.birim`, `.sirali-liste`, `.sirali-satir`, `.sirali-no`, `.sirali-dugmeler`, `.disk-siniri`, dokunmatikte
  44 px düğmeler), `35-quiz.css` (`.qz-ikon-btn`: ok ve çıkar düğmeleri), `27-harita-ortak.css` (`.adres-girdi`,
  `.adres-goster`, `.dugme-satir`, `.ayrac-cizgi`), `09-kayit-ekrani.css` (`.okul-bilgi`), `02-form.css` (`.field`,
  `.row2`, `.hint`), `04-kartlar.css` (`.etiket` mavi/gri/turuncu, `.satir`).
- **Rol:** yalnız sistem yöneticisi.

## Nasıl çalışır (adım adım)?

### Bir ayarı kaydetmek

```
"Kaydet" (data-anahtar="iletisim")
  sa-kaydet ─► kartın hataları silinir ─► saDegerOku('iletisim')
       hata ─► kutunun altında kırmızı yazı, ilk hatalı kutuya git (istek yok)
  POST /api/admin/site-ayarlari { anahtar: 'iletisim', deger: { eposta, telefon } }
       sunucu: dogrula ─► veritabanı ─► bellekteki önbellek ─► işlem kaydı ─► görünüm + message
  saSonuc ─► SA.veri = cevap ─► yalnız #saKartIletisim yeniden ─► iletisimCiz (bu sayfanın alt bilgisi)
          ─► "İletişim bilgileri kaydedildi." (6 sn)
  hata ─► saHata: alan 'eposta' ─► #saEposta altında
```

### Yapımcı listesi

```
"Yapımcı ekle" ─► boş satır ─► Ad / GitHub / Katkı yazılır ─► oklarla sırala, × ile çıkar (hepsi yalnız ekranda)
"Listeyi kaydet" ─► saDegerOku: boş satırlar atlanır; liste = [satır 0, satır 2], sira = [0, 2]
  POST … { anahtar: 'yapimcilar', deger: liste }
  sunucu hatası { alan: 'yapimcilar', sira: 1, altAlan: 'github' } ─► ekrandaki satır sira[1] = 2 ─► #saYGh2 altında
```

### Okul adresini değiştirmek

```
"Adresi değiştir" ─► pencere ─► "Yeni Okul" yazılır ─► kutu "yeni-okul" olur
"Adresi kaydet" ─► okulAdresiSorunuTR ─► POST /api/admin/okul-adres
   sunucu: yasak ad / başka okulda mı ─► kaydet ─► okul önbelleği boşalır (eski adres o an 404) ─► müdürlere bildirim
   ─► pencere kapanır, kart yeniden, sarı ileti "Okulun adresi değişti. Eski adres (/school/…) artık açılmıyor. …"
```

## Dikkat!

- **Desenler iki yerde.** `SA_EPOSTA`, `SA_PLAY`, `SA_GITHUB` sunucudaki `site.js` desenleriyle, telefon kuralı
  `ortak.js telefonSorunu` ile, adres kuralı `kisaAdSorunu` ile elle eşit tutulur. Sunucuda biri değişirse burada da
  değiştir; yoksa kişi kutunun altında farklı bir şey görür (sunucu yine son sözü söyler). Adresteki yasak adları
  (`admin`, `login`, `school`…) istemci bilmez, sunucu söyler.
- **Sabit yazılmış sayılar.** Disk kartındaki "1 MB ile 10 TB arası" ve varsayılana dönüş onayındaki "verilmemişse 5 GB"
  metne gömülü; sunucu bu sınırları (`a.en`, `a.cok`, `a.varsayilan`) zaten gönderiyor. Varsayılan değişirse onay metni
  yanlış kalır. (Kartın "kodun varsayılanı …" yazısı ise sunucudan gelen değeri kullanır.)
- **Bilgi kutusu her kart için tam doğru değil.** Üstteki "config.yml'den, orada da yoksa varsayılandan gelir" cümlesi
  yapımcılarda (`yapimcilar.json`) ve disk sınırında (`EE_OKUL_DOSYA_GB`) farklıdır; her kartın kaynak satırı doğrusunu
  söyler.
- **Boş yapımcı listesi bu sekmede hemen görünmez.** `yapimcilariCiz` boş listede hiçbir şey yapmaz (sayfadaki hazır
  satır kalsın diye); listeyi boşaltıp kaydeden yönetici üst şeritte eski listeyi sayfa yenilenene kadar görür. Sunucu
  ve öbür ziyaretçiler doğru listeyi alır.
- **Ok simgeleri ve düğme biçimi quizden ödünç.** `ik('yukari')`, `ik('asagi')` simgeleri `14c-quiz.js`'te `IKONLAR`'a
  eklenir, `.qz-ikon-btn` biçimi `35-quiz.css`'tedir. Quiz parçası değişir ya da kaldırılırsa yapımcı satırlarındaki
  oklar boş düğme olur. `ik` yalnız sayfa çizilirken çağrıldığı için birleşme sırası (bu dosya quizden önce gelir)
  bugün sorun değil.
- **"Kaydedilmemiş" işareti eksik.** Ortak dinleyici (25-tiklama.js) yalnız metin/sayı kutularında yazınca
  `S._sayfaDegisti`'yi doğru yapar; `type=email` (`#saEposta`) ve `type=url` (`#saPlay`) kutuları sayılmaz, "Yenile" bu
  ikisine yazılanı sormadan siler. Tersine, kaydettikten sonra işaret indirilmez: "Yenile" kaydedilmiş sayfada da
  "yazdıkların kaydedilmedi" diye sorar. Kod okumasına göre.
- **Adres kutusunda imleç sona kaçar.** `sa-okul-adres` kutusu yazarken değeri yeniden yazar; kelimenin ortasına büyük
  harf, Türkçe harf ya da boşluk yazılırsa imleç kutunun sonuna atlar (aynı kalıp
  [../parcalar/16b-okul-ayarlari.md](../parcalar/16b-okul-ayarlari.md)'de not edildi). Ayrıca `.adres-girdi` içindeki
  kutunun çerçevesi olmadığı için hatada kırmızı çerçeve görünmez, yalnız alttaki yazı çıkar.
- **Okul adresi değişince eski adres o an ölür.** Öğrenci ve öğretmenlerin kaydettiği bağlantı "bulunamadı" der; okulun
  müdürüne bildirim gider ama öğrencilere gitmez. Uyarı kutusu bunu söyler; sonuç iletisi `uyari` türünde olduğu için
  kendiliğinden kaybolmaz (`mesajGoster` yalnız `iyi` iletilerini 6 sn sonra siler).
- **Çevrimiçi sayma süresi yoklama aralığından kısa olamaz.** Sunucu en az "yoklama + 1 dk" kullanır; kaydedilen süre
  daha kısaysa sarı uyarı çıkar (değer kaydedilir ama kullanılmaz). Bu yüzden yoklama aralığı kaydedilince bütün
  zamanlama kartı yeniden çizilir.
- **Etki zamanı.** Kaydedilen her değer sunucuda hemen geçerlidir; ama açık başka sekmeler yeni bildirim aralığını,
  iletişim bilgilerini ve yapımcıları ancak sayfa yeniden yüklenince ya da yeniden girişte alır (`/api/site` sayfa başına
  bir kez okunur; giriş ve `/api/me` cevabı da aralığı taşır). İndir sayfası yeniden açılınca Play düğmesi görünür.
  `admins.json` aralığı değişince sunucu bekleyen yoklamayı yeni aralıkla yeniden kurar.
- **Okul adresleri listesindeki "Müdür bekliyor"** eski onay düzeninin kalıntısı (bkz. [09-yonetici.md](09-yonetici.md)
  Dikkat); planlı "Paneller" işinde "Müdürü yok" olacak.
- Yapımcı satırlarında `data-id` değil `data-sira` (ekrandaki sıra) kullanılır; liste her işlemde yeniden çizildiği için
  tutarlı kalır. Sunucunun satır numarası ise GÖNDERİLEN listeye göredir, `sira[]` ile çevrilir.
- Değer kutulara `esc` ile konur; `iletisimCiz` e-postayı HTML'e değil sonradan yazı olarak koyar (adres toplayan botlar
  kaynakta bulamasın).

## Testleri

- `testler/test-site-ayarlari.js` — öncelik (veritabanı > `config.yml` > varsayılan; geçici `config.yml` ile sunucu
  içinden), altı ayarın kaydı, doğrulama ve hata alanları (yapımcı satırı `sira`/`altAlan` dahil), "sıfırla", değişikliğin
  sunucu yeniden başlamadan `/api/site`, `/api/me`, `/api/uygulama`'da görünmesi, çevrimiçi süresinin en az yoklama + 1 dk
  olması, işlem kaydının okulsuz yazılması, okul adresi değiştirme (doğrulama, eski adresin hemen "Okul bulunamadı",
  müdüre bildirim, müdürün kendi değiştirmesi), yönetici olmayana 404.
- `testler/test-okul-disk.js` — "Varsayılan okul disk sınırı" ayarı: `EE_OKUL_DOSYA_GB` (kaynak `ortam`), kaydedince
  veritabanı, "Varsayılana dön" ile yine ortam; doğrulama ve işlem kaydı.
- `testler/girdi-denetimi.js` — `site-ayarlari`'ya bozuk değerler; `testler/yetki-denetimi.js` — uçlar yalnız yöneticiye;
  `testler/test-admin-gizli.js` — `site-ayarlari`, `okul-adresleri` herkese giden `app.js`'te geçmiyor,
  `/admin/site-ayarlari/alt` gibi adresler de yönetim kabuğunu açıyor.
- `testler/buton-denetimi.js` (her `data-act`'ın karşılığı), `testler/test-kucult.js` (paket derleniyor),
  `testler/yazim-denetimi.js`.
- Bu ekranı tarayıcıda çalıştıran otomatik test YOK (yalnız `araclar/gezinti.js` ekran turu adımları).
- Elle: Site Ayarları → İletişim'e `iletişim@ornek.org` yaz → Kaydet → Türkçe harf hatası kutunun altında; düzelt → yeşil
  ileti, sayfanın altındaki iletişim satırı değişir, kaynak "Panelden kaydedildi". Yapımcı ekle, GitHub'a `-kotu-ad-` yaz →
  "Listeyi kaydet" → hata o satırın GitHub kutusunda. Bildirim aralığını 1 yap → çevrimiçi kartında not/uyarı değişir.
  Okul adresleri → "Adresi değiştir" → "Yeni Okul" yaz (kutu `yeni-okul` olur) → kaydet → eski adres yeni sekmede
  "bulunamadı".

## Son durum

- `git log`: 2 commit.
- `276c0a0 commit 521` (2026-09-27, gizli yönetim paneli): dosya bu commit'le doğdu (438 satır) — iletişim, yapımcılar,
  Play Store, üç zamanlama ve okul adresleri kartları; değerin kaynağını gösteren satır, "Varsayılana dön", yalnız kartın
  yeniden çizilmesi, sunucu hatasının kutuya eşlenmesi (yapımcı satırları `sira`/`altAlan` ile).
- `40fc7e7 commit 525` (2026-09-27, okul disk sınırı): **Varsayılan okul disk sınırı** kartı (`saDiskKarti`; sınır alanı
  09d'den, öneri satırsız), kaynak etiketine `ortam` ("EE_OKUL_DOSYA_GB ortam değişkeni"), hata eşlemesine ve ileti
  yerlerine `okulDiskMb`, `saDegerOku`'ya `okulDiskMb` dalı, varsayılana dönüş onayına disk sınırı metni, `saSonuc`'ta
  yalnız disk kartının yeniden çizilmesi.
- Bilinen açıklar (kod değiştirilmedi): boş yapımcı listesinin bu sekmede görünmemesi, e-posta/Play kutularının
  "kaydedilmemiş" sayılmaması, sabit "10 TB"/"5 GB" metinleri, adres kutusunda imleç kayması ve görünmeyen kırmızı çerçeve,
  "Müdür bekliyor" kalıntısı.
- Planlı işlerden bu dosyaya dokunacaklar:
  - "Paneller" (iş 5): adres `/panel/admin`; okul adresi değiştirme `/duzenle/okul/<kisa-ad>` sayfasına da gelir;
    "Müdür bekliyor" → "Müdürü yok"; destek ekibi site ayarlarını göremez.
  - "Sistem" (iş 4): bakım modu (durumu site ayarlarında saklanır), zengin editörlü site duyurusu, yöneticiye zorunlu
    doğrulama uygulaması (desteğe site ayarıyla), "günlük e-posta uyarı eşiği" site ayarı — büyük olasılıkla bu ekrana
    yeni kartlar.
  - "Eğitim içerikleri" (iş 17): "YouTube denetim aralığı" ve eğitmen başına disk sınırı site ayarları.
  - "Optimizasyon" (iş 7): bildirim aralığı ve çevrimiçi süresi yeniden yazılmayacak, yalnız ölçülecek; yedeğe dosyaları
    katma ayarı eklenebilir.
  - "Çok dil" (iş 22): kart metinleri çeviri kataloğuna. "Ekran turu" (iş 12) bu ekranı yeniden çekecek.
