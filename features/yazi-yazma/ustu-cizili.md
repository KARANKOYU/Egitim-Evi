# Yazı düzenleyici · Üstü çizili

**Durum:** Tasarlandı — henüz kodda yok (Tasarım 1 önizlemesinde çalışır).

Seçili yazının üstünü çizen, yeniden basınca çizgiyi kaldıran düğme.

## Ne işe yarar

Değişen bir bilgiyi silmeden göstermek için: "Teslim ~~Cuma~~ Pazartesi" gibi. 30 Eylül'deki alan listesinde yoktu; 1 Ekim'de
kullanıcının onayladığı kesin araç çubuğunda "Kalın · İtalik · Altı çizili · Üstü çizili" olarak yer aldı.

## Nereden açılır

"Yazı biçimi" grubunun dördüncü düğmesi: üstü çizili S, ipucu **"Üstü çizili (Alt+Shift+5)"** ([Araç çubuğunun düzeni](arac-cubugu.md)).

## Adım adım

### Bugün (kodda)

Yok; bugün yazı düz metindir.

### Yazan herkes (öğrenci dahil, tasarım)

1. Üstünü çizmek istediğin yazıyı seç.
2. **Üstü çizili**'ye bas ya da Alt+Shift+5'e. Düğme koyu görünür.
3. Seçmeden basarsan sonra yazacağın yazının üstü çizilir; yeniden basınca biter.
4. Üstü çizili yazıyı seçip yeniden basarsan çizgi kalkar.

### Okuyan herkes

Yazı ortasından geçen bir çizgiyle görünür; okunmaya devam eder.

## Kurallar ve sınırlar

- HTML'de `<s>` ya da `<del>` (ikisi de izinli); nitelik eklenemez ([İzinli ve izinsiz kod](izinli-ve-izinsiz-kod.md)).
- Tarayıcının ürettiği `text-decoration: line-through` taşıyan `span` kayıtta `<s>`'ye çevrilir; yapıştırılan `strike`, `del` ve
  üstü çizili biçim `<s>` olur ([Yapıştırma](yapistirma.md)).
- **Alt+Shift+5** önizlemenin kısayoludur; tanımın kısayol listesinde (Ctrl+Z/Y/B/I/U) yoktur ([Klavye kısayolları](kisayollar.md)).

## Kardeşler ve ilgili

**Kardeşler:** [Kalın](kalin.md) · [İtalik](italik.md) · [Altı çizili](alti-cizili.md) · [Renkler](renkler.md) ·
[Klavye kısayolları](kisayollar.md).

**İlgili:** [Ödevi düzenleme ve silme](../odev/odevi-duzenleme-ve-silme.md) (değişen tarihi göstermek için kullanışlı).

## Kod tarafı

Bugün kodda yok. Kodlanınca düzenleyicinin ön yüz parçasında ve sunucudaki izin listesinde (`s`, `del`); Durum satırı güncellenir.

## Sık sorulanlar

- **Üstünü çizdiğim yazı silinmiş mi sayılır?** Hayır; yalnız görünüşü değişir, okuyan yine görür. Gerçekten kaldırmak için sil.

## Sırada

- Düzenleyiciler (iş 15, onaylı).
