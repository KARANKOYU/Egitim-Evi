# Başarılar · Başarı penceresi

**Durum:** Tasarlandı — henüz kodda yok

Bir başarı kartına ya da satırına tıklayınca açılan, belgenin büyük resmini ve bütün bilgilerini (ne zaman, kim verdi, kim
ekledi) gösteren pencere.

## Ne işe yarar

Kullanıcı 2 Ekim'de istedi: başarılarda belgenin resmi doğrudan görünsün, "tıklarsa detay: ne zaman verildi vb.". Kart
yalnız başlığı, resmi, kurumu ve tarihi gösterir; geri kalan her şey (o zamanki sınıf, açıklama, ekleyen, dosyanın kendisi)
bu pencerededir. Belgeyi ekleyen kurum silmeyi de buradan yapar.

## Nereden açılır

- **Öğrenci:** "Başarılarım" sayfasında bir karta tıkla ([Başarılarım ve Başarıları](basarilarim.md)).
- **Veli:** çocuğunun oturumunda "Başarıları" sayfasında bir karta tıkla.
- **Müdür ve yetkili:** [Başarılar sayfası](basarilar-sayfasi.md)'ndaki "Son eklenenler" listesinde bir satıra tıkla.

## Adım adım

### Öğrenci

1. Kartına tıkla. Ortada geniş bir pencere açılır; başlığında başarının adı yazar (ör. "İl matematik olimpiyatı — 3.lük"),
   sağ üstte kapatma (×) düğmesi.
2. Pencerenin üstünde **belgenin büyük resmi** (pencerenin genişliğinde, yuvarlak köşeli). Resme tıklarsan belge yeni
   sekmede tam boy açılır (üzerine gelince "Tam boy aç" ipucu).
3. Resmin altında bilgi listesi (solda soluk etiket, sağda değer; telefonda alt alta):

   | Etiket | Ne yazar | Örnek |
   |---|---|---|
   | "Verildiği tarih" | belgenin verildiği gün | "12 Mayıs 2026" |
   | "Veren kurum" | belgeyi veren kurumun adı | "İl Millî Eğitim Müdürlüğü" |
   | "O zamanki sınıfı" | belge eklenirken seçilen sınıf; yoksa "—" | "6-A" |
   | "Açıklama" | ekleyenin yazdığı açıklama; yoksa "—" | "İl genelindeki olimpiyatta il üçüncüsü." |
   | "Ekleyen" | belgeyi Eğitim Evi'ne ekleyen kişi (müdürse yanında "(müdür)"); başka kurumun eklediği belgede önizlemede kişinin adı yerine "önceki okulu" yazar; altında küçük yazıyla "Eğitim Evi'ne eklendi: <gün ay yıl saat>" | "Selim Kara (müdür)" / "Eğitim Evi'ne eklendi: 14 Mayıs 2026 09:12" |

4. En altta dosya satırı: belge simgesi, **"<dosya adı> · <boyut>"** (ör. "olimpiyat-belgesi.pdf · 412 KB") ve sağda
   **"İndir"**. "İndir" yüklenen dosyanın kendisini cihazına indirir.
5. Pencerenin altında **"Kapat"**; ya da sağ üstteki × ya da klavyede Esc ile kapat.

### Veli

Öğrenciyle aynı pencere ve aynı bilgiler; "İndir" ile çocuğunun belgesini cihazına alabilirsin. "Sil" düğmesi sende çıkmaz.

### Müdür

1. Başarılar sayfasında bir satıra tıkla; öğrencinin gördüğü pencerenin aynısı açılır.
2. Belgeyi **senin okulun eklediyse** pencerenin altında "Kapat"ın solunda **"Sil"** düğmesi de vardır →
   [Kalıcılık, düzeltme ve silme](kalicilik-ve-silme.md#müdür). Başka bir kurumun (ör. öğrencinin önceki okulunun) eklediği
   belgede "Sil" çıkmaz; yalnız bakarsın.

Önizleme notu: Tasarım 1'de "Sil" yalnız müdürün kendi eklediği belgede çıkıyor; aynı okuldan başka birinin (ör. yetkili
öğretmenin) eklediği belgede çıkmıyor. Tanım "kurum yalnız KENDİ eklediğini düzeltir/siler" der; kurum olarak okulun eklediği
her belgede çıkması gerekir.

### Çalışan ve yetkili öğretmen

"Başarı ekler" yetkisi olan rol sahibi ([yetki](basari-ekleme-yetkisi.md)) Başarılar sayfasından aynı pencereyi açar. Tanıma
göre silme "ekleyen okul (müdür ya da yetkili)" işidir; Tasarım 1 önizlemesinde "Sil" yalnız müdür hesabında çizildi.

### Öğretmen

Tanıma göre öğrencinin öğretmenleri bütün başarılarını görür ([Kimler görür](kimler-gorur.md#öğretmen)); pencereye hangi
ekrandan ulaşacağı önizlemede çizilmedi. "Portalına bakar" yetkisiyle öğrencinin portalındaki "Başarılarım"dan açabilir.

## Kurallar ve sınırlar

- **Resim:** PNG ve JPEG belgede yüklenen resim gösterilir. PDF belgede kartta ve pencerede belgenin görüntüsü durur, kartta
  ayrıca "PDF" etiketi olur. Tasarım 1 önizlemesinde PDF'in görüntüsü örnek bir resimle canlandırıldı (önizlemedeki "İndir"
  de PDF yerine bu örnek resmi indiriyor); PDF'ten görüntünün nasıl üretileceği tanımda yazılı değil.
- **Görüntüsü olmayan belge:** büyük resim yeri boş kalır, kartta belge simgesi görünür.
- **Boş alanlar:** "O zamanki sınıfı" ve "Açıklama" boşsa "—" yazar.
- **Boyut** KB cinsinden yazılır (ör. "137 KB").
- **"Sil" kimde:** yalnız belgeyi ekleyen kurumun müdürü ya da yetkilisi. Öğrenci, veli, öğretmen ve başka kurumlar görmez.
- **Düzeltme:** tanımda kurum kendi eklediğini düzeltebilir; önizlemedeki pencerede "Düzenle" düğmesi yok
  ([Kalıcılık, düzeltme ve silme](kalicilik-ve-silme.md)).
- **Silme onayı:** "Sil"e basınca pencere kapanmadan üstünde ayrı bir onay kutusu açılır; silme ancak orada onaylanınca olur.

## Kardeşler ve ilgili

**Kardeşler** (aynı klasör, [Başarılar](README.md)):

- [Başarılarım ve Başarıları](basarilarim.md) — kartların bulunduğu sayfa.
- [Başarılar sayfası](basarilar-sayfasi.md) — okul tarafındaki liste.
- [Kalıcılık, düzeltme ve silme](kalicilik-ve-silme.md) — "Sil" ve onay kutusu.
- [Başarı ekle](basari-ekleme.md) — penceredeki bilgilerin girildiği yer.
- [Kimler görür](kimler-gorur.md), ["Başarı ekler" yetkisi](basari-ekleme-yetkisi.md).

**İlgili:**

- [Mesaj ekleri](../mesaj/ekler.md) — eklerin aksine başarı belgesi 7 gün sonra silinmez.
- [Okulun dosya alanı](../okul-disk/doluluk.md) — belgenin kapladığı yer.

## Kod tarafı

Bugün kodda yok. Kodlanınca dayanacağı bugünkü parçalar:

- İndirme: ekler gibi biletle indirme düzeni — [sunucu/bolumler/ekler.md](../../sunucu/bolumler/ekler.md)
  (`GET /api/ek/bilet`), ön yüzde [public/js/parcalar/04d-ekler.md](../../public/js/parcalar/04d-ekler.md).
- Resmin güvenlik kapısı: [sunucu/yardimci/resim.md](../../sunucu/yardimci/resim.md) — bugün yalnız PNG, JPEG ve WebP
  tanıyor; PDF belge için ayrı tür denetimi gerekecek (belgede bu iş için not düşülmüş).

## Sık sorulanlar

- **Belgenin aslını nasıl alırım?** Penceredeki "İndir" ile; resme tıklayınca da yeni sekmede tam boy açılır.
- **"Ekleyen"de öğretmenimin adı değil müdürün adı yazıyor.** Belgeyi Eğitim Evi'ne kim eklediyse o yazar; belgeyi veren
  kurum "Veren kurum" satırındadır.
- **"O zamanki sınıfı" neden var?** Belge yıllarca hesabında kalır; o yılki sınıfın değişse de belgenin hangi sınıftayken
  verildiği görünsün diye.

## Sırada

- Başarılarım işi: pencere bu belgeye göre kodlanacak; PDF'in görüntüsünün nasıl gösterileceği ve düzeltme ekranı o işte
  belirlenecek.
- Çok dil: penceredeki etiketler ("Verildiği tarih", "Veren kurum", "O zamanki sınıfı", "Açıklama", "Ekleyen", "İndir")
  çeviri kataloğuna girecek.
