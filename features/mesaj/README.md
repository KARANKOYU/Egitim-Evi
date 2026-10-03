# Mesajlar ve duyurular

Okulun iç yazışma bölümü: herkesin bir "Gelen kutusu" ve "Gönderilenler"i var; müdür ve öğretmen okuldaki herkese, öğrenci ve
veli yalnız (çocuğunun) derse giren öğretmenlerine ve müdüre yazar, öğrenci öğrenciye yazamaz. Öğrenciye giden her mesajın ve
duyurunun bir kopyası onaylı velisine de düşer ("Ada için"). "Sınıfa veya gruba toplu mesaj atar" yetkisi olan sınıflara ve rol
gruplarına yazar ve **duyuru** yayımlar; "Okuldaki herkese mesaj atar" yetkisi olan bütün okula yazar. Duyuru cevaplanmaz ve
kişilerin "Bana kim yazabilir?" ayarına takılmaz. Gönderen (duyuruda müdür de) kimin okuduğunu saatiyle görür. Mesaja dosya
eklenir (toplam 50 MB, 20 dosya, 7 gün saklanır); gönderen mesajını düzeltir ya da herkesten siler, alıcı kendi kutusundan kaldırır.
Bunların hepsi bugün kodda var. Kullanıcının kararlaştırdığı tasarımda (Tasarım 1 önizlemesi ve tanımlar) ek olarak: Gmail gibi sık
satırlı, aranır, 50'şerli sayfalı kutu ve WhatsApp gibi toplu seçip silme; "Yanıtla"; "Alıcı: / Başlık: / Açıklama:" düzeni ve ortak
yazı düzenleyici; türlere basılan çipli alıcı seçici; açılır "Ekler (N)" kutusu ve alıcıların izinli mesaja dosya yüklemesi;
**Şikâyet · Önemli · Durum** etiketleri (ayrı şikâyet kutusu yok; şikâyet Gönderildi → Bakıldı → Çözüldü); müdürün çarkla okulun
mesaj ayarları; "Bu mesajı bildir"; hazır şablonlar ({öğrenci}, {sınıf}, {veli}); ileri tarihli gönderim ve "Planlanan" kutusu;
duyurudan alıcıların ajandasına ve hatırlatıcısına ekleme; velide her çocuk ayrı oturum. Kullanıcının 3 Ekim kararıyla ("2 3 5 6,
eğer önemli tag'ı seçilirse 7 gibi işlesin") duyurunun okundu listesine **"Okumayanlara hatırlat"** geldi ve **"Önemli" etiketi acil
duyuru gibi** işleyecek: ayrı ve sesli telefon bildirimi kanalı, sayfanın üstünde kapatılana kadar duran şerit, zorunlu okundu takibi.

## Alt özellikler

| Belge | Ne anlatır | Durum |
|---|---|---|
| [Gelen kutusu ve gönderilenler](kutu.md) | Sekmeler, tür süzgeci, satır düzeni, okunmamış sayısı; tasarımda arama, sayfalama, toplu seçim | Kodda var; tasarımda ek olarak Gmail gibi liste, Planlanan, etiket süzgeçleri, toplu seçim |
| [Mesajı okuma](mesaj-okuma.md) | Mesaj penceresi, okundu yazılması, düğmeler | Kodda var; tasarımda ek olarak "Yanıtla", Gönderen/Alıcı/Başlık/Açıklama düzeni |
| [Yeni mesaj ve alıcı seçimi](yeni-mesaj.md) | Kime yazılır, kişi/sınıf/rol/okul hedefi, sınırlar, iletiler | Kodda var; tasarımda ek olarak çipli alıcı seçici, düzenleyici, etiket, şablon, gönderim zamanı |
| [Duyuru](duyuru.md) | Duyurunun kim tarafından, kime, nasıl gittiği; ayarları aşması | Kodda var; tasarımda ek olarak "Tür / Hedef" seçimi, Önemli duyuru, Okumayanlara hatırlat |
| [Okundu bilgisi](okundu-bilgisi.md) | "N / M okudu", rol rol liste, Okuyanlar/Okumayanlar, arama | Kodda var; tasarımda ek olarak "Okumayanlara hatırlat" |
| [Okumayanlara hatırlat](okumayanlara-hatirlat.md) | Duyuruyu açmamışlara yeniden bildirim (24 saatte bir) | Tasarlandı — henüz kodda yok |
| [Mesaj ekleri](ekler.md) | Sürükle-bırak, 50 MB / 20 dosya, 7 gün, indirme, küçültme | Kodda var; tasarımda ek olarak açılır "Ekler (N)", önizleme, "indirilsin mi?" |
| [Alıcıların dosya yüklemesi](alicilarin-dosya-yuklemesi.md) | "Alıcılar bu mesaja dosya yükleyebilsin", alıcının "Yükle"si | Tasarlandı — henüz kodda yok |
| [Düzeltme, silme, kutudan kaldırma](duzeltme-ve-silme.md) | "Düzelt", "Mesajı sil", "Kutumdan kaldır"; tasarımda toplu silme | Kodda var; tasarımda ek olarak toplu seçip silme |
| [Velinin kopyası](velinin-kopyasi.md) | Çocuğa giden mesajın velideki kopyası, "Ada için" | Kodda var; tasarımda ek olarak her çocuk ayrı oturum, "Kopya · Ada" |
| [Bana kim yazabilir ve engelleme](bana-kim-yazabilir.md) | Kişisel mesaj ayarı, engel listesi | Kodda var; tasarımda ek olarak kişinin ayarı okulun ayarını yalnız daraltır |
| [Okulun mesaj ayarları (çark)](okulun-mesaj-ayarlari.md) | Kim kime yazar, günlük sınır, dosya ekleme izni, sessiz saatler | Tasarlandı — henüz kodda yok |
| [Mesaj etiketleri](etiketler.md) | Şikâyet · Önemli · Durum; seçme, rozet, süzgeç | Tasarlandı — henüz kodda yok |
| [Önemli etiketi](onemli-etiketi.md) | Acil duyuru gibi: ayrı sesli kanal, şerit, zorunlu okundu | Tasarlandı — henüz kodda yok |
| [Şikâyet etiketi](sikayet-etiketi.md) | Gönderildi → Bakıldı → Çözüldü, 1 gün / 1 hafta silinme | Tasarlandı — henüz kodda yok |
| [Bu mesajı bildir](bu-mesaji-bildir.md) | Rahatsız edici mesajı yönetime bildirme, inceleme, yaptırım | Tasarlandı — henüz kodda yok |
| [Hazır mesaj şablonları](hazir-sablonlar.md) | Şablon çipleri, {öğrenci} {sınıf} {veli} alanları | Tasarlandı — henüz kodda yok |
| [İleri tarihli gönderim](ileri-tarihli-gonderim.md) | "Şimdi / İleri tarihte", "Planlanan" kutusu | Tasarlandı — henüz kodda yok |
| [Ajandaya ve hatırlatıcıya ekle](ajandaya-ve-hatirlaticiya-ekle.md) | "Alıcıların ajandasına ekle", hatırlatıcı zamanları, alıcının ajandası | Tasarlandı — henüz kodda yok |

Okuma sırası:

- **Öğrenci:** [Gelen kutusu](kutu.md) → [Mesajı okuma](mesaj-okuma.md) → [Yeni mesaj](yeni-mesaj.md) → [Mesaj ekleri](ekler.md) →
  [Duyuru](duyuru.md) → [Düzeltme ve silme](duzeltme-ve-silme.md) → tasarımda [Etiketler](etiketler.md),
  [Şikâyet etiketi](sikayet-etiketi.md), [Bu mesajı bildir](bu-mesaji-bildir.md).
- **Veli:** [Gelen kutusu](kutu.md) → [Velinin kopyası](velinin-kopyasi.md) → [Mesajı okuma](mesaj-okuma.md) →
  [Yeni mesaj](yeni-mesaj.md) → [Mesaj ekleri](ekler.md) → [Bana kim yazabilir](bana-kim-yazabilir.md) → tasarımda
  [Alıcıların dosya yüklemesi](alicilarin-dosya-yuklemesi.md), [Önemli etiketi](onemli-etiketi.md), [Şikâyet etiketi](sikayet-etiketi.md).
- **Öğretmen:** [Yeni mesaj](yeni-mesaj.md) → [Mesaj ekleri](ekler.md) → [Okundu bilgisi](okundu-bilgisi.md) →
  [Düzeltme ve silme](duzeltme-ve-silme.md) → [Duyuru](duyuru.md) (toplu mesaj yetkisiyle) → [Bana kim yazabilir](bana-kim-yazabilir.md) →
  tasarımda [Hazır şablonlar](hazir-sablonlar.md), [İleri tarihli gönderim](ileri-tarihli-gonderim.md),
  [Ajandaya ve hatırlatıcıya ekle](ajandaya-ve-hatirlaticiya-ekle.md), [Önemli etiketi](onemli-etiketi.md).
- **Müdür:** [Duyuru](duyuru.md) → [Okundu bilgisi](okundu-bilgisi.md) → [Okumayanlara hatırlat](okumayanlara-hatirlat.md) →
  [Yeni mesaj](yeni-mesaj.md) → tasarımda [Okulun mesaj ayarları](okulun-mesaj-ayarlari.md), [Şikâyet etiketi](sikayet-etiketi.md),
  [Bu mesajı bildir](bu-mesaji-bildir.md), [Önemli etiketi](onemli-etiketi.md).
- **Servisçi:** [Gelen kutusu](kutu.md) → [Mesajı okuma](mesaj-okuma.md) → [Bana kim yazabilir](bana-kim-yazabilir.md) →
  [Yeni mesaj](yeni-mesaj.md) (bugünkü açık ve tasarımdaki alıcılar).

## Rol tablosu

Hücre: o rolün bu alt özellikte yaptığı (bağlantı ilgili belgeye gider). "—": bu rol kullanmaz. "(tasarım)": henüz kodda yok.

| Alt özellik | Öğrenci | Veli | Öğretmen | Çalışan | Müdür | Servisçi | Yönetici | Ziyaretçi |
|---|---|---|---|---|---|---|---|---|
| Gelen kutusu ve gönderilenler | [kutusunu kullanır](kutu.md) | [kendi mesajları ve çocuğunun kopyaları](kutu.md) | [kutusunu kullanır](kutu.md) | [öğretmen hesabıyla kullanır; tasarımda rolsüz çalışan da](kutu.md) | [kutusunu kullanır; tasarımda çark](kutu.md) | [kutusunu kullanır](kutu.md) | — | — |
| Mesajı okuma | [okur, kutusundan kaldırır](mesaj-okuma.md) | [okur; "… için" notunu görür](mesaj-okuma.md) | [okur; gönderdiğinde okundu listesi](mesaj-okuma.md) | [öğretmen gibi](mesaj-okuma.md) | [okur; duyuruda okundu listesi](mesaj-okuma.md) | [okur](mesaj-okuma.md) | — | — |
| Yeni mesaj ve alıcı seçimi | [öğretmenlerine ve müdüre yazar](yeni-mesaj.md) | [çocuğunun öğretmenlerine ve müdüre yazar; tasarımda servisçiye de](yeni-mesaj.md) | [okuldaki herkese; toplu yetkiyle sınıfa ve gruba](yeni-mesaj.md) | [ek rolündeki yetkiyle toplu ya da bütün okula; tasarımda rolsüz çalışan yönetime](yeni-mesaj.md) | [kişiye, sınıfa, gruba, bütün okula](yeni-mesaj.md) | [bugün kimseye; tasarımda velilerine ve yönetime](yeni-mesaj.md) | — | — |
| Duyuru | [alır](duyuru.md) | [alır; çocuğununkinin kopyasını da](duyuru.md) | [alır; toplu mesaj yetkisiyle yayımlar](duyuru.md) | [yetkisiyle yayımlar](duyuru.md) | [yayımlar; tasarımda Tür ve Hedef](duyuru.md) | [alır](duyuru.md) | — | — |
| Okundu bilgisi | [kendi mesajında görür](okundu-bilgisi.md) | [kendi mesajında görür](okundu-bilgisi.md) | [gönderdiklerinde görür](okundu-bilgisi.md) | [gönderdiklerinde görür](okundu-bilgisi.md) | [gönderdiklerinde ve okulun duyurularında görür](okundu-bilgisi.md) | — (bugün mesaj gönderemez) | — | — |
| Okumayanlara hatırlat | [okumadıysa hatırlatma alır (tasarım)](okumayanlara-hatirlat.md) | [okumadıysa alır (tasarım)](okumayanlara-hatirlat.md) | [duyurusunda kullanır (tasarım)](okumayanlara-hatirlat.md) | [duyurusunda kullanır (tasarım)](okumayanlara-hatirlat.md) | [duyurusunda kullanır (tasarım)](okumayanlara-hatirlat.md) | [okumadıysa alır (tasarım)](okumayanlara-hatirlat.md) | — | — |
| Mesaj ekleri | [ekler, indirir; tasarımda okul izin verirse ekler](ekler.md) | [ekler, indirir; tasarımda okul izniyle](ekler.md) | [ekler, indirir](ekler.md) | [öğretmen gibi](ekler.md) | [ekler, indirir](ekler.md) | [indirir](ekler.md) | — | — |
| Alıcıların dosya yüklemesi | [izinli mesaja yükler (tasarım)](alicilarin-dosya-yuklemesi.md) | [imzalı formu yükler (tasarım)](alicilarin-dosya-yuklemesi.md) | [izni verir, dosyaları görür (tasarım)](alicilarin-dosya-yuklemesi.md) | [öğretmen gibi (tasarım)](alicilarin-dosya-yuklemesi.md) | [izni verir (tasarım)](alicilarin-dosya-yuklemesi.md) | — (karar yok) | — | — |
| Düzeltme, silme, kutudan kaldırma | [kendi mesajını düzeltir, siler; geleni kaldırır](duzeltme-ve-silme.md) | [aynı](duzeltme-ve-silme.md) | [aynı](duzeltme-ve-silme.md) | [aynı](duzeltme-ve-silme.md) | [aynı](duzeltme-ve-silme.md) | [geleni kaldırır](duzeltme-ve-silme.md) | — | — |
| Velinin kopyası | [mesajı kendisi alır; kopyası velisine](velinin-kopyasi.md) | [çocuğuna gidenin kopyasını alır](velinin-kopyasi.md) | [öğrenciye yazınca veliye de gider](velinin-kopyasi.md) | [öğretmen gibi](velinin-kopyasi.md) | [öğretmen gibi](velinin-kopyasi.md) | — | — | — |
| Bana kim yazabilir | — (ayar yok) | [ayarlar](bana-kim-yazabilir.md) | [ayarlar](bana-kim-yazabilir.md) | [ayarlar](bana-kim-yazabilir.md) | [ayarlar](bana-kim-yazabilir.md) | [ayarlar](bana-kim-yazabilir.md) | — | — |
| Okulun mesaj ayarları | [kurallarına tabidir (tasarım)](okulun-mesaj-ayarlari.md) | [kurallarına tabidir (tasarım)](okulun-mesaj-ayarlari.md) | [sessiz saatlerden yararlanır (tasarım)](okulun-mesaj-ayarlari.md) | ["Herkese mesaj" yetkisiyle ayarlar (tasarım)](okulun-mesaj-ayarlari.md) | [çarktan ayarlar (tasarım)](okulun-mesaj-ayarlari.md) | — (karar yok) | — | — |
| Mesaj etiketleri | [görür, süzer; Şikâyet seçer (tasarım)](etiketler.md) | [görür, süzer; Şikâyet seçer (tasarım)](etiketler.md) | [seçer, süzer (tasarım)](etiketler.md) | [öğretmen gibi (tasarım)](etiketler.md) | [seçer, süzer (tasarım)](etiketler.md) | [görür, süzer (tasarım)](etiketler.md) | — | — |
| Önemli etiketi | [öncelikli alır; koyamaz (öneri)](onemli-etiketi.md) | [öncelikli alır; koyamaz (öneri)](onemli-etiketi.md) | [koyar (tasarım)](onemli-etiketi.md) | [yetkiliyse koyar (tasarım)](onemli-etiketi.md) | [koyar (tasarım)](onemli-etiketi.md) | [öncelikli alır (tasarım)](onemli-etiketi.md) | — | — |
| Şikâyet etiketi | [gönderir, durumu izler (tasarım)](sikayet-etiketi.md) | [gönderir, durumu izler (tasarım)](sikayet-etiketi.md) | [gönderir (tasarım)](sikayet-etiketi.md) | [gönderir; yetkisiyle bakar (öneri)](sikayet-etiketi.md) | [bakar, çözer (tasarım)](sikayet-etiketi.md) | [gönderir (tasarım)](sikayet-etiketi.md) | — | — |
| Bu mesajı bildir | [bildirir (tasarım)](bu-mesaji-bildir.md) | [bildirir (tasarım)](bu-mesaji-bildir.md) | [bildirir (tasarım)](bu-mesaji-bildir.md) | ["Herkese mesaj" yetkisiyle inceler (tasarım)](bu-mesaji-bildir.md) | [inceler, uyarır, kısıtlar (tasarım)](bu-mesaji-bildir.md) | — (karar yok) | — | — |
| Hazır şablonlar | — | [önizlemede var, karar yok](hazir-sablonlar.md) | [kullanır (tasarım)](hazir-sablonlar.md) | [kullanır (tasarım)](hazir-sablonlar.md) | [kullanır (tasarım)](hazir-sablonlar.md) | [önizlemede var, karar yok](hazir-sablonlar.md) | — | — |
| İleri tarihli gönderim | — | [önizlemede var, karar yok](ileri-tarihli-gonderim.md) | [planlar (tasarım)](ileri-tarihli-gonderim.md) | [planlar (tasarım)](ileri-tarihli-gonderim.md) | [planlar (tasarım)](ileri-tarihli-gonderim.md) | [önizlemede var, karar yok](ileri-tarihli-gonderim.md) | — | — |
| Ajandaya ve hatırlatıcıya ekle | [ajandasında görür (tasarım)](ajandaya-ve-hatirlaticiya-ekle.md) | [ajandasında görür (tasarım)](ajandaya-ve-hatirlaticiya-ekle.md) | [ekler (tasarım)](ajandaya-ve-hatirlaticiya-ekle.md) | [toplu mesaj yetkisiyle ekler (tasarım)](ajandaya-ve-hatirlaticiya-ekle.md) | [ekler (tasarım)](ajandaya-ve-hatirlaticiya-ekle.md) | [alıcıysa görür (tasarım)](ajandaya-ve-hatirlaticiya-ekle.md) | — | — |

Notlar:

- **Çalışan** sütunu: bugün kodda ek görevli kişi öğretmen hesabıyla bir ek rol taşır. "Sınıfa veya gruba toplu mesaj atar"
  Müdür Yardımcısı, Rehber Öğretmen ve Zümre Başkanı şablonlarında, "Okuldaki herkese mesaj atar" yalnız Müdür Yardımcısı'nda
  açık gelir; okulun hazır Öğretmen rolünde ikisi de kapalıdır ([Hazır şablonlar](../roller-yetkiler/hazir-sablonlar.md)). Tasarımda
  (çalışan tanımı) rolsüz çalışan Mesajlar'da okulun duyurularını görür ve yönetime yazabilir ([Rolsüz çalışan](../ogretmenler-calisanlar/rolsuz-calisan.md)).
- **Öğretmen ya da müdür olan veli:** çocuğuna giden mesajın kopyasını kendi hesabında alır; kendi gönderdiği mesajın alıcıları
  arasında çocuğu varsa kopya kendi gelen kutusuna da düşer (bilinen açık, [Velinin kopyası](velinin-kopyasi.md)).
- **Yönetici** (sistem yöneticisi) okula bağlı olmadığı için Mesajlar'a giremez ("Bu işlem bir okula bağlı olmayı gerektirir.
  Yönetici hesabı bir okula ait değildir."); bütün siteye duyuruyu yönetim panelinden yapar ([Site duyurusu](../yonetim/site-duyurusu.md)).
  **Giriş yapmamış ziyaretçi**, rolsüz yetişkin (bugün) ve tasarımdaki **destek**, **eğitmen** ve **tahta** hesapları Mesajlar'ı kullanmaz.
- Bugün Mesajlar okulun kapatabileceği bir bölüm değil; Tasarım 1 önizlemesinin Özellikler listesinde "Mesajlar" da var (karar
  tanımlarda yazılı değil) ([Bölüm aç/kapat](../ozellikler/bolum-ac-kapat.md)).

Rol kapıları: [Öğrenci](../roller/ogrenci.md) · [Veli](../roller/veli.md) · [Öğretmen](../roller/ogretmen.md) ·
[Çalışan](../roller/calisan.md) · [Müdür](../roller/mudur.md) · [Servisçi](../roller/servisci.md) ·
[Yönetici](../roller/yonetici.md) · [Ziyaretçi](../roller/ziyaretci.md). Bütün özellikler: [features/](../README.md).

## İlgili öbür klasörler

- [Bildirimler](../bildirim/README.md) — "<gönderen>: <konu>" ve "Duyuru: <konu>" bildirimleri, telefon bildirimi; tasarımda panelde
  "Mesaj" ve "Duyuru" sekmeleri, "Önemli duyurular" kanalı.
- [Takvim ve ajanda](../takvim/README.md) — duyurudan alıcıların ajandasına eklenen "Duyuru" satırları (tasarım).
- [Hatırlatıcılar](../hatirlatici/README.md) — duyurudan kurulan hatırlatmalar (tasarım).
- [Anketler](../anket/README.md) — anket hedefi duyuru gibi çözülür; tasarımda anketi mesaja ekleme.
- [Yazı düzenleyici](../yazi-yazma/README.md) — mesaj, duyuru ve şablon metni (tasarım).
- [Dosya alanı ve küçültme](../okul-disk/README.md) — ekler okulun dosya alanına sayılır; fotoğraf küçültme.
- [Ödevler](../odev/README.md) — aynı ek alanı ve açılır "Ekler" kutusu; öğrencinin teslim dosyaları.
- [Portallar](../portallar/README.md) — velide her çocuk ayrı oturum (tasarım).
- [Roller ve yetkiler](../roller-yetkiler/README.md) — "Sınıfa veya gruba toplu mesaj atar", "Okuldaki herkese mesaj atar"; önerilen "mesaj.sablon".
- [Öğretmenler ve çalışanlar](../ogretmenler-calisanlar/README.md) — rolsüz çalışanın mesajları (tasarım).
- [Servis](../servis/README.md) — "bugün servise binmedi" uyarısı "Önemli" önceliğinde (tasarım); tasarımda veli–servisçi yazışması.
- [Toplantılar](../toplanti/README.md) — "Katılmayanlara mesaj gönder" (tasarım).
- [Destek talepleri](../destek/README.md) — Eğitim Evi ekibine yazışma; okulun şikâyetinden ayrıdır.
- [İşlem kaydı](../islem-kaydi/README.md) — bugün mesajlar kayda girmez; tasarımda okulun mesaj ayarları, şikâyete bakma/çözme ve bildirilen mesaj işlemleri girer.
- [KVKK ve gizlilik](../kvkk-ve-gizlilik/README.md) — okunma zamanı, ek saklama süresi, tasarımda mesajların 1 yıl saklanması.
- [Menü, üst şerit ve arama](../menu-ve-arama/README.md) — "Mesajlar" menü satırı; üstteki arama bugün mesajları süzmez.
- [Ana sayfa](../ana-sayfa/README.md) — velinin "Mesajlar" kutucuğu.
- [Hesap ayarları](../ayarlar/README.md) — bildirim tercihleri; tasarımda e-postaya yalnız önemli okul duyuruları.
- [Uygulama](../uygulama/README.md) — Android uygulamasına gelecek Mesajlar.
- [Okulun özellikleri](../ozellikler/README.md) — tasarımda "Mesajlar"ın da kapatılabilmesi (karar yok).

## Kod belgeleri

- Sunucu: [sunucu/bolumler/mesaj.md](../../sunucu/bolumler/mesaj.md) (`/api/mesajlar`: kutu, hedefler, gönderme, düzeltme, silme,
  okundu, ayar), [sunucu/bolumler/ekler.md](../../sunucu/bolumler/ekler.md) (`/api/ek`: ek yükleme, bağlama, indirme, temizlik),
  [sunucu/bolumler/anket.md](../../sunucu/bolumler/anket.md) (`mesajAlicilariCoz` kullanımı), [sunucu/yetki.md](../../sunucu/yetki.md)
  (`mesaj.toplu`, `mesaj.herkese`, `okulGerek`), [sunucu/iliskiler.md](../../sunucu/iliskiler.md), [sunucu/api.md](../../sunucu/api.md),
  [sunucu/push.md](../../sunucu/push.md).
- Depo: [sunucu/veri/depo/mesajlar.md](../../sunucu/veri/depo/mesajlar.md) (`mesajlar`, `mesaj_alicilari`, `mesaj_okumalari`),
  [sunucu/veri/depo/ekler.md](../../sunucu/veri/depo/ekler.md), [sunucu/veri/depo/kullanicilar.md](../../sunucu/veri/depo/kullanicilar.md)
  (`mesaj_kimden`, `mesaj_engelleri`, veli bağları), [sunucu/veri/depo/genel.md](../../sunucu/veri/depo/genel.md) (bildirimler),
  [sunucu/veri/sema/SEMA.md](../../sunucu/veri/sema/SEMA.md).
- Ön yüz: [public/js/parcalar/19-mesajlar.md](../../public/js/parcalar/19-mesajlar.md) (kutu, okuma, okundu listesi, düzeltme, yeni
  mesaj, ayar kartı), [public/js/parcalar/04d-ekler.md](../../public/js/parcalar/04d-ekler.md) (ek alanı ve ek listesi),
  [public/js/parcalar/04f-resim-kucult.md](../../public/js/parcalar/04f-resim-kucult.md), [public/js/parcalar/25-tiklama.md](../../public/js/parcalar/25-tiklama.md)
  (kutu düğmeleri, silme, ayar), [public/js/parcalar/06-menu.md](../../public/js/parcalar/06-menu.md),
  [public/js/parcalar/08-ana-sayfa.md](../../public/js/parcalar/08-ana-sayfa.md), [public/js/parcalar/03-mesaj-modal.md](../../public/js/parcalar/03-mesaj-modal.md).
- Testler: [testler/test-mesaj.md](../../testler/test-mesaj.md), [testler/test-yorum-ek.md](../../testler/test-yorum-ek.md),
  [testler/test-etut.md](../../testler/test-etut.md) (mesaj düzeltme), [testler/test-anket.md](../../testler/test-anket.md),
  [testler/test-servis-konum.md](../../testler/test-servis-konum.md), [testler/test-bildirim.md](../../testler/test-bildirim.md),
  [testler/yetki-denetimi.md](../../testler/yetki-denetimi.md), [testler/girdi-denetimi.md](../../testler/girdi-denetimi.md),
  [testler/buton-denetimi.md](../../testler/buton-denetimi.md).
- Kullanıcıya dönük anlatım: [belge/KILAVUZ.md](../../belge/KILAVUZ.md) ("Neler var", "Ekler (mesaj ve ödev)", "Anketler ve duyuru
  okundu bilgisi", "Sonradan düzeltme", "Veli paneli", "Yetki listesi").
