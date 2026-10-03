# Öğrenci hesapları · Veli bağlama (okul tarafı)

**Durum:** Kodda var; tasarımda ek olarak T.C. kimlik no'nun bütün hesaplarda zorunlu olmasıyla bağlamanın T.C. ile yapılması ve
"Bu numarayla bir veli hesabı var: Ze**** Yı****, bağla" / "Bu numarayla hesap yok" iletileri.

Okulun, öğrencinin hesap penceresinden bir veliyi T.C. kimlik no'su ya da kullanıcı adıyla bulup öğrenciye bağlaması ve bağı
kaldırması.

## Ne işe yarar

Veli çocuğunu çoğunlukla kendisi, veli koduyla ekler ([Veli kodu](veli-kodu.md)). Ama veli kodu kaybolmuş, kâğıt ulaşmamış ya da
veli kodu girmekte zorlanıyor olabilir. O zaman okul, Eğitim Evi'ne kayıtlı velinin T.C. no'su ya da kullanıcı adıyla onu öğrenciye
bağlar. Yanlış bağlanmış bir veliyi de buradan kaldırır. Bağ, velinin çocuğun ödevini, notunu, devamsızlığını, servisini görmesini
sağlar; kaldırılınca veli artık göremez.

## Nereden açılır

- **Öğrenciler → öğrencinin "Hesap" düğmesi → "Veliler" bölümü** ([Hesap penceresi](hesap-penceresi.md)).
- Tasarım 1 önizlemesinde bu bölüm gösterilmiyor; kaldıran bir karar yok.

## Adım adım

### Müdür

1. Öğrencinin **"Hesap"** penceresini aç, en alttaki **"Veliler"** başlığına in. Önce **"Yükleniyor..."**, sonra:
   - bağlı veliler alt alta: ad soyad, altında kullanıcı adı (veli aynı zamanda okulun öğretmeni ya da müdürüyse yanında
     "Öğretmen" / "Müdür"), sağda **"Kaldır"**;
   - hiç yoksa **"Bağlı veli yok."**
2. **"Veli bağla"** kutusuna velinin **T.C. kimlik no'sunu** ya da **kullanıcı adını** yaz (yer tutucu: "Velinin T.C. kimlik no'su ya
   da kullanıcı adı"). Altındaki ipucu: **"Veli önce Eğitim Evi'ne kaydolmuş olmalı. Veli kodu ile kendisi de bağlanabilir."**
3. **"Bul"**a bas ("Aranıyor..."):
   - bulunursa küçük bir kartta velinin **adının bir kısmı gizli** hâli (her sözcüğün ilk iki harfi, gerisi yıldız: "Ay** Yı****"),
     kullanıcı adı ve **"Veli olarak bağla"**;
   - hesap veli olamıyorsa: **"Bu hesap veli olarak bağlanamaz (öğrenci ya da yönetici hesabı)."**;
   - hiç yoksa kutunun altında: **"Bu bilgiyle kayıtlı bir hesap yok. Veli önce Eğitim Evi'ne kaydolmalı."**
4. Gizli adı veliyle (telefonda ya da yüz yüze) doğrula, **"Veli olarak bağla"**ya bas ("Bağlanıyor...") → yeşil **"Veli, Elif Yılmaz
   adlı öğrenciye bağlandı."**; kutu boşalır, "Veliler" listesi yenilenir.
5. Bir bağı kaldırmak için velinin satırında **"Kaldır"**. Tarayıcı sorar: **"Bu kişinin veli bağı kaldırılsın mı? Öğrencinin
   bilgilerini artık göremez."** Onaylayınca liste yenilenir.

Tasarımda: kullanıcının 2 Ekim kararıyla T.C. kimlik no bütün hesaplarda (velide de) zorunlu olur ve bağlamayı kolaylaştıran o olur.
Okul veliyi T.C. ile bağlarken numarayı yazar; sistem **"Bu numarayla bir veli hesabı var: Ze**** Yı****, bağla"** ya da **"Bu
numarayla hesap yok"** der; numarayı ve hesabın başka bilgisini göstermez. Aydınlatma metni 1.15 bunu şimdiden yazıyor: yetişkinin
numarası okulla paylaşılmaz, okul veliyi bağlarken yalnız eşleşmenin olup olmadığını görür
([Aydınlatma metni](../kvkk-ve-gizlilik/aydinlatma-metni.md)).

### Çalışan (ek rolü olan öğretmen)

Rolünde **"Öğrenci bilgilerini düzenler"** varsa müdür gibi bağlar ve kaldırırsın (hazır Müdür Yardımcısı şablonunda var).

### Veli

1. Okul seni bağlayınca bildirim gelir: **"Test Ortaokulu seni Elif Yılmaz adlı öğrencinin velisi olarak ekledi."** Bildirime basınca
   **Çocuklarım** açılır; çocuğun orada ve sol menünün başındaki **"Portallarım"**da **"Veli"** satırı (altında çocuğun adı)
   olarak durur ([Çocuklarım](../portallar/cocuklarim.md)).
2. Hiç rolü olmayan yetişkin hesabıysan bu anda veli olursun; bir okulun yoksa çocuğunun okulu senin okulun sayılır (duyuru ve
   takvim için).
3. Okul bağı kaldırırsa bildirim gelmez; çocuğun Çocuklarım'dan ve menüden kalkar. Bağı sen de Çocuklarım'daki **"Kaldır"** ile
   kendin kaldırabilirsin.

Tasarımda velide her çocuk ayrı oturumdur: bağlanınca "Veli · Elif (7-A)" oturumu açılır ([Velide her çocuk ayrı oturum](../portallar/velide-cocuk-oturumlari.md)).

### Öğretmen ya da müdür (aynı zamanda veli)

Okulun öğretmeni ya da müdürü kendi çocuğu için veli olarak bağlanabilir; rolü değişmez, velilik kendi yetişkin hesabına kurulur.
Menüsünde **"Velisi olduğum"** bölümü çıkar: **"Çocuklarım"**, **"Ödevleri"**, **"Devamsızlığı"**, **"İlerleyişi"** (öğretmende ayrıca
"Servisi").

### Öğrenci

Okul bir veli bağlayınca öğrenciye bildirim gitmez (velinin kodla kendisi bağlanmasında gider — [Veli kodu](veli-kodu.md)).

## Kurallar ve sınırlar

- **Yetki:** "Öğrenci bilgilerini düzenler" (müdürde hep); yoksa **"Bu işlem için yetkin yok"**. Başka okulun öğrencisi: **"Öğrenci
  bulunamadı"**.
- **Kim veli olarak bağlanabilir:** onaylı bir hesap olmalı ve şunlardan biri: okuldan bağımsız veli hesabı, hiç rolü olmayan
  yetişkin hesabı (bağlanınca veli olur) ya da **bu okulun** kendi hesabıyla gelmiş öğretmeni veya müdürü. Öğrenci, servisçi,
  sistem yöneticisi, başka okulun öğretmen/müdür satırı ve onaylanmamış hesap bağlanamaz.
- **Arama:** T.C. yazılırsa kural denetlenir (**"T.C. kimlik numarası 11 haneli olmalı ve 0 ile başlamamalı."** / **"T.C. kimlik
  numarası geçersiz, rakamları kontrol et."**); boşluklu ya da tam genişlikli rakamla yazılması fark etmez. Kullanıcı adı kurala
  uymuyorsa ya da kutu boşsa: **"Velinin T.C. kimlik numarasını ya da kullanıcı adını yaz."**
- **Gizli ad:** arama tam adı vermez (T.C. ya da kullanıcı adıyla ad öğrenme aracına dönmesin); müdür adı veliyle doğrular.
- **Hız sınırı:** kişi başına dakikada 60 arama — **"Çok fazla arama yaptın. Bir dakika bekle."**
- **Bağlarken hatalar:** **"Bu hesap veli olarak bağlanamaz."**, **"Bu kişi zaten bu öğrencinin velisi."**, aynı anda başka bir
  işlemle hesap başka bir role geçtiyse **"Bu hesap bu arada başka bir role bağlandı. Yeniden dene."** Aynı bağ iki kez kurulmaz.
- **Kaldırırken:** **"Bu kişi bu öğrencinin velisi değil."** Kaldırınca veli öğrencinin bilgilerini hemen göremez olur.
- **İz:** bağlama işlem kaydına **"Veli öğrenciye bağlandı"** ("Ayşe Yılmaz → Elif Yılmaz"), kaldırma **"Veli bağı kaldırıldı"**
  (öğrencinin adı) olarak yazılır ([Neler kaydedilir](../islem-kaydi/neler-kaydedilir.md)).
- **Bilinen açık (güvenlik denetiminde ele alınacak):** "Bul" isteği T.C.'yi adres satırında taşır (`GET …/veli-bul?kimlik=`).
  Uygulama adresleri günlüğe yazmaz ama önündeki ters vekil erişim günlüğü tutuyorsa T.C. oraya düşer; öğretmen ekleme gibi gövdeye
  (POST) taşınacak.
- **Eksik ileti:** "uygun değil" iletisi "öğrenci ya da yönetici hesabı" der; sunucu servisçi ve onaylanmamış hesabı da uygun
  saymaz.
- **Mezuniyette:** veli bağı kişiye bağlıdır, öğrenci mezun olunca da kopmaz ([Mezunlar](../egitim-yili/mezunlar.md)).

## Kardeşler ve ilgili

**Kardeşler:** [Veli kodu](veli-kodu.md) · [Hesap penceresi](hesap-penceresi.md) · [Öğrenci nakli](ogrenci-nakli.md) (velilerin
bağı nakilde sürer) · [Öğrenciler listesi](ogrenci-listesi.md).

**İlgili:** [Çocuklarım](../portallar/cocuklarim.md), [Velide her çocuk ayrı oturum](../portallar/velide-cocuk-oturumlari.md),
[Velinin bildirimleri](../bildirim/velinin-bildirimleri.md), [T.C. kimlik no](../giris-hesap/tc-kimlik-no.md),
[Kim neyi görür](../kvkk-ve-gizlilik/kim-neyi-gorur.md), [Aydınlatma metni](../kvkk-ve-gizlilik/aydinlatma-metni.md),
[Çocuğumun telefonu](../aile/README.md), [Neler kaydedilir](../islem-kaydi/neler-kaydedilir.md).

## Kod tarafı

- Ön yüz: [public/js/parcalar/10-mudur.md](../../public/js/parcalar/10-mudur.md) — `velileriYukle`, `veli-bul`, `veli-bagla`,
  `veli-coz`; [public/js/parcalar/10b-hesaplar.md](../../public/js/parcalar/10b-hesaplar.md) — penceredeki "Veliler" bölümü;
  [public/js/parcalar/06-menu.md](../../public/js/parcalar/06-menu.md) — "Velisi olduğum".
- Sunucu: [sunucu/bolumler/hesaplar.md](../../sunucu/bolumler/hesaplar.md) — `GET /api/school/ogrenci-velileri`,
  `GET /api/school/veli-bul`, `POST /api/school/veli-bagla`, `POST /api/school/veli-coz`, `veliOlabilir`, `veliHesabi`, `adMaskele`;
  [sunucu/veri/depo/kullanicilar.md](../../sunucu/veri/depo/kullanicilar.md) — `velileri`, `bagla`, `bagiCoz`, `bagliMi`,
  `rolsuzuVeliYap`.
- Testler: [testler/test-veli-coklu.md](../../testler/test-veli-coklu.md) (boşluklu T.C., gizli ad, geçersiz ve kayıtsız T.C.,
  kullanıcı adıyla arama, öğrencinin veli olamaması, aynı bağın ikinci kez kurulmaması, rolsüz hesabın veli olması, kaldırınca
  görememe, başka okulun müdürü, yetkisiz öğretmen).

## Sık sorulanlar

- **Velinin hesabı yok, bağlayamıyorum.** Veli önce Eğitim Evi'ne kaydolmalı (Kayıt ol); sonra ya kendisi veli koduyla bağlanır ya da
  sen T.C. no'su veya kullanıcı adıyla bağlarsın.
- **Neden adın tamamını göremiyorum?** T.C. ya da kullanıcı adıyla başkalarının adını öğrenmek mümkün olmasın diye; adı veliyle
  doğrula.
- **Okulumuzun öğretmeni kendi çocuğunun velisi; bağlayabilir miyim?** Evet; öğretmenliği sürer, menüsüne "Velisi olduğum" eklenir.
- **Velinin bağını kaldırırsam veliye haber gider mi?** Bugün gitmez; işlem kaydına yazılır.

## Sırada

- T.C. kimlik no'nun bütün hesaplarda zorunlu olması ve bağlamanın T.C. ile, "Bu numarayla bir veli hesabı var: …, bağla"
  iletisiyle yapılması (kodu Linux'ta).
- Güvenlik denetimi: "Bul" isteğinin T.C.'yi adres yerine istek gövdesinde taşıması.
- Velide her çocuk ayrı oturum (3 Ekim kararı).
