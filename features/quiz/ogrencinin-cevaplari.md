# Quiz · Öğretmenin gördüğü cevaplar (quiz rozeti)

**Durum:** Kodda var; tasarımda ek olarak rozet puana göre renklenir (yeşil, turuncu, kırmızı) ve cevap ayrıntısında soru metni ile şıklar matematik yazımıyla görünür.

Ödevin kontrol ekranında quiz satırı, her öğrencinin altındaki quiz rozeti ve rozete basınca açılan, öğrencinin soru soru cevaplarını
gösteren pencere.

## Ne işe yarar

Kullanıcının 26 Eylül isteği: öğretmen "ödevde öğrenci açmış mı bakabilir", "hoca ödevi kontrol ederken ne yazdığına bakabilir",
"hangi soruda yanlış yaptığı vb. kontrol ederken görülür". Öğretmen ödevi sonuçlandırırken her öğrencinin quizi başlatıp başlatmadığını,
puanını ve sekmeden kaç kez çıktığını tek bakışta görür; rozete basınca hangi soruda neyi seçtiğini, doğru cevabı, açık uçlu cevabını
ve soru başına süreleri okur. Puan yalnız öneridir: ödevin sonucunu öğretmen kutudan seçer.

## Nereden açılır

- **Öğretmen:** sol menüde **"Ödevler"** → ödevin **"Sonuçlandır"** (sonuçlanmışsa **"Sonuçları düzenle"**) düğmesi → kontrol ekranı
  ([Teslimleri inceleme](../odev/teslimleri-inceleme.md), [Sonuçlandırma](../odev/sonuclandirma.md)).
- **Müdür:** "Ödevler" (ders ödevleri) → öğretmeni okuldan ayrılmış ödevin **"Sonuçlandır"** düğmesi → aynı kontrol ekranı
  ([Müdürün ödev görünümü](../odev/mudurun-odev-gorunumu.md)).

## Adım adım

### Öğretmen

**Quiz satırı**

1. Kontrol ekranının başında ödevin adı, konusu ve bilgileri; altındaki **"Ekler"** kutusunun ilk satırı quizdir: kalın özet **"Quiz · 10
   soru · 20 dk"** (soru başına sürede "Quiz · 10 soru · soru başına süre (toplam 5 dk)", süresizde "Quiz · 10 soru · süresiz").
2. Altında noktayla ayrılmış durum: **"3 öğrenci başladı"** ya da **"Henüz kimse başlamadı"**; sonuçlar için **"sonuçlar öğrencilere
   açık"**, **"öğrenci sonucunu bitirince görür"**, **"sonuçlar son teslimden 10 dakika sonra açılır"** ya da **"sonuçları sen açınca
   görünür"**; seçenek açıksa **"sekmeden çıkınca soru kapanır"**.
3. Sağda düğmeler: **"Önizle"** ([Önizle](onizle.md)), **"Quizi düzenle"** ("Ödev verir" yetkin varsa; "Ödevi düzenle" penceresini quiz
   bölümünde açar — [Ödeve quiz ekleme](quiz-ekleme.md)) ve sonuçlar açık değilse **"Sonuçları şimdi aç"** ("Ödev sonuçlandırır" yetkin
   varsa — [Sonuçlar ve puan](sonuclar.md)).

**Öğrenci rozetleri**

4. **"Öğrenciler"** listesinde her öğrencinin adının altında açılma bilgisi (**"Ödev 20.05.2026 16:20 tarihinde açıldı"** ya da **"Ödev
   açılmadı"**) ve quiz rozeti:
   - **"Quiz: başlamadı"** — tıklanmaz;
   - **"Quiz: devam ediyor"** — öğrenci şu an çözüyor;
   - **"Quiz: 8/10"** — bitirdi (puanlı soru yoksa **"Quiz: bitirdi"**);
   - çıkış varsa sonuna **" · 2 kez çıktı (35 sn)"** eklenir ve rozet ayrı renkte görünür.
   Rozetin üzerine gelince **"Cevapları gör"** yazar. Sonucu (Yaptı, Geç yaptı, Eksik …) satırın sağındaki kutudan sen seçersin.

**Cevap ayrıntısı**

5. Rozete bas (istek sürerken rozet ikinci kez basılamaz). **"Deniz Aydın — quiz"** başlıklı pencere açılır:
   - öğrenci başlamadıysa yalnız **"Öğrenci quizi henüz başlatmadı."**
   - bittiyse üstte puan kutusu **"8/10 (%80)"** ve yanında **"2 açık uçlu soru puanlanmaz"** (puanlı soru yoksa **"Puanlı soru yok"**);
     sürüyorsa turuncu **"Öğrenci quizi çözüyor; cevaplar değişebilir."**
6. Bilgiler:
   - **"Başladı"** — tarih ve saat;
   - **"Bitti"** — tarih, saat ve neden: **"öğrenci bitirdi"**, **"süre doldu"**, **"son teslim geçti"**, **"ödev sonuçlandırılınca ya da
     sonuçlar açılınca kapandı"** ya da **"sekmeden çıkınca bütün sorular kapandı"**;
   - **"Sekme / uygulama"** — **"2 kez çıktı, toplam 35 sn"** ya da **"Hiç çıkmadı"**.
7. Not: **"Puan yalnız öneridir; ödevin sonucunu sen seçersin. Sekme kaydı öğrencinin tarayıcısından gelir: caydırıcıdır, kesin kanıt
   değildir (ikinci pencere ya da başka cihaz görünmez)."**
8. Her soru, sırayla:
   - numara, tür (çok doğrulu soruda **"· birden çok doğru"**) ve etiket: yeşil **"Doğru"**, kırmızı **"Yanlış"** ya da **"Boş"**, açık
     uçluda gri **"Puanlanmaz"**; öğrenci hâlâ çözüyorsa cevapsız puanlı soru gri **"Cevaplanmadı"** (yanlış sayılmaz);
   - saat simgesiyle soru başına sürede sorunun açık kaldığı süre ve kendi süresi: **"Geçen süre: 25 sn / 30 sn"**; kapandıysa
     **"Süre doldu"** ya da **"Çıkınca kapandı"** ("Sonraki"yle geçilen soruda neden yazmaz, yalnız geçen süre);
   - soru metni;
   - şıklar: doğru şık yeşil ve **"Doğru cevap"**, öğrencinin yanlış seçimi kırmızı, seçtiği şıkkın yanında **"Öğrencinin seçimi"**;
   - açık uçluda öğrencinin yazdığı metin ya da **"Cevap yazılmadı."**
9. Pencereyi kapat; sonucu kutudan seç ve **"Sonuçlandır ve kaydet"** ([Sonuçlandırma](../odev/sonuclandirma.md)).

Tasarımda (Tasarım 1 önizlemesi):

- Kontrol ekranının "Ekler" bölümündeki quiz satırı: **"Quiz · 10 soru (1 açık uçlu, puansız) · 20 dakika"**, sağında **"3 öğrenci
  başladı · sonuçlar son teslimden 10 dakika sonra açılır"** (seçenek açıksa **"· sekmeden çıkınca soru kapanır"**). Önizlemede bu satırda
  düğme çizilmedi; bugünkü "Önizle", "Quizi düzenle", "Sonuçları şimdi aç" kalır.
- Rozet puana göre renklenir: %70 ve üstü yeşil, %50–69 turuncu, altı kırmızı; "Quiz: devam ediyor" turuncu, "Quiz: başlamadı" gri.
  Rozetin yanında öğrencinin teslim ettiği eklerin bağlantısı ("2 ek") durur.
- Ayrıntı penceresinin başlığı **"Deniz Aydın · quiz"**; üstte sürüyorsa **"Devam ediyor"** etiketi, **"8 / 9 doğru (%89) · 1 açık uçlu soru
  puanlanmaz"**, altında **"Quizden 2 kez çıktı · toplam 35 sn"** ya da **"Quizden hiç çıkmadı"**. Her sorunun etiketi **"Doğru"**,
  **"Yanlış"**, **"boş"**, **"henüz cevaplamadı"** ya da açık uçluda **"puansız"**; şıklarda küçük yazıyla **"öğrencinin cevabı"** ve **"doğru
  cevap"**; açık uçluda metin, **"Henüz cevaplamadı"** ya da **"Boş bıraktı"**. Soru metni ve şıklar matematik yazımıyla biçimli
  ([Soruya fotoğraf ve matematik yazımı](soru-resmi-ve-matematik.md)). Altta **"Kapat"**. Önizlemede başlama/bitiş saati ve geçen süre
  çizilmedi; bugünkü sitedeki bilgiler kalır.

### Müdür

Öğretmeni okuldan ayrılmış (sahipsiz) ödevin kontrol ekranında öğretmenle aynı satırı, rozetleri ve ayrıntıyı görür. Okulda çalışan
bir öğretmenin ödevinin kontrol ekranını açamaz; onun ödevlerini yalnız listede görür ([Listelerde ve ödev penceresinde
quiz](listelerde-quiz.md)).

## Kurallar ve sınırlar

- **Kim görür:** yalnız ödevi veren öğretmen (sahipsiz ödevde okulun müdürü). Başka öğretmen için 403 "Yetkin yok"; öğrenci ödevde
  değilse 404 "Öğrenci bu ödevde değil"; ödevde quiz yoksa 404 "Bu ödevde quiz yok.".
- Öğretmen doğru cevapları ve öğrencinin cevaplarını sonuçlar öğrenciye açılmadan önce de görür.
- Ayrıntı açılırken denemenin saati ilerletilir: süresi dolmuş deneme o anda kapanır.
- Rozetteki ve onaylardaki sayılar kontrol ekranının açıldığı ana aittir; yeni başlayan ya da bitiren için ekranı yeniden aç.
- Düğmeler ders kapsamını bilmez: yetkin derse göre daraltılmışsa düğme görünür ama sunucu reddeder; ileti tarayıcının uyarı kutusunda
  çıkar.
- Puan önerisi ödevin sonucunu kendiliğinden değiştirmez.

## Kardeşler ve ilgili

**Kardeşler** (aynı klasör, [Quiz](README.md)):

- [Sonuçlar ve puan](sonuclar.md) — puanın hesabı ve "Sonuçları şimdi aç".
- [Çıkış kaydı](cikis-kaydi.md) — rozetteki "kez çıktı".
- [Önizle](onizle.md), [Ödeve quiz ekleme ve quiz düzenleyici](quiz-ekleme.md) — quiz satırındaki öbür düğmeler.
- [Listelerde ve ödev penceresinde quiz](listelerde-quiz.md) — öğretmenin ödev listesindeki quiz satırı.

**İlgili:**

- [Teslimleri inceleme ve indirme](../odev/teslimleri-inceleme.md), [Sonuçlandırma](../odev/sonuclandirma.md) — aynı kontrol ekranı.
- [Açıldı / açılmadı bilgisi](../odev/acilma-bilgisi.md) — rozetin üstündeki açılma satırı.
- [Kim neyi görür](../kvkk-ve-gizlilik/kim-neyi-gorur.md) — öğretmenin quiz cevaplarını görmesi.

## Kod tarafı

- Ön yüz: [public/js/parcalar/14c-quiz.md](../../public/js/parcalar/14c-quiz.md) (`quizOgretmenSatiri`, `quizOgrenciRozeti`,
  `quiz-ayrinti`, `quizAyrintiHtml`, `quizSonucListesi`, `quizBitisNedeni`), [public/js/parcalar/11-ogretmen-odev.md](../../public/js/parcalar/11-ogretmen-odev.md)
  (`odevAc`: kontrol ekranı).
- Sunucu: [sunucu/bolumler/quiz.md](../../sunucu/bolumler/quiz.md) (`GET …/quiz/ayrinti?ogrenci=`, `ogrenciOzetleri`, `ogretmenQuizi`),
  [sunucu/bolumler/odev.md](../../sunucu/bolumler/odev.md) (`GET /api/assignments/<id>`: `quiz` ve `students[].quiz`; sahipsiz ödevde müdür).
- Testler: [testler/test-quiz.md](../../testler/test-quiz.md) (ayrıntı, yetkiler: başka öğrenci, başka öğretmen, veli, müdür),
  [testler/yetki-denetimi.md](../../testler/yetki-denetimi.md).

## Sık sorulanlar

- **Açık uçlu cevapları nerede okurum?** Kontrol ekranında öğrencinin quiz rozetine bas; cevap ayrıntısında yazdığı metin durur.
- **Öğrenci hâlâ çözüyor, cevaplarına bakabilir miyim?** Evet; ayrıntı "Öğrenci quizi çözüyor; cevaplar değişebilir." der, cevapsız
  sorular "Cevaplanmadı" görünür.
- **Rozette "2 kez çıktı" yazıyor, kopya mı çekti?** Bilinmez; kayıt caydırıcıdır, kesin kanıt değildir. Sonucu kendi gözleminle seç.
- **Puanı ödevin sonucuna kendiliğinden yazabilir mi?** Hayır; puan öneridir, sonucu sen seçersin.

## Sırada

- "Doldurmayanlara hatırlat" (anket/quiz/ödev; günde bir) kullanıcıya öneri olarak sunuldu, onay bekliyor; kabul edilirse quiz satırına
  bir düğme ekler.
- Android yerel uygulama: öğretmenin quiz sonuç ayrıntısı uygulamada.
- Arayüz çalışması (Tasarım 1): puana göre renkli rozet.
