# sunucu/bolumler/quiz.js

Ödevin quizi (`/api/assignments/<id>/quiz...`): öğretmenin quizi yazması/kilidi, öğrencinin tek denemesi, sunucuda işleyen
süre, puan, sonuçların ne zaman açılacağı, sekme kaydı ve dakikalık temizlik.

## Bu dosya ne yapar?

Öğretmen bir ödeve isteğe bağlı bir quiz ekleyebilir: Doğru/Yanlış, çoktan seçmeli (bir ya da birden çok doğru şık) ve
açık uçlu sorular. Süre üç türlü olabilir: süresiz, soru başına (sorular sırayla gelir, geri dönülmez) ya da bütün quiz
için. Sonuçlar ya son teslimden sonra ya da öğrenci bitirir bitirmez açılır; öğretmen isterse sonuçları erken de açabilir.

Bu dosyanın kendi yolu yok: bütün istekler `/api/assignments` üzerinden gelir ve [odev.md](odev.md) onları buraya
devreder (öğrenci yolları rol kapısından ÖNCE, öğretmen yolları ödevin sahibi denetiminden SONRA). Bu yüzden "Ödevler
bölümü kapalı" (`ozellikKapali: 'odev'`) ve "geçmiş yıl" (409) kapıları da buraya `assignments` yolundan gelir.

En önemli kaygı kopya: doğru şık bilgisi sonuç açılmadan öğrenciye hiçbir yoldan gitmemeli; süre istemcide değil
sunucuda işlemeli (bağlantı kopsa da durmaz); tek hak olmalı (aynı anda iki "Başlat" iki deneme açmamalı); sonuçlar bir kez
açıldıysa (doğru cevaplar dağıldıysa) quiz yeniden başlatılamamalı.

Saf hesaplar (metin ayrıştırma, doğrulama, puan, süre ilerletme) `sunucu/yardimci/quiz.js`'tedir; bu dosya onları
veritabanı, istek ve saatle birleştirir.

## İçinde neler var?

### Kavramlar

- **Quiz ayarları** (`quizler`): `sureTuru` — `'yok'` (süresiz), `'soru'` (soru başına, her sorunun `sureSn`'si 10–600),
  `'quiz'` (bütün quiz, `toplamDk` 1–180); `cikincaKapanir` — sekmeden çıkınca o soru kapanır; `sonucGorunum` — `'teslim'`
  (son teslim + 10 dk sonra; varsayılan) ya da `'hemen'` (öğrenci bitirince); `sonucAcildi` — sonuçların kalıcı açıldığı an.
- **Soru türleri**: `dy` (Doğru/Yanlış; "Doğru" ve "Yanlış" şıklarıyla saklanır), `coktan` (2–10 şık, en az bir doğru bir
  yanlış; birden çok doğru varsa `coklu`), `acik` (şıksız, puansız). En çok 100 soru; soru metni 1000, şık 300, açık uçlu
  cevap 2000 karakter (`yardimci/quiz.js` `QUIZ_SINIR`). Metinler sessizce kırpılmaz, sınır aşılırsa hata.
- **Deneme** (`quiz_denemeleri`): öğrenci başına TEK satır: `baslama`, `bitis`, `bitisNedeni` (`ogrenci`, `sure`,
  `teslim`, `sonuclandi`, `cikis`; şemadaki CHECK bu beşini kabul eder), `soruSira`, `soruBaslama`, `cikisSayisi`, `cikisSn`,
  `dogru`, `puanli`, `sonucBildirildi`.
- **Puan**: eşit ağırlık; çok doğrulu soruda seçilenler doğru kümeyle BİREBİR aynı olmalı; cevapsız puanlı soru yanlış;
  açık uçlu puana girmez. `yuzde = dogru / puanli`.

### Sabit

- `TESLIM_PAYI_MS` — 10 dakika: son teslimden önce başlamış deneme son teslimden en çok 10 dakika sonrasına kadar sürebilir;
  "son teslimden sonra" seçili quizin sonucu da son teslim + 10 dk'da açılır. (Ayrıca `Q.QUIZ_PAY_MS` = 3 sn: sunucuya geç
  ulaşan cevap için pay.)

### Öğrencinin uçları (`ogrenciUcu(k)`; `odev.js` yalnız rol `student` iken buraya verir)

Her uçta: ödev yoksa ya da öğrenciye verilmemişse 404 "Ödev bulunamadı"; ödevde quiz yoksa 404 `{ quizYok: true }`.

- **`GET /api/assignments/<id>/quiz`** — durum. Başlamadıysa yalnız özet (soru metni YOK) + `baslatabilir`/`engel`. Cevap
  (`ogrenciDurumu`): `{ quiz: { sureTuru, toplamSn, toplamDk, cikincaKapanir, sonucGorunum, soruSayisi, acikUcluSayisi,
  puanliSayisi, soruSureToplami }, simdi, sonTeslim, sonucAcilis, durum: 'baslamadi'|'devam'|'bitti', baslatabilir, engel,
  deneme: { baslama, bitis, bitisNedeni, sonAn, soruSira, soruBaslama, soruBitis, cikisSayisi, cikisSn }, sorular,
  sonucAcik, sonuc: { dogruSayisi, puanliSayisi, acikUcluSayisi, yuzde } }`. Devam ederken `sorular` doğru bilgisi OLMADAN
  gelir (soru başına sürede yalnız o anki soru); bitti ve sonuç açıksa bütün sorular `dogruSecenekler` ve `dogruMu` ile.
- **`POST …/quiz/basla`** — başlat ya da kaldığı yerden devam. Hız sınırı: 10 dakikada 30 (429). Deneme yoksa
  `baslatmaEngeli`: "Ödev sonuçlandırıldı; quiz kapandı.", "Quiz 05.10.2026 08:00 tarihinde açılacak.", "Son teslim geçti;
  quiz başlatılamaz.", "Quizin sonuçları açıklandı; artık başlatılamaz." → 400 `{ baslatilamaz: true }`. Deneme açılınca
  ödev de "açıldı" sayılır (`depo.odevler.acildi`). Cevap güncel durum.
- **`POST …/quiz/cevap`** — gövde `{ soruId, secilenler: [şıkId], metin }`. Hız sınırı: 10 dakikada 600. Soru yoksa 404;
  açık uçluda metin 2000'i geçerse 400; seçmelide `secilenler` dizi değilse, şık bu sorunun değilse ya da tek doğrulu soruda
  birden çok şık seçildiyse 400. Deneme yoksa 400 "Quiz başlamadı."; deneme bitmişse, soru başına sürede başka soruya
  geçilmişse ya da soru kapanmışsa 409 `{ kapandi: true, durum }` (güncel durumla; istemci yeniler). Cevap
  `{ kaydedildi, soruId }`.
- **`POST …/quiz/sonraki`** — gövde `{ soruId }`, yalnız soru başına sürede (değilse 400 "Bu quizde sorular arasında
  serbestçe geçilir."). `soruId` o anki soru değilse (süre dolup zaten geçildiyse) hiçbir şey yapmadan güncel durum döner.
  O anki soru kapanır (`gecildi` ya da süresi dolduysa `sure`); son soruysa deneme biter.
- **`POST …/quiz/bitir`** — denemeyi bitirir (`ogrenci`); zaten bittiyse dokunmaz. Cevap güncel durum.
- **`POST …/quiz/odak`** — gövde `{ sure: saniye, soruId }`: öğrenci sekmeden/uygulamadan ya da quiz sayfasından çıkıp
  döndü. Hız sınırı: 10 dakikada 120. `sure` sayı değilse 400 "Süre okunamadı.". 2 sn'den kısa çıkış ve deneme bittikten
  sonra başlayan çıkış sayılmaz; süre denemenin geçen süresini aşamaz. `cikincaKapanir` açıksa: soru başına sürede o anki
  soru (çıkıştan önce açıldıysa) kapanır ve sonrakine geçilir; serbest modda ekrandaki soru (`soruId` uydurmaysa en son
  cevaplanan açık soru, o da yoksa ilk açık soru) kapanır; bütün sorular kapandıysa deneme `cikis` nedeniyle biter. Cevap
  güncel durum + `{ cikisSayildi, kapananSoru }`.
- Başka yol/yöntem: 404 "Böyle bir adres yok".

### Öğretmenin uçları (`ogretmenUcu(k, a)`; ödevin sahibi ya da sahipsiz ödevde okulun müdürü)

- **`GET /api/assignments/<id>/quiz`** — `{ quiz }`: `ogretmenQuizi(a)` — quizin tamamı düzenleyiciye geri yüklenebilir
  biçimde, doğrularıyla (`dy` sorusunda `dogru`), ayrıca `sonucAcildi`, `sonucAcik`, `baslayan`, `biten`, `kilitli`
  (`baslayan > 0`). Quiz yoksa `{ quiz: null }`.
- **`POST /api/assignments/<id>/quiz`** — gövde `{ quiz }` yazar, `{ quiz: null }` kaldırır. `odev.ver` yetkisi (ödevin
  dersi) gerekir (403). `quizDogrula` hatası 400. Quiz satırı kilitlenir (`kilitle`), deneme sayısına bakılır: bir öğrenci
  bile başladıysa 409 `{ kilitli: true, baslayan }` "N öğrenci başladı; quiz artık değiştirilemez.". Cevap `{ quiz }`.
- **`GET …/quiz/ayrinti?ogrenci=<id>`** — bir öğrencinin cevapları: `{ ogrenci, quiz, durum, deneme, sonuc, sorular:
  [{ …, secenekler (doğrularıyla), dogruSecenekler, cevap, dogruMu, gecenSn, kapandi }] }`. Öğrenci ödevde değilse 404.
  Quiz yoksa 404 `quizYok`. Okurken denemenin saati ilerletilir (süresi dolduysa kapanır).
- **`POST …/quiz/sonuc-ac`** — sonuçları şimdi aç. `odev.sonuclandir` yetkisi gerekir. Açılış kalıcıdır; süren denemeler o
  an biter, bitirenlere "sonucu açıklandı" bildirimi gider. Cevap `{ quiz, biten, bildirilen }`.
- **`POST /api/assignments/quiz-metin`** (`metinUcu(k)`) — "Metinden ekle" önizlemesi: gövde `{ metin }` (boş 400, 300.000
  karakteri geçerse 400). Hız sınırı: öğretmen başına 10 dakikada 300 (yazmayı bırakınca 0,7 sn sonra istenir). Cevap
  `Q.quizMetniAyristir(metin)` → `{ sorular, hatalar }`.

### Dışa açılan işlevler (başka dosyalar için)

- `yeniOdevQuizi(govde)` — yeni ödevle gelen quiz: yoksa `{ quiz: null }`, varsa `quizDogrula` sonucu (`{ quiz }` ya da
  `{ hata }`). [odev.md](odev.md) ödev ile quizi tek işlemde yazar.
- `ogretmenQuizi(a)` — yukarıda.
- `ogrenciOzetleri(a)` — öğretmenin ödev ayrıntısındaki satırlar: önce süresi dolan denemeler kapanır; sonra
  `Map(ogrenciId → { durum, baslama, bitis, bitisNedeni, cikisSayisi, cikisSn, sonuc })`. Quiz yoksa `null`.
- `listeOzetleri(odevIdler)` — liste rozetleri: `Map(odevId → { soruSayisi, sureTuru, toplamSn, soruSureToplami, baslayan,
  biten })`.
- `ilerleyisOzetleri(ogrenciId, odevler)` — öğrencinin/velinin ilerleyiş ekranı: soru, şık, doğru bilgisi ve sekme kaydı
  YOK; puan yalnız sonuç açıkken. Açık denemeler önce kapatılır.
- `odevSonuclandi(a)` — ödev sonuçlandırıldı: açık denemeler biter; bitiren varsa açılış kalıcı olur (tek hak: "Tekrar aç"
  quizi bir daha başlatamaz); sonuç bildirimleri gider. Giden bildirim sayısını döner.
- `teslimSonuclariniSabitle(odevIdler | null)` — "son teslimden sonra" seçili ve son teslim + 10 dk geçmiş quizlerin açılışını
  kalıcı yapar. [odev.md](odev.md) son teslimi değiştirmeden önce çağırır.
- `acikDenemeleriKapat(odevIdler | null)` — açık denemelerden bitmesi gerekenleri kapatır: ödevi sonuçlanmış ya da quizin
  sonucu açılmış olanlar ve süresi dolmuş olanlar (bütün quiz süresi, soru başına sürede o anki sorunun süresi ya da son
  teslim + 10 dk; hangisi önce gelirse, üstüne 3 sn pay). Her aday kendi işleminde kilitlenip `ilerlet`'ten geçer; kapanan
  sayısını döner ve dokunduğu ödevler için `sonuclariBildir` çağırır.
- `sonuclariBildir(odevIdler | null)` — sonucu açılmış ve henüz bildirilmemiş her bitmiş deneme için öğrenciye (velisine
  kopya) "Matematik dersinden "Oran orantı" quizinin sonucu açıklandı." Tekillik `quiz_denemeleri.sonuc_bildirildi` ile.
- `quizTemizle()` — dakikalık iş: `acikDenemeleriKapat(null)` → `sonuclariBildir(null)` → `teslimSonuclariniSabitle(null)`.
- `sonucAcikMi(qz, a, d, simdi)` — bu öğrencinin sonucu açık mı: kendi denemesi bitmeden asla; `hemen` seçiliyse bitince;
  değilse `sonucGenelAcik`.
- `sonucGenelAcik(qz, a, simdi)` — öğretmen açtı (`sonucAcildi`), ödev sonuçlandı ya da (`teslim` seçiliyse) son teslim +
  10 dk + 3 sn geçti.
- `baslatmaEngeli(a, qz, simdi)` — başlatılamıyorsa Türkçe neden, yoksa `''`.
- `ogrenciUcu`, `ogretmenUcu`, `metinUcu`, `TESLIM_PAYI_MS`.

### Önemli iç işlevler

- `ilerlet(a, qz, sorular, d, simdi)` — denemenin saatini `Q.denemeIlerlet` ile ilerletir: süresi geçen sorular kapanır
  (`soruKapat(..., 'sure')`), soru sırası ilerler, süre ya da son teslim dolduysa ya da quiz kapandıysa (ödev sonuçlandı /
  sonuç açıldı) deneme biter.
- `denemeIsle(a, qz, sorular, ogrenciId, fn)` — İŞLEM içinde deneme satırını kilitler (`denemeBul(..., true)`), saati
  ilerletir, sonra `fn(d, simdi)`'yi aynı işlemde çalıştırır; deneme bu sırada bittiyse işlemden sonra sonuç bildirimi dener.
  Öğrencinin bütün yazan uçları bunu kullanır.
- `denemeyiBitir(a, qz, sorular, d, bitisMs, neden)` — soru başına sürede o anki soruyu kapatır, puanı hesaplar, denemeyi
  yazar.
- `acikDenemeleriBitir(a, qz)` — öğretmen quizi kapatınca (sonuçlandırma, sonuç açma) süren denemeler o an biter.
- `quizOzeti`, `sonucNesnesi`, `denemeGorunumu` (sekme kaydı yalnız öğrenciye ve öğretmene), `ogrenciSorusu` (sonuçlu
  değilse doğru bilgisi YOK), `ogrenciDurumu`, `teslimSonu`, `teslimleAcik`, `durumHatasi`, `cokluMu`, `tarihSaat`.

## Kimle konuşur?

- Çağırdıkları: `../http` → `bad`, `ok`, `sendJSON`; `../guvenlik` → `hizSinir`; `../ortak` → `clean`; `../veri` → `depo`,
  `islem`; `../yetki` → `yetkiVarMi` (`odev.ver`, `odev.sonuclandir`, ders kapsamıyla); `sunucu/yardimci/quiz.js` (`Q`) →
  `quizDogrula`, `quizMetniAyristir`, `quizMetinTemizle`, `puanHesapla`, `denemeIlerlet`, `QUIZ_SINIR`, `QUIZ_PAY_MS`;
  [odev.md](odev.md) (geç yükleme `odevModulu()`) → `odevBitisAni`, `odevBaslamaAni`.
- Depo ve tablolar: `depo.quiz` (`sunucu/veri/depo/quiz.js`, şema 029) → `quizler`, `quiz_sorulari`, `quiz_secenekleri`,
  `quiz_denemeleri`, `quiz_cevaplari` (bildirim adaylarında `odevler` ile birleşir): `bul`, `kilitle`, `sorulari`, `yaz`,
  `sil`, `denemeBul`, `denemeBaslat`, `denemeYaz`, `denemeSayisi`, `denemeSayilari`, `acikDenemeler`, `acikAdaylar`,
  `odevinDenemeleri`, `ogrencininDenemeleri`, `cevaplari`, `cevapYaz`, `soruKapat`, `kapaliSoruSayisi`, `ozetler`,
  `sonucAc`, `teslimAdaylari`, `bildirimAdaylari`, `bildirildi`. Ayrıca `depo.odevler.bul`, `acildi`;
  `depo.kullanicilar.bul`; `depo.genel.cokluBildir` → `bildirimler`.
- Onu çağıranlar:
  - [odev.md](odev.md) — `ogrenciUcu`, `metinUcu`, `ogretmenUcu`, `listeOzetleri`, `yeniOdevQuizi`, `ogretmenQuizi`,
    `ogrenciOzetleri`, `odevSonuclandi`, `teslimSonuclariniSabitle`;
  - `sunucu/bolumler/ilerleyis.js` — `ilerleyisOzetleri`; [okul.md](okul.md) — `listeOzetleri` (müdürün ders ödevleri);
  - `sunucu/index.js` — `quizTemizle()` dakikada bir.
- Ön yüz: `public/js/parcalar/14c-quiz.js` (öğrencinin quiz ekranı: `basla`, `cevap`, `sonraki`, `bitir`, `odak`; öğretmenin
  düzenleyicisi, "Metinden ekle", `ayrinti`, `sonuc-ac`), `public/js/parcalar/11-ogretmen-odev.js` (ödev ayrıntısında quiz).
- Android uygulaması kullanmaz.

## Nasıl çalışır (adım adım)?

### Bir öğrenci isteği (ör. `cevap`)

```
odev.js: segs[3] === 'quiz' && rol öğrenci ─► ogrenciUcu
  ödev bu öğrencinin mi, quiz var mı, soru/şıklar geçerli mi
  denemeIsle ─► islem {
       deneme satırı FOR UPDATE
       ilerlet: Q.denemeIlerlet(süre türü, başlama, soru sırası, son teslim + 10 dk, kapalı mı, şimdi)
                → süresi dolan sorular kapanır / deneme biter
       fn: deneme var mı, bitmedi mi, bu soru açık mı → cevapYaz
  }
  deneme bu arada bittiyse → sonuclariBildir
```

### Sonucun açılması

```
sonucGorunum = 'hemen'   : öğrenci bitirince kendi sonucu açık
sonucGorunum = 'teslim'  : son teslim + 10 dk (+3 sn) geçince herkese açık
her durumda              : öğretmen "Sonuçları aç" ya da ödevi sonuçlandırdı → açık
doğru cevaplar bir kez göründüyse → quizler.sonuc_acildi yazılır (KALICI):
     yeni başlatma yok, süren denemeler biter, son teslim ileri alınsa da kapanmaz
```

### Dakikalık iş (`quizTemizle`)

1. Süresi dolmuş açık denemeleri kapat (bağlantısı kopan öğrenci için de).
2. Açılan sonuçları bildir (bir kez).
3. Son teslim + 10 dk geçen "teslim" quizlerinin açılışını kalıcı yap.

## Dikkat!

- **Doğru şık sızmaz:** soru metni yalnız deneme başladıktan sonra gider; soru başına sürede yalnız o anki soru. Doğru
  bilgisi öğrenciye yalnız kendi denemesi bitip sonuç açılınca gider; `/api/progress`'e, ödev nesnesine ve veliye hiç gitmez
  (veli yalnız durum ve sonuç açılınca puan görür). Yeni bir görünüm eklersen `ogrenciSorusu`'ndaki `sonuclu` kuralına uy.
- **Süre sunucuda işler:** istemcinin saatine güvenilmez; denemenin hâli her okumada ve dakikalık temizlikte yeniden
  hesaplanır. Bir sonraki soru öncekinin süresinin bittiği anda başlamış sayılır (öğrenci dönmese de).
- **Tek deneme:** `denemeBaslat` `ON CONFLICT DO NOTHING` ile yazar; aynı anda gelen ikinci "Başlat" yeni satır açmaz.
- **Başlatma ile öğretmenin değişikliği yarışı:** deneme satırı (yabancı anahtarla) quiz satırının kilidini bekleyerek
  yazılır; öğretmenin kilitli yazması biterse başlatma ondan sonra quizi YENİDEN okur. Böylece öğrenci eski soruları almaz;
  sonuçlar tam o an açıldıysa deneme hemen biter. Öğretmen tarafında da yazma `kilitle` + deneme sayısı aynı işlemde:
  öğrenci başladıysa quiz değiştirilemez (409).
- **Açılış kalıcı:** doğru cevapları gören olduysa son teslim ileri alınsa ya da ödev "Tekrar aç"ılsa bile quiz yeniden
  başlatılamaz (kopyaya karşı; mesaj bunu söyler). `ogrenciDurumu` açılışı dakikalık temizliği beklemeden kalıcı yapar.
- **Öğretmen quizi kapatınca süren denemeler biter:** yoksa bitirenlerin gördüğü doğru cevaplarla öbürleri cevap düzeltirdi.
- **Sekme kaydı caydırıcıdır, kesin değildir:** algılama tarayıcıda yapılır (`visibilitychange`, quiz sayfasından ayrılma);
  değiştirilmiş bir istemci hiç bildirmeyebilir. Sunucu yalnız sayar ve "çıkınca kapanır"ı uygular; soru başına sürede
  kapanacak soruyu istemcinin `soruId`'sinden değil kendi kaydından seçer.
- **Saat dilimi:** son teslim ve başlama anı `odev.js`'teki gibi sunucunun yerel saatiyle hesaplanır (sunucu Türkiye
  saatinde çalışmalı). `tarihSaat` de yerel saatle yazar.
- **Döngüsel yükleme:** `odev.js` bu dosyayı, bu dosya `odev.js`'i geç yükler (`odevModulu()`); başa düz `require` yazma.
- `ogrenciUcu`'da `GET` dışındaki yöntemler yalnız POST; alt yol tanınmazsa 404 döner (ödev bölümüne düşmez).

## Testleri

- `testler/test-quiz.js` — oluşturma ve doğrulama sınırları, "Metinden ekle", doğru şıkkın sızmaması (soru ucu,
  `/progress`, `GET /assignments/:id`, veli), kilit, puan ve tek deneme (aynı anda iki "Başlat"), sonuç görünürlüğü
  (öğretmen açar, "hemen", sonuçlandırınca), soru başına süre (sırayla, geri dönülmez), bütün quiz süresi ve dakikalık
  temizlik, başlama anı ve son teslim + 10 dk, sekme kaydı (2 sn altı sayılmaz) ve "çıkınca kapanır", yetkiler (başka
  öğrenci/öğretmen, veli, müdür), özellik kapalı 403, ödev silinince quizin gitmesi, arşiv yılında 409. Süreyi geri almak ve
  temizliği çağırmak için yalnız adı `_test` ile biten veritabanına depo üzerinden bağlanır.
- `testler/test-quiz-metin.js` (sunucusuz) — `yardimci/quiz.js`: ayrıştırıcı, doğrulama, puan, süre zinciri, ön yüz metinleri.
- `testler/test-ozellikler.js` — ödev kapalıyken quiz uçlarının hepsi 403 `ozellikKapali: 'odev'`.
- Elle: öğretmenle ödev verirken "Quiz ekle"den soru başına 30 sn'lik iki soru ekle; öğrenciyle quizi başlat, bir soruda
  bekleyip sürenin kendiliğinden geçtiğini gör; öğretmenle "Sonuçları aç"; öğrenci doğru cevapları görür.

## Son durum

- Dosya `3b8fd36 commit 519` (2026-09-27, quiz) ile eklendi ve o günden beri değişmedi: bütün öğrenci ve öğretmen uçları,
  dakikalık temizlik, sonuç kalıcılığı, sekme kaydı, "Metinden ekle" önizlemesi.
- Açık iş yok. Sıradaki işlerden "Optimizasyon + saklama süreleri (… quiz 1 yıl …)" quiz denemelerinin ve cevaplarının
  saklama süresini getirecek.
- Planlı (kullanıcının 28 Eylül akşamı kararları): "Düzenleyiciler" işi (onaylı) quiz soru düzenleyicisini getirecek —
  soruya resim, basit matematik yazımı (üs, kesir, kök) ve soru bankası (soruyu sakla, yeni quize seç); quiz açıklaması da
  ortak yazı düzenleyiciyi kullanacak. "Anket düzenleyici" işinde quiz sorularını Excel'den aktarma da var (A sütunu soru,
  sonrakiler şıklar, doğru şık işaretli); kapsamı kullanıcıya soruldu, cevap bekleniyor. Bugünkü "Metinden ekle"
  (`metinUcu`) yapıştırma yolu bunlardan ayrıdır.
