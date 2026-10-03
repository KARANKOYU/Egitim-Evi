# Giriş ve hesap · Giriş

**Durum:** Kodda var; tasarımda ek olarak her girişte robot sorusu, kartın üstünde "Bu cihazdaki oturumların" listesi, okulun sayfasından girince portal seçmeden o okulun portalına geçiş, yönetici ve destekte otomatik panele atılma yerine "Hesaba gir", doğrulama uygulamasıyla giriş ve tahta hesabının girişi.

Kullanıcı adın ya da e-posta adresin ve şifrenle Eğitim Evi'ne girdiğin kart: öğrenci, veli, öğretmen, çalışan, müdür, servisçi ve sistem yöneticisi (tasarımda destek, eğitmen ve tahta da) aynı karttan girer.

## Ne işe yarar

Eğitim Evi'nde herkesin girdiği tek bir kapı var. Kartın üstünde "Kullanıcı adı | E-posta" seçimi durur; hangisini seçersen
kutu ona göre değişir. Şifreni yazıp **"Giriş Yap"**a basarsın. Öğrenci ve e-postası olmayan hesap hemen içeri alınır; öbür
herkesin e-postasına 6 haneli bir kod gider ([İki adımlı giriş](iki-adimli-giris.md)). Şifre yanlışsa ya da böyle bir hesap
yoksa hangi kutu hatalıysa onun altında kırmızı yazı çıkar.

Kullanıcının istekleri: 29 Ağustos'ta "giriş yap'ta kullanıcı adı/gmail adresi yazacak", 26 Eylül'de "kullanıcı adı ve e-posta
ayrı olacak, ona tıklayınca onunla şey yapacak", 25 Eylül'de "şifreyi yazarken görmek için göz işareti lazım; giriş yap'a
basınca eğer şifre yanlışsa kırmızı 'şifre yanlış', 'böyle kullanıcı yok' falan yazsın". Üçü de bugün kodda var.

## Nereden açılır

- Açılış sayfasının üst şeridinde **"Giriş"** düğmesi → `egitimevi.org/login` (eş adı `/giris`).
- Kayıt kartının üstündeki **"Giriş Yap"** sekmesi (kayıt ile giriş arasında kart kayarak geçer).
- Okulun kendi adresi `egitimevi.org/school/<okulun-adı>`: aynı kart, giriş o okulun içinde aranır
  ([Okulun sayfasından giriş](okulun-sayfasindan-giris.md)).
- E-postadaki onay bağlantısından sonra kart, kullanıcı adın yazılmış olarak açılır ([E-posta onayı](eposta-onayi.md)).
- Çıkış yapınca kart kendiliğinden gelir ([Çıkış yap](cikis-yap.md)).
- Sistem yöneticisinin gizli yönetim adresi, tarayıcıda geçerli yönetim çerezi varken bu sekmede oturum yoksa (anahtar başka
  sekmede ya da yalnız bellekte kaldıysa) açılış sayfası yerine doğrudan aynı kartı açar; çerezsiz istek o adreste "Sayfa
  bulunamadı" alır ([Gizli yönetim girişi](../yonetim/gizli-yonetim-girisi.md)).
- Android uygulamasında giriş ekranı ([Android uygulaması](../uygulama/android-uygulamasi.md)).

Tasarımda (Tasarım 1 önizlemesi): üst şeritteki düğmeler aynı ("Giriş", "Kayıt ol"); kartın sekmeleri **"Giriş yap"** ve
**"Kayıt ol"** diye küçük harfle yazılır.

## Adım adım

### Ekranın düzeni (bugünkü site)

Yukarıdan aşağı:

1. İki sekme: **"Giriş Yap"** | **"Hesap Aç"**. Seçili sekmenin altındaki işaret kayar.
2. Kayan seçim: **"Kullanıcı adı"** | **"E-posta"**. Son seçimin bu tarayıcıda hatırlanır; bir dahaki sefer o açılır.
3. Kimlik kutusu. Etiketi ve yer tutucusu seçime göre: "Kullanıcı adı" / "kullanıcı adın" ya da "E-posta" / "e-posta adresin".
   Okulun sayfasındaysan ve "Kullanıcı adı" seçiliyse altında ipucu: "Okulun verdiği kullanıcı adı; çoğu zaman T.C. kimlik
   numaran."
4. **"Şifre"** kutusu (yer tutucu "••••••"). Sağında göz düğmesi ("Şifreyi göster" / "Şifreyi gizle"); Caps Lock açıksa altında
   "Büyük harf kilidi (Caps Lock) açık." ([Şifre kuralları](sifre-kurallari.md)).
5. **"Robot değilim doğrulaması"** alanı: başta gizli; sunucu isteyince açılır ([Robot doğrulaması](robot-dogrulamasi.md)).
6. İki kutu: **"Beni hatırla"** (başta işaretli) ve **"Bilgilerimi bu cihaza kaydetme"**; ikisi birden seçilemez
   ([Beni hatırla](beni-hatirla.md)).
7. Gizlilik notu: "Bilgilerin Eğitim Evi'nin sunucusunda tutulur ve yalnız okulunun yetkilileri görür. Giriş bilgilerin
   Google'a ya da başka bir servise gönderilmez."
8. Geniş **"Giriş Yap"** düğmesi.
9. Altında **"Şifremi unuttum"** ([Şifremi unuttum](sifremi-unuttum.md)); okulun sayfasındaysan yanında **"Başka bir okul seç"**.
10. `/login` sayfasında kartın altında okul araması: "Öğrenci ya da servisçiysen önce okulunu seç"
    ([Okulun sayfasından giriş](okulun-sayfasindan-giris.md)).

### Herkes: giriş yapmak

1. "Kullanıcı adı" ya da "E-posta"yı seç. Kullanıcı adı kutusuna `@` yazarsan kart kendiliğinden "E-posta"ya geçer, yazdığın
   kaybolmaz.
2. Kullanıcı adını ya da e-postanı yaz. Büyük/küçük harf fark etmez.
3. Şifreni yaz. Görmek istersen göz düğmesine bas.
4. Robot sorusu açıksa toplamanın cevabını yaz.
5. **"Giriş Yap"**a bas. Düğme beklerken "Giriş yapılıyor..." yazar.
6. Sonra hesabına göre:
   - Öğrenciysen ya da hesabında e-posta yoksa oturum hemen açılır.
   - Öbür hesaplarda kod ekranı gelir: e-postana gelen 6 haneli kodu yazarsın ([İki adımlı giriş](iki-adimli-giris.md)).
7. Oturum açılınca sırayla: aydınlatma metnini henüz onaylamadıysan onay penceresi
   ([Onay ve yeniden onay](../kvkk-ve-gizlilik/onay-ve-yeniden-onay.md)); şifreni okul ya da yönetici verdiyse "Kendi şifreni
   belirle" penceresi ([İlk girişte kendi şifreni belirleme](zorunlu-sifre-belirleme.md)); en sonda portalın açılır.

Kutu boşsa ya da hatalıysa istek gitmeden kutunun altında yazar: "Kullanıcı adını yaz." (ya da "E-posta adresini yaz."),
"E-posta adresi eksik ya da hatalı görünüyor.", "Şifreni yaz.", robot sorusu açıksa "Sorunun cevabını yaz.".

Sunucunun iletileri (hepsi ilgili kutunun altında kırmızı, uyarı simgesiyle):

| Durum | İleti | Yanındaki kısa yol |
|---|---|---|
| E-postayla böyle hesap yok | "Bu e-posta adresiyle kayıtlı bir hesap yok." | **"Kayıt ol"** (okulun sayfasında çıkmaz) |
| Kullanıcı adıyla böyle hesap yok | "Bu kullanıcı adıyla kayıtlı bir hesap yok." | **"Kayıt ol"** (okulun sayfasında çıkmaz) |
| Okulun sayfasında bu adla hesap yok | "Bu okulda bu kullanıcı adıyla bir hesap yok." | — |
| Şifre yanlış | "Şifre yanlış." (son üç hakta "3 deneme hakkın kaldı." gibi eklenir; beşincide "Giriş 15 dakika kilitlendi.") | **"Şifremi unuttum"** |
| Ad birden çok okulda var | "Bu kullanıcı adı birden çok okulda var. Önce okulunu seç, sonra giriş yap." | **"Okulunu bul"** |

"Kayıt ol" kısa yoluna basınca kayıt sekmesine geçilir; yazdığın şey `@` içeriyorsa e-posta kutusuna, içermiyorsa küçük harfle
kullanıcı adı kutusuna taşınır, imleç "Ad" kutusuna gider. "Okulunu bul" `/login` sayfasına dönüp okul arama kutusuna götürür.
Şifre yanlışsa şifre kutusu seçili hâle gelir, yeniden yazarsın.

Kartın üstünde (kutuya bağlı olmayan) çıkan iletiler: kilit (ör. "Çok fazla hatalı deneme yapıldı. 14 dakika sonra tekrar dene
ya da "Şifremi unuttum" ile yeni şifre al."), bağlantı engeli ("Bu bağlantıdan çok fazla giriş denemesi yapıldı. Biraz bekleyip tekrar
dene.") ve kapatılmış hesap ("Bu hesap kapatılmış. Sistem yöneticisiyle iletişime geç."). Ayrıntı:
[Hatalı giriş ve kilit](hatali-giris-ve-kilit.md).

Tasarımda (Tasarım 1 önizlemesi):

- Kartın en üstünde **"Bu cihazdaki oturumların"** listesi ("Birine dokun ve gir"), altında "ya da hesabınla gir" ayracı.
  Gerçek sitede olup olmayacağı ve nasıl güvenceye alınacağı kullanıcıya sorulacak ([Beni hatırla](beni-hatirla.md)).
- Robot sorusu her girişte görünür ve zorunludur (kullanıcının 29 Ağustos isteği: "her kayıt ve girişte ... bot doğrulaması
  önemli"); her hatalı denemeden sonra yeni soru gelir.
- Düğmenin adı **"Giriş yap"**.
- Hata iletileri: kullanıcı adıyla "Böyle bir kullanıcı yok.", e-postayla "Bu e-postayla kayıtlı bir hesap yok.", "Şifre yanlış.";
  e-posta biçimi bozuksa "Geçerli bir e-posta adresi yaz (ör. ad@eposta.com).". Kullanıcının 25 Eylül sözü ("kırmızı şifre
  yanlış, böyle kullanıcı yok falan yazsın") ikisine de uyar; bugünkü uzun cümleler kalabilir, önizlemedeki kısa cümleler de.
- Okulun sayfasında kullanıcı adı ipucu kısalır: "Okulun verdiği kullanıcı adı."; "E-posta" seçilince ipucu "Okulun açtığı öğrenci
  ve servisçi hesabında e-posta yoktur; kullanıcı adıyla gir."
- Giriş bitince kısa bildirim: "<Ad Soyad> olarak giriş yapıldı."
- Önizlemedeki "Önizleme: örnek hesapların şifresi …" satırı yalnız önizlemeye aittir, gerçek sitede olmaz.

### Öğrenci

1. En kolayı okulunun sayfasından girmek: `/login`'de okulunu ara, seç; okulun sayfası açılır
   ([Okulun sayfasından giriş](okulun-sayfasindan-giris.md)).
2. "Kullanıcı adı" seçili kalsın. Okulun verdiği kullanıcı adını yaz; çoğu zaman bu senin T.C. kimlik numarandır. Okulun
   sayfasında T.C. numaranla da girersin (kullanıcı adın başka olsa bile).
3. Şifreni yaz, **"Giriş Yap"**. Kod sorulmaz: öğrencide iki adımlı giriş yoktur (e-postan olsa bile).
4. İlk kez giriyorsan önce aydınlatma metnini onaylarsın, sonra okulun verdiği şifre yerine kendi şifreni belirlersin
   ([İlk girişte kendi şifreni belirleme](zorunlu-sifre-belirleme.md)).
5. Genel `/login`'den de girebilirsin: kullanıcı adın yalnız bir okulda varsa olur; birden çok okulda varsa "Önce okulunu seç"
   iletisi gelir.

Tasarımda: öğrenci de Ayarlar'dan iki adımlı girişi isteğe bağlı açabilir; açtıysa girişte kod sorulur
([İki adımlı giriş](iki-adimli-giris.md)). Kullanıcı adı site genelinde tek olunca okul seçme zorunluluğu kalkar
([Kullanıcı adı](kullanici-adi.md)).

### Servisçi

Öğrenci gibi: hesabını okul açar, okulunun sayfasından kullanıcı adı (ya da T.C.) ve şifreyle girer, ilk girişte kendi şifreni
belirlersin. Bir fark var: okul hesabına e-posta yazdıysa iki adımlı giriş sana da uygulanır (kod yalnız öğrencide hiç
sorulmaz). Giriş bitince yalnız kendi sayfaların açılır ([Servisçi hesabı](../servis/servisci-hesabi.md)).

### Veli, öğretmen, çalışan ve müdür

1. Hesabını kendin açtın ([Kayıt olma](kayit-olma.md)). Kullanıcı adınla ya da e-postanla gir.
2. Şifreden sonra e-postana gelen 6 haneli kodu yaz ([İki adımlı giriş](iki-adimli-giris.md)).
3. Nereye düşeceğin portallarına bağlı ([Portallar](../portallar/README.md)):
   - tek okul rolün varsa (ör. yalnız öğretmen) doğrudan o portala;
   - hiç okul rolün yok, tek çocuğun varsa o çocuğun veli portalına;
   - birden çok portalın varsa hesabının ana sayfasına: "Soldaki menüden bir portal seç" ve portal kartları;
   - hiç portalın yoksa "Henüz bir portalın yok" kartına ([Portalı olmayan hesap](../portallar/portalsiz-hesap.md)).
4. Okulun sayfasından girdiysen giriş önce o okulun hesaplarında aranır; adın orada yoksa yetişkin hesabın bulunur. Bugün
   nereye düşeceğin yine yukarıdaki kurala göredir.

Tasarımda:

- Birden çok portalın varsa tam sayfa **"Oturumunu seç"** ekranı açılır: sol üstte "← Ana siteye dön", ortada uzun portal
  kartları, altta "Çıkış yap" ([Portal seçme ekranı](../portallar/portal-secme-ekrani.md)).
- Okulun sayfasından girersen portal seçmeden o okuldaki portalına geçersin, sol üstteki **"Portallarıma dön"** ile öbürlerine
  dönersin ([Okulun sayfasından giriş](okulun-sayfasindan-giris.md)).
- Velide her çocuk ayrı oturumdur ([Velide çocuk oturumları](../portallar/velide-cocuk-oturumlari.md)).
- Doğrulama uygulaması kurduysan e-posta kodu yerine uygulamanın kodunu yazarsın
  ([Doğrulama uygulaması](dogrulama-uygulamasi.md)).

Çalışan: bugün kodda ayrı bir hesap türü değil; ek görevli kişi öğretmen portalıyla girer. Tasarımda (çalışan tanımı) kişi okula
"çalışan" olarak eklenir; girişi öbür yetişkinlerle aynıdır.

### Eğitmen

Tasarlandı — henüz kodda yok. Eğitmen ayrı bir hesap değildir: yetişkin hesabına yönetici ya da destek "Eğitmen" rolü verir.
Kişi aynı karttan, veli/öğretmen gibi girer; eğitmen panelini (`/panel/egitmen`) kendi hesabından açar
([Eğitmen rolü](../egitim-icerikleri/egitmen-rolu.md)). Tasarım 1'de eğitmen hesabında iki adımlı giriş "Açık — eğitmenlerde
zorunlu" görünür.

### Yönetici

1. Sistem yöneticisi de aynı karttan (`/login`) girer: kullanıcı adı ya da e-posta, şifre, e-postaya gelen kod.
2. Giriş bitince sayfa kendiliğinden gizli yönetim adresine geçer (tam sayfa geçiş; adres sitenin kodunda yazılı değildir,
   yalnız yöneticinin giriş cevabında gelir) ([Gizli yönetim girişi](../yonetim/gizli-yonetim-girisi.md)).
3. Yönetici dosyasından açılan yönetici ilk girişte kendi şifresini belirler; yönetim çerezini ondan sonra alır
   ([Yönetici dosyası](../yonetim/yonetici-dosyasi.md)).

Tasarımda: yönetici girişten sonra **otomatik panele atılmaz**; herkes gibi açılış sayfasında sağ üstte "Hesaba gir" görür,
alt bilginin solunda yalnız ona görünen **"Yönetim"** düğmesiyle `/panel/admin`'e geçer ([Paneller](../yonetim/paneller.md)).
Doğrulama uygulaması yönetici için **zorunludur**: kurulu değilse girişten sonra yalnız kurulum ekranı açılır
([Doğrulama uygulaması](dogrulama-uygulamasi.md)).

### Destek

Tasarlandı — henüz kodda yok. Destek ekibi hesapları sunucudaki destek dosyasından açılır; ilk girişte kişi kendi şifresini
belirler, doğrulama uygulaması zorunludur. Girişten sonra panele atılmaz; alt bilgide **"Destek paneli"** düğmesi çıkar
([Destek ekibi](../destek/destek-ekibi.md)).

### Tahta

Tasarlandı — henüz kodda yok. Sınıftaki akıllı tahtanın hesabı yalnız **okulun sayfasından** girer: "Kullanıcı adı" seçilir,
müdürün belirlediği `tahta.` ile başlayan ad ve şifre yazılır. Tahtada e-posta yoktur, kod sorulmaz; aydınlatma onayı ve
"kendi şifreni belirle" adımı tahtaya uygulanmaz; "Beni hatırla" kullanılabilir, oturum 30 gündür ve kullanıldıkça uzar. Genel
`/login`'de `tahta.` ile başlayan ad yazılırsa "Tahta hesapları okulun sayfasından girer" denir
([Tahta girişi](../tahta/tahta-girisi.md)).

### Ziyaretçi

Hesabın yoksa giriş yapamazsın; ileti kutunun altında söyler ve yanında "Kayıt ol" kısa yolu çıkar
([Kayıt olma](kayit-olma.md)). Öğrenci ya da servisçiysen kaydolmazsın: hesabını okulun açar, bilgilerini okul yönetiminden
alırsın.

## Kurallar ve sınırlar

- **Büyük/küçük harf fark etmez.** E-posta ve kullanıcı adı karşılaştırılmadan önce tek biçime getirilir: Türkçe büyük "İ",
  tam genişlikli harfler, baştaki/sondaki boşluk ve görünmez karakterler fark etmez.
- **Hangi hesap aranır:**
  - E-postayla: yalnız o e-postanın hesabı.
  - Kullanıcı adıyla, genel `/login`'de: önce yetişkin hesabı (veli, öğretmen, müdür, rolsüz yetişkin) ve yönetici; şifre
    tutmazsa ad yalnız bir okulda varsa o okulun hesabı da denenir. Ad birden çok okulda varsa ve yetişkin hesabı yoksa "okulunu
    seç".
  - Kullanıcı adıyla, okulun sayfasında: önce o okulun hesabı (öğrenci, servisçi; eski düzende okulun açtığı öğretmen/müdür);
    11 haneli bir sayı yazıldıysa o okulda T.C. numarasıyla da aranır; bulunamazsa yetişkin hesabı. Okulda aynı adla bir
    öğrenci varken yetişkin hesabının şifresiyle de girilir (şifre ikisinde de denenir).
  - Yetişkin hesabına bağlı okul rolleri (öğretmen@okul, müdür@okul) girişte ayrıca aranmaz: giriş yetişkin hesabıyla yapılır,
    rol sonra seçilir.
- **Hesap yok / şifre yanlış ayrı söylenir.** Bilerek: kayıt formu zaten "bu e-posta kayıtlı" diyor; tahmine karşı koruma kilit
  ve robot sorusudur ([Hatalı giriş ve kilit](hatali-giris-ve-kilit.md)).
- **Boş alan hatalı deneme sayılmaz**: "Kullanıcı adını ya da e-posta adresini yaz." / "Şifreni yaz." kutuyu gösterir, kilide
  saymaz.
- **Okul adresi yanlışsa**: "Bu okul adresi bulunamadı. Ana sayfadan okulunu seç."
- **Kapatılmış hesap**: "Bu hesap kapatılmış. Sistem yöneticisiyle iletişime geç."
- **Onay bekleyen hesap** (yalnız eski düzenden kalan kayıtlarda olur; bugün yeni hesap bu durumda açılmaz): şifre doğruysa
  kod gönderilmeden "Hesabın henüz onaylanmadı. Okul müdürün onaylayınca giriş yapabilirsin." (müdür hesabında "Bu müdür hesabı
  henüz açılmadı. Sistem yöneticisiyle iletişime geç.") mavi bilgi kutusunda.
- **Oturumun ömrü**: tarayıcıda 7 gün, Android uygulamasında 30 gün; ikisi de mutlaktır, kullandıkça uzamaz. Oturum anahtarı
  48 hanelik rastgele bir değerdir; sunucuda yalnız SHA-256 özeti tutulur ([Beni hatırla](beni-hatirla.md)).
- **Her sekme kendi oturumunu tutar**: aynı tarayıcıda bir sekmede müdür, ötekinde veli açık kalabilir.
- **Girişten sonra adres**: okuldaki bir rolle (öğrenci, öğretmen, müdür, servisçi) girdiysen adres çubuğu `/school/<okul>` olur;
  sayfayı yenileyince aynı okulda kalırsın. Okulu olmayan hesapta (yetişkin hesabının kendisi, yönetici) `/login` gibi bir dış
  sayfadaysan adres `/` olur.
- **Android uygulaması** aynı uçları kullanır, girişte "uygulama" bayrağı gönderir (30 günlük oturum).
- Başarılı ve başarısız girişler okulun işlem kaydına yazılmaz ([Neler kaydedilir](../islem-kaydi/neler-kaydedilir.md)).

## Kardeşler ve ilgili

**Kardeşler** (aynı klasör, [Giriş ve hesap](README.md)):

- [Kayıt olma](kayit-olma.md), [E-posta onayı](eposta-onayi.md) — hesabı açmak.
- [Kullanıcı adı](kullanici-adi.md), [Şifre kuralları](sifre-kurallari.md), [T.C. kimlik numarası](tc-kimlik-no.md).
- [Okulun sayfasından giriş](okulun-sayfasindan-giris.md) — okul adresi, okul arama, son girilen okul.
- [Robot doğrulaması](robot-dogrulamasi.md), [Hatalı giriş ve kilit](hatali-giris-ve-kilit.md).
- [İki adımlı giriş](iki-adimli-giris.md), [Doğrulama uygulaması](dogrulama-uygulamasi.md).
- [Beni hatırla](beni-hatirla.md), [Şifremi unuttum](sifremi-unuttum.md),
  [İlk girişte kendi şifreni belirleme](zorunlu-sifre-belirleme.md).
- [Doğrulama ekranlarından vazgeçme](dogrulama-ekranindan-vazgecme.md), [Yeni cihaz uyarısı](yeni-cihaz-uyarisi.md),
  [Çıkış yap](cikis-yap.md).

**İlgili:**

- [Portallar](../portallar/README.md) — girişten sonra nereye düşülür; Portallarım, portal seçme ekranı.
- [Onay ve yeniden onay](../kvkk-ve-gizlilik/onay-ve-yeniden-onay.md) — girişten sonraki aydınlatma onayı.
- [Açılış sayfası](../acilis-sayfasi/README.md) — üst şeritteki "Giriş" ve "Kayıt ol", adresler.
- [Tahta girişi](../tahta/tahta-girisi.md), [Gizli yönetim girişi](../yonetim/gizli-yonetim-girisi.md).
- [Android uygulaması](../uygulama/android-uygulamasi.md) — uygulamanın giriş ekranı.

## Kod tarafı

- Ön yüz: [public/js/parcalar/05-giris.md](../../public/js/parcalar/05-giris.md) — `authKur`, `girisKimlikAyarla`, giriş
  formunun gönderimi (`#formGiris`), hata kısa yolları (`giristen-kayda`, `hata-sifremi-unuttum`, `giristen-okul-sec`),
  `oturumuAc`; [public/js/parcalar/05a-dis-sayfalar.md](../../public/js/parcalar/05a-dis-sayfalar.md) — `/login`, okul adresi,
  `okulYolunuAyarla`; [public/js/parcalar/05b-sifre-zorunlu.md](../../public/js/parcalar/05b-sifre-zorunlu.md) —
  `girisSonrasi` (yönetim geçişi, aydınlatma onayı, zorunlu şifre); [public/js/parcalar/26-baslat.md](../../public/js/parcalar/26-baslat.md)
  — açılışta kayıtlı oturum, `/api/me`; [public/js/parcalar/04a-form-alanlari.md](../../public/js/parcalar/04a-form-alanlari.md)
  — göz düğmesi, Caps Lock uyarısı, kutunun altındaki hata. Kartın HTML'i `public/index.html` (`#authWrap`, `#formGiris`).
- Sunucu: [sunucu/bolumler/kayit.md](../../sunucu/bolumler/kayit.md) — `POST /api/login` (adım adım akış, bütün cevaplar),
  `girisOturumu` (oturumun hangi portalda açılacağı), `oturumCevabi`; [sunucu/guvenlik.md](../../sunucu/guvenlik.md) — giriş
  sınırları, kilit, oturum; [sunucu/veri/depo/kullanicilar.md](../../sunucu/veri/depo/kullanicilar.md) — `girisKimligiyle`;
  [sunucu/veri/depo/oturumlar.md](../../sunucu/veri/depo/oturumlar.md); [sunucu/yonetim-cerezi.md](../../sunucu/yonetim-cerezi.md)
  — yöneticinin çerezi.
- Testler: [testler/test-giris-kayit.md](../../testler/test-giris-kayit.md), [testler/guvenlik-test.md](../../testler/guvenlik-test.md),
  [testler/test-okul-agi.md](../../testler/test-okul-agi.md), [testler/test-yetiskin.md](../../testler/test-yetiskin.md),
  [testler/test-admin-gizli.md](../../testler/test-admin-gizli.md).
- Kullanıcıya dönük anlatım: [belge/KILAVUZ.md](../../belge/KILAVUZ.md) ("İki adımlı giriş (2FA)", "Hesap türleri ve portallar",
  "Okul adresi").

## Sık sorulanlar

- **Nereden giriş yaparım?** Veli, öğretmen ve müdür e-posta adresi ya da kullanıcı adıyla Giriş sayfasından girer. Öğrenci ve
  servisçi okulunun adresinden girer: aynı kullanıcı adı başka bir okulda da olabileceği için giriş o okulun içinde aranır
  (sitenin SSS'si).
- **Kullanıcı adıyla mı, e-postayla mı girerim?** İkisiyle de; kartın üstünden seçersin. Okulun açtığı öğrenci ve servisçi
  hesabında çoğu zaman e-posta yoktur, kullanıcı adıyla girilir.
- **"Bu kullanıcı adı birden çok okulda var" diyor.** Okulunu `/login`'deki aramadan seç, okulunun sayfasından gir.
- **Aynı tarayıcıda iki hesap açık kalabilir mi?** Evet; her sekme kendi oturumunu tutar. Bir sekmede veli, ötekinde öğretmen
  olarak çalışabilirsin.
- **Giriş bilgilerim Google'a gidiyor mu?** Hayır. Giriş Eğitim Evi'nin kendi sunucusunda yapılır; robot sorusu da kendi
  sorumuzdur (dış captcha servisi yok).

## Sırada

- Tek kişi tek hesap + portallar öğrencide de: kullanıcı adı site genelinde tek olacak; girişte "Okul seç" yalnız okulun
  sayfasına götüren bir kısa yol olarak kalacak; okulun sayfasından girince doğrudan o okuldaki portal açılacak.
- Paneller: yönetici ve destek girişten sonra otomatik yönlendirilmeyecek; alt bilgide "Yönetim" / "Destek paneli" düğmesi.
- Sistem: yöneticiye ve desteğe zorunlu doğrulama uygulaması, öbür yetişkinlere isteğe bağlı; yeni cihaz uyarısı.
- Toplantılar ve tahta hesabı: `tahta.` önekli hesapların okulun sayfasından girişi.
- Güvenlik denetimi: giriş sınırlarında IPv6 adreslerinin /64 ağı olarak sayılması.
- Çok dil: kartın bütün metinleri çeviri kataloğuna.
