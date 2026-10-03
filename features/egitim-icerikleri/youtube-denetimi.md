# Eğitim içerikleri · YouTube'dan kalkan videonun silinmesi

**Durum:** Tasarlandı — henüz kodda yok

Sunucu her YouTube videosunu belli aralıkla (varsayılan günde bir) YouTube'a sorar; video iki art arda denetimde kaldırılmış, gizli ya da
gömmesi kapalı çıkarsa Eğitim içeriklerindeki kaydı ve küçük resmi silinir, eğitmene bildirim gider.

## Ne işe yarar

Kullanıcının 28 Eylül sözü: "YouTube'dan kaldırılmışsa kaydı da silinsin, oradan baksın, günde 1 ya da admin panelinden config ile".
Listelerde açılmayan ölü videolar birikmez.

## Nereden açılır

- **Eğitmen:** Videolarım'da videonun durumu **"YouTube'dan kaldırılmış"**; ana sayfadaki "Dikkat" kutusu ve zil
  ([Videolarım](videolarim.md), [Eğitmen paneli](egitmen-paneli.md)).
- **Yönetici:** `/panel/admin` site ayarlarında **"YouTube denetim aralığı"** ([Site ayarları](../yonetim/site-ayarlari.md)).

## Adım adım

### Sunucu (kendiliğinden)

1. Zamanlayıcı her YouTube videosunu YouTube oEmbed ile yoklar (istekler yayılır, saniyede en çok 1).
2. Cevap **404** (kaldırılmış) ya da **401/403** (gizli ya da gömme kapalı) ise bir "başarısız" sayılır.
3. **İki art arda** denetimde başarısızsa: kayıt ve Eğitim Evi'ndeki küçük resim silinir, eğitmene bildirim gider (**"YouTube'da
   kaldırıldığı için Eğitim içeriklerinden de kaldırıldı"**), işlem kayda geçer.
4. **Ağ hatası / YouTube'a erişilemiyor** sayılmaz: hiçbir şey silinmez.

### Eğitmen

1. İlk başarısız denetimden sonra Videolarım'da videonun durumu kırmızı **"YouTube'dan kaldırılmış"**, altında "YouTube bağlantısı artık
   açılmıyor; video yarın listeden silinir."; küçük resim soluk, ortasında **"Açılmıyor"**; "Düzenle" yok, **"Videomu kaldır"** var.
2. Ana sayfanın "Dikkat" kutusunda: videonun adı, "YouTube'dan kaldırılmış · yarın silinecek", **"Bak"**; zilde **"Bir videon YouTube'dan
   kaldırılmış"** (videonun adı · "yarın silinecek").
3. YouTube'da videoyu geri açarsan (gizliliği "Herkese açık" ya da "Liste dışı", gömme açık) bir sonraki denetim başarılı olur ve video
   kalır.
4. Düzeltmezsen ikinci denetimde silinir ve bildirim gelir.

### Yönetici

Site ayarlarında **"YouTube denetim aralığı"**nı değiştirir (varsayılan 24 saat, en az 1 saat).

### İzleyen (herkes)

Silinen video listeden ve aramadan kalkar; kişisel listelerde ve serilerde **"Bu video kaldırıldı"** satırı kalır.

## Kurallar ve sınırlar

- **Aralık:** site ayarı "YouTube denetim aralığı", varsayılan 24 saat, en az 1 saat; `/panel/admin` ayarlarından.
- **İki art arda** başarısızlık gerekir (geçici bir YouTube sorunu videoyu sildirmesin).
- **Silinen:** kayıt ve küçük resmin bizdeki kopyası. YouTube'daki video zaten YouTube'un.
- **Sayılmayan:** ağ hatası, zaman aşımı, YouTube'a erişememe.
- **Hız:** saniyede en çok bir istek, istekler aralığa yayılır.
- Tasarım 1'deki "yarın silinir" yazısı varsayılan 24 saatlik aralığa göredir; aralık değişince yazı da ona göre olmalı.

## Kardeşler ve ilgili

**Kardeşler** (aynı klasör, [Eğitim içerikleri](README.md)):

- [YouTube bağlantısı](youtube-baglantisi.md) — denetlenen videolar.
- [Videolarım](videolarim.md), [Eğitmen paneli](egitmen-paneli.md) — uyarının göründüğü yerler.
- [Sınırlar ve site ayarları](sinirlar-ve-ayarlar.md) — aralık ayarı.
- [Oynatma listeleri](oynatma-listeleri.md) — "Bu video kaldırıldı" satırı.

**İlgili:**

- [Site ayarları](../yonetim/site-ayarlari.md), [İşlem kaydı](../islem-kaydi/README.md), [Bildirim türleri ve metinleri](../bildirim/bildirim-metinleri.md).

## Kod tarafı

Bugün kodda yok. Kodlanınca kullanacağı bugünkü parçalar:

- Belli aralıkla çalışan işler (zamanlayıcı kalıbı): [sunucu/index.md](../../sunucu/index.md), [sunucu/hatirlatma.md](../../sunucu/hatirlatma.md).
- Site ayarı: [sunucu/bolumler/site-ayarlari.md](../../sunucu/bolumler/site-ayarlari.md), [sunucu/veri/depo/site-ayarlari.md](../../sunucu/veri/depo/site-ayarlari.md).
- Dış istek kapısı (testlerde `EE_DIS_ISTEK=0`): [sunucu/uygulama-surum.md](../../sunucu/uygulama-surum.md).

## Sık sorulanlar

- **Videom "YouTube'dan kaldırılmış" diyor ama YouTube'da duruyor.** Gizli yapılmış ya da gömmesi kapatılmış olabilir; YouTube'da
  "Liste dışı" ya da "Herkese açık" yap ve gömmeye izin ver.
- **İnternet gitti, videolarım silinir mi?** Hayır; ağ hatası sayılmaz.

## Sırada

- Eğitim içerikleri (iş 17): YouTube denetimi zamanlayıcısı ve site ayarı.
