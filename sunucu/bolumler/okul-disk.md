# sunucu/bolumler/okul-disk.js

Okul başına disk sınırı: okulun dosyalarının (teslim dosyaları, ekler, okul sayfası fotoğrafları) sayımı, yükleme
sırasında "sığar mı" denetimi, %80 ve "doldu" bildirimleri, saatlik mutabakat ve yöneticinin sınırı değiştirmesi.

## Bu dosya ne yapar?

Sunucunun diski bütün okullar arasında paylaşılıyor. Bir okulun öğrencileri durmadan video yüklerse öteki okullara yer
kalmaz. Bu dosya her okula, bir bilgisayardaki disk bölümü gibi, kendi alanını verir:

- Okulun sınırı `okullar.disk_siniri_mb`'de durur (şema 035). Boşsa site ayarındaki "Varsayılan okul disk sınırı" geçerlidir
  (`site.ayar('okulDiskMb')`: panelden kaydedilen > `EE_OKUL_DOSYA_GB` ortam değişkeni > 5 GB).
- Yönetici okulu açarken sınırı verir (öneri: öğrenci sayısı × 10 MB, en az 2 GB) ve Okullar ekranından değiştirir.
- Kullanım dosya KAYITLARINDAN toplanır (dizin gezilmez, hızlı). Veritabanının kendisi sınıra sayılmaz.
- Üç yükleme yolu (ödev teslimi [odev-dosya.md](odev-dosya.md), ekler [ekler.md](ekler.md), okul sayfası fotoğrafı
  `sunucu/bolumler/okul-sayfasi.js`) yüklemeden önce buraya "sığar mı" diye sorar; sığmazsa 507 döner.
- Kullanım %80'i geçince ve dolunca müdüre ve sistem yöneticisine BİRER KEZ bildirim gider.
- Sınır küçültülürse var olan dosyalar silinmez; yalnız yeni yükleme durur.

Bu dosyanın kendi `uclar`'ı yok: tek ucu (`POST /api/admin/okul-disk-siniri`) yönetici yönlendiricisi
[yonetici.md](yonetici.md) çağırır.

## İçinde neler var?

### Sabitler

- `MB`, (iç) `GB`.
- `UYARI` — 0,8: kullanım sınırın %80'ine ulaşınca bir kez uyarı. `UYARI_SIFIRLA` — 0,7: kullanım %70'in altına inince
  uyarı yeniden kurulur (alan yeniden dolarsa yine gider).
- `ONERI_KISI_MB` — 10, `ONERI_EN_AZ_MB` — 2048 (öneri: öğrenci × 10 MB, en az 2 GB, en çok `site.OKUL_DISK.cok` = 10 TB).
- `OKUL_DOLU` — yükleme reddinin metni: "Okulunun dosya alanı doldu. Okul yönetimi eski dosyaları sildirebilir ya da
  yöneticiden alan isteyebilir."

### Biçim ve sınır yardımcıları (dışa açık)

- `boyutYaz(n)` — bayttan "3,2 GB", "820 MB", "0,4 MB" (GB ve 10 MB altı bir ondalık, Türkçe virgül; 0 → "0 MB").
- `alanYaz(kullanilan, sinir)` — "3,2 GB / 5 GB".
- `varsayilanMb()` — site ayarındaki varsayılan sınır (MB).
- `sinirBayt(siniriMb)` — okulun sınırı bayt olarak (`null` ise varsayılan).
- `sinirAdi(mb)` — işlem kaydı için: "3 GB" ya da "varsayılan (5 GB)".
- `oneriMb(ogrenciSayisi)` — önerilen sınır (MB) ya da öğrenci yoksa `null` (varsayılan).
- `mbOku(v, bosVarsayilan)` — kullanıcıdan gelen sınırı okur: `{ mb }` (`null` = varsayılan) ya da `{ hata }`. `null` her
  zaman varsayılandır; `bosVarsayilan` iken (okul açma) yok/boş değer de varsayılandır, değilse "Disk sınırını yaz.".
  Değer `site.okulDiskTemizle` ile denetlenir: 1 MB ile 10 TB arası TAM SAYI MB; değilse "Disk sınırı 1 MB ile 10 TB
  arasında olmalı (MB olarak tam sayı).".

### Yükleme sırasında kullanılanlar (dışa açık)

- `durum(okulId)` — `{ okulId, siniriMb, dagilim: { teslim, ek, foto }, kullanilan, sinir, ozel }` ya da okul yoksa
  `null`. `ozel` = okulun kendi sınırı var mı. Tek `await`'lik iş budur.
- `sigmaz(d, boyut)` — `kullanilan + süren yüklemeler + boyut > sinir` mi? `d` `null` ise (okulsuz yükleme) `false`: sınır
  yok.
- `ayir(okulId, boyut)` / `birak(okulId, boyut)` — süren yüklemelerin baytını okul başına bellekte tutar (üç tür birlikte).
- `doldu(d)` — yükleme reddedildi: arka planda (beklemeden) 100 seviyesinde `uyar` çalışır.
- `yuklendi(d, boyut)` — dosya kaydedildi: yeni kullanım sınırın %80'ine ulaştıysa 80 seviyesinde `uyar`.
- `uyar(d, seviye, kullanilan)` — seviye (80 ya da 100) daha önce verilmediyse (`depo.okulDisk.uyariYaz`) okulun
  müdürlerine (`topluBildir`) ve sistem yöneticilerine (`yoneticilereBildir`) bildirim. Metinler:
  - 80: "Okulun dosya alanının %80'i doldu (3,2 GB / 4 GB). Teslim dosyaları son teslimden 7 gün sonra, ekler 7 gün sonra
    kendiliğinden silinir." / yöneticiye "<Okul>: dosya alanının %80'i doldu (…)."
  - 100: "Okulun dosya alanı doldu (4 GB). Yeni dosya yüklenemiyor; …" / yöneticiye "… Sınırı Okullar sayfasından
    büyütebilirsin."
- `gorunum(d)` — ekrana giden hâl: `{ kullanilan, sinir, siniriMb, ozel, dagilim, oran }` (`oran` yüzde, bir ondalık).

### Sistem geneli ve mutabakat (dışa açık)

- `sistem(harita?)` — yönetim paneli için: `{ okul, ayrilan, kullanilan, bos, diskToplam, veritabani, varsayilanMb, asim,
  uyari, mutabakat }`. Kapatılmış (`rejected`) okullar ayrılan alana sayılmaz ama kullanımları sayılır. Ayrılan alanın henüz
  kullanılmayan kısmı diskteki boş yerden fazlaysa `asim: true` ve Türkçe `uyari` (izin verilir, yalnız uyarır).
  `veritabani` `pg_database_size` ile yaklaşık boyut. `harita` verilmezse `depo.okulDisk.hepsi()` okunur.
- `mutabakat()` — saatlik: kayıtlar (`depo.okulDisk.kayitlar`) ile `DATA/dosyalar`, `DATA/ekler`, `DATA/okul-fotolari`
  klasörlerindeki dosyalar karşılaştırılır. Sayılar: `kayitli`, `diskte`, `sahipsiz` (kaydı olmayan), `yarim`
  (`.yukleniyor`), `kayip` (kaydı var dosyası yok), `boyutFarki`. Sorun varsa sunucu günlüğüne "! Dosya mutabakatı: …"
  yazılır. Son sonuç bellekte tutulur (`sistem().mutabakat`). Sonunda kullanımı %70'in altına inen okulların uyarısı
  silinir. Dosya SİLMEZ; sahipsizleri her türün kendi temizliği siler.
- İç: `diskBilgisi()` — `fs.statfs(DATA)` ile boş ve toplam yer (bilinmiyorsa `null`); `KLASORLER`; `sonMutabakat`.

### Uç

- `siniriDegistir(req, res, me, body)` — **`POST /api/admin/okul-disk-siniri`** gövde `{ okulId, mb }` (`mb`: tam sayı MB
  ya da `null` = varsayılan). Kimin çağırabileceğini [yonetici.md](yonetici.md) belirler (yalnız sistem yöneticisi; öteki
  herkese bilinmeyen adresle aynı 404). Hatalar alan adıyla: okul yok 404 `{ alan: 'okulId' }`, bozuk değer 400
  `{ alan: 'mb' }`. Değiştiyse okula yazılır, işlem kaydına `okul.disk-siniri` ("Okul: 5 GB → 10 GB") yazılır ve o okulun
  uyarısı gerekiyorsa sıfırlanır (sınır büyüdüyse %80 uyarısı yeniden gidebilsin). Değer aynıysa hiçbir şey yazılmaz
  (işlem kaydı da yok), mesaj "Okulun disk sınırı zaten böyle: …" der. Cevap `{ okul: { id, ad, disk },
  sistem, message, uyari }`; okulun dosyaları yeni sınırı aşıyorsa mesaj "var olan dosyalar silinmez, yalnız yeni yükleme
  durur." der.

## Kimle konuşur?

- Çağırdıkları: `fs`, `path`; `../http` → `ok`, `sendJSON`; `../ortak` → `clean`; `../site` → `ayar('okulDiskMb')`,
  `OKUL_DISK`, `okulDiskTemizle`; `../veri` → `depo`, `topluBildir`; `../yollar` → `DATA`; `./islem-kaydi` → `islemYaz`.
- Depo ve tablolar:
  - `depo.okulDisk` (`sunucu/veri/depo/okul-disk.js`) → okulun kullanımı `odev_dosyalari` (+ `odevler.okul_id`), `ekler`
    (silinmemiş, taslaklar dahil) ve `okul_fotolari` toplamlarından; sınır `okullar.disk_siniri_mb`; uyarılar
    `okul_dosya_uyarilari` (şema 033). İşlevler: `okulun`, `hepsi`, `veritabaniBoyutu`, `kayitlar`, `uyariYaz`,
    `uyarilariSifirla`.
  - `depo.okullar` → `bul`, `mudurKimlikleri`, `diskSiniriYaz`; `depo.genel.yoneticilereBildir` → `bildirimler`.
- Onu çağıranlar:
  - [odev-dosya.md](odev-dosya.md), [ekler.md](ekler.md), `sunucu/bolumler/okul-sayfasi.js` — `durum`, `sigmaz`, `doldu`,
    `OKUL_DOLU`, `ayir`, `birak`, `yuklendi`;
  - [yonetici.md](yonetici.md) — `siniriDegistir` (uç), `gorunum`, `oneriMb`, `sistem` (`GET /api/admin/overview`'da
    okulların ve sistemin diski);
  - [yonetici-okul.md](yonetici-okul.md) — okul açarken `mbOku(body.diskMb, true)`, `sinirAdi`;
  - [okul.md](okul.md) — müdürün `GET /api/school/ozet` cevabındaki `disk` (`gorunum(durum(...))`);
  - [site-ayarlari.md](site-ayarlari.md) — `boyutYaz`, `MB` (varsayılan sınırın işlem kaydındaki yazımı);
  - `sunucu/index.js` — `mutabakat()` saatte bir, dosya temizliklerinden (`dosyaSupur`, `ekSupur`) sonra.
- Ön yüz: `public/js/yonetim/09d-okul-disk.js` (yönetim panelinin Okullar ekranında sınır değiştirme ve sistem diski),
  `public/js/yonetim/09-yonetici.js` (okul açarken `diskMb`), `public/js/yonetim/09b-site-ayarlari.js` (varsayılan okul disk
  sınırı `okulDiskMb`; ucu [site-ayarlari.md](site-ayarlari.md)'de), `public/js/parcalar/08d-okul-disk.js` ve
  `08-ana-sayfa.js` (müdürün ana sayfasındaki doluluk çubuğu).
- Android uygulaması kullanmaz.

## Nasıl çalışır (adım adım)?

### Bir yükleme

```
const d = await okulDisk.durum(okulId)          ← tek await (kayıtlardan toplam)
if (okulDisk.sigmaz(d, boyut)) {                ← kullanılan + süren + boyut > sınır ?
   okulDisk.doldu(d)                            ← arka planda bir kez "doldu" bildirimi
   return 507 { error: OKUL_DOLU, okulDolu: true }
}
okulDisk.ayir(okulId, boyut)                    ← aradan await geçmeden
try { …diske yaz, kaydet…; await okulDisk.yuklendi(d, boyut) }   ← %80 bildirimi
finally { okulDisk.birak(okulId, boyut) }
```

### Uyarının ömrü

```
kullanım  ──► %80 ──► uyarı 80 (bir kez) ──► %100 ──► uyarı 100 (bir kez)
              ▲                                            │
              └── kullanım < %70 (mutabakat ya da sınır değişince) ── uyarı silinir
```

`okul_dosya_uyarilari`'nda okul başına tek satır: `uyariYaz` yalnız seviye yükseliyorsa yazar ve `true` döner; böylece aynı
anda gelen iki yükleme iki bildirim göndermez.

### Saatlik iş (`sunucu/index.js`)

`dosyaSupur()` + `ekSupur()` (silinme anı gelenler ve artıklar) → `mutabakat()` (sayım, günlük, uyarı sıfırlama).

## Dikkat!

- **`durum` ile `ayir` arasında `await` olmamalı.** Yoksa aynı anda başlayan iki yükleme aynı boş alanı görür ve birlikte
  sınırı aşar. Yeni bir yükleme yolu eklersen yukarıdaki kalıbı aynen kullan.
- **Süren yüklemeler yalnız bu süreçte (bellekte) sayılır.** Sunucu bugün tek Node süreci olarak çalışıyor (kodda `cluster`
  yok); birden çok süreç kurulursa bu sayaç süreçler arasında paylaşılmaz.
- **Sayım kayıttaki boyuttandır**, diskteki dosyadan değil. Kayıt ile disk ayrışırsa (elle silinen dosya, yarım kalmış iş)
  mutabakat bunu raporlar ama sayımı düzeltmez.
- **Okulsuz yüklemede sınır yok:** `durum` `null` dönerse `sigmaz` `false` der (ör. okulu olmayan hesabın eki).
- **Sınır küçültülünce dosya silinmez.** Kullanım yeni sınırın üstündeyse yalnız yeni yükleme durur; mesaj bunu açıkça söyler.
- **Bildirimler yüklemeyi bozmaz:** `doldu` beklenmez ve hatası yutulur; `yuklendi`'nin hatası da yutulur.
- **Ayrılan alan diskten büyük olabilir:** yönetici okullara diskteki boş yerden fazlasını ayırabilir (aşırı ayırma); izin
  verilir, yalnız `sistem().uyari` ile uyarılır. Asıl disk koruması [odev-dosya.md](odev-dosya.md) ve
  [ekler.md](ekler.md)'deki "2 GB boş yer payı"dır.
- Dosyanın baş yorumu kayıttaki boyutun "küçültülünce güncellendiğini" söylüyor; sunucu tarafı küçültme henüz yapılmadı
  (sıradaki iş 1). Bugün küçültme yalnız tarayıcıda, yüklemeden önce yapılıyor.

## Testleri

- `testler/test-okul-disk.js` — varsayılan sınırın kaynağı (panel / `EE_OKUL_DOSYA_GB` / 5 GB) ve işlem kaydı
  (`site.okul-disk-siniri`), okul açarken `diskMb` ve bozuk değer (400, `alan: 'diskMb'`), okul ekranında sınır değiştirme
  (MB ya da `null`), doğrulama, işlem kaydı (`okul.disk-siniri`; aynı değerde yazılmaması), yönetici olmayana 404, teslim/ek/fotoğraf sayımı ve
  silinince düşmesi, müdürün `/school/ozet`'i (öğretmen görmez), %80 bildiriminin bir kez gitmesi, dolunca üç yükleme türünde 507 `okulDolu`,
  "doldu" bildiriminin bir kez gitmesi, sınır küçülünce dosyaların kalması, büyüyünce uyarının yeniden kurulması, sistem
  geneli ve aşırı ayırma uyarısı, mutabakat (sahipsiz dosya raporu).
- `testler/test-odev-dosya.js` bölüm 8 — teslim dosyasıyla %80 ve dolu (okula 1 MB verip sonra varsayılana döndürür).
- `testler/girdi-denetimi.js` — `okul-disk-siniri`'ne bozuk `okulId`/`mb`; `testler/test-admin-gizli.js` — ucun yönetici
  olmayana gizli olması.
- `testler/tumtest.sh` bu paket için `EE_OKUL_DOSYA_GB=0.001` (1 MB) verir.
- Elle: yönetici olarak yönetim panelinde Okullar ekranını aç, bir okulun disk sınırını 1 MB yap; o okulda bir öğrenciyle
  ödeve dosya yüklemeyi dene (507 ve açık ileti), sonra sınırı "varsayılan"a döndür.

## Son durum

- Dosya `40fc7e7 commit 525` (2026-09-27, okul disk sınırı) ile eklendi: eskiden yalnız teslim dosyalarına bakan okul
  kotası (`odev-dosya.js`'teki `EE_OKUL_DOSYA_GB`) okul başına sınıra dönüştü; ekler ve okul fotoğrafları da sayıma girdi;
  yönetici ucu, sistem geneli ve saatlik mutabakat eklendi. Bu dosyada ondan sonra değişiklik yok.
- Sıradaki iş "Sunucuda küçültme (kendi JPEG/PNG kodlayıcısı, …) + aynı dosya tek kopya" bu dosyanın sayımını etkileyecek:
  küçültülen dosyada kayıttaki boyut güncellenmeli, tek kopya tutulan dosya okula bir kez mi sayılacak kararı verilmeli.
  "Paneller … okul gezgini (klasör, boyut)" işi de disk görünümüne dokunacak.
