# Öğrenci hesapları · Toplu giriş bilgisi (giriş bilgisi dağıt)

**Durum:** Kodda var; tasarımda ek olarak dağıtmadan önce 6 haneli doğrulama kodu (önemli işlerde çift doğrulama) ve Excel'le toplu
hesap açınca çıkan, indirmeden kapatılınca soran "Şifre listesi" penceresi.

Bir sınıfın ya da bütün okulun öğrencilerine yeni şifre üretip kullanıcı adı, şifre ve veli kodunu tek seferlik bir listede (Excel ve
kesilip dağıtılacak giriş kâğıtları) veren iş.

## Ne işe yarar

Okul yılın başında ya da hesapları açtıktan sonra her öğrenciye kendi giriş bilgisini vermelidir; kâğıdını kaybeden de olur. Bu iş
seçilen öğrencilerin şifrelerini yeniler ve her öğrenci için bir kâğıt hazırlar: okulun giriş adresi, kullanıcı adı, şifre ve veliye
veli kodu. Şifreleri sunucu üretir ve yalnız özetlerini saklar; liste bir kez gösterilir, bir daha üretilemez. Varsayılan olarak yalnız
**henüz giriş yapmamış** öğrenciler seçilir, böylece kendi şifresiyle giren öğrencinin şifresi yanlışlıkla değişmez.

## Nereden açılır

- **Öğrenciler** sayfasının üstündeki **"Giriş bilgisi dağıt"** ([Öğrenciler listesi](ogrenci-listesi.md)). Düğme "Öğrenci şifresi
  sıfırlar" yetkisi olana ve okulda en az bir öğrenci varsa görünür.
- Excel'le hesap açınca aktarım sonucunda **"Giriş kâğıtlarını yazdır"** aynı kâğıdı verir ([İçe aktarım](../excel-aktarim/ice-aktarim.md)).
- Tasarımda: Excel aktarımıyla toplu hesap açılınca **"Şifre listesi"** penceresi kendiliğinden açılır.

## Adım adım

### Müdür

1. **Öğrenciler → "Giriş bilgisi dağıt"**. Pencerenin adı **"Giriş bilgisi dağıt"**.
2. **"Kimler için"** açılır listesinden **"Bütün okul"** ya da bir sınıf seç.
3. **"Yalnızca henüz giriş yapmamış öğrenciler"** kutusu işaretli gelir. Kaldırırsan giriş yapmış öğrenciler de seçilir.
4. Sayaç seçime göre değişir: **"28 öğrencinin şifresi yenilenecek."**; kimse yoksa **"Bu seçimde henüz giriş yapmamış öğrenci
   yok."** ya da **"Bu seçimde öğrenci yok."**
5. Sarı uyarıyı oku: **"Seçilen öğrencilerin şifreleri yenilenir, açık oturumları kapanır. Liste yalnızca bir kez gösterilir: Excel
   olarak indir ya da yazdır, sonra pencereyi kapat."**
6. **"Şifreleri yenile ve listeyi hazırla"**ya bas ("Hazırlanıyor..."). Kutuyu kaldırdıysan önce tarayıcı sorar: **"Giriş yapmış
   öğrencilerin de şifresi değişecek; kendi belirledikleri şifre çalışmaz olur. Devam edilsin mi?"** Vazgeçmek için **"Vazgeç"**.
7. **"Giriş bilgileri"** penceresi:
   - yeşil **"28 öğrenci için yeni giriş bilgisi hazır (7-A)."** (bütün okulsa "(Bütün okul)");
   - **"Bu liste bir daha gösterilmez. Öğrenciye kendi satırını ver; veli kodu velinin çocuğunu hesabına eklemesi içindir."**
   - tablo: **"Öğrenci"**, **"Sınıf"**, **"Kullanıcı adı"**, **"Şifre"**, **"Veli kodu"** (sınıf, sonra ad sırasıyla);
   - düğmeler **"Kapat"**, **"Excel indir"**, **"Yazdır / PDF"**.
8. **"Excel indir"**: `giris-bilgileri-7-A.xlsx` (bütün okulda `giris-bilgileri-Bütün-okul.xlsx`) iner; "Giriş bilgileri" sayfasında
   **"Ad Soyad"**, **"Sınıf"**, **"Kullanıcı adı"**, **"Şifre"**, **"Veli kodu"** sütunları.
9. **"Yazdır / PDF"**: tarayıcının yazdırma penceresi açılır; her öğrenci için kesilip verilecek bir kâğıt basılır (tarayıcının "PDF
   olarak kaydet"i aynı çıktıyı dosyaya verir). Her kâğıtta:
   - üstte **"Eğitim Evi"** ve okulun adı; öğrencinin adı ve sınıfı;
   - **"Giriş adresi"** (okulun adresi, ör. `https://egitimevi.org/school/test-ortaokulu`), **"Kullanıcı adı"**, **"Şifre"**
     (Excel aktarımında şifresi T.C. no olan hesapta şifre yerine "T.C. kimlik numaran");
   - **"İlk girişte kendi şifreni belirleyeceksin. Şifreni kimseyle paylaşma."**
   - veli kodu varsa **"Veli için:"** satırı: "https://egitimevi.org adresinden kendi hesabınızı açın (Kayıt ol). Girişten sonra sağ üstteki **+ Ekle >
     Veli** ekranına bu **veli kodunu** yazın: `Ab3#-kQx9-+mPt-7?zR` (büyük/küçük harf fark eder)".
10. **"Kapat"**: listeyi indirmeden ya da yazdırmadan kapatırsan sorar: **"Listeyi indirmedin ya da yazdırmadın. Kapatırsan bu
    şifreler bir daha gösterilmez. Kapatılsın mı?"** Kapanınca liste bellekten silinir ve Öğrenciler sayfasına dönersin.
11. Liste ekrandayken pencerenin dışına tıklamak onu kapatmaz. İndirmeden geri tuşuna basarsan, menüden başka sayfaya, başka portala
    geçersen, çıkış yaparsan, sayfayı yenilersen ya da sekmeyi kapatırsan önce sorar: **"Giriş bilgileri listesini indirmedin ya da
    yazdırmadın. Ayrılırsan bu şifreler bir daha gösterilmez. Ayrılınsın mı?"** "İptal" dersen liste yerinde kalır.
12. Kâğıdını kaybeden öğrenci için yeniden dağıt: yeni şifreyle hiç girmemiş öğrenci "henüz giriş yapmamış" sayılmaya devam eder,
    varsayılan seçim onu yeniden yakalar.

Tasarımda (Tasarım 1 önizlemesi ve tanımlar):

- **Çift doğrulama:** toplu giriş bilgisi dağıtmak "önemli iş"tir; başlamadan o an 6 haneli kod istenir (kod 10 dakika geçerli,
  yalnız bu işe bağlı). Önizlemedeki **"Doğrulama kodu"** penceresi: **"… önemli bir iş. Başlamadan önce 6 haneli kodu yaz."**,
  **"E-posta"** / **"Doğrulama uygulaması"** seçimi, **"Kod … adresine gönderildi."** ya da **"Telefonundaki doğrulama uygulamasında
  Eğitim Evi için görünen 6 haneli kodu yaz."**, altı kutu, **"Kodu yeniden gönder (60 sn)"**, **"Kod 10 dakika geçerli ve yalnız bu
  iş için kullanılır."**, düğmeler **"Vazgeç"** ("Vazgeçildi; hiçbir şey değişmedi.") ve **"Doğrula ve devam et"**. Hatalar: **"Kodun
  6 hanesini de yaz."**, **"Kod yanlış. E-postadaki son kodu yaz."**, **"Çok fazla yanlış deneme; yeni kod iste."**; e-postası olmayan
  hesapta **"E-postan eklenmemiş; kod e-postayla gönderilemez."** ([Çift doğrulama](../egitim-yili/cift-dogrulama.md)).
  Önizlemede "Giriş bilgisi dağıt" olmadığı için bu pencere Excel'le toplu hesap açarken çıkar ("Öğrenci hesaplarını açmak ve giriş
  bilgilerini dağıtmak önemli bir iş."). Tanımla küçük fark: tanımda kod e-postaya gider (doğrulama uygulaması yalnız panel
  rollerinde) ve e-postası olmayan hesap bu işi hiç yapamaz; önizleme müdüre de "Doğrulama uygulaması" seçeneği sunuyor.
- **"Şifre listesi · 24 hesap"** penceresi (Excel'le öğrenci ya da servisçi hesabı açınca; kullanıcının 30 Eylül isteği: liste
  açıkken geri tuşu "indirmedin" diye sormadan kapatıyordu):
  - sarı kutu **"Bu şifreler yalnız şimdi gösteriliyor."** ve **"Listeyi indir ya da yazdır; pencere kapanınca liste bir daha
    açılmaz. Öğrenciler ilk girişte kendi şifrelerini belirler."** (eşlenen öğrenci varsa **"Eşlenen öğrenciler önceki kullanıcı adı
    ve şifreleriyle girer."**);
  - tablo **"Sınıf"** (servisçide **"Servis"**), **"Ad soyad"**, **"Kullanıcı adı"**, **"Geçici şifre"**; eşlenen öğrencide "mevcut
    hesabıyla girer" ve "gösterilmez";
  - **"Giriş adresi: egitimevi.org/school/test-ortaokulu"**;
  - durum satırı **"Liste henüz indirilmedi."** → indirince **"Liste indirildi; pencereyi kapatabilirsin."**;
  - düğmeler **"Yazdır / PDF"**, **"Excel indir (.xlsx)"** (`sifre-listesi-ogrenciler.xlsx`), **"Bitti"**; yazdırılan sayfanın
    başlığı "Test Ortaokulu · şifre listesi" ve altında "Giriş adresi: … · ilk girişte kendi şifreni belirle.";
  - indirmeden **"Bitti"**, ×, Esc, perdeye basma ya da geri tuşu: **"Listeyi indirmedin, kapatılsın mı?"** — **"Şifreler bir daha
    görülemez; gerekirse her öğrenciye Öğrenciler sayfasından yeni şifre verirsin."** — **"Kapat"**;
  - işlem kaydına "… şifre listesini indirdi" / "… şifre listesini yazdırdı" ve hesap sayısı.
- Önizlemede "Giriş bilgisi dağıt" düğmesi gösterilmiyor; kaldıran bir karar yok, bugünkü iş sürer.
- Okulun verdiği her şifre ilk girişte değişeceği için (güvenlik denetimi) kâğıttaki "İlk girişte kendi şifreni belirleyeceksin."
  her durumda doğru olur.

### Çalışan (ek rolü olan öğretmen)

Rolünde **"Öğrenci şifresi sıfırlar"** varsa dağıtırsın; ama düğme yalnız öğrenci listesi sana görünüyorsa çıkar (liste "Öğrenci
bilgilerini düzenler" ya da "Öğrenci portalına girer" ister). Rolünde "Öğrenci bilgilerini düzenler" yoksa tabloda, Excel'de ve
kâğıtta veli kodu boş kalır, kâğıtta "Veli için" bölümü çıkmaz. Sınıf listesi "Sınıf açar ve siler" yetkisiyle gelir; yoksa yalnız
"Bütün okul" seçilebilir (okul 600 öğrenciyi geçiyorsa dağıtamazsın: "Sınıf sınıf dağıt.").

### Öğrenci

1. Okul sana kâğıdını verir: giriş adresi, kullanıcı adı, şifre.
2. Bildirim gelir: **"Giriş bilgilerin okul yönetimi tarafından yenilendi. Şifreni Ayarlar sayfasından değiştirebilirsin."**
   (Ayarlar'a götürür). Eski şifren çalışmaz, açık oturumların kapanır.
3. Okulun adresinden gir; ilk girişte kendi şifreni belirlersin ([Zorunlu şifre belirleme](../giris-hesap/zorunlu-sifre-belirleme.md)).
4. Kâğıttaki "Veli için" bölümünü velinle paylaş.

### Veli

1. Çocuğunun kâğıdındaki **"Veli için:"** satırındaki adımları izle: kendi hesabını aç, **"+ Ekle → Veli"**ye veli kodunu yaz
   ([Veli kodu](veli-kodu.md)).
2. Bağlı velisiysen çocuğuna giden bildirimin kopyası sana da gelir: **"Elif Yılmaz · Giriş bilgilerin okul yönetimi tarafından
   yenilendi. Şifreni Ayarlar sayfasından değiştirebilirsin."**

## Kurallar ve sınırlar

- **Yetki:** "Öğrenci şifresi sıfırlar" (müdürde hep); yoksa **"Bu işlem için yetkin yok"**. Onaysız istek: **"Şifreler yenilenecek;
  onaylaman gerekiyor."** Başka okulun sınıfı: **"Sınıf bulunamadı"**.
- **Kimse seçilmezse:** **"Seçilen kapsamda henüz giriş yapmamış öğrenci yok."** / **"Seçilen kapsamda öğrenci yok."**
- **Sınırlar:** tek seferde en çok 600 öğrenci (**"Tek seferde en fazla 600 öğrenci. Sınıf sınıf dağıt."**); okul başına saatte 30
  dağıtım (**"Bu saat içinde çok fazla toplu dağıtım yapıldı. Biraz sonra dene."**).
- **Şifreler:** sunucuda güçlü rastgele üretilir; 10 karakter (8 harf ve 2 rakam), karışan harfler ve rakamlar (I, O, l, o, 0, 1)
  yok; her öğrenciye ayrı ayrı rastgele üretilir. Veritabanına yalnız özetleri yazılır.
- **Ne olur:** seçilenlerin şifresi yenilenir, "giriş yaptı" bilgisi silinir (yeni şifreyle girene kadar "henüz giriş yapmamış"
  sayılır), ilk girişte kendi şifresini belirlemesi zorunlu olur, açık oturumları ve telefon cihaz anahtarları kapanır, eski şifreye
  yapılan hatalı denemelerin kilidi kalkar.
- **Liste bir kez gösterilir:** cevap tarayıcıda önbelleğe alınmaz, adrese, günlüğe ya da tarayıcının kalıcı belleğine yazılmaz;
  pencere kapanınca bellekten de silinir. Kaybolursa aynı öğrenciler için yeniden dağıtılır (yeni şifreler, eskiler geçersiz).
- **Veli kodu** yalnız "Öğrenci bilgilerini düzenler" yetkisi olana gönderilir; tireli 4'erli biçimde.
- **İz:** işlem kaydına **"Toplu giriş bilgisi dağıtıldı (şifreler yenilendi)"** ve "7-A: 28 öğrenci"
  ([Neler kaydedilir](../islem-kaydi/neler-kaydedilir.md)); her öğrenciye bildirim, velisine kopyası.
- **Bilinen küçük sorunlar (kod okumasına göre):**
  - **"Yazdır / PDF"e basmak "indirildi" sayılır:** yazdırma penceresinde vazgeçsen de "Kapat" artık sormaz.
  - **Sayaç tahmindir:** sunucu sonuç sayısı sayaçtan az olabilir. Listeyi yalnız portal yetkisiyle (dar) görüyorsan sayaç giriş
    yapmışları da "girmemiş" sayar.
  - **Kâğıttaki "İlk girişte kendi şifreni belirleyeceksin."** bu dağıtımda doğrudur; Excel aktarımıyla açılıp şifresi dosyada
    verilen hesapta bugün doğru değildir (o hesapta değiştirme zorunlu değil). Güvenlik denetimiyle düzelecek.
  - **Ekran yolu:** müdür bir role yalnız "Öğrenci şifresi sıfırlar" verirse o kişide düğme hiç çıkmaz (menü satırı da açılmaz).
  - Bazı telefon tarayıcıları sekme kapanırken soru kutusunu göstermez; oturum süresi dolup sessiz çıkış olursa soru çıkmaz (liste
    yine bellekten silinir).

## Kardeşler ve ilgili

**Kardeşler:** [Şifre işlemleri](sifre-islemleri.md) (tek öğrencinin şifresi) · [Öğrenci hesabı açma](ogrenci-hesabi-acma.md) ·
[Veli kodu](veli-kodu.md) · [Öğrenciler listesi](ogrenci-listesi.md).

**İlgili:** [İçe aktarım](../excel-aktarim/ice-aktarim.md) ("Giriş kâğıtlarını yazdır"), [Eşleştirme](../excel-aktarim/eslestirme.md),
[Çift doğrulama](../egitim-yili/cift-dogrulama.md), [Zorunlu şifre belirleme](../giris-hesap/zorunlu-sifre-belirleme.md),
[Okulun sayfasından giriş](../giris-hesap/okulun-sayfasindan-giris.md), [Hatalı giriş ve kilit](../giris-hesap/hatali-giris-ve-kilit.md),
[Velinin bildirimleri](../bildirim/velinin-bildirimleri.md), [Servisçi hesabı](../servis/servisci-hesabi.md) (servisçi şifre listesi),
[Geri tuşu](../uygulama/geri-tusu.md), [Neler kaydedilir](../islem-kaydi/neler-kaydedilir.md).

## Kod tarafı

- Ön yüz: [public/js/parcalar/10a-giris-bilgisi.md](../../public/js/parcalar/10a-giris-bilgisi.md) — `girisBilgisiAc` (seçim ve
  sayaç), `giris-bilgisi-uret`, `girisSonucGoster`, `giris-bilgisi-excel`, `girisMektuplariYazdir` (kâğıt), `giris-bilgisi-kapat`,
  `TEK_SEFER.girisListesi`; [public/js/parcalar/03-mesaj-modal.md](../../public/js/parcalar/03-mesaj-modal.md) — `TEK_SEFER`;
  [public/js/parcalar/15-aktarim.md](../../public/js/parcalar/15-aktarim.md) — "Giriş kâğıtlarını yazdır";
  [public/js/parcalar/10-mudur.md](../../public/js/parcalar/10-mudur.md) — düğmenin şartı.
- Sunucu: [sunucu/bolumler/okul.md](../../sunucu/bolumler/okul.md) — `POST /api/school/giris-bilgisi`, `rastgeleSifre`;
  [sunucu/veri/depo/kullanicilar.md](../../sunucu/veri/depo/kullanicilar.md) — `topluSifreYaz`;
  [sunucu/veri/depo/genel.md](../../sunucu/veri/depo/genel.md) — `cokluBildir` ve velinin kopyası.
- Testler: [testler/test-giris-bilgisi.md](../../testler/test-giris-bilgisi.md) (yetki, onay, başka okulun sınıfı, `no-store`,
  varsayılan seçim, şifrelerin farklı ve okunaklı olması, veli kodu biçimi, Excel, eski şifrenin çalışmaması, ilk girişte şifre,
  bildirim, oturumların kapanması, işlem kaydı), [testler/test-aktarim.md](../../testler/test-aktarim.md) (T.C. ile girecek hesapta
  kâğıtta "T.C. kimlik numaran").

## Sık sorulanlar

- **Listeyi kapattım, şifreleri tekrar görebilir miyim?** Hayır. Aynı öğrenciler için yeniden dağıt (yeni şifreler üretilir).
- **Kendi şifresini koymuş öğrencinin şifresi de değişir mi?** Varsayılan seçimde hayır; yalnız henüz giriş yapmamış öğrenciler
  seçilir.
- **Kâğıtta şifre yerine "T.C. kimlik numaran" yazıyor.** Excel aktarımında şifresi T.C. no olarak açılan hesaplarda kâğıt böyle der.
- **PDF nasıl alırım?** "Yazdır / PDF"e bas, yazdırma penceresinde hedefi "PDF olarak kaydet" seç.
- **Velilere de bilgi gider mi?** Bağlı velilere bildirimin kopyası gider; kâğıttaki "Veli için" bölümü veli kodunu verir.

## Sırada

- Önemli işlerde çift doğrulama: toplu giriş bilgisi dağıtmadan önce 6 haneli kod (yıl geçişi işi).
- Güvenlik denetimi: okulun verdiği her şifrenin ilk girişte değişmesi (kâğıt metni her durumda doğru olur).
- Tasarım 1'deki "Şifre listesi" penceresi (Excel'le toplu açma sonrası).
- Çok dil (pencere ve kâğıt metinleri), Android'de aynı uyarılar.
