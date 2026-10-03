# Yazı düzenleyici · Madde listesi

**Durum:** Tasarlandı — henüz kodda yok (Tasarım 1 önizlemesinde çalışır).

Paragrafları başında nokta olan bir madde listesine çeviren, yeniden basınca normal paragrafa döndüren düğme.

## Ne işe yarar

"Getirilecekler", "Yapılacaklar" gibi sırası önemli olmayan şeyleri alt alta, okunaklı yazmak için. Önizlemedeki örnek ödev
açıklaması böyle: "Her işlemi adım adım yaz." ve "Sonucu sadeleştir." iki madde.

## Nereden açılır

Araç çubuğunun "Listeler" grubunun ilk düğmesi: noktalı satırlar, ipucu **"Madde listesi (Ctrl+Shift+8)"**
([Araç çubuğunun düzeni](arac-cubugu.md)).

## Adım adım

### Bugün (kodda)

Yok; bugün satır başına elle "-" ya da "•" yazılır, düz metin olarak görünür.

### Yazan herkes (öğrenci dahil, tasarım)

1. İmleci bir satıra koy ya da birkaç satırı seç.
2. **Madde listesi**'ne bas. Her paragraf bir madde olur; düğme koyu görünür.
3. Maddenin sonunda Enter: yeni madde. Boş bir maddede Enter: listeden çıkılır, normal paragraf başlar (tarayıcının olağan davranışı).
4. Bir maddeyi alt maddeye çevirmek için **"Girintiyi artır"**a bas; liste içinde iç içe liste olur. **"Girintiyi azalt"** geri
   alır ([Girinti](girinti.md)).
5. Listenin içindeyken **"Numaralı liste"**ye basarsan liste numaralıya döner ([Numaralı liste](numarali-liste.md)).
6. Listeyi kaldırmak için listenin içindeyken **Madde listesi**'ne yeniden bas; maddeler normal paragraf olur.
7. Maddelerin içinde kalın, italik, renk, bağlantı kullanılabilir; madde de hizalanabilir.

### Okuyan herkes

Her maddenin başında nokta, solda boşluk (önizlemede 24 piksel girinti).

## Kurallar ve sınırlar

- HTML'de `<ul>` ve `<li>`; iç içe liste izinlidir (`<li>`'nin içinde `<ul>` ya da `<ol>`). Nitelik eklenemez; madde
  (`<li>`) yalnız hizalama ve girinti (`margin-left`, 40 pikselin 1–5 katı) taşıyabilir ([İzinli ve izinsiz kod](izinli-ve-izinsiz-kod.md)).
- Madde işaretinin şekli değiştirilemez (`<ul style="list-style: square">` gibi bir şey düz metin olur).
- Maddenin içinde başlık olmaz; önizleme kaydederken düz yazıya çevirir ([Başlıklar](basliklar.md)).
- Word ya da Docs'tan yapıştırılan gerçek listeler (iç içe olanlar dahil) liste olarak kalır. Word bazı listeleri gerçek liste
  değil, başında işaret karakteri olan paragraf olarak verebilir; o zaman paragraf olarak kalır ([Yapıştırma](yapistirma.md)).
- **Ctrl+Shift+8** önizlemenin kısayoludur; tanımın kısayol listesinde yok ([Klavye kısayolları](kisayollar.md)).

## Kardeşler ve ilgili

**Kardeşler:** [Numaralı liste](numarali-liste.md) · [Girinti](girinti.md) · [Hizalama](hizalama.md) ·
[Araç çubuğunun düzeni](arac-cubugu.md).

**İlgili:** [Ödev verme](../odev/odev-verme.md), [Toplantı açma](../toplanti/toplanti-acma.md) (gündem maddeleri).

## Kod tarafı

Bugün kodda yok. Kodlanınca düzenleyicinin ön yüz parçasında ve sunucudaki izin listesinde (`ul`, `li`); Durum satırı güncellenir.

## Sık sorulanlar

- **Listeden nasıl çıkarım?** Boş bir maddede Enter'a bas ya da liste düğmesine yeniden bas.
- **Alt madde nasıl yapılır?** Maddedeyken "Girintiyi artır".

## Sırada

- Düzenleyiciler (iş 15, onaylı).
