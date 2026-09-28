# sunucu/veri/sema.js

Şema sürümleri: `sunucu/veri/sema/NNN-*.sql` dosyalarını ad sırasıyla, her birini bir kez ve kendi işleminde uygulayan
düzenek (`semayiGuncelle`) ile yalnız test veritabanını sıfırlayan `testIcinSifirla`.

## Bu dosya ne yapar?

Veritabanının yapısı (tablolar, sütunlar, indeksler, kısıtlar, tetikleyiciler) kodla birlikte değişir. Canlı sunucuda
veri kaybolmadan yapıyı güncellemek için Eğitim Evi basit bir "göç" (migration) düzeni kullanır:

- Her değişiklik numaralı bir SQL dosyasıdır: `001-ilk.sql`, `002-hiz.sql`, … bugün son dosya `035-okul-disk-siniri.sql`.
- Sunucu her açılışta bu dosyalardan henüz uygulanmamış olanları sırayla çalıştırır ve hangilerinin uygulandığını
  `sema_surumleri` tablosuna yazar.
- Uygulanmış bir dosya ASLA değiştirilmez: yeni bir sütun ya da kural gerekince yeni bir numaralı dosya yazılır. Eski
  dosyayı değiştirmek, onu zaten uygulamış sunucularda hiçbir şey yapmaz (numara uygulanmış görünür) ve sessiz bir
  yapı farkı doğurur.

Her dosyanın ne eklediği ve neden `sunucu/veri/sema/SEMA.md`'de anlatılır; bu belge yalnız düzeneği anlatır.

## İçinde neler var?

- `KLASOR` (iç) — `sunucu/veri/sema` (bu dosyanın yanındaki klasör).
- `dosyalar()` (iç) — klasördeki adları `^\d{3}-[a-z0-9-]+\.sql$` kalıbıyla süzer, ad sırasına (`sort()`) dizer ve
  `{ surum: Number(ilk üç hane), ad, yol }` listesi döner.
- `semayiGuncelle()` — asıl iş:
  1. `sema_surumleri` (`surum integer PRIMARY KEY`, `dosya text`, `uygulanma timestamptz DEFAULT now()`) yoksa kurar.
  2. Uygulanmış sürüm numaralarını okur.
  3. Listede sırayla, numarası uygulanmamış her dosya için: metni okur; [baglanti.md](baglanti.md)'deki `islem` içinde önce
     dosyanın tamamını `metinCalistir` ile çalıştırır, sonra `sema_surumleri`'ne `(surum, dosya)` yazar; pencereye
     "Şema uygulandı: 029-quiz.sql" gibi bir satır basar.
  4. Uygulanan yeni dosya sayısını döner.
  Bir dosya hata verirse o dosyanın işlemi geri alınır (yarım şema olmaz), hata yukarı gider ve sunucu AÇILMAZ
  ([../index.md](../index.md) "HATA: veritabanı açılamadı" yazıp çıkar). Önceki dosyalar kendi işlemlerinde işlenmiş
  olduğu için kalır; düzeltilip yeniden açılınca kalan yerden devam edilir.
- `testIcinSifirla()` — yalnız testler için: [baglanti.md](baglanti.md)'deki `veritabaniAdi()` `_test` ile bitmiyorsa
  "Sıfırlama yalnızca test veritabanında yapılabilir (şu an: …)" hatası fırlatır; bitiyorsa
  `DROP SCHEMA public CASCADE; CREATE SCHEMA public;` ile bütün tabloları siler. Ardından `semayiGuncelle` şemayı 001'den
  yeniden kurar.

Dışa açılanlar: `semayiGuncelle`, `testIcinSifirla`.

## Kimle konuşur?

- Çağırdıkları: Node `fs`, `path`; [baglanti.md](baglanti.md) → `sorgu`, `islem`, `metinCalistir`, `veritabaniAdi`.
- Onu çağıran: yalnız [index.md](index.md)'deki `baslat()` — `EE_DB_SIFIRLA=1` ise önce `testIcinSifirla()`, her açılışta
  `semayiGuncelle()`. `baslat`'ı [../index.md](../index.md) sunucu açılırken çağırır.
- `EE_DB_SIFIRLA=1`'i `testler/tumtest.sh` her test paketi için verir (sunucu `egitimevi_test` ile açılır;
  `testler/test-ayarlari.js` test ayar dosyasında veritabanı adını `testAd` ile değiştirir).
- Tablolar: `sema_surumleri` (kendisi kurar) ve SQL dosyalarının dokunduğu her şey.

## Nasıl çalışır (adım adım)?

```
açılış (veri/index.js baslat)
  EE_DB_SIFIRLA=1 ? testIcinSifirla()  ── ad _test ile bitmiyor → HATA, sunucu açılmaz
  semayiGuncelle()
    CREATE TABLE IF NOT EXISTS sema_surumleri
    uygulanan = { 1, 2, …, 34 }
    dosyalar(): 001-ilk.sql … 035-okul-disk-siniri.sql
      035 uygulanmamış →  islem { metinCalistir(035 metni); INSERT sema_surumleri (35, '035-okul-disk-siniri.sql') }
                          "Şema uygulandı: 035-okul-disk-siniri.sql"
```

Yeni bir şema değişikliği eklemek:

1. Son numarayı bul (`ls sunucu/veri/sema`), bir sonrakini al: `036-kisa-ad.sql` (küçük harf, rakam, tire).
2. Dosyanın başına ne yaptığını ve nedenini yorumla yaz (öteki dosyalar gibi).
3. Veri varken de çalışacak biçimde yaz (`ALTER TABLE … ADD COLUMN … DEFAULT …`, eski satırları dolduran `UPDATE`).
4. Yeni tablo yedeğe girecekse [json-aktarim.md](json-aktarim.md)'deki `TABLOLAR`'a (SONA) ve `iceAktar`/`disaAktar`'a
   ekle; girmeyecekse neden girmediğini yaz.
5. Test: `tumtest.sh` şemayı sıfırdan kurar; gerçek veride denemek için bir kopya veritabanında sunucuyu aç.

## Dikkat!

- **Eski dosya değişmez, numara tekrar edilmez.** Aynı numarayla iki dosya olursa (ör. iki kişi aynı anda `036-…` yazdı):
  ilk açılışta ikisi de sırayla çalışır, ikincisinin `INSERT`'i birincil anahtara takılır, o dosyanın işlemi geri alınır
  ve sunucu açılmaz; sonraki açılışta numara "uygulanmış" göründüğü için ikinci dosya SESSİZCE ATLANIR ve hiç uygulanmaz.
  Grup arkadaşı da GitHub'dan dosya yükleyebildiği için yeni şema dosyası eklemeden önce son numarayı yeniden kontrol et.
- **Kalıba uymayan ad sessizce yok sayılır:** `036_yeni.sql`, `036-Yeni.sql`, `36-yeni.sql` hiç çalışmaz, uyarı da çıkmaz.
- **Dosyada `BEGIN`/`COMMIT` ya da işlem içinde çalışamayan komut olmamalı** (`CREATE INDEX CONCURRENTLY`, `VACUUM`):
  dosya zaten bir işlemin içinde çalışır. Bugünkü 35 dosyada böyle bir komut yok.
- **15 saniye sınırı:** her bağlantıda `statement_timeout=15000` var ([baglanti.md](baglanti.md)). Büyük bir canlı tabloda
  tek komutu 15 sn'yi aşan bir göç (ör. milyonlarca satırı güncelleyen `UPDATE`) kesilir ve sunucu açılmaz. Böyle bir iş
  gerekirse komutu parçalara böl ya da dosyanın başında `SET LOCAL statement_timeout = …` kullan (yalnız o işlemi etkiler).
- **Kurallara aykırı eski veri sunucuyu durdurmamalı:** 031'den beri tekil indeks kurulamayan durumlar (ör. aynı T.C.'li
  iki öğrenci) şema dosyasında yakalanıp atlanır ve açılışta [index.md](index.md)'deki `cakismaRaporu` pencereye yazar.
  Yeni bir kısıt eklerken aynı yolu izle: eski veride ihlal varsa sunucu açılmaz hâle gelmesin.
- **`testIcinSifirla` yalnız ada bakar:** koruma veritabanı adının `_test` ile bitmesidir. Gerçek veritabanına asla
  `_test` ile biten bir ad verme; `EE_DB_SIFIRLA=1`'i gerçek ayarlarla hiç verme (ad korur ama alışkanlık olmasın).
- **İki süreç aynı anda açılırsa** ikisi de aynı dosyayı uygulamaya kalkabilir; ikincinin `INSERT`'i birincil anahtara
  takılır ve o süreç açılmaz. Tek sunucu sürecinde sorun yok.

## Testleri

- Her test paketi (`testler/tumtest.sh`) sunucuyu `EE_DB_SIFIRLA=1` ile açar: `testIcinSifirla` + bütün şema dosyalarının
  001'den sırayla uygulanması her pakette yeniden sınanır. Bir şema dosyası bozuksa sunucu açılmaz ve bütün paketler kalır.
- `testler/test-ayarlari.js` — test ayar dosyasını `testAd` (adı `_test` ile biten) veritabanıyla yazar; `testAd` yoksa
  ya da `_test` ile bitmiyorsa durur.
- Sıfırlama korumasının (`_test` ile bitmeyen adda hata) ayrı bir testi yok; aynı ada bakan denetim
  `araclar/yuk-testi.js`'te de var.
- Elle: yeni bir şema dosyası ekleyip sunucuyu aç → pencerede "Şema uygulandı: …" görülür; ikinci açılışta görülmez.

## Son durum

- Dosya `acefabc commit 1` (2026-08-28) ile geldi, `8b95a19 commit 10` (2026-08-28, PostgreSQL'e geçiş) ile bugünkü hâlini
  aldı; o günden beri değişmedi. Şema dosyaları ise sürekli eklendi: en son `035-okul-disk-siniri.sql`.
- Küçük bir yorum farkı: dosyanın baş yorumu örnek olarak `002-sinav-alanlari.sql`'den söz eder; böyle bir dosya yok,
  002 numaralı dosya `002-hiz.sql`. Düzenek bundan etkilenmez; kod değiştirilmedi.
- Açık iş yok. Planlı işlerin çoğu (Çalışan olarak ekleme, Sistem, Paneller, Destek, Optimizasyon + saklama süreleri,
  Yıl geçişi, Eğitim içerikleri …) yeni şema dosyaları getirecek; düzenek değişmeyecek.
