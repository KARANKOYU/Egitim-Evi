# Öğrenci hesapları · Öğrenci hesabı açma

**Durum:** Kodda var; tasarımda ek olarak kullanıcı adı önerisi ("ad.soyad") ve canlı denetimi, hazır üretilmiş şifre (göster/gizle,
"Yeniden üret"), "Ekle ve yenisini aç" ile arka arkaya ekleme, zorunlu okul no ve sıradaki numara önerisi, T.C. ve doğum tarihi
tutunca yeni hesap yerine eşleme.

Okulun bir öğrenciye Eğitim Evi hesabı açtığı "Öğrenci ekle" penceresi ve hesabı açılınca bir kez gösterilen giriş bilgileri.

## Ne işe yarar

Öğrenci siteye kendisi kaydolmaz; hesabını okul açar (kullanıcı 29 Ağustos: "müdür kendi blank öğrenci hesabı oluşturabilsin sadece
şifre kullanıcı adı ad soyad vb ile istediği kadar"). En az bilgiyle açılır: ad, soyad ve T.C. kimlik no yeter. Kullanıcı adı ve şifre
boş bırakılırsa ikisi de T.C. no olur; öğrenci okulun adresinden bununla girer ve ilk girişte kendi şifresini belirlemeden devam
edemez. Hesapla birlikte öğrencinin **veli kodu** da üretilir ([Veli kodu](veli-kodu.md)); velisi çocuğunu bu kodla ekler.

Çok öğrenci için Excel'le toplu açma vardır ([İçe aktarım](../excel-aktarim/ice-aktarim.md)); bu belge tek tek açmayı anlatır.

## Nereden açılır

- **Öğrenciler** sayfası → **"Öğrenci ekle"** ([Öğrenciler listesi](ogrenci-listesi.md)). Düğme yalnız "Öğrenci hesabı açar ve okula
  öğrenci ekler" yetkisi olana (müdürde hep) görünür.
- "Hesap açıldı" penceresindeki **"Bir tane daha aç"** aynı pencereyi boş olarak yeniden açar.
- Tasarımda (Tasarım 1 önizlemesi): Öğrenciler sayfasının sağ üstündeki **"Öğrenci ekle"**; sınıf sayfasından açılınca o sınıf seçili
  gelir.

## Adım adım

### Müdür

1. **Öğrenciler → "Öğrenci ekle"**. Pencerenin adı **"Yeni öğrenci hesabı"**; imleç Ad kutusundadır.
2. Alanları doldur (sırayla):
   - **"Ad"** ve **"Soyad"** yan yana (ad en çok 60, soyad en çok 40 karakter).
   - **"T.C. kimlik no"** — yer tutucu "11 haneli"; kutu yalnız rakam alır, 11 hanede durur. Altında: **"Yalnızca okul yönetimi
     görür; öğretmenler ve öğrenciler görmez."**
   - **"Kullanıcı adı"** — yer tutucu **"Boş bırakırsan T.C. no olur"**; altında **"Harfle başlar; harf, rakam, nokta ve alt çizgi.
     Okulun içinde tek olmalı."** Yazarken küçük harfe döner, "İ" "i" olur, boşluk noktaya döner.
   - **"Şifre"** — düz metin kutusu (yazdığın görünür), yer tutucu **"Boş bırakırsan T.C. no olur"**; altında **"Boşsa şifre T.C.
     kimlik no olur ve kişi ilk girişte kendi şifresini belirlemeden devam edemez."**
   - **"E-posta (isteğe bağlı)"** — altında **"Yazılırsa giriş kodu ve şifre sıfırlama bağlantısı oraya gider."**
   - **"Doğum tarihi (isteğe bağlı)"** — gün, ay, yıl açılır listeleri (yıl listesi bu yıldan 3 yıl öncesinden başlar). Altında:
     **"Başka okuldan gelen öğrencide gerekli: T.C. no ile doğum tarihi önceki kaydıyla eşleşirse yeni hesap açılmaz, öğrencinin
     hesabı okuluna taşınır."**
   - **"Sınıf"** — ilk seçenek **"— sınıfsız —"**, sonra okulun sınıfları; yanında **"Okul no (isteğe bağlı)"** (en çok 20).
   - **"Adres (isteğe bağlı)"** (en çok 200).
   - **"Yönetim notu (isteğe bağlı)"** (en çok 300) — altında **"Yalnızca okul yönetimi görür."**
3. **"Hesabı aç"**a bas (düğme "Açılıyor..." olur). Yanlış ya da eksik bir şey varsa sunucuya gitmeden ilgili kutunun altında yazar
   ve pencere ilk hatalı kutuya kayar (iletiler aşağıda, "Kurallar ve sınırlar").
4. Yazdığın T.C. başka bir okulda kayıtlı bir öğrencininse yeni hesap açılmaz; doğum tarihi istenir ve tutarsa hesap okuluna taşınır
   ([Öğrenci nakli](ogrenci-nakli.md)).
5. Hesap açılınca **"Hesap açıldı"** penceresi:
   - yeşil ileti: **"Elif Yılmaz hesabı açıldı."** — şifreyi boş bıraktıysan (ya da T.C. no'nun aynısını yazdıysan) sonuna
     **"Kullanıcı adı ve şifre T.C. kimlik no; ilk girişte kendi şifresini belirleyecek."** eklenir. Bu ek yalnız şifreye bakar:
     kullanıcı adını kendin yazmış olsan da aynı cümle çıkar; doğru kullanıcı adı hemen altındaki satırdadır;
   - **"Kullanıcı adı"** ve yanında **"Kopyala"**;
   - **"Şifre"**: boş bıraktıysan **"T.C. kimlik numarası"** ve **"İlk girişte kendi şifresini belirleyecek."**; yazdıysan şifrenin
     kendisi ve **"Kopyala"**;
   - okulun adresi seçilmişse **"Giriş adresi"** (ör. `egitimevi.org/school/test-ortaokulu`);
   - **"Veli kodu (veli çocuğunu bununla ekler)"**: 4'erli tireli kod ve **"Kopyala"**;
   - şifre yazdıysan en altta **"Bu şifre bir daha gösterilemez; şimdi kişiye ilet."**
6. "Kopyala"ya basınca düğme kısa süre **"Kopyalandı"** der (kopyalanamazsa **"Kopyalanamadı"**).
7. **"Tamam"**: pencere kapanır, liste yenilenir, yeni öğrenci listede görünür. **"Bir tane daha aç"**: boş pencere yeniden açılır.
8. Şifreyi kendin yazdıysan, şifre ekrandayken pencerenin dışına tıklamak onu kapatmaz; geri tuşu, menüden başka sayfa, çıkış ya da
   sekmeyi kapatma önce sorar: **"Yeni şifre ekranda ve bir daha gösterilmeyecek. Kişiye ilettiysen ayrılabilirsin. Ayrılınsın
   mı?"** "Tamam" ve "Bir tane daha aç" sormaz.

Tasarımda (Tasarım 1 önizlemesi) pencerenin adı **"Öğrenci ekle"** ve düzeni şöyledir:

- **"Ad"**, **"Soyad"**.
- **"Kullanıcı adı"** — ad ve soyadı yazdıkça kendiliğinden **"ad.soyad"** önerisiyle dolar (Türkçe harfler sadeleşir; ad alınmışsa
  sonuna 2, 3 … eklenir); elle değiştirebilirsin. Yanında canlı durum: **"Kullanılabilir"** ya da sorun — **"3–20 karakter; küçük harf
  (Türkçe harf olmadan), rakam ve nokta."**, **"Nokta başta, sonda ya da yan yana olamaz."**, **"Bu kullanıcı adı alınmış."**
- **"Şifre"** — hazır üretilmiş, okunması kolay bir şifreyle gelir; kutunun içinde göz düğmesi ("Şifreyi gizle") ve yanında
  **"Yeniden üret"**.
- **"İlk girişte kendi şifresini belirlesin"** kutusu (işaretli gelir).
- **"T.C. kimlik no"** (yalnız rakam, 11 hane), **"Doğum tarihi"** (takvimden).
- **"Sınıf"** açılır listesi ve yanında **"Okul no"**: sınıfı seçince o sınıfın sıradaki boş numarası kendiliğinden yazılır (en çok
  5 rakam).
- Altta düğmeler: **"Kapat"**, **"Ekle ve yenisini aç"**, **"Ekle"**.
- **"Ekle ve yenisini aç"**: öğrenci eklenir, pencere boşalır, sınıf seçili kalır; üstte yeşil kutu **"Elif Yılmaz eklendi (7-A)"** ve
  altında "Kullanıcı adı … · şifre …"; pencerenin altında **"Bu pencerede eklenenler · 3"** listesi (her satırda ad, sınıf,
  kullanıcı adı ve şifre); ekranın altında "Elif Yılmaz eklendi; sıradakini yaz."
- **"Ekle"**: **"Öğrenci hesabı açıldı"** penceresi — yeşil kutuda ad ve "7-A · okul no 214"; **"Kullanıcı adı:"**, **"Şifre:"**,
  **"Giriş yeri:"** egitimevi.org/school/test-ortaokulu; not: **"Öğrenci ilk girişte kendi şifresini belirler. O zamana kadar
  şifreyi Öğrenciler sayfasında öğrencinin penceresinden görebilirsin."** (kutu boşsa **"Şifreyi öğrenciye ver; Öğrenciler sayfasında
  öğrencinin penceresinden de görebilirsin."**); düğmeler **"Kapat"**, **"Yeni öğrenci ekle"**.
- T.C. Eğitim Evi'nde kayıtlı bir hesaptaysa ve doğum tarihi tutarsa yeni hesap açılmaz, öğrenci **eşlenir** ("Öğrenci eşlendi";
  ayrıntısı [Öğrenci nakli](ogrenci-nakli.md)).
- İşlem kaydına "… öğrenci hesabı açtı" ve "Elif Yılmaz · 7-A · elif.yilmaz" yazılır.
- Kullanıcının 2 Ekim kararıyla T.C. kutusu yazarken denetlenir: 11. hane girilince hemen geçerli/geçersiz yazar, geçerliyse yeşil
  işaret çıkar.
- Önizlemenin bu penceresinde e-posta, adres ve yönetim notu kutuları yok; bunları kaldıran bir karar da yok (bugün Hesap
  penceresinde sonradan girilebiliyor — [Hesap penceresi](hesap-penceresi.md)).

### Çalışan (ek rolü olan öğretmen)

Rolünde **"Öğrenci hesabı açar ve okula öğrenci ekler"** varsa aynı pencereyi kullanırsın (hazır **Müdür Yardımcısı** şablonunda
var). İki ayrıntı:

- **Sınıf seçmek** ayrıca **"Öğrenciyi sınıfa yerleştirir"** yetkisi ister; bu yetki rolünde belirli sınıflarla daraltıldıysa
  yalnız o sınıfları seçebilirsin. Yetki yoksa öğrenciyi "— sınıfsız —" açarsın: **"Öğrenciyi bu sınıfa yerleştirme yetkin yok"**.
- Sınıf listesi **"Sınıf açar ve siler"** yetkisiyle gelir. Bu yetki yoksa açılır listede yalnız "— sınıfsız —" vardır.

Tasarımda öğretmen olmayan çalışan da (önerilen "Okul Sekreteri" şablonu gibi) rolündeki yetkiyle öğrenci ekler; rolsüz çalışan
ekleyemez ([Rolsüz çalışan](../ogretmenler-calisanlar/rolsuz-calisan.md)).

### Öğrenci

1. Okul kullanıcı adını, şifreni (ya da "şifren T.C. kimlik numaran" bilgisini) ve okulun adresini verir (çoğu zaman giriş
   kâğıdıyla — [Toplu giriş bilgisi](toplu-giris-bilgisi.md)).
2. Okulun adresinden gir ([Okulun sayfasından giriş](../giris-hesap/okulun-sayfasindan-giris.md)).
3. Şifren T.C. no ise girer girmez kendi şifreni belirlersin ([Zorunlu şifre belirleme](../giris-hesap/zorunlu-sifre-belirleme.md)).
4. Veli kodunu **Ayarlar**'da görürsün, velinle paylaşırsın ([Veli kodu](veli-kodu.md)).

### Veli

Hesabı açılan çocuğun için yapacağın bir şey yoktur; okulun verdiği **veli koduyla** çocuğunu kendi hesabına eklersin
([Veli kodu](veli-kodu.md), [Çocuklarım](../portallar/cocuklarim.md)).

## Kurallar ve sınırlar

- **Yetki:** "Öğrenci hesabı açar ve okula öğrenci ekler"; yoksa sunucu **"Bu işlem için yetkin yok"** der. Öğrenci, veli,
  servisçi hesap açamaz.
- **Zorunlu:** ad, soyad, T.C. kimlik no. Ön yüzün iletileri: **"Adı yaz."**, **"Soyadı yaz."**, **"T.C. kimlik no gerekli."**
- **T.C. kimlik no:** 11 hane, 0'la başlamaz, son iki hane hesapla tutmalı — **"T.C. kimlik numarası 11 haneli olmalı ve 0 ile
  başlamamalı."**, **"T.C. kimlik numarası geçersiz, rakamları kontrol et."** Okulda tektir: **"Bu T.C. kimlik no okulda başka bir
  hesapta kayıtlı"**. Öğrencinin T.C.'si bütün sistemde tektir (hesap kişiye aittir); başka okuldaki öğrenci yalnız nakille gelir.
- **Kullanıcı adı:** boşsa T.C. no olur. Yazılırsa 3–30 karakter, harfle başlar, yalnız İngilizce harf, rakam, nokta, alt çizgi:
  **"Kullanıcı adı en az 3 karakter olmalı."**, **"Kullanıcı adı en fazla 30 karakter olabilir."**, **"Kullanıcı adında Türkçe harf
  kullanma (ç yerine c, ş yerine s gibi)."**, **"Kullanıcı adı bir harfle başlamalı."**, **"Kullanıcı adında yalnızca harf, rakam,
  nokta ve alt çizgi olabilir."** Yalnız rakamdan oluşan ad ancak kişinin kendi T.C.'si olabilir: **"Rakamlardan oluşan kullanıcı adı
  yalnızca kişinin T.C. no'su olabilir."** Okulun içinde tektir: **"Bu kullanıcı adı okulda alınmış"** (başka okulda aynı ad
  olabilir). Tasarımda (kullanıcının 29 Eylül kararı) kullanıcı adı site genelinde tek olur ve yalnız rakamdan oluşan kullanıcı adı
  (T.C.) hiçbir listede gösterilmez.
- **Şifre:** boşsa T.C. no olur ve öğrenci ilk girişte kendi şifresini belirlemek zorundadır. Yazılırsa en az 8 karakter, en az bir
  harf ve bir rakam: **"Şifre en az 8 karakter olmalı."**, **"Şifre en az bir harf ve bir rakam içermeli."** Yazılan şifre T.C.
  ile aynıysa o da "varsayılan" sayılır. Bugün kendi yazdığın şifrede öğrencinin ilk girişte değiştirmesi zorunlu değildir.
- **Şifre bir kez görünür:** sunucu şifrenin yalnız geri döndürülemez özetini saklar; "Hesap açıldı" penceresindeki şifre senin
  yazdığındır. Pencere kapanınca bir daha gösterilmez; unutulursa yenisi verilir ([Şifre işlemleri](sifre-islemleri.md)).
- **E-posta:** isteğe bağlı; bütün sistemde tektir — **"Bu e-posta başka bir hesapta kayıtlı"**. Biçim: **"E-posta adresi eksik ya
  da hatalı görünüyor."** (ön yüz), **"E-posta adresinde Türkçe ya da başka alfabeden harf olamaz (ı, ş, ğ, ü, ö, ç gibi); İngilizce
  harflerle yaz."**, **"Geçerli bir e-posta adresi gir."** (sunucu).
- **Doğum tarihi:** isteğe bağlı ama üçü birlikte: **"Gün, ay ve yılın üçünü de seç ya da hepsini boş bırak."**; **"Doğum tarihi
  gelecekte olamaz"**, **"Doğum tarihi çok eski"**. Yıl listesinin 3 yıl öncesinden başlaması bir kural değil, seçicinin aralığıdır
  (kullanıcı "yaş şeyi olmasın" dedi; bu satırın kalıp kalmayacağı kendisine soruldu).
- **Okul no:** isteğe bağlı; okulda tektir — **"Bu okul numarası başka bir öğrencide"**.
- **Sınıf:** **"Öğrenciyi bu sınıfa yerleştirme yetkin yok"**, **"Sınıf bulunamadı"** (başka okulun sınıfı).
- **Sunucunun hataları** ilgili kutunun altına yazılır; birden çok sorun varsa hepsi "; " ile birleşip ilk sorunun kutusunun altında
  durur.
- **Hız sınırı:** kişi başına saatte 120 hesap — **"Bu saat içinde çok fazla hesap açtın. Excel ile toplu açabilirsin."**
- **Aynı anda iki açma:** iki kişi aynı T.C. ya da kullanıcı adıyla aynı anda hesap açarsa veritabanı ikincisini durdurur; ileti
  hangi alanın çakıştığını söyler.
- **İşlem kaydı:** **"Hesap açıldı"** — "Elif Yılmaz (öğrenci)" ([Neler kaydedilir](../islem-kaydi/neler-kaydedilir.md)). Öğrenciye
  ya da veliye bildirim gitmez.
- **Öğretmen hesabı bu pencereden açılmaz:** öğretmen kendi hesabını açar, okul onu kişi koduyla ekler
  ([Kodla ekleme](../ogretmenler-calisanlar/kodla-ekleme.md)). Servisçi hesabı aynı pencerenin servisçi biçimiyle Servisler sayfasından
  açılır ([Servisçi hesabı](../servis/servisci-hesabi.md)).
- **Tasarımla çelişen nokta:** önizleme okulun verdiği şifreyi öğrenci kendi şifresini belirleyene kadar penceresinde gösteriyor;
  bugün şifre geri döndürülemez saklandığı için bu yapılamıyor. Nasıl saklanacağı tanımlarda yazılı değil (açık soru —
  [Şifre işlemleri](sifre-islemleri.md)).

## Kardeşler ve ilgili

**Kardeşler:** [Öğrenciler listesi](ogrenci-listesi.md) · [Hesap penceresi](hesap-penceresi.md) ·
[Şifre işlemleri](sifre-islemleri.md) · [Veli kodu](veli-kodu.md) · [Öğrenci nakli](ogrenci-nakli.md) ·
[Toplu giriş bilgisi](toplu-giris-bilgisi.md).

**İlgili:** [İçe aktarım](../excel-aktarim/ice-aktarim.md) ve [Eşleştirme](../excel-aktarim/eslestirme.md) (Excel'le toplu açma,
"Eşleyelim mi?"), [T.C. kimlik no](../giris-hesap/tc-kimlik-no.md), [Kullanıcı adı](../giris-hesap/kullanici-adi.md),
[Şifre kuralları](../giris-hesap/sifre-kurallari.md), [Zorunlu şifre belirleme](../giris-hesap/zorunlu-sifre-belirleme.md),
[Okulun sayfasından giriş](../giris-hesap/okulun-sayfasindan-giris.md), [Servisçi hesabı](../servis/servisci-hesabi.md),
[Öğrencide birden çok kurum](../portallar/ogrencide-portallar.md), [Yetki listesi](../roller-yetkiler/yetki-listesi.md),
[Kim neyi görür](../kvkk-ve-gizlilik/kim-neyi-gorur.md).

## Kod tarafı

- Ön yüz: [public/js/parcalar/10b-hesaplar.md](../../public/js/parcalar/10b-hesaplar.md) — `hesapAlanlari`, `hesapGovdesi`,
  `hesapDenetle`, `hesapTcBagla`, `hesapYeniModal`, `hesap-ac-kaydet`, "Hesap açıldı" penceresi, `hesapSifresiKorunsun`;
  [public/js/parcalar/03-mesaj-modal.md](../../public/js/parcalar/03-mesaj-modal.md) — `TEK_SEFER` (ayrılırken sorma);
  [public/js/parcalar/05-giris.md](../../public/js/parcalar/05-giris.md) — `tcSorunuTR`, `kullaniciAdiSorunuTR`, `sifreSorunuTR`,
  `kisiKoduKutusu`; [public/js/parcalar/04a-form-alanlari.md](../../public/js/parcalar/04a-form-alanlari.md) ve
  [public/js/parcalar/04e-tarih-secici.md](../../public/js/parcalar/04e-tarih-secici.md) — alan hataları, doğum tarihi seçicisi.
- Sunucu: [sunucu/bolumler/hesaplar.md](../../sunucu/bolumler/hesaplar.md) — `POST /api/school/hesap-ac`, `hesapDogrula`,
  `hesapNesnesi` (veli kodunun üretilmesi); [sunucu/bolumler/nakil.md](../../sunucu/bolumler/nakil.md) — başka okulun T.C.'si;
  [sunucu/ortak.md](../../sunucu/ortak.md) — `tcSorunu`, `kullaniciAdiSorunu`, `sifreSorunu`, `epostaSorunu`;
  [sunucu/veri/depo/kullanicilar.md](../../sunucu/veri/depo/kullanicilar.md) — `tcVarMi`, `kullaniciAdiVarMi`, `okulNoVarMi`,
  `yeniKisiKodu`.
- Testler: [testler/test-yonetim.md](../../testler/test-yonetim.md) (zorunlu alanlar, boş kullanıcı adı ve şifrenin T.C. olması, ilk
  girişte şifre zorunluluğu), [testler/test-cakisma.md](../../testler/test-cakisma.md) (aynı T.C. ve kullanıcı adı yarışta bile çift
  olmaz), [testler/test-giris-kayit.md](../../testler/test-giris-kayit.md) (öğretmen ve müdür hesabı açılamaz, T.C.'yi yalnız yönetim
  görür).

## Sık sorulanlar

- **Kullanıcı adını ve şifreyi boş bırakırsam ne olur?** İkisi de T.C. no olur; öğrenci ilk girişte kendi şifresini belirler.
- **Şifreyi öğrenciye vermeyi unuttum, tekrar görebilir miyim?** Hayır; Hesap penceresinden yeni şifre ver ([Şifre işlemleri](sifre-islemleri.md))
  ya da şifreyi T.C. no yap.
- **"Bu T.C. kimlik no okulda başka bir hesapta kayıtlı" diyor.** Öğrenci zaten okulunda; listede T.C. ile değil adıyla ara. Okulda
  aynı T.C. ile bir servisçi hesabı da olabilir.
- **Öğrenci başka okuldan geliyor.** "Öğrenci ekle"de doğum tarihini de seç; T.C. ile tutarsa hesabı taşınır
  ([Öğrenci nakli](ogrenci-nakli.md)).
- **Toplu açabilir miyim?** Evet: "Excel ile toplu" → [İçe aktarım](../excel-aktarim/ice-aktarim.md).

## Sırada

- Güvenlik denetimi: okulun verdiği her şifre (kendi yazdığın da) ilk girişte değişecek.
- Tek kişi tek hesap ve öğrencide portallar: T.C. ve doğum tarihi tutunca taşıma yerine eşleme, kullanıcı adının site genelinde tek
  olması.
- T.C. kimlik no her yerde zorunlu ve yazarken canlı denetim (kodu Linux'ta).
- Tasarım 1'deki "Öğrenci ekle" penceresi (kullanıcı adı önerisi, şifre üretme, arka arkaya ekleme, zorunlu okul no).
- Çalışan olarak ekleme (öğretmen olmayan çalışanın yetkiyle öğrenci eklemesi), çok dil.
