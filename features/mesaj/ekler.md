# Mesajlar · Mesaj ekleri

**Durum:** Kodda var; tasarımda ek olarak tam genişlikte açılır "Ekler (N)" kutusu, "N / 10 dosya" sayacı, her satırda silinme tarihi, eke basınca türüne göre önizleme (fotoğraf, ses, video) ya da "indirilsin mi?" sorusu (Tasarım 1 önizlemesi; kullanıcının 1 Ekim kararı).

Mesaja ya da duyuruya dosya (belge, fotoğraf, ses, video, arşiv) eklemek ve alıcının bu dosyaları indirmesi.

## Ne işe yarar

İzin formu, kaynak kitap listesi, etkinlik afişi gibi belgeleri mesajla göndermek için. Kullanıcı 26 Eylül'de "mesaj yazarken
ve hoca ödev verirken koyabilir … altta dosyalar yani ekler kısmı olur; drag and drop kabul eder, basınca cihazdan seçmeyi ve
birden fazla atmayı" dedi; 27 Eylül'de sınırı mesaj başına 50 MB yaptı ve dosyaların bir hafta sonra silinmesini istedi.
1 Ekim'de "Ekler" düğmesinin uzun, basınca dosyaları altında açılır liste olarak gösteren bir düğme olmasını istedi.

## Nereden açılır

- **Eklemek:** "Mesajlar" → "Yeni mesaj" → pencerenin altındaki ek alanı ([Yeni mesaj ve alıcı seçimi](yeni-mesaj.md)).
- **İndirmek:** mesajın penceresinde metnin altındaki **"Ekler"** listesi ([Mesajı okuma](mesaj-okuma.md)).

## Adım adım

### Gönderen — eklemek (bugünkü site)

1. "Yeni mesaj" penceresinin altında bırakma alanı: **"Dosya ekle: buraya sürükle ya da basıp seç"**, altında küçük yazı:
   **"Birden çok dosya olur. Toplam en fazla 50 MB; dosyalar 7 gün sonra silinir. Büyük fotoğraflar küçültülerek yüklenir."**
2. Dosyaları alana sürükle ya da alana basıp cihazdan seç (birden çok olur).
3. Her dosya seçilir seçilmez yüklenmeye başlar (taslak). Satırda dosya adı, altında **"1,2 MB · yükleniyor"** ve ilerleme
   çubuğu; bitince **"1,2 MB · yüklendi"**. Büyük fotoğrafta önce **"Küçültülüyor…"**, sonra **"8,4 MB → 620 KB · yüklendi"**.
4. İlk dosyadan sonra doluluk çubuğu çıkar: **"Dosya alanın · 12 / 50 MB"**. Dolunca bırakma alanı gizlenir ve **"Bu mesaj için
   dosya alanın doldu (50 MB). Yer açmak için bir dosyanı kaldır."** yazar.
5. Yanlış dosyayı satırdaki **"Kaldır"** ile çıkar (yükleniyorsa yükleme durur, yüklendiyse sunucudaki taslak da silinir).
6. Yükleme sürerken "Gönder"e basarsan: **"Dosyalar yükleniyor; bitince gönder."** Bitince gönder; ekler mesaja bağlanır.
7. Yüklenemeyen dosya kırmızı satırda nedeniyle kalır: **"Boş dosya."**, **"Bu dosya türü eklenemez."**, **"Sığmıyor: 3,4 MB boş
   yer kaldı."**, **"Dosya alanın doldu."**, **"Bağlantı koptu."** ya da sunucunun iletisi.

### Alıcı (ve gönderen) — indirmek (bugünkü site)

1. Mesajı aç; metnin altında **"Ekler"** başlıklı liste.
2. Her satırda dosya adı, altında boyut ve silinme günü: **"1,2 MB · 5 gün sonra silinir"** (ya da **"yarın silinir"**,
   **"bugün silinir"**); sağda **"İndir"**.
3. **"İndir"**: dosya doğrudan cihazına iner (tarayıcıda sayfa olarak açılmaz).
4. Süresi dolan ek soluk satırda **"süresi doldu, silindi"** yazar, "İndir" çıkmaz.

### Tasarımda (Tasarım 1 önizlemesi)

- Yazarken ve okurken tam genişlikte **"Ekler (N)"** düğmesi; basınca dosyalar altında açılır liste olur (yeniden basınca kapanır).
- Yazarken listenin altında doluluk: **"1,1 MB / 50 MB"**, çubuk ve **"2 / 10 dosya"**; bırakma alanı **"Dosyaları buraya
  bırak ya da [Dosya seç]"**, ipucu **"en çok 10 dosya, toplam 50 MB · 7 gün sonra silinir"**. Dolunca: **"En çok 10 dosya
  eklenebilir. Yer açmak için bir dosyayı sil."** ya da **"Toplam 50 MB doldu. Yer açmak için bir dosyayı sil."**
- Sığmayan dosya eklenmez, nedeni yazar: **"x.pdf eklenmedi: en çok 10 dosya."**, **"x.mp4 (62 MB) eklenmedi: toplam 50 MB'ı
  aşar (şu an 12 MB)."** Eklenenler için **"2 dosya eklendi."**
- Her satırda simge (fotoğraf, video, ses, belge), ad, altında MB olarak boyut, **"5 gün sonra silinir (8 Ekim)"** /
  **"bugün silinir (3 Ekim)"** ve yazarken **"Sil"** (onay: **"“x.pdf” kaldırılsın mı?"** — "Dosya bu listeden çıkarılır." —
  "Vazgeç" / "Sil").
- Gelen mesajda ekin süresi geçtiyse: **"2 dosya 7 gün dolduğu için silindi (8 Ekim)."**; dosya yoksa **"Henüz dosya yok."**
- **Eke basınca hemen inmez** (kullanıcı 26 Eylül: "direk inmez … videoysa oynat butonu … altında boyutu yazsın MB şeklinde"):
  fotoğraf ve ses doğrudan önizlemede açılır, video önce büyük oynat simgesiyle gelir ve basınca oynatıcıda açılır; öbür
  dosyalarda **"Dosyayı indir"** penceresi: **"rapor.pdf (1,2 MB) indirilsin mi?"** — **"Vazgeç"** / **"İndir"**. Önizlemenin
  altında da **"İndir"** düğmesi var.
- Gönderen **"Alıcılar bu mesaja dosya yükleyebilsin"** dediyse alıcı da listenin altında "Yükle" görür
  ([Alıcıların dosya yüklemesi](alicilarin-dosya-yuklemesi.md)).
- Tasarımda okul, öğrencilerin ve velilerin mesaja dosya ekleyip ekleyemeyeceğini seçer (öğrenci varsayılan kapalı, veli açık;
  öğretmen ve müdür her zaman) ([Okulun mesaj ayarları](okulun-mesaj-ayarlari.md)).

## Kurallar ve sınırlar

- **Kim ekler:** onaylı öğrenci, veli, öğretmen, müdür ve servisçi (rolsüz yetişkin eklemez: **"Bu türde dosya ekleme yetkin yok"**).
  Tasarımda öğrenci ve veli için okulun ayarı belirler.
- **Kim indirir:** mesajın göndereni ve bütün alıcıları (veli kopyası dahil). Gönderilmemiş taslağı yalnız yükleyen görür.
  Başkası **"Dosya bulunamadı"** alır (dosyanın var olduğu belli olmasın diye).
- **Sınırlar:** bir mesajın ekleri toplam en çok **50 MB** (tek dosya da en çok 50 MB: **"Bir dosya en fazla 50 MB olabilir."**)
  ve en çok **20 dosya** (**"En fazla 20 dosya eklenebilir."**). Gönderirken toplam aşılırsa **"Eklerin toplamı en fazla 50 MB
  olabilir. Bir dosyayı kaldır."** Tasarım 1'de sayaç 10 dosya gösteriyor; kodda ve KILAVUZ'da sınır 20. Tanımda mesaj eki için
  sayı yazmıyor ("en çok 10 dosya / 50 MB" yalnız ödevin teslim dosyaları için geçiyor) — kodlanırken biri seçilmeli.
- **Taslak sınırı:** kişinin gönderilmemiş bütün taslakları (başka pencerede bıraktıkları dahil) toplam en çok 150 MB:
  **"Gönderilmemiş eklerin toplamı en fazla 150 MB olabilir. Başka bir mesajda ya da ödevde bıraktığın ekleri kaldır;
  gönderilmeyen ekler 6 saat sonra kendiliğinden silinir."** Bağlanmayan taslak 6 saat sonra silinir. Gönderirken taslak
  bulunamazsa **"Eklerden biri bulunamadı ya da süresi doldu. Yeniden ekle."**
- **Türler:** pdf, doc, docx, odt, rtf, txt, xls, xlsx, ods, csv, ppt, pptx, odp, key, pages, numbers; jpg, jpeg, png, gif, webp,
  heic, heif, bmp, tif, tiff, svg, psd, ai; mp3, m4a, wav, ogg, aac, flac; mp4, mov, m4v, webm, avi, mkv, 3gp; zip, rar, 7z;
  sb3, ggb, py, ipynb, html, css, js, java, c, cpp. Öbürleri: **"Bu dosya türü eklenemez. PDF, Word, Excel, sunum, resim, ses,
  video ya da zip ekleyebilirsin."** Çalıştırılabilir dosyalar (.exe, .bat) eklenmez.
- **Saklama:** her ek yüklendiği andan **7 gün** sonra diskten silinir; mesaj yerinde kalır, ekin satırında "süresi doldu" yazar.
  İndirmede: **"Dosyanın süresi doldu (7 gün)."** Mesaj silinirse ekleri de gider.
- **Okulun alanı:** ek (gönderilmemiş taslak da) yükleyenin okulunun dosya alanına sayılır; dolunca **"Okulunun dosya alanı
  doldu. Okul yönetimi eski dosyaları sildirebilir ya da yöneticiden alan isteyebilir."** ([Okul disk sınırı](../okul-disk/disk-siniri.md)).
  Sunucu diskinde yer kalmadıysa **"Sunucuda yer kalmadı. Biraz sonra dene."**
- **Hız:** kişi başına saatte 100 yükleme (**"Bu saat içinde çok fazla dosya yükledin."**); aynı anda kişi başına 3, toplam 60
  yükleme (**"Aynı anda çok fazla yükleme var. Biri bitince dene."**); saatte 300 indirme (**"Çok fazla indirme yaptın. Biraz
  bekle."**). İndirme bağlantısı 60 saniyelik, tek kullanımlıktır (**"İndirme bağlantısının süresi doldu. Yeniden dene."**).
- **Küçültme:** büyük fotoğraf yüklenmeden önce tarayıcıda küçültülür; 50 MB denetimi küçülmüş boyutla yapılır
  ([Telefonda küçültme](../okul-disk/telefonda-kucultme.md)).
- **Silme:** eki yalnız yükleyen siler. Gönderilmiş bir mesajın ekini sonradan ekleme ya da çıkarma ekranı yok (düzeltme yalnız
  konu ve metni değiştirir).
- Aydınlatma metni: "Mesajın ekini gönderen ve alıcılar … görür. Yüklendikten 7 gün sonra silinir."

## Kardeşler ve ilgili

**Kardeşler:** [Alıcıların dosya yüklemesi](alicilarin-dosya-yuklemesi.md) · [Yeni mesaj ve alıcı seçimi](yeni-mesaj.md) ·
[Mesajı okuma](mesaj-okuma.md) · [Okulun mesaj ayarları](okulun-mesaj-ayarlari.md) · [Düzeltme ve silme](duzeltme-ve-silme.md).

**İlgili:** [Ödeve dosya ekleme](../odev/dosya-ekleme.md) (aynı ek alanı ve kurallar) · [Teslim](../odev/teslim.md) ·
[Okul disk sınırı](../okul-disk/disk-siniri.md) · [Telefonda küçültme](../okul-disk/telefonda-kucultme.md) ·
[Sunucuda küçültme](../okul-disk/sunucuda-kucultme.md) · [Saklama süreleri](../kvkk-ve-gizlilik/saklama-sureleri.md) ·
[Fotoğraf ekle](../yazi-yazma/fotograf-ekle.md) (yazıya gömülen fotoğraf da ek olarak yüklenir).

## Kod tarafı

- Ön yüz: [public/js/parcalar/04d-ekler.md](../../public/js/parcalar/04d-ekler.md) — `ekAlani`, `ekAlaniKur` (sürükle-bırak),
  `ekDosyalariEkle` (ön denetimler), `ekKucultYukle`, `ekYukle` (`POST /api/ek/yukle?tur=mesaj`, ilerleme), `ekListesiCiz`,
  `dolulukCubugu`, `EYLEMLER['ek-kaldir']` (`POST /api/ek/sil`), `ekIdleri`, `ekYukleniyor`, `ekListesiGoster`,
  `silinmeYazisi`, `EYLEMLER['ek-indir']` (`GET /api/ek/bilet`); [public/js/parcalar/04f-resim-kucult.md](../../public/js/parcalar/04f-resim-kucult.md).
- Sunucu: [sunucu/bolumler/ekler.md](../../sunucu/bolumler/ekler.md) — `yukle`, `ekleriDogrula`, `ekleriBagla`, `hedefinEkleri`,
  `gorebilir`, `bilet`/`indir`/`sil`, `ekSupur`; [sunucu/bolumler/odev-dosya.md](../../sunucu/bolumler/odev-dosya.md) (ortak
  güvenlik yardımcıları); [sunucu/bolumler/okul-disk.md](../../sunucu/bolumler/okul-disk.md); [sunucu/bolumler/mesaj.md](../../sunucu/bolumler/mesaj.md)
  (`POST /api/mesajlar { ekIdler }`).
- Depo: [sunucu/veri/depo/ekler.md](../../sunucu/veri/depo/ekler.md) — tablo `ekler` (`mesaj_id`, `bitis`, `silindi`).
- Testler: [testler/test-yorum-ek.md](../../testler/test-yorum-ek.md) (ekli mesaj: başkasının ekiyle gönderilemez, alıcı indirir,
  toplam sınırı), [testler/test-okul-disk.md](../../testler/test-okul-disk.md), [testler/test-resim-kucult.md](../../testler/test-resim-kucult.md).
- Kullanıcıya dönük anlatım: [belge/KILAVUZ.md](../../belge/KILAVUZ.md) ("Ekler (mesaj ve ödev)", "Telefonda küçültme").

## Sık sorulanlar

- **Eki bir hafta sonra açamıyorum.** Ekler yüklendikten 7 gün sonra silinir; kalıcı olması gereken dosyayı indirip sakla.
- **Gönderdiğim mesaja dosya eklemeyi unuttum.** Bugün gönderilmiş mesaja ek eklenemez; yeni bir mesajla gönder.
- **Video gönderebilir miyim?** Evet; toplam 50 MB'ı geçmemeli.
- **Pencereyi kapattım, yüklediğim dosyalar ne oldu?** Gönderilmeyen taslaklar 6 saat sonra kendiliğinden silinir.

## Sırada

- Mesaj tasarımı (Tasarım 1): açılır "Ekler (N)" kutusu, "Alıcılar bu mesaja dosya yükleyebilsin".
- Mesaj ayarları (çark): mesaja dosya ekleyebilenler (öğrenci varsayılan kapalı, veli açık); ek kutusu role göre gizlenecek.
- Sunucuda küçültme ve aynı dosyanın tek kopya tutulması (iş 1).
- Android uygulamasında mesaj ekleri.
