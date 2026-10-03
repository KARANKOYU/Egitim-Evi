# İşlem kaydı · Neler kaydedilir

**Durum:** Kodda var; tasarımda ek olarak yeni özelliklerin önemli işleri de (müdür yapma, çalışana görev verme, kullanıcı arama
ve T.C. gösterme, Verilerimi indir, yeni yıl sihirbazı, okul yedeği, tahtadan öğrenci seçme, eğitim içeriği kaldırma …) kayda
girecek.

İşlem kaydına hangi işlerin, kimin adıyla, hangi ayrıntıyla ve hangi kayda (okulun kaydına mı, yalnız yöneticinin gördüğü kayda mı)
yazıldığının tam listesi.

## Ne işe yarar

Bir şey ters gittiğinde "bunu kim yaptı?" sorusunu cevaplar: öğrenci hesabını kim açtı, rolü kim verdi, şifreyi kim yeniledi,
bölümü kim kapattı. Bunun için sistem her önemli işten sonra kendiliğinden bir satır yazar; senin bir şey yapman gerekmez.

Sıradan bakmalar (sayfa açmak, liste okumak) yazılmaz, yoksa kayıt bir günde dolardı. Ödev, not, ders yoklaması ve mesaj gibi
günlük ders işleri de bugün yazılmaz (aşağıda ["Kaydedilmeyen işler"](#kaydedilmeyen-işler)).

## Nereden açılır

Kayıtlar kendiliğinden yazılır; bunun için ayrı bir düğme yok. Yazılanları [İşlem kaydı sayfası](islem-kaydi-sayfasi.md)'nda
görürsün; tek bir türü görmek için sayfanın üstündeki tür düğmeleri ([Türe göre süzme ve arama](suzme-ve-arama.md)).

Her satırda beş sütun var: **Tarih · Kişi · İşlem · Ayrıntı · IP**. Aşağıdaki tablolarda "İşlem" sütununda göreceğin adı tırnak
içinde aynen, "Ayrıntı" sütununda göreceğin yazıyı da uydurma bir örnekle verdik.

## Adım adım

### Bir satır nasıl oluşur

1. Biri önemli bir iş yapar (ör. müdür "Roller ve Yetkiler"de bir öğretmene ek rol verir).
2. İş **başarıyla** bitince sunucu satırı yazar: işi yapanın o anki adı ve rolü, işin türü, kısa bir ayrıntı (en çok 300 karakter),
   işin yapıldığı cihazın IP adresi ve zaman.
3. İşi yapan bir **yetişkin hesabıysa** (veli hesabı ya da henüz portalı olmayan hesap) satır okulsuz yazılır: okul yönetimi görmez,
   yalnız sistem yöneticisi görür. Yetişkin aynı kişi öğretmen ya da müdür portalındayken iş yaptıysa satır o okulun kaydına düşer.
4. İş yarıda kalırsa (yetki yok, hatalı bilgi, çakışma) satır yazılmaz. Önizlemeler de yazılmaz (ör. Excel aktarımının önizlemesi).
5. Satır bir sebeple yazılamazsa iş yine biter; yalnız o satır eksik kalır ([Saklama ve sınırlar](saklama-ve-sinirlar.md)).

### Müdür

Okulunun kaydında aşağıdaki ["Okulun kaydına düşen işler"](#okulun-kaydına-düşen-işler) tablolarındaki her satırı görürsün:
kendi yaptıklarını, yetki verdiğin kişilerin yaptıklarını, öğretmenin okuldan kendi isteğiyle ayrılmasını, öğrencinin "Şifremi
unuttum"la şifresini yenilemesini. Yöneticinin yaptığı işleri (okulunun disk sınırını ya da adresini değiştirmesi dahil) ve
velilerin kendi hesap işlerini görmezsin.

### Öğretmen

Ek rolünde "İşlem kaydını görür" yetkisi varsa ([nasıl verilir](gorme-yetkisi.md)) müdürle aynı listeyi görürsün. Yetkin yoksa da
yaptığın kayıtlı işler (ör. etüt yoklaması, rolünün izin verdiği hesap açma) okulun kaydına senin adınla düşer; yalnız sen
göremezsin. Okuldan "Okuldan ayrıl" ile ayrılırsan bu da kayda düşer.

### Çalışan

Bugün kodda: ek görevli kişi öğretmen hesabıyla bir ek rol taşır (ör. "Müdür Yardımcısı"); gördükleri ve kayda düşen işleri
öğretmeninkiyle aynı. Kişi sütununun altında rol olarak "Öğretmen" yazar, ek rolün adı yazmaz.

Tasarımda: kişi okula "çalışan" olarak eklenir; özel rolündeki yetkiyle yaptığı işler aynı biçimde kayda düşer. Rolsüz çalışanın
yapabileceği kayıtlı bir iş yok.

### Yönetici

Bütün okulların satırlarını ve okulsuz satırları birlikte görürsün: aşağıdaki iki tablonun hepsini. Kendi işlerin
([Yalnız yöneticinin gördüğü kayıtlar](#yalnız-yöneticinin-gördüğü-kayıtlar)) okulsuz yazılır, hiçbir müdür görmez.

### Tasarım 1 önizlemesinde (örnek)

Önizlemede müdürün yaptığı birçok iş kaydın en üstüne "Bugün" grubuna saatle eklenir; başlık "&lt;kişi&gt; &lt;ne yaptı&gt;",
altında ayrıntı:

| Önizlemedeki satır | Ayrıntı örneği | Arkasında tanım var mı |
|---|---|---|
| "… kişi koduyla çalışan ekledi" | "&lt;ad&gt; · rolsüz" | Var (çalışan olarak ekleme: işlem kaydı) |
| "… rol atadı" / "… rol aldı" | "&lt;kişi&gt; · &lt;rol&gt;" | Rol atamak bugün de yazılıyor, çalışan tanımında da var; rolü geri almak bugün yazılmıyor, yazılması için ayrı karar yok |
| "… müdür atadı" | "&lt;ad&gt; · doğrulama koduyla" | Var (müdür yapma: doğrulama kodu + işlem kaydı) |
| "… eğitim yılı oluşturdu" | "&lt;yıl&gt; · &lt;başlangıç&gt; – &lt;bitiş&gt;" | Bugün de yazılıyor ("Eğitim yılı açıldı") |
| "… bölümü açtı" / "… bölümü kapattı" | "&lt;bölüm&gt;" | Bugün de yazılıyor ("Okulun özellikleri değişti …") |
| "… Excel'den hesap açtı" | "&lt;dosya&gt; · &lt;sayı&gt; hesap" | Bugün de yazılıyor ("Excel ile toplu hesap açıldı") |
| "… ders programını dosyadan yükledi" | "&lt;sınıflar&gt; · &lt;sayı&gt; ders" | Bugün de yazılıyor ("Excel ile ders programı eklendi") |
| "… ders ekledi" / "… dersi düzenledi" / "… dersi sildi" | "&lt;ders&gt; · &lt;kısaltma&gt;" | Okulun kendi dersi tasarımına bağlı; kayıt için ayrı karar yok |
| "… ders programını yayımladı" | "&lt;sınıf&gt; · &lt;tarih&gt;'den geçerli" | Ayrı karar yok |
| "… devamsızlığı düzeltti" | "&lt;öğrenci&gt; · &lt;gün&gt; · 2. ders (Matematik): Gelmedi → Geç · 10 dk" | Tek ders düzeltmesi bugün de var ama kayda yazılmıyor; yazılması önizlemenin önerisi, ayrı karar yok |
| "… öğretmen ekledi" (hazır örnek satır) | Eklenen öğretmenin adı | Bugün de yazılıyor ("Öğretmen kişi koduyla okula eklendi") |
| "… Excel indirdi" | "&lt;dosya&gt;.xlsx · &lt;özet&gt;" (ör. "ders-programi-7-A.xlsx · 7-A · 30 ders") | Yok: dışarı aktarım bugün yazılmıyor, yazılması için karar da yok |
| "… metinden Excel indirdi" | "metin.xlsx · &lt;sayı&gt; satır" | Yok: aynı (dışarı aktarım) |
| "… ödev verdi", "… sefer başlattı" (hazır örnek satırlar) | "7-A · Kesirlerle toplama", "Servis 3 · sabah" | Yok: ödev verme ve sefer başlatma bugün yazılmıyor, yazılmaları için karar da yok |

Önizlemedeki görünüm örnektir; kullanıcı önizlemedeki bu satırlar için ayrıca bir şey söylemedi, bu yüzden tanımı olmayanlarda
bugünkü kurallar geçerli.
Tanımı olan işler aşağıda ["Tasarımda kayda girecek işler"](#tasarımda-kayda-girecek-işler) bölümünde.

## Kurallar ve sınırlar

### Okulun kaydına düşen işler

Bu satırları okulun müdürü, "İşlem kaydını görür" yetkilisi ve sistem yöneticisi görür. "Kim yapabilir" sütunundaki tırnaklı adlar
yetkilerin ekrandaki adıdır; müdür hepsine her zaman sahiptir.

**Hesaplar ve şifreler**

| İşlem (ekranda) | Ne zaman yazılır | Kim yapabilir | Ayrıntı (örnek) |
|---|---|---|---|
| "Hesap açıldı" | Okul tek bir öğrenci ya da servisçi hesabı açınca ([Öğrenci hesabı açma](../hesaplar/ogrenci-hesabi-acma.md), [Servisçi hesabı açma](../servis/servisci-hesabi.md)) | Öğrencide "Öğrenci hesabı açar ve okula öğrenci ekler", servisçide "Servisleri ve servis öğrencilerini düzenler" | "Deniz Arslan (öğrenci)", "Kerem Uçar (servisçi)" |
| "Öğrenci başka okuldan nakil geldi" | Öğrenci hesabı açarken yazılan T.C. no başka okulda kayıtlı bir öğrencinin çıkar, doğum tarihi de tutar ve hesap bu okula taşınır ([Öğrenci nakli](../hesaplar/ogrenci-nakli.md)). Yalnız yeni okulun kaydına düşer; eski okula bildirim gider, kayıt düşmez | "Öğrenci hesabı açar ve okula öğrenci ekler" | "Deniz Arslan (Örnek Ortaokulu okulundan)" |
| "Excel ile toplu hesap açıldı" | Excel Aktarım'da kişi listesi önizlemeden sonra uygulanınca ([İçeri aktarım](../excel-aktarim/ice-aktarim.md)). Liste işlenirken bir çakışma çıkıp hiçbir hesap açılmazsa yazılmaz | "Excel ile içe ve dışa aktarım yapar" (her satır için ayrıca o hesabı açma ya da düzenleme yetkisi gerekir; yoksa satır hatalı sayılır) | "24 hesap açıldı, 3 güncellendi" |
| "Şifre yönetici tarafından değiştirildi" | Okul yönetimi bir öğrencinin ya da servisçinin şifresini yenileyince (yeni şifre yazarak ya da şifreyi T.C. no yaparak; [Şifre işlemleri](../hesaplar/sifre-islemleri.md)). Eski düzende okulun açtığı, kişi koduyla bağlanmamış bir öğretmen hesabında da olur (kişi koduyla eklenen öğretmenin şifresini okul değiştiremez). Adındaki "yönetici", okul yönetimi demek | Öğrencide "Öğrenci şifresi sıfırlar", servisçide "Servisleri ve servis öğrencilerini düzenler", eski öğretmen hesabında "Öğretmen bilgisi ve branşını düzenler" | "Deniz Arslan" |
| "Toplu giriş bilgisi dağıtıldı (şifreler yenilendi)" | "Giriş bilgisi dağıt" penceresinde şifrelerin yenilenmesi onaylanınca ([Giriş bilgisi dağıt](../hesaplar/toplu-giris-bilgisi.md)) | "Öğrenci şifresi sıfırlar" | "7-A: 28 öğrenci", "Bütün okul: 412 öğrenci" |
| "Şifre sıfırlandı (kullanıcı)" | Kişi "Şifremi unuttum" bağlantısıyla yeni şifresini koyunca ([Şifremi unuttum](../giris-hesap/sifremi-unuttum.md)). Okulun kaydına yalnız okulun açtığı hesaplarda (e-postası olan öğrenci ya da servisçi) düşer; Kişi sütununda kişinin kendisi | Hesabın sahibi | "2 oturum kapatıldı" |
| "Hesap silindi" | Bir servisçi hesabı silinince | "Servisleri ve servis öğrencilerini düzenler" | "Kerem Uçar" |
| "Veli öğrenciye bağlandı" | Öğrencinin hesap penceresinde "Veli bağla" ile bir veli bağlanınca ([Veli bağlama](../hesaplar/veli-baglama.md)) | "Öğrenci bilgilerini düzenler" | "Ece Tan → Deniz Tan" |
| "Veli bağı kaldırıldı" | Aynı yerde "Bu kişinin veli bağı kaldırılsın mı? Öğrencinin bilgilerini artık göremez." onaylanınca | "Öğrenci bilgilerini düzenler" | "Deniz Tan" (yalnız öğrencinin adı; velinin adı yazmaz) |

**Öğretmenler**

| İşlem (ekranda) | Ne zaman yazılır | Kim yapabilir | Ayrıntı (örnek) |
|---|---|---|---|
| "Öğretmen kişi koduyla okula eklendi" | "Öğretmenler" → "Kodla ekle" ile kişi kodu girilip öğretmen eklenince ([Kodla ekle](../ogretmenler-calisanlar/kodla-ekleme.md)) | "Okula öğretmen ekler, başvuru onaylar" | "Kerem Uçar" |
| "Öğretmen onaylandı" | Eski düzenden kalmış, bekleyen bir öğretmenlik başvurusu onaylanınca (başvuru yolu artık yok; reddetmek yazılmaz) | "Okula öğretmen ekler, başvuru onaylar" | "Kerem Uçar" |
| "Öğretmen okuldan çıkarıldı" | Öğretmenin penceresinde "Okuldan çıkar" ile ([Okuldan çıkarma](../ogretmenler-calisanlar/okuldan-cikarma.md)) | "Öğretmeni okuldan çıkarır" | "Kerem Uçar" |
| "Öğretmen okuldan ayrıldı" | Öğretmen kendi hesabında "Okuldan ayrıl" deyip onaylayınca ([Bu okuldan ayrıl](../portallar/okuldan-ayrilma.md)); Kişi sütununda öğretmenin kendisi | Öğretmenin kendisi | "Kerem Uçar" |

**Roller**

| İşlem (ekranda) | Ne zaman yazılır | Kim yapabilir | Ayrıntı (örnek) |
|---|---|---|---|
| "Rol oluşturuldu" | "Roller ve Yetkiler" → "Rol oluştur" → "Kaydet" ([Rol ekle / düzenle](../roller-yetkiler/rol-duzenleyici.md)) | "Rol oluşturur ve düzenler" | "Müdür Yardımcısı" |
| "Rol yetkileri değiştirildi" | Bir rol (hazır "Öğretmen" rolü dahil) düzenlenip kaydedilince | "Rol oluşturur ve düzenler" (kendi taşıdığı rolü ve Öğretmen rolünü yalnız müdür değiştirir) | Rolün kaydedilen adı: "Etüt Sorumlusu", "Öğretmen" |
| "Rol silindi" | Rolün "Sil" düğmesi onaylanınca | "Rol oluşturur ve düzenler" | "Etüt Sorumlusu" |
| "Kullanıcıya rol atandı" | "Öğretmenlerin ek rolleri" kartında bir öğretmenin açılır listesinden rol seçilince | "Rol oluşturur ve düzenler" (kimse kendine rol veremez) | "Kerem Uçar → Müdür Yardımcısı" |

**Okul düzeni**

| İşlem (ekranda) | Ne zaman yazılır | Kim yapabilir | Ayrıntı (örnek) |
|---|---|---|---|
| "Eğitim yılı açıldı" | Yeni eğitim yılı açılınca ([Yeni eğitim yılı açma](../egitim-yili/yil-acma.md)) | "Eğitim yılı açar ve değiştirir" | "2026-2027" |
| "Aktif eğitim yılı değişti" | Başka bir yıl aktif yapılınca | "Eğitim yılı açar ve değiştirir" | "2025-2026" |
| "Excel ile ders programı eklendi" | Excel Aktarım'da ders programı önizlemeden sonra uygulanınca ([Programı Excel'den kurma](../ders-programi/excelden-program.md)) | "Excel ile içe ve dışa aktarım yapar" (sınıfın programını düzenleme yetkisi de gerekir) | "36 ders saati" |
| "Okulun özellikleri değişti (bölüm açıldı ya da kapandı)" | Özellikler sayfası kaydedildiğinde gerçekten bir bölüm açıldı ya da kapandıysa ([Bölüm aç / kapat](../ozellikler/bolum-ac-kapat.md)) | Yalnız müdür | "kapandı: Anketler; açıldı: Etütler" |
| "Okulun adresi değişti" | Okulun giriş adresi (/school/&lt;ad&gt;) değişince ([Okulun adresi](../okul-sayfasi/sayfa-adresi.md)) | Yalnız müdür | "ornek-ortaokulu" (yeni adres) |
| "Okulun haritadaki yeri değişti" | Okulun haritadaki yeri kaydedilince ([Okul adresi ve haritadaki yeri](../okul-sayfasi/okul-konumu.md)); yeri silmek yazılmaz | "Okulun haritadaki yerini ayarlar" | "39.9208, 32.8541" |
| "Okul sayfası düzenlendi" | Okul sayfası (tanıtım, renkler, CSS) kaydedilince ([Tanıtım yazısı ve fotoğraflar](../okul-sayfasi/tanitim-ve-fotograflar.md), [Görünüm ve CSS](../okul-sayfasi/gorunum-ve-css.md)) | "Okulun giriş sayfasını düzenler" | "okul sayfası kaydedildi" |
| "Okul sayfasına fotoğraf yüklendi" | Kapak, logo ya da galeriye fotoğraf yüklenince | "Okulun giriş sayfasını düzenler" | "kapak fotoğrafı yüklendi", "logo fotoğrafı yüklendi", "galeri fotoğrafı yüklendi" |
| "Okul sayfasından fotoğraf silindi" | Bir fotoğraf elle silinince (yeni kapak ya da logo eskisinin yerine geçtiğinde ayrıca yazılmaz) | "Okulun giriş sayfasını düzenler" | "galeri fotoğrafı silindi" |

**Okul hayatı ve etütler**

| İşlem (ekranda) | Ne zaman yazılır | Kim yapabilir | Ayrıntı (örnek) |
|---|---|---|---|
| "Yemek listesi kaydedildi" | "Bu haftayı düzenle" penceresinde "Kaydet" ([Bu haftayı düzenle](../yemek/menuyu-duzenleme.md)) | "Yemek listesini düzenler" | "7 gün" |
| "Servis saatleri değişti" | Okulun servis saatleri kaydedilince ([Servis saatleri](../servis/servis-saatleri.md)) | "Servisleri ve servis öğrencilerini düzenler" | "sabah 07:00–08:30 ve akşam 15:30–17:30" |
| "Etüt açıldı" | Yeni etüt kaydedilince ([Etüt açma](../etut/etut-acma.md)) | "Etüt açar; gününü, saatini, öğretmenini ve öğrencilerini düzenler" | "Matematik etüdü" |
| "Etüt değiştirildi" | Var olan etüt kaydedilince | aynı | "Matematik etüdü" |
| "Etüt silindi" | Etüt silme onaylanınca | aynı | "Matematik etüdü" |
| "Etüdün öğrencileri değişti" | Etüdün öğrenci listesi kaydedilince | aynı | "Matematik etüdü: 14 öğrenci" |
| "Etüt yoklaması alındı" | Etüt yoklaması kaydedildiğinde en az bir öğrencinin durumu değiştiyse ([Etüt yoklaması](../etut/etut-yoklamasi.md)); "Değişiklik yok." çıkarsa yazılmaz | Etüdün öğretmeni, "Bütün etütlerde yoklama alır" ya da etüt düzenleme yetkilisi | "Matematik etüdü 2026-10-03: 2 değişiklik" |

**Açılış sayfası yorumu**

| İşlem (ekranda) | Ne zaman yazılır | Kim yapabilir | Ayrıntı (örnek) |
|---|---|---|---|
| "Uygunsuz kelimeli yorum reddedildi" | Açılış sayfası yorumunda uygunsuz bir kelime yakalanıp yorum geri çevrilince ([Yorum yazma](../yorumlar/yorum-yazma.md)). Yorumu yazan o an öğretmen ya da müdür portalındaysa okulun kaydına, yetişkin (veli) hesabındaysa yalnız yöneticinin kaydına düşer | Yorumu yazan kişi | "uygunsuz kelime: &lt;yakalanan kelime&gt;" |

### Yalnız yöneticinin gördüğü kayıtlar

Bu satırlar okulsuz yazılır: hiçbir müdür ve yetkili öğretmen görmez, yalnız sistem yöneticisi görür.

| İşlem (ekranda) | Ne zaman yazılır | Kim yapar | Ayrıntı (örnek) |
|---|---|---|---|
| "Hesabın e-postası değişti" | Yetişkin, Ayarlar'da yazdığı yeni e-postaya gelen bağlantıyı açınca ([Giriş bilgileri](../ayarlar/giris-bilgileri.md)) | Hesabın sahibi | Yeni e-posta adresi (açık yazılır) |
| "Hesap bilgileri değişti" | Yetişkin, Ayarlar'da kullanıcı adını ya da telefonunu değiştirince | Hesabın sahibi | Değişen alanların iç adları: "username", "phone" ya da "username, phone" |
| "Şifre sıfırlandı (kullanıcı)" | Yetişkin ya da yönetici "Şifremi unuttum" ile yeni şifre koyunca | Hesabın sahibi | "1 oturum kapatıldı" |
| "Uygunsuz kelimeli yorum reddedildi" | Yetişkin hesabından yazılan yorum geri çevrilince | Yorumu yazan | "uygunsuz kelime: &lt;kelime&gt;" |
| "Yorum gizlendi" / "Yorum yeniden gösterildi" | Yönetim panelinde "Yorumlar" sayfasında "Gizle" / "Göster" ([Yorumu gizleme](../yorumlar/yorum-gizleme.md)) | Yönetici | "Ay. Ka.: Çocuğumun ödevlerini buradan takip ediyorum…" (yazarın kısaltılmış adı ve yorumun ilk 60 harfi) |
| "Okul yönetici tarafından açıldı" | "Okullar" → "Okul aç" ile okul açılınca ([Okul açma](../yonetim/okul-acma.md)) | Yönetici | "Örnek Ortaokulu (ornek-ortaokulu) — müdür selin.aydin, disk sınırı 5 GB" |
| "Okulun adresi yönetici tarafından değişti" | Site Ayarları'nda bir okulun adresi değişince ([Site ayarları](../yonetim/site-ayarlari.md)) | Yönetici | "Örnek Ortaokulu: eski-ad → ornek-ortaokulu" ("(yok) → …" ilk kez verilince) |
| "Okulun disk sınırı değişti" | "Okullar" → "Düzenle" ile okulun sınırı değişince ([Okul disk sınırını ayarlama](../okul-disk/disk-siniri.md)) | Yönetici | "Örnek Ortaokulu: varsayılan (5 GB) → 2 GB" |
| "Site iletişim bilgileri değişti" | Site Ayarları'nda iletişim bilgileri kaydedilince | Yönetici | "İletişim bilgileri: e-posta: &lt;adres&gt;, telefon: (boş)" |
| "Yapımcılar listesi değişti" | Yapımcılar listesi kaydedilince | Yönetici | "Yapımcılar: 3 yapımcı: &lt;ad&gt;, &lt;ad&gt;, &lt;ad&gt;" |
| "Play Store bağlantısı değişti" | Play Store bağlantısı kaydedilince | Yönetici | "Play Store bağlantısı: &lt;bağlantı&gt;" ya da "… (boş)" |
| "Site aralık ayarı değişti" | "Bildirim yoklama aralığı", "Çevrimiçi sayma süresi" ya da "admins.json okuma aralığı" değişince | Yönetici | "Bildirim yoklama aralığı: 5 → 10 dk" |
| "Varsayılan okul disk sınırı değişti" | Varsayılan okul disk sınırı değişince | Yönetici | "Varsayılan okul disk sınırı: 5 GB → 10 GB" |
| "Yönetici hesabı admins.json dosyasından açıldı" | Sunucu yönetici dosyasından yeni bir yönetici hesabı açınca ([Yönetici dosyası](../yonetim/yonetici-dosyasi.md)) | Sunucunun kendisi: Kişi sütununda "(bilinmiyor)", rol ve IP boş | "&lt;ad&gt; (&lt;e-posta&gt;)" (şifre asla yazılmaz) |
| "admins.json dosyası elle yeniden okundu" | Yönetici Dosyası sayfasında "Şimdi oku" | Yönetici | "dosya yok", "dosya atlandı: &lt;neden&gt;" ya da "2 hesap açıldı, 1 satır atlandı" |
| "Yedekten geri yüklendi" | Yedekleme sayfasında "Geri yükle" ([Site yedekleri](../yonetim/yedekler.md)) | Yönetici | Yedek dosyasının adı |

Site ayarlarında iki özel durum: değeri değiştirmeden kaydedilen ayar "panelden sabitlenir" ve satıra "1 → 1 dk" değil
"admins.json okuma aralığı: 1 dk (varsayılan değeri panelden sabitlendi)" yazılır; panelden kaydedilen değer bırakılınca
"admins.json okuma aralığı: varsayılan değerine döndü (1 dk)" yazılır ("varsayılan" yerine değerin geldiği yere göre
"config.yml", "yapimcilar.json" ya da "EE_OKUL_DOSYA_GB" de olabilir).

### Adı listede olup bugün hiç yazılmayanlar

Şu dört tür sunucunun ad listesinde durur ama bugün hiçbir iş bunları yazmaz; eski kayıtlar doğru adla görünsün diye kalmış
olabilirler: "Başarısız giriş denemesi", "Kişi okula eklendi", "Müdürlük başvurusu yapıldı (eski kayıt)", "Yedek silindi".

Yani başarısız giriş denemeleri bugün işlem kaydına **girmez** (Tasarım 1 önizlemesinin SSS'si "başarısız giriş denemeleri"ni
sayıyor; saklama tanımı da bu satırlara 90 gün süre öngörüyor, ama yazılmaları için ayrı bir karar yok).

### Kaydedilmeyen işler

Bugün şu işler işlem kaydına **yazılmaz**:

- Ödev verme, düzenleme, silme ve sonuçlandırma; quiz; sınav açma ve not girişi; ders yoklaması (etüt yoklaması hariç); devamsızlık.
- Mesaj ve duyuru (Tasarım 1 SSS'si de "Mesajlar bu kayda girmez" der), anket, takvim, hatırlatıcı.
- Sınıf açma ve silme, sınıfa ders ve öğretmen atama, ders programını elle düzenleme, öğrenciyi sınıfa yerleştirme.
- Öğrenci bilgilerini düzenleme, öğrenci portalına girme, veli kodunu görme, dışarı aktarım (listeyi Excel olarak indirme).
- Bir öğretmenin ek rolünü kaldırma ("— yalnızca Öğretmen —" seçmek), eski öğretmenlik başvurusunu reddetme.
- Servis ekleme, servise öğrenci atama, sefer başlatma ve servis yoklaması; okulun haritadaki yerini silme.
- Kendi şifreni Ayarlar'dan değiştirme, giriş ve çıkış, kişi kodunu yenileme, velinin çocuğunu veli koduyla eklemesi ya da
  Çocuklarım'dan kaldırması, "Hesabımı sil".
- Yöneticinin müdürü çıkarması, "Şimdi yedek al" ve yedek indirme.

Güvenlik tanımı bunlardan yönetim işlerini (müdürü çıkarma, yedek işleri, sınıf silme, çocuğu kaldırma, hesabı silme) "işlem
kaydı yazmayan uçlar" diye düzeltilecekler arasında sayıyor.

### Satırın kuralları

- **Kişi ve rol** yazıldığı andaki hâliyle kalır: kişi sonra adını değiştirse ya da hesabı silinse de satırda eski adı görünür.
  Rol satırında "Müdür", "Öğretmen", "Öğrenci", "Veli", "Yönetici", "Servisçi" yazabilir; ek rolün adı (ör. "Müdür Yardımcısı")
  yazmaz.
- **Ayrıntı** en çok 300 karakter; uzun olan kesilir. İçinde ad, sınıf, rol adı, yeni adres ya da (yalnız yöneticinin kaydında)
  e-posta olabilir. Şifre hiçbir satıra yazılmaz.
- **IP** işin yapıldığı cihazın adresidir; geçerli bir IP değilse ya da iş sunucunun kendisinden geldiyse boş kalır. IP okul
  yönetimine de gösterilir; yetişkinlerin kişisel işleri okulsuz yazıldığı için onların IP'si okula görünmez.
- **Okulsuz yazma kuralı:** veli hesabının ve portalı olmayan yetişkinin işleri (e-posta, kullanıcı adı, telefon, "Şifremi
  unuttum") hangi okulda çocuğu olursa olsun okul yönetimine gösterilmez; kod yorumu: okul yönetimi velinin kişisel işlemlerini ve
  IP adresini görmemeli.
- **Bilinmeyen tür:** ad listesinde olmayan bir tür satırda anahtarının kendisiyle görünür (ör. `okul.yeni-is`).

### Tasarımda kayda girecek işler

Kullanıcının istediği ya da onayladığı tanımlarda "işlem kaydına yazılır" denen yeni işler; henüz öneri olan satırda belirtildi.
Kodlandıkça yukarıdaki tablolara taşınır.

| İş | Ne yazılacak | Klasör |
|---|---|---|
| Kişi koduyla çalışan ekleme, çalışana görev (rol) verme | Kim, kime, hangi görev | [Öğretmenler ve çalışanlar](../ogretmenler-calisanlar/README.md) |
| "Müdür yap" (onaysız, o an doğrulama koduyla) ve müdürün kendi isteğiyle müdürlükten ayrılması | Kim, kimi; yöneticiye ve öbür müdürlere bildirim de gider | [Müdür yap](../ogretmenler-calisanlar/mudur-yapma.md), [Birden çok müdür](../ogretmenler-calisanlar/birden-cok-mudur.md) |
| Okul gezgininde okul ekleme, müdür ekleme/çıkarma, adres değiştirme, klasör işleri | Okulsuz; yalnız yönetici görür | [Okul gezgini](../yonetim/okul-gezgini.md) |
| Kullanıcı arama, kişi sayfasını açma, T.C. "göster", şifre işlemi, hesap silme | Kim, kime | [Kullanıcı arama](../yonetim/kullanici-arama.md), [Hesaba müdahale](../yonetim/hesaba-mudahale.md) |
| Yönetici ya da destekçinin bir kişinin e-postasını, adını, kullanıcı adını değiştirmesi | Kim, kime, gerekçe; e-posta adresleri maskeli | [Hesaba müdahale](../yonetim/hesaba-mudahale.md) |
| Destek kısıtı koyma ve kaldırma | Kim, kime, süre | [Talep kısıtı](../destek/talep-kisiti.md) |
| Verilerimi indir | Yalnız "veri indirildi" (içerik değil); kişi kendi işlem kaydı satırlarını da indirdiği dosyada bulur | [Verilerimi indir](../ayarlar/verilerimi-indir.md) |
| Doğrulama uygulamasını sıfırlama (destek hesabı, kişi, admins.json'daki "totpSifirla") | Kim, kimin | [Panel hesaplarında zorunlu doğrulama](../yonetim/panelde-zorunlu-dogrulama.md) |
| Öğrencinin iki adımlı girişini yönetici ya da destekçinin sıfırlaması | Kim, kimin | [İki adımlı giriş](../giris-hesap/iki-adimli-giris.md) |
| Yeni yıl sihirbazının özeti (sınıf atlatma ayrıntılı), yıl sonu arşivini indirme, 24 saat içinde "Yeni yılı geri al" | Özet; indirme; geri alma (mezuniyet de geri döner) | [Yeni yıl sihirbazı](../egitim-yili/yeni-yil-sihirbazi.md), [Mezunlar](../egitim-yili/mezunlar.md) |
| Site geneli duyuru koyma, bakım modunu açma ve kapama | Okulsuz; yalnız yönetici görür (duyuruyu yalnız yönetici koyar) | [Site duyurusu](../yonetim/site-duyurusu.md), [Bakım modu](../yonetim/bakim-modu.md) |
| Okul yedeğini geri yükleme | Ayrıntılı kayıt; okulun öğretmenlerine bildirim | [Okul yedeği](../egitim-yili/okul-yedegi.md) |
| Etüt planlamada çakışmaya rağmen zorla kaydetme (öneri, onay bekliyor) | Kim, hangi etüt | [Boş zaman ızgarası](../etut/bos-zaman-izgarasi.md) |
| Tahtadan öğrenci seçme (ping ve Katıl izni), tahtanın kullanımı | Tahta, sınıf, ders, kaç öğrenci; ör. "Tahta 1 · 7-A · 3. ders (programdaki öğretmen: Ayşe Y.)" | [Öğrenci seçme](../tahta/ogrenci-secme.md) |
| Eğitim içeriğinde bildirilen videonun kaldırılması ya da reddi; YouTube'dan kalkan videonun silinmesi | Okulsuz | [Bildirilenler](../egitim-icerikleri/bildirilenler.md), [YouTube denetimi](../egitim-icerikleri/youtube-denetimi.md) |
| Eklentilerin işleri ve zamanlı işleri (eklentiler kodlanmayacak, yalnız belgeleniyor) | "X eklentisi (zamanlı iş)"; eklentinin değiştirdiği not ve yoklama için ayrıca değer geçmişi; kayıt yazılamazsa değer de yazılmaz | [Sınırlar (kum havuzu)](../eklentiler/sinirlar.md) |

## Kardeşler ve ilgili

**Kardeşler** (aynı klasör, [İşlem kaydı](README.md)):

- [İşlem kaydı sayfası](islem-kaydi-sayfasi.md) — bu satırların göründüğü tablo.
- [Türe göre süzme ve arama](suzme-ve-arama.md) — yukarıdaki türlerden birini seçip yalnız onu görmek.
- ["İşlem kaydını görür" yetkisi](gorme-yetkisi.md) — okulun kaydını kimin, okulsuz kaydı kimin gördüğü.
- [Saklama ve sınırlar](saklama-ve-sinirlar.md) — kaç satır tutulur, ne zaman silinir, yedekte ne olur.

**İlgili:**

- [Yetki listesi](../roller-yetkiler/yetki-listesi.md) — yukarıdaki "Kim yapabilir" yetkilerinin tamamı.
- [Hazır rol şablonları](../roller-yetkiler/hazir-sablonlar.md) — hangi şablon hangi yetkiyle gelir.
- [Kim neyi görür](../kvkk-ve-gizlilik/kim-neyi-gorur.md), [Saklama süreleri](../kvkk-ve-gizlilik/saklama-sureleri.md).
- [Site ayarları](../yonetim/site-ayarlari.md), [Site yedekleri](../yonetim/yedekler.md).

## Kod tarafı

- Ad listesi ve yazan işlev: [sunucu/bolumler/islem-kaydi.md](../../sunucu/bolumler/islem-kaydi.md) — `ISLEM_AD` (53 anahtar →
  ekrandaki ad), `islemYaz(kisi, islem, detay, req)`: yetişkin hesabında (`depo.kullanicilar.yetiskinMi`) okul boşaltılır; yazma
  hatası yutulur ("İşlem kaydı yazılamadı: …" yalnız sunucu günlüğüne).
- Yazan bölümler (her birinin belgesinde ilgili uç): [hesaplar.md](../../sunucu/bolumler/hesaplar.md),
  [kisi-aktarim.md](../../sunucu/bolumler/kisi-aktarim.md), [nakil.md](../../sunucu/bolumler/nakil.md),
  [okul.md](../../sunucu/bolumler/okul.md) (roller, öğretmen onayı, Excel ders programı, giriş bilgisi dağıtma),
  [kisilik.md](../../sunucu/bolumler/kisilik.md) (okuldan ayrılma, hesap bilgileri), [kayit.md](../../sunucu/bolumler/kayit.md)
  (e-posta değişikliği, şifre sıfırlama), [egitim-yili.md](../../sunucu/bolumler/egitim-yili.md),
  [etut.md](../../sunucu/bolumler/etut.md), [okul-hayati.md](../../sunucu/bolumler/okul-hayati.md) (yemek, servis saatleri),
  [okul-sayfasi.md](../../sunucu/bolumler/okul-sayfasi.md), [ozellikler.md](../../sunucu/bolumler/ozellikler.md),
  [yorum.md](../../sunucu/bolumler/yorum.md), [yonetici-okul.md](../../sunucu/bolumler/yonetici-okul.md),
  [okul-disk.md](../../sunucu/bolumler/okul-disk.md), [site-ayarlari.md](../../sunucu/bolumler/site-ayarlari.md),
  [yonetici.md](../../sunucu/bolumler/yonetici.md) (yedekten dönme, "Şimdi oku").
- Yönetici dosyası: [sunucu/yonetici-dosyasi.md](../../sunucu/yonetici-dosyasi.md) — `depo.genel.islemYaz(null,
  'yonetici.eklendi', …)` doğrudan (kişisiz, IP'siz, okulsuz).
- Depo ve tablo: [sunucu/veri/depo/genel.md](../../sunucu/veri/depo/genel.md) (`islemYaz`: ayrıntı 300 harfe kırpılır, IP
  `net.isIP` değilse boş), [sunucu/veri/sema/SEMA.md](../../sunucu/veri/sema/SEMA.md) (`islem_kaydi`, şema 001).
- IP: [sunucu/guvenlik.md](../../sunucu/guvenlik.md) (`istemciIp`).
- Testler: [testler/test-rol.md](../../testler/test-rol.md) (`okul.konum`), [testler/test-ozellikler.md](../../testler/test-ozellikler.md),
  [testler/test-okul-sayfasi.md](../../testler/test-okul-sayfasi.md), [testler/test-giris-bilgisi.md](../../testler/test-giris-bilgisi.md),
  [testler/test-servis-yoklama.md](../../testler/test-servis-yoklama.md) (servis saatleri),
  [testler/test-okul-disk.md](../../testler/test-okul-disk.md) (`okul.disk-siniri`),
  [testler/test-site-ayarlari.md](../../testler/test-site-ayarlari.md) (site ayarları okulsuz yazılır, "sabitlendi" metni, müdür
  görmez); ayrıca `testler/test-yonetici-dosyasi.js` (`yonetici.eklendi`, `yonetici.dosya-okundu`).

## Sık sorulanlar

- **Öğretmen ödev verdi, kayıtta yok. Neden?** Ödev, not, ders yoklaması ve mesaj bugün işlem kaydına yazılmaz; yalnız yukarıdaki
  tablolardaki işler yazılır.
- **"Şifre yönetici tarafından değiştirildi" yazıyor ama yönetici bir şey yapmadı.** Bu ad okul yönetimi demek: müdür ya da
  "Öğrenci şifresi sıfırlar" yetkilisi şifreyi yenilemiştir. Kişi sütununa bak.
- **Bir velinin e-postasını değiştirdiğini neden göremiyorum?** Velinin ve yetişkin hesaplarının kişisel işleri okulsuz yazılır;
  yalnız sistem yöneticisi görür.
- **Okulumun disk sınırı değişmiş, kayıtta yok.** Sınırı sistem yöneticisi değiştirir ve bu satır yalnız onun kaydına düşer.
- **Başarısız giriş denemelerini görebilir miyim?** Bugün hayır; bu tür kayda yazılmıyor.
- **Bir öğretmenin rolünü kaldırdım, kayıtta yok.** Rol kaldırmak bugün yazılmıyor; yalnız rol vermek yazılıyor.
- **Ayrıntıda "username, phone" gibi İngilizce sözler var.** "Hesap bilgileri değişti" satırı değişen alanların iç adlarını yazar:
  username kullanıcı adı, phone telefon demek.

## Sırada

- Güvenlik denetimi: işlem kaydı yazmayan yönetim uçlarına (müdürü çıkarma, yedek işleri, sınıf silme, çocuğu kaldırma, hesabı silme)
  kayıt eklenmesi.
- Çalışan olarak ekleme: çalışan ekleme ve görev verme kayda girecek.
- Paneller ve okul gezgini; Kullanıcı arama, destek talepleri, Verilerimi indir: yukarıdaki yeni türler.
- Sistem: site duyurusu, bakım modu, doğrulama uygulamasını sıfırlama gibi işlerin türleri.
- Yıl geçişi: yeni yıl sihirbazı, okul yedeği, çift doğrulama.
- Toplantılar ve tahta hesabı; Eğitim içerikleri; Etüt planlama.
- Optimizasyon + saklama süreleri: "Başarısız giriş denemesi" satırları için 90 gün kuralı.
- Çok dil: işlem adları çeviri kataloğuna girecek.
