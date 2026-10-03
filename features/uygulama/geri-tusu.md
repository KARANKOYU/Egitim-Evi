# Uygulama ve indirme · Android geri tuşu

**Durum:** Kodda var; tasarımda ek olarak önce açık olanı (pencere, ayrıntı, menü) kapatma, kaydedilmemiş yazıyı sorma, sekme
geçmişi ve en baştayken uygulamadan çıkmama.

Android uygulamasında telefonun geri tuşuna (ya da kenardan kaydırma hareketine) basınca ne olduğu: her basışta bir adım geri.

## Ne işe yarar

Geri tuşu insanın beklediğini yapsın: açık bir şey varsa önce onu kapatsın, sonra önceki sayfaya dönsün, en baştayken de uygulamayı
kapatıp atmasın. Kullanıcının 2 Ekim sözü (yazıldığı gibi): "uygulamada geri gitme android app de vb şeyler olsun geri gitme mesela
ödev açıksa kapatma önceki ayfaya geçme boşsa daha yapma yaz linux ta apılcak".

## Nereden açılır

- Telefonun **geri tuşu** ya da Android 13 ve üstünde ekranın kenarından **geri hareketi**.
- Uygulamanın üst çubuğunda sol üstteki **geri oku** (ekran okuyucu: "Geri"); yalnız bir iç sayfadayken görünür, aynı işi yapar.
- Giriş kodu ekranında sol üstteki **"← Geri"**; hesap açma ve şifre yenileme ekranlarında **"← Girişe dön"**.

## Adım adım

### Herkes (Android uygulamasında)

Öğrenci, veli, öğretmen, çalışan, müdür ve servisçi için aynı.

#### Bugün (Android deposundaki 2.0.0)

Her basışta sırayla ilk uyan şey olur:

1. Açık sayfanın kendisi geri tuşunu karşılıyorsa o (bugün hiçbir sayfa karşılamıyor; giriş kodu ekranı yalnız "yeni kod"
   sayacını durdurur, sonra kapanır).
2. Bulunduğun sekmede birden çok sayfa açtıysan en üstteki kapanır, öncekine dönersin (ör. Ayarlar → Şifre değiştir → geri →
   Ayarlar).
3. Ana sayfa sekmesinde değilsen **"Ana sayfa"** sekmesine geçersin.
4. Ana sayfa sekmesinin başındaysan **uygulamadan çıkar**.

Giriş ekranlarında (giriş, giriş kodu, hesap açma, şifre yenileme, aydınlatma onayı, kendi şifreni belirleme) sekme yoktur: iç
ekrandaysan (ör. "Hesap aç") girişe dönersin, giriş ekranındaysan uygulamadan çıkar. Çıkış yaptıktan sonra giriş ekranı yeni baştan
kurulduğu için geri tuşu seni eski hesabına sokmaz.

#### Tasarımda

Her basışta **yalnız bir adım**, şu sırayla:

1. **Açık olan ne varsa onu kapat:** klavye, açılır menü ya da liste, alttan açılan pencere, onay penceresi, bir **ayrıntı** (açık
   ödev, sınav, mesaj, etüt ayrıntısı). Altındaki sayfa yerinde kalır, kaydırdığın yer korunur.
2. **Kaydedilmemiş yazı varsa sor:** mesaj, ödev teslim notu ya da bir formda yazdıkların kaydedilmediyse **"Yazdıkların silinsin
   mi?"** — **"Vazgeç"** (yazmaya devam) / **"Sil ve çık"**.
3. **Önceki sayfaya dön:** sayfa yığınında önceki sayfa varsa ona; kaydırma yeri, seçili sekme ve süzgeçler korunur.
4. **Önceki sekmeye dön:** sekmenin başındaysan bir önce bulunduğun sekmeye (uygulama sekme geçmişini tutar); geçmiş yoksa ana
   sekmeye.
5. **Hiçbir şey yapma:** ana sekmenin başında ve hiçbir şey açık değilken uygulama **kapanmaz** ("boşsa daha yapma").

Giriş ekranında geri tuşu hiçbir şey yapmaz; çıkıştan sonra geri tuşu hesaba geri sokmaz. Sol üstteki geri oku aynı yolu kullanır ve
ana sekmenin başında görünmez. Doğrulama ekranlarında sol üstteki "←" işi iptal edip geldiğin yere döner
([Doğrulama ekranından vazgeçme](../giris-hesap/dogrulama-ekranindan-vazgecme.md)).

Örnekler (tasarım):

- **Öğrenci:** Ödevler'de bir ödevi açtın → geri → ödev kapanır, liste kaldığın yerde ([Ödevin penceresi](../odev/odev-penceresi.md)).
  Bir daha geri → bir önce bulunduğun sekme (ör. Program).
- **Öğretmen:** veliye mesaj yazarken geri → "Yazdıkların silinsin mi?"; "Vazgeç" dersen yazına dönersin.
- **Veli:** Servis sayfasında "Binmeyecek" penceresi açık → geri → yalnız pencere kapanır.
- **Herkes:** Ana sayfada, hiçbir şey açık değil → geri → hiçbir şey olmaz; uygulamadan çıkmak için telefonun ana ekran tuşunu
  kullanırsın.

### Tarayıcıda ve tarayıcıdan yüklenen Eğitim Evi'nde

Android'de tarayıcıdan yüklenen (ya da tarayıcıda açılan) Eğitim Evi'nde geri tuşu sitenin geçmişinde geri gider; site tasarımında
da açık pencere önce kapanır ve çıkıştan sonra geri ya da ileri tuşu hesaba sokmaz. Ayrıntısı:
[Geri, ileri ve ev](../menu-ve-arama/geri-ileri-ve-ev.md), [Çıkış yap](../giris-hesap/cikis-yap.md).

## Kurallar ve sınırlar

- **Bir basış, bir adım:** iki şey birden kapanmaz (pencere kapanırken sayfa değişmez).
- **Kaydırma yeri ve süzgeçler** (tasarım): geri dönülen sayfada korunur.
- **Uygulamadan çıkma** (tasarım): geri tuşuyla olmaz; bugünkü kodda ana sekmenin başında geri uygulamadan çıkar.
- **Ortak düzen (tasarım önerisi):** açılan her pencere, alttan açılan sayfa ya da menü "açık katmanlar" listesine girer; geri önce
  onu kapatır. Böylece her ekrana ayrı geri kodu yazmak gerekmez; kendine özgü açılır parçası olan sayfa kendi kapatmasını yazar.
- **Hesap güvenliği:** çıkıştan sonra geri tuşu hiçbir zaman önceki kişinin ekranını açmaz.
- **Android sürümleri:** Android 13 ve üstünde geri hareketi, eskilerde geri tuşu; ikisi aynı sırayı izler.

## Kardeşler ve ilgili

**Kardeşler** ([Uygulama ve indirme](README.md)): [Android uygulaması](android-uygulamasi.md) · [Doğrulayıcı](dogrulayici.md) ·
[Kendini güncelleme](kendini-guncelleme.md).

**İlgili:** [Geri, ileri ve ev](../menu-ve-arama/geri-ileri-ve-ev.md) · [Çıkış yap](../giris-hesap/cikis-yap.md) ·
[Doğrulama ekranından vazgeçme](../giris-hesap/dogrulama-ekranindan-vazgecme.md) · [Ödevin penceresi](../odev/odev-penceresi.md) ·
[Mesajı okuma](../mesaj/mesaj-okuma.md) · [Telefonda menü](../menu-ve-arama/telefonda-menu.md).

## Kod tarafı

- **Android deposu** (ayrı depo): `AnaEkran.md` (`geri()`: sayfanın kendi geri karşılaması → yığında kapat → ana sekme → çıkış;
  Android 13+ geri hareketi ve eskilerdeki geri tuşu aynı yöntemi çağırır; sol üstteki geri okunun görünmesi), `Sayfa.md`
  (`geriBas` — sayfanın kendi geri karşılaması, varsayılanı "karşılamadım"), `KodSayfasi.md` (giriş kodu ekranı), `TANITIM.md`
  ("Bilinen açıklar": kök sayfada geri uygulamadan çıkar).
- Sitenin karşılığı (tarayıcı geçmişi): [public/js/parcalar/07-yonlendirme.md](../../public/js/parcalar/07-yonlendirme.md),
  [public/js/parcalar/25-tiklama.md](../../public/js/parcalar/25-tiklama.md).
- Testler (tasarım): öykünücüde geri tuşu dizileri (ayrıntı açık → kapanır; iki sayfa derin → bir geri; kök → uygulama açık kalır) ve
  Android 13+ geri hareketi. Bugün otomatik testi yok.

## Sık sorulanlar

- **Geri tuşuna basınca uygulama kapanıyor.** Bugünkü sürümde ana sayfanın başındayken geri uygulamadan çıkar; tasarımda çıkmaz.
- **Bir ödevi açtım, geri bastım, ödev listesi en başa döndü.** Tasarımda liste kaldığın yerde kalır; bugünkü uygulamada ödev ekranı
  henüz yok (sitede yaparsın).
- **Yazdığım mesaj geri tuşuyla silindi mi?** Tasarımda silinmeden önce "Yazdıkların silinsin mi?" diye sorulur.

## Sırada

- Android geri tuşu işi (Linux'ta yapılacak): yukarıdaki beş adımlık sıra, "Yazdıkların silinsin mi?" sorusu, sekme geçmişi.
- Android yerel uygulama işi: rol ekranları yazıldıkça her ekranın açılır parçaları bu düzene girer.
- Üst şerit sadeleştirme işi: sol üstteki "←" ve doğrulama ekranlarındaki vazgeçme.
