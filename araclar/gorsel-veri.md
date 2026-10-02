# araclar/gorsel-veri.js

Ekran turunun ([gezinti.md](gezinti.md)) özel durumlarını test sunucusunda kurar: iki çocuklu veli, aynı zamanda veli olan
müdür, iki okulda öğretmen, yöneticinin açtığı iki yeni okul, okul sayfası, "şu an" süren servis günü, etüt ve ders, kulüp,
anket, yemek, ekli mesaj ve ödev teslimi, yarıda kalmış quiz, sınav notları, ödev serisi, Aile telefonu, hatırlatıcılar,
yorumlar ve bir nakil; turun gireceği hesapları `HESAPLAR` olarak dışa açar.

## Bu dosya ne yapar?

Ekran turu her rolün ekranlarını gerçek tarayıcıda gezip fotoğraflar. Fotoğrafların gerçekçi olması ve bir özelliğin her
hâlini göstermesi için veritabanında o hâllerin önceden kurulmuş olması gerekir: bir velinin iki çocuğu, bir müdürün aynı
zamanda veli olması, bir öğretmenin ikinci okulda da çalışması, bir öğrencinin quizi bitirmiş, öbürünün yarıda bırakmış
olması, servisin şu anda yolda olması… Veri üç katmanda kurulur:

1. `testler/seed.js` — temel okul ("Test Ortaokulu"), müdür, Matematik ve Fen öğretmeni, iki öğrenci.
2. `araclar/zengin-veri.js` — dolu bir okul: sınıflar (7-A, 7-B, 8-A), ders programı, ödevler, sınavlar, rolsüz yetişkin.
3. **Bu dosya** — çok rollü hesaplar ve zamana bağlı, "canlı" durumlar.

Her şeyi gerçek uçlardan, gerçek bir kullanıcının yapacağı sırayla yapar (öğrencinin quiz denemesi bile öğrencinin kendi
oturumuyla açılır). Kodla üretilen tek şey dosyalardır: okul sayfasının fotoğrafları, ek olarak yüklenen PNG ve PDF'ler dış
paket kullanılmadan bu dosyada çizilir.

Turda kullanılan hesapların bilgilerini (`HESAPLAR`) [gezinti.md](gezinti.md) buradan alır; nakil öğrencisinin T.C. no'sunu
da bu dosyanın yazdığı `testler/testdata/gorsel-nakil.json`'dan okur. Testler bu dosyayı kullanmaz.

## İçinde neler var?

### `HESAPLAR` (dışa açık)

Bütün kişiler uydurmadır; şifreler test değerleridir, dosyada yazılıdır (burada tekrar edilmez).

| Anahtar | Kim | Ne için | Turda |
|---|---|---|---|
| `veli` | Fatma Şahin (`fatma.sahin`, e-postalı yetişkin) | Zeynep ve Burak'ın velisi: iki çocuklu veli; servis, Aile telefonu | `veli` klasörü (`portalDisi`) |
| `ikinciMudur` | Canan Er (`canan.er`) | yöneticinin açtığı ikinci okulun müdürü; nakli kabul eder | — (veri kurar) |
| `servisci` | Hakan Yolcu (`hakan.yolcu`, e-postasız) | Test Ortaokulu'nun "1. Servis" şoförü | `servisci` (`test-ortaokulu` adresinden) |
| `ikinciOkul` | Deneme Anadolu Lisesi, `deneme-anadolu` | Ayşe Kaya'nın ikinci okulu, nakil hedefi | `ogretmen-ikinci-okul`, `nakil-ogrenci` |
| `yeniMudur` | Selin Taş (`selin.tas`) | yöneticinin açtığı, henüz boş üçüncü okulun müdürü; `ilkSifre` onun kendi şifresidir (ad, gezinti.js ile uyum için eski kalmış) | `yeni-mudur` |
| `ucuncuOkul` | Deneme İlkokulu, `deneme-ilkokulu` | boş okul | — |
| `nakil` | Elif Göçmen (`elif.gocmen`, doğum 12.04.2013) | Test Ortaokulu'ndan Deneme Anadolu Lisesi'ne nakil gelen öğrenci | `nakil-ogrenci` |

Ayrıca `seed.js`'in hesaplarıyla girer: Test Ortaokulu'nun müdürü (Mehmet Demir), Matematik öğretmeni Ayşe
Kaya, Fen öğretmeni Ali Yıldız, öğrenciler Zeynep Şahin ve Burak Öztürk, test yöneticisi (sunucunun boş veritabanında
`EE_ADMIN_SIFRE` ile kurduğu hesap). Bunların bilgileri de dosyada test değeri olarak yazılıdır.

### Dosya üreticileri (iç)

- `pdfYap(baslik)` — tek sayfalık (A4, 595×842 nokta), Helvetica ile başlığı yazan, elle kurulmuş geçerli bir PDF 1.4:
  beş nesne, `xref` tablosu, `trailer`. Başlıktaki `(`, `)` ve `\` atılır; latin1 yazıldığı için başlıklar Türkçe
  karaktersiz verilir (`'Oran oranti calisma kagidi'`).
- `crc32`, `pngParca`, `png(genislik, yukseklik, piksel)` — 8 bit RGB (renk türü 2), filtresiz satırlar, `zlib` ile
  sıkıştırılmış en küçük PNG yazıcısı; renkler 0–255'e kırpılır. ([simge-uret.md](simge-uret.md)'deki yazıcının RGBA ve
  tablolu CRC'li kardeşi; ikisi ayrı kopyadır.)
- `kapakCiz()` — 1200×400: gökyüzü geçişi, dalgalı bir tepe çizgisi, kırmızı çatılı okul binası, pencereler, kapı.
- `logoCiz()` — 200×200: beyaz zeminde kırmızı halka, turkuaz daire, ortada ikiye ayrık beyaz dikdörtgen (açık kitap).
- `galeriCiz(tohum)` — 480×360: dört renkten biri üzerinde eş merkezli beyaz halkalar; tohum rengi ve halkaların yerini değiştirir.
  Mesaj ekinde ve öğrencinin ödev tesliminde de "resim" olarak kullanılır.

### Yükleme yardımcıları (iç)

- `ekYukle(token, tur, ad, veri)` — `POST /api/ek/yukle?tur=<mesaj|odev>`, gövde ham bayt (`application/octet-stream`),
  dosya adı `X-Dosya-Adi` başlığında (URL kodlu). 200 değilse hata fırlatır; dönen: taslak ekin kimliği.
- `fotoYukle(token, yer, veri)` — `POST /api/okul-sayfa/foto?yer=<kapak|logo|galeri>` (`image/png`); dönen: fotoğraf kaydı.

### Küçük yardımcılar (iç)

- `iki(n)` (iki haneli sayı), `gun(n)` (bugünden `n` gün sonrası, bilgisayarın yerel tarihi, `YYYY-AA-GG`; `servisGunu`
  içinde aynı adla Türkiye saatine göre hesaplayan ayrı bir `gun` tanımlıdır), `saatYaz(dk)`
  (dakikayı `SS:DD`'ye), `beklenen(r, ne)` (`iste` cevabı 200 değilse `"<ne>: <durum> <hata>"` diye fırlatır, değilse gövdeyi
  döner).
- `roleGir(kimlik, sifre, secici)` — yetişkinle girer; giriş doğrudan bir role indiyse (`user.role` var, `kisilikSec` yok)
  o anahtarı döner; değilse `GET /api/kisilikler` listesinden `secici(k)` ile hedefi seçip `kisilikGec` ile o portalın
  anahtarını döner.
- `servisGunu(M, servisId, zeynep, burak, veliToken)` — servisin "bugünü"; ayrıntısı aşağıda.

### `calistir()` (iç)

Bütün kurulum; bölümleri "Nasıl çalışır"da sırasıyla. Yalnız `node araclar/gorsel-veri.js` ile doğrudan çalıştırılınca
çağrılır (`require.main === module`); [gezinti.md](gezinti.md) dosyayı yalnız `HESAPLAR` için yüklediğinde hiçbir şey
kurulmaz. Hata olursa `HATA: <ileti>` yazar, 1 koduyla çıkar. Bitince tek satır özet: "görsel veri hazır: veli (2 çocuk),
müdür + veli, iki okulda öğretmen, …".

Dışa açılan: `HESAPLAR`.

## Kimle konuşur?

- **Çağırdıkları (`require`):** [giris.md](giris.md) → `BASE`, `iste`, `girisYap`, `hesapAc`, `kisiKodu`, `kisilikGec`,
  `tcUret`; [../sunucu/ortak.md](../sunucu/ortak.md) → `kisiKoduBicim` (veli kodunu ekrandaki gibi 4'erli tireli yazar);
  Node'un `zlib`, `crypto` (sahte videonun rastgele baytları), `fs` ve `path` (nakil dosyası).
- **Çağırdığı uçlar ve bölümleri:**

  | Uçlar | Ne kurar | Bölüm |
  |---|---|---|
  | `/api/challenge`, `/api/register`, `/api/eposta-onay`, `/api/login`, `/api/login/dogrula`, `/api/kvkk-onay`, `/api/logout` | kayıt, giriş, aydınlatma onayı | [../sunucu/bolumler/kayit.md](../sunucu/bolumler/kayit.md) |
  | `/api/kisilikler`, `/api/kisilik/gec`, `/api/kisilik/cocuk` | rol seçimi, kişi kodu, veli koduyla çocuk ekleme | [../sunucu/bolumler/kisilik.md](../sunucu/bolumler/kisilik.md) |
  | `/api/admin/okul-ac` | ikinci ve üçüncü okul | [../sunucu/bolumler/yonetici-okul.md](../sunucu/bolumler/yonetici-okul.md) |
  | `/api/school/students`, `teachers`, `classes`, `class`, `role`, `role-assign`, `schedule-add` | listeler, 9-A sınıfı, "Zümre Başkanı" rolü, şu anki ders | [../sunucu/bolumler/okul.md](../sunucu/bolumler/okul.md) |
  | `/api/school/hesap-ac`, `ogretmen-ekle`, `servisciler`, `konum` | servisçi ve nakil öğrencisi, ikinci okula öğretmen, okulun konumu | [../sunucu/bolumler/hesaplar.md](../sunucu/bolumler/hesaplar.md), [../sunucu/bolumler/nakil.md](../sunucu/bolumler/nakil.md) |
  | `/api/okul-sayfa/foto`, `/api/okul-sayfa/foto-aciklama`, `/api/okul-sayfa` | kapak, logo, galeri, tanıtım, renk, CSS | [../sunucu/bolumler/okul-sayfasi.md](../sunucu/bolumler/okul-sayfasi.md) |
  | `/api/servis/kaydet`, `ogrenci`, `ev`, `saatler`, `sira`, `not`, `binmeyecek`, `yoklama`, `sefer-basla`, `konum`; `/api/kulupler/kaydet`, `katil`; `/api/yemek` | servis ve servis günü, kulüpler, yemek listesi | [../sunucu/bolumler/okul-hayati.md](../sunucu/bolumler/okul-hayati.md) |
  | `/api/etut/kaydet`, `ogrenciler`, `yoklama` | iki etüt ve bugünkü yoklama | [../sunucu/bolumler/etut.md](../sunucu/bolumler/etut.md) |
  | `/api/anketler`, `/api/anketler/oy` | okul anketi ve bir oy | [../sunucu/bolumler/anket.md](../sunucu/bolumler/anket.md) |
  | `/api/mesajlar`, `/api/mesajlar/duzenle` | sınıf mesajı, düzeltmesi, ekli mesaj | [../sunucu/bolumler/mesaj.md](../sunucu/bolumler/mesaj.md) |
  | `/api/ek/yukle` | mesaj ve ödev ekleri (taslak) | [../sunucu/bolumler/ekler.md](../sunucu/bolumler/ekler.md) |
  | `/api/assignments` (aç), `/hedefler`, `/<id>/finish`, `/<id>/yildiz`; `/api/progress` | ödevler, seri, yıldız | [../sunucu/bolumler/odev.md](../sunucu/bolumler/odev.md), [../sunucu/bolumler/ilerleyis.md](../sunucu/bolumler/ilerleyis.md) |
  | `/api/assignments/<id>/quiz`, `/basla`, `/cevap`, `/bitir`, `/odak` | quiz denemeleri ve sekme kaydı | [../sunucu/bolumler/quiz.md](../sunucu/bolumler/quiz.md) |
  | `/api/odev-dosya/yukle` | öğrencinin ödev teslimi | [../sunucu/bolumler/odev-dosya.md](../sunucu/bolumler/odev-dosya.md) |
  | `/api/exams/sablonlar`, `/api/exams`, `/api/exams/<id>`, `/<id>/grades` | "Yazılı" şablonundan sınav ve notlar | [../sunucu/bolumler/sinav.md](../sunucu/bolumler/sinav.md) |
  | `/api/teacher/schedule` | öğretmenin program hücreleri | [../sunucu/bolumler/ogretmen.md](../sunucu/bolumler/ogretmen.md) |
  | `/api/aile/cihaz`, `/api/aile/cihaz/konum`, `/api/aile/cihaz/kullanim`, `/api/aile/ayar` | Zeynep'in telefonu, konumlar, ekran süreleri, velinin sınırları | [../sunucu/bolumler/aile.md](../sunucu/bolumler/aile.md) |
  | `/api/hatirlaticilar` | beş hatırlatıcı | [../sunucu/bolumler/hatirlatici.md](../sunucu/bolumler/hatirlatici.md) |
  | `/api/yorumlar` | açılış sayfası yorumları | [../sunucu/bolumler/yorum.md](../sunucu/bolumler/yorum.md) |

- **Yazdığı dosya:** `testler/testdata/gorsel-nakil.json` (`{ "tc": "<nakil öğrencisinin T.C. no'su>" }`); `testler/testdata/`
  depoya girmez.
- **Onu kullanan:** yalnız [gezinti.md](gezinti.md) (`require('./gorsel-veri')` → `HESAPLAR`; `gorsel-nakil.json`'u da okur).
  Belgelerde adı geçer: [gezinti-metin.md](gezinti-metin.md), [giris.md](giris.md), [deneme-okulu.md](deneme-okulu.md),
  [../public/js/parcalar/14b-odev-teslim.md](../public/js/parcalar/14b-odev-teslim.md),
  [../public/js/parcalar/14c-quiz.md](../public/js/parcalar/14c-quiz.md), [../sunucu/bolumler/odev-dosya.md](../sunucu/bolumler/odev-dosya.md),
  [../sunucu/ortak.md](../sunucu/ortak.md), [belge/KILAVUZ.md](../belge/KILAVUZ.md) (ekran turu bölümündeki çalıştırma sırası
  ve klasör ağacı), [../TANITIM.md](../TANITIM.md).

## Nasıl çalışır (adım adım)?

### Çalıştırma

Yalnız test sunucusuna karşı ve ekran turu işinde; sıra [gezinti.md](gezinti.md)'deki gibi (yeni sıfırlanmış veriyle):

```
export EE_BASE=http://localhost:3200 EE_LOG=testler/test-sunucu.log
node testler/seed.js
node araclar/zengin-veri.js
node araclar/gorsel-veri.js     # bu dosya; ardından turun kendisi
```

### `calistir()` sırası

```
girişler   M  = müdür (müdür rolüne)        A = test yöneticisi
           MAT = Ayşe Kaya (Test Ortaokulu'ndaki öğretmen rolüne)   FEN = Ali Yıldız
listeler   öğrenciler → Zeynep, Burak; öğretmenler → Ayşe Kaya / Ali Yıldız (müdür e-postayı görmez, AD ile bulunur)
           sınıflar → 7-A;  "Zeynep'in sınıfları" = 7-A + Zeynep'in kendi sınıfı
veli       Fatma Şahin kaydolur (zaten varsa geç), Zeynep'in ve Burak'ın veli koduyla iki çocuk ekler
müdür      Burak'ın veli koduyla kendisi de veli olur (tek hesapta müdür + veli)
2. okul    Canan Er kaydolur → yönetici "Deneme Anadolu Lisesi"ni açıp onu müdür yapar
           → Canan Er, Ayşe Kaya'yı kişi koduyla Matematik öğretmeni olarak ekler → 9-A sınıfı
3. okul    Selin Taş kaydolur → yönetici "Deneme İlkokulu"nu açar (boş kalır)
okul sayfası  kapak + logo + 4 galeri fotoğrafı (açıklamalı) + tanıtım, renk, başlık/kapak boyu, hizalama, genişlik, CSS
servis     okul konumu → servisçi hesabı (+ aydınlatma onayı) → "1. Servis" (plaka, şoför, rehber, güzergâh)
           → Zeynep ve Burak durağıyla → Zeynep'in ev konumu → servisGunu
etüt       "Matematik etüdü" BUGÜN, şimdiden 30 dk önce başlar, 1 saat sonra biter (en geç 23:59), Kütüphane
           "Fen deney etüdü" Salı 15:40–17:00; ikisine 7-A + Zeynep + Burak; bugünkü etüde Ayşe Kaya yoklama girer
kulüp      Satranç (Ayşe Kaya, 20 kişi) ve Robotik (Ali Yıldız, 12 kişi); Zeynep Satranç'a katılır
anket      "Bahar şenliği hangi gün olsun?" (okul geneli, 7 gün) → Zeynep "Cumartesi"ye oy verir
yemek      bugünden başlayarak 5 hafta içi günün menüsü
rol        "Zümre Başkanı" (sinav.olustur + mesaj.toplu) → Ayşe Kaya'ya (sınıfa mesaj atabilsin diye)
mesaj      Ayşe Kaya sınıflara "Yarınki matematik dersi" yazar, sonra düzeltir
yıldız     Zeynep ilerleyişindeki "Geometri…" ödevini yıldızlar (zengin-veri'nin ödevi)
sınav      "Matematik 2. Yazılı" (5 gün önce, "Yazılı" şablonu) → her öğrenciye virgüllü not ("55,5", "68,5"…)
seri       Zeynep için 8 geçmiş ödev, 4 günde bir: yaptı ×4, geç, yapmadı, yaptı ×2 → serisi 2, en uzunu 4 (Burak hep yaptı)
ekler      ekli mesaj (PDF izin formu + PNG program) → ekli ödev "Oran orantı çalışma kâğıdı" (dosya yükleme açık)
           → Zeynep teslim eder: PNG, sahte MP4 (2 MB), PDF  (öğretmen "3 ek" görür)
quiz       "Kesirler quizi" (bütün quiz 20 dk, sonuç hemen):
             Burak başlatır, 2 soru cevaplar, BİTİRMEZ;  Zeynep 4 soru + açık uçlu cevap, bitirir (2/4)
             6 sn sonra Burak'ın iki sekme çıkışı (4 sn ve 2 sn)
           "Çarpım tablosu hız quizi" (soru başına süre, çıkınca soru kapanır): kimse başlamaz (turda Zeynep çözer)
şu an ders öğretmenin ilk Matematik hücresinin sınıfına BUGÜN, şimdiden 10 dk önce – 1 saat sonra bir ders
Aile       Zeynep telefonunu bağlar (açık onay) → son ~80 dakikada 15 dk arayla 6 konum (sonuncusu Wi-Fi) → veli ayarları
           (konum gönderme sıklığı Wi-Fi'de 5 dk, mobilde 15 dk; sınırlar: günlük toplam 3 sa, YouTube 1 sa)
           → 7 günlük ekran süreleri (bugün YouTube 85 dk, toplam 193 dk: iki sınır da aşılır, veliye iki bildirim)
hatırlatıcı Zeynep'e 4 (haftalık, günlük, bir kez, aylık), Ayşe Kaya'ya 1
yorumlar   veli 5★, Ayşe Kaya 5★, müdür 4★, Canan Er 4★ (yalnız yetişkinler)
nakil      Test Ortaokulu Elif Göçmen'i 7-A'ya açar → Elif girer, onaylar → eski ödevi "yaptı", kısa sınavdan 88
           → Canan Er aynı T.C. + doğum tarihiyle Elif'i 9-A'ya açar → hesap taşınır (nakil)
           → T.C. testler/testdata/gorsel-nakil.json'a
son        FEN oturumu kapatılır; özet satırı
```

### `servisGunu` — servisin "şu an"ı

Ekran turu servisçinin Yoklama sayfasını ve velinin servis kartını canlı görmeli; bunun için servis aralığı turun çalıştığı
anı içermeli. Türkiye saati `Date.now() + 3 saat` ile hesaplanır (bilgisayarın saat diliminden bağımsız):

```
şu an 07:00–09:20 ya da 16:30–19:00 içinde → varsayılan aralıklar kalır (sabah 07:00–09:20, akşam 16:30–19:00)
öğleden önce (değilse)                     → sabah = [şimdi−1 sa, şimdi+1,5 sa] (10 dakikaya yuvarlanmış)
öğleden sonra (değilse)                    → akşam = [şimdi−1 sa, şimdi+1,5 sa] (en geç 23:59)
müdür /api/servis/saatler → servisçi girer (test-ortaokulu adresinden) → sabah sırası [Burak, Zeynep], akşam [Zeynep, Burak]
→ Zeynep'e yarın için not, herkese bugünkü gecikme notu → veli: Burak yarın sabah binmeyecek ("Doktor randevusu var.")
→ yoklama dönemi sabahsa Burak "bindi" (ilk "bindi" seferi kendiliğinden başlatır)
   akşamsa Zeynep "geldi", Burak "gelmedi", "sefer başla"
→ açık sefer varsa aracın bir konumu
```

## Dikkat!

- **Yalnız test sunucusuna, `EE_BASE` ve `EE_LOG` ile.** `EE_BASE` verilmezse istekler [giris.md](giris.md)'deki varsayılanla
  3000'e, kullanıcının sunucusuna gider. Test yöneticisinin girişi sunucunun boş veritabanında `EE_ADMIN_SIFRE` ile kurduğu
  hesaba dayanır; `seed.js` ile aynı değeri beklemek için sunucuyu `testler/tumtest.sh`'teki gibi aç.
- **Bir kez, yeni sıfırlanmış veride çalıştır.** Dosya tekrar çalıştırmaya göre yazılmamış. 2 Ekim'de test veritabanında
  ikinci kez çalıştırıldı: araç durmadı (çıkış 0), yalnız "ikinci okul açılamadı (zaten var olabilir): Bu okul zaten kayıtlı
  ve müdürü var." yazdı. Ama veri ikilendi: iki "Matematik etüdü", iki "Fen deney etüdü", ikişer "Kesirler quizi", "Çarpım
  tablosu hız quizi", "Oran orantı çalışma kâğıdı" ve seri ödevleri, iki anket, 8 galeri fotoğrafı, ikişer hatırlatıcı; nakil
  de yeniden kuruldu ve Deneme Anadolu Lisesi'nde ikinci bir "Elif Göçmen" oluştu (kullanıcı adı alındığı için T.C. no'su
  kullanıcı adı oldu). İkilenmeyenler: "1. Servis", kulüpler ve "Zümre Başkanı" (aynı ad "Bu adda bir … zaten var" diye
  reddedilir, cevaba bakılmadığı için sessiz; servis açılamayınca öğrencilerin servise eklenmesi ve `servisGunu` da
  atlanır), yorumlar (hesap başına tek yorum, üzerine yazılır). Tur da bu verinin ilk hâline göre yazıldı (quiz çözme adımı, özel rol). Sıra her zaman:
  sıfırlanmış veritabanı → `seed.js` → `zengin-veri.js` → bu dosya → tur.
- **Bir adım düşerse hepsi durur mu?** Ekler, quizler, şu anki ders ve Aile bölümleri kendi `try`'larının içinde; düşerlerse
  "… kurulamadı" yazıp devam ederler (servisçinin girişi de öyle). Öteki adımların bir kısmı `beklenen` ile ya da
  `fotoYukle` içinde denetlenir ve hata bütün aracı durdurur (ilk listeler, ikinci okula öğretmen ekleme, okul sayfası ve
  fotoğrafları, servis saatleri; ayrıca yetişkinlerin girişleri ve kişi kodu alma); bir kısmının cevabına ise hiç bakılmaz
  (velinin ve müdürün veli koduyla çocuk eklemesi, 9-A sınıfı, galeri açıklamaları, üçüncü okul, servisçi hesabı, servise
  öğrenci ekleme, etüt, kulüpler, anket, yemek, rol, mesaj, sınav notları, hatırlatıcılar, yorumlar) ve hata sessiz kalır.
  Örneğin veli kodu bir gün reddedilirse veli çocuksuz kalır ama araç "görsel veri hazır" der; tur o zaman velinin
  ekranlarında düşer.
- **İki saat anlayışı.** Servis aralıkları, `servisGunu`'nun içindeki kendi `gun()`'ü (servisçi notu ve "binmeyecek"
  tarihi) ve Aile'nin ekran süresi günleri Türkiye saatine (UTC+3) göre; etüdün ve "şu anki dersin" saatleri ile dosya
  düzeyindeki `gun()` (ödev, sınav, anket, yemek, hatırlatıcı tarihleri) ise bilgisayarın yerel saatine göre hesaplanır. Bilgisayar Türkiye saatinde değilse etüt ve ders turun çalıştığı ana denk
  gelmez. Gece yarısına yakın çalıştırırsan etüt ve ders kısalır (en geç 23:59), servis aralığı da gece yarısını aşamaz;
  [gezinti.md](gezinti.md) 23:30–00:30 arasında yoklama adımının aralık dışı ekran çektiğini yazar.
- **Burak'ın "yarıda" denemesi kalıcı değil.** Kesirler quizinin süresi 20 dakika; süre dolunca sunucunun dakikalık işi
  Burak'ın denemesini "süre doldu" diye kapatır ([../sunucu/bolumler/quiz.md](../sunucu/bolumler/quiz.md)). Tur öğretmenin
  quiz ayrıntısını bundan sonra çekerse Burak yarıda değil bitmiş görünür (koddan çıkarım; denenmedi). Sekme çıkışlarından
  önce 6 saniye beklenmesinin nedeni de süre: sunucu çıkış süresini denemenin geçen süresinden uzun saymaz (dosyadaki
  yorum).
- **Yorumlarla kod arasındaki küçük farklar** (kod değiştirilmedi):
  - `servisGunu`'nun yorumu "Sabahsa Zeynep bindi" diyor; kod sabah **Burak**'ı "bindi" işaretler (sabah sırasında ilk Burak).
  - Aile bölümünün yorumu yalnız YouTube sınırının aşıldığını ve veliye bildirim gittiğini söylüyor; bugünkü toplam da
    (85 + 32 + 24 + 18 + 11 + 15 + 8 = 193 dk) 180 dakikalık günlük sınırı aştığı için veliye iki bildirim gider
    ([../sunucu/bolumler/aile.md](../sunucu/bolumler/aile.md) `sinirlariDenetle`). 2 Ekim'deki çalıştırmada velinin
    bildirimlerinde ikisi de vardı: "… bugün YouTube uygulamasında 1 sa 25 dk geçirdi (sınır 1 sa)." ve "… bugün telefonda
    toplam 3 sa 13 dk geçirdi (sınır 3 sa)." Yorumdaki "Wi-Fi 5, mobil 15 dk" de sınır değil, konumun gönderilme sıklığıdır.
  - "Şu an süren ders" yorumu 7-A diyor; kod öğretmenin programındaki ilk Matematik hücresinin sınıfını alır (hangisi gelirse).
  - Sondaki "Tek ders kullanan kişiler için: bekleyen bildirimler gerçekçi görünsün" yorumunun amacı koddan anlaşılmıyor:
    Ali Yıldız'ın oturumu başta açılıp yalnız sonda kapatılıyor, arada hiç kullanılmıyor.
- **`@test.com` adresleri.** Velinin, ikinci ve üçüncü müdürün e-postaları `test.com` alan adında; bu gerçek bir alan adıdır.
  Test sunucusunda e-posta ayarsız olduğu için kodlar günlüğe yazılır; e-postası ayarlı bir sunucuya karşı çalıştırma
  ([giris.md](giris.md) "Dikkat!").
- **Sahte dosyalar.** "Soru 12 anlatımı.mp4" yalnız 12 baytlık bir `ftyp` başlığı ve 2 MB rastgele bayttır, oynatılamaz;
  ekranda dosya satırını ve boyutu göstermek içindir. PDF'ler ve PNG'ler geçerlidir.
- **Kulüp bölümü kalkacak.** Kullanıcı kulüplerin kaldırılmasını istedi; o iş yapılınca `/api/kulupler/...` çağrıları
  (Satranç, Robotik, Zeynep'in katılması) hata verir, çıkarılmalı.
- **Gerçek kişi adı yok.** Bütün adlar test verisidir; yeni bir kişi eklersen uydurma ad kullan (depo herkese açık).

## Testleri

- Bu dosyayı çalıştıran ya da denetleyen otomatik test yok; `tumtest.sh` onu kullanmaz. Doğruluğunun ölçüsü ekran turudur:
  tur, burada kurulan durumları fotoğraflar ve beklenen bir öğe bulunamazsa raporunda adımı hatalı yazar
  ([gezinti.md](gezinti.md)).
- Kurduğu her özelliğin kendisi ilgili test paketinde denenir (ör. quiz `testler/test-quiz.js`, servis
  `testler/test-servis-yoklama.js`, nakil `testler/test-nakil.js`, Aile `testler/test-aile.js`, okul sayfası
  `testler/test-okul-sayfasi.js`).
- Elle: boş test sunucusunda "Çalıştırma"daki üç komutu çalıştır; son satırda "görsel veri hazır: …" çıkmalı, araya
  "… kurulamadı" ya da "… olmadı" satırları düşmemeli. Sonra tarayıcıda velinin (iki çocuk kartı), servisçinin (Yoklama) ve
  öğretmenin (Kesirler quizi ayrıntısı) ekranlarına bak.
- 2 Ekim akşamı (22:47, Türkiye saati) denetimde böyle denendi: 3200'de yeni sıfırlanmış test veritabanı, `seed.js` (~2 sn),
  `zengin-veri.js` (~3,5 sn), bu dosya (~10,5 sn, çıkış 0, araya hiçbir "kurulamadı" satırı düşmedi). Ardından uçlardan
  bakıldı: servis saatleri akşam 21:40–23:59'a alınmıştı, servisçinin yoklamasında dönem "aksam", açık bir dönüş seferi ve
  aracın konumu vardı; sabah sırası Burak–Zeynep, akşam Zeynep–Burak; Zeynep 7-B'de, Burak 7-A'da; velinin iki Aile
  bildirimi geldi. Tur çalıştırılmadı. Aynı veritabanında ikinci çalıştırmanın sonucu "Dikkat!"te.

## Son durum

- `git log --follow`: 7 commit. Dosya iki parçada yazıldı: `dfb1efe commit 407` (2026-09-26; baştaki açıklama, `HESAPLAR`,
  PDF/PNG çiziciler ve yükleme yardımcıları, 155 satır) ve `f08b671 commit 424` (2026-09-26; `calistir()`'ın bütün bölümleri,
  305 satır). `0acca75 commit 516` (2026-09-27, kişi kodu ve yöneticinin okul açması): eskiden yönetici ikinci ve üçüncü
  müdürün hesabını kendisi açıp ilk şifre veriyor, Canan Er ilk girişte şifresini değiştiriyordu; artık ikisi kendi
  hesabını açıp kişi kodunu veriyor (`ilkSifre` adı yalnız `yeniMudur`'da, gezinti.js uyumu için kaldı) ve öğretmenin eski
  `ogretmenKodu`'nun yerine `kisiKodu` kullanılıyor. `24050a2 commit 518` (servis yoklaması): `servisGunu` eklendi.
- `3b8fd36 commit 519` (2026-09-27, quiz): baştaki açıklamaya iki quiz eklendi; "Kesirler quizi" (Zeynep bitirir, Burak
  yarıda bırakıp iki kez sekmeden çıkar) ve "Çarpım tablosu hız quizi" kuran bölüm; özet satırına "quiz".
- `153d63d commit 522` (2026-09-27, kişi kodu 16 hane): veli ve müdür çocuk eklerken veli kodunu ham değil
  `kisiKoduBicim` ile 4'erli tireli gönderir oldu (velinin ekranda gördüğü ve yazdığı biçim; sunucu tireleri atar).
- `566b917 commit 524` (2026-09-27, canlı hazırlık): "Oran orantı çalışma kâğıdı" ödevine `dosyaYukleme: true` eklendi —
  öğrenci dosya yükleme izni o commit'te varsayılan olarak kapalı geldiği için, yoksa Zeynep'in üç teslim dosyası reddedilirdi.
- Bilinen açıklar ("Dikkat!"te, kod değiştirilmedi): tekrar çalıştırmaya dayanıksızlık, iki saat anlayışı, yorum–kod farkları.
- Planlı işlerden bu dosyayı etkileyecekler: "Ekran turu + albüm + wiki güncelleme" (özellikler bitince tur baştan
  çekilecek; yeni özelliklerin — eğitim içerikleri, toplantılar, mesaj etiketleri, Excel'den not/quiz, sınav formülleri,
  devamsızlık aralığı… — verisi buraya eklenecek); "Kulüpler kaldırılacak" (kulüp bölümü çıkar); "T.C. kimlik no bütün
  hesaplarda zorunlu" (velinin ve yeni müdürlerin kaydı T.C. ister); "Sistem" (yöneticiye zorunlu doğrulama uygulaması:
  yöneticinin girişi günlükteki kodla yapılamaz); "Çalışan olarak ekleme" (Ayşe Kaya'nın ikinci okula kişi koduyla eklenmesi
  rolsüz gelir, öğretmen rolü ayrıca verilmeli); "Güvenlik denetimi"ndeki "okulun verdiği her şifrede ilk girişte
  değiştirme" (servisçi ve nakil öğrencisinin ilk girişi).
