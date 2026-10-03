# Uygulama ve indirme · İndir sayfası

**Durum:** Kodda var; tasarımda ek olarak üç sütunlu sürüm tablosu (Bilgisayar ve iOS tarayıcıdan "Yükle", Android ".apk indir" ve
"Google Play"), her sürümde durum rozeti ve "Neler yeni" penceresi.

Eğitim Evi'ni telefona ya da bilgisayara almak için herkesin (giriş yapmadan da) açtığı sayfa: Android uygulamasının bütün
sürümleri tarih, değişiklik notu, boyut ve SHA-256 özetiyle bir tabloda; iPhone ve iPad için ana ekrana ekleme adımları.

## Ne işe yarar

Uygulamanın dosyasını arayıp GitHub'da kaybolmayasın diye bütün sürümler sitenin kendi sayfasında durur. Kullanıcının istekleri
sırayla:

- 29 Ağustos: "sitede downloads kısmı olsun orada olsun apk ve .exe installer sürümüyle ve changelog".
- 26 Eylül: "play store a eklemicez bi tane indir diye bi bölüm ekle orada apk olsun"; aynı gün "indir-download ikiside olcak"
  (iki adres) ve iPhone için "indir kısmında ios altında … bi mavi buton".
- 3 Ekim (son karar): ".exe mantıksız dimi" sorusuna "evet" cevabıyla bilgisayar için kurulum dosyası YOK; ardından "ios app store
  değil o da tarayıcı indirmeli … android hem apk hem play store, ios ve pc tarayıcı indirmeli". Aynı gün: "indir sayfası o
  tablolu iyiydi" — tablo kalır. (26 Eylül'deki "play store a eklemicez" bu son sözle değişti: Google Play de var.)

Yani son tasarımda: **bilgisayar ve iPhone/iPad tarayıcıdan yükler** (kurulum dosyası yok, bkz.
[Tarayıcıdan uygulama olarak yükleme](tarayicidan-yukleme.md)), **Android .apk dosyasını bu sayfadan indirir ya da Google Play'den
kurar** ([Android uygulaması](android-uygulamasi.md)).

## Nereden açılır

- Giriş yapmamışken her sayfanın üst şeridinde aşağı ok simgeli **"İndir"** (üstüne gelince "Eğitim Evi'ni telefonuna indir
  (Android ve iPhone)" yazar; [Üst şerit ve alt bilgi](../acilis-sayfasi/ust-serit-ve-alt-bilgi.md)). İndir sayfasındayken bu
  bağlantı vurgulu durur.
- Adres: **`/indir/indir.html`**. Kısa ve eski yazılışlar oraya yönlenir: `/indir`, `/indir/`, `/indir.html`, `/download`,
  `/download/` (büyük harfli ve Türkçe İ/ı'lı yazılışlar da; [Adresler](../acilis-sayfasi/adresler.md)).
- Sık sorulan sorulardaki "Android uygulamasını nereden indiririm?" cevabındaki bağlantı ([SSS](../acilis-sayfasi/sss.md)).
- Velinin **"Çocuğumun telefonu"** sayfasındaki kurulum kartında "indirme sayfası" bağlantısı (yeni sekmede açılır;
  [Çocuğun telefonunu bağlama](../aile/telefonu-baglama.md)).
- Tasarımda ayrıca: portalda profil menüsünde **"Uygulamayı indir"** ([Profil menüsü](../menu-ve-arama/profil-menusu.md)) ve portal
  ana sayfasındaki **"Eğitim Evi'ni telefonuna kur"** kartında **"Uygulamayı indir"** ([Telefonuna kur kartı](telefonuna-kur-karti.md)).

## Adım adım

### Sayfanın bugünkü düzeni

Yukarıdan aşağı:

1. Başlık **"Eğitim Evi'ni indir"**, altında "Android için uygulama, iPhone ve iPad için ana ekrana ekleme. Android dosyaları
   uygulamanın açık kaynak deposundan (GitHub) gelir." ("GitHub" uygulamanın deposuna bağlantı, yeni sekmede.)
2. **"Android"** bölümü — son sürüm kutusu. Sayfa açılırken "Sürümler yükleniyor..." yazar; liste gelince:
   - sol: **"Son sürüm 1.0.1"** (sürüm numarası örnek), altında "26 Eylül 2026 · Android 8.0 ve üstü";
   - sağ: büyük **"İndir (APK, 12,4 MB)"** düğmesi (boyut örnek) ve yönetici Play Store bağlantısını girdiyse yanında
     **"Google Play'den yükle"** (yeni sekmede).
   - Liste alınamadıysa: **"Sürüm listesi şu an alınamadı"** · "Bütün sürümler GitHub'daki sayfada da duruyor." ve
     **"GitHub'daki sürümler"** düğmesi (varsa yanında "Google Play'den yükle"). Tablo bu durumda boş kalır.
3. **"iPhone ve iPad"** bölümü — kart: **"iPhone'da uygulama gibi kullan"**, altında "App Store uygulaması henüz yok. Eğitim Evi'ni
   Safari'den ana ekrana eklersen simgesiyle açılır, adres çubuğu görünmez ve bildirimler gelir (iOS 16.4 ve üstü). Kurulacak dosya
   yoktur, yer kaplamaz." ve mavi artı simgeli **"iPhone'a ekle"** düğmesi.
4. **"Android sürümleri"** bölümü — "En yenisi en üstte. Eski bir sürüme dönmen gerekirse buradan indirebilirsin. Dosyanın
   bozulmadan indiğini denetlemek istersen SHA-256 özetini karşılaştır." ve tablo. Sütunlar: **Sürüm · Tarih · Neler değişti ·
   Boyut · Dosya**. En üst satırın sürümünün yanında **"son"** rozeti; "Neler değişti" hücresinde sürümün notu (not boşsa sürümün
   adı) ve altında küçük yazıyla "SHA-256: …" (GitHub özet verdiyse); "Dosya" sütununda küçük **"İndir"** düğmesi. Telefonda
   (640 piksel ve altı) tablo kart kart dizilir; her kartta "Sürüm:", "Tarih:", "Boyut:" etiketleri yazar.
5. **"Android'e nasıl kurulur?"** — dört adım (aşağıda).
6. **"Uygulama ne yapar?"** — "Şu anki sürüm çocuğun telefonuna kurulur: öğrenci kendi hesabıyla ve onayıyla bağlar, telefonun
   konumu ve hangi uygulamanın ne kadar kullanıldığı velisine gider. Veli bunları sitede Çocuğumun telefonu sayfasında görür. Okul
   bu bilgileri görmez; 7 gün sonra silinir. Hiçbir uygulamayı kapatmaz ya da kilitlemez. Ayrıntısı aydınlatma metninde." ve
   iPhone bölümüne giden bağlantı.
7. En altta **"← Ana sayfaya dön"**; sonra sitenin alt bilgisi.

### Herkes (ziyaretçi dahil)

#### Android'e indirmek

1. Telefonunda sayfayı aç (üst şeritte **"İndir"** ya da adres çubuğuna `egitimevi.org/indir`).
2. Son sürüm kutusundaki **"İndir (APK, …)"** düğmesine bas. `egitim-evi.apk` dosyası telefonuna iner (dosya GitHub'dan iner,
   sitenin sunucusundan geçmez).
3. Sayfadaki adımları izle:
   1. "Yukarıdan **İndir**'e bas. **egitim-evi.apk** dosyası telefonuna iner."
   2. "İnen dosyayı aç (bildirimden ya da **Dosyalar → İndirilenler**'den)."
   3. "Telefon "bilinmeyen uygulamalar" için izin isterse, dosyayı açtığın uygulamaya (ör. Chrome) bir kez izin ver."
   4. "**Yükle**'ye bas. Güncellerken yeni sürümü aynı yolla kurarsın; bilgilerin silinmez."
4. Eski bir sürüm gerekiyorsa "Android sürümleri" tablosunda o satırın **"İndir"**ine bas.
5. Dosyanın sağlam indiğini denetlemek istersen, indirdiğin dosyanın SHA-256 özetini tablodaki satırla karşılaştır.

Google Play düğmesi görünüyorsa oradan da kurabilirsin (düğme yalnız yönetici bağlantıyı girdiyse çıkar).

#### iPhone ve iPad'e eklemek

1. **"iPhone'a ekle"**ye bas. Altında dört adım açılır (düğmeye yeniden basınca kapanır). Adımların üstünde duruma göre bir not:
   - Safari'deysen: "Aşağıdaki adımları izle; bir kez yapman yeterli."
   - iPhone'da Safari dışındaysan (Chrome, Firefox, Edge, Opera, Google uygulaması): "Safari dışında bir tarayıcıdasın. iOS 16.4 ve
     üstünde Chrome ve Edge de ana ekrana ekleyebilir; Paylaş düğmesini bulamazsan sayfayı Safari ile aç."
   - Bilgisayarda ya da Android'deysen: "Bu adımlar iPhone ya da iPad içindir. Telefonunda <site adresi>/indir adresini aç ve bu
     düğmeye orada bas."
2. Adımlar:
   1. "Bu sayfayı iPhone'unda **Safari** ile aç (Chrome ve Edge de olur)."
   2. "Alttaki **Paylaş** düğmesine dokun (iPad'de sağ üstte)."
   3. "Listeyi aşağı kaydırıp **Ana Ekrana Ekle**'yi seç, sonra sağ üstte **Ekle**'ye dokun."
   4. "Ana ekrandaki **Eğitim Evi** simgesinden aç, giriş yap. Bildirim istersen **Ayarlar**'dan telefon bildirimlerini aç."
3. Ana ekrandaki simgeden açtığında indirme sayfası değil site açılır (sayfa kendini siteye geçirir).

Ayrıntı: [Tarayıcıdan uygulama olarak yükleme](tarayicidan-yukleme.md).

#### Bilgisayarda

Bugünkü sayfada bilgisayar için ayrı bölüm yok. Bilgisayarda tarayıcının kendi "uygulamayı yükle" simgesini ya da giriş yaptıktan
sonra üst çubukta çıkan **"Uygulamayı yükle"** düğmesini kullanırsın ([Tarayıcıdan uygulama olarak yükleme](tarayicidan-yukleme.md)).

#### Tasarımda (Tasarım 1 önizlemesi)

Sayfanın yeni hâli (3 Ekim kararına göre):

1. Başlık **"Eğitim Evi uygulaması"**, altında "Bildirimler anında gelir, servisin nerede olduğunu haritada görürsün; ödevler,
   mesajlar ve ders programı cebinde. Bilgisayarda ve iPhone'da kurulum dosyası yok: tarayıcından yükleyince kendi penceresinde
   açılır." ve "En yeni sürüm **1.2.0** · 28 Eylül 2026 · **Neler yeni**" (önizlemedeki sürüm numaraları ve tarihler örnektir).
2. **"Sürümler"** başlığı, yanında "Yeni sürüm çıkınca tablonun en üstüne eklenir. Uygulama açılınca yeni sürümü kendisi haber
   verir." Tablonun sütunları:

   | Sütun | Başlığın altındaki küçük yazı | En yeni satırda | Eski satırlarda |
   |---|---|---|---|
   | **Sürüm** | — | numara ve durum rozeti | numara ve durum rozeti |
   | **Tarih** | — | yayın günü | yayın günü |
   | **Bilgisayar** (bilgisayar simgesi) | "Windows, macOS, Linux · tarayıcıdan" | **"Yükle"** düğmesi, altında "tarayıcıdan · kurulum dosyası yok" | "—" (üstüne gelince "Tarayıcıdan yüklenen uygulama hep en yeni sürümle açılır") |
   | **Android** (telefon simgesi) | "Android 8 ve üstü" | **".apk indir"** ve **"Google Play"** yan yana, altında ".apk · 7,1 MB · Google Play'de de" | o sürümün **".apk indir"** düğmesi, altında ".apk · <boyut>"; o sürümde Android yoksa "—" ("Bu sürümde yok") |
   | **iOS** (telefon simgesi) | "iPhone ve iPad · Safari'den" | mavi **"Yükle"** düğmesi, altında "tarayıcıdan · kurulum dosyası yok" | "—" (aynı açıklama) |
   | **Notlar** | — | ilk değişiklik notu, birden çok not varsa " · +2" gibi; tıklanır | aynı |

   Durum rozetleri: **"En yeni"**, **"Destekleniyor"**, **"Eski"**. En yeni satır vurgulu.
3. Tablonun altında: "Android'de Google Play'den kurabilir ya da .apk'yı doğrudan bu siteden indirebilirsin; her .apk'nın SHA-256
   özeti sürüm notlarında yazar. Bilgisayarda ve iPhone/iPad'de Eğitim Evi tarayıcıdan yüklenir, güncellemeyi kendisi alır."
4. **"Neler yeni"**ye ya da bir satırın notuna basınca **"Sürüm 1.2.0"** penceresi açılır: "Tarih:", "Durum:" (rozet),
   "Platformlar:" (ör. "PC (tarayıcı) · Android (7,1 MB) · iOS"), **"Neler yeni"** başlıklı madde listesi, "SHA-256 (.apk)" ve
   özet; altta **"Kapat"** ve (o sürümde Android varsa) **"Android için indir"**.
5. **".apk indir"** dosyayı indirir (önizlemede "egitim-evi-1.2.0.apk indiriliyor (7,1 MB)." kısa iletisi);
   **"Google Play"** mağaza sayfasını açar (önizlemede "Google Play'de Eğitim Evi sayfası açılıyor.").
6. Bilgisayar sütunundaki **"Yükle"** → **"Bilgisayara yükle"** penceresi; iOS sütunundaki mavi **"Yükle"** → **"iPhone ve iPad'e
   yükle"** penceresi. İkisi [Tarayıcıdan uygulama olarak yükleme](tarayicidan-yukleme.md)'de adım adım.

Önizlemede "iPhone ve iPad" kartı, "Android'e nasıl kurulur?" ve "Uygulama ne yapar?" bölümleri yok; .apk'yı kurma adımlarının
yeni sayfada nerede duracağı tasarımda belirtilmedi (açık nokta, [README](README.md)).

### Veli

Çocuğunun Android telefonuna **Eğitim Evi Aile**'yi (bugün yayımda olan sürüm) kurmak için:

1. Menüden **"Çocuğumun telefonu"**nu aç; telefon bağlı değilse kurulum kartındaki **"indirme sayfası"**na bas (yeni sekme).
2. Çocuğunun telefonunda yukarıdaki "Android'e indirmek" adımlarını izle.
3. Bağlamayı çocuk kendi öğrenci hesabıyla yapar: [Çocuğun telefonunu bağlama](../aile/telefonu-baglama.md).

### Öğrenci

Bugün: velin seninle telefonunu paylaşmanı istediyse uygulamayı bu sayfadan indirip kurarsın, sonra kendi öğrenci hesabınla
bağlarsın ([Çocuğun telefonunu bağlama](../aile/telefonu-baglama.md)). Tasarımda öğrenci uygulamayı kendi işleri için de (ödev,
program, servis) kurar ([Android uygulaması](android-uygulamasi.md)).

### Yönetici

**"Google Play'den yükle"** düğmesinin adresini sen girersin: gizli yönetim paneli → **"Site Ayarları"** → **"Play Store
bağlantısı"** kartı ([Site ayarları](../yonetim/site-ayarlari.md)). Kartın açıklaması: "İndir sayfasındaki **Google Play'den
yükle** düğmesi bu adrese gider; boşsa düğme görünmez. Değişiklik indir sayfası yeniden açılınca hemen görünür." Kutunun altında
"Yalnız https://play.google.com/ ile başlayan adres." **"Kaydet"**; panelden kaydedilmiş bir değer varsa **"Varsayılana dön"**
(sunucunun ayar dosyasındaki değere döner).

Yeni sürümü yayımlamak sitede yapılmaz: uygulamanın GitHub deposunda yeni bir sürüm (Release) açılıp APK eklenir; sayfa en geç
15 dakika içinde kendiliğinden gösterir (aşağıda kurallar).

## Kurallar ve sınırlar

- **Kim açar:** herkes; giriş gerekmez, oturum kullanılmaz.
- **Liste nereden gelir:** uygulamanın GitHub deposunun "Releases" bölümünden. Tarayıcı GitHub'a doğrudan gitmez; sunucu listeyi
  alır, süzer ve **15 dakika** saklar. GitHub'a ulaşılamazsa elindeki son liste gösterilmeye devam eder; ulaşılamadıktan sonra
  2 dakika yeniden denemez.
- **Hangi sürümler görünür:** taslak ve ön sürüm (pre-release) olmayanlar; etiketi `1.0.1` ya da `v1.0.1` biçiminde (iki ile dört
  sayı) olanlar; bu deponun `.apk` dosyası olanlar (dosya adı yalnız harf, rakam, `.`, `_`, `-`; boyutu 0'dan büyük, 500 MB'tan
  küçük). En çok **30 sürüm**, sürüm numarasına göre en yeni en üstte.
- **Notlar:** GitHub'daki not düz metne çevrilir ve **400 karaktere**, sürüm adı **90 karaktere** kısaltılır.
- **SHA-256:** GitHub özeti verdiyse tabloda yazar; vermediyse o satırda özet görünmez. Büyük düğmenin yanında özet yok.
- **Tarih:** senin cihazının saat dilimiyle yazılır ("26 Eylül 2026"); gece yarısına yakın yayımlanan sürüm farklı saat
  diliminde bir gün kayık görünebilir.
- **Play Store bağlantısı:** yalnız `https://play.google.com/` ile başlayan adres kabul edilir. Yanlış adres yazan yöneticiye:
  "Bağlantı https://play.google.com/ ile başlamalı (ör. https://play.google.com/store/apps/details?id=...)." Boş bırakılabilir
  (düğme görünmez).
- **"Android 8.0 ve üstü"** yazısı uygulamanın en düşük Android sürümüyle aynıdır.
- **Bilinen açıklar (kod okumasına göre):**
  - Depoda gösterilecek sürüm yoksa (liste alındığı hâlde boşsa) da kutu "Sürüm listesi şu an alınamadı" der.
  - Bilgisayarda ya da Android'de tarayıcıdan **uygulama olarak kurulmuş** Eğitim Evi penceresinde bu sayfa açılır açılmaz ana
    sayfaya döner (sayfa "ana ekrandan açıldım" sanıyor); o pencereden indirme sayfasına ulaşılamaz.
- **Tasarımda:** bilgisayar için kurulum dosyası (.exe) yoktur; iOS App Store'da değildir; tarayıcıdan yüklenen sürüm hep en yeni
  sürümle açıldığı için eski satırlarda Bilgisayar ve iOS hücreleri "—".

## Kardeşler ve ilgili

**Kardeşler** ([Uygulama ve indirme](README.md)): [Tarayıcıdan uygulama olarak yükleme](tarayicidan-yukleme.md) ·
[Android uygulaması](android-uygulamasi.md) · [Kendini güncelleme](kendini-guncelleme.md) ·
[Telefonuna kur kartı](telefonuna-kur-karti.md) · [Ağ yokken açılış](cevrimdisi-acilis.md).

**İlgili:** [Üst şerit ve alt bilgi](../acilis-sayfasi/ust-serit-ve-alt-bilgi.md) ("İndir" bağlantısı) ·
[Adresler](../acilis-sayfasi/adresler.md) · [SSS](../acilis-sayfasi/sss.md) ·
[Çocuğun telefonunu bağlama](../aile/telefonu-baglama.md) · [Site ayarları](../yonetim/site-ayarlari.md) ·
[Profil menüsü](../menu-ve-arama/profil-menusu.md) · [Telefon bildirimi](../bildirim/telefon-bildirimi.md) ·
[Aydınlatma metni](../kvkk-ve-gizlilik/aydinlatma-metni.md).

## Kod tarafı

- Sayfa: `public/indir/indir.html` ([public/indir/KLASOR.md](../../public/indir/KLASOR.md)); betiği
  [public/js/indir.md](../../public/js/indir.md) (son sürüm kutusu, tablo, "iPhone'a ekle", ana ekrandan açılınca siteye geçiş);
  ortak düğmeler (ay/güneş, Yapımcılar) [public/js/belge.md](../../public/js/belge.md).
- Sunucu: [sunucu/uygulama-surum.md](../../sunucu/uygulama-surum.md) (GitHub sürümlerini alma, süzme, 15 dakika saklama);
  [sunucu/site.md](../../sunucu/site.md) (`GET /api/uygulama` → `{ playStore, sayfa, alindi, surumler }`);
  [sunucu/http.md](../../sunucu/http.md) (kısa adreslerin yönlendirmesi).
- Play Store bağlantısı: [sunucu/bolumler/site-ayarlari.md](../../sunucu/bolumler/site-ayarlari.md) (doğrulama),
  [public/js/yonetim/09b-site-ayarlari.md](../../public/js/yonetim/09b-site-ayarlari.md) (kart).
- Velinin kurulum kartındaki bağlantı: [public/js/parcalar/27b-aile.md](../../public/js/parcalar/27b-aile.md).
- Testler: [testler/test-uygulama-surum.md](../../testler/test-uygulama-surum.md) (süzme kuralları),
  [testler/test-etut.md](../../testler/test-etut.md) (`/api/uygulama` girişsiz açık, sayfa ve yönlendirmeler),
  [testler/test-adresler.md](../../testler/test-adresler.md) (kısa adresler 301),
  [testler/test-site-ayarlari.md](../../testler/test-site-ayarlari.md) (Play Store bağlantısı).
- Kullanıcıya dönük anlatım: [belge/KILAVUZ.md](../../belge/KILAVUZ.md) ("Açılış sayfası, giriş ve site ayarları").
- Tasarım: Tasarım 1 önizlemesi, "Uygulama" sayfası (sürüm tablosu, "Bilgisayara yükle" ve "iPhone ve iPad'e yükle" pencereleri,
  sürüm notu penceresi).

## Sık sorulanlar

- **Android uygulamasını nereden indiririm?** Üst şeritteki **İndir** düğmesinden (`egitimevi.org/indir`). Sayfada son sürüm ve
  bütün eski sürümler tarih, değişiklik ve boyutlarıyla bir tabloda durur. İnen `egitim-evi.apk` dosyasını açıp kurarsın; telefon
  izin isterse bir kez izin verirsin.
- **iPhone'da kullanabilir miyim?** Evet. App Store uygulaması yok; Safari'de **Paylaş → Ana Ekrana Ekle** dersen simgesiyle,
  uygulama gibi açılır ve telefon bildirimi alabilir (iOS 16.4 ve üstü). Sayfadaki mavi **iPhone'a ekle** düğmesi adımları
  gösterir.
- **"Sürüm listesi şu an alınamadı" yazıyor.** Sunucu GitHub'a ulaşamadı ya da henüz yayımlanmış sürüm yok. **"GitHub'daki
  sürümler"** düğmesiyle aynı dosyalara GitHub'dan ulaşırsın.
- **Bilgisayar için indirilecek dosya yok mu?** Yok; Eğitim Evi bilgisayarda tarayıcıdan uygulama olarak yüklenir
  ([Tarayıcıdan uygulama olarak yükleme](tarayicidan-yukleme.md)).
- **Eski sürüme dönebilir miyim?** Dosyası tabloda durur; o sürümün **İndir**'ine bas. Ama Android, kurulu sürümden eski bir
  paketi güncelleme olarak üstüne kurmaz: önce uygulamayı kaldırman gerekir. Kaldırınca telefondaki bilgiler
  (oturum, çocuğun telefonu bağlantısı) silinir; yeniden girer, gerekiyorsa yeniden bağlarsın.

## Sırada

- İndir sayfasının yeni hâli (3 Ekim kararı: .exe yok, bilgisayar ve iOS tarayıcıdan, Android .apk + Google Play; Linux'taki yapı
  işi).
- Android yerel uygulama işi: tek uygulama "Eğitim Evi" 2.0.0'ın yayımlanması; sayfanın "Uygulama ne yapar?" metni ona göre
  değişir.
- Üst şerit sadeleştirme işi: portalda profil menüsünde "Uygulamayı indir" ve ana sayfadaki kart; kurulu uygulamada sayfanın kendini
  ana sayfaya atması da bu işte düşünülecek.
- Çok dil işi: sayfanın metinleri seçili dile göre.
