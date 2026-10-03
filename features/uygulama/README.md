# Uygulama ve indirme

Eğitim Evi'ni telefona ve bilgisayara almanın bütün yolları. Herkesin giriş yapmadan açtığı **İndir sayfası**
(`/indir/indir.html`, kısaca `/indir` ya da `/download`) Android uygulamasının bütün sürümlerini tarih, değişiklik notu, boyut ve
SHA-256 özetiyle bir tabloda verir, iPhone ve iPad için Safari'den "Ana Ekrana Ekle" adımlarını gösterir. Site bir PWA'dır:
bilgisayarda, iPhone'da ve iPad'de tarayıcıdan "uygulama olarak" yüklenir, kendi simgesiyle açılır, ağ yokken kabuğu açılır ve her
açılışta en yeni sürümü alır. Android'de yerel (siteyi içinde açmayan) bir uygulama var: bugün yayımda olan "Eğitim Evi Aile" (1.0.x)
yalnız çocuğun telefonu içindir; tek uygulama "Eğitim Evi" (2.0.0) giriş, hesap, portallar, "+ Ekle", bildirimler ve ayarlarla
Android deposunda hazır ama henüz yayımlanmadı. Kullanıcının 3 Ekim kararıyla bilgisayar için kurulum dosyası (.exe) **yok**, iPhone
ve iPad App Store'dan değil **tarayıcıdan** yükler, Android **.apk ve Google Play**'den kurar. Tasarlananlar: İndir sayfasının üç
sütunlu yeni tablosu ("Bilgisayara yükle" ve "iPhone ve iPad'e yükle" pencereleri), portal ana sayfasındaki "Eğitim Evi'ni telefonuna
kur" kartı, Android'de bütün rollerin ekranları, girişsiz açılan "Doğrulayıcı" (TOTP üretici), uygulamanın kendini güncellemesi ve
"önce açık olanı kapat, en baştayken çıkma" geri tuşu. Kaynaklar: bugünkü kod (site ve Android deposu), kullanıcının sözleri,
uygulama tanımı ve Tasarım 1 önizlemesi.

## Alt özellikler

| Belge | Ne anlatır | Durum |
|---|---|---|
| [İndir sayfası](indir-sayfasi.md) | Sayfanın düzeni, son sürüm kutusu, sürüm tablosu, iPhone adımları, Android'e kurma, Play Store bağlantısı; tasarımdaki üç sütunlu tablo ve "Neler yeni" penceresi | Kodda var; tasarımda ek olarak üç sütunlu tablo, durum rozetleri, sürüm notu penceresi |
| [Tarayıcıdan uygulama olarak yükleme](tarayicidan-yukleme.md) | Üst çubuktaki "Uygulamayı yükle", tarayıcıların kendi yolları, iPhone'da Ana Ekrana Ekle; tasarımdaki "Bilgisayara yükle" ve "iPhone ve iPad'e yükle" pencereleri | Kodda var; tasarımda ek olarak pencereler, profil menüsü ve kart, kurulu uygulamada ← → ⌂ |
| [Android uygulaması](android-uygulamasi.md) | İki kuşak (Eğitim Evi Aile 1.0.x, Eğitim Evi 2.0.0), giriş ekranları, sekmeler, ayarlar, portallar, "+ Ekle", bildirim yoklaması, oturum; tasarımda rol ekranları | Kodda var; tasarımda ek olarak rol ekranları, Google Play, açılış ekranı, çok dil |
| [Doğrulayıcı](dogrulayici.md) | Uygulamadaki TOTP üretici: girişsiz açılış, Eğitim Evi hesabını ve başka hesapları ekleme, güvenlik | Tasarlandı — henüz kodda yok |
| [Kendini güncelleme](kendini-guncelleme.md) | "Yeni sürüm var — Güncelle" şeridi, Play paketinde mağaza bağlantısı, zorunlu güncelleme; tarayıcıdan yüklenenin kendiliğinden güncel kalması | Tasarlandı — henüz kodda yok |
| [Android geri tuşu](geri-tusu.md) | Bugünkü sıra (kökte çıkar) ve tasarımdaki beş adım (önce açık olanı kapat, "Yazdıkların silinsin mi?", kökte hiçbir şey yapma) | Kodda var; tasarımda ek olarak yeni sıra |
| [Telefonuna kur kartı](telefonuna-kur-karti.md) | Portal ana sayfasındaki "Eğitim Evi'ni telefonuna kur" kartı, "Bir daha gösterme", kimde çıkmaz | Tasarlandı — henüz kodda yok |
| [Ağ yokken açılış](cevrimdisi-acilis.md) | Arka plan bileşeninin sakladıkları, ağsız açılışta ne olur, verilerin saklanmaması, Android'de internet yokken | Kodda var |

Okuma sırası: önce [İndir sayfası](indir-sayfasi.md) (her şeyin kapısı); sonra cihazına göre
[Tarayıcıdan uygulama olarak yükleme](tarayicidan-yukleme.md) (bilgisayar, iPhone, iPad) ya da
[Android uygulaması](android-uygulamasi.md); Android'in ayrıntıları için [Kendini güncelleme](kendini-guncelleme.md),
[Android geri tuşu](geri-tusu.md) ve [Doğrulayıcı](dogrulayici.md); en son [Telefonuna kur kartı](telefonuna-kur-karti.md) ve
[Ağ yokken açılış](cevrimdisi-acilis.md).

## Rol tablosu

Hücre: o rolün bu alt özellikte yaptığı (bağlantı ilgili belgenin o rolü anlatan bölümüne gider). "—": bu rol kullanmaz. Destek ve
eğitmen hesapları tasarımdadır.

| Alt özellik | Ziyaretçi | Öğrenci | Veli | Öğretmen | Çalışan | Müdür | Servisçi | Yönetici ve destek | Eğitmen |
|---|---|---|---|---|---|---|---|---|---|
| İndir sayfası | [APK indirir, iPhone adımlarını açar](indir-sayfasi.md#herkes-ziyaretçi-dahil) | [bugün Aile uygulamasını kurup bağlar](indir-sayfasi.md#öğrenci) | [çocuğunun telefonu için "indirme sayfası"](indir-sayfasi.md#veli) | [herkes gibi indirir](indir-sayfasi.md#herkes-ziyaretçi-dahil) | [herkes gibi indirir](indir-sayfasi.md#herkes-ziyaretçi-dahil) | [herkes gibi indirir](indir-sayfasi.md#herkes-ziyaretçi-dahil) | [herkes gibi indirir](indir-sayfasi.md#herkes-ziyaretçi-dahil) | [yönetici Play Store bağlantısını girer](indir-sayfasi.md#yönetici) | [herkes gibi indirir](indir-sayfasi.md#herkes-ziyaretçi-dahil) |
| Tarayıcıdan yükleme | [tarayıcının menüsüyle, iPhone'da Ana Ekrana Ekle](tarayicidan-yukleme.md#herkes-ziyaretçi-dahil) | ["Uygulamayı yükle" düğmesi](tarayicidan-yukleme.md#giriş-yapmış-herkes) | ["Uygulamayı yükle" düğmesi](tarayicidan-yukleme.md#giriş-yapmış-herkes) | ["Uygulamayı yükle" düğmesi](tarayicidan-yukleme.md#giriş-yapmış-herkes) | ["Uygulamayı yükle" düğmesi](tarayicidan-yukleme.md#giriş-yapmış-herkes) | ["Uygulamayı yükle" düğmesi](tarayicidan-yukleme.md#giriş-yapmış-herkes) | [yükler; konum yalnız sayfa açıkken](tarayicidan-yukleme.md#servisçi) | ["Uygulamayı yükle" düğmesi](tarayicidan-yukleme.md#giriş-yapmış-herkes) | [tasarımda herkes gibi](tarayicidan-yukleme.md#tasarımda-tasarım-1-önizlemesi) |
| Android uygulaması | [uygulamada "Hesap aç"](android-uygulamasi.md#herkes-kurma-ve-ilk-açılış-200) | [veli kodu, "Bu telefonu velimle paylaş"; tasarımda ödev, program, servis](android-uygulamasi.md#öğrenci) | [portallar, "+ Ekle" ile çocuk; tasarımda her çocuk ayrı oturum](android-uygulamasi.md#veli) | [kişi kodu; tasarımda yoklama, ödev, not](android-uygulamasi.md#öğretmen-ve-müdür) | [kendi ekranları belirlenmedi](android-uygulamasi.md#çalışan-ve-eğitmen) | [kişi kodu, okul açtırma; tasarımda özet, duyuru](android-uygulamasi.md#öğretmen-ve-müdür) | [bugün üç sekme; tasarımda yoklama, sefer, harita](android-uygulamasi.md#servisçi) | [girer, özel ekran yok](android-uygulamasi.md#yönetici) | [kendi ekranları belirlenmedi](android-uygulamasi.md#çalışan-ve-eğitmen) |
| Doğrulayıcı | [girişsiz açar, başka hesapların kodları](dogrulayici.md#herkes-giriş-yapmadan) | [tanıma göre aynı adımlar (netleşecek)](dogrulayici.md#öğrenci) | [Eğitim Evi hesabını ekler](dogrulayici.md#veli-öğretmen-çalışan-müdür-ve-eğitmen) | [Eğitim Evi hesabını ekler](dogrulayici.md#veli-öğretmen-çalışan-müdür-ve-eğitmen) | [Eğitim Evi hesabını ekler](dogrulayici.md#veli-öğretmen-çalışan-müdür-ve-eğitmen) | [ekler (önerilir)](dogrulayici.md#veli-öğretmen-çalışan-müdür-ve-eğitmen) | — | [zorunlu doğrulamada kullanır](dogrulayici.md#yönetici-ve-destek) | [Eğitim Evi hesabını ekler](dogrulayici.md#veli-öğretmen-çalışan-müdür-ve-eğitmen) |
| Kendini güncelleme | [tarayıcıdan yüklenen hep en yeni](kendini-guncelleme.md#tarayıcıdan-yükleyen-herkes) | ["Yeni sürüm var — Güncelle"](kendini-guncelleme.md#android-uygulamasını-kullananlar) | ["Yeni sürüm var — Güncelle"](kendini-guncelleme.md#android-uygulamasını-kullananlar) | ["Yeni sürüm var — Güncelle"](kendini-guncelleme.md#android-uygulamasını-kullananlar) | ["Yeni sürüm var — Güncelle"](kendini-guncelleme.md#android-uygulamasını-kullananlar) | ["Yeni sürüm var — Güncelle"](kendini-guncelleme.md#android-uygulamasını-kullananlar) | ["Yeni sürüm var — Güncelle"](kendini-guncelleme.md#android-uygulamasını-kullananlar) | [tarayıcıdan yüklenen hep en yeni](kendini-guncelleme.md#tarayıcıdan-yükleyen-herkes) | [tarayıcıdan yüklenen hep en yeni](kendini-guncelleme.md#tarayıcıdan-yükleyen-herkes) |
| Android geri tuşu | — | [ödev açıksa önce onu kapatır](geri-tusu.md#herkes-android-uygulamasında) | [açık pencereyi kapatır](geri-tusu.md#herkes-android-uygulamasında) | ["Yazdıkların silinsin mi?"](geri-tusu.md#herkes-android-uygulamasında) | [herkes gibi](geri-tusu.md#herkes-android-uygulamasında) | [herkes gibi](geri-tusu.md#herkes-android-uygulamasında) | [herkes gibi](geri-tusu.md#herkes-android-uygulamasında) | — | — |
| Telefonuna kur kartı | — | [ana sayfasında görür, kapatır](telefonuna-kur-karti.md#öğrenci-veli-öğretmen-çalışan-müdür-ve-servisçi) | [her çocuk oturumunda; biri kapanınca hepsi](telefonuna-kur-karti.md#veli) | [ana sayfasında görür, kapatır](telefonuna-kur-karti.md#öğrenci-veli-öğretmen-çalışan-müdür-ve-servisçi) | [ana sayfasında görür, kapatır](telefonuna-kur-karti.md#öğrenci-veli-öğretmen-çalışan-müdür-ve-servisçi) | [ana sayfasında görür, kapatır](telefonuna-kur-karti.md#öğrenci-veli-öğretmen-çalışan-müdür-ve-servisçi) | [ana sayfasında görür](telefonuna-kur-karti.md#servisçi) | — | [önizlemede çıkıyor](telefonuna-kur-karti.md#kurallar-ve-sınırlar) |
| Ağ yokken açılış | [kabuk açılır, giriş yapılamaz](cevrimdisi-acilis.md#herkes-tarayıcıda-ve-tarayıcıdan-yüklenen-uygulamada) | [oturum bu cihazda kapanır (bugün)](cevrimdisi-acilis.md#giriş-yapmış-herkes) | [çocuğun telefonunda konumlar birikir](cevrimdisi-acilis.md#veli-ve-öğrenci-çocuğun-telefonu) | [oturum bu cihazda kapanır (bugün)](cevrimdisi-acilis.md#giriş-yapmış-herkes) | [oturum bu cihazda kapanır (bugün)](cevrimdisi-acilis.md#giriş-yapmış-herkes) | [oturum bu cihazda kapanır (bugün)](cevrimdisi-acilis.md#giriş-yapmış-herkes) | ["Gönderilemedi: internet bağlantısı yok."](cevrimdisi-acilis.md#giriş-yapmış-herkes) | [oturum bu cihazda kapanır (bugün)](cevrimdisi-acilis.md#giriş-yapmış-herkes) | [oturum bu cihazda kapanır](cevrimdisi-acilis.md#giriş-yapmış-herkes) |

Tahta hesabı (tasarımdaki rol) bu klasörü kullanmaz: tahtada uygulama kartı çıkmaz, uygulamada tahta ekranı tanımlanmadı.

Rol kapıları: [Ziyaretçi](../roller/ziyaretci.md) · [Öğrenci](../roller/ogrenci.md) · [Veli](../roller/veli.md) ·
[Öğretmen](../roller/ogretmen.md) · [Çalışan](../roller/calisan.md) · [Müdür](../roller/mudur.md) ·
[Servisçi](../roller/servisci.md) · [Yönetici](../roller/yonetici.md). Bütün özellikler: [features/](../README.md).

## Açık noktalar

Kodlamadan önce kullanıcıya sorulacak ya da tasarımda netleşecekler:

- **İndir sayfasının yeni hâlinde .apk kurma adımları:** Tasarım 1'in "Uygulama" sayfasında bugünkü "Android'e nasıl kurulur?",
  "Uygulama ne yapar?" bölümleri ve "iPhone ve iPad" kartı yok; adımların sayfada kalıp kalmayacağı belirlenmedi.
- **Durum rozetleri:** önizlemedeki "En yeni", "Destekleniyor", "Eski" rozetlerinin hangi sürüme nasıl verileceği tanımda yazılı
  değil.
- **Telefonuna kur kartı:** tanım "bir kez çıkan" der, önizlemede kapatılana kadar her ana sayfada çıkıyor.
- **Uygulamanın sol menüsü:** kullanıcının 27 Eylül sözündeki "solda menü … anasayfay dön … yorumlar … footer header" giriş
  yapmadan açılan, sitenin açılış sayfası bağlantılarını taşıyan çekmece mi? Soruldu, cevap yok ([Android uygulaması](android-uygulamasi.md)).
- **Çalışan ve eğitmenin Android ekranları** uygulama tanımında yazılmadı.
- **Zorunlu güncelleme:** sunucunun bildireceği "en düşük sürüm"ü kimin, nereden gireceği yazılmadı.
- **Doğrulayıcı ve öğrenci:** öğrenciye de isteğe bağlı açılan doğrulama uygulamasının uygulamadaki doğrulayıcıyla kurulması tanımda
  ayrıca anılmıyor; Tasarım 1 önizlemesindeki kurulum penceresi (sitede bugün yok) Eğitim Evi uygulamasını anmıyor.
- **Bilinen açıklar (bugünkü kod, kod okumasına göre):** "Uygulamayı yükle" yardım penceresine ulaşılamıyor; kurulu PWA penceresinde
  İndir sayfası kendini ana sayfaya atıyor; ağ yokken açılışta oturum cihazda siliniyor; boş sürüm listesinde "alınamadı" deniyor.
- **KILAVUZ yanlışı:** [belge/KILAVUZ.md](../../belge/KILAVUZ.md)'nin "Telefona uygulama olarak kurma" bölümü "Çıkmazsa düğmeye basınca
  elle kurulum adımları anlatılır." diyor; bugünkü kodda düğme tarayıcı kurulumu önermedikçe hiç görünmez, elle kurulum penceresi
  açılamaz ([Tarayıcıdan uygulama olarak yükleme](tarayicidan-yukleme.md)). Sitenin SSS'sindeki "Giriş yaptıktan sonra üstteki
  **Uygulamayı yükle** düğmesiyle (iPhone'da Safari'nin **Paylaş → Ana Ekrana Ekle** seçeneğiyle)" cevabı da iPhone'da o düğmenin
  hiç çıkmadığını söylemiyor.

## İlgili öbür klasörler

- [Açılış sayfası](../acilis-sayfasi/README.md) — üst şeritteki "İndir", kısa adresler, SSS.
- [Giriş ve hesap](../giris-hesap/README.md) — uygulamadaki giriş, iki adımlı giriş, kayıt, doğrulama uygulaması, çıkış.
- [Portallar](../portallar/README.md) — uygulamadaki "Portalların" penceresi, "+ Ekle", kişi kodu, velide her çocuk ayrı oturum.
- [Bildirimler](../bildirim/README.md) — tarayıcıda telefon bildirimi ve uygulamanın bildirim yoklaması.
- [Çocuğumun telefonu](../aile/README.md) — Eğitim Evi Aile: bağlama, konum, ekran süresi.
- [Servis](../servis/README.md) — servisçinin sefer konumu, yoklama.
- [Menü, üst şerit ve arama](../menu-ve-arama/README.md) — profil menüsündeki "Uygulamayı indir", geri/ileri ve ev, Yenile.
- [Ana sayfa](../ana-sayfa/README.md) — kartın çıktığı ana sayfalar.
- [Yönetim](../yonetim/README.md) — Site Ayarları → Play Store bağlantısı; panelde zorunlu doğrulama.
- [Hesap ayarları](../ayarlar/README.md) — Güvenlik, bildirim ayarları.
- [Dil ve çeviri](../dil/README.md) — uygulamada dil seçici.
- [KVKK ve gizlilik](../kvkk-ve-gizlilik/README.md) — aydınlatma metni (çocuğun telefonu, uygulama anahtarı).

## Kod belgeleri

- Site deposu, ön yüz: [public/js/indir.md](../../public/js/indir.md) (İndir sayfası), [public/indir/KLASOR.md](../../public/indir/KLASOR.md),
  [public/js/parcalar/04-pwa.md](../../public/js/parcalar/04-pwa.md) (kurulum düğmesi), [public/sw.md](../../public/sw.md) (arka plan
  bileşeni), [public/KLASOR.md](../../public/KLASOR.md) (`manifest.json`, simgeler).
- Site deposu, sunucu: [sunucu/uygulama-surum.md](../../sunucu/uygulama-surum.md) (GitHub sürümleri), [sunucu/site.md](../../sunucu/site.md)
  (`/api/uygulama`), [sunucu/bolumler/cihaz.md](../../sunucu/bolumler/cihaz.md) (uygulama anahtarı, bildirim yoklaması, sefer konumu),
  [sunucu/bolumler/site-ayarlari.md](../../sunucu/bolumler/site-ayarlari.md) (Play Store bağlantısı).
- Testler: [testler/test-uygulama-surum.md](../../testler/test-uygulama-surum.md), [testler/test-adresler.md](../../testler/test-adresler.md),
  [testler/test-servis-yoklama.md](../../testler/test-servis-yoklama.md).
- Android deposu (ayrı depo, `KARANKOYU/Egitim-Evi-App`): `TANITIM.md` ve her Java dosyasının yanındaki `.md`.
- Kullanıcıya dönük anlatım: [belge/KILAVUZ.md](../../belge/KILAVUZ.md) ("Telefona uygulama olarak kurma", "Eğitim Evi telefon
  uygulaması"). Kod haritası: [TANITIM.md](../../TANITIM.md).
