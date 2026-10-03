# Ödevler · Teslim metni (öğrencinin yazısı)

**Durum:** Tasarlandı — henüz kodda yok (yazı düzenleyici tanımında karara bağlandı; Tasarım 1 önizlemesinde de henüz yok).

Öğrencinin ödevi dosya yüklemek yerine (ya da dosyanın yanında) ortak yazı düzenleyicisiyle bir metin yazarak teslim etmesi.

## Ne işe yarar

Kullanıcı 30 Eylül'de "HTML editör yazı yazarken, ödev vb. — her feature ve detayları olacak" dedi; bunun üzerine yazı
düzenleyici tanımına düzenleyicinin bulunacağı **her uzun yazı alanı** tek tek yazıldı ve listede **"ödev teslim metni
(öğrenci)"** de var. 2 Ekim'de kullanıcı düzenleyicinin her yerde ve her rolde eksiksiz olmasını istedi ("dediğim şeylerin
eksikliği olmasın"); istek denetimi öğrencinin ödev penceresinde bu metin alanının henüz olmadığını eksik olarak işaretledi.
Android uygulaması tanımı da geri tuşu kuralında "ödev teslim notu"ndan söz eder.

Kısa bir kompozisyon, okuma özeti ya da "fotoğrafını yükledim, 3. soruyu anlamadım" gibi bir notu dosya hazırlamadan
teslim etmek için.

## Nereden açılır

Tasarlanan yer: öğrencinin [ödev penceresinde](odev-penceresi.md) teslim bölümü ([Teslim](teslim.md)). Alanın pencere
içindeki tam yeri, başlığı ve düğme adları tanımda yazmıyor; yapı belgesinde (her alanın ekran yeri ve karakter sınırı)
yazılacak.

## Adım adım

### Öğrenci (tasarım)

1. Ödevin penceresini aç; teslim bölümünde yazı alanını gör.
2. Metni ortak yazı düzenleyicisiyle yaz: araç çubuğunda geri al / yinele, başlık (H1 · H2 · H3), kalın, italik, altı çizili,
   üstü çizili, madde ve numaralı liste, hizalama ve girinti, fotoğraf ekle, bağlantı ekle, renkler. **HTML görünümü (</>)
   öğrencide yok** (kullanıcı 1 Ekim: "sadece öğrencide olmayıp diğer herkeste olacak") ([Araç çubuğu](../yazi-yazma/arac-cubugu.md)).
3. Altta karakter sayacı alanın sınırını gösterir ([Karakter sayacı](../yazi-yazma/karakter-sayaci.md)).
4. Kaydedip teslim edersin (düğmenin adı tanımda yazmıyor; düzenleyici tanımında "Gönder"/"Kaydet" düğmesi geniş).
5. Telefonda araç çubuğu tek satır olur, yana kayar ([Telefonda düzenleyici](../yazi-yazma/telefonda.md)).
6. Android uygulamasında yazdığın kaydedilmemiş metin varken geri tuşuna basarsan **"Yazdıkların silinsin mi?"** — **"Vazgeç"**
   / **"Sil ve çık"** sorulur ([Android geri tuşu](../uygulama/geri-tusu.md)).

### Öğretmen (tasarım)

Öğrencinin teslim metnini kontrol ekranında okuması beklenir; nerede ve nasıl gösterileceği (satırın altında mı, "N ek"
gibi bir düğmeyle mi) tanımda yazmıyor ([Teslimleri inceleme ve indirme](teslimleri-inceleme.md)).

### Veli

Velinin teslim metnini görüp görmeyeceği tanımda yazmıyor; bugün veli çocuğunun teslim **dosyalarını** görür.

## Kurallar ve sınırlar

Karara bağlananlar (yazı düzenleyici tanımı):

- Metin yalnız düzenleyicinin araç çubuğunun üretebildiği biçimleri taşır; sunucu her kayıtta izin listesi dışındaki her şeyi
  (etiket, nitelik, gizli/görünmez karakter, olay kodu) siler ya da düz metne çevirir ([İzinli ve izinsiz kod](../yazi-yazma/izinli-ve-izinsiz-kod.md)).
- Bağlantılar yalnız `https://` ile başlar ("Adres https:// ile başlamalı."), yeni sekmede açılır ([Bağlantı ekle](../yazi-yazma/baglanti-ekle.md)).
- Fotoğraf tarayıcıda küçültülür, konum ve meta veri silinir, ek olarak yüklenir ve okulun dosya alanına sayılır; yazıya en çok
  kaç fotoğraf girebileceği yapı belgesinde sınırlanacak ([Fotoğraf ekle](../yazi-yazma/fotograf-ekle.md)).
- Word / Google Docs'tan yapıştırılan biçim temizlenir ([Yapıştırma](../yazi-yazma/yapistirma.md)).
- Kullanıcının yazdığı içerikte emoji serbesttir (arayüzde emoji yok kuralı yalnız sitenin kendi metinleri için).
- Fotoğraf kişisel veri olabildiği için bu alan kodlanırken KVKK aydınlatma metni ve onay sürümü aynı işte güncellenir.

Tanımda henüz yazmayanlar (kodlanmadan önce karara bağlanmalı):

- Metnin teslim süresine ve öğretmenin "dosya yükleyebilsin" iznine bağlı olup olmadığı.
- Karakter sınırı ve fotoğraf sayısı.
- Metnin silinme süresi (teslim dosyaları gibi son teslim + 7 gün mü, ödevle birlikte mi).
- Teslim metni yazan öğrencinin "teslim etmiş" sayılıp sayılmadığı (ödev hatırlatma tanımında "teslim" = dosya yüklemek ya da
  quizi bitirmek; [Ödev hatırlatmaları](hatirlatmalar.md)).

## Kardeşler ve ilgili

**Kardeşler:** [Teslim](teslim.md) · [Dosya yükleme izni](dosya-yukleme-izni.md) · [Ödevin penceresi](odev-penceresi.md) ·
[Teslimleri inceleme ve indirme](teslimleri-inceleme.md) · [Ödev verme](odev-verme.md) (ödev açıklaması da aynı düzenleyiciyle).

**İlgili:** [Yazı düzenleyici](../yazi-yazma/README.md), [Nerelerde var](../yazi-yazma/nerelerde-var.md),
[HTML görünümü](../yazi-yazma/html-gorunumu.md), [Android geri tuşu](../uygulama/geri-tusu.md).

## Kod tarafı

Bugün kodda yok. Bugün öğrencinin ödev penceresinde yalnız teslim **dosyaları** bölümü var:
[public/js/parcalar/14b-odev-teslim.md](../../public/js/parcalar/14b-odev-teslim.md),
[sunucu/bolumler/odev-dosya.md](../../sunucu/bolumler/odev-dosya.md). Ödevin açıklaması da bugün düz metindir
([sunucu/bolumler/odev.md](../../sunucu/bolumler/odev.md): `clean(body.description, 1000)`). Kodlanınca bu bölüm ve Durum
satırı güncellenir.

## Sık sorulanlar

- **Bugün ödevime yazı yazarak teslim edebilir miyim?** Hayır; bugün yalnız dosya yüklenir (öğretmen izin verdiyse). Yazını bir
  belgeye ya da fotoğrafa koyup yükleyebilirsin.

## Sırada

- Düzenleyiciler (iş 15, onaylı): ortak yazı düzenleyicisi; listesinde ödev teslim metni (öğrenci) var.
- Yapı belgesi: alanın ekran yeri, karakter sınırı ve yukarıdaki açık noktalar.
