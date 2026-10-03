# Uygulama ve indirme · Tarayıcıdan uygulama olarak yükleme

**Durum:** Kodda var; tasarımda ek olarak İndir sayfasında "Bilgisayara yükle" ve "iPhone ve iPad'e yükle" pencereleri, portal
şeridindeki düğmenin profil menüsüne ve ana sayfa kartına taşınması, kurulu uygulamada geri/ileri ve ev düğmeleri.

Eğitim Evi'ni bilgisayara, iPhone'a, iPad'e (ve istersen Android'e) kurulum dosyası olmadan, tarayıcıdan "uygulama olarak" yükleme:
kendi simgesiyle, adres çubuğu olmadan, kendi penceresinde açılır.

## Ne işe yarar

Site bir PWA'dır (tarayıcıdan kurulabilen web uygulaması): yükleyince masaüstünde, başlat menüsünde ya da telefonun ana ekranında
**Eğitim Evi** simgesi olur; açınca tarayıcı çubuğu görünmez, bildirim gelebilir, ağ yokken kabuğu açılır
([Ağ yokken açılış](cevrimdisi-acilis.md)). Kullanıcının 3 Ekim kararı: ".exe mantıksız dimi" (cevap evet: bilgisayara
kurulum dosyası yapılmayacak) ve "ios app store değil o da tarayıcı indirmeli … ios ve pc tarayıcı indirmeli". Android'de asıl yol yerel
uygulamadır ([Android uygulaması](android-uygulamasi.md)); tarayıcıdan yükleme Android'de de çalışır ama İndir sayfası onu
önermez.

## Nereden açılır

- **Giriş yaptıktan sonra üst çubukta** indirme simgeli **"Uygulamayı yükle"** düğmesi (üstüne gelince "Uygulamayı
  telefonuna/bilgisayarına kur"). Yalnız tarayıcı "bu site kurulabilir" dediğinde görünür (Chrome, Edge gibi Chromium tabanlı
  tarayıcılar; bilgisayarda ve Android'de). Geniş ekranda simge ve yazı, telefonda (860 piksel ve altı) yalnız simge.
- **Tarayıcının kendi menüsü** (her zaman, giriş gerekmez): bilgisayarda adres çubuğunun sağındaki kurulum simgesi ya da menüdeki
  "Uygulamayı yükle"; Android Chrome'da sağ üstte **⋮** → "Uygulamayı yükle" ya da "Ana ekrana ekle"; iPhone ve iPad Safari'de
  **Paylaş → Ana Ekrana Ekle**.
- **İndir sayfası**, "iPhone ve iPad" bölümündeki mavi **"iPhone'a ekle"** ([İndir sayfası](indir-sayfasi.md)).
- Tasarımda: portal şeridinde düğme yok; profil menüsünde **"Uygulamayı indir"**, portal ana sayfasında **"Eğitim Evi'ni
  telefonuna kur"** kartı ([Telefonuna kur kartı](telefonuna-kur-karti.md)); ikisi de İndir sayfasını açar. Orada Bilgisayar
  sütununda **"Yükle"**, iOS sütununda mavi **"Yükle"**.

## Adım adım

### Herkes (ziyaretçi dahil)

#### Bilgisayarda (Chrome ya da Edge)

1. Eğitim Evi'ni aç (giriş yapman gerekmez).
2. Adres çubuğunun sağındaki kurulum simgesine bas (ya da tarayıcının menüsünden "Uygulamayı yükle").
3. Tarayıcının açtığı küçük pencerede yüklemeyi onayla.
4. Eğitim Evi kendi penceresinde açılır; masaüstünde ve başlat menüsünde simgesi olur.

#### Android'de (Chrome)

1. Sağ üstteki **⋮** menüsüne bas.
2. "Uygulamayı yükle" ya da "Ana ekrana ekle"yi seç.

(Android'de önerilen yol yerel uygulamadır: [Android uygulaması](android-uygulamasi.md).)

#### iPhone ve iPad'de (Safari)

1. İndir sayfasını aç (`egitimevi.org/indir`), mavi **"iPhone'a ekle"**ye bas; adımlar açılır:
   1. "Bu sayfayı iPhone'unda **Safari** ile aç (Chrome ve Edge de olur)."
   2. "Alttaki **Paylaş** düğmesine dokun (iPad'de sağ üstte)."
   3. "Listeyi aşağı kaydırıp **Ana Ekrana Ekle**'yi seç, sonra sağ üstte **Ekle**'ye dokun."
   4. "Ana ekrandaki **Eğitim Evi** simgesinden aç, giriş yap. Bildirim istersen **Ayarlar**'dan telefon bildirimlerini aç."
2. Ana ekrandaki simgeden açınca site açılır (indirme sayfası kendini siteye geçirir).
3. Telefon bildirimi için: ana ekrandaki Eğitim Evi'nde **Ayarlar → Telefon bildirimleri → Bildirimleri aç**
   ([Telefon bildirimi](../bildirim/telefon-bildirimi.md)). iPhone'da bildirim yalnız ana ekrana eklenmiş Eğitim Evi'nde ve iOS
   16.4 ve üstünde çalışır.

### Giriş yapmış herkes

Öğrenci, veli, öğretmen, çalışan, müdür, servisçi, yönetici ve tasarımdaki destek ve eğitmen hesapları için aynı:

1. Tarayıcın kurulumu önerdiyse üst çubukta **"Uygulamayı yükle"** görünür. Bas.
2. Tarayıcının kendi yükleme penceresi açılır; onayla ya da vazgeç. Hangisini seçersen seç düğme kaybolur (vazgeçtiysen tarayıcının
   kendi menüsünden yine yükleyebilirsin).
3. Yüklenince düğme bir daha görünmez; Eğitim Evi kendi penceresinde açılır.

Kodda ayrıca bir yardım penceresi yazılı: başlığı **"Uygulamayı yükle"**; iPhone'da "**iPhone / iPad (Safari):**" Paylaş → Ana
Ekrana Ekle → Ekle adımları; öbür cihazlarda "**Android (Chrome):**" ("Sağ üstteki **⋮** menüsüne bas", "**Uygulamayı yükle** ya da
**Ana ekrana ekle**yi seç") ve "**Bilgisayar (Chrome / Edge):**" ("Adres çubuğunun sağındaki **kurulum simgesine** bas", "Ya da
menüden **Uygulamayı yükle**yi seç"); site `http://` ile açıldıysa üstte "Site **http://** üzerinden açıldığı için tarayıcı otomatik
kurulum önermiyor. Yine de ana ekrana ekleyebilirsin."; en altta "Kurunca uygulama ayrı bir simgeyle açılır, tarayıcı çubuğu
görünmez." **Bugün bu pencere açılmıyor:** düğme yalnız tarayıcı kurulumu önerdiğinde göründüğü ve o zaman doğrudan tarayıcının
penceresini açtığı için yardım penceresine hiçbir yoldan ulaşılmıyor (kod okumasına göre). iPhone'lu kişi adımları İndir
sayfasından ya da Ayarlar'daki bildirim kartının iletisinden ("Bu tarayıcı telefon bildirimini desteklemiyor. iPhone'da önce
Paylaş > Ana Ekrana Ekle ile uygulamayı kur, oradan aç.") öğrenir.

### Servisçi

Tarayıcıdan yüklenen uygulamada servisin konumu, tarayıcıdaki gibi **yalnız sayfa açıkken** gider; uygulama kapanınca ya da
arka plana geçince gönderim kesilebilir. Seferi arka planda sürdüren konum gönderimi yerel Android uygulamasında var (seferi başlatan ekranı henüz yazılmadı;
[Android uygulaması](android-uygulamasi.md), [Canlı konum ve harita](../servis/canli-konum-ve-harita.md)).

### Tasarımda (Tasarım 1 önizlemesi)

Herkes için aynı; İndir sayfasındaki tablodan:

**Bilgisayar sütunu → "Yükle" → "Bilgisayara yükle" penceresi:**

- Üstte: "Eğitim Evi bilgisayarda bir kurulum dosyasıyla değil, tarayıcıdan yüklenir. Yükleyince masaüstünde ve başlat menüsünde
  simgesi olur, kendi penceresinde açılır, bildirim gönderebilir; güncellemeyi kendisi alır."
- Üç kutu, her biri adım adım:
  - **"Microsoft Edge"**: "Eğitim Evi'ni Edge'de aç." · "Adres çubuğunun sağındaki **Uygulama kullanılabilir · Yükle** simgesine
    bas (ya da **⋯ → Uygulamalar → Bu siteyi uygulama olarak yükle**)." · "**Yükle**'ye bas."
  - **"Google Chrome"**: "Eğitim Evi'ni Chrome'da aç." · "Adres çubuğunun sağındaki yükleme simgesine bas (ya da **⋮ → Yayınla,
    kaydet ve paylaş → Sayfayı uygulama olarak yükle**)." · "**Yükle**'ye bas."
  - **"Safari (Mac)"**: "Eğitim Evi'ni Safari'de aç." · "**Dosya → Dock'a Ekle**'yi seç."
- Altta tarayıcı yüklemeye hazırsa "Tarayıcın şimdi yüklemeye hazır."; düğmeler **"Kapat"** ve **"Şimdi yükle"**. "Şimdi yükle"
  yalnız tarayıcı kurulumu önerdiyse basılabilir; basınca tarayıcının kendi yükleme penceresi açılır. Sonunda kısa ileti:
  "Eğitim Evi bilgisayarına yüklendi." ya da "Yükleme yapılmadı."

**iOS sütunu → mavi "Yükle" → "iPhone ve iPad'e yükle" penceresi:**

- Üstte: "Eğitim Evi iPhone ve iPad'de App Store'dan değil, Safari'den yüklenir. Ana ekranda simgesi olur, tam ekran açılır; iOS
  16.4 ve üstünde bildirim de gelir."
- **"Safari (iPhone ve iPad)"** kutusu: "Eğitim Evi'ni **Safari**'de aç." · "Alttaki **Paylaş** simgesine bas (kare ve yukarı
  ok)." · "Listeden **Ana Ekrana Ekle**'yi seç." · "Sağ üstteki **Ekle**'ye bas; simge ana ekranına gelir." · "Bildirim
  istiyorsan uygulamayı ana ekrandaki simgeden aç; ilk açılışta izin sorulur."
- Düğme: **"Kapat"**.

**Kurulu uygulamada (tasarım):** tarayıcının kendi geri/ileri düğmeleri olmadığı için portal şeridinde **⌂**'nin yanında **←** ve
**→** düğmeleri çıkar ([Geri, ileri ve ev](../menu-ve-arama/geri-ileri-ve-ev.md)); her sayfanın başında **"Yenile"** düğmesi
([Yenile düğmesi](../menu-ve-arama/yenile-dugmesi.md)); dar ekranda şeritteki logo gizlenir; "Eğitim Evi'ni telefonuna kur" kartı
hiç görünmez.

## Kurallar ve sınırlar

- **Güvenli bağlantı şart:** kurulum önerisi, ağ yokken açılış ve telefon bildirimi yalnız `https://` (ya da geliştirmede
  `localhost`) ile çalışır. Okul ağında `http://192.168…` gibi bir adresle açılan sitede tarayıcı kurulum önermez; yine de menüden
  "Ana ekrana ekle" denebilir.
- **"Uygulamayı yükle" düğmesi** yalnız giriş yapmış kişinin üst çubuğunda ve yalnız tarayıcı kurulumu önerdiğinde görünür. Bu
  öneriyi sayfaya yalnız Chromium tabanlı tarayıcılar (Chrome, Edge, Samsung Internet gibi) bildirir; Safari'de (iPhone, iPad,
  Mac) ve Firefox'ta düğme hiç çıkmaz, oralarda tarayıcının kendi menüsü kullanılır.
- **Uygulamanın görünüşü:** adı "Eğitim Evi", Eğitim Evi simgesi, adres çubuğu yok (tam pencere), telefonda dik açılır, tema rengi
  sitenin kırmızısı; ana sayfadan (`/`) başlar.
- **Güncelleme:** ayrıca güncellemen gerekmez; uygulama her açılışta önce sunucudan en yeni sayfayı ister (ağ yoksa saklananı
  açar). Tarayıcıdan yüklenen uygulama bu yüzden hep en yeni sürümdür ([Kendini güncelleme](kendini-guncelleme.md)).
- **Oturum:** tarayıcıdaki oturumla aynı kurallar (7 gün; "Beni hatırla" — [Beni hatırla](../giris-hesap/beni-hatirla.md)).
  Android uygulamasındaki 30 günlük oturum burada yok. iPhone'da ana ekrandan açılan Eğitim Evi'ne bir kez giriş yaparsın.
- **Çıkış:** tarayıcıdaki gibi; çıkışta bu cihazın telefon bildirimi aboneliği silinir ([Çıkış yap](../giris-hesap/cikis-yap.md)).
- **Kaldırmak:** tarayıcının ya da telefonun kendi yoluyla (uygulama penceresinin menüsünden "Kaldır", ana ekranda simgeyi silmek).
- **Bilinen açıklar (kod okumasına göre):**
  - "Uygulamayı yükle" yardım penceresine ulaşılamıyor (yukarıda).
  - Yeni iPad'ler kendini Mac diye tanıttığı için yardım penceresi (açılabilseydi) onlara Android/bilgisayar adımlarını gösterirdi;
    İndir sayfası bunu ayrıca tanıyor.
  - Kurulu uygulamanın penceresinde İndir sayfası açılır açılmaz ana sayfaya döner ([İndir sayfası](indir-sayfasi.md)).
- **Tasarımda:** bilgisayar için .exe yok; iOS App Store'da değil; portal şeridinde "Uygulamayı yükle" düğmesi yok (profil
  menüsü ve ana sayfa kartı); İndir sayfasının Bilgisayar ve iOS hücreleri yalnız en yeni satırda dolu.

## Kardeşler ve ilgili

**Kardeşler** ([Uygulama ve indirme](README.md)): [İndir sayfası](indir-sayfasi.md) · [Android uygulaması](android-uygulamasi.md) ·
[Kendini güncelleme](kendini-guncelleme.md) · [Telefonuna kur kartı](telefonuna-kur-karti.md) ·
[Ağ yokken açılış](cevrimdisi-acilis.md).

**İlgili:** [Telefon bildirimi](../bildirim/telefon-bildirimi.md) · [Geri, ileri ve ev](../menu-ve-arama/geri-ileri-ve-ev.md) ·
[Yenile düğmesi](../menu-ve-arama/yenile-dugmesi.md) · [Üst şerit](../menu-ve-arama/ust-serit.md) ·
[Profil menüsü](../menu-ve-arama/profil-menusu.md) · [Beni hatırla](../giris-hesap/beni-hatirla.md) ·
[Çıkış yap](../giris-hesap/cikis-yap.md).

## Kod tarafı

- Kurulum düğmesi ve yardım penceresi: [public/js/parcalar/04-pwa.md](../../public/js/parcalar/04-pwa.md) (`pwaKur`,
  `kurulumYardimi`); açılışta çağıran [public/js/parcalar/26-baslat.md](../../public/js/parcalar/26-baslat.md); pencere
  [public/js/parcalar/03-mesaj-modal.md](../../public/js/parcalar/03-mesaj-modal.md).
- Arka plan bileşeni (önbellek, telefon bildirimi): [public/sw.md](../../public/sw.md).
- Uygulamanın adı, simgeleri, açılış adresi: `public/manifest.json` ([public/KLASOR.md](../../public/KLASOR.md)).
- iPhone adımları ve ana ekrandan açılınca siteye geçiş: [public/js/indir.md](../../public/js/indir.md).
- Bildirim izni ve iPhone uyarısı: [public/js/parcalar/04b-bildirim-izni.md](../../public/js/parcalar/04b-bildirim-izni.md).
- Telefonda düğmenin yalnız simge kalması: [public/css/parcalar/CSS.md](../../public/css/parcalar/CSS.md) (`07-mobil.css`).
- Testler: [testler/test-adresler.md](../../testler/test-adresler.md) (`/sw.js` ve önbellek listesi),
  [testler/test-okul-agi.md](../../testler/test-okul-agi.md) (açılışta istenen dosyalar). Kurulumun kendisinin otomatik testi yok.
- Kullanıcıya dönük anlatım: [belge/KILAVUZ.md](../../belge/KILAVUZ.md) ("Telefona uygulama olarak kurma").
- Tasarım: Tasarım 1 önizlemesi, "Uygulama" sayfasındaki "Bilgisayara yükle" ve "iPhone ve iPad'e yükle" pencereleri; herkes-a
  paketinde kurulu uygulamanın ← → ⌂ ve Yenile düğmeleri.

## Sık sorulanlar

- **Telefona uygulama olarak kurulur mu?** Evet. Bugün: giriş yaptıktan sonra üstteki **Uygulamayı yükle** düğmesiyle (iPhone'da
  Safari'nin **Paylaş → Ana Ekrana Ekle** seçeneğiyle) ana ekrana eklenir. Tasarımda: üst şeritteki **İndir** sayfasından;
  bilgisayarda ve iPhone'da tarayıcıdan yüklenir (kurulum dosyası yok), Android'de Google Play'den ya da .apk ile kurulur.
- **"Uygulamayı yükle" düğmesini görmüyorum.** Tarayıcın kurulumu önermiyor (Safari, Firefox), zaten yüklemişsin ya da site
  `http://` ile açılmış. Tarayıcının kendi menüsünü kullan (yukarıdaki adımlar).
- **Yükledikten sonra güncellemem gerekir mi?** Hayır; her açılışta en yeni sürüm gelir.
- **Kurulu uygulamada sayfayı nasıl yenilerim?** Üst çubuktaki **Yenile** açık sayfayı sunucudan yeniden çizer; seçili filtreler
  ve kaydırma yeri korunur ([Yenile düğmesi](../menu-ve-arama/yenile-dugmesi.md)).
- **iPhone'da bildirim gelmiyor.** Bildirim yalnız ana ekrana eklenmiş Eğitim Evi'nden açılınca ve iOS 16.4 ve üstünde çalışır.

## Sırada

- İndir sayfasının yeni hâli (3 Ekim kararı): "Bilgisayara yükle" ve "iPhone ve iPad'e yükle" pencereleri.
- Üst şerit sadeleştirme işi: "Uygulamayı yükle" portal şeridinden kalkar, profil menüsüne ve ana sayfa kartına taşınır; kurulu
  uygulamada ← → ⌂.
- Çok dil işi: pencere metinleri dil kataloğundan.
