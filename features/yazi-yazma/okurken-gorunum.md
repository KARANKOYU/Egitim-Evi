# Yazı düzenleyici · Okurken görünüm (biçimli yazının gösterilmesi)

**Durum:** Tasarlandı — henüz kodda yok (bugün her yazı düz metin olarak, satır sonlarıyla gösterilir; Tasarım 1 önizlemesinde
ödevin penceresi, mesaj, destek talebinin yazışması, takvim etkinliğinin notu ve okul sayfasının yazı bloğunda biçimli gösterim
var; başarının ve toplantının açıklaması önizlemede henüz düz yazı olarak gösteriliyor).

Düzenleyiciyle yazılmış bir açıklamanın, mesajın ya da duyurunun okuyana nasıl göründüğü: biçimler, bağlantılar, fotoğraflar, eski
düz yazı kayıtlar ve listelerdeki kısa önizlemeler.

## Ne işe yarar

Düzenleyicinin bütün işi okuyanın gördüğü yazıdır: öğrencinin ödev penceresinde açıklama, velinin okuduğu duyuru, ziyaretçinin
okul sayfasında gördüğü tanıtım yazısı. Tanım üç şey istiyor: bağlantılar yeni sekmede ve `rel="noopener nofollow"` ile açılır,
"eski düz metin kayıtlar olduğu gibi gösterilir", ve yazı **gösterilirken de ikinci kez temizlenir** (eski kayıtlar için).

## Nereden açılır

Düzenleyicinin yazdığı her şeyin okunduğu yerde ([Düzenleyicinin bulunduğu yerler](nerelerde-var.md)); önizlemede çoğu yerde
**"Açıklama:"** başlığının altında:

- ödevin penceresi ([Ödevin penceresi](../odev/odev-penceresi.md)), müdürün salt okunur ödev penceresi;
- mesaj ve duyuru ([Mesaj okuma](../mesaj/mesaj-okuma.md)), velinin kopyası ([Velinin kopyası](../mesaj/velinin-kopyasi.md));
- destek talebinin yazışması ([Talep yazışması](../destek/talep-yazismasi.md));
- toplantının penceresi ([Toplantı penceresi](../toplanti/toplanti-penceresi.md)), takvimde etkinliğin penceresi
  ([Gün ayrıntısı](../takvim/gun-ayrintisi.md));
- başarının penceresi ([Başarının penceresi](../basarilar/basari-penceresi.md));
- video izleme sayfası ([İzleme sayfası](../egitim-icerikleri/izleme-sayfasi.md));
- okul sayfası ([Tanıtım ve fotoğraflar](../okul-sayfasi/tanitim-ve-fotograflar.md)) ve site duyurusu şeridi
  ([Site duyurusu](../yonetim/site-duyurusu.md)).

## Adım adım

### Bugün (kodda)

Yazı düz metindir: satır sonları korunur, her karakter olduğu gibi görünür (`<b>` yazana `<b>` görünür). Adresler tıklanmaz.

### Okuyan herkes (öğrenci, veli, öğretmen, çalışan, müdür, servisçi, eğitmen, destek, yönetici; okul sayfası, açık eğitim videoları ve site duyurusunda ziyaretçi de — tasarım)

1. Yazıyı açarsın; biçimler yazanın verdiği gibi görünür:
   - başlıklar büyük ve kalın (yazının 1,5 / 1,28 / 1,1 katı), paragraflar arasında az boşluk;
   - kalın, italik, altı çizili, üstü çizili;
   - madde ve numaralı listeler soldan girintili;
   - hizalama ve girinti (40 pikselin katları);
   - kırmızı, yeşil, mavi yazı ve sarı vurgu.
2. **Bağlantılar** mavi ve altı çizili; tıklayınca **yeni sekmede** açılır, Eğitim Evi açık kalır ([Bağlantı ekle](baglanti-ekle.md)).
3. **Fotoğraflar** yazının içinde, kutunun genişliğine sığacak boyutta, köşeleri hafif yuvarlak ([Fotoğraf ekle](fotograf-ekle.md)).
4. İzin listesinin dışında kalmış bir şey yazının içinde **düz metin** olarak (kod gibi, harf harf) görünür; hiçbir şey çalışmaz,
   hiçbir şey gizlenmez ([İzinli ve izinsiz kod](izinli-ve-izinsiz-kod.md)).
5. Bugünden kalan **eski düz yazı kayıtlar** bugünkü gibi gösterilir: satır sonları korunur, içindeki her şey düz metindir.

### Listelerde ve önizlemelerde

Mesaj listesindeki "açıklamanın başı" gibi kısa önizlemeler **biçimsiz düz yazıdır**: önizleme gönderirken yazının ayrıca düz hâlini
tutuyor; yalnız fotoğraftan oluşan bir yazıda listede "(yazı yok)" görünür. Bildirim metinlerinde yazının biçimli içeriğinin
geçip geçmeyeceği tanımda yazmıyor.

## Kurallar ve sınırlar

- Gösterimde yazı **ikinci kez** izin listesinden geçirilir (tanımın KURAL 4'ü); kayıtta bir şey kaçmış olsa ya da kayıt eski bir
  sürümden kalmışsa bile okuyanın tarayıcısında çalışmaz. Önizlemede mesaj, talep, etkinlik notu ve okul sayfası bunu yapıyor;
  ödevin penceresi örnek açıklamayı temizlemeden basıyor. Kodlanırken her gösterim yeri temizleyiciden geçmeli.
- Biçimler sitenin açık ve koyu temasına uyar (yazı rengi "varsayılan"sa temanın rengiyle). Koyu temada sarı vurgunun okunurluğu
  açık nokta ([Renkler](renkler.md)).
- **Eski kayıt mı, yeni kayıt mı:** bir yazının bugünkü düz metin mi yoksa düzenleyicinin HTML'i mi olduğunun nasıl ayırt edileceği
  (ör. kayıtta ayrı bir işaret) tanımda yazmıyor; önizlemede mesajda HTML ayrı bir alanda tutuluyor. Yapı belgesinde karara
  bağlanmalı; yanlış ayrım eski bir düz yazıdaki `<` işaretini kod sanabilir ya da yeni yazının biçimini harf harf gösterebilir.
- Yazdırma, e-posta ve telefon uygulamasında (yerel Android) biçimli yazının nasıl görüneceği tanımda yazmıyor.

## Kardeşler ve ilgili

**Kardeşler:** [İzinli ve izinsiz kod](izinli-ve-izinsiz-kod.md) · [Bağlantı ekle](baglanti-ekle.md) · [Fotoğraf ekle](fotograf-ekle.md) ·
[Renkler](renkler.md) · [Başlıklar](basliklar.md) · [Düzenleyicinin bulunduğu yerler](nerelerde-var.md).

**İlgili:** [Mesajlar · Mesaj okuma](../mesaj/mesaj-okuma.md), [Ödevler · Ödevin penceresi](../odev/odev-penceresi.md),
[Uygulama · Android uygulaması](../uygulama/android-uygulamasi.md), [Hesap ayarları · Görünüm ve dil](../ayarlar/gorunum-ve-dil.md).

## Kod tarafı

Bugün yazılar [public/js/parcalar/01-yardimcilar.md](../../public/js/parcalar/01-yardimcilar.md)'deki `esc` ile düz metin olarak
basılır, satır sonları CSS'te korunur (`white-space: pre-wrap`; ör. mesaj gövdesi ve ödev açıklaması). Kodlanınca biçimli
gösterim için ortak bir "zengin yazı" kutusu ve gösterimde ikinci temizlik; Durum satırı güncellenir.

## Sık sorulanlar

- **Bağlantıya tıklayınca Eğitim Evi kapanır mı?** Hayır; yeni sekmede açılır.
- **Eski mesajlarım bozulur mu?** Hayır; düz yazı kayıtlar bugünkü gibi gösterilir.

## Sırada

- Düzenleyiciler (iş 15, onaylı).
- Yapı belgesi: eski/yeni kayıt ayrımı; bildirim, e-posta ve uygulamada gösterim.
