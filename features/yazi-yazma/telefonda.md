# Yazı düzenleyici · Telefonda araç çubuğu

**Durum:** Tasarlandı — henüz kodda yok (Tasarım 1 önizlemesinde çalışır).

Dar ekranda araç çubuğunun tek satırda kalıp parmakla yana kaydırılması, düğmelerin parmağa göre büyümesi ve telefonda yazarken
bilinmesi gerekenler.

## Ne işe yarar

Masaüstünde iki satıra yayılan yedi düğme grubu telefonda üç dört satır tutar ve yazı alanını aşağı iter. Tanımın kararı (30 Eylül
ve 1 Ekim): **"telefonda araç çubuğu tek satır kaydırmalı"**, "Telefonda araç çubuğu tek satır, yana kayar." Öğrencilerin ve velilerin
çoğu siteyi telefondan kullanır.

## Nereden açılır

Düzenleyicinin olduğu her yerde ([Düzenleyicinin bulunduğu yerler](nerelerde-var.md)); ekran 640 pikselden darsa kendiliğinden bu
düzene geçer.

## Adım adım

### Bugün (kodda)

Düzenleyici yok; telefonda da düz yazı kutuları var.

### Yazan herkes (öğrenci dahil, tasarım)

1. Yazı alanının üstünde **tek satır** düğme görürsün; sığmayan gruplar sağda kalır.
2. Satırı **parmağınla sola kaydır**: öbür gruplar (listeler, hizalama, Ekle, renkler) görünür. Kaydırma yalnız araç çubuğunu
   kaydırır, sayfayı yana itmez; altta ince bir kaydırma çubuğu olur.
3. Düğmeler parmağa göre büyüktür: **44×44 piksel** (masaüstünde 38×38).
4. Yazıda bir yeri seç (basılı tut, tutamaçları sürükle), sonra düğmeye dokun. Düzenleyici yazı alanındaki son seçimini
   hatırlar; düğmeye dokununca biçim en son seçtiğin yere uygulanır.
5. **Fotoğraf ekle**'ye dokununca telefonun kendi seçicisi açılır (galeri ya da kamera, telefona göre) ([Fotoğraf ekle](fotograf-ekle.md)).
6. **Bağlantı ekle**'nin kutusundaki alanlar da 44 piksel yüksekliğindedir; "Adres" alanında telefon adres klavyesi açar
   ([Bağlantı ekle](baglanti-ekle.md)).
7. Klavye kısayolları telefonda yoktur; her iş düğmeyle yapılır ([Klavye kısayolları](kisayollar.md)).

### Android uygulaması

Kaydedilmemiş yazı varken geri tuşuna basarsan uygulama **"Yazdıkların silinsin mi?"** diye sorar: **"Vazgeç"** / **"Sil ve çık"**
(mesaj, ödev teslim notu, formlar; [Android geri tuşu](../uygulama/geri-tusu.md)). Yerel (native) uygulamada düzenleyicinin nasıl
çizileceği tanımda ayrıca yazmıyor.

## Kurallar ve sınırlar

- 640 piksel sınırı önizlemenindir; tanım yalnız "telefonda tek satır, yana kayar" diyor.
- Bütün düğmeler telefonda da vardır; hiçbiri telefonda gizlenmez (öğrencide </> zaten yok).
- </> açıkken telefonda da öbür düğmeler soluk ve basılamaz ([HTML görünümü](html-gorunumu.md)).
- Telefonda çekilen fotoğraf yüklenmeden önce telefonda küçültülür ([Telefonda küçültme](../okul-disk/telefonda-kucultme.md)).
- Bugünkü sitede sayfanın kendisindeki (pencerede olmayan) bir yazı kutusuna yazınca sayfa "kaydedilmemiş" sayılır; üst şeritteki
  yenile düğmesi **"Sayfada yazdıkların kaydedilmedi; yenilersen silinecek. Yine de yenilensin mi?"** diye sorar. Bu denetim
  düzenleyicinin yazı alanı türünü (`contenteditable`) şimdiden kapsıyor; pencerelerin içindeki alanları kapsamıyor
  ([Yenile düğmesi](../menu-ve-arama/yenile-dugmesi.md)).

## Kardeşler ve ilgili

**Kardeşler:** [Araç çubuğunun düzeni](arac-cubugu.md) · [Klavye kısayolları](kisayollar.md) · [Fotoğraf ekle](fotograf-ekle.md) ·
[Bağlantı ekle](baglanti-ekle.md) · [Karakter sayacı](karakter-sayaci.md).

**İlgili:** [Menü · Telefonda menü](../menu-ve-arama/telefonda-menu.md), [Uygulama · Android uygulaması](../uygulama/android-uygulamasi.md),
[Uygulama · Android geri tuşu](../uygulama/geri-tusu.md).

## Kod tarafı

Bugün kodda yok. Sitenin bugünkü dar ekran ve dokunmatik kuralları CSS parçalarında (`public/css/parcalar/07-mobil.css`,
`30-dokunmatik.css`; harita: [public/css/parcalar/CSS.md](../../public/css/parcalar/CSS.md)); telefonda kayan sol menü
[public/js/parcalar/24-bildirim-arama-mobil.md](../../public/js/parcalar/24-bildirim-arama-mobil.md)'de; "kaydedilmemiş yazı"
denetimi [public/js/parcalar/25-tiklama.md](../../public/js/parcalar/25-tiklama.md) ve
[public/js/parcalar/07-yonlendirme.md](../../public/js/parcalar/07-yonlendirme.md)'de. Kodlanınca düzenleyicinin
CSS'inde dar ekran kuralı (tek satır, yana kaydırma, 44 piksel düğme); Durum satırı güncellenir.

## Sık sorulanlar

- **Renk düğmelerini bulamıyorum.** Araç çubuğunu sola kaydır; renkler en sonda.
- **Düğmeye dokununca seçimim kayboluyor mu?** Hayır; düzenleyici son seçimini hatırlar ve biçimi oraya uygular.

## Sırada

- Düzenleyiciler (iş 15, onaylı).
- Android yerel uygulama (iş 10): uygulamada düzenleyicinin karşılığı.
