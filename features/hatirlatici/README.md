# Hatırlatıcılar

Hatırlatıcılar, Eğitim Evi'ni kullanan herkesin (öğrenci, veli, öğretmen, ek görevli çalışan, müdür, servisçi, henüz okula bağlı
olmayan yetişkin ve sistem yöneticisi) kendine kurduğu kişisel hatırlatmalardır: bir başlık, isteğe bağlı bir açıklama, bir sıklık
(bir kez, her gün, haftanın seçilen günleri ya da ayda bir) ve bir saat. Menüdeki **Hatırlatıcılar** sayfasında kurar, düzenler,
durdurur ve silersin (kişi başına en çok 50); zamanı gelince sunucu sana "Hatırlatma: …" bildirimi gönderir, telefon bildirimini
açtıysan telefonuna da düşer. Saatler her zaman Türkiye saatidir; hatırlatıcını yalnız sen görürsün, öğrencinin kurduğu hatırlatma
velisine kopyalanmaz, okul bu bölümü kapatamaz ve yetişkin hesabında her okul portalının listesi ayrıdır. Bunların hepsi bugün kodda
var (kullanıcı 26 Eylül'de istedi: öğrenci kendine kurabilsin, öğretmen ve müdür de; başlığı, açıklaması ve sıklığı olsun).
Kullanıcının kararlaştırdığı tasarımda (Tasarım 1 önizlemesi ve tanımlar) ek olarak: hatırlatıcı satıra basınca açılan tek bir
pencereyle yönetilir (açıklama yazı düzenleyiciyle, "Telefona bildirim" ve "Hatırlatıcı açık" anahtarları, canlı "Sıradaki
hatırlatma" satırı), açık hatırlatıcılar takvimin günlerinde ve takvimin altındaki Ajanda'da görünür ("Hatırlatıcılarım" süzgeci),
müdürün ya da öğretmenin duyurusuyla gelen hatırlatıcılar ayrı bir tür olarak listene düşer, velide her çocuk oturumunun kendi
hatırlatıcıları olur, öğrenci ve velinin sayfasında ödev hatırlatma kuralları da durur, gönderilmiş tek seferlik hatırlatıcılar 30 gün
sonra silinir ve Android uygulamasına Hatırlatıcılar ekranı gelir.

## Alt özellikler

| Belge | Ne anlatır | Durum |
|---|---|---|
| [Hatırlatıcılar sayfası](hatirlaticilar-sayfasi.md) | Menüdeki yeri, liste, "3 / 50" sayacı, durum etiketleri ("Sonraki", "Durduruldu", "Hatırlatıldı", "Günü geçti"), sıra, arama | Kodda var; tasarımda ek olarak satıra basınca pencere, "Açık"/"Kapalı", "Ödev hatırlatmaları" grubu, servisçide ana sayfa kutucuğu |
| [Kurma, düzenleme ve silme](hatirlatici-kurma.md) | "Yeni hatırlatıcı" penceresi, alanlar, varsayılanlar, "Kaydet", düzenlemenin baştan başlatması, silme, bütün hata iletileri | Kodda var; tasarımda ek olarak tek pencere, yazı düzenleyicili açıklama, canlı "Sıradaki hatırlatma", pencereden silme |
| [Sıklık](siklik.md) | Bir kez · Her gün · Her hafta · Her ay; Türkiye saati, ayın 31'i, gece yarısı, tatil ayrımı yok | Kodda var; tasarımda ek olarak çipler ("Haftanın günleri", "Ayda bir") ve uzun gün adlı özetler |
| [Durdurma ve yeniden başlatma](durdurma-ve-baslatma.md) | "Durdur" / "Başlat", baştan sayma, günü geçmiş bir kezlik | Kodda var; tasarımda ek olarak "Hatırlatıcı açık" anahtarı |
| [Hatırlatma bildirimi](hatirlatma-bildirimi.md) | "Hatırlatma: …" metni, dakikalık denetim, 6 saatlik gecikme payı, zil, telefon, Android, veliye kopya yok | Kodda var; tasarımda ek olarak "Telefona bildirim" anahtarı, Android'de Hatırlatıcılar ekranı |
| [Takvimde ve ajandada](takvimde-ve-ajandada.md) | Ay görünümünde her tekrar, seçili günün listesi, Ajanda'da sıradaki zaman ve kalan süre, "Hatırlatıcılarım" süzgeci | Tasarlandı — henüz kodda yok |
| [Duyurudan gelen hatırlatıcılar](duyurudan-gelen-hatirlaticilar.md) | Duyuruyla gelen kayıt: 50'ye sayılmaz, yalnız kendin için kapatırsın, tarih değişince güncellenir, duyuru silinince kalkar | Tasarlandı — henüz kodda yok |
| [Kimler görür ve saklama](kimler-gorur-ve-saklama.md) | Yalnız sahibi, portal başına ayrı liste, ne olunca silinir, yedek, aydınlatma metni | Kodda var; tasarımda ek olarak velide çocuk oturumları, öğrencide kişiye bağlı, 30 gün, Verilerimi indir, eklentilere kapalı |

Okuma sırası:

- **Öğrenci:** [Hatırlatıcılar sayfası](hatirlaticilar-sayfasi.md) → [Kurma, düzenleme ve silme](hatirlatici-kurma.md) →
  [Sıklık](siklik.md) → [Hatırlatma bildirimi](hatirlatma-bildirimi.md) → [Durdurma ve yeniden başlatma](durdurma-ve-baslatma.md) →
  tasarımda [Takvimde ve ajandada](takvimde-ve-ajandada.md), [Duyurudan gelen hatırlatıcılar](duyurudan-gelen-hatirlaticilar.md).
- **Veli:** [Hatırlatıcılar sayfası](hatirlaticilar-sayfasi.md) → [Kurma, düzenleme ve silme](hatirlatici-kurma.md) →
  [Sıklık](siklik.md) → [Kimler görür ve saklama](kimler-gorur-ve-saklama.md) (çocuğunun hatırlatıcıları, çocuk oturumları) →
  [Hatırlatma bildirimi](hatirlatma-bildirimi.md) → tasarımda [Takvimde ve ajandada](takvimde-ve-ajandada.md).
- **Öğretmen ve çalışan:** [Hatırlatıcılar sayfası](hatirlaticilar-sayfasi.md) → [Kurma, düzenleme ve silme](hatirlatici-kurma.md) →
  [Kimler görür ve saklama](kimler-gorur-ve-saklama.md) (her okul portalı ayrı) → [Hatırlatma bildirimi](hatirlatma-bildirimi.md) →
  tasarımda [Duyurudan gelen hatırlatıcılar](duyurudan-gelen-hatirlaticilar.md).
- **Müdür:** [Kurma, düzenleme ve silme](hatirlatici-kurma.md) → [Kimler görür ve saklama](kimler-gorur-ve-saklama.md) → tasarımda
  [Duyurudan gelen hatırlatıcılar](duyurudan-gelen-hatirlaticilar.md) (duyuruya hatırlatma ekleme) →
  [Takvimde ve ajandada](takvimde-ve-ajandada.md).
- **Servisçi:** [Hatırlatıcılar sayfası](hatirlaticilar-sayfasi.md) → [Kurma, düzenleme ve silme](hatirlatici-kurma.md) →
  [Hatırlatma bildirimi](hatirlatma-bildirimi.md) (Android uygulaması).
- **Yönetici:** [Hatırlatıcılar sayfası](hatirlaticilar-sayfasi.md) (yönetim menüsü) → [Kurma, düzenleme ve silme](hatirlatici-kurma.md) →
  [Kimler görür ve saklama](kimler-gorur-ve-saklama.md) (yedekler).

## Rol tablosu

Hücre: o rolün bu alt özellikte yaptığı (bağlantı ilgili belgeye gider). "—": bu rol kullanmaz. "(tasarım)": henüz kodda yok.

| Alt özellik | Öğrenci | Veli | Öğretmen | Çalışan | Müdür | Servisçi | Yönetici |
|---|---|---|---|---|---|---|---|
| Hatırlatıcılar sayfası | [menüde "Takvim"in altında; tasarımda "Ödev hatırlatmaları" grubu da](hatirlaticilar-sayfasi.md) | [veli portalının listesi; tasarımda her çocuk oturumunda ayrı](hatirlaticilar-sayfasi.md) | [her okul portalında ayrı liste](hatirlaticilar-sayfasi.md) | [öğretmen hesabıyla; tasarımda rolsüz çalışanın menüsünde de](hatirlaticilar-sayfasi.md) | [müdür portalının listesi](hatirlaticilar-sayfasi.md) | [menünün son maddesi; tasarımda ana sayfada kutucuk](hatirlaticilar-sayfasi.md) | [yönetim menüsünde (`/admin`)](hatirlaticilar-sayfasi.md) |
| Kurma, düzenleme ve silme | [kendine kurar (ör. beden eğitimi kıyafeti)](hatirlatici-kurma.md) | [kendine kurar (ör. servis ücreti)](hatirlatici-kurma.md) | [kendine kurar (ör. yazılı kâğıtları)](hatirlatici-kurma.md) | [kendine kurar](hatirlatici-kurma.md) | [kendine kurar (ör. rapor)](hatirlatici-kurma.md) | [kendine kurar (ör. araç muayenesi)](hatirlatici-kurma.md) | [kendine kurar](hatirlatici-kurma.md) |
| Sıklık | [dört sıklık](siklik.md) | [dört sıklık (aylık işler)](siklik.md) | [dört sıklık](siklik.md) | [dört sıklık](siklik.md) | [dört sıklık](siklik.md) | [dört sıklık](siklik.md) | [dört sıklık](siklik.md) |
| Durdurma ve yeniden başlatma | [Durdur / Başlat; tasarımda anahtar](durdurma-ve-baslatma.md) | [aynı](durdurma-ve-baslatma.md) | [aynı; yalnız o portaldakini](durdurma-ve-baslatma.md) | [aynı](durdurma-ve-baslatma.md) | [aynı](durdurma-ve-baslatma.md) | [aynı](durdurma-ve-baslatma.md) | [aynı](durdurma-ve-baslatma.md) |
| Hatırlatma bildirimi | [yalnız kendisine; velisine kopya gitmez](hatirlatma-bildirimi.md) | [kendi kurduğu kendisine; çocuğununki gelmez](hatirlatma-bildirimi.md) | [kurduğu portalın zilinde; telefona hepsi](hatirlatma-bildirimi.md) | [öğretmen gibi](hatirlatma-bildirimi.md) | [kurduğu portalın zilinde](hatirlatma-bildirimi.md) | [zil ve Android uygulaması](hatirlatma-bildirimi.md) | [yönetimin zilinde](hatirlatma-bildirimi.md) |
| Takvimde ve ajandada | [ödevlerinin yanında (tasarım)](takvimde-ve-ajandada.md) | [çocuk oturumunun takviminde (tasarım)](takvimde-ve-ajandada.md) | [derslerinin yanında (tasarım)](takvimde-ve-ajandada.md) | [Takvim'inde (tasarım)](takvimde-ve-ajandada.md) | [okulun takviminin yanında (tasarım)](takvimde-ve-ajandada.md) | [Takvim'inde (tasarım)](takvimde-ve-ajandada.md) | — (takvimi yok) |
| Duyurudan gelen hatırlatıcılar | [duyurudan kayıt düşer, kendisi için kapatır (tasarım)](duyurudan-gelen-hatirlaticilar.md) | [öğrenciye giden duyuruda ona da düşer (tasarım)](duyurudan-gelen-hatirlaticilar.md) | [alıcıysa düşer; tek kişiye mesajda gönderir (tasarım)](duyurudan-gelen-hatirlaticilar.md) | [alıcıysa düşer (tasarım)](duyurudan-gelen-hatirlaticilar.md) | [duyuruya hatırlatma ekler (tasarım)](duyurudan-gelen-hatirlaticilar.md) | [alıcıysa düşer (tasarım)](duyurudan-gelen-hatirlaticilar.md) | — |
| Kimler görür ve saklama | [yalnız kendisi; tasarımda kişiye bağlı, mezuniyetten etkilenmez](kimler-gorur-ve-saklama.md) | [çocuğunun hatırlatıcılarını göremez; portal dışındakiyle aynı liste](kimler-gorur-ve-saklama.md) | [okuldan ayrılınca o portalınkiler silinir](kimler-gorur-ve-saklama.md) | [öğretmen gibi](kimler-gorur-ve-saklama.md) | [okulda kimsenin hatırlatıcısını göremez](kimler-gorur-ve-saklama.md) | [hesabı silinince gider](kimler-gorur-ve-saklama.md) | [başkasınınkini göremez; yedeklere girer](kimler-gorur-ve-saklama.md) |

Notlar:

- **Çalışan** sütunu: bugün ek görevli kişi (Müdür Yardımcısı, Rehber, Nöbetçi…) öğretmen hesabıyla bir ek rol taşır ve öğretmenin
  menüsündeki "Hatırlatıcılar"ı kullanır. Tasarımdaki rolsüz çalışanın portalında da Takvim ve Hatırlatıcılar vardır (çalışan tanımı)
  ([Rolsüz çalışan](../ogretmenler-calisanlar/rolsuz-calisan.md)).
- **Henüz okula bağlı olmayan yetişkin** (portal dışındaki yetişkin hesabı): menüsünde yalnız "Başlangıç" ve "Hatırlatıcılar" vardır;
  listesi veli portalındakiyle aynıdır ([Portalı olmayan yetişkin](../portallar/portalsiz-hesap.md)). Tasarım 1 önizlemesinde ise
  henüz oturumu olmayan hesabın menüsünde yalnız "Ana sayfa" var; tanımlarda bunun için karar yok (sorulacak,
  [Kimler görür ve saklama](kimler-gorur-ve-saklama.md)).
- **Destek, eğitmen ve tahta hesapları** (tasarım): Tasarım 1 önizlemesinde ve tanımlarda bu hesaplara Hatırlatıcılar verilmemiş;
  eğitmenin menüsünde yok, tahta hesabının menüsünde yalnız "Sınıflar" var (okula ait, kişiye bağlı olmayan kısıtlı hesap).
  **Giriş yapmamış ziyaretçi** hatırlatıcı kuramaz; açılış sayfasının
  özellik listesinde ve SSS'te tanıtılır ([Açılış sayfası](../acilis-sayfasi/acilis.md), [Sık sorulan sorular](../acilis-sayfasi/sss.md)).
- Öğrenci ve velinin **ödev hatırlatma kuralları** (tasarım) Hatırlatıcılar sayfasında ayrı bir grupta görünür ama hatırlatıcı
  değildir; ayrıntısı [Ödev hatırlatmaları](../odev/hatirlatmalar.md)'nda.

Rol kapıları: [Öğrenci](../roller/ogrenci.md) · [Veli](../roller/veli.md) · [Öğretmen](../roller/ogretmen.md) ·
[Çalışan](../roller/calisan.md) · [Müdür](../roller/mudur.md) · [Servisçi](../roller/servisci.md) ·
[Yönetici](../roller/yonetici.md). Bütün özellikler: [features/](../README.md).

## İlgili öbür klasörler

- [Bildirimler](../bildirim/README.md) — zil, telefon bildirimi, "Hatırlatma: …" metni, otomatik bildirimler, tasarımdaki sekmeler.
- [Takvim ve ajanda](../takvim/README.md) — tasarımda hatırlatıcıların takvimin günlerinde ve Ajanda'da görünmesi.
- [Mesajlar ve duyurular](../mesaj/README.md) — tasarımda duyurudan alıcıların ajandasına ve hatırlatıcısına ekleme.
- [Ödevler](../odev/README.md) — "yarın ödevin var" bildirimi ve tasarımdaki ödev hatırlatma kuralları.
- [Toplantılar](../toplanti/README.md) — toplantının kendi hatırlatması (1 gün ve 15 dakika önce); toplantı için kendi hatırlatıcını da
  kurabilirsin.
- [Portallar ve + Ekle](../portallar/README.md) — portal başına ayrı liste, velide her çocuk ayrı oturum, portalı olmayan yetişkin.
- [Menü, üst şerit ve arama](../menu-ve-arama/README.md) — menüdeki yeri, "İçerik Ara".
- [Hesap ayarları](../ayarlar/README.md) — telefon bildirimi, tasarımda "Ödev hatırlatmaları" ve "Verilerimi indir".
- [KVKK ve gizlilik](../kvkk-ve-gizlilik/README.md) — aydınlatma metnindeki "Kişisel hatırlatıcılar" satırı, saklama süreleri.
- [Uygulama](../uygulama/README.md) — Android uygulamasının bildirim yoklaması, tasarımda Hatırlatıcılar ekranı.
- [Yazı düzenleyici](../yazi-yazma/README.md) — tasarımda hatırlatıcının açıklaması.
- [Eğitim yılı ve yıl geçişi](../egitim-yili/README.md) — hatırlatıcılar yıla bağlı değil; mezunun hatırlatıcıları kalır.
- [Site yönetimi](../yonetim/README.md) — yönetim menüsündeki Hatırlatıcılar, site yedekleri.
- [Ana sayfa](../ana-sayfa/README.md) — tasarımda servisçinin "Hatırlatıcılar" kutucuğu.
- [Eklentiler](../eklentiler/README.md) — tasarımda okul eklentilerinin hatırlatıcılara erişememesi.
- [Dil ve çeviri](../dil/README.md) — tasarımda "Hatırlatıcılar" → "Reminders", gün kısaltmalarının çevirisi.

## Kod belgeleri

- Ön yüz: [public/js/parcalar/19h-hatirlaticilar.md](../../public/js/parcalar/19h-hatirlaticilar.md) (sayfa, pencere, durdur/başlat,
  sil), [public/js/parcalar/06-menu.md](../../public/js/parcalar/06-menu.md) (menüdeki yeri),
  [public/js/yonetim/09a-yonetim-paneli.md](../../public/js/yonetim/09a-yonetim-paneli.md) (yönetim menüsü),
  [public/js/parcalar/26-baslat.md](../../public/js/parcalar/26-baslat.md) (portal dışındaki yetişkinin ve servisçinin açılabilecek
  sayfaları), [public/js/parcalar/24-bildirim-arama-mobil.md](../../public/js/parcalar/24-bildirim-arama-mobil.md) (zil, arama).
- Sunucu: [sunucu/bolumler/hatirlatici.md](../../sunucu/bolumler/hatirlatici.md) (`/api/hatirlaticilar`, doğrulama, dakikalık
  gönderici), [sunucu/yardimci/hatirlatici-zaman.md](../../sunucu/yardimci/hatirlatici-zaman.md) (Türkiye saatiyle zaman hesabı),
  [sunucu/index.md](../../sunucu/index.md) (dakikalık sayaç), [sunucu/api.md](../../sunucu/api.md) (rolsüz kapısından serbest).
- Veri: [sunucu/veri/depo/hatirlaticilar.md](../../sunucu/veri/depo/hatirlaticilar.md) (`hatirlaticilar`, `hatirlatici_gunleri`,
  şema 024), [sunucu/veri/depo/genel.md](../../sunucu/veri/depo/genel.md) (bildirim yazma, veliye kopya),
  [sunucu/veri/json-aktarim.md](../../sunucu/veri/json-aktarim.md) (yedek), [sunucu/veri/sema/SEMA.md](../../sunucu/veri/sema/SEMA.md).
- Testler: [testler/test-hatirlatici.md](../../testler/test-hatirlatici.md),
  [testler/test-hatirlatici-zaman.md](../../testler/test-hatirlatici-zaman.md).
- Kullanıcıya dönük anlatım: [belge/KILAVUZ.md](../../belge/KILAVUZ.md) ("Hatırlatıcılar"). KILAVUZ kodla çelişmiyor; yalnız
  eksikleri var: "Herkes" listesinde sistem yöneticisi yok (yönetim menüsünde Hatırlatıcılar var) ve düzenleyip kaydetmenin durdurulmuş
  hatırlatıcıyı yeniden açtığı yazmıyor.
- Okulun otomatik hatırlatmaları (sabah ders özeti, "yarın ödevin var") bu bölümden ayrıdır: [sunucu/hatirlatma.md](../../sunucu/hatirlatma.md),
  [Otomatik bildirimler](../bildirim/otomatik-bildirimler.md).
