# public/js/indir.js

İndirme sayfasının (`/indir/indir.html`) betiği: Android uygulamasının sürümlerini `/api/uygulama`'dan alıp "son sürüm"
kutusunu ve bütün sürümlerin tablosunu çizer, iPhone/iPad için "Ana Ekrana Ekle" adımlarını açar, ana ekrandan açılan
sayfayı siteye geçirir.

## Bu dosya ne yapar?

Eğitim Evi'nin bir Android uygulaması var; Play Store'da olmayabilir, dosyası (APK) uygulamanın açık kaynak deposunda
GitHub "Releases" olarak yayımlanıyor. Kişinin oraya gidip aramasına gerek kalmasın diye sitede bir indirme sayfası var:
üstte en yeni sürüm ve büyük bir **İndir** düğmesi, altta PostgreSQL'in indirme sayfası gibi bütün sürümlerin tablosu
(sürüm, tarih, ne değişti, boyut, SHA-256 özeti, indir). iPhone için uygulama yok; sayfa iPhone'da siteyi ana ekrana
eklemeyi adım adım anlatır.

Sayfanın kendisi düz HTML'dir (`public/indir/indir.html`; uygulama paketi `/js/app.js` yüklenmez). Sürüm listesi her
açılışta değişebileceği için HTML'e yazılmaz, bu dosya sunucudan alıp çizer. Tarayıcı GitHub'a doğrudan gitmez (CSP
`connect-src 'self'`): sunucu listeyi GitHub'dan çeker, süzer, 15 dakika saklar ve `/api/uygulama`'dan verir
([../../sunucu/uygulama-surum.md](../../sunucu/uygulama-surum.md)). Sayfadaki öbür ortak düğmeleri (Yapımcılar, ay/güneş)
[belge.md](belge.md)'deki `public/js/belge.js` kurar.

Satır içi betik CSP'ye takıldığı için (`script-src 'self'`) iş ayrı dosyada. ES5, tek IIFE, dışarıya ad açmaz.

## İçinde neler var?

Dosyada dışa açılan bir şey yok; hepsi IIFE'nin içindeki yerel adlardır.

### Sabit ve biçim yardımcıları

- `ISARET` — İndir düğmelerindeki aşağı ok simgesi (çizgi SVG, `class="ikon"`, `aria-hidden`).
- `esc(s)` — HTML kaçışı (`& < > " '`); sunucudan gelen her değer sayfaya bununla girer.
- `tarihYaz(iso)` — `"26 Eylül 2026"` (tarayıcının saat diliminde, `toLocaleDateString('tr-TR', { day, month: 'long',
  year })`); tarih okunamazsa `''`; tarayıcı bu biçimi desteklemeyip hata atarsa ISO'nun ilk 10 karakteri (`2026-09-26`).
- `boyutYaz(b)` — 1 MB altı `"640 KB"` (en az `1 KB`), üstü bir ondalık ve virgülle `"12,4 MB"`. (Uygulamadaki
  `boyutYaz`/`boyutYazi`'nin kopyası değil, kendi küçük biçimi; burada uygulama paketi yok.)
- `indirDugmesi(s, buyuk)` — `<a class="btn">` (büyük) ya da `<a class="btn kucuk ghost">` (tablodaki); `href` sürümün APK
  adresi (`s.apk.adres`), `rel="noopener"`, ekran okuyucu için `aria-label="Sürüm 1.0.1 APK dosyasını indir (12,4 MB)"`.
  Büyük düğmenin yazısı `İndir (APK, 12,4 MB)`, küçüğünki yalnız `İndir`. Dosya GitHub'dan iner (bağlantı sitenin
  sunucusundan geçmez).

### `ciz(d)` — sürüm kutusu ve tablo

`d` sunucunun cevabıdır: `{ playStore, sayfa, alindi, surumler: [{ surum, ad, tarih, notlar, apk: { ad, adres, boyut,
sha256 } }] }` (en yeni en üstte). `alindi` ve `apk.ad` (dosya adı) burada kullanılmaz.

- `play` — `d.playStore` yalnız `https://play.google.com/` ile başlıyorsa; o zaman yanına "Google Play'den yükle" düğmesi
  (`btn ghost`, yeni sekme) eklenir. Play Store bağlantısını yönetici "Site ayarları"ndan girer (kaydedilmemişse sunucunun
  ayar dosyasındaki değer, o da yoksa boş: düğme çıkmaz).
- `githubSayfa` — `d.sayfa` `https://github.com/` ile başlıyorsa o, değilse kodda yazılı
  `https://github.com/KARANKOYU/Egitim-Evi-App/releases`.
- Liste boşsa (sunucu GitHub'a ulaşamadı ve elinde eski liste yok, istek başarısız oldu, sunucu dışarı istek atmıyor ya
  da GitHub cevap verdi ama süzgeçten geçen hiç sürüm yok — depoda henüz yayımlanmış sürüm yoksa ya da hepsi taslak/ön
  sürümse, APK'sı yoksa):
  `#indirSon`'a "Sürüm listesi şu an alınamadı" · "Bütün sürümler GitHub'daki sayfada da duruyor." + (varsa) Play düğmesi +
  "GitHub'daki sürümler" düğmesi; `#indirTablo` boşaltılır.
- Liste doluysa:
  - `#indirSon`: "Son sürüm 1.0.1" · `26 Eylül 2026 · Android 8.0 ve üstü` + büyük İndir + (varsa) Play düğmesi.
  - `#indirTablo`: `table.indir-tablo`, sütunlar Sürüm · Tarih · Neler değişti · Boyut · Dosya. İlk satırın sürümüne
    `son` rozeti (`.etiket-son`). "Neler değişti" sürümün notu, not boşsa sürümün adı; SHA-256 özeti varsa altında
    `SHA-256: …` (`.ozet`). Sürüm, Tarih ve Boyut hücrelerinde `data-baslik` var: dar ekranda tablo kartlara dönüşünce
    hücrenin önüne bu ad yazılır (sayfanın kendi CSS'i).

### iPhone ve iPad bölümü

- Ana ekrandan açılış: `navigator.standalone === true` (iPhone/iPad'de ana ekrana eklenmiş site) ya da
  `(display-mode: standalone)` eşleşiyorsa sayfa hemen `location.replace('/')` ile siteye geçer ve dosyanın geri kalanı
  (iPhone düğmesi, sürüm listesi) hiç çalışmaz. Neden: kişi bu sayfadayken "Ana Ekrana Ekle" derse simge bu sayfayı
  açabilir; açınca indirme sayfası değil site gelsin.
- `ios` — tarayıcı kimliğinde `iPhone|iPad|iPod` ya da (iPadOS 13 ve sonrası kendini Mac diye tanıttığı için)
  `Macintosh` + dokunmatik ekran (`navigator.maxTouchPoints > 1`).
- `safariDisi` — iOS'taki Chrome (`CriOS`), Firefox (`FxiOS`), Edge (`EdgiOS`), Opera (`OPiOS`) ya da Google uygulaması
  (`GSA/`).
- `#iosEkle` ("iPhone'a ekle", mavi düğme) tıklanınca `#iosAdimlar` açılır/kapanır, `aria-expanded` güncellenir. Açılırken
  `#iosNot`'a duruma göre bir not yazılır, sonra adımlar yumuşakça görünür alana kaydırılır:
  - iPhone/iPad değilse: "Bu adımlar iPhone ya da iPad içindir. Telefonunda `<site adresi>`/indir adresini aç ve bu
    düğmeye orada bas." (`location.host`; kısa `/indir` adresi sunucuda asıl adrese yönlenir);
  - iOS'ta Safari dışındaysa: "Safari dışında bir tarayıcıdasın. iOS 16.4 ve üstünde Chrome ve Edge de ana ekrana
    ekleyebilir; Paylaş düğmesini bulamazsan sayfayı Safari ile aç.";
  - Safari'deyse: "Aşağıdaki adımları izle; bir kez yapman yeterli."
  Dört adımın kendisi (Safari ile aç → Paylaş → Ana Ekrana Ekle → simgeden aç, giriş yap, bildirimleri Ayarlar'dan aç)
  HTML'de yazılı, bu dosya yalnız gösterir.

### Açılış

`fetch` yoksa `ciz(null)` ("alınamadı" kutusu). Varsa `GET /api/uygulama` (`credentials: 'omit'`) → başarılıysa (2xx) JSON, değilse
`null` → `ciz`. Ağ hatası ya da `ciz`'in içinde bir hata olursa `catch` → `ciz(null)`.

## Kimle konuşur?

- Onu yükleyen: yalnız `public/indir/indir.html` (`<script src="/js/indir.js" defer>`; önce eş zamanlı `/js/tema.js`, sonra
  `defer` ile `/js/belge.js`). Sayfanın kısa ve eski adresleri (`/indir`, `/indir.html`, `/download`, büyük harfli ve
  Türkçe İ/ı'lı yazılışları) sunucuda 301 ile `/indir/indir.html`'e yönlenir ([../../sunucu/http.md](../../sunucu/http.md),
  `YONLENDIRMELER`).
- Sayfada dayandığı öğeler: `#indirSon` (`aria-live="polite"`: liste gelince ekran okuyucu okur; başta "Sürümler
  yükleniyor..."), `#indirTablo`, `#iosEkle`, `#iosAdimlar` (başta `hidden`), `#iosNot`. Bağlantı hedefi `#iphone` (sayfanın
  kendi "iPhone ve iPad" başlığı) HTML'de.
- Sunucu: `GET /api/uygulama` — `sunucu/site.js` ([../../sunucu/site.md](../../sunucu/site.md)) girişsiz açık uç;
  `surumler` ve `sayfa` `sunucu/uygulama-surum.js`'ten ([../../sunucu/uygulama-surum.md](../../sunucu/uygulama-surum.md)),
  `playStore` site ayarından (yönetim ekranı [yonetim/09b-site-ayarlari.md](yonetim/09b-site-ayarlari.md), doğrulama
  [../../sunucu/bolumler/site-ayarlari.md](../../sunucu/bolumler/site-ayarlari.md)). Sunucu yalnız bu deponun
  `releases/download/…/<ad>.apk` adreslerini, boyutu 0'dan büyük ve 500 MB'tan küçük dosyaları, taslak ve ön sürüm
  olmayanları verir (en çok 30 sürüm); notu düz metne çevirir (HTML kaçışı bu dosyada).
- Siteden bu sayfaya gelen bağlantılar: dış sayfaların üst şeridindeki "İndir" (`#sUygulama`, `public/index.html` ve düz
  sayfalar), SSS'deki cevap, "Çocuğumun telefonu" sayfasındaki kurulum kartı (`27b-aile.js`, `AILE_APK`, yeni sekmede).
- Benzer iş: uygulamanın içinde PWA kurulumu [parcalar/04-pwa.md](parcalar/04-pwa.md) (`kurulumYardimi`'ndeki iPhone
  adımları; o dosya yeni iPad'leri tanımıyor, bu dosya `maxTouchPoints` ile tanıyor).
- Ekran turu: `araclar/gezinti.js` "İndir — Android sürümleri ve iPhone" ve "İndir — iPhone'a ekle adımları" (`#iosEkle`'ye
  basar, `#iphone`'a kaydırır) görüntülerini çeker.
- CSS: sayfanın kendi `<style>` bloğu (`.indir-son`, `.indir-tablo` ve dar ekranda kart görünümü, `.etiket-son`, `.ozet`,
  `.ios-kart`, `.btn-mavi`, `.ios-adimlar`, `.ios-uyari`); düğmeler `public/css/parcalar/02-form.css` (`.btn`, `.ghost`,
  `.kucuk`), simge `public/css/parcalar/12-ikonlar.css` (`.ikon`).
- Rol: herkes; giriş gerekmez, oturum kullanılmaz.

## Nasıl çalışır (adım adım)?

```
/indir/indir.html açılır (#indirSon: "Sürümler yükleniyor...")
  tema.js ─► belge.js ─► indir.js
     ana ekrandan mı açıldı (standalone)? ── evet ─► location.replace('/')   (bitti)
     #iosEkle'ye tıklama dinleyicisi
     GET /api/uygulama
        sunucu: 15 dk'lık önbellek ya da GitHub Releases ─► süz ─► { playStore, sayfa, alindi, surumler }
        ciz(d)
          surumler boş ─► "Sürüm listesi şu an alınamadı" + GitHub (+ Play)
          dolu        ─► "Son sürüm X" + büyük İndir (+ Play)
                         tablo: X (son) · tarih · not · boyut · İndir   (+ SHA-256)
```

Kişinin gözünden: Android telefonunda "İndir"e basar, APK dosyası iner; açar, bilinmeyen kaynak izni verir, kurar
(adımlar sayfada yazılı). iPhone'da mavi "iPhone'a ekle"ye basar, Safari'nin Paylaş → Ana Ekrana Ekle adımlarını görür;
ana ekrandaki simgeden açınca doğrudan site gelir.

## Dikkat!

- **Kurulu uygulamada (PWA) bu sayfa açılmıyor.** `(display-mode: standalone)` yalnız iPhone ana ekranında değil, Android
  Chrome'da ya da bilgisayarda "uygulama olarak kurulmuş" sitenin penceresinde de eşleşir (sitenin `manifest.json`'ı
  `"display": "standalone"`). O pencerede giriş öncesi şeritteki "İndir"e basan kişi indirme sayfasına gider gitmez ana
  sayfaya döner; Android uygulamasını o pencereden indiremez. Kod okumasına göre; tarayıcıda denenmedi. Düzeltme önerisi:
  yönlendirmeyi yalnız iOS'ta (`navigator.standalone === true` ya da `ios` iken) yapmak.
- **`#iosNot` denetlenmiyor.** Düğme ve adımlar varsa not öğesinin de var olduğu varsayılır; HTML'den silinirse düğmeye
  basınca hata atılır. `ciz` de `#indirSon` ve `#indirTablo`'yu denetlemez: biri silinirse `ciz` hata atar, `catch`
  `ciz(null)`'u çağırır, o da aynı hatayı atar ve söz yakalanmadan kalır (konsolda "Uncaught (in promise)"). Bugün hepsi
  sayfada.
- **Boş liste "alınamadı" der.** Sunucu GitHub'dan cevap aldığı hâlde gösterilecek sürüm çıkmazsa (depoda henüz
  yayımlanmış APK'lı sürüm yok) da kutu "Sürüm listesi şu an alınamadı" yazar; oysa liste alınmıştır, yalnız boştur.
  Cevaptaki `alindi` bu ikisini ayırabilirdi ama bu dosya ona bakmıyor. Kişi yine "GitHub'daki sürümler" bağlantısını
  görür; yanıltıcı olan yalnız cümle.
- **Elle eşit tutulan değerler.** "Android 8.0 ve üstü" yazısı uygulamanın en düşük Android sürümüyle aynı olmalı (Android
  deposunda `minSdk 26` = Android 8.0). Depo adresi (`KARANKOYU/Egitim-Evi-App`) burada yedek bağlantı olarak, sunucuda
  (`DEPO`, `DOSYA_ADRESI`) ve sayfanın HTML'inde ayrı ayrı yazılı; depo taşınırsa hepsini birlikte değiştir. Play Store
  adresi sunucuda da `https://play.google.com/` ile sınırlı; burada ikinci kez denetlenir.
- **Her şey `esc`'ten geçer.** Sürüm adı, notu, adresi ve özeti dışarıdan (GitHub) gelir; sunucu süzse de sayfaya
  `innerHTML` ile girdiği için kaçış şart. Yeni bir alan eklersen onu da `esc`'le.
- **Liste gelmezse kişi yine indirebilir.** "Alınamadı" kutusu GitHub'daki sürümler sayfasına bağlanır. Testlerde sunucu
  dışarı istek atmadığı için (`EE_DIS_ISTEK=0`) sayfa hep bu hâlde görünür.
- **SHA-256 yalnız tabloda.** Büyük düğmenin yanında özet yok; denetlemek isteyen tablodaki satıra bakar. Sunucu özeti
  GitHub'ın verdiği `sha256:` özetinden alır; yoksa boş kalır, satırda gösterilmez.
- **Tarih kişinin saat diliminde.** Sunucu ISO (UTC) verir, `tarihYaz` tarayıcının yerel gününe çevirir; gece yarısına
  yakın yayımlanan sürüm farklı saat dilimlerinde bir gün kayık görünebilir.
- **Hata sessiz.** İstek başarısız olursa yalnız "alınamadı" kutusu görünür; konsola bir şey yazılmaz.
- Bu `.md` dosyası `public/` altında dursa da sunucu `.md` dosyalarını sunmaz (bilinmeyen adresle aynı 404).

## Testleri

- Bu dosyayı tarayıcıda çalıştıran bir test yok; yazım denetimi (`testler/yazim-denetimi.js`) de onu taramaz.
- `testler/test-etut.js` — `/api/uygulama` girişsiz açık, cevap tam olarak `alindi`, `playStore`, `sayfa`, `surumler`;
  testte dışarı istek yok (`alindi: false`), `sayfa` `https://github.com/` ile başlıyor; `/indir/indir.html` indirme
  sayfası ve `/js/indir.js`'i yüklüyor; `/indir` ve `/download/` 301 ile oraya yönleniyor.
- `testler/test-uygulama-surum.js` (sunucusuz) — bu dosyanın çizdiği listenin sunucu tarafı: taslak/ön sürüm/bozuk sürüm
  numarası atılıyor, APK adresi yalnız bu deponun, SHA-256 64 hane değilse boş, not düz metne çevriliyor, en yeni en üstte.
- `testler/test-site-ayarlari.js` — yöneticinin kaydettiği Play Store bağlantısı `/api/uygulama`'da görünüyor; `http://`
  ve `play.google.com` dışı adresler reddediliyor, boş bırakılabiliyor; cevap tarayıcıda saklanmıyor (`no-store`;
  değişiklik sayfa yenilenince görünür).
- `testler/test-adresler.js` — `/indir/indir.html` 200 (HEAD de), bütün kısa/eski/büyük harfli/Türkçe harfli adresler 301
  ile oraya; sayfanın betikleri (bu dosya dahil) 200.
- Elle: sunucuyu `EE_DIS_ISTEK` vermeden aç (`PORT=3200`), `http://localhost:3200/indir/indir.html` → üstte "Son sürüm …",
  altta tablo; `EE_DIS_ISTEK=0` ile açınca "Sürüm listesi şu an alınamadı". Bilgisayarda "iPhone'a ekle"ye bas → "Bu adımlar
  iPhone ya da iPad içindir…" notu ve dört adım. Telefon görünümünde (dar pencere) tablo kartlara dönüşmeli.

## Son durum

- `git log`: 3 commit. Son değişiklik `b6bfc03 commit 517` (2026-09-27): yalnız baştaki yorum — sayfanın adresi
  `egitimevi.org/indir` yerine `egitimevi.org/indir/indir.html (kısaca /indir)` (sayfaların klasörlere taşındığı iş; HTML
  dosyası da `public/indir.html`'den `public/indir/indir.html`'e taşındı).
- Ondan önce `b9b5908 commit 511` (2026-09-26): iPhone ve iPad bölümü eklendi — ana ekrandan açılınca siteye geçiş,
  iPhone/iPad (iPadOS'un Mac kimliği dahil) ve Safari dışı tarayıcı tanıma, "iPhone'a ekle" düğmesinin aç/kapa davranışı
  ve üç durumlu not. Dosyanın ilk hâli `fa9a072 commit 510` (2026-09-26): sürüm tablosu, son sürüm kutusu, Play Store ve
  GitHub düğmeleri (aynı commit sunucunun GitHub sürüm listesini ve `/api/uygulama`'yı getirdi).
- Bilinen açıklar (kod değiştirilmedi): kurulu PWA penceresinde sayfanın kendini ana sayfaya atması; `#iosNot`'un
  (ve `#indirSon`/`#indirTablo`'nun) denetlenmemesi; boş sürüm listesinde "alınamadı" denmesi.
- Planlı işlerden bu dosyaya dokunması beklenenler: "Çok dil" işinde indirme sayfasının arayüz metni seçili dile göre
  olacak (buradaki "Son sürüm", "Sürüm listesi şu an alınamadı", tablo başlıkları, iPhone notları dahil). "Üst şerit
  sadeleştirme" işinde portaldaki "Uygulamayı indir" bir karta/profil menüsüne taşınacak ve "uygulamadan girildiyse hiç
  görünmez" denecek — o iş kurulu uygulamayı tanırken buradaki `standalone` sorununu da düşünmeli. "Android yerel uygulama"
  işindeki "uygulama kendini güncellesin" ya bu sayfanın kullandığı listeyi ya da yeni bir sunucu ucunu kullanacak; yeni
  sürümler GitHub'a yayımlandıkça bu tabloya kod değişmeden girer.
