# Bildirimler · Birden çok kurumda kurum adı

**Durum:** Tasarlandı — henüz kodda yok

Aynı kişinin birden çok kurumda portalı varsa (ör. hem okulda hem dershanede öğrenci) bildirimin başında hangi kurumdan geldiği
yazar; zil bütün kurumlarının bildirimlerini bir arada gösterir.

## Ne işe yarar

Öğrenci okuluna ve dershanesine aynı Eğitim Evi hesabıyla gidebilecek; iki kurumun ödevleri, sınavları aynı zile düşünce hangisinin
nereden geldiği karışmamalı. Kullanıcının sözü (28 Eylül): "birden fazla şeyde aynı anda bulunabilsin dershanede ve okul ikiside
aynı sistemi kullancak ve verilen şeyde bildirimler tek öğrenci oturumu varsa yazcak çift varsa bildirim de okulun ismide olcak ama
belki bir yetişkin dershaneye gider o durumda olabilcek".

## Nereden açılır

Kendiliğinden: sağ üstteki zil ([Bildirim paneli](bildirim-paneli.md)) ve telefon bildirimi ([Telefon bildirimi](telefon-bildirimi.md)).
Birden çok kurumda portalın olunca başlar; ayar yoktur.

## Adım adım

### Öğrenci (okul + dershane) — tasarım

Örnek: Elif'in iki portalı var: "Öğrenci · 7-A" (Test Ortaokulu) ve "Öğrenci · 7. sınıf B grubu" (Örnek Dershanesi).

1. Zile bas. Panel iki kurumun bildirimlerini **birlikte** ve tarih sırasıyla gösterir; hangi portalda olduğun fark etmez.
2. Her satırın başında kalın ve renkli kurum adı: **"Örnek Dershanesi · Deneme 4 için kayıtlar açıldı"**, **"Test Ortaokulu ·
   Matematik dersinden yeni ödev: Kesirlerle toplama — alıştırma 3"**.
3. Sekmeler iki portalın sekmelerinin birleşimidir (okul: Ödev · Sınav · Devamsızlık · Mesaj · Duyuru · Servis; dershane: Ödev ·
   Sınav · Duyuru) ([Bildirim sekmeleri](sekmeler.md)).
4. Öbür kurumdan gelen bir bildirime bas: önce o kurumun portalına geçilir, sonra bildirimin açtığı şey açılır (ör. dershanenin
   deneme sınavı).
5. Tek kurumda portalın varsa bildirimler bugünkü gibi, kurum adı olmadan gelir.

### Veli — tasarım

Çocuğun birden çok kurumdaysa veli portalı kurum kurum ayrılır (portalların adı **"Veli · Ali · Okul A"** / **"Veli · Ali ·
Dershane B"**) ve bildirimin başında kurum adı yazar (tanımdaki örnek: **"Dershane B · Yeni ödev"**). Velide her çocuk zaten ayrı
oturumdur ([Velide her çocuk ayrı oturum](../portallar/velide-cocuk-oturumlari.md)); kurum adı aynı çocuğun iki kurumunu ayırır.

### Yetişkin (öğretmen, çalışan, müdür) — tasarım

Bir yetişkin iki ayrı kurumda portal sahibiyse (ör. bir okulda öğretmen, bir dershanede çalışan) aynı kural geçerlidir: Tasarım 1
önizlemesi kuralı hesaba bağlar, role değil. Eğitim Evi'nin kendisi (eğitmen portalı) kurum sayılmaz.

### Telefon bildirimi — tasarım

Tanıma göre bildirimin **başlığında** kurum adı: **"Dershane B · Yeni ödev"**. Bugün telefon bildiriminin başlığı her zaman
"Eğitim Evi"dir.

### Bugünkü site

Öğrencinin bugün tek okulu olur (dershane portalı yok). İki okulda portalı olan yetişkinde her portalın zili ayrıdır; zil yalnız
bulunduğun portalın bildirimlerini gösterir, kurum adı yazmaz. Telefona bütün portallarının bildirimleri kurum adı olmadan düşer.

## Kurallar ve sınırlar

- **Ne zaman:** hesabın birden çok **kurumda** portalı varsa. Aynı okulda iki rol (ör. öğretmen ve veli) kurum adını getirmez.
- **Kurumlar birbirini görmez:** okul dershanenin bildirimini, dershane okulunkini görmez; kurumdan kuruma bildirim gitmez
  (dershane okulu ilgilendirmez).
- **Uzunluk:** kurum adı da metnin bir parçasıdır; 300 harf sınırı geçerlidir.
- **Kişisel veri:** tanıma göre ana hesap ve portal modeli aydınlatma metnine yazılır ve onay sürümü artar
  ([Öğrencide birden çok kurum](../portallar/ogrencide-portallar.md)).

## Kardeşler ve ilgili

**Kardeşler:** [Bildirim paneli](bildirim-paneli.md) · [Bildirim sekmeleri](sekmeler.md) ·
[Öğrencinin bildirimi veliye de](velinin-bildirimleri.md) · [Telefon bildirimi](telefon-bildirimi.md) ·
[Bildirim türleri ve metinleri](bildirim-metinleri.md).

**İlgili:** [Öğrencide birden çok kurum](../portallar/ogrencide-portallar.md) · [Portala geçiş](../portallar/portala-gecis.md) ·
[Portallarım](../portallar/portallarim.md) · [Velide her çocuk ayrı oturum](../portallar/velide-cocuk-oturumlari.md).

## Kod tarafı

- Bugün kodda yok. Değişecek yerler: ön yüzde [public/js/parcalar/24-bildirim-arama-mobil.md](../../public/js/parcalar/24-bildirim-arama-mobil.md)
  (panelin birden çok portalı birleştirmesi), [public/js/parcalar/08c-kisilikler.md](../../public/js/parcalar/08c-kisilikler.md)
  (portallar); sunucuda [sunucu/bolumler/kayit.md](../../sunucu/bolumler/kayit.md) (`/api/notifications`),
  [sunucu/push.md](../../sunucu/push.md) (telefon bildiriminin başlığı), [sunucu/bolumler/cihaz.md](../../sunucu/bolumler/cihaz.md)
  (Android uygulamasının bildirimleri).
- Tanım: öğrenci-portal tanımı ("BİLDİRİM" maddesi ve kullanıcının 28 Eylül sözü).
- Tasarım: Tasarım 1 önizlemesi, herkes-a paketi (iki portallı örnek hesap; bildirimin başında kurum adı).

## Sık sorulanlar

- **Okulumun ve dershanemin bildirimleri ayrı zillerde mi?** Tasarımda hayır: tek zilde, başında kurum adıyla.
- **Dershane bildirimine bastım, sayfa değişti.** Bildirim dershane portalına aitse önce o portala geçilir.
- **Okulum dershanedeki notlarımı görür mü?** Hayır; kurumlar birbirinin verisini ve bildirimini görmez.

## Sırada

- Tek kişi tek hesap + portallar öğrencide de (iş 19): öğrencinin birden çok kurumu ve bildirimde kurum adı (canlıdan önce).
- Android yerel uygulama (iş 10): uygulamanın Bildirimler sayfasında da kurum adı.
