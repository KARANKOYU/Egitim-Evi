# sunucu/veri/depo/sinavlar.js

Sınavların veritabanı yüzü: şablonlar ve ölçümleri, sınav grupları, sınavlar, her sınavın ölçümleri ve öğrenci değerleri;
öğretmen ekranı, grafik bantları ve öğrencinin ilerleyiş/grafik sorguları.

## Bu dosya ne yapar?

Bir sınav tek bir not değildir: deneme sınavında "Doğru", "Yanlış", "Net", "Puan" gibi birkaç değer vardır. Bu yüzden
model dört katmanlıdır:

```
sinav_sablonlari ─< sablon_olcumleri          (okulun hazır kalıpları: "LGS Denemesi" → D, Y, Net, Puan)
sinav_gruplari ─< sinavlar ─< sinav_olcumleri ─< sinav_degerleri (öğrenci başına bir değer)
                     └─ sablon_id (isteğe bağlı; şablondan KOPYA alınır)
```

Her sınavın ölçümlerinden tam biri "ana" ölçümdür (`ana = true`): ortalamaya ve grafiğe varsayılan olarak o girer. Eski
API ile uyum için sınav nesnesinde `grades = { ogrenciId: ana ölçüm değeri }` de gelir. Şablon değişse bile eski sınavlar
etkilenmez, çünkü sınav açılırken şablonun ölçümleri `sinav_olcumleri`'ne kopyalanır.

Sınav grubu (ör. "1. Dönem Matematik Yazılıları") bir öğretmenin sınavlarını ağırlıklarıyla toplar; gruptaki sınavın
ağırlığı zorunludur (şemadaki `CHECK`).

Bütün uçlar [../../bolumler/sinav.md](../../bolumler/sinav.md)'dedir; bu dosya yalnız SQL'dir ve okul/öğretmen kapsamını
denetlemez (aşağıda Dikkat!).

## İçinde neler var?

### Nesneler

- `sablon(r)` (iç) → `{ id, schoolId, name, createdBy, olcumler: [...], createdAt }`.
- `OLCUM_JSON` (iç) — ölçüm satırını `{ id, kod, ad, alt, ust, ana, sira }` JSON'una çeviren parça (`json_build_object`).
- Sınav grubu → [../esleme.md](../esleme.md)'deki `sinavGrubu(r)`: `{ id, teacherId, schoolId, subject, name, yilId,
  createdAt }`.
- Sınav → `esleme.sinav(r)`: `{ id, groupId, schoolId, templateId, templateName, teacherId, subject, name, tarih, weight,
  yilId, olcumler: [{ id, kod, ad, alt, ust, ana, sira }], grades: { ogrenciId: deger }, createdAt }`.

### Şablonlar

- `SABLON_SEC` (iç) — `sinav_sablonlari sb` + ölçümleri `json_agg(... ORDER BY x.sira)` ile tek sütunda.
- `sablonlar(okulId)` — okulun şablonları, Türkçe ad sırasıyla.
- `sablonBul(id)` — tek şablon ya da `null`.
- `sablonEkle(s)` — işlemde: şablon satırı + ölçümleri; dönüş `sablonBul(s.id)`.
- `sablonGuncelle(id, ad, olcumler)` — işlemde: adı günceller, ölçümleri baştan yazar; dönüş güncel şablon.
- `sablonOlcumleriniYaz(sablonId, olcumler)` (iç) — ölçümleri siler, `sira` 1'den başlayarak yeniden ekler (kimlik
  `uid('so')`).
- `sablonunSinavSayisi(id)` — bu şablonla açılmış sınav sayısı (kullanılan şablonu silmeden önce bakılır).
- `sablonSil(id)` — siler; sınavlardaki `sablon_id` `NULL` olur (`ON DELETE SET NULL`), ölçümleri `CASCADE` gider.

### Gruplar

- `grupBul(id)` — tek grup ya da `null`.
- `ogretmeninGruplari(ogretmenId)` — `LEFT JOIN sinavlar ... GROUP BY g.id`: her gruba `_sinavSayisi` ve `_agirlikToplami`
  (ağırlık toplamı; yoksa 0) eklenir. Türkçe ad sırası.
- `grupEkle(g)` — `INSERT`. Dönüş yok.
- `grupSil(id)` — siler; gruptaki sınavlar `CASCADE` ile gider (değerleriyle birlikte).

### Sınavlar

- `SINAV_SEC` (iç) — `sinavlar s LEFT JOIN sinav_sablonlari sb` + `olcumler` (JSON dizi) + `notlar`
  (`json_object_agg(ogrenci_id, deger)`, yalnız ANA ölçümün değerleri).
- `bul(id)` — tek sınav ya da `null`.
- `grubun(grupId)` — gruptaki sınavlar, açılış sırasıyla.
- `ogretmenin(ogretmenId)` — öğretmenin sınavları, en yeni tarih önce.
- `ekle(s, olcumler)` — işlemde: sınav satırı + ölçümleri (şablondan kopya ya da tek "Puan"; kimlik `uid('ol')`).
  `weight` verilmezse `NULL`. Dönüş `bul(s.id)`.
- `sil(id)` — siler; ölçümleri ve değerleri `CASCADE`.
- `olcumleriYaz(sinavId, olcumler)` — "+ Yeni değer ekle" ekranının kaydı; işlemde listeyle eşitler:
  1. listede olmayan mevcut ölçümler silinir (değerleri `CASCADE` gider);
  2. kalan bütün ölçümlerde `ana = false` ve `kod = '~' || id` (geçici kod) yapılır;
  3. liste sırasıyla: kimliği olan güncellenir (`WHERE id = $7 AND sinav_id = $8`), olmayan eklenir.
  Geçici kod ve ana'yı sıfırlama, sıra değişirken `UNIQUE (sinav_id, kod)` ve "tek ana ölçüm" indeksinin ara adımda
  bozulmaması içindir. Dönüş güncel sınav.
- `aralikDisi(olcumId, alt, ust)` — aralık daraltılırken dışarıda kalacak değer sayısı (bölüm "şu kadar değer dışarıda
  kalıyor" der).
- `bantlar(sinavIdler)` — grafik bantları: her sınavın her ölçümünde `min`, `max`, `avg` (3 haneye yuvarlanmış) ve sayı →
  `{ sinavId: { kod: { alt, ust, ort, sayi } } }`.
- `degerleriYaz(degerler)` — `[{ olcumId, ogrenciId, deger }]`; `deger === null` silinir. Önce aynı öğrenci-ölçüm çifti
  birden çok geldiyse SONUNCUSU tutulur (toplu upsert aynı satırı iki kez güncelleyemez). Sonra işlemde en çok iki sorgu:
  `DELETE ... USING unnest(...)` ve `INSERT ... SELECT * FROM unnest(...) ON CONFLICT (olcum_id, ogrenci_id) DO UPDATE`.
  Yorumdaki ölçüm: 60 öğrenci × 7 alan = 420 değer tek tek yazılınca 160 ms sürüyordu.
- `degerleri(sinavId)` — `{ olcumId: { ogrenciId: deger } }`.

### Öğrencinin gözünden

- `ogrencininGruplari(ogrenciId)` — öğrencinin ANA ölçümde değeri olan gruplar (öğretmen adıyla) ve her grubun sınavları:
  `_ogretmenAdi`, `_sinavlar: [{ id, name, weight, grade (yoksa null), alt, ust }]`. İki sorgu.
- `ogrencininTekSinavlari(ogrenciId)` — gruba bağlı olmayan, öğrencinin herhangi bir ölçümde değeri olan sınavlar, bütün
  ölçümleriyle: `[{ id, name, tarih, subject, templateName, teacherName, schoolId, yilId, olcumler: [{ kod, ad, alt, ust,
  ana, deger }] }]`, en yeni önce.
- `ogrencininSerisi(ogrenciId, sablonId, okulId)` — grafik: verilen şablonla yapılmış, öğrencinin değeri olan sınavlar
  tarih sırasıyla → `{ sinavlar: [{ id, name, tarih, degerler: { kod: deger } }], olcumler: [{ kod, ad, alt, ust, ana,
  sira }] }`. `okulId` verilirse yalnız o okulun sınavları (nakil gelen öğrencinin eski okulu yeni okula görünmez).
- `ogrencininSablonlari(ogrenciId, okulId)` — öğrencinin girdiği sınavların şablonları (grafik seçicisi), aynı okul
  süzgeciyle.

### Tablolar ve şema

Hepsi `001-ilk.sql`: `sinav_sablonlari` (`UNIQUE (okul_id, ad)`, ad 1–60), `sablon_olcumleri` (`UNIQUE (sablon_id, kod)`,
kod 1–12 karakter, sınırlar −10000…10000, `sablon_olcumleri_tek_ana`), `sinav_gruplari` (`sinav_gruplari_ogretmen`),
`sinavlar` (`agirlik` 0 < x ≤ 100, gruptaysa zorunlu; indeksler `sinavlar_grup`, `sinavlar_ogretmen (ogretmen_id, tarih
DESC)`, `sinavlar_sablon`), `sinav_olcumleri` (`UNIQUE (sinav_id, kod)`, `alt_sinir < ust_sinir`, `sinav_olcumleri_tek_ana`),
`sinav_degerleri` (birincil anahtar `(olcum_id, ogrenci_id)`, değer −10000…10000, `sinav_degerleri_ogrenci`). Sonraki şema
dosyaları bu tablolara dokunmaz (022 yalnız "sınav" bölümünün açılıp kapanmasını, 023 `sinav.olustur` yetkisini ekler).

## Kimle konuşur?

- Çağırdıkları: [../baglanti.md](../baglanti.md) (`sorgu`, `tek`, `calistir`, `islem`, `tr`),
  [../../ortak.md](../../ortak.md) (`uid`), [../esleme.md](../esleme.md) (`sinavGrubu`, `sinav`, `bos`, `yokIse`).
- Çağıranlar ([../index.md](../index.md)'deki `depo.sinavlar` üzerinden):
  - [../../bolumler/sinav.md](../../bolumler/sinav.md) — neredeyse her işlev (şablon, grup, sınav, ölçüm, değer, bant,
    grafik).
  - [../../bolumler/ilerleyis.md](../../bolumler/ilerleyis.md) ve [../../bolumler/ogretmen.md](../../bolumler/ogretmen.md)
    — `ogrencininGruplari`, `ogrencininTekSinavlari`.
- Yedek/geri yükleme bu tabloları [../json-aktarim.md](../json-aktarim.md) üzerinden ayrıca taşır (bu dosyayı kullanmaz).

## Nasıl çalışır (adım adım)?

### Yeni sınav

```
bölüm: şablon seçildiyse sablonBul → ölçümlerini kopyala; seçilmediyse tek "Puan" ölçümü
   → ekle(s, olcumler)  [işlem: sinavlar INSERT + sinav_olcumleri INSERT × n]
   → bul(id): olcumler + grades (ana ölçüm) ile döner
```

### Not girişi

```
öğretmen tabloyu kaydeder → bölüm her hücreyi aralıkla denetler
   → degerleriYaz([{ olcumId, ogrenciId, deger|null }])
        tekilleştir (son gelen) → işlem { toplu DELETE ; toplu UPSERT }
   → bul(id) (güncel grades)
```

## Dikkat!

- **Kapsam bölümde.** `sablonBul`, `grupBul`, `bul`, `sil`, `olcumleriYaz`, `degerleriYaz`, `aralikDisi` yalnız kimlikle
  çalışır. [../../bolumler/sinav.md](../../bolumler/sinav.md) şablonda `schoolId === me.schoolId`, grup ve sınavda
  `teacherId === me.id` denetler; `degerleriYaz`'a giden ölçüm kimliklerinin o sınava, öğrencilerin o öğretmenin
  öğrencilerine ait olduğunu da bölüm süzer. Yeni bir çağıran bu denetimleri kendisi yapmalı.
- **Öğrenci sorgularında okul süzgeci farklı:** `ogrencininSerisi` ve `ogrencininSablonlari` `okulId` alır; ama
  `ogrencininGruplari` ve `ogrencininTekSinavlari` öğrencinin BÜTÜN okullardaki sınavlarını döndürür (nakil gelen
  öğrencinin eski okulu dahil). Okul ve yıl süzmesini çağıranlar ([../../bolumler/ilerleyis.md](../../bolumler/ilerleyis.md),
  [../../bolumler/ogretmen.md](../../bolumler/ogretmen.md)) [../../bolumler/egitim-yili.md](../../bolumler/egitim-yili.md)'deki
  `yilSuz` ile yapar (kaydın `schoolId`'si bakılan okul değilse atılır). Yeni bir çağıran `yilSuz`'u unutursa başka okulun
  notları görünür.
- **`degerleriYaz` ölçümün sınavını bilmez.** Ölçüm kimliği yalnız yabancı anahtarla denetlenir (`23503`); hangi sınava
  ait olduğu burada sorulmaz.
- **`olcumleriYaz`'daki geçici kod** (`'~' || id`) `kod` sütununun şablon ölçümlerindeki 12 karakter sınırına tabi
  değildir (`sinav_olcumleri.kod`'da uzunluk CHECK'i yok); bu yüzden işe yarar. `sinav_olcumleri`'ne uzunluk sınırı
  eklersen bu adımı değiştir.
- **`grades` yalnız ana ölçümdür:** `SINAV_SEC`'teki `notlar` yalnız `x.ana` ölçümün değerlerini toplar; ana ölçüm
  değiştirilince `grades` (ve ortalama, grafik) artık yeni ana ölçümün değerlerini gösterir. Ana ölçüm yoksa `grades` boş
  gelir; bölüm "tek ana ölçüm"ü zorlar (hiç işaretlenmediyse ilki), şemadaki kısmi tekil indeks de ikinciyi engeller.
- **Aralık dışı değerler:** `olcumleriYaz` aralığı daraltırken var olan değerleri silmez ya da kırpmaz. Bölüm her kalan
  ölçüm için önce `aralikDisi` ile sayar; dışarıda değer kalıyorsa kaydı hiç yapmaz ('"<ölçüm>" için girilmiş N değer
  yeni aralığın dışında kalıyor'). Not girişinde ise aralık dışı ve sayı olmayan hücreler yazılmaz, atlanan sayısı döner.
- **Yazma işlemleri kilitsizdir:** iki öğretmen aynı sınavın değerlerini aynı anda kaydederse son kaydeden kazanır
  (satır düzeyinde; `ON CONFLICT DO UPDATE`). Aynı sınavın ölçümleri aynı anda iki sekmeden düzenlenirse `olcumleriYaz`'ın
  sil-güncelle-ekle adımları iç içe geçebilir; `UNIQUE (sinav_id, kod)` ya da tek ana indeksi `23505` verir ve işlem geri
  alınır ("Bu kayıt zaten var").
- **Ağırlık toplamı** `ogretmeninGruplari`'nda yalnız bilgi içindir; 100'ü geçmesi veritabanında engellenmez.
- **Dizin kullanımı:** öğrenci sorguları `sinav_degerleri_ogrenci` indeksiyle başlar; `ogrencininSerisi` şablonla
  `sinavlar_sablon`'u kullanır.

## Testleri

- `testler/test-sinav.js` — şablon, grupsuz sınav, ondalıklı (virgüllü) değer, aralık dışı ve sayı olmayan değerlerin
  atlanması (`atlanan`), "+ yeni değer ekle", grafik (`/api/exams/grafik`, tarih sırası) ve grup ortalaması.
- `testler/test-siniflarim.js` — öğretmenin öğrenci ekranında sınav sonuçları (`ogrencininGruplari`,
  `ogrencininTekSinavlari`); `testler/test-bildirim.js` — sınav notu kaydında bildirimin tekrar gitmemesi.
- `testler/test-ozellikler.js` — okulda "Sınavlar" bölümü kapalıyken uçların kapanması.
- Elle: öğretmen olarak bir şablonla sınav aç, iki öğrenciye değer gir, "+ Yeni değer ekle" ile ölçüm ekleyip sırasını
  değiştir; ana ölçümü değiştir → öğrenci ilerleyiş sayfasında grafik yeni ana ölçümü göstermeli.

## Son durum

- Son değişiklik `e544270 commit 201` (2026-09-25): `ogrencininTekSinavlari` eklendi (gruba bağlı olmayan sınavlar
  ilerleyişte görünsün). Öncesi `920d23b commit 200`: `degerleri(sinavId)`. Dosyanın ilk hâli `35094b2 commit 197`
  (2026-09-25); toplam 5 commit.
- Bilinen açık: yok (kod değiştirilmedi). Kapsamın bölümde olduğu yukarıda yazılı.
- Sıradaki planlı işler (DEVAM.md 4. bölüm): "Sınav: formüllü ölçüm" — hesaplanan ölçümler (N = D − Y/4 gibi, kendi
  hesaplayıcı), notları Excel'den yükleme/indirme, sınav grubunun üst değeri (ör. 125), yüzde/katkı puanı, bağlı
  kaydırıcılar; öneri onay bekliyor. Onaylanırsa `sinav_olcumleri`'ne formül sütunu, `sinav_gruplari`'na üst değer gelir ve
  `olcumleriYaz`, `degerleriYaz`, `ogrencininGruplari` değişir. "Mesaj ayarları … sınav planlama (salon/koltuk)" yeni
  tablolar ister.
