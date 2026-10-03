# testler/test-adresler.js

Sitenin sayfa adreslerini deneyen sunuculu test paketi (34 denetim): klasörlü asıl adresler, kısa ve eski adreslerin 301
yönlendirmesi, açık yönlendirme ve başlık enjeksiyonu denemeleri, adresteki boş bayt, bulunamayan adresler, sayfaların
içindeki bağlantılar ve sekme başlığı.

## Bu dosya ne yapar?

Eğitim Evi'nin uygulama dışındaki sayfaları klasörlü adreslerde durur: aydınlatma metni `/kvkk/kvkk.html`, kullanım
koşulları `/kosullar/kosullar.html`, uygulama indirme sayfası `/indir/indir.html`; sık sorulan sorular ise tek sayfalık
uygulamanın içinde `/sss/sss.html` adresinde açılır. Eski ve kısa adresler (`/kvkk`, `/kvkk.html`, `/indir`, `/download`,
`/sss`, `/faq` …) kalıcı (301) yönlendirmeyle asıl adrese gider. Bunların hepsini [../sunucu/http.md](../sunucu/http.md)
yapar (`serveStatic`, `YONLENDIRMELER`).

Yönlendirme tablosu kolay bir saldırı yüzeyidir: `//evil.com` gibi bir adresle ziyaretçiyi başka siteye yollamak (açık
yönlendirme) ya da adrese `%0d%0a` koyup cevaba başlık eklemek (başlık enjeksiyonu). Ayrıca adresteki tek bir boş bayt
(`%00`) eskiden sunucuyu düşürüyordu. Bu paket hem doğru adreslerin çalıştığını hem de bu saldırıların işe yaramadığını,
sonra da sayfaların kendi içindeki bağlantıların asıl adresleri gösterdiğini dener.

Dosya başı yorumu paketin sözünü özetler: asıl adresler 200 ve `text/html`; kısa adresler 301, büyük/küçük harf (Türkçe
İ/ı dahil) ve sondaki `/` fark etmez, sorgu dizesi korunur; boş bayt 404; `Location` her zaman sabit yol; yönlendirmede de
güvenlik başlıkları var; tanınmayan adres ve ön yüz parçaları 404; sayfalardaki bağlantılar asıl adresi gösterir, varlıklar
mutlak yolla yüklenir; SSS ya da Hakkında'dan giriş kartına geçince sekme başlığı "Eğitim Evi" olur.

## İçinde neler var?

### Yardımcılar

- `kontrol(ad, sart, detay)` — `GECTI`/`KALDI` satırı.
- `HEDEF` — [giris.md](giris.md)'deki `BASE`'in `URL` hâli (`EE_BASE` ya da `http://localhost:3000`).
- `istek(yol, yontem)` — Node `http.request` ile tek istek; **yönlendirmeyi izlemez** (301'in kendisini görmek için),
  yolu olduğu gibi gönderir, `Accept-Encoding: identity` ister (gövde sıkıştırılmadan gelsin). Döner
  `{ durum, baslik, metin }`.
- `hamIstek(satir)` — `net.connect` ile ham TCP: `http.request`'in gönderemeyeceği baytları (latin1 karakter, çıplak CR)
  istek satırına koyar, `Host: x` ve `Connection: close` ekler; cevabın yalnız başlık bölümünü (latin1) döner. 5 saniyede
  cevap gelmezse bağlantıyı keser; hata olursa `''`.
- `htmlMi(c)` — `Content-Type` `text/html` ile mi başlıyor.
- `fonksiyonKaynagi(kaynak, ad)` — (5. bölümde) sunucunun verdiği `app.js` metninde `function <ad>(` arar, ilk `{`'dan
  başlayıp süslü parantezleri sayarak işlevin kaynağını keser; bulamazsa `''`.

### 1) Asıl adresler (7 denetim)

`/kvkk/kvkk.html` (gövdede "Aydınlatma"), `/kosullar/kosullar.html` ("Kullanım koşulları"), `/indir/indir.html`
(`<h1>Eğitim Evi'ni indir</h1>`), `/sss/sss.html` (`id="vSss"`) — her biri 200, `text/html` ve doğru sayfa (dört ayrı
denetim, döngüde). `/sss/sss.html`'de hem giriş kartı (`id="authWrap"`) hem SSS bölümü var: diskte böyle bir dosya yok,
sunucu uygulamanın kabuğunu (`index.html`) verir. Sorgulu asıl adres (`/kvkk/kvkk.html?x=1`) yönlenmeden 200;
`HEAD /indir/indir.html` 200.

### 2) Kısa ve eski adresler 301 (8 denetim)

Tek denetimde **31 adres** 301 ve doğru `Location` vermeli:

| Yazılan | Gideceği |
|---|---|
| `/kvkk`, `/kvkk/`, `/kvkk.html`, `/KVKK`, `/Kvkk.HTML`, `/kvkk.html/`, `/KVKK/kvkk.html`, `/kvkk/kvkk.html/`, `//kvkk` | `/kvkk/kvkk.html` |
| `/kosullar`, `/kosullar/`, `/kosullar.html`, `/kosullar/KOSULLAR.html` | `/kosullar/kosullar.html` |
| `/indir`, `/indir/`, `/indir.html`, `/download`, `/download/`, `/DOWNLOAD`, `/Indir/Indir.html`, ve Türkçe büyük İ/küçük ı'lı beş yazılış (`/%C4%B0ndir`, `/%C4%B0ND%C4%B0R`, `/%C4%B1nd%C4%B1r`, `/%C4%B0ND%C4%B0R/%C4%B0ND%C4%B0R.HTML`, `/%C4%B0ND%C4%B0R.HTML`) | `/indir/indir.html` |
| `/sss`, `/sss/`, `/faq`, `/faq/`, `/SSS`, `/SSS/SSS.HTML` | `/sss/sss.html` |

Asıl adresin yanlış yazılışı da asıl yazılışa döner (kod yorumu: Linux'ta dosya adı harf duyarlı). Türkçe "İ" ve "ı" de "i"
sayılır (Caps Lock açıkken Türkçe klavyeyle "İNDİR" yazan). Baştaki çift `/` başka siteye gitmez.

Sonra: `HEAD /kvkk` de 301; `POST /kvkk` yönlenmez, 405 alır (statik yolda yalnız GET ve HEAD). Sorgu dizesi korunur
(`/kvkk.html?geri=1` → `/kvkk/kvkk.html?geri=1`; `/indir?a=1&b=%C3%A7` olduğu gibi); boş sorgu (`/sss?`) eklenmez. 301
cevabında da güvenlik başlıkları var: `X-Content-Type-Options: nosniff`, `Content-Security-Policy` içinde
`default-src 'self'`, `X-Frame-Options: DENY`. Son olarak yönlendirmeyi izleyen `fetch` ile `/download` açılınca son adres
`/indir/indir.html` ve indirme sayfasının başlığı geliyor (tarayıcının göreceği yol).

### 3) Açık yönlendirme ve başlık enjeksiyonu (8 denetim)

Dokuz kötü adres (`//evil.com`, `//evil.com/`, `/\evil.com`, `/%2F%2Fevil.com`, `/kvkk.html%0d%0aSet-Cookie:%20a=b`,
`/kvkk%0d%0aLocation:%20//evil.com`, `/kvkk.html?%0d%0aSet-Cookie:%20a=b`, `/kvkk?//evil.com`,
`/kvkk.html?x=%0aLocation:%20https://evil.com`) için: `Location` varsa `/kvkk/`, `/kosullar/`, `/indir/` ya da `/sss/` ile
başlamalı, `//` ile başlamamalı, içinde CR/LF olmamalı; cevapta `Set-Cookie` olmamalı; durum 500'ün altında olmalı.
(Örneğin `/kvkk?//evil.com`, `/kvkk/kvkk.html?//evil.com`'a gider: yol sabit kaldığı için zararsız.) Ayrıca `//evil.com` 404
ve `Location`'sız; `/kvkk.html%0d%0aSet-Cookie: …` 404, başlık eklenmemiş.

Ham baytlarla iki deneme: `GET /kvkk.html?x=ÿþ` (latin1, ASCII dışı sorgu) ya 301 alıp `Location`'da yalnız
`/kvkk/kvkk.html` görmeli (sorgu atılır) ya da 400 almalı — ikisi de kabul; `GET /kvkk.html?x=a\rSet-Cookie:b` (sorguda
çıplak CR) cevabında `Set-Cookie` başlığı oluşmamalı. Bunlardan sonra sunucu hâlâ ayakta (`/kvkk/kvkk.html` 200).

Boş bayt: dokuz adres (`/kvkk%00`, `/index%00`, `/js/app.js%00`, `/%00`, `/kvkk/kvkk.html%00`, `/sss/sss.html%00`,
`/indir%00.html`, `/school/test-ortaokulu%00`, `/css/style.css%00?v=1`) 404 vermeli ve yönlenmemeli; istek hata atarsa (ör.
bağlantı koptu) o da sorun sayılır. Sonra sunucu hâlâ ayakta.

### 4) Bulunamayanlar (4 denetim)

`/olmayan`, `/kvkk/olmayan.html`, `/sss/olmayan.html`, `/indir/kvkk.html`, `/kosullar/indir.html` ve ön yüz parçaları
(`/js/parcalar/05a-dis-sayfalar.js`, `/css/parcalar/00-temel.css`, büyük harfli `/JS/Parcalar/05a-dis-sayfalar.js`) 404.
`/olmayan`'ın gövdesi "Sayfa bulunamadı" sayfası. Seed'in okulu (`/school/test-ortaokulu`) 200 ve uygulama kabuğu.
Uygulamanın kendi adresleri `/hakkinda`, `/about`, `/login`, `/giris`, `/signup`, `/kayit` ve `/` yönlenmeden 200 ve
kabuk.

### 5) Sayfaların içi (7 denetim)

Altı sayfa birlikte incelenir: 1. bölümdeki dört sayfa, `/olmayan` (404 sayfası) ve `/school/boyle-bir-okul-yok` ("Okul
bulunamadı" sayfası).

- Hiçbirinde eski adrese bağlantı yok: değeri tam olarak `/kvkk.html`, `/kosullar.html`, `/indir`, `/download`, `/sss` ya
  da `/faq` olan bir `href=` ya da `data-site=` bulunmuyor.
- Hepsinde dört asıl adrese bağlantı var (`href="/kvkk/kvkk.html"`, `/kosullar/kosullar.html`, `/indir/indir.html`,
  `/sss/sss.html`): üst şerit ve alt bilgi asıl adresleri gösteriyor.
- Göreli `src`/`href` yok (yalnız `/`, `#`, `http(s):`, `mailto:`, `tel:` ile başlayanlar): sayfa klasör altında
  (`/kvkk/...`) açıldığı için göreli yol yanlış yere giderdi.
- Sayfalardaki `/css/...` ve `/js/...` varlıklarının hepsi 200 ve en az dört farklı varlık var (3 Ekim'deki koşuda beş:
  `/js/tema.js`, `/js/belge.js`, `/css/style.css`, `/js/indir.js`, `/js/app.js`).
- Sunucunun verdiği `/js/app.js`'te `sss: '/sss/sss.html'` (üst şeridi işaretleyen eşlemede) ve `'sss/sss.html': 'sss'`
  (`SITE_SAYFALARI`) yazıları var.
- **Sekme başlığı:** `app.js`'ten `girisEkraniGoster` ve `okulBasligiCiz` işlevlerinin kaynağı kesilir
  (`fonksiyonKaynagi`), `new Function` ile sahte bir sayfa ortamında çalıştırılır: `S` (`genelGiris: false`,
  `okulAdresi`), sahte `$` (her kimliğe `style`, `hidden`, `innerHTML`, `classList`, `click` taşıyan bir nesne), sahte
  `document` (`title`), `disSayfa` (o anki sayfayı döner), boş işlevler (`siteMenusuIsaretle`, `siteBilgisiYukle`,
  `yorumlariYukle`, `okulSayfasiniCiz`, `girisKimlikAyarla`, `sonOkulCiz`), `girisKimlik` → `null`, `ik` → boş metin
  döndüren bir işlev (`() => ''`), `esc` → `String`. Sırayla SSS →
  giriş → Hakkında → kayıt → okul (Test Ortaokulu) → giriş sayfasına "gidilir"; başlıklar tam olarak
  `Sık sorulan sorular — Eğitim Evi`, `Eğitim Evi`, `Hakkında — Eğitim Evi`, `Eğitim Evi`, `Test Ortaokulu — Eğitim Evi`,
  `Eğitim Evi` olmalı. Çalıştırma hata atarsa liste `HATA: …` olur ve denetim kalır.
- `/sw.js` 200 ve hizmet çalışanının önbellek listesinde tırnak içinde eski adres (`'/kvkk.html'`, `'/indir'`, `'/sss'`
  …) yok.

Sonunda `GECTI: N   KALDI: M`; `KALDI` varsa çıkış kodu 1, beklenmeyen hata `TEST HATASI:` ve çıkış kodu 1.

## Kimle konuşur?

- **Modüller:** `http`, `net`; [giris.md](giris.md)'den yalnız `BASE`. Giriş yapmaz, hesap kullanmaz; yalnız seed'in açtığı
  okulun adresine (`test-ortaokulu`, [seed.md](seed.md)) güvenir.
- **Koruduğu sunucu kodu:**
  - [../sunucu/http.md](../sunucu/http.md) — `serveStatic` (boş bayt denetimi, yönlendirme, gizli dosya ve parça klasörü
    kuralı), `YONLENDIRMELER`, `yonlendirmeAnahtari` (Türkçe İ/ı), `yonlendirmeAdresi` (yalnız görünür ASCII sorgu),
    `yonlendir` (301 gövdesi ve `Cache-Control`), `UYGULAMA_YOLLARI` ve `OKUL_YOLU` (kabuğu veren adresler), `okulVarMi`
    ("Okul bulunamadı"), `bulunamadi`, `GUVENLIK_BASLIKLARI`/`baslikEkle`, `htmlSurumle`.
  - [../sunucu/index.md](../sunucu/index.md) — statik yolda GET/HEAD dışına 405 ve `serveStatic`'in `try/catch` ile
    sarılması (eşzamanlı hata sunucuyu düşürmesin).
- **Koruduğu ön yüz:** `public/index.html` (kabuk), `public/kvkk/kvkk.html`, `public/kosullar/kosullar.html`,
  `public/indir/indir.html`, `public/404.html`, `public/okul-bulunamadi.html` (bağlantılar ve mutlak yollar);
  [../public/sw.md](../public/sw.md) (önbellek listesi); [../public/js/belge.md](../public/js/belge.md),
  [../public/js/indir.md](../public/js/indir.md), [../public/js/tema.md](../public/js/tema.md) (sayfaların yüklediği
  betikler); [../public/js/parcalar/05a-dis-sayfalar.md](../public/js/parcalar/05a-dis-sayfalar.md) (`SITE_SAYFALARI`,
  üst şerit eşlemesi, `girisEkraniGoster`, `okulBasligiCiz` — sekme başlığı).
- **Onu çalıştıran:** `testler/tumtest.sh`, sunuculu paket döngüsünde (`test-etut`'tan sonra, `test-okul-sayfasi`'ndan
  önce); önce sıfırlanmış veritabanı ve [seed.md](seed.md).

## Nasıl çalışır (adım adım)?

```
1) istek(asıl adres) ─► 200 + text/html + doğru içerik        (yönlendirme izlenmez)
2) 31 kısa/eski adres ─► 301 + Location (sabit yol)
   HEAD 301, POST 405, sorgu korunur/boş sorgu atılır, güvenlik başlıkları, fetch ile izle ─► /indir/indir.html
3) 9 kötü adres ─► Location sabit, Set-Cookie yok, 5xx yok
   hamIstek(latin1 sorgu) ─► 301 (sorgusuz) ya da 400 ; hamIstek(çıplak CR) ─► Set-Cookie yok ; sunucu ayakta
   9 boş baytlı adres ─► 404, yönlenme yok ; sunucu ayakta
4) bulunamayanlar 404 ; /olmayan "Sayfa bulunamadı" ; /school/test-ortaokulu ve uygulama adresleri 200 + kabuk
5) 6 sayfanın HTML'i ─► eski bağlantı yok, 4 asıl bağlantı var, göreli yol yok, varlıklar 200
   app.js ─► SSS asıl adresle ; girisEkraniGoster + okulBasligiCiz sahte ortamda ─► 6 sekme başlığı
   sw.js ─► eski adres yok
```

## Dikkat!

- **Sekme başlığı denetimi kodun metnine bağlı.** `fonksiyonKaynagi` `app.js`'te `function girisEkraniGoster(` yazısını
  arar ve süslü parantez sayar; işlevlerin içinde metin ya da düzenli ifade içinde tek başına `{`/`}` geçerse kesim yanlış
  olur. `girisEkraniGoster` ya da `okulBasligiCiz` yeni bir yardımcı çağırmaya başlarsa (ör. yeni bir öğe ya da işlev), o ad
  `new Function`'ın parametre listesinde olmadığı için `ReferenceError` atılır ve denetim "HATA: … is not defined" ile kalır:
  o zaman sahte ortama yeni adı ekle. `app.js` yorumsuz ama adları korunmuş biçimde sunuluyor; ileride adlar kısaltılırsa
  (gerçek küçültme) bu yöntem çalışmaz.
- **`sss: '/sss/sss.html'` aranırken boşluk ve tırnak da aranır.** Bu yazının biçimi değişirse (çift tırnak, boşluksuz) kod
  doğru olsa da denetim kalır.
- **`hamIstek`'in iki sonucu da kabul:** ASCII dışı sorgu için Node'un ayrıştırıcısı isteği 400 ile reddedebilir ya da
  geçirebilir; sunucu geçerse sorgu `Location`'a girmemeli. Denetim hangisinin olduğunu söylemez.
- **Ham istek satırına `Host: x` konur.** Sunucu bugün `Host` başlığına bakmıyor (`sunucu/` altında grep, 3 Ekim); ileride
  `Host`'a göre bir şey yapmaya başlarsa (ör. alan adı denetimi) bu iki deneme başka bir nedenle 400/404 alır ve asıl
  kuralı ölçmez olur.
- **`acilan` dizisi iki denetimde ortak.** 4. bölümde bulunamaması gereken bir adres açılırsa (404 değilse) o satır diziye
  girer ve hemen ardından gelen "uygulama adresleri yönlenmeden açılıyor" denetimi de, kendi adresleri doğru olsa bile
  kalır. Okurken ilk `KALDI`'ya bak.
- **Seed'e bağlı:** `/school/test-ortaokulu` seed'in okul adresidir; okul açılmamışsa adres "Okul bulunamadı" (404) verir
  ve 4. bölüm kalır. (`%00`'lı hâli her durumda 404'tür.)
- **Varsayılan adres 3000.** `EE_BASE` vermeden çalıştırırsan istekler kendi sunucuna gider. Paket yalnız okur (hiçbir şey
  yazmaz), ama yine de test sunucusunu kullan.
- `/sw.js` denetimi yalnız tek tırnaklı eski adresleri arar (`'/kvkk.html'` gibi); çift tırnakla yazılmış eski bir adres
  gözden kaçar.

## Testleri

- Bu dosyanın kendisi testtir; `testler/tumtest.sh` her tam koşuda çalıştırır. Yakın paketler:
  [guvenlik-test.md](guvenlik-test.md) (güvenlik başlıkları, yol kaçışı, ön yüz parçalarının okunamaması),
  [test-admin-gizli.md](test-admin-gizli.md) (bilinmeyen adresle bayt bayt aynı 404, `%00` dahil),
  `testler/test-okul-sayfasi.js` (okulun kendi sayfası: düzenleme, CSS temizliği, fotoğraflar),
  `testler/test-gizli-dosyalar.js` (depoya girmemesi gerekenler).
- Elle (Git Bash, proje kökünde; 3200'de seed'lenmiş test sunucusu varken):

  ```
  EE_BASE=http://localhost:3200 EE_LOG=testler/test-sunucu.log node testler/test-adresler.js
  curl -sI http://localhost:3200/download          # HTTP/1.1 301 ... Location: /indir/indir.html
  ```

- 3 Ekim sabahı bu belge için 3200'de, sıfırlanmış `egitimevi_test` ve seed'le koşuldu: `GECTI: 34   KALDI: 0`, yaklaşık 2
  saniye; sunucu günlüğünde `Statik dosya hatası` ya da `API hatası` yok. (Kodda 31 `kontrol(` çağrısı var; 1. bölümdeki
  döngü dört kez sayıldığı için koşuda 34.)

## Son durum

- `git log`: tek commit. Dosya `b6bfc03 commit 517` (2026-09-27, sayfa klasörleri) ile 261 satır olarak eklendi; o günden
  beri değişmedi. Aynı commit sayfaları klasörlere taşıdı (`public/kvkk/kvkk.html`, `public/kosullar/kosullar.html`,
  `public/indir/indir.html`), `sunucu/http.js`'e yönlendirme tablosunu ve boş bayt düzeltmesini, `sunucu/index.js`'e statik
  yolun `try/catch`'ini ekledi; `tumtest.sh`'e bu paketi koydu.
- Açık iş yok; bilinen zayıflıklar yukarıda (`acilan` dizisinin ortak olması, metne bağlı denetimler).
- Planlı işlerden bu dosyayı etkileyebilecekler:
  - **"Arama motorunda görünme"** — `robots.txt`, `sitemap.xml`, meta açıklama, Open Graph. Meta ve Open Graph etiketleri
    bu paketin incelediği sayfalara girecek; site haritası asıl (klasörlü) adresleri listelemeli. 5. bölümün göreli yol
    denetimi yalnız `href`/`src`'ye baktığı için `content="…"` içindeki adresleri denetlemez; yeni dosyalar (`robots.txt`,
    `sitemap.xml`) için ayrı denetim eklenmeli.
  - **"Çok dil"** — sekme başlıkları ve sayfa metinleri (`Aydınlatma`, `Kullanım koşulları`, `Sık sorulan sorular — Eğitim
    Evi`) çeviri kataloğuna geçerse bu paketin aradığı Türkçe metinler varsayılan dilde aynı kalmalı ya da test
    güncellenmeli.
  - **"Üst şerit sadeleştirme"** — şeritten bağlantı kalkarsa dört asıl adres en azından alt bilgide kalmalı (5. bölüm her
    sayfada dördünü de arar).
  - **"Paneller"** (`/panel/...`, `/duzenle/...`) ve **"Kullanıcı arama"** (`/users/<ad>`) — yeni uygulama adresleri
    `UYGULAMA_YOLLARI`'na ya da ayrı bir kapıya girecek; bu pakete onların 200/404 kuralları eklenmeli.
