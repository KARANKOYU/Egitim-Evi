# Öğrenci hesapları · Öğrencinin portalını açma

**Durum:** Kodda var; tasarımda ek olarak öğrencinin kendi ana sayfası ve menüsüyle birebir görünüm, sayfanın üstünde "Müdür olarak
… portalındasın · Çık" şeridi ve işlem kaydına "öğrenci portalına girdi" satırı.

Müdürün (ya da yetkisi olan öğretmenin) bir öğrencinin ödevlerine, notlarına, devamsızlığına, programına onun gözünden bakması.

## Ne işe yarar

Kullanıcı 29 Ağustos'ta istedi: "müdürler öğrenci portalına giriş yapabilsin". Veliyle ya da öğrenciyle konuşurken, bir şikâyete
bakarken ya da rehberlik görüşmesinde öğrencinin ekranda ne gördüğünü bilmek gerekir. "Portalını aç" öğrencinin şifresini bilmeden,
onun adına bir şey yapmadan, yalnız bakmak içindir: ödev teslim edilmez, quiz çözülmez, öğrencinin "açıldı" kaydı oluşmaz.

## Nereden açılır

- **Öğrenciler** listesinde öğrencinin satırındaki **"Portalını aç"** ([Öğrenciler listesi](ogrenci-listesi.md)). Düğme "Öğrenci
  portalına girer" yetkisi olana (müdürde hep) görünür.
- Velide aynı görünüm **Çocuklarım**'daki çocuk kartından açılır ([Çocuklarım](../portallar/cocuklarim.md)).
- Tasarımda (Tasarım 1 önizlemesi): öğrencinin penceresindeki **"Portal"** satırı — "Öğrencinin gördüğü ekranı aç" ve **"Portalını
  aç"** ([Hesap penceresi](hesap-penceresi.md)).

## Adım adım

### Müdür

1. **Öğrenciler** → öğrencinin satırında **"Portalını aç"**.
2. Öğrencinin **İlerleyiş** sayfası açılır: başlık **"İLERLEYİŞ"**, altında **"Elif Yılmaz adına görüntülüyorsun."**
3. Sol menü öğrencinin menüsüne döner:
   - **"Ana Sayfa"**, **"Öğrenci Listesi"**;
   - ayraçtan sonra öğrencinin adı başlık olarak ve altında **"Ders Programı"**, **"Takvimi"**, **"İlerleyişi"**, **"Ödevleri"**,
     **"Sınavları"**, **"Devamsızlığı"**.
4. Her sayfa öğrencinin verisini gösterir ve başlığın altında "… adına görüntülüyorsun." yazar (ör. **"ÖDEVLER"**, **"SINAVLAR"**):
   [İlerleyişim](../ilerleyis/ilerleyisim.md), [Ödev listesi](../odev/liste.md), [Sınavlarım](../sinav/sinavlarim.md),
   [Devamsızlığım](../devamsizlik/devamsizligim.md), [Programım](../ders-programi/programim.md). Grafiklerde çizginin adı "Senin
   değerin" değil **"Öğrencinin değeri"**dir.
5. Bakarken ödev teslim alanı ve quiz çözme kapalıdır; açmadığı ödevi açman öğrencinin "açıldı" kaydını oluşturmaz.
6. Çıkmak için menüdeki **"Öğrenci Listesi"**: görünüm kapanır, Öğrenciler sayfasına dönersin.

Tasarımda (Tasarım 1 önizlemesi):

- "Portalını aç"a basınca öğrencinin **kendi ana sayfası ve menüsü** açılır (öğrenci ne görüyorsa o); sayfanın en üstünde şerit:
  **"Müdür olarak Elif Yılmaz'ın portalındasın"** ve **"Çık"**. Penceredeki not: "Müdür olarak girersin; üstteki şeritten çıkarsın."
- **"Çık"** seni Öğrenciler sayfasına döndürür; ekranın altında **"Müdür portalına dönüldü."**
- İşlem kaydına **"… öğrenci portalına girdi"** ve öğrencinin adı yazılır.
- Kullanıcının 3 Ekim kararıyla arayüzde **"portal"** kelimesi kalkar, yerine **"oturum"** gelir ("Oturum değiştir", "Oturumlarım");
  bu düğmenin ve şeridin yeni adı tanımlarda henüz yazılmadı (önizlemede "Portalını aç").

### Çalışan (ek rolü olan öğretmen)

- Rolünde **"Öğrenci portalına girer"** varsa (Roller ekranındaki açıklaması: "Öğrencinin gördüğü ekranı birebir açar.") okulun
  **bütün** öğrencilerine bakabilirsin; hazır **Rehber Öğretmen** şablonunda vardır. Menünde rolünün başlığı altında **"Okul
  Öğrencileri"** çıkar; liste dardır (ad, sınıf, okul no) ve satırlarda yalnız **"Portalını aç"** vardır.
- Bu yetki sınıfla daraltılamaz; yetkiyi alan okulun bütün öğrencilerini görür.
- Yetkisi olmayan öğretmen yalnız derslerine girdiği öğrencilere ve onların sonuçlarına "Sınıflarım"dan bakar
  ([Sınıflarım](../siniflar-dersler/siniflarim.md)).
- Tanımdaki öneri (özel roller, onay bekliyor): yeni hazır **"Sınıf Öğretmeni"** şablonunda da bu yetki var. Öneride sınıfla
  daraltma yalnız başarı eklemeye yazılmış; portal yetkisini sınıfa daraltmak bugünkü yetki yapısında yok, ayrıca karar ister.

### Veli

Velinin çocuk görünümü aynı mekanizmadır: Çocuklarım'da çocuğun kartına basınca açılır, menüde dönüş satırının adı **"Çocuk
Listesi"**dir ([Çocuklarım](../portallar/cocuklarim.md)). 3 Ekim kararıyla velide her çocuk ayrı oturumdur
([Velide her çocuk ayrı oturum](../portallar/velide-cocuk-oturumlari.md)).

### Öğrenci

Müdürün ya da yetkilinin senin görünümüne baktığını bugün bildirim ya da iz olarak görmezsin; bakan kişi senin adına hiçbir şey
yapamaz. Tasarımda bu bakış okulun işlem kaydına yazılır.

## Kurallar ve sınırlar

- **Kim bakabilir (sunucu kuralı):** müdür kendi okulunun öğrencisine; öğretmen "Öğrenci portalına girer" yetkisiyle okulunun bütün
  öğrencilerine; öğretmen bu yetki olmadan yalnız derslerine girdiği öğrencilere; veli bağlı olduğu çocuğa; öğretmen ya da müdür
  aynı zamanda veliyse kendi çocuğuna. Başka okulun öğrencisine kimse bakamaz.
- **Yalnız bakış:** ödev dosyası yükleme ya da silme, quiz çözme, ödevin "açıldı" kaydı yalnız öğrencinin kendisinde çalışır.
- **Eski okul kaydı:** taşınan öğrencinin önceki okul kayıtlarını yeni okul göremez ([Öğrenci nakli](ogrenci-nakli.md)).
- **Görünüm sayfa yenilenince kaybolur (kod okumasına göre; denenmedi):** "kimin adına bakıyorum" bilgisi yalnız bellektedir.
  Sayfayı yenilersen görünüm kapanır ama adres öğrencinin sayfasında kalır; ekran "Öğrenci bulunamadı" gibi bir ileti verebilir.
  Menüden "Öğrenciler"e dönüp yeniden "Portalını aç".
- **"Ana Sayfa" (kod okumasına göre):** öğrenci görünümündeyken menüdeki "Ana Sayfa" seni kendi ana sayfana götürür ama menü
  öğrencinin menüsü olarak kalır; görünümden tam çıkmak için "Öğrenci Listesi"ni kullan.
- **İz:** bugün bakış işlem kaydına yazılmaz ve öğrenciye bildirim gitmez (tasarımda işlem kaydına yazılır).

## Kardeşler ve ilgili

**Kardeşler:** [Öğrenciler listesi](ogrenci-listesi.md) · [Hesap penceresi](hesap-penceresi.md) · [Öğrenci nakli](ogrenci-nakli.md).

**İlgili:** [Çocuklarım](../portallar/cocuklarim.md), [Velide her çocuk ayrı oturum](../portallar/velide-cocuk-oturumlari.md),
[İlerleyişim](../ilerleyis/ilerleyisim.md), [Ödev listesi](../odev/liste.md), [Sınavlarım](../sinav/sinavlarim.md),
[Devamsızlığım](../devamsizlik/devamsizligim.md), [Programım](../ders-programi/programim.md),
[Başarılarım](../basarilar/basarilarim.md) (tasarımda öğrencinin başarıları), [Sınıflarım](../siniflar-dersler/siniflarim.md),
[Yetki listesi](../roller-yetkiler/yetki-listesi.md), [Hazır şablonlar](../roller-yetkiler/hazir-sablonlar.md),
[Sol menü](../menu-ve-arama/sol-menu.md), [Kim neyi görür](../kvkk-ve-gizlilik/kim-neyi-gorur.md).

## Kod tarafı

- Ön yüz: [public/js/parcalar/10-mudur.md](../../public/js/parcalar/10-mudur.md) — "Portalını aç" düğmesi, `ogrenciPortalAc`;
  [public/js/parcalar/25-tiklama.md](../../public/js/parcalar/25-tiklama.md) — `ogrenci-portal` eylemi, "Öğrenci Listesi" dönüşü
  (`geri-veli`); [public/js/parcalar/06-menu.md](../../public/js/parcalar/06-menu.md) — öğrenci görünümündeki menü;
  [public/js/parcalar/13-ogrenci-veli.md](../../public/js/parcalar/13-ogrenci-veli.md) — "… adına görüntülüyorsun.";
  [public/js/parcalar/26-baslat.md](../../public/js/parcalar/26-baslat.md) — yenilemede ve çıkışta görünümün sıfırlanması.
- Sunucu: [sunucu/bolumler/ilerleyis.md](../../sunucu/bolumler/ilerleyis.md) — öğrencinin sayfalarını veren uçlar (`?studentId=`);
  [sunucu/iliskiler.md](../../sunucu/iliskiler.md) — `canSeeStudent` (kimin hangi öğrenciye bakabileceği); [sunucu/bolumler/okul.md](../../sunucu/bolumler/okul.md)
  — dar öğrenci listesi; [sunucu/yetki.md](../../sunucu/yetki.md) — `ogrenci.portal`.
- Testler: [testler/yetki-denetimi.md](../../testler/yetki-denetimi.md), [testler/buton-denetimi.md](../../testler/buton-denetimi.md)
  (`ogrenci-portal` eyleminin karşılığı).

## Sık sorulanlar

- **Öğrencinin şifresini bilmem gerekir mi?** Hayır; yetkin yeter.
- **Öğrencinin adına ödev teslim edebilir miyim?** Hayır; görünüm yalnız bakmak içindir.
- **Rehber öğretmenimiz neden "Hesap" düğmesini görmüyor?** Yalnız "Öğrenci portalına girer" yetkisi varsa hesap işleri kapalıdır.
- **Sayfayı yenileyince öğrenci görünümü kayboldu.** Bilinen durum; Öğrenciler'den yeniden aç.

## Sırada

- Tasarım 1'deki birebir görünüm, "Müdür olarak … portalındasın · Çık" şeridi ve işlem kaydı.
- Arayüzde "portal" yerine "oturum" (3 Ekim kararı) — düğmenin yeni adı.
- Özel rollerde önerilen "Sınıf Öğretmeni" şablonu (onay bekliyor; portal yetkisinin sınıfa daraltılıp daraltılmayacağı açık).
