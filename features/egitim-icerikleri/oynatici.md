# Eğitim içerikleri · Oynatıcı

**Durum:** Tasarlandı — henüz kodda yok

Eğitim Evi'nin kendi video oynatıcısı: YouTube videosunda da aynı denetim çubuğu (oynat/durdur, 10 sn geri/ileri, ses, zaman,
hız, kalite, altyazı, kısayollar, tam ekran) ve tıklanabilir ilerleme çubuğu; oynarken boşta kalınca çubuk gizlenir.

## Ne işe yarar

Kullanıcının 28 Eylül sözü: "YouTube oynatıcısı basit olmasın, kendi araçlarımızla 3x, 0.25x ve kaliteli şeyler; direkt YouTube
gibi koyunca çok amatör oluyor". 2 Ekim'de: "tam ekran butonu yok eğitim içeriklerinde … kısayollar m, ok tuşları, f ile full
screen, m ile durdurma, jkl". İki kaynaktaki (YouTube ve Eğitim Evi'ne yüklenen) videolar aynı görünür, aynı tuşlarla yönetilir.

## Nereden açılır

İzleme sayfasının üstü ([İzleme sayfası](izleme-sayfasi.md)). Aynı oynatıcı Tasarım 1'de ödev ve mesaj eklerindeki videoyu açarken
de kullanılıyor ([Ödev ekleri](../odev/dosya-ekleme.md), [Mesaj ekleri](../mesaj/ekler.md)).

## Adım adım

### Herkes (ziyaretçi dahil)

1. **Ekran:** video, sol üstte videonun başlığı, video dururken ortada büyük **oynat** düğmesi (sesli adı "Oynat (m)").
2. **Alt çubuk**, üstte ilerleme çubuğu (izlenen kısım dolu, ucunda yuvarlak tutamak), altında soldan sağa:
   - **Oynat / Durdur** — ipucu "Oynat / durdur (m)"; oynarken simge iki çizgiye döner (sesli adı "Durdur (m)").
   - **"−10"** — "10 sn geri (j)".
   - **"+10"** — "10 sn ileri (l)".
   - **Ses simgesi** — "Sesi kapat" / "Sesi aç" ([Ses ve sessiz](ses.md)); yanında **ses kaydırıcısı** (0–100).
   - **Zaman** — "0:00 / 12:40" (geçen / toplam).
   - (boşluk)
   - **Hız** seçicisi — "1x" ([Oynatma hızı](hiz.md)).
   - **Kalite** seçicisi ([Kalite](kalite.md)).
   - **Altyazı** seçicisi — "Altyazı: Türkçe" / "Altyazı: kapalı" ([Altyazı](altyazi.md)).
   - **"?"** — "Kısayollar (?)", kısayol listesini açar ([Klavye kısayolları](klavye-kisayollari.md)).
   - **Tam ekran** — "Tam ekran (f)"; tam ekrandayken "Tam ekrandan çık (f)" ([Tam ekran](tam-ekran.md)).
3. **Videonun üstüne tıkla:** oynar ya da durur. **Çift tıkla:** tam ekran.
4. **İlerleme çubuğunda bir yere bas:** video oraya atlar.
5. Her işte ekranın ortasında kısa bir balon görünüp kaybolur: **"Oynatılıyor"**, **"Durduruldu"**, **"+10 sn"**, **"−10 sn"**,
   **"+5 sn"**, **"−5 sn"**, **"Ses %85"**, **"Ses kapalı"**, **"Ses açık · %80"**, **"Hız 1,5x"**, **"%30"**.
6. Oynarken fareyi 2,5 saniye kıpırdatmazsan çubuk ve başlık gizlenir (tam ekranda imleç de); fareyi oynatınca geri gelir. Bir
   seçici (hız, kalite, altyazı) açıkken ya da video dururken gizlenmez.
7. Pencereyi kapatınca ya da sayfadan çıkınca video durur.

### Giriş yapmış herkes

Kaldığın yer hesabında tutulur: videoyu yeniden açınca oradan başlar ([Kaldığın yerden devam](kaldigi-yerden-devam.md)).

## Kurallar ve sınırlar

- **Kendi denetim çubuğumuz:** YouTube videosu YouTube'un IFrame API'siyle, YouTube'un kendi düğmeleri kapalı (`controls=0`) ve
  `youtube-nocookie.com` adresinden oynatılır; düğmeler bizim çubuğumuzdur. YouTube logosu gizlenemez (YouTube'un kuralı).
- **YouTube videosu tıklayınca yüklenir:** oynat'a basmadan YouTube'a hiçbir istek gitmez. Güvenlik başlığında çerçeveye
  (`frame-src`) yalnız bu adres izinlidir.
- **Eğitim Evi'ne yüklenen video** sunucudan parça parça (HTTP Range) gelir; ileri sarınca yalnız gereken parça iner. 720p ve
  360p iki kalite hazırdır ([Kalite](kalite.md)).
- **Hız:** bizim videoda 0,25x–3x; YouTube videosunda YouTube'un sınırı yüzünden 0,25x–2x ([Oynatma hızı](hiz.md)).
- **Tercihler sürer:** seçtiğin ses düzeyi ve hız, başka bir video açınca da aynı kalır (Tasarım 1'de sayfa açık olduğu sürece);
  altyazı tercihi hatırlanır (tanım).
- **Tarayıcı kendiliğinden oynatmayı engellerse** balon: **"Oynatmak için videoya dokun"**.
- **Erişilebilirlik:** oynatıcı odaklanabilir bir bölgedir ("Video oynatıcı; kısayollar için soru işareti"); ilerleme çubuğu
  kaydırıcı olarak okunur ("Videoda konum", geçen ve toplam saniye); düğmelerin hepsinin sesli adı vardır.
- **Önizlemede:** Tasarım 1'de bütün videolar aynı örnek kaydı oynatır ve kapakta aynı örnek resim durur; hız gerçekten çalışır.

## Kardeşler ve ilgili

**Kardeşler** (aynı klasör, [Eğitim içerikleri](README.md)):

- [Tam ekran](tam-ekran.md), [Klavye kısayolları](klavye-kisayollari.md), [Oynatma hızı](hiz.md), [Kalite](kalite.md),
  [Ses ve sessiz](ses.md), [Altyazı](altyazi.md) — çubuğun her düğmesinin ayrıntısı.
- [İzleme sayfası](izleme-sayfasi.md) — oynatıcının bulunduğu sayfa.
- [Kaldığın yerden devam](kaldigi-yerden-devam.md) — açılışta nereden başladığı.
- [YouTube bağlantısı](youtube-baglantisi.md), [Bilgisayardan video yükleme](video-yukleme.md) — iki kaynak.

**İlgili:**

- [Dışarı giden veriler](../kvkk-ve-gizlilik/disari-giden-veriler.md) — YouTube'a istek ne zaman gider.
- [Teslimleri inceleme](../odev/teslimleri-inceleme.md) — ödevde videonun açılması.

## Kod tarafı

Bugün kodda yok. Kodlanınca kullanacağı bugünkü parçalar:

- Range destekli medya gönderimi (`medyaGonder`, 206, `Accept-Ranges`): [sunucu/bolumler/odev-dosya.md](../../sunucu/bolumler/odev-dosya.md).
- CSP (`frame-src`, `media-src`): [sunucu/http.md](../../sunucu/http.md).

## Sık sorulanlar

- **YouTube videosunda neden 3x yok?** YouTube kendi videolarında en çok 2x'e izin veriyor; 3x yalnız Eğitim Evi'ne yüklenen
  videolarda.
- **Çubuk kayboldu.** Oynarken fareyi kıpırdatmayınca gizlenir; fareyi oynat ya da videoya dokun.
- **Videoya tıklayınca duruyor.** Evet; videonun üstüne tıklamak oynat/durdur demek. Tam ekran için çift tıkla.

## Sırada

- Eğitim içerikleri (iş 17): kendi oynatıcı (tanımdaki tahmin ~3 saat) — YouTube IFrame API bağdaştırıcısı ve yüklenen video için
  kalite geçişi dahil.
