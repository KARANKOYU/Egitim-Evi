# Eğitim içerikleri · Eğitmen paneli (/panel/egitmen)

**Durum:** Tasarlandı — henüz kodda yok

Yalnız eğitmenin açtığı panel: ana sayfada beş kutucuk (Videolarım, Video yükle, Oynatma listelerim, Bildirilenler, İstatistikler),
son videoların ve "Dikkat" kutusu; sol menüde aynı sayfalar ve en altta Eğitim içerikleri.

## Ne işe yarar

Kullanıcının 29 Eylül sözü: "/panel/egitmen ile video izlenmelerine, beğenilere bakabilsin; orada videoları ve yanında 'videomu kaldır'
vb. olacak". Eğitmen videolarını, listelerini, bildirimlerini ve toplam sayılarını tek yerden yönetir.

## Nereden açılır

- Adres: `egitimevi.org/panel/egitmen` ([Adresler](adresler.md)).
- Oturum ekranında **"Eğitmen · eğitim içerikleri"** oturumu (eğitmen görseliyle).

## Adım adım

### Eğitmen

1. Paneli aç. **Sol menü**, sırasıyla: **Ana sayfa**, **Videolarım**, **Video yükle**, **Oynatma listelerim**, **Bildirilenler** (yeni
   bildirim sayısı rozetle), **İstatistikler**; bir çizginin altında **Eğitim içerikleri**.
2. **Ana sayfanın** başlığında bugünün tarihi; altında "Eğitmen paneli · @kullanıcıadın · kanalın: youtube.com/@kanalin" (kanal
   kısmı Tasarım 1'deki hesap düzeyindeki "Kanal bağlantısı" ayarından; bu ayar tanımda yok, [Eğitmen rolü](egitmen-rolu.md)).
3. **Kutucuklar** (renkli, basınca o sayfa açılır):
   - **Videolarım** — "5 video · 1 uyarı" (YouTube'dan kaldırılmış video varsa uyarı sayısı ve rozet),
   - **Video yükle** — "YouTube ya da dosya",
   - **Oynatma listelerim** — "3 / 4 liste",
   - **Bildirilenler** — "1 yeni bildirim",
   - **İstatistikler** — "bu hafta 1,8 B izlenme" (son 7 günün izlenmesi).
4. Solda **"Son videoların"** kutusu: son üç video; her satırda ad, "7. sınıf · YouTube · 4,2 B izlenme · 312 beğeni" ve durum
   (**"Yayında"** / **"İşleniyor"**); satıra basınca video açılır; kutunun "tümü" bağlantısı Videolarım'a gider.
5. Sağda **"Dikkat"** kutusu: YouTube'dan kaldırılmış her video ("YouTube'dan kaldırılmış · yarın silinecek" + **"Bak"** → Videolarım)
   ve yeni bildirimler ("1 bildirim: “ses kesiliyor 12:40'ta”" + **"Bak"** → Bildirilenler).
6. Zildeki bildirimler: **"Videona bildirim geldi"** (videonun adı ve bildirimin kısa metni) ve **"Bir videon YouTube'dan kaldırılmış"**
   (videonun adı · "yarın silinecek").
7. Sayfalar: [Videolarım](videolarim.md), [Video yükle](video-yukleme.md) ([YouTube bağlantısı](youtube-baglantisi.md),
   [Video bilgileri](video-bilgileri.md)), [Oynatma listelerim](egitmen-serileri.md), [Bildirilenler](bildirilenler.md),
   [İstatistikler](istatistikler.md).

### Öbür herkes

`/panel/egitmen` adresini açan eğitmen olmayan kişi **"sayfa bulunamadı" (404)** görür.

## Kurallar ve sınırlar

- **Yalnız eğitmen;** öbürlerine 404 (panelin varlığı belli olmaz). Bütün panellerde aynı kapı.
- **Kimin izlediği görünmez:** panelde yalnız toplam sayılar var (izlenme, beğeni, kaydeden, indirme) ([İstatistikler](istatistikler.md)).
- **İki adımlı giriş zorunlu** (eğitmen hesabında).
- **Tanımda olup Tasarım 1'de olmayan:** eğitmenin kendi videosunun ASLINI dosya olarak indirmesi (29 Eylül tanımı: "Eğitmen kendi videosunun
  aslını /panel/egitmen'den dosya olarak indirebilir") ve Eğitim içerikleri sayfasındaki **"+"** düğmesi (kullanıcının 28 Eylül sözü;
  panel dışından video ekleme yolu, [Video listesi](video-listesi.md)).
- Tasarım 1'de panel, öbür oturumlarla aynı iskelette (sol menü, kutucuklar, zil) çizildi.

## Kardeşler ve ilgili

**Kardeşler** (aynı klasör, [Eğitim içerikleri](README.md)):

- [Eğitmen rolü](egitmen-rolu.md) — paneli açan rol.
- [Videolarım](videolarim.md), [Bilgisayardan video yükleme](video-yukleme.md), [YouTube bağlantısı](youtube-baglantisi.md),
  [Video bilgileri](video-bilgileri.md), [Eğitmen serileri](egitmen-serileri.md), [Bildirilenler](bildirilenler.md),
  [İstatistikler](istatistikler.md) — panelin sayfaları.
- [YouTube'dan kalkan videonun silinmesi](youtube-denetimi.md) — "Dikkat" kutusundaki uyarı.

**İlgili:**

- [Paneller](../yonetim/paneller.md) — `/panel/admin` ve `/panel/destek`.
- [Bildirim paneli](../bildirim/bildirim-paneli.md) — zil.
- [Renkli kutucuklar](../ana-sayfa/kutucuklar.md).

## Kod tarafı

Bugün kodda yok. Kodlanınca örnek alacağı bugünkü parçalar:

- Ana sayfa ve kutucuklar: [public/js/parcalar/08-ana-sayfa.md](../../public/js/parcalar/08-ana-sayfa.md); sol menü:
  [public/js/parcalar/06-menu.md](../../public/js/parcalar/06-menu.md).
- Panel kapısı ve 404: [sunucu/yonetim-cerezi.md](../../sunucu/yonetim-cerezi.md), [sunucu/http.md](../../sunucu/http.md).

## Sık sorulanlar

- **Panel adresini açınca "bulunamadı" diyor.** Hesabında eğitmen rolü yok (ya da rol alındı); rolü yönetici ya da destek verir.
- **Videomu kimin izlediğini görebilir miyim?** Hayır; yalnız toplamlar.

## Sırada

- Eğitim içerikleri (iş 17) ve paneller (iş 5): `/panel/egitmen`, kutucuklar, "Dikkat" kutusu, "aslını indir".
