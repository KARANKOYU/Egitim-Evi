# sunucu/veri/depo/mesajlar.js

Mesaj ve duyuruların (`mesajlar`), alıcılarının (`mesaj_alicilari`, veli kopyalarıyla) ve okunma kayıtlarının
(`mesaj_okumalari`) SQL'i: gönderme, kutu listeleri, okunmamış sayısı, okundu bilgisi, düzeltme ve silme.

## Bu dosya ne yapar?

Okulda herkes birbirine (kurallar izin verdiği ölçüde) mesaj yazar; yetkisi olan duyuru yayımlar. Bir mesajın bir ya da
binlerce alıcısı olabilir. Öğrenciye giden mesajın bir kopyası velisine de gider; o kopya satırında `ogrenci_id` "kimin
için geldiğini" söyler (veli iki çocuğu için iki ayrı kopya alabilir). Kim ne zaman okudu, ayrı tabloda tutulur.

Kimin kime yazabileceği, alıcı listesinin nasıl çıkarıldığı, engeller ve mesaj ayarları bu dosyada DEĞİL,
[../../bolumler/mesaj.md](../../bolumler/mesaj.md)'dedir. Bu dosya yalnız hazır alıcı listesini yazar ve kutuları okur.

## İçinde neler var?

Satır → nesne: [../esleme.md](../esleme.md)'deki `mesaj(r)` → `{ id, schoolId, gonderenId, tur, konu, govde,
hedefOzet, alicilar: [{ id, ogrenciId }], okuyanlar: [kullaniciId…], tarih, duzenlenme }`; bu dosyanın iç `nesne(r)`
işlevi buna `_gonderenAdi`, `_gonderenRol` ve `_alicilar` (her alıcı `{ id, ogrenciId, ad, rol, ogrenciAdi }`) ekler.

### Ortak sorgu `SEC`

`mesajlar m LEFT JOIN kullanicilar g` (gönderenin adı ve rolü) + iki alt sorgu:
- `alicilar`: `mesaj_alicilari a JOIN kullanicilar ka` (alıcının adı/rolü) `LEFT JOIN kullanicilar ko` (veli kopyasında
  çocuğun adı), `json_agg(json_build_object(...) ORDER BY a.id)`; yoksa `'[]'`.
- `okuyanlar`: `json_agg(o.kullanici_id)` `mesaj_okumalari`'ndan.

Bu sorgu bütün alıcıları taşıdığı için yalnız TEK mesajda (`bul`) kullanılır; kutu listesi `kutuOzeti` ile hafif gelir.

### İşlevler

- `bul(id)` — tek mesaj (tam nesne, bütün alıcılar ve okuyanlarla) ya da `null`; `id` boşsa sorgu atmaz. Okul ya da
  kişi süzmez.
- `kutusu(kullaniciId, kutu, tur, sinir)` — `SEC` ile tam nesneler: `kutu === 'giden'` ise `m.gonderen_id = $1`, değilse
  `m.id IN (SELECT mesaj_id FROM mesaj_alicilari WHERE alici_id = $1)`; `tur` `''` (hepsi) / `'mesaj'` / `'duyuru'`
  (`($2 = '' OR m.tur = $2)`), yeniden eskiye, `LIMIT $3` (varsayılan 200). **Bugün hiçbir yerden çağrılmıyor**
  (yerini `kutuOzeti` aldı).
- `kutuOzeti(kullaniciId, kutu, tur, sinir)` — kutu listesi için hafif satırlar (esleme'den geçmez, ham satır döner):
  `id, tur, konu, left(govde, 400) AS govde, gonderen_id, tarih, duzenlenme, hedef_ozet, gonderen_adi, gonderen_rol` ve
  - `alici_sayisi` — alıcı SATIRI sayısı (veli kopyaları dahil),
  - `kisi_sayisi` — farklı alıcı kişi sayısı (`count(DISTINCT a.alici_id)`),
  - `okuyan_sayisi` — hâlâ alıcı olan okuyanların sayısı (mesajı kutusundan kaldıranlar sayılmaz),
  - `okundu` — bu kişi okudu mu,
  - `cocuk_icin` — bu kişiye (veliye) hangi çocukları için geldiği (ad listesi).
  Gelen kutusu koşulu `EXISTS (… a.alici_id = $1)`, giden `m.gonderen_id = $1`; `tur` süzmesi ve `LIMIT` `kutusu` ile aynı.
- `okunmamisSayisi(kullaniciId)` — kişiye gelen ve okumadığı FARKLI mesaj sayısı (`count(DISTINCT a.mesaj_id)` +
  `NOT EXISTS mesaj_okumalari`). Sayı döner (`bigint` → [../baglanti.md](../baglanti.md) `Number`'a çevirir).
- `ekle(m)` — işlemde: `INSERT INTO mesajlar (id, okul_id, gonderen_id, tur, konu, govde, hedef_ozet, tarih)`
  (`gonderenId` boşsa `NULL`), sonra bütün alıcılar TEK sorguda: `INSERT INTO mesaj_alicilari (mesaj_id, alici_id,
  ogrenci_id) SELECT $1, a, NULLIF(o, '') FROM unnest($2::text[], $3::text[]) … ON CONFLICT DO NOTHING` (aynı alıcı + aynı
  çocuk iki kez gelirse biri yazılır). `m.alicilar = [{ id, ogrenciId }]`. Mesajı geri okumaz, dönüşü yok (1000+ alıcılı
  duyuruyu adlarıyla yeniden toplamamak için). Şema sınırları: `konu` 1–120, `govde` ≤ 4000 karakter (`23514`),
  var olmayan alıcı `23503`.
- `okumaDurumu(mesajId)` — okundu bilgisi ekranı: her alıcı KİŞİ bir kez (`GROUP BY k.id …`): `id, ad, rol, sinif`
  (öğrenciyse sınıf adı, `siniflar` JOIN), `okuma` (okuma zamanı ya da `null`), `cocuklar` (veliyse hangi çocukları için;
  `json_agg(DISTINCT …) FILTER`). Ham satır döner.
- `okundu(mesajId, kullaniciId)` — `INSERT INTO mesaj_okumalari … ON CONFLICT DO NOTHING` (ilk okuma zamanı kalır).
- `duzelt(id, konu, govde)` — `UPDATE mesajlar SET konu, govde, duzenlenme = now() WHERE id = $1`; etkilenen satır
  sayısını döner.
- `sil(id)` — `DELETE FROM mesajlar WHERE id = $1`; alıcı, okuma ve ek satırları (`ekler.mesaj_id`) CASCADE ile gider.
- `alicidanKaldir(mesajId, kullaniciId)` — işlemde: kişinin bu mesajdaki BÜTÜN alıcı satırlarını siler (veli birden çok
  çocuk kopyası aldıysa hepsi), sonra mesajı yalnız gönderenin hesabı silinmişse (`gonderen_id IS NULL`) ve hiç alıcı
  kalmadıysa siler. Gönderenin "Gönderilenler"inde mesaj durur.

### Tablolar ve şema

| Tablo / sütun / indeks | Şema dosyası |
|---|---|
| `mesajlar` (`tur` mesaj/duyuru, `konu` 1–120, `govde` ≤ 4000, `hedef_ozet`, `gonderen_id` `ON DELETE SET NULL`, `mesajlar_gonderen (gonderen_id, tarih DESC)` indeksi), `mesaj_alicilari` (`GENERATED ALWAYS AS IDENTITY` kimlik, `UNIQUE NULLS NOT DISTINCT (mesaj_id, alici_id, ogrenci_id)`, alıcı ve çocuk `ON DELETE CASCADE`, `mesaj_alicilari_alici` indeksi), `mesaj_okumalari` (`PRIMARY KEY (mesaj_id, kullanici_id)`) | `001-ilk.sql` |
| `mesajlar.duzenlenme` (düzeltme zamanı) | `013-ogretmen-rolu-etut.sql` |
| `ekler.mesaj_id` → `mesajlar` `ON DELETE CASCADE` (mesaj silinince ek satırları) | `020-ekler.sql` |

## Kimle konuşur?

- Çağırdıkları: [../baglanti.md](../baglanti.md) (`sorgu`, `tek`, `calistir`, `islem`), [../esleme.md](../esleme.md)
  (`mesaj`, `yokIse`).
- Çağıranlar ([../index.md](../index.md)'deki `depo.mesajlar`):
  - [../../bolumler/mesaj.md](../../bolumler/mesaj.md) — `GET /api/mesajlar` (`kutuOzeti(me.id, kutu, tur, 200)` +
    `okunmamisSayisi`), `GET /api/mesajlar/duyurular` (`kutuOzeti(…, 'gelen', 'duyuru', 5)`), `POST /api/mesajlar`
    (`ekle`, ek bağlamayla aynı `islem` içinde), `duzenle` (`bul` + `duzelt`), `sil` (`bul` + `sil` ya da
    `alicidanKaldir`), `okuma` (`bul` + `okumaDurumu`), tek mesaj (`bul` + `okundu`).
  - [../../bolumler/ekler.md](../../bolumler/ekler.md) — eki görebilir mi: `bul(e.mesajId)` (gönderen ya da alıcı mı).
- Tablolar: `mesajlar`, `mesaj_alicilari`, `mesaj_okumalari`; ad için `kullanicilar`, sınıf adı için `siniflar` okunur.

## Nasıl çalışır (adım adım)?

### Gönderme

```
POST /api/mesajlar → bölüm: hız sınırı, yetki (duyuru → mesaj.toplu), konu/metin kırpma,
                     mesajAlicilariCoz (engeller, ayarlar, veli kopyaları) → alicilar [{ id, ogrenciId }]
  islem {
    mesajlar.ekle(m):  INSERT mesajlar ; INSERT mesaj_alicilari SELECT … unnest(idler, cocuklar) ON CONFLICT DO NOTHING
    ekleriBagla('mesaj', m.id, ekIdler)          (taslak ekler bu mesaja bağlanır)
  }
  topluBildir(alıcılar)  → bildirim (+ telefona push)
```

### Gelen kutusu

```
GET /api/mesajlar?kutu=gelen&tur=
  kutuOzeti(me, 'gelen', tur, 200)  → her satırda sayılar + okundu + cocuk_icin (tüm alıcılar taşınmaz)
  okunmamisSayisi(me)
  bölüm kutuSatiri(): okuyan/kişi sayılarını YALNIZ "giden" kutusunda gönderir
```

### Açma ve silme

```
GET /api/mesajlar/<id> → bul → alıcı ya da gönderen değilse 403 → alıcıysa okundu() → detay
POST …/sil → bul → gönderen: sil (her şey CASCADE) | alıcı: alicidanKaldir (yalnız kendi satırları) | değilse 403
```

## Dikkat!

- **Erişim denetimi bölümde:** `bul`, `duzelt`, `sil`, `okumaDurumu` kimlikle çalışır, SQL'de "gönderen mi, alıcı mı,
  aynı okul mu" koşulu yoktur. [../../bolumler/mesaj.md](../../bolumler/mesaj.md) her uçta `bul` ile mesajı alıp
  `gonderenId`/`alicilar`'a bakar (okundu bilgisini gönderen ve duyuruda okulun müdürü görür). Yeni bir çağıran bu
  denetimi kendisi yapmalı.
- **Okundu sayıları gizlilik kuralı:** `kutuOzeti` sayıları her satır için hesaplar, ama alıcıya göndermemek bölümün
  işidir (`kutuSatiri(r, giden)`): alıcı başkalarının okuyup okumadığını görmemeli.
- **`alici_sayisi` ile `kisi_sayisi` farklıdır:** veli iki çocuğu için iki kopya aldıysa `alici_sayisi` 2, `kisi_sayisi`
  1 sayar. `bul`'dan gelen `_alicilar.length` de satır sayısıdır.
- **Gönderen silinince:** `gonderen_id` `NULL` olur, mesaj alıcılarda "Silinmiş kullanıcı" adıyla kalır; son alıcı da
  kutusundan kaldırınca `alicidanKaldir` mesajı siler. Gönderen hesabı durdukça mesaj alıcısız kalsa da silinmez.
- **Mesaj silinince ekler:** `ekler` satırları CASCADE ile gider; diskteki dosyanın akıbeti ekler tarafındadır
  ([ekler.md](ekler.md)).
- **İç içe işlem:** `ekle` kendi `islem`'ini açar; bölüm onu ek bağlamayla birlikte dıştaki bir `islem` içinde çağırır.
  [../baglanti.md](../baglanti.md)'deki `islem` açık bir işlem varsa yenisini açmaz, ona katılır (`islemBaglami`). Bu
  yüzden mesaj, alıcılar ve eklerin bağlanması tek işlemdir: ek bağlama hata verirse mesaj da geri alınır.
- **Düzeltme yarışı:** `duzelt` kilitsiz tek `UPDATE`; iki düzeltme aynı anda gelirse son yazan kalır. Alıcıya yeniden
  bildirim gitmez (bölümün kararı).
- **Kullanılmayan işlev:** `kutusu` dışa açık ama hiçbir yerden çağrılmıyor; bütün alıcıları taşıdığı için büyük
  duyurularda ağırdır. Kullanma; gerekirse `kutuOzeti`.
- **Performans:** `kutuOzeti` her satır için beş alt sorgu çalıştırır (sınır 200 satır). Alıcı araması
  `mesaj_alicilari_alici`, mesaja göre alt sorgular `UNIQUE (mesaj_id, …)` indeksiyle gider; `mesaj_okumalari`
  birincil anahtarı `mesaj_id` ile başlar. Gelen kutusunda `ORDER BY m.tarih DESC` için ayrı indeks yoktur (alıcının
  satırları toplanıp sıralanır). Saklama süresi yok: mesajlar bugün hiç silinmez (Son durum).
- **`mesajlar.okul_id` CASCADE değildir** (001); okul satırı silinmediği için sorun çıkmaz.
- **Güvenlik:** bütün değerler parametreyle; alıcılar `unnest($2::text[], $3::text[])` dizi parametresiyle tek sorguda
  gider. Konu/metin uzunluğu bölümde kırpılır, şemada da sınırlıdır.

## Testleri

- `testler/test-mesaj.js` — kime yazılabildiği, öğretmenden öğrenciye mesajın veliye de gitmesi ("hangi çocuk için"),
  okunmamış sayacının artıp düşmesi, gönderenin okuyanları görmesi, ayarlar ve engeller, duyurunun mesajı kapatan
  öğrenciye de gitmesi, sınıf duyurusunun velilere gitmesi, konu/metin kırpma, alıcının kutusundan kaldırması (gönderende
  durur), gönderenin tamamen silmesi.
- `testler/test-etut.js` — mesaj düzeltme (yalnız gönderen, boş konu reddi); `testler/test-anket.js` — okundu bilgisi
  (`/api/mesajlar/okuma`, öğrenci göremez).
- `testler/test-yorum-ek.js` — mesaja ek ve eki kimin görebildiği (`bul`); `testler/girdi-denetimi.js`,
  `testler/yetki-denetimi.js` — mesaj uçlarına bozuk girdi ve yetkisiz istekler.
- Elle: öğretmen hesabıyla bir öğrenciye mesaj yaz → öğrencinin ve velisinin kutusunda görünmeli, velide "kimin için"
  bilgisi (`cocuk_icin`) çocuğun adı olmalı; veli açınca öğretmenin okundu listesinde veli okuma zamanıyla görünmeli.

## Son durum

- Son değişiklik `e9b0754 commit 344` (2026-09-26): ortak `SEC` sorgusu (alıcılar ve okuyanlar tek sorguda json olarak,
  gönderen ve çocuk adlarıyla) eklendi. İlk hâli `713c269 commit 103` (2026-08-29). Toplam 2 commit.
- Bilinen açıklar (kod değiştirilmedi): kullanılmayan `kutusu`, mesajların saklama süresinin olmaması, düzeltmenin
  kilitsiz olması.
- Sıradaki planlı işler (DEVAM.md 4. bölüm): **"Mesaj ayarları (çark), Bu mesajı bildir, Ajanda, … ileri tarihli
  gönderim"** bu dosyayı en çok etkileyecek iş (bildirim kaydı ve ileri tarihli gönderim için yeni sütun/tablo);
  "Optimizasyon + saklama süreleri" mesajları 1 yılda silecek (buraya bir temizlik sorgusu gelir); "Düzenleyiciler"
  (ortak yazı editörü, hazır mesaj şablonları `{öğrenci}`, `{sınıf}`) mesaj metninin biçimini değiştirebilir.
