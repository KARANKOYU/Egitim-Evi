# Başarılar

Öğrencinin aldığı teşekkür, takdir, onur belgeleri ve yarışma dereceleri, belgenin fotoğrafı ya da dosyasıyla (PNG, JPEG,
PDF) öğrencinin hesabında durur. Belgeyi okul ekler: müdür (ya da "Başarı ekler" yetkisi verilen rol sahibi) "Başarılar"
sayfasından "Başarı ekle" ile sınıfı ve öğrenciyi seçer, başlığı yazar ya da hazır başlıklardan birini seçer, veren kurumu,
verildiği tarihi, isteğe bağlı açıklamayı girer ve belgeyi yükler; öğrenciye ve velisine bildirim gider. Öğrenci menüdeki
"Başarılarım"da, veli çocuğunun oturumundaki "Başarıları"nda belgeleri kart kart görür: üstte başlık, altında belgenin
resmi; karta tıklayınca büyük resim, verildiği tarih, veren kurum, o zamanki sınıfı, açıklama, ekleyen ve "İndir". Belge
okulun portalına değil öğrencinin kendisine bağlıdır: yıl geçişinde, mezuniyette, nakilde, okul kapansa da kalır;
öğrencinin öğretmenleri ve müdürü hangi kurumdan olursa olsun hepsini görür; yalnız belgeyi ekleyen kurum düzeltir ya da
siler, her silme onay ister. Bütün klasör tasarım aşamasında: bugünkü sitede bu bölüm yok; kaynaklar kullanıcının 28 Eylül
isteği ve 29 Eylül kararları (Başarılarım tanımı), 2 Ekim geri bildirimi ve Tasarım 1 önizlemesi.

## Alt özellikler

| Belge | Ne anlatır | Durum |
|---|---|---|
| [Başarılarım ve Başarıları](basarilarim.md) | Öğrencinin ve velinin sayfası, menüdeki yeri, kartın düzeni, bilgi notu | Tasarlandı — henüz kodda yok |
| [Başarı penceresi](basari-penceresi.md) | Karta tıklayınca açılan ayrıntı: büyük resim, verildiği tarih, veren kurum, o zamanki sınıfı, açıklama, ekleyen, "İndir", "Sil" | Tasarlandı — henüz kodda yok |
| [Başarı ekle](basari-ekleme.md) | Ekleme penceresi: alanlar, hazır başlıklar, belge türleri, hata iletileri, bildirim; toplu ekleme önerisi | Tasarlandı — henüz kodda yok |
| [Başarılar sayfası](basarilar-sayfasi.md) | Okul tarafındaki liste: sınıf düğmeleri, "Son eklenenler", "Başarı ekle" | Tasarlandı — henüz kodda yok |
| ["Başarı ekler" yetkisi](basari-ekleme-yetkisi.md) | Müdürün yetkiyi role vermesi, kapsam, içinde bu yetki olan hazır şablonlar | Tasarlandı — henüz kodda yok |
| [Kimler görür](kimler-gorur.md) | Öğrenci, veli, öğretmen, müdür, yetkili; kurumlar arası istisna; eklentiler, KVKK | Tasarlandı — henüz kodda yok |
| [Kalıcılık, düzeltme ve silme](kalicilik-ve-silme.md) | Kişiye bağlılık, yıl geçişi, mezuniyet, nakil, okul silinmesi; silme onayı; düzeltme | Tasarlandı — henüz kodda yok |

Okuma sırası: önce [Başarılarım ve Başarıları](basarilarim.md) ve [Başarı penceresi](basari-penceresi.md) (belgenin
öğrencide nasıl göründüğü); okul tarafı için [Başarılar sayfası](basarilar-sayfasi.md), [Başarı ekle](basari-ekleme.md) ve
["Başarı ekler" yetkisi](basari-ekleme-yetkisi.md); kurallar için [Kimler görür](kimler-gorur.md) ve
[Kalıcılık, düzeltme ve silme](kalicilik-ve-silme.md).

## Rol tablosu

Hücre: o rolün bu alt özellikte yaptığı (bağlantı ilgili belgenin o rolün bölümüne gider). "—": bu rol kullanmaz.

| Alt özellik | Öğrenci | Veli | Öğretmen | Çalışan | Müdür | Servisçi | Yönetici | Ziyaretçi |
|---|---|---|---|---|---|---|---|---|
| Başarılarım ve Başarıları | [kendi belgelerini kart kart görür](basarilarim.md#öğrenci) | [çocuğunun oturumunda "Başarıları"nı görür](basarilarim.md#veli) | ["Portalına bakar" yetkisiyle öğrencinin portalında görür](basarilarim.md#öğretmen-ve-çalışan) | ["Portalına bakar" yetkisiyle görür](basarilarim.md#öğretmen-ve-çalışan) | [öğrencinin portalını açıp görür](basarilarim.md#müdür) | — | — | — |
| Başarı penceresi | [açar, "İndir"](basari-penceresi.md#öğrenci) | [açar, "İndir"](basari-penceresi.md#veli) | [tanıma göre görür; yeri çizilmedi](basari-penceresi.md#öğretmen) | [yetkiliyse açar; okulunun eklediğini siler](basari-penceresi.md#çalışan-ve-yetkili-öğretmen) | [açar; okulunun eklediğinde "Sil"](basari-penceresi.md#müdür) | — | — | — |
| Başarı ekle | — | — | ["Başarı ekler" rolü varsa ekler](basari-ekleme.md#çalışan-ve-yetkili-öğretmen) | [rolünde yetki varsa ekler](basari-ekleme.md#çalışan-ve-yetkili-öğretmen) | [her zaman ekler](basari-ekleme.md#müdür) | — | — | — |
| Başarılar sayfası | — | — | [yetkili rolüyle kullanır](basarilar-sayfasi.md#çalışan-ve-yetkili-öğretmen) | [yetkili rolüyle kullanır](basarilar-sayfasi.md#çalışan-ve-yetkili-öğretmen) | [sınıf sınıf görür, ekler](basarilar-sayfasi.md#müdür) | — | — | — |
| "Başarı ekler" yetkisi | — | — | [rolle alır](basari-ekleme-yetkisi.md#çalışan-ve-yetkili-öğretmen) | [rolle alır](basari-ekleme-yetkisi.md#çalışan-ve-yetkili-öğretmen) | [role koyar, kaldırır](basari-ekleme-yetkisi.md#müdür) | — | — | — |
| Kimler görür | [kendi bütün belgelerini](kimler-gorur.md#öğrenci) | [çocuğunun bütün belgelerini](kimler-gorur.md#veli) | [öğrencisinin bütün belgelerini, öbür kurumlarınki dahil](kimler-gorur.md#öğretmen) | [yetkiliyse kapsamındakileri (açık nokta)](kimler-gorur.md#çalışan) | [okulunun öğrencilerinin bütün belgelerini](kimler-gorur.md#müdür) | — (görmez) | — (tanımda yok) | — (görmez) |
| Kalıcılık, düzeltme ve silme | [belgeleri hesabında kalır; silemez](kalicilik-ve-silme.md#öğrenci) | [silemez, düzeltemez](kalicilik-ve-silme.md#veli) | [yetkili rolüyle okulunun eklediğini siler](kalicilik-ve-silme.md#çalışan-ve-yetkili-öğretmen) | [yetkiliyse okulunun eklediğini siler](kalicilik-ve-silme.md#çalışan-ve-yetkili-öğretmen) | [okulunun eklediğini düzeltir, siler (onaylı)](kalicilik-ve-silme.md#müdür) | — | — | — |

Öğretmen ve çalışan sütunları: tasarımda (çalışan tanımı) öğretmen de okula "çalışan" olarak eklenir ve müdürün verdiği
Öğretmen rolüyle çalışır; "Başarı ekler" ve "Portalına bakar" yetkileri özel rolle gelir (hazır şablonlardan "Müdür
yardımcısı", "Rehber öğretmen", "Sınıf öğretmeni"). Rolsüz çalışan başarıları görmez. Tasarım 1'de eğitmen ve tahta
hesaplarının (tasarımdaki roller) ekranlarında bu bölüm yok; yönetici ve desteğin görüp görmeyeceği tanımda yazılı değil.

Rol kapıları: [Öğrenci](../roller/ogrenci.md) · [Veli](../roller/veli.md) · [Öğretmen](../roller/ogretmen.md) ·
[Çalışan](../roller/calisan.md) · [Müdür](../roller/mudur.md) · [Servisçi](../roller/servisci.md) ·
[Yönetici](../roller/yonetici.md) · [Ziyaretçi](../roller/ziyaretci.md). Bütün özellikler: [features/](../README.md).

## Açık noktalar

Kodlamadan önce kullanıcıya sorulacak ya da tasarımda netleşecekler:

- Başarılarım önerisinin bütünü için "tamam mı" sorusu kullanıcıya soruldu, cevap bekleniyor. Kullanıcı
  ayrıntıların bir kısmına karar verdi (kişiye bağlılık, "kurum görsün", kartın görünümü, silme onayı); "Başarı ekler"
  yetkisi, öğrenci ve velinin silememesi ve toplu ekleme öneri olarak duruyor.
- "Başarı ekler" yetkisinin rolün sınıf kapsamına nasıl uyacağı: tanım "Sınıf öğretmeni kendi sınıfı kapsamında" der,
  Tasarım 1 kapsamı bu yetkinin yanında göstermiyor ([yetki](basari-ekleme-yetkisi.md)).
- Önizlemede "Sil" yalnız müdürün kendi eklediği belgede çıkıyor; tanıma göre okulun eklediği her belgede çıkmalı.
- Öğrenci ya da veli okul dışı belgesini kendisi ekleyebilsin mi (kartta "veli ekledi" etiketiyle)? — kullanıcıya soruldu,
  cevap yok.
- Toplu ekleme (birden çok dosya, dosya adı öğrenci numarasıysa kendiliğinden eşleşme) — öneri; önizlemede yalnız not olarak
  geçiyor.
- Düzeltme ekranı — tanımda var, önizlemede çizilmedi.
- Öğretmenin belgelere bakacağı yer; yetkili çalışanın "Başarılar" sayfasında hangi öğrencileri göreceği.
- Boyut sınırı, PDF'in görüntüsünün nasıl üretileceği, boş sayfa metni, öğrenci hesabı silinince belgelerin ne olacağı.
- KILAVUZ yanlışı: [belge/KILAVUZ.md](../../belge/KILAVUZ.md)'nin "Veli tarafı" bölümü çocuğun portalında "başarılar"
  olduğunu söylüyor; bugünkü sitede böyle bir sayfa yok.

## İlgili öbür klasörler

- [Portallar](../portallar/README.md) — velide her çocuk ayrı oturum; öğrencide birden çok kurum (belgeler kişiye bağlı).
- [Roller ve yetkiler](../roller-yetkiler/README.md) — "Başarı ekler" yetkisi, kapsam, hazır şablonlar.
- [Öğretmenler ve çalışanlar](../ogretmenler-calisanlar/README.md) — çalışana görev (rol) verme.
- [Öğrenci hesapları](../hesaplar/README.md) — öğrencinin hesap penceresindeki "Başarı ekle", portalını açma, nakil.
- [Eğitim yılı ve yıl geçişi](../egitim-yili/README.md) — yıl geçişi ve mezuniyet başarılara dokunmaz.
- [Bildirimler](../bildirim/README.md) — belge eklenince öğrenciye ve velisine giden bildirim.
- [Yazı düzenleyici](../yazi-yazma/README.md) — "Açıklama" alanı.
- [Dosya alanı ve küçültme](../okul-disk/README.md) — telefonda küçültme, disk sınırı.
- [Mesajlar ve duyurular](../mesaj/README.md) — eklerin 7 günlük silinmesi (başarı belgesine uygulanmaz).
- [KVKK ve gizlilik](../kvkk-ve-gizlilik/README.md) — saklama süreleri, kim neyi görür, aydınlatma metni.
- [Hesap ayarları](../ayarlar/README.md) — Verilerimi indir.
- [Eklentiler](../eklentiler/README.md) — kişiye bağlı bölümler okul eklentilerine kapalı.
- [Menü, üst şerit ve arama](../menu-ve-arama/README.md) — "Başarılarım", "Başarıları", "Başarılar" satırları.
- [Dil ve çeviri](../dil/README.md) — "Başarılarım" → "My achievements".
- [İlerleyiş](../ilerleyis/README.md) — öğrencinin öbür kendi sayfası.

## Kod belgeleri

Bugün kodda yok. Kodlanınca dokunacağı bugünkü kod belgeleri (menü, öğrenci-veli, müdür, hesaplar, roller, ekler ve
küçültme belgeleri ile şema belgesi bu işi "Başarılarım" diye planlı işler arasında anıyor):

- Sunucu: [sunucu/yetki.md](../../sunucu/yetki.md) (yeni yetki `basari.ekle`), [sunucu/bolumler/ekler.md](../../sunucu/bolumler/ekler.md)
  (yükleme, biletle indirme), [sunucu/bolumler/okul-disk.md](../../sunucu/bolumler/okul-disk.md) (disk sınırı),
  [sunucu/yardimci/resim.md](../../sunucu/yardimci/resim.md) (tür ve meta veri; PDF için ek denetim),
  [sunucu/bolumler/nakil.md](../../sunucu/bolumler/nakil.md) (kişiye bağlı hesap), [sunucu/veri/depo/genel.md](../../sunucu/veri/depo/genel.md)
  (bildirim ve veliye kopya), [sunucu/veri/sema/SEMA.md](../../sunucu/veri/sema/SEMA.md) (yeni tablolar).
- Ön yüz: [public/js/parcalar/06-menu.md](../../public/js/parcalar/06-menu.md), [public/js/parcalar/13-ogrenci-veli.md](../../public/js/parcalar/13-ogrenci-veli.md),
  [public/js/parcalar/10-mudur.md](../../public/js/parcalar/10-mudur.md), [public/js/parcalar/10b-hesaplar.md](../../public/js/parcalar/10b-hesaplar.md),
  [public/js/parcalar/19f-roller.md](../../public/js/parcalar/19f-roller.md), [public/js/parcalar/04d-ekler.md](../../public/js/parcalar/04d-ekler.md),
  [public/js/parcalar/04f-resim-kucult.md](../../public/js/parcalar/04f-resim-kucult.md).
- Testler: [testler/yetki-denetimi.md](../../testler/yetki-denetimi.md) (yeni yetki ve görme kuralı buraya eklenecek).
- Kullanıcıya dönük anlatım: [belge/KILAVUZ.md](../../belge/KILAVUZ.md) (bölüm kodlanınca eklenecek).
