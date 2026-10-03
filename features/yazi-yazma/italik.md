# Yazı düzenleyici · İtalik

**Durum:** Tasarlandı — henüz kodda yok (Tasarım 1 önizlemesinde çalışır).

Seçili yazıyı ya da bundan sonra yazacağını eğik (italik) yapan, yeniden basınca eğikliği kaldıran düğme.

## Ne işe yarar

Kitap ya da eser adını, yabancı bir kelimeyi ya da küçük bir notu ayırmak için ("*Kesirler* ünitesinin sonundaki sorular").
Kullanıcının bu klasör için verdiği örnekte ("bold italic gibi") adıyla geçer.

## Nereden açılır

"Yazı biçimi" grubunun ikinci düğmesi: eğik *I*, ipucu **"İtalik (Ctrl+I)"** ([Araç çubuğunun düzeni](arac-cubugu.md)).

## Adım adım

### Bugün (kodda)

Yok; bugün yazı düz metindir.

### Yazan herkes (öğrenci dahil, tasarım)

1. Eğik yapmak istediğin yazıyı seç.
2. **İtalik**'e bas ya da Ctrl+I'ya (Mac'te Cmd+I). Seçili yazı eğilir, düğme koyu görünür.
3. Hiçbir şey seçmeden basarsan bundan sonra yazacağın yazı eğik çıkar; yeniden basınca biter.
4. Eğik bir yazıyı seçip yeniden basarsan eğiklik kalkar.
5. İmleç eğik yazının içindeyken düğme koyu görünür.
6. Kalın, altı çizili, üstü çizili, renk ve sarı vurguyla birlikte kullanılabilir.

### Okuyan herkes

Yazı eğik görünür.

## Kurallar ve sınırlar

- HTML'de `<i>` ya da `<em>` (ikisi de izinli); nitelik eklenemez ([İzinli ve izinsiz kod](izinli-ve-izinsiz-kod.md)).
- Tarayıcının ürettiği `font-style: italic` taşıyan `span` kayıtta `<i>`'ye çevrilir.
- Word ya da Google Docs'tan yapıştırılan italik yazı italik kalır ([Yapıştırma](yapistirma.md)).
- Kısayol Ctrl+I tanımın kendi sözüdür.

## Kardeşler ve ilgili

**Kardeşler:** [Kalın](kalin.md) · [Altı çizili](alti-cizili.md) · [Üstü çizili](ustu-cizili.md) · [Renkler](renkler.md) ·
[Klavye kısayolları](kisayollar.md).

**İlgili:** [Ödev verme](../odev/odev-verme.md), [Yeni mesaj](../mesaj/yeni-mesaj.md).

## Kod tarafı

Bugün kodda yok. Kodlanınca düzenleyicinin ön yüz parçasında ve sunucudaki izin listesinde (`i`, `em`); Durum satırı güncellenir.

## Sık sorulanlar

- **Türkçe harflerde (ğ, ş, İ) italik bozuk görünür mü?** Hayır; sitenin yazı tipiyle aynı harfler eğik çizilir.

## Sırada

- Düzenleyiciler (iş 15, onaylı).
