# Portallar · Çocuklarım

**Durum:** Kodda var; tasarımda ek olarak her çocuğun kendi penceresi (okul, sınıf, okul no, yakınlık; "Portalını aç", "Çocuğu
kaldır"), satırda "Bu oturum / Oturumuna geç" ve çocuk eklemenin "+ Ekle → Veli" penceresiyle tek görünüme inmesi.

Velinin, hesabına bağlı çocuklarını gördüğü, veli koduyla yeni çocuk eklediği, bir çocuğun sayfalarını açtığı ve çocuğu
hesabından kaldırdığı sayfa.

## Ne işe yarar

Veli bir hesapla birden çok çocuğu izler; çocuklar farklı okullarda olabilir. Çocuklarım sayfası bu çocukların listesidir:
yeni çocuğu buradan da eklersin (sağ üstteki "+ Ekle → Veli" ile aynı iş), bir çocuğun portalını (ilerleyişi, ödevleri,
sınavları, devamsızlığı, ders programı, takvimi) açarsın, artık izlemek istemediğin çocuğu kaldırırsın.

## Nereden açılır

- Veli menüsünün en altında, çizginin altında **"Çocuklarım"**.
- Velinin ana sayfasındaki **"Çocuklarım"** kutucuğu (alt yazı "2 öğrenci bağlı" ya da "Henüz çocuk eklenmedi"; rozet çocuk sayısı).
- Çocuğu kaldırmanın ikinci yeri: **Ayarlar → "Portallarım"** kartında çocuğun satırındaki **"Kaldır"**.
- Okulun açtığı eski düzen öğretmen/müdür hesabında (yetişkin hesabına bağlı olmayan): menüde **"Velisi olduğum"** bölümü
  ("Çocuklarım", "Ödevleri", "Devamsızlığı", "İlerleyişi"; servis yetkisi olmayan öğretmende "Servisi") ve Ayarlar'da **"Veli olarak
  çocuğunu ekle"** kartı.

Tasarımda: veli menüsünün en altında **"Çocuklarım"**; Hesap ayarları → **"Kişi kodun"** bölümünde **"Çocuklarım"** satırı
(çocukların adları "Elif Yılmaz · Can Yılmaz", düğme **"Çocuk ekle"**, ipucu "Çocuğunun veli koduyla eklersin.").

## Adım adım

### Veli

**Sayfa:**

1. Başlık **"ÇOCUKLARIM"**, altında "Çocuğunun kartına tıklayarak portalını aç."
2. **"Çocuk ekle"** kartı: "Çocuğunun veli kodunu gir. Kodu okulundan alırsın. Büyük/küçük harfe dikkat et; tireler kendiliğinden
   gelir." + **"Veli kodu"** kutusu (örnek `Ab3#-kQx9-+mPt-7?zR`) + **"Ekle"**.
3. Altında her çocuk için bir kart (iki sütunlu ızgara): çocuğun adı, okulunun adı, **"Portalını aç"** etiketi ve **"Kaldır"**
   düğmesi. Çocuk yoksa: "Henüz çocuk eklemedin. Çocuğunun veli koduyla ekleyebilirsin."

**Çocuk eklemek:**

1. Veli kodunu kutuya yaz, **"Ekle"**ye bas.
2. Kutu boşsa "Veli kodunu yaz.", 16 karakter değilse "Veli kodu 16 karakterdir."; sunucunun iletileri ("Bu koda sahip bir öğrenci
   bulunamadı. Kodu öğrencinin Ayarlar sayfasından kontrol et.", "Bu öğrenci zaten ekli", "Kendi hesabını veli olarak
   ekleyemezsin.") kartın altında çıkar.
3. Kod doğruysa sayfa yenilenir, yeni çocuğun kartı ve sol menüde "Veli · çocuğun adı" satırı belirir. Çocuğa "Zeynep Yılmaz veli
   olarak hesabına bağlandı." bildirimi gider.

**Bir çocuğun portalını açmak:**

1. Çocuğun kartına bas.
2. Çocuğun sayfaları açılır (önce İlerleyişi). Sol menü o çocuğa göre değişir: "Ana Sayfa", **"Çocuk Listesi"** (Çocuklarım'a
   döner), çocuğun adı başlık olarak, "Ders Programı", "Takvimi", "İlerleyişi", "Ödevleri", "Sınavları", "Devamsızlığı"
   ([Öğrencinin portalını açma](../hesaplar/ogrenci-portalini-acma.md)).

**Çocuğu kaldırmak:**

1. Kartındaki **"Kaldır"**a bas → "Bu çocuk hesabından kaldırılsın mı?" → Tamam.
2. Ya da Ayarlar → "Portallarım"da çocuğun satırında **"Kaldır"** → "Elif Yılmaz hesabından kaldırılsın mı? Bilgilerini artık
   göremezsin." → ileti "Elif Yılmaz hesabından kaldırıldı."
3. Bağ silinir; o çocuk seçiliyse seçim kalkar, Portallarım tazelenir.
4. Son çocuğunu da kaldırırsan hesabın veli olmaktan çıkar (rolsüz yetişkin hesabına döner). Çocuklarım'dan kaldırdıysan
   hesabının ana sayfası açılır: başka portalın (okul rolün) yoksa "Henüz bir portalın yok" kartı
   ([Henüz portalı olmayan yetişkin](portalsiz-hesap.md)), varsa portal kartları ([Portal seçme ekranı](portal-secme-ekrani.md)).
   Ayarlar'dan kaldırdıysan Ayarlar'da kalırsın, menü "Başlangıç" ve "Hatırlatıcılar"a döner.

Tasarımda:

1. Sayfa **"Çocuklarım"**, alt yazı "Hesabına bağlı çocuklar · her çocuk ayrı oturum"; sağ üstte **"Veli koduyla çocuk ekle"**
   düğmesi. Bu düğme ayrı bir form değil, "+ Ekle → Veli" penceresini açar ("Veli olarak çocuğunu ekle": "Veli kodu:",
   "Yakınlığın:", "Devam", sonra "Çocuğunu bağla" → "Bağla" — [+ Ekle penceresi](ekle-penceresi.md)).
2. **"Çocuklar"** grubunda her çocuk bir satır: renkli baş harf rozeti ("EY"), ad, "Test Ortaokulu · 7-A · okul no 214", sağda
   bu oturumun çocuğuysa yeşil **"Bu oturum"**, değilse **"Oturumuna geç"**.
3. Satıra basınca çocuğun penceresi açılır:
   - üstte avatar, "Elif Yılmaz", "Test Ortaokulu · 7-A" ve (bu oturumsa) "Bu oturum";
   - **"Okul:"** Test Ortaokulu, **"Sınıf:"** 7-A, **"Okul no:"** 214, **"Yakınlığın:"** Annesi;
   - **"Portal"** satırı: "Şu an Elif'in oturumundasın" ya da "Can'ın oturumu", alt yazısı "Her çocuğun ayrı oturumu var.";
     bu oturum değilse **"Portalını aç"**;
   - **"Hesabından kaldır"** satırı: "Elif hesabından kaldırılır", alt yazısı "Yeniden eklemek için çocuğunun veli kodunu girmen
     gerekir." ve kırmızı **"Çocuğu kaldır"**;
   - altta **"Kapat"**.
4. **"Çocuğu kaldır"** → onay kutusu: "Elif hesabından kaldırılsın mı?" — "Yeniden eklemek için çocuğunun veli kodunu girmen
   gerekir." (son çocuksa ek olarak "Başka bağlı çocuğun kalmadığı için veli portalın kapanır.") — düğmeler **"Vazgeç"** ve
   **"Kaldır"**.
5. Kaldırdığın çocuk bulunduğun oturumun çocuğuysa öbür çocuğun oturumuna geçersin: "Elif hesabından kaldırıldı; Can oturumuna
   geçildi."; değilse "Can hesabından kaldırıldı." Portallarım'daki satırı da kalkar.
6. Hiç çocuk kalmazsa Tasarım 1 önizlemesinde menüde yalnız "Çocuklarım" kalır ve listede "Hesabına bağlı çocuk yok — çocuğunun veli
   koduyla ekleyebilirsin" satırı görünür (basınca ekleme penceresi açılır).

### Öğretmen, çalışan ve müdür (aynı zamanda veliysen)

1. Okul portalındayken (ör. öğretmen) çocuğunu eklemek için "+ Ekle → Veli"yi kullan; çocuk yetişkin hesabına bağlanır, sen
   bulunduğun portalda kalırsın ("… Sol üstteki menüden veli olarak geçebilirsin.").
2. Okul portalındayken Çocuklarım sayfasına gelirsen (ör. adresle) çocukların sayfaları açılmaz; şu yazı çıkar: "Şu an Öğretmen
   olarak girdin. Çocuğunun ödevlerini, devamsızlığını ve notlarını görmek için sol üstteki menüden veli olarak geç." Altında her
   çocuk için **"Veli · Elif Yılmaz"** düğmesi: basınca o çocuğun veli portalına geçersin ([Portala geçiş](portala-gecis.md)).
3. Okulun açtığı eski düzen öğretmen/müdür hesabında (yetişkin hesabı olmayan): Ayarlar'daki **"Veli olarak çocuğunu ekle"**
   kartı: "Çocuğun (bu okulda ya da başka bir okulda) okuyorsa veli kodunu gir. Menüne "Velisi olduğum" bölümü eklenir; okul
   yönetimi de seni veli olarak bağlayabilir. Büyük/küçük harfe dikkat et; tireler kendiliğinden gelir." + kutu + **"Ekle"**;
   bağlı çocuklar "Bağlı çocuğun: …" diye yazar.

### Öğrenci

Velisi seni veli kodunla eklediğinde bildirim gelir: "Zeynep Yılmaz veli olarak hesabına bağlandı." Veli kodun Ayarlar'dadır
([Kişi kodu](kisi-kodu.md)).

### Okul

Okul da veliyi çocuğa bağlayabilir: öğrencinin **Hesap** penceresinde **"Veliler"** bölümü, **"Veli bağla"** kutusu ("Velinin T.C.
kimlik no'su ya da kullanıcı adı") ve **"Bul"**; altında "Veli önce Eğitim Evi'ne kaydolmuş olmalı. Veli kodu ile kendisi de
bağlanabilir." Okul bağlayınca veliye "Test Ortaokulu seni Elif Yılmaz adlı öğrencinin velisi olarak ekledi." bildirimi gider
([Veli bağlama](../hesaplar/veli-baglama.md)).

## Kurallar ve sınırlar

- **Kod olmadan kimse başkasının çocuğunu göremez;** bağ yalnız veli koduyla ya da okulun bağlamasıyla kurulur.
- **Veli kodu kullanılınca değişmez:** anne ve baba aynı kodla ayrı ayrı ekler. Yanlış birine gittiyse okul yeniler (bağlı veliler
  bağlı kalır).
- **Ekleme sınırları:** hesap başına dakikada 5 deneme ("Çok fazla kod denemesi. Bir dakika bekleyip tekrar dene."), aynı
  bağlantıdan saatte 30 yanlış kod ("Bu bağlantıdan çok fazla yanlış kod denendi. Bir saat sonra tekrar dene.").
- **Bağ yetişkin hesabındadır:** okul portalındayken eklenen çocuk da yetişkin hesabına bağlanır; okul portalında çocuğun
  sayfaları açılmaz, veli portalına geçilir.
- **Velinin okulu:** veli kayıtta okul seçmez; ilk çocuğu bağlanınca çocuğun okulu velinin okulu sayılır (takvim, mesaj ve
  duyurular buna dayanır). Bir çocuk kaldırılınca velinin okulu kalan çocuklardan (ilk bağlanandan) yeniden hesaplanır.
- **Son çocuk:** son bağ da silinince hesap rolsüz olur; menüde yalnız "Başlangıç" ve "Hatırlatıcılar" kalır.
- **Kaldırma geri alınamaz:** yeniden görmek için çocuğun veli kodunu yeniden girmen gerekir. Kaldırma işlem kaydına yazılmaz.
- **İki yerden kaldırma farkı:** Çocuklarım kartındaki "Kaldır" ve Ayarlar'daki "Kaldır" aynı işi yapar; iletileri farklıdır
  (Çocuklarım'da başarı iletisi çıkmaz, sayfa yenilenir).

## Kardeşler ve ilgili

**Kardeşler** (aynı klasör, [Portallar ve + Ekle](README.md)):

- [+ Ekle penceresi](ekle-penceresi.md) — "Veli" seçeneği (aynı ekleme işi).
- [Velide her çocuk ayrı oturum](velide-cocuk-oturumlari.md) — çocuklar arasında geçiş.
- [Portallarım](portallarim.md) — "Veli · çocuğun adı" satırları ve Ayarlar'daki "Kaldır".
- [Kişi kodu](kisi-kodu.md) — veli kodunun biçimi.
- [Henüz portalı olmayan yetişkin](portalsiz-hesap.md) — son çocuk kaldırılınca.

**İlgili:**

- [Öğrencinin portalını açma](../hesaplar/ogrenci-portalini-acma.md) — karta basınca açılan sayfalar.
- [Veli kodu](../hesaplar/veli-kodu.md), [Veli bağlama](../hesaplar/veli-baglama.md) — okul tarafı.
- [Velinin ana sayfası](../ana-sayfa/veli-ana-sayfasi.md) — "Çocuklarım" kutucuğu.
- [Çocuğumun telefonu sayfası](../aile/cocugumun-telefonu-sayfasi.md), [Velinin kopyası](../mesaj/velinin-kopyasi.md).
- [Verilerimi indir](../ayarlar/verilerimi-indir.md) — tasarımda "Çocuğumun verilerini indir".

## Kod tarafı

- Ön yüz: [public/js/parcalar/23-veli-ayarlar.md](../../public/js/parcalar/23-veli-ayarlar.md) — `SAYFALAR.cocuklarim`,
  `cocukKartlari`, okul rolündeyken "Veli · …" düğmeleri, eski düzende "Veli olarak çocuğunu ekle";
  [public/js/parcalar/25-tiklama.md](../../public/js/parcalar/25-tiklama.md) — `cocuk-ekle` (`/api/parent/link`), `cocuk-ac`
  (`S.viewStudentId`), `cocuk-sil` (`/api/parent/unlink`), "Çocuk Listesi" dönüşü;
  [public/js/parcalar/08c-kisilikler.md](../../public/js/parcalar/08c-kisilikler.md) — Ayarlar'daki "Kaldır"
  (`kisilik-cocuk-kaldir`); [public/js/parcalar/06-menu.md](../../public/js/parcalar/06-menu.md) — veli menüsü, "Velisi olduğum"
  bölümü, çocuğun portalındaki menü; [public/js/parcalar/08-ana-sayfa.md](../../public/js/parcalar/08-ana-sayfa.md) — "Çocuklarım"
  kutucuğu.
- Sunucu: [sunucu/bolumler/veli.md](../../sunucu/bolumler/veli.md) — `GET /api/parent/children`, `POST /api/parent/link`,
  `POST /api/parent/unlink`, `cocukBagla`; [sunucu/bolumler/kisilik.md](../../sunucu/bolumler/kisilik.md) —
  `POST /api/kisilik/cocuk`, `POST /api/kisilik/cocuk-kaldir`; [sunucu/veri/depo/kullanicilar.md](../../sunucu/veri/depo/kullanicilar.md)
  — `bagla`, `bagiCoz` (velinin okulu, son çocukta rolsüzleşme), `cocuklari`; [sunucu/iliskiler.md](../../sunucu/iliskiler.md) —
  `childrenOf` (okul rolü satırında boş).
- Testler: [testler/test-veli-coklu.md](../../testler/test-veli-coklu.md) — öğretmenin veli koduyla çocuğunu bağlaması ve bağı
  kaldırması; [testler/test-kisi-kodu.md](../../testler/test-kisi-kodu.md) — anne ve babanın aynı kodla eklemesi.

## Sık sorulanlar

- **Çocuklarım farklı okullarda, olur mu?** Olur. Her çocuk ayrı bir "Veli · çocuğun adı" satırıdır.
- **Çocuğumu kaldırırsam ne olur?** Bilgilerini artık göremezsin; çocuğun hesabı ve okul kayıtları olduğu gibi kalır. Yeniden
  görmek için veli kodunu yeniden girersin.
- **Okul beni veli olarak bağladı, kod girmem gerekir mi?** Hayır; okulun bağlaması yeter, çocuk listende görünür.
- **Öğretmen portalındayken çocuğumun ödevlerini nasıl görürüm?** Sol menüdeki "Veli · çocuğun adı" satırına geç.

## Sırada

- Velide her çocuk ayrı oturum (3 Ekim kararı; kodu Linux'ta): "Bu oturum / Oturumuna geç", çocuğun penceresi, "Yakınlığın".
- HTML (Tasarım 1) → kod: çocuk eklemenin tek pencereye inmesi ("+ Ekle → Veli"), kaldırma onayının yeni metni.
- Kullanıcı arama ve destek talepleri (iş 6): "Verilerimi indir" ve velide "Çocuğumun verilerini indir".
- Tek kişi tek hesap + portallar öğrencide de (iş 19): çocuk birden çok kurumdaysa her kurumu ayrı satır.
