# sunucu/veri/depo/quiz.js

Ödev quizinin SQL'i: quiz ayarları ve soruları (doğru şıklarıyla), öğrencinin tek denemesi, cevaplar, soru kapanışları,
dakikalık temizliğin aday sorguları ve sonuç bildirimi işareti (şema 029).

## Bu dosya ne yapar?

Öğretmen bir ödeve quiz ekleyebilir; öğrenci quizi bir kez çözer. Bütün kurallar (süre, puan, sonuçların ne zaman
açılacağı, kopya önlemleri) [../../bolumler/quiz.md](../../bolumler/quiz.md)'de ve saf hesaplar
[../../yardimci/quiz.md](../../yardimci/quiz.md)'dedir. Bu dosya o kuralların dayandığı veritabanı adımlarını verir ve
özellikle üç şeyi veritabanına yaptırır:

- **Tek deneme:** `quiz_denemeleri`'nin anahtarı `(odev_id, ogrenci_id)`; `denemeBaslat` `ON CONFLICT DO NOTHING` ile
  aynı anda gelen iki "Başlat"ta tek satır açar.
- **Kapanan soruya yazılmaz:** `cevapYaz` ve `soruKapat` `WHERE quiz_cevaplari.kapanis IS NULL` koşullu upsert kullanır.
- **Bildirim bir kez:** `bildirildi` yalnız bu çağrıda işaretlediği denemeleri döndürür.

`sorulari()` şıkların `dogru` bilgisini de getirir çünkü puan sunucuda hesaplanır; öğrenciye ve veliye giden görünümü
bölüm kurar ve doğru bilgisini ancak sonuç açılınca ekler. Ödev nesnesine ([odevler.md](odevler.md)'deki `SEC`) quizden
hiçbir şey eklenmez.

## İçinde neler var?

### Nesneler (iç)

- `quizNesne(r)` → `{ odevId, sureTuru ('yok'|'soru'|'quiz'), toplamSn, cikincaKapanir, sonucGorunum ('teslim'|'hemen'),
  sonucAcildi (an ya da null), olusturma, guncelleme }`.
- `denemeNesne(r)` → `{ odevId, ogrenciId, baslama, bitis, bitisNedeni, soruSira, soruBaslama, cikisSayisi, cikisSn,
  dogru, puanli, sonucBildirildi }` (`bitis`, `bitisNedeni`, `dogru`, `puanli` yoksa `null`).
- `cevapNesne(r)` → `{ soruId, secilenler: [şık kimliği], metin, kayit, acilis, kapanis, kapandi }`.

Burada [../esleme.md](../esleme.md) kullanılmaz; nesneler bu dosyada kurulur.

### Quiz ve soruları

- `bul(odevId)` — ödevin quizi ya da `null`.
- `kilitle(odevId)` — `SELECT ... FROM quizler WHERE odev_id = $1 FOR UPDATE`. Öğretmen quizi değiştirirken çağrılır;
  yalnız bir işlemin (`islem`) içinde anlamlıdır. Kilit sürerken bir öğrencinin `denemeBaslat`'ı (yeni satır `quizler`
  satırına yabancı anahtarla bağlı olduğu için) işlem bitene kadar bekler.
- `sorulari(odevId)` — iki sorgu: sorular `sira` sırasıyla, şıklar `(soru_id, sira)` sırasıyla; dönüş `[{ id, sira, tur,
  metin, sureSn, secenekler: [{ id, sira, metin, dogru }] }]`.
- `yaz(odevId, q)` — işlemde: `quizler` upsert (`ON CONFLICT (odev_id) DO UPDATE`, `guncelleme = now()`), ödevin bütün
  soruları silinir (şıklar ve cevaplar `CASCADE`), sorular tek `INSERT ... SELECT FROM unnest(...)` ile (kimlik
  `uid('qs')`), şıklar da tek sorguda (kimlik `uid('qo')`, `sira` 1'den) yazılır. `q` [../../yardimci/quiz.md](../../yardimci/quiz.md)'deki
  doğrulamanın çıktısıdır. Deneme varken çağrılmamalı (bölüm `kilitle` + `denemeSayisi` ile bakar).
- `sil(odevId)` — quizi siler (sorular, şıklar, denemeler, cevaplar `CASCADE`).
- `sonucAc(odevId)` — `sonuc_acildi = COALESCE(sonuc_acildi, now())`: ilk açılış anı korunur ("Sonuçları şimdi aç" ya da
  son teslimle açılan sonucu bir öğrenci görebildi).
- `ozetler(odevIdler)` — birçok ödevin quiz özeti tek sorguda → `Map(odevId → quizNesne + { soruSayisi, acikUcluSayisi,
  puanliSayisi, soruSureToplami, baslayan, biten })`. Quizi olmayan ödev haritada yoktur.

### Denemeler

- `denemeSayisi(odevId)` — başlamış deneme sayısı (sayı).
- `denemeSayilari(odevId)` — `{ baslayan, biten }`.
- `denemeBul(odevId, ogrenciId, kilitleMi)` — deneme ya da `null`; `kilitleMi` ise `FOR UPDATE` (cevap, sonraki soru,
  bitir aynı anda gelirse sırayla işlenir; yine yalnız işlem içinde anlamlı).
- `odevinDenemeleri(odevId)` — ödevin bütün denemeleri (öğretmen sonuç ekranı).
- `ogrencininDenemeleri(ogrenciId, odevIdler)` — `Map(odevId → deneme)`.
- `acikDenemeler(odevId)` — bitmemiş denemelerin öğrenci kimlikleri.
- `denemeBaslat(odevId, ogrenciId)` — `INSERT ... ON CONFLICT (odev_id, ogrenci_id) DO NOTHING RETURNING`; yeni satır
  açıldıysa `true`.
- `denemeYaz(d)` — denemenin değişen alanlarını (`bitis`, `bitis_nedeni`, `soru_sira`, `soru_baslama`, `cikis_sayisi`,
  `cikis_sn`, `dogru`, `puanli`) yazar; `dogru`/`puanli` verilmezse `NULL`. `bitis_nedeni` şemada `'ogrenci'`, `'sure'`,
  `'teslim'`, `'sonuclandi'`, `'cikis'`'tan biridir ve `bitis` ile birlikte dolu ya da birlikte boş olmalıdır (CHECK;
  aykırıysa `23514`). Bütün alanları birlikte yazar: çağıran önce `denemeBul` ile okuyup değiştirdiği nesneyi verir.
- `geriTarihle(odevId, ogrenciId, saniye)` — `baslama` ve `soru_baslama`'yı saniye kadar geri çeker (süre dolmuş gibi).
  Yalnız `testler/test-quiz.js` kullanır.

### Dakikalık temizliğin aday sorguları

Üçü de `odevIdler` `null` ise bütün ödevlere bakar; kesin karar (Türkiye saatiyle son teslim, 10 dakikalık pay) bölümde
verilir, SQL yalnız adayları daraltır.

- `acikAdaylar(odevIdler)` — süresi dolmuş olabilecek açık denemeler: `bitis IS NULL` ve (süreli quiz YA DA ödev aktif
  değil YA DA sonuç açılmış YA DA ödevin son günü yarından önce/yarın). Süresiz quizde son tarihi olmayan aktif ödevin
  denemesi aday olmaz. Her satır `{ odevId, ogrenciId, baslama, soruSira, soruBaslama, sureTuru, toplamSn, sonucAcildi,
  odevBitis, bitisSaati, durum, kalanSn }`; `kalanSn` şu anki sorudan sonuna kadar soru sürelerinin toplamı.
- `teslimAdaylari(odevIdler)` — sonucu "son teslimden sonra" açılacak, henüz kalıcı açılmamış, son günü yarına kadar olan
  ve en az bir bitmiş denemesi bulunan quizler → `[{ odevId, odevBitis, bitisSaati }]`.
- `bildirimAdaylari(odevIdler)` — bitmiş ama sonucu bildirilmemiş denemeler; sonucu açılmış olabilecekler (açılmış,
  "hemen", ödev sonuçlanmış ya da son günü yarına kadar) → `[{ odevId, ogrenciId, bitis, sonucGorunum, sonucAcildi,
  odevBitis, bitisSaati, durum, ders, baslik }]`.
- `bildirildi(liste)` — `liste = [[odevId, ogrenciId]]`; `UPDATE ... SET sonuc_bildirildi = true ... AND NOT
  sonuc_bildirildi RETURNING`: yalnız BU çağrıda işaretlenenler döner, aynı anda çalışan iki temizlik aynı bildirimi iki
  kez göndermez.

### Cevaplar

- `cevaplari(odevId, ogrenciId)` — öğrencinin bu quizdeki bütün cevap satırları.
- `cevapBul(odevId, ogrenciId, soruId)` — tek cevap ya da `null`. Bugün çağıran yok.
- `cevapYaz(odevId, ogrenciId, soruId, secilenler, metin)` — upsert; satır varsa ve soru KAPANMIŞSA (`kapanis IS NOT
  NULL`) hiçbir şey yazılmaz ve `null` döner; yazıldıysa kayıt anı (`kayit = now()`).
- `soruKapat(odevId, ogrenciId, soruId, acilis, kapanis, neden)` — soruyu kapatır (`kapandi`: `'sure'`, `'cikis'`,
  `'gecildi'`); açılış anı ilk yazılanı korur; zaten kapalıysa dokunmaz. Kapattıysa `true`.
- `kapaliSoruSayisi(odevId, ogrenciId)` — kapanmış soru sayısı.

### Tablolar ve şema

Hepsi `029-quiz.sql`:

| Tablo | Anahtar ve kurallar |
|---|---|
| `quizler` | `odev_id` (ödeve bağlı, `CASCADE`); `sure_turu` üçünden biri; `toplam_sn` 60–10800 ve yalnız `'quiz'` türünde dolu |
| `quiz_sorulari` | `sira` 1–100, `tur` `dy`/`coktan`/`acik`, metin 1–1000, `sure_sn` 10–600; `UNIQUE (odev_id, sira)` |
| `quiz_secenekleri` | `sira` 1–10, metin 1–300, `dogru`; `UNIQUE (soru_id, sira)` |
| `quiz_denemeleri` | `(odev_id, ogrenci_id)`; ödevin öğrenci listesine (`odev_ogrencileri`) bileşik yabancı anahtar; `bitis` ile `bitis_nedeni` birlikte dolu; indeksler `quiz_denemeleri_ogrenci`, `quiz_denemeleri_acik (odev_id) WHERE bitis IS NULL` |
| `quiz_cevaplari` | `(odev_id, ogrenci_id, soru_id)`; en çok 10 seçim, metin ≤ 2000; ödev öğrencisine, denemeye ve aynı ödevin sorusuna bağlı |

Bileşik yabancı anahtarlar sayesinde ödevde olmayan öğrencinin denemesi ya da başka ödevin sorusuna cevap veritabanına
yazılamaz. `acikAdaylar`, `teslimAdaylari`, `bildirimAdaylari` ayrıca `odevler`'i (`bitis`, `bitis_saati`, `durum`, `ders`,
`baslik`) birleştirir.

## Kimle konuşur?

- Çağırdıkları: [../baglanti.md](../baglanti.md) (`sorgu`, `tek`, `calistir`, `islem`), [../../ortak.md](../../ortak.md)
  (`uid`).
- Çağıranlar ([../index.md](../index.md)'deki `depo.quiz`):
  - [../../bolumler/quiz.md](../../bolumler/quiz.md) — neredeyse hepsi (deneme, cevap, kapanış, temizlik, bildirim,
    öğretmen yazma/silme).
  - [../../bolumler/odev.md](../../bolumler/odev.md) — ödev açılırken quizi aynı işlemde yazmak (`yaz`) ve ödevin quizi
    var mı (`bul`).
  - `testler/test-quiz.js` — doğrudan `require`: `geriTarihle`, `denemeBul`, `denemeSayisi`, `cevaplari`, `bul`.

## Nasıl çalışır (adım adım)?

### Öğretmen quizi değiştirirken

```
islem {
  kilitle(odevId)          quizler satırı FOR UPDATE
  denemeSayisi(odevId) > 0 → hiçbir şey yazılmaz; bölüm 409 "N öğrenci başladı; quiz artık değiştirilemez."
  yaz(odevId, q) | sil(odevId)
}                          ← bu sırada gelen denemeBaslat, kilit bitene kadar bekler
```

`yaz` kendi içinde de `islem` çağırır; dıştaki işlem sürdüğü için yeni işlem açılmaz, ona katılır
([../baglanti.md](../baglanti.md) "İç içe").

### Öğrencinin cevabı

```
islem {
  denemeBul(odevId, ogrenciId, true)     deneme satırı kilitli
  (bölüm: süre ilerlet, gerekiyorsa soruKapat / denemeYaz)
  cevapYaz(...) → kapalı soruya null
}
```

## Dikkat!

- **`FOR UPDATE` yalnız işlemde kilitler.** `kilitle` ve `denemeBul(..., true)` işlem dışında çağrılırsa kilit sorgu
  bitince bırakılır ve hiçbir koruma sağlamaz. Bölüm hep `islem` içinde çağırıyor; yeni bir çağıran da öyle yapmalı.
- **`yaz` soruları silip yeniden yazar.** Soru kimlikleri her kayıtta değişir ve `quiz_cevaplari` `CASCADE` ile silinir;
  bu yüzden deneme varken çağrılmamalı (bölüm `kilitle` + `denemeSayisi` ile engeller).
- **Doğru bilgisi bu dosyadan çıkar.** `sorulari()`'nın döndürdüğü `dogru` alanı öğrenciye gitmemeli; süzme
  [../../bolumler/quiz.md](../../bolumler/quiz.md)'dedir. Yeni bir uç `sorulari()` kullanıyorsa bunu unutma.
- **Kapsam denetimi yok.** İşlevler ödev ve öğrenci kimliğiyle çalışır; "bu öğrenci bu ödevin öğrencisi mi" sorusunu
  bölüm sorar, veritabanı da bileşik yabancı anahtarla (`odev_ogrencileri`) arkasını kollar.
- **Aday sorgularında `current_date` UTC'dir** (veritabanı oturumu UTC, [../baglanti.md](../baglanti.md)); bu yüzden
  koşul "son gün ≤ yarın" diye geniş tutulur, Türkiye saatine göre kesin hesap bölümde yapılır.
- **`ozetler` her quiz için beş alt sorgu** (`count`/`sum`) çalıştırır; ödev listesi sayfası büyüdükçe maliyeti artar,
  bugünkü boyutta sorun değil.
- **Kullanılmayan dışa açık işlev:** `cevapBul`.
- **Test kancası:** `geriTarihle` yalnız testler içindir; uygulama kodundan çağrılmamalı.

## Testleri

- `testler/test-quiz.js` — tek deneme, süre türleri (`geriTarihle` ile süre doldurma), soru başına sürede kapanış, cevap
  yazma, sonuç açılışı ve bildirimi, öğretmen kilidi; depoyu doğrudan da `require` eder.
- `testler/test-quiz-metin.js` (sunucusuz) — yalnız [../../yardimci/quiz.md](../../yardimci/quiz.md)'deki ayrıştırıcıyı dener,
  bu dosyaya dokunmaz.
- `testler/test-ozellikler.js` — "Ödevler" bölümü kapalıyken quiz uçlarının kapanması; `testler/test-yedek.js` — quiz
  tablolarının yedeğe girip geri gelmesi.
- Elle: öğretmen olarak 2 soruluk, soru başına 10 saniyelik bir quiz yaz; öğrenci olarak başlat ve bekle → ilk soru
  kapanmalı, ona sonradan cevap yazılamamalı.

## Son durum

- Dosyanın tek commit'i `3b8fd36 commit 519` (2026-09-27): quiz özelliğiyle birlikte (029 şema dosyası) yazıldı; o günden
  beri değişmedi.
- Bilinen açık (kod değiştirilmedi): kullanılmayan `cevapBul`.
- Sıradaki planlı işler (DEVAM.md 4. bölüm): "Anket düzenleyici + quiz sorularını Excel'den aktarma" ve "Düzenleyiciler"
  (quiz soru editörü: resim, matematik, soru bankası) soru tablolarına yeni sütun/tablolar getirebilir (`yaz`, `sorulari`
  değişir); "Optimizasyon + saklama süreleri" quiz verisini 1 yıl saklayacak (silme sorgusu buraya eklenir).
