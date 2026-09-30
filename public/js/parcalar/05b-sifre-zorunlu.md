# public/js/parcalar/05b-sifre-zorunlu.js

Girişten sonraki kapılar: yöneticiyi kendi yönetim adresine geçirmek, aydınlatma metni onayını istemek, şifresini okul ya da
yönetici vermiş kişiye "Kendi şifreni belirle" penceresini açmak; hepsi bitince uygulamayı başlatmak.

## Bu dosya ne yapar?

Oturum açıldı diye uygulama hemen açılmaz. `girisSonrasi(d)` her yeni oturumda (giriş, portal değişimi, sayfa yenilenince
`/api/me`, aydınlatma onayından sonra) çağrılır ve sırayla şunlara bakar:

1. **Yönetici mi?** Sunucu cevabında `yonetimAdresi` (yalnız sistem yöneticisine gelir) varsa ve kişi o adreste değilse, tam
   sayfa geçişle oraya gider. Neden tam sayfa? Yönetim ekranlarının kodu herkese giden `app.js`'te yoktur; ayrı bir paket
   (`/admin/yonetim.js`) yalnız yönetim çereziyle gelir ve tarayıcı o çerezi ancak o adrese giderken gönderir. Tersine,
   yönetim adresinde yönetici olmayan bir hesap açıldıysa (aynı tarayıcıdaki başka sekmenin anahtarı) sitenin köküne döner.
2. **Aydınlatma metni güncel mi?** Değilse onay penceresi (`kvkkOnayIste`, `26-baslat.js`); onaylayınca bu işlev yeniden çağrılır.
3. **Şifresini kendisi mi koydu?** Okulun varsayılan şifreyle açtığı hesap (öğrencinin ilk şifresi çoğu zaman T.C.
   numarasıdır), müdürün T.C.'ye döndürdüğü ya da "değiştirsin" diyerek yenilediği şifre, toplu yenilenen giriş bilgileri ve
   yönetici dosyasından (`admins.json`) açılan yönetici hesabı `sifreDegismeli` taşır: kişi
   "Kendi şifreni belirle" penceresini görür, kapatamaz; ya şifresini koyar ya çıkış yapar.
4. Hepsi tamamsa `uygulamayiBaslat()`.

Sunucu da aynı kapıları tutar: aydınlatma onayı eski ya da şifre değişmeli kişinin öteki isteklerini `403` ile reddeder
([../../../sunucu/api.md](../../../sunucu/api.md)); bu dosya o durumu ekranda karşılar.

## İçinde neler var?

- `yonetimeGec(d)` → `true` (sayfa değişiyor) / `false`.
  - `d.yonetimAdresi` metin değilse ya da tek parçalı bir yol değilse (`/^\/[a-z0-9-]+$/i`: `/admin` olur; `//baska.site`,
    `/a/b` olmaz) `false`.
  - Kişi zaten o adresteyse ya da altındaysa (`/admin/...`) `false`.
  - "Bilgilerimi bu cihaza kaydetme" seçildiyse anahtar yalnız bellektedir ve tam sayfa geçişte kaybolurdu: bu yüzden bir
    kez bu sekmenin `sessionStorage`'ına `ee_gecis` olarak bırakılır (sekmede zaten aynı anahtar varsa bırakılmaz). Gizli
    sekmede yazılamazsa kişiden yeniden giriş istenir.
  - `location.replace(adres)` — adresteki `#…` kısmı bir uygulama sayfası adresi biçimindeyse (`adrestenSayfa`,
    `07-yonlendirme.js`) korunur. `replace` olduğu için geri tuşu eski sayfaya dönmez.
- `gecisAnahtari()` — `ee_gecis`'i bir kez okur ve HEMEN siler (`null` olabilir). Açılışta `26-baslat.js`
  `gecisAnahtari() || tokenOku()` ile kullanır.
- `girisSonrasi(d)` — yukarıdaki sıra. Ayrıntılar:
  - `yonetimeGec(d)` ya da (yönetim paketindeysek) `YONETIM.disariMi()` `true` derse hiçbir şey yapmadan döner.
    `YONETIM` yalnız yönetim paketinde doludur ([00-durum.md](00-durum.md); `09a-yonetim-paneli.js` doldurur).
  - `d.bildirimAralikDk` → `bildirimAraligiAl` (bildirim yoklama aralığı, `24-bildirim-arama-mobil.js`).
  - Yeni oturumsa (`d.token` var: giriş ya da portal değişimi) "portal dışında mı" bilgisi sunucunun `kisilikSec`'inden
    yazılır (`portalDisiYaz`, `08c-kisilikler.js`); `/api/me`'den gelen yenilemede bu sekmenin kaydı korunur.
  - `d.kisilikSec` → `S.acilis = 'ana'` (birden çok portalı olan yetişkin önce hesabının ana sayfasındaki portal kartlarını
    görür). `d.cocuk` → `S.veliCocuk` (tek çocuklu veli o çocukla açılır).
  - `d.kvkkGuncel === false` → `kvkkOnayIste(d)` ve dur.
  - `S.user.sifreDegismeli` → `sifreBelirleIste()` ve dur.
  - Değilse `uygulamayiBaslat()` (`26-baslat.js`).
- `sifreBelirleIste()` — "Kendi şifreni belirle" penceresi. Pencere zaten açıksa (`#zYeni` var) bir şey yapmaz. Dış sayfaları
  ve uygulamayı gizler (arkada boş sayfa), `modalAc` ile pencereyi açar ve perdeye `data-zorunlu="1"` koyar: dışına
  tıklayınca kapanmaz (`25-tiklama.js`); pencerede "Kapat" yok, yalnız "Çıkış yap" (`data-act="cikis"`) ve "Şifremi kaydet"
  (`data-act="zorunlu-sifre-kaydet"`). İçerik:
  - açıklama: "<Sistem yöneticisinin | Okulunun> verdiği şifreyle girdin. Devam etmeden önce yalnızca senin bildiğin bir şifre
    belirle…" (`S.user.yetiskin` ise "Sistem yöneticisinin", değilse "Okulunun");
  - "Şu anki şifren" (`#zEski`, ipucu: yetişkinse "Sistem yöneticisinin sana verdiği şifre.", değilse "Okulun sana verdiği
    şifre (çoğu zaman T.C. kimlik numaran).");
  - "Yeni şifren" (`#zYeni`) + canlı kural listesi (`sifreKuralListesi('zKural', gucluSifreli(S.user))`,
    [05-giris.md](05-giris.md)) + "T.C. kimlik numaranı ya da kullanıcı adını içermesin.";
  - "Yeni şifren (tekrar)" (`#zYeni2`; Enter basınca kaydeder), ileti yeri `#zMesaj`. Odak "Şu anki şifren"de.
- `EYLEMLER['zorunlu-sifre-kaydet']` (tıklanan düğmeyle çağrılır; Enter'da da aynı düğme verilir) — istemcide, hepsi
  kutuların altında: şu anki şifre boş; yeni şifre kurala uymuyor
  (`sifreSorunuTR(y1, gucluSifreli(u))`: öğrenci ve servisçide 8 karakter + harf + rakam, öbürlerinde büyük, küçük, rakam,
  özel karakter); yeni şifre eskisiyle aynı ("Yeni şifre okulun verdiğiyle aynı olamaz."); T.C. numarasını ya da (4+
  karakterliyse) kullanıcı adını içeriyor (büyük/küçük harf fark etmez); iki şifre farklı. Geçerse düğme "Kaydediliyor...",
  `POST /api/password { old, new }`. Başarıda `S.user = d.user` (artık `sifreDegismeli: false`); cevapta `yonetimAdresi`
  varsa (şifresini başkası vermiş yönetici çerezini ilk kez burada alır) yönetim adresine geçer; yoksa pencere kapanır,
  `uygulamayiBaslat()`. Hata: `alan: 'eski'` → "Şu anki şifren" kutusu, `alan: 'yeni'` → yeni şifre kutusu, başka → `#zMesaj`.

## Kimle konuşur?

- Çağırdığı başka parçalar (hepsi aynı IIFE'de, [../../../sunucu/http.md](../../../sunucu/http.md) `birlesikOku`):
  [01-yardimcilar.md](01-yardimcilar.md) (`$`, `api`, `EYLEMLER`), [03-mesaj-modal.md](03-mesaj-modal.md) (`modalAc`,
  `modalKapat`, `mesajGoster`), [04a-form-alanlari.md](04a-form-alanlari.md) (`alanHatasi`, `formHatalariniSil`,
  `ilkHatayaGit`), [05-giris.md](05-giris.md) (`sifreKuralListesi`, `sifreKurallariniIsaretle`, `sifreSorunuTR`,
  `gucluSifreli`, `dugmeBekle`, `dugmeBitir`), `07-yonlendirme.js` (`adrestenSayfa`), `08c-kisilikler.js` (`portalDisiYaz`), `24-bildirim-arama-mobil.js`
  (`bildirimAraligiAl`), `26-baslat.js` (`kvkkOnayIste`, `uygulamayiBaslat`), [00-durum.md](00-durum.md) (`S`, `YONETIM`).
- Sunucu: `POST /api/password` ([../../../sunucu/bolumler/kayit.md](../../../sunucu/bolumler/kayit.md)) — hesap başına 15 dakikada
  10 deneme; `400 { alan: 'eski' }` mevcut şifre yanlış, `400 { alan: 'yeni' }` kurala uymuyor / eskisiyle aynı / T.C. ya da
  kullanıcı adını içeriyor; geçerse şifre yazılır, `sifreDegismeli` kalkar, BU oturum dışındaki bütün oturumlar (cihaz
  anahtarları dahil) kapanır; cevap `{ user, yonetimAdresi? }`. `password` aydınlatma kapısından serbest DEĞİL (önce onay),
  şifre kapısından serbesttir (`SIFRE_SERBEST`, [../../../sunucu/api.md](../../../sunucu/api.md)). Yönetim çerezi ve
  `yonetimAdresi`: [../../../sunucu/yonetim-cerezi.md](../../../sunucu/yonetim-cerezi.md) (şifresi değişmeli yönetici çerez almaz).
- Onu kullananlar:
  - `girisSonrasi` — [05-giris.md](05-giris.md) `oturumuAc` (giriş), `08c-kisilikler.js` `oturumuDegistir` (portal değişimi),
    `25-tiklama.js` (`kvkk-onayla` sonrası, `{ user, kvkkGuncel: true }` ile), `26-baslat.js` (sayfa yenilenince `/api/me`
    cevabıyla; telefon bildiriminden gelinip portal geçişi olmazsa da).
  - `yonetimeGec` — `25-tiklama.js` (Ayarlar'da şifre değiştirince: yöneticinin çerezi yenilenir, başka adresteyse geçer).
    (`26-baslat.js` yalnız yorumunda anar; `gecisAnahtari`'nı çağırır.)
  - `sifreBelirleIste` — [01-yardimcilar.md](01-yardimcilar.md) `api()`: herhangi bir istek `403 { sifreDegismeli: true }` alırsa
    (ör. müdür bu arada şifreyi T.C.'ye döndürdü) ve istek `/password` değilse pencere açılır.
- HTML: pencere `#modalKok`'a çizilir (`modalAc`); `#dis` ve `#app` gizlenir. Kutular: `#zEski`, `#zYeni`, `#zKural`,
  `#zYeni2`, `#zMesaj`; gövde `#modalGovde`.
- CSS: pencere `public/css/parcalar/06-modal.css` (`.perde`, `.modal`, `.modal-alt`), kutular ve ipucu `02-form.css`
  (`.field`, `.hint`, `.hatali`, `.btn.bekliyor`), kural listesi `09-kayit-ekrani.css` (`.sifre-kurallar`, `li.tamam`).
  `data-zorunlu` için ayrı bir CSS kuralı yok; yalnız tıklama davranışını değiştirir.
- Rol: `girisSonrasi` herkes; şifre penceresi şifresi başkasınca verilmiş kişi (okulun açtığı ya da şifresini yenilediği
  öğrenci ve servisçi; müdürün şifresini yenilediği eski tip, yetişkin hesabına bağlı olmayan öğretmen hesabı; yönetici
  dosyasından açılan yönetici). Okul bugün öğretmen hesabı açamaz (öğretmen kendi yetişkin hesabını açar, kişi kodunu verir)
  ve yetişkin hesabına bağlı öğretmenin şifresini değiştiremez. `yonetimeGec` yalnız sistem yöneticisi.

## Nasıl çalışır (adım adım)?

```
girisSonrasi(d)
  ├ d.yonetimAdresi var, adres farklı ─► (gerekirse ee_gecis) ─► location.replace('/admin…')   [tam sayfa]
  │     yeni sayfa açılır ─► 26-baslat.js: gecisAnahtari() || tokenOku() ─► /api/me ─► girisSonrasi (artık adreste)
  ├ yönetim paketindeyiz ama hesap yönetici değil ─► YONETIM.disariMi ─► location.replace('/')
  ├ bildirim aralığı, portal dışı bilgisi, açılış sayfası, veli çocuğu
  ├ kvkkGuncel === false ─► kvkkOnayIste ─► "Onaylıyorum" ─► POST /api/kvkk-onay ─► girisSonrasi({ user, kvkkGuncel: true })
  ├ S.user.sifreDegismeli ─► sifreBelirleIste (kapatılamaz pencere)
  │      "Şifremi kaydet" ─► istemci denetimi ─► POST /api/password { old, new }
  │          ├ { user, yonetimAdresi } ─► yonetimeGec ─► tam sayfa
  │          └ { user } ─► modalKapat ─► uygulamayiBaslat
  └ uygulamayiBaslat
```

Uygulama açıkken de pencere gelebilir: bir istek `403 sifreDegismeli` alırsa `api()` `S.user.sifreDegismeli`'yi işaretler ve
`sifreBelirleIste()`'yi çağırır; ekran boşalır, pencere açılır.

## Dikkat!

- **Yöneticiye yanlış metin çıkıyor.** Pencerenin cümlesi `S.user.yetiskin`'e bakıyor; sunucuda `yetiskin` yalnız rolsüz ya da
  veli hesabı için doğru ([../../../sunucu/bolumler/kayit.md](../../../sunucu/bolumler/kayit.md) `benimGorunum`), yönetici için yanlış.
  Yönetici dosyasından (`admins.json`) açılan ve ilk girişte şifresini değiştirmesi gereken bir yönetici bu yüzden "Okulunun
  verdiği şifreyle girdin" ve "Okulun sana verdiği şifre (çoğu zaman T.C. kimlik numaran)" görür; oysa şifreyi yönetici
  dosyası vermiştir. Ayrıca yeni şifre eskisiyle aynıysa ileti herkese "okulun verdiğiyle aynı olamaz" der. Tersine,
  "Sistem yöneticisinin verdiği şifre" dalı bugün hiçbir akışta çalışmıyor: sunucuda rolsüz ya da veli hesabına
  `sifreDegismeli` koyan bir yol yok (bu işareti yalnız okulun hesap açma/şifre yenileme uçları, toplu giriş bilgisi ve
  yönetici dosyası koyuyor; eski bir `db.json`'dan aktarılan hesapta gelebilir). Metin sorunu; kod değiştirilmedi.
- **`app.js`'te yönetim adresi yazılı olmamalı.** Adres HER ZAMAN sunucunun cevabından (`yonetimAdresi`) okunur;
  `testler/test-admin-gizli.js` herkese giden `app.js`'te `/admin` geçmediğini denetler. Buraya sabit bir adres yazarsan test
  kalır ve yönetim adresi herkese görünür olur.
- **Adres deseni açık yönlendirmeyi engeller:** yalnız `/` ile başlayan tek parçalı bir yol kabul edilir; sunucudan
  beklenmedik bir değer gelse bile (`//baska.site`) başka siteye gidilmez.
- **`ee_gecis` kısa ömürlüdür ama tarayıcının sekme deposunda bir an durur.** "Bilgilerimi bu cihaza kaydetme" seçen yöneticinin anahtarı geçiş
  için bu sekmenin `sessionStorage`'ına yazılır ve yeni sayfa açılır açılmaz silinir. Geçiş yarıda kalırsa (bağlantı koptu)
  anahtar sekme kapanana kadar orada kalır. Yeni sayfada da yalnız bellekte tutulur; yönetim sayfası yenilenirse yeniden giriş
  istenir.
- **Sıra önemli:** aydınlatma onayı şifre penceresinden ÖNCE gelir. Sunucu da öyle ister: `password` ucu onayı eski kişiye
  `403 kvkkGerek` döner. Sırayı değiştirirsen pencere her kaydetmede o hatayı gösterir.
- **Pencere kapatılamaz ama kaçış var:** "Çıkış yap" her zaman çalışır (`cikisYap`). Esc tuşu pencereyi kapatmaz (modal
  kodunda Esc dinleyicisi yok); perdeye tıklamak `data-zorunlu` yüzünden kapatmaz.
- **İstemci denetimi sunucunun aynısı değildir, önünden gider:** T.C./kullanıcı adı kuralı ve "eskisiyle aynı" burada da
  bakılır ki hata hemen kutunun altında görünsün; son söz sunucunundur (ileti yine ilgili kutuya düşer).
- **`sifreBelirleIste` iki kez açılmaz** (`#zYeni` denetimi); `api()` birden çok 403 alsa da tek pencere.
- **Şifre değişince öteki oturumlar kapanır:** kişinin başka cihazlardaki (ve Android uygulamasındaki) oturumları düşer;
  bu sekme açık kalır.
- **`girisSonrasi` birden çok yerden, farklı biçimli `d` ile çağrılır** (tam giriş cevabı, `/api/me` cevabı, yalnız
  `{ user, kvkkGuncel }`). Yeni bir alan okuyacaksan her çağıranın onu gönderip göndermediğine bak; bugün `token` yalnız yeni
  oturumda vardır ve "portal dışı" bilgisi buna göre yazılır.

## Testleri

- Bu dosyanın kendisini tarayıcıda çalıştıran bir test yok. Dayandığı sunucu davranışları:
  - `testler/test-yonetim.js` — "3b) T.C. ile varsayılan giriş ve zorunlu şifre değişimi": T.C. ile açılan öğrenci
    `sifreDegismeli: true` girer, şifresini değiştirmeden bölümlere giremez (`403 sifreDegismeli`), yeni şifre T.C.'yi
    içeremez ve eskisiyle aynı olamaz, kendi şifresini koyunca bölümler açılır; müdür şifreyi boş bırakıp sıfırlayınca yine
    `sifreDegismeli`.
  - `testler/test-giris-bilgisi.js` — toplu giriş bilgisi yenilenen öğrenci yeni şifreyle girer, `sifreDegismeli` ile gelir,
    aydınlatmayı onaylayıp kendi şifresini koyar.
  - `testler/test-yonetici-dosyasi.js` — `admins.json`'dan açılan yönetici `sifreDegismeli` ile girer; şifresini değiştirmemiş
    yönetici `yonetimAdresi` ve çerez ALMAZ.
  - `testler/test-admin-gizli.js` — girişte, `/api/me`'de ve şifre değişiminde yöneticiye `yonetimAdresi: '/admin'` ve yeni
    çerez; öğretmen ve öğrenciye hiç; herkese giden `app.js`'te `/admin` yok; yönetim kabuğu `/admin/yonetim.js` yüklüyor.
  - `testler/test-aktarim.js` — T.C. ile giriş, ilk girişte şifre değişmeli.
- `testler/buton-denetimi.js` — `zorunlu-sifre-kaydet` ve `cikis` eylemlerinin karşılığı.
- Elle: sunucuyu 3200'de aç; müdürle (`testler/seed.js`) T.C.'si kayıtlı bir öğrencinin şifresini boş bırakarak yenile
  (şifre T.C. olur); öğrenciyle kullanıcı adı ve T.C.'siyle gir → aydınlatma onayı henüz yoksa önce o, sonra "Kendi şifreni
  belirle"; eski şifreyi yeni olarak yazmayı ve
  T.C.'yi içeren şifreyi dene, sonra geçerli bir şifre koy → uygulama açılmalı. Yönetici için: yöneticiyle `/login`'den gir,
  adres kendiliğinden yönetim adresine geçmeli.

## Son durum

- `git log`: 4 commit.
  - `276c0a0 commit 521` (2026-09-27, gizli yönetim adresi): `yonetimeGec` ve `gecisAnahtari` eklendi; `girisSonrasi` önce
    yöneticiyi kendi adresine geçiriyor, yönetim adresinde yönetici olmayanı `YONETIM.disariMi()` ile dışarı alıyor ve
    `bildirimAralikDk`'yı alıyor; zorunlu şifre kaydedilince yönetici çerezini alıp geçiyor.
  - `0acca75 commit 516` (2026-09-27, portallar): birden çok portallı yetişkinin açılışı "kişilik seçimi" ekranı yerine
    hesabın ana sayfası (`S.acilis = 'ana'`); yeni oturumda `portalDisiYaz`.
  - `484dfe6 commit 173` (2026-09-08): `EYLEMLER['zorunlu-sifre-kaydet']` (istemci denetimleri ve `/api/password`) eklendi.
  - İlk hâli `a8fabcf commit 71` (2026-08-29).
- Bilinen açık (kod değiştirilmedi): yöneticiye "okulunun verdiği şifre" denmesi.
- Planlı işlerden bu dosyayı etkileyecekler:
  - "Paneller /panel/admin ve /panel/destek" — tanımın eki "otomatik yönlendirme YOK" diyor: yönetici ve destek girişten
    sonra kendiliğinden panele atılmayacak, alt bilgideki "Yönetim"/"Destek paneli" düğmesiyle geçecek. `yonetimeGec`'in
    girişteki otomatik geçişi bu işte kalkacak ya da değişecek (yönetim adresi de `/panel/admin` olacak).
  - "Sistem" — yöneticiye (ve önerisiyle desteğe) ZORUNLU doğrulama uygulaması: kurulu değilse girişten sonra yalnız kurulum
    ekranı açılacak; ilk yönetici önce şifresini değiştirip sonra TOTP kuracak. `girisSonrasi`'nın sırasına yeni bir kapı gelir.
  - "Güvenlik denetimi" — okulun verdiği HER şifre ilk girişte değişecek (yalnız T.C.'li olanlar değil): bu pencereyi daha çok
    kişi görecek.
  - "Kullanıcı arama … yöneticinin ve desteğin şifre değiştirmesi" — yönetici/destek birinin şifresini değiştirince kişi ilk
    girişte bu pencereyi görecek; pencerenin "kim verdi" cümlesi buna göre (destek de) düzenlenmeli.
  - "Toplantılar … tahta hesabı" — tahta hesabına "ilk girişte değiştir" kuralı uygulanmayacak ve aydınlatma kapısı
    sorulmayacak (tanımdaki istisna).
