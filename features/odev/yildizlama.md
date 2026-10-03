# Ödevler · Yıldızlama

**Durum:** Kodda var; tasarımda ek olarak Tasarım 1 önizlemesinde öğretmenin ve velinin ödev listesinde de yıldız düğmesi ve "Yıldız" süzgeci var (kimin yıldızı olduğu kararlaştırılmadı).

Öğrencinin önemli bulduğu ödevi satırdaki yıldızla işaretlemesi ve "Yıldız" süzgeciyle yalnız yıldızlıları ya da yıldızsızları görmesi; yıldız yalnız öğrencinin kendisi içindir.

## Ne işe yarar

Kullanıcı 26 Eylül'de istedi: "ödev yıldızlama öğrencilerde ve yıldızlanmış, yıldızlanmamış filtresi kendileri için". 2 Ekim'deki
liste kararında üçüncü süzgeç "yıldızlı / yıldızsız" ve "hepsinde bu düzen". Öğrenci zor ya da önemli ödevi işaretleyip
kalabalık listede ayırır; öğretmen, veli ya da müdür bu işareti görmez.

## Nereden açılır

- **Öğrenci:** "Ödevler" listesinde her satırın solundaki **yıldız düğmesi**; süzgeç kartındaki **"Yıldız"** alanı.
- Ana sayfadaki "Yaklaşan ödevler" satırlarında da yıldız düğmesi çizilir (bilinen açığa bak).

## Adım adım

### Öğrenci

1. Ödev satırının solundaki boş yıldıza bas (üzerine gelince **"Yıldızla"**). Yıldız sarıya dolar; üzerine gelince **"Yıldızı
   kaldır"**.
2. Yıldıza basmak ödevi açmaz; yalnız yıldızı değiştirir (satırın kendisine basmak ödevi açar).
3. İstek sürerken düğme kısa bir an soluklaşır; bir hata olursa yıldız değişmez ve ileti çıkar.
4. Süzgeç kartında **"Yıldız"** → **"Yıldızlı"** yalnız yıldızladıklarını, **"Yıldızsız"** yıldızsızları gösterir; **"Hepsi"**
   hepsini. Yıldız süzgeci seçiliyken bir yıldızı değiştirirsen liste hemen yeniden süzülür.
5. Yıldızlar kalıcıdır: çıkıp girince, başka cihazda da durur.

### Veli, öğretmen, müdür (bugünkü site)

Yıldızı görmezler ve değiştiremezler. Velinin ya da müdürün öğrencinin portalından baktığı "Ödevleri"nde yıldız düğmesi ve
"Yıldız" süzgeci çıkmaz.

### Tasarımda (Tasarım 1 önizlemesi)

- Satırın sağında, durum etiketinin solunda yıldız düğmesi ("Yıldızla" / "Yıldızı kaldır"); basınca **"Yıldızlandı."** ya da
  **"Yıldız kaldırıldı."** iletisi.
- Süzgeç **"Yıldız"**: "Hepsi", "Yıldızlı", "Yıldızsız" ([Süzgeçler](suzgecler.md)).
- Önizlemede yıldız düğmesi ve süzgeç **öğretmenin** ve **velinin** listesinde de var. Kullanıcının 26 Eylül sözü yıldızı
  öğrenciler için "kendileri için" istedi; 2 Ekim'de ise liste düzenini "hepsinde bu düzen" dedi. Öğretmenin ve velinin
  yıldızının o kişinin kendi işareti mi olacağı (öğrencinin yıldızından ayrı) kararlaştırılmadı; kodlanmadan önce sorulmalı.

## Kurallar ve sınırlar

- **Yalnız öğrenci yıldızlar:** başkası denerse **"Ödevi yalnızca öğrenci yıldızlayabilir."**; ödev o öğrenciye verilmemişse
  **"Ödev bulunamadı"**; istek bozuksa **"Yıldız açık mı kapalı mı belli değil."**
- **Kişiye özel:** yıldız yalnız o öğrencinin o ödevdeki işaretidir; öğrencinin ödev bilgisinde yıldız yalnız kendisi bakarken
  gelir (veli ve öğretmenin ekranına hiç gitmez).
- **Ödev silinince** yıldız da gider.
- **Bilinen açık:** ana sayfadaki "Yaklaşan ödevler" satırlarının yıldızı, o oturumda "Ödevler" sayfası hiç açılmadıysa basınca
  bir şey yapmaz ([Ödev listesi](liste.md)).
- **Sınav, mesaj gibi başka yerlerde** yıldız yok; bu yıldız yalnız ödevler için.

## Kardeşler ve ilgili

**Kardeşler:** [Ödev listesi](liste.md) · [Süzgeçler](suzgecler.md) · [Ödevlerde arama](arama.md) · [Açıldı / açılmadı](acilma-bilgisi.md).

**İlgili:** [Öğrencinin ana sayfası](../ana-sayfa/ogrenci-ana-sayfasi.md), [Kaydedilenler (eğitim içerikleri)](../egitim-icerikleri/kaydedilenler.md)
(benzer kişisel işaret), [Mesaj etiketleri](../mesaj/etiketler.md).

## Kod tarafı

- Ön yüz: [public/js/parcalar/14-odev-filtre.md](../../public/js/parcalar/14-odev-filtre.md) — `odevYildizliMi` (yalnız
  öğrencinin kendisi, portal değil), `odevListesiOgrenci` (`.yildiz-btn`, `aria-pressed`, "Yıldızla" / "Yıldızı kaldır"),
  `EYLEMLER['odev-yildiz']` (`POST /api/assignments/<id>/yildiz { yildiz }`), "Yıldız" süzgeci `odevFiltreCubugu`.
- Sunucu: [sunucu/bolumler/odev.md](../../sunucu/bolumler/odev.md) — `POST …/yildiz`; [sunucu/bolumler/ilerleyis.md](../../sunucu/bolumler/ilerleyis.md)
  (`yildizli` yalnız `kendisi` iken).
- Depo ve şema: [sunucu/veri/depo/odevler.md](../../sunucu/veri/depo/odevler.md) — `yildizla`, `yildizlilari`
  (`odev_ogrencileri.yildiz`, şema 017, [SEMA.md](../../sunucu/veri/sema/SEMA.md)).
- Görünüm: `public/css/parcalar/25-grafik-sinav.css` (`.yildiz-btn`, `.yildiz-btn.on`).
- Testler: [testler/test-odev-saat.md](../../testler/test-odev-saat.md) (yıldız).
- Kullanıcıya dönük anlatım: [belge/KILAVUZ.md](../../belge/KILAVUZ.md) ("Filtreleme ve arama" → "Yıldız").

## Sık sorulanlar

- **Öğretmenim yıldızladığım ödevleri görür mü?** Hayır; yıldız yalnız senin içindir.
- **Velim yıldızlayabilir mi?** Bugün hayır.
- **Yıldız kayboldu.** Ödev silinmiş olabilir; başka bir şey yıldızı kaldırmaz.

## Sırada

- Ödev listesi düzeni: yıldız düğmesi satırın sağına taşınacak; öğretmen ve velide yıldızın kimin olacağı sorulacak.
