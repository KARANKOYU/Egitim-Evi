# public/js/parcalar/14c-quiz.js

Ödev quizinin bütün ön yüzü: öğretmenin ödev penceresindeki quiz düzenleyicisi ("Metinden ekle", "Önizle", kilit),
kontrol ekranındaki quiz satırı, öğrenci rozetleri ve cevap ayrıntısı; öğrencinin kurallar → çözme → sonuç sayfası
(`#/quiz`), sayacı ve sekme kaydı; listelerdeki ve veli penceresindeki quiz durumu.

## Bu dosya ne yapar?

Öğretmen bir ödeve isteğe bağlı bir quiz ekleyebilir: Doğru/Yanlış, çoktan seçmeli (bir ya da birden çok doğru şık) ve
açık uçlu sorular. Quizin kuralları, süresi, puanı ve güvenliği sunucuda
([../../../sunucu/bolumler/quiz.md](../../../sunucu/bolumler/quiz.md)); bu dosya quizin ekranda görünen her şeyidir.
Üç yüzü var:

1. **Öğretmen (ve müdür).** "Yeni ödev" ve "Ödevi düzenle" pencerelerinin içinde açılıp kapanan bir **düzenleyici**.
   Ayrı bir pencere değil, aynı pencerenin bir bölümü: uygulamada tek pencere kökü var, ikinci pencere açılamaz
   ([03-mesaj-modal.md](03-mesaj-modal.md) "Tek pencere"). Soru türü, şıklar ve "Doğru" kutuları, süre türü, "çıkınca o
   soru kapanır", sonuçların ne zaman görüneceği, **Metinden ekle** (Word'den yapıştırılan metni sunucu ayrıştırır, burada
   önizlenir) ve **Önizle** (öğretmen quizi öğrenci gibi görür, hiçbir şey kaydedilmez). Bir öğrenci başladıysa quiz
   kilitlidir. Ödevin kontrol ekranında ekler listesinin başında quiz satırı (Önizle, Quizi düzenle, Sonuçları şimdi
   aç), her öğrencinin altında quiz rozeti ve rozete basınca o öğrencinin cevapları.
2. **Öğrenci.** Ödev penceresindeki quiz satırından `#/quiz` sayfasına gider: önce kurallar, "Şimdi başla"dan sonra
   çözme ekranı (kalan süre, "Soru 3/10", her cevap anında kaydedilir, sayfa yenilenince kaldığı yerden sürer), bitince
   sonuç (puan, kendi cevapları ve doğrular — sonuç açıldıysa). Sekmeden, uygulamadan ya da quiz sayfasından çıkmak
   kaydedilir.
3. **Veli** (ve öğrencinin portalından bakan müdür/öğretmen): listede ve pencerede yalnız durum ("başlamadı / devam
   ediyor / bitirdi"), sonuç açılınca puan. Soruları ve sekme kaydını görmez (sunucu zaten göndermez).

Temel ilke şu: **bu dosya hiçbir şeye karar vermez.** Süre sunucuda işler, buradaki sayaç yalnız gösterir; doğru şık
bilgisi öğrenciye sonuç açılana dek sunucudan hiç gelmez; düzenleyicinin denetimleri öğretmeni boşuna bekletmemek için,
sunucu aynılarını yine denetler. Sekme kaydı tarayıcıda algılandığı için caydırıcıdır, kanıt değildir; ekranlar bunu
öğretmene de söyler.

## İçinde neler var?

### Sabitler ve ortak durum

- `QUIZ_SINIRI` — `{ soru: 100, soruMetni: 1000, secenek: 300, secenekEnAz: 2, secenekEnCok: 10, cevap: 2000,
  soruSureEnAz: 10, soruSureEnCok: 600, quizDkEnAz: 1, quizDkEnCok: 180 }`. Sunucudaki `QUIZ_SINIR`'in birebir aynısı
  ([../../../sunucu/yardimci/quiz.md](../../../sunucu/yardimci/quiz.md)); elle eşit tutulur.
- `QUIZ_TUR_AD` — `dy` → "Doğru/Yanlış", `coktan` → "Çoktan seçmeli", `acik` → "Açık uçlu".
- `QUIZ_HARF` — `'ABCDEFGHIJ'` (en çok 10 şık); Doğru/Yanlış sorusunda harf gösterilmez.
- `QUIZ_VARSAYILAN_SURE` — 30: soru başına sürede yeni sorunun saniyesi.
- `IKONLAR.yukari`, `IKONLAR.asagi` — dosya yüklenirken ikon tablosuna iki ok ekler ([02-ikonlar.md](02-ikonlar.md);
  tabloya dışarıdan ekleyen tek parça). Soruları taşıma düğmeleri kullanır; yönetim paketindeki Site ayarları da
  (aşağıda "Kimle konuşur?").
- `QUIZ_DZ` — düzenleyicilerin durumu, kimliğe göre: `odev` ("Yeni ödev"), `duzelt` ("Ödevi düzenle"), `onizle`
  (kontrol ekranından açılan önizleme). Her biri `{ acik, quiz, kilitli, baslayan, ilk, metin, onizle }`; önizleme
  penceresininkinde ayrıca `yalnizOnizle: true`. `quiz` düzenleyicinin tuttuğu biçimdir: `{ sureTuru, toplamDk,
  cikincaKapanir, sonucGorunum, sorular: [{ tur, metin, sureSn, dogru, secenekler: [{ metin, dogru }], uyari? }] }`.
  `ilk` açılıştaki hâlin JSON'u (düzeltmede "değişti mi" için; quiz yoksa `'null'`). `metin` açıkken "Metinden ekle"
  paneli `{ deger, sonuc, bekliyor, hata, sira, zaman }`; `onizle` açıkken `{ sira, secim: { soruId: cevap } }`.
- `QUIZ_ORNEK_METIN` — "Metinden ekle" kutusunun yer tutucusu (üç örnek soru: çoktan seçmeli, Doğru/Yanlış, açık uçlu).
- `QZ` — öğrencinin çözme sayfasının durumu: `odevId`, `veri` (sunucunun son `GET …/quiz` cevabı), `sira` (serbest
  modda ekrandaki soru), `fark` (sunucu saati − tarayıcı saati), `zamanlayici` (500 ms'lik sayaç), `kuyruk` (istekleri
  sıraya koyan söz zinciri), `bekleyen` (gönderilmemiş açık uçlu yazılar, soru kimliğine göre), `kayit` (soru başına
  kayıt durumu: `kaydediliyor`, `bekliyor`, `tamam`, `hata`), `yaziZamani`, `mesaj` (sayfanın üstündeki ileti),
  `cikis`, `cikisSoru`, `cikisIc`, `cikisOdev`, `cikisKisi`, `ekranda` (sekme kaydı, aşağıda), `sonrakiIstenen`,
  `sonrakiBekle`, `tazeleZamani`, `ilkAcilis`.
- `S.quizOdevId`, `S.quizOdev` — çözülecek ödevin kimliği ve özeti (`{ id, title, subject, teacherName, endAt, endTime }`).
  [00-durum.md](00-durum.md)'deki başlangıç nesnesinde yoklar; bu dosya ilk kullanımda ekler.
- Sekmenin belleği (`sessionStorage`, `ee_` önekli): `ee_quiz_odev` (kimlik), `ee_quiz_odev_bilgi` (özet JSON),
  `ee_quiz_sira_<ödevId>` (serbest modda kalınan soru). Yenilenen sekme hangi quizde olduğunu buradan bilir; gizli
  pencere ya da kapalı bellekte okuma/yazma hatası yutulur.

### Ortak yazı yardımcıları

- `quizIki(n)` — iki haneli sayı (`7` → `"07"`).
- `quizSureMetni(sn)` — `45` → "45 sn", `90` → "1 dk 30 sn", `1200` → "20 dk" (negatif ve bozuk değer 0).
- `quizSureOzeti(q)` — bütün quizde "20 dk", soru başına sürede "soru başına süre (toplam 5 dk)", süresizde "süresiz".
- `quizOzetMetni(q)` — "Quiz · 10 soru · 20 dk". Her yerdeki başlık satırı budur.
- `quizPuanMetni(s)` — "8/10 (%80) · 2 açık uçlu soru puanlanmaz"; puanlı soru yoksa "Puanlı soru yok"; `s` yoksa `''`.
- `quizSaat(iso)` — "14:03:12" (kayıt saati).
- `quizSayac(ms)` — kalan süre: "4:05", saat varsa "1:02:09"; yukarı yuvarlar, eksiye inmez.
- `quizBitisNedeni(neden, ogretmen)` — `ogrenci`, `sure`, `teslim`, `sonuclandi`, `cikis` için öğrenciye ("Süre doldu;
  quiz bitti.", "Öğretmen quizi kapattı (ödevi sonuçlandırdı ya da sonuçları açtı); quiz bitti." …) ya da öğretmene
  ("süre doldu", "sekmeden çıkınca bütün sorular kapandı" …) yazı.
- `quizTarihSaat(iso)` — "30 Eylül 2026, Çarşamba · 17:10" (`tarihGun` + saat; sonucun açılacağı an).
- `quizKapanmaYazi(k)` — `cikis` → "Çıkınca kapandı", `sure` → "Süre doldu", başkası (`gecildi` dahil) `''`.
- `quizOturumYaz(ad, deger)`, `quizOturumOku(ad)` — `sessionStorage`'a `ee_<ad>` olarak yazar/okur, hatada sessiz.

### Listelerde ve eklerde (başka parçaların çağırdıkları)

- `quizListeEtiketi(q)` — ödev adının yanındaki küçük "Quiz" rozeti (`span.etiket.qz-etiket`, `title` = özet). Öğretmen,
  müdür (ders ödevleri), öğrenci ve veli listelerinde.
- `quizListeDurumu(q, kendisi)` — öğrenci ve veli listesindeki satır (`div.qz-liste-durum.<durum>`): "Quiz: bitirdin ·
  8/10 (%80)" ya da "… · sonuç henüz açılmadı", "Quiz: devam ediyor", "Quiz: çözmedin" (öğrencinin kendisi) / "Quiz:
  başlamadı" (başkası). Puan yalnız `q.sonucAcik` iken.
- `quizOgretmenListeSatiri(q, ogrenciSayisi)` — öğretmenin listesinde "Quiz · 5 soru · 20 dk · 12 öğrenciden 3 kişi
  bitirdi, 2 kişi çözüyor".
- `quizOdevSatiri(a, d)` — ödev penceresinin ekler listesinin ilk satırı (`li#qzOdevSatir.ek-satir.qz-ek-satir`). `d`
  öğrencinin kendi `GET …/quiz` cevabı ya da `null` (o zaman listedeki özet `a.quiz` kullanılır). Yazı ve düğme:
  - bitti → "Bitirdin · 8/10 (%80)" / "… · sonuçlar henüz açılmadı"; kendisiyse düğme "Sonucu gör" ya da "Quizi aç";
  - devam → "Başladın; kaldığın yerden sürdür." + "Devam et";
  - ödev sonuçlandırılmış → "Çözülmedi; ödev sonuçlandırıldı.";
  - bakan öğrencinin kendisi değil → "Henüz başlamadı";
  - `d` henüz yok → "Quiz bilgisi yükleniyor...";
  - başlatılabilir → "Tek hakkın var; başlayınca süre işler." (süresizde "Tek hakkın var; ikinci kez çözülemez.") +
    "Quizi başlat";
  - başlatılamaz → sunucunun nedeni (`d.engel`, ör. "Quiz 05.10.2026 08:00 tarihinde açılacak.").
  Düğmelerin hepsi `data-act="quiz-ac"`. "Kendisi" = rol `student` ve `S.viewStudentId` boş.
- `quizOgretmenSatiri(q, a)` — kontrol ekranında ekler listesinin ilk satırı: özet + alt satır ("3 öğrenci başladı" /
  "Henüz kimse başlamadı"; "sonuçlar öğrencilere açık" / "öğrenci sonucunu bitirince görür" / son tarihli ödevde
  "sonuçlar son teslimden 10 dakika sonra açılır", son tarihsizde "sonuçları sen açınca görünür"; "sekmeden çıkınca soru
  kapanır"). Düğmeler: **Önizle** (`quiz-onizle-ac`, ekranı gören herkese), **Quizi düzenle** (`quiz-duzenle`,
  `yetkim('odev.ver')`),
  **Sonuçları şimdi aç** (`quiz-sonuc-ac`, sonuç açık değilse ve `yetkim('odev.sonuclandir')`).
- `quizOgrenciRozeti(qo, odevId, ogrenciId)` — kontrol ekranında öğrencinin adının altında: başlamadıysa tıklanmaz
  "Quiz: başlamadı"; değilse düğme (`button.baglanti.qz-rozet`, `data-act="quiz-ayrinti"`, `data-ogrenci`): "Quiz: devam
  ediyor" ya da "Quiz: 8/10" (puanlı soru yoksa "Quiz: bitirdi"), çıktıysa " · 2 kez çıktı (35 sn)" ve `.cikti` sınıfı.

### Soru ve sonuç çizimi (çözme, önizleme, sonuç)

- `quizSoruHtml(s, cevap, ayar)` — bir sorunun cevap alanı. `s = { id, tur, metin, coklu, secenekler: [{ id, metin }] }`,
  `cevap = { secilenler, metin }`, `ayar = { ad (seçim grubunun adı), kapali }`. Açık uçluda `textarea.qz-cevap-metin`
  (en çok 2000; kapalıysa `readonly`) ve "N/2000 · Bu soru puanlanmaz; öğretmenin okur."; çoklu soruda "Birden çok şık
  seçebilirsin." notu ve kutucuklar (`role="group"`), tekli soruda radyo düğmeleri (`role="radiogroup"`). Her şık
  `label.qz-secenek` içinde `input.qz-sec` (`value` = şık kimliği); kapalı soruda `disabled`. Boş metin "Soru metni
  yazılmadı" / "boş şık" diye görünür (önizleme için).
- `quizSonucListesi(sorular, ogretmen, suruyor)` — `ol.qz-sonuc-liste`: her soruda tür, "Doğru" / "Yanlış" / "Boş" /
  "Puanlanmaz" etiketi, kapanma nedeni, öğretmene "Geçen süre: 25 sn / 30 sn"; şıklarda doğru olan yeşil ("Doğru
  cevap"), yanlış seçilen kırmızı, seçilenin yanında "Senin seçimin" ya da "Öğrencinin seçimi"; açık uçluda metin ya da
  "Cevap yazılmadı.". `suruyor` (öğrenci hâlâ çözüyor) iken boş puanlı soru yanlış değil "Cevaplanmadı" görünür.

### Öğretmen: düzenleyici

Başka parçaların çağırdıkları:

- `quizAlani(kimlik, mevcut)` — "Yeni ödev"de `quizAlani('odev', null)`, "Ödevi düzenle"de `quizAlani('duzelt',
  S._acikOdevQuiz)`. `QUIZ_DZ[kimlik]`'i SIFIRDAN kurar (`mevcut` sunucunun `ogretmenQuizi` biçimi; `kilitli`,
  `baslayan` oradan) ve `div.qz-alan#qzAlan-<kimlik>` döner.
- `quizAlaniYenile(kimlik, mevcut)` — pencere açıkken bölümü sunucudaki hâliyle baştan kurar (düzeltmede kaydederken
  quiz kilitlendiyse `11-ogretmen-odev.js` çağırır).
- `quizYenidenCiz(kimlik)` — bölümün içini `QUIZ_DZ`'den yeniden çizer, sonra `quizPencereAyari`.
- `quizPencereAyari()` — düzenleyici, önizleme ya da öğrenci ayrıntısı açıksa pencereye `.qz-genis` (760 px) verir;
  düzenleyici açıksa perdeye `data-zorunlu="1"` koyar: dışarı tıklayınca pencere kapanmaz ("Vazgeç" yine kapatır).
- `quizGovdesi(kimlik)` — kaydederken çağrılır. Dönüş: kilitliyse `{ quiz: undefined }` (dokunulmayacak); yapıştırılmış
  ama "Ekle"ye basılmamış metin varsa `{ hata: 'Yapıştırdığın soruları önce "Ekle" ile quize aktar ya da "Vazgeç" de.' }`;
  quiz kapalıysa `{ quiz: null }`; değilse `quizGonderilecek` + `quizDenetle`: hata varsa önizleme/metin paneli
  kapatılır, hatalı soru kırmızı çerçeveyle gösterilir ve `{ hata }`, yoksa `{ quiz }`.
- `quizDegistiMi(kimlik, govde)` — gövdenin JSON'u açılıştakinden (`ilk`) farklı mı; `undefined` gövde hiç değişmemiş
  sayılır.

Düzenleyicinin iç işleri:

- `quizYeniSoru(tur, sureSn)` — boş soru; çoktan seçmeli dört boş şıkla başlar.
- `quizBos()` — yeni quiz: süresiz, bütün quiz süresi kutusu 20 dk, "çıkınca kapanır" kapalı, sonuç "son teslimden
  sonra", bir boş çoktan seçmeli soru.
- `quizDuzenleyiciye(q)` — sunucudaki quiz → düzenleyici biçimi (`toplamSn` → `toplamDk`; `dy`'de `dogru` boolean).
- `quizSayi(v)` — boşlukları atıp 1–6 haneli tam sayıya çevirir, olmazsa `null`.
- `quizGonderilecek(q)` — düzenleyici → sunucuya gidecek quiz: metinler kırpılır (şıklarda iç boşluklar teke iner),
  `toplamDk` yalnız bütün quizde, `sureSn` yalnız soru başına sürede, `dogru` yalnız Doğru/Yanlış'ta, `secenekler` yalnız
  çoktan seçmelide gider. Denetlemez.
- `quizDenetle(g)` — sunucudaki `quizDogrula`'nın sınırları, ilk hatada durur: soru yok / 100'den çok; bütün quiz süresi
  1–180 dk (`alan: 'dk'`); her soruda metin boş / 1000'den uzun, soru süresi 10–600 sn, Doğru/Yanlış'ta seçim yapılmamış,
  çoktan seçmelide 2–10 şık, boş ya da 300'den uzun şık ("3. sorunun B şıkkı boş. Boş şıkkı sil ya da doldur."), doğru
  işaretli şık yok, **bütün şıklar doğru** (yoksa "Birden çok şık seçebilirsin" notu cevabı ele verir). Dönüş `null` ya
  da `{ hata, soru?, alan? }`.
- `quizAlaniIc(kimlik)` — bölümün içi, sırayla: kapalıysa **Quiz ekle** düğmesi ("Öğrenci ödevi açıp quizi çözer; tek
  deneme hakkı vardır."); önizleme açıksa önizleme; başlık ("Quiz", "N soru", "Quizi kaldır" — kilitliyken "Quizi
  kaldır" yok); kilitliyse turuncu "N öğrenci başladı; quiz artık değiştirilemez." + özet + yalnız **Önizle**; metin
  paneli açıksa o (`quizMetinPaneli`); değilse ayarlar
  (Süre çipleri Süresiz / Soru başına / Bütün quiz, dakika kutusu 1–180, her birinin açıklaması; "Uygulamadan/sekmeden
  çıkınca o soru kapanır" kutusu ve "caydırıcıdır, kesin kanıt değildir" notu; "Sonuçlar öğrenciye" seçimi: "Son
  teslimden 10 dakika sonra görünsün" / "Hemen görünsün (bitirince)" ve "Hemen" seçilirse cevapların yayılabileceği
  uyarısı), sorular (bütün sorular silinmişse "Henüz soru yok. "Soru ekle" ya da "Metinden ekle" ile başla."), altta
  **Soru ekle**, **Metinden ekle**, **Önizle** ve bilgi kutusu `#qzBilgi-<kimlik>`.
- `quizDuzenSorusu(kimlik, q, i)` — bir soru (`li.qz-soru[data-i]`): numara, tür seçimi (`select.qz-tur`), soru başına
  sürede saniye kutusu (`.qz-sure`), yukarı/aşağı/sil düğmeleri, soru metni (`textarea.qz-metin`); Doğru/Yanlış'ta
  "Doğru cevap: Doğru | Yanlış" çipleri, çoktan seçmelide her şık (`.qz-sik`: harf, metin, "Doğru" kutusu, sil) +
  "Şık ekle" (10'a kadar) + "Birden çok doğru işaretlersen … puan için hepsini bulmalı."; açık uçluda açıklama.
  "Metinden ekle"nin bu soru için bulduğu sorunlar (`s.uyari`) kırmızı çerçeve ve iletiyle.
- `quizDomdanOku(kimlik)` — ekranda yazılanları (süre türü, dakika, çıkınca kapanır, sonuç görünümü, her sorunun türü,
  metni, süresi, Doğru/Yanlış seçimi, şıkları) duruma aktarır. Her yeniden çizimden ve kaydetmeden önce çağrılır;
  kilitliyken, önizlemede ya da metin panelindeyken bir şey yapmaz. Tür değişince eski şıklar durumda kalır: türü geri
  alan öğretmen şıklarını kaybetmez (gönderilirken yalnız çoktan seçmelinin şıkları gider).
- `quizBilgi(kimlik, tur, metin, liste)` — bilgi kutusuna ileti (altında isteğe bağlı madde listesi).
- `quizHataGoster(kimlik, h)` — eski kırmızıları siler, hatalı soruyu ya da ayar kutusunu `.hatali` + `.alan-hata`
  iletisiyle işaretler ve ortaya kaydırır.
- `quizDz(el)`, `quizOdakla(kimlik, secici)` — düğmenin `data-kimlik`/`data-i`/`data-j`'sini okur; odağı bir öğeye taşır.

Düzenleyicinin eylemleri (`EYLEMLER`, `data-kimlik` ve `data-i` taşır):

- `quiz-ekle` — bölümü açar (`quizBos()`), ilk sorunun metnine odaklanır.
- `quiz-kaldir` — yazılmış soru varsa ya da quiz sunucuda zaten varsa onay ister ("Quiz ödevden kaldırılsın mı? Kaydedince
  sorular silinir." / "Quiz kaldırılsın mı? Yazdığın sorular silinir."), bölümü kapatır. Asıl silme kaydedince
  (`{ quiz: null }`).
- `quiz-soru-ekle` — 100'de durur ve uyarır; yeni soru son sorunun türünde, soru başına sürede son sorunun süresiyle
  (yoksa 30 sn).
- `quiz-soru-sil` — metni olan soruda onay ("3. soru silinsin mi?").
- `quiz-soru-yukari`, `quiz-soru-asagi` (`quizSoruTasi`) — yer değiştirir, odağı taşınan sorunun aynı düğmesine (uca
  geldiyse metnine) verir.
- `quiz-sik-ekle` — 10'a kadar boş şık; `quiz-sik-sil` — 2'nin altına inmez ("Çoktan seçmeli soruda en az 2 şık olmalı.").
- Belgeye kurulan dinleyiciler: `change` — tür ya da süre türü değişince bölüm yeniden çizilir (şıkkı 2'den az çoktan
  seçmeli dört boş şıka tamamlanır, soru başına sürede süresiz sorulara 30 sn, bütün quizde boş dakikaya 20 verilir);
  Doğru/Yanlış çipinin ve doğru şıkkın görünümü güncellenir. `input` — hatalı soruya ya da ayar kutusuna yazmaya
  başlayınca kırmızı ve "Metinden ekle" uyarısı kalkar.

### Metinden ekle

- `quiz-metin-ac` — ekrandakini duruma yazar (`quizDomdanOku`), `metin = { deger: '', sonuc: null, bekliyor: false,
  hata: '', sira: 0 }` kurar ve paneli açar. Paneli `quizMetinPaneli(kimlik)` çizer: "Soruları buraya yapıştır" kutusu
  (`textarea.qz-yapistir`, yer tutucusu `QUIZ_ORNEK_METIN`), açılır "Yazım biçimi" (numara `1)` `1.` `1-`; şık `A)` `a)`
  `A.`; doğru şıkka yıldız; `Cevap: Doğru`; şıksız soru açık uçlu), sonuç alanı, **Ekle** (önizlemede soru yoksa kapalı)
  ve **Vazgeç** (`quiz-metin-kapat`, yazılanı atar).
- Belgedeki `input` dinleyicisi → 0,7 sn yazmayı bırakınca `quizMetinDenetle(kimlik)`: `POST /api/assignments/quiz-metin
  { metin }`. Her isteğe sıra numarası verilir; geç gelen eski cevap atılır. Beklerken "Denetleniyor...", **Ekle**
  kapalı. Sunucunun hatası (ör. 300 000 karakterden uzun metinde "Metin çok uzun; soruları parça parça ekle.", hız
  sınırında 429) sonuç alanında kırmızı ileti olur.
- `quizMetinSonucHtml(m)` — "4 soru bulundu · 2 sorun", sorun listesi (başında "7. satır:"; ileti zaten satırla ya da
  "İlk sorudan" diye başlıyorsa önek yok — `quizHataSatirOnEki`), bulunan soruların listesi (tür etiketi, şıklar, doğru
  şık işaretli, Doğru/Yanlış'ta "Cevap: Doğru / Yanlış / anlaşılamadı").
- `quiz-metin-ekle` — önizlenen soruları düzenleyiciye ekler: hiç dokunulmamış boş ilk soru varsa onun yerine; 100'ü
  aşan kısım alınmaz ve söylenir. Sunucunun sorunları eklenen sorulara `uyari` olarak işlenir (kırmızı çerçeve); iletideki
  "4. soruda" yapıştırılan metindeki sıradır, düzenleyicideki sıraya çevrilir. Bir soruya bağlanamayan sorunlar (ilk
  sorudan önceki satırlar, "Ve N sorun daha") bilgi kutusunda madde olarak kalır; alınmayan (100'ü aşan) soruların
  sorunları gösterilmez. İleti: "6 soru eklendi. Sorunlu 2 soru kırmızıyla işaretlendi; düzelt."

### Önizle

- `quizOnizleSorulari(q)` — düzenleyicideki soruları öğrencinin göreceği biçime çevirir (uydurma kimlikler `onz0`,
  `onz0-1`, Doğru/Yanlış için "Doğru"/"Yanlış" şıkları; birden çok doğru varsa `coklu`). Doğru bilgisi gösterilmez.
- `quizOnizleHtml(kimlik)` — "Önizleme: öğrenci quizi böyle görür. Cevaplar kaydedilmez." + üst şerit ("Soru 2/5",
  süre yazısı: soru başına sürede o sorunun süresi, bütün quizde toplam, değilse "Süresiz") + soru kartı + gezinme:
  soru başına sürede "Sonraki soru" (sonda "Başa dön") ve "Öğrenci bir sonraki soruya geçince bu soruya dönemez.",
  serbestte "Önceki / Sonraki". Sayaç işlemez. Düzenleyicinin içindeyse "Önizlemeden çık".
- `quiz-onizle` — düzenleyicide önizlemeyi açar (kilitliyken de çalışır); `quiz-onizle-kapat` — düzenleyiciye döner;
  `quiz-onizle-git` — `data-i` sorusuna gider. Önizlemede seçilen şık ve yazılan cevap yalnız `onizle.secim`'de kalır.
- `quiz-onizle-ac` — kontrol ekranından: `S._acikOdevQuiz`'ten `QUIZ_DZ.onizle`'yi kurar ve "Önizleme: <ödev adı>"
  penceresini açar (yalnız önizleme, "Kapat").
- `quiz-duzenle` — kontrol ekranındaki "Quizi düzenle": `EYLEMLER['odev-duzelt']`'i çağırır, pencereyi quiz bölümüne
  kaydırır.

### Öğretmen: sonuçlar

- `quiz-sonuc-ac` — onay: "Quiz sonuçları öğrencilere şimdi açılsın mı? Bitiren öğrenciler puanlarını ve doğru cevapları
  görür; kendilerine ve velilerine bildirim gider. Henüz başlamamış öğrenciler artık quizi başlatamaz." (+ "Çözmekte olan
  N öğrencinin quizi şimdi biter."). `POST /api/assignments/<id>/quiz/sonuc-ac` → kontrol ekranı yeniden çizilir
  (`odevAc`) → "Quiz sonuçları öğrencilere açıldı; çözmekte olan 2 öğrencinin quizi bitti; 5 öğrenciye bildirim gitti."
- `quizTekrarAcUyarisi(id)` — sonuçlandırılmış quizli ödevde "Tekrar aç"tan önce sorulacak cümle ya da `''`. Sonuç
  kalıcı açıldıysa (`sonucAcildi`) ve quizi hiç başlatmamış öğrenci varsa: "Quizin doğru cevapları açıklandığı için
  quizi çözmemiş 5 öğrenci quizi başlatamaz; yalnızca ödev yeniden açılır." `25-tiklama.js` (`odev-tekrar`) kullanır.
- `quiz-ayrinti` — rozete basınca `GET …/quiz/ayrinti?ogrenci=<id>` → "<ad> — quiz" penceresi (`quizAyrintiHtml`).
  İstek sürerken rozet basılamaz.
- `quizAyrintiHtml(d)` — başlamadıysa "Öğrenci quizi henüz başlatmadı."; bittiyse puan (`div.qz-puan`), sürüyorsa
  "Öğrenci quizi çözüyor; cevaplar değişebilir."; başlama, bitiş ve nedeni, "Sekme / uygulama: 2 kez çıktı, toplam 35
  sn" ya da "Hiç çıkmadı"; "Puan yalnız öneridir; ödevin sonucunu sen seçersin. Sekme kaydı … caydırıcıdır, kesin kanıt
  değildir (ikinci pencere ya da başka cihaz görünmez)."; altında `quizSonucListesi(…, true, sürüyor mu)`.

### Öğrenci ve veli: ödev penceresi

- `EYLEMLER['odev-oku']` (sarma) — dosya yüklenirken önceki kaydı `quizOdevOkuOnceki`'ne alır; tıklamada önce onu
  (`14b-odev-teslim.js`'in sarması, o da `14-odev-filtre.js`'inkini) çalıştırır. Pencerede quiz satırı listedeki özetle çizilmiştir; bakan öğrencinin kendisiyse `GET …/quiz` ister,
  `S.odevHam`'daki özeti (durum, sonuç) günceller ve `#qzOdevSatir`'ı güncel durumla yeniden çizer (başlatılabilir mi,
  neden başlatılamaz). Hata olursa satırın alt yazısına iletisi yazılır.
- `quiz-ac` — ödevi hatırlar (`quizOdevHatirla`), pencereyi kapatır, `git('quiz')`.
- `quizOdevHatirla(id, a)` — `S.quizOdevId` ve `S.quizOdev`'i doldurur, sekmenin belleğine yazar.
- `quizOdevBilgisi(id)` — ödevin adı/dersi: önce `S.odevHam`, sonra `S.quizOdev`, sonra sekmenin belleği; hiçbiri yoksa
  `{ title: 'Quiz' }`.
- `EYLEMLER['veli-teslim']` (sarma; önceki kayıt `quizVeliTeslimOnceki`'nde) — önce `14b-odev-teslim.js`'inkini
  çalıştırır (o pencereyi hemen, istek beklemeden açar), sonra velinin ödev listesinde satıra basınca açılan bu teslim
  penceresinin EN ÜSTÜNE (`S.veliOdevHam`'dan ödev + çocuk eşleşmesiyle) `quizOdevSatiri(a, null)` kutusu
  (`.qz-veli-kutu`) ekler; düğmesiz, yalnız durum.

### Öğrenci: çözme sayfası (`SAYFALAR.quiz`, adres `#/quiz`)

- `SAYFALAR.quiz` — öğrencinin kendisi değilse "Quizi yalnız öğrencinin kendisi çözer." + "Ödevlere dön". Kimlik:
  `S.quizOdevId` ya da sekmenin belleği; ikisi de yoksa (sekme kapanıp adres yeniden açıldı) `GET /api/progress`'te süren
  (`devam`) bir quiz arar, bulursa ona döner, bulamazsa "Açık bir quiz yok. Ödevler sayfasında quizli ödevi açıp "Quizi
  başlat"a bas.". Başka bir quize geçildiyse `QZ`'nin soru sırası, iletisi, bekleyenleri ve kayıt durumları sıfırlanır.
  Ödevin adı bu sekmede bilinmiyorsa `/api/progress`'ten alınır (gelmezse başlıkta "Quiz"). Sonra `GET …/quiz` →
  `quizVeriAl` → `quizSayfaCiz` → `quizSayfayaDondu`. 404/403 (ödev yok, quiz yok, bölüm kapalı) iletisiyle boş kutu;
  başka hata `git()`'in hata iletisine düşer.
- `quizVeriAl(id, d)` — sunucu cevabını `QZ.veri`'ye koyar, saat farkını hesaplar (`QZ.fark`). Soru başına sürede sıra hep
  0 (sunucu yalnız o anki soruyu gönderir). Serbest modda ilk açılışta kalınan soru sekmenin belleğinden, yoksa ilk boş ve
  kapanmamış soru. Gönderilmemiş açık uçlu yazı (`QZ.bekleyen`) sunucudan gelenin üstüne konur (`_yerel`); soru
  kapandıysa ya da deneme bittiyse atılır. Deneme sürmüyorsa `S._sayfaDegisti` temizlenir.
- `quizSoruBul`, `quizSimdikiCevap(s)` (yerel yazı öncelikli), `quizCevapliMi(s)`, `quizCozuluyor()` (quiz sayfasında,
  deneme sürüyor ve `#quizKok` var), `quizSimdikiSoru()`.
- `quizSayfaCiz()` — `div#quizKok.qz-sayfa`'yı yazar, 500 ms'lik sayacı kurar; `quizKokYenile()` — yalnız kökün içini
  yeniden çizer; `quizKokIc()` — duruma göre giriş / çözme / bitti.
- `quizBaslikHtml(a)` — "Quiz" etiketi, ödevin adı, "Matematik · öğretmenin adı".
- `quizGirisHtml(d, a)` — kurallar: soru sayısı (açık uçlu olanlar puanlanmaz), süre ("Bütün quiz için 20 dk süren var.
  Başlayınca süre işler, durdurulamaz…" / "Her sorunun kendi süresi var (toplam …). Sorular sırayla gelir; …
  Bağlantın kopsa da süre işler." / "Süre sınırı yok…" ve son tarihliyse "en geç son teslimden 10 dakika sonra
  kendiliğinden biter"), "Tek hakkın var: quiz ikinci kez çözülemez.", sekme kaydı (ve seçiliyse "Çıkarken açık olan soru
  kapanır"), "Her cevap anında kaydedilir…", sonucun ne zaman açılacağı (hemen / "son teslimden 10 dakika sonra açılır
  (30 Eylül 2026, Çarşamba · 17:10)" / "öğretmenin sonuçları açınca"). Altta **Şimdi başla** ya da nedeni (turuncu), ve
  "Ödevlere dön".
- `quizCozmeHtml(d, a)` — yapışkan üst şerit (`.qz-ust`: ödev adı, "Soru 3/10", kalan süre `#qzKalan` `role="timer"`,
  soru başına sürede süre çubuğu `#qzCubuk`), ileti yeri `#qzUyari`, soru kartı (kapalı soruda "Quizden çıktığın için
  kapandı" / "Süresi doldu" etiketi ve kilitli cevaplar), kayıt yazısı `#qzKayit`; serbest modda soru numaraları
  (`nav#qzNoktalar`), "Önceki / Sonraki" ve "Bitir"; soru başına sürede "Sonraki soruya geçince bu soruya dönülmez." +
  "Sonraki soru" (son soruda "Son soru." + "Bitir").
- `quizNoktalarIc()` / `quizNoktalariYenile()` — soru numarası düğmeleri (`.simdiki`, `.cevapli`, `.kapali`;
  `aria-current="step"`, "3. soru, cevaplandı").
- `quizKayitHtml(s)` / `quizKayitGoster(soruId, tur, metin)` — "Kaydediliyor...", "Yazdıkların birazdan kaydedilecek",
  "Kaydedilemedi: <neden>" + **Tekrar dene** (`quiz-kaydet-tekrar`), "Kaydedildi · 14:03:12".
- `quizUyari(tur, metin)` — üstteki iletiyi yazar/siler (yeniden çizimde de kalsın diye `QZ.mesaj`'da tutulur).
- `quizYol(ek)` — `/assignments/<ödev>/quiz<ek>`.
- `quizCevapGonder(s)` — cevabı `QZ.kuyruk`'a koyar: `POST …/quiz/cevap { soruId, secilenler | metin }`. Başarıda
  sorunun `cevap`'ı ve kayıt saati güncellenir, bekleyen yazı aynıysa silinir, bekleyen kalmadıysa `S._sayfaDegisti`
  temizlenir, numaralar yenilenir. 409 (`kapandi` ve güncel `durum`) gelirse durum alınır, sunucunun iletisi turuncu
  gösterilir, sayfa yeniden çizilir; başka hata → "Kaydedilemedi" + **Tekrar dene**.
- `quizBekleyenleriGonder()` — yazma zamanlayıcısını durdurup bekleyen açık uçlu yazıları hemen gönderir (aynı metin
  zaten gidiyorsa ikinci kez göndermez). Soru değiştirme, sonraki, bitir, süre dolması, sekme gizlenmesi, sayfa değişimi,
  sekme kapanması ve kutudan çıkış hep bunu çağırır.
- Belgeye kurulan dinleyiciler: `change` (`.qz-sec`) — seçilen şıklar DOM'dan toplanır; önizlemedeyse yalnız
  `onizle.secim`'e, çözme sayfasındaysa sorunun cevabına yazılıp **hemen** gönderilir. `input` (`.qz-cevap-metin`) —
  karakter sayacı; çözerken yazı `QZ.bekleyen`'e girer, "Yazdıkların birazdan kaydedilecek", yazmayı bırakınca 1,2 sn
  sonra gönderilir. `focusout` — kutudan çıkınca hemen gönderilir.
- Pencereye kurulan dinleyiciler: `hashchange` — bekleyenleri gönderir; `setTimeout 0` ile (sayfa değişimi bitsin diye)
  quiz sayfasından çıkıldıysa `quizSayfadanCikti()`. `beforeunload` — quiz sayfasında gönderilmemiş yazı varsa
  gönderimi başlatır ve tarayıcıya "sayfadan çıkılsın mı?" sordurur.
- `quiz-basla` — "Başlatılıyor..." → `POST …/quiz/basla` → sıra ve kalınan soru belleği sıfırlanır, çözme ekranı.
  Başlatılamazsa (400 `baslatilamaz`) sunucunun nedeni gösterilir ve durum yeniden okunur (kurallar sayfası nedeniyle).
- `quiz-git` — serbest modda `data-sira` sorusuna geçer (numaralar ve Önceki/Sonraki aynı eylem); bekleyenleri gönderir,
  sırayı sekmenin belleğine yazar; sayfa aşağı kaydırılmışsa (kökün üstü görünmüyorsa) kökün başına kaydırır. Soru
  başına sürede bir şey yapmaz.
- `quizSonrakiIste(soruId, mesaj)` — soru başına sürede `POST …/quiz/sonraki { soruId }` (aynı soru için ikinci istek
  gitmez). Cevap yeni durumdur; süre dolup geçildiyse "Önceki sorunun süresi doldu; bu soruya geçildi.". Hata → ileti ve
  5 sn bekleme (bağlantı yokken her yarım saniyede denenmesin).
- `quiz-sonraki` — son sorudaysa "Quiz bitirilsin mi? Bitirince cevapların değiştirilemez.", boş (ve kapanmamış) soruyu
  geçerken "Bu soruyu boş geçiyorsun; geri dönemezsin. Sonraki soruya geçilsin mi?" onayı; sonra `quizSonrakiIste`.
- `quiz-bitir` — "Cevaplamadığın 2 soru var. Quiz bitirilsin mi? …" onayı → bekleyenler → `POST …/quiz/bitir` (aynı
  kuyrukta, cevaplardan sonra) → bitti ekranı.
- `quizTik()` — her 500 ms: quiz sayfasından çıkıldıysa `quizSayfadanCikti` ve sayacı durdurur. Çözerken hedef an: soru
  başına sürede `deneme.soruBitis`, öbürlerinde `deneme.sonAn` (bütün quiz süresi ya da son teslim + 10 dk, hangisi önce
  geliyorsa). Hedef yoksa ya da süresiz quizde bir saatten fazla varsa "Süresiz"; değilse "4:05" ve alt yazı ("bu soru
  için" / "kalan süre" / "kapanmasına"). Son dakika turuncu (`.az`), son 10 sn kırmızı (`.cok-az`); kısa sorularda sürenin
  üçte biri ve yedide biri. Süre çubuğu kalan oranda. Süre bitince `quizSureDoldu()`.
- `quizSureDoldu()` — soru başına sürede sonraki soruyu ister; öbürlerinde bekleyenleri gönderip 3,5 sn sonra (sunucunun 3
  sn gecikme payından sonra) `quizTazele()` → `GET …/quiz` ile sunucunun kapattığı durumu alır (hata olursa 5 sn sonra
  yeniden denenebilir).
- `quizBittiHtml(d, a)` — bitiş nedeni ve saati, "Quizden 2 kez çıktın (35 sn); öğretmenin görür.", sonuç açıksa puan ve
  "Cevapların" altında `quizSonucListesi(d.sorular, false)`; değilse "Puanın ve doğru cevaplar son teslimden 10 dakika
  sonra (…) açılır; öğretmenin daha önce de açabilir. Açılınca bildirim gelir." ya da "… öğretmenin sonuçları açınca
  görünür; açılınca bildirim gelir.".
- `quizGeriDugmesi()` — "Ödevlere dön" (`data-nav="odevler"`).

### Sekme / uygulama değiştirme

- `document` `visibilitychange` — yalnız çözerken. Gizlenince çıkış anı ve o anki soru saklanır, bekleyen yazılar
  gönderilir. Görünür olunca geçen süre 2 sn'den azsa hiçbir şey; değilse kuyruğa (cevaplardan SONRA) `quizOdakGonder`.
  `blur` dinlenmez (bildirim perdesinde de tetiklenir).
- `quizOdakGonder(sure, soruId, cevapBekle, hedefOdev)` — `fetch('/api/assignments/<id>/quiz/odak', { keepalive: true,
  Authorization başlığı })`, gövde `{ sure: saniye, soruId }`. Oturum başlıkta taşındığı için `sendBeacon` kullanılamaz.
  `cevapBekle` ise cevaptaki durum alınır; `cikisSayildi` ise "Quizden çıktığın kaydedildi." (+ "Çıkarken açık olan soru
  kapandı."). Ağ hatası yutulur.
- `quizSayfadanCikti()` — quiz sürerken uygulama içinde (menü, geri tuşu) quiz sayfasından ayrılma: anı, soruyu, hangi
  quiz olduğunu ve KİMİN ayrıldığını (`S.user.id`) saklar (`cikisIc`). Ayrılmışken sekme değişirse aynı çıkış sürer.
- `quizSayfayaDondu()` — `SAYFALAR.quiz` sonunda: uygulama içi çıkış varsa ve dönen aynı kişiyse ve 2 sn'yi geçtiyse
  bildirir; başka bir quize dönüldüyse eskisinin çıkışı cevap beklenmeden gider.
- `window` `pagehide` — dışarıdayken (sekme gizli ya da quiz sayfasından ayrılmış) sekme kapanırsa o ana kadarki süre
  gider (başka kişi girmişse uygulama içi çıkış gitmez).

### Sayfadaki öğe kimlikleri

| Kimlik / ad | Nerede |
|---|---|
| `#qzAlan-<kimlik>`, `#qzBilgi-<kimlik>`, `#qzSureAd-`, `qzSure-` (radyo adı), `#qzDk-`, `#qzCikinca-`, `#qzSonuc-`, `#qzSonucNot-`, `qzDy-<kimlik>-<i>` | düzenleyici |
| `#qzYapistir-<kimlik>`, `#qzMetinSonuc-<kimlik>` | Metinden ekle |
| `qzOnz-<kimlik>-<sıra>` (seçim grubu) | önizleme |
| `#qzOdevSatir` | ödev penceresindeki quiz satırı |
| `#quizKok`, `#qzKalanKutu`, `#qzKalan`, `#qzKalanAlt`, `#qzCubuk`, `#qzUyari`, `#qzKayit`, `#qzNoktalar`, `qzCevap-<soruId>` | çözme sayfası |

## Kimle konuşur?

- Çağırdıkları (çoğu olay anında çağrıldığı için ad sırası önemsiz; iki istisna: yüklenirken `IKONLAR`'a yazar —
  `02-ikonlar.js` önce gelir — ve iki eylemi sarar — `14`/`14b` önce gelir):
  - [00-durum.md](00-durum.md) — `S` (`user`, `token`, `page`, `viewStudentId`, `odevHam`, `veliOdevHam`, `_acikOdev`,
    `_acikOdevQuiz`, `_sayfaDegisti`, `quizOdevId`, `quizOdev`).
  - [01-yardimcilar.md](01-yardimcilar.md) — `$`, `esc`, `api` (hata nesnesinde `durum` ve `veri`), `EYLEMLER`.
  - [02-ikonlar.md](02-ikonlar.md) — `IKONLAR`, `ik` (`soru`, `onay`, `hayir`, `kilit`, `goz`, `saat`, `uyari`, `ekle`,
    `geri`, `grafik` + eklediği `yukari`, `asagi`), `tarihSaat`, `tarihGun`.
  - [03-mesaj-modal.md](03-mesaj-modal.md) — `modalAc`, `modalKapat`, `sayfaMesaji`.
  - [05-giris.md](05-giris.md) — `dugmeBekle`, `dugmeBitir`.
  - [07-yonlendirme.md](07-yonlendirme.md) — `git`, `yaz`, `hero`, `bosKutu`.
  - [11-ogretmen-odev.md](11-ogretmen-odev.md) — `odevAc` (sonuçları açtıktan sonra), `EYLEMLER['odev-duzelt']`.
  - `21-ders-programi.js` — `yetkim`; `25-tiklama.js` — `hataGoster` (tarayıcının uyarı kutusu).
  - Sardığı eylemler: `odev-oku` (`14b-odev-teslim.js` → `14-odev-filtre.js`), `veli-teslim` (`14b-odev-teslim.js`).
    Bu dosya ad sırasında ikisinden SONRA geldiği için sarma çalışır.
- Sunucu uçları (hepsi [../../../sunucu/bolumler/quiz.md](../../../sunucu/bolumler/quiz.md); yönlendirme
  [../../../sunucu/bolumler/odev.md](../../../sunucu/bolumler/odev.md)):
  - Öğrenci: `GET /api/assignments/<id>/quiz` (durum; ödev penceresi, sayfa, başlatılamayınca, süre dolunca),
    `POST …/quiz/basla`, `POST …/quiz/cevap { soruId, secilenler, metin }` (409 `{ kapandi, durum }`),
    `POST …/quiz/sonraki { soruId }`, `POST …/quiz/bitir`, `POST …/quiz/odak { sure, soruId }` (`fetch` keepalive,
    `api` dışında). Hız sınırları sunucuda (başlat 10 dakikada 30, cevap 600, odak 120).
  - Öğrenci: `GET /api/progress` ([../../../sunucu/bolumler/ilerleyis.md](../../../sunucu/bolumler/ilerleyis.md)) —
    süren quizi bulmak ve ödevin adını almak için. Öğrenci ve veli listelerindeki `a.quiz` özeti (durum; puan yalnız
    sonuç açılınca) de oradan gelir (`ilerleyisOzetleri`; veli her çocuğu için ayrı `/progress` ister).
  - Listelerin öbür özetleri (bu dosya yalnız çizer): öğretmen listesindeki `a.quiz` (`listeOzetleri`: soru sayısı,
    süre, başlayan, biten) `GET /api/assignments`'tan ([../../../sunucu/bolumler/odev.md](../../../sunucu/bolumler/odev.md)),
    müdürün ders ödevlerindeki `GET /api/school/assignments`'tan
    ([../../../sunucu/bolumler/okul.md](../../../sunucu/bolumler/okul.md)); kontrol ekranındaki öğrenci rozetlerinin
    `s.quiz`'i (`ogrenciOzetleri`) `GET /api/assignments/<id>`'den.
  - Öğretmen/müdür: `POST /api/assignments/quiz-metin { metin }` (öğretmen başına 10 dakikada 300),
    `GET …/quiz/ayrinti?ogrenci=<id>`, `POST …/quiz/sonuc-ac` (`odev.sonuclandir`).
  - Bu dosyanın ürettiği gövdeyi başkaları gönderir: `POST /api/assignments { …, quiz }` (`25-tiklama.js`,
    `odev-kaydet`) ve `POST /api/assignments/<id>/quiz { quiz }` (`11-ogretmen-odev.js`, düzeltme; öğrenci başladıysa 409
    `{ kilitli, baslayan }`). Kontrol ekranının quizi (`S._acikOdevQuiz`) `GET /api/assignments/<id>`'den gelir.
- Onu kullananlar:
  - [11-ogretmen-odev.md](11-ogretmen-odev.md) — `quizListeEtiketi` (öğretmen listesi ve müdürün ders ödevleri),
    `quizOgretmenListeSatiri`, `quizAlani('odev'|'duzelt', …)`, `quizOgretmenSatiri`, `quizOgrenciRozeti`,
    `quizPencereAyari`, `quizGovdesi('duzelt')`, `quizDegistiMi`, `QUIZ_DZ.duzelt` (kilit), `quizAlaniYenile`,
    `quizYenidenCiz`.
  - `14-odev-filtre.js` — öğrenci listesinde `quizListeEtiketi`, `quizListeDurumu`; ödev penceresinde
    `ekListesiGoster(a.ekler, quizOdevSatiri(a, null))`.
  - [04d-ekler.md](04d-ekler.md) — `ekListesiGoster`'in `ilkSatir`'ı quiz satırı içindir.
  - `25-tiklama.js` — `quizGovdesi('odev')` ("Ödevi ver"), `quizTekrarAcUyarisi` ("Tekrar aç").
  - `27-veli-panel.js` — `quizListeEtiketi`, `quizListeDurumu(a.quiz, false)`; `S.veliOdevHam`'ı bu dosya için tutar.
  - [06-menu.md](06-menu.md) — `SAYFA_OZELLIK.quiz = 'odev'`: okul ödevleri kapattıysa `#/quiz` "Bu bölüm okulunda
    kapalı." gösterir. Sayfa menüde yok; yalnız `quiz-ac` ile ya da adresle açılır.
  - `public/js/yonetim/09b-site-ayarlari.js` — yönetim paketi uygulama parçalarıyla birleştiği
    ([../../../sunucu/http.md](../../../sunucu/http.md) `YONETIM_JS`) için yapımcı sırası düğmeleri bu dosyanın
    `ik('yukari')`, `ik('asagi')` ikonlarını ve `.qz-ikon-btn` biçimini kullanır. Paket iki klasörü ad sırasıyla karıştırdığı
    için `09b-site-ayarlari.js` bu dosyadan ÖNCE gelir; yine de çalışır, çünkü `ik()` sayfa çizilirken çağrılır ve o anda
    bütün paket (ve iki ok) yüklenmiştir. Oklar yükleme anında (üst düzeyde) istenirse boş çıkar.
- CSS: `public/css/parcalar/35-quiz.css` — bu dosyanın bütün `qz-` sınıfları (listeler ve ekler, rozet, düzenleyici ve
  `.modal.qz-genis`, Metinden ekle, soru ve üst şerit — yapışkan `.qz-ust`, `.qz-kalan.az/.cok-az`, süre çubuğu —, soru
  numaraları, giriş ve bitiş, sonuç listesi, öğretmenin ayrıntısı, telefonda küçülme ve dokunmatikte 44 px). Yalnız
  JavaScript'in seçici olarak kullandığı `qz-sec`, `qz-tur`, `qz-sure`, `qz-sure-turu`, `qz-cikinca`,
  `qz-sonuc-gorunum`, `qz-sik-dogru`, `qz-karakter-sayi` ve `qz-giris`'in kendi kuralı yok. Ortak sınıflar başka
  parçalardan: `02-form.css` (`.btn.kucuk`, `.ghost`, `.baglanti`, `.hint`, `.onay`, `.alan-hata`, `.ek-satir`,
  `.ekler-kutu`), `04-kartlar.css` (`.kart`, `.etiket`, `.bos`), `06-modal.css` (pencere).
- Roller:

| Rol | Bu dosyada gördüğü |
|---|---|
| Öğretmen | Düzenleyici ("Yeni ödev", "Ödevi düzenle"; yazmak `odev.ver`), listelerde rozet ve "N öğrenciden M kişi bitirdi", kontrol ekranında quiz satırı, rozetler, ayrıntı, "Sonuçları şimdi aç" (`odev.sonuclandir`) |
| Müdür | Öğretmenin gördüğü her şey (`yetkim` müdüre hep evet der); ders ödevleri listesinde rozet; öğretmeni ayrılmış ödevin kontrol ekranı |
| Öğrenci | Listede durum, ödev penceresinde quiz satırı, `#/quiz` sayfası |
| Veli | Listede durum, satır penceresinde quiz kutusu; çocuğunun portalından bakınca da yalnız durum |
| Öğrencinin portalından bakan müdür/öğretmen | Yalnız durum ve (açıksa) puan; `#/quiz` "yalnız öğrencinin kendisi çözer" der |
| Yönetici | Quiz ekranı yok; yalnız ikonlar ve düğme biçimi Site ayarlarında |
| Servisçi, rolsüz hesap | Menüden ve düğmeden hiçbir quiz ekranına ulaşmaz; adres çubuğuna `#/quiz` yazılırsa (bölüm okulda açıksa) "Quizi yalnız öğrencinin kendisi çözer." kutusu çıkar |

- Tarayıcı depoları: yalnız `sessionStorage` (`ee_quiz_odev`, `ee_quiz_odev_bilgi`, `ee_quiz_sira_<ödevId>`).
- Android uygulaması bu dosyayı kullanmaz; site uygulaması (PWA) kullanır.

## Nasıl çalışır (adım adım)?

### Öğretmen quizi hazırlar ve kaydeder

```
"Yeni ödev" (11-ogretmen-odev) ─► quizAlani('odev', null) ─► QUIZ_DZ.odev = { acik: false … } ─► "Quiz ekle" düğmesi
"Quiz ekle" ─► acik = true, quizBos() ─► quizYenidenCiz ─► quizPencereAyari (geniş pencere, perde kapatmaz)
her düğme (soru ekle/sil/taşı, şık ekle/sil) ve tür/süre değişimi:
      quizDomdanOku (ekrandakini duruma yaz) ─► durumu değiştir ─► quizYenidenCiz
"Ödevi ver" (25-tiklama odev-kaydet) ─► quizGovdesi('odev')
      ├ yapıştırılıp eklenmemiş metin ─► { hata }            ─► #mHata, ödev gitmez
      ├ bölüm kapalı                   ─► { quiz: null }     ─► gövdede quiz yok
      └ quizGonderilecek ─► quizDenetle ─┬ hata ─► soru kırmızı + { hata } ─► ödev gitmez
                                         └ tamam ─► POST /api/assignments { …, quiz } (ödev + quiz tek işlem)
"Ödevi düzenle" ─► quizAlani('duzelt', S._acikOdevQuiz) (ilk = sunucudaki hâl)
"Kaydet" ─► quizGovdesi('duzelt') ─► quizDegistiMi ─ hayır ─► yalnız …/update
                                                 └ evet ─► POST …/quiz ─┬ 200 ─► ilk = yeni hâl
                                                                        └ 409 kilitli ─► bölüm kilitli çizilir
```

### Metinden ekle

```
"Metinden ekle" ─► panel ─► öğretmen yapıştırır ─► 0,7 sn sonra POST /assignments/quiz-metin (sıra no'lu)
     ◄─ { sorular, hatalar } ─► "6 soru bulundu · 2 sorun" + liste
"Ekle" ─► boş ilk soru varsa yerine, yoksa sona ─► sorunlar sorulara `uyari` (numara düzenleyici sırasına çevrilir)
      ─► bilgi: "6 soru eklendi. Sorunlu 2 soru kırmızıyla işaretlendi; düzelt." ─► ilk kırmızıya kaydır
öğretmen kırmızı soruya yazar ─► input dinleyicisi kırmızıyı ve uyarıyı kaldırır
```

### Öğrenci quizi çözer

```
Ödevler ─► satır (odev-oku) ─► pencere: quizOdevSatiri(a, null) ("Quiz bilgisi yükleniyor...")
          └ bu dosyanın sarması: GET …/quiz ─► satır: "Quizi başlat" | "Devam et" | "Sonucu gör" | engel
"Quizi başlat" (quiz-ac) ─► S.quizOdevId + sekme belleği ─► git('quiz')
SAYFALAR.quiz ─► GET …/quiz ─► quizVeriAl ─► quizSayfaCiz (500 ms sayaç) ─► quizSayfayaDondu
  baslamadi ─► kurallar ─► "Şimdi başla" ─► POST …/basla ─► çözme ekranı
  devam:
     şık seçildi ─► quizCevapGonder ─┐
     yazı: 1,2 sn / kutudan çıkış ───┴► QZ.kuyruk ─► POST …/cevap ─► "Kaydedildi · 14:03:12"
     soru başına süre bitti ─► POST …/sonraki (kuyrukta)   |  bütün/süresiz bitti ─► 3,5 sn ─► GET …/quiz
     "Bitir" ─► bekleyenler ─► POST …/bitir (kuyrukta, cevaplardan sonra)
  bitti ─► quizBittiHtml: sonuç açıksa puan + cevaplar + doğrular, değilse ne zaman açılacağı
```

`QZ.kuyruk` bütün yazan istekleri sıraya dizer: bir cevap ile ardından gelen "sonraki", "bitir" ya da sekme kaydı asla
yer değiştirmez; böylece çıkış sırasında açık olan soru kapanmadan önce cevabı kaydedilmiş olur.

### Sekme kaydı

```
çözerken sekme gizlendi ─► QZ.cikis = şimdi, cikisSoru ─► bekleyen yazılar gider
geri geldi ─► < 2 sn: hiçbir şey
           └ ≥ 2 sn: kuyruğa POST …/odak { sure, soruId } ─► durum + "Quizden çıktığın kaydedildi."
menüyle / geri tuşuyla başka sayfa ─► quizSayfadanCikti (kişi, quiz, soru, an saklanır)
      ─► quiz sayfasına dönüş ─► quizSayfayaDondu ─► aynı kişi ve ≥ 2 sn ise odak
dışarıdayken sekme kapandı ─► pagehide ─► odak (cevap beklenmez)
```

## Dikkat!

- **Doğru cevap bu dosyada yoktur.** Öğrenci ekranları doğru bilgisini yalnız sunucudan, sonuç açılınca alır
  (`dogruSecenekler`, `dogruMu`). Öğrenciye görünen yeni bir şey eklersen onu sunucudan iste; burada hesaplama. Önizleme
  öğretmenin tarayıcısında çalışır ve doğruyu hiç göstermez.
- **Sayaç yalnız gösterir.** Süre sunucuda işler; sayaç sunucunun saatine göre (`QZ.fark`) sayar. Süre dolunca istemci
  yalnız sunucuya sorar (soru başına sürede `sonraki`, öbürlerinde 3,5 sn sonra `GET`); sunucu zaten kapatır.
- **Hızlı iki seçimden ikincisi kaydedilemezse "Tekrar dene" birinciyi gönderir.** (Kod okumasına göre; tarayıcıda
  denenmedi.) Seçimler kuyrukta sırayla gider; `quizCevapGonder`'in başarı işleyicisi sorunun `cevap.secilenler`'ini o
  isteğin gövdesiyle ezer. Öğrenci A'yı seçip hemen B'ye geçerse: A'nın isteği başarılı olur ve durumu `[A]` yapar
  (ekranda B işaretli kalır); B'nin isteği ağ hatasıyla düşerse "Kaydedilemedi" + **Tekrar dene** çıkar ve bu düğme
  `s.cevap.secilenler`'i yani A'yı gönderir, ardından "Kaydedildi" yazar. Öğrenci B'yi kaydettiğini sanar. Aynı nedenin
  ikinci yüzü (serbest modda): A'dan hemen sonra B seçilip "Sonraki"ye, A'nın cevabı geldikten sonra da "Önceki"ye
  basılırsa soru `[A]` ile yeniden çizilir; ardından B'nin isteği başarılı olur ve sunucuda B kalır, ama işleyici
  yalnız kayıt yazısını ve numaraları yeniler, şıkları yeniden çizmez — ekranda A işaretli görünür. Açık uçlu
  sorular etkilenmez (yazı `_yerel`'den gider). Düzeltme önerisi: başarı işleyicisi sonraki bir istek beklerken
  seçimi ezmesin ya da **Tekrar dene** seçimi DOM'dan okusun.
- **Oturum kapanınca quiz durumu sıfırlanmıyor.** (Kod okumasına göre; denenmedi.) `26-baslat.js`'teki
  `oturumDurumunuSifirla` `QZ`'ye, `S.quizOdevId`/`S.quizOdev`'e ve sekme belleğindeki `ee_quiz_*` anahtarlarına
  dokunmaz; giriş-çıkış sayfayı yenilemez. Aynı sekmede önce bir öğrenci quizi çözüp çıkar, sonra aynı ödevdeki başka
  bir öğrenci girip quizi başlatırsa: (1) `QZ.kayit` sıfırlanmadığı için öncekinin cevapladığı sorularda "Kaydedildi ·
  <öncekinin saati>" görünür (sonrakinin cevabı boşken); (2) önceki öğrenci quiz sayfasındayken (deneme sürerken)
  çıktıysa, sonraki kişi girip başka sayfaya düştüğünde `quizTik`/`hashchange` bunu "quiz sayfasından ayrılma" sayar ve
  `cikisKisi` olarak YENİ kişiyi yazar — "başka kişi girdiyse gitmez" koruması bu yolda işlemez; yeni kişinin aynı
  quizde süren bir denemesi varsa quiz sayfasını açınca ona yanlış bir çıkış (ve "çıkınca kapanır" seçiliyse bir
  sorusunun kapanması) yazılabilir;
  (3) önceki kişinin kaydedilemeyen açık uçlu yazısı `QZ.bekleyen`'de kalırsa, yeni kişi aynı quizde zaten "devam"
  ediyorsa o yazı onun kutusuna düşer. Öneri: `oturumDurumunuSifirla` `QZ`'yi ve `S.quizOdevId`'yi sıfırlasın, sayacı
  durdursun.
- **Sekmeyi kapatmak ya da yenilemek çıkış sayılmaz.** Kapanışta tarayıcı `visibilitychange` (gizli) gönderse bile
  hemen ardından gelen `pagehide`'da geçen süre 2 sn'nin altında kalır, hiçbir şey gitmez; sekme yeniden açılınca aradaki
  süre de sorulmaz. Başka pencere, başka cihaz ve değiştirilmiş istemci de görünmez. Kayıt caydırıcıdır; ekranlar bunu
  söylüyor. (Kod okumasına göre; bir tasarım sınırı, hata değil — ama öğretmenin bilmesi gereken bir boşluk.)
- **`QZ.kuyruk` sırası bilerek.** Yazan her istek (cevap, sonraki, bitir, odak, tazele) aynı söz zincirine eklenir.
  Kuyruğa girmeyen yeni bir yazan istek eklersen çıkış kaydı cevaptan önce varıp soruyu kapatabilir.
- **Kuyruk bir kez reddedilirse bir daha çalışmaz.** Her halka `QZ.kuyruk.then(fn)` diye, ret işleyicisi olmadan eklenir.
  Bugünkü işleyiciler hata yakalıyor (`api(...).then(başarı, hata)`, odakta `catch`), ama bir başarı ya da hata
  işleyicisinin İÇİ hata fırlatırsa zincir kalıcı olarak reddedilmiş olur: sonraki bütün cevaplar, "Sonraki" ve "Bitir"
  hiç gönderilmez ve ekranda da bir şey söylenmez (sayfa yenilenene dek). Bu işleyicilere kod eklerken fırlatmamasına
  dikkat et; sağlamlaştırmak istersen her halkanın sonuna `['catch']` konabilir. (Kod okumasına göre; bugün tetikleyen
  bir yol bulunmadı.)
- **Cevabı beklenmeyen `odak` isteğinin ağ hatası yakalanmaz.** `quizOdakGonder(…, cevapBekle = false)` (sekme kapanırken
  `pagehide` ve başka quize dönülünce eskisinin çıkışı) `fetch` sözünü bırakır; bağlantı yoksa tarayıcı konsoluna
  "yakalanmamış söz reddi" düşer. Kullanıcı bir şey görmez; ama planlı "tarayıcı hata günlüğü" `unhandledrejection`
  dinleyecek, orada gürültü yapar.
- **Sarma sırası ad sırasına bağlı.** `odev-oku` zinciri: `14-odev-filtre.js` (pencere) → `14b-odev-teslim.js` (teslim
  bölümü) → bu dosya (quiz satırının tazelenmesi); `veli-teslim`: `14b` → bu dosya. Dosya adı değişirse ya da araya
  aynı eylemi yeniden tanımlayan bir parça girerse zincir kopar ([01-yardimcilar.md](01-yardimcilar.md) "`EYLEMLER`
  adları tek olmalı").
- **Sayfa değişiminde iki `hashchange`.** Bu dosyanın dinleyicisi paket yüklenirken, `25-tiklama.js`'inki açılışta
  (`tiklamaKur`) kurulur; bu yüzden önce bu dosyanınki çalışır: bekleyenleri gönderir ve çıkışı `setTimeout 0` ile
  sayfa değiştikten sonra değerlendirir. `25-tiklama.js` sayfa değişimini geri çevirirse (`TEK_SEFER`, commit 543)
  `S.page` `quiz` kalır, çıkış sayılmaz.
- **`S._sayfaDegisti` iki yerden yönetilir.** `25-tiklama.js` `#sayfa` içindeki her yazıyı "kaydedilmedi" sayar; bu dosya
  bekleyen yazı kalmayınca ve deneme bitince bayrağı indirir. Böylece "Yenile" yalnız gerçekten gönderilmemiş yazı varken
  sorar.
- **`beforeunload` gönderimi garanti değil.** Gönderilmemiş yazı varken sekme kapanırsa tarayıcı sorar ve o sırada
  gönderim başlar; ama `api` `keepalive` kullanmaz, kişi hemen "Ayrıl" derse istek kesilebilir. Yazıların çoğu zaten
  1,2 sn'de ya da kutudan çıkınca gitmiştir.
- **`odak` isteği `api` dışında.** `fetch`'i kendisi kurar (`keepalive` için): 401'de oturumu kapatmaz, hatayı yutar.
  Adresi değiştirirsen burayı da değiştir.
- **İstemci sınırları sunucuyla elle eşit.** `QUIZ_SINIRI` ve `quizDenetle`'nin kuralları sunucudaki `QUIZ_SINIR` ve
  `quizDogrula` ile aynı olmalı ([../../../sunucu/yardimci/quiz.md](../../../sunucu/yardimci/quiz.md)). Birini
  değiştirip ötekini unutursan ya öğretmen boşuna hata görür ya da hata ancak "Ödevi ver"de sunucudan gelir. Bugün de
  iki küçük fark var: istemci yalnız baştaki/sondaki boşluğu kırpar, sunucu `quizMetinTemizle` ile Word'ün görünmez
  karakterlerini de siler — yalnız görünmez karakterden oluşan bir soru metni ya da şık istemciden geçer, sunucudan
  "boş" diye döner; ve boş şık iletisi istemcide harfle ("3. sorunun B şıkkı boş…"), sunucuda sırayla ("3. sorunun 2.
  şıkkı boş.") yazılır.
- **Düğmeler ders kapsamını bilmez.** "Quizi düzenle" ve "Sonuçları şimdi aç" `yetkim` ile gösterilir; yetki derse göre
  daraltılmışsa sunucu 403 verir, ileti tarayıcının uyarı kutusunda (`hataGoster`) çıkar.
- **Kontrol ekranının sayıları açıldığı anın.** "Sonuçları şimdi aç" onayındaki "çözmekte olan N öğrenci" ve "Tekrar
  aç" uyarısındaki sayı `S._acikOdevQuiz`'ten gelir; ekran açıkken başlayan/bitiren öğrenci sayılmaz. Asıl sayıyı
  sunucunun cevabı söyler ("… N öğrencinin quizi bitti").
- **Perde kilidi geri kalkmaz.** `quizPencereAyari` düzenleyici açılınca `data-zorunlu` koyar, "Quizi kaldır"dan sonra
  kaldırmaz; o pencere kapanana dek dışarı tıklamak onu kapatmaz ("Vazgeç" kapatır).
- **`QUIZ_DZ.onizle` ile `d.onizle` farklı şeyler.** Biri kontrol ekranı önizlemesinin düzenleyici kaydı (kimlik
  `onizle`), öbürü her kaydın içindeki "önizleme açık" durumu. Karıştırma.
- **Öğrenci olmayan biri `#/quiz`'i açarsa** "Ödevlere dön" öğrencinin ödev sayfasına (`odevler`) gider; öğretmen, müdür
  ya da bir çocuğun portalını açmamış veli için orası `GET /api/progress` 404 "Öğrenci bulunamadı" iletisi verir.
  Küçük bir yol sorunu (kod okumasına göre); öğrenci ve portaldan bakan veli için doğru çalışır.
- **`25-tiklama.js`'teki bir yorum eski.** `odev-tekrar` üstündeki yorum "tekrar açınca quizi çözmemiş öğrenci
  başlatabilir" diyor; bugünkü kural tersi (sonuç kalıcı açıldıysa başlatamaz — `quizTekrarAcUyarisi`, sunucu ve
  KILAVUZ da böyle). Kod doğru, yorum yanıltıcı.
- **`test-quiz-metin.js` bu dosyayı `vm` içinde çalıştırır.** Dosyanın üst düzeyinde (işlev dışında) yalnız `IKONLAR`,
  `EYLEMLER`, `SAYFALAR`, `Promise`, `document.addEventListener` ve `window.addEventListener` kullanılıyor; testin
  sahteleri bunları (ve denediği işlevlerin kullandığı `S`, `esc`, `ik`, `tarihGun`, `tarihSaat`, `yetkim`'i) sağlar. Üst
  düzeye başka bir şey (ör. `$('…')`, `localStorage`) eklersen test yüklenirken kırılır.
- **Seçici ve eylem adlarını değiştirme.** `araclar/gezinti.js` ekran turu `quiz-ekle`, `quiz-metin-ac`, `quiz-metin-ekle`,
  `quiz-onizle`, `quiz-ayrinti`, `quiz-ac`, `quiz-basla`, `.qz-yapistir`, `.qz-metin-sonuc`, `.qz-sure-turu`, `.qz-ayar`,
  `.qz-sorular`, `.qz-onizle .qz-secenek`, `.qz-secenek` ile gezer (bir de bu dosyanın sardığı `odev-oku` ve
  `veli-teslim` ile); `yukari`/`asagi` ikonları ve `.qz-ikon-btn` yönetim paketinde de kullanılır.
  `index.html`'deki SSS ("Quiz nasıl çözülür, kaç hakkım var?"), `belge/KILAVUZ.md` "Quiz" bölümü ve albümün açıklama
  yazıları (`araclar/gezinti-metin.js`: "Quiz · 5 soru · 20 dk" satırı, **Önizle**, **Quizi düzenle**, **Sonuçları
  şimdi aç**…) bu dosyanın düğme adlarını ve iletilerini anlatır; metin değişirse onlar da değişmeli.
- **Kapanma nedeni `gecildi` yazılmaz.** Soru başına sürede "Sonraki"yle geçilen soru öğretmenin ayrıntısında yalnız geçen
  süreyle görünür; "Süre doldu" ve "Çıkınca kapandı" yazılır.

## Testleri

- `testler/test-quiz-metin.js` (sunucusuz, `tumtest.sh`'nin ilk döngüsünde) — "7) ÖN YÜZ METİNLERİ" bölümü bu dosyayı
  sahte `esc`, `ik`, `tarihGun`, `tarihSaat`, `yetkim`, `document`, `window` ile bir `vm` bağlamında yükler ve dener:
  son tarihsiz ödevin kurallarında sonuç "öğretmenin sonuçları açınca görünür" ve "son teslim" geçmiyor; son tarihli
  ödevde "son teslimden 10 dakika sonra açılır (…)" ve "en geç son teslimden 10 dakika sonra"; son tarihsiz bitti
  sayfası; süresiz quizin ödev satırı "süre işler" demiyor, süreli olanı diyor; öğretmen satırı son tarihliyse "son
  teslimden 10 dakika sonra", değilse "sen açınca"; düzenleyicideki son tarihsiz ödev notu; `quizTekrarAcUyarisi`'nin
  dört durumu (kalıcı açık → "2 öğrenci quizi başlatamaz… yalnızca ödev yeniden açılır", "Hemen"de de aynı, kalıcı
  değilse ve herkes başladıysa uyarı yok). Aynı dosyanın geri kalanı sunucudaki ayrıştırıcıyı ve doğrulamayı dener.
- `testler/test-quiz.js` — bu dosyanın çağırdığı bütün quiz uçları (doğru şıkkın sızmaması, kilit, tek deneme, süreler,
  sonuç görünürlüğü, sekme kaydı, yetkiler); ayrıntı [../../../sunucu/bolumler/quiz.md](../../../sunucu/bolumler/quiz.md).
- `testler/buton-denetimi.js` — `quiz-*` eylemlerinin hepsinin `EYLEMLER`'de karşılığı olduğunu ve `data-nav="odevler"`'in
  bir sayfaya gittiğini denetler; `SAYFALAR.quiz` `git('quiz')` ile ulaşılabilir sayılır; `api('/assignments…')` ve
  `api('/progress')` yollarının ilk parçasının sunucuda tanımlı olduğuna bakar (alt yolları, ör. `…/quiz/odak`,
  denetlemez; `odak` zaten `api` dışında).
- `testler/girdi-denetimi.js`, `testler/yetki-denetimi.js` — quiz uçlarına bozuk gövde ve yetkisiz istek;
  `testler/test-ozellikler.js` — ödev bölümü kapalıyken quiz uçları 403.
- `testler/test-kucult.js` ve `testler/yazim-denetimi.js` — bütün parçalar gibi bu dosya da yorumsuz paketlenip
  derleniyor mu, kullanıcıya görünen metinlerde yazım hatası var mı.
- Tarayıcıda otomatik bir test yok. Ekran turu (`araclar/gezinti.js`, deneme verisi `araclar/gorsel-veri.js`) quiz
  ekranlarının görüntüsünü alır ama bir şey doğrulamaz.
- Elle:
  1. Öğretmenle "Yeni ödev ver" → "Quiz ekle" → "Metinden ekle"ye yer tutucudaki örneği yapıştır → önizlemede 3 soru →
     "Ekle" → Süre "Soru başına" → "Önizle"de sırayla gez → ödevi ver.
  2. Öğrenciyle ödevi aç → "Quizi başlat" → kurallar → "Şimdi başla"; bir şık seç ("Kaydedildi · saat"), bir soruda
     süreyi bekle ("Önceki sorunun süresi doldu; bu soruya geçildi."), 3 sn başka sekmeye geç ve dön ("Quizden çıktığın
     kaydedildi."), sayfayı yenile (kaldığı yerden sürmeli), bitir.
  3. Öğretmenle kontrol ekranında rozeti ("Quiz: 2/3 · 1 kez çıktı (3 sn)") ve ayrıntıyı aç; "Sonuçları şimdi aç".
  4. Öğrenciyle quizi yeniden aç → puan ve yeşil/kırmızı cevaplar; veliyle ödev satırı → yalnız durum ve puan.

## Son durum

- `git log`: tek commit. Dosya `3b8fd36 commit 519` (2026-09-27, quiz) ile 1669 satır olarak eklendi ve o günden beri
  değişmedi. Diff dosyanın bugünkü hâlinin tamamı: düzenleyici (soru türleri, süre türleri, çıkınca kapanır, sonuç
  görünümü, taşıma, kilit), "Metinden ekle" önizlemesi ve sorunların sorulara işlenmesi, önizleme, kontrol ekranı satırı,
  rozet, ayrıntı, "Sonuçları şimdi aç", "Tekrar aç" uyarısı, öğrencinin `#/quiz` sayfası, sayaç, cevap kuyruğu, sekme
  kaydı, `odev-oku` ve `veli-teslim` sarmaları. Aynı commit'te (32 dosya) şunlar da geldi: `35-quiz.css`; sunucunun
  [quiz.js](../../../sunucu/bolumler/quiz.md)'i, [yardimci/quiz.js](../../../sunucu/yardimci/quiz.md),
  [depo/quiz.js](../../../sunucu/veri/depo/quiz.md), şema `029-quiz.sql`, `odev.js`/`ilerleyis.js`/`okul.js`'teki
  bağlantılar ve yedek/aktarımın (`json-aktarim.js`, `test-yedek.js`) quiz tabloları; `11`/`14`/`25`/`27`
  parçalarındaki kancalar, `04d`'nin `ilkSatir`'ı ve `06-menu.js`'in `quiz: 'odev'` satırı; aydınlatma metni
  (`public/kvkk/kvkk.html` ve `kayit.js`'te `KVKK_SURUM` 1.11 → 1.12: quiz cevapları, süreler, sekme kaydı, kim görür);
  `index.html`'deki SSS ve tanıtım kartı, `belge/KILAVUZ.md` "Quiz" bölümü; ekran turunun quiz adımları
  (`gezinti.js`, `gezinti-metin.js`, `gorsel-veri.js`); testler `test-quiz.js`, `test-quiz-metin.js` ve
  `girdi-denetimi.js`, `yetki-denetimi.js`, `test-ozellikler.js`, `tumtest.sh`'deki quiz satırları.
- Komşulardaki sonraki değişiklik: `7fda2ee commit 543` (2026-09-30) `07-yonlendirme.js`'in `git()`'ine ve
  `25-tiklama.js`'in `hashchange`/`beforeunload`'ına "bir kez gösterilen şifreler" sorusunu ekledi; bu dosyayı yalnız
  "Dikkat!"teki `hashchange` sırası açısından ilgilendiriyor, davranışını değiştirmedi.
- Bilinen açıklar (kod değiştirilmedi): "Tekrar dene"nin eski seçimi göndermesi (ve aynı nedenle geri dönülünce eski
  seçimin görünmesi), oturum kapanınca `QZ`'nin sıfırlanmaması, sekme kapatmanın çıkış sayılmaması (tasarım sınırı),
  kuyruğun bir hatayla kalıcı reddedilebilmesi (bugün tetikleyen yol yok), cevabı beklenmeyen `odak` isteğinin
  yakalanmayan ağ hatası, istemci ile sunucu denetimi arasındaki küçük farklar, perde kilidinin kalkmaması, öğrenci
  olmayanın "Ödevlere dön"ü, düğmelerin ders kapsamını bilmemesi, `beforeunload` gönderiminin `keepalive`'sız olması,
  `25-tiklama.js`'teki eski yorum.
- Planlı işlerden bu dosyaya dokunacaklar:
  - "Düzenleyiciler" (onaylı): quiz soru düzenleyicisi — soruya resim, basit matematik yazımı (üs, kesir, kök), soru
    bankası (sakla, yeni quize seç; zümre paylaşımı); ortak yazı düzenleyici quiz talimatında ve soru metninde de
    kullanılacak. `quizAlaniIc`, `quizDuzenSorusu`, `quizSoruHtml`, `quizSonucListesi`, "Metinden ekle" ve önizleme
    değişecek; soru metni düz yazı olmaktan çıkınca `esc` ile basılan her yer yeniden düşünülmeli.
  - "Anket düzenleyici" (onaylı; Excel kısmının kapsamı kullanıcıya soruldu) ve "Sınav: formüllü ölçüm" (öneri, onay
    bekliyor): quiz sorularını Excel'den aktarma ("Metinden ekle"nin yanına). Aynı tanımın onay bekleyen öneri 2'si
    "Doldurmayanlara hatırlat" (anket/quiz/ödev) kabul edilirse kontrol ekranının quiz satırına bir düğme ekler.
  - "Optimizasyon + saklama süreleri": quiz (sorular, şıklar, denemeler, cevaplar) ödevin son teslim anından (son
    teslimi yoksa açılışından) 1 yıl sonra silinecek; ödevde "Quiz 1 yıl sonra silindi" gibi kısa bir iz görünecek —
    listelerdeki ve penceredeki satırlar quizi olmayan ama izi olan ödevi göstermeli. Aynı iş aydınlatma metnini 1.13
    yapacak.
  - "Tek kişi tek hesap + portallar öğrencide de": öğrenci de portal değiştirebilecek. Portal değişimi
    (`08c-kisilikler.js` `oturumuDegistir`) de `oturumDurumunuSifirla`'yı çağırıyor; `QZ` sıfırlanmadığı için
    yukarıdaki "oturum kapanınca" açığı bu yoldan da görünür — o işte birlikte kapatılmalı.
  - "Sistem" işindeki tarayıcı hata günlüğü (`unhandledrejection` dinleyecek): cevabı beklenmeyen `odak` isteğinin
    yakalanmayan ağ hatası orada görünür; o işte buraya bir `catch` eklenmeli.
  - "Çok dil": bu dosyadaki bütün kullanıcı metinleri çeviri kataloğundan geçecek (en çok metin taşıyan parçalardan).
  - "Android yerel uygulama": öğrencinin quiz çözme ekranı (süre, soru başına, uygulamadan çıkış kaydı — tanımda
    `onPause` ile) ve öğretmenin quiz ekleme/sonuç ayrıntısı aynı uçlarla uygulamada ayrıca yazılacak; bu dosya
    değişmez ama davranışların (2 sn eşiği, cevaplardan sonra çıkış kaydı) orada da aynı olması beklenir.
  - "Üst şerit sadeleştirme" (çıkıştan sonra ileri/geri tuşu hesaba sokmasın): çıkış akışına dokunacağı için
    yukarıdaki "oturum kapanınca `QZ` sıfırlanmıyor" açığı o işte kapatılabilir.
  - "Ekran turu": `araclar/gezinti.js`'in quiz adımları bu dosyanın seçicilerine bağlı.
