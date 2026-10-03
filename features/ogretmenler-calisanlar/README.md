# Öğretmenler ve çalışanlar

Okulda çalışan herkes Eğitim Evi'ne kendi hesabıyla gelir; okul onun adına hesap açmaz. Bugün kişi **"+ Ekle → Öğretmen"**deki
16 karakterlik **kişi kodunu** müdürüne verir, müdür **"Öğretmenler → Kodla ekle"**de kodu girer, kısaltılmış adı ("Ay** Ka**")
görüp ekler ve kişi o an okulun **öğretmeni** olur (onay beklenmez, kod tek kullanımlıktır). Müdür **Öğretmenler** listesinden
öğretmenin **"Hesap"** penceresini açar: branşını düzenler ya da onu **okuldan çıkarır** (öğretmenin hesabı ve öbür okulları durur,
verdiği ödev ve notlar okulda kalır); ek görevi (Müdür Yardımcısı, Etüt Sorumlusu…) **"Roller ve Yetkiler"** sayfasında verir.
Okulun tek müdürü vardır, onu yönetici atar; eski düzenden kalan başvurular için **"Onay bekleyenler"** bölümü durur. Kullanıcının
kararlaştırdığı tasarımda (çalışan tanımı, 27–29 Eylül kararları, Tasarım 1 önizlemesi): kişi okula **"çalışan"** olarak ve
**rolsüz** katılır ("Okul yönetimi sana henüz bir görev vermedi."); sayfanın adı **"Çalışanlar"** olur; müdür her kişinin penceresinden
görev verir (**Öğretmen** ya da özel roller, birden çok; **"+ Rol ata"**), bir çalışanı onay beklemeden, o an gelen doğrulama koduyla
**"Müdür yap"** ile müdür yapar; okulun **birden çok, eşit müdürü** olur, bir müdürü çıkarmak **ortak karardır** (iki müdür ya da
yönetici/destek), son müdür hiçbir yolla çıkarılamaz, müdür son değilse kendi isteğiyle ayrılır.

## Alt özellikler

| Belge | Ne anlatır | Durum |
|---|---|---|
| [Öğretmenler ve çalışanlar listesi](liste.md) | "Öğretmenler" (tasarımda "Çalışanlar") sayfası: kim görür, satırlar, arama, ana sayfa kutucuğu | Kodda var; tasarımda ek olarak "Çalışanlar", rolsüz/görev/müdür etiketleri, "Müdürler" bölümü, kişi penceresi |
| [Kodla ekleme](kodla-ekleme.md) | Kişi koduyla okula ekleme: kodu veren ve giren, kısaltılmış ad, sınırlar, iletiler | Kodda var; tasarımda ek olarak "çalışan" olarak (rolsüz) ekleme, "+ Ekle → Çalışan", canlı kod denetimi |
| [Hesap penceresi ve branş](hesap-penceresi.md) | "Hesap" penceresi: bağlı öğretmende branş, eski hesapta bilgiler ve şifre; tasarımdaki kişi penceresi | Kodda var; tasarımda ek olarak "Roller", "+ Rol ata", "Kullanıcı adı", "Müdürlük" |
| [Çalışana görev (rol) verme](rol-atama.md) | Bugün öğretmene ek rol; tasarımda Öğretmen dahil her görev, birden çok rol, rolü alma | Kodda var; tasarımda ek olarak kişi penceresinden görev, birden çok rol, rolsüze dönüş |
| [Rolsüz çalışan](rolsuz-calisan.md) | Görev verilmemiş çalışanın boş ekranı, kısıtlı menüsü, sunucu kapısı | Tasarlandı — henüz kodda yok |
| [Müdür yap](mudur-yapma.md) | Müdürün bir çalışanı onaysız, doğrulama koduyla müdür yapması; 7 gün kuralı | Tasarlandı — henüz kodda yok |
| [Birden çok müdür ve müdürlükten ayrılma](birden-cok-mudur.md) | Eşit müdürler, "Müdürler" bölümü, kendi isteğiyle ayrılma, son müdür, "Müdürü yok"; bugünkü tek müdür | Tasarlandı — henüz kodda yok |
| [Ortak karar](ortak-karar.md) | Bir müdürü müdürlükten çıkarma: istek, onay, ret, geri alma, 7 gün | Tasarlandı — henüz kodda yok |
| [Okuldan çıkarma](okuldan-cikarma.md) | Öğretmeni okuldan çıkarma: ne silinir, ne kalır, bildirim | Kodda var; tasarımda ek olarak her çalışan için ayrı iş, görev almaktan ayrı |
| [Onay bekleyenler](onay-bekleyenler.md) | Eski düzenden kalan öğretmenlik başvuruları: "Onayla" / "Reddet" | Kodda var |

Okuma sırası:

- **Müdür:** [Öğretmenler ve çalışanlar listesi](liste.md) → [Kodla ekleme](kodla-ekleme.md) → [Hesap penceresi](hesap-penceresi.md) →
  [Rol atama](rol-atama.md) → [Rolsüz çalışan](rolsuz-calisan.md) → [Müdür yap](mudur-yapma.md) →
  [Birden çok müdür](birden-cok-mudur.md) → [Ortak karar](ortak-karar.md) → [Okuldan çıkarma](okuldan-cikarma.md) →
  [Onay bekleyenler](onay-bekleyenler.md).
- **Çalışan (ek görevli ya da rolsüz):** [Kodla ekleme](kodla-ekleme.md) (kodunu vermek) → [Rolsüz çalışan](rolsuz-calisan.md) →
  [Rol atama](rol-atama.md) → yetkine göre [Öğretmenler ve çalışanlar listesi](liste.md), [Hesap penceresi](hesap-penceresi.md),
  [Okuldan çıkarma](okuldan-cikarma.md).
- **Öğretmen:** [Kodla ekleme](kodla-ekleme.md) → [Rol atama](rol-atama.md) (ek görev alınca) →
  [Okuldan çıkarma](okuldan-cikarma.md) → kendin ayrılmak için [Bu okuldan ayrıl](../portallar/okuldan-ayrilma.md).
- **Yönetici ve destek:** [Birden çok müdür](birden-cok-mudur.md) → [Ortak karar](ortak-karar.md) → [Müdür yap](mudur-yapma.md)
  (bildirim ve 7 günde geri alma).
- **Ziyaretçi:** [Kodla ekleme](kodla-ekleme.md) (SSS'teki "Öğretmen okula nasıl katılır?").

## Rol tablosu

Hücre: o rolün bu alt özellikte yaptığı (bağlantı ilgili belgeye gider). "—": bu rol kullanmaz. "(tasarım)": henüz kodda yok.

| Alt özellik | Müdür | Çalışan | Öğretmen | Yönetici | Destek | Ziyaretçi |
|---|---|---|---|---|---|---|
| Öğretmenler ve çalışanlar listesi | [görür, arar, ekler; tasarımda "Çalışanlar" ve "Müdürler"](liste.md) | [yetkisiyle görür; rolsüz görmez (tasarım)](liste.md) | — | [— (panelde yalnız sayılar)](liste.md) | — | — |
| Kodla ekleme | [kodu girer, kısaltılmış adı görüp ekler](kodla-ekleme.md) | ["ekler" yetkisiyle ekler; kendi kodunu verir](kodla-ekleme.md) | [kişi kodunu müdüre verir, bildirim alır](kodla-ekleme.md) | — | — | [SSS'te okur](kodla-ekleme.md) |
| Hesap penceresi ve branş | [branşı düzenler; eski hesapta bilgi ve şifre; tasarımda kişi penceresi](hesap-penceresi.md) | ["düzenler" yetkisiyle aynısı](hesap-penceresi.md) | [bilgilerini kendi Ayarlar'ından yönetir](hesap-penceresi.md) | — | — | — |
| Çalışana görev (rol) verme | [ek rol verir; tasarımda her görevi verir ve alır](rol-atama.md) | ["rol yönetir" yetkisiyle verir; görevi alır](rol-atama.md) | [ek rolü alır, bildirim gelir](rol-atama.md) | — | — | — |
| Rolsüz çalışan | [rolsüzü görür, görev verir (tasarım)](rolsuz-calisan.md) | [görev verilene kadar boş ekran (tasarım)](rolsuz-calisan.md) | — | — | — | — |
| Müdür yap | [çalışanı doğrulama koduyla müdür yapar (tasarım)](mudur-yapma.md) | [müdür yapılır (tasarım)](mudur-yapma.md) | [müdür yapılabilir (tasarım)](mudur-yapma.md) | [bildirim alır, 7 günde geri alır (tasarım)](mudur-yapma.md) | [bildirim alır, 7 günde geri alır (tasarım)](mudur-yapma.md) | — |
| Birden çok müdür ve ayrılma | [bugün bırakamaz; tasarımda "Müdürler", son değilse ayrılır](birden-cok-mudur.md) | [eski müdür çalışan olarak kalır (tasarım)](birden-cok-mudur.md) | — | [bugün müdürü siler; tasarımda müdür ekler, çıkarır](birden-cok-mudur.md) | [müdür ekler, çıkarır (tasarım)](birden-cok-mudur.md) | — |
| Ortak karar | [ister, onaylar, reddeder, geri alır (tasarım)](ortak-karar.md) | — | — | [beklemeden çıkarır (tasarım)](ortak-karar.md) | [beklemeden çıkarır, itirazı alır (tasarım)](ortak-karar.md) | — |
| Okuldan çıkarma | [öğretmeni okuldan çıkarır](okuldan-cikarma.md) | ["çıkarır" yetkisiyle çıkarır](okuldan-cikarma.md) | [çıkarılır, bildirim alır](okuldan-cikarma.md) | — | — | — |
| Onay bekleyenler | [eski başvuruyu onaylar ya da reddeder](onay-bekleyenler.md) | ["ekler, başvuru onaylar" yetkisiyle aynısı](onay-bekleyenler.md) | [eski başvurunun sonucunu bildirimle alır](onay-bekleyenler.md) | — | — | — |

Notlar:

- **Çalışan** sütunu: bugün kodda "çalışan", okulun öğretmen satırıyla bir ek rol taşıyan kişidir; bu bölümle ilgili yetkileri
  "Okula öğretmen ekler, başvuru onaylar", "Öğretmen bilgisi ve branşını düzenler" (hazır **Müdür Yardımcısı** şablonunda açık),
  "Öğretmeni okuldan çıkarır" ve "Rol oluşturur ve düzenler"dir. Tasarımda çalışan, okula kişi koduyla katılan herkestir; görev
  verilmeyen **rolsüz çalışan** okulun duyuruları, Mesajlar, Takvim, Hatırlatıcılar ve Ayarlar dışında hiçbir bölüme giremez,
  öğretmen olmayan çalışan da özel rolündeki yetkilerle çalışır.
- **Öğretmen** sütunu: ek yetkisi olmayan öğretmen. Bu sayfaları görmez; kodunu verir, görev alır, çıkarılabilir ya da kendi ayrılır
  ([Bu okuldan ayrıl](../portallar/okuldan-ayrilma.md)).
- **Yönetici ve destek** okulun içindeki sayfaları görmez; müdürleri yönetim panelinden yönetir. Destek rolü ve /duzenle sayfaları
  tasarımdadır ([Paneller](../yonetim/paneller.md), [Destek ekibi](../destek/destek-ekibi.md)).
- **Öğrenci, veli, servisçi, eğitmen ve tahta hesabı** bu bölümü kullanmaz. Öğrenci ve veli çıkarılan öğretmenin derslerini
  öğretmensiz görür; öğrencinin okuldan çıkarılması ayrı iştir ([Öğrenciyi okuldan çıkarma](../hesaplar/ogrenciyi-okuldan-cikarma.md)).
- Tasarımdaki hesap/oturum dilinde (3 Ekim kararı) "portal" sözü "oturum" olur; belgeler bugünkü sözleri kullanır.

Rol kapıları: [Müdür](../roller/mudur.md) · [Çalışan](../roller/calisan.md) · [Öğretmen](../roller/ogretmen.md) ·
[Yönetici](../roller/yonetici.md) · [Ziyaretçi](../roller/ziyaretci.md). Bütün özellikler: [features/](../README.md).

## İlgili öbür klasörler

- [Portallar ve + Ekle](../portallar/README.md) — kişi kodu, "+ Ekle → Öğretmen" (tasarımda "Çalışan"), Portallarım, "Bu okuldan
  ayrıl", kapalı okulun portalı.
- [Roller ve yetkiler](../roller-yetkiler/README.md) — rol oluşturma ve düzenleme, hazır şablonlar, yetki listesi, ders ve sınıf
  daraltması.
- [Öğrenci hesapları](../hesaplar/README.md) — öğrencinin "Hesap" penceresi, şifre işlemleri, öğrenciyi okuldan çıkarma.
- [Sınıflar ve dersler](../siniflar-dersler/README.md) — derse öğretmen atama, özel branş ve ders.
- [Ders programı](../ders-programi/README.md) — öğretmensiz kalan dersler; programda yalnız Öğretmen görevi olanlar.
- [Giriş ve hesap](../giris-hesap/README.md) — kayıt (rol seçilmez), iki adımlı giriş, doğrulama uygulaması.
- [Hesap ayarları](../ayarlar/README.md) — öğretmenin kendi bilgileri, hesabımı sil, e-posta ekleme önerisi.
- [Site yönetimi](../yonetim/README.md) — okul açma, Müdürler, tasarımda paneller, okul gezgini ve /duzenle sayfaları.
- [Destek talepleri](../destek/README.md) — destek ekibi, çıkarılan müdürün itirazı.
- [Eğitim yılı](../egitim-yili/README.md) — önemli işlerde çift doğrulama.
- [İşlem kaydı](../islem-kaydi/README.md) — "Öğretmen kişi koduyla okula eklendi", "Öğretmen okuldan çıkarıldı", "Kullanıcıya rol
  atandı", "Öğretmen onaylandı", "Öğretmen okuldan ayrıldı".
- [Bildirimler](../bildirim/README.md) — eklenme, rol, çıkarılma, başvuru bildirimleri.
- [Ana sayfa](../ana-sayfa/README.md) ve [Menü, üst şerit ve arama](../menu-ve-arama/README.md) — "Öğretmenler" (tasarımda
  "Çalışanlar") kutucuğu ve menü satırı, çalışanın ana sayfası.
- [Ödevler](../odev/README.md), [Etütler](../etut/README.md), [Hatırlatıcılar](../hatirlatici/README.md) — çıkarılan öğretmenin
  ödevleri, etütleri ve hatırlatıcıları.
- [KVKK ve gizlilik](../kvkk-ve-gizlilik/README.md) — okulun öğretmende neyi görmediği.
- [Excel aktarım](../excel-aktarim/README.md) — öğretmenin dosyayla eklenmemesi, "Öğretmen listesi" dışarı aktarımı.
- [Açılış sayfası](../acilis-sayfasi/README.md) — SSS.

## Kod belgeleri

- Ön yüz: [public/js/parcalar/10-mudur.md](../../public/js/parcalar/10-mudur.md) (Öğretmenler sayfası, "Onay bekleyenler"),
  [public/js/parcalar/10b-hesaplar.md](../../public/js/parcalar/10b-hesaplar.md) (kodla ekleme penceresi, "Hesap" penceresi, branş,
  okuldan çıkarma), [public/js/parcalar/19f-roller.md](../../public/js/parcalar/19f-roller.md) ("Öğretmenlerin ek rolleri"),
  [public/js/parcalar/08c-kisilikler.md](../../public/js/parcalar/08c-kisilikler.md) ("+ Ekle → Öğretmen", "Okuldan ayrıl"),
  [public/js/parcalar/25-tiklama.md](../../public/js/parcalar/25-tiklama.md) (`ogretmen-onay`),
  [public/js/parcalar/06-menu.md](../../public/js/parcalar/06-menu.md), [public/js/parcalar/08-ana-sayfa.md](../../public/js/parcalar/08-ana-sayfa.md),
  [public/js/parcalar/05-giris.md](../../public/js/parcalar/05-giris.md) (kişi kodu kutusu),
  [public/js/yonetim/09-yonetici.md](../../public/js/yonetim/09-yonetici.md) (yöneticinin Müdürler ve Okullar sayfaları).
- Sunucu: [sunucu/bolumler/hesaplar.md](../../sunucu/bolumler/hesaplar.md) (`ogretmen-bul`, `ogretmen-ekle`, `hesap`, `hesap-guncelle`,
  `hesap-sil`), [sunucu/bolumler/okul.md](../../sunucu/bolumler/okul.md) (`teachers`, `teacher-decide`, `role-assign`, `ozet`),
  [sunucu/bolumler/kisilik.md](../../sunucu/bolumler/kisilik.md) (kişi kodu, okuldan ayrılma, müdürün bırakamaması),
  [sunucu/bolumler/yonetici.md](../../sunucu/bolumler/yonetici.md), [sunucu/bolumler/yonetici-okul.md](../../sunucu/bolumler/yonetici-okul.md)
  (okul açma, müdür silme), [sunucu/bolumler/kisi-aktarim.md](../../sunucu/bolumler/kisi-aktarim.md),
  [sunucu/bolumler/islem-kaydi.md](../../sunucu/bolumler/islem-kaydi.md), [sunucu/yetki.md](../../sunucu/yetki.md) (yetkiler,
  şablonlar, yetki birleşimi).
- Depo: [sunucu/veri/depo/kullanicilar.md](../../sunucu/veri/depo/kullanicilar.md), [sunucu/veri/depo/roller.md](../../sunucu/veri/depo/roller.md),
  [sunucu/veri/depo/okullar.md](../../sunucu/veri/depo/okullar.md), [sunucu/veri/sema/SEMA.md](../../sunucu/veri/sema/SEMA.md).
- Testler: [testler/test-yetiskin.md](../../testler/test-yetiskin.md), [testler/test-kisi-kodu.md](../../testler/test-kisi-kodu.md),
  [testler/test-yonetim.md](../../testler/test-yonetim.md), [testler/test-cakisma.md](../../testler/test-cakisma.md),
  [testler/test-rol.md](../../testler/test-rol.md), [testler/yetki-denetimi.md](../../testler/yetki-denetimi.md),
  [testler/buton-denetimi.md](../../testler/buton-denetimi.md).
- Kullanıcıya dönük anlatım: [belge/KILAVUZ.md](../../belge/KILAVUZ.md) ("Hesap türleri ve portallar", "Admin: müdür yönetimi",
  "Admin: okul açma", "Roller ve yetkiler", "Müdür yetkileri").
