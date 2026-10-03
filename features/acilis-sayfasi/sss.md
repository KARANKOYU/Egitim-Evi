# Açılış sayfası ve girişsiz sayfalar · Sık sorulan sorular

**Durum:** Kodda var; tasarımda ek olarak ayrı sayfa düzeninde arama kutusu, soru sayısı ve bölüm gezgini, güncellenen 10 cevap ve 8 yeni soru (yeni "Eğitim içerikleri" bölümü dahil)

Girişsiz `/sss/sss.html` sayfası: altı bölümde 46 soru ve cevabı; her soru tıklayınca açılır.

## Ne işe yarar

Ziyaretçi ve kullanıcı en çok merak edilenlerin cevabını okul yönetimine sormadan bulur: başlarken, hesap ve giriş, okul hayatı,
gizlilik, telefon ve uygulama, sorun ve iletişim. Kullanıcının istekleri: 26 Eylül "SSS'yi güncelle ve genişlet, yanlış bilgi olmasın,
müdürlük vb."; 1 Ekim "sık sorulanlarda ayrı sayfa" (Tasarım 1'de arama ve bölümlerle ayrı sayfa oldu). Cevaplar kısa tutulur;
ayrıntısı bu klasördeki ve öbür klasörlerdeki belgelerdedir (aşağıdaki listede her sorunun yanında).

## Nereden açılır

- **Adres:** `egitimevi.org/sss/sss.html`. `/sss`, `/sss/`, `/faq`, `/faq/` (büyük/küçük harf fark etmez) kalıcı yönlendirmeyle (301)
  bu adrese gider ([Kısa adresler](adresler.md)). Sekme başlığı **"Sık sorulan sorular — Eğitim Evi"**.
- Üst şeritte **"SSS"**, alt bilgide **"SSS"** (girişsiz bütün sayfalarda; [Açılışın üst şeridi ve alt bilgisi](ust-serit-ve-alt-bilgi.md)).
- Açılışta "Okulun nasıl başlar?"ın altında: "Aklına takılan bir şey mi var? **Sık sorulan sorular**" ([Açılış sayfası](acilis.md)).
- **Tasarımda:** giriş yapmış kişi "Ana siteye dön" ile açılışa gelip "SSS"ye basar ([Ana siteye dön](../menu-ve-arama/ana-siteye-don.md)).

## Adım adım

### Sayfanın düzeni (bugünkü site)

1. Küçük hap etiket **"SSS"**, başlık **"Sık sorulan sorular"**, altında: "Cevabı burada bulamazsan okulunun yönetimine sor. Teknik bir
   hata bulduysan **GitHub'da bildir**." (bağlantı projenin GitHub'daki hata bildirimi sayfasını yeni sekmede açar).
2. Altı bölüm, her birinin başlığı ve altında soru satırları. Her satır kapalıdır; sağında yuvarlak içinde **"+"** durur. Satıra basınca
   cevap açılır, işaret **"−"** olur; yeniden basınca kapanır. Aynı anda istediğin kadar soru açık kalabilir. Satırlar klavyeyle de
   (Tab, Enter/Boşluk) açılır.
3. Cevapların içinde bağlantılar vardır: "Kayıt ol", "Giriş", "aydınlatma metni", "kullanım koşulları", "egitimevi.org/indir",
   "GitHub'da bildir". Kayıt ve giriş bağlantıları sayfayı yenilemeden kartı açar; öbürleri kendi sayfalarını açar.
4. Bugünkü sitede SSS içinde arama yoktur; tarayıcının sayfada bul özelliği (Ctrl+F) kullanılır.

### Soruların listesi

Bugünkü sitedeki 46 soru, sırasıyla; her birinin yanında ayrıntılı anlatımın bulunduğu belge.

**Başlarken** (7)

1. "Eğitim Evi nedir?" — [Açılış sayfası](acilis.md)
2. "Eğitim Evi ücretli mi?" — ücretsiz, reklamsız ([Hakkında ve Yapımcılar](hakkinda-ve-yapimcilar.md))
3. "Okulum Eğitim Evi'ni nasıl kullanmaya başlar?" — [+ Ekle penceresi](../portallar/ekle-penceresi.md),
   [Okul açma](../yonetim/okul-acma.md), [İletişim bilgileri](iletisim-bilgileri.md)
4. "Kişi kodu nedir?" — [Kişi kodu](../portallar/kisi-kodu.md)
5. "Öğretmen okula nasıl katılır?" — [Kodla ekleme](../ogretmenler-calisanlar/kodla-ekleme.md)
6. "Veli çocuğunu nasıl ekler?" — [Çocuklarım](../portallar/cocuklarim.md), [Veli kodu](../hesaplar/veli-kodu.md)
7. "Öğrenci ve servisçi hesabını kim açar?" — [Öğrenci hesabı açma](../hesaplar/ogrenci-hesabi-acma.md)

**Hesap ve giriş** (11)

8. "Nereden giriş yaparım?" — [Giriş](../giris-hesap/giris.md), [Okulun sayfasından giriş](../giris-hesap/okulun-sayfasindan-giris.md)
9. "Okulumun adresi açılmıyor ("Okul bulunamadı")." — [Bulunamadı sayfaları](bulunamadi-sayfalari.md)
10. "Aynı hesapla hem veli hem öğretmen olabilir miyim?" — [Portallarım](../portallar/portallarim.md)
11. "Girişte e-postama gelen kod ne?" — [İki adımlı giriş](../giris-hesap/iki-adimli-giris.md)
12. "Kayıttan sonra e-postama gelen bağlantı ne?" — [E-posta onayı](../giris-hesap/eposta-onayi.md)
13. "Şifre kuralları neler?" — [Şifre kuralları](../giris-hesap/sifre-kurallari.md)
14. "İlk girişte neden şifremi değiştirmem isteniyor?" — [İlk girişte kendi şifreni belirleme](../giris-hesap/zorunlu-sifre-belirleme.md)
15. "Şifremi unuttum, ne yapmalıyım?" — [Şifremi unuttum](../giris-hesap/sifremi-unuttum.md)
16. ""Beni hatırla" ile "Bilgilerimi bu cihaza kaydetme" farkı ne?" — [Beni hatırla](../giris-hesap/beni-hatirla.md)
17. "Aydınlatma metnini neden yeniden onaylamam isteniyor?" — [Onay ve yeniden onay](../kvkk-ve-gizlilik/onay-ve-yeniden-onay.md)
18. "Hesabımı kapatmak istiyorum." — [Hesabımı sil](../ayarlar/hesabimi-sil.md)

**Okul hayatı** (17)

19. "Eğitim Evi e-Okul'un yerine geçer mi?" — hayır; not ve devamsızlığın resmî kaydı e-Okul'dadır
20. "Ödevimi nasıl teslim ederim?" — [Teslim](../odev/teslim.md), [Dosya yükleme izni](../odev/dosya-yukleme-izni.md)
21. "Quiz nasıl çözülür, kaç hakkım var?" — [Quiz çözme](../quiz/quiz-cozme.md), [Süre ve tek deneme](../quiz/sure-ve-tek-deneme.md)
22. "Öğretmen quiz nasıl hazırlar?" — [Quiz ekleme](../quiz/quiz-ekleme.md), [Metinden ekle](../quiz/metinden-ekle.md)
23. "Ödev serisi nedir?" — [Ödev serisi](../odev/seri.md)
24. "Veliye hangi bildirimler gider?" — [Öğrencinin bildirimi veliye de](../bildirim/velinin-bildirimleri.md)
25. "Kime mesaj yazabilirim?" — [Bana kim yazabilir](../mesaj/bana-kim-yazabilir.md)
26. "Hatırlatıcı nasıl kurulur?" — [Hatırlatıcı kurma](../hatirlatici/hatirlatici-kurma.md), [Sıklık](../hatirlatici/siklik.md)
27. "Anketlerde oyumu kim görür?" — [Gizli anket](../anket/gizli-anket.md), [Sonuçlar](../anket/sonuclar.md)
28. "Servisi nasıl takip ederim?" — [Servisim](../servis/servisim.md), [Binmeyecek](../servis/binmeyecek.md)
29. "Servisçi yoklamayı nasıl alır?" — [Sabah seferi](../servis/sabah-seferi.md), [Akşam seferi](../servis/aksam-seferi.md)
30. "Öğrenci okul değiştirirse ne olur?" — [Öğrenci nakli](../hesaplar/ogrenci-nakli.md)
31. "Geçmiş eğitim yıllarına bakılabilir mi?" — [Geçmiş yıl](../egitim-yili/gecmis-yil.md)
32. "Müdür yardımcısı ya da rehber öğretmen gibi görevler nasıl verilir?" — [Hazır şablonlar](../roller-yetkiler/hazir-sablonlar.md)
33. "Öğrencileri tek tek mi eklemek gerekiyor?" — [İçe aktarım](../excel-aktarim/ice-aktarim.md)
34. "Okulumuz bazı bölümleri kullanmıyor, kapatılabilir mi?" — [Bölüm aç/kapat](../ozellikler/bolum-ac-kapat.md)
35. "Yüklenen dosyalar ne kadar saklanır?" — [Teslim dosyalarının saklanması](../odev/saklama-ve-silinme.md)

**Gizlilik** (4)

36. "Bilgilerim nerede duruyor, kim görüyor?" — [Kim neyi görür](../kvkk-ve-gizlilik/kim-neyi-gorur.md)
37. "Okul yönetimi yapılan işlemleri görür mü?" — [İşlem kaydı](../islem-kaydi/README.md)
38. "Servisin konumunu kim görür?" — [Canlı konum ve harita](../servis/canli-konum-ve-harita.md)
39. "Çocuğumun telefonunun konumunu ve ekran süresini görebilir miyim?" — [Eğitim Evi Aile](../aile/README.md)

**Telefon ve uygulama** (5)

40. "Android uygulamasını nereden indiririm?" — [İndir sayfası](../uygulama/indir-sayfasi.md)
41. "iPhone'da kullanabilir miyim?" — [Tarayıcıdan yükleme](../uygulama/tarayicidan-yukleme.md)
42. "Telefona uygulama olarak kurulur mu?" — [Tarayıcıdan yükleme](../uygulama/tarayicidan-yukleme.md)
43. "Telefon bildirimleri gelmiyor." — [Telefon bildirimi](../bildirim/telefon-bildirimi.md)
44. "Koyu görünüm var mı?" — [Görünüm ve dil](../ayarlar/gorunum-ve-dil.md)

**Sorun ve iletişim** (2)

45. "Bir hata buldum." — okulla ilgili sorun okul yönetimine; sitenin hatası GitHub'a ya da alt bilgideki iletişimden
46. "Eğitim Evi yöneticisine nasıl ulaşırım?" — [İletişim bilgileri](iletisim-bilgileri.md)

### Ziyaretçi

1. Üst şeritte **"SSS"**'ye bas. Sayfa yeniden yüklenmeden açılır, sayfa başına kaydırılır, "SSS" bağlantısı ana renkte görünür.
2. Sorunu bul, satıra bas: cevap açılır. Başka bir soruyu da açabilirsin; öncekiler açık kalır.
3. Cevaptaki bağlantıyla ilgili sayfaya geç (kayıt, giriş, aydınlatma metni, kullanım koşulları, indirme).
4. Cevap yoksa okulunun yönetimine sor; sitenin bir hatasını bulduysan başlığın altındaki "GitHub'da bildir" ile bildir ya da alt
   bilgideki iletişim bilgilerinden yaz.

### Giriş yapmış herkes

- **Bugünkü site:** SSS girişsizdir; giriş yapmışken `/sss/sss.html` adresini açarsan portalın açılır (adres `/`'a ya da okulunun
  adresine döner). SSS'yi okumak için çıkış yapman gerekir.
- **Tasarımda:** "Ana siteye dön" ile açılışa gelir, "SSS"ye basarsın; sağ üstte "Hesaba gir" ile portalına dönersin. Tasarımdaki
  boş arama sonucu da "hesabındaki Destek sayfasından sor" der (bağlantı değil, yazı; [Destek sayfası](../destek/destek-sayfasi.md)).

### Tasarımda (Tasarım 1 önizlemesi)

**Sayfa düzeni** (kullanıcı 1 Ekim: "sık sorulanlarda ayrı sayfa"; asıl adres yine `/sss/sss.html`):

1. Üstte başlık **"Sık sorulan sorular"** ve altında: "Okulun, hesabın ve uygulamayla ilgili en çok sorulanlar. Cevabı burada
   bulamazsan okulunun yönetimine sor; sitenin kendisinde bir hata bulduysan **GitHub'da bildir**."
2. **Arama kutusu** — büyüteç simgeli, yer tutucu **"Soru ara: şifre, servis, veli kodu…"**. Altında soru sayısı: **"54 soru"**; arama
   yazılıyken **"N soru bulundu"**.
3. **Bölümler gezgini** — masaüstünde solda, sayfa kayarken üst şeridin altında yerinde duran dikey bir liste: her bölümün adı ve
   yanında soru sayısı. Bir bölüme basınca sayfa o bölüme yumuşakça kayar (üst şerit başlığı örtmez; işletim sisteminde "hareketi azalt"
   açıksa kayma anında olur). Arama sırasında sorusu kalmayan bölüm sönük ve basılamaz. 760 px ve altında gezgin sayfanın üstünde
   yatay kayan, çerçeveli düğmeler olur.
4. **Sorular** — her soru ayrı, köşeleri yuvarlak bir kartta; sağda aşağı ok, açılınca ok döner.
5. **Arama nasıl çalışır:** yazdıkça hem soruların hem cevapların içinde aranır; büyük/küçük harf ve Türkçe harf farkı gözetilmez (ı/i,
   ş/s, ğ/g, ü/u, ö/o, ç/c aynı sayılır); yazdığın metin olduğu gibi (tek parça) aranır. Bulunan sorular açık gelir, öbürleri gizlenir.
6. **Sonuç yoksa:** "“<yazdığın>” için soru bulunamadı." ve altında "Başka bir kelimeyle ara ya da hesabındaki Destek sayfasından sor."

**İçerik** (bugünkü 46 sorudan; toplam 54):

- **Güncellenen 10 cevap:**
  - "Eğitim Evi nedir?" — bölüm listesi güncellendi.
  - "Okulum Eğitim Evi'ni nasıl kullanmaya başlar?" — "+ Ekle → Müdür"de yöneticinin iletişim bilgisi görünür; müdür sınıfları,
    öğrencileri ve **çalışanları** ekler.
  - "Kişi kodu nedir?" — kod **"+ Ekle → Çalışan"** ya da "+ Ekle → Müdür" ekranında görünür; okula çalışan olarak eklenmek için müdüre
    verilir.
  - "Öğretmen okula nasıl katılır?" sorusu **"Öğretmen ya da başka bir çalışan okula nasıl katılır?"** olur: müdür "Çalışanlar → Kodla
    ekle"de kodu girer; kişi önce rolsüz çalışan olarak katılır, portalında "Okul yönetimi sana henüz bir görev vermedi." yazar; görevi
    (Öğretmen ya da özel rol) müdür verir ([Rolsüz çalışan](../ogretmenler-calisanlar/rolsuz-calisan.md)).
  - "Hesabımı kapatmak istiyorum." — okulun son müdürü ayrılamaz; önce bir çalışanı "Çalışanlar"da **"Müdür yap"** ile müdür yapar
    ([Müdür yapma](../ogretmenler-calisanlar/mudur-yapma.md)).
  - "Müdür yardımcısı ya da rehber öğretmen gibi görevler nasıl verilir?" — rol "Roller ve yetkiler"de okulun bir çalışanına verilir;
    hazır şablonlar Müdür Yardımcısı, Rehber Öğretmen, Etüt Sorumlusu, Nöbetçi Öğretmen, Servis Sorumlusu, Zümre Başkanı, Kodlayıcı;
    müdür bir çalışanı "Müdür yap" ile müdür de yapabilir, okulun birden çok müdürü olabilir.
  - "Okulumuz bazı bölümleri kullanmıyor, kapatılabilir mi?" — kapatılabilen bölümler: ödev, sınav, devamsızlık, etüt, servis, yemek,
    anket.
  - "Android uygulamasını nereden indiririm?" — Google Play'den ya da `.apk` dosyasıyla doğrudan siteden.
  - "iPhone'da kullanabilir miyim?" — iPhone ve iPad'de App Store'dan değil Safari'den yüklenir (Paylaş → Ana Ekrana Ekle); İndir
    sayfasında iOS sütunundaki mavi **"Yükle"** düğmesi adımları gösterir.
  - "Telefona uygulama olarak kurulur mu?" — İndir sayfasından: bilgisayarda ve iPhone'da tarayıcıdan (kurulum dosyası yok), Android'de
    Google Play ya da `.apk` (3 Ekim kararı: bilgisayar için `.exe` yok).
- **Yeni 8 soru:**
  - "Hesap ve giriş" bölümünde, "Okulumun adresi açılmıyor"un ardından: **"Okulumun kendi sayfası var mı?"** — her okulun
    `egitimevi.org/school/okulun-adi` sayfası; oradan girince portal seçmeden doğrudan o okuldaki portala geçilir, öbür portallara
    "Portallarıma dön" ile dönülür ([Sayfa adresi](../okul-sayfasi/sayfa-adresi.md)).
  - "Girişte e-postama gelen kod ne?"nin ardından: **"Kullanıcı adıyla mı, e-postayla mı girerim?"** (kutunun üstünden "Kullanıcı adı" ya
    da "E-posta" seçilir; hesap yoksa "Böyle bir kullanıcı yok", şifre yanlışsa "Şifre yanlış") ve **"Girişte ve kayıtta neden bir toplama
    sorusu var?"** (robot değilim doğrulaması her girişte, kayıtta ve şifre yenilemede; yanlışsa yeni soru gelir, "Yenile" ile
    değiştirilir — [Robot doğrulaması](../giris-hesap/robot-dogrulamasi.md)).
  - "Kayıttan sonra e-postama gelen bağlantı ne?"nin ardından: **"Kayıt olurken neden öğretmen, müdür, sınıf ya da branş seçmiyorum?"**
    (herkes aynı rolsüz hesabı açar; roller "+ Ekle" ile gelir) ve **"Kayıtta hangi bilgiler isteniyor?"** (ad, soyad, kullanıcı adı,
    e-posta, ülke koduyla telefon, il ve ilçe, isteğe bağlı açık adres, zorunlu T.C. kimlik numarası, iki kez şifre; aydınlatma metni ve
    kullanım koşulları onayı — [Kayıt olma](../giris-hesap/kayit-olma.md)).
  - "Okul hayatı"ndan sonra yeni bölüm **"Eğitim içerikleri"**: **"Videoları kim izleyebilir?"** (herkes, giriş yapmadan da; beğenmek,
    kaydetmek, indirmek, bildirmek için giriş — [Girişsiz izleme](../egitim-icerikleri/girissiz-izleme.md)) ve **"Videoları kim
    yükler?"** (eğitmen rolü verilen kişiler; ön onay yok; uygunsuz videoda "Bildir" — [Eğitmen rolü](../egitim-icerikleri/egitmen-rolu.md),
    [Bildir](../egitim-icerikleri/bildir.md)).
  - "Sorun ve iletişim" bölümünün sonuna: **"Açılış sayfasındaki yorumları kim yazar?"** — yalnız veli, öğretmen ve müdür; "Ayarlar →
    Gizlilik ve verilerim → Eğitim Evi hakkında yorumun"dan; 0–5 yıldız, en çok 500 karakter; ad kısaltılır (ör. Deniz Kara → "De. Ka.");
    küfür, hakaret ve internet adresi kabul edilmez ([Yorum yazma](../yorumlar/yorum-yazma.md)).
- Bölüm sayıları: Başlarken 7, Hesap ve giriş 16, Okul hayatı 17, Eğitim içerikleri 2, Gizlilik 4, Telefon ve uygulama 5, Sorun ve
  iletişim 3.

## Kurallar ve sınırlar

- **Tek sayfalık uygulamanın parçası:** `/sss/sss.html` diskte ayrı bir dosya değildir; sunucu bu adreste uygulamanın kabuğunu verir,
  sayfa onu SSS olarak açar. Açılış ve Hakkında'dan geçişte sayfa yeniden yüklenmez.
- **Eski adresler:** `/sss` ve `/faq` (sonda `/` olsa da, büyük harfle yazılsa da) 301 ile asıl adrese gider; tarayıcı bu yönlendirmeyi
  bir gün saklar. Adresin `?` sonrası korunur.
- **Metinler koddadır** (`public/index.html`); yönetici panelden değiştiremez. Bir özellik değişince ilgili cevap aynı işte
  güncellenmelidir (kullanıcı: "yanlış bilgi olmasın").
- **Kişisel veri yok:** SSS kimseye ait bilgi göstermez; servis örneğindeki ad ve saatler örnektir.
- **Arama motorları:** SSS herkese açık sayfadır; "Arama motorunda görünme" işinde başlığı ve açıklaması ayarlanacak.
- **Tasarımdaki arama** tamamen tarayıcıda çalışır; sunucuya istek gitmez, aranan metin bir yere kaydedilmez.

## Kardeşler ve ilgili

**Kardeşler** (aynı klasör, [Açılış sayfası ve girişsiz sayfalar](README.md)):

- [Açılış sayfası](acilis.md) — "Sık sorulan sorular" bağlantısı.
- [Açılışın üst şeridi ve alt bilgisi](ust-serit-ve-alt-bilgi.md) — "SSS" bağlantıları.
- [Hakkında ve Yapımcılar](hakkinda-ve-yapimcilar.md), [İletişim bilgileri](iletisim-bilgileri.md),
  [Bulunamadı sayfaları](bulunamadi-sayfalari.md), [Kısa adresler](adresler.md), [Rakamlar](rakamlar.md).

**İlgili:** her sorunun yanındaki belgeler (yukarıdaki liste); ayrıca [Destek talepleri](../destek/README.md) (tasarımda "cevabı
bulamazsan"), [Menü, üst şerit ve arama](../menu-ve-arama/README.md) ([Sayfa başında Yardım](../menu-ve-arama/yardim-dugmesi.md):
tasarımda her sayfanın kendi yardım bağlantısı), [Dil ve çeviri](../dil/README.md).

## Kod tarafı

- İşaretleme: `public/index.html` (`#vSss`, `.sss-grup`, `details`/`summary`) — [public/KLASOR.md](../../public/KLASOR.md).
- Ön yüz: [public/js/parcalar/05a-dis-sayfalar.md](../../public/js/parcalar/05a-dis-sayfalar.md) (`SITE_SAYFALARI` `'sss/sss.html'`,
  `'sss'`, `'faq'` → `sss`; `siteMenusuIsaretle`; sekme başlığı).
- Biçim: `29-dis-sayfalar.css` (`.sss details`, `.sss summary::after` "+"/"−") — [public/css/parcalar/CSS.md](../../public/css/parcalar/CSS.md).
- Sunucu: [sunucu/http.md](../../sunucu/http.md) (`UYGULAMA_YOLLARI` içinde `sss/sss.html`; `YONLENDIRMELER`: `sss`, `faq` → 301).
- Testler: [testler/test-adresler.md](../../testler/test-adresler.md) (`/sss`, `/faq` 301; `/sss/sss.html` 200 ve içinde SSS; `app.js`'te
  asıl adres; SSS'den giriş kartına geçince sekme başlığı).
- Kullanıcıya dönük anlatım: [belge/KILAVUZ.md](../../belge/KILAVUZ.md) ("Sayfa adresleri ve kısa adlar").

## Sık sorulanlar

- **SSS'de aradığımı bulamıyorum.** Bugün sayfada arama yok; tarayıcının "sayfada bul" (Ctrl+F) özelliğini kullan. Tasarımda sayfanın
  üstünde arama kutusu var.
- **Cevap bana uymuyor ya da yanlış.** Okulla ilgiliyse okul yönetimine sor; sitenin bilgisi yanlışsa "GitHub'da bildir" ya da alt
  bilgideki iletişimden yaz.
- **`/faq` yazdım, adres değişti.** Doğru: kısa ve İngilizce adlar asıl adrese (`/sss/sss.html`) yönlenir.

## Sırada

- Kullanıcının kaldırdığı bölümün koddan çıkarılması (DEVAM iş 30): bugünkü üç cevapta ("Eğitim Evi nedir?", "Müdür yardımcısı ya da
  rehber öğretmen…", "Okulumuz bazı bölümleri kullanmıyor…") o bölümün adı hâlâ geçiyor; Tasarım 1'deki cevaplarda yok.
- "Çalışan olarak ekleme" (iş 2) ve "Tek kişi tek hesap + portallar öğrencide de" (iş 19): "+ Ekle → Çalışan", rolsüz çalışan,
  "Müdür yap", okulun sayfasından doğrudan portal cevapları.
- "T.C. kimlik no bütün hesaplarda zorunlu" (iş 32): "Kayıtta hangi bilgiler isteniyor?".
- Uygulama kararları (3 Ekim: `.exe` yok; bilgisayar ve iPhone tarayıcıdan, Android `.apk` + Google Play): "Telefon ve uygulama" cevapları.
- "Eğitim içerikleri" (iş 17): yeni bölüm.
- Kullanıcının 3 Ekim "Tüm hakları saklıdır" kararı: "Eğitim Evi ücretli mi?" cevabındaki "kaynak kodu herkese açıktır" cümlesi "yalnız
  incelenebilsin diye herkese açık" anlamına çekilmeli ([Hakkında ve Yapımcılar](hakkinda-ve-yapimcilar.md#sırada)).
- Tasarımdaki arama, soru sayısı ve bölüm gezgini; "Arama motorunda görünme" (iş 23); "Çok dil" (iş 22).
