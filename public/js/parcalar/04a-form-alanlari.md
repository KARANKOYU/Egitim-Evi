# public/js/parcalar/04a-form-alanlari.js

Formların ortak davranışı: kutunun altında kırmızı hata yazısı, ilk hatalı kutuya kaydırma, her şifre kutusuna göz
düğmesi, Caps Lock uyarısı ve doğum tarihi için gün/ay/yıl seçici.

## Bu dosya ne yapar?

Giriş ve kayıt ekranı, profil/ayarlar, müdürün hesap pencereleri, yöneticinin site ayarları… hepsi form. Bu dosya onların
ortak parçalarını tek yerde toplar ki her ekran aynı biçimde davransın:

- **Alan hatası.** "Bir şeyler yanlış" diye formun tepesine yazmak yerine hatalı kutu kırmızı çerçeve alır, hemen altına
  nedeni yazılır; kişi o kutuya yazmaya başlayınca hata kendiliğinden kalkar. Ekran okuyucu da hatayı duyar
  (`aria-invalid`, `role="alert"`, `aria-describedby`).
- **Şifre kutusu.** Sayfadaki HER `<input type="password">`'ün sağına "Şifreyi göster/gizle" göz düğmesi eklenir; ekranlar
  bunun için tek satır yazmaz. Caps Lock açıkken kutunun altında uyarı çıkar (yanlış yazılan şifrenin en sık nedeni).
- **Gün/ay/yıl seçici.** Tarayıcının tarih kutusu dile göre "mm/dd/yyyy" gösterebiliyor ve doğum yılına gitmek için ay ay
  geri sarmak gerekiyor. Üç açılır liste her tarayıcıda aynı görünür ve hızlı seçilir; değer gizli bir kutuda
  `YYYY-AA-GG` olarak durur.

(Ödev tarihleri için takvimli seçici ayrı bir dosyada: [04e-tarih-secici.md](04e-tarih-secici.md). Bu dosyadaki seçici
doğum tarihi içindir.)

## İçinde neler var?

### Alan hatası

- `alanHatasi(el, mesaj, ekHtml)` — `el` öğe ya da kimlik. Kutunun kabı `.field` (ya da onay kutusu için `.kvkk-alan`),
  yoksa üst öğe. Kaba `hatali` sınıfı, kutuya `aria-invalid="true"` konur; kabın sonuna bir kez `<div class="alan-hata"
  id="<kutu kimliği>Hata" role="alert">` eklenir ve içine uyarı ikonu + `esc(mesaj)` + (varsa) `ekHtml` yazılır;
  kutunun `aria-describedby`'ı bu kimliğe çevrilir. `ekHtml` kaçırılmaz: ör. `05-giris.js` hatanın yanına "Okulunu bul"
  düğmesi koyar.
- `alanTemizle(alan)` — kabın `hatali` sınıfını, `.alan-hata` kutusunu ve içindeki bütün `aria-invalid`/`aria-describedby`
  işaretlerini kaldırır.
- `formHatalariniSil(form)` — formdaki her `.hatali` kap için `alanTemizle` (gönderimden önce eski hataları silmek için).
- `ilkHatayaGit(form)` — ilk `aria-invalid="true"` kutuyu ekranın ortasına kaydırır (hareket azaltma tercihi varsa
  kaydırma animasyonsuz) ve imleci içine koyar.

### Şifre kutusu

- `sifreGozuEkle(input)` — kutuyu bir `.sifre-kap` içine alır ve yanına `<button type="button" class="sifre-goz"
  aria-label="Şifreyi göster" aria-pressed="false">` (göz ikonu) ekler; kutuya `data-goz="1"` konur (ikinci kez eklenmesin).
- `sifreGoster(input, goster)` — kutunun türünü `text`/`password` yapar; düğmenin yazısını, `aria-pressed`'ini ve ikonunu
  (`goz` / `gozKapali`) günceller.
- `sifreKutulariniTara(kok)` — `kok` (varsayılan belge) içinde göz düğmesi olmayan bütün şifre kutularına ekler.
- `capsUyarisi(input, acik)` — kutunun altına "Büyük harf kilidi (Caps Lock) açık." (`.caps-uyari`) koyar ya da kaldırır.

### Gün/ay/yıl seçici

- `tarihSecici(kimlik, iso, secenek)` — HTML döner: `.tarih-secici[data-tarih=kimlik]` içinde üç `<select>`
  (`<kimlik>Gun` 1–31, `<kimlik>Ay` Ocak…Aralık, `<kimlik>Yil` en yeniden en eskiye) ve gizli `<input id="<kimlik>">`.
  `secenek.enKucukYas` en yeni yılı geri çeker (bu yıl − yaş), `secenek.enEski` en eski yıl (varsayılan 1920). `iso` tam
  bir tarihse seçimler ve gizli değer dolu gelir. Tarayıcı otomatik doldurması için `autocomplete="bday-day|month|year"`.
- `tarihSeciciGuncelle(kap)` — seçim değişince: ayın gün sayısını bulur (yıl seçilmemişse 2000 varsayılır ki 29 Şubat açık
  kalsın), fazla günleri kapatır (31 Şubat seçilemez), seçili gün fazlaysa ayın son gününe çeker, üçü de seçiliyse gizli
  değeri `YYYY-AA-GG` yazar, yoksa boşaltır; yarım seçimde kaba `eksik` sınıfı koyar.
- `tarihSeciciDurum(kimlik)` — `''` (hiç seçilmedi), `'eksik'` (yarım), ya da `YYYY-AA-GG`.

### Kurulum

- `formAlanlariKur()` — açılışta bir kez (`26-baslat.js`):
  - belgedeki şifre kutularını tarar ve bir `MutationObserver` ile sonradan eklenenleri de (sayfalar `innerHTML` ile yeniden
    çizildiği için) tarar;
  - göz düğmesine `mousedown`'da `preventDefault` (imleç kutudan çıkmasın, telefonda klavye kapanmasın), `click`'te göster/
    gizle, imleci kutuya ve metnin sonuna koy;
  - form `reset` olunca görünen şifreler yeniden gizlenir;
  - şifre kutusunda `keydown`/`keyup`'ta `getModifierState('CapsLock')` → uyarı; kutudan çıkınca uyarı kalkar;
  - `input` ve `change` olaylarında: öğe bir `.tarih-secici`'nin içindeyse (`change`'te) `tarihSeciciGuncelle`; öğe bir
    `.hatali` kabın içindeyse `alanTemizle` (kişi düzeltmeye başladı).

## Kimle konuşur?

- Çağırdıkları: `$`, `esc` ([01-yardimcilar.md](01-yardimcilar.md)), `ik('uyari'|'goz'|'gozKapali')` ve `AY_ADI`
  ([02-ikonlar.md](02-ikonlar.md)). İstek atmaz.
- Onu kullananlar:
  - `alanHatasi` — 14 dosya: `05-giris.js` (30 çağrı: giriş, kayıt, şifre sıfırlama), `10b-hesaplar.js` (15),
    `09b-site-ayarlari.js` (13), `05b-sifre-zorunlu.js`, `23-veli-ayarlar.js`, `09-yonetici.js` (7'şer), `18b-etut.js`,
    `09d-okul-disk.js` (4'er), `08c-kisilikler.js`, `10-mudur.js`, `11-ogretmen-odev.js`, `16b-okul-ayarlari.js`,
    `19-mesajlar.js` (2'şer), `25-tiklama.js` (1).
  - `alanTemizle` — 10 dosya; `formHatalariniSil` ve `ilkHatayaGit` — 8'er dosya (`05-giris.js`, `05b-sifre-zorunlu.js`,
    `10b-hesaplar.js`, `11-ogretmen-odev.js`, `18b-etut.js`, `23-veli-ayarlar.js`, `09-yonetici.js`,
    `09b-site-ayarlari.js`).
  - `tarihSecici` — `10b-hesaplar.js` (müdürün hesap penceresi, `hfDogum`; en küçük yaş öğrencide 3, ötekilerde 17) ve
    `23-veli-ayarlar.js` (profil, `pDogum`; öğrencide 3, ötekilerde 16). `tarihSeciciDurum` `'eksik'` dönerse:
    `10b-hesaplar.js` gün kutusunun altına `alanHatasi('hfDogumGun', 'Gün, ay ve yılın üçünü de seç ya da hepsini boş
    bırak.')`; `25-tiklama.js` (profil kaydı) formun iletisine `mesajGoster('pMesaj', 'hata', 'Doğum tarihinde gün, ay ve
    yılın üçünü de seç.')`.
  - `formAlanlariKur` — `26-baslat.js` açılışta.
  - Göz düğmesi ve Caps Lock uyarısı kendiliğinden: `index.html`'deki giriş/kayıt kutuları, `05b-sifre-zorunlu.js`'in
    "Kendi şifreni belirle" penceresi, profilde şifre değiştirme, müdürün ve yöneticinin şifre kutuları.
- Sunucu: hataların hangi kutuya yazılacağını çoğu zaman sunucunun cevabındaki `alan` söyler (ör. kayıt:
  [../../../sunucu/bolumler/kayit.md](../../../sunucu/bolumler/kayit.md); veritabanı çakışmaları:
  [../../../sunucu/veri/baglanti.md](../../../sunucu/veri/baglanti.md) `hataCevir` → `{ alan }`).
- CSS: `public/css/parcalar/02-form.css` — `.field.hatali` kırmızı çerçeve, `.alan-hata`, `.kvkk-alan.hatali`,
  `.sifre-kap`, `.sifre-goz` (`aria-pressed="true"` iken marka rengi), `.caps-uyari`, `.tarih-secici` (üç sütunlu ızgara).
  `.hatali`'nin başka bağlamları `25-grafik-sinav.css`, `35-quiz.css`. `.tarih-secici.eksik`'in CSS kuralı yok, yalnız
  durum işaretidir.
- Rol: herkes; giriş/kayıt ekranında giriş yapmamış ziyaretçi de.

## Nasıl çalışır (adım adım)?

### Bir formun hatası

```
kaydet düğmesi
  formHatalariniSil(form)                         eski kırmızılar gider
  istemci denetimi / api(...) hata { alan: 'email' }
     alanHatasi('kEmail', 'Bu e-posta kayıtlı')    .field.hatali + <div class="alan-hata" role="alert">
  ilkHatayaGit(form)                               ilk hatalı kutu ortada, imleç içinde
kişi kutuya yazıyor ─► input olayı ─► closest('.hatali') ─► alanTemizle   (hata kendiliğinden kalkar)
```

### Göz düğmesi

```
sayfa innerHTML ile çizildi ─► MutationObserver ─► sifreKutulariniTara(document)
   <input type="password">  ─►  <div class="sifre-kap"><input data-goz="1"><button class="sifre-goz">göz</button></div>
tıklama ─► sifreGoster(input, true) ─► type="text", ikon gozKapali, aria-pressed="true"
```

### Gün/ay/yıl

```
tarihSecici('pDogum', '2012-02-29', { enKucukYas: 3 })
   [Gün ▾ 29] [Ay ▾ Şubat] [Yıl ▾ 2012]  <input type="hidden" id="pDogum" value="2012-02-29">
kişi yılı 2013 yapar ─► change ─► tarihSeciciGuncelle: Şubat 2013 = 28 gün ─► 29-31 kapanır, gün 28'e iner
   gizli değer '2013-02-28'
okuyan kod: $('pDogum').value  (ya da tarihSeciciDurum('pDogum') → 'eksik' ise uyar)
```

## Dikkat!

- **`aria-describedby` ezilir, sonra silinir.** `alanHatasi` kutunun var olan açıklama bağını hata kutusuyla değiştirir,
  `alanTemizle` bağı tamamen kaldırır. Kayıt formundaki şifre kutusunda (`kSifre`, `index.html`'de
  `aria-describedby="kSifreKural"`: şifre kuralları listesi) ilk hata düzeltildikten sonra kurallar listesi ekran
  okuyucuya bağlı kalmaz. Aynısı "Kendi şifreni belirle" penceresindeki `zYeni` kutusunda (`zKural`, `05b-sifre-zorunlu.js`).
  (Profildeki şifre değiştirme hatayı `mesajGoster` ile yazdığı için `sYeni`/`sKural` etkilenmez.) Kod değiştirilmedi;
  düzeltmek için eski değer saklanıp geri konmalı.
- **`ekHtml` kaçırılmaz** — yalnız kendi ürettiğin düğme/bağlantıyı ver; kullanıcı verisi koyacaksan önce `esc`.
- **Gözlemci her değişiklikte bütün belgeyi tarar.** `MutationObserver` eklenen düğüm var mı diye bakmadan
  `querySelectorAll('input[type="password"]:not([data-goz])')` çalıştırır; [04c-telefon.md](04c-telefon.md)'nin
  gözlemcisiyle birlikte her `innerHTML` çiziminden sonra iki tarama olur. Bugünkü sayfa boylarında fark edilmiyor.
  Göz düğmesini eklemek de bir değişikliktir ama işaretli kutu ikinci kez seçilmediği için döngü olmaz.
- **`.hatali` sınıfı yalnız bu dosyanın değil.** [04d-ekler.md](04d-ekler.md)'nin yüklenemeyen ek satırı da
  `li.ek-satir.hatali` olur (kırmızı çerçeve ve kırmızı hata yazısı). "Ödevi düzenle" penceresi kaydederken
  `formHatalariniSil($('modalGovde'))` çağırdığı için bu satırlardan da `hatali` sınıfı kalkar: satır kırmızılığını yitirir,
  yazısı ("… · Sığmıyor: …") kalır ama griye döner. Yalnız görünüşü etkiler; ekler zaten `ekIdleri`'ne girmez. Yeni bir
  formda `.hatali`'yi hata işareti dışında kullanacaksan başka bir sınıf adı seç.
- **Şifre kutusu `.sifre-kap` içine taşınır.** Kutunun doğrudan üst öğesi artık `.field` değildir; `.field > input` gibi
  bir CSS seçicisi ya da `input.parentNode` varsayan kod şifre kutusunda çalışmaz.
- **Gün/ay/yıl seçicide kayıtlı yıl listede yoksa** (ör. en küçük yaş sınırından genç biri ya da 1920'den eski) yıl listesi
  "Yıl"da kalır ama gizli değer dolu gelir; kişi herhangi bir seçimi değiştirirse değer boşalır ve "eksik" olur. Müdürün
  penceresi (17) ile profil (16) farklı en küçük yaş kullanıyor: 16 yaşındaki bir yetişkinin profilde girdiği yıl müdürün
  penceresinde listede görünmez.
- **Gün kapatma yalnız seçim değişince çalışır.** Seçici ilk çizildiğinde 29–31 bütün aylar için açıktır; ilk `change`'ten
  sonra düzelir. Sunucu da tarihi ayrıca denetler ("Böyle bir gün yok").
- Caps Lock yalnız klavye olayı geldiğinde bilinir; kutuya odaklanıp hiç tuşa basmayan kişi uyarı görmez.

## Testleri

- Bu dosyanın doğrudan (tarayıcılı) testi yok.
- Sunucu tarafı, hataların kutulara bağlandığı `alan` alanını dener: `testler/test-giris-kayit.js` (kayıtta her alanın
  hatası doğru `alan`'la dönüyor mu), `testler/test-cakisma.js` (veritabanı çakışmasında `alan`).
- `testler/yazim-denetimi.js` (iletiler), `testler/test-kucult.js` (paket derleniyor mu).
- Elle: kayıt ekranında e-postayı boş bırakıp kaydet → kutu kırmızı, altında neden, sayfa oraya kaymalı; yazmaya başla →
  hata kalkmalı. Şifre kutusundaki göze bas → şifre görünmeli, telefonda klavye kapanmamalı. Caps Lock'u aç, şifre yaz →
  uyarı çıkmalı. Profilde doğum tarihine Şubat seç, yılı artık olmayan bir yıl yap → 29 kapanmalı.

## Son durum

- `git log`: 12 commit. Son değişiklik `60a5a49 commit 298` (2026-09-26): `tarihSecici` (gün/ay/yıl seçicinin HTML'i,
  `enKucukYas`, `enEski`, `autocomplete`) eklendi. Ondan önce `003ae8e commit 172` (2026-09-08): `formAlanlariKur` —
  gözlemci, göz düğmesi tıklaması, `reset`, Caps Lock, düzeltmeye başlayınca hatanın kalkması ve tarih seçicinin `change`
  bağlantısı; `82c793e commit 171`: `tarihSeciciDurum`. Dosyanın geri kalanı aynı gün işlev işlev kuruldu: `commit 162`
  `alanHatasi`, 163 `alanTemizle`, 164 `formHatalariniSil`, 165 `ilkHatayaGit`, 166 `sifreGozuEkle`, 167 `sifreGoster`,
  168 `sifreKutulariniTara`, 169 `capsUyarisi`, 170 `tarihSeciciGuncelle`.
- Bilinen açıklar (kod değiştirilmedi): `aria-describedby`'ın ezilmesi, iki ekrandaki farklı en küçük yaş, `.hatali`
  sınıfının ek satırlarıyla paylaşılması.
- Planlı işlerden bu dosyaya dokunması beklenenler: "Kullanıcı arama … hesap penceresinde yöneticinin ve desteğin şifre,
  e-posta, ad değiştirmesi" ve "Güvenlik denetimi" (okulun verdiği her şifrede ilk girişte değiştirme) yeni şifre ve
  e-posta formları getirecek — hepsi bu hata ve göz düğmesi düzenini kullanır. "Tek kişi tek hesap" işi öğrencinin doğum
  tarihine göre (18 yaş) menü kararları verecek; doğum tarihi yine bu seçiciden girilir. İstek denetiminde soruya bağlanan
  "yetişkin kaydına doğum tarihi" kararı evet çıkarsa kayıt formuna da bu seçici girer.
