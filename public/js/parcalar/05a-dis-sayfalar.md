# public/js/parcalar/05a-dis-sayfalar.js

Giriş yapmamış ziyaretçinin gördüğü "dış" sayfalar (açılış, Hakkında, SSS, giriş ve kayıt kartı, okulun giriş sayfası
`/school/<okul>`) ve aralarındaki yenilemesiz geçiş; okul adresi, okul araması, son girilen okul, rakamlar, iletişim,
yapımcılar ve yorumlar; girişten sonra adres çubuğunun kişinin okuluna ayarlanması.

## Bu dosya ne yapar?

Eğitim Evi tek sayfalık bir uygulamadır: `/`, `/hakkinda`, `/login`, `/school/doruk` gibi adreslerin hepsinde sunucu aynı
`public/index.html` kabuğunu verir ([../../../sunucu/http.md](../../../sunucu/http.md), `UYGULAMA_YOLLARI` ve `OKUL_YOLU`).
Hangi sayfanın görüneceğine bu dosya, adres çubuğundaki yola bakarak karar verir:

| Adres | Sayfa | Ne görünür |
|---|---|---|
| `/` | `ana` | açılış: Eğitim Evi nedir, neler var, rakamlar, yorumlar (`#vAna`) |
| `/hakkinda` (`/about`) | `hakkinda` | proje, gizlilik, yapımcılar, iletişim (`#vHakkinda`) |
| `/sss/sss.html` (eski geçmişte kalan `/sss`, `/faq`) | `sss` | sık sorulan sorular (`#vSss`) |
| `/login` (`/giris`) | `giris` | giriş kartı + altında "Öğrenci ya da servisçiysen önce okulunu seç" araması |
| `/signup` (`/kayit`) | `kayit` | kayıt kartı (yetişkin hesabı) |
| `/school/<okul>` | `okul` | okulun giriş sayfası: okulun kendi sayfası (varsa) + kartın üstünde okulun adı; giriş o okulun içinde aranır |

Okul YALNIZ `/school/` ile başlayan adreste aranır; başka hiçbir yol okul sayılmaz ki okul adları sitenin kendi sayfalarıyla
(`login`, `hakkinda`…) karışmasın. Üst şerit ve alt bilgi bütün dış sayfalarda aynıdır; aralarındaki bağlantılara
(`data-site`) basınca sayfa yeniden yüklenmez (`history.pushState`), geri tuşu çalışır.

Neden okul adresi var? Aynı kullanıcı adı (çoğu zaman öğrencinin T.C. numarası) birden çok okulda olabilir. Okulun
sayfasından giren öğrencinin girişi o okulun içinde aranır (T.C. numarasıyla giriş de yalnız orada çalışır); okulsuz
`/login`'de kart öğrenciye önce okulunu arayıp seçmesini önerir, ad birden çok okulda varsa sunucu da "okulunu seç" der
([../../../sunucu/bolumler/kayit.md](../../../sunucu/bolumler/kayit.md)). Son girilen okul bu tarayıcıda hatırlanır ve bir dahaki
sefere "Son girdiğin okul" olarak çıkar.

Dosyanın bir kısmı giriş yapmış kişiye de çalışır: uygulamanın alt bilgisindeki iletişim bilgilerini doldurmak
(`iletisimleriDoldur`) ve girişten sonra adres çubuğunu kişinin okuluna ayarlamak (`okulYolunuAyarla`).

## İçinde neler var?

### Adres ve sayfa

- `OKUL_ADRESI_DESENI` — bir `[a-z0-9]`, ardından isteğe bağlı olarak en çok 38 `[a-z0-9-]` ve bir `[a-z0-9]`: 1–40
  karakter, küçük harf, rakam ve tire; tireyle başlamaz, bitmez. Sunucudaki `OKUL_YOLU` ile aynı kural.
- `SITE_SAYFALARI` — yol → sayfa: `''` → `ana`, `hakkinda`/`about` → `hakkinda`, `sss/sss.html`/`sss`/`faq` → `sss`,
  `login`/`giris` → `giris`, `signup`/`kayit` → `kayit`. Bunlar okul adresi sayılmaz.
- `okulYolu(kisaAd)` → `'/school/' + encodeURIComponent(kisaAd)`. Okul adresini gösteren her yer bunu kullanır.
- `adrestekiYol()` — `location.pathname`'in sondaki bütün `/`'ları ve baştaki bir `/`'ı atılmış, küçük harfli hâli
  (`/Login/` → `login`).
- `adrestenOkul()` — yol `school/<x>` ise ve `<x>` (çözülünce) desene uyuyorsa kısa ad, yoksa `''`.
- `disSayfa()` — `SITE_SAYFALARI`'nda varsa o; okul adresiyse `'okul'`; başka her şey `'ana'`.

### Son girilen okul (`localStorage` `ee_son_okul`)

- `sonOkulOku()` → `{ kisaAd, ad, il, ilce }` ya da `null` (bozuk kayıt, desene uymayan kısa ad, gizli sekme → `null`).
- `sonOkulYaz(o)` — yalnız kısa ad, ad (140), il ve ilçe (60'ar) yazılır; kişisel bilgi yok.

### Sayfa gösterme

- `girisEkraniGoster()` — dış sayfalardan birini açar. `S.genelGiris` doğruysa adres ne olursa olsun giriş kartı (şifre
  sıfırlama bağlantısıyla gelindiğinde ve yönetim adresinde oturum yokken). Uygulamayı (`#app`) kapatır, `#dis`'i açar;
  kart sayfalarında (`giris`, `kayit`, `okul`) `#vitrin`'i gizleyip `#authWrap`'i, öbürlerinde tersini gösterir; `#vAna`,
  `#vHakkinda`, `#vSss`'ten yalnız birini açar; üst şeritte sayfayı işaretler, site bilgisini (bir kez) yükler, açılışta
  yorumları yükler. Sekme başlığı: Hakkında → "Hakkında — Eğitim Evi", SSS → "Sık sorulan sorular — Eğitim Evi", öbürleri
  "Eğitim Evi"; kart sayfalarında önce "Eğitim Evi", okul adresindeyse `okulBasligiCiz` okulun adını koyar. "Okulunu seç"
  alanı yalnız `giris`'te görünür (orada "Son girdiğin okul" da çizilir). Doğru sekme seçili değilse (`#tabGiris`/`#tabKayit`)
  ona tıklanır.
- `siteMenusuIsaretle(sayfa)` — `.site-ust` içinde `data-site`'ı o sayfanın adresi olan bağlantıya `aria-current="page"`;
  kök (`/`) işaretlenmez.
- `siteGit(yol)` — adres farklıysa `pushState` (olmazsa tam sayfa `location.assign`), `S.genelGiris` kalkar, sayfa başına
  kaydırılır; `okulAdresiniYenile()` bitince `girisEkraniGoster()`. Söz döner (çağıran ardından odak verebilsin).
- `sekmeAdresiYaz(tur)` — giriş/kayıt sekmesi değişince adres `/login` ↔ `/signup` olur (`replaceState`, `#` kısmı korunur).
  Giriş yapılmışsa ya da okul adresindeysek dokunmaz. [05-giris.md](05-giris.md)'deki `sekmeGec` çağırır.
- `okulBasligiCiz()` — önce okulun kendi sayfasını çizdirir (`okulSayfasiniCiz`, `19g-okul-sayfasi.js`). Okul adresinde
  değilsek `#authOkul`'u gizler, "Başka bir okul seç" düğmesini (`#btnOkulDegis`) gizler. Okul adresindeysek kartın üstüne
  okul ikonu (`ik('okul')`) + adı + "ilçe, il" (`esc`'li) koyar — ama okulun kendi sayfası varsa ad orada büyük yazdığı için bu kutu
  gizlenir; "Başka bir okul seç"i gösterir; sekme başlığı "<okul adı> — Eğitim Evi". İki durumda da giriş kimliği
  sekmesini yeniden kurar (`girisKimlikAyarla`: okul sayfasında "çoğu zaman T.C. kimlik numaran" ipucu çıksın).
- `sonOkulCiz()` — `#vSonOkul`'a "Son girdiğin okul · <ad> · Seç" bağlantısı (`/school/<kısa ad>`); kayıt yoksa boş.

### Rakamlar, iletişim, yapımcılar (`GET /api/site`)

- `siteBilgisi` — `{ yuklendi, yukleniyor, iletisim?, eposta? }`.
- `siteBilgisiYukle()` — bir kez `GET /api/site`: `sayilariCiz(d.sayilar)`, `iletisimCiz(d.iletisim)`,
  `yapimcilariCiz(d.yapimcilar)`, `bildirimAralikDk` geldiyse `bildirimAraligiAl` (`24-bildirim-arama-mobil.js`). Hata
  olursa rakam bantları (`.v-sayilar`) gizlenir; yüklendi sayılmadığı için bir sonraki sayfa geçişinde yeniden denenir.
- `sayiYaz(n)` — `tr-TR` binlik ayırıcılı sayı (`1.234`).
- `sayilariCiz(s)` — `[data-sayi="okul|kisi|cevrimici"]` öğelerine sayılar ("okul kullanıyor", "kayıtlı kişi", "kişi şu an açık").
- `iletisimCiz(il)` — iletişimi `siteBilgisi`'ne koyar, yerleri doldurur; Hakkında'daki iletişim bölümü (`#hIletisimBolum`)
  e-posta da telefon da yoksa gizlenir.
- `iletisimleriDoldur()` — iletişim satırını üç tür yere yazar: dış alt bilgi (`#sIletisim`), Hakkında (`#hIletisim`) ve
  uygulamanın içindeki her sayfanın alt bilgisi (`[data-iletisim]`). E-posta bağlantısı `data-act="site-eposta"` taşır ve
  adres HTML'e YAZILMAZ, sonradan `textContent` ile konur (kaynaktan adres süpüren botlar bulamasın); telefon
  `tel:` bağlantısı (numaradaki rakam ve `+` dışı atılır). İkisi de yoksa yer gizlenir.
- `yapimcilariCiz(liste)` — üst şeritteki açılır liste ve Hakkında'daki liste (`[data-yapimcilar]`): her yapımcı ad + katkı;
  GitHub adı varsa `https://github.com/<ad>` bağlantısı (yeni sekme, `rel="noopener"`, üst şeritteki GitHub simgesi
  kopyalanır). Liste boşsa sayfadaki hazır satır (proje sahibi) kalır.
- `yapimcilarAcKapa(ac)` — `#yapimciListe`'yi açar/kapatır, `aria-expanded` yazar.
- `EYLEMLER['yapimcilar']` — "Yapımcılar" düğmesi: aç/kapa.
- `EYLEMLER['site-eposta']` — e-posta bağlantısına basınca `mailto:` açar.

### Yorumlar (açılışın altı, `GET /api/yorumlar`)

- `yorumBilgisi` — `{ yuklendi }`.
- `yildizCiz(n)` — 5 yıldız, ilk `n`'i dolu (`ik('yildiz')`), `role="img"` ve "5 üzerinden n yıldız" etiketi.
- `yorumlariYukle()` — bir kez: yorum yoksa "Henüz yorum yok. İlk yorumu sen yaz."; varsa özet (ortalama virgüllü, yuvarlanmış
  yıldız, "N yorum") ve her yorum (yıldız, `esc`'li metin, `avatar`, kısaltılmış ad, rol, tarih). Hata → "Yorumlar şu an
  yüklenemedi." ve bir sonraki açılışta yeniden denenir. Yorum yazma bu dosyada değil (giriş yapmış yetişkin ekranı).

### Okul arama (`/login` sayfası)

- `vitrinArama` — `{ sayac, sira }`: 250 ms gecikme ve yarış koruması.
- `vitrinAra()` — `#vOkulAra` 2 harften kısaysa sonuçları siler. Değilse "Aranıyor...", `GET /api/okul-adres/ara?q=`. Eski
  isteğin cevabı (sıra numarası tutmuyorsa) atılır. Sonuç yoksa "Bu adla Eğitim Evi'nde bir okul yok. Okulun henüz
  eklenmemiş olabilir; okul yönetimine sor."; sunucu yazımı düzelttiyse `"q" yerine "düzeltme" diye aradık.`; kelimelerin
  hepsini içeren okul yoksa "En yakın sonuçlar"; her okul `/school/<kısa ad>` bağlantısı, adında tutan kelimeler
  `aramaVurgula` ile koyu ([05-giris.md](05-giris.md)), altında "ilçe, il". Hata iletisi `esc`'li.

### Açılışta bir kez

- `disSayfalariKur()` — `[data-cizim]` öğelerine çizimler (`cizim(ad, data-cizim-sinif || 'vitrin-cizim')`,
  [02b-cizimler.md](02b-cizimler.md)), `[data-ikon]` öğelerine simgeler (`ik`); `#dis` içindeki `a[data-site]` tıklamaları
  yenilemesiz geçişe bağlanır (Ctrl/⌘/Shift ya da orta tık tarayıcıya bırakılır: yeni sekmede açılsın); açık yapımcı listesi
  dışarı tıklayınca ya da Esc ile kapanır (Esc'te odak düğmeye döner); `popstate` (geri/ileri) — giriş yapılmamışsa
  `S.genelGiris` kalkar, okul yenilenir, sayfa gösterilir; okul arama kutusu (250 ms), arama formu (Enter: ilk sonuç varsa
  oraya gider, yoksa hemen arar), "Başka bir okul seç" (`/login`'e dönüp arama kutusuna odak). Sonunda
  `okulAdresiniYenile()`'nin sözünü döner.
- `okulAdresiniYenile()` — adreste okul yoksa `S.okulAdresi = null`. Aynı okul zaten yüklüyse bir şey yapmaz. Değilse
  `GET /api/okul-adres?kisa=` → `S.okulAdresi = d.okul` (`{ ad, il, ilce, kisaAd }`), `S.okulAdresi.sayfa = d.sayfa || null`
  (okulun giriş sayfası), `sonOkulYaz`. 404 gelirse adres `/login` olur ve kartın üstünde `"<kısa ad>" adresinde bir okul
  yok. Okulunu aşağıdan seç.` yazar; başka hatada yalnız `S.okulAdresi = null`.
- `okulYolunuAyarla()` — girişten sonra (`26-baslat.js` `uygulamayiBaslat`) ve okul adresi değişince (`16b-okul-ayarlari.js`):
  öğrenci, öğretmen, müdür ya da servisçi olarak bir okuldaysa (`u.schoolSlug`) adres `/school/<okul>` olur (yenileyince
  aynı okulda kalsın; adresin `#` kısmı korunur) ve son okul farklıysa güncellenir; okulu olmayan (yetişkin hesabı, yönetici)
  `/login`, `/signup`, `/hakkinda` gibi bir dış sayfadaysa adres `/` olur (`#` kısmı yine korunur).

## Kimle konuşur?

- Çağırdığı başka parçalar (hepsi aynı IIFE'de, [../../../sunucu/http.md](../../../sunucu/http.md) `birlesikOku`):
  [01-yardimcilar.md](01-yardimcilar.md) (`$`, `esc`, `api`, `EYLEMLER`), [02-ikonlar.md](02-ikonlar.md) (`ik`, `avatar`,
  `tarihGun`), [02b-cizimler.md](02b-cizimler.md) (`cizim`), [03-mesaj-modal.md](03-mesaj-modal.md) (`mesajGoster`),
  [05-giris.md](05-giris.md) (`girisKimlik`, `girisKimlikAyarla`, `aramaSadeTR`, `aramaVurgula`), `19g-okul-sayfasi.js`
  (`okulSayfasiniCiz`), `24-bildirim-arama-mobil.js` (`bildirimAraligiAl`); [00-durum.md](00-durum.md)'deki `S` (`S.user`,
  `S.okulAdresi`, `S.genelGiris`).
- Sunucu uçları (hepsi girişsiz):
  - `GET /api/site` → `{ sayilar: { okul, kisi, cevrimici }, iletisim: { eposta, telefon }, yapimcilar: [{ ad, github, katki }],
    bildirimAralikDk, cevrimiciDk }` ([../../../sunucu/site.md](../../../sunucu/site.md); `cevrimiciDk` burada kullanılmaz);
  - `GET /api/yorumlar` → `{ sayi, ortalama, yorumlar: [{ adKisa, rol, yildiz, metin, tarih }] }`
    ([../../../sunucu/bolumler/yorum.md](../../../sunucu/bolumler/yorum.md));
  - `GET /api/okul-adres?kisa=` ve `GET /api/okul-adres/ara?q=` ([../../../sunucu/bolumler/kayit.md](../../../sunucu/bolumler/kayit.md);
    okul ağındaki yüzlerce öğrenci için IP başına dakikada 3000).
- Bu dosyadakileri kullananlar:
  - `26-baslat.js` — `disSayfalariKur`, `okulAdresiniYenile`, `girisEkraniGoster` (açılışta, çıkışta), `siteBilgisiYukle`
    (uygulama açılınca, alt bilgi için), `adrestenOkul` (çıkışta okul adresinde mi kalınacak), `okulYolunuAyarla`;
  - [05-giris.md](05-giris.md) — `siteGit` ("Okulunu bul"), `sekmeAdresiYaz` (sekme geçişi);
  - `07-yonlendirme.js` — `iletisimleriDoldur` (her sayfa çizilince alt bilginin iletişim satırı);
  - `08c-kisilikler.js` — `siteBilgisi.iletisim` ("+ Ekle → Müdür"de sistem yöneticisinin iletişimi, yoksa `/api/site`);
  - `16b-okul-ayarlari.js` — `okulYolu`, `okulYolunuAyarla` (müdür okul adresini değiştirince);
  - `okulYolu` ayrıca `10a-giris-bilgisi.js`, `10b-hesaplar.js`, `19g-okul-sayfasi.js`, `23-veli-ayarlar.js` ve yönetimde
    `09-yonetici.js`;
  - yönetim paketi: `09b-site-ayarlari.js` (`iletisimCiz`, `yapimcilariCiz` — ayar kaydedilince sayfadakiler hemen
    güncellensin), `09-yonetici.js` (`yildizCiz`, yorum yönetimi).
- HTML (`public/index.html`): `#dis`, `.site-ust` ve `a[data-site]`, `#btnYapimcilar`, `#yapimciListe`, `.yapimci-kutu`,
  `[data-yapimcilar]`, `#vitrin`, `#vAna`, `#vHakkinda`, `#vSss`, `[data-sayi]`, `.v-sayilar`, `#vYorumOzet`, `#vYorumListe`,
  `#hIletisimBolum`, `#hIletisim`, `#sIletisim`, `[data-cizim]`/`[data-cizim-sinif]`, `[data-ikon]`, `#authWrap`, `#authOkul`,
  `#okulSecAlan`, `#vSonOkul`, `#vOkulForm`, `#vOkulAra`, `#vOkulSonuc`, `#btnOkulDegis`, `#app`. Uygulamanın alt bilgisindeki
  `[data-iletisim]`'i `07-yonlendirme.js` üretir.
- CSS: `public/css/parcalar/29-dis-sayfalar.css` (üst şerit, vitrin, rakam bandı, yorumlar, yıldızlar, yapımcı listesi,
  `.site-iletisim-bag`, `.auth-okul`, `.vitrin-son-okul`, `.vitrin-sonuc-bilgi`, `.vitrin-liste`, `.vitrin-okul`,
  `.vitrin-okul-ad mark`), `31-okul-sayfasi.css` (okul sayfalı kart, `.auth-wrap.okul-sayfali`), `01-giris-kayit.css`
  (`.auth-wrap`); uygulama içindeki iletişim satırı `06-modal.css` (`.footer-iletisim`) ve "+ Ekle"deki
  `28-yetiskin-hesap.css` (`.ekle-iletisim-bag`).
- Rol: dış sayfaları girişsiz ziyaretçi görür; `iletisimleriDoldur`, `siteBilgisiYukle` ve `okulYolunuAyarla` giriş yapmış
  herkes için de çalışır.

## Nasıl çalışır (adım adım)?

### Açılış

```
tarayıcı /school/doruk ister
  sunucu: okul var mı? (30 sn önbellek) ─ var ─► index.html     yok ─► okul-bulunamadi.html (404)
26-baslat.js ─► disSayfalariKur(): çizimler, simgeler, tıklama ve popstate dinleyicileri
             ─► okulAdresiniYenile(): GET /api/okul-adres?kisa=doruk ─► S.okulAdresi (+ sayfa), son okul yazılır
             ─► oturum yoksa girisEkraniGoster()
                  disSayfa() = 'okul' ─► #authWrap, okulBasligiCiz (okulun sayfası + ad), sekme başlığı okulun adı
```

### Dış sayfalar arasında gezinme

```
"Hakkında" (a[data-site="/hakkinda"]) ─► #dis tıklama dinleyicisi ─► preventDefault
   siteGit('/hakkinda') ─► pushState ─► okulAdresiniYenile (okul yok → null) ─► girisEkraniGoster
geri tuşu ─► popstate ─► (giriş yoksa) okulAdresiniYenile ─► girisEkraniGoster
```

### Okulunu seç (öğrenci, servisçi)

```
/login ─► "Öğrenci ya da servisçiysen önce okulunu seç" kutusu
yazar (≥ 2 harf) ─► 250 ms ─► GET /api/okul-adres/ara?q= ─► liste (vurgulu)
okula basar (normal bağlantı, tam sayfa) ─► /school/<okul> ─► o okulun kartı; giriş okul içinde aranır
```

### Girişten ve çıkıştan sonra

```
giriş ─► uygulamayiBaslat ─► okulYolunuAyarla: öğrenci ─► adres /school/<okul> (adresteki # kısmı neyse korunur)
çıkış (26-baslat.js cikisYap) ─► okul adresindeyse orada kalır, değilse /login ─► okulAdresiniYenile ─► girisEkraniGoster
```

## Dikkat!

- **Dosyanın baş yorumu bir yerde eskimiş:** "sunucu bilinmeyen yolda da onu döndürür" diyor; bugün sunucu yalnız
  uygulamanın adreslerinde (`UYGULAMA_YOLLARI`, `school/<okul>`) kabuğu verir, bilinmeyen yolda 404 "Sayfa bulunamadı"
  döner; olmayan okulda da "Okul bulunamadı" sayfası (404) gelir. `disSayfa()`'nın "tanınmayan adres → açılış" kolunu bugün
  pratikte yalnız `/index.html` kullanır (dosya olarak sunulur, `SITE_SAYFALARI`'nda yok; açılış görünür).
  `okulAdresiniYenile`'nin 404 kolu ise yalnız sunucunun denetiminden geçmeden oluşan durumlarda çalışır: geri/ileri
  tuşuyla adresi bu arada değişmiş bir okula dönmek, sunucunun 30 saniyelik "okul var" önbelleği (adres değişince hemen
  boşalır ama başka durumlarda 30 saniye eski kalabilir), veritabanına ulaşılamadığında sunucunun kabuğu yine vermesi. Kod
  değiştirilmedi.
- **Okul bilgisi 404 dışında bir hatayla gelmezse** (ağ kesintisi, 429, 5xx) `S.okulAdresi` boş kalır ama sayfa yine `okul`
  sayılır: kartın üstünde okul adı ve "Başka bir okul seç" görünmez, "Okulunu seç" araması da gizlidir, giriş `okul` alanı
  olmadan gider. Bu durumda okul hesabıyla giren öğrenci "hesap yok" ya da "okulunu seç" iletisi alabilir, yanında (okul
  adresi boş sayıldığı için) "Kayıt ol" kısa yolu bile çıkabilir; "çoğu zaman T.C. kimlik numaran" ipucu da çıkmaz, sekmeler
  arasında gidip gelince ([05-giris.md](05-giris.md) `sekmeGec`) okul sayfasında "Okulunu seç" araması belirir. Sayfayı
  yenilemek düzeltir. Kod okumasına göre; denenmedi.
- **Adres kuralları birkaç yerde aynı tutulmalı:** `OKUL_ADRESI_DESENI` sunucudaki `OKUL_YOLU` ([../../../sunucu/http.md](../../../sunucu/http.md))
  ile, `SITE_SAYFALARI` sunucunun `UYGULAMA_YOLLARI`'yla. Yeni bir dış sayfa eklersen üçüne de (ve `siteMenusuIsaretle`'deki
  hedef tablosuna, `girisEkraniGoster`'deki başlık tablosuna) ekle.
- **Test bu dosyanın metnine ve işlevlerine dayanır.** `testler/test-adresler.js` sunucunun verdiği `app.js`'te
  `sss: '/sss/sss.html'` ve `'sss/sss.html': 'sss'` yazılarını arar; ayrıca `girisEkraniGoster` ile `okulBasligiCiz`'i adıyla
  kesip, kullandıkları adları (`disSayfa`, `siteMenusuIsaretle`, `siteBilgisiYukle`, `yorumlariYukle`, `okulSayfasiniCiz`,
  `girisKimlikAyarla`, `girisKimlik`, `ik`, `esc`, `sonOkulCiz`, `S`, `$`, `document`) taklit ederek çalıştırır. Bu iki işleve
  yeni bir dış ad eklersen testin parametre listesine de ekle; tablolardaki tırnak biçimini değiştirirsen testin desenini de.
- **E-posta adresi sayfanın HTML'inde yoktur** (bilerek): bağlantının `href`'i yok, adres `textContent` ile konur, `mailto:`
  tıklamada açılır. Yan etkisi: `href`'siz bir `<a>` klavyeyle (Tab) odaklanamaz; klavye kullanan biri e-posta bağlantısına
  gelemez. Kod değiştirilmedi.
- **Yapımcı listesi ve iletişim sitenin ayarından gelir** (yönetici değiştirir; [../../../sunucu/bolumler/site-ayarlari.md](../../../sunucu/bolumler/site-ayarlari.md)).
  GitHub adı sunucuda `GITHUB_ADI` deseniyle denetlenir, burada ayrıca `esc`'lenir. `/api/site` cevabına yönetim adresini ele
  veren bir alan koyma (`test-admin-gizli.js`).
- **Site bilgisi sayfa başına bir kez yüklenir**; yönetici başka bir sekmede iletişimi değiştirirse açık sayfalar yenilenene kadar
  eskisini gösterir (yönetim ekranı kendi sekmesinde `iletisimCiz`/`yapimcilariCiz` ile hemen günceller). Yorumlar da bir kez.
- **`S.okulAdresi` ve `S.genelGiris` `00-durum.js`'teki başlangıç nesnesinde yok:** ilk kez burada (ve `26-baslat.js`,
  `09a-yonetim-paneli.js`, `19g-okul-sayfasi.js`) yazılır; başta `undefined`'dır, kod bunu "yok" diye okur.
  `19g-okul-sayfasi.js` okul sayfası kaydedilince `S.okulAdresi`'ni `null` yapar ki giriş sayfası yenisini çeksin.
- **`sekmeAdresiYaz` yönetim adresinde de çalışır:** oturumu olmayan biri yönetim adresinde (orada `S.genelGiris` hep açık) "Hesap
  Aç" / "Giriş Yap" sekmesine basarsa adres `/signup` ya da `/login` olur, sayfa yönetim paketiyle kalır. Girişten sonra
  `05b-sifre-zorunlu.js` tam sayfa geçişle doğru adrese gittiği için zararsız.
- **`siteGit` `pushState` hata verirse söz döndürmez** (tam sayfa geçişe düşer, `undefined` döner); ardına `.then` yazan
  çağıranlar ("Okulunu bul", "Başka bir okul seç") o çok ender durumda konsola hata düşer, sayfa yine gider.
- **Girişten sonra `popstate` bu dosyada yok sayılır** (`S.user` varsa): uygulamanın içindeki geçmişi `07-yonlendirme.js` yönetir.
- **Son okul yalnız okul adı ve adresidir;** öğrencinin kimliği yazılmaz. `okulYolunuAyarla` son okulu yazarken il/ilçeyi boş,
  adı `u.schoolName`'den alır.

## Testleri

- `testler/test-adresler.js` (sunucu gerekir; `tumtest.sh`'te) — `/school/test-ortaokulu` 200 ve kabuk; `/hakkinda`,
  `/about`, `/login`, `/giris`, `/signup`, `/kayit`, `/` yönlenmeden açılıyor; `/sss`, `/faq` 301 ile `/sss/sss.html`'e;
  `/olmayan` "Sayfa bulunamadı"; sayfalarda (`/school/boyle-bir-okul-yok`'un "okul bulunamadı" sayfası dahil) eski adrese
  bağlantı yok; `app.js`'te SSS asıl adresle
  (`siteMenusuIsaretle` hedefi ve `SITE_SAYFALARI`); sekme başlığı: SSS/Hakkında'dan giriş ya da kayda geçince "Eğitim Evi",
  okul adresinde okulun adı (bu dosyanın iki işlevi taklit belgeyle çalıştırılır).
- Sunucu tarafı: `testler/test-etut.js` (olmayan okulun adresi 404 ve "Okul bulunamadı" sayfası — bu denetim o pakette
  duruyor), `testler/test-site-ayarlari.js` (`/api/site`, iletişim ve yapımcılar, okul adresi değişince eski adresin hemen
  "Okul bulunamadı" olması), `testler/test-yonetim.js` ve `testler/test-okul-sayfasi.js` (`/api/okul-adres` ve `/ara`), `testler/test-yorum-ek.js`
  (`/api/yorumlar`), `testler/test-okul-agi.js` (300 öğrencinin tek IP'den okul adresini açması), `testler/test-admin-gizli.js`
  (`/api/site` yönetimi ele vermiyor).
- `testler/buton-denetimi.js` — `yapimcilar`, `site-eposta` eylemlerinin karşılığı.
- Ekran turu `araclar/gezinti.js` `/login`'de okul aramasını (büyük/küçük harf ve yazım hatasıyla) çeker (turu belgeleme işinde
  çalıştırma).
- Elle: sunucuyu 3200'de aç; üst şeritte Hakkında → SSS → Giriş arasında gez (sayfa yenilenmemeli, geri tuşu çalışmalı, sekme
  başlığı değişmeli); `/login`'de "test ortaokulu" yaz, okula bas, kartın üstünde okulun adı ve "Başka bir okul seç" çıkmalı;
  `/login`'e dön, "Son girdiğin okul" görünmeli.

## Son durum

- `git log`: 9 commit. Son üçü:
  - `276c0a0 commit 521` (2026-09-27, gizli yönetim + site ayarları): `siteBilgisiYukle` `/api/site`'tan gelen
    `bildirimAralikDk`'yı `bildirimAraligiAl`'a veriyor; iletişim yorumunda kaynak "data/config.yml" yerine "sitenin ayarı".
  - `b6bfc03 commit 517` (2026-09-27, sayfa klasörleri): SSS'nin asıl adresi `/sss/sss.html` oldu (`SITE_SAYFALARI` ve
    `siteMenusuIsaretle`), eski `/sss` ve `/faq` geçmiş kaydı için tanınıyor; giriş/kayıt kartına geçince sekme başlığı önceki
    sayfanın adında kalmıyor ("Eğitim Evi").
  - `fe018dd commit 513` (2026-09-26): okul adresi `/<okul>` yerine `/school/<okul>` oldu (`okulYolu`, `adrestenOkul`,
    son okul bağlantısı, arama sonuçları, `okulYolunuAyarla`); `/about`, `/faq`, `/giris`, `/kayit` eş adları.
  - Daha eski: `fa9a072 commit 510`, `f9a3978 commit 505`, `7d59731 commit 411`, `37f867d commit 385`, `8e98c3e commit 377`;
    dosyanın ilk hâli `61ddc51 commit 376` (2026-09-26, 255 satır).
- Bilinen açıklar (kod değiştirilmedi): eskimiş baş yorumu; okul bilgisi 404 dışı bir hatayla gelmeyince okul sayfasının yarım
  kalması; klavyeyle odaklanamayan e-posta bağlantısı.
- Planlı işlerden bu dosyayı etkileyecekler:
  - "Arama motorunda görünme" — meta açıklama, Open Graph önizlemesi, `robots.txt`, `sitemap.xml`, JSON-LD: dış sayfaların
    başlık ve açıklamaları (bugün yalnız `document.title` burada değişiyor) sayfa başına düzenlenecek.
  - "Paneller … alt bilgide Yönetim düğmesi" — tanım, yönetici ve destek girişten sonra otomatik yönlendirilmesin, herkes gibi
    açılış sayfasında sağ üstte "Hesaba gir →" görsün; alt bilginin solunda yalnız onlara "Yönetim" / "Destek paneli" düğmesi
    diyor (adres ve etiket sunucudan, `app.js`'te sabit metin olmadan).
  - "Tek kişi tek hesap + portallar öğrencide de" — girişte "Okul seç"; okul araması ve `/school/<okul>` akışı buna göre değişecek.
  - "Çok dil" — üst şeride "TR ▾" dil seçici; buradaki bütün metinler çeviri kataloğuna.
  - "Toplantılar … tahta hesabı" — tahtalar okulun sayfasından (`/school/<okul>`) girecek.
