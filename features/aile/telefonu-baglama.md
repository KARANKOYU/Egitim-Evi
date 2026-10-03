# Çocuğumun telefonu · Çocuğun telefonunu bağlama

**Durum:** Kodda var

Öğrencinin, kendi Android telefonunu kendi öğrenci hesabıyla ve kendi açık onayıyla velisine bağlaması; telefonun bundan
sonra yalnız konum ve ekran süresi göndermeye yarayan bir anahtarla çalışması.

## Ne işe yarar

Velinin [Çocuğumun telefonu sayfası](cocugumun-telefonu-sayfasi.md)'nda bir şey görebilmesi için önce çocuğun telefonundaki
uygulamanın Eğitim Evi'ne bağlanması gerekir. Bağlamayı veli kendi hesabıyla yapamaz: telefonun sahibi olan çocuk kendi
öğrenci hesabıyla girer ve paylaşımı kendisi kabul eder. Bağlanınca telefona bir **cihaz anahtarı** verilir; bu anahtar
hesaba giriş vermez, yalnız konum ve süre göndermeye yarar. Öğrencinin oturumu telefonda kalmaz.

## Nereden açılır

- **Veli (sitede):** telefon bağlı değilken [Çocuğumun telefonu sayfası](cocugumun-telefonu-sayfasi.md)'nda kurulum kartı:
  **"Elif'in telefonu henüz bağlı değil"** ve üç adım. Birinci adımdaki **"indirme sayfası"** bağlantısı sitenin indir
  sayfasını (`/indir/indir.html`) yeni sekmede açar.
- **İndir sayfası:** üst şeritteki indirme bağlantısı ya da kısa adres `/indir` ([İndir sayfası](../uygulama/indir-sayfasi.md)):
  "Android sürümleri" tablosunda **"İndir"** → `egitim-evi.apk`; "Android'e nasıl kurulur?" adımları; "Uygulama ne yapar?"
  açıklaması.
- **Öğrenci (telefonda):**
  - Bugün yayımda olan **Eğitim Evi Aile** (1.0.x): uygulama açılınca doğrudan bağlama ekranı gelir (başlığı "Eğitim Evi
    Aile").
  - Hazırlanan tek uygulama **Eğitim Evi** (henüz yayımlanmadı, [Android uygulaması](../uygulama/android-uygulamasi.md)):
    **Ayarlar → "Telefon" bölümü → "Bu telefonu velimle paylaş"** (alt yazısı "Konumunu ve ekran süreni velin görsün";
    yalnız öğrenci hesabıyla girildiyse görünür). Açılan ekranın başlığı **"Çocuğun telefonu"**.

## Adım adım

### Veli

1. Menüden **"Çocuğumun telefonu"**nu aç; telefon bağlı değilse kurulum kartını görürsün:
   1. "**Eğitim Evi Aile** uygulamasını Elif'in Android telefonuna kur (indirme sayfası)."
   2. "Uygulamada Elif'in **öğrenci hesabıyla** giriş yap; paylaşımı Elif kendisi onaylar."
   3. "İzinleri ver: **Konum — Her zaman izin ver**, **Kullanım erişimi**, **Bildirimler** ve **arka planda çalışma**
      (uygulamanın pil ayarında **Kısıtlamasız**)."

   Altında: "Uygulama hiçbir uygulamayı kapatmaz ya da kilitlemez; yalnızca konumu ve süreleri gönderir. iPhone'da çalışmaz
   (Apple buna izin vermiyor)."
2. **"indirme sayfası"**na bas, çocuğunun telefonunda `egitim-evi.apk`'yı indir ve kur (telefon "bilinmeyen uygulamalar"
   için izin isterse bir kez ver).
3. Çocuğun kendi öğrenci hesabıyla bağlasın (aşağıda "Öğrenci"). Öğrenci hesabının kullanıcı adını ve şifresini okul verir.
   Okul hesabı "ilk girişte kendi şifresini belirlesin" diye açtıysa ve çocuk henüz hiç girmediyse önce siteye girip kendi
   şifresini belirlemelidir (yoksa bağlama reddedilir).
4. Bağlanınca sana bildirim gelir: "Elif Yılmaz telefonunu (samsung SM-A515F) Eğitim Evi Aile'ye bağladı. Konum ve ekran
   süresi Aile sayfasında." ([Aile bildirimleri](bildirimler.md)). Bildirime basınca sayfa açılır; kurulum kartının yerinde
   **"Bağlı telefon"** kartı vardır.
5. Çocuğun izinleri vermesini bekle ([Telefondaki izinler ve durum](izinler-ve-durum.md)); ilk konum ve süreler internet
   olunca gelir.

### Öğrenci

1. Bağlama ekranını aç (yukarıda "Nereden açılır"). Ekranın başındaki yazı: "Bu uygulama telefonunun konumunu ve hangi
   uygulamayı ne kadar kullandığını velinle paylaşır. Velin bunları Eğitim Evi'nde görür; okulun görmez. Veriler 7 gün sonra
   silinir. Hiçbir uygulama kapatılmaz ya da kilitlenmez."
2. Kutuları doldur:
   - **"Sunucu adresi"** — hazır gelir (`https://egitimevi.org`); değiştirme.
   - **"Okulunun adresi (egitimevi.org/...)"** — okulunun adresindeki kısa ad (adres `egitimevi.org/school/okulun-kisa-adi`
     ise yalnız `okulun-kisa-adi`; başına `egitimevi.org/school/` yazma). Kullanıcı adın yalnız bir okulda varsa boş
     bırakabilirsin.
   - **"Kullanıcı adı"** ve **"Şifre"** — kendi öğrenci hesabın.
   - **"Doğrulama: …"** satırındaki soruyu (ör. bir toplama) **"Cevap"** kutusuna sayıyla yaz; soru gelmediyse ya da
     beğenmediysen **"Başka soru"**ya bas ([Robot doğrulaması](../giris-hesap/robot-dogrulamasi.md)). Sunucu cevaba yalnız
     bu hesapta ya da bu bağlantıdan daha önce hatalı giriş denendiyse bakar; öbür durumda boş kalsa da giriş olur.
3. Onay kutusunu işaretle: **"Konumumun ve ekran süremin velimle paylaşılacağını okudum, kabul ediyorum."**
4. **"Giriş yap ve bu telefonu bağla"**ya bas. Ekranda "Bağlanıyor..." yazar.
5. Bağlanınca ekran "bağlı" hâline geçer ("Bağlı hesap: Elif Yılmaz") ve telefon hemen **konum izni** ister. Öbür izinleri
   ekrandaki düğmelerle sen verirsin ([Telefondaki izinler ve durum](izinler-ve-durum.md)).

Arka planda: uygulama girişi yapar, hesabın öğrenci hesabı olduğunu denetler, telefonu üretici ve model adıyla (ör.
"samsung SM-A515F"), Android sürümüyle ve onayınla bağlar, aldığı anahtarı saklar ve **öğrenci oturumunu hemen kapatır**:
telefonda yalnız anahtar kalır.

### Ziyaretçi

Giriş yapmadan da [İndir sayfası](../uygulama/indir-sayfasi.md)'ndaki "Uygulama ne yapar?" bölümünü okuyabilirsin: "Şu anki
sürüm çocuğun telefonuna kurulur: öğrenci kendi hesabıyla ve onayıyla bağlar, telefonun konumu ve hangi uygulamanın ne
kadar kullanıldığı velisine gider. Veli bunları sitede Çocuğumun telefonu sayfasında görür. Okul bu bilgileri görmez; 7 gün
sonra silinir. Hiçbir uygulamayı kapatmaz ya da kilitlemez." Açılış sayfasındaki
[Sık sorulan sorular](../acilis-sayfasi/sss.md)'da da aynı konu var.

## Kurallar ve sınırlar

- **Yalnız öğrenci hesabı.** Veli, öğretmen ya da müdür hesabıyla bağlanmaz. Sunucu öğrenci olmayana 403 "Telefonu çocuğun
  kendi öğrenci hesabıyla bağla." der; telefon ekranı daha önce durdurur:
  - "Bu uygulamaya öğrenci hesabıyla girilir (veli, telefonun sahibi olan çocuğun hesabıyla bağlar)." — öğrenci olmayan
    hesap; oturum açılıp hemen kapatılır.
  - "Bu uygulamaya öğrenci hesabıyla girilir." — e-postalı yetişkin hesabı (iki adımlı giriş kodu istenen hesap). Bu
    durumda sunucu giriş kodunu o hesabın e-postasına yine de gönderir.
- **Açık onay şart.** Kutu işaretlenmeden telefon "Devam etmek için paylaşımı kabul etmelisin." der; sunucu da onaysız
  isteğe "Paylaşımı kabul etmeden bağlanamaz." der.
- **Saatte en çok 10 bağlama** (öğrenci başına). Fazlası: "Bu saat içinde çok fazla bağlama denendi."
- **Öğrenci başına en çok 3 telefon.** Dördüncü telefon bağlanınca en eski telefonun kaydı **uyarısız** silinir; o telefon
  bir sonraki gönderiminde reddedilir, bağlantıyı kendisi unutur ve yeniden giriş ekranını gösterir
  ([Bağlantıyı kaldırma](baglantiyi-kaldirma.md)).
- **Anahtar bir kez verilir**, sunucuda yalnız özeti (SHA-256) durur; anahtar oturum yerine geçmez, uygulamanın öbür
  anahtarlı işlerinde (bildirim yoklama) de geçmez. Telefon değişirse yeni telefonda yeniden bağlanılır; uygulamanın verisi
  buluta yedeklenmez, yeni telefona taşınmaz.
- **Öğrencinin hesabı hazır olmalı.** Aydınlatma metninin yeni sürümünü onaylamamışsa "Aydınlatma metni güncellendi. Devam
  etmek için okuyup onaylaman gerekiyor."; okulun verdiği şifreyle ilk kez giriyorsa "Sana verilen şifreyle girdin. Devam
  etmeden önce kendi şifreni belirle." Bu ekran bunları karşılamaz: önce siteye (ya da uygulamanın kendi girişine) girip
  bitir ([İlk girişte kendi şifreni belirleme](../giris-hesap/zorunlu-sifre-belirleme.md),
  [Onay ve yeniden onay](../kvkk-ve-gizlilik/onay-ve-yeniden-onay.md)).
- **Telefondaki öteki iletiler:**
  - "Kullanıcı adını ve şifreni yaz."
  - Sunucu adresi: "Adres https:// ile başlamalı.", "İnternetteki sunucuya yalnızca https:// ile bağlanılır.", "Adres
    geçersiz."; soru yerinde "Önce sunucu adresini doğru yaz." (http yalnız yerel ağdaki deneme sunucusuna kabul edilir).
  - Soru gelmezse: "Sunucuya ulaşılamadı: …".
  - Girişin iletileri sunucudan aynen gelir: "Doğrulama sorusunun cevabı yanlış.", "Bu okul adresi bulunamadı. Ana sayfadan
    okulunu seç.", "Bu kullanıcı adı birden çok okulda var. Önce okulunu seç, sonra giriş yap.", "Bu okulda bu kullanıcı
    adıyla bir hesap yok.", "Şifre yanlış." (son hakları sayar) — ayrıntısı [Giriş](../giris-hesap/giris.md).
  - "Giriş yapılamadı."; beklenmeyen hatada "Bağlanılamadı: …" (ağ kopması gibi durumlarda devamı Android'in İngilizce
    iletisi olabilir).
  - Hatalı denemeden sonra doğrulama sorusu kendiliğinden yenilenir.
- **Velin yoksa da bağlanır.** Bağlama veli bağını aramaz; bildirim kimseye gitmez, gelen veri ancak sonradan bağlanan
  veliye görünür (o da en çok son 7 günü).
- **iPhone yok.** Apple öteki uygulamaların kullanım süresini okumaya yalnız kendi izniyle (Screen Time) olanak verir.
- **Bilinen sorunlar:**
  - Kurulum kartı adın sonuna her zaman "'in" ekler: "Elif'in" doğru, "Can'in" (Can'ın), "Ali'in" (Ali'nin) yanlış çıkar.
  - Kart "Eğitim Evi Aile uygulaması" der; indir sayfası tek bir "Eğitim Evi" uygulamasından ve `egitim-evi.apk`'dan söz
    eder, hazırlanan uygulamada bu ekranın adı "Bu telefonu velimle paylaş"tır. Veli indir sayfasında "Aile" adını bulamayabilir.
  - "Sunucu adresi" kutusuna yazılan adres hazırlanan tek uygulamanın bütün ekranlarının adresi olur.
  - Telefon döndürülünce kutulara yazılanlar silinir.
  - Bu ekran koyu temada da açık renklidir.

## Kardeşler ve ilgili

**Kardeşler** (aynı klasör, [Çocuğumun telefonu](README.md)):

- [Telefondaki izinler ve durum](izinler-ve-durum.md) — bağlandıktan sonraki ekran ve izinler.
- [Bağlantıyı kaldırma](baglantiyi-kaldirma.md) — bağlantının bitmesi.
- [Çocuğumun telefonu sayfası](cocugumun-telefonu-sayfasi.md) — kurulum kartı ve "Bağlı telefon" kartı.
- [Aile bildirimleri](bildirimler.md) — "telefonunu bağladı" bildirimi.
- [Kim görür, ne kadar saklanır](mahremiyet.md) — onay kutusunun neyi kabul ettirdiği.

**İlgili:**

- [İndir sayfası](../uygulama/indir-sayfasi.md), [Android uygulaması](../uygulama/android-uygulamasi.md),
  [Uygulamanın kendini güncellemesi](../uygulama/kendini-guncelleme.md).
- [Giriş](../giris-hesap/giris.md), [Okulun sayfasından giriş](../giris-hesap/okulun-sayfasindan-giris.md),
  [Robot doğrulaması](../giris-hesap/robot-dogrulamasi.md).
- [Veli kodu](../hesaplar/veli-kodu.md), [Çocuklarım](../portallar/cocuklarim.md) — veriyi kimin göreceğini veli bağı belirler.

## Kod tarafı

- Ön yüz: [public/js/parcalar/27b-aile.md](../../public/js/parcalar/27b-aile.md) — `aileKurulumKarti(d)`, `AILE_APK`
  (`/indir/indir.html`).
- Sunucu: [sunucu/bolumler/aile.md](../../sunucu/bolumler/aile.md) — `POST /api/aile/cihaz` (öğrenci, `onay: true`,
  `hizSinir` saatte 10, 32 bayt anahtar, yalnız özet, velilere bildirim, cevapta `cihazAnahtari` bir kez);
  [sunucu/veri/depo/aile.md](../../sunucu/veri/depo/aile.md) — `cihazEkle` (öğrenci başına 3 cihaz);
  [sunucu/api.md](../../sunucu/api.md) — bağlama isteği oturum kapılarından (aydınlatma, zorunlu şifre) geçer;
  [sunucu/bolumler/kayit.md](../../sunucu/bolumler/kayit.md) — giriş ve iletileri.
- Tablo: `aile_cihazlari` (şema 026, [SEMA.md](../../sunucu/veri/sema/SEMA.md)).
- Android (ayrı depo `Egitim-Evi-App`): `AileEkrani.java` (`girisEkrani`, `soruGetir`, `baglan`: `/api/challenge`,
  `/api/login`, `/api/aile/cihaz`, `/api/logout`), `Api.java` (`adresSorunu`, `X-Aile-Cihaz` başlığı), `Ayarlar.java`
  (varsayılan sunucu, anahtarın saklandığı "aile" ayar dosyası), `AyarlarSayfasi.java` ("Bu telefonu velimle paylaş").
- İndir sayfası: `public/indir/indir.html` ([public/indir/KLASOR.md](../../public/indir/KLASOR.md)).
- Test: [testler/test-aile.md](../../testler/test-aile.md) — onaysız 400, velinin kendi hesabıyla 403, 64 haneli anahtar,
  veliye bildirim, anahtarın oturum ve uygulama anahtarı yerine geçmemesi.

## Sık sorulanlar

- **Telefonu ben (veli) kendi hesabımla bağlayabilir miyim?** Hayır. Paylaşımı telefonun sahibi olan çocuk kendi hesabıyla
  kabul eder; bu bilinçli bir kural.
- **Çocuğumun kullanıcı adını ve şifresini nereden bulurum?** Okul verir (giriş kâğıdı). Şifreyi unuttuysa okul yenisini
  verir.
- **"Sana verilen şifreyle girdin" diyor.** Çocuğun önce siteye girip kendi şifresini belirlemeli, sonra bağlamayı yeniden
  denemeli.
- **İki telefonu da bağlayabilir miyiz?** Evet, öğrenci başına üç telefona kadar. Dördüncüsü en eskisini düşürür.
- **iPhone için ne yapabilirim?** Bugün yok. Kılavuz bunu "henüz eklenmeyenler" arasında sayar: Apple'ın Screen Time izni
  gerekir.
- **Bağladıktan sonra öğrencinin hesabı telefonda açık mı kalıyor?** Hayır; oturum hemen kapanır, telefonda yalnız konum ve
  süre gönderen anahtar kalır.

## Sırada

- Android yerel uygulama (iş 10): tek uygulama "Eğitim Evi" yayımlanınca bağlama ekranı Ayarlar'daki "Bu telefonu velimle
  paylaş"tan açılacak; eski 1.0.x kurulumlar aynı uçlarla çalışmayı sürdürür. Kurulum kartının metni ve uygulama adı bu
  işte birleştirilecek.
- Güvenlik denetimi (iş 3): dördüncü telefonun en eskisini uyarısız düşürmesi ("aile 3 cihaz sınırı sessiz").
- Çok dil (iş 22): "'in" ekinin doğru yazımı.
