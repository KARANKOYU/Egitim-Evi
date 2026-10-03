# ekran-goruntuleri/KLASOR.md

Eğitim Evi'nin "ekranlarla kılavuzu": `index.html` albümü ve 14 alt klasörde 273 ekran fotoğrafı (267 JPEG ve Eğitim Evi Aile
uygulamasının 6 PNG'si); JPEG'leri ve albümü `araclar/gezinti.js` üretir, PNG'ler öykünücüde çekildi; klasör depoya girer.

## Bu dosya ne yapar?

Bu klasör Eğitim Evi'nin bütün ekranlarını gerçek bir tarayıcıda çekilmiş fotoğraflarla gösterir. Okuyanı önce müdürün
gözünden bir okulun Eğitim Evi'ne nasıl kurulup her gün nasıl yönetildiğinden geçirir, sonra giriş yapmamış birinin gördüğü
sayfaları ve sırasıyla öğretmeni, öğrenciyi, veliyi, servisçiyi, yeni açılmış bir yetişkin hesabını ve site yöneticisini
(araya giren özel durumlarla: aynı hesabın veli tarafı, öğretmenin ikinci okulu, kapatılmış bölüm, nakil gelen öğrenci,
yeni açılmış okulun müdürü) gösterir; önce bilgisayar, sonra telefon görünümü. Kim bakar: okul yönetimine ve grup arkadaşlarına siteyi tanıtmak isteyen,
kodu bilmeden "bu ekran neye benziyor?" diye merak eden, ödev sunumu hazırlayan. [../belge/KILAVUZ.md](../belge/KILAVUZ.md) en
başta okuru buraya yollar.

Sitenin fotoğrafları (bütün JPEG'ler) elle çekilmez, elle düzenlenmez: [../araclar/gezinti.md](../araclar/gezinti.md) her rolün ekranlarını başsız
Chrome/Edge'de gerçekten gezip kullanır (pencere açar, süzgeç seçer, değer yazar, quiz çözer) ve her adımı fotoğraflar.
Fotoğraflardaki bütün kişiler, okullar, notlar ve şifreler test verisidir (albümün kendisi de böyle yazar).

Bu belge, klasördeki her şeyi (albüm sayfası, her alt klasör, dosya adlarının anlamı) anlatır ve albümü yeniden üretirken
düşülecek en önemli tuzağı yazar: **tur bu klasörü temizlerken bu `KLASOR.md`'yi de siler.**

## İçinde neler var?

### `index.html` — albüm sayfası

[index.html](index.html): 172 687 bayt, tek dosya, 163 satır (son satırın sonunda satır sonu yok, `wc -l` bu yüzden 162
der). CSS ve JavaScript satır içinde; dışarıdan hiçbir şey yüklemez
(içindeki tek dış adres deponun GitHub bağlantısı). Sekme başlığı "Eğitim Evi — ekranlarla kılavuz", büyük başlık "Bir okul
Eğitim Evi'ni nasıl kullanır?". Düzeni:

- Üstte giriş metni ve not satırı ("273 ekran · … içlerindeki bütün kişiler, okullar, notlar ve şifreler test verisidir");
  kaydırırken üstte kalan bir içindekiler şeridi.
- **Bilgisayar görünümü** (13 bölüm, 236 fotoğraf) ve **Telefon görünümü** (12 bölüm, 37 fotoğraf). Her bölüm bir alt
  klasörün fotoğraflarını sırayla gösterir; her fotoğrafın altında ne gösterdiğini anlatan kısa bir başlık ve açıklama
  vardır (metinler [../araclar/gezinti-metin.md](../araclar/gezinti-metin.md)'den).
- Bir fotoğrafa tıklayınca büyük açılır: <kbd>←</kbd> <kbd>→</kbd> önceki/sonraki ekran, fare tekerleği aşağı kaydırır,
  <kbd>Esc</kbd> kapatır; telefon fotoğrafları telefon ekranı boyunda bir çerçevede açılır.
- Açık/koyu görünüm işletim sisteminin ayarına (`prefers-color-scheme`) uyar.

Klasördeki 273 resmin her biri albümde tam bir kez geçer, albümde de olmayan bir resme bağlantı yok (bu belge yazılırken
`index.html`'deki `src` listesi `git ls-files` ile karşılaştırıldı).

### Alt klasörler

Albümdeki sırayla. "Açık / koyu / telefon / son" sütunu o klasördeki fotoğrafların hangi kipte çekildiğini sayar ("son":
turun sonunda yeniden bilgisayar boyunda çekilen ek adımlar).

| Klasör | Ne gösterir | Dosya | Açık / koyu / telefon / son | Boyut |
|---|---|---|---|---|
| `mudur/` | Müdürün gözünden okul yönetimi (seed'in müdürü, Test Ortaokulu) | 69 | 59 / 4 / 5 / 1 | 15,5 MB |
| `giris/` | Giriş yapmamış birinin gördükleri: açılış, Hakkında, SSS, koşullar, aydınlatma metni, giriş, kayıt, okulun kendi sayfası | 28 | 21 / 2 / 5 / 0 | 9,8 MB |
| `mudur-veli/` | Aynı müdür hesabının veli tarafı ("Hesap değiştir" ile çocuğunun velisi olarak) | 9 | 7 / 0 / 2 / 0 | 2,6 MB |
| `ogretmen/` | Öğretmen (iki okulda ders veren bir öğretmen hesabı) | 59 | 51 / 3 / 5 / 0 | 10,6 MB |
| `ogretmen-ikinci-okul/` | Aynı öğretmenin ikinci okula geçince gördükleri | 3 | 3 / 0 / 0 / 0 | 0,4 MB |
| `ozellik-kapali/` | Okul ödevi ve etüdü kapatınca öğretmenin ekranı | 3 | 2 / 0 / 1 / 0 | 0,3 MB |
| `nakil-ogrenci/` | Okul değiştiren öğrenci: yeni okul ve eski okulun salt okunur kayıtları | 7 | 6 / 0 / 1 / 0 | 1,0 MB |
| `ogrenci/` | Öğrenci (seed'in birinci öğrencisi) | 37 | 26 / 3 / 5 / 3 | 9,9 MB |
| `veli/` | İki çocuklu bir veli | 22 | 17 / 1 / 3 / 1 | 11,2 MB |
| `servisci/` | Servisçi | 5 | 3 / 0 / 2 / 0 | 0,9 MB |
| `rolsuz/` | Kendi kaydolmuş, henüz hiçbir role bağlı olmayan yetişkin | 7 | 5 / 1 / 1 / 0 | 1,1 MB |
| `yeni-mudur/` | Site yöneticisinin kişi koduyla açtığı okulun müdürünün ilk girişi | 3 | 3 / 0 / 0 / 0 | 0,2 MB |
| `admin/` | Site yöneticisi | 15 | 10 / 2 / 1 / 2 | 2,7 MB |
| `aile-uygulamasi/` | Eğitim Evi Aile Android uygulaması (çocuğun telefonu), öykünücüde | 6 PNG | — (albümün telefon kısmında) | 1,0 MB |

Boyutlar 1 MB = 1 048 576 bayt ile. Toplam 273 resim 70 429 089 bayt (yaklaşık 67,2 MB); `index.html` ile birlikte
70 601 776 bayt.

Her klasörün içinden öne çıkanlar (albümdeki başlıklardan):

- **`mudur/`** — ana sayfa, "Hesap değiştir", bildirim paneli, takvim ve etkinlik ekleme, mesajlar / gönderilenler / duyuru okundu bilgisi,
  öğretmenler ve kodla öğretmen ekleme, öğrenciler (yeni hesap, başka okulda kayıtlı T.C., hesap düzenleme, giriş bilgisi
  dağıtma), sınıflar ve dersler, ders programı (çakışma uyarısı ve listesi, ders saati ekleme/düzenleme), roller ve yetkiler
  (hazır Öğretmen rolü, Kodlayıcı şablonu, özel rol), eğitim yılı, Özellikler (bölüm kapatma), devamsızlık özeti, etütler,
  ders ödevleri, sınav şablonları, yemek listesi, servisler, kulüpler, anketler, Excel aktarımı (içeri ve dışarı), işlem kaydı,
  okul adresi ve konumu, okul sayfası (düzenleme, kısıtlı CSS), ayarlar; 60–63 koyu, 64–68 telefon, 69 öğrencinin portalındaki
  sınav grafiği (müdürün gözünden).
- **`giris/`** — 01–21 açılış (yorumlar, Yapımcılar, ay/güneş düğmesi), Hakkında, SSS, kullanım koşulları, aydınlatma metni,
  giriş ve okul arama (yazım hatasına dayanıklı arama), kayıt ve hataları, okulun sayfası ve girişi (albümdeki başlık eski
  `/test-ortaokulu` adresini yazar; bugünkü tur `/school/test-ortaokulu`'yu açar),
  yanlış şifre, "böyle bir hesap yok", geçersiz e-posta onay bağlantısı, "Bilgilerimi kaydetme"; 22–23 koyu, 24–28 telefon.
- **`mudur-veli/`** — "Hesap değiştir: veli olarak", veli ana sayfası, çocuğun ödevleri, devamsızlık, ilerleyiş, etütler,
  servis; 08–09 telefon.
- **`ogretmen/`** — ana sayfa, iki okullu "Hesap değiştir", öğretmen kodu, takvim, mesajlar (düzeltilmiş mesaj, ekler),
  ders programından yoklama, Sınıflarım, ödevler (yeni ödev, son tarih takvimi, ekler, ödev kontrolü, öğrenci ekleri, fotoğraf
  ve video açma), sınavlar (şablondan sınav, değer tablosu, gruplar ve ortalamalar, şablonlar), yoklama, etütler ve etüt
  yoklaması, anketler, yemek, kulüpler, hatırlatıcılar, ayarlar; 52–54 koyu, 55–59 telefon.
- **`ogretmen-ikinci-okul/`** — ikinci okulun ana sayfası, "Hesap değiştir: ikinci okulda", o okulun ödevleri.
- **`ozellik-kapali/`** — Ödevler kutucuğu olmayan ana sayfa, kapalı bölümün adresi açılınca; 03 telefon menüsü.
- **`nakil-ogrenci/`** — yeni okulun ana sayfası, yeni okulda ödevler, yıl seçicide önceki okullar, önceki okulun ödevleri
  ve sınav notu (salt okunur), şimdiki okula dönüş; 07 telefon.
- **`ogrenci/`** — ana sayfa, takvim, mesajlar (duyuru, düzeltilmiş ve ekli mesaj), ders programı, ödevler ve süzgeçleri
  (yıldızlı, açılmamış, geç yaptı), sınavlarım ve grafikleri, ilerleyişim, devamsızlığım, etütlerim, anketler, hatırlatıcılar,
  yemek, servisim (harita), kulüpler, ayarlar (veli kodu); 27–29 koyu, 30–34 telefon, 35–37 ödev ayrıntısı ve ekleri.
- **`veli/`** — hesap seçimi, "Çocuğumun telefonu" (Eğitim Evi Aile), bildirimler (her birinde hangi çocuk), ana sayfa,
  Çocuklarım, iki çocuğun ödevleri ve tek çocuğa daraltma, devamsızlık, ilerleyiş, etütler, mesajlar, takvim, anketler,
  yemek, servis, kulüpler, ayarlar; 18 koyu, 19–21 telefon, 22 çocuğun kartından portalı.
- **`servisci/`** — ana sayfa, Servisim (öğrenciler, duraklar), mesajlar; 04–05 telefon.
- **`rolsuz/`** — "Nasıl devam edeceksin?" başlangıcı, Ekle penceresi (çocuğumu ekle, okulumu kaydet), ayarlar; 06 koyu, 07
  telefon.
- **`yeni-mudur/`** — ilk girişte önce aydınlatma metni onayı, sonra kendi şifresini belirleme ve şifre kuralları (turun
  eski bir sürümünden; bugünkü tur bu rolde başka ekranlar çeker).
- **`admin/`** — ana sayfa, "Onay bekleyenler", müdürler, okullar ve "Okul aç" penceresi, yedekler, açılış sayfası yorumları,
  işlem kaydı, ayarlar; 11–12 koyu, 13 telefon, 14–15 ay/güneş düğmesi.
- **`aile-uygulamasi/`** — `01-giris.png` (ne paylaşıldığı ve giriş), `02-giris-dolu.png` (öğrenci hesabıyla giriş ve açık
  onay), `03-konum-izni-soruluyor.png`, `04-bagli-izinler.png` (izinler sırayla), `05-durum.png` (bütün izinler verildi),
  `06-bildirim-cubugu.png` (bildirim çubuğunda her zaman görünür). Ayrı depodaki Android uygulamasının öykünücüde, deneme
  sunucusuna bağlıyken çekilmiş ekranları; tur bunları çekmez ama korur ve albüme ekler.

### Dosya adlandırması

Tur her fotoğrafa şu adı verir (`araclar/gezinti.js`, `adimCalistir`):

```
<rol klasörü>/NN-[koyu-][telefon-]<sayfa>.jpg
```

- `NN` — o rol içindeki adım sırası, iki haneli. Sıra her rolde aynı düzende ilerler: önce açık görünümde bilgisayar adımları,
  sonra koyu görünüm adımları, sonra telefon adımları, en sonda bilgisayar boyunda "son" adımlar. Bu yüzden ör.
  `admin/13-telefon-onaylar.jpg`'den sonra `admin/14-ana.jpg` gelir.
- `koyu-` — koyu görünümde çekildi; `telefon-` — telefon boyunda çekildi (albüm bir fotoğrafı bu ekle telefon kısmına koyar).
- `<sayfa>` — adımın gittiği sayfanın anahtarı (menüdeki `data-nav` / `SAYFALAR` adı; ör. `ogr-odevler`, `kisilikler`,
  `veli-ilerleyis`); yalnız küçük harf, rakam ve tire kalır. Adımda sayfa anahtarı yoksa (doğrudan bir adres açan dış sayfa
  adımları) ad `giris` olur. Albümdeki `yeni-mudur/NN-giris.jpg`'ler de turun eski bir sürümünün anahtarsız adımlarından
  kalma; bugünkü `gezinti.js`'te o rolün adımları `ana` sayfasına gider (Dikkat'e bak). Aynı sayfadaki farklı adımlar aynı adı taşır, yalnız numarası farklıdır (ör.
  `ogretmen/21-ogr-odevler.jpg` … `29-ogr-odevler.jpg` ödevler sayfasında açılan farklı pencereler; araya başka sayfa
  girebilir: `19-mesajlar.jpg` ve `20-mesajlar.jpg` iki ödev adımının arasında).
- Ölçüler: bilgisayar 1440 × 1000 piksellik pencere, 1,5 kat (fotoğraf 2160 piksel genişlik); telefon 390 × 844, 3 kat (1170
  piksel), dokunma öykünmesiyle. JPEG kalitesi 82; tam sayfa fotoğraflar en çok 7000 piksel (CSS) boyunda kesilir.
  `EE_OLCEK=1` ile iki boyut da 1 katta (küçük ve hızlı) çekilir.
- `aile-uygulamasi/` ad kuralının dışındadır: `NN-ne-gosterdigi.png`, adları ve başlıkları
  [../araclar/gezinti-metin.md](../araclar/gezinti-metin.md)'deki `UYGULAMA_EKRANLARI`'nda sabit.

## Kimle konuşur?

- **Üreten:** [../araclar/gezinti.md](../araclar/gezinti.md) (`CIKTI = ekran-goruntuleri/`): fotoğrafları ve `index.html`'i
  yazar. Başlık ve açıklamalar [../araclar/gezinti-metin.md](../araclar/gezinti-metin.md)'den (`ROL_METNI`, `ADIM_METNI`,
  `UYGULAMA_EKRANLARI`).
- **Fotoğraflardaki veri:** [../testler/seed.md](../testler/seed.md) (test okulu ve temel hesaplar), ardından
  [../araclar/zengin-veri.md](../araclar/zengin-veri.md) (dolu bir okul) ve [../araclar/gorsel-veri.md](../araclar/gorsel-veri.md)
  (çok rollü hesaplar, ikinci okul, nakil, servis, veli, yeni müdür…; tur hesaplarını buradan alır). Hepsi 3200'deki test
  sunucusunda, sıfırlanmış `egitimevi_test` üzerinde.
- **Tarayıcı:** bilgisayardaki Chrome (yoksa Edge), DevTools protokolüyle (tur sabit `9333` hata ayıklama portunu açar).
- **Turun öbür çıktısı (depoya girmez):** `testler/testdata/gezinti/` — `hata-raporu.md` (sorunlu adımlar, adım başına API
  sayısı ve kayma) ve `gezinti.json` (bütün adımların ham kaydı).
- **Ananlar:** [../belge/KILAVUZ.md](../belge/KILAVUZ.md) (en başta bağlantı; "Ekran görüntüleri" bölümü ve "Dosyalar" ağacı),
  [../TANITIM.md](../TANITIM.md) (klasör ağacı, araçlar tablosu, "Öteki belgeler"), [../belge/KLASOR.md](../belge/KLASOR.md).
  `.gitignore`'daki `belge/ekran-goruntuleri/` kuralı albümün eski yerinden kalmadır; bu klasörü etkilemez.
- **Uygulamanın kodu okumaz.** Sunucu bu klasörü web'den sunmaz (statik kök `public/`); albüm depodan ya da kopyadan açılır.
  Klasöre bakan tek kod `gezinti.js`: temizlikte içini listeler, albümü yazarken `aile-uygulamasi/`'ndeki `.png`'leri sıralayıp
  ekler. Testler bu klasörü anmaz.

## Nasıl çalışır (adım adım)?

### Albüm nasıl üretilir

```
3200'de test sunucusu: sıfırlanmış egitimevi_test, çıktısı testler/test-sunucu.log
export EE_BASE=http://localhost:3200 EE_LOG=testler/test-sunucu.log
node testler/seed.js            temel okul ve hesaplar
node araclar/zengin-veri.js     dolu bir okul
node araclar/gorsel-veri.js     çok rollü hesaplar, ikinci okul, nakil, servis, quiz…
node araclar/gezinti.js
   ekran-goruntuleri/ içinde aile-uygulamasi DIŞINDAKİ HER ŞEY silinir   ← bu KLASOR.md de gider
   Chrome/Edge başsız açılır
   dış sayfalar ─► giris/NN-giris.jpg, NN-koyu-giris.jpg, NN-telefon-giris.jpg
   her rol: oturum ─► açık adımlar ─► koyu ─► telefon ─► son  ─► <rol>/NN-….jpg
   index.html yazılır (aile-uygulamasi/*.png telefon kısmının sonuna eklenir)
   rapor ─► testler/testdata/gezinti/
git checkout -- ekran-goruntuleri/KLASOR.md        (temizlik düzeltilene kadar: bu belgeyi geri getir)
```

Komutların sırası ve açıklaması [../belge/KILAVUZ.md](../belge/KILAVUZ.md) "Ekran görüntüleri"nde ve
[../araclar/gezinti.md](../araclar/gezinti.md)'de. Yalnız metinler değiştiyse tur yeniden koşmadan
`node araclar/gezinti.js --album` son turun kaydından (`testler/testdata/gezinti/gezinti.json`) yalnız `index.html`'i yeniden
yazar; bu kip klasörü temizlemez.

### Albüme bakmak

`ekran-goruntuleri/index.html`'i tarayıcıda aç (deponun kopyasından). GitHub'ın dosya görünümü HTML'i çalıştırmaz, kaynağını
gösterir; fotoğraflar ise GitHub'da tek tek açılabilir.

## Dikkat!

- **Tur bu belgeyi siler.** `gezinti.js`'in `calistir` işlevi tarayıcıyı açmadan önce `ekran-goruntuleri/` içinde
  `aile-uygulamasi` dışındaki her şeyi (`fs.rmSync`, özyinelemeli) siler: fotoğraflar, `index.html`, bu `KLASOR.md` ve
  elle eklenmiş başka ne varsa. Temizlik `*.md`'yi koruyacak biçimde düzeltilene kadar (planlı ekran turu işinde) turdan sonra
  `git checkout -- ekran-goruntuleri/KLASOR.md` ile geri getir ya da belgeyi turdan önce başka yere kopyala.
- **Yeni bir korunacak klasör de silinir ve albüme girmez.** Bugün temizlik yalnız `aile-uygulamasi`'nı korur, albüm de yalnız
  onun `.png`'lerini ekler. "Android yerel uygulama" işinin tanımı uygulamanın ekran görüntülerini `ekran-goruntuleri/uygulama/`
  altına yazdırıyor ve "sitenin albümü bunları da gösterir" diyor: o klasör açılınca tur onu ilk temizlikte siler, albüm de
  göstermez. `gezinti.js`'in temizliğine ve albümüne `uygulama` eklenmeli (bu belgeye de alt klasör satırı).
- **Tur yarıda kalırsa albüm gider.** Silme tarayıcı açılmadan yapılır (yalnız Chrome/Edge hiç bulunamazsa tur silmeden
  durur); tarayıcıya bağlanılamaz, sunucu kapalıdır ya da giriş yapılamazsa albüm ya hiç yazılmaz ya da hata ekranlarıyla
  yazılır. Geri almak için `git checkout -- ekran-goruntuleri`.
- **Albüm eski.** En son `77955e8 commit 509`'da (2026-09-26) çekildi. Sonra gelen ekranlar (quiz, site ayarları, yönetici
  dosyası, okul disk sınırı, telefonda küçültme…) yok; `admin/02-onaylar.jpg` ve `admin/13-telefon-onaylar.jpg`'deki "Onay
  bekleyenler" ekranı bugünkü kodda yok (müdür başvurusu kalktı). `yeni-mudur/`'deki üç fotoğraf ("önce aydınlatma metni
  onayı", "kendi şifreni belirle", "şifre kuralları") da bugünkü turun o rol için çektiklerinden farklı: bugünkü
  `gezinti.js` yeni müdürü doğrudan okulunun ana sayfasına sokar, bildirimini ve telefon menüsünü çeker. Kullanıcı 30 Eylül'de
  ekran görüntülerinin yanlış olduğunu söyledi; tur özellikler bitince baştan çekilecek ve gereksiz ekranlar ayıklanacak.
- **Fotoğrafları elle değiştirme, ekleme.** Albüm turun çıktısıdır; elle eklenen bir resim bir sonraki turda silinir, elle
  düzeltilen bir resim eskisiyle değişir. Değişiklik gerekiyorsa adımı ya da metni (`gezinti.js`, `gezinti-metin.js`)
  değiştir, turu yeniden çalıştır.
- **Yalnız test verisi.** Depo herkese açık; bu klasöre gerçek bir okulun, öğrencinin ya da velinin ekranı asla konmaz. Tur
  yalnız test sunucusuna karşı çalıştırılır.
- **`EE_BASE`'i ver.** `gezinti.js`'in kendi adresi varsayılan olarak 3200'dür, ama kullandığı ortak giriş yardımcısı
  (`araclar/giris.js`) ve seed `EE_BASE` verilmezse 3000'deki gerçek sunucuna gider.
- **Depo büyür.** Klasör yaklaşık 67 MB; her tur neredeyse bütün JPEG'leri yeniden yazar (commit 509'da 264 dosya değişti) ve
  git eski hâlleri de saklar. Turu gereksiz yere commit'leme; ayıklama işinde gereksiz ekranlar çıkarılacak.
- **Tur veritabanına yazar** (rol kaydeder, hesap açar, yoklama alır, quiz çözer); yalnız sıfırlanmış test veritabanında
  çalıştır. Belgeleme işlerinde tur ve `gezinti.js` çalıştırılmaz.

## Testleri

- Albümü denetleyen bir test yok; `tumtest.sh` bu klasöre bakmaz. Turun kendisi bir duman denetimi gibi çalışır (konsol
  hataları, 400+ dönen istekler, kayma, bulunamayan düğmeler `testler/testdata/gezinti/hata-raporu.md`'ye yazılır) ama
  "geçti/kaldı" vermez ve test listesinde değildir.
- Planlı `testler/test-belgeler.js` klasör belgelerini (bu dosya dahil) denetleyecek: albümün her alt klasörünün adı burada
  geçiyor mu.
- Elle: `index.html`'i tarayıcıda aç → üstte "273 ekran"; bir fotoğrafa tıkla → büyük açılmalı, ← → ile gezilmeli, Esc
  kapatmalı; telefon kısmında fotoğraf telefon çerçevesinde açılmalı; kırık resim olmamalı.
- Bu belge yazılırken hiçbir resim açılmadı, tur çalıştırılmadı: `index.html` metin olarak okundu, içindeki 273 `src` `git ls-files`
  listesiyle karşılaştırıldı (eksik ya da fazla yok), klasör sayıları ve boyutları diskten sayıldı.

## Son durum

- `git log -- ekran-goruntuleri`: 69 commit; geçmişte 274 ekleme (273 resim + `index.html`) ve 264 değişiklik var, hiç silme
  yok. İlk dosya `31cb5f2 commit 39`'da (2026-08-28) geldi.
- Son commit'ler:
  - `77955e8 commit 509` (2026-09-26) — 12 klasördeki 264 JPEG yeniden çekildi (`yeni-mudur/` ve `aile-uygulamasi/` hariç
    hepsi); `index.html` değişmedi.
  - `1165fb0 commit 491`, `a1cc097 commit 490`, `0fcc3ee commit 489` (2026-09-26) — `yeni-mudur/03-giris.jpg`, `02-giris.jpg`,
    `01-giris.jpg` tek tek eklendi.
- `index.html` tek commit'te geldi ve o günden beri değişmedi: `b6e59ce commit 470` (2026-09-26). `aile-uygulamasi/`'nin altı
  PNG'si `d0ae494 commit 467`'de (2026-09-26) eklendi.
- Bu `KLASOR.md` bu belgeleme işinde yazıldı, henüz commit'lenmedi.
- Bilinen açık (kod değiştirilmedi): turun temizliğinin bu belgeyi silmesi; albümün bugünkü ekranlardan geride olması.
- Planlı işlerden bu klasörü etkileyecekler:
  - "Ekran turu + albüm + wiki güncelleme" (en son; özellikler bitince): tur baştan çekilecek, gereksiz ekranlar ayıklanacak;
    turun temizliği `*.md`'yi ve korunması gereken yeni klasörleri korumalı.
  - "Kulüpler kaldırılacak": `mudur/45-kulupler.jpg`, `mudur/46-kulupler.jpg`, `ogretmen/49-kulupler.jpg`,
    `ogrenci/25-kulupler.jpg`, `veli/16-kulupler.jpg` ve metinleri çıkacak.
  - "Paneller /panel/admin ve /panel/destek": yöneticinin ekranları yeni adreste çekilecek.
  - "Sistem" (yöneticiye zorunlu doğrulama uygulaması): turun yönetici girişi değişmeli.
  - "Android yerel uygulama": tanımı ekranları `ekran-goruntuleri/uygulama/` altına yazdırıyor (açık ve koyu tema, telefon ve
    tablet); bu klasörün turun temizliğinden korunması ve albüme eklenmesi gerekecek (Dikkat'e bak).
  - Yeni özelliklerin (mesaj ayarları, toplantılar, eğitim içerikleri, çok dil, üst şerit…) ekranları tura adım olarak
    eklenecek.
