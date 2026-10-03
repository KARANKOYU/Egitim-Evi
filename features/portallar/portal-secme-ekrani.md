# Portallar · Portal seçme ekranı

**Durum:** Kodda var; tasarımda ek olarak tam sayfa "Oturumunu seç" ekranı (sol üstte "← Ana siteye dön", uzun ve kaydırılabilir
portal kartları: Okul, Okul kodu, velide Öğrenci; altta "Çıkış yap") ve okulun sayfasından girişte bu ekranın atlanması.

Birden çok portalı olan yetişkinin girişten sonra ilk gördüğü, portallarını büyük kartlar hâlinde dizen ve birini seçtiren sayfa.

## Ne işe yarar

Tek portalın varsa girişte doğrudan oraya girersin; seçecek bir şey yoktur. İki ya da daha çok portalın varsa (ör. bir okulda
öğretmen ve bir çocuğun velisi, ya da iki çocuğun velisi) Eğitim Evi seni bir portala kendisi sokmaz: önce hesabının ana
sayfasını açar ve hangisine gireceğini sana bırakır. Bugün bu sayfa ayrı bir ekran değil, yetişkin hesabının portal dışındaki
ana sayfasıdır; tasarımda tam sayfa bir "Oturumunu seç" ekranıdır.

## Nereden açılır

Kendiliğinden açılır; menüde ayrı bir satırı yoktur. Bugün açıldığı durumlar:

- **Girişte**, sunucu birden çok portalın olduğunu görünce (girilebilen okul rolü sayısı + çocuk sayısı 1'den büyükse).
- **Şifreni başkası vermişse** (eski düzende yöneticinin açtığı hesap): kendi şifreni belirledikten sonra, en az bir portalın
  varsa ([İlk girişte kendi şifreni belirleme](../giris-hesap/zorunlu-sifre-belirleme.md)).
- **İçinde bulunduğun okuldan ayrılınca** ([Bu okuldan ayrıl](okuldan-ayrilma.md)).
- **Tek portalın kapalı bir okuldaysa** (çocuğun da yoksa): girişte bu sayfa o tek kartla açılır
  ([Kapalı okulun portalı](kapali-okul.md)).
- **Sayfayı yenileyince:** bu sekmede portal dışındaysan orada kalırsın.

Bir portala girdikten sonra menüde bu sayfaya dönen bir satır yoktur; portallar arasında sol menüdeki
[Portallarım](portallarim.md) ile geçersin.

Tasarımda: giriş formundan sonra (okulun verdiği şifreyle girdiysen önce "Yeni şifreni belirle" adımı) portal sayısı 1'den
büyükse tam sayfa **"Oturumunu seç"** ekranı açılır. Okulun sayfasından (`/school/<okul>`) girdiysen ekran çıkmaz: doğrudan o
okuldaki portalına geçersin, öbürlerine üst şeritteki **"Portallarıma dön"** ile dönersin
([Okulun sayfasından giriş](../giris-hesap/okulun-sayfasindan-giris.md)).

## Adım adım

### Veli, öğretmen ve müdür

1. Kullanıcı adınla ya da e-postanla gir, e-postana gelen kodu yaz ([Giriş](../giris-hesap/giris.md),
   [İki adımlı giriş](../giris-hesap/iki-adimli-giris.md)).
2. Birden çok portalın varsa sayfanın başlığında **"PORTALLARIN"**, altında "Soldaki menüden bir portal seç." yazar.
3. Altında her portal için büyük bir kart vardır:
   - bir çizim: öğretmende tahta başında gösteren kişi, müdürde çatısında bayrak olan okul binası, velide yetişkin ve çocuk
     (tanınmayan rolde okul binası ve artı);
   - portalın adı: "Öğretmen", "Müdür", "Veli"; okul kapalıysa yanında turuncu **"okul kapalı"** etiketi;
   - ikinci yazı: okul rolünde okulun adı ("Test Ortaokulu"), velide çocuğun adı ("Elif Yılmaz");
   - velide üçüncü yazı olarak çocuğun okulu.
4. Kartların sonunda kesik çizgili bir **"Ekle"** kartı: "Çocuğunu, okulunu ya da öğretmenliğini ekle" ([+ Ekle penceresi](ekle-penceresi.md)).
5. Bir karta bas: o portala geçersin ([Portala geçiş](portala-gecis.md)). Kartlar aynı zamanda sol menünün en üstünde de durur;
   oradan da seçebilirsin.
6. Bu sayfadayken sol menüde Portallarım'ın altında yalnız **"Başlangıç"** ve **"Hatırlatıcılar"** vardır (en altta "Ayarlar" ve
   "Çıkış Yap").

Telefonda kartlar tek sütuna dizilir.

Tasarımda ("Oturumunu seç"):

1. Ekran tam sayfadır: sol üstte **"← Ana siteye dön"** (oturumun kapanmaz, açılış sayfasına gidersin; oradan "Hesaba gir" ile
   dönersin — [Ana siteye dön](../menu-ve-arama/ana-siteye-don.md)), ortada Eğitim Evi logosu, başlık **"Oturumunu seç"**, altında
   avatarın, adın ve "@kullanıcı adın".
2. Her portal uzun bir kart: solda okulun renkli rozeti ve baş harfleri ("TO"), kalın başlık ("Öğretmen · Matematik", "Veli ·
   Elif Yılmaz · 7-A"), altında **"Okul: Test Ortaokulu"**, **"Okul kodu: test-ortaokulu"**, velide ayrıca **"Öğrenci: Elif
   Yılmaz (7-A)"**; eğitmen kartında okul satırları yerine "Eğitim Evi · eğitim içerikleri"; sağda "›". Kart çoksa liste
   kaydırılır.
3. Kartların altında **"Çıkış yap"** bağlantısı ([Çıkış yap](../giris-hesap/cikis-yap.md)).
4. Bir karta basınca o portal açılır ve kısa bir ileti çıkar: "Öğretmen · Matematik · Test Ortaokulu portalına geçildi."; velinin
   çocuk kartında "Can oturumuna geçildi.".

Kullanıcının bu ekran için söyledikleri: normal "Giriş yap"tan girince portallar (oturumlar) çıksın, okulun sayfasından girince
çıkmadan o okula girilsin ve sol üstten dönülsün (29 Eylül); oturum seçme ekranından ana siteye dönülebilsin, "Çıkış yap" önemli
(30 Eylül); kartlar biraz daha uzun olsun, çoksa kaydırılsın, üzerinde "okul:", "okul kodu:", velide "öğrenci:" yazsın (1 Ekim).

### Çalışan

Bugün öğretmenle aynı. Tasarımda okula yeni eklenmiş, görevi verilmemiş kişinin kartı "Çalışan · okul" olur
([Rolsüz çalışan](../ogretmenler-calisanlar/rolsuz-calisan.md)).

### Öğrenci

Bugün öğrenci tek okuldadır; bu sayfayı görmez. Tasarımda okul ve dershane gibi iki kurumu olan öğrenci de girişte "Oturumunu
seç"i görür ("Öğrenci · 7-A" / Test Ortaokulu, "Öğrenci · 7. sınıf B grubu" / Örnek Dershanesi) —
[Öğrencide birden çok kurum](ogrencide-portallar.md).

### Servisçi ve eğitmen

Bugün yok. Tasarımda iki okulda çalışan servisçi ve eğitmen rolü olan yetişkin de aynı ekranı görür (eğitmen kartı "Eğitmen ·
eğitim içerikleri").

### Yönetici

Yöneticide portal yoktur; bu sayfayı görmez.

## Kurallar ve sınırlar

- **Hangi durumda hangi yer** (bugün, girişte sunucu karar verir):

  | Durum | Girişten sonra |
  |---|---|
  | tek girilebilir okul rolü, çocuk yok | doğrudan o okul rolü |
  | okul rolü yok (ya da hepsi kapalı), tek çocuk | o çocuğun veli portalı |
  | girilebilir rol + çocuk sayısı 1'den büyük | bu sayfa |
  | hiç portal yok | [Henüz portalı olmayan yetişkin](portalsiz-hesap.md) |

- **Sekmeye özel:** "portal dışındayım" bilgisi bu sekmede saklanır; aynı tarayıcıda bir sekme bu sayfada, öbürü bir portalda
  kalabilir. Çıkışta silinir. Tarayıcı bu bilgiyi saklayamazsa (bazı gizli sekmeler) sayfa yenilenince bilgi kaybolur; velisi
  olduğun çocuk varsa veli portalında açılırsın.
- **Kapalı okul kartı da basılabilir:** sonuç tarayıcının uyarı kutusunda "Bu okul şu an kapalı; sistem yöneticisi yeni
  müdürünü atayınca açılır." olur.
- **Liste her açılışta tazelenir:** sayfa açılırken portallar sunucudan yeniden alınır (bu arada bir okul seni eklediyse kartı
  görünür).
- **Açılışta adres sayılmaz:** site portal dışındayken yüklenirse (sayfayı yenileyince ya da bir bağlantıyla açınca) adres bir okul
  sayfasını (ör. `#/odevler`) gösterse de bu sayfa açılır; yalnız Ayarlar ve Hatırlatıcılar adresiyle açılabilir.
- **Tasarımda:** okulun sayfasından girdiysen ekran atlanır; o okulda portalın yoksa hesabının ana sayfası açılır (Tasarım 1
  iletisi: "Bu okulda portalın yok; hesabının ana sayfası açıldı.").

## Kardeşler ve ilgili

**Kardeşler** (aynı klasör, [Portallar ve + Ekle](README.md)):

- [Portallarım](portallarim.md) — aynı portalların sol menüdeki satırları.
- [Portala geçiş](portala-gecis.md) — karta basınca ne olur.
- [Henüz portalı olmayan yetişkin](portalsiz-hesap.md) — hiç portal yoksa açılan sayfa.
- [Kapalı okulun portalı](kapali-okul.md), [Velide her çocuk ayrı oturum](velide-cocuk-oturumlari.md).

**İlgili:**

- [Giriş](../giris-hesap/giris.md), [Okulun sayfasından giriş](../giris-hesap/okulun-sayfasindan-giris.md),
  [Doğrulama ekranlarından vazgeçme](../giris-hesap/dogrulama-ekranindan-vazgecme.md) ("← Ana siteye dön"),
  [Çıkış yap](../giris-hesap/cikis-yap.md).
- [Ana siteye dön](../menu-ve-arama/ana-siteye-don.md), [Sol menü](../menu-ve-arama/sol-menu.md).

## Kod tarafı

- Ön yüz: [public/js/parcalar/08c-kisilikler.md](../../public/js/parcalar/08c-kisilikler.md) — `portalAnaSayfasi` (kartlar),
  `portalDisindaMi`, `portalDisiYaz`/`portalDisiOku` (`ee_portal_disi`); [public/js/parcalar/08-ana-sayfa.md](../../public/js/parcalar/08-ana-sayfa.md)
  — ana sayfa portal dışındayken bu sayfayı çizer; [public/js/parcalar/05b-sifre-zorunlu.md](../../public/js/parcalar/05b-sifre-zorunlu.md)
  — `girisSonrasi` (`kisilikSec` gelince portal dışı); [public/js/parcalar/06-menu.md](../../public/js/parcalar/06-menu.md) —
  portal dışındaki menü ("Başlangıç", "Hatırlatıcılar"); [public/js/parcalar/02b-cizimler.md](../../public/js/parcalar/02b-cizimler.md)
  — kart çizimleri; CSS `28-yetiskin-hesap.css` (`.portal-kartlar`, `.portal-kart`).
- Sunucu: [sunucu/bolumler/kayit.md](../../sunucu/bolumler/kayit.md) — `girisOturumu` (tek portal doğrudan, birden çoğunda
  `kisilikSec: true`).
- Testler: [testler/test-yetiskin.md](../../testler/test-yetiskin.md) — tek rolde doğrudan giriş, iki portalda `kisilikSec`;
  [testler/test-veli-coklu.md](../../testler/test-veli-coklu.md) — öğretmen rolü + çocukta seçim ekranı.

## Sık sorulanlar

- **Her girişte seçmek zorunda mıyım?** Birden çok portalın varsa evet; tek portalın varsa doğrudan girersin. Tasarımda okulun
  sayfasından girersen seçmeden o okula girersin.
- **Bir portala girdim, bu sayfaya nasıl dönerim?** Dönmen gerekmez: sol menünün en üstündeki Portallarım'dan istediğin portala
  geçersin.
- **Kartlardan biri "okul kapalı" diyor.** O okulun müdürü kaldırılmış; sistem yöneticisi yeni müdür atayınca açılır
  ([Kapalı okulun portalı](kapali-okul.md)).

## Sırada

- HTML (Tasarım 1) → kod: tam sayfa "Oturumunu seç" ekranı, uzun kartlar (Okul, Okul kodu, Öğrenci), "← Ana siteye dön",
  "Çıkış yap".
- Tek kişi tek hesap + portallar öğrencide de (iş 19): girişin üç yolu (Giriş yap, okulun sayfası, "Okul seç"), okulun
  sayfasından girişte doğrudan o okulun portalı ve "Portallarıma dön".
- Üst şerit sadeleştirme (iş 29): "Ana siteye dön" ile "Çıkış yap"ın ayrı simgeleri.
- Velide her çocuk ayrı oturum (3 Ekim kararı): iki çocuklu velinin girişte iki ayrı kart görmesi.
