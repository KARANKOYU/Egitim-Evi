# Quiz · Sekmeden ve uygulamadan çıkış kaydı

**Durum:** Kodda var; tasarımda ek olarak çözme ekranında çıkış sayısı ve toplam süresi sürekli görünür ve "Quiz gönderildi" özetinde de yazar; yerel Android uygulamasında uygulamanın arka plana alınması da çıkış sayılır.

Quiz sürerken öğrencinin başka sekmeye, başka uygulamaya ya da sitenin başka bir sayfasına geçmesinin kaydedilmesi ve öğretmen
seçtiyse çıkarken açık olan sorunun kapanması.

## Ne işe yarar

Kullanıcının 26 Eylül isteği: "uygulamayı arkaya alıp bakmaya karşı". Öğrenci quizin ortasında cevabı aramak için başka sekmeye geçerse
bu kaydedilir: kaç kez çıktığı ve dışarıda toplam kaç saniye kaldığı öğretmene görünür. Öğretmen isterse "Uygulamadan/sekmeden çıkınca
o soru kapanır" seçeneğini açar; o zaman çıkarken ekranda olan soru bir daha cevaplanamaz. Kayıt öğrencinin tarayıcısından geldiği için
caydırıcıdır, kesin kanıt değildir; ekranlar bunu açıkça söyler.

## Nereden açılır

- **Öğretmen:** quiz düzenleyicide **"Uygulamadan/sekmeden çıkınca o soru kapanır"** kutusu ([Ödeve quiz ekleme](quiz-ekleme.md));
  sonuçları kontrol ekranındaki öğrenci rozetinde ve cevap ayrıntısında ([Öğretmenin gördüğü cevaplar](ogrencinin-cevaplari.md)).
- **Öğrenci:** kurallar ekranında uyarı; çözerken ve bitti ekranında kayıt ([Quiz çözme](quiz-cozme.md)).

## Adım adım

### Öğrenci

1. Kurallar ekranında uyarı: **"Quiz sırasında başka sekmeye, uygulamaya ya da sitenin başka bir sayfasına geçersen kaydedilir ve
   öğretmenin görür."** Öğretmen seçeneği açtıysa sonunda: **"Çıkarken açık olan soru kapanır; bir daha cevaplanamaz."**
2. Quiz sürerken şunlar çıkış sayılır:
   - tarayıcıda başka sekmeye geçmek, pencereyi simge durumuna küçültmek, telefonda başka uygulamaya geçmek (sayfa görünmez olunca);
   - sitenin içinde menüden ya da geri tuşuyla quiz sayfasından ayrılmak (quiz sayfasına dönünce bildirilir).
   Bildirim perdesini indirmek gibi sayfanın görünür kaldığı durumlar sayılmaz.
3. Çıkarken yazdığın ama gönderilmemiş cevaplar hemen gönderilir.
4. Geri döndüğünde dışarıda geçen süre 2 saniyeden kısaysa hiçbir şey olmaz. Daha uzunsa çıkış sunucuya gider (cevaplarından SONRA) ve
   üstte turuncu ileti çıkar: **"Quizden çıktığın kaydedildi."**; seçenek açıksa devamı **" Çıkarken açık olan soru kapandı."**
5. Seçenek açıksa:
   - **soru başına sürede** çıkarken açık olan soru kapanır ve sıradaki soruya geçilirsin;
   - **serbest quizde** (süresiz, bütün quiz) yalnız çıkarken ekranda olan soru kapanır, öbürleri sürer. Kapanan sorunun kartında kırmızı
     etiket **"Quizden çıktığın için kapandı"** ve kilitli cevaplar;
   - bütün sorular kapanırsa quiz biter: **"Quizden çıktığın için soruların hepsi kapandı; quiz bitti."**
6. Sekme dışarıdayken kapanırsa o ana kadarki süre yine gönderilir.
7. Bitti ekranında çıktıysan: **"Quizden 2 kez çıktın (35 sn); öğretmenin görür."**

### Öğretmen

1. Düzenleyicide **"Uygulamadan/sekmeden çıkınca o soru kapanır"** kutusunu istersen işaretle. Notu: "Çıkışlar (başka sekme, uygulama ya da
   sitenin başka sayfası) her durumda kaydedilir; bu seçenekle çıkarken açık olan soru bir daha cevaplanamaz. Kayıt öğrencinin
   tarayıcısından gelir: caydırıcıdır, kesin kanıt değildir."
2. Kontrol ekranında quiz satırının alt yazısında seçenek açıksa **"sekmeden çıkınca soru kapanır"** yazar.
3. Öğrencinin rozetinde çıkış varsa sonuna eklenir: **"Quiz: 8/10 · 2 kez çıktı (35 sn)"**; çıkmış öğrencinin rozeti ayrı renkte
   görünür.
4. Rozete basınca açılan ayrıntıda **"Sekme / uygulama"** satırı: **"2 kez çıktı, toplam 35 sn"** ya da **"Hiç çıkmadı"**; altında not:
   **"Puan yalnız öneridir; ödevin sonucunu sen seçersin. Sekme kaydı öğrencinin tarayıcısından gelir: caydırıcıdır, kesin kanıt
   değildir (ikinci pencere ya da başka cihaz görünmez)."** Çıkınca kapanan sorunun yanında **"Çıkınca kapandı"**; quiz böyle bittiyse
   bitiş nedeni **"sekmeden çıkınca bütün sorular kapandı"**.

### Müdür

Öğretmeni ayrılmış ödevin kontrol ekranında öğretmenle aynı rozeti ve ayrıntıyı görür.

### Veli

Çıkış kaydını görmez (sunucu veliye göndermez).

Tasarımda (Tasarım 1 önizlemesi):

- Çıkıştan sonra çözme ekranında soruların üstünde sürekli duran uyarı: **"Quizden çıktığın kaydedildi. 2 kez, toplam 35 sn; öğretmenin
  görür."**; dönüşte ayrıca kısa ileti **"Quizden çıktığın kaydedildi."**
- Kartın altında sürekli not: "Başka sekmeye ya da uygulamaya geçersen kaydedilir ve öğretmenin görür; süre işlemeye devam eder."
- "Quiz gönderildi" penceresinde **"Çıkış kaydı:"** satırı ("2 kez" ya da "yok"); bitmiş quizin sayfasında aynı satır süresiyle
  ("2 kez · toplam 35 sn" ya da "yok").
- Öğretmenin ayrıntısında **"Quizden 2 kez çıktı · toplam 35 sn"** ya da **"Quizden hiç çıkmadı"**.
- Düzenleyicideki kutunun notu kısa: "çıkışlar her durumda kaydedilir; bu seçenekle çıkarken açık olan soru bir daha cevaplanamaz".
  Önizleme notunda seçenek açıksa "sekmeden çıkarsa o soru kapanır".
- **Android yerel uygulama** (tanım): uygulama arka plana alınınca (ekrandan çıkınca) çıkış sayılır; 2 saniye eşiği ve cevaplardan
  sonra gönderme sırası sitedekiyle aynı.

## Kurallar ve sınırlar

- **2 saniye:** 2 saniyeden kısa çıkış sayılmaz. Dışarıda geçen süre denemenin geçen süresini aşamaz; deneme bittikten sonra başlayan
  çıkış sayılmaz.
- **Sayılmayanlar:** sekmeyi kapatmak ya da sayfayı yenilemek çıkış sayılmaz (kapanış anında geçen süre 2 saniyenin altında kalır,
  yeniden açılınca aradaki süre sorulmaz); ikinci pencere, başka cihaz ve değiştirilmiş tarayıcı görünmez. Bu yüzden kayıt kanıt değil,
  caydırıcı bir göstergedir.
- **Kapanacak soruyu sunucu seçer:** soru başına sürede kendi kaydından (çıkarken açık olan soru; o soru dışarıdayken süresi dolup
  kapandıysa sonraki soru kapanmaz); serbest quizde ekrandaki soru; tarayıcının gönderdiği soru bu quizin değilse en son cevaplanan açık
  soru, o da yoksa ilk açık soru. Serbest quizde cevaplanmış soruya geçip çıkan öğrencinin kapanan sorusu o olur.
- **Sıra:** çıkış kaydı her zaman bekleyen cevaplardan sonra gider; çıkarken açık olan sorunun cevabı kapanmadan kaydedilir.
- **Başka kişi:** aynı sekmede başka bir kullanıcı girdiyse önceki kişinin uygulama içi çıkışı gönderilmez (ama kod belgesindeki bilinen
  açığa göre çıkış yapılıp başkası girince bu koruma her yolda işlemiyor).
- **Hız sınırı:** öğrenci başına 10 dakikada 120 çıkış kaydı ("Çok fazla istek; biraz bekleyip tekrar dene."); süre sayı değilse "Süre
  okunamadı.".
- **KVKK:** sekme değiştirme kaydı aydınlatma metninde yazılıdır (kim görür: öğretmen; veli görmez); ödevle birlikte saklanır
  ([Kim neyi görür](../kvkk-ve-gizlilik/kim-neyi-gorur.md)).

## Kardeşler ve ilgili

**Kardeşler** (aynı klasör, [Quiz](README.md)):

- [Quiz çözme](quiz-cozme.md) — uyarının ve kapanan sorunun göründüğü ekran.
- [Ödeve quiz ekleme ve quiz düzenleyici](quiz-ekleme.md) — seçeneğin açıldığı yer.
- [Öğretmenin gördüğü cevaplar](ogrencinin-cevaplari.md) — rozet ve ayrıntı.
- [Süre ve tek deneme](sure-ve-tek-deneme.md) — soru başına sürede sıradaki soruya geçiş.

**İlgili:**

- [Kim neyi görür](../kvkk-ve-gizlilik/kim-neyi-gorur.md), [Aydınlatma metni](../kvkk-ve-gizlilik/aydinlatma-metni.md).
- [Android uygulaması](../uygulama/android-uygulamasi.md) — uygulamadan çıkış kaydı (tasarım).

## Kod tarafı

- Ön yüz: [public/js/parcalar/14c-quiz.md](../../public/js/parcalar/14c-quiz.md) ("Sekme / uygulama değiştirme": `visibilitychange`,
  `quizOdakGonder` — `fetch` `keepalive`, `quizSayfadanCikti`, `quizSayfayaDondu`, `pagehide`; `QZ.kuyruk` sırası).
- Sunucu: [sunucu/bolumler/quiz.md](../../sunucu/bolumler/quiz.md) (`POST …/quiz/odak`: sayma, 2 saniye, "çıkınca kapanır", kapanacak
  sorunun seçimi; `denemeGorunumu` — sekme kaydı yalnız öğrenciye ve öğretmene).
- Veri: [sunucu/veri/depo/quiz.md](../../sunucu/veri/depo/quiz.md) (`cikis_sayisi`, `cikis_sn`, `soruKapat`).
- Testler: [testler/test-quiz.md](../../testler/test-quiz.md) (2 saniye altı sayılmaz, "çıkınca kapanır").

## Sık sorulanlar

- **Bildirim gelince perdeyi indirdim, sayılır mı?** Hayır; sayfa görünür kaldığı sürece sayılmaz.
- **Sayfayı yeniledim, çıkış sayıldı mı?** Hayır; yenileme ve sekmeyi kapatma çıkış sayılmaz.
- **2 saniyelik bakış sayılır mı?** 2 saniyeden kısa çıkış sayılmaz.
- **Öğrenci ikinci telefondan baktıysa görünür mü?** Hayır; kayıt yalnız quizin açık olduğu sekmeden gelir. Bu yüzden kesin kanıt değildir.
- **Velim kaç kez çıktığımı görür mü?** Hayır; yalnız öğretmenin görür.

## Sırada

- Android yerel uygulama: uygulamadan çıkış kaydı (uygulama arka plana alınınca), 2 saniye eşiğiyle.
- Arayüz çalışması (Tasarım 1): çıkış sayısının çözme ekranında sürekli görünmesi.
- Sistem işindeki tarayıcı hata günlüğü: cevabı beklenmeyen çıkış isteğinin ağ hatası orada görüneceği için yakalanacak (kod belgesindeki
  not).
- Üst şerit sadeleştirme / Tek kişi tek hesap: çıkışta quiz durumunun sıfırlanması (yanlış kişiye çıkış yazılması açığı).
