# sunucu/yardimci/quiz.js

Quizin saf hesapları: yapıştırılan metni sorulara ayırma, öğretmenin gönderdiği quizi doğrulama, puan ve sunucuda işleyen
süre (veritabanına, isteğe, saate dokunmaz).

## Bu dosya ne yapar?

Quiz bölümü ([../bolumler/quiz.md](../bolumler/quiz.md)) veritabanı, istek ve saatle uğraşır; asıl KURALLAR burada, test
edilmesi kolay saf işlevlerdedir:

- Öğretmen Word'den ya da PDF'ten soruları "Metinden ekle" kutusuna yapıştırır → `quizMetniAyristir` bunları soru ve şıklara
  ayırır, satır numaralı Türkçe hatalar üretir.
- Öğretmen quizi kaydeder → `quizDogrula` her sınırı denetler; metinler sessizce kırpılmaz, sınırı aşan metin hata verir.
- Öğrenci bitirir → `puanHesapla` eşit ağırlıkla puanlar.
- Süre sunucuda işler, bağlantı kopsa da durmaz → `denemeIlerlet` bir denemenin "şu anki" hâlini (kapanan sorular, bitiş anı
  ve nedeni) hesaplar.

`quizMetinTemizle`, `quizMetniAyristir` ve `quizDogrula` ES5 ile yazıldı (`var`, `function`): ön yüz aynı biçimi denetlemek
isterse birebir kopyalayabilir ya da sunucudaki `POST /api/assignments/quiz-metin` önizlemesini kullanır (bugün önizleme
ucunu kullanıyor). `puanHesapla` ve `denemeIlerlet` yalnız sunucuda çalışır, modern JS'tir.

## İçinde neler var?

### Sabitler

- **`QUIZ_SINIR`** — `soru` 100, `soruMetni` 1000, `secenek` 300 (şık metni), `secenekEnAz` 2, `secenekEnCok` 10, `cevap` 2000
  (açık uçlu cevap), `soruSureEnAz` 10 sn, `soruSureEnCok` 600 sn, `quizDkEnAz` 1, `quizDkEnCok` 180 dakika.
- **`QUIZ_TURLERI`** — `['dy', 'coktan', 'acik']` (Doğru/Yanlış, çoktan seçmeli, açık uçlu).
- **`QUIZ_SURE_TURLERI`** — `['yok', 'soru', 'quiz']` (süresiz, soru başına, bütün quiz).
- **`QUIZ_SONUC_GORUNUM`** — `['teslim', 'hemen']`.
- **`QUIZ_PAY_MS`** — 3000: sunucuya geç ulaşan cevap için gecikme payı.
- **`QUIZ_HATA_EN_COK`** — 50: önizlemede gösterilen en fazla sorun; sonrası "Ve N sorun daha. Önce yukarıdakileri düzelt."

### `quizMetinTemizle(s, cokSatir)`

Word/PDF'ten gelen kiri temizler: NFC; `\r\n` → `\n`; bölünmez boşluk, ince boşluklar (U+2000–200A, 202F, 205F, 3000) ve sekme →
boşluk; sıfır genişlikli karakterler, yön işaretleri (U+200B–200F, 202A–202E, 2060–2069), satır/paragraf ayırıcı, BOM ve yumuşak
tire → silinir; denetim karakterleri (satır sonu dışında) → silinir. `cokSatir` değilse satır sonları boşluğa döner. Her satırda
çift boşluk teke iner, uçlar kırpılır; üç ve daha çok satır sonu ikiye iner. Sayı gelirse metne çevrilir; dize değilse `''`.

### `quizDyDegeri(v)`

"Doğru", "dogru", "D" → `true`; "Yanlış", "yanlis", "yanliş", "yanlıs", "Y" → `false`; başka → `null`. Büyük/küçük harf ve
Türkçe `İ/I` doğru çevrilir; sondaki boşluk, nokta, ünlem atılır.

### `quizHepsiDogru(secenekler)` ve `quizTamSayi(v)`

- `quizHepsiDogru` — şık listesinin HEPSİ doğru mu (boş listede `false`). Hem ayrıştırıcı hem doğrulayıcı "bütün şıklar doğru
  işaretli; en az bir şık yanlış olmalı." hatası için kullanır: iki şıklı iki doğrulu soruda öğrenci "birden çok şık
  seçebilirsin" notundan cevabı çıkarabilirdi.
- `quizTamSayi` — `90` ya da `" 90 "` (metinde en çok 6 hane, çevresinde boşluk olabilir) → `90`; kesirli sayı, `"90dk"`,
  `"-5"` → `null`. Sayı olarak gelen tam sayı eksi de olsa kendisi döner (`-5` → `-5`); aralığı `quizDogrula` denetler.

### `quizMetniAyristir(metin)` → `{ sorular, hatalar }`

Yapıştırma biçimi:

```
1) Soru metni (sonraki satırlara taşabilir)
*A) doğru şık
B) yanlış şık
C) *doğru şık            ← yıldız şık harfinden sonra da olabilir
2) Güneş bir yıldızdır.
Cevap: Doğru             ← Doğru/Yanlış sorusu (Doğru | Yanlış | D | Y)
3) Açık uçlu soru        ← şıksız soru açık uçludur
```

- Soru satırı: 1–3 haneli numara + `)`, `.`, `-` ya da Word'ün uzun tiresi `–`/`—`. Nokta ve tireden sonra RAKAM gelemez
  ("3.5 kg", "1-2 arası" soru sanılmasın).
- Şık satırı: isteğe bağlı `*` + harf + `)` ya da `.` + isteğe bağlı `*` + metin. Word/PDF'in yıldız benzerleri (`∗`, `＊`, `✱`)
  düz yıldız sayılır. Sorunun İLK şıkkı `A` (ya da `a`) olmalı — "I. …", "II. …" öncülleri şık sanılmasın. Sonraki şıklar `A`–`J`
  arasında herhangi bir harf olabilir; `J`'den sonraki harf ancak sıradaki şıksa şık sayılır (11. şık "K)" ise "en fazla 10 şık"
  hatası çıkar). `Cevap:` satırından sonra şık gelmez.
- `Cevap:` satırı (`Cevap:`, `Cevap -` vb., büyük/küçük harf fark etmez) soruyu Doğru/Yanlış yapar (şıksızsa).
- Başka satır: son şıkka BOŞLUKLA (şık tek satırdır) ya da (şık yoksa) soru metnine YENİ SATIRLA eklenir. Şıkka BENZEYEN ama tanınmayan satırlar ("A- şık",
  "A: şık", ilk şıkkı B olan soru) yine eklenir ama uyarı üretir; "I." "V." "X." öncülleri ve "A-B arası" gibi yazılar uyarmaz.
  `Cevap:`'tan sonraki tanınmayan satır "anlaşılamadı".
- İlk sorudan önceki satırlar tek sorunda toplanır ("İlk sorudan önceki 3 satır (1–3. satırlar) bir sorunun parçası değil;
  alınmadı.").
- 100 sorudan sonrası alınmaz (tek hata).
- Sonra her soru denetlenir: boş/uzun soru metni, boş/uzun şık, 2'den az / 10'dan çok şık, doğru şık işaretsiz, bütün şıklar doğru
  (öğrenci "birden çok şık seçebilirsin" notundan cevabı çıkarabilirdi), çoktan seçmelide `Cevap:` satırı, anlaşılmayan Doğru/Yanlış
  cevabı. Hiç soru yoksa "Metinde soru bulunamadı. Her soru "1)" ya da "1." gibi bir numarayla başlamalı."
- HATALI SORU DA listede kalır (düzenleyicide düzeltilir).
- Dönen soru: `{ tur, metin, secenekler: [{ metin, dogru }], dogru (yalnız dy: true/false/null), satir }`. Hata:
  `{ satir, soru, mesaj }`, satıra göre sıralı, en çok 50 + "ve N sorun daha".

### `quizDogrula(q)` → `{ quiz }` ya da `{ hata }`

Girdi: `{ sureTuru, toplamDk, cikincaKapanir, sonucGorunum, sorular: [{ tur, metin, sureSn, dogru, secenekler: [{ metin,
dogru }] }] }`. İlk hatada durur, tek Türkçe cümle döner:

- nesne değil → "Quiz bilgisi okunamadı."; `sureTuru` boşsa `'yok'`, listede değilse hata; `'quiz'` ise `toplamDk` 1–180 tam sayı
  (`90` ya da `"90"`; `quizTamSayi`) → `toplamSn = dk × 60`;
- `sonucGorunum` boşsa `'teslim'`, listede değilse hata;
- 1–100 soru; her soru nesne, türü listede; metin (`quizMetinTemizle(…, true)`) boş değil ve ≤ 1000;
- `'soru'` süre türünde her sorunun `sureSn`'si 10–600;
- `dy`: `dogru` boolean olmalı → şıklar `[{ metin: 'Doğru', dogru }, { metin: 'Yanlış', dogru: !dogru }]`;
- `coktan`: 2–10 şık, her şık nesne, metni (tek satır) boş değil ve ≤ 300, en az bir doğru (`dogru === true`), hepsi doğru değil;
- `acik`: şıksız.

Başarıda `{ quiz: { sureTuru, toplamSn, cikincaKapanir (yalnız true ise true), sonucGorunum, sorular: [{ sira, tur, metin,
sureSn, secenekler }] } }`.

### `puanHesapla(sorular, secimler)`

`sorular: [{ id, tur, secenekler: [{ id, dogru }] }]`, `secimler: { soruId: [secenekId, …] }`. Açık uçlu puana girmez
(`null`). Puanlı soruda seçilen şıkların kümesi doğru şıkların kümesiyle BİREBİR aynıysa doğru; kısmi puan yok, fazladan bir
şık puanı sıfırlar, cevapsız yanlış. Dönen: `{ dogru, puanli, acikUclu, yuzde (tam sayıya yuvarlı; puanlı soru yoksa null),
sorular: { soruId: true|false|null } }`.

### `denemeIlerlet(g)`

Girdi: `{ sureTuru, toplamSn, sorular: [{ id, sureSn }] (sırayla), deneme: { baslama, soruSira, soruBaslama } (ms),
teslimSon (son teslim + 10 dk ya da null), kapali (ödev sonuçlandırıldı ya da sonuçlar açıldı), simdi }`.

Dönen: `{ kapananlar: [{ soruId, acilis, kapanis }], soruSira, soruBaslama, bitis (ms ya da null), neden: 'sure'|'teslim'|
'sonuclandi'|null }`.

## Kimle konuşur?

- Çağırdığı: hiçbir modül.
- Onu çağıran tek dosya: [../bolumler/quiz.md](../bolumler/quiz.md) (`const Q = require('../yardimci/quiz')`):
  `quizDogrula` (quizi yaz), `quizMetniAyristir` (`metinUcu`: `POST /api/assignments/quiz-metin`, öğretmen başına 10 dakikada
  300 istek, en çok 300 000 karakter; [../bolumler/odev.md](../bolumler/odev.md) yönlendirir), `quizMetinTemizle` (açık uçlu
  cevap), `puanHesapla` (sonuç, öğretmen tablosu), `denemeIlerlet` (okuma ve dakikalık temizlik), `QUIZ_SINIR`, `QUIZ_PAY_MS`.
- Tablolar: doğrudan yok; `quizler`, `quiz_sorulari`, `quiz_secenekleri`, `quiz_denemeleri` ve `quiz_cevaplari` satırlarını
  bölüm okuyup buraya düz nesne olarak verir.

## Nasıl çalışır (adım adım)?

`denemeIlerlet` — soru başına süre zinciri:

```
son = bütün quiz ise baslama + toplamSn, değilse ∞        (neden 'sure')
son = min(son, teslimSon)                                 (daha erkense neden 'teslim')

soru başına ise:
   sira, bas = deneme.soruSira, deneme.soruBaslama
   döngü: e = bas + sorunun sureSn'si
          e > son                     → dur (bu soru son'dan önce bitmiyor)
          simdi <= e + 3 sn           → dur (soru hâlâ açık)
          değilse soru kapandı: { soruId, acilis: bas, kapanis: e };  bas = e;  sira++
   bütün sorular kapandıysa → bitis = son sorunun kapanışı, neden 'sure'

simdi > son + 3 sn   → bitis = son, neden (sure ya da teslim)
kapali               → bitis = simdi, neden 'sonuclandi'
```

Bir sonraki soru öncekinin süresinin bittiği anda başlamış sayılır; öğrenci bağlantısız kaldıysa kaçırdığı sorular sırayla
kapanır.

## Dikkat!

- Doğru şık bilgisi bu dosyada hiçbir yerde "gizlenmez"; gizleme bölümün işidir: `sunucu/bolumler/quiz.js`'teki
  `ogrenciSorusu` öğrenciye şıkları yalnız `{ id, metin }` olarak verir, doğru şıklar (`dogruSecenekler`) ancak sonuç görünür
  olunca eklenir.
- `quizMetniAyristir` hatalı soruları da döndürür; önizleme ucu bunu olduğu gibi gönderir, kaydetmeden önce `quizDogrula` yine
  çalışır. Ayrıştırıcı ile doğrulayıcı aynı sınırları (`QUIZ_SINIR`) kullanır.
- Ayrıştırıcıda şık harfleri sıra denetlenmez: `A)`, `C)`, `B)` sırasıyla yazılmış şıklar üç şık olarak alınır.
- `quizDogrula` `dy` sorusuyla gelen `secenekler`'i yok sayar (şıklar `dogru`'dan üretilir); `acik` sorunun `secenekler`'i de
  yok sayılır.
- `denemeIlerlet` 3 sn payı hem soru kapanışında hem quiz/teslim bitişinde uygular; ama dönen `kapanis`/`bitis` anları paysız
  gerçek anlardır.
- Kapanan soru zinciri yalnız sure `'soru'` iken işler; `sureSn` eksikse 0 sayılır (anında kapanır). `quizDogrula` bunu
  önlediği için veritabanındaki quizlerde olmaz.

## Testleri

- `testler/test-quiz-metin.js` (sunucusuz; `tumtest.sh` sunucusuz paket listesinde; 78 denetim) — ayrıştırıcı (biçim, numara ve
  şık çeşitleri, çok satırlı soru, Word'ün görünmez karakterleri, satır hataları, 100 soru sınırı), doğrulama (sınırların sessizce
  kırpılmaması), puan (eşit ağırlık, çok doğrulu soruda birebir küme, açık uçlu puansız), süre (soru başına zincir, 3 sn pay,
  bütün quiz, son teslim + 10 dk) ve `public/js/parcalar/14c-quiz.js`'in kural ve uyarı metinleri (`vm` içinde çalıştırılarak).
- `testler/test-quiz.js` (sunucu ister) bu işlevleri uçlar üzerinden dener (bkz. [../bolumler/quiz.md](../bolumler/quiz.md)).
- Elle: `node testler/test-quiz-metin.js`.

## Son durum

- Dosya `3b8fd36 commit 519` (2026-09-27, quiz) ile eklendi ve o günden beri değişmedi.
- Açık iş yok.
- Planlı: "Düzenleyiciler" işi quiz soru düzenleyicisini getirecek (soruya resim, basit matematik yazımı, soru bankası) —
  `quizDogrula` yeni alanları (resim, biçimli metin) öğrenecek. "Anket düzenleyici" ve "Sınav: formüllü ölçüm" işlerinde quiz
  sorularını Excel'den aktarma var (A sütunu soru, sonrakiler şıklar, doğru şık işaretli; kapsam kullanıcıya soruldu); bu
  ayrıştırıcının yanına bir tablo ayrıştırıcısı gelecek (`tablo-oku.js` ile). "Optimizasyon + saklama süreleri" quiz denemelerini
  1 yıl saklayacak.
