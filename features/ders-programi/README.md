# Ders programı

Okulun haftalık ders programı. Müdür (ya da "Ders programını düzenler" yetkisi verilen kişi) her sınıfın derslerini Pazartesi'den
Pazar'a, okulunun zil düzenine göre istediği saat aralığıyla yerleştirir; aynı öğretmen ya da aynı sınıf aynı saate iki kez düşerse
"çakışma" diye uyarılır; programı Excel dosyasından toplu yükleyebilir ya da Excel olarak indirebilir. Öğretmen kendi derslerini
"Ders Programım"da, öğrenci sınıfının, veli çocuğunun programını "Ders Programı"nda gün gün ya da haftalık görür; öğretmenin bugünkü
dersinin kartında yoklama düğmesi çıkar, sabah da "Bugün 4 dersin var…" özeti gelir. Bunların hepsi bugün kodda var; bölüm
Özellikler'den kapatılamaz, servisçi, sistem yöneticisi ve ziyaretçi bu bölümü kullanmaz. Tasarımda değişenler (Tasarım 1 önizlemesi
ve kullanıcının 28–29 Ağustos, 26 Eylül, 1 ve 2 Ekim sözleri): dersler okulun ders saatleriyle "1. ders 08:30–09:10" diye yazılır;
müdürün ekranı haftalık bir ızgaradır (günün yanındaki "+", "Dersler" listesinden derse basıp boş saate koyma ya da sürükleme, taşıma,
onaylı kaldırma), önizlemede çakışan yere ders konamaz ve program "Kaydet ve yayımla" ile duyurulur; Excel'den yükleme dosyadaki
sınıfların programını değiştirir; öğrencide "Günlük" (ayrıntılı) | "Haftalık" (yalnız ders adı), öğretmende tek haftalık tablo ve
hücreden yoklama; müdürün kendi dersleri yok.

## Alt özellikler

| Belge | Ne anlatır | Durum |
|---|---|---|
| [Ders programı kurma](program-kurma.md) | Sınıf seçme, ders saati ekleme/düzenleme/silme, "Bu sınıfın dersleri" sayacı, yetkiler; tasarımdaki ızgara | Kodda var; tasarımda ek olarak ızgara, Dersler listesi, sürükleme, "Kaydet ve yayımla" |
| [Gün ve hafta görünümü](gun-ve-hafta-gorunumu.md) | "Gün" / "Hafta", gün şeridi, "Ders N" sıraları, "[boş]", "şimdi"; tasarımdaki Günlük / Haftalık | Kodda var; tasarımda ek olarak Günlük (ayrıntılı) / Haftalık (yalnız ders adı) |
| [Okulun ders saatleri](ders-saatleri.md) | "1. ders 08:30–09:10": zil düzeninin okul ayarı olması ve kullanıldığı ekranlar | Tasarlandı — henüz kodda yok |
| [Çakışma uyarısı](cakisma-uyarisi.md) | Öğretmen ve sınıf çakışması, kaydederken uyarı, okulun çakışma listesi, öğretmenin kutusu | Kodda var; tasarımda ek olarak engel, "!" ünlemi |
| [Programı Excel'den kurma](excelden-program.md) | Şablon, sütunlar, "Kontrol et" raporu, hata iletileri, 300 satır sınırı | Kodda var; tasarımda ek olarak "Ders programı yükle" penceresi, "Geçerli" tarihi, programı değiştirme |
| [Programı Excel olarak indirme](programi-indirme.md) | `ders-programi.xlsx`, sütunlar, geri yükleme | Kodda var; tasarımda ek olarak sınıf ya da öğretmen seçimi |
| [Programı yayımlama ve haber verme](yayimlama-ve-bildirim.md) | Öğretmene giden "Ders programına yeni ders saatlerin eklendi…", sabah özeti; tasarımdaki "Kaydet ve yayımla" | Kodda var; tasarımda ek olarak taslak / yayımlandı ve herkese bildirim |
| [Ders programım](programim.md) | Öğretmenin "Ders Programım"ı (yoklama düğmesi), öğrencinin ve velinin "Ders Programı" | Kodda var; tasarımda ek olarak Günlük / Haftalık, öğretmende tek tablo, ana sayfada "Bugünkü dersler" |

Okuma sırası: herkes önce [Ders programım](programim.md) ve [Gün ve hafta görünümü](gun-ve-hafta-gorunumu.md); öğretmen ayrıca
[Çakışma uyarısı](cakisma-uyarisi.md) ve [Programı yayımlama ve haber verme](yayimlama-ve-bildirim.md); programı kuran kişi
[Ders programı kurma](program-kurma.md), [Çakışma uyarısı](cakisma-uyarisi.md), [Programı Excel'den kurma](excelden-program.md) ve
[Programı Excel olarak indirme](programi-indirme.md); tasarımı izleyen [Okulun ders saatleri](ders-saatleri.md).

## Rol tablosu

Hücre: o rolün bu alt özellikte yaptığı (bağlantı ilgili belgenin o rolün bölümüne gider). "—": bu rol kullanmaz.

| Alt özellik | Öğrenci | Veli | Öğretmen | Çalışan | Müdür | Servisçi | Yönetici | Ziyaretçi |
|---|---|---|---|---|---|---|---|---|
| Ders programı kurma | — | — | ["Ders programını düzenler" yetkisiyle kurar](program-kurma.md#öğretmen) | [özel rolünde yetki varsa kurar](program-kurma.md#çalışan) | [her sınıfın programını kurar](program-kurma.md#müdür) | — | — (bölüme giremez) | — |
| Gün ve hafta görünümü | [sınıfının programına bakar](gun-ve-hafta-gorunumu.md#öğrenci) | [çocuğununkine bakar](gun-ve-hafta-gorunumu.md#veli) | [kendi programına bakar](gun-ve-hafta-gorunumu.md#öğretmen) | [kurarken kullanır](gun-ve-hafta-gorunumu.md#müdür-ve-programı-kuran-çalışan) | [kurarken kullanır](gun-ve-hafta-gorunumu.md#müdür-ve-programı-kuran-çalışan) | — | — | — |
| Okulun ders saatleri (tasarım) | ["1. ders" diye görür](ders-saatleri.md#öğrenci) | [aynısını görür](ders-saatleri.md#veli) | [programda, yoklamada, bildirimde görür](ders-saatleri.md#öğretmen) | [ızgarada kullanır](ders-saatleri.md#çalışan) | [ızgarada ve saat çiplerinde kullanır](ders-saatleri.md#müdür) | — | — | — |
| Çakışma uyarısı | [görmez](cakisma-uyarisi.md#öğrenci-ve-veli) | [görmez](cakisma-uyarisi.md#öğrenci-ve-veli) | [kendi çakışmasını görür, müdüre bildirir](cakisma-uyarisi.md#öğretmen) | [uyarıyı ve okulun listesini görür](cakisma-uyarisi.md#çalışan) | [uyarıyı ve okulun listesini görür, çözer](cakisma-uyarisi.md#müdür) | — | — | — |
| Programı Excel'den kurma | — | — | [aktarım ve program yetkisiyle yükler](excelden-program.md#öğretmen) | [özel rolle yükler](excelden-program.md#çalışan) | [yükler](excelden-program.md#müdür) | — | — | — |
| Programı Excel olarak indirme | — | — | [aktarım yetkisiyle indirir](programi-indirme.md#öğretmen-ve-çalışan) | [aktarım yetkisiyle indirir](programi-indirme.md#öğretmen-ve-çalışan) | [indirir](programi-indirme.md#müdür) | — | — | — |
| Programı yayımlama ve haber verme | [bugün bildirim yok; tasarımda alır](yayimlama-ve-bildirim.md#öğrenci) | [bugün bildirim yok](yayimlama-ve-bildirim.md#veli) | [ders eklenince ve sabah bildirim alır](yayimlama-ve-bildirim.md#öğretmen) | [ekler; tasarımda yayımlar](yayimlama-ve-bildirim.md#çalışan) | [ekler; tasarımda yayımlar](yayimlama-ve-bildirim.md#müdür) | — | — | — |
| Ders programım | [menüde "Ders Programı"](programim.md#öğrenci) | [çocuğun portalında "Ders Programı"](programim.md#veli) | ["Ders Programım" ve yoklama düğmesi](programim.md#öğretmen) | [Öğretmen rolüyle](programim.md#çalışan) | [menüde yok; ders veriyorsa bildirimden açılır](programim.md#müdür) | — | — | — |

Çalışan sütunu: bugün kodda ek görevli kişi öğretmen hesabı ve bir özel rolle (ör. "Müdür Yardımcısı") çalışır; tasarımda kişi okula
"çalışan" olarak eklenir, öğretmen olmasa da özel rolündeki yetkiyle programı kurar ama derse öğretmen olarak yazılamaz; rolsüz çalışan
bu bölümü görmez. Tahta hesabı (tasarım) sınıf seçince o sınıfın bugünkü derslerini görür ([Sınıf seçme](../tahta/sinif-secme.md));
eğitmen ve destek hesapları bu bölümü kullanmaz.

Rol kapıları: [Öğrenci](../roller/ogrenci.md) · [Veli](../roller/veli.md) · [Öğretmen](../roller/ogretmen.md) ·
[Çalışan](../roller/calisan.md) · [Müdür](../roller/mudur.md) · [Servisçi](../roller/servisci.md) ·
[Yönetici](../roller/yonetici.md) · [Ziyaretçi](../roller/ziyaretci.md). Bütün özellikler: [features/](../README.md).

## İlgili öbür klasörler

- [Sınıflar ve dersler](../siniflar-dersler/README.md) — sınıf açma, derse haftalık saat ve öğretmen verme (programın ham maddesi), sınıf
  sayfasının "Ders programı" sekmesi.
- [Devamsızlık](../devamsizlik/README.md) — ders programından yoklama; tasarımda günün durumu ilk ve son derse göre.
- [Bildirimler](../bildirim/README.md) — "Ders programına yeni ders saatlerin eklendi…", sabah özeti, tasarımda dersten 10 dakika önce.
- [Excel aktarım](../excel-aktarim/README.md) — programın içeri ve dışarı aktarımı.
- [Roller ve yetkiler](../roller-yetkiler/README.md) — "Ders programını düzenler", sınıfla daraltma, hazır şablonlar.
- [Eğitim yılı](../egitim-yili/README.md) — geçmiş yılda salt okunur program, yeni yılda programı kopyalama.
- [Etüt](../etut/README.md) — boş zaman ızgarası programdaki dolu saatleri okur.
- [Sınav](../sinav/README.md) — sınav planlamada ders numarası.
- [Toplantı](../toplanti/README.md) ve [Tahta](../tahta/README.md) — "şu an" dersinden uzaktan ders, tahtanın sınıf programı.
- [Ana sayfa](../ana-sayfa/README.md) — müdürün "Ders Programı" kutucuğu; tasarımda "Bugünkü dersler".
- [Menü ve arama](../menu-ve-arama/README.md) — menüdeki "Ders Programı" / "Ders Programım", sayfa içi arama.
- [Portallar](../portallar/README.md) ve [Hesaplar](../hesaplar/README.md) — velinin çocuk portalı, personelin öğrenci portalı.
- [Öğretmenler ve çalışanlar](../ogretmenler-calisanlar/README.md) — çalışan olarak ekleme, rol atama.
- [İşlem kaydı](../islem-kaydi/README.md) — "Excel ile ders programı eklendi".
- [Uygulama](../uygulama/README.md) — Android uygulamasında program bugün yok, planlı.
- [Dil ve çeviri](../dil/README.md) — gün adlarının ve ekran metinlerinin çevrilmesi.

## Kod belgeleri

- Ön yüz: [public/js/parcalar/21-ders-programi.md](../../public/js/parcalar/21-ders-programi.md) (müdürün sayfası ve ortak çizim),
  [public/js/parcalar/22-programim.md](../../public/js/parcalar/22-programim.md) (kişinin programı ve yoklama penceresi),
  [public/js/parcalar/20-siniflar.md](../../public/js/parcalar/20-siniflar.md) (sınıflar, dersler, "Ders programı" düğmesi),
  [public/js/parcalar/15-aktarim.md](../../public/js/parcalar/15-aktarim.md) (Excel içe ve dışa aktarım),
  [public/js/parcalar/25-tiklama.md](../../public/js/parcalar/25-tiklama.md) (düğmelerin işleri),
  [public/js/parcalar/06-menu.md](../../public/js/parcalar/06-menu.md) (menü satırları).
- Sunucu: [sunucu/bolumler/okul.md](../../sunucu/bolumler/okul.md) (`/api/school/schedule*`, Excel aktarımı),
  [sunucu/bolumler/ogretmen.md](../../sunucu/bolumler/ogretmen.md) (`/api/teacher/schedule`),
  [sunucu/bolumler/ilerleyis.md](../../sunucu/bolumler/ilerleyis.md) (`/api/myschedule`),
  [sunucu/iliskiler.md](../../sunucu/iliskiler.md) (gün adları, saat, çakışma), [sunucu/hatirlatma.md](../../sunucu/hatirlatma.md)
  (sabah özeti), [sunucu/yardimci/aktarim.md](../../sunucu/yardimci/aktarim.md) (şablon ve ayrıştırma),
  [sunucu/veri/depo/siniflar.md](../../sunucu/veri/depo/siniflar.md) (`ders_programi` tablosu), [sunucu/yetki.md](../../sunucu/yetki.md)
  (`program.duzenle`), [sunucu/api.md](../../sunucu/api.md) (geçmiş yıl kapısı).
- Testler: [testler/test-program.md](../../testler/test-program.md), [testler/test-kapsam.md](../../testler/test-kapsam.md),
  [testler/test-aktarim.md](../../testler/test-aktarim.md), [testler/test-bildirim.md](../../testler/test-bildirim.md),
  [testler/test-siniflarim.md](../../testler/test-siniflarim.md).
- Kullanıcıya dönük anlatım: [belge/KILAVUZ.md](../../belge/KILAVUZ.md) ("Sınıflar ve ders programı", "Yoklama (ders programından)").
