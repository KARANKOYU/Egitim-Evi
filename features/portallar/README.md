# Portallar ve + Ekle

Eğitim Evi'nde bir yetişkin tek hesapla birden çok "şapka" takar: A okulunda öğretmen, B okulunda müdür, aynı zamanda iki
çocuğun velisi. Her biri bir **portaldır**. Portallar sol menünün en üstünde "Portallarım" başlığı altında alt alta durur;
dokununca o portala geçilir (okul rolüne geçmek yeni oturum demektir, velide yalnız seçili çocuk değişir). Yeni portal sağ
üstteki **"+ Ekle"** ile gelir: **Veli** (çocuğun veli koduyla), **Öğretmen** (kişi kodunu okulun müdürüne vermek) ve
**Müdür** (kişi kodunu sistem yöneticisine verip okulunu açtırmak). Her yetişkin hesabının 16 karakterlik bir **kişi kodu**
vardır; öğrencininki veli kodudur, servisçide ve yöneticide kod yoktur (tireyle 4'erli: `Ab3#-kQx9-+mPt-7?zR`). Birden çok
portalı olan girişte portal kartlarını görür, hiç portalı olmayan "Henüz bir portalın yok" kartını; öğretmen Ayarlar'dan
"Okuldan ayrıl" der, veli çocuğunu "Kaldır"ır.
Bunların hepsi bugün kodda var. Kullanıcının kararlaştırdığı tasarımda (Tasarım 1 önizlemesi ve tanımlar) ek olarak:
"+ Ekle"deki "Öğretmen" seçeneği **"Çalışan"** olur, girişte tam sayfa **"Oturumunu seç"** ekranı (uzun kartlar: Okul, Okul
kodu, velide Öğrenci), **velide her çocuk ayrı oturum** ("Hepsi" görünümü kalkar), **öğrencide de portallar** (okul ve
dershane aynı anda; portal kurum ekleyince kendiliğinden düşer), servisçi ve eğitmende de portal, okulun sayfasından girince
doğrudan o okulun portalı ve "Portallarıma dön", onay kutulu ve şifreyle doğrulanan "Bu okuldan ayrıl", son müdür değilse
müdürün de ayrılabilmesi ve müdürsüz okulun "Müdürü yok" diye anılması.

## Alt özellikler

| Belge | Ne anlatır | Durum |
|---|---|---|
| [Portallarım](portallarim.md) | Sol menünün başındaki liste, Ayarlar'daki "Portallarım" kartı, tasarımdaki "Portallarım" penceresi | Kodda var; tasarımda ek olarak okul rozeti, "buradasın", pencere, öğrenci/servisçi/eğitmen portalları |
| [Portal seçme ekranı](portal-secme-ekrani.md) | Birden çok portalı olanın girişte gördüğü "PORTALLARIN" sayfası; tasarımda tam sayfa "Oturumunu seç" | Kodda var; tasarımda ek olarak tam sayfa ekran, uzun kartlar, "← Ana siteye dön" |
| [Portala geçiş](portala-gecis.md) | Okul rolüne geçiş (yeni oturum), velide çocuk seçimi, bildirimden geçiş, hata iletileri | Kodda var; tasarımda ek olarak geçiş iletisi, çocuklar arası ayrı oturum, "Portallarıma dön" |
| [+ Ekle penceresi](ekle-penceresi.md) | "Ne eklemek istiyorsun?": Veli · Öğretmen (tasarımda Çalışan) · Müdür; her panelin metni ve iletisi | Kodda var; tasarımda ek olarak "Çalışan", "Yakınlığın", "Çocuğunu bağla" adımı |
| [Kişi kodu](kisi-kodu.md) | 16 karakterlik kod, biçimi, kimde var, nerede görünür, tek kullanım, yenileme, kod kutusunun davranışı | Kodda var; tasarımda ek olarak Hesap ayarlarında "Kişi kodun" (öğrencide "Veli kodun") bölümü |
| [Çocuklarım](cocuklarim.md) | Velinin çocuk listesi: veli koduyla ekleme, portalını açma, kaldırma | Kodda var; tasarımda ek olarak çocuğun penceresi, "Bu oturum / Oturumuna geç" |
| [Velide her çocuk ayrı oturum](velide-cocuk-oturumlari.md) | Bugünkü "Hepsi" şeridi ve birleşik listeler; 3 Ekim kararıyla her çocuğun ayrı oturumu | Kodda var; tasarımda ek olarak her çocuk tamamen ayrı oturum, "Hepsi" yok |
| [Öğrencide birden çok kurum](ogrencide-portallar.md) | Öğrenci hesabında okul ve dershane portalları, kendiliğinden düşen portal, nakil, servisçi portalı | Tasarlandı — henüz kodda yok |
| [Bu okuldan ayrıl](okuldan-ayrilma.md) | Öğretmenin okuldan ayrılması; müdürün bugün bırakamaması, tasarımda son müdür değilse ayrılması | Kodda var; tasarımda ek olarak onay kutusu, şifreyle doğrulama, müdürün ayrılması |
| [Henüz portalı olmayan yetişkin](portalsiz-hesap.md) | Rolsüz hesabın ana sayfası, menüsü ve sunucunun ona açık bıraktığı yerler | Kodda var; tasarımda ek olarak "Hoş geldin" başlığı, "çalışan olarak katıl", Destek |
| [Kapalı okulun portalı](kapali-okul.md) | Müdürü kaldırılmış okulun soluk portalı, "okul kapalı" etiketi, girilememesi; tasarımda "Müdürü yok" | Kodda var; tasarımda ek olarak "okul kapalı / onay bekliyor" sözlerinin kalkması |

Okuma sırası:

- **Yeni hesap açmış yetişkin (veli, öğretmen, çalışan, müdür adayı):** [Henüz portalı olmayan yetişkin](portalsiz-hesap.md) →
  [+ Ekle penceresi](ekle-penceresi.md) → [Kişi kodu](kisi-kodu.md) → [Portallarım](portallarim.md) →
  [Portal seçme ekranı](portal-secme-ekrani.md) → [Portala geçiş](portala-gecis.md).
- **Veli:** [+ Ekle penceresi](ekle-penceresi.md) → [Çocuklarım](cocuklarim.md) →
  [Velide her çocuk ayrı oturum](velide-cocuk-oturumlari.md) → [Portallarım](portallarim.md) → [Portala geçiş](portala-gecis.md).
- **Öğretmen ve çalışan:** [Kişi kodu](kisi-kodu.md) → [Portallarım](portallarim.md) → [Portala geçiş](portala-gecis.md) →
  [Bu okuldan ayrıl](okuldan-ayrilma.md) → [Kapalı okulun portalı](kapali-okul.md).
- **Müdür:** [+ Ekle penceresi](ekle-penceresi.md) (Müdür paneli) → [Kişi kodu](kisi-kodu.md) → [Portallarım](portallarim.md) →
  [Bu okuldan ayrıl](okuldan-ayrilma.md) → [Kapalı okulun portalı](kapali-okul.md) →
  [Öğrencide birden çok kurum](ogrencide-portallar.md) (öğrenci eklerken eşleme).
- **Öğrenci:** [Kişi kodu](kisi-kodu.md) (veli kodun) → [Öğrencide birden çok kurum](ogrencide-portallar.md) (tasarım).

## Rol tablosu

Hücre: o rolün bu alt özellikte yaptığı (bağlantı ilgili belgeye gider). "—": bu rol kullanmaz. "(tasarım)": henüz kodda yok.
Çalışan bugün kodda ayrı bir rol değildir (okula eklenen herkes öğretmen satırıdır); sütun tasarımdaki (çalışan tanımı) durumu
anlatır. Eğitmen de tasarımdaki bir site rolüdür.

| Alt özellik | Öğrenci | Veli | Öğretmen | Çalışan | Müdür | Servisçi | Eğitmen | Yönetici | Ziyaretçi |
|---|---|---|---|---|---|---|---|---|---|
| Portallarım | — bugün; [okul ve dershane satırları](portallarim.md) (tasarım) | [her çocuk bir satır; geçer, "Kaldır"](portallarim.md) | [okulunu görür, geçer, "Okuldan ayrıl"](portallarim.md) | ["Çalışan · okul" satırı](portallarim.md) (tasarım) | [okulunu görür; Ayarlar'da bırakamaz](portallarim.md) | — bugün; ["Servisçi · okul"](portallarim.md) (tasarım) | ["Eğitmen · eğitim içerikleri"](portallarim.md) (tasarım) | — ("Yönetici hesabında portal seçimi yok.") | — |
| Portal seçme ekranı | [iki kurumu varsa "Oturumunu seç"](portal-secme-ekrani.md) (tasarım) | [birden çok çocukta girişte görür](portal-secme-ekrani.md) | [birden çok portalda girişte kart seçer](portal-secme-ekrani.md) | [öğretmen gibi](portal-secme-ekrani.md) (tasarım) | [birden çok portalda girişte kart seçer](portal-secme-ekrani.md) | [iki okulda](portal-secme-ekrani.md) (tasarım) | [eğitmen kartı](portal-secme-ekrani.md) (tasarım) | — | — |
| Portala geçiş | [okul ile dershane arasında](portala-gecis.md) (tasarım) | [çocuklar arası (bugün yerel seçim)](portala-gecis.md) | [okul rolüne geçiş = yeni oturum](portala-gecis.md) | [öğretmen gibi](portala-gecis.md) (tasarım) | [okul rolüne geçiş = yeni oturum](portala-gecis.md) | [okullar arası](portala-gecis.md) (tasarım) | [eğitmen portalına](portala-gecis.md) (tasarım) | — | — |
| + Ekle penceresi | — (düğme yok; tasarımda "Kuruma katıl" da yok) | ["Veli": veli koduyla çocuk ekler](ekle-penceresi.md) | ["Öğretmen": kişi kodunu müdüre verir](ekle-penceresi.md) | ["Çalışan" seçeneği](ekle-penceresi.md) (tasarım) | ["Müdür": kodu yöneticiye verir](ekle-penceresi.md) | — (düğme yok) | [düğmeyi görür](ekle-penceresi.md) (tasarım) | — (düğme yok) | — (önce hesap açar) |
| Kişi kodu | [veli kodunu Ayarlar'da görür, velisine verir](kisi-kodu.md) | [çocuğun veli kodunu girer](kisi-kodu.md) | [kodunu müdüre verir, yeniler](kisi-kodu.md) | [kodunu müdüre verir](kisi-kodu.md) (tasarım) | [kodunu yöneticiye verir; öğretmen eklerken kod girer](kisi-kodu.md) | — (kodu yok) | [kodu var](kisi-kodu.md) (tasarım) | [okul açarken müdürün kodunu girer](kisi-kodu.md) | — |
| Çocuklarım | [velisi bağlanınca bildirim alır](cocuklarim.md) | [ekler, açar, kaldırır](cocuklarim.md) | [aynı zamanda veliyse](cocuklarim.md) | [aynı zamanda veliyse](cocuklarim.md) | [aynı zamanda veliyse](cocuklarim.md) | — | — | — | — |
| Velide her çocuk ayrı oturum | — | [bugün "Hepsi" + seçim; tasarımda ayrı oturumlar](velide-cocuk-oturumlari.md) | [veli portalına geçince aynı](velide-cocuk-oturumlari.md) | [veli portalına geçince aynı](velide-cocuk-oturumlari.md) | [veli portalına geçince aynı](velide-cocuk-oturumlari.md) | — | — | — | — |
| Öğrencide birden çok kurum | [okul ve dershane portalları](ogrencide-portallar.md) (tasarım) | [çocuğun her kurumu ayrı satır](ogrencide-portallar.md) (tasarım) | — | — | [öğrenciyi T.C. + doğum tarihiyle eşler](ogrencide-portallar.md) (tasarım) | [iki okulda tek hesap](ogrencide-portallar.md) (tasarım) | — | — | — |
| Bu okuldan ayrıl | — (okul çıkarır) | — (çocuğunu "Kaldır"ır) | ["Okuldan ayrıl"](okuldan-ayrilma.md) | [ayrılır](okuldan-ayrilma.md) (tasarım) | [bugün bırakamaz; tasarımda son müdür değilse](okuldan-ayrilma.md) | — | — | [müdürlüğü değiştirir](okuldan-ayrilma.md) | — |
| Henüz portalı olmayan yetişkin | — | [son çocuğu gidince](portalsiz-hesap.md) | [son okulundan ayrılınca](portalsiz-hesap.md) | [okul ekleyene kadar](portalsiz-hesap.md) (tasarım) | [okulu açılana kadar](portalsiz-hesap.md) | — | — | — | [hesap açınca buraya düşer](portalsiz-hesap.md) |
| Kapalı okulun portalı | — | — (veli portalı etkilenmez) | [portalı soluk, giremez](kapali-okul.md) | [öğretmen gibi](kapali-okul.md) (tasarım) | [müdürü kaldırılınca okul kapanır](kapali-okul.md) | — | — | [yeni müdür atayınca açılır](kapali-okul.md) | — |

Destek (tasarımdaki site rolü) bu bölümde yöneticiyle aynı yerde durur: portal listesi yok, müdür atar
([Site yönetimi](../yonetim/README.md)). Tahta hesabında (tasarım) "Portallarım" ve "+ Ekle" hiç görünmez
([Tahta hesabı](../tahta/README.md)).

Rol kapıları: [Öğrenci](../roller/ogrenci.md) · [Veli](../roller/veli.md) · [Öğretmen](../roller/ogretmen.md) ·
[Çalışan](../roller/calisan.md) · [Müdür](../roller/mudur.md) · [Servisçi](../roller/servisci.md) ·
[Yönetici](../roller/yonetici.md) · [Ziyaretçi](../roller/ziyaretci.md). Bütün özellikler: [features/](../README.md).

## İlgili öbür klasörler

- [Giriş ve hesap](../giris-hesap/README.md) — hesap açma, girişten sonra nereye düşüldüğü, okulun sayfasından giriş, "Bu
  cihazdaki oturumların", çıkış.
- [Öğretmenler ve çalışanlar](../ogretmenler-calisanlar/README.md) — müdürün kişi koduyla "Kodla ekle"si, rol atama, rolsüz
  çalışan, "Müdür yap", birden çok müdür, okuldan çıkarma.
- [Öğrenci hesapları](../hesaplar/README.md) — öğrencinin veli kodu, okulun veliyi bağlaması, nakil, öğrencinin portalını açma.
- [Site yönetimi](../yonetim/README.md) — yöneticinin kişi koduyla okul açması, müdürler, site ayarlarındaki iletişim bilgisi.
- [Hesap ayarları](../ayarlar/README.md) — "Portallarım" kartının durduğu sayfa, kişisel bilgiler, hesabımı sil.
- [Menü, üst şerit ve arama](../menu-ve-arama/README.md) — sol menü, "+ Ekle"nin durduğu üst şerit, profil menüsü, "Ana
  siteye dön".
- [Ana sayfa](../ana-sayfa/README.md) — her portalın kendi ana sayfası, velinin ana sayfası.
- [Excel aktarım](../excel-aktarim/README.md) — "Eşleyelim mi?" (öğrencide portalın kendiliğinden düşmesi).
- [Bildirimler](../bildirim/README.md) — "seni öğretmen olarak ekledi", "veli olarak hesabına bağlandı", çok kurumlu
  hesapta kurum adı.
- [Eğitim yılı](../egitim-yili/README.md) — velide yıl seçicinin seçili çocuğa göre olması, mezun portalı.
- [Çocuğumun telefonu](../aile/README.md) — velide seçili çocuğun telefonu.
- [Eğitim içerikleri](../egitim-icerikleri/README.md) — eğitmen portalı (tasarım).
- [KVKK ve gizlilik](../kvkk-ve-gizlilik/README.md) — kim neyi görür (okul yetişkinin e-postasını ve T.C.'sini görmez).

## Kod belgeleri

- Ön yüz: [public/js/parcalar/08c-kisilikler.md](../../public/js/parcalar/08c-kisilikler.md) (Portallarım, portal dışı ana
  sayfa, Ayarlar kartı, geçiş, "+ Ekle"), [public/js/parcalar/05-giris.md](../../public/js/parcalar/05-giris.md) (kişi kodu
  kutusu ve "Kopyala"), [public/js/parcalar/06-menu.md](../../public/js/parcalar/06-menu.md) (menünün başı, "+ Ekle"
  düğmesinin görünmesi), [public/js/parcalar/23-veli-ayarlar.md](../../public/js/parcalar/23-veli-ayarlar.md) (Çocuklarım,
  Ayarlar), [public/js/parcalar/27-veli-panel.md](../../public/js/parcalar/27-veli-panel.md) (velinin "Hepsi" şeridi),
  [public/js/parcalar/05b-sifre-zorunlu.md](../../public/js/parcalar/05b-sifre-zorunlu.md) (girişten sonra portal dışı),
  [public/js/parcalar/26-baslat.md](../../public/js/parcalar/26-baslat.md) (telefon bildiriminden geçiş),
  [public/js/parcalar/02b-cizimler.md](../../public/js/parcalar/02b-cizimler.md) (portal çizimleri); CSS
  `28-yetiskin-hesap.css` ([public/css/parcalar/CSS.md](../../public/css/parcalar/CSS.md)).
- Sunucu: [sunucu/bolumler/kisilik.md](../../sunucu/bolumler/kisilik.md) (`/api/kisilikler`, `/api/kisilik/...`),
  [sunucu/bolumler/kayit.md](../../sunucu/bolumler/kayit.md) (portal listesi, girişte nereye düşüleceği),
  [sunucu/bolumler/veli.md](../../sunucu/bolumler/veli.md) (veli koduyla çocuk bağlama),
  [sunucu/bolumler/hesaplar.md](../../sunucu/bolumler/hesaplar.md) (müdürün kodla eklemesi),
  [sunucu/bolumler/yonetici-okul.md](../../sunucu/bolumler/yonetici-okul.md) (yöneticinin kodla okul açması),
  [sunucu/ortak.md](../../sunucu/ortak.md) (kişi kodunun biçimi ve üretimi), [sunucu/api.md](../../sunucu/api.md) (rolsüz
  hesabın kapısı), [sunucu/veri/depo/kullanicilar.md](../../sunucu/veri/depo/kullanicilar.md) (rol satırları, veli bağları).
- Android (ayrı depo `Egitim-Evi-App`): `PortalSecici.java` (portallar penceresi), `EkleSayfasi.java` ("+ Ekle"); her birinin
  yanında aynı adlı `.md`.
- Testler: [testler/test-yetiskin.md](../../testler/test-yetiskin.md), [testler/test-kisi-kodu.md](../../testler/test-kisi-kodu.md),
  [testler/test-veli-coklu.md](../../testler/test-veli-coklu.md).
- Kullanıcıya dönük anlatım: [belge/KILAVUZ.md](../../belge/KILAVUZ.md) ("Hesap türleri ve portallar", "Veli tarafı", "Veli
  paneli").
