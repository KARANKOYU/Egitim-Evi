# Eğitim içerikleri · Bildirilenler (eğitmen ve yönetim tarafı)

**Durum:** Tasarlandı — henüz kodda yok

"Bildir" ile gelen bildirimlerin gittiği yerler: eğitmen kendi videolarına gelenleri panelinin "Bildirilenler" sayfasında (bildireni
görmeden) okur; yönetici ve destek ekibi panellerindeki bildirim kuyruğunda videoyu kaldırır ya da bildirimi reddeder.

## Ne işe yarar

Kullanıcının 28 Eylül kabulü: "Bildir düğmesi var. Yönetici ya da destek kaldırır, işlem kayda geçer." Videolar ön onaysız yayına girdiği
için denetim bu kuyrukla yapılır; eğitmen de videosundaki sorunu (ses kesiliyor, altyazı kaymış) öğrenip düzeltir.

## Nereden açılır

- **Eğitmen:** panel → sol menü **"Bildirilenler"** (yeni bildirim sayısı rozetle), ana sayfadaki kutucuk ("1 yeni bildirim"), "Dikkat"
  kutusu ve zildeki **"Videona bildirim geldi"** ([Eğitmen paneli](egitmen-paneli.md)).
- **Yönetici ve destek:** `/panel/admin` ve `/panel/destek` içinde bildirim kuyruğu ([Paneller](../yonetim/paneller.md)).

## Adım adım

### Eğitmen

1. **"Bildirilenler"** sayfası, alt başlık "İzleyicilerin videolarına bıraktığı bildirimler".
2. **"Yeni"** kutusu: her bildirim bir satır — videonun adı, altında açıklamanın kendisi ve ne zaman ("“12:40'ta ses kesiliyor” · bugün"),
   sağda **"Yeni"**. Satıra basınca bildirimin ayrıntısı açılır.
3. **"Kapananlar"** kutusu: sonuçlanmış bildirimler ("“altyazı kaymış” · düzeltildi", sağda **"Kapandı"**).
4. Videoyu düzeltmek için Videolarım → **"Düzenle"** (altyazı, bilgi) ya da yeniden yükleme ([Videolarım](videolarim.md)).

### Yönetici ve destek

1. Panelde bildirim kuyruğu: video, neden, açıklama, tarih.
2. Her bildirim için iki iş: **videoyu kaldır** ya da **bildirimi reddet**.
3. Kaldırılan video Eğitim içeriklerinden kalkar; listelerde "Bu video kaldırıldı" satırı kalır.
4. Her iş işlem kaydına yazılır; bildiren kişiye sonuç bildirimi gider.

**Tasarımda (Tasarım 1 önizlemesi):** yalnız eğitmen tarafı çizildi; yönetici ve destek panellerinde bildirim kuyruğu yok. Eğitmen
tarafında bildirimi "Kapandı"ya kimin, nasıl çevirdiği (eğitmen mi, yönetim mi) gösterilmedi.

## Kurallar ve sınırlar

- **Bildirenin kim olduğu eğitmene söylenmez** (ad, sınıf, okul yok).
- **Kaldırma ya da reddetme yalnız yönetici ve destekte;** eğitmen kendi videosunu zaten "Videomu kaldır" ile kaldırabilir.
- **İşlem kaydı:** kaldırma ve reddetme kayda geçer.
- **Bildirene sonuç bildirimi** gider (tanım). Eğitmen bildirilen videolarının durumunu panelinde görür (tanım: "bildirilen
  videolarının durumu"); yönetim videoyu kaldırınca eğitmene ayrıca bildirim gitmesi tanımda yazmıyor (yalnız YouTube denetimindeki
  silmede yazıyor) — öneri.
- **5651:** içerik sağlayıcı eğitmendir; Eğitim Evi yer sağlayıcı olarak bildirim üzerine kaldırır; bu sorumluluk her durumda Eğitim
  Evi'nde kalır ([İçerik sorumluluğu ve yükleme koşulları](sorumluluk-ve-kosullar.md)).

## Kardeşler ve ilgili

**Kardeşler** (aynı klasör, [Eğitim içerikleri](README.md)):

- [Videoyu bildir](bildir.md) — bildirimin doğduğu yer.
- [Videolarım](videolarim.md), [Eğitmen paneli](egitmen-paneli.md), [Eğitmen rolü](egitmen-rolu.md).
- [İçerik sorumluluğu ve yükleme koşulları](sorumluluk-ve-kosullar.md).

**İlgili:**

- [Paneller](../yonetim/paneller.md) — yönetici ve destek panelleri.
- [İşlem kaydı](../islem-kaydi/README.md), [Bildirim türleri ve metinleri](../bildirim/bildirim-metinleri.md).
- [Bu mesajı bildir](../mesaj/bu-mesaji-bildir.md) — mesajlardaki benzer kuyruk.

## Kod tarafı

Bugün kodda yok. Kodlanınca kullanacağı bugünkü parçalar: [sunucu/bolumler/islem-kaydi.md](../../sunucu/bolumler/islem-kaydi.md),
[sunucu/veri/depo/genel.md](../../sunucu/veri/depo/genel.md) (bildirimler), [sunucu/bolumler/yonetici.md](../../sunucu/bolumler/yonetici.md)
(yönetim uçları).

## Sık sorulanlar

- **Videoma kim bildirim bıraktı (eğitmen)?** Söylenmez; yalnız neden ve açıklama görünür.
- **Bildirimi ben kapatabilir miyim (eğitmen)?** Tanımda kapatma yönetici ve destekte; sen sorunu düzeltip Videolarım'dan güncellersin.

## Sırada

- Eğitim içerikleri (iş 17) ve paneller (iş 5): bildirim kuyruğu, kaldır/reddet, sonuç bildirimleri.
- Eğitmen tarafındaki "Kapandı" durumunun kimin işiyle oluştuğu kullanıcıya sorulmalı.
