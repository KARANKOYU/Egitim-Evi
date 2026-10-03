# Yazı düzenleyici · Başlıklar (H1, H2, H3)

**Durum:** Tasarlandı — henüz kodda yok (Tasarım 1 önizlemesinde çalışır).

Bir paragrafı büyük, orta ya da küçük başlığa çeviren üç düğme; aynı düğmeye yeniden basmak normal yazıya döndürür.

## Ne işe yarar

Uzun bir açıklamayı bölümlere ayırmak için: "Yapılacaklar", "Teslim", "Puanlama" gibi ara başlıklar. Yazı boyutu seçici yok;
büyük yazı yalnız başlıkla olur.

## Nereden açılır

Araç çubuğunun ikinci grubu ("Başlıklar"): **H1** "Büyük başlık (Ctrl+Alt+1)", **H2** "Orta başlık (Ctrl+Alt+2)", **H3** "Küçük
başlık (Ctrl+Alt+3)" ([Araç çubuğunun düzeni](arac-cubugu.md)).

## Adım adım

### Bugün (kodda)

Yok. Bugün başlık yerine satırı büyük harfle yazmak ya da boş satır bırakmak gerekir.

### Yazan herkes (öğrenci dahil, tasarım)

1. İmleci başlık yapmak istediğin satıra (paragrafa) koy; seçmen gerekmez, bütün paragraf başlık olur.
2. **H1**, **H2** ya da **H3**'e bas. Paragraf o boyutta, kalın bir başlık olur; düğmesi koyu görünür.
3. Başka bir başlık düğmesine basarsan doğrudan o boyuta geçer (H1'den H2'ye).
4. **Aynı** düğmeye yeniden basarsan başlık normal paragrafa döner.
5. Başlığın sonunda Enter'a basınca yeni satır normal paragraf olarak başlar (tarayıcının olağan davranışı).
6. Başlığı da hizalayabilirsin (ortala, sağa yasla…) ([Hizalama](hizalama.md)).

### Okuyan herkes

Başlıklar yazının kendi yazı tipinde, kalın ve büyük görünür. Önizlemedeki boyutlar: büyük başlık yazının 1,5 katı, orta 1,28
katı, küçük 1,1 katı; üstte ve altta az boşluk.

## Kurallar ve sınırlar

- HTML'de karşılıkları **h3, h4, h5**'tir (H1 → h3, H2 → h4, H3 → h5); tanımın kesin sözü.
- </> ile yazarken başlıkları `<h3>`, `<h4>`, `<h5>` olarak yazmalısın; `<h1>`, `<h2>` ya da `<h6>` izin listesinde yok, o etiket
  **düz metin** olarak görünür ([İzinli ve izinsiz kod](izinli-ve-izinsiz-kod.md)).
- Başlıkta izinli tek biçim niteliği hizalamadır (`text-align`). Önizleme başlıkta girintiye (`margin-left`) de izin veriyor;
  tanım girintiyi yalnız paragraf ve liste maddesi için sayıyor ([Girinti](girinti.md)).
- Word ya da Google Docs'tan yapıştırınca: 1. düzey başlık büyük (h3), 2. düzey orta (h4), öbürleri küçük başlık (h5) olur
  ([Yapıştırma](yapistirma.md)).
- Liste maddesinin içinde başlık olmaz: önizleme kaydederken madde içindeki başlığı düz yazıya çevirir. Bir maddeyi başlık
  yapmak istersen önce listeden çıkar (liste düğmesine yeniden bas).
- Ctrl+Alt+1 / 2 / 3 önizlemenin kısayollarıdır, tanımda yok; Türkçe klavyede AltGr+1 (`>`) ve AltGr+3 (`#`) ile çakışıyorlar
  ([Klavye kısayolları](kisayollar.md)).

## Kardeşler ve ilgili

**Kardeşler:** [Kalın](kalin.md) · [Hizalama](hizalama.md) · [Araç çubuğunun düzeni](arac-cubugu.md) ·
[Klavye kısayolları](kisayollar.md) · [Okurken görünüm](okurken-gorunum.md).

**İlgili:** [Ödev verme](../odev/odev-verme.md), [Okul sayfası · Tanıtım ve fotoğraflar](../okul-sayfasi/tanitim-ve-fotograflar.md).

## Kod tarafı

Bugün kodda yok. Kodlanınca düzenleyicinin ön yüz parçasında ve sunucudaki izin listesi temizleyicisinde (h3, h4, h5); Durum
satırı güncellenir.

## Sık sorulanlar

- **Başlığı nasıl normal yazıya çeviririm?** Aynı başlık düğmesine yeniden bas.
- **</> ile yazarken hangi etiketi kullanmalıyım?** h3 (büyük), h4 (orta), h5 (küçük). Tanım yazının başlıklarını böyle istiyor;
  h1 ya da h2 yazarsan o satır kod olarak, düz metin görünür.

## Sırada

- Düzenleyiciler (iş 15, onaylı).
