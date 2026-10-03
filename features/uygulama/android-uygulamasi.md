# Uygulama ve indirme · Android uygulaması

**Durum:** Kodda var; tasarımda ek olarak bütün rollerin kendi ekranları (ödev, program, yoklama, servis, mesajlar…), Google Play,
açılış ekranında "Hesaba gir →" ile "Doğrulayıcı", kendini güncelleme, yeni geri tuşu düzeni ve çok dil.

Eğitim Evi'nin telefon yüzü: siteyi içinde açmayan, ekranlarını kendisi çizen (yerel) Android uygulaması; müdür, öğretmen, veli,
öğrenci ve servisçi aynı uygulamaya girer.

## Ne işe yarar

Telefonda Eğitim Evi'ni tarayıcısız, bildirimleri telefonun bildirim çubuğunda, servis konumunu arka planda göndererek kullanmak
için. Kullanıcının istekleri (yazıldığı gibi): 26 Eylül "telefona ayrı apk yapsak ve bunuda ayrı repo?", aynı gün "yeni repo açıcam
github dan EgitimEvi app diye ve izimleri isticek başta" ve "ndroid app lazım bence konum vb için", akşam "direk webwiev olmasın çok
kalitesiz ve maatör hani biraz daha app e özel website olmadan özenli olsa apk ve aab"; 3 Ekim son karar "android hem apk hem play
store".

Bugün iki kuşak var:

| | **Eğitim Evi Aile** (1.0.x) | **Eğitim Evi** (2.0.0) |
|---|---|---|
| Durum | **Yayımda**: İndir sayfasından inen bu | Android deposunda yazılı, derleniyor; **henüz yayımlanmadı** |
| Ne için | Yalnız çocuğun telefonu: konum ve ekran süresini veliyle paylaşmak | Herkes: giriş, hesap, portallar, "+ Ekle", bildirimler, ayarlar, çocuğun telefonu |
| Ayrıntı | [Çocuğumun telefonu](../aile/README.md) | bu belge |

İkisi aynı paket adını taşır: 2.0.0, telefondaki 1.0.x'in üstüne **güncelleme** olarak kurulur ve çocuğun telefonunun bağlantısı
korunur. Rollerin kendi ekranları (ödev, yoklama, servis…) 2.0.0'da henüz yok; tanımı aşağıda "Tasarımda".

## Nereden açılır

- **İndirmek:** [İndir sayfası](indir-sayfasi.md) → **"İndir (APK, …)"** → dosyayı aç → **Yükle**. Tasarımda ayrıca
  **"Google Play"**.
- **Açmak:** telefonun ana ekranındaki **Eğitim Evi** simgesi.
- **Bildirimden:** telefonun bildirim çubuğundaki Eğitim Evi bildirimine dokununca uygulama açılır, **Bildirimler** sayfası gelir.

## Adım adım

### Herkes: kurma ve ilk açılış (2.0.0)

1. İndir sayfasından APK'yı indir ve kur (telefon "bilinmeyen uygulamalar" için izin isterse bir kez ver;
   [İndir sayfası](indir-sayfasi.md)).
2. Uygulamayı aç. Oturum yoksa **giriş ekranı** gelir; üst ve alt çubuk gizlidir. Üstte "Eğitim Evi" ve "Ödev, not, servis ve
   okuldan haberler tek yerde."; altında **"Giriş yap"** başlığı:
   - **"E-posta ya da kullanıcı adı"** (örnek yazısı "ornek@eposta.com") ve **"Şifre"** (altında "Şifreyi göster" /
     "Şifreyi gizle");
   - öğrenci ya da servisçiysen **"Öğrenci ya da servisçiysen okulunu seç"** → **"Okulun"** kutusuna okulunun adını yaz
     ("Okulunun adını yaz"; bulunamazsa "Bu adla bir okul bulunamadı."), seçince adın yanında "· değiştir";
   - **"Giriş yap"** (gönderirken "Giriş yapılıyor..."), **"Şifremi unuttum"**;
   - **"Hesabın yok mu?"** — "Veli, öğretmen ve müdür kendi hesabını açar. Öğrenci ve servisçi hesabını okul açar; kullanıcı adını ve
     ilk şifreni okulundan al." ve **"Hesap aç"**;
   - en altta "Bilgilerin yalnızca Eğitim Evi sunucusunda tutulur; reklam ya da satış için kimseyle paylaşılmaz."

   Boş bırakırsan: "Kullanıcı adını ya da e-posta adresini yaz." / "Şifreni yaz." Hatalı denemeden sonra sunucu isterse doğrulama
   sorusu çıkar ("Doğrulama: 4 + 7 = ?" gibi). Ayrıntı: [Giriş](../giris-hesap/giris.md),
   [Okulun sayfasından giriş](../giris-hesap/okulun-sayfasindan-giris.md), [Robot doğrulaması](../giris-hesap/robot-dogrulamasi.md).
3. E-postası olan hesapta **"Giriş kodu"** ekranı: "E-postana gelen kodu yaz" · "Giriş kodu e-posta adresine gönderildi." · **"6
   haneli kod"** kutusu (altı rakam yazılınca kendiliğinden gönderilir) · **"Girişi tamamla"** · "Kod gelmediyse istenmeyen (spam)
   klasörüne bak. Kod 5 dakika geçerlidir." · "Yeni kod 60 saniye sonra istenebilir" sayacı, süre dolunca **"Yeni kod gönder"**
   ("Yeni kod gönderildi."); sol üstte **"← Geri"**. Yanlış biçimde: "Kod 6 rakamdır."
   ([İki adımlı giriş](../giris-hesap/iki-adimli-giris.md)).
4. Aydınlatma metni güncellendiyse **"Aydınlatma metni"** ekranı: "Aydınlatma metni güncellendi" · "Devam etmeden önce yeni metni
   okuyup onaylaman gerekiyor." · beş maddelik özet ("Veri sorumlusu", "Ne işlenir", "Kim görür", "Paylaşım", "Haklarım") ·
   **"Metnin tamamını oku"** (sitede açılır) · onay kutusu "Aydınlatma metnini okudum; kişisel verilerimin bu metne göre işlenmesini
   kabul ediyorum." · **"Onayla ve devam et"** / **"Çıkış yap"**. Kutu işaretsizse "Devam etmek için onay kutusunu işaretle."
   ([Onay ve yeniden onay](../kvkk-ve-gizlilik/onay-ve-yeniden-onay.md)).
5. Okulun ya da yöneticinin verdiği şifreyle girdiysen **"Kendi şifreni belirle"**: "Sana verilen şifreyle girdin. Bu şifreyi
   başkaları da bilebilir; devam etmeden önce yalnızca senin bildiğin bir şifre belirle." · "Sana verilen şifre", "Yeni şifre",
   "Yeni şifre (tekrar)" · **"Şifreyi kaydet"** (çıkış dışında başka yol yok;
   [İlk girişte kendi şifreni belirleme](../giris-hesap/zorunlu-sifre-belirleme.md)).
6. Sekmeler açılır. Android 13 ve üstünde telefon bildirim izni ister; izin ver ki bildirimler telefona düşsün.

Hesap açma (**"Hesap aç"**: "Adın ve soyadın", "Kullanıcı adı", "E-posta", "Telefon (ülke koduyla)", "Şifre", "T.C. kimlik no
(isteğe bağlı)", aydınlatma onayı, **"Hesabımı aç"** → "E-postana bak" · "E-postana bir bağlantı gönderdik. Hesabını açmak için 24
saat içinde ona tıkla.") ve şifre yenileme (**"Şifreni yenile"** → **"Bağlantı gönder"**; "Bağlantı sitede açılır.") ayrıntısı:
[Kayıt olma](../giris-hesap/kayit-olma.md), [Şifremi unuttum](../giris-hesap/sifremi-unuttum.md).

### Ekranın düzeni (herkes, 2.0.0)

- **Üst çubuk:** solda kişinin avatarı (ekran okuyucu: "Hesabım ve portallarım") ya da iç sayfadayken geri oku ("Geri"); ortada
  sayfanın başlığı; sağda **"Yenile"** ve bildirim zili, okunmamış varsa üstünde sayı. Zile dokununca Bildirimler açılır.
- **Alt çubuk:** **"Ana sayfa"**, **"Bildirimler"**, **"Ayarlar"**. Bugün herkeste bu üçü. Seçili sekmeye yeniden dokunursan o
  sekmenin başına dönersin.
- **Ana sayfa:** bugünün tarihi ("26 Eylül, Cumartesi" gibi), günün saatine göre selam ("Günaydın, Deniz"), altında rolün ve okulun
  ("Öğretmen · Test Ortaokulu" gibi). Sonra:
  - portalı olmayan yetişkinde: **"Henüz bir portalın yok"** · "Başla: çocuğunu ekle, okuluna öğretmen olarak katıl ya da okulunu
    açtır." · **"+ Ekle"** ([Henüz portalı olmayan yetişkin](../portallar/portalsiz-hesap.md));
  - birden çok portalı olup henüz hiçbirine girmemiş yetişkinde (hesabının kendisiyle açıkken): **"Portalların"** kartı;
  - öbür herkeste mavi şerit: "Bu sürümde rolüne özel ekranlar hazırlanıyor. Bildirimlerin ve ayarların hazır."
- **Bildirimler:** gün gün ("Bugün", "Dün", "12 Eylül, Cuma"); okunmamışlar solda noktalı ve kalın; sayfa açılınca hepsi okundu
  sayılır, zildeki sayı söner. Bildirim yoksa: **"Bildirim yok"** · "Ödev, mesaj, servis ve okuldan haberler burada görünür."
- **Ayarlar** (yukarıdan aşağı):
  - profil kartı: ad, "Rol · okul" (rolsüzse "Hesabım"), e-posta ya da kullanıcı adı;
  - öğrencide **"Veli kodun"**: "Velin bu kodla seni Eğitim Evi'nde ekler. Kodu yalnızca velinle paylaş." ve kopyalanabilir kod
    ("Kod kopyalandı.");
  - **"Hesap"**: yetişkinde **"Portallarım"** ("Veli, öğretmen ve müdür portalların arasında geç") ve **"Ekle"** ("Çocuğunu ekle,
    öğretmen olarak katıl ya da okulunu açtır"); herkeste **"Şifre değiştir"**;
  - **"Telefon"**: **"Telefon bildirimleri"** (alt yazısı izin varsa "Açık: 15 dakikada bir, servis saatlerinde dakikada bir bakılır",
    yoksa "Kapalı: dokun ve izin ver"); öğrencide **"Bu telefonu velimle paylaş"** ("Konumunu ve ekran süreni velin görsün" ya da
    bağlıysa "Bağlı: konum ve ekran süresi velinle paylaşılıyor");
  - **"Eğitim Evi"**: **"Siteyi aç"** ("Uygulamada olmayan işler için (Excel aktarımı, roller, ders programı)"), **"Aydınlatma
    metni"**, **"Sık sorulan sorular"** (üçü tarayıcıda açılır);
  - kırmızı **"Çıkış yap"** → "Çıkış yapılsın mı?" · "Bu telefonda bildirimler de durur." · **"Çıkış yap"** / **"Vazgeç"**;
  - en altta sürüm: "Eğitim Evi 2.0.0".
- **Hata ve uyarılar:** internet yoksa "İnternet bağlantısı yok ya da Eğitim Evi'ne ulaşılamadı." (veri ekranlarında **"Yeniden
  dene"** ile); oturum bittiyse "Oturumunun süresi doldu. Yeniden giriş yap." ve giriş ekranı.

### Öğrenci

**Bugün (2.0.0):** okulunu seçerek okulun verdiği kullanıcı adı ve şifreyle girersin (sunucu öğrenciye iki adımlı kod sormaz).
Üç sekme; Ayarlar'da **"Veli kodun"** ve **"Bu telefonu velimle paylaş"** ([Çocuğun telefonunu bağlama](../aile/telefonu-baglama.md)).
Avatarına dokununca Ayarlar açılır.

**Tasarımda (tanım):** Ana sayfa (bugünün dersleri, yaklaşan ödevler, ödev serisi şeridi, servis durumu) · Ödevler (süzgeçler;
ayrıntıda açıklama, ekleri indirme, teslim dosyası yükleme/silme, quiz başlatma, çözme, sonuç) · Program (haftalık ders programı,
bugün vurgulu) · Servis (servis kartı, harita, sıra "önünde N", bugünkü durum, notlar) · Diğer (Sınavlar ve ilerleyiş grafiği,
Devamsızlık, Yemek listesi, Takvim, Mesajlar, Anketler, Hatırlatıcılar, Ayarlar). Quiz çözerken uygulamadan çıkış da kaydedilir
([Quiz çözme](../quiz/quiz-cozme.md), [Çıkış kaydı](../quiz/cikis-kaydi.md)). 29 Eylül kararıyla öğrenci isterse iki adımlı girişi
kendisi açar ([İki adımlı giriş](../giris-hesap/iki-adimli-giris.md)).

### Veli

**Bugün (2.0.0):** e-posta ya da kullanıcı adıyla girersin (e-postan varsa iki adımlı kod). Avatar → **"Portalların"** penceresi:
"Veli · <çocuğun adı>", "Öğretmen · <okul>" gibi satırlar, bulunduğun portalda yeşil **"Buradasın"**, onay bekleyende **"Onay
bekliyor"**; altta **"+ Ekle"** ve **"Ayarlar"**; portalın yoksa "Henüz bir portalın yok. + Ekle ile başla." Bir satıra dokununca
o portala geçersin (sunucu yeni oturum açar, sekmeler baştan kurulur; [Portala geçiş](../portallar/portala-gecis.md)).
**"+ Ekle"** → "Ne eklemek istiyorsun?": **Veli** ("Çocuğunun veli kodunu gir; ödevini, notunu, servisini gör."), **Öğretmen**
("Kişi kodunu okulunun müdürüne ver; seni okula ekler."), **Müdür** ("Okulunu Eğitim Evi'ne açtır; yönetici okulunu açıp seni müdür
yapar."). Veli seçeneğinde **"Çocuğunu ekle"** → "Veli kodu (16 karakter)" → **"Çocuğumu ekle"** ("Çocuğun eklendi."; kısa kodda
"Veli kodu 16 karakterdir.") ([+ Ekle penceresi](../portallar/ekle-penceresi.md), [Kişi kodu](../portallar/kisi-kodu.md)).
Çocuğunun konumu ve ekran süresi sitede "Çocuğumun telefonu"nda ([Çocuğumun telefonu](../aile/README.md)).

**Tasarımda (tanım):** Ana sayfa (çocuğun özeti: bugünkü dersler, son ödev sonuçları, devamsızlık) · Ödevler · Servis ("Binmeyecek"
işaretleme ve notlar) · Mesajlar · Diğer (Devamsızlık, İlerleyiş, Çocuğumun telefonu: özet, harita, ekran süresi grafiği, sınırlar;
Yemek, Takvim, Anketler, Hatırlatıcılar, Ayarlar). Tanım "üstte çocuk seçici" der; kullanıcının 3 Ekim kararıyla **her çocuk ayrı
oturumdur**, birleşik görünüm yok: çocuklar arasında "Portalların"dan geçilir ([Velide her çocuk ayrı oturum](../portallar/velide-cocuk-oturumlari.md)).

### Öğretmen ve müdür

**Bugün (2.0.0):** veliyle aynı yetişkin hesabı: e-posta ya da kullanıcı adıyla giriş, e-postan varsa iki adımlı kod; avatar →
"Portalların"; **"+ Ekle"** → **Öğretmen** ya da **Müdür** seçeneğinde **"Kişi kodun"**: kopyalanabilir 16 karakterlik kod;
öğretmende "Bu kodu okulunun müdürüne ver. Müdür kodu girince seni okula öğretmen olarak ekler; okul portalların arasında görünür.",
müdürde "Yöneticimize okulunun adını ve bu kodu ver. Okulunu ve adresini açıp seni müdür yapar; okul portalların arasında görünür."
(müdürde yöneticinin e-postası ve telefonu da yazar); altında "Kod bir kez kullanılır; seni ekleyince yenilenir. Kodu yalnızca
vermek istediğin kişiye ver." ve **"Yeni kod üret"** ("Yeni kod üretildi; eskisi artık geçmez."). Rol ekranları yok; okul işleri
için Ayarlar → **"Siteyi aç"**.

**Tasarımda (tanım) — öğretmen:** Ana sayfa (bugünkü dersler; "Şu an — yoklama al") · Program ve Yoklama (Geldi / Gelmedi izinli /
izinsiz, "Hepsi geldi", Kaydet) · Ödevler (ödev verme: ders, ad, açıklama, tarih-saat seçici, sınıf ve öğrenci seçimi, ekler, quiz;
kontrol ekranı: öğrenci başına sonuç, "N ek", quiz sonucu; sonuçlandırma) · Mesajlar (yeni mesaj; yetkisi varsa toplu mesaj) · Diğer
(Sınıflarım, Sınavlar ve not girişi, Etüt yoklaması, Takvim, Anketler, Hatırlatıcılar, Ayarlar). Sonuç renkleri sitedekiyle aynı:
Yaptı yeşil, Geç yaptı mavi, Eksik turuncu, Yapmadı kırmızı, Gelmedi (izinsiz) bordo.

**Tasarımda (tanım) — müdür:** Ana sayfa (özet kutucukları: öğrenci ve öğretmen sayısı, bugünkü devamsızlık, yaklaşan etkinlikler;
ödev yok) · Mesajlar ve duyuru · Takvim · Diğer (kişi koduyla ekleme — tanımda "Öğretmenler: Kodla ekle", çalışan kararından sonra
"Çalışanlar"; Öğrenciler: liste, arama, veli kodunu gösterme ve Kopyala; Servisler ve servis saatleri; Özellikler; İşlem kaydı
(salt okunur); Siteyi aç; Ayarlar). Ağır yönetim işleri (Excel aktarımı, rol yönetimi, ders programı düzenleme, okul sayfası
düzenleme) uygulamada yoktur; o sayfalarda "Bu işlem sitede: Siteyi aç" satırı çıkar.

### Servisçi

**Bugün (2.0.0):** okulunu seçerek kullanıcı adınla girersin. Üç sekme. Seferin konumunu arka planda gönderen bölüm uygulamada hazır
(çalışırken bildirim çubuğunda **"Sefer sürüyor"**, kanalı **"Servis seferi"**; konum araç son gönderilen noktadan 30 metreden fazla
uzaklaşınca ya da 20 saniyede bir gider, iki gönderim arasında en az 5 saniye; sunucu seferi kapatınca kendiliğinden durur) ama
**onu başlatan ekran henüz yok**; servis yoklamasını bugün sitede yaparsın ([Yoklama sayfası](../servis/yoklama-sayfasi.md),
[Canlı konum ve harita](../servis/canli-konum-ve-harita.md)).

**Tasarımda (tanım):** Yoklama (sabah Bindi / Binmedi, Seferi başlat / Okula vardık; akşam Geldi / Gelmedi → Başlat → İndi; sıra
düzenleme; notlar; konum arka planda gider) · Harita (sıradaki ev, yol tarifi) · Mesajlar · Diğer (Takvim, Hatırlatıcılar, Ayarlar).

### Yönetici

**Bugün (2.0.0):** uygulama yönetici rolünü tanır (ana sayfada rolün "Yönetici" diye yazar) ama sana özel ekran yok. Yönetim
işleri sitede.

**Tasarımda:** yöneticiye (ve desteğe) doğrulama uygulaması zorunludur; kodu uygulamanın **"Doğrulayıcı"**sından alabilirsin
([Doğrulayıcı](dogrulayici.md)). Uygulamanın girişsiz sol menüsünde yönetici ve destek için sunucu söylerse "Yönetim" bağlantısı
(tanımda; yorumu kullanıcıya soruldu, aşağıda açık nokta).

### Çalışan ve eğitmen

Rolsüz çalışan ve eğitmen hesapları tasarımdadır ([Rolsüz çalışanın ana sayfası](../ana-sayfa/calisan-ana-sayfasi.md),
[Eğitmen rolü](../egitim-icerikleri/egitmen-rolu.md)). Uygulama tanımında bu ikisinin ekran listesi yazılmadı; uygulamaya
girebilirler ama kendi ekranları belirlenmedi (açık nokta). Çalışan tanımına göre öğretmen de okula çalışan olarak eklenip
"Öğretmen" rolü alır; o rolü alan çalışan öğretmenin ekranlarını kullanır.

### Tasarımda: herkes için

- **Açılış ekranı:** "Giriş yap / Kayıt ol" yerine iki düğme: **"Hesaba gir →"** ve **"Doğrulayıcı"**
  ([Doğrulayıcı](dogrulayici.md)).
- **Sol menü (yorum, kullanıcıya soruldu):** 27 Eylül sözü (yazıldığı gibi) "solda menü kısmında butonlar bir anasayfay dön
  şeylerin olduğı hani yorumlar üstteki footer header". Tanımdaki yorum: giriş yapmadan da açılan, soldan kayan menü: Ana sayfa (sitenin tanıtımı),
  Yorumlar (salt okunur), Hakkında, SSS, KVKK, Kullanım koşulları, İndir, Yapımcılar, İletişim, GitHub deposu — sitenin üst ve alt
  bilgisindeki bağlantılar aynı sırayla; altında oturum yoksa "Hesaba gir →", varsa hesap adı, portallar ve Çıkış; her durumda
  "Doğrulayıcı".
- **Ortak ekranlar:** Mesajlar (gelen/giden, konuşma, yeni mesaj, ekler, okundu), Takvim (ay görünümü ve gün listesi),
  Hatırlatıcılar (bir kez / her gün / haftanın günleri / ayda bir), Anketler (oy ver, sonuç), Yemek listesi; bildirime dokununca ilgili
  ekran açılır.
- **Ekran kuralları:** her veri ekranında yükleniyor, boş (anlamlı simge ve açıklama) ve hata ("Yeniden dene") hâlleri; dokunma alanı
  en az 48 dp; emoji yok; listeler gün gün; saatler Türkiye saatiyle; harita OpenStreetMap ("© OpenStreetMap katkıcıları",
  "Google Haritalar'da aç"); dosya yüklerken ilerleme çubuğu.
- **Geri tuşu:** önce açık olanı kapatır, kökte uygulamadan çıkmaz ([Android geri tuşu](geri-tusu.md)).
- **Güncelleme:** .apk ile kurulanda "Yeni sürüm var" şeridi ve "Güncelle"; Google Play'den kurulanda mağaza bağlantısı
  ([Kendini güncelleme](kendini-guncelleme.md)).
- **Çok dil:** Ayarlar'da dil seçici, sağdan sola diller; hukuki metinler Türkçe kalır ([Dil seçici](../dil/dil-secici.md)).
- **T.C. kimlik no:** hesap açmada ve ayarlarda zorunlu, sitedekiyle aynı geçerlilik kuralı ([T.C. kimlik no](../giris-hesap/tc-kimlik-no.md)).
- **"+ Ekle":** sitenin tasarımında seçenekler **Veli · Çalışan · Müdür**dür (bugün uygulamada Veli · Öğretmen · Müdür); uygulama
  kodlanırken siteye uyacak ([+ Ekle penceresi](../portallar/ekle-penceresi.md)).
- **Dağıtım:** .apk İndir sayfasından ve Google Play (Play için ayrı paket).

## Kurallar ve sınırlar

- **Telefon:** Android 8.0 ve üstü. iPhone'a yerel uygulama yok; iPhone ve iPad tarayıcıdan yükler
  ([Tarayıcıdan uygulama olarak yükleme](tarayicidan-yukleme.md)).
- **Yerel uygulama:** siteyi içinde açmaz; dış kütüphane, reklam ya da analiz yok; yalnız Türkçe (bugün); açık ve koyu tema
  telefonun ayarını izler, renkler sitenin renkleri.
- **Oturum:** uygulamada açılan oturum **30 gün** geçerlidir (tarayıcıda 7 gün); kullandıkça uzamaz, portal değiştirerek de uzatılamaz.
  Çıkışta, şifre değişince ve hesap silinince kapanır. Süresi bitince "Oturumunun süresi doldu. Yeniden giriş yap."
- **Telefonda saklananlar:** oturum, hesap bilgisi, bildirim yoklamasının yeri, çocuğun telefonu bağlantısı. Şifreler telefonda
  tutulmaz. Hiçbiri yedeklenmez ve yeni telefona taşınmaz: yeni telefonda yeniden girersin, çocuğun telefonu yeniden bağlanır.
- **Uygulama anahtarı:** girişten sonra telefon kendine bir anahtar alır; anahtar **hesaba giriş vermez**, yalnız bildirimleri sormaya
  ve servis konumu göndermeye yarar. Hesap başına en çok **5** telefon (fazlası en eskisini siler), saatte en çok 20 yeni anahtar.
  Şifre değişince hesabın bütün anahtarları silinir; telefon yenisini kendiliğinden alır.
- **Bildirimler** (Firebase yok, telefon sunucuya sorar): **15 dakikada bir**; okulun servis saatlerinde (başlangıçtan 10 dakika
  önceden bitişten 60 dakika sonrasına) yaklaşık **dakikada bir**. Bir soruşta en çok 20 bildirim; ilk kurulumda eski bildirimler
  telefona düşmez; uygulama öndeyken bildirim çubuğuna yazılmaz. Bildirimin başlığı "Eğitim Evi", kanalı "Bildirimler"
  ([Telefon bildirimi](../bildirim/telefon-bildirimi.md), [Zilin tazelenmesi](../bildirim/yoklama-araligi.md)).
- **Bağlantı:** yalnız `https://` ile konuşur. Varsayılan sunucu `https://egitimevi.org`.
- **Çıkış:** önce telefonun anahtarı silinir, sonra oturum kapanır; telefon bildirimleri ve süren servis seferi durur. Çocuğun
  telefonunun bağlantısı çıkıştan etkilenmez ([Bağlantıyı kaldırma](../aile/baglantiyi-kaldirma.md)).
- **İzinler:** bildirim (Android 13 ve üstü); konum (servisçinin seferi ve çocuğun telefonu); kullanım erişimi ve pil kısıtlamasının
  kalkması (yalnız çocuğun telefonu; [Telefondaki izinler ve durum](../aile/izinler-ve-durum.md)).
- **Yayın:** sürümler uygulamanın GitHub deposunda yayımlanır ve İndir sayfasına kendiliğinden gelir; her yayında sürüm kodu artar
  ve paket hep aynı anahtarla imzalanır (anahtar değişirse kurulu uygulamalar güncellenemez).
- **Bilinen açıklar (Android deposunun belgelerine göre):**
  - Servis seferini başlatan ekran yok.
  - Bildirim çubuğundan dokununca yalnız Bildirimler sayfası açılır; listede bir bildirime dokununca bugün yalnız profil bildirimi bir
    ekran (Ayarlar) açar.
  - Kök sayfada geri tuşu uygulamadan çıkar ([Android geri tuşu](geri-tusu.md)).
  - "Hesap aç" ekranındaki metin "+ Ekle"yi "sağ üstte" diye anlatıyor; uygulamada "+ Ekle" sol üstteki avatarın penceresinde,
    Ayarlar'da ve portalsız ana sayfada.
  - Uygulama açıkken telefonun teması değişirse açık ekranlar yeni renge geçmez; çocuğun telefonu ekranı koyu temaya uymuyor ve
    telefon döndürülünce yazılanlar gidiyor.
  - Deneme paketinde sunucu adresini seçen ekran yok (geliştirici notu).

## Kardeşler ve ilgili

**Kardeşler** ([Uygulama ve indirme](README.md)): [İndir sayfası](indir-sayfasi.md) · [Doğrulayıcı](dogrulayici.md) ·
[Kendini güncelleme](kendini-guncelleme.md) · [Android geri tuşu](geri-tusu.md) · [Ağ yokken açılış](cevrimdisi-acilis.md) ·
[Tarayıcıdan uygulama olarak yükleme](tarayicidan-yukleme.md) · [Telefonuna kur kartı](telefonuna-kur-karti.md).

**İlgili:** [Giriş](../giris-hesap/giris.md) · [İki adımlı giriş](../giris-hesap/iki-adimli-giris.md) ·
[Kayıt olma](../giris-hesap/kayit-olma.md) · [Beni hatırla](../giris-hesap/beni-hatirla.md) · [Çıkış yap](../giris-hesap/cikis-yap.md) ·
[Portala geçiş](../portallar/portala-gecis.md) · [+ Ekle penceresi](../portallar/ekle-penceresi.md) ·
[Telefon bildirimi](../bildirim/telefon-bildirimi.md) · [Çocuğumun telefonu](../aile/README.md) ·
[Canlı konum ve harita](../servis/canli-konum-ve-harita.md) · [Aydınlatma metni](../kvkk-ve-gizlilik/aydinlatma-metni.md).

## Kod tarafı

- **Android deposu** (ayrı depo, `KARANKOYU/Egitim-Evi-App`; her Java dosyasının yanında aynı adlı `.md`): `TANITIM.md` (bütün
  ekranlar, kullanılan uçlar, telefonda saklananlar, bilinen açıklar), `AnaEkran.md` (üst ve alt çubuk, sayfa yığınları, geri, çıkış,
  genel hatalar), `Sekmeler.md`, `AnaSayfa.md`, `BildirimlerSayfasi.md`, `AyarlarSayfasi.md`, `PortalSecici.md`, `EkleSayfasi.md`,
  `GirisSayfasi.md`, `KodSayfasi.md`, `KayitSayfasi.md`, `KvkkSayfasi.md`, `SifreSayfasi.md`, `Bildirimler.md` (yoklama),
  `SeferServisi.md` (sefer konumu), `AileEkrani.md` (çocuğun telefonu).
- **Site deposu (sunucu tarafı):** [sunucu/bolumler/cihaz.md](../../sunucu/bolumler/cihaz.md) (uygulama anahtarı, bildirim
  yoklaması, sefer konumu), [sunucu/bolumler/kayit.md](../../sunucu/bolumler/kayit.md) (giriş, 30 günlük uygulama oturumu),
  [sunucu/bolumler/kisilik.md](../../sunucu/bolumler/kisilik.md) (portallar, kişi kodu, "+ Ekle"),
  [sunucu/bolumler/aile.md](../../sunucu/bolumler/aile.md) (çocuğun telefonu), [sunucu/uygulama-surum.md](../../sunucu/uygulama-surum.md)
  (İndir sayfasının sürüm listesi).
- Testler (site deposu): [testler/test-servis-yoklama.md](../../testler/test-servis-yoklama.md) (uygulama anahtarı, bildirim
  yoklaması, servis konumu, 30 günlük oturum), [testler/test-uygulama-surum.md](../../testler/test-uygulama-surum.md). Android
  deposunda otomatik test yok.
- Kullanıcıya dönük anlatım: [belge/KILAVUZ.md](../../belge/KILAVUZ.md) ("Eğitim Evi telefon uygulaması").
- Tasarım: rollerin ekranları ve doğrulayıcı uygulamanın tanımında (geliştirme notları); Tasarım 1 önizlemesi sitenin tasarımıdır,
  uygulamanın ekranlarını çizmez.

## Sık sorulanlar

- **Uygulama siteyi mi açıyor?** Hayır; ekranlarını kendisi çizer, sunucuyla doğrudan konuşur.
- **iPhone için uygulama var mı?** Yerel uygulama yok; Eğitim Evi'ni Safari'den ana ekrana eklersin
  ([Tarayıcıdan uygulama olarak yükleme](tarayicidan-yukleme.md)).
- **Uygulamada ödevlerimi neden göremiyorum?** Rol ekranları bu sürümde hazırlanıyor. Ayarlar → **"Siteyi aç"** ile sitede yaparsın.
- **Bildirimler geç geliyor.** Uygulama sunucuya 15 dakikada bir sorar; servis saatlerinde dakikada bir. Ayarlar'da "Telefon
  bildirimleri" "Kapalı" ise dokunup izin ver.
- **Yeni telefon aldım.** Uygulamayı yeni telefona kur, yeniden giriş yap. Eski telefondaki bilgiler taşınmaz; çocuğun telefonuysa
  yeniden bağlanır.
- **Telefonumu başkasına verdim.** Ayarlar → **"Çıkış yap"**: telefonun anahtarı ve oturumun silinir, bildirimlerin ona gelmez.

## Sırada

- Android yerel uygulama işi (bütün roller, doğrulayıcı, apk ve Play paketi, sürüm): rol ekranları, ortak ekranlar, servisçinin
  seferi başlatan düğmesi, bildirime dokununca doğru ekran, kendini güncelleme, açılış ekranı ve sol menü (yorumu soruldu).
- Android geri tuşu işi.
- T.C. kimlik no bütün hesaplarda zorunlu işi: hesap açma ve ayarlarda aynı kural.
- Çok dil işi: uygulamada dil seçici.
- Ekran turu işi: uygulamanın ekran görüntüleri baştan.
