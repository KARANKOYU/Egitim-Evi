# Portallar · Kişi kodu

**Durum:** Kodda var; tasarımda ek olarak Hesap ayarlarında kendi kod bölümü ("Kişi kodun" ya da öğrencide "Veli kodun",
"Kopyala") ve kod yazılan kutunun yanında canlı "7 / 16 karakter" — "Kod biçimi doğru" durumu.

Her yetişkin hesabının ve her öğrencinin 16 karakterlik kodu: yetişkin onu okuluna ya da yöneticiye verip portal açtırır,
öğrencininki (veli kodu) velisinin çocuğu eklemesine yarar.

## Ne işe yarar

Eğitim Evi'nde kimse başkasını adıyla ya da e-postasıyla bir okula, bir çocuğa bağlayamaz; bağlamak için o kişinin kodu
gerekir. Kodu yalnız sahibi görür ve kime vereceğine o karar verir:

| Kimin kodu | Adı | Kime verilir | Ne olur |
|---|---|---|---|
| Yetişkin hesabı (veli, öğretmen, müdür) | kişi kodu | okulunun müdürüne | müdür seni okula öğretmen olarak ekler ([Kodla ekleme](../ogretmenler-calisanlar/kodla-ekleme.md)) |
| Yetişkin hesabı | kişi kodu | sistem yöneticisine | yönetici okulunu açar, seni müdür yapar ([Okul açma](../yonetim/okul-acma.md)) |
| Öğrenci | veli kodu | velisine | veli "+ Ekle → Veli"ye yazar, çocuk hesabına bağlanır ([+ Ekle penceresi](ekle-penceresi.md)) |

Servisçi ve yönetici hesabında kod yoktur; okul rolü satırlarının da (okuldaki öğretmen/müdür satırı) ayrı kodu yoktur, kod
yetişkin hesabınındır.

## Nereden açılır

Kodun görüldüğü yerler:

- **Yetişkin:** "+ Ekle → Öğretmen" ve "+ Ekle → Müdür" panellerinde iri yazıyla, yanında **"Kopyala"** (Öğretmen panelinde
  ayrıca **"Yeni kod üret"**). Pencere her açılışta kodu sunucudan yeniden alır (kod kullanılınca değişmiş olabilir).
- **Öğrenci:** **Ayarlar → "Hesap bilgilerin"** kartında **"Veli kodun (velinle paylaş)"** satırı ve **"Kopyala"**; altında
  "Velin bu kodu Eğitim Evi'nde + Ekle > Veli ekranına yazınca hesabına bağlanır. Büyük/küçük harf fark eder." Öğrencinin ana
  sayfasındaki "Ayarlar" kutucuğu da "Hesabın ve veli kodun" der.
- **Okul (müdür ya da yetkilisi):** öğrencinin **Hesap** penceresinde **"Veli kodu"** bölümü, **"Kopyala"** ve **"Yeni kod
  üret"** ([Hesap penceresi](../hesaplar/hesap-penceresi.md)); giriş bilgisi kâğıdında ve listesinde "Veli kodu" sütunu
  ([Toplu giriş bilgisi](../hesaplar/toplu-giris-bilgisi.md)); dışarı aktarımda "Öğrenci listesi ve veli kodları"
  ([Dışarı aktarım](../excel-aktarim/disa-aktarim.md)).

Kodun yazıldığı yerler: "+ Ekle → Veli" ve Çocuklarım'daki **"Veli kodu"** kutusu, müdürün **"Öğretmen ekle"** penceresindeki
**"Öğretmenin kişi kodu"** kutusu, yöneticinin "Okul aç" penceresindeki **"Müdürün kişi kodu"** kutusu.

Tasarımda: Hesap ayarlarında kendi kod bölümü; başlığı **"Kişi kodun"** (öğrencide **"Veli kodun"**), profil menüsünde de aynı
adla ve "kopyala, paylaşma" alt yazısıyla durur (yönetim panelindeki bir ipucu bu bölümü "Kodum" diye anar). Bölümde kod,
**"Kopyala"** ve açıklama —

- öğrenci: **"Veli kodun"** — "Velin seni hesabına bu kodla ekler. Kimseyle paylaşma."
- veli: **"Kişi kodun"** — "Bir okul seni çalışan olarak eklerken bu kodu ister."
- öğretmen ve müdür: **"Kişi kodun"** — "Başka bir okul seni eklerken bu kodu ister."
- portalı olmayan yetişkin: "Bir okul seni çalışan olarak eklerken ya da yönetici okulunu açarken bu kodu ister."
- eğitmen: "Bir okul seni eklerken bu kodu ister."
- servisçide bu bölüm yoktur.

## Adım adım

### Öğretmen

1. Sağ üstteki **"Ekle"** → **"Öğretmen"**. Kodunu iri yazıyla görürsün (ör. `T2kA-8m#Q-5xRw-3H=b`).
2. **"Kopyala"**ya bas (düğme kısa süre "Kopyalandı" der) ve kodu okulunun müdürüne ver.
3. Kodu yanlış kişiye verdiysen **"Yeni kod üret"** → "Yeni kod üretilsin mi? Eski kod artık çalışmaz." → "Yeni kod üretildi;
   eskisi artık çalışmaz."
4. Müdür seni ekleyince kodun kendiliğinden yenilenir; eski kodu bilen biri seni ikinci kez bir okula ekleyemez.

### Çalışan

Tasarımda öğretmenle aynı; pencerenin adı "Okuluna çalışan olarak katıl" ([+ Ekle penceresi](ekle-penceresi.md)).

### Müdür

Kodunu iki yerde kullanırsın:

1. **Okulunu açtırmak için:** "Ekle" → **"Müdür"** → kodu **"Kopyala"** ile al, okulunun adıyla birlikte yöneticiye ver
   (pencerede yöneticinin e-postası ve telefonu yazar).
2. **Öğretmen eklemek için** (başkasının kodunu yazarsın): **Öğretmenler → "Kodla ekle"** → pencere **"Öğretmen ekle"**: "Öğretmenden
   kişi kodunu iste. Kodu Eğitim Evi'nde + Ekle > Öğretmen ekranında görür. Kod bir kez kullanılır." → **"Öğretmenin kişi kodu"**
   kutusu → **"Bul"** ("Aranıyor...") → "Bu kodun sahibi" altında adın bir kısmı gizli hâli ("Ay** Ka**") ve "Adın bir kısmı
   gizli. Öğretmenin adıyla uyuşuyorsa ekle." → isteğe bağlı branş → **"Okula ekle"**. Ayrıntısı:
   [Kodla ekleme](../ogretmenler-calisanlar/kodla-ekleme.md).

### Veli

1. Çocuğunun veli kodunu okuldan ya da çocuğundan al (giriş kâğıdında "Veli için" satırında: "… adresinden kendi hesabınızı açın
   (Kayıt ol). Girişten sonra sağ üstteki + Ekle > Veli ekranına bu veli kodunu yazın: … (büyük/küçük harf fark eder)").
2. **"Ekle" → "Veli"** ya da **Çocuklarım → "Çocuk ekle"** kutusuna yaz. Tireler kendiliğinden gelir.
3. Senin de bir kişi kodun vardır (yetişkin hesabısın): bir okulda öğretmen olursan onu kullanırsın.

### Öğrenci

1. **Ayarlar**'a gir; "Hesap bilgilerin" kartında **"Veli kodun (velinle paylaş)"** satırı.
2. **"Kopyala"** ile al, velinle paylaş. Anne ve baba aynı kodu ayrı ayrı kullanabilir; kod kullanılınca değişmez.
3. Kodun yanlış birine gittiyse okulundan yenilemesini iste (öğrenci kodunu kendisi yenileyemez).

### Okul (müdür ya da öğrenci hesabı yetkisi olan)

1. Öğrencinin **Hesap** penceresinde "Veli kodu" bölümünde kod ve "Kopyala"; altında "Veli bu kodu + Ekle > Veli ekranına yazar.
   Anne ve baba aynı kodu kullanabilir; kod yanlış kişiye verildiyse yenile."
2. **"Yeni kod üret"** → "Yeni veli kodu üretilsin mi? Eski kod çalışmaz olur; bağlı veliler bağlı kalır."
   ([Veli kodu](../hesaplar/veli-kodu.md)).

### Yönetici

1. Yönetim → Okullar → **"Okul aç"** penceresinde okulu seç, adresini yaz, **"Müdürün kişi kodu"** kutusuna kişinin kodunu yaz.
2. **"Bul"** ("Aranıyor...") → "Bu kodun sahibi": kişinin tam adı, e-postasının gizli hâli (ilk iki harf, dört yıldız, alan adı:
   "ay****@example.com"), kullanıcı adı ve varsa "3 okulda rolü var"; altında "Adı ve e-postası okulunu açtırmak isteyen kişiyle
   uyuşuyorsa "Okulu aç"a bas."
3. "Bul" yapmadan "Okulu aç"a basılırsa: "Önce "Bul" ile kodun kime ait olduğuna bak." Ayrıntısı: [Okul açma](../yonetim/okul-acma.md).

### Eğitmen

Tasarımda eğitmen de yetişkin hesabıdır ve kişi kodu vardır ("Bir okul seni eklerken bu kodu ister.").

### Servisçi

Kodu yoktur; açılış sayfasındaki SSS de "Servisçi hesabında kod yoktur." der. Tasarım 1'de de servisçinin Hesap ayarlarında kod
bölümü yoktur.

## Kurallar ve sınırlar

- **Biçim:** 16 karakter; yalnız İngilizce büyük harf, küçük harf, rakam ve `! ? # * + =`. Her kodda en az bir büyük harf, bir
  küçük harf, bir rakam ve bir işaret vardır; ilk karakter harftir (Excel'e yapıştırınca `+`, `-`, `=` ile başlayan hücre formül
  sanılmasın).
- **Karışan karakter yok:** büyük harfte I, L, O; küçük harfte l, o; rakamda 0 ve 1 kodda hiç geçmez.
- **Büyük/küçük harf fark eder.** `aB3#…` ile `Ab3#…` ayrı kodlardır.
- **Görünüşü:** ekranda, kâğıtta ve Excel'de 4'erli dört grup, aralarında tire: `Ab3#-kQx9-+mPt-7?zR`. **"Kopyala"** da tireli
  biçimi verir. Tire kodun karakteri değildir, ayırıcıdır.
- **Kod yazılan kutu:**
  - her 4 karakterden sonra, bir sonraki karakter yazılınca tire kendiliğinden gelir (sonda tire kalmaz; silerken tire de gider,
    imleç yerinde kalır); kutu en çok 19 karakter alır;
  - tireli, tiresiz ya da boşluklu yapıştırılan kod olur; yapıştırılan metinde başka yazı da varsa ("Veli kodu: Ab3#-kQx9-+mPt-7?zR")
    kutuya yalnız kod alınır, araya karışmış görünmez karakterler atılır;
  - telefon klavyesi harfi büyütmez, düzeltmez; harfleri birleştirerek yazan klavyede tireler sözcük bitince gelir.
- **Uyarılar** (kutunun altında): "Veli kodunu yaz." / "Kişi kodunu yaz." / "Müdürün kişi kodunu yaz." (boşsa); "Veli kodu 16
  karakterdir." / "Kişi kodu 16 karakterdir." (eksik ya da fazla).
- **Yetişkinin kodu tek kullanımlıktır:** müdür onunla seni eklediğinde ya da yönetici onunla okul açtığında aynı işlemde
  yenilenir. Aynı kod bu arada başka yerde kullanıldıysa: "Bu kod az önce kullanıldı. Öğretmenden yeni kodunu iste." (müdür),
  "Bu kod az önce kullanıldı. Kişiden yeni kodunu iste." (yönetici).
- **"Yeni kod üret":** yetişkin kendi kodunu saatte en çok 10 kez yeniler ("Kodu çok sık yeniledin. Biraz sonra dene.").
- **Öğrencinin veli kodu kullanılınca değişmez;** yalnız okul yeniler. Yenilenince bağlı veliler bağlı kalır, eski kod çalışmaz.
- **Kod yanlışsa:**
  - veli: "Bu koda sahip bir öğrenci bulunamadı. Kodu öğrencinin Ayarlar sayfasından kontrol et."
  - müdür: "Bu kodla bir hesap bulunamadı. Kodu öğretmenden yeniden iste; kod bir kez kullanılınca yenilenir."
  - yönetici: "Bu kodla bir hesap yok."; yöneticinin kendi kodu ya da bir yönetici: "Sistem yöneticisi hesabı müdür yapılamaz.";
    okul hesabına ait kod: "Bu kod bir okul hesabına ait; müdür, kendi hesabını açmış bir kişi olabilir."
- **Tahmine karşı sınırlar:**
  - veli: hesap başına dakikada 5 deneme ("Çok fazla kod denemesi. Bir dakika bekleyip tekrar dene."), aynı bağlantıdan saatte 30
    yanlış kod ("Bu bağlantıdan çok fazla yanlış kod denendi. Bir saat sonra tekrar dene.");
  - müdür: dakikada 30 deneme ("Çok fazla deneme. Biraz bekle."), aynı bağlantıdan saatte 30 yanlış kod ("Çok fazla yanlış kod
    denendi. Bir saat sonra tekrar dene.");
  - yönetici: "Bul" dakikada 30 ("Çok fazla deneme. Biraz bekle."), aynı bağlantıdan saatte 30 yanlış kod.
  - 61 karakterlik alfabe ve 16 karakterle tahmin edilemeyecek kadar çok olasılık var (~10^28).
- **Kod adrese yazılmaz:** müdür ve yönetici kodu istek gövdesinde gönderir; adres satırına ve günlüklere düşmez, `# + ?`
  bozulmaz.
- **Müdür adı gizli görür:** kodla ekleme öncesi müdür kişinin tam adını değil, her sözcüğün ilk iki harfini görür ("Ay** Ka**");
  kod ad öğrenme aracına dönmesin diye. Yönetici tam adı ve gizli e-postayı görür.
- **Ne zaman üretilir:** yetişkinin kodu hesap açılırken (e-posta onayında), öğrencinin veli kodu hesabıyla birlikte üretilir.
  Eski 10 ve 15 haneli kodlar geçmez; sunucu açılışta kodu boş kalan her hesaba yenisini yazar (veli bağları ve okul rolleri
  etkilenmez).

## Kardeşler ve ilgili

**Kardeşler** (aynı klasör, [Portallar ve + Ekle](README.md)):

- [+ Ekle penceresi](ekle-penceresi.md) — kodun gösterildiği ve yazıldığı pencere.
- [Çocuklarım](cocuklarim.md) — veli kodunun ikinci yazıldığı yer.
- [Portallarım](portallarim.md) — kod kullanılınca gelen portal.

**İlgili:**

- [Kodla ekleme](../ogretmenler-calisanlar/kodla-ekleme.md), [Okul açma](../yonetim/okul-acma.md) — kişi kodunu yazanlar.
- [Veli kodu](../hesaplar/veli-kodu.md), [Hesap penceresi](../hesaplar/hesap-penceresi.md),
  [Toplu giriş bilgisi](../hesaplar/toplu-giris-bilgisi.md), [Dışarı aktarım](../excel-aktarim/disa-aktarim.md).
- [E-posta onayı](../giris-hesap/eposta-onayi.md) — yetişkinin kodunun üretildiği an.
- [Kim neyi görür](../kvkk-ve-gizlilik/kim-neyi-gorur.md).

## Kod tarafı

- Ön yüz: [public/js/parcalar/05-giris.md](../../public/js/parcalar/05-giris.md) — `kisiKoduSade`, `kisiKoduBicim`,
  `kisiKoduAyikla` (yapıştırılan metinden kod), `kisiKoduKutusu` ("Kopyala"), `kisiKoduGirdisi` (en çok 19, `placeholder`),
  `kisiKoduDenetle`, kutunun tire ve imleç davranışı; [public/js/parcalar/08c-kisilikler.md](../../public/js/parcalar/08c-kisilikler.md)
  — "Yeni kod üret"; [public/js/parcalar/23-veli-ayarlar.md](../../public/js/parcalar/23-veli-ayarlar.md) — öğrencinin "Veli
  kodun"; [public/js/parcalar/10b-hesaplar.md](../../public/js/parcalar/10b-hesaplar.md) — "Kodla ekle" ve öğrencinin veli kodunu
  yenileme; [public/js/yonetim/09-yonetici.md](../../public/js/yonetim/09-yonetici.md) — "Okul aç"taki "Bul".
- Sunucu: [sunucu/ortak.md](../../sunucu/ortak.md) — `KISI_KODU_DESENI`, `kisiKoduUret` (`crypto.randomInt`), `kisiKoduSade`,
  `kisiKoduBicim`; [sunucu/bolumler/kisilik.md](../../sunucu/bolumler/kisilik.md) — `POST /api/kisilik/kod`;
  [sunucu/bolumler/veli.md](../../sunucu/bolumler/veli.md) — `cocukBagla`; [sunucu/bolumler/hesaplar.md](../../sunucu/bolumler/hesaplar.md)
  — `ogretmen-bul`, `ogretmen-ekle`, `adMaskele`; [sunucu/bolumler/yonetici-okul.md](../../sunucu/bolumler/yonetici-okul.md) —
  `kisi-bul`, `okul-ac`, `epostaKisalt`; [sunucu/veri/depo/kullanicilar.md](../../sunucu/veri/depo/kullanicilar.md) —
  `yeniKisiKodu`, `eslesmeKoduTuket`, `eksikKodlariDoldur`; tablolarda `veli_kodu` ve `eslesme_kodu` sütunları
  ([SEMA.md](../../sunucu/veri/sema/SEMA.md)).
- Android: `KisiKodu.java` (ayrı depo) — aynı ayırıcılar ve 4'erli gösterim.
- Testler: [testler/test-kisi-kodu.md](../../testler/test-kisi-kodu.md) — biçim, büyük/küçük harf, tireli/boşluklu yapıştırma,
  eski uzunlukların geçmemesi, tek kullanım ve yenileme, öğrencinin kodunun değişmemesi.

## Sık sorulanlar

- **Kodumu herkese verebilir miyim?** Vermemelisin. Kişi kodun seni bir okula ekletir; yalnız katılacağın okulun müdürüne ya da
  okulunu açacak yöneticiye ver. Öğrencinin veli kodu yalnız velisine verilir.
- **Kodda "0" mı "O" mu var?** İkisi de yok; karışan karakterler kodda hiç kullanılmaz.
- **Kodu tiresiz yazsam olur mu?** Olur. Kutu tireleri kendisi koyar; tiresiz ya da boşluklu yapıştırmak da olur.
- **Müdür kodumu girdi, eski kodum ne oldu?** Kullanıldığı anda yenilendi; yeni kodunu "+ Ekle → Öğretmen"de görürsün.
- **Çocuğumun kodu değişti, bağım koptu mu?** Hayır. Okul kodu yenileyince bağlı veliler bağlı kalır; yalnız eski kod artık
  kimseyi bağlamaz.
- **Servisçinin kodu var mı?** Hayır; servisçi hesabını okul açar.

## Sırada

- Çalışan olarak ekleme (iş 2): müdürün "Çalışanlar → Kodla ekle"si; kod kişiyi rolsüz çalışan olarak ekler.
- Tek kişi tek hesap + portallar öğrencide de (iş 19): yetişkin hesabında T.C. kayıtlı değilse müdürün öğrenciyi "Öğrenciler →
  Kodla ekle" ile kişi koduyla eklemesi (öneri).
- Paneller (iş 5): okul ekle sayfasında birden çok müdürün kişi koduyla eklenmesi, "Müdür ata".
- HTML (Tasarım 1) → kod: Hesap ayarlarında "Kişi kodun" / "Veli kodun" bölümü, kod kutusunun yanında canlı durum.
