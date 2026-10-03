# Başarılar · Kalıcılık, düzeltme ve silme

**Durum:** Tasarlandı — henüz kodda yok

Başarı belgelerinin öğrencinin hesabında ne zamana kadar kaldığı (okul değişse, yıl geçse, okul kapansa da), kimin
düzeltip sildiği ve silmeden önce sorulan onay.

## Ne işe yarar

Kullanıcının 28 Eylül isteği: belgeler "öğrencinin hesabında durur". 29 Eylül 18:15 kararı: belge okulun portalına değil
KİŞİYE bağlanır; öğrenci kurumdan ayrılsa da, "son 1 yıl" kuralı ne derse desin kalır; kurum yalnız kendi eklediğini düzeltir
ve siler. 29 Eylül 20:35: okul silinirse belgeler kişide kalır, kartta kurumun adı durur. 2 Ekim: her silmede "silmek
istiyor musun" diye onay sorulsun. Böylece öğrencinin yıllar içinde topladığı belgeler okul değişikliklerinde kaybolmaz,
ama yanlış eklenen bir belgeyi ekleyen okul kaldırabilir.

## Nereden açılır

- **Silme:** [Başarı penceresi](basari-penceresi.md)'nin altında, "Kapat"ın solundaki **"Sil"**; yalnız belgeyi ekleyen
  kurumun müdürüne (ya da yetkilisine) görünür. Pencere [Başarılar sayfası](basarilar-sayfasi.md)'ndan açılır.
- **Düzeltme:** tanımda var, ekranı Tasarım 1 önizlemesinde çizilmedi (aşağıda).
- **Kalıcılık:** ekranı yok; yıl geçişinde, nakilde, mezuniyette ve okul silinince kendiliğinden uygulanır.

## Adım adım

### Müdür

**Silmek:**

1. "Başarılar" sayfasında belgenin satırına tıkla; [Başarı penceresi](basari-penceresi.md) açılır.
2. Belgeyi senin okulun eklediyse altta **"Sil"** düğmesi vardır; bas.
3. Açık pencere kapanmadan üstünde küçük bir onay kutusu açılır: solda uyarı simgesi, kalın başlık **"Bu başarı silinsin
   mi?"**, altında **"Belge öğrencinin hesabından kaldırılır."**; sağ altta **"Vazgeç"** ve kırmızı **"Sil"**. Odak
   "Vazgeç"te durur (Enter'a yanlışlıkla basarsan silinmez).
4. **"Sil"**e bas → pencere kapanır, liste yenilenir, ekranın altında **"Başarı silindi."** yazar. Belge öğrencinin
   "Başarılarım"ından ve velinin "Başarıları"ndan da kalkar.
5. Vazgeçmek için **"Vazgeç"**, klavyede Esc ya da kutunun dışına tıkla; belge yerinde kalır, başarı penceresi açık kalır.

**Düzeltmek:** tanıma göre okulun eklediği belgeyi okul düzeltebilir; hangi alanların düzeltileceği yazılı değil. Tasarım 1
önizlemesinde başarı penceresinde "Düzenle" düğmesi yok; bugünkü tasarımla yapılabilen: belgeyi sil (onaylı) ve doğrusunu
[Başarı ekle](basari-ekleme.md) ile yeniden ekle. Düzeltme ekranı Başarılarım işi kodlanırken belirlenecek.

### Çalışan ve yetkili öğretmen

Tanım: silme "ekleyen okul (müdür ya da yetkili)" işidir. "Başarı ekler" yetkin varsa okulunun eklediği belgeyi müdürle aynı
adımlarla silersin. Tasarım 1 önizlemesinde "Sil" yalnız müdür hesabında çizildi. Rolün "Sınıflar" kapsamı kendi sınıflarınla
sınırlıysa yetkin de o sınıflarla sınırlıdır (tanıma göre; ekranda belirlenmedi).

### Öğrenci

Belgelerin senin hesabında kalır; sayfanda silme ya da düzeltme düğmesi yok (tanımdaki öneri: öğrenci ve veli silemez).
Yanlış bir şey görürsen belgeyi ekleyen okula yaz ([Yeni mesaj](../mesaj/yeni-mesaj.md)).

### Veli

Öğrenciyle aynı: görür, indirir; silemez, düzeltemez.

## Kurallar ve sınırlar

**Kalıcılık** (belge kişiye bağlı):

1. **Yıl geçişinde silinmez.** Öğrenci ve veli eski yılları yalnız bir yıl görür; başarılar bu "son 1 geçmiş yıl" kuralının
   istisnasıdır ([Saklama süreleri](../kvkk-ve-gizlilik/saklama-sureleri.md), [Geçmiş yıla bakma](../egitim-yili/gecmis-yil.md)).
2. **Mezuniyet etkilemez.** Mezun olan öğrencinin okul portalı "Mezun" olur ama başarıları hesabında kalır; hiç aktif
   portalı kalmasa da "Başarılarım" ana ekranında durur ([Mezunlar](../egitim-yili/mezunlar.md)).
3. **Okul değişince öğrenciyle gider.** Nakilde ya da kurumdan ayrılınca belgeler yeni okulda da görünür; kartta veren
   kurumun adı yazar ([Öğrenci nakli](../hesaplar/ogrenci-nakli.md)).
4. **Okul silinirse belgeler kişide kalır;** kartta kurumun adı durur.
5. **Ekler gibi süreyle silinmez.** Mesaj ve ödev ekleri 7 gün sonra silinir; başarı belgesi silinmez
   ([Mesaj ekleri](../mesaj/ekler.md)).

**Düzeltme ve silme:**

- **Yalnız ekleyen kurum** düzeltir ve siler; başka kurumun eklediği belgede "Sil" görünmez. Öğrenci, veli ve öğrencinin
  öbür kurumları silemez.
- **Her silme onaylıdır** (kullanıcının 2 Ekim isteği; Tasarım 1'de bütün silmeler aynı onay kutusunu kullanır).
- **Geri alma yok:** silinen belge geri getirilmez; önizlemede silmeden sonra geri alma düğmesi yok (tanımda ayrıca
  yazılı değil).
- **Önizleme notu:** Tasarım 1'de "Sil" yalnız müdürün kendi eklediği belgede çıkıyor, aynı okuldan başka birinin
  eklediğinde çıkmıyor; tanıma göre okulun eklediği her belgede çıkmalı ([Başarı penceresi](basari-penceresi.md#müdür)).
- **Silmenin bildirimi:** silinince öğrenciye ya da veliye bildirim gidip gitmeyeceği tanımda yazılı değil.

## Kardeşler ve ilgili

**Kardeşler** (aynı klasör, [Başarılar](README.md)):

- [Başarı penceresi](basari-penceresi.md) — "Sil" düğmesinin yeri.
- [Başarı ekle](basari-ekleme.md) — silip yeniden ekleme.
- [Kimler görür](kimler-gorur.md) — görmek ve silmek ayrı haklar.
- [Başarılarım ve Başarıları](basarilarim.md), [Başarılar sayfası](basarilar-sayfasi.md),
  ["Başarı ekler" yetkisi](basari-ekleme-yetkisi.md).

**İlgili:**

- [Mezunlar](../egitim-yili/mezunlar.md), [Yeni yıl sihirbazı](../egitim-yili/yeni-yil-sihirbazi.md).
- [Öğrenci nakli](../hesaplar/ogrenci-nakli.md), [Öğrencide birden çok kurum](../portallar/ogrencide-portallar.md).
- [Saklama süreleri](../kvkk-ve-gizlilik/saklama-sureleri.md), [Verilerimi indir](../ayarlar/verilerimi-indir.md).

## Kod tarafı

Bugün kodda yok. Bugünkü kodda öğrenci hesabı zaten okula değil kişiye aittir ve nakilde hesap yeni okula taşınır
([sunucu/bolumler/nakil.md](../../sunucu/bolumler/nakil.md)); başarılar da bu kişiye bağlanacak. Eklerin 7 günlük silinmesi
[sunucu/bolumler/ekler.md](../../sunucu/bolumler/ekler.md)'de; başarı belgesi bu temizliğin dışında tutulmalı. Yeni tablolar
[sunucu/veri/sema/SEMA.md](../../sunucu/veri/sema/SEMA.md)'ye yeni bir şema dosyasıyla eklenir.

## Sık sorulanlar

- **Okul değiştirdim; eski okulum belgemi silebilir mi?** Tanıma göre düzeltme ve silme hakkı belgeyi ekleyen kurumdadır;
  sen ayrıldıktan sonra eski okulun belgeye hangi ekrandan ulaşacağı ayrıca yazılmadı. Yeni okulun o belgeyi silemez.
- **Mezun oldum, belgelerim duruyor mu?** Evet; "Başarılarım" ana ekranında kalır.
- **Yanlışlıkla sildim, geri gelir mi?** Hayır; belgeyi yeniden eklemek gerekir.
- **Silmeden önce neden soruyor?** Kullanıcı her silmede onay istedi; silinen belge geri gelmez.

## Sırada

- Başarılarım işi: kalıcılık, silme ve onay bu belgeye göre kodlanacak; düzeltme ekranı o işte belirlenecek.
- Yıl geçişi işi: yeni yıl sihirbazı ve mezuniyet başarılara dokunmayacak.
- Optimizasyon ve saklama süreleri işi: saklama tablosunda başarıların "son 1 geçmiş yıl" kuralının istisnası olduğu
  yazılmalı (öneri).
- Açık noktalar: öğrencinin hesabı silinince belgelerin ne olacağı ve silmede bildirim gidip gitmeyeceği tanımda yazılı değil.
