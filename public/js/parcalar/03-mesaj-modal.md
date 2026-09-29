# public/js/parcalar/03-mesaj-modal.js

Ekrana kısa ileti basma (`mesajGoster`, `sayfaMesaji`), oturum anahtarıyla dosya indirme (`dosyaIndir`) ve tek açılır
pencere (`modalAc`, `modalKapat`).

## Bu dosya ne yapar?

Her ekranın iki ortak ihtiyacı var: işlemin sonucunu söylemek ("Kaydedildi", "Bu alan zorunlu") ve bir şeyi sayfadan
ayrılmadan pencerede sormak ya da göstermek. Bu dosya ikisinin de tek biçimini verir; böylece bütün uygulamada iletiler
aynı renkte, pencereler aynı düzende görünür.

Üçüncü iş dosya indirme: bazı dosyalar (Excel dışa aktarımı, yedek) oturum ister. Anahtarı adres satırına koymak olmaz
(tarayıcı geçmişine ve sunucu günlüğüne düşer); `dosyaIndir` dosyayı `Authorization` başlığıyla alır ve tarayıcıya
"indir" dedirtir.

## İçinde neler var?

### `mesajGoster(hedef, tur, metin)`

- `hedef` bir öğe kimliği (ör. `'authMesaj'`, `'bildirimAyarMesaj'`); öğe yoksa sessizce hiçbir şey yapmaz.
- Öğenin İÇİNİ `<div class="msg <tur>">metin</div>` ile değiştirir; `metin` `esc`'ten geçer (HTML yazılamaz).
- `tur`: `hata` (kırmızı), `iyi` (yeşil), `bilgi` (marka rengi), `uyari` (turuncu). Türü sabit yazılmış çağrılar bugün
  parçalarda `hata` 98, `iyi` 26, `bilgi` 9, `uyari` 4; yönetim parçalarında 8, 2, 1, 1. Birkaç çağrı türü değişkenden alır
  (ör. `26-baslat.js` e-posta onayının sonucu `onay.tur`).
- `iyi` ileti 6 saniye sonra kendiliğinden silinir; ötekiler kalır.

### `sayfaMesaji(tur, metin)`

- Açık sayfanın (`#sayfa`) EN ÜSTÜNE `<div class="msg <tur> sayfa-mesaj" role="status">` ekler; çizilmiş sayfa yerinde
  kalır. Önceki sayfa iletisi varsa önce onu kaldırır (aynı anda tek sayfa iletisi).
- `role="status"` ekran okuyucuya iletiyi okutur.
- `iyi` ise 6 saniye sonra kaldırılır. Kodda çoğunlukla `iyi` için kullanılır (31 çağrı; `bilgi` 5, `hata` 1, `uyari` 1).
- Neden var: eskiden `mesajGoster('sayfa', …)` yazılıyordu ve bütün sayfanın yerine ileti geçiyordu.

### `dosyaIndir(yol, ad)`

- `fetch(yol, { Authorization: Bearer <S.token> })`. `yol` tam adres (`/api/...` dahil).
- Cevap başarılıysa gövde `Blob` olarak alınır, geçici bir `blob:` adresi üretilir, görünmez bir `<a download="ad">`
  tıklatılır, adres 4 saniye sonra bırakılır.
- Başarısızsa: gövde JSON'sa `error` alanı, değilse `İndirilemedi (<kod>)` iletisiyle `Error` fırlatır.
- Promise döner; çağıran `catch` ile iletiyi gösterir.
- Bugünkü kullanım: `15-aktarim.js` — ders programı Excel şablonu (`/api/school/aktarim-sablon?tur=program`) ve öğrenci /
  öğretmen / program listesinin dışa aktarımı (`/api/school/aktarim-disa?tur=…`;
  [../../../sunucu/bolumler/okul.md](../../../sunucu/bolumler/okul.md)); `09-yonetici.js` — yedek dosyası
  (`/api/admin/backup-download?ad=…`; [../../../sunucu/bolumler/yonetici.md](../../../sunucu/bolumler/yonetici.md)).

### `modalAc(baslik, govde, altHtml)` ve `modalKapat()`

- `modalAc` `#modalKok`'un içine yazar:

  ```
  <div class="perde" data-perde="1">
    <div class="modal">
      <h3>baslik</h3>                     ← esc'li
      <div id="modalGovde">govde</div>    ← HTML olarak, KAÇIRILMADAN
      <div class="modal-alt">altHtml</div> ← yoksa tek "Kapat" düğmesi (data-act="modal-kapat")
    </div>
  </div>
  ```

- `modalKapat` `#modalKok`'u boşaltır.
- Aynı anda tek pencere vardır: yeni `modalAc` eskisinin yerine geçer.

## Kimle konuşur?

- Çağırdıkları: `$`, `esc` ([01-yardimcilar.md](01-yardimcilar.md)), `S.token` ([00-durum.md](00-durum.md)), `fetch`,
  `URL.createObjectURL`. Sayfa iskeleti `public/index.html`: `#sayfa` (sayfa içeriği) ve `#modalKok` (pencere kökü, sayfanın
  sonunda).
- Pencereyi kapatan öteki yerler: `25-tiklama.js` (`data-act="modal-kapat"`; perdeye, yani pencerenin dışına tıklama —
  perde `data-zorunlu` taşımıyorsa; geri tuşuyla sayfa değişince), `26-baslat.js` (`cikisYap`), `08c-kisilikler.js`
  (`oturumuDegistir`). Zorunlu pencere: `26-baslat.js` `kvkkOnayIste` perdeye `data-zorunlu="1"` koyar, dışarı tıklamak
  onu kapatmaz.
- Onu kullananlar:
  - `mesajGoster` — 27 parça ve 4 yönetim parçası (en çok `05-giris.js`, `10b-hesaplar.js`, `12-ogretmen-sinav.js`,
    `19g-okul-sayfasi.js`, `25-tiklama.js`); bu gruptan [04b-bildirim-izni.md](04b-bildirim-izni.md).
  - `sayfaMesaji` — 17 parça ve 2 yönetim parçası (en çok `19i-servis-yoklama.js`).
  - `modalAc` — 26 parça ve 3 yönetim parçası; bu gruptan [04-pwa.md](04-pwa.md) ("Uygulamayı yükle" yardımı).
  - `modalKapat` — 18 parça ve 3 yönetim parçası.
  - `dosyaIndir` — `15-aktarim.js`, `09-yonetici.js`.
- CSS: `.msg` ve renkleri `public/css/parcalar/02-form.css`; `.perde`, `.modal`, `.modal-alt` `06-modal.css`, açılış
  hareketi `23-hareket.css`, dokunmatik ekran boyları `30-dokunmatik.css`. `.sayfa-mesaj`'ın ayrı bir kuralı yok, `.msg`
  görünümünü alır.
- Rol: herkes.

## Nasıl çalışır (adım adım)?

### Bir işlem ve iletisi

```
düğme ─► api(...) ─┬─ then ─► sayfaMesaji('iyi', 'Kaydedildi.')        ─► 6 sn sonra kalkar
                   └─ catch ─► mesajGoster('formMesaj', 'hata', e.message) ─► düzeltilene kadar kalır
```

### Pencere

```
modalAc('Ödevi düzenle', '<div class="field">…</div>', '<button data-act="odev-duzelt-kaydet">Kaydet</button>')
   #modalKok ← perde + pencere
tıklama:
   Kaydet ─► EYLEMLER['odev-duzelt-kaydet'] … ─► modalKapat()
   pencerenin dışı (perde) ─► 25-tiklama.js: data-zorunlu yoksa modalKapat()
   "Kapat" (varsayılan alt) ─► data-act="modal-kapat" ─► modalKapat()
```

### İndirme

```
dosyaIndir('/api/school/aktarim-disa?tur=ogrenci', 'ogrenciler.xlsx')
   fetch + Authorization ─► blob ─► blob: adresi ─► <a download> tıkla ─► 4 sn sonra adresi bırak
```

## Dikkat!

- **`govde` ve `altHtml` kaçırılmaz.** `modalAc` onları HTML olarak yazar; içine kullanıcı verisi koyan çağıran onu
  `esc`'ten geçirmeli. Yalnız `baslik` burada kaçırılır. (Aynı kural `sayfaMesaji`/`mesajGoster` için tersidir: onlar
  metni her zaman kaçırır, içine HTML yazamazsın.)
- **Zamanlayıcı yarışı.** `iyi` iletisinin 6 saniyelik silme zamanlayıcısı, o arada aynı yere yazılmış YENİ iletiyi de
  siler: `mesajGoster` öğenin içini, `sayfaMesaji` o an duran `.sayfa-mesaj`'ı boşaltır. Ör. "Kaydedildi" görünürken 3.
  saniyede bir hata iletisi yazılırsa, hata 3 saniye sonra kaybolur. Kod değiştirilmedi; düzeltmek için zamanlayıcı
  yalnız kendi yazdığı öğeyi silmeli.
- **Pencere erişilebilirliği sınırlı.** Pencere `role="dialog"`/`aria-modal` taşımıyor, açılınca odak pencereye taşınmıyor,
  Esc tuşu kapatmıyor (pencerenin içinde Esc'i dinleyen tek şey [04e-tarih-secici.md](04e-tarih-secici.md)'nin takvim
  kutusu; başka yerlerde Esc'i yalnız yapımcılar listesi ve rolsüz ekrandaki okul arama sonuçları dinler). Klavyeyle
  gezen biri arkadaki sayfaya da sekmeyle ulaşabilir.
- **Tek pencere.** İkinci bir `modalAc` birincinin içeriğini siler (ör. quiz penceresinden "Ödevi düzenle"ye geçiş). Bir
  pencereden başka bir pencere açıp geri dönmen gerekiyorsa ilkini kendin yeniden çizmelisin.
- **`dosyaIndir` bütün dosyayı belleğe alır** (Blob). Excel ve yedek için sorun değil; çok büyük dosyalar için biletli
  indirme kullanılır (ör. ekler: [04d-ekler.md](04d-ekler.md) `ek-indir`, tek kullanımlık bilet adresine `location.href`).
- `mesajGoster`'e verilen kimlik yoksa hiçbir şey olmaz, hata da çıkmaz; yeni bir form yazarken ileti kutusunu (`<div
  id="…Mesaj">`) koymayı unutma.

## Testleri

- `testler/buton-denetimi.js` — varsayılan "Kapat" düğmesinin `modal-kapat` eylemi `25-tiklama.js`'te karşılanıyor mu
  (bütün `data-act`'lar gibi).
- `testler/test-resim-kucult.js` — dosya başsız tarayıcıya öteki parçalarla yüklenir. Okul sayfası fotoğrafı bölümü
  (`19g-okul-sayfasi.js`) iletisini `mesajGoster('osFotoMesaj', …)` ile yazar ve test o kutunun metnini okur ("Küçültülüyor…",
  sonra sonuç). Testin denediği ek alanı ([04d-ekler.md](04d-ekler.md)) ve teslim kuyruğu bu dosyanın işlevlerini çağırmaz.
- `testler/test-kucult.js`, `testler/yazim-denetimi.js` — paket derlenir, iletiler Türkçe yazım denetiminden geçer.
- Sunucu tarafı: indirme uçları `testler/test-aktarim.js` (dışa aktarım, şablon) ve `testler/test-yedek.js` (yedek).
- Elle: profilde bir alanı kaydet → yeşil ileti 6 saniyede kalkmalı; bir pencere aç, dışına tıkla → kapanmalı; aydınlatma
  metni onayı penceresinde dışarı tıklamak kapatmamalı; müdürle Aktarım'dan öğrenci listesini indir → `ogrenciler.xlsx`
  inmeli, adres satırında anahtar görünmemeli.

## Son durum

- `git log`: 2 commit. Son değişiklik `a6665fb commit 105` (2026-08-29): `sayfaMesaji` eklendi (işlem iletisi çizilmiş
  sayfanın üstüne; eskiden `mesajGoster('sayfa')` bütün sayfanın yerine yazıyordu). İlk hâl `a780f62 commit 4`
  (2026-08-28): `mesajGoster`, `dosyaIndir`, `modalKapat`, `modalAc`.
- Bilinen açıklar (kod değiştirilmedi): zamanlayıcı yarışı, pencerenin erişilebilirliği (odak, Esc, `role`).
- Planlı işlerden bu dosyaya dokunması beklenenler: "Sistem" (bakım modu şeridi, site duyurusu, "Yenilikler" penceresi —
  ileti ve pencere biçimini kullanacaklar); "Kullanıcı arama … Verilerimi indir" (şifre sorulup ZIP indirilecek;
  `dosyaIndir`'in doğal kullanıcısı); "Yıl geçişi" (önemli işlerde çift doğrulama penceresi); "Çok dil" (`Kapat`,
  `İndirilemedi` gibi metinler katalogdan gelecek).
