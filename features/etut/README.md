# Etütler

Ders saatleri dışında belli bir gün ve saatte yapılan çalışmaların (etüt) açıldığı, öğrencilerinin seçildiği, yoklamasının alındığı
ve öğrenciyle velinin takip ettiği bölüm. Bugün kodda: müdür ya da rolünde **"Etüt açar; gününü, saatini, öğretmenini ve
öğrencilerini düzenler"** yetkisi olan kişi **"Etütler"** sayfasında **"Etüt aç"** ile etüdün adını, haftanın gününü, başlangıç ve
bitiş saatini, yerini ve öğretmenini yazar; etüt her hafta aynı gün tekrarlanır. Satırdaki **"Öğrenciler"** ile okulun öğrencilerini
sınıf sınıf ya da tek tek seçer, **"Düzenle"** ve **"Sil"** ile değiştirir ya da kaldırır. Etüdün öğretmeni kendi etüdünün yoklamasını
etüt günü, başlangıçtan en erken 15 dakika önce **"Geldi · İzinli · İzinsiz"** diye alır; **"Bütün etütlerde yoklama alır"** yetkisi
olan (ör. Nöbetçi Öğretmen) her etütte, geçmiş günler dahil alır. Gelmeyen ya da izinli yazılan öğrenciye ve onaylı velilerine
bildirim gider; öğrenci **"Etütlerim"**de, veli **"Etütler"**de etütleri ve gelmediği günleri görür. Okul bölümü **"Özellikler"**den
kapatabilir. Kullanıcının kararlaştırdığı tasarımda (29 Eylül isteği, etüt planlama tanımı ve Tasarım 1 önizlemesi) ek olarak: etüt
sorumlusu **"Etüt ekle"** → **"Etüt planla"** penceresinde dersi (okulun dersleri ve "Genel / serbest çalışma"), öğretmeni (önce
dersin öğretmenleri) ve öğrencileri seçer, saati canlı **boş zaman ızgarasından** seçer (boş yeşil, kısmen dolu sarı, dolu kırmızı;
çakışmada onay ve işlem kaydı); etütler tarihli satırlarda durum rozetiyle ("Planlı", "Yoklama alındı", "Bitti") listelenir ve
satıra basınca **etüt ayrıntısı** açılır; yoklama bir pencerede alınır, herkes işaretlenmeden kaydedilmez ve giden bildirimler
listelenir; yeni etüt ve "Yarın … etüdün var" hatırlatması öğrenciye ve veliye bildirilir; velide her çocuk ayrı oturumdur; etüt
takvimde ve ajandada görünür; etüt görevi öğretmen olmayan çalışana da verilebilir.

## Alt özellikler

| Belge | Ne anlatır | Durum |
|---|---|---|
| [Etütler sayfası](etutler-sayfasi.md) | Personelin listesi: kim neyi görür, satır, düğmeler, arama | Kodda var; tasarımda ek olarak "Bu hafta" grubu, gün ve durum rozetleri, satıra basınca ayrıntı, "Etüt ekle" |
| [Etüt açma](etut-acma.md) | "Yeni etüt" penceresi: ad, gün, yer, saatler, öğretmen | Kodda var; tasarımda ek olarak "Etüt planla": ders, branşa göre öğretmen, öğrenciler ve saat aynı pencerede |
| [Etüdün öğrencilerini seçme](ogrenci-secme.md) | "Öğrenciler" penceresi: sınıf süzgeci, arama, "Görünenleri seç", 300 sınırı | Kodda var; tasarımda ek olarak planlama penceresinde sınıf çipleri, en az iki harfle arama, "… sınıfının hepsini ekle" |
| [Etüdü düzenleme ve silme](etudu-duzenleme-ve-silme.md) | "Etüdü düzenle" penceresi, "Sil" ve yoklamaların silinmesi | Kodda var |
| [Etüt planlama: boş zaman ızgarası](bos-zaman-izgarasi.md) | "Etüt planla": canlı ızgara (boş, kısmen dolu, dolu), çakışma onayı, kayıt | Tasarlandı — henüz kodda yok |
| [Etüt yoklaması](etut-yoklamasi.md) | Etüt günü "Geldi · İzinli · İzinsiz", 15 dakika kuralı, geçmiş günler, kilit iletileri | Kodda var; tasarımda ek olarak pencere, işaretsiz başlama, "Etüt henüz başlamadı", giden bildirimlerin listesi |
| [Etütlerim (öğrenci ve veli)](etutlerim.md) | Öğrencinin ve velinin dökümü, "Gelmediği günler" | Kodda var; tasarımda ek olarak tarihli satır ve kalan gün rozeti, ayrıntı, velide her çocuk ayrı oturum |
| [Etüt ayrıntısı](etut-ayrintisi.md) | Satıra basınca açılan pencere: gün, saat, öğretmen, yer, konu, durum, "Etüt yoklaması" | Tasarlandı — henüz kodda yok |
| [Etüt yetkileri ve hazır roller](etut-yetkileri.md) | İki etüt yetkisi, şablonlar, etüdün öğretmeninin hakkı, çalışan | Kodda var; tasarımda ek olarak çalışana etüt görevi, önizlemede tek "Etüt planlar" yetkisi (öneri) |
| [Etüt bildirimleri](etut-bildirimleri.md) | "… etüdü sana verildi", "Etüt: … — gelmedi" ve tasarımdaki yeni bildirimler | Kodda var; tasarımda ek olarak yeni etüt, "Yarın … etüdün var", düzeltme bildirimleri |

Okuma sırası:

- **Müdür:** [Etütler sayfası](etutler-sayfasi.md) → [Etüt açma](etut-acma.md) → [Etüdün öğrencilerini seçme](ogrenci-secme.md) →
  [Etüdü düzenleme ve silme](etudu-duzenleme-ve-silme.md) → [Etüt yetkileri ve hazır roller](etut-yetkileri.md) →
  [Etüt yoklaması](etut-yoklamasi.md) → [Boş zaman ızgarası](bos-zaman-izgarasi.md).
- **Öğretmen:** [Etütler sayfası](etutler-sayfasi.md) → [Etüt yoklaması](etut-yoklamasi.md) → [Etüt bildirimleri](etut-bildirimleri.md) →
  [Etüt yetkileri ve hazır roller](etut-yetkileri.md) → [Etüt ayrıntısı](etut-ayrintisi.md).
- **Çalışan (etüt sorumlusu, müdür yardımcısı, nöbetçi öğretmen):** [Etüt yetkileri ve hazır roller](etut-yetkileri.md) →
  [Etütler sayfası](etutler-sayfasi.md) → [Etüt açma](etut-acma.md) → [Etüdün öğrencilerini seçme](ogrenci-secme.md) →
  [Etüt yoklaması](etut-yoklamasi.md) → [Boş zaman ızgarası](bos-zaman-izgarasi.md).
- **Öğrenci:** [Etütlerim](etutlerim.md) → [Etüt bildirimleri](etut-bildirimleri.md) → [Etüt ayrıntısı](etut-ayrintisi.md).
- **Veli:** [Etütlerim](etutlerim.md) → [Etüt bildirimleri](etut-bildirimleri.md) → [Etüt ayrıntısı](etut-ayrintisi.md).

## Rol tablosu

Hücre: o rolün bu alt özellikte yaptığı (bağlantı ilgili belgeye gider). "—": bu rol kullanmaz.

| Alt özellik | Öğrenci | Veli | Öğretmen | Çalışan | Müdür | Servisçi | Yönetici | Ziyaretçi |
|---|---|---|---|---|---|---|---|---|
| Etütler sayfası | — | — | [verildiği etütleri görür, "Yoklama"](etutler-sayfasi.md) | [yetkisine göre bütün etütleri görür](etutler-sayfasi.md) | [bütün etütler, bütün düğmeler](etutler-sayfasi.md) | — | — | — |
| Etüt açma | — | — | [yetkisi varsa açar](etut-acma.md) | [etüt sorumlusu, müdür yardımcısı açar](etut-acma.md) | [açar](etut-acma.md) | — | — | — |
| Etüdün öğrencilerini seçme | [etüde eklenir](ogrenci-secme.md) | — | [yetkisi varsa seçer](ogrenci-secme.md) | [etüt yetkisiyle seçer](ogrenci-secme.md) | [seçer](ogrenci-secme.md) | — | — | — |
| Etüdü düzenleme ve silme | — | — | [yetkisi varsa düzenler, siler](etudu-duzenleme-ve-silme.md) | [etüt yetkisiyle düzenler, siler](etudu-duzenleme-ve-silme.md) | [düzenler, siler](etudu-duzenleme-ve-silme.md) | — | — | — |
| Boş zaman ızgarası | — | — | [etüt sorumlusuysa planlar (tasarım)](bos-zaman-izgarasi.md) | [planlar; rolsüz çalışan planlayamaz (tasarım)](bos-zaman-izgarasi.md) | [planlar (tasarım)](bos-zaman-izgarasi.md) | — | — | — |
| Etüt yoklaması | [yoklaması alınır](etut-yoklamasi.md) | [sonucunu bildirimle öğrenir](etut-yoklamasi.md) | [kendi etüdünde, etüt günü alır](etut-yoklamasi.md) | [nöbetçi, etüt sorumlusu: bütün etütlerde, geçmiş günler dahil](etut-yoklamasi.md) | [her etütte, her gün alır](etut-yoklamasi.md) | — | — | — |
| Etütlerim | [kendi etütleri ve gelmediği günler](etutlerim.md) | [çocuğunun etütleri](etutlerim.md) | — | — | — | — | — | — |
| Etüt ayrıntısı | [satıra basınca, "sen de varsın" (tasarım)](etut-ayrintisi.md) | [oturumun çocuğu, "Elif de var" (tasarım)](etut-ayrintisi.md) | [ayrıntı ve "Etüt yoklaması" (tasarım)](etut-ayrintisi.md) | [yetkisine göre (tasarım)](etut-ayrintisi.md) | [ayrıntı ve "Etüt yoklaması" (tasarım)](etut-ayrintisi.md) | — | — | — |
| Etüt yetkileri ve hazır roller | — | — | [ek rolle alır](etut-yetkileri.md) | [özel rol; tasarımda öğretmen olmadan da](etut-yetkileri.md) | [rol oluşturur, verir](etut-yetkileri.md) | — | — | — |
| Etüt bildirimleri | ["gelmedi" bildirimi; tasarımda yeni etüt ve "yarın"](etut-bildirimleri.md) | [çocuğunun adıyla alır](etut-bildirimleri.md) | ["… etüdü sana verildi"](etut-bildirimleri.md) | [öğretmen gibi](etut-bildirimleri.md) | [öğretmeni olduğu etütte alır](etut-bildirimleri.md) | — | — | — |

Notlar:

- **Çalışan** sütunu: bugün kodda ek görevli kişi öğretmen hesabıyla bir ek rol taşır ("Etüt Sorumlusu" ve "Müdür Yardımcısı"
  şablonlarında iki etüt yetkisi de var, "Nöbetçi Öğretmen"de yalnız "Bütün etütlerde yoklama alır"). Tasarımda (çalışan tanımı,
  onaylı) kişi okula "çalışan" olarak eklenir; rolsüz çalışan etütleri görmez, özel rolünde etüt yetkisi olan öğretmen olmasa da
  etüt işlerini yapar.
- **Öğretmen ya da müdür olan veli** bugün çocuğunun etütlerini menüsündeki "Velisi olduğum" bölümünden göremez (orada etüt satırı
  yok). Tasarımda (3 Ekim: hesap = kişi, oturum = rol) her çocuğu için ayrı veli oturumu olur ve etütleri orada görür.
- **Servisçi** bu bölümü hiç kullanmaz (uçlar ona kapalı). **Sistem yöneticisi** okulsuz olduğu için etüt sayfalarını kullanmaz;
  tasarımda okul yedeğinde etüt yoklaması da yer alır ([Okul yedeği](../egitim-yili/okul-yedegi.md)). **Ziyaretçi** yalnız açılış
  sayfasının sık sorulanlarında etüdün adını görür ("Eğitim Evi nedir?", "bazı bölümleri kapatabilir mi?" —
  [Sık sorulanlar](../acilis-sayfasi/sss.md)).
- Tasarımdaki **destek**, **eğitmen** ve **tahta** hesapları bu bölümü kullanmaz.
- Okulda **"Etütler" bölümü kapalıysa** bütün satırlar o okul için kapanır; etütler ve yoklamalar silinmez
  ([Kapalı bölüm](../ozellikler/kapali-bolum.md)).
- **Etüt yoklaması** ders devamsızlığından ayrıdır; devamsızlık sayılarına girmez ([Devamsızlık ve yoklama](../devamsizlik/README.md)).

Rol kapıları: [Öğrenci](../roller/ogrenci.md) · [Veli](../roller/veli.md) · [Öğretmen](../roller/ogretmen.md) ·
[Çalışan](../roller/calisan.md) · [Müdür](../roller/mudur.md) · [Servisçi](../roller/servisci.md) ·
[Yönetici](../roller/yonetici.md) · [Ziyaretçi](../roller/ziyaretci.md). Bütün özellikler: [features/](../README.md).

## İlgili öbür klasörler

- [Devamsızlık ve yoklama](../devamsizlik/README.md) — ders yoklaması (ayrı kayıt, ayrı kurallar), "Gelmedi" bildirimi.
- [Roller ve yetkiler](../roller-yetkiler/README.md) — iki etüt yetkisi, "Etüt Sorumlusu", "Müdür Yardımcısı", "Nöbetçi Öğretmen"
  şablonları; tasarımdaki "Etüt planlar".
- [Öğretmenler ve çalışanlar](../ogretmenler-calisanlar/README.md) — rolsüz çalışan, rol atama, okuldan çıkarılan öğretmenin etüdü.
- [Ders programı](../ders-programi/README.md) — tasarımda ızgaranın dayandığı okulun ders saatleri, program ve çakışma uyarısı.
- [Sınıflar ve dersler](../siniflar-dersler/README.md) — öğrenci seçimindeki sınıflar; tasarımda "Ders" listesi ve okulun kendi dersleri.
- [Bildirimler](../bildirim/README.md) — "… etüdü sana verildi", etüt yoklaması bildirimi, velinin bildirimleri, telefon bildirimi.
- [Takvim](../takvim/README.md) — tasarımda etütlerin takvimde ve ajandada görünmesi.
- [Mesajlar](../mesaj/README.md) — etüt değişikliğini mesajla duyurmak; "Durum" etiketi.
- [Portallar](../portallar/README.md) — velide her çocuk ayrı oturum, Çocuklarım.
- [Menü, üst şerit ve arama](../menu-ve-arama/README.md) — "Etütler", "Etütlerim" satırları ve "İçerik Ara".
- [Okulun özellikleri](../ozellikler/README.md) — "Etütler" bölümünü açma ve kapatma.
- [Eğitim yılı](../egitim-yili/README.md) — etütler yıla bağlı değil; tasarımda yeni yıl sihirbazında etütlerin taşınması, mezunlar.
- [Öğrenci hesapları](../hesaplar/README.md) — nakilde etüt listelerinden çıkma.
- [İşlem kaydı](../islem-kaydi/README.md) — "Etüt açıldı", "Etüt değiştirildi", "Etüt silindi", "Etüdün öğrencileri değişti", "Etüt
  yoklaması alındı"; tasarımda "etüt planladı".
- [KVKK ve gizlilik](../kvkk-ve-gizlilik/README.md) — etüt yoklaması kayıtları: kim görür, ne kadar saklanır.
- [Uygulama](../uygulama/README.md) — Android'de öğretmenin "Etüt yoklaması" (tanım), geri tuşunun etüt ayrıntısını kapatması.
- [Çok dil](../dil/README.md) — etüt ekranlarının çevirisi.

## Kod belgeleri

- Sunucu: [sunucu/bolumler/etut.md](../../sunucu/bolumler/etut.md) (`/api/etut`: liste, `adaylar`, `detay`, `kaydet`, `sil`,
  `ogrenciler`, `yoklama` GET/POST, `ogrenci`; yetki, 15 dakika kuralı, bildirim), [sunucu/yetki.md](../../sunucu/yetki.md)
  (`etut.yonet`, `etut.yoklama`, şablonlar), [sunucu/bolumler/ozellikler.md](../../sunucu/bolumler/ozellikler.md) (bölüm kapısı),
  [sunucu/bolumler/islem-kaydi.md](../../sunucu/bolumler/islem-kaydi.md) (işlem adları), [sunucu/iliskiler.md](../../sunucu/iliskiler.md)
  (`canSeeStudent`, gün adları), [sunucu/bolumler/okul.md](../../sunucu/bolumler/okul.md) (rol uçları).
- Depo: [sunucu/veri/depo/etutler.md](../../sunucu/veri/depo/etutler.md) (`etutler`, `etut_ogrencileri`, `etut_yoklamalari`; şema 013,
  [SEMA.md](../../sunucu/veri/sema/SEMA.md)), [sunucu/veri/depo/genel.md](../../sunucu/veri/depo/genel.md) (bildirim),
  [sunucu/veri/depo/ogrenci-gecmisi.md](../../sunucu/veri/depo/ogrenci-gecmisi.md) (nakilde listeden çıkarma).
- Ön yüz: [public/js/parcalar/18b-etut.md](../../public/js/parcalar/18b-etut.md) (Etütler, etüt penceresi, öğrenci seçimi, yoklama,
  Etütlerim), [public/js/parcalar/06-menu.md](../../public/js/parcalar/06-menu.md) (menü satırları, `SAYFA_OZELLIK`),
  [public/js/parcalar/27-veli-panel.md](../../public/js/parcalar/27-veli-panel.md) (velinin çocuk şeridi),
  [public/js/parcalar/19f-roller.md](../../public/js/parcalar/19f-roller.md) (rol penceresi); görünüm `20-devamsizlik.css`'in etüt
  bölümü ([CSS.md](../../public/css/parcalar/CSS.md)).
- Testler: [testler/test-etut.md](../../testler/test-etut.md), [testler/test-ozellikler.md](../../testler/test-ozellikler.md),
  [testler/test-nakil.md](../../testler/test-nakil.md), [testler/buton-denetimi.md](../../testler/buton-denetimi.md).
- Kullanıcıya dönük anlatım: [belge/KILAVUZ.md](../../belge/KILAVUZ.md) ("Etütler", "Roller ve yetkiler", "Okulun özellikleri").
