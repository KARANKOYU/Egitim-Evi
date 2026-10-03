# Ödevler · Ödevin penceresi (ayrıntı)

**Durum:** Kodda var; tasarımda ek olarak pencere başlık/ders/öğretmen/başlama/son tarih/sonuç/hatırlatma satırlı bir bilgi tablosu olur, sağ üstte "Hatırlat" düğmesi durur, velide de pencerenin tamamı açılır ve müdür ödevi salt okunur bir pencerede görür (Tasarım 1 önizlemesi).

Listede bir ödeve basınca açılan, ödevin bütün bilgisini (ders, öğretmen, tarihler, sonuç, açıklama, ekler, quiz, teslim dosyaları) tek yerde gösteren pencere.

## Ne işe yarar

Öğrenci ödevi buradan okur, öğretmenin eklerini indirir, quizi başlatır ve teslim dosyasını yükler. Pencereyi ilk açışı
öğretmene "açıldı" olarak gider ([Açıldı / açılmadı](acilma-bilgisi.md)). Veli çocuğunun ödevini ve yüklediği dosyaları,
müdür (portaldan) öğrencinin gördüğünü görür.

## Nereden açılır

- **Öğrenci:** "Ödevler" listesinde ya da ana sayfadaki "Yaklaşan ödevler"de bir satıra bas.
- **Veli:** "Ödevler" listesinde satıra basınca bugün yalnız teslim dosyaları penceresi açılır (aşağıda); pencerenin tamamı
  için çocuğunun portalına gir (Çocuklarım → "Portalını aç") → **"Ödevleri"** → satır.
- **Müdür ve "Öğrenci portalına girer" yetkili kişi:** Öğrenciler → öğrencinin satırında **"Portalını aç"** → **"Ödevleri"**
  → satır.
- **Öğretmen:** öğretmenin kendi ödevi için pencere değil, kontrol ekranı açılır ([Sonuçlandırma](sonuclandirma.md)).
- Bildirime dokunmak ("Yeni ödev: …") "Ödevler" listesini açar; oradan satıra basarsın.

## Adım adım

### Pencerede ne var (bugünkü site)

- **Başlık:** ödevin adı.
- Hemen altında soluk: **"Matematik · Ayşe Kaya"**.
- Bir satırda: **"Veriliş: 30 Eylül 2026, Çarşamba"** (başlama günü varsa) ve **"Son teslim: 4 Ekim 2026, Pazar · 12:00"**
  (son tarih yoksa **"Süresiz"**); sağında etiket: sonuçlanmışsa sonucun adı ("Yaptı" …), sonuçlanmış ama sonuç girilmemişse
  **"Değerlendirilmedi"**, değilse mavi **"Aktif"**.
- **Açıklama** (yazıldığı gibi, satır sonlarıyla).
- **"Ekler"** listesi: quizli ödevde ilk satır quiz ("Quiz · 10 soru · 20 dk", altında durum ve düğme: "Quizi başlat",
  "Devam et", "Quizi aç", "Sonucu gör"…), sonra öğretmenin ekleri ("İndir"). Ek ve quiz yoksa liste çıkmaz
  ([Ödeve dosya ekleme](dosya-ekleme.md), [Quiz çözme](../quiz/quiz-cozme.md)).
- **"Teslim dosyaları"** bölümü (önce "Teslim dosyaları yükleniyor..."): yüklediğin dosyalar ve izin varsa yükleme alanı
  ([Teslim](teslim.md)).
- Altta **"Kapat"**.

### Öğrenci

1. Satıra bas; pencere açılır, ödev "açılmış" sayılır, listedeki turuncu kalkar.
2. Açıklamayı oku, ekleri **"İndir"** ile al.
3. Quiz varsa quiz satırındaki düğmeyle başlat.
4. Dosya teslimi istenmişse "Teslim dosyaları"ndan yükle.
5. **"Kapat"** ya da pencerenin dışına basarak kapat. Yükleme sürerken pencereyi kapatırsan süren dosya arka planda biter,
   sırada bekleyenler yüklenmez ([Teslim](teslim.md)).

### Veli

- Kendi "Ödevler" listende satıra basınca başlığı ödevin adı olan, yalnız **"Teslim dosyaları"** bölümünü (ve quizli ödevde
  çocuğunun quiz durumunu) gösteren bir pencere açılır: çocuğunun yüklediği dosyalar, boyutları, yüklenme zamanları,
  "N gün sonra silinir" ve **"İndir"**. Yüklenen yoksa **"Yüklenmiş dosya yok."**, izin kapalıysa **"Bu ödev için dosya
  yüklenmiyor."** Veli dosya yükleyemez, silemez.
- Ödevin açıklaması ve öğretmenin ekleri bu pencerede yok; onlar için çocuğunun portalındaki **"Ödevleri"**nden aç (orada
  pencerenin tamamı, yıldızsız; açmak "açıldı" saymaz).

### Müdür

Öğrencinin portalından açtığın pencere öğrencininkinin aynısıdır: teslim dosyalarını görür ve indirirsin, ama "Sil" ve
yükleme alanı çıkmaz. Ödevi kendisi vermediği bir öğrencinin portalına giren öğretmen (Öğrenci portalına girer yetkisiyle)
teslim bölümünde **"Bu dosyaları görme yetkin yok"** görür.

### Tasarımda (Tasarım 1 önizlemesi)

Öğrenci ve veli (velide her çocuk ayrı oturum; pencerenin tamamı açılır):

- Üst satır: **"Ödev"** başlığı; ödev sürüyorsa sağda **"Hatırlat"** düğmesi ([Ödev hatırlatmaları](hatirlatmalar.md)); kapatma
  çarpısı.
- Bilgi tablosu:
  - **"Başlık:"** ödevin adı,
  - **"Ders:"** "7-A · Matematik",
  - **"Öğretmen:"** "Ayşe Kaya",
  - **"Başlama:"** "27 Eylül 2026 Pazar 08:30",
  - **"Son tarih:"** "1 Ekim 2026 Perşembe 23:00" + kalan etiketi ("Bugün 23:00'e kadar", "Yarın 15:00'e kadar", "4 gün kaldı"),
  - **"Sonuç:"** (sonuçlandıysa renkli etiket),
  - **"Hatırlatma:"** (ödev sürüyorsa: "varsayılan kural (son günden 1 gün önce 19:00) · sıradaki: …", "teslim ettiğin için
    durdu" gibi).
- **"Açıklama:"** — yazı düzenleyicisiyle yazılmış zengin metin (kalın, liste, bağlantı; bağlantılar yeni sekmede açılır).
- Quizli ödevde **"Quiz · 10 soru · 20 dakika · tek deneme"** satırı: öğrencide **"Quizi başlat"** / **"Quize devam et"** /
  **"Cevapların gönderildi"**; velide **"Elif: bitirdi"** / **"devam ediyor"** / **"başlamadı"**.
- **"Teslim edilen dosyalar (N)"** açılır kapanır kutusu ([Teslim](teslim.md)).
- Öğretmenin kontrol ekranındaki **"Ödevi gör"** düğmesi aynı pencerenin öğretmen hâlini açar (yükleme alanı yok; quiz
  satırında "öğrenci çözünce sonuç görünür").
- Müdür ödevi kendi "Ödevler" ağacından açar: salt okunur **"Ödev"** penceresi — "Başlık:", "Ders:", "Sınıf:", "Veren öğretmen:",
  "Verildi:", "Son tarih:" + **"Aktif"** / **"Süresi geçti"**, "Açıklama:", altta **"Kapat"** ([Müdürün ödev görünümü](mudurun-odev-gorunumu.md)).

## Kurallar ve sınırlar

- **Kim açar:** ödevin öğrencisi; bağlı velisi (portaldan tam, kendi listesinden teslim kısmı); ödevi veren öğretmen ve okulun
  müdürü (portaldan). Başkası için ödev yoktur.
- **"Veriliş" saati görünmez** (bilinen açık): pencere başlama saatini yazmaya çalışır ama öğrencinin ödev bilgisinde başlama
  saati gelmez; yalnız gün yazılır.
- **Süresi geçmiş ödev pencerede "Aktif" görünür** (bilinen açık): listedeki etiket "Süresi doldu" derken pencere sonuçlanmamış
  her ödeve mavi "Aktif" koyar.
- **Pencere açıldığı anı gösterir;** öğretmen bu arada ödevi düzenlerse ya da sonuçlandırırsa pencereyi kapatıp yeniden aç.
- **Velinin ana sayfasındaki "Yaklaşan ödevler"den** açılan teslim penceresinde quiz durumu çıkmaz (bilinen açık; quiz durumu
  yalnız velinin "Ödevler" sayfası açıldıysa okunur).
- **Öğrencinin ana sayfasından açma** o oturumda "Ödevler" sayfası hiç açılmadıysa çalışmaz (bilinen açık; [Ödev listesi](liste.md)).
- **Tarayıcının geri tuşu** bugün pencereyi kapatır ve aynı anda önceki sayfaya gider.
  Android uygulaması için kararlaştırılan davranış farklı: geri tuşu önce açık ödevi kapatır, ancak sonra önceki sayfaya
  geçer ([Android geri tuşu](../uygulama/geri-tusu.md), [Geri, ileri ve ev](../menu-ve-arama/geri-ileri-ve-ev.md)).

## Kardeşler ve ilgili

**Kardeşler:** [Ödev listesi](liste.md) · [Açıldı / açılmadı](acilma-bilgisi.md) · [Ödeve dosya ekleme](dosya-ekleme.md) ·
[Teslim](teslim.md) · [Teslim metni](teslim-metni.md) · [Ödev hatırlatmaları](hatirlatmalar.md) · [Başlama ve son teslim](tarih-ve-saat.md) ·
[Müdürün ödev görünümü](mudurun-odev-gorunumu.md).

**İlgili:** [Quiz çözme](../quiz/quiz-cozme.md), [Quiz sonuçları](../quiz/sonuclar.md),
[Öğrenci portalını açma](../hesaplar/ogrenci-portalini-acma.md), [Velide çocuk oturumları](../portallar/velide-cocuk-oturumlari.md),
[Bağlantı ekle (yazı düzenleyici)](../yazi-yazma/baglanti-ekle.md), [Android geri tuşu](../uygulama/geri-tusu.md).

## Kod tarafı

- Ön yüz: [public/js/parcalar/14-odev-filtre.md](../../public/js/parcalar/14-odev-filtre.md) — `EYLEMLER['odev-oku']`
  (pencere, `ekListesiGoster(a.ekler, quizOdevSatiri(a, null))`, "açıldı" isteği);
  [14b-odev-teslim.md](../../public/js/parcalar/14b-odev-teslim.md) — `odev-oku`yu sarar, "Teslim dosyaları" bölümünü ekler
  (`teslimCiz`); velinin penceresi `EYLEMLER['veli-teslim']`; [14c-quiz.md](../../public/js/parcalar/14c-quiz.md)
  (`quizOdevSatiri`); [04d-ekler.md](../../public/js/parcalar/04d-ekler.md) (`ekListesiGoster`);
  [03-mesaj-modal.md](../../public/js/parcalar/03-mesaj-modal.md) (`modalAc`, "Kapat");
  [13-ogrenci-veli.md](../../public/js/parcalar/13-ogrenci-veli.md) (`hedefOgrenci`, portal görünümü);
  [10-mudur.md](../../public/js/parcalar/10-mudur.md) ("Portalını aç").
- Sunucu: [sunucu/bolumler/ilerleyis.md](../../sunucu/bolumler/ilerleyis.md) — `/api/progress` ödevin bilgilerini (ekler, quiz
  özeti, sonuç yalnız sonuçlanınca) verir; [sunucu/bolumler/odev-dosya.md](../../sunucu/bolumler/odev-dosya.md) — teslim
  listesi ve yetkisi (`gorebilir`).
- Testler: [testler/test-odev-dosya.md](../../testler/test-odev-dosya.md), [testler/test-quiz.md](../../testler/test-quiz.md).

## Sık sorulanlar

- **Velim ödevin açıklamasını göremiyor.** Velinin kendi ödev listesi yalnız teslim dosyalarını açar; açıklama için çocuğunun
  portalından "Ödevleri"ne bakmalı. Tasarımda velide pencerenin tamamı açılır.
- **Pencerede "Aktif" yazıyor ama süre geçti.** Bilinen açık; listedeki etiket doğrudur.
- **Quiz düğmesi çıkmıyor.** Quiz başlama anı gelmemiş, süre geçmiş ya da quizi zaten çözmüşsün olabilir; satırdaki yazı
  nedenini söyler ([Quiz: süre ve tek deneme](../quiz/sure-ve-tek-deneme.md)).

## Sırada

- Düzenleyiciler: açıklama zengin metin olarak gösterilecek (bağlantılar tıklanır).
- Ödev hatırlatma otomasyonu: pencereye "Hatırlat" düğmesi ve "Hatırlatma:" satırı gelecek.
- Velide her çocuk ayrı oturum: velinin listesinden de pencerenin tamamı açılacak.
- Android uygulaması: ödev ayrıntısı uygulamaya gelecek (açıklama, ekler, teslim, quiz).
