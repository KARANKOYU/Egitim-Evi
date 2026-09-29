# sunucu/veri/depo/okullar.js

Sistemde açılmış okulların (`okullar`) ve eğitim yıllarının (`egitim_yillari`) SQL'i: okul bulma/açma, durum, disk
sınırı, okul adresi (kısa ad), konum, servis saatleri, yönetici paneli özeti ve yıl ekleme/aktif yapma.

## Bu dosya ne yapar?

Bir okul, yönetici "Okul aç" dediğinde bu tabloya satır olarak girer ([../../bolumler/yonetici-okul.md](../../bolumler/yonetici-okul.md)).
Satırda okulun adı, ili, ilçesi, MEB kodu, durumu, **okul adresi** (`kisa_ad`: `/school/<kisa-ad>` ile açılan sayfa ve
giriş), haritadaki konumu, servis saatleri ve disk sınırı durur. Her okulun eğitim yılları ("2026-2027") ayrı tabloda,
okul başına tek aktif yılla tutulur.

Karıştırma: [../../okullar.md](../../okullar.md) (`sunucu/okullar.js`) MEB'in okul LİSTESİDİR (`data/okullar.json`,
kayıt ekranında arama); bu dosya ise sistemde AÇILMIŞ okulların veritabanı kaydıdır.

**Durum ne demek?** `durum` üç değer alır: `approved` (açık okul), `pending`, `rejected` (kapatılmış; MEB kodu yeniden
kullanılabilir, kısa adı ise satırda kaldıkça başka okula verilemez). Müdür başvurusu → yönetici onayı düzeni 516'da kaldırıldı; bugün okul yönetici tarafından
doğrudan `approved` açılır. `pending` bugün yalnız "müdürü kaldırılmış (sahipsiz) okul" anlamında kullanılıyor:
[../../bolumler/yonetici.md](../../bolumler/yonetici.md) müdürü silerken okulu `pending`'e çeker, "Okul aç" böyle bir okulu
tanıyıp yeniden `approved` yapar (aşağıda Son durum: bu adlandırma değişecek).

## İçinde neler var?

Satır → nesne [../esleme.md](../esleme.md)'deki `okul(r)`: `{ id, mebId, name, city, district, type, status, kisaAd,
enlem, boylam, servisSaatleri: { sabahBas, sabahBit, aksamBas, aksamBit }, diskSiniriMb, createdAt }` (servis saati
boşsa varsayılanlar 07:00–09:20 / 16:30–19:00, disk sınırı `null` = site ayarındaki varsayılan). Yıl → `yil(r)`: `{ id,
schoolId, ad, bas, bit, aktif, createdAt }`.

### Okullar

- `bul(id)` — tek okul ya da `null` (durumuna bakmaz).
- `ekle(s)` — `INSERT (id, meb_kodu, ad, il, ilce, tur, durum, olusturma, kisa_ad, disk_siniri_mb)`; boş MEB kodu `''`,
  boş kısa ad ve disk sınırı `NULL`. Aynı kısa ad (`okullar_kisa_ad`) ya da reddedilmemiş aynı MEB kodu
  (`okullar_meb_kodu_tekil`) `23505` verir; [../baglanti.md](../baglanti.md) bunları `kisaAd` / `okul` alanlı iletiye çevirir.
- `durumYaz(id, durum)` — durumu yazar.
- `diskSiniriYaz(id, mb)` — okulun disk sınırı (MB); `null` → site ayarındaki varsayılan (035).
- `cakisan(mebKodu, il, ad)` — "bu okul zaten kayıtlı mı?": reddedilmemiş okullardan MEB kodu aynı olan YA DA aynı ildeki
  okulları çeker, JavaScript'te MEB koduna ya da Türkçe küçük harfe çevrilmiş ada göre ilk eşleşeni döner (ya da `null`).
- `kayitIcin(il)` — kayıt formu: onaylı ve ONAYLI MÜDÜRÜ OLAN okullar (`EXISTS ... rol = 'principal' AND durum =
  'approved'`), `il` verilirse o il, Türkçe ad sırası.
- `genelBakis()` — yönetici paneli: her okul + `_mudur` (bir müdürün adı), `_ogrenci`, `_ogretmen` (onaylı), açılış
  sırasıyla; tek sorgu, okul başına üç alt sorgu.
- `mudurKimlikleri(okulId)` — okulun onaylı müdür satırlarının kimlikleri (okul adresi değişince ve disk doluluk
  uyarısında bildirim).
- `konumYaz(id, enlem, boylam)` — okulun haritadaki yeri (servis haritasında okul işareti; 010).
- `servisSaatleriYaz(id, s)` — `s = { sabahBas, sabahBit, aksamBas, aksamBit }` (`'SS:DD'`); biçim ve sıra şemada da
  denetlenir (028 `okullar_servis_saat_bicimi`, `okullar_servis_saat_sirasi` → aykırıysa `23514`).

### Okul adresi (kısa ad)

- `kisaAdla(kisa)` — adresten okul; YALNIZ onaylı okul (kapatılmış ya da sahipsiz okulun adresi açılmaz).
- `kisaAdVarMi(kisa, haricId)` — adres başka bir okulda mı (her durumdaki okullara bakar).
- `kisaAdYaz(id, kisa)` — adresi yazar; aynı anda başka okul aldıysa tekil indeks `23505` verir.
- `kisaAdsizlar()` — adresi olmayan, kapatılmamış okullar (`id, ad, ilce`); açılışta [../index.md](../index.md) bunlara
  adres üretir.
- `adresliOkullar()` — ana sayfadaki okul arama: onaylı ve adresli okullar (`id, ad, il, ilce, kisa_ad`); süzme çağıranda
  (Türkçe karakterden bağımsız).
- `adresListesi()` — yönetim paneli > Site ayarları > Okul adresleri: kapatılmamış bütün okullar ve adresleri (`id, ad,
  il, ilce, durum, kisa_ad`).

### Eğitim yılları (`egitim_yillari`)

- `yillari(okulId)` — okulun yılları, ada göre yeniden eskiye.
- `yilBul(id)` — tek yıl ya da `null` (okul süzmez).
- `yilEkle(y)` — işlemde: yeni yıl aktifse okulun öbür yılları önce pasife çekilir, sonra yıl eklenir.
- `yilAktifYap(okulId, id)` — işlemde: okulun bütün yılları pasif, sonra `id` (ve yalnız bu okulunsa) aktif.

### Tablolar ve şema

| Tablo / sütun | Şema dosyası |
|---|---|
| `okullar` (ad 2–140, `durum` pending/approved/rejected, `okullar_meb_kodu_tekil` reddedilmemişlerde), `egitim_yillari` (ad `YYYY-YYYY`, `bitis > baslangic`, `UNIQUE (okul_id, ad)`, `egitim_yillari_tek_aktif`: okul başına bir aktif yıl) | `001-ilk.sql` |
| `kisa_ad` (biçim `^[a-z0-9][a-z0-9-]{1,38}[a-z0-9]$`) + `okullar_kisa_ad` tekil indeksi | `009-okul-adresi-hesaplar.sql` |
| `enlem`, `boylam` | `010-servis-konum.sql` |
| `servis_sabah_bas/bit`, `servis_aksam_bas/bit` + biçim ve sıra CHECK'leri | `028-servis-yoklama.sql` |
| `disk_siniri_mb` (1 MB – 10 TB ya da `NULL`) | `035-okul-disk-siniri.sql` |

`kayitIcin`, `genelBakis`, `mudurKimlikleri` ayrıca `kullanicilar`'ı okur.

## Kimle konuşur?

- Çağırdıkları: [../baglanti.md](../baglanti.md) (`sorgu`, `tek`, `calistir`, `islem`, `tr`), [../esleme.md](../esleme.md)
  (`okul`, `yil`).
- Çağıranlar ([../index.md](../index.md)'deki `depo.okullar`):
  - [../../bolumler/yonetici-okul.md](../../bolumler/yonetici-okul.md) — "Okul aç": `cakisan`, `ekle`, `kisaAdVarMi`,
    `kisaAdYaz`, `durumYaz`, `diskSiniriYaz`. [../../bolumler/yonetici.md](../../bolumler/yonetici.md) — `genelBakis`,
    müdür silinince `durumYaz(…, 'pending')`.
  - [../../bolumler/kayit.md](../../bolumler/kayit.md) — `kayitIcin`, `adresliOkullar`, okul adresinden girişte `kisaAdla`.
  - [../../http.md](../../http.md) — `/school/<kisa-ad>` isteğinde okul var mı (`kisaAdla`, 30 saniyelik önbellekle).
  - [../../bolumler/site-ayarlari.md](../../bolumler/site-ayarlari.md) — okul adresleri ekranı (`adresListesi`, `kisaAdVarMi`,
    `kisaAdYaz`, `mudurKimlikleri`, `bul`); [../../bolumler/hesaplar.md](../../bolumler/hesaplar.md) — müdürün adres ve konum
    ayarı (`kisaAdVarMi`, `kisaAdYaz`, `konumYaz`, `bul`).
  - [../../bolumler/okul-disk.md](../../bolumler/okul-disk.md) (`bul`, `diskSiniriYaz`, `mudurKimlikleri`),
    [../../bolumler/okul-hayati.md](../../bolumler/okul-hayati.md) (`bul`, `servisSaatleriYaz`),
    [../../bolumler/okul-sayfasi.md](../../bolumler/okul-sayfasi.md), [../../bolumler/cihaz.md](../../bolumler/cihaz.md),
    [../../bolumler/nakil.md](../../bolumler/nakil.md) (`bul`, `yillari`).
  - [../../bolumler/egitim-yili.md](../../bolumler/egitim-yili.md) — `yillari`, `yilBul`, `yilEkle`, `yilAktifYap`.
  - [../index.md](../index.md) açılışta — `kisaAdsizlar`, `kisaAdVarMi`, `kisaAdYaz` (eski okullara adres).
  - Araç: `araclar/deneme-okulu.js` (`bul`, `ekle`, `durumYaz`, `cakisan`).

## Nasıl çalışır (adım adım)?

### "Okul aç" (yönetici)

```
yonetici-okul.js: cakisan(meb, il, ad)            (kapatılmış 'rejected' okullar hiç dönmez)
   eşleşme yok                              → işlemde: kişi kodu tüket → okullar.ekle({ ..., durum: 'approved', kisaAd, disk })
   eşleşme onaysız + okulunMuduruVarMi hayır → "sahipsiz": işlemde: kişi kodu tüket → kisaAdYaz + durumYaz('approved')
                                               (+ disk verildiyse diskSiniriYaz; verilmezse eski sınır kalır)
   eşleşme 'approved'                       → "Bu okul zaten kayıtlı ve müdürü var."
   eşleşme onaysız ama müdür satırı var     → "Bu okul zaten kayıtlı; müdürünü "Müdürler" listesinde bul."
```

Sahipsiz okulun adı, ili, türü yeniden yazılmaz; yalnız adres, durum ve (verildiyse) disk sınırı değişir. Adres ön
denetimi `kisaAdVarMi(kisaAd, dup.id)` olduğu için okul kendi eski adresini yeniden alabilir.

### Yeni aktif yıl

```
islem { UPDATE egitim_yillari SET aktif = false WHERE okul_id ; INSERT (aktif = true) }
         ← aynı anda ikinci aktif yıl eklenirse egitim_yillari_tek_aktif 23505 verir, işlem geri alınır
```

## Dikkat!

- **Kapsam bölümde:** `bul`, `durumYaz`, `diskSiniriYaz`, `konumYaz`, `servisSaatleriYaz`, `kisaAdYaz`, `yilBul` yalnız
  kimlikle çalışır. Müdür uçları okul kimliğini oturumdan (`me.schoolId`) verir; `yilAktifYap`'ı çağıran bölüm yılın o okula
  ait olduğunu önce denetler (koşul SQL'de de var ama önce BÜTÜN yıllar pasife çekildiği için yanlış bir `id` okulu aktif
  yılsız bırakırdı).
- **Birden çok müdür:** `genelBakis`'teki `_mudur` `LIMIT 1`'dir, sırasızdır ve müdür satırının durumuna bakmaz; okulda
  iki müdür olursa hangisinin adı görüneceği belli değildir. `kayitIcin` ve `mudurKimlikleri` ise yalnız ONAYLI müdürleri
  sayar. "Birden çok müdür" işinde birlikte ele alınmalı.
- **`pending` kalıntısı:** okul için `pending` bugün "müdürü yok" demektir; ama `kisaAdla` onu açmaz (adres 404),
  `kayitIcin` göstermez. Kullanıcının düzeltmesiyle bu durum "Müdürü yok" adını alacak (Son durum).
- **`cakisan` il içindeki bütün okulları çeker** ve adı JavaScript'te karşılaştırır (Türkçe büyük/küçük harf için). Sistemde
  açılmış okul sayısı arttıkça il başına satır sayısı büyür; bugün sorun değil. Karşılaştırma boşluk/noktalama farkını
  yakalamaz ("Atatürk Ortaokulu" ile "Atatürk  Ortaokulu" farklı sayılır).
- **`kisaAdVarMi` ön denetimdir;** asıl koruma `okullar_kisa_ad` tekil indeksidir (aynı anda iki okul aynı adresi alırsa
  ikincisi `23505` → "kisaAd" alanlı ileti).
- **Adres önbelleği:** [../../http.md](../../http.md) `kisaAdla` sonucunu 30 saniye saklar. Adres değiştiren uçlar
  (hesaplar, site ayarları, okul açma) önbelleği hemen boşaltır (`okulOnbellekBosalt`); ama müdür silinip okul `pending`'e
  çekilince ([../../bolumler/yonetici.md](../../bolumler/yonetici.md)) boşaltılmaz: adres en çok 30 saniye daha "var"
  görünebilir. Zararı küçük: yalnız sayfa kabuğu açılır; sayfanın okul bilgisini isteyen uç ve o adresten giriş
  ([../../bolumler/kayit.md](../../bolumler/kayit.md)) önbelleksiz `kisaAdla` kullandığı için "Bu adreste bir okul yok." /
  "Bu okul adresi bulunamadı" alır.
- **Servis saatleri boş olamaz:** 028 sütunları `NOT NULL DEFAULT` ile ekler; [../esleme.md](../esleme.md)'deki
  varsayılanlar (07:00–09:20 / 16:30–19:00) yalnız satırda sütun hiç yoksa (eksik `SELECT`) devreye girer.
- **Kişisel veri yok:** bu tablolar yalnız kurum bilgisi taşır; `genelBakis`'teki müdür adı `kullanicilar`'dan gelir.

## Testleri

- `testler/test-yonetim.js` — yönetici "Okul aç" (`/api/admin/okul-ac`: kişi kodu, adres biçimi, e-posta), müdür listesi
  (`/api/admin/principals`); `testler/test-yetiskin.js` — okulu yöneticinin açıp kişiyi kişi koduyla müdür yapması.
  `testler/test-cakisma.js`, `testler/test-kisi-kodu.js`, `testler/test-nakil.js`, `testler/test-okul-disk.js` de ikinci
  okullarını `/api/admin/okul-ac` ile açar (dolaylı olarak `ekle` ve `cakisan`).
- `testler/test-site-ayarlari.js` — okul adresleri ekranı (adres değiştirme, müdürlere bildirim).
- `testler/test-adresler.js` — `/school/<adres>` sayfaları; `testler/test-giris-kayit.js` — okul adresinden giriş.
- `testler/test-egitim-yili.js` — yıl ekleme, aktif yıl, kayıtların yıla bağlanması.
- `testler/test-okul-disk.js` — okulun disk sınırı; `testler/test-servis-konum.js` — okul konumu;
  `testler/test-servis-yoklama.js` — servis saatleri (`/saatler`).
- Elle: yönetici panelinden bir okulun müdürünü kaldır → okul listesinde durum değişmeli, `/school/<adres>` açılmamalı;
  "Okul aç" ile aynı okulu yeni bir kişi koduyla aç → eski adresi yeniden verebilmelisin ("başka bir okulda" demez), okul
  yeni satır olarak değil eski satırıyla `approved`'a döner.

## Son durum

- Son değişiklik `40fc7e7 commit 525` (2026-09-27): okul disk sınırı (`disk_siniri_mb` `ekle`'de, `diskSiniriYaz`; 035).
  Öncesi `276c0a0 commit 521`: `adresListesi`, `mudurKimlikleri` (site ayarları > okul adresleri); `24050a2 commit 518`:
  `servisSaatleriYaz`; `0acca75 commit 516`: müdür başvurusu kalktı ("aynı okula ikinci başvuru" → "bu okul zaten
  kayıtlı mı"); `e9b0754 commit 344`: `adresliOkullar`, `konumYaz`, `genelBakis`. İlk hâli `b962a68 commit 42`
  (2026-08-28); toplam 6 commit.
- Bilinen açıklar (kod değiştirilmedi): çok müdürlü okulda `_mudur` belirsizliği, `pending`'in "müdürü yok" anlamında
  kullanılması, `cakisan`'ın boşluk farkını yakalamaması.
- Sıradaki planlı işler (DEVAM.md 4. bölüm): **"Paneller ve okul gezgini"** bu dosyayı en çok etkileyecek iş. Kullanıcının
  29 Eylül düzeltmesi: (1) müdür atama ONAY BEKLEMEDEN olur (müdür öğretmeni ya da kişi koduyla bir yetişkini doğrudan
  müdür yapar; yönetici müdürsüz okula "Müdür ata" der) — `pending` "Müdürü yok" olur, "bekliyor/onay/Giremiyor" sözleri
  kalkar, eski satırlar göçle çevrilir; (2) okul gezgini BOŞ MASAÜSTÜ gibi olur: her okul bir dosya simgesi, sürüklenip
  başka ızgara hücresine konabilir (okulun klasörü ve ızgara yeri için yeni sütun/tablo gerekir); (3) her okula müdürün
  koyduğu **okul simgesi**: 128×128, oran korunur, kare değilse kalan yer beyazla doldurulur, gezginde ve portallarda simge
  olarak görünür (okula simge alanı gelir). Aynı iş birden çok müdürü, `/duzenle` okul sayfalarını (disk + yedek sınırı)
  ve okul simgesinin altında açılış tarihi + kapladığı yeri getirir. "Yıl geçişi" (yeni yıl sihirbazı) `yilEkle` /
  `yilAktifYap`'ı kullanacak. `sunucu/okullar.js`'teki `okulVeri` hatası "Güvenlik denetimi" işinde düzeltilecek (bu
  dosya değil).
