# public/indir/KLASOR.md

İndirme sayfasının klasörü; içindeki tek dosya `indir.html`, sitede `/indir/indir.html` adresinde açılan, Android uygulamasının
bütün sürümlerini bir tabloda ve iPhone/iPad için "Ana Ekrana Ekle" adımlarını gösteren düz HTML sayfadır.

## Bu dosya ne yapar?

Eğitim Evi'nin bir Android uygulaması var; dosyası (APK) uygulamanın açık kaynak deposunda GitHub "Releases" olarak yayımlanıyor.
Kimse oraya gidip aramasın diye sitede bir indirme sayfası var: son sürüm büyük bir "İndir" düğmesiyle en üstte, altında bütün
sürümler (tarih, değişiklik notu, boyut, SHA-256 özeti) ve kurulum adımları. iPhone için uygulama mağazası yok; sayfa Safari'de
"Paylaş → Ana Ekrana Ekle" adımlarını açan mavi bir düğme gösterir.

Sayfanın iskeleti (başlıklar, kutular, kurulum adımları) bu dosyadadır; değişen kısmını (sürüm kutusu ve tablo, iPhone notu)
[../js/indir.md](../js/indir.md)'deki `indir.js` çizer. Sürüm listesi tarayıcıya `GET /api/uygulama`'dan gelir; sunucu onu
GitHub'dan alıp süzer ve 15 dakika saklar, GitHub'a ulaşamazsa son aldığı listeyi vermeye devam eder
([../../sunucu/uygulama-surum.md](../../sunucu/uygulama-surum.md), [../../sunucu/site.md](../../sunucu/site.md)). Tarayıcı
GitHub'a kendisi gitmez: güvenlik başlığı (`connect-src 'self'`) buna izin vermez.

Kim görür: herkes, girişsiz. Sitenin üst şeridindeki "İndir" (`#sUygulama`) her sayfadan buraya gelir; "Çocuğumun telefonu"
sayfası da Eğitim Evi Aile uygulaması için buraya bağlar.

Dosya 26 Eylül'de `public/indir.html` olarak girdi; 27 Eylül'deki "sayfa klasörleri" işinde (`commit 517`) bu klasöre taşındı.
`/indir`, `/indir/`, `/indir.html`, `/download` (ve büyük harfli yazılışları) buraya kalıcı olarak (301) yönlenir
([../../sunucu/http.md](../../sunucu/http.md), `YONLENDIRMELER`).

Bu `KLASOR.md` web'den okunamaz: sunucu `.md` uzantılı her adrese bilinmeyen adresle aynı 404'ü verir.

## İçinde neler var?

### `indir.html`

Klasördeki tek dosya (203 satır, ~15 KB).

**Baş kısmı:**

- `viewport-fit=cover` (iPhone çentiği), iki `theme-color` (açık `#d62839`, koyu `#15181d`).
- Betikler: `/js/tema.js` (eş zamanlı), `/js/belge.js` ve `/js/indir.js` (ikisi de `defer`).
- Arama motoru açıklaması ("bütün sürümler, tarihleri, değişiklikleri, boyutları, SHA-256 özetleri ve iPhone'da ana ekrana
  ekleme"), başlık "İndir · Eğitim Evi", `/css/style.css`, sekme simgesi `/simge-192.png?v=2`.
- iPhone'da ana ekrana eklenebilsin diye: `<link rel="manifest" href="/manifest.json">`, `apple-touch-icon` (`simge-192.png?v=2`),
  `apple-mobile-web-app-capable`, `-status-bar-style`, `-title` ("Eğitim Evi"). Ana ekrandan açılınca `indir.js` siteye
  (`/`) geçer.
- Gömülü `<style>`: bütün düz sayfalardaki `.belge` düzeni ve yalnız bu sayfanın sınıfları — `.belge.indir` (900 px genişlik),
  `.indir-son` (son sürüm kutusu), `.indir-tablo` (`.surum`, `.tarih`, `.boyut`, `.notlar`, `.ozet` eş aralıklı SHA-256,
  `.etiket-son` "son" etiketi), `.indir-adim`, iPhone bölümü `.ios-kart`, `.btn-mavi`, `.ios-adimlar` (numaralı adımlar),
  `.ios-uyari`; 640 px altında tablo başlığı gizlenir, satırlar karta döner ve `data-baslik`'ı olan hücrelerin (Sürüm, Tarih,
  Boyut) önüne o başlık yazılır.

**Gövde, sırasıyla:**

| Öğe | Ne |
|---|---|
| Üst şerit | Bütün düz sayfalardaki ortak şerit; "İndir" bağlantısında `aria-current="page"`. |
| `h1` "Eğitim Evi'ni indir" | Altında: Android dosyaları uygulamanın açık kaynak deposundan (GitHub) gelir. |
| "Android" + `#indirSon` | Son sürüm kutusu; başta "Sürümler yükleniyor...", `aria-live="polite"`. `indir.js` doldurur. |
| "iPhone ve iPad" (`#iphone`) | `.ios-kart`: App Store uygulaması yok, Safari'den ana ekrana eklenince simgeyle açılır, bildirim gelir (iOS 16.4+). Mavi `#iosEkle` düğmesi (`aria-controls="iosAdimlar"`) dört adımlık `#iosAdimlar` listesini açar; `#iosNot` cihaza göre uyarı yazılan yer. |
| "Android sürümleri" + `#indirTablo` | Açıklama (eski sürüme dönmek, SHA-256 karşılaştırmak) ve `indir.js`'in çizdiği tablo. |
| "Android'e nasıl kurulur?" | Dört adım: İndir → `egitim-evi.apk` iner → "bilinmeyen uygulamalar" izni → Yükle (güncellemede bilgiler silinmez). |
| "Uygulama ne yapar?" | Bugünkü sürüm çocuğun telefonuna kurulur (Eğitim Evi Aile): konum ve uygulama kullanım süresi veliye; okul görmez, 7 gün sonra silinir; hiçbir uygulamayı kapatmaz. Aydınlatma metnine ve `#iphone` bölümüne bağlantı. |
| "← Ana sayfaya dön" | `/` |
| Alt bilgi | Ortak alt bilgi (boş `#sIletisim` dahil). |

Sayfada `data-act` olarak yalnız şeritteki iki ortak düğme var (`tema-degis`, `yapimcilar`); onları
[../js/belge.md](../js/belge.md) çalıştırır. `#iosEkle`'nin tıklamasını `indir.js` doğrudan bağlar (`data-act` değil).

## Kimle konuşur?

- **Sunan:** [../../sunucu/http.md](../../sunucu/http.md) — `serveStatic`, `htmlSurumle` (`/css/style.css` ve `/js/tema.js`'e
  `?v=<ETag>`; `belge.js` ve `indir.js` sürümlenmez, her açılışta ETag ile sorulur), `statikGonder`; kısa adresler 301.
- **Sayfanın betikleri:** [../js/indir.md](../js/indir.md) (`#indirSon`, `#indirTablo`, `#iosEkle`, `#iosAdimlar`, `#iosNot`'u
  bulur; `GET /api/uygulama`, `credentials: 'omit'`), [../js/belge.md](../js/belge.md) (tema, Yapımcılar, `GET /api/site`),
  [../js/tema.md](../js/tema.md).
- **Sunucu uçları:** `GET /api/uygulama` → `{ playStore, sayfa, alindi, surumler }`
  ([../../sunucu/site.md](../../sunucu/site.md), liste [../../sunucu/uygulama-surum.md](../../sunucu/uygulama-surum.md)); girişsiz
  açık. `GET /api/site` (Yapımcılar).
- **Buraya bağlananlar:** her sayfanın üst şeridindeki "İndir" (`public/index.html` ve öteki düz sayfalar;
  [../KLASOR.md](../KLASOR.md)); [../js/parcalar/27b-aile.md](../js/parcalar/27b-aile.md) (`AILE_APK = '/indir/indir.html'`,
  "Çocuğumun telefonu" sayfasındaki "indirme sayfası" bağlantısı); `index.html`'deki SSS ("Android uygulamasını nereden
  indiririm?", "iPhone'da kullanabilir miyim?").
- **Kullandığı dosyalar:** `/manifest.json`, `/simge-192.png?v=2` ([../KLASOR.md](../KLASOR.md)).
- **Araçlar:** `araclar/gezinti.js` ekran turunda bu sayfayı ve "iPhone'a ekle" adımlarını fotoğraflar
  ([../../araclar/gezinti.md](../../araclar/gezinti.md)).
- **Görünüm:** ortak stiller [../css/parcalar/CSS.md](../css/parcalar/CSS.md) (`29-dis-sayfalar.css`; renk değişkenleri `--mavi`,
  `--mavi-yazi`, `--mavi-zemin`, `--ustune-yazi`, `--kart` `00-temel.css`'te); sayfaya özgü sınıflar kendi `<style>`'ında.

## Nasıl çalışır (adım adım)?

```
/indir, /download, /indir.html ─► 301 /indir/indir.html
/indir/indir.html ─► 200 text/html (iskelet: "Sürümler yükleniyor...")
   tema.js ─► style.css?v=… ─► belge.js + indir.js (defer)
   indir.js: ana ekrandan mı açıldı (standalone)? ── evet ─► location.replace('/')  (site açılır)
             hayır ─► #iosEkle'ye tıklama bağla
                     fetch /api/uygulama ─► surumler var  ─► #indirSon: "Son sürüm X" + "İndir (APK, N MB)" [+ Google Play]
                                                              #indirTablo: Sürüm | Tarih | Neler değişti (+SHA-256) | Boyut | Dosya (İndir)
                                         └► boş / hata    ─► #indirSon: "Sürüm listesi şu an alınamadı" + GitHub'daki sürümler
iPhone'a ekle ─► #iosAdimlar açılır; #iosNot: iPhone değilse "telefonunda …/indir adresini aç", Safari dışıysa uyarı
```

## Dikkat!

- **İskelet ile betik birbirine kimliklerle bağlı.** `indirSon`, `indirTablo`, `iosEkle`, `iosAdimlar`, `iosNot` adlarını
  değiştirirsen `indir.js`'i de değiştir; yoksa sayfa "Sürümler yükleniyor..."da kalır ya da iPhone düğmesi çalışmaz.
- **Manifest bu sayfada da var** ki iPhone'da bu sayfadan "Ana Ekrana Ekle" denebilsin; ana ekrandan açılınca `indir.js` siteye
  geçer. Manifestin `start_url`'ü zaten `/`.
- **Mutlak yollar.** Sayfa `/indir/` altında; bütün `src`/`href` `/` ile başlamalı (`testler/test-adresler.js` denetler; ör.
  `/indir/kvkk.html` 404'tür).
- **Satır içi betik çalışmaz** (`script-src 'self'`); bu yüzden davranış ayrı dosyada (`indir.js`). Gömülü `<style>` serbest.
- **Metin koddan eski kalabilir:** "Uygulama ne yapar?" bugünkü sürümü yalnız Eğitim Evi Aile olarak anlatıyor; Android
  uygulaması bütün rollere genişleyince (planlı iş) bu paragraf da değişmeli.
- **"Android 8.0 ve üstü"** yazısı HTML'de değil, `indir.js`'te sabit.
- **İletişim satırı boş:** alt bilgideki `#sIletisim`'i bu sayfada dolduran yok ([../js/belge.md](../js/belge.md)).
- **Dış bağlantılar:** "GitHub" ve indirme düğmeleri GitHub'a gider; sunucunun güvenlik başlığı yalnız sayfanın kendi
  isteklerini (`connect-src 'self'`) sınırlar, bağlantıya tıklamayı değil. APK adresinin yalnız uygulamanın kendi deposundan
  olabilmesini sunucu süzer ([../../sunucu/uygulama-surum.md](../../sunucu/uygulama-surum.md)).

## Testleri

- `testler/test-adresler.js` (sunucu ister) — `/indir/indir.html` 200 (GET ve HEAD) ve `<h1>Eğitim Evi'ni indir</h1>`; `/indir`,
  `/indir/`, `/indir.html`, `/download`, `/DOWNLOAD`, `/Indir/Indir.html` ve Türkçe klavyeyle yazılan `/İNDİR`, `/ındır`
  yazılışlarının 301'i; `/indir/kvkk.html` 404; sayfada eski adrese bağlantı olmaması, öteki sayfaların `href="/indir/indir.html"`
  göstermesi, varlıkların mutlak yolla yüklenmesi.
- `testler/test-etut.js` — `/api/uygulama` girişsiz açık ve yalnız `alindi`, `playStore`, `sayfa`, `surumler` alanlarını dönüyor
  (testte dışarıya istek atılmaz); `/indir/indir.html` sayfası `/js/indir.js`'i yüklüyor; `/indir` ve `/download/` 301.
- `testler/test-uygulama-surum.js` (sunucusuz) — tablonun beslendiği listenin süzülmesi (taslak/ön sürüm atılır, APK adresi
  yalnız kendi depodan, SHA-256 64 hane, en yeni üstte).
- Hepsi `bash testler/tumtest.sh` içinde. Elle: `/indir`'i aç → sürüm kutusu ve tablo dolmalı (sunucunun dışarıya çıkışı
  kapalıysa "Sürüm listesi şu an alınamadı" ve GitHub düğmesi); "iPhone'a ekle" adımları açmalı; telefon genişliğinde tablo
  kartlara dönmeli.

## Son durum

- `git log` (eski adıyla birlikte): 4 commit. `fa9a072 commit 510` (2026-09-26): `public/indir.html` olarak eklendi.
  `b9b5908 commit 511` (2026-09-26): iPhone/iPad bölümü (mavi düğme, adımlar), `viewport-fit=cover`, manifest ve
  `apple-*` etiketleri, açıklama ve başlık.
- `b6bfc03 commit 517` (2026-09-27): `public/indir/indir.html`'e taşındı; şeritteki ve alt bilgideki bağlantılar asıl adreslere
  (`/indir/indir.html`, `/sss/sss.html`, `/kosullar/kosullar.html`, `/kvkk/kvkk.html`).
- `0d27eba commit 523` (2026-09-27): sekme ve ana ekran simgesine `?v=2`, şeritteki logo yeni çizgi ev. O günden beri değişmedi.
- Planlı işlerden etkileyecekler: kullanıcının 3 Ekim kararı — bilgisayar için `.exe` yok, site tarayıcıdan uygulama olarak
  yüklenir; indirme sayfasında Bilgisayar ("Yükle", tarayıcı adımları), Android (APK + Google Play) ve iOS (tarayıcıdan ana
  ekrana ekleme) olacak; tasarım örneğinde yapıldı, gerçek sayfada henüz yok. "Android yerel uygulama" (bütün roller; uygulama
  kendini güncelleyecek — sürüm bilgisi bu sayfanın listesinden ya da yeni bir uçtan) "Uygulama ne yapar?" metnini değiştirir.
  "Çok dil" (durağan sayfaların arayüz metni seçili dile göre), "Site duyurusu" (şerit bu sayfanın üstünde de) ve "Arama motorunda
  görünme" (`/indir` için başlık ve açıklama) de bu sayfaya dokunur.
