# Toplantılar · Sınıfın uzaktan ders bağlantısı

**Durum:** Tasarlandı — henüz kodda yok

Her sınıfın kalıcı bir Google Meet (istenirse Zoom ya da Teams) odası olur; müdür ya da sınıfın öğretmeni bu odayı bir kez sınıfa
bağlar, sonra derste "Görüşme başlat" hep aynı odayı açar ve gelemeyen öğrenci "Katıl" ile oraya girer.

## Ne işe yarar

Kullanıcının 29 Eylül isteği: "uzaktan bağlantı: gelmeyen öğrenci için her sınıf için bir Google Meet oluşturur, koyar (link veya
Zoom); hoca 'Görüşme başlat'a basar, bu tahtaya yüklenir, uygulama ya da tarayıcıda açılır ve o çocuğu da 'ping'leyebilir." Aynı gün
ikinci kararı: "ilk bir sınıfı seçer, link sınıfa aittir". 3 Ekim kararıyla bütün bağlantı alanlarında olduğu gibi burada da
**Google Meet varsayılan ve önerilen** platformdur; Zoom (ve Teams) isteğe bağlıdır.

Hasta, sakatlanmış ya da okula gelemeyen öğrenci dersi evden izleyebilsin diye. Bağlantı sınıfa ait ve kalıcı olduğu için öğretmen her
ders yeni bir toplantı kurmaz; hangi öğretmen o saatte derse girerse girsin aynı odayı açar.

Bu belge bağlantının **sınıfa nasıl verildiğini** anlatır. Derste odayı açmak, gelmeyenlere haber vermek ve kimin girebileceğini seçmek
[Görüşme başlat, ping ve Katıl izni](gorusme-baslat-ve-ping.md)'de.

## Nereden açılır

- **Bağlantının sınıfa verildiği yer:** tanımda "her sınıfın ayarlarında **'Uzaktan ders bağlantısı'**" diye geçer. Tasarım 1
  önizlemesinde bu alan çizilmedi. Önizlemedeki sınıf sayfasında (müdürde **Sınıflar → sınıf**; üstte **"Velilere mesaj"** ve
  yalnız müdürde **"Düzenle"**; sekmeler "Öğrenciler", "Ders programı", "Dersler ve öğretmenler", "Devamsızlık") böyle bir alan yok;
  yeri kodlanırken belirlenecek ([Sınıf sayfası](../siniflar-dersler/sinif-sayfasi.md)).
- **Bağlantının kaynağı:** Sol menü → **"Toplantılar"** → en alttaki **"Görüşme bağlantıları"** bölümü
  ([Görüşme bağlantıları](gorusme-baglantilari.md)). Önizlemede buradaki örnek bağlantılardan biri bu iş içindir: ad "7-A tahtası",
  etiket **"Tahta"**, görünürlük "Okulun".
- **Kullanıldığı yerler:** tahtada sınıfın ekranındaki **"Görüşme başlat"**, öğretmenin **"Yoklama"** sayfasındaki **"Görüşme
  başlat"** ve öğrencinin Toplantılar sayfasındaki **"Uzaktan ders"** satırının **"Katıl"**ı
  ([Görüşme başlat, ping ve Katıl izni](gorusme-baslat-ve-ping.md)).

## Adım adım

### Müdür

**1. Kalıcı bağlantıyı al** (Eğitim Evi bunu kendisi oluşturmaz; aşağıdaki "Kurallar"a bak):

- **Google Meet** (önerilen): okulun toplantılar için kullandığı Google hesabıyla Meet'i aç, **"Yeni → Sonraki bir toplantı için
  toplantı oluştur"**a bas, çıkan bağlantıyı kopyala. Bu bağlantı hep aynı kalır.
- **Zoom:** Kişisel Toplantı Kimliği ya da **"Yinelenen → Sabit saat yok"** toplantısı. Tanımın önerisi her sınıfa **ayrı oda**
  açmaktır; aynı oda iki sınıfa verilirse iki ders birbirine karışır.
- **Microsoft Teams:** Teams toplantı bağlantısı da kabul edilir.

**2. Bağlantıyı listeye kaydet:** **"Toplantılar" → "Görüşme bağlantıları" → "+ Bağlantı ekle"**:

| Alan | Bu iş için önerilen |
|---|---|
| **"Hesap:"** | bağlantıyı aldığın hesabın e-posta adresi (ör. okulun toplantı hesabı) |
| **"Bağlantı:"** | kopyaladığın adres, ör. `https://meet.google.com/abc-defg-hij` |
| **"Ad:"** | sınıfın adıyla, ör. "7-A tahtası" |
| **"Kim görsün:"** | **"Okuldaki herkes"** — o sınıfa derse giren öğretmenler de görsün ve seçebilsin |
| **"Etiketler:"** | **"Tahta"** |

Kaydedince kısa ileti: "Bağlantı eklendi; okuldaki öğretmenler ve müdür de görür." Alanların hepsi ve hata iletileri
[Görüşme bağlantıları](gorusme-baglantilari.md)'nda.

**3. Bağlantıyı sınıfa ver:** sınıfın ayarlarında **"Uzaktan ders bağlantısı"**nı aç. Süzgeçli seçici açılır
([Bağlantı seçici, Kullanımda/Boşta ve devretme](baglanti-secici-ve-devretme.md)):

1. **"Tahta"** etiketi önceden seçili gelir; **Hesap** listesinden ve arama kutusundan da süzersin.
2. Her bağlantının yanında **"Boşta"** ya da **"Kullanımda"** (nerede kullanıldığıyla) yazar.
3. **"Boşta"** bir bağlantıya bas: sınıfın bağlantısı olur.
4. **"Kullanımda"** bir bağlantıya basarsan onay sorulur: "Bu bağlantı şu an `<yer>`'de kullanılıyor. Buraya verirsen `<yer>`
   bağlantısız (boşta) kalır. Emin misin?" Evet dersen bağlantı bu sınıfa geçer, önceki yer bağlantısız kalır.

**4. Değiştirmek:** aynı yerden başka bir bağlantı seç. Bağlantıyı sınıftan kaldırmanın (sınıfı bilerek bağlantısız bırakmanın) nasıl
yapılacağı tanımda yazılı değil.

Bundan sonra sınıfın **bütün dersleri** bu odayı kullanır: tahtada da, öğretmenin ekranında da "Görüşme başlat" aynı adresi açar.

**Tasarımda (tanımın iki aşaması):** 29 Eylül tanımı "müdür ya da sınıfın öğretmeni bir kez **yapıştırır**" diyordu (sınıfın ayarında
bir adres kutusu). 3 Ekim kararıyla bağlantı Görüşme bağlantıları listesinden **seçici**yle seçilir ("tahtaya bağlarken aynı süzgeçli
seçici kullanılır; tahtada 'Tahta' etiketi seçili"). Seçicinin yanında doğrudan yapıştırma kutusunun da kalıp kalmayacağı yazılı değil;
toplantı açma penceresinde ikisi birlikte duruyor ([Toplantı açma](toplanti-acma.md)).

### Öğretmen

Tanım bu işi müdürle birlikte **"sınıfın öğretmeni"**ne de verir: derse girdiğin sınıfın bağlantısını müdürdeki adımlarla
kaydedip seçersin. "Sınıfın öğretmeni"nin sınıf öğretmeni (sınıfın rehberi) mi, sınıfa derse giren her öğretmen mi olduğu tanımda
yazılı değil; kodlanırken netleşecek.

Bağlantıyı **"Yalnız ben"** olarak kaydedersen seçicide yalnız sen görürsün; sınıfa derse giren öbür öğretmenler bağlantının kendisini
listede görmez ama sınıfa verilmiş olduğu için "Görüşme başlat" onlarda da aynı odayı açar. Odanın sahibi bağlantıyı aldığın hesaptır:
öbür öğretmen "Görüşme başlat"a bastığında o cihazda o hesap açık değilse Meet onu sahip saymaz, içeri alınmayı bekler.

Derste kullanmak: [Görüşme başlat, ping ve Katıl izni](gorusme-baslat-ve-ping.md#öğretmen).

### Çalışan

Tanımdaki rol önerisinde (iş 24, onay bekliyor) yeni bir yetki var: **`uzaktan.baglanti`** — "sınıfın uzaktan ders bağlantısını
düzenler". Önerilen yeni hazır şablon **"Bilişim Teknolojileri Sorumlusu"** bu yetkiyi taşır (tahta hesapları, öğrenci şifresi ve
aktarımla birlikte). Bu yetkisi olan çalışan müdürdeki adımları izler. Tasarım 1'in yetki listesinde bu yetki henüz yok; orada yalnız
"Tahta hesapları" (`tahta.yonet`) ve "Toplantı açar" (`toplanti.ac`) var; şablon da "BT sorumlusu" adıyla duruyor ama içinde
`uzaktan.baglanti` yok ([Yetki listesi](../roller-yetkiler/yetki-listesi.md),
[Hazır rol şablonları](../roller-yetkiler/hazir-sablonlar.md)).

### Öğrenci ve veli

Bağlantıyı **hiçbir yerde görmezler**. Öğrenci, o ders için seçildiyse Toplantılar sayfasındaki **"Uzaktan ders"** satırındaki
**"Katıl"** ile girer; "Katıl" sunucumuzdan geçer ([Görüşme başlat, ping ve Katıl izni](gorusme-baslat-ve-ping.md#öğrenci)). Veli, çocuğu
derse evden bağlanacaksa okula ("bağlanmak istiyoruz" diye) haber verir; sistemde ayrı bir veli izni kutusu yoktur.

### Tahta

Tahta hesabı bağlantıyı **seçmez ve değiştirmez**; sınıfı seçip **"Görüşme başlat"**a basar, sınıfın bağlantısı o tahtada açılır
(sınıf seçme ekranındaki not: "Önce dersin yapılacağı sınıfı seç; uzaktan ders bağlantısı sınıfa aittir.").
Ayrıntı: [Tahta hesabı](../tahta/README.md), [Sınıf seçme](../tahta/sinif-secme.md).

## Kurallar ve sınırlar

- **Bağlantı sınıfa aittir:** her sınıfın bir uzaktan ders bağlantısı olur; o sınıfın bütün derslerinde kullanılır. Tahta hesabı
  sınıfa bağlı değildir (bir tahtada okulun bütün sınıfları seçilebilir), bağlantı tahtaya değil sınıfa verilir.
- **Platform:** Google Meet varsayılan ve önerilen; Zoom ve Microsoft Teams seçilebilir. Kabul edilen adres biçimleri Görüşme
  bağlantılarındakilerdir (Meet `https://meet.google.com/abc-defg-hij` kalıbı; Zoom `…zoom.us/j/` ve 9–11 haneli numara; Teams
  `teams.microsoft.com` ya da `teams.live.com`).
- **Kim verir:** müdür ve sınıfın öğretmeni (tanım); önerilen `uzaktan.baglanti` yetkisiyle çalışan. Öğrenci, veli, servisçi ve tahta
  veremez.
- **Otomatik Meet oluşturma yok:** tanım bunu önermedi — Google hesabını bağlamak (OAuth, Google Takvim API'si) ve okulun Google
  Workspace'i gerekir. Bağlantı bir kez elle alınır.
- **Gizli adres:** öğrenci ve veli adresi listede, sayfada ya da bildirimde görmez. "Katıl"da sunucu bakar: o sınıfın öğrencisi mi,
  şu an ders saati mi, bu ders için seçilmiş mi.
- **Asıl kapı Meet'in bekleme odası:** bağlantı kalıcıdır; bir kez giren biri adresi tarayıcısında görebilir. Bu yüzden içeri almayı
  öğretmen Meet'te ("Kabul et") yapar; bu, ekranda ve kılavuzda yazılacak (kullanıcının 29 Eylül kararı).
- **Bir bağlantı tek yerde:** sınıfın bağlantısı bir toplantıya ya da başka bir sınıfa devredilirse sınıf **bağlantısız** kalır;
  sahibine (tanımda tahta ve sınıf için müdür) ders saati gelene kadar düzenli uyarı gider; kimse yeni bağlantı seçmezse "Görüşme
  başlat"ta ve "Katıl"da **"Bağlantı bulunamadı"** çıkar ([Bağlantı seçici, Kullanımda/Boşta ve devretme](baglanti-secici-ve-devretme.md)).
- **Listeden silmek:** bağlantı Görüşme bağlantıları listesinden silinirse kullanıldığı yerler bağlantısız kalmaz (önizlemedeki silme
  uyarısı), yalnız listeden yeniden seçilemez.
- **Ücretsiz sınırlar (tanımdaki not):** Google Meet'in ücretsiz grup görüşmesi 60 dakika, Zoom'unki 40 dakika; ders 40 dakika
  olduğu için ikisi de bir derse yeter. Meet'in "sonraki bir toplantı için" bağlantısı 365 gün hiç kullanılmazsa kapanır.
- **KVKK ve çocuk güvenliği (tanım):** sınıftaki kamera öbür öğrencileri de gösterir, bu yüzden **tahtaya dönük** durmalı; ders
  **kaydedilmez**. Uzaktan derse görüntülü katılım ve üçüncü taraf (Google, Zoom) aydınlatma metnine yazılır, sürüm artar. Öğrenci
  başına ayrı "veli izni" denetimi kurulmaz (kullanıcı 29 Eylül: "veli şeyi KVKK olsun, zaten tahta şeyinde veli iletişime geçer
  'bağlanmak istiyoruz' diye").
- **İşlem kaydı:** bağlantının sınıfa verilmesi ve değiştirilmesi kaydedilmeli (kim, hangi sınıf, hangi bağlantı); tanımda ayrıca
  yazılmadı.

## Kardeşler ve ilgili

**Kardeşler** (aynı klasör, [Toplantılar ve uzaktan ders](README.md)):

- [Görüşme başlat, ping ve Katıl izni](gorusme-baslat-ve-ping.md) — bu bağlantının derste kullanılması.
- [Görüşme bağlantıları](gorusme-baglantilari.md) — bağlantının kaydedildiği liste ("Tahta" etiketi).
- [Bağlantı seçici, Kullanımda/Boşta ve devretme](baglanti-secici-ve-devretme.md) — sınıfa bağlarken kullanılan seçici.
- [Toplantılar listesi](toplantilar.md) — öğrencideki "Uzaktan ders" grubu.
- [Katıl düğmesi](katil.md) — toplantıların "Katıl"ı (kuralı farklı: davetli olmak ve zaman).

**İlgili:**

- [Tahta hesabı](../tahta/README.md), [Tahta hesabı açma](../tahta/tahta-hesabi-acma.md), [Sınıf seçme](../tahta/sinif-secme.md),
  [Tahtanın gördükleri ve sınırları](../tahta/tahtanin-sinirlari.md).
- [Sınıf sayfası](../siniflar-dersler/sinif-sayfasi.md), [Sınıf açma](../siniflar-dersler/sinif-acma.md).
- [Yetki listesi](../roller-yetkiler/yetki-listesi.md), [Hazır rol şablonları](../roller-yetkiler/hazir-sablonlar.md).
- [Ders yoklaması](../devamsizlik/ders-yoklamasi.md) — öğretmenin "Görüşme başlat"ı yoklama sayfasında.
- [Dışarı giden veriler](../kvkk-ve-gizlilik/disari-giden-veriler.md), [Aydınlatma metni](../kvkk-ve-gizlilik/aydinlatma-metni.md).
- [Neler kaydedilir](../islem-kaydi/neler-kaydedilir.md).

## Kod tarafı

Bugün kodda yok. Kodlanınca kullanacağı bugünkü parçalar:

- Sınıflar ve sınıfın ayarları: [sunucu/bolumler/okul.md](../../sunucu/bolumler/okul.md) (`/api/school/...` sınıflar),
  [public/js/parcalar/20-siniflar.md](../../public/js/parcalar/20-siniflar.md) (müdürün "Sınıflar" sayfası),
  [public/js/parcalar/11b-siniflarim.md](../../public/js/parcalar/11b-siniflarim.md) (öğretmenin "Sınıflarım"ı).
- Yeni yetki (`uzaktan.baglanti`, öneri): [sunucu/yetki.md](../../sunucu/yetki.md),
  [public/js/parcalar/19f-roller.md](../../public/js/parcalar/19f-roller.md).
- İşlem kaydı: [sunucu/bolumler/islem-kaydi.md](../../sunucu/bolumler/islem-kaydi.md).
- Yeni tablolar (bağlantılar, sınıfın bağlantısı): [sunucu/veri/sema/SEMA.md](../../sunucu/veri/sema/SEMA.md) ("toplantılar (iş 21)").

Kullanıcıya dönük anlatım [belge/KILAVUZ.md](../../belge/KILAVUZ.md)'de henüz yok; kodlanınca "asıl kapı Meet'in bekleme odası" notuyla
eklenecek.

## Sık sorulanlar

- **Her derste yeni Meet açmam gerekir mi?** Hayır. Sınıfın bağlantısı kalıcıdır; bir kez verilir, bütün derslerde aynı oda açılır.
- **Okulun Google Workspace'i yok, olur mu?** Olur. Herhangi bir Google hesabıyla alınan "sonraki bir toplantı için" bağlantısı
  yeter. Workspace for Education kullanan okulda okulun alanındaki hesaplar istek göndermeden girer; öbürleri "Katılma isteği" gönderir.
- **İki sınıfa aynı bağlantıyı verebilir miyim?** Hayır; bir bağlantı tek yerde kullanılır. Başka sınıfa verirsen önceki sınıf
  bağlantısız kalır ve sana uyarı gelir.
- **Zoom kullanıyoruz, olur mu?** Olur; her sınıfa ayrı bir Zoom odası aç (Kişisel Toplantı Kimliği ya da "Yinelenen → Sabit saat
  yok"). Ücretsiz Zoom 40 dakikada kapanır; bir ders de 40 dakika.
- **Dersi kaydedebilir miyiz?** Tanım uzaktan derste kayıt yapılmamasını söyler (sınıftaki öbür öğrenciler de görünür).

## Sırada

- Toplantılar ve tahta işi (iş 21, Linux'ta): sınıfın ayarlarına "Uzaktan ders bağlantısı", seçiciyle bağlama, "Bağlantı bulunamadı";
  sonra Tasarım 1 önizlemesine eklenecek.
- Özel roller işi (iş 24, öneri): `uzaktan.baglanti` yetkisi ve "Bilişim Teknolojileri Sorumlusu" şablonu.
- Kodlanırken kararlaştırılacaklar: alanın sınıf sayfasındaki yeri, "sınıfın öğretmeni"nin kim olduğu, doğrudan yapıştırma kutusunun
  kalıp kalmayacağı, bağlantıyı sınıftan kaldırma.
- KVKK: kodlandığı işte aydınlatma metnine uzaktan ders ve üçüncü taraf (Google, Zoom) yazılacak, sürüm artacak.
