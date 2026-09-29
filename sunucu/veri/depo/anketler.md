# sunucu/veri/depo/anketler.js

Tek soruluk okul anketlerinin (`anketler`), seçeneklerinin (`anket_secenekleri`), hedef kişilerinin (`anket_hedefleri`)
ve oylarının (`anket_oylari`) SQL'i: anket açma, listeler, oy verme/geri alma, sayım, katılım listesi, kapatma ve silme.

## Bu dosya ne yapar?

Toplu mesaj yetkisi olan kişi (müdür ya da yetki verilmiş öğretmen) okula, bir rol grubuna ya da sınıflara "Gezi için
hangi gün uygun?" gibi tek soruluk bir anket açar. Hedefteki herkes bitişe kadar bir oy verir ve fikrini
değiştirebilir. Gizli ankette anketi açan kimin neyi seçtiğini görmez, yalnız sayıları görür.

Bu dosyanın en önemli yanı **oy kurallarının veritabanında tek sorguda uygulanması**dır: anket açık mı, kişi hedefte mi,
seçenek bu ankete mi ait — üçü de `oyVer`'in tek `INSERT … SELECT … WHERE` sorgusunda denetlenir; araya başka bir istek
girip durumu değiştiremez. Şema (006) da aynı kuralları yabancı anahtarlarla ayrıca korur: hedef listesinde olmayan
kişinin ya da başka anketin seçeneğine verilmiş oy veritabanına hiç yazılamaz.

Kimin anket açabileceği, hedefin nasıl çözüldüğü, sonucu kimin ne zaman gördüğü
[../../bolumler/anket.md](../../bolumler/anket.md)'dedir.

## İçinde neler var?

Bu dosya [../esleme.md](../esleme.md) kullanmaz: okuma işlevleri **ham satır** döner (sütun adları Türkçe, alt çizgili);
bölümdeki `gorunum(a)` onları ön yüz nesnesine çevirir.

### Ortak alanlar `ALANLAR`

Her listede aynı sütunlar: `id, okul_id, olusturan_id, soru, aciklama, hedef_ozet, gizli, bitis, kapandi, olusturma`,
`olusturan_adi` (`kullanicilar` LEFT JOIN), `acik` (`kapandi IS NULL AND bitis > now()` — açıklık her sorguda
veritabanının saatiyle hesaplanır), `hedef_sayisi`, `oy_sayisi` (`count(*)::int` alt sorguları) ve `secenekler`
(`json_agg({ id, metin } ORDER BY sira)`, yoksa `'[]'`).

### İşlevler

- `ekle(a)` — `a = { id, okulId, olusturanId, soru, aciklama, hedefOzet, gizli, bitis, secenekler: [{ id, metin }],
  hedefler: [kullaniciId…] }`. Tek işlemde üç sorgu: `INSERT INTO anketler`; seçenekler tek sorguda
  `unnest($2::text[], $3::int[], $4::text[])` ile (sıra 1'den başlayarak dizideki yerinden); hedefler tek sorguda
  `unnest($2::text[]) … ON CONFLICT DO NOTHING`. Dönüş yok. Şema: soru 1–200, açıklama ≤ 1000, seçenek metni 1–120
  karakter (`23514`), var olmayan hedef kişi `23503` — biri tutmazsa hiçbiri yazılmaz.
- `bul(id)` — tek anket (ham satır, `ALANLAR`) ya da `null`. Okul süzmez.
- `kisiyeGelenler(kullaniciId)` — kişinin hedefte olduğu anketler (HANGİ OKULDAN olursa olsun; iki okulda çocuğu olan
  veli ikisini de görür) + `benim_oyum` (seçtiği seçeneğin kimliği ya da `null`). Sıra: açıklar önce, sonra bitişi
  yakın/yeni olan (`ORDER BY acik DESC, a.bitis DESC`), en çok 80 satır.
- `yonetilenler(kullaniciId, okulId, hepsi)` — okulun anketleri; `hepsi` doğruysa (müdür) hepsi, değilse yalnız kişinin
  açtıkları (`a.okul_id = $2 AND ($3 OR a.olusturan_id = $1)`), yeniden eskiye, en çok 100.
- `sayimlar(anketIdler)` — seçenek başına oy sayısı, birden çok anket için tek sorguda (`GROUP BY anket_id,
  secenek_id`): `Map(anketId → { secenekId: n })`. Oy almamış seçenek nesnede yoktur; boş listede sorgu atmadan boş
  nesnelerle harita döner.
- `hedefteMi(anketId, kullaniciId)` — kişi anketin hedefinde mi (`true`/`false`).
- `katilim(anketId)` — hedefteki herkes: `id, ad, rol, sinif` (öğrencinin sınıf adı), `secenek_id` ve `tarih` (oy
  vermediyse `null`), `cocuklar` (kişi veliyse, `veli_baglari` üzerinden bu anketin okulundaki çocuklarının adları).
  Ham satır; gizli ankette seçim ve zamanı SİLMEK bölümün işidir.
- `oyVer(anketId, kullaniciId, secenekId)` — tek sorgu: `INSERT INTO anket_oylari … SELECT … FROM anketler a WHERE
  a.id = $1 AND a.kapandi IS NULL AND a.bitis > now() AND EXISTS (hedefte) AND EXISTS (seçenek bu anketin)` + `ON
  CONFLICT (anket_id, kullanici_id) DO UPDATE SET secenek_id, tarih = now()` (oy değiştirme). Yazılan satır sayısını
  döner: `0` = reddedildi (neden reddedildiğini bölüm ayrıca bulup söyler).
- `oyGeriAl(anketId, kullaniciId)` — `DELETE FROM anket_oylari o USING anketler a WHERE … AND a.kapandi IS NULL AND
  a.bitis > now()`: yalnız anket açıkken siler; silinen satır sayısını döner.
- `kapat(id)` — `UPDATE anketler SET kapandi = now() WHERE id = $1 AND kapandi IS NULL AND bitis > now()`: yalnız açık
  anketi kapatır (etkilenen satır sayısı döner).
- `sil(id)` — `DELETE FROM anketler WHERE id = $1`; seçenek, hedef ve oy satırları CASCADE ile gider.

### Tablolar ve şema

| Tablo / kısıt / indeks | Şema dosyası |
|---|---|
| `anketler` (`okul_id` CASCADE, `olusturan_id` `ON DELETE SET NULL`, `bitis`, `kapandi`, `gizli`, `anketler_okul (okul_id, olusturma DESC)` indeksi), `anket_secenekleri` (`UNIQUE (anket_id, sira)`, `UNIQUE (anket_id, id)`), `anket_hedefleri` (`PRIMARY KEY (anket_id, kullanici_id)`, `anket_hedefleri_kisi` indeksi, kişi silinince CASCADE), `anket_oylari` (`PRIMARY KEY (anket_id, kullanici_id)`; `(anket_id, kullanici_id)` → `anket_hedefleri`, `(anket_id, secenek_id)` → `anket_secenekleri (anket_id, id)`, ikisi de CASCADE) | `006-anketler.sql` |

## Kimle konuşur?

- Çağırdıkları: [../baglanti.md](../baglanti.md) (`sorgu`, `tek`, `calistir`, `islem`).
- Çağıranlar ([../index.md](../index.md)'deki `depo.anketler`): yalnız
  [../../bolumler/anket.md](../../bolumler/anket.md) — `GET /api/anketler` (`kisiyeGelenler`, bitenler için `sayimlar`,
  `yonetilenler`), `POST /api/anketler` (`ekle`), `/oy` (`bul`, `oyVer` ya da `oyGeriAl`), `/kapat` ve `/sil` (`bul`,
  `kapat`, `sil`), `/sonuc` (`bul`, `hedefteMi`, `katilim`, `sayimlar`).
- Bu dosyadan geçmeden aynı tablolara dokunan: [../json-aktarim.md](../json-aktarim.md) (eski JSON verisindeki anketleri,
  seçeneklerini, hedeflerini ve oylarını aktarır; dışa verirken de bu dört tabloyu okur).
- Tablolar: `anketler`, `anket_secenekleri`, `anket_hedefleri`, `anket_oylari`; ad için `kullanicilar`, sınıf adı için
  `siniflar`, velinin çocukları için `veli_baglari`.

## Nasıl çalışır (adım adım)?

### Anket açma

```
POST /api/anketler → bölüm: yetki (mesaj.toplu), soru/seçenekler (2–10, tekrarsız), bitiş (5 dk – 90 gün),
                     hedef okul/rol/sınıf → mesajAlicilariCoz(…, 'duyuru') → hedefler (açan hariç)
  ekle(a): islem { INSERT anketler ; INSERT seçenekler (unnest) ; INSERT hedefler (unnest) }
  topluBildir(hedefler, 'Anket: …')
```

### Oy verme

```
POST /api/anketler/oy { id, secenekId }
  secenekId boş  → anket açıksa oyGeriAl
  oyVer(...)     → INSERT … SELECT WHERE açık AND hedefte AND seçenek bu anketin
                   ON CONFLICT → oyu değiştir
       1 → "Oyun kaydedildi."
       0 → bölüm nedeni bulur: kapandı mı? seçenek geçersiz mi? yoksa 403 "Bu ankete oy veremezsin"
```

### Sonuç

```
GET /api/anketler/sonuc?id=
  yönetebilir (açan ya da okulun müdürü) → katilim + sayimlar (gizli ve açıksa sayılar da yok; gizlide seçim/zaman yok)
  hedefteki kişi                         → anket bitmişse yalnız sayimlar
```

## Dikkat!

- **Okul kapsamı bölümde:** `bul`, `kapat`, `sil`, `katilim` kimlikle çalışır. Bölüm yönetim işlerinde
  `a.okul_id === me.schoolId` ve "açan ya da müdür" koşuluna bakar (`yonetebilir`). Oy verme ise okula değil, hedef
  listesine bağlıdır ve o denetim SQL'in içindedir.
- **Gizlilik bölümde:** `katilim` gizli ankette de `secenek_id` ve `tarih` döndürür; bölüm bunları gizli ankette boşaltır,
  anket açıkken sayıları da göndermez (yeni oyla artan seçeneği eşleştirip kimin neyi seçtiğini çıkarmak olmasın).
  Bu işlevi yeni bir yerde kullanırsan aynı süzmeyi yap.
- **Açıklık veritabanı saatiyle:** `acik`, `oyVer`, `oyGeriAl`, `kapat` hepsi `now()` kullanır; bitiş anını
  uygulama sunucusu değil veritabanı belirler. `bul` ile `oyVer` arasında anket biterse `oyVer` 0 döner ama bölüm
  `bul`'daki eski `acik` değerine baktığı için "Bu anket kapandı." yerine "Bu ankete oy veremezsin" (403) diyebilir —
  yalnız ileti yanlış olur, oy yazılmaz.
- **`kapat` zaten kapalı ankette 0 döner;** bölüm dönüşe bakmadan "Anket kapatıldı" der (zarar yok).
- **Yorum ile kod ayrışıyor:** `kisiyeGelenler`'in yorumu "kapanmışlardan son 50" der, kod ise açık/kapalı TOPLAM 80
  satır getirir. Çok anket alan bir kişide (80'i aşınca) en eski kapanmış anketler listeden düşer.
- **Oy yarışı:** `oyVer` tek sorgu ve `ON CONFLICT` ile atomiktir; aynı kişinin iki eşzamanlı oyu tek satır bırakır
  (son yazan kazanır). `kapat` ile aynı anda gelen oy, sorgunun başladığı andaki duruma göre yazılır ya da yazılmaz.
- **Silinen kişi:** hedef kişi hesabı silinirse hedef ve oy satırı CASCADE ile gider, sayılar düşer. Anketi açanın hesabı
  silinirse anket kalır, `olusturan_adi` boş gelir ("Silinmiş kullanıcı").
- **Sayım performansı:** `ALANLAR` her satır için üç alt sorgu çalıştırır; `anket_hedefleri` ve `anket_oylari` birincil
  anahtarları `anket_id` ile başladığı için indekslidir. `kisiyeGelenler` `anket_hedefleri_kisi` indeksiyle başlar.
- **Güvenlik:** bütün değerler parametreyle; seçenek ve hedef listeleri `unnest` dizi parametreleriyle tek sorgu.
  Saklama süresi yok: anketler müdür ya da açan silene kadar durur.

## Testleri

- `testler/test-anket.js` — yetkisiz öğretmenin ve öğrencinin anket açamaması, tekrar seçeneğin sayılmaması, geçmiş/çok
  uzun bitiş reddi, kişi seçimiyle açılmaması, anket açma (öğrenci + veli hedefte), öğrencinin listesi, başka anketin
  seçeneğine oy yazılmaması, hedefte olmayanın oy verememesi, oy verme/değiştirme/geri alma, sayılar, katılım (veli
  çocuğuyla, sınıf adı), gizli anket kuralları, başka okulun müdürünün göremediği/kapatamadığı, kapatma ve kapalıya oy
  yazılmaması, bitince sonucun oy verene açılması, silme. Dosyanın ikinci yarısı mesaj okundu bilgisini sınar
  ([mesajlar.md](mesajlar.md)).
- Elle: öğrenci hesabıyla bir ankete oy ver, müdürle anketi kapat, öğrenciyle oyunu değiştirmeyi dene → "Bu anket
  kapandı." demeli ve sayı değişmemeli.

## Son durum

- Tek commit: `8a537cf commit 297` (2026-09-26) — dosya 006 şema dosyası ve bölümle birlikte bu hâliyle eklendi; o günden
  beri değişmedi.
- Bilinen açıklar (kod değiştirilmedi): `kisiyeGelenler` yorumunun kodla ayrışması (50 ↔ 80), `bul`–`oyVer` arasında
  biten ankette yanlış ileti, `kapat`'ın dönüşünün kullanılmaması.
- Sıradaki planlı işler (DEVAM.md 4. bölüm): **"Anket düzenleyici"** bu dosyayı baştan değiştirecek iş: Google Forms
  gibi çok sorulu form (tek/çoklu seçim, açılır liste, kısa/uzun yanıt, zorunlu anahtarı), taslak kaydetme ve ankete
  ödevden/mesajdan ek olarak bağlanma — bugünkü tek soru + tek oy yapısı (`anket_oylari` kişi başına bir satır) buna
  yetmez, yeni tablolar gerekir. "Optimizasyon + saklama süreleri" eski anketler için süre koyabilir.
