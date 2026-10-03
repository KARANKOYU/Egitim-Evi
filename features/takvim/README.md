# Takvim ve ajanda

Takvim, okuldaki herkesin "bu ay neler var?" sorusunu cevapladığı sayfadır: Pazartesiyle başlayan bir ay ızgarası, resmî tatiller ve dinî
bayramlar, okulun eklediği etkinlik, tatil, sınav ve toplantı kayıtları, kişinin ödevlerinin son günleri ve günün ders sayısı; bir güne
basınca altında o günün kayıtları, o gün biten ödevler, önümüzdeki günlerin ödevleri ve o günün dersleri. Bugünkü sitede öğrenci kendi
takvimini, veli seçtiği çocuğunkini, öğretmen verdiği ödevlerle kendi programını, müdür okulun bütün ödevlerini, servisçi yalnız tatil ve
okul kayıtlarını görür; müdür ve "Okul takvimine etkinlik ve tatil ekler" yetkisi verilen çalışan "Etkinlik ekle" ile kayıt ekler ve
"Kaldır" ile siler. Bunların hepsi kodda var (kullanıcı 29 Ağustos'ta istedi). Kullanıcının kararlaştırdığı tasarımda (Tasarım 1
önizlemesi, mesaj-ajanda tanımı, 1–3 Ekim geri bildirimleri) ek olarak: sayfada iki sekme olur, **"Takvim"** ve **"Ajanda"**; takvimde
yıl okları, başlıklı gün kutuları, parlak seçili gün ve yanda duran, sayfayı kaydırmayan gün listesi ("Bugün yetişecek ödevler",
"Ertesi gün yetişecek", "Hatırlatıcı, toplantı ve öbürleri"); takvime sınavlar, toplantılar, etütler, ajandaya eklenen duyurular, açık
hatırlatıcılar ve okulun eğitim yılı günleri (karne günleri, yarıyıl tatili) de kendiliğinden düşer; Ajanda "Bugün", "Bu hafta",
"Sonra" ve "Geçmiş · son 30 gün" gruplarında kalan süreyle listeler ve yedi süzgeç kutucuğuyla süzülür; her satır kendi penceresini açar;
müdürün "Etkinlik ekle" penceresine saat, yer, "Kimler görür" ve yazı düzenleyicili not gelir; velide her çocuk ayrı oturum olduğu için
her çocuğun takvimi ayrıdır ve müdürün takviminde ödev yoktur.

## Alt özellikler

| Belge | Ne anlatır | Durum |
|---|---|---|
| [Takvim sayfası](takvim-sayfasi.md) | Menüdeki yeri, başlık ve alt yazılar, çocuk şeridi, kimde yok, tasarımda "Takvim" \| "Ajanda" sekmeleri ve yerleşim | Kodda var; tasarımda ek olarak iki sekme, yanda gün listesi, kaymayan sayfa |
| [Ay görünümü](ay-gorunumu.md) | "‹ Ekim 2026 ›", "Bugün", yıl seçici, ızgara, noktalar, ders sayısı, renk açıklaması; tasarımda "« ‹ › »", başlıklı kutular, "+2 daha" | Kodda var; tasarımda ek olarak yıl okları, başlıklı kutular, yeni kayıt türleri |
| [Gün ayrıntısı](gun-ayrintisi.md) | Seçili günün kayıtları, "Bugün teslim edilecek", "Önümüzdeki 7 gün", "O günün dersleri"; tasarımda üç bölümlü liste | Kodda var; tasarımda ek olarak "Bugün/Ertesi gün yetişecek", "Hatırlatıcı, toplantı ve öbürleri" |
| [Takvim kimin gözünden](kimin-takvimi.md) | Rol rol hangi ödev, ders ve kayıt düşer; portal, velinin çocuğu, `studentId` kuralı, kapalı bölüm, eğitim yılı | Kodda var; tasarımda ek olarak velide her çocuk ayrı oturum, müdürde ödev yok, seçilen gruplara etkinlik |
| [Takvime ekle](etkinlik-ekleme.md) | "Takvime ekle" penceresi (Başlık, Tür, Başlangıç, Bitiş, Açıklama), yetki, bütün hata iletileri; tasarımda "Etkinlik ekle" | Kodda var; tasarımda ek olarak saat, yer, "Kimler görür", not, bildirim |
| [Takvimden kaldırma](etkinligi-kaldirma.md) | "Kaldır", onay, çok günlük kayıt, geri alınmazlık, geçmiş yıl | Kodda var (tasarımda karşılığı henüz çizilmedi) |
| [Tatiller ve özel günler](tatiller-ve-ozel-gunler.md) | Sabit günler, dinî bayramlar (yalnız 2026), okulun tatili; tasarımda genişletilmiş liste, okulun yıl günleri, tatil penceresi | Kodda var; tasarımda ek olarak 12 Mart, 28 Ekim arifesi, karne günleri, yarıyıl tatili |
| [Ajanda](ajanda.md) | "Ajanda" sekmesi: Bugün / Bu hafta / Sonra, "N kayıt daha göster", "Geçmiş · son 30 gün", kalan süre rozetleri, rol rol içerik | Tasarlandı — henüz kodda yok |
| [Ajandanın süzgeç kutucukları](ajanda-suzgeci.md) | Ödev · Sınav · Duyuru · Özel gün · Toplantı · Etkinlik · Hatırlatıcılarım; tarayıcıda hatırlanması | Tasarlandı — henüz kodda yok |
| [Takvimdeki kayda basınca](kayit-pencereleri.md) | Bugün ödev satırının Ödevler'e gitmesi; tasarımda her türün penceresi (ödev, sınav, toplantı, etüt, etkinlik, duyuru, tatil, hatırlatıcı) | Kodda var; tasarımda ek olarak her satırın kendi penceresi |

Okuma sırası:

- **Öğrenci:** [Takvim sayfası](takvim-sayfasi.md) → [Ay görünümü](ay-gorunumu.md) → [Gün ayrıntısı](gun-ayrintisi.md) →
  [Tatiller ve özel günler](tatiller-ve-ozel-gunler.md) → tasarımda [Ajanda](ajanda.md), [Ajandanın süzgeç kutucukları](ajanda-suzgeci.md),
  [Takvimdeki kayda basınca](kayit-pencereleri.md).
- **Veli:** [Takvim sayfası](takvim-sayfasi.md) (çocuk şeridi; tasarımda çocuk oturumları) → [Takvim kimin gözünden](kimin-takvimi.md) →
  [Ay görünümü](ay-gorunumu.md) → [Gün ayrıntısı](gun-ayrintisi.md) → tasarımda [Ajanda](ajanda.md).
- **Öğretmen ve ek görevli çalışan:** [Takvim kimin gözünden](kimin-takvimi.md) → [Ay görünümü](ay-gorunumu.md) →
  [Gün ayrıntısı](gun-ayrintisi.md) → yetkin varsa [Takvime ekle](etkinlik-ekleme.md), [Takvimden kaldırma](etkinligi-kaldirma.md) →
  tasarımda [Ajanda](ajanda.md), [Takvimdeki kayda basınca](kayit-pencereleri.md).
- **Müdür:** [Takvime ekle](etkinlik-ekleme.md) → [Takvimden kaldırma](etkinligi-kaldirma.md) →
  [Tatiller ve özel günler](tatiller-ve-ozel-gunler.md) → [Takvim kimin gözünden](kimin-takvimi.md) → tasarımda [Ajanda](ajanda.md).
- **Servisçi:** [Takvim sayfası](takvim-sayfasi.md) → [Tatiller ve özel günler](tatiller-ve-ozel-gunler.md) →
  [Gün ayrıntısı](gun-ayrintisi.md) → tasarımda [Ajanda](ajanda.md) (duyurular).

## Rol tablosu

Hücre: o rolün bu alt özellikte yaptığı (bağlantı ilgili belgeye gider). "—": bu rol kullanmaz. "(tasarım)": henüz kodda yok.

| Alt özellik | Öğrenci | Veli | Öğretmen | Çalışan | Müdür | Servisçi |
|---|---|---|---|---|---|---|
| Takvim sayfası | [menüde "Takvim"](takvim-sayfasi.md) | [çocuk şeridiyle; tasarımda her çocuk oturumunda ayrı](takvim-sayfasi.md) | [menüde "Takvim"; öğrenci portalında "Takvimi"](takvim-sayfasi.md) | [öğretmen menüsünde; tasarımda rolsüz çalışanın portalında da](takvim-sayfasi.md) | [menüde "Takvim"; tasarımda başlıkta "Etkinlik ekle"](takvim-sayfasi.md) | [menüde "Takvim"; tasarımda ana sayfa kutucuğu](takvim-sayfasi.md) |
| Ay görünümü | [ödevleri ve sınıfının ders sayısı](ay-gorunumu.md) | [çocuğunun ödevleri ve dersleri](ay-gorunumu.md) | [verdiği ödevler, kendi ders sayısı](ay-gorunumu.md) | [öğretmen gibi](ay-gorunumu.md) | [okulun bütün ödevleri; tasarımda ödevsiz](ay-gorunumu.md) | [yalnız tatil ve okul kayıtları](ay-gorunumu.md) |
| Gün ayrıntısı | [o gün ve sonraki günlerin ödevleri, dersleri](gun-ayrintisi.md) | [çocuğunun ödevleri ve dersleri](gun-ayrintisi.md) | [verdiği ödevler, kendi programı](gun-ayrintisi.md) | [öğretmen gibi](gun-ayrintisi.md) | [okulun ödevleri, "Kaldır"](gun-ayrintisi.md) | [tatil ve okul kayıtları](gun-ayrintisi.md) |
| Takvim kimin gözünden | [her zaman kendisi](kimin-takvimi.md) | [seçili çocuk; tasarımda oturumun çocuğu](kimin-takvimi.md) | [kendisi ya da portalını açtığı öğrenci](kimin-takvimi.md) | [öğretmen gibi; rolsüz çalışan tasarımda](kimin-takvimi.md) | [okul ya da portalını açtığı öğrenci](kimin-takvimi.md) | [okulun tatilleri ve kayıtları](kimin-takvimi.md) |
| Takvime ekle | — (görür) | — (görür) | — ([yetki verilirse ekler](etkinlik-ekleme.md)) | [yetkisi varsa ekler (Müdür Yardımcısı)](etkinlik-ekleme.md) | [ekler; tasarımda saat, yer, kimler görür](etkinlik-ekleme.md) | — (görür) |
| Takvimden kaldırma | — | — | — ([yetki verilirse](etkinligi-kaldirma.md)) | [yetkisi varsa kaldırır](etkinligi-kaldirma.md) | [kaldırır](etkinligi-kaldirma.md) | — |
| Tatiller ve özel günler | [görür](tatiller-ve-ozel-gunler.md) | [görür](tatiller-ve-ozel-gunler.md) | [görür; ödev verirken tatili seçmez](tatiller-ve-ozel-gunler.md) | [görür](tatiller-ve-ozel-gunler.md) | [görür; okulun tatilini "Tatil" türüyle ekler](tatiller-ve-ozel-gunler.md) | [görür; tasarımda ana sayfada "29 Ekim tatil"](tatiller-ve-ozel-gunler.md) |
| Ajanda | [ödevler, sınavlar, etütler… (tasarım)](ajanda.md) | [oturumun çocuğu (tasarım)](ajanda.md) | [verdiği ödevler, sınavlar, etütler (tasarım)](ajanda.md) | [tanımda var, içerik açık soru (tasarım)](ajanda.md) | [ödevsiz, okulun kayıtları (tasarım)](ajanda.md) | [tatiller ve duyurular (tasarım)](ajanda.md) |
| Ajandanın süzgeç kutucukları | [yedi çip (tasarım)](ajanda-suzgeci.md) | [yedi çip (tasarım)](ajanda-suzgeci.md) | [yedi çip (tasarım)](ajanda-suzgeci.md) | [tasarım](ajanda-suzgeci.md) | ["Ödev"siz altı çip (tasarım)](ajanda-suzgeci.md) | ["Ödev"siz altı çip (tasarım)](ajanda-suzgeci.md) |
| Takvimdeki kayda basınca | [ödev satırı Ödevler'e; tasarımda ödevin penceresi](kayit-pencereleri.md) | [tasarımda pencereler](kayit-pencereleri.md) | [bugün "Öğrenci bulunamadı" açığı; tasarımda pencereler](kayit-pencereleri.md) | [öğretmen gibi](kayit-pencereleri.md) | [tasarımda etüt yoklaması, etkinlik penceresi](kayit-pencereleri.md) | [tasarımda duyuru ve tatil pencereleri](kayit-pencereleri.md) |

Notlar:

- **Çalışan** sütunu: bugün ek görevli kişi (Müdür Yardımcısı, Rehber, Nöbetçi…) öğretmen hesabıyla bir ek rol taşır ve öğretmenin
  menüsündeki "Takvim"i kullanır; "Okul takvimine etkinlik ve tatil ekler" yetkisi verilmişse (hazır "Müdür Yardımcısı" şablonunda var)
  ekler ve kaldırır ([Özel roller](../roller-yetkiler/ozel-roller.md)). Çalışan tanımına göre rolsüz çalışanın portalında da Takvim
  olacak (Tasarım 1 önizlemesinde bu hesabın örneği yok) ([Rolsüz çalışan](../ogretmenler-calisanlar/rolsuz-calisan.md)).
- **Yönetici, destek, eğitmen, tahta** hesaplarının takvimi yoktur; yönetici takvim adresine giderse "Bu işlem bir okula bağlı olmayı
  gerektirir. Yönetici hesabı bir okula ait değildir." alır. **Henüz okula bağlı olmayan yetişkinin** menüsünde Takvim yok. **Giriş
  yapmamış ziyaretçi** takvimi görmez; açılış sayfasında takvim yalnız özellik listesinde anılır.
- **Ödev tarih seçicisi** (öğretmen ödev verirken) aynı takvim verisini kullanır: tatiller, okul etkinlikleri ve öteki ödevlerin son
  günleri günlerin altında işaretlidir ([Ödevin tarih ve saati](../odev/tarih-ve-saat.md)).

Rol kapıları: [Öğrenci](../roller/ogrenci.md) · [Veli](../roller/veli.md) · [Öğretmen](../roller/ogretmen.md) ·
[Çalışan](../roller/calisan.md) · [Müdür](../roller/mudur.md) · [Servisçi](../roller/servisci.md). Bütün özellikler: [features/](../README.md).

## İlgili öbür klasörler

- [Ödevler](../odev/README.md) — ödevlerin son günleri takvimde; ödev verirken açılan tarih seçicisi; tasarımda ödevin penceresi.
- [Sınavlar](../sinav/README.md) — bugün elle eklenen "Sınav" türü; tasarımda planlanan sınavın takvime ve ajandaya kendiliğinden girmesi.
- [Toplantılar ve uzaktan ders](../toplanti/README.md) — bugün takvimdeki "Toplantı" türü yalnız işaret; tasarımda toplantılar takvime
  ve ajandaya girer, 1 hafta sonra kalkar.
- [Etütler](../etut/README.md) — tasarımda etütlerin takvimde ve ajandada görünmesi.
- [Hatırlatıcılar](../hatirlatici/README.md) — tasarımda açık hatırlatıcıların takvimde her tekrarı, ajandada sıradaki zamanı.
- [Mesajlar ve duyurular](../mesaj/README.md) — tasarımda "Alıcıların ajandasına ekle" ile duyurunun ajandaya düşmesi.
- [Ders programı](../ders-programi/README.md) — ay görünümündeki ders sayısı ve gün ayrıntısındaki "O günün dersleri".
- [Eğitim yılı ve yıl geçişi](../egitim-yili/README.md) — geçmiş yıl salt okunur; yıl damgası; tasarımda dönem ve karne günleri.
- [Roller ve yetkiler](../roller-yetkiler/README.md) — "Okul takvimine etkinlik ve tatil ekler" yetkisi, "Müdür Yardımcısı" şablonu.
- [Okulun özellikleri](../ozellikler/README.md) — takvim kapatılamaz; kapalı "Ödevler" takvimden düşer.
- [Portallar ve + Ekle](../portallar/README.md) — velide her çocuk ayrı oturum, öğrencinin portalı.
- [Menü, üst şerit ve arama](../menu-ve-arama/README.md) — menüdeki "Takvim".
- [Ana sayfa](../ana-sayfa/README.md) — tasarımda servisçinin "Takvim" kutucuğu; velinin ana sayfasındaki "Yaklaşanlar" bölümü
  ("hepsi →" Takvim'i açar).
- [Servis](../servis/README.md) — tasarımda "binmeyecek" gün kendi küçük ay takviminden seçilir; bu işaretler Takvim sayfasına düşmez
  ([Binmeyecek işareti](../servis/binmeyecek.md)).
- [Yazı düzenleyici](../yazi-yazma/README.md) — tasarımda etkinliğin notu ve ajanda notu.
- [Uygulama ve indirme](../uygulama/README.md) — Android uygulamasına planlanan Takvim ekranı ve aynı ajanda ucu.
- [Dil ve çeviri](../dil/README.md) — tasarımda ay, gün ve tatil adlarının çevirisi.

## Kod belgeleri

- Ön yüz: [public/js/parcalar/17-takvim.md](../../public/js/parcalar/17-takvim.md) (ay görünümü, gün ayrıntısı, "Takvime ekle"
  penceresi), [public/js/parcalar/25-tiklama.md](../../public/js/parcalar/25-tiklama.md) (‹ ›, Bugün, güne basma, Ekle, Kaldır),
  [public/js/parcalar/27-veli-panel.md](../../public/js/parcalar/27-veli-panel.md) (çocuk şeridi),
  [public/js/parcalar/06-menu.md](../../public/js/parcalar/06-menu.md) (menüdeki yeri),
  [public/js/parcalar/04e-tarih-secici.md](../../public/js/parcalar/04e-tarih-secici.md) (aynı ucu kullanan tarih seçicisi),
  [public/css/parcalar/CSS.md](../../public/css/parcalar/CSS.md) (`21-takvim.css`).
- Sunucu: [sunucu/bolumler/takvim.md](../../sunucu/bolumler/takvim.md) (`/api/takvim`, `/api/takvim/gun`, `/api/takvim/etkinlik`,
  `/api/takvim/etkinlik-sil`; sabit günler, dinî bayramlar), [sunucu/api.md](../../sunucu/api.md) (geçmiş yılın salt okunur kapısı,
  okula bağlı olmayan yetişkin), [sunucu/yetki.md](../../sunucu/yetki.md) (`takvim.yonet`, `okulGerek`).
- Veri: [sunucu/veri/depo/genel.md](../../sunucu/veri/depo/genel.md) (`takvim_etkinlikleri`),
  [sunucu/veri/depo/odevler.md](../../sunucu/veri/depo/odevler.md) (`takvimIcin`), [sunucu/veri/sema/SEMA.md](../../sunucu/veri/sema/SEMA.md),
  [sunucu/veri/json-aktarim.md](../../sunucu/veri/json-aktarim.md) (yedek).
- Testler: [testler/test-takvim.md](../../testler/test-takvim.md), [testler/test-odev-saat.md](../../testler/test-odev-saat.md),
  [testler/test-ozellikler.md](../../testler/test-ozellikler.md), [testler/yetki-denetimi.md](../../testler/yetki-denetimi.md).
- Kullanıcıya dönük anlatım: [belge/KILAVUZ.md](../../belge/KILAVUZ.md). KILAVUZ'da takvim için ayrı bir bölüm yok; takvim yalnız
  geçerken anılır: girişteki özellik listeleri ("takvim ve tatiller"), nakil (velinin okulu "duyuru ve takvim" için yeni okula geçer),
  yetki tablosunda "Takvim", Özellikler bölümünde "takvim kapalı bölümü atlar", Eğitim yılı bölümünde "takvim etkinliği" yıl damgası,
  servisçinin menüsü ve yedeğe giren tablolar.
  **"Veli paneli" bölümü kodla çelişiyor:** "İlerleyiş ve Takvim bütün çocuklar için tek listede gelir, her satırın başında hangi
  çocuğun olduğu yazar" diyor; kodda takvim her zaman tek çocuğun takvimidir ("Hepsi" seçiliyken ilk çocuğun).
- Tasarım: Tasarım 1 önizlemesi (Takvim | Ajanda sekmeleri, başlıklı gün kutuları, gün listesi, ajanda, süzgeç, "Etkinlik ekle",
  pencereler) ve mesaj-ajanda tanımının Ajanda bölümü; kodlanınca alt belgelerin Durum satırları güncellenir.
