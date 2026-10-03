# Quiz · Soru türleri (Doğru/Yanlış, çoktan seçmeli, açık uçlu)

**Durum:** Kodda var; tasarımda ek olarak çözme ekranında sorunun üstünde türü yazar ("doğru / yanlış", "tek seçim", "birden çok seçim", "açık uçlu") ve soruya fotoğraf ile matematik yazımı eklenebilir (ayrı belgede).

Quizde üç soru türü vardır: Doğru/Yanlış, çoktan seçmeli (bir ya da birden çok doğru şık) ve puanlanmayan açık uçlu soru.

## Ne işe yarar

Kullanıcının 26 Eylül tarifi: "iki soru tipi: doğru yanlış, multiple answer; hoca her soruya şıkka doğru cevap mı yanlış mı
yazabilir, birden fazla doğru olabilir; veya açık uçlu, yani öğrenci boş metine yazar, hoca ödevi kontrol ederken ne yazdığına
bakabilir, doğru yanlışı olmaz". Aynı gün: "quize açık uçluya puan vermesin, sadece dursun". Öğretmen her soru için türü seçer;
öğrenci türe göre radyo düğmesi, kutucuk ya da yazı kutusu görür; puan yalnız Doğru/Yanlış ve çoktan seçmeli sorulardan çıkar.

## Nereden açılır

- **Öğretmen (ve sahipsiz ödevde müdür):** quiz düzenleyicide her sorunun satırındaki tür seçici: **"Çoktan seçmeli"**,
  **"Doğru/Yanlış"**, **"Açık uçlu"** ([Ödeve quiz ekleme](quiz-ekleme.md)).
- **Öğrenci:** quiz çözme sayfasında (`#/quiz`) her sorunun kartı ([Quiz çözme](quiz-cozme.md)).

## Adım adım

### Öğretmen

**Doğru/Yanlış**

1. Tür seçiciden **"Doğru/Yanlış"**ı seç.
2. **"Soru metni"**ne önermeyi yaz (ör. "Güneş bir yıldızdır.").
3. Altında **"Doğru cevap:"** ve iki çip: **"Doğru"** | **"Yanlış"**. Birini seç; seçmeden kaydedersen: "3. soruda doğru cevabı seç:
   Doğru ya da Yanlış."

**Çoktan seçmeli**

1. Tür seçiciden **"Çoktan seçmeli"**yi seç (yeni soru bu türde ve dört boş şıkla gelir).
2. Soru metnini yaz.
3. Her şık bir satır: harf (A, B, C … J), tek satırlık yazı kutusu (yer tutucusu **"A şıkkı"**), **"Doğru"** kutusu ve şıkkı silen
   küçük düğme. Doğru şık(lar)ın **"Doğru"** kutusunu işaretle; işaretli şık yeşil görünür.
4. **"Şık ekle"** yeni boş şık ekler (en çok 10; onuncu şıktan sonra bağlantı kalkar). Şıkkı silmek için sağdaki düğme; 2 şık
   kaldıysa silmez, bilgi kutusunda: "Çoktan seçmeli soruda en az 2 şık olmalı."
5. Şıkların altında not: "Birden çok doğru işaretlersen öğrenci birden çok şık seçebilir; puan için hepsini bulmalı."
6. Kaydederken denetim: boş şık ("3. sorunun B şıkkı boş. Boş şıkkı sil ya da doldur."), 300 karakterden uzun şık, hiç doğru
   işaretlenmemesi ("3. soruda doğru şık işaretli değil.") ve **bütün şıkların doğru işaretlenmesi** ("3. soruda bütün şıklar doğru
   işaretli; en az bir şık yanlış olmalı."). Sonuncusunun nedeni: birden çok doğrulu soruda öğrenci "Birden çok şık
   seçebilirsin." notunu görür; iki şıklı, iki doğrulu bir soruda bu not cevabı ele verirdi.

**Açık uçlu**

1. Tür seçiciden **"Açık uçlu"**yu seç, soru metnini yaz.
2. Şık yoktur; altında not: "Öğrenci cevabını yazar (en fazla 2000 karakter). Puanlanmaz; kontrol ederken okursun."

### Öğrenci

Her soru bir kart: üstte soru numarası ve türün adı (**"Doğru/Yanlış"**, **"Çoktan seçmeli"**, **"Açık uçlu"**), sonra soru metni.

- **Doğru/Yanlış:** iki seçenek, **"Doğru"** ve **"Yanlış"** (harfsiz); birini seçersin.
- **Çoktan seçmeli, tek doğru:** A, B, C … harfli şıklar, radyo düğmesiyle tek seçim.
- **Çoktan seçmeli, birden çok doğru:** üstte **"Birden çok şık seçebilirsin."** notu, şıklar kutucukla; istediğin kadarını
  işaretlersin. Puan için doğruların hepsini seçmeli, hiçbir yanlış şıkkı seçmemelisin.
- **Açık uçlu:** **"Cevabını buraya yaz"** yer tutuculu yazı kutusu; altında sayaç ve not: **"0/2000 · Bu soru puanlanmaz; öğretmenin
  okur."** En çok 2000 karakter yazılır.

Şık seçince cevap hemen, açık uçlu cevap yazmayı bırakınca kaydedilir ([Quiz çözme](quiz-cozme.md)).

Tasarımda (Tasarım 1 önizlemesi):

- Sorunun üstünde **"Soru 3 / 10 · tek seçim"** gibi bir satır: tür **"doğru / yanlış"**, **"tek seçim"**, **"birden çok seçim"** ya da
  **"açık uçlu"** diye yazar.
- Doğru/Yanlış iki büyük düğmedir: onay simgeli **"Doğru"**, çarpı simgeli **"Yanlış"**. Birden çok doğrulu soruda şıklar kutucuklu
  düğmeler, üstünde "Birden çok şık seçebilirsin."; açık uçluda kutunun üstünde "Bu soru puanlanmaz; öğretmenin okur.", yer tutucu
  "Cevabını yaz".
- Öğretmenin düzenleyicisinde tür adı **"Doğru / Yanlış"** (boşluklu) yazar; Doğru/Yanlış sorusunda iki seçenek ve "doğru cevabı
  işaretle" notu; çoktan seçmelide her şıkkın solunda **"doğru"** kutusu, şık kutusunun yer tutucusu **"Şık"**, altında **"+ Şık
  ekle"** ve birden çok doğru işaretliyse "birden çok doğru: öğrenci kutucuklarla seçer". Açık uçlu: "Öğrenci cevabını yazar;
  puanlanmaz, kontrol ederken okursun." Şık 2'ye inince şık silme düğmesi kapanır.
- Soruya fotoğraf ve matematik yazımı: [Soruya fotoğraf ve matematik yazımı](soru-resmi-ve-matematik.md).

## Kurallar ve sınırlar

- **Sınırlar:** soru metni 1000, şık 300, açık uçlu cevap 2000 karakter; çoktan seçmelide 2–10 şık (A–J); Doğru/Yanlış sorusu
  "Doğru" ve "Yanlış" adlı iki şıkla saklanır.
- **Tek mi çok mu:** çoktan seçmeli soruda birden çok doğru işaretliyse öğrenci kutucuk görür, değilse radyo düğmesi. Tek doğrulu
  soruda birden çok şık gönderilirse sunucu reddeder: "Bu soruda yalnız bir şık seçilebilir.".
- **En az bir yanlış şık:** çoktan seçmelide bütün şıklar doğru olamaz.
- **Puan:** her puanlı soru eşit ağırlıkta. Doğru/Yanlış ve çoktan seçmelide seçilen şıklar doğru şıklarla birebir aynıysa doğru
  sayılır; kısmi puan yok, fazladan bir yanlış şık puanı sıfırlar; boş soru yanlış sayılır. **Açık uçlu soru puanlanmaz**, yalnız
  saklanır ve öğretmen okur ([Sonuçlar ve puan](sonuclar.md)).
- Şık metni tek satırdır (satır sonları ve fazla boşluklar teke iner); soru metni birden çok satır olabilir.
- Doğru şık bilgisi öğrenciye sonuç açılana dek hiç gönderilmez ([Sonuçlar ve puan](sonuclar.md)).

## Kardeşler ve ilgili

**Kardeşler** (aynı klasör, [Quiz](README.md)):

- [Ödeve quiz ekleme ve quiz düzenleyici](quiz-ekleme.md) — tür seçicinin bulunduğu yer.
- [Metinden ekle](metinden-ekle.md) — türü yapıştırılan metinden çıkarır (yıldızlı şık, "Cevap: Doğru", şıksız soru).
- [Quiz çözme](quiz-cozme.md), [Sonuçlar ve puan](sonuclar.md), [Öğretmenin gördüğü cevaplar](ogrencinin-cevaplari.md).
- [Soruya fotoğraf ve matematik yazımı](soru-resmi-ve-matematik.md), [Soru bankası](soru-bankasi.md).

**İlgili:**

- [Anket oluştur](../anket/anket-olustur.md) — anketin soru türleri (tek seçim, birden çok seçim, açılır liste, kısa ve uzun yanıt);
  quizden ayrı bir düzenleyici.
- [Sınavlar: ölçümler ve formül](../sinav/olcumler-ve-formul.md) — yazılı ve test notları sınav bölümündedir, quizde değil.

## Kod tarafı

- Ön yüz: [public/js/parcalar/14c-quiz.md](../../public/js/parcalar/14c-quiz.md) (`QUIZ_TUR_AD`, `QUIZ_HARF`, `quizYeniSoru`,
  `quizDuzenSorusu`, `quizSoruHtml`, `quizDenetle`).
- Sunucu: [sunucu/yardimci/quiz.md](../../sunucu/yardimci/quiz.md) (`QUIZ_TURLERI`, `quizDogrula`, `puanHesapla`,
  `quizHepsiDogru`), [sunucu/bolumler/quiz.md](../../sunucu/bolumler/quiz.md) (`cokluMu`, cevap denetimi).
- Veri: [sunucu/veri/sema/SEMA.md](../../sunucu/veri/sema/SEMA.md) (`quiz_sorulari.tur`: `dy`, `coktan`, `acik`;
  `quiz_secenekleri.dogru`).
- Testler: [testler/test-quiz.md](../../testler/test-quiz.md), [testler/test-quiz-metin.md](../../testler/test-quiz-metin.md).

## Sık sorulanlar

- **Birden çok doğru şık işaretleyebilir miyim?** Evet; öğrenci o soruda kutucuk görür ve puan için doğruların hepsini seçmelidir.
- **Bütün şıkları doğru yapsam?** Olmaz; en az bir şık yanlış olmalı (yoksa "birden çok şık seçebilirsin" notu cevabı verir).
- **Açık uçlu soruya puan verebilir miyim?** Hayır; açık uçlu soru puanlanmaz. Cevabı kontrol ekranında okursun; ödevin sonucunu
  (Yaptı, Eksik …) sen seçersin.
- **Kısmi puan var mı?** Hayır; çok doğrulu soruda bir doğruyu atlamak ya da bir yanlışı eklemek o soruyu yanlış yapar.
- **Doğru/Yanlış sorusunda şıkları değiştirebilir miyim?** Hayır; şıklar her zaman "Doğru" ve "Yanlış"tır.

## Sırada

- Düzenleyiciler işi: soruya fotoğraf ve matematik yazımı; soru metni ortak yazı düzenleyiciyle.
- Tasarım 1 önizlemesindeki tür satırı ("tek seçim", "birden çok seçim") çözme ekranına bu işle ya da arayüz çalışmasıyla gelir.
