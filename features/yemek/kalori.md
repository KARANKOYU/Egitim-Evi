# Yemek listesi · Kalori

**Durum:** Kodda var

Bir günün menüsünün toplam enerjisini (kcal) isteğe bağlı olarak yazma ve gün kartının altında gösterme.

## Ne işe yarar

Bazı okullar menüyle birlikte günün kalorisini de duyurur; veli ve öğrenci "bugünkü öğle yemeği kaç kalori" diye bakar. Kalori
zorunlu değil: yazılmazsa kartta hiç görünmez.

## Nereden açılır

- **Yazmak:** [Bu haftayı düzenle](menuyu-duzenleme.md) penceresinde her günün sağındaki **"Kalori"** kutusu (yer tutucu "kcal").
  Telefonda kutu menü kutusunun altına iner.
- **Görmek:** [Haftanın yemek listesi](yemek-listesi.md) sayfasında gün kartının en altında, ör. **"650 kcal"**.

Tasarımda (Tasarım 1 önizlemesi): yemek sayfasında ve düzenleme penceresinde kalori yok. Kullanıcı kaloriyi kaldır demedi; 2 Ekim'de
onayladığı karara göre üzerine yorum yapmadığı ekranlar bugünkü siteye benzer, bu yüzden bugünkü kalori kutusu ve "kcal" satırı
kalır.

## Adım adım

### Müdür

1. "Yemek Listesi" → **"Bu haftayı düzenle"**.
2. Menüsünü yazdığın günün **"Kalori"** kutusuna tam sayı yaz (ör. 650).
3. Kaloriyi kaldırmak için kutuyu boşalt.
4. **"Kaydet"**. Kartın altında "650 kcal" görünür.

### Öğretmen

"Yemek listesini düzenler" yetkin varsa ([nasıl verilir](duzenleme-yetkisi.md)) müdürle aynı adımlar. Yetkin yoksa kaloriyi
yalnız kartta görürsün.

### Çalışan

Bugün kodda ek rollü öğretmen gibi: rolünde düzenleme yetkisi varsa yazar, yoksa yalnız görür. Tasarımda görev verilmiş çalışan
için de aynı; rolsüz çalışan yemek listesini görmez.

### Öğrenci

Gün kartının en altında "… kcal" satırına bak. Satır yoksa o gün için kalori girilmemiştir.

### Veli

Öğrenciyle aynı; çocuğunun okulunun kartlarında görürsün ([Çocukların okullarının menüsü](cocuklarin-okullari.md)).

## Kurallar ve sınırlar

- **Tam sayı, 1–5000.** Kutu sayı kutusudur; sayı olmayan bir şey kaydedilmez.
- **Uyarısız boş sayılanlar:** 0, 5000'den büyük sayı ya da okunamayan değer kaydedilmez; uyarı çıkmaz, kartta "kcal" satırı
  görünmez. Kutunun 1–5000 sınırı tarayıcıda da uyarı vermez (kayıt bir form gönderimi değil).
- **Ondalık:** tam sayıya indirilir, küsurat atılır (650.7 → 650).
- **Menüsüz gün:** menüsü boş bırakılan günün kalorisi saklanmaz; gün kalorisiyle birlikte silinir.
- **Birim:** her zaman kilokalori; ekranda sayının yanına "kcal" yazılır.
- **Kim yazar, kim görür:** [Bu haftayı düzenle](menuyu-duzenleme.md) ve [Haftanın yemek listesi](yemek-listesi.md) ile aynı.

## Kardeşler ve ilgili

**Kardeşler** (aynı klasör, [Yemek listesi](README.md)):

- [Bu haftayı düzenle](menuyu-duzenleme.md) — kalori kutusunun bulunduğu pencere.
- [Haftanın yemek listesi](yemek-listesi.md) — "kcal" satırının göründüğü kartlar.
- [Hafta gezgini](hafta-gezgini.md), [Çocukların okullarının menüsü](cocuklarin-okullari.md),
  ["Yemek listesini düzenler" yetkisi](duzenleme-yetkisi.md).

**İlgili:**

- [Kapalı bölüm ne olur](../ozellikler/kapali-bolum.md) — bölüm kapanınca kalori de görünmez, silinmez.

## Kod tarafı

- Ön yüz: [public/js/parcalar/19c-okul-hayati.md](../../public/js/parcalar/19c-okul-hayati.md) — pencerede
  `input.yKalori` (`type="number" min="1" max="5000"`, yer tutucu "kcal"); kartta `y.kalori + ' kcal'` (`.alt` satırı), değer
  yoksa satır çizilmez.
- Sunucu: [sunucu/bolumler/okul-hayati.md](../../sunucu/bolumler/okul-hayati.md) — `POST /api/yemek`: `parseInt`, 1–5000 değilse
  `null`; `GET /api/yemek` kaloriyi yoksa 0 döner.
- Tablo: `yemek_listesi.kalori` (`smallint`, `CHECK 1–5000`, boş olabilir; şema 007 —
  [SEMA.md](../../sunucu/veri/sema/SEMA.md)); depo [sunucu/veri/depo/okul-hayati.md](../../sunucu/veri/depo/okul-hayati.md).
- Test: [testler/test-okul-hayati.md](../../testler/test-okul-hayati.md) — "650" metni sayı olarak 650 saklanır.

## Sık sorulanlar

- **Kalori zorunlu mu?** Hayır; boş bırakabilirsin.
- **6000 yazdım, kartta görünmüyor.** Sınır 5000; üstü uyarısız boş sayılır.
- **Her yemeğin kalorisini ayrı yazabilir miyim?** Hayır; günde tek bir toplam kalori var. İstersen yemeğin satırına yazabilirsin
  (ör. "Tavuk sote (320 kcal)"), ama bu yalnız metindir.

## Sırada

- Çok dil: "Kalori" ve "kcal" çeviri kataloğuna girecek.
- Planlı başka değişiklik yok.
