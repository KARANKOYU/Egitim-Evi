# Dil ve çeviri · Dil ekleme ve .po dışa/içe aktarma

**Durum:** Tasarlandı — henüz kodda yok

Çeviri paneline "Dil ekle" ile yeni bir dil sütunu açmak ve bir dilin kataloğunu .po dosyası olarak indirip Poedit gibi bir
programda çevirdikten sonra geri yüklemek.

## Ne işe yarar

Kullanıcının 29 Eylül sözü: "gui ile .po çevirisi … biz + diyerek oluyor hepsi". Yani yeni bir dil bir düğmeyle eklenir, kod
değişmez. Kullanıcı Korece gibi dilleri de sordu ("korece vb desteklesin mi yoksa gerek yok mu dersin"); cevap: altyapı her dili
destekler, ihtiyaç olursa çevirmen o dili ekleyip çevirir ([Hazır diller ve İngilizce ön çeviri](hazir-diller-ve-on-ceviri.md)).
.po, çeviri programlarının ortak dosya biçimidir: her satırda kaynak metin (bizde Türkçe) ve çevirisi durur; böylece panele
girmeden, alışık olduğu programla çalışan bir çevirmen de katkı verebilir.

## Nereden açılır

- **"Dil ekle":** [Çeviri paneli](ceviri-paneli.md)'nde dil kartlarının en sonundaki kesik çizgili **"Dil ekle"** kartı (artı simgeli).
  Tanımdaki adı "+ Dil ekle".
- **.po dışa / içe aktarma:** tanıma göre çeviri panelinde; düğmelerin adı ve yeri Tasarım 1'de çizilmedi.

## Adım adım

### Yönetici

**Dil ekleme:**

1. Çeviri panelinde **"Dil ekle"**ye bas. Pencere açılır, başlığı **"Dil ekle"**.
2. Üstte not: **"Her dil kendi adıyla. Eklenen dil dil seçicide %0 ile görünür; çevrildikçe oranı artar."**
3. Altında diller, her biri kod rozeti ve kendi adıyla. Tasarım 1'deki liste: **RU** Русский, **UK** Українська, **FA** فارسی
   ("sağdan sola" notlu), **FR** Français, **ES** Español, **KO** 한국어, **AZ** Azərbaycan dili, **KU** Kurdî, **IT** Italiano,
   **NL** Nederlands. Zaten ekli olan dilin yanında **"ekli"** yazar ve basılamaz. Pencerenin altında **"Kapat"**.
4. Bir dile bas. Pencere kapanır, tabloya o dilin sütunu eklenir, dil kartları arasına %0 ile girer, ileti çıkar:
   **"Русский eklendi; dil seçicide %0 ile görünür."** İmleç yeni sütunun ilk hücresine gider; hemen çevirmeye başlayabilirsin.
5. Sayfa başlığının altındaki sayı da artar ("· 4 dil").
6. Eklenen dil [Dil seçici](dil-secici.md)'de kendi adıyla ve "%0 çevrildi" ile görünür; sağdan sola bir dilse "· sağdan sola"
   notuyla.

Tanıma göre seçilecek liste bütün ISO dil listesidir (her dil kendi adıyla); önizlemedeki on dil yalnız örnektir.

**.po ile çeviri (tanıma göre):**

1. Bir dilin kataloğunu .po dosyası olarak indir (dışa aktar). Dosyada her Türkçe metin ve o dildeki karşılığı (boşsa boş) durur.
2. Dosyayı Poedit gibi bir çeviri programında aç, çevir, kaydet.
3. Dosyayı panele geri yükle (içe aktar): çeviriler kataloğa yazılır, oranlar güncellenir.
4. Yüklenen her çeviri panelde elle yazılanla aynı denetimden geçer: düz metin (HTML etiketi, bağlantı, telefon numarası yok) ve
   yer tutucular eksiksiz.

### Çevirmen

1. Kendisine verilen dil(ler)in .po dosyasını indirir, çevirir, geri yükler; tanıma göre çevirmen yalnız kendisine verilen dilleri
   düzenler, içe aktarma da yalnız o dillere yazabilir.
2. Yeni dil: tanımın Korece cevabı "ihtiyaç olursa çevirmen ekler" diyor; yani çevirmen de yeni dil ekleyebilmeli. Ama çevirmen
   yalnız kendisine verilen dilleri düzenler; eklediği dilin kendisine kendiliğinden verilip verilmeyeceği yazmıyor. Tasarım 1'de
   paneli ve "Dil ekle"yi yalnız yönetici açıyor.

### Destek

Bu işte tanımda bir yeri yok. Çevirmen rolü de taşıyan bir destek ekibi üyesi çevirmen gibi çalışır ([Çevirmen rolü](cevirmen-rolu.md)).

## Kurallar ve sınırlar

- **Dil kodu:** ISO 639-1 (iki harf: ru, uk, fa, ko…); dil seçicide bu kod büyük harfle görünür (İngilizce Tasarım 1'de "ENG").
- **Ad:** her dil panelde ve seçicide kendi adıyla (Русский, 한국어), Türkçe adıyla değil.
- **Yön:** sağdan sola diller (Farsça, Arapça, İbranice) eklenirken işaretlenir ([Sağdan sola diller](sagdan-sola.md)).
- **Yeni dil %0 başlar** ve hemen seçicide görünür; tanımdaki kurala göre oranı eşiğin altındaki dil "(yarım)" rozetiyle listelenir,
  eksik metinler Türkçe görünür.
- **Çoğul biçimleri:** her dilin kendi çoğul kuralı var (İngilizcede iki, Arapçada altı biçim); tanım bunu basit bir sayı kuralıyla
  çözüyor. .po dosyası da çoğul biçimlerini ayrı satırlarda taşır.
- **Denetimler içe aktarmada da geçerli:** düz metin kuralı, yer tutucu denetimi, korunan metinlere (güvenlik e-postaları, hukuki
  metinler) yalnız yöneticinin yazabilmesi.
- **Okul eklentisinin eklediği dil** yalnız o okulda görünür; site kataloğuna (/panel/translate) karışmaz ([Eklenti sınırları](../eklentiler/sinirlar.md)).
- **Tanımda yazmayanlar:** .po düğmelerinin adı ve yeri; içe aktarılan dosyadaki bir çeviri panelde o arada değişmiş bir hücreyle
  çakışırsa hangisinin kalacağı; denetimden geçmeyen satırların nasıl gösterileceği; bir dilin listeden kaldırılması (ne "Dil kaldır"
  ne "gizle" tanımlı).

## Kardeşler ve ilgili

**Kardeşler** (aynı klasör, [Dil ve çeviri](README.md)):

- [Çeviri paneli](ceviri-paneli.md) — dilin eklendiği ve çevrildiği yer.
- [Hazır diller ve İngilizce ön çeviri](hazir-diller-ve-on-ceviri.md) — hangi dillerin baştan geldiği, Korece sorusunun cevabı.
- [Çevirmen rolü](cevirmen-rolu.md) — kimin hangi dili çevirdiği.
- [Dil seçici](dil-secici.md), [Sağdan sola diller](sagdan-sola.md).

**İlgili:**

- [Eklenti nedir](../eklentiler/eklenti-nedir.md), [Eklenti sınırları](../eklentiler/sinirlar.md) — okulun kendi dil eklentisi.
- [Paneller](../yonetim/paneller.md).

## Kod tarafı

Bugün kodda yok. Kodlanınca: katalog tabloları şemaya ([sunucu/veri/sema/SEMA.md](../../sunucu/veri/sema/SEMA.md)); panel kapısı
[sunucu/yonetim-cerezi.md](../../sunucu/yonetim-cerezi.md) yapısının yerine gelecek `/panel` kapısı. Projenin tek npm bağımlılığı
`pg` olduğu için .po okuyup yazmak da öbür dosya biçimleri gibi (Excel okuyucuları: [sunucu/yardimci/xlsx.md](../../sunucu/yardimci/xlsx.md))
kendi kodumuzla yapılır. Tasarım 1 önizlemesinde "Dil ekle" listesi `PNL_CV_EKLENEBILIR`, eylem `dil-ekle`.

## Sık sorulanlar

- **Korece de olacak mı?** Altyapı her dili destekler; Korece hazır gelmez, ihtiyaç olursa çevirmen ekler ve çevirir.
- **Bir dil ekleyince hemen herkes görür mü?** Evet, dil seçicide %0 ile; çevrildikçe oranı artar, çevrilmemiş yazılar Türkçe kalır.
- **Panel yerine kendi çeviri programımı kullanabilir miyim?** Tanıma göre evet: .po dosyasını indirip programında çevirir, geri
  yüklersin.

## Sırada

- Çok dil işi (22): "+ Dil ekle" ve .po dışa/içe aktarma çeviri paneliyle birlikte.
- Kodlanmadan önce netleşecekler: .po düğmeleri, çakışma kuralı, hatalı satırların gösterimi, dil kaldırma, çevirmenin eklediği
  dilin ona kendiliğinden verilip verilmeyeceği.
