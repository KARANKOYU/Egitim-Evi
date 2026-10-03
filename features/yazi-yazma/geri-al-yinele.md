# Yazı düzenleyici · Geri al · Yinele

**Durum:** Tasarlandı — henüz kodda yok (Tasarım 1 önizlemesinde çalışır).

Yazı alanında yaptığın son değişikliği geri alan ve geri aldığını yeniden yapan iki düğme.

## Ne işe yarar

Kullanıcı ilk örneği onaylarken bunu özellikle istedi: "onaylıyorum, geri al yinele ve hizalama da olsun" (1 Ekim). Yanlışlıkla
silinen bir paragrafı, istemeden verilen bir biçimi ya da yanlış yere konan bir fotoğrafı tek tıkla geri getirmek için.

## Nereden açılır

Araç çubuğunun ilk grubu ("Geri al ve yinele"): sola kıvrık ok **"Geri al (Ctrl+Z)"**, sağa kıvrık ok **"Yinele (Ctrl+Y)"**
([Araç çubuğunun düzeni](arac-cubugu.md)).

## Adım adım

### Bugün (kodda)

Düzenleyici yok. Bugünkü düz yazı kutularında tarayıcının kendi Ctrl+Z / Ctrl+Y'si çalışır (yalnız yazı için; biçim yok).

### Yazan herkes (öğrenci dahil, tasarım)

1. Bir şey yaz, sil, biçimle ya da fotoğraf veya bağlantı ekle.
2. **"Geri al"**a bas (ya da Ctrl+Z; Mac'te Cmd+Z): son adım geri alınır. Art arda basarak daha geriye gidersin.
3. Geri aldığını yeniden istersen **"Yinele"**ye bas (ya da Ctrl+Y; Mac'te Cmd+Y).
4. Geri aldıktan sonra yeni bir şey yazarsan "yinele" geçmişi biter (tarayıcının olağan davranışı).

Neler geri alınır (önizlemede tarayıcının kendi geri alma geçmişiyle): yazma ve silme, kalın/italik/altı-üstü çizili, başlıklar,
listeler, hizalama, tarayıcının girintisi, yazı rengi ve sarı vurgu, yeni bağlantı ekleme, fotoğraf ekleme, yapıştırma.

## Kurallar ve sınırlar

- Olması gereken: geçmiş **her yazı alanının kendisine** ait olsun; bir alandaki Ctrl+Z öbür alanı etkilemesin. Tanımda bu ayrıca
  yazmıyor; önizleme tarayıcının sayfa geneli geri alma geçmişini kullandığı için aynı pencerede birden çok düzenleyici olduğunda
  (ör. anket ya da quiz) tarayıcıya göre değişebilir. Kodlanırken denenmeli.
- Geçmiş yalnız sayfa açıkken durur: pencereyi kapatınca, sayfadan çıkınca ya da gönderince biter. Gönderilmiş bir mesaj "geri
  alınmaz" (mesajın düzeltilmesi ayrı bir iş: [Düzeltme ve silme](../mesaj/duzeltme-ve-silme.md)).
- **</> açıkken** iki düğme de soluktur ve basılamaz; kod kutusunun içinde tarayıcının kendi Ctrl+Z'si çalışır
  ([HTML görünümü](html-gorunumu.md)).
- Önizlemede **tarayıcının geçmişine girmeyen** işler var: HTML görünümünden dönüş (yazı yeniden kurulur), var olan bir bağlantının
  adresini **"Kaydet"**le değiştirme ya da **"Bağlantıyı kaldır"**, HTML görünümünden gelen girintinin **"Girintiyi azalt"**la
  azaltılması ve "Yazı rengi: varsayılan"ın arkasındaki temizlik. Bunlardan sonra Geri al beklenen adımı geri getirmeyebilir;
  kodlanırken bunlar da geri alınabilir yapılmalı (tanımda ayrıca bir şey yazmıyor).
- Kısayollar Ctrl+Z ve Ctrl+Y tanımın kendi sözüdür ("ipucu: Türkçe ad + kısayol: Ctrl+Z/Y/B/I/U"). Mac'teki Cmd+Shift+Z gibi
  başka yinele kısayolları tanımda yok.

## Kardeşler ve ilgili

**Kardeşler:** [Araç çubuğunun düzeni](arac-cubugu.md) · [Klavye kısayolları](kisayollar.md) · [HTML görünümü](html-gorunumu.md) ·
[Yapıştırma](yapistirma.md).

**İlgili:** [Mesajlar · Düzeltme ve silme](../mesaj/duzeltme-ve-silme.md), [Uygulama · Android geri tuşu](../uygulama/geri-tusu.md)
(uygulamada geri tuşu yazıyı geri almaz; kaydedilmemiş yazı varsa "Yazdıkların silinsin mi?" diye sorar).

## Kod tarafı

Bugün kodda yok. Kodlanınca düzenleyicinin ön yüz parçasında; önizleme tarayıcının kendi geri alma geçmişini kullanıyor (ayrı bir
geçmiş tutmuyor). Bu bölüm ve Durum satırı o zaman güncellenir.

## Sık sorulanlar

- **Gönderdikten sonra geri alabilir miyim?** Hayır; geri al yalnız yazarken çalışır.
- **Telefonda Ctrl+Z yok, ne yaparım?** Araç çubuğundaki "Geri al" düğmesine bas.

## Sırada

- Düzenleyiciler (iş 15, onaylı).
- Yapı belgesi: tarayıcının geçmişine girmeyen işlerin de geri alınabilmesi.
