# testler/test-kucult.js

Tarayıcıya giden birleşik JS ve CSS'ten yorumları atan `sunucu/yardimci/kucult.js`'i zor örneklerle ve gerçek arayüz
parçalarından kurulan paketlerle (`app.js`, yönetim paketi, `style.css`) deneyen sunucusuz paket (11 denetim).

## Bu dosya ne yapar?

Ön yüz tek bir büyük dosya değil: `public/js/parcalar/` altındaki parçalar ad sırasıyla tek bir `(function () { 'use strict'; … })();`
içinde birleşip `/js/app.js` olarak, yönetim ekranları `public/js/yonetim/` ile birlikte `/admin/yonetim.js` olarak, CSS
parçaları da `/css/style.css` olarak gider. Sunucu birleştirirken yorumları atar ([../sunucu/http.md](../sunucu/http.md),
[../sunucu/yardimci/kucult.md](../sunucu/yardimci/kucult.md)): kaynaktaki "neden" açıklamaları geliştirici içindir, "İncele" diyen
herkesin okuması gerekmez; dosya da küçülür.

Yorum atıcı elle yazılmış küçük bir tarayıcıdır (lexer). Dizginin ya da düzenli ifadenin içindeki `//` ve `/*` işaretlerine
dokunmamalı, bölme işaretini (`10 / 2 / 5`) düzenli ifade sanmamalı, satır sonlarını korumalı (yoksa otomatik noktalı virgül
bozulur). Yanılırsa iki şey olabilir: ya kod bozulur ya da sunucudaki güvenli sarmalayıcı (`kucultKontrollu`) sonucun
derlenmediğini görüp **yorumlu hâli gönderir** — uygulama çalışır ama yorumlar sessizce tarayıcıya gider, yalnız sunucu
penceresine bir "Uyarı:" satırı düşer. Bu paket ikisini de yakalar: önce elle seçilmiş zor örneklerle, sonra bugünkü gerçek
parçalardan kurduğu paketlerin yorumsuz hâlinin derlendiğini görerek.

## İçinde neler var?

### Kullandığı işlevler

`jsYorumSil`, `cssYorumSil`, `kucultKontrollu` — `sunucu/yardimci/kucult.js`'ten, yolu `path.join(__dirname, '..', …)` ile
(paketi hangi klasörden başlattığın önemli değil). Ayrıca Node'un `fs`, `path`, `vm` modülleri; `kontrol(ad, sart, detay)`.

### 1) Zor durumlar (4)

15 satırlık bir örnek kaynak: `'http://x.com/*y*/'` dizgisi, `"/* degil */" + '//degil'`, `/\/\*[^*]*\*\//g` düzenli ifadesi,
`'a/*b*/c'.replace(/\*/g, '-')`, `10 / 2 / 5` bölmesi, `/[/*]+/.test('*/')` (sınıf içinde `/` ve `*`), `return /x\/y/.source`,
`typeof /a/`, iki satıra yayılan bir blok yorum (`var k = { a: 1 }; /* satır` … `sonu */ var l = 2`), ardından noktalı virgülsüz
`var m = l` ve tek başına bir satırda `/* çok satır */`. Silinmesi gereken yorumlar: `// yorum 1`, `/* yorum 2 */`, `// bölme`,
iki satırlık blok ve `/* çok satır */`.

- **Yorumlar gitti:** temiz metinde "yorum 1", "yorum 2", "bölme", "çok satır" yok.
- **Aynı sonuç:** örnek hem yorumlu hem yorumsuz hâliyle `vm.runInNewContext` ile çalıştırılır; son ifade olan `sonuc`
  dizisinin JSON'u aynı olmalı (dizgiler, düzenli ifadeler, bölme ve satır sonu korunmuş demektir).
- **Şablon dizgisi:** ``kucultKontrollu('var a = `x`; // y', 'js')`` girdiyi aynen döner. `jsYorumSil` ters tırnak görünce
  "şablon dizgisi desteklenmiyor" diye hata atar, sarmalayıcı yakalar ve yorumlu hâli verir. Bu denetim sırasında ekrana
  `Uyarı: js yorumları atılamadı (şablon dizgisi desteklenmiyor); yorumlu hâli gönderiliyor.` satırı düşer; bu beklenen
  çıktıdır, hata değildir.
- **CSS:** `cssYorumSil('a{content:"/*x*/"}/* y */b{c:d}')` → `a{content:"/*x*/"}b{c:d}` (dizgi içi korunur).

### 2) Gerçek arayüz paketi (7)

İçeride `paket(klasor, uzanti, bas, son)` sunucunun birleştirmesini taklit eder: klasördeki `uzanti` ile biten dosyaları ad
sırasıyla alır, her birinin önüne `/* ==== parcalar/<ad> ==== */` koyar, başa ve sona `bas`/`son` ekler.

- **`app.js` yorumsuz hâliyle derleniyor:** `public/js/parcalar/*.js` (bugün 57 parça) IIFE'ye sarılır, `jsYorumSil`'den geçer
  ve `new vm.Script` ile yalnız derlenir (çalıştırılmaz). Hata yoksa geçer.
- **Parça adı ve açıklama kalmadı:** temiz metinde `==== parcalar/` yok; dizgiler ve düzenli ifadeler maskelendikten sonra
  hiçbir `/* … */` bloğu kalmamış.
- **Küçüldü:** temiz metin kaynağın %95'inden kısa (3 Ekim'de 819.085 → 720.256 karakter, yaklaşık %88).
- **Aynı adlı dosya yok:** `public/js/parcalar` ile `public/js/yonetim`'deki `.js` adları birleştirilip sıralanır; iki klasörde
  aynı ad olmamalı (yönetim paketi tek sıra ve tek IIFE olduğu için aynı ad karışıklık çıkarır).
- **Yönetim paketi (`/admin/yonetim.js`) yorumsuz hâliyle derleniyor:** iki klasörün parçaları (bugün 57 + 5) ad sırasıyla tek
  IIFE'de birleşir, yorumsuz hâli derlenir. Yönetim klasörü yoksa yalnız uygulama parçaları alınır (`fs.existsSync`).
- **`style.css` yorumsuz:** `public/css/parcalar/*.css` (bugün 38 parça) `cssYorumSil`'den geçer; sonuçta `/*` yok ve metin
  kısaldı (3 Ekim'de 201.530 → 176.189 karakter).
- **Süslü parantezler dengeli:** temiz CSS'te `{` sayısı `}` sayısına eşit (yorum silerken bir bloğun yarısı gitmemiş).

Toplam 4 + 7 = 11. Sonunda boş satır ve `GECTI: 11   KALDI: 0`; `KALDI` varsa çıkış kodu 1.

## Kimle konuşur?

- **Çağırdığı:** `sunucu/yardimci/kucult.js` ([../sunucu/yardimci/kucult.md](../sunucu/yardimci/kucult.md)). Okuduğu dosyalar:
  `public/js/parcalar/*.js`, `public/js/yonetim/*.js`, `public/css/parcalar/*.css` — yalnız okur, hiçbir şey yazmaz.
  Sunucu, veritabanı, ağ yok.
- **Koruduğu kod:** `kucult.js`'in üç işlevi ve sunucunun birleştirici düzeni ([../sunucu/http.md](../sunucu/http.md):
  `birlesikOku`, `BIRLESIK`, `YONETIM_JS`; "iki klasörde aynı adlı parça olmamalı" kuralı); dolaylı olarak bütün ön yüz
  parçaları — her parça ES5 ve şablon dizgisiz yazılmalı, yoksa bu paket kalır. Parçaların belgeleri
  [../public/js/parcalar/00-durum.md](../public/js/parcalar/00-durum.md) ile başlar; yönetim parçaları
  [../public/js/yonetim/09-yonetici.md](../public/js/yonetim/09-yonetici.md) ve yanındakiler.
- **Onu çalıştıran:** `testler/tumtest.sh` — sunucusuz paketler döngüsünün üçüncü paketi (`test-push`'tan sonra,
  `test-resim-kucult`'tan önce).

## Nasıl çalışır (adım adım)?

```
1) örnek kaynak ──jsYorumSil──► temiz
      yorum sözcükleri yok mu ; vm.runInNewContext(örnek) == vm.runInNewContext(temiz) ?
   kucultKontrollu('…`x`…') ─► aynen döner (Uyarı satırı basılır)
   cssYorumSil(dizgi içi /*x*/) ─► korunur
2) public/js/parcalar/*.js ─► IIFE ─► jsYorumSil ─► new vm.Script (derle)
      parça adı / blok yorum kalmadı mı ; < %95 mi
   parcalar + yonetim adları ─► aynı ad var mı ─► tek IIFE ─► jsYorumSil ─► derle
   public/css/parcalar/*.css ─► cssYorumSil ─► "/*" yok mu ; { } dengeli mi
GECTI: n   KALDI: m
```

## Dikkat!

- **Sunucunun birleştiricisini çağırmaz, taklit eder.** Paketi kendi `paket()` işleviyle kurar; `http.js`'teki `birlesikOku`
  değişirse (sıra, ayraç, hangi uzantının alındığı) bu paket fark etmez. Örneğin yönetim paketinde sunucu ayraca `yonetim/`
  önekini koyar, burada önek yok — yorum olduğu için sonucu etkilemez. Sunucunun verdiği paketleri indiren sunuculu
  paketler var ([test-admin-gizli.md](test-admin-gizli.md) `/admin/yonetim.js`'in derlendiğine bakar,
  [test-adresler.md](test-adresler.md) `/js/app.js`'ten işlev çalıştırır), ama sunucudan gelen dosyada yorumların gerçekten
  atıldığını denetleyen bir paket yok.
- **Yalnız `.js` ve `.css` alınır.** `public/js/parcalar/` içinde artık her parçanın yanında bir `.md` belgesi var (3 Ekim'de 57);
  paket de sunucu da uzantıyla süzdüğü için belgeler pakete karışmaz. Süzgeci gevşetirsen (ör. bütün dosyalar) iki yer birden
  bozulur.
- **Satır yorumları ayrıca denetlenmez.** "Açıklama kalmadı" denetimi yalnız `/* … */` bloklarına ve parça ayracına bakar;
  temiz metinde bir `//` yorumu kalsa bu denetim görmez (zor örnekteki `// yorum 1` ve `// bölme` yalnız 1. bölümde aranır).
- **Şablon dizgisi yasağı buradan gelir.** Parçalardan birine ters tırnak girerse `jsYorumSil` hata atar, 2. bölümdeki derleme
  denetimi kalır; sunucu ise yorumlu hâli gönderir (çalışır, ama yorumlar açığa çıkar). Ön yüzün ES5 yazılması kuralıyla
  birlikte düşün: parçalarda ters tırnak kullanma.
- **`EE_ACIK_KAYNAK=1`** ortam değişkeni `kucultKontrollu`'yu devre dışı bırakır (yorumlar korunur). Bu pakette yalnız şablon
  dizgisi denetimi sarmalayıcıyı çağırır ve o zaman da girdi aynen döndüğü için geçer; öbür denetimler işlevleri doğrudan
  çağırır, etkilenmez. 3 Ekim'de `EE_ACIK_KAYNAK=1` ile de çalıştırıldı: `GECTI: 11   KALDI: 0`, bu kez hiç "Uyarı:" satırı
  çıkmadı (sarmalayıcı yorum atmayı denemeden döner). Yani bu değişken açıkken paket, sunucunun gerçekte yorumlu dosya
  göndereceğini haber vermez.
- **CSS'te dizgi içi `/*`.** "style.css yorumsuz" denetimi temiz metinde hiç `/*` aramaz; bir parçada `content: "/*"` gibi meşru
  bir dizgi olursa denetim yanlış alarm verir (bugün yok).

## Testleri

- Bu dosyanın kendisi testtir; `testler/tumtest.sh` her tam koşuda sunucusuz paketler arasında çalıştırır.
- Elle (proje kökünde): `node testler/test-kucult.js`. Sunucu ve veritabanı gerekmez.
- 3 Ekim'de bu belge için çalıştırıldı (belgenin denetiminde bir kez daha): `GECTI: 11   KALDI: 0`, çıkış 0, 1 saniyeden
  kısa; çıktıda beklenen tek "Uyarı:" satırı. 2. bölümdeki parça sayıları ve karakter sayıları da denetimde yeniden ölçüldü,
  aynı çıktı.
- Ön yüzle ilgili öbür sunucusuz denetimler: [buton-denetimi.md](buton-denetimi.md) (her `data-act`'in karşılığı),
  [yazim-denetimi.md](yazim-denetimi.md).

## Son durum

- `git log`: 3 commit.
  - `276c0a0 commit 521` (2026-09-27, gizli `/admin` ve yönetim paneli): yönetim ekranları `public/js/parcalar/09-yonetici.js`'ten
    ayrı `public/js/yonetim/` klasörüne taşındığı için iki denetim eklendi — iki klasörde aynı adlı dosya olmaması ve yönetim
    paketinin (`/admin/yonetim.js`) yorumsuz hâliyle derlenmesi.
  - `e038265 commit 412` (2026-09-26): bütün denetimler geldi — 1. bölümün zor örnekleri ve 2. bölümün `app.js` / `style.css`
    denetimleri.
  - `778c7a7 commit 6` (2026-08-28): dosyanın ilk hâli yalnız iskeletti (yorum, `require`'lar, `kontrol` ve sonuç satırı; hiç
    denetim yoktu).
- Açık iş yok; kod değiştirilmedi.
- Planlı işlerden bu dosyayı etkileyecekler: **"Düzenleyiciler"** (ortak yazı editörü, quiz soru editörü) ve **"Arayüz
  önizlemesi"** (kullanıcı tasarımlardan birini seçince "tasarım dili" tanımı yazılacak; ön yüz ona göre yeniden yazılırsa) yeni
  ve büyük parçalar getirecek; hepsi bu paketin derleme denetiminden geçmeli (ES5, şablon dizgisiz). **"Çok dil"** işinin `c()` katalog parçası ve **"EKLENTİLER"** (kum havuzu, kendi API'si)
  ayrı bir paket kurulursa onun için de buraya bir derleme denetimi eklenmeli.
