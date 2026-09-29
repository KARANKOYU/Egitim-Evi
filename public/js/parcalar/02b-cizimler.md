# public/js/parcalar/02b-cizimler.js

El yapımı küçük SVG çizimleri (`CIZIMLER`) ve onları `<svg>` olarak veren `cizim()`: açılış sayfasındaki sınıf sahnesi ve
"kim için" kartları, yetişkin hesabının portal kartları, "+ Ekle" penceresi ve "Öğretmen ekle" penceresi.

## Bu dosya ne yapar?

[02-ikonlar.md](02-ikonlar.md)'deki ikonlar tek renkli, 24×24 çizgi simgelerdir. Bazı yerlerde daha "resimli", sıcak bir
görsel gerekiyordu: açılış sayfasında sınıfı anlatan bir sahne, rol kartlarında öğretmen/veli/müdür figürleri, "Çocuğunu
ekle" / "Okulunu açtır" seçenekleri. Bunlar için fotoğraf ya da dış çizim kütüphanesi yerine, elle yazılmış küçük SVG'ler
kullanılır.

Çizimlerde renk YAZILMAZ. Her şekil bir sınıf taşır (`c-cizgi`, `c-dolgu`…), rengi CSS verir. Böylece açık/koyu tema ve
marka rengi değişince çizimler de kendiliğinden uyar.

## İçinde neler var?

### `CIZIMLER`

Ad → SVG şekilleri (metin). Küçük çizimler 64×64 alanda:

| Ad | Ne çizer | Nerede |
|---|---|---|
| `ogretmen` | tahta başında gösteren kişi | açılış "kim için" kartı; öğretmen portal kartı |
| `mudur` | çatısında bayrak olan okul binası | açılış kartı ("Okul yönetimi"); müdür portal kartı |
| `veli` | yetişkin ve çocuk | açılış kartı; veli portal kartı |
| `ogrenci` | kep takmış öğrenci | yalnız açılış kartı |
| `cocuk-ekle` | kişi ve artılı daire | "+ Ekle" → Veli seçeneği; portalı olmayan hesabın boş ekranı |
| `kisi-kodu` | tireyle ayrılmış dört gruplu kod kartı | "+ Ekle" → Öğretmen; boş ekran; müdürün "Öğretmen ekle" penceresi |
| `okul-ac` | okul binası ve artı | "+ Ekle" → Müdür ("Okulunu açtır"); boş ekran; rolü tabloda olmayan portal kartı |

Büyük sahne 320×200 alanda:

- `sinif` — açılış sayfasının sınıf sahnesi: pencere ve güneş, tebeşirle yazılmış satırları ve üçgeni olan yazı tahtası,
  tahtayı gösteren öğretmen, üç sıra, arkadan görünen üç öğrenci (biri parmak kaldırmış), saksıda çiçek.

### Renk sınıfları

`public/css/parcalar/28-yetiskin-hesap.css` (`.cizim …`):

| Sınıf | Görünüm |
|---|---|
| `c-cizgi` | ana çizgi, `currentColor` (yazı rengi) |
| `c-dolgu` | yumuşak zemin, `--ana-acik` |
| `c-vurgu` | vurgu çizgisi, `--ana` (marka rengi) |
| `c-vurgu-dolgu` | vurgu dolgusu, `--ana` |
| `c-sari-dolgu` | güneş sarısı, `--vurgu` |
| `c-tahta` | yazı tahtası, `--ikinci-koyu` (koyu turkuaz) |
| `c-tebesir` | tahtadaki yazı, `--kart` |
| `c-yaprak` | bitki, `--ikinci` (turkuaz) |

### `CIZIM_ALANI` ve `cizim(ad, ek)`

- `CIZIM_ALANI` — çizim alanı farklı olanlar: `{ sinif: '0 0 320 200' }`; öteki hepsi `0 0 64 64`.
- `cizim(ad, ek)` — `<svg class="cizim [ek]" viewBox="…" aria-hidden="true" focusable="false">…</svg>`. Bilinmeyen ad →
  `''`. `ek` ek sınıftır: `v-sahne` (açılış sahnesi), `vitrin-cizim` (açılıştaki varsayılan), `portal-kart-cizim`,
  `ekle-panel-cizim`.

## Kimle konuşur?

- Çağırdıkları: hiçbir şey (düz metin birleştirir; `esc` bile gerekmez, içinde kullanıcı verisi yok).
- Onu kullananlar (`cizim()` çağrısı):
  - `05a-dis-sayfalar.js` — `disSayfalariKur`: `index.html`'deki `data-cizim="…"` yerlerini doldurur (`data-cizim-sinif`
    varsa ek sınıf o, yoksa `vitrin-cizim`). Bugün `index.html`'de `sinif` (`v-sahne` sınıfıyla) ve `ogrenci`, `veli`,
    `ogretmen`, `mudur` (açılıştaki "kim için" kartları) var.
  - `08c-kisilikler.js` — portal kartları (`PORTAL_SIMGE`: `teacher` → `ogretmen`, `principal` → `mudur`, `parent` →
    `veli`, başka rol → `okul-ac`), portalı olmayan hesabın boş ekranı (üç çizim yan yana), "+ Ekle" seçenekleri
    (`EKLE_SECENEK`: Veli `cocuk-ekle`, Öğretmen `kisi-kodu`, Müdür `okul-ac`) ve seçilen seçeneğin paneli.
  - `10b-hesaplar.js` — müdürün "Öğretmen ekle" (kişi koduyla) penceresi: `kisi-kodu`.
  - `CIZIMLER` ve `CIZIM_ALANI`'ya bu dosya dışında doğrudan dokunan yok.
- CSS: renkler ve çizgi kalınlığı `28-yetiskin-hesap.css` (`.cizim` 56×56, `.vitrin-kim-cizim .cizim` 64×64,
  `.portal-kart > .cizim` 52×52, `.ekle-kutu .cizim` 60×60, telefonda 44×44); açılış sahnesinin boyu
  `29-dis-sayfalar.css` (`.v-gorsel .cizim.v-sahne`: tam genişlik, 320/200 oranı).
- Rol: açılış sayfası giriş yapmamış herkese; portal kartları ve "+ Ekle" yetişkin hesabına (veli, öğretmen, müdür adayı);
  "Öğretmen ekle" müdüre.

## Nasıl çalışır (adım adım)?

```
index.html:  <span data-cizim="sinif" data-cizim-sinif="v-sahne"></span>
                 │  açılışta 05a-dis-sayfalar.js disSayfalariKur()
                 ▼
cizim('sinif', 'v-sahne')
   yol = CIZIMLER.sinif, alan = CIZIM_ALANI.sinif ('0 0 320 200')
   ─► '<svg class="cizim v-sahne" viewBox="0 0 320 200" aria-hidden="true" focusable="false">…</svg>'
                 │
                 ▼
28-yetiskin-hesap.css: .cizim .c-tahta { fill: var(--ikinci-koyu) } …   (tema değişince renk kendiliğinden değişir)
```

Portal kartında: `08c-kisilikler.js` her portal için `cizim(PORTAL_SIMGE[p.rol] || 'okul-ac', 'portal-kart-cizim')`
yazar; kart kapalıysa (okul kapalı) CSS çizimi soluklaştırır (`.portal-kart.kapali > .cizim { opacity: .6 }`).

## Dikkat!

- **Renk yazma, sınıf kullan.** Yeni bir çizime `fill="#…"`/`stroke="#…"` yazarsan koyu temada kaybolur. Var olan sekiz
  sınıftan birini seç; yeni bir renk gerekiyorsa `28-yetiskin-hesap.css`'e sınıf ekle.
- **Yeni büyük sahne eklersen `CIZIM_ALANI`'na da yaz**, yoksa 64×64 alanda kırpılır.
- **Çizimler süstür, anlam taşımaz:** `aria-hidden="true"` ekran okuyucudan gizler, `focusable="false"` eski
  tarayıcılarda (Internet Explorer, eski Edge) SVG'nin klavyeyle odaklanmasını önler. Anlamı yanındaki yazı verir; yazısız
  bir çizim koyma.
- **Dosyanın baş yorumunda CSS dosyasının adı geçiyor** (`28-yetiskin-hesap.css`); CSS parçası yeniden adlandırılırsa yorumu
  da güncelle.
- **`kisi-kodu` çizimi kodun gerçek uzunluğunu göstermez:** 16 karakterlik kodu (harf, rakam ve işaretten oluşur; ekranda
  dört grup, `05-giris.js` `KISI_KODU_GECERLI`) simgeler, her grupta yalnız iki çubuk var.
- `ogrenci` çizimi bugün yalnız açılış sayfasında; öğrencinin portal kartı yok (`PORTAL_SIMGE`'de `student` yok).
- `ek` sınıfı kaçırılmadan yazılır; `05a-dis-sayfalar.js` onu `index.html`'deki sabit `data-cizim-sinif`'ten alır. Buraya
  kullanıcıdan gelen bir değer verme.

## Testleri

- Bu dosyanın doğrudan testi yok.
- `testler/test-kucult.js` — paket derleniyor mu (uzun metin birleştirmeleri yorumsuz hâlde de bozulmuyor mu).
- Elle: `/` açılış sayfasında sınıf sahnesi ve dört rol çizimi görünmeli; koyu temaya geç, çizimler okunaklı kalmalı.
  Rolü olmayan yeni bir yetişkin hesabıyla gir: boş ekranda üç çizim, "+ Ekle"de üç seçenek çizimi görünmeli.

## Son durum

- `git log`: 4 commit. Son değişiklik `153d63d commit 522` (2026-09-27, kişi kodu 16 hane): `kisi-kodu` çizimi üç gruplu
  (5'erli) karttan tireyle ayrılmış dört gruplu (4'erli) karta çevrildi, kart biraz genişledi. Ondan önce `0acca75 commit
  516` (2026-09-27, kayıt/kişi kodu/portallar): `ogretmen-kodu` çizimi `kisi-kodu`, `okul-kaydet` çizimi `okul-ac` adını
  aldı; kod kartındaki çubuklar da tireyle ayrılmış iki üçlü gruptan (6 çubuk) tiresiz üç gruba (3 + 3 + 2 çubuk)
  çevrildi; baş yorum "rol seçimi" yerine "portallar, + Ekle penceresi" oldu. Dosya `3fa4626 commit 375` (2026-09-26) ile
  `CIZIMLER`, `sinif` sahnesi ve `CIZIM_ALANI` olarak geldi; `61ddc51 commit 376` (aynı gün) `cizim()` işlevini ekledi.
- Açık iş yok.
- Planlı işlerden bu dosyaya dokunması beklenen: "Tek kişi tek hesap + portallar öğrencide de" — öğrenci hesabında da
  "Portallarım" kartları olacak (öğrenci · okul, öğrenci · dershane); `PORTAL_SIMGE`'ye `student` → `ogrenci` eşlemesi
  ve belki kurum türüne göre çizim gerekecek. Aynı işte 18 yaş altındaki hesapta "+ Ekle"nin Müdür/Öğretmen/Veli
  seçenekleri soluk görünecek (çizimler `08c-kisilikler.js`'teki kutularda).
