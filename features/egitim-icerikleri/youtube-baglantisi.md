# Eğitim içerikleri · YouTube bağlantısı ekleme (önerilen yol)

**Durum:** Tasarlandı — henüz kodda yok

Eğitmen videosunu YouTube'a yükleyip bağlantısını yapıştırır; Eğitim Evi bağlantıyı doğrular, başlık, kanal ve küçük resmi alır,
videoyu kendi oynatıcısıyla ve izleyen tıklayana kadar YouTube'a istek göndermeden gösterir.

## Ne işe yarar

Kullanıcının 28 Eylül sözü: "hoca kendi içeriğini YouTube'a yayınlayıp linkini koyar, biz YouTube'dan oynatırız; isteyen direkt yükler
ama onlara YouTube önerilir; hesap ismi + kanal olur, isim tıklanmaz ama kanal onun kanalına atar". Sunucuya video yükü binmez,
YouTube'un otomatik Türkçe altyazısı gelir.

## Nereden açılır

- Eğitmen paneli → **"Video yükle"** → **"Kaynak"** alanında **"YouTube bağlantısı yapıştır"** (yanında **"önerilen"**; altında
  "Videonu YouTube'a yükleyip bağlantısını koyarsın; oynatma Eğitim Evi'nin oynatıcısıyla olur."). Sayfa açılınca bu seçili gelir.
- Tanıma göre Eğitim içerikleri sayfasındaki **"+"** düğmesi → **"YouTube bağlantısı yapıştır (önerilen)"** (kullanıcının 28 Eylül
  sözü; Tasarım 1'de "+" yok, [Video listesi](video-listesi.md)).

## Adım adım

### Eğitmen

1. **"YouTube bağlantısı"** kutusuna (yer tutucu "https://www.youtube.com/watch?v=…") bağlantıyı yapıştır. Boşken altında: "youtube.com/
   watch?v=…, youtu.be/… ya da youtube.com/shorts/… bağlantısı yapıştır. Video YouTube'da “Liste dışı” da olabilir."
2. Bağlantı YouTube video bağlantısı değilse hemen: **"Bu bir YouTube video bağlantısı değil. Örnek: https://www.youtube.com/watch?v=abcdEFGh123"**
3. Geçerliyse doğrulama kartı: küçük resim, yeşil **"Bağlantı doğrulandı"**, videonun YouTube'daki başlığı, **"Kanal: <kanal adı> ·
   youtube.com/@…"** ve "Video YouTube'da var ve gömülebilir. Oynatma Eğitim Evi'nin oynatıcısıyla olur; izleyen tıklayana kadar
   YouTube'a istek gitmez."
4. Başlık kutusu boşsa YouTube'daki başlık kendiliğinden yazılır; istersen değiştir.
5. Sınıf, ders, etiket, açıklamayı doldur ([Video bilgileri](video-bilgileri.md)); "Altyazı" alanında yalnız not: "YouTube videosunda
   YouTube'un altyazıları kullanılır (YouTube'un otomatik Türkçe altyazısı dahil). İzleyen, oynatıcıdaki Altyazı düğmesinden dili seçer."
6. Onay kutusunu işaretle ([İçerik sorumluluğu ve yükleme koşulları](sorumluluk-ve-kosullar.md)) ve **"Yayınla"**: ileti **"Video
   yayında."**, **"Video yayında"** ekranı (bkz. [Bilgisayardan video yükleme](video-yukleme.md) 6. adım).
7. Bağlantı yoksa ya da yanlışsa Yayınla'da alan hatası **"YouTube bağlantısını yapıştır."** / **"Bu bir YouTube video bağlantısı değil."**
   ve özet **"Yayınlamadan önce tamamla: YouTube bağlantısı, …"**

### İzleyen (herkes)

Video Eğitim içeriklerinde öbürleri gibi görünür; izleme sayfasında **"Kaynak: YouTube"** ve tıklanan **"Kanal: <kanal adı>"** satırı
(yeni sekmede YouTube kanalı) ([İzleme sayfası](izleme-sayfasi.md)).

## Kurallar ve sınırlar

- **Kabul edilen bağlantılar:** `youtube.com/watch?v=…`, `youtu.be/…`, `youtube.com/shorts/…`, `youtube.com/embed/…`, `youtube.com/live/…`
  (`www.`, `m.` ve `youtube-nocookie.com` de); 11 karakterlik video kimliği alınır.
- **Sunucu doğrular:** YouTube oEmbed ile (anahtar gerekmez) videonun var ve gömülebilir olduğuna bakar; başlığı, kanal adını, kanal
  adresini ve küçük resmi alır. Küçük resim BİR KEZ indirilip Eğitim Evi'nde saklanır.
- **"Liste dışı"** video olur; **gizli** ya da **gömmesi kapalı** video olmaz.
- **Oynatma:** `youtube-nocookie.com` ile, Eğitim Evi'nin kendi denetim çubuğuyla; video TIKLAYINCA yüklenir, tıklamadan YouTube'a istek
  gitmez; sitenin güvenlik başlığında çerçeve için yalnız bu adres izinli ([Oynatıcı](oynatici.md)).
- **YouTube sınırları** (kullanıcıya söylendi): hız 0,25x–2x; kalite YouTube'ca otomatik; YouTube logosu gizlenemez; video İNDİRİLEMEZ.
- **Kendi kimliğimiz:** video Eğitim Evi'nde kendi 12 karakterlik kimliğini alır; YouTube kimliği içeride saklanır ([Adresler](adresler.md)).
- **Başkasının YouTube videosunu bağlamak serbest;** asıl kanal gösterilir.
- **Kanal video başına gelir:** "Kanal:" satırındaki ad ve adres, o videonun oEmbed cevabından (videoyu yükleyen YouTube kanalı)
  alınır; eğitmenin hesabındaki bir ayardan değil.
- **YouTube'dan kalkarsa** video iki art arda denetimde açılmayınca Eğitim içeriklerinden de silinir ([YouTube'dan kalkan videonun silinmesi](youtube-denetimi.md)).
- **KVKK:** aydınlatma metnine YouTube'un üçüncü taraf olduğu ve kendi gizlilik politikası yazılır.

**Tasarımda (Tasarım 1 önizlemesi):** eğitmenin Hesap ayarlarında bir **"Kanal bağlantısı"** satırı var ("Videolarını YouTube'dan
eklerken bu kanal kullanılır. Bağlantı değişince eski videoların yerinde kalır.") ve doğrulama kartındaki ve izleme sayfasındaki kanal
bu ayardan geliyor ([Eğitmen rolü](egitmen-rolu.md)). Tanımda böyle bir ayar yok ve başkasının videosunu bağlayan eğitmende kanal
yanlış görünür; kodlanırken kanal oEmbed'den alınır, ayarın kalıp kalmayacağı kullanıcıya sorulmalı.

## Kardeşler ve ilgili

**Kardeşler** (aynı klasör, [Eğitim içerikleri](README.md)):

- [Bilgisayardan video yükleme](video-yukleme.md) — öbür yol.
- [Video bilgileri](video-bilgileri.md), [İçerik sorumluluğu ve yükleme koşulları](sorumluluk-ve-kosullar.md).
- [YouTube'dan kalkan videonun silinmesi](youtube-denetimi.md), [Oynatıcı](oynatici.md), [Altyazı](altyazi.md).

**İlgili:**

- [Dışarı giden veriler](../kvkk-ve-gizlilik/disari-giden-veriler.md) — YouTube'a ne zaman istek gider.
- [Aydınlatma metni](../kvkk-ve-gizlilik/aydinlatma-metni.md).

## Kod tarafı

Bugün kodda yok. Kodlanınca dokunacağı bugünkü parçalar:

- CSP'ye `frame-src https://www.youtube-nocookie.com` ve küçük resim için izin: [sunucu/http.md](../../sunucu/http.md).
- Dışarıya istek kapısı: bugün GitHub'dan sürüm listesini çeken [sunucu/uygulama-surum.md](../../sunucu/uygulama-surum.md) testlerde
  `EE_DIS_ISTEK=0` ile dışarıya hiç istek atmaz; oEmbed isteği de aynı kurala uymalı.

## Sık sorulanlar

- **Videomu YouTube'da "Liste dışı" yaptım; olur mu?** Olur.
- **Başka birinin YouTube videosunu ekleyebilir miyim?** Evet, bağlantıyla; asıl kanal gösterilir. Dosyasını indirip doğrudan
  yükleyemezsin.
- **"Bu bir YouTube video bağlantısı değil" diyor.** Kanal ya da liste bağlantısı yapıştırmış olabilirsin; tek videonun bağlantısını ver.
- **İzleyenler YouTube reklamı görür mü?** YouTube kendi oynatıcısında reklam gösterebilir (tanımdaki eksi: reklam ve YouTube'a bağımlılık).

## Sırada

- Eğitim içerikleri (iş 17): oEmbed doğrulaması, küçük resmin saklanması, IFrame API bağdaştırıcısı.
- Önizlemedeki hesap düzeyindeki "Kanal bağlantısı" ayarı tanımda yok — kullanıcıya sorulacak; "+" düğmesi önizlemeye eklenecek.
