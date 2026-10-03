# testler/test-okul-sayfasi.js

Okulun herkese açık giriş sayfasını (`/api/okul-sayfa`, `/api/okul-foto`, `/api/okul-adres`) deneyen sunuculu paket: kim
düzenler (müdür ve "Kodlayıcı"), ayarların ve CSS'in temizlenmesi, girişsiz görünüm, fotoğrafın türünün baytlarından
anlaşılması ve konum bilgisinin silinmesi, kapak tekliği ve 8'lik galeri, başka okulun dokunamaması (41 denetim).

## Bu dosya ne yapar?

Okul sayfası `egitimevi.org/school/<okulun-kısa-adı>` adresinde, giriş kartının hemen üstünde, herkesin (girişsiz)
gördüğü bir vitrindir ([../sunucu/bolumler/okul-sayfasi.md](../sunucu/bolumler/okul-sayfasi.md)). Herkese açık olduğu için
iki büyük tehlike var ve bu paket ikisini de dener:

- **Sahte giriş formu / dışarıya istek:** düzenleyenin yazdığı CSS giriş kartını örtmemeli, dış adresten bir şey yükletmemeli,
  "Şifreni buraya yaz" gibi sahte yazı koymamalı. Paket bilerek kötü bir CSS gönderir ve geriye yalnız izinli kuralların,
  sayfanın kutusuna (`.okul-sayfa`) bağlanmış olarak kaldığını, atılan her şeyin nedeninin söylendiğini görür
  ([../sunucu/yardimci/css-temizle.md](../sunucu/yardimci/css-temizle.md)).
- **Sahte dosya / gizli bilgi:** `.png` diye gelen HTML ya da SVG kabul edilmemeli; telefonla çekilmiş fotoğrafın içindeki konum
  (EXIF, PNG yazı parçası) herkese dağılmamalı, ama JPEG'in yönü korunmalı ([../sunucu/yardimci/resim.md](../sunucu/yardimci/resim.md)).
  Paket bu durumları birkaç baytlık elle kurulmuş PNG ve JPEG dosyalarıyla dener ve sunucunun geri verdiği baytlara bakar.

Ayrıca yetkiyi (müdür, `okul.sayfa` yetkili "Kodlayıcı" öğretmen, rolsüz öğretmen, girişsiz), sınırları (8000 harf CSS, 3 MB,
8 galeri fotoğrafı) ve başka okulun müdürünün bizim fotoğraflarımıza dokunamamasını denetler.

## İçinde neler var?

### Yardımcılar ve sahte dosyalar

- `kontrol(ad, sart, detay)`; `J(x)` — `JSON.stringify(x).slice(0, 240)`; `z` — `Date.now().toString(36)`.
- `yukle(token, yer, veri, tur)` — `POST /api/okul-sayfa/foto?yer=<yer>` isteğini çıplak `fetch` ile atar: gövde dosyanın
  kendisi, `Content-Type` `tur` (verilmezse `image/png`), oturum varsa `Authorization`. Cevap JSON değilse gövde `{}`.
  Dönen `{ status, body }`.
- `PNG` — 1×1 piksellik en küçük PNG (base64 sabiti).
- `pngYaziyla(yazi)` — `PNG`'nin 33. baytından (8 baytlık imza + `IHDR` parçası) sonra `Comment\0<yazı>` taşıyan bir `tEXt`
  parçası ekler. Parçanın CRC'si sıfır bırakılır (sunucu CRC denetlemez).
- `JPEG` — en küçük JPEG (base64 sabiti).
- `jpegExifli(gizli)` — JPEG'in başına (SOI'den hemen sonra) bir `APP1` (`FF E1`) EXIF bölümü koyar: küçük uçlu TIFF, tek
  kayıt `0x0112` (Orientation) = 6, arkasında `gizli` yazı. Sunucu yazıyı silip yalnız yönü taşıyan yeni bir EXIF yazmalı.
- **Hesaplar** ([seed.md](seed.md)): yönetici `admin@egitimevi.com` (`A`, şifresi `EE_ADMIN_SIFRE`), müdür `mudur@test.com`
  (`M`), öğretmenler `mat@test.com` ve `fen@test.com`. Paketin açtığı: ikinci müdür `sayfa.mudur<z>` (`M2`, şifre
  `Test1234!`) — `hesapAc` + `mudurYap` ile yönetici "Sayfa Okulu <z>" (Ankara / Mamak) okulunu açar.
- Ortak yardımcılar [giris.md](giris.md) üzerinden ([../araclar/giris.md](../araclar/giris.md)): `BASE`, `iste`, `girisYap`,
  `hesapAc`, `mudurYap`.

### 1) Kim düzenler (7)

- `M` `GET /api/okul-sayfa` → 200; `okul.kisaAd` dolu (3. bölümde okul adresi bununla aranır), `fotolar` dizi.
- `mat` `POST /api/okul-sayfa { tanitim: 'x' }` → 403; girişsiz `GET` → 401.
- `GET /api/school/permissions` → `sablonlar` içinde "Kodlayıcı" var ve yetkileri tam olarak `okul.konum` ile `okul.sayfa`.
- `M` "Kodlayıcı <z>" rolünü yalnız `okul.sayfa` ile açar (`POST /api/school/role`) ve `mat`'a verir
  (`POST /api/school/role-assign`) → ikisi 200. Artık `mat` `GET` → 200; rolsüz `fen` → 403.

### 2) Kaydetme ve CSS temizliği (10)

`mat` (Kodlayıcı) kaydeder: tanıtım `"<script>alert(1)</script>\n\nİkinci paragraf."`, ayarlar `{ renk: '#AABBCC', zemin:
'red; background:url(x)', baslikBoyu: 'buyuk', hiza: 'yan', galeriSutun: 4 }` ve on satırlık bilerek kötü CSS: `position`,
`z-index`, `url(...)`, `@import`, uygulamanın kendi seçicisi `.auth-card`, `body`, `::after` ile `content: "Şifreni buraya
yaz"`, ters bölüyle gizlenmiş renk (`r\65 d`), `margin-top: -900px`, `transform`; arada izinli kurallar.

- 200 ("kaydedildi").
- Ayarlar: `renk` `#aabbcc` (küçük harf), bozuk `zemin` `''` (varsayılan), `baslikBoyu` `buyuk`, tanınmayan `hiza` `sol`
  (varsayılan), `galeriSutun` `'4'` (metin).
- `temizCss` içinde `.okul-sayfa .os-baslik { color: #c0392b; font-size: 32px; }` ve `.okul-sayfa .os-foto:hover { opacity: .8;
  border-radius: 12px; }` var.
- `temizCss`'te `url`, `@import`, `position`, `z-index`, `transform`, `content` ve kötü alan adı yok; `auth-card`, `body`,
  `os-yer` yok; `-900` ve ters bölü yok; her satır `.okul-sayfa ` ile başlıyor.
- `uyarilar` en az 6.
- `M` 8001 harflik CSS → 400.
- `POST /api/okul-sayfa/onizle { css: '.os-baslik { color: blue; background: url(x) }' }` → 200, `color: blue` kalmış, `url`
  gitmiş, tek uyarı (kaydetmeden).

Aynı CSS'i 3 Ekim'de `cssTemizle`'ye doğrudan (sunucusuz) verdim: dört kural kalıyor (`.os-baslik`, `.os-kutu { padding:
20px; }`, `.os-foto:hover`, `.os-ust > .os-logo { width: 90px; }`) ve 10 uyarı çıkıyor; paket "en az 6" der.

### 3) Herkese açık görünüm (3)

- Girişsiz `GET /api/okul-adres?kisa=<kısa ad>` → 200, `sayfa` dolu.
- `sayfa.css` kaydetmenin `temizCss`'iyle birebir aynı (dışarı ham CSS gitmez).
- `sayfa.tanitim` gönderilen metnin aynısı: `<script>` düz metin olarak saklanır, ekrana çizerken kaçırılır (ön yüzün işi).

### 4) Fotoğraflar (16)

| Deneme | Beklenen |
|---|---|
| `M`, kapak: HTML gövdesi `image/png` diye | 400 (tür baytlardan anlaşılır) |
| `M`, kapak: `<script>`li SVG, `image/svg+xml` | 400 |
| `M`, galeri: `PNG` + 3 MB sıfır | 413 |
| `M`, `yer=arka` | 400 |
| girişsiz kapak | 401 |
| `fen` (rolsüz) kapak | 403 |
| `M`, kapak: `pngYaziyla('GIZLI-KONUM-41.0082')` | 200, `foto.id` 32 haneli onaltılık |
| girişsiz `GET /api/okul-foto/<id>` | 200, `Content-Type: image/png`, `X-Content-Type-Options: nosniff` |
| inen baytlar | `GIZLI-KONUM` yok, ilk 8 bayt PNG imzası, boyu tam olarak yazısız `PNG`'nin boyu |
| `M`, logo: `jpegExifli('GPS-GIZLI-KONUM')`, `image/jpeg` | 200; inen baytlarda `GPS-GIZLI` yok |
| inen JPEG'de `12 01 03 00 01 00 00 00 06 00` | var (Orientation kaydı, değer 6: yön korundu) |
| `M`, yeni kapak (`PNG`) | 200; `GET /api/okul-sayfa`'da tek kapak, o da yenisi |
| eski kapağın adresi | 404 |
| galeriye 8 fotoğraf, sonra 9. | 8.'si 200, 9.'su 400 |
| `POST /api/okul-sayfa/foto-aciklama { id, aciklama: 'Bilim fuarı' }` | 200 |
| girişsiz `GET /api/okul-adres?kisa=` | 10 fotoğraf (kapak, logo, 8 galeri), ilki kapak, biri "Bilim fuarı" açıklamalı |

### 5) Başka okul (4)

- `M2`, bizim galerideki son fotoğrafa `foto-sil` ve `foto-aciklama` → ikisi de 404.
- `M2` `GET /api/okul-sayfa` → 200, kendi sayfası boş (`fotolar` boş, `tanitim` `''`).
- `M` aynı fotoğrafı siler → 200; adresi artık 404.
- `GET /api/okul-foto/..%2F..%2Fayarlar.json` → 404 (kimlik biçimi denetimi; dosya yolu kaçışı yok).

### 6) İşlem kaydı (1)

- `M` `GET /api/islem-kaydi` → `kayitlar` içinde adı `okul-sayfa` geçen bir işlem var (`okul-sayfa.duzenlendi`,
  `okul-sayfa.foto`, `okul-sayfa.foto-silindi`).

Toplam 7 + 10 + 3 + 16 + 4 + 1 = 41. Sonunda `GECTI: 41   KALDI: 0`; `KALDI` varsa çıkış kodu 1; beklenmeyen hata `TEST HATASI:`
ile iletiyi ve yığını yazar.

## Kimle konuşur?

- **Modüller:** yalnız [giris.md](giris.md) (`araclar/giris.js`); Node'un genel `fetch`'i (yükleme ve fotoğraf indirme).
- **Sunucu uçları:**

  | Uç | Ne için | Belge |
  |---|---|---|
  | `GET/POST /api/okul-sayfa`, `POST /api/okul-sayfa/onizle`, `POST /api/okul-sayfa/foto?yer=`, `foto-sil`, `foto-aciklama`, `GET /api/okul-foto/<id>` | denenen bölüm | [../sunucu/bolumler/okul-sayfasi.md](../sunucu/bolumler/okul-sayfasi.md) |
  | `GET /api/okul-adres?kisa=` | girişsiz görünüm (`okulSayfasiGorunumu`) | [../sunucu/bolumler/kayit.md](../sunucu/bolumler/kayit.md) |
  | `GET /api/school/permissions`, `POST /api/school/role`, `POST /api/school/role-assign` | "Kodlayıcı" şablonu ve rolü | [../sunucu/bolumler/okul.md](../sunucu/bolumler/okul.md) |
  | `GET /api/islem-kaydi` | `okul-sayfa.*` kayıtları | [../sunucu/bolumler/islem-kaydi.md](../sunucu/bolumler/islem-kaydi.md) |
  | `GET /api/challenge`, `POST /api/register`, `POST /api/eposta-onay`, `POST /api/login`, `POST /api/login/dogrula`, `GET /api/kisilikler`, `POST /api/admin/okul-ac`, `POST /api/logout` | girişler, ikinci okul | [../sunucu/bolumler/kayit.md](../sunucu/bolumler/kayit.md) (kayıt, onay, giriş, çıkış), [../sunucu/bolumler/kisilik.md](../sunucu/bolumler/kisilik.md) (`kisilikler`: kişi kodu), [../sunucu/bolumler/yonetici-okul.md](../sunucu/bolumler/yonetici-okul.md) (`okul-ac`) |

- **Koruduğu kod:** `sunucu/bolumler/okul-sayfasi.js` — `uclar` (düzenleme, önizleme, açıklama, silme, `okul-foto`),
  `fotoYukle` (yetki, yer, 3 MB, galeri sınırı, kapak/logo tekliği), `ayarlariTemizle`, `tanitimTemizle`,
  `okulSayfasiGorunumu`; `sunucu/yardimci/css-temizle.js` (`cssTemizle`); `sunucu/yardimci/resim.js` (`resmiTemizle`: PNG
  `tEXt` silme, JPEG `APP1` silip yön yazma, tür tanıma); `sunucu/yetki.js`'teki "Kodlayıcı" şablonu ve `okul.sayfa` yetkisi
  ([../sunucu/yetki.md](../sunucu/yetki.md)); depo [../sunucu/veri/depo/okul-sayfalari.md](../sunucu/veri/depo/okul-sayfalari.md);
  `nosniff` başlığı (`baslikEkle`, [../sunucu/http.md](../sunucu/http.md)).
- **Tablolar ve dosyalar:** `okul_sayfalari`, `okul_fotolari`, `roller`, `rol_yetkileri`, `islem_kaydi`
  ([../sunucu/veri/sema/SEMA.md](../sunucu/veri/sema/SEMA.md)); fotoğraf dosyaları test sunucusunun veri klasöründe
  (`testler/testdata/okul-fotolari/`).
- **Ön yüz** (bu pakette tarayıcı yok): [../public/js/parcalar/19g-okul-sayfasi.md](../public/js/parcalar/19g-okul-sayfasi.md)
  (düzenleme ekranı ve vitrin), [../public/js/parcalar/05a-dis-sayfalar.md](../public/js/parcalar/05a-dis-sayfalar.md)
  (okul adresinin verisi).
- **Onu çalıştıran:** `testler/tumtest.sh`, sunuculu döngüde `test-adresler`'den sonra, `test-yorum-ek`'ten önce; her paketten
  önce veritabanı sıfırlanır ve [seed.md](seed.md) çalışır.

## Nasıl çalışır (adım adım)?

```
A, M, mat, fen girer
1) M ekranı açar (kısa ad) ; mat 403 ; girişsiz 401 ; şablon "Kodlayıcı" = okul.konum + okul.sayfa
   M rol "Kodlayıcı <z>" (okul.sayfa) ─► mat'a ver ─► mat 200 ; fen 403
2) mat kaydet (kötü CSS + bozuk ayarlar + <script>'li tanıtım) ─► ayarlar düzeldi ; temizCss yalnız izinli, .okul-sayfa'ya bağlı
   M 8001 harf 400 ; önizleme kaydetmeden temizler
3) girişsiz okul-adres ─► sayfa.css = temizCss ; tanıtım düz metin
4) sahte HTML / SVG 400 ; 3 MB üstü 413 ; yer yok 400 ; girişsiz 401 ; fen 403
   PNG + tEXt ─► indir ─► yazı yok, boy aynı ; JPEG + EXIF ─► konum yok, yön 6 var
   yeni kapak ─► tek kapak, eskisi 404 ; galeri 8 + 1 ─► 9. red ; açıklama ; okul-adres 10 fotoğraf
5) M2 (Sayfa Okulu) ─► sil/açıklama 404 ; kendi sayfası boş ; M siler ─► 404 ; "../" kimlik 404
6) işlem kaydında okul-sayfa.*
```

## Dikkat!

- **Taze veritabanı ister.** 3 Ekim'de 3200'de aynı veritabanında ikinci kez çalıştırıldı (denetimde bir kez daha denendi,
  sonuç aynı): "yetkisiz ogretmen duzenleyemiyor"
  kaldı (`mat` ilk koşudan "Kodlayıcı" rolünü taşıyor, 200 aldı), "galeriye 8 fotograf, 9. reddedildi" kaldı (galeride 7
  fotoğraf kalmıştı; ilk yükleme 8.'yi doldurdu, kalan yedisi 400 aldı), sonra paket `TEST HATASI: … reading 'id'` ile durdu
  (son galeri yüklemesi 400 olduğu için `galeriSon.body.foto` yoktu). `tumtest.sh` gibi her koşudan önce sıfırla.
- **Sahte PNG parçasının CRC'si sıfır.** Sunucu bugün PNG parçalarının CRC'sini denetlemediği için kabul ediyor
  ([../sunucu/yardimci/resim.md](../sunucu/yardimci/resim.md)). Sunucuya CRC denetimi eklenirse `pngYaziyla` gerçek CRC
  hesaplamalı, yoksa "PNG kapak yuklendi" ve ondan sonraki fotoğraf denetimleri yanlışlıkla kalır.
- **Bayt düzeyinde beklentiler:** PNG'de "boy tam olarak yazısız PNG'nin boyu", JPEG'de yön kaydının bayt dizisi aranır. Sunucu
  fotoğrafı yeniden kodlarsa ya da EXIF'i başka biçimde yazarsa (ör. büyük uçlu) bu iki denetim davranış doğru olsa da kalır.
- **6. bölümdeki yedek alan adları ölü.** Denetim `kayitlar || islemler || items` ve `islem || tur` diye bakar; API yalnız
  `kayitlar` ve `islem` döner, öbürleri hiç kullanılmıyor (zararsız).
- **Denenmeyenler:** düzenleyenin aydınlatma onayı eski / şifresi değişmeli iken 403, okulun saatlik 40 yükleme sınırı (koda
  göre saydım: bir koşu bu sınıra okul başına 15 yükleme sayar, yer ve yetki reddi sayılmaz), okulun disk sınırı (507; `testler/test-okul-disk.js`'te), `fotoSupur`, WebP, tanıtımın
  1500 harf sınırı ve ayarların öbür seçenekleri (`kapakBoyu`, `genislik`), `okul.sayfa` yetkili ama öğretmen/müdür olmayan
  kişi.
- **Seed ve şablona bağlı:** "Kodlayıcı" şablonunun adı ve iki yetkisi `sunucu/yetki.js`'ten gelir; şablon değişirse 1. bölüm
  kalır.
- **Varsayılan adres 3000.** `EE_BASE` vermezsen kendi sunucunda okul sayfasını değiştirir, fotoğraf yükler ve okul açar.
  Kodlar `EE_LOG`'dan okunur ([giris.md](giris.md)).

## Testleri

- Bu dosyanın kendisi testtir; `testler/tumtest.sh` her tam koşuda çalıştırır. Aynı bölümün başka yönleri: [test-okul-disk.md](test-okul-disk.md)
  (fotoğraf yüklemesinin okulun disk sınırına sayılması, 507), [test-okul-agi.md](test-okul-agi.md) (tek IP'den çok sayıda
  fotoğraf indirme, dakikada 4000 sınırı), `testler/test-resim-kucult.js` (ön yüzün küçültülen fotoğrafı bu uca göndermesi,
  sunucusuz), [test-gizli-dosyalar.md](test-gizli-dosyalar.md) (`data/okul-fotolari/` depoya girmiyor).
- Elle (Git Bash, proje kökünde; 3200'de sıfırlanmış `egitimevi_test` ile açılmış ve [seed.md](seed.md) ile tohumlanmış test
  sunucusu varken):

  ```
  EE_BASE=http://localhost:3200 EE_LOG=testler/test-sunucu.log node testler/test-okul-sayfasi.js
  ```

- 3 Ekim'de bu belge için 3200'de, yeni sıfırlanmış test veritabanı ve seed'le iki ayrı sunucu açılışında çalıştırıldı: ikisinde
  de `GECTI: 41   KALDI: 0`, çıkış 0 (ilk koşu yaklaşık 1,4 saniye); sunucu günlüğünde `API hatası` ya da `Veritabanı hatası` yok. İkinci
  açılışta aynı veritabanında yapılan ikinci koşunun sonucu "Dikkat!"te.

## Son durum

- `git log`: 3 commit.
  - `e384484 commit 392` (2026-09-26): dosya okul sayfası bölümüyle 192 satır olarak eklendi; altı bölümün hepsi o günden.
  - `7a8b555 commit 504` (2026-09-26): "Kodlayıcı" şablonu denetimi "yalnız `okul.sayfa`"dan "yalnız `okul.sayfa` ve
    `okul.konum`"a çevrildi (şablona okulun haritadaki konumunu düzenleme yetkisi eklenmişti); karşılaştırma sıralanmış
    listeyle yapılır oldu.
  - `fe018dd commit 513` (2026-09-26): yalnız baş yorumu — adres `egitimevi.org/<okulun-adi>` yerine
    `egitimevi.org/school/<okulun-adi>`. O günden beri değişmedi.
- Bilinen açıklar (kod değiştirilmedi): taze veritabanı şartı, CRC'siz sahte PNG, ölü yedek alan adları.
- Planlı işlerden bu dosyayı etkileyecekler:
  - **"Özel roller"** (öneri, onay bekliyor) — "Kodlayıcı" şablonu "Kodlayıcı / Tasarımcı" adını ve `okul.simge` yetkisini
    alacak; 1. bölümdeki şablon denetimi (ad ve tam yetki listesi) değişmeli.
  - **"Paneller … okul simgesi (müdür yükler, 128×128 beyaz dolgulu) … /duzenle okul sayfaları"** — okul sayfasının yanına yeni
    bir resim türü ve yönetimden düzenleme gelecek; yeni uçlar bu pakete ya da yeni bir pakete eklenmeli.
  - **"Düzenleyiciler"** (onaylı: okul sayfası blokları, ortak yazı düzenleyici) — sayfa sabit yapıdan bloklara, tanıtım düz
    metinden biçimli metne geçecek; 2. ve 3. bölümdeki tanıtım ve görünüm beklentileri yeniden yazılmalı.
  - **"Sunucuda küçültme … aynı dosya tek kopya"** — 1,5 MB / 2048 px üstü resimler sunucuda küçültülecek ve aynı içerik diskte
    tek kopya tutulacak; paketin küçük test resimleri eşiğin altında kalır ama aynı PNG'yi defalarca yükleyip silen 4. ve 5.
    bölüm o işte yeniden denenmeli.
  - **"Sistem: yöneticiye ZORUNLU TOTP …"** ve **"T.C. KİMLİK NO BÜTÜN HESAPLARDA ZORUNLU"** (kod Linux'ta) — 5. bölümdeki
    ikinci müdürün açılışı (`hesapAc`, yönetici girişi, `mudurYap`) buna göre değişmeli.
