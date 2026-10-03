# Giriş ve hesap

Eğitim Evi'ne nasıl hesap açılır, nasıl girilir, nasıl çıkılır. Veli, öğretmen, çalışan, müdür (ve tasarımda eğitmen) aynı tür
**yetişkin hesabını** "Hesap Aç" formundan kendisi açar; hesap rolsüzdür, e-postaya giden bağlantıya tıklanınca açılır, roller
sonra "+ Ekle" ile gelir. Öğrenci ve servisçi kaydolmaz, hesabını okul açar; okulun verdiği şifreyle ilk girişte kendi şifresini
belirler. Herkes aynı karttan kullanıcı adı ya da e-posta ve şifreyle girer (öğrenci ve servisçi okulunun sayfasından); öğrenci
dışında e-postası olan her hesap e-postaya gelen 6 haneli kodla iki adımlı girer. Hatalı denemeden sonra robot sorusu, 5 hatada
15 dakika kilit; "Beni hatırla" ve "Bilgilerimi bu cihaza kaydetme"; e-postayla "Şifremi unuttum"; çıkış. Bunların hepsi bugün
kodda var. Kullanıcının kararlaştırdığı tasarımda (Tasarım 1 önizlemesi ve tanımlar) ek olarak: T.C. kimlik numarası bütün
hesaplarda zorunlu, kayıtta il/ilçe ve "Şifre (tekrar)" ile canlı denetim, robot sorusu her girişte, okulun sayfasından girince
doğrudan o okulun portalı, doğrulama uygulaması (yönetici ve destekte zorunlu), öğrenciye isteğe bağlı iki adımlı giriş, yeni cihaz
uyarısı, doğrulama ekranlarında sol üstte "←", kullanıcı adının site genelinde tek olması, çıkıştan sonra geri/ileri tuşunun
hesaba sokmaması ve tahta hesabının okulun sayfasından girişi.

## Alt özellikler

| Belge | Ne anlatır | Durum |
|---|---|---|
| [Kayıt olma](kayit-olma.md) | "Hesap Aç" formu, alanlar, iletiler, sınırlar; rol seçilmez | Kodda var; tasarımda ek olarak T.C. zorunlu, il/ilçe, "Şifre (tekrar)", canlı denetim |
| [E-posta onayı](eposta-onayi.md) | Hesabı açan bağlantı (24 saat, tek kullanım); e-posta değiştirme | Kodda var; tasarımda ek olarak "E-postanı onayla" ekranı, "Bağlantıyı yeniden gönder" |
| [Kullanıcı adı](kullanici-adi.md) | Ad kuralları, tekillik, okulun verdiği ad (boşsa T.C.) | Kodda var; tasarımda ek olarak site genelinde tek ad, `tahta.` öneki, canlı "Kullanılabilir." |
| [Şifre kuralları](sifre-kurallari.md) | Güçlü ve sade kural, canlı liste, göz düğmesi, Caps Lock | Kodda var; tasarımda ek olarak "Şifre (tekrar)", "Eski şifre:" adları |
| [T.C. kimlik numarası](tc-kimlik-no.md) | Geçerlilik kuralı, tekillik, kim görür, okul hesaplarında T.C. | Kodda var; tasarımda ek olarak bütün hesaplarda zorunlu, canlı denetim, eski hesaplarda zorunlu adım |
| [Giriş](giris.md) | Giriş kartı, "Kullanıcı adı / E-posta", hata iletileri, rol rol nereye düşülür | Kodda var; tasarımda ek olarak oturum listesi, her girişte robot sorusu, "Hesaba gir", tahta |
| [Okulun sayfasından giriş](okulun-sayfasindan-giris.md) | `/school/<okul>`, okul araması, son girilen okul | Kodda var; tasarımda ek olarak doğrudan o okulun portalı, "Portallarıma dön", `/okul/<okul>` |
| [Robot doğrulaması](robot-dogrulamasi.md) | "a + b = ?" sorusu: kayıtta, şifremi unuttum'da, girişte | Kodda var; tasarımda ek olarak girişte her zaman |
| [Hatalı giriş ve kilit](hatali-giris-ve-kilit.md) | Kalan hak, 5 hatada 15 dk, tanıdık bağlantı, okul ağı sınırları | Kodda var |
| [İki adımlı giriş](iki-adimli-giris.md) | E-postaya 6 haneli kod; kime, ne kadar, yeniden gönderme | Kodda var; tasarımda ek olarak altı kutulu ekran, öğrenciye isteğe bağlı, uygulama kodu |
| [Doğrulama uygulaması](dogrulama-uygulamasi.md) | TOTP kurulumu (QR, kurtarma kodları), girişte ve önemli işlerde kod | Tasarlandı — henüz kodda yok |
| [Beni hatırla](beni-hatirla.md) | Oturumun saklandığı yer, sekme başına oturum, 7/30 gün | Kodda var; tasarımda ek olarak "Bu cihazdaki oturumların", tarayıcıya şifre kaydettirmeme |
| [Şifremi unuttum](sifremi-unuttum.md) | Sıfırlama bağlantısı (1 saat), "Yeni şifreni belirle", oturumların kapanması | Kodda var; tasarımda ek olarak "E-postana bak" ekranı |
| [İlk girişte kendi şifreni belirleme](zorunlu-sifre-belirleme.md) | Okulun ya da yöneticinin verdiği şifreyle girene kapatılamaz pencere | Kodda var; tasarımda ek olarak tam sayfa ekran, okulun verdiği her şifrede |
| [Doğrulama ekranlarından vazgeçme](dogrulama-ekranindan-vazgecme.md) | "← Geri dön", "← Girişe dön", "Çıkış yap"; tasarımda sol üstte "←" | Kodda var; tasarımda ek olarak sol üstte "← Vazgeç / Çıkış yap / Ana siteye dön" |
| [Yeni cihaz uyarısı](yeni-cihaz-uyarisi.md) | Tanınmayan cihazdan girişte e-posta ve bildirim | Tasarlandı — henüz kodda yok |
| [Çıkış yap](cikis-yap.md) | Çıkışta ne olur, bir kez gösterilen şifreler, geri/ileri tuşu | Kodda var; tasarımda ek olarak ayrı "Ana siteye dön", profil menüsünde çıkış, geri tuşu kuralı |

Okuma sırası:

- **Ziyaretçi (hesap açacak yetişkin):** [Kayıt olma](kayit-olma.md) → [Kullanıcı adı](kullanici-adi.md) →
  [Şifre kuralları](sifre-kurallari.md) → [T.C. kimlik numarası](tc-kimlik-no.md) → [E-posta onayı](eposta-onayi.md) →
  [Giriş](giris.md) → [İki adımlı giriş](iki-adimli-giris.md).
- **Veli, öğretmen, çalışan, müdür:** [Giriş](giris.md) → [İki adımlı giriş](iki-adimli-giris.md) →
  [Beni hatırla](beni-hatirla.md) → [Şifremi unuttum](sifremi-unuttum.md) → [Hatalı giriş ve kilit](hatali-giris-ve-kilit.md) →
  [Doğrulama uygulaması](dogrulama-uygulamasi.md) → [Yeni cihaz uyarısı](yeni-cihaz-uyarisi.md) → [Çıkış yap](cikis-yap.md).
- **Öğrenci ve servisçi:** [Okulun sayfasından giriş](okulun-sayfasindan-giris.md) → [Giriş](giris.md) →
  [İlk girişte kendi şifreni belirleme](zorunlu-sifre-belirleme.md) → [Şifre kuralları](sifre-kurallari.md) →
  [Beni hatırla](beni-hatirla.md) → [Çıkış yap](cikis-yap.md).
- **Yönetici (ve tasarımda destek):** [Giriş](giris.md) → [İlk girişte kendi şifreni belirleme](zorunlu-sifre-belirleme.md) →
  [İki adımlı giriş](iki-adimli-giris.md) → [Doğrulama uygulaması](dogrulama-uygulamasi.md) →
  [Hatalı giriş ve kilit](hatali-giris-ve-kilit.md) → [Çıkış yap](cikis-yap.md).
- **Tahta (tasarım):** [Okulun sayfasından giriş](okulun-sayfasindan-giris.md) → [Kullanıcı adı](kullanici-adi.md) →
  [Tahta girişi](../tahta/tahta-girisi.md).

## Rol tablosu

Hücre: o rolün bu alt özellikte yaptığı (bağlantı ilgili belgeye gider). "—": bu rol kullanmaz. "(tasarım)": henüz kodda yok.

| Alt özellik | Ziyaretçi | Öğrenci | Veli | Öğretmen | Çalışan | Müdür | Servisçi | Yönetici | Destek | Eğitmen | Tahta |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Kayıt olma | [hesap açar](kayit-olma.md) | — (okul açar) | [kendisi açar](kayit-olma.md) | [kendisi açar](kayit-olma.md) | [kendisi açar](kayit-olma.md) | [kendisi açar; okulu yönetici açar](kayit-olma.md) | — (okul açar) | — (yönetici dosyası) | — (destek dosyası) | [yetişkin hesabı açar](kayit-olma.md) | — (müdür açar) |
| E-posta onayı | [bağlantıyla hesabı açar](eposta-onayi.md) | — | [e-postasını değiştirir](eposta-onayi.md) | [e-postasını değiştirir](eposta-onayi.md) | [e-postasını değiştirir](eposta-onayi.md) | [e-postasını değiştirir](eposta-onayi.md) | — | — | — | [e-postasını değiştirir](eposta-onayi.md) | — |
| Kullanıcı adı | [kayıtta seçer](kullanici-adi.md) | [okul verir](kullanici-adi.md) | [seçer, değiştirir](kullanici-adi.md) | [seçer, değiştirir](kullanici-adi.md) | [seçer, değiştirir](kullanici-adi.md) | [seçer; öğrenciye verir](kullanici-adi.md) | [okul verir](kullanici-adi.md) | [hiçbir adla çakışmaz](kullanici-adi.md) | [dosyada (tasarım)](kullanici-adi.md) | [harfli ad şart (tasarım)](kullanici-adi.md) | [`tahta.` önekli (tasarım)](kullanici-adi.md) |
| Şifre kuralları | [güçlü kural](sifre-kurallari.md) | [sade kural](sifre-kurallari.md) | [güçlü kural](sifre-kurallari.md) | [güçlü kural](sifre-kurallari.md) | [güçlü kural](sifre-kurallari.md) | [güçlü kural](sifre-kurallari.md) | [sade kural](sifre-kurallari.md) | [güçlü kural](sifre-kurallari.md) | [güçlü kural (tasarım)](sifre-kurallari.md) | [güçlü kural](sifre-kurallari.md) | [müdür koyar (tasarım)](sifre-kurallari.md) |
| T.C. kimlik numarası | [bugün isteğe bağlı; tasarımda zorunlu](tc-kimlik-no.md) | [okul girer](tc-kimlik-no.md) | [Ayarlar'da girer](tc-kimlik-no.md) | [Ayarlar'da girer](tc-kimlik-no.md) | [Ayarlar'da girer](tc-kimlik-no.md) | [okul hesaplarına girer](tc-kimlik-no.md) | [okul girer](tc-kimlik-no.md) | — (hariç) | — (hariç) | [yetişkin gibi](tc-kimlik-no.md) | — |
| Giriş | [hesap yoksa "Kayıt ol"](giris.md) | [kodsuz girer](giris.md) | [kodla girer](giris.md) | [kodla girer](giris.md) | [kodla girer](giris.md) | [kodla girer](giris.md) | [okulundan girer](giris.md) | [girer, yönetime geçer](giris.md) | [girer (tasarım)](giris.md) | [girer (tasarım)](giris.md) | [okulundan girer (tasarım)](giris.md) |
| Okulun sayfasından giriş | [okulun sayfasını görür](okulun-sayfasindan-giris.md) | [okulunu seçip girer](okulun-sayfasindan-giris.md) | [buradan da girer](okulun-sayfasindan-giris.md) | [girer; tasarımda doğrudan o okulun portalı](okulun-sayfasindan-giris.md) | [öğretmen gibi](okulun-sayfasindan-giris.md) | [girer; okulun adresini değiştirir](okulun-sayfasindan-giris.md) | [okulunu seçip girer](okulun-sayfasindan-giris.md) | — | — | — | [yalnız buradan (tasarım)](okulun-sayfasindan-giris.md) |
| Robot doğrulaması | [kayıtta çözer](robot-dogrulamasi.md) | [hatadan sonra çözer](robot-dogrulamasi.md) | [hatadan sonra çözer](robot-dogrulamasi.md) | [hatadan sonra çözer](robot-dogrulamasi.md) | [hatadan sonra çözer](robot-dogrulamasi.md) | [hatadan sonra çözer](robot-dogrulamasi.md) | [hatadan sonra çözer](robot-dogrulamasi.md) | [hatadan sonra çözer](robot-dogrulamasi.md) | [aynı kural (tasarım)](robot-dogrulamasi.md) | [aynı kural (tasarım)](robot-dogrulamasi.md) | [aynı kural (tasarım)](robot-dogrulamasi.md) |
| Hatalı giriş ve kilit | — | [kilitlenir; okul açar](hatali-giris-ve-kilit.md) | [kilitlenir; şifremi unuttum](hatali-giris-ve-kilit.md) | [kilitlenir; şifremi unuttum](hatali-giris-ve-kilit.md) | [kilitlenir; şifremi unuttum](hatali-giris-ve-kilit.md) | [kilitlenir; şifremi unuttum](hatali-giris-ve-kilit.md) | [kilitlenir; okul açar](hatali-giris-ve-kilit.md) | [kilitlenir; şifremi unuttum](hatali-giris-ve-kilit.md) | [aynı kural (tasarım)](hatali-giris-ve-kilit.md) | [aynı kural (tasarım)](hatali-giris-ve-kilit.md) | [aynı kural (tasarım)](hatali-giris-ve-kilit.md) |
| İki adımlı giriş | — | [bugün yok; tasarımda isteğe bağlı](iki-adimli-giris.md) | [zorunlu kod](iki-adimli-giris.md) | [zorunlu kod](iki-adimli-giris.md) | [zorunlu kod](iki-adimli-giris.md) | [zorunlu kod](iki-adimli-giris.md) | [e-postası varsa kod](iki-adimli-giris.md) | [zorunlu kod](iki-adimli-giris.md) | [zorunlu (tasarım)](iki-adimli-giris.md) | [zorunlu (tasarım)](iki-adimli-giris.md) | — (yok) |
| Doğrulama uygulaması | — | [isteğe bağlı (tasarım)](dogrulama-uygulamasi.md) | [isteğe bağlı (tasarım)](dogrulama-uygulamasi.md) | [isteğe bağlı (tasarım)](dogrulama-uygulamasi.md) | [isteğe bağlı (tasarım)](dogrulama-uygulamasi.md) | [önerilir (tasarım)](dogrulama-uygulamasi.md) | — | [zorunlu (tasarım)](dogrulama-uygulamasi.md) | [zorunlu (tasarım)](dogrulama-uygulamasi.md) | [isteğe bağlı (tasarım)](dogrulama-uygulamasi.md) | — |
| Beni hatırla | — | [seçer](beni-hatirla.md) | [seçer](beni-hatirla.md) | [seçer](beni-hatirla.md) | [seçer](beni-hatirla.md) | [seçer](beni-hatirla.md) | [seçer](beni-hatirla.md) | [seçer](beni-hatirla.md) | [seçer (tasarım)](beni-hatirla.md) | [seçer (tasarım)](beni-hatirla.md) | [kullanılabilir (tasarım)](beni-hatirla.md) |
| Şifremi unuttum | — | [e-postası yoksa okul yeniler](sifremi-unuttum.md) | [e-postayla yeniler](sifremi-unuttum.md) | [e-postayla yeniler](sifremi-unuttum.md) | [e-postayla yeniler](sifremi-unuttum.md) | [e-postayla yeniler](sifremi-unuttum.md) | [e-postası yoksa okul yeniler](sifremi-unuttum.md) | [e-postayla yeniler](sifremi-unuttum.md) | [e-postayla (tasarım)](sifremi-unuttum.md) | [e-postayla yeniler](sifremi-unuttum.md) | — (müdür değiştirir) |
| İlk girişte kendi şifreni belirleme | — | [okulun verdiği şifrede](zorunlu-sifre-belirleme.md) | [tasarımda yönetici/destek değiştirince](zorunlu-sifre-belirleme.md) | [yalnız eski düzen hesapta](zorunlu-sifre-belirleme.md) | [tasarımda yönetici/destek değiştirince](zorunlu-sifre-belirleme.md) | [okul hesaplarına işareti koyar](zorunlu-sifre-belirleme.md) | [okulun verdiği şifrede](zorunlu-sifre-belirleme.md) | [dosyadan açılınca](zorunlu-sifre-belirleme.md) | [dosyadan açılınca (tasarım)](zorunlu-sifre-belirleme.md) | [tasarımda yönetici/destek değiştirince](zorunlu-sifre-belirleme.md) | — (uygulanmaz) |
| Doğrulama ekranlarından vazgeçme | [şifremi unuttum'dan döner](dogrulama-ekranindan-vazgecme.md) | [zorunlu şifrede çıkış yapar](dogrulama-ekranindan-vazgecme.md) | [kod ekranından döner](dogrulama-ekranindan-vazgecme.md) | [kod ekranından döner](dogrulama-ekranindan-vazgecme.md) | [kod ekranından döner](dogrulama-ekranindan-vazgecme.md) | [kod ekranından döner](dogrulama-ekranindan-vazgecme.md) | [zorunlu şifrede çıkış yapar](dogrulama-ekranindan-vazgecme.md) | [kod ekranından döner](dogrulama-ekranindan-vazgecme.md) | [sol üstte "←" (tasarım)](dogrulama-ekranindan-vazgecme.md) | [sol üstte "←" (tasarım)](dogrulama-ekranindan-vazgecme.md) | — |
| Yeni cihaz uyarısı | — | [e-postası varsa (tasarım)](yeni-cihaz-uyarisi.md) | [uyarıyı alır (tasarım)](yeni-cihaz-uyarisi.md) | [uyarıyı alır (tasarım)](yeni-cihaz-uyarisi.md) | [uyarıyı alır (tasarım)](yeni-cihaz-uyarisi.md) | [uyarıyı alır (tasarım)](yeni-cihaz-uyarisi.md) | [e-postası varsa (tasarım)](yeni-cihaz-uyarisi.md) | [uyarıyı alır (tasarım)](yeni-cihaz-uyarisi.md) | [uyarıyı alır (tasarım)](yeni-cihaz-uyarisi.md) | [uyarıyı alır (tasarım)](yeni-cihaz-uyarisi.md) | — |
| Çıkış yap | — | [çıkar](cikis-yap.md) | [çıkar](cikis-yap.md) | [çıkar](cikis-yap.md) | [çıkar](cikis-yap.md) | [çıkar; şifre listesi sorulur](cikis-yap.md) | [çıkar; açık sefer biter](cikis-yap.md) | [çıkar; yönetim çerezi silinir](cikis-yap.md) | [çıkar (tasarım)](cikis-yap.md) | [çıkar (tasarım)](cikis-yap.md) | [şeritte hep görünür (tasarım)](cikis-yap.md) |

Notlar:

- **Çalışan** sütunu: bugün kodda ek görevli kişi (Müdür Yardımcısı, Rehber Öğretmen…) öğretmen portalıyla girer; giriş ve hesap
  açısından öğretmenle aynıdır. Tasarımda (çalışan tanımı) kişi okula "çalışan" olarak eklenir; hesabı yine yetişkin hesabıdır.
- **Destek**, **eğitmen** ve **tahta** tasarımdaki rollerdir. Eğitmen ayrı bir hesap değil, yetişkin hesabına verilen bir roldür.
  Destek hesapları sunucudaki destek dosyasından açılır; yönetici gibi doğrulama uygulaması zorunludur. Tahta okula ait ortak
  hesaptır: yalnız okulun sayfasından girer, kod, zorunlu şifre ve aydınlatma onayı ona uygulanmaz.
- **Ziyaretçi** giriş yapmamış kişidir; hesabı olan herkes de giriş kartını ziyaretçi olarak görür.
- **Velide her çocuk ayrı oturum** (kullanıcının 3 Ekim kararı) girişten sonraki portal seçimini etkiler
  ([Velide çocuk oturumları](../portallar/velide-cocuk-oturumlari.md)).

Rol kapıları: [Ziyaretçi](../roller/ziyaretci.md) · [Öğrenci](../roller/ogrenci.md) · [Veli](../roller/veli.md) ·
[Öğretmen](../roller/ogretmen.md) · [Çalışan](../roller/calisan.md) · [Müdür](../roller/mudur.md) ·
[Servisçi](../roller/servisci.md) · [Yönetici](../roller/yonetici.md) · [Destek](../roller/destek.md) ·
[Eğitmen](../roller/egitmen.md) · [Tahta](../roller/tahta.md). Bütün özellikler: [features/](../README.md).

## İlgili öbür klasörler

- [Portallar](../portallar/README.md) — girişten sonra nereye düşülür: Portallarım, portal seçme ekranı, "+ Ekle", kişi kodu,
  velide çocuk oturumları, portalı olmayan hesap.
- [Ayarlar](../ayarlar/README.md) — kişisel bilgiler, giriş bilgileri (kullanıcı adı, e-posta), şifre değiştirme, güvenlik
  (iki adımlı giriş, doğrulama uygulaması), açık oturumlar, e-posta ekleme önerisi, hesabımı sil.
- [KVKK ve gizlilik](../kvkk-ve-gizlilik/README.md) — kayıttaki onay, girişten sonra yeniden onay, kim neyi görür.
- [Açılış sayfası](../acilis-sayfasi/README.md) — üst şeritteki "Giriş" ve "Kayıt ol", adresler (`/login`, `/signup`), bulunamadı
  sayfaları.
- [Okul sayfası](../okul-sayfasi/README.md) — okulun adresi ve giriş kartının üstündeki tanıtım sayfası.
- [Menü ve arama](../menu-ve-arama/README.md) — sol menüdeki "Çıkış Yap", profil menüsü, "Ana siteye dön", geri/ileri.
- [Hesaplar](../hesaplar/README.md) — okulun öğrenci ve servisçi hesabı açması, şifre işlemleri, toplu giriş bilgisi, veli bağlama.
- [Tahta](../tahta/README.md) — tahta hesabı ve girişi (tasarım).
- [Yönetim](../yonetim/README.md) — gizli yönetim girişi, yönetici dosyası, panelde zorunlu doğrulama, hesaba müdahale, e-posta
  sağlığı.
- [Destek](../destek/README.md) — destek ekibi hesapları (tasarım).
- [Uygulama](../uygulama/README.md) — Android uygulamasının giriş ekranları, doğrulayıcı, geri tuşu.
- [Eğitim yılı](../egitim-yili/README.md) — önemli işlerde çift doğrulama.
- [Eğitim içerikleri](../egitim-icerikleri/README.md) — eğitmen rolü.
- [İşlem kaydı](../islem-kaydi/README.md) — "Şifre sıfırlandı (kullanıcı)", "Hesabın e-postası değişti".
- [Bildirimler](../bildirim/README.md) — çıkışta telefon bildiriminin bırakılması, yeni cihaz bildirimi (tasarım).
- [Dil ve çeviri](../dil/README.md) — giriş ve kayıt metinlerinin çevrilmesi.

## Kod belgeleri

- Ön yüz: [public/js/parcalar/05-giris.md](../../public/js/parcalar/05-giris.md) (giriş, kayıt, iki adımlı kod, şifremi unuttum,
  oturum anahtarının saklanması, şifre/kullanıcı adı/T.C. denetimleri), [public/js/parcalar/05a-dis-sayfalar.md](../../public/js/parcalar/05a-dis-sayfalar.md)
  (`/login`, `/signup`, `/school/<okul>`, okul araması), [public/js/parcalar/05b-sifre-zorunlu.md](../../public/js/parcalar/05b-sifre-zorunlu.md)
  (girişten sonraki kapılar, kendi şifreni belirle), [public/js/parcalar/26-baslat.md](../../public/js/parcalar/26-baslat.md)
  (açılış, e-posta onayı, sıfırlama bağlantısı, çıkış), [public/js/parcalar/04a-form-alanlari.md](../../public/js/parcalar/04a-form-alanlari.md)
  (göz düğmesi, Caps Lock, kutunun altındaki hata), [public/js/parcalar/04c-telefon.md](../../public/js/parcalar/04c-telefon.md)
  (telefon alanı). Kartın HTML'i `public/index.html` (`#authWrap`).
- Sunucu: [sunucu/bolumler/kayit.md](../../sunucu/bolumler/kayit.md) (kayıt, e-posta onayı, giriş, kod, şifremi unuttum, şifre,
  çıkış), [sunucu/guvenlik.md](../../sunucu/guvenlik.md) (kodlar, bağlantılar, robot sorusu, kilitler, okul ağı sınırları),
  [sunucu/ortak.md](../../sunucu/ortak.md) (doğrulayıcılar), [sunucu/sifre.md](../../sunucu/sifre.md) (scrypt),
  [sunucu/api.md](../../sunucu/api.md) (aydınlatma ve şifre kapıları), [sunucu/bolumler/kisilik.md](../../sunucu/bolumler/kisilik.md)
  (e-posta ve kullanıcı adı değiştirme), [sunucu/veri/depo/kullanicilar.md](../../sunucu/veri/depo/kullanicilar.md),
  [sunucu/veri/depo/oturumlar.md](../../sunucu/veri/depo/oturumlar.md), [sunucu/veri/depo/onaylar.md](../../sunucu/veri/depo/onaylar.md),
  [sunucu/yonetim-cerezi.md](../../sunucu/yonetim-cerezi.md), [sunucu/yonetici-dosyasi.md](../../sunucu/yonetici-dosyasi.md).
- Testler: [testler/test-giris-kayit.md](../../testler/test-giris-kayit.md), [testler/test-sifre.md](../../testler/test-sifre.md),
  [testler/guvenlik-test.md](../../testler/guvenlik-test.md), [testler/test-okul-agi.md](../../testler/test-okul-agi.md),
  [testler/test-cakisma.md](../../testler/test-cakisma.md), [testler/test-yetiskin.md](../../testler/test-yetiskin.md),
  [testler/test-admin-gizli.md](../../testler/test-admin-gizli.md), [testler/test-adresler.md](../../testler/test-adresler.md).
- Kullanıcıya dönük anlatım: [belge/KILAVUZ.md](../../belge/KILAVUZ.md) ("İki adımlı giriş (2FA)", "Hesap türleri ve portallar",
  "Okul adresi", "Kayıt kuralları", "Aynı e-posta, kullanıcı adı ve T.C. (çakışmalar)", "İlk giriş (admin)").
