# sunucu/veri/depo/genel.js

Küçük ama her yerde kullanılan tabloların SQL'i: okul takvimi etkinlikleri, bildirimler (öğrencinin bildiriminin veliye
kopyası ve telefon bildirimi olayı dahil), işlem kaydı, "bu hatırlatma gitti mi" işaretleri ve açılış sayfası rakamları.

## Bu dosya ne yapar?

Adı "genel" çünkü tek bir özelliğe ait olmayan dört küçük tabloyu toplar. En çok kullanılan kısmı bildirimlerdir: bir ödev,
not, yoklama, mesaj … olduğunda bölümler [../index.md](../index.md)'deki `bildir`, `topluBildir`, `cokluBildirim`
kısayollarını çağırır; onlar buradaki `bildir`, `topluBildir`, `cokluBildir`'e iletir.

Bildirimin iki önemli kuralı burada uygulanır:

1. **Veliye kopya.** Öğrenciye giden her bildirimin bir kopyası onaylı velilerine de gider. Başında hangi çocuk olduğu
   yazar ("Ece Çınar · Yeni ödev: …"); dokununca velinin o çocuğa ait sayfası açılır (`#/veli-odevler?c=<öğrenci>`). Aynı
   bildirim aynı velinin iki çocuğuna gidiyorsa veliye TEK bildirim gider, adlar yan yana yazılır. Aynı bildirimi zaten
   kendisi alan veliye kopya gitmez. Veliye kendi metniyle ayrıca haber veren yerler (devamsızlık, etüt yoklaması, servis,
   nakil) ve öğrencinin kendi hatırlatıcıları `{ veliye: false }` ile çağırır.
2. **Veri katmanı dışarıya istek atmaz.** Bildirim yazılınca yalnızca bir olay yayılır (`olaylar.emit('bildirim', …)`);
   telefon bildirimini [../../push.md](../../push.md) bu olayı dinleyerek gönderir.

## İçinde neler var?

### Takvim (`takvim_etkinlikleri`)

- `takvimBul(id)` → [../esleme.md](../esleme.md)'deki `takvim(r)`: `{ id, schoolId, tarih, bitis, baslik, tur, aciklama,
  ekleyenId, yilId, createdAt }` ya da `null`. Okul süzmez.
- `takvimAraligi(okulId, bas, bit)` — verilen aralıkla KESİŞEN okul etkinlikleri (`tarih <= bit AND COALESCE(bitis, tarih)
  >= bas`; birkaç günlük etkinlik aralığa taşsa da gelir), tarih ve ekleniş sırasıyla.
- `takvimEkle(k)` — `INSERT`; `bitis`, `ekleyenId`, `yilId` boşsa `NULL`, `aciklama` boşsa `''`.
- `takvimSil(id)` — kimlikle siler (okulu bölüm denetler).

### Bildirimler (`bildirimler`)

- `olaylar` — `EventEmitter`. `'bildirim'` olayı `[{ kime, metin, baglanti }]` listesiyle, yazmadan sonra `setImmediate`
  ile yayılır (`yay`, iç). Dinleyen: [../../push.md](../../push.md).
- `VELI_SAYFASI` (iç) — öğrenci sayfası → velinin karşılığı: `odevler` → `veli-odevler`, `devamsizligim` →
  `veli-devamsizlik`, `ilerleyisim` ve `sinavlarim` → `veli-ilerleyis`, `etutlerim`, `servis`, `takvim`, `kulupler`, `yemek`
  aynen; listede olmayan her şey `cocuklarim`.
- `veliBaglantisi(baglanti, ogrenciId)` (iç) — `#/<velinin sayfası>?c=<öğrenci>`.
- `veliKopyalari(liste)` (iç) — `liste = [{ kime, metin, baglanti }]`. Tek sorguda: alıcılardan ÖĞRENCİ olanların onaylı
  velileri (`veli_baglari` + `durum = 'approved'`). Veli zaten alıcıysa atlanır; aynı veli + aynı metin birleşir (adlar
  virgülle); metin `"<adlar> · <metin>"`, bağlantı ilk çocuğun veli sayfası.
- `bildirimYaz(liste)` (iç) — kişiye göre değişen metinleri tek `INSERT ... SELECT FROM unnest(...)` ile yazar; kimlik
  `'n_' || md5(random()::text || kişi || metin)`, metin `clean(metin, 300)` (en çok 300 karakter). Sonra olay yayar.
  Kopya eklemez.
- `bildir(kullaniciId, metin, baglanti, secenek)` — tek kişiye; boş kimlikte hiçbir şey yapmaz. `cokluBildir`'e iletir.
- `topluBildir(kullaniciIdleri, metin, baglanti, secenek)` — aynı metni birçok kişiye TEK sorguda
  (`unnest($2::text[])`); tekrar eden ve boş kimlikler ayıklanır; olay yayılır; `secenek.veliye !== false` ise veli
  kopyaları ayrıca yazılır.
- `cokluBildir(liste, secenek)` — `[{ kime, metin, baglanti }]`; kopyalarla birlikte tek `bildirimYaz`.
- `yoneticilereBildir(metin, baglanti)` — bütün `rol = 'admin'` hesaplara `topluBildir` (okul disk sınırı uyarısı).
  Hesabın `durum`'una bakmaz; `secenek` vermediği için veli kopyası sorgusu da (boşuna) çalışır.
- `bildirimleri(kullaniciId, sinir)` — en yeni önce, varsayılan en çok 100 → `esleme.bildirim`: `{ id, userId, text, link,
  read, createdAt }`.
- `bildirimSurumu(kullaniciId)` — kutunun kısa özeti: `{ surum: "<toplam>.<okunmamış>.<son bildirimin ms'si>",
  okunmamis }`. İstemci her yoklamada gönderir; değişmemişse liste yeniden indirilmez
  ([../../bolumler/kayit.md](../../bolumler/kayit.md)).
- `bildirimleriOkundu(kullaniciId)` — okunmamışların hepsini okundu yapar.

### İşlem kaydı (`islem_kaydi`)

- `ISLEM_SINIR` = 5000.
- `islemYaz(kisi, islem, detay, ip)` — kim (`kisi` yoksa ad `'(bilinmiyor)'`, rol `''`, okul `NULL`), ne (`islem` kısa
  anahtar, ör. `yemek.kaydedildi`), ayrıntı (`clean(detay, 300)`), IP (yalnız `net.isIP` geçerliyse, değilse `NULL`), an
  (`now()` — `sunucu/ortak.js`'teki). Yazdıktan sonra tablonun en yeni 5000 satırı dışındakileri siler.
- `islemKayitlari(okulId, islemTuru, sinir)` — `okulId` `null` ise bütün okullar (yönetici), değilse o okul; `islemTuru`
  boş değilse o tür; en yeni önce `sinir` (varsayılan 300) kayıt → `esleme.islemKaydi`. Ayrıca aynı süzgeçle toplam sayı ve
  okulda görülen işlem türleri (son kullanılan önce). Dönüş `{ kayitlar, toplam, turler }`.

### Hatırlatma işaretleri (`hatirlatmalar`)

Otomatik hatırlatmalar ("yarın son gün", "sınavın var" …) aynı olay için ikinci kez gitmesin diye anahtar tutulur
(ör. `'sinav:e_12:u_34'`).

- `ilkKezOlanlar(anahtarlar)` — tek sorguda `INSERT ... SELECT DISTINCT unnest(...) ON CONFLICT DO NOTHING RETURNING`:
  ilk kez görülen anahtarların kümesi (`Set`). Bildirim yalnız bunlara gider.
- `hatirlatmaIsaretle(anahtar)` — tek anahtar için aynısı (`true` = ilk kez). Bugün çağıran yok.
- `hatirlatmaTemizle(gun)` — `gonderilme`'si `gun` günden eski işaretleri siler (çağıran 30 gün verir).

### Açılış sayfası

- `siteSayilari()` — `{ okul: onaylı okul sayısı, kisi: onaylı, rol satırı olmayan, yönetici olmayan hesap sayısı }`.
  [../../site.md](../../site.md) açılış sayfasındaki rakamlar için.

### Tablolar ve şema

Dördü de `001-ilk.sql`: `takvim_etkinlikleri` (başlık 1–120, `bitis >= tarih`; indeks `takvim_okul_tarih (okul_id,
tarih)`), `bildirimler` (kişi silinince `CASCADE`; indeks `bildirimler_kullanici (kullanici_id, olusturma DESC)`),
`hatirlatmalar` (anahtar birincil; `002-hiz.sql` `hatirlatmalar_zaman (gonderilme)` indeksini ekler), `islem_kaydi`
(`kullanici_ad`/`kullanici_rol` kişi silinse de okunsun diye kopyalanır, `ip inet`; indeks `islem_kaydi_okul_tarih`).
`veliKopyalari` ayrıca `kullanicilar` ve `veli_baglari`'nı, `siteSayilari` `okullar` ve `kullanicilar`'ı okur.

## Kimle konuşur?

- Çağırdıkları: [../baglanti.md](../baglanti.md) (`sorgu`, `tek`, `calistir`), [../../ortak.md](../../ortak.md) (`uid`,
  `now`, `clean`), [../esleme.md](../esleme.md) (`takvim`, `bildirim`, `islemKaydi`, `yokIse`), Node'un `net` ve `events`
  modülleri.
- Çağıranlar ([../index.md](../index.md)'deki `depo.genel`; bildirim kısayolları aynı dosyada):
  - Bildirim: [../index.md](../index.md)'deki `bildir`, `topluBildir`, `cokluBildirim` kısayolları üzerinden aile, anket,
    hatırlatıcı, hesaplar, kişilik, mesaj, nakil, ödev, okul-disk, okul-hayati, okul, sınav, site-ayarları, veli ve
    yönetici-okul bölümleri; doğrudan `depo.genel.bildir`: [../../bolumler/etut.md](../../bolumler/etut.md); doğrudan
    `cokluBildir`: [../../bolumler/devamsizlik.md](../../bolumler/devamsizlik.md),
    [../../bolumler/etut.md](../../bolumler/etut.md), [../../bolumler/odev.md](../../bolumler/odev.md),
    [../../bolumler/okul.md](../../bolumler/okul.md), [../../bolumler/quiz.md](../../bolumler/quiz.md),
    [../../hatirlatma.md](../../hatirlatma.md); `yoneticilereBildir`: [../../bolumler/okul-disk.md](../../bolumler/okul-disk.md).
  - Bildirim kutusu: [../../bolumler/kayit.md](../../bolumler/kayit.md) (`bildirimleri`, `bildirimSurumu`,
    `bildirimleriOkundu`).
  - Olay: [../../push.md](../../push.md) (`olaylar.on('bildirim', …)`).
  - Takvim: [../../bolumler/takvim.md](../../bolumler/takvim.md).
  - İşlem kaydı: [../../bolumler/islem-kaydi.md](../../bolumler/islem-kaydi.md) (`islemYaz`, `islemKayitlari`),
    [../../yonetici-dosyasi.md](../../yonetici-dosyasi.md) (`islemYaz`: yönetici eklendi).
  - Hatırlatma: [../../hatirlatma.md](../../hatirlatma.md) (`ilkKezOlanlar`, `hatirlatmaTemizle`),
    [../../bolumler/okul.md](../../bolumler/okul.md) (`ilkKezOlanlar`: müdür programa ders saati ekleyince öğretmene giden
    "programına ders eklendi" bildirimi günde bir kez) ve [../../bolumler/sinav.md](../../bolumler/sinav.md)
    (`ilkKezOlanlar`: aynı sınav notu yeniden kaydedilince bildirim tekrar gitmesin).
  - Açılış: [../../site.md](../../site.md) (`siteSayilari`).
  - Testler: `testler/test-cakisma.js` ve `testler/test-yonetici-dosyasi.js` bu dosyayı doğrudan `require` eder.

## Nasıl çalışır (adım adım)?

### Öğrenciye bildirim

```
bölüm: topluBildir([ogr1, ogr2], "Yeni ödev: Kesirler (Matematik)", "#/odevler")
  1. INSERT bildirimler × 2 (tek sorgu)        → olay: push.js telefonlara gönderir
  2. veliKopyalari: ogr1 ve ogr2'nin onaylı velileri (tek sorgu)
       kardeşlerin ortak velisi → tek satır: "Ece Çınar, Can Çınar · Yeni ödev: …"  #/veli-odevler?c=<ogr1>
  3. bildirimYaz(kopyalar) (tek sorgu)          → olay
```

### İşlem kaydı

```
islemYaz → INSERT → DELETE en yeni 5000 dışındakiler
```

## Dikkat!

- **Telefon bildirimi işlem geri alınsa da gidebilir.** `yay` olayı `setImmediate` ile yayar; bildirim bir `islem` içinde
  yazıldıysa olay çoğu zaman işlem `COMMIT` edilmeden çalışır. İşlem sonra geri alınırsa bildirim veritabanında yoktur ama
  telefon bildirimi gönderilmiş olabilir. Bugünkü bölümler bildirimi işlem BİTTİKTEN sonra çağırıyor (ör. ödev açma,
  mesaj gönderme, müdürün şifre değiştirmesi: önce `islem`, sonra `topluBildir`/`bildir`); yeni kodda da bu sırayı koru.
- **İşlem kaydı sınırı OKUL BAŞINA değil, bütün tablo için 5000.** Kalabalık bir okulun kayıtları öbür okulların eski
  kayıtlarını da iter; üstelik her `islemYaz` bütün tabloyu tarihe göre sıralayan bir `DELETE` çalıştırır (tarih için tek
  başına indeks yok; bugünkü 5000 satırda hızlı). "Optimizasyon + saklama süreleri" işinde ele alınmalı.
- **Kapsam:** `takvimBul`/`takvimSil` kimlikle çalışır; okul denetimi [../../bolumler/takvim.md](../../bolumler/takvim.md)'de.
  `islemKayitlari(null, …)` bütün okulları döndürür; yalnız yönetici için çağrılmalı (bölüm `me.role === 'admin'` iken
  `null` verir). Yetişkin hesabının kendi işlemleri okulsuz yazılır ki okul yönetimi velinin kişisel işlemlerini ve IP'sini
  görmesin ([../../bolumler/islem-kaydi.md](../../bolumler/islem-kaydi.md)).
- **Kişisel veri:** `islem_kaydi` IP adresi ve `detay` metni taşır (ör. yönetici eklenirken ad ve e-posta); bunlar
  yalnız müdür/yönetici ekranında görünür.
- **Birleşik veli bildirimi tek bağlantı taşır:** iki çocuğun adı yazsa da dokununca ilk çocuğun sayfası açılır.
- **Metin 300 karakterde kesilir** (`clean`); veli kopyasında çocuk adları da bu 300'e dahildir.
- **Kimlik rastgele:** bildirim kimliği `md5(random()…)`'dır; çakışma olasılığı ihmal edilir ama çakışırsa `23505` ile
  bütün toplu yazma geri alınır.
- **Kullanılmayan dışa açık işlev:** `hatirlatmaIsaretle` (çağıran yok; `ilkKezOlanlar` kullanılıyor).
- **Saklama:** bildirimler bugün hiç silinmez (kişi silinince `CASCADE` hariç); hatırlatma işaretleri 30 günde silinir.
- **"Bir kez" 30 gün sürer:** `ilkKezOlanlar` anahtarları `hatirlatmaTemizle(30)` ile silindiği için tekillik yalnız 30
  gün geçerlidir. [../../bolumler/sinav.md](../../bolumler/sinav.md)'deki `'sinav:<sınav>:<öğrenci>'` anahtarı 30 günden
  eskiyse, öğretmen o sınavın bir değerini düzeltince "sınavın sonucu açıklandı" bildirimi yeniden gider.
  [../../bolumler/okul.md](../../bolumler/okul.md)'deki `'program:<öğretmen>:<gün>'` anahtarının günü
  `new Date().toISOString()`'tan, yani UTC'den gelir: "günde bir" Türkiye saatiyle 03:00'te döner.

## Testleri

- `testler/test-bildirim.js` — fazladan bildirim gitmemesi (`ilkKezOlanlar`), öğrencinin bildiriminin velisine kopyası,
  iki çocuğa giden aynı ödevin veliye TEK bildirim olması, velinin başka öğrencinin bildirimini görmemesi ve
  `bildirimSurumu` (sürüm değişmediyse `/api/notifications?surum=` listeyi yeniden göndermez).
- `testler/test-takvim.js` — etkinlik ekleme, silme, aralık.
- `testler/test-giris-bilgisi.js`, `testler/test-okul-disk.js`, `testler/test-okul-sayfasi.js`, `testler/test-ozellikler.js` —
  `/api/islem-kaydi` üzerinden işlem kaydı; `testler/test-okul-disk.js` ayrıca yöneticilere giden disk uyarısı.
- `testler/test-push.js` (sunucusuz) — telefon bildirimi şifrelemesi; olayın dinleyicisi tarafı.
- Elle: iki kardeşi aynı veliye bağla, ikisine aynı ödevi ver → velinin kutusunda "Ad1, Ad2 · Yeni ödev: …" tek satır
  olmalı.

## Son durum

- Son değişiklik `30eed5b commit 501` (2026-09-26): veli kopyalarında birleştirme (aynı veli + aynı metin → tek bildirim,
  adlar yan yana). Öncesi `f997eac commit 455`, `e9b0754 commit 344`, `8a537cf commit 297`; ilk hâli `4a7ca51 commit 8`
  (2026-08-28); toplam 7 commit.
- Bilinen açıklar (kod değiştirilmedi): olayın işlemden önce yayılması, işlem kaydı sınırının okul başına olmaması,
  kullanılmayan `hatirlatmaIsaretle`.
- Sıradaki planlı işler (DEVAM.md 4. bölüm): "Optimizasyon + saklama süreleri" bildirimleri 90 günde silecek (buraya bir
  temizlik sorgusu gelir) ve işlem kaydı sınırını gözden geçirebilir; "Mesaj ayarları … Ajanda, duyurudan ajanda +
  hatırlatıcı" takvim tablosunu genişletir ve bildirim panelini SEKMELERE ayırır (bildirimde tür alanı gerekebilir);
  "Sistem" işi site duyurusu ve tarayıcı hata günlüğü ekler.
