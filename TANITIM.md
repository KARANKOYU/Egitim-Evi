# Eğitim Evi — tanıtım

Merhaba. Bu dosya Eğitim Evi'ne ilk kez bakan birine, yani sana, projeyi baştan sona anlatır: ne olduğunu, kimlerin
kullandığını, deponun nasıl dizildiğini, bir isteğin tarayıcıdan veritabanına nasıl gidip geldiğini, güvenliğin nerede
durduğunu, nasıl çalıştırıp test edeceğini ve her kod dosyasının açıklamasının nerede olduğunu.

Kullanıcının gözünden kılavuz (her bölüm, her ekran, bütün sınırlar ve sayılar) ayrıca var: [belge/KILAVUZ.md](belge/KILAVUZ.md).
Sunucuya kurulum: [belge/SUNUCUYA-KURULUM.md](belge/SUNUCUYA-KURULUM.md). Bu dosya onları tekrar etmez; kodun içine
girmek isteyen birine yol gösterir. Her kod dosyasının yanında (ya da yakında) aynı adlı bir `.md` durur:
`sunucu/api.js` → `sunucu/api.md`. O belgeler hep aynı sekiz bölümle yazılır (ne yapar, içinde neler var, kimle
konuşur, adım adım, dikkat, testleri, son durum). En sondaki **Belge haritası** hepsini klasör klasör listeler.

## İçindekiler

1. [Eğitim Evi nedir?](#1-eğitim-evi-nedir)
2. [Kimler kullanır?](#2-kimler-kullanır)
3. [Depo nasıl dizilmiş?](#3-depo-nasıl-dizilmiş)
4. [Bir isteğin yolculuğu](#4-bir-isteğin-yolculuğu)
5. [Roller ve yetkiler](#5-roller-ve-yetkiler)
6. [Veritabanı ve şema dosyaları](#6-veritabanı-ve-şema-dosyaları)
7. [Güvenlik düzeni](#7-güvenlik-düzeni)
8. [Testler ve denetimler](#8-testler-ve-denetimler)
9. [Araçlar](#9-araçlar)
10. [Android uygulaması (ayrı depo)](#10-android-uygulaması-ayrı-depo)
11. [Sözlük](#11-sözlük)
12. [Kurallar](#12-kurallar)
13. [Nasıl çalıştırılır, nasıl test edilir?](#13-nasıl-çalıştırılır-nasıl-test-edilir)
14. [Nereden devam?](#14-nereden-devam)
15. [Belge haritası](#15-belge-haritası)

---

## 1. Eğitim Evi nedir?

Eğitim Evi bir okul portalı. Öğrencinin, velinin, öğretmenin ve okul yönetiminin her gün baktığı şeyleri tek yerde
toplar: ödevler (içinde quiz de olabilir), sınav notları, devamsızlık ve etüt yoklaması, ders programı, mesajlar ve
duyurular, anketler, takvim, yemek listesi, kulüpler, servis yoklaması ve servisin canlı konumu. Tarayıcıdan açılır,
telefona uygulama gibi kurulabilir (PWA); ayrıca yerel bir Android uygulaması da hazırlanıyor (bkz. bölüm 10).

Teknik olarak bilerek sade:

- **Sunucu:** Node.js (20 ve üstü; 24 önerilir) + PostgreSQL 17. Tek npm bağımlılığı `pg` (`package.json`). Excel
  okuma/yazma, SMTP, Web Push şifrelemesi, resim türü tanıma gibi işlerin hepsi projenin kendi kodunda
  (`sunucu/yardimci/`, `sunucu/push.js`).
- **Ön yüz:** çerçevesiz, derleyicisiz ES5 JavaScript. `public/js/parcalar/` altındaki parçaları sunucu ad sırasıyla
  tek dosyada birleştirir; CSS de öyle.
- **Her okulun kendi adresi var:** `egitimevi.org/school/<okulun-kısa-adı>`. Öğrenci, öğretmen ve servisçi okulunun
  adresinden girer; okul o sayfayı kendi kapağı, logosu ve renkleriyle düzenler.
- Reklam yok, analiz servisi yok. Sunucunun dışarıyla konuştuğu yerler yalnız işin gerektirdikleri: e-posta sunucusu
  (SMTP, `sunucu/yardimci/eposta.js`), tarayıcının bildirim servisi (Web Push, `sunucu/push.js`) ve Android sürüm
  listesi için GitHub (`sunucu/uygulama-surum.js`). Tarayıcı harita döşemelerini OpenStreetMap'ten çeker.

Hedef alan adı `egitimevi.org`. Bu bir okul grup projesi; depo GitHub'da herkese açık (`KARANKOYU/Egitim-Evi`), bu yüzden
depoya hiçbir gizli bilgi girmez (bölüm 7 ve 12).

## 2. Kimler kullanır?

Kodda her kullanıcı satırının bir `role` alanı var (veritabanında `kullanicilar.rol`). Bu adları kodda çok göreceksin:

| Kim | Koddaki rol | Hesabı nasıl açılır | Ne yapar |
|---|---|---|---|
| Öğrenci | `student` | Okul açar (tek tek ya da dosyadan) | Ödevlerini görür, dosya teslim eder, quiz çözer; notlarını, devamsızlığını, programını izler |
| Veli | `parent` | Kendisi yetişkin hesabı açar, çocuğu veli koduyla bağlar; ilk çocuk bağlanınca hesabın rolü `parent` olur, son çocuk çıkınca yeniden boşalır (`depo/kullanicilar.js`) | Çocuğunun ödevini, notunu, devamsızlığını, servisini görür |
| Öğretmen | `teacher` | Kendi yetişkin hesabı + müdür kişi koduyla okula ekler | Ödev ve sınav verir, not girer, yoklama alır, mesaj yazar |
| Müdür | `principal` | Kendi yetişkin hesabı + yönetici kişi koduyla okulu açar | Okulun her şeyini yönetir; bütün yetkiler onda |
| Servisçi | `servisci` | Okul açar | Servis saatlerinde yoklama alır, konumu velilere görünür |
| Sistem yöneticisi | `admin` | `data/admins.json` ya da ilk açılıştaki varsayılan yönetici | Okul açar, müdürleri yönetir, site ayarları, yedek; ekranları gizli `/admin` adresinde |
| Rolsüz yetişkin | `''` (boş) | Kendisi kaydolur | Henüz portalı yok: yalnız başlangıç, hatırlatıcılar, "+ Ekle" |

Önemli fikir: **tek kişi, birden çok portal.** Bir yetişkin aynı hesapla A okulunda öğretmen, B okulunda müdür ve
kendi çocuğunun velisi olabilir. Her okul rolü veritabanında ayrı bir **rol satırıdır** (yetişkin hesabına
`ana_hesap_id` ile bağlı); oturum her zaman o satırlardan biriyle açılır. Ayrıntısı bölüm 5'te.

## 3. Depo nasıl dizilmiş?

```
eğitim evi/
├── server.js          4 satırlık kabuk: sunucu/index.js'i çağırır (eski "node server.js" alışkanlığı için)
├── package.json       tek bağımlılık (pg) ve komutlar: start, veritabani-kur, eposta-ayarla, test
├── yapimcilar.json    "Yapımcılar" listesinin varsayılanı (panelde kaydedilmemişse bu gösterilir)
├── badwordsfilter.json yorum süzgecinin kelime listesi (sunucu/yardimci/kufur-suzgeci.js okur)
├── .gitignore         depoya girmeyecekler (data/, gizli anahtarlar, günlükler...)
├── TANITIM.md         bu dosya
│
├── sunucu/            ARKA UÇ (Node.js)
│   ├── *.js           giriş noktası, HTTP, API yönlendiricisi, güvenlik, yetki, ayarlar, ortak yardımcılar
│   ├── bolumler/      her bölüm kendi /api uçlarını sunar (ödev, sınav, mesaj, servis...)
│   ├── veri/          VERİ KATMANI: SQL yalnız burada
│   │   ├── depo/      tablo gruplarına göre sorgular (kullanıcılar, ödevler, sınavlar...)
│   │   └── sema/      numaralı .sql şema dosyaları (001 ... 035)
│   └── yardimci/      saf yardımcılar: Excel, SMTP, resim, CSS temizleme, quiz ayrıştırıcı...
│
├── public/            ÖN YÜZ (tarayıcıya giden her şey)
│   ├── index.html     giriş ekranı + uygulama iskeleti (tek sayfalık uygulamanın kabuğu)
│   ├── js/parcalar/   arayüz mantığı, 57 parça → birleşip /js/app.js olur
│   ├── js/yonetim/    sistem yöneticisinin ekranları, 5 parça → yalnız /admin/yonetim.js paketine girer
│   ├── js/*.js        tema.js (tema, sayfadan önce), belge.js (düz belge sayfaları), indir.js (indirme sayfası)
│   ├── css/parcalar/  stiller, 38 parça → birleşip /css/style.css olur
│   ├── sw.js          servis çalışanı (PWA; /api hiçbir zaman önbelleğe alınmaz)
│   ├── kvkk/, kosullar/, indir/   aydınlatma metni, kullanım koşulları, indirme sayfası
│   ├── 404.html, okul-bulunamadi.html, manifest.json, simge*.png, simge.svg
│   └── yazitipi/      IBM Plex Sans ve Newsreader (woff2; dışarıdan yazı tipi çekilmez)
│
├── araclar/           elle çalıştırılan araçlar (kurulum, e-posta, ekran gezintisi, simge, yük testi...)
├── testler/           test paketleri, denetimler, tumtest.sh; örnek .xls/.xlsx dosyaları
├── belge/             KILAVUZ.md, SUNUCUYA-KURULUM.md, NASIL-YAPILDI.html, config/admins örnekleri
├── ekran-goruntuleri/ ekranlarla kılavuz (index.html) ve fotoğraflar; araclar/gezinti.js üretir
└── tasarim/           tema seçme denemeleri (uygulamaya girmez)
```

Depoda **olmayanlar** (`.gitignore` ve `testler/test-gizli-dosyalar.js` bunu korur):

- `data/` — sunucunun asıl veri klasörü: `ayarlar.json` (veritabanı bağlantısı, SMTP), `admins.json`, `config.yml`,
  telefon bildirimi anahtarı, yedekler, yüklenen dosyalar, okul fotoğrafları, MEB okul listesi (`okullar.json`). Yeri
  `EE_DATA` ile değişir (`sunucu/yollar.js`).
- `testler/testdata/` (testlerin geçici veri klasörü), günlükler (`*.log`), `*.bat` kısayolları,
  `araclar/okullari-cek.js` (okul listesini MEB'den çeken araç), `yapi/`, `.claude/` (yerel geliştirme notları),
  `public/_*` (geliştirme denemeleri).

## 4. Bir isteğin yolculuğu

Soyut anlatmak yerine gerçek bir örneği baştan sona izleyelim: **müdür takvime "Veli toplantısı" ekliyor.**

```
TARAYICI                                   SUNUCU                                          VERİTABANI
public/js/parcalar/17-takvim.js
  "Ekle" düğmesi (data-act=...)
      │
25-tiklama.js  islem('takvim-etkinlik-kaydet')
      │
01-yardimcilar.js  api('/takvim/etkinlik','POST',{...})
      │  fetch + Authorization: Bearer <oturum>
      ▼
                           sunucu/index.js  (http.createServer geri çağrısı)
                             gövde süresi · genelIstekSiniri (429) · yoğunluk (503)
                                 │
                           sunucu/api.js  handleApi
                             currentUser (guvenlik.js) · readBody (http.js)
                             kapılar: kvkk · şifre · rolsüz · özellik · arşiv
                             BOLUM['takvim']
                                 │
                           sunucu/bolumler/takvim.js  uclar(k)
                             need() · okulGerek · yetkiVarMi('takvim.yonet')
                             doğrulama (gunBicimi, clean) · yilDamgasi
                                 │
                           sunucu/veri/depo/genel.js  takvimEkle(kayit)
                                 │   sorgu('INSERT ... VALUES ($1..$10)', [...])
                           sunucu/veri/baglanti.js  (pg havuzu) ───────────────────▶  takvim_etkinlikleri
                                 │
                           http.js  ok(res, {...}) → sendJSON
                             güvenlik başlıkları · no-store · br/gzip
      ◀──────────────────────────┘
api() söz → modalKapat() → git('takvim') → sayfaMesaji
```

### 4.1 Tarayıcıda

- `public/index.html` betik ve stil olarak üç dosya yükler: `<head>`'de `/js/tema.js` (koyu tema seçmiş kişi bir an beyaz ekran görmesin
  diye sayfa çizilmeden önce çalışır), `/css/style.css` ve en sonda `/js/app.js`. Bu iki dosya diskte yok; sunucu
  onları parçalardan birleştirir (4.7).
- `app.js`'in içindeki bütün parçalar tek bir IIFE'de yaşar ve birbirinin ortak adlarını görür: `S` (uygulama durumu,
  `00-durum.js`), `api()` ve `EYLEMLER` (`01-yardimcilar.js`), `SAYFALAR` (`08-ana-sayfa.js`'te tanımlanır, her ekran
  parçası kendi sayfasını ekler), `git()` ve `yaz()` (`07-yonlendirme.js`).
- Müdür takvimde "Ekle"ye basınca `17-takvim.js`'teki `takvimEtkinlikModal()` bir pencere açar; içindeki düğme
  `data-act="takvim-etkinlik-kaydet"` taşır. Sayfadaki bütün tıklamaları tek bir dinleyici yakalar
  (`25-tiklama.js` → `tiklamaKur`); `data-nav` sayfa açar, `data-act` ise `islem(eylemAdi, el)`'i çağırır. `islem`
  önce parçaların kendi `EYLEMLER` tablosuna, sonra kendi uzun listesine bakar. Bu örnekte kendi listesinde:
  `api('/takvim/etkinlik', 'POST', { baslik, tur, tarih, bitis, aciklama })`.
- `api()` (`01-yardimcilar.js`) `fetch('/api' + yol)` yapar; oturum anahtarı `Authorization: Bearer <anahtar>`
  başlığında gider (anahtar `S.token`'da; "Beni hatırla"ya göre `localStorage` ya da `sessionStorage`'da da durur,
  `05-giris.js`). Cevap JSON'dur. 401 gelirse çıkış yapılır; 403 ve `sifreDegismeli` gelirse "şifreni belirle"
  penceresi açılır; hata iletisi `error` alanındadır ve `hata.durum`, `hata.veri` ile çağırana verilir.
- Arayüzde düğmeyi gizlemek yalnız kolaylıktır: sunucu her şeyi ayrıca denetler (`yonetebilir` alanı gibi ipuçlarını
  da sunucu verir).

### 4.2 Sunucunun kapısı: `sunucu/index.js`

Her HTTP isteği önce `http.createServer`'ın geri çağrısına düşer:

1. Gövdesi 30 saniyede gelmeyen istek kesilir (`POST /api/odev-dosya/yukle` hariç; büyük teslim dosyası kendi
   sınırlarıyla yüklenir).
2. `guvenlik.genelIstekSiniri(ip, dosyaMi, oturumAnahtari)` — oturum başına dakikada 300 API, IP başına 6000 API ve
   15000 dosya isteği. Aşılırsa `429` ve `sinir: oturum|ip|dosya`.
3. `/api/` ile başlıyorsa: olay döngüsü boğuluyorsa ya da aynı anda 1000 API isteği sürüyorsa `503`; değilse
   `handleApi(req, res, segs, method)` (`api.js`). Oradan hata fırlarsa burada yakalanır: veritabanı hatası
   `veri.hataCevir` ile 400/409/503'e, beklenen istemci hataları kendi koduna (413, 408), geri kalan her şey
   `500 {"error":"Sunucu hatası"}` olur. Ayrıntı yalnız günlüğe yazılır (`API hatası:`), istemciye gitmez.
4. `/api/` değilse: GET/HEAD dışındaki her şey `405`; gerisi `http.serveStatic`'e gider (4.7).

Açılışta bu dosya ayarları ve okul listesini yükler, veritabanını açar (şema dosyalarını uygular) ve ancak ondan sonra
portu dinler. Bütün zamanlayıcılar da burada kurulur (hatırlatmalar, quiz süreleri, servis seferleri, dosya süpürme ve
disk mutabakatı, günlük yedek, `admins.json` yoklaması). Tablosu [sunucu/index.md](sunucu/index.md)'de.

### 4.3 Yönlendirici: `sunucu/api.js`

`handleApi` işin kendisini yapmaz; bütün uçlarda aynı olması gereken kuralları tek yerde uygular:

1. **Kim bu?** `guvenlik.currentUser(req)` başlıktaki anahtarı alır, `depo.oturumlar.kullaniciKimligi` ile (anahtarın
   SHA-256 özetinden) kullanıcı kimliğini, `depo.kullanicilar.bul` ile kullanıcıyı bulur. Bulamazsa `me` boştur.
2. **Dosya yüklemeleri** (`/api/odev-dosya/yukle`, `/api/ek/yukle`, `/api/okul-sayfa/foto`) gövde okunmadan önce
   ayrılır: JSON değil, diske akan bayttır.
3. **Gövde:** POST ise `http.readBody` (en çok 2 MB, 30 sn; bozuk JSON "Geçersiz veri gönderildi"; `__proto__` gibi
   tehlikeli anahtarlar ve NUL karakteri `ortak.govdeTemizle` ile atılır).
4. **Cihaz anahtarlı uçlar** (`/api/cihaz/...`, `/api/aile/cihaz/...`) oturum kapılarından önce kendi bölümlerine
   gider (bölüm 10).
5. **Kapılar**, sırayla: aydınlatma metni onayı güncel değilse (`403 kvkkGerek`), şifresini değiştirmesi gerekiyorsa
   (`403 sifreDegismeli`), rolsüz yetişkin izinli olmayan bir bölüme giriyorsa (`403 rolsuz`), okul o bölümü
   kapattıysa (`ozellikler.kapaliysaReddet`), öğretmen ya da müdür geçmiş bir eğitim yılına bakarken yıla bağlı kayıt
   yazıyorsa (`409 arsiv`). Takvim etkinliği ekleme "arşiv yazması" sayılır: geçmiş yıla bakan müdür etkinlik
   ekleyemez, yoksa kayıt eski yıla damgalanıp kaybolurdu.
6. **Bölüm seçimi:** adresin ikinci parçası (`p = segs[1]`, burada `'takvim'`) `BOLUM` tablosunda aranır ve bölümün
   `uclar(k)` işlevi çağrılır. `k` = `{ req, res, me, body, q, p, segs, method, need }`.
7. Hiçbir bölüm cevap yazmazsa `404 {"error":"Böyle bir adres yok"}`.

Bazı bölümler işi başka bölümlere dağıtır: `/api/school` → `okul.js` → `hesaplar.js` (nakilde o da `nakil.js`'i
çağırır) ve `kisi-aktarim.js`;
`/api/admin` → `yonetici.js` → `yonetici-okul.js`, `okul-disk.js`, `site-ayarlari.js`; ödevin quizi
(`/api/assignments/:id/quiz`) `odev.js` üzerinden `quiz.js`'e. Ayrıntı: [sunucu/api.md](sunucu/api.md).

### 4.4 Bölüm: `sunucu/bolumler/takvim.js`

Her bölüm aynı kalıpla yazılır: `async function uclar(k)` içinde yol ve yönteme bakar, tanımıyorsa hiçbir şey yazmadan
döner (404'ü `api.js` verir). Bizim örnekte:

- `need()` — giriş yoksa 401, hesap onaylı değilse 403. İstenirse rol listesi alır: `need(['principal', 'teacher'])`.
- `okulGerek(res, me)` (`yetki.js`) — kişi bir okula bağlı olmalı.
- `yetkiVarMi(me, 'takvim.yonet')` (`yetki.js`) — müdürde hep var; öğretmende ancak hazır Öğretmen rolü ya da ek rolü
  bu yetkiyi veriyorsa. Yoksa `403`.
- Girdi doğrulama: `gunBicimi(body.tarih)` (tarih biçimi), `clean(body.baslik, 100)` (`ortak.js`: metin değilse boş
  döner, NUL karakterini atar, kenar boşluklarını kırpar, uzunluğu keser), türün izinli listede olması, bitişin
  başlangıçtan önce olmaması. Hatalar `bad(res, 'Başlık yaz')` gibi 400 ve Türkçe bir iletiyle döner; arayüz iletiyi
  olduğu gibi gösterir.
- `yilDamgasi(me)` (`egitim-yili.js`) — kayıt etkin eğitim yılına damgalanır.
- `depo.genel.takvimEkle(kayit)` ve sonra `ok(res, { etkinlik: kayit, message: '... takvime eklendi.' })`.

Önemli işlerde bölümler ayrıca `islemYaz(...)` (`islem-kaydi.js`) ile işlem kaydı ("kim ne zaman ne yaptı") ve
`veri.bildir(...)` ile bildirim yazar.

### 4.5 Depo ve PostgreSQL: `sunucu/veri/`

- Uygulamanın geri kalanı veriye yalnız `const { depo, bildir } = require('../veri')` ile ulaşır
  (`sunucu/veri/index.js`). `depo` bir nesnedir: `depo.kullanicilar`, `depo.odevler`, `depo.genel`... her biri
  `sunucu/veri/depo/` altında bir dosya.
- `depo/genel.js`'teki `takvimEkle` tek satırlık bir iştir:
  `sorgu('INSERT INTO takvim_etkinlikleri (id, okul_id, ...) VALUES ($1, $2, ...)', [k.id, k.schoolId, ...])`.
  Değerler **her zaman** `$1, $2...` parametresiyle gider; kullanıcıdan gelen hiçbir şey SQL metnine yapıştırılmaz.
- `sorgu`, `tek`, `calistir`, `islem` `sunucu/veri/baglanti.js`'tedir. Tek bir `pg.Pool` bütün isteklerce paylaşılır;
  her bağlantıda saat dilimi UTC ve 15 saniyelik sorgu süresi vardır. `islem(fn)` bir işlem (transaction) açar ve
  içindeki bütün sorgular aynı bağlantıdan gider (`AsyncLocalStorage`); iç içe çağrılırsa dıştakine katılır. Toplu
  işler (300 hesap açma, yoklama, mesaj alıcıları) böyle yazılır: yarıda hata olursa hiçbiri yazılmaz.
- Veritabanında sütun adları Türkçe (`ad_soyad`, `okul_id`), API'de ise tarihsel adlar (`fullName`, `schoolId`).
  İkisini `sunucu/veri/esleme.js` birbirine çevirir.

### 4.6 Cevap

`ok()` ve `bad()` (`http.js`) `sendJSON`'u çağırır: her cevaba aynı güvenlik başlıkları (CSP, `X-Frame-Options: DENY`,
`nosniff`, `Referrer-Policy: no-referrer`...), `Cache-Control: no-store` ve 1 KB'tan büyükse brotli ya da gzip. Tarayıcıda
`api()`'nin sözü çözülür: `25-tiklama.js` pencereyi kapatır (`modalKapat`), `git('takvim')` ile sayfayı yeniden çizer ve
sunucunun `message`'ını `sayfaMesaji('iyi', ...)` ile gösterir. Hata olursa ileti pencerenin içinde görünür, düğme
yeniden açılır.

### 4.7 Ön yüz dosyaları nasıl gelir: `http.serveStatic`

`/api/` olmayan her GET/HEAD isteği `sunucu/http.js`'e gider:

- **Birleşik paketler.** `/js/app.js` ← `public/js/parcalar/*.js` (ad sırasıyla, tek IIFE, `'use strict'`),
  `/css/style.css` ← `public/css/parcalar/*.css`. Birleştirici (`birlesikOku`) yalnız `.js` ya da `.css` ile biten
  dosyaları okur. Sonuç `sunucu/yardimci/kucult.js` ile yorumlarından arındırılır (derlenemezse yorumlu hâli gider,
  uygulama bozulmaz), bir kez sıkıştırılıp bellekte tutulur; parça değişince en geç 1 sn'de yeniden okunur. Geliştirirken
  `EE_ACIK_KAYNAK=1` ile yorumlar ve `/* ==== parcalar/... ==== */` işaretleri kalır.
- **Önbellek.** HTML'deki `/js/app.js`, `/css/style.css`, `/js/tema.js` adreslerine `?v=<ETag>` eklenir; tarayıcı bu
  dosyaları bir yıl saklar, dosya değişince adres değişir.
- **Tek sayfalık uygulama yolları.** `/login`, `/kayit`, `/hakkinda`, `/school/<okul>`... dosya değildir; kabuk
  (`index.html`) döner. `/school/<okul>` için okul gerçekten yoksa "Okul bulunamadı" sayfası. Eski kısa adresler
  (`/kvkk`, `/indir`, `/sss`) 301 ile asıl adrese gider.
- **Aynı 404, bayt bayt.** Bilinmeyen adres, `.` ya da `_` ile başlayan dosyalar, ön yüz parçalarının kendisi
  (`/js/parcalar/...`), `/js/yonetim/...`, **`.md` belgeleri** (bu dosya dahil) ve çerezsiz `/admin` hep aynı
  `bulunamadi` cevabını alır: durum, başlıklar, ETag ve gövde aynıdır. Dışarıdan bakan hangisinin gerçekten var
  olduğunu anlayamaz. `.md` kapısı (`BELGE_DOSYASI`) belgeler kod dosyalarının yanına konduğu için eklendi:
  `public/js/` altındaki belgeler de web'den okunamaz.

### 4.8 Gizli yönetim paketi ve çerezi

Sistem yöneticisinin ekranları (`public/js/yonetim/`) herkese giden `app.js`'e **girmez**. Akış şöyle:

1. Yönetici normal giriş sayfasından girer. `bolumler/kayit.js` giriş, kod doğrulama, `/api/me` ve şifre değiştirme
   cevaplarında yöneticiye (`yonetim-cerezi.yoneticiMi`: onaylı, `admin` rolünde, şifresini değiştirmesi gerekmeyen)
   `yonetim-cerezi.cerezVer` ile bir çerez yazar ve cevaba `yonetimAdresi: '/admin'` ekler. Çerez:
   `ee_yonetim=<64 hex>; Path=/admin; HttpOnly; SameSite=Strict` (site https ise `Secure`); veritabanında yalnız
   özeti durur (`yonetim_cerezleri`, şema 030) ve oturuma bağlıdır.
2. Ön yüzde `05b-sifre-zorunlu.js` → `yonetimeGec(d)` `yonetimAdresi`'ni görünce tam sayfa geçişiyle `/admin`'e gider
   (tarayıcı çerezi ancak o adrese giderken gönderir).
3. `http.js` → `yonetimSun`: çerez yoksa ya da biçimsizse veritabanına gitmeden, geçersizse aradıktan sonra aynı 404.
   Geçerliyse `index.html`'in, `/js/app.js` yerine `/admin/yonetim.js?v=...` yükleyen hâlini (`yonetimKabugu`) verir.
4. `/admin/yonetim.js` = `public/js/parcalar/` + `public/js/yonetim/` parçaları dosya adına göre tek sırada, tek
   IIFE'de. Yönetim parçaları uygulamanın her şeyini görür; ortak parçalar yönetime yalnız `00-durum.js`'teki boş
   `YONETIM` kancasıyla bakar, kancayı `09a-yonetim-paneli.js` doldurur.
5. API yine yalnız `Authorization` başlığıyla çalışır: çerez hiçbir `/api` isteğine yetki vermez (CSRF yüzeyi yok).
   `/api/admin/...` uçları yönetici olmayana bilinmeyen API adresiyle aynı 404'ü verir (`api.js` → `yoneticiUcuMu`).

Süre farkı bile kapatıldı: bilinmeyen adres de biçimli bir çerez görürse aynı veritabanı aramasını yapar
(`bulunamadiCerezli`). Ayrıntı: [sunucu/http.md](sunucu/http.md), [sunucu/yonetim-cerezi.md](sunucu/yonetim-cerezi.md).

## 5. Roller ve yetkiler

### Hesap modeli

- **Yetişkin hesabı** (rolü boş; çocuğu varsa `parent`): veli, öğretmen, müdür adayı kendisi açar. E-posta, şifre,
  e-posta onayı, iki adımlı giriş bu hesaptadır. Her yetişkin hesabının 16 karakterlik bir **kişi kodu** vardır (`eslesme_kodu`; üretimi ve biçimi
  `sunucu/ortak.js` → `kisiKoduUret`, `kisiKoduSade`, `kisiKoduBicim`).
- **Rol satırı:** yetişkinin bir okuldaki öğretmenliği ya da müdürlüğü; `kullanicilar` tablosunda `ana_hesap_id` ile
  yetişkin hesabına bağlı, e-postasız ayrı bir satırdır (şema 012). Bir kişi bir okulda tek rol, en çok 10 okulda rol
  alır. Ödev, ders, yetki kayıtları rol satırına bağlı kalır.
- **Okulun açtığı hesap:** öğrenci ve servisçi kaydolmaz, okul açar (`bolumler/hesaplar.js`, toplu olarak
  `kisi-aktarim.js`). İlk girişte kişi kendi şifresini belirlemeden hiçbir şey yapamaz (`sifreDegismeli` kapısı).
  Öğrenci hesabı okula değil kişiye aittir: nakilde T.C. no ve doğum tarihi eşleşirse aynı hesap yeni okula geçer
  (`bolumler/nakil.js`, şema 021). Öğrencinin kodu **veli kodu**dur.
- **Portal / kişilik:** yetişkinin her okul rolü ve velisi olduğu her çocuk bir portaldır. Oturum her zaman tek bir
  kişiliğe açılır (öğretmen@A, müdür@B ya da yetişkin hesabının kendisi); portal değiştirmek yeni oturum demektir
  (`bolumler/kisilik.js` → `/api/kisilik/gec`). Veli portalına geçince yalnız seçili çocuk değişir.

Bağlanma yolları: öğretmen kişi kodunu müdüre verir, müdür "Kodla ekle" der (`hesaplar.js`); müdür adayı kodunu
sistem yöneticisine verir, yönetici "Okul aç" der (`yonetici-okul.js`); veli çocuğun veli koduyla kendisi ekler
(`kisilik.js`, `veli.js`) ya da okul veliyi T.C. no'su veya kullanıcı adıyla bağlar (`hesaplar.js`). Yetişkinin kodu
tek kullanımlıktır: kullanılınca yenilenir.

### Yetkiler

Okul içindeki yetki sistemi tek dosyada: [sunucu/yetki.md](sunucu/yetki.md).

- `YETKILER` — gruplu yetki kataloğu (`odev.ver`, `sinav.not-gir`, `devamsizlik.al`, `takvim.yonet`, `rol.yonet`,
  `okul.sayfa`...). Bazı yetkiler ders ya da sınıfa **daraltılabilir** (kapsam): "yalnız 9-A'da yoklama alır".
- **Müdür** ve **sistem yöneticisi** bütün yetkilere sahiptir; bu değiştirilemez (okulda her şeyi yapabilen biri
  kalmalı).
- Her okulun silinmeyen, hazır bir **Öğretmen rolü** vardır; okuldaki her öğretmen onun yetkilerine sahiptir
  (`OGRETMEN_VARSAYILAN`: derse atanabilir, ödev verir ve sonuçlandırır, sınav oluşturur ve not girer, yoklama alır,
  öğrenci sonuçlarını görür). Müdür bunları açıp kapatır.
- Müdür **ek roller** tanımlar ("Müdür Yardımcısı", "Kodlayıcı"...; `ROL_SABLONLARI` hazır başlangıçlar) ve bir
  öğretmene verir; yetkiler iki rolün birleşimidir. Kimse kendine rol veremez.
- Bölümler hep aynı soruyu sorar: `yetkiVarMi(me, 'x.y')`, kapsamlı yetkilerde sınıf/ders denetimiyle birlikte.
  Kapsam dışı işlem `403` alır; arayüzde gizlemek yetmez, karar sunucuda.
- Dışarı giden kullanıcı nesnesi her zaman `pub(u)`'dan geçer: şifre özeti ve iç alanlar cevaba girmez.

Öğrenci/veli tarafında kim neyi görür sorusu (kimin öğretmeni, hangi sınıf, hangi çocuk) `sunucu/iliskiler.js` ve
`depo.kullanicilar.bagliMi` gibi yardımcılarla cevaplanır. **Okulun özellikleri** (`bolumler/ozellikler.js`, şema 022):
müdür kullanmadığı bölümü (ödev, sınav, devamsızlık, etüt, servis, yemek, kulüp, anket) kapatır; `api.js` o bölümün
uçlarını reddeder, menüden de kalkar, kayıtlar silinmez.

## 6. Veritabanı ve şema dosyaları

- PostgreSQL 17. Uygulama `postgres` süper kullanıcısıyla değil, yalnız kendi veritabanına yetkili `egitimevi`
  kullanıcısıyla bağlanır (`araclar/veritabani-kur.js` kurar). Bağlantı bilgisi `data/ayarlar.json`'da ya da
  `DATABASE_URL` ortam değişkeninde (`sunucu/veri/baglanti.js`).
- İki veritabanı: `egitimevi` (asıl) ve `egitimevi_test` (testler). **Sıfırlama yalnız adı `_test` ile biten
  veritabanında çalışır** (`sema.js` → `testIcinSifirla`; `EE_DB_SIFIRLA=1`). Gerçek veri bu yüzden testlerden korunur.
- Şema **okunur SQL dosyalarıyla** sürümlenir: `sunucu/veri/sema/NNN-ad.sql`. Açılışta `sema.js` uygulanmamış
  dosyaları numara sırasıyla, her birini kendi işleminde çalıştırır ve `sema_surumleri` tablosuna yazar. **Eski dosya
  asla değiştirilmez**; yeni bir sütun, kısıt ya da tablo için sıradaki numarayla yeni dosya yazılır. Böylece canlı
  sunucudaki veri kaybolmadan yapı güncellenir.
- Yabancı anahtarlar silme kuralını taşır (sınıf silinince dersleri gider, öğrenciler sınıfsız kalır), CHECK kısıtları
  geçersiz veriyi veritabanı katında da durdurur (telefon biçimi, puan aralığı, kişi kodu biçimi...).
- Oturum anahtarı, telefonun cihaz anahtarı, yönetim çerezi ve e-posta onay bağlantısı veritabanında yalnız SHA-256
  özetleriyle durur: veritabanı sızsa bile kullanılamazlar. Şifreler `scrypt` ile özetlenir (`sunucu/sifre.js`).
- Yedek: `sunucu/veri/yedek.js` bütün veriyi okunur JSON olarak `data/yedek/` altına yazar (günlük otomatik, 14 tane
  saklanır; yönetim panelinden elle alma ve geri yükleme). JSON ↔ veritabanı çevirisi `sunucu/veri/json-aktarim.js`'te.
  Sunucuda ayrıca `pg_dump` önerilir (kurulum belgesi).

Şema dosyaları (her birinin ayrıntısı [sunucu/veri/sema/SEMA.md](sunucu/veri/sema/SEMA.md)'de):

| Dosya | Ne ekler |
|---|---|
| `001-ilk.sql` | İlk şema: okullar, eğitim yılları, sınıflar, roller, kullanıcılar, dersler, program, ödevler, sınavlar, mesajlar, bildirimler, oturumlar... |
| `002-hiz.sql` | Hız indeksleri |
| `003-kullanici-adi.sql` | Kullanıcı adı, rolsüz kayıt, T.C. kimlik no, veli kodu |
| `004-okul-davetleri.sql` | Okul davetleri (tabloyu 009 kaldırdı) |
| `005-son-giris.sql` | Son giriş zamanı |
| `006-anketler.sql` | Anketler |
| `007-okul-hayati.sql` | Yemek listesi, servisler, kulüpler |
| `008-odev-dosyalari.sql` | Ödev teslim dosyaları |
| `009-okul-adresi-hesaplar.sql` | Okul adresi, okul içi hesaplar, servisçi rolü |
| `010-servis-konum.sql` | Servisçi, okul/ev konumu, sefer |
| `011-push.sql` | Telefon bildirimi (Web Push) abonelikleri |
| `012-yetiskin-hesap.sql` | Yetişkin hesabı ve okul rolleri (rol satırı) |
| `013-ogretmen-rolu-etut.sql` | Hazır Öğretmen rolü, etütler, mesaj düzeltme |
| `014-okul-acti.sql` | "Hesabı okul açtı" bilgisi |
| `015-telefon-ulke-kodu.sql` | Telefon numaraları ülke koduyla |
| `016-eposta-onayi.sql` | E-posta onayı |
| `017-odev-yildizi.sql` | Öğrencinin ödevi yıldızlaması |
| `018-okul-sayfasi.sql` | Okul sayfası |
| `019-yorumlar.sql` | Açılış sayfasındaki yorumlar |
| `020-ekler.sql` | Mesaj ve ödev ekleri |
| `021-ogrenci-gecmisi.sql` | Öğrenci hesabı kişiye ait (nakil), geçmiş okullar |
| `022-okul-ozellikleri.sql` | Okulun kapattığı özellikler |
| `023-ogretmen-yetkileri.sql` | Öğretmen rolüne "Sınav oluşturur" ve "Öğrenci sonuçlarını görür" |
| `024-hatirlaticilar.sql` | Kişisel hatırlatıcılar |
| `025-odev-baslama-saati.sql` | Ödevin başlama saati |
| `026-aile.sql` | Eğitim Evi Aile (çocuğun telefonu) |
| `027-kisi-kodu.sql` | Kişi kodu; müdür başvurusunun kalkması |
| `028-servis-yoklama.sql` | Servis yoklaması, servis saatleri, sıra, notlar, cihaz anahtarı, uygulama oturumu |
| `029-quiz.sql` | Ödevin quizi |
| `030-yonetim-paneli.sql` | Gizli yönetim paneli çerezleri ve site ayarları |
| `031-cakismalar.sql` | Aynı T.C., e-posta ve kullanıcı adı kuralları |
| `032-kisi-kodu-16.sql` | Kişi kodu 16 karakter, 4'erli gruplar |
| `033-odev-dosya-izni.sql` | Ödeve dosya yükleme izni, okulun dosya alanı uyarısı |
| `034-odev-dosya-saklama.sql` | Teslim dosyalarının en erken silinme anı |
| `035-okul-disk-siniri.sql` | Okul başına disk sınırı |

## 7. Güvenlik düzeni

Kural basit: **güvenlik sunucuda.** Arayüzdeki gizleme, yorumsuz paket, düğme kapatma yalnız kolaylıktır. Nerede ne var:

| Konu | Nerede |
|---|---|
| Oturum: anahtar yalnız özetiyle saklanır; tarayıcıda 7 gün, telefon uygulamasında 30 gün, mutlak süre | `sunucu/veri/depo/oturumlar.js`, `guvenlik.js` → `currentUser` |
| Şifre özeti (`scrypt`, asenkron) ve şifre kuralları | `sunucu/sifre.js`, `sunucu/ortak.js` → `sifreSorunu` |
| İki adımlı giriş (e-postası olan hesapta her girişte 6 haneli kod; SMTP ayarlı değilse kod sunucu penceresine yazılır), kaba kuvvet kilidi, akıllı bot sorusu, giriş ve genel hız sınırları | `sunucu/guvenlik.js` |
| Aşırı yük (503), bağlantı sınırları, yavaş bağlantı koruması, hata gizliliği | `sunucu/index.js` |
| Güvenlik başlıkları (CSP `script-src 'self'`, çerçeveleme yok...), gövde sınırı, statik dosyada yol kaçışı engeli, aynı 404 | `sunucu/http.js` |
| Tehlikeli JSON anahtarları ve NUL karakteri | `sunucu/ortak.js` → `govdeTemizle` |
| API kapıları (kvkk, şifre, rolsüz, özellik, arşiv) ve gizli yönetici uçları | `sunucu/api.js` |
| Yetki ve kapsam | `sunucu/yetki.js` |
| SQL yalnız `sunucu/veri/` altında ve parametreli | `testler/sql-denetimi.js` denetler |
| Yüklenen fotoğrafın türü ilk baytlardan; konum (EXIF/GPS) bilgisi silinir | `sunucu/yardimci/resim.js` |
| Okul sayfasının kısıtlı CSS'i (dış adres, `@import` yok) | `sunucu/yardimci/css-temizle.js` |
| Yorumlarda küfür süzgeci | `sunucu/yardimci/kufur-suzgeci.js` + `badwordsfilter.json` |
| Ters vekil arkasında gerçek IP (`vekil.guven`; zincirin sonundaki adres) | `sunucu/ayarlar.js`, `guvenlik.js` → `istemciIp` |
| Gizli yönetim paneli ve çerezi | `sunucu/http.js`, `sunucu/yonetim-cerezi.js` |
| Depoya gizli dosya girmemesi | `.gitignore`, `testler/test-gizli-dosyalar.js` |

Sayılar (hangi sınır kaç, neden o kadar) kılavuzun "Veriler" ve "İnternete açma" bölümlerinde; kısa özet: sınırlar
okul ağına göre seçildi, çünkü büyük bir okulda 300 öğrenci aynı dakikada okulun tek IP'sinden girer. Asıl sınır
oturumda ve hesapta, IP sınırları geniş. `testler/test-okul-agi.js` bunu ölçer.

## 8. Testler ve denetimler

Hepsi `testler/` altında. Hepsini çalıştıran betik `testler/tumtest.sh` (`npm test` de onu çağırır):

1. **Sunucusuz paketler** (10): `test-xlsx`, `test-push`, `test-kucult`, `test-resim-kucult` (başsız Edge ya da
   Chrome ister, yoksa "ATLANDI"), `test-hatirlatici-zaman`, `test-servis-pencere`, `test-vekil-ip`,
   `test-uygulama-surum`, `test-quiz-metin`, `test-gizli-dosyalar`.
2. **Sunuculu paketler** (41): her paketten önce 3200 portundaki sunucu kapatılır, `testler/testdata/` boşaltılır,
   `test-ayarlari.js` gerçek ayardan veritabanı adını `egitimevi_test` yapıp yazar, sunucu
   `EE_DATA=testler/testdata EE_DB_SIFIRLA=1 EE_ADMIN_SIFRE=... EE_PUSH_GONDERME=0 EE_DIS_ISTEK=0 PORT=3200` ile açılır,
   `seed.js` test okulunu ve hesaplarını kurar, sonra paket koşar. Böylece her paket boş bir veritabanıyla başlar;
   hız sınırı ve kilit sayaçları da sıfırlanır.
3. **Denetimler** (5): `yetki-denetimi` (her uç × her rol: yetkisiz geçen var mı), `girdi-denetimi` (bozuk ve kötü
   niyetli veriyle 500 ya da sızıntı var mı) sunucuyla; `buton-denetimi` (ölü düğme, tanımsız sayfa, tanımsız API
   yolu), `yazim-denetimi` (Türkçe yazım), `sql-denetimi` (SQL'e kullanıcı değeri karışabilir mi) sunucusuz.
   Denetim sırasında sunucu günlüğüne `API hatası` düşerse o da sorun sayılır.

Sonunda `TOPLAM GECTI / KALDI` ve `DENETIM SORUNU` yazar; ikisinin de 0 olması beklenir. Tam koşu yaklaşık 20 dakika
sürer. Dikkat: `tumtest.sh` sunucuyu `netstat -ano` ve `taskkill` ile durdurur, yani Windows'ta Git Bash için yazılmış.

Test hesaplarının adları ve şifreleri `testler/seed.js`'te (yalnız test veritabanında vardır). Testlerin ortak giriş
yardımcısı `araclar/giris.js`: iki adımlı giriş zorunlu olduğu için kodu sunucu günlüğünden (`EE_LOG`) okur.
`debug-hazirlik.js` ve `hazirlik-aktarim.js` `tumtest` listesinde değil; elle deneme ve ekran görüntüsü için ortam
kurarlar.

Her kod dosyasının `.md`'sindeki **Testleri** bölümü o dosyayı hangi paketlerin koruduğunu yazar. Belgeler için ileride
`testler/test-belgeler.js` gelecek (her kod dosyasının yanında `.md` ve sekiz bölüm var mı, bu dosyadaki harita tam mı).

## 9. Araçlar

`araclar/` altındaki betikler elle çalıştırılır, sunucunun parçası değildir:

| Araç | Ne işe yarar |
|---|---|
| `veritabani-kur.js` | İlk kurulum: kısıtlı `egitimevi` kullanıcısı, `egitimevi` ve `egitimevi_test` veritabanları, `data/ayarlar.json` (`npm run veritabani-kur`) |
| `eposta-ayarla.js` | SMTP kurulum sihirbazı, sonucu `data/ayarlar.json`'a yazar (`npm run eposta-ayarla`) |
| `giris.js` | Araçların ve testlerin ortak giriş yardımcısı (kodu sunucu günlüğünden okur) |
| `deneme-okulu.js` | Elle denemek için aynı okula bağlı müdür, öğretmen, öğrenci, veli hesapları |
| `zengin-veri.js` | Ekran görüntüleri için dolu bir okul (sınıflar, program, ödevler, sınavlar) |
| `gorsel-veri.js` | Ekran görüntüleri için ek veri (çok rollü hesaplar, okul sayfası, etüt, servis, quiz) |
| `gezinti.js` | Her rolün ekranlarını başsız tarayıcıda gezer, fotoğraflar, hata toplar; `ekran-goruntuleri/`'ni üretir |
| `gezinti-metin.js` | Ekranlarla kılavuzda her fotoğrafın altındaki metinler |
| `yuk-testi.js` | Kalabalık bir okulun bir yıllık verisini test veritabanına doldurup ekranları ölçer |
| `simge-uret.js` | Uygulama simgesini (kırmızı zeminde ev) SVG ve PNG olarak üretir |
| `tema-ornekleri.js` | `tasarim/tema-secimi.html`'i farklı ayarlarla PNG'ye çeker |
| `yazitipi-indir.js` | Yazı tiplerini bir kez indirir, `public/yazitipi/` ve `00a-yazitipi.css` üretir |

`araclar/okullari-cek.js` (MEB okul listesini çeken araç) depoda yok; yalnız kurulum yapılan bilgisayarda durur.
**Uyarı:** `gezinti.js` çıktı klasörünü temizleyerek yazar; ekran turunu ancak ne yapacağını bilerek çalıştır.

## 10. Android uygulaması (ayrı depo)

Android uygulaması ayrı depoda: `github.com/KARANKOYU/Egitim-Evi-App`. Yereldir (native): siteyi içinde açmaz, WebView
kullanmaz, ekranlarını kendi çizer ve sunucunun JSON uçlarını kullanır. İki kuşak var:

- **Eğitim Evi Aile (1.0.x, yayımda):** çocuğun telefonuna kurulur; velinin seçtiği aralıkla konumu ve uygulama
  kullanım sürelerini gönderir. Sunucu tarafı `sunucu/bolumler/aile.js` ve `sunucu/veri/depo/aile.js`, şema 026. Telefon
  `X-Aile-Cihaz` başlığındaki cihaz anahtarıyla konuşur (`/api/aile/cihaz/...`); anahtar hesaba giriş vermez.
- **Tek uygulama "Eğitim Evi" (hazırlanıyor):** bütün roller aynı uygulamaya girer. Sunucu hazır: girişte
  `uygulama: true` 30 günlük oturum açar; `POST /api/cihaz` bir cihaz anahtarı verir; `X-Cihaz` başlığıyla bildirim
  yoklama ve servisçinin sefer konumu (`sunucu/bolumler/cihaz.js`, `depo/cihazlar.js`, şema 028). Firebase yok: telefon
  bildirimleri kendisi yoklar.

İndirme sayfası (`/indir/indir.html`, `public/js/indir.js`) sürüm tablosunu `/api/uygulama`'dan alır; sunucu onu
GitHub Releases'ten okuyup süzer ve 15 dakika saklar (`sunucu/uygulama-surum.js`). Android deposunun kendi `TANITIM.md`'si
ve her `.java` dosyasının `.md`'si belgelemenin son parçasında yazılacak.

## 11. Sözlük

| Sözcük | Anlamı |
|---|---|
| **okul** | `okullar` tablosundaki satır; kısa adı (`kisa_ad`) okulun adresidir: `/school/<kısa-ad>`. MEB listesindeki okullar arasından seçilir (`sunucu/okullar.js`) |
| **portal** | Yetişkinin girebildiği her kişilik: *Öğretmen · okul*, *Müdür · okul*, *Veli · çocuk*. Sol menünün üstünde "Portallarım" |
| **kişilik** | Oturumun açıldığı kimlik (yetişkin hesabının kendisi ya da bir rol satırı); `bolumler/kisilik.js`. Portal değiştirmek yeni oturumdur |
| **yetişkin hesabı** | Kendi kendine kaydolan hesap (rolü boş, çocuğu bağlıysa `parent`); e-posta, şifre, kişi kodu burada |
| **rol satırı** | Yetişkinin bir okuldaki öğretmen/müdür rolü; `kullanicilar` tablosunda `ana_hesap_id` ile bağlı, e-postasız ayrı satır |
| **rolsüz** | Henüz portalı olmayan yetişkin hesabı; `api.js` onu `ROLSUZ_SERBEST` uçlarıyla sınırlar |
| **kişi kodu** | Yetişkinin 16 karakterlik, tek kullanımlık kodu (`eslesme_kodu`); müdüre ya da yöneticiye verilir. Ekranda `Xxxx-Xxxx-Xxxx-Xxxx` |
| **veli kodu** | Öğrencinin kodu (`veli_kodu`); veli onunla çocuğu ekler, kullanılınca değişmez |
| **okulun açtığı hesap** | Öğrenci ve servisçi; okul açar, ilk girişte şifre belirlenir |
| **rol** / **ek rol** | Kodda `role` (student, parent, teacher, principal, servisci, admin); okulda ise müdürün tanımladığı yetki kümesi ("Müdür Yardımcısı"); hazır olanı "Öğretmen" rolü |
| **yetki** / **kapsam** | `yetki.js`'teki anahtarlar (`odev.ver`...); kapsam o yetkiyi derse/sınıfa daraltır |
| **özellik** | Okulun açıp kapattığı bölüm (ödev, sınav, servis...); `bolumler/ozellikler.js` |
| **kapı** | `api.js`'in her istekte bölüme gitmeden önce uyguladığı ortak denetimler: kvkk, şifre, rolsüz, özellik, arşiv |
| **bölüm** | `sunucu/bolumler/` altındaki modül; `uclar(k)` ile kendi `/api` uçlarını sunar |
| **uç** | Bir API adresi + yöntem, ör. `POST /api/takvim/etkinlik` |
| **depo** | `sunucu/veri/depo/` altındaki sorgu modülleri; `require('../veri').depo` ile erişilir. SQL yalnız burada |
| **şema dosyası** | `sunucu/veri/sema/NNN-*.sql`; bir kez uygulanır, sonra değişmez |
| **eğitim yılı** / **arşiv** / **yıl damgası** | Kayıtlar etkin yıla damgalanır (`yilDamgasi`); geçmiş yıla salt okunur bakılır, yazma `409 arsiv` |
| **parça** | `public/js/parcalar/*.js` ya da `public/css/parcalar/*.css`; sunucu ad sırasıyla birleştirir |
| **paket** | Birleşik dosya: `/js/app.js` (herkese), `/css/style.css`, `/admin/yonetim.js` (yalnız yöneticiye) |
| **`S`**, **`SAYFALAR`**, **`EYLEMLER`**, **`YONETIM`** | Ön yüzün ortak durumu, sayfa çizicileri, düğme eylemleri ve yönetim kancası |
| **yönetim çerezi** | `ee_yonetim`; yalnız `/admin` sayfasını ve paketini açar, API'ye yetki vermez |
| **cihaz anahtarı** | Telefon uygulamasına verilen 64 hex'lik anahtar (`X-Cihaz`, `X-Aile-Cihaz`); hesaba giriş vermez |
| **servis penceresi** / **sefer** | Okulun sabah/akşam servis saat aralığı (`yardimci/servis-pencere.js`); servisçinin o aralıktaki yolculuğu |
| **aydınlatma onayı (kvkk)** | Kişinin aydınlatma metninin güncel sürümünü onaylaması; onaylamadan uygulama açılmaz |
| **işlem kaydı** | "Kim ne zaman ne yaptı" günlüğü; `islemYaz` (`bolumler/islem-kaydi.js`) |
| **tohum (seed)** | Testlerden önce test okulunu ve hesaplarını kuran `testler/seed.js` |
| **site ayarları** | Yöneticinin panelden değiştirdiği ayarlar; öncelik veritabanı > `data/config.yml` > varsayılan (`sunucu/site.js`) |

## 12. Kurallar

Bunlar projenin değişmez kurallarıdır; yeni bir şey yazarken hepsine uy:

- **Ön yüz ES5.** `public/js/` altındaki parçalarda `var`, `function`, `.then(...)`; `let`/`const`, ok işlevi, şablon
  metin, `async` yok. Çerçeve ve derleyici yok. Parçalar tek IIFE'de birleştiği için yeni parça ad sırasına göre yer
  alır (`00-` önce, `28-` sonra); aynı ad `parcalar/` ile `yonetim/`'de iki kez olamaz (`test-kucult.js`).
  `public/sw.js` bunun dışında (servis çalışanı; `const`/`let` kullanıyor).
- **Emoji yok**, arayüz ve metinler Türkçe; ikonlar `02-ikonlar.js`'teki çizgi SVG'ler. Renkler yalnız
  `public/css/parcalar/00-temel.css`'teki değişkenlerden.
- **SQL yalnız `sunucu/veri/` altında ve parametreli** (`$1, $2...`). Bölümler veritabanına depo işlevleriyle gider;
  `sunucu/veri/` istek nesnesini görmez. `testler/sql-denetimi.js` bunu her koşuda denetler.
- **Şema değişikliği = yeni numaralı dosya.** Eski `.sql` dosyasına dokunulmaz.
- **Güvenlik sunucuda.** Her yeni uç `need()`/`yetkiVarMi`/kapsam denetimiyle korunur; `yetki-denetimi` ve
  `girdi-denetimi` onu da dener. Yeni bir yönetici ucu `/api/admin/` altında olmalı (ya da `yoneticiUcuMu`'ya eklenmeli).
  Yeni bir "gizli" statik yol için başka bir 404 yazma, `bulunamadiCerezli`'yi çağır.
- **Tek bağımlılık `pg`.** Yeni npm paketi eklenmez; gereken şey Node'un kendi modülleriyle yazılır.
- **Depoya gizli bilgi ve kişisel veri girmez:** `data/`, anahtarlar, şifreler, gerçek e-posta ve okul adları. Commit'ten
  önce `git status`'ta `data/` görünmemeli; `node testler/test-gizli-dosyalar.js` geçmeli.
- **Gerçek veritabanına dokunulmaz;** testler yalnız `_test` ile biten veritabanını sıfırlar.
- **Commit:** yalnız `KARANKOYU` adına (GitHub'ın noreply adresiyle), mesaj yalnız `commit N` (sıradaki numara; site ve
  Android depoları ayrı sayar), ek satır/trailer yok; her özellik ayrı commit. Grup arkadaşı da GitHub'dan dosya
  yüklediği için push'tan önce `git pull --rebase --autostash origin main`.
- **Belgeler kodla birlikte yaşar:** bir kod dosyasını değiştiren, yanındaki `.md`'nin ilgili bölümlerini ve **Son
  durum**'unu aynı işte günceller. Yeni kod dosyası yazan, yanına `.md`'sini ve bu dosyadaki haritaya satırını ekler.
  Belgeler kodla çelişmez: her iddia koda bakılarak yazılır.

## 13. Nasıl çalıştırılır, nasıl test edilir?

İlk kurulum (Linux; ayrıntısı ve Windows farkları kılavuzda):

```
npm ci                                          # tek paket: pg
mkdir -p data && sudo chown -R postgres data
sudo -u postgres node araclar/veritabani-kur.js --yerel-soket
sudo chown -R "$USER" data && chmod 600 data/ayarlar.json
npm start                                       # = node sunucu/index.js ; http://localhost:3000
```

İlk açılışta tablolar şema dosyalarından kurulur. Veritabanında hiç yönetici yoksa (ve `data/admins.json`'dan kimse
açılmadıysa) varsayılan bir yönetici açılır; şifresi rastgele üretilip **yalnız bir kez** sunucu penceresine yazılır.
E-posta ayarlı değilse iki adımlı giriş kodları da sunucu penceresine yazılır.

Gerçek verine dokunmadan ayrı bir kopya: ayrı bir veri klasörü ve test veritabanı. Veri klasöründe `ayarlar.json`
olmazsa sunucu "Veritabanı ayarı yok" deyip açılmaz (`sunucu/veri/baglanti.js`); `test-ayarlari.js` gerçek ayarı
veritabanı adı `egitimevi_test` olacak şekilde o klasöre yazar:

```
node testler/test-ayarlari.js testler/testdata      # klasörü de açar
EE_DATA=testler/testdata PORT=3200 node server.js
```

Ortam değişkenleri:

| Değişken | Ne yapar | Okuyan |
|---|---|---|
| `PORT`, `HOST` | Dinlenen port ve adres | `sunucu/yollar.js` |
| `EE_DATA` | Veri klasörü (varsayılan `data/`) | `sunucu/yollar.js` |
| `DATABASE_URL` | Bağlantı dizesi (verilirse `ayarlar.json` yerine) | `sunucu/veri/baglanti.js` |
| `EE_DB_SIFIRLA=1` | Açılışta şemayı silip baştan kur — yalnız `_test` veritabanında | `sunucu/veri/index.js` |
| `EE_ADMIN_SIFRE` | Varsayılan yöneticinin bilinen şifresi (yalnız testler) | `sunucu/veri/index.js` |
| `EE_PUSH_GONDERME=0` | Telefon bildirimi gönderme | `sunucu/push.js` |
| `EE_DIS_ISTEK=0` | Dışarıya (GitHub) istek atma | `sunucu/uygulama-surum.js` |
| `EE_OKUL_DOSYA_GB` | Varsayılan okul disk sınırı | `sunucu/site.js` |
| `EE_ACIK_KAYNAK=1` | Paketlerde yorumlar ve parça işaretleri kalsın | `sunucu/yardimci/kucult.js` |

Test:

```
bash testler/tumtest.sh                          # hepsi, ~20 dk; KALDI 0 ve DENETIM SORUNU 0 olmalı
node testler/test-gizli-dosyalar.js              # sunucusuz tek paket
node testler/buton-denetimi.js                   # sunucusuz denetim
```

Tek bir sunuculu paketi elle koşmak için `tumtest.sh`'in `sunucu_baslat` ve döngüsünün yaptığını sırayla yap:

1. `testler/testdata/` klasörünü sil, `node testler/test-ayarlari.js testler/testdata` ile yeniden aç.
2. Sunucuyu `tumtest.sh`'teki ortam değişkenleriyle (`EE_DATA=testler/testdata EE_DB_SIFIRLA=1 EE_ADMIN_SIFRE=...
   EE_PUSH_GONDERME=0 EE_DIS_ISTEK=0 PORT=3200`) `node server.js > testler/test-sunucu.log` diye aç.
3. `EE_BASE=http://localhost:3200 EE_LOG=testler/test-sunucu.log node testler/seed.js`
4. Aynı `EE_BASE` ve `EE_LOG` ile `node testler/test-<paket>.js`.
5. İşin bitince 3200'deki sunucuyu kapat.

## 14. Nereden devam?

- **Önce yerel devir belgesi:** bu bilgisayarda `.claude/gelistirme/DEVAM.md` varsa (git dışında, depoda yok) önce onu
  oku: son durum, sıradaki işler, iş tanımları ve yaşanmış tuzaklar orada.
- Yoksa: `git log --oneline -10` ve `git status` ile son değişikliğe bak; her kod dosyasının `.md`'sindeki **Son durum**
  bölümü o dosyada en son neyin değiştiğini ve bilinen açık işi yazar. Kılavuzun "Henüz eklenmeyenler" bölümü
  kullanıcıya görünen eksikleri listeler.
- **Belgeleme durumu:** belgeler parça parça yazılıyor. 1. parça: bu dosya, `server.md` ve `sunucu/` kökündeki 17
  dosyanın `.md`'si, statik sunucunun `.md` kapısı. 2. parça bitti: `sunucu/bolumler/`'in 33 dosyasının hepsinin
  `.md`'si. 3. parça bitti: `sunucu/veri/` kökündeki 7, `sunucu/veri/depo/`'daki 28 ve `sunucu/yardimci/`'deki 13 dosya
  ile `SEMA.md` — `sunucu/` klasörünün tamamı belgelendi. 4. parça başladı: `public/js/parcalar/` 00–04e (11 dosya). Sıradakiler: `public/js/`'in kalanı ve `CSS.md`; `araclar/`,
  `testler/`, `TESTLER.md` ve `test-belgeler.js`; en son Android deposu. Aşağıdaki haritada belgesi henüz olmayan
  dosyalar işaretli.
- Belgeleme sırasında bulunan bilinen bir hata: `sunucu/okullar.js` `okulVeri`'yi yüklenmeden (`null` iken) dışa
  veriyor; `GET /api/okullar/iller` cevabındaki `tipler` bu yüzden hep boş. Ayrıntı [sunucu/okullar.md](sunucu/okullar.md)'de.

## 15. Belge haritası

Her kod dosyası ve açıklaması, klasör klasör. Belgesi yazılmış olanlar bağlantılıdır; henüz yazılmamış olanlar
"(belgesi sonraki parçada)" diye işaretli. Belge adı hep kod dosyasının adıdır, uzantısı `.md`.

### Kök

| Dosya | Ne yapar | Belgesi |
|---|---|---|
| `server.js` | 4 satırlık kabuk: `sunucu/index.js`'i başlatır | [server.md](server.md) |

### `sunucu/` (kök)

| Dosya | Ne yapar | Belgesi |
|---|---|---|
| `sunucu/index.js` | Giriş noktası: açılış, her isteğin kapısı, aşırı yük koruması, zamanlayıcılar | [sunucu/index.md](sunucu/index.md) |
| `sunucu/api.js` | `/api` yönlendiricisi: kişiyi tanır, kapılar, isteği bölüme verir | [sunucu/api.md](sunucu/api.md) |
| `sunucu/http.js` | JSON cevap, gövde okuma, güvenlik başlıkları, statik dosyalar, parça birleştirme, `/admin` | [sunucu/http.md](sunucu/http.md) |
| `sunucu/guvenlik.js` | Oturum, iki adımlı giriş, kaba kuvvet kilidi, bot sorusu, hız sınırları, istemci IP | [sunucu/guvenlik.md](sunucu/guvenlik.md) |
| `sunucu/yetki.js` | Yetki kataloğu, hazır Öğretmen rolü, kapsam, `pub(u)` | [sunucu/yetki.md](sunucu/yetki.md) |
| `sunucu/iliskiler.js` | Kim kimin öğretmeni; sınıf, ders, program yardımcıları | [sunucu/iliskiler.md](sunucu/iliskiler.md) |
| `sunucu/ortak.js` | Sabitler ve küçük yardımcılar: temizleme, tarih, doğrulama, kişi kodu | [sunucu/ortak.md](sunucu/ortak.md) |
| `sunucu/ayarlar.js` | `data/ayarlar.json`: e-posta, site adresi, ters vekil | [sunucu/ayarlar.md](sunucu/ayarlar.md) |
| `sunucu/yollar.js` | Klasör yolları, port, dinleme adresi (`EE_DATA`, `PORT`, `HOST`) | [sunucu/yollar.md](sunucu/yollar.md) |
| `sunucu/sifre.js` | `scrypt` ile şifre özetleme ve doğrulama | [sunucu/sifre.md](sunucu/sifre.md) |
| `sunucu/site.js` | `/api/site`: açılış sayfası rakamları; site ayarları (veritabanı > `config.yml` > varsayılan) | [sunucu/site.md](sunucu/site.md) |
| `sunucu/okullar.js` | MEB okul listesi ve arama | [sunucu/okullar.md](sunucu/okullar.md) |
| `sunucu/hatirlatma.js` | Ders ve ödev hatırlatma bildirimleri | [sunucu/hatirlatma.md](sunucu/hatirlatma.md) |
| `sunucu/push.js` | Telefon bildirimi: RFC 8291 şifreleme, VAPID, gönderim kuyruğu | [sunucu/push.md](sunucu/push.md) |
| `sunucu/uygulama-surum.js` | Android sürüm listesini GitHub Releases'ten okur, süzer, saklar | [sunucu/uygulama-surum.md](sunucu/uygulama-surum.md) |
| `sunucu/yonetici-dosyasi.js` | `data/admins.json`: yönetici hesaplarını açar, dosyayı aralıkla yoklar | [sunucu/yonetici-dosyasi.md](sunucu/yonetici-dosyasi.md) |
| `sunucu/yonetim-cerezi.js` | Gizli yönetim panelinin çerezi: verir, siler, doğrular | [sunucu/yonetim-cerezi.md](sunucu/yonetim-cerezi.md) |

### `sunucu/bolumler/`

| Dosya | Ne yapar | Belgesi |
|---|---|---|
| `sunucu/bolumler/aile.js` | Eğitim Evi Aile (`/api/aile`): çocuğun telefonundan konum ve ekran süresi (cihaz anahtarıyla), velinin ayarları ve süre sınırı bildirimleri | [sunucu/bolumler/aile.md](sunucu/bolumler/aile.md) |
| `sunucu/bolumler/anket.js` | `/api/anketler`: tek soruluk anketler (okul, rol ya da sınıfa), oy, sonuç, gizli anket | [sunucu/bolumler/anket.md](sunucu/bolumler/anket.md) |
| `sunucu/bolumler/cihaz.js` | `/api/cihaz`: telefon uygulamasının cihaz anahtarı, bildirim yoklama, servisçinin sefer konumu | [sunucu/bolumler/cihaz.md](sunucu/bolumler/cihaz.md) |
| `sunucu/bolumler/devamsizlik.js` | `/api/devamsizlik`: ders yoklaması, tek ders düzeltme, öğrenci/veli dökümü, okul özeti, devamsızlık bildirimi | [sunucu/bolumler/devamsizlik.md](sunucu/bolumler/devamsizlik.md) |
| `sunucu/bolumler/egitim-yili.js` | `/api/egitim-yili`: yıl açma, aktif yıl, yıl damgası, geçmiş yıla (nakilde eski okula) salt okunur bakış; öteki bölümlerin yıl süzgeci ve arşiv kapısı | [sunucu/bolumler/egitim-yili.md](sunucu/bolumler/egitim-yili.md) |
| `sunucu/bolumler/ekler.js` | `/api/ek`: mesaj ve ödev ekleri (taslak yükleme, mesaja/ödeve bağlama, biletle indirme, 7 gün sonra silme) | [sunucu/bolumler/ekler.md](sunucu/bolumler/ekler.md) |
| `sunucu/bolumler/etut.js` | `/api/etut`: etüt açma, öğrencileri, yoklama (öğretmen yalnız etüt günü), öğrencinin etüt dökümü | [sunucu/bolumler/etut.md](sunucu/bolumler/etut.md) |
| `sunucu/bolumler/hatirlatici.js` | `/api/hatirlaticilar`: kişisel hatırlatıcılar ve dakikalık gönderimi | [sunucu/bolumler/hatirlatici.md](sunucu/bolumler/hatirlatici.md) |
| `sunucu/bolumler/hesaplar.js` | `/api/school`: öğrenci/servisçi hesabı (aç, düzenle, şifre, sil), öğretmeni kişi koduyla ekleme, veli bağlama, okul adresi ve konumu | [sunucu/bolumler/hesaplar.md](sunucu/bolumler/hesaplar.md) |
| `sunucu/bolumler/ilerleyis.js` | `/api/progress`, `/api/myschedule`: öğrencinin ödev listesi ve ilerleyişi (ders oranları, sınav ortalamaları, seri) ve programı | [sunucu/bolumler/ilerleyis.md](sunucu/bolumler/ilerleyis.md) |
| `sunucu/bolumler/islem-kaydi.js` | `/api/islem-kaydi` ve `islemYaz`: kim ne zaman ne yaptı | [sunucu/bolumler/islem-kaydi.md](sunucu/bolumler/islem-kaydi.md) |
| `sunucu/bolumler/kayit.js` | Kayıt ve e-posta onayı, giriş ve iki adımlı kod, şifremi unuttum, şifre, profil, aydınlatma onayı, bildirimler, `/api/me`, kayıt ekranının okul aramaları | [sunucu/bolumler/kayit.md](sunucu/bolumler/kayit.md) |
| `sunucu/bolumler/kisi-aktarim.js` | `/api/school/kisi-...`: öğrenci ve servisçi listelerinin toplu aktarımı (şablon, TXT'den şablon, içe ve dışa aktarım) | [sunucu/bolumler/kisi-aktarim.md](sunucu/bolumler/kisi-aktarim.md) |
| `sunucu/bolumler/kisilik.js` | Yetişkin hesabı: portallar, portala geçiş, kişi kodu, çocuk ekleme, okuldan ayrılma, hesap bilgisi, hesabı silme | [sunucu/bolumler/kisilik.md](sunucu/bolumler/kisilik.md) |
| `sunucu/bolumler/mesaj.js` | `/api/mesajlar`: mesajlar ve duyurular (velinin kopyası, izin ayarları, okundu bilgisi); anketlerin alıcı çözümü | [sunucu/bolumler/mesaj.md](sunucu/bolumler/mesaj.md) |
| `sunucu/bolumler/nakil.js` | Öğrenci nakli: T.C. ve doğum tarihi eşleşince var olan hesabı yeni okula taşıma (`hesaplar.js`'ten çağrılır) | [sunucu/bolumler/nakil.md](sunucu/bolumler/nakil.md) |
| `sunucu/bolumler/odev-dosya.js` | `/api/odev-dosya`: öğrencinin teslim dosyaları (akışla güvenli yükleme, biletle indirme, tarayıcıda gösterme, öğretmene zip, silme, saatlik temizlik); eklerle ortak yükleme yardımcıları | [sunucu/bolumler/odev-dosya.md](sunucu/bolumler/odev-dosya.md) |
| `sunucu/bolumler/odev.js` | `/api/assignments`: ödev verme, listeleme, sonuçlandırma, düzeltme, yeniden açma, silme (quiz yollarını `quiz.js`'e devreder) ve teslim anı yardımcıları | [sunucu/bolumler/odev.md](sunucu/bolumler/odev.md) |
| `sunucu/bolumler/ogretmen.js` | `/api/teacher`: öğretmenin programı, öğrencileri ve Sınıflarım (girdiği sınıflar, öğrenci sonuçları) | [sunucu/bolumler/ogretmen.md](sunucu/bolumler/ogretmen.md) |
| `sunucu/bolumler/okul-disk.js` | Okul başına disk sınırı: sayım, yüklemede "sığar mı", %80 ve "doldu" uyarıları, saatlik mutabakat, `/api/admin/okul-disk-siniri` | [sunucu/bolumler/okul-disk.md](sunucu/bolumler/okul-disk.md) |
| `sunucu/bolumler/okul-hayati.js` | `/api/yemek`, `/api/servis`, `/api/kulupler`: yemek listesi, servisler, servis saatleri ve yoklaması, canlı servis konumu ve yaklaşma bildirimi, kulüpler | [sunucu/bolumler/okul-hayati.md](sunucu/bolumler/okul-hayati.md) |
| `sunucu/bolumler/okul-sayfasi.js` | `/api/okul-sayfa`, `/api/okul-foto`: okulun giriş sayfası (tanıtım, görünüm, kısıtlı CSS, fotoğraflar) | [sunucu/bolumler/okul-sayfasi.md](sunucu/bolumler/okul-sayfasi.md) |
| `sunucu/bolumler/okul.js` | `/api/school`: sınıflar, dersler, ders programı, roller, öğrenci/öğretmen listeleri, toplu giriş bilgisi, Excel program aktarımı; hesap ve kişi aktarımı uçlarını devreder | [sunucu/bolumler/okul.md](sunucu/bolumler/okul.md) |
| `sunucu/bolumler/ozellikler.js` | `/api/ozellikler`: müdürün kapattığı bölümler ve her istekteki "bölüm bu okulda kapalı mı" kapısı | [sunucu/bolumler/ozellikler.md](sunucu/bolumler/ozellikler.md) |
| `sunucu/bolumler/push.js` | `/api/push`: tarayıcı bildirimi (Web Push) aboneliği | [sunucu/bolumler/push.md](sunucu/bolumler/push.md) |
| `sunucu/bolumler/quiz.js` | `/api/assignments/:id/quiz...`: ödevin quizi (tek deneme, sunucuda işleyen süre, puan, sonuçların açılması, dakikalık temizlik) | [sunucu/bolumler/quiz.md](sunucu/bolumler/quiz.md) |
| `sunucu/bolumler/sinav.js` | `/api/exams`, `/api/examgroups`: sınavlar, ölçümler, şablonlar, gruplar ve öğrencinin sınav grafiği | [sunucu/bolumler/sinav.md](sunucu/bolumler/sinav.md) |
| `sunucu/bolumler/site-ayarlari.js` | `/api/admin/site-ayarlari`, okul adresleri: yönetim panelinin Site Ayarları | [sunucu/bolumler/site-ayarlari.md](sunucu/bolumler/site-ayarlari.md) |
| `sunucu/bolumler/takvim.js` | `/api/takvim`: resmî ve dinî tatiller, okul etkinlikleri, ödev teslimleri, ders sayısı | [sunucu/bolumler/takvim.md](sunucu/bolumler/takvim.md) |
| `sunucu/bolumler/veli.js` | `/api/parent`: veli koduyla çocuk bağlama, çocuk listesi, bağı kaldırma | [sunucu/bolumler/veli.md](sunucu/bolumler/veli.md) |
| `sunucu/bolumler/yonetici-okul.js` | `/api/admin/okul-ac`, `/api/admin/kisi-bul`: yöneticinin okulu kişi koduyla açması | [sunucu/bolumler/yonetici-okul.md](sunucu/bolumler/yonetici-okul.md) |
| `sunucu/bolumler/yonetici.js` | `/api/admin`: yönetici uçlarının yönlendiricisi; müdürler, okullar ve disk, yedekler, yönetici dosyası | [sunucu/bolumler/yonetici.md](sunucu/bolumler/yonetici.md) |
| `sunucu/bolumler/yorum.js` | `/api/yorumlar`: açılış sayfasındaki yorumlar (yetişkin hesabı başına tek yorum, kısaltılmış ad, uygunsuz kelime süzgeci, yöneticinin gizlemesi) | [sunucu/bolumler/yorum.md](sunucu/bolumler/yorum.md) |

### `sunucu/veri/`

| Dosya | Ne yapar | Belgesi |
|---|---|---|
| `sunucu/veri/index.js` | Veri katmanının tek girişi: `depo`, `bildir`, açılış, ilk yönetici, yedek | [sunucu/veri/index.md](sunucu/veri/index.md) |
| `sunucu/veri/baglanti.js` | Bağlantı havuzu, `sorgu`/`tek`/`calistir`/`islem`, hata çevirisi | [sunucu/veri/baglanti.md](sunucu/veri/baglanti.md) |
| `sunucu/veri/sema.js` | Şema dosyalarını sırayla uygular; test veritabanını sıfırlar | [sunucu/veri/sema.md](sunucu/veri/sema.md) |
| `sunucu/veri/esleme.js` | Veritabanı satırı ↔ uygulama nesnesi (`ad_soyad` ↔ `fullName`) | [sunucu/veri/esleme.md](sunucu/veri/esleme.md) |
| `sunucu/veri/yazici.js` | Genel INSERT/UPDATE yardımcıları (ad doğrulamalı) | [sunucu/veri/yazici.md](sunucu/veri/yazici.md) |
| `sunucu/veri/json-aktarim.js` | Eski `db.json` ve yedekler ↔ veritabanı | [sunucu/veri/json-aktarim.md](sunucu/veri/json-aktarim.md) |
| `sunucu/veri/yedek.js` | Günlük JSON yedek, elle yedek, geri yükleme | [sunucu/veri/yedek.md](sunucu/veri/yedek.md) |

Şema dosyaları (`sunucu/veri/sema/*.sql`) tek belgede anlatılır: [sunucu/veri/sema/SEMA.md](sunucu/veri/sema/SEMA.md).

### `sunucu/veri/depo/`

| Dosya | Ne yapar | Belgesi |
|---|---|---|
| `sunucu/veri/depo/aile.js` | Eğitim Evi Aile: cihazlar, konumlar, kullanım, velinin ayarları | [sunucu/veri/depo/aile.md](sunucu/veri/depo/aile.md) |
| `sunucu/veri/depo/anketler.js` | Anketler, seçenekler, hedefler, oylar | [sunucu/veri/depo/anketler.md](sunucu/veri/depo/anketler.md) |
| `sunucu/veri/depo/cihazlar.js` | Telefon uygulamasının cihaz anahtarları (özetleri) | [sunucu/veri/depo/cihazlar.md](sunucu/veri/depo/cihazlar.md) |
| `sunucu/veri/depo/devamsizlik.js` | Devamsızlık kayıtları | [sunucu/veri/depo/devamsizlik.md](sunucu/veri/depo/devamsizlik.md) |
| `sunucu/veri/depo/ekler.js` | Mesaj ve ödev eklerinin bilgisi | [sunucu/veri/depo/ekler.md](sunucu/veri/depo/ekler.md) |
| `sunucu/veri/depo/etutler.js` | Etütler, öğrencileri, yoklamaları | [sunucu/veri/depo/etutler.md](sunucu/veri/depo/etutler.md) |
| `sunucu/veri/depo/genel.js` | Küçük tablolar: takvim, bildirimler, işlem kaydı, hatırlatmalar | [sunucu/veri/depo/genel.md](sunucu/veri/depo/genel.md) |
| `sunucu/veri/depo/hatirlaticilar.js` | Kişisel hatırlatıcılar | [sunucu/veri/depo/hatirlaticilar.md](sunucu/veri/depo/hatirlaticilar.md) |
| `sunucu/veri/depo/kullanicilar.js` | Kullanıcılar, veli-çocuk bağları, mesaj engelleri | [sunucu/veri/depo/kullanicilar.md](sunucu/veri/depo/kullanicilar.md) |
| `sunucu/veri/depo/mesajlar.js` | Mesajlar, alıcılar, okunmalar | [sunucu/veri/depo/mesajlar.md](sunucu/veri/depo/mesajlar.md) |
| `sunucu/veri/depo/odev-dosyalari.js` | Ödev teslim dosyalarının bilgisi | [sunucu/veri/depo/odev-dosyalari.md](sunucu/veri/depo/odev-dosyalari.md) |
| `sunucu/veri/depo/odevler.js` | Ödevler, ödevin öğrencileri ve sınıfları | [sunucu/veri/depo/odevler.md](sunucu/veri/depo/odevler.md) |
| `sunucu/veri/depo/ogrenci-gecmisi.js` | Öğrencinin geçmiş okulları | [sunucu/veri/depo/ogrenci-gecmisi.md](sunucu/veri/depo/ogrenci-gecmisi.md) |
| `sunucu/veri/depo/okul-disk.js` | Okul başına disk sınırı ve kullanım | [sunucu/veri/depo/okul-disk.md](sunucu/veri/depo/okul-disk.md) |
| `sunucu/veri/depo/okul-hayati.js` | Yemek listesi, servisler, kulüpler | [sunucu/veri/depo/okul-hayati.md](sunucu/veri/depo/okul-hayati.md) |
| `sunucu/veri/depo/okul-sayfalari.js` | Okul sayfası ve fotoğrafları | [sunucu/veri/depo/okul-sayfalari.md](sunucu/veri/depo/okul-sayfalari.md) |
| `sunucu/veri/depo/okullar.js` | Okullar ve eğitim yılları | [sunucu/veri/depo/okullar.md](sunucu/veri/depo/okullar.md) |
| `sunucu/veri/depo/onaylar.js` | Bekleyen e-posta onayları | [sunucu/veri/depo/onaylar.md](sunucu/veri/depo/onaylar.md) |
| `sunucu/veri/depo/oturumlar.js` | Oturumlar, oturum ömrü, yönetim çerezleri | [sunucu/veri/depo/oturumlar.md](sunucu/veri/depo/oturumlar.md) |
| `sunucu/veri/depo/ozellikler.js` | Okulun kapattığı özellikler (bellekte) | [sunucu/veri/depo/ozellikler.md](sunucu/veri/depo/ozellikler.md) |
| `sunucu/veri/depo/push.js` | Web Push abonelikleri | [sunucu/veri/depo/push.md](sunucu/veri/depo/push.md) |
| `sunucu/veri/depo/quiz.js` | Quizler, sorular, şıklar, denemeler, cevaplar | [sunucu/veri/depo/quiz.md](sunucu/veri/depo/quiz.md) |
| `sunucu/veri/depo/roller.js` | Roller, yetkileri ve kapsamları | [sunucu/veri/depo/roller.md](sunucu/veri/depo/roller.md) |
| `sunucu/veri/depo/servis-yoklama.js` | Servis yoklaması, seferler, notlar, "binmeyecek" işaretleri | [sunucu/veri/depo/servis-yoklama.md](sunucu/veri/depo/servis-yoklama.md) |
| `sunucu/veri/depo/sinavlar.js` | Sınav şablonları, gruplar, sınavlar, ölçümler ve değerler | [sunucu/veri/depo/sinavlar.md](sunucu/veri/depo/sinavlar.md) |
| `sunucu/veri/depo/siniflar.js` | Sınıflar, dersler, haftalık ders programı | [sunucu/veri/depo/siniflar.md](sunucu/veri/depo/siniflar.md) |
| `sunucu/veri/depo/site-ayarlari.js` | Site ayarları (bellekte) | [sunucu/veri/depo/site-ayarlari.md](sunucu/veri/depo/site-ayarlari.md) |
| `sunucu/veri/depo/yorumlar.js` | Açılış sayfası yorumları | [sunucu/veri/depo/yorumlar.md](sunucu/veri/depo/yorumlar.md) |

### `sunucu/yardimci/`

| Dosya | Ne yapar | Belgesi |
|---|---|---|
| `sunucu/yardimci/aktarim.js` | Excel sütun eşleme ve hücre doğrulama | [sunucu/yardimci/aktarim.md](sunucu/yardimci/aktarim.md) |
| `sunucu/yardimci/bulanik-arama.js` | Okul araması: harf, Türkçe karakter, yazım hatası ve kısaltmaya dayanıklı | [sunucu/yardimci/bulanik-arama.md](sunucu/yardimci/bulanik-arama.md) |
| `sunucu/yardimci/css-temizle.js` | Okul sayfasının kısıtlı CSS'i | [sunucu/yardimci/css-temizle.md](sunucu/yardimci/css-temizle.md) |
| `sunucu/yardimci/eposta.js` | Küçük SMTP istemcisi (465 TLS, 587 STARTTLS) | [sunucu/yardimci/eposta.md](sunucu/yardimci/eposta.md) |
| `sunucu/yardimci/hatirlatici-zaman.js` | Türkiye saatiyle hatırlatıcı zamanları | [sunucu/yardimci/hatirlatici-zaman.md](sunucu/yardimci/hatirlatici-zaman.md) |
| `sunucu/yardimci/kucult.js` | Tarayıcıya giden JS/CSS'ten yorumları atar | [sunucu/yardimci/kucult.md](sunucu/yardimci/kucult.md) |
| `sunucu/yardimci/kufur-suzgeci.js` | Yorumlar için küfür süzgeci | [sunucu/yardimci/kufur-suzgeci.md](sunucu/yardimci/kufur-suzgeci.md) |
| `sunucu/yardimci/quiz.js` | Quizin saf işlevleri: yapıştırma ayrıştırıcısı, doğrulama, puan, süre | [sunucu/yardimci/quiz.md](sunucu/yardimci/quiz.md) |
| `sunucu/yardimci/resim.js` | Fotoğraf türü (ilk baytlar) ve konum bilgisini silme | [sunucu/yardimci/resim.md](sunucu/yardimci/resim.md) |
| `sunucu/yardimci/servis-pencere.js` | Okulun servis saat aralıkları | [sunucu/yardimci/servis-pencere.md](sunucu/yardimci/servis-pencere.md) |
| `sunucu/yardimci/tablo-oku.js` | XLSX, XLS, ODS, CSV ve düz metin listesini okur | [sunucu/yardimci/tablo-oku.md](sunucu/yardimci/tablo-oku.md) |
| `sunucu/yardimci/xls.js` | Eski Excel (.xls) okuyucu | [sunucu/yardimci/xls.md](sunucu/yardimci/xls.md) |
| `sunucu/yardimci/xlsx.js` | Excel (.xlsx) okuma ve yazma, paketsiz | [sunucu/yardimci/xlsx.md](sunucu/yardimci/xlsx.md) |

### `public/` ve `public/js/`

| Dosya | Ne yapar | Belgesi |
|---|---|---|
| `public/sw.js` | Servis çalışanı: kurulabilir uygulama, çevrimdışı açılış, bildirim gösterme | [public/sw.md](public/sw.md) |
| `public/js/tema.js` | Açık/koyu tema, sayfa çizilmeden önce | [public/js/tema.md](public/js/tema.md) |
| `public/js/belge.js` | Düz belge sayfaları (aydınlatma metni, koşullar) için tema düğmesi ve Yapımcılar | [public/js/belge.md](public/js/belge.md) |
| `public/js/indir.js` | İndirme sayfasının Android sürüm tablosu | [public/js/indir.md](public/js/indir.md) |

CSS parçaları (`public/css/parcalar/*.css`) tek belgede anlatılacak: `public/css/parcalar/CSS.md` (belgesi sonraki parçada).

### `public/js/parcalar/`

| Dosya | Ne yapar | Belgesi |
|---|---|---|
| `public/js/parcalar/00-durum.js` | Uygulama durumu `S` ve boş `YONETIM` kancası | [public/js/parcalar/00-durum.md](public/js/parcalar/00-durum.md) |
| `public/js/parcalar/01-yardimcilar.js` | Küçük yardımcılar, `api()`, `EYLEMLER` | [public/js/parcalar/01-yardimcilar.md](public/js/parcalar/01-yardimcilar.md) |
| `public/js/parcalar/02-ikonlar.js` | Çizgi SVG ikonlar | [public/js/parcalar/02-ikonlar.md](public/js/parcalar/02-ikonlar.md) |
| `public/js/parcalar/02b-cizimler.js` | Portallar, "+ Ekle" ve açılış sayfası çizimleri | [public/js/parcalar/02b-cizimler.md](public/js/parcalar/02b-cizimler.md) |
| `public/js/parcalar/03-mesaj-modal.js` | Ekrana ileti ve açılır pencere | [public/js/parcalar/03-mesaj-modal.md](public/js/parcalar/03-mesaj-modal.md) |
| `public/js/parcalar/04-pwa.js` | Telefona uygulama olarak kurma, servis çalışanı kaydı | [public/js/parcalar/04-pwa.md](public/js/parcalar/04-pwa.md) |
| `public/js/parcalar/04a-form-alanlari.js` | Form alanlarının ortak davranışları | [public/js/parcalar/04a-form-alanlari.md](public/js/parcalar/04a-form-alanlari.md) |
| `public/js/parcalar/04b-bildirim-izni.js` | Web Push izni ve aboneliği | [public/js/parcalar/04b-bildirim-izni.md](public/js/parcalar/04b-bildirim-izni.md) |
| `public/js/parcalar/04c-telefon.js` | Ülke kodlu telefon alanı | [public/js/parcalar/04c-telefon.md](public/js/parcalar/04c-telefon.md) |
| `public/js/parcalar/04d-ekler.js` | Dosya ekleme alanı (mesaj, ödev) | [public/js/parcalar/04d-ekler.md](public/js/parcalar/04d-ekler.md) |
| `public/js/parcalar/04e-tarih-secici.js` | Türkçe tarih seçici | [public/js/parcalar/04e-tarih-secici.md](public/js/parcalar/04e-tarih-secici.md) |
| `public/js/parcalar/04f-resim-kucult.js` | Yüklemeden önce tarayıcıda resim küçültme | [public/js/parcalar/04f-resim-kucult.md](public/js/parcalar/04f-resim-kucult.md) |
| `public/js/parcalar/05-giris.js` | Giriş, kayıt, iki adımlı kod, şifremi unuttum | [public/js/parcalar/05-giris.md](public/js/parcalar/05-giris.md) |
| `public/js/parcalar/05a-dis-sayfalar.js` | Giriş yapmamış ziyaretçinin sayfaları | [public/js/parcalar/05a-dis-sayfalar.md](public/js/parcalar/05a-dis-sayfalar.md) |
| `public/js/parcalar/05b-sifre-zorunlu.js` | Aydınlatma onayı, zorunlu şifre belirleme, yönetime geçiş | [public/js/parcalar/05b-sifre-zorunlu.md](public/js/parcalar/05b-sifre-zorunlu.md) |
| `public/js/parcalar/06-menu.js` | Role göre sol menü | [public/js/parcalar/06-menu.md](public/js/parcalar/06-menu.md) |
| `public/js/parcalar/07-yonlendirme.js` | Adres çubuğuyla sayfa açma: `git()`, `yaz()` | [public/js/parcalar/07-yonlendirme.md](public/js/parcalar/07-yonlendirme.md) |
| `public/js/parcalar/08-ana-sayfa.js` | `SAYFALAR` ve her rolün ana sayfası | [public/js/parcalar/08-ana-sayfa.md](public/js/parcalar/08-ana-sayfa.md) |
| `public/js/parcalar/08b-rolsuz.js` | Okul seçimi (yöneticinin "Okul aç" penceresi için MEB listesinde arama) | [public/js/parcalar/08b-rolsuz.md](public/js/parcalar/08b-rolsuz.md) |
| `public/js/parcalar/08c-kisilikler.js` | Portallar ve "+ Ekle" | [public/js/parcalar/08c-kisilikler.md](public/js/parcalar/08c-kisilikler.md) |
| `public/js/parcalar/08d-okul-disk.js` | Okulun dosya alanı doluluk çubuğu | [public/js/parcalar/08d-okul-disk.md](public/js/parcalar/08d-okul-disk.md) |
| `public/js/parcalar/10-mudur.js` | Müdür sayfaları: öğrenciler, öğretmenler, veli bağlama | [public/js/parcalar/10-mudur.md](public/js/parcalar/10-mudur.md) |
| `public/js/parcalar/10a-giris-bilgisi.js` | Toplu giriş bilgisi dağıtımı | [public/js/parcalar/10a-giris-bilgisi.md](public/js/parcalar/10a-giris-bilgisi.md) |
| `public/js/parcalar/10b-hesaplar.js` | Okulun açtığı hesaplar (öğrenci, servisçi) | [public/js/parcalar/10b-hesaplar.md](public/js/parcalar/10b-hesaplar.md) |
| `public/js/parcalar/11-ogretmen-odev.js` | Öğretmen ve müdürün ödev sayfaları | [public/js/parcalar/11-ogretmen-odev.md](public/js/parcalar/11-ogretmen-odev.md) |
| `public/js/parcalar/11b-siniflarim.js` | Öğretmenin Sınıflarım bölümü | [public/js/parcalar/11b-siniflarim.md](public/js/parcalar/11b-siniflarim.md) |
| `public/js/parcalar/12-ogretmen-sinav.js` | Sınav ekranı: sınavlar, gruplar, şablonlar, değer girişi | [public/js/parcalar/12-ogretmen-sinav.md](public/js/parcalar/12-ogretmen-sinav.md) |
| `public/js/parcalar/13-ogrenci-veli.js` | Öğrenci ve veli ilerleyiş görünümleri | [public/js/parcalar/13-ogrenci-veli.md](public/js/parcalar/13-ogrenci-veli.md) |
| `public/js/parcalar/14-odev-filtre.js` | Ödev listesi süzgeçleri | [public/js/parcalar/14-odev-filtre.md](public/js/parcalar/14-odev-filtre.md) |
| `public/js/parcalar/14b-odev-teslim.js` | Ödev teslim dosyaları | [public/js/parcalar/14b-odev-teslim.md](public/js/parcalar/14b-odev-teslim.md) |
| `public/js/parcalar/14c-quiz.js` | Quiz düzenleyici, çözme ve sonuç ekranları | [public/js/parcalar/14c-quiz.md](public/js/parcalar/14c-quiz.md) |
| `public/js/parcalar/15-aktarim.js` | Excel aktarım ekranı | [public/js/parcalar/15-aktarim.md](public/js/parcalar/15-aktarim.md) |
| `public/js/parcalar/16-egitim-yili.js` | Eğitim yılı seçimi ve yönetimi | [public/js/parcalar/16-egitim-yili.md](public/js/parcalar/16-egitim-yili.md) |
| `public/js/parcalar/16b-okul-ayarlari.js` | Okulun adresi ve haritadaki yeri | [public/js/parcalar/16b-okul-ayarlari.md](public/js/parcalar/16b-okul-ayarlari.md) |
| `public/js/parcalar/16c-ozellikler.js` | Okulun özellikleri (bölüm aç/kapat) | [public/js/parcalar/16c-ozellikler.md](public/js/parcalar/16c-ozellikler.md) |
| `public/js/parcalar/17-takvim.js` | Takvim: ay görünümü, tatiller, etkinlikler | [public/js/parcalar/17-takvim.md](public/js/parcalar/17-takvim.md) |
| `public/js/parcalar/18-devamsizlik.js` | Devamsızlık: yoklama, öğrenci ve müdür görünümü | [public/js/parcalar/18-devamsizlik.md](public/js/parcalar/18-devamsizlik.md) |
| `public/js/parcalar/18b-etut.js` | Etütler | [public/js/parcalar/18b-etut.md](public/js/parcalar/18b-etut.md) |
| `public/js/parcalar/19-mesajlar.js` | Mesajlar ve duyurular | [public/js/parcalar/19-mesajlar.md](public/js/parcalar/19-mesajlar.md) |
| `public/js/parcalar/19b-anketler.js` | Anketler | [public/js/parcalar/19b-anketler.md](public/js/parcalar/19b-anketler.md) |
| `public/js/parcalar/19c-okul-hayati.js` | Yemek listesi, servis, kulüpler | [public/js/parcalar/19c-okul-hayati.md](public/js/parcalar/19c-okul-hayati.md) |
| `public/js/parcalar/19d-harita.js` | Kütüphanesiz küçük OpenStreetMap haritası | [public/js/parcalar/19d-harita.md](public/js/parcalar/19d-harita.md) |
| `public/js/parcalar/19e-servis-konum.js` | Servis haritası ve servisçinin konum gönderimi | [public/js/parcalar/19e-servis-konum.md](public/js/parcalar/19e-servis-konum.md) |
| `public/js/parcalar/19f-roller.js` | Roller ve yetkiler ekranı | [public/js/parcalar/19f-roller.md](public/js/parcalar/19f-roller.md) |
| `public/js/parcalar/19g-okul-sayfasi.js` | Okul sayfası ve düzenleme ekranı | [public/js/parcalar/19g-okul-sayfasi.md](public/js/parcalar/19g-okul-sayfasi.md) |
| `public/js/parcalar/19h-hatirlaticilar.js` | Kişisel hatırlatıcılar | [public/js/parcalar/19h-hatirlaticilar.md](public/js/parcalar/19h-hatirlaticilar.md) |
| `public/js/parcalar/19i-servis-yoklama.js` | Servisçinin Yoklama sayfası ve yönetimin salt okunur görünümü | [public/js/parcalar/19i-servis-yoklama.md](public/js/parcalar/19i-servis-yoklama.md) |
| `public/js/parcalar/20-siniflar.js` | Sınıf ve ders yönetimi | [public/js/parcalar/20-siniflar.md](public/js/parcalar/20-siniflar.md) |
| `public/js/parcalar/21-ders-programi.js` | Ders programı düzenleme ve çizimi | [public/js/parcalar/21-ders-programi.md](public/js/parcalar/21-ders-programi.md) |
| `public/js/parcalar/22-programim.js` | Kişinin kendi programı | [public/js/parcalar/22-programim.md](public/js/parcalar/22-programim.md) |
| `public/js/parcalar/23-veli-ayarlar.js` | Veli sayfaları ve hesap ayarları | [public/js/parcalar/23-veli-ayarlar.md](public/js/parcalar/23-veli-ayarlar.md) |
| `public/js/parcalar/24-bildirim-arama-mobil.js` | Bildirimler, sayfa içi arama, mobil menü | [public/js/parcalar/24-bildirim-arama-mobil.md](public/js/parcalar/24-bildirim-arama-mobil.md) |
| `public/js/parcalar/25-tiklama.js` | Bütün `data-act`/`data-nav` tıklamaları: `islem()` | [public/js/parcalar/25-tiklama.md](public/js/parcalar/25-tiklama.md) |
| `public/js/parcalar/26-baslat.js` | Açılış ve çıkış: oturumu doğrula, uygulamayı başlat | [public/js/parcalar/26-baslat.md](public/js/parcalar/26-baslat.md) |
| `public/js/parcalar/27-veli-panel.js` | Veli paneli: bütün çocuklar bir arada | [public/js/parcalar/27-veli-panel.md](public/js/parcalar/27-veli-panel.md) |
| `public/js/parcalar/27b-aile.js` | Veli: Çocuğumun telefonu | [public/js/parcalar/27b-aile.md](public/js/parcalar/27b-aile.md) |
| `public/js/parcalar/28-grafik.js` | Kütüphanesiz SVG grafikler | [public/js/parcalar/28-grafik.md](public/js/parcalar/28-grafik.md) |

### `public/js/yonetim/`

| Dosya | Ne yapar | Belgesi |
|---|---|---|
| `public/js/yonetim/09-yonetici.js` | Yönetici sayfaları: müdürler, okullar (okul açma), yedekler, yorumlar | [public/js/yonetim/09-yonetici.md](public/js/yonetim/09-yonetici.md) |
| `public/js/yonetim/09a-yonetim-paneli.js` | Yönetim panelinin menüsü ve ana sayfası; `YONETIM` kancasını doldurur | [public/js/yonetim/09a-yonetim-paneli.md](public/js/yonetim/09a-yonetim-paneli.md) |
| `public/js/yonetim/09b-site-ayarlari.js` | Site Ayarları ekranı | [public/js/yonetim/09b-site-ayarlari.md](public/js/yonetim/09b-site-ayarlari.md) |
| `public/js/yonetim/09c-yonetici-dosyasi.js` | Yönetici Dosyası ekranı | [public/js/yonetim/09c-yonetici-dosyasi.md](public/js/yonetim/09c-yonetici-dosyasi.md) |
| `public/js/yonetim/09d-okul-disk.js` | Okulların disk sınırı ekranı | [public/js/yonetim/09d-okul-disk.md](public/js/yonetim/09d-okul-disk.md) |

### `araclar/`

| Dosya | Ne yapar | Belgesi |
|---|---|---|
| `araclar/deneme-okulu.js` | Elle deneme için hazır okul ve hesaplar | [araclar/deneme-okulu.md](araclar/deneme-okulu.md) |
| `araclar/eposta-ayarla.js` | SMTP kurulum sihirbazı | [araclar/eposta-ayarla.md](araclar/eposta-ayarla.md) |
| `araclar/gezinti-metin.js` | Ekranlarla kılavuzun fotoğraf altı metinleri | [araclar/gezinti-metin.md](araclar/gezinti-metin.md) |
| `araclar/gezinti.js` | Ekran gezintisi ve fotoğraflar | [araclar/gezinti.md](araclar/gezinti.md) |
| `araclar/giris.js` | Araçların ve testlerin ortak giriş yardımcısı | [araclar/giris.md](araclar/giris.md) |
| `araclar/gorsel-veri.js` | Ekran görüntüleri için ek veri | [araclar/gorsel-veri.md](araclar/gorsel-veri.md) |
| `araclar/simge-uret.js` | Uygulama simgesini üretir | [araclar/simge-uret.md](araclar/simge-uret.md) |
| `araclar/tema-ornekleri.js` | Tema seçim sayfasının örnek görüntüleri | [araclar/tema-ornekleri.md](araclar/tema-ornekleri.md) |
| `araclar/veritabani-kur.js` | İlk veritabanı kurulumu | [araclar/veritabani-kur.md](araclar/veritabani-kur.md) |
| `araclar/yazitipi-indir.js` | Yazı tiplerini indirir, `@font-face` üretir | [araclar/yazitipi-indir.md](araclar/yazitipi-indir.md) |
| `araclar/yuk-testi.js` | Kalabalık okul verisiyle yük ölçümü | [araclar/yuk-testi.md](araclar/yuk-testi.md) |
| `araclar/zengin-veri.js` | Ekran görüntüleri için dolu bir okul | [araclar/zengin-veri.md](araclar/zengin-veri.md) |

### `testler/`

`testler/tumtest.sh` ve genel test düzeni ayrıca `testler/TESTLER.md`'de anlatılacak (belgesi sonraki parçada).

| Dosya | Ne yapar | Belgesi |
|---|---|---|
| `testler/tumtest.sh` | Bütün paketleri ve denetimleri sırayla koşturur | (belgesi sonraki parçada) |
| `testler/seed.js` | Test okulunu ve hesaplarını kurar | [testler/seed.md](testler/seed.md) |
| `testler/test-ayarlari.js` | Test veri klasörüne `egitimevi_test` bağlantısını yazar | [testler/test-ayarlari.md](testler/test-ayarlari.md) |
| `testler/giris.js` | `araclar/giris.js`'e kısa yol | [testler/giris.md](testler/giris.md) |
| `testler/debug-hazirlik.js` | Hata ayıklama turu için dolu ortam (tumtest dışında) | [testler/debug-hazirlik.md](testler/debug-hazirlik.md) |
| `testler/hazirlik-aktarim.js` | Aktarım ekran görüntüsü için ortam (tumtest dışında) | [testler/hazirlik-aktarim.md](testler/hazirlik-aktarim.md) |
| `testler/buton-denetimi.js` | Ölü düğme, tanımsız sayfa ve API yolu denetimi | [testler/buton-denetimi.md](testler/buton-denetimi.md) |
| `testler/girdi-denetimi.js` | Bozuk ve kötü niyetli girdiyle 500/sızıntı denetimi | [testler/girdi-denetimi.md](testler/girdi-denetimi.md) |
| `testler/sql-denetimi.js` | SQL'e kullanıcı değeri karışabilir mi | [testler/sql-denetimi.md](testler/sql-denetimi.md) |
| `testler/yazim-denetimi.js` | Türkçe yazım denetimi | [testler/yazim-denetimi.md](testler/yazim-denetimi.md) |
| `testler/yetki-denetimi.js` | Her uç × her rol yetki denetimi | [testler/yetki-denetimi.md](testler/yetki-denetimi.md) |
| `testler/guvenlik-test.js` | Güvenlik başlıkları, parça dosyalarının gizliliği ve öteki güvenlik denetimleri | [testler/guvenlik-test.md](testler/guvenlik-test.md) |
| `testler/test-admin-gizli.js` | Gizli `/admin`, aynı 404, `.md` kapısı, yönetici uçları | [testler/test-admin-gizli.md](testler/test-admin-gizli.md) |
| `testler/test-adresler.js` | Sayfa adresleri, 301'ler, `%00`, yönlendirme saldırıları | [testler/test-adresler.md](testler/test-adresler.md) |
| `testler/test-aile.js` | Eğitim Evi Aile | [testler/test-aile.md](testler/test-aile.md) |
| `testler/test-aktarim.js` | Toplu aktarım (xlsx, xls, ods, csv, metin) | [testler/test-aktarim.md](testler/test-aktarim.md) |
| `testler/test-anket.js` | Anketler ve duyuru okundu bilgisi | [testler/test-anket.md](testler/test-anket.md) |
| `testler/test-bildirim.js` | Bildirimlerin tekilliği ve veliye kopyası | [testler/test-bildirim.md](testler/test-bildirim.md) |
| `testler/test-cakisma.js` | Aynı T.C., e-posta, kullanıcı adı; eşzamanlı istekler | [testler/test-cakisma.md](testler/test-cakisma.md) |
| `testler/test-devamsizlik.js` | Devamsızlık | [testler/test-devamsizlik.md](testler/test-devamsizlik.md) |
| `testler/test-egitim-yili.js` | Eğitim yılı ve arşiv | [testler/test-egitim-yili.md](testler/test-egitim-yili.md) |
| `testler/test-etut.js` | Hazır Öğretmen rolü, etütler, düzeltmeler, açılış rakamları | [testler/test-etut.md](testler/test-etut.md) |
| `testler/test-giris-bilgisi.js` | Toplu giriş bilgisi dağıtımı | [testler/test-giris-bilgisi.md](testler/test-giris-bilgisi.md) |
| `testler/test-giris-kayit.js` | Giriş ve kayıt | [testler/test-giris-kayit.md](testler/test-giris-kayit.md) |
| `testler/test-gizli-dosyalar.js` | Gizli ve kişisel dosyaların depoya girmemesi (sunucusuz) | [testler/test-gizli-dosyalar.md](testler/test-gizli-dosyalar.md) |
| `testler/test-hatirlatici-zaman.js` | Hatırlatıcı zaman hesabı (sunucusuz) | [testler/test-hatirlatici-zaman.md](testler/test-hatirlatici-zaman.md) |
| `testler/test-hatirlatici.js` | Kişisel hatırlatıcılar | [testler/test-hatirlatici.md](testler/test-hatirlatici.md) |
| `testler/test-kapsam.js` | Yetki kapsamı (ders/sınıf daraltması) | [testler/test-kapsam.md](testler/test-kapsam.md) |
| `testler/test-kisi-kodu.js` | Kişi kodu, veli kodu, portallar | [testler/test-kisi-kodu.md](testler/test-kisi-kodu.md) |
| `testler/test-kucult.js` | Yorum atıcı ve birleşik paket (sunucusuz) | [testler/test-kucult.md](testler/test-kucult.md) |
| `testler/test-mesaj.js` | Mesajlar ve duyurular | [testler/test-mesaj.md](testler/test-mesaj.md) |
| `testler/test-nakil.js` | Öğrenci nakli | [testler/test-nakil.md](testler/test-nakil.md) |
| `testler/test-odev-dosya.js` | Ödev teslim dosyaları | [testler/test-odev-dosya.md](testler/test-odev-dosya.md) |
| `testler/test-odev-saat.js` | Ödev teslim saati ve geçmiş ödevin düzenlenmesi | [testler/test-odev-saat.md](testler/test-odev-saat.md) |
| `testler/test-okul-agi.js` | 300 kişi tek IP: yük ve saldırı koruması | [testler/test-okul-agi.md](testler/test-okul-agi.md) |
| `testler/test-okul-disk.js` | Okul başına disk sınırı | [testler/test-okul-disk.md](testler/test-okul-disk.md) |
| `testler/test-okul-hayati.js` | Yemek listesi, servis, kulüpler | (belgesi sonraki parçada) |
| `testler/test-okul-sayfasi.js` | Okul sayfası | (belgesi sonraki parçada) |
| `testler/test-ozellikler.js` | Okulun özellikleri | (belgesi sonraki parçada) |
| `testler/test-program.js` | Sınıflar ve ders programı | (belgesi sonraki parçada) |
| `testler/test-push.js` | Telefon bildirimi şifrelemesi (sunucusuz) | (belgesi sonraki parçada) |
| `testler/test-quiz-metin.js` | Quiz yapıştırma ayrıştırıcısı (sunucusuz) | (belgesi sonraki parçada) |
| `testler/test-quiz.js` | Ödevin quizi | (belgesi sonraki parçada) |
| `testler/test-resim-kucult.js` | Tarayıcıda resim küçültme, başsız tarayıcıyla (sunucusuz) | (belgesi sonraki parçada) |
| `testler/test-rol.js` | Yetki kataloğu ve roller | (belgesi sonraki parçada) |
| `testler/test-servis-konum.js` | Servisçi, canlı konum, yaklaşma bildirimi | (belgesi sonraki parçada) |
| `testler/test-servis-pencere.js` | Servis saat aralıkları (sunucusuz) | (belgesi sonraki parçada) |
| `testler/test-servis-yoklama.js` | Servis yoklaması, cihaz anahtarı, uygulama oturumu | (belgesi sonraki parçada) |
| `testler/test-sifre.js` | Şifremi unuttum akışı | (belgesi sonraki parçada) |
| `testler/test-sinav.js` | Sınavlar | (belgesi sonraki parçada) |
| `testler/test-siniflarim.js` | Sınıflarım, ödev serisi, programdan yoklama | (belgesi sonraki parçada) |
| `testler/test-site-ayarlari.js` | Site ayarları ve okul adresleri | (belgesi sonraki parçada) |
| `testler/test-takvim.js` | Takvim | (belgesi sonraki parçada) |
| `testler/test-uygulama-surum.js` | İndirme sayfasının sürüm listesi (sunucusuz) | (belgesi sonraki parçada) |
| `testler/test-vekil-ip.js` | Ters vekil arkasında istemci adresi (sunucusuz) | (belgesi sonraki parçada) |
| `testler/test-veli-coklu.js` | Veli bağları, çok çocuk, çok rol | (belgesi sonraki parçada) |
| `testler/test-xlsx.js` | Excel modülü (sunucusuz) | (belgesi sonraki parçada) |
| `testler/test-yedek.js` | Yedek alma ve geri yükleme | (belgesi sonraki parçada) |
| `testler/test-yetiskin.js` | Yetişkin hesabı ve okul rolleri | (belgesi sonraki parçada) |
| `testler/test-yonetici-dosyasi.js` | `admins.json` ve canlı okuma | (belgesi sonraki parçada) |
| `testler/test-yonetim.js` | Okulun açtığı hesaplar ve hesap modeli | (belgesi sonraki parçada) |
| `testler/test-yorum-ek.js` | Açılış sayfası yorumları ve ekler | (belgesi sonraki parçada) |

### Öteki belgeler

| Belge | Ne anlatır |
|---|---|
| [belge/KILAVUZ.md](belge/KILAVUZ.md) | Kullanıcının gözünden bütün özellikler, kurulum, sınırlar, testler |
| [belge/SUNUCUYA-KURULUM.md](belge/SUNUCUYA-KURULUM.md) | Linux VPS'e kurulum ve `egitimevi.org` |
| `belge/NASIL-YAPILDI.html` | Projenin nasıl yazıldığının hikâyesi |
| `ekran-goruntuleri/index.html` | Ekranlarla kılavuz (müdürün gözünden bütün okul yönetimi, sonra her rol) |
