# Devamsızlık ve yoklama

Öğretmenin derste yoklama aldığı, öğrencinin ve velinin derse katılım kaydına baktığı, müdürün bir öğrencinin gününü ders ders görüp
düzelttiği bölüm. Bugün kodda: öğretmen **"Yoklama"** sayfasında dersini ve gününü seçip her öğrenciye **"Geldi · Gelmedi · Geç geldi ·
İzinli"** der ya da **"Ders Programım"**da süren dersin **"Şu an — yoklama al"** penceresinden **"Geldi · Gelmedi — izinli · Gelmedi —
izinsiz"** seçer; yalnız devamsızlıklar saklanır, işaretlenmeyen öğrenci derste sayılır. Gelmeyen, geç kalan ya da izinli yazılan
öğrenciye ve onaylı velilerine bildirim gider ("Çocuğunuz Elif Yılmaz bugün saat 09:20 Matematik dersine gelmedi (izinsiz)."). Öğrenci
**"Devamsızlığım"**da, veli **"Devamsızlık"**ta sayıları ve kayıtları görür; müdür **"Devamsızlık"**ta sınıf → öğrenci → gün seçip o
günün her ders saatini açılır kutudan düzeltir. Öğretmen kendi dersine, müdür her derse yoklama alır; okul bölümü **"Özellikler"**den
kapatabilir, geçmiş eğitim yılı salt okunurdur. Kullanıcının kararlaştırdığı tasarımda (Tasarım 1 önizlemesi ve tanımlar) ek olarak:
öğretmen yoklamaya **yalnız ders programından** girer — tablodaki derse basınca o haftanın o dersinin yoklaması açılır (geçmiş ders
görülür ve düzeltilir, süren ders alınır, gelecek ders "Bu dersin yoklaması … açılır" der), menüdeki ayrı "Yoklama" kalkar, saati
geçmiş ve yoklaması alınmamış ders programda parlar ve "!" alır, ana sayfa kutucuğu alınmamış ders sayısını gösterir (3 Ekim 19:20
kararı); öğrenciler işaretsiz başlar, kayıttan sonra velilere giden bildirimler listelenir, "Yoklama düzeltildi" bildirimleri gider;
her devamsızlık ekranında tarih aralığı, **"Gün gün | Ders ders"** görünümü ve sayılı süzgeç çipleri; günün durumunun ilk ve son derse
göre hesaplanması (geç geldi, yarım gün; yarım gün 0,5 gün sayılır); müdürün açılır listeyle düzeltmesi ve bunun işlem kaydına
yazılması; müdürün yoklama almaması; velide her çocuğun ayrı oturum olması (3 Ekim 19:10: ekranda tek kelime "oturum"); okulun
özürsüz devamsızlık sınırına yaklaşınca uyarı (3 Ekim 17:15 kararı).

## Alt özellikler

| Belge | Ne anlatır | Durum |
|---|---|---|
| [Ders yoklaması](ders-yoklamasi.md) | "Yoklama" sayfası: ders seç, gün seç, dört durum, "Hepsi geldi", "Yoklamayı kaydet" | Kodda var; tasarımda ayrı sayfa ve menü satırı kalkar (yoklama ders programından), kutucukta alınmamış ders sayısı; müdürde kalkar |
| [Ders programından yoklama](programdan-yoklama.md) | "Şu an — yoklama al" penceresi, üç büyük düğme, saatli bildirim | Kodda var; tasarımda yoklamanın tek girişi: haftalık tablonun her hücresi (geçmiş, şimdi, gelecek), önceki/sonraki ders, işaretsiz başlama, "Yoklama kaydedildi" penceresi |
| [Devamsızlığım (öğrenci ve veli)](devamsizligim.md) | Öğrencinin kendi dökümü, velinin çocuklarınınki, portalda "Devamsızlığı" | Kodda var; tasarımda ek olarak tarih aralığı ve görünüm, ana sayfa kutucuğu, velide her çocuk ayrı oturum, sınır şeridi |
| [Okulun devamsızlığı](okulun-devamsizligi.md) | Müdürün sınıf → öğrenci → gün ekranı, tek ders düzeltme, "Dönem özeti" | Kodda var; tasarımda ek olarak açılır listeyle anında düzeltme ve işlem kaydı, "Bugün dikkat", sınıf sekmesi, Excel raporu, arşiv yılı özeti |
| [Tarih aralığı, gün gün / ders ders, süzgeç](tarih-araligi-ve-gorunum.md) | Ortak ekran: başlangıç–bitiş, hazır aralıklar, görünüm, sayılı çipler, özet, açılır gün satırı | Tasarlandı — henüz kodda yok |
| [Günün durumu](gun-durumu.md) | İlk ve son derse göre "Geldi / Geç geldi / Yarım gün / Gelmedi / İzinli" ve gün sayımı | Tasarlandı — henüz kodda yok |
| ["Gelmedi" bildirimi](devamsizlik-bildirimi.md) | Öğrenciye ve veliye giden metinler, ne zaman gittiği | Kodda var; tasarımda ek olarak kısa başlık, düzeltme bildirimleri, "Devamsızlık" sekmesi |
| [Kim yoklama alır, kim kimi görür](yetki-ve-kapsam.md) | "Yoklama alır", "Okulun tüm devamsızlığını görür", daraltma, kapalı bölüm, geçmiş yıl, nakil | Kodda var; tasarımda ek olarak "Devamsızlığı görür"ün kapsamı, rolsüz çalışan, yeni şablonlar |
| [Yoklama alınmadı uyarısı](yoklama-alinmadi-uyarisi.md) | Ders programında parlayan hücre ve "!", kutucuktaki sayı, öğretmene ve müdüre bildirim, "Bugün dikkat" | Tasarlandı — henüz kodda yok |
| [Devamsızlık sınırı uyarısı](devamsizlik-siniri-uyarisi.md) | Okulun özürsüz devamsızlık sınırına yaklaşınca uyarı, "Devamsızlık sınırları", "Sınıra yaklaşanlar" | Tasarlandı — henüz kodda yok |

Okuma sırası:

- **Öğretmen:** [Ders programından yoklama](programdan-yoklama.md) → [Yoklama alınmadı uyarısı](yoklama-alinmadi-uyarisi.md) →
  [Ders yoklaması](ders-yoklamasi.md) → ["Gelmedi" bildirimi](devamsizlik-bildirimi.md) →
  [Kim yoklama alır, kim kimi görür](yetki-ve-kapsam.md) → [Tarih aralığı, gün gün / ders ders, süzgeç](tarih-araligi-ve-gorunum.md).
- **Öğrenci:** [Devamsızlığım](devamsizligim.md) → [Tarih aralığı, gün gün / ders ders, süzgeç](tarih-araligi-ve-gorunum.md) →
  [Günün durumu](gun-durumu.md) → ["Gelmedi" bildirimi](devamsizlik-bildirimi.md).
- **Veli:** [Devamsızlığım](devamsizligim.md) → ["Gelmedi" bildirimi](devamsizlik-bildirimi.md) → [Günün durumu](gun-durumu.md) →
  [Devamsızlık sınırı uyarısı](devamsizlik-siniri-uyarisi.md).
- **Müdür:** [Okulun devamsızlığı](okulun-devamsizligi.md) → [Kim yoklama alır, kim kimi görür](yetki-ve-kapsam.md) →
  [Ders yoklaması](ders-yoklamasi.md) → [Günün durumu](gun-durumu.md) → [Yoklama alınmadı uyarısı](yoklama-alinmadi-uyarisi.md) →
  [Devamsızlık sınırı uyarısı](devamsizlik-siniri-uyarisi.md).
- **Çalışan (müdür yardımcısı, rehber, nöbetçi):** [Kim yoklama alır, kim kimi görür](yetki-ve-kapsam.md) →
  [Okulun devamsızlığı](okulun-devamsizligi.md) → [Ders yoklaması](ders-yoklamasi.md).

## Rol tablosu

Hücre: o rolün bu alt özellikte yaptığı (bağlantı ilgili belgeye gider). "—": bu rol kullanmaz.

| Alt özellik | Öğrenci | Veli | Öğretmen | Çalışan | Müdür | Servisçi | Yönetici | Ziyaretçi |
|---|---|---|---|---|---|---|---|---|
| Ders yoklaması | [yoklaması alınır](ders-yoklamasi.md) | — | [kendi dersine yoklama alır; tasarımda sayfa kalkar](ders-yoklamasi.md) | [ek rolde seçilen derslere de alır; tasarımda rolsüz çalışan alamaz](ders-yoklamasi.md) | [her derse alır; tasarımda almaz](ders-yoklamasi.md) | — | — | — |
| Ders programından yoklama | — | — | [süren derste "Şu an — yoklama al"; tasarımda haftanın her dersi](programdan-yoklama.md) | [öğretmen gibi kendi dersinde](programdan-yoklama.md) | [ders veriyorsa adresle](programdan-yoklama.md) | — | — | — |
| Devamsızlığım | [kendi dökümünü görür](devamsizligim.md) | [çocuğunun dökümünü görür](devamsizligim.md) | [girdiği öğrencininkini portaldan görür](devamsizligim.md) | [yetkisine göre portaldan görür](devamsizligim.md) | [öğrenci portalından görür](devamsizligim.md) | — | — | — |
| Okulun devamsızlığı | — | — | [tasarımda sınıf sekmesinde salt okunur](okulun-devamsizligi.md) | ["Okulun tüm devamsızlığını görür"le bakar, kendi dersini düzeltir](okulun-devamsizligi.md) | [günü görür, tek dersi düzeltir](okulun-devamsizligi.md) | — | — | — |
| Tarih aralığı, gün gün / ders ders, süzgeç | [kendi kaydını süzer (tasarım)](tarih-araligi-ve-gorunum.md) | [oturumun çocuğunu süzer (tasarım)](tarih-araligi-ve-gorunum.md) | [girdiği sınıflar (tasarım)](tarih-araligi-ve-gorunum.md) | [yetkisinin sınıflarıyla (tasarım)](tarih-araligi-ve-gorunum.md) | [bütün sınıflar (tasarım)](tarih-araligi-ve-gorunum.md) | — | — | — |
| Günün durumu | [günlerini görür (tasarım)](gun-durumu.md) | [çocuğunun günlerini görür (tasarım)](gun-durumu.md) | [sınıfın günlerini görür (tasarım)](gun-durumu.md) | [görür (tasarım)](gun-durumu.md) | [görür; düzeltmeyle değişir (tasarım)](gun-durumu.md) | — | — | — |
| "Gelmedi" bildirimi | [bildirimi alır](devamsizlik-bildirimi.md) | [kendi metniyle alır](devamsizlik-bildirimi.md) | [kayıtla gönderir; tasarımda gidenleri görür](devamsizlik-bildirimi.md) | [öğretmen gibi](devamsizlik-bildirimi.md) | [düzeltmeyle gönderir](devamsizlik-bildirimi.md) | — | — | — |
| Kim yoklama alır, kim kimi görür | [yalnız kendini görür](yetki-ve-kapsam.md) | [yalnız bağlı çocuğunu görür](yetki-ve-kapsam.md) | [kendi dersi, girdiği öğrenciler](yetki-ve-kapsam.md) | [ek rolün yetkisi ve daraltması](yetki-ve-kapsam.md) | [yetkileri dağıtır, bölümü açar/kapatır](yetki-ve-kapsam.md) | — | — | — |
| Yoklama alınmadı uyarısı | — | — | [parlayan hücre, kutucuk, bildirim (tasarım)](yoklama-alinmadi-uyarisi.md) | [karar yok](yoklama-alinmadi-uyarisi.md) | [okulun alınmamış yoklamalarını görür (tasarım)](yoklama-alinmadi-uyarisi.md) | — | — | — |
| Devamsızlık sınırı uyarısı | [uyarı alır (tasarım)](devamsizlik-siniri-uyarisi.md) | [uyarı ve şerit (tasarım)](devamsizlik-siniri-uyarisi.md) | [sınıfın rehber öğretmeni uyarı alır (tasarım)](devamsizlik-siniri-uyarisi.md) | [rehber öğretmen uyarı alır (tasarım)](devamsizlik-siniri-uyarisi.md) | [sınırları girer, "Sınıra yaklaşanlar" (tasarım)](devamsizlik-siniri-uyarisi.md) | — | — | — |

Notlar:

- **Çalışan** sütunu: bugün kodda ek görevli kişi öğretmen hesabıyla bir ek rol taşır (ör. "Müdür Yardımcısı", "Rehber Öğretmen",
  "Nöbetçi Öğretmen"; üçünde de "Okulun tüm devamsızlığını görür" var, "Yoklama alır" yok). "Yoklama alır" hazır Öğretmen rolünden gelir;
  başka derslere ancak ek rolde ders/sınıf seçilerek verilir. Tasarımda (çalışan tanımı) öğretmen olmayan çalışan yoklamaya atanamaz;
  daraltma rol başınadır, rolün "Kapsam"ı (ders ve sınıflar) "Devamsızlığı görür"e de uygulanır. Ayrı "Yoklama" sayfası kalkınca başkasının dersine yoklama yetkisi olan kişinin o derse
  nereden gireceği kararlaştırılmadı ([Kim yoklama alır, kim kimi görür](yetki-ve-kapsam.md)).
- **Öğretmen ya da müdür olan veli** çocuğunun devamsızlığına menüdeki **"Velisi olduğum → Devamsızlığı"** ile, veli gibi bakar.
- **Servisçi** bu bölümü kullanmaz (yoklama uçları ona kapalı); kendi yoklaması ayrıdır ([Servis yoklama sayfası](../servis/yoklama-sayfasi.md)).
  **Sistem yöneticisi** okulsuz olduğu için devamsızlık uçlarını kullanamaz; tasarımda okul yedeğinde devamsızlık da yer alır
  ([Okul yedeği](../egitim-yili/okul-yedegi.md)). **Ziyaretçi** yalnız açılış sayfasındaki tanıtımı görür: "Devamsızlık — Geldi, gelmedi,
  izinli; veli aynı gün öğrenir." ([Açılış](../acilis-sayfasi/acilis.md)).
- Tasarımdaki **destek** ve **eğitmen** hesapları bu bölümü kullanmaz; **tahta** hesabı yoklama almaz (öneri), yalnız sınıfın bugünkü
  "Geldi/Gelmedi" durumunu görür ([Öğrenci seçme](../tahta/ogrenci-secme.md)).
- Okulda **"Devamsızlık" bölümü kapalıysa** bütün satırlar o okul için kapanır, kayıtlar silinmez ([Kapalı bölüm](../ozellikler/kapali-bolum.md)).
- **Etüt yoklaması** ve **servis yoklaması** ayrı kayıtlardır; bu bölümün sayılarına girmez.

Rol kapıları: [Öğrenci](../roller/ogrenci.md) · [Veli](../roller/veli.md) · [Öğretmen](../roller/ogretmen.md) ·
[Çalışan](../roller/calisan.md) · [Müdür](../roller/mudur.md) · [Servisçi](../roller/servisci.md) ·
[Yönetici](../roller/yonetici.md) · [Ziyaretçi](../roller/ziyaretci.md). Bütün özellikler: [features/](../README.md).

## İlgili öbür klasörler

- [Ders programı](../ders-programi/README.md) — yoklama düğmesi programdaki dersin kartında (tasarımda yoklamanın tek girişi: tablodaki
  hücre, parlayan "alınmadı" hücresi); günün dersleri ve okulun ders saatleri günün durumunu belirler.
- [Bildirimler](../bildirim/README.md) — "Çocuğunuz … dersine gelmedi", velinin bildirimleri, telefon bildirimi, "Devamsızlık" sekmesi.
- [Portallar](../portallar/README.md) — velide her çocuk ayrı oturum, Çocuklarım, öğrenci portalındaki "Devamsızlığı".
- [Ana sayfa](../ana-sayfa/README.md) — "Yoklama" ve "Devamsızlık" kutucukları, "Bugünkü derslerin", "Bugün dikkat".
- [Menü, üst şerit ve arama](../menu-ve-arama/README.md) — "Yoklama", "Devamsızlık", "Devamsızlığım", "Devamsızlığı" satırları.
- [Roller ve yetkiler](../roller-yetkiler/README.md) — "Yoklama alır", "Okulun tüm devamsızlığını görür", daraltma, şablonlar.
- [Okulun özellikleri](../ozellikler/README.md) — "Devamsızlık" bölümünü açma/kapatma.
- [Eğitim yılı](../egitim-yili/README.md) — yoklama yıla damgalanır; geçmiş yıl salt okunur; arşiv yılının devamsızlık özeti.
- [Sınıflar ve dersler](../siniflar-dersler/README.md) — derse öğretmen atama; tasarımda sınıf sayfasının "Devamsızlık" sekmesi.
- [Öğretmenler ve çalışanlar](../ogretmenler-calisanlar/README.md) — rolsüz çalışan, rol atama.
- [Öğrenci hesapları](../hesaplar/README.md) — öğrenci portalını açma, nakil.
- [Etütler](../etut/README.md) — etüt yoklaması (ayrı).
- [Servis](../servis/README.md) — servis yoklaması (ayrı), "Bugün servise binmedi" uyarısı.
- [Toplantılar ve uzaktan ders](../toplanti/README.md) — yoklamadaki "Görüşme başlat" ve "Gelmeyenlere Katıl bildirimi".
- [Tahta hesabı](../tahta/README.md) — sınıfın bugünkü yoklama durumu.
- [Excel aktarım](../excel-aktarim/README.md) — tasarımdaki "Devamsızlık raporu".
- [Mesajlar](../mesaj/README.md) — aynı 3 Ekim kararıyla gelen "Okumayanlara hatırlat" ve "Önemli" etiketi.
- [İşlem kaydı](../islem-kaydi/README.md) — yoklama bugün kayda yazılmaz; tasarımda müdürün düzeltmesi yazılır.
- [KVKK ve gizlilik](../kvkk-ve-gizlilik/README.md) — saklama süreleri, kim neyi görür.
- [Uygulama](../uygulama/README.md) — Android uygulamasına gelecek yoklama ve devamsızlık ekranları.
- [Eklentiler](../eklentiler/README.md) — kullanıcının örneği: yoklamada "Bugün kart okutuldu" satırı (kodlanmayacak, belgelenecek).

## Kod belgeleri

- Sunucu: [sunucu/bolumler/devamsizlik.md](../../sunucu/bolumler/devamsizlik.md) (`/api/devamsizlik`: `derslerim`, `yoklama`, `benim`,
  `ogrenci`, `gun`, `isaretle`, `ozet`; yetki ve bildirim), [sunucu/yetki.md](../../sunucu/yetki.md) (`devamsizlik.al`, `devamsizlik.gor`,
  şablonlar), [sunucu/bolumler/ozellikler.md](../../sunucu/bolumler/ozellikler.md) (bölüm kapısı), [sunucu/api.md](../../sunucu/api.md)
  (geçmiş yıl kapısı), [sunucu/bolumler/egitim-yili.md](../../sunucu/bolumler/egitim-yili.md) (yıl süzgeci),
  [sunucu/bolumler/okul.md](../../sunucu/bolumler/okul.md) (müdür ekranının sınıf ve öğrenci listesi),
  [sunucu/bolumler/ogretmen.md](../../sunucu/bolumler/ogretmen.md) (öğretmenin programı).
- Depo: [sunucu/veri/depo/devamsizlik.md](../../sunucu/veri/depo/devamsizlik.md) (`devamsizlik` tablosu), [sunucu/veri/depo/genel.md](../../sunucu/veri/depo/genel.md)
  (bildirim), [sunucu/veri/depo/siniflar.md](../../sunucu/veri/depo/siniflar.md) (program), [sunucu/veri/sema/SEMA.md](../../sunucu/veri/sema/SEMA.md).
- Ön yüz: [public/js/parcalar/18-devamsizlik.md](../../public/js/parcalar/18-devamsizlik.md) (Yoklama, Devamsızlığım, müdürün Devamsızlık
  ekranı), [public/js/parcalar/22-programim.md](../../public/js/parcalar/22-programim.md) (programdan yoklama penceresi),
  [public/js/parcalar/27-veli-panel.md](../../public/js/parcalar/27-veli-panel.md) (velinin Devamsızlık sayfası),
  [public/js/parcalar/25-tiklama.md](../../public/js/parcalar/25-tiklama.md) (yoklama düğmeleri), [public/js/parcalar/06-menu.md](../../public/js/parcalar/06-menu.md),
  [public/js/parcalar/08-ana-sayfa.md](../../public/js/parcalar/08-ana-sayfa.md); görünüm `20-devamsizlik.css` ve `22-cesitli.css`
  ([CSS.md](../../public/css/parcalar/CSS.md)).
- Testler: [testler/test-devamsizlik.md](../../testler/test-devamsizlik.md), [testler/test-bildirim.md](../../testler/test-bildirim.md),
  [testler/test-siniflarim.md](../../testler/test-siniflarim.md), [testler/test-egitim-yili.md](../../testler/test-egitim-yili.md),
  [testler/test-nakil.md](../../testler/test-nakil.md), [testler/test-ozellikler.md](../../testler/test-ozellikler.md),
  [testler/test-veli-coklu.md](../../testler/test-veli-coklu.md), [testler/yetki-denetimi.md](../../testler/yetki-denetimi.md),
  [testler/girdi-denetimi.md](../../testler/girdi-denetimi.md), [testler/buton-denetimi.md](../../testler/buton-denetimi.md).
- Kullanıcıya dönük anlatım: [belge/KILAVUZ.md](../../belge/KILAVUZ.md) ("Yoklama (ders programından)", "Veli paneli", "Okulun
  özellikleri", "Eğitim yılı"). Kılavuzda "Yoklama" sayfasının ve müdürün "Devamsızlık" ekranının ayrı bölümü yok. Kılavuzun
  "Yoklama (ders programından)" bölümü koddan dört yerde ayrılır: düğme "o gün başlamış" derste değil dersten 15 dakika önce çıkar,
  pencere "telefonda tam ekran" değil ekranın en çok %88'i yükseklikte açılır, üç seçenek öğrencinin "yanında" değil adının altında
  durur, "Yoklama alır yetkisi daraltılmamış biri" başkasının dersine yoklama ALAMAZ ([Ders programından yoklama](programdan-yoklama.md),
  [Kim yoklama alır, kim kimi görür](yetki-ve-kapsam.md)).
