# Takvim ve ajanda · Takvim sayfası

**Durum:** Kodda var; tasarımda ek olarak başlığın altındaki yazı role göre değişir, sayfanın üstünde "Takvim" | "Ajanda" sekmeleri olur (seçtiğin sekme hatırlanır), geniş ekranda seçili günün listesi takvimin yanında durur ve güne basınca sayfa kaymaz (Tasarım 1 önizlemesi; kullanıcının 2 ve 3 Ekim geri bildirimi).

Menüdeki "Takvim"le açılan sayfa: ay takvimi, seçtiğin günün işleri ve (tasarımda) ayrı bir sekmede ajanda.

## Ne işe yarar

Okulda herkesin sorduğu "bu ay neler var?" sorusunun cevabı tek sayfada durur: hangi gün tatil, hangi ödevin son günü ne zaman, okul
hangi gün etkinlik yapıyor. Kullanıcı 29 Ağustos'ta "normal bir takvim gibi ay, yıl, gün" olan, bir güne basınca o günün ödevlerini
gösteren bir takvim istedi; 27 Eylül'de takvimle birlikte "o an aktif ve gelecekte olacak şeylerin" listesini (ajanda) istedi; 3 Ekim
akşamı önizlemeyi gezdikten sonra ikisinin ayrı olmasını söyledi ("ajanda ayrı, takvim ayrı"). Bu belge sayfanın kendisini anlatır;
içindeki parçalar ayrı belgelerde: [Ay görünümü](ay-gorunumu.md), [Gün ayrıntısı](gun-ayrintisi.md), [Ajanda](ajanda.md).

## Nereden açılır

| Kim | Menü | Adres | Başlık ve alt yazı (bugünkü site) | Tasarımda alt yazı |
|---|---|---|---|---|
| Öğrenci | "Takvim" (Anketler'in altında, Hatırlatıcılar'ın üstünde) | `#/takvim` | "TAKVIM" — "Ödev teslim tarihleri, dersler, tatiller ve okul etkinlikleri." | "Ödevler, sınavlar ve okul etkinlikleri" |
| Veli | "Takvim" | `#/takvim` | "TAKVIM" — "Elif Yılmaz adına görüntülüyorsun." (seçili çocuk; iki ve daha çok çocukta altında çocuk şeridi) | her çocuğun oturumunda ayrı: "Elif'in ödevleri, sınavları ve okul etkinlikleri" |
| Öğretmen ve ek görevli çalışan | "Takvim" | `#/takvim` | "TAKVIM" — "Ödev teslim tarihleri, dersler, tatiller ve okul etkinlikleri." | "Derslerin, ödevlerin ve okul etkinlikleri" |
| Öğretmen ya da müdür, bir öğrencinin portalında | öğrencinin adının altında "Takvimi" | `#/takvim` | "TAKVIM" — "Elif Yılmaz adına görüntülüyorsun." | — |
| Müdür | "Takvim" | `#/takvim` | "TAKVIM" — "Ödev teslim tarihleri, dersler, tatiller ve okul etkinlikleri." | "Okulun bütün etkinlikleri"; başlığın sağında **"Etkinlik ekle"** |
| Servisçi | "Takvim" (Yoklama, Mesajlar'dan sonra) | `#/takvim` | "TAKVIM" — "Ödev teslim tarihleri, dersler, tatiller ve okul etkinlikleri." | "Okulun tatilleri ve servis değişiklikleri"; ana sayfada "Takvim" kutucuğu ("29 Ekim tatil" gibi) |

- Tasarımda adres hesabın adıyla başlar (`#/<hesap>/takvim`); velide her çocuk ayrı oturum olduğu için her oturumun kendi takvimi
  vardır ([Velide her çocuk ayrı oturum](../portallar/velide-cocuk-oturumlari.md)).
- Tasarımda menüde "Takvim" öğrenci, veli, öğretmen ve müdürde "Anketler" ile "Toplantılar" arasında; servisçide "Mesajlar"dan sonra.
- Tasarımda velinin ana sayfasında (her çocuk oturumunda) **"Yaklaşanlar"** bölümü durur: o çocuğun yaklaşan ödevi, toplantısı ve
  sınavı (önizlemede solda "Bugün", "Cum", "15 Eki"; yanlarında "Kesirler quizi", "7-A veli toplantısı", "Fen 1. yazılı"); bölümün
  **"hepsi →"** bağlantısı
  Takvim'i açar, satırlar kendi penceresini açar ([Takvimdeki kayda basınca](kayit-pencereleri.md)).
- Tanıma göre **rolsüz çalışanın** portalında da "Takvim" olacak ([Rolsüz çalışan](../ogretmenler-calisanlar/rolsuz-calisan.md));
  Tasarım 1 önizlemesinde bu hesap için örnek yok.
- Takvimi **olmayanlar:** sistem yöneticisi (yönetim menüsünde yok), henüz bir okula bağlı olmayan yetişkin hesabı (menüsünde yalnız
  "Başlangıç" ve "Hatırlatıcılar"), giriş yapmamış ziyaretçi; tasarımda eğitmen, tahta ve destek hesapları.

## Adım adım

### Bütün roller (bugünkü site)

1. Sol menüden **"Takvim"**e bas. Sayfa başlığı **"TAKVIM"**, altında yukarıdaki tablodaki yazı.
2. Veliysen ve iki ya da daha çok çocuğun varsa başlığın altında çocuk şeridi çıkar: **"Hepsi"** · **"Elif Yılmaz"** · **"Can Yılmaz"**.
   Bir çocuğa basınca takvim onun takvimi olur. "Hepsi" seçiliyken takvim **ilk çocuğundur** (bilinen açık; aşağıda).
3. Altında tek bir kart: üst çubuk (**"‹"**, "Ekim 2026", **"›"**, **"Bugün"**, yıl seçici, yetkiliyse **"Etkinlik ekle"**), ay
   ızgarası ve ızgaranın altında renk açıklaması ([Ay görünümü](ay-gorunumu.md)).
4. Bir güne basınca o gün seçilir ve kartın **altında** o günün ayrıntısı açılır ([Gün ayrıntısı](gun-ayrintisi.md)).
5. Telefonda (720 piksel altı) gün kutuları küçülür; tatil adı ve "6 ders" yazısı gizlenir, renkli noktalar kalır.
6. Gösterdiğin ay ve seçtiğin gün sayfadan çıkıp dönünce de yerinde durur (aynı sekmede).

### Tasarımda (Tasarım 1 önizlemesi; bütün takvimi olan roller)

1. Sayfa başlığı **"Takvim"**, altında rolüne göre alt yazı. Müdürde başlığın sağında **"Etkinlik ekle"**
   ([Takvime ekle](etkinlik-ekleme.md)).
2. Başlığın altında iki sekme: **"Takvim"** (takvim simgesi) | **"Ajanda"** (belge simgesi). İlk açılışta "Takvim" seçilidir.
   Seçtiğin sekme bu tarayıcıda hatırlanır; sayfaya döndüğünde aynı sekme açılır. Sekmenin üstündeyken klavyede sol ya da sağ ok öbür
   sekmeye geçirir. İkisi aynı anda üst üste durmaz (kullanıcı 3 Ekim akşamı).
3. **"Takvim"** sekmesi: ay takvimi; geniş ekranda (1100 piksel ve üstü) sağda dar bir sütunda seçili günün listesi (sayfayı aşağı
   kaydırınca yerinde kalır); daha dar ekranda liste takvimin altında. Güne basınca sayfa **kaymaz**, liste yerinde yenilenir
   (kullanıcı 2 Ekim: "takvimde her basışta alta atmasan").
4. **"Ajanda"** sekmesi: Bugün / Bu hafta / Sonra listesi ve süzgeç kutucukları ([Ajanda](ajanda.md),
   [Ajandanın süzgeç kutucukları](ajanda-suzgeci.md)).
5. Telefonda (640 piksel altı) gün kutularındaki başlıklar ince renkli çizgilere döner, "+2 daha" gizlenir; ok düğmeleri ve süzgeç
   kutucukları parmakla basılacak büyüklükte (44 piksel).

### Veli

- **Bugünkü site:** çocuk şeridinden çocuğu seç; sol menüde "Veli · çocuğun adı" portalını seçtiysen takvim zaten o çocuğundur. Eski
  yoldan (Çocuklarım → çocuğun kartı → portalı) girdiysen menüde "Takvimi" görünür ve şerit çıkmaz.
- **Tasarımda:** "Hepsi" ve çocuk şeridi yok. Hangi çocuğun oturumundaysan takvim onundur; öbür çocuğun takvimi için "Oturum değiştir"
  ile onun oturumuna geç ([Velide her çocuk ayrı oturum](../portallar/velide-cocuk-oturumlari.md)).

### Servisçi

- Menüsü kısa: Yoklama, Mesajlar, **Takvim**, Hatırlatıcılar. Sayfayı yenilediğinde takvimde kalır (servisçinin açılabilecek
  sayfalarından biri).
- **Tasarımda:** ana sayfada "Takvim" kutucuğu da var; altında yaklaşan tatil yazar ("29 Ekim tatil")
  ([Servisçinin ana sayfası](../ana-sayfa/servisci-ana-sayfasi.md)).

## Kurallar ve sınırlar

- **Takvim bir okula bağlı olmayı gerektirir.** Sunucunun cevapları:
  - yönetici: **"Bu işlem bir okula bağlı olmayı gerektirir. Yönetici hesabı bir okula ait değildir."**
  - henüz okula bağlı olmayan yetişkin: **"Hesabın henüz bir okula bağlı değil. Okul yönetimi seni ekleyince bu bölüm açılır."**
  - çocuğu bağlı olmayan veli: **"Önce çocuğunu hesabına bağlaman gerekiyor."**
- **Okul takvimi kapatamaz.** "Takvim" Özellikler sayfasındaki bölümlerden biri değil (tasarımdaki listede de yok). Okulun kapattığı
  bölümün kayıtları takvime düşmez: "Ödevler" kapalıysa takvimde ödev yoktur ([Kapalı bölüm](../ozellikler/kapali-bolum.md)).
- **Velide "Hepsi" ilk çocuğu gösterir** (bugünkü site): şerit "Hepsi"de seçili görünür ama başlık ilk çocuğun adını yazar.
  Tasarımda bu sorun yoktur (her çocuk ayrı oturum).
- **Görünüm hatırlanır, kişi değişse de:** gösterilen ay ve seçili gün çıkışta sıfırlanmaz; aynı sekmede sonra giren kişi takvimi
  kaldığı ayda açar. Veriler her seferinde sunucudan yeniden gelir; başkasının kaydı görünmez.
- **Başlığın yazımı:** bugünkü sitede başlık noktasız "TAKVIM" yazar (öbür sayfalar Türkçe büyük harf kullanır). Tasarımda "Takvim".
- **Tasarımda sekme seçimi bu tarayıcıya özeldir;** başka cihazda takvim yine "Takvim" sekmesiyle açılır.

## Kardeşler ve ilgili

**Kardeşler:** [Ay görünümü](ay-gorunumu.md) · [Gün ayrıntısı](gun-ayrintisi.md) · [Takvim kimin gözünden](kimin-takvimi.md) ·
[Takvime ekle](etkinlik-ekleme.md) · [Takvimden kaldırma](etkinligi-kaldirma.md) · [Tatiller ve özel günler](tatiller-ve-ozel-gunler.md) ·
[Ajanda](ajanda.md) · [Ajandanın süzgeç kutucukları](ajanda-suzgeci.md) · [Takvimdeki kayda basınca](kayit-pencereleri.md).

**İlgili:** [Sol menü](../menu-ve-arama/sol-menu.md) · [Velide her çocuk ayrı oturum](../portallar/velide-cocuk-oturumlari.md) ·
[Öğrencinin portalını açma](../hesaplar/ogrenci-portalini-acma.md) · [Servisçinin ana sayfası](../ana-sayfa/servisci-ana-sayfasi.md) ·
[Rolsüz çalışan](../ogretmenler-calisanlar/rolsuz-calisan.md) · [Kapalı bölüm](../ozellikler/kapali-bolum.md) ·
[Takvimde ve ajandada hatırlatıcılar](../hatirlatici/takvimde-ve-ajandada.md).

## Kod tarafı

- Ön yüz: [public/js/parcalar/17-takvim.md](../../public/js/parcalar/17-takvim.md) (`SAYFALAR.takvim`: başlık, alt yazı, çocuk
  şeridi, kart), [public/js/parcalar/27-veli-panel.md](../../public/js/parcalar/27-veli-panel.md) (çocuk şeridi, seçili çocuk),
  [public/js/parcalar/06-menu.md](../../public/js/parcalar/06-menu.md) (menüdeki "Takvim" ve portaldaki "Takvimi"),
  [public/js/parcalar/26-baslat.md](../../public/js/parcalar/26-baslat.md) (servisçinin açılabilecek sayfaları),
  [public/js/parcalar/07-yonlendirme.md](../../public/js/parcalar/07-yonlendirme.md) (`git('takvim')`, `#/takvim`),
  [public/css/parcalar/CSS.md](../../public/css/parcalar/CSS.md) (`21-takvim.css`, 720 piksel kuralı).
- Sunucu: [sunucu/bolumler/takvim.md](../../sunucu/bolumler/takvim.md) (`/api/takvim`), [sunucu/api.md](../../sunucu/api.md)
  (okula bağlı olmayan yetişkinin kapısı), [sunucu/yetki.md](../../sunucu/yetki.md) (`okulGerek`).
- Tasarımdaki sekmeler, alt yazılar ve yerleşim Tasarım 1 önizlemesindedir; kodlanınca bu bölüm güncellenir.

## Sık sorulanlar

- **Menümde Takvim yok.** Hesabın henüz bir okula bağlı değilse (portalı olmayan yetişkin) ya da yönetici hesabıysan takvim yoktur.
  Okul seni ekleyince menüne gelir.
- **İki çocuğum var, takvim neden yalnız birini gösteriyor?** Bugünkü sitede takvim tek çocuğun takvimidir; şeritten öbür çocuğu seç.
  "Hepsi" seçiliyken ilk çocuğun takvimi açılır.
- **Okul takvimi kapatabilir mi?** Hayır; takvim kapatılabilen bölümlerden biri değil. Ama ödevler kapalıysa takvimde ödev görünmez.
- **Ajanda nerede?** Bugünkü sitede ajanda yok. Tasarımda Takvim sayfasının ikinci sekmesidir ([Ajanda](ajanda.md)).

## Sırada

- Arayüz önizlemesi (Tasarım 1): Takvim sayfasında iki sekme "Takvim | Ajanda", seçili günün listesi yanda, güne basınca sayfanın
  kaymaması; kullanıcının tasarım seçimi bekleniyor.
- Mesaj ayarları (çark), Bu mesajı bildir, Ajanda, sınav planlama, duyurudan ajanda+hatırlatıcı, ödev hatırlatma otomasyonu: Ajanda
  sekmesinin kendisi.
- Çalışan olarak ekleme: rolsüz çalışanın portalına Takvim; sayfadaki rol koşulları yeni role göre gözden geçirilir.
- Tek kişi tek hesap + portallar öğrencide de: velide her çocuk ve öğrencide her kurum ayrı oturum; takvim oturumun takvimi olur.
- Android yerel uygulama (bütün roller): uygulamada Takvim ekranı (ay görünümü ve gün listesi).
