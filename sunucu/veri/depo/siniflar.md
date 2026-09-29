# sunucu/veri/depo/siniflar.js

Sınıflar, dersler (sınıf + branş + öğretmen) ve haftalık ders programı: listeler, özetler, ekleme/silme, günlük
hatırlatma adayları ve program çakışmalarını bulan öz-birleştirme sorgusu.

## Bu dosya ne yapar?

Okulun iskeleti burada: "7-A" bir sınıftır; "7-A Matematik" bir derstir ve öğretmeni atanır; "Pazartesi 09:00–09:40
7-A Matematik" bir ders saatidir. Öğretmen-öğrenci ilişkisi YALNIZ derslerden türer: öğretmen, ders verdiği sınıfların
öğrencilerinin öğretmenidir ([kullanicilar.md](kullanicilar.md)'deki `ogretmeninOgrencileri`, [../../iliskiler.md](../../iliskiler.md)).

Uçlar çoğunlukla müdür ekranındadır ([../../bolumler/okul.md](../../bolumler/okul.md)); bu dosya SQL'i verir, okul
kapsamını çağıran denetler.

## İçinde neler var?

Satır → nesne çevirisi [../esleme.md](../esleme.md)'dedir: `sinif(r)` → `{ id, schoolId, name, createdAt }`; `ders(r)` →
`{ id, schoolId, classId, subject, teacherId, weeklyHours, createdAt }` (+ `_sinifAdi`, `_ogretmenAdi`, `_yerlesen`);
`program(r)` → `{ id, schoolId, classId, lessonId, day, start, end, yilId, createdAt }` (+ `_ders`, `_ogretmenId`,
`_sinifAdi`). Bu dosyadaki `programNesnesi(r)` (iç) `program(r)`'ye `_ogretmenAdi` ekler.

### Sınıflar (`siniflar`)

- `bul(id)` — tek sınıf ya da `null` (okul süzmez).
- `okulun(okulId)` — okulun sınıfları, Türkçe ad sırasıyla (`tr()`).
- `ozetleri(okulId, sinifId)` — sınıf listesi ve özetleri tek sorguda: `[{ id, name, studentCount, lessonCount,
  unassigned (öğretmeni atanmamış ders) }]`. `sinifId` verilirse yalnız o sınıf.
- `sayisi(okulId)` — sınıf sayısı. Bugün çağıran yok.
- `ekle(c)` — `INSERT (id, okul_id, ad, olusturma)`; aynı okulda aynı ad `UNIQUE (okul_id, ad)` ile `23505`.
- `sil(id)` — siler: dersleri ve programı `CASCADE`, öğrencilerin `sinif_id`'si `NULL` olur, ödevlerin sınıf bağı
  (`odev_siniflari`) `CASCADE`; devamsızlık kayıtları silinmez, `devamsizlik.sinif_id` ve
  `ders_id` `NULL` olur.

### Dersler (`dersler`)

- `DERS_SEC` (iç) — ders + sınıf adı + öğretmen adı + programa yerleşmiş saat sayısı (`yerlesen`).
- `dersBul(id)`, `sinifinDersleri(sinifId)` (konu sırası), `okulunDersleri(okulId)` (sınıf, sonra konu sırası),
  `ogretmeninDersleri(ogretmenId)`.
- `dersVarMi(sinifId, konu)` — sınıfta aynı adlı ders var mı (ödev verirken ve ders eklerken).
- `dersEkle(l)` — `INSERT`; öğretmen boşsa `NULL`, haftalık saat boşsa 0.
- `dersGuncelle(id, degisiklik)` — yalnız verilen alanlar: `teacherId` (boşsa `NULL`) ve/veya `weeklyHours`; her biri ayrı
  `UPDATE`.
- `dersSil(id)` — siler; program satırları `CASCADE`, o dersin devamsızlık kayıtlarında `ders_id` `NULL` olur.

### Ders programı (`ders_programi`)

- `PROGRAM_SEC` (iç) — ders saati + ders konusu + öğretmen kimliği + sınıf adı + öğretmen adı; `PROGRAM_SIRA` = gün, sonra
  başlangıç.
- `programBul(id)`.
- `sinifinProgrami(sinifId, gun)` / `ogretmeninProgrami(ogretmenId, gun)` — `gun` verilirse yalnız o gün (1 = Pazartesi),
  `($2::int IS NULL OR p.gun = $2)`.
- `okulunProgrami(okulId)` — sınıf adı, gün, saat sırasıyla.
- `baslamakUzereOlanlar(gun, bas, bit)` — BÜTÜN okullarda, o gün `[bas, bit]` saatleri arasında başlayan ve öğretmeni olan
  ders saatleri ([../../hatirlatma.md](../../hatirlatma.md) günlük ders programı hatırlatması; bugün `'00:00'–'23:59'` ile
  bütün günü alır).
- `programVarMi(sinifId, dersId, gun, bas)` — aynı ders aynı gün aynı saatte zaten var mı.
- `programEkle(k)` / `programGuncelle(id, k)` (ders, gün, başlangıç, bitiş) / `programSil(id)`.
- `cakismalar(okulId)` — okulun bütün çakışmaları tek öz-birleştirme sorgusuyla: aynı gün, saatleri kesişen iki ders saati
  (`a.baslangic < b.bitis AND b.baslangic < a.bitis`; 10:00'da biten ile 10:00'da başlayan çakışmaz), `a.id < b.id` (her
  çift bir kez), ve ya öğretmeni aynı ya sınıfı aynı. Ham satır döner (`a_id, a_sinif, gun, a_bas, a_bit, b_id, b_sinif,
  b_bas, b_bit, a_ders, b_ders, a_sinif_adi, b_sinif_adi, a_ogretmen, b_ogretmen, ogretmen_adi`).
- `aralikKesisenler(okulId, gun, bas, bit, haricId)` — eklemeden/düzenlemeden önce: okulda o gün bu aralıkla kesişen BÜTÜN
  ders saatleri (düzenlenen `haricId` hariç). Sınıf ya da öğretmen süzgeci SQL'de yoktur; [../../iliskiler.md](../../iliskiler.md)'deki
  `aralikCakismasi` sonucu tarayıp aynı sınıfı ya da aynı öğretmeni arar. (Koddaki yorum "ilk çakışan satırı döndürür"
  der ama işlev listeyi döndürür; ilkini seçen `aralikCakismasi`'dır.)

### Tablolar ve şema

Üçü de `001-ilk.sql`:

| Tablo | Kurallar ve indeksler |
|---|---|
| `siniflar` | ad 1–30, `UNIQUE (okul_id, ad)` |
| `dersler` | sınıf silinince `CASCADE`, öğretmen silinince `SET NULL`, haftalık saat 0–20, `UNIQUE (sinif_id, konu)`; `dersler_ogretmen`, `dersler_okul` |
| `ders_programi` | gün 1–7, `bitis > baslangic` ve en çok 8 saat; sınıf ve ders silinince `CASCADE`; `ders_programi_sinif_gun (sinif_id, gun, baslangic)`, `ders_programi_ders`, `ders_programi_okul` |

`kullanicilar.sinif_id` (`ON DELETE SET NULL`) de 001'dendir; `002-hiz.sql` `odev_siniflari_sinif` indeksini ekler.

## Kimle konuşur?

- Çağırdıkları: [../baglanti.md](../baglanti.md) (`sorgu`, `tek`, `calistir`, `tr`), [../esleme.md](../esleme.md)
  (`sinif`, `ders`, `program`, `bos`, `yokIse`).
- Çağıranlar ([../index.md](../index.md)'deki `depo.siniflar`):
  - [../../bolumler/okul.md](../../bolumler/okul.md) — sınıf, ders, program ekranlarının hepsi (ekleme, silme, özet,
    program, ders atama).
  - [../../iliskiler.md](../../iliskiler.md) — `okulun`, `ozetleri`, `ogretmeninDersleri`, `cakismalar`, `aralikKesisenler`.
  - [../../yetki.md](../../yetki.md) — `okulun`.
  - [../../bolumler/devamsizlik.md](../../bolumler/devamsizlik.md) (`dersBul`, `okulunDersleri`, `sinifinProgrami`,
    `okulun`, `ozetleri`), [../../bolumler/odev.md](../../bolumler/odev.md) (`bul`, `okulunDersleri`,
    `ogretmeninDersleri`, `dersVarMi`), [../../bolumler/ogretmen.md](../../bolumler/ogretmen.md), 
    [../../bolumler/takvim.md](../../bolumler/takvim.md) (`sinifinProgrami`, `ogretmeninProgrami`),
    [../../bolumler/ilerleyis.md](../../bolumler/ilerleyis.md), [../../bolumler/hesaplar.md](../../bolumler/hesaplar.md),
    [../../bolumler/nakil.md](../../bolumler/nakil.md), [../../bolumler/mesaj.md](../../bolumler/mesaj.md),
    [../../bolumler/etut.md](../../bolumler/etut.md), [../../bolumler/okul-hayati.md](../../bolumler/okul-hayati.md),
    [../../bolumler/kisi-aktarim.md](../../bolumler/kisi-aktarim.md) (Excel'den sınıf açma: `okulun`, `ekle`).
  - [../../hatirlatma.md](../../hatirlatma.md) — `baslamakUzereOlanlar`.

## Nasıl çalışır (adım adım)?

### Programa ders saati ekleme

```
okul.js: sınıf ve ders bu okulun mu? (bul / dersBul + schoolId)
  → programVarMi (aynı ders aynı saatte var mı)
  → iliskiler.aralikCakismasi → aralikKesisenler(okul, gün, bas, bit) → aynı sınıf / aynı öğretmen var mı
  → yoksa programEkle
```

### Çakışma raporu

```
ders_programi a JOIN ders_programi b (aynı okul, aynı gün, a.id < b.id, saatler kesişiyor)
  JOIN dersler da/db, siniflar sa/sb
  WHERE aynı öğretmen (boş değil) OR aynı sınıf
```

## Dikkat!

- **Kapsam bölümde:** `bul`, `dersBul`, `programBul`, `sil`, `dersSil`, `programSil`, `dersGuncelle`, `programGuncelle`
  yalnız kimlikle çalışır. [../../bolumler/okul.md](../../bolumler/okul.md) her birinde `schoolId === me.schoolId` denetler
  ("Sınıf bulunamadı", "Ders bulunamadı", "Ders saati bulunamadı").
- **Çakışma denetimi kilitsizdir (denetle-sonra-yaz).** `aralikKesisenler` ile `programEkle` arasında başka bir istek aynı
  sınıfa ya da öğretmene kesişen bir saat eklerse ikisi de yazılır; veritabanında çakışmayı önleyen bir kısıt yok
  (`EXCLUDE` kısıtı ya da işlem + kilit yok). Böyle bir durum sonradan `cakismalar` raporunda görünür.
- **`dersGuncelle` iki ayrı `UPDATE`'tir** ve işlemde değildir; ikincisi hata verirse öğretmen ataması yazılmış kalır.
  Bugün bölüm haftalık saati 0–20'ye sıkıştırdığı (`Math.max(0, Math.min(20, …))`) için CHECK hatası beklenmez.
- **Saat karşılaştırması:** `baslangic`/`bitis` `time` türündedir; bu dosya sorguya `$n::time` ile gönderir, uygulamaya
  `'SS:DD'` metni olarak döner ([../baglanti.md](../baglanti.md) tür dönüşümleri).
- **`baslamakUzereOlanlar` okul süzmez** (bilerek: bütün okulların günlük hatırlatması tek sorguda).
- **Kullanılmayan dışa açık işlev:** `sayisi`.
- **Sınıf silmek geniş etkilidir:** dersler, program, ödevlerin sınıf bağları gider; öğrenciler sınıfsız kalır; geçmiş
  devamsızlık kayıtları kalır ama hangi sınıfa/derse ait oldukları kaybolur (`SET NULL`). Geri alma
  yoktur; silinen sınıfın dersleri ve programı yeniden kurulmalıdır.

## Testleri

- `testler/test-program.js` — ders ekleme, öğretmen atama (`/api/school/lesson-update`), programa ders saati ekleme ve
  çakışma denetimi.
- `testler/test-siniflarim.js` — öğretmenin yalnız ders verdiği sınıfları görmesi (`ogretmeninDersleri`, `ozetleri`).
- `testler/test-yonetim.js` — sınıf adının düzeltilmesi (`"8b"` → `"8-B"`, `/api/school/class`); `testler/test-kapsam.js`
  — sınıf ve ders kurup öğretmen-öğrenci kapsamının derslerden türemesi. Sınıf açan başka paketler de var (ör.
  `testler/test-devamsizlik.js`, `testler/test-takvim.js`, `testler/test-egitim-yili.js`).
- Elle: aynı öğretmeni iki sınıfa aynı saatte yerleştirmeyi dene → "çakışma" uyarısı; 10:00'da biten dersin ardına 10:00'da
  başlayan ders sorunsuz eklenmeli.

## Son durum

- Son değişiklik `4737d72 commit 47` (2026-08-29): `programSil`, `cakismalar`, `aralikKesisenler` (çakışma denetimi). İlk
  hâli `b47f5f2 commit 46` (aynı gün); toplam 2 commit — o günden beri değişmedi.
- Bilinen açıklar (kod değiştirilmedi): kilitsiz çakışma denetimi, `dersGuncelle`'nin işlemsiz iki adımı, kullanılmayan
  `sayisi`, `aralikKesisenler`'in yanıltıcı yorumu.
- Sıradaki planlı işler (DEVAM.md 4. bölüm): "Yıl geçişi" (yeni yıl sihirbazı, mezunlar) sınıfları ve programı yeni yıla
  taşıyacak (sınıfların yıla bağlanması bu dosyayı değiştirir); "Mesaj ayarları … sınav planlama (salon/koltuk)" sınıf ve
  program bilgisini kullanacak.
