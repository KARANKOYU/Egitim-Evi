# Ders programı · Ders programım (günlük ve haftalık)

**Durum:** Kodda var; tasarımda ek olarak öğrencide "Günlük | Haftalık" (Günlük ayrıntılı, Haftalık yalnız ders adı), öğretmende tek haftalık tablo (hücrede sınıf, "şimdi · yoklama al", çakışmada "!", hücreye basınca yoklama ya da ders penceresi), ana sayfalarda "Bugünkü dersler" ve "Ders programı" kutucuğu; müdür portalında kendi dersleri yok.

Herkesin kendi programına baktığı sayfa: öğretmenin verdiği dersler, öğrencinin sınıfının programı, velinin çocuğunun programı.

## Ne işe yarar

Okulda her sabah sorulan soru "Bugün hangi ders, saat kaçta?"tır. Bu sayfa soruyu role göre cevaplar:

- **Öğretmen** kendisine atanmış dersleri, her dersin kaç öğrencisi olduğunu ve haftalık programını görür; bugünkü dersin kartından
  tek dokunuşla yoklama alır.
- **Öğrenci** sınıfının programını, her dersin öğretmeniyle görür.
- **Veli** çocuğunun sınıf programını görür.

Kullanıcının istekleri: her öğretmen kendisine atanmış dersleri program olarak görsün (28 Ağustos); öğretmende her gün ayrı sayfa,
haftalıkta yalnız ders adı, günlükte ayrıntı (29 Ağustos); öğretmen kendi programında o an girdiği derse dokunup yoklama alsın (26 Eylül).

## Nereden açılır

Bugünkü site (adres `#/programim`):

- **Öğrenci:** sol menüde **"Ders Programı"**.
- **Veli:** sol menüde **"Çocuklarım"** → çocuğun kartı (**"Portalını aç"**) → menüde çocuğun adının altında **"Ders Programı"**.
  Velinin kendi menüsünde bu satır yoktur.
- **Öğretmen:** sol menüde **"Ders Programım"** (yetki gerekmez); ayrıca "Ders programına yeni ders saatlerin eklendi…" ve sabahki
  "Bugün 4 dersin var: …" bildirimine basınca.
- **Müdür:** menüde yok. Derse öğretmen olarak atanmış müdür bu iki bildirimden ya da adresle gelirse kendi derslerini öğretmen gibi
  görür.

Tasarımda (Tasarım 1 önizlemesi):

- Öğrencinin menüsünde **"Ders programı"**; ana sayfada **"Ders programı"** kutucuğu ("şimdi: Matematik") ve yanda **"Bugünkü
  dersler"** kutusu ([Öğrencinin ana sayfası](../ana-sayfa/ogrenci-ana-sayfasi.md)).
- Öğretmenin menüsünde **"Ders programım"**; ana sayfada **"Ders programım"** kutucuğu ("şimdi: 7-A" ya da "bugün 4 ders") ve
  **"Bugünkü derslerin"** kutusu ([Öğretmenin ana sayfası](../ana-sayfa/ogretmen-ana-sayfasi.md)).
- Velide her çocuk ayrı oturumdur ([Velide çocuk oturumları](../portallar/velide-cocuk-oturumlari.md)). Önizlemedeki veli menüsünde
  "Ders programı" satırı yok; kullanıcı velinin programı görmesini kaldırmadı (bugün görür), önizlemenin bir eksiği olarak raporlandı.
- Müdür portalında "Kendi derslerim" bölümü kaldırıldı (kullanıcı 29 Ağustos: "alttaki derslerim olmicak sadece o günkü dersler";
  2 Ekim: "müdürün niye kendi derslerim var"); müdürün kendi programı yok, ana sayfasında okulun o günkü dersleri durur.

## Adım adım

### Öğrenci

1. Menüden **"Ders Programı"**.
2. Başlık **"DERS PROGRAMI"**, altında mavi kutu **"Sınıf: 7-A"**.
3. **"Gün"** | **"Hafta"** ile görünümü seç ([Gün ve hafta görünümü](gun-ve-hafta-gorunumu.md)). Gün görünümü bugünü açar (bugün ders
   yoksa haftanın dersi olan ilk gününü); kartlarda saat, ders ve dersin öğretmeni; süren derste "şimdi".
4. Henüz bir sınıfa yerleştirilmediysen: **"Henüz bir sınıfa yerleştirilmedin. Müdürün seni sınıfa eklediğinde programın burada
   görünecek."**
5. Sınıfının programı yoksa: **"Sınıfının ders programı henüz oluşturulmadı."**

Tasarımda (Tasarım 1 önizlemesi):

1. Üstte **"Günlük"** | **"Haftalık"** ve "ders 40 dk · teneffüs 10 dk".
2. **Günlük:** gün düğmeleri ("Pzt 28" … "Paz 4"); seçilen günün kutusu "Perşembe, 1 Ekim · bugün" (sağında "7-A"); satırlar
   "1. ders" + "Türkçe" + "08:30–09:10 · Selin Arı"; süren derste **"Şu an"** rozeti; boş saat "[boş]"; dersi olmayan gün
   "Bu gün ders yok."
3. **Haftalık:** "Haftalık program · 7-A · 28 Eylül – 4 Ekim"; satırlar "1. ders 08:30–09:10", sütunlar Pazartesi … Pazar, hücrede yalnız
   dersin adı.
4. Ana sayfanın **"Bugünkü dersler"** kutusu: "1. ders · Türkçe · 08:30–09:10 · Selin Arı", süren ders vurgulu ("Matematik · şu an");
   kutunun bağlantısı Ders programı'nı açar. Ana sayfanın alt başlığı da "şu an 3. ders: Matematik (10:10–10:50)" der.

**Öğrencide portallar (tasarım):** öğrenci okulunun yanında bir dershaneye de kayıtlıysa ([Öğrencide portallar](../portallar/ogrencide-portallar.md))
dershane portalının da kendi **"Ders programı"** vardır: "Örnek Dershanesi · 7. sınıf B grubu · 201 nolu sınıf", **"Hafta sonu
programı"** (Cumartesi ve Pazar, 09:00–12:10). Dershane ana sayfasındaki "Bu Cumartesi · 3 Ekim" listesinde bir derse basınca pencere:
**Kurum**, **Gün**, **Saat** ("1. ders · 09:00–09:40"), **Öğretmen**, **Derslik**, **Konu**; "Kapat".

### Veli

1. **"Çocuklarım"** → çocuğun kartında **"Portalını aç"** → menüde çocuğun adının altında **"Ders Programı"**.
2. Sayfa öğrencininkinin aynısı; başlığın altında **"<çocuğun adı> adına görüntülüyorsun."** (ör. "Elif Yılmaz adına
   görüntülüyorsun."), sonra "Sınıf: 7-A" ve program (kartlarda öğretmen adları).
3. Çocuk sınıfsızsa ekranda yine öğrenciye yazılmış metin çıkar: "Henüz bir sınıfa yerleştirilmedin. …"
4. Menüdeki **"Çocuk Listesi"** ile çocuklarına dönersin.
5. Çocuk seçmeden adres çubuğuna `#/programim` yazarsan kırmızı kutuda "Öğrenci seçmelisin" çıkar; zararsızdır.

Tasarımda: velide her çocuk ayrı oturum. Önizlemede veli için bu sayfa yok (yukarıda "Nereden açılır"); velinin programı öğrencininkiyle
aynı Günlük/Haftalık biçimde mi göreceği kararlaştırılmadı, kullanıcıya sorulacak.

### Öğretmen

1. Menüden **"Ders Programım"**.
2. Başlık **"DERS PROGRAMIM"**, alt yazı "Müdürün sana atadığı dersler ve haftalık programın."
3. Kendi derslerin aynı saate düştüyse kırmızı kutu: "Programında çakışma var — aynı saatte birden fazla sınıf görünüyor. Müdürüne
   bildir." ([Çakışma uyarısı](cakisma-uyarisi.md)).
4. Hiç dersin yoksa: **"Sana henüz ders atanmadı. Müdürün sınıflara ders atadığında burada görünecek."** (sayfa burada biter).
5. **"Gün"** | **"Hafta"** ve program: kartların alt satırında **sınıfın adı** (ör. "7-A").
6. **Bugünkü dersin kartında yoklama düğmesi** (yalnız Gün görünümünde):
   - ders şu an sürüyorsa dolu düğme **"Şu an — yoklama al"**;
   - derse 15 dakika kala ya da ders bittikten sonra gün boyu soluk **"Yoklama"**;
   - 15 dakikadan uzak dersler için düğme yok;
   - basınca **"Yoklama"** penceresi: üstte "7-A · Matematik · bugün 09:20 · 28 öğrenci" ve **"Hepsi geldi"**; her öğrencinin altında üç
     büyük düğme **"Geldi"** · **"Gelmedi — izinli"** · **"Gelmedi — izinsiz"**; **"Vazgeç"** / **"Kaydet"** → "Yoklama kaydedildi.
     Gelmeyen 2 öğrencinin velisine bildirim gitti." ya da "Yoklama kaydedildi. Herkes geldi." Ayrıntılar ve kurallar:
     [Ders programından yoklama](../devamsizlik/programdan-yoklama.md).
7. Programın altında her dersin bir satırı: **"7-A · Matematik"**, altında **"28 öğrenci"**, sağda **"3 / 4 saat"** (programa yerleşen /
   haftalık; eşitse yeşil, değilse turuncu). Üstteki arama kutusu bu satırları süzer ([Sayfa içi arama](../menu-ve-arama/sayfa-ici-arama.md)).

Tasarımda (Tasarım 1 önizlemesi):

1. Alt başlık "Bu hafta 20 ders saati" (haftadaki ders saatlerin sayılır; çakışma varsa "· 1 çakışma").
2. Çakışma varsa üstte kırmızı düğme "1 çakışma var · Salı 2. ders (09:20–10:00) · 8-B ile 7-C aynı saatte".
3. Tek **"Haftalık program"** tablosu ("ders 40 dk · teneffüs 10 dk"): satırlar "1. ders 08:30–09:10" …, sütunlar günler, bugünün
   sütununda "bugün". Hücrede o saatte girdiğin sınıf; altında küçük yazı: başka günde ve bugünün gelecek dersinde "Matematik", süren
   derste **"şimdi · yoklama al"**, geçmiş derste **"yoklama al"** ya da **"yoklama alındı"**; boş saat "[boş]"; çakışmada "8-B · 7-C"
   ve **"!"**.
4. Süren ya da geçmiş (bugünkü) derse basınca yoklama penceresi açılır. Başka günün ya da bugünün henüz başlamamış dersine basınca ders
   penceresi: başlık **"Pazartesi · 1. ders"**, **Saat**, **Sınıf**, **Ders**; bugünkü gelecek derste "Bugünkü ders; yoklama ders başlayınca
   açılır (08:30)."; çakışmada "8-B ile 7-C aynı saate düşmüş. Ders programını müdür düzenler."; **"Kapat"**.
5. Ana sayfanın **"Bugünkü derslerin"** kutusu: "1. ders · 7-A · Matematik · 08:30–09:10 · Alındı", süren derste "· şu an" ve "Yoklama
   al"; kutucuk "Ders programım" "şimdi: 7-A".
6. Her dersten 10 dakika önce "3. ders 10 dakika sonra başlıyor" bildirimi ([Ders başlamadan öğretmene bildirim](../bildirim/ders-oncesi-bildirim.md)).

### Müdür

Bugünkü site: müdürün menüsünde "Ders Programım" yoktur; programı kurduğu sayfa ayrıdır ([Ders programı kurma](program-kurma.md)).
Müdür bir derse öğretmen olarak atanabildiği için (öğretmen listesinde müdürler de var) ders veren müdüre de "Ders programına yeni ders
saatlerin eklendi…" ve sabah özeti gider; bildirime basınca bu sayfa öğretmen görünümüyle açılır. Ders vermeyen müdür adresle gelirse
"Sana henüz ders atanmadı. …" görür.

**Öğrencinin portalında:** müdür ya da "Öğrenci portalına girer" yetkili öğretmen "Öğrenciler" / "Okul Öğrencileri" listesinde
**"Portalını aç"**a basınca menüde öğrencinin adının altında "Ders Programı" çıkar; ama bu sayfa bugün öğrencinin değil **kendi**
programını gösterir (ders vermeyen müdürde "Sana henüz ders atanmadı."). Öğretmen ya da müdür portalındaki "Velisi olduğum" →
"Çocuklarım"dan çocuğunun portalını açan için de aynısı geçerli; çocuğun programı için Portallarım'dan veli portalına geç. Kod
okumasına göre; tarayıcıda denenmedi ([Öğrenci portalını açma](../hesaplar/ogrenci-portalini-acma.md)).

Tasarımda: müdürün kendi dersleri ve kendi programı yok; öğrencinin portalında öğrencinin programı görünür.

### Çalışan

Bugün kodda okuldaki herkes öğretmen hesabı olduğu için menüde "Ders Programım" çıkar (ders atanmamışsa boş). Tasarımda öğretmen olmayan
çalışan derse atanamaz; bu sayfa yalnız Öğretmen rolü olanlar içindir. Rolsüz çalışan görmez.

## Kurallar ve sınırlar

- **Kim kimin programını görür:** öğrenci yalnız kendininkini; veli bağlı olduğu çocuğunkini; müdür okulundaki her öğrencinin programını
  sunucudan alabilir (ekranda yukarıdaki eksik var); öğretmen yalnız ders verdiği ya da "Öğrenci portalına girer" yetkisiyle açtığı
  öğrencininkini. Başkası **"Bu öğrenciyi görüntüleyemezsin"**; öğrenci seçmeden istenirse **"Öğrenci seçmelisin"**; öğrenci yoksa
  **"Öğrenci bulunamadı"**.
- **Öğretmenin sayfası** yalnız öğretmen ve müdüre açıktır; başkası "Yetkin yok".
- **Ne görünür:** öğrencide sınıfının bütün ders saatleri ve öğretmen adları; öğretmende bütün sınıflardaki kendi ders saatleri, sınıf
  adları ve her sınıfın öğrenci sayısı. Öğrencilerin adları bu sayfada yoktur (yalnız yoklama penceresinde).
- **Yoklama düğmesi:** okulda "Devamsızlık" bölümü açık, kişide "Yoklama alır" yetkisi var, ders bugün ve 15 dakikadan yakın; yalnız
  Gün görünümünde. Saat cihazın saatine göredir.
- **Çakışma:** öğretmende yalnız kendi derslerinin birbiriyle çakışması gösterilir; öğrencide ve velide çakışma işareti yok.
- **"3 / 4 saat"**: öğretmen ekranında fazla yerleşen ders de turuncudur (müdür ekranında kırmızı).
- **Eğitim yılı:** program yıla göre süzülmez; geçmiş yıla bakarken de bugünkü program görünür. Tasarımda geçmiş yılın programı eğitim
  yılı sayfasının özetinde "yalnız okunur" ([Geçmiş yıla bakma](../egitim-yili/gecmis-yil.md)).
- **Özellikler:** Ders programı kapatılamaz; yalnız yoklama düğmesi Devamsızlık bölümüne bağlıdır.
- **Uygulama:** Android uygulamasında bugün program ekranı yok ([Android uygulaması](../uygulama/android-uygulamasi.md)).

## Kardeşler ve ilgili

**Kardeşler** (aynı klasör, [Ders programı](README.md)):

- [Gün ve hafta görünümü](gun-ve-hafta-gorunumu.md) — bu sayfadaki programın çizimi.
- [Okulun ders saatleri](ders-saatleri.md) — tasarımdaki "1. ders 08:30–09:10".
- [Çakışma uyarısı](cakisma-uyarisi.md) — öğretmenin kırmızı kutusu.
- [Programı yayımlama ve haber verme](yayimlama-ve-bildirim.md) — bu sayfaya götüren bildirimler.
- [Ders programı kurma](program-kurma.md), [Programı Excel'den kurma](excelden-program.md),
  [Programı Excel olarak indirme](programi-indirme.md).

**İlgili:**

- [Ders programından yoklama](../devamsizlik/programdan-yoklama.md), [Ders yoklaması](../devamsizlik/ders-yoklamasi.md).
- [Ders başlamadan öğretmene bildirim](../bildirim/ders-oncesi-bildirim.md).
- [Çocuklarım](../portallar/cocuklarim.md), [Velide çocuk oturumları](../portallar/velide-cocuk-oturumlari.md),
  [Öğrencide portallar](../portallar/ogrencide-portallar.md), [Öğrenci portalını açma](../hesaplar/ogrenci-portalini-acma.md).
- [Sınıflarım (öğretmen)](../siniflar-dersler/siniflarim.md) — girdiğin sınıfların öğrencileri ve sonuçları.
- [Görüşme başlat ve ping](../toplanti/gorusme-baslat-ve-ping.md), [Uzaktan ders bağlantısı](../toplanti/uzaktan-ders-baglantisi.md) —
  "şu an" dersinden uzaktan ders (tasarım).
- [Tahta: sınıf seçme](../tahta/sinif-secme.md) — tahtanın gördüğü sınıf programı.

## Kod tarafı

- Ön yüz: [public/js/parcalar/22-programim.md](../../public/js/parcalar/22-programim.md) — `SAYFALAR.programim` (role göre),
  `ogretmenProgrami` (çakışma kutusu, boş durum, alt satırda sınıf, `altAlan.ekIslem` yoklama düğmesi, ders satırları),
  `program-yoklama` / `py-durum` / `py-hepsi` / `py-kaydet` (yoklama penceresi), `ogrenciProgrami` ("Sınıf: …", boş durumlar).
- Çizim: [public/js/parcalar/21-ders-programi.md](../../public/js/parcalar/21-ders-programi.md) (`gorunumSecici`, `programGovdesi`,
  `bugunNo`, `yetkim`).
- Menü: [public/js/parcalar/06-menu.md](../../public/js/parcalar/06-menu.md) (öğrencide "Ders Programı", öğretmende "Ders Programım",
  portal görünümünde öğrencinin adının altında "Ders Programı"); portal açma: [13-ogrenci-veli.md](../../public/js/parcalar/13-ogrenci-veli.md)
  (`hedefOgrenci`), [10-mudur.md](../../public/js/parcalar/10-mudur.md) (`ogrenciPortalAc`).
- Sunucu: [sunucu/bolumler/ogretmen.md](../../sunucu/bolumler/ogretmen.md) — `GET /api/teacher/schedule` (`cells` + `cakisma`, `lessons`
  + `studentCount`); [sunucu/bolumler/ilerleyis.md](../../sunucu/bolumler/ilerleyis.md) — `GET /api/myschedule[?studentId=]`
  (`canSeeStudent`); yoklama: [sunucu/bolumler/devamsizlik.md](../../sunucu/bolumler/devamsizlik.md).
- Veri: [sunucu/veri/depo/siniflar.md](../../sunucu/veri/depo/siniflar.md) (`ogretmeninProgrami`, `ogretmeninDersleri`,
  `sinifinProgrami`); kim kimi görür: [sunucu/iliskiler.md](../../sunucu/iliskiler.md).
- Testler: [testler/test-program.md](../../testler/test-program.md) (öğretmenin ve öğrencinin programı),
  [testler/test-siniflarim.md](../../testler/test-siniflarim.md) (programdan yoklama), [testler/test-yonetim.md](../../testler/test-yonetim.md)
  (müdür öğrencinin programını alabiliyor).
- Kullanıcıya dönük anlatım: [belge/KILAVUZ.md](../../belge/KILAVUZ.md) ("Kim ne görür", "Yoklama (ders programından)").

## Sık sorulanlar

- **Programım boş görünüyor.** Öğrenciysen sınıfına yerleştirilmemiş ya da sınıfının programı kurulmamış olabilir; öğretmense sana
  ders atanmamıştır. Müdüre yaz.
- **Veli olarak çocuğumun programını nerede görürüm?** "Çocuklarım" → çocuğunun kartı → menüde "Ders Programı".
- **Yoklama düğmesi çıkmıyor.** Ders bugün mü, başlamasına 15 dakikadan az mı kaldı, Gün görünümünde misin, okulda Devamsızlık açık mı,
  rolünde "Yoklama alır" var mı — beşi de gerekir.
- **Müdürüm, bir öğrencinin portalında "Ders Programı"na bastım, kendi programım çıktı.** Bugünkü kodun bir eksiği; öğrencinin programını
  Ders Programı sayfasında sınıfını seçerek gör.
- **"şimdi" yanlış derste.** Cihazının saatini denetle.
- **Telefona programım gelir mi?** Bugün uygulamada program ekranı yok; site telefonda da açılır.

## Sırada

- Tasarım 1: öğrencide Günlük | Haftalık (velide de olup olmayacağı sorulacak), öğretmende tek haftalık tablo ve hücreden yoklama,
  ana sayfalarda "Bugünkü dersler".
- Okulun ders saatleri: "1. ders 08:30–09:10" yazımı.
- Toplantılar ve sınıfın uzaktan ders bağlantısı: "şu an" dersinde "Görüşme başlat", gelmeyene "Katıl" bildirimi.
- Android yerel uygulama: öğrencide program (bugün vurgulu), öğretmende program + yoklama.
- Çalışan olarak ekleme: "Ders Programım" yalnız Öğretmen rolü olanlarda.
- Yıl geçişi: mezun öğrencinin yeni yılda programı olmayacak.
- Tam debug: personelin öğrenci portalında kendi programını görmesi.
- Çok dil: ekran ve bildirim metinleri kataloğa.
