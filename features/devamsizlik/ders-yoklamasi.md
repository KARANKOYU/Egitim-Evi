# Devamsızlık ve yoklama · Ders yoklaması

**Durum:** Kodda var; tasarımda ek olarak ayrı "Yoklama" sayfası kalkar (kullanıcı 3 Ekim 19:20): öğretmen yoklamaya ders programından girer, ana sayfadaki "Yoklama" kutucuğu alınmamış ders sayısını gösterip o anki dersin yoklamasını açar; pencerede seçenekler "Geldi · Gelmedi (izinli) · Gelmedi (izinsiz)" olur, öğrenciler işaretsiz başlar ve herkes işaretlenmeden kaydedilmez, kayıttan sonra velilere giden bildirimler bir pencerede listelenir; müdürün menüsünden "Kendi derslerim → Yoklama" kalkar.

Öğretmenin "Yoklama" sayfasında dersini ve gününü seçip sınıfın her öğrencisini işaretleyerek kaydettiği ekran (bugünkü site); tasarımda
aynı iş ders programındaki pencereye taşınır.

## Ne işe yarar

Okulda yoklama her derste alınır; öğretmen kimin gelmediğini, kimin geç kaldığını, kimin izinli olduğunu yazar, veli de aynı gün
öğrenir (açılış sayfasındaki tanıtım: "Geldi, gelmedi, izinli; veli aynı gün öğrenir."). Kullanıcı bu bölümü projenin başında istedi
ve 29 Ağustos'ta velinin "kendi çocuklarının devamsızlık" kaydını görmesini ekledi.

Sistem yalnız **devamsızlıkları** saklar: "Geldi" diye bir kayıt tutulmaz, işaretlenmeyen öğrenci o derste sayılır. Böylece her ders,
her öğrenci, her gün için satır birikmez. Bu sayfa her güne ve her derse açıktır; dersin içinde, telefondan tek elle yoklama için ayrıca
[Ders programından yoklama](programdan-yoklama.md) penceresi var. İkisi aynı kaydı yazar.

Not: Eğitim Evi okulun günlük işini kolaylaştırır; devamsızlığın resmî kaydı e-Okul'dadır (Sık sorulanlar: "Eğitim Evi e-Okul'un
yerine geçer mi?").

## Nereden açılır

- **Öğretmen:** sol menüde **"Yoklama"** (yalnız "Yoklama alır" yetkin varsa; hazır Öğretmen rolünde açık gelir). Ana sayfada
  **"Yoklama — Derse katılım al"** kutucuğu (bu kutucuk yetkiye bakmaz, aşağıda). Adres `#/yoklama`.
- **Müdür:** sol menünün altında **"Kendi Derslerim"** başlığı → **"Yoklama"**.
- **Çalışan** (bugün öğretmen hesabı + ek rol, ör. Müdür Yardımcısı): öğretmen gibi menüdeki **"Yoklama"**.
- Okulda **"Devamsızlık"** bölümü kapalıysa bu satırlar menüden kalkar ([Kapalı bölüm](../ozellikler/kapali-bolum.md)).

Tasarımda (kullanıcı 3 Ekim 19:20, Tasarım 1 önizlemesi): öğretmenin menüsünde ayrı **"Yoklama"** satırı **yoktur**; yoklamaya
**"Ders programım"**dan girilir ([Ders programından yoklama](programdan-yoklama.md)). Ana sayfadaki **"Yoklama"** kutucuğu kalır: alt
yazısı **"2 dersin yoklaması alınmadı"** (kırmızı rozette sayı; hepsi alındıysa **"bu hafta hepsi alındı"**), basınca ders programı ve
**o anki dersin** yoklama penceresi açılır. **"Bugünkü derslerin"** kutusunda süren derste **"Yoklama al"**, alınmış derste **"Alındı"**
yazar; satıra basınca o dersin penceresi açılır. Eski `#/yoklama` adresi de ders programına döner. Müdürün menüsünden **"Kendi derslerim"** (Sınavlar,
Yoklama) kalkar.

## Adım adım

### Öğretmen (bugünkü site)

1. **"Yoklama"**yı aç. Başlık **"YOKLAMA"**, altında **"Ders seç, günü işaretle, kaydet."**
2. **"Ders seç"** kartında girdiğin her ders bir kutucuktur: üstte **"7-A · Matematik"**, altta **"28 öğrenci"**. Sıra sınıf adına,
   sonra derse göre. Hiç dersin yoksa yalnız şu kutu çıkar: **"Yoklama alabileceğin ders yok. Müdürün seni bir derse ataması
   gerekiyor."**
3. Bir kutucuğa bas. Kutucuk seçili görünür, altında önce **"Yükleniyor..."**, sonra yoklama kartı açılır: başlık **"7-A ·
   Matematik"**, sağda tarih kutusu. Kutucuğa basınca kart her zaman **bugünle** açılır (bugünü sunucu söyler, sunucunun saatiyle).
4. Başka bir günün yoklamasını almak ya da düzeltmek için tarih kutusundan günü seç; liste o günün kayıtlarıyla yeniden gelir.
5. İpucu satırı: **"Gelmeyenleri işaretle. İşaretlemediklerin derste sayılır."**, yanında **"Hepsi geldi"** düğmesi.
6. Sınıfın öğrencileri alt alta; her birinin yanında dört düğme: **"Geldi"**, **"Gelmedi"**, **"Geç geldi"**, **"İzinli"**. Seçili
   düğme renklenir: Geldi yeşil, Gelmedi kırmızı, Geç geldi turuncu, İzinli mavi. Başta herkes **"Geldi"** seçili gelir; o derse o
   gün daha önce "Gelmedi", "Geç geldi" ya da "İzinli" yazılmış öğrenci o durumla gelir.
7. Gelmeyenlere, geç kalanlara, izinlilere bas. Düğmeye basmak sayfayı yenilemez, yalnız o satırın seçimini değiştirir.
8. **"Hepsi geldi"** ekrandaki BÜTÜN öğrencileri "Geldi" yapar (daha önce işaretlediklerin de).
9. **"Yoklamayı kaydet"**e bas. Düğme istek bitene kadar basılamaz. Sonuç kartın altında yeşil yazar (6 saniye sonra kaybolur):
   - en az bir devamsızlık varsa **"3 devamsızlık kaydedildi."**
   - herkes "Geldi" ise **"Yoklama kaydedildi — herkes derste."**
   Hata olursa ileti kırmızı yazar ve kalır (aşağıda "Kurallar"). Seçilen dersin öğrenci listesi yüklenemezse yoklama kartının yerinde
   kırmızı hata iletisi çıkar (ör. **"Bu ders için yoklama yetkin yok"**); ders kutucuklarının listesi hiç yüklenemezse bütün sayfanın
   yerinde (ör. **"Yoklama yetkin yok"**).
10. Durumu bir önceki kayda göre değişen öğrenciye ve onaylı velilerine bildirim gider (["Gelmedi" bildirimi](devamsizlik-bildirimi.md)).

**Yanlış işareti düzeltmek:** aynı dersi aç, tarih kutusunda o günü seç, öğrencinin doğru durumuna bas, **"Yoklamayı kaydet"**. O
dersin o günkü kaydı baştan yazılır.

### Müdür (bugünkü site)

Adımlar öğretmeninkiyle aynı. Farkı: **"Ders seç"** kartında okulun **bütün dersleri** çıkar (müdür her derse yoklama alabilir);
büyük okulda uzun bir kutucuk ızgarası olur. Tek bir öğrencinin tek ders saatini düzeltmek için ayrıca
[Okulun devamsızlığı](okulun-devamsizligi.md) ekranı var.

### Çalışan (bugünkü site)

Bugün ek görevli kişi bir öğretmen hesabıdır; kendi derslerini öğretmen gibi görür. Müdür ona bir ek rolde **"Yoklama alır"**
yetkisini belirli **dersler ve sınıflar** seçerek verdiyse, o derslerin kutucukları da listeye girer ve onlara da yoklama alır. Seçim
yapılmadan (daraltmasız) verilen "Yoklama alır" başkasının dersini AÇMAZ ([Kim yoklama alır, kim kimi görür](yetki-ve-kapsam.md)).

### Tasarımda (kullanıcının 3 Ekim 19:20 kararı ve Tasarım 1 önizlemesi)

**Öğretmen**

Kullanıcının sözü: "Ders programım"da derse tıklayınca **o haftanın o dersinin yoklaması** açılır (geçmiş: görülür ve düzeltilir;
şimdiki: alınır; gelecek: "Bu dersin yoklaması … açılır"); **menüdeki ayrı "Yoklama" öğesi kalkar**; ana sayfadaki "Yoklama" kutucuğu
şu anki derse gider ve alınmamış ders sayısını gösterir.

1. Ana sayfada **"Yoklama — 2 dersin yoklaması alınmadı"** kutucuğuna (ya da **"Yoklama alınmadı"** bildirimine) bas. **"Ders
   programım"** açılır, üstünde o anki dersin **"Yoklama"** penceresi gelir. "Bugünkü derslerin"deki **"Yoklama al"** ise o dersin
   penceresini ana sayfanın üstünde açar.
2. Ya da doğrudan **"Ders programım"**ı aç ve tablodaki dersin hücresine bas; saati geçmiş ve yoklaması alınmamış hücre parlar ve
   **"!"** taşır.
3. Pencerede başlık **"7-A · Matematik · 3. ders"** / **"Perşembe, 1 Ekim (bugün) · 10:10–10:50"**, durum etiketi (**"Şu an"**,
   **"Alındı · 10:21"**, **"Alınmadı"**, **"Henüz açılmadı"**), **"Önceki ders"** / **"Sonraki ders"** geçişi.
4. Her öğrencide üç düğme: **"Geldi"**, **"Gelmedi (izinli)"**, **"Gelmedi (izinsiz)"**; alınmamış derste öğrenciler **işaretsiz**
   başlar. **"Hepsi geldi"** yalnız işaretsizleri doldurur.
5. Altta **"26 geldi · 1 gelmedi · 1 işaretlenmedi"**, **"Vazgeç"**, **"Kaydet"**. İşaretsiz öğrenci varken: **"1 öğrenci
   işaretlenmedi; önce herkesi işaretle."**
6. Kayıttan sonra **"Yoklama kaydedildi"** penceresi: sayılar, **"Velilere giden bildirimler (2)"** (her biri **"Veli · Elif Yılmaz"** ve
   metni) ya da **"Değişiklik yok; veliye yeni bildirim gitmedi."** / **"Herkes geldi; veliye bildirim gitmedi."**; **"Yoklamaya dön"**,
   **"Tamam"**.
7. Ana sayfa kutucuğunun sayısı, "Bugünkü derslerin" satırı, programdaki hücre ve "Yoklama alınmadı" bildirimi güncellenir
   ([Yoklama alınmadı uyarısı](yoklama-alinmadi-uyarisi.md)).

Pencerenin bütün ayrıntısı (gelecek ders, çakışan sınıflar, düzeltme bildirimleri, geçmiş günün metni):
[Ders programından yoklama](programdan-yoklama.md).

**Bugünkü sitedeki "Yoklama" sayfasının işleri tasarımda nereye gider:**

- **Ders seçmek** → ders programındaki hücre ya da penceredeki "Önceki ders / Sonraki ders".
- **Başka günün yoklamasını almak ya da düzeltmek** → öğretmen bu haftanın geçmiş derslerini ders programından açar ve düzeltir; önceki
  haftalara geçiş önizlemede yok (kararlaştırılmadı); müdür her günü [Okulun devamsızlığı](okulun-devamsizligi.md) ekranında düzeltir.
- **İleri tarih** → gelecek dersin penceresi yalnız **"Bu dersin yoklaması … açılır."** der.

Not: Tasarım 1'in 3 Ekim öğleden önceki hâlinde ayrı bir **"Yoklama"** sayfası vardı (bugünün dersleri çip çip: **"1. ders · 7-A ·
alındı"**, **"3. ders · 8-B · şu an"**, **"5. ders · 7-C · başlamadı (11:50)"**; yanında **"Görüşme başlat"** ve **"Gelmeyenlere Katıl
bildirimi"**). 3 Ekim 19:20 kararıyla bu sayfa kalktı; toplantı düğmelerinin yeni yeri kararlaştırılmadı
([Görüşme başlat ve gelmeyene haber](../toplanti/gorusme-baslat-ve-ping.md)).

**Müdür:** kullanıcı 2 Ekim'de "müdürün niye kendi derslerim var" dedi; tasarımda müdürün menüsünde **"Kendi derslerim"** başlığı
(Sınavlar, Yoklama) yok. Müdür yoklama almaz, yoklamaya ve düzeltmeye "Devamsızlık" sayfasından bakar.

**Çalışan:** tanımda (çalışan olarak ekleme) öğretmen rolü olmayan çalışan yoklamaya atanamaz. Önizlemenin rol şablonlarında
**"Nöbetçi öğretmen"** "Yoklama alır" yetkisini **bütün dersler ve sınıflar** için taşır (rol şablonları önerisi, onay bekliyor).
**Açık nokta:** ayrı "Yoklama" sayfası kalkınca, kendi dersi olmayan bir derse yoklama alma yetkisi verilmiş kişinin (nöbetçi, müdürün
ders/sınıf seçerek yetki verdiği öğretmen) o derse nereden gireceği kararlaştırılmadı; öğretmenin ders programı yalnız kendi derslerini
gösterir.

**Açık nokta (tasarımda):** öğretmenin penceresinde **"Geç"** seçeneği yok; oysa tasarımdaki dökümlerde "Geç · 10 dk" görünür ve
müdürün düzeltmesinde "Geç" ile dakika girilir. Geç kalmanın kim tarafından, hangi ekrandan (ve dakikasıyla) işaretleneceği
kararlaştırılmadı ([Günün durumu](gun-durumu.md) ilk derse geç kalmayı kullanır).

## Kurallar ve sınırlar

- **Kim alır:** öğretmen yalnız **kendi dersine** ya da müdürün ek rolde açıkça seçtiği ders/sınıfa; müdür her derse. Öğrenci, veli,
  servisçi alamaz. Ayrıntı: [Kim yoklama alır, kim kimi görür](yetki-ve-kapsam.md).
- **Yalnız devamsızlık saklanır.** "Geldi" kaydı yoktur; kaydı olmayan öğrenci derste sayılır. Hiç yoklama alınmamış ders de bu
  yüzden "Geldi" sayılır.
- **Kayıt ders + gün anahtarlıdır.** Aynı dersin aynı gündeki iki saati (blok ders) ayrı tutulmaz: ikinci saatin yoklaması birincinin
  üzerine yazar.
- **Kaydetme o dersin o günkü bütün kayıtlarını baştan yazar.** Ekranda olmayan (ör. sınıftan ayrılmış) öğrencinin o derste o günkü
  kaydı da silinir. Aynı yoklamayı iki kişi açıp kaydederse **sonra kaydeden kazanır**.
- **"Hepsi geldi" eski işaretleri de siler:** o gün önceden "Gelmedi" yazılmış öğrenciler de "Geldi" olur; kaydedince devamsızlıkları
  kalkar. (Etüt yoklamasındaki "Hepsi geldi" yalnız boşları doldurur; tasarımdaki ders yoklaması da öyle.)
- **İleri gün:** tarih kutusunda ileri bir gün seçilince liste açılır ama kaydetmek reddedilir: **"İleri tarihe yoklama alınamaz"**.
  Geçmiş günler için sınır yok (geçmiş eğitim yılı hariç).
- **Öğrencisiz sınıf:** liste boş kalır; **"Yoklamayı kaydet"** **"Yoklama boş"** der.
- **Bildirim yalnız durumu değişene gider;** aynı yoklamayı yeniden kaydetmek bildirim üretmez; "Gelmedi"den "Geldi"ye dönüşte bugün
  bildirim gitmez. Bu sayfa ders saatini göndermediği için bildirimde saat yazmaz ("bugün Matematik dersine gelmedi (izinsiz).").
- **Not:** sunucu her devamsızlığa en çok 200 harflik bir not kabul eder, ama bugün hiçbir ekran not yazdırmaz.
- **Eğitim yılı:** kayıt aktif yıla damgalanır. Üstteki yıl seçicisiyle geçmiş yıla bakarken kaydetmek reddedilir: **"Geçmiş bir eğitim
  yılına bakıyorsun; kayıtlar salt okunur. Değişiklik için üstteki yıl seçiciden aktif yıla dön."**
  ([Geçmiş yıla bakma](../egitim-yili/gecmis-yil.md)).
- **Bölüm kapalı:** sayfada **"Bu bölüm okulunda kapalı. Okul müdürü Özellikler sayfasından açabilir."**, sunucuda **"Devamsızlık bu
  okulda kapalı. Okul müdürü Özellikler sayfasından açabilir."** Kayıtlar silinmez, bölüm açılınca geri gelir.
- **Hata iletileri (aynen):** **"Yoklama yetkin yok"** (yetkisi olmayan sayfayı açınca), **"Ders bulunamadı"**, **"Bu ders için
  yoklama yetkin yok"**, **"İleri tarihe yoklama alınamaz"**, **"Yoklama boş"**.
- **Ana sayfa kutucuğu yetkiye bakmaz:** müdür Öğretmen rolünden "Yoklama alır"ı kapatırsa menüdeki "Yoklama" kalkar, ama ana
  sayfadaki "Yoklama" kutucuğu kalır; basan öğretmen **"Yoklama yetkin yok"** görür.
- **Seçili ders ve gün hatırlanır:** sayfadan çıkıp dönünce son seçtiğin ders, son baktığın günle açık gelir (dün bakmışsan dün); bir
  ders kutucuğuna yeniden basınca gün bugüne döner. Çıkışta ve portal değişince sıfırlanır.
- **İşlem kaydı:** ders yoklaması bugün işlem kaydına yazılmaz ([Neler kaydedilir](../islem-kaydi/neler-kaydedilir.md)).
- **Tasarımda:** ayrı "Yoklama" sayfası ve menü satırı yok; yoklama ders programındaki pencereden alınır; herkes işaretlenmeden
  kaydedilmez; bir dersin yoklaması dersin başlangıç saatinde açılır (gelecek ders açılmaz); bu haftanın geçmiş dersleri görülür ve
  düzeltilir; "Hepsi geldi" yalnız boşları doldurur. Kodlanınca yoklamanın **alındığı** ayrıca saklanmalıdır (bugün "herkes geldi" ile
  "hiç alınmadı" ayırt edilemez).

## Kardeşler ve ilgili

**Kardeşler** ([Devamsızlık ve yoklama](README.md)): [Ders programından yoklama](programdan-yoklama.md) (aynı kaydı yazan tek elle
pencere) · [Okulun devamsızlığı](okulun-devamsizligi.md) (tek ders saatini düzeltme) · ["Gelmedi" bildirimi](devamsizlik-bildirimi.md) ·
[Kim yoklama alır, kim kimi görür](yetki-ve-kapsam.md) · [Devamsızlığım](devamsizligim.md) (kaydın öğrenci ve velide görünmesi) ·
[Günün durumu](gun-durumu.md) · [Yoklama alınmadı uyarısı](yoklama-alinmadi-uyarisi.md).

**İlgili:** [Etüt yoklaması](../etut/etut-yoklamasi.md) (ayrı kayıt, ayrı kurallar) · [Servis yoklama sayfası](../servis/yoklama-sayfasi.md)
(servisçinin yoklaması, ayrı) · [Ders programım](../ders-programi/programim.md) · [Okulun ders saatleri](../ders-programi/ders-saatleri.md) ·
[Öğretmenin ana sayfası](../ana-sayfa/ogretmen-ana-sayfasi.md) · [Sol menü](../menu-ve-arama/sol-menu.md) ·
[Görüşme başlat ve gelmeyene haber](../toplanti/gorusme-baslat-ve-ping.md) · [Yetki listesi](../roller-yetkiler/yetki-listesi.md) ·
[Kapalı bölüm](../ozellikler/kapali-bolum.md) · [Geçmiş yıla bakma](../egitim-yili/gecmis-yil.md).

## Kod tarafı

- Ön yüz: [public/js/parcalar/18-devamsizlik.md](../../public/js/parcalar/18-devamsizlik.md) — `SAYFALAR.yoklama` (ders kutucukları,
  boş durum), `yoklamaCiz` (tarih kutusu, ipucu, dört düğme, "Yoklamayı kaydet"). Düğmelerin karşılığı
  [public/js/parcalar/25-tiklama.md](../../public/js/parcalar/25-tiklama.md): `yoklama-ders`, `yoklama-durum`, `yoklama-hepsi-var`,
  `yoklama-kaydet`. Menü ve kutucuk: [06-menu.md](../../public/js/parcalar/06-menu.md) (`devamsizlik.al` → "Yoklama"; müdürde
  "Kendi Derslerim"), [08-ana-sayfa.md](../../public/js/parcalar/08-ana-sayfa.md) ("Yoklama — Derse katılım al"). Çıkışta sıfırlama
  [26-baslat.md](../../public/js/parcalar/26-baslat.md).
- Sunucu: [sunucu/bolumler/devamsizlik.md](../../sunucu/bolumler/devamsizlik.md) — `GET /api/devamsizlik/derslerim`,
  `GET /api/devamsizlik/yoklama`, `POST /api/devamsizlik/yoklama`, `yoklamaYetkisi`, `DEVAM_DURUMLAR` / `DEVAM_AD`. Arşiv yılı kapısı
  [sunucu/api.md](../../sunucu/api.md), bölüm kapısı [sunucu/bolumler/ozellikler.md](../../sunucu/bolumler/ozellikler.md), yetkiler
  [sunucu/yetki.md](../../sunucu/yetki.md).
- Veri: [sunucu/veri/depo/devamsizlik.md](../../sunucu/veri/depo/devamsizlik.md) (`dersGunu`, `dersGunuYaz`; `devamsizlik` tablosu),
  [sunucu/veri/sema/SEMA.md](../../sunucu/veri/sema/SEMA.md).
- Görünüm: `public/css/parcalar/20-devamsizlik.css` (`.yoklama-satir`, `.durum-dugme`; [CSS.md](../../public/css/parcalar/CSS.md)).
- Testler: [testler/test-devamsizlik.md](../../testler/test-devamsizlik.md), [testler/test-bildirim.md](../../testler/test-bildirim.md),
  [testler/yetki-denetimi.md](../../testler/yetki-denetimi.md), [testler/buton-denetimi.md](../../testler/buton-denetimi.md).
- Tasarım: Tasarım 1 önizlemesinin öğretmen modülü (işaretsiz başlama, kayıt penceresi) ve 3 Ekim akşamı geri bildirim modülü (menüden
  "Yoklama"nın kalkması, `#/yoklama` adresinin ders programına dönmesi, kutucukta "N dersin yoklaması alınmadı").

## Sık sorulanlar

- **Yanlışlıkla "Gelmedi" yazdım, nasıl düzeltirim?** Aynı dersi aç, tarih kutusunda o günü seç, "Geldi"ye bas, kaydet. Bugün veliye
  düzeltme bildirimi gitmez; tasarımda ders programında o dersin hücresine basıp düzeltirsin, veliye "Yoklama düzeltildi: …" bildirimi
  gider.
- **Başka öğretmenin dersine (ör. nöbette) yoklama alabilir miyim?** Ancak müdür sana bir ek rolde "Yoklama alır" yetkisini o ders ya
  da sınıf seçilerek verdiyse. Müdür her derse alabilir.
- **Menümde "Yoklama" yok.** Bugünkü sitede: müdür Öğretmen rolünden "Yoklama alır"ı kapatmış ya da okulda "Devamsızlık" bölümü
  kapalı. Tasarımda menüde zaten yok: yoklamaya "Ders programım"dan ya da ana sayfadaki "Yoklama" kutucuğundan girilir.
- **Ders kutucuğum yok.** Henüz bir derse atanmadın; müdürün seni sınıfın dersine ataması gerekir
  ([Derse öğretmen atama](../siniflar-dersler/ders-atama.md)).
- **Yarının yoklamasını alabilir miyim?** Hayır: "İleri tarihe yoklama alınamaz".
- **"Yoklama boş" diyor.** Sınıfta hiç öğrenci yok; önce öğrenciler sınıfa yerleştirilmeli.

## Sırada

- **Yoklamaya ders programından girilir** (kullanıcı 3 Ekim 19:20; kod Linux'ta) — bu sayfanın ve menü satırının kalkması, ana sayfa
  kutucuğunun alınmamış ders sayısı ve o anki derse gitmesi.
- **Devamsızlık: tarih aralığı + "gün gün / ders ders" + süzgeç** (kullanıcı 2 Ekim; kod Linux'ta) — dökümler ve günün durumu
  değişir; yoklama kaydı ders + gün anahtarlı kalır ([Günün durumu](gun-durumu.md)).
- **Öğretmen ekranlarının tasarımı** (Tasarım 1): işaretsiz başlama, "Yoklama kaydedildi" penceresi, düzeltme bildirimleri.
- **Toplantılar + sınıfın uzaktan ders bağlantısı:** "Görüşme başlat", gelmeyene "Katıl" bildirimi; öneri olarak yoklamaya "Uzaktan
  katıldı" durumu.
- **Çalışan olarak ekleme:** öğretmen olmayan çalışan yoklamaya atanamaz.
- **Özel roller** (öneri): yeni şablonlar (Sınıf öğretmeni; Nöbetçi öğretmene "Yoklama alır").
- **Eklentiler** (kodlanmayacak, belgelenecek): kullanıcının örneği, öğrenci kartı okutulunca yoklamanın altında "Bugün kart okutuldu
  07:52" satırı ([Eklenti nedir](../eklentiler/eklenti-nedir.md)).
- **Android yerel uygulama:** öğretmen için Program + Yoklama aynı uçlarla ([Android uygulaması](../uygulama/android-uygulamasi.md)).
