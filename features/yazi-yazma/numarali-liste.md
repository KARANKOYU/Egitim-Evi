# Yazı düzenleyici · Numaralı liste

**Durum:** Tasarlandı — henüz kodda yok (Tasarım 1 önizlemesinde çalışır).

Paragrafları 1, 2, 3 diye numaralanan bir listeye çeviren, yeniden basınca normal paragrafa döndüren düğme.

## Ne işe yarar

Sırası önemli adımları yazmak için: "1. Soruyu oku. 2. Verilenleri yaz. 3. Çöz." Numaralar kendiliğinden verilir; araya madde
eklersen ya da silersen yeniden sıralanır.

## Nereden açılır

"Listeler" grubunun ikinci düğmesi: 1, 2 numaralı satırlar, ipucu **"Numaralı liste (Ctrl+Shift+7)"**
([Araç çubuğunun düzeni](arac-cubugu.md)).

## Adım adım

### Bugün (kodda)

Yok; bugün numaralar elle yazılır, düz metin olarak görünür.

### Yazan herkes (öğrenci dahil, tasarım)

1. İmleci bir satıra koy ya da birkaç satırı seç.
2. **Numaralı liste**'ye bas. Her paragraf numaralı bir madde olur (1'den başlar); düğme koyu görünür.
3. Maddenin sonunda Enter: sıradaki numara. Boş maddede Enter: listeden çıkılır.
4. Alt adımlar için **"Girintiyi artır"** (iç içe liste); **"Girintiyi azalt"** geri alır ([Girinti](girinti.md)).
5. Listedeyken **"Madde listesi"**ne basarsan noktalı listeye döner ([Madde listesi](madde-listesi.md)).
6. Listeyi kaldırmak için listedeyken **Numaralı liste**'ye yeniden bas.

### Okuyan herkes

Maddeler 1., 2., 3. diye numaralı, solda boşlukla görünür.

## Kurallar ve sınırlar

- HTML'de `<ol>` ve `<li>`; iç içe liste izinli. **Numara her zaman 1'den başlar ve sayıyla yazılır:** `<ol start="5">` ya da
  `<ol type="a">` gibi nitelikler izin listesinde yok, o etiket düz metin olur ([İzinli ve izinsiz kod](izinli-ve-izinsiz-kod.md)).
- Madde yalnız hizalama ve girinti taşıyabilir; madde içinde başlık olmaz.
- Yapıştırılan numaralı listeler liste olarak kalır; numarası 1'den başlamayan bir liste yapıştırırsan 1'den yeniden numaralanır
  ([Yapıştırma](yapistirma.md)).
- **Ctrl+Shift+7** önizlemenin kısayoludur; tanımın kısayol listesinde yok ([Klavye kısayolları](kisayollar.md)).

## Kardeşler ve ilgili

**Kardeşler:** [Madde listesi](madde-listesi.md) · [Girinti](girinti.md) · [Hizalama](hizalama.md) ·
[Araç çubuğunun düzeni](arac-cubugu.md).

**İlgili:** [Ödev verme](../odev/odev-verme.md), [Quiz ekleme](../quiz/quiz-ekleme.md) (talimat adımları).

## Kod tarafı

Bugün kodda yok. Kodlanınca düzenleyicinin ön yüz parçasında ve sunucudaki izin listesinde (`ol`, `li`); Durum satırı güncellenir.

## Sık sorulanlar

- **Listeyi 3'ten başlatabilir miyim?** Hayır; numaralı liste hep 1'den başlar. Araya bir paragraf girince yeni liste yine 1'den
  başlar.

## Sırada

- Düzenleyiciler (iş 15, onaylı).
