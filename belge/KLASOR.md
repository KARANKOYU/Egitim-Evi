# belge/KLASOR.md

İnsan için yazılmış büyük belgelerin klasörü: kullanıcının gözünden kılavuz (`KILAVUZ.md`), sunucuya kurulum rehberi
(`SUNUCUYA-KURULUM.md`), projenin ilk ayının yapım günlüğü (`NASIL-YAPILDI.html`) ve sunucudaki iki gizli ayar dosyasının
depoya girebilen örnekleri (`config.ornek.yml`, `admins.ornek.json`).

## Bu dosya ne yapar?

Kod dosyalarının yanındaki `.md`'ler "bu kod nasıl çalışıyor" sorusunu cevaplar; kökteki [../TANITIM.md](../TANITIM.md) de
geliştiriciye depoyu gezdirir. `belge/` ise başka bir okura yazılmış: siteyi **kullanacak**, **kuracak** ya da projenin
**hikâyesini** merak eden kişiye. Bu dosya o klasörün içindekileri tek tek tanıtır: her dosya ne anlatır, kim okur, hangi kod
onu anar, nasıl güncellenir ve nerede eskimiş.

Klasörde çalıştırılan hiçbir şey yok. Sunucu da bu klasörü web'den sunmaz: statik dosya kökü yalnız `public/`'dir
([../sunucu/http.md](../sunucu/http.md), `serveStatic`), yani `egitimevi.org/belge/...` diye bir adres yoktur. Belgeler
GitHub'da ya da depo kopyasında okunur.

İki örnek dosyanın sebebi şu: sitenin iki ayar dosyası, `data/config.yml` (iletişim bilgileri, Play Store bağlantısı,
aralıklar) ve `data/admins.json` (sistem yöneticisi hesapları), sunucunun `data/` klasöründe durur ve depoya **asla** girmez
(içlerinde iletişim bilgisi, e-posta, ilk şifre olabilir). Ama sunucuyu kuran kişinin dosyanın biçimini bir yerden görmesi
gerekir. Örnekler bu yüzden burada: kopyalanır, doldurulur, `data/`'ya konur.

## İçinde neler var?

### Dosyalar bir bakışta

| Dosya | Boyut | Satır | Satır sonu | Ne | Kim okur |
|---|---|---|---|---|---|
| [KILAVUZ.md](KILAVUZ.md) | 198 113 bayt | 2719 | **CRLF** | Kullanıcının gözünden bütün özellikler, kurallar, sınırlar, kurulum, testler | herkes; geliştirici ve okul yönetimi |
| [SUNUCUYA-KURULUM.md](SUNUCUYA-KURULUM.md) | 24 527 bayt | 600 | LF | Linux VPS'e kurup `egitimevi.org`'dan yayına alma rehberi | sunucuyu kuran kişi |
| [NASIL-YAPILDI.html](NASIL-YAPILDI.html) | 35 782 bayt | 849 | LF | Ağustos 2026 tarihli "yapım günlüğü": projenin ilk hâli nasıl, neden böyle yazıldı | merak eden; grup ve ders sunumu |
| [config.ornek.yml](config.ornek.yml) | 2 107 bayt | 39 | LF | `data/config.yml` örneği | sunucuyu kuran kişi |
| [admins.ornek.json](admins.ornek.json) | 1 540 bayt | 11 | LF | `data/admins.json` örneği | sunucuyu kuran kişi, sistem yöneticisi |
| `KLASOR.md` | — | — | LF | bu dosya | geliştirici |

### `KILAVUZ.md` — kılavuz

Projenin en büyük belgesi (39 ana bölüm, 43 alt bölüm). Başında `egitimevi.org` bağlantısı ve okuma yönergesi var: her
ekranın fotoğrafı [../ekran-goruntuleri/index.html](../ekran-goruntuleri/index.html)'de, sunucu adımları
`SUNUCUYA-KURULUM.md`'de, kişisel veriler aydınlatma metninde (`public/kvkk/kvkk.html`), kurallar kullanım koşullarında
(`public/kosullar/kosullar.html`). Bölümler kabaca beş grupta:

- **Tanıtım ve kurulum:** "Eğitim Evi nedir?" (kim ne yapar, neler var, gizlilik), "Nasıl çalıştırılır (Linux)", "İlk giriş
  (admin)" (varsayılan ilk yönetici, yönetici dosyası, gizli yönetim paneli `/admin`), "Site ayarları", "İki adımlı giriş
  (2FA)" ve e-posta ayarı, "Okul listesi (MEB)".
- **Hesaplar ve okul yönetimi:** "Hesap türleri ve portallar" (açılış sayfası, okul adresi, sistemi ilk kez kurma sırası),
  "Sınıflar ve ders programı", "Hesap yönetimi" (hesap açma, nakil, toplu aktarım, giriş bilgisi dağıtımı, müdür ve okul
  açma), "Roller ve yetkiler", "Okulun özellikleri", "Eğitim yılı", "Müdür yetkileri".
- **Günlük işler:** "Otomatik bildirimler" (yoklama aralığı, veliye kopya, telefon bildirimi), "Telefona uygulama olarak
  kurma", "Hatırlatıcılar", "Ödev sistemi" (ödev serisi, teslim dosyaları, ekler, okul disk sınırı, telefonda küçültme,
  quiz, filtreler), "Yoklama", "Sınıflarım", "Sınav sistemi", "İlerleyişim", "Veli tarafı", "Eğitim Evi telefon uygulaması"
  (Eğitim Evi Aile), "Anketler ve duyuru okundu bilgisi", "Yemek listesi, servis, kulüpler", "Servis yoklaması".
- **Veri, güvenlik, görünüm:** "Veriler" (yedek, dışa aktarım), "İnternete açma" ve "Yük ve saldırı koruması", "Uyumluluk",
  "Görünüm: açık/koyu tema ve yazı tipleri", "Kayıt kuralları" (aynı e-posta / kullanıcı adı / T.C. çakışmaları), "Veli
  paneli", "Hız".
- **Geliştirici kısmı:** "Ekran görüntüleri" (`araclar/gezinti.js` ile albüm), "Test örneği çalıştırma", "Dosyalar" (klasör
  ağacı ve ön yüzün tek dosya olması), "Testler ve denetimler", "Depo ve gizli bilgiler", "Henüz eklenmeyenler".

Yer yer uç tabloları da içerir (ör. okul disk sınırının yönetici uçları) ve kuralın hangi dosyada olduğunu söyler (ör. "Kod:
`sunucu/bolumler/okul-disk.js`"); ama kodun içini anlatmaz, her sınırı ve sayıyı kullanıcının diliyle yazar. Kod belgeleri kılavuzun bölümlerine sık bağlanır (ör. [../public/js/parcalar/04f-resim-kucult.md](../public/js/parcalar/04f-resim-kucult.md)
"Telefonda küçültme"ye).

### `SUNUCUYA-KURULUM.md` — internete açma rehberi

Kiralık bir Linux sunucuya (VPS) kurup `https://egitimevi.org`'dan yayına almayı komut komut anlatır; komutlar aksi
yazılmadıkça sunucuda `root` olarak kopyala-yapıştır çalıştırılır. Bölümleri:

- "Neye ihtiyacın var" (alan adı ve VPS önerileri, Eylül 2026 fiyatlarıyla),
- 1. alan adını sunucuya yönlendir, 2. sunucuya bağlan, 3. Node.js ve PostgreSQL kur, 4. uygulamayı yükle (veritabanını
  kur; yönetici hesabın: `cp /opt/egitimevi/belge/admins.ornek.json /opt/egitimevi/data/admins.json`), 5. ayarları yap
  (e-posta, ters vekil `vekil.guven`; iletişim bilgileri: `cp /opt/egitimevi/belge/config.ornek.yml /opt/egitimevi/data/config.yml`
  — yayından önce zorunlu), 6. servis olarak çalıştır (systemd; `TZ=Europe/Istanbul` şart), 7. HTTPS (Caddy), 8. güvenlik
  duvarı, 9. ilk giriş,
- "Yedekleme", "Güncelleme", "İnternete açılınca ne değişiyor", "Saldırı ve aşırı yük (DDoS) koruması", "PostgreSQL şifresini
  unuttum", "Sorun çıkarsa".

### `NASIL-YAPILDI.html` — yapım günlüğü

"Eğitim Evi nasıl yapıldı" başlıklı, "Yapım günlüğü · Ağustos 2026" künyeli tek sayfalık bir anlatı. On bölüm: sistem ne
yapıyor, temel karar: sıfır bağımlılık, mimari, kendi yazdığımız parçalar (SMTP istemcisi, Excel okuyucu/yazıcı, PNG
üretici, bot doğrulaması), okul verisini nereden aldık, güvenlik, başvurduğumuz standartlar, veri modeli, test yaklaşımı
(paket tablosuyla), neyi neden yapmadık. Üstte o günün sayıları: 0 npm paketi, 11.969 satır JS, 84 API ucu, 371 test, 67.661
okul kaydı.

Teknik olarak tam bir HTML belgesi değil, bir parça: ilk satırı `<title>`, ardından Google Fonts bağlantıları
(`fonts.googleapis.com`, `fonts.gstatic.com`) ve satır içi `<style>`; `<!DOCTYPE>`, `<html>`, `<head>`, `<meta charset>` ve
`<script>` yok. Açık/koyu görünüm `prefers-color-scheme` ve `data-theme` ile CSS'te.

### `config.ornek.yml` — site ayarları dosyasının örneği

Sunucuda `data/config.yml` olarak kopyalanıp doldurulur. Baştaki yorum öncelik sırasını anlatır: **yönetim panelinde kaydedilen
değer (veritabanı) > bu dosya > varsayılan**; panel dosyayı hiç yazmaz, "Varsayılana dön" panelde kaydedileni siler ve
dosyadaki değer yeniden geçerli olur; dosya değişince sunucu yeniden başlamadan en geç 30 saniyede okur. Anahtarlar (hepsi
`sunucu/site.js`'te okunan adlarla aynı):

| Anahtar | Örnekteki değer | Anlamı |
|---|---|---|
| `iletisim.eposta`, `iletisim.telefon` | `""` | Sayfaların altındaki "İletişim" satırı ve "+ Ekle > Müdür" penceresi; boş olan görünmez, biçimi bozuk olan boş sayılır |
| `uygulama.playstore` | `""` | `https://play.google.com/...` ile başlamalı; doluysa indirme sayfasında "Google Play'den yükle" düğmesi |
| `araliklar.bildirim_dk` | `5` | Bildirim yoklama aralığı, 1–30 dakika |
| `araliklar.cevrimici_dk` | `5` | "Şu an açık" sayma süresi, 1–60 dakika; en az yoklama aralığı + 1 dakika kullanılır |
| `araliklar.admins_dk` | `1` | `data/admins.json`'a bakma aralığı, 1–60 dakika |

Dosyada **olmayanlar:** "Yapımcılar" listesi (panelde ya da kökteki `yapimcilar.json`'da) ve varsayılan okul disk sınırı
(panelde ya da `EE_OKUL_DOSYA_GB` ortam değişkeninde). Ayrıntı: [../sunucu/site.md](../sunucu/site.md).

### `admins.ornek.json` — yönetici hesapları dosyasının örneği

Sunucuda `data/admins.json` olarak kopyalanır, `chmod 600` yapılır. İki alan:

- `_aciklama` — dosyanın kullanım kılavuzu (kalabilir): sunucu açılışta ve çalışırken her "admins.json okuma aralığı"nda
  (varsayılan 1 dakika) dosyanın değişip değişmediğine bakar; panelde "Yönetici Dosyası > Şimdi oku" ile hemen okutulur;
  dosyada olup veritabanında olmayan yöneticiyi açar (en çok 50 satır); var olan hesaba dokunmaz, dosyadan silineni silmez;
  başka birinin e-postasıyla ya da başka bir hesabın kullanıcı adıyla yazılan satırı yönetici yapmaz; `ad` zorunlu,
  `kullaniciAdi` yazılmazsa e-postadan türetilir; `sifre` boşsa rastgele üretilip yalnız sunucu penceresine bir kez yazılır;
  iki durumda da ilk girişte şifre değiştirilir; e-posta gerçek olmalı (giriş kodu oraya gider).
- `yoneticiler` — bir örnek satır: uydurma bir ad, `ornek.com` alan adlı bir e-posta, bir kullanıcı adı ve boş `sifre`.

Dosyayı okuyan kod [../sunucu/yonetici-dosyasi.md](../sunucu/yonetici-dosyasi.md)'dir (`EN_COK = 50`; `yoneticiler` listesi
bulunamazsa hata iletisi bu örneği gösterir).

## Kimle konuşur?

- **Okurlar:** insanlar. Klasördeki dosyaları ananlar:
  - [../TANITIM.md](../TANITIM.md) — girişte kılavuza ve kurulum rehberine bağlanır; klasör ağacında ve "Öteki belgeler"
    tablosunda `KILAVUZ.md`, `SUNUCUYA-KURULUM.md`, `NASIL-YAPILDI.html`.
  - Araç belgeleri: [../araclar/veritabani-kur.md](../araclar/veritabani-kur.md), [../araclar/eposta-ayarla.md](../araclar/eposta-ayarla.md),
    [../araclar/gezinti.md](../araclar/gezinti.md), [../araclar/zengin-veri.md](../araclar/zengin-veri.md),
    [../araclar/gorsel-veri.md](../araclar/gorsel-veri.md), [../araclar/simge-uret.md](../araclar/simge-uret.md) (KILAVUZ ve
    `NASIL-YAPILDI.html`'deki "PNG üretici"), [../araclar/tema-ornekleri.md](../araclar/tema-ornekleri.md),
    [../araclar/yazitipi-indir.md](../araclar/yazitipi-indir.md).
  - Kod belgeleri: [../server.md](../server.md), [../sunucu/site.md](../sunucu/site.md),
    [../sunucu/yonetici-dosyasi.md](../sunucu/yonetici-dosyasi.md), [../sunucu/veri/yedek.md](../sunucu/veri/yedek.md),
    [../public/js/yonetim/09c-yonetici-dosyasi.md](../public/js/yonetim/09c-yonetici-dosyasi.md),
    [../sunucu/bolumler/odev-dosya.md](../sunucu/bolumler/odev-dosya.md) ve birkaç ön yüz parçası
    ([../public/js/parcalar/04f-resim-kucult.md](../public/js/parcalar/04f-resim-kucult.md),
    [../public/js/parcalar/13-ogrenci-veli.md](../public/js/parcalar/13-ogrenci-veli.md),
    [../public/js/parcalar/14b-odev-teslim.md](../public/js/parcalar/14b-odev-teslim.md),
    [../public/js/parcalar/14c-quiz.md](../public/js/parcalar/14c-quiz.md)); kimi kılavuzun bölümüne bağlanır, kimi
    kılavuzla kod arasındaki farkı yazar.
- **Kodun içinden ananlar** (yalnız yorum ya da ekrana giden metin; hiçbiri dosyayı okumaz):
  - `sunucu/index.js` — aşırı yük koruması yorumunda `SUNUCUYA-KURULUM.md` (asıl DDoS koruması önündeki vekilde); iletişim
    bilgisi yoksa açılışta pencereye "data/config.yml (ornegi belge/config.ornek.yml)" yazar.
  - `sunucu/site.js` — yorumda `config.ornek.yml`.
  - `sunucu/yonetici-dosyasi.js` — yorumda ve hata iletisinde `admins.ornek.json`.
  - `public/js/yonetim/09c-yonetici-dosyasi.js` — yönetim panelinde "Dosya yok…" kutusu ve dosya açıklaması
    `belge/admins.ornek.json`'u gösterir.
  - `araclar/veritabani-kur.js` — yorumda ve yanlış şifrede "Unuttuysan: belge/SUNUCUYA-KURULUM.md içindeki "Şifreyi
    unuttum" bölümü." iletisinde.
  - `sunucu/veri/yedek.js` ve `sunucu/veri/depo/odev-dosyalari.js` — yorumlarda kurulum rehberi (`pg_dump`, `TZ`).
  - `public/js/parcalar/04f-resim-kucult.js` — baş yorumunda kuralların kaynağı olarak kılavuzun "Dosya küçültme ve disk
    sınırı" bölümü.
  - `testler/test-gizli-dosyalar.js` — `belge/admins.json`'u "depoya giremez", iki örneği "depoya girer" listesinde adıyla
    anar (aşağıda "Testleri").
- **Örneklerin gerçek hâllerini okuyan kod:** `data/config.yml` → [../sunucu/site.md](../sunucu/site.md);
  `data/admins.json` → [../sunucu/yonetici-dosyasi.md](../sunucu/yonetici-dosyasi.md).
- **`.gitignore`:** 11. satırdaki yorum örneklerin burada olduğunu söyler; `admins.json` kuralı her yerdeki o adlı dosyayı
  dışarıda tutar (örneğin adı farklı olduğu için girer); 51. satırdaki `belge/ekran-goruntuleri/` eski bir kural (Dikkat'e bak).
- **Testler:** [../testler/test-gizli-dosyalar.md](../testler/test-gizli-dosyalar.md) (aşağıda "Testleri").

## Nasıl çalışır (adım adım)?

### Örneklerin yolculuğu (kurulum)

```
SUNUCUYA-KURULUM.md
  4. Uygulamayı yükle ─► cp belge/admins.ornek.json data/admins.json ─► düzenle, chmod 600
  5. Ayarları yap     ─► cp belge/config.ornek.yml data/config.yml   ─► iletişim bilgilerini doldur
  6. Servis olarak çalıştır ─► sunucu açılır
        sunucu/yonetici-dosyasi.js: data/admins.json'u okur ─► eksik yöneticileri açar
        sunucu/site.js: data/config.yml'i okur (sonra en çok 30 sn'de bir değişti mi diye bakar)
  9. İlk giriş ─► yönetici panelinde "Site Ayarları": kaydedilen değer dosyayı ezer
```

### Belgeler nasıl güncellenir

- **`KILAVUZ.md`** özelliği getiren commit'le birlikte güncellenir (23 commit'te değişti; son üçü aşağıda "Son durum"da).
  CRLF satır sonunu koru (Dikkat).
- **`SUNUCUYA-KURULUM.md`** kurulumu değiştiren işlerde (vekil, saat dilimi, güvenlik sınırları) güncellenir.
- **Örnekler** sunucunun okuduğu biçim değişince: `config.ornek.yml` `sunucu/site.js`'teki anahtarlarla,
  `admins.ornek.json` `sunucu/yonetici-dosyasi.js`'in kurallarıyla aynı kalmalı.
- **`NASIL-YAPILDI.html`** bir tarih belgesi gibi kaldı; 2026-09-26'dan beri dokunulmadı.

## Dikkat!

- **`KILAVUZ.md` CRLF satır sonlu**, öbürleri LF (`git ls-files --eol`: `i/crlf w/crlf`). Satır sonlarını LF'ye çeviren bir
  düzenleyici ya da araç bütün dosyayı "değişmiş" gösterir. Yamaları proje kökünde uygula; dosyayı başka bir yere kopyalayıp
  düzenleme. Satır satır arama yaparken de `\r`'ye dikkat (ör. `tr -d '\r'`).
- **Kılavuzun "Dosyalar" ağacı biraz eskidi** (kodla karşılaştırıldı): albümü `belge/ekran-goruntuleri/` altında "üretilir,
  depoya girmez" diye gösteriyor, oysa albüm kökte, `ekran-goruntuleri/` altında ve depoda (kılavuzun kendi başı ve aynı
  ağacın üst satırı da öyle söylüyor); ön yüz parçalarını "55 parça" ve yönetim parçalarını "4 parça" diye sayıyor, bugün
  `public/js/parcalar/` altında 57, `public/js/yonetim/` altında 5 `.js` var. `.gitignore`'daki `belge/ekran-goruntuleri/`
  kuralı da o eski yerden kalma.
- **Kurulum rehberiyle ilgili küçük ayrılıklar** (kodla ve kılavuzla karşılaştırıldı, düzeltilmedi):
  - "Yedekleme" bölümü geri yüklemeden önceki hâlin `yedek-elle-geri-alma-…` adıyla saklandığını söyler; kod
    (`sunucu/veri/yedek.js`) ve kılavuz `yedek-geri-alma-…` adını yazar. (Güvenlik denetimi tanımında da not edilmiş.)
  - Rehber PostgreSQL dökümünü **haftalık** önerir (`crontab`'da `0 4 * * 0`); kılavuzun "Veriler" bölümü ve
    `sunucu/veri/yedek.js`'in yorumu "günlük `pg_dump` alınır" der.
  - Aynı bölümdeki "yedek dosyasına girmeyenler" tablosunda ödev ve mesaj ekleri (`data/ekler/`) yok; teslim dosyaları ve okul
    fotoğrafları var.
  - `araclar/veritabani-kur.js`'in yanlış şifre iletisi rehberdeki bölümü "Şifreyi unuttum" diye anar; bölümün başlığı
    "PostgreSQL şifresini unuttum".
- **`NASIL-YAPILDI.html` bugünü anlatmaz.** "Sıfır npm paketi", "veritabanı yok, her şey `data/db.json`'da", "84 API ucu",
  "371 test", "bot doğrulaması `server.js` içinde" yazar; bugün uygulama PostgreSQL ve tek bağımlılık `pg` ile çalışıyor,
  sunucu kodu `sunucu/` altında. Okuru yanıltmaması için onu bir tarih belgesi olarak oku; güncel hâl için
  [../TANITIM.md](../TANITIM.md) ve `KILAVUZ.md`.
- **`NASIL-YAPILDI.html` açılınca dışarıya istek gider:** Google Fonts'tan yazı tipi çeker. `<meta charset>` olmadığı için
  tarayıcı kodlamayı kendisi tahmin eder; dosyayı diskten açınca Türkçe harfler yanlış görünebilir (denenmedi).
- **Örneklere gerçek bilgi yazma.** Bu klasör herkese açık depoda. Doldurulmuş hâlleri yalnız sunucuda, `data/` altında durur;
  `belge/admins.json` gibi bir kopya `.gitignore`'a takılır (`admins.json` kuralı her klasörde geçerli) ama başka adla
  kaydedilen bir kopya takılmaz; doldurulmuş `belge/config.yml` de takılmaz, çünkü `config.yml` yalnız `/data/` altında
  dışarıda (`git check-ignore` ile bakıldı).
- **Panelde kaydedilen ayar dosyayı ezer.** `data/config.yml`'i değiştirip sitede değişiklik göremiyorsan o ayar panelden
  kaydedilmiştir; panelde "Varsayılana dön" de.
- **Yazım denetimi bu klasörü taramaz** ([../testler/yazim-denetimi.md](../testler/yazim-denetimi.md) kapsam dışı sayar);
  kılavuzdaki yazım hatalarını hiçbir test yakalamaz.

## Testleri

- [../testler/test-gizli-dosyalar.md](../testler/test-gizli-dosyalar.md) — `belge/admins.ornek.json` ve `belge/config.ornek.yml`
  için "depoya girer", `belge/admins.json` için "depoya giremez" denetimi yapar.
- [../testler/test-site-ayarlari.md](../testler/test-site-ayarlari.md) — `config.yml` önceliğini (veritabanı > dosya >
  varsayılan) kendi geçici `config.yml`'iyle dener; örnek dosyanın kendisini okumaz.
- [../testler/test-yonetici-dosyasi.md](../testler/test-yonetici-dosyasi.md) — `admins.json` biçimini ve kurallarını dener;
  örnek dosyanın kendisini okumaz.
- Belgelerin içeriğini (bağlantılar, sayılar, kodla uyum) denetleyen bir test yok; planlı `testler/test-belgeler.js` klasör
  belgelerinin (bu dosya dahil) klasördeki her dosyayı andığını denetleyecek.
- Elle: GitHub'da `KILAVUZ.md`'yi aç, başındaki bağlantılar (`../ekran-goruntuleri/index.html`, aydınlatma metni, kullanım
  koşulları) çalışmalı; `SUNUCUYA-KURULUM.md`'deki iki `cp` komutundaki dosya adları bu klasördekilerle aynı olmalı.
- Bu belge yazılırken hiçbir şey çalıştırılmadı; dosyalar okunarak ve kodla karşılaştırılarak yazıldı.

## Son durum

- `git log -- belge`: 29 commit. Son üçü:
  - `7fda2ee commit 543` (2026-09-30) — yalnız `KILAVUZ.md`: öğrenci hesabı açılınca şifre ekrandayken pencerenin dışına
    tıklamanın onu kapatmadığı, geri tuşu / başka sayfa / çıkış / sekme kapatmanın önce sorduğu; "Hesap" penceresindeki yeni
    şifrenin kendiliğinden silinmediği; toplu giriş bilgisi listesi indirilmeden ya da yazdırılmadan ayrılırken sorulduğu
    (Excel aktarımıyla açılan hesapların listesi için de) eklendi.
  - `40fc7e7 commit 525` (2026-09-27) — yalnız `KILAVUZ.md`: "Dosya küçültme ve disk sınırı" bölümü ("Okul disk sınırı" ve
    "Telefonda küçültme" alt bölümleri, yönetici uçları tablosu); site ayarlarına "Varsayılan okul disk sınırı" ve
    `EE_OKUL_DOSYA_GB` kaynağı; okul açma adımlarına "Dosya alanı"; okul sayfası fotoğrafları, ekler ve teslim dosyalarının
    sınır tablolarına küçültme ve okul sınırı satırları.
  - `566b917 commit 524` (2026-09-27) — `KILAVUZ.md` ve `SUNUCUYA-KURULUM.md`. Kılavuzda: "Öğrenciler bu ödeve dosya
    yükleyebilsin" kutusu (yeni ödevde kapalı) ve kapatılınca teslimin donması, teslim ve eklerde doluluk çubuğu, silinme
    zamanının ödevden hesaplanması ve yanlış tarihe karşı 7 günlük koruma (şema 034), "Yük ve saldırı koruması"nda okul ağına
    göre seçilmiş sınırlar tablosu (oturum başına ve IP başına API, kaba kuvvet kilidi, akıllı doğrulama sorusu). Rehberde:
    `vekil.guven` yanlış olursa bütün sitenin tek IP sayılıp yoğun saatte kapanacağı uyarısı ve nasıl denetleneceği, systemd
    hizmetine `Environment=TZ=Europe/Istanbul` ve gerekçesi, DDoS bölümünde güncel sınırlar (1000 eşzamanlı API isteği, 8192
    bağlantı, vekilsiz kurulumda IP başına 2048) ve Cloudflare'de `/api/login`'e dar kural konmaması.
- Dosya dosya: `KILAVUZ.md` 23 commit (ilk `387ec92 commit 492`, 2026-09-26); `SUNUCUYA-KURULUM.md` 6 commit (ilk
  `ed9f8d4 commit 498`, son 524); `config.ornek.yml` 6 commit (ilk `101ac0c commit 380`, son `276c0a0 commit 521` — öncelik
  yorumu, biçim kuralları ve `araliklar` bölümü eklendi); `admins.ornek.json` tek commit (`276c0a0 commit 521`, 2026-09-27);
  `NASIL-YAPILDI.html` 4 commit (`4bff8c7 commit 294`, 295, 296 — 2026-09-25 — ve `0f08b32 commit 354`, 2026-09-26, "Test
  yaklaşımı" bölümü).
- Bilinen açıklar (düzeltilmedi): kılavuzun "Dosyalar" ağacındaki eski satırlar, rehberdeki geri-alma dosya adı, ekler
  satırının yokluğu ve `pg_dump` sıklığındaki ayrılık, yapım günlüğünün eskimesi (yukarıda).
- Planlı işlerden bu klasöre dokunacaklar:
  - Her yeni özellik `KILAVUZ.md`'ye bölüm ya da satır getirir.
  - "Sistem" (yöneticiye zorunlu doğrulama uygulaması, e-posta sağlığı, bakım modu…): `KILAVUZ.md` ve `SUNUCUYA-KURULUM.md`;
    rehbere e-posta servisi seçenekleri tablosu ve `egitimevi.org` için SPF/DKIM/DMARC örnekleri. Aynı işin "Yenilikler"
    penceresi için tanım bu klasöre yeni bir dosya öneriyor: `belge/YENILIKLER.md` (ya da JSON) sürüm listesi.
  - "Paneller /panel/admin ve /panel/destek": destek ekibi `data/destek.json`'la açılacak (`admins.json` kalıbıyla); tanım
    bu klasöre onun örneğini, `belge/destek.ornek.json`'u ekletiyor; rehbere `destek.json` adımı. O gün bu belgeye satır
    eklenmeli (klasör belgesi klasördeki her dosyayı anmalı).
  - "Optimizasyon + saklama süreleri": yedeklerin sıkıştırılması ve kopya sayısı — rehberin "Yedekleme" bölümü (`pg_dump`
    önerisi korunacak).
  - "Güvenlik denetimi": rehberdeki geri-alma dosya adı düzeltilecek.
  - "Arama motorunda görünme" (canlıya çıkınca): rehbere Search Console / Bing doğrulama adımı.
  - Kullanıcının henüz seçmedikleri (e-posta servisi, yedeklerin sunucu dışı kopyası) yalnız kurulum rehberine yazılacak.
  - "Paneller": ayrıca kılavuzdaki `/admin` adresleri değişecek. "Kulüpler kaldırılacak": "Yemek listesi, servis, kulüpler"
    bölümü.
