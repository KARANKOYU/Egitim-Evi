# Öğrenci hesapları · Öğrenciler listesi

**Durum:** Kodda var; tasarımda ek olarak sınıf çipleri, 50'şerli sayfalama, satıra basınca açılan öğrenci penceresi, "sınıfı aç →"
bağlantısı ve yıl geçişinden sonra "Mezunlar" bölümü.

Okulun bütün öğrencilerini tek sayfada gördüğün, aradığın ve her öğrencinin hesabına, portalına buradan girdiğin sayfa.

## Ne işe yarar

Öğrenci Eğitim Evi'ne kendisi kaydolmaz; hesabını okul açar. Bu yüzden okulun öğrencilerinin listesi okul yönetiminin elindedir:
kim kayıtlı, hangi sınıfta, okul numarası ne, kullanıcı adı ne, veli kodu ne, kendi şifresini belirlemiş mi. Hesap açma
([Öğrenci hesabı açma](ogrenci-hesabi-acma.md)), hesabı düzeltme ([Hesap penceresi](hesap-penceresi.md)), toplu şifre dağıtma
([Toplu giriş bilgisi](toplu-giris-bilgisi.md)) ve öğrencinin gördüğü ekrana bakma ([Öğrencinin portalını açma](ogrenci-portalini-acma.md))
hep bu sayfadan başlar.

## Nereden açılır

- **Müdür:** sol menüde **"Öğrenciler"** (adres `#/okul-ogrenciler`). Ana sayfadaki **"Öğrenciler"** kutucuğu da buraya gelir;
  kutucuğun altında okulun öğrenci sayısı yazar ("412 öğrenci").
- **Ek rolü olan öğretmen** (bugünkü "çalışan"): menünün altında rolünün adıyla açılan bölümde (ör. "Müdür Yardımcısı"; rolün adı
  yoksa "Ek Yetkiler") **"Okul Öğrencileri"**. Bu satır rolünde şu yetkilerden biri varsa çıkar: "Öğrenci bilgilerini düzenler",
  "Öğrenci hesabı açar ve okula öğrenci ekler", "Öğrenci portalına girer".
- **Öğrencinin portalından dönerken:** menüdeki **"Öğrenci Listesi"** seni bu sayfaya geri getirir.
- Tasarımda (Tasarım 1 önizlemesi): müdürün menüsünde **"Öğrenciler"**, ana sayfada **"Öğrenciler · 412 öğrenci"** kutucuğu.

## Adım adım

### Müdür

1. Menüden **"Öğrenciler"**e gir. Sayfanın başlığı **"ÖĞRENCİLER"**, altında **"412 öğrenci kayıtlı."**
2. Üstteki kartta:
   - arama kutusu: **"Öğrenci ara — ad, sınıf, okul no ya da kullanıcı adı"**;
   - **"Excel ile toplu"** (Excel Aktarım sayfasına götürür — [İçe aktarım](../excel-aktarim/ice-aktarim.md));
   - **"Öğrenci ekle"** ([Öğrenci hesabı açma](ogrenci-hesabi-acma.md));
   - **"Giriş bilgisi dağıt"** (okulda en az bir öğrenci varsa — [Toplu giriş bilgisi](toplu-giris-bilgisi.md));
   - altında ipucu: **"Öğrenci hesabını okul açar. Ad, soyad ve T.C. no yeter; kullanıcı adı ve şifre boşsa T.C. no olur, öğrenci
     ilk girişte kendi şifresini belirler."**
3. Altında öğrenciler alt alta. Her satırda:
   - renkli yuvarlakta adın baş harfleri, öğrencinin adı soyadı;
   - adın yanında mavi sınıf etiketi (ör. **"7-A"**) ve gri okul numarası etiketi (ör. **"No 214"**); sınıfı ya da numarası
     olmayanda etiket çıkmaz;
   - ikinci satırda kullanıcı adı, **"veli kodu"** ve kodun kendisi (4'erli, tireli: `Ab3#-kQx9-+mPt-7?zR`), öğrenci henüz kendi
     şifresini belirlemediyse soluk **"kendi şifresini belirlemedi"**;
   - sağda **"Hesap"** ([Hesap penceresi](hesap-penceresi.md)) ve **"Portalını aç"**
     ([Öğrencinin portalını açma](ogrenci-portalini-acma.md)).
4. Liste her zaman aynı sırada gelir: önce sınıf adına göre (sınıfsız öğrenciler en sonda), sınıfın içinde okul numarasına göre
   (numarasızlar sonda), sonra ada göre (Türkçe alfabe sırasıyla).
5. Arama kutusuna yazdıkça liste o anda süzülür: ad, soyad, sınıf, okul no, kullanıcı adı ve e-posta içinde arar. Büyük/küçük harf
   ve Türkçe harf fark etmez ("sahin" yazınca "Şahin" de çıkar). Kutuyu boşaltınca hepsi geri gelir. Sayfa açılınca imleç
   kendiliğinden arama kutusundadır (üstte açık bir pencere yoksa).
6. Okulda hiç öğrenci yoksa: **"0 öğrenci kayıtlı."** ve boş kutuda **"Henüz öğrenci kaydı yok."**

Tasarımda (Tasarım 1 önizlemesi):

- Sayfa başlığı **"Öğrenciler"**, alt yazı **"412 öğrenci · 16 sınıf"**, sağ üstte tek düğme **"Öğrenci ekle"**.
- En üstte arama: **"Öğrenci ara (ad, okul no)"**.
- Altında çipler: **"Bütün okul"** ve okulun her sınıfı (5-A, 7-A, 8-B …). Bir çipe basınca liste o sınıfa iner.
- Listenin başlığı **"Bütün okul · 412 öğrenci"** ya da **"7-A · 28 öğrenci"**; arama yazılıysa sona **"bulundu"** eklenir. Sınıf
  seçiliyse başlığın sağında **"sınıfı aç →"** (o sınıfın sayfası — [Sınıf sayfası](../siniflar-dersler/sinif-sayfasi.md)).
- Satırda baş harfler, ad soyad ve altında **"7-A · okul no 214"**. Satırda düğme yoktur: **satıra basınca öğrencinin penceresi**
  açılır (kullanıcı adı, şifre, portal, başarı — [Hesap penceresi](hesap-penceresi.md)).
- Liste 50'şerli sayfadır: altta **"Önceki"**, **"1–50 / 412"**, **"Sonraki"**.
- Arama tutmazsa: **'"Ece" ile eşleşen öğrenci yok (7-A içinde).'**
- Yıl geçişinden sonra mezun olan öğrenciler sınıfsız olarak **"Mezunlar"** altında durur, mezun yılıyla süzülür; müdür oradan
  "okuldan çıkar" diyebilir ([Mezunlar](../egitim-yili/mezunlar.md), [Öğrenciyi okuldan çıkarma](ogrenciyi-okuldan-cikarma.md)).
- Kullanıcının 29 Eylül kararı: yalnız rakamdan oluşan kullanıcı adı (T.C. no) hiçbir listede gösterilmez.

### Çalışan (ek rolü olan öğretmen)

Sayfa aynı sayfadır; ne gördüğün rolündeki yetkilere bağlıdır:

- **"Öğrenci bilgilerini düzenler"** varsa listenin tamamını görürsün ve satırlarda **"Hesap"** çıkar.
- **"Öğrenci hesabı açar ve okula öğrenci ekler"** varsa **"Öğrenci ekle"** çıkar; rolünde ayrıca "Excel ile içe ve dışa aktarım
  yapar" varsa **"Excel ile toplu"** da çıkar. Yalnız bu yetki varsa liste gelmez ama sayfa yine açılır ve "Öğrenci ekle"
  kullanılabilir.
- **"Öğrenci portalına girer"** varsa (ör. hazır **Rehber Öğretmen** şablonu) bütün öğrencileri görürsün ama **dar liste** olarak:
  yalnız ad, sınıf ve okul no; kullanıcı adı, e-posta ve veli kodu gelmez. Satırlarda yalnız **"Portalını aç"** çıkar.
- **"Öğrenci şifresi sıfırlar"** varsa ve liste sana görünüyorsa **"Giriş bilgisi dağıt"** çıkar.

Tasarımda öğretmen olmayan "çalışan" da (ör. "Okul Sekreteri" önerisi) bu sayfaya rolündeki yetkilerle girer; görevi olmayan
"rolsüz çalışan" hiç göremez ([Rolsüz çalışan](../ogretmenler-calisanlar/rolsuz-calisan.md)).

## Kurallar ve sınırlar

- **Kim görür:** müdür; öğretmenlerden yalnız rolünde "Öğrenci bilgilerini düzenler" (tam liste) ya da "Öğrenci portalına girer"
  (dar liste) olan. Sunucu bunu her istekte ayrıca denetler; yetkisi olmayana **"Bu işlem için yetkin yok"** der. Öğrenci, veli,
  servisçi bu sayfayı görmez.
- **Başka okul yok:** liste yalnız senin okulunun öğrencileridir; başka okulun öğrencisi hiçbir yoldan listelenmez.
- **Dar liste kişisel bilgiyi kısar:** yalnız portal yetkisi olan kişiye kullanıcı adı, e-posta, veli kodu, doğum tarihi gitmez.
- **"Giriş bilgisi dağıt" düğmesi** yalnız "Öğrenci şifresi sıfırlar" yetkisi VE görünen bir liste ister. Müdür bir role yalnız
  şifre yetkisini verirse o kişide ne menü satırı ne düğme çıkar (sunucu yine izin verirdi; bugünkü kodda ekranda yolu yok).
- **Liste gelmezse boş okul gibi görünür:** bağlantı koparsa ya da sunucu hata verirse sayfa "0 öğrenci kayıtlı." gösterir; okulun
  boşaldığını sanma, sayfayı yenile.
- **İki arama aynı satırları süzer:** üst şeritteki genel arama ile sayfanın kendi arama kutusu aynı satırlara bakar; ikisini birlikte
  kullanırsan son yazdığın geçerli olur.
- **Öğrenci hesabı listeden silinmez:** öğrenci hesabı kişiye aittir; okul onu silemez (bkz.
  [Öğrenciyi okuldan çıkarma](ogrenciyi-okuldan-cikarma.md)).

## Kardeşler ve ilgili

**Kardeşler** ([Öğrenci hesapları](README.md)): [Öğrenci hesabı açma](ogrenci-hesabi-acma.md) ·
[Hesap penceresi](hesap-penceresi.md) · [Şifre işlemleri](sifre-islemleri.md) · [Veli kodu](veli-kodu.md) ·
[Veli bağlama](veli-baglama.md) · [Öğrenci nakli](ogrenci-nakli.md) · [Toplu giriş bilgisi](toplu-giris-bilgisi.md) ·
[Öğrencinin portalını açma](ogrenci-portalini-acma.md) · [Öğrenciyi okuldan çıkarma](ogrenciyi-okuldan-cikarma.md).

**İlgili:** [İçe aktarım](../excel-aktarim/ice-aktarim.md) ("Excel ile toplu"),
[Dışarı aktarım](../excel-aktarim/disa-aktarim.md) (öğrenci listesi ve veli kodları Excel'e),
[Sınıf sayfası](../siniflar-dersler/sinif-sayfasi.md), [Sınıf açma](../siniflar-dersler/sinif-acma.md),
[Yetki listesi](../roller-yetkiler/yetki-listesi.md), [Hazır şablonlar](../roller-yetkiler/hazir-sablonlar.md),
[Sayfa içi arama](../menu-ve-arama/sayfa-ici-arama.md), [Sol menü](../menu-ve-arama/sol-menu.md),
[Müdürün ana sayfası](../ana-sayfa/mudur-ana-sayfasi.md), [Mezunlar](../egitim-yili/mezunlar.md),
[Kim neyi görür](../kvkk-ve-gizlilik/kim-neyi-gorur.md).

## Kod tarafı

- Ön yüz: [public/js/parcalar/10-mudur.md](../../public/js/parcalar/10-mudur.md) — `SAYFALAR['okul-ogrenciler']` (liste, sıralama,
  sayfanın arama kutusu, düğmelerin yetki şartları); [public/js/parcalar/06-menu.md](../../public/js/parcalar/06-menu.md) — menüde
  "Öğrenciler" ve ek rolde "Okul Öğrencileri"; [public/js/parcalar/08-ana-sayfa.md](../../public/js/parcalar/08-ana-sayfa.md) —
  müdürün "Öğrenciler" kutucuğu.
- Sunucu: [sunucu/bolumler/okul.md](../../sunucu/bolumler/okul.md) — `GET /api/school/students` (tam liste `ogrenci.duzenle`, dar
  liste `ogrenci.portal`), `GET /api/school/ozet` (kutucuktaki sayı); [sunucu/yetki.md](../../sunucu/yetki.md) — yetkiler ve hazır
  şablonlar.
- Testler: [testler/yetki-denetimi.md](../../testler/yetki-denetimi.md) (her uç her rolle), [testler/test-yetiskin.md](../../testler/test-yetiskin.md)
  (başka okulun müdürünün öğrenci listesini görememesi).

## Sık sorulanlar

- **Öğrencim listede yok.** Hesabı açılmamış olabilir ([Öğrenci hesabı açma](ogrenci-hesabi-acma.md)); başka okuldan geldiyse
  "Öğrenci ekle"de T.C. no ve doğum tarihiyle alınır ([Öğrenci nakli](ogrenci-nakli.md)). Arama kutusunu boşaltmayı da dene.
- **"kendi şifresini belirlemedi" ne demek?** Öğrenci okulun verdiği şifreyle (ya da T.C. no ile) henüz girip yenisini koymadı.
  Kâğıdını kaybettiyse [Toplu giriş bilgisi](toplu-giris-bilgisi.md) ya da [Şifre işlemleri](sifre-islemleri.md).
- **Rehber öğretmen neden kullanıcı adlarını göremiyor?** Yalnız "Öğrenci portalına girer" yetkisi varsa liste dardır; kullanıcı
  adı, e-posta ve veli kodu ona gönderilmez.
- **Öğrenciyi listeden silebilir miyim?** Hayır; öğrenci hesabı kişiye aittir. Ayrılan öğrenci bugün sınıfsız bırakılır.

## Sırada

- Tasarım 1'deki liste: sınıf çipleri, 50'şerli sayfalama, satıra basınca öğrenci penceresi, "sınıfı aç →".
- Yeni yıl sihirbazıyla "Mezunlar" bölümü ve müdürün "okuldan çıkar"ı (yıl geçişi işi).
- Rakamdan oluşan kullanıcı adının listelerde gösterilmemesi (tek kişi tek hesap işi).
