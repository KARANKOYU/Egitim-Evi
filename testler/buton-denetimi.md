# testler/buton-denetimi.js

Ön yüzün kaynağını metin olarak tarayıp her düğmenin (`data-act`) bir karşılığı, her sayfa bağlantısının (`data-nav`) ve
menü anahtarının bir `SAYFALAR` girdisi, ön yüzün çağırdığı her `/api/<ilk parça>`'nın da sunucuda bir karşılığı var mı
diye bakan sunucusuz denetim.

## Bu dosya ne yapar?

Eğitim Evi'nin ön yüzünde düğmeler HTML metni olarak üretilir: `'<button data-act="odev-sil" …>'`. Tıklanınca
[../public/js/parcalar/25-tiklama.md](../public/js/parcalar/25-tiklama.md)'deki dağıtıcı `data-act`'in değerine bakar; ya
kendi içindeki `act === 'odev-sil'` dalını ya da bir parçanın kaydettiği `EYLEMLER['odev-sil']` işlevini çalıştırır. Sayfa
bağlantıları da aynı düzende: `data-nav="takvim"` → `SAYFALAR.takvim`.

Bu düzenin bir tuzağı var: bir düğmenin adını değiştirip eylemin adını değiştirmeyi unutursan düğme **sessizce ölür**.
Tıklarsın, hiçbir şey olmaz, konsolda hata bile yoktur. Aynısı menüdeki bir sayfa anahtarı için de geçerli. Ön yüzün
çağırdığı bir API yolu sunucuda hiç yoksa da kişi yalnız "Böyle bir adres yok" görür.

Bu dosya tarayıcı açmadan, sunucu çalıştırmadan, birkaç saniyede bütün parçaları okuyup bu tutarsızlıkları arar. Bir
"çalıştırma" testi değil, bir **tutarlılık denetimi**dir: kodu düzenli ifadelerle tarar. `testler/tumtest.sh` onu en sonda,
sunucusuz denetimlerin ilki olarak çalıştırır; çıkış kodu 0 değilse "DENETIM SORUNU" sayılır. Bir parçaya düğme, sayfa ya da
menü satırı ekleyen her iş kendi başına da bunu koşmalı (`node testler/buton-denetimi.js`).

## İçinde neler var?

Dosyada dışa açılan bir şey yok; yukarıdan aşağı çalışan bir betik.

### Ne okur?

- `KOK` — proje kökü (`__dirname/..`). Yollar buna göre olduğu için betiği hangi klasörden çalıştırdığın fark etmez.
- `PARCA_KLASORLERI` — `public/js/parcalar` ve `public/js/yonetim` (var olanlar). İkisindeki bütün `.js` dosyaları **dosya
  adına göre tek sırada** dizilip satır sonuyla birleştirilir: `APP`. Bu, sunucunun yönetim paketini (`/admin/yonetim.js`)
  kurduğu sıranın aynısıdır ([../sunucu/http.md](../sunucu/http.md), `birlesikOku`). Herkese giden `/js/app.js` yalnız
  `parcalar`'dan oluşur; denetim ikisinin birleşimine bakar ("Dikkat!"e bak).
- `HTML` — `public/index.html`. `KAYNAK = APP + HTML`: üretilen düğmeler ikisinde de aranır, karşılıklar yalnız `APP`'te.
- `benzersiz(a)` — diziyi tekrarsız ve sıralı yapar.

### Topladığı listeler

| Ad | Nereden | Nasıl |
|---|---|---|
| `uretilenAct` | `KAYNAK` | `data-act="x"`, `data-act='x'` ya da JavaScript metni içindeki kaçışlı `data-act=\"x\"` (x: harf, rakam, `_`, `-`) |
| `uretilenNav` | `KAYNAK` | aynısı `data-nav` için |
| `degiskenAct`, `degiskenNav` | `KAYNAK` | `data-act="' + degisken` biçimi (değer çalışırken belli olur); yalnız ekrana yazılır, denetlenmez |
| `eleAlinanAct` | `APP` | `act === 'x'` ve `EYLEMLER['x'] =` |
| `sayfalar` | `APP` | `SAYFALAR.x =` ve `SAYFALAR['x'] =` |
| `menuAnahtar` | `APP` | `{ k: 'x', … g: '…' }` (menü satırı, `g` ikon adı) ya da `{ k: 'x', … ikon: '…' }` (ana sayfa kutucuğu). Başka `{ k: … }` nesneleri (ör. Excel aktarım türleri) sayfa sayılmaz |

Menü ve kutucuk anahtarlarının ayrıca toplanmasının nedeni: menü düğmeleri değişkenle üretilir
(`data-nav="' + esc(n.k) + '"`, [../public/js/parcalar/06-menu.md](../public/js/parcalar/06-menu.md); kutucuklar
`esc(t.k)`, [../public/js/parcalar/07-yonlendirme.md](../public/js/parcalar/07-yonlendirme.md)). Değerleri ancak bu nesne
satırlarından okunabilir.

### Altı bölüm

| # | Başlık | Ne arar | Sorun mu? |
|---|---|---|---|
| — | `=== SAYILAR ===` | listelerin uzunlukları, değişkenle üretilenler | bilgi |
| 1 | `KARSILIGI OLMAYAN DUGMELER (olu buton)` | `uretilenAct`'te olup `eleAlinanAct`'te olmayan | **evet**, her biri 1 |
| 2 | `HIC URETILMEYEN EYLEM (olu kod)` | ele alınıp hiçbir düğmenin üretmediği eylem | hayır, `?` ile uyarı |
| 3 | `OLMAYAN SAYFAYA GIDEN BAGLANTI` | `data-nav` değeri `SAYFALAR`'da yok (`OZEL_NAV` hariç) | **evet** |
| 4 | `MENUDE OLUP SAYFASI OLMAYAN` | menü/kutucuk anahtarı `SAYFALAR`'da yok (`OZEL_NAV` hariç) | **evet** |
| 5 | `SAYFASI OLUP HIC ULASILAMAYAN` | menüde yok, `data-nav`'da yok, `git('x')` diye de çağrılmıyor | hayır, `?` ile uyarı |
| 6 | `API YOLU / SUNUCU UCU KARSILASTIRMASI` | `APP`'teki `api('/x…` çağrılarının ilk parçası sunucuda `p === 'x'` ya da `p !== 'x'` diye geçmiyor | **evet** |

- `OZEL_NAV = ['geri-veli']` — sayfa olmayan tek gezinme değeri: veli, müdür ya da öğretmen bir öğrencinin ekranına
  bakarken menüde çıkan "Çocuk Listesi" / "Öğrenci Listesi" dönüş satırı (`{ k: 'geri-veli', g: 'geri', ad: geriAd }`,
  [../public/js/parcalar/06-menu.md](../public/js/parcalar/06-menu.md); tıklayınca 25-tiklama.js ele alır). 3. ve 4. bölümde
  sayılmaz.
- `sunucuMetni(k)` — `sunucu/` altındaki bütün `.js` dosyalarını (alt klasörler dahil) birleştirir; 6. bölümün `tanimli`
  listesi bu metindeki `p === '…'`/`p !== '…'` kalıplarından çıkar.
- `cagrilan` — `api('/school/students')` gibi çağrıların yalnız **ilk parçası** (`school`).

Sonunda `SORUN YOK` (çıkış 0) ya da `N SORUN BULUNDU` (çıkış 1). 1. bölümün iletisindeki `islem()`, 25-tiklama.js'teki
dağıtıcı işlevdir (`islem(act, el)`: önce `EYLEMLER[act]`'a bakar, yoksa kendi `act === …` dallarına); karşılığı olmayan bir
eylem bu işlevin sonuna kadar düşer ve hiçbir şey yapmadan döner, konsola da bir şey yazılmaz.

### 3 Ekim'deki çıktı

Bu belge yazılırken çalıştırıldı (sunucusuz, salt okuma): 316 üretilen `data-act`, 316 ele alınan eylem, 10 `data-nav`, 46
`SAYFALAR`, 45 menü anahtarı; değişkenle üretilen `data-nav`: `n.k, t.k`; altı bölümün hepsi "yok"; "tum api yollari
sunucuda tanimli (46 yol)"; `SORUN YOK`, çıkış 0.

## Kimle konuşur?

- **Çağırdıkları:** yalnız Node'un `fs` ve `path`'i. Projeden hiçbir modül `require` etmez, sunucuya istek atmaz.
- **Okuduğu dosyalar ve oradaki kalıplar** (3 Ekim'de `grep` ile sayıldı):
  - `act === '…'` kalıpları: 68 tanesinin 67'si [../public/js/parcalar/25-tiklama.md](../public/js/parcalar/25-tiklama.md)'de,
    1'i (`sy-sira-yukari`) [../public/js/parcalar/19i-servis-yoklama.md](../public/js/parcalar/19i-servis-yoklama.md)'de.
    O sonuncusu bir dağıtıcı dalı değil: liste yeniden çizilince odağı aynı düğmeye, o düğme artık kapalıysa karşı oka veren
    `odak.act === 'sy-sira-yukari'` karşılaştırması. Kalıp `act === '` diye arandığı için onu da "ele alınan" sayar; eylemin asıl karşılığı aynı dosyadaki
    `EYLEMLER['sy-sira-yukari']`.
  - `EYLEMLER['…'] =` kayıtları 38 parçada; en çok [../public/js/parcalar/14c-quiz.md](../public/js/parcalar/14c-quiz.md)
    (26), [../public/js/parcalar/19c-okul-hayati.md](../public/js/parcalar/19c-okul-hayati.md) (22),
    [../public/js/parcalar/12-ogretmen-sinav.md](../public/js/parcalar/12-ogretmen-sinav.md) (20); yönetim tarafında
    [../public/js/yonetim/09-yonetici.md](../public/js/yonetim/09-yonetici.md) (10),
    [../public/js/yonetim/09b-site-ayarlari.md](../public/js/yonetim/09b-site-ayarlari.md) (7).
  - `SAYFALAR` tanımları 30 parçada (ör. [../public/js/parcalar/08-ana-sayfa.md](../public/js/parcalar/08-ana-sayfa.md),
    [../public/js/parcalar/18-devamsizlik.md](../public/js/parcalar/18-devamsizlik.md),
    [../public/js/parcalar/27-veli-panel.md](../public/js/parcalar/27-veli-panel.md)).
  - Menü ve kutucuk nesneleri: [../public/js/parcalar/06-menu.md](../public/js/parcalar/06-menu.md) (96 satır),
    [../public/js/parcalar/08-ana-sayfa.md](../public/js/parcalar/08-ana-sayfa.md) (21),
    [../public/js/yonetim/09a-yonetim-paneli.md](../public/js/yonetim/09a-yonetim-paneli.md) (15).
  - `api('/…')` çağrıları: [../public/js/parcalar/01-yardimcilar.md](../public/js/parcalar/01-yardimcilar.md)'deki `api`
    yardımcısını kullanan bütün parçalar.
  - Sunucu tarafı: bölümlerin `uclar(k)` işlevlerindeki `p === '…'` kalıpları (yol tablosu
    [../sunucu/api.md](../sunucu/api.md)'deki `BOLUM`; denetim tabloya değil bölüm dosyalarındaki kalıba bakar).
  - `public/index.html` (düğmeler; karşılığı orada aranmaz).
- **Onu çalıştıran:** `testler/tumtest.sh` — denetimler döngüsünün sunucusuz kısmında, `yazim-denetimi` ve `sql-denetimi`'nden
  önce. Çıktının son iki satırını gösterir; çıkış kodu 0 değilse ya da çıktıda `SORUN BULUNDU` varsa `DENETIM_SORUN`'u bir
  artırır.
- **Onu anan belgeler:** ön yüz parçalarının "Testleri" bölümleri (ör. [../public/js/parcalar/04d-ekler.md](../public/js/parcalar/04d-ekler.md):
  `ek-kaldir`, `ek-indir` eylemlerinin karşılığı) ve [../TANITIM.md](../TANITIM.md)'nin "Testler ve denetimler" bölümü.
- **Rol:** yok; denetim kodu tarar, hiçbir hesapla giriş yapmaz.

## Nasıl çalışır (adım adım)?

```
public/js/parcalar/*.js + public/js/yonetim/*.js ──(ada göre sırala, birleştir)──► APP
APP + public/index.html ──────────────────────────────────────────────────────► KAYNAK

KAYNAK ─► data-act değerleri ──┐
APP ───► act === / EYLEMLER ───┴─► 1) karşılıksız düğme (SORUN)   2) düğmesiz eylem (uyarı)
KAYNAK ─► data-nav değerleri ──┐
APP ───► SAYFALAR tanımları ───┼─► 3) sayfasız bağlantı (SORUN)
APP ───► { k:…, g:/ikon: } ────┘   4) sayfasız menü anahtarı (SORUN)   5) ulaşılamayan sayfa (uyarı)
APP ───► api('/x…') ilk parça ──┐
sunucu/**/*.js ► p === 'x' ─────┴─► 6) sunucuda karşılığı yok (SORUN)

toplam SORUN 0 ─► "SORUN YOK", çıkış 0      değilse ─► "N SORUN BULUNDU", çıkış 1
```

Yeni bir düğme eklerken yapman gereken: düğmeyi `data-act="yeni-is"` ile üret, karşılığını ya 25-tiklama.js'e `act ===` dalı
olarak ya da kendi parçanda `EYLEMLER['yeni-is'] = function (el) { … }` olarak yaz, sonra bu denetimi koş.

## Dikkat!

- **Metin taraması, çalıştırma değil.** Denetim bir adın bir yerde "ele alındığını" kanıtlar, düğmenin doğru iş yaptığını
  değil. Yorum içinde ya da hiç çalışmayan bir dalda duran `act === 'x'` da karşılık sayılır (yorumlar silinmeden taranır).
- **Birleşim, yönetim paketinin birleşimidir.** `parcalar` ile `yonetim` aynı listede taranır. Bir düğme `parcalar`'da
  üretilip yalnız bir yönetim parçasında ele alınırsa denetim geçer, ama yönetim paketini almayan herkesin tarayıcısında
  (`/js/app.js`) o düğme ölüdür; aynısı yalnız yönetim parçasında tanımlı bir sayfaya `parcalar`'dan giden `data-nav` için de
  geçerli. 3 Ekim'de ayrıca ölçüldü: bugün böyle bir düğme ya da bağlantı **yok**. Ama denetim bunu yakalamaz.
- **Değişkenle üretilen değerler denetlenmez.** `data-act="' + x + '"` ya da `data-nav="' + esc(n.k) + '"` yalnız
  "degiskenle uretilen" satırında listelenir. Menü ve kutucuklar `menuAnahtar` sayesinde yine denetlenir; başka bir yerde
  değişkenle düğme üretirsen o değerin karşılığına kendin bak. `setAttribute('data-act', …)` ya da `dataset.act` ile
  üretilen düğmeyi hiç görmez (bugün böyle bir kullanım yok).
- **6. bölüm yalnız `api('/…')` biçimini görür ve yalnız ilk parçayı karşılaştırır.** `api("/…")` (çift tırnak), değişkenle
  kurulan yol, doğrudan `fetch('/api/…')`, `XMLHttpRequest` ve `dosyaIndir('/api/…')` çağrıları sayılmaz. Bugün böyle 7 çağrı
  (6'sı uygulama parçalarında, 1'i yönetim parçasında) ve bir resim adresi var:
  [../public/js/parcalar/04d-ekler.md](../public/js/parcalar/04d-ekler.md) (`/api/ek/yukle`, `XMLHttpRequest`),
  [../public/js/parcalar/14b-odev-teslim.md](../public/js/parcalar/14b-odev-teslim.md) (`/api/odev-dosya/yukle`,
  `XMLHttpRequest`), [../public/js/parcalar/14c-quiz.md](../public/js/parcalar/14c-quiz.md) (`…/quiz/odak` için `fetch`),
  [../public/js/parcalar/15-aktarim.md](../public/js/parcalar/15-aktarim.md) (iki `dosyaIndir`),
  [../public/js/parcalar/19g-okul-sayfasi.md](../public/js/parcalar/19g-okul-sayfasi.md) (`/api/okul-sayfa/foto` için
  `fetch`; ayrıca `<img>`'lerdeki `/api/okul-foto/…` adresi), [../public/js/yonetim/09-yonetici.md](../public/js/yonetim/09-yonetici.md)
  (`/api/admin/backup-download` için `dosyaIndir`). İlk parça bulunduğunda (`school`) yolun geri kalanı (`/school/yok-boyle`)
  hiç denetlenmez; sunucu tarafında da `p === 'x'` herhangi bir dosyada geçmesi yeter.
- **2. ve 5. bölüm sonucu etkilemez.** Ölü kod ya da hiçbir yerden açılamayan bir sayfa varsa denetim yine `SORUN YOK` der;
  `?` satırlarına ayrıca bak. `tumtest.sh` yalnız son iki satırı gösterdiği için bu uyarılar orada görünmez.
- **`OZEL_NAV` elle tutulur.** Sayfa olmayan yeni bir gezinme değeri eklersen (ör. "geri" türünden bir satır) bu listeye de
  ekle; yoksa 3. ya da 4. bölüm onu sorun sayar.
- **Kapsam dışı sayfalar.** Yalnız `public/index.html` taranır. `public/404.html`, `public/kvkk/kvkk.html`,
  `public/kosullar/kosullar.html`, `public/indir/indir.html`, `public/okul-bulunamadi.html` içindeki `data-act="tema-degis"` ve
  `data-act="yapimcilar"` düğmelerini [../public/js/belge.md](../public/js/belge.md) karşılar; bu denetim onlara bakmaz.
- **Menü kalıbı basit.** `{ k: 'x', … }` ile `g:`/`ikon:` arasında başka bir `}` varsa (iç içe nesne) eşleşme kaçar ve o
  anahtar 4. bölümde hiç denetlenmez.
- **Belgeler denetimi etkilemez.** Parça klasörlerindeki `.md` dosyaları okunmaz (yalnız `.js` uzantılılar alınır); bu,
  belgeleme işinin "denetimler `.md`'lerden etkilenmemeli" kuralının bu dosyadaki karşılığıdır.
- `public/index.html` ya da `sunucu/` yoksa betik `readFileSync`/`readdirSync` hatasıyla çöker; parça klasörlerinden biri
  yoksa sessizce atlanır.

## Testleri

- Bu dosyanın kendi testi yok; kendisi bir denetim. Koruduğu dosyalar: `public/js/parcalar/*.js` ve `public/js/yonetim/*.js`
  (düğme ↔ eylem, bağlantı ↔ sayfa, menü ↔ sayfa), `public/index.html`, ve ön yüzün `api('/…')` ilk parçaları üzerinden
  `sunucu/bolumler/*.js` yol kapıları.
- Elle (proje kökünde, sunucu gerekmez): `node testler/buton-denetimi.js` → sonda `SORUN YOK`. Denemek istersen bir parçada
  bir düğmenin `data-act` değerini geçici olarak değiştir: 1. bölümde `! data-act="…" -> islem() icinde yok` ve
  `1 SORUN BULUNDU` görmelisin (değişikliği geri al).

## Son durum

- `git log`: 3 commit. `144770c commit 134` (2026-08-29) ilk hâli: parçaları ad sırasıyla birleştirme, `SAYILAR` ve 1–2.
  bölümler (henüz sonuç satırı ve çıkış kodu yoktu). `5b59043 commit 135` (2026-08-29): 3–6. bölümler, `OZEL_NAV`,
  sunucu klasörünü özyinelemeli tarayan `sunucuMetni`, sonuç satırı ve `process.exit(sorun ? 1 : 0)`.
- `276c0a0 commit 521` (2026-09-27, gizli `/admin` ve site ayarları): tek `PARCA_KLASOR` yerine `PARCA_KLASORLERI`;
  yönetim parçaları (`public/js/yonetim/`) da okunup uygulama parçalarıyla **dosya adına göre tek sırada** birleştirilir (yorum:
  yönetim paketi `/admin/yonetim.js`'te birleştiği için düğmeleri ve sayfaları birlikte denetlenir). O günden beri değişmedi.
- Bilinen açıklar (kod değiştirilmedi): birleşimin "yönetim paketi" olması (yalnız yönetim parçasında karşılanan bir
  `parcalar` düğmesini yakalamaz), 6. bölümün doğrudan `fetch`/`XMLHttpRequest`/`dosyaIndir` yollarını (bugün 7 çağrı)
  görmemesi, `act === '…'` kalıbının dağıtıcı dışındaki karşılaştırmaları da karşılık sayması.
- Planlı işlerden bu denetimi etkileyecekler: "Kulüpler kaldırılacak" — `kulup-*` eylemleri (`kulup-katil`, `kulup-kaydet`,
  `kulup-uye-ekle`…) düğmeleriyle birlikte silinmeli, biri kalırsa 1. ya da 2. bölüm görür; "Üst şerit sadeleştirme" (menü
  satırları ve profil menüsü yer değiştirecek; `menuAnahtar` kalıbına uyulmalı); "Paneller" (`/panel/admin`, `/panel/destek`,
  okul gezgini — yeni yönetim parçaları ve sayfaları); "Çok dil" (metinler `c()` kataloğuna taşınırken `data-act` değerleri
  değişmemeli); "TAM DEBUG" (Linux) işi önce `tumtest.sh`'i (bu denetim dahil) temel çizgi olarak koşacak, ön yüz alanında da
  "her düğme bir uca gidiyor mu" sorusunu bu denetimin mantığıyla gerçek tarayıcıda soracak.
