# Yazı düzenleyici · Karakter sayacı

**Durum:** Kodda var; tasarımda ek olarak her düzenleyicinin altında alanın kendi sınırıyla bir sayaç ve geniş "Gönder"/"Kaydet"
düğmesi. (Bugün sayaç yalnız üç düz yazı kutusunda: yeni mesaj, okul sayfasının tanıtım yazısı, Eğitim Evi hakkındaki yorum.)

Yazı alanının altında kaç karakter yazdığını ve sınırı ("120 / 4000" gibi) gösteren sayaç.

## Ne işe yarar

Uzun bir yazının sınıra ne kadar yaklaştığını yazarken görmek; gönderince "çok uzun" hatasıyla karşılaşmamak. Tanımın kesin
maddesi: "Altta karakter sayacı (alanına göre sınır), 'Gönder'/'Kaydet' düğmesi geniş."

## Nereden açılır

Her düzenleyicinin altında kendiliğinden görünür; düğmesi yok.

## Adım adım

### Bugün (kodda)

- **"Yeni mesaj"**: "Mesaj" kutusunun altında **"0 / 4000"**; her tuşta güncellenir. Kutu 4000'den fazlasını yazdırmaz.
  ("Mesajı düzelt" penceresinde sayaç yok, sınır yine 4000.)
- **Okul sayfası** → **"Tanıtım yazısı"**: kutunun altında **"N / 1500."** ve yanında "Paragrafları boş bir satırla ayır. Bağlantı ve
  biçim eklenemez; yazı olduğu gibi görünür."
- **Eğitim Evi hakkındaki yorum** (Ayarlar'da yazılır, açılış sayfasında görünür; alan "Yorumun"): **"N / 500"** ([Yorum yazma](../yorumlar/yorum-yazma.md)).
- Öbür uzun alanlarda sayaç yok; kutu sınırdan fazlasını yazdırmaz ya da sunucu fazlasını **uyarmadan keser**:

| Alan (bugün) | Sınır | Sayaç |
|---|---|---|
| Mesaj metni ("Mesaj") | 4000 | var |
| Ödev açıklaması ("Açıklama") | 1000 | yok; "Yeni ödev"de kutunun sınırı yok, sunucu 1000'de uyarısız keser ("Ödevi düzenle"de kutu 1000) |
| Anket açıklaması ("Açıklama (isteğe bağlı)") | 1000 | yok |
| Hatırlatıcı açıklaması ("Açıklama (isteğe bağlı)") | 1000 | yok |
| Takvim etkinliğinin açıklaması ("Açıklama") | 300 | yok |
| Okul sayfası tanıtım yazısı | 1500 | var |
| Quiz sorusunun metni | 1000 | yok; aşarsa "N. sorunun metni en fazla 1000 karakter olabilir." |

### Yazan herkes (öğrenci dahil, tasarım)

**Tasarımda:** sayaç yalnız üç kutuda değil, düzenleyicinin bulunduğu her alanda olur.

1. Düzenleyicide yaz; altta sayaç yazdığın karakter sayısını ve alanın sınırını gösterir.
2. Altta geniş bir gönderme ya da kaydetme düğmesi durur. Tanımın sözü "Gönder"/"Kaydet"; önizlemede düğmenin adı pencereye göre
   değişir ("Gönder", "Ödevi ver", "Toplantıyı aç", "Ekle", "Yayımla", "Yayınla").
3. Sınırı aşınca ne olacağı ortak düzenleyici için tanımda yazmıyor. Panelin önizlemesindeki site duyurusu örneği: sayaç 500'ü
   aşınca kırmızı olur; **"Duyuru koy"**a basınca duyuru konmaz, **"Duyuru en çok 500 karakter olabilir."** iletisi çıkar; metin
   boşsa **"Duyurunun metnini yaz."**

Tasarım 1 önizlemesinde: ortak düzenleyicinin altında sayaç **henüz yok**; yalnız paneldeki **"Duyuru koy"** kutusunun altında
**"0 / 500"** var, 500'ü aşınca kırmızı olur.

## Kurallar ve sınırlar

- **Sınır alana göredir**; her alanın sınırı yapı belgesinde tek tek yazılacak (tanımda henüz alan alan sayı yok). Tanımda geçen tek
  sayı site duyurusunun 500 karakteri (sistem tanımı).
- **Ne sayılır:** panelin önizlemesi **görünen yazının** karakterlerini sayar; biçim kodları (etiketler) ve fotoğraflar sayılmaz.
  Sunucuya giden HTML görünen yazıdan uzundur; HTML'in kendisi için ayrı bir üst sınır gerekip gerekmediği yapı belgesinde
  belirlenmeli.
- Bugünkü uyarısız kesme ("Yeni ödev" açıklaması) yazanın yazısını sessizce kaybettirir; [Ödev verme](../odev/odev-verme.md)
  belgesinde de bilinen açık olarak yazılı.

## Kardeşler ve ilgili

**Kardeşler:** [Düzenleyicinin bulunduğu yerler](nerelerde-var.md) · [Araç çubuğunun düzeni](arac-cubugu.md) ·
[Fotoğraf ekle](fotograf-ekle.md) (fotoğraf karakter sayılmaz, ayrı sınırı olacak).

**İlgili:** [Mesajlar · Yeni mesaj](../mesaj/yeni-mesaj.md), [Ödev verme](../odev/odev-verme.md),
[Yorumlar · Yorum yazma](../yorumlar/yorum-yazma.md), [Site yönetimi · Site duyurusu](../yonetim/site-duyurusu.md),
[Okul sayfası · Tanıtım ve fotoğraflar](../okul-sayfasi/tanitim-ve-fotograflar.md).

## Kod tarafı

Bugünkü sayaçlar: [public/js/parcalar/19-mesajlar.md](../../public/js/parcalar/19-mesajlar.md) ("0 / 4000"),
[public/js/parcalar/19g-okul-sayfasi.md](../../public/js/parcalar/19g-okul-sayfasi.md) ("N / 1500."),
[public/js/parcalar/23-veli-ayarlar.md](../../public/js/parcalar/23-veli-ayarlar.md) (yorum, "N / 500"). Sunucudaki sınırlar:
[sunucu/bolumler/mesaj.md](../../sunucu/bolumler/mesaj.md) (4000), [sunucu/bolumler/odev.md](../../sunucu/bolumler/odev.md) (1000),
[sunucu/bolumler/anket.md](../../sunucu/bolumler/anket.md) (1000), [sunucu/bolumler/hatirlatici.md](../../sunucu/bolumler/hatirlatici.md) (1000),
[sunucu/bolumler/takvim.md](../../sunucu/bolumler/takvim.md) (300), [sunucu/bolumler/okul-sayfasi.md](../../sunucu/bolumler/okul-sayfasi.md) (1500),
[sunucu/bolumler/quiz.md](../../sunucu/bolumler/quiz.md) (soru metni 1000); uyarısız kesme [sunucu/ortak.md](../../sunucu/ortak.md)'deki
`clean`. Kodlanınca sayaç ortak düzenleyicinin parçası olur; bu bölüm ve Durum satırı güncellenir.

## Sık sorulanlar

- **Kalın yazı daha çok karakter sayılır mı?** Panelin önizlemesinde hayır: yalnız görünen yazı sayılır. Ortak düzenleyici için
  kesin kural yapı belgesinde yazılacak.
- **Bugün ödev açıklamam neden yarım kaldı?** "Yeni ödev"de kutu sınır koymuyor, sunucu 1000 karakterden sonrasını uyarmadan kesiyor.
  Açıklamayı 1000 karakterin altında tut ya da kalanını dosya olarak ekle.

## Sırada

- Düzenleyiciler (iş 15, onaylı): her alanın sınırı ve sayacı.
- Yapı belgesi: alan alan sınırlar, HTML'in üst sınırı, sınırı aşınca ne olacağı ve hata iletileri.
