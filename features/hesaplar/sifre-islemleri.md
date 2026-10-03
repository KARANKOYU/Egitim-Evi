# Öğrenci hesapları · Şifre işlemleri

**Durum:** Kodda var; tasarımda ek olarak okulun verdiği şifreyi öğrenci kendi şifresini belirleyene kadar pencerede görme
("Göster"/"Gizle"), ayrı "Şifre ver" penceresi (göz düğmesi, "Yeniden üret") ve okulun verdiği her şifrenin ilk girişte değişmesi.

Okulun bir öğrenciye yeni şifre verdiği yer: elle yazma ya da **"Rastgele üret"**, **"İlk girişte kendi şifresini belirlesin"** ve
**"Şifreyi T.C. no yap"**.

## Ne işe yarar

Öğrencilerin çoğunun e-postası yoktur; şifresini unutan öğrenci "Şifremi unuttum"u kullanamaz, şifresini okul yeniler (açılış
sayfasındaki SSS: "E-postası olmayan öğrenci ve servisçi hesabının şifresini okul yönetimi yeniler."). Şifreler geri döndürülemez
biçimde saklanır; okul bugünkü şifreyi göremez, yalnız yenisini belirler. Yeni şifreyle birlikte öğrencinin bütün açık oturumları
kapanır; şifreyi bilen başka biri açık oturumla devam edemez.

Bir sınıfın ya da bütün okulun şifrelerini birden yenilemek için [Toplu giriş bilgisi](toplu-giris-bilgisi.md) kullanılır.

## Nereden açılır

- **Öğrenciler → öğrencinin "Hesap" düğmesi → "Şifre" bölümü** ([Hesap penceresi](hesap-penceresi.md)).
- Tasarımda (Tasarım 1 önizlemesi): öğrencinin satırına basınca açılan pencerede **"Şifre"** satırı ve **"Şifre ver"**.

## Adım adım

### Müdür

1. Öğrencinin **"Hesap"** penceresini aç; **"Şifre"** başlığına in.
2. Bölümün ipucu sırayla şunları söyler: **"Şifreler geri döndürülemez biçimde saklanır, görüntülenemez."**; öğrenci henüz kendi
   şifresini koymadıysa **"Bu kişi henüz kendi şifresini belirlemedi."**; hiç girmediyse **"Hesaba hiç giriş yapılmadı."**; sonunda
   **"Unuttuysa yenisini belirle."**
3. Yeni şifreyi iki yoldan ver:
   - **Elle ya da üreterek:**
     1. **"Yeni şifre"** kutusuna yaz ya da **"Rastgele üret"**e bas. Üretilen şifre 10 karakterdir: 8 harf ve 2 rakam; karışan
        harfler (I, O, l) ve rakamlar (0, 1) içinde yoktur. Üretmek yalnız kutuyu doldurur, henüz bir şey kaydetmez. Kutu düz
        metindir, yazdığın görünür.
     2. **"İlk girişte kendi şifresini belirlesin"** kutusu işaretli gelir. İşaretli kalırsa öğrenci bu şifreyle girer girmez kendi
        şifresini koymak zorundadır; işareti kaldırırsan bu şifreyi kullanmaya devam edebilir.
     3. Kırmızı **"Şifreyi değiştir"**e bas. Tarayıcı sorar: **"Şifre değiştirilsin mi? Kişinin açık oturumları kapanacak."**
     4. "Kaydediliyor..." → bölümün altında mavi ileti: **"Elif Yılmaz için yeni şifre kaydedildi. Yeni şifre: …"**. Bu ileti
        kendiliğinden silinmez (kişiye ileteceksin), kutu boşalır.
     5. Yeni şifre ekrandayken pencerenin dışına tıklamak onu kapatmaz; geri tuşu, menüden başka sayfa, çıkış ya da sekmeyi kapatma
        önce sorar: **"Yeni şifre ekranda ve bir daha gösterilmeyecek. Kişiye ilettiysen ayrılabilirsin. Ayrılınsın mı?"**
        Pencereyi "Kapat" ile kapatınca soru kendiliğinden susar.
   - **T.C. no'ya döndürerek** (öğrencinin T.C.'si kayıtlıysa düğme görünür):
     1. **"Şifreyi T.C. no yap"**a bas. Tarayıcı sorar: **"Şifre T.C. kimlik numarası olsun mu? Kişi ilk girişte kendi şifresini
        belirleyecek; açık oturumları kapanacak."**
     2. Yeşil ileti: **"Elif Yılmaz için yeni şifre kaydedildi. Şifre T.C. kimlik no oldu; ilk girişte kendisi değiştirecek."**
        (birkaç saniye sonra kaybolur; ekranda gizli bir şifre olmadığı için ayrılırken sorulmaz).
4. Öğrenciye yeni şifreyi (ya da "şifren T.C. kimlik numaran" bilgisini) ilet.

Tasarımda (Tasarım 1 önizlemesi):

- Öğrencinin penceresindeki **"Şifre"** satırı:
  - okulun verdiği şifre duruyorsa **"••••••••"** ve **"Göster"** (basınca şifre görünür, düğme **"Gizle"** olur); altında **"Okulun
    verdiği şifre; öğrenci ilk girişte kendi şifresini belirleyince görünmez olur · henüz giriş yapmadı."**
  - öğrenci kendi şifresini koyduysa **"Öğrenci kendi şifresini belirledi"** ve **"Güvenlik için görünmez; unuttuysa yeni şifre
    ver."**
  - sağda **"Şifre ver"**.
- **"Şifre ver · Elif Yılmaz"** penceresi: **"Yeni şifre"** (hazır üretilmiş, okunması kolay 8 karakter: iki hece ve dört rakam;
  kutunun içinde göz düğmesi, yanında **"Yeniden üret"**), **"İlk girişte kendi şifresini belirlesin"** (işaretli), not **"Kaydedince
  öğrencinin açık oturumları kapanır. Okulun verdiği şifre, öğrenci kendi şifresini belirleyene kadar bu pencerede görünür."**,
  düğmeler **"Geri"**, **"Kaydet"**. Hatalar: **"Şifre en az 8 karakter olmalı."**, **"Şifrede harf ve rakam olsun."** Kaydedince
  ekranın altında "Elif Yılmaz için yeni şifre kaydedildi; açık oturumları kapandı.", işlem kaydına "… öğrenciye şifre verdi".
- "Şifreyi T.C. no yap" düğmesi önizlemede yok; kaldıran bir karar da yok.

### Çalışan (ek rolü olan öğretmen)

Şifre vermek için rolünde iki yetki gerekir: pencereyi açmak için **"Öğrenci bilgilerini düzenler"**, şifre için **"Öğrenci şifresi
sıfırlar"** (Roller ekranında "Hassas yetki — dikkatli ver." diye anılır). Bugünkü hazır şablonların hiçbirinde şifre yetkisi yoktur;
müdür istediği role ekler. (Özel roller tanımındaki öneride, onay bekleyen yeni **"Bilişim Teknolojileri Sorumlusu"** şablonunda bu
yetki var.) Kullanıcının istediği tam debug'da "müdür yardımcısının şifre değiştirmesi" ayrıca denenecek.

### Öğrenci

1. Bildirim gelir: **"Şifren okul yönetimi tarafından değiştirildi."**
2. Açık oturumların (telefon uygulaması dahil) kapanır; yeniden girersin.
3. Okulun verdiği şifreyle (ya da T.C. no'nla) gir. "İlk girişte…" işaretliyse önce kendi şifreni belirlersin
   ([Zorunlu şifre belirleme](../giris-hesap/zorunlu-sifre-belirleme.md)).
4. Sonra istediğin zaman **Ayarlar**'dan şifreni değiştirebilirsin ([Şifre değiştirme](../ayarlar/sifre-degistirme.md)). E-postan
   kayıtlıysa unuttuğunda "Şifremi unuttum"u da kullanabilirsin ([Şifremi unuttum](../giris-hesap/sifremi-unuttum.md)).

### Veli

Çocuğuna giden bildirimin kopyası sana da gelir: **"Elif Yılmaz · Şifren okul yönetimi tarafından değiştirildi."**
([Velinin bildirimleri](../bildirim/velinin-bildirimleri.md)).

## Kurallar ve sınırlar

- **Yetki:** "Öğrenci şifresi sıfırlar" (müdürde hep). Yoksa **"Bu işlem için yetkin yok"**; başka okulun öğrencisi **"Hesap
  bulunamadı"**.
- **Şifre kuralı (öğrenci):** en az 8 karakter, en az bir harf ve bir rakam. Kutu boşsa **"Yeni şifreyi yaz ya da üret."**;
  kurala uymazsa **"Şifre en az 8 karakter olmalı."** / **"Şifre en az bir harf ve bir rakam içermeli."** (Öğretmen ve müdür gibi
  yetişkin hesaplarında büyük harf, küçük harf, rakam ve özel karakter de istenir; "Rastgele üret"in şifresinde özel karakter
  olmadığı için eski düzenle açılmış öğretmen hesabında üretilen şifre reddedilir.)
- **Oturumlar kapanır:** kaydedince kişinin bütün oturumları ve telefon cihaz anahtarları silinir.
- **Kilit kalkar:** eski şifreye yapılan hatalı denemelerle kilitlenmiş hesabın kilidi kalkar
  ([Hatalı giriş ve kilit](../giris-hesap/hatali-giris-ve-kilit.md)).
- **İlk girişte değiştirme:** T.C. no'ya döndürmede, yazdığın şifre T.C. ile aynıysa ve kutu işaretliyse zorunludur.
- **Şifre bir kez görünür:** kaydedilen şifrenin yalnız özeti saklanır; ileti kapanınca şifre bir daha gösterilemez.
- **İz:** işlem kaydına **"Şifre yönetici tarafından değiştirildi"** ve öğrencinin adı yazılır; öğrenciye (ve velisine kopya)
  bildirim gider.
- **Kendi açtığı hesap:** kendi yetişkin hesabıyla okula eklenmiş öğretmenin şifresini okul değiştiremez: **"Öğretmen şifresini
  kendi hesabından değiştirir; unuttuysa "Şifremi unuttum" ile yeniler."** (öğrenci hesaplarında bu durum yok).
- **Kullanıcının kararları (tasarım):**
  - **Okulun verdiği her şifre ilk girişte değişir** (güvenlik denetimi, onaylı): yalnız T.C. ile açılanlar değil, toplu hesap açma,
    yetkilinin sıfırlaması, öğrenci ve servisçi hesaplarının hepsi (toplu giriş bilgisi dağıtımı bunu bugün de zorunlu kılıyor —
    [Toplu giriş bilgisi](toplu-giris-bilgisi.md)). Değiştirmeden yalnız şifre değiştirme, çıkış ve hesap bilgisi çalışır. Bu
    yapılınca "İlk girişte kendi şifresini belirlesin" kutusu anlamını yitirir; Tasarım 1 önizlemesinde kutu hâlâ duruyor (çelişki).
  - **Kurumlar şifreyi değiştirebilir** (29 Eylül 20:40): iki kurumlu (okul ve dershane) öğrencide de ek kısıt yok; değişiklik işlem
    kaydına ve kişiye bildirim olarak düşer.
  - **İki adımlı doğrulama şifre değişse de sürer** (29 Eylül 20:42): öğrenci Ayarlar → Güvenlik'ten iki adımı açtıysa okul şifreyi
    değiştirse de girişte kod istenir; şifreyi değiştiren kurum hesaba tek başına giremez ([Güvenlik](../ayarlar/guvenlik.md)).
  - **Yönetici ve destek** de kullanıcı sayfasındaki hesap penceresinden şifre değiştirir; ilk girişte değiştirme zorunludur
    ([Hesaba müdahale](../yonetim/hesaba-mudahale.md)).
- **Açık soru (tasarım):** önizleme okulun verdiği şifreyi öğrenci kendi şifresini koyana kadar "Göster" ile gösteriyor (kullanıcının
  29 Ağustos isteği: "kullanıcı adını ve şifresini görüntüleyip değiştirebilsin"). Bugün şifre geri döndürülemez saklanıyor; geçici
  şifrenin nasıl ve nerede saklanacağı tanımlarda yazılı değil.

## Kardeşler ve ilgili

**Kardeşler:** [Hesap penceresi](hesap-penceresi.md) · [Toplu giriş bilgisi](toplu-giris-bilgisi.md) ·
[Öğrenci hesabı açma](ogrenci-hesabi-acma.md) · [Öğrenciler listesi](ogrenci-listesi.md).

**İlgili:** [Zorunlu şifre belirleme](../giris-hesap/zorunlu-sifre-belirleme.md), [Şifremi unuttum](../giris-hesap/sifremi-unuttum.md),
[Şifre kuralları](../giris-hesap/sifre-kurallari.md), [Hatalı giriş ve kilit](../giris-hesap/hatali-giris-ve-kilit.md),
[Şifre değiştirme](../ayarlar/sifre-degistirme.md), [Açık oturumlar](../ayarlar/acik-oturumlar.md), [Güvenlik](../ayarlar/guvenlik.md),
[Velinin bildirimleri](../bildirim/velinin-bildirimleri.md), [Neler kaydedilir](../islem-kaydi/neler-kaydedilir.md),
[Yetki listesi](../roller-yetkiler/yetki-listesi.md), [Hesaba müdahale](../yonetim/hesaba-mudahale.md).

## Kod tarafı

- Ön yüz: [public/js/parcalar/10b-hesaplar.md](../../public/js/parcalar/10b-hesaplar.md) — şifre bölümü, `hesap-sifre-uret`,
  `hesap-sifre-kaydet`, `hesap-sifre-tc`, `hesapSifreGonder`, `hesapSifresiKorunsun`;
  [public/js/parcalar/03-mesaj-modal.md](../../public/js/parcalar/03-mesaj-modal.md) — `TEK_SEFER`, `mesajGoster`;
  [public/js/parcalar/05-giris.md](../../public/js/parcalar/05-giris.md) — `sifreSorunuTR`, `gucluSifreli`.
- Sunucu: [sunucu/bolumler/hesaplar.md](../../sunucu/bolumler/hesaplar.md) — `POST /api/school/hesap-sifre` (`degistirsin`,
  oturumları kapatma, kilidi kaldırma, bildirim, işlem kaydı); [sunucu/guvenlik.md](../../sunucu/guvenlik.md) — `girisBasarili` (giriş
  sınırları); [sunucu/veri/depo/oturumlar.md](../../sunucu/veri/depo/oturumlar.md) — `hepsiniKapat`;
  [sunucu/ortak.md](../../sunucu/ortak.md) — `sifreSorunu`.
- Testler: [testler/test-yonetim.md](../../testler/test-yonetim.md) (`hesap-sifre` ile T.C.'ye dönüş),
  [testler/yetki-denetimi.md](../../testler/yetki-denetimi.md).

## Sık sorulanlar

- **Öğrencinin şu anki şifresini görebilir miyim?** Hayır; şifreler geri döndürülemez saklanır. Yenisini ver.
- **"Rastgele üret"e bastım, şifre değişti mi?** Hayır; yalnız kutu doldu. "Şifreyi değiştir"e basınca değişir.
- **Öğrenci yeni şifreyle giremiyor.** Kullanıcı adını doğru yazdığından ve okulun adresinden girdiğinden emin ol; çok yanlış
  denediyse hesap bir süre kilitlenmiş olabilir, yeni şifre vermek kilidi kaldırır.
- **Öğrenciye bildirim gidiyor mu?** Evet: "Şifren okul yönetimi tarafından değiştirildi." Velisine de kopyası gider.
- **Bütün sınıfın şifresini birden yenileyebilir miyim?** Evet: [Toplu giriş bilgisi](toplu-giris-bilgisi.md).

## Sırada

- Güvenlik denetimi: okulun verdiği her şifrenin ilk girişte değişmesi.
- Tasarım 1'deki "Şifre ver" penceresi ve okulun verdiği şifreyi gösterme (saklama biçimi açık soru).
- Yönetici ve desteğin şifre işlemleri (kullanıcı arama işi); öğrencide isteğe bağlı iki adımlı doğrulama.
