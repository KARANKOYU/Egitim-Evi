# Eğitim içerikleri

EBA gibi bir ders videoları bölümü: eğitmen rolündeki yetişkinin YouTube bağlantısıyla (önerilen) ya da bilgisayarından yüklediği
videolar (720p'nin üstü eğitmenin tarayıcısında 720p'ye dönüştürülür) herkese açık bir listede durur; liste, arama, süzgeçler ve izleme
GİRİŞ YAPMADAN da açıktır. Süzgeçler gerçek süzgeçtir: sınıf 1–12 (İlkokul / Ortaokul / Lise kademe satırlarında), dersler kademe
başlıkları altında ve canlı sayılı, arama Türkçe harfleri eşler, aynı süzgeçteki seçimler "ya da", süzgeçler arası "ve" ile birleşir.
Videolar Eğitim Evi'nin kendi oynatıcısında oynar (YouTube videosu da): tam ekran, 0,25x–3x hız (YouTube'da 2x'e kadar), kalite,
altyazı, ses, klavye kısayolları (m, k ya da boşluk oynat/durdur; f tam ekran; j/l 10 sn; oklar; 0–9) ve kaldığın yerden devam. Giriş
yapmış kişi beğenir, "Kaydettiklerim"e koyar, en çok 2 oynatma listesi kurar ve paylaşır (`/watchlist/<kimlik>`), izin verilmiş videoyu
cihazına şifreli indirip internetsiz izler, izleme geçmişini yalnız kendisi görür, uygunsuz videoyu "Bildir"le bildirir. Eğitmen
`/panel/egitmen`de videolarını, 4 listesini ve herkese açık serilerini yönetir, yalnız toplam sayıları görür (kimin izlediğini asla);
rolü yönetici ya da destek verir, ön onay yoktur, YouTube'dan kalkan video günlük denetimle silinir. **Bunların hiçbiri bugün kodda
yok:** hepsi kullanıcının 28 Eylül – 3 Ekim kararları (tanım) ve Tasarım 1 önizlemesine göre tasarlandı; kodlama Linux'ta (iş 17).

## Alt özellikler

| Belge | Ne anlatır | Durum |
|---|---|---|
| [Adresler](adresler.md) | `/egitim-icerikleri`, `/izle/<kimlik>`, `/watchlist/<kimlik>`, `/panel/egitmen`; eşleri, 12 karakterlik kimlik, dizin kuralları | Tasarlandı — henüz kodda yok |
| [Video listesi](video-listesi.md) | Sayfanın düzeni, bölüm çipleri, video kartı, dar ekran | Tasarlandı — henüz kodda yok |
| [Süzgeç mantığı](suzgec-mantigi.md) | Süzgeçlerin birleşmesi, canlı ders sayıları, gizlenen seçimin düşmesi, temizleme | Tasarlandı — henüz kodda yok |
| [Sınıf süzgeci](sinif-ve-kademe-suzgeci.md) | 1–12 düğmeleri, İlkokul / Ortaokul / Lise kademe düğmeleri | Tasarlandı — henüz kodda yok |
| [Ders süzgeci](ders-suzgeci.md) | Kademe başlıkları altında dersler, sayılar, katlama | Tasarlandı — henüz kodda yok |
| [Arama](arama.md) | "Video, konu ya da eğitmen ara"; nerede arar, Türkçe harf eşleme | Tasarlandı — henüz kodda yok |
| [Sıralama](siralama.md) | En yeni, En çok izlenen, En çok beğenilen, En kısa | Tasarlandı — henüz kodda yok |
| [Etkin süzgeç çipleri ve temizleme](etkin-suzgecler.md) | "N video", × ile kaldırılan çipler, "Hepsini temizle", boş sonuç | Tasarlandı — henüz kodda yok |
| [Etiketler](etiketler.md) | LGS, TYT, AYT …; en çok 5; aramada bulunma | Tasarlandı — henüz kodda yok |
| [Ana sayfadaki öneri şeridi](ana-sayfa-seridi.md) | Ana sayfada son/önerilen videolar, "Tümünü gör" | Tasarlandı — henüz kodda yok |
| [İzleme sayfası](izleme-sayfasi.md) | Oynatıcı, düğme satırı, Paylaşan / Kanal / Sınıf ve ders / Etiketler | Tasarlandı — henüz kodda yok |
| [Oynatıcı](oynatici.md) | Denetim çubuğu, ilerleme çubuğu, balonlar, çubuğun gizlenmesi, YouTube bağdaştırma | Tasarlandı — henüz kodda yok |
| [Tam ekran](tam-ekran.md) | Düğme, f, çift tık | Tasarlandı — henüz kodda yok |
| [Klavye kısayolları](klavye-kisayollari.md) | m/k/boşluk, f, j/l, oklar, 0–9, ?; ne zaman çalışır | Tasarlandı — henüz kodda yok |
| [Oynatma hızı](hiz.md) | 0,25x–3x; YouTube'da 2x | Tasarlandı — henüz kodda yok |
| [Kalite](kalite.md) | 720p, 360p, Otomatik; YouTube'da otomatik | Tasarlandı — henüz kodda yok |
| [Ses ve sessiz](ses.md) | Ses düğmesi, kaydırıcı, ↑/↓ | Tasarlandı — henüz kodda yok |
| [Altyazı](altyazi.md) | İzleyenin seçicisi; eğitmenin .srt/.vtt eklemesi | Tasarlandı — henüz kodda yok |
| [Kaldığın yerden devam](kaldigi-yerden-devam.md) | Kaldığın saniye, kartta ilerleme, yalnız sende | Tasarlandı — henüz kodda yok |
| [Girişsiz izleme](girissiz-izleme.md) | Ziyaretçinin açabildikleri, "Bunun için giriş yap", veri tutulmaması | Tasarlandı — henüz kodda yok |
| [Beğen](begeni.md) | Kişi başına bir beğeni, sayı herkese açık | Tasarlandı — henüz kodda yok |
| [Kaydet ve Kaydettiklerim](kaydedilenler.md) | "Kaydet", liste hakkına sayılmayan "sonra izle" | Tasarlandı — henüz kodda yok |
| [Oynatma listeleri](oynatma-listeleri.md) | "Listeye ekle", yeni liste, 2 / 4 / sınırsız hak, 100 video, silme | Tasarlandı — henüz kodda yok |
| [Listeyi paylaş](listeyi-paylas.md) | Bağlantı oluştur, Kopyala, Paylaşmayı durdur, salt okunur liste | Tasarlandı — henüz kodda yok |
| [İndir ve İndirdiklerim](indirdiklerim.md) | Şifreli çevrimdışı indirme, 2 GB, 30 gün, YouTube indirilemez | Tasarlandı — henüz kodda yok |
| [İzleme geçmişi](izleme-gecmisi.md) | "İzleme geçmişim", tek tek silme, "Geçmişi temizle" | Tasarlandı — henüz kodda yok |
| [Videoyu bildir](bildir.md) | "Videoyu bildir" penceresi, nedenler, sonuç bildirimi | Tasarlandı — henüz kodda yok |
| [Eğitmen rolü](egitmen-rolu.md) | "Eğitmen yap", harfli kullanıcı adı, kanal ve tanıtım, rol alınınca / hesap silinince | Tasarlandı — henüz kodda yok |
| [Eğitmen paneli](egitmen-paneli.md) | `/panel/egitmen`: menü, kutucuklar, "Son videoların", "Dikkat" | Tasarlandı — henüz kodda yok |
| [Videolarım](videolarim.md) | Video satırı, Düzenle, Videomu kaldır, İndirmeye izin ver | Tasarlandı — henüz kodda yok |
| [Bilgisayardan video yükleme](video-yukleme.md) | Dosya seçme, tarayıcıda 720p dönüşüm, yükleme, yayına hazırlanma, iptal | Tasarlandı — henüz kodda yok |
| [YouTube bağlantısı](youtube-baglantisi.md) | Bağlantıyı doğrulama, kabul edilen biçimler, YouTube sınırları | Tasarlandı — henüz kodda yok |
| [Video bilgileri](video-bilgileri.md) | Başlık, Sınıf, Ders, Etiketler, Açıklama, Altyazı; zorunlu alanlar | Tasarlandı — henüz kodda yok |
| [Eğitmen serileri](egitmen-serileri.md) | Oynatma listelerim (4), "Herkese açık seri", video ekleme | Tasarlandı — henüz kodda yok |
| [İstatistikler](istatistikler.md) | Toplamlar, son 30 gün çizgisi, video başına tablo | Tasarlandı — henüz kodda yok |
| [Bildirilenler](bildirilenler.md) | Eğitmenin bildirim listesi; yönetimin kaldır / reddet kuyruğu | Tasarlandı — henüz kodda yok |
| [YouTube'dan kalkan videonun silinmesi](youtube-denetimi.md) | Günlük denetim, iki art arda kuralı, uyarı ve silme | Tasarlandı — henüz kodda yok |
| [İçerik sorumluluğu ve yükleme koşulları](sorumluluk-ve-kosullar.md) | Zorunlu onay, yedi maddelik koşullar, 5651, KVKK | Tasarlandı — henüz kodda yok |
| [Sınırlar ve site ayarları](sinirlar-ve-ayarlar.md) | Bütün sayısal sınırlar tek tabloda; yöneticinin üç ayarı | Tasarlandı — henüz kodda yok |

Okuma sırası:

- **Ziyaretçi:** [Girişsiz izleme](girissiz-izleme.md) → [Video listesi](video-listesi.md) → [Süzgeç mantığı](suzgec-mantigi.md) →
  [İzleme sayfası](izleme-sayfasi.md) → [Oynatıcı](oynatici.md) → [Klavye kısayolları](klavye-kisayollari.md).
- **Öğrenci (ve giriş yapmış herkes):** [Video listesi](video-listesi.md) → [Sınıf süzgeci](sinif-ve-kademe-suzgeci.md) →
  [Ders süzgeci](ders-suzgeci.md) → [Arama](arama.md) → [İzleme sayfası](izleme-sayfasi.md) → [Oynatıcı](oynatici.md) →
  [Kaldığın yerden devam](kaldigi-yerden-devam.md) → [Kaydet ve Kaydettiklerim](kaydedilenler.md) →
  [Oynatma listeleri](oynatma-listeleri.md) → [İndir ve İndirdiklerim](indirdiklerim.md) → [Videoyu bildir](bildir.md).
- **Eğitmen:** [Eğitmen rolü](egitmen-rolu.md) → [Eğitmen paneli](egitmen-paneli.md) → [YouTube bağlantısı](youtube-baglantisi.md) →
  [Bilgisayardan video yükleme](video-yukleme.md) → [Video bilgileri](video-bilgileri.md) →
  [İçerik sorumluluğu ve yükleme koşulları](sorumluluk-ve-kosullar.md) → [Videolarım](videolarim.md) →
  [Eğitmen serileri](egitmen-serileri.md) → [İstatistikler](istatistikler.md) → [Bildirilenler](bildirilenler.md) →
  [YouTube'dan kalkan videonun silinmesi](youtube-denetimi.md).
- **Yönetici ve destek:** [Eğitmen rolü](egitmen-rolu.md) → [Bildirilenler](bildirilenler.md) →
  [YouTube'dan kalkan videonun silinmesi](youtube-denetimi.md) → [Sınırlar ve site ayarları](sinirlar-ve-ayarlar.md).

## Rol tablosu

Hücre: o rolün bu alt özellikte yaptığı (bağlantı ilgili belgeye gider). "—": bu rol kullanmaz. Giriş yapmış rollerin (öğrenci, veli,
öğretmen, çalışan, müdür, servisçi) izleyici olarak yaptıkları aynıdır; eğitim içerikleri okula bağlı değildir, site genelidir.

| Alt özellik | Ziyaretçi | Öğrenci | Veli | Öğretmen | Çalışan | Müdür | Servisçi | Eğitmen | Destek | Yönetici |
|---|---|---|---|---|---|---|---|---|---|---|
| Adresler | [girişsiz açar](adresler.md) | [menüden açar](adresler.md) | [menüden açar](adresler.md) | [menüden açar](adresler.md) | [açar](adresler.md) | [menüden açar](adresler.md) | [ana siteden açar](adresler.md) | [panel adresi de](adresler.md) | [açar](adresler.md) | [açar](adresler.md) |
| Video listesi | [bölümsüz görür](video-listesi.md) | [bölümlerle görür](video-listesi.md) | [bölümlerle görür](video-listesi.md) | [bölümlerle görür](video-listesi.md) | [bölümlerle görür](video-listesi.md) | [bölümlerle görür](video-listesi.md) | [bölümlerle görür](video-listesi.md) | [bölümlerle görür; "+" ile video ekler](video-listesi.md) | [bölümlerle görür](video-listesi.md) | [bölümlerle görür](video-listesi.md) |
| Süzgeç mantığı | [süzer](suzgec-mantigi.md) | [süzer, bölüm seçer](suzgec-mantigi.md) | [süzer, bölüm seçer](suzgec-mantigi.md) | [süzer, bölüm seçer](suzgec-mantigi.md) | [süzer, bölüm seçer](suzgec-mantigi.md) | [süzer, bölüm seçer](suzgec-mantigi.md) | [süzer, bölüm seçer](suzgec-mantigi.md) | [süzer, bölüm seçer](suzgec-mantigi.md) | [süzer, bölüm seçer](suzgec-mantigi.md) | [süzer, bölüm seçer](suzgec-mantigi.md) |
| Sınıf süzgeci | [sınıf seçer](sinif-ve-kademe-suzgeci.md) | [sınıf seçer](sinif-ve-kademe-suzgeci.md) | [sınıf seçer](sinif-ve-kademe-suzgeci.md) | [sınıf seçer](sinif-ve-kademe-suzgeci.md) | [sınıf seçer](sinif-ve-kademe-suzgeci.md) | [sınıf seçer](sinif-ve-kademe-suzgeci.md) | [sınıf seçer](sinif-ve-kademe-suzgeci.md) | [videosuna sınıf seçer](sinif-ve-kademe-suzgeci.md) | [sınıf seçer](sinif-ve-kademe-suzgeci.md) | [sınıf seçer](sinif-ve-kademe-suzgeci.md) |
| Ders süzgeci | [ders seçer](ders-suzgeci.md) | [ders seçer](ders-suzgeci.md) | [ders seçer](ders-suzgeci.md) | [ders seçer](ders-suzgeci.md) | [ders seçer](ders-suzgeci.md) | [ders seçer](ders-suzgeci.md) | [ders seçer](ders-suzgeci.md) | [videosuna ders seçer](ders-suzgeci.md) | [ders seçer](ders-suzgeci.md) | [ders seçer](ders-suzgeci.md) |
| Arama | [arar](arama.md) | [arar](arama.md) | [arar](arama.md) | [arar](arama.md) | [arar](arama.md) | [arar](arama.md) | [arar](arama.md) | [arar; listesine video arar](arama.md) | [arar](arama.md) | [arar](arama.md) |
| Sıralama | [sıralar](siralama.md) | [sıralar](siralama.md) | [sıralar](siralama.md) | [sıralar](siralama.md) | [sıralar](siralama.md) | [sıralar](siralama.md) | [sıralar](siralama.md) | [sıralar](siralama.md) | [sıralar](siralama.md) | [sıralar](siralama.md) |
| Etkin süzgeç çipleri | [kaldırır, temizler](etkin-suzgecler.md) | [kaldırır, temizler](etkin-suzgecler.md) | [kaldırır, temizler](etkin-suzgecler.md) | [kaldırır, temizler](etkin-suzgecler.md) | [kaldırır, temizler](etkin-suzgecler.md) | [kaldırır, temizler](etkin-suzgecler.md) | [kaldırır, temizler](etkin-suzgecler.md) | [kaldırır, temizler](etkin-suzgecler.md) | [kaldırır, temizler](etkin-suzgecler.md) | [kaldırır, temizler](etkin-suzgecler.md) |
| Etiketler | [etiketle arar](etiketler.md) | [etiketle arar](etiketler.md) | [etiketle arar](etiketler.md) | [etiketle arar](etiketler.md) | [etiketle arar](etiketler.md) | [etiketle arar](etiketler.md) | [etiketle arar](etiketler.md) | [en çok 5 etiket koyar](etiketler.md) | [etiketle arar](etiketler.md) | [etiketle arar](etiketler.md) |
| Ana sayfadaki öneri şeridi | — | [sınıfına göre öneri](ana-sayfa-seridi.md) | [şeridi görür](ana-sayfa-seridi.md) | [şeridi görür](ana-sayfa-seridi.md) | [şeridi görür](ana-sayfa-seridi.md) | [şeridi görür](ana-sayfa-seridi.md) | [şeridi görür](ana-sayfa-seridi.md) | — | — | — |
| İzleme sayfası | [izler; düğmeler giriş ister](izleme-sayfasi.md) | [izler, düğmeleri kullanır](izleme-sayfasi.md) | [izler, düğmeleri kullanır](izleme-sayfasi.md) | [izler, düğmeleri kullanır](izleme-sayfasi.md) | [izler, düğmeleri kullanır](izleme-sayfasi.md) | [izler, düğmeleri kullanır](izleme-sayfasi.md) | [izler, düğmeleri kullanır](izleme-sayfasi.md) | [izler, düğmeleri kullanır](izleme-sayfasi.md) | [izler, düğmeleri kullanır](izleme-sayfasi.md) | [izler, düğmeleri kullanır](izleme-sayfasi.md) |
| Oynatıcı | [oynatır](oynatici.md) | [oynatır](oynatici.md) | [oynatır](oynatici.md) | [oynatır](oynatici.md) | [oynatır](oynatici.md) | [oynatır](oynatici.md) | [oynatır](oynatici.md) | [oynatır](oynatici.md) | [oynatır](oynatici.md) | [oynatır](oynatici.md) |
| Tam ekran | [kullanır](tam-ekran.md) | [kullanır](tam-ekran.md) | [kullanır](tam-ekran.md) | [kullanır](tam-ekran.md) | [kullanır](tam-ekran.md) | [kullanır](tam-ekran.md) | [kullanır](tam-ekran.md) | [kullanır](tam-ekran.md) | [kullanır](tam-ekran.md) | [kullanır](tam-ekran.md) |
| Klavye kısayolları | [kullanır](klavye-kisayollari.md) | [kullanır](klavye-kisayollari.md) | [kullanır](klavye-kisayollari.md) | [kullanır](klavye-kisayollari.md) | [kullanır](klavye-kisayollari.md) | [kullanır](klavye-kisayollari.md) | [kullanır](klavye-kisayollari.md) | [kullanır](klavye-kisayollari.md) | [kullanır](klavye-kisayollari.md) | [kullanır](klavye-kisayollari.md) |
| Oynatma hızı | [seçer](hiz.md) | [seçer](hiz.md) | [seçer](hiz.md) | [seçer](hiz.md) | [seçer](hiz.md) | [seçer](hiz.md) | [seçer](hiz.md) | [seçer](hiz.md) | [seçer](hiz.md) | [seçer](hiz.md) |
| Kalite | [seçer](kalite.md) | [seçer](kalite.md) | [seçer](kalite.md) | [seçer](kalite.md) | [seçer](kalite.md) | [seçer](kalite.md) | [seçer](kalite.md) | [seçer](kalite.md) | [seçer](kalite.md) | [seçer](kalite.md) |
| Ses ve sessiz | [ayarlar](ses.md) | [ayarlar](ses.md) | [ayarlar](ses.md) | [ayarlar](ses.md) | [ayarlar](ses.md) | [ayarlar](ses.md) | [ayarlar](ses.md) | [ayarlar](ses.md) | [ayarlar](ses.md) | [ayarlar](ses.md) |
| Altyazı | [seçer](altyazi.md) | [seçer](altyazi.md) | [seçer](altyazi.md) | [seçer](altyazi.md) | [seçer](altyazi.md) | [seçer](altyazi.md) | [seçer](altyazi.md) | [.srt / .vtt ekler](altyazi.md) | [seçer](altyazi.md) | [seçer](altyazi.md) |
| Kaldığın yerden devam | [tutulmaz](kaldigi-yerden-devam.md) | [kaldığı yerden sürer](kaldigi-yerden-devam.md) | [kaldığı yerden sürer](kaldigi-yerden-devam.md) | [kaldığı yerden sürer](kaldigi-yerden-devam.md) | [kaldığı yerden sürer](kaldigi-yerden-devam.md) | [kaldığı yerden sürer](kaldigi-yerden-devam.md) | [kaldığı yerden sürer](kaldigi-yerden-devam.md) | [kaldığı yerden sürer](kaldigi-yerden-devam.md) | [kaldığı yerden sürer](kaldigi-yerden-devam.md) | [kaldığı yerden sürer](kaldigi-yerden-devam.md) |
| Girişsiz izleme | [girişsiz izler](girissiz-izleme.md) | — | — | — | — | — | — | — | — | — |
| Beğen | [giriş ister](begeni.md) | [beğenir](begeni.md) | [beğenir](begeni.md) | [beğenir](begeni.md) | [beğenir](begeni.md) | [beğenir](begeni.md) | [beğenir](begeni.md) | [beğenir; toplamı görür](begeni.md) | [beğenir](begeni.md) | [beğenir](begeni.md) |
| Kaydet ve Kaydettiklerim | [giriş ister](kaydedilenler.md) | [kaydeder](kaydedilenler.md) | [kaydeder](kaydedilenler.md) | [kaydeder](kaydedilenler.md) | [kaydeder](kaydedilenler.md) | [kaydeder](kaydedilenler.md) | [kaydeder](kaydedilenler.md) | [kaydeder; kaydeden sayısını görür](kaydedilenler.md) | [kaydeder](kaydedilenler.md) | [kaydeder](kaydedilenler.md) |
| Oynatma listeleri | [giriş ister](oynatma-listeleri.md) | [2 liste](oynatma-listeleri.md) | [2 liste](oynatma-listeleri.md) | [2 liste](oynatma-listeleri.md) | [2 liste](oynatma-listeleri.md) | [2 liste](oynatma-listeleri.md) | [2 liste](oynatma-listeleri.md) | [4 liste](oynatma-listeleri.md) | [sınırsız](oynatma-listeleri.md) | [sınırsız](oynatma-listeleri.md) |
| Listeyi paylaş | [paylaşılanı açar](listeyi-paylas.md) | [paylaşır, durdurur](listeyi-paylas.md) | [paylaşır, durdurur](listeyi-paylas.md) | [paylaşır, durdurur](listeyi-paylas.md) | [paylaşır, durdurur](listeyi-paylas.md) | [paylaşır, durdurur](listeyi-paylas.md) | [paylaşır, durdurur](listeyi-paylas.md) | [paylaşır, durdurur](listeyi-paylas.md) | [paylaşır, durdurur](listeyi-paylas.md) | [paylaşır, durdurur](listeyi-paylas.md) |
| İndir ve İndirdiklerim | [giriş ister](indirdiklerim.md) | [indirir, internetsiz izler](indirdiklerim.md) | [indirir, internetsiz izler](indirdiklerim.md) | [indirir, internetsiz izler](indirdiklerim.md) | [indirir, internetsiz izler](indirdiklerim.md) | [indirir, internetsiz izler](indirdiklerim.md) | [indirir, internetsiz izler](indirdiklerim.md) | [indirir; iznini açar/kapatır](indirdiklerim.md) | [indirir, internetsiz izler](indirdiklerim.md) | [indirir, internetsiz izler](indirdiklerim.md) |
| İzleme geçmişi | [tutulmaz](izleme-gecmisi.md) | [görür, siler](izleme-gecmisi.md) | [görür, siler](izleme-gecmisi.md) | [görür, siler](izleme-gecmisi.md) | [görür, siler](izleme-gecmisi.md) | [görür, siler](izleme-gecmisi.md) | [görür, siler](izleme-gecmisi.md) | [görür, siler](izleme-gecmisi.md) | [görür, siler](izleme-gecmisi.md) | [görür, siler](izleme-gecmisi.md) |
| Videoyu bildir | [giriş ister](bildir.md) | [bildirir](bildir.md) | [bildirir](bildir.md) | [bildirir](bildir.md) | [bildirir](bildir.md) | [bildirir](bildir.md) | [bildirir](bildir.md) | [bildirir](bildir.md) | [bildirir; kuyruğa bakar](bildir.md) | [bildirir; kuyruğa bakar](bildir.md) |
| Eğitmen rolü | — | — | [destek talebiyle ister](egitmen-rolu.md) | [destek talebiyle ister](egitmen-rolu.md) | [destek talebiyle ister](egitmen-rolu.md) | [destek talebiyle ister](egitmen-rolu.md) | [destek talebiyle ister](egitmen-rolu.md) | [rolü taşır](egitmen-rolu.md) | [verir, alır](egitmen-rolu.md) | [verir, alır](egitmen-rolu.md) |
| Eğitmen paneli | — (404) | — (404) | — (404) | — (404) | — (404) | — (404) | — (404) | [kullanır](egitmen-paneli.md) | — (404) | — (404) |
| Videolarım | — | — | — | — | — | — | — | [düzenler, kaldırır](videolarim.md) | — | — |
| Bilgisayardan video yükleme | — | — | — | — | — | — | — | [yükler](video-yukleme.md) | — | — |
| YouTube bağlantısı | — | — | — | — | — | — | — | [bağlantı ekler](youtube-baglantisi.md) | — | — |
| Video bilgileri | — | — | — | — | — | — | — | [doldurur](video-bilgileri.md) | — | — |
| Eğitmen serileri | [serileri izler](egitmen-serileri.md) | [serileri izler](egitmen-serileri.md) | [serileri izler](egitmen-serileri.md) | [serileri izler](egitmen-serileri.md) | [serileri izler](egitmen-serileri.md) | [serileri izler](egitmen-serileri.md) | [serileri izler](egitmen-serileri.md) | [seri yapar](egitmen-serileri.md) | [serileri izler](egitmen-serileri.md) | [serileri izler](egitmen-serileri.md) |
| İstatistikler | — | — | — | — | — | — | — | [toplamları görür](istatistikler.md) | — | — |
| Bildirilenler | — | — | — | — | — | — | — | [kendi videolarınınkini okur](bildirilenler.md) | [kaldırır ya da reddeder](bildirilenler.md) | [kaldırır ya da reddeder](bildirilenler.md) |
| YouTube'dan kalkan videonun silinmesi | — | — | — | — | — | — | — | [uyarıyı görür, düzeltir](youtube-denetimi.md) | — | [aralığı ayarlar](youtube-denetimi.md) |
| İçerik sorumluluğu ve yükleme koşulları | [notu görür](sorumluluk-ve-kosullar.md) | [notu görür](sorumluluk-ve-kosullar.md) | [notu görür](sorumluluk-ve-kosullar.md) | [notu görür](sorumluluk-ve-kosullar.md) | [notu görür](sorumluluk-ve-kosullar.md) | [notu görür](sorumluluk-ve-kosullar.md) | [notu görür](sorumluluk-ve-kosullar.md) | [onaylar](sorumluluk-ve-kosullar.md) | [bildirimle kaldırır](sorumluluk-ve-kosullar.md) | [bildirimle kaldırır](sorumluluk-ve-kosullar.md) |
| Sınırlar ve site ayarları | [girişsiz sınırlar](sinirlar-ve-ayarlar.md) | [2 liste, 2 GB](sinirlar-ve-ayarlar.md) | [2 liste, 2 GB](sinirlar-ve-ayarlar.md) | [2 liste, 2 GB](sinirlar-ve-ayarlar.md) | [2 liste, 2 GB](sinirlar-ve-ayarlar.md) | [2 liste, 2 GB](sinirlar-ve-ayarlar.md) | [2 liste, 2 GB](sinirlar-ve-ayarlar.md) | [4 liste, 5 GB disk](sinirlar-ve-ayarlar.md) | [sınırsız liste](sinirlar-ve-ayarlar.md) | [üç ayarı değiştirir](sinirlar-ve-ayarlar.md) |

Rollerle ilgili notlar:

- **Eğitmen, destek ve yönetici** site geneli rollerdir; bir kişi aynı anda birden çoğunu taşıyabilir. Eğitmen yalnız yetişkin
  hesabıdır (öğrenci hesabı eğitmen olamaz); izleyici olarak herkes gibidir.
- **Servisçi** giriş yapmış herkes gibi izler; Tasarım 1'de servisçinin sol menüsünde "Eğitim içerikleri" yok, ana sitenin üst şeridinden
  açar.
- **Velide her çocuk ayrı oturumdur** (3 Ekim kararı); Kaydettiklerim, listeler, indirilenler ve geçmiş kişinin (hesabın) kendisinindir.
- **Tahta hesabı:** tanımda tahtanın görebildikleri en az yetkiyle sınırlı ve eğitim içerikleri o listede yok; tahta hesabının
  menüsünde bu bölüm yer almaz. Bölüm girişsiz açık olduğu için tahta cihazında videolar ana siteden giriş yapmadan izlenebilir.
- Rol kapıları: [Ziyaretçi](../roller/ziyaretci.md) · [Öğrenci](../roller/ogrenci.md) · [Veli](../roller/veli.md) ·
  [Öğretmen](../roller/ogretmen.md) · [Çalışan](../roller/calisan.md) · [Müdür](../roller/mudur.md) · [Servisçi](../roller/servisci.md) ·
  [Eğitmen](../roller/egitmen.md) · [Destek](../roller/destek.md) · [Yönetici](../roller/yonetici.md).

## Tasarım 1 önizlemesi ile tanım arasındaki farklar

Kodlanırken tanım (kullanıcının sözü) esas alınır; önizleme HTML işinde düzeltilecek:

- Kalite seçicisi önizlemede "1080p / 720p / 480p"; tanımda "720p / 360p / Otomatik" ([Kalite](kalite.md)).
- Hız önizlemede her videoda 3x'e kadar; tanımda YouTube videosunda 2x'e kadar ([Oynatma hızı](hiz.md)).
- Kartta eğitmenin tam adı yazıyor; kullanıcı "ismi değil hesap kullanıcı adı olsun" dedi ([Video listesi](video-listesi.md)).
- "Kanal:" satırı yüklenen videoda da var; tanımda yalnız YouTube videosunda ([İzleme sayfası](izleme-sayfasi.md)).
- Ziyaretçide tek "Kaydetmek için giriş yap" düğmesi ve girişsiz açılan "Bildir"; tanımda her düğme "Bunun için giriş yap" ister
  ([Girişsiz izleme](girissiz-izleme.md)).
- "İndir" eğitmenin "İndirmeye izin ver" anahtarına bakmıyor ([İndir ve İndirdiklerim](indirdiklerim.md)).
- Bildir nedenlerinde "Kişisel veri" yok ([Videoyu bildir](bildir.md)).
- Öğrenci tarafında "Paylaşmayı durdur" yok, paylaşım kimliği sayı ([Listeyi paylaş](listeyi-paylas.md)).
- Etiket ve süre süzgeci, "Genel/Yetişkin" sınıf seçeneği yok; "En kısa" sıralaması eklenmiş ([Süzgeç mantığı](suzgec-mantigi.md)).
- Arama eğitmenin tam adında da eşleşiyor; tanıma göre yalnız @kullanıcı adı ([Arama](arama.md)).
- Eğitmenin yüklediği video yalnız ilk seçtiği sınıfta çıkıyor; tanıma göre seçtiği her sınıfta ([Sınıf süzgeci](sinif-ve-kademe-suzgeci.md)).
- Eğitim içerikleri sayfasında eğitmenin **"+"** düğmesi yok (kullanıcının 28 Eylül sözü); video yalnız panelden ekleniyor
  ([Video listesi](video-listesi.md)).
- Eğitmenin Hesap ayarlarında tanımda olmayan "Kanal bağlantısı" ve "Kısa tanıtım" var; kanal videonun kendi YouTube bilgisinden değil
  bu ayardan geliyor ([Eğitmen rolü](egitmen-rolu.md), [YouTube bağlantısı](youtube-baglantisi.md)).
- Ana sayfa şeridi, izleme sayfasındaki açıklama ve "öbür videolar", serilerin izleyici tarafı, listenin sırayla oynaması, altyazı yazı
  boyutu, eğitmenin "aslını indir"i, yönetimin "Eğitmen yap"ı ve bildirim kuyruğu çizilmedi.

## İlgili öbür klasörler

- [Açılış sayfası ve girişsiz sayfalar](../acilis-sayfasi/README.md) — üst şeritteki "Eğitim içerikleri" bağlantısı, SSS'deki "Eğitim
  içerikleri" bölümü.
- [Site yönetimi](../yonetim/README.md) — paneller, kişi sayfası ("Eğitmen yap"), site ayarları.
- [Destek talepleri](../destek/README.md) — eğitmen olmak için talep; destek ekibinin yetkisi.
- [Hesap ayarları](../ayarlar/README.md) — eğitmenin kanal bağlantısı ve tanıtımı, "İzleme geçmişini temizle".
- [KVKK ve gizlilik](../kvkk-ve-gizlilik/README.md) — aydınlatma metni, dışarı giden veriler (YouTube), kim neyi görür.
- [Yazı düzenleyici](../yazi-yazma/README.md) — video açıklaması.
- [Uygulama ve indirme](../uygulama/README.md) — telefonda şifreli indirme alanı.
- [Ana sayfa](../ana-sayfa/README.md), [Menü, üst şerit ve arama](../menu-ve-arama/README.md) — öneri şeridi ve sol menüdeki bağlantı.
- [Dil ve çeviri](../dil/README.md) — girişsiz sayfalarda dil seçici; video açıklaması çevrilmez.
- [Bildirimler](../bildirim/README.md) — "Videona bildirim geldi", "Bir videon YouTube'dan kaldırılmış", sonuç bildirimleri.
