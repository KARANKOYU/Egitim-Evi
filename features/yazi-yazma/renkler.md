# Yazı düzenleyici · Yazı rengi ve sarı vurgu

**Durum:** Tasarlandı — henüz kodda yok (Tasarım 1 önizlemesinde çalışır).

Yazıyı paletteki üç renkten birine boyayan ya da olağan rengine döndüren dört kutu ve yazının arkasını sarıyla vurgulayan beşinci kutu.

## Ne işe yarar

Kullanıcı site duyurusunu isterken "altı çizili, renkli, editörlü olsun" dedi; renk o günden beri her düzenleyici listesinde.
Kesin tasarımda (1 Ekim) araç çubuğunun en sonunda **renk kutuları: varsayılan, kırmızı, yeşil, mavi + SARI VURGU (arka plan)**.
Uyarıyı kırmızıyla, olumlu bir notu yeşille yazmak, bir cümleyi fosforlu kalem gibi sarıyla işaretlemek için.

## Nereden açılır

Araç çubuğunun "Renk" grubu ([Araç çubuğunun düzeni](arac-cubugu.md)). Her kutunun içinde "A" harfi var:

| Kutu | İpucu | Ne yapar | Önizlemedeki renk |
|---|---|---|---|
| koyu zeminli A (temanın yazı rengi) | **"Yazı rengi: varsayılan"** | rengi kaldırır, yazı temanın olağan rengine döner | — |
| kırmızı zeminli A | **"Yazı rengi: kırmızı"** | yazıyı kırmızı yapar | #e46a6a |
| yeşil zeminli A | **"Yazı rengi: yeşil"** | yazıyı yeşil yapar | #3f9e5f |
| mavi zeminli A | **"Yazı rengi: mavi"** | yazıyı mavi yapar | #3b97bb |
| sarı zeminli koyu A | **"Sarı vurgu"** | yazının arkasını sarı yapar; yeniden basınca kaldırır | #fde68a (arka plan) |

## Adım adım

### Bugün (kodda)

Yok; bugün yazı tek renktir.

### Yazan herkes (öğrenci dahil, tasarım)

1. Renklendirmek istediğin yazıyı seç.
2. Kırmızı, yeşil ya da mavi kutuya bas: yazı o renge boyanır. Başka bir renk kutusuna basarsan rengi değişir.
3. Rengi kaldırmak için yazıyı seçip **"Yazı rengi: varsayılan"** kutusuna bas; yazı temanın kendi rengine döner (açık temada
   koyu, koyu temada açık).
4. Vurgulamak için yazıyı seç, **"Sarı vurgu"**ya bas: arkası sarı olur, düğme koyu görünür. Vurgulu yazıyı seçip yeniden basarsan
   vurgu kalkar.
5. Hiçbir şey seçmeden bir renge basarsan bundan sonra yazacağın yazı o renkte çıkar (tarayıcının olağan davranışı).
6. Renk kalın, italik ve öbür biçimlerle birlikte kullanılabilir; renk ve sarı vurgu aynı yazıda olabilir.
7. Yazı rengi kutularının "basılı" hâli yoktur; imlecin olduğu yazının rengini düğmeden değil yazının kendisinden görürsün.

### Okuyan herkes

Yazı seçilen renkte, vurgulu yazı sarı zemin üstünde görünür.

## Kurallar ve sınırlar

- **Yalnız palet:** serbest renk seçici yoktur. Tanım: "yazı rengi yalnız paletten (zemin rengiyle aynı renk seçilemez)"; beyaz ya
  da siyah gibi yazıyı zeminde kaybettiren bir renk yoktur. Bu, "gizleme yok" kuralının parçasıdır
  ([İzinli ve izinsiz kod](izinli-ve-izinsiz-kod.md)).
- HTML'de `<span style="color: …">` (yalnız paletteki üç renk) ve `<span style="background-color: …">` (yalnız sarı vurgu).
  Tanım "4 renkten biri" diyor; dördüncüsü "varsayılan"dır ve kodu yoktur (renk niteliği hiç yazılmaz). Önizlemedeki renk
  kodları yukarıdaki tabloda; tanımda kesin renk kodu yazmıyor.
- </> ile yazarken paletteki kodlardan başka bir renk (ör. `color: #ffffff`, `color: red`) ya da başka bir zemin rengi izinli
  değildir: o etiket düz metin olur.
- Word ya da Docs'tan yapıştırılan yazının rengi **yalnız paletteki renklerden biriyse** kalır; değilse renk atılır, yazı kalır.
  Sarı vurgu da yalnız tam bu sarıysa kalır ([Yapıştırma](yapistirma.md)).
- Renkler kısa yollarla yazılmaz; kısayolları yok.
- **Koyu tema:** sarı vurgu yalnız arka planı boyar, yazının rengine dokunmaz. Koyu temada yazı açık renkli olduğu için açık sarı
  zemin üstünde zor okunabilir; önizlemede buna özel bir kural yok. Kodlanırken bakılmalı (ör. vurgulu yazının koyu temada da
  koyu renkte gösterilmesi). Eski site duyurusu tanımı renklerin "açık ve koyu temada okunur" olmasını istiyordu.
- **Site duyurusu farkı:** sistem tanımının eski maddesi ve panelin önizlemesi site duyurusu için **6 renk** sayıyor (Kırmızı,
  Turuncu, Sarı, Yeşil, Mavi, Mor; yazı seçili değilse "Önce renklendireceğin yazıyı seç."). Kullanıcının sonraki kararı
  ortak düzenleyiciyi site duyurusunda da istediği için bu belge 3 renk + varsayılan + sarı vurguyu esas alır
  ([Düzenleyicinin bulunduğu yerler](nerelerde-var.md)).

## Kardeşler ve ilgili

**Kardeşler:** [Kalın](kalin.md) · [Altı çizili](alti-cizili.md) · [Araç çubuğunun düzeni](arac-cubugu.md) ·
[İzinli ve izinsiz kod](izinli-ve-izinsiz-kod.md) · [Okurken görünüm](okurken-gorunum.md).

**İlgili:** [Hesap ayarları · Görünüm ve dil](../ayarlar/gorunum-ve-dil.md) (açık ve koyu tema),
[Site yönetimi · Site duyurusu](../yonetim/site-duyurusu.md).

## Kod tarafı

Bugün kodda yok. Kodlanınca düzenleyicinin ön yüz parçasında ve sunucudaki izin listesinde (`span` üzerinde `color` ve
`background-color`, değerleri paletten); Durum satırı güncellenir.

## Sık sorulanlar

- **Başka bir renk kullanabilir miyim?** Hayır; yalnız kırmızı, yeşil, mavi ve sarı vurgu. Böylece hiçbir yazı zemin rengine
  boyanıp gizlenemez.
- **Rengi nasıl kaldırırım?** Yazıyı seç, "Yazı rengi: varsayılan"a bas.

## Sırada

- Düzenleyiciler (iş 15, onaylı).
- Yapı belgesi: paletin kesin renk kodları, koyu temada sarı vurgunun okunurluğu, site duyurusunun ortak düzenleyiciye geçmesi.
