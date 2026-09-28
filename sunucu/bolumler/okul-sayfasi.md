# sunucu/bolumler/okul-sayfasi.js

Okulun giriş sayfası (`/api/okul-sayfa`, `/api/okul-foto`): okulun kendi adresinde giriş kartının üstünde duran kapak,
logo, tanıtım yazısı, galeri, renkler ve kısıtlı CSS'in düzenlenmesi ve herkese açık fotoğrafların sunulması.

## Bu dosya ne yapar?

Her okulun bir giriş adresi var (`egitimevi.org/school/<okulun-kısa-adı>`). Orada eskiden yalnız giriş kartı dururdu;
bu dosya okula o kartın üstüne bir "vitrin" koyma imkânı verir: kapak fotoğrafı, logo, en çok 8 fotoğraflık galeri,
1500 harflik tanıtım yazısı, birkaç görünüm seçeneği (renkler, başlık ve kapak boyu, hiza, genişlik, galeri sütunu) ve
isteyen için kısıtlı CSS.

Güvenlik için serbest HTML ve betik YOK (dosya başı yorumu): sayfanın yapısı sabit, yazı düz metin, görünüm yalnız
ayarlarla ve `sunucu/yardimci/css-temizle.js`'ten geçen CSS ile değişir. Fotoğrafın türü uzantısından değil
baytlarından anlaşılır, konum (EXIF) bilgisi silinir (`sunucu/yardimci/resim.js`). Fotoğraflar okulun disk sınırına
sayılır ([okul-disk.md](okul-disk.md)).

Düzenleyen: müdür ya da `okul.sayfa` yetkisi verilmiş öğretmen (hazır rol şablonu "Kodlayıcı"). Sayfanın herkese giden
hâli bu dosyanın `okulSayfasiGorunumu` işleviyle `GET /api/okul-adres?kisa=` cevabına girer ([kayit.md](kayit.md)).

## İçinde neler var?

### Sabitler

- `KLASOR` — `DATA/okul-fotolari` (fotoğraf dosyaları; adları 32 haneli onaltılık kimlik, uzantısız).
- `FOTO_SINIR` — 3 MB (tek fotoğraf). `GALERI_SINIR` — 8. `TANITIM_SINIR` — 1500 harf.
- `FOTO_ID` — `/^[0-9a-f]{32}$/`. `YERLER` — `['kapak', 'logo', 'galeri']`.
- `RENK` — yalnız `#rrggbb` (küçük harfe çevrilerek). `SECENEKLER` — her ayarın izinli değerleri, ilki varsayılan:
  `baslikBoyu` orta/kucuk/buyuk, `kapakBoyu` orta/kisa/uzun, `hiza` sol/orta, `genislik` genis/dar, `galeriSutun`
  3/2/4.

### Dışa açılan işlevler

- `uclar(k)` — aşağıdaki uçlar.
- `fotoYukle(k)` — fotoğraf yükleme; gövde JSON değil dosyanın kendisi olduğu için `api.js` JSON okuyucusundan ÖNCE
  buraya verir (`k = { req, res, me, q, kvkkGuncel, sifreTamam }`). Ayrıntı aşağıda.
- `fotoSupur()` — `KLASOR`'deki kaydı olmayan ya da adı kimlik biçiminde olmayan, 1 saatten eski dosyaları siler;
  silinen sayısını döner. `sunucu/index.js` açılıştan 90 sn sonra ve 6 saatte bir çağırır.
- `okulSayfasiGorunumu(okulId)` — herkese giden görünüm: `{ tanitim, ayarlar, css (temizlenmiş), fotolar: [{ id, yer,
  aciklama }] }`; sayfası hiç düzenlenmemiş ve fotoğrafı olmayan okulda `null` (giriş sayfası eskisi gibi yalnız kart).
- `ayarlariTemizle(a)` — bilinmeyen/bozuk her ayarı varsayılana, bozuk rengi `''`'e çevirir. Başka dosya çağırmıyor.

### İç işlevler

- `tanitimTemizle(s)` — satır sonlarını `\n`'e çevirir, denetim karakterlerini atar, üçten çok boş satırı ikiye indirir,
  kırpar, 1500 harfle keser.
- `govdeOku(req, sinir)` — gövdeyi belleğe okur; sınırı aşarsa `null`. Kod yorumu: bağlantı hemen koparılırsa istemci
  413 cevabını göremiyor; akış durdurulur, cevap yazılır, bağlantı 1,5 sn sonra kapanır.
- `fotoDosyasiniSil(id)`, `dosyaYolu(id)`.
- `duzenleyemez(res, me)` — girişsizse 401 "Giriş yapmalısın"; onaylı değil, okulsuz, müdür/öğretmen değil ya da
  `okul.sayfa` yetkisi yoksa 403 "Okul sayfasını düzenleme yetkin yok.".
- `fotoGonder(req, res, id)` — herkese açık fotoğraf.

### Uçlar

- **`GET /api/okul-foto/<id>`** — HERKESE AÇIK (girişsiz de). IP başına dakikada 4000 istek (429 "Çok fazla istek.
  Biraz bekle."). Kimlik biçimi bozuksa, kayıt ya da dosya yoksa 404 "Fotoğraf bulunamadı". Cevap dosyanın kendisi:
  `Content-Type` kayıttaki tür, `Content-Disposition: inline`, `Cache-Control: public, max-age=604800, immutable`
  (kimlik değişmediği için 7 gün önbellek). Ortak güvenlik başlıkları `baslikEkle` ile eklenir.
- **`GET /api/okul-sayfa`** — düzenleme ekranı (`duzenleyemez` kapısı): `{ okul: { ad, il, ilce, kisaAd }, tanitim,
  ayarlar, css (ham), temizCss, uyarilar, fotolar: [{ id, yer, aciklama, boyut }], guncelleme }`.
- **`POST /api/okul-sayfa/onizle`** — gövde `{ css }`; kaydetmeden `cssTemizle` sonucu `{ css, uyarilar }`.
- **`POST /api/okul-sayfa`** — kaydet. Gövde `{ tanitim, ayarlar, css }`. CSS 8000 harften uzunsa 400 `{ error: 'CSS en
  fazla 8000 karakter olabilir.', alan: 'css' }`. Tanıtım ve ayarlar temizlenir; CSS HAM hâliyle (yalnız satır sonu
  düzeltilmiş) saklanır, gösterirken temizlenir. İşlem kaydı `okul-sayfa.duzenlendi`. Cevap `{ ayarlar, tanitim, css,
  temizCss, uyarilar, message }`; CSS'in bir kısmı atıldıysa mesaj "Kaydedildi. CSS'in bazı kısımları kullanılamadığı
  için atıldı; aşağıda nedenleri var.", değilse "Okul sayfası kaydedildi.".
- **`POST /api/okul-sayfa/foto?yer=kapak|logo|galeri`** (`fotoYukle`) — sıra:
  1. girişsiz 401; aydınlatma onayı eski 403; şifre değişmeli 403; düzenleme yetkisi yok 403 (her redde `req.resume()`
     ile gövde boşaltılır);
  2. `yer` geçersizse 400 "Fotoğrafın yeri belli değil (kapak, logo ya da galeri).";
  3. okul başına saatte 40 yükleme (429 "Bir saatte çok fazla fotoğraf yüklendi. Biraz bekle.");
  4. `Content-Length` 3 MB'ı aşıyorsa hemen 413 "Fotoğraf en fazla 3 MB olabilir. Küçültüp yeniden dene."; galeri
     doluysa 400 "Galeride en fazla 8 fotoğraf olabilir. Önce birini sil.";
  5. gövde okunur (akışta da 3 MB sınırı → 413); boşsa 400 "Dosya boş."; `resmiTemizle` tanımazsa 400 "Bu dosya
     fotoğraf olarak tanınmadı. PNG, JPEG ya da WebP yükle.";
  6. disk sınırı: kapak ve logoda yalnız eskisiyle FARK sayılır; sığmazsa 507 `{ error: OKUL_DOLU, okulDolu: true }`;
  7. süren yükleme olarak ayrılır (`okulDisk.ayir`/`birak`), dosya `wx` ve `0600` ile yazılır, kayıt eklenir (kayıt
     başarısızsa dosya silinir);
  8. kapak/logo tektir: eskisi (kaydı ve dosyası) silinir;
  9. `okulDisk.yuklendi` (%80 uyarısı), işlem kaydı `okul-sayfa.foto`. Cevap `{ foto: { id, yer, aciklama: '' } }`.
- **`POST /api/okul-sayfa/foto-sil`** — gövde `{ id }`; fotoğraf yoksa ya da başka okulunsa 404. Kayıt ve dosya silinir,
  işlem kaydı `okul-sayfa.foto-silindi`. Cevap `{ ok: true }`.
- **`POST /api/okul-sayfa/foto-aciklama`** — gövde `{ id, aciklama }` (120 harf); başka okulun fotoğrafı 404. Cevap
  `{ ok: true }`.

`okul-foto` dışındaki yollar `duzenleyemez` kapısından geçer; tanınmayan alt yol `false` döner (404).

## Kimle konuşur?

- Çağırdıkları:
  - Node: `crypto` (kimlik), `fs`, `path`;
  - `../guvenlik` → `hizSinir`, `istemciIp`; `../http` → `bad`, `baslikEkle`, `ok`, `sendJSON`; `../ortak` → `clean`;
  - `../veri` → `depo`; `../yollar` → `DATA`; `../yetki` → `yetkiVarMi`;
  - `sunucu/yardimci/css-temizle.js` → `cssTemizle`; `sunucu/yardimci/resim.js` → `resmiTemizle`;
  - `./islem-kaydi` → `islemYaz` ([islem-kaydi.md](islem-kaydi.md)); `./okul-disk` → `durum`, `sigmaz`, `doldu`,
    `OKUL_DOLU`, `ayir`, `birak`, `yuklendi`.
- Depo ve tablolar: `depo.okulSayfalari` (`sunucu/veri/depo/okul-sayfalari.js`, şema 018) → `okul_sayfalari` (`bul`,
  `yaz`) ve `okul_fotolari` (`fotolari`, `foto`, `fotoEkle`, `fotoSil`, `fotoAciklamasi`, `kayitlilar`);
  `depo.okullar.bul` → `okullar`.
- Onu çağıranlar: `sunucu/api.js` (`BOLUM['okul-foto']`, `BOLUM['okul-sayfa']`, ve yükleme için `fotoYukle`);
  `sunucu/bolumler/kayit.js` (`okulSayfasiGorunumu`, `/api/okul-adres?kisa=`); `sunucu/index.js` (`fotoSupur`
  zamanlayıcısı). `okul-foto` aydınlatma onayı beklenirken de açık yollardandır (`KVKK_SERBEST`, [api.md](../api.md)).
- Ön yüz: `public/js/parcalar/19g-okul-sayfasi.js` (düzenleme ekranı, önizleme, fotoğraf yükleme/silme/açıklama; ayrıca
  giriş sayfasındaki vitrini çizen `okulSayfasiHtml` / `okulSayfasiniCiz`, fotoğraflar `/api/okul-foto/<id>`'den);
  vitrinin verisini `05a-dis-sayfalar.js` `/api/okul-adres?kisa=` ile çeker.
- Android uygulaması bu uçları çağırmıyor (grep).

## Nasıl çalışır (adım adım)?

```
Düzenleyen:  GET /api/okul-sayfa ─> ekran
             POST onizle {css}    ─> cssTemizle (kaydetmeden)
             POST /api/okul-sayfa ─> tanıtım+ayar temizle, ham CSS sakla ─> işlem kaydı
             POST foto?yer=...    ─> (api.js, JSON'dan önce) fotoYukle
                                     yetki ─ hız ─ boyut ─ galeri sayısı ─ bayt türü + EXIF sil
                                     ─ disk sınırı (fark) ─ diske yaz + kayıt ─ eski kapak/logo sil

Ziyaretçi:   GET /api/okul-adres?kisa=... ─> okulSayfasiGorunumu (temiz CSS)
             GET /api/okul-foto/<id>      ─> dosya (7 gün önbellek)
```

## Dikkat!

- **CSS ham saklanır, her gösterimde temizlenir.** `okulSayfasiGorunumu` her çağrıda `cssTemizle` çalıştırır; temizleme
  kuralları sıkılaşırsa eski kayıtlar da yeni kurala göre gösterilir. Düzenleme ekranı hem ham (`css`) hem temiz
  (`temizCss`) hâli ve atılan kısımların nedenlerini (`uyarilar`) alır.
- **Fotoğraf okuma sınırı neden 4000/dk:** kod yorumu — okulun adresinden giren herkes giriş sayfasındaki bütün
  fotoğrafları (kapak, logo, 8'e kadar galeri) bir kez indirir; okul ağında yüzlerce öğrenci aynı dakikada tek IP'den
  gelir. Sınır commit 524'te 600'den 4000'e çıktı.
- Yükleme `Content-Length`'e güvenmez: başlık küçük söyleyip çok gönderen istemci `govdeOku`'nun 3 MB sınırına takılır.
- Galeri sayısı gövde okunmadan ÖNCE bakılır (fotoğraf listesi o anda alınır); aynı anda gelen iki galeri yüklemesi 8
  sınırını bir fotoğraf aşabilir (sayım kilitli değil). Disk sınırı ise gövde okunup fotoğraf temizlendikten SONRA,
  gerçek boyutla denetlenir; süren yüklemeler `ayir`/`birak` ile sayıldığı için eşzamanlı yüklemeler disk sınırını aşamaz.
- Kapak/logo değiştirilirken yeni dosya kaydedildikten SONRA eskisi silinir; arada hata olursa iki kapak kalabilir,
  `fotolari` ikisini de döner. Kaydı olmayan dosyaları `fotoSupur` 1 saat sonra toplar.
- Fotoğraflar herkese açıktır (okul sayfası da öyle); kimlik 128 bit rastgele olduğu için tahmin edilemez, ama bağlantıyı
  bilen herkes görebilir. `okul.sayfa` yetkisinin açıklaması da bunu söyler: "Sayfa herkese açıktır."
- `duzenleyemez` yalnız müdür ve öğretmen rolüne bakar: `okul.sayfa` yetkisi verilmiş başka roldeki bir kişi (ör. servisçi)
  düzenleyemez.
- Fotoğraf dosyaları `data/` altında durur ve depoya girmez (`test-gizli-dosyalar.js` `data/okul-fotolari/`'nı denetler).

## Testleri

- `testler/test-okul-sayfasi.js` — 6 bölüm: kim düzenler (müdür; Kodlayıcı rolündeki öğretmen; yetkisiz öğretmen 403,
  girişsiz 401), kaydetme ve CSS temizliği (renk küçük harfe, bozuk ayar varsayılana, `url`/`@import`/`position`…
  atılır, her kural `.okul-sayfa` ile başlar, 8000 harf sınırı, önizleme), herkese açık görünüm (yalnız temiz CSS,
  tanıtım düz metin), fotoğraflar (PNG diye gönderilen HTML ve SVG reddi, 3 MB → 413, PNG/JPEG konum bilgisinin silinmesi,
  JPEG yönünün korunması, kapak tekliği, 9. galeri fotoğrafı reddi, açıklama), başka okulun müdürü 404, işlem kaydı.
- `testler/test-okul-disk.js` — fotoğraf yüklemesi okulun disk sınırına sayılıyor, dolunca 507.
- `testler/test-okul-agi.js` — tek IP'den yüzlerce öğrencinin fotoğrafları indirmesi (4000/dk sınırı).
- `testler/test-resim-kucult.js` — sunucusuz, sahte `fetch` ile ön yüzü dener: `19g-okul-sayfasi.js`'in küçültülen
  fotoğrafı `/api/okul-sayfa/foto?yer=galeri`'ye göndermesi (bu dosyanın kendisini çalıştırmaz).
- `testler/test-gizli-dosyalar.js` — `data/okul-fotolari/` depoya girmiyor.
- Elle: müdür hesabıyla (`testler/seed.js`) Okul Sayfası ekranında bir PNG yükle; sonra girişsiz bir pencerede okulun
  adresini aç.

## Son durum

- Son commit `40fc7e7 commit 525` (2026-09-27): okul disk sınırı — yüklemede `okulDisk.durum`/`sigmaz` denetimi (kapak ve
  logoda yalnız fark), doluysa 507 `okulDolu`, süren yükleme `ayir`/`birak` (`finally` ile), yükleme sonrası
  `okulDisk.yuklendi` (%80 uyarısı).
- `566b917 commit 524` (2026-09-27): fotoğraf okuma sınırı IP başına dakikada 600'den 4000'e (okul ağı).
- `fe018dd commit 513` (2026-09-26): yalnız yorum — giriş adresi `egitimevi.org/<ad>` yerine `egitimevi.org/school/<ad>`.
- Açık iş yok. Sıradaki planlı değişiklik: "Sunucuda küçültme (…) + aynı dosya tek kopya" işi yüklenen fotoğrafları
  sunucuda da küçültecek; "Paneller … /duzenle okul sayfaları (disk + yedek sınırı alanları)" işi yönetim tarafına
  okul sayfası düzenleme getirecek.
- "Düzenleyiciler" işi (kullanıcı 28 Eylül akşamı onayladı) bu dosyaya iki şey getirecek: CSS bilmeyen müdür için okul
  sayfası blok düzenleyicisi (başlık, yazı, fotoğraf, galeri, iletişim, harita bloklarını ekle ve sırala) ve tanıtım
  yazısı için ortak yazı düzenleyici. Bugün sayfa sabit yapılı, tanıtım düz metin, görünüm yalnız seçenekler ve kısıtlı
  CSS ile değişir.
