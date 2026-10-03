# İlerleyiş · İlerleyişim sayfası

**Durum:** Kodda var; tasarımda ek olarak sayfanın yeni düzeni: en üstte "Derslere göre ortalama", yan yana "Sınav sonuçları" ve "Ödev sonuçları" sütun grafikleri, altında "Son sınavlar" (öğrencide ayrıca "Ödev sonuçları") listesi.

Bir öğrencinin ödevlerini ve sınavlarını tek sayfada grafiklerle gösteren sayfa: öğrenci kendisininkini, veli çocuğununkini,
müdür ve yetkili öğretmen okulun öğrencisininkini açar.

## Ne işe yarar

"Ödevlerimi ne kadar yapıyorum, sınavlarda nasıl gidiyorum?" sorusunun cevabı burası. Ödevler ve sınavlar başka sayfalarda
tek tek durur; İlerleyişim onları özetler: ödevlerin sonuçlara göre sayısı, derslere göre başarı oranı, aynı türden
sınavların zaman içindeki çizgisi, gruba bağlı olmayan sınavlar ve sınav grubu ortalamaları.

Sayfa kullanıcının ilk isteğine dayanır (28 Ağustos): öğretmen her öğrenciye "yaptı yapmadı eksik ve gelmedi-izinli
gelmedi-izinli" yazabilecek "ve ilerleyişimde grafik olarak her birinin üstünde sütun grafiği olarak yazıcak"; sınav
grupları da "ilerleyişimde görünebilcek sınav grubu ortalamaları" olarak.

Sayfa yalnız bakmak içindir; hiçbir şey kaydetmez. Yalnız iki küçük görünüm tercihi (hangi ödev görünümü, grafik gizli mi)
ve sınav grafiğindeki bant tercihi tarayıcıda hatırlanır.

## Nereden açılır

Adres: sitenin adresinin sonuna `#/ilerleyisim`.

| Rol | Yol |
|---|---|
| Öğrenci | Sol menüde **"İlerleyişim"** (grafik simgeli; "Ders Programı" ile "Ödevler" arasında). Ana sayfada camgöbeği **"İlerleyişim"** kutucuğu; altında "Ortalama …" ya da "Not girilmedi" ([Kutucuklar](../ana-sayfa/kutucuklar.md)). |
| Veli | **"Çocuklarım"** sayfasında çocuğun kartına bas (kartta "Portalını aç" yazar): çocuğun portalı bu sayfayla açılır, menüde çocuğun adının altında **"İlerleyişi"** olur. Velinin kendi menüsündeki **"İlerleyiş"** başka bir sayfadır: [Velinin İlerleyiş sayfası](velinin-ilerleyis-sayfasi.md). |
| Müdür | Menüde **"Öğrenciler"** → öğrencinin satırında **"Portalını aç"**. |
| Öğretmen | "Öğrenci portalına girer" yetkisi varsa (ör. hazır "Rehber Öğretmen" rolü) menüde ek rolünün adını taşıyan başlığın (adı yoksa "Ek Yetkiler") altında **"Okul Öğrencileri"** → **"Portalını aç"**. |
| Öğretmen ya da müdür aynı zamanda veliyse | Sol menünün başındaki **Portallarım**'da çocuğun **"Veli"** satırına (altında çocuğun adı) dokun: veli portalına geçersin (öğretmen ya da müdür oturumu kapanır, yenisi açılır); sonra veli gibi **"Çocuklarım"** → çocuğun kartı. Eski usul hesapta (öğretmenlik ya da müdürlük yetişkin hesabının kendisinde duruyorsa) menünün altındaki **"Velisi olduğum"** → **"Çocuklarım"**. |

Telefonda menü sol üstteki ☰ ile açılır ([Telefonda menü](../menu-ve-arama/telefonda-menu.md)).

Tasarımda (Tasarım 1 önizlemesi): öğrencinin menüsünde "İlerleyişim" yine "Ders programı" ile "Ödevler" arasında
(ardından "Sınavlarım" ve "Başarılarım"); ana sayfa kutucuğu camgöbeği "İlerleyişim", altında "ortalama 84,4". Velide her
çocuğun ayrı oturumu var; çocuğun ilerleyişi o oturumun menüsündeki "İlerleyiş" sayfasıdır
([Velinin İlerleyiş sayfası](velinin-ilerleyis-sayfasi.md)). Müdür "Öğrenciler"de sınıf çipine, sonra öğrenciye dokunur;
açılan kişi penceresinde "Portal — Kişinin gördüğü ekranı aç" satırında **"Portalını aç"** bağlantısı durur
([Öğrencinin portalını açma](../hesaplar/ogrenci-portalini-acma.md)).

## Adım adım

### Ekranın düzeni (bugünkü site)

1. En üstte büyük başlık **"İLERLEYİŞ"**. Altında kendin bakıyorsan "Ödev ve sınav durumun.", başkasının adına bakıyorsan
   "<Öğrencinin adı soyadı> adına görüntülüyorsun." (ör. "Elif Yılmaz adına görüntülüyorsun.").
2. Bakılabilecek en az iki eğitim dönemi varsa başlığın üstünde **eğitim yılı şeridi**: "Eğitim yılı" ve bir açılır liste
   ("2026-2027 (aktif)" gibi; nakil gelen öğrencide sonda "Önceki okullar" grubu). Geçmiş bir döneme bakılıyorsa şeridin
   yanında "Geçmiş yıla bakıyorsun — kayıtlar salt okunur." ya da "Önceki okulunun kaydına bakıyorsun — kayıtlar salt
   okunur." yazar ([Geçmiş yıla bakma](../egitim-yili/gecmis-yil.md)).
3. **"Ödevler"** kartı: başlığın sağında üç küçük düğme, **"Sonuçlara göre"**, **"Derslere göre"**, **"Grafiği gizle"**.
   "Sonuçlara göre" [Ödev sonuçları grafiği](odev-grafigi.md)dir, "Derslere göre" [Derslere göre başarı oranı](ders-oranlari.md).
4. **"Sınav grafiği"** kartı: aynı şablonla yapılmış sınavların çizgi grafiği ([Sınav grafiği](sinav-grafigi.md)). Veri
   gelene kadar kutuda parlayan boş bir yer tutucu durur (sayfa kaymasın diye yüksekliği sabittir).
5. **"Sınavlar"** kartı (yalnız gruba bağlı olmayan sınavın varsa) ve **"Sınav grubu ortalamaları"** kartı (her zaman)
   ([Sınavlar ve grup ortalamaları](sinavlar-ve-grup-ortalamalari.md)).
6. Grafikler kutularının gerçek genişliğinde çizilir: yazılar telefonda da masaüstünde de aynı boyda kalır. Telefonu yan
   çevirince ya da pencereyi daraltınca grafikler yeni genişlikte yeniden çizilir.

Tasarımda (Tasarım 1 önizlemesi): başlık **"İlerleyişim"**, altında "Notların ve ödevlerin bir arada" (velide
"İlerleyiş" ve "Elif · 7-A"). Sırayla:

1. **"Derslere göre ortalama"** kutusu (sağında "1. dönem"): her ders bir sütun, üstünde ortalaması
   ([Derslere göre ortalama](derslere-gore-ortalama.md)).
2. Yan yana iki grafik: **"Sınav sonuçları"** (sağında "sütun: tam puana oranı";
   [Sınav sonuçları sütun grafiği](sinav-sonuclari-grafigi.md)) ve **"Ödev sonuçları"** (sağında "2 sonuçlanan ödev" gibi;
   [Ödev sonuçları grafiği](odev-grafigi.md)). Her biri en az 320 piksel; dar ekranda alt alta iner.
3. **"Son sınavlar"** listesi: her sınav bir satır, dokununca sınavın ayrıntı penceresi
   ([Sınavlar ve grup ortalamaları](sinavlar-ve-grup-ortalamalari.md)).
4. Yalnız öğrencide **"Ödev sonuçları"** listesi: sonuçlanan ödevler, dokununca ödev penceresi
   ([Ödev sonuçları grafiği](odev-grafigi.md)).

Önizlemede çizgi sınav grafiği, "Sonuçlara göre / Derslere göre" düğmeleri, "Grafiği gizle", "Belirsiz" sütunu ve sınav
grubu ortalamaları yok. Kullanıcı bunların kalkmasını söylemedi; 2 Ekim'de onayladığı karara göre üzerine yorum yapmadığı
ekranlar bugünkü site gibi kalır, sınav grubu ortalamalarını da 28 Ağustos'ta açıkça ilerleyişte istedi. Bu belge bu
yüzden bugünkü kartların kalacağını, önizlemenin getirdiği parçaların ekleneceğini varsayar; kodlanırken kullanıcıya
sorulmalı.

### Öğrenci

1. Menüden **"İlerleyişim"**e ya da ana sayfadaki **"İlerleyişim"** kutucuğuna dokun.
2. "Ödevler" kartında ödevlerinin sonuçlarını sütunlarda gör; ders ders başarı oranını görmek için **"Derslere göre"**ye bas
   ([Derslere göre başarı oranı](ders-oranlari.md)). Grafiği istemiyorsan **"Grafiği gizle"**; geri getirmek için
   **"Grafiği göster"**.
3. "Sınav grafiği"nde birden çok şablon varsa üstteki sekmelerden birini seç (ör. "LGS Denemesi"), alttaki ölçüm
   sekmelerinden hangisinin çizileceğini seç (ör. "Türkçe Net"); tablo istersen **"Liste"** ([Sınav grafiği](sinav-grafigi.md)).
4. Aşağıda gruba bağlı olmayan sınavlarını ve sınav grubu ortalamalarını gör.
5. Geçmiş bir yıla bakmak için en üstteki eğitim yılı şeridinden yılı seç; sayfa o yılın ödev ve sınavlarıyla yenilenir.
6. Üst şeritteki **"İçerik Ara"** kutusu bu sayfada yalnız "Sınavlar" kartındaki satırları süzer
   ([Sayfa içi arama](../menu-ve-arama/sayfa-ici-arama.md)).

Tasarımda: "Son sınavlar"daki bir satıra dokununca sınavın ayrıntı penceresi ("Sınav ayrıntısı": Sınav, Ders, Form, Sınav
tarihi, Sonuç tarihi, ölçümler tablosu ve **"Raporla"**; [Sınav ayrıntısı](../sinav/sinav-ayrintisi.md)), "Ödev sonuçları"
listesindeki bir satıra dokununca ödev penceresi açılır ([Ödev penceresi](../odev/odev-penceresi.md)).

### Veli

1. Menüden **"Çocuklarım"**a gir (sayfa başlığı "ÇOCUKLARIM", altında "Çocuğunun kartına tıklayarak portalını aç.").
2. Çocuğunun kartına bas (kartta adı, okulu, "Portalını aç" etiketi ve "Kaldır" düğmesi var; "Kaldır"a basarsan çocuk
   hesabından kaldırılır, dikkat). Çocuğun portalı açılır ve ilk sayfa budur.
3. Alt yazı "<Çocuğun adı soyadı> adına görüntülüyorsun." olur. Menü çocuğun portal menüsüne döner: "Ana Sayfa",
   **"Çocuk Listesi"**, çocuğun adı başlığı altında "Ders Programı", "Takvimi", **"İlerleyişi"**, "Ödevleri", "Sınavları",
   "Devamsızlığı".
4. Kartlar öğrencinin gördüğüyle aynıdır; sınav grafiğinin göstergesinde "Senin değerin" yerine "Öğrencinin değeri" yazar.
5. Çıkmak için menüde **"Çocuk Listesi"**: Çocuklarım sayfasına dönersin.

Portal görünümünde eğitim yılı şeridi çıkmaz (veliye şerit yalnız kendi Ödevler, Devamsızlık ve İlerleyiş sayfalarında
görünür); veriler velinin o sayfalarda seçtiği yıla göre gelir.

Tasarımda: velide her çocuk ayrı oturum (kullanıcının 3 Ekim kararı). Çocuklarım'da çocuğun penceresinde "Portal" satırı:
bulunduğun çocukta "Şu an Elif'in oturumundasın", öbüründe "Elif'in oturumu" ve **"Portalını aç"** düğmesi; altında "Her
çocuğun ayrı oturumu var.". Çocuğun ilerleyişi o oturumun menüsündeki "İlerleyiş" sayfasıdır
([Velinin İlerleyiş sayfası](velinin-ilerleyis-sayfasi.md), [Velide her çocuk ayrı oturum](../portallar/velide-cocuk-oturumlari.md)).

### Öğretmen

1. Müdür sana "Öğrenci portalına girer" yetkisini vermiş olmalı (yetki listesinde açıklaması "Öğrencinin gördüğü ekranı
   birebir açar."; hazır "Rehber Öğretmen" rolünde açık gelir —
   [Yetki listesi](../roller-yetkiler/yetki-listesi.md), [Hazır şablonlar](../roller-yetkiler/hazir-sablonlar.md)).
2. Menüde ek rolünün adını taşıyan başlığın (ör. "Rehber Öğretmen"; adı yoksa "Ek Yetkiler") altında **"Okul
   Öğrencileri"**ne gir; öğrenciyi bul (sayfanın kendi arama kutusu: "Öğrenci
   ara — ad, sınıf, okul no ya da kullanıcı adı").
3. Satırdaki **"Portalını aç"**a bas. Öğrencinin İlerleyişim sayfası "<ad> adına görüntülüyorsun." alt yazısıyla açılır.
4. Bu yetki okulun BÜTÜN öğrencilerine açılır (yalnız kendi sınıflarına değil). Sınav grafiğinde yalnız senin okulunda
   yapılmış sınavlar görünür; nakil gelen öğrencinin eski okulundaki ödev ve notlar görünmez.
5. Dönmek için menüde **"Öğrenci Listesi"**.

Yetkin yoksa: sunucu ders verdiğin öğrencinin ilerleyişini görmene izin verir ama ekranda bu sayfaya giden bir yol yok;
kendi öğrencilerin için [Sınıflarım](../siniflar-dersler/siniflarim.md) sayfası var (verdiğin ödevler ve öğrencinin sınav
sonuçları). Aynı zamanda veliysen kendi çocuğunun ilerleyişine Portallarım'dan veli portalına geçerek bakarsın (eski usul
hesapta menünün altındaki "Velisi olduğum" bölümünden; [Velinin İlerleyiş sayfası](velinin-ilerleyis-sayfasi.md)).

Tasarımda: yetkinin adı "Portalına bakar"; hazır "Rehber öğretmen" rolünde ve önerilen "Sınıf öğretmeni" rolünde açık
(bu şablon öneridir, onay bekliyor). Portal açmanın yolu müdürünkiyle aynı kişi penceresidir.

### Çalışan

Bugün kodda "çalışan" ayrı bir hesap türü değil: Müdür Yardımcısı, Rehber Öğretmen gibi görevler öğretmen hesabına ek rol
olarak verilir. Ek rolünde "Öğrenci portalına girer" varsa öğretmen gibi "Okul Öğrencileri" → "Portalını aç" yolunu kullanır
(hazır "Müdür Yardımcısı" şablonunda bu yetki YOK; müdür isterse ekler).

Tasarımda (çalışan tanımı): kişi okula "çalışan" olarak eklenir; rolsüz çalışan bu sayfayı göremez. Rolünde "Portalına
bakar" olan çalışan öğrencinin portalını açıp İlerleyişim'ine bakar ([Rolsüz çalışan](../ogretmenler-calisanlar/rolsuz-calisan.md),
[Özel roller](../roller-yetkiler/ozel-roller.md)).

### Müdür

1. Menüde **"Öğrenciler"** (sayfa başlığı "ÖĞRENCİLER", altında "N öğrenci kayıtlı.").
2. Öğrencinin satırında **"Portalını aç"**a bas (müdürde bu düğme her zaman var; yanında "Hesap" düğmesi de durur).
3. Öğrencinin İlerleyişim sayfası açılır; menü öğrencinin portal menüsüne döner, başında **"Öğrenci Listesi"**.
4. Okulunun bütün öğrencilerine bakabilirsin. Sınav grafiğinde yalnız okulunda yapılmış sınavlar görünür; nakil gelen
   öğrencinin eski okulundaki kayıtlar görünmez.
5. En üstte kendi okulunun eğitim yılı şeridi durur (okulda en az iki yıl varsa); geçmiş bir yıl seçiliyse öğrencinin o
   yılki ödev ve sınav kartları gelir. Öğretmende de aynı.
6. Bir öğrencinin aynı zamanda velisiysen çocuk Portallarım'da ayrı bir "Veli" satırıdır; ona geçince veli menüsüyle
   bakarsın. "Velisi olduğum" bölümü yalnız eski usul hesapta (müdürlük yetişkin hesabının kendisindeyse) menünün altında çıkar.

Tasarımda: "Öğrenciler"de üstte "Bütün okul" ve sınıf çipleri; sınıfı seçince öğrenciler (baş harfleri, ad, "okul no …");
öğrenciye dokununca kişi penceresi: "Kullanıcı adı", "Şifre", **"Portal — Kişinin gördüğü ekranı aç — Portalını aç"**,
öğrencide ayrıca "Başarılar — Belgeli başarı ekle" ([Öğrencinin portalını açma](../hesaplar/ogrenci-portalini-acma.md)).

## Kurallar ve sınırlar

- **Kim görebilir (sunucu her istekte denetler):** öğrencinin kendisi; çocuğa veli bağı olan hesap (veli bağı yetişkin
  hesabındadır: öğretmen ya da müdür portalındayken bu bağla görülmez, veli portalına geçilir; eski usul öğretmen ya da müdür
  hesabında bağ hesabın kendisindedir);
  öğrencinin okulunun müdürü; aynı okulda "Öğrenci portalına girer" yetkili öğretmen; öğrencinin derslerine giren öğretmen;
  sistem yöneticisi. Başka biri denerse "Bu öğrenciyi görme yetkin yok"; istenen kişi öğrenci değilse "Öğrenci bulunamadı";
  giriş yapılmamışsa "Giriş yapmalısın". Henüz bir okula bağlı olmayan yetişkin hesabı: "Hesabın henüz bir okula bağlı
  değil. Okul yönetimi seni ekleyince bu bölüm açılır."
- **Servisçi** göremez (sunucu izin vermez, menüsünde yok). **Sistem yöneticisinin** sunucu izni var ama yönetim
  ekranlarında bu sayfaya giden bir yol yok. **Giriş yapmamış ziyaretçi** için herkese açık bir ilerleyiş yok.
- **Dar veri:** sayfaya öğrencinin yalnız adı, sınıfı ve okulunun adı gelir; veli kodu, adres, telefon, e-posta, doğum
  tarihi gelmez (bu uç öğrencinin dersine giren her öğretmene de açık olduğu için).
- **Eğitim yılı:** ödevler, gruba bağlı olmayan sınavlar ve sınav grupları bakılan döneme göre süzülür. Öğrenci şeritten
  geçmiş bir yılı seçer; veli kendi sayfalarındaki şeritten seçer, çocuğun gözünden (çocuğun okulu ve önceki okulları)
  bakar. [Sınav grafiği](sinav-grafigi.md) ise yıla göre süzülmez: şablonlu bütün sınavlar tarih sırasıyla gelir.
- **Nakil:** öğrenci ve velisi önceki okulların kayıtlarını yıl seçicideki "Önceki okullar" grubundan görür; yeni okulun
  müdürü ve öğretmenleri eski okulun ödev ve notlarını görmez ([Öğrenci nakli](../hesaplar/ogrenci-nakli.md)).
- **Okulun kapattığı bölümler:** bu sayfa Özellikler'den kapatılamaz, her zaman açılır. "Ödevler" bölümü kapalı okulda
  "Ödevler" kartı yine çıkar ve "Henüz ödev yok." der. "Sınavlar" kapalıysa "Sınav grubu ortalamaları" kartı "Henüz gruplu
  sınav yok." der, sınav grafiği kutusunda kırmızı "Sınavlar bu okulda kapalı. Okul müdürü Özellikler sayfasından
  açabilir." iletisi çıkar (kod okumasına göre; bilinen açık, aşağıda Sırada) ([Kapalı bölüm](../ozellikler/kapali-bolum.md)).
- **Quiz puanı grafiğe girmez.** Grafikler yalnız öğretmenin seçtiği ödev sonucunu (Yaptı, Eksik…) kullanır
  ([Quiz sonuçları](../quiz/sonuclar.md)).
- **Yıldız ve seri bu sayfada yok.** Ödev serisi ana sayfada ve Ödevler sayfasında durur ([Ödev serisi](../odev/seri.md)).
- **Portal görünümü sayfa yenilenince kaybolur** (bilinen açık, kod okumasına göre): müdür, öğretmen ya da veli öğrencinin
  portalındayken sayfayı yenilerse adres `#/ilerleyisim` kalır ama "kimin adına" bilgisi silinir; sayfa kişinin kendi
  kimliğiyle istenir ve kırmızı kutuda "Öğrenci bulunamadı" çıkar. Menüden yeniden "Portalını aç" ile girersin.
- **Arama:** üst şeritteki "İçerik Ara" yalnız "Sınavlar" kartındaki satırları süzer; grafikler ve grup satırları
  süzülmez. Hiçbir satır tutmazsa sayfanın sonuna '"<aranan>" için sonuç bulunamadı.' eklenir.
- **Yüklenemezse:** sunucunun iletisi sayfanın yerine kırmızı kutuda yazılır; sınav grafiği kendi hatasını yalnız kendi
  kutusunda gösterir, sayfanın kalanı bozulmaz.
- **Bildirim yok:** ilerleyiş sayfasının kendisi bildirim göndermez; sınav notu ve ödev sonucu bildirimleri kendi
  bölümlerinden gider ([Otomatik bildirimler](../bildirim/otomatik-bildirimler.md)).

## Kardeşler ve ilgili

**Kardeşler** (aynı klasör, [İlerleyiş](README.md)):

- [Velinin İlerleyiş sayfası](velinin-ilerleyis-sayfasi.md) — velinin kendi menüsündeki "İlerleyiş".
- [Ödev sonuçları grafiği](odev-grafigi.md) — "Sonuçlara göre", "Grafiği gizle".
- [Derslere göre başarı oranı](ders-oranlari.md) — "Derslere göre".
- [Sınav grafiği](sinav-grafigi.md) — çizgi grafik, bant, Grafik / Liste.
- [Sınavlar ve grup ortalamaları](sinavlar-ve-grup-ortalamalari.md) — "Sınavlar", "Sınav grubu ortalamaları", tasarımda "Son sınavlar".
- [Sınav sonuçları sütun grafiği](sinav-sonuclari-grafigi.md) — tasarım.
- [Derslere göre ortalama](derslere-gore-ortalama.md) — tasarım.

**İlgili:**

- [Öğrencinin ana sayfası](../ana-sayfa/ogrenci-ana-sayfasi.md) ve [Kutucuklar](../ana-sayfa/kutucuklar.md) — "İlerleyişim" kutucuğu.
- [Çocuklarım](../portallar/cocuklarim.md), [Velide her çocuk ayrı oturum](../portallar/velide-cocuk-oturumlari.md).
- [Öğrencinin portalını açma](../hesaplar/ogrenci-portalini-acma.md), [Öğrenci listesi](../hesaplar/ogrenci-listesi.md).
- [Ödev listesi](../odev/liste.md), [Sonuçlandırma](../odev/sonuclandirma.md), [Ödev serisi](../odev/seri.md).
- [Sınavlarım](../sinav/sinavlarim.md), [Sınav grupları](../sinav/sinav-gruplari.md), [Şablonlar](../sinav/sablonlar.md).
- [Geçmiş yıla bakma](../egitim-yili/gecmis-yil.md), [Kapalı bölüm](../ozellikler/kapali-bolum.md).
- [Sınıflarım](../siniflar-dersler/siniflarim.md) — öğretmenin kendi öğrencilerine baktığı yer.
- [Başarılarım](../basarilar/basarilarim.md) — tasarımda ayrı sayfa (menüde "İlerleyişim"in yakınında).
- [Kim neyi görür](../kvkk-ve-gizlilik/kim-neyi-gorur.md).

## Kod tarafı

- Sunucu: [sunucu/bolumler/ilerleyis.md](../../sunucu/bolumler/ilerleyis.md) — `GET /api/progress?studentId=` (`progressOf`:
  `student`, `assignments`, `subjects`, `examGroups`, `exams`, `kapaliOzellikler`, `seri`); görme yetkisi
  [sunucu/iliskiler.md](../../sunucu/iliskiler.md) (`canSeeStudent`); yıl süzgeci
  [sunucu/bolumler/egitim-yili.md](../../sunucu/bolumler/egitim-yili.md) (`yilSuz`, `bakisKisisi`); kapılar
  [sunucu/api.md](../../sunucu/api.md); yetki adı [sunucu/yetki.md](../../sunucu/yetki.md) (`ogrenci.portal`).
- Sınav grafiği ucu: [sunucu/bolumler/sinav.md](../../sunucu/bolumler/sinav.md) (`GET /api/exams/grafik`).
- Ön yüz: [public/js/parcalar/13-ogrenci-veli.md](../../public/js/parcalar/13-ogrenci-veli.md) (`SAYFALAR.ilerleyisim`,
  `ilerleyisKartlari`, `hedefOgrenci`), [public/js/parcalar/28-grafik.md](../../public/js/parcalar/28-grafik.md) (grafikler),
  [public/js/parcalar/06-menu.md](../../public/js/parcalar/06-menu.md) (menü satırları ve portal menüsü),
  [public/js/parcalar/10-mudur.md](../../public/js/parcalar/10-mudur.md) (`ogrenciPortalAc`, "Portalını aç"),
  [public/js/parcalar/23-veli-ayarlar.md](../../public/js/parcalar/23-veli-ayarlar.md) (Çocuklarım kartı),
  [public/js/parcalar/25-tiklama.md](../../public/js/parcalar/25-tiklama.md) (`cocuk-ac`, `ogrenci-portal`, `geri-veli`),
  [public/js/parcalar/08-ana-sayfa.md](../../public/js/parcalar/08-ana-sayfa.md) (kutucuk),
  [public/js/parcalar/16-egitim-yili.md](../../public/js/parcalar/16-egitim-yili.md) (yıl şeridi),
  [public/js/parcalar/24-bildirim-arama-mobil.md](../../public/js/parcalar/24-bildirim-arama-mobil.md) (arama).
  Görünüm: `public/css/parcalar/05-tablo-grafik.css`, `25-grafik-sinav.css` ([CSS.md](../../public/css/parcalar/CSS.md)).
- Testler: [testler/test-sinav.md](../../testler/test-sinav.md), [testler/test-veli-coklu.md](../../testler/test-veli-coklu.md),
  [testler/test-ozellikler.md](../../testler/test-ozellikler.md), [testler/test-nakil.md](../../testler/test-nakil.md),
  [testler/buton-denetimi.md](../../testler/buton-denetimi.md).
- Kullanıcıya dönük anlatım: [belge/KILAVUZ.md](../../belge/KILAVUZ.md) ("İlerleyişim" ve "Veli tarafı" bölümleri).
- Android: bugün uygulamada ilerleyiş ekranı yok; tanımda öğrencinin "Diğer" sekmesinde "Sınavlar/İlerleyiş grafiği",
  velinin "Diğer" sekmesinde "İlerleyiş" var ([Android uygulaması](../uygulama/android-uygulamasi.md)).

## Sık sorulanlar

- **Ortalamam nereden geliyor?** Ana sayfadaki "Ortalama …" sınav grubu ortalamalarının düz ortalamasıdır; ayrıntısı
  "Sınav grubu ortalamaları" kartında ([Sınavlar ve grup ortalamaları](sinavlar-ve-grup-ortalamalari.md)).
- **Quizden aldığım puan grafiğe giriyor mu?** Hayır; grafik öğretmenin ödeve verdiği sonucu sayar.
- **Velim benim ilerleyişimi görür mü?** Evet, veli kodunla hesabına bağladıysa. Ödev yıldızların ve ödev serin ona gitmez.
- **Öğretmenim görür mü?** Derslerine girdiği öğretmen kendi "Sınıflarım" sayfasından senin sonuçlarına bakar; okulun
  müdürü ve "Öğrenci portalına girer" yetkili öğretmen bu sayfanın aynısını açabilir.
- **Eski yılımı görebilir miyim?** Evet, en üstteki eğitim yılı şeridinden (sitenin SSS'sindeki "Geçmiş eğitim yıllarına
  bakılabilir mi?" sorusu). Okul değiştirdiysen önceki okulun da "Önceki okullar" grubunda.
- **Okul bu sayfayı kapatabilir mi?** Hayır; Özellikler'de ilerleyiş diye bir anahtar yok. Ödevler ya da Sınavlar kapalıysa
  ilgili kartlar boş kalır; sınav grafiği kutusunda "Sınavlar bu okulda kapalı…" iletisi çıkar.
- **Sayfayı yeniledim, "Öğrenci bulunamadı" çıktı.** Öğrencinin portalındayken yenileyince olur; "Portalını aç" ile yeniden gir.

## Sırada

- Arayüz önizlemesi (Tasarım 1) koda geçerken: İlerleyişim'e "Derslere göre ortalama" ve "Sınav sonuçları" sütun grafiği,
  "Son sınavlar" listesi, öğrencide "Ödev sonuçları" listesi; bugünkü kartların kalıp kalmayacağı kullanıcıya sorulacak.
- Velide her çocuk ayrı oturum (3 Ekim kararı): Çocuklarım'daki "Portalını aç" o çocuğun oturumuna geçecek.
- Sınav: formüllü ölçüm + sınav grubu üst değeri (öneri, onay bekliyor): grup sonuçları "100 üzerinden" yerine grubun üst
  değeriyle (ör. "98,5 / 125"); hesaplanan ölçümler grafiğe yeni sekme olarak girer.
- Optimizasyon + saklama süreleri: öğrenci ve veli yalnız aktif yılı ve bir önceki yılı görecek.
- Tam debug (Linux'ta): belgelemede bulunan açıklar — okulun kapattığı bölümün kartlarının yine çizilmesi, yenilemede
  portal görünümünün kaybolması ("Öğrenci bulunamadı"), ana sayfadaki ortalamanın noktalı yazılması. Nasıl düzeltileceği
  henüz kararlaştırılmadı.
- Başarılarım: öğrencinin başarıları ayrı sayfa olarak gelecek (KILAVUZ bugünden "başarılar" diyor).
- Çalışan olarak ekleme; özel roller (yeni "Sınıf öğretmeni" şablonu, öneri).
- Çok dil: sayfadaki metinler çeviri kataloğuna (Tasarım 1'de "İlerleyişim" → "My progress").
- Android yerel uygulama: öğrencide ve velide İlerleyiş ekranı.
