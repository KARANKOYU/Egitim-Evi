# public/js/parcalar/05-giris.js

Giriş kartının bütün davranışı (giriş, iki adımlı kod, kayıt, şifremi unuttum, oturum anahtarının saklanması) ve başka
ekranların da kullandığı ortak araçlar: şifre, kullanıcı adı ve T.C. denetimi, kişi kodu biçimi ve kod kutusu, okul
araması sadeleştirmesi, düğme bekletme.

## Bu dosya ne yapar?

Siteye gelen biri sağ üstteki "Giriş"e ya da "Kayıt ol"a basınca ortadaki kartı görür. Kartın görünüşü `public/index.html`'de
(`#authWrap`) hazır durur; ona can veren bu dosyadır:

- **Giriş:** kullanıcı adı ya da e-posta (üstteki kayan sekmeyle seçilir) + şifre. Sunucu isterse bir "robot değilim"
  sorusu açılır. E-postası olan hesapta ikinci adım olarak e-postaya giden 6 haneli kod sorulur; öğrencide ve e-postası
  olmayan hesapta oturum hemen açılır.
- **Kayıt ("Hesap Aç"):** herkes aynı yetişkin hesabını açar — veli, öğretmen, müdür. Hesap rolsüzdür; girişten sonra sağ
  üstteki "+ Ekle" ile portal eklenir (`08c-kisilikler.js`): çocuğunu veli koduyla, öğretmenliğini kişi kodunu müdüre
  vererek, okulunu kişi kodunu sistem yöneticisine vererek. Öğrenci ve servisçi kaydolmaz; hesaplarını okul açar. Kayıt
  hemen hesap açmaz: e-postaya bir bağlantı gider, hesap o bağlantıya tıklanınca açılır.
- **Şifremi unuttum:** e-posta adresine sıfırlama bağlantısı istenir; bağlantıyla gelinince "Yeni şifreni belirle" ekranı.
- **Oturum anahtarının nerede tutulacağı:** "Beni hatırla" (tarayıcı kapansa da kalır), olağan (sekme kapanınca gider) ya
  da "Bilgilerimi bu cihaza kaydetme" (yalnız bellekte). Her sekmenin kendi oturumu önce gelir: aynı tarayıcıda bir sekmede
  müdür, ötekinde veli açık kalabilir.

Dosyanın `authKur`'dan önceki kısmı "ortak alet çantası"dır: sunucudaki doğrulayıcıların ön yüzdeki eşleri (şifre kuralı, kullanıcı adı,
T.C., e-posta deseni), kişi kodunun biçimi ve yazarken tireleri kendiliğinden koyan kod kutusu, okul adı araması için
Türkçe sadeleştirme ve vurgulama, iş sürerken düğmeyi kilitleyen `dugmeBekle`/`dugmeBitir`. Bunlar bu dosyada durur
çünkü giriş kartı onları ilk kullanan yerdi; bugün yirmiden fazla parça onları çağırır.

## İçinde neler var?

### Oturum anahtarının saklanması

Tarayıcıdaki anahtarlar:

| Anahtar | Nerede | Ne |
|---|---|---|
| `ee_token` | `sessionStorage` | bu sekmenin oturum anahtarı ("kaydetme" seçilmediyse) |
| `ee_token` | `localStorage` | "Beni hatırla" seçildiyse hatırlanan anahtar (bütün sekmeler görür) |
| `ee_kip` | `sessionStorage` | bu sekmede girişte seçilen saklama biçimi: `kalici`, `oturum`, `yok` |
| `ee_hatirla` | `localStorage` | son girişin saklama biçimi (yazılıyor ama hiçbir yerde okunmuyor; Dikkat'e bak) |
| `ee_giris_turu` | `localStorage` | girişte son seçilen kimlik türü (`kadi` / `eposta`), `tercihYaz('giris_turu')` ile |

- `tokenSakla(token)` — girişte çağrılır. Kip: "Bilgilerimi bu cihaza kaydetme" işaretliyse `yok`, "Beni hatırla"
  işaretliyse `kalici`, ikisi de değilse `oturum`. Önce iki depodaki `ee_token` silinir; `kalici` ise `localStorage`'a,
  `yok` değilse `sessionStorage`'a yazılır; `ee_kip` ve `ee_hatirla` yazılır. Gizli sekmede yazılamazsa sessizce geçer.
- `tokenYenile(yeni, eski)` — portal değişince (sol menüdeki Portallarım, `08c-kisilikler.js` `oturumuDegistir`) yeni
  anahtar eskisinin yerine. Kip bu sekmenin `ee_kip`'idir (yoksa tahmin edilir: hatırlanan eskiyse `kalici`, sekmede anahtar
  varsa `oturum`, yoksa `yok`). `yok` kipinde yeni anahtar hiçbir yere yazılmaz (sekmedeki eskisi de silinir). Hatırlanan
  (`localStorage`) anahtara yalnız bu sekmenin eski anahtarıysa dokunulur (kip `kalici` ise yenisiyle değişir, değilse
  silinir); kip `kalici` ve hiç hatırlanan anahtar yoksa yenisi yazılır. Başka sekmede "beni hatırla" ile açılmış hesabın
  anahtarı ezilmez.
- `tokenOku()` — önce sekmeninki (`sessionStorage`), yoksa hatırlanan (`localStorage`). Açılışta `26-baslat.js` kullanır.
- `tokenSil(eski)` — çıkışta: sekmenin anahtarı ve `ee_kip` silinir; hatırlanan anahtar yalnız `eski`'ye eşitse silinir.

### Giriş kimliği sekmesi

- `kayanGuncelle(kap)` — kayan sekmeli bir kutudaki (`.kayan-sekme`) düğmelerin `aria-selected`'ını yazar ve seçili
  düğmenin sırasını CSS değişkeni `--sira` olarak kutuya koyar; işaret (`.kayan-isaret`) oraya kayar. Hem "Giriş Yap / Hesap
  Aç" hem "Kullanıcı adı / E-posta" sekmesi bununla çalışır.
- `girisKimlik` — `'kadi'` ya da `'eposta'`.
- `girisKimlikAyarla(tur, odakla)` — sekmeyi değiştirir, seçimi `tercihYaz('giris_turu')` ile bu tarayıcıda hatırlar, kutunun
  etiketini, `type`'ını (`email`/`text`), `autocomplete`'ini (`email`/`username`), `inputmode`'unu ve yer tutucusunu
  ayarlar. Kullanıcı adı sekmesinde ve okul sayfasındaysak (`S.okulAdresi`) ipucu "Okulun verdiği kullanıcı adı; çoğu zaman
  T.C. kimlik numaran." Kutudaki eski hatayı siler (`alanTemizle`).

### Doğrulayıcılar (sunucudakilerin eşleri)

Hepsi yazarken ya da göndermeden önce hatayı kutunun altında hemen göstermek için; asıl denetim sunucudadır
([../../../sunucu/ortak.md](../../../sunucu/ortak.md)).

- `EPOSTA_DESENI` — `/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/` (sunucununkinden gevşek; Dikkat'e bak).
- `sifreKurallari(s)` → `{ uzun, harf, buyuk, kucuk, rakam, ozel }` (her biri `true`/`false`; Türkçe harfler harf sayılır;
  "özel" = harf, rakam ve boşluk dışındaki her şey).
- `sifreSorunuTR(s, guclu)` → `''` ya da Türkçe ileti. Hep: boşsa "Bir şifre belirle.", 8'den kısaysa "Şifre en az 8 karakter
  olmalı.". `guclu` değilse (öğrenci, servisçi) bir harf ve bir rakam yeter; `guclu` ise eksikler tek cümlede: "Şifrede bir
  büyük harf, bir özel karakter (! ? . * gibi) olmalı.".
- `gucluSifreli(u)` — öğrenci ve servisçi dışında herkes (ve `u` yoksa) güçlü kurala tabi. Okul rolündeki bir yetişkinin
  şifresi yetişkin hesabınındır, o da güçlüdür.
- `sifreKuralListesi(id, guclu)` — şifre kutusunun altındaki `<ul class="sifre-kurallar">` (güçlüde 5 satır: 8 karakter,
  büyük, küçük, rakam, özel; zayıfta 3 satır: 8 karakter, harf, rakam). Her satırın `data-kural`'ı `sifreKurallari`'nın bir
  anahtarı.
- `sifreKurallariniIsaretle(kutuId, listeId)` — karşılanan satırlara `tamam` sınıfı (yeşil tik).
- `kullaniciAdiSorunuTR(ad)` — 3–30 karakter, Türkçe harf yok ("ç yerine c…"), harfle başlar, yalnız harf, rakam, nokta,
  alt çizgi. Büyük/küçük harf fark etmez.
- `tcSorunuTR(tc)` — boşsa sorun yok (isteğe bağlı); 11 hane, 0 ile başlamaz, 10. ve 11. haneler resmî algoritmayla tutmalı.
  Yazım hatasını yakalar, numaranın gerçekten var olduğunu değil.

### Kişi kodu (öğrencininki veli kodudur)

Kod 16 karakterdir; büyük harf, küçük harf, rakam ve `! ? # * + =` işaretlerinden her birinden en az biri; ilk karakter
harf; birbirine karışan karakterler yok (büyük `I L O`, küçük `l o`, `0` ve `1`). Harf duyarlıdır. Ekranda 4'erli dört grup,
arada tire: `Ab3#-kQx9-+mPt-7?zR` (bu örnek uydurmadır). Tire kodun karakteri değil, ayırıcıdır.

- `KISI_KODU_UZUNLUK` — 16.
- `KISI_KODU_AYIRICI` — ayırıcı sayılan her şey: boşluklar (bölünmez ve dar boşluk dahil), tire ve kopyalanınca tire kılığına
  giren benzerleri (U+2010–U+2015, U+2212 eksi, U+FE63, U+FF0D), görünmez karakterler (U+00AD yumuşak tire, U+200B–U+200D,
  U+2060, U+FEFF). Sunucudaki `ortak.js` ve Android'deki `KisiKodu.java` ile aynı küme.
- `kisiKoduSade(kod)` — ayırıcıları siler (tireli, tiresiz, boşluklu yapıştırma aynı koda iner).
- `kisiKoduBicim(kod)` — 4'erli tireli biçim (sonda tire kalmaz).
- `KISI_KODU_KARAKTER` — koddaki karakterlerin düzenli ifade sınıfı (`A-HJKMNP-Za-km-np-z2-9!?#*+=`).
- `KISI_KODU_GECERLI` — geçerli bir kodun deseni (sunucudaki `KISI_KODU_DESENI`'nin aynısı).
- `kisiKoduAyikla(metin)` — yapıştırılan metnin içindeki TAM kodu bulur ("Veli kodu: Ab3#-…" içinden yalnız kod). Önce
  sadeleştirilmiş metin tam 16 karakterse ve geçerliyse o; değilse sırayla ekrandaki tireli biçim, başka ayırıcılarla 4'erli
  gruplar, 16 bitişik karakter aranır; adayın iki yanında kod karakteri olmamalı ve aday geçerli olmalı. Yoksa `''`.
- `kisiKoduKutusu(kod, id, buyuk, ekDugme)` — kodu gösteren satır: `<code class="kisi-kodu">` (tireli) + "Kopyala" düğmesi
  (`data-act="kod-kopyala"`, `data-kod` tireli biçim; tıklamayı `25-tiklama.js` karşılar, panoya kopyalar). `id` verilirse kod
  sonra `kisiKoduYenile` ile değişir; `buyuk` "+ Ekle" penceresindeki iri gösterim; `ekDugme` Kopyala'nın yanına konacak
  hazır HTML (ör. "Yeni kod üret").
- `kisiKoduYenile(id, kod)` — o satırdaki kodu ve Kopyala'nın `data-kod`'unu değiştirir.
- `kisiKoduGirdisi(id, etiket)` — kod yazılan kutu: `class="kisi-kodu-girdi"`, `maxlength="19"` (16 karakter + 3 tire),
  telefon klavyesi büyük harf yapmasın, düzeltmesin diye `autocapitalize/autocorrect/spellcheck` kapalı, yer tutucu
  örnek kod; `etiket` verilirse `aria-label`.
- `kisiKoduDenetle(deger, ad)` — boşsa "<ad>nu yaz." (varsayılan ad "Kişi kodu" → "Kişi kodunu yaz."), 16 karakter
  değilse "<ad> 16 karakterdir."; geçerlilik desenine bakmaz (onu sunucu yapar).

**Kod kutusu davranışı** (sayfadaki HER `.kisi-kodu-girdi` kutusu için; dinleyiciler dosya yüklenince `document`'a bir kez
takılır, kutu sonradan eklense de çalışır):

- `kisiKoduKutusuMu(el)` — `INPUT` ve `kisi-kodu-girdi` sınıflı mı.
- `kisiKoduImlecYeri(adet)` — `adet` kod karakterinin ardı biçimli metinde kaçıncı yer (araya giren tireler sayılır).
- `kisiKoduKutuYaz(kutu, sade, once)` — sade kodu 16'ya kırpar, biçimli yazar (değişmediyse dokunmaz), `_kisiKoduOnceki`'ni
  saklar, kutu odaktaysa imleci `once` kod karakterinin ardına koyar.
- `kisiKoduKutuDuzenle(kutu, tur)` — `input` olayında: imleçten önceki kod karakterleri sayılır, yeni biçimde aynı yere
  konur. Yalnız bir TİRE silindiyse (geri tuşu tirenin hemen ardında ya da Delete hemen önünde) tirenin yanındaki karakter de
  silinir; yoksa tire hemen geri gelir ve silme işe yaramazdı.
- `kisiKoduDuyur(kutu)` — biçimleyince yapay bir `input` olayı yollar: kutuyu dinleyen öteki kodlar (hata silme, "Bul"
  sonucunu temizleme) değişikliği duysun.
- Dinleyiciler: `focusin` (kutunun o anki değerini "önceki" olarak kaydeder, birleştirme bayrağını indirir); `input` YAKALAMA evresinde (öteki dinleyiciler
  biçimlenmiş değeri görsün; telefon klavyesi harfleri birleştirerek yazarken — `isComposing` — dokunulmaz, yoksa harfler
  çoğalır); `compositionstart`/`compositionend` (birleştirme bitince bir kez biçimlenir; Chrome son `input`'u bundan önce,
  Firefox ve Safari sonra gönderir); `paste` (yapıştırma burada yapılır ki 19 karakter sınırı yapıştırılanın sonunu kesmesin:
  metinde tam kod varsa kutuda yalnız o kalır; yoksa yapıştırılan, seçimin yerine sade olarak eklenir; pano okunamazsa
  tarayıcı yapıştırır, `input` biçimler).

### Okul araması için

- `aramaSadeTR(m)` — sunucudaki `okullar.js` `aramaSade`'nin harfi harfine aynısı ([../../../sunucu/okullar.md](../../../sunucu/okullar.md)):
  `ı İ I` → `i`, aksanlar düşer, küçük harf, harf/rakam dışı her şey boşluk. "M.Akif", "MEHMET AKİF" aynı kelimelere ayrılır.
- `aramaVurgula(ad, kelimeler, vurgu)` — sonuç listesinde okul adının tutan yerini `<mark>` ile koyulaştırır (her parça
  `esc`'li). Sunucu `vurgu` dizisi (adın kelime sıraları) verdiyse o kelimeler bütünüyle (yanlış yazılıp düzeltilen kelime de
  görünsün); vermediyse sorgunun her kelimesinin, adın kelimelerinin sadeleştirilmiş BAŞINDA geçtiği kadarı.

### Düğme bekletme

- `dugmeBekle(b, metin)` — düğmenin ilk yazısını `data-yazi`'ye saklar (yalnız ilk seferde), düğmeyi kilitler, `bekliyor`
  sınıfı ekler, yazısını "Kaydediliyor..." gibi `metin` yapar.
- `dugmeBitir(b)` — kilidi açar, sınıfı kaldırır, `data-yazi`'deki yazıyı geri koyar. İkisi de `b` yoksa bir şey yapmaz.

### Doğrulama sorusu ("robot değilim")

- `botSoru`, `girisSoru` — `{ id, yukleniyor }`: kayıt ve giriş formlarının o anki sorusu. (Şifremi unuttum'unki `authKur`
  içinde, `sifreSoru`.)
- `botSoruYukle()`, `girisSoruYukle()` — `GET /api/challenge` → soru metni etikete, kimlik saklanır, cevap kutusu boşalır;
  hata → "soru alınamadı". Yükleme sürerken gelen ikinci çağrı hiçbir şey yapmaz (hemen biten bir söz döner; süren
  yüklemeyi beklemez). Şifremi unuttum'daki `sifreSoruYukle`'de bu koruma yoktur.
- `girisSoruGoster(goster)` — girişteki soru alanı (`.bot-alan`) başta gizli; sunucu "soru gerekli" deyince açılır (açılırken
  sorusu yoksa yükler).

### Köprüler

- `kayitAlanHatasi(alan, mesaj)` — başta boş işlev; `authKur` doldurur. E-postadaki onay bağlantısı hesabı açamadıysa
  (kullanıcı adı ya da T.C. bu arada başkasına geçti) `26-baslat.js` bununla kayıt kartını açıp iletiyi ilgili kutunun altına
  yazar.
- `authKur` ayrıca `25-tiklama.js`'te tanımlanan `yeniSifreEkraniAcDisaridan`'ı doldurur ve `yeniSifreAnahtar`'ı yazar:
  sayfa sıfırlama bağlantısıyla açıldığında `26-baslat.js` "Yeni şifreni belirle" ekranını bu köprüyle açar.

### `authKur()` — kartı kurar (açılışta bir kez, `26-baslat.js`)

Tanımladığı iç işlevler ve bağladığı olaylar:

- **Sekme geçişi:** `sekmeGec(gosterilecek, gizlenecek, sekmeAc, sekmeKapa, sonra)` — sekmeyi işaretler (`kayanGuncelle`),
  adresi `/login` ↔ `/signup` yapar (`sekmeAdresiYaz`, [05a-dis-sayfalar.md](05a-dis-sayfalar.md)), "Okulunu seç" alanını
  kayıtta ve okul sayfasında gizler, üstteki iletiyi siler; eski formu 140 ms'de soldurup yenisini 240 ms'de kaydırarak
  getirir (`form-cikis`, `form-giris`). "Hareketi azalt" açıksa animasyonsuz. Geçiş sürerken ikinci tıklama yok sayılır.
  `girisSekmesi(sonra)`, `kayitSekmesi(sonra)` (kayda geçince soru yoksa yükler). `#tabGiris`, `#tabKayit`, `#gKimlikKadi`,
  `#gKimlikEposta` tıklamaları; açılışta son seçilen kimlik türü; kullanıcı adı sekmesinde `@` yazılırsa e-posta sekmesine
  geçip yazılanı korur. Yenile düğmeleri (`#kBotYenile`, `#gBotYenile`, `#sBotYenile`).
- **Hata iletisindeki kısa yollar** (`EYLEMLER`, düğmeleri `alanHatasi`'nın ek HTML'i olarak çıkar):
  - `giristen-kayda` — "Kayıt ol": kayıt sekmesine geçer, girişte yazılanı (içinde `@` varsa e-postaya, yoksa küçük harfle
    kullanıcı adına; doluysa dokunmadan) taşır, Ad kutusuna odaklanır.
  - `kayittan-girise` — "Giriş yap": giriş sekmesine, e-posta kimliğine geçer, kayıtta yazılan e-postayı koyar, şifreye odaklanır.
  - `hata-sifremi-unuttum` — "Şifremi unuttum" ekranını açar.
  - `giristen-okul-sec` — "Okulunu bul": `siteGit('/login')` ile giriş sayfasına döner, okul arama kutusuna odaklanır.
- **İl ve branş listesi:** `GET /api/meta` → `S.meta` (hata sessiz).
- **Kayıt kutuları yazarken:** şifre kuralları canlı yeşile döner (`sifreKurallariniGoster`, `#kSifreKural`); kullanıcı adında
  `İ` → `i`, büyük harf küçüğe, boşluk noktaya döner (imleç yerinde kalır); T.C. kutusunda yalnız rakam, en çok 11.
- **"Beni hatırla" ile "Bilgilerimi bu cihaza kaydetme" birbirini dışlar** (biri işaretlenince öteki kalkar).
- **Şifremi unuttum:**
  - `sifreSoru`, `sifreSoruYukle()` — bu ekranın sorusu.
  - `authPanel(hangi)` — `formGiris`, `formKayit`, `kodEkran`, `sifreEkran`, `yeniSifreEkran` panellerinden yalnız birini
    gösterir; üstteki "Giriş Yap / Hesap Aç" sekmeleri yalnız giriş ve kayıtta görünür.
  - `sifreEkraniAc()` — girişte e-posta yazılmışsa onu taşır, soru yükler.
  - `yeniSifreEkraniAc(anahtar)` — `yeniSifreAnahtar`'ı yazar, iki şifre kutusunu boşaltır.
  - `girisEkraninaDon()` — anahtarı unutur, adresteki `#…yeni-sifre…` kısmını siler (sıfırlama anahtarı adres çubuğunda
    kalmasın), giriş paneline döner, şifre kutusunu boşaltır.
  - `#formSifreUnuttum` gönderilince: boş e-posta, `@`'suz yazı ("Buraya kullanıcı adı değil e-posta adresi yazılır. E-postası
    olmayan hesaplarda şifreyi okul yönetimi yeniler."), bozuk adres, boş soru cevabı kutunun altında; sonra
    `POST /api/sifre-unuttum { email, challengeId, challengeAnswer }`. Başarıda giriş ekranına dönüp sunucunun iletisini
    yeşil gösterir (hesap var mı yok mu belli etmeyen aynı cümle). Hata: `alan: 'email'` → e-posta kutusu; iletide
    "doğrulama" geçiyorsa → soru kutusu; değilse üstte; her hatada yeni soru gelir.
  - `#formYeniSifre` gönderilince: `sifreSorunuTR(s1)` (ZAYIF kural; Dikkat'e bak) ve iki şifre aynı mı; sonra
    `POST /api/sifre-yenile { token, password }`. Başarıda giriş ekranı + yeşil ileti; hata üstte.
- **İki adımlı giriş:**
  - `kodDurum` — `{ id, sayac }`: bekleyen kodun kimliği ve geri sayım.
  - `kodEkraniAc(d)` — kod panelini açar, sunucunun `mesaj`'ını (kodun nereye gönderildiğini söyleyen cümle; yoksa "Giriş
    kodunu gir.") yazar, 60 sn sayaç.
  - `kodEkraniKapat()` — sayacı durdurur, giriş paneline döner, şifreyi boşaltır.
  - `tekrarSayaciBaslat(saniye)` — düğme kilitlenir, "Tekrar gönder (60)", "(59)"… saniyede bir azalır; 0'da "Kodu tekrar
    gönder" basılır olur (sunucu da 60 sn uygular).
  - `oturumuAc(d)` — `S.token`, `tokenSakla`, `S.user`, `S.children`, `S.kapali` (kapalı özellikler), `portalDurumuAl(d)`;
    hesap `pending` ise (yedek denetim; sunucu bunu ilk adımda durdurur) anahtarı siler, "Hesabın henüz onaylanmadı…" der.
    Değilse `girisSonrasi(d)` ([05b-sifre-zorunlu.md](05b-sifre-zorunlu.md)).
  - `#formGiris` gönderilince: boş kimlik ("E-posta adresini yaz." / "Kullanıcı adını yaz."), e-posta sekmesinde bozuk adres,
    boş şifre, soru açıksa boş cevap kutunun altında; sonra `POST /api/login { kimlik, password, okul (okul sayfasındaysak
    kısa adı), challengeId, challengeAnswer }`. Cevap `twoFactor` ise kod ekranı, değilse `oturumuAc`. Hatalar:
    - `okulSec` (aynı kullanıcı adı birden çok okulda) → kimlik kutusunun altında ileti + "Okulunu bul";
    - `alan: 'kimlik'`/`'email'` → kimlik kutusu; `hesapYok` ise ve okul sayfasında DEĞİLSEK "Kayıt ol" (okul sayfasında
      önerilmez: öğrenci hesabını okul açar);
    - `alan: 'sifre'` → şifre kutusu + "Şifremi unuttum", şifre seçili hâlde odak;
    - `alan: 'bot'` → soru kutusu;
    - başka (kilit, kapatılmış hesap) → üstte; `bekliyor` (onay bekleyen hesap) `bilgi` türünde, öteki `hata` türünde ileti;
    - `soruGerekli` → soru alanı açılır, taze soru gelir.
  - `#formKod` gönderilince: 6 rakam değilse "Kod 6 rakamdan oluşmalı."; `POST /api/login/dogrula { challengeId, code }` →
    `oturumuAc`. Hata iletisinde "bulunamadı", "baştan" ya da "süresi doldu" geçiyorsa giriş kartına döner (baştan giriş
    gerekir); değilse ileti kod kutusunun altında, kutu boşalır.
  - `#kodTekrar` — `POST /api/login/tekrar { challengeId }` → yeni kimlik, yeni ileti, "Yeni kod gönderildi.", sayaç yeniden.
  - `#kodVazgec` — giriş kartına döner.
  - `#kodGiris` yazarken yalnız rakam, en çok 6; 6. rakamda form kendiliğinden gönderilir.
- **Kayıt:**
  - `KAYIT_ALANLARI` — sunucunun `alan`'ı → kutu: `bot` `kBot`, `ad` `kAd`, `kullaniciAdi` `kKullaniciAdi`, `email` `kEmail`,
    `sifre` `kSifre`, `kvkk` `kKvkk`, `telefon` `kTelefon`, `tc` `kTc`.
  - `kayitAlanHatasi` burada doldurulur: kayıt sekmesine geçip iletiyi kutunun altına yazar (kutu yoksa üstte).
  - `kayitGovdesi()` → `{ fullName: ad + ' ' + soyad, username (küçük harf), email, password, phone (telefonOku), tc,
    address, kvkkOnay, challengeId, challengeAnswer }`.
  - `kayitDenetle(body)` — sunucuya gitmeden aynı kurallarla, hatalar hepsi birden kutuların altında: ad, soyad, kullanıcı adı,
    e-posta, güçlü şifre, telefon (`telefonSorunuTR`, [04c-telefon.md](04c-telefon.md)), T.C., soru cevabı, aydınlatma onayı
    ("Devam etmek için aydınlatma metnini onaylaman gerekiyor.").
  - `kayitBasarili(d, kullaniciAdi)` — formu sıfırlar, yeni soru alır. `d.onayGerekli` ise (bugün hep öyle) "E-postanı
    kontrol et." kutusu ve sunucunun iletisi, kart ortalanır; değilse giriş sekmesine geçip kullanıcı adını yazar.
  - `#formKayit` gönderilince: `kayitDenetle`; sonra `POST /api/register`. Hata `alan`'ı bir kutuya denk geliyorsa orada
    (e-posta "kayıtlı" ise yanında "Giriş yap"), değilse üstte. Soru yalnız `alan: 'bot'` ya da `yeniSoru` (T.C. çakışması
    soruyu harcadı) gelince yenilenir; başka bir kutu hatalıysa aynı soru geçerli kalır.

## Kimle konuşur?

- Çağırdığı başka parçalar (hepsi aynı IIFE'de, [../../../sunucu/http.md](../../../sunucu/http.md) `birlesikOku`):
  - [01-yardimcilar.md](01-yardimcilar.md) — `$`, `esc`, `api`, `EYLEMLER`, `tercihOku`, `tercihYaz`;
  - [03-mesaj-modal.md](03-mesaj-modal.md) — `mesajGoster`;
  - [04a-form-alanlari.md](04a-form-alanlari.md) — `alanHatasi` (üçüncü argümanla kutunun altına düğme), `alanTemizle`,
    `formHatalariniSil`, `ilkHatayaGit`;
  - [04c-telefon.md](04c-telefon.md) — `telefonOku`, `telefonSorunuTR`;
  - [00-durum.md](00-durum.md) — `S.token`, `S.user`, `S.children`, `S.kapali`, `S.meta`; `S.okulAdresi` ([05a-dis-sayfalar.md](05a-dis-sayfalar.md) yazar);
  - [05a-dis-sayfalar.md](05a-dis-sayfalar.md) — `siteGit`, `sekmeAdresiYaz`;
  - [05b-sifre-zorunlu.md](05b-sifre-zorunlu.md) — `girisSonrasi`;
  - `08c-kisilikler.js` — `portalDurumuAl`;
  - `25-tiklama.js` — `yeniSifreAnahtar` ve `yeniSifreEkraniAcDisaridan` orada `var` ile tanımlı, burada yazılır;
    `kod-kopyala` düğmesini orası karşılar.
- Sunucu uçları — hepsi [../../../sunucu/bolumler/kayit.md](../../../sunucu/bolumler/kayit.md) (yanıt biçimleri, hız sınırları ve
  kilitler orada): `GET /api/challenge`, `GET /api/meta`, `POST /api/login`, `POST /api/login/dogrula`,
  `POST /api/login/tekrar`, `POST /api/register`, `POST /api/sifre-unuttum`, `POST /api/sifre-yenile`. Bunlar girişsiz
  uçlardır (aydınlatma kapısından serbest, [../../../sunucu/api.md](../../../sunucu/api.md)).
- Bu dosyadakileri kullananlar:
  - `26-baslat.js` — `authKur` (açılışta), `tokenOku`, `tokenSil`, `girisKimlikAyarla` (onay bağlantısından sonra kullanıcı
    adını kutuya koymak için), `kayitAlanHatasi`, `yeniSifreEkraniAcDisaridan`;
  - [05a-dis-sayfalar.md](05a-dis-sayfalar.md) — `girisKimlik`, `girisKimlikAyarla` (okul başlığı çizilince), `aramaSadeTR`,
    `aramaVurgula` (okul araması);
  - [05b-sifre-zorunlu.md](05b-sifre-zorunlu.md) — `sifreSorunuTR`, `gucluSifreli`, `sifreKuralListesi`,
    `sifreKurallariniIsaretle`, `dugmeBekle`, `dugmeBitir`;
  - `08c-kisilikler.js` — `tokenYenile`, `kisiKoduSade`, `kisiKoduKutusu`, `kisiKoduYenile`, `kisiKoduGirdisi`, `kisiKoduDenetle`;
  - `10b-hesaplar.js` — `EPOSTA_DESENI`, `sifreSorunuTR`, `gucluSifreli`, `kullaniciAdiSorunuTR`, `tcSorunuTR`, kişi kodu
    işlevlerinin çoğu;
  - `23-veli-ayarlar.js` — `EPOSTA_DESENI`, `gucluSifreli`, `sifreKuralListesi`, `sifreKurallariniIsaretle`,
    `kullaniciAdiSorunuTR`, `kisiKoduKutusu`, `kisiKoduGirdisi`;
  - `25-tiklama.js` — `sifreSorunuTR`, `gucluSifreli` (Ayarlar'daki şifre değiştirme), `kisiKoduSade`, `kisiKoduDenetle`
    (veli kodu bağlama);
  - `10-mudur.js`, `10a-giris-bilgisi.js`, `15-aktarim.js` — `kisiKoduBicim`;
  - `08b-rolsuz.js` — `aramaSadeTR`, `aramaVurgula`; `16b-okul-ayarlari.js`, `18b-etut.js` — `aramaSadeTR`;
  - yönetim paketi (`public/js/yonetim/`, yalnız `/admin/yonetim.js`'e girer): `09-yonetici.js` (`kisiKoduSade`,
    `kisiKoduGirdisi`, `kisiKoduDenetle`, `aramaSadeTR`), `09b-site-ayarlari.js` (`aramaSadeTR`);
  - `dugmeBekle`/`dugmeBitir` — 27 parça: `04b`, `05b`, `08c`, `10`, `10a`, `10b`, `11`, `14c`, `15`, `16b`, `16c`, `18b`,
    `19`, `19b`, `19c`, `19e`, `19f`, `19g`, `19h`, `19i`, `22`, `23`, `27b` ve yönetimde `09`, `09b`, `09c`, `09d`.
- HTML: `public/index.html` içindeki giriş kartı — `#authWrap`, `#tabGiris`/`#tabKayit`, `#authMesaj`, `#formGiris`
  (`#gKimlikKadi`, `#gKimlikEposta`, `#gEmail`, `#gEmailEtiket`, `#gKimlikIpucu`, `#gSifre`, `#gBot…`, `#gHatirla`,
  `#gKaydetme`, `#btnSifremiUnuttum`), `#kodEkran` (`#formKod`, `#kodGiris`, `#kodAciklama`, `#kodTekrar`, `#kodVazgec`),
  `#sifreEkran` (`#formSifreUnuttum`, `#sEmail`, `#sBot…`, `#sVazgec`), `#yeniSifreEkran` (`#formYeniSifre`, `#ySifre1`,
  `#ySifre2`, `#yVazgec`), `#formKayit` (`#kAd`, `#kSoyad`, `#kKullaniciAdi`, `#kEmail`, `#kSifre`, `#kSifreKural`,
  `#kTelefon`, `#kTc`, `#kAdres`, `#kBot…`, `#kKvkk`), `#okulSecAlan`.
- CSS: `public/css/parcalar/01-giris-kayit.css` (`.auth-wrap`, `.auth-card`, `.tabs`), `16-giris-sekme.css` (`.form-cikis`,
  `.form-giris`, hareketi azaltınca kapalı), `28-yetiskin-hesap.css` (`.kayan-sekme`, `.kayan-isaret` ve `--sira`;
  `.kisi-kodu`, `.kisi-kodu-satir`, `.buyuk`, `.kisi-kodu-dugmeler`, `.kisi-kodu-girdi`), `09-kayit-ekrani.css`
  (`.bot-satir`, `.bot-soru`, `.sifre-kurallar` ve `li.tamam`, `.kod-baslik`, `.kod-kutu`, `.kod-alt`), `02-form.css`
  (`.btn.bekliyor`, `.alan-hata .baglanti`, `.hatali`); `aramaVurgula`'nın `<mark>`'ı `29-dis-sayfalar.css`'te
  (`.vitrin-okul-ad mark`, giriş sayfasındaki okul araması) ve `09-kayit-ekrani.css`'te (`.okul-satir mark`, `08b-rolsuz.js`).
  `.bot-alan` ve `.onay-bekliyor` için ayrı kural yok (yalnız kancadır).
- Rol: kartı girişsiz ziyaretçi görür (her rol buradan girer). Ortak aletleri giriş yapmış herkesin ekranları kullanır.
- Android uygulaması bu dosyayı kullanmaz; aynı uçları kendi giriş sayfalarıyla çağırır (kayit.md'de listeli).

## Nasıl çalışır (adım adım)?

### Açılış

```
app.js yüklenir ─► kişi kodu kutusu dinleyicileri document'a takılır (focusin, input, composition*, paste)
26-baslat.js ─► authKur(): sekmeler, formlar, EYLEMLER kısa yolları, /api/meta
             ─► disSayfalariKur (05a) ─► kayıtlı anahtar varsa /api/me, yoksa giriş kartı
```

### Giriş

```
#formGiris gönder ─► istemci denetimi (boş kimlik/şifre, e-posta biçimi, açıksa soru)
   POST /api/login { kimlik, password, okul?, challengeId, challengeAnswer }
     ├ hata ─► ilgili kutunun altında ileti (+ Kayıt ol / Şifremi unuttum / Okulunu bul)
     │          soruGerekli ─► soru alanı açılır, yeni soru
     ├ { twoFactor, challengeId, mesaj } ─► kod ekranı, 60 sn sayaç
     │      6 rakam yazılınca ─► POST /api/login/dogrula { challengeId, code }
     │          ├ hata ─► kutunun altında (ya da "baştan giriş" ise karta dön)
     │          └ { token, user, … } ─┐
     └ { token, user, … } (öğrenci / e-postasız) ─┤
                                                  ▼
                   oturumuAc: S.token, tokenSakla (kip), S.user, portallar ─► girisSonrasi (05b)
                   (yönetime geçiş (yalnız yönetici) ─► KVKK onayı ─► zorunlu şifre ─► uygulama)
```

### Kayıt

```
#formKayit gönder ─► kayitDenetle (hepsi birden, kutuların altında)
   POST /api/register ─► { onayGerekli, message } ─► "E-postanı kontrol et."
   kişi postadaki bağlantıya tıklar ─► 26-baslat.js POST /api/eposta-onay
        ├ açıldı ─► giriş kartında kullanıcı adı dolu, yeşil ileti
        └ kullanıcı adı / T.C. bu arada alındı ─► kayitAlanHatasi(alan, ileti)
```

### Şifremi unuttum

```
"Şifremi unuttum" ─► sifreEkraniAc ─► POST /api/sifre-unuttum ─► her durumda aynı cümle
postadaki bağlantı (#/yeni-sifre?t=<64 hane>; anahtar # kısmında, sunucuya gitmez)
   ─► 26-baslat.js: S.genelGiris, yeniSifreEkraniAcDisaridan(anahtar)
   ─► POST /api/sifre-yenile { token, password } ─► girisEkraninaDon (adresteki anahtar silinir)
```

### Kişi kodu kutusuna yazmak

```
"Ab3#k" yazıldı   ─► input (yakalama) ─► sade "Ab3#k", imleçten önce 5 ─► "Ab3#-k", imleç 6
geri tuşu tire ardında ─► tek tire silindi ─► tireden önceki karakter de silinir
"Veli kodu: Ab3#-kQx9-+mPt-7?zR" yapıştırıldı ─► paste ─► kisiKoduAyikla ─► kutuda yalnız kod ─► kisiKoduDuyur
telefon klavyesi birleştirirken ─► dokunma ─► compositionend ─► bir kez biçimle
```

## Dikkat!

- **Şifre sıfırlamada ön yüz zayıf kuralla bakar.** `#formYeniSifre` `sifreSorunuTR(s1)`'i `guclu` olmadan çağırır (8 karakter
  + harf + rakam) ve ekrandaki yazı da "En az 8 karakter, harf ve rakam içermeli." der; sunucu ise hesabın kuralını uygular
  (`gucluSifreli(u)`): e-postası olan hesaplar çoğunlukla yetişkin hesabı olduğu için büyük harf, küçük harf, rakam ve özel
  karakter ister. "abcd1234" yazan bir veli istemciden geçer, sunucudan "Şifrede bir büyük harf, bir özel karakter … olmalı"
  alır; ileti kutunun altında değil kartın üstünde görünür. Anahtar harcanmadığı için yeniden denenebilir. Kod değiştirilmedi.
- **İstemcideki e-posta deseni sunucununkinden gevşek.** Burada `@` ve boşluk dışındaki her karakter geçer; sunucunun
  deseni yalnız ASCII kabul eder. Türkçe harfli bir adres ("ayşe@…") ön yüzden geçer, sunucu reddeder (kayıtta ileti yine
  e-posta kutusunun altında).
- **Ön yüz doğrulayıcıları "aynısı" ama birebir değil.** `sifreSorunuTR` sunucunun 200 karakter üst sınırına bakmaz;
  `kullaniciAdiSorunuTR` sunucu gibi NFKC ve görünmez karakter temizliği yapmaz (tam genişlikli "ａ" gibi ender girdiyi ön yüz
  reddeder, sunucu kabul ederdi). Sunucudaki kuralı değiştirirsen ([../../../sunucu/ortak.md](../../../sunucu/ortak.md): `sifreSorunu`,
  `kullaniciAdiSorunu`, `tcSorunu`, `KISI_KODU_DESENI`, ayırıcı kümesi; [../../../sunucu/okullar.md](../../../sunucu/okullar.md):
  `aramaSade`) buradakini de değiştir; kişi kodunun ayırıcı kümesi Android'deki `KisiKodu.java`'da da var.
- **`ee_hatirla` yazılıyor ama okunmuyor.** `tokenSakla` son girişin kipini `localStorage`'a yazar; depoda onu okuyan kod yok
  (yalnız `araclar/gezinti.js` ekran turu da yazıyor). Zararsız ama ölü; kaldırılacaksa turu da düzelt.
- **"Beni hatırla" başta işaretli** (`public/index.html`). Okulun ortak bilgisayarında kutuyu kaldırmayan kişinin anahtarı
  tarayıcı kapansa da kalır (sunucuda tarayıcı oturumu 7 gün). Ortak bilgisayar için planlı bir iş var (Son durum).
- **Anahtar sekmeye özeldir.** `tokenOku` önce `sessionStorage`'a bakar; böylece aynı tarayıcıda farklı sekmelerde farklı
  hesaplar açık kalır. Buna dokunursan `tokenYenile` ve `tokenSil`'in "başkasının hatırlanan anahtarına dokunma" kuralını
  koru; `05b-sifre-zorunlu.js`'teki `ee_gecis` geçişi de bu sırayla okunur (`gecisAnahtari() || tokenOku()`).
- **Kod ekranı sunucunun cümlelerine bakıyor.** `#formKod` "baştan giriş gerekir" kararını iletide "bulunamadı",
  "baştan" ya da "süresi doldu" geçmesine göre verir (bugünkü iletiler: "Giriş oturumu bulunamadı…", "Kodun süresi doldu…",
  "Çok fazla hatalı kod denemesi. Baştan giriş yap", "Hesap bulunamadı"; hepsi `sunucu/guvenlik.js` `girisKoduDogrula`'da).
  Sunucudaki cümleyi değiştirirsen burası sessizce bozulur. Aynı şekilde şifremi unuttum'da "doğrulama" sözcüğü soru
  kutusunu seçer.
- **"Kodu tekrar gönder" hatasında ekran kalır.** `#kodTekrar` hata alınca iletiyi üstte gösterip düğmeyi hemen açar; sunucu
  "Giriş oturumu bulunamadı, baştan giriş yap" dese de kod ekranı açık kalır, 429 ("N saniye sonra…") gelse de geri sayım
  yeniden başlamaz. Kişi "← Geri dön"e basmalı. Kod değiştirilmedi.
- **`kayitBasarili`'nin `onayGerekli` olmayan kolu bugün çalışmaz:** sunucu her başarılı kayıtta `onayGerekli: true` döner.
  Eski akışın (hesabın hemen açıldığı) yedeği olarak duruyor.
- **`dugmeBekle` düğmenin içini `textContent` ile yazar:** düğmedeki simge (SVG) silinir ve `dugmeBitir` yalnız yazıyı geri
  getirir. `data-yazi` yalnız ilk çağrıda saklanır; düğmenin yazısını sonradan kodla değiştirirsen bir sonraki `dugmeBitir`
  eski yazıyı geri koyar. Simgeli ya da yazısı değişen düğmede kullanırken bunu hesaba kat.
- **Test bu dosyanın iki yorum satırına dayanır.** `testler/test-kisi-kodu.js` kişi kodu bölümünü "`/* Kişi kodu (öğrencininki
  veli kodudur)`" ile "`/* Sunucudaki okul aramasıyla aynı sadeleştirme`" yorumları arasından kesip çalıştırır. Bu iki yorumu
  değiştirir ya da aralarına başka parçaya bağımlı kod koyarsan test "bölüm bulunamadı" der ya da çöker.
- **Kod kutusu dinleyicileri bütün sayfada ve yakalama evresindedir.** Yeni bir kod kutusu yaparken `kisiKoduGirdisi`'ni kullan
  (sınıf adı yeter); kendi `input` dinleyicin biçimlenmiş değeri görür. `maxlength` 19'dur (16 karakter + 3 tire); kutuya
  yazılan fazlası `kisiKoduKutuYaz`'da 16 karaktere kırpılır, yapıştırma ise bu dosyada ayrıca işlenir.
- **Köprü değişkenlerin sırası önemli.** `yeniSifreEkraniAcDisaridan` ve `yeniSifreAnahtar` `25-tiklama.js`'te `var` ile
  başlangıç değeri alır; `authKur` ise onları `26-baslat.js`'ten çağrıldığında yazar. `authKur` daha önce (25'ten önce bir
  parçada) çağrılsaydı 25'in başlangıç değeri yazılanı ezerdi.
- **Hesap yok / şifre yanlış ayrı söylenir** (sunucunun bilinçli kararı, kayit.md'de); "Kayıt ol" kısa yolu okul
  sayfasında gösterilmez, çünkü okul sayfasından girenlerin (öğrenci, servisçi) hesabını okul açar, kendileri kaydolmaz.
- **Sıfırlama anahtarı adresin `#` kısmındadır**, sunucu günlüklerine düşmez; `girisEkraninaDon` onu adres çubuğundan siler.
- Otomatik gönderim `new Event('submit', …)` kullanır (çok eski tarayıcıda yok); öbür yerlerde ES5 kuralı gözetilmiş
  (`['catch']`, `document.createEvent`).

## Testleri

- `testler/test-kisi-kodu.js` (sunucu gerekir; `tumtest.sh`'te) — "1b) KOD KUTUSU": bu dosyanın kişi kodu bölümünü küçük bir
  taklit belgeyle `vm`'de çalıştırır: 4'erli tireli biçim ve sunucuyla aynı sadeleştirme, Kopyala'nın tireli biçimi,
  `maxlength` 19, "16 karakterdir" uyarısı, yazarken tirenin gelmesi, 17. karakterin yazılmaması, sondan silince tirenin
  gitmesi, tirenin ardında geri tuşu ve önünde Delete, grup ortasında silme ve araya yazma (imleç yerinde), tireli / tiresiz /
  boşluklu / karışık / fazla uzun yapıştırma, metnin içinden kodu ayıklama ("Veli kodu: …"), görünmez karakterler ve tire
  benzerleri, 65 536 karakterin her birinde ön yüzle sunucunun aynı ayırıcı kararı. "1c)": telefon klavyesinin birleştirerek
  yazması (Chrome ve Firefox olay sıralarıyla).
- `testler/test-adresler.js` — bu dosyayı doğrudan denemez ama [05a-dis-sayfalar.md](05a-dis-sayfalar.md)'deki
  `okulBasligiCiz`'i çalıştırırken buradaki `girisKimlikAyarla` ve `girisKimlik` adlarını taklit eder; bu iki adı
  değiştirirsen o testin parametre listesini de değiştir.
- `testler/buton-denetimi.js` (sunucusuz) — `giristen-kayda`, `kayittan-girise`, `hata-sifremi-unuttum`,
  `giristen-okul-sec`, `kod-kopyala` düğmelerinin karşılığı var mı.
- `testler/yazim-denetimi.js` — kullanıcıya görünen Türkçe metinlerde yazım.
- Sunucu tarafı (bu dosyanın çağırdığı uçlar): `testler/test-giris-kayit.js`, `testler/test-sifre.js`,
  `testler/guvenlik-test.js`, `testler/test-okul-agi.js`, `testler/test-cakisma.js`, `testler/test-yetiskin.js` (ayrıntısı
  [../../../sunucu/bolumler/kayit.md](../../../sunucu/bolumler/kayit.md) "Testleri"nde).
- `testler/test-admin-gizli.js` — bu belgenin kendisinin (`/js/parcalar/05-giris.md`) web'den sunulmadığını (404) dener.
- Ekran turu `araclar/gezinti.js` giriş kartına yanlış şifreyle ve olmayan kullanıcıyla giriş dener (turu belgeleme işinde
  çalıştırma).
- Elle: sunucuyu 3200'de aç, `/login`'de kullanıcı adı sekmesinde `@` yaz (e-posta sekmesine geçmeli); `testler/seed.js`'teki bir
  öğretmenle yanlış şifre gir (kutunun altında ileti + "Şifremi unuttum"); doğrusuyla gir, e-posta ayarlı değilse kod sunucu
  penceresine yazılır, 6 rakamı yazınca kendiliğinden doğrular. "Hesap Aç"ta şifre yazarken kuralların yeşile döndüğünü
  gör. Kod kutusu için girişten sonra "+ Ekle" → Veli'de bir kod yapıştır.

## Son durum

- `git log`: 6 commit. Son üçü:
  - `153d63d commit 522` (2026-09-27, kişi kodu 16 hane): kod 15 → 16 karakter; ekrandaki biçim 5'erli boşluklu yerine
    4'erli tireli; tire artık kodun karakteri değil ayırıcı (`-` yerine `=` işareti); Kopyala tireli biçimi veriyor;
    `KISI_KODU_AYIRICI` (görünmez karakterler, tire benzerleri), `KISI_KODU_KARAKTER`, `KISI_KODU_GECERLI`,
    `kisiKoduAyikla` eklendi; kutu `maxlength` 20 → 19; yazarken tireleri koyan kutu davranışı (`kisiKoduKutusuMu`,
    `kisiKoduImlecYeri`, `kisiKoduKutuYaz`, `kisiKoduKutuDuzenle`, `kisiKoduDuyur` ve beş `document` dinleyicisi) geldi.
  - `276c0a0 commit 521` (2026-09-27): `kayitAlanHatasi` köprüsü — e-posta onayı hesabı açamazsa kayıt kartında ilgili kutu.
  - `0acca75 commit 516` (2026-09-27, kayıt/kişi kodu/portallar): baş yorumu "+ Ekle" ve portallarla güncellendi; eski
    `kodBicimle` (10 haneli veli kodu, "ABCDE-FGH23") kaldırılıp kişi kodu yardımcıları (o gün 15 karakter) eklendi;
    `oturumuAc`'a `portalDurumuAl`; kayıttaki "Ne olarak kullanacaksın" seçiminin (`ilk_ekle` tercihi) izi silindi.
  - Daha eski: `6af78fc commit 401` (2026-09-26, `aramaVurgula`), `a1c5d41 commit 324`, ilk hâli `1d576e0 commit 15`
    (2026-08-28).
- Bilinen açıklar (kod değiştirilmedi): şifre sıfırlamada zayıf kuralla ön denetim ve ekrandaki yanıltıcı kural yazısı;
  gevşek e-posta deseni; ölü `ee_hatirla`; "Kodu tekrar gönder" hatasında ekranın kalması.
- Planlı işlerden bu dosyayı etkileyecekler:
  - "Sistem" — TOTP (doğrulama uygulaması) önce yöneticiye zorunlu, sonra bütün yetişkinlere isteğe bağlı: girişin ikinci
    adımında e-posta kodu yerine uygulama kodu ya da kurtarma kodu (kod ekranı ve `#formKod` değişecek); yeni cihazdan giriş
    uyarısı. Tanımın 29 Eylül eki: iki adımlı giriş (e-posta kodu ya da uygulama) öğrenciye de isteğe bağlı açılabilecek;
    bugün öğrenci kod ekranını hiç görmez, o zaman görebilecek.
  - "Tek kişi tek hesap + portallar öğrencide de" — kullanıcı adı site genelinde tek, girişte "Okul seç"; `okulSec` kolu ve
    okul sayfasından giriş değişecek.
  - "Toplantılar … tahta hesabı" — "tahta." önekli hesaplar okulun sayfasındaki bu giriş formundan kullanıcı adı + şifreyle
    girecek; normal kullanıcı adı "tahta." ile başlayamayacak (`kullaniciAdiSorunuTR`'nin sunucudaki eşine kural gelecek,
    buraya da gelmeli).
  - "Özel roller … ortak bilgisayarda giriş" ve "Okul cihazı" — "Bu ortak bir bilgisayar" seçeneği ("Beni hatırla"nın
    yanına) ve müdürün seçtiği okul bilgisayarında okul sayfasından girişte kodun sorulmaması.
  - "Çok dil" — bu dosyadaki bütün kullanıcı metinleri çeviri kataloğuna (`c()`) taşınacak.
  - "Güvenlik denetimi" — giriş akışının sunucu tarafını (IPv6 /64 anahtarı) gözden geçirecek.
