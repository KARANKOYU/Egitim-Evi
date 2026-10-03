# Quiz · Ödeve quiz ekleme ve quiz düzenleyici

**Durum:** Kodda var; tasarımda ek olarak quiz bölümü "Quizi düzenle / Kapat" ile açılıp kapanır, üstte "Metinden ekle · Soru bankası · Önizle" araç satırı, altta "N / 100 soru" sayacı olur; soruya fotoğraf, matematik yazımı ve soru bankası eklenir (ayrı belgelerde), soru metni ve quiz talimatı ortak yazı düzenleyiciyi kullanır.

Öğretmenin "Yeni ödev" ya da "Ödevi düzenle" penceresinin içinde açılan, quizin sorularını, süresini ve kurallarını yazdığı bölüm.

## Ne işe yarar

Kullanıcının 26 Eylül isteği: quiz "ödevin içine tanımlanır, eklerde gözükür, uygulama içinden çözülen test"; "hoca quizi kendi
yazar, Ctrl C V falan olabilir ve soru başına süre yapabilir"; "bir kerelik, iki kere yapılamaz". Öğretmen bir ödeve isteğe
bağlı tek bir quiz koyar: soruları yazar ya da yapıştırır, süre türünü seçer, sekmeden çıkınca sorunun kapanıp kapanmayacağını ve
sonuçların öğrenciye ne zaman görüneceğini belirler. Quiz ödevle birlikte kaydedilir; öğrenci ödevi açınca "Ekler" listesinin
başında görür ([Quiz çözme](quiz-cozme.md)). Bir öğrenci quizi başlattığı an quiz kilitlenir.

## Nereden açılır

- **Öğretmen, yeni ödevde:** sol menüde **"Ödevler"** → **"Yeni ödev ver"** → açılan **"Yeni ödev"** penceresinde, eklerin ve
  "Öğrenciler bu ödeve dosya yükleyebilsin" kutusunun altındaki geniş düğme: **"Quiz ekle: Doğru/Yanlış, çoktan seçmeli ya da açık
  uçlu sorular"**, altında küçük yazı **"Öğrenci ödevi açıp quizi çözer; tek deneme hakkı vardır."** ([Ödev verme](../odev/odev-verme.md)).
- **Öğretmen, verilmiş ödevde:** "Ödevler" → ödevin **"Sonuçlandır"** (sonuçlanmışsa **"Sonuçları düzenle"**) düğmesi → kontrol
  ekranı → altta **"Ödevi düzenle"**; ya da kontrol ekranında "Ekler"in ilk satırındaki quiz satırında **"Quizi düzenle"** (pencere
  quiz bölümüne kaydırılarak açılır) ([Ödevi düzenleme ve silme](../odev/odevi-duzenleme-ve-silme.md)).
- **Müdür:** yalnız öğretmeni okuldan ayrılmış (sahipsiz) ödevde: "Ödevler" (ders ödevleri) → ödevin **"Sonuçlandır"** düğmesi →
  kontrol ekranı → **"Ödevi düzenle"** ya da **"Quizi düzenle"** ([Müdürün ödev görünümü](../odev/mudurun-odev-gorunumu.md)).
  Müdür yeni ödev vermez; quizli yeni ödev de açmaz.

## Adım adım

### Öğretmen

**Quizi açmak**

1. "Yeni ödev" penceresinde ödevin adını, tarihlerini ve öğrencilerini doldur ([Ödev verme](../odev/odev-verme.md)).
2. **"Quiz ekle"**ye bas. Pencerenin içinde quiz bölümü açılır (ikinci bir pencere açılmaz), pencere genişler ve imleç ilk
   sorunun metnine gelir. Quiz bölümü açıkken pencerenin dışına tıklamak pencereyi kapatmaz (yazdığın sorular yanlışlıkla gitmesin
   diye); kapatmak için **"Vazgeç"**.
3. Bölümün başlığında **"Quiz"**, yanında soru sayısı (**"1 soru"**) ve **"Quizi kaldır"** bağlantısı durur.

**Ayarlar** (başlığın hemen altında)

4. **"Süre"** — üç çipten birini seç; yeni quiz **"Süresiz"** gelir:
   - **"Süresiz"** — altında: "Süre sınırı yok; sorular arasında serbestçe gezilir. Ödevin son teslimi varsa quiz de o zaman kapanır."
   - **"Soru başına"** — altında: "Her sorunun süresini aşağıya yaz (10 sn – 10 dk). Sorular sırayla gelir; geri dönülmez." Her
     sorunun satırına saniye kutusu (**"sn"**) gelir; süresi boş olan sorulara 30 yazılır.
   - **"Bütün quiz"** — dakika kutusu ve yanında **"dakika (1–180)"**; boşsa 20 yazılır. Altında: "Başlayınca süre işler; süre
     bitince quiz kendiliğinden biter. Sorular arasında serbestçe gezilir."
   Süre türlerinin öğrenci tarafı: [Süre ve tek deneme](sure-ve-tek-deneme.md).
5. **"Uygulamadan/sekmeden çıkınca o soru kapanır"** kutusu (kapalı gelir). Altındaki not: "Çıkışlar (başka sekme, uygulama ya da
   sitenin başka sayfası) her durumda kaydedilir; bu seçenekle çıkarken açık olan soru bir daha cevaplanamaz. Kayıt öğrencinin
   tarayıcısından gelir: caydırıcıdır, kesin kanıt değildir." ([Çıkış kaydı](cikis-kaydi.md)).
6. **"Sonuçlar öğrenciye"** açılır listesi: **"Son teslimden 10 dakika sonra görünsün"** (varsayılan) ya da **"Hemen görünsün
   (bitirince)"**. Altındaki not: "Son tarihi olmayan ödevde sonuçlar sen açınca ya da ödevi sonuçlandırınca görünür. "Hemen"
   seçilirse önce bitiren doğru cevapları görür; herkes aynı anda çözmüyorsa cevaplar yayılabilir." ([Sonuçlar ve puan](sonuclar.md)).

**Soruları yazmak**

7. Her soru numaralı bir satırdır: numara, tür seçici (**"Çoktan seçmeli"**, **"Doğru/Yanlış"**, **"Açık uçlu"**), soru başına
   sürede saniye kutusu, sağda üç küçük düğme — **"Yukarı taşı"**, **"Aşağı taşı"**, **"Soruyu sil"** — ve altında **"Soru metni"**
   kutusu (birden çok satır yazılabilir). Yeni quiz tek bir boş çoktan seçmeli soruyla (dört boş şık) açılır. Türlerin ayrıntısı:
   [Soru türleri](soru-turleri.md).
8. Bölümün altında üç düğme: **"Soru ekle"**, **"Metinden ekle"** ([Metinden ekle](metinden-ekle.md)) ve **"Önizle"**
   ([Önizle](onizle.md)).
   - **"Soru ekle"** yeni soruyu son sorunun türünde ekler; soru başına sürede son sorunun süresiyle (o da yoksa 30 sn). İmleç yeni
     sorunun metnine gider. 100. sorudan sonra eklemez, bilgi kutusunda: "Quizde en fazla 100 soru olabilir."
9. **Taşımak:** "Yukarı taşı" / "Aşağı taşı" soruyu komşusuyla yer değiştirir; ilk sorunun yukarı, son sorunun aşağı düğmesi
   kapalıdır.
10. **Silmek:** "Soruyu sil" — metni yazılmış soruda onay sorar: **"3. soru silinsin mi?"**; boş soru sormadan silinir. Bütün
    sorular silinirse: "Henüz soru yok. "Soru ekle" ya da "Metinden ekle" ile başla."
11. **Türü değiştirmek:** tür seçiciyi değiştirince soru yeniden çizilir. Çoktan seçmeliye dönen soruda 2'den az şık varsa dört boş
    şık gelir. Eski şıklar saklı kalır: türü geri alırsan şıkların kaybolmaz (kaydederken yalnız çoktan seçmeli sorunun şıkları
    gider).

**Kaydetmek**

12. "Yeni ödev"de **"Ödevi ver"**e bas. Quiz ödevle tek işlemde kaydedilir: quizde hata varsa ödev de verilmez. Önce ekrandaki
    denetim çalışır ve ilk hatada durur: hatalı soru kırmızı çerçeveyle ve altındaki iletiyle işaretlenir, ekran ona kaydırılır,
    aynı ileti pencerenin altında kırmızı yazar. Önizleme ya da "Metinden ekle" paneli açıksa kapanır. İletiler:
    - "Quizde en az bir soru olmalı." · "Quizde en fazla 100 soru olabilir."
    - "Bütün quiz süresi 1 ile 180 dakika arasında olmalı." (süre ayarlarının bulunduğu bölüm kırmızı çerçeveyle işaretlenir)
    - "3. sorunun metni boş." · "3. sorunun metni en fazla 1000 karakter olabilir."
    - "3. sorunun süresi 10 saniye ile 10 dakika (600 sn) arasında olmalı."
    - "3. soruda doğru cevabı seç: Doğru ya da Yanlış."
    - "3. soruda en az 2 şık olmalı." · "3. soruda en fazla 10 şık olabilir."
    - "3. sorunun B şıkkı boş. Boş şıkkı sil ya da doldur." · "3. sorunun B şıkkı en fazla 300 karakter olabilir."
    - "3. soruda doğru şık işaretli değil."
    - "3. soruda bütün şıklar doğru işaretli; en az bir şık yanlış olmalı."
    - "Metinden ekle" panelinde yapıştırılmış ama aktarılmamış metin varsa: "Yapıştırdığın soruları önce "Ekle" ile quize aktar ya da "Vazgeç" de."
    Hatalı soruya yazmaya başlayınca kırmızı kalkar.
13. Sunucu aynı denetimi yeniden yapar; ekrandan geçen bir hata (ör. yalnız Word'ün görünmez karakterlerinden oluşan bir şık)
    sunucudan döner ve pencerenin altında kırmızı yazar. Sunucunun iletileri şıkkı harfle değil sırayla anar: "3. sorunun 2. şıkkı
    boş.", "3. sorunun 2. şıkkı en fazla 300 karakter olabilir.", "3. sorunun 2. şıkkı okunamadı."; ayrıca "Quiz bilgisi
    okunamadı.", "Süre türü Süresiz, Soru başına ya da Bütün quiz olmalı.", "Sonuçların ne zaman görüneceği seçilmeli.", "3. soru
    okunamadı.", "3. sorunun türü seçilmeli (Doğru/Yanlış, çoktan seçmeli ya da açık uçlu).", "3. sorunun süresi 10 saniye ile 10
    dakika arasında olmalı.", "3. soruda doğru cevap (Doğru ya da Yanlış) seçilmeli.".

**Verilmiş ödevin quizini değiştirmek**

14. "Ödevi düzenle" penceresi quizi kayıtlı hâliyle açar (quiz yoksa "Quiz ekle" düğmesi). Değiştir, **"Kaydet"**e bas. Quiz
    değişmediyse yalnız ödevin bilgileri kaydedilir; değiştiyse önce quiz, sonra ödev kaydedilir.
15. Pencere açıkken bir öğrenci quizi başlattıysa quiz kaydedilmez: quiz bölümü kilitli çizilir, ödevin ad, açıklama ve tarih
    değişiklikleri yine kaydedilir, pencere açık kalır ve altında turuncu ileti yazar: **"Ödevin öbür değişiklikleri kaydedildi;
    quiz kaydedilemedi: 1 öğrenci başladı; quiz artık değiştirilemez."**

**Kilit**

16. Bir öğrenci bile başladıysa quiz bölümü kilitli açılır: başlıkta "Quiz" ve soru sayısı (**"Quizi kaldır"** yok), turuncu kutuda
    **"3 öğrenci başladı; quiz artık değiştirilemez."**, altında özet (**"Quiz · 10 soru · 20 dk"**) ve yalnız **"Önizle"**.

**Quizi kaldırmak**

17. **"Quizi kaldır"**: quiz daha önce kaydedilmişse onay **"Quiz ödevden kaldırılsın mı? Kaydedince sorular silinir."**; yeni
    yazılan quizde soru yazılmışsa **"Quiz kaldırılsın mı? Yazdığın sorular silinir."**; hiç yazı yoksa sormaz. Bölüm kapanır,
    yerine "Quiz ekle" gelir. Asıl silme "Kaydet" ile olur; vazgeçersen quiz yerinde kalır.

Tasarımda (Tasarım 1 önizlemesi):

- Pencerenin quiz bölümü önce tek satırdır: **"Quiz:"** ve **"Quiz ekle"** düğmesi. Quiz eklenince satır başlığa döner: **"Quiz"**,
  yanında özet (ör. **"10 soru (1 açık uçlu, puansız) · 20 dakika"**), **"Quizi düzenle"** düğmesi (düzenleyici açıkken **"Kapat"**)
  ve çöp kutusu simgesi (**"Quizi kaldır"**). Çöp kutusu onay penceresi açar: **"Quiz kaldırılsın mı?"**, altında **"10 soru
  silinir."**, düğmesi **"Kaldır"**.
- Düzenleyicinin en üstünde araç satırı: **"Metinden ekle"**, **"Soru bankası"**, **"Önizle"** ("Metinden ekle" ve "Soru bankası"
  aynı yerde açılır kapanır panel olur). Sonra **"Süre:"** çipleri (Bütün quiz seçiliyken **"dakika"** kutusu; Soru başına
  seçiliyken "her sorunun süresini kartında yaz (10–600 sn)"), çıkınca kapanır kutusu (notu: "çıkışlar her durumda kaydedilir; bu
  seçenekle çıkarken açık olan soru bir daha cevaplanamaz") ve **"Sonuçlar öğrenciye:"** listesi (aynı iki seçenek).
- Her soru bir kart: numara, tür seçici (**"Doğru / Yanlış"**, **"Çoktan seçmeli"**, **"Açık uçlu"**), soru başına sürede saniye
  kutusu (5'er artar), çöp kutusu; soru metni kutusunun altında matematik düğmeleri ve **"Fotoğraf ekle"**
  ([Soruya fotoğraf ve matematik yazımı](soru-resmi-ve-matematik.md)); kartın altında **"Bankaya kaydet"**
  ([Soru bankası](soru-bankasi.md)).
- En altta **"Soru ekle"** ve yanında sayaç **"2 / 100 soru"**; 100'de "Bir quizde en çok 100 soru olur." Yeni soru çoktan seçmeli,
  dört boş şıkla ve soru başına sürede 60 saniyeyle gelir.
- Kaydederken quizde eksik varsa pencerenin altında **"Quiz: "** ile başlayan ileti çıkar (ör. "Quiz: 3. soruda düzeltilecek yer
  var.") ve eksik kartın altında kısa ileti yazar ("Soru metnini yaz.", "Bütün şıkları doldur (en az 2 şık).", "En az bir doğru şık
  işaretle.", "Soru süresi 10–600 saniye olmalı.").
- Kilitli quizde bölüm: **"Quiz:"**, özet ve **"3 öğrenci başladı; quiz artık değiştirilemez."**
- Ortak yazı düzenleyici (kullanıcının 30 Eylül isteği: "html editor yazı yazarken, ödev vb. her feature ve detayları olacak";
  tanımdaki alan listesinde quiz talimatı ve soru metni de var, "quiz soru düzenleyiciyle birlikte"): kalın, italik, liste gibi
  biçimler ([Düzenleyicinin bulunduğu yerler](../yazi-yazma/nerelerde-var.md)). Bugün quizin ayrı bir talimat (açıklama) alanı
  yok; önizlemede de çizilmedi.

### Müdür

Öğretmeni okuldan ayrılmış ödevde öğretmenle aynı adımlar: kontrol ekranında **"Ödevi düzenle"** ya da quiz satırındaki **"Quizi
düzenle"** ile quizi değiştirir, kaldırır, kilitliyse yalnız önizler. Müdürde "Ödev verir" yetkisi her zaman vardır. Başka bir
öğretmenin (okulda çalışan) ödevinin quizine dokunamaz; o ödevin kontrol ekranını açamaz.

### Çalışan

Bugünkü sitede öğretmen hesapları Öğretmen rolüyle çalışır; müdür Öğretmen rolünden "Ödev verir" yetkisini kaldırırsa kontrol
ekranında "Quizi düzenle" ve "Ödevi düzenle" çıkmaz, sunucu da quiz yazmayı reddeder ("Bu ödevin quizini düzenleme yetkin yok");
"Ödev verir" ile "Ödev sonuçlandırır"ın ikisi de yoksa menüden "Ödevler" kalkar. Yetki bir özel rolle derse göre daraltılmışsa
düğme görünür ama başka dersin ödevinde sunucu aynı iletiyle reddeder. Tasarımda öğretmen de okula çalışan olarak eklenir ve müdürün verdiği
Öğretmen rolüyle aynı şeyi yapar; rolsüz çalışan quiz yazmaz ([Yetki listesi](../roller-yetkiler/yetki-listesi.md)).

## Kurallar ve sınırlar

- **Ödev başına tek quiz.** Quiz ödevin parçasıdır; dosya yükleme izninden bağımsızdır (dosya izni kapalı ödevde de quiz çözülür).
- **Sınırlar:** en çok 100 soru; soru metni en çok 1000, şık en çok 300 karakter; çoktan seçmelide 2–10 şık; soru başına süre 10–600
  saniye; bütün quiz 1–180 dakika. Metinler sessizce kırpılmaz, sınırı aşan metin hata verir. Bugün soruya resim ve formül
  eklenmez.
- **Temizlik:** sunucu Word'den gelen görünmez karakterleri (sıfır genişlikli boşluk, yumuşak tire, yön işaretleri) siler, şık
  metnindeki satır sonlarını ve fazla boşlukları teke indirir.
- **Yetki:** quizi yazmak ve kaldırmak "Ödev verir" ister (ödevin dersine göre daraltılır): yoksa 403 "Bu ödevin quizini düzenleme
  yetkin yok". Yalnız ödevi veren öğretmen (sahipsiz ödevde müdür) düzenler; başkası için ödev "Yetkin yok" (403).
- **Kilit:** bir öğrenci başladıysa quiz değiştirilemez ve kaldırılamaz: 409 "3 öğrenci başladı; quiz artık değiştirilemez.".
  Denetim quiz kilitlenerek yapılır; aynı anda başlayan öğrenciyle yarışmaz: öğretmenin kaydı sürerken başlatan öğrenci kaydın
  bitmesini bekler ve güncel soruları alır, öğrenci önce başladıysa öğretmenin kaydı reddedilir.
- **Geçmiş yıl:** yıl seçiciden geçmiş yıla bakarken kayıt yapılamaz (409): "Geçmiş bir eğitim yılına bakıyorsun; kayıtlar salt
  okunur. Değişiklik için üstteki yıl seçiciden aktif yıla dön." ([Geçmiş yıla bakma](../egitim-yili/gecmis-yil.md)).
- **Ödevler kapalıysa** quiz de kapalıdır (403): "Ödevler bu okulda kapalı. Okul müdürü Özellikler sayfasından açabilir."
  ([Kapalı bölüm](../ozellikler/kapali-bolum.md)).
- Quiz ödevin teslim edilmiş sayılmasını, ödev sonucunu ve seriyi değiştirmez: puan yalnız öneridir ([Sonuçlar ve puan](sonuclar.md)).

## Kardeşler ve ilgili

**Kardeşler** (aynı klasör, [Quiz](README.md)):

- [Soru türleri](soru-turleri.md) — Doğru/Yanlış, çoktan seçmeli, açık uçlu; her türün kutuları.
- [Metinden ekle](metinden-ekle.md) — soruları Word'den yapıştırmak.
- [Önizle](onizle.md) — quizi öğrenci gözüyle görmek.
- [Soruları Excel'den aktarma](excelden-soru-aktarma.md), [Soruya fotoğraf ve matematik yazımı](soru-resmi-ve-matematik.md),
  [Soru bankası](soru-bankasi.md) — tasarlanan ekler.
- [Süre ve tek deneme](sure-ve-tek-deneme.md), [Çıkış kaydı](cikis-kaydi.md), [Sonuçlar ve puan](sonuclar.md) — ayarların öğrenci
  tarafındaki karşılığı.
- [Öğretmenin gördüğü cevaplar](ogrencinin-cevaplari.md) — kontrol ekranındaki quiz satırı ve rozetler.

**İlgili:**

- [Ödev verme](../odev/odev-verme.md), [Ödevi düzenleme ve silme](../odev/odevi-duzenleme-ve-silme.md) — quizin içinde durduğu pencereler.
- [Ödevin dosya yükleme izni](../odev/dosya-yukleme-izni.md) — quizden bağımsız.
- [Yetki listesi](../roller-yetkiler/yetki-listesi.md), [Ders ve sınıf daraltması](../roller-yetkiler/ders-ve-sinif-daraltmasi.md) — "Ödev verir".
- [Düzenleyicinin bulunduğu yerler](../yazi-yazma/nerelerde-var.md) — soru metni ve talimat için ortak yazı düzenleyici (tasarım).

## Kod tarafı

- Ön yüz: [public/js/parcalar/14c-quiz.md](../../public/js/parcalar/14c-quiz.md) ("Öğretmen: düzenleyici" — `quizAlani`,
  `quizAlaniIc`, `quizDuzenSorusu`, `quizDenetle`, `quizGovdesi`, `quiz-ekle`, `quiz-kaldir`, `quiz-soru-*`, `quiz-sik-*`),
  [public/js/parcalar/11-ogretmen-odev.md](../../public/js/parcalar/11-ogretmen-odev.md) ("Yeni ödev", "Ödevi düzenle" ve
  kilitli kaydetme), [public/js/parcalar/25-tiklama.md](../../public/js/parcalar/25-tiklama.md) ("Ödevi ver": quiz ödevle
  birlikte gider).
- Sunucu: [sunucu/bolumler/quiz.md](../../sunucu/bolumler/quiz.md) (`POST /api/assignments/<id>/quiz`, `yeniOdevQuizi`,
  `ogretmenQuizi`, kilit), [sunucu/yardimci/quiz.md](../../sunucu/yardimci/quiz.md) (`quizDogrula`, `QUIZ_SINIR`,
  `quizMetinTemizle`), [sunucu/bolumler/odev.md](../../sunucu/bolumler/odev.md) (ödev ile quizin tek işlemde yazılması, yol
  yönlendirmesi).
- Veri: [sunucu/veri/depo/quiz.md](../../sunucu/veri/depo/quiz.md), [sunucu/veri/sema/SEMA.md](../../sunucu/veri/sema/SEMA.md)
  (şema 029: `quizler`, `quiz_sorulari`, `quiz_secenekleri`).
- Testler: [testler/test-quiz.md](../../testler/test-quiz.md) (oluşturma, sınırlar, kilit),
  [testler/test-quiz-metin.md](../../testler/test-quiz-metin.md) (doğrulama ve ön yüz metinleri).
- Kullanıcıya dönük anlatım: [belge/KILAVUZ.md](../../belge/KILAVUZ.md) "Quiz" bölümü ("Hazırlama").

## Sık sorulanlar

- **Öğretmen quizi nasıl hazırlar?** "Yeni ödev ver" ya da "Ödevi düzenle" penceresinde "Quiz ekle"ye basar, her soruya tür
  seçer, süreyi ve sonuçların ne zaman görüneceğini belirler, ödevi verir (sitedeki SSS'nin özeti).
- **Quizi ödevden ayrı kaydedebilir miyim?** Hayır; quiz ödevle birlikte kaydedilir. Quizde hata varsa ödev de verilmez.
- **Öğrenci başladıktan sonra bir yazım hatası gördüm.** Quiz kilitlidir, değiştirilemez. Hatalı soruyu sonuçlara bakarken göz
  ardı edebilirsin; puan zaten yalnız öneridir, ödevin sonucunu sen seçersin.
- **Dosya yükleme kutusunu açmam gerekir mi?** Hayır; quiz dosya izninden bağımsızdır.
- **Pencerenin dışına tıkladım, kapanmadı.** Quiz bölümü açıkken pencere dışarı tıklayınca kapanmaz; "Vazgeç" kapatır.
- **Soruya resim ya da formül koyabilir miyim?** Bugün hayır. Fotoğraf ve basit matematik yazımı tasarlandı
  ([Soruya fotoğraf ve matematik yazımı](soru-resmi-ve-matematik.md)).

## Sırada

- Düzenleyiciler işi (onaylı, 28 Eylül): quiz soru düzenleyicisi — soruya fotoğraf, matematik yazımı, soru bankası; soru metni ve
  quiz talimatı ortak yazı düzenleyiciyle. Tasarım 1 önizlemesindeki araç satırı ("Metinden ekle · Soru bankası · Önizle") ve
  "N / 100 soru" sayacı bu işte gelir.
- Anket düzenleyici ve sınav formülü işleri: soruları Excel'den aktarma ("Metinden ekle"nin yanına).
- Android yerel uygulama: öğretmenin ödev verirken quiz eklemesi uygulamada ayrıca yazılacak.
- Çok dil: düzenleyicinin bütün yazıları çeviri kataloğundan geçecek.
