# testler/test-quiz-metin.js

Quizin saf kurallarını (`sunucu/yardimci/quiz.js`) ve ön yüzün quiz metinlerini (`public/js/parcalar/14c-quiz.js`) sunucusuz,
veritabanısız ve tarayıcısız deneyen birim test paketi: "Metinden ekle" ayrıştırıcısı, quiz doğrulaması, puan, sunucuda işleyen
süre ve öğrenciye/öğretmene yazılan kural cümleleri (78 denetim).

## Bu dosya ne yapar?

Quizin asıl kuralları veritabanına ve saate dokunmayan saf işlevlerdedir ([../sunucu/yardimci/quiz.md](../sunucu/yardimci/quiz.md)):
öğretmenin Word'den yapıştırdığı metni sorulara ayırmak, kaydedilen quizi doğrulamak, puanlamak ve bir denemenin "şu anki"
hâlini (hangi soru kapandı, deneme bitti mi, neden) hesaplamak. Bunlar sunuculu pakette ([test-quiz.md](test-quiz.md)) uçlar
üzerinden de denenir; ama orada her ince durumu kurmak pahalıdır. Bu paket işlevleri doğrudan çağırır, her köşeyi saniyenin
küçük bir kesrinde tarar:

- yapıştırma biçiminin çeşitleri (numara ve şık biçimleri, çok satırlı soru, öncüller, "3.5 kg" gibi soru sanılmaması gereken
  satırlar, Word'ün görünmez karakterleri ve uzun tiresi), satır numaralı Türkçe hatalar ve hata listesinin sınırı;
- doğrulamanın her sınırı (100 soru, 1000/300 karakter, 2–10 şık, süreler) ve **sessiz kırpma olmaması**;
- puanın kuralları (eşit ağırlık, çok doğrulu soruda kümenin birebir aynı olması, açık uçlu puansız);
- süre zinciri (soru başına sürede sıradaki soru öncekinin bittiği anda başlar, 3 sn pay, son teslim + 10 dk, ödev kapanınca).

Son bölümde ön yüz dosyası `14c-quiz.js` küçük taklitlerle bir `vm` bağlamında çalıştırılır ve öğrenciye/öğretmene yazdığı kural
cümleleri (son tarihsiz ödevde sonuç ne zaman açılır, süresiz quizde "süre işler" denmemesi, "Tekrar aç" uyarısı) denetlenir.
Tamamı yaklaşık 0,2 saniye sürer.

## İçinde neler var?

### Yardımcılar

- `Q` — `require('../sunucu/yardimci/quiz')`.
- `kontrol(ad, sart, detay)`; `J` — `JSON.stringify` (kırpmasız); `c(n)` — `String.fromCharCode(n)` (görünmez karakter yazmak
  için); `mesajlar(r)` — ayrıştırıcı sonucundaki hata iletileri.

### 1) Yapıştırma biçimi (10)

- Örnek metin: çok doğrulu soru (`*A) 2`, `B) 4`, `C) *7`, `D) 9`; sorunun ikinci satırı "(birden çok doğru olabilir)"),
  `Cevap: Doğru`'lu soru, şıksız soru. Beklenen: 3 soru, hata yok; şıklar `[2 doğru, 4, 7 doğru, 9]` (yıldız harften önce de
  sonra da olur); soru metni ikinci satırı yeni satırla alır; ikinci soru `dy` ve `dogru: true`; üçüncü `acik`, şıksız.
- Ayrıştırılan sorular `quizDogrula`'dan geçer; `dy` sorusunun şıkları `Doğru` (doğru) / `Yanlış`.
- `1.`, `2-`, `3)` numaraları ve `a)`, `*b.` şıkları kabul; `Cevap: y`, `CEVAP: YANLIŞ` → yanlış; `cevap - dogru`, `Cevap: D.` →
  doğru; hata yok.
- `I.` / `II.` öncülleri şık sayılmaz (soru metnine eklenir); "3.5 kg elmanın" ve "1-2 tanesi çürük mü?" satırları yeni soru
  sayılmaz (nokta ve tireden sonra rakam).

### 2) Word'den gelen karakterler (2)

- BOM, bölünmez boşluk, sıfır genişlikli boşluk, yumuşak tire, geniş boşluk, yön işareti, `\r\n`, sekme, üst üste boş satırlar ve
  satır ayırıcı (U+2028) içeren metin → iki temiz soru ("Başkent neresidir?", şıklar "Ankara", "İstanbul", "Son soru").
- `quizMetinTemizle`: NUL ve denetim karakteri gider, dört satır sonu ikiye iner (çok satırlı kip); tek satır kipinde satır sonu
  boşluk olur; nesne `''`, sayı metne (`12` → `'12'`).

### 3) Satır hataları (14)

Bir metinde her hata türü (`r5`):

| Satır/soru | İleti |
|---|---|
| ilk sorudan önceki satır | "1. satır bir sorunun parçası değil; alınmadı." |
| doğru işaretsiz soru | "2. soruda doğru şık işaretli değil." |
| tek şıklı soru | "3. soruda en az 2 şık olmalı." |
| numarası olup metni olmayan soru | "4. sorunun metni boş." |
| `Cevap: belki` | "5. sorunun cevabı anlaşılamadı…" ile başlar |
| şıklı soruda `Cevap:` satırı | `6. soruda "Cevap:" satırı…` ile başlar |
| boş şık (`A) `) | "7. sorunun 1. şıkkı boş." |

Ayrıca: hatalı sorular listede kalır (7 soru; her hatanın sayısal `satir`'ı var); hatalar satır sırasıyla; yalnız boşluktan metin
tek hata, boş metin ve `null` sıfır soru; 105 soruluk metinden 100'ü alınır ve "En fazla 100 soru" bildirilir; 1001 karakterlik
soru ve 301 karakterlik şık bildirilir ama kırpılmaz (metin 1001 karakter kalır); ilk sorudan önceki iki satır (arada boş
satırla) tek iletide toplanır: "İlk sorudan önceki 2 satır (1–2. satırlar) bir sorunun parçası değil; alınmadı."; 150 000
satırlık çöp + bir soru + 500 anlaşılmayan satır → hata listesi `QUIZ_HATA_EN_COK + 1` = 51 öğe, ilki "önceki 150000 satır"
der, sonuncusu "Ve 451 sorun daha. Önce yukarıdakileri düzelt.".

### 3b) Word tiresi, 11. şık, tanınmayan şık, bütün şıklar doğru (6)

- `1–` ve `2—` (Word'ün uzun tireleri) ve `3 –` soru numarası sayılır: 3 soru, hata yok.
- `A)`–`K)` on bir şık: 11. şık (`K`) şık sayılır (10. şıkka eklenmez) ve "1. soruda en fazla 10 şık olabilir." hatası çıkar.
- `∗` (U+2217) ve `＊` (U+FF0A) yıldız sayılır.
- Şıkka benzeyen ama tanınmayan satırlar uyarı üretir: `A- bir` (soru metnine eklendi, soru açık uçlu kalır), şıklardan sonra
  `C- z` (önceki şıkka eklendi), ilk şıkkı `B)` olan soru.
- `I.`, `V.`, `X.` öncülleri ve "A-B arası 5 km" uyarı vermez.
- Bütün şıkları doğru soru: "1. soruda bütün şıklar doğru işaretli; en az bir şık yanlış olmalı."

### 4) Doğrulama ve sınırlar (19)

- Varsayılanlar: `sureTuru: 'yok'`, `sonucGorunum: 'teslim'`, `cikincaKapanir: false`, `toplamSn: null`; `dogru: false` olan
  `dy` sorusunda `Yanlış` şıkkı doğru.
- Sorusuz quiz (boş dizi ya da `sorular`'sız nesne) → "en az bir soru"; 101 soru red, 100 kabul; 1001 karakterlik soru tam olarak
  "1. sorunun metni en fazla 1000 karakter olabilir." ile red, 1000 kabul; 301 karakterlik şık red; 11 şık red, 10 kabul; tek
  şık red; iki şıklı iki doğrulu soru "2. soruda bütün şıklar doğru işaretli; en az bir şık yanlış olmalı." ile red (üç şıklı iki
  doğrulu kabul); doğrusuz soru "1. soruda doğru şık işaretli değil."; `dogru`'su seçilmemiş `dy`; bilinmeyen tür (`resim`) ve
  yalnız boşluk + sıfır genişlikli boşluktan metin ("1. sorunun metni boş.").
- Soru başına süre: `sureSn` yoksa, 9 ya da 601 ise red; 10 ve `'600'` (metin) kabul. Soru başına olmayan quizde `sureSn` yok
  sayılır (`null`).
- Bütün quiz: `toplamDk` yok, 181 ya da 1.5 → "1 ile 180 dakika"; 1 → `toplamSn` 60, 180 → 10800.
- Bilinmeyen `sureTuru` ve `sonucGorunum` red; `hemen` + `cikincaKapanir: true` kabul.
- On iki bozuk girdi (`null`, `undefined`, metin, sayı, iki dizi, `sorular` metin, `null`/sayı/metin sorular, `null` şık, nesne
  tür ve metin, nesne süre türü, metin şık listesi) → hepsi `{ hata }` döner, hiçbiri istisna atmaz.

### 5) Puan (5)

Dört soruluk sabit küme (`dy`, tek doğrulu, iki doğrulu, açık uçlu) ile `puanHesapla`:

- hepsi doğru → 3/3, `yuzde` 100, `acikUclu` 1, açık uçlunun sonucu `null`;
- iki doğrulu soruda fazladan yanlış şık → o soru yanlış; `dy` yanlış; toplam 1/3, `yuzde` 33;
- eksik küme yanlış; aynı şık iki kez seçilse tek sayılır;
- cevapsız her şey yanlış (0/3, `yuzde` 0);
- yalnız açık uçlu quizde `yuzde` `null`.

### 6) Sunucudaki süre (11)

Üç soru, her biri 10 sn, `denemeIlerlet` ile (anlar milisaniye; deneme 0'da başladı):

| Durum | Beklenen |
|---|---|
| şimdi 12 900 (süre bitti ama 3 sn pay içinde) | hiçbir soru kapanmadı |
| şimdi 13 001 | 1. soru `{ acilis: 0, kapanis: 10000 }` ile kapandı; 2. soru 10 000'de başladı sayılır |
| şimdi 40 000 (bağlantı kopuk kalmış) | üç soru kapandı, `soruSira` 4, bitiş 30 000, neden `sure` |
| 2. sorudan 20 000'de devam, şimdi 30 000 | hiçbir şey kapanmadı |
| son teslim + 10 dk = 15 000, şimdi 20 000 | 1. soru kapandı, bitiş 15 000, neden `teslim` |
| bütün quiz 60 sn: şimdi 62 999 / 63 001 | önce sürüyor; sonra bitiş 60 000, neden `sure` |
| bütün quiz 600 sn, son teslim 100 000, şimdi 104 000 | bitiş 100 000, neden `teslim` |
| süresiz, son tarihsiz, şimdi 9e12 | hiç bitmez |
| süresiz, `kapali: true`, şimdi 5000 | bitiş 5000, neden `sonuclandi` |
| bütün quiz 60 sn, `kapali: true`, şimdi 500 000 | bitiş 60 000, neden `sure` (süre kapanmadan önce dolmuştu) |
| soru başına, `kapali: true`, şimdi 15 000 | 1. soru `sure` ile kapandı, bitiş 15 000, neden `sonuclandi` |

### 7) Ön yüz metinleri — `14c-quiz.js` (11)

`vm.createContext` ile küçük bir sahte dünya kurulur: `IKONLAR`, `EYLEMLER`, `SAYFALAR` boş; `S.user` öğrenci; `esc` gerçek
kaçırma; `ik` boş; `tarihGun` → `'GÜN'`, `tarihSaat` → `'AN'`; `teslimGecti` → `false`; `yetkim` → `true`; `document` ve `window`
yalnız `addEventListener`/`querySelector` taklitleri; zamanlayıcılar gerçek. `public/js/parcalar/14c-quiz.js` bu bağlamda
olduğu gibi çalıştırılır, çıkan HTML etiketlerinden arındırılıp (`metinOf`) aranır.

- `quizGirisHtml` son tarihsiz ödevde "öğretmenin sonuçları açınca görünür" der, "son teslim" demez; son tarihli ödevde "son
  teslimden 10 dakika sonra açılır (GÜN" (açılış anıyla) ve "en geç son teslimden 10 dakika sonra" der.
- `quizBittiHtml` son tarihsiz ödevde "öğretmenin sonuçları açınca görünür" der, "son teslim" demez.
- `quizOdevSatiri` süresiz quizde "Tek hakkın var; ikinci kez çözülemez." der ve "süre işler" demez; bütün quiz süreliyse
  "başlayınca süre işler" der.
- Öğretmen (`S.user` öğretmene çevrilir): `quizOgretmenSatiri` son tarihli ödevde "son teslimden 10 dakika sonra açılır",
  son tarihsizde "sonuçları sen açınca görünür"; `quizAlani` (düzenleyici) "Son tarihi olmayan ödevde sonuçlar sen açınca ya da
  ödevi sonuçlandırınca görünür" yazar.
- `quizTekrarAcUyarisi`: sonuçlar kalıcı açıldıysa (`sonucAcildi` dolu) ve 3 öğrenciden 1'i başladıysa "2 öğrenci quizi
  başlatamaz" ve "yalnızca ödev yeniden açılır"; `sonucGorunum: 'hemen'` iken de aynı; `sonucAcildi` boşsa uyarı yok; herkes
  başladıysa uyarı yok.

Toplam 10 + 2 + 14 + 6 + 19 + 5 + 11 + 11 = 78. Sonunda `GECTI: 78   KALDI: 0`; `KALDI` varsa çıkış kodu 1.

## Kimle konuşur?

- **Modüller:** `sunucu/yardimci/quiz.js` ([../sunucu/yardimci/quiz.md](../sunucu/yardimci/quiz.md)) — `quizMetniAyristir`,
  `quizMetinTemizle`, `quizDogrula`, `puanHesapla`, `denemeIlerlet`, `QUIZ_HATA_EN_COK`; Node'un `vm`, `fs` ve `path`'i (ön yüz
  dosyasını okumak ve çalıştırmak için).
- **Koruduğu kod:** `sunucu/yardimci/quiz.js`'in tamamı (sunucu tarafında onu kullanan tek dosya
  [../sunucu/bolumler/quiz.md](../sunucu/bolumler/quiz.md)); ön yüzden
  [../public/js/parcalar/14c-quiz.md](../public/js/parcalar/14c-quiz.md)'nin `quizGirisHtml`, `quizBittiHtml`, `quizOdevSatiri`,
  `quizOgretmenSatiri`, `quizAlani`, `quizTekrarAcUyarisi` işlevleri.
- **Sunucu uçları, tablolar:** yok (sunucusuz).
- **Onu çalıştıran:** `testler/tumtest.sh`, sunucusuz paketler döngüsünde `test-uygulama-surum`'dan sonra, `test-gizli-dosyalar`'dan
  önce.

## Nasıl çalışır (adım adım)?

```
Q = require(sunucu/yardimci/quiz)
1)-3b) quizMetniAyristir(çeşitli metinler) ─► sorular + satır numaralı hatalar
4)     quizDogrula(çeşitli quizler)        ─► { quiz } ya da tek cümlelik { hata } ; bozuk girdide istisna yok
5)     puanHesapla(4 soru, seçimler)       ─► doğru / puanlı / yüzde
6)     denemeIlerlet(süre türü, an, son teslim, kapalı) ─► kapananlar, sıra, bitiş, neden
7)     vm bağlamı (taklitler) ─► 14c-quiz.js çalışır ─► HTML'den metin ─► kural cümleleri
GECTI / KALDI
```

Dosya baştan sona eşzamanlıdır (bekleme yok); her denetim bir öncekinden bağımsızdır, 7. bölümde yalnız `S.user` ve
`S._acikOdev…` değerleri sırayla değiştirilir.

## Dikkat!

- **Yakalayıcı yok.** Gövde düz koddur; beklenmeyen bir istisna (ör. `14c-quiz.js` yüklenirken bağlamda olmayan bir genel ada
  dokunursa `ReferenceError`) süreci Node'un hata çıktısıyla düşürür: `GECTI:` satırı basılmaz, `tumtest.sh` "PAKET
  CALISMADI" yazar.
- **7. bölüm ön yüz dosyasının yükleme anına bağlı.** `14c-quiz.js` yüklenirken yalnız taklit edilen adları (`IKONLAR`,
  `EYLEMLER`, `SAYFALAR`, `S`, `esc`, `ik`, `tarihGun`, `tarihSaat`, `teslimGecti`, `yetkim`, `document`, `window`,
  zamanlayıcılar) bulabilir. Dosyaya yükleme anında ya da denenen işlevlerin içinde yeni bir genel ad (ör. başka bir parçanın
  işlevi) eklenirse taklit listesine de eklenmeli.
- **Metinler harfi harfine aranır.** Ön yüzdeki bir cümlenin yazımı değişirse (anlamı aynı kalsa bile) 7. bölüm kalır; bu
  bilerek böyle: öğrenciye yanlış kural söylenmesin.
- **Süre anları paysızdır.** `denemeIlerlet`'in 3 sn payı yalnız "kapanmalı mı" kararında kullanılır; dönen `kapanis` ve
  `bitis` gerçek anlardır (10 000, 30 000, 60 000). Yeni bir süre denetimi yazarken bunu karıştırma.
- **Büyük metin denemesi:** 150 000 satırlık metin bellekte kurulur (yaklaşık 300 KB); paket yine de 0,2 saniye civarında
  biter.
- **Denenmeyenler:** açık uçlu cevabın 2000 karakter sınırı (`QUIZ_SINIR.cevap`; sunucuda, [test-quiz.md](test-quiz.md)),
  `quizTamSayi` ve `quizDyDegeri`'nin bütün yazım çeşitleri (ör. "yanliş", "yanlıs"), ayrıştırıcıda `Cevap:`'tan sonra gelen şık
  satırı, ön yüzün öteki işlevleri (quiz ekranının çizimi, sayaç, sekme algılama) — bunlar tarayıcı ister.

## Testleri

- Bu dosyanın kendisi testtir; `testler/tumtest.sh` her tam koşuda (sunucusuz paketler arasında) çalıştırır. Aynı kurallar uçlar
  üzerinden [test-quiz.md](test-quiz.md)'de (oluşturma sınırları, "Metinden ekle" önizlemesi, puan, süre) denenir.
- Elle (proje kökünde; sunucu gerekmez):

  ```
  node testler/test-quiz-metin.js
  ```

- 3 Ekim'de bu belge için çalıştırıldı: `GECTI: 78   KALDI: 0`, çıkış 0, yaklaşık 0,2 saniye; bölüm sayıları yukarıdaki gibi
  (10, 2, 14, 6, 19, 5, 11, 11).

## Son durum

- `git log`: tek commit. Dosya `3b8fd36 commit 519` (2026-09-27, quiz özelliği; `sunucu/yardimci/quiz.js` ve `14c-quiz.js` ile
  aynı commit) ile 285 satır olarak eklendi ve o günden beri değişmedi. Koruduğu iki dosya da o günden beri değişmedi.
- Bilinen açıklar (kod değiştirilmedi): yakalayıcı olmaması.
- Planlı işlerden bu dosyayı etkileyecekler:
  - **"Düzenleyiciler"** (onaylı: quiz soru düzenleyicisi — soruya resim, basit matematik yazımı, soru bankası) — `quizDogrula`
    yeni alanları öğrenecek; 4. bölüme o alanların sınırları ve bozuk hâlleri eklenmeli.
  - **"Anket düzenleyici … quiz sorularını Excel'den aktarma"** ve **"Sınav: formüllü ölçüm … quiz sorularını Excel'den aktarma"**
    — metin ayrıştırıcısının yanına bir tablo ayrıştırıcısı gelecek (kapsamı kullanıcıya soruldu); onun da burada sunucusuz
    denenmesi uygun.
  - **"Çok dil"** — ön yüz metinleri `c('…')` katalog işlevinden geçecek (Türkçe kaynak metin anahtar olarak kalır). `14c-quiz.js`
    `c()`'yi kullanmaya başlarsa 7. bölümün `vm` bağlamına bir `c` taklidi (metni aynen döndüren) eklenmeli, yoksa bölüm
    `ReferenceError` ile durur.
