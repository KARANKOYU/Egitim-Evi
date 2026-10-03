# Ödevler · Müdürün ödev görünümü (ders ders)

**Durum:** Kodda var; tasarımda ek olarak görünüm "Sınıflar / Dersler" seçmeli, VS Code klasörleri gibi açılır bir ağaç olur, her düğümde "Aktif" ve "Süresi geçmiş" alt klasörleri bulunur ve ödeve basınca salt okunur bir ayrıntı penceresi açılır; müdür ödev sonucu kontrol etmez (kullanıcı 29 Ağustos; Tasarım 1 önizlemesi).

Müdürün okulda hangi derse hangi öğretmenin ne ödev verdiğine sınıf ve ders ders baktığı, ödev vermediği ve (sahipsiz ödev dışında) sonuçlandırmadığı salt bakış ekranı.

## Ne işe yarar

Kullanıcı 29 Ağustos'ta tarif etti: "müdür ödevler sekmesinde sınıf ödevlerine baksın"; "ödev sonuçları vb. müdürü
ilgilendirmez; sadece ödevler sekmesine girdiğinde oradan oluşturduğu derslerden birini seçer; orada hangi öğretmen
oluşturduysa o dersin altında öğretmeni açıklamasıyla yazar; müdür ödev verme tuşu da ana ekranda olmasın"; aynı gün:
"ödevler müdürün front page'de olmayacak" ve "sınıflar olacak hepsi veya dersi seçecek, klasör gibi, VS Code'daki sağında
küçük ok; orada da ders açarsa mesela aktif — ödevler — süresi geçmiş — ödev1 ödev2 gibi". Ekranlarda gereksiz açıklama yazısı
da olmayacak ("müdür mal değil").

## Nereden açılır

- **Müdür:** menüde **"Okul Düzeni"** altında **"Ödevler"** (`#/ders-odevleri`). Müdürün ana sayfasında ödev yok.
- Öğretmeni okuldan ayrılmış ödevi sonuçlandırmak için bu sayfadaki **"Sonuçlandır"** ([Sonuçlandırma](sonuclandirma.md)).
- Tek bir öğrencinin ödevleri için: Öğrenciler → **"Portalını aç"** → **"Ödevleri"** ([Ödev listesi](liste.md)).

## Adım adım

### Müdür (bugünkü site)

1. Menüden **"Ödevler"**e gir. Başlık **"DERS ÖDEVLERİ"**.
2. Üstte sınıf seçici (**"Tüm sınıflar"** + okulun sınıfları) ve **"Hepsini kapat"**; bir sınıf seçince **"Hepsini aç"** da çıkar.
3. Altında okulun bütün dersleri birer dal (sınıf adına ve derse göre sıralı). Dalın satırında: ok (▸ kapalı, ▾ açık),
   **"6-A · Matematik"**, dersin öğretmeni (atanmamışsa kırmızı **"öğretmen atanmadı"**) ve sayılar: **"2 aktif"** (mavi),
   **"5 geçmiş"** (gri); hiç ödev yoksa **"ödev yok"**.
4. Bir dala basınca açılır ve yalnız o dersin ödevleri istenir (önce **"Yükleniyor..."**). Ödev yoksa **"Bu derse henüz ödev
   verilmemiş."** Varsa iki grup:
   - **"Aktif ödevler"** — sonuçlanmamış ve süresi geçmemiş;
   - **"Süresi geçmiş"** — sonuçlanmış ya da süresi geçmiş.
5. Her ödevde: ödevin adı (quizliyse **"Quiz"** rozeti), **"Ayşe Kaya · 24 öğrenci · 4 Ekim 2026, Pazar · 12:00"** (son tarih
   yoksa "süresiz"), açıklaması ve sağda durum: **"Aktif"**, **"Süresi doldu"**, **"Sonuçlandı"**.
6. Ödevi dersin kendi öğretmeni değil de başkası (vekil, zümre) verdiyse ödevin satırında onu veren yazar.
7. Ödevi veren öğretmen okuldan ayrıldıysa satırda **"(okuldan ayrıldı)"** ve **"Sonuçlandır"** düğmesi: basınca ödevin kontrol
   ekranı açılır; sonuçları sen kaydedersin ([Sonuçlandırma](sonuclandirma.md)).
8. Tek sınıfa bakmak için seçiciden sınıfı seç; o sınıfın bütün derslerini ödevleriyle birlikte açmak için **"Hepsini aç"**
   (tek istekte gelir). **"Hepsini kapat"** bütün dalları kapatır.
9. Üstteki **"İçerik Ara"** kutusu dalları sınıf, ders ve öğretmen adına göre süzer.
10. Seçili sınıfta hiç ders yoksa **"Bu sınıfa ders eklenmemiş."**

### Öğretmen, öğrenci, veli

Bu ekranı görmez. Öğretmen kendi verdiği ödevleri kendi "Ödevler" listesinde görür ([Ödev listesi](liste.md)).

### Çalışan

Bugün bu sayfa yalnız müdürün menüsünde. "Sınıfa ders ekler ve çıkarır" yetkili bir öğretmenin (ör. Müdür Yardımcısı rolü) menüsünde
yok; sunucu bu yetkiyle sayıları verirdi ama ekran yolu yok. Tasarımda çalışanın bu ekranı görüp görmeyeceği yazmıyor.

### Tasarımda (Tasarım 1 önizlemesi)

- Sayfa **"Ödevler"**, altyazısı okulun ödev sayısı ve aktif olanlar: **"N ödev · M aktif"**. Üstte iki seçenekli düğme:
  **"Sınıflar"** | **"Dersler"** (Sınıflar seçili gelir).
- **Sınıflar** seçiliyken her sınıf bir klasör satırı (sınıf simgesi, "7-A", sağda **"14 ödev · 5 aktif"** ya da "ödev yok");
  **Dersler** seçiliyken her ders bir satır (dersin renkli noktası, "Matematik", aynı sayılar).
- Satıra basınca açılır (küçük ok döner); içinde iki alt klasör: **"Aktif (5)"** (açık gelir) ve **"Süresi geçmiş (9)"** (kapalı
  gelir). Aktifte son teslimi en yakın üstte, süresi geçmişte en yeni üstte. Boşsa **"Aktif ödev yok"** / **"Süresi geçmiş ödev
  yok"**.
- Her ödev: dersin kısaltması ("MAT") renkli kutuda, ödevin adı, altında **"Matematik · Ayşe Kaya · son 1 Ekim 23:00"**
  (Sınıflar görünümünde ders adı, Dersler görünümünde sınıf adı); Dersler görünümünde ayrıca açıklaması.
- Ödeve basınca salt okunur **"Ödev"** penceresi: **"Başlık:"**, **"Ders:"**, **"Sınıf:"**, **"Veren öğretmen:"**, **"Verildi:"**
  ("26 Eylül 2026 Cumartesi 08:30"), **"Son tarih:"** + **"Aktif"** ya da **"Süresi geçti"**, **"Açıklama:"**; altta **"Kapat"**.
  Sonuç, öğrenci listesi, teslim yok.
- Önizlemede "Aktif" yalnız son tarihe göre ayrılır (son tarihi geçmemiş ödev aktiftir).
- Müdürün ana sayfasında ödev kutucuğu ve listesi yok; "Kendi derslerim" de yok.
- Eğitim yılı sayfasında geçmiş yılın **"Ödevler"** sekmesi: **"Derslere göre verilen ödevler"** — her ders için veren öğretmenler
  ve ödev sayısı ([Geçmiş yıla bakma](../egitim-yili/gecmis-yil.md)).
- Öğretmeni ayrılmış (sahipsiz) ödevin tasarımda kim tarafından sonuçlandırılacağı yazmıyor; bugün müdür sonuçlandırıyor.
  Kodlanmadan önce sorulmalı.

## Kurallar ve sınırlar

- **Yetki:** sayfa sunucuda "Sınıfa ders ekler ve çıkarır" (`ders.yonet`) yetkisini ister; müdürde her zaman var. Müdür ödev vermez
  ([Ödev verme](odev-verme.md)).
- **Ödevin derse bağlanması:** ödev, verildiği sınıfın aynı adlı dersinin dalında görünür (ödevin dersi = dersin adı, ödevin
  sınıflarından biri = dersin sınıfı). İki sınıfa verilen ödev iki dalda görünür; her dalda **yalnız o sınıfın** öğrencileri
  sayılır (öğretmenin listesindeki sayı ise ödevin bütün öğrencileridir).
- **"Geçmiş" sayımı** müdürde süresi geçmiş ama sonuçlanmamış ödevi de "geçmiş" sayar (öğretmenin listesinde bu ödev aktiftir).
- **Eğitim yılı:** sayılar ve ödevler yıl seçicide bakılan yılın kayıtlarıdır.
- **Okulda Ödevler kapalıysa** sayfa açılmaz.
- **Sahipsiz ödev:** öğretmen okuldan çıkarılınca ödevleri okulda kalır ve sahipsiz olur; yalnız aynı okulun müdürü yönetir
  (sonuçlandırır, düzenler; sunucu silmeye de izin verir ama ekranda düğme yok)
  ([Okuldan çıkarma](../ogretmenler-calisanlar/okuldan-cikarma.md)).
- **Bilinen açıklar** (kod okumasına göre): daha önce açılmış bir dal sayfaya geri dönünce ya da "Yenile"den sonra
  "Yükleniyor..."da kalabilir (dala iki kez basmak gerekir); sahipsiz ödevin kontrol ekranındaki "Geri dön" müdürü kendi boş
  ödev listesine götürür; okulda hiç ders yokken "Tüm sınıflar"da da "Bu sınıfa ders eklenmemiş." yazar; iki okulda müdür olan
  kişi okul değiştirince seçili sınıf sıfırlanmadığı için liste boş gelebilir.

## Kardeşler ve ilgili

**Kardeşler:** [Sonuçlandırma](sonuclandirma.md) (sahipsiz ödev) · [Ödev listesi](liste.md) · [Ödevin penceresi](odev-penceresi.md) ·
[Kime verilecek](alicilar.md) · [Ödevlerde arama](arama.md) · [Teslimleri inceleme](teslimleri-inceleme.md).

**İlgili:** [Müdürün ana sayfası](../ana-sayfa/mudur-ana-sayfasi.md), [Sınıf açma](../siniflar-dersler/sinif-acma.md),
[Ders atama](../siniflar-dersler/ders-atama.md), [Okuldan çıkarma](../ogretmenler-calisanlar/okuldan-cikarma.md),
[Geçmiş yıla bakma](../egitim-yili/gecmis-yil.md), [Öğrenci portalını açma](../hesaplar/ogrenci-portalini-acma.md),
[Okulun özellikleri](../ozellikler/bolum-ac-kapat.md).

## Kod tarafı

- Ön yüz: [public/js/parcalar/11-ogretmen-odev.md](../../public/js/parcalar/11-ogretmen-odev.md) — `SAYFALAR['ders-odevleri']`
  (`GET /api/school/assignments[?classId=][&detay=1]`), `dersOdevleriCiz`, `odevGrubu`, `dersDaliAcKapa`
  (`?lessonId=`), `dersListesiniYenidenCiz`, `sinifSeciciBagla`; "Hepsini aç / kapat"
  [25-tiklama.md](../../public/js/parcalar/25-tiklama.md); menü [06-menu.md](../../public/js/parcalar/06-menu.md).
- Sunucu: [sunucu/bolumler/okul.md](../../sunucu/bolumler/okul.md) — `GET /api/school/assignments` (`ders.yonet`; iki kademe:
  ders başına aktif/geçmiş sayıları, `?lessonId=` ile bir dersin ödevleri, `?classId=&detay=1` ile hepsi; yıl süzgeci, quiz
  rozeti); sahipsiz ödev kuralı [sunucu/bolumler/odev.md](../../sunucu/bolumler/odev.md).
- Depo: [sunucu/veri/depo/odevler.md](../../sunucu/veri/depo/odevler.md) — `dersBaglari`, `dersinOdevleri` (sınıfa göre
  öğrenci sayısı, `sahipsiz`, "(okuldan ayrıldı)").
- Testler: [testler/test-kapsam.md](../../testler/test-kapsam.md) ("MUDUR DERS ODEVLERI": sayılar, `?lessonId=`, veren öğretmenin adı).
- Kullanıcıya dönük anlatım: [belge/KILAVUZ.md](../../belge/KILAVUZ.md) ("Müdürün ödev görünümü"). Not: kılavuz her ders bloğunda
  dersin "haftalık saati"nin yazdığını söylüyor; ekranda haftalık saat gösterilmiyor (sunucu gönderiyor ama çizilmiyor) ve ödevler
  ancak dal açılınca listeleniyor.

## Sık sorulanlar

- **Müdür olarak ödev verebilir miyim?** Hayır; ödev öğretmenin işi (kullanıcının kararı).
- **Ödevin öğrenci sonuçlarını görebilir miyim?** Bu ekranda hayır; bir öğrencininkini portalından, ayrılmış öğretmenin ödevini
  "Sonuçlandır"dan görürsün. Tasarımda müdür sonuç kontrol etmez.
- **Bir dal "Yükleniyor..."da kaldı.** Dala bir kez kapatıp yeniden aç (bilinen açık).
- **Vekil öğretmenin verdiği ödev nerede?** Dersin kendi dalında; satırda veren öğretmenin adı yazar.

## Sırada

- Tasarımdaki "Sınıflar / Dersler" ağacı ve salt okunur ödev penceresi.
- Sahipsiz ödevin tasarımdaki sahibi kullanıcıya sorulacak.
- Kılavuzdaki "haftalık saat" cümlesi ekranla eşitlenecek (kılavuz ya da ekran).
- Özel branş / ders: dersler okulun kendi açtığı derslerden gelecek (renk ve kısaltmayla).
