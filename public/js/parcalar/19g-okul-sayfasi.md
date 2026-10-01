# public/js/parcalar/19g-okul-sayfasi.js

Okulun giriş adresinde (`/school/<okul>`) giriş kartının üstünde duran tanıtım sayfası: herkese görünen çizimi ve müdürün
(ya da "Kodlayıcı"nın) renk, tanıtım yazısı, fotoğraf ve kısıtlı CSS ile onu düzenlediği, canlı önizlemeli ekran.

## Bu dosya ne yapar?

Her okulun kendi giriş adresi var (`egitimevi.org/school/doruk-koleji`). Bir öğrenci ya da veli oraya girdiğinde
yalnız kuru bir giriş kartı değil, okulun kapak fotoğrafını, logosunu, adını, kısa tanıtımını ve fotoğraf galerisini
görsün diye bu "okul sayfası" var. Bu dosya iki işi birden yapar:

1. **Herkese görünen çizim.** Giriş ekranı açılırken `05a-dis-sayfalar.js` okulun bilgisini (`GET /api/okul-adres`) alır;
   cevapta okulun sayfası varsa `okulSayfasiniCiz()` onu kartın üstüne çizer. Sayfası hiç düzenlenmemiş okulda sunucu
   `sayfa: null` döner ve eskisi gibi yalnız kart görünür.
2. **Düzenleme ekranı** (menüde "Okul Sayfası"). Solda ayarlar, sağda canlı önizleme: üç renk, okul adının boyu ve yeri,
   kapak yüksekliği, sayfa genişliği, galerideki sütun sayısı, en çok 1500 karakterlik tanıtım yazısı, kapak + logo + en
   çok 8 galeri fotoğrafı (açıklamalarıyla) ve isteğe bağlı kısıtlı CSS.

Burada serbest HTML ya da betik yoktur, bilerek: sayfanın yapısı sabittir, yazı düz metindir, görünüm yalnız ayarlarla
ve sunucunun temizlediği CSS ile değişir. Sayfa herkese açık olduğu için asıl kaygı, okulun (ya da hesabı ele geçirilmiş
birinin) giriş kartını örtüp sahte bir şifre formu gösterememesidir; bunu sunucudaki CSS süzgeci ve sayfanın CSS'teki
"kutu" kuralları sağlar, bu dosya da HTML'i her zaman kaçırarak (`esc`) yazar.

Düzenleyebilenler: müdür ve "Okulun giriş sayfasını düzenler" (`okul.sayfa`) yetkisi verilmiş öğretmen (hazır şablon:
"Kodlayıcı"). Görenler: okulun adresini açan herkes, giriş yapmadan.

## İçinde neler var?

### Sabitler

- `OKUL_SAYFA_PARCALARI` — CSS'te seçilebilen parçalar ve Türkçe açıklamaları: `os-kutu` (sayfanın tamamı), `os-kapak`,
  `os-ust` (logo ile adın satırı), `os-logo`, `os-baslik` (okulun adı), `os-yer` (ilçe ve il), `os-tanitim`, `os-galeri`,
  `os-foto`. Düzenleme ekranında liste olarak gösterilir. Sunucudaki izinli seçici listesinin (`SAYFA_PARCALARI`,
  [../../../sunucu/yardimci/css-temizle.md](../../../sunucu/yardimci/css-temizle.md)) elle tutulan eşi.
- `OS_RENK` — `/^#[0-9a-f]{6}$/`: renk yalnız küçük harfli `#rrggbb`.

### Herkese görünen çizim

- `okulSayfasiHtml(sayfa, okul)` — `sayfa: { tanitim, ayarlar, fotolar }`, `okul: { ad, il, ilce }` alır ve
  `<div class="os-kutu">` döner:
  - kutunun nitelikleri `data-baslik` (`kucuk|orta|buyuk`), `data-kapak` (`kisa|orta|uzun`), `data-hiza` (`sol|orta`);
    `style` içinde `--os-renk`, `--os-zemin`, `--os-yazi` (yalnız `OS_RENK`'e uyan renkler — sunucu da denetler, burada
    ikinci kez) ve `--os-sutun` (`2`, `3` ya da `4`; değilse `3`);
  - `img.os-kapak` (fotoğraflar arasında `yer === 'kapak'` olan; `alt` açıklaması), `.os-ust` içinde `img.os-logo`
    (`alt` "<okul adı> logosu"), `h1.os-baslik` (okulun adı) ve `.os-yer` ("Çankaya, Ankara");
  - `.os-tanitim`: tanıtım boş satırlarla (`\n\n` ve fazlası) paragraflara bölünür, her biri `<p>` ve `esc`'li (paragraf
    içindeki tek satır sonu CSS'teki `pre-wrap` ile görünür);
  - `.os-galeri`: her galeri fotoğrafı `img.os-foto` (`loading="lazy"`; açıklama varsa `alt` ve `title`).
  Fotoğraf adresi `/api/okul-foto/<id>`.
- `okulSayfaStiliYaz(css)` — `<head>`'e bir kez `<style id="okulSayfaStil">` ekler ve içine CSS'i **`textContent` ile**
  yazar (HTML olarak okunmaz; `</style>` ile dışarı kaçılamaz). Buraya gelen CSS her zaman sunucuda temizlenmiş hâldir.
- `okulSayfasiniCiz()` — giriş ekranı için: `S.okulAdresi.sayfa` varsa `#authWrap`'a `okul-sayfali` sınıfını koyar,
  `#okulSayfa`'yı `okul-sayfa genislik-dar|genis` sınıfıyla doldurur, gösterir ve okulun CSS'ini yazar; yoksa kutuyu
  gizler, boşaltır ve CSS'i siler.

### Düzenleme ekranı

- `OS` — `{ veri` (son `GET /api/okul-sayfa` cevabı; fotoğraf listesi yerinde güncellenir), `temizCss` (önizlemede
  kullanılan temizlenmiş CSS), `sayac: null` (kullanılmıyor) `}`; seçilen fotoğrafın yeri sonradan `OS.yuklenecekYer`'e
  yazılır.
- `SAYFALAR['okul-sayfasi']` — `GET /api/okul-sayfa` → ekranı çizer:
  - "OKUL SAYFASI" başlığı ("Adresi bilen herkes görebilir."), adres kartı: `location.host + okulYolu(kisaAd)` ve
    **Sayfayı aç** (yeni sekme).
  - **Görünüm**: "Ana renk", "Zemin", "Yazı rengi" (`input[type=color]#osRenk-<anahtar>`, yanında "Varsayılan" ya da
    seçilen renk yazısı ve **Varsayılan** düğmesi — `data-act="os-renk-sifirla"`); "Okul adının boyu" (`#osBaslik`),
    "Kapak fotoğrafının yüksekliği" (`#osKapak`), "Okul adının yeri" (`#osHiza`), "Sayfanın genişliği" (`#osGenislik`:
    Geniş / Dar (giriş kartı kadar)), "Galeride yan yana" (`#osSutun`: 2 / 3 / 4 fotoğraf).
  - **Tanıtım yazısı**: `#osTanitim` (`maxlength` 1500), altında "N / 1500." sayacı ve "Bağlantı ve biçim eklenemez".
  - **Fotoğraflar**: PNG/JPEG/WebP, büyük fotoğrafın küçültüleceği, küçülmüş hâlin en çok 3 MB olabileceği, konum ve cihaz
    bilgisinin silindiği ve "Öğrencilerin yüzü görünen fotoğraflar için velilerin iznini almayı unutma." notu; `#osFotolar`,
    gizli `input#osDosya` ve `#osFotoMesaj`.
  - **Kendi CSS'in** (açılır kutu; kayıtlı CSS varsa açık gelir): yasaklar (url, @import, position, z-index, transform,
    content), seçilebilir parçalar listesi, `#osCss` (`maxlength` 8000, yazım denetimi kapalı), **CSS'i önizlemede dene**
    (`os-css-onizle`) ve `#osUyarilar` ("Atılan kısımlar").
  - **Kaydet** (`os-kaydet`) ve `#osMesaj`; sağda "Önizleme" başlığı altında `section#osOnizleme.okul-sayfa`.
  Çizdikten sonra: seçicilerin `change`'i, renklerin `input`'u (renk "seçildi" işaretlenir, yanındaki yazı rengin değeri
  olur), tanıtımın `input`'u (sayaç + önizleme) ve dosya kutusunun `change`'i (`osDosyaSecildi`) bağlanır; kayıtlı bir
  rengi olan kutu baştan "seçildi" sayılır; sayaç, fotoğraf listesi, kayıtlı CSS'in uyarıları ve önizleme çizilir.
- `osVarsayilanRenk(anahtar)` — renk kutusu boş olamadığı için "varsayılan"da sitenin o anki rengini gösterir: `renk` →
  `--ana`, `zemin` → `--kart`, `yazi` → `--yazi` (üç haneli `#abc` altı haneye açılır; okunamazsa `#000000`).
- `osAyarlariOku()` — ekrandaki ayarları `{ renk, zemin, yazi, baslikBoyu, kapakBoyu, hiza, genislik, galeriSutun }` olarak
  toplar. Bir renk kutusu `data-secildi="1"` değilse o renk `''` (varsayılan) gider.
- `osOnizlemeCiz()` — önizleme kutusunu ekrandaki ayarlar, tanıtım kutusundaki yazı ve `OS.veri.fotolar` ile
  `okulSayfasiHtml`'den yeniden çizer ve `OS.temizCss`'i uygular.
- `osTanitimSayac()` — "317 / 1500." yazar.
- `EYLEMLER['os-renk-sifirla']` — renk kutusunun "seçildi" işaretini kaldırır, sitenin rengine döndürür, "Varsayılan"
  yazar, önizlemeyi tazeler.

### Fotoğraflar

- `osFotolariCiz()` — `#osFotolar`: "Kapak fotoğrafı" ve "Logo" satırları (küçük resim ya da okul simgeli boş kutu,
  "Yüklendi"/"Yok", **Yükle**/**Değiştir** — `os-foto-sec`, varsa **Sil** — `os-foto-sil`); "Galeri (N / 8)" başlığı ve her
  galeri fotoğrafı için küçük resim, açıklama kutusu (`input.os-aciklama`, en çok 120, "Açıklama (ör. Bilim fuarı 2026)") ve
  **Sil**; 8'den azsa **Galeriye fotoğraf ekle**. Açıklama kutusunun `change`'i (kutudan çıkınca) hemen
  `POST /api/okul-sayfa/foto-aciklama { id, aciklama }` gönderir, başarıda yerel listeyi ve önizlemeyi tazeler, hatayı
  `#osFotoMesaj`'a yazar.
- `EYLEMLER['os-foto-sec']` — yeri (`kapak`, `logo`, `galeri`) `OS.yuklenecekYer`'e yazar, dosya kutusunu boşaltıp açar.
- `osDosyaSecildi()` — dosya kutusunun `change`'i (`this` dosya kutusudur):
  1. Tarayıcının bildirdiği tür PNG/JPEG/WebP değilse "Yalnızca PNG, JPEG ya da WebP fotoğraf yüklenebilir.".
  2. Küçültülebilir bir resimse (`resimKucultulebilir`) "Küçültülüyor…" ve `resimKucult` beklenir; `kucultmeYazisi`
     "8,4 MB → 620 KB" notunu verir.
  3. Gidecek dosya 3 MB'ı geçiyorsa hata: küçültüldüyse "Fotoğraf küçültülünce de 3 MB'tan büyük (…). Daha küçük bir
     fotoğraf seç.", değilse "Fotoğraf 3 MB'tan büyük. Telefonda küçültüp ya da ekran görüntüsünü alıp yeniden dene.".
  4. "Yükleniyor... (…)" → `fetch('POST /api/okul-sayfa/foto?yer=<yer>')`, başlıklar `Authorization: Bearer …` ve
     `Content-Type` (küçülmüş dosyanın türü), gövde dosyanın kendisi. Cevap JSON okunamazsa `{}` sayılır; başarısızsa
     sunucunun `error`'u ya da "Yüklenemedi (kod)".
  5. Başarıda kapak/logo ise eskisi yerel listeden atılır, yeni `foto` eklenir; küçültüldüyse "Fotoğraf küçültülerek
     yüklendi (8,4 MB → 620 KB)." (yeşil, 6 sn), değilse ileti silinir; liste ve önizleme yeniden çizilir; `S.okulAdresi =
     null` (giriş sayfası okulun bilgisini yeniden alsın).
- `EYLEMLER['os-foto-sil']` — `confirm('Fotoğraf silinsin mi?')` → `POST /api/okul-sayfa/foto-sil { id }` → yerel listeden
  atar, yeniden çizer, `S.okulAdresi = null`; hata `hataGoster`.

### CSS ve kaydetme

- `osUyarilariCiz(uyarilar)` — sunucunun attığı her parça için nedeni: turuncu "Atılan kısımlar" listesi (yoksa boş).
- `EYLEMLER['os-css-onizle']` — "Deneniyor..." → `POST /api/okul-sayfa/onizle { css }` → `OS.temizCss`, uyarılar,
  önizleme; hiç uyarı yoksa "CSS'in tamamı kullanılabiliyor. Kalıcı olması için Kaydet'e bas.". **Kaydetmez.**
- `EYLEMLER['os-kaydet']` — "Kaydediliyor..." → `POST /api/okul-sayfa { ayarlar: osAyarlariOku(), tanitim, css }` →
  `OS.temizCss = temizCss`, uyarılar, önizleme, `S._sayfaDegisti = false`, `S.okulAdresi = null` ve sunucunun iletisi
  ("Okul sayfası kaydedildi." ya da "Kaydedildi. CSS'in bazı kısımları kullanılamadığı için atıldı; aşağıda nedenleri var.").

## Kimle konuşur?

- Parçalar ad sırasıyla tek bir IIFE'de birleşir (`/js/app.js`; [../../../sunucu/http.md](../../../sunucu/http.md)
  `birlesikOku`). Bu dosyanın çağırdıkları:
  - `S` ([00-durum.md](00-durum.md)): `S.token` orada tanımlı; `S.okulAdresi` alanını
    [05a-dis-sayfalar.md](05a-dis-sayfalar.md)'deki `okulAdresiniYenile` kurar, `S._sayfaDegisti`'yi `25-tiklama.js` yazı
    kutularına yazılınca açar ve [07-yonlendirme.md](07-yonlendirme.md)'deki `git`/`sayfayiYenile` sıfırlar;
    `$`, `esc`, `api`, `EYLEMLER` ([01-yardimcilar.md](01-yardimcilar.md)); `ik` ([02-ikonlar.md](02-ikonlar.md)); `mesajGoster`
    ([03-mesaj-modal.md](03-mesaj-modal.md)); `resimKucultulebilir`, `resimKucult`, `kucultmeYazisi`
    ([04f-resim-kucult.md](04f-resim-kucult.md)); `dugmeBekle`, `dugmeBitir` ([05-giris.md](05-giris.md)); `okulYolu`
    ([05a-dis-sayfalar.md](05a-dis-sayfalar.md)); `SAYFALAR` ([08-ana-sayfa.md](08-ana-sayfa.md)); `yaz`, `hero`
    ([07-yonlendirme.md](07-yonlendirme.md)); `hataGoster` (`25-tiklama.js`).
- Onu kullananlar: [05a-dis-sayfalar.md](05a-dis-sayfalar.md) — `okulBasligiCiz` her giriş ekranı çiziminde
  `okulSayfasiniCiz()`'i çağırır (okulun sayfası varsa kartın üstündeki okul adını gizler); `okulAdresiniYenile`
  `S.okulAdresi`'ni ve `.sayfa`'sını doldurur, `S.okulAdresi` boşsa (bu dosyanın kayıt/yükleme/silmeden sonra yaptığı gibi)
  yeniden ister. [06-menu.md](06-menu.md) "Okul Sayfası"nı (`okul-sayfasi`) müdüre her zaman, öğretmene `okul.sayfa`
  varsa koyar. `testler/test-resim-kucult.js` `osDosyaSecildi`'yi tarayıcıda doğrudan çağırır.
- Sunucu uçları ([../../../sunucu/bolumler/okul-sayfasi.md](../../../sunucu/bolumler/okul-sayfasi.md)); düzenleme uçları
  giriş yapmış, onaylı, okula bağlı müdür ya da `okul.sayfa`'lı öğretmen ister (değilse 403 "Okul sayfasını düzenleme
  yetkin yok.", girişsiz 401):
  - `GET /api/okul-sayfa` → `{ okul: { ad, il, ilce, kisaAd }, tanitim, ayarlar, css (ham), temizCss, uyarilar, fotolar:
    [{ id, yer, aciklama, boyut }], guncelleme }`.
  - `POST /api/okul-sayfa { ayarlar, tanitim, css }` — CSS 8000 karakteri geçerse 400 (`alan: 'css'`); tanıtım
    temizlenir (denetim karakterleri atılır, üçten çok satır sonu ikiye iner, baştan/sondan kırpılır, 1500'de kesilir);
    bozuk ayar varsayılana döner. Ham CSS saklanır, dışarı her zaman temizlenmiş hâli gider. Cevap `{ ayarlar, tanitim,
    css, temizCss, uyarilar, message }`. İşlem kaydı `okul-sayfa.duzenlendi`.
  - `POST /api/okul-sayfa/onizle { css }` → `{ css, uyarilar }` (yalnız temizler).
  - `POST /api/okul-sayfa/foto?yer=kapak|logo|galeri` — gövde fotoğrafın kendisi (JSON değil; `api.js` bu yolu JSON
    okuyucusundan önce ayırır). Yeri bilinmeyen 400; okul başına saatte 40 yükleme (429); 3 MB üstü 413; galeride 8 varsa
    400 "…Önce birini sil."; türü **baytlarından** tanınmayan (ör. PNG diye gönderilen HTML, SVG) 400; konum/cihaz bilgisi
    silinir; okulun disk alanı yetmezse 507 "Okulunun dosya alanı doldu…" (kapak ve logoda yalnız eskisiyle fark sayılır);
    kapak ve logo tektir, yenisi eskisini siler. Cevap `{ foto: { id, yer, aciklama: '' } }`. İstemcinin `Content-Type`'ı
    karara katılmaz.
  - `POST /api/okul-sayfa/foto-sil { id }`, `POST /api/okul-sayfa/foto-aciklama { id, aciklama }` (120 karakter) — başka
    okulun fotoğrafı 404.
  - `GET /api/okul-foto/<id>` — herkese açık, 7 gün önbellekli (`immutable`; kimlik 32 haneli ve değişmez), IP başına
    dakikada 4000.
  - Herkese görünen çizimin verisi `GET /api/okul-adres?kisa=<okul>`'dan gelir
    ([../../../sunucu/bolumler/kayit.md](../../../sunucu/bolumler/kayit.md); `okulSayfasiGorunumu`: `{ tanitim, ayarlar,
    css (temizlenmiş), fotolar: [{ id, yer, aciklama }] }` ya da `null`).
- Veri: [../../../sunucu/veri/depo/okul-sayfalari.md](../../../sunucu/veri/depo/okul-sayfalari.md) (şema 018);
  fotoğraf dosyaları sunucuda `data/okul-fotolari/`; fotoğraf denetimi
  [../../../sunucu/yardimci/resim.md](../../../sunucu/yardimci/resim.md); disk sınırı
  [../../../sunucu/bolumler/okul-disk.md](../../../sunucu/bolumler/okul-disk.md).
- CSS: `public/css/parcalar/31-okul-sayfasi.css` — `.okul-sayfa` kutusu (en çok 860 px geniş, 1600 px yüksek, `overflow:
  hidden`, `contain: layout paint`, `isolation: isolate`: içindeki hiçbir şey dışarı, giriş kartının üstüne çizilemez),
  `.genislik-dar` (460 px), `.os-*` parçaları ve CSS değişkenlerinin varsayılanları, `.auth-wrap.okul-sayfali`, düzenleme
  ekranı (`.os-duzen` iki sütun, 1100 px altında tek; `.os-onizleme-kap` yapışkan; `.os-renk-satir`, `.os-foto-satir`,
  `.os-kucuk`, `.os-css`, `.os-parcalar`, `.os-css-kutu`, `.os-uyarilar`, `.os-kaydet`). `.os-ayarlar` ve `.os-adres-kart`
  yalnız işaret sınıfı (kuralı yok). `.alt-baslik` `21-takvim.css`/`27-harita-ortak.css`'te, `.msg.uyari` `02-form.css`'te.
- Rol: düzenleme — müdür ve `okul.sayfa`'lı öğretmen; görüntüleme — okulun adresine giren herkes (girişsiz).

## Nasıl çalışır (adım adım)?

### Ziyaretçi

```
/school/doruk-koleji ─► 05a okulAdresiniYenile ─► GET /api/okul-adres?kisa=doruk-koleji
   S.okulAdresi = { ad, il, ilce, kisaAd, sayfa }
girisEkraniGoster ─► okulBasligiCiz ─► okulSayfasiniCiz
   sayfa var ─► #okulSayfa = okulSayfasiHtml(sayfa, okul) ─► <style id="okulSayfaStil">.okul-sayfa .os-baslik { … }</style>
   sayfa yok ─► kutu gizli, yalnız giriş kartı
```

### Düzenleyen

```
menü "Okul Sayfası" ─► GET /api/okul-sayfa ─► ekran + önizleme (kayıtlı ayarlar, temizCss)
   renk / seçici / tanıtım değişti ─► osOnizlemeCiz (yalnız tarayıcıda, kaydedilmedi)
   "CSS'i önizlemede dene" ─► POST /onizle ─► temizCss + "Atılan kısımlar" ─► önizleme (kaydedilmedi)
   "Kaydet" ─► POST /api/okul-sayfa ─► yayında (görünüm, tanıtım, CSS)
   fotoğraf seç ─► (küçült) ─► POST /foto?yer=… ─► HEMEN yayında
   açıklama kutusundan çık ─► POST /foto-aciklama ─► HEMEN yayında
   "Sil" ─► POST /foto-sil ─► HEMEN yayından kalkar
```

## Dikkat!

- **Fotoğraflar "Kaydet"i beklemez.** Yükleme, silme ve açıklama değişikliği anında herkese görünür; renkler, seçiciler,
  tanıtım yazısı ve CSS ise yalnız **Kaydet**'le yayına girer. Önizlemede görünen her şey kaydedilmiş değildir.
- **CSS önizlemesi kutudaki yazıyı kendiliğinden izlemez.** `#osCss`'e yazarken önizleme değişmez; "CSS'i önizlemede
  dene" ya da Kaydet gerekir. "Dene"den sonra önizleme kaydedilmemiş CSS'i gösterir, ziyaretçiler eskisini görür.
- **Varsayılan renkler ziyaretçinin temasına uyar, seçilen renk uymaz (kod okumasına göre).** Seçilmemiş renk `''` gider ve
  sayfa sitenin `--ana`, `--kart`, `--yazi` değişkenlerini kullanır; bunlar koyu temada değişir. Yalnız zemini (ör.
  beyaz) seçip yazı rengini varsayılanda bırakan okulun sayfası, koyu temalı ziyaretçide açık renk yazı + beyaz zemin olur
  (okunmaz). Ekrandaki "Koyu zeminde açık renk seç." ipucu bunun bir yüzünü anlatıyor; zemini seçen yazı rengini de seçmeli.
  Önizleme de düzenleyenin kendi temasıyla çizilir.
- **Kaydedilen tanıtım ekrana geri yazılmaz.** Sunucu tanıtımı temizler (üçten çok satır sonu ikiye iner, baş/son boşluk
  kırpılır); kayıttan sonra kutu ve önizleme senin yazdığın hâli göstermeyi sürdürür, sayfaya yeniden girince temizlenmiş
  hâl gelir.
- **Güvenlik zinciri:** tanıtım ve açıklamalar düz metin (`esc`); renk ve seçenekler sunucuda izin listesine göre süzülür
  (renk kutusunun `value`'su kaçırılmadan yazılır, ama sunucudan yalnız `#rrggbb` gelebildiği için güvenli); CSS sunucuda
  beyaz listeyle temizlenir, her kural `.okul-sayfa ` ile başlar, `textContent` ile yazılır; kutu CSS'te `contain` ve
  `overflow: hidden` ile sınırlıdır. Bunlardan birini gevşetirsen öbürlerini de yeniden düşün.
- **`<style id="okulSayfaStil">` sayfadan çıkınca kalır.** Düzenleme ekranından başka sayfaya geçince son denenen CSS
  `<head>`'de durur; yalnız `.okul-sayfa` içini seçebildiği için başka ekranı etkilemez, giriş ekranı çizilirken okulun
  kayıtlı CSS'iyle değiştirilir.
- **Fotoğraf yüklemesi `api()` değil, doğrudan `fetch`.** Gövde dosyanın kendisi olduğu için; bu yüzden 401'de kendiliğinden
  çıkış ve "önce şifreni belirle" penceresi bu yolda çalışmaz, sunucunun iletisi `#osFotoMesaj`'da görünür.
- **Tür denetimi iki yerde:** tarayıcı yalnız bildirilen MIME türüne bakar (uzantısı değiştirilmiş dosya geçebilir); asıl
  karar sunucuda, dosyanın baytlarıyla verilir. HEIC bu ekranda türü yüzünden baştan reddedilir. 3 MB sınırı küçülmüş
  dosyaya uygulanır; `04f-resim-kucult.js`'in dokunmadığı büyük bir dosya (ör. hareketli PNG) 3 MB'ı geçerse reddedilir.
- **Açıklama kutusu kutudan çıkınca kaydedilir** ve başarıda hiçbir ileti göstermez; kırpılmış (`trim`) hâli yerelde tutulur.
- **`OKUL_SAYFA_PARCALARI` sunucudaki listeyle elle eş tutulur.** Sunucuda yeni bir parça izinli olursa buraya da yaz
  (yoksa ekrandaki listede görünmez); `okulSayfasiHtml`'e yeni bir parça eklersen sunucunun izin listesine de ekle.
- **Ekran okulun kısa adının dolu olduğunu varsayar.** `okulYolu('')` "/school/" verir; kısa adı boş bir okulda adres
  kartı "…/school/" gösterir ve "Sayfayı aç" bir okula gitmezdi. Pratikte olmaz: yönetici okul açarken kısa ad zorunludur
  ve sunucu her açılışta kısa adı olmayan eski okullara bir ad verir (`sunucu/veri/index.js`, `okulKisaAdiBul`).
- **Kapak ve logonun açıklama kutusu yok:** kapağın `alt`'ı boş (süs resmi), logonunki "<okul> logosu".
- Kendi yazdığın tanıtım/CSS kutusuna yazınca `25-tiklama.js` sayfayı "kaydedilmemiş" sayar (yenile düğmesi sorar);
  **Kaydet** bu işareti kaldırır. Galeri açıklama kutusu da `input[type=text]` olduğu için aynı işareti koyar, oysa açıklama
  kutudan çıkınca zaten kaydedilmiştir; yalnız açıklama düzelttiysen yenile düğmesi yine de sorar.

## Testleri

- `testler/test-okul-sayfasi.js` (sunucunun uçlarını sınar; bu dosyanın ekranını tarayıcıda açmaz) — kim düzenler (müdür
  evet, yetkisiz öğretmen 403, girişsiz 401, Kodlayıcı şablonu ve
  rolü verilen öğretmen evet); kaydetme ve CSS temizliği (renk küçük harfe, bozuk zemin varsayılana, izinli kurallar
  `.okul-sayfa` içine bağlı, url/@import/position/z-index/transform/content yok, başka seçici ve `body` yok, ters bölü
  atılıyor, uyarılar söyleniyor, 8000 üstü 400, önizleme kaydetmeden temizliyor); herkese açık görünüm (yalnız temizlenmiş
  CSS dışarı gider, tanıtım düz metin saklanır); fotoğraflar (sahte PNG ve SVG reddi, 3 MB üstü 413, bilinmeyen yer,
  girişsiz/yetkisiz yükleme yok, PNG/JPEG konum bilgisinin silinmesi, JPEG yönünün korunması, kapağın tek olması, galeride
  8 sınırı, açıklama); başka okul dokunamaz; işlem kaydı.
- `testler/test-resim-kucult.js` (başsız Edge/Chrome, sunucusuz) — bu dosyayı gerçek tarayıcıda yükler ve
  `osDosyaSecildi`'yi 3 MB'tan büyük bir fotoğraf PNG'siyle çağırır: önce "Küçültülüyor…", sonra `image/jpeg` türünde 3 MB
  altı dosya `/api/okul-sayfa/foto?yer=galeri`'ye gidiyor, sonda "Fotoğraf küçültülerek yüklendi (3,3 MB → … KB).".
- `testler/test-okul-disk.js` — okul sayfası fotoğrafının okulun disk alanına sayılması, dolunca reddedilmesi;
  `testler/test-okul-agi.js` — yüzlerce öğrencinin aynı IP'den okul fotoğraflarını indirmesi.
- `testler/buton-denetimi.js` — `os-renk-sifirla`, `os-foto-sec`, `os-foto-sil`, `os-css-onizle`, `os-kaydet` eylemlerinin
  karşılığı; `testler/yazim-denetimi.js` ekran metinlerini denetler.
- Elle (sunucu 3200'de): müdürle **Okul Sayfası** → zemin ve yazı rengini seç, tanıtım yaz, kapak yükle → önizlemeye bak →
  **Kaydet** → **Sayfayı aç**: giriş kartının üstünde sayfa. CSS kutusuna `.os-baslik { position: fixed; color: #c0392b }`
  yaz → "dene": `position` "Atılan kısımlar"da, renk önizlemede.

## Son durum

- `git log`: 4 commit. Son değişiklik `40fc7e7 commit 525` (2026-09-27, okul disk sınırı + telefonda küçültme): fotoğraf
  yüklenmeden önce tarayıcıda küçültülüyor (`resimKucultulebilir`/`resimKucult`, "Küçültülüyor…", "Yükleniyor... (8,4 MB →
  620 KB)", başarıda "Fotoğraf küçültülerek yüklendi (…)"); 3 MB sınırı artık küçülmüş dosyaya uygulanıyor (iki ayrı hata
  metni); yer, küçültme beklenirken değişmesin diye baştan `yer`'e alınıyor; fotoğraf kartının metni güncellendi.
- Ondan önce `fe018dd commit 513` (2026-09-26): okulun adresi `/<okul>`'dan `/school/<okul>`'a geçti — adres kartı ve
  "Sayfayı aç" artık `okulYolu` kullanıyor, baş yorum güncellendi. `f18c0bb commit 391` (2026-09-26) dosyanın ikinci yarısını
  ekledi (`osVarsayilanRenk`'ten `os-kaydet`'e: renk, önizleme, fotoğraflar, CSS deneme, kaydetme) ve aynı commit
  `31-okul-sayfasi.css`'i getirdi; ilk yarısı (`OKUL_SAYFA_PARCALARI`, `okulSayfasiHtml`, `okulSayfaStiliYaz`,
  `okulSayfasiniCiz`, düzenleme ekranının çizimi) `f5ee5e0 commit 390` (2026-09-26) ile, `sunucu/bolumler/okul-sayfasi.js`'in
  ilk 85 satırıyla birlikte geldi.
- Bilinen açıklar (kod değiştirilmedi): varsayılan/seçilen renklerin koyu temada okunmaz kalabilmesi, kaydedilen tanıtımın
  ekrana geri yazılmaması, fotoğraf yüklemesinin 401'de çıkış yapmaması (yalnız ileti), anında kaydedilen galeri
  açıklamasının sayfayı yine de "kaydedilmemiş" saydırması.
- Planlı işlerden bu dosyaya dokunması beklenenler (DEVAM.md 4. bölüm):
  - "Düzenleyiciler" (onaylı): madde 6 **okul sayfası blok düzenleyici** — kullanıcının "CSS editör" dediği iş: blok
    ekle/sırala (başlık, yazı, fotoğraf, galeri, iletişim, harita), renk/yazı tipi/boşluk ayarlarının kod yazmadan
    seçilmesi, canlı önizleme; ileri kullanıcı için CSS kutusu kalır, hepsi `css-temizle.js` izin listesinden geçer. Bugünkü
    sabit yapı (`okulSayfasiHtml`) ve `OKUL_SAYFA_PARCALARI` bununla değişecek. Madde 1 ortak yazı düzenleyici: okul
    sayfası tanıtım yazısı da (bugün düz metin) izin listeli zengin metne geçecek.
  - "Paneller … okul gezgini": okul simgesi (müdür yükler, 128×128); okul sayfasında logo yoksa okul simgesi kullanılacak.
    "Özel roller": `okul.simge` yetkisi ve "Kodlayıcı / Tasarımcı" şablonu.
  - "Arama motorunda görünme": `/school/*` sayfaları varsayılan olarak indekslenmeyecek (okul isterse site ayarıyla açılır).
  - "Çok dil" (ekran metinleri `c()` kataloğuna); "Sunucuda küçültme ve aynı dosya tek kopya": tanım, büyük gelen
    resimlerin (1,5 MB ya da 2048 px üstü) yüklemeden sonra arka planda sunucuda küçültülmesini ve aynı içerikli dosyaların
    diskte tek kopya tutulmasını anlatıyor; bu iki bölüm okul sayfası fotoğraflarını ayrıca anmıyor (tanımın telefonda
    küçültme bölümü anıyor, o kısım commit 525'te yapıldı) ve bu ekrandaki 3 MB sınırı için bir değişiklik yazmıyor.
