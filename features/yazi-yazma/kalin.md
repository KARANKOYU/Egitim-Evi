# Yazı düzenleyici · Kalın

**Durum:** Tasarlandı — henüz kodda yok (Tasarım 1 önizlemesinde çalışır).

Seçili yazıyı ya da bundan sonra yazacağını kalın yapan, yeniden basınca kalınlığı kaldıran düğme.

## Ne işe yarar

Bir açıklamada önemli yeri öne çıkarmak için: "**sayfa 42–45** arasındaki alıştırmaları çöz" gibi. Kullanıcı 1 Ekim'de
"features da klasörlü olabilir … yazı yazma içinde bold italic gibi her şeyin olduğu" diyerek bu klasörün örneğini kalın ve
italikle verdi.

## Nereden açılır

Araç çubuğunun "Yazı biçimi" grubunun ilk düğmesi: kalın **B**, ipucu **"Kalın (Ctrl+B)"** ([Araç çubuğunun düzeni](arac-cubugu.md)).

## Adım adım

### Bugün (kodda)

Yok; bugün yazı düz metindir. Yıldızla (`*böyle*`) yazarsan yıldızlar olduğu gibi görünür.

### Yazan herkes (öğrenci dahil, tasarım)

1. Kalın yapmak istediğin yazıyı seç.
2. **Kalın**'a bas ya da Ctrl+B'ye (Mac'te Cmd+B). Seçili yazı kalınlaşır, düğme koyu görünür.
3. Hiçbir şey seçmeden basarsan bundan sonra yazacağın yazı kalın çıkar; yeniden basınca kalın biter.
4. Kalın bir yazıyı seçip yeniden basarsan kalınlık kalkar.
5. İmleç kalın bir yazının içindeyken düğme koyu görünür; böylece neyin kalın olduğunu anlarsın.
6. Kalını italik, altı çizili, üstü çizili, renk ve sarı vurguyla birlikte kullanabilirsin.

### Okuyan herkes

Yazı kalın görünür. Başlıklar zaten kalındır ([Başlıklar](basliklar.md)).

## Kurallar ve sınırlar

- HTML'de `<b>` ya da `<strong>` (ikisi de izinli). </> ile yazarken bunları kullanabilirsin; nitelik eklenemez
  (ör. `<b class="x">` düz metin olur) ([İzinli ve izinsiz kod](izinli-ve-izinsiz-kod.md)).
- Tarayıcının kendi ürettiği biçim (ör. `font-weight` taşıyan bir `span`) kayıtta `<b>`'ye çevrilir; sunucuya yalın biçim gider.
- Word ya da Google Docs'tan yapıştırılan kalın yazı kalın kalır (kalın etiketi ya da 600–900 ağırlık, "bold", "bolder")
  ([Yapıştırma](yapistirma.md)).
- Kısayol Ctrl+B tanımın kendi sözüdür ("Ctrl+Z/Y/B/I/U").

## Kardeşler ve ilgili

**Kardeşler:** [İtalik](italik.md) · [Altı çizili](alti-cizili.md) · [Üstü çizili](ustu-cizili.md) · [Renkler](renkler.md) ·
[Başlıklar](basliklar.md) · [Klavye kısayolları](kisayollar.md).

**İlgili:** [Ödev verme](../odev/odev-verme.md), [Yeni mesaj](../mesaj/yeni-mesaj.md).

## Kod tarafı

Bugün kodda yok. Kodlanınca düzenleyicinin ön yüz parçasında ve sunucudaki izin listesinde (`b`, `strong`); Durum satırı güncellenir.

## Sık sorulanlar

- **Bütün yazıyı kalın yapabilir miyim?** Evet; hepsini seç (Ctrl+A) ve Kalın'a bas. Ama öne çıkarmak istediğin yer azsa etkisi daha
  iyidir.

## Sırada

- Düzenleyiciler (iş 15, onaylı).
