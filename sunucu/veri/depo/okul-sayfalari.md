# sunucu/veri/depo/okul-sayfalari.js

Okulun giriş sayfasındaki kendi tanıtımının (`okul_sayfalari`: tanıtım yazısı, renk/boyut ayarları, kısıtlı CSS) ve
fotoğraflarının (`okul_fotolari`: kapak, logo, galeri) SQL'i.

## Bu dosya ne yapar?

Okulun adresinden (`/school/<kısa-ad>`) girildiğinde giriş kartının üstünde okulun kendi tanıtımı durur: kapak ve logo
fotoğrafı, tanıtım yazısı, en çok 8 fotoğraflık galeri, renk ve boyut ayarları, bir de kısıtlı CSS. Müdür ya da
"okul.sayfa" yetkisi verilen kişi ("Kodlayıcı" rolü) düzenler (şema 018).

Bu dosya yalnız kayıtları tutar. CSS'in her seferinde yeniden temizlenmesi ([../../yardimci/css-temizle.md](../../yardimci/css-temizle.md)),
fotoğrafın doğrulanması ve konum/cihaz bilgisinin silinmesi ([../../yardimci/resim.md](../../yardimci/resim.md)),
dosyanın diske yazılması, herkese açık fotoğraf ucu ve yetkiler [../../bolumler/okul-sayfasi.md](../../bolumler/okul-sayfasi.md)'dedir.
Fotoğraf dosyasının kendisi `data/okul-fotolari/<id>` içindedir.

## İçinde neler var?

İki iç dönüştürücü ([../esleme.md](../esleme.md) kullanılmaz):
- `sayfaNesnesi(r)` → `{ okulId, tanitim, ayarlar (nesne; boşsa {}), css (kişinin yazdığı ham CSS), guncelleyenId,
  guncelleme }` ya da `null`;
- `fotoNesnesi(r)` → `{ id, okulId, yer ('kapak' | 'logo' | 'galeri'), tur (MIME), boyut, aciklama, olusturma }`.

### Sayfa (`okul_sayfalari`, okul başına bir satır)

- `bul(okulId)` — okulun sayfası ya da `null` (hiç düzenlenmemiş).
- `yaz(okulId, s, kisiId)` — `s = { tanitim, ayarlar, css }`: `INSERT … ON CONFLICT (okul_id) DO UPDATE SET tanitim,
  ayarlar, css, guncelleyen_id, guncelleme = now()` (upsert). `ayarlar` `JSON.stringify` ile `jsonb`'ye gider. Şema:
  tanıtım ≤ 1500, CSS ≤ 8000 karakter (aykırıysa `23514`). CSS HAM saklanır (düzenlerken geri gelsin); dışarı çıkarken
  bölüm her seferinde temizler.

### Fotoğraflar (`okul_fotolari`)

- `fotolari(okulId)` — okulun fotoğrafları: önce kapak, sonra logo, sonra galeri; her grupta yükleniş sırasıyla
  (`ORDER BY CASE yer … END, olusturma`; `okul_fotolari_okul (okul_id, olusturma)` indeksiyle).
- `foto(id)` — tek fotoğraf ya da `null`. Okul süzmez (herkese açık fotoğraf ucu da bunu kullanır).
- `fotoEkle(f)` — `INSERT INTO okul_fotolari (id, okul_id, yer, tur, boyut, aciklama)`. Şema: `id` 32 onaltılık
  karakter (diskteki ad), `yer` üç değerden biri, `tur` `image/png`/`image/jpeg`/`image/webp`, `boyut` > 0, açıklama
  ≤ 120.
- `fotoSil(id)` — kaydı siler (dosyayı çağıran siler).
- `fotoAciklamasi(id, aciklama)` — açıklamayı yazar.
- `kayitlilar(idler)` — diskteki dosya adlarından kaydı olanlar (`Set`); süpürme kaydı olmayan (1 saatten eski)
  dosyaları siler. Boş listede sorgu atmaz.

### Tablolar ve şema

| Tablo / indeks | Şema dosyası |
|---|---|
| `okul_sayfalari` (`okul_id` birincil anahtar, okul silinince CASCADE; `tanitim` ≤ 1500, `ayarlar jsonb`, `css` ≤ 8000, `guncelleyen_id` `ON DELETE SET NULL`), `okul_fotolari` (`yer`, `tur`, `boyut integer`, `aciklama` ≤ 120; `okul_fotolari_okul` indeksi) | `018-okul-sayfasi.sql` |

## Kimle konuşur?

- Çağırdıkları: [../baglanti.md](../baglanti.md) (`sorgu`, `tek`, `calistir`).
- Çağıranlar ([../index.md](../index.md)'deki `depo.okulSayfalari`): yalnız
  [../../bolumler/okul-sayfasi.md](../../bolumler/okul-sayfasi.md) — herkese giden görünüm `okulSayfasiGorunumu` (`bul`
  + `fotolari`; [../../bolumler/kayit.md](../../bolumler/kayit.md) okul adresinden girişte çağırır), düzenleme ekranı
  (`bul`, `fotolari`), kaydetme (`yaz`), fotoğraf yükleme (`fotolari` ile galeri sınırı ve eski kapak/logo, `fotoEkle`,
  eskiler için `fotoSil`), `GET /api/okul-foto/<id>` (`foto`), fotoğraf silme ve açıklama (`foto` + okul denetimi +
  `fotoSil` / `fotoAciklamasi`), 6 saatte bir `fotoSupur` (`kayitlilar`).
- Başka okuyan: [okul-disk.md](okul-disk.md) (fotoğraf boyutları okulun disk kullanımına sayılır, mutabakat kayıtları).
- Tablolar: `okul_sayfalari`, `okul_fotolari`.

## Nasıl çalışır (adım adım)?

### Fotoğraf yükleme (kapak ya da logo)

```
POST /api/okul-sayfa/foto?yer=kapak → bölüm: yetki, hız sınırı, ≤ 3 MB
  eskiler = fotolari(okul)                → galeride 8 dolu mu? eski kapağın boyutu (yalnız fark sayılır)
  resmiTemizle (PNG/JPEG/WebP doğrula, konum/cihaz bilgisini sil)
  okul alanı sığıyor mu (okul-disk) → diske yaz → fotoEkle(...)   (kayıt yazılamazsa dosya silinir)
  kapak/logo ise: eskilerin her biri için fotoSil + dosyasını sil
```

### Okul adresinden giriş

```
kayit.js → okulSayfasiGorunumu(okul) → bul + fotolari → sayfa yoksa ve foto yoksa null (yalnız giriş kartı)
         → CSS cssTemizle'den geçer; fotoğraflar /api/okul-foto/<id> (herkese açık, uzun önbellek)
```

## Dikkat!

- **Okul kapsamı bölümde:** `foto`, `fotoSil`, `fotoAciklamasi` kimlikle çalışır; bölüm `f.okulId !== me.schoolId` ise
  "Fotoğraf bulunamadı" der. `bul`/`yaz`/`fotolari` her zaman oturumdaki okulla (`me.schoolId`) çağrılır.
- **Fotoğraflar herkese açıktır:** `foto(id)` ucu girişsiz çalışır; kimlik 32 haneli rastgele sayı olduğu için tahmin
  edilemez ama bilinen kimlik herkesçe açılır (okulun giriş sayfası zaten herkese açık).
- **CSS ham saklanır:** veritabanındaki `css` temizlenmemiştir; dışarı giden her yol `cssTemizle`'den geçmelidir. Yeni
  bir okuyan eklersen bunu unutma.
- **Sınırlar kilitsiz:** galerinin 8 fotoğraf sınırı ve "kapak/logo tek" kuralı bölümde, yüklemeden ÖNCE okunan listeye
  göre uygulanır. Aynı anda iki galeri yüklemesi 9. fotoğrafı geçirebilir; aynı anda iki kapak yüklemesi iki kapak
  bırakabilir (ikisi de yalnız kendinden önceki eskileri siler). Sonraki kapak yüklemesi fazlayı temizler.
- **Eski kapağın silinmesi yeni kayıttan SONRA:** kayıt başarısız olursa eski kapak kalır (sayfa kapaksız kalmaz).
- **`kayitlilar`'da dizi türü belirtilmemiş** (`ANY($1)`); öteki depolar `ANY($1::text[])` yazar. `pg` diziyi metin
  dizisi olarak gönderdiği için çalışır.
- **Güvenlik:** bütün değerler parametreyle. Tanıtım düz metin saklanır, ön yüz kaçışla basar (test ediliyor).

## Testleri

- `testler/test-okul-sayfasi.js` — düzenleme ekranı (müdür, "Kodlayıcı" rolü, yetkisiz öğretmen, girişsiz), kaydetme ve
  ayarların temizlenmesi, CSS temizliği (izinli kurallar, `url`/`@import`/`position` atılır, her kural `.okul-sayfa`
  ile başlar, 8000 sınırı, önizleme), okul adresinin sayfayı ve yalnız temizlenmiş CSS'i vermesi, tanıtımın düz metin
  saklanması, fotoğraf doğrulama (HTML ve SVG reddi, 3 MB, bilinmeyen yer, girişsiz/yetkisiz), PNG/JPEG konum
  bilgisinin silinmesi, kapağın tek olması, galeride 8 sınırı, açıklama, başka okulun müdürünün dokunamaması, ikinci
  okulun ayrı sayfası, silme, bozuk kimlik 404, işlem kaydı.
- `testler/test-okul-disk.js` — fotoğrafların okul kullanımına sayılması, dolu okulda 507.
- Elle: okul adresini aç, müdürle kapak yükle ve sayfayı yenile → kapak görünmeli; yeni bir kapak yükle → eskisinin
  adresi 404 vermeli.

## Son durum

- Tek commit: `44c2bb6 commit 388` (2026-09-26) — dosya 018 şema dosyasıyla bu hâliyle eklendi.
- Bilinen açıklar (kod değiştirilmedi): galeri sınırı ve "kapak/logo tek" kuralının eşzamanlı yüklemede kilitsiz olması.
- Sıradaki planlı işler (DEVAM.md 4. bölüm): **"Düzenleyiciler … 6 okul sayfası blokları"** ve DEVAM'daki "CSS editör"
  (okul sayfası görsel düzenleyici) bu dosyayı en çok etkileyecek iş: tanıtım yazısı + ayarlar yerine blok yapısı
  (`ayarlar jsonb` genişler ya da yeni tablo). **"Paneller ve okul gezgini"** okula müdürün yüklediği **okul simgesini**
  getirecek (128×128, oran korunur, kare değilse kalan yer beyazla doldurulur; gezginde ve portallarda simge olarak
  görünür; DEVAM'a göre "okul simgesi logodan önce"): bugünkü `yer = 'logo'` fotoğrafı giriş sayfası içindir, simge ayrı
  bir alan olarak planlandı — ikisinin ilişkisine o işte karar verilecek. Aynı iş `/duzenle` okul sayfalarını
  getirecek.
