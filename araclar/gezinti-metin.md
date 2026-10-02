# araclar/gezinti-metin.js

Ekranlarla kılavuzun (`ekran-goruntuleri/index.html`) bütün yazıları: her rol bölümünün başlığı ve girişi, her fotoğrafın
altındaki açıklama, alt başlıklar ve Android uygulaması ekranlarının adları; yalnız [gezinti.md](gezinti.md) okur.

## Bu dosya ne yapar?

Ekran turu ([gezinti.md](gezinti.md)) fotoğrafları çeker ama bir fotoğrafın NEYİ gösterdiğini bilmez. Bu dosya o anlatımı
tutar: albümü açan biri (okul, öğretmen, grup arkadaşın, GitHub'da gezen biri) her ekranın altında "bu ne, kim kullanır,
hangi kural işliyor" sorusunun kısa cevabını okur. Metinler ayrı dosyada durduğu için turu yeniden çalıştırmadan
düzeltilebilir: metni değiştirip `node araclar/gezinti.js --album` dersin, albüm son turun kaydından yeniden yazılır.

Kod yok denecek kadar azdır; dosya büyük bir sözlüktür. Metinler Türkçe, kısa ve somut; fotoğraflardaki bütün kişiler,
okullar ve notlar test verisidir: Zeynep Şahin ve Burak Öztürk `testler/seed.js`'in, Elif Göçmen ile servisçi
`araclar/gorsel-veri.js`'in, Kemal Arslan `araclar/zengin-veri.js`'in uydurma kişileri.

## İçinde neler var?

### `A(metin, bolum)` (iç yardımcı)

`bolum` verilirse `{ bolum, metin }`, verilmezse `{ metin }` döner. `bolum`, o adımdan ÖNCE albümün bilgisayar kısmında
açılacak alt başlıktır (ör. `'Mesajlar ve duyurular'`).

### `ROL_METNI` (dışa açık)

Albümün bölüm başlıkları ve girişleri. Üç özel anahtar:

| Anahtar | Nerede görünür |
|---|---|
| `_giris` | Sayfanın en üstündeki giriş paragrafı (albümün ne olduğu, sıra: önce müdürün gözünden okul yönetimi, sonra öteki roller; birinci kısım bilgisayar, ikinci kısım telefon). Yedeği yok: silinirse sayfada "undefined" yazar. |
| `_bilgisayar` | "Birinci kısım · Bilgisayar görünümü"nün girişi (gezinti.js'te yedek cümlesi var) |
| `_telefon` | "İkinci kısım · Telefon görünümü"nün girişi (yedeği var) |

Sonra albüm klasörü başına bir `{ baslik, giris }`: `mudur` ("Müdürün gözünden: okulu kurmak ve yönetmek"), `giris` ("Dış
sayfalar: açılış, giriş, kayıt, okul sayfası"), `mudur-veli`, `ogretmen`, `ogretmen-ikinci-okul`, `ozellik-kapali`,
`nakil-ogrenci`, `ogrenci`, `veli`, `servisci`, `rolsuz`, `yeni-mudur`, `admin` ve dosyanın sonunda ayrıca eklenen
`aile-uygulamasi`. `baslik` bölüm başlığı ve içindekiler şeridindeki ad olur; `giris` yalnız bilgisayar kısmında başlığın
altında görünür. Bir klasörün kaydı yoksa gezinti.js rolün kendi `baslik`'ını (`--album` kipinde klasör adını) kullanır.

### `ADIM_METNI` (dışa açık)

Fotoğraf altı yazıları. Anahtar **`"<klasör>|<adımın adı>"`**, adın gezinti.js'teki `ad` ile harfi harfine aynısı (uzun
çizgi "—", tırnak, parantez dahil), ör. `'ogretmen|Ödev kontrolü (sonuçlanmış, 6 sonuç türü)'`. Değer `A(...)`'nın
döndürdüğü nesne. gezinti.js ayrıca `"*|<ad>"` biçimini (her klasörde geçerli metin) de arar; bugün öyle bir anahtar yok.

2 Ekim'deki sayım: **311 anahtar** — turun 305 adımının her biri için bir metin (dış sayfalar 31, müdür 71, müdür-veli 9,
öğretmen 68, öğretmenin ikinci okulu 3, bölüm kapalı 3, nakil öğrenci 7, öğrenci 41, veli 26, servisçi 8, yeni yetişkin 12,
yeni müdür 3, yönetici 23) ve 6 uygulama ekranı. 34 metinde `bolum` var:

- müdür (13): Başlangıç · Mesajlar ve duyurular · Öğretmenler ve öğrenciler · Sınıflar ve ders programı · Roller ve özel
  rol · Eğitim yılı ve özellikler · Devamsızlık ve etüt · Ödev ve sınav · Okul hayatı: yemek, servis, kulüp, anket · Excel
  ile içeri ve dışarı aktarma · Kayıtlar, okul adresi ve okul sayfası · Koyu görünüm · Öğrencinin portalına bakış;
- öğretmen (10): Başlangıç · Mesajlar · Ders programından yoklama · Sınıflarım · Ödev · Quiz · Sınav · Yoklama ve etüt ·
  Okul hayatı ve ayarlar · Koyu görünüm;
- öğrenci (10): Başlangıç · Mesajlar · Ödev · Sınav ve ilerleyiş · Okul hayatı · Hatırlatıcılar · Yemek, servis, kulüp,
  ayarlar · Koyu görünüm · Ödev ayrıntısı · Quiz;
- veli (1): Başlangıç. Öteki klasörlerde alt başlık yok.

Metinler HTML'dir: yalnız `<b>` kullanılıyor (dosyanın başındaki kurala göre `<i>` de olur); `>` işareti `&gt;` diye yazılır
(ör. `+ Ekle &gt; Öğretmen`). Çok satırlı şablon metinlerdeki satır sonları ve girinti HTML'de tek boşluğa iner.

### `UYGULAMA_EKRANLARI` (dışa açık)

`ekran-goruntuleri/aile-uygulamasi/` altındaki PNG dosya adı → adımın adı (hepsi "Uygulama: " ile başlar): `01-giris.png`
"ne paylaşıldığı ve giriş", `02-giris-dolu.png` "öğrenci hesabıyla giriş ve açık onay", `03-konum-izni-soruluyor.png`
"konum izni isteniyor", `04-bagli-izinler.png` "bağlandı, izinler sırayla", `05-durum.png` "bütün izinler verildi, son
gönderim", `06-bildirim-cubugu.png` "bildirim çubuğunda her zaman görünür". Bu fotoğrafları tur çekmez (Android
öykünücüsünde, deneme sunucusuna bağlıyken çekildi); tur temizlikte bu klasörü korur ve bulduğu PNG'leri albümün telefon
kısmının sonuna ekler. Dosyanın sonunda `ROL_METNI['aile-uygulamasi']` ve bu altı adımın `ADIM_METNI` kayıtları
`Object.assign` ile eklenir.

Dışa açılanlar: `ROL_METNI`, `ADIM_METNI`, `UYGULAMA_EKRANLARI`.

## Kimle konuşur?

- Hiçbir şey çağırmaz (`require` yok).
- **Onu kullanan:** yalnız [gezinti.md](gezinti.md) — `albumYaz` bölüm başlıkları/girişleri için `ROL_METNI`'ni, fotoğraf
  altları ve alt başlıklar için `ADIM_METNI`'ni, uygulama ekranlarının adları için `UYGULAMA_EKRANLARI`'nı okur. Başka hiçbir
  dosya (`require` aramasıyla) onu yüklemez; testler de yüklemez.
- **Anlattığı yerler:** metinler ürünün davranışını iddia eder, bu yüzden şu belgelerle tutarlı kalmalı (en çok sayı içeren
  bölümler): ekler ve 50 MB / 7 gün — [../public/js/parcalar/04d-ekler.md](../public/js/parcalar/04d-ekler.md),
  [../sunucu/bolumler/ekler.md](../sunucu/bolumler/ekler.md); quiz — [../public/js/parcalar/14c-quiz.md](../public/js/parcalar/14c-quiz.md),
  [../sunucu/bolumler/quiz.md](../sunucu/bolumler/quiz.md); servis saatleri, yoklama, notlar, yaklaşma bildirimleri —
  [../public/js/parcalar/19c-okul-hayati.md](../public/js/parcalar/19c-okul-hayati.md) (müdürün ve velinin servis ekranları),
  [../public/js/parcalar/19i-servis-yoklama.md](../public/js/parcalar/19i-servis-yoklama.md) (servisçinin Yoklama'sı: sıra,
  not, Bindi/Geldi/İndi),
  [../sunucu/bolumler/okul-hayati.md](../sunucu/bolumler/okul-hayati.md),
  [../sunucu/yardimci/servis-pencere.md](../sunucu/yardimci/servis-pencere.md); içeri aktarma (950 KB) —
  [../public/js/parcalar/15-aktarim.md](../public/js/parcalar/15-aktarim.md); nakil (saatte 10 yanlış deneme) —
  [../sunucu/bolumler/nakil.md](../sunucu/bolumler/nakil.md); öğrenci hesabı penceresi —
  [../public/js/parcalar/10b-hesaplar.md](../public/js/parcalar/10b-hesaplar.md),
  [../sunucu/bolumler/hesaplar.md](../sunucu/bolumler/hesaplar.md); hatırlatıcılar (en çok 50) —
  [../sunucu/bolumler/hatirlatici.md](../sunucu/bolumler/hatirlatici.md); özellikler —
  [../sunucu/bolumler/ozellikler.md](../sunucu/bolumler/ozellikler.md); kişi kodu (16 karakter, 4'erli tireli) —
  [../sunucu/ortak.md](../sunucu/ortak.md); site ayarları, değerlerin kaynağı ve yönetici dosyası —
  [../sunucu/site.md](../sunucu/site.md), [../public/js/yonetim/09b-site-ayarlari.md](../public/js/yonetim/09b-site-ayarlari.md),
  [../public/js/yonetim/09c-yonetici-dosyasi.md](../public/js/yonetim/09c-yonetici-dosyasi.md); velinin "Çocuğumun telefonu" —
  [../public/js/parcalar/27b-aile.md](../public/js/parcalar/27b-aile.md).

## Nasıl çalışır (adım adım)?

```
gezinti.js turu: her adım için { rol: <klasör>, ad, dosya } kaydı
            │
albumYaz:   bölüm   ← ROL_METNI[<klasör>].baslik / .giris
            her fotoğraf:
              m = ADIM_METNI['<klasör>|<ad>'] || ADIM_METNI['*|<ad>']
              m yok        → fotoğraf yalnız başlıkla; "anlatımı olmayan N adım" uyarısı
              m.bolum var  → (bilgisayar kısmında) önce <h4> alt başlık
              m.metin      → <figcaption> içine ve görüntüleyicide başlığın altına (ham HTML)
            aile-uygulamasi/*.png → ad = UYGULAMA_EKRANLARI[dosya] (yoksa dosya adı)
```

Yeni bir ekran eklemek: gezinti.js'te adımı yaz (`ad` benzersiz olsun), buraya aynı `"klasör|ad"` anahtarıyla bir `A(...)`
ekle; yeni bir konunun ilk adımıysa `bolum` ver. Turu çalıştırınca (ya da yalnız metni değiştirdiysen `--album` ile) albüm
güncellenir.

## Dikkat!

- **Anahtar harfi harfine eşleşmeli.** gezinti.js'te bir adımın adını değiştirirsen buradaki anahtarı da değiştir; yoksa
  fotoğraf açıklamasız çıkar (tur sonunda konsola yazılır). Tersi denetlenmez: adımı silinmiş bir metin burada sessizce
  kalır. 2 Ekim'de iki dosya Node'a yüklenip karşılaştırıldı: 305 adımın hepsinin metni var, kullanılmayan metin yok.
- **Ham HTML yalnız `metin` ve `giris`'te.** Bu ikisi sayfaya kaçırılmadan eklenir, görüntüleyicide `innerHTML` ile basılır.
  `<`, `>`, `&` yazacaksan `&lt;`, `&gt;`, `&amp;` kullan; yalnız `<b>` (ve `<i>`) etiketi kullan. `baslik` ve `bolum` ise
  gezinti.js'te `esc` ile kaçırılır: onlara düz metin yaz (`&gt;` yazarsan sayfada harfi harfine "&gt;" görünür, `<b>`
  de etiket olmaz, yazı olarak görünür). 2 Ekim'de bütün metinler tarandı: etiket olarak yalnız `<b>` var, kaçırılmamış
  `<`, `>` ya da `&` yok; `&gt;` iki yerde (`mudur|Öğretmeni kodla ekleme penceresi` ve `yeni-mudur` girişi).
- **`bolum` sırası.** Alt başlık, metninde `bolum` olan adımdan önce açılır ve sonraki adımlar o başlığın altında kalır;
  o adımı silersen ya da yerini değiştirirsen başlık da kayar. Telefon kısmında alt başlık yoktur.
- **Metinler koda karşı iddiadır.** Bir kural değişince (sınır, süre, düğme adı) buradaki cümle eskir; albüm depoda ve herkese
  açık olduğu için yanlış bilgi yayılır. 2 Ekim'de sayılı iddiaların bir kısmı koda (ek sınırı için kodla denetlenmiş
  [../public/js/parcalar/04d-ekler.md](../public/js/parcalar/04d-ekler.md)'ye) bakılarak denetlendi ve tuttu: ek toplamı 50 MB
  ve 7 gün, kişi kodu 16 karakter ve büyük/küçük harf duyarlı, hatırlatıcı sınırı 50, nakilde saatte 10 yanlış deneme,
  aktarım dosyası 950 KB, servis notu 200 harf, yaklaşma bildirimi 500 m ve 100 m, servis aralığından sonra 60 dakikalık
  uzatma, Özellikler'deki sekiz bölüm, giriş hatalarındaki "deneme hakkın kaldı" ve "hesap yok" iletileri. Metinlerin
  hepsi tek tek denetlenmedi.
- **Bilinen uyuşmazlıklar (kod değiştirilmedi):**
  - `'mudur|Yeni öğrenci hesabı penceresi'` "Kullanıcı adı ve ilk şifre önerilir" diyor; kodda öneri yok, ikisi de boş
    bırakılırsa T.C. kimlik no olur ve öğrenci ilk girişte kendi şifresini belirler (pencerede "Boş bırakırsan T.C. no olur";
    [../sunucu/bolumler/hesaplar.md](../sunucu/bolumler/hesaplar.md)).
  - `'giris|Yapımcılar listesi'` "Liste depodaki yapimcilar.json dosyasından gelir" diyor; 521'den beri önce yöneticinin
    panelde kaydettiği liste (veritabanı) kullanılır, o yoksa depodaki `yapimcilar.json` (`ayarKaynakli('yapimcilar')`,
    [../sunucu/site.md](../sunucu/site.md)). Öteki site ayarlarından farklı olarak yapımcılar için `config.yml` adımı yok.
    Yani metin, panelden hiç kaydedilmemiş sitede doğru; kaydedilmişse eksik.
  - `'admin|Site ayarları'` kartları "iletişim bilgileri, yapımcılar listesi, Play Store bağlantısı, zamanlamalar … ve okul
    adresleri" diye sayıyor; 525'te gelen "Varsayılan okul disk sınırı" kartı ([../public/js/yonetim/09b-site-ayarlari.md](../public/js/yonetim/09b-site-ayarlari.md))
    listede yok. "Her kart değerin nereden geldiğini yazar: panelden kaydedilen, sunucudaki config.yml ya da varsayılan"
    cümlesi de iki kaynağı atlıyor: yapımcılar kartında `yapimcilar.json`, disk kartında `EE_OKUL_DOSYA_GB` ortam değişkeni
    (`SA_KAYNAK`).
  - `'mudur|Excel aktarım'` "Excel (.xlsx, .xls), LibreOffice (.ods), CSV ve düz metin" diyor; düz metin (`.txt`) yalnız
    "Kişi listesi" türünde seçilebilir, "Ders programı" türü `.xlsx, .xls, .ods, .csv` alır (`15-aktarim.js` dosya kutusunun
    `accept`'i); dışarı aktarım her zaman `.xlsx` verir. Küçük bir eksiklik.
  - "Eğitim Evi Aile" adı (`aile-uygulamasi` bölümü ve velinin "Çocuğumun telefonu" adımı) sitedeki adla (`27b-aile.js`,
    `kvkk.html`) aynı ama Android uygulamasının bugünkü adı "Eğitim Evi" ve aile kısmı onun bir ekranı. Altı PNG site
    deposuna `commit 467`'de (2026-09-26) girdi, Android deposunun ilk commit'inden önce: ekranlar ve metinleri büyük
    olasılıkla uygulamanın eski hâlini gösteriyor. Aynı ad uyuşmazlığı [../public/js/parcalar/27b-aile.md](../public/js/parcalar/27b-aile.md)
    "Dikkat!"te de yazılı.
  - `_giris` "Ardından dış sayfalar ve sırasıyla öğretmen, öğrenci, veli, servisçi ve site yöneticisi gelir" diyor; albümde
    arada müdürün veli tarafı, öğretmenin ikinci okulu, bölüm kapalı, nakil öğrenci, yeni yetişkin ve yeni müdür bölümleri
    de var (sıra doğru, liste eksik).
- **Kulüp metinleri kalkacak.** `mudur|Kulüpler`, `mudur|Yeni kulüp penceresi`, `ogretmen|Kulüpler (danışmanı olduğu)`,
  `ogrenci|Kulüpler (üye)`, `veli|Kulüpler`; ayrıca `mudur|Özellikler…` metnindeki "kulüp" ve iki alt başlık ("Okul hayatı:
  yemek, servis, kulüp, anket", "Yemek, servis, kulüp, ayarlar").
- **Gerçek kişi adı yazma.** Depo herkese açık; örnekler yalnız test verisindeki uydurma kişiler olmalı. Metinlerde gerçek
  bir ürün adı (bir okul yönetim sistemiyle karşılaştırma) ve `egitimevi.org` adresleri geçiyor; bunlar kişisel veri değil.

## Testleri

- Bu dosyayı yükleyen ya da denetleyen otomatik test yok (`testler/yazim-denetimi.js` yalnız `sunucu/`, `public/js/parcalar`,
  `public/js/yonetim`, `index.html` ve `kvkk.html`'i tarar; `araclar/`'a bakmaz).
- Eşleşme denetimi gezinti.js'in kendisidir: tur sonunda (ya da `--album` ile) "anlatımı olmayan N adım" satırı çıkmamalı.
- Elle: metni değiştir → `node araclar/gezinti.js --album` (son turun `testler/testdata/gezinti/gezinti.json`'u gerekir) →
  `ekran-goruntuleri/index.html`'i aç, fotoğrafın altında ve görüntüleyicide (fotoğrafa bas) yeni metni gör. Bu kip de
  `index.html`'i yeniden yazar; istemediğin değişikliği `git checkout -- ekran-goruntuleri/index.html` ile geri al.

## Son durum

- `git log --follow`: 13 commit; ilk hâli `e4bf8b0 commit 403` (2026-09-26), son değişiklik `566b917 commit 524` (2026-09-27).
- `566b917 commit 524` (canlı hazırlık): ek sınırı metinlerde 150 MB'tan 50 MB'a indi; yeni ödev penceresinin metnine
  "Öğrenciler bu ödeve dosya yükleyebilsin kutusu kapalı gelir" eklendi; öğrencinin ödev ayrıntısı metnine "öğretmen dosya
  yüklemeyi açtıysa … en fazla 50 MB; çubuk ne kadar yer kaldığını gösterir".
- `153d63d commit 522` (kişi kodu 16 hane): öğretmenin "Kişi kodum" ve yeni yetişkinin "Ekle — Öğretmen" metinleri "15
  karakter, 5'erli gruplar, boşluksuz kopyalar"dan "16 karakter, tireyle ayrılmış 4'erli gruplar, tireli kopyalar"a;
  müdürün "Öğretmeni kodla ekleme penceresi" metninde "15 karakterlik" → "16 karakterlik"; veli kodu "boşluklu yazılsa da
  olur"dan "yazarken tireler kendiliğinden gelir, tireli ya da tiresiz yapıştırılsa da olur"a.
- `276c0a0 commit 521` (gizli `/admin` + site ayarları): `ROL_METNI.admin`'in giriş paragrafına Site Ayarları ve ayrı yönetim
  adresi ("yönetici oturumu olmayan herkes o adreste yalnız 'Sayfa bulunamadı' görür") eklendi; yöneticinin ana sayfa
  metni uzadı; Site ayarları, yapımcı satırları, okul adresini değiştir, Yönetici dosyası, Şimdi oku ve bunların
  koyu/telefon metinleri eklendi.
- Depodaki albüm (`ekran-goruntuleri/index.html`) `commit 509`'da yazıldı; 510–524'teki metin değişiklikleri albüme henüz
  yansımadı (bkz. [gezinti.md](gezinti.md) Son durum).
- Bilinen açıklar: "Dikkat!"teki altı uyuşmazlık (kod değiştirilmedi).
- Planlı işlerden bu dosyayı etkileyecekler: "Ekran turu + albüm + wiki güncelleme" (bütün metinler yeni ekranlara göre
  baştan gözden geçirilecek, gereksiz ekranlar çıkacak); "Kulüpler kaldırılacak" (yukarıdaki kulüp metinleri); "Paneller"
  (yönetici metnindeki ayrı yönetim adresi `/panel/admin` olacak); "Sistem" (yöneticiye zorunlu doğrulama uygulaması);
  "Üst şerit sadeleştirme" (sağ üstteki **+ Ekle**, zil, ay düğmesi ve sol üst menüyü anlatan cümleler); "T.C. bütün
  hesaplarda zorunlu" (kayıt metni); "Mesaj ayarları" (mesaja kimin dosya ekleyebileceği); "Android yerel uygulama"
  (`aile-uygulamasi` ekranları ve adları); yeni özelliklerin ekranları (eğitim içerikleri, toplantılar, mesaj etiketleri,
  çok dil…) yeni anahtarlar ister.
