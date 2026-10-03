# Yazı düzenleyici · Düzenleyicinin bulunduğu yerler

**Durum:** Tasarlandı — henüz kodda yok (bugün bu alanların hepsi düz yazı kutusu ya da hiç yok; Tasarım 1 önizlemesinde çoğunda
düzenleyici çalışır hâlde var).

Ortak yazı düzenleyicisinin sitede hangi uzun yazı alanlarında çıktığı, kimin orada yazdığı ve hangi alanların düz yazı kaldığı.

## Ne işe yarar

Kullanıcı 30 Eylül'de "HTML editör yazı yazarken, ödev vb. — her feature ve detayları olacak" dedi; düzenleyicinin bulunacağı
her uzun yazı alanı bunun üzerine tanımda tek tek yazıldı. 1 Ekim'de "Düzenleyici ödev verirken ve mesaj yazarken de çıkacak"
diye ekledi; 2 Ekim'de önizlemeye bakıp düzenleyicinin yalnız öğretmende değil her yerde ve her rolde eksiksiz olmasını istedi
("dediğim şeylerin eksikliği olmasın").

İlke: düzenleyici **tek bir bileşendir** ve her yerde **aynı araç çubuğuyla** çıkar ([Araç çubuğunun düzeni](arac-cubugu.md)).
Bir alanda kalın olan yazı öbür alanda da aynı kurallarla kalın olur; öğrenciyle öbür roller arasındaki tek fark, öğrencide
**HTML görünümü (</>)** düğmesinin olmamasıdır ([HTML görünümü](html-gorunumu.md)). Kısa alanlar (ad, başlık, kullanıcı adı)
**düz yazı** kalır.

## Nereden açılır

Ayrı bir sayfası yok: aşağıdaki pencerelerde ve sayfalarda yazı alanının hemen üstünde araç çubuğu olarak görünür. Önizlemede
alanın başlığı çoğu yerde **"Açıklama:"** (destek talebinde yanıtta **"Yanıtın:"**, takvim etkinliğinde **"Not"**, sınav açarken
**"Konular"**).

| Yer (tanımdaki ad) | Kim yazar | Pencere ve alan (Tasarım 1 önizlemesi) | Önizlemede düzenleyici | Ayrıntı |
|---|---|---|---|---|
| Ödev açıklaması | öğretmen; "Ödev verir" yetkili çalışan | **"Yeni ödev"** → **"Açıklama:"** | var | [Ödev verme](../odev/odev-verme.md) |
| Ödev teslim metni | öğrenci | ödev penceresinin teslim bölümü | **yok** (istek denetimi eksik olarak işaretledi) | [Teslim metni](../odev/teslim-metni.md) |
| Mesaj ve yanıt | mesaj yazan herkes (öğrenci, veli, öğretmen, çalışan, müdür, servisçi) | **"Yeni mesaj"** / **"Yanıtla"** → **"Açıklama:"** | var | [Yeni mesaj](../mesaj/yeni-mesaj.md) |
| Duyuru ve toplu mesaj | müdür, toplu mesaj yetkilisi | aynı pencere, müdürde **"Tür:"** **"Duyuru"** | var | [Duyuru](../mesaj/duyuru.md) |
| Hazır mesaj şablonu | öğretmen, müdür, çalışan | **"Şablon:"** çipine basınca şablonun metni düzenleyiciye dolar; {öğrenci}, {sınıf}, {veli} alanları çip olarak görünür | var (seçim) | [Hazır şablonlar](../mesaj/hazir-sablonlar.md) |
| Anket açıklaması | öğretmen, müdür, yetkili çalışan | **"Anket oluştur"** sayfası → **"Açıklama:"** | var | [Anket oluştur](../anket/anket-olustur.md) |
| Anket soru açıklaması | aynı | soru kartı | yok | [Anket oluştur](../anket/anket-olustur.md) |
| Quiz talimatı ve soru metni | öğretmen | quiz bölümü (quiz soru düzenleyicisiyle birlikte) | yok | [Quiz ekleme](../quiz/quiz-ekleme.md), [Soru resmi ve matematik](../quiz/soru-resmi-ve-matematik.md) |
| Sınav açıklaması | öğretmen, müdür, yetkili çalışan | **"Sınav aç"** penceresi → **"Konular"** | var | [Yeni sınav](../sinav/yeni-sinav.md) |
| Takvim etkinliği | müdür (takvim yetkilisi) | takvimde **"Etkinlik ekle"** → **"Not"** | var | [Etkinlik ekleme](../takvim/etkinlik-ekleme.md) |
| Ajanda notu | ajandası olan herkes | Takvim sayfasında ayın altındaki ajanda | yok | [Ajanda](../takvim/ajanda.md) |
| Hatırlatıcı açıklaması | hatırlatıcı kuran herkes (öğrenci, veli, öğretmen, çalışan, müdür, servisçi) | **"Hatırlatıcı ekle"** / **"Hatırlatıcı"** → **"Açıklama:"** | var | [Hatırlatıcı kurma](../hatirlatici/hatirlatici-kurma.md) |
| Toplantı açıklaması | müdür, öğretmen, yetkili çalışan | **"Toplantı aç"** → **"Açıklama:"** | var | [Toplantı açma](../toplanti/toplanti-acma.md) |
| Eğitim videosu açıklaması | eğitmen | **"Video yükle"** ve video bilgileri → **"Açıklama"** | var | [Video bilgileri](../egitim-icerikleri/video-bilgileri.md), [Video yükleme](../egitim-icerikleri/video-yukleme.md) |
| Başarı açıklaması | müdür, yetkili çalışan ve öğretmen | **"Başarı ekle"** → **"Açıklama"** | var | [Başarı ekleme](../basarilar/basari-ekleme.md) |
| Destek talebi ve kullanıcının yanıtı | giriş yapmış herkes | **"Yeni destek talebi"** → **"Açıklama:"**; açık talepte **"Yanıtın:"** | var | [Destek sayfası](../destek/destek-sayfasi.md), [Talep yazışması](../destek/talep-yazismasi.md) |
| Destek ekibinin yanıtı | destek, yönetici | panelde talebin altında **"Yanıtın"** | **düz yazı kutusu** (en çok 2000 karakter, yer tutucu "Kullanıcıya “Eğitim Evi · Yetkili” olarak gider.") | [Talep yönetimi](../destek/talep-yonetimi.md) |
| Site duyurusu | yönetici | panelde **"Duyuru koy"** | **ayrı, küçük bir araç çubuğu** (aşağıda) | [Site duyurusu](../yonetim/site-duyurusu.md) |
| Okul sayfası tanıtım yazısı | müdür, okul sayfası yetkilisi | **"Okul sayfası"** → **"Tanıtım yazısı"** penceresi → **"Yayımla"** | var | [Tanıtım ve fotoğraflar](../okul-sayfasi/tanitim-ve-fotograflar.md) |
| Okul sayfasının "Yazı" bloğu | aynı | blok düzenleyicide yazı bloğu | var | [Blok düzenleyici](../okul-sayfasi/blok-duzenleyici.md) |

Hatırlatıcı açıklaması ve okul sayfasının yazı bloğu tanımdaki 30 Eylül listesinde adıyla geçmez; önizlemede ve ilgili
özelliklerin tasarımında düzenleyiciyle çizildikleri için listeye alındı.

**Düz yazı kalan alanlar** (araç çubuğu yok): adlar, başlıklar ("Başlık:", "Konu:", "Etkinlik", ödevin adı), kullanıcı adı,
arama kutuları, tarih ve saat alanları. Tanımın listesinde olmayan öbür alanlar (ör. servisçinin günlük notu, açılış sayfasındaki
yorum, öğrenci hesabındaki adres ve not) bugünkü gibi düz yazıdır; değişmesi istenirse tanıma eklenmesi gerekir.

## Adım adım

### Bugün (kodda)

Düzenleyici yok. Uzun yazı alanları düz yazı kutusudur: yazdığın satır sonlarıyla birlikte saklanır ve **olduğu gibi** (harf harf)
gösterilir; `<b>` gibi bir şey yazarsan okuyan da `<b>` görür. Bugün var olan uzun alanlar: ödev açıklaması, mesaj metni ("Mesaj"),
anket açıklaması ("Açıklama (isteğe bağlı)"), takvim etkinliğinin açıklaması, hatırlatıcı açıklaması ("Açıklama (isteğe bağlı)"),
okul sayfası tanıtım yazısı ("Okulunu birkaç cümleyle anlat"), quiz sorusunun metni. Sınırları [Karakter sayacı](karakter-sayaci.md)
belgesinde. Sınav açıklaması, toplantı, başarı, destek talebi, eğitim videosu ve site duyurusu bugün hiç yok.

### Öğrenci (tasarım)

1. **Mesajlar** → **"Yeni mesaj"** ya da bir mesajda **"Yanıtla"**: **"Açıklama:"** altındaki düzenleyiciyle yaz.
2. **Ödevler** → ödevin penceresi: teslim metnini düzenleyiciyle yaz ([Teslim metni](../odev/teslim-metni.md); önizlemede henüz yok).
3. **Hatırlatıcılar** → **"Hatırlatıcı ekle"**: **"Açıklama:"**.
4. Üst şeritteki **"Destek"** → **"Yeni destek talebi"**: **"Açıklama:"**; talebin altında **"Yanıtın:"**.
5. Her yerde araç çubuğunda **</> yok**; öbür bütün düğmeler var.

### Veli (tasarım)

Mesaj ve yanıt, hatırlatıcı açıklaması, destek talebi ve yanıtı. Velide her çocuk ayrı oturumdur; düzenleyici hangi oturumda
açıldıysa aynıdır. </> var.

### Öğretmen (tasarım)

Ödev açıklaması, mesaj ve yanıt, şablonla mesaj, anket açıklaması, quiz talimatı ve soru metni, sınav açarken "Konular", toplantı
açıklaması, hatırlatıcı, destek talebi; yetkisi varsa başarı açıklaması ve okul sayfası tanıtım yazısı. </> var.

### Çalışan (özel roller dahil, tasarım)

Rolünün verdiği yetkilere göre öğretmenle aynı yerler (ör. "Ödev verir" yetkisiyle ödev açıklaması, toplantı açma yetkisiyle
toplantı açıklaması, başarı ekleme yetkisiyle başarı açıklaması); mesaj, hatırlatıcı ve destek talebi herkes gibi. Rolsüz
çalışanda yalnız herkesin yazdığı yerler. </> var.

### Müdür (tasarım)

Mesaj ve duyuru (toplu mesaj), şablon, anket, sınav, takvimde etkinlik, toplantı, başarı, okul sayfası tanıtım yazısı ve yazı
bloğu, hatırlatıcı, destek talebi. </> var.

### Servisçi (tasarım)

Mesaj ve yanıt, hatırlatıcı açıklaması, destek talebi. Servis notu (en çok 200 karakter) düz yazı kalır
([Günlük not](../servis/gunluk-not.md)). </> var.

### Eğitmen (tasarım)

Video açıklaması (`/panel/egitmen` → **"Video yükle"** ya da videonun bilgileri) ve destek talebi. </> var.

### Destek (tasarım)

Panelde destek talebine yanıt. Tanıma göre ortak düzenleyiciyle; önizlemede bugün düz bir yazı kutusu. </> var.

### Yönetici (tasarım)

Panelde **"Duyuru koy"** (site duyurusu) ve destek talebine yanıt. </> var.

## Kurallar ve sınırlar

- Tek bileşen, tek araç çubuğu; öğrencide yalnız </> eksik. Sunucudaki temizleme kuralı **öğrenci dahil herkes için aynı**
  ([İzinli ve izinsiz kod](izinli-ve-izinsiz-kod.md)).
- Her alanın ekran yeri ve karakter sınırı yapı belgesinde tek tek yazılacak (tanımda alan alan sınır henüz yok).
- Bugünden kalan düz yazı kayıtlar olduğu gibi gösterilir ([Okurken görünüm](okurken-gorunum.md)).
- Kullanıcının yazdığı içerikte emoji serbesttir (kullanıcının 1 Ekim'de gösterdiği örnek düzenleyicideki ödev açıklamasında da
  vardı; Tasarım 1 önizlemesindeki örnek açıklamalarda emoji yok); "arayüzde emoji yok" kuralı yalnız sitenin kendi metinleri içindir.
- **Site duyurusu çelişkisi:** sistem tanımının eski maddesi site duyurusu için ayrı ve küçük bir düzenleyici tarif ediyordu: Kalın,
  İtalik, Altı çizili, sitenin paletinden 6 renk, Bağlantı (yalnız https), "Biçimi temizle", canlı önizleme, en çok 500 karakter.
  Panelin önizlemesi bunu çiziyor (düğmelerin üstünde "Kalın", "İtalik", "Altı çizili", "Renk: Kırmızı / Turuncu / Sarı / Yeşil /
  Mavi / Mor", "Bağlantı (yalnız https)", "Biçimi temizle"; altta "0 / 500"). Kullanıcının daha sonraki kararı (30 Eylül listesi ve
  1 Ekim "tasarım kesin") site duyurusunu da ortak düzenleyicinin alanları arasına koyuyor; bu belge son karara göre yazıldı, panelin
  önizlemesi ve eski tanım maddesi buna göre güncellenmeli. 500 karakter sınırı için ayrıca bir karar yok, eski maddeden kalıyor.
- **Destek ekibinin yanıtı** tanımda "destek talebi ve yanıtı" olarak düzenleyicili; panelin önizlemesinde düz yazı kutusu
  (en çok 2000 karakter). Kodlanırken düzenleyici konmalı.

## Kardeşler ve ilgili

**Kardeşler:** [Araç çubuğunun düzeni](arac-cubugu.md) · [HTML görünümü](html-gorunumu.md) ·
[İzinli ve izinsiz kod](izinli-ve-izinsiz-kod.md) · [Karakter sayacı](karakter-sayaci.md) · [Okurken görünüm](okurken-gorunum.md) ·
[Telefonda araç çubuğu](telefonda.md) · [Fotoğraf ekle](fotograf-ekle.md) · [Bağlantı ekle](baglanti-ekle.md).

**İlgili:** [Ödevler](../odev/README.md), [Mesajlar](../mesaj/README.md), [Anketler](../anket/README.md), [Quiz](../quiz/README.md),
[Sınavlar](../sinav/README.md), [Takvim](../takvim/README.md), [Hatırlatıcılar](../hatirlatici/README.md),
[Toplantılar](../toplanti/README.md), [Eğitim içerikleri](../egitim-icerikleri/README.md), [Başarılar](../basarilar/README.md),
[Destek](../destek/README.md), [Site yönetimi](../yonetim/README.md), [Okul sayfası](../okul-sayfasi/README.md).

## Kod tarafı

Bugün düzenleyici yok. Bugünkü düz yazı alanları:
[public/js/parcalar/11-ogretmen-odev.md](../../public/js/parcalar/11-ogretmen-odev.md) (ödev açıklaması),
[public/js/parcalar/19-mesajlar.md](../../public/js/parcalar/19-mesajlar.md) (mesaj metni),
[public/js/parcalar/19b-anketler.md](../../public/js/parcalar/19b-anketler.md) (anket açıklaması),
[public/js/parcalar/17-takvim.md](../../public/js/parcalar/17-takvim.md) (etkinlik açıklaması),
[public/js/parcalar/19h-hatirlaticilar.md](../../public/js/parcalar/19h-hatirlaticilar.md) (hatırlatıcı açıklaması),
[public/js/parcalar/19g-okul-sayfasi.md](../../public/js/parcalar/19g-okul-sayfasi.md) (tanıtım yazısı),
[public/js/parcalar/14c-quiz.md](../../public/js/parcalar/14c-quiz.md) (soru metni). Sunucu tarafında aynı alanlar
[sunucu/bolumler/odev.md](../../sunucu/bolumler/odev.md), [sunucu/bolumler/mesaj.md](../../sunucu/bolumler/mesaj.md),
[sunucu/bolumler/anket.md](../../sunucu/bolumler/anket.md), [sunucu/bolumler/takvim.md](../../sunucu/bolumler/takvim.md),
[sunucu/bolumler/hatirlatici.md](../../sunucu/bolumler/hatirlatici.md), [sunucu/bolumler/okul-sayfasi.md](../../sunucu/bolumler/okul-sayfasi.md),
[sunucu/bolumler/quiz.md](../../sunucu/bolumler/quiz.md); hepsi yazıyı düz metin olarak saklar. Kodlanınca her alan ortak
düzenleyiciye geçer, sunucu her kayıtta izin listesi temizleyicisinden geçirir; bu bölüm ve Durum satırı güncellenir.

## Sık sorulanlar

- **Ödevin adına da kalın yazabilir miyim?** Hayır; adlar ve başlıklar düz yazıdır. Biçim yalnız açıklama gibi uzun alanlarda.
- **Öğrenci de biçimli yazabiliyor mu?** Evet, aynı araç çubuğuyla; yalnız </> düğmesi yok.
- **Bugün mesajıma kalın yazı koyabilir miyim?** Hayır; bugün her yazı düz metindir.

## Sırada

- Düzenleyiciler (iş 15, onaylı): ortak yazı düzenleyicisi her alana kodlanacak (Linux).
- Yapı belgesi: her alanın ekran yeri ve karakter sınırı; site duyurusunun ve destek ekibinin yanıtının önizlemesinin ortak
  düzenleyiciye geçirilmesi.
