# Etütler · Etüt açma

**Durum:** Kodda var; tasarımda ek olarak etüt sorumlusu dersi (okulun dersleri ve "Genel / serbest çalışma") ve öğretmeni branşına göre seçer, öğrencileri aynı pencerede ekler ve saati canlı [boş zaman ızgarasından](bos-zaman-izgarasi.md) seçer ("Etüt planla" penceresi).

Yeni bir etüdün adını, haftanın gününü, saatini, yerini ve öğretmenini yazdığın pencere.

## Ne işe yarar

Etüt, ders saatleri dışında haftanın belli bir gününde belli saatler arasında yapılan çalışmadır: "8. sınıf Matematik etüdü,
Salı 15:40–16:20, Kütüphane, 12 öğrenci". Bugünkü sitede etüt **her hafta** aynı gün ve aynı saatte tekrarlanır (tek seferlik etüt
yoktur). Pencerede etüdün kendisini kurarsın; öğrencilerini kaydettikten sonra satırdaki "Öğrenciler" ile seçersin
([Öğrenci seçme](ogrenci-secme.md)).

Kullanıcının sözleri: 26 Eylül'de "etüt de olabilir belli güne belli saatler arasında bir öğretmen…" ve 29 Eylül'de etüt
sorumlusunun "herkese istediği dersten istediği hoca ile etüt yazabil"mesi, "boş yerler o an yazarken" görünmesi. Birincisi bugün
kodda var; ikincisi tasarım ([Boş zaman ızgarası](bos-zaman-izgarasi.md)).

## Nereden açılır

[Etütler sayfası](etutler-sayfasi.md) → üstteki **"Yeni etüt"** kartında **"Etüt aç"**. Kart ve düğme yalnız etüt düzenleme
yetkisi olana çıkar (müdür her zaman; rolünde "Etüt açar; gününü, saatini, öğretmenini ve öğrencilerini düzenler" olan kişi).
Pencerenin başlığı **"Yeni etüt"**.

Tasarımda (Tasarım 1 önizlemesi): sayfanın sağ üstündeki **"Etüt ekle"** → **"Etüt planla"** penceresi.

## Adım adım

### Pencerede ne var (bugünkü site)

- **"Adı"** — yer tutucu "ör. 8. sınıf Matematik etüdü", en çok 80 harf. Pencere açılınca imleç bu kutudadır.
- **"Gün"** — açılır liste: Pazartesi, Salı, Çarşamba, Perşembe, Cuma, Cumartesi, Pazar. Yeni etütte "Pazartesi" seçili gelir.
- **"Yer (isteğe bağlı)"** — yer tutucu "ör. Kütüphane", en çok 60 harf.
- **"Başlangıç"** ve **"Bitiş"** — saat kutuları; yeni etütte **15:40** ve **16:20** dolu gelir.
- **"Öğretmeni"** — açılır liste: ilk seçenek **"— sonra seçerim —"**, sonra okulun onaylı öğretmenleri ad sırasıyla, en sonda
  okulun müdürü (birden çok müdür varsa hepsi; müdür de etüdün öğretmeni olabilir). Altında ipucu: "Etüdün öğretmeni kendi etüdünde, etüt günü yoklama alır."
- Altta **"Vazgeç"** ve **"Kaydet"**.

### Müdür

1. Menüden "Okul Düzeni" → **"Etütler"** → **"Etüt aç"**.
2. **"Adı"**na etüdü tanıtan bir ad yaz (ör. "8. sınıf Matematik etüdü"). Ad, öğrencinin ve velinin sayfasında ve bildirimlerde
   aynen görünür.
3. **"Gün"**ü seç (etüt her hafta bu gün yapılır).
4. İstersen **"Yer"**i yaz (ör. "Kütüphane", "204 nolu sınıf").
5. **"Başlangıç"** ve **"Bitiş"** saatlerini ayarla.
6. **"Öğretmeni"**ni seç. Henüz belli değilse "— sonra seçerim —" bırak; o zaman yoklamayı yalnız etüt yetkilileri alır, sonra
   "Düzenle" ile öğretmen eklersin.
7. **"Kaydet"**e bas. Düğme "Kaydediliyor..." olur; kayıt bitince pencere kapanır, liste yeniden çizilir ve üstte yeşil
   **"Etüt kaydedildi."** çıkar (6 saniye sonra kaybolur). Yeni etüt "0 öğrenci" ile listededir.
8. Öğretmen seçtiysen ona bildirim gider: `"8. sınıf Matematik etüdü" etüdü sana verildi (Salı 15:40–16:20).`
   ([Etüt bildirimleri](etut-bildirimleri.md)).
9. Satırdaki **"Öğrenciler"** ile öğrencileri seç → [Öğrenci seçme](ogrenci-secme.md).
10. Bir sorun olursa pencere açık kalır: tarayıcının denetimi kutunun altına kırmızı yazar (ör. "Etüdün adını yaz."), sunucunun
    iletisi pencerenin altında kırmızı çıkar (ör. "Bir etüt 6 saatten uzun olamaz."). Düzeltip yeniden "Kaydet".
11. **"Vazgeç"** (ya da pencereyi kapatmak) hiçbir şey kaydetmez.

### Öğretmen

Müdür sana "Etüt açar; gününü, saatini, öğretmenini ve öğrencilerini düzenler" yetkisini verdiyse (ek rolünde, ör. "Etüt
Sorumlusu" ya da "Müdür Yardımcısı"; ya da bütün öğretmenlere hazır Öğretmen rolünde) adımlar müdürünkiyle aynıdır: menüde
**"Etütler"** → **"Etüt aç"**. "Öğretmeni" listesinden kendini de, başka bir öğretmeni de seçebilirsin. Yetkin yoksa "Yeni etüt"
kartı çıkmaz.

### Çalışan

Bugün kodda: etüt sorumlusu öğretmen hesabıyla ve ek rolüyle çalışır; adımlar öğretmeninkiyle aynı.

Tasarımda (çalışan tanımı): kişi okula "çalışan" olarak eklenir; özel rolünde etüt yetkisi varsa (ör. "Etüt sorumlusu")
öğretmen olmasa da etüt açar. Rolsüz çalışan açamaz ([Etüt yetkileri](etut-yetkileri.md)).

### Tasarımda: "Etüt planla" penceresi (Tasarım 1 önizlemesi)

Kullanıcının 29 Eylül isteğiyle etüt açma ile planlama tek pencerede birleşir:

1. **"Etüt ekle"** → **"Etüt planla"** penceresi.
2. **"Ders"** açılır listesi: okulun dersleri (ör. Matematik, Türkçe, Fen Bilimleri, Sosyal Bilgiler, İngilizce, Din Kültürü) ve
   en sonda **"Genel / serbest çalışma"**. Önizlemede Matematik seçili gelir.
3. **"Öğretmen"** açılır listesi iki grupta: üstte **"<Ders> öğretmenleri"** (ör. "Matematik öğretmenleri"), altta **"Öbür
   öğretmenler"** (her birinin yanında branşı: "Ali Yıldız · Fen Bilimleri"). Dersin branşından öğretmen yoksa tek grup
   **"Öğretmenler"**. Yani etüt sorumlusu istediği öğretmeni seçebilir, ama önce dersin öğretmenleri önerilir.
   Pencereyi bir öğretmen (önizlemede "Etüt sorumlusu" rolündeki öğretmen) ilk açtığında listede kendisi seçili gelir; müdürde
   örnek bir öğretmen seçili gelir.
4. **"Öğrenciler · <sayı>"** bölümünden öğrencileri ekle: sınıf çipleri, "Öğrenci ara (en az 2 harf)", "… sınıfının hepsini ekle"
   ([Öğrenci seçme](ogrenci-secme.md)). Önizlemede açılışta örnek olarak üç öğrenci seçili gelir.
5. Altta haftalık ızgaradan boş bir saate bas ([Boş zaman ızgarası](bos-zaman-izgarasi.md)).
6. **"Etüdü kaydet"**. Eksik varsa pencerenin altında kırmızı: **"Dersi seç."**, **"Öğretmeni seç."**, **"En az bir öğrenci
   ekle."**, **"Izgaradan bir saat seç."** Dolu bir saat seçtiysen önce sorulur: **"Bu saatte çakışma var"** → **"Yine de kaydet"**.
7. Kaydedilince kısa ileti: **"<etüdün adı> kaydedildi: <tarih> <saat>; öğretmene ve <sayı> öğrenciye bildirim gitti."** (ör. "Fen
   Bilimleri etüdü kaydedildi: Cuma 2 Ekim 2026 15:30–16:10; öğretmene ve 3 öğrenciye bildirim gitti."). Etüt müdürün listesinin en
   üstüne "Planlı" diye girer, takvimde ve ajandada da görünür; okulun işlem kaydına "<adın> etüt planladı" satırı düşer. Ders ve
   öğretmen seçimi kalır; öğrenciler, arama, sınıf seçimi ve seçilen saat temizlenir.
8. **"Vazgeç"** pencereyi kapatır.

Önizlemenin ayrıntıları (örnektir, kullanıcı karar vermedi):

- Etüdün adı kendiliğinden konur: "Matematik etüdü"; "Genel / serbest çalışma"da "Serbest çalışma etüdü"; aynı ad varsa
  "Matematik 2. etüdü", "Matematik 3. etüdü".
- Pencerede **"Adı"**, **"Yer"** ve **"Konu"** kutusu yoktur (yer "Okul" diye kaydedilir); etüt bir ders saati (40 dakika) sürer.
- Etüt tarihlidir: seçilen gün bu hafta henüz geçmediyse bu haftanın, geçtiyse (bugünse ve saati geçtiyse de) gelecek haftanın o
  günü.
- Tanımdaki öneri ayrıca "haftalık tekrar (her Salı)" ile "tek seferlik" etüt arasında seçim ister; önizlemede bu seçim yok.

Bugünkü "Adı" ve "Yer (isteğe bağlı)" alanlarının kalıp kalmayacağı, haftalık/tek seferlik seçiminin nasıl görüneceği kodlanırken
kararlaşacak; o güne kadar bugünkü kurallar geçerli.

## Kurallar ve sınırlar

- **Kim açar:** etüt düzenleme yetkisi olan ("Etüt açar; gününü, saatini, öğretmenini ve öğrencilerini düzenler"; müdür her zaman).
  Yetkisiz istek **"Etüt düzenleme yetkin yok"** alır. Öğrenci, veli ve servisçi hiçbir koşulda açamaz (**"Bu bölüm okul personeli
  içindir"**).
- **Ad:** zorunlu, 1–80 harf. Boşsa tarayıcı **"Etüdün adını yaz."**, sunucu **"Etüdün adını yaz (ör. Matematik etüdü)."** der.
  80 harften uzunu kesilir.
- **Gün:** Pazartesi–Pazar; geçersizse **"Günü seç."** (pencereden olmaz, yalnız elle gönderilen istekte).
- **Saatler:**
  - boşsa tarayıcı **"Başlangıç saatini seç."** / **"Bitiş saatini seç."**;
  - bitiş başlangıçtan önce ya da eşitse tarayıcı **"Bitiş başlangıçtan sonra olmalı."**, sunucu **"Bitiş saati başlangıçtan sonra
    olmalı."**;
  - biçim SS:DD olmalı: **"Saatleri SS:DD biçiminde yaz (ör. 15:40)."**;
  - bir etüt **en çok 6 saat** sürer: **"Bir etüt 6 saatten uzun olamaz."** (pencere bunu kaydetmeden denetlemez; ileti sunucudan
    gelir);
  - etüt gece yarısını geçemez (bitiş aynı günde başlangıçtan sonra olmalı).
- **Yer:** isteğe bağlı, en çok 60 harf.
- **Öğretmen:** boş bırakılabilir. Seçilirse okulun **onaylı öğretmeni ya da müdürü** olmalı; değilse **"Seçilen öğretmen bu okulda
  değil."** Öğrenci, veli ya da başka okulun öğretmeni seçilemez.
- **Çakışma denetimi yok:** bugün aynı öğretmene aynı saatte iki etüt ya da dersinin üstüne etüt açılabilir; uyarı çıkmaz.
  Çakışmayı görmek tasarımdaki ızgaranın işi.
- **Sayı sınırı yok:** bir okul istediği kadar etüt açar.
- **İşlem kaydı:** her yeni etütte okulun işlem kaydına **"Etüt açıldı"** ve etüdün adı yazılır
  ([Neler kaydedilir](../islem-kaydi/neler-kaydedilir.md)).
- **Bildirim:** yalnız seçilen öğretmene gider. Etüt açılınca öğrenciye ve veliye bildirim gitmez (öğrenciler sonra eklendiğinde de
  gitmez); tasarımda gider ([Etüt bildirimleri](etut-bildirimleri.md)).
- **Aday listesi oturum boyunca saklanır:** pencere ilk açılışta okulun öğretmenlerini, sınıflarını ve öğrencilerini bir kez yükler;
  çıkış yapana ya da portal değiştirene kadar aynı listeyi kullanır. Bu arada okula eklenen öğretmen "Öğretmeni" listesinde görünmez;
  tarayıcıyı yenile ya da yeniden gir (üst şeritteki "Yenile" bu listeyi tazelemez). Sunucu yine doğruyu denetler.
- **Eğitim yılı:** etüt yıla bağlı değil; geçmiş yıla bakarken de açılır.
- **Bölüm kapalıysa** açılamaz: **"Etütler bu okulda kapalı. Okul müdürü Özellikler sayfasından açabilir."**

## Kardeşler ve ilgili

**Kardeşler** (aynı klasör, [Etütler](README.md)):

- [Etütler sayfası](etutler-sayfasi.md) — "Etüt aç" düğmesinin yeri, yeni etüdün göründüğü liste.
- [Etüdün öğrencilerini seçme](ogrenci-secme.md) — açtıktan sonraki adım.
- [Etüdü düzenleme ve silme](etudu-duzenleme-ve-silme.md) — aynı pencerenin "Etüdü düzenle" hâli.
- [Boş zaman ızgarası](bos-zaman-izgarasi.md) — tasarımdaki "Etüt planla".
- [Etüt yetkileri ve hazır roller](etut-yetkileri.md) — kim açabilir.
- [Etüt bildirimleri](etut-bildirimleri.md) — "… etüdü sana verildi".
- [Etüt yoklaması](etut-yoklamasi.md) — öğretmenin etüt günü yapacağı iş.
- [Etüt ayrıntısı](etut-ayrintisi.md) — tasarımda kaydedilen etüdün penceresi.
- [Etütlerim](etutlerim.md) — açılan etüdün öğrencide ve velide görünüşü.

**İlgili:**

- [Neler kaydedilir](../islem-kaydi/neler-kaydedilir.md) — "Etüt açıldı".
- [Bildirim metinleri](../bildirim/bildirim-metinleri.md) — öğretmene giden bildirim.
- [Okulun ders saatleri](../ders-programi/ders-saatleri.md), [Çakışma uyarısı](../ders-programi/cakisma-uyarisi.md) — tasarımda
  ızgaranın dayandığı saatler ve ders programı.
- [Özel branş ve ders](../siniflar-dersler/ozel-brans-ve-ders.md) — tasarımda "Ders" listesinin kaynağı.
- [Rol düzenleyici](../roller-yetkiler/rol-duzenleyici.md), [Hazır şablonlar](../roller-yetkiler/hazir-sablonlar.md).
- [Kapalı bölüm](../ozellikler/kapali-bolum.md).

## Kod tarafı

- Ön yüz: [public/js/parcalar/18b-etut.md](../../public/js/parcalar/18b-etut.md) — `etutModal(e)` (alanlar `#etAd` 80, `#etGun`,
  `#etYer` 60, `#etBas`/`#etBit` 15:40–16:20, `#etOgretmen` "— sonra seçerim —"), `etutAdaylari()` (önbellekli `GET
  /api/etut/adaylar`), `EYLEMLER['etut-yeni']`, `EYLEMLER['etut-kaydet']` (istemci denetimi, `POST /api/etut/kaydet`, hata `#etMesaj`).
- Sunucu: [sunucu/bolumler/etut.md](../../sunucu/bolumler/etut.md) — `etutGovdesi` (ad 80, gün 1–7, `SS:DD`, en çok 6 saat, yer 60,
  `ogretmenAdaylari`: onaylı öğretmenler + müdür), `POST /api/etut/kaydet` (yeni kimlik `et` önekli, işlem kaydı `etut.acildi`,
  öğretmene `depo.genel.bildir` → `#/etutler`), `GET /api/etut/adaylar` (`etut.yonet`).
- Depo ve tablo: [sunucu/veri/depo/etutler.md](../../sunucu/veri/depo/etutler.md) — `ekle`; `etutler` tablosu (şema 013: ad 1–80,
  gün 1–7, `bitis > baslangic`, yer ≤ 60, öğretmen silinirse boş) ([SEMA.md](../../sunucu/veri/sema/SEMA.md)).
- Yetki: [sunucu/yetki.md](../../sunucu/yetki.md) — `etut.yonet`. İşlem kaydı adı:
  [sunucu/bolumler/islem-kaydi.md](../../sunucu/bolumler/islem-kaydi.md) (`'etut.acildi': 'Etüt açıldı'`).
- Testler: [testler/test-etut.md](../../testler/test-etut.md) (yetkisiz öğretmen açamaz, geçersiz gün ve ters saat reddi, öğretmen
  atama bildirimi), [testler/buton-denetimi.md](../../testler/buton-denetimi.md) (`etut-yeni`, `etut-kaydet`).

## Sık sorulanlar

- **Etüdü tek bir güne (ör. sadece 12 Ekim) açabilir miyim?** Bugün hayır; etüt her hafta seçilen günde tekrarlanır. Tek seferlik
  etüt tasarımdaki öneride var.
- **Haftada iki gün yapılan bir etüt nasıl açılır?** İki ayrı etüt aç (ör. "Matematik etüdü (Salı)" ve "Matematik etüdü (Perşembe)")
  ve ikisine de aynı öğrencileri seç.
- **Öğretmeni sonra seçsem olur mu?** Olur: "— sonra seçerim —" bırak, sonra "Düzenle"den seç. Öğretmen seçilince ona bildirim gider.
- **Yeni gelen öğretmen listede yok.** Liste oturum boyunca saklanır; tarayıcıyı yenile ya da çıkıp yeniden gir.
- **Etüt aynı saatte dersi olan bir öğretmene verildi, uyarı çıkmadı.** Bugün çakışma denetimi yok; tasarımdaki boş zaman ızgarası
  bunu çözecek.
- **Müdür etüdün öğretmeni olabilir mi?** Evet; müdür "Öğretmeni" listesinin sonundadır.

## Sırada

- Etüt planlama (öneri, 29 Eylül): ders seçimi, branşa göre öğretmen listesi, aynı pencerede öğrenci seçimi, canlı boş zaman ızgarası,
  çakışmada uyarı, haftalık ya da tek seferlik etüt, öğretmene ve öğrenciye/veliye bildirim, ajanda; sunucuya "boş zaman" ucu.
- Özel branş / ders: okulun kendi dersleri tasarımdaki "Ders" listesine girecek.
- Çalışan olarak ekleme: etüt görevi öğretmen olmayan çalışana da verilebilecek.
- Çok dil: pencere metinleri ve hata iletileri çeviri kataloğuna girecek.
