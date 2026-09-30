# public/js/parcalar/03-mesaj-modal.js

Ekrana kısa ileti basma (`mesajGoster`, `sayfaMesaji`), oturum anahtarıyla dosya indirme (`dosyaIndir`), tek açılır
pencere (`modalAc`, `modalKapat`) ve bir kez gösterilen şifrelerin kaybolmaması için ayrılma sorusu (`TEK_SEFER`).

## Bu dosya ne yapar?

Her ekranın iki ortak ihtiyacı var: işlemin sonucunu söylemek ("Kaydedildi", "Bu alan zorunlu") ve bir şeyi sayfadan
ayrılmadan pencerede sormak ya da göstermek. Bu dosya ikisinin de tek biçimini verir; böylece bütün uygulamada iletiler
aynı renkte, pencereler aynı düzende görünür.

Üçüncü iş dosya indirme: bazı dosyalar (Excel dışa aktarımı, yedek) oturum ister. Anahtarı adres satırına koymak olmaz
(tarayıcı geçmişine ve sunucu günlüğüne düşer); `dosyaIndir` dosyayı `Authorization` başlığıyla alır ve tarayıcıya
"indir" dedirtir.

Dördüncü iş, bir kez gösterilen bilgiyi korumak. Toplu giriş bilgisi listesi ya da Excel aktarımıyla açılan hesapların
şifreleri ekranda yalnız bir kez görünür; sunucu yalnız özetlerini saklar. Kişi listeyi indirmeden ya da yazdırmadan geri
tuşuna basar, menüden başka sayfaya geçer, çıkış yapar, başka portala geçer ya da sekmeyi kapatırsa şifreler kaybolurdu.
`TEK_SEFER` bu yolların hepsinde önce "Ayrılınsın mı?" diye sorar; kişi ayrılmayı seçerse şifreler bellekten de silinir.

## İçinde neler var?

### `mesajGoster(hedef, tur, metin)`

- `hedef` bir öğe kimliği (ör. `'authMesaj'`, `'bildirimAyarMesaj'`); öğe yoksa sessizce hiçbir şey yapmaz.
- Öğenin İÇİNİ `<div class="msg <tur>">metin</div>` ile değiştirir; `metin` `esc`'ten geçer (HTML yazılamaz).
- `tur`: `hata` (kırmızı), `iyi` (yeşil), `bilgi` (marka rengi), `uyari` (turuncu). Türü sabit yazılmış çağrılar bugün
  parçalarda `hata` 98, `iyi` 26, `bilgi` 9, `uyari` 4; yönetim parçalarında 8, 2, 1, 1. Birkaç çağrı türü değişkenden alır
  (ör. `26-baslat.js` e-posta onayının sonucu `onay.tur`).
- `iyi` ileti 6 saniye sonra kendiliğinden silinir; ötekiler kalır. Zamanlayıcı yalnız kendi yazdığı iletiyi siler: o
  arada aynı kutuya yeni bir ileti yazıldıysa (hata, yeni şifre) o kalır.

### `sayfaMesaji(tur, metin)`

- Açık sayfanın (`#sayfa`) EN ÜSTÜNE `<div class="msg <tur> sayfa-mesaj" role="status">` ekler; çizilmiş sayfa yerinde
  kalır. Önceki sayfa iletisi varsa önce onu kaldırır (aynı anda tek sayfa iletisi).
- `role="status"` ekran okuyucuya iletiyi okutur.
- `iyi` ise 6 saniye sonra kaldırılır (yalnız bu ileti; o arada yazılan yenisi kalır). Kodda çoğunlukla `iyi` için
  kullanılır (31 çağrı; `bilgi` 5, `hata` 1, `uyari` 1).
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

### `TEK_SEFER`, `tekSeferSor(tur)`, `tekSeferAyrilabilir(tur)`

- `TEK_SEFER` bir nesne: bir kez gösterilen bilgi ekrandayken onu gösteren parça buraya bir kayıt bırakır, bilgi güvene
  alınınca (ör. "Kapat" onaylandı) kaydı siler. Kayıt: `{ sor, sayfada, temizle }`.
  - `sor()` — soru metnini döner; boş metin "bilgi artık güvende, sormadan ayrılabilir" demektir (ör. liste indirildi ya da
    yazdırıldı).
  - `sayfada` — `true`: bilgi sayfa değişince kaybolur (pencerede duruyor), geri tuşu ve menü de sormalı. `false`: bilgi
    sayfa değişse de kalır (ör. aktarım sonucu `S.aktarim`'da durur); yalnız çıkış, portal değiştirme, yenileme ve sekmeyi
    kapatma sorar.
  - `temizle()` — kişi ayrılmayı seçince bilgiyi bellekten siler (ör. `girisListesi = null`).
- Bugün üç kayıt var: `girisListesi` (`10a-giris-bilgisi.js`, `sayfada: true`), `hesapSifre` (`10b-hesaplar.js`,
  `sayfada: true` — "Hesap açıldı" penceresindeki ya da "Şifreyi değiştir"den sonraki yeni şifre; `sor()` şifre öğesi
  `#tekSeferSifre` ekranda durdukça sorar, pencere kapanınca kendiliğinden susar) ve `aktarimSonucu` (`15-aktarim.js`,
  `sayfada: false`).
- `tekSeferSor(tur)` — `tur` `'sayfa'` ise yalnız `sayfada` kayıtlara, `'oturum'` ise hepsine bakar; ilk boş olmayan soruyu
  döner, yoksa `''`. Soru sormaz; `beforeunload` bunu kullanır (tarayıcı kendi "Siteden ayrılınsın mı?" kutusunu açar).
- `tekSeferAyrilabilir(tur)` — soru varsa `confirm` ile sorar. "İptal" → `false` (çağıran işi bırakır). Soru yoksa ya da
  "Tamam" → o türdeki kayıtların `temizle()`'si çağrılır, kayıtlar silinir, `true` döner.
- Kullananlar: `07-yonlendirme.js` (`git`, sayfa değişiyorsa `'sayfa'`), `25-tiklama.js` (`hashchange` — geri/ileri tuşu,
  `'sayfa'`; `beforeunload` — yenileme ve sekmeyi kapatma, `'oturum'`), `26-baslat.js` (`cikisYap`, sessiz değilse
  `'oturum'`; `oturumDurumunuSifirla` `TEK_SEFER = {}` yapar), `08c-kisilikler.js` (`kisilik-gec` ve içinde bulunduğu
  okuldan `kisilik-ayril`, `'oturum'`).

## Kimle konuşur?

- Çağırdıkları: `$`, `esc` ([01-yardimcilar.md](01-yardimcilar.md)), `S.token` ([00-durum.md](00-durum.md)), `fetch`,
  `URL.createObjectURL`. Sayfa iskeleti `public/index.html`: `#sayfa` (sayfa içeriği) ve `#modalKok` (pencere kökü, sayfanın
  sonunda).
- Pencereyi kapatan öteki yerler: `25-tiklama.js` (`data-act="modal-kapat"`; perdeye, yani pencerenin dışına tıklama —
  perde `data-zorunlu` taşımıyorsa; geri tuşuyla sayfa değişince — önce `TEK_SEFER` sorar), `26-baslat.js` (`cikisYap`),
  `08c-kisilikler.js` (`oturumuDegistir`). Zorunlu pencere: `26-baslat.js` `kvkkOnayIste`, `10a-giris-bilgisi.js`
  `girisSonucGoster` ve `10b-hesaplar.js` `hesapSifresiKorunsun` perdeye `data-zorunlu="1"` koyar, dışarı tıklamak onu
  kapatmaz.
- `TEK_SEFER`'e kayıt bırakanlar: [10a-giris-bilgisi.md](10a-giris-bilgisi.md) (`girisListesi`),
  [10b-hesaplar.md](10b-hesaplar.md) (`hesapSifre`), `15-aktarim.js` (`aktarimSonucu`). Soranlar: [07-yonlendirme.md](07-yonlendirme.md) (`git`), `25-tiklama.js`, `26-baslat.js`,
  [08c-kisilikler.md](08c-kisilikler.md).
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

### Bir kez gösterilen şifreler

```
girisSonucGoster() ─► TEK_SEFER.girisListesi = { sayfada: true, sor, temizle }
geri tuşu ─► hashchange ─► tekSeferAyrilabilir('sayfa')
   ├─ liste indirilmedi: confirm("… Ayrılınsın mı?")
   │     ├─ İptal ─► history.replaceState('#/<açık sayfa>') ; pencere ve liste yerinde
   │     └─ Tamam ─► temizle(): girisListesi = null, modalKapat ─► git(hedef)
   └─ indirildi / yazdırıldı: sormadan geçer
menü (git) ─► aynı soru ; Çıkış / Geç / okuldan ayrıl ─► tekSeferAyrilabilir('oturum')
yenileme, sekmeyi kapatma ─► beforeunload: tekSeferSor('oturum') doluysa tarayıcı kendi kutusunu açar
"Kapat" (10a) ─► kendi onayı ─► delete TEK_SEFER.girisListesi
```

## Dikkat!

- **`govde` ve `altHtml` kaçırılmaz.** `modalAc` onları HTML olarak yazar; içine kullanıcı verisi koyan çağıran onu
  `esc`'ten geçirmeli. Yalnız `baslik` burada kaçırılır. (Aynı kural `sayfaMesaji`/`mesajGoster` için tersidir: onlar
  metni her zaman kaçırır, içine HTML yazamazsın.)
- **Kalıcı olması gereken ileti `iyi` olmamalı.** `iyi` 6 saniyede kalkar; kişinin not alması gereken bir şey (ör.
  `10b-hesaplar.js`'te yeni şifre) `bilgi` türüyle yazılır. `commit 543`'e kadar zamanlayıcı o arada yazılan yeni iletiyi
  de siliyordu (ör. "Kaydedildi"den 3 saniye sonra yazılan hata 3 saniye sonra kayboluyordu); artık yalnız kendi
  yazdığını siler.
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
- **Bir kez gösterilen yeni bir bilgi eklersen `TEK_SEFER`'e kayıt bırak.** Yoksa geri tuşu ve çıkış onu uyarısız siler.
  Bilgi güvene alınınca (indirildi, "Kapat" onaylandı) kaydı `delete TEK_SEFER.<ad>` ile kaldır; kalırsa sonraki her sayfa
  geçişinde boşuna soru çıkar.
- **Sessiz çıkış sormaz.** `cikisYap(true)` (oturum süresi dolunca `01-yardimcilar.js` 401, hesap silinince
  `23-veli-ayarlar.js`) soru sormadan çıkar; o anda açık liste kaybolur. Oturum zaten geçersiz olduğu için başka yol yok.
- **Yenileme ve sekmeyi kapatma sorusu tarayıcınındır.** `beforeunload`'da kendi metnimiz gösterilemez; tarayıcı
  "Siteden ayrılınsın mı?" gibi genel bir kutu açar. Bazı telefon tarayıcıları bu kutuyu hiç göstermez.
- **Sorular `confirm` ile.** Tarayıcının kendi kutusu; uygulamanın pencere görünümünde değil. Bütün uygulamadaki öteki
  onaylar da böyle.

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
- `TEK_SEFER`'i deneyen otomatik test yok. Elle (3200, 2026-09-30'da denendi): müdürle Öğrenciler → "Giriş bilgisi dağıt"
  → liste açıkken geri tuşu / menüden Ana Sayfa → "Ayrılınsın mı?" sorusu; İptal → pencere ve adres yerinde; Tamam → sayfa
  değişir, sonraki geçişte soru çıkmaz; liste açıkken Çıkış → aynı soru, İptal → oturum sürer; "Kapat" onaylanınca sonraki
  geçişte soru çıkmaz.

## Son durum

- `git log`: 3 commit. Son değişiklik `commit 543` (2026-09-30): `TEK_SEFER`, `tekSeferSor`, `tekSeferAyrilabilir`
  eklendi (bir kez gösterilen giriş bilgileri geri tuşu, menü, çıkış, portal değiştirme, yenileme ve sekmeyi kapatmada
  uyarısız kayboluyordu). Ondan önce `a6665fb commit 105` (2026-08-29): `sayfaMesaji` eklendi (işlem iletisi çizilmiş
  sayfanın üstüne; eskiden `mesajGoster('sayfa')` bütün sayfanın yerine yazıyordu). İlk hâl `a780f62 commit 4`
  (2026-08-28): `mesajGoster`, `dosyaIndir`, `modalKapat`, `modalAc`.
- `commit 543` ayrıca zamanlayıcı yarışını giderdi: `mesajGoster` ve `sayfaMesaji`'nin 6 saniyelik silmesi yalnız
  kendi yazdığı iletiyi kaldırır.
- Bilinen açıklar (kod değiştirilmedi): pencerenin erişilebilirliği (odak, Esc, `role`).
- Planlı işlerden bu dosyaya dokunması beklenenler: "Sistem" (bakım modu şeridi, site duyurusu, "Yenilikler" penceresi —
  ileti ve pencere biçimini kullanacaklar); "Kullanıcı arama … Verilerimi indir" (şifre sorulup ZIP indirilecek;
  `dosyaIndir`'in doğal kullanıcısı); "Yıl geçişi" (önemli işlerde çift doğrulama penceresi); "Çok dil" (`Kapat`,
  `İndirilemedi` gibi metinler katalogdan gelecek).
