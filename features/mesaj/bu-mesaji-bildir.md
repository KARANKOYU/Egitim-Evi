# Mesajlar · Bu mesajı bildir

**Durum:** Tasarlandı — henüz kodda yok (tanım "Bu mesajı bildir", öneri 4 onaylandı; Tasarım 1 önizlemesinde yalnız okulun mesaj ayarlarındaki açıklamada geçiyor).

Alınan rahatsız edici, uygunsuz ya da zorbalık içeren bir mesajı okul yönetimine bildirmek; yönetimin yalnız bildirilen mesajı görüp gereğini yapması.

## Ne işe yarar

Okul mesajlaşmasında kötüye kullanımı durdurmak için; özellikle okul öğrencilerin birbirine yazmasına izin verirse. Müdür
kimsenin mesajlarını okuyamaz; yalnız biri bir mesajı bildirince o mesajı (ve kısa bir bağlamı) görür. Bildiren kişinin kimliği
gönderene söylenmez.

## Nereden açılır

- **Bildirmek:** alınan her mesajın penceresinde **"Bildir"** (öğrenci, veli ve öğretmen için). Okul "Sınıf arkadaşları"na yazmayı
  açarsa öğrenciler arası mesajlarda "Bu mesajı bildir" mutlaka görünür ([Okulun mesaj ayarları](okulun-mesaj-ayarlari.md)).
- **İncelemek:** müdürde (ve "Okuldaki herkese mesaj atar" yetkilisinde) **"Bildirilen mesajlar"** listesi.

## Adım adım

### Alıcı (öğrenci, veli, öğretmen) — tasarım

1. Mesajı aç → **"Bildir"**.
2. Nedeni seç: **rahatsız edici**, **uygunsuz**, **zorbalık**, **diğer**; istersen kısa bir not yaz.
3. Gönder. Mesaj okul yönetiminin "Bildirilen mesajlar" listesine düşer. Gönderen kimin bildirdiğini öğrenmez.

### Müdür (ve "Okuldaki herkese mesaj atar" yetkilisi) — tasarım

1. **"Bildirilen mesajlar"** listesini aç.
2. Bir kaydı aç: **yalnız bildirilen mesajı** ve aynı konuşmadaki **önceki 5 mesajı** (bağlam olarak) görürsün; başka hiçbir mesajı
   göremezsin.
3. Durumu işaretle: **yeni** → **incelendi** → **işlem yapıldı** (not yazılır).
4. Gerekirse gönderene **uyarı** gönder ya da gönderenin mesaj yazmasını geçici olarak **kısıtla (1 gün / 1 hafta)**.
5. Her işlem işlem kaydına yazılır.

### Gönderen (bildirilen mesajın sahibi)

Uyarı alırsa ya da kısıtlanırsa bunu görür; kimin bildirdiğini görmez. Kısıtlamada çıkacak iletinin metni tanımda yok.

## Kurallar ve sınırlar

Karara bağlananlar (tanım §2 ve §1):

- Bildirim nedenleri: rahatsız edici, uygunsuz, zorbalık, diğer + kısa not.
- Yönetim yalnız bildirilen mesajı ve aynı konuşmadaki önceki 5 mesajı görür.
- Durumlar: yeni / incelendi / işlem yapıldı (not).
- Yaptırım: gönderene uyarı ya da mesaj yazmayı 1 gün / 1 hafta kısıtlama.
- Bildirenin kimliği gönderene söylenmez.
- İşlem kaydına yazılır.
- Bildirilen mesaj kaydı **30 gün** sonra silinir.
- Öğrenciler arası mesajlaşma açıksa "Bu mesajı bildir" zorunlu görünür ve müdür bildirilenleri görür.
- KVKK: bildirilen mesajları kimin gördüğü ve 30 gün saklama aydınlatma metnine yazılır.

Tanımda henüz yazmayanlar (kodlanmadan önce karara bağlanmalı):

- Düğmenin ve pencerenin tam metinleri; "Bildirilen mesajlar" listesinin menüdeki yeri.
- Servisçinin bildirip bildiremeyeceği (tanım "öğrenci ve veli için; öğretmen de" der; veli açıkça var, servisçi anılmıyor).
- "Aynı konuşma"nın nasıl belirleneceği (bugün mesajlarda konuşma/iş parçacığı yok; tasarımdaki "Yanıtla" "Ynt:" başlığıyla yeni mesaj açar).
- Duyuruların bildirilip bildirilemeyeceği.
- Aynı mesajın birden çok kez bildirilmesine sınır.

## Kardeşler ve ilgili

**Kardeşler:** [Okulun mesaj ayarları](okulun-mesaj-ayarlari.md) · [Şikâyet etiketi](sikayet-etiketi.md) (genel bir sorunu
yönetime iletmek) · [Bana kim yazabilir](bana-kim-yazabilir.md) · [Mesajı okuma](mesaj-okuma.md).

**İlgili:** [Bildir (eğitim içerikleri)](../egitim-icerikleri/bildir.md) (videolardaki benzer düğme) ·
[İşlem kaydı](../islem-kaydi/README.md) · [Saklama süreleri](../kvkk-ve-gizlilik/saklama-sureleri.md) ·
[Kim neyi görür](../kvkk-ve-gizlilik/kim-neyi-gorur.md).

## Kod tarafı

Bugün kodda yok. Mesajlaşma ([sunucu/bolumler/mesaj.md](../../sunucu/bolumler/mesaj.md), [public/js/parcalar/19-mesajlar.md](../../public/js/parcalar/19-mesajlar.md)
— "Son durum"da planı var) üzerine bildirim tablosu, inceleme ekranı, yaptırım (gönderme kapısında kısıtlama denetimi) ve 30 günlük
temizlik eklenecek; yapı belgesinde yazılacak. Kodlanınca bu belgenin Durum satırı güncellenir.

## Sık sorulanlar

- **Bildirdiğimi gönderen öğrenir mi?** Hayır; kimliğin gönderene söylenmez.
- **Müdür bütün mesajlarımı okuyabilir mi?** Hayır; yalnız bildirilen mesajı ve onun öncesindeki 5 mesajı görür.
- **Bildirilen mesaj ne kadar saklanır?** 30 gün.

## Sırada

- Mesaj ayarları (çark), Bu mesajı bildir, Ajanda işi (iş 8) — kodu Linux'ta yazılacak; KVKK metni aynı işte güncellenecek.
