# Servis · Servisler sayfası

**Durum:** Kodda var; tasarımda ek olarak servis satırında canlı durum rozeti ("Yolda", "Bekliyor"…), her servisin kendi penceresi ("Bilgi", "Öğrenciler", "Bugünkü yoklama" sekmeleri) ve "Servis ekle" penceresinde aynı anda servisçi hesabı açma.

Okul yönetiminin servisleri açtığı, düzenlediği, sildiği ve öğrencileri durağıyla servislere yazdığı sayfa.

## Ne işe yarar

Okulun her servisi (aracı) burada bir kart: adı, plakası, servisçisi, şoförü ve rehberi, kalkış saatleri, güzergâhı ve içindeki
öğrenciler. Öğrenciyi servise yazan, başka servise taşıyan ve servisten çıkaran hep okul yönetimidir; öğrenci ve veli kendi
servisini [Servisim](servisim.md) sayfasında görür, servisçi kendi listesini [Yoklama sayfası](yoklama-sayfasi.md)'nda.

Aynı sayfanın üstünde okulun [servis saatleri](servis-saatleri.md) kartı, altında [servisçi hesapları](servisci-hesabi.md) durur;
her servisin bugünkü yoklamasına da buradan bakılır ([Yönetimin yoklama görünümü](yonetimin-yoklama-gorunumu.md)).

Kullanıcının sözleri: "servisci kayıt olmicak onu müdür ayarlicak" (26 Eylül) ve "servisci kendi öğrenci listesinide gircek veya
okul" (26 Eylül). Bugün öğrenci listesini yalnız okul girer; servisçinin de girmesi tasarımda
([Sırayı düzenle](sira-duzenleme.md)).

## Nereden açılır

| Kim | Menüdeki yeri |
|---|---|
| Müdür | Sol menüde "Okul Düzeni" başlığının altında **"Servisler"** ("Yemek Listesi"nin hemen altında) |
| "Servisleri ve servis öğrencilerini düzenler" yetkili öğretmen | Menünün altındaki ek bölümde (başlığı rolün adı, ör. "Servis Sorumlusu"; ad yoksa "Ek Yetkiler") **"Servisler"** |

Adres: sitenin adresinin sonuna `#/servis`. Telefonda sol üstteki ☰ ile açılan menüde aynı satır var
([Telefonda menü](../menu-ve-arama/telefonda-menu.md)). Aynı adres öğrencide "Servisim", velide "Servis" sayfasını açar; sayfa
rolüne göre değişir.

Tasarımda: müdürün menüsünde "Servisler"; sayfa başlığının altında "3 servis · 1 tanesi yolda", sağ üstte **"Servis ekle"**.

## Adım adım

### Ekranın düzeni (bugünkü site)

1. Büyük başlık **"SERVİS"**, altında "Okulun servisleri, servis saatleri, servisçiler ve servisteki öğrenciler."
2. Senin de bu okulda (ya da başka okulda) servise binen çocuğun varsa önce onun servis kartı ve "Servis haritası" gelir
   ([Servisim ve servis kartı](servisim.md)).
3. **"Servis saatleri"** kartı ([Servis saatleri](servis-saatleri.md)).
4. Özet kartı: solda servis sayısı ("3 servis" ya da "Henüz servis eklenmedi") ve altında "Şoför ve rehber telefonu yalnızca o
   servisteki öğrenciye ve velisine görünür."; sağda **"Yeni servis"** düğmesi.
5. Her servis için bir kart:
   - Üst satırda servis simgesi, servisin adı ve (girildiyse) gri plaka rozeti ("07 ABC 123").
   - Altında noktayla ayrılmış satır: "Servisçi Hakan Demir" (servisçi hesabı atanmışsa) ya da "Şoför ..." (yalnız elle yazılmış
     şoför adı varsa) ya da "Servisçi atanmadı" · "sabah kalkış 07:15" · "akşam kalkış 16:40" · "12 öğrenci".
   - Sağda üç düğme: **"Bugünkü yoklama"**, **"Öğrenci ekle"**, **"Düzenle"**.
   - Kartın içinde servisteki öğrenciler **ada göre** sıralı: ad soyad, yanında soluk "7-A · durak" ve iki düğme: **"Harita"**,
     **"Çıkar"**. (Alma ve bırakma sırası servisçinindir, bu listede görünmez; sıra numaraları
     [Bugünkü yoklama](yonetimin-yoklama-gorunumu.md) penceresinde.)
6. En altta **"Servisçiler (N)"** başlığı ve servisçi hesapları ([Servisçi hesabı](servisci-hesabi.md)).

### Müdür

**Yeni servis aç**

1. Özet kartındaki **"Yeni servis"**e bas. "Yeni servis" penceresi açılır:
   - **"Servis adı"** (örnek yazı "1. Servis")
   - **"Plaka"** (örnek yazı "07 ABC 123") ve yanında **"Servisçi hesabı"** seçimi: "— atanmadı —" ve okulun servisçi hesapları.
     Okulda hiç servisçi hesabı yoksa altında "Servisçi hesabı yoksa önce aşağıdan "Servisçi ekle" ile aç." yazar.
   - **"Şoför adı (hesabı yoksa)"** ve **"Şoför telefonu"**
   - **"Rehber personel"** ve **"Rehber telefonu"** (telefon kutuları ülke kodlu alana dönüşür)
   - **"Sabah kalkış"** ve **"Akşam kalkış"** (saat seçici)
   - **"Güzergâh"** (iki satırlık kutu, en çok 500 karakter)
2. Alttaki **"Kaydet"**e bas ("Kaydediliyor..."). Pencere kapanır, sayfa yeni servisle yeniden çizilir. Hata olursa pencerenin
   altında kırmızı yazar (aşağıda "Kurallar ve sınırlar"). **"Vazgeç"** pencereyi kapatır.

**Servisi düzenle ya da sil**

1. Servisin kartında **"Düzenle"**. Pencerenin başlığı servisin adıdır; kutular dolu gelir.
2. Değiştir, **"Kaydet"**.
3. Silmek için pencerenin solundaki kırmızı **"Sil"**: tarayıcı "Servis silinsin mi? İçindeki öğrencilerin servis kaydı da kalkar."
   diye sorar; onaylarsan servis ve öğrencilerinin servis kaydı (durak, sıra) silinir. Hata tarayıcının uyarı kutusunda çıkar.

**Servise öğrenci ekle ya da başka servisten taşı**

1. Servisin kartında **"Öğrenci ekle"**. "Servise öğrenci ekle" penceresi açılır.
2. Önce **"Durak (isteğe bağlı)"** kutusuna durağı yaz (örnek yazı "ör. Çallı kavşağı, market önü", en çok 120 karakter).
3. **"Öğrenci ara"** kutusuna ad ya da sınıf yaz (örnek yazı "Ad ya da sınıf"); kutu boşken de okulun ilk 60 öğrencisi listelenir.
   Arama Türkçe harf ve büyük/küçük harf farkı gözetmez ("7-a" de "7-A"yı bulur).
4. Her satırda ad, sınıf ve öğrenci bir serviste ise "· bu serviste" ya da "· şu an 2. Servis" yazar:
   - Hiçbir serviste değilse **"Ekle"**,
   - Başka serviste ise **"Taşı"** (öğrenci eski servisinden çıkar, bu servise geçer),
   - Zaten bu serviste ise düğme yok.
   Eşleşme yoksa "Eşleşen öğrenci yok."
5. Düğmeye basınca pencerenin altında yeşil "Öğrenci 1. Servis servisine yazıldı." çıkar; pencere açık kalır, arkadaki sayfa ve
   liste tazelenir, arama ve durak kutusu olduğu gibi durur. Arka arkaya başka öğrenci ekleyebilirsin; durağı farklıysa kutuyu
   her seferinde değiştir.
6. Bitince **"Kapat"**.

**Öğrenciyi servisten çıkar**

1. Öğrencinin satırında **"Çıkar"**. Onay sorulmaz; öğrenci servisten çıkar, durağı ve sırası silinir, sayfa yeniden çizilir.
   Hata olursa tarayıcının uyarı kutusunda çıkar.

**Öğrencinin haritasına bak**

1. Öğrencinin satırında **"Harita"**. "Elif Yılmaz — servis haritası" penceresi açılır: okul, öğrencinin evi ve sefer sürerken servis
   aracı ([Canlı konum ve servis haritası](canli-konum-ve-harita.md)). Evin yerini buradan sen de işaretleyebilir, değiştirebilir,
   silebilirsin ([Evin yerini işaretleme](evi-isaretleme.md)).

**Servisin bugünkü yoklamasına bak**

1. Servisin kartında **"Bugünkü yoklama"**: salt okunur pencere ([Yönetimin yoklama görünümü](yonetimin-yoklama-gorunumu.md)).

Tasarımda (Tasarım 1 önizlemesi):

- Sayfanın üstünde "Servis saatleri" grubu, altında bütün servislerin yerini gösteren "Servisler şu an" haritası, en altta
  "Servisler" grubu ("3 servis"). Her servis tek satır: "Servis 3 · Hakan Demir", altında "07 ABC 123 · 6 öğrenci · eve dönüş ·
  sefer sürüyor", sağda durum rozeti ("Yolda", "Gecikiyor", "Bekliyor", "Okulda", "Bitti").
- Satıra dokununca "Servis 3 · 07 ABC 123" penceresi üç sekmeyle açılır:
  - **"Bilgi"**: Plaka, Servisçi (adı ve telefonu), Kullanıcı adı, Güzergâh, Kapasite ("6 / 16 öğrenci"), Şu an, Servis saatleri.
  - **"Öğrenciler · 6"**: "Sınıf seç" listesi, sınıf seçilince öğrenci listesi, "Durak (ör. Gül Sok. 4)" kutusu ve **"Ekle"**;
    altında sıra numaralı öğrenciler ve her birinde **"Çıkar"** (onay penceresi: "Elif Yılmaz servisten çıkarılsın mı?" —
    "Velisine bildirim gider; servisçinin listesinden de kalkar."). Altta not: "Sırayı servisçi kendi Yoklama sayfasından
    düzenler. Eklenen ya da çıkarılan öğrencinin velisine bildirim gider." Servis doluysa "Servis dolu: kapasite 16 öğrenci.";
    sınıf ya da öğrenci seçilmediyse "Önce sınıfı ve öğrenciyi seç."
  - **"Bugünkü yoklama"**: sabah ve akşam yan yana tablo ([Yönetimin yoklama görünümü](yonetimin-yoklama-gorunumu.md)).
- **"Servis ekle"** penceresi: "Servis no", "Plaka", "Servisçi" seçimi (**"Yeni servisçi hesabı aç"** ya da **"Okuldaki bir
  servisçi"**), yeni hesapta "Ad soyad", "Telefon", "Kullanıcı adı" (yazarken "Kullanılabilir" ya da sorun), "Şifre"; sonra
  "Güzergâh" ve "Kapasite"; not "Servisçi kendisi kayıt olmaz; hesabını okul açar. Servisçi ilk girişte kendi şifresini
  belirler." Düğmeler **"Vazgeç"**, **"Ekle"**. Hata iletileri: "Servis numarasını yaz.", "Servis 4 zaten var.", "Plakayı 07 ABC
  123 biçiminde yaz.", "Servisçinin adını ve soyadını yaz.", "Telefonu 0 5XX XXX XX XX biçiminde yaz.", "Bir servisçi seç.",
  "Güzergâhı yaz.", "Kapasite 1 ile 99 arasında olmalı." Yeni hesapla eklenince "Servis 4 eklendi" penceresi kullanıcı adını ve
  şifreyi bir kez gösterir ("Bu bilgileri servisçiye ver; ilk girişte kendi şifresini belirler. Öğrencileri servis penceresinin
  Öğrenciler sekmesinden eklersin."); var olan servisçiyle eklenince "Servis 4 eklendi; Hakan Demir bu servise atandı."
- Kullanıcının bu pencereler için ayrıca söylediği bir şey yok; dayandığı sözler "servisci kayıt olmicak onu müdür ayarlicak"
  ve "servisci kendi öğrenci listesinide gircek veya okul". 2 Ekim'de onaylanan karara göre kullanıcının yorum yapmadığı ekranlar
  bugünkü siteye benzer: servis no ve kapasite gibi alanlar, durum rozetleri ve "Servisler şu an" haritası önizlemede örnektir;
  bugünkü alanlar (servis adı, şoför ve rehber, kalkış saatleri) ve kurallar geçerlidir.

### Öğretmen

"Servisleri ve servis öğrencilerini düzenler" yetkisi (Roller ve Yetkiler'deki "Okul hayatı" grubu) sende varsa sayfa müdürünkiyle
aynıdır; yukarıdaki adımların hepsini yaparsın, servis saatlerini de değiştirirsin. Yetkin yoksa menünde bu sayfa yoktur (adresi
elle açarsan çocuğun yoksa "Servis bilgileri okul yönetimindedir." görürsün); sunucu yazma isteklerini "Servisleri düzenleme
yetkin yok" diye reddeder. Servise binen çocuğun varsa menünde "Velisi olduğum" altında
"Servisi" satırı çıkar ve orada yalnız çocuğunun kartını görürsün ([Servisim ve servis kartı](servisim.md)).

### Çalışan

Bugün kodda "çalışan" ayrı bir hesap türü değil: servis işlerine bakan kişi öğretmen hesabıyla ve **"Servis Sorumlusu"** hazır
şablonundan açılmış bir ek rolle çalışır; sayfayı müdür gibi kullanır.

Tasarımda (çalışan tanımı, 27 Eylül): kişi okula kişi koduyla "çalışan" olarak eklenir; müdür ona "Servis Sorumlusu" rolünü verince
öğretmen olmasa da bu sayfayı yönetir. Rolsüz çalışan bu sayfayı göremez.

### Servisçi, öğrenci ve veli

Bu sayfanın yönetim kısmı onlara hiç görünmez. Servisçi menüsünde Servis sayfası yoktur; site bu adresle açılırsa onu Yoklama'ya
yönlendirir, girdikten sonra adresi elle yazarsa "Servis bilgileri okul yönetimindedir." görür.

## Kurallar ve sınırlar

- **Kim düzenler:** müdür ve "Servisleri ve servis öğrencilerini düzenler" (`servis.yonet`) yetkisi olan kişi. Yetkinin açıklaması:
  "Şoför telefonlarını ve öğrencilerin durağını görür." Hazır rol şablonu **"Servis Sorumlusu"** yalnız bu yetkiyi taşır
  ([Hazır şablonlar](../roller-yetkiler/hazir-sablonlar.md)). Başka herkes yazmaya kalkarsa: "Servisleri düzenleme yetkin yok".
- **Servis adı** zorunlu (en çok 60 karakter) ve okulda tek: boşsa "Servisin adını yaz (ör. 1. Servis, Konyaaltı hattı)", aynısı
  varsa "Bu adda bir servis zaten var".
- **Plaka** isteğe bağlı; büyük harfe çevrilir, fazla boşluk teke iner; 4–15 karakter, yalnız rakam, harf ve boşluk. Uymazsa
  "Plakayı 07 ABC 123 biçiminde yaz".
- **Telefonlar** isteğe bağlı; yazıldıysa geçerli olmalı. Hata iletisi kutunun adıyla başlar: "Şoför telefonu: …", "Rehber
  telefonu: …".
- **Kalkış saatleri** isteğe bağlı; bozuksa "Saati 07:30 biçiminde yaz". Bunlar yalnız bilgidir, hiçbir şeyi kısıtlamaz; yoklamanın
  ve canlı bilginin açık olduğu saatleri [servis saatleri](servis-saatleri.md) belirler.
- **Şoför adı** ve **rehber** en çok 80, **güzergâh** en çok 500 karakter (güzergâhın satır sonları kartta korunur).
- **Servisçi hesabı** boş ya da bu okulun bir servisçisi olmalı; değilse "Servisçi bulunamadı". Servisin servisçisi değişince ya da
  servisçi hesabı silinince eski servisçinin açık seferi kapanır.
- **Bir öğrenci tek serviste olur.** Başka servise yazılınca oradan taşınır; yeni serviste sabah ve akşam sırasının sonuna konur.
  Sunucu kuralına göre yalnız durağı değişirse sırası korunur; ama ekranda zaten bu serviste olan öğrencide düğme olmadığı için durak
  bugün ancak öğrenciyi çıkarıp yeniden ekleyerek değişir (o zaman sırası sona düşer). Durak en çok 120 karakter.
- **Seçim listesi** okulun onaylı öğrencilerinden gelir (ad ve sınıf), sınıfa ve ada göre sıralı; en çok 60 satır gösterir ve
  "daha fazla var" demez, aramayı daralt.
- **Öğrenciyi çıkarmak onaysızdır** (tek tıkla), servisi silmek onay ister.
- **Başka okulun** servisi ve öğrencisi hiçbir yoldan görünmez ve değiştirilemez: "Servis bulunamadı" (404), "Öğrenci bulunamadı"
  (404), "Öğrenci bu okulun bir servisinde değil" (404).
- **Telefonların görünürlüğü:** şoför ve rehber telefonu yalnız o servisteki öğrenciye, velisine ve okul yönetimine gider.
- **Bölüm kapatılabilir:** müdür [Özellikler](../ozellikler/bolum-ac-kapat.md) sayfasında **"Servis"** ("Servisler, duraklar,
  servis haritası ve canlı servis konumu.") anahtarını kapatırsa servis satırı okuldaki herkesin menüsünden kalkar; adres elle
  açılırsa sayfa "Bu bölüm okulunda kapalı. Okul müdürü Özellikler sayfasından açabilir." der (sunucu da servis isteklerini "Servis
  bu okulda kapalı. Okul müdürü Özellikler sayfasından açabilir." diye reddeder). Servisler ve öğrenci kayıtları silinmez, bölüm
  açılınca geri gelir ([Kapalı bölüm](../ozellikler/kapali-bolum.md)).
- **Sistem yöneticisi** ve **giriş yapmamış ziyaretçi** bu sayfaya giremez.
- **Bilinen açıklar (kod bugün böyle, değiştirilmedi):**
  - "Düzenle → Kaydet" servisçi hesabının adını ve telefonunu servisin "şoför" alanına kopyalar (pencere, servisçinin adını ve
    telefonunu "Şoför adı" ve "Şoför telefonu" kutularına doldurup geri yollar). Sonra servisçi değişse de öğrenci ve veli kartında
    eski servisçinin adı ve telefonu görünmeye devam eder; düzeltmek için iki kutuyu elle boşalt.
  - Servisçi listesi sunucudan alınamazsa sessizce boş sayılır ("Servisçiler (0)"); asıl hata gösterilmez.
  - Şoför adı boş, telefonu doluysa kartta satır " · +90 …" diye ayraçla başlar (yalnız görünüş).

## Kardeşler ve ilgili

**Kardeşler** (aynı klasör, [Servis](README.md)):

- [Servisçi hesabı](servisci-hesabi.md) — sayfanın altındaki "Servisçiler" bölümü.
- [Servis saatleri](servis-saatleri.md) — sayfanın üstündeki kart.
- [Yönetimin yoklama görünümü](yonetimin-yoklama-gorunumu.md) — "Bugünkü yoklama" düğmesi.
- [Canlı konum ve servis haritası](canli-konum-ve-harita.md) ve [Evin yerini işaretleme](evi-isaretleme.md) — "Harita" düğmesi.
- [Sırayı düzenle](sira-duzenleme.md) — eklenen öğrencinin sıraya girişi.
- [Servisim ve servis kartı](servisim.md) — burada girilenlerin öğrenci ve velide görünüşü.

**İlgili:**

- [Hazır şablonlar](../roller-yetkiler/hazir-sablonlar.md), [Yetki listesi](../roller-yetkiler/yetki-listesi.md),
  [Rol atama](../ogretmenler-calisanlar/rol-atama.md) — "Servis Sorumlusu".
- [Bölüm aç / kapat](../ozellikler/bolum-ac-kapat.md), [Kapalı bölüm](../ozellikler/kapali-bolum.md).
- [Sol menü](../menu-ve-arama/sol-menu.md), [Telefonda menü](../menu-ve-arama/telefonda-menu.md).
- [Mezunlar](../egitim-yili/mezunlar.md) ve [Yeni yıl sihirbazı](../egitim-yili/yeni-yil-sihirbazi.md) — servis listelerinin yıl
  geçişindeki durumu (tasarım).
- [Kim neyi görür](../kvkk-ve-gizlilik/kim-neyi-gorur.md) — şoför telefonu, durak.

## Kod tarafı

- Sunucu: [sunucu/bolumler/okul-hayati.md](../../sunucu/bolumler/okul-hayati.md) — `GET /api/servis` (yönetime `servisler`,
  `okulOgrencileri`, `saatDuzenleyebilir`), `POST /api/servis/kaydet`, `/sil`, `/ogrenci`, `/ogrenci-cikar`; `servisGorunumu`
  (şoför: elle yazılan, yoksa servisçi hesabınınki).
- Depo: [sunucu/veri/depo/okul-hayati.md](../../sunucu/veri/depo/okul-hayati.md) — `servisKaydet`, `servisSoforYaz`,
  `servisOgrenciYaz`, `servisOgrenciCikar`, `okulunServisleri`; tablolar `servisler`, `servis_ogrencileri`
  ([SEMA.md](../../sunucu/veri/sema/SEMA.md)).
- Servisçi listesi: [sunucu/bolumler/hesaplar.md](../../sunucu/bolumler/hesaplar.md) (`GET /api/school/servisciler`).
- Yetki: [sunucu/yetki.md](../../sunucu/yetki.md) (`servis.yonet`, şablon "Servis Sorumlusu"); kapalı bölüm
  [sunucu/bolumler/ozellikler.md](../../sunucu/bolumler/ozellikler.md).
- Ön yüz: [public/js/parcalar/19c-okul-hayati.md](../../public/js/parcalar/19c-okul-hayati.md) — `servisSayfasi`, `servis-duzenle`,
  `servis-kaydet`, `servis-sil`, `servis-cikar`, `servis-ogrenci-ac`, `servisAdayCiz`, `servis-ogrenci-ekle`; menü
  [public/js/parcalar/06-menu.md](../../public/js/parcalar/06-menu.md); telefon kutuları
  [public/js/parcalar/04c-telefon.md](../../public/js/parcalar/04c-telefon.md).
- Testler: [testler/test-okul-hayati.md](../../testler/test-okul-hayati.md) (ekleme, aynı ad, bozuk telefon, yazma/taşıma/çıkarma,
  şoför telefonunu kim görür, başka okul), [testler/test-servis-konum.md](../../testler/test-servis-konum.md) (servisçi atama),
  [testler/test-ozellikler.md](../../testler/test-ozellikler.md), [testler/yetki-denetimi.md](../../testler/yetki-denetimi.md).
- Kullanıcıya dönük anlatım: [belge/KILAVUZ.md](../../belge/KILAVUZ.md) ("Yemek listesi, servis …" bölümünün servis kısmı).

## Sık sorulanlar

- **Sabah ve akşam kalkış saati neyi değiştirir?** Hiçbir şeyi; yalnız kartta bilgi olarak görünür. Yoklamanın ve haritanın açık
  olduğu saatler okulun [servis saatleri](servis-saatleri.md)dir.
- **Öğrenciyi başka servise nasıl geçiririm?** Yeni servisin "Öğrenci ekle" penceresinde öğrenciyi bul ve "Taşı"ya bas; eski
  servisinden kendiliğinden çıkar, yeni serviste sıranın sonuna girer.
- **Servisin şoförünün Eğitim Evi hesabı yok, ne yapayım?** "Şoför adı (hesabı yoksa)" ve "Şoför telefonu"nu elle yaz. Yoklamayı ve
  canlı konumu ise yalnız servisçi hesabı olan kişi gönderebilir ([Servisçi hesabı](servisci-hesabi.md)).
- **Servisçi kendi öğrencisini ekleyebilir mi?** Bugün hayır, öğrenciyi okul yazar. Tasarımda servisçi "Sırayı düzenle"
  penceresinden öğrenci ekleyip çıkarabilecek ([Sırayı düzenle](sira-duzenleme.md)).
- **Okulumuzda servis yok, bu bölüm kapatılabilir mi?** Evet, Özellikler sayfasından "Servis"i kapat; kayıtlar silinmez.

## Sırada

- Linux kodlaması (Tasarım 1): servis penceresinin sekmeleri ve servisçinin öğrenci ekleyip çıkarması; öğrenci eklenince ya da
  çıkarılınca velisine bildirim.
- Çalışan olarak ekleme: "Servis Sorumlusu" rolünün öğretmen olmayan çalışana verilebilmesi.
- Tek kişi tek hesap + portallar öğrencide de: servisçi de portal (aynı servisçi iki okulda tek hesap).
- Yıl geçişi: yeni yıl sihirbazında servis listelerini taşıma seçeneği; mezunların servis listelerinden çıkması.
- Güvenlik denetimi / TAM DEBUG: "Düzenle → Kaydet"in servisçi adını şoför alanına kopyalaması, onaysız "Çıkar".
- Çok dil: ekran metinlerinin çeviri kataloğuna girmesi.
- Ekran turu + albüm: Servisler sayfasının görüntüleri baştan alınacak.
