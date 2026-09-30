# public/js/parcalar/07-yonlendirme.js

Tek sayfalık uygulamanın yönlendiricisi: adresteki `#/sayfa` ile sayfa açma (`git`), açık sayfayı yerinde yenileme
(`sayfayiYenile`), her sayfanın ortak çerçevesi (`yaz`: yıl şeridi + içerik + alt bilgi) ve her ekranın kullandığı küçük
yapı taşları (`hero`, `bosKutu`, `kutucuklar`).

## Bu dosya ne yapar?

Eğitim Evi tek bir HTML sayfasıdır (`public/index.html`); "Ödevler"e, "Takvim"e geçerken sayfa yeniden yüklenmez, yalnız
ortadaki `#sayfa` kutusunun içi değişir. Hangi ekranın açık olduğu adresin `#` kısmında yazar: `…/school/ornek-okul#/ogr-odevler`.
Böylece tarayıcının geri tuşu çalışır, sayfa yenilenince aynı ekran açılır, bildirime basınca doğru sayfaya gidilir.

Bu dosya o düzenin kalbidir:

1. `git('takvim')` — adresi `#/takvim` yapar, menüyü yeniden çizer, "Yükleniyor..." koyar, sonra `SAYFALAR.takvim()`
   işlevini çağırır. Sayfa yoksa "Bu sayfa bulunamadı.", okul o bölümü kapattıysa "Bu bölüm okulunda kapalı…" yazar.
2. `sayfayiYenile()` — üst çubuktaki yenile düğmesi: açık sayfayı sunucudan yeniden çizer ama filtreleri, arama kutusunu
   ve kaydırma yerini korur; yazılmış ama kaydedilmemiş bir şey varsa önce sorar.
3. `yaz(html)` — her ekranın son adımı: içeriği `#sayfa`'ya koyar, üstüne eğitim yılı şeridini (okulda birden çok
   eğitim yılı varsa yıl seçici; geçmiş yıla bakılıyorsa turuncu "salt okunur" notu; velide yalnız Ödevler,
   İlerleyiş ve Devamsızlık sayfalarında), altına alt bilgiyi (Aydınlatma metni, Bu sistem hakkında, sitenin iletişim
   bilgileri) ekler, sayfa içi aramayı uygular.
4. Ortak yapı taşları: büyük başlık (`hero`), boş liste kutusu (`bosKutu`), ana sayfadaki renkli kutucuklar (`kutucuklar`).

Kim görür: giriş yapmış herkes (öğrenci, veli, öğretmen, müdür, servisçi, yönetici); yönetici paketinde de aynı dosya çalışır.

## İçinde neler var?

### Adres (`#`) okuma

- `adrestenParca(adres)` — `'#/veli-odevler?c=<öğrenci kimliği>'` gibi bir metni `{ sayfa, cocuk }`'a ayırır. Kural
  (büyük/küçük harf duyarsız): isteğe bağlı `#`, isteğe bağlı `/`, sayfa anahtarı `[a-z0-9-]+`, isteğe bağlı YALNIZ
  `?c=` parametresi (`[A-Za-z0-9_-]`, 1–60 karakter). Başka her biçimde `null`. Velinin bildirimi hangi çocuğun sayfası
  olduğunu `?c=` ile taşır.
- `adrestenSayfa()` — şu anki adresin sayfa anahtarı, yoksa `''`.
- `adrestekiCocuguAl()` — adreste `?c=` varsa `S.adresCocuk`'a yazar; veli sayfaları (`27-veli-panel.js`
  `veliSeciliCocuk`) bir kez okuyup o çocuğu seçer.
- `adresGuncelleniyor` — `git()` adresi kendisi değiştirirken `true` yapılan bayrak; `25-tiklama.js`'teki `hashchange`
  dinleyicisi buna bakar (bkz. Dikkat: pratikte işe yaramıyor, asıl korumayı başka bir karşılaştırma yapıyor).

### Sayfa açma

- `git(sayfa)` — sırasıyla:
  0. Başka bir sayfaya geçiliyorsa (`sayfa !== S.page`) `tekSeferAyrilabilir('sayfa')` ([03-mesaj-modal.md](03-mesaj-modal.md)
     `TEK_SEFER`): bir kez gösterilen şifre listesi açık ve indirilmemişse "Ayrılınsın mı?" sorulur; "İptal" → hiçbir şey
     yapılmadan boş bir söz döner (`git(x).then(…)` yazan çağıran hata almaz). Aynı sayfayı yeniden açmak (`git(S.page)`)
     sormaz.
  1. Adresteki sayfa farklıysa `location.hash = '#/' + sayfa` (geri tuşu ve yenileme için; `?c=` düşer).
  2. Sayfaya bağlı durum sıfırlanır: `S.page = sayfa`, `S.araHook = null` (sayfanın kendi arama işlevi),
     `S._sayfaDegisti = false` (kaydedilmemiş yazı işareti), `S.odevF` (ödev filtreleri) boşaltılır, üst arama kutusu
     (`#araKutu`) temizlenir.
  3. `navCiz()` ([06-menu.md](06-menu.md)), `sidebarKapat()` (telefonda kayan menü kapanır), `#sayfa`'ya
     `<div class="yukleniyor">Yükleniyor...</div>`, sayfanın başına kaydırma, `aileHaritaKapat()` ("Çocuğumun telefonu"
     haritası, `27b-aile.js`).
  4. `SAYFALAR[sayfa]` yoksa `bosKutu('soru', 'Bu sayfa bulunamadı.')`; `sayfaAcik(sayfa)` yanlışsa
     `bosKutu('kilit', 'Bu bölüm okulunda kapalı. Okul müdürü Özellikler sayfasından açabilir.')`.
  5. Varsa sayfa işlevini çağırır. Dönüş her zaman bir söz (Promise): sayfa çizilince biter, çağıran ardından ileti
     ekleyebilir (ör. `git('profil').then(function () { sayfaMesaji(...) })`). Sayfa hata fırlatırsa (sunucu 403/500
     vb.) `#sayfa`'ya kırmızı `<div class="msg hata">` + hatanın iletisi yazılır; söz yine başarıyla biter.
- `SAYFALAR` bu dosyada değil, [08-ana-sayfa.md](08-ana-sayfa.md)'de tanımlıdır; sonraki parçalar ona sayfa ekler.

### Yenileme

- `sayfayiYenile()` — üst çubuktaki `#btnYenile` (bağlayan `25-tiklama.js`). Hiçbir şey yapmadığı durumlar: oturum yok,
  açık sayfanın işlevi yok, zaten yenileniyor (`S._yenileniyor`). Öğrencinin ödev teslim dosyası yükleniyorsa
  (`teslimDurum.yukleniyor > 0`, `14b-odev-teslim.js`) yenilemez, "Dosya yükleniyor. Yükleme bitince yenileyebilirsin."
  uyarısı verir. Sayfada kaydedilmemiş yazı varsa (`S._sayfaDegisti`; `25-tiklama.js` yazı kutularına yazılınca
  işaretler) "Sayfada yazdıkların kaydedilmedi; yenilersen silinecek. Yine de yenilensin mi?" diye sorar. Sonra düğmeye
  `donuyor` sınıfı (simge döner), bildirimleri de tazeler (`bildirimleriYenile`), sayfa işlevini yeniden çağırır ve eski
  kaydırma yerine döner. Hata olursa sayfanın üstünde `sayfaMesaji('hata', …)`. Sonunda bayraklar ve düğme eski hâline döner.
  `git()`'ten farkı: filtreler (`S.odevF`), arama kutusu ve kaydırma yeri korunur, menü yeniden çizilmez.

### Sayfa çerçevesi

- `yaz(html)` — `#sayfa.innerHTML = yilSeridi() + html + altBilgi()`; sonra `araUygula()` (üst arama kutusunda yazı
  varsa yeni içeriği hemen süzer), `yilSeciciBagla()`, `iletisimleriDoldur()` (alt bilgideki iletişim satırı,
  `05a-dis-sayfalar.js`). Her ekranın kendi HTML'ini buraya vermesi beklenir; `yaz`'dan geçmeyen içerikte yıl şeridi ve
  alt bilgi olmaz.
- `yilSeciciBagla()` (iç) — yıl şeridindeki `#yilSec` açılır listesi değişince `POST /api/egitim-yili/bak
  { id, ogrenci: yilOgrencisi() }` → `yilBilgisiYukle()` → `git(S.page)` (aynı sayfa o yılın kayıtlarıyla yeniden açılır).
  Hata tarayıcı uyarısıyla (`hataGoster`). Şeridin kendisi (`yilSeridi`: yıl bilgisinde en az iki yıl — öğrencide
  önceki okullarının dönemleri de sayılır — yoksa `''`; velide yalnız `veli-odevler`, `veli-ilerleyis`,
  `veli-devamsizlik`'te) ve yıl bilgisi `16-egitim-yili.js`'tedir.
- `altBilgi()` (iç) — `div.footer`: "Eğitim Evi — okul yönetim sistemi"; "Aydınlatma metni" bağlantısı
  (`/kvkk/kvkk.html`, yeni sekmede) · "Bu sistem hakkında" (`data-act="kaynakca"`; `25-tiklama.js` "Kaynakça" penceresini
  açar); gizli `p.footer-iletisim[data-iletisim]` — sitenin iletişim bilgileri ayarlandıysa `iletisimleriDoldur` doldurup gösterir.

### Yapı taşları (başka ekranlar kullanır)

- `hero(baslik, altYazi)` — `<div class="hero"><h1>BAŞLIK</h1><p class="alt">alt yazı</p><hr></div>`; alt yazı boşsa
  `p` yok. İkisi de `esc`'li. Neredeyse her ekranın ilk satırı.
- `bosKutu(g, metin)` — `<div class="bos">` + büyük simge (`ik(g, 'buyuk')`) + metin (`esc`'li): "Henüz öğrenci kaydı
  yok." gibi boş durumlar.
- `kutucuklar(liste)` — ana sayfanın renkli kutucukları. Liste öğesi `{ k, ad, renk, ikon, alt, rozet }`: `k` gidilecek
  sayfa (`data-nav`), `renk` CSS sınıfı (`turuncu`, `yesil`, `kirmizi`, `sari`, `mor`, `mavi`, `gri`, `camgobegi`,
  `lacivert`), `ikon` simge adı, `alt` küçük açıklama, `rozet` sağ üstteki sayı (boşsa yok). Boş (`null`) öğeleri ve
  okulun kapattığı bölümlerin kutucuklarını (`sayfaAcik`) atlar. `ad`, `alt`, `rozet`, `k` `esc`'li; `renk` ve `ikon`
  koddaki sabitlerden gelir.

## Kimle konuşur?

- Çağırdıkları:
  - `S`, `$`, `esc`, `api` ([00-durum.md](00-durum.md), [01-yardimcilar.md](01-yardimcilar.md)); `ik`
    ([02-ikonlar.md](02-ikonlar.md)); `sayfaMesaji` ([03-mesaj-modal.md](03-mesaj-modal.md));
    `iletisimleriDoldur` ([05a-dis-sayfalar.md](05a-dis-sayfalar.md));
  - `navCiz`, `sayfaAcik` ([06-menu.md](06-menu.md)); `SAYFALAR` ([08-ana-sayfa.md](08-ana-sayfa.md));
  - `yilSeridi`, `yilBilgisiYukle`, `yilOgrencisi` (`16-egitim-yili.js`); `teslimDurum` (`14b-odev-teslim.js`);
    `bildirimleriYenile`, `araUygula`, `sidebarKapat` (`24-bildirim-arama-mobil.js`); `hataGoster` (`25-tiklama.js`);
    `aileHaritaKapat` (`27b-aile.js`).
- Sunucu ucu: yalnız `POST /api/egitim-yili/bak` (yıl seçici) — [../../../sunucu/bolumler/egitim-yili.md](../../../sunucu/bolumler/egitim-yili.md)
  (herkes kendi bakacağı yılı seçer; cevap `{ yil, arsiv, message }`). Geri kalan her istek `git()`'in çağırdığı sayfa
  işlevlerinden gider.
- Onu kullananlar:
  - `git` — ön yüzün neredeyse her yeri: menü ve kutucuk tıklamaları (`25-tiklama.js`, `data-nav`), açılış
    (`26-baslat.js` `uygulamayiBaslat`), geri/ileri tuşu (`25-tiklama.js` `hashchange`), bildirime tıklama
    (`24-bildirim-arama-mobil.js`), kaydettikten sonra listeye dönme (onlarca ekran; ör. [08c-kisilikler.md](08c-kisilikler.md),
    [10a-giris-bilgisi.md](10a-giris-bilgisi.md), yönetim paketindeki `09-yonetici.js`).
  - `yaz`, `hero`, `bosKutu` — sayfa çizen hemen her parça (ana sayfa, ödevler, sınavlar, mesajlar, yönetim ekranları…).
  - `kutucuklar` — [08-ana-sayfa.md](08-ana-sayfa.md) ve `public/js/yonetim/09a-yonetim-paneli.js` (yöneticinin ana sayfası).
  - `sayfayiYenile` — `25-tiklama.js` (`#btnYenile`).
  - `adrestenSayfa` — `25-tiklama.js` (`hashchange`), `26-baslat.js` (açılış sayfası, telefon bildiriminden portal
    geçişi), [05b-sifre-zorunlu.md](05b-sifre-zorunlu.md) (`yonetimeGec`: yönetim adresine geçerken `#`'i taşımak).
  - `adrestekiCocuguAl` — `25-tiklama.js` (`hashchange`), `26-baslat.js` (açılış).
  - `adrestenParca` — `24-bildirim-arama-mobil.js` (bildirimin `link`'i geçerli mi, tıklayınca hangi sayfa/çocuk).
  - `adresGuncelleniyor` — `25-tiklama.js` (`hashchange`).
- Görünüm: `public/css/parcalar/03-iskelet.css` (`.hero`, `h3.sb`, `.iconbtn.donuyor` dönen yenile simgesi),
  `04-kartlar.css` ve `12-ikonlar.css` (`.bos`), `06-modal.css` (`.footer`, `.footer-iletisim`, `.yukleniyor`),
  `10-ana-sayfa-kutucuklari.css` (`.kutucuklar`, `.kutucuk` ve renkleri, `.kutucuk-rozet`), `02-form.css` (`.msg.hata`).
  Yıl şeridinin görünümü (`.yil-seridi`, `16-egitim-yili.js` üretir) `22-cesitli.css`'te.

## Nasıl çalışır (adım adım)?

### Menüden bir sayfaya geçiş

```
kişi "Takvim"e basar ─► 25-tiklama.js: data-nav="takvim" ─► git('takvim')
  adres #/ogr-odevler → #/takvim   (tarayıcı geçmişine yeni satır)
  S.page='takvim', filtreler/arama sıfır, navCiz(), menü (telefonda) kapanır, "Yükleniyor..."
  SAYFALAR.takvim yok mu?          → "Bu sayfa bulunamadı."
  okul bu bölümü kapattı mı?       → "Bu bölüm okulunda kapalı…"
  SAYFALAR.takvim() ─► api(...) ─► yaz(hero(...) + içerik)
                                      #sayfa = yılŞeridi + içerik + altBilgi ; araUygula ; yılSeçici ; iletişim
  hata ─► #sayfa = <div class="msg hata">ileti</div>
(bir an sonra tarayıcı hashchange olayını verir; hedef === S.page olduğu için ikinci kez açılmaz)
```

### Geri tuşu

```
tarayıcı ← ─► hashchange (25-tiklama.js)
  adresGuncelleniyor? (hep false, bkz. Dikkat) → devam
  hedef = adrestenSayfa(); adrestekiCocuguAl()
  hedef var, S.page'den farklı, SAYFALAR[hedef] var
    ├─ tekSeferAyrilabilir('sayfa') false (şifre listesi açık, "İptal") ─► history.replaceState('#/' + S.page) ; dur
    └─ true ─► modalKapat(); git(hedef)   (git'in kendi sorusu artık boş döner)
```

### Yenile düğmesi

```
#btnYenile ─► sayfayiYenile()
  dosya yükleniyor mu? → uyarı, dur
  kaydedilmemiş yazı? → confirm; hayırsa dur
  düğme döner ; bildirimleriYenile() ; SAYFALAR[S.page]() ; eski kaydırma yerine dön
```

## Dikkat!

- **`adresGuncelleniyor` bayrağı pratikte etkisiz.** `git()` bayrağı `true` yapıp `location.hash`'i değiştirir ve hemen
  `false`'a çeker; tarayıcı ise `hashchange` olayını bir sonraki görevde (sonradan) verir. Dinleyici çalıştığında bayrak
  zaten `false`'tur. İkinci kez açılmayı asıl önleyen, dinleyicideki `hedef !== S.page` karşılaştırmasıdır (`git` `S.page`'i
  zaman uyumlu yazar). Kod okumasına göre; zararsız, ama bu bayrağa güvenerek yeni bir iş yazma.
- **`git()` kaydedilmemiş yazıyı sormadan siler.** Soru yalnız yenile düğmesinde (`sayfayiYenile`) var; menüden başka
  sayfaya geçen kişi yarım yazdığı ödev açıklamasını ya da notu uyarısız kaybeder (`S._sayfaDegisti` sıfırlanır).
- **Geri tuşu açık pencereyi kapatır.** `hashchange` dinleyicisi sayfa değişirken `modalKapat()` çağırır; pencerenin
  kendi "Kapat" düğmesindeki onaylar (ör. [10a-giris-bilgisi.md](10a-giris-bilgisi.md)'deki "Listeyi indirmedin…")
  bu yolda çalışmaz.
- **Hata ve boş durum kutuları `yaz`'dan geçmez.** "Bu sayfa bulunamadı", "Bu bölüm okulunda kapalı" ve sayfa hatası
  doğrudan `#sayfa`'ya yazılır: bu ekranlarda yıl şeridi ve alt bilgi (Aydınlatma metni bağlantısı) yoktur.
- **Adres yalnız `?c=` taşır.** `adrestenParca` başka parametreli adresi (`#/yeni-sifre?t=…`, `#/eposta-onay?t=…`)
  tanımaz, `null` döner; bu adresleri `26-baslat.js` ayrıca okur. Bildirim bağlantısı bu kurala uymuyorsa bildirim
  tıklanamaz (`24-bildirim-arama-mobil.js`). Sunucuda yeni bildirim bağlantısı yazarken `#/sayfa` ya da
  `#/sayfa?c=<kimlik>` biçimini kullan.
- **`git()` çocuğu adresten düşürür.** Yeni sayfaya geçerken adres `#/sayfa` olur; aynı sayfaya yeniden `git` edilirse
  (adres zaten o sayfaysa) adrese dokunulmaz, `?c=` kalır.
- **Sayfa işlevi söz döndürmeli.** `git()` dönen sözü bekler; bir sayfa işini `yaz`'dan sonra zaman uyumsuz sürdürüyor
  ama sözü döndürmüyorsa, `git('x').then(sayfaMesaji…)` iletisi sayfa bitmeden yazılıp silinebilir.
- **Yenilemede `navCiz` yok.** `sayfayiYenile` menüyü yeniden çizmez; menüyü değiştiren bir şey (ör. yeni rol) varsa
  `portallariTazele` ya da `git` gerekir.
- **"Bu sistem hakkında" metni ayrı dosyada.** Alt bilgideki bağlantının açtığı pencere `25-tiklama.js`'te (`kaynakca`).
  Veri saklama cümlesi kişisel veriyle ilgili; değişirse aydınlatma metniyle (`public/kvkk/kvkk.html` 1. bölüm) birlikte
  değişmeli. `commit 543`'ten beri "Tüm veriler Eğitim Evi'nin sunucusunda saklanır; her okul yalnız kendi verisini görür."
  (önceden yanlışlıkla "okulunun kendi sunucusunda" diyordu).
- **"İptal"de de söz döner ama sayfa değişmez.** Şifre listesi sorusunda "İptal" seçilince `git()` boş bir söz döner;
  `git('profil').then(sayfaMesaji…)` gibi bir çağıran iletisini o an açık olan sayfaya yazar.
- **Parça sırası.** `SAYFALAR` [08-ana-sayfa.md](08-ana-sayfa.md)'de `var SAYFALAR = {}` ile kurulur; `SAYFALAR.x = …`
  yazan bir parça ad sırasında 08'den ÖNCE gelirse yüklenirken hata verir. Bu dosya `SAYFALAR`'ı yalnız çalışma anında
  (`git` içinde) okuduğu için güvende.

## Testleri

- `testler/buton-denetimi.js` (sunucusuz) — `kutucuklar` ve menüdeki her `data-nav`'ın bir `SAYFALAR` karşılığı
  olduğunu, `data-act="kaynakca"`'nın ele alındığını denetler.
- `testler/test-ozellikler.js` — kapalı bölümün sunucu tarafı (403) ve `/api/me` kapalı listesi (`git`'in `sayfaAcik`
  kararını besleyen veri).
- `testler/test-egitim-yili.js` — `POST /api/egitim-yili/bak` (yıl seçicinin çağırdığı uç) ve geçmiş yılda salt okunurluk.
- `testler/test-bildirim.js` — sunucunun velinin bildirimine `#/veli-odevler?c=<öğrenci>` bağlantısı yazdığını denetler
  (`adrestenParca`'nın beklediği biçim; `test-aile.js` `#/aile?c=` için de aynısı). Ön yüzdeki `adrestenParca`'nın
  kendisini deneyen bir test yok.
- `testler/yazim-denetimi.js` — "Yükleniyor...", "Bu sayfa bulunamadı." gibi metinlerin yazımı.
- Elle: bir sayfaya geç, tarayıcının geri tuşuna bas → önceki sayfa açılmalı; adrese `#/olmayan-sayfa` yaz → "Bu sayfa
  bulunamadı."; müdürle Anketler'i kapat, öğretmenle adrese `#/anketler` yaz → "Bu bölüm okulunda kapalı…"; ödev
  açıklamasına bir şey yazıp yenile düğmesine bas → onay sorusu.

## Son durum

- `git log`: 7 commit. Son değişiklik `commit 543` (2026-09-30): `git()` başka sayfaya geçmeden önce
  `tekSeferAyrilabilir('sayfa')` ile sorar (bir kez gösterilen giriş bilgileri menüden başka sayfaya geçince uyarısız
  kayboluyordu).
- Dosya `7506855 commit 22` (2026-08-28) ile doğdu; `85a732a commit 23` ve `b325b83 commit 35`
  (2026-08-28) ilk düzenlemeler.
- Ondan önce `276c0a0 commit 521` (2026-09-27, yönetim paneli ve site ayarları): yalnız `altBilgi`'nin yorumu
  ("data/config.yml doluysa" → "ayarlanmışsa"): iletişim bilgileri artık yönetim panelindeki site ayarlarından da gelir.
- Ondan önce `b6bfc03 commit 517` (2026-09-27, sayfa klasörleri): alt bilgideki aydınlatma metni bağlantısı `/kvkk.html`
  → `/kvkk/kvkk.html`. `da5e50c commit 257` (2026-09-25): `adrestekiCocuguAl` eklendi (velinin bildirimindeki `?c=`
  çocuğunun açılışta ve geri tuşunda seçilmesi).
- Bilinen açıklar (kod değiştirilmedi): etkisiz `adresGuncelleniyor` bayrağı, `git()`'in kaydedilmemiş yazıyı sormadan
  silmesi (Dikkat). "Bu sistem hakkında" metni `commit 543`'te düzeltildi.
- Planlı işlerden bu dosyaya dokunacaklar: "Üst şerit sadeleştirme" (iş 29; tanım bu dosyayı adıyla anıyor: her sayfa
  `history.pushState` ile geçmişe yazılacak, ← → tarayıcı geçmişini kullanacak, açık pencere varken "←" önce pencereyi
  kapatacak, ⌂ bulunulan portalın ana sayfasına; "Yenile" profil menüsüne taşınacak); "Paneller" (iş 5: alt bilgide
  yalnız yönetici/destek için "Yönetim" düğmesi — uygulamanın alt bilgisi buradaki `altBilgi`); "Sistem" (iş 4: sayfa
  başı Yardım, site duyurusu, bakım modu — ortak çerçeve `yaz` ile ilgili); "Çok dil" (iş 22: buradaki bütün görünen
  metinler `c()` kataloğuna).
