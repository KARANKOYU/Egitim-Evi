# Öğrenci hesapları · Veli kodu

**Durum:** Kodda var; tasarımda ek olarak öğrencinin Hesap ayarlarında ayrı **"Veli kodun"** bölümü ("Velin seni hesabına bu kodla
ekler. Kimseyle paylaşma."), velinin çocuğu eklerken "Yakınlığın" seçimi ve bağlamadan önce "Çocuğunu bağla" onay adımı.

Her öğrencinin hesabıyla birlikte üretilen 16 karakterlik kod: velisi bu kodu kendi hesabına yazınca çocuğu ona bağlanır.

## Ne işe yarar

Kimse başkasının çocuğunu adıyla ya da T.C.'siyle ekleyemez; çocuğu kendi hesabına eklemek için onun **veli kodunu** bilmek gerekir.
Kodu öğrenci kendi Ayarlar'ında görür, okul da giriş kâğıdına yazdırır. Kod kullanılınca değişmez: anne ve baba aynı kodla ayrı ayrı
ekleyebilir. Kod yanlış birine gittiyse okul yeniler; o zaman eski kod artık kimseyi bağlamaz, bağlanmış veliler bağlı kalır.

Veli kodu, yetişkinlerin **kişi kodu** ile aynı biçimdedir (öğrencininki "veli kodu" diye anılır); biçimin bütün ayrıntısı
[Kişi kodu](../portallar/kisi-kodu.md) belgesinde. Okulun veliyi kodsuz, T.C. ya da kullanıcı adıyla bağlaması ayrı bir yoldur:
[Veli bağlama](veli-baglama.md).

## Nereden açılır

Kodun **görüldüğü** yerler:

- **Öğrenci:** **Ayarlar** → "Hesap bilgilerin" kartında **"Veli kodun (velinle paylaş)"**, kod ve **"Kopyala"**. Öğrencinin ana
  sayfasındaki **"Ayarlar"** kutucuğunun altında **"Hesabın ve veli kodun"** yazar.
- **Okul (müdür ya da "Öğrenci bilgilerini düzenler" yetkisi olan):**
  - Öğrenciler listesinde her satırda **"veli kodu"** ve kod ([Öğrenciler listesi](ogrenci-listesi.md));
  - hesap açılınca **"Hesap açıldı"** penceresinde **"Veli kodu (veli çocuğunu bununla ekler)"** ([Öğrenci hesabı açma](ogrenci-hesabi-acma.md));
  - **"Hesap"** penceresinde **"Veli kodu"** bölümü, **"Kopyala"** ve **"Yeni kod üret"** ([Hesap penceresi](hesap-penceresi.md));
  - giriş bilgisi listesinde ve kâğıdında **"Veli kodu"** sütunu ve "Veli için" satırı ([Toplu giriş bilgisi](toplu-giris-bilgisi.md));
  - Excel aktarımının sonucunda ve dışarı aktarımda **"Öğrenci listesi ve veli kodları"** ([Dışarı aktarım](../excel-aktarim/disa-aktarim.md)).

Kodun **yazıldığı** yerler (veli): sağ üstteki **"+ Ekle" → "Veli"** paneli ve **Çocuklarım → "Çocuk ekle"** kutusu
([+ Ekle penceresi](../portallar/ekle-penceresi.md), [Çocuklarım](../portallar/cocuklarim.md)).

## Adım adım

### Öğrenci

1. **Ayarlar**'a gir. "Hesap bilgilerin" kartında **"Veli kodun (velinle paylaş)"** satırında kodun 4'erli, tireli durur
   (ör. `Ab3#-kQx9-+mPt-7?zR`). Altında: **"Velin bu kodu Eğitim Evi'nde + Ekle > Veli ekranına yazınca hesabına bağlanır.
   Büyük/küçük harf fark eder."**
2. **"Kopyala"**ya bas (düğme kısa süre "Kopyalandı" der) ve kodu yalnız velinle paylaş.
3. Velin seni eklediğinde bildirim gelir: **"Ayşe Yılmaz veli olarak hesabına bağlandı."**
4. Kodunu kendin yenileyemezsin; yanlış birine verdiysen okuluna söyle.

Tasarımda: Hesap ayarlarında ayrı bir bölüm, başlığı **"Veli kodun"**: kod, **"Kopyala"** ve **"Velin seni hesabına bu kodla ekler.
Kimseyle paylaşma."** Kopyalayınca ekranın altında "Veli kodun kopyalandı. Yalnız velinle paylaş." Profil menüsünde de aynı adla
durur ([Kişi kodu](../portallar/kisi-kodu.md)).

### Veli

1. Kendi Eğitim Evi hesabını aç (Kayıt ol) ve gir.
2. Sağ üstteki **"+ Ekle" → "Veli"** (ya da veliysen **Çocuklarım → "Çocuk ekle"**). Kutuya kodu yaz; tireler kendiliğinden gelir,
   tireli ya da boşluklu yapıştırmak da olur. **"Ekle"**.
3. Kod doğruysa onay beklenmez, çocuk hemen bağlanır. "+ Ekle → Veli" yolunda ileti **"Elif Yılmaz hesabına eklendi."** olur;
   yetişkin hesabındaysan yeni çocuğun portalı açılır, öğretmen ya da müdür olarak girmişsen iletiye **"Sol üstteki menüden veli
   olarak geçebilirsin."** eklenir. Çocuklarım'daki "Ekle" ayrı bir ileti göstermez; sayfa yenilenir, çocuğun kartı listeye gelir.
4. Hiç rolü olmayan yetişkin hesabı bu anda veli olur; velinin okulu yoksa çocuğun okulu onun da okulu sayılır (duyuru ve takvim için).

Tasarımda (Tasarım 1 önizlemesi): Çocuklarım'daki **"Veli koduyla çocuk ekle"** de "+ Ekle → Veli" ile aynı pencereyi açar, çocuk
eklemenin tek görünümü budur:

- **"Veli olarak çocuğunu ekle"**: **"Veli kodu:"** kutusu (yer tutucu `Ab3#-kQx9-+mPt-7?zR`; tireleri kutu kendisi koyar),
  **"Yakınlığın:"** seçimi (**"Annesi"**, **"Babası"**, **"Vasisi"**, **"Başka bir yakını"**) ve not **"Veli kodunu çocuğunun okulundan
  ya da çocuğunun Hesap ayarları → Veli kodun bölümünden alırsın. Büyük/küçük harfe dikkat et; tireleri kutu kendisi koyar."**;
  düğmeler **"Geri"**, **"Devam"**. Yanlış kodda **"Bu koda bağlı bir öğrenci bulunamadı. Kodu harf harf kontrol et; büyük/küçük harf
  önemli."**, bağlı çocukta **"Elif Yılmaz zaten hesabına bağlı."**
- **"Çocuğunu bağla"**: bulunan çocuğun kartı (ad, okul, okul kodu, sınıf ve okul no), seçtiğin yakınlık ve not **"Bağlanınca
  Elif Yılmaz için ayrı bir veli oturumun açılır (sol menüde Oturumlarım altında); Elif'e de bildirim gider."**; düğmeler **"Geri"**,
  **"Bağla"**.

Ayrıntı [+ Ekle penceresi](../portallar/ekle-penceresi.md) ve [Çocuklarım](../portallar/cocuklarim.md). 3 Ekim kararıyla velide her
çocuk ayrı oturumdur ([Velide her çocuk ayrı oturum](../portallar/velide-cocuk-oturumlari.md)).

### Müdür

1. Kodu öğrenciye ya da veliye vermek için: **Öğrenciler** listesinde satırda, ya da **"Hesap"** penceresinde **"Veli kodu"**
   bölümünde **"Kopyala"**. Toplu vermek için giriş kâğıtları ([Toplu giriş bilgisi](toplu-giris-bilgisi.md)).
2. Bölümün ipucu: **"Veli bu kodu + Ekle > Veli ekranına yazar. Anne ve baba aynı kodu kullanabilir; kod yanlış kişiye verildiyse
   yenile."**
3. Kodu yenilemek için **"Yeni kod üret"**. Tarayıcı sorar: **"Yeni veli kodu üretilsin mi? Eski kod çalışmaz olur; bağlı veliler
   bağlı kalır."** → "Üretiliyor..." → kutudaki kod ve "Kopyala"nın verdiği kod yerinde değişir.
4. Yanlış bağlanmış bir veliyi koparmak kodu yenilemekle olmaz; **"Veliler"** bölümünde **"Kaldır"** ([Veli bağlama](veli-baglama.md)).

### Çalışan (ek rolü olan öğretmen)

Rolünde **"Öğrenci bilgilerini düzenler"** varsa müdür gibi görür, kopyalar ve yenilersin. Yalnız "Öğrenci portalına girer" yetkisiyle
gördüğün dar listede veli kodu yoktur; yalnız "Öğrenci şifresi sıfırlar" yetkisiyle dağıttığın giriş bilgisi listesinde ve kâğıtta da
veli kodu boş kalır ("Veli için" bölümü hiç çıkmaz).

## Kurallar ve sınırlar

- **Biçim:** 16 karakter; İngilizce büyük harf, küçük harf, rakam ve `! ? # * + =`; ilk karakter harf; karışan I, L, O, l, o, 0, 1 yok.
  Ekranda, kâğıtta ve Excel'de 4'erli gruplar arasında tireyle görünür; "Kopyala" tireli biçimi verir. **Büyük/küçük harf fark
  eder.** Ayrıntı: [Kişi kodu](../portallar/kisi-kodu.md).
- **Ne zaman üretilir:** öğrenci hesabı açılırken (tek tek ya da Excel'le). Servisçide kod yoktur.
- **Kullanılınca değişmez;** birden çok veli aynı kodla bağlanabilir. **Yalnız okul yeniler** (yetki: "Öğrenci bilgilerini
  düzenler"); yenileme işlem kaydına yazılmaz, kimseye bildirim gitmez.
- **Velinin kod kutusu:** boşsa **"Veli kodunu yaz."**, 16 karakter değilse **"Veli kodu 16 karakterdir."**
- **Velinin göreceği hatalar:**
  - yanlış kod: **"Bu koda sahip bir öğrenci bulunamadı. Kodu öğrencinin Ayarlar sayfasından kontrol et."**
  - aynı çocuk ikinci kez: **"Bu öğrenci zaten ekli"**
  - kendi kodunu yazan öğrenci hesabı: **"Kendi hesabını veli olarak ekleyemezsin."**
- **Tahmine karşı sınırlar:** hesap başına dakikada 5 deneme (**"Çok fazla kod denemesi. Bir dakika bekleyip tekrar dene."**); aynı
  bağlantıdan saatte 30 yanlış kod (**"Bu bağlantıdan çok fazla yanlış kod denendi. Bir saat sonra tekrar dene."**).
- **Kim görür:** öğrencinin kendisi, okul yönetimi ("Öğrenci bilgilerini düzenler" yetkisi olan) ve kodun yazdırıldığı kâğıdı alan.
  Öğretmenler, yalnız portal ya da yalnız şifre yetkisi olanlar görmez. **Bilinen açık (kod okumasına göre):** "Excel ile içe ve dışa
  aktarım yapar" yetkisi olan kişi, "Öğrenci bilgilerini düzenler" olmasa da Excel Aktarım → Dışarı aktar → "Öğrenci listesi ve veli
  kodları" ile bütün okulun veli kodlarını indirebilir; güvenlik ve KVKK denetiminde ele alınacak.
- **Bildirim:** veli kodla bağlanınca öğrenciye **"<velinin adı> veli olarak hesabına bağlandı."** gider (veliye kopyası gitmez).
- **Kod kullanılınca değişmez; "bir kez kullanılır" yalnız yetişkinin kişi kodu içindir.** Önizlemenin SSS'i de böyle der ("Kod
  kullanılınca değişmez: anne ve baba aynı kodla ayrı ayrı ekleyebilir."). Önizlemenin temel dosyasında eski bir "Veli koduyla çocuk
  ekle" penceresinin notu hâlâ "Kod yalnız bir kez kullanılır." diyor, ama bugünkü önizlemede o pencere açılmıyor (yerine yukarıdaki
  "+ Ekle → Veli" penceresi açılıyor); HTML işinde bu artık metin temizlenmeli.

## Kardeşler ve ilgili

**Kardeşler:** [Veli bağlama](veli-baglama.md) · [Hesap penceresi](hesap-penceresi.md) ·
[Öğrenci hesabı açma](ogrenci-hesabi-acma.md) · [Toplu giriş bilgisi](toplu-giris-bilgisi.md) ·
[Öğrenciler listesi](ogrenci-listesi.md).

**İlgili:** [Kişi kodu](../portallar/kisi-kodu.md), [+ Ekle penceresi](../portallar/ekle-penceresi.md),
[Çocuklarım](../portallar/cocuklarim.md), [Velide her çocuk ayrı oturum](../portallar/velide-cocuk-oturumlari.md),
[Kişisel bilgiler](../ayarlar/kisisel-bilgiler.md) (öğrencinin Ayarlar'ı), [Dışarı aktarım](../excel-aktarim/disa-aktarim.md),
[Çocuğumun telefonu](../aile/README.md) (veli bağı aile uygulamasının da şartıdır), [Kim neyi görür](../kvkk-ve-gizlilik/kim-neyi-gorur.md).

## Kod tarafı

- Ön yüz: [public/js/parcalar/10b-hesaplar.md](../../public/js/parcalar/10b-hesaplar.md) — "Veli kodu" bölümü, `kod-yenile`;
  [public/js/parcalar/10-mudur.md](../../public/js/parcalar/10-mudur.md) — listede kod; [public/js/parcalar/23-veli-ayarlar.md](../../public/js/parcalar/23-veli-ayarlar.md)
  — öğrencinin "Veli kodun", velinin Çocuklarım'ı; [public/js/parcalar/08c-kisilikler.md](../../public/js/parcalar/08c-kisilikler.md)
  — "+ Ekle → Veli"; [public/js/parcalar/05-giris.md](../../public/js/parcalar/05-giris.md) — `kisiKoduKutusu`, `kisiKoduGirdisi`,
  `kisiKoduDenetle`, `kisiKoduBicim`; [public/js/parcalar/08-ana-sayfa.md](../../public/js/parcalar/08-ana-sayfa.md) — "Hesabın ve
  veli kodun" kutucuğu.
- Sunucu: [sunucu/bolumler/okul.md](../../sunucu/bolumler/okul.md) — `POST /api/school/student-code-reset`;
  [sunucu/bolumler/veli.md](../../sunucu/bolumler/veli.md) — `cocukBagla` (deneme sınırları, bildirim);
  [sunucu/bolumler/kisilik.md](../../sunucu/bolumler/kisilik.md) — `POST /api/kisilik/cocuk`;
  [sunucu/bolumler/hesaplar.md](../../sunucu/bolumler/hesaplar.md) — hesapla birlikte üretim (`hesapNesnesi`);
  [sunucu/veri/depo/kullanicilar.md](../../sunucu/veri/depo/kullanicilar.md) — `yeniKisiKodu`, `kodlaOgrenci`.
- Testler: [testler/test-kisi-kodu.md](../../testler/test-kisi-kodu.md) (biçim, harf duyarlılığı, öğrencinin kodunun kullanılınca
  değişmemesi), [testler/test-yonetim.md](../../testler/test-yonetim.md) (`student-code-reset`).

## Sık sorulanlar

- **Velim kodu yazıyor ama "bulunamadı" diyor.** Büyük/küçük harfe dikkat etsin; kodu kopyalayıp yapıştırması en kolayı. Okul kodu
  yenilediyse eski kod çalışmaz; Ayarlar'daki güncel kodu ver.
- **Annem ve babam ayrı ayrı ekleyebilir mi?** Evet; kod kullanılınca değişmez.
- **Kodu yanlış birine verdim.** Okul "Yeni kod üret" ile yeniler; o kişi zaten bağlandıysa okul onu "Veliler"den kaldırır.
- **Kodu yenileyince bağlı velim kopar mı?** Hayır; yalnız eski kod artık kimseyi bağlamaz.
- **Servisçinin veli kodu var mı?** Hayır; veli kodu yalnız öğrencidedir.

## Sırada

- Tasarım 1'deki "Veli kodun" bölümü (Hesap ayarları ve profil menüsü), velinin "Yakınlığın" seçimi ve "Çocuğunu bağla" onay adımı.
- Velide her çocuk ayrı oturum (3 Ekim kararı; kodu Linux'ta).
- Çok dil (metinler katalogdan).
