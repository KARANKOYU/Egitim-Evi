# public/js/parcalar/19d-harita.js

Dış kütüphanesiz küçük harita bileşeni `haritaKur`: OpenStreetMap döşemelerini Web Mercator düzeninde dizer, işaret
(okul, ev, servis, seçim, "ben") çizer; sürükleme, iki parmakla ve tekerlekle yakınlaştırma, klavye, "hepsini göster" ve
dokunarak yer seçme sağlar. Yanında "Google Haritalar'da aç" bağlantısı üreten iki yardımcı var.

## Bu dosya ne yapar?

Sitenin birkaç yerinde harita gerekiyor: velinin servis haritası, servisçinin yoklama sayfasındaki harita, okulun
konumunu seçme ekranı ve "Çocuğumun telefonu" sayfasındaki son konum. Leaflet gibi bir kütüphane eklemek yerine (projenin
kuralı: tek npm bağımlılığı `pg`, ön yüz çerçevesiz ES5) bu dosya ~270 satırlık kendi haritasını kurar:

- Harita resimleri (256 × 256 piksellik "döşemeler") `https://tile.openstreetmap.org/<z>/<x>/<y>.png`'den gelir. Hangi
  döşemelerin ekranda olduğu Web Mercator formülüyle hesaplanır, her biri `<img>` olarak yerine kaydırılır.
- İşaretler (iğneler) aynı formülle piksele çevrilip döşemelerin üstüne konur. İşaretlerin konumu dışarı gönderilmez,
  hepsi bu sayfada çizilir.
- Fare/dokunma ile sürüklenir, iki parmakla, fare tekerleğiyle, çift tıklamayla ya da `+`/`−` düğmeleriyle yakınlaşır;
  odaklanınca ok tuşları ve `+`/`-` çalışır. Sağ üstte üç düğme (yakınlaştır, uzaklaştır, hepsini göster), sağ altta
  zorunlu "© OpenStreetMap katkıda bulunanlar" atfı.
- İsteyen ekran `tiklaninca` verirse kısa bir dokunuş (sürükleme değil) o noktanın enlem/boylamını döndürür; ev ya da okul
  konumu böyle seçilir.

Bu dosya kendisi hiçbir sayfa çizmez, hiçbir `/api` ucunu çağırmaz; yalnız bileşeni sağlar.

## İçinde neler var?

### Sabitler

- `HARITA_DOSEME` — `'https://tile.openstreetmap.org/'`. Sunucunun güvenlik başlığı (`Content-Security-Policy`
  `img-src 'self' data: https://tile.openstreetmap.org`; [../../../sunucu/http.md](../../../sunucu/http.md)) yalnız bu
  adresten resme izin verir; adres değişirse orası da değişmeli.
- `HARITA_EN_AZ = 3`, `HARITA_EN_COK = 19` — yakınlaştırma sınırları (OSM'nin döşeme verdiği en büyük düzey 19).
- `TURKIYE` — `{ enlem: 39.0, boylam: 35.2 }`; merkez verilmezse harita buradan, 6. düzeyde açılır.
- `HARITA_ISARET` — işaret türü → `{ ikon, sinif }`: `okul` (ikon `okul`), `ev` (`ev`), `servis` (`servis`), `secim`
  (`konum`), `ben` (`hedef`). Bilinmeyen tür `secim` gibi çizilir. Dosyanın baş yorumu yalnız dört türü sayar; `ben` de
  vardır (servisçinin ve çocuğun son konumu).

### Dönüşümler

- `haritaPiksel(enlem, boylam, z)` — `z` düzeyindeki "dünya pikseli" `{ x, y }`. Ölçek `256 · 2^z`; enlem ±85,05'e
  kırpılır (Mercator'un sınırı).
- `haritaKonum(x, y, z)` — tersi: dünya pikselinden `{ enlem, boylam }`; boylam −180…180 arasına sarılır.

### Google Haritalar

- `googleHaritaAdresi(k)` — `https://www.google.com/maps/search/?api=1&query=<enlem>,<boylam>` (6 ondalık).
- `googleHaritaBaglantisi(k, yazi?)` — `<a class="btn kucuk ghost" target="_blank" rel="noopener noreferrer">` +
  harita ikonu + yazı (varsayılan "Google Haritalar'da aç"; `esc`'li). Yeni sekmede açılır; `noreferrer` yüzünden Google'a
  hangi sayfadan gelindiği gitmez.

### `haritaKur(kap, ayar)` — bileşen

Girdi: `kap` boş bir kutu (yüksekliği CSS'ten gelir), `ayar`:

- `merkez: { enlem, boylam }` — başlangıç merkezi (yoksa `TURKIYE`);
- `zoom` — başlangıç düzeyi (yoksa merkez verildiyse 15, verilmediyse 6);
- `etiket` — kutunun `aria-label`'ı (yoksa "Harita. Ok tuşlarıyla kaydır, artı ve eksiyle yakınlaştır.");
- `tiklaninca(k)` — kısa dokunuşta `{ enlem, boylam }` ile çağrılır.

Kurulumda kutuya `harita` sınıfı, `tabindex="0"`, `role="application"` ve `aria-label` eklenir; içine
`.harita-doseme` (resimler), `.harita-isaret` (iğneler), `.harita-dugmeler` (`data-harita="art"|"azal"|"sigdir"`) ve
`.harita-atif` yazılır. Dönen nesne:

- `isaretler(liste)` — `[{ tur, enlem, boylam, etiket? }]`. Enlem/boylamı sayıya çevrilemeyenler atılır; her işaret
  `div.harita-nokta.<sınıf>` içinde `span.harita-igne` (ikon) ve varsa `span.harita-etiket` (`esc`'li) olur. Liste her
  çağrıda baştan yazılır, hemen çizilir.
- `sigdir()` — bütün işaretler ekrana sığsın: işaret yoksa yalnız yeniden çizer; tek işaretse oraya ortalar ve en az 15.
  düzeye getirir; birden çoksa 18'den 3'e inerek işaretlerin kapladığı alanın kutuya (genişlik − 80, yükseklik − 90
  piksel pay bırakarak) sığdığı ilk düzeyi seçer ve ortasına gider. 3. düzeyde bile sığmazsa görünüm değişmez.
- `merkezle(k, yz?)` — `k`'ya ortalar (`+` ile sayıya çevirir), `yz` verildiyse o düzeye geçer.
- `merkez()` — şu anki merkez `{ enlem, boylam }`.
- `yokEt()` — çizimi durdurur (`bitti`), boyut izleyiciyi (`ResizeObserver`) keser, kutunun içini boşaltır.

İç işleyiş:

- `ciz()` — merkezin piksel konumundan sol üst köşeyi bulur, ekrana düşen döşeme sütun/satırlarını hesaplar. Yatayda
  dünya sarılır (`gx = tx mod 2^z`), dikeyde 0…2^z−1 dışı çizilmez. Her döşeme `"z/gx/ty/tx"` anahtarıyla saklanır;
  yoksa `<img>` açılır (`alt=""`, sürüklenmez, `decoding="async"`, `referrerPolicy = 'strict-origin-when-cross-origin'`),
  varsa yalnız `transform: translate(...)` güncellenir. Ekrandan çıkan döşemeler DOM'dan ve önbellekten silinir. Sonra
  işaretlerin `transform`'u güncellenir.
- `yenidenCiz()` — çizimi bir sonraki kareye (`requestAnimationFrame`, yoksa `setTimeout`) erteler; aynı karede birden
  çok istek tek çizime iner. Sürükleme, yakınlaştırma (`yakinlas`), ok tuşları (`kaydir`) ve boyut değişimi bunu
  kullanır; `isaretler`, `sigdir`, `merkezle` doğrudan `ciz`.
- `yakinlas(yeniZ, ekranX?, ekranY?)` — düzeyi sınırlar arasında tutar; ekrandaki bir noktayı (verilmezse orta) sabit
  tutarak yakınlaşır.
- `kaydir(dx, dy)` — merkezi piksel olarak kaydırır. `ekranKonumu(ev)` — olayın ekran noktasının enlem/boylamı.
- Olaylar:
  - `pointerdown` / `pointermove` / `pointerup` / `pointercancel` — parmaklar `pointerId` ile izlenir (`setPointerCapture`).
    Tek parmak sürükler (`surukle.oynadi` toplam yer değiştirme); ikinci parmak gelince "çimdik" başlar: aralık 1,6 katına
    çıkınca bir düzey yakınlaşır, 0,62'sine inince uzaklaşır. Parmak kalkarken toplam oynama 6 pikselden azsa ve tek
    parmaksa bu bir **dokunuş** sayılır → `tiklaninca(ekranKonumu)`. Düğmeler ve atıf üstünde başlayan dokunuşlar
    yok sayılır.
  - `wheel` (`passive: false`, her zaman `preventDefault`) — 220 ms'de en çok bir düzey, imlecin altındaki nokta sabit.
  - `dblclick` — imlecin olduğu yere bir düzey yakınlaşır (düğmeler hariç; atıf yazısı hariç tutulmaz).
  - `keydown` — ← → ↑ ↓ 80 piksel kaydırır, `+`/`=` yakınlaştırır, `-` uzaklaştırır.
  - Düğmeler kutusunda `click` — `art`, `azal`, `sigdir`; olay `stopPropagation` ile durdurulur (sitenin genel tıklama
    yöneticisine gitmez).
  - `ResizeObserver` (varsa) — kutunun boyutu değişince yeniden çizer (ör. telefon dönünce, pencere açılınca).

## Kimle konuşur?

- Parçalar ad sırasıyla tek bir IIFE'de birleşir (`/js/app.js`; [../../../sunucu/http.md](../../../sunucu/http.md)
  `birlesikOku`). Çağırdıkları: `ik` ([02-ikonlar.md](02-ikonlar.md); `okul`, `ev`, `servis`, `konum`, `hedef`,
  `harita` ikonları), `esc` ([01-yardimcilar.md](01-yardimcilar.md)). Tarayıcı API'leri: Pointer Events, `Element.closest`,
  `setPointerCapture`, `ResizeObserver` (isteğe bağlı), `requestAnimationFrame`, `Math.hypot`.
- Kendiliğinden dışarı giden tek şey döşeme istekleri: `tile.openstreetmap.org` (OpenStreetMap Vakfı). Google
  bağlantısı yalnız kişi basarsa yeni sekmede açılır. Sunucunun `/api` uçlarıyla konuşmaz.
- Onu kullananlar:
  - [19e-servis-konum.md](19e-servis-konum.md) — `servisHaritasiAc`: öğrencinin/velinin "Servisin nerede?" ve yönetimin
    öğrenci haritası penceresi (`etiket: 'Servis haritası'`, `tiklaninca` ev seçimi için); `isaretler`, `sigdir`,
    `merkezle` (okula/eve git, servisi takip et), `yokEt`; ayrıca `googleHaritaBaglantisi` ("Servisi/Evi Google
    Haritalar'da aç").
  - `19i-servis-yoklama.js` — servisçinin Yoklama sayfasındaki harita (`#syHaritaAlan`): okul, evi işaretli öğrenciler
    ("3. Zeynep"), sefer sürerken `ben` ("Sen"); `sigdir` ilk açılışta; sayfa yenilenirken `yokEt`.
  - [16b-okul-ayarlari.md](16b-okul-ayarlari.md) — okulun konumunu seçme (`merkez` + `zoom` 16 ya da Türkiye + 6,
    `tiklaninca` → `secim` işareti "Okul"); `googleHaritaBaglantisi`.
  - `27b-aile.js` — "Çocuğumun telefonu": son konum (`merkez: d.sonKonum`, `zoom: 15`), önceki noktalar `secim`,
    son nokta `ben`; `googleHaritaBaglantisi`.
- CSS: `public/css/parcalar/27-harita-ortak.css` — `.harita` (gri zemin, `touch-action: none`, tutma imleci, odak
  çerçevesi), `.harita-doseme`/`.harita-isaret` (tam kaplayan, tıklamayı geçiren katmanlar), `.harita-doseme img` (256 px;
  koyu temada parlaklık/kontrast süzgeci), `.harita-nokta` ve tür renkleri (`.okul`, `.ev`, `.servis` — büyük ve dalga
  efektli, `.secim`, `.ben` — ortalı nokta), `.harita-igne`, `.harita-etiket`, `.harita-dugmeler`, `.harita-dugme`,
  `.harita-atif`; kutu yüksekliği `.harita-kap` (340 px). Renk değişkenleri (`--harita-okul`, `--harita-ev`,
  `--harita-servis`, `--harita-secim`, `--harita-ben`, …) `00-temel.css`'te; döşemeler iki temada da açık renkli olduğu
  için işaret ve düğme renkleri temadan bağımsız sabit tutulur.
- Rol: bileşen role bakmaz; onu kullanan ekranın kim tarafından açıldığına göre öğrenci, veli, servisçi, müdür (ve
  `okul.konum` yetkili öğretmen) görür.

## Nasıl çalışır (adım adım)?

```
haritaKur(kap, { merkez, zoom, etiket, tiklaninca })
   kutuya katmanlar + düğmeler + atıf ─► olay dinleyicileri ─► ciz()
ciz():
   p = haritaPiksel(merkez, z)            sol üst = p − (genişlik/2, yükseklik/2)
   döşeme sütunları x0..x1, satırları y0..y1 (dikeyde 0..2^z−1)
   her (tx, ty): img var mı? yoksa <img src="https://tile.openstreetmap.org/z/gx/ty.png">
                 translate(tx·256 − solüst.x, ty·256 − solüst.y)
   ekrandan çıkan img'ler silinir
   her işaret: translate(haritaPiksel(işaret) − solüst)
```

Dokunarak yer seçme:

```
pointerdown ─► surukle = { x, y, oynadi: 0 }
pointermove ─► kaydir(dx, dy), oynadi += |dx| + |dy|
pointerup   ─► oynadi < 6 ve tek parmak ─► tiklaninca(ekranKonumu(olay))
                                         └─ çağıran: işareti koyar, "Kaydet"i açar
```

Yakınlaşırken nokta sabit kalsın diye: önce ekran noktasının enlem/boylamı bulunur, sonra yeni düzeyde o noktanın
pikseli aynı ekran yerine gelecek biçimde merkez yeniden hesaplanır (`yakinlas`).

## Dikkat!

- **OpenStreetMap'in döşeme sunucusu kullanılıyor.** Ücretsizdir ama kullanım kuralları vardır: atıf görünür olmalı
  (`.harita-atif`, kaldırma), istek "geçerli bir Referer" taşımalı, toplu indirme yapılmamalı ve yoğun kullanım için
  kendi döşeme sunucusu önerilir. Sitenin genel `Referrer-Policy: no-referrer` başlığı yüzünden döşeme resimlerine tek
  tek `referrerPolicy = 'strict-origin-when-cross-origin'` konur: OSM yalnız sitenin adını (origin) görür, sayfanın
  adresini (`#/servis?c=…` gibi) görmez. Site büyürse (300 okulluk ağ) döşeme yükü yeniden düşünülmeli; bugün planda bir
  döşeme vekili yok. Servis haritasının 5 saniyelik yenilemesi kendiliğinden döşeme indirmez (yalnız işaretler yeniden
  çizilir, ekrandaki `<img>`'ler yeniden kullanılır); döşeme kaydırınca/yakınlaşınca ya da `19e`'de "Servisi takip et"
  açıkken harita araca yeniden ortalanınca istenir.
- **Döşeme isteği konum ipucu taşır.** İşaretlerin koordinatı dışarı gitmez ama hangi döşemenin istendiği bakılan bölgeyi
  (ör. evin çevresi, 17. düzey) ve kişinin IP adresini OSM'ye söyler. Bu aydınlatma metninde yazılı: public/kvkk/kvkk.html
  "Harita görüntüsü (OpenStreetMap)" maddesi. Dosyanın baş yorumundaki "konum verisi dışarı gitmez" yalnız işaretler için
  doğrudur.
- **Koordinatlar sayı olmalı.** `merkez` ve `merkezle` `+` ile sayıya çevrilir ama `isaretler` çevirmez: süzgeç
  `isFinite` ile yapılır ve `"30.7"` gibi bir metin geçer; sonra `haritaPiksel`'de `boylam + 180` metin birleştirmesi olur
  (`"30.7180"`) ve işaret yanlış yere düşer. Ayrıca `isFinite(null)` doğru döner: `null` koordinatlı işaret ya da
  `merkez: { enlem: null }` (0, 0)'a gider. Bugünkü çağıranlar bunu bilir: sunucu koordinatları sayı olarak verir ve
  `null` olanı işaret listesine koymazlar (`d.okul.enlem !== null` denetimi). Yeni kullanımda aynı özeni göster.
- **`yokEt` dinleyicileri sökmez.** Kutunun kendisine bağlanan olaylar (`pointer*`, `wheel`, `dblclick`, `keydown`) ve
  `harita` sınıfı/`tabindex`/`role` kalır; yalnız iç HTML boşalır ve çizim durur. Aynı kutuda yeniden `haritaKur`
  çağrılırsa eski dinleyiciler de çalışmaya devam eder (çizmezler ama tekerlek ve ok tuşlarında `preventDefault`
  yaparlar). Bugünkü bütün çağıranlar her açılışta kutuyu yeniden yazdığı için yeni bir öğe kullanır; böyle kalsın.
- **Sayfa kaydırması haritada durur.** Tekerlek olayı her zaman `preventDefault` edilir (fare haritanın üstündeyken sayfa
  kaymaz, en uç düzeyde bile) ve CSS'te `touch-action: none` var (telefonda parmak haritanın üstündeyken sayfa kaymaz).
  Harita 340 px; telefonda sayfayı haritanın dışından kaydırmak gerekir.
- **Yakınlaştırma tam sayı düzeylerle.** Çimdik ve tekerlek her seferinde bir düzey atlar; çimdik iki parmağın ortasına
  değil ekranın ortasına göre yakınlaşır. Çimdikten sonra kalan tek parmak, bütün parmaklar kalkana kadar sürükleyemez.
- **Çift tıklama seçimle karışabilir.** `tiklaninca` verilmiş bir haritada çift tıklama, iki `pointerup` dokunuşu olarak
  da sayılır: hem o noktayı seçer hem yakınlaşır (ev seçerken zararsız; seçilen yer zaten tıklanan yer).
- **İşaretler dünya sarılmasında tek kopya.** Döşemeler yatayda sarılır ama işaretler bir kez çizilir; 180. boylam
  çevresinde (Türkiye için önemsiz) işaret yanlış kopyada kalabilir.
- **Döşeme hatası yakalanmaz.** İnmeyen döşeme boş kalır (`alt=""` olduğu için kırık resim simgesi çıkmaz); yeniden
  deneme yok. Ekrandan çıkan döşeme silinir, geri gelince yeniden istenir (tarayıcı önbelleğinden gelir).
  Hizmet çalışanı (`public/sw.js`) döşemeleri önbelleğe almaz.
- **`Math.hypot` ES2015'tir.** Ön yüz kuralı ES5 sözdizimidir; bu bir sözdizimi değil kütüphane işlevi, bütün güncel
  tarayıcılarda var ve `test-kucult.js` yalnız sözdizimini denetler. Pointer Events ve `closest` zaten çok eski
  tarayıcıları dışarıda bırakıyor.
- **Erişilebilirlik:** kutu `role="application"` ve odaklanabilir; ok tuşları ancak harita odaktayken çalışır. Çağıran
  özel `etiket` verirse varsayılan "ok tuşlarıyla kaydır…" açıklaması ekran okuyucuya hiç okunmaz. Bugünkü dört
  çağıranın dördü de etiket veriyor ("Servis haritası" iki yerde, "Okulun konumu", "Çocuğun son konumu"); yani klavye
  ipucu bugün hiçbir haritada okunmuyor. Düzeltme önerisi: ipucunu etiketin sonuna eklemek.
- **Koyu tema:** döşemeler değiştirilmez; CSS bir süzgeçle karartır (`27-harita-ortak.css`).
- Android uygulamasında bu dosyanın karşılığı henüz YOK: "Android yerel uygulama" tanımı bir `Harita.java` planlıyor
  (dış kütüphanesiz OSM döşeme haritası; aynı işaret türleri, renkler, atıf ve "Google Haritalar'da aç"), ama bugün
  Android deposunda harita sınıfı bulunmuyor (servisçinin arka plan konumu `SeferServisi` var, harita yok). O sınıf
  yazıldığında buradaki davranışlar (sınırlar 3–19, çimdik eşikleri, işaret türleri) örnek alınmalı; ikisinden birinde
  davranış değişirse öbürüne de bakılmalı.

## Testleri

- Bu dosyanın otomatik bir testi yok (ne sunucusuz ne tarayıcıda); hiçbir `/api` ucu çağırmadığı için sunucu testleri de
  onu doğrudan korumaz. Haritaya giden verinin doğruluğunu (`/api/servis/harita`, okul konumu) sunucu testleri denetler
  (bkz. [19e-servis-konum.md](19e-servis-konum.md) ve [16b-okul-ayarlari.md](16b-okul-ayarlari.md)).
- Dolaylı: `testler/test-kucult.js` birleşik paketin derlendiğini, `testler/yazim-denetimi.js` ekran metinlerini
  (`aria-label`, düğme yazıları) denetler. Güvenlik başlığındaki `img-src` iznini denetleyen bir test yok.
- `araclar/gezinti.js` ekran turu (test değil) servis sayfalarının ve okul konumunun görüntülerinde haritayı da çeker.
- Elle (sunucu 3200'de, `testler/seed.js` hesapları): müdürle "Okul Adresi ve Konumu" → haritaya dokun: "Okul" seçim
  işareti; sürükle, tekerlekle yakınlaş (imlecin altı sabit kalmalı), sağ üstteki hedef düğmesi işarete ortalar; haritaya
  Tab ile gelip ok tuşları ve `+`/`-`. Telefonda (ya da tarayıcının dokunma öykünmesinde) iki parmakla yakınlaştır;
  koyu temada döşemeler karartılmış görünmeli; sağ altta "© OpenStreetMap katkıda bulunanlar".

## Son durum

- `git log`: tek commit. Dosya `6490596 commit 314` (2026-09-26) ile bugünkü hâliyle eklendi (268 satır) ve o günden beri
  değişmedi: `haritaPiksel`/`haritaKonum`, Google Haritalar yardımcıları, `HARITA_ISARET` (beş tür), `haritaKur` (çizim,
  sürükleme, çimdik, tekerlek, çift tıklama, klavye, düğmeler, `ResizeObserver`, `isaretler`, `sigdir`, `merkezle`,
  `merkez`, `yokEt`). Aynı commit `19c-okul-hayati.js`'e servis kartı ve yönetim ekranlarını getirdi; haritanın CSS'i
  (`27-harita-ortak.css`) ve renk değişkenleri (`00-temel.css`) `1a7f41b commit 316` ile geldi.
- Bilinen açıklar (kod değiştirilmedi): `isaretler`'in metin/`null` koordinatı süzmemesi, `yokEt`'in dinleyicileri
  sökmemesi, tekerleğin sayfa kaydırmasını her zaman engellemesi, klavye ipucunun hiçbir haritada okunmaması.
- Planlı işlerden bu dosyaya dokunması beklenenler (DEVAM.md 4. bölüm):
  - "Düzenleyiciler" (onaylı) — okul sayfası blok düzenleyicisinde bir "harita" bloğu önerildi; yapılırsa bu bileşen
    kullanılabilir.
  - "Çok dil" — düğme `aria-label`'ları, atıf yazısı ve "Google Haritalar'da aç" `c()` kataloğuna geçecek.
  - "KVKK ve onay metinleri TAM denetimi" — dışarı giden veri listesinde harita döşemeleri (OSM) yer alıyor; metin bugün
    bunu söylüyor, denetimde yeniden bakılacak.
  - "Android yerel uygulama" — tanımdaki `Harita.java` (henüz yazılmadı) bu dosyanın eşi olacak; yazılınca ikisi
    birlikte tutulmalı.
