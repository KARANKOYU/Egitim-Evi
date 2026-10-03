# Yazı düzenleyici · Altı çizili

**Durum:** Tasarlandı — henüz kodda yok (Tasarım 1 önizlemesinde çalışır).

Seçili yazının altını çizen, yeniden basınca çizgiyi kaldıran düğme.

## Ne işe yarar

Bir yeri vurgulamak için. Kullanıcı site duyurusunu ilk isterken de "altı çizili, renkli, editörlü olsun" demişti; altı çizili
o günden beri her düzenleyici listesinde var.

## Nereden açılır

"Yazı biçimi" grubunun üçüncü düğmesi: altı çizili U, ipucu **"Altı çizili (Ctrl+U)"** ([Araç çubuğunun düzeni](arac-cubugu.md)).

## Adım adım

### Bugün (kodda)

Yok; bugün yazı düz metindir.

### Yazan herkes (öğrenci dahil, tasarım)

1. Altını çizmek istediğin yazıyı seç.
2. **Altı çizili**'ye bas ya da Ctrl+U'ya (Mac'te Cmd+U). Düğme koyu görünür.
3. Seçmeden basarsan sonra yazacağın yazının altı çizilir; yeniden basınca biter.
4. Altı çizili yazıyı seçip yeniden basarsan çizgi kalkar.

### Okuyan herkes

Yazının altında çizgi görünür.

## Kurallar ve sınırlar

- HTML'de `<u>`; nitelik eklenemez ([İzinli ve izinsiz kod](izinli-ve-izinsiz-kod.md)).
- Tarayıcının ürettiği `text-decoration: underline` taşıyan `span` kayıtta `<u>`'ya çevrilir; Word ya da Docs'tan gelen altı çizili
  yazı altı çizili kalır ([Yapıştırma](yapistirma.md)).
- **Bağlantılarla karışabilir:** okurken bağlantılar da mavi ve altı çizili görünür ([Bağlantı ekle](baglanti-ekle.md)). Okuyan
  altı çizili yazıyı bağlantı sanıp tıklayabilir; bağlantı olmayan bir yeri mavi ve altı çizili yapmamak iyi olur.
- Kısayol Ctrl+U tanımın kendi sözüdür. Önizleme bu tuşu tarayıcının kendi düzenleme komutuna bırakıyor. Bazı tarayıcılarda
  Ctrl+U sayfanın kaynağını da açabildiği için kodlanırken bütün tarayıcılarda denenmeli.

## Kardeşler ve ilgili

**Kardeşler:** [Kalın](kalin.md) · [İtalik](italik.md) · [Üstü çizili](ustu-cizili.md) · [Bağlantı ekle](baglanti-ekle.md) ·
[Renkler](renkler.md) · [Klavye kısayolları](kisayollar.md).

**İlgili:** [Site yönetimi · Site duyurusu](../yonetim/site-duyurusu.md).

## Kod tarafı

Bugün kodda yok. Kodlanınca düzenleyicinin ön yüz parçasında ve sunucudaki izin listesinde (`u`); Durum satırı güncellenir.

## Sık sorulanlar

- **Altını çizdiğim yazı bağlantı mı oldu?** Hayır; bağlantı yalnız "Bağlantı ekle" ile olur. Okurken bağlantının rengi mavidir.

## Sırada

- Düzenleyiciler (iş 15, onaylı).
