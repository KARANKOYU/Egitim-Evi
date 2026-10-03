# Takvim ve ajanda · Takvimdeki kayda basınca

**Durum:** Kodda var; tasarımda ek olarak gün listesindeki ve ajandadaki her satır kendi penceresini açar (ödev, sınav, toplantı, etüt, etkinlik, duyuru, tatil ve özel gün, hatırlatıcı) ve pencere kapanınca takvim yerinde kalır (Tasarım 1 önizlemesi; tanım: "tıklanınca kaynağı açılır").

Takvimde ya da ajandada bir satıra bastığında ne olduğu: bugünkü sitede ödev satırı Ödevler sayfasına gider; tasarımda her kayıt türü
kendi penceresini açar.

## Ne işe yarar

Takvimde gördüğün bir şeyin ayrıntısına tek basışla ulaşırsın: ödevin açıklamasına, sınavın saatine, toplantının "Katıl" düğmesine,
duyurunun metnine. Tanım (Ajanda) "tıklanınca kaynağı (ödev, sınav, duyuru) açılır" der; Tasarım 1 önizlemesi bunu takvimin gün
listesine de uyguladı.

## Nereden açılır

- **Bugünkü site:** Takvim → bir güne bas → gün ayrıntısındaki **"Bugün teslim edilecek"** listesinin satırları
  ([Gün ayrıntısı](gun-ayrintisi.md)). Ay ızgarasındaki noktaların üstüne gelince yalnız başlık görünür (basınca gün seçilir).
- **Tasarımda:** Takvim sekmesinde seçili günün listesindeki her satır ve Ajanda sekmesindeki her satır ([Ajanda](ajanda.md)).
  Satırlar klavyeyle de odaklanır.

## Adım adım

### Bütün roller (bugünkü site)

1. Gün ayrıntısında **"Bugün teslim edilecek"** altındaki bir ödeve bas → **Ödevler** sayfası açılır (ödevin kendisi değil, liste).
   - Öğrencide kendi Ödevler sayfası; bir öğrencinin portalındaysan o öğrencinin "Ödevleri".
   - Kendi takvimine bakan öğretmen ya da müdür ve çocuğunun öğrenci portalını (Çocuklarım → çocuğun kartı) açmamış veli ("Veli ·
     çocuğun adı" ile girmiş olsa da) o sayfada **"Öğrenci bulunamadı"** hatası görür (bilinen açık;
     öneri: satır role göre öğretmenin "Ödevler"ine, müdürün "Ödevler"ine, velinin "Ödevler"ine gitmeli).
2. **"Önümüzdeki 7 gün"** satırları, tatil, özel gün ve okul kayıtlarının satırları **tıklanmaz**. Okul kaydının satırında yetkiliye
   yalnız **"Kaldır"** düğmesi vardır ([Takvimden kaldırma](etkinligi-kaldirma.md)).

### Tasarımda (Tasarım 1 önizlemesi; bütün takvimi olan roller)

Satıra bas (ya da odaklanıp Enter) → aşağıdaki pencere açılır. Pencere sağ üstteki **"×"** (Kapat) ya da **Esc** ile kapanır; takvim ve
ajanda olduğu yerde kalır, seçili gün değişmez.

| Satır | Açılan | İçinde |
|---|---|---|
| **Ödev** | ödevin penceresi | açıklama, ekler, son teslim, teslim ve quiz; öğretmende teslimlere geçiş ([Ödevin penceresi](../odev/odev-penceresi.md)) |
| **Sınav** (öğrenci, veli, müdür) | **"Sınav ayrıntısı"** | "Sınav:", "Ders:", "Form:", "Sınav tarihi:", "Sonuç tarihi:" (yoksa "sonuç henüz girilmedi"); ölçümler girildiyse tablo ve **"Raporla"** ([Sınav ayrıntı ekranı](../sinav/sinav-ayrintisi.md)) |
| **Sınav** (öğretmen) | **Sınavlar** sayfası | gelecek ve olmuş sınavlar ([Sınavlar listesi](../sinav/sinavlar-listesi.md)) |
| **Toplantı** | toplantının penceresi | tarih, saat, yer ya da platform, düzenleyen, açıklama; zamanı gelince **"Katıl"** (davetli) ya da **"Aç"** (açan) ([Toplantının penceresi](../toplanti/toplanti-penceresi.md)) |
| **Etüt** | etüdün penceresi | "Gün:", "Saat:", "Öğretmen:", "Yer:", "Konu:", "Öğrenciler:" ("14 öğrenci · sen de varsın"), "Durum:"; öğretmen ve müdürde **"Etüt yoklaması"**; planlı etütte öğrenci ve veliye "gelemeyeceksen öğretmenine mesajla bildir" notu ([Etüt ayrıntısı](../etut/etut-ayrintisi.md)) |
| **Okul etkinliği** (önizlemedeki örnek) | etkinliğin penceresi | "Tarih:", "Saat:", "Yer:", "Kimler:", açıklama |
| **Müdürün eklediği etkinlik** | etkinliğin penceresi | "Tarih:", "Saat:" (ya da "bütün gün"), "Yer:", "Kimler görür:", "Kalan:", not; **"Kapat"** ([Takvime ekle](etkinlik-ekleme.md)) |
| **Duyuru** | **"Duyuru"** penceresi | "Başlık:", "Gönderen:", "Tarih:" (gün ve saat), "Kalan:", duyurunun metni; **"Kapat"** ([Duyuru](../mesaj/duyuru.md)) |
| **Resmî tatil / özel gün** | günün adıyla pencere | "Tarih:", "Tür:" (**"Resmî tatil · okul kapalı"** ya da **"Özel gün · okul açık"**), varsa "Ayrıntı:", "Kalan:"; **"Kapat"** ([Tatiller ve özel günler](tatiller-ve-ozel-gunler.md)) |
| **Hatırlatıcı** | **"Hatırlatıcı"** penceresi | başlık, açıklama, sıklık, saat, "Hatırlatıcı açık", "Sil" ([Kurma, düzenleme ve silme](../hatirlatici/hatirlatici-kurma.md)) |

### Öğrenci

- Ödeve basınca ödevin penceresi açılır; buradan teslim edebilir, quizi başlatabilirsin. Sınava basınca sınavın ayrıntısı, toplantıya
  basınca "Katıl"lı pencere.

### Veli

- Açık olduğun çocuk oturumunun kayıtları; ödev penceresi çocuğunun ödevini gösterir. Toplantı penceresinde "Katıl" yalnız davetliysen
  çıkar.

### Öğretmen

- Kendi ödevinin penceresinden teslimlere ve sonuçlandırmaya geçersin; sınav satırı Sınavlar sayfasına götürür; etüdün penceresinde
  "Etüt yoklaması".

### Müdür

- Etüt penceresinde "Etüt yoklaması"; eklediğin etkinliğin penceresinde bilgiler ve "Kapat" (düzenleme ve silme önizlemede yok).

### Servisçi

- Duyuru, tatil, etkinlik ve hatırlatıcı pencereleri.

## Kurallar ve sınırlar

- **Pencere yalnız görebildiğin kaydı açar:** takvimde göremediğin bir kaydın penceresi de yoktur ([Takvim kimin gözünden](kimin-takvimi.md)).
- **Düğmeler yetkiye bağlıdır:** "Etüt yoklaması" yalnız öğretmene ve müdüre; hatırlatıcının düzenlemesi ve
  silmesi yalnız sahibine; toplantıda "Aç" yalnız açana, "Katıl" yalnız davetliye ve zamanı gelince (10 dakika önce).
- **Toplantı bağlantısı pencerede yazmaz:** yalnız platformun adı ("Google Meet") görünür; bağlantıya "Katıl" sunucudan geçerek gider
  ([Katıl düğmesi](../toplanti/katil.md)).
- **"Kalan:"** satırı ajandadaki kalan süreyle aynı kuralla yazılır ("28 gün kaldı", "yarın 09:00", "3 gün önce").
- **Bugünkü sitede** ödev satırı listeye gider, ödevin kendisini açmaz; öbür satırlar tıklanmaz.

## Kardeşler ve ilgili

**Kardeşler:** [Takvim sayfası](takvim-sayfasi.md) · [Ay görünümü](ay-gorunumu.md) · [Gün ayrıntısı](gun-ayrintisi.md) ·
[Takvim kimin gözünden](kimin-takvimi.md) · [Takvime ekle](etkinlik-ekleme.md) · [Takvimden kaldırma](etkinligi-kaldirma.md) ·
[Tatiller ve özel günler](tatiller-ve-ozel-gunler.md) · [Ajanda](ajanda.md) · [Ajandanın süzgeç kutucukları](ajanda-suzgeci.md).

**İlgili:** [Ödevin penceresi](../odev/odev-penceresi.md) · [Ödev listesi](../odev/liste.md) ·
[Sınav ayrıntı ekranı](../sinav/sinav-ayrintisi.md) · [Toplantının penceresi](../toplanti/toplanti-penceresi.md) ·
[Katıl düğmesi](../toplanti/katil.md) · [Etüt ayrıntısı](../etut/etut-ayrintisi.md) · [Duyuru](../mesaj/duyuru.md) ·
[Kurma, düzenleme ve silme](../hatirlatici/hatirlatici-kurma.md).

## Kod tarafı

- Ön yüz: [public/js/parcalar/17-takvim.md](../../public/js/parcalar/17-takvim.md) (gün ayrıntısındaki ödev satırının `data-nav="odevler"`
  bağlantısı; "Dikkat!" bölümünde öğretmen, müdür ve çocuğunun portalını açmamış velide "Öğrenci bulunamadı" açığı ve düzeltme
  önerisi),
  [public/js/parcalar/14-odev-filtre.md](../../public/js/parcalar/14-odev-filtre.md) (açılan Ödevler sayfası).
- Sunucu: [sunucu/bolumler/ilerleyis.md](../../sunucu/bolumler/ilerleyis.md) (Ödevler sayfasının verisi; bakanı öğrenci sanması).
- Tasarımdaki pencereler Tasarım 1 önizlemesindedir; kodlanınca bu bölüm güncellenir.

## Sık sorulanlar

- **Takvimdeki ödeve bastım, ödevin kendisi değil liste açıldı.** Bugünkü sitede ödev satırı Ödevler sayfasına gider. Tasarımda ödevin
  penceresi açılacak.
- **Öğretmenim, ödev satırına basınca "Öğrenci bulunamadı" çıkıyor.** Bilinen açık; kendi ödevlerin için menüdeki "Ödevler"i kullan.
- **Toplantı penceresinde "Katıl" yok.** "Katıl" toplantıdan 10 dakika önce çıkar ve yalnız davetlilere görünür.

## Sırada

- Arayüz önizlemesi (Tasarım 1): takvimde ve ajandada her satırın kendi penceresi.
- Mesaj ayarları (çark), Bu mesajı bildir, Ajanda, sınav planlama, duyurudan ajanda+hatırlatıcı, ödev hatırlatma otomasyonu: satıra
  basınca kaynağın (ödev, sınav, duyuru) açılması.
- Toplantılar + sınıfın uzaktan ders bağlantısı + tahta hesabı: toplantının penceresi ve "Katıl".
