# Quiz · Quiz çözme

**Durum:** Kodda var; tasarımda ek olarak çözme ekranının üst şeridinde "N / M cevaplandı" sayacı ve "Ödevlere dön" düğmesi, bitirirken "Quizi bitir" onay penceresi ("Devam et" / "Bitir ve gönder") ve gönderince "Quiz gönderildi" özet penceresi olur; telefondaki yerel Android uygulamasında da çözülür.

Öğrencinin ödev penceresindeki quiz satırından açtığı, önce kuralları gösterip sonra soruları tek tek çözdürdüğü sayfa.

## Ne işe yarar

Kullanıcının 26 Eylül isteği: quiz "eklerde gözükür, uygulama içinden çözülen test"; "bir kerelik, iki kere yapılamaz". Öğrenci
ödevi açar, "Ekler" listesinin başındaki quiz satırından quizi başlatır, kurallarını okur, soruları cevaplar; her cevap anında
kaydedilir, sayfa kapansa da kaldığı yerden sürer. Bitirince ne zaman açılacaksa puanını, cevaplarını ve doğru cevapları görür.
Kullanıcı 1 Ekim'de önizleme için "quiz başlat dedim, mesaj geldi, bir şey olmadı" diye yakındı: "Quizi başlat" bir bilgi iletisi
değil, gerçek çözme ekranını açmalı (bugünkü sitede ve Tasarım 1'de öyle).

## Nereden açılır

- **Öğrenci:** sol menüde **"Ödevler"** → adının yanında **"Quiz"** etiketi olan ödevin satırı → ödev penceresi → **"Ekler"** kutusunun
  ilk satırı ([Ödevin penceresi](../odev/odev-penceresi.md)). Satırda kalın özet (**"Quiz · 10 soru · 20 dk"**), altında durum ve
  düğme:

  | Durum | Alt yazı | Düğme |
  |---|---|---|
  | başlatılabilir | "Tek hakkın var; başlayınca süre işler." (süresiz quizde "Tek hakkın var; ikinci kez çözülemez.") | **"Quizi başlat"** |
  | sürüyor | "Başladın; kaldığın yerden sürdür." | **"Devam et"** |
  | bitti, sonuç açık | "Bitirdin · 8/10 (%80) · 2 açık uçlu soru puanlanmaz" | **"Sonucu gör"** |
  | bitti, sonuç kapalı | "Bitirdin · sonuçlar henüz açılmadı" | **"Quizi aç"** |
  | başlatılamıyor | sunucunun nedeni, ör. "Quiz 05.10.2026 08:00 tarihinde açılacak." (neden gelmezse "Quiz şu an başlatılamaz.") | — |
  | çözmeden ödev sonuçlandırıldı | "Çözülmedi; ödev sonuçlandırıldı." | — |
  | bilgi gelirken | "Quiz bilgisi yükleniyor..." | — |

  Bilgi alınamazsa alt yazıda hatanın iletisi yazar.
- **Adres:** quiz sayfası `#/quiz`'dir (sayfanın başında **"Quiz"** etiketi ve ödevin adı; boş ve uyarı durumlarında başlık
  **"QUIZ"**); menüde yoktur, yalnız bu düğmelerle açılır. Sekme kapanıp adres yeniden
  açılırsa süren quiz bulunur ve ona dönülür; süren quiz yoksa: **"Açık bir quiz yok. Ödevler sayfasında quizli ödevi açıp "Quizi
  başlat"a bas."** ve **"Ödevlere dön"**.

## Adım adım

### Öğrenci

**Kurallar ekranı**

1. **"Quizi başlat"**a bas. Pencere kapanır, quiz sayfası açılır. Üstte **"Quiz"** etiketi, ödevin adı ve **"Matematik · Deniz Aydın"**
   gibi ders ve öğretmen.
2. Kurallar, simgeleriyle alt alta:
   - soru sayısı: **"10 soru."** ya da **"10 soru; 2 tanesi açık uçlu (açık uçlu sorular puanlanmaz, öğretmenin okur)."**
   - süre — bütün quiz: **"Bütün quiz için 20 dk süren var. Başlayınca süre işler, durdurulamaz; süre bitince quiz kendiliğinden
     biter."**; soru başına: **"Her sorunun kendi süresi var (toplam 5 dk). Sorular sırayla gelir; sonraki soruya geçince öncekine
     dönülmez. Bağlantın kopsa da süre işler."**; süresiz: **"Süre sınırı yok; sorular arasında serbestçe gezebilirsin."** (ödevin son
     teslimi varsa sonuna **" Başladıysan quiz en geç son teslimden 10 dakika sonra kendiliğinden biter."**);
   - **"Tek hakkın var: quiz ikinci kez çözülemez."**
   - **"Quiz sırasında başka sekmeye, uygulamaya ya da sitenin başka bir sayfasına geçersen kaydedilir ve öğretmenin görür."**
     (öğretmen seçtiyse sonuna **" Çıkarken açık olan soru kapanır; bir daha cevaplanamaz."**);
   - **"Her cevap anında kaydedilir. Sayfa kapanırsa yeniden açıp kaldığın yerden sürdürürsün."**
   - sonuç: **"Puanını ve doğru cevapları bitirince görürsün."** (Hemen), **"Puanın ve doğru cevaplar son teslimden 10 dakika sonra
     açılır (30 Eylül 2026, Çarşamba · 17:10)."** (son tarihli ödevde varsayılan) ya da **"Puanın ve doğru cevaplar öğretmenin
     sonuçları açınca görünür."** (son tarihsiz ödevde).
3. Altta **"Şimdi başla"** ve **"Ödevlere dön"**. Başlatılamıyorsa "Şimdi başla" yerine turuncu kutuda neden yazar
   ([Süre ve tek deneme](sure-ve-tek-deneme.md)).
4. **"Şimdi başla"** → düğmede **"Başlatılıyor..."** → çözme ekranı. Asıl başlatma budur; süre bu anda işlemeye başlar ve ödev
   "açıldı" sayılır ([Açıldı / açılmadı bilgisi](../odev/acilma-bilgisi.md)). Başlatılamazsa (ör. o arada son teslim geçti) kırmızı
   ileti çıkar ve kurallar ekranı güncel nedenle yeniden çizilir.

**Çözme ekranı**

5. Üstte sayfa kaydırılsa da yerinde duran şerit: ödevin adı, **"Soru 3/10"**, saat simgesiyle kalan süre (**"4:05"**, bir saati
   geçince **"1:02:09"**) ve altında **"kalan süre"** (bütün quiz), **"bu soru için"** (soru başına) ya da **"kapanmasına"** (süresiz
   quizde son teslim + 10 dakikaya bir saatten az kalınca); süre yoksa **"Süresiz"**. Soru başına sürede şeridin altında kalan süreyi
   gösteren çubuk. Son dakika turuncu, son 10 saniye kırmızı (kısa sorularda sürenin üçte biri ve yedide biri).
6. Soru kartı: numara, tür, soru metni, cevap alanı ([Soru türleri](soru-turleri.md)) ve altında kayıt yazısı. Kapanmış soruda kırmızı
   etiket **"Quizden çıktığın için kapandı"** ya da **"Süresi doldu"**; cevapları değiştirilemez.
7. **Cevap vermek:** şık seçince cevap hemen gönderilir: **"Kaydediliyor..."**, sonra **"Kaydedildi · 14:03:12"**. Açık uçlu soruda
   yazarken **"Yazdıkların birazdan kaydedilecek"**; yazmayı 1,2 saniye bırakınca, kutudan çıkınca, başka soruya geçince ya da
   sekmeden çıkınca gönderilir. Gönderilemezse **"Kaydedilemedi: <neden>"** ve **"Tekrar dene"**.
8. **Gezinme — süresiz ve bütün quiz:** kartın altında soru numaraları (şimdiki, cevaplanmış ve kapanmış sorular ayrı renkte; numaraya
   basınca o soru), **"Önceki"**, **"Sonraki"** ve sağda **"Bitir"**. Sayfa aşağı kaymışsa yeni soruda başa kaydırılır.
9. **Gezinme — soru başına süre:** yalnız o anki soru gelir. Altta **"Sonraki soruya geçince bu soruya dönülmez."** ve **"Sonraki
   soru"**; son soruda **"Son soru."** ve **"Bitir"**. Cevapsız soruyu geçerken onay: **"Bu soruyu boş geçiyorsun; geri dönemezsin.
   Sonraki soruya geçilsin mi?"**; düğmede **"Geçiliyor..."**. Süre dolunca kendiliğinden sonraki soruya geçilir ve üstte turuncu
   ileti: **"Önceki sorunun süresi doldu; bu soruya geçildi."**
10. **Bitirmek:** **"Bitir"** onay sorar: **"Cevaplamadığın 2 soru var. Quiz bitirilsin mi? Bitirince cevapların değiştirilemez."**
    (boş soru yoksa yalnız ikinci ve üçüncü cümle); soru başına sürenin son sorusunda **"Quiz bitirilsin mi? Bitirince cevapların
    değiştirilemez."** Düğmede **"Bitiriliyor..."**; bekleyen yazılar önce gönderilir.
11. **Süre dolunca** (bütün quizde ya da son teslim + 10 dakikada) quiz kendiliğinden biter; ekran birkaç saniye sonra güncellenir.
12. Bir cevap gönderilirken quiz ya da soru kapanmışsa üstte turuncu ileti çıkar ve ekran güncel hâline döner: **"Quiz bitti; cevap
    değiştirilemez."**, **"Bu sorunun süresi doldu; cevap değiştirilemez."** ya da **"Bu soru kapandı; cevap değiştirilemez."**

**Bitti ekranı**

13. Başlığın altında bitiş nedeni ve saati: **"Quizi bitirdin."**, **"Süre doldu; quiz bitti."**, **"Son teslim geçtiği için quiz
    bitti."**, **"Öğretmen quizi kapattı (ödevi sonuçlandırdı ya da sonuçları açtı); quiz bitti."** ya da **"Quizden çıktığın için
    soruların hepsi kapandı; quiz bitti."**
14. Çıkış kaydı varsa: **"Quizden 2 kez çıktın (35 sn); öğretmenin görür."** ([Çıkış kaydı](cikis-kaydi.md)).
15. Sonuç açıksa puan ve **"Cevapların"** listesi; değilse ne zaman açılacağı ([Sonuçlar ve puan](sonuclar.md)). Altta **"Ödevlere dön"**.

**Ara verme ve geri dönme**

16. Sayfayı yenilersen kaldığın sorudan sürer (sekmenin geçici belleğinde tutulur). Sekmeyi kapatıp ödevden **"Devam et"** dersen ilk boş
    ve kapanmamış sorudan açılır. Süre bu arada da işler.
17. Gönderilmemiş yazın varken sekmeyi kapatmaya çalışırsan tarayıcı kendi penceresiyle sayfadan ayrılmak isteyip istemediğini sorar ve
    yazı gönderilmeye başlar (hemen ayrılırsan gönderim yarıda kalabilir).

Tasarımda (Tasarım 1 önizlemesi):

- Ödev penceresindeki quiz satırı: **"Quiz · 10 soru · 20 dakika"**, altında küçük **"tek deneme"**; sağda **"Quizi başlat"** ya da
  **"Quize devam et"**; bitince yeşil **"Cevapların gönderildi"**.
- Sayfanın başlığı **"<ödevin adı> — quiz"**. Kurallar ekranının başında **"Matematik · <öğretmen>"**, sağda **"10 soru · 20 dakika"**;
  kurallar kısa liste (soru sayısı, süre, tek hak, "Quiz sırasında başka sekmeye ya da uygulamaya geçersen kaydedilir ve öğretmenin
  görür.", "Her cevap anında kaydedilir."); düğmeler **"Ödevlere dön"** ve **"Şimdi başla"**.
- Çözme ekranının üst şeridinde süre (son 2 dakika turuncu) ya da süresiz quizde **"Süre yok"**, yanında **"4 / 10 cevaplandı"**
  sayacı ve sağda **"Ödevlere dön"**. Kartın üstünde **"Soru 3 / 10 · tek seçim"**; altında kayıt yazısı (henüz cevap yoksa
  **"Cevapların her seçimde kaydedilir."**), **"Önceki"**, **"Sonraki"**, son soruda **"Quizi bitir"**. Kartın altında not: **"Başka
  sekmeye ya da uygulamaya geçersen kaydedilir ve öğretmenin görür; süre işlemeye devam eder."** (süresizde **"Süre sınırı yok. Başka
  sekmeye ya da uygulamaya geçersen kaydedilir ve öğretmenin görür."**).
- **"Quizi bitir"** onay penceresi açar: başlık **"Quizi bitir"**, **"7 / 10 soruyu cevapladın. Bitirdikten sonra cevaplarını
  değiştiremezsin; quiz ikinci kez çözülemez."**, düğmeler **"Devam et"** ve **"Bitir ve gönder"**.
- Gönderince pencere **"Quiz gönderildi"**: **"Cevapların gönderildi."** (süre dolduysa **"Süre doldu; cevapların gönderildi."**) ve
  **" Sonuç, öğretmenin sonuçları açınca burada ve ödevlerinde görünür."**; altında **"Ödev:"**, **"Cevaplanan:"** (7 / 10),
  **"Kalan süre:"** (süresizde **"Süre:"** süresiz) ve **"Çıkış kaydı:"** (ör. "2 kez" ya da "yok"); düğme **"Ödevlere dön"**.
- Bitmiş quizin sayfası: **"Cevapların gönderildi"** başlığı, **"Sonuç, öğretmenin sonuçları açınca burada ve ödevlerinde görünür. Quiz
  ikinci kez çözülemez."** ve **"Cevaplanan:"**, **"Süre:"**, **"Gönderilme:"** (saat), **"Çıkış kaydı:"**.
- Önizleme soru başına süreli quizi öğrenci tarafında çizmiyor ve sonucun açılmasını tek cümleyle söylüyor; bugünkü sitedeki soru
  başına akışı ve seçeneğe göre değişen sonuç cümleleri kalır.
- **Android yerel uygulama** (tanım): öğrenci quizi uygulamada da çözer — süre, soru başına süre ve uygulamadan çıkış kaydı (uygulama
  arka plana alınınca). Bugün yerel uygulamada quiz yok; telefona tarayıcıdan kurulan site uygulamasında çözülür
  ([Android uygulaması](../uygulama/android-uygulamasi.md)).

### Veli

Quizi çözemez. Çocuğunun ödev listesinde ve ödev penceresinde yalnız durumu ve açılınca puanı görür
([Listelerde ve ödev penceresinde quiz](listelerde-quiz.md)). Adres çubuğuna `#/quiz` yazarsa: **"Quizi yalnız öğrencinin kendisi
çözer."** ve **"Ödevlere dön"**.

### Öğretmen ve müdür

Quizi çözmez; öğrencinin portalını açıp bakan öğretmen ve müdür veli gibi yalnız durumu görür, `#/quiz` aynı iletiyi verir.
Öğretmen quizi öğrenci gözüyle görmek için [Önizle](onizle.md)'yi kullanır.

## Kurallar ve sınırlar

- **Kim çözer:** yalnız ödevin öğrencisi, kendi hesabıyla. Ödev ona verilmemişse "Ödev bulunamadı"; ödevde quiz yoksa "Bu ödevde quiz
  yok." (boş kutu ve "Ödevlere dön").
- **Ne zaman:** ödevin başlama tarihi ve saatinden son teslime kadar başlatılır; ödev sonuçlandırılmışsa ya da sonuçlar kalıcı
  açılmışsa başlatılamaz ([Süre ve tek deneme](sure-ve-tek-deneme.md)).
- **Tek hak:** başlatılan quiz ikinci kez çözülemez; "Devam et" aynı denemeyi sürdürür.
- **Cevaplar:** açık uçlu cevap en çok 2000 karakter ("Cevap en fazla 2000 karakter olabilir."); tek doğrulu soruda tek şık ("Bu soruda
  yalnız bir şık seçilebilir."); şık o sorunun olmalı ("Seçilen şık bu soruya ait değil."); bozuk istek: "Cevap okunamadı.",
  "Seçilen şıklar okunamadı.", "Soru bulunamadı"; quiz başlamadan cevap: "Quiz başlamadı."; serbest quizde "Sonraki" isteği: "Bu
  quizde sorular arasında serbestçe geçilir.".
- **Sıra:** cevaplar, "Sonraki", "Bitir" ve çıkış kaydı sunucuya hep sırayla gider; bir cevap, ondan sonra basılan "Bitir"den önce
  kaydedilir.
- **Hız sınırları** (öğrenci başına, 10 dakikada): başlatma 30 ("Çok fazla deneme; biraz bekleyip tekrar dene."), cevap 600 ("Çok
  fazla istek; biraz bekleyip tekrar dene."). Soru başına sürede, süre dolunca kendiliğinden giden "Sonraki" isteği başarısız olursa
  üstte kırmızı ileti çıkar ve istek 5 saniye sonra yeniden denenir.
- **Doğru cevap:** çözerken sorularla birlikte doğru bilgisi gelmez; soru başına sürede yalnız o anki soru gelir. Sayaç yalnız
  gösterir; süre sunucuda işler ([Süre ve tek deneme](sure-ve-tek-deneme.md)).
- **Ödevler kapalıysa** sayfa: **"Bu bölüm okulunda kapalı. Okul müdürü Özellikler sayfasından açabilir."**
- **Bilinen açıklar** (kod belgesinden, kod değiştirilmedi): hızlı iki şık seçiminden ikincisi gönderilemezse "Tekrar dene" birinciyi
  gönderebilir; aynı sekmede çıkış yapıp başka bir öğrenci girerse önceki öğrencinin quiz durumu sıfırlanmıyor (ortak bilgisayarda
  kayıt yazısı ya da çıkış kaydı yanlış kişiye düşebilir).

## Kardeşler ve ilgili

**Kardeşler** (aynı klasör, [Quiz](README.md)):

- [Süre ve tek deneme](sure-ve-tek-deneme.md) — başlatma şartları, süre türleri, son teslim + 10 dakika.
- [Çıkış kaydı](cikis-kaydi.md) — sekmeden, uygulamadan ve sayfadan çıkışın kaydı, "çıkınca o soru kapanır".
- [Sonuçlar ve puan](sonuclar.md) — bitti ekranındaki puan ve cevaplar.
- [Soru türleri](soru-turleri.md), [Listelerde ve ödev penceresinde quiz](listelerde-quiz.md).

**İlgili:**

- [Ödevin penceresi](../odev/odev-penceresi.md) — quiz satırının bulunduğu "Ekler" listesi.
- [Ödev listesi](../odev/liste.md) — "Quiz" etiketi ve durumu.
- [Açıldı / açılmadı bilgisi](../odev/acilma-bilgisi.md) — quizi başlatmak ödevi açılmış sayar.
- [Ödev hatırlatmaları](../odev/hatirlatmalar.md) — quizi bitirince hatırlatmalar durur (tasarım).
- [Android uygulaması](../uygulama/android-uygulamasi.md), [Tarayıcıdan yükleme](../uygulama/tarayicidan-yukleme.md).
- [Kapalı bölüm](../ozellikler/kapali-bolum.md).

## Kod tarafı

- Ön yüz: [public/js/parcalar/14c-quiz.md](../../public/js/parcalar/14c-quiz.md) ("Öğrenci ve veli: ödev penceresi" — `quizOdevSatiri`,
  `odev-oku` sarması, `quiz-ac`; "Öğrenci: çözme sayfası" — `SAYFALAR.quiz`, `quizGirisHtml`, `quizCozmeHtml`, `quizBittiHtml`,
  `quizCevapGonder`, `QZ.kuyruk`, `quizTik`, `quiz-basla`, `quiz-git`, `quiz-sonraki`, `quiz-bitir`),
  [public/js/parcalar/14-odev-filtre.md](../../public/js/parcalar/14-odev-filtre.md) (ödev penceresi ve liste),
  [public/js/parcalar/04d-ekler.md](../../public/js/parcalar/04d-ekler.md) ("Ekler" kutusunun ilk satırı),
  [public/js/parcalar/06-menu.md](../../public/js/parcalar/06-menu.md) (`quiz` sayfası "Ödevler" bölümüne bağlı).
- Sunucu: [sunucu/bolumler/quiz.md](../../sunucu/bolumler/quiz.md) (öğrencinin uçları: `GET …/quiz`, `basla`, `cevap`, `sonraki`,
  `bitir`; `baslatmaEngeli`, `denemeIsle`), [sunucu/bolumler/odev.md](../../sunucu/bolumler/odev.md) (öğrenci yollarının yönlendirilmesi),
  [sunucu/bolumler/ilerleyis.md](../../sunucu/bolumler/ilerleyis.md) (süren quizi bulmak için `GET /api/progress`).
- Veri: [sunucu/veri/depo/quiz.md](../../sunucu/veri/depo/quiz.md) (`quiz_denemeleri`, `quiz_cevaplari`).
- Testler: [testler/test-quiz.md](../../testler/test-quiz.md) (tek deneme, süreler, sızma), [testler/test-quiz-metin.md](../../testler/test-quiz-metin.md)
  (kurallar ve bitti ekranı metinleri).

## Sık sorulanlar

- **Quiz nasıl çözülür, kaç hakkım var?** Ödevi açıp "Ekler"deki quiz satırında "Quizi başlat"a basarsın; kurallar ekranında süreyi ve
  sonucun ne zaman açılacağını görüp "Şimdi başla" dersin. Tek hakkın var; başladığın quiz ikinci kez çözülemez (sitedeki SSS).
- **Sayfa kapandı, ne olacak?** Ödevi yeniden açıp "Devam et" ile kaldığın yerden sürdürürsün; süre bu arada işlemeye devam eder.
- **Cevabım kaydedildi mi?** Sorunun altında "Kaydedildi · saat" yazıyorsa evet. "Kaydedilemedi" yazıyorsa "Tekrar dene"ye bas.
- **Neden "Quizi başlat" yok?** Ödev daha başlamadıysa, son teslim geçtiyse, ödev sonuçlandırıldıysa ya da sonuçlar açıklandıysa quiz
  başlatılamaz; satırda nedeni yazar.
- **Önceki soruya dönemiyorum.** Öğretmen soru başına süre seçtiyse sorular sırayla gelir, geri dönülmez.
- **Velim quizi çözebilir mi?** Hayır; quizi yalnız öğrencinin kendisi çözer.

## Sırada

- Arayüz çalışması (Tasarım 1): "N / M cevaplandı" sayacı, "Quizi bitir" onay penceresi, "Quiz gönderildi" özeti.
- Android yerel uygulama: öğrencinin quiz çözme ekranı (süre, soru başına, uygulamadan çıkış kaydı); 2 saniye eşiği ve "cevaplardan
  sonra çıkış kaydı" sırası sitedekiyle aynı olacak.
- Üst şerit sadeleştirme ve Tek kişi tek hesap işleri: çıkışta ve portal değişiminde quiz durumunun sıfırlanması (bilinen açık) bu
  işlerde kapatılabilir.
- Düzenleyiciler işi: çözme ekranında soru fotoğrafı ve matematik yazımı.
