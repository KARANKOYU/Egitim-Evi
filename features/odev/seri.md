# Ödevler · Ödev serisi

**Durum:** Kodda var; tasarımda ek olarak uyarı ve "bozuldu" şeridi seriyi bozan ödevin dersini, adını ve sonucunu da yazar ("… ödevin “Yapmadı” olarak sonuçlandı.") (Tasarım 1 önizlemesi).

Öğrenciyi teşvik için, sonuçlanan ödevlerinde arka arkaya kaç kez "Yaptı" aldığını gösteren şerit; "Yaptı" dışında bir sonuç uyarı verir, arka arkaya ikincisi seriyi bozar.

## Ne işe yarar

Kullanıcı 26 Eylül'de istedi: "seri şeyi öğrenci için: girince üstte … ödev yapma serisi; eğer yaptı dışında alırsan seri
bozulma uyarısı gelir; art arda iki kere yaptı almazsan seri bozulur; teşvik için". Seri yalnız öğrencinin kendisine
görünür, kimseyle karşılaştırılmaz.

## Nereden açılır

- **Öğrencinin ana sayfası:** karşılama başlığının hemen altında (okulda "Ödevler" bölümü açıksa).
- **Öğrencinin "Ödevler" sayfası:** başlığın altında, süzgeçlerin üstünde.

Veli, öğretmen ve müdür seriyi görmez (çocuğun portalında da çıkmaz).

## Adım adım

### Öğrenci

1. İlk ödevin sonuçlanana kadar şerit görünmez.
2. Şeridin solunda alev simgesi, yanında büyük sayı ve altında **"ödev serin"**; sağında yazı:
   - **Seri sürüyorsa** (yeşil): **"Arka arkaya 4 ödevi yaptın. Böyle devam!"**
   - **Son ödevin "Yaptı" olmadıysa** (uyarı rengi): **"Dikkat! Son ödevin "Yaptı" olmadı. Bir sonrakini de yapmazsan serin
     bozulur."** Sayı korunur.
   - **Arka arkaya iki ödevden "Yaptı" alamadıysan** (bozuk): **"Serin bozuldu: arka arkaya iki ödevden "Yaptı" alamadın. Bir
     sonraki ödevi yaparak yeniden başla."** Sayı 0'a iner.
3. En uzun serin şu anki seriden büyükse altında küçük yazı: **"En uzun serin: 7"**.
4. Bir sonraki ödevden "Yaptı" alınca uyarı ya da bozukluk kalkar, sayı yeniden artmaya başlar.

### Tasarımda (Tasarım 1 önizlemesi)

- Seri sürüyorsa: **"N ödev yapma serisi"**, altında **"En uzun serin: N ödev"**.
- Uyarıda (önizlemedeki örnek öğrencinin şeridi): **"8 ödev yapma serisi · Dikkat"**, altında **"Fen Bilimleri · Konu özeti —
  2. bölüme kadar ödevin “Yapmadı” olarak sonuçlandı. Bir sonraki ödevi de yapmazsan serin bozulur. En uzun serin: 8 ödev."**
- Bozulunca: **"Serin bozuldu"**, altında **"Arka arkaya iki ödevden “Yaptı” alamadın. <ders · ödev> ödevin “<sonuç>” olarak
  sonuçlandı. Bir sonraki ödevi yaparak yeniden başla. En uzun serin: N ödev."** (seriyi bozan son ödev ve sonucu).
- Önizlemede sonuçlar açıklandıkları ana göre sıralanır; bugünkü kodda ödevlerin son teslim anına göre (aşağıda).

## Kurallar ve sınırlar

- **Sayılanlar:** yalnız sonuçlanmış ve sana bir sonuç girilmiş ödevler. Aktif ödevler ve "Değerlendirilmedi" kalanlar seriyi
  etkilemez.
- **Sıra:** ödevin son teslim anı (son tarihsiz ödevde veriliş anı); eskiden yeniye.
- **Kural:** "Yaptı" seriyi bir artırır ve kaçırma sayacını sıfırlar. "Yaptı" dışındaki **her** sonuç — "Geç yaptı", "Eksik",
  "Yapmadı", "Gelmedi (izinli)", "Gelmedi (izinsiz)" — bir kaçırmadır. Tek kaçırma uyarıdır; arka arkaya ikinci kaçırma seriyi
  0'a indirir.
- **En uzun seri** bütün geçmişteki en yüksek sayıdır.
- **Yıl:** seri, yıl seçicide bakılan eğitim yılının ödevlerinden hesaplanır.
- **Sonuç değişince** seri yeniden hesaplanır (öğretmen "Yapmadı"yı "Yaptı" yaparsa seri düzelir).
- **Bilinen açık:** ilk (ya da tek) sonuçlanmış ödevin "Yaptı" değilse şerit yeşil görünür ve **"0 ödev serin — Arka arkaya 0
  ödevi yaptın. Böyle devam!"** yazar (uyarı ancak seri 1 ya da daha büyükken verilir). Öneri: seri 0 iken şeridi çizmemek ya
  da "Bir ödevi yaparak serine başla" demek.
- **Okulda Ödevler kapalıysa** şerit çıkmaz.

## Kardeşler ve ilgili

**Kardeşler:** [Sonuçlandırma](sonuclandirma.md) · [Sonuçları düzeltme ve tekrar açma](sonuclari-duzeltme.md) ·
[Ödev listesi](liste.md) · [Ödev hatırlatmaları](hatirlatmalar.md).

**İlgili:** [Öğrencinin ana sayfası](../ana-sayfa/ogrenci-ana-sayfasi.md), [İlerleyişim](../ilerleyis/ilerleyisim.md),
[Ödev grafiği](../ilerleyis/odev-grafigi.md), [Başarılarım](../basarilar/basarilarim.md) (öğrenciyi teşvik eden öbür bölüm).

## Kod tarafı

- Sunucu: [sunucu/bolumler/ilerleyis.md](../../sunucu/bolumler/ilerleyis.md) — `odevSerisi(odevler, ogrenciId)` (`{ sayi,
  enUzun, uyari, bozuldu, toplam }`), `/api/progress` cevabında `seri` yalnız öğrencinin kendisine.
- Ön yüz: [public/js/parcalar/14-odev-filtre.md](../../public/js/parcalar/14-odev-filtre.md) — `seriSeridi` (üç hâl, metinler,
  "En uzun serin"); [08-ana-sayfa.md](../../public/js/parcalar/08-ana-sayfa.md) (öğrencinin ana sayfası, `ozellikAcik('odev')`).
- Testler: [testler/test-siniflarim.md](../../testler/test-siniflarim.md) ("Ödev serisi": "Yaptı" ile başlayan dizi, uyarı,
  bozulma; ilk sonucun "Yaptı" olmadığı durum denenmiyor).
- Kullanıcıya dönük anlatım: [belge/KILAVUZ.md](../../belge/KILAVUZ.md) ("Ödev serisi").

## Sık sorulanlar

- **"Gelmedi (izinli)" serimi bozar mı?** Bugünkü kurala göre bir kaçırma sayılır; arka arkaya ikinci kaçırmada seri bozulur.
- **Velim serimi görür mü?** Hayır; seri yalnız sana görünür.
- **Ödevi yaptım ama seri artmadı.** Öğretmen ödevi henüz sonuçlandırmamış olabilir; seri sonuçlanmış ödevlerden hesaplanır.

## Sırada

- Tasarımdaki şerit metni (seriyi bozan ödevin adıyla).
- Seri 0 iken yanlış "Böyle devam!" açığının düzeltilmesi (tam debug işi).
- Android uygulaması: öğrencinin ana sayfasına ödev serisi şeridi gelecek.
