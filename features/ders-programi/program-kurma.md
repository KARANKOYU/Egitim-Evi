# Ders programı · Ders programı kurma

**Durum:** Kodda var; tasarımda ek olarak program okulun ders saatlerine ("1. ders 08:30–09:10") oturan haftalık bir ızgarada kurulur: günün yanındaki "+", "Dersler" listesinden derse basıp boş saate koyma ya da sürükleme, taşıma, onaylı kaldırma, listeye yeni ders ekleme ve "Kaydet ve yayımla".

Müdürün (ya da "Ders programını düzenler" yetkisi verilen kişinin) bir sınıfın haftalık programına ders saatlerini eklediği, değiştirdiği ve sildiği ekran.

## Ne işe yarar

Okulun programı sabit "1. kutu, 2. kutu" diye kurulmaz: her ders saatini sen yazarsın. Bir kayıt dört şeyden oluşur: **sınıf**,
**ders** (dersin öğretmeni dersle birlikte gelir), **gün** (Pazartesi'den Pazar'a) ve **başlangıç–bitiş saati** (okulunun zil
düzenine göre, ör. 09:20–10:00). Bir ders haftada istediğin kadar saate konur; hafta sonuna da ders yazılabilir, boş kalan saat
"[boş]" görünür.

Burada kurduğun program okulun pek çok yerini besler: öğretmenin [Ders programım](programim.md) sayfası ve oradaki yoklama düğmesi,
öğrencinin ve velinin programı, öğretmene sabah giden "Bugün 4 dersin var…" özeti, tasarımda devamsızlığın gün durumu, etüt
planlamanın boş zaman ızgarası ve tahtanın "bugünkü dersler" listesi.

Kullanıcının istekleri: müdür ders programını işlesin, haftada kaç ders olduğunu görsün (28 Ağustos); program Pazartesi'den Pazar'a
olsun, günün sağındaki "+" ile ders eklensin, başlangıç ve bitiş saatini müdür kendi ayarlasın (29 Ağustos); boş bırakılan yerde
"[boş]" yazsın (26 Eylül); dersler "1. ders, 2. ders" diye ve bitiş saatiyle görünsün (1 Ekim); önizlemeye bakarken "ders ekle ve
bunu programa koy … böyle değildi" diyerek akışın düzeltilmesini, silmelerin onaylı olmasını istedi (2 Ekim).

## Nereden açılır

Bugünkü site (adres `#/program`):

- **Müdür:** sol menüde **"Okul Düzeni"** başlığının altında **"Ders Programı"**; ana sayfada **"Ders Programı"** kutucuğu (alt
  yazısı "Haftalık program ve ders atamaları"); **"Sınıflar"** sayfasında bir sınıfın satırındaki **"Ders programı"** düğmesi (o sınıfı
  seçili açar, günü bugünden başlatır).
- **Öğretmen:** rolünde "Ders programını düzenler" varsa menünün ek bölümünde **"Ders Programı"** (bölümün başlığı özel rolün adıdır,
  rolün adı yoksa "Ek Yetkiler"). Kendi derslerini gösteren **"Ders Programım"** ayrı bir sayfadır ([Ders programım](programim.md)).

Tasarımda (Tasarım 1 önizlemesi): menüde **"Okul düzeni"** → **"Ders programı"**; sayfanın alt başlığı "7-A · Pazartesi–Pazar".
Sınıflar sayfasında sınıf kartına basınca açılan sınıf sayfasının **"Ders programı"** sekmesi aynı sınıfın programını salt okunur
gösterir ([Sınıfın sayfası](../siniflar-dersler/sinif-sayfasi.md)). Önizlemedeki müdür ana sayfasında "Ders programı" kutucuğu yok;
onun yerine okulun o günkü derslerini salt okunur gösteren **"Bugünün dersleri"** kutusu ve **"Gün seç"** var (kullanıcı 29 Ağustos:
müdürün kendi dersleri olmasın, "sadece o günkü dersler", "gün seç"ten başka güne bakabilsin;
[Müdürün ana sayfası](../ana-sayfa/mudur-ana-sayfasi.md)).

## Adım adım

### Sayfada ne var (bugünkü site)

- Başlık **"DERS PROGRAMI"**, alt yazı "Gün gün ya da haftalık bak. Ders ekle ile saatini kendin belirle, çakışma olursa uyarırım."
- Bir kartta **"Sınıf"** açılır kutusu: okulun sınıfları ad sırasıyla. İlk açılışta ilk sınıf seçilidir; seçtiğin sınıf oturum boyunca
  akılda kalır (sayfadan çıkıp dönünce aynı sınıf gelir).
- Son kaydettiğin ders bir çakışma yarattıysa kırmızı uyarı (yalnız bir kez görünür) ve okulda çakışma varsa kırmızı
  **"N çakışma var"** kutusu ([Çakışma uyarısı](cakisma-uyarisi.md)).
- **"Gün | Hafta"** anahtarı ve programın kendisi ([Gün ve hafta görünümü](gun-ve-hafta-gorunumu.md)). Bu sayfada program
  düzenlenebilir çizilir:
  - her dersin kartında saat, ders adı, alt satırda öğretmenin adı ya da **"öğretmen atanmadı"**, altta **"Düzenle"** ve kırmızı
    **"Sil"**;
  - Gün görünümünün en sonunda kesik çizgili **"+ Ders ekle"** kartı (gün tümden boşsa yalnız bu kart görünür);
  - Hafta görünümünde her gün satırının sonunda **"+"** (üstüne gelince "Pazartesi gününe ders ekle").
- **"Bu sınıfın dersleri"** kartı: her ders, altında öğretmeni (yoksa kırmızı "öğretmen atanmadı"), sağda **"3 / 4 saat"** etiketi —
  programa yerleşen saat / dersin haftalık saati. Eşitse yeşil, eksikse turuncu, fazlaysa kırmızı.
- Sınıfın hiç dersi yoksa bu kart yerine mavi kutu: "Bu sınıfa ders eklenmemiş. Sınıflar sayfasından ders ekleyebilirsin." ("Sınıflar
  sayfasından" bağlantıdır).
- Okulda hiç sınıf yoksa: alt yazı "Önce sınıf açman gerekiyor.", boş kutu "Program yapabilmek için en az bir sınıf gerekli." ve
  **"Sınıflar sayfasına git"** düğmesi.

### Müdür

**Hazırlık.** Program yalnız sınıfın kendi derslerinden kurulur. Önce [Sınıflar](../siniflar-dersler/sinif-acma.md) sayfasında sınıfı
aç, sonra sınıfın **"Dersler"** penceresinde derslerini ekle, her derse haftalık saat ve öğretmen ver
([Sınıfa ders ve öğretmen atama](../siniflar-dersler/ders-atama.md)).

**Ders saati eklemek:**

1. Menüden **"Ders Programı"**, **"Sınıf"** kutusundan sınıfı seç (ör. 7-A).
2. Gün görünümünde günü seç (üstteki gün şeridinden ya da "‹ önceki gün" / "sonraki gün ›" ile) ve en sondaki **"+ Ders ekle"**
   kartına bas. Hafta görünümündeysen o günün satırının sonundaki **"+"**ya bas.
3. **"Ders ekle"** penceresi açılır:
   - **"Gün"** — bastığın gün seçili gelir; Pazartesi–Pazar arasında değiştirebilirsin;
   - **"Ders"** — sınıfın dersleri, öğretmeniyle: "Matematik — Ayşe Kaya" ya da "Müzik — öğretmen yok";
   - **"Başlangıç"** (09:00 gelir) ve **"Bitiş"** (09:40 gelir) saat kutuları;
   - ipucu: "Saatleri okulunun zil düzenine göre serbestçe yazabilirsin."
4. Saatleri yaz (ör. 09:20 ve 10:00) ve **"Kaydet"**e bas.
5. Pencere kapanır, program yeniden çizilir; yeni ders kartı yerini alır, "Bu sınıfın dersleri"ndeki sayaç artar.
6. Bu ders aynı öğretmenin ya da aynı sınıfın başka bir dersiyle aynı saate düştüyse sayfanın üstünde bir kez kırmızı uyarı çıkar
   (ör. "Bu öğretmen aynı saatte 7-B sınıfında Matematik dersinde de görünüyor (09:20-10:00).") ve iki ders kırmızı görünür. Ders yine
   kaydedilmiştir; düzeltmek senin elinde ([Çakışma uyarısı](cakisma-uyarisi.md)).
7. Bir sorun olursa pencere açık kalır ve ileti pencerenin altında kırmızı çıkar (aşağıda "Kurallar ve sınırlar"). Düzeltip yeniden
   "Kaydet".
8. **"Vazgeç"** hiçbir şey kaydetmez.

**Ders saatini değiştirmek:**

1. Dersin kartında (Hafta görünümünde hücresinde) **"Düzenle"**ye bas.
2. **"Ders saatini düzenle"** penceresi aynı alanlarla, dersin bugünkü günü, dersi ve saatleri dolu açılır.
3. Saati değiştir, **"Gün"** ile başka güne taşı ya da **"Ders"** ile o saatin dersini değiştir; **"Kaydet"**.
4. Taşıma da çakışma uyarısı verebilir. Değişiklik için öğretmene bildirim gitmez.

**Ders saatini silmek:**

1. Kartta **"Sil"**e bas.
2. Tarayıcının onay kutusu: **"Bu ders saati programdan silinsin mi?"** → Tamam.
3. Program yeniden çizilir. Yalnız o saat gider; ders ve öğretmen ataması yerinde kalır. Geri alma yok.

**Bir dersin bütün saatlerini kaldırmak:** dersi Sınıflar → "Dersler" penceresinden silersen ("Ders silinsin mi? Bu dersin ders
programındaki saatleri de silinir.") programdaki bütün saatleri gider. Sınıfı silersen sınıfın bütün programı gider.

**Öğretmeni değiştirmek:** programda öğretmen seçilmez; öğretmen dersin kendisine bağlıdır. Sınıflar → "Dersler" penceresinde dersin
öğretmen kutusunu değiştirirsen o dersin programdaki bütün saatlerinde yeni öğretmen görünür (bu sayfada, öğretmenin ve öğrencinin
programında).

### Öğretmen

Müdür sana "Ders programını düzenler" yetkisini bir rolle verdiyse ([Yetki listesi](../roller-yetkiler/yetki-listesi.md)) adımlar
müdürünkiyle aynı. Ama:

- Sayfa açılırken okulun sınıf listesi istenir, o da **"Sınıf açar ve siler"** yetkisini ister. Rolünde yalnız "Ders programını
  düzenler" varsa menüde "Ders Programı"nı görürsün ama sayfa yerine **"Bu işlem için yetkin yok"** çıkar. Hazır "Müdür Yardımcısı"
  şablonu ikisini de taşır ([Hazır rol şablonları](../roller-yetkiler/hazir-sablonlar.md)).
- Yetki sınıfla daraltıldıysa (ör. yalnız 7-A ve 7-B; [Ders ve sınıf daraltması](../roller-yetkiler/ders-ve-sinif-daraltmasi.md))
  yalnız o sınıfların programını açar ve yazarsın; başka bir sınıf **"Bu ders ya da sınıf için yetkin yok"** der. Okulun listesindeki
  ilk sınıf kapsamında değilse sayfa açılışta yalnız bu iletiyle kalır, sınıf kutusu çizilmez. Çıkış yolu: **Sınıflar** sayfasında
  izinli sınıfın **"Ders programı"** düğmesi (kod okumasına göre; tarayıcıda denenmedi).
- Çakışma kutusu okulun bütün çakışmalarını gösterir; daraltılmış rolde de başka sınıfların çakışmalarını görürsün.

### Çalışan

Bugün kodda: okulda ek görevi olan kişi öğretmen hesabıyla bir özel rol taşır (ör. "Müdür Yardımcısı"); adımlar ve sınırlar öğretmen
bölümündeki gibi.

Tasarımda: kişi okula "çalışan" olarak eklenir; öğretmen olmasa da müdürün verdiği özel rolde "Ders programını düzenler" varsa programı
kurar (Tasarım 1'deki "Müdür yardımcısı" hazır rolü bu yetkiyi taşır). Öğretmen olmayan çalışan bir derse öğretmen olarak yazılamaz.
Rolsüz çalışan bu sayfayı hiç görmez ([Rolsüz çalışan](../ogretmenler-calisanlar/rolsuz-calisan.md)).

### Tasarımda (Tasarım 1 önizlemesi)

Müdürün ekranı haftalık bir ızgaradır:

- En üstte sınıf çipleri (5-A, 5-B … 8-D); bastığın sınıf açılır.
- **"7-A haftalık program"** kutusu; başlığın sağında durum: **"taslak"**, yayımlandıysa **"yayımlandı · 10:41"**, bir ders seçiliyse
  **"Matematik seçili · boş bir saate bas"**.
- Tablonun ilk sütunu **"Saat"**: satırlar okulun ders saatleridir ("1. ders 08:30–09:10", "2. ders 09:20–10:00" …;
  [Okulun ders saatleri](ders-saatleri.md)). Bu saatlerin dışına konmuş bir ders için ayrıca **"Ek saat"** satırı açılır.
- Sütunlar **Pazartesi … Pazar**; her gün başlığının yanında **"+"** ("Pazartesi gününe ders ekle").
- Dolu hücre: dersin adı (dersin rengiyle) ve altında öğretmeni ya da "öğretmen yok". Boş hücre: **"[boş]"** (bir ders seçiliyken
  "+" simgesi).
- Yanda **"Dersler"** kutusu ("yerleşen / haftalık"): sınıfın dersleri renkli; ad, öğretmen ve "3 / 4" rozeti (eşitse yeşil, eksikse
  turuncu, fazlaysa kırmızı). Altında **"Ders ekle"**, **"Excel'den"** ve **"Kaydet ve yayımla"**.

Ders koymanın üç yolu:

1. **Günün yanındaki "+"** → pencere **"Pazartesi · ders ekle · 7-A"**:
   - **"Ders"** — sınıfın dersleri ve okulun ders listesindeki öbür dersler;
   - **"Öğretmen"** — "Atanmadı" ve okulun öğretmenleri; ders seçince dersin öğretmeni kendiliğinden gelir;
   - **"Gün"** — Pazartesi … Pazar;
   - **"Saat"** — **"Başlangıç saati"** – **"Bitiş saati"** (5 dakikalık adımlar) ve altında okulun ders saatleri çipleri
     ("1. ders · 08:30", "2. ders · 09:20" …): çipe basınca iki saat birden dolar.
   Saat kutuları o günün ilk boş ders saatiyle gelir; bütün ders saatleri doluysa son dersin bitişinden 10 dakika sonra başlayan 40
   dakikalık bir saatle. **"Vazgeç"** / **"Ekle"** → "Matematik · Pazartesi 08:30–09:10 saatine eklendi."
2. **Dersler listesinden seç, sonra boş saate bas:** listedeki bir derse bas (seçili olur, yeniden basınca bırakılır), sonra boş bir
   hücreye bas; ders oraya konur. Dersin haftalık saati dolunca seçim kendiliğinden kalkar. Seçim yokken boş hücreye basarsan: "Önce
   Dersler listesinden bir derse bas ya da günün yanındaki + ile ekle."
3. **Sürükle-bırak:** dersi listeden boş bir hücreye sürükle.

Değiştirmek, taşımak, kaldırmak:

- Dolu hücreye bas → pencere **"Matematik · 7-A"** aynı alanlarla dolu açılır: soldaki **"Kaldır"**, **"Vazgeç"**, **"Kaydet"**
  ("Matematik · Pazartesi 08:30–09:10 olarak kaydedildi.").
- **"Kaldır"** ayrı bir onay kutusu açar: **"Matematik bu saatten kaldırılsın mı?"**, altında "Ders silinmez; yalnız bu saat boşalır.",
  düğmeler **"Vazgeç"** / **"Kaldır"** → "Ders bu saatten kaldırıldı." (Kullanıcı 2 Ekim: bütün silmeler onaylı.)
- Taşımak için dolu hücreyi boş bir hücreye sürükle. Dolu hücreye bırakırsan: "Bu saat dolu; önce oradaki dersi kaldır ya da taşı."

Listeye yeni ders eklemek ("Ders ekle" düğmesi) → pencere **"Ders ekle · 7-A"**:

- **"Ders"** — okulun "Dersler ve branşlar" listesi ve en sonda **"Başka bir ders (adını yaz)…"** (seçince "Dersin adı (ör.
  Astronomi)" kutusu açılır; yeni ad okulun ders listesine de girer — [Okulun kendi branşı ve dersi](../siniflar-dersler/ozel-brans-ve-ders.md));
- **"Öğretmen"**, **"Haftalık saat"** (1–10, 2 gelir);
- **"Vazgeç"** / **"Ekle"**. Hatalar: "Dersin adını yaz.", "Haftalık saat 1 ile 10 arasında olmalı."
- Başarıda ders listeye eklenir ve seçili gelir: "Matematik eklendi (2 saat); şimdi boş bir saate bas ya da günün yanındaki + ile ekle."
  Ders listede zaten varsa saati eklenir ve öğretmeni güncellenir.

Pencerenin denetimleri: "Dersi seç.", "Başlangıç ve bitiş saatini yaz.", "Bitiş saati başlangıçtan sonra olmalı.", "Ders en az 10
dakika olmalı.", "Ders en çok 4 saat olabilir." ve çakışma (önizlemede çakışan yere ders konamaz: [Çakışma uyarısı](cakisma-uyarisi.md)).

**"Kaydet ve yayımla"** için [Programı yayımlama ve haber verme](yayimlama-ve-bildirim.md), **"Excel'den"** için
[Programı Excel'den kurma](excelden-program.md).

## Kurallar ve sınırlar

Bugünkü site:

- **Kim kurar:** müdür her zaman; öğretmen "Ders programını düzenler" yetkisiyle (sınıfla daraltılabilir). Bölüme yalnız müdür ve
  öğretmen girer; veli, öğrenci, servisçi ve sistem yöneticisi "Yetkin yok" alır. Yetki yoksa "Bu işlem için yetkin yok", kapsam
  dışı sınıfta "Bu ders ya da sınıf için yetkin yok".
- **Hangi sınıf:** yalnız kendi okulunun sınıfları; başkası "Sınıf bulunamadı".
- **Hangi ders:** yalnız o sınıfın dersleri: "Bu sınıfa ait bir ders seç". Sınıfa eklenebilecek dersler bugün sabit dokuz derslik
  listedir (Matematik, Türkçe, İngilizce, Din Kültürü ve Ahlak Bilgisi, Sosyal Bilgiler, Fen Bilimleri, Müzik, Resim, Beden Eğitimi).
- **Gün:** 1–7 (Pazartesi–Pazar); dışı "Geçersiz gün" (yalnız elle gönderilen istekte olur).
- **Saat:**
  - boş bırakılırsa pencerede "Başlangıç ve bitiş saatini gir.";
  - SS:DD olmalı: "Başlangıç saatini SS:DD biçiminde gir (ör. 09:20)", "Bitiş saatini SS:DD biçiminde gir (ör. 10:00)" (düzenlemede
    tek ileti: "Saatleri SS:DD biçiminde gir");
  - "Bitiş saati başlangıçtan sonra olmalı";
  - "Bir ders 8 saatten uzun olamaz";
  - en kısa süre için sınır yok.
- **Silinmiş kayıt:** düzenlenen ya da silinen ders saati yoksa "Ders saati bulunamadı".
- **Çakışma engellemez:** uyarır, kaydeder ([Çakışma uyarısı](cakisma-uyarisi.md)). Aynı sınıfa aynı saate aynı ders iki kez de
  yazılabilir; bu da çakışma listesine düşer.
- **Kaç ders saati:** sınıf başına sınır yok. Haftalık saat yalnız sayaçtır; aşınca etiket kırmızı olur, engel yok.
- **Eğitim yılı:** her kayıt o anki eğitim yılına damgalanır. Yıl seçiciden geçmiş bir yıla bakarken ekleme, değiştirme ve silme
  reddedilir: "Geçmiş bir eğitim yılına bakıyorsun; kayıtlar salt okunur. Değişiklik için üstteki yıl seçiciden aktif yıla dön." (ileti
  pencerenin altına ya da silmede uyarı kutusuna düşer). Ama program okunurken yıla bakılmaz: geçmiş yıla bakarken de bugünkü program
  görünür ([Geçmiş yıla bakma](../egitim-yili/gecmis-yil.md)).
- **Özellikler:** Ders programı okulun kapatabildiği bölümlerden değil ([Bölüm aç/kapat](../ozellikler/bolum-ac-kapat.md)).
- **İşlem kaydı:** elle ekleme, değiştirme ve silme okulun işlem kaydına yazılmaz; yalnız Excel'den toplu ekleme yazılır
  ([Neler kaydedilir](../islem-kaydi/neler-kaydedilir.md)).
- **Aynı anda iki kişi:** kilit yok; iki kişinin eklediği saatlerin ikisi de yazılır (kesişiyorsa sonra çakışma listesinde görünür).
- **Geri alma yok:** silinen ders saati geri gelmez; yeniden eklenir.
- **Ekran:** 520 pikselden dar ekranda gün gezgini alt alta, ders kartları tek sütun; haftalık tablo yana kayar.
- **Kayıt yeri:** her ders saati bir satır (okul, sınıf, ders, gün, başlangıç, bitiş, eğitim yılı). Sınıf ya da ders silinince satırları da
  silinir. Sistem yedeklerine girer.

Tasarımda (Tasarım 1 önizlemesi) değişenler:

- Bir ders saati en az **10 dakika**, en çok **4 saat** (bugün: en az yok, en çok 8 saat).
- Çakışan yere ders konamaz (bugün uyarır ve kaydeder).
- Dersin haftalık saati **1–10** (bugün Sınıflar penceresinde 0–20).
- Ders listesi okulun kendi listesidir; özel ders adı yazılabilir (bugün sabit dokuz ders).
- Kaldırma ayrı bir onay kutusuyla; program "Kaydet ve yayımla"ya kadar **"taslak"** görünür.
- Programda öğretmen dersten bağımsız seçilebilir (pencerede "Öğretmen" kutusu); bugün öğretmen yalnız derse bağlıdır.

## Kardeşler ve ilgili

**Kardeşler** (aynı klasör, [Ders programı](README.md)):

- [Gün ve hafta görünümü](gun-ve-hafta-gorunumu.md) — kurduğun programın nasıl çizildiği.
- [Okulun ders saatleri](ders-saatleri.md) — tasarımdaki "1. ders, 2. ders" satırları.
- [Çakışma uyarısı](cakisma-uyarisi.md) — kaydederken çıkan uyarı ve okulun çakışma listesi.
- [Programı Excel'den kurma](excelden-program.md) — bütün okulun programını dosyayla yüklemek.
- [Programı Excel olarak indirme](programi-indirme.md) — kurulan programı dosya olarak almak.
- [Programı yayımlama ve haber verme](yayimlama-ve-bildirim.md) — öğretmene giden bildirim, tasarımdaki "Kaydet ve yayımla".
- [Ders programım](programim.md) — öğretmenin, öğrencinin ve velinin gördüğü sonuç.

**İlgili:**

- [Sınıf açma](../siniflar-dersler/sinif-acma.md), [Sınıfa ders ve öğretmen atama](../siniflar-dersler/ders-atama.md),
  [Sınıfın sayfası](../siniflar-dersler/sinif-sayfasi.md), [Okulun kendi branşı ve dersi](../siniflar-dersler/ozel-brans-ve-ders.md).
- [Yetki listesi](../roller-yetkiler/yetki-listesi.md), [Hazır rol şablonları](../roller-yetkiler/hazir-sablonlar.md),
  [Ders ve sınıf daraltması](../roller-yetkiler/ders-ve-sinif-daraltmasi.md).
- [Geçmiş yıla bakma](../egitim-yili/gecmis-yil.md), [Yeni yıl sihirbazı](../egitim-yili/yeni-yil-sihirbazi.md) (programı geçen
  yıldan kopyalama).
- [Ders programından yoklama](../devamsizlik/programdan-yoklama.md), [Etüt: boş zaman ızgarası](../etut/bos-zaman-izgarasi.md).
- [Sol menü](../menu-ve-arama/sol-menu.md), [Ana sayfa kutucukları](../ana-sayfa/kutucuklar.md).

## Kod tarafı

- Ön yüz: [public/js/parcalar/21-ders-programi.md](../../public/js/parcalar/21-ders-programi.md) — `SAYFALAR.program` (sınıf yoksa
  boş ekran), `programCiz` (sınıf kutusu `#pSinif`, `S.programUyari`, çakışma kutusu, "Bu sınıfın dersleri"), `saatModal` (pencere:
  `#mGun`, `#mDers`, `#mBas` 09:00, `#mBit` 09:40, ileti yeri `#saatMesaj`).
- Düğmeler: [public/js/parcalar/25-tiklama.md](../../public/js/parcalar/25-tiklama.md) — `saat-ekle`, `saat-duzenle`, `saat-sil`
  (onay + `POST /api/school/schedule-delete`), `saat-kaydet` (`schedule-add` ya da `schedule-update`; uyarı metinleri), `sinif-program`.
- Sunucu: [sunucu/bolumler/okul.md](../../sunucu/bolumler/okul.md) — `GET /api/school/schedule?classId=` (önce kapsamsız, sonra sınıf
  kapsamıyla `program.duzenle`), `POST /api/school/schedule-add` (gün, saat biçimi, sıra, 8 saat, sınıfın dersi; `aralikCakismasi`;
  yıl damgası; öğretmene günde bir bildirim), `schedule-update`, `schedule-delete`.
- Yardımcılar: [sunucu/iliskiler.md](../../sunucu/iliskiler.md) — `GUN_ADLARI`, `saatDuzelt`, `saatDakika`, `aralikCakismasi`,
  `cakismalariBul`, `dersOzeti` (yerleşen saat).
- Depo ve tablo: [sunucu/veri/depo/siniflar.md](../../sunucu/veri/depo/siniflar.md) — `programEkle`, `programGuncelle`, `programSil`,
  `sinifinProgrami`; tablo `ders_programi` (gün 1–7, bitiş > başlangıç, en çok 8 saat; [SEMA.md](../../sunucu/veri/sema/SEMA.md)).
- Yetki: [sunucu/yetki.md](../../sunucu/yetki.md) — `program.duzenle` ("Ders ve program" grubu, sınıfla daraltılır), `sinif.yonet`.
  Geçmiş yıl kapısı: [sunucu/api.md](../../sunucu/api.md) (`arsivYazmasiMi`).
- Menü ve kutucuk: [06-menu.md](../../public/js/parcalar/06-menu.md), [08-ana-sayfa.md](../../public/js/parcalar/08-ana-sayfa.md);
  sınıf satırındaki düğme: [20-siniflar.md](../../public/js/parcalar/20-siniflar.md).
- Görünüm: `public/css/parcalar/14-ders-programi.css`.
- Testler: [testler/test-program.md](../../testler/test-program.md) (saat aralığıyla ekleme, doğrulama, düzenleme, silme, öğretmenin
  ekleyememesi), [testler/test-kapsam.md](../../testler/test-kapsam.md) (sınıfla daraltılmış rol).
- Kullanıcıya dönük anlatım: [belge/KILAVUZ.md](../../belge/KILAVUZ.md) ("Sınıflar ve ders programı").

## Sık sorulanlar

- **Menüde "Ders Programı" var ama "Bu işlem için yetkin yok" diyor.** Rolünde "Sınıf açar ve siler" de olmalı (bugünkü kodun bir
  eksiği). Müdürden bu yetkiyi iste ya da "Müdür Yardımcısı" şablonuyla rol aç.
- **"Ders" kutusunda istediğim ders yok.** Ders önce sınıfa eklenmeli: Sınıflar → sınıfın satırı → "Dersler".
- **Cumartesi ya da Pazar ders yazabilir miyim?** Evet; program Pazartesi'den Pazar'a.
- **Öğretmeni programdan değiştiremiyorum.** Öğretmen derse bağlı: Sınıflar → "Dersler" → öğretmen kutusu.
- **"3 / 4 saat" turuncu, ne demek?** Dersin haftalık 4 saatinden 3'ü programa yerleşmiş; bir saat eksik. Kırmızı: haftalık saatten
  fazlası yerleşmiş.
- **Bir sınıfın programını öbür şubeye kopyalayabilir miyim?** Ekranda kopyalama yok. Yol: Excel Aktarım → "Dışarı aktar" → "Ders
  programı" dosyasını indir, kopyalanacak satırların sınıf adını değiştir, dosyayı "İçeri aktar"dan yükle
  ([Programı Excel'den kurma](excelden-program.md)); zaten var olan satırlar "Atlandı" olur.
- **Yanlışlıkla sildim.** Geri alma yok; ders saatini yeniden ekle.
- **Geçmiş yılın programına bakıyorum, neden bugünkü görünüyor?** Program bugün yıla göre ayrılmıyor; geçmiş yılda yalnız değişiklik
  kapalı.

## Sırada

- Okulun ders saatleri ve ızgara ekranı (Tasarım 1): "1. ders" satırları, günün yanındaki "+", Dersler listesinden koyma ve sürükleme,
  "Kaydet ve yayımla".
- Çalışan olarak ekleme: öğretmen olmayan çalışan özel rolle programı kuracak, derse öğretmen olarak yazılamayacak.
- Özel branş ve ders: okul kendi derslerini açacak; programa konan ders adları bu listeden gelecek.
- Yıl geçişi: yeni yıl sihirbazında "ders programını geçen yıldan kopyala / sıfırdan başla"; programın yıla göre gösterilmesi.
- Özel roller: yeni hazır şablonlar ve yetki adları (öneri, onay bekliyor).
- Tam debug: menü ile sayfanın istediği yetkinin uyuşmaması ve daraltılmış rolde ilk sınıfta kilitlenme.
- Çok dil: ekran metinleri, gün adları ve kısaltmaları çeviri kataloğuna.
