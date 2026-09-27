# sunucu/http.js

HTTP yardımcıları: JSON cevap, istek gövdesi okuma, güvenlik başlıkları, sıkıştırma, statik dosya sunucusu, ön yüz
parçalarının birleştirilmesi, kısa adres yönlendirmeleri, 404 ve gizli yönetim paneli (`/admin`).

## Bu dosya ne yapar?

Sunucunun "tel" tarafı. İki büyük işi var:

1. **API'nin yardımcıları:** her bölüm cevabını `ok(res, nesne)` ya da `bad(res, ileti, kod)` ile yazar, gövdeyi
   `readBody(req)` ile okur. Böylece her cevapta aynı güvenlik başlıkları, aynı sıkıştırma, aynı sınırlar olur.
2. **Tarayıcıya giden dosyalar:** `public/` altındaki sayfalar, yazı tipleri, simgeler; ve derleyicisi olmayan ön
   yüzün "derlemesi": `public/js/parcalar/*.js` ad sırasıyla tek IIFE'ye birleşip `/js/app.js`, `public/css/parcalar/*.css`
   birleşip `/css/style.css` olur, yorumları atılır, sıkıştırılıp bellekte tutulur. Bir parça değişince (en geç 1 sn
   sonra) yeniden okunur.

Bunun yanında: kısa/eski adresleri (`/kvkk`, `/indir`, `/sss`…) klasörlü asıl adrese 301'ler; tek sayfalık
uygulamanın adreslerinde (`/login`, `/school/<okul>`…) kabuğu (`index.html`) verir; bilinmeyen, gizli ya da hiç
sunulmayan her şeye BAYT BAYT aynı "Sayfa bulunamadı" 404'ünü verir; geçerli yönetici çereziyle `/admin` altında
yönetim kabuğunu ve `/admin/yonetim.js` paketini verir.

## İçinde neler var?

Dışa açık olanlar (`module.exports`):

- `GUVENLIK_BASLIKLARI` — her cevaba giden başlıklar: `nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: no-referrer`,
  `Permissions-Policy` (konum yalnız bu siteye — servisçi seferi; mikrofon, kamera, ödeme, USB kapalı), COOP/CORP
  `same-origin`, ve CSP: her şey `'self'`; `img-src` ayrıca `data:` ve `https://tile.openstreetmap.org` (harita);
  `style-src` `'unsafe-inline'` (satır içi `style=""` yüzünden) ama `script-src` yalnız `'self'` — enjekte edilen
  `<script>` çalışmaz; `frame-ancestors 'none'`, `object-src 'none'`.
- `baslikEkle(hedef)` — güvenlik başlıklarını bir başlık nesnesine ekler, onu döndürür.
- `SIKISTIRMA_ESIGI` (1024 bayt) ve `SIKISTIRILABILIR` (`text/*`, `application/javascript|json|manifest`).
- `kodlamaSec(req)` — `Accept-Encoding`'e göre `'br'`, `'gzip'` ya da `''`.
- `statikOnbellek` — `Map`: dosya yolu (ya da paket anahtarı) → `{ imza, veri, tur, etag, gzip, br }`.
- `statikOku(tamYol, geri)` — birleşik dosyaysa (`app.js`, `style.css`) parçalardan, değilse diskten okur;
  önbellekte aynı imza (mtime + boyut) varsa ondan verir.
- `sendJSON(res, kod, nesne)` — JSON cevap; `Cache-Control: no-store`; 1 KB'tan büyükse brotli (kalite 4) ya da gzip.
- `ok(res, nesne?)` → 200 (nesne yoksa `{ ok: true }`); `bad(res, ileti, kod?)` → `{ error: ileti }`, varsayılan 400.
- `readBody(req)` → `Promise<nesne>` — en çok 2 MB ve 30 saniye; aşılırsa `err.kod` 413 ("İstek çok büyük") ya da 408
  ("İstek zaman aşımına uğradı"); bozuk JSON'da "Geçersiz veri gönderildi"; boş gövde `{}`; sonuç
  `ortak.govdeTemizle`'den geçer.
- `MIME` — uzantı → içerik türü (html, js, css, json, svg, png, jpg, webp, ico, woff2, webmanifest). Tabloda olmayan
  uzantı `application/octet-stream` gider.
- `serveStatic(req, res, urlPath)` — statik isteklerin tamamı (aşağıda adım adım).
- `statikGonder(req, res, kayit, durum?)` — önbellek kaydını gönderir: `If-None-Match` tutarsa 304; yazı tipi ve
  resimler ya da adresinde kendi sürümünü (`?v=<ETag>`) taşıyan dosyalar bir yıl `immutable`, gerisi `no-cache`;
  404'te `no-store`.
- `bulunamadi(req, res)` — `404.html` ile "Sayfa bulunamadı" (404, ETag'li, `no-store`).
- `okulOnbellekBosalt()` — `/school/<okul>` var mı önbelleğini boşaltır (okul adresi değişince).
- `yonetimJsOku(geri)` — `/admin/yonetim.js` paketini (uygulama + yönetim parçaları) okur.

Önemli iç işlevler:

- `onbellekKaydi(veri, tur, imza)` — ETag (sha1'in ilk 20 hanesi) ve bir kez sıkıştırılmış gzip/br kopyaları.
- `birlesikOku(anahtar, tanim, geri)` — parça klasörlerini okur, **yalnız `tanim.uzanti` ile biten dosyaları**
  (`.js` ya da `.css`; `readdirSync(...).filter(a => a.endsWith(tanim.uzanti))`) ad sırasıyla birleştirir, başına
  `/* ==== parcalar/<ad> ==== */` işareti koyar, `kucultKontrollu` ile yorumlarını atar. Aynı ad iki klasörde varsa
  önce uygulama parçası. En sık 1 sn'de bir (`BIRLESIK_KONTROL_MS`) parçaların mtime/boyut imzasına bakar.
- `BIRLESIK` — `public/js/app.js` ← `public/js/parcalar/*.js` (IIFE içinde, `'use strict'`), `public/css/style.css`
  ← `public/css/parcalar/*.css`. `YONETIM_JS` — `parcalar/` + `yonetim/` (yönetim klasörü isteğe bağlı).
- `duzDosyaOku` — tek dosya; geçersiz yolda (ör. boş bayt) `fs.stat` anında hata atarsa yakalar.
- `htmlSurumle(kayit, geri)` — HTML'deki `"/css/style.css"`, `"/js/app.js"`, `"/js/tema.js"` adreslerine
  `?v=<ETag>` ekler; tarayıcı bu dosyaları bir yıl saklar, HTML her açılışta sorulur.
- `YONLENDIRMELER`, `yonlendirmeAnahtari`, `yonlendirmeAdresi`, `yonlendir` — `/kvkk`, `/kvkk.html`,
  `/kosullar(.html)`, `/indir(.html)`, `/download`, `/sss`, `/faq` → `/kvkk/kvkk.html`, `/kosullar/kosullar.html`,
  `/indir/indir.html`, `/sss/sss.html` (301, bir gün önbellek). Türkçe İ/ı ve büyük harf fark etmez; sorgu yalnız
  görünür ASCII ise korunur.
- `UYGULAMA_YOLLARI` (`''`, `index.html`, `login`, `giris`, `signup`, `kayit`, `hakkinda`, `about`, `sss/sss.html`)
  ve `OKUL_YOLU` (`school/<kısa-ad>`) — dosyası olmayan ama kabuk açılacak adresler.
- `okulVarMi(kisa)` — `depo.okullar.kisaAdla`; sonuç 30 sn bellekte (en çok 2000 kayıt).
- `bulunamadiCerezli(req, res)` — biçimli bir yönetim çerezi (`ee_yonetim=<64 hex>`) varsa önce veritabanında arar,
  sonra 404: `/admin`'le aynı sürede cevap versin diye.
- `yonetimKabugu`, `yonetimGonder`, `yonetimSun` — `/admin` (bkz. Dikkat).
- `BELGE_DOSYASI` — `.md` belge adresi (`/\.md[\s.]*(?::.*)?[\s.\\/]*$/`); bkz. aşağı.

## Kimle konuşur?

- Çağırdıkları: `fs`, `path`, `crypto`, `zlib`; `./ortak` (`govdeTemizle`), `./yardimci/kucult` (`kucultKontrollu`),
  `./yollar` (`PUB`); tembel yüklemeyle `./veri` (`depo.okullar.kisaAdla`) ve `./yonetim-cerezi`
  (`cerezDegeri`, `gecerliMi`).
- Onu çağıranlar (grep): `sunucu/index.js` (`serveStatic`, `bad`, `baslikEkle`, `sendJSON`), `sunucu/api.js`,
  `sunucu/site.js`, `sunucu/yetki.js` ve hemen bütün bölümler (`ok`, `bad`, `sendJSON`, `readBody`);
  `bolumler/hesaplar.js`, `site-ayarlari.js`, `yonetici-okul.js` (`okulOnbellekBosalt`);
  `testler/test-admin-gizli.js` (`serveStatic`'i sahte istekle çağırıp disk ve veritabanı yoklamasını sayar).
- Tablo: yalnız `okullar` (kısa ad araması, `depo` üzerinden) ve oturum/çerez tablosu (`yonetim-cerezi` üzerinden).

## Nasıl çalışır (adım adım)?

`serveStatic` (GET/HEAD):

```
1. rel = decodeURIComponent(yol)  (bozuksa '/')
2. içinde boş bayt (\0)            → bulunamadiCerezli (404)
3. '/' → '/index.html'
4. YONLENDIRMELER'de mi            → 301 asıl adres
5. '_' ya da '.' ile başlayan parça (.well-known hariç) → 404
6. full = PUB + normalize(rel); PUB dışına çıkıyorsa → 403 "Yasak"
7. ön yüz parça klasörü (js/parcalar, js/yonetim, css/parcalar) → 404
8. /admin ve altı                  → fs.stat (sonucu kullanılmaz) → yonetimSun
9. .md belge dosyası               → 404
10. statikOku(full)
     ├─ dosya var: HTML ise htmlSurumle → statikGonder; değilse statikGonder
     └─ yok: /school/<okul> ? (okul var → index.html : okul-bulunamadi.html 404)
             uygulama yolu ? index.html : bulunamadiCerezli (404)
```

`/admin` (`yonetimSun`): çerez yok/biçimsiz → 404 (veritabanına gitmez); biçimli → `gecerliMi` → geçersizse 404;
geçerliyse `/admin/yonetim.js` için `yonetimJsOku`, başka her `/admin/...` için `yonetimKabugu` (index.html'de
`/js/app.js` yerine `/admin/yonetim.js?v=...`), `no-store` ve `X-Robots-Tag: noindex, nofollow` ile.

## Dikkat!

- **Aynı 404, bayt bayt.** Bilinmeyen adres, gizli dosya (`/.env`), `_` ile başlayan geliştirme dosyası, ön yüz parçası
  (`/js/parcalar/06-menu.js`), `/js/yonetim/...`, `.md` belgeleri ve çerezsiz `/admin` hep `bulunamadi`'dan geçer: durum,
  başlıklar (ETag dahil) ve gövde aynıdır. Dizin tarayıcısı hangisinin gerçekten var olduğunu anlayamaz. Yeni bir
  "gizli" yol eklersen başka bir 404 yazma, `bulunamadiCerezli`'yi çağır.
- **Süre farkı da kapatıldı.** Biçimli bir yönetim çereziyle `/admin` çerezi veritabanında arar; bilinmeyen adres de
  (`bulunamadiCerezli`) aynı aramayı yapar. `/admin` de bilinmeyen adres gibi diske bir kez bakar (`fs.stat`). Böylece
  yanıt süresi `/admin`'i ele vermez.
- **`.md` belgeleri web'den okunmaz.** Kod dosyalarının yanındaki açıklamalar (ör. ileride `public/js/belge.md`) yalnız
  depoda okunmak için; statik sunucu onları dosya diskte olsa da bilinmeyen adresle aynı 404'le geri çevirir. Kalıp
  sondaki nokta/boşluk/`/` ve Windows'un `::$DATA` ekini de kapsar, çünkü Windows `belge.md.` ya da `belge.md::$DATA`
  adıyla aynı dosyayı açar. Parça birleştiriciler zaten yalnız `.js`/`.css` okur; `.md` pakete girmez.
- `PUB` denetimi `startsWith(PUB + sep)` ile: yalnız `startsWith(PUB)` olsaydı `public` ile `publicgizli` de eşleşirdi.
- Boş bayt (`%00`) bir zamanlar tek istekle sunucuyu düşürüyordu (`fs.stat` eşzamanlı hata atar); hem `serveStatic`
  başında hem `duzDosyaOku`'da ayrıca yakalanır.
- 301'in `Location`'u hep tablodaki sabit yol: kullanıcının yazdığından yalnız sorgu eklenir, o da yalnız görünür
  ASCII ise; `//evil.com` başka siteye gönderemez, `%0d%0a` başlığa satır ekleyemez.
- `'İ'.toLowerCase()` "i" değil "i" + U+0307 verir; yönlendirme anahtarı bunu ve "ı"yı "i"ye çevirir (Caps Lock'la
  yazılan "İNDİR" de çalışsın).
- Birleşik paket derlenemezse `kucultKontrollu` yorumlu hâli verir; uygulama asla bozulmaz. Geliştirirken
  `EE_ACIK_KAYNAK=1` ile yorumlar ve parça işaretleri kalır.
- İki parça klasöründe (`parcalar/`, `yonetim/`) aynı adlı dosya olmamalı (`test-kucult.js` denetler).
- Statik dosyalar çalışırken değişmez varsayılır ama değişirse imza (mtime + boyut) farkı yakalar; önbellek
  sınırsızdır, `public/` küçük olduğu için sorun değil.
- `readBody`'de sınır aşılınca bağlantı hemen koparılmaz: istemci 413'ü görebilsin diye akış durdurulur, 1,5 sn sonra
  kapatılır.

## Testleri

- `testler/test-adresler.js` — asıl adresler 200, kısa adresler 301 (harf, Türkçe İ/ı, sondaki `/`, sorgu), `%00` 404 ve
  sunucu ayakta, `//evil.com` ve `%0d%0a` saldırıları, tanınmayan adres ve parçalar 404, güvenlik başlıkları.
- `testler/test-admin-gizli.js` — çerezsiz/uydurma/biçimsiz çerezle `/admin`, `/js/yonetim/...`, parçalar bilinmeyen
  adresle bayt bayt aynı 404 (GET/HEAD, gzip/br); veritabanı ve disk yoklama sayıları; geçerli çerezle kabuk ve paket;
  **bölüm 1b: `.md` belgeleri** — `public/` altına geçici `.md` (ve karşılaştırma için `.txt`) yazar; `.txt` 200 gelirken
  `/js/belge.md`, `/js/parcalar/05-giris.md`, `/TANITIM.md`, `/kvkk/x.md`, büyük harfli `.MD`, sonu noktalı/boşluklu,
  `::$DATA`'lı, `/` ile biten ve `%2E`'li yazılışlar 4 kodlama × GET/HEAD bilinmeyen adresle aynı 404; uydurma çerezle de;
  sonunda geçici dosyaları siler.
- `testler/test-kucult.js` — birleşik paketin yorumsuz hâli derleniyor, iki klasörde aynı ad yok.
- `testler/test-okul-sayfasi.js`, `test-site-ayarlari.js` — `/school/<okul>` ve adres değişince "Okul bulunamadı".
- `testler/guvenlik-test.js` — CSP, `X-Frame-Options`, `nosniff`, `Referrer-Policy`; parça dosyaları büyük harfle ve
  dolambaçlı yolla (`/js/./parcalar`, `/js/x/../parcalar`) da 404, birleşik `app.js` ve `style.css` açılıyor.
- `testler/girdi-denetimi.js` — büyük/bozuk gövdede 500 yok.
- Elle: `curl -I http://localhost:3200/kvkk` → 301; `curl -H "Accept-Encoding: br" -I .../js/app.js` → `br`.

## Son durum

- Belgeleme işinin 1. parçasında (bu değişiklik, henüz commit'lenmedi): `.md` belge kapısı (`BELGE_DOSYASI` ve
  `serveStatic`'te 9. adım) eklendi; `test-admin-gizli.js`'e bölüm 1b yazıldı. Birleştiricinin yalnız `.js`/`.css`
  okuduğu denetlendi, değişiklik gerekmedi.
- Son commit `276c0a0 commit 521` (2026-09-27, gizli /admin): birleştirici tek klasörden klasör listesine geçti
  (`klasorler`, `onek`), `/admin/yonetim.js` paketi, `yonetimSun`/`yonetimKabugu`, `bulunamadi` ve
  `bulunamadiCerezli` (bayt bayt aynı 404 ve süre eşitliği), `/js/yonetim` parça klasörü 404'e eklendi.
- `b6bfc03 commit 517` (sayfa klasörleri): `/kvkk/kvkk.html` gibi klasörlü adresler, 301 yönlendirme tablosu, `%00`
  çökmesinin düzeltmesi. Daha önce `115a906 commit 515`: `/school/<okul>` için okulun gerçekten var olup
  olmadığı (`okulVarMi`, "Okul bulunamadı"); `dc17651 commit 514`: tek sayfalık uygulamanın yolları, dışındaki dosyasız
  her adrese "Sayfa bulunamadı" 404.
- Açık iş yok. Belgelemenin 4. parçası `public/js/` yanına `.md`'ler koyacak; bu kapı onları korur.
