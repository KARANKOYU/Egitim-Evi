# Öğretmenler ve çalışanlar · Hesap penceresi ve branş

**Durum:** Kodda var; tasarımda ek olarak satıra basınca açılan kişi penceresi: "Roller" (birden çok görev, "+ Rol ata"),
"Kullanıcı adı" ve "Müdürlük" ("Müdür yap").

Listede bir öğretmenin "Hesap"ına basınca açılan pencere: okulun o kişide neyi görüp neyi değiştirebileceği (branş, okuldan
çıkarma; eski düzende açılmış hesapta bütün bilgiler ve şifre).

## Ne işe yarar

Öğretmenin hesabı kendisine aittir: adını, e-postasını, şifresini ve T.C. kimlik numarasını kendi hesabından yönetir; okul bunlara
dokunamaz. Okulun bu kişide düzenleyebildikleri **okuldaki satırıdır**: branşı, (rolü yönetme yetkisiyle) ek görevi ve onu
okuldan çıkarmak. Pencere bunu açıkça söyler.

Eski düzenden (kişi kodundan önce) kalan öğretmen hesapları da olabilir: okulun açtığı ya da öğretmenin okulu kendisi seçerek
açtığı ayrı hesaplar. Onlarda okul bütün bilgileri ve şifreyi düzenler, hesabı siler (öğrenci hesabının penceresine benzer; [Hesap penceresi (öğrenci)](../hesaplar/hesap-penceresi.md)).

Tasarımda pencere kişinin **görev merkezidir**: hangi rolleri taşıdığı, yeni görev verme, görevi geri alma ve müdür yapma burada
toplanır (kullanıcı 27 ve 29 Eylül).

## Nereden açılır

- **"Öğretmenler"** sayfası → öğretmenin satırındaki **"Hesap"** ([Öğretmenler ve çalışanlar listesi](liste.md)). Düğme
  "Öğretmen bilgisi ve branşını düzenler" yetkisi olana görünür (müdürde var).

Tasarımda: **"Çalışanlar"** sayfasında satırın **kendisine** basılır (ayrı "Hesap" düğmesi yok).

## Adım adım

### Müdür — kendi hesabıyla eklenmiş öğretmen (bugün okuldaki öğretmenlerin hepsi böyle eklenir)

1. Satırdaki **"Hesap"**a bas. Pencerenin başlığı "Ayşe Kaya — Öğretmen".
2. Üstte not: "Bu öğretmen kendi Eğitim Evi hesabıyla bağlı. Adını, e-postasını ve şifresini kendisi yönetir; T.C. kimlik numarası
   okulla paylaşılmaz."
3. **"Okuldaki kullanıcı adı"** (ör. "ayse.kaya") — yalnız gösterilir, değiştirilemez.
4. **"Branş"** seçicisi: "— belirtme —", Matematik, Türkçe, İngilizce, Din Kültürü ve Ahlak Bilgisi, Sosyal Bilgiler, Fen
   Bilimleri, Müzik, Resim, Beden Eğitimi. Seçip **"Branşı kaydet"**e bas ("Kaydediliyor..."): "Branş kaydedildi." ve arkadaki liste
   yenilenir. Branşı değiştirmeden basarsan "Değişiklik yok."
5. "Öğretmeni okuldan çıkarır" yetkin varsa altta **"Okuldan çıkar"** bölümü ([Okuldan çıkarma](okuldan-cikarma.md)).
6. Pencerenin altında **"Kapat"** (pencerenin dışına basmak da kapatır).

### Müdür — eski düzenden kalan öğretmen hesabı (kişi kodundan önce açılmış)

1. Satırdaki **"Hesap"**a bas. Pencere "Ad Soyad — Öğretmen".
2. Alanlar: **"Ad"**, **"Soyad"**, **"T.C. kimlik no"** ("Yalnızca okul yönetimi görür; öğretmenler ve öğrenciler görmez."),
   **"Kullanıcı adı"** ("Harfle başlar; harf, rakam, nokta ve alt çizgi. Okulun içinde tek olmalı."), **"E-posta (isteğe bağlı)"**
   ("Yazılırsa giriş kodu ve şifre sıfırlama bağlantısı oraya gider."; hesabı kişi kendisi açtıysa kapalıdır: "Bu hesabı kişi
   kendisi açtı; e-postasını yalnızca kendisi değiştirebilir."), **"Doğum tarihi (isteğe bağlı)"**, **"Telefon (isteğe bağlı)"**,
   **"Branş (isteğe bağlı)"**, **"Adres (isteğe bağlı)"**. Değiştir, **"Bilgileri kaydet"**: "Bilgiler kaydedildi." (yalnız değişen
   alanlar gider; hiçbiri değişmediyse "Değişiklik yok.").
3. **"Şifre"** bölümü: "Şifreler geri döndürülemez biçimde saklanır, görüntülenemez." (gerekiyorsa "Bu kişi henüz kendi şifresini
   belirlemedi." ve "Hesaba hiç giriş yapılmadı.") "Unuttuysa yenisini belirle." **"Yeni şifre"** kutusu, **"Rastgele üret"**,
   **"Şifreyi değiştir"**, **"İlk girişte kendi şifresini belirlesin"** kutucuğu (işaretli gelir) ve T.C. no kayıtlıysa
   **"Şifreyi T.C. no yap"** ([Şifre işlemleri](../hesaplar/sifre-islemleri.md); onaylar ve iletiler aynıdır).
4. "Öğretmeni okuldan çıkarır" yetkin varsa **"Hesabı sil"** bölümü: "Öğretmenin dersleri öğretmensiz kalır; verdiği ödev ve
   sınavlar silinmez." ([Okuldan çıkarma](okuldan-cikarma.md)). Altta **"Kapat"**.

### Müdür — tasarımda kişi penceresi

1. **"Çalışanlar"** listesinde bir satıra bas. Pencerenin başında baş harf yuvarlağı, ad ve altında "Matematik · Müdür" gibi branş
   ve müdürlük (hiçbiri yoksa "Çalışan").
2. **"Roller"**: kişinin taşıdığı her görev bir çip ("Öğretmen", "Etüt sorumlusu"…), her çipte **×**. Hiç görevi yoksa
   **"Rolsüz"** etiketi. Altında "Kişi bu rollerin yetkileriyle çalışır." ya da (rolsüzse) "Rol atanana kadar okulda görünür ama
   hiçbir yetkisi yoktur." Yanında **"+ Rol ata"** seçicisi ([Rol atama](rol-atama.md)).
3. **"Kullanıcı adı"** — kişinin okuldaki adı (ör. "ayse.kaya").
4. **"Müdürlük"** — kişi müdürse "Okulun müdürlerinden · bütün yetkiler" ve **"Müdür"** etiketi; değilse "Müdür yap — Onay
   beklemez; senin hesabına gelen doğrulama koduyla hemen olur." ve **"Müdür yap"** düğmesi ([Müdür yapma](mudur-yapma.md)).
5. Altta **"Kapat"**.

Tasarım 1 önizlemesinin kişi penceresinde **branş** ve **"Okuldan çıkar"** yoktur. Tanıma göre branş, kişiye Öğretmen görevi
verilirken seçilir ([Rol atama](rol-atama.md)); önizlemede rollerin de bir "Branş" alanı vardır (branş listesi "Dersler ve
branşlar"dan gelir). "Okuldan çıkar"ın kişi penceresindeki yeri tasarımda gösterilmemiştir (açık nokta;
[Okuldan çıkarma](okuldan-cikarma.md)).

### Çalışan

Bugün: rolünde **"Öğretmen bilgisi ve branşını düzenler"** olan ek görevli öğretmen (hazır **Müdür Yardımcısı** şablonunda açık)
"Hesap" düğmesini görür ve müdür gibi branşı düzenler; eski düzen hesaplarda bilgileri ve şifreyi de değiştirir. "Okuldan çıkar"
bölümü ayrıca **"Öğretmeni okuldan çıkarır"** ister. Kendine ait satırda da pencere açılır, ama kendi hesabını silemez ("Kendi
hesabını silemezsin.").

### Öğretmen (pencerenin sahibi)

Okulun penceresini görmez. Adını, kullanıcı adını, e-postasını, telefonunu ve şifresini kendi **Ayarlar**'ından değiştirir;
yetişkin hesabındaki kullanıcı adı değişince okullardaki satırları da yeni adı alır (okulda alınmışsa sonuna sayı eklenir)
([Giriş bilgileri](../ayarlar/giris-bilgileri.md), [Şifre değiştirme](../ayarlar/sifre-degistirme.md)).

## Kurallar ve sınırlar

- **Yetki:** pencere "Öğretmen bilgisi ve branşını düzenler" ister ("Bu işlem için yetkin yok", 403); başka okulun ya da olmayan bir
  hesap "Hesap bulunamadı" (404).
- **Kendi hesabıyla bağlı öğretmende** okul yalnız branşı ve ek rolü değiştirebilir. Başka bir alan gönderilirse: "Öğretmenin
  adını, kullanıcı adını ve iletişim bilgilerini kendisi kendi hesabından değiştirir." Şifre verilmeye kalkılırsa: "Öğretmen şifresini
  kendi hesabından değiştirir; unuttuysa "Şifremi unuttum" ile yeniler." ([Şifremi unuttum](../giris-hesap/sifremi-unuttum.md)).
- **Branş** yalnız 9 dersten biri olur; listede olmayan: ""X" branş listesinde yok". Okulun kendi branşlarını açması tasarımda
  ([Özel branş ve ders](../siniflar-dersler/ozel-brans-ve-ders.md)).
- **Ek rol** bu pencereden değil, "Roller ve Yetkiler" sayfasından verilir (bugün); sunucu ek rolü "Rol oluşturur ve düzenler"
  yetkisiyle kabul eder ("Rol vermek için "rol yönetir" yetkisi gerekir", "Kendine rol veremezsin", "Rol bulunamadı").
- **Eski düzen hesapta** kurallar okulun açtığı hesaplarınkidir: ad + soyad ve T.C. no zorunlu, kullanıcı adı ve T.C. okul içinde
  tek, e-posta her yerde tek; şifre öğretmen hesabı olduğu için **güçlü** olmalıdır (en az 8 karakter; büyük harf, küçük harf, rakam
  ve özel karakter). Kod okumasına göre "Rastgele üret"in ürettiği şifre (8 harf + 2 rakam, özel karaktersiz) bu kuralı geçmez:
  "Şifrede … bir özel karakter (! ? . * gibi) olmalı" uyarısı çıkar; şifreyi elle yazmak gerekir (denenmedi).
- **Tasarımda:** kişi birden çok görev taşıyabilir; görev × ile alınınca kişi okulda kalır. Müdür yapma ve ortak karar role
  verilemez (yalnız müdür).

## Kardeşler ve ilgili

**Kardeşler:** [Öğretmenler ve çalışanlar listesi](liste.md) · [Okuldan çıkarma](okuldan-cikarma.md) · [Rol atama](rol-atama.md) ·
[Müdür yapma](mudur-yapma.md) · [Kodla ekleme](kodla-ekleme.md).

**İlgili:** [Hesap penceresi (öğrenci)](../hesaplar/hesap-penceresi.md), [Şifre işlemleri](../hesaplar/sifre-islemleri.md),
[Giriş bilgileri](../ayarlar/giris-bilgileri.md), [Kişisel bilgiler](../ayarlar/kisisel-bilgiler.md),
[Ders atama](../siniflar-dersler/ders-atama.md), [Özel branş ve ders](../siniflar-dersler/ozel-brans-ve-ders.md),
[Kim neyi görür](../kvkk-ve-gizlilik/kim-neyi-gorur.md).

## Kod tarafı

- Ön yüz: [public/js/parcalar/10b-hesaplar.md](../../public/js/parcalar/10b-hesaplar.md) — `hesapDuzenleModal` (`GET
  /api/school/hesap?id=`), `bagliOgretmenModal` (bağlı öğretmen: kullanıcı adı, `bransSecici`, "Branşı kaydet", "Okuldan çıkar"),
  `bagli-brans-kaydet` (`POST /api/school/hesap-guncelle { id, brans }`), `hesapAlanlari` (eski düzen hesabın alanları),
  `hesap-bilgi-kaydet`, `hesap-sifre-uret`, `hesap-sifre-kaydet`, `hesap-sifre-tc`, `hesap-sil`.
- Sunucu: [sunucu/bolumler/hesaplar.md](../../sunucu/bolumler/hesaplar.md) — `yonetilenHesap` (yetki ve okul denetimi),
  `hesapGorunumu` (`bagli`), `hesap-guncelle` (bağlı öğretmende yalnız `brans` ve `rolId`), `hesap-sifre`, `hesapDogrula` (branş
  listesi, ek rol kuralları); [sunucu/bolumler/kisilik.md](../../sunucu/bolumler/kisilik.md) — kişinin kendi bilgileri ve okul
  satırlarına yansıması; [sunucu/ortak.md](../../sunucu/ortak.md) — `SUBJECTS`, `sifreSorunu`, `gucluSifreli`.
- Testler: [testler/test-yonetim.md](../../testler/test-yonetim.md) (okul, kodla eklenen öğretmenin kullanıcı adını değiştiremez; yalnız
  branş), [testler/test-yetiskin.md](../../testler/test-yetiskin.md) (pencerede "bağlı" işareti).

## Sık sorulanlar

- **Öğretmenin adı yanlış yazılmış, düzeltebilir miyim?** Kendi hesabıyla eklendiyse hayır; adını kendisi Ayarlar'dan düzeltir,
  okulun listesi de güncellenir.
- **Öğretmen şifresini unuttu.** Giriş ekranındaki "Şifremi unuttum" ile kendisi yeniler; okul öğretmen şifresi veremez (eski düzen
  hesaplar hariç).
- **Branşı neden yalnız 9 ders?** Bugün branş listesi sabittir; okulun kendi branş ve derslerini açması tasarımda var.

## Sırada

- Çalışan olarak ekleme (iş 2): satıra basınca açılan kişi penceresi ("Roller", "+ Rol ata", "Kullanıcı adı", "Müdürlük").
- Paneller ve birden çok müdür (iş 5): penceredeki "Müdür yap".
- Özel branş / ders (iş 36): okulun kendi branşları.
