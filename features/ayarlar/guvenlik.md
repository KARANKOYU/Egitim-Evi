# Hesap ayarları · Şifre ve güvenlik

**Durum:** Kodda var; tasarımda ek olarak "Şifre ve güvenlik" bölümünde "İki adımlı giriş" satırı (öğrenci isteğe bağlı açar), "Doğrulama uygulaması" (kurulum, kurtarma kodları, kaldırma), "Açık oturumlarım" ve önemli işlerden önce "Kimliğini doğrula" ekranı. (Bugün kodda olan: e-posta koduyla iki adımlı giriş; öğrenci dışında e-postası olan her hesapta hep açık, Ayarlar'da yalnız E-posta kutusunun altındaki açıklamayla anlatılır.)

Hesabını şifre dışında da koruyan ayarlar: iki adımlı giriş, doğrulama uygulaması, açık oturumlar ve önemli işlerde yeniden kimlik
doğrulama.

## Ne işe yarar

Şifren çalınsa bile hesabına girilemesin. Bugün güvenlik için Ayarlar'da açıp kapatılacak bir şey yok: yetişkin hesabında iki adımlı
giriş her zaman açıktır. Kullanıcının kararları: 26 Eylül "öğrenci dışında diğer herkes de zorunlu"; 27 Eylül doğrulama uygulaması
(önce yönetici ve destek için, sonra bütün yetişkinlere isteğe bağlı) ve "Açık oturumlarım"; 29 Eylül öğrencinin de isterse iki adımlı
doğrulama açabilmesi: "öğrenci e-posta ile çift doğrulama açarsa altı haneli veya authenticator her neyse işte, o şifre değişince de
işlesin".

## Nereden açılır

- **Bugün:** ayrı bir yer yok. Ayarlar → "Giriş bilgileri" → E-posta kutusunun altında: "İki adımlı giriş: her girişte bu adrese bir
  kod gelir. Yetişkin hesaplarında hep açıktır." ([Giriş bilgileri](giris-bilgileri.md)).
- **Tasarımda:** Hesap ayarları → **"Şifre ve güvenlik"** bölümü; profil menüsünde **"Şifre ve güvenlik — şifre, iki adımlı giriş"**.
- **Telefon uygulamasında (tasarım):** Ayarlar → Güvenlik → **"Bu telefonu doğrulayıcı yap"** ([Doğrulayıcı](../uygulama/dogrulayici.md)).

## Adım adım

### Bugün: veli, öğretmen, çalışan, müdür, rolsüz yetişkin, yönetici (ve e-postası olan servisçi)

1. Her girişte şifreden sonra e-postana 6 haneli kod gelir; kodu yazınca girersin ([İki adımlı giriş](../giris-hesap/iki-adimli-giris.md)).
2. Ayarlar'da kapatma düğmesi yoktur. Kodun gittiği adresi değiştirmek için Ayarlar → Giriş bilgileri → E-posta
   ([Giriş bilgileri](giris-bilgileri.md)).
3. E-postası olmayan eski yetişkin hesabına her girişte (ve sayfa yenilenince) en çok bir kez "E-posta eklemek ister misin?" sorulur;
   "Bir daha sorma" denene ya da e-posta eklenene kadar sürer. E-posta yoksa kod gönderilemez, o hesap yalnız kullanıcı adı ve şifreyle
   girer ([E-posta ekleme önerisi](eposta-ekleme-onerisi.md)).
4. Başka cihazlardaki oturumları kapatmanın bugünkü tek yolu şifreni değiştirmektir ([Şifre değiştirme](sifre-degistirme.md)).

### Bugün: öğrenci

Kod adımı yoktur (e-postası olsa bile); Ayarlar'da güvenlik ayarı yoktur.

### Tasarımda (Tasarım 1 önizlemesi): "Şifre ve güvenlik" bölümü

Satırlar sırasıyla:

1. **"Şifre değiştir"** formu ([Şifre değiştirme](sifre-degistirme.md)).
2. **"İki adımlı giriş"** — durum yazısı ve **"Ayarla"**. Durum hesaba göre:

   | Hesap | Yazı |
   |---|---|
   | Öğrenci | "İsteğe bağlı — açarsan girişte e-postana kod gelir" |
   | Veli, öğretmen | "Açık — girişte e-postana kod gelir" |
   | Müdür | "Açık — müdürlerde zorunlu" |
   | Eğitmen | "Açık — eğitmenlerde zorunlu" |
   | Yönetici, destek | "Açık · doğrulama uygulaması" |
   | Servisçi, portalı olmayan yetişkin | "Kapalı" |

3. **"Doğrulama uygulaması"** — "kurulu değil" ve **"Kur"** (altında "Google, Microsoft ya da Oracle Authenticator ile 6 haneli kod")
   ya da "Açık · <tarih>'dan beri" ve **"Yönet"** (altında "<N> kurtarma kodun var").
4. **"Açık oturumlarım"** — "<N> cihazda açık" ve **"Yönet"**, altında "Hesabına giriş yapılmış cihazlar; tek tek çıkış"
   ([Açık oturumlar](acik-oturumlar.md)).

**"İki adımlı giriş" penceresi ("Ayarla"):**

1. Üstte: "Yeni bir cihazdan girerken şifrene ek olarak bir kod sorulur."
2. Zorunlu hesapta: **"Açık"** — "<…>; kapatılamaz." ve yeşil **"Zorunlu"** rozeti. Öbür hesaplarda **"İki adımlı giriş"** anahtarı, altında
   "Hesabını şifren çalınsa bile korur".
3. **"Kod nereye"**: "E-posta" / "SMS".
4. **"Vazgeç"** / **"Kaydet"**. Hatalar: **"SMS için önce telefon numaranı ekle."**, **"E-posta ile kod için önce e-posta adresini
   ekle."** Kaydedince **"İki adımlı giriş açık; kod e-postana gelir."** ya da **"İki adımlı giriş kapatıldı."**

Bu pencerenin üç yeri kullanıcının kararlarıyla çelişir ve kodlanırken kararlar geçerlidir ([İki adımlı giriş](../giris-hesap/iki-adimli-giris.md)):
(1) veli ve öğretmende kapatma anahtarı var — yetişkinde iki adım kapatılamaz; (2) "Yeni bir cihazdan girerken" yazıyor — kod her
girişte sorulur; (3) "SMS" seçeneği var — SMS yok.

**"Doğrulama uygulaması" ("Kur" / "Yönet"):**

1. "Kur" → önce **"Kimliğini doğrula"** (aşağıda), sonra **"Doğrulama uygulamasını kur"** penceresi: üç adım ("Telefonunda Google
   Authenticator, Microsoft Authenticator ya da Oracle Mobile Authenticator'ı aç.", "Bu QR kodu okut ya da anahtarı elle yaz.",
   "Uygulamanın gösterdiği 6 haneli kodu aşağıya yaz."), QR kodu, **"Anahtar:"** ve **"Kopyala"**, **"Uygulamadaki kod:"** kutusu,
   **"Vazgeç"** / **"Doğrula"** (kod 6 rakam değilse "Uygulamanın gösterdiği 6 haneli kodu yaz.").
2. **"Kurtarma kodların"**: 10 kod, **"Kopyala"**, **"İndir (.txt)"**, **"Bu kodları güvenli bir yere kaydettim"** kutusu işaretlenince
   **"Bitti"** → "Doğrulama uygulaması açıldı; girişte ve önemli işlerde kodu sorulacak."
3. "Yönet" penceresi: "Durum: Açık · <tarih>'dan beri", "Kurtarma kodu: N / 10 kaldı", "Girişte ve önemli işlerde (hesap silme,
   verilerini indirme, oturumları kapatma) uygulamanın 6 haneli kodu sorulur."; düğmeler **"Kapat"**, **"Yeni kurtarma kodları"**
   (kimlik doğrulamadan sonra; "Yeni kurtarma kodların kaydedildi; eskileri artık geçmez."), kırmızı **"Kaldır"** (kimlik doğrulamadan
   sonra; "Doğrulama uygulaması kaldırıldı; girişte yine e-posta kodu sorulur.").

Ayrıntı, girişte kullanım ve kurtarma: [Doğrulama uygulaması](../giris-hesap/dogrulama-uygulamasi.md).

**"Kimliğini doğrula" ekranı (önemli işlerden önce):**

1. Tam ekran açılır; sol üstte **"← Vazgeç"** ([Doğrulama ekranlarından vazgeçme](../giris-hesap/dogrulama-ekranindan-vazgecme.md)).
2. Başlık **"Kimliğini doğrula"**, altında "<iş> için önce şifreni yaz." (doğrulama uygulaması kuruluysa "… önce şifreni ve doğrulama
   uygulamandaki kodu yaz."). İşler: "Doğrulama uygulamasını kurmak", "Doğrulama uygulamasını kaldırmak", "Yeni kurtarma kodları
   üretmek", "Diğer cihazlardaki oturumları kapatmak", "Verilerini indirmek", "Çocuğunun verilerini indirmek", "Okuldan ayrılmak".
3. **"Şifre:"** (göz düğmeli), uygulama kuruluysa **"Doğrulama kodu:"**; **"Doğrula ve devam et"**.
4. Hatalar: **"Şifreni yaz."**, **"Uygulamadaki 6 haneli kodu yaz."**
5. "← Vazgeç": **"Vazgeçildi; hiçbir şey değişmedi."**

### Tasarımda: role göre

- **Öğrenci:** iki adımlı girişi isterse açar (e-postasına 6 haneli kod — e-postası onaylıysa — ya da doğrulama uygulaması). Veli ya da
  okul açamaz, kapatamaz. Okul, yönetici ya da destek şifresini değiştirse de iki adım **açık kalır**; yalnız öğrenci kapatır. Erişimini
  kaybederse yönetici ya da destek kimliğini doğrulayıp sıfırlar (işlem kaydı).
- **Veli, öğretmen, çalışan:** e-posta kodu zorunlu; doğrulama uygulamasını isterse kurar.
- **Müdür:** e-posta kodu zorunlu; doğrulama uygulaması isteğe bağlı ama önerilir: ana sayfasında ve Ayarlar'ında kapatılabilir
  **"Hesabını daha güvenli yap"** kartı.
- **Eğitmen:** yetişkin hesabıdır; iki adım zorunlu (Tasarım 1 yazısı: "eğitmenlerde zorunlu").
- **Yönetici ve destek:** doğrulama uygulaması **zorunlu**; kurulu değilse girişten sonra yalnız kurulum ekranı açılır
  ([Panelde zorunlu doğrulama](../yonetim/panelde-zorunlu-dogrulama.md)). Başkasının uygulamasını kimlik doğrulayarak sıfırlarlar
  ([Hesaba müdahale](../yonetim/hesaba-mudahale.md)).
- **Servisçi:** e-postası yoksa iki adım yok; varsa kod sorulur.

## Kurallar ve sınırlar

- **Bugün:** iki adımlı giriş öğrenci dışında e-postası olan her hesapta zorunlu ve kapatılamaz; kod 5 dakika geçerli, tek kullanımlık,
  5 hatalı denemede iptal ([İki adımlı giriş](../giris-hesap/iki-adimli-giris.md)).
- **Şifre değişikliği iki adımlı doğrulamayı asla kapatmaz** (bütün hesaplar için yazılı kural).
- **SMS yok** (tanım: ücretli, SIM kopyalama riski).
- **Doğrulama uygulaması:** standart 6 haneli, 30 saniyelik kod; 10 tek kullanımlık kurtarma kodu, bir kez gösterilir; aynı kod iki kez
  kabul edilmez ([Doğrulama uygulaması](../giris-hesap/dogrulama-uygulamasi.md)).
- **Önemli işlerde çift doğrulama** (tanım): o an e-postaya yeni kod (uygulama kuruluysa uygulama kodu), 10 dakika geçerli, işe bağlı
  ([Çift doğrulama](../egitim-yili/cift-dogrulama.md)).
- **Okul cihazı** (müdürün seçtiği bilgisayarda kod sorulmaması) öneri olarak kaldı; kullanıcı "sonra bakarım" dedi, kural değil.

## Kardeşler ve ilgili

**Kardeşler:** [Ayarlar sayfası](hesap-ayarlari-sayfasi.md) · [Şifre değiştirme](sifre-degistirme.md) ·
[Açık oturumlar](acik-oturumlar.md) · [Giriş bilgileri](giris-bilgileri.md) · [Verilerimi indir](verilerimi-indir.md) ·
[Hesabımı sil](hesabimi-sil.md).

**İlgili:** [İki adımlı giriş](../giris-hesap/iki-adimli-giris.md), [Doğrulama uygulaması](../giris-hesap/dogrulama-uygulamasi.md),
[Doğrulama ekranlarından vazgeçme](../giris-hesap/dogrulama-ekranindan-vazgecme.md), [Yeni cihaz uyarısı](../giris-hesap/yeni-cihaz-uyarisi.md),
[Doğrulayıcı](../uygulama/dogrulayici.md), [Panelde zorunlu doğrulama](../yonetim/panelde-zorunlu-dogrulama.md),
[Çift doğrulama](../egitim-yili/cift-dogrulama.md), [Okuldan ayrılma](../portallar/okuldan-ayrilma.md).

## Kod tarafı

- Bugün: [sunucu/guvenlik.md](../../sunucu/guvenlik.md) (`girisKoduGonder`, `girisKoduDogrula`),
  [sunucu/bolumler/kayit.md](../../sunucu/bolumler/kayit.md) (`POST /api/login`, `/login/dogrula`, `/login/tekrar`),
  [public/js/parcalar/05-giris.md](../../public/js/parcalar/05-giris.md) (kod ekranı),
  [public/js/parcalar/23-veli-ayarlar.md](../../public/js/parcalar/23-veli-ayarlar.md) (E-posta kutusunun açıklaması).
- Tasarımın kodu henüz yok. Tanımlar: Sistem işi (doğrulama uygulaması, açık oturumlar), Tek kişi tek hesap işinin 6. kararı (öğrencinin
  iki adımı), Yıl geçişi işi (çift doğrulama), Android uygulaması işi (doğrulayıcı). Kodlanınca: `23-veli-ayarlar.js` (Güvenlik
  bölümü), sunucuda doğrulama uygulaması ve kurtarma kodları.
- Testler: [testler/test-giris-kayit.md](../../testler/test-giris-kayit.md) (iki adımlı giriş).
- Kullanıcıya dönük anlatım: [belge/KILAVUZ.md](../../belge/KILAVUZ.md) ("İki adımlı giriş (2FA)").

## Sık sorulanlar

- **İki adımlı girişi kapatabilir miyim?** Yetişkin hesabında hayır. Öğrenci (tasarımda) kendisi açtıysa kendisi kapatır.
- **Kodu e-posta yerine telefonuma alabilir miyim?** SMS yok; tasarımda doğrulama uygulaması kurarsan kod telefonundaki uygulamadan
  okunur.
- **Okul şifremi değiştirdi; iki adımlı girişim kapandı mı?** Hayır (tasarım kuralı); yeni şifreyle de kod sorulur.

## Sırada

- Sistem: doğrulama uygulaması (bütün yetişkinlere isteğe bağlı, yönetici ve destekte zorunlu), kurtarma kodları, açık oturumlar,
  yeni cihaz uyarısı.
- Tek kişi tek hesap + portallar öğrencide de: öğrencinin isteğe bağlı iki adımlı girişi.
- Yıl geçişi: önemli işlerde çift doğrulama.
- HTML (Tasarım 1): "İki adımlı giriş" penceresindeki kapatma anahtarı, "Yeni bir cihazdan" cümlesi ve SMS seçeneği kararlara göre
  düzeltilecek.
