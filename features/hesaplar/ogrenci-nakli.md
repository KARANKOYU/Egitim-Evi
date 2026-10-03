# Öğrenci hesapları · Öğrenci nakli

**Durum:** Kodda var; tasarımda ek olarak nakil "taşıma" olmaktan çıkar: yeni kurum öğrenciyi T.C. ve doğum tarihiyle **eşler**,
öğrencinin ana ekranına yeni oturum düşer, eski okulun oturumu öğrenci okuldan çıkarılınca "geçmiş" olur; Excel aktarımında
"Eşleyelim mi?".

Başka okuldan gelen öğrencinin yeni hesap açılmadan, var olan hesabıyla okula alınması: T.C. kimlik no ve doğum tarihi eşleşirse hesap
yeni okula geçer.

## Ne işe yarar

Öğrenci hesabı okula değil kişiye aittir (kullanıcı 26 Eylül: "Kişiye ait, eski notlar gizli"). Öğrenci okul değiştirince yeni hesap
açılmaz: aynı kullanıcı adı ve şifreyle girmeye devam eder, velileri bağlı kalır. Eski okulun ödev, not ve devamsızlık kayıtları o
okulun kaydı olarak kalır; yeni okul onları görmez, öğrenci ve velisi ise yıl seçicisinden salt okunur bakar.

T.C. tek başına yetmez: doğum tarihi de tutmalıdır. Yoksa T.C. no'sunu bilen biri başkasının çocuğunu kendi okuluna "çekebilirdi".

## Nereden açılır

- **Öğrenciler → "Öğrenci ekle"** penceresinde başka bir okulda kayıtlı öğrencinin T.C.'sini yazınca ([Öğrenci hesabı açma](ogrenci-hesabi-acma.md)).
  Ayrı bir "Nakil" düğmesi yoktur.
- Excel aktarımında başka okuldaki T.C. bugün satır hatasıdır; o öğrenci tek tek eklenir ([İçe aktarım](../excel-aktarim/ice-aktarim.md)).
- Tasarımda: aynı "Öğrenci ekle" penceresi ve Excel önizlemesinin altındaki **"Bazı öğrencilerin kaydı bulundu, eşleyelim mi?"**
  ([Eşleştirme](../excel-aktarim/eslestirme.md)).

## Adım adım

### Müdür (yeni okul)

1. **Öğrenciler → "Öğrenci ekle"**. Ad, soyad ve öğrencinin **T.C. kimlik no**'sunu yaz; **"Doğum tarihi"**ni seç (pencerenin ipucu:
   **"Başka okuldan gelen öğrencide gerekli: T.C. no ile doğum tarihi önceki kaydıyla eşleşirse yeni hesap açılmaz, öğrencinin hesabı
   okuluna taşınır."**). Sınıf ve okul no'yu da seç; **"Hesabı aç"**.
2. T.C. başka bir okulda kayıtlı bir öğrencininse:
   - doğum tarihini seçmediysen Gün listesinin altında **"Doğum tarihini seç."**, pencerenin altında **"Bu T.C. kimlik no başka bir
     okulda kayıtlı bir öğrencinin. Öğrenciyi okuluna almak için doğum tarihini de seç: T.C. no ile doğum tarihi eşleşirse hesabı
     okuluna taşınır."**
   - doğum tarihi tutmazsa yine Gün listesinin altında **"Doğum tarihini seç."** ve altta asıl neden: **"T.C. kimlik no ile doğum tarihi
     eşleşmedi. Bilgileri velisinden ya da önceki okulundan doğrula."**
3. Tutarsa **"Öğrenci okuluna taşındı"** penceresi:
   - yeşil **"Elif Yılmaz okuluna taşındı. Öğrenci kendi şifresiyle girer; velileri bağlı kalır."**
   - **"Kullanıcı adı"** ve **"Kopyala"** (şifre gösterilmez; öğrenci kendi şifresini bilir);
   - **"Önceki okulundaki ödev, not ve devamsızlık kayıtları o okulda kalır; sen görmezsin. Öğrenci ve velisi eğitim yılı
     seçicisinden bakabilir."**
   - düğmeler **"Bir tane daha ekle"** ve **"Tamam"**.
4. Öğrenciyi sınıfına yerleştir (bugün pencerede seçtiğin sınıf alınmıyor, öğrenci **sınıfsız** gelir — "Kurallar"): Hesap
   penceresinde "Sınıf" ya da sınıfın sayfasından ([Hesap penceresi](hesap-penceresi.md), [Sınıf sayfası](../siniflar-dersler/sinif-sayfasi.md)).

Tasarımda (kullanıcının 28 Eylül kararı, Tasarım 1 önizlemesi):

- Nakil artık **taşıma değil**: yeni kurum öğrenciyi eklediğinde T.C. ve doğum tarihi Eğitim Evi'ndeki bir hesapla (öğrenci ya da
  yetişkin) tutarsa yeni hesap açılmaz, o hesabın içinde bu kurum için **yeni bir oturum** açılır ve öğrencinin ana ekranına
  **"Öğrenci · Test Ortaokulu"** düşer. Öğrenci önceki kullanıcı adı ve şifresiyle girer. Eski okuldaki oturumu durur; eski okul
  öğrenciyi okuldan çıkarınca o oturum **"geçmiş"** (salt okunur) olur ([Öğrenciyi okuldan çıkarma](ogrenciyi-okuldan-cikarma.md)).
  Okul ve dershane aynı anda olabilir ([Öğrencide birden çok kurum](../portallar/ogrencide-portallar.md)).
- **Kurumlar birbirini görmez**, birbirine bildirim gitmez: yeni kurum öğrencinin başka nerede kayıtlı olduğunu görmez.
- "Öğrenci ekle" penceresinde T.C. kayıtlı bir hesaptaysa: **"Bu T.C. kimlik no Eğitim Evi'nde kayıtlı bir hesapta var. Eşlemek için
  öğrencinin doğum tarihini yaz."** ya da **"… Doğum tarihi tutmuyor; kontrol et."**
- Tutarsa **"Öğrenci eşlendi"** penceresi: yeşil kutuda ad ve "7-A · okul no 214"; **"Kullanıcı adı:"** "mevcut hesabıyla girer",
  **"Şifre:"** "gösterilmez", **"Giriş yeri:"** egitimevi.org/school/test-ortaokulu; not **"Öğrencinin Eğitim Evi'nde hesabı vardı
  (T.C. ve doğum tarihi tuttu); yeni hesap açılmadı. Önceki kullanıcı adı ve şifresiyle girer; ana ekranına "Öğrenci · Test
  Ortaokulu" düşer."**; düğmeler **"Kapat"**, **"Yeni öğrenci ekle"**. "Ekle ve yenisini aç" ile eklenirse üstte "Elif Yılmaz eşlendi
  (7-A)" ve "Eğitim Evi'ndeki hesabıyla; önceki kullanıcı adı ve şifresiyle girer"; listede "eşlendi, mevcut hesabıyla girer".
- Okul no ve sınıf yeni kurumda verilir (Excel'de dosyadan).
- İşlem kaydına "… öğrenciyi Eğitim Evi hesabıyla eşledi" ve "Elif Yılmaz · 7-A · T.C. ve doğum tarihiyle".
- Excel'de: eşleşen satırlar kutucuklu listede (**"Hepsini eşle"**), doğum tarihi tutmayanlar **"Tek tek eklenecekler"** listesinde
  satır numarası ve nedeniyle ("doğum tarihi tutmuyor" / "doğum tarihi yazılmamış"). Toplu işte yanlış doğum tarihi işi kilitlemez;
  saatte 10 sınırı yalnız tek tek eklemededir ([Eşleştirme](../excel-aktarim/eslestirme.md)).
- Mezun olan öğrenciyi yeni okul (ör. lise) aynı yolla ekler; "Öğrenci · Test Lisesi" kartı kendiliğinden düşer, lise ortaokulun
  kayıtlarını görmez ([Mezunlar](../egitim-yili/mezunlar.md)).

### Müdür (eski okul)

1. Bildirim gelir: **"Elif Yılmaz başka bir okula nakledildi. Okulunuzdaki kayıtları sizde kalır."** (Öğrenciler sayfasına götürür).
2. Öğrenci listende artık yoktur; etüt ve servis listelerinden ve servis haritasındaki ev konumundan çıkar. Okulundaki ödev,
   not, devamsızlık ve etüt yoklaması kayıtları silinmez, senin okulunun kaydı olarak kalır.

Tasarımda eski okula bildirim gitmez (kurumlar birbirini görmez); öğrencinin oturumu sen onu okuldan çıkarana kadar sürer.

### Öğrenci

1. Bildirim gelir: **"Hesabın Test Ortaokulu okuluna taşındı. Önceki okulunun kayıtlarını eğitim yılı seçicisinden görebilirsin."**
2. Aynı kullanıcı adı ve şifreyle girersin (yeni okulda kullanıcı adın başkasındaysa okul sana yenisini söyler — "Kurallar").
3. Eski okulunu görmek için sayfanın üstündeki **eğitim yılı seçicisinde** **"Önceki okullar"** başlığı altındaki satırı seç
   ("2025-2026 · Eski Okul · 6-A"); şerit **"Önceki okulunun kaydına bakıyorsun — kayıtlar salt okunur."** der
   ([Geçmiş yıl](../egitim-yili/gecmis-yil.md)).

Tasarımda ana ekranında yeni kurumun oturumu ("Öğrenci · Test Ortaokulu") belirir; eski okulun oturumu durur, okul seni çıkarınca
"geçmiş" olur.

### Veli

1. Bildirim gelir: **"Elif Yılmaz Test Ortaokulu okuluna taşındı. Önceki okulunun kayıtları yıl seçicisinde."** (Çocuklarım'a götürür).
2. Bağın kopmaz; çocuğun veli kodu da değişmez.
3. Eski okulda başka çocuğun kalmadıysa "okulun" (duyurular ve takvim için) yeni okul olur.

## Kurallar ve sınırlar

- **Yetki:** "Öğrenci hesabı açar ve okula öğrenci ekler" (aynı pencere).
- **Eşleşme şartı:** T.C. kimlik no **ve** doğum tarihi. Yanlış doğum tarihi denemesi kişi başına saatte 10 ile sınırlı: **"Çok fazla
  yanlış deneme oldu. Bir saat sonra yeniden dene."**
- **T.C. senin okulunda başka hesaptaysa** (ör. bir servisçi): **"Bu T.C. kimlik no okulunda başka bir hesapta kayıtlı; öğrenci
  taşınamadı."** Okul no başkasındaysa: **"Bu okul numarası başka bir öğrencide"**.
- **Ne değişir:** okul, sınıf, okul no (formdan), yönetim notu (boşalır), öğrencinin seçili yıl görünümü (sıfırlanır). Kullanıcı adı
  yeni okulda boşsa aynen kalır; alınmışsa T.C. no olur; o da alınmışsa adından yeni bir ad türetilir.
- **Ne değişmez:** şifre, açık oturumlar, ad, e-posta, veli kodu, veliler. Formdaki ad, kullanıcı adı, şifre, e-posta, adres ve
  yönetim notu kullanılmaz; hesap kendi bilgileriyle gelir.
- **Eski okulun kayıtları:** ödev, not, devamsızlık, etüt yoklaması o okulun kaydıdır; silinmez, taşınmaz. Eski okulun yılları
  (hesabın açıldığı yıldan bugüne başlamış olanlar) öğrencinin "geçmişine" yazılır; sınıf adı yalnız son yılda bilinir.
- **İz:** işlem kaydına **"Öğrenci başka okuldan nakil geldi"** ve "Elif Yılmaz (Eski Okul okulundan)". Bildirimler öğrenciye,
  velilerine (kendi metinleriyle) ve eski okulun müdürüne gider.
- **Excel'de:** başka okuldaki T.C. satır hatasıdır: **"Bu T.C. kimlik no başka bir okulda kayıtlı bir öğrencinin. Öğrenciyi okuluna
  almak için "Öğrenci ekle"den doğum tarihiyle birlikte tek tek ekle"**.
- **Bilinen hatalar (kod okumasına göre; kod değiştirilmedi):**
  - **Seçilen sınıf alınmıyor:** form sınıfı bir adla, nakil başka bir adla okuyor; taşınan öğrenci pencerede hangi sınıf seçilmiş
    olursa olsun okula sınıfsız gelir. Sınıfı sonradan ver.
  - **Sınıf yetkisi denetlenmiyor:** düzeltilince nakil yolunda da "Öğrenciyi sınıfa yerleştirir" yetkisi ve sınıf kapsamı
    denetlenmeli (güvenlik denetimi işinde).
  - **"Doğum tarihini seç." yanıltabilir:** tarih seçilmiş ama tutmamışsa da aynı yazı çıkar; asıl neden pencerenin altındadır.
- **Kullanıcının kararları (tasarım):** nakil = yeni kurum oturum ekler (taşıma değil); kurumlar birbirini görmez ve birbirine
  bildirim göndermez; eşleşme şartı T.C. + doğum tarihi (e-posta tek başına yetmez); T.C. kimlik no her yerde zorunlu (2 Ekim).

## Kardeşler ve ilgili

**Kardeşler:** [Öğrenci hesabı açma](ogrenci-hesabi-acma.md) · [Öğrenciyi okuldan çıkarma](ogrenciyi-okuldan-cikarma.md) ·
[Hesap penceresi](hesap-penceresi.md) · [Veli bağlama](veli-baglama.md) · [Öğrenciler listesi](ogrenci-listesi.md).

**İlgili:** [Öğrencide birden çok kurum](../portallar/ogrencide-portallar.md), [Eşleştirme](../excel-aktarim/eslestirme.md),
[İçe aktarım](../excel-aktarim/ice-aktarim.md), [Geçmiş yıl](../egitim-yili/gecmis-yil.md), [Mezunlar](../egitim-yili/mezunlar.md),
[Bildirim metinleri](../bildirim/bildirim-metinleri.md), [Velinin bildirimleri](../bildirim/velinin-bildirimleri.md),
[Devamsızlığım](../devamsizlik/devamsizligim.md), [Kalıcılık ve silme](../basarilar/kalicilik-ve-silme.md) (başarılar öğrenciyle
gider), [T.C. kimlik no](../giris-hesap/tc-kimlik-no.md), [Neler kaydedilir](../islem-kaydi/neler-kaydedilir.md),
[Kim neyi görür](../kvkk-ve-gizlilik/kim-neyi-gorur.md).

## Kod tarafı

- Ön yüz: [public/js/parcalar/10b-hesaplar.md](../../public/js/parcalar/10b-hesaplar.md) — `hesap-ac-kaydet`'in nakil dalı
  (`nakil: 'dogum'` hatası), `nakilSonucu` ("Öğrenci okuluna taşındı"); [public/js/parcalar/16-egitim-yili.md](../../public/js/parcalar/16-egitim-yili.md)
  — yıl seçicisindeki "Önceki okullar".
- Sunucu: [sunucu/bolumler/nakil.md](../../sunucu/bolumler/nakil.md) — `baskaOkulOgrencisi`, `nakilEt`, `gecmisSatirlari`, deneme
  sınırı, bildirimler; [sunucu/bolumler/hesaplar.md](../../sunucu/bolumler/hesaplar.md) — `hesap-ac`'ın nakle yönlendirmesi;
  [sunucu/veri/depo/ogrenci-gecmisi.md](../../sunucu/veri/depo/ogrenci-gecmisi.md) — geçmiş satırları, `okuldanCikar` (etüt,
  servis, ev konumu).
- Testler: [testler/test-nakil.md](../../testler/test-nakil.md) (doğum tarihi yok / yanlış / doğru; sınıflı nakil denenmiyor).

## Sık sorulanlar

- **Öğrenci başka okuldan geldi; yeni hesap mı açayım?** Hayır. "Öğrenci ekle"de T.C. ile birlikte doğum tarihini seç; hesabı taşınır.
- **Doğum tarihini bilmiyorum.** Velisinden ya da önceki okulundan öğren; tahminle denersen saatte 10 yanlıştan sonra durursun.
- **Öğrenci eski notlarını görebilir mi?** Evet, yıl seçicisinin "Önceki okullar" bölümünden, salt okunur. Yeni okul göremez.
- **Taşınan öğrenci neden sınıfsız?** Bugünkü bir hata yüzünden pencerede seçilen sınıf alınmıyor; sınıfını Hesap penceresinden ver.
- **Excel'le toplu nakil olur mu?** Bugün olmaz (tek tek). Tasarımda Excel önizlemesinde "Eşleyelim mi?" ile olur.

## Sırada

- Tek kişi tek hesap ve öğrencide portallar: taşıma yerine eşleme, yeni oturum, eski oturumun "geçmiş" olması, Excel'de
  "Eşleyelim mi?" (canlıdan önce).
- Nakilde seçilen sınıfın alınması ve sınıf yetkisinin denetlenmesi (güvenlik denetimi / tam debug).
- T.C. kimlik no'nun her yerde zorunlu olması (kodu Linux'ta).
