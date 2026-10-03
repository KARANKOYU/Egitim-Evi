# Hatırlatıcılar · Hatırlatıcılar sayfası

**Durum:** Kodda var; tasarımda ek olarak satıra basınca hatırlatıcının penceresi açılır (satırda düğme kalmaz), satırda "Açık" /
"Kapalı" etiketi ve özetin içinde "sıradaki" zamanı, "3 hatırlatıcı · 2 tanesi açık" alt yazısı, öğrenci ve velide ikinci grup
"Ödev hatırlatmaları", velide her çocuk oturumunun ayrı listesi ve servisçinin ana sayfasında "Hatırlatıcılar" kutucuğu.

Kurduğun bütün hatırlatıcıların alt alta durduğu, yenisini kurduğun, düzenlediğin, durdurduğun ve sildiğin sayfa.

## Ne işe yarar

Hatırlatıcıların tek yerde: hangisi açık, hangisi durdu, bir sonraki ne zaman çalacak, kaç tane kurmuşsun. "Her pazartesi 08:00
beden eğitimi kıyafeti", "ayın 1'i servis ücreti", "cuma 15:30 zümre toplantısı" gibi kişisel notlarını buradan yönetirsin. Kullanıcı
26 Eylül'de istedi: öğrenci kendine kurabilsin, öğretmen ve müdür de; başlığı, açıklaması ve sıklığı olsun.

## Nereden açılır

- Sol menüde zil simgeli **"Hatırlatıcılar"**. Rol rol yeri (bugünkü site):
  - **Öğrenci:** "Ana Sayfa", "Mesajlar", "Anketler", "Takvim"in hemen altında, "Devamsızlığım"ın üstünde.
  - **Veli:** "Takvim"in altında, "Ödevler"in üstünde.
  - **Öğretmen** (ve ek görevli çalışan): "Takvim"in altında, "Ders Programım"ın üstünde.
  - **Müdür:** "Takvim"in altında, "Öğretmenler"in üstünde.
  - **Servisçi:** dört maddenin sonuncusu: "Yoklama", "Mesajlar", "Takvim", "Hatırlatıcılar".
  - **Henüz okula bağlı olmayan yetişkin** (portal dışında): menüde yalnız "Başlangıç" ve "Hatırlatıcılar" var
    ([Portalı olmayan yetişkin](../portallar/portalsiz-hesap.md)).
  - **Sistem yöneticisi** (yönetim, `/admin`): "Ana Sayfa", "Müdürler", "Okullar", "Yorumlar", "Hatırlatıcılar"; altında "Site"
    başlığı ([Gizli yönetim adresi](../yonetim/gizli-yonetim-girisi.md)).
- Adres: `#/hatirlaticilar`.
- "Hatırlatma: …" bildirimine basınca da bu sayfa açılır ([Hatırlatma bildirimi](hatirlatma-bildirimi.md)).
- Veli çocuğunun portalına girdiğinde (çocuğun adıyla açılan menü) "Hatırlatıcılar" yoktur; öğretmen ya da müdür bir öğrencinin
  portalına baktığında da yoktur. Herkes yalnız kendi hatırlatıcılarını görür.
- Okul bu sayfayı kapatamaz: "Özellikler"deki bölümler arasında yok ([Bölüm aç / kapat](../ozellikler/bolum-ac-kapat.md)).
- **Tasarımda** (Tasarım 1 önizlemesi): menüde "Takvim" ve "Toplantılar"ın altında (öğrenci, veli, öğretmen, müdür); servisçide
  "Ana sayfa", "Yoklama", "Mesajlar", "Takvim", "Hatırlatıcılar"; servisçinin ana sayfasında gri **"Hatırlatıcılar"** kutucuğu,
  altında sıradaki hatırlatıcının adı (örnekte "araç muayenesi") ([Servisçinin ana sayfası](../ana-sayfa/servisci-ana-sayfasi.md)).
  Önizlemede henüz oturumu olmayan hesabın menüsünde yalnız "Ana sayfa" var (bugünkü sitedeki "Hatırlatıcılar" orada yok) ve
  öğrencinin "Öğrenci · Örnek Dershanesi" oturumunun menüsünde de Hatırlatıcılar yok; tanımlarda bunlar için karar yazılı değil
  ([Kimler görür ve saklama](kimler-gorur-ve-saklama.md)).

## Adım adım

### Herkes (bugünkü site)

1. Menüden **"Hatırlatıcılar"**a bas. Sayfanın başlığı **"HATIRLATICILAR"**, altında: "Kendine hatırlatma kur: bir kez, her gün,
   haftanın belli günleri ya da ayda bir. Zamanı gelince bildirim gelir."
2. Üstteki kartın solunda sayaç: **"3 / 50 hatırlatıcı. Yalnızca sen görürsün."** (kaç tane kurduğun / en çok kaç); sağında
   **"Yeni hatırlatıcı"** düğmesi ([Kurma, düzenleme ve silme](hatirlatici-kurma.md)).
3. Hiç hatırlatıcın yoksa büyük zil simgesiyle: **"Henüz hatırlatıcın yok. "Yeni hatırlatıcı" ile kur: ör. her pazartesi 08:00
   "Beden eğitimi kıyafeti"."**
4. Varsa her hatırlatıcı bir satır, soldan sağa:
   - yuvarlak zil simgesi;
   - kalın **başlık**; varsa altında **açıklama**; onun altında **özet** (sıklık ve saat): "4 Eylül 2026, Cuma · 15:00",
     "Her gün · 21:00", "Her hafta Pzt, Çar · 07:30", "Her ayın 31. günü · 10:00" ([Sıklık](siklik.md));
   - **durum etiketi** (aşağıdaki tablo);
   - üç düğme: **"Düzenle"**, **"Durdur"** (durdurulmuş satırda **"Başlat"**) ve kırmızı **"Sil"**
     ([Durdurma ve yeniden başlatma](durdurma-ve-baslatma.md)).
   Durdurulmuş ya da gönderilmiş (kapanmış) satır soluk görünür.
5. Sıra: ilk kurduğun en üstte. Düzenlediğin ya da yeniden başlattığın hatırlatıcı listenin en altına geçer (sayımı o an baştan
   başladığı için).
6. Üst şeritteki **"İçerik Ara"** kutusuna yazdıkça satırlar başlığa ve açıklamaya göre süzülür
   ([Sayfa içi arama](../menu-ve-arama/sayfa-ici-arama.md)).
7. Liste kendiliğinden tazelenmez: bir kezlik hatırlatıcın gönderildikten sonra satırın "Hatırlatıldı" olması için sayfayı yeniden
   açman gerekir.

Durum etiketleri:

| Etiket | Rengi | Ne zaman |
|---|---|---|
| **"Sonraki: 06.10.2026 08:00"** | mavi | Hatırlatıcı açık ve bir sonraki zamanı belli. |
| **"Durduruldu"** | gri | Sen "Durdur"a bastın. |
| **"Hatırlatıldı"** | gri | Bir kezlik hatırlatıcının zamanı geldi, bildirim gitti ve hatırlatıcı kendiliğinden kapandı. |
| **"Günü geçti"** | gri | Hatırlatıcı açık görünüyor ama bir daha çalmayacak: bir kezlik hatırlatıcının anı geçmiş ve gönderilmemiş (sunucu o sırada 6 saatten uzun kapalı kaldıysa). Sayfayı tam hatırlatma dakikasında açtıysan da kısa süre böyle görünebilir; gönderim o dakika içinde olur. Günü bugünden 400 günden ileride olan bir kezlikte de böyle yazar, ama o gün gelince yine gönderilir ([Sıklık](siklik.md), "400 gün sınırı"). |

### Öğrenci

Kendi listen; velin ve öğretmenlerin göremez. Örnek: "Beden eğitimi kıyafeti — Her hafta Pzt, Çar · 07:30", "Kütüphane kitabını
iade et — 30 Eylül 2026, Çarşamba · 15:00", "Kitap oku — Her gün · 21:00".

### Veli

Veli portalındaki liste yetişkin hesabının kendi listesidir: hesabın henüz okula bağlı değilken "Başlangıç"ın yanındaki
"Hatırlatıcılar"da kurdukların da buradadır. Çocuğunun hatırlatıcılarını göremezsin. Örnek: "Servis ücreti — Her ayın 1. günü · 10:00".

### Öğretmen ve çalışan

Her okul portalının listesi ayrıdır: A okulundaki öğretmen portalında kurduğun hatırlatıcı B okulundaki portalında ya da veli
portalında görünmez ([Kimler görür ve saklama](kimler-gorur-ve-saklama.md)). Ek görevli çalışan (bugün öğretmen hesabıyla bir ek rol
taşır) öğretmenin listesini kullanır.

### Müdür

Müdür portalının listesi; okulda kimsenin hatırlatıcısını göremezsin (müdür olman bunu değiştirmez).

### Servisçi

Menünün son maddesi. Açılışta servisçi yalnız "Yoklama", "Mesajlar", "Takvim", "Hatırlatıcılar" ve Ayarlar'a gidebilir;
hatırlatma bildirimine basınca bu sayfa açılır. Örnek: "Araç muayenesi — 15 Ekim 2026, Perşembe · 09:00".

### Yönetici

Yönetim panelinde (`/admin`) aynı sayfa, aynı düğmeler; liste sistem yöneticisi hesabının kendisinindir.

### Tasarımda (Tasarım 1 önizlemesi)

1. Sayfa başlığı **"Hatırlatıcılar"**; alt yazı **"3 hatırlatıcı · 2 tanesi açık"** (hiç yoksa **"Henüz hatırlatıcın yok"**);
   başlığın altında sağda artı simgeli **"Hatırlatıcı ekle"** düğmesi.
2. **"Hatırlatıcıların"** grubu; grup başlığının sağında **"3 / 50"**. Boşsa **"Henüz hatırlatıcın yok."**
3. Satır: zil simgesi (açıkta gri, kapalıda daha koyu), başlık, özet ve varsa açıklamanın düz metni (110 harften uzunsa ilk 108 harf ve
   "…"); sağda **"Açık"** ya da **"Kapalı"**. Özet örnekleri:
   - "Bir kez · 1 Ekim Perşembe 20:00 · telefona bildirim"
   - "her Salı 07:30 · telefona bildirim · sıradaki: 6 Ekim Salı 07:30"
   - "her ayın 5'i · 09:00 · telefona bildirim · sıradaki: 5 Ekim Pazartesi 09:00" (önizlemenin "şimdi"si 1 Ekim 2026 Perşembe
     10:34)
   - zamanı geçmiş ama açık bir kezlikte sonuna "· zamanı geçti".
   "· telefona bildirim" yalnız o hatırlatıcıda "Telefona bildirim" açıksa yazar ([Hatırlatma bildirimi](hatirlatma-bildirimi.md)).
4. Satırda düğme yok: satıra basınca **"Hatırlatıcı"** penceresi açılır; düzenleme, kapatma ("Hatırlatıcı açık" anahtarı) ve
   silme oradan ([Kurma, düzenleme ve silme](hatirlatici-kurma.md), [Durdurma ve yeniden başlatma](durdurma-ve-baslatma.md)).
5. **Öğrenci ve velide** altında ikinci grup **"Ödev hatırlatmaları"**: ilk satır "Bütün ödevlerin" (velide "Elif'in bütün
   ödevleri") — "varsayılan kural: son günden 1 gün önce 19:00" — "Açık"/"Kapalı"; ödeve özel kural kurduğun her ödev bir satır
   ("Ödev: …"). Bu grup ödev hatırlatma kurallarının yeridir, hatırlatıcı değildir ve 50'ye sayılmaz
   ([Ödev hatırlatmaları](../odev/hatirlatmalar.md)).
6. **Velide** her çocuk ayrı oturumdur ve her oturumun hatırlatıcıları ayrıdır: Elif'in oturumunda kurduğun hatırlatıcı Can'ın
   oturumunda görünmez ([Velide her çocuk ayrı oturum](../portallar/velide-cocuk-oturumlari.md)).
7. Ekleme, düzenleme ya da silmeden sonra sayfa (ve açıksa Takvim) hemen yeniden çizilir, alt yazıdaki sayılar güncellenir.
8. Açık hatırlatıcılar ayrıca Takvim'de ve Ajanda'da görünür ([Takvimde ve ajandada](takvimde-ve-ajandada.md)); duyurudan gelen
   hatırlatıcılar da bu listeye düşer ([Duyurudan gelen hatırlatıcılar](duyurudan-gelen-hatirlaticilar.md)).

## Kurallar ve sınırlar

- **Yalnız kendi hatırlatıcıların** listelenir. Başkasınınkine (öğrencinin, öğretmenin, velinin, müdürün) hiçbir rol ulaşamaz;
  adresle denense de sunucu "Hatırlatıcı bulunamadı" der ([Kimler görür ve saklama](kimler-gorur-ve-saklama.md)).
- **En çok 50 hatırlatıcı.** Sayaç bütün kayıtları sayar: durdurulmuş, "Hatırlatıldı" ve "Günü geçti" olanlar da 50'ye girer; yer
  açmak için silmen gerekir.
- **Sayfalama yok:** liste tek seferde gelir (en çok 50 satır).
- **Okul kapatamaz, yıla bağlı değil:** "Özellikler"de kapatılamaz; üstteki yıl seçici geçmiş bir yıldayken de hatırlatıcılarını
  görür ve değiştirirsin ([Geçmiş yıla bakma](../egitim-yili/gecmis-yil.md)).
- **Saat dilimi:** özetteki saat her zaman Türkiye saatidir. "Sonraki: …" etiketi ise cihazının saat dilimiyle yazılır (kod
  okumasına göre): telefonu başka saat dilimindeki biri özette "· 08:00", etikette farklı bir saat görür (bilinen açık).
- **Giriş ve onay:** sayfa giriş yapmış, hesabı onaylı herkese açıktır; henüz bir okula bağlı olmayan yetişkine de. Aydınlatma metni
  güncellendiyse önce onay, okulun verdiği şifreyle ilk girişte önce kendi şifreni belirlersin.

## Kardeşler ve ilgili

**Kardeşler:** [Kurma, düzenleme ve silme](hatirlatici-kurma.md) · [Sıklık](siklik.md) ·
[Durdurma ve yeniden başlatma](durdurma-ve-baslatma.md) · [Hatırlatma bildirimi](hatirlatma-bildirimi.md) ·
[Takvimde ve ajandada](takvimde-ve-ajandada.md) · [Duyurudan gelen hatırlatıcılar](duyurudan-gelen-hatirlaticilar.md) ·
[Kimler görür ve saklama](kimler-gorur-ve-saklama.md).

**İlgili:** [Sol menü](../menu-ve-arama/sol-menu.md) · [Sayfa içi arama](../menu-ve-arama/sayfa-ici-arama.md) ·
[Portalı olmayan yetişkin](../portallar/portalsiz-hesap.md) · [Velide her çocuk ayrı oturum](../portallar/velide-cocuk-oturumlari.md) ·
[Ödev hatırlatmaları](../odev/hatirlatmalar.md) · [Servisçinin ana sayfası](../ana-sayfa/servisci-ana-sayfasi.md) ·
[Bildirim paneli](../bildirim/bildirim-paneli.md).

## Kod tarafı

- Ön yüz: [public/js/parcalar/19h-hatirlaticilar.md](../../public/js/parcalar/19h-hatirlaticilar.md) — `SAYFALAR.hatirlaticilar`
  (liste, sayaç, boş kutu, `data-ara`), `hatirlaticiOzeti`, `hatirlaticiDurumu` (etiketler); menüdeki yeri
  [public/js/parcalar/06-menu.md](../../public/js/parcalar/06-menu.md) (`navTanim`) ve yönetimde
  [public/js/yonetim/09a-yonetim-paneli.md](../../public/js/yonetim/09a-yonetim-paneli.md); portal dışındaki yetişkinin ve servisçinin
  açılışta gidebileceği sayfalar [public/js/parcalar/26-baslat.md](../../public/js/parcalar/26-baslat.md); arama
  [public/js/parcalar/24-bildirim-arama-mobil.md](../../public/js/parcalar/24-bildirim-arama-mobil.md).
- Sunucu: [sunucu/bolumler/hatirlatici.md](../../sunucu/bolumler/hatirlatici.md) — `GET /api/hatirlaticilar` → `{ hatirlaticilar,
  sinir: 50 }`, `gorunum` (`sonraki`); rolsüz kapısından serbest olması [sunucu/api.md](../../sunucu/api.md) (`ROLSUZ_SERBEST`).
- Zaman: [sunucu/yardimci/hatirlatici-zaman.md](../../sunucu/yardimci/hatirlatici-zaman.md) (`sonraki`). Veri:
  [sunucu/veri/depo/hatirlaticilar.md](../../sunucu/veri/depo/hatirlaticilar.md) (`kisinin`: kuruluş anına göre sıra).
- Testler: [testler/test-hatirlatici.md](../../testler/test-hatirlatici.md); kullanıcıya dönük anlatım
  [belge/KILAVUZ.md](../../belge/KILAVUZ.md) ("Hatırlatıcılar").
- Tasarım bugün yalnız Tasarım 1 önizlemesinde; kodlanınca bu belgenin Durum satırı ve bu bölüm güncellenir.

## Sık sorulanlar

- **"Hatırlatıldı" ne demek?** Bir kezlik hatırlatıcının bildirimi gitti ve hatırlatıcı kapandı. Satır sen silene kadar durur; yeni
  bir gün vermek için "Düzenle"ye bas.
- **"Günü geçti" yazıyor, ne yapmalıyım?** Bu hatırlatıcı bir daha çalmaz. "Düzenle" ile ileri bir gün seç ya da "Sil".
- **Çocuğumun hatırlatıcılarını görebilir miyim?** Hayır; hatırlatıcıyı yalnız kuran görür.
- **Öğretmen portalımda kurduğum hatırlatıcı veli portalımda neden yok?** Her okul portalının listesi ayrıdır; veli portalı yetişkin
  hesabının kendisidir.
- **Bir kezlik hatırlatıcım çaldı ama satır hâlâ "Sonraki" diyor.** Liste kendiliğinden tazelenmez; sayfayı yeniden aç.
- **Okulumuz Hatırlatıcılar'ı kapatabilir mi?** Hayır; kişisel bir bölümdür.

## Sırada

- Mesaj ayarları, Bu mesajı bildir, Ajanda, sınav planlama, duyurudan ajanda+hatırlatıcı, ödev hatırlatma otomasyonu: duyurudan
  gelen hatırlatıcılar ve öğrenci/velinin "Ödev hatırlatmaları" grubu bu sayfaya girer; Ajanda'da "Hatırlatıcılarım" süzgeci.
- Arayüz önizlemesi (Tasarım 1): satıra basınca açılan pencere, "Açık"/"Kapalı" etiketi, "N hatırlatıcı · M tanesi açık".
- Optimizasyon + saklama süreleri: gönderilmiş ve kapanmış tek seferlik hatırlatıcıların ("Hatırlatıldı") 30 gün sonra silinmesi.
- Çalışan olarak ekleme: rolsüz çalışanın menüsünde de "Hatırlatıcılar".
- Android yerel uygulama (bütün roller): uygulamada Hatırlatıcılar ekranı.
- Çok dil: sayfa metinleri ve gün kısaltmaları çeviri kataloğuna.
