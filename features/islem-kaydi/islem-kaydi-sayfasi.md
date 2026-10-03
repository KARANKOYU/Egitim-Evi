# İşlem kaydı · İşlem kaydı sayfası

**Durum:** Kodda var; tasarımda ek olarak yöneticinin İşlem kaydı yeni yönetim paneline (/panel/admin) taşınır, Android
uygulamasında müdüre salt okunur bir İşlem kaydı gelir ve sayfayı öğretmen olmayan bir çalışan da görev yetkisiyle açar.

Okulda kimin, ne zaman, hangi önemli işi yaptığını en yeniden eskiye doğru tek bir tabloda gösteren sayfa.

## Ne işe yarar

"Bu öğrencinin hesabını kim açtı?", "Bu rolü kim verdi?", "Bölümü kim kapattı?" gibi soruların cevabı burada. Sayfa yalnız
okunur: buradan hiçbir satır silinmez, düzeltilmez, geri alınmaz; yapılan işi geri almak istersen işin kendi ekranına gidersin.
Hangi işlerin satır olarak düştüğü [Neler kaydedilir](neler-kaydedilir.md)'de.

## Nereden açılır

- **Müdür:** sol menü → **"Okul Düzeni"** başlığının altında **"İşlem Kaydı"** ("Excel Aktarım" ile "Okul Adresi ve Konumu"
  arasında). Adres: `#/islem-kaydi`.
- **Öğretmen (ek rolüyle):** ek rolünde "İşlem kaydını görür" yetkisi varsa menünün ek bölümünde **"İşlem Kaydı"** çıkar. Bölümün
  başlığı rolün adıdır (ör. "Müdür Yardımcısı"); ek rolün yoksa (müdür yetkiyi okulun hazır Öğretmen rolüne eklediyse)
  "Ek Yetkiler".
- **Yönetici:** yönetim panelinde (gizli yönetim adresi, [Gizli yönetim adresi](../yonetim/gizli-yonetim-girisi.md)) menüde
  **"Site"** başlığının altında, "Yedekleme"nin hemen altında **"İşlem Kaydı"**.
- Telefonda aynı satırlar ☰ ile soldan açılan menüdedir ([Telefonda menü](../menu-ve-arama/telefonda-menu.md)).
- Ana sayfada İşlem kaydı kutucuğu yok (müdürün ana sayfasında da).
- Menüde satırın simgesi belge simgesidir.

Tasarımda (Tasarım 1 önizlemesi): müdür menüsünde "Okul düzeni" başlığının altında, yine "Excel aktarım" ile "Okul adresi ve
konumu" arasında **"İşlem kaydı"**. Yönetici için tanım: yeni yönetim paneli /panel/admin'de "İşlem kaydı" bölümü (yalnız
yönetici; destek ekibinin paneli /panel/destek'te yok) — [Paneller](../yonetim/paneller.md); Tasarım 1 önizlemesinin panelinde
bu bölüm henüz çizilmedi. Android uygulamasında (tanım) müdürün "Diğer" menüsünde salt okunur bir **"İşlem kaydı"**; bugünkü
uygulamada bu ekran yok — [Android uygulaması](../uygulama/android-uygulamasi.md).

## Adım adım

### Sayfada ne var (bugünkü site)

- En üstte başlık: **"İŞLEM KAYDI"** (alt yazı yok).
- Birinci kart: tür düğmeleri. Solda **"Hepsi"**, sonra kayıtta gerçekten geçen her türün adı ("Kullanıcıya rol atandı", "Hesap
  açıldı" …); en son kullanılan tür en başta. Seçili düğme vurgulu durur. Kayıtta hiç satır yoksa bu kart hiç çıkmaz. Ayrıntısı:
  [Türe göre süzme ve arama](suzme-ve-arama.md).
- İkinci kart: tablo. Kartın başlığı **"Son 300 kayıt (toplam 1250)"** gibidir: süzgece uyan satır gösterilenden fazlaysa
  parantez içinde toplam yazar, değilse yalnız "Son 12 kayıt".
- Sütunlar soldan sağa: **Tarih · Kişi · İşlem · Ayrıntı · IP**.
  - **Tarih:** gün.ay.yıl saat:dakika, ör. "03.10.2026 14:05" (senin cihazının saatiyle).
  - **Kişi:** işi yapanın adı; altında soluk yazıyla rolü: "Müdür", "Öğretmen", "Öğrenci", "Veli", "Yönetici" ya da
    "Servisçi". Kişisiz satırda (sunucunun kendi işi) "(bilinmiyor)" yazar, rol satırı boş kalır.
  - **İşlem:** türün Türkçe adı ([Neler kaydedilir](neler-kaydedilir.md)'deki tablolarda aynen).
  - **Ayrıntı:** kısa açıklama, ör. "Deniz Arslan (öğrenci)", "7-A: 28 öğrenci", "Kerem Uçar → Müdür Yardımcısı".
  - **IP:** işin yapıldığı cihazın IP adresi (soluk yazı), ör. "203.0.113.24"; bilinmiyorsa boş.
- En yeni satır en üstte. En çok 300 satır gelir; sayfalama ya da "daha fazla" düğmesi yok ([Saklama ve sınırlar](saklama-ve-sinirlar.md)).
- Satıra tıklamak bir şey açmaz.
- Hiç satır yoksa tablonun yerinde: **"Henüz kayıt yok. Önemli işlemler yapıldıkça burada birikir."**
- Dar ekranda tablo sayfaya sığmazsa kart içinde yana kayar; tür düğmeleri alt satırlara sarılır.
- Sayfa kendiliğinden yenilenmez. Yeni satırları görmek için üst şeritteki yenile düğmesine ("Sayfayı yenile"; 360 pikselden dar
  ekranda gizlenir, tarayıcının yenilemesi kalır) bas ya da menüden yeniden aç. Yenile düğmesi seçtiğin türü ve aramayı korur.
- Sayfanın üstündeki eğitim yılı seçicisi (okulda iki ya da daha çok eğitim yılı varsa çıkar) bu sayfayı etkilemez: işlem kaydı
  yıla bağlı değil, hangi yıla bakarsan bak aynı satırlar gelir.

### Müdür

1. Menüden "Okul Düzeni" → **"İşlem Kaydı"**.
2. Tabloda okulunun bütün kayıtlı işleri en yeniden eskiye sıralıdır; kendi işlerin de, yetki verdiğin kişilerinki de.
3. Yalnız bir türü görmek için türün düğmesine bas (ör. "Kullanıcıya rol atandı"); hepsine dönmek için **"Hepsi"**.
4. Bir kişiyi, öğrenciyi ya da sınıfı bulmak için üst şeritteki **"İçerik Ara"** kutusuna yaz; tablo yazdıkça süzülür.
5. Bir satırın arkasındaki işi değiştirmek istersen işin kendi ekranına git (ör. rol için "Roller ve Yetkiler"); işlem kaydından
   değiştirilemez.

İki okulda müdür ya da öğretmensen her okulun kaydını o okulun portalında görürsün; portal değiştirince sayfa öbür okulun
kaydını açar ([Portala geçiş](../portallar/portala-gecis.md)).

### Öğretmen

Müdür sana "İşlem kaydını görür" yetkisi olan bir ek rol verdiyse (ör. "Müdür Yardımcısı" şablonu bu yetkiyle gelir —
[nasıl verilir](gorme-yetkisi.md)) adımlar müdürünkiyle aynı: menünün ek bölümünde "İşlem Kaydı" → tür düğmeleri → arama.
Gördüğün liste müdürünkiyle birebir aynıdır (yalnız kendi okulun). Yetki yeni verildiyse menüde görünmesi için sayfayı yeniden aç.

Yetkin yokken adres çubuğuna `#/islem-kaydi` yazarsan sayfa açılır ama tablo yerine kırmızı bir ileti çıkar: **"İşlem kaydını
görme yetkin yok"**.

### Çalışan

Bugün kodda: ek görevli kişi öğretmen hesabıyla bir ek rol taşır; rolünde yetki varsa adımları öğretmeninkiyle aynı.

Tasarımda: kişi okula "çalışan" olarak eklenir ([Rolsüz çalışan](../ogretmenler-calisanlar/rolsuz-calisan.md)); müdürün verdiği
özel rolde "İşlem kaydını görür" varsa öğretmen olmasa da sayfayı açar. Rolsüz çalışan menüsünde bu satırı görmez ve sayfayı
açamaz.

### Yönetici

1. Yönetim panelinde menü → "Site" → **"İşlem Kaydı"**.
2. Aynı sayfa ve aynı tablo gelir, ama içinde **bütün okulların** satırları ve hiçbir okula ait olmayan satırlar (site ayarları,
   okul açma, yönetici dosyası, yedekten dönme, yetişkinlerin kendi hesap işleri) birlikte durur.
3. Tür düğmeleri bütün sistemde geçen türlerdir; süzme ve arama müdürdekiyle aynı çalışır.
4. Tabloda **okul sütunu yok**: bir satırın hangi okula ait olduğu yalnız ayrıntısından (ör. "Örnek Ortaokulu: 3 GB → 2 GB")
   ya da kişinin adından anlaşılır.

Tasarımda: aynı bölüm /panel/admin'e taşınır; eski /admin adresi bilinmeyen adres gibi davranır.

### Tasarım 1 önizlemesindeki görünüm (örnek)

Önizlemede sayfa tablo değil, öbür sayfalar gibi bir liste: başlık "İşlem kaydı", altında "Okulda kim ne yaptı"; "Bugün" grubunda
her satırın solunda saat ("10:41"), başlığı "Ayşe Kaya ödev verdi" gibi bir cümle, altında ayrıntı ("7-A · Kesirlerle toplama").
Müdürün önizlemede yaptığı işler (rol atama, çalışan ekleme, bölüm kapatma, Excel indirme …) bu listenin en üstüne eklenir.
Satıra dokununca yalnız başlığı ve bir satır yazıyı gösteren genel bir pencere açılır; her satırın kendi ayrıntı penceresi
önizlemenin denetiminde öneri olarak yazıldı ama önizlemede yapılmadı.

Bunlar örnektir, karar değil. Kullanıcının bu ekranla ilgili tek sözü (29 Ağustos): başlığın altındaki açıklama gereksiz. Bugünkü
sitede başlığın altında yazı yok; önizlemedeki "Okulda kim ne yaptı" alt yazısı bu sözle uyuşmaz. Ekranın düzeni için başka bir
şey söylemedi; 2 Ekim'deki karara göre üzerine yorum yapmadığı ekranlar bugünkü site gibi kalır. Önizlemedeki "ödev verdi",
"sefer başlattı" satırları da bugün kayda düşmeyen işlerdir ([Neler kaydedilir](neler-kaydedilir.md#tasarım-1-önizlemesinde-örnek)).

## Kurallar ve sınırlar

- **Kim açar:** müdür her zaman; öğretmen (ve tasarımda çalışan) yalnız "İşlem kaydını görür" yetkisiyle; sistem yöneticisi her
  zaman. Öğrenci, veli, servisçi açamaz: **"İşlem kaydını görme yetkin yok"**. Giriş yapmamış biri hiç açamaz; hesabı onaysız
  olan **"Hesabın henüz onaylanmadı"** alır. Ayrıntı: ["İşlem kaydını görür" yetkisi](gorme-yetkisi.md).
- **Ne görülür:** okul yetkilisi yalnız kendi okulunun satırlarını görür; okulsuz yazılan satırları (yetişkinlerin kendi hesap
  işleri, yöneticinin işleri) göremez. Yönetici hepsini görür.
- **Kaç satır:** en yeni 300; daha eskiye bakmanın bugünkü tek yolu bir türü seçmek (o türün en yeni 300 satırı gelir). Bütün
  sistemde en çok 5000 satır tutulur ([Saklama ve sınırlar](saklama-ve-sinirlar.md)).
- **Yalnız okunur:** silme, düzeltme, dışarı aktarma (Excel'e indirme) ya da yazdırma düğmesi yok.
- **IP adresi** okul yönetimine gösterilir; yetişkinlerin kişisel işleri okulsuz yazıldığı için onların IP'si okul yönetimine
  görünmez.
- **Zaman** cihazın saatine göre gösterilir; sunucu satırı gerçek anla saklar.
- **Bölüm kapatma:** İşlem kaydı Özellikler sayfasından kapatılabilen bölümlerden biri değil; her okulda hep açıktır.
- **Eğitim yılı:** yıl seçici sayfayı değiştirmez; yeni yıl açılınca kayıt sıfırlanmaz.

## Kardeşler ve ilgili

**Kardeşler** (aynı klasör, [İşlem kaydı](README.md)):

- [Neler kaydedilir](neler-kaydedilir.md) — tablodaki her türün ne zaman ve hangi ayrıntıyla yazıldığı.
- [Türe göre süzme ve arama](suzme-ve-arama.md) — "Hepsi" ve tür düğmeleri, "İçerik Ara".
- ["İşlem kaydını görür" yetkisi](gorme-yetkisi.md) — sayfayı kimin açtığı, okulsuz satırlar.
- [Saklama ve sınırlar](saklama-ve-sinirlar.md) — 300 satır, 5000 satır, yedekte ne olur.

**İlgili:**

- [Sol menü](../menu-ve-arama/sol-menu.md), [Sayfa içi arama (İçerik Ara)](../menu-ve-arama/sayfa-ici-arama.md).
- [Roller ve yetkiler ekranı](../roller-yetkiler/roller-ekrani.md), [Özel roller](../roller-yetkiler/ozel-roller.md).
- [Kapalı bölüm ne olur](../ozellikler/kapali-bolum.md) — işlem kaydı kapatılabilen bölümlerden değil.
- [Gizli yönetim adresi](../yonetim/gizli-yonetim-girisi.md), [Paneller](../yonetim/paneller.md).
- [Android uygulaması](../uygulama/android-uygulamasi.md) — tasarımdaki salt okunur İşlem kaydı.
- [Kim neyi görür](../kvkk-ve-gizlilik/kim-neyi-gorur.md).

## Kod tarafı

- Ön yüz sayfası: [public/js/parcalar/15-aktarim.md](../../public/js/parcalar/15-aktarim.md) — `SAYFALAR['islem-kaydi']`
  (`GET /api/islem-kaydi[?islem=<tür>]`, `hero('İŞLEM KAYDI', '')`, tür sekmeleri `data-act="islem-suz"`, tablo
  `.rapor-kaydir` / `.rapor-tablo`, satırda `data-ara`, boş kutu iletisi). Dosya adı "aktarım" olsa da işlem kaydı tarihsel olarak
  bu dosyada.
- Menü: [public/js/parcalar/06-menu.md](../../public/js/parcalar/06-menu.md) (müdürde "Okul Düzeni", öğretmende
  `yetkim('islem-kaydi.gor')` ile ek bölüm), [public/js/yonetim/09a-yonetim-paneli.md](../../public/js/yonetim/09a-yonetim-paneli.md)
  (yöneticinin "Site" bölümü).
- Yönlendirme ve yenileme: [public/js/parcalar/07-yonlendirme.md](../../public/js/parcalar/07-yonlendirme.md) (`git`, hata
  iletisi `msg hata`, `sayfayiYenile`, `yaz` → `araUygula`).
- Yardımcılar: [public/js/parcalar/02-ikonlar.md](../../public/js/parcalar/02-ikonlar.md) (`tarihSaat` "gg.aa.yyyy ss:dd",
  `ROL_AD`).
- Görünüm: `public/css/parcalar/18-aktarim-kvkk.css` (`.rapor-kaydir { overflow-x: auto }`, `.rapor-tablo`),
  `public/css/parcalar/19-mesajlar.css` (`.sekme-satir` sarılır), `public/css/parcalar/07-mobil.css` (360 pikselden dar ekranda
  yenile düğmesi gizli).
- Sunucu: [sunucu/bolumler/islem-kaydi.md](../../sunucu/bolumler/islem-kaydi.md) (`GET /api/islem-kaydi`: `need()`, yönetici
  hepsini, öteki `islem-kaydi.gor` + kendi okulu, en yeni 300, cevap `{ toplam, turler, kayitlar }`),
  [sunucu/api.md](../../sunucu/api.md) (`need`: "Giriş yapmalısın", "Hesabın henüz onaylanmadı").
- Testler: [testler/yetki-denetimi.md](../../testler/yetki-denetimi.md) (`GET /api/islem-kaydi`: yalnız müdür ve yönetici geçer),
  [testler/test-servis-konum.md](../../testler/test-servis-konum.md) (servisçi giremez).

## Sık sorulanlar

- **İşlem Kaydı menümde yok.** Müdür değilsen ek rolünde "İşlem kaydını görür" yetkisi olmalı; müdürden iste. Yetki yeni
  verildiyse sayfayı yeniden aç.
- **Tabloda okul sütunu yok, hangi okulun satırı?** (yönetici) Bugün okul gösterilmiyor; ayrıntıdan ya da kişiden anlaşılır.
- **Daha eski kayıtlara nasıl bakarım?** Sayfa en yeni 300 satırı gösterir. Bir türü seçersen o türün en yeni 300'ü gelir;
  bunun ötesine bugün bakılamaz.
- **Bir satırı silebilir miyim?** Hayır; kimse (müdür ya da yönetici) silemez ve düzeltemez.
- **Kayıtları Excel'e alabilir miyim?** Bugün hayır.
- **IP sütunu neden boş?** Satır sunucunun kendi işiyse (ör. yönetici dosyasından hesap açılması) ya da adres okunamadıysa boş
  kalır.

## Sırada

- Paneller /panel/admin ve /panel/destek: yöneticinin İşlem kaydı /panel/admin'e taşınacak.
- Android yerel uygulama: müdürün "Diğer" menüsünde salt okunur "İşlem kaydı".
- Çalışan olarak ekleme: yetkiyi öğretmen olmayan çalışan da taşıyabilecek.
- Optimizasyon + saklama süreleri: 300 sınırı ve sayfalama yeniden düşünülecek.
- Çok dil: başlık, sütun adları ve işlem adları çeviri kataloğuna girecek.
