# Eğitim içerikleri · Bilgisayardan video yükleme

**Durum:** Tasarlandı — henüz kodda yok

Eğitmenin videoyu Eğitim Evi'ne kendisinin yüklemesi: 720p'nin üstündeki video önce eğitmenin TARAYICISINDA 720p'ye dönüştürülür
("Video 720p'ye dönüştürülüyor… %x"), sonra yüklenir ("Yükleniyor… %y"); sunucuya yalnız 720p dosya gelir.

## Ne işe yarar

Kullanıcının 28 Eylül sözleri: "720p olsun … isteyen direkt yükler ama onlara YouTube önerilir" ve "720 üstü koyunca 'yükleniyor' desin
ve orada tarayıcıda kendi PC'sinde dönüşümü yapsın, bizim sunucuya gelmesin". YouTube'u kullanmak istemeyen ya da indirilebilir video
isteyen eğitmen için ikinci yol; sunucu dönüştürmekle yorulmaz.

## Nereden açılır

- Eğitmen paneli → **"Video yükle"** (sol menü, ana sayfadaki kutucuk ya da Videolarım'daki düğme) → **"Kaynak"** alanında
  **"Bilgisayardan yükle"** ([Eğitmen paneli](egitmen-paneli.md)). Sayfanın alt başlığı: "YouTube bağlantısı önerilir; istersen
  videoyu bilgisayarından da yüklersin".
- Tanıma göre Eğitim içerikleri sayfasındaki **"+"** düğmesi → **"Bilgisayardan yükle"** (kullanıcının 28 Eylül sözü; Tasarım 1'de
  "+" yok, [Video listesi](video-listesi.md)).

## Adım adım

### Eğitmen

1. **"Kaynak"** alanında iki seçenek kartı: **"YouTube bağlantısı yapıştır"** (yanında "önerilen") ve **"Bilgisayardan yükle"** — altında
   "Video Eğitim Evi'ne yüklenir; 720p üstü video önce senin tarayıcında 720p'ye dönüştürülür." Bunu seç.
2. Dosya alanı: **"Video dosyasını seç"**, altında "ya da buraya sürükle · MP4, MOV, WEBM"; altında not: "720p üstü video seçince senin
   tarayıcında 720p'ye dönüştürülür, sonra yüklenir; sunucuya yalnız 720p dosya gelir."
3. Dosyayı seç ya da sürükle. Dosya kartı çıkar: ad, boyut, (okununca) çözünürlük ve süre ("1,2 GB · 1920×1080 · 14:20"; okunurken
   "video okunuyor…") ve:
   - 720p üstüyse: "720p üstü: tarayıcında 720p'ye dönüştürülüyor, sonra yükleniyor",
   - değilse: "720p ya da daha düşük: dönüştürmeden yükleniyor";
   - sağda **"Başka dosya seç"**.
4. İş hemen başlar, ilerleme çubuklarıyla:
   - (720p üstüyse) **"Video 720p'ye dönüştürülüyor… %38"**, bitince **"Video 720p'ye dönüştürüldü %100"**;
   - **"Yükleniyor… %60"** (dönüşüm sürerken "sırada"), bitince **"Yüklendi %100"**.
   - Altında: "Dönüşüm senin bilgisayarında yapılıyor; sunucuya yalnız 720p dosya gelir. Bu tarayıcı sekmesini kapatma. Bu sırada
     bilgileri doldurabilirsin."
   - Bitince yeşil: **"Video hazır. Bilgileri doldurup Yayınla'ya bas."**
5. Bu sırada başlık, sınıf, ders, etiket, açıklama ve altyazıyı doldur ([Video bilgileri](video-bilgileri.md)), onay kutusunu işaretle
   ([İçerik sorumluluğu ve yükleme koşulları](sorumluluk-ve-kosullar.md)).
6. **"Yayınla"**:
   - iş bittiyse video hemen yayına girer; ileti **"Video yayında."** ve sayfa **"Video yayında"** ekranına döner: "“…” Eğitim
     içeriklerinde; izleyenler hemen görebilir. Ön onay yok; uygunsuz bulan “Bildir”e basar." + **"Videoyu aç"**, **"Videolarım'a git"**,
     **"Yeni video yükle"**;
   - iş sürüyorsa ileti **"Yükleme bitince video kendiliğinden yayımlanır."** ve **"“…” yayına hazırlanıyor"** ekranı: "Yükleme bitince
     video kendiliğinden yayımlanır. Bu sırada panelde başka sayfaya geçebilirsin; tarayıcı sekmesini kapatma." + ilerleme çubukları +
     **"Videolarım'a git"** + kırmızı **"Yüklemeyi iptal et"**. Bitince ileti **"“…” yayında; izleyenler hemen görebilir."** Videolarım'da bu
     sırada video "İşleniyor" satırıyla görünür.
7. **"Yüklemeyi iptal et"**: sorar **"Yükleme iptal edilsin mi?"** / "Video yayımlanmaz; seçtiğin dosya ve girdiğin bilgiler silinir." →
   **"İptal et"**; ileti **"Yükleme iptal edildi."**
8. **"Vazgeç"** (formun altında): bir şey girdiysen sorar **"Girdiğin bilgiler silinsin mi?"** / "Seçtiğin video ve girdiğin bilgiler
   silinir; Videolarım'a dönersin." → **"Sil ve çık"**; boşsa doğrudan Videolarım'a döner.

## Kurallar ve sınırlar

- **Dosya türleri:** MP4, MOV, WEBM (ayrıca MKV, M4V kabul edilir). Video değilse: **"Bu bir video dosyası değil. MP4, MOV ya da WEBM seç."**
- **Tarayıcı açamazsa** (ör. HEVC / H.265): **"Bu video tarayıcında açılamadı (ör. HEVC / H.265). Videoyu MP4 (H.264) olarak kaydedip
  yeniden seç ya da YouTube bağlantısı ver."**
- **Tarayıcı dönüştüremezse** (WebCodecs yok, eski tarayıcı): **"Bu tarayıcı videoyu dönüştüremiyor. Chrome ya da Edge kullan ya da
  YouTube bağlantısı ver."**
- **"720p üstü"** = kısa kenarı 720 pikselden büyük video (ör. 1920×1080, dikey 1080×1920). Hedef 1280×720.
- **Dönüşüm tarayıcıda** (sunucuda ffmpeg YOK): WebCodecs (VideoDecoder → 1280×720'ye ölçekleme → VideoEncoder H.264) ve Eğitim Evi'nin
  kendi küçük MP4 okuyucu/yazıcısı (kütüphane yok); ses yeniden kodlanmadan aktarılır. Sayfa açık kalmalı.
- **İki kalite:** yüklemede 720p ve 360p hazırlanır ([Kalite](kalite.md)).
- **Parça parça yükleme,** ilerleme çubuğu; yarıda kalırsa kaldığı yerden devam eder.
- **Küçük resim** tarayıcıda videodan çekilir (sunucuda araç gerekmez).
- **Yayınla'dan önce eksikler** (özet satırı): **"Yayınlamadan önce tamamla: video dosyası, başlık, sınıf, onay kutusu."** Dosya için alan
  hataları: **"Video dosyasını seç."**, **"Bu dosya kullanılamıyor; başka dosya seç."**, **"Video daha okunuyor; birkaç saniye bekle."**
- **Disk:** eğitmen başına disk sınırı (site ayarı, varsayılan 5 GB); video başına ve kişi başına boyut sınırı; eğitim videoları günlük
  yedeğe girmez ([Sınırlar ve site ayarları](sinirlar-ve-ayarlar.md)).
- **Başkasının videosu** doğrudan yüklenemez (koşullarla yasak); başkasının YouTube videosu bağlantıyla eklenir ([YouTube bağlantısı](youtube-baglantisi.md)).

## Kardeşler ve ilgili

**Kardeşler** (aynı klasör, [Eğitim içerikleri](README.md)):

- [YouTube bağlantısı](youtube-baglantisi.md) — önerilen öbür yol.
- [Video bilgileri](video-bilgileri.md) — aynı sayfadaki alanlar.
- [İçerik sorumluluğu ve yükleme koşulları](sorumluluk-ve-kosullar.md) — onay kutusu.
- [Videolarım](videolarim.md) — "İşleniyor" satırı.
- [Kalite](kalite.md), [Altyazı](altyazi.md).

**İlgili:**

- [Telefonda küçültme](../okul-disk/telefonda-kucultme.md), [Sunucuda küçültme](../okul-disk/sunucuda-kucultme.md) — sitedeki öbür
  küçültme işleri (bütün videolar tarayıcıda küçültülür; eğitim içeriklerindeki kodla ortak).

## Kod tarafı

Bugün kodda yok. Kodlanınca örnek alacağı bugünkü parçalar:

- Tarayıcıda fotoğraf küçültme (aynı "yüklemeden önce küçült" kalıbı): [public/js/parcalar/04f-resim-kucult.md](../../public/js/parcalar/04f-resim-kucult.md).
- Sürükle-bırak yükleme alanı: [public/js/parcalar/04d-ekler.md](../../public/js/parcalar/04d-ekler.md).
- Akışla güvenli dosya yükleme (sunucu): [sunucu/bolumler/odev-dosya.md](../../sunucu/bolumler/odev-dosya.md).

## Sık sorulanlar

- **Videom 1080p; kalitesi düşecek mi?** 720p'ye dönüştürülür; eğitim videosu için yeterli ve herkes için hızlı açılır.
- **Yüklerken sayfayı kapatabilir miyim?** Hayır; dönüşüm ve yükleme senin tarayıcında. Panelde başka sayfaya geçebilirsin, sekmeyi
  kapatma.
- **"Bu tarayıcı videoyu dönüştüremiyor" diyor.** Chrome ya da Edge kullan ya da videoyu YouTube'a yükleyip bağlantısını ver.
- **Neden YouTube öneriliyor?** Sunucuya yük binmez, otomatik Türkçe altyazı gelir; ama YouTube videosu indirilemez.

## Sırada

- Eğitim içerikleri (iş 17): tarayıcıda dönüşüm (tanımdaki tahmin ~5–6 saat), parça parça yükleme, 360p kopya, küçük resim.
- PLAN (3 Ekim, kullanıcı): JS işleri bittikten sonra zaman kalırsa ağır medya işi ayrı bir RUST programına geçer: dönüştüremeyen cihaz
  özgün dosyayı yükler, sunucudaki Rust parçası 720p H.264'e dönüştürür. O zamana kadar yukarıdaki "dönüştüremiyor" iletisi geçerli.
