# sunucu/veri/depo/odevler.js

Ödevlerin SQL'i: ödev + kime verildiği ve sonucu (`odev_ogrencileri`) + hangi sınıflara verildiği (`odev_siniflari`) tek
nesne olarak okunur; ekleme, düzeltme, sonuçlandırma, yeniden açma, açılma anı, öğrencinin yıldızı ve takvim/müdür
ekranları için hafif sorgular.

## Bu dosya ne yapar?

Uygulama ödevi tek bir nesne olarak kullanır:

```
{ id, title, subject, ..., studentIds: [...], results: { ogrenciId: 'yapti' }, acilma: { ogrenciId: an },
  classIds: [...], dosyaYukleme, dosyaSaklama, ... }
```

Veritabanında ise üç tablo var. Bu dosya nesneyi tek sorguda, alt sorgulardaki `json_agg` / `json_object_agg` ile kurar
(`SEC`), satırı [../esleme.md](../esleme.md)'deki `odev(r)` nesneye çevirir. Yazarken de tersini yapar: bir ödev 30
öğrenciye ya hepsine birlikte yazılır ya hiç yazılmaz (`islem`).

Uçlar ve kurallar (kim ödev verir, kim sonuçlandırır, son teslim saati) [../../bolumler/odev.md](../../bolumler/odev.md)'de;
teslim dosyaları [../../bolumler/odev-dosya.md](../../bolumler/odev-dosya.md) ve `sunucu/veri/depo/odev-dosyalari.js`'te; quiz
[quiz.md](quiz.md)'de (ödev nesnesine quizden hiçbir şey eklenmez).

## İçinde neler var?

### Ödev nesnesi

`SEC` (iç): `odevler o` + `ogrenci_idler` (öğrenci kimlikleri, sıralı), `sonuclar` (sonucu olanlar), `acilmalar` (ödevi
açmış olanlar), `sinif_idler`. `esleme.odev(r)` → `{ id, teacherId, schoolId, subject, title, description, startAt, endAt,
endTime, startTime ('SS:DD' ya da ''), studentIds, classIds, results, acilma, status ('active'|'finished'), yilId,
dosyaYukleme (eski ödevde `true`), dosyaSaklama, createdAt, finishedAt }`.

Sonuç türleri (001 şema açıklaması): `yapti`, `yapmadi`, `eksik`, `gec` (geç yaptı), `izinli` (başarı oranını düşürmez),
`gelmedi` (izinsiz; düşürür). Sonucu boş olan öğrenci henüz değerlendirilmemiştir.

### Okuma

- `bul(id)` — tek ödev ya da `null`. Okul/öğretmen süzmez.
- `ogretmenin(ogretmenId)`, `okulun(okulId)`, `ogrencinin(ogrenciId)` — listeler, en yeni önce (`liste(kosul, p)` iç
  yardımcısıyla). `okulun`'u bugün çağıran yok.
- `bitisiOlanlar(tarih)` — son günü verilen tarih olan AKTİF ödevler (bütün okullar; "yarın son gün" hatırlatması).
- `yildizlilari(ogrenciId)` — öğrencinin yıldızladığı ödevlerin kimlikleri (`Set`).

### Yazma

- `ekle(a)` — işlemde: `odevler` satırı (`dosya_yukleme` yalnız `a.dosyaYukleme === true` ise açık), öğrenciler tek
  `INSERT ... SELECT $1, unnest($2::text[])`, sınıflar (varsa) aynı biçimde. Dönüş `bul(a.id)`. Bir öğrenci kimliği
  geçersizse (yabancı anahtar) hiçbiri yazılmaz.
- `tarihVeyaNull(v)` — `"2026-09-25"` gibi geçerli bir gün değilse `NULL` (süresiz). `ekle` ve `duzelt` başlangıç ve son
  günü bundan geçirir. Dışa açık ama dışarıdan çağıran yok.
- `sonuclandir(id, sonuclar, zaman)` — işlemde: `sonuclar = { ogrenciId: sonuç | null }` her öğrenci için ayrı bir
  `UPDATE odev_ogrencileri`, sonra ödev `durum = 'finished'`, `sonuclanma = zaman`. Listede olmayan öğrenciye dokunulmaz;
  `null` eski sonucu kaldırır. Dönüş güncel ödev.
- `duzelt(id, d)` — ödevin kendisini düzeltir: başlık, açıklama, başlangıç günü ve saati, son gün ve saat, dosya yükleme
  izni. Sonuçlanmış ödevde de çalışır; öğrenci listesi ve sonuçlar değişmez. Son teslim (gün ya da saat) DEĞİŞİRSE ya da
  kaldırılırsa `dosya_saklama = GREATEST(dosya_saklama, now() + 7 gün)` (`SAKLAMA_UZAT`): yanlış yazılan bir tarih teslim
  dosyalarını hemen sildirmez. Dönüş güncel ödev.
- `yenidenAc(id)` — `durum = 'active'` ve dosya saklama en az 7 gün uzar (son teslimsiz ödevde silinme sonuçlanmaya
  bağlıydı). Dönüş güncel ödev.
- `sil(id)` — siler; öğrenci ve sınıf satırları, quiz, teslim dosyası kayıtları (`odev_ogrencileri` üzerinden) ve ödevin
  ekleri (020) yabancı anahtarla `CASCADE`. Diskteki dosyalara dokunmaz: kaydı silinmiş dosyaları
  [../../bolumler/odev-dosya.md](../../bolumler/odev-dosya.md)'deki süpürme (1 saatten eskiyse) ve
  [../../bolumler/ekler.md](../../bolumler/ekler.md)'deki temizlik siler.
- `acildi(id, ogrenciId)` — öğrenci ödevi ilk açtığında `acilma = now()`; sonradan değişmez (`acilma IS NULL` koşulu).
- `yildizla(id, ogrenciId, yildiz)` — öğrencinin kendine ait işareti; ödev o öğrenciye verilmemişse satır yoktur, hiçbir
  şey değişmez ve `false` döner.

### Hafif sorgular (öğrenci listesi taşımaz)

- `takvimIcin(kapsam, bas, bit)` — `kapsam`: `{ ogrenciId }` | `{ ogretmenId }` | `{ okulId }`; son günü `[bas, bit]`
  aralığında olan ödevler → `[{ id, subject, title, description, endAt, endTime, status, yilId }]`, son gün ve saat
  sırasıyla.
- `dersBaglari(okulId, sinifId)` — müdürün "Ders ödevleri" listesi: her ders için o dersin ödevlerinin yalnız durumu
  (`[{ dersId, status, endAt, endTime, yilId }]`). Ödev derse, verildiği sınıfla (`odev_siniflari`) ve ders ADIYLA
  (`o.ders = d.konu`) bağlanır; sayılar sunucuda çıkarılır.
- `dersinOdevleri(okulId, sinifId, konu)` — bir dersin ödevleri, o sınıftan kaç öğrenciye gittiğiyle:
  `[{ id, title, description, startAt, endAt, endTime, status, yilId, teacherName ('(okuldan ayrıldı)' yoksa), studentCount,
  sahipsiz }]`. `sahipsiz`: öğretmeni ayrılmış, müdür sonuçlandırır.

### Tablolar ve şema

| Tablo / sütun | Şema dosyası |
|---|---|
| `odevler` (başlık 1–200, `bitis >= baslangic`, `bitis_saati` varsayılan 12:00, `durum` active/finished; `odevler_ogretmen`, `odevler_okul`, `odevler_bitis WHERE durum = 'active'`), `odev_siniflari`, `odev_ogrencileri` (sonuç CHECK'i, `acilma`; `odev_ogrencileri_ogrenci`) | `001-ilk.sql` |
| `odev_siniflari_sinif`, `odevler_okul_bitis (okul_id, bitis)` indeksleri | `002-hiz.sql` |
| `odev_ogrencileri.yildiz` | `017-odev-yildizi.sql` |
| `odevler.baslangic_saati` | `025-odev-baslama-saati.sql` |
| `odevler.dosya_yukleme` (eski ödevlerde açık, yenilerde varsayılan kapalı) | `033-odev-dosya-izni.sql` |
| `odevler.dosya_saklama` | `034-odev-dosya-saklama.sql` |

## Kimle konuşur?

- Çağırdıkları: [../baglanti.md](../baglanti.md) (`sorgu`, `tek`, `calistir`, `islem`), [../esleme.md](../esleme.md)
  (`odev`, `bos`, `yokIse`).
- Çağıranlar ([../index.md](../index.md)'deki `depo.odevler`):
  - [../../bolumler/odev.md](../../bolumler/odev.md) — ekle, düzelt, sonuçlandır, yeniden aç, sil, açıldı, yıldız,
    öğretmen listesi.
  - [../../bolumler/odev-dosya.md](../../bolumler/odev-dosya.md), [../../bolumler/ekler.md](../../bolumler/ekler.md),
    [../../bolumler/quiz.md](../../bolumler/quiz.md) — `bul` (quiz ayrıca `acildi`: deneme açılınca ödev de "açıldı").
  - [../../bolumler/ilerleyis.md](../../bolumler/ilerleyis.md) — `ogrencinin`, `yildizlilari`;
    [../../bolumler/ogretmen.md](../../bolumler/ogretmen.md) — `ogretmenin`.
  - [../../bolumler/takvim.md](../../bolumler/takvim.md) — `takvimIcin`; [../../bolumler/okul.md](../../bolumler/okul.md) —
    `dersBaglari`, `dersinOdevleri`.
  - [../../hatirlatma.md](../../hatirlatma.md) — `bitisiOlanlar`.
- Dolaylı: `sunucu/veri/depo/odev-dosyalari.js` silinme anını `odevler.bitis`, `bitis_saati`, `sonuclanma`, `dosya_saklama`'dan
  hesaplar; [quiz.md](quiz.md)'nin aday sorguları `odevler`'i birleştirir.

## Nasıl çalışır (adım adım)?

### Ödev verme

```
odev.js: öğrenci listesini öğretmenin kapsamından süz
  → islem { odevler.ekle(a)  [odevler + odev_ogrencileri + odev_siniflari]
            quiz.yaz(...) (quiz varsa) }
  → topluBildir(öğrenciler, "Yeni ödev: …")   (işlem bittikten sonra)
```

`ekle` kendi `islem`'ini açar ama bölüm onu zaten bir `islem` içinde çağırıyor; [../baglanti.md](../baglanti.md)'deki `islem`
açık bir işlem varsa yenisini açmaz, aynı işlemi kullanır. Bu yüzden quiz yazılamazsa ödev de öğrencileri de geri alınır.

### Son teslim değişince teslim dosyaları

```
duzelt: bitis ya da bitis_saati değişti mi?  (IS DISTINCT FROM)
   evet → dosya_saklama = max(dosya_saklama, şimdi + 7 gün)
odev-dosyalari: silinme anı = max(hesaplanan an, dosya_saklama)
```

## Dikkat!

- **Kapsam bölümde:** `bul`, `sonuclandir`, `duzelt`, `yenidenAc`, `sil` yalnız kimlikle çalışır. [../../bolumler/odev.md](../../bolumler/odev.md)
  ödevi veren öğretmeni (`a.teacherId === me.id`) ya da sahipsiz ödevde aynı okulun müdürünü ve rol yetkisini
  (`odev.sonuclandir`) denetler; `sonuclandir`'a yalnız ödevin öğrenci listesindeki kimlikleri ve geçerli sonuç türlerini
  verir.
- **`sonuclandir` öğrenci başına bir sorgu** atar (30 öğrenci = 30 `UPDATE` + 1). Doğru çalışır; sınıf büyüdükçe
  [sinavlar.md](sinavlar.md)'deki `degerleriYaz` gibi tek `unnest` sorgusuna çevrilebilir.
- **`SEC` her ödev için dört alt sorgu** çalıştırır ve bütün öğrenci kimliklerini taşır; uzun ödev listelerinde (öğretmenin
  bütün yılı) yanıt büyür. Takvim ve müdür ekranları bu yüzden hafif sorguları kullanır.
- **`dersBaglari` ödevi derse ADIYLA bağlar** (`o.ders = d.konu`). Dersin konusu değişirse (bugün değiştirilemiyor) ya da
  ödev farklı yazılmış bir ders adıyla verildiyse ödev o derste görünmez.
- **`ekle`'de `bitis_saati`** `NOT NULL`'dur ve varsayılanı SQL'e değil `a.endTime`'a bırakılır; `endTime` boş gelirse
  `23502` ("Eksik bilgi"). Bölüm her zaman bir saat verir.
- **Yarış:** aynı ödevi iki sekmeden aynı anda sonuçlandırmak son yazanı kazandırır (her öğrenci satırı ayrı `UPDATE`);
  `acildi` ise `acilma IS NULL` koşuluyla ilk anı korur.
- **Kullanılmayan dışa açık işlevler:** `okulun`, dışarıdan `tarihVeyaNull`.

## Testleri

- `testler/test-odev-saat.js` — son teslim saati, başlama saati, geçmiş ödevin sonuç düzenlemesi.
- `testler/test-odev-dosya.js` — dosya yükleme izni, son teslim değişince saklamanın uzaması, silinme anı.
- `testler/test-kapsam.js` — öğretmenin yalnız kendi öğrencilerine ödev verebilmesi; `testler/test-bildirim.js` — yeni ödev
  bildirimi ve velilere birleşik kopya; `testler/test-takvim.js` — takvimde son günü olan ödevler.
- `testler/test-quiz.js`, `testler/test-egitim-yili.js`, `testler/test-siniflarim.js`, `testler/test-nakil.js`,
  `testler/test-yedek.js` — ödevi ön koşul olarak kullanır.
- Elle: öğretmen olarak son teslimi geçmiş bir ödev ver, bir öğrenci dosya yüklesin, sonra son teslimi yarın yap → dosya en
  az 7 gün daha kalmalı (öğretmen ekranındaki silinme tarihi).

## Son durum

- Son değişiklik `566b917 commit 524` (2026-09-27, canlı hazırlık): `dosya_yukleme` (öğrencinin dosya yükleyip
  yükleyemeyeceği; `ekle` ve `duzelt`'te) ve `SAKLAMA_UZAT` (son teslim değişince / yeniden açılınca dosyalar en az 7 gün
  daha kalır). Öncesi `fc44576 commit 370`: öğrencinin yıldızı (`yildizla`, `yildizlilari`); `e9b0754 commit 344`;
  `89eb5fa commit 77`; ilk hâli `ecd9f35 commit 76` (2026-08-29); toplam 5 commit.
- Bilinen açıklar (kod değiştirilmedi): öğrenci başına `UPDATE`, ada göre ders bağı, kullanılmayan `okulun`.
- Sıradaki planlı işler (DEVAM.md 4. bölüm): "Mesaj ayarları … ödev hatırlatma otomasyonu" `bitisiOlanlar`'ı genişletir;
  "Anket düzenleyici" anketi ödeve ek olarak bağlar; "Yıl geçişi" ödevleri yıla göre arşivler; "Optimizasyon + saklama
  süreleri" öğrenci/veli için yalnız son 1 geçmiş yılı saklayacak.
