# Öğretmenler ve çalışanlar · Öğretmenler ve çalışanlar listesi

**Durum:** Kodda var; tasarımda ek olarak sayfanın adının "Çalışanlar" olması, rolsüz ve görevli herkesin tek listede durması,
satırda görev ve durum etiketi ("Rolsüz", "Müdür", "Yeni"), en üstte "Müdürler" bölümü ve satıra basınca açılan kişi penceresi.

Okulun öğretmenlerini (tasarımda bütün çalışanlarını) alt alta gösteren, kişi koduyla eklemenin ve her kişinin penceresinin
açıldığı sayfa.

## Ne işe yarar

Okulda kimin çalıştığını tek yerden görürsün: adı, okuldaki kullanıcı adı, branşı; tasarımda ayrıca hangi görevleri (rolleri)
taşıdığı, rolsüz mü, müdür mü. Yeni birini okula buradan eklersin ([Kodla ekleme](kodla-ekleme.md)), bir kişinin penceresinden
branşını düzenler, görev verir, müdür yapar ya da onu okuldan çıkarırsın.

Kullanıcının kararı (27 Eylül): kişi okula "öğretmen olarak" değil **"çalışan olarak"** eklenir; müdür ona görev (Öğretmen, özel
rol, Kodlayıcı) vermedikçe **rolsüz** görünür. Bu yüzden tasarımda sayfa "Öğretmenler" değil **"Çalışanlar"**dır ve rolsüz
çalışanlar da listededir. Ders programı, ödev, sınav, yoklama gibi yerlerdeki "öğretmen" seçicileri ise yalnız Öğretmen görevi
olanları gösterir; "Çalışanlar" herkesi.

## Nereden açılır

- **Müdür:** sol menüde **"Öğretmenler"** (Hatırlatıcılar'ın altında, Öğrenciler'in üstünde). Ana sayfadaki yeşil
  **"Öğretmenler"** kutucuğu da buraya götürür; kutucuğun alt satırı "28 öğretmen" gibi okulun öğretmen sayısıdır (eski düzenden
  bekleyen başvuru varsa "2 başvuru bekliyor" ve köşede rozet; [Onay bekleyenler](onay-bekleyenler.md)).
- **Ek görevi olan öğretmen:** rolünde **"Okula öğretmen ekler, başvuru onaylar"** ya da **"Öğretmen bilgisi ve branşını
  düzenler"** yetkisi varsa sol menüde, rolünün adını taşıyan başlığın (rol adı yoksa "Ek Yetkiler") altında **"Öğretmenler"**.
- Adres: `#/ogretmenler`.

Tasarımda:

- Sol menüdeki satırın adı **"Çalışanlar"** olur (grup simgesiyle); müdürün ana sayfasındaki kutucuk da **"Çalışanlar"**, alt
  satırı "28 çalışan". Ana sayfanın başlık altı "Test Ortaokulu · 412 öğrenci · 28 öğretmen" gibi öğretmen sayısını söyler.
- Müdürün bildirimlerinde "Yeni öğretmen eklendi — Selin Arı · Türkçe" gibi bir satır da bu sayfaya götürür.
- Çalışanlar sayfasını görmek ve kişi eklemek için yetkinin adı **"Okula çalışan ekler"** olur (bugünkü "Okula öğretmen ekler,
  başvuru onaylar"ın yeni adı; çalışan tanımında kararlı, özel roller önerisinde de `calisan.ekle` diye geçer).

## Adım adım

### Müdür

Bugün (kodda):

1. Sol menüde **"Öğretmenler"**e bas. Sayfanın başlığı **"ÖĞRETMENLER"**, altında okulunun adı.
2. En üstte **"Öğretmen ekle"** kartı: "Öğretmen Eğitim Evi'nde kendi hesabını açar ve sana kişi kodunu verir. Kodu girersin,
   adını görüp eklersin. Başka okulda da çalışıyorsa aynı hesapla girer." Yanında **"Kodla ekle"** düğmesi
   ([Kodla ekleme](kodla-ekleme.md)).
3. Eski düzenden kalmış bekleyen başvuru varsa **"Onay bekleyenler (2)"** bölümü ve satırlarda **"Onayla"** / **"Reddet"**
   ([Onay bekleyenler](onay-bekleyenler.md)).
4. **"Okulun öğretmenleri (28)"** bölümü: her satırda baş harf yuvarlağı, öğretmenin adı, altında okuldaki kullanıcı adı
   (e-postası okulda kayıtlıysa yanında " · " ile e-posta; kendi hesabıyla eklenen öğretmenin e-postası okulda görünmez), sağda
   branş etiketi (ör. "Matematik") ve **"Hesap"** düğmesi. Okulda hiç öğretmen yoksa "Henüz öğretmen hesabı yok."
5. Aramak için üst şeritteki arama kutusuna yaz: satırlar ada, branşa ve kullanıcı adına göre süzülür
   ([Sayfa içi arama](../menu-ve-arama/sayfa-ici-arama.md)). Sayfanın kendi arama kutusu yoktur.
6. Bir öğretmenin **"Hesap"**ına bas: branşını düzenlediğin ve onu okuldan çıkardığın pencere açılır
   ([Hesap penceresi](hesap-penceresi.md), [Okuldan çıkarma](okuldan-cikarma.md)).

Liste sunucudan ada göre sıralı gelir. Müdürün kendisi bu listede yoktur: listede yalnız okulun öğretmen satırları durur.

Tasarımda:

1. Sol menüde **"Çalışanlar"**. Başlık **"Çalışanlar"**, altında "28 kişi · 27 öğretmen · 1 rolsüz" gibi bir özet (rolsüz yoksa
   son parça yazılmaz). Sağ üstte **"Kişi koduyla ekle"** düğmesi ([Kodla ekleme](kodla-ekleme.md)).
2. En üstte **"Müdürler · 3"** bölümü ("bütün yetkiler"): her müdürün adı (senin satırında "sen" etiketi), altında "Müdür ·
   göreve başlama: 1 Eylül 2020" ya da sonradan müdür yapılanda **"Müdür yap" ile eklendi**; öbür müdürlerin satırında
   **"Müdürlükten çıkar"**. Altında not: "Bir müdürü çıkarmak ortak karardır: isteyen müdür ve bir başka müdür onaylar. Son müdür
   çıkarılamaz." Sonra **"Bekleyen ortak kararlar"** bölümü ([Birden çok müdür](birden-cok-mudur.md),
   [Ortak karar](ortak-karar.md)).
3. Altında **"Çalışanlar · 28 kişi"** listesi. Her satırda baş harf yuvarlağı, ad; ikinci satırda branş ve taşıdığı görevler
   virgülle ("Matematik · Öğretmen, Etüt sorumlusu"), hiç görevi yoksa "rol atanmadı". Sağda durum etiketi:
   - **"Rolsüz"** — hiçbir görevi yok ([Rolsüz çalışan](rolsuz-calisan.md));
   - **"Müdür"** — okulun müdürlerinden ([Müdür yapma](mudur-yapma.md));
   - **"Yeni"** — yeni eklenmiş;
   - öbürlerinde **"Hesap"**.
4. Sıra: önce **rolsüzler** (görev bekleyenler gözden kaçmasın), sonra müdürler, sonra öbürleri; her grup kendi içinde ada göre.
5. Bir satıra bas: kişinin penceresi açılır — **"Roller"** (görev çipleri, **"+ Rol ata"**), **"Kullanıcı adı"**,
   **"Müdürlük"** (**"Müdür yap"**) ve **"Kapat"** ([Hesap penceresi](hesap-penceresi.md), [Rol atama](rol-atama.md)).

### Çalışan

Bugün: okula eklenen herkes öğretmen satırıdır; ek görevi (Müdür Yardımcısı gibi) olan öğretmen, rolünde aşağıdaki yetkilerden
biri varsa sayfayı görür:

- **"Okula öğretmen ekler, başvuru onaylar"** — "Öğretmen ekle" kartı ve "Kodla ekle", bekleyen başvurular.
- **"Öğretmen bilgisi ve branşını düzenler"** — listenin kendisi ve satırlardaki "Hesap" (hazır **Müdür Yardımcısı** şablonunda
  açık gelir).
- **"Öğretmeni okuldan çıkarır"** — penceredeki "Okuldan çıkar" bölümü ([Okuldan çıkarma](okuldan-cikarma.md)).

Yalnız "ekler" yetkisi olan, listeyi okuma yetkisi olmadığından sayfayı "Öğretmen ekle" kartı ve **"Henüz öğretmen hesabı yok."**
ile görür (okulda öğretmen olsa bile; aşağıda Kurallar).

Tasarımda: öğretmen olmayan bir çalışan da (ör. "Okul sekreteri" önerisi) rolünde "Okula çalışan ekler" varsa Çalışanlar sayfasını
görür. **Rolsüz çalışan** bu sayfayı hiç görmez ([Rolsüz çalışan](rolsuz-calisan.md)).

### Öğretmen

Ek yetkisi olmayan öğretmenin menüsünde bu sayfa yoktur. Okulun öbür öğretmenlerini ders programında, etütlerde ve mesajlaşırken
alıcı seçicilerinde görür.

### Yönetici ve destek

Okulun içindeki bu sayfayı görmezler. Bugün yönetim panelinin **Okullar** listesinde her okulun öğretmen sayısı, **Müdürler**
listesinde her müdürün okulu ve öğretmen sayısı durur ([Müdürler](../yonetim/mudurler.md)). Tasarımda okul gezgininde okulun
öğrenci/öğretmen sayısı simgenin üzerine gelince görünür ([Okul gezgini](../yonetim/okul-gezgini.md)).

## Kurallar ve sınırlar

- **Yetki:** liste "Öğretmen bilgisi ve branşını düzenler" ister; ekleme kartı "Okula öğretmen ekler, başvuru onaylar" ister.
  Müdürde ikisi de vardır. Yetkisiz istek: "Bu işlem için yetkin yok" (403).
- **Düşen liste boş görünür:** liste isteği herhangi bir sebeple düşerse (yetki eksikliği, bağlantı kopması, sunucu hatası) sayfa
  yine açılır ve **"Henüz öğretmen hesabı yok."** yazar. Bu ileti okulun gerçekten boş olduğunu her zaman göstermez.
- **Yalnız bu okul:** liste okulun kendi öğretmen satırlarıdır; başka okulda da öğretmen olan kişi o okulda ayrı bir satırla durur
  (aynı yetişkin hesabı, ayrı okul rolü).
- **Görünen bilgiler:** okulun satırında kendi hesabıyla eklenen öğretmenin adı, okuldaki kullanıcı adı, telefonu ve branşı
  durur (ekranda ad, kullanıcı adı ve branş görünür); e-postası, şifresi ve T.C. kimlik numarası yetişkin hesabındadır, okul
  görmez ([Kim neyi görür](../kvkk-ve-gizlilik/kim-neyi-gorur.md)).
- **Tasarımda:** müdürler listenin üstünde ayrı durur, rolsüz çalışan da listededir; "öğretmen" seçicileri (ders atama, ödev,
  sınav, yoklama, etüt) yalnız Öğretmen görevi olanları gösterir.

## Kardeşler ve ilgili

**Kardeşler:** [Kodla ekleme](kodla-ekleme.md) · [Hesap penceresi](hesap-penceresi.md) · [Rol atama](rol-atama.md) ·
[Rolsüz çalışan](rolsuz-calisan.md) · [Müdür yapma](mudur-yapma.md) · [Birden çok müdür](birden-cok-mudur.md) ·
[Ortak karar](ortak-karar.md) · [Okuldan çıkarma](okuldan-cikarma.md) · [Onay bekleyenler](onay-bekleyenler.md).

**İlgili:**

- [Müdürün ana sayfası](../ana-sayfa/mudur-ana-sayfasi.md), [Kutucuklar](../ana-sayfa/kutucuklar.md) — "Öğretmenler" (tasarımda
  "Çalışanlar") kutucuğu.
- [Sol menü](../menu-ve-arama/sol-menu.md), [Sayfa içi arama](../menu-ve-arama/sayfa-ici-arama.md).
- [Roller ve yetkiler ekranı](../roller-yetkiler/roller-ekrani.md), [Yetki listesi](../roller-yetkiler/yetki-listesi.md),
  [Hazır şablonlar](../roller-yetkiler/hazir-sablonlar.md).
- [Ders atama](../siniflar-dersler/ders-atama.md) — derse yalnız öğretmen atanır.
- [Dışarı aktarım](../excel-aktarim/disa-aktarim.md) — "Öğretmen listesi" (Branş, verdiği dersler, sınıflar; `ogretmenler.xlsx`).
- [Öğrenciler listesi](../hesaplar/ogrenci-listesi.md) — öğrencilerin listesi (ayrı sayfa).

## Kod tarafı

- Ön yüz: [public/js/parcalar/10-mudur.md](../../public/js/parcalar/10-mudur.md) — `SAYFALAR.ogretmenler` (kart, "Onay
  bekleyenler", "Okulun öğretmenleri", "Hesap" düğmesi; düşen listeyi boş sayma);
  [public/js/parcalar/06-menu.md](../../public/js/parcalar/06-menu.md) — müdür menüsündeki "Öğretmenler", ek yetkili öğretmende
  `ogretmen.onayla` / `ogretmen.duzenle` ile açılan satır;
  [public/js/parcalar/08-ana-sayfa.md](../../public/js/parcalar/08-ana-sayfa.md) — "Öğretmenler" kutucuğu (`/api/school/ozet`
  `bekleyen`, `ogretmen`).
- Sunucu: [sunucu/bolumler/okul.md](../../sunucu/bolumler/okul.md) — `GET /api/school/teachers` (`ogretmen.duzenle`; yalnız
  öğretmen satırları, `bagli` işaretiyle), `GET /api/school/ozet`; [sunucu/yetki.md](../../sunucu/yetki.md) — "Öğretmenler" yetki
  grubu ve şablonlar; [sunucu/veri/depo/kullanicilar.md](../../sunucu/veri/depo/kullanicilar.md) — `okulun`, `okulSayimlari`.
- Testler: [testler/test-yetiskin.md](../../testler/test-yetiskin.md) (kişi adını değiştirince okulun listesinin güncel olması),
  [testler/yetki-denetimi.md](../../testler/yetki-denetimi.md) (yetkisiz rol listeyi alamaz).

## Sık sorulanlar

- **Okulda öğretmen var ama sayfada "Henüz öğretmen hesabı yok." yazıyor.** Ya listeyi okuma yetkin yok (yalnız "ekler" yetkisi
  verilmiş) ya da istek düştü; sayfayı yenile, sürerse müdürden "Öğretmen bilgisi ve branşını düzenler" yetkisini iste.
- **Müdür neden listede yok?** Liste okulun öğretmen satırlarıdır. Tasarımda müdürler sayfanın üstünde "Müdürler" bölümünde durur.
- **Öğretmenin e-postasını neden göremiyorum?** Öğretmen kendi hesabıyla eklendiyse e-postası, şifresi ve T.C. numarası onun
  hesabındadır; okul görmez.

## Sırada

- Çalışan olarak ekleme (iş 2): sayfanın ve menünün adı "Çalışanlar", rolsüz çalışanlar ve görev etiketleri, kişi penceresi,
  "Okula öğretmen ekler" yetkisinin adının "Okula çalışan ekler" olması.
- Paneller ve birden çok müdür (iş 5): listenin üstünde "Müdürler" ve "Bekleyen ortak kararlar".
- Özel roller (iş 24): yeni yetkiler ve şablonlar.
- Optimizasyon (iş 7, "çok gerekli olmayanlar"): "Onay bekleyenler" kalıntısının kaldırılması önerisi.
