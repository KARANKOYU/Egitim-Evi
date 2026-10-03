# Uygulama ve indirme · Telefonuna kur kartı

**Durum:** Tasarlandı — henüz kodda yok

Portalın ana sayfasında, uygulamayı henüz kurmamış kişiye çıkan ve "Bir daha gösterme" ile kapatılabilen **"Eğitim Evi'ni
telefonuna kur"** kartı.

## Ne işe yarar

Bugün portalın üst çubuğunda (tarayıcı kurulumu önerdiğinde) bir **"Uygulamayı yükle"** düğmesi duruyor; şerit kalabalık. Kullanıcı
30 Eylül'de sordu (yazıldığı gibi): "biri portala girdikten sonra header da sadece dil koyu açık yetmezmi uygulamayı indir sıkıntı
olmaz mı ana sayfada olsa iyi olmaz mı". Öneri (üst şerit tanımı): portalda "Uygulamayı indir" şeritten kalkar; **profil menüsüne**
ve **portal ana sayfasında bir kart**a taşınır; uygulamadan girildiyse kart hiç görünmez. Tasarım 1 önizlemesi bu düzenle çizildi.

## Nereden açılır

- Kendiliğinden: portalın **ana sayfasında**, sayfa başlığının ve alt yazısının hemen altında (sayfanın başında "Bildirimlere izin
  ver" şeridi de varsa onun altında).
- Kart kapatıldıktan sonra aynı yol: profil menüsünde **"Uygulamayı indir"** ([Profil menüsü](../menu-ve-arama/profil-menusu.md)).
- Bugünkü sitede kart yok; onun yerine üst çubuktaki "Uygulamayı yükle" düğmesi var
  ([Tarayıcıdan uygulama olarak yükleme](tarayicidan-yukleme.md)).

## Adım adım

### Öğrenci, veli, öğretmen, çalışan, müdür ve servisçi

Kartın görünüşü (Tasarım 1 önizlemesi): solda yeşil zeminde telefon simgesi; ortada kalın **"Eğitim Evi'ni telefonuna kur"**,
altında "Bildirimler anında gelir; uygulamayı Android, iOS ve bilgisayar için indirebilirsin."; sağda indirme simgeli **"Uygulamayı
indir"** düğmesi ve en sağda **×** (üstüne gelince "Bir daha gösterme"; ekran okuyucu "Kapat, bir daha gösterme").

1. Portala gir; ana sayfada kartı görürsün.
2. **"Uygulamayı indir"**e bas → İndir sayfası açılır ([İndir sayfası](indir-sayfasi.md)). Orada Android için **".apk indir"** ya da
   **"Google Play"**, bilgisayar ve iPhone/iPad için **"Yükle"**.
3. Kartı istemiyorsan **×**'e bas: kart kaybolur, kısa ileti çıkar: "Kart kapatıldı; uygulamayı profil menüsünden
   indirebilirsin." Kart bu tarayıcıda bir daha çıkmaz.
4. Sonradan indirmek istersen profil menüsü → **"Uygulamayı indir"**.

Kartı kapatmadıkça ana sayfaya her dönüşünde görürsün; uygulamayı yükleyip uygulamadan açtığında kart hiç çıkmaz.

### Veli

Her çocuğunun oturumunun kendi ana sayfası vardır ([Velide her çocuk ayrı oturum](../portallar/velide-cocuk-oturumlari.md)); kart
her birinde çıkar. Birinde kapattığında aynı tarayıcıda öbürlerinde de kapanır (kayıt cihaza bağlı, oturuma değil).

### Servisçi

Telefonu en çok kullanan rol: kart sana da çıkar. Servis seferinin konumunu arka planda göndermek için tasarımdaki yol Android
uygulamasıdır ([Android uygulaması](android-uygulamasi.md)).

## Kurallar ve sınırlar

- **Nerede:** yalnız portalın ana sayfasında; başka sayfalarda yok.
- **Kimde yok:** tarayıcıdan yüklenmiş ya da uygulama içinden açılmış Eğitim Evi'nde (kurulu olduğu belli); tahta hesabında;
  portalı olmayan hesabın boş ekranında. Önizlemede eğitmenin ve öğrencinin ikinci kurumunun (dershane) ana sayfasında da çıkıyor.
- **Bir daha gösterme:** × ile kapatılınca o tarayıcıda (o cihazda) bir daha çıkmaz; başka telefonda ya da tarayıcıda yeniden
  çıkabilir. Hesaba bağlı bir ayar değildir.
- **Kurulu olduğunu anlama:** sayfa "uygulama olarak açıldım" bilgisini tarayıcıdan alır (tam pencere kipi; iPhone'da ana ekrandan
  açılma). Android'in yerel uygulaması siteyi açmadığı için orada bu kart zaten yok.
- **Tanımla önizleme farkı:** tanım kartı "bir kez çıkan" diye anlatır; önizlemede kart kapatılana kadar her ana sayfa açılışında
  çıkar. Kodlanırken kullanıcıya sorulmalı (açık nokta).
- **Profil menüsündeki "Uygulamayı indir"** her zaman durur (önizlemede kurulu uygulamada da).
- **Emoji yok;** dokunma alanları en az 44 piksel (telefon öncelikli).

## Kardeşler ve ilgili

**Kardeşler** ([Uygulama ve indirme](README.md)): [İndir sayfası](indir-sayfasi.md) ·
[Tarayıcıdan uygulama olarak yükleme](tarayicidan-yukleme.md) · [Android uygulaması](android-uygulamasi.md).

**İlgili:** [Profil menüsü](../menu-ve-arama/profil-menusu.md) · [Üst şerit](../menu-ve-arama/ust-serit.md) ·
[Telefon bildirimi](../bildirim/telefon-bildirimi.md) ("Bildirimlere izin ver" şeridi) ·
[Öğrencinin ana sayfası](../ana-sayfa/ogrenci-ana-sayfasi.md) · [Velinin ana sayfası](../ana-sayfa/veli-ana-sayfasi.md) ·
[Öğretmenin ana sayfası](../ana-sayfa/ogretmen-ana-sayfasi.md) · [Müdürün ana sayfası](../ana-sayfa/mudur-ana-sayfasi.md) ·
[Servisçinin ana sayfası](../ana-sayfa/servisci-ana-sayfasi.md) · [Rolsüz çalışanın ana sayfası](../ana-sayfa/calisan-ana-sayfasi.md).

## Kod tarafı

Bugün kodda yok. Kodlanınca dokunacağı bugünkü parçalar:

- Ana sayfalar: [public/js/parcalar/08-ana-sayfa.md](../../public/js/parcalar/08-ana-sayfa.md).
- Üst çubuktaki bugünkü kurulum düğmesi (kalkacak ya da profil menüsüne taşınacak):
  [public/js/parcalar/04-pwa.md](../../public/js/parcalar/04-pwa.md); düğmenin yeri `public/index.html`.
- Profil menüsü ve üst şerit: [public/js/parcalar/06-menu.md](../../public/js/parcalar/06-menu.md),
  [public/js/parcalar/24-bildirim-arama-mobil.md](../../public/js/parcalar/24-bildirim-arama-mobil.md).
- Tasarım: Tasarım 1 önizlemesi, herkes-a paketi (ana sayfaya eklenen uygulama kartı, profil menüsündeki "Uygulamayı indir").

## Sık sorulanlar

- **Kartı kapattım, uygulamayı nasıl indiririm?** Profil menüsü → **"Uygulamayı indir"**, ya da giriş yapmadan üst şeritteki
  **"İndir"**.
- **Uygulamayı kurdum, kart hâlâ çıkıyor.** Siteyi tarayıcıda açıyorsan kart çıkar; kurduğun uygulamadan açarsan çıkmaz. Tarayıcıda
  da istemiyorsan × ile kapat.
- **Telefonumda kapattım, bilgisayarda yine çıkıyor.** Kapatma o cihaza kaydedilir; bilgisayarda da bir kez kapat.

## Sırada

- Üst şerit sadeleştirme işi: üst çubuktaki "Uygulamayı yükle" kalkar; profil menüsünde "Uygulamayı indir" ve ana sayfa kartı gelir.
- İndir sayfasının yeni hâli: kartın açtığı sayfa.
- Çok dil işi: kart metinleri katalogdan.
