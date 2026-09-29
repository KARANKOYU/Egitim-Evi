# sunucu/veri/depo/etutler.js

Etütlerin (`etutler`), etüt öğrencilerinin (`etut_ogrencileri`) ve etüt yoklamalarının (`etut_yoklamalari`) SQL'i:
etüt listeleri, ekleme/değiştirme/silme, öğrenci listesini yazma, günlük yoklama ve öğrencinin yoklama geçmişi.

## Bu dosya ne yapar?

Etüt, okulun haftanın belli bir gününde belli saatleri arasında yaptığı ders dışı çalışmadır ("Salı 15:00–16:00
Matematik etüdü, kütüphanede"). Bir öğretmene verilir; o öğretmen (ya da "etüt yoklaması" yetkisi olan kişi) her etüt
günü yoklama alır: `var` (geldi), `yok` (gelmedi), `izinli`. Gelmeyen ya da izinli sayılan öğrenciye ve velilerine
bildirim gider. Bu dosya bunların veritabanı tarafıdır; kim açar, kim yoklama alır, hangi gün alınabilir gibi kurallar
[../../bolumler/etut.md](../../bolumler/etut.md)'dedir.

## İçinde neler var?

Bu dosya [../esleme.md](../esleme.md) kullanmaz; kendi `etut(r)` dönüştürücüsü var:
`{ id, schoolId, ad, gun (1 pazartesi … 7 pazar), baslangic 'SS:DD', bitis 'SS:DD', yer, ogretmenId, ogretmenAdi,
ogrenciSayisi }` (boş öğretmen `''`, sayı yoksa `0`).

### Ortak sorgu `SEC` ve sıra

`etutler e LEFT JOIN kullanicilar k` (öğretmen adı) + öğrenci sayısı alt sorgusu (`count(*)::int FROM
etut_ogrencileri`); saatler SQL'de `to_char(…, 'HH24:MI')` ile metne çevrilir. Listeler `ORDER BY e.gun, e.baslangic,
e.ad` sırasıyla gelir.

### Etütler

- `bul(id)` — tek etüt ya da `null` (`id` boşsa sorgu yok). Okul süzmez.
- `okulun(okulId)` — okulun bütün etütleri (`etutler_okul (okul_id, gun, baslangic)` indeksiyle).
- `ogretmeninki(ogretmenId)` — öğretmene verilmiş etütler (`etutler_ogretmen` kısmi indeksi).
- `ogrencininki(ogrenciId)` — öğrencinin kayıtlı olduğu etütler (`etut_ogrencileri_ogrenci` indeksiyle alt sorgu).
- `ekle(e)` — `INSERT INTO etutler (id, okul_id, ad, gun, baslangic, bitis, yer, ogretmen_id, olusturma)`; boş yer `''`,
  boş öğretmen `NULL`. Sonunda `bul(e.id)`. Şema: `ad` 1–80, `gun` 1–7, `yer` ≤ 60, `bitis > baslangic` (aykırıysa
  `23514`), var olmayan öğretmen `23503`.
- `guncelle(e)` — `UPDATE etutler SET ad, gun, baslangic, bitis, yer, ogretmen_id WHERE id = $1`; sonunda `bul`. Okul
  değişmez.
- `sil(id)` — `DELETE FROM etutler WHERE id = $1`; öğrenci ve yoklama satırları CASCADE ile gider. Etkilenen satır
  sayısını döner.

### Öğrenciler

- `ogrencileri(etutId)` — etüdün öğrencileri `[{ id, ad, sinif }]` (sınıf adı `siniflar` LEFT JOIN), Türkçe ad sırası
  (`tr()`). Ham satır döner.
- `ogrencileriYaz(etutId, ogrenciIdler)` — listeyi baştan yazar, tek işlemde: `DELETE FROM etut_ogrencileri WHERE
  etut_id = $1`, sonra `INSERT … SELECT $1, unnest($2::text[]) ON CONFLICT DO NOTHING` (boş listede yalnız silme).
- `ogrencisiMi(etutId, ogrenciId)` — öğrenci bu etütte mi (`true`/`false`). **Bugün hiçbir yerden çağrılmıyor.**

### Yoklama

- `yoklamasi(etutId, tarih)` — bir günün yoklaması: `Map(ogrenciId → 'var' | 'yok' | 'izinli')`.
- `yoklamaYaz(etutId, tarih, kayitlar, alanId)` — `kayitlar = [{ ogrenciId, durum }]`. İşlemde önce o günün yoklamasını
  okur; durumu DEĞİŞMEYENLERİ atlar, değişenler için tek tek `INSERT … ON CONFLICT (etut_id, tarih, ogrenci_id) DO UPDATE
  SET durum, alan_id, guncelleme = now()` (upsert). Değişenlerin listesini döner (bölüm yalnız onlara bildirim gönderir).
  Aynı yoklama yeniden kaydedilirse boş dizi döner ve hiçbir şey yazılmaz.
- `ogrenciYoklamalari(ogrenciId, sinir, okulId)` — öğrencinin son yoklamaları `[{ etut_id, etut_adi, tarih
  'YYYY-AA-GG', durum }]`, yeniden eskiye (`ORDER BY y.tarih DESC, e.ad LIMIT $2`, varsayılan 60).
  `okulId` verilirse yalnız o okulun etütleri (`$3::text IS NULL OR e.okul_id = $3`); boş verilirse süzme yok.

### Tablolar ve şema

| Tablo / indeks | Şema dosyası |
|---|---|
| `etutler` (`okul_id` CASCADE, `ogretmen_id` `ON DELETE SET NULL`, `etutler_okul`, `etutler_ogretmen` indeksleri), `etut_ogrencileri` (`PRIMARY KEY (etut_id, ogrenci_id)`, `etut_ogrencileri_ogrenci` indeksi, ikisi de CASCADE), `etut_yoklamalari` (`PRIMARY KEY (etut_id, tarih, ogrenci_id)`, `durum` var/yok/izinli, `alan_id` `ON DELETE SET NULL`, `etut_yoklamalari_ogrenci (ogrenci_id, tarih DESC)` indeksi) | `013-ogretmen-rolu-etut.sql` |

## Kimle konuşur?

- Çağırdıkları: [../baglanti.md](../baglanti.md) (`sorgu`, `tek`, `calistir`, `islem`, `tr`).
- Çağıranlar ([../index.md](../index.md)'deki `depo.etutler`):
  - [../../bolumler/etut.md](../../bolumler/etut.md) — `GET /api/etut` (`okulun` ya da `ogretmeninki`), `/api/etut/detay`
    (`bul` + `ogrencileri`), `kaydet` (`ekle` / `guncelle`), `sil`, `ogrenciler` (`ogrencileriYaz` + `ogrencileri`),
    `yoklama` GET (`ogrencileri` + `yoklamasi`) ve POST (`yoklamaYaz`, bildirim için `ogrencileri`), öğrencinin/velinin
    `/api/etut/ogrenci` ucu (`ogrencininki` + `ogrenciYoklamalari(sid, 60, okulId)`).
- Başka dosyaların bu tablolara dokunduğu yerler: [ogrenci-gecmisi.md](ogrenci-gecmisi.md) nakilde öğrenciyi eski
  okulun etütlerinden çıkarır (`DELETE FROM etut_ogrencileri … okul_id = $2`); [../json-aktarim.md](../json-aktarim.md)
  eski JSON verisini aktarır ve dışa verir.
- Tablolar: `etutler`, `etut_ogrencileri`, `etut_yoklamalari`; ad için `kullanicilar`, sınıf adı için `siniflar`.

## Nasıl çalışır (adım adım)?

### Yoklama alma

```
POST /api/etut/yoklama { id, tarih, kayitlar }
  bölüm: etüt bu okulun mu (bul + schoolId)? yoklama engeli (gün tutuyor mu, ileri tarih mi, yetki)?
         her kayıt etüdün öğrencisi mi (ogrencileri)? durum geçerli mi?
  yoklamaYaz: islem {
      onceki = yoklamasi(etut, tarih)
      her kayıt: aynıysa atla | değilse upsert (durum, alan_id = me, guncelleme = now())
  } → degisen
  yoklamaBildir(degisen içinde 'var' olmayanlar) → öğrenciye ve velilerine bildirim
```

### Öğrenci listesini kaydetme

```
POST /api/etut/ogrenciler → bölüm: okulun öğrencileri dışında biri var mı? en çok EN_FAZLA_OGRENCI
  ogrencileriYaz: islem { DELETE hepsi ; INSERT unnest(liste) ON CONFLICT DO NOTHING }
```

## Dikkat!

- **Okul kapsamı bölümde:** `bul`, `guncelle`, `sil`, `ogrencileriYaz`, `yoklamaYaz` kimlikle çalışır. Bölümdeki
  `etutAl` her seferinde `e.schoolId === me.schoolId` bakar; öğrenci listesini yazmadan önce herkesin okulun öğrencisi
  olduğunu, yoklamada da herkesin etüdün öğrencisi olduğunu denetler. Bu dosya bunları denetlemez.
- **`yoklamaYaz` kilitsiz okur:** önceki durumu işlem içinde ama `FOR UPDATE` olmadan okur. İki kişi aynı etüdün aynı
  gününü aynı anda kaydederse ikisi de "değişti" sayabilir ve aynı öğrenciye iki bildirim gidebilir; veride son yazan
  kalır (upsert).
- **`ogrenciYoklamalari`'nda boş okul:** bölüm okul kimliğini öğrencinin kaydından alır; öğrencinin okulu boşsa
  (`''` → `null`) süzme kalkar ve bütün okullardaki yoklamaları döner. Bunlar öğrencinin kendi kayıtlarıdır; nakilde
  eski okulun etüt üyelikleri [ogrenci-gecmisi.md](ogrenci-gecmisi.md) tarafından silinir, yoklamalar kalır.
- **`ogrencininki` okul süzmez:** nakilde üyelikler silindiği için bugün yalnız şimdiki okulun etütleri gelir; üyelik
  başka yoldan kalırsa eski okulun etüdü de görünür.
- **Saat biçimi:** etüt saatleri SQL'de `to_char` ile `'SS:DD'` olur; [../baglanti.md](../baglanti.md)'deki `time`
  dönüştürücüsü de aynı biçimi verirdi, ikisi uyumlu.
- **Öğretmen silinince** etüt kalır, `ogretmen_id` `NULL` olur (ön yüzde öğretmensiz etüt); yoklamayı alanın kimliği de
  `NULL` olur ama yoklama kalır.
- **Kullanılmayan işlev:** `ogrencisiMi` dışa açık ama çağıran yok.
- **Güvenlik:** bütün değerler parametreyle; öğrenci listesi `unnest($2::text[])` dizi parametresiyle tek sorgu.
  Saklama süresi yok: yoklamalar etüt silinene kadar durur.

## Testleri

- `testler/test-etut.js` — hazır Öğretmen rolü, yetkisiz öğretmenin etüt açamaması, geçersiz gün/ters saat reddi, etüt
  açma ve öğretmene bildirim, öğrenci ekleme (okul dışı öğrenci reddedilir), öğretmenin yalnız kendi etüdünü görmesi,
  yoklama engelleri (başka gün, ileri tarih), yoklama alma, aynı yoklamanın yeniden kaydında "değişiklik yok"
  (`yoklamaYaz`'ın boş dönüşü), gelmeyene bildirim / gelene yok, öğrencinin ve velinin etüt ekranı, yetki verilen
  öğretmenin yoklamayı düzeltmesi, onaysız silinmemesi.
- Nakilde eski okulun etüt üyeliklerinin silinmesini (`ogrenci-gecmisi.js`) sınayan bir test yok.
- Elle: müdür olarak bugünün gününe bir etüt aç, iki öğrenci ekle; öğretmen hesabıyla birini "gelmedi" işaretle →
  öğrencinin bildiriminde "Etüt: <ad> (GG.AA.YYYY) — gelmedi (izinsiz)", velininkinde başında çocuğun adıyla aynı
  satır olmalı; aynı kaydı yeniden gönder →
  "Değişiklik yok."

## Son durum

- Tek commit: `e9b0754 commit 344` (2026-09-26) — dosya bu hâliyle eklendi; o günden beri değişmedi.
- Bilinen açıklar (kod değiştirilmedi): `yoklamaYaz`'ın kilitsiz okuması (çift bildirim olasılığı), kullanılmayan
  `ogrencisiMi`, boş okulda `ogrenciYoklamalari`'nın süzmemesi.
- Sıradaki planlı işler (DEVAM.md 4. bölüm): "Yıl geçişi" (yeni yıl sihirbazı) etütlerin ve yoklamalarının yıla
  bağlanıp bağlanmayacağına karar verecek (bugün etütlerde `yil_id` yok); "Optimizasyon + saklama süreleri" eski
  yoklamalar için saklama süresi koyabilir; "Mesaj ayarları … Ajanda" etüt günlerini ajandada gösterebilir.
