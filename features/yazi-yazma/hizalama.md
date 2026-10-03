# Yazı düzenleyici · Hizalama (sola, ortala, sağa, iki yana)

**Durum:** Tasarlandı — henüz kodda yok (Tasarım 1 önizlemesinde çalışır).

Paragrafı, başlığı ya da liste maddesini sola, ortaya, sağa ya da iki yana yaslayan dört düğme.

## Ne işe yarar

Kullanıcı ilk örneği onaylarken bunu özellikle istedi: "onaylıyorum, geri al yinele ve hizalama da olsun" (1 Ekim). Başlığı
ortalamak, bir imzayı ("Okul Müdürlüğü") sağa yaslamak, uzun bir paragrafı iki yana yaslamak için.

## Nereden açılır

Araç çubuğunun "Hizalama ve girinti" grubunun ilk dört düğmesi ([Araç çubuğunun düzeni](arac-cubugu.md)):

| Düğme | İpucu |
|---|---|
| sola dayalı satırlar | **"Sola yasla (Ctrl+Shift+L)"** |
| ortalı satırlar | **"Ortala (Ctrl+Shift+E)"** |
| sağa dayalı satırlar | **"Sağa yasla (Ctrl+Shift+R)"** |
| eşit satırlar | **"İki yana yasla (Ctrl+Shift+J)"** |

## Adım adım

### Bugün (kodda)

Yok; bugün her yazı sola dayalıdır.

### Yazan herkes (öğrenci dahil, tasarım)

1. İmleci paragrafa koy (seçmen gerekmez) ya da birkaç paragrafı seç.
2. Hizalama düğmelerinden birine bas. Seçimin dokunduğu her paragraf (başlık ve liste maddesi dahil) o yana yaslanır.
3. Etkin hizalamanın düğmesi koyu görünür; dördünden yalnız biri koyudur.
4. Sola dönmek için **Sola yasla**'ya bas (yazının olağan hâli).
5. Fotoğraf bir paragrafın içinde durduğu için o paragrafı ortalarsan fotoğraf da ortalanır ([Fotoğraf ekle](fotograf-ekle.md)).

### Okuyan herkes

Yazı yazanın yasladığı gibi görünür; iki yana yaslı paragrafta satırlar iki kenara da dayanır.

## Kurallar ve sınırlar

- HTML'de paragraf, başlık ya da maddenin `style="text-align: …"` niteliği; izinli değerler yalnız `left`, `center`, `right`,
  `justify`. Sola yaslama olağan hâl olduğu için kayıtta nitelik hiç yazılmaz. Başka bir değer (ör. `start`) ya da başka bir
  etiketteki hizalama o etiketi düz metne çevirir ([İzinli ve izinsiz kod](izinli-ve-izinsiz-kod.md)).
- Hizalama satırın bir kısmına değil, bütün paragrafa uygulanır.
- Yapıştırılan yazının ortalı, sağa ve iki yana hizası korunur ([Yapıştırma](yapistirma.md)).
- Kısayollar önizlemenindir; tanımın kısayol listesinde yok. **Ctrl+Shift+R** ve **Ctrl+Shift+J** bazı tarayıcılarda başka iş
  yapar (sayfayı zorla yenileme, geliştirici araçları); kodlanırken denenmeli ([Klavye kısayolları](kisayollar.md)).
- **Sağdan sola yazılan diller** (çok dil işinde Arapça planlı) için düzenleyicinin yönü ve "sola/sağa yasla"nın anlamı tanımda
  yazmıyor ([Sağdan sola](../dil/sagdan-sola.md)).

## Kardeşler ve ilgili

**Kardeşler:** [Girinti](girinti.md) · [Başlıklar](basliklar.md) · [Madde listesi](madde-listesi.md) ·
[Numaralı liste](numarali-liste.md) · [Klavye kısayolları](kisayollar.md).

**İlgili:** [Okul sayfası · Tanıtım ve fotoğraflar](../okul-sayfasi/tanitim-ve-fotograflar.md),
[Dil ve çeviri · Sağdan sola](../dil/sagdan-sola.md).

## Kod tarafı

Bugün kodda yok. Kodlanınca düzenleyicinin ön yüz parçasında ve sunucudaki izin listesinde (`text-align`); Durum satırı güncellenir.

## Sık sorulanlar

- **Yalnız bir kelimeyi ortalayabilir miyim?** Hayır; hizalama bütün paragrafa uygulanır. O kelimeyi ayrı bir paragrafa al.

## Sırada

- Düzenleyiciler (iş 15, onaylı).
- Çok dil (iş 22): sağdan sola dillerde düzenleyicinin davranışı.
