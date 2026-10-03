# Eğitim içerikleri · Altyazı

**Durum:** Tasarlandı — henüz kodda yok

Oynatıcının "Altyazı" seçicisi: YouTube videosunda YouTube'un altyazılarını (otomatik Türkçe dahil) açıp kapatır ve dil seçtirir;
Eğitim Evi'ne yüklenen videoda eğitmenin eklediği .srt ya da .vtt altyazılarını gösterir.

## Ne işe yarar

Kullanıcının 28 Eylül sözü: "altyazıyı unutma". İşitme güçlüğü olan, sessiz ortamda izleyen ya da Türkçesi zayıf öğrenci için.
YouTube'un otomatik Türkçe altyazısı, eğitmene YouTube'u önermenin bir nedeni daha.

## Nereden açılır

- **İzleyen:** oynatıcının alt çubuğunda kalite seçicisinin sağı: **"Altyazı: Türkçe"** / **"Altyazı: kapalı"** ([Oynatıcı](oynatici.md)).
- **Eğitmen:** Video yükle sayfasında ve "Videoyu düzenle" penceresinde **"Altyazı"** alanı ([Video bilgileri](video-bilgileri.md)).

## Adım adım

### Herkes (ziyaretçi dahil) — izlerken

1. Altyazı seçicisini aç: videonun altyazı dilleri ("Altyazı: Türkçe", "Altyazı: İngilizce" …) ve **"Altyazı: kapalı"**.
2. Birini seç; altyazı videonun üstünde çıkar ya da kapanır.
3. YouTube videosunda listede YouTube'daki altyazılar, YouTube'un otomatik Türkçe altyazısı dahil.
4. Tanıma göre yüklenen videoda yazı boyutu da seçilir ve seçtiğin dil ile boyut hatırlanır.

**Tasarımda (Tasarım 1 önizlemesi):** seçicide yalnız "Altyazı: Türkçe" ve "Altyazı: kapalı" var; yazı boyutu ve hatırlama yok.

### Eğitmen — altyazı eklerken

1. **YouTube bağlantısı** seçiliyse alanda yalnız şu not: "YouTube videosunda YouTube'un altyazıları kullanılır (YouTube'un otomatik
   Türkçe altyazısı dahil). İzleyen, oynatıcıdaki Altyazı düğmesinden dili seçer."
2. **Bilgisayardan yükle** seçiliyse: henüz altyazı yoksa "Henüz altyazı eklemedin." ve **"Altyazı ekle"** düğmesi.
3. **"Altyazı ekle"**ye bas; küçük form açılır:
   - **"Dil"** seçicisi: Türkçe, İngilizce, Almanca, Fransızca, Arapça, Rusça, İspanyolca. Zaten eklenmiş dil "(ekli)" diye
     seçilemez; ilk boş dil seçili gelir.
   - Dosya alanı: **"Altyazı dosyasını seç"**, altında "ya da buraya sürükle · .srt ya da .vtt · en çok 1 MB". Dosya seçince adı ve
     boyutu yazar ("başka dosya seçmek için dokun").
   - **"Vazgeç"** ve **"Ekle"**.
4. **"Ekle"**: altyazı listeye girer, ileti **"Türkçe altyazı eklendi."**. Listede her satır: altyazı simgesi, dil (kalın), dosya adı;
   .srt'den çevrildiyse yanında "· .srt dosyasından çevrildi"; sağda **"Sil"**.
5. **"Sil"** sorar: **"Türkçe altyazı silinsin mi?"** / "<dosya adı> bu videodan kaldırılır." → silinince **"Türkçe altyazı
   kaldırıldı."**
6. Alanın altında her zaman: ".srt ya da .vtt · her dil için bir dosya · .srt tarayıcıda .vtt'ye çevrilir · altyazı düz yazı olarak
   gösterilir."
7. Yedi dilin hepsi eklenince "Altyazı ekle" pasifleşir.

## Kurallar ve sınırlar

- **Dosya türü:** yalnız .srt ve .vtt. Başka dosya: **"Yalnız .srt ya da .vtt dosyası eklenir."**
- **Boyut:** en çok 1 MB. Büyükse: **"Altyazı dosyası en çok 1 MB olabilir (bu dosya 1,4 MB)."**
- **Dosyasız "Ekle":** **"Önce altyazı dosyasını seç."**
- **Aynı dil ikinci kez:** **"Türkçe altyazısı zaten var; önce onu sil."**
- **Her dile bir dosya;** birden çok dil olur.
- **.srt tarayıcıda .vtt'ye çevrilir;** liste dosya adını .vtt olarak gösterir.
- **Düz yazı:** altyazı metin olarak gösterilir, içindeki HTML çalışmaz.
- **Kendiliğinden altyazı üretme (konuşmayı yazıya çevirme) YOK:** dış servis gerektirir. YouTube'un otomatik altyazısı YouTube
  videosunda kullanılır.
- Videolarım satırında videonun altyazı dilleri yazar: "· altyazı: Türkçe, İngilizce" ([Videolarım](videolarim.md)).

## Kardeşler ve ilgili

**Kardeşler** (aynı klasör, [Eğitim içerikleri](README.md)):

- [Oynatıcı](oynatici.md) — seçicinin yeri.
- [Video bilgileri](video-bilgileri.md), [Videolarım](videolarim.md) — eğitmenin altyazı eklediği ve düzenlediği yerler.
- [YouTube bağlantısı](youtube-baglantisi.md) — YouTube altyazıları.

**İlgili:**

- [Aydınlatma metni](../kvkk-ve-gizlilik/aydinlatma-metni.md) — altyazı dosyaları metne girer.

## Kod tarafı

Bugün kodda yok. Yüklenen videoda tarayıcının `<track>` (WebVTT) özelliği, YouTube'da IFrame API'nin altyazı ayarı kullanılır.

## Sık sorulanlar

- **Altyazı seçeneği yok.** Eğitmen bu videoya altyazı eklememiş; YouTube videosunda da YouTube'da altyazı yoksa çıkmaz.
- **Kendi altyazımı nasıl eklerim (eğitmen)?** Video yükle ya da Düzenle'de "Altyazı ekle"; .srt ya da .vtt, en çok 1 MB.
- **Otomatik altyazı üretebilir misiniz?** Hayır; YouTube'a yüklersen YouTube'un otomatik Türkçe altyazısı kullanılır.

## Sırada

- Eğitim içerikleri (iş 17): altyazı (YouTube ve .srt/.vtt), yazı boyutu, tercih hatırlama.
