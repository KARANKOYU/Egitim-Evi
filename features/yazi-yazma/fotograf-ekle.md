# Yazı düzenleyici · Fotoğraf ekle

**Durum:** Tasarlandı — henüz kodda yok (fotoğrafı tarayıcıda küçülten parça bugün kodda var ve ekler, ödev teslimi, okul sayfası
için kullanılıyor; düzenleyicide yazının içine fotoğraf koymak yok. Tasarım 1 önizlemesinde çalışır).

Bir fotoğrafı seçip yazının imlecin olduğu yerine koyan düğme; fotoğraf önce telefonda ya da bilgisayarda küçültülür ve konum
bilgisinden arındırılır.

## Ne işe yarar

Kullanıcı 1 Ekim'de gösterdiği örnek için "resim şeyi tıklayınca fotoğrafı koyar" dedi. Ödev açıklamasına tahtanın fotoğrafını,
duyuruya etkinlik afişini, okul sayfasına bir görseli yazının arasına koymak için. Dosyayı ek olarak eklemekten farkı: fotoğraf
yazının içinde, okunduğu yerde görünür (ek ise ayrıca açılır: [Mesajlar · Ekler](../mesaj/ekler.md)).

## Nereden açılır

"Ekle" grubunda resim simgeli düğme, ipucu **"Fotoğraf ekle"** ([Araç çubuğunun düzeni](arac-cubugu.md)). Kısayolu yok.

## Adım adım

### Bugün (kodda)

Yazının içine fotoğraf konamaz. Fotoğraf yalnız **ek** olarak eklenir (mesaj, ödev, teslim; okul sayfasında galeri); büyük fotoğraf
yüklenmeden önce tarayıcıda küçültülür ve satırda "Küçültülüyor…", sonra "8,4 MB → 620 KB" gibi bir yazı görünür
([Telefonda küçültme](../okul-disk/telefonda-kucultme.md)).

### Yazan herkes (öğrenci dahil, tasarım)

1. İmleci fotoğrafın gireceği yere koy.
2. **Fotoğraf ekle**'ye bas. Cihazın dosya seçicisi açılır (telefonda galeri ya da kamera, telefona göre). Yalnız JPEG, PNG ve
   WebP seçilebilir; bir seferde bir fotoğraf.
3. Seçince fotoğraf küçültülür, içindeki meta veri (konum/GPS, çekim tarihi, cihaz) silinir ve **imlecin olduğu yere** girer.
   Genişliği yazı alanına sığar, köşeleri hafif yuvarlaktır.
4. İmleç hiç konmamışsa fotoğraf yazının sonuna girer.
5. Fotoğrafı kaldırmak için arkasına imleci koyup geri silme (Backspace) ya da Geri al ([Geri al · Yinele](geri-al-yinele.md)).
6. Fotoğrafı ortalamak için içinde durduğu paragrafı ortala ([Hizalama](hizalama.md)).
7. Gönderince ya da kaydedince fotoğraf sunucuya **ek olarak** yüklenir; yazının içinde sitenin kendi ek adresiyle durur.

Hatalar (önizlemede kısa ileti olarak):

- JPEG, PNG ya da WebP değilse: **"Yalnız JPEG, PNG ya da WebP fotoğraf eklenebilir."**
- Dosya açılamazsa: **"Fotoğraf açılamadı."**

### Okuyan herkes

Fotoğraf yazının içinde, yazı alanının genişliğine sığacak boyutta görünür ([Okurken görünüm](okurken-gorunum.md)).

## Kurallar ve sınırlar

- **Tarayıcıda küçültme:** tanım bugünkü küçültme parçasını işaret ediyor: uzun kenar en çok 2048 piksel, kısa kenar 1024'ün altına
  inmez, JPEG kalitesi 0,82, yön (dik/yan çekim) uygulanır ([Telefonda küçültme](../okul-disk/telefonda-kucultme.md)). Önizleme
  daha basit bir küçültme yapıyor: uzun kenar en çok 1600 piksel, PNG PNG kalır, öbürleri JPEG 0,85; her fotoğrafı yeniden çizdiği
  için meta veri hep gider.
- **Meta verinin silinmesi — dikkat:** bugünkü küçültme parçası 500 KB'tan küçük ya da en az %20 küçülmeyen resme **dokunmaz**
  (asıl dosya gider); öyle bir fotoğrafta konum bilgisi kalır. Parçanın kendi açıklaması "meta veriyi sunucu siler" diyor, ama
  sunucu bugün bunu yalnız okul sayfası fotoğraflarında yapıyor, ek olarak yüklenen dosyada yapmıyor. Tasarımdaki "meta veri/konum silinir" sözü için ya düzenleyici her
  fotoğrafı yeniden çizmeli (önizlemedeki gibi) ya da sunucu silmeli. Kullanıcının 3 Ekim planı ikincisini de içeriyor: medya işini
  yapacak ayrı bir Rust programı EXIF ve GPS'i "her zaman" siler (tarayıcı silmiş olsa bile) — bu plan JavaScript işleri bittikten
  sonra, zaman kalırsa ([Sunucuda küçültme](../okul-disk/sunucuda-kucultme.md)).
- **Yalnız kendi ek adresimiz:** sunucu `<img src>`'yi yalnız sitenin kendi ek adresi olarak kabul eder; dışarıdan bir resim adresi
  (`https://başka-site/…`) ya da gömülü veri (`data:`) olan bir `<img>` çalışmaz, **düz metin** olur
  ([İzinli ve izinsiz kod](izinli-ve-izinsiz-kod.md)). Önizlemede sunucu olmadığı için fotoğraf yazının içine gömülü veri olarak
  konuyor; kodlanınca yerine ek adresi gelmeli. Dikkat: bugünkü ek indirme yolu önce bir indirme bileti ister ve dosyayı "ek"
  olarak indirtir (tarayıcı sayfada açmaz); yazının içinde görünecek fotoğraf için ayrı bir gösterme adresi gerekecek
  ([sunucu/bolumler/ekler.md](../../sunucu/bolumler/ekler.md)).
- `<img>`'de `src`'den başka nitelik yok: genişlik, yükseklik ve **açıklama metni (`alt`) de yok**. Ekran okuyucu kullanan biri
  fotoğrafın ne olduğunu duyamaz; tanımda bunun için bir şey yazmıyor (yapı belgesinde düşünülmeli).
- **Okulun dosya alanı:** fotoğraf okulun disk kotasına sayılır; alan doluysa yüklenemez ([Doluluk](../okul-disk/doluluk.md),
  [Disk sınırı](../okul-disk/disk-siniri.md)).
- **Sayı ve boyut:** yazı başına fotoğraf sayısı ve boyutu yapı belgesinde sınırlanacak (tanımda henüz sayı yok).
- **Saklama süresi açık:** bugün mesaj ve ödev ekleri yüklemeden 7 gün sonra silinir. Yazının içindeki fotoğrafın da "ek" olarak
  aynı kurala girip girmeyeceği tanımda yazmıyor; girerse yazıdaki fotoğraf 7 gün sonra kaybolur. Kodlanmadan önce karara bağlanmalı.
- **KVKK:** fotoğraf kişisel veri olabildiği için bu özellik kodlandığı işte aydınlatma metni ve onay sürümü (KVKK_SURUM) da
  güncellenir ([Aydınlatma metni](../kvkk-ve-gizlilik/aydinlatma-metni.md), [Onay ve yeniden onay](../kvkk-ve-gizlilik/onay-ve-yeniden-onay.md)).
- Önizlemenin dosya seçicisi HEIC'i listelemiyor; bugünkü küçültme parçası HEIC'i (tarayıcı açabiliyorsa) JPEG'e çevirebiliyor.
  iPhone'dan seçilen fotoğrafın nasıl geleceği kodlanırken denenmeli.
- Öğrenci de fotoğraf ekler (teslim metni, mesaj, destek talebi).

## Kardeşler ve ilgili

**Kardeşler:** [Bağlantı ekle](baglanti-ekle.md) · [HTML görünümü](html-gorunumu.md) · [Hizalama](hizalama.md) ·
[İzinli ve izinsiz kod](izinli-ve-izinsiz-kod.md) · [Okurken görünüm](okurken-gorunum.md) · [Telefonda araç çubuğu](telefonda.md).

**İlgili:** [Mesajlar · Ekler](../mesaj/ekler.md), [Ödeve dosya ekleme](../odev/dosya-ekleme.md),
[Dosya alanı ve küçültme](../okul-disk/README.md), [Quiz · Soru resmi ve matematik](../quiz/soru-resmi-ve-matematik.md)
(soruya resim, ayrı düzenleyici), [KVKK ve gizlilik](../kvkk-ve-gizlilik/README.md).

## Kod tarafı

Bugün yazıya fotoğraf koyma yok. Kullanılacak parçalar bugün kodda:
[public/js/parcalar/04f-resim-kucult.md](../../public/js/parcalar/04f-resim-kucult.md) (tarayıcıda küçültme, EXIF'in gitmesi),
[public/js/parcalar/04d-ekler.md](../../public/js/parcalar/04d-ekler.md) ve [sunucu/bolumler/ekler.md](../../sunucu/bolumler/ekler.md)
(ek yükleme), [sunucu/bolumler/okul-disk.md](../../sunucu/bolumler/okul-disk.md) (disk sayacı),
[sunucu/yardimci/resim.md](../../sunucu/yardimci/resim.md) (sunucuda meta veri silme; bugün yalnız okul sayfası fotoğraflarında).
Sitenin güvenlik başlığı resimleri yalnız kendi adresinden, `data:`'dan ve harita karolarından kabul ediyor ([sunucu/http.md](../../sunucu/http.md));
ek adresi buna uyar. Kodlanınca bu bölüm ve Durum satırı güncellenir.

## Sık sorulanlar

- **Fotoğrafımın konumu görünür mü?** Tasarımda hayır: konum ve öbür meta veri silinir (yukarıdaki "dikkat" maddesi kodlanırken
  kapatılmalı).
- **Fotoğrafı büyütüp küçültebilir miyim?** Hayır; fotoğraf her zaman yazı alanının genişliğine sığar.
- **Birden çok fotoğraf koyabilir miyim?** Evet, birer birer; yazı başına sınır yapı belgesinde belirlenecek.

## Sırada

- Düzenleyiciler (iş 15, onaylı): fotoğraf ekleme, ek olarak yükleme, KVKK güncellemesi.
- Sunucuda küçültme (iş 1) ve 3 Ekim'deki Rust planı: meta verinin her zaman silinmesi.
- Yapı belgesi: fotoğraf sayısı ve boyutu, saklama süresi, açıklama metni.
