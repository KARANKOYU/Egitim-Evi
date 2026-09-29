# sunucu/veri/depo/servis-yoklama.js

Servis yoklamasının SQL'i (şema 028): günlük bindi/binmedi (sabah) ve geldi/gelmedi/indi (akşam) işaretleri, o günün
seferinin başlama/bitiş anı, veliye giden bildirimin bir kez gitmesi, servisçinin notları, velinin "binmeyecek" işareti
ve 30 günlük silme.

## Bu dosya ne yapar?

Servisçi telefonundan her öğrenci için "Bindi / Binmedi" (sabah), "Geldi / Gelmedi" ve sonra "İndi" (akşam) işaretler;
veli bunları anında görür ve bildirim alır. Veli de önceden "Yarın sabah binmeyecek" diyebilir; servisçi de bir öğrenciye
ya da bütün servise tarihli not bırakabilir. Kurallar (hangi işaret ne zaman konur, sefer ne zaman başlar, kime ne
gösterilir) [../../bolumler/okul-hayati.md](../../bolumler/okul-hayati.md)'dedir; servisin kendisi, sefer ve konum
[okul-hayati.md](okul-hayati.md)'dedir.

Bu dosya yalnız saklar ve okur. İki önemli nokta:

- **Tarih Türkiye günüdür** (`'YYYY-AA-GG'`) ve çağıran hesaplar; bu dosya `now()`'dan gün çıkarmaz.
- **Bildirim tekliği veritabanında:** aynı öğrenci için aynı günün aynı olayı (`bindi`, `vardi` …) bir kez bildirilsin diye
  `servis_olaylari`'na `ON CONFLICT DO NOTHING` ile yazılır; satır açıldıysa bildirim gider.

## İçinde neler var?

Hiçbir işlev [../esleme.md](../esleme.md) kullanmaz; ham satır döner. Tarih sütunları `to_char(tarih, 'YYYY-MM-DD')` ile
metin olarak seçilir.

### Yoklama (`servis_yoklamalari`)

- `YOKLAMA_ALANLARI` (iç) — `tarih, donem, ogrenci_id, servis_id, durum, bindi_zaman, indi_zaman, alan_id`.
- `yoklamalar(ogrenciIdler, tarih, donem)` — öğrencilerin o günkü o dönem işaretleri: `Map(ogrenciId → satır)`; boş listede
  sorgu atmaz.
- `yoklamaBul(tarih, donem, ogrenciId)` — tek işaret ya da `null`.
- `yoklamaYaz(y)` — `y = { tarih, donem, ogrenciId, servisId, durum, bindiZaman, indiZaman, alanId }`; upsert (anahtar
  `(tarih, donem, ogrenci_id)`): varsa üzerine yazılır, `guncelleme = now()`. Durum dönemle uyumlu olmalı (şemadaki CHECK:
  sabahta `bindi`/`binmedi`, akşamda `geldi`/`gelmedi`/`indi`); değilse `23514`.

### Günün seferi (`servis_gunleri`)

- `GUN_ALANLARI` (iç) — `servis_id, basladi, bitti`.
- `gun(servisId, tarih, donem)` — o dönemin satırı ya da `null`.
- `gunler(servisIdler, tarih, donem)` — `Map(servisId → satır)`. Bugün çağıran yok.
- `gunBasladi(servisId, tarih, donem, yenile)` — sefer başladı: satır yoksa `basladi = now()` ile açılır; varsa ilk an
  korunur (`coalesce`), ama `yenile` doğruysa şimdiki an yazılır (kayıtlı an bu dönemin aralığının dışında kaldıysa —
  saatler gün içinde değişti — bölüm yeniden başlatır).
- `gunBitti(servisId, tarih, donem)` — sefer bitti ("Okula vardık" ya da akşam son öğrenci indi): `bitti` yalnız boşken
  yazılır; ilk kez bittiyse `true` (bildirim bir kez gitsin).
- `gunuGeriTarihle(servisId, tarih, donem, dakika)` — `basladi`'yı dakika kadar geri çeker (bakım ve testler).

### Bildirim tekliği (`servis_olaylari`)

- `olayIlkMi(tarih, donem, ogrenciId, olay)` — olay daha önce işaretlenmediyse yazar ve `true`. Olaylar (şema CHECK):
  `bindi`, `binmedi`, `vardi`, `geldi`, `gelmedi`, `indi`, `duzeltme`.
- `olayVarMi(tarih, donem, ogrenciId, olay)` — yalnız bakar.

### Servisçinin notları (`servis_notlari`)

- `NOT_ALANLARI` (iç) — not + öğrencinin adı (`ogrenci_adi`; bütün servise yazılmışsa `NULL`).
- `notEkle(n)` — `n = { id, servisId, ogrenciId (boş: bütün servis), tarih, metin, yazanId }`.
- `notBul(id)`, `notSil(id)` — kimlikle (servisçi denetimi bölümde).
- `servisinNotlari(servisId, basTarih)` — o günden itibaren servisin bütün notları, tarih ve yazılış sırasıyla.
- `ogrencilerinNotlari(ogrenciIdler, basTarih)` — öğrencilerin kendi servislerinde, kendilerine YA DA bütün servise
  yazılmış notlar; her satırda `hedef_id` (notun ilgilendirdiği öğrenci). `servis_ogrencileri` ile birleşir: öğrenci
  servisten çıkınca eski servisin notlarını görmez. Boş listede `[]`.

### Velinin "binmeyecek" işareti (`servis_binmeyecek`)

- `BINMEYECEK_ALANLARI` (iç) — `ogrenci_id, tarih, sabah, aksam, aciklama, yazan_id, guncelleme`.
- `binmeyecekler(ogrenciIdler, basTarih, bitTarih)` — aralıktaki işaretler; boş listede `[]`.
- `binmeyecekBul(ogrenciId, tarih)`.
- `binmeyecekYaz(b)` — `b = { ogrenciId, tarih, sabah, aksam, aciklama, yazanId }`; sabah da akşam da kalkmışsa satır
  SİLİNİR (şemadaki `CHECK (sabah OR aksam)` boş satıra izin vermez), değilse upsert.

### Saklama

- `temizle(sinirTarih)` — `sinirTarih`'ten eski yoklama, gün, olay, not ve "binmeyecek" satırlarını siler; toplam silinen
  satır sayısını döner. Bölüm 30 gün önceki Türkiye gününü verir (`SAKLAMA_GUN = 30`).

### Tablolar ve şema

Beşi de `028-servis-yoklama.sql`:

| Tablo | Anahtar / kurallar |
|---|---|
| `servis_yoklamalari` | `(tarih, donem, ogrenci_id)`; durum-dönem CHECK'i; öğrenci silinince `CASCADE`, servis silinince `CASCADE`; indeks `servis_yoklamalari_servis (servis_id, tarih, donem)` |
| `servis_gunleri` | `(servis_id, tarih, donem)` |
| `servis_olaylari` | `(tarih, donem, ogrenci_id, olay)` |
| `servis_notlari` | `id`; metin 1–200; öğrencisiz = bütün servis; indeksler `servis_notlari_servis (servis_id, tarih)`, `servis_notlari_ogrenci` |
| `servis_binmeyecek` | `(ogrenci_id, tarih)`; `CHECK (sabah OR aksam)`; açıklama ≤ 200 |

Aynı şema dosyası okulun servis saatlerini (`okullar.servis_*`), servis sırasını, cihaz anahtarlarını ve uygulama
oturumunu da ekler; onlar [okullar.md](okullar.md), [okul-hayati.md](okul-hayati.md) ve [oturumlar.md](oturumlar.md)'de.

## Kimle konuşur?

- Çağırdıkları: yalnız [../baglanti.md](../baglanti.md) (`sorgu`, `tek`, `calistir`).
- Çağıranlar: [../index.md](../index.md)'deki `depo.servisYoklama` üzerinden yalnız
  [../../bolumler/okul-hayati.md](../../bolumler/okul-hayati.md) (servisçi yoklama ekranı, veli servis ekranı, "binmeyecek",
  notlar, `servisTemizle` içinde `temizle`; `servisTemizle`'yi [../../index.md](../../index.md) 10 dakikada bir çalıştırır).
  Testler: `testler/test-servis-yoklama.js` doğrudan `require` eder
  (`gunuGeriTarihle`).

## Nasıl çalışır (adım adım)?

### Sabah "Bindi"

```
servisçi "Bindi" → bölüm: öğrenci bu serviste mi (servisinOgrencileri), saat aralığı / dönem (gun() ile "sefer bitti mi")
   → yoklamaBul (eski işaret; 'indi' ise artık değişmez)
   → işaret değiştiyse yoklamaYaz({ durum: 'bindi', bindiZaman: şimdi, alanId: servisçi })
   → aralıktaysa ve sefer bu aralıkta başlamadıysa: seferAc + gunBasladi(…, yenile = eski satırda basladi vardı)
                                                   (sabahın ilk "Bindi"si seferi başlatır)
   → yoklamaBildir: olayIlkMi(tarih, 'sabah', ogrenci, 'bindi') → true ise veliye bildirim
     ("Binmedi"de: önce 'bindi' bildirildiyse bir kez 'duzeltme'; veli o dönem "binmeyecek" dediyse hiç gitmez)
```

### Akşam "İndi"

```
gun().basladi yoksa → 409 "Önce Başlat'a bas"
eski işaret 'geldi' (ya da zaten 'indi') değilse → 409
yoklamaYaz({ durum: 'indi', bindiZaman: eski.bindi_zaman, indiZaman: şimdi })
"İndi" ya da "Gelmedi"den sonra: yoklamalar() ile servisin bütün işaretleri okunur;
   "Geldi"de kimse kalmadıysa ve en az biri 'indi' ise → gunBitti → true ise
   okulHayati.servisSeferiniBitir (sefer kendiliğinden biter, bir kez)
```

## Dikkat!

- **Kapsam bölümde:** hiçbir işlev okul, servis ya da servisçi denetlemez. `yoklamaYaz` öğrencinin o serviste olduğunu
  bilmez (`servis_id` yalnız yabancı anahtar); `notSil` kimlikle siler. Bölüm servisçinin kendi servisini ve servisin
  öğrenci listesini (`servisinOgrencileri`) denetler; notta `notBul` → servis → `sofor_id === me.id` bakar.
- **Denetle-sonra-yaz:** bölüm eski işareti okuyup (ör. "İndi yalnız Geldi'den sonra", "eve bırakıldı, artık değişmez")
  sonra `yoklamaYaz` ile yazar; arada kilit yoktur. Aynı öğrenciye aynı anda iki farklı işaret gelirse son yazan kalır. Tek
  servisçi tek telefondan işaretlediği için pratikte sorun değil. Aynı durum "binmeyecek" ile "yoklama alındı" arasında da
  geçerli.
- **Bildirim tekliği yarışsızdır:** `olayIlkMi` ve `gunBitti` veritabanının `ON CONFLICT` / `WHERE bitti IS NULL`
  koşullarına dayanır; aynı anda iki istek gelse de bildirim bir kez gider.
- **Tarih UTC değil Türkiye günü:** çağıran `trGun`/`trGunEkle` ile hesaplar; bu dosyada `current_date` kullanılmaz (UTC
  gece yarısı kayması olmasın).
- **Silme indeksleri:** `temizle`'deki `tarih < $1` silmelerinden `servis_yoklamalari` ve `servis_olaylari` birincil
  anahtarın ilk sütunu olan `tarih`'i kullanır; öbür üç tabloda tarih ilk sütun değildir (30 günlük veride tarama
  küçüktür).
- **Kullanılmayan dışa açık işlev:** `gunler`.
- **Kişisel veri:** yoklama anları ve notlar öğrencinin günlük hareketini gösterir; 30 gün sonra silinir (028 şema
  açıklaması).

## Testleri

- `testler/test-servis-yoklama.js` — bindi/binmedi/geldi/indi kuralları, sefer başlangıcı ve bitişi (`gunuGeriTarihle`),
  veliye tek bildirim, "binmeyecek" işareti, notlar, servis saatleri dışında kapanma.
- `testler/test-servis-pencere.js` (sunucusuz) — saat aralığı hesabı ([../../yardimci/servis-pencere.md](../../yardimci/servis-pencere.md)).
- Elle: servisçi hesabıyla sabah aralığında bir öğrenciye "Bindi" işaretle → velinin bildirim kutusunda bir kez "bindi"
  görünmeli; işareti kaldırıp yeniden koymak ikinci bildirim göndermemeli.

## Son durum

- Dosyanın tek commit'i `24050a2 commit 518` (2026-09-27): servis yoklaması, cihaz anahtarı ve 30 günlük uygulama oturumu
  işiyle (028 şema dosyası) yazıldı; o günden beri değişmedi.
- Bilinen açıklar (kod değiştirilmedi): işaretlerde denetle-sonra-yaz, kullanılmayan `gunler`.
- Sıradaki planlı işler (DEVAM.md 4. bölüm): "Android yerel uygulama (bütün roller)" servisçi yoklamasını yerel ekrana
  taşır (aynı uçlar, bu dosya değişmez); "Optimizasyon + saklama süreleri" 30 günlük silmeyi genel saklama düzenine
  bağlayabilir.
