# Ödevler · Teslim (dosya yükleme)

**Durum:** Kodda var; tasarımda ek olarak bölüm "Teslim edilen dosyalar (N)" başlıklı açılır kapanır bir kutu olur, doluluk çubuğunun yanında "N / 10 dosya" sayacı ve yükleme kapalıyken kilitli bir neden satırı durur (Tasarım 1 önizlemesi).

Öğrencinin ödevin penceresinden ödeve dosya (fotoğraf, belge, video, ses…) teslim etmesi, gerekirse silip yeniden yüklemesi; velinin bu dosyaları görüp indirmesi.

## Ne işe yarar

Kullanıcı 26 Eylül'de şöyle tarif etti: "öğrenci o ödevden hocaya; hoca o ödevi açınca görür, altta dosyalar yani ekler kısmı
olur; drag and drop kabul eder, basınca cihazdan seçmeyi ve birden fazla atmayı". Aynı gün "süresi geçmiş ödeve dosya, video
koyamama" dedi; 27 Eylül'de sınırı ödev başına 50 MB yaptı, dosyaların "ödev süresi geçtiğinde net en geç 1 hafta" sonra
silinmesini ve alan dolunca uyarı gelmesini istedi.

Teslim yalnız öğretmen o ödevde **"Öğrenciler bu ödeve dosya yükleyebilsin"** dediyse açılır ([Dosya yükleme izni](dosya-yukleme-izni.md)).
Öğretmenin bu dosyaları nasıl gördüğü: [Teslimleri inceleme ve indirme](teslimleri-inceleme.md).

## Nereden açılır

- **Öğrenci:** "Ödevler" → ödevin satırı → pencerenin altındaki **"Teslim dosyaları"** bölümü.
- **Veli:** "Ödevler" → satıra bas → başlığı ödevin adı olan teslim penceresi (ya da çocuğun portalında ödevin penceresi).

## Adım adım

### Öğrenci — yüklemek (bugünkü site)

1. Ödevin penceresini aç; altta **"Teslim dosyaları"** başlığı.
2. Yükleme açıksa önce doluluk çubuğu: **"Dosya alanın · 0 / 50 MB"**, altında bırakma alanı:
   **"Dosya yükle: buraya sürükle ya da basıp seç"** ve küçük yazı: **"En fazla 10 dosya, toplam 50 MB; büyük fotoğraflar
   küçültülerek yüklenir. Dosyalar son teslimden 7 gün sonra silinir. Teslim süresi dolana kadar silip yeniden
   yükleyebilirsin."** (son tarihsiz ödevde silinme cümlesi: "Dosyalar ödev sonuçlandırıldıktan 7 gün sonra silinir;
   sonuçlandırılmazsa yüklendikten 60 gün sonra.").
3. Dosyaları alana sürükle ya da alana basıp seç (birden çok olur).
4. Dosyalar sırayla yüklenir; her biri için bir satır: **dosya adı**, **"%0" … "%100"**, ilerleme çubuğu ve **"İptal"**.
   Büyük fotoğrafta önce **"Küçültülüyor…"**, sonra satırda **"8,4 MB → 620 KB"**.
5. Biten dosyanın satırı kaybolur; bütün sıra bitince liste yenilenir ve dosyaların listede görünür. Küçültülerek
   yüklenenler için bir not kalır: **"foto.jpg — küçültülerek yüklendi, 8,4 MB → 620 KB"**.
6. Yüklenemeyen dosya kırmızı satırda nedeniyle kalır (ör. **"video.mkv — bu ödev için dosya alanın doldu (50 MB)"**).
7. Yükleme sürerken sekmeyi kapatmaya ya da sayfayı yenilemeye çalışırsan tarayıcı sorar.

### Öğrenci — listedeki dosyalar

- Her dosya satırında: adı, altında **"1,2 MB · 01.10.2026 14:05 · 9 gün sonra silinir"** (üzerine gelince silinme günü ve
  saati), sağda **"İndir"** ve teslim açıkken **"Sil"**.
- **"Sil"** → **"Dosya silinsin mi?"** → Tamam: dosya silinir, liste yenilenir; yerine yenisini yükleyebilirsin.
- Hiç dosya yoksa **"Henüz dosya yüklemedin."**
- Alan dolunca bırakma alanı yerine **"Bu ödev için dosya alanın doldu (50 MB). Yer açmak için bir dosyanı sil."**;
  10 dosyaya ulaşınca **"Bir ödeve en fazla 10 dosya yükleyebilirsin. Yer açmak için bir dosyanı sil."**

### Öğrenci — yükleme kapalıyken

- İzin yoksa: **"Bu ödev için dosya yüklenmiyor."** (yükleme alanı yok).
- İzin var ama teslim kapalıysa bölümde nedeni yazar: **"Ödev henüz başlamadı."**, **"Teslim süresi doldu."** ya da
  **"Ödev sonuçlandırıldı; dosya yüklenemez."** Yüklediğin dosyalar listede kalır, "Sil" çıkmaz.

### Veli

1. "Ödevler" listende ödevin satırına bas; başlığı ödevin adı olan pencerede çocuğunun yüklediği dosyalar: ad, boyut,
   yüklenme zamanı, "N gün sonra silinir" ve **"İndir"**.
2. Dosya yoksa **"Yüklenmiş dosya yok."**; izin kapalıysa **"Bu ödev için dosya yüklenmiyor."**
3. Veli yükleyemez, silemez.

### Tasarımda (Tasarım 1 önizlemesi)

- Bölüm **"Teslim edilen dosyalar (2)"** başlıklı, açılır kapanır bir kutu.
- Dosya satırı: simge (fotoğraf ya da belge), ad, **"9 gün sonra silinir"** / **"bugün silinir"**, boyut ve öğrencide teslim
  açıkken **"Sil"**, değilse **"İndir"**. "Sil" onayı: **"“foto.jpg” silinsin mi?"** — "Yüklediğin dosya silinir; öğretmenin
  artık göremez." Sonra **"Dosya silindi."**
- Yükleme alanı: üstte **"1,1 MB / 50 MB"**, çubuk ve **"1 / 10 dosya"**; altında **"Dosyaları buraya bırak ya da [Dosya
  seç]"** ve ipucu **"Birden çok dosya seçebilirsin · en çok 10 dosya, toplam 50 MB · dosyalar son teslimden 7 gün sonra
  silinir"**. Dolunca: **"Bu ödev için dosya alanın doldu (50 MB). Yer açmak için bir dosyanı sil."** ya da **"En çok 10 dosya
  yükleyebilirsin. Yer açmak için bir dosyanı sil."**
- Yüklemeden sonra **"2 dosya yüklendi; öğretmenin ödevi açınca görür."**; hiçbiri yüklenmediyse **"Dosya yüklenmedi."** ve
  dosya dosya neden: **"“x.pdf” eklenmedi: en çok 10 dosya yükleyebilirsin."**, **"“x.mp4” 50 MB'tan büyük; yüklenemez."**,
  **"“x.zip” eklenmedi: bu ödev için dosya alanın doldu (50 MB). Yer açmak için bir dosyanı sil."**
- Yükleme kapalıyken kilit simgeli satır: **"Bu ödev için dosya yüklenmiyor."**, **"Süre doldu; bu ödeve dosya
  yüklenemez."**, **"Ödev sonuçlandı; bu ödeve dosya yüklenemez."**
- Silinme günü geçtiyse: **"2 dosya son teslimden 7 gün sonra silindi (8 Ekim)."**; dosya yoksa **"Henüz dosya yok."**
- Velide aynı kutu, yalnız "İndir".

## Kurallar ve sınırlar

- **Kim yükler:** yalnız ödevin öğrencisi, onaylı hesapla (**"Ödeve yalnızca öğrenci dosya yükler"**); ödev ona verilmemişse
  **"Ödev bulunamadı"**. Veli, öğretmen, müdür yüklemez.
- **Ne zaman:** öğretmenin izni açıkken, başlama gününden (saate bakılmaz; başlama günü gelmeden "Ödev henüz başlamadı.") son
  teslim anına (gün + saat) kadar, ödev sonuçlanmamışken. Süre dolmadan başlamış yükleme en çok 10 dakika geç bitebilir;
  daha geç biterse ya da bu arada ödev sonuçlandırılırsa, silinirse **"Teslim kapandı; dosya kaydedilmedi."**; öğretmen bu
  arada izni kapatırsa **"Öğretmen bu ödevde dosya yüklemeyi kapattı; dosya kaydedilmedi."**
- **Sınırlar:** bir öğrencinin bir ödevde en çok **10 dosya**, toplam **50 MB**; tek dosya en çok 50 MB. Sunucu iletileri:
  **"Bir dosya en fazla 50 MB olabilir."**, **"Bir ödeve en fazla 10 dosya yükleyebilirsin. Yer açmak için bir dosyanı
  sil."**, **"Bu dosya sığmıyor: bu ödev için 3,4 MB boş yerin kaldı (en fazla 50 MB)."**, **"Bu ödev için dosya alanın doldu
  (50 MB). Yer açmak için bir dosyanı sil."** Pencere aynı denetimleri yüklemeden önce yapar: **"boş dosya"**, **"bir dosya en
  fazla 50 MB olabilir"**, **"sığmıyor: bu ödev için 3,4 MB boş yerin kaldı"**, **"bu ödev için dosya alanın doldu (50
  MB)"**, **"bu tür yüklenemez"**, **"en fazla 10 dosya yüklenir"**.
- **Türler:** belge, tablo, sunum, resim, ses, video, arşiv ve kod dosyaları ([Ödeve dosya ekleme](dosya-ekleme.md)'deki
  listenin aynısı); öbürleri: **"Bu dosya türü yüklenemez. PDF, Word, Excel, sunum, resim, ses, video ya da zip
  yükleyebilirsin."** Çalıştırılabilir dosyalar (.exe, .bat) yüklenmez.
- **Dosya adı** temizlenir (yol parçaları, yasak işaretler atılır, en çok 150 karakter); geçersizse **"Dosya adı geçersiz"**.
- **Sil:** öğrenci yalnız kendi dosyasını, teslim açıkken ve izin açıkken siler; değilse **"Teslim süresi doldu. Dosya
  silinemez."** (ya da öbür neden + "Dosya silinemez.") veya **"Öğretmen bu ödevde dosya yüklemeyi kapattı; dosyan artık
  silinemez."** Öğretmen ve müdür her zaman siler.
- **Hız ve yer:** öğrenci başına saatte 60 yükleme (**"Bu saat içinde çok fazla dosya yükledin."**); aynı anda kişi başına 3,
  okul başına 20, toplam 60 yükleme (**"Aynı anda çok fazla yükleme var. Biri bitince dene."**); okulun dosya alanı dolunca
  **"Okulunun dosya alanı doldu. Okul yönetimi eski dosyaları sildirebilir ya da yöneticiden alan isteyebilir."**; sunucu
  diskinde yer kalmadıysa **"Sunucuda yer kalmadı. Biraz sonra dene."** Çok yavaş ya da kopuk bağlantı kesilir (60 saniye
  veri gelmezse, 1 saati geçerse ya da ilk dakikadan sonra ortalama 8 KB/sn altındaysa).
- **Küçültme:** büyük fotoğraf yüklenmeden önce tarayıcıda küçültülür; yer denetimi küçülmüş boyutla yapılır
  ([Telefonda küçültme](../okul-disk/telefonda-kucultme.md)).
- **Silinme:** son teslimden 7 gün sonra (son tarihsiz ödevde sonuçlandırmadan 7 gün sonra, hiç sonuçlandırılmazsa yüklemeden
  60 gün sonra) ([Saklama ve silinme](saklama-ve-silinme.md)).
- **Kimler görür:** öğrencinin kendisi, bağlı velisi, ödevi veren öğretmen ve okulun müdürü. Her indirmede yetki yeniden
  denetlenir; dosya her zaman indirilir, tarayıcıda sayfa olarak çalışmaz.
- **Bildirim yok:** dosya yüklemek öğretmene bildirim göndermez.
- **Bilinen açıklar** (kod okumasına göre): pencereyi kapatınca sırada bekleyen dosyalar sessizce yüklenmez; biten dosya
  listede ancak bütün sıra bitince görünür; birkaç dosya sıradayken pencereyi kapatıp hemen başka bir ödevin penceresini
  açarsan sıradaki dosyalar ikinci ödeve gidebilir; "50 MB" yazıları ekranda sabit yazılıdır.

## Kardeşler ve ilgili

**Kardeşler:** [Dosya yükleme izni](dosya-yukleme-izni.md) · [Teslim metni](teslim-metni.md) ·
[Teslimleri inceleme ve indirme](teslimleri-inceleme.md) · [Ödevin penceresi](odev-penceresi.md) ·
[Saklama ve silinme](saklama-ve-silinme.md) · [Başlama ve son teslim](tarih-ve-saat.md) ·
[Ödev hatırlatmaları](hatirlatmalar.md) (tasarımda teslim edince hatırlatma durur).

**İlgili:** [Telefonda küçültme](../okul-disk/telefonda-kucultme.md), [Okul disk sınırı](../okul-disk/disk-siniri.md),
[Uyarılar](../okul-disk/uyarilar.md), [Saklama süreleri](../kvkk-ve-gizlilik/saklama-sureleri.md),
[Android uygulaması](../uygulama/android-uygulamasi.md).

## Kod tarafı

- Ön yüz: [public/js/parcalar/14b-odev-teslim.md](../../public/js/parcalar/14b-odev-teslim.md) — `teslimCiz`
  (`GET /api/odev-dosya?odev=[&ogrenci=]`), `teslimSatiri`, `teslimKuyruk` (ön denetimler), `teslimTekYukle`
  (`POST /api/odev-dosya/yukle?odev=`, gövde dosyanın kendisi, `X-Dosya-Adi`, ilerleme, iptal), `teslim-sil`, `teslim-indir`
  (biletle), `veli-teslim`, `beforeunload` uyarısı; [04d-ekler.md](../../public/js/parcalar/04d-ekler.md) (`dolulukCubugu`,
  `silinmeYazisi`); [04f-resim-kucult.md](../../public/js/parcalar/04f-resim-kucult.md).
- Sunucu: [sunucu/bolumler/odev-dosya.md](../../sunucu/bolumler/odev-dosya.md) — `yukle` (kimlik, rol, hız, izin,
  `teslimKapali`, boyut, ad, uzantı, öğrencinin alanı, okul alanı, disk payı, eşzamanlılık, akışla yazma, bitişte yeniden
  okuma), liste, bilet, `sil`, `dosyaSupur`; [sunucu/bolumler/okul-disk.md](../../sunucu/bolumler/okul-disk.md);
  [sunucu/api.md](../../sunucu/api.md) (yükleme gövde okunmadan ayrılır, Ödevler kapalı okulda "Ödevler bu okulda kapalı.").
- Depo: [sunucu/veri/depo/odev-dosyalari.md](../../sunucu/veri/depo/odev-dosyalari.md) — `ekle` (kilitli satırda sayı ve
  toplam), `odevin`, `SILINME`; tablo `odev_dosyalari` (şema 008, [SEMA.md](../../sunucu/veri/sema/SEMA.md)).
- Testler: [testler/test-odev-dosya.md](../../testler/test-odev-dosya.md), [testler/test-resim-kucult.md](../../testler/test-resim-kucult.md),
  [testler/test-okul-disk.md](../../testler/test-okul-disk.md), [testler/test-ozellikler.md](../../testler/test-ozellikler.md).
- Kullanıcıya dönük anlatım: [belge/KILAVUZ.md](../../belge/KILAVUZ.md) ("Ödev teslim dosyaları").

## Sık sorulanlar

- **Yükleme alanı yok.** Öğretmen bu ödevde dosya yüklemeyi açmamış, süre dolmuş ya da ödev sonuçlanmış; bölümde nedeni yazar.
- **Yanlış dosyayı yükledim.** Teslim süresi dolmadan "Sil" de, doğrusunu yükle.
- **Video yükleyebilir miyim?** Evet; 50 MB'ı geçmemeli (alanın toplamı da 50 MB).
- **Öğretmen dosyamı gördü mü?** Ekrandan anlaşılmaz; öğretmen kontrol ekranında "N ek" olarak görür.
- **Dosyam kayboldu.** Son teslimden 7 gün sonra silinir; satırdaki "N gün sonra silinir" bunu önceden söyler.

## Sırada

- Ödev teslim metni: öğrencinin yazı düzenleyiciyle teslim yazısı ([Teslim metni](teslim-metni.md)).
- Sunucuda küçültme ve aynı dosyanın tek kopya tutulması (iş 1); bütün videoların tarayıcıda küçültülmesi.
- Ödev hatırlatma otomasyonu: dosya yükleyen öğrencinin hatırlatmaları duracak.
- Android uygulaması: teslim dosyası yükleme ve silme uygulamaya gelecek.
