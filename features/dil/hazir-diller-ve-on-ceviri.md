# Dil ve çeviri · Hazır diller ve İngilizce ön çeviri

**Durum:** Tasarlandı — henüz kodda yok

Eğitim Evi'nin hangi dillerle geleceği ve İngilizcenin temel arayüzünün ilk sürümde Eğitim Evi ekibince çevrilmesi; öbür dillerin
çevirmenlere kalması.

## Ne işe yarar

Kullanıcının 29 Eylül sözü: "basic şeyleri biz önceden çevirebilirz açıklama disciripton … konu: subject: vb". Aynı mesajda bir de
soru sordu: "korece vb desteklesin mi yoksa gerek yok mu dersin". Bu belge iki sorunun cevabıdır: hangi dil baştan hazır gelir,
hangisini kim çevirir.

## Nereden açılır

- Hazır diller [Dil seçici](dil-secici.md)'de görünür; ön çeviri [Çeviri paneli](ceviri-paneli.md)'ndeki İngilizce sütunudur.
- Ayrı bir ekranı yok.

## Adım adım

### Ziyaretçi ve oturumdaki herkes

1. Dil seçicide **Türkçe** tam (%100) ve **English** hazır gelir. İlk sürümde İngilizcenin temel arayüzü (menü, düğmeler, alan
   adları, sık hata iletileri) çevrilmiş olur; tanımın tahmini %60–80.
2. Öbür diller çevirmenler çevirdikçe oranlarıyla listeye girer; çevrilmemiş yazılar Türkçe görünür.

**Tasarımda (Tasarım 1 önizlemesi):** seçicide Türkçe %100, English %82, Deutsch %12, العربية %41. Yalnız İngilizce seçilince
birkaç yazı İngilizceye döner (aşağıdaki "Önizlemedeki İngilizce sözlük"); kullanıcının 2 Ekim sözü: "çevirme sadece değişince eng
yazsın ve bikaç kelim belli etsin yeter".

### Geliştiriciler (Eğitim Evi ekibi)

1. Türkçe → İngilizce temel arayüz ekip tarafından çevrilir: yapay zekâ desteğiyle çevrilir, sonra gözden geçirilir.
2. Kapsam: menü adları, düğmeler, alan adları ("Açıklama" → "Description", "Konu" → "Subject"), sık hata iletileri.
3. Öbür dillere ekip çeviri yapmaz.

### Çevirmen

Arapça ve öbür diller sana kalır ([Çevirmen rolü](cevirmen-rolu.md)). Korece gibi hazır gelmeyen bir dil gerekiyorsa dil eklenir
ve çevrilir ([Dil ekleme ve .po](dil-ekleme-ve-po.md)).

### Yönetici

1. Ön çeviriyi çeviri panelinde düzeltirsin; İngilizce sütunu da öbürleri gibi düzenlenir.
2. Korunan e-posta şablonlarının (giriş kodu, şifre sıfırlama, e-posta değişikliği, yeni cihaz uyarısı) İngilizcesini yalnız sen
   yayına alırsın ([Neler çevrilir](ceviri-kapsami.md)).

## Kurallar ve sınırlar

- **Hangi diller (tanımın önerisi):** Türkçe ve İngilizce hazır; **Arapça** (Türkiye'deki yabancı uyruklu öğrencilerin büyük bölümü
  Arapça konuşuyor; sağdan sola desteği bu yüzden baştan — [Sağdan sola diller](sagdan-sola.md)); gerekirse Rusça, Ukraynaca, Farsça.
- **Korece:** altyapı her dili destekler, yeni dil eklenebilir; ama Korecenin ekip tarafından çevrilmesine gerek görülmedi. İhtiyaç
  olursa çevirmen ekler.
- **Ön çeviri yalnız İngilizce;** öbür diller çevirmenlere.
- **Hukuki metinler** hiçbir dilde çevrilmez (şimdilik); İngilizce seçen de Türkçe metni görür. Önizlemede alt bilgideki bağlantının
  yazısı İngilizceye döner ("Privacy notice", "Terms of use") ama açılan metin Türkçedir.
- **Kelime seçimi ekranla aynı olmalı:** önizlemedeki iki liste birkaç yerde ayrılıyor — dil seçicinin gösterimi "Servis" için "Bus",
  "Hesap ayarları" için "Settings" diyor; çeviri panelindeki örnek katalog "School bus" ve "Account settings" diyor. Kodlanırken
  tek karşılık seçilmeli.
- **3 Ekim sözcükleri:** kullanıcının 3 Ekim kararıyla arayüzde "portal" kelimesi kalktı: "Hesap değiştir" ile "Portallarım" tek
  düğme "Oturum değiştir" oldu, "Oturumlarım" ve "Henüz bir oturumun yok" deniyor ([Portallarım](../portallar/portallarim.md)).
  Aynı akşamki ikinci kararla (3 Ekim 21:05) giriş yapılmış **cihaz** anlamındaki "oturum" yazıları da değişti ("Açık oturumlar" →
  "Giriş açık cihazlar", "Bütün oturumlarını kapat" → "Bütün cihazlardan çıkar"); kararda değişen yerler arasında çeviri tablosu da
  sayılıyor. Tasarım 1 buna göre güncellendi: örnek katalogda "Portallarım" → "Oturumlarım" ("My sessions"), "Hesap değiştir" →
  "Oturum değiştir" ("Switch session"), "Henüz bir portalın yok" → "Henüz bir oturumun yok"; "Oturumun kapandı; yeniden giriş yap"
  ekranda "Girişin sona erdi; yeniden giriş yap" diye görünüyor. Ön çeviri bu yeni sözcüklerle yapılmalı. Ürünü anlatan "okul
  portalı" ("School portal") olduğu gibi kalır. Önizlemenin sözlüğünde eski "Hesap değiştir" ve "Portallarım" karşılıkları hâlâ
  duruyor ama ekranda artık bu yazılar yok.

**Önizlemedeki İngilizce sözlük** (dil seçicide İngilizce seçilince değişen yazılar):

| Grup | Türkçe → İngilizce |
|---|---|
| Menü ve sayfalar | Ana sayfa → Home · Mesajlar → Messages · Anketler → Surveys · Takvim → Calendar · Toplantılar → Meetings · Hatırlatıcılar → Reminders · Devamsızlığım → My attendance · Devamsızlık → Attendance · Ders programı → Timetable · Programım → My timetable · İlerleyişim → My progress · İlerleyiş → Progress · Ödevler → Homework · Ödevlerim → My homework · Sınavlarım → My exams · Sınavlar → Exams · Başarılarım → My achievements · Başarılar → Achievements · Etütlerim → My study hours · Etütler → Study hours · Yemek listesi → Lunch menu · Servisim → My bus · Servis → Bus · Servisler → Buses · Eğitim içerikleri → Lessons |
| Okulun düzeni | Öğretmenler → Teachers · Çalışanlar → Staff · Öğrenciler → Students · Sınıflar → Classes · Sınıflarım → My classes · Dersler ve branşlar → Subjects · Roller ve yetkiler → Roles · Eğitim yılı → School year · Özellikler → Features · Excel aktarım → Excel import · İşlem kaydı → Activity log · Okul adresi ve konumu → School address · Okul sayfası → School page · Görünüm (CSS) → Appearance (CSS) · Okul düzeni → School setup · Tahtalar → Boards · Yoklama → Roll call |
| Veli ve eğitmen | Çocuklarım → My children · Aile → Family · Videolarım → My videos · Video yükle → Upload video · Listelerim → My lists · Bildirilenler → Reports · İstatistik → Statistics |
| Hesap ve oturum | Oturum değiştir → Switch session · Oturumlarım → My sessions · Oturumların → Your sessions · Oturum ekranına git → Go to sessions · Hesap ayarları → Settings · Destek → Support · Ana siteye dön → Back to site · Çıkış yap → Log out (listede eski "Hesap değiştir → Switch account" ve "Portallarım → My portals" da duruyor; bu yazılar ekranda artık yok) |
| Açılış sayfası | Giriş → Log in · Giriş yap → Log in · Kayıt ol → Sign up · Hesap aç → Create account · İndir → Download · Hakkında → About · SSS → FAQ · Sık sorulan sorular → Frequently asked questions · Yapımcılar → Makers · Neler var? → What's inside? · Okulun nasıl başlar? → How a school starts · Kullananlar ne diyor? → What people say · Kullanım koşulları → Terms of use · Aydınlatma metni → Privacy notice · Kaynak kodu → Source code · Okul portalı → School portal · Okul portalı · 2026 → School portal · 2026 · Eğitim Evi nedir? → What is Eğitim Evi? |
| Roller | Öğrenci → Student · Veli → Parent · Öğretmen → Teacher · Okul yönetimi → School management |
| Öbür | kahraman başlığı → "Homework, grades, attendance and bus in one place." · arama kutusu → "Search" |

**Çeviri panelindeki örnek katalog** (100 metin; İngilizce sütunda 82'si dolu) yukarıdakilere ek olarak şunları taşır: Duyurular →
Announcements · Ayarlar → Settings · Şifre → Password · Şifremi unuttum → Forgot password · Kullanıcı adı → Username · E-posta →
Email · Telefon → Phone · Kaydet → Save · Vazgeç → Cancel · Sil → Delete · Düzenle → Edit · Gönder → Send · Yanıtla → Reply · Ara →
Search · Kapat → Close · Ekle → Add · Yükle → Upload · Açıklama → Description · Konu → Subject · Tarih → Date · Saat → Time · Müdür →
Principal · Sınıf → Class · Okul → School · Bildirimler → Notifications · Yardım → Help · Son tarih → Due date · Teslim et → Hand in ·
Teslim edildi → Handed in · Süresi doldu → Overdue · Yaptı → Done · Yapmadı → Not done · Geç yaptı → Done late · Gelmedi → Absent ·
İzinli → Excused · Yeni ödev → New homework · Yeni mesaj → New message · Okunmamış → Unread · Hepsini okundu say → Mark all as read ·
Uygulamayı indir → Download the app · Koyu tema → Dark theme · Açık tema → Light theme · Dil → Language · Kişi kodu → Personal code ·
Doğrulama kodu → Verification code · Beni hatırla → Remember me · Şifre yanlış → Wrong password · Böyle bir kullanıcı yok → No such
user · Bağlantı kopyalandı → Link copied · Kaydedildi → Saved · Gönderildi → Sent. Katalogda "Oturumlarım" ve "Oturum değiştir"
satırları da var (3 Ekim'de "Portallarım" ve "Hesap değiştir"in yerine geçtiler; İngilizceleri "My sessions", "Switch session").
İngilizcesi boş kalan 18 metin: "Dosya ekle", "Sürükleyip bırak", "Önizleme", "Yazdır", "Sınav sonucu açıklandı", "Ödev
hatırlatması", "Servis yola çıktı", "Servise binmeyecek", "Velisi olduğu çocuklar", "Okul bulunamadı", "Sayfa bulunamadı", "Ana
sayfaya dön", "Bu alan zorunlu", "Bağlantı yok; yeniden dene", "Girişin sona erdi; yeniden giriş yap" (katalogdaki kaynak satır hâlâ
"Oturumun kapandı; yeniden giriş yap"; ekranda 3 Ekim 21:05 kararına göre değişiyor), "Henüz bir oturumun yok", "Okulunu ara",
"Kullanım koşulları".

## Kardeşler ve ilgili

**Kardeşler** (aynı klasör, [Dil ve çeviri](README.md)):

- [Dil seçici](dil-secici.md) — hazır dillerin göründüğü yer.
- [Çeviri paneli](ceviri-paneli.md) — ön çevirinin düzeltildiği yer.
- [Dil ekleme ve .po](dil-ekleme-ve-po.md) — hazır gelmeyen bir dilin eklenmesi.
- [Çevirmen rolü](cevirmen-rolu.md), [Sağdan sola diller](sagdan-sola.md), [Neler çevrilir](ceviri-kapsami.md).

**İlgili:**

- [Portallarım](../portallar/portallarim.md) — "Oturum değiştir" sözcük değişikliği.
- [Aydınlatma metni](../kvkk-ve-gizlilik/aydinlatma-metni.md) — Türkçe kalan hukuki metin.

## Kod tarafı

Bugün kodda yok; site yalnız Türkçe. Tasarım 1 önizlemesinde iki ayrı liste var: dil seçicideki gösterimin sözlüğü `EN_SOZ` (yalnız
sol menü, sayfa başlığı, açılış sayfası ve giriş ekranının şeridi ile alt bilgisi üzerinde çalışır; yazı listedekiyle birebir
aynıysa değişir) ve çeviri panelinin örnek kataloğu `PNL_CV_HAM` (Türkçe, İngilizce, Almanca, Arapça sütunları). 3 Ekim akşamı
önizlemenin sonradan eklenen parçaları ikisine de yeni satırlar ekledi (oturum sözcükleri, "Çalışanlar", "Dersler ve branşlar"). Kodlanınca ön çeviri kataloğun İngilizce sütununa yazılır; katalog
tablosu şemaya girer ([sunucu/veri/sema/SEMA.md](../../sunucu/veri/sema/SEMA.md)).

## Sık sorulanlar

- **Site hangi dillerle gelecek?** Türkçe ve İngilizce hazır; Arapça öneriliyor; öbür diller çevirmenlerle.
- **Korece olacak mı?** Gerekirse; altyapı destekler, çevirmen ekler.
- **İngilizce çeviriyi kim yaptı?** Temel arayüzü Eğitim Evi ekibi (yapay zekâ desteğiyle, gözden geçirerek); düzeltmeler çeviri
  panelinden.

## Sırada

- Çok dil işi (22): İngilizce ön çeviri (tanımın tahmini yaklaşık 3 saat; bütün çok dil işi 22–24 saat).
- Kodlanmadan önce netleşecekler: iki listedeki farklı karşılıklar ("Bus" / "School bus", "Settings" / "Account settings");
  "Girişin sona erdi" gibi 3 Ekim'de değişen yazıların İngilizcesi; Arapçanın ilk sürümde hazır olup olmayacağı (tanımda öneri).
