# Yazı düzenleyici · İzinli biçimler; izinsiz kod düz metin olur, gizleme yok

**Durum:** Tasarlandı — henüz kodda yok (bugün izin listesi yok çünkü hiçbir biçim yok: her yazı harf harf gösterilir. Tasarım 1
önizlemesinde tarayıcı tarafı çalışır).

Sunucunun her kayıtta uyguladığı kural: yalnız araç çubuğunun üretebildiği biçimler kalır; başka her etiket silinmez, çalışmaz, düz
metin olarak görünür; içeriği görünmez yapan hiçbir şey geçmez.

## Ne işe yarar

Kullanıcı 1 Ekim'de </> görünümü için şunu istedi: "orada tehlikeli kod olmasın; onerror, debug vb. gibi veya şu invisible yapan;
kendimizin onlar dışında biri özel kod yazarsa olmasın, düz metin olarak gitsin". Yani:

- Bir velinin mesajına gizlenmiş bir betik (ör. `onerror`) öğretmenin tarayıcısında **çalışmaz**.
- Bir yazının içine okuyanın göremeyeceği bir şey (görünmez yazı, zemin rengiyle aynı renk, sıfır boyut) **saklanamaz**.
- Kodu yazan, kuralın dışına çıktığını **görür**: yasak etiket sessizce silinmez, olduğu gibi yazı olarak ekranda kalır.

## Nereden açılır

Bir düğmesi yok; düzenleyicinin bulunduğu **her** alanda, her kayıtta ve her gösterimde kendiliğinden çalışır
([Düzenleyicinin bulunduğu yerler](nerelerde-var.md)). En çok </> ile yazılırken ve yapıştırırken fark edilir
([HTML görünümü](html-gorunumu.md), [Yapıştırma](yapistirma.md)).

## Adım adım

### Bugün (kodda)

Bütün yazılar düz metin olarak saklanır ve gösterilirken her karakter kaçırılır: `<b>` yazan okuyana `<b>` görünür, hiçbir etiket
çalışmaz. Sitenin güvenlik başlığı ayrıca sayfaya dışarıdan ya da satır içinde betik koymayı engeller. Okul sayfasının tanıtım yazısının
altında bugün şu ipucu var: "Bağlantı ve biçim eklenemez; yazı olduğu gibi görünür."

### Yazan herkes (öğrenci dahil, tasarım)

1. Araç çubuğuyla yazdığın her şey izinlidir; bir şey fark etmezsin.
2. </> ile (öğrenci dışında) izinsiz bir şey yazarsan, düzenleyici görünümüne dönünce o etiket yazının içinde **kod olarak, harf
   harf** görünür. HTML kodunu **düz yazı olarak** yapıştırırsan (ör. bir not defterinden) kod yine harf harf girer.
3. **Biçimli yapıştırmada** (Word, Docs, bir web sayfası) önizleme farklı davranır: izinli biçimler korunur, öbür biçim sessizce
   atılır, betik, stil bloğu, çerçeve gibi tehlikeli parçalar içleriyle birlikte hiç gelmez; yani yapıştırılan kod harf harf
   **görünmez** ([Yapıştırma](yapistirma.md); aşağıdaki "dikkat edilecekler").
4. Kaydedince ya da gönderince sunucu aynı kuralı yeniden uygular; tarayıcıdaki görüntü ile sunucunun sonucu aynıdır.

### Okuyan herkes

Okuyan yalnız izinli biçimleri biçim olarak görür; izinsiz her şey yazının içinde düz metin olarak durur. Yazı gösterilirken bir kez
daha temizlenir (eski kayıtlar için de).

## Kurallar ve sınırlar

### 1. İzin listesi — yalnız araç çubuğunun üretebildikleri

| Etiket | Ne için | İzinli nitelik ve değerler |
|---|---|---|
| `p`, `br` | paragraf, satır sonu | `p`: `style` içinde `text-align` (`left`, `center`, `right`, `justify`) ve `margin-left` (40px, 80px, 120px, 160px, 200px) |
| `h3`, `h4`, `h5` | büyük, orta, küçük başlık | `p` gibi (girinti tanımda yalnız `p` ve `li` için; önizleme başlıkta da kabul ediyor) |
| `b`, `strong` | kalın | yok |
| `i`, `em` | italik | yok |
| `u` | altı çizili | yok |
| `s`, `del` | üstü çizili | yok |
| `ul`, `ol`, `li` | madde ve numaralı liste (iç içe olabilir) | `li`: `p` gibi; `ul`/`ol`: yok |
| `a` | bağlantı | tanımda yalnız `href` (yalnız `https://…`); `target="_blank"` ve `rel="noopener nofollow"`'u sunucu her bağlantıya kendisi yazar. Önizleme </> kutusunda görünen bu iki niteliği de kabul eder, yalnız şu değerlerle: `target` = `_blank`, `rel` = `noopener`, `noopener nofollow` ya da `nofollow noopener`; başka değer etiketi düz metne çevirir |
| `img` | fotoğraf | `src` yalnız sitenin kendi ek adresi |
| `span` | renk ve vurgu | `style` içinde `color` (paletteki renklerden biri) ve `background-color` (yalnız sarı vurgu) |

**Başka hiçbir şey yok:** başka etiket, başka nitelik, başka `style` özelliği ya da değeri yasaktır.

### 2. İzinsiz olan silinmez, düz metin olur

İzin listesinde olmayan bir etiket (ör. `script`, `iframe`, `svg`, `style`, `form`, `input`, `object`, `embed`, `base`, `meta`,
`link`, `video`, `div`, `h1`, `table`) ya da izinli bir etikette izinsiz bir nitelik veya değer (`on…` olay nitelikleri,
`javascript:`/`data:`/`http:` adresleri, izinsiz `style`, `srcdoc`, `id`, `class`, `title`, `alt`, `width`, `start`…) varsa o etiket
**içindekilerle birlikte** olduğu gibi düz metin olarak kaydedilir; okuyan onu kod yazısı olarak görür.

Örnekler (</> ile yazılan → okuyanın gördüğü):

| Yazılan | Görünen |
|---|---|
| `<b>Kalın</b>` | **Kalın** |
| `<p style="text-align: center;">Orta</p>` | ortalanmış "Orta" |
| `<a href="https://egitimevi.org/sss">SSS</a>` | mavi, altı çizili "SSS"; yeni sekmede açılır |
| `<img src="x" onerror="alert(1)">` | ekranda harf harf `<img src="x" onerror="alert(1)">` |
| `<script>alert(1)</script>` | harf harf, çalışmaz |
| `<a href="javascript:alert(1)">Tıkla</a>` | harf harf |
| `<p onclick="alert(1)">Tıkla</p>` | harf harf (izinli `p`, izinsiz nitelik) |
| `<span style="display:none">gizli</span>` | harf harf; "gizli" yazısı da görünür |
| `<span style="color: #ffffff;">beyaz</span>` | harf harf (paletin dışında renk) |
| `<p style="font-size: 1px">küçük</p>` | harf harf |
| `<p style="margin-left: 30px">…</p>` | harf harf (40'ın katı değil) |
| `<h1>Başlık</h1>` | harf harf (başlıklar h3–h5) |
| `<div>Yazı</div>` | harf harf (paragraf `p` olmalı) |
| `<!-- not -->` | harf harf `<!-- not -->` |

### 3. Gizleme yok

İçeriği görünmez yapan hiçbir şey geçmez: `display`, `visibility`, `opacity`, `font-size`, `position`, `height` gibi özellikler zaten
izin listesinde yok (madde 2'ye göre düz metne döner); yazı rengi yalnız paletten, zemin rengiyle aynı renk seçilemez
([Renkler](renkler.md)); HTML yorumları düz metin olur; **görünmez Unicode karakterler kayıtta silinir**. Önizlemenin sildikleri:

- U+200B–U+200F: sıfır genişlikli boşluk, birleştirmeyen ve birleştiren, soldan sağa ve sağdan sola işaretleri;
- U+202A–U+202E: yön gömme ve yön geçersiz kılma karakterleri;
- U+2060–U+2064: sözcük birleştirici ve görünmez işlem karakterleri;
- U+2066–U+2069: yön yalıtma karakterleri;
- U+FEFF (sıfır genişlikli bölünmez boşluk) ve U+180E.

### 4. Gerçek ayrıştırıcı

Sunucuda ayıklama düzenli ifadeyle **değil**, gerçek bir HTML ayrıştırıcısıyla yapılır (sitenin kendi küçük ayrıştırıcısı; yeni
bağımlılık eklenmez, sitenin tek bağımlılığı veritabanı sürücüsü kalır). Büyük/küçük harf, kodlanmış karakterler (`&#…;`), bozuk ya
da iç içe etiketler, nitelik adındaki boşluk ve satır sonu hileleri hepsi aynı sonuca gider. Gösterimde de ikinci kez temizlenir.

### 5. Herkese aynı kural

Kural öğrenci dahil herkes için aynıdır. Öğrencide </> düğmesi yok ama yapıştırılan içerik de bu kuraldan geçer.

### 6. Testler

Yapı belgesinde ve testlerde yeni bir paket: her yasak kategori için kayıt → düz metin olarak döndüğü; izinli her biçimin aynen
kaldığı; görünmez karakterlerin silindiği; tarayıcı önizlemesiyle sunucu sonucunun aynı olduğu. Güvenlik işi bu düzenleyiciyi
ayrıca denetler.

### Dikkat edilecekler (önizleme ile tanım arasındaki farklar ve açık noktalar)

- **Fotoğraf adresi:** önizleme sunucusuz olduğu için yazıya gömülü veri (`data:image/…`) olarak fotoğraf koyuyor ve kendi
  temizleyicisi bunu kabul ediyor. Tanımda `img src` yalnız sitenin ek adresidir; sunucu `data:` adresli resmi düz metne çevirir.
  Kodlanırken fotoğraf önce ek olarak yüklenmeli ([Fotoğraf ekle](fotograf-ekle.md)).
- **Biçimli yapıştırma ile madde 2:** tanım iki şey söylüyor: "yapıştırılan Word/Docs biçimi temizlenir" ve madde 5 "yapıştırılan
  içerik de bu kuraldan geçer". Önizleme biçimli yapıştırmada izinsiz parçaları **atıyor** (betik, stil bloğu, çerçeve, form alanı
  içleriyle birlikte; `div`, tablo gibi kapları açıp yazısını paragraf yapıyor; https olmayan bağlantının yalnız yazısını
  bırakıyor); madde 2'deki "silinmez, düz metin olur" davranışı yalnız </> ile yazılanda ve düz yazı olarak yapıştırılanda
  görülüyor. Yapıştırmada hangisinin geçerli olacağı yapı belgesinde açıkça yazılmalı ([Yapıştırma](yapistirma.md)).
- **Bağlantının nitelikleri:** tanımın listesinde bağlantının tek niteliği `href`; önizleme kendi yazdığı `target` ve `rel`'i
  </> dönüşünde bozmamak için bu ikisini sabit değerleriyle kabul ediyor (madde 1'deki tablo). Sunucu da aynısını yapmalı; yoksa
  </> açıp kapatmak her bağlantıyı düz metne çevirir.
- **Girinti başlıklarda:** tanım `margin-left`'i yalnız `p` ve `li` için sayıyor; önizleme `h3`–`h5`'e de izin veriyor ([Girinti](girinti.md)).
- **"4 renk":** tanım "color (4 renkten biri)" diyor; önizleme 3 renk kodunu kabul ediyor, dördüncüsü "varsayılan" olduğu için kodu
  yok ([Renkler](renkler.md)).
- **Emoji ile görünmez karakter çatışması:** kullanıcının yazdığı içerikte emoji serbesttir; ama birleştiren karakter (U+200D) silinince
  birkaç emojinin birleşerek tek resim olduğu emojiler (aile, meslek ve bazı bayrak dizileri) parçalarına ayrılır. Kodlanırken
  emoji dizilerinin içindeki U+200D korunmalı mı, karara bağlanmalı.
- **Yön karakterleri ve sağdan sola diller:** yön işaretleri (U+200E, U+200F, U+202A–U+202E, U+2066–U+2069) siliniyor; çok dil
  işinde Arapça gibi sağdan sola yazılan diller planlı ([Sağdan sola](../dil/sagdan-sola.md)). Bu karakterler bazen karışık yönlü
  yazıyı düzgün göstermek için gerekir; tanım silinmelerini istiyor, kodlanırken sağdan sola yazıyla denenmeli.
- **Eski kayıtlar:** bugünkü düz metin kayıtlar olduğu gibi gösterilir; bir kaydın düz metin mi HTML mi olduğunun nasıl ayırt
  edileceği tanımda yazmıyor ([Okurken görünüm](okurken-gorunum.md)).
- Aynı ilke eklentilerin ekrana yazdığı şablonlar için de geçerli: "izin dışı her şey düz metin" ([Eklentiler · Sınırlar](../eklentiler/sinirlar.md)).

## Kardeşler ve ilgili

**Kardeşler:** [HTML görünümü](html-gorunumu.md) · [Yapıştırma](yapistirma.md) · [Bağlantı ekle](baglanti-ekle.md) ·
[Fotoğraf ekle](fotograf-ekle.md) · [Renkler](renkler.md) · [Okurken görünüm](okurken-gorunum.md).

**İlgili:** [Okul sayfası · Görünüm ve CSS](../okul-sayfasi/gorunum-ve-css.md), [Eklentiler · Sınırlar](../eklentiler/sinirlar.md),
[Mesajlar · Mesaj okuma](../mesaj/mesaj-okuma.md), [KVKK ve gizlilik](../kvkk-ve-gizlilik/README.md).

## Kod tarafı

Bugün kodda yok. Bugünkü korumalar: ön yüzde her yazı [public/js/parcalar/01-yardimcilar.md](../../public/js/parcalar/01-yardimcilar.md)'deki
`esc` ile basılır; sunucu metinleri [sunucu/ortak.md](../../sunucu/ortak.md)'deki `clean` ile alır (boşlukları kırpar, sınırda keser,
`\u0000`'ı atar; görünmez karakterlere dokunmaz); güvenlik başlıkları [sunucu/http.md](../../sunucu/http.md)'de (betik yalnız sitenin
kendisinden, satır içi betik yok). Okulun CSS'i için bugün bir izin listesi temizleyicisi var:
[sunucu/yardimci/css-temizle.md](../../sunucu/yardimci/css-temizle.md); HTML temizleyicisi aynı ilkeyle, yeni bir sunucu yardımcısı
olarak yazılacak. Kodlanınca bu bölüm ve Durum satırı güncellenir.

## Sık sorulanlar

- **Yazdığım bir şey neden kod olarak göründü?** İzin listesinde olmayan bir etiket, nitelik ya da değer kullandın. Araç çubuğundaki
  düğmelerle yaptığın her şey izinlidir.
- **İzinsiz kod neden silinmiyor da görünüyor?** Kullanıcının kararı: düz metin olarak gitsin; böylece yazan ne yaptığını görür,
  okuyana da hiçbir şey gizlenmez.
- **Öğrenci bu kuraldan muaf mı?** Hayır; kural herkese aynı.

## Sırada

- Düzenleyiciler (iş 15, onaylı): sunucudaki ayrıştırıcı ve temizleyici, test paketi.
- Güvenlik denetimi (iş 3): temizleyicinin ayrıca denenmesi.
- Yapı belgesi: yukarıdaki "dikkat edilecekler".
