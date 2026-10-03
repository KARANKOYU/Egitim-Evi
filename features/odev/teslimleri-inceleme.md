# Ödevler · Teslimleri inceleme ve indirme

**Durum:** Kodda var; tasarımda ek olarak silinme günü geçen teslimin yerinde soluk bir iz ("3 ek · son teslimden 7 gün sonra silindi") kalır ve ek penceresinde fotoğraf hemen görünür (Tasarım 1 önizlemesi).

Öğretmenin ödevin kontrol ekranında her öğrencinin yüklediği dosyaları "N ek" olarak görmesi, fotoğraf/video/sesi indirmeden açması, öbür dosyaları sorarak indirmesi, uygunsuz dosyayı silmesi ve bütün teslimleri tek zip olarak indirmesi.

## Ne işe yarar

Kullanıcı 26 Eylül'de istedi: "hoca ödevi kontrol ederken öğrenci altında … sayıda ek yazar; tıklayınca dosyaysa indirir;
video, foto veya mp3 ise direkt oradan görüntülenebilir"; hemen ardından: "direkt inmez, üzerine tıklarsa önce videoysa oynat
butonu … boşuna internet kullanmasın, altında boyutu yazsın MB şeklinde". Böylece öğretmen sonuç seçmeden önce teslimlere
bakar, kalabalık sınıfta hepsini tek seferde bilgisayarına alır.

## Nereden açılır

- **Öğretmen:** "Ödevler" → ödevin satırında **"Sonuçlandır"** (ya da "Sonuçları düzenle") → kontrol ekranı. Öğrencinin
  adının altında **"3 ek"**; "Öğrenciler" başlığının yanında **"Teslimleri indir (12,4 MB)"**.
- **Müdür:** öğretmeni okuldan ayrılmış (sahipsiz) ödevin kontrol ekranında aynısı; ayrıca öğrencinin portalından ödevin
  penceresinde o öğrencinin dosyaları ([Müdürün ödev görünümü](mudurun-odev-gorunumu.md)).

## Adım adım

### Öğretmen — bir öğrencinin ekleri

1. Kontrol ekranında öğrencinin altındaki **"3 ek"** bağlantısına bas (yalnız dosya yükleyen öğrencide çıkar).
2. Başlığı **"Elif Yılmaz — 3 ek"** olan pencere açılır. Hiçbir dosya kendiliğinden yüklenmez; her dosya bir kutucuk:
   simge (video, ses, fotoğraf ya da belge), dosya adı, **"1,4 MB"** (çok küçükse "0,1 MB'tan küçük"), **"5 gün sonra
   silinir"**; kutucuğun altında **"Sil"**. Üzerine gelince ne olacağı yazar: "Video — oynat", "Ses — dinle", "Fotoğraf —
   aç", "Dosya — indir".
3. Pencerenin altında: **"Fotoğraf, video ve ses tıklayınca burada açılır; öbür dosyalar sorup bilgisayarına iner. Uygunsuz bir
   dosyayı silebilirsin. Dosyalar son teslimden 7 gün sonra silinir."**
4. **Fotoğrafa** (jpg, jpeg, png, gif, webp, bmp) basınca pencerede açılır; **videoya** (mp4, m4v, webm, mov) basınca oynatıcıda
   kendiliğinden oynar, ileri sarılabilir; **sese** (mp3, m4a, wav, ogg, aac) basınca çalar. Pencerenin başlığı dosyanın adı,
   altında boyutu; düğmeler **"Eklere dön"** ve **"İndir"**.
5. **Öbür dosyalarda** (pdf, docx, zip…) önce sorar: **""odev.pdf" (0,6 MB) indirilsin mi?"** — onaylarsan iner.
6. Uygunsuz dosyayı **"Sil"** → **"Dosya silinsin mi?"** → pencere yenilenir. Öğrencinin dosyası kalmadıysa **"Dosya kalmadı."**

### Öğretmen — hepsini indirmek

1. Kontrol ekranında **"Teslimleri indir (12,4 MB)"** düğmesine bas (en az bir dosya varsa görünür; parantezde toplam boyut).
2. Tarayıcı **"Oran orantı - teslimler.zip"** adlı tek dosyayı indirir. İçinde her öğrencinin klasörü (**"Elif Yılmaz/odev.pdf"**);
   aynı adlı iki dosya varsa ikincisi **"odev (2).pdf"**.

### Öğrenci ve veli

Öğrenci kendi dosyalarını, veli çocuğunun dosyalarını ödevin penceresinden görür ve indirir ([Teslim](teslim.md)); başkasının
dosyasını göremez.

### Tasarımda (Tasarım 1 önizlemesi)

- Kontrol ekranında öğrencinin altında ek simgeli **"3 ek"** düğmesi; son teslimden 7 gün geçmişse düğme yerine soluk yazı:
  **"3 ek · son teslimden 7 gün sonra silindi"**.
- Basınca **"Elif Yılmaz · 3 ek"** penceresi: üstte ödevin adı; her dosya için simge, ad, boyut; fotoğraf hemen pencerede
  görünür, video ve ses kendi oynatıcısıyla (oynat düğmesi) durur, öbür dosyalarda **"İndir"** düğmesi. Altta **"Kapat"**.
- Önizlemede "Teslimleri indir" (zip) ve "Sil" yok; kullanıcı bunlar için bir şey söylemedi, bugünkü site gibi kalırlar.

## Kurallar ve sınırlar

- **Kim görür:** ödevi veren öğretmen ve okulun müdürü bütün teslimleri; öğrencinin kendisi ve bağlı velisi yalnız o öğrencinin
  dosyalarını. Ödevi vermediği bir öğrencinin portalına giren öğretmen: **"Bu dosyaları görme yetkin yok"**. Her indirmede
  (biletle bile) yetki yeniden denetlenir: **"Bu dosyayı görme yetkin yok"**, dosya yoksa **"Dosya bulunamadı"**.
- **Zip:** yalnız ödevi yöneten (veren öğretmen ya da okulun müdürü): **"Toplu indirmeyi yalnızca ödevi veren öğretmen
  yapabilir"**. Dosya yoksa **"İndirilecek dosya yok"**; toplam 3500 MB'ı geçerse **"Dosyalar tek zip için çok büyük; öğrenci
  öğrenci indir."** Saatte en çok 20 zip: **"Çok fazla toplu indirme yaptın. Biraz bekle."** Zip sıkıştırmasızdır, diske
  akarak iner.
- **Tek dosya:** saatte en çok 300 indirme ya da açma: **"Çok fazla indirme yaptın. Biraz bekle."** İndirme bağlantısı 60 saniye,
  açma (gösterme) bağlantısı 5 dakika geçerli; süresi geçerse **"İndirme bağlantısının süresi doldu. Yeniden dene."**
- **Güvenlik:** dosya her zaman "ek" olarak iner, tarayıcıda sayfa olarak çalışmaz. Tarayıcıda yalnız fotoğraf, video ve ses
  açılır; tür uzantıdan belirlenir, içerik sezdirilmez; SVG ve HTML hiçbir zaman açılmaz, yalnız iner. Açılamayan türde
  **"Bu dosya tarayıcıda açılamaz; indir."** Dosya diskte yoksa **"Dosya sunucuda bulunamadı"**.
- **Silme:** öğretmen ve müdür her zaman siler (izin kapalı ya da süre dolmuş olsa da). Silmek öğrenciye bildirim göndermez.
- **Bilinen açıklar:** silince arkadaki kontrol ekranındaki "3 ek" rozeti ve "Teslimleri indir (… MB)" ekran yeniden açılana
  kadar eski sayıyı gösterir; medya penceresinde "Kapat" düğmesi yok (dışına basarak kapanır); indirmenin kendisi başarısız
  olursa (bağlantı dolduysa) bu yalnız tarayıcının indirme çubuğunda görünür.
- **Silinme zamanı:** öğrencinin yüklediği dosyalar son teslimden 7 gün sonra kendiliğinden silinir ([Saklama ve silinme](saklama-ve-silinme.md)).

## Kardeşler ve ilgili

**Kardeşler:** [Teslim](teslim.md) · [Sonuçlandırma](sonuclandirma.md) (aynı kontrol ekranı) ·
[Dosya yükleme izni](dosya-yukleme-izni.md) · [Teslim metni](teslim-metni.md) · [Saklama ve silinme](saklama-ve-silinme.md) ·
[Müdürün ödev görünümü](mudurun-odev-gorunumu.md).

**İlgili:** [Öğrencinin quiz cevapları](../quiz/ogrencinin-cevaplari.md) (aynı ekrandaki quiz rozeti),
[Mesaj ekleri](../mesaj/ekler.md), [Kim neyi görür](../kvkk-ve-gizlilik/kim-neyi-gorur.md).

## Kod tarafı

- Ön yüz: [public/js/parcalar/14b-odev-teslim.md](../../public/js/parcalar/14b-odev-teslim.md) — `ogretmenTeslimleri`
  ("N ek" rozetleri, "Teslimleri indir (… MB)"), `teslimOgrenciAc` (öğrencinin ek penceresi), `teslimOgesi`, `TESLIM_MEDYA`,
  `EYLEMLER['teslim-oge']` (göster ya da sorup indir), `teslim-zip`, `teslim-sil`, `biletleIndir`;
  [11-ogretmen-odev.md](../../public/js/parcalar/11-ogretmen-odev.md) (`odevAc` kontrol ekranını çizip `ogretmenTeslimleri`'ni çağırır).
- Sunucu: [sunucu/bolumler/odev-dosya.md](../../sunucu/bolumler/odev-dosya.md) — liste (`yonetir` → bütün dosyalar + toplam),
  `GET /api/odev-dosya/bilet?tur=dosya|goster|zip`, `indir`, `goster` (`medyaGonder`: Range, sandbox), `zip` (`zipGonder`:
  öğrenci klasörleri, aynı ad "(2)"), `sil`, `dosyaErisimi`, `zipErisimi`.
- Depo: [sunucu/veri/depo/odev-dosyalari.md](../../sunucu/veri/depo/odev-dosyalari.md) (`odevin`: öğrenci adına ve yükleme
  sırasına göre, silinme anıyla).
- Testler: [testler/test-odev-dosya.md](../../testler/test-odev-dosya.md) (zip'in geçerliliği, öğrenci klasörleri, CRC32,
  `goster` ve Range, başka öğretmenin/bağsız velinin erişememesi).
- Kullanıcıya dönük anlatım: [belge/KILAVUZ.md](../../belge/KILAVUZ.md) ("Öğretmenin kontrol ekranında ekler").

## Sık sorulanlar

- **Videoyu indirmeden izleyebilir miyim?** Evet; mp4, webm, mov pencerede oynar ve ileri sarılabilir.
- **Bütün sınıfın dosyalarını tek seferde alabilir miyim?** "Teslimleri indir" ile tek zip.
- **Öğrencinin uygunsuz dosyasını kaldırabilir miyim?** Evet, ek penceresinde "Sil".
- **"3 ek" yazıyor ama pencerede 2 dosya var.** Bu arada bir dosya silindi; kontrol ekranını yeniden aç.

## Sırada

- Sunucuda küçültme ve aynı dosyanın tek kopya tutulması (iş 1).
- Android uygulaması: öğretmenin kontrol ekranında "N ek" ve teslimleri açma uygulamaya gelecek.
