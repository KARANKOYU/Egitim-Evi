# Ders programı · Gün ve hafta görünümü

**Durum:** Kodda var; tasarımda ek olarak öğrencide "Günlük | Haftalık" (Günlük ayrıntılı, Haftalık yalnız ders adı), tarihli gün düğmeleri, satırları okulun ders saatleri ("1. ders 08:30–09:10") olan tablolar ve öğretmende tek haftalık tablo.

Programın herkes için aynı iki biçimde çizilmesi: bir günü kart kart gösteren **Gün** görünümü ve bütün haftayı tek tabloda gösteren
**Hafta** görünümü.

## Ne işe yarar

"Bugün hangi ders, saat kaçta?" sorusunun cevabı Gün görünümündedir; haftanın bütününe bakmak için Hafta görünümü vardır. Müdürün
program kurduğu sayfa, öğretmenin "Ders Programım"ı ve öğrencinin/velinin "Ders Programı" aynı çizimi kullanır; yalnız kartların alt
satırı role göre değişir (öğretmenin adı ya da sınıfın adı) ve düzenleme düğmeleri yalnız programı kuranda çıkar.

Kullanıcının istekleri: öğretmen için "her gün ayrı sayfa, ekran büyükse uzatılsın"; haftalık da olsun, haftalıkta yalnız ders adı,
günlükte ayrıntılı (öğretmen adı, saat; öğretmende sınıf adı) (29 Ağustos); boş ders yerinde "[boş]" (26 Eylül); "1. ders, 2. ders"
diye ve bitiş saatiyle (1 Ekim).

## Nereden açılır

- **Müdür ve programı düzenleyen kişi:** "Ders Programı" sayfası ([Ders programı kurma](program-kurma.md)).
- **Öğretmen:** "Ders Programım"; **öğrenci:** "Ders Programı"; **veli:** çocuğun portalında "Ders Programı"
  ([Ders programım](programim.md)).

Her birinde programın üstünde iki düğmeli anahtar: **"Gün"** | **"Hafta"**. Seçtiğin görünüm bu tarayıcıda saklanır; sayfaya,
başka program sayfasına ya da ertesi gün siteye döndüğünde aynı görünüm açılır. Yeni gelen herkes Gün görünümüyle başlar.

## Adım adım

### Gün görünümü (bugünkü site)

- **Gün şeridi:** yedi küçük düğme — "Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"; her birinin altında o günün ders sayısı (dersi
  yoksa "–"). Seçili gün ana renkle dolu, dersi olan gün açık renkli, dersi olmayan günün sayısı soluk, bugün kesik çizgili
  çerçeveli.
- **Gezgin:** solda **"‹ önceki gün"**, sağda **"sonraki gün ›"** (Pazar'dan sonra Pazartesi'ye, Pazartesi'den önce Pazar'a döner);
  ortada günün adı ("Pazartesi") ve altında "5 ders · 08:30 – 13:10" ya da "ders yok", bugünse sonuna "· bugün".
- **Ders kartları** soldan sağa (ekran darsa alt alta). Her kartta:
  - üstte **"Ders 2"**; bugünün o an süren dersindeyse yanında **"şimdi"** etiketi ve kartın çerçevesi ana renkte;
  - saat aralığı "09:20 – 10:00";
  - dersin adı;
  - alt satır: müdürde ve öğrencide/velide öğretmenin adı (müdürde öğretmeni yoksa "öğretmen atanmadı"), öğretmende sınıfın adı;
  - çakışan derste kırmızı kart ve "Aynı saatte başka bir derse de yazılmış";
  - programı kuranda **"Düzenle"** ve **"Sil"**; öğretmende bugünkü derste yoklama düğmesi
    ([Ders programından yoklama](../devamsizlik/programdan-yoklama.md)).
- O gün dersi olmayan sıralarda **"Ders 4"** başlıklı **"[boş]"** kartı durur; gün tümden boşsa öğretmen, öğrenci ve velide tek kart
  "[boş] · Bu gün ders yok", programı kuranda yalnız **"+ Ders ekle"** kartı.
- **Hangi gün açılır:** seçtiğin gün; seçmediysen bugün; bugün ders yoksa haftanın dersi olan ilk günü (kimse boş bir ekranla
  karşılaşmasın). Seçtiğin gün başka program sayfalarına da taşınır (ör. "Ders Programım"da Çarşamba'yı seçtiysen müdürün sayfasında
  da Çarşamba açılır); Sınıflar sayfasındaki "Ders programı" düğmesi bugüne döndürür.

### Hafta görünümü (bugünkü site)

- Tablo: ilk sütun **"Gün"**, sonra **"Ders 1"**, **"Ders 2"** … (programı kuranda en sağda boş bir sütun daha).
- Her satır bir gün (Pazartesi … Pazar); bugünün satırı vurgulu ve adının yanında **"bugün"** etiketi.
- Hücrede saat, ders, alt satır (öğretmen ya da sınıf); programı kuranda "Düzenle" / "Sil". O sırada dersi olmayan hücre "[boş]";
  hiç dersi olmayan gün tek hücrede "[boş]". Aynı hücreye iki ders düştüyse ince bir çizgiyle alt alta; çakışan derslerin hücresi
  kırmızı.
- Programı kuranda her satırın sonunda **"+"** (o güne ders ekler).
- Dar ekranda tablo yana kayar.
- Bu görünümde "şimdi" vurgusu ve öğretmenin yoklama düğmesi yok.

### "Ders 1, Ders 2" nasıl numaralanır (bugünkü site)

Bugün okulun tanımlı ders saatleri yok; numaralar haftanın bütün saatlerinden çıkar. Haftadaki bütün ders aralıkları sıralanır,
birbirini kesenler tek bir "sıra"da birleşir, her sıra bir numara alır. Böylece zil saatleri günden güne biraz farklı olsa da (ör. Cuma
kısa gün) aynı ders aynı sütunda durur. Örnek:

```
Pazartesi 08:30-09:10, 09:20-10:00 · Cuma 08:30-09:05, 09:15-09:50
sıra 1 = 08:30-09:10 (Pzt ve Cum'un ilk dersleri)   sıra 2 = 09:15-10:00
Salı yalnız 09:20'de dersi varsa: "Ders 1 [boş]", "Ders 2 Matematik"
```

Bitişik saatler (10:00'da biten ve 10:00'da başlayan) ayrı sıradır.

### Öğrenci

**"Ders Programı"** → "Gün" ya da "Hafta". Kartların alt satırında dersin öğretmeni. Çakışma işareti yoktur; sınıfının aynı saatte iki
dersi varsa ikisi aynı "Ders N" başlığıyla yan yana durur.

Tasarımda (Tasarım 1 önizlemesi):

- Üstte **"Günlük"** | **"Haftalık"** çipleri ve yanında soluk not "ders 40 dk · teneffüs 10 dk".
- **Günlük:** yedi gün düğmesi, her birinde gün kısaltması ve tarihi ("Pzt 28", "Sal 29" …); bugün işaretli, hafta sonu soluk. Altında
  **"Perşembe, 1 Ekim · bugün"** başlıklı kutu (sağında sınıf "7-A"). Her satır: **"1. ders"**, dersin tam adı ("Fen Bilimleri", "Din
  Kültürü ve Ahlak Bilgisi"), altında "08:30–09:10 · Ayşe Kaya"; o an süren derste **"Şu an"** rozeti ve vurgu; boş saat "[boş]";
  dersi olmayan günde "Bu gün ders yok."
- **Haftalık:** **"Haftalık program"** kutusu (sağında "7-A · 28 Eylül – 4 Ekim"); satırlar "1. ders 08:30–09:10" …, sütunlar
  Pazartesi … Pazar (dar ekranda "Pzt" …); hücrede **yalnız dersin adı**, boşsa "[boş]"; bugünün sütunu ve o an süren ders vurgulu;
  hafta sonu dersi yoksa o sütunlar boyunca "ders yok".

### Veli

Çocuğun portalında **"Ders Programı"**; öğrencinin gördüğünün aynısı (kartlarda öğretmen adı), sayfanın üstünde "<çocuğun adı> adına
görüntülüyorsun." Tasarımda velide her çocuk ayrı oturumdur ([Velide çocuk oturumları](../portallar/velide-cocuk-oturumlari.md)).
Tasarım 1 önizlemesinde velinin menüsünde ve çocuk oturumlarında "Ders programı" sayfası yok; velinin programı öğrencininkiyle aynı
Günlük/Haftalık biçimde mi göreceği kararlaştırılmadı (kullanıcıya sorulacak; bugün veli görür).

### Öğretmen

**"Ders Programım"** → "Gün" ya da "Hafta". Kartların alt satırında sınıfın adı; bugünkü derslerde Gün görünümünde yoklama düğmesi.
Kendi derslerin aynı saate düştüyse kart kırmızı.

Tasarımda (Tasarım 1 önizlemesi): Gün/Hafta anahtarı yok; tek **"Haftalık program"** tablosu ("ders 40 dk · teneffüs 10 dk"): satırlar
"1. ders 08:30–09:10" …, sütunlar günler, bugünün sütununda "bugün". Hücrede o saatte girdiğin sınıf(lar) ("7-A", çakışmada "8-B · 7-C"
ve "!"), altında küçük yazı: başka günlerde ve bugünün henüz başlamamış dersinde "Matematik", süren derste **"şimdi · yoklama al"**,
bugünün geçmiş dersinde **"yoklama al"** ya da **"yoklama alındı"**; boş saat "[boş]". Hücreye basınca bugünün süren ya da geçmiş
dersinde yoklama penceresi, başka günün ya da bugünün başlamamış dersinde ders penceresi açılır ([Ders programım](programim.md)).

### Müdür ve programı kuran çalışan

"Ders Programı" sayfasında aynı iki görünüm, düzenleme düğmeleriyle ([Ders programı kurma](program-kurma.md)). Ders veren müdür
kendi derslerini "Ders Programım" sayfasında öğretmen gibi görür; ama müdürün menüsünde bu satır yok, sayfaya yalnız bildirimden ya da
`#/programim` adresinden gelinir ([Ders programım](programim.md)).

Tasarımda müdürün sayfası Gün/Hafta anahtarı olmayan bir ızgaradır (satırlar okulun ders saatleri, sütunlar Pazartesi–Pazar;
[Ders programı kurma](program-kurma.md)). Sınıf sayfasının "Ders programı" sekmesinde ve eğitim yılının geçmiş yıl özetinde aynı tablo
salt okunur: "7-C haftalık program", Pazartesi–Pazar, boş saatte "[boş]" (geçmiş yılda başlığın yanında "yalnız okunur").

## Kurallar ve sınırlar

- **"Bugün" ve "şimdi" cihazın saatine göredir.** Program saatleri Türkiye saatidir; başka saat diliminde ya da saati yanlış cihazda
  vurgu kayar.
- **"Ders N" gerçek ders numarası değildir** (bugünkü site). Bir gün uzun bir ders (ör. 80 dakikalık blok) öbür günlerin iki sırasını
  kesiyorsa o iki sıra birleşir; o günlerde iki ders aynı "Ders N" altında yan yana durur. Yalnız bir günde olan bir sıra öbür günlerde
  "[boş]" görünür. Tasarımda numaralar okulun ders saatlerinden gelir ([Okulun ders saatleri](ders-saatleri.md)).
- **Hafta görünümünde** "şimdi" vurgusu ve yoklama düğmesi yok.
- **Her gün ve görünüm değişimi sayfayı sunucudan yeniden ister;** büyük okulda müdürün sayfasında gün değiştirmek biraz sürebilir
  (her seferinde okulun bütün çakışmaları da hesaplanır).
- **Görünüm tercihi** yalnız o tarayıcıda saklanır; gizli pencerede ya da başka cihazda Gün ile başlar. Sunucuya gitmez.
- **Ekran:** 520 pikselden darda gezgin alt alta, kartlar tek sütun; haftalık tablo yana kayar.
- **Gün adları:** Pazartesi, Salı, Çarşamba, Perşembe, Cuma, Cumartesi, Pazar; kısaltmalar Pzt, Sal, Çar, Per, Cum, Cmt, Paz.

## Kardeşler ve ilgili

**Kardeşler** (aynı klasör, [Ders programı](README.md)):

- [Ders programı kurma](program-kurma.md) — düzenlenebilir görünüm.
- [Ders programım](programim.md) — öğretmen, öğrenci ve veli sayfaları.
- [Okulun ders saatleri](ders-saatleri.md) — tasarımdaki "1. ders" satırları.
- [Çakışma uyarısı](cakisma-uyarisi.md) — kırmızı kartlar.
- [Programı Excel olarak indirme](programi-indirme.md), [Programı Excel'den kurma](excelden-program.md),
  [Programı yayımlama ve haber verme](yayimlama-ve-bildirim.md).

**İlgili:**

- [Ders programından yoklama](../devamsizlik/programdan-yoklama.md) — Gün görünümündeki yoklama düğmesi.
- [Sınıfın sayfası](../siniflar-dersler/sinif-sayfasi.md), [Geçmiş yıla bakma](../egitim-yili/gecmis-yil.md).
- [Öğrencinin ana sayfası](../ana-sayfa/ogrenci-ana-sayfasi.md), [Öğretmenin ana sayfası](../ana-sayfa/ogretmen-ana-sayfasi.md)
  (tasarımdaki "Bugünkü dersler").
- [Tahta: sınıf seçme](../tahta/sinif-secme.md) — tahtanın gördüğü "Bugünkü dersler".

## Kod tarafı

- Ön yüz: [public/js/parcalar/21-ders-programi.md](../../public/js/parcalar/21-ders-programi.md) — `gorunumSecici`, `programGovdesi`,
  `gunlukGorunum`, `haftalikGorunum`, `gunSeridi`, `dersSutunu` ("şimdi", çakışma), `dersSiralari` / `siralaraYerlestir` (ders sıraları),
  `BOS_DERS`, `GUN_KISA`, `bugunNo`.
- Düğmeler: [public/js/parcalar/25-tiklama.md](../../public/js/parcalar/25-tiklama.md) — `program-gun`, `program-gorunum`
  (`localStorage` anahtarı `ee_program_gorunum`); açılışta tercih geri okunur.
- Durum: [public/js/parcalar/00-durum.md](../../public/js/parcalar/00-durum.md) — `S.programGun`, `S.programGorunum`.
- Kullanan sayfa: [public/js/parcalar/22-programim.md](../../public/js/parcalar/22-programim.md) (alt satır ve yoklama düğmesi).
- Gün adları sunucudan gelir: [sunucu/iliskiler.md](../../sunucu/iliskiler.md) (`GUN_ADLARI`, `GUN_SAYISI` = 7).
- Görünüm: `public/css/parcalar/14-ders-programi.css` (anahtar, gün şeridi, gezgin, kartlar, `.simdi`, `.cakisma`, `.bos-saat`,
  haftalık tablo; 520 piksel kırılımı).
- Testler: bu çizimin tarayıcıda çalışan testi yok; `testler/buton-denetimi.js` eylemlerin karşılığını denetler
  ([testler/buton-denetimi.md](../../testler/buton-denetimi.md)).

## Sık sorulanlar

- **Hafta görünümünde kaldım, neden hep o açılıyor?** Tercih tarayıcıda saklanır; "Gün"e bas, o da saklanır.
- **Neden "Ders 3" yazıyor ama okulumuzda o 4. ders?** Bugün numaralar haftanın saatlerinden hesaplanıyor, okulun zil numarası değil.
  Tasarımda okulun ders saatleri gelecek.
- **"şimdi" yanlış derste.** Cihazının saatini ve saat dilimini denetle.
- **Telefonda kartlar alt alta.** Dar ekranda böyle; Hafta görünümünde tablo yana kayar.

## Sırada

- Okulun ders saatleri: "1. ders 08:30–09:10" satırları, "Şu an" vurgusu (Tasarım 1).
- Öğrencide Günlük (ayrıntılı) | Haftalık (yalnız ders adı) ayrımı (velide de olup olmayacağı sorulacak); öğretmende tek haftalık
  tablo, hücreden yoklama.
- Android yerel uygulama: öğrencide haftalık program (bugün vurgulu), öğretmende program + yoklama (salt okunur, düzenleme yok).
- Çok dil: gün adları ve kısaltmaları çeviri kataloğuna.
