# sunucu/veri/depo/okul-disk.js

Okulun dosya alanının SQL'i: bir okulun ve bütün okulların dosya kullanımı (teslim dosyaları + ekler + okul sayfası
fotoğrafları), veritabanının boyutu, disk mutabakatı için kayıt listesi ve %80 / "doldu" uyarılarının bir kez gitmesi.

## Bu dosya ne yapar?

Her okulun dosyaları (öğrencilerin ödev teslim dosyaları, mesaj ve ödev ekleri, okul sayfası fotoğrafları) okulun kendi
disk sınırına sayılır — bir diskin bölümleri gibi (şema 035). Bir yükleme gelince "bu okulun yeri yetiyor mu?" diye
bakmak için kullanımın hızlı bulunması gerekir. Bu dosya kullanımı **dizini gezmeden, dosya kayıtlarındaki boyutlardan**
toplar: `odev_dosyalari` (ödevin okulu), silinmemiş `ekler` ve `okul_fotolari`. Veritabanının kendisi sınıra sayılmaz.

Sınırın ne olduğu (okulun kendi sınırı ya da site ayarındaki varsayılan), yüklemenin reddedilmesi, bildirimin metni ve
saatlik disk mutabakatı [../../bolumler/okul-disk.md](../../bolumler/okul-disk.md)'dedir; okulun sınırını yazan
`diskSiniriYaz` ise [okullar.md](okullar.md)'dedir. Bu dosya yalnız sayar ve uyarı işaretini tutar.

## İçinde neler var?

Bu dosya [../esleme.md](../esleme.md) kullanmaz; iç `satir(r)` dönüştürücüsü:
`{ okulId, siniriMb (null = varsayılan), dagilim: { teslim, ek, foto }, kullanilan }` — hepsi bayt, `Number`'a
çevrilmiş (`bigint` toplamlar).

### Ortak toplam parçaları (bir okul için, `o` = `okullar` satırı)

- `TESLIM` — `sum(d.boyut) FROM odev_dosyalari d JOIN odevler od ON od.id = d.odev_id WHERE od.okul_id = o.id`
  (teslim dosyasının okulu, ödevin okuludur).
- `EK` — `sum(e.boyut) FROM ekler e WHERE e.okul_id = o.id AND NOT e.silindi` (taslaklar dahil; diski silinmiş ek
  sayılmaz).
- `FOTO` — `sum(f.boyut) FROM okul_fotolari f WHERE f.okul_id = o.id`.

Hepsi `COALESCE(…, 0)::bigint`.

### İşlevler

- `okulun(okulId)` — tek okulun görünümü ya da `null` (okul yoksa ya da `okulId` boşsa, o zaman sorgu atılmaz). Tek
  sorgu: `SELECT o.id, o.disk_siniri_mb, TESLIM, EK, FOTO FROM okullar o WHERE o.id = $1`.
- `hepsi()` — bütün okullar (kapatılanlar dahil): `Map(okulId → görünüm + durum)`. Her tablo bir kez `GROUP BY okul_id`
  ile toplanıp `okullar`'a LEFT JOIN edilir (okul başına alt sorgu yok). Yönetici paneli ve sistem özeti kullanır.
- `veritabaniBoyutu()` — `pg_database_size(current_database())` (bayt; bilgi amaçlı, sınıra sayılmaz).
- `kayitlar()` — mutabakat için bütün dosya kayıtları: `{ teslim: Map(id → boyut), ek: Map(id → boyut) (silinmemişler),
  foto: Map(id → boyut) }`. Üç sorgu paralel çalışır (`Promise.all`). Diskteki dosya adları bu kimliklerle karşılaştırılır.
- `uyariYaz(okulId, seviye)` — `seviye` 80 ya da 100. `INSERT INTO okul_dosya_uyarilari … ON CONFLICT (okul_id) DO
  UPDATE SET seviye, zaman = now() WHERE okul_dosya_uyarilari.seviye < EXCLUDED.seviye RETURNING okul_id`: satır yoksa
  yazar, varsa yalnız DAHA YÜKSEK seviyeye çıkarır. Yazdıysa `true` (bildirim gönder), yazmadıysa `false` (bu seviye ya da
  daha yükseği zaten verildi). Tek sorgu olduğu için aynı anda gelen iki yüklemeden yalnız biri `true` alır.
- `uyarilariSifirla(varsayilanMb, oran, okulId)` — kullanımı kendi sınırının `oran`'ının (bölüm 0,7 verir) altına inmiş
  okulların uyarı satırını siler; alan yeniden dolarsa uyarı yeniden gider. Tek `DELETE … USING okullar o` sorgusu;
  karşılaştırma `TESLIM + EK + FOTO < $2::float8 * COALESCE(o.disk_siniri_mb, $1::int)::float8 * 1048576` (sınırı
  olmayan okulda `varsayilanMb`). `okulId` verilirse yalnız o okul (`$3 = '' OR o.id = $3`).

### Tablolar ve şema

| Tablo / sütun / indeks | Şema dosyası |
|---|---|
| `odev_dosyalari.boyut` (`bigint`, > 0), `odev_dosyalari_odev (odev_id, ogrenci_id)` indeksi | `008-odev-dosyalari.sql` |
| `okul_fotolari.boyut` (`integer`), `okul_fotolari_okul (okul_id, olusturma)` indeksi | `018-okul-sayfasi.sql` |
| `ekler` (`boyut`, `silindi`, `okul_id`) | `020-ekler.sql` |
| `okul_dosya_uyarilari` (`okul_id` birincil anahtar, `seviye` 80/100, `zaman`; okul silinince CASCADE) | `033-odev-dosya-izni.sql` |
| `okullar.disk_siniri_mb` (1 MB – 10 TB ya da `NULL`) + `ekler_okul` kısmi indeksi (`WHERE NOT silindi AND okul_id IS NOT NULL`) | `035-okul-disk-siniri.sql` |

`odevler_okul (okul_id, olusturma DESC)` indeksi (001) teslim toplamındaki ödev → okul eşlemesini karşılar.

## Kimle konuşur?

- Çağırdıkları: [../baglanti.md](../baglanti.md) (`sorgu`, `tek`, `calistir`).
- Çağıranlar ([../index.md](../index.md)'deki `depo.okulDisk`):
  - [../../bolumler/okul-disk.md](../../bolumler/okul-disk.md) — `durum()` içinde `okulun`, `uyar()` içinde `uyariYaz`,
    `sistem()` içinde `hepsi` ve `veritabaniBoyutu`, saatlik `mutabakat()` içinde `kayitlar` ve
    `uyarilariSifirla(varsayilanMb(), 0.7)`, yöneticinin sınır değiştirmesinde `uyarilariSifirla(…, okul.id)`.
  - [../../bolumler/yonetici.md](../../bolumler/yonetici.md) — yönetici paneli okul listesi: `hepsi()` (her okulun
    kullanımı ve sistem özeti).
- Dolaylı kullananlar (bölümdeki `okulDisk.durum/sigmaz/ayir/yuklendi` üzerinden): [../../bolumler/ekler.md](../../bolumler/ekler.md),
  [../../bolumler/odev-dosya.md](../../bolumler/odev-dosya.md), [../../bolumler/okul-sayfasi.md](../../bolumler/okul-sayfasi.md),
  [../../bolumler/okul.md](../../bolumler/okul.md) (müdürün okul özeti).
- Tablolar: okur `okullar`, `odevler`, `odev_dosyalari`, `ekler`, `okul_fotolari`; yazar yalnız `okul_dosya_uyarilari`.

## Nasıl çalışır (adım adım)?

### Bir yükleme

```
bölüm (ekler / odev-dosya / okul-sayfasi):
  d = await okulDisk.durum(okulId)          → depo.okulDisk.okulun(okulId)  (tek sorgu, üç toplam)
  okulDisk.sigmaz(d, boyut)?                → evet: okulDisk.doldu(d) → uyar(100) → uyariYaz(okul, 100) true ise bildirim
                                              → 507 "okul dolu"
  okulDisk.ayir(okulId, boyut)              (bellekte "süren yükleme" payı; aradan await geçmeden)
  … dosya yazılır, kayıt eklenir …
  okulDisk.yuklendi(d, boyut)               → kullanım ≥ %80 ise uyar(80) → uyariYaz(okul, 80) true ise bildirim
  finally okulDisk.birak(okulId, boyut)
```

### Uyarı işaretinin yaşamı

```
yok ──uyariYaz(80)──→ 80 ──uyariYaz(100)──→ 100
 ↑                     │ uyariYaz(80) → false (zaten)   │ uyariYaz(80/100) → false
 └─ uyarilariSifirla: kullanım < %70 × sınır ─────────────┘   (saatlik mutabakatta ve sınır değişince)
```

## Dikkat!

- **Sayım kayıtlardan, gerçek diskten değil:** dosya küçültülünce kayıt güncellenir, sayım da düşer; ama kayıtsız
  ("sahipsiz") dosyalar ve yarım kalmış `.yukleniyor` dosyaları sınıra sayılmaz. Bunları saatlik mutabakat günlüğe yazar
  ([../../bolumler/okul-disk.md](../../bolumler/okul-disk.md)).
- **Silinmiş ekler sayılmaz, silinmiş teslimler satırıyla gider:** ek 7 gün sonra diskten silinince satırı `silindi`
  diye kalır ve `EK` toplamından düşer; teslim dosyası silinince `odev_dosyalari` satırı da silinir.
- **Kilit yok, yarış bellekte çözülür:** `okulun` anlık bir sayımdır; aynı anda gelen iki büyük yüklemenin ikisinin de
  sığdığını sanmaması için bölüm bellekte "süren yüklemeler" payı tutar (`ayir`/`birak`). Bu pay TEK süreç içindir:
  sunucu birden çok süreçle çalıştırılırsa sınır kısa süreliğine aşılabilir.
- **`uyariYaz` yarışa dayanıklıdır** (koşullu upsert tek sorgu): %80 ve "doldu" bildirimi okul başına birer kez gider.
- **`uyarilariSifirla`'nın sınırı SQL'de hesaplanır:** `varsayilanMb`'yi bölüm verir (`site_ayarlari` > ortam değişkeni
  > 5 GB). `$1::int` dönüşümü tam sayı MB bekler; bölüm zaten tam sayı verir.
- **Ölçek:** `okulun` üç ilişkili alt sorgu, `hepsi` üç gruplamalı tam tarama; `kayitlar` BÜTÜN dosya kayıtlarını belleğe
  alır (saatte bir). Bugünkü boyutta sorun değil; çok büyüyünce "Optimizasyon" işinde ele alınmalı. Teslim toplamı
  okulun bütün ödevlerini gezer (`odevler_okul` + `odev_dosyalari_odev` indeksleri).
- **Kapatılmış okullar:** `hepsi` onları da döndürür (kullanımları yerinde durur); sistem özeti ayrılan alanı hesaplarken
  `rejected` okulları atlar (bölümde).
- **Güvenlik:** bütün değerler parametreyle; SQL parçaları (`TESLIM`, `EK`, `FOTO`) koddaki sabitlerdir. Bu dosya kişisel
  veri döndürmez, yalnız sayı.

## Testleri

- `testler/test-okul-disk.js` — varsayılan sınır (ortam, site ayarı, 5 GB), okul açarken ve sonradan sınır verme, müdürün
  sınırı değiştirememesi, kullanımın dağılımı (teslim + ek + fotoğraf; kayıttaki boyut), silinen ek ve teslimin sayımdan
  düşmesi, %80 bildiriminin bir kez gitmesi, sığmayan yüklemenin 507 alması, "doldu" bildiriminin müdüre ve yöneticiye
  bir kez gitmesi, sınır büyüyüp kullanım %70 altına inince uyarının yeniden kurulması (`uyarilariSifirla`), sınırın
  kullanımın altına küçülebilmesi (dosya silinmez).
- `testler/test-odev-dosya.js`, `testler/test-yorum-ek.js`, `testler/test-okul-sayfasi.js` — yüklemeler (dolaylı olarak
  `okulun`).
- Elle: yönetici paneli > Okullar'da bir okulun "kullanılan" sütununa bak; o okula bir ek yükleyip sayfayı yenile →
  ek boyutu kadar artmalı.

## Son durum

- Tek commit: `40fc7e7 commit 525` (2026-09-27) — okul disk sınırı işiyle (035) bu hâliyle eklendi.
- Bilinen açıklar (kod değiştirilmedi): süren yükleme payının yalnız tek süreçte geçerli olması, `kayitlar`'ın bütün
  kayıtları belleğe alması.
- Sıradaki planlı işler (DEVAM.md 4. bölüm): **"Sunucuda küçültme … aynı dosya tek kopya"** bu dosyayı en çok
  etkileyecek iş: aynı dosya tek kopya tutulursa bir dosya birden çok kayıtta görünür ve toplamlar çift sayabilir —
  sayım "benzersiz dosya" üzerinden yeniden yazılmalı. **"Paneller ve okul gezgini"** okul simgesinin altında "kapladığı
  yer"i (GB/MB) gösterecek ve `/duzenle` okul sayfalarına disk + yedek sınırı alanlarını getirecek (okul simgesi de
  yeni bir dosya türü olarak sayıma girebilir). "Yıl geçişi"ndeki okul yedeği (1/1 sınır) ayrı bir yedek sınırı getirir.
