# sunucu/veri/index.js

Veri katmanının tek giriş kapısı: bütün depoları tek bir `depo` nesnesinde toplar, bildirim kısayollarını (`bildir`,
`topluBildir`, `cokluBildirim`) ve işlem/hata yardımcılarını dışa açar, sunucu açılırken veritabanını hazırlayan `baslat`'ı
ve ilk yönetici hesabını kuran `acilisHesaplari`'nı taşır.

## Bu dosya ne yapar?

Uygulamanın geri kalanı veritabanına hiçbir zaman doğrudan gitmez; yalnız bu dosyayı içeri alır:

```
const { depo, islem, topluBildir } = require('../veri');
await depo.odevler.bul(id);
```

`sunucu/veri/` altında her şeyin bir yeri var ve bu dosya onları bir araya getirir:

```
sunucu/veri/
  baglanti.js      PostgreSQL bağlantı havuzu, sorgu(), islem(), hata çevirisi
  sema.js          sema/NNN-*.sql dosyalarını sırayla uygular
  sema/            tablo tanımları (okunur SQL)
  esleme.js        satır <-> uygulama nesnesi
  yazici.js        genel INSERT / UPDATE yardımcıları
  depo/            tablo gruplarına göre sorgular (28 dosya)
  json-aktarim.js  eski db.json ve yedekler <-> veritabanı
  yedek.js         günlük yedek, geri yükleme
```

İkinci görevi açılış: sunucu dinlemeye başlamadan önce şemayı günceller, bellekteki ayarları yükler, eski `db.json`'u
bir kez içeri alır, eksik kişi kodlarını ve okul adreslerini tamamlar, `data/admins.json`'daki yöneticileri açar, hiç
yönetici yoksa ilk yöneticiyi kurar ve kurallara aykırı eski kayıtları pencereye yazar.

## İçinde neler var?

### `depo` nesnesi

Her anahtar `sunucu/veri/depo/` altındaki bir dosyadır (belgeleri sonraki parçada): `kullanicilar`, `roller`, `oturumlar`,
`okullar`, `siniflar`, `odevler`, `quiz`, `sinavlar`, `mesajlar`, `anketler`, `okulHayati` (`okul-hayati.js`),
`servisYoklama` (`servis-yoklama.js`), `cihazlar`, `odevDosyalari` (`odev-dosyalari.js`), `okulDisk` (`okul-disk.js`),
`etutler`, `onaylar`, `okulSayfalari` (`okul-sayfalari.js`), `yorumlar`, `ekler`, `ogrenciGecmisi` (`ogrenci-gecmisi.js`),
`ozellikler`, `hatirlaticilar`, `aile`, `devamsizlik`, `push`, `siteAyarlari` (`site-ayarlari.js`), `genel`. Toplam 28.
Yeni bir depo dosyası yazınca buraya eklemezsen uygulamadan görünmez.

### Bildirim kısayolları

Üçü de `depo.genel`'e iletir; `secenek` olarak `{ veliye: false }` verilirse öğrencinin bildiriminin kopyası velisine
gitmez (varsayılan: onaylı velilere çocuğun adıyla bir kopya gider; ayrıntı `sunucu/veri/depo/genel.js`).

- `bildir(kimeId, metin, baglantiAdresi, secenek)` — tek kişiye (`depo.genel.bildir`).
- `topluBildir(idler, metin, baglantiAdresi, secenek)` — aynı metni birçok kişiye tek sorguda (`depo.genel.topluBildir`;
  tekrarlanan ve boş kimlikler ayıklanır).
- `cokluBildirim(liste, secenek)` — kişiye göre değişen metinler: `liste = [{ kime, metin, baglanti }]`
  (`depo.genel.cokluBildir`).

### İşlem ve hata (baglanti.js'ten aynen)

`islem`, `hataCevir`, `cakisma`, `kapat` — anlatımı [baglanti.md](baglanti.md)'de.

### Yedek (yedek.js'ten aynen)

`module.exports` sonunda `Object.assign(…, yedek)` ile [yedek.md](yedek.md)'deki her şey buradan da dışa açılır:
`YEDEK_KLASOR`, `YEDEK_SAKLA`, `YEDEK_ARALIK_MS`, `yedekAdi`, `yedekListesi`, `yedekTemizle`, `yedekAl`, `yedekGerekliMi`,
`yedekKontrol`, `yedekGeriYukle`.

### `ilkSifreUret()`

14 karakterlik rastgele şifre (`crypto.randomBytes`): ilk dört karakter sırasıyla bir büyük harf, bir küçük harf, bir
rakam ve bir özel karakter (`! ? * . #`), kalan on karakter harf ve rakamlardan. Karışan karakterler yok (`0/O`, `1/l/I`,
küçük `i` ve `o`). Yetişkin hesabının güçlü şifre kuralını karşılar. İlk yönetici ve `data/admins.json`'da şifresi
yazılmamış yöneticiler için kullanılır ([../yonetici-dosyasi.md](../yonetici-dosyasi.md) `sifreUret` seçeneği).

### `okulKisaAdiBul(ad, ilce, haricId)`

Okulun adresi (`egitimevi.org/school/<kısa ad>`) için boş bir ad önerir: önce okul adından ([../ortak.md](../ortak.md)
`kisaAdUret`, ör. "Özel Doruk Koleji" → `ozel-doruk-koleji`), alınmışsa adın ilk 26 karakteri + ilçe, o da alınmışsa
`<ad>-2`, `<ad>-3` … (9999'a kadar). İlk iki aday `kisaAdSorunu`'ndan da geçer (uzunluk, biçim, sitenin kendi sayfa
adları). `haricId` verilirse o okulun kendi adresi "alınmış" sayılmaz. Hiçbiri boş değilse `null`.

### `baslat()`

Sunucu açılışı ([../index.md](../index.md) çağırır; hata verirse sunucu açılmaz). Adımlar aşağıda.

### `acilisHesaplari(secenek)`

Açılıştaki hesap işleri, bu sırayla:

1. `depo.kullanicilar.eskiEpostalariSadelestir()` — eski biçimde saklanmış e-postaları (Türkçe İ, görünmez karakter) bugünkü
   biçime getirir; düzeltilen varsa sayısını pencereye yazar.
2. `yoneticiDosyasi.oku(depo, { sifreUret: ilkSifreUret, …secenek })` — `data/admins.json`'daki yöneticileri açar
   ([../yonetici-dosyasi.md](../yonetici-dosyasi.md)).
3. Hâlâ hiç yönetici (`rol = 'admin'`) yoksa ve dosyadan kimse açılmadıysa varsayılan ilk yönetici: kullanıcı adı `admin`
   (alınmışsa `admin2`, `admin3` …), e-posta koddaki `EPOSTA` sabiti. O e-posta başka bir hesaptaysa yönetici AÇILMAZ
   (o hesap yönetici yapılmaz), pencereye uyarı yazılır, sunucu yine açılır. Şifre `EE_ADMIN_SIFRE` ortam değişkeni (yalnız
   testler) ya da `ilkSifreUret()`; özeti ([../sifre.md](../sifre.md) `hashPw`) yazılır, düz hâli pencereye BİR KEZ
   basılır ("Bu şifre bir daha gösterilmez.").

`secenek` testler içindir (`{ dosya, sessiz }`: başka bir admins dosyası, sessiz okuma). Dönüş: `{ sade, dosyadan }`.

### `cakismaRaporu()` (iç)

`depo.kullanicilar.cakismaRaporu()`'nun bulduklarını pencereye uyarı olarak yazar: aynı T.C.'li birden çok öğrenci (bu
yüzden tekil indeks kurulamadı), bir yöneticiyle aynı kullanıcı adını taşıyan hesaplar, görünüşte aynı e-posta adresleri.
Hiçbirini değiştirmez; yönetici elle düzeltir.

Dışa açılanlar: `baslat`, `acilisHesaplari`, `ilkSifreUret`, `okulKisaAdiBul`, `kapat`, `islem`, `hataCevir`, `cakisma`,
`depo`, `bildir`, `topluBildir`, `cokluBildirim` ve yukarıdaki yedek adları.

## Kimle konuşur?

- Çağırdıkları: Node `fs`, `crypto`; [../yollar.md](../yollar.md) → `DBF` (`data/db.json`); [../sifre.md](../sifre.md) →
  `hashPw`; [../ortak.md](../ortak.md) → `uid`, `now`, `kisaAdSorunu`, `kisaAdUret`; [baglanti.md](baglanti.md) →
  `turkceSiralamaKontrol`, `tek`, `kapat`, `islem`, `hataCevir`, `cakisma`; [sema.md](sema.md) → `semayiGuncelle`,
  `testIcinSifirla`; [json-aktarim.md](json-aktarim.md) → `iceAktar`; [yedek.md](yedek.md) (hepsi);
  [../yonetici-dosyasi.md](../yonetici-dosyasi.md) → `oku`; 28 depo dosyası. Depolardan açılışta: `ozellikler.yukle`,
  `siteAyarlari.yukle`, `kullanicilar.eksikKodlariDoldur`, `eskiEpostalariSadelestir`, `kullaniciAdiHerhangiYerde`,
  `epostaVarMi`, `ekle`, `cakismaRaporu`, `okullar.kisaAdsizlar`, `kisaAdVarMi`, `kisaAdYaz`.
- Onu çağıranlar (`require('../veri')` / `require('./veri')`; grep ile sayıldı):
  - `sunucu/` kökünden 10 dosya: [../api.md](../api.md), [../guvenlik.md](../guvenlik.md),
    [../hatirlatma.md](../hatirlatma.md), [../http.md](../http.md) (okul adresi denetiminde, geç yükleme),
    [../iliskiler.md](../iliskiler.md), [../push.md](../push.md), [../site.md](../site.md), [../yetki.md](../yetki.md),
    [../yonetim-cerezi.md](../yonetim-cerezi.md) — hepsi yalnız `depo`; [../index.md](../index.md) — `baslat`, `kapat`,
    `hataCevir`, `yedekKontrol`, `YEDEK_ARALIK_MS`, `depo`, `ilkSifreUret` (admins.json'u aralıkla yoklarken).
  - `sunucu/bolumler/` altından 33 dosya (hepsi `depo`). Ayrıca: `islem` 12 dosya (`hesaplar`, `kayit`, `kisi-aktarim`,
    `kisilik`, `mesaj`, `nakil`, `odev`, `okul`, `quiz`, `veli`, `yonetici-okul`, `yonetici`); `bildir` 7 dosya
    (`hatirlatici`, `hesaplar`, `kisilik`, `nakil`, `okul`, `veli`, `yonetici-okul`); `topluBildir` 7 dosya (`aile`, `anket`,
    `mesaj`, `odev`, `okul-disk`, `sinav`, `site-ayarlari`); `cokluBildirim` 1 dosya (`okul-hayati`); `cakisma` 4 dosya
    (`hesaplar`, `kayit`, `kisi-aktarim`, `yonetici-okul`); [../bolumler/yonetici.md](../bolumler/yonetici.md) ayrıca
    `YEDEK_KLASOR`, `YEDEK_SAKLA`, `yedekAl`, `yedekGeriYukle`, `yedekListesi` ve "Şimdi oku" için `ilkSifreUret`.
    Bazı bölümler bildirimi `depo.genel.bildir`/`cokluBildir` ile doğrudan da yazar (ör. `devamsizlik`, `etut`, `odev`).
  - Araçlar: `araclar/deneme-okulu.js` (`depo`, `okulKisaAdiBul`), `araclar/yuk-testi.js` (`depo`).
  - Testler: `test-cakisma` (`acilisHesaplari`), `test-okul-disk` ve `test-site-ayarlari` (`depo.siteAyarlari.yukle`).
  - Dışa açık ama bugün kimsenin kullanmadığı: `yedekAdi`, `yedekTemizle`, `yedekGerekliMi` (yedek.js içinde kullanılır).
- Tablolar (doğrudan): `kullanicilar` (`count(*)`, `rol = 'admin'` var mı); geri kalanı depolar üzerinden.

## Nasıl çalışır (adım adım)?

```
sunucu/index.js: baslat().then(dinlemeyeBasla; yoneticiDosyasiniIzle).catch(→ "HATA: veritabanı açılamadı", çık)

baslat()
  1. EE_DB_SIFIRLA=1 ? testIcinSifirla()            (yalnız adı _test ile biten veritabanı)
  2. semayiGuncelle()                                (yeni şema dosyaları)
  3. depo.ozellikler.yukle(), depo.siteAyarlari.yukle()   (okulların kapattığı özellikler, panel ayarları → bellek)
  4. turkceSiralamaKontrol()                         (tr-x-icu var mı)
  5. kullanicilar boş VE data/db.json var ?
        iceAktar(db.json) → db.json.tasindi adıyla sakla → "Eski db.json PostgreSQL'e taşındı (N kullanıcı; …)"
  6. depo.kullanicilar.eksikKodlariDoldur()         (veli kodu / kişi kodu olmayanlara üret; 027 ve 032 eski kodları boşalttı)
  7. adresi olmayan okullar → okulKisaAdiBul → kisaAdYaz
  8. acilisHesaplari()                               (e-posta sadeleştir → admins.json → gerekirse ilk yönetici)
  9. cakismaRaporu()                                 (uyarılar)
```

Sıra önemli: 8'in içinde e-postalar admins.json'dan ÖNCE sadeleştirilir. Tersi olsaydı eski biçimde ("İ" ile) saklanmış bir
hesabın adresiyle dosyadan görünüşte aynı e-postalı ikinci bir hesap, üstelik yönetici olarak açılırdı.

## Dikkat!

- **İlk yönetici şifresi koda yazılmaz:** kod herkese açık depoda; sabit bir şifre canlı sitede herkesin bildiği bir kapı
  olurdu. Rastgele üretilir ve yalnız sunucu penceresine bir kez yazılır. Sunucunun çıktısı bir günlük dosyasına
  yönlendiriliyorsa (systemd, testlerin `test-sunucu.log`'u) şifre orada da durur: ilk girişte değiştir, günlüğü paylaşma.
  Bu hesaba "ilk girişte şifre değiştirme zorunluluğu" (`sifreDegismeli`) konmuyor.
- **E-posta başka hesaptaysa ilk yönetici açılmaz** (bir hesabı sessizce yönetici yapmamak için). Sunucu yine açılır;
  yöneticiyi `data/admins.json` ile ekle.
- **`admin`…`admin99` hepsi alınmışsa** döngü `admin99`'da durur ve `ekle` tekillik hatası verir; `baslat` hata fırlatır,
  sunucu açılmaz. Pratikte olası değil, ama sebebi bu.
- **`db.json` aktarımı yalnız veritabanı BOŞKEN** ve bir kez yapılır; dosya `db.json.tasindi` olur. Aktarım hata verirse
  (tek işlem, bkz. [json-aktarim.md](json-aktarim.md)) hiçbir şey yazılmaz, dosya yeniden adlandırılmaz ve sunucu açılmaz.
- **Yeni depo = buraya bir satır.** Depo dosyası yazıp `depo` nesnesine eklemeyi unutursan `depo.xxx` `undefined` olur.
- **Döngüsel yükleme:** bu dosya yüklenirken bütün depolar yüklenir; `sunucu/` altındaki bazı dosyalar (ör.
  [../http.md](../http.md)'deki okul adresi denetimi, [../index.md](../index.md)'deki `yoneticiDosyasiniIzle`,
  [../bolumler/yonetici.md](../bolumler/yonetici.md)'deki "Şimdi oku") `require('./veri')`'yi işlevin İÇİNDE çağırır.
  Bir depo dosyasından `require('../index')` (bu dosya) yazma.
- **Açılışta bellek önbellekleri:** `ozellikler` ve `siteAyarlari` bellekte tutulur; veritabanında elle değişiklik yaparsan
  sunucuyu yeniden başlat (yedekten geri yükleme `ozellikler`'i kendisi yeniden yükler, `siteAyarlari` yedeğe hiç girmez).
- **Uyarılar sunucuyu durdurmaz:** `cakismaRaporu` yalnız yazar; eski veride kurallara aykırı kayıt varsa uygulamanın kendi
  denetimi yine çalışır, ama veritabanı indeksi kurulamamış olabilir.

## Testleri

- `testler/tumtest.sh` — her paket sunucuyu `EE_DB_SIFIRLA=1 EE_ADMIN_SIFRE=…` ile açar: `baslat`'ın bütün adımları ve
  bilinen şifreli ilk yönetici her pakette yeniden sınanır.
- `testler/test-cakisma.js` — `acilisHesaplari({ dosya, sessiz })`'yı doğrudan çağırır: eski biçimli adres admins.json'dan
  önce düzeltiliyor mu, aynı adresle dosyadan yönetici açılmıyor mu; ayrıca yöneticinin adını taşıyan hesaplar ve ilk
  yöneticinin adı.
- `testler/test-yonetici-dosyasi.js` — admins.json'dan yönetici açma (şifre üreticisi olarak kendi sabitini verir;
  `ilkSifreUret`'in kendisini denetleyen bir test yok).
- `testler/test-kisi-kodu.js` — `eksikKodlariDoldur`'u doğrudan çağırır (ikinci çalıştırmada 0).
- `okulKisaAdiBul`'un ve açılışta adresi olmayan okullara adres verilmesinin ayrı bir testi yok; okul adresleri başka
  yollardan (`test-okul-sayfasi`, `test-yonetim`, `test-site-ayarlari`) sınanıyor.
- Bildirim kısayolları: `testler/test-bildirim.js`, `testler/test-veli-coklu.js` (veliye giden kopyalar).
- Elle: boş bir veritabanıyla sunucuyu aç → pencerede "İlk yönetici hesabı oluşturuldu" ve şifre görünür; ikinci açılışta
  görünmez.

## Son durum

- Son değişiklikler: `40fc7e7 commit 525` (2026-09-27) `depo.okulDisk` eklendi (okul disk sınırı); `153d63d commit 522`
  yalnız yorum (kişi kodu 032); `276c0a0 commit 521` `acilisHesaplari` ve `cakismaRaporu` ayrıldı, admins.json okuması,
  `depo.siteAyarlari` ve açılışta yüklenmesi, ilk yöneticinin ad/e-posta çakışmasına dayanıklı hâle gelmesi, `ilkSifreUret`
  ile `cakisma`'nın dışa açılması; `3b8fd36 commit 519` `depo.quiz`. İlk hâli `8b95a19 commit 10` (2026-08-28).
- Açık iş yok. Planlı işlerden "Sistem" (yöneticiye zorunlu TOTP) ve "Paneller" (destek.json, destek hesabı) ilk yönetici ve
  açılış hesaplarını etkileyecek; "Güvenlik denetimi" okulun verdiği şifrelerde ilk girişte değiştirmeyi getirecek.
  Yeni depo getiren her iş (`depo` nesnesine bir satır) bu dosyaya dokunur.
