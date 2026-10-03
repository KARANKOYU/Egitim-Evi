# Başarılar · Kimler görür

**Durum:** Tasarlandı — henüz kodda yok

Bir öğrencinin başarı belgelerini kimlerin, nerede ve ne kadarını gördüğü; görmekle düzeltmek arasındaki fark.

## Ne işe yarar

Başarı belgesi öğrencinin adını, sınıfını ve belgenin fotoğrafını taşır; kişisel veridir. Bu yüzden kimin göreceği kesin
olmalı. Kullanıcı 29 Eylül akşamı (20:35) kararını verdi: "kurum görsün, sıkıntı yok". Öğrencinin öğretmenleri ve müdürü,
hangi kurumdan olursa olsun, öğrencinin **bütün** başarılarını görür; öbür kurumun eklediği belge ve o kurumun adı dahil.
Düzeltip silmek ise yalnız belgeyi ekleyen kurumun işidir.

## Nereden açılır

Ayrı bir ekranı yok; kural şu ekranlarda uygulanır: öğrencinin "Başarılarım"ı ve velinin "Başarıları"
([Başarılarım ve Başarıları](basarilarim.md)), okulun [Başarılar sayfası](basarilar-sayfasi.md), [Başarı penceresi](basari-penceresi.md)
ve öğrencinin portalı ("Portalını aç").

| Kim | Neyi görür | Nerede |
|---|---|---|
| Öğrenci | kendi bütün başarılarını, her kurumun eklediğini | "Başarılarım" |
| Veli (çocuğuna bağlı) | o çocuğun bütün başarılarını | çocuğun oturumunda "Başarıları" |
| Öğrencinin öğretmenleri | öğrencinin bütün başarılarını, öbür kurumların eklediği dahil | yeri önizlemede çizilmedi; "Portalına bakar" yetkisiyle öğrencinin portalında |
| Öğrencinin müdürü | okulunun öğrencilerinin bütün başarılarını, öbür kurumların eklediği dahil | "Başarılar" sayfası; öğrencinin portalı |
| "Başarı ekler" yetkili rol sahibi | kapsamındaki öğrencilerin belgelerini (bkz. aşağıda açık nokta) | "Başarılar" sayfası |
| Başka öğrenciler, başka veliler, servisçi, ziyaretçi | hiçbirini | — |
| Okulun kurduğu eklentiler | hiçbirini (kişiye bağlı bölümler okul eklentilerine kapalı) | — |

## Adım adım

### Öğrenci

"Başarılarım"da senin bütün belgelerin var: şu anki okulunun, önceki okulunun, dershanenin eklediği hepsi. Her kartta veren
kurumun adı yazar. Bilgi notu bunu hatırlatır: "Okulun ve öğretmenlerin görebilir."

### Veli

Çocuğunun oturumunda "Başarıları"nda o çocuğun bütün belgelerini görürsün. Her çocuk ayrı oturum olduğu için bir çocuğun
sayfasında öbürününkiler görünmez. Çocuğuna bağlı her veli (anne ve baba ayrı hesaplarla) aynı belgeleri görür.

### Öğretmen

Öğrencinin öğretmeniysen onun bütün başarılarını görebilirsin; öğrenci senin okulunda değil başka bir kurumda aldığı bir
belgeyi de taşıyorsa o da görünür, kartta o kurumun adıyla. Tasarım 1 önizlemesinde öğretmenin bu belgelere bakacağı ayrı
bir ekran çizilmedi; rolünde "Portalına bakar" varsa öğrencinin portalını açıp "Başarılarım"a girersin. Görmen düzeltebileceğin
anlamına gelmez.

### Müdür

"Başarılar" sayfasında okulunun öğrencilerinin bütün belgelerini sınıf sınıf görürsün; öğrencinin önceki okulundan gelen
belgeler de listededir. Yalnız okulunun eklediği belgede "Sil" çıkar.

### Çalışan

"Başarı ekler" yetkili rolün varsa "Başarılar" sayfasına girersin. Tanım, yetkilinin bu sayfada hangi öğrencilerin
belgelerini göreceğini ayrıca yazmıyor; sayfa müdürünkiyle aynı tasarlandığı için kapsamındaki öğrencilerin belgelerini
göreceği varsayıldı (kodlanmadan önce netleşmeli). Rolsüz çalışan başarıları görmez.

## Kurallar ve sınırlar

- **Kurumlar arası istisna:** Eğitim Evi'nde kurumlar normalde birbirinin kayıtlarını görmez (okul, öğrencinin dershanedeki
  ödevlerini görmez). Başarılar bunun istisnasıdır: belge kişiye bağlıdır ve öğrencinin bütün kurumlarındaki öğretmen ve
  müdürler hepsini görür ([Öğrencide birden çok kurum](../portallar/ogrencide-portallar.md)).
- **Görmek ≠ düzeltmek:** herkes görse de yalnız belgeyi ekleyen kurum düzeltir ya da siler
  ([Kalıcılık, düzeltme ve silme](kalicilik-ve-silme.md)).
- **Zaman sınırı yok:** "son 1 geçmiş yıl" kuralı başarılara uygulanmaz; eski belgeler de görünür.
- **Bildirim:** yeni belge eklenince öğrenciye bildirim gider, kopyası velilerine
  ([Öğrencinin bildirimi veliye de](../bildirim/velinin-bildirimleri.md)).
- **Eklentiler:** okulun kurduğu eklentiler kişiye bağlı bölümlere (Başarılarım, eğitim içerikleri, hatırlatıcılar)
  erişemez ([Eklenti sınırları](../eklentiler/sinirlar.md)).
- **Verilerimi indir:** öğrencinin indirdiği dosyaya saklanan her şey girer (kullanıcının 29 Eylül kararı); başarı belgeleri
  de ([Verilerimi indir](../ayarlar/verilerimi-indir.md)).
- **KVKK:** bölüm kodlanırken kim neyi görür tablosu ve aydınlatma metni güncellenir
  ([Kim neyi görür](../kvkk-ve-gizlilik/kim-neyi-gorur.md), [Aydınlatma metni](../kvkk-ve-gizlilik/aydinlatma-metni.md)).
- **Yönetici ve destek:** tanımda başarıları görüp görmeyecekleri yazılı değil.

## Kardeşler ve ilgili

**Kardeşler** (aynı klasör, [Başarılar](README.md)):

- [Başarılarım ve Başarıları](basarilarim.md), [Başarılar sayfası](basarilar-sayfasi.md), [Başarı penceresi](basari-penceresi.md)
  — kuralın uygulandığı ekranlar.
- [Kalıcılık, düzeltme ve silme](kalicilik-ve-silme.md) — kimin düzeltip sildiği.
- [Başarı ekle](basari-ekleme.md), ["Başarı ekler" yetkisi](basari-ekleme-yetkisi.md).

**İlgili:**

- [Kim neyi görür](../kvkk-ve-gizlilik/kim-neyi-gorur.md), [Saklama süreleri](../kvkk-ve-gizlilik/saklama-sureleri.md).
- [Velide her çocuk ayrı oturum](../portallar/velide-cocuk-oturumlari.md),
  [Öğrencinin portalını açma](../hesaplar/ogrenci-portalini-acma.md).

## Kod tarafı

Bugün kodda yok. Kodlanınca görme denetimi sunucuda yapılır: öğrencinin kendisi, bağlı velisi, öğrencinin öğretmenleri ve
müdürü. Bugünkü yetki ve ilişki yapısı: [sunucu/yetki.md](../../sunucu/yetki.md), [sunucu/iliskiler.md](../../sunucu/iliskiler.md);
veliye bildirim kopyası [sunucu/veri/depo/genel.md](../../sunucu/veri/depo/genel.md).

## Sık sorulanlar

- **Yeni okulum önceki okulumun verdiği belgeyi görecek mi?** Evet; kullanıcının kararı bu ("kurum görsün"). Kartta önceki
  okulun adı yazar.
- **Sınıf arkadaşım başarılarımı görebilir mi?** Hayır.
- **Okul sayfasında herkese açık görünür mü?** Hayır; tanımda böyle bir yer yok.
- **Öğretmenim belgemi silebilir mi?** Yalnız belgeyi ekleyen okulun müdürü ya da yetkilisi silebilir; öğretmenin rolünde
  bu yetki varsa ve belgeyi onun okulu eklediyse evet.

## Sırada

- Başarılarım işi: görme kuralı sunucuda bu belgeye göre kodlanacak.
- Açık noktalar: yetkili çalışanın "Başarılar" sayfasında hangi öğrencileri göreceği; öğretmenin belgelere bakacağı ekran;
  öğrenci bir kurumdan ayrılınca o kurumun öğretmenlerinin görmeye devam edip etmeyeceği (tanım "öğrencinin öğretmenleri"
  diyor); yönetici ve desteğin görüp görmeyeceği.
- KVKK ve onay metinleri tam denetimi işinde başarı belgeleri satırı.
