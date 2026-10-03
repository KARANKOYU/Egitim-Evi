# Portallar · + Ekle penceresi

**Durum:** Kodda var; tasarımda ek olarak "Öğretmen" seçeneğinin "Çalışan" olması, velide "Yakınlığın" seçimi ve çocuğu
gösteren "Çocuğunu bağla" onay adımı, kod kutusunda canlı biçim denetimi, Müdür panelinde "Yöneticiyle iletişim" (Destek) ve
profil menüsünün başında "Ekle".

Sağ üstteki "+ Ekle"nin açtığı "Ne eklemek istiyorsun?" penceresi: Veli (çocuğunu ekle), Öğretmen (okuluna katıl; tasarımda
Çalışan) ve Müdür (okulunu açtır).

## Ne işe yarar

Yetişkin hesabı açıldığında rolsüzdür; rolleri (portalları) sonra bu pencereyle eklersin. Üç yolun üçü de bir kodla işler:

- **Veli** — çocuğunun **veli kodunu** yazarsın, çocuk hemen hesabına bağlanır, "Veli · çocuğun adı" portalı açılır.
- **Öğretmen** — kendi **kişi kodunu** görürsün ve okulunun müdürüne verirsin; müdür kodu girince okula eklenirsin.
- **Müdür** — kişi kodunu sistem yöneticisine verirsin; yönetici okulunu ve adresini açıp seni müdür yapar.

Hiçbirinde onay beklenmez: müdürlük başvurusu yoktur (yönetici kişiyi telefon ya da e-postayla kendisi doğrular), öğretmen ve veli
kod girildiği an bağlanır.

## Nereden açılır

- **Üst şeridin sağındaki "Ekle"** (artı simgesi; üzerine gelince "Ekle: çocuğunu, öğretmenliğini ya da okulunu"). Telefonda
  yazı gizlenir, yalnız + simgesi kalır.
- Sol menüde Portallarım'ın sonundaki **"Portal ekle"**.
- Portal dışındaki ana sayfanın son kartı **"Ekle"** ("Çocuğunu, okulunu ya da öğretmenliğini ekle").
- Portalı olmayan hesabın ana sayfasındaki büyük **"Ekle"** düğmesi ([Henüz portalı olmayan yetişkin](portalsiz-hesap.md)).
- **Ayarlar → "Portallarım"** kartının sağ üstündeki **"Ekle"**.

Kim görür: yetişkin hesabı ve ona bağlı okul rolü (öğretmen, müdür). Öğrencide, servisçide ve yöneticide düğme gizlidir.

Tasarımda:

- Üst şeritte **"Ekle"** (ekran okuyucuda "Ekle: çocuğunu ekle, okula katıl ya da okulunu açtır"); profil menüsünün başında
  **"Ekle"** satırı ve altında "çocuğunu ekle, okula katıl, okulunu açtır"; portalı olmayanın ana sayfasında ve sol menüdeki boş
  Portallarım'da **"Ekle"**.
- Velinin Çocuklarım sayfasındaki **"Veli koduyla çocuk ekle"** ve Hesap ayarları → "Kişi kodun" bölümündeki "Çocuklarım"
  satırının **"Çocuk ekle"** düğmesi doğrudan aynı Veli adımını açar (çocuk eklemenin tek görünümü).
- Görünür: veli, öğretmen, müdür, eğitmen ve portalı olmayan yetişkin; öğrencide, servisçide ve tahta hesabında yok.
- Telefonda (üst şerit tanımı) "+ Ekle" şeritten menüye alınır ([Üst şerit](../menu-ve-arama/ust-serit.md)).

## Adım adım

### Seçim penceresi

1. "Ekle"ye bas. Başlığı **"Ne eklemek istiyorsun?"** olan pencerede çizimli üç büyük kutu:
   - **"Veli"** — "Çocuğunun veli kodunu gir; ödevini, notunu, servisini gör."
   - **"Öğretmen"** — "Kişi kodunu okulunun müdürüne ver; seni okula ekler."
   - **"Müdür"** — "Okulunu Eğitim Evi'ne açtır."
2. Birine bas; o yolun penceresi açılır. Her pencerenin altında **"Geri"** (bu seçim penceresine döner) ve **"Kapat"** var.

Telefonda kutular alt alta dizilir, çizim solda küçülür.

Tasarımda: seçenekler satır hâlinde (renkli simge, kalın ad, açıklama, sağda "›"):
"Veli" — "Çocuğunun veli kodunu gir; ödevini, notunu, servisini gör."; **"Çalışan"** — "Kişi kodunu okulunun müdürüne ver; seni
okula çalışan olarak ekler."; "Müdür" — "Okulunu Eğitim Evi'ne açtır: kişi kodunu yöneticimize ver."; altta **"Kapat"**.

### Veli

1. "Veli"yi seç. Pencerenin başlığı **"Çocuğunu ekle"**; metin: "Çocuğunun veli kodunu yaz; ödevini, notunu, servisini
   görürsün."
2. **"Veli kodu"** kutusuna kodu yaz (boşken içinde örnek: `Ab3#-kQx9-+mPt-7?zR`). Tireler yazarken kendiliğinden gelir;
   tireli, tiresiz ya da boşluklu yapıştırdığın kod da olur. Kutunun altında: "Kodu okulundan alırsın. Büyük/küçük harfe dikkat
   et; tireler kendiliğinden gelir."
3. **"Ekle"**ye bas (ya da Enter). Kutu boşsa "Veli kodunu yaz.", 16 karakter değilse "Veli kodu 16 karakterdir." uyarısı kutunun
   altında çıkar. Düğme "Ekleniyor..." olur.
4. Kod doğruysa pencere kapanır:
   - yetişkin hesabındaysan (veli portalında ya da hiç portalın yokken) yeni çocuğun veli portalı açılır ve "Elif Yılmaz hesabına
     eklendi." iletisi çıkar;
   - okul rolündeysen (ör. öğretmen portalında) yerinde kalırsın, ileti: "Elif Yılmaz hesabına eklendi. Sol üstteki menüden
     veli olarak geçebilirsin."
5. Çocuğa "Zeynep Yılmaz veli olarak hesabına bağlandı." bildirimi gider.
6. Hatalı kodda ileti kutunun altına yazılır (aşağıda "Kurallar ve sınırlar").

Tasarımda ("Veli olarak çocuğunu ekle"):

1. Pencerenin başlığı **"Veli olarak çocuğunu ekle"** (solunda geri oku). **"Veli kodu:"** kutusu (örnek `Ab3#-kQx9-+mPt-7?zR`);
   yazarken yanında durum: "7 / 16 karakter" gibi sayaç, doğru biçimde **"Kod biçimi doğru"**.
2. **"Yakınlığın:"** seçimi: "Annesi", "Babası", "Vasisi", "Başka bir yakını".
3. Not: "Veli kodunu çocuğunun okulundan ya da çocuğunun Hesap ayarları → Veli kodun bölümünden alırsın. Büyük/küçük harfe dikkat
   et; tireleri kutu kendisi koyar."
4. **"Geri"** ve **"Devam"**. Hata iletileri: "Kod 16 karakter: harf (büyük ya da küçük), rakam ve ! ? # * + = olabilir; dörder
   dörder tireyle (ör. Ab3#-kQx9-+mPt-7?zR).", "Bu koda bağlı bir öğrenci bulunamadı. Kodu harf harf kontrol et; büyük/küçük harf
   önemli.", "Elif Yılmaz zaten hesabına bağlı."
5. **"Çocuğunu bağla"** adımı: çocuğun kartı ("Elif Yılmaz", "Okul: Test Ortaokulu", "Okul kodu: test-ortaokulu", "Sınıf: 7-A ·
   okul no 214"), "Yakınlığın: Annesi" ve not: "Bağlanınca sol menüde "Veli · Elif Yılmaz" portalın açılır; Elif'e de bildirim
   gider." Düğmeler **"Geri"** ve **"Bağla"**.
6. "Bağla"dan sonra veli portalı açılır, ileti: "Elif Yılmaz hesabına bağlandı; Veli portalın açıldı. Elif'e bildirim gitti."
   Daha önce kaldırdığın çocuğu yeniden bağlarsan onun oturumuna geçersin: "Elif Yılmaz yeniden hesabına bağlandı."

### Öğretmen

1. "Öğretmen"i seç. Başlık **"Öğretmen olarak katıl"**; metin: "Bu kişi kodunu okulunun müdürüne ver. Müdür Öğretmenler > Kodla
   ekle ekranında kodu girince okulun sol üstteki menüde görünür."
2. Kişi kodun iri yazıyla, 4'erli tireli (ör. `T2kA-8m#Q-5xRw-3H=b`); yanında **"Kopyala"** (basınca kısa süre "Kopyalandı", olmazsa
   "Kopyalanamadı") ve **"Yeni kod üret"**.
3. Kutunun altında: "Kod bir kez kullanılır; müdür seni ekleyince yenilenir. Kodu yanlış kişiye verdiysen "Yeni kod üret" ile
   eskisini geçersiz kıl."
4. **"Yeni kod üret"** → onay: "Yeni kod üretilsin mi? Eski kod artık çalışmaz." → düğme "Üretiliyor..." → pencerede "Yeni kod
   üretildi; eskisi artık çalışmaz." Kod ve "Kopyala"nın verdiği değer yenilenir.
5. Kodu müdüre ver (yüz yüze, mesajla). Müdür "Öğretmenler → Kodla ekle"de kodu girip seni ekleyince bildirim gelir: "Test
   Ortaokulu seni öğretmen olarak ekledi. Sol üstteki menüden okuluna geçebilirsin." ([Kodla ekleme](../ogretmenler-calisanlar/kodla-ekleme.md)).

### Çalışan

Bugün bu seçeneğin adı "Öğretmen"dir (yukarıda). Tasarımda (çalışan tanımı, kullanıcı 27 Eylül: "Öğretmen olarak değil, Çalışan
olarak ekle") seçenek **"Çalışan"** olur:

1. Başlık **"Okuluna çalışan olarak katıl"**; metin: "Kişi kodunu okulunun müdürüne ver; seni okula çalışan olarak ekler.
   Görevini (öğretmen, müdür yardımcısı...) müdür verir. Eklenince okulun sol menüde Portallarım altında görünür."
2. Kod kutusu ve **"Kopyala"** (basınca "Kopyalandı"; iki saniye sonra yeniden "Kopyala").
3. Not: "Kod 16 karakterdir: büyük/küçük harf, rakam ve ! ? # * + = olabilir. Bir kez kullanılır; kullanılınca yenilenir.
   Herkese açık yerlerde paylaşma."
4. Düğmeler **"Geri"** ve **"Tamam"**. (Tasarım 1 önizlemesinde bu pencerede "Yeni kod üret" görünmez; tanımlarda kaldırılması diye
   bir karar yok, bugünkü düğme kalır.)
5. Müdür ekleyince bildirim (tanım): "X okuluna çalışan olarak eklendin. Görevini okul yönetimi verecek."; görev verilince "Sana
   Öğretmen görevi verildi." ([Rolsüz çalışan](../ogretmenler-calisanlar/rolsuz-calisan.md), [Rol atama](../ogretmenler-calisanlar/rol-atama.md)).

### Müdür

1. "Müdür"ü seç. Başlık **"Okulunu açtır"**; metin: "Yöneticimize okulunun adını ve bu kodu ver. Okulunu ve adresini
   (egitimevi.org/school/okulun-adi) açıp seni müdür yapar; okul sol üstteki menüde görünür." (adreste sitenin kendi alan adı
   yazar).
2. Kişi kodun ve **"Kopyala"**. Bu pencerede "Yeni kod üret" yoktur.
3. Altında sitenin iletişim bilgileri: başlık **"Yöneticimize ulaş"**, e-posta (dokununca e-posta uygulaması açılır) ve telefon
   (dokununca arama). İkisi de ayarlanmamışsa: "Yöneticimize sayfanın altındaki iletişim bilgilerinden ulaşabilirsin."
   ([Site ayarları](../yonetim/site-ayarlari.md)).
4. Yönetici "Okul aç"ta kodunu girip okulu açınca bildirim: "Test Ortaokulu okulunun müdürü olarak eklendin. Sol üstteki menüden
   okuluna geçebilirsin." ([Okul açma](../yonetim/okul-acma.md)).

Tasarımda ("Okulunu Eğitim Evi'ne açtır"):

- Metin: "Yöneticimize okulunun adını ve bu kodu ver. Yönetici okulunu ve adresini (egitimevi.org/okul-adi) açıp seni müdür
  yapar; okulun sol menüde Portallarım altında görünür." (Gerçek adres biçimi `/school/<okul>`; tasarımda Türkçe eşi `/okul/<okul>`
  da var.)
- Kod kutusu ve "Kopyala"; iletişim bilgileri "E-posta:" ve "Telefon:" satırları ya da "Yöneticinin iletişim bilgileri sayfaların
  altında yazar."; not: "Destek bölümünden de yazabilirsin; talebine okulunun adını, ilini ve bu kodu ekle."
- Düğmeler **"Geri"** ve **"Yöneticiyle iletişim"**: Destek sayfasını açar, ileti "Talebine okulunun adını ve kişi kodunu yaz."
  ([Destek sayfası](../destek/destek-sayfasi.md)).

### Öğrenci, servisçi ve yönetici

Düğme görünmez. Öğrenci ve servisçi hesabını okul açar; yönetici portal kullanmaz. Tasarımda da öğrencide "Kuruma katıl /
öğrenci oturumu ekle" seçeneği **yoktur** (kullanıcı 28 Eylül): öğrencinin yeni kurumu, kurum onu eklediğinde kendiliğinden düşer
([Öğrencide birden çok kurum](ogrencide-portallar.md)).

### Eğitmen

Tasarımda eğitmen rolü olan yetişkin de bu düğmeyi görür (yetişkin hesabıdır); eğitmen rolünün kendisi bu pencereden değil,
yönetici ya da destek tarafından verilir ([Eğitmen rolü](../egitim-icerikleri/egitmen-rolu.md)).

### Ziyaretçi

Giriş yapmadan "+ Ekle" yoktur. Önce hesap açarsın ([Kayıt olma](../giris-hesap/kayit-olma.md)); girişten sonra "Henüz bir
portalın yok" kartı seni bu pencereye çağırır.

## Kurallar ve sınırlar

- **Veli kodu büyük/küçük harf duyarlıdır;** boşluklar ve tireler sayılmaz. Biçimi: [Kişi kodu](kisi-kodu.md).
- **Veli kodu kullanılınca değişmez:** anne ve baba aynı kodla ayrı ayrı ekleyebilir. Yetişkinin kişi kodu ise **tek
  kullanımlıktır**: müdür onunla seni eklediğinde ya da yönetici okulunu açtığında aynı işlemde yenilenir.
- **Veli ekleme sınırları:**
  - hesap başına dakikada 5 deneme: "Çok fazla kod denemesi. Bir dakika bekleyip tekrar dene."
  - aynı bağlantıdan saatte 30 yanlış kod: "Bu bağlantıdan çok fazla yanlış kod denendi. Bir saat sonra tekrar dene."
- **Veli ekleme iletileri** (kutunun altında): "Bu koda sahip bir öğrenci bulunamadı. Kodu öğrencinin Ayarlar sayfasından kontrol
  et.", "Kendi hesabını veli olarak ekleyemezsin.", "Bu öğrenci zaten ekli".
- **Rolsüz hesap veli olur:** veli koduyla ilk çocuğunu ekleyen rolsüz hesap veli olur; okulun yoksa çocuğun okulu senin okulun
  sayılır (takvim, mesaj ve duyurular buna dayanır). Okul rolündeyken eklediğin çocuk da yetişkin hesabına bağlanır.
- **"Yeni kod üret":** saatte en çok 10; fazlası "Kodu çok sık yeniledin. Biraz sonra dene."
- **Hataların yeri:** veli kodu hatası kutunun altında; "Yeni kod üret" hatası penceredeki ileti alanında; pencere hiç
  açılamazsa tarayıcının uyarı kutusunda.
- **Yaş kuralı yok:** + Ekle'deki seçenekler hiçbir yaşta soluklaştırılmaz (kullanıcı 29 Eylül: "yaş şeyi olmasın").
- **Yöneticinin e-postası** bu pencerede doğrudan bağlantıdır (pencere girişten sonra açıldığı için); açılış sayfası ve alt
  bilgi e-postayı sonradan yerleştirir.

## Kardeşler ve ilgili

**Kardeşler** (aynı klasör, [Portallar ve + Ekle](README.md)):

- [Kişi kodu](kisi-kodu.md) — pencerede gösterilen ve yazılan kodun biçimi ve kuralları.
- [Çocuklarım](cocuklarim.md) — veli koduyla eklemenin ikinci yeri.
- [Portallarım](portallarim.md) — eklenen portalın görüneceği yer.
- [Henüz portalı olmayan yetişkin](portalsiz-hesap.md) — pencereye çağıran boş ekran.

**İlgili:**

- [Kodla ekleme](../ogretmenler-calisanlar/kodla-ekleme.md) — müdürün kodu girdiği ekran.
- [Okul açma](../yonetim/okul-acma.md) — yöneticinin kodla okul açması.
- [Veli kodu](../hesaplar/veli-kodu.md), [Veli bağlama](../hesaplar/veli-baglama.md) — öğrencinin kodu ve okulun veliyi bağlaması.
- [Site ayarları](../yonetim/site-ayarlari.md) — Müdür panelindeki iletişim bilgileri.
- [Destek sayfası](../destek/destek-sayfasi.md) — tasarımdaki "Yöneticiyle iletişim".
- [Üst şerit](../menu-ve-arama/ust-serit.md), [Profil menüsü](../menu-ve-arama/profil-menusu.md).

## Kod tarafı

- Ön yüz: [public/js/parcalar/08c-kisilikler.md](../../public/js/parcalar/08c-kisilikler.md) — `EKLE_SECENEK`, `EKLE_BASLIK`,
  `ekleIcerik` (veli, ogretmen, mudur), `ekleAc`, `EYLEMLER['kisilik-ekle' | 'ekle-sec' | 'ekle-cocuk-kaydet' | 'ekle-kod-yenile']`,
  `yoneticiIletisimi`; [public/js/parcalar/05-giris.md](../../public/js/parcalar/05-giris.md) — `kisiKoduGirdisi`,
  `kisiKoduKutusu`, `kisiKoduDenetle`; [public/js/parcalar/06-menu.md](../../public/js/parcalar/06-menu.md) —
  `ekleDugmesiniAyarla` (`#btnEkle` yalnız yetişkinde); [public/js/parcalar/25-tiklama.md](../../public/js/parcalar/25-tiklama.md)
  — "Kopyala" (`panoyaKopyala`); [public/js/parcalar/02b-cizimler.md](../../public/js/parcalar/02b-cizimler.md) — `cocuk-ekle`,
  `kisi-kodu`, `okul-ac` çizimleri; `public/index.html` — `#btnEkle`; CSS `28-yetiskin-hesap.css` (`.ekle-secenek`, `.ekle-kutu`,
  `.ekle-panel`).
- Sunucu: [sunucu/bolumler/kisilik.md](../../sunucu/bolumler/kisilik.md) — `GET /api/kisilikler` (kişi kodu, yan etkisiz),
  `POST /api/kisilik/cocuk`, `POST /api/kisilik/kod` (saatte 10); [sunucu/bolumler/veli.md](../../sunucu/bolumler/veli.md) —
  `cocukBagla` (dakikada 5, IP başına saatte 30 yanlış kod, rolsüzü veli yapma, öğrenciye bildirim);
  [sunucu/site.md](../../sunucu/site.md) — `GET /api/site` (`iletisim`).
- Android: `EkleSayfasi.java` (ayrı depo) — aynı üç seçenek.
- Testler: [testler/test-kisi-kodu.md](../../testler/test-kisi-kodu.md) — anne ve babanın aynı veli koduyla eklemesi, kod
  yenileme; [testler/test-yetiskin.md](../../testler/test-yetiskin.md) — kodla öğretmen ekleme, yöneticinin kodla okul açması.

## Sık sorulanlar

- **Kodu nereden bulurum?** Veli kodunu çocuğunun okulu verir (giriş kâğıdında da yazar); çocuğun kendi Ayarlar sayfasında da
  görür. Kişi kodun bu pencerenin Öğretmen ve Müdür bölümlerindedir.
- **Kodu yazdım, "bulunamadı" diyor.** Büyük/küçük harfe bak; I, l, O, 0 gibi karışan karakterler kodda hiç yoktur.
- **Eşim de aynı çocuğu ekleyebilir mi?** Evet, aynı veli koduyla; kod kullanılınca değişmez.
- **Müdür benim kodumu girdi, ne olacak?** Okula eklenirsin, bildirim gelir, sol menüde "Öğretmen · okul" çıkar; kodun da
  yenilenir.
- **Okulumu açtırmak için başvuru formu var mı?** Hayır. Kişi kodunu ve okulunun adını yöneticiye verirsin, okulu o açar.

## Sırada

- Çalışan olarak ekleme (iş 2): "Öğretmen" seçeneği "Çalışan", müdürün ekranı "Çalışanlar → Kodla ekle", bildirim metinleri.
- HTML (Tasarım 1) → kod: velide "Yakınlığın" ve "Çocuğunu bağla" onay adımı, canlı kod denetimi, "Yöneticiyle iletişim".
- Kullanıcı arama ve destek talepleri (iş 6): Müdür panelinden destek talebine geçiş.
- Üst şerit sadeleştirme (iş 29): "+ Ekle"nin telefonda menüye, profil menüsüne de konması.
- Çok dil (iş 22).
