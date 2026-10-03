# Eğitim içerikleri · İndir ve İndirdiklerim (çevrimdışı, şifreli)

**Durum:** Tasarlandı — henüz kodda yok

Eğitim Evi'ne yüklenmiş ve eğitmenin "İndirmeye izin ver" dediği videoyu cihaza indirip internetsiz izleme: video uygulamanın ya da
tarayıcının İÇİNDE şifreli saklanır, dosya olarak dışarı verilmez; "İndirdiklerim"de boyut, "Çevrimdışı izle" ve "Sil" vardır.

## Ne işe yarar

Kullanıcının 29 Eylül sözleri: "öğrenciler video indirebilecek, indirilenler kısmı olacak", "indirme için YouTube gibi şifrelenmiş
şekilde yaparsak (YouTube indirmesi gibi)". İnterneti kısıtlı öğrenci okulda ya da evde Wi-Fi varken indirir, yolda izler.

## Nereden açılır

- İzleme sayfasında **"İndir · 84 MB"** düğmesi (yalnız indirilebilen videoda) ([İzleme sayfası](izleme-sayfasi.md)).
- Eğitim içerikleri sayfasının bölüm çiplerinde **"İndirdiklerim · N"** ([Video listesi](video-listesi.md)).

## Adım adım

### Giriş yapmış herkes (öğrenci, veli, öğretmen, çalışan, müdür, servisçi, eğitmen, destek, yönetici)

**İndirme:**

1. İndirilebilen bir videoda **"İndir · 84 MB"**e bas (boyut videonun boyutu). İndirme biter: düğme dolar, **"İndirildi · 84 MB"** olur;
   ileti **"İndirildi; uygulamada internetsiz izlersin."** Kartta **"· indirildi"** yazar.
2. **"İndirildi · 84 MB"**e yeniden basarsan sorar: **"İndirilenlerden silinsin mi?"** / "Video bu cihazdan silinir; internetle yine
   izleyebilirsin." → **"Sil"**; ileti **"İndirilenlerden silindi."**

**İndirdiklerim:**

1. **"İndirdiklerim · N"** çipine bas. Kartlar yerine satır listesi gelir; her satırda:
   - solda dersin renginde kapak (ortasında oynat simgesi, köşede süre) — basınca çevrimdışı oynar,
   - videonun adı, altında "7. sınıf · Matematik · @deniz.ak",
   - yeşil **"İnternetsiz izlenir"** işareti ve boyut ("84 MB"),
   - sağda **"Çevrimdışı izle"** ve **"Sil"**.
2. **"Çevrimdışı izle"**: video bu cihazdaki kopyadan oynar; pencerenin başlığında yeşil çip **"İndirilen kopya · internetsiz"**.
3. **"Sil"**: **"“Üslü ifadeler — LGS soru çözümü” indirilenlerden silinsin mi?"** / "Video bu cihazdan silinir; internetle yine
   izleyebilirsin." → ileti **"İndirilenlerden silindi."**
4. Listenin altında: **"Bu cihazda kullanılan alan: 84 MB · 1 video"**.
5. Hiç indirme yoksa: **"Henüz indirdiğin video yok."**; süzgeçle boş kaldıysa **"Bu süzgeçte indirdiğin video yok."**; ikisinin
   altında "Yalnız Eğitim Evi'ne yüklenen videolar indirilir; YouTube videoları indirilemez."

### Ziyaretçi (giriş yapmamış)

**"İndir"**e basınca **"Bunun için giriş yap"** ([Girişsiz izleme](girissiz-izleme.md)).

### Eğitmen

Videolarım'da her Eğitim Evi'ne yüklenmiş videonun yanında **"İndirmeye izin ver"** anahtarı ve **"N indirme"** sayısı
([Videolarım](videolarim.md)). Kendi videosunun ASLINI panelden dosya olarak indirebilir (tanım).

## Kurallar ve sınırlar

- **Yalnız Eğitim Evi'ne yüklenen ve eğitmenin izin verdiği video** indirilir. **YouTube videoları İNDİRİLEMEZ:** yt-dlp gibi araçlarla
  YouTube'dan indirmek YouTube kullanım koşullarına ve telif hakkına aykırı (site hukuken risk alır); kullanıcıya gerekçesiyle
  söylendi. YouTube videosunda yalnız "Kaydet" var.
- **Kimler:** giriş yapmış herkes (öğrenci dahil).
- **Şifreli saklama (YouTube çevrimdışı gibi):** video cihazda şifreli parçalar hâlinde durur (AES-GCM, parça parça); anahtar kişi +
  cihaz + video için sunucudan gelir, cihazda düz saklanmaz. Oynatırken parçalar tarayıcıda (MediaSource ile) çözülür; Android'de
  uygulamanın kendi şifreli alanı. Tarayıcıda IndexedDB.
- **Anahtar 30 gün geçerli:** 30 günde bir internete bağlanınca yenilenir. Hesap kapanır, rol alınır ya da video kaldırılırsa anahtar
  verilmez → indirilen video açılmaz ve silinir; video kaldırılınca bir sonraki açılışta cihazdan da silinir.
- **Dosya olarak dışarı verilmez:** "İndirdiklerim"den yalnız uygulama/tarayıcı içinde izlenir.
- **Cihaz başına 2 GB** (herkes için aynı).
- **Dürüstlük notu** (kullanıcıya söylendi): şifreleme kopyalamayı çok zorlaştırır ama tam DRM değildir; ekran kaydı her zaman
  mümkündür.
- **Eğitmen "İndirmeye izin ver"i kapatırsa** video yeni indirilemez; önceden indirilmiş kopyaların ne olacağı tanımda yazmıyor.

**Tasarımda (Tasarım 1 önizlemesi):** "İndir" düğmesi eğitmenin anahtarına bakmadan her yüklenen videoda çıkıyor; 2 GB sınırı ve
30 günlük anahtar gösterilmiyor; boyut, video süresinden tahmin edilen örnek değer.

## Kardeşler ve ilgili

**Kardeşler** (aynı klasör, [Eğitim içerikleri](README.md)):

- [Videolarım](videolarim.md) — "İndirmeye izin ver" anahtarı ve indirme sayısı.
- [İzleme sayfası](izleme-sayfasi.md) — "İndir" düğmesi.
- [Süzgeç mantığı](suzgec-mantigi.md) — "İndirdiklerim" bir bölümdür.
- [Kalite](kalite.md) — indirilen kopyanın kalitesi.
- [İstatistikler](istatistikler.md) — indirme toplamı.

**İlgili:**

- [Android uygulaması](../uygulama/android-uygulamasi.md) — uygulamanın şifreli alanı.
- [Tarayıcıdan uygulama olarak yükleme](../uygulama/tarayicidan-yukleme.md) — bilgisayarda ve iOS'ta.
- [Saklama süreleri](../kvkk-ve-gizlilik/saklama-sureleri.md).

## Kod tarafı

Bugün kodda yok. Kodlanınca kullanacağı bugünkü parçalar:

- Servis çalışanı ve önbellek: [public/sw.md](../../public/sw.md), [public/js/parcalar/04-pwa.md](../../public/js/parcalar/04-pwa.md).
- Parça parça video gönderimi: [sunucu/bolumler/odev-dosya.md](../../sunucu/bolumler/odev-dosya.md).
- Android tarafı ayrı depodadır (Egitim-Evi-App).

## Sık sorulanlar

- **YouTube videosunu neden indiremiyorum?** YouTube'un kuralları ve telif hakkı yüzünden; yalnız Eğitim Evi'ne yüklenen videolar
  indirilir.
- **İndirdiğim video açılmıyor.** 30 günden uzun süredir internete bağlanmadın, video kaldırıldı ya da hesabın kapandı; internete
  bağlanıp aç.
- **İndirdiğim videoyu bilgisayarıma dosya olarak alabilir miyim?** Hayır; yalnız uygulamanın/tarayıcının içinde izlenir.
- **Ne kadar indirebilirim?** Cihaz başına 2 GB.

## Sırada

- Eğitim içerikleri (iş 17): şifreli indirme (tanımdaki ek süre ~3 saat), İndirdiklerim, 2 GB sınırı, 30 günlük anahtar.
