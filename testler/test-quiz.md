# testler/test-quiz.js

Ödevin quizini (`/api/assignments/<id>/quiz…`) öğretmen, iki öğrenci, veli, başka öğretmen ve müdürle uçtan uca deneyen en
büyük sunuculu quiz paketi: oluşturma sınırları, doğru şıkkın hiçbir yoldan sızmaması, kilit, puan ve tek deneme, sonucun ne
zaman açılacağı, sunucuda işleyen süre ve dakikalık temizlik, sekme kaydı, yetkiler, özellik kapısı ve arşiv yılı (110 denetim).

## Bu dosya ne yapar?

Quizde en önemli kaygı kopyadır ([../sunucu/bolumler/quiz.md](../sunucu/bolumler/quiz.md)):

- doğru şık bilgisi sonuç açılmadan öğrenciye ya da veliye **hiçbir yoldan** (quiz ucu, `/api/progress`, ödev ayrıntısı) gitmemeli;
- süre istemcide değil **sunucuda** işlemeli; bağlantısı kopan öğrencinin süresi de dolmalı;
- **tek hak** olmalı: aynı anda iki "Başlat" iki deneme açmamalı, bitiren yeniden başlayamamalı;
- doğru cevaplar bir kez göründüyse (sonuç açıldıysa) quiz bir daha başlatılamamalı, son teslim uzatılsa ya da ödev
  "Tekrar aç"ılsa bile.

Bu paket bunların hepsini gerçek uçlarla dener. Süreyi beklemek yerine test veritabanına depo üzerinden bağlanıp denemenin
başlama anını geri alır (`geriTarihle`) ve sunucunun dakikalık temizliğini (`quizTemizle`) kendisi çağırır; böylece "10 saniyelik
soru", "1 dakikalık quiz" ve "son teslim + 10 dakika" gibi durumlar birkaç saniyede denenir. Saf hesaplar (ayrıştırıcı, puan,
süre zinciri) ayrıca sunucusuz pakette ([test-quiz-metin.md](test-quiz-metin.md)) denenir.

## İçinde neler var?

### Yardımcılar

- `kontrol(ad, sart, detay)`; `J(x)` — `JSON.stringify(x).slice(0, 240)`; `z` — `Date.now().toString(36)` (ödev başlıklarının eki).
- Tarih: `yerelGun(d)`, `yerelSaat(d)` (bilgisayarın yerel saatiyle `YYYY-AA-GG`, `SS:DD`), `gun(n)` (bugünden `n` gün sonrası,
  yerel), `dakikaSonra(dk)`.
- `sizmaYok(govde)` — cevabın JSON metninde `"dogru":`, `dogruSecenek` ya da `dogruMu` geçiyor mu; geçmiyorsa `true`.
- `testDeposu()` — `EE_DATA`'yı `testler/testdata`'ya, `EE_PUSH_GONDERME`'yi `0`'a çevirir, ayarları yükler
  (`testler/testdata/ayarlar.json`, test sunucusunu açan betik yazar), `sunucu/veri/baglanti.js`'i alır; veritabanının adı `_test`
  ile bitmiyorsa `null` döner. Bitiyorsa `{ baglanti, quiz: depo/quiz, bolum: bolumler/quiz }` (`vt`). Hata olursa "test deposu
  açılamadı: …" yazıp `null` döner.
- `DORTLU()` — dört soruluk quiz: "Güneş bir yıldızdır." (D/Y, doğru), "2 + 2 kaçtır?" (3 / **4** / 5), "Hangileri asaldır?"
  (**2** / 4 / **7**, iki doğrulu), "Fotosentezi kendi cümlelerinle anlat." (açık uçlu). Puanlı 3 soru.
- `odevVer(baslik, quiz, ek)` — öğretmen `POST /api/assignments`: başlık + `z`, Matematik, iki öğrenciye, başlangıç dün, son
  teslim 3 gün sonra 23:59, quiz; `ek` alanları üstüne yazar (ör. son tarihsiz ödev için `endAt: ''`).
- Uç kısaltmaları: `Y(id)` (`/api/assignments/<id>/quiz`), `durum`, `basla`, `bitir`, `cevap(tok, id, soruId, secilenler, metin)`,
  `odak(tok, id, sure, soruId)`; `sikId(soru, metin)` (şık kimliği); `bildirimVar(tok, parca)` (`/api/notifications`'ta o metin var mı).
- `dortluCevapla(tok, id, hepsiDogru)` — başlatır ve dört soruyu cevaplar: hepsi doğru ya da (yanlış kipte) D/Y yanlış, 2. soru
  doğru, 3. soruda fazladan "4", açık uçluya "Bilmiyorum" → 1/3.
- **Hesaplar** ([seed.md](seed.md)): müdür `mudur@test.com` (`M`), öğretmenler `mat` (`T`, ödevlerin sahibi) ve `fen`, öğrenciler
  `ogrenci1` (`o1`) ve `ogrenci2` (`o2`). Paketin açtığı veli `quizveli<z>` (`V`, şifre `Test1234!`): `hesapAc` → `parent/link`
  ile `o1`'e bağlanır → yeniden girer (bağlandıktan sonra yeni oturum).

### 1) Oluşturma ve doğrulama (16)

- `DORTLU` quizli ödev "Puan quizi" (`P`) → 200; cevaptaki `quiz` öğretmene doğrularıyla gelir (`sorular[0].dogru: true`,
  3. soru `coklu`), `soruSayisi` 4, `puanliSayisi` 3, `acikUcluSayisi` 1, `sonucGorunum: 'teslim'`, `sureTuru: 'yok'`; ödev
  nesnesinde `quiz` alanı ve "dogru" sözü yok.
- 2. sorusunun doğrusu kaldırılmış quiz → 400 "2. soruda doğru şık işaretli değil." ve o ödev listede YOK (ödev ile quiz tek
  işlemde yazılır).
- Öğretmenin listesinde `P`'nin "Quiz" rozeti: `soruSayisi` 4, `baslayan` 0.
- Sınırlar (her biri ayrı ödevle, hepsi 400 ve iletisiyle): 101 soru; 600 soru (500'e sessizce kırpılmaz); 1001 karakterlik
  soru; 301 karakterlik şık; 11 şık; bütün şıkları doğru soru; süresi yazılmamış soru başına süreli soru ("10 saniye ile 10
  dakika"); 181 dakikalık quiz ("1 ile 180 dakika").
- "Metinden ekle" önizlemesi (`POST /api/assignments/quiz-metin`): dört soru (2.'si D/Y, 4.'sü açık uçlu) ve 6. satır için
  "3. soruda doğru şık işaretli değil."; boş metin 400; öğrenciye 403; 3000 satır çöp + soru + 100 satır çöp → 200, 51 sorun
  (ilki "önceki 3000 satır", sonuncusu "Ve 51 sorun daha"), cevap 20 000 karakterden kısa.

### 2) Kilit ve düzenleme (2)

Kimse başlamadan quiz 5 soruya çıkarılabiliyor (`kilitli: false`) ve eski hâline döndürülebiliyor.

### 3) Doğru şık sızmaz — sonuç açılmadan (7)

- `o1` başlamadan `GET …/quiz`: `durum: 'baslamadi'`, `baslatabilir: true`, `sorular` boş, yalnız özet; soru metni ("Güneş")
  ve doğru bilgisi yok.
- `/api/progress`: `P`'nin `quiz` özeti (`baslamadi`, 4 soru); soru metni ve doğru bilgisi yok.
- Öğrenci ve veli ödev ayrıntısını (`GET /api/assignments/<P>`) açamıyor → 403.
- `basla` → `durum: 'devam'`, dört soru, şıklar var, doğru bilgisi yok; 3. soru `coklu: true`, öbürleri `false`.
- Deneme sürerken `/api/progress`'te ve velinin `/api/progress?studentId=`'sinde de doğru bilgisi ve sekme kaydı (`cikis…`) yok.

### 4) Kilit: öğrenci başladı (3)

- Öğretmen quizi değiştirmeye kalkar → 409 `{ kilitli: true, baslayan: 1 }`, ileti "1 öğrenci başladı; quiz artık değiştirilemez.".
- `{ quiz: null }` (kaldırma) → 409.
- Öğretmenin `GET …/quiz`'i: `kilitli: true`, `baslayan: 1`.

### 5) Puan ve tek deneme (15)

- `o1` dört soruyu doğru cevaplar; her cevap anında kaydedilir (200, `kaydedildi`).
- Tek doğrulu soruda iki şık → 400; başka sorunun şıkkı → 400; 2001 karakterlik açık uçlu cevap → 400.
- İkinci "Başlat" aynı denemeye döner (`baslama` aynı), cevaplar yerinde.
- `bitir` → `bitti`, `bitisNedeni: 'ogrenci'`, `sonucAcik: false`, soru yok, doğru bilgisi yok.
- Bitirdikten sonra "Başlat" yine aynı (bitmiş) deneme; bitmiş denemeye cevap → 409 `{ kapandi: true, durum }` (doğru bilgisi yok).
- `o2` AYNI ANDA iki "Başlat" gönderir → ikisi 200, `baslama` aynı (tek deneme). Sonra yanlış kipte cevaplayıp bitirir.
- Öğretmenin ödev ayrıntısı: `o1` 3/3 (%100, açık uçlu 1, puanlanmadı), `o2` 1/3 (%33: iki doğrulu soruda fazladan şık puanı
  sıfırladı); quizin tamamı ve `baslayan: 2`; öğrencilerin ödev sonucu (`result`) hâlâ `null` (puan yalnız öneri, "Yaptı/Eksik"i
  değiştirmez).
- `…/quiz/ayrinti?ogrenci=<o2>`: `dogruMu` `[false, true, false, null]`, açık uçlu metin "Bilmiyorum", 3. sorunun 2 doğru şıkkı
  ve öğrencinin 3 seçimi, `ogrenci.fullName`, `cikisSayisi: 0`; ödevde olmayan öğrenci (`u_yok`) → 404.

### 6) Sonuç görünürlüğü: öğretmen açar (5)

- `POST …/quiz/sonuc-ac` → 200, `bildirilen: 2`, `sonucAcik: true`.
- `o1` artık puanını, kendi cevaplarını ve doğru cevapları görür (`dogruMu` `[true, true, true, null]`).
- Bildirim: `o1`'e `"Puan quizi <z>" quizinin sonucu açıklandı`, veliye "quizinin sonucu açıklandı" (kopyası).
- İkinci `sonuc-ac` → `bildirilen: 0` (bildirim bir kez).
- Veli `/api/progress`'te yalnız puanı görür (`sonucAcik`, `yuzde: 100`, `durum: 'bitti'`); soru, doğru bilgisi, sekme kaydı yok.

### 7) Sonuç: "Hemen" ve sonuçlandırınca (15)

- "Hemen quizi" (`sonucGorunum: 'hemen'`): `o1` bitirince sonucu ve doğru şıkları hemen açık; aynı anda çözen `o2`'ye doğru
  bilgisi gitmez.
- Son tarihsiz ödev (`S`): bitirince sonuç kapalı (son teslim yok); öğretmen `POST /api/assignments/<S>/finish` → 200,
  `quizBildirilen: 1`; sonuç açık; `o2` artık başlatamaz (400 `baslatilamaz`, "sonuçlandırıldı").
- `POST …/reopen` (Tekrar aç) → 200, ileti "…yeniden başlatılamaz"; doğru cevaplar açıldığı için `o2` yine başlatamaz (400,
  "açıklandı"); `o1`'in sonucu açık kalır; `o1`'e ikinci hak yok.
- Son tarihsiz ikinci ödev (`S2`): `o2` başlar, öğretmen kimseyi bitirmeden sonuçlandırır → `quizBildirilen: 1`; `o2`'nin denemesi
  `sonuclandi` nedeniyle biter ve sonucu açılır.
- "Açılmış sonuç" (`A`): `o1` bitirir, öğretmen sonucu açar → `o2` başlatamaz ("açıklandı").
- "Çözerken açılan" (`SA`): `o1` çözerken (2. soruya yanlış "3") `o2` bitirir, öğretmen sonucu açar → `biten: 1`, `bildirilen: 2`;
  `o1` cevabını "4"e düzeltmeye kalkar → 409; denemesi `sonuclandi` ile bitmiş, sonucu açık, `dogruSayisi: 0`.
- Yarış (4 tur): tek sorulu "Eski N" quizi verilir; aynı anda öğretmen quizi "Yeni N" ile yazar ve `o1` başlatır. Her turda
  başlatma 200 olmalı ve öğretmen 200 aldıysa öğrencinin ilk sorusu "Yeni N", 409 aldıysa "Eski N" olmalı (silinmiş soru dönmez).

### 8) Soru başına süre: sırayla, geri dönülmez (10)

Üç soru, her biri 10 sn (`SB`):

- `basla` → yalnız o anki soru ("Birinci soru"; sonrakiler görünmez), `soruSira: 1`, `soruBitis` dolu; aynı cevaptaki
  `soruBitis − simdi` 7–10,5 sn arası (süre sunucuda).
- O anki soruya cevap 200; `POST …/quiz/sonraki { soruId }` → 2. soru; geçilen soruya cevap → 409 `kapandi`.
- `vt` ile 15 sn geri alınır: okuyunca 2. soru kendiliğinden kapanmış, 3.'den devam; süresi dolan 2. soruya cevap → 409. 40 sn
  daha geri: deneme `sure` nedeniyle bitmiş. Öğretmenin ayrıntısında kapanış nedenleri `['gecildi', 'sure', 'sure']`, 2. ve 3.
  sorunun geçen süresi 10 sn, `dogruMu` `[true, false, false]`.
- Serbest quizde (`P`) `sonraki` → 400.

### 9) Bütün quiz süresi ve dakikalık temizlik (3)

- "Bir dakikalık" quiz (iki soru, `toplamDk: 1`): `o2` başlar; iki soru birden, `sonAn − simdi` 55–60,5 sn.
- `vt` ile 70 sn geri alınır ve `vt.bolum.quizTemizle()` çağrılır: deneme öğrenci okumadan kapanmış (`bitis` dolu, `sure`,
  `puanli: 2`); sonra cevap → 409, `durum.durum: 'bitti'`.

### 10) Başlama anı ve son teslim + 10 dk (12)

- Yarın başlayan ödev: `baslatabilir: false`, engel "…tarihinde açılacak"; `basla` → 400 `baslatilamaz`.
- "Teslim payı" (`TS`, son teslim 30 dk sonra, yerel saatle): başlayan denemenin `sonAn`'ı son teslim + 10 dk (±1 sn).
- Son teslim `POST /api/assignments/<TS>/update` ile 5 dk önceye çekilir: başlamış olan devam eder ve cevap yazabilir; `o2` yeni
  başlatamaz ("Son teslim geçti").
- 12 dk önceye çekilir: deneme `teslim` nedeniyle bitmiş; "son teslimden sonra" seçili olduğu için sonuç açık (1/3, cevapsızlar
  yanlış).
- 120 dk sonraya uzatılır: öğretmene "…quiz yeniden başlatılamaz" denir; `o2` yine başlatamaz ("açıklandı"); açılmış sonuç kapanmaz.
- `vt` ile: aynı anda iki ödev (`TK`, `TB`); `TK`'de `o1` bitirir, `TB`'de kimse başlamaz; ikisinin son teslimi 12 dk önceye
  çekilir ve `quizTemizle` çağrılır → `TK`'nin açılışı kalıcı (`sonucAcildi` dolu), `TB`'ninki değil (doğru cevabı gören yok);
  ikisi uzatılınca `o2` `TK`'yi başlatamaz (400), `TB`'yi başlatır (`devam`).

### 11) Sekme kaydı ve "çıkınca kapanır" (14)

- `cikincaKapanir` quiz (`SK`, 3 soru; `vt` ile deneme 60 sn önce başlamış sayılır): 1 sn'lik çıkış sayılmaz; 5 sn'lik çıkış
  sayılır (`cikisSayisi: 1`, `cikisSn: 5`) ve ekrandaki soru `cikis` nedeniyle kapanır; kapanan soruya cevap 409, öbürüne 200;
  100 000 sn'lik çıkış denemenin geçen süresini aşamaz (`cikisSn` 5'ten büyük, 125'ten küçük); bozuk süre (`'abc'`) 400;
  öğretmen ayrıntısında "2 kez çıktı" ve toplam süre; veli sekme kaydını görmez.
- Soru başına + `cikincaKapanir` (`SKS`, 60'ar sn): çıkınca o anki soru kapanır, sonrakine geçilir; son soruda uydurma `soruId`
  ile çıkış → deneme `cikis` nedeniyle biter (soruyu istemci değil sunucu seçer).
- `SKD` (10 sn + 60 sn): öğrenci dışarıdayken 1. sorunun süresi dolup 2. soru açıldıysa, dönüşte 2. soru kapanmaz (çıkış yine
  sayılır); ekrandayken çıkılan soru kapanır (boş `soruId` ile de) ve deneme biter.
- Serbest modda (`SKU`): uydurma `soruId` → en son cevaplanan açık soru kapanır; boş `soruId` → ilk açık soru kapanır.
- Seçenek kapalı quizde çıkış sayılır ama soru kapanmaz, cevap yazılabilir.

### 12) Yetkiler (5)

Yalnız `o1`'e verilmiş "Yalnız Zeynep" ödevi:

- `o2` göremez, başlatamaz → 404.
- `fen` (ödevin sahibi değil): `GET`/`POST …/quiz`, `ayrinti`, `sonuc-ac` → hepsi 403.
- Veli: `GET …/quiz`, `basla`, `ayrinti` → 403.
- Müdür sahibi olan bir ödevin quizini açamaz → 403 (denetim adı "bugünkü kural" der).
- Öğretmen öğrenci yerine başlatamaz (200 değil; `vt` varsa deneme sayısı 0).

### 13) Özellik kapalı ve ödev silinince (2)

- Müdür ödevleri kapatır: öğrencinin `GET` ve `basla`'sı, öğretmenin quiz yazması ve `quiz-metin` → hepsi 403
  `ozellikKapali: 'odev'`. Sonra yeniden açılır.
- `o1` başlayıp açık uçluya "Silinecek cevap" yazar; öğretmen ödevi siler (`POST …/delete`) → 200; öğrenci `GET` → 404; `vt` varsa
  quiz satırı, deneme ve cevaplar da gitmiş.

### 14) Arşiv yılı 409 (1)

Müdür "2025-2026" ve "2026-2027" yıllarını ekler (`POST /api/egitim-yili/ekle`); öğretmen `POST /api/egitim-yili/bak` ile
2025-2026'ya bakar (`arsiv: true`); quiz yazma, `sonuc-ac` ve `quiz-metin` → hepsi 409 `arsiv: true`. Sonda `vt` bağlantısı
kapatılır.

Toplam 16 + 2 + 7 + 3 + 15 + 5 + 15 + 10 + 3 + 12 + 14 + 5 + 2 + 1 = 110. Sonunda `GECTI: 110   KALDI: 0`; `KALDI` varsa çıkış
kodu 1; beklenmeyen hata `TEST HATASI:` ile iletiyi ve yığını yazar.

## Kimle konuşur?

- **Modüller:** [giris.md](giris.md) (`araclar/giris.js` → `iste`, `girisYap`, `hesapAc`); `testDeposu` içinde doğrudan
  `sunucu/ayarlar.js` (`ayarlariYukle`, [../sunucu/ayarlar.md](../sunucu/ayarlar.md)), `sunucu/veri/baglanti.js`
  (`veritabaniAdi`, `kapat`, [../sunucu/veri/baglanti.md](../sunucu/veri/baglanti.md)), `sunucu/veri/depo/quiz.js` (`geriTarihle`,
  `denemeBul`, `bul`, `denemeSayisi`, `cevaplari`, [../sunucu/veri/depo/quiz.md](../sunucu/veri/depo/quiz.md)) ve
  `sunucu/bolumler/quiz.js` (`quizTemizle`).
- **Sunucu uçları:**

  | Uç | Ne için | Belge |
  |---|---|---|
  | `GET/POST …/quiz`, `…/quiz/basla`, `cevap`, `sonraki`, `bitir`, `odak`, `GET …/quiz/ayrinti`, `POST …/quiz/sonuc-ac`, `POST /api/assignments/quiz-metin` | denenen bölüm | [../sunucu/bolumler/quiz.md](../sunucu/bolumler/quiz.md) |
  | `POST /api/assignments`, `GET /api/assignments`, `GET /api/assignments/<id>`, `…/finish`, `…/reopen`, `…/update`, `…/delete` | ödev (quiz onun içinde) | [../sunucu/bolumler/odev.md](../sunucu/bolumler/odev.md) |
  | `GET /api/progress` | öğrenci ve veli görünümü | [../sunucu/bolumler/ilerleyis.md](../sunucu/bolumler/ilerleyis.md) |
  | `GET /api/notifications`, `GET /api/me`, girişler ve kayıt | bildirimler, veli hesabı | [../sunucu/bolumler/kayit.md](../sunucu/bolumler/kayit.md) |
  | `POST /api/parent/link` | velinin bağlanması | [../sunucu/bolumler/veli.md](../sunucu/bolumler/veli.md) |
  | `POST /api/ozellikler` | ödevleri kapatıp açmak | [../sunucu/bolumler/ozellikler.md](../sunucu/bolumler/ozellikler.md) |
  | `POST /api/egitim-yili/ekle`, `POST /api/egitim-yili/bak` | arşiv yılı | [../sunucu/bolumler/egitim-yili.md](../sunucu/bolumler/egitim-yili.md) |

- **Koruduğu kod:** `sunucu/bolumler/quiz.js` (öğrenci ve öğretmen uçları, `ogrenciSorusu`'nun sızdırmazlığı, `denemeIsle` ve
  `ilerlet`, `baslatmaEngeli`, `sonucAcikMi`, kalıcı açılış, `odevSonuclandi`, `teslimSonuclariniSabitle`, `quizTemizle`,
  `ilerleyisOzetleri`, `ogrenciOzetleri`); `sunucu/yardimci/quiz.js` (doğrulama, puan, `denemeIlerlet`;
  [../sunucu/yardimci/quiz.md](../sunucu/yardimci/quiz.md)); `sunucu/bolumler/odev.js`'in quiz kısmı (ödev + quizi tek işlemde
  yazma, `finish`/`reopen`/`update` iletileri); depo `sunucu/veri/depo/quiz.js` (`denemeBaslat`'ın tek satırı, kilitler); özellik
  ve arşiv kapıları ([../sunucu/api.md](../sunucu/api.md)).
- **Tablolar:** `quizler`, `quiz_sorulari`, `quiz_secenekleri`, `quiz_denemeleri`, `quiz_cevaplari`, `odevler`, `odev_ogrencileri`,
  `bildirimler`, `egitim_yillari`, `kullanicilar` (`secili_yil_id`), `okul_kapali_ozellikler`
  ([../sunucu/veri/sema/SEMA.md](../sunucu/veri/sema/SEMA.md); quiz tabloları şema 029).
- **Ön yüz** (bu pakette tarayıcı yok): [../public/js/parcalar/14c-quiz.md](../public/js/parcalar/14c-quiz.md),
  [../public/js/parcalar/11-ogretmen-odev.md](../public/js/parcalar/11-ogretmen-odev.md).
- **Onu çalıştıran:** `testler/tumtest.sh`, sunuculu döngüde `test-okul-disk`'ten sonra, `test-yonetici-dosyasi`'ndan önce; her
  paketten önce veritabanı sıfırlanır ve [seed.md](seed.md) çalışır. Test sunucusu `EE_DATA=testler/testdata` ile açıldığı için
  `testDeposu` aynı ayar dosyasını bulur.

## Nasıl çalışır (adım adım)?

```
vt = testDeposu() (yalnız ..._test) ; M, mat, fen, o1, o2 girer ; veli açılır ─► o1'e bağlanır ─► yeniden girer
1)  P (DORTLU) ; bozuk quiz 400 + ödev yok ; rozet ; 8 sınır ; "Metinden ekle" önizlemesi
2)  kimse başlamadan düzenle / geri al
3)  başlamadan, /progress, ödev ayrıntısı 403, başlat, coklu, veli ─► hiçbir yerde doğru bilgisi yok
4)  o1 başladı ─► yazma / kaldırma 409, kilitli
5)  o1 hepsi doğru ; hatalı cevaplar 400 ; ikinci Başlat aynı ; bitir ; tek hak ; o2 aynı anda iki Başlat ─► tek deneme
    öğretmen: 3/3 ve 1/3 ; ödev sonucu değişmez ; ayrıntı
6)  sonuc-ac ─► o1 doğruları görür, bildirim (veliye kopya), ikinci kez bildirim yok, veli yalnız puan
7)  hemen ; son tarihsiz ─► finish / reopen ; kimse bitirmeden finish ; açılmış sonuçtan sonra başlatma yok
    çözerken sonuc-ac ; yazma ile başlatma yarışı (4 tur)
8)  soru başına: tek soru, sonraki, geri dönülmez ─► vt.geriTarihle ─► süre kendiliğinden işler
9)  bütün quiz 1 dk ─► vt.geriTarihle + vt.bolum.quizTemizle ─► okunmadan kapandı
10) yarın başlar ; son teslim + 10 dk ; tarih değiştirme (update) ; kalıcı açılış (temizlik)
11) sekme kaydı: 2 sn altı sayılmaz, çıkınca kapanır, soru başına / dışarıda açılan / uydurma soruId
12) yetkiler ; 13) özellik kapalı 403, ödev silinince her şey gider ; 14) arşiv yılı 409 ─► vt.kapat
```

## Dikkat!

- **Taze veritabanı ister; ikinci koşu ilk adımda düşer.** 14. bölüm öğretmeni geçmiş yıla baktırır ve bu seçim kişiye bağlıdır
  (`kullanicilar.secili_yil_id`), oturuma değil. 3 Ekim'de 3200'de aynı veritabanında ikinci kez çalıştırıldı (denetimde bir
  kez daha denendi, sonuç aynı): ilk üç denetim kaldı (ödev verme `{"arsiv":true,"error":"Geçmiş bir eğitim yılına bakıyorsun;
  …"}` ile reddedildi), dördüncüsü ("bozuk quizli ödev listede yok") geçti, sonra paket 103. satırda (rozet denetiminin
  ayrıntısı) `TEST HATASI: … reading 'slice'` ile durdu (`J(undefined)`). Eklenen iki yıl da veritabanında kalır. `tumtest.sh`
  her paketten önce sıfırladığı için orada sorun yok; elle çalıştırırken her seferinde sunucuyu sıfırla.
- **Veritabanına doğrudan bağlanır, ama yalnız `_test`'e.** `testDeposu` adı `_test` ile bitmeyen veritabanında `null` döner;
  o zaman süreye bağlı bloklar (8, 9, 10'un son kısmı, 11'in `SKD` kısmı) yerine birer "test veritabanına bağlanılamadı (…)"
  denetimi KALIR ve geri alma yapılmadığı için 11. bölümün öbür denetimleri de yanlış sonuç verebilir. Ayar dosyası
  `testler/testdata/ayarlar.json`'dur; test sunucusu başka bir `EE_DATA` ile açıldıysa paket yanlış veritabanına bakar.
- **Temizliği test süreci de çalıştırır.** `vt.bolum.quizTemizle()` sunucunun dakikalık işini test sürecinde çağırır; aynı anda
  sunucunun kendi zamanlayıcısı da çalışabilir. Koda göre ikisi çakışmaz (aynı anda çalıştırılarak denenmedi):
  `acikDenemeleriKapat` her denemeyi kendi işleminde `FOR UPDATE` ile kilitleyip `bitis` boşsa ilerletir; `sonuclariBildir`
  bildirimi yalnız `UPDATE … SET sonuc_bildirildi = true … WHERE NOT d.sonuc_bildirildi RETURNING` ile işaretleyebildiği
  denemelere yazar (her deneme bir kez); `teslimSonuclariniSabitle`'nin kullandığı `sonucAc` `COALESCE(sonuc_acildi, now())`
  ile ilk anı korur. Bu çağrı bildirim yazar; test sürecinde `push.baslat()` hiç çağrılmadığı için telefon gönderimi başlamaz
  (`EE_PUSH_GONDERME=0` ayrıca konur).
- **Saat yerel saattir.** Son teslimler `yerelGun`/`yerelSaat` ile yazılır; sunucu da son teslimi kendi yerel saatiyle hesaplar.
  Test ve sunucu aynı bilgisayarda, aynı saat diliminde olmalı; ayrı makinelerde saat dilimleri farklıysa 10. bölüm kalır.
- **Süre ölçümleri aynı cevaptan.** "Yaklaşık 10 sn" ve "1 dk" denetimleri `soruBitis − simdi` / `sonAn − simdi`'yi aynı cevaptan
  hesaplar; ağ gecikmesinden etkilenmez.
- **`J` boş değerde patlar:** ayrıntısı olmayan bir denetim `KALDI` yerine `TEST HATASI` ile paketi durdurur (yukarıdaki ikinci
  koşu).
- **Seed'e bağlı:** `o1`'in ödevdeki tek öğrenci olduğu ödevin adı "Yalnız Zeynep"; iki öğrenci, Matematik öğretmeni `mat`'ın
  ikisine de ulaşabilmesi ve `fen`'in ödevin sahibi olmaması seed'den gelir.
- **"Bugünkü kural":** 12. bölüm müdürün, sahibi olan ödevin quizini açamamasını bekler; kural değişirse bu denetim de değişmeli.
- **Denenmeyenler:** hız sınırları (`basla` 10 dakikada 30, `cevap` 600, `odak` 120, `quiz-metin` 300), `quiz-metin`'in 300 000
  karakter sınırı, "Quiz başlamadı." (deneme yokken cevap), `sonraki`'nin o anki olmayan soruyla çağrılması, arşiv yılında
  öğrencinin uçları.
- **Varsayılan adres 3000.** `EE_BASE` vermezsen kendi sunucunda ödevler ve veli hesabı açar, okulun ödev bölümünü bir an
  kapatır; `testDeposu` ise `testler/testdata` ayarına bakar. Kodlar `EE_LOG`'dan okunur ([giris.md](giris.md)).

## Testleri

- Bu dosyanın kendisi testtir; `testler/tumtest.sh` her tam koşuda çalıştırır. Aynı kodun başka yönleri:
  [test-quiz-metin.md](test-quiz-metin.md) (saf kurallar ve ön yüz metinleri, sunucusuz), [test-ozellikler.md](test-ozellikler.md)
  (ödevler kapalıyken quiz uçları), [yetki-denetimi.md](yetki-denetimi.md) (quiz uçları × roller), [girdi-denetimi.md](girdi-denetimi.md)
  (bozuk quiz gövdeleri), `testler/test-yedek.js` (quiz tabloları yedekte).
- Elle (Git Bash, proje kökünde; 3200'de sıfırlanmış `egitimevi_test` ile `EE_DATA=testler/testdata` olarak açılmış ve
  [seed.md](seed.md) ile tohumlanmış test sunucusu varken):

  ```
  EE_BASE=http://localhost:3200 EE_LOG=testler/test-sunucu.log node testler/test-quiz.js
  ```

- 3 Ekim'de bu belge için 3200'de, yeni sıfırlanmış test veritabanı ve seed'le çalıştırıldı: `GECTI: 110   KALDI: 0`, çıkış 0,
  yaklaşık 4,4 saniye; "test deposu açılamadı" yazmadı (süre denetimlerinin hepsi çalıştı); sunucu günlüğünde `API hatası` ya da
  `Veritabanı hatası` yok. Ardından aynı veritabanında yapılan ikinci koşunun sonucu "Dikkat!"te.

## Son durum

- `git log`: tek commit. Dosya `3b8fd36 commit 519` (2026-09-27, quiz özelliği; `sunucu/bolumler/quiz.js`, `sunucu/yardimci/quiz.js`,
  `sunucu/veri/depo/quiz.js` ve `029-quiz.sql` ile aynı commit) ile 503 satır olarak eklendi ve o günden beri değişmedi.
  Koruduğu `sunucu/bolumler/quiz.js`, `sunucu/yardimci/quiz.js` ve `sunucu/veri/depo/quiz.js` de o günden beri değişmedi;
  `sunucu/bolumler/odev.js` sonra bir kez (`566b917 commit 524`) değişti.
- Bilinen açıklar (kod değiştirilmedi): 14. bölümün öğretmeni arşivde bırakması (yeniden çalıştırılamama), `J`'nin boş değerde
  patlaması.
- Planlı işlerden bu dosyayı etkileyecekler:
  - **"Düzenleyiciler"** (onaylı: quiz soru düzenleyicisi — resim, basit matematik, soru bankası) — yeni soru alanları 1.
    bölümün sınırlarına ve 3. bölümün "doğru şık sızmaz" denetimlerine (resim/biçimli metin de sızmamalı) eklenmeli.
  - **"Optimizasyon + saklama süreleri"** (quiz 1 yıl) — eski denemelerin silinmesi gelecek; bu paketteki taze kayıtlar
    etkilenmez ama silme işi için yeni denetim gerekir.
  - **"Anket düzenleyici … quiz sorularını Excel'den aktarma"** — yeni bir içe aktarma ucu gelirse 1. bölümdeki önizleme
    denetimlerinin bir eşi yazılmalı.
  - **"Yıl geçişi"** (yeni yıl sihirbazı) — 14. bölümün yıl ekleme ve "bak" adımları sihirbaza göre değişebilir.
  - **"T.C. KİMLİK NO BÜTÜN HESAPLARDA ZORUNLU"** (kod Linux'ta) ve **"Güvenlik denetimi"** (ilk girişte şifre değiştirme) —
    velinin `hesapAc` kaydı ve seed öğrencilerinin girişleri buna göre değişmeli.
