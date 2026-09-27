# sunucu/index.js

Sunucunun giriş noktası: ayarları ve okul listesini yükler, veritabanını açar, HTTP sunucusunu dinlemeye başlatır,
aşırı yük korumasını ve bütün zamanlayıcıları kurar.

## Bu dosya ne yapar?

`node sunucu/index.js` (ya da `node server.js`) dediğinde çalışan ilk kod bu. Üç işi var:

1. **Açılış:** `data/ayarlar.json` ve okul listesi yüklenir, veritabanı açılır (şema dosyaları uygulanır). Veritabanı
   hazır olmadan port dinlenmez, yani yarım açılmış sunucuya istek gelmez.
2. **Her isteğin kapısı:** gelen her HTTP isteği önce buradan geçer: gövde süresi, genel hız sınırı, aşırı yük
   (503), sonra `/api/...` ise `api.js`'e, değilse `http.js`'in statik dosya sunucusuna gider. Beklenmeyen hatalar
   burada yakalanıp düzgün bir JSON cevabına çevrilir.
3. **Zamanlayıcılar:** ders/ödev hatırlatmaları, kişisel hatırlatıcılar, quiz süreleri, servis seferleri, Eğitim Evi
   Aile verisinin temizliği, dosya süpürme ve disk mutabakatı, okul fotoğrafı artıkları, günlük yedek, `admins.json`
   yoklaması, güvenlik kayıtlarının temizliği.

## İçinde neler var?

Dışa açık hiçbir şey yok; dosya çalıştırılmak için var. İçindekiler:

- **Aşırı yük koruması**
  - `gecikmeOlcer` (`monitorEventLoopDelay`) — olay döngüsü gecikmesi saniyede bir ölçülür; ortalama 150 ms'yi
    geçerse `yogun = true` ve yeni API istekleri hemen `503 {"error":"Sunucu şu an çok yoğun..."}` + `Retry-After: 5`
    alır.
  - `EN_FAZLA_SUREN_API = 1000` — aynı anda işlenen API isteği sınırı; dolunca yine 503.
  - `IP_BAGLANTI_SINIRI = 2048`, `EN_FAZLA_BAGLANTI = 8192` — vekil yokken tek IP'nin açık tutabileceği bağlantı ve
    sunucunun toplam bağlantısı (`server.maxConnections`). Tek IP toplamın ancak dörtte birini tutabilir.
- **İstek işleyici** (`http.createServer` geri çağrısı):
  - `/api/odev-dosya/yukle` POST'u DIŞINDAKİ her isteğe 30 saniyelik gövde süresi; cevap gittiği hâlde gövde hâlâ
    geliyorsa 1,5 sn sonra bağlantı kesilir.
  - Genel hız sınırı `genelIstekSiniri(ip, dosyaMi, oturumAnahtari)`: aşılırsa `429` + `Retry-After: 60` +
    `{"error":"Çok fazla istek gönderdin. Bir dakika bekle.","sinir":"dosya|oturum|ip"}`. "Dosya" sayılanlar: `/api/`
    ile başlamayan her adres ve `/api/okul-foto/...`.
  - `/api/...` → `handleApi`; hata olursa: veritabanı hatası `hataCevir` ile 400/409/503'e (tekillik çakışmasında
    `alan` da gider), `err.kod` taşıyan beklenen istemci hataları (413 çok büyük, 408 süre) o koda, "çok büyük" /
    "Geçersiz veri" iletileri 400'e, geri kalan her şey `500 {"error":"Sunucu hatası"}` (ayrıntı yalnız günlüğe).
  - GET/HEAD dışındaki statik istekler `405` (gövdesiz).
  - `serveStatic` eşzamanlı bir hata atarsa yalnız o istek 500 alır, sunucu düşmez.
- **Sunucu süreleri:** `headersTimeout` 20 sn (yavaş başlık — Slowloris), `requestTimeout` 65 dk (50 MB'lık yükleme
  yavaş okul ağında uzun sürebilir), `keepAliveTimeout` 10 sn, `maxHeadersCount` 60.
- **Zamanlayıcılar** (her `setInterval` `unref`'li, süreci açık tutmaz; açılıştan birkaç saniye sonra bir kez
  çalışan `setTimeout`'lar ise `unref`'siz):

  | Ne | Sıklık | Kim |
  |---|---|---|
  | Oturum, hız kaydı, bot sorusu temizliği | 10 dk | `guvenlik.guvenlikTemizle` |
  | Ders/ödev hatırlatmaları | `HATIRLATMA_ARALIK_MS`; açılıştan 10 sn sonra bir kez | `hatirlatma.hatirlatmalariCalistir` |
  | Kişisel hatırlatıcılar | 1 dk | `bolumler/hatirlatici.hatirlaticilariGonder` |
  | Quiz: süresi dolan denemeler, sonuç bildirimi | 1 dk | `bolumler/quiz.quizTemizle` |
  | Servis seferleri ve 30 günlük servis kayıtları | 10 dk | `bolumler/okul-hayati.servisTemizle` |
  | Aile uygulamasının 7 günden eski konum/ekran süresi | 1 saat | `depo.aile.temizle` |
  | Teslim dosyası + ek süpürme, ardından disk mutabakatı | 1 saat; açılıştan 60 sn sonra | `odev-dosya.dosyaSupur`, `ekler.ekSupur`, `okul-disk.mutabakat` |
  | Okul sayfası fotoğraf artıkları | 6 saat; açılıştan 90 sn sonra | `okul-sayfasi.fotoSupur` |
  | Günlük yedek denetimi | `YEDEK_ARALIK_MS`; açılıştan 20 sn sonra | `veri.yedekKontrol` |
  | `data/admins.json` yoklaması | site ayarı `adminsAralikDk` (varsayılan 1 dk) | `yonetici-dosyasi.zamanla` |

- `require('./push').baslat()` — bildirim yazılınca telefonuna da gitsin diye bildirim kuyruğunu kurar.
- `dinlemeyeBasla()` — `PORT`/`HOST`'u dinler, konsola kutu yazar: yerel adres, ağdaki IPv4 adresleri, site adresi,
  vekil güveni, sunucu Türkiye saatinde değilse uyarı, e-posta kurulu mu (değilse "giriş kodları BU PENCEREYE
  yazılacak"), iletişim bilgisi yoksa uyarı.
- `yoneticiDosyasiniIzle()` — `yonetici-dosyasi.zamanla(depo, { sifreUret: ilkSifreUret, aralikMs })`.
- `kapan()` — SIGINT/SIGTERM'de bağlantı havuzunu kapatıp çıkar.

## Kimle konuşur?

- Çağırdıkları: `./api` (`handleApi`), `./ayarlar`, `./guvenlik` (`genelIstekSiniri`, `guvenlikTemizle`,
  `istekAnahtari`, `istemciIp`), `./hatirlatma`, `./http` (`bad`, `baslikEkle`, `sendJSON`, `serveStatic`),
  `./okullar` (`okullariYukle`), `./site` (`iletisimVarMi`, `ayar`), `./veri` (`baslat`, `hataCevir`, `kapat`,
  `yedekKontrol`, `YEDEK_ARALIK_MS`, `depo`, `ilkSifreUret`), `./yollar` (`HOST`, `PORT`), `./push`,
  `./yonetici-dosyasi`, bölümlerden `hatirlatici`, `quiz`, `okul-hayati`, `odev-dosya`, `ekler`, `okul-disk`,
  `okul-sayfasi`.
- Onu çağıran: `server.js` (kabuk) ve `package.json` → `npm start`; kurulumda systemd hizmeti.
- Tablolara kendisi dokunmaz; zamanlayıcıların çağırdığı depo işlevleri dokunur.

## Nasıl çalışır (adım adım)?

```
açılış:  ayarlariYukle → okullariYukle → (sunucu nesnesi, zamanlayıcılar kurulur)
         → veri.baslat() (bağlantı + şema) ──ok──> dinlemeyeBasla + yoneticiDosyasiniIzle
                                        └─hata─> "veritabanı açılamadı" + ipucu → çıkış(1)

istek:   gövde süresi (yükleme hariç) → hız sınırı (429) →
           /api/ ?  ── evet ─> yoğun mu / 1000 dolu mu (503) → handleApi → hata çevirisi
                    └─ hayır ─> GET/HEAD değilse 405 → serveStatic (http.js)
```

Port hatası: `HOST === '::'` ve IPv6 yoksa (`EAFNOSUPPORT`/`EADDRNOTAVAIL`) `0.0.0.0`'a düşer; port kullanımdaysa
(`EADDRINUSE`) açıklayıcı ileti yazıp çıkar.

## Dikkat!

- **Sınırlar okul ağına göre ayarlı.** Büyük bir okulda 300 öğrenci aynı anda tek IP'den (NAT) girer; ilk açılışta
  öğrenci başına ~10 API ve ~24 dosya isteği, tarayıcı başına 6'ya kadar bağlantı. Bu yüzden IP başına dakikada
  15000 dosya / 6000 API isteği, asıl sınır oturum başına 300 (`guvenlik.js`). Sayıları küçültürsen
  `test-okul-agi.js` kalır.
- Vekil güveni açıkken IP başına bağlantı sınırı uygulanmaz: bütün bağlantılar vekilden gelir.
- 500 cevabında ayrıntı istemciye GİTMEZ (tablo/kısıt adı sızmasın); günlüğe `API hatası:` diye yazılır. Test
  betikleri günlükte bu satırı arar.
- Ödev son teslim saati sunucunun yerel saatiyle okunur; sunucu Türkiye saatinde değilse ödevler kayarak kapanır.
  Kurulum `TZ=Europe/Istanbul` verir; değilse açılışta uyarı çıkar.
- Zamanlayıcılar sunucu açıkken çalışır; testler ayrı süreç olduğu için bazıları (`quizTemizle` gibi) testte
  doğrudan çağrılır.
- Yeni bir periyodik iş eklerken `unref()` unutma ve hatasını `catch` ile yut/günlüğe yaz: yakalanmamış bir söz
  reddi süreci düşürebilir.

## Testleri

- `testler/test-okul-agi.js` — 300 kişi tek IP, 429/503 çıkmaması; tek kötü niyetlinin durdurulması.
- `testler/girdi-denetimi.js` — bozuk gövdede 500 yok.
- `testler/test-adresler.js` — `%00`'lı adresten sonra sunucu ayakta.
- `testler/test-yonetici-dosyasi.js` — `admins.json` aralıkla yoklama.
- `testler/test-hatirlatici.js`, `test-quiz.js`, `test-servis-yoklama.js`, `test-odev-dosya.js`, `test-okul-disk.js` —
  zamanlayıcıların çağırdığı işler.
- Elle: `PORT=3200 EE_DATA=testler/testdata node server.js` → açılış kutusu; `curl -X POST localhost:3200/` → 405.

## Son durum

- Son commit `40fc7e7 commit 525` (2026-09-27, okul disk sınırı): saatlik dosya süpürme, `Promise.allSettled` ile
  süpürme bittikten sonra `okul-disk.mutabakat()`'ı çalıştıran `dosyaTemizligi()`'ne dönüştü.
- `566b917 commit 524` (canlı hazırlık: 50 MB yükleme, 300 kişilik okul ağı): eski `hizSinir` yerine
  `genelIstekSiniri` (IP + oturum sayacı), `EN_FAZLA_SUREN_API` 400 → 1000, IP başına bağlantı 256 → 2048 (toplam
  1024 → 8192). `276c0a0 commit 521`: tekillik çakışmasında cevaba `alan` eklendi, `yoneticiDosyasiniIzle` geldi,
  iletişim uyarısı yönetim paneline yönlendiriyor. `3b8fd36 commit 519`: quiz zamanlayıcısı.
- Sıradaki iş "sunucuda küçültme" (sıkıştırma ve kota işinin sunucu kısmı) ve "optimizasyon + saklama süreleri" buraya yeni
  zamanlayıcılar ekleyecek.
