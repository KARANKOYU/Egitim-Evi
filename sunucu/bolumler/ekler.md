# sunucu/bolumler/ekler.js

Mesaja ve öğretmenin verdiği ödeve eklenen dosyalar (`/api/ek`): taslak olarak yükleme, mesaja/ödeve bağlama, biletle
indirme, kaldırma ve 7 gün sonra silme.

## Bu dosya ne yapar?

Öğretmen ödev verirken bir çalışma kâğıdı (PDF) ekleyebilir; veli öğretmene yazdığı mesaja bir fotoğraf ekleyebilir.
Bu dosya bu "ek"leri yönetir. Öğrencinin ödeve yüklediği TESLİM dosyaları ayrı bir iştir: [odev-dosya.md](odev-dosya.md).

Akış iki adımlıdır:

1. **Taslak yükleme** — kişi dosyayı seçer seçmez `POST /api/ek/yukle` ile yüklenir. Bu an için ek hiçbir mesaja ya da
   ödeve bağlı değildir (taslak); yalnız yükleyen görür.
2. **Bağlama** — mesaj gönderilirken (`POST /api/mesajlar { ekIdler }`, `sunucu/bolumler/mesaj.js`) ya da ödev verilirken/
   düzeltilirken (`POST /api/assignments { ekIdler }`, `…/update { ekIdler, ekSilIdler }`, [odev.md](odev.md)) o bölüm
   buradaki `ekleriDogrula` ve `ekleriBagla`'yı çağırır.

Ek dosyası yüklendikten 7 gün sonra diskten silinir; mesaj ya da ödev yerinde kalır, ekin yanında "süresi doldu" yazar.
Gönderilmeyen taslaklar 6 saat sonra silinir. Güvenlik önlemleri teslim dosyalarıyla aynıdır ve aynı yardımcılar
([odev-dosya.md](odev-dosya.md)'deki `akisiYaz`, `reddet`, `ekBasliklari`, `dosyaAdi`, `UZANTILAR`, biletler) kullanılır.

## İçinde neler var?

### Sabitler

- `KLASOR` — `DATA/ekler` (public dışında; dosya adı 32 haneli rastgele onaltılık, yarım yükleme `<id>.yukleniyor`).
- `EK_SINIR` — 50 MB: tek dosya en çok bu kadar; bir mesajın ya da ödevin eklerinin toplamı da en çok bu kadar.
- `TASLAK_SINIR` — 150 MB (`3 × EK_SINIR`): kişinin gönderilmemiş bütün taslaklarının toplamı.
- `EN_FAZLA_EK` — 20: bir mesaja/ödeve en çok 20 dosya.
- `BOS_YER_PAYI` — 2 GB; `AYNI_ANDA_KISI` 3, `AYNI_ANDA_TOPLAM` 60.

### Uçlar

- **`POST /api/ek/yukle?tur=mesaj|odev`** — gövde dosyanın KENDİSİ, başlıklar `Content-Length` ve `X-Dosya-Adi`
  (`encodeURIComponent`). `api.js` bunu `readBody`'den önce ayırıp `yukle(k)`'ya verir; `tur=odev` iken okulda ödev
  bölümü kapalıysa `api.js` 403 `ozellikKapali` döner. Denetimler sırayla:
  1. giriş yoksa 401; aydınlatma onayı eskiyse 403; şifresini değiştirmesi gerekiyorsa 403;
  2. `tur` `mesaj` ya da `odev` değilse 400 "Ekin türü belli değil (mesaj ya da ödev).";
  3. `yukleyebilir(me, tur)`: onaylı hesap; `odev` için öğretmen/müdür ve `odev.ver` yetkisi; `mesaj` için rolü `student`,
     `parent`, `teacher`, `principal` ya da `servisci` olan (rolsüz yetişkin yükleyemez). Değilse 403;
  4. hız sınırı: kişi başına saatte 100 (429);
  5. `Content-Length` yok 411; 50 MB'tan büyük 413; ad geçersiz 400; uzantı listede yok 415;
  6. taslak toplamı (süren yüklemeler dahil) + bu dosya 150 MB'ı geçerse 413 ("… gönderilmeyen ekler 6 saat sonra
     kendiliğinden silinir.");
  7. yükleyenin okulunun disk sınırı ([okul-disk.md](okul-disk.md)) dolacaksa 507 `{ okulDolu: true }`; diskte 2 GB pay
     kalmayacaksa 507; aynı anda çok yükleme 429;
  8. akarak yazılır (`akisiYaz`), kalıcı adına taşınır, `ekler` tablosuna taslak olarak kaydedilir (`bitis` = şimdi + 7 gün),
     okulun %80 bildirimi denenir.
  Cevap `{ ek: { id, ad, boyut }, message: '<ad> eklendi.' }`.
- **`GET /api/ek/bilet?id=<ek>`** — oturum gerekir (401). Hız sınırı saatte 300. Ek yoksa ya da kişi göremiyorsa 404
  "Dosya bulunamadı" (var olduğu belli olmasın); süresi dolmuşsa 410 "Dosyanın süresi doldu (7 gün).". Cevap
  `{ yol: '/api/ek/indir?bilet=…' }` (60 sn, tek kullanımlık bilet).
- **`GET /api/ek/indir?bilet=`** — oturumsuz, yalnız biletle. Bilet yok/dolmuş/türü `ek` değil 410. Bilet sahibinin hesabı
  yeniden okunur: onaylı değilse ya da artık göremiyorsa 403; ekin süresi dolmuşsa 410. Dosya diskte yoksa 410. Dosya her
  zaman "ek" olarak iner (`ekBasliklari`: `attachment`, `octet-stream`, `nosniff`, `sandbox`).
- **`POST /api/ek/sil`** — gövde `{ id }`. Yalnız yükleyen; değilse (ya da ek yoksa) 404. Kayıt silinir (bağlanmış olsa da:
  mesajdan/ödevden kalkar), sonra diskteki dosya. Cevap `{ message: '<ad> kaldırıldı.' }`.

`bilet` ve `sil` `api.js`'in olağan kapılarından geçer: rolsüz yetişkin (`ek` `ROLSUZ_SERBEST`'te yok) 403 `rolsuz` alır.

### Dışa açılan işlevler

- `uclar(k)` — yukarıdaki `bilet`, `indir`, `sil` (yol `ek` değilse `false`).
- `yukle(k)` — yükleme ucu (`api.js` doğrudan çağırır; bağlamda `kvkkGuncel`, `sifreTamam`).
- `ekleriDogrula(me, tur, ham, mevcut?)` — mesajı/ödevi kaydetmeden önce: `ham` içinden 32 haneli onaltılık kimlikler
  (tekrarsız) alınır; hiç yoksa `{ idler: [] }`; 20'den fazlaysa hata; hepsi kişinin, bu türdeki, bağlanmamış, silinmemiş ve
  süresi dolmamış taslağı olmalı ("Eklerden biri bulunamadı ya da süresi doldu. Yeniden ekle."); toplamları + `mevcut`
  (ödev düzeltilirken kalan eklerin toplamı) 50 MB'ı geçmemeli. Dönen `{ idler }` ya da `{ hata }`.
- `ekleriBagla(tur, hedefId, idler)` — taslakları mesaja (`mesaj_id`) ya da ödeve (`odev_id`) bağlar; yalnız henüz bağlanmamış
  olanlar değişir.
- `hedefinEkleri(tur, hedefId)` — bir mesajın ya da ödevin ekleri (silinenler dahil), `ekGorunumu` ile.
- `ekGorunumu(e)` — `{ id, ad, boyut, bitis, suresiDoldu }`; `suresiDoldu` = silindi ya da `bitis` geçti.
- `ekSupur()` — saatlik temizlik: süresi dolan eklerin kaydı "silindi" yapılır, 6 saatten eski bağlanmamış taslakların kaydı
  tümden silinir (`depo.ekler.suresiDolanlar`); bunların dosyaları diskten kaldırılır; ardından `KLASOR`'de kaydı olmayan
  ya da silinmiş sayılan ve 2 saatten eski her dosya (yarım yüklemeler dahil) silinir.
- `EK_SINIR` — dışa açık ama sunucuda başka dosya kullanmıyor; ön yüz aynı değeri `public/js/parcalar/04d-ekler.js`'te ayrıca
  tanımlar.

### Önemli iç işlevler

- `yukleyebilir(me, tur)` — yukarıda.
- `gorebilir(me, e)` — yükleyen her zaman; mesaj ekinde gönderen ya da alıcılardan biri (veli dahil, alıcı listesinde
  olduğu için); ödev ekinde ödevi veren, okulun müdürü, ödevin öğrencisi ya da (öğrenci olmayan) o öğrencilerden birine
  bağlı veli. Taslağı yalnız yükleyen görür.
- `dosyaGonder(res, e)`, `bosYer()`, `mbYaz(n)`, süren yükleme sayacı `suren`.

## Kimle konuşur?

- Çağırdıkları: `crypto`, `fs`, `path`; `../guvenlik` → `hizSinir`; `../http` → `bad`, `ok`; `../ortak` → `clean`;
  `../yollar` → `DATA`; `../yetki` → `yetkiVarMi`; [odev-dosya.md](odev-dosya.md) → `akisiYaz`, `reddet`, `ekBasliklari`,
  `dosyaAdi`, `uzanti`, `UZANTILAR`, `biletVer`, `biletKullan`; [okul-disk.md](okul-disk.md) → `durum`, `sigmaz`, `doldu`,
  `OKUL_DOLU`, `ayir`, `birak`, `yuklendi`.
- Depo ve tablolar: `depo.ekler` (`sunucu/veri/depo/ekler.js`) → `ekler` (şema 020; `yukleyen_id`, `okul_id`, `tur`,
  `mesaj_id`, `odev_id`, `boyut`, `sha256`, `bitis`, `silindi`): `bul`, `ekle`, `taslakToplami`, `taslaklari`, `bagla`,
  `hedefin`, `sil`, `suresiDolanlar`, `yasayanlar`. Görme kuralı için `depo.mesajlar.bul` → `mesajlar`, `mesaj_alicilari`,
  `depo.odevler.bul` → `odevler`, `odev_ogrencileri`; `depo.kullanicilar.bul`, `bagliMi`.
- Onu çağıranlar:
  - `sunucu/api.js` — `ekler.yukle(...)` (gövde okunmadan), `BOLUM['ek']`;
  - `sunucu/bolumler/mesaj.js` — `ekleriDogrula`, `ekleriBagla`, `hedefinEkleri`;
  - [odev.md](odev.md) — aynıları (geç yükleme: `ekModulu()`);
  - `sunucu/bolumler/ilerleyis.js` — `ekGorunumu` (öğrencinin ödev listesinde ekler);
  - `sunucu/index.js` — `ekSupur()` saatte bir (ve açılıştan 1 dakika sonra), ardından disk mutabakatı.
- Ön yüz: `public/js/parcalar/04d-ekler.js` — ek kutusu: `XMLHttpRequest` ile ilerlemeli yükleme, 50 MB doluluk çubuğu,
  kaldırma (`/ek/sil`), indirme (`/ek/bilet` → `location.href = yol`).
- Android uygulaması kullanmaz.

## Nasıl çalışır (adım adım)?

```
dosya seçildi ──POST /api/ek/yukle?tur=odev──► taslak (mesaj_id = odev_id = NULL, bitis = şimdi + 7 gün)
                                                   │  6 saat içinde bağlanmazsa ekSupur siler
"Ödevi ver" ──POST /api/assignments { ekIdler }──► odev.js:
        ekleriDogrula (kişinin taslağı mı, ≤ 20, toplam ≤ 50 MB) ─► ödev yazılır ─► ekleriBagla (odev_id = ödev)
öğrenci ödevi açar ─► ekler listesi (ekGorunumu) ─► GET /api/ek/bilet?id ─► GET /api/ek/indir?bilet  (attachment)
7 gün sonra ─► ekSupur: silindi = true, dosya diskten gider ─► ekranda "süresi doldu"
```

## Dikkat!

- **İki ayrı 50 MB/150 MB kuralı neden var:** yüklerken taslağın hangi mesaja gideceği belli değil (kişi başka pencerede
  yarım bir mesaj bırakmış olabilir). Bu yüzden yüklemede kişi başına 150 MB taslak sınırı (diski korur), kaydederken
  mesaj/ödev başına 50 MB (`ekleriDogrula`) denetlenir; ön yüz de doluluk çubuğuyla 50 MB'ı gösterir.
- **Başkasının taslağı bağlanamaz:** `taslaklari` yalnız kişinin kendi, bağlanmamış ve süresi dolmamış taslaklarını döndürür;
  sayı tutmazsa kayıt reddedilir. `bagla` da yalnız bağlanmamışları günceller.
- **Ek 7 gün yaşar**, mesaj ya da ödev değil. Ödev uzun sürse bile ekin dosyası 7. gün silinir; öğretmen gerekirse yeniden
  ekler.
- **Silme yetkisi yalnız yükleyende:** alıcı ya da ödevin öğrencisi eki silemez. Yükleyen bağlanmış eki silerse kayıt da
  gider; mesajdan/ödevden sessizce kalkar.
- **Bilet haritası paylaşımlı:** biletler `odev-dosya.js`'teki aynı bellek haritasında tutulur (5000 sınırı ikisi için
  birlikte); tür (`ek`) ayrı olduğu için bir teslim bileti ek indirmede işe yaramaz.
- **Okulsuz hesabın eki okul sınırına sayılmaz** (`okulDisk.durum('')` → `null`), ama taslak ve boş yer sınırları yine geçerli.
- `GET /api/ek/bilet` ucu hesabın onayını ayrıca denetlemez (`need` çağrılmıyor); bilet kullanılırken (`indir`) hesap onaylı
  değilse 403 verilir. Onaysız hesap bu yüzden bilet alsa da indiremez.
- Ek yükleme `api.js`'in rolsüz ve arşiv yılı kapılarından geçmez (yükleme gövde okunmadan ayrılıyor); rolsüzü
  `yukleyebilir`'deki rol listesi dışarıda tutar.
- **Ödevler kapalı okulda:** yalnız `tur=odev` yüklemesi 403 alır (`api.js`). `ek` yolu [ozellikler.md](ozellikler.md)'deki
  `YOL`'da olmadığından `bilet`, `indir` ve `sil` kapalı okulda da çalışır; ödev listesi kapalı olduğu için ekran bu eklere
  zaten ulaşmaz.

## Testleri

- `testler/test-yorum-ek.js` bölüm 4–5 — ödeve ve mesaja ek: taslak yükleme, bağlama, alıcının ve ödevin öğrencisinin
  indirebilmesi, başkasının indirememesi, ödeve eki yalnız öğretmenin koyması, izinsiz uzantı ve 50 MB üstü, başka pencerede
  bırakılan taslağın yeni yüklemeyi engellememesi, bir mesaja 50 MB'tan fazlasının kaydedilememesi, başkasının taslağının
  bağlanamaması, indirmenin her zaman `attachment` + `nosniff` olması.
- `testler/test-okul-disk.js` — ekin (taslak dahil) okulun kullanımına girmesi, %80 bildirimi, dolunca 507.
- `testler/test-odev-dosya.js` — eklerin de 50 MB sınırı; `testler/test-ozellikler.js` — ödev kapalı okulda `tur=odev`
  yükleme.
- Elle: öğretmenle "Ödev ver" ekranında bir PDF ekle ve ödevi ver; öğrenciyle ödevi açıp eki indir.

## Son durum

- Son commit `40fc7e7 commit 525` (2026-09-27, okul disk sınırı): ek artık yükleyenin okulunun disk sınırına sayılıyor
  (`okulDisk.durum/sigmaz/ayir/birak/yuklendi`), dolunca 507 `okulDolu`.
- Ondan önce `566b917 commit 524` (2026-09-27, canlı hazırlık): sınır 150 MB'tan 50 MB'a indi; yüklemedeki taslak sınırı
  kişi başına 150 MB'a ayrıldı (`TASLAK_SINIR`), mesajlar `mbYaz` ile.
- Dosya `7daee9c commit 414`, `b48a43d commit 415`, `c08ff52 commit 416` (2026-09-26) ile kuruldu.
- Sıradaki iş "Sunucuda küçültme … + aynı dosya tek kopya" eklerin saklanmasına da dokunacak (`sha256` zaten saklanıyor).
