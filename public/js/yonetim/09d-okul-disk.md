# public/js/yonetim/09d-okul-disk.js

Yönetim panelinde okulların disk sınırı: ortak sınır kutusu (sayı + MB/GB, öneri), Okullar sayfasının sistem "Disk"
kartı ve tablo hücresi, okulun "Düzenle" penceresi ve sınırın kaydedilmesi.

## Bu dosya ne yapar?

Her okulun dosyaları (ödev teslim dosyaları, ödev ve mesaj ekleri, okul sayfası fotoğrafları) okulun **disk sınırına**
sayılır; dolunca o okulda yeni yükleme durur. Sınır okulda durur; boşsa sitenin "Varsayılan okul disk sınırı" geçerlidir.
Kuralların hepsi sunucuda ([../../../sunucu/bolumler/okul-disk.md](../../../sunucu/bolumler/okul-disk.md)); bu dosya
yöneticinin o sınırı gördüğü ve verdiği ekran parçalarını taşır:

- **Sınır kutusu** (`diskSiniriAlani`) — sayı kutusu + GB/MB seçici, isteğe bağlı **Öneriyi kullan** ve öneri satırı.
  Üç yerde kullanılır: "Okul aç" penceresi ([09-yonetici.md](09-yonetici.md)), okulun "Düzenle" penceresi (bu dosya) ve
  Site Ayarları'ndaki "Varsayılan okul disk sınırı" kartı ([09b-site-ayarlari.md](09b-site-ayarlari.md)).
- **Öneri** — öğrenci sayısı × 10 MB, en az 2 GB (en çok 10 TB); öğrenci sayısı yoksa varsayılan sınır.
- **Disk kartı** — Okullar sayfasının üstünde sistemin bütünü: okullara ayrılan toplam, okulların kullandığı, diskteki
  gerçek boş yer, veritabanının yaklaşık boyutu, son dosya mutabakatı; ayrılan alanın kullanılmayan kısmı boş yerden
  fazlaysa uyarı (izin verilir, yalnız uyarır).
- **Tablo hücresi** — Okullar tablosundaki "Dosya alanı" sütunu: küçük doluluk çubuğu, "Özel sınır" ya da "Varsayılan".
- **Okul ekranı** — "Düzenle" ile açılan pencere: okulun bilgisi, doluluk çubuğu ve dağılımı, **Varsayılan sınırı kullan**
  kutucuğu ve okula özel sınır; **Kaydet** sınırı sunucuya yazar.

Doluluk çubuğu ve boyut biçimi ortak parçadadır ([../parcalar/08d-okul-disk.md](../parcalar/08d-okul-disk.md)): müdürün ana
sayfasındaki "Okulun dosya alanı" kartı da onu kullanır. Bu dosya yalnız yönetim paketindedir (`/admin/yonetim.js`, bkz.
[09-yonetici.md](09-yonetici.md) "Bu dosya ne yapar?"); ekranları yalnız **sistem yöneticisi** görür.

## İçinde neler var?

### Sabitler ve durum

- `OKUL_DISK_MB` — 1.048.576 (1 MB bayt olarak; MB → bayt çevirisi).
- `OKUL_DISK_ONERI` — `{ kisiMb: 10, enAzMb: 2048 }`: öğrenci başına 10 MB, en az 2 GB. Sunucudaki `okul-disk.js`
  `ONERI_KISI_MB`, `ONERI_EN_AZ_MB` ile aynı (elle).
- `OKUL_DISK_EN_COK_MB` — 10.485.760 (10 TB); sunucudaki `site.js` `OKUL_DISK.cok` ile aynı.
- `ADMIN_OKULLAR` — `{ liste: [], disk: null }`: son `GET /api/admin/overview`'un okul listesi (`schools`) ve sistem geneli
  (`disk`). [09-yonetici.md](09-yonetici.md)'deki `SAYFALAR.okullar` her açılışta doldurur.

### Öneri ve biçim

- `diskOneriMb(ogrenci)` — öğrenci sayısı > 0 ise `min(10 TB, max(2048, öğrenci × 10))` MB; değilse `null` ("varsayılanı
  kullan" demek).
- `diskVarsayilanMb()` — `ADMIN_OKULLAR.disk.varsayilanMb` (sitenin varsayılan sınırı, sunucudan); Okullar sayfası hiç
  açılmadıysa 5120 (5 GB).
- `diskKutuDegeri(mb)` — kutuya yazılacak `{ deger, birim }`: MB değeri GB'a en çok iki ondalıkla TAM çevrilebiliyorsa GB
  (`sayiGirdi` ile virgüllü: 5120 → "5", 3000 → "2,93"), değilse MB (3200 → "3200"). Böylece kaydedilmiş değer kutuya
  gelirken yuvarlanıp değişmez.
- `diskOneriYazisi(ogrenci)` — öneri satırı: öğrenci yoksa "Öneri: varsayılan 5 GB (öğrenci sayısı yok; öğrenci sayısı ×
  10 MB, en az 2 GB).", varsa "Öneri: 3,1 GB (320 öğrenci × 10 MB, en az 2 GB)." (boyut `diskYaz` ile; 1 GB ve üstü GB
  yazılır).

### Sınır kutusu

- `diskSiniriAlani(onek, mb, ogrenci, etiket, oneriYok)` — HTML döner (`.field.disk-siniri`): etiket (varsayılan "Disk
  sınırı"), `#<onek>Deger` metin kutusu (`inputmode=decimal`, en çok 12 karakter), `#<onek>Birim` seçici (GB / MB),
  `oneriYok` değilse **Öneriyi kullan** (`data-act="disk-oneri-kullan"`, `data-onek`, `data-ogrenci`) ve öneri satırı
  `#<onek>Oneri`. `mb` kutunun ilk değeri (`diskKutuDegeri` ile), `ogrenci` önerinin hesabı için (`null` → varsayılan).
  Kullanılan önekler: `aoDisk` (Okul aç), `oeDisk` (okul ekranı), `saDisk` (Site Ayarları, `oneriYok`).
- `diskSiniriOku(onek)` — kutudaki değer MB olarak (tam sayı) ya da sorun varsa kutunun altına hata yazıp `null`:
  boşluklar silinir, ilk virgül noktaya döner; boş → "Disk sınırını yaz."; birim MB ve tam sayı değil → "MB olarak tam sayı
  yaz (ör. 500) ya da birimi GB seç."; GB ise `round(sayı × 1024)`; sonuç 1 MB–10 TB dışında → "Disk sınırı 1 MB ile 10 TB
  arasında olmalı." Sayı olmayan yazı (harf, "1,2,3" gibi iki ayraç) MB'ta "tam sayı yaz" iletisini, GB'ta ise
  (sayı `NaN` olduğu için) bu aralık iletisini alır.
- `diskSiniriYaz(onek, mb)` — kutuya ve seçiciye `diskKutuDegeri(mb)`'yi yazar.
- **`EYLEMLER['disk-oneri-kullan']`** (`el`: basılan düğme) — düğmenin `data-ogrenci`'sinden öneriyi hesaplar (yoksa varsayılan); kutunun
  hatasını siler; kutu kapalıysa (okul ekranında "Varsayılan sınırı kullan" işaretli) başka bir şey yapmaz; değilse öneriyi
  kutuya yazar ve odağı kutuya koyar.

### Sistem geneli (Okullar sayfasının üstü)

- `okulDiskMutabakatYazisi(m)` — son dosya mutabakatının özeti: `m` yoksa "Dosya mutabakatı henüz yapılmadı (sunucu
  açıldıktan bir dakika sonra, sonra saatte bir yapılır)."; varsa "Son dosya mutabakatı 02.10.2026 19:05: diskte 1.234
  dosya (3,2 GB), kayıtlarla tutarlı." ya da sorunlarla: "N sahipsiz dosya (… ; temizlikte silinir)", "N kaydın dosyası
  diskte yok", "N dosyanın boyutu kayıtla tutmuyor".
- `okulDiskSistemKarti(s)` — `#okulDiskSistem` kartı (`.ayar-kart`), başlık "Disk", açıklama; `dl.disk-ozet` içinde dört
  kutu: **Okullara ayrılan** "12 GB (3 okul)", **Okulların kullandığı**, **Diskteki boş yer** ("okunamadı" ya da "… (disk
  …)"), **Veritabanı** ("yaklaşık … (sınırlara sayılmaz)" ya da "okunamadı"); sunucu `uyari` gönderdiyse sarı kutu
  (`role="status"`); mutabakat satırı; "Varsayılan okul disk sınırı 5 GB; özel sınırı olmayan okullar bunu kullanır." ve
  **Site Ayarları** (`data-nav="site-ayarlari"`).
- `okulDiskHucresi(s)` — Okullar tablosunun hücresi: `okulDiskCubugu(s.disk, s.disk.ozel ? 'Özel sınır' : 'Varsayılan',
  true)` (sıkışık çubuk "1,2 GB / 5 GB"; %80 turuncu, %95 kırmızı).
- `adminOkulBul(id)` — `ADMIN_OKULLAR.liste`'te okul ya da `null`.

### Okul ekranı ("Düzenle")

- `okulDiskBolumu(s)` — pencerenin "Dosya alanı" bölümü (HTML): başlık; doluluk çubuğu (etiket "Bu okula özel sınır" ya
  da "Varsayılan sınır"); dağılım ("Ödev teslim dosyaları 2,1 GB · Ekler 1 GB · Okul sayfası fotoğrafları 4 MB. Veritabanı
  sayılmaz."); **Varsayılan sınırı kullan (5 GB)** kutucuğu `#oeVarsayilan` (okulun özel sınırı yoksa işaretli) ve "Varsayılan
  Site Ayarları'nda değişince bu okulun sınırı da değişir."; `diskSiniriAlani('oeDisk', …, 'Bu okula özel sınır')` —
  kutunun ilk değeri okulun özel sınırı, yoksa öğrenci sayısına göre öneri, o da yoksa varsayılan; altında "Sınır
  küçültülürse var olan dosyalar silinmez; yalnız yeni yükleme durur. Değişiklik işlem kaydına yazılır."
- `okulDiskBolumuKur()` — kutucuğu bağlar: işaretliyken sayı kutusu ve birim seçici kapalı (ve hata silinir), değilken
  açık; açılışta bir kez uygular.
- `okulDiskBolumuOku()` — kaydedilecek değer: kutucuk işaretliyse `null` (varsayılan); değilse `diskSiniriOku('oeDisk')`
  → MB; geçersizse hata kutunun altında, odak kutuda ve `undefined`.
- **`EYLEMLER['okul-ekrani'](el, id)`** — Okullar tablosundaki **Düzenle**. `adminOkulBul(id)` ile okul bulunur;
  `modalAc(<okul adı>, …)`: "ilçe, il · Müdür: … · N öğretmen · M öğrenci", `okulDiskBolumu(s)`, ileti yeri `#oeMesaj`;
  altta **Vazgeç** ve **Kaydet** (`okul-disk-kaydet`, `data-id`). Sonra `okulDiskBolumuKur()`.
- **`EYLEMLER['okul-disk-kaydet'](el, id)`** — iletiyi siler, `okulDiskBolumuOku()`; geçersizse durur. "Kaydediliyor..." →
  `POST /api/admin/okul-disk-siniri { okulId, mb }` (`mb` sayı ya da `null`). Başarıda pencere kapanır, Okullar yeniden
  çizilir (`git('okullar')`) ve sayfanın üstüne "<okul>: <sunucunun iletisi>" — kullanım yeni sınırı aşıyorsa sarı (sunucu
  "var olan dosyalar silinmez, yalnız yeni yükleme durur" der), değilse yeşil. Hata: `alan === 'mb'` ve kutu açıksa kutunun
  altına, değilse `#oeMesaj`'a.

## Kimle konuşur?

- **Sunucu uçları:**
  - `GET /api/admin/overview` ([../../../sunucu/bolumler/yonetici.md](../../../sunucu/bolumler/yonetici.md)) — her okulun
    `disk` alanı (`{ kullanilan, sinir, siniriMb, ozel, dagilim: { teslim, ek, foto }, oran, oneriMb }`) ve sistem geneli
    `disk` (`{ okul, ayrilan, kullanilan, bos, diskToplam, veritabani, varsayilanMb, asim, uyari, mutabakat }`). Çağıran
    [09-yonetici.md](09-yonetici.md); bu dosya sonucu `ADMIN_OKULLAR`'dan okur.
  - `POST /api/admin/okul-disk-siniri { okulId, mb }` ([../../../sunucu/bolumler/okul-disk.md](../../../sunucu/bolumler/okul-disk.md)
    `siniriDegistir`) → `{ okul: { id, ad, disk }, sistem, message, uyari }`; değiştiyse işlem kaydı `okul.disk-siniri`
    ("Okul: 3 GB → 2 GB") ve uyarıların yeniden kurulması; hata `alan: 'okulId'` (404) ya da `'mb'` (400).
  - Okul açarken `diskMb` ([../../../sunucu/bolumler/yonetici-okul.md](../../../sunucu/bolumler/yonetici-okul.md)) ve
    varsayılan sınır ayarı `okulDiskMb` ([../../../sunucu/bolumler/site-ayarlari.md](../../../sunucu/bolumler/site-ayarlari.md))
    bu dosyanın kutusuyla gönderilir; değerin kuralı (1 MB–10 TB, tam sayı MB) [../../../sunucu/site.md](../../../sunucu/site.md)
    `okulDiskTemizle`.
- **Çağırdıkları (ön yüz):**
  - [../parcalar/08d-okul-disk.md](../parcalar/08d-okul-disk.md) — `diskYaz`, `okulDiskCubugu`, `okulDiskDagilimi`;
  - [../parcalar/01-yardimcilar.md](../parcalar/01-yardimcilar.md) — `$`, `esc`, `api`, `sayiTR`, `sayiGirdi`, `EYLEMLER`;
  - [../parcalar/02-ikonlar.md](../parcalar/02-ikonlar.md) — `ik('kutu')`, `tarihSaat`;
  - [../parcalar/03-mesaj-modal.md](../parcalar/03-mesaj-modal.md) — `modalAc`, `modalKapat`, `mesajGoster`, `sayfaMesaji`;
  - [../parcalar/04a-form-alanlari.md](../parcalar/04a-form-alanlari.md) — `alanHatasi`, `alanTemizle`;
  - [../parcalar/05-giris.md](../parcalar/05-giris.md) — `dugmeBekle`, `dugmeBitir`;
  - [../parcalar/07-yonlendirme.md](../parcalar/07-yonlendirme.md) — `git`.
- **Onu kullananlar:**
  - [09-yonetici.md](09-yonetici.md) — `SAYFALAR.okullar`: `ADMIN_OKULLAR`'ı doldurur, `okulDiskSistemKarti`,
    `okulDiskHucresi`, "Düzenle" düğmesi (`okul-ekrani`); "Okul aç": `diskSiniriAlani('aoDisk', diskVarsayilanMb(), null)`,
    `diskOneriYazisi`, `diskOneriMb`, `diskSiniriYaz`, `diskSiniriOku`, sonuçta `OKUL_DISK_MB`.
  - [09b-site-ayarlari.md](09b-site-ayarlari.md) — `diskSiniriAlani('saDisk', …, 'Sınır', true)`, `diskSiniriOku('saDisk')`,
    `OKUL_DISK_MB`.
  - `araclar/gezinti.js` — Okullar sayfası (açık, koyu ve telefon görünümü) ekran turunda.
- **Birleşme sırası:** yönetim paketinde bu dosya `09c`'den sonra, `10-mudur.js`'ten önce gelir; `09-yonetici.js` ve
  `09b-site-ayarlari.js` buradaki adları kendilerinden SONRA tanımlanmış olmalarına rağmen kullanır, çünkü yalnız sayfa
  çizilirken ve tıklamada çağırırlar (işlevler yukarı taşınır; `var`'lar o ana kadar dolmuştur).
- **CSS:** `public/css/parcalar/36-ayar-kartlari.css` (`.disk-siniri`, `.sayi-satir`, kapalı kutunun soluklaşması,
  `.disk-ozet`, `.doluluk.okul-disk` renkleri, `.sikisik`, `.okul-tablo`, `.ayar-kart`, `.kart-aciklama`), `02-form.css`
  (`.doluluk`, `.doluluk-ust`, `.doluluk-cubuk`, `.dosya-izin`, `.onay`), `27-harita-ortak.css` (`.alt-baslik`,
  `.dugme-satir`).
- **Rol:** yalnız sistem yöneticisi. Müdür kendi okulunun doluluğunu ana sayfasında görür (08d), sınırı değiştiremez.

## Nasıl çalışır (adım adım)?

### Okulun sınırını değiştirmek

```
Okullar (SAYFALAR.okullar) ─► GET /api/admin/overview ─► ADMIN_OKULLAR = { liste: schools, disk }
   tablo: okulDiskHucresi(s) ─► "1,2 GB / 5 GB · Varsayılan"
"Düzenle" ─► okul-ekrani(id) ─► adminOkulBul ─► modalAc(okulDiskBolumu(s)) ─► okulDiskBolumuKur
   [x] Varsayılan sınırı kullan (5 GB)       kutu kapalı, içinde öneri ya da varsayılan
   kutucuk kaldırılır ─► kutu açılır ─► "3" GB yazılır (ya da "Öneriyi kullan")
"Kaydet" ─► okulDiskBolumuOku ─► 3072 ─► POST /api/admin/okul-disk-siniri { okulId, mb: 3072 }
   sunucu: değiştiyse yaz + işlem kaydı + uyarıları yeniden kur ─► { okul.disk, message }
   ─► modalKapat ─► git('okullar') ─► "Okul: Okulun disk sınırı kaydedildi: 3 GB."  (aşıyorsa sarı)
kutucuk yeniden işaretlenip kaydedilirse ─► mb: null ─► okul yeniden varsayılanı izler
```

### Sınır kutusunun okunması

```
"2,5" + GB  ─► "2.5" ─► 2.5 × 1024 = 2560 MB
"500" + MB  ─► 500 MB
"1,5" + MB  ─► "MB olarak tam sayı yaz (ör. 500) ya da birimi GB seç."
"0" + MB    ─► "Disk sınırı 1 MB ile 10 TB arasında olmalı."
"abc" + GB  ─► sayı değil (NaN) ─► yine "Disk sınırı 1 MB ile 10 TB arasında olmalı."
kaydedilmiş 3200 MB ─► kutuya "3200" MB (GB'a iki ondalıkla tam çevrilmez); 5120 MB ─► "5" GB
```

## Dikkat!

- **Sayılar iki yerde.** Öneri formülü (10 MB / 2 GB), üst sınır (10 TB) ve varsayılanın yedek değeri (5120) sunucudaki
  `okul-disk.js` ve `site.js` sabitleriyle elle eşit tutulur; bunları karşılaştıran test yok. Sunucu her overview
  cevabında okul başına `oneriMb`'yi zaten gönderir ama ön yüz kullanmaz, öneriyi `s.students`'tan kendisi hesaplar.
- **Varsayılan, Okullar sayfası açılmadan bilinmez.** `diskVarsayilanMb()` `ADMIN_OKULLAR.disk`'ten okur; bugün kutuyu
  kullanan iki pencere (Okul aç, Düzenle) yalnız Okullar sayfasından açıldığı için değer tazedir. Başka bir yerden
  kullanılırsa 5 GB'a düşer; Site Ayarları'ndaki kart öneri satırı çizmediği için bundan etkilenmez.
- **"Okul aç"ta varsayılanı izleme seçeneği yok.** Bu dosyanın sınır kutusu orada hep bir sayı verir; açılan okul özel
  sınır alır (ayrıntı [09-yonetici.md](09-yonetici.md) Dikkat). Varsayılana bağlamak için sonradan "Düzenle" > "Varsayılan
  sınırı kullan".
- **Öneri satırı ile kutu farklı birimle yazabilir.** 320 öğrencide öneri satırı "3,1 GB" der, kutu ise "3200" MB gösterir
  (`diskYaz` bir ondalığa yuvarlar, kutu değeri değişmesin diye MB'ta kalır). Dosyadaki yorumda örnek "Öneri: 3200 MB"
  yazıyor; gerçek çıktı "Öneri: 3,1 GB …".
- **Nokta ondalık sayılır.** `diskSiniriOku` ilk virgülü noktaya çevirir ve noktayı ondalık ayıracı sayar: Türkçede binlik
  ayracı olarak "1.024" yazan kişi GB seçiliyse 1,024 GB (≈1049 MB) vermiş olur, MB seçiliyse "tam sayı yaz" hatası alır.
  Kutuya gelen değerler binlik ayracı taşımaz (`sayiGirdi`). GB seçiliyken sayı olmayan bir yazı da "sayı yaz" yerine
  "1 MB ile 10 TB arasında olmalı" iletisini alır; kişi neyin yanlış olduğunu anlamayabilir.
- **Kapalı kutuda "Öneriyi kullan" sessiz.** Okul ekranında "Varsayılan sınırı kullan" işaretliyken düğme görünür ve
  basılabilir ama hiçbir şey yapmaz (yalnız hatayı siler); kişi önce kutucuğu kaldırmalı. Kod okumasına göre.
- **Kaydet her zaman istek atar.** Değer aynıysa sunucu "Okulun disk sınırı zaten böyle: …" der ve işlem kaydı yazmaz.
- **Liste önbellekten.** "Düzenle" penceresi okulu `ADMIN_OKULLAR.liste`'ten (sayfa açıldığı andaki hâl) alır; o arada
  başka bir yönetici sınırı değiştirdiyse pencere eski değeri gösterir. Kaydedince sunucunun dediği geçerli olur ve liste
  yeniden çekilir.
- **Sınır küçülünce dosya silinmez.** Kullanım yeni sınırın üstündeyse yalnız yeni yükleme durur; ileti sarı çıkar.
  Büyüyünce %80 ve "doldu" bildirimleri yeniden kurulur (kullanım %70'in altındaysa) — sunucunun işi.
- **Disk kartındaki sayıların anlamı:** "Okullara ayrılan" kapatılmış (`rejected`) okulları saymaz, "Okulların kullandığı"
  bütün okulların dosyalarını sayar; yarım kalmış yüklemeler (`.yukleniyor`) mutabakat satırında gösterilmez. Uyarı metni
  sunucudan gelir.
- **Ad çakışması.** `okulDisk…` adları ortak parçadaki ([../parcalar/08d-okul-disk.md](../parcalar/08d-okul-disk.md))
  `okulDiskCubugu`, `okulDiskKarti`, `okulDiskOrani`… ile aynı IIFE'de yaşar; aynı adlı bir işlev yazılırsa sonra gelen
  (bu dosya) öncekini sessizce ezer. `test-kucult.js` yalnız dosya adlarına bakar.
- Bütün metinler `esc` ile basılır; mutabakat ve sistem satırları da `esc`'den geçer.

## Testleri

- `testler/test-okul-disk.js` (sunucu tarafı) — varsayılan sınır ayarı (`EE_OKUL_DOSYA_GB`, panelden kayıt, varsayılana
  dönüş), okul açarken `diskMb` (vermezse varsayılan, bozuk değer 400 `alan: 'diskMb'`), `okul-disk-siniri` (MB ya da `null`,
  doğrulama, işlem kaydı, yönetici olmayana 404), `overview`'daki okul `disk` alanları ve `oneriMb` formülü (öğrenci × 10,
  en az 2048), sistem geneli (ayrılan, kullanılan, boş yer, veritabanı, uyarı), sınır küçülünce dosyaların kalması, saatlik
  mutabakat.
- `testler/girdi-denetimi.js` — `okul-disk-siniri`'ye bozuk `okulId` ve `mb`; `testler/yetki-denetimi.js` — uç yalnız
  yöneticiye; `testler/test-admin-gizli.js` — `okul-disk-siniri` herkese giden `app.js`'te geçmiyor.
- `testler/buton-denetimi.js` (`disk-oneri-kullan`, `okul-ekrani`, `okul-disk-kaydet` karşılıkları), `testler/test-kucult.js`
  (paket derleniyor), `testler/yazim-denetimi.js`.
- Bu dosyanın ekranlarını tarayıcıda çalıştıran otomatik test YOK; istemcideki öneri, birim çevirisi ve kutu okuma
  sunucuyla karşılaştırılmıyor.
- Elle: Okullar → üstteki Disk kartı (dört kutu, mutabakat satırı) → bir okulda **Düzenle** → "Varsayılan sınırı kullan"ı
  kaldır → "2,5" GB yaz → Kaydet → tablo hücresi "Özel sınır", ileti "…kaydedildi: 2,5 GB."; yeniden Düzenle → kutu "2,5"
  GB gelmeli; kutucuğu işaretle → Kaydet → "Varsayılan". Kutuya "1,5" yazıp MB seç → "MB olarak tam sayı yaz…".

## Son durum

- `git log`: 1 commit. Dosya `40fc7e7 commit 525` (2026-09-27, okul disk sınırı + telefonda küçültme) ile doğdu ve o
  günden beri değişmedi: sınır kutusu ve öneri, Okullar sayfasının Disk kartı ve tablo hücresi, okul ekranı ve kaydetme.
  Aynı commit sunucudaki `okul-disk.js`'i, şema 035'i, ortak parça `08d-okul-disk.js`'i ve `test-okul-disk.js`'i getirdi;
  `09-yonetici.js` ve `09b-site-ayarlari.js` bu dosyanın parçalarını kullanmaya başladı.
- Bilinen açıklar (kod değiştirilmedi): okul açarken varsayılanı izleme seçeneğinin olmaması, kapalı kutuda sessiz
  "Öneriyi kullan", noktanın ondalık sayılması, GB'ta sayı olmayan yazıya aralık iletisi verilmesi, yorumdaki öneri
  örneğinin gerçek çıktıyla tutmaması, sabitlerin sunucuyla elle eşit tutulması.
- Planlı işlerden bu dosyaya dokunacaklar:
  - "Paneller" (iş 5): okul ekle / düzenle tam sayfa olur (`/duzenle/okul/yeni`, `/duzenle/okul/<kisa-ad>`) ve "Sınırlar"
    bölümü gelir: disk sınırı (bu dosyanın kutusu; dosyanın yorumu "okul düzenleme ekranı da aynı parçaları kullanabilir"
    der) + okul yedeği sınırı (varsayılan 1, 0–20). Okullar tablosu okul gezginine döner: simgenin altında açılış tarihi ve
    saatlik hesaplanan boyut ("27.09.2026 · 1,2 GB"), "çok yer kaplıyor" rozeti.
  - "Sunucuda küçültme + aynı dosya tek kopya" (iş 1): dosyalar içerik özetiyle tek kopya saklanacak; her okul başvurduğu
    dosyayı kendi boyutuyla saymaya devam eder — bu dosyadaki sayılar ve mutabakat metni etkilenebilir.
  - "Sistem" (iş 4): "Sistem durumu" ekranı disk, veritabanı ve `data/` alt klasörlerini ayrıntılı gösterecek; Disk
    kartıyla örtüşen bilgiler oraya taşınabilir.
  - "Eğitim içerikleri" (iş 17): eğitmen başına ayrı disk sınırı (site ayarı); "Yıl geçişi" (iş 9): okul yedeği sınırı.
