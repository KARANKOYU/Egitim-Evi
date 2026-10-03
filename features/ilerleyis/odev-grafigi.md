# İlerleyiş · Ödev sonuçları grafiği

**Durum:** Kodda var; tasarımda ek olarak başlığın yanında sonuçlanan ödev sayısı ("2 sonuçlanan ödev"), sonuçların yeni renkleri, "Sınav sonuçları" grafiğiyle yan yana duruş ve öğrencide grafiğin altında sonuçlanan ödevlerin listesi.

Öğrencinin ödevlerini sonuca göre sayan sütun grafik: Yaptı, Geç yaptı, Eksik, Yapmadı, İzinli, Gelmedi ve Belirsiz, her
sütunun üstünde sayısı.

## Ne işe yarar

Öğrenci ve velisi "kaç ödevi yaptım, kaçını kaçırdım?" sorusunu tek bakışta görür. Bu grafik kullanıcının ilk isteğidir
(28 Ağustos): öğretmen her öğrenciye "yaptı yapmadı eksik ve gelmedi-izinli gelmedi-izinli" yazar "ve ilerleyişimde
grafik olarak her birinin üstünde sütun grafiği olarak yazıcak". Grafik yalnız öğretmenin [sonuçlandırmada](../odev/sonuclandirma.md)
seçtiği sonucu sayar; öğrencinin dosya yüklemesi ya da quiz puanı grafiğe girmez.

Aynı kartta ikinci görünüm "Derslere göre"dir: [Derslere göre başarı oranı](ders-oranlari.md).

## Nereden açılır

- [İlerleyişim sayfası](ilerleyisim.md)ndaki **"Ödevler"** kartı, **"Sonuçlara göre"** düğmesi (ilk açılışta seçili gelir).
- Velinin [İlerleyiş sayfası](velinin-ilerleyis-sayfasi.md)nda her çocuğun "Ödevler" kartı.
- Müdür ve "Öğrenci portalına girer" yetkili öğretmen: öğrencinin portalında "İlerleyişi".

Tasarımda (Tasarım 1 önizlemesi): İlerleyişim'de (velide İlerleyiş'te) "Derslere göre ortalama"nın altında, "Sınav
sonuçları" grafiğinin yanında duran **"Ödev sonuçları"** kutusu.

## Adım adım

### Grafiğin düzeni (bugünkü site)

1. Kartın başlığı **"Ödevler"**; sağında üç küçük düğme: **"Sonuçlara göre"** (seçili), **"Derslere göre"**, **"Grafiği
   gizle"**.
2. Yedi sütun, hep bu sırayla: **Yaptı** (yeşil), **Geç yaptı** (mavi), **Eksik** (turuncu), **Yapmadı** (kırmızı),
   **İzinli** (gri; "Gelmedi (izinli)" sonucu), **Gelmedi** (bordo; "Gelmedi (izinsiz)" sonucu), **Belirsiz** (ızgara
   çizgisi renginde, en silik sütun: açık temada açık gri, koyu temada koyu gri).
3. Her sütunun üstünde sayısı yazar; hiç olmayan sonucun sütunu boştur ama "0" yazar.
4. Soldaki eksen 0'dan başlar ve "güzel" sayılara yuvarlanır (en büyük sayı 3 ise 0, 1, 2, 3; 174 olsaydı 0–200, 50'şer);
   arkada yatay ince çizgiler.
5. Fareyle bir sütunun üstüne gelince küçük ipucu: "Yaptı: 3".
6. Hareketi azaltma ayarı kapalıysa sütunlar açılışta aşağıdan yukarı büyüyerek gelir.
7. Hiç ödevin yoksa grafik yerine "Henüz ödev yok." yazar.

Tasarımda (Tasarım 1 önizlemesi):

1. Kutunun başlığı **"Ödev sonuçları"** (solunda kırmızı zeminde ödev simgesi); sağında sonuçlanan ödevlerin sayısı, ör.
   **"2 sonuçlanan ödev"**.
2. Altı sütun: **Yaptı** (yeşil), **Geç yaptı** (turuncu), **Eksik** (sarı), **Yapmadı** (kırmızı), **İzinli** (gri),
   **İzinsiz** (mor). "Belirsiz" sütunu yok: yalnız sonuçlanan ödevler sayılır.
3. Her sütunun üstünde sayısı; sütunun boyu en kalabalık sonuca göre. Üstüne gelince "Gelmedi (izinli): 1 ödev" gibi ipucu.
4. Kutu "Sınav sonuçları" grafiğiyle yan yana (her biri en az 320 piksel; dar ekranda alt alta), sütun alanı 220 piksel
   yüksekliğinde.
5. Öğrencide sayfanın altında ayrıca **"Ödev sonuçları"** listesi: her sonuçlanan ödev bir satır; solda dersin kısaltması
   (ör. "İNG", dersin renginde), ödevin adı ("Meb homework"), altında "İngilizce · Mert Can · son 1 Ekim 12:00", sağda sonucu
   ("Yaptı" yeşil, öteki sonuçlar kırmızı). Satıra dokununca ödev penceresi açılır ([Ödev penceresi](../odev/odev-penceresi.md)).

Önizlemede "Sonuçlara göre / Derslere göre" düğmeleri ve "Grafiği gizle" yok. Kullanıcı bunların kalkmasını söylemedi;
2 Ekim kararına göre (üzerine yorum yapmadığı ayrıntılar bugünkü site gibi) kalır. "Belirsiz" sütununun kalkması
önizlemenin seçimi; kodlanırken kullanıcıya sorulmalı.

### Öğrenci

1. [İlerleyişim](ilerleyisim.md)i aç; "Ödevler" kartı "Sonuçlara göre" görünümüyle gelir.
2. Sütunlara bak: bu eğitim yılında sana verilen bütün ödevler sayılır. Süren ödevler ve öğretmenin henüz sonuç yazmadığı
   ödevler **"Belirsiz"**dedir.
3. Ders ders görmek için **"Derslere göre"**ye bas ([Derslere göre başarı oranı](ders-oranlari.md)); geri dönmek için
   **"Sonuçlara göre"**. Geçiş anında olur, sayfa yeniden yüklenmez. Son seçtiğin görünüm bir dahaki açılışta da gelir.
4. Grafiği istemiyorsan **"Grafiği gizle"**: kartın başlığı ve düğmeleri kalır, grafik gizlenir; düğmenin adı **"Grafiği
   göster"** olur. Sayfayı yenilesen de gizli kalır.
5. Geçmiş bir yılın grafiği için en üstteki eğitim yılı şeridinden yılı seç.

Tasarımda: grafiğin altındaki "Ödev sonuçları" listesinden bir ödeve dokununca ödevin penceresi ("Başlık:", "Ders:",
"Öğretmen:", "Başlama:", "Son tarih:", "Sonuç:", "Açıklama:" ve "Teslim edilen dosyalar") açılır.

### Veli

1. Menüde **"İlerleyiş"** (ya da çocuğun portalında "İlerleyişi").
2. Her çocuğun "Ödevler" kartı ayrıdır; kartlar ve düğmeler öğrencidekiyle aynı.
3. "Grafiği gizle" bütün çocukların kartlarına birlikte uygulanır. "Sonuçlara göre / Derslere göre" ise yalnız bastığın
   kartı hemen değiştirir; seçim tek tercih olarak saklandığı için bir sonraki açılışta bütün kartlar son seçilen görünümle
   gelir.

Tasarımda: yalnız o oturumdaki çocuğun "Ödev sonuçları" grafiği; velide altta ödev listesi yok.

### Müdür, öğretmen ve çalışan

Öğrencinin portalını açtığında ("Öğrenciler" ya da "Okul Öğrencileri" → "Portalını aç") aynı kartı görürsün. Sayılan
ödevler senin okulunun kayıtlarıdır: nakil gelen öğrencinin eski okulundaki ödevler sayılmaz. Öğretmenin kendi verdiği
ödevlerdeki sonuç sayımı ayrıca [Sınıflarım](../siniflar-dersler/siniflarim.md) penceresinde ("Yaptı: 5", "Eksik: 1"…)
durur.

## Kurallar ve sınırlar

- **Hangi ödevler:** bakılan eğitim yılında öğrenciye verilmiş bütün ödevler (aktif ve bitmiş). Okulda "Ödevler" bölümü
  kapalıysa hiç ödev gelmez, kart "Henüz ödev yok." der.
- **Sonuç ne zaman sayılır:** yalnız ödev sonuçlandırıldıktan sonra. Süren ödev, sonuçlandırılmış ama bu öğrenciye sonuç
  yazılmamış ödev **"Belirsiz"**dir. Öğretmen sonucu sonradan değiştirirse grafik de değişir
  ([Sonuçları düzeltme](../odev/sonuclari-duzeltme.md)).
- **Adlar kısaltılmış:** grafikte "İzinli" ve "Gelmedi" yazar; listelerde ve "Derslere göre" göstergesinde aynı sonuçların
  adı "Gelmedi (izinli)" ve "Gelmedi (izinsiz)".
- **Quiz puanı girmez:** quizin puanı yalnız öneridir; grafik öğretmenin seçtiği sonucu sayar ([Quiz sonuçları](../quiz/sonuclar.md)).
- **Tercihler tarayıcıda:** görünüm ("Sonuçlara göre" / "Derslere göre") ve "Grafiği gizle" bu tarayıcıda hatırlanır,
  hesaba bağlı değildir: aynı bilgisayarda giren başka hesap (ör. kardeş) da grafiği gizli bulur.
- **Telefonda:** grafik kutunun gerçek genişliğinde çizilir, yazılar küçülmez. Sütun başına düşen yer daralınca iki kelimeli
  ad iki satıra iner ("Geç" / "yaptı"), daha da daralınca yazı küçülür. Telefon yan çevrilince grafik yeniden çizilir.
- **Ekran okuyucu:** grafik bir resim olarak bütün değerleri okur ("Ödev sonuçları: Yaptı 3, Geç yaptı 1, …").
- **Yıldız ve seri ayrı:** ödev yıldızları ve ödev serisi bu grafiğe girmez ([Yıldızlama](../odev/yildizlama.md),
  [Ödev serisi](../odev/seri.md)).

## Kardeşler ve ilgili

**Kardeşler** (aynı klasör, [İlerleyiş](README.md)):

- [İlerleyişim sayfası](ilerleyisim.md), [Velinin İlerleyiş sayfası](velinin-ilerleyis-sayfasi.md).
- [Derslere göre başarı oranı](ders-oranlari.md) — aynı kartın öbür görünümü.
- [Sınav sonuçları sütun grafiği](sinav-sonuclari-grafigi.md) — tasarımda bu grafiğin yanında.
- [Sınav grafiği](sinav-grafigi.md), [Sınavlar ve grup ortalamaları](sinavlar-ve-grup-ortalamalari.md),
  [Derslere göre ortalama](derslere-gore-ortalama.md).

**İlgili:**

- [Sonuçlandırma](../odev/sonuclandirma.md), [Sonuçları düzeltme](../odev/sonuclari-duzeltme.md),
  [Ödev listesi](../odev/liste.md), [Ödev penceresi](../odev/odev-penceresi.md), [Ödev serisi](../odev/seri.md).
- [Quiz sonuçları](../quiz/sonuclar.md).
- [Sınıflarım](../siniflar-dersler/siniflarim.md).
- [Görünüm ve dil](../ayarlar/gorunum-ve-dil.md) — açık/koyu tema; grafik renkleri temaya göre.

## Kod tarafı

- Ön yüz: [public/js/parcalar/28-grafik.md](../../public/js/parcalar/28-grafik.md) — `sutunGrafik`, `guzelEksen`,
  `ODEV_GRAFIK_SIRA`, `ODEV_GRAFIK_AD`, `odevSonucGrafigi`, `odevGrafikleriniCiz`, eylemler `odev-grafik-sekme` ve
  `odev-grafik-gizle`; kart [public/js/parcalar/13-ogrenci-veli.md](../../public/js/parcalar/13-ogrenci-veli.md)
  (`ilerleyisKartlari`). Tercihler `tercihOku` / `tercihYaz` ([01-yardimcilar.md](../../public/js/parcalar/01-yardimcilar.md);
  `ee_odev_grafik_gorunum`, `ee_odev_grafik_kapali`). Sonuç adları ve renkleri `SONUC`
  ([02-ikonlar.md](../../public/js/parcalar/02-ikonlar.md)). Görünüm `public/css/parcalar/25-grafik-sinav.css`
  ([CSS.md](../../public/css/parcalar/CSS.md)).
- Sunucu: [sunucu/bolumler/ilerleyis.md](../../sunucu/bolumler/ilerleyis.md) — `GET /api/progress` cevabındaki
  `assignments[].result` (yalnız sonuçlanmış ödevde dolu); sonuç türleri `RESULT_TYPES` ([sunucu/ortak.md](../../sunucu/ortak.md)).
- Testler: [testler/buton-denetimi.md](../../testler/buton-denetimi.md) (düğmelerin karşılığı),
  [testler/test-ozellikler.md](../../testler/test-ozellikler.md) (ödev kapalıyken liste boş). Çizimi deneyen otomatik test yok.
- Kullanıcıya dönük anlatım: [belge/KILAVUZ.md](../../belge/KILAVUZ.md) ("İlerleyişim").

## Sık sorulanlar

- **"Belirsiz" ne demek?** Henüz sonucu yazılmamış ödevler: süren ödevler ve öğretmenin sonuçlandırmadığı ödevler.
- **Ödevi yükledim ama "Yaptı" görünmüyor.** Grafik dosya yüklemeyi değil öğretmenin verdiği sonucu sayar; öğretmen ödevi
  sonuçlandırınca değişir.
- **Grafiği gizledim, nasıl geri getiririm?** Aynı düğme artık "Grafiği göster" diyor; ona bas.
- **Başka bilgisayarda grafik yine görünüyor.** Gizleme tercihi yalnız o tarayıcıda saklanır.

## Sırada

- Arayüz önizlemesi (Tasarım 1) koda geçerken: başlıkta "N sonuçlanan ödev", yeni renkler, "Sınav sonuçları" grafiğiyle
  yan yana duruş, öğrencide altta "Ödev sonuçları" listesi; "Belirsiz" sütunu ile düğmelerin kalıp kalmayacağı
  kullanıcıya sorulacak.
- Çok dil: sütun adları ve düğmeler çeviri kataloğuna.
- Android yerel uygulama: İlerleyiş ekranında aynı sayım.
