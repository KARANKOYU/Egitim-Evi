# Toplantılar ve uzaktan ders

Veli toplantısı, öğretmenler kurulu, zümre toplantısı, seminer gibi toplantıların önceden durduğu, zamanı gelince tek düğmeyle
girildiği ve sınıfın gelemeyen öğrencisinin dersi evden izlediği bölüm. Klasörün tamamı **tasarım**: bugün kodda yalnız takvime
türü "Toplantı" olan bir işaret eklenebiliyor ([Takvime ekle](../takvim/etkinlik-ekleme.md)); saati, davetlisi, bağlantısı ve "Katıl"ı
yok. Kullanıcının kararlaştırdığı tasarımda (29 Eylül tanımı, 3 Ekim kararları, Tasarım 1 önizlemesi): menüde **"Toplantılar"**
sayfası; müdür ve **"Toplantı açar"** yetkisi olan öğretmen ya da çalışan davetlileri mesajlardaki alıcı seçicisiyle seçip yüz yüze,
bağlantıyla ya da ikisi birden toplantı açar; toplantılar Google Meet tabanlıdır, Zoom ve Teams isteğe bağlıdır; bağlantı kimseye
gösterilmez, davetli başlangıçtan **10 dakika önce** çıkan **"Katıl"**a basar ve sunucumuz onu yönlendirir; toplantıyı açanda düğme
**"Aç"**tır, açan gelmeden "Katıl"a basan bizim bekleme ekranımızda bekler ve açan gelince kendiliğinden gider; 1 gün ve 15 dakika
önce hatırlatma gider; biten toplantı soluklaşır ve **1 hafta sonra silinir**; bitince düzenleyen ve müdür "Katıl"a kimin bastığını
görür. Öğretmen ve müdür Meet/Zoom/Teams bağlantılarını **"Görüşme bağlantıları"** listesinde ("Yalnız ben" ya da "Okuldaki
herkes", etiketli) saklar, toplantı açarken ve sınıfa bağlarken süzgeçli seçiciyle seçer; bir bağlantı tek yerde kullanılır,
başka yere verilince önceki yer bağlantısız kalır. Her sınıfın kalıcı bir **uzaktan ders bağlantısı** olur; derste öğretmen ya da
sınıftaki **tahta** "Görüşme başlat" ile odayı açar, gelmeyenlere "Dersin uzaktan bağlantısı açık — Katıl" bildirimi gönderir ve
yalnız seçilen öğrenci o ders boyunca katılabilir.

## Alt özellikler

| Belge | Ne anlatır | Durum |
|---|---|---|
| [Toplantılar listesi](toplantilar.md) | Menüdeki sayfa: "Uzaktan ders" (öğrencide), "Yaklaşan", "Geçmiş · 1 hafta sonra silinir"; satırlar ve rozetler | Tasarlandı — henüz kodda yok (bugün takvimde yalnız "Toplantı" türü işaret) |
| [Toplantı açma](toplanti-acma.md) | "Toplantı aç" penceresi: başlık, davetliler, tarih, saat, katılım yolu, yer, bağlantı, açıklama, hatırlatma; hata iletileri | Tasarlandı — henüz kodda yok |
| [Toplantı penceresi](toplanti-penceresi.md) | Satıra basınca açılan ayrıntı; zamana göre notlar; "Düzenle", "İptal et" | Tasarlandı — henüz kodda yok |
| [Katıl düğmesi](katil.md) | 10 dakika kuralı, sunucu kapısı, "Katılıyorsun" penceresi, yalnız yüz yüzede "Şimdi" | Tasarlandı — henüz kodda yok |
| [Aç düğmesi ve bekleme ekranı](ac-ve-bekleme.md) | Açanın "Aç"ı, "Toplantıyı bekliyorsun", otomatik yönlendirme, "Toplantı başladı · Katıl" bildirimi | Tasarlandı — henüz kodda yok |
| [Hatırlatma ve 1 hafta sonra silinme](hatirlatma-ve-silinme.md) | 1 gün ve 15 dakika önce bildirim, "Bitti" görünümü, bitişten 1 hafta sonra silinme | Tasarlandı — henüz kodda yok |
| [Kimler katıldı](katilanlar.md) | Bitince düzenleyenin ve müdürün gördüğü "Katılanlar" listesi, "Katılmayanlara mesaj gönder" (3 Ekim kararı) | Tasarlandı — henüz kodda yok |
| [Görüşme bağlantıları](gorusme-baglantilari.md) | Meet/Zoom/Teams bağlantı listesi: hesap, ad, "Yalnız ben"/"Okuldaki herkes", etiketler, süzgeçler, Kopyala/Aç/Düzenle/Sil | Tasarlandı — henüz kodda yok |
| [Bağlantı seçici, Kullanımda/Boşta ve devretme](baglanti-secici-ve-devretme.md) | Toplantı açarken ve sınıfa bağlarken seçici, devretme onayı, bağlantısız uyarısı, "Bağlantı bulunamadı" | Tasarlandı — henüz kodda yok |
| [Sınıfın uzaktan ders bağlantısı](uzaktan-ders-baglantisi.md) | Her sınıfın kalıcı odası: almak, kaydetmek, sınıfa vermek; kim verir; KVKK | Tasarlandı — henüz kodda yok |
| [Görüşme başlat, ping ve Katıl izni](gorusme-baslat-ve-ping.md) | Öğretmenin "Yoklama"sında ve tahtada "Görüşme başlat", gelmeyenlere bildirim, ders başına Katıl izni, öğrencinin "Uzaktan ders"i | Tasarlandı — henüz kodda yok |

Okuma sırası:

- **Öğrenci:** [Toplantılar listesi](toplantilar.md) → [Katıl düğmesi](katil.md) → [Aç düğmesi ve bekleme ekranı](ac-ve-bekleme.md) →
  [Görüşme başlat, ping ve Katıl izni](gorusme-baslat-ve-ping.md) → [Hatırlatma ve 1 hafta sonra silinme](hatirlatma-ve-silinme.md).
- **Veli:** [Toplantılar listesi](toplantilar.md) → [Toplantı penceresi](toplanti-penceresi.md) → [Katıl düğmesi](katil.md) →
  [Hatırlatma ve 1 hafta sonra silinme](hatirlatma-ve-silinme.md) → [Görüşme başlat, ping ve Katıl izni](gorusme-baslat-ve-ping.md#veli).
- **Öğretmen:** [Toplantılar listesi](toplantilar.md) → [Görüşme bağlantıları](gorusme-baglantilari.md) →
  [Toplantı açma](toplanti-acma.md) → [Bağlantı seçici, Kullanımda/Boşta ve devretme](baglanti-secici-ve-devretme.md) →
  [Aç düğmesi ve bekleme ekranı](ac-ve-bekleme.md) → [Kimler katıldı](katilanlar.md) →
  [Sınıfın uzaktan ders bağlantısı](uzaktan-ders-baglantisi.md) → [Görüşme başlat, ping ve Katıl izni](gorusme-baslat-ve-ping.md).
- **Müdür:** [Toplantılar listesi](toplantilar.md) → [Toplantı açma](toplanti-acma.md) → [Toplantı penceresi](toplanti-penceresi.md) →
  [Görüşme bağlantıları](gorusme-baglantilari.md) → [Bağlantı seçici, Kullanımda/Boşta ve devretme](baglanti-secici-ve-devretme.md) →
  [Sınıfın uzaktan ders bağlantısı](uzaktan-ders-baglantisi.md) → [Görüşme başlat, ping ve Katıl izni](gorusme-baslat-ve-ping.md#müdür) →
  [Kimler katıldı](katilanlar.md) → [Hatırlatma ve 1 hafta sonra silinme](hatirlatma-ve-silinme.md).
- **Çalışan (müdür yardımcısı, rehber öğretmen, zümre başkanı, sınıf öğretmeni):** [Toplantı açma](toplanti-acma.md) →
  [Toplantılar listesi](toplantilar.md) → [Aç düğmesi ve bekleme ekranı](ac-ve-bekleme.md) → [Kimler katıldı](katilanlar.md).
- **Tahta:** [Görüşme başlat, ping ve Katıl izni](gorusme-baslat-ve-ping.md#tahta) → [Sınıfın uzaktan ders bağlantısı](uzaktan-ders-baglantisi.md).

## Rol tablosu

Hücre: o rolün bu alt özellikte yaptığı (bağlantı ilgili belgeye gider). "—": bu rol kullanmaz. Hepsi tasarımdır.

| Alt özellik | Öğrenci | Veli | Öğretmen | Çalışan | Müdür | Tahta | Servisçi | Yönetici | Ziyaretçi |
|---|---|---|---|---|---|---|---|---|---|
| Toplantılar listesi | [davetli olduğu toplantılar ve "Uzaktan ders"](toplantilar.md#öğrenci) | [oturumdaki çocuğun toplantıları](toplantilar.md#veli) | [davetli olduğu ve açtığı toplantılar, "Toplantı aç"](toplantilar.md#öğretmen) | ["Toplantı açar" yetkisiyle öğretmen gibi](toplantilar.md#çalışan) | [okulun toplantıları, "Toplantı aç"](toplantilar.md#müdür) | — | — | — | — |
| Toplantı açma | — | — | [derse girdiği sınıfların velileri ve öğrencileri için açar](toplanti-acma.md#öğretmen) | ["Toplantı açar" yetkisiyle, sınıf kapsamına göre](toplanti-acma.md#çalışan) | [okul geneli, bütün öğretmenler ve veliler](toplanti-acma.md#müdür) | — | — | — | — |
| Toplantı penceresi | [bilgileri okur, zamanı gelince "Katıl"](toplanti-penceresi.md#öğrenci-ve-veli) | [bilgileri okur, zamanı gelince "Katıl"](toplanti-penceresi.md#öğrenci-ve-veli) | [kendi toplantısında "Aç", "Düzenle", "İptal et"](toplanti-penceresi.md#öğretmen) | [kendi açtığında "Aç", "Düzenle", "İptal et"](toplanti-penceresi.md#çalışan) | [her toplantıda "Düzenle", "İptal et"](toplanti-penceresi.md#müdür) | — | — | — | — |
| Katıl düğmesi | [davetliyse 10 dakika önce "Katıl"](katil.md) | [davetliyse 10 dakika önce "Katıl"](katil.md) | [davetli olduğu toplantıda "Katıl"](katil.md) | [davetli olduğu toplantıda "Katıl"](katil.md) | [başkasının toplantısında "Katıl"](katil.md) | — | — | — | — |
| Aç düğmesi ve bekleme ekranı | [açan gelmeden bekleme ekranında bekler](ac-ve-bekleme.md) | [açan gelmeden bekleme ekranında bekler](ac-ve-bekleme.md) | [kendi toplantısını "Aç"la açar; davetliyken bekler](ac-ve-bekleme.md) | [kendi toplantısını "Aç"la açar](ac-ve-bekleme.md) | [kendi toplantısını "Aç"la açar](ac-ve-bekleme.md) | — | — | — | — |
| Hatırlatma ve 1 hafta sonra silinme | [1 gün ve 15 dakika önce bildirim alır](hatirlatma-ve-silinme.md) | [bildirim alır, başında çocuğun adı](hatirlatma-ve-silinme.md) | [açarken hatırlatmayı açar/kapatır; davetliyken alır](hatirlatma-ve-silinme.md) | [öğretmen gibi](hatirlatma-ve-silinme.md) | [öğretmen gibi; bağlantısız toplantı uyarısını alır](hatirlatma-ve-silinme.md) | — | — | — | — |
| Kimler katıldı | [basışı kaydedilir, listeyi görmez](katilanlar.md#öğrenci-ve-veli) | [basışı kaydedilir, listeyi görmez](katilanlar.md#öğrenci-ve-veli) | [kendi toplantısının listesi, "Katılmayanlara mesaj gönder"](katilanlar.md) | [kendi açtığı toplantının listesi](katilanlar.md) | [bütün toplantıların listesi](katilanlar.md#müdür) | — | — | — | — |
| Görüşme bağlantıları | [görmez](gorusme-baglantilari.md#öğrenci-ve-veli) | [görmez](gorusme-baglantilari.md#öğrenci-ve-veli) | [ekler, süzer; kendi eklediğini düzenler ve siler](gorusme-baglantilari.md#öğretmen) | [açık nokta: toplantı açabilen görmeli](gorusme-baglantilari.md#çalışan) | [ekler; okula açık olanları da siler](gorusme-baglantilari.md#müdür) | — | — | — | — |
| Bağlantı seçici, Kullanımda/Boşta ve devretme | ["Bağlantı bulunamadı" görebilir](baglanti-secici-ve-devretme.md) | ["Bağlantı bulunamadı" görebilir](baglanti-secici-ve-devretme.md) | [toplantı açarken seçer, devreder; bağlantısız uyarısını alır](baglanti-secici-ve-devretme.md) | [toplantı açarken seçer](baglanti-secici-ve-devretme.md) | [toplantıda ve sınıfa bağlarken seçer; bağlantısız uyarısını alır](baglanti-secici-ve-devretme.md) | ["Görüşme başlat"ta "Bağlantı bulunamadı" görebilir](baglanti-secici-ve-devretme.md) | — | — | — |
| Sınıfın uzaktan ders bağlantısı | [görmez; "Katıl" ile girer](uzaktan-ders-baglantisi.md#öğrenci-ve-veli) | [görmez; okula haber verir](uzaktan-ders-baglantisi.md#öğrenci-ve-veli) | [sınıfının bağlantısını verir (tanım)](uzaktan-ders-baglantisi.md#öğretmen) | [öneri: `uzaktan.baglanti` yetkisiyle](uzaktan-ders-baglantisi.md#çalışan) | [her sınıfa bağlantı verir](uzaktan-ders-baglantisi.md#müdür) | [seçmez; "Görüşme başlat"ta kullanır](uzaktan-ders-baglantisi.md#tahta) | — | — | — |
| Görüşme başlat, ping ve Katıl izni | [bildirimi alır, "Uzaktan ders"te "Katıl"](gorusme-baslat-ve-ping.md#öğrenci) | [okula haber verir; veliye bildirim kararlaşmadı](gorusme-baslat-ve-ping.md#veli) | ["Yoklama"da "Görüşme başlat", "Gelmeyenlere Katıl bildirimi"](gorusme-baslat-ve-ping.md#öğretmen) | — | [derse giriyorsa "Yoklama"da "Görüşme başlat" ve "Gelmeyenlere Katıl bildirimi"](gorusme-baslat-ve-ping.md#müdür) | [sınıf seçer, "Görüşme başlat", kutucukla seçip bildirir](gorusme-baslat-ve-ping.md#tahta) | — | — | — |

Notlar:

- **Çalışan** sütunu: "Toplantı açar" (`toplanti.ac`) yetkisi Tasarım 1'deki hazır "Öğretmen" rolünde ve "Müdür yardımcısı", "Rehber
  öğretmen", "Zümre başkanı", "Sınıf öğretmeni" şablonlarında var; yeni yetkiler ve şablonlar önerisi (iş 24) onay bekliyor
  ([Özel roller](../roller-yetkiler/ozel-roller.md), [Hazır rol şablonları](../roller-yetkiler/hazir-sablonlar.md)). Rolsüz çalışan
  toplantı açamaz; davetli olduğu toplantıyı listesinde görür ve "Katıl"a basar. Tasarım 1'de ayrı bir çalışan hesabı çizilmedi.
- **Tahta** bir kişi değil, sınıftaki akıllı tahta için okulun açtığı kısıtlı hesaptır ("tahta." önekli ad); menüsünde "Toplantılar"
  yoktur, yalnız "Sınıflar" vardır ([Tahta hesabı](../tahta/README.md)).
- **Servisçi**, tasarımdaki **eğitmen** ve **destek**, **sistem yöneticisi** ve giriş yapmamış **ziyaretçi** bu bölümü kullanmaz:
  menülerinde "Toplantılar" yoktur. Dil çevirisinde sayfanın adı "Meetings" ([Dil](../dil/README.md)).
- **Veli** her çocuğunun oturumunda o çocuğun toplantılarını ayrı görür ([Velide çocuk oturumları](../portallar/velide-cocuk-oturumlari.md)).
- Okul **"Toplantılar"** bölümünü kapatabilir; kapalıyken menüde çıkmaz ([Bölüm aç / kapat](../ozellikler/bolum-ac-kapat.md)).

Rol kapıları: [Öğrenci](../roller/ogrenci.md) · [Veli](../roller/veli.md) · [Öğretmen](../roller/ogretmen.md) ·
[Çalışan](../roller/calisan.md) · [Müdür](../roller/mudur.md) · [Servisçi](../roller/servisci.md) ·
[Yönetici](../roller/yonetici.md) · [Ziyaretçi](../roller/ziyaretci.md). Bütün özellikler: [features/](../README.md).

## İlgili öbür klasörler

- [Takvim ve ajanda](../takvim/README.md) — bugünkü "Takvime ekle"deki "Toplantı" türü; tasarımda toplantılar takvime ve ajandaya
  kendiliğinden girer ("Toplantı" süzgeci), gün ayrıntısından açılır.
- [Tahta hesabı](../tahta/README.md) — sınıf seçme, öğrenci seçme, "Görüşme başlat", tahtanın sınırları.
- [Devamsızlık ve yoklama](../devamsizlik/README.md) — öğretmenin "Yoklama" sayfasındaki "Görüşme başlat" ve "Gelmeyenlere Katıl
  bildirimi"; tahtadaki "Geldi/Gelmedi".
- [Bildirimler](../bildirim/README.md) — hatırlatmalar, "Toplantı başladı · Katıl", "Dersin uzaktan bağlantısı açık — Katıl",
  bağlantısız toplantı uyarısı, telefon bildirimi.
- [Mesajlar](../mesaj/README.md) — davetliler seçicisi mesajlardaki alıcı seçicisidir; "Katılmayanlara mesaj gönder"; aynı 3 Ekim
  kararıyla gelen "Okumayanlara hatırlat" ve "Önemli" etiketi; "Veli toplantısı" duyurusu ve hazır şablonu.
- [Roller ve yetkiler](../roller-yetkiler/README.md) — "Toplantı açar", "Tahta hesapları", önerilen `uzaktan.baglanti`.
- [Sınıflar ve dersler](../siniflar-dersler/README.md) — sınıfın ayarlarındaki uzaktan ders bağlantısı.
- [Portallar](../portallar/README.md) — velide her çocuk ayrı oturum.
- [Menü, üst şerit ve arama](../menu-ve-arama/README.md) — "Toplantılar" satırı (Takvim'in altında, sayı rozetiyle).
- [Ana sayfa](../ana-sayfa/README.md) — velinin "Yaklaşanlar" kutusundaki toplantı satırı.
- [Okulun özellikleri](../ozellikler/README.md) — bölümü açma/kapatma.
- [Yazı yazma](../yazi-yazma/README.md) — toplantının "Açıklama"sı ortak yazı düzenleyiciyle yazılır.
- [Hatırlatıcılar](../hatirlatici/README.md) — toplantı için kendi hatırlatıcını da kurabilirsin.
- [İşlem kaydı](../islem-kaydi/README.md) — "toplantı açtı", tahtadaki seçimler.
- [KVKK ve gizlilik](../kvkk-ve-gizlilik/README.md) — saklama (bittikten 1 hafta sonra silinir), dışarı giden veriler (Google, Zoom),
  aydınlatma metni, uzaktan derse görüntülü katılım.
- [Uygulama](../uygulama/README.md) — telefonda "Katıl" Meet ya da Zoom uygulamasını açar.
- [Dil](../dil/README.md) — sayfa adları ve iletilerin çevirisi.

## Kod belgeleri

Bölüm bugün kodda yok. Bugünkü en yakın parça ve kodlanınca dokunacağı belgeler:

- Takvimin "Toplantı" türü: [sunucu/bolumler/takvim.md](../../sunucu/bolumler/takvim.md) (`POST /api/takvim/etkinlik`, tür `toplanti`),
  [public/js/parcalar/17-takvim.md](../../public/js/parcalar/17-takvim.md) ("Takvime ekle" penceresi).
- Alıcı seçici ve hedef çözme: [sunucu/bolumler/mesaj.md](../../sunucu/bolumler/mesaj.md),
  [public/js/parcalar/19-mesajlar.md](../../public/js/parcalar/19-mesajlar.md).
- Yoklama (uzaktan ders düğmeleri buraya gelir): [sunucu/bolumler/devamsizlik.md](../../sunucu/bolumler/devamsizlik.md),
  [public/js/parcalar/18-devamsizlik.md](../../public/js/parcalar/18-devamsizlik.md),
  [public/js/parcalar/22-programim.md](../../public/js/parcalar/22-programim.md).
- Sınıflar: [sunucu/bolumler/okul.md](../../sunucu/bolumler/okul.md), [public/js/parcalar/20-siniflar.md](../../public/js/parcalar/20-siniflar.md).
- Bildirim ve zamanlı hatırlatma: [sunucu/veri/depo/genel.md](../../sunucu/veri/depo/genel.md), [sunucu/push.md](../../sunucu/push.md),
  [sunucu/hatirlatma.md](../../sunucu/hatirlatma.md),
  [public/js/parcalar/24-bildirim-arama-mobil.md](../../public/js/parcalar/24-bildirim-arama-mobil.md).
- Yetki ve roller: [sunucu/yetki.md](../../sunucu/yetki.md), [public/js/parcalar/19f-roller.md](../../public/js/parcalar/19f-roller.md).
- Menü ve bölüm kapısı: [public/js/parcalar/06-menu.md](../../public/js/parcalar/06-menu.md),
  [sunucu/bolumler/ozellikler.md](../../sunucu/bolumler/ozellikler.md),
  [public/js/parcalar/16c-ozellikler.md](../../public/js/parcalar/16c-ozellikler.md).
- İşlem kaydı: [sunucu/bolumler/islem-kaydi.md](../../sunucu/bolumler/islem-kaydi.md).
- Yeni tablolar: [sunucu/veri/sema/SEMA.md](../../sunucu/veri/sema/SEMA.md) ("toplantılar (iş 21)").
- Kullanıcıya dönük anlatım: [belge/KILAVUZ.md](../../belge/KILAVUZ.md)'de toplantı ve uzaktan ders bölümü henüz yok.
