# Ödevler · Ödeve dosya ekleme (öğretmenin ekleri)

**Durum:** Kodda var; tasarımda ek olarak ekler "Ekler" başlıklı açılır kapanır bir kutuda durur, fotoğraf/video/ses tıklayınca açılır ve videolar da yüklenmeden önce tarayıcıda küçültülür (Tasarım 1 önizlemesi, küçültme tanımı).

Öğretmenin ödevi verirken ya da düzenlerken ödeve çalışma kâğıdı, fotoğraf, video, ses gibi dosyalar eklemesi; öğrenci ve velinin bunları ödevin penceresinden indirmesi.

## Ne işe yarar

Kullanıcı 26 Eylül'de dosya göndermenin yerini şöyle seçti: "mesaj yazarken ve hoca ödev verirken koyabilir … drag and drop
kabul eder, basınca cihazdan seçmeyi ve birden fazla atmayı". 27 Eylül'de sınırı ödev başına 50 MB yaptı. Bu belge
**öğretmenin ödeve eklediği** dosyaları anlatır; öğrencinin ödeve **teslim ettiği** dosyalar ayrı bir iştir
([Teslim](teslim.md)). Mesaj ekleri aynı alanı kullanır ([Mesaj ekleri](../mesaj/ekler.md)).

## Nereden açılır

- Öğretmen: [Yeni ödev](odev-verme.md) ve [Ödevi düzenle](odevi-duzenleme-ve-silme.md) pencerelerindeki **"Dosya ekle"**
  alanı.
- Öğrenci ve veli: ödevin penceresinde **"Ekler"** listesi ([Ödevin penceresi](odev-penceresi.md)).
- Öğretmen: kontrol ekranının üstündeki ödev bilgisinde aynı **"Ekler"** listesi ([Sonuçlandırma](sonuclandirma.md)).

## Adım adım

### Öğretmen — dosya eklemek (bugünkü site)

1. Pencerede **"Dosya ekle: buraya sürükle ya da basıp seç"** alanını gör. Altında: "Birden çok dosya olur. Toplam en
   fazla 50 MB; dosyalar 7 gün sonra silinir. Büyük fotoğraflar küçültülerek yüklenir."
2. Dosyaları alana sürükleyip bırak ya da alana basıp cihazından seç (birden çok dosya seçebilirsin).
3. Her dosya seçilir seçilmez yüklenmeye başlar; listede satırı çıkar: dosya simgesi, adı, altında boyutu ve durumu:
   - **"1,2 MB · yükleniyor"** ve ilerleme çubuğu,
   - **"1,2 MB · yüklendi"**,
   - büyük fotoğrafta önce **"Küçültülüyor…"**, sonra **"8,4 MB → 620 KB · yüklendi"**,
   - sorun olursa kırmızı satırda nedeni (aşağıda "Kurallar").
4. Listenin üstünde doluluk çubuğu: **"Dosya alanın · 32 / 50 MB"**. Alan dolunca bırakma alanı gizlenir ve **"Bu ödev için
   dosya alanın doldu (50 MB). Yer açmak için bir dosyanı kaldır."** yazar.
5. Yanlış dosyayı satırındaki **"Kaldır"** ile çıkar (yükleniyorsa durur).
6. Yükleme sürerken "Ödevi ver"e basarsan **"Dosyalar yükleniyor; bitince kaydet."** (turuncu). Yüklemeler bitince yeniden bas.
7. Ödev verilince dosyalar ödeve bağlanır.

### Öğretmen — ekleri düzenlemek

"Ödevi düzenle"de var olan ekler listede durur (süresi dolanlar listeye gelmez); **"Kaldır"** dediklerin "Kaydet"te ödevden
silinir, yeni seçtiklerin eklenir. Kalan eklerle yenilerin toplamı yine en çok 50 MB.

### Öğrenci ve veli — ekleri indirmek

1. Ödevin satırına bas; açılan pencerede açıklamanın altında **"Ekler"** başlığı.
2. Her satırda dosya adı ve **"1,2 MB · 5 gün sonra silinir"** ("bugün silinir", "yarın silinir"), sağda **"İndir"**.
3. Süresi dolan ek soluk görünür: **"süresi doldu, silindi"** (İndir düğmesi yok).
4. Quizli ödevde listenin ilk satırı quizdir ([Quiz çözme](../quiz/quiz-cozme.md)).
5. "İndir" önce kısa ömürlü bir indirme bağlantısı ister, dosya doğrudan cihaza iner.

Veli bugün ekleri, çocuğunun portalına girip "Ödevleri"nden açtığı pencerede görür; velinin kendi "Ödevler" listesinden
açılan pencere yalnız teslim dosyalarını gösterir ([Ödevin penceresi](odev-penceresi.md)).

Tasarımda (Tasarım 1 önizlemesi):

- "Yeni ödev" penceresinde **"Ekler:"** satırı: **"Dosyaları buraya sürükle ya da [Dosya seç]"**, altında eklenen dosyalar
  (simge, ad, boyut, **"Sil"**) ve çubuk **"2 dosya · 1,8 MB / 50 MB"**. 50 MB'ı aşan dosya eklenmez: **"1 dosya eklenmedi:
  toplam 50 MB'ı aşıyor."**
- Kontrol ekranında **"Ödevin ekleri (2)"** listesi.
- Okuma tarafında ekler **"Ekler"** başlıklı, açılır kapanır bir kutuda (kullanıcının "Ekler açılır listesi").
- Eke basınca hemen inmez: fotoğraf ve ses pencerede açılır, video önce oynat simgesiyle gelir, altında MB boyutu yazar;
  öbür dosyalarda "indirilsin mi?" diye sorulur (kullanıcı 26 Eylül: "direkt inmez … boşuna internet kullanmasın, altında
  boyutu yazsın MB şeklinde").
- Videolar da (yalnız fotoğraflar değil) yüklenmeden önce tarayıcıda küçültülür; tarayıcı küçültemez ve dosya sınırı aşarsa
  yükleme "Videoyu 720p olarak kaydet" iletisiyle reddedilir ([Telefonda küçültme](../okul-disk/telefonda-kucultme.md)).
  Bu karar küçültme tanımında 29 Eylül'deki mantık denetiminden gelir: kullanıcı soruyu cevaplamadı, öneri karar sayıldı.

## Kurallar ve sınırlar

- **Kim ekler:** onaylı öğretmen (ya da müdür) ve "Ödev verir" yetkisiyle. Öğrenci ve veli ödeve ek koyamaz (öğrenci teslim
  dosyası yükler). Yetkisizse **"Bu türde dosya ekleme yetkin yok"**.
- **Boyut:** tek dosya en çok 50 MB (**"Bir dosya en fazla 50 MB olabilir."**); bir ödevin eklerinin toplamı en çok 50 MB
  (pencere: **"Sığmıyor: 3,4 MB boş yer kaldı."** / **"Dosya alanın doldu."**; kayıtta: **"Eklerin toplamı en fazla 50 MB
  olabilir. Bir dosyayı kaldır."**).
- **Sayı:** bir ödevde en çok 20 ek: **"En fazla 20 dosya eklenebilir."**
- **Türler:** belgeler (pdf, doc, docx, odt, rtf, txt, xls, xlsx, ods, csv, ppt, pptx, odp, key, pages, numbers), resimler
  (jpg, jpeg, png, gif, webp, heic, heif, bmp, tif, tiff, svg, psd, ai), ses ve video (mp3, m4a, wav, ogg, aac, flac, mp4, mov,
  m4v, webm, avi, mkv, 3gp), arşiv ve kod (zip, rar, 7z, sb3, ggb, py, ipynb, html, css, js, java, c, cpp). Öbürleri: pencerede
  **"Bu dosya türü eklenemez."**, sunucuda **"Bu dosya türü eklenemez. PDF, Word, Excel, sunum, resim, ses, video ya da zip
  ekleyebilirsin."** Boş dosya: **"Boş dosya."**
- **Taslak:** dosya seçilince "taslak" olarak yüklenir, ödev verilince bağlanır. Gönderilmeyen taslaklar 6 saat sonra silinir.
  Bir kişinin gönderilmemiş bütün taslakları en çok 150 MB: **"Gönderilmemiş eklerin toplamı en fazla 150 MB olabilir. Başka
  bir mesajda ya da ödevde bıraktığın ekleri kaldır; gönderilmeyen ekler 6 saat sonra kendiliğinden silinir."** Başkasının
  taslağı ödeve bağlanamaz; süresi dolan taslakta **"Eklerden biri bulunamadı ya da süresi doldu. Yeniden ekle."**
- **Saklama:** ek dosyası yüklendikten **7 gün** sonra silinir — ödev uzun sürse bile. Ödev yerinde kalır, ekin satırında
  "süresi doldu, silindi" yazar; gerekirse öğretmen yeniden ekler ([Saklama ve silinme](saklama-ve-silinme.md)).
- **Kim indirir:** ödevi veren öğretmen, okulun müdürü, ödevin öğrencileri ve bu öğrencilerin bağlı velileri. Başkası için ek
  yokmuş gibi: **"Dosya bulunamadı"**. Süresi dolmuşsa **"Dosyanın süresi doldu (7 gün)."** İndirme bağlantısı 60 saniye geçerli,
  tek kullanımlık; süresi geçerse **"İndirme bağlantısının süresi doldu. Yeniden dene."** Dosya her zaman indirilir, tarayıcıda
  sayfa olarak açılmaz.
- **Hız ve yer:** kişi başına saatte en çok 100 yükleme (**"Bu saat içinde çok fazla dosya yükledin."**) ve 300 indirme
  (**"Çok fazla indirme yaptın. Biraz bekle."**); okulun dosya alanı dolunca **"Okulunun dosya alanı doldu. Okul yönetimi eski
  dosyaları sildirebilir ya da yöneticiden alan isteyebilir."**; sunucu diskinde yer yoksa **"Sunucuda yer kalmadı. Biraz sonra
  dene."**; aynı anda çok yükleme varsa **"Aynı anda çok fazla yükleme var. Biri bitince dene."** Ek, yükleyenin okulunun dosya
  alanına sayılır ([Okul disk sınırı](../okul-disk/disk-siniri.md)).
- **Küçültme:** büyük fotoğraf yüklenmeden önce tarayıcıda küçültülür, sınırlar küçülmüş boyuta uygulanır
  ([Telefonda küçültme](../okul-disk/telefonda-kucultme.md)).
- **Bağlantı koparsa** satırda **"Bağlantı koptu."**, sunucu başka bir kodla dönerse **"Yüklenemedi (NNN)"** ya da sunucunun
  iletisi.
- **Ödevler kapalı okulda** ödev eki yüklenemez: **"Ödevler bu okulda kapalı."**

## Kardeşler ve ilgili

**Kardeşler:** [Ödev verme](odev-verme.md) · [Ödevi düzenleme ve silme](odevi-duzenleme-ve-silme.md) ·
[Ödevin penceresi](odev-penceresi.md) · [Teslim](teslim.md) (öğrencinin dosyaları) ·
[Saklama ve silinme](saklama-ve-silinme.md).

**İlgili:** [Mesaj ekleri](../mesaj/ekler.md) (aynı alan), [Telefonda küçültme](../okul-disk/telefonda-kucultme.md),
[Doluluk](../okul-disk/doluluk.md), [Fotoğraf ekle (yazı düzenleyici)](../yazi-yazma/fotograf-ekle.md),
[Kim neyi görür](../kvkk-ve-gizlilik/kim-neyi-gorur.md).

## Kod tarafı

- Ön yüz: [public/js/parcalar/04d-ekler.md](../../public/js/parcalar/04d-ekler.md) — `ekAlani('odev', 'odev')`, `ekAlaniKur`,
  `ekDosyalariEkle`, `ekYukle` (`POST /api/ek/yukle?tur=odev`), `ekListesiCiz`, `dolulukCubugu`, `ekIdleri`,
  `ekSilinecekler`, `ekYukleniyor`, `ekListesiGoster` (okuma tarafı), `EYLEMLER['ek-indir']`;
  [04f-resim-kucult.md](../../public/js/parcalar/04f-resim-kucult.md) (küçültme);
  [11-ogretmen-odev.md](../../public/js/parcalar/11-ogretmen-odev.md) (pencerelere yerleşim);
  [14-odev-filtre.md](../../public/js/parcalar/14-odev-filtre.md) (`odev-oku` penceresinde `ekListesiGoster`).
- Sunucu: [sunucu/bolumler/ekler.md](../../sunucu/bolumler/ekler.md) — `yukle` (yetki, 50 MB, uzantı, 150 MB taslak, okul
  alanı), `GET /api/ek/bilet`, `GET /api/ek/indir?bilet=`, `POST /api/ek/sil`, `ekleriDogrula` (20 dosya, 50 MB),
  `ekleriBagla`, `gorebilir`; [sunucu/bolumler/odev.md](../../sunucu/bolumler/odev.md) (`ekIdler`, `ekSilIdler`);
  [sunucu/bolumler/okul-disk.md](../../sunucu/bolumler/okul-disk.md).
- Depo: [sunucu/veri/depo/ekler.md](../../sunucu/veri/depo/ekler.md) — `ekler` tablosu (taslak, bağ, `bitis` = yükleme + 7 gün).
- Testler: [testler/test-yorum-ek.md](../../testler/test-yorum-ek.md) (ödev eklerinin eklenmesi, kaldırılması, boyut),
  [testler/test-okul-disk.md](../../testler/test-okul-disk.md), [testler/test-resim-kucult.md](../../testler/test-resim-kucult.md).
- Kullanıcıya dönük anlatım: [belge/KILAVUZ.md](../../belge/KILAVUZ.md) ("Ekler (mesaj ve ödev)").

## Sık sorulanlar

- **Eklediğim PDF bir hafta sonra kayboldu.** Ekler 7 gün saklanır; ödev uzun sürüyorsa "Ödevi düzenle"den yeniden ekle.
- **Öğrenci ekleri silebilir mi?** Hayır; eki yalnız yükleyen öğretmen kaldırır.
- **Video ekleyebilir miyim?** Evet (mp4, mov, webm…), 50 MB'a sığdığı sürece.
- **Neden "Dosyalar yükleniyor; bitince kaydet." diyor?** Bir dosya hâlâ yükleniyor ya da küçültülüyor; satırların "yüklendi"
  olmasını bekle.

## Sırada

- Sunucuda küçültme ve aynı dosyanın tek kopya tutulması (iş 1).
- Tasarımdaki açılır "Ekler" kutusu ve ekin tıklayınca açılması (fotoğraf, video, ses).
- Bütün videoların tarayıcıda küçültülmesi (küçültme tanımındaki karar).
- Düzenleyiciler: ödev açıklamasına fotoğraf ekleme ayrıca yazı düzenleyicinin "Fotoğraf ekle" düğmesiyle olacak.
