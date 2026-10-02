# araclar/gezinti.js

Ekran turu: her rolün ekranlarını başsız Chrome/Edge'de gerçekten gezip kullanır, her adımın JPEG fotoğrafını çeker, aynı
sırada konsol/istek/kayma sorunlarını toplar ve sonunda `ekran-goruntuleri/index.html` albümünü ("ekranlarla kılavuz") ile
depoya girmeyen bir hata raporunu yazar.

## Bu dosya ne yapar?

Eğitim Evi'nin bütün ekranlarını tek tek elle fotoğraflamak hem çok uzun hem de her değişiklikte yeniden yapılması gereken
bir iş. Bu araç onu otomatikleştiriyor: bilgisayarındaki Chrome'u (yoksa Edge'i) görünmez kipte açar, Chrome DevTools
Protokolü'yle (CDP) doğrudan konuşur — paket kurmadan, Node'un kendi `WebSocket`'iyle — ve bir "senaryo" listesini sırayla
oynatır:

1. Önce giriş yapmamış birinin gördüğü sayfalar (açılış, Hakkında, SSS, İndir, koşullar, aydınlatma metni, giriş, kayıt,
   okulun kendi sayfası).
2. Sonra 12 "rol" sırayla: müdür, aynı hesabın veli tarafı, öğretmen, öğretmenin ikinci okulu, okul bir bölümü kapatınca,
   nakil gelen öğrenci, öğrenci, iki çocuklu veli, servisçi, portalı olmayan yeni yetişkin, kişi koduyla açılan okulun
   müdürü ve site yöneticisi.
3. Her rolde ekranlar önce bilgisayar boyunda (1440 px) açık görünümde, sonra bir kısmı koyu görünümde, sonra bir kısmı
   telefon boyunda (390 px) çekilir. Adımlar yalnız sayfa açmaz: pencere açar, sekme değiştirir, süzgeç seçer, tabloya
   değer yazar, dosya sürükleyip bırakır, quiz çözer.

Her adımda tarayıcının olaylarını dinler ve şunları not eder: konsol hata/uyarıları, yakalanmamış JavaScript hataları,
400 ve üstü dönen ya da hiç yüklenemeyen istekler, yüklenirken sayfa kayması (CLS, 0,1 üstü kötü), adım başına API isteği
sayısı ve indirilen veri, bulunamayan düğmeler. Yani bu bir test değil (hiçbir şeyi "geçti/kaldı" diye sonuçlandırmaz) ama
bir duman denetimi gibi çalışır.

İki çıktı üretir:

- **Albüm** — `ekran-goruntuleri/` (depoya girer): `index.html` ve `<rol>/NN-....jpg`. Albüm önce bilgisayar, sonra telefon
  görünümünü; her kısımda önce müdürün gözünden okul yönetimini, sonra dış sayfaları ve öteki rolleri gösterir. Her
  fotoğrafın altındaki açıklama [gezinti-metin.md](gezinti-metin.md)'den gelir. Fotoğraflardaki bütün kişiler, okullar ve
  notlar test verisidir.
- **Geliştirici raporu** — `testler/testdata/gezinti/` (depoya girmez): `hata-raporu.md` (sorunlu adımlar ve adım başına
  ölçüm tablosu) ve `gezinti.json` (bütün adımların ham kaydı).

Kim kullanır: yalnız geliştirici, elle. Sunucunun parçası değildir; hiçbir test ya da betik onu kendiliğinden çağırmaz.
Turun bütün planı "özellikler bitince baştan çek" diye en sona bırakılmış durumda (bkz. Son durum).

## İçinde neler var?

### Ayarlar ve sabitler

| Ad | Değer | Ne işe yarar |
|---|---|---|
| `BASE` | `EE_BASE` ya da `http://localhost:3200` | Tarayıcının açtığı sitenin kökü |
| `CIKTI` | `ekran-goruntuleri/` | Albüm ve fotoğraflar |
| `RAPOR` | `testler/testdata/gezinti/` | Hata raporu ve `gezinti.json` |
| `HATA_AYIKLAMA_PORTU` | `9333` | Tarayıcının CDP portu (sabit) |
| `OLCEK` | `EE_OLCEK` ya da `0` | Verilirse iki boyutun da piksel oranı bu olur (`EE_OLCEK=1` küçük ve hızlı) |
| `MASAUSTU` | 1440 × 1000, oran 1,5 | Bilgisayar görünümü (fotoğraf 2160 px genişlik) |
| `TELEFON` | 390 × 844, `mobile`, oran 3 | Telefon görünümü (fotoğraf 1170 px genişlik), dokunma öykünmesi açık |
| `JPEG_KALITE` | `82` | Albüm depoya girdiği için boyut da önemli |
| `EN_UZUN_SAYFA` | `7000` (css px) | Tam sayfa fotoğrafı bu yükseklikte kesilir |
| `KAYMA_SINIRI` | `0.1` | Google'ın "iyi" CLS sınırı; üstü sorun sayılır |
| `CHROME` | ilk bulunan | Windows'ta Chrome (64 ve 32 bit yolu), sonra `Program Files (x86)` altındaki Edge; Linux'ta `/usr/bin/google-chrome`, `/usr/bin/chromium` |
| `NAKIL_TC` | `testler/testdata/gorsel-nakil.json` içindeki `tc` | Nakil penceresi adımında yazılan T.C. no; dosya yoksa `''` |

### Tarayıcı bağlantısı

- `class Tarayici` — tek bir CDP sayfa bağlantısı. `gonder(method, params)` her komuta artan bir `id` verir, cevabı o `id`
  ile eşleyip sözü çözer (cevapta `error` varsa reddeder). Kimliksiz gelen olaylar (`Network.*`, `Runtime.*`…) `dinleyici`
  işlevine verilir.
- `tarayiciAc()` — işletim sisteminin geçici klasöründe `ee-gezinti-*` adlı boş bir profil açar ve tarayıcıyı şu
  bayraklarla başlatır: `--headless=new`, `--disable-gpu`, `--no-first-run`, `--no-default-browser-check`,
  `--lang=tr-TR`, `--hide-scrollbars`, `--mute-audio`, `--remote-allow-origins=*`, eklentisiz (`--disable-extensions`,
  `--disable-component-extensions-with-background-pages`; Edge'in yerleşik eklentileri konsola uyarı basıp turu
  yavaşlatıyordu), `--disable-background-networking`, `--disable-sync`, 9333 portu, 1440×1000 pencere, `about:blank`.
  Sonra 250 ms arayla en çok 60 kez (15 sn) `http://127.0.0.1:9333/json/list`'e bakar, ilk `page` hedefine WebSocket ile
  bağlanır; bulamazsa "Tarayıcıya bağlanılamadı". Dönen nesnenin `kapat()`'ı bağlantıyı kapatır, süreci öldürür ve 1,5 sn
  sonra geçici profili siler.

### Hata toplama

- `akis` — turun ortak durumu: açık istekler (`istekler`, istek kimliği → adres), şu anki adımın kaydı (`kayit`), tarayıcı,
  `album` ve `tumKayitlar` (yarıda kalan turda raporu yazabilmek için).
- `yeniKayit()` — `{ konsol: [], istisna: [], istek: [], api: 0, bayt: 0, kayma: 0, eylemHatasi: '' }`.
- `olayIsle(yontem, p)` — CDP olaylarını kayda çevirir:

| Olay | Kayda yazılan |
|---|---|
| `Network.requestWillBeSent` | isteği açık sayar; adreste `/api/` varsa `api` +1 |
| `Network.responseReceived` | durum 400 ve üstüyse `istek`'e `"<kod> <yol?sorgu>"` |
| `Network.loadingFinished` | isteği kapatır, `bayt`'a sıkıştırılmış boyutu ekler |
| `Network.loadingFailed` | iptal edilmemişse `istek`'e `"YÜKLENEMEDİ <yol> (<neden>)"` |
| `Runtime.consoleAPICalled` | `error`, `warning`, `assert` → `konsol` (yığını `extension://` ya da `chrome-extension://` olanlar atlanır) |
| `Runtime.exceptionThrown` | `istisna` |
| `Page.javascriptDialogOpening` | iletiyi terminale ve (adım sürüyorsa) `konsol`'a yazar, pencereyi kapatır: `confirm` için **Vazgeç**, öteki türler için Tamam (tur bir şey silmesin diye) |
| `Log.entryAdded` | `error`/`warning` düzeyindeki tarayıcı günlükleri → `konsol` |

- `kisaUrl(u)` — adresin yalnız yol + sorgu kısmı.
- `sakinlesmeyiBekle(t, sakin = 450, enCok = 12000)` — açık istek kalmayıp `sakin` ms geçene kadar (en çok 12 sn) bekler,
  sonra sayfanın iki kare çizmesini bekler (sayfa çizmiyorsa en çok 2 sn).
- `degerlendir(t, ifade)` / `degerlendirBir` — sayfada `Runtime.evaluate` (`awaitPromise`, `returnByValue`). 20 sn içinde
  cevap gelmezse açık bir `alert/confirm` sayfayı dondurmuş olabilir diye onu kapatır ve "zaman aşımı (20 sn)" hatası
  verir; `degerlendir` zaman aşımında aynı ifadeyi bir kez daha dener. Sayfada fırlatılan hata, açıklamasının ilk satırıyla
  `Error` olur.

### Sayfaya eklenen yardımcılar (`YARDIMCI_BETIK`)

`Page.addScriptToEvaluateOnNewDocument` ile her yeni belgeye en baştan konur, adımların `eylem` metinleri bunları kullanır:

- `window.__kayma` — `PerformanceObserver` (`layout-shift`, `buffered`) yakın zamanda kullanıcı girdisi olmayan kaymaları
  toplar.
- `__bul(sec, metin)` — seçiciye uyan ve (verilirse) metni içeren ilk öğe; yoksa `bulunamadı: …` hatası.
- `__tikla(sec, metin)` — `__bul` + ortaya kaydır + `click()`.
- `__satirdaTikla(metin, sec)` — metni ve düğmeyi birlikte içeren en içteki `.satir`, `tr` ya da `.kart`'taki düğmeye basar
  (ör. `__satirdaTikla('Kesirler alıştırması', '[data-act="odev-ac"]')`); yoksa `satır bulunamadı`.
- `__tc()` — algoritmaya uyan rastgele T.C. kimlik no (test verisi; `araclar/giris.js`'teki `tcUret`'in tarayıcı eşi).
- `__dosyaVer(sec, ad, icerik, tur)` — `DataTransfer` ile dosya kutusuna dosya verir ve `change` olayı atar ("Dosya seç"
  ile seçilmiş gibi).
- `__yaz(sec, deger, sira)` — eşleşen `sira`'ncı kutuya değeri yazar, `input` ve `change` olaylarını atar.

### Fotoğraf

- `ekranBoyutu(t, boyut, yukseklik)` — `Emulation.setDeviceMetricsOverride` (genişlik, yükseklik, piksel oranı, `mobile`)
  ve dokunma öykünmesi.
- `fotografCek(t, dosya, boyut, tam)` — `tam` ise sayfayı başa kaydırır, içerik yüksekliğini (`cssContentSize`) ölçer,
  pencereyi o boya (en çok 7000 css px) uzatır, en çok iki tur yeniden ölçer; `Page.captureScreenshot` ile JPEG (kalite 82)
  çeker ve pencereyi eski boyuna döndürür. `tam: false` ise yalnız görünen alan çekilir (açılır pencere fotoğrafları).

### Adımların dili

Bir adım düz bir nesnedir:

| Alan | Anlamı |
|---|---|
| `ad` | Albümde fotoğrafın başlığı; [gezinti-metin.md](gezinti-metin.md)'deki anahtarın ikinci yarısı (`klasör|ad`) |
| `git` | Uygulama içi sayfa (`ana`, `ogr-odevler`…): menüdeki `[data-nav="…"]` bağlantısına basılır, yoksa `location.hash = '#/…'` |
| `url` | Oturumsuz sayfa adresi (`/`, `/login`, `/kvkk/kvkk.html`…): tam sayfa yüklenir |
| `eylem` | Sayfada `async` bir işlevin içinde çalışan JavaScript metni |
| `tam` | `false` ise yalnız görünen alan çekilir |
| `tema: 'serbest'` | Adımdan önce tema "Sistem"e döndürülmez (ay/güneş düğmesi adımları) |
| `hazirla` | Adımdan önce Node tarafında çalışan iş (servis saatlerini kurmak) |
| `pencereKalsin` | Adımdan önce açık pencere temizlenmez (bugün hiçbir adım kullanmıyor) |

Koyu ve telefon listelerinde `'sayfa|ad|eylem'` kısaltması da olur; `kisaAdim(s, ek)` onu `{ git, ad, eylem }`'e çevirir
(eylemin içindeki `|`'ler korunur).

Bir rol de nesnedir: `ad` (albüm klasörü), `baslik`, `eposta`/`sifre` (kullanıcı adı da olur), `okul` (girişin okul
adresindeki kısa ad), `gec` (`/api/kisilikler` cevabından geçilecek portalı seçen işlev: `okulRolu(rol, kisaAd)` ya da
`veliRolu(cocukAdi)`), `portalDisi` (çok portallı hesap girişteki gibi "Portalların" sayfasında açılsın), `pencereli`
(girişten sonra uygulama değil bir pencere beklenir; bugün kullanan rol yok), `yonetimAdresi` (yönetici paneline tam
sayfa geçiş beklenir), `once`/`sonra` (rolden önce/sonra Node tarafında hazırlık ve temizlik), `adimlar`, `koyu`,
`telefon`, `son`.

Hazır eylem parçaları: `bekleJs(ms)`; `QUIZ_METNI` (beş soruluk yapıştırma metni; 4. soruda doğru şık işaretli değil ki
önizleme satır hatasını göstersin) ve `QUIZ_YAPISTIR` (Yeni ödev → Quiz ekle → Metinden ekle → yapıştır); `PORTAL_KARTI`
(Ayarlar'daki `#portalKart`'a kaydırır); `MENU_AC` (`#hamburger`); `EKLE_AC(tur)` (`#btnEkle` ve `veli`/`ogretmen`/`mudur`
seçeneği).

### Roller ve adım sayıları

| Klasör | Kim olarak girer | Açık | Koyu | Telefon | Son | Toplam |
|---|---|---|---|---|---|---|
| `giris` | oturumsuz (`DIS_ADIMLAR`, `DIS_KOYU`, `DIS_TELEFON`) | 23 | 2 | 6 | – | 31 |
| `mudur` | `testler/seed.js`'in müdürü, Test Ortaokulu'nun müdür rolüne geçer | 61 | 4 | 5 | 1 | 71 |
| `mudur-veli` | aynı hesap, Burak'ın veli portalına geçer | 7 | – | 2 | – | 9 |
| `ogretmen` | seed'in Matematik öğretmeni, Test Ortaokulu'ndaki öğretmen rolü | 57 | 4 | 7 | – | 68 |
| `ogretmen-ikinci-okul` | aynı öğretmen, `deneme-anadolu` okulundaki rolü | 3 | – | – | – | 3 |
| `ozellik-kapali` | aynı öğretmen; `once` müdür olarak ödev ve etüdü kapatır, `sonra` açar | 2 | – | 1 | – | 3 |
| `nakil-ogrenci` | `gorsel-veri.js`'in nakil öğrencisi, `deneme-anadolu` adresinden | 6 | – | 1 | – | 7 |
| `ogrenci` | seed'in ilk öğrencisi | 26 | 3 | 5 | 7 | 41 |
| `veli` | `gorsel-veri.js`'in iki çocuklu velisi (`portalDisi`) | 20 | 1 | 4 | 1 | 26 |
| `servisci` | `gorsel-veri.js`'in servisçisi, `test-ortaokulu` adresinden; `once`/`sonra` servis saatleri | 5 | 1 | 2 | – | 8 |
| `rolsuz` | `zengin-veri.js`'in portalı olmayan yetişkini (Kemal Arslan, test verisi) | 6 | 2 | 4 | – | 12 |
| `yeni-mudur` | `gorsel-veri.js`'te yöneticiye okul açtıran kişi (kendi şifresiyle) | 2 | – | 1 | – | 3 |
| `admin` | test sunucusunun boş veritabanında ilk açılışta kendisinin kurduğu yönetici (şifre `EE_ADMIN_SIFRE`; [../sunucu/veri/index.md](../sunucu/veri/index.md)); `seed.js` de bu hesapla girer. `yonetimAdresi: '/admin'`; `once` Hülya Demirtaş'ın (test verisi) kişi kodunu okur | 14 | 3 | 4 | 2 | 23 |

Dış sayfalar (`DIS_ADIMLAR`): açılış, yorumlar ve alt bilgi, Yapımcılar listesi, ay ve güneş düğmesi, Hakkında, SSS (bir
soru açık hâli de), İndir (iPhone'a ekle adımlarıyla), kullanım koşulları, aydınlatma metni (Yapımcılar listesinin sayfadan
çıkmadan açıldığı da), `/login`'de okul arama (büyük/küçük harf ve yazım hatası, harfleri yer değiştirmiş kelime), kayıt
(alan hatalarıyla), `/school/test-ortaokulu` (yanlış şifreyle), olmayan hesapla giriş, geçersiz e-posta onay bağlantısı
(`/login#/eposta-onay?t=000…`) ve "Bilgilerimi kaydetme" seçilince "Beni hatırla"nın kalkması. `DIS_KOYU`: açılış ve okul
sayfası; `DIS_TELEFON`: açılış, Hakkında, SSS, İndir, okul sayfası, kayıt.

Toplam **305 adım** (31 dış + 274 rol). Rol içindeki sıra hep aynıdır: `adimlar` (açık, bilgisayar) → `koyu` → `telefon` →
`son` (açık, bilgisayar). `son`'a geri alınamayan ya da öncekileri bozan adımlar konur: öğrencinin ödevi açması (turuncu
kalkar) ve quiz başlatması (tek hak), velinin çocuk kartına basması, müdürün öğrenci portalına bakması, yöneticinin
ay/güneş düğmesi.

Hesap bilgileri koddadır ve hepsi test değeridir: seed hesaplarının (müdür, Matematik öğretmeni, ilk öğrenci) ve
yöneticinin bilgileri bu dosyada yazılı; öteki hesaplar `araclar/gorsel-veri.js`'in `HESAPLAR`'ından (`veli`,
`servisci`, `nakil`, `yeniMudur`) gelir, yeni yetişkinin ve okul açtıracak kişinin kullanıcı adı ve şifresi ise
`araclar/zengin-veri.js`'te açılan hesaplarla aynı olacak biçimde bu dosyaya elle yazılmıştır.

### Tur içi hazırlıklar (Node tarafı, API ile)

- `oturumAc(rol)` — `girisYap(eposta, sifre, okul)` (şifre + iki adımlı kod; kod sunucu günlüğünden okunur). `gec` varsa
  `GET /api/kisilikler`, `gec(k)` ile hedefi seçer ve `kisilikGec(token, tur, id)` ile o portalın anahtarını döner.
- `mudurOturumu()` — seed müdürüyle `oturumAc` (Test Ortaokulu'nun müdür rolü); `saatMetni(dk)` — dakikayı `SS:DD`'ye
  çevirir.
- `ozellikYaz(kapali)` — müdür olarak `POST /api/ozellikler { kapali }`; 200 değilse hata.
- `servisSaatiKur(donem)` — servisçinin Yoklama sayfası dönemi sunucu saatinden aldığı için, turun günün hangi saatinde
  çalıştığından bağımsız olarak "şu an"ı sabah ya da akşam aralığına alacak servis saatlerini müdür olarak yazar
  (`POST /api/servis/saatler`). Türkiye saati `Date.now() + 3 saat`'in UTC alanlarından hesaplanır. Sunucunun kuralı: her
  aralık en az 30 dakika, sabah akşamdan önce biter, ikisi de aynı gün ([servis-pencere.md](../sunucu/yardimci/servis-pencere.md)
  `saatlerSorunu`). Bu yüzden 23:30'dan sonra sabah, 00:30'dan önce akşam "şu an"a alınamaz; o adım aralık dışı ekranı
  çeker. Sonra `servisDonemiHazirla(donem)`.
- `servisDonemiHazirla(donem)` — ekran turun saatinden bağımsız aynı görünsün diye servisçi olarak girer, `GET
  /api/servis/yoklama`'ya bakar (dönem uyuşmuyorsa, servis yoksa ya da yoklama kapalıysa hiçbir şey yapmaz); sabah Burak'ı
  "bindi", akşam Zeynep'i "geldi", Burak'ı "gelmedi" işaretler (işaretsizse), `POST /api/servis/sefer-basla` ile seferi
  başlatır ve bir konum gönderir (`POST /api/servis/konum`, Ankara'da bir nokta, doğruluk 12 m).
- `servisci.once` müdür olarak `GET /api/servis` cevabındaki `saatler`'i `SERVIS_SAATLERI_ONCE`'ye saklar, `sonra` onları
  geri yazar.
- `admin.once` okul açtıracak kişiyle girip `kisiKodu` ile kodunu `HULYA_KODU`'na alır ve `POST /api/logout` yapar. "Okul aç"
  adımının `eylem`'i bir `get` erişicisidir: kod ancak adım çalışırken (`once`'tan sonra) okunur ve `XXXX-XXXX-XXXX-XXXX`
  biçiminde (`JSON.stringify` ile güvenle) yazılır.

### Ana akış (`calistir`) ve adım çalıştırıcı (`adimCalistir`)

- `calistir()` — Chrome/Edge yoksa "Chrome ya da Edge bulunamadı". Varsa `ekran-goruntuleri/`'ndeki **`aile-uygulamasi`
  dışındaki her şeyi siler**, tarayıcıyı açar, `Page`, `Runtime`, `Network`, `Log` alanlarını açar, yardımcı betiği ekler;
  dış sayfaları, sonra rolleri çalıştırır; tarayıcıyı kapatıp `raporYaz`.
- `adimCalistir(klasor, sira, adim, tema, boyut)` — renk tercihini (`prefers-color-scheme`: açık/koyu) ve
  `prefers-reduced-motion: reduce`'u öykünür, boyutu kurar, yeni kayıt açar. Dosya adı:
  `NN-[koyu-][telefon-]<git>.jpg` (`git` yoksa `giris`; yalnız `a-z0-9-` kalır), ör. `ogretmen/61-koyu-ana.jpg`. İçteki
  `adimIci` sırayla: `hazirla` → (tema serbest değilse) `temaAyarla("sistem")` → kayma sayacını sıfırla, odağı bırak,
  `#modalKok`'u boşalt → `url` ise `Page.navigate` + 600 ms sakinlik, `git` ise menü bağlantısına bas → sakinleşmeyi bekle
  → `eylem` (hatası `eylemHatasi`'na yazılır, adım sürer) → sakinleşmeyi bekle → 250 ms → kaymayı oku → fotoğraf → kayıt.
  Konsola `  ! 05-mesajlar.jpg  Mesajlar  [2 sorun]  (7 API, 412 KB)` gibi bir satır yazar. Adım başka bir yerde
  takılırsa (gezinme, `hazirla`, fotoğraf) "Adım tamamlanamadı: …" kaydedilir, yine de görünen alanın fotoğrafı denenir
  ve tur sürer. Her adımdan sonra sunucunun hız sınırına takılmamak için 300 ms beklenir.

### Rapor ve albüm

- `sorunlari(k)` — kaydı Türkçe sorun satırlarına çevirir: "Adım yapılamadı", "JavaScript hatası", "Konsol", "İstek",
  "Yüklenirken kayma: 0.14 (sınır 0.1)" (sayılar JavaScript'in noktalı yazımıyla).
- `esc(s)` — HTML kaçışı (`& < > "`).
- `raporYaz(album, tum)` — `hata-raporu.md` ("N adım, M adımda sorun. Toplam X API isteği.", her sorunlu adım için başlık ve
  maddeler, en sonda Rol | Adım | API | KB | Kayma | Süre ms tablosu) ve `gezinti.json`'u yazar, `albumYaz`'ı çağırır.
- `albumYaz(album, tum)` — albümü kurar:
  - Gruplar sıralanır: önce `mudur`, sonra `giris`, sonra öteki roller tanım sırasıyla. `ekran-goruntuleri/aile-uygulamasi/`
    altında `.png` varsa sona "Eğitim Evi Aile uygulaması" grubu eklenir (adları `UYGULAMA_EKRANLARI`'ndan).
  - İki kısım: "Bilgisayar görünümü" ve "Telefon görünümü"; bir fotoğrafın telefon olduğu dosya adındaki `telefon-`'dan (ya
    da `aile-uygulamasi/`'nden) anlaşılır. Kısım girişleri `ROL_METNI._bilgisayar`/`_telefon` (yoksa koddaki yedek
    cümle).
  - Her grup bir bölüm (`id="<kısım>-<klasör>"`, üstte içindekiler bağlantısı); başlığı ve (yalnız bilgisayar kısmında)
    giriş paragrafı `ROL_METNI[klasör]`'den. Bir adımın metninde `bolum` varsa (yalnız bilgisayar kısmında) önüne alt başlık
    açılır.
  - Fotoğraf metni `ADIM_METNI['<klasör>|<ad>']`, o yoksa `ADIM_METNI['*|<ad>']`; ikisi de yoksa adım "anlatımı olmayan"
    listesine girer ve sonunda konsola ilk 8'i yazılır.
  - Sayfa: başlık "Eğitim Evi — ekranlarla kılavuz", açıklama metası, `<h1>` "Bir okul Eğitim Evi'ni nasıl kullanır?",
    `ROL_METNI._giris`, ekran sayısı + "test verisidir" notu + klavye ipuçları, yapışkan içindekiler şeridi, ızgarada her
    fotoğraf bir `figure` (`a.foto` + `loading="lazy"` resim + başlık ve metin), altta GitHub bağlantısı ve "Bu sayfayı
    `araclar/gezinti.js` üretir". En sonda görüntüleyici penceresi ve `FOTOLAR` dizisi (`<` kaçırılmış JSON).
- `ALBUM_JS` — görüntüleyici: fotoğrafa basınca (Ctrl/Cmd/Shift'siz sol tık) büyük açılır; ← → önceki/sonraki, Esc kapatır
  ve odağı fotoğrafa geri verir; üstte "Bilgisayar/Telefon · rol · alt başlık", başlık, metin ve "12 / 311" sayacı; bir
  sonraki resim önceden yüklenir; adres `#ekran-N` olur ve bu adresle açılan sayfa doğrudan o ekranı gösterir. Telefon
  fotoğrafı telefon ekranı boyunda (390×844) bir çerçevede tekerlekle kaydırılır.
- `ALBUM_CSS` — kendi renk değişkenleri (açık ve `prefers-color-scheme: dark` için koyu), azaltılmış hareket tercihinde
  düz kaydırma, 360 px'lik (telefonda 220 px) otomatik ızgara; ızgaradaki her fotoğraf üstten 340 px'te (telefonda 440 px)
  kesilir, yani küçük resim gibi görünür (ama ayrı bir küçük resim dosyası yok, bkz. Dikkat); 700 px altında görüntüleyicinin açıklaması gizlenir, telefon çerçevesi
  kenarlıksız tam ekran olur.

### `--album` kipi

`node araclar/gezinti.js --album` turu çalıştırmaz: son turun `gezinti.json`'unu okur, kayıtları klasöre göre gruplar ve
yalnız `index.html`'i yeniden yazar. [gezinti-metin.md](gezinti-metin.md)'deki metinler değişince bu yeter.

### Hata yolu

`calistir` hata fırlatırsa yığın yazılır, o ana kadar toplanan albüm ve rapor yazılmaya çalışılır, tarayıcı kapatılır ve
500 ms sonra süreç 1 koduyla biter.

## Kimle konuşur?

- **Node:** `fs`, `path`, `os`, `child_process.spawn`; genel `fetch` ve `WebSocket` (Node 22 ve üstü; proje Node 24).
- **Araçlar:**
  - `araclar/giris.js` — `iste` (JSON isteği), `girisYap` (bot sorusu + şifre + günlükten iki adımlı kod), `kisilikGec`,
    `kisiKodu`. Bu dosyanın KENDİ `BASE`'i ve `LOG`'u vardır: `EE_BASE` (yoksa 3000 portu!) ve `EE_LOG` (yoksa kökteki
    `sunucu.log`). Bkz. Dikkat.
  - `araclar/gorsel-veri.js` — `HESAPLAR` (veli, servisçi, nakil öğrencisi, yeni müdür); ayrıca `gorsel-nakil.json`'u yazar.
  - `araclar/zengin-veri.js` ve `testler/seed.js` — turun beklediği okul, sınıflar, ödevler, sınavlar ve hesaplar.
  - [gezinti-metin.md](gezinti-metin.md) — `ROL_METNI`, `ADIM_METNI`, `UYGULAMA_EKRANLARI`.
- **Sunucu uçları (Node tarafından doğrudan):**
  - `GET /api/challenge`, `POST /api/login`, `POST /api/login/dogrula`, `POST /api/logout` —
    [../sunucu/bolumler/kayit.md](../sunucu/bolumler/kayit.md) (`giris.js` üzerinden).
  - `GET /api/kisilikler`, `POST /api/kisilik/gec` — [../sunucu/bolumler/kisilik.md](../sunucu/bolumler/kisilik.md).
  - `POST /api/ozellikler` — [../sunucu/bolumler/ozellikler.md](../sunucu/bolumler/ozellikler.md) (müdür).
  - `GET /api/servis`, `POST /api/servis/saatler`, `GET`/`POST /api/servis/yoklama`, `POST /api/servis/sefer-basla`,
    `POST /api/servis/konum` — [../sunucu/bolumler/okul-hayati.md](../sunucu/bolumler/okul-hayati.md); saat kuralları
    [../sunucu/yardimci/servis-pencere.md](../sunucu/yardimci/servis-pencere.md).
  - Geri kalan her uç tarayıcıdaki uygulama tarafından, kullanıcı gibi çağrılır (tur onları kendisi çağırmaz).
- **Ön yüzde dayandığı yerler** (bunlar değişirse tur kırılır):
  - `localStorage` `ee_token` ve `ee_hatirla` — [../public/js/parcalar/05-giris.md](../public/js/parcalar/05-giris.md).
    `ee_hatirla`'yı `tokenSakla` yazar ama hiçbir parça okumaz; turun yazdığı `"kalici"` etkisizdir. Oturumu "hatırlanan"
    yapan, anahtarın `localStorage`'da durmasıdır: portal geçişinde `tokenYenile` sekmede `ee_kip` bulamayınca eski anahtar
    `localStorage`'dakiyle aynı olduğu için `kalici` sayar ve yeni anahtarı oraya yazar. `sessionStorage` `ee_portal_disi` —
    [../public/js/parcalar/08c-kisilikler.md](../public/js/parcalar/08c-kisilikler.md).
  - Girişten sonra `#app`'in `on` sınıfı — [../public/js/parcalar/26-baslat.md](../public/js/parcalar/26-baslat.md);
    yöneticinin `/admin`'e tam sayfa geçişi (`yonetimeGec`) —
    [../public/js/parcalar/05b-sifre-zorunlu.md](../public/js/parcalar/05b-sifre-zorunlu.md).
  - `window.temaAyarla` — [../public/js/tema.md](../public/js/tema.md); `[data-nav]` tıklaması → `git()` —
    [../public/js/parcalar/07-yonlendirme.md](../public/js/parcalar/07-yonlendirme.md),
    [../public/js/parcalar/25-tiklama.md](../public/js/parcalar/25-tiklama.md); `#modalKok` —
    [../public/js/parcalar/03-mesaj-modal.md](../public/js/parcalar/03-mesaj-modal.md).
  - 82 ayrı `data-act` adı ve onlarca kimlik/sınıf: ör. quiz seçicileri
    ([../public/js/parcalar/14c-quiz.md](../public/js/parcalar/14c-quiz.md)), içeri aktarma
    ([../public/js/parcalar/15-aktarim.md](../public/js/parcalar/15-aktarim.md)), ek kutusu `.ek-birak`
    ([../public/js/parcalar/04d-ekler.md](../public/js/parcalar/04d-ekler.md)), hesap pencereleri `#hfAd`, `#hfTc`
    ([../public/js/parcalar/10b-hesaplar.md](../public/js/parcalar/10b-hesaplar.md)), özellik anahtarı `#oz-etut`
    ([../public/js/parcalar/16c-ozellikler.md](../public/js/parcalar/16c-ozellikler.md)), yönetici ekranları
    ([../public/js/yonetim/09-yonetici.md](../public/js/yonetim/09-yonetici.md),
    [../public/js/yonetim/09b-site-ayarlari.md](../public/js/yonetim/09b-site-ayarlari.md),
    [../public/js/yonetim/09c-yonetici-dosyasi.md](../public/js/yonetim/09c-yonetici-dosyasi.md)); dış sayfalarda
    `#btnYapimcilar`, `.site-tema`, `#vYorumlar`, `#vOkulAra`, `#formKayit`, `#formGiris`, `#gKaydetme`, `#gHatirla`
    ([../public/js/parcalar/05a-dis-sayfalar.md](../public/js/parcalar/05a-dis-sayfalar.md),
    [../public/js/parcalar/05-giris.md](../public/js/parcalar/05-giris.md)), İndir sayfasında `#iosEkle`, `#iphone`
    ([../public/js/indir.md](../public/js/indir.md)), servisçinin yoklaması `sy-sira`, `sy-not-yaz`, `#snMetin`
    ([../public/js/parcalar/19i-servis-yoklama.md](../public/js/parcalar/19i-servis-yoklama.md)), müdürün servis
    ekranları ve velinin "Binmeyecek"i ([../public/js/parcalar/19c-okul-hayati.md](../public/js/parcalar/19c-okul-hayati.md)),
    ders programından yoklama `program-yoklama`, `.py-dugme`, `py-kaydet`
    ([../public/js/parcalar/22-programim.md](../public/js/parcalar/22-programim.md)), zil `#btnBildirim`
    ([../public/js/parcalar/24-bildirim-arama-mobil.md](../public/js/parcalar/24-bildirim-arama-mobil.md)), ay/güneş
    `#btnTema` (`tema-degis`, [../public/js/parcalar/25-tiklama.md](../public/js/parcalar/25-tiklama.md)). Bu parçaların
    belgelerinin çoğunda "Ekran turu" notu var.
- **Onu çağıran:** hiçbir kod. Elle çalıştırılır; [../belge/KILAVUZ.md](../belge/KILAVUZ.md) "Ekran görüntüleri" bölümü ve
  [../TANITIM.md](../TANITIM.md) "Araçlar" bölümü anlatır.
- **Yazdığı yerler:** `ekran-goruntuleri/` (depoya girer), `testler/testdata/gezinti/` (`.gitignore`'daki
  `testler/testdata/` yüzünden girmez), işletim sisteminin geçici klasöründe `ee-gezinti-*` profili. Veritabanına
  doğrudan değil, API ve ekranlar üzerinden yazar (bkz. Dikkat).

## Nasıl çalışır (adım adım)?

### Çalıştırma

Turu yalnız test sunucusuna karşı ve ancak ekran turu işinde çalıştır (belgeleme gibi başka işlerde çalıştırma). Sırası:

```
# 1) Test sunucusu: 3200 portu, adı _test ile biten boş veritabanı, günlük dosyaya
#    (testler/tumtest.sh'teki sunucu_baslat satırının aynısı; yönetici şifresi seed.js'in beklediği olmalı)
# 2) Aynı kabukta:
export EE_BASE=http://localhost:3200 EE_LOG=testler/test-sunucu.log
node testler/seed.js             # temel hesaplar
node araclar/zengin-veri.js      # dolu bir okul: sınıflar, program, ödevler, sınavlar
node araclar/gorsel-veri.js      # çok rollü hesaplar, okul sayfası, servis, quiz, nakil (+ gorsel-nakil.json)
node araclar/gezinti.js          # EE_OLCEK=1 ile küçük ve hızlı
# 3) Bitince test sunucusunu kapat; albümü gözden geçirmeden commit'leme.
```

İki adımlı giriş kodu e-postayla değil sunucu günlüğünden okunur; bu yüzden sunucunun çıktısı `EE_LOG`'daki dosyaya
yönlendirilmiş ve e-posta ayarsız olmalı.

`sunucu_baslat`'ı olduğu gibi kopyalarken iki şeye dikkat et:

- **MEB okul listesi.** Yöneticinin "Okul aç — okul seçildi…" adımı Ankara'da "cumhuriyet ortaoklu" diye arar; bu arama
  test sunucusunun veri klasöründeki `okullar.json`'dan yapılır ([../sunucu/okullar.md](../sunucu/okullar.md)). Dosya
  depoda yoktur; `tumtest.sh` her paketten önce `data/okullar.json`'u `testler/testdata/`'ya kopyalar. Kopyalanmamışsa adım
  "bulunamadı: #bOkulSonuc [data-okul-id]" ile takılır. (Girişteki okul araması bundan etkilenmez: o, açılmış okulların
  adreslerinde arar.)
- **`EE_DIS_ISTEK=0`.** Testler sunucuyu bununla açar; o zaman `sunucu/uygulama-surum.js` GitHub'a hiç sormaz ve sürüm
  listesi boş gelir ([../sunucu/uygulama-surum.md](../sunucu/uygulama-surum.md)). İndir sayfası da "Sürüm listesi şu an
  alınamadı" der: "İndir — Android sürümleri ve iPhone" ile "İndir (telefon)" fotoğrafları, altlarındaki "son sürüm ve
  sürüm tablosu" metniyle çelişir. Albüm için sunucu GitHub'a çıkabilmeli (bu değişkeni verme).

### Bir rolün akışı

```
rol.once()  (hata olursa yazılır, rol yine denenir)
oturumAc(rol) ── giriş olmadı ──► "girişi yapılamadı, rol atlandı"          (sonra ÇAĞRILMAZ)
   │ token
   ▼
Page.navigate('/')  → localStorage temizle, ee_token + ee_hatirla=kalici (+ ee_portal_disi)
location.hash = #/ana → Page.reload → (yönetici: /admin'e geçiş + #app.on beklenir)
   │ bu arada hata (ör. "yönetim adresine geçilmedi") ──► "hazırlığı takıldı, rol atlandı"   (sonra çağrılır)
#app.on yok (ve rol pencereli değil) ──► "oturumu açılamadı, rol atlandı"   (sonra ÇAĞRILMAZ)
   │
   ▼
adimlar ─► koyu ─► telefon ─► son      her biri adimCalistir(...) → <rol>/NN-....jpg + kayıt
   │
rol.sonra()
```

### Bir adımın akışı

```
renk tercihi + azaltılmış hareket + boyut ─► hazirla? ─► tema "Sistem" ─► pencereyi temizle
   ─► url: tam yükleme  |  git: [data-nav] tıkla ya da #/sayfa
   ─► ağ sakinleşsin ─► eylem (hata → eylemHatasi) ─► ağ sakinleşsin ─► kayma ─► JPEG ─► kayıt + konsol satırı
```

### Sonunda

```
tarayıcıyı kapat ─► hata-raporu.md + gezinti.json ─► albumYaz ─► ekran-goruntuleri/index.html
"305 adım, M adımda sorun -> …/ekran-goruntuleri (rapor: …/testler/testdata/gezinti)"
```

## Dikkat!

- **Çıktı klasörünü siler.** `calistir` `ekran-goruntuleri/` içinde `aile-uygulamasi` dışındaki HER ŞEYİ (fotoğraflar,
  `index.html`, oraya konacak bir `KLASOR.md` gibi belge dosyaları, elle eklenmiş başka klasörler) siler. Silme tarayıcı
  açılmadan ÖNCE yapılır: tarayıcıya bağlanılamazsa ya da sunucu kapalıysa albüm ya hiç yazılmaz ya da hata sayfalarının
  fotoğraflarıyla yazılır. Yanlışlıkla çalıştırdıysan `git checkout -- ekran-goruntuleri` ile geri al. Planlı ekran turu
  işinde temizliğin `*.md`'yi koruması gerekiyor (Son durum).
- **Veritabanına yazar; yalnız test verisiyle çalıştır.** Tur "kullanıcı gibi" iş yapar: müdür "Nöbetçi Öğretmen" özel
  rolünü kaydeder, CSV'deki dört geçerli satırla öğrenci hesabı açmayı onaylar (rastgele T.C.'lerle; beşinci satır bilerek
  hatalı), öğretmen yoklama kaydeder (veliye bildirim gider) ve not tablosunda kaydete basar, öğrenci ödevleri açar ve
  "Çarpım tablosu hız quizi"ni başlatıp cevaplar (tek hak, geri alınmaz), servis saatleri değişip geri yazılır, servis
  yoklaması işaretlenir ve sefer başlatılıp konum gönderilir, yönetici elle yedek alır ve yönetici dosyasını okutur,
  ödev/mesaj penceresine sürüklenen sahte dosyalar taslak ek olarak yüklenir (6 saatte silinir), okulun ödev ve etüdü
  kapatılıp açılır. Daha sessiz yazmalar da var: zile basan adımlar (müdürün "Bildirim paneli", velinin "Bildirimler",
  yeni müdürün "Bildirim") paneli açınca okunmamış bildirimleri okundu yapar (`POST /api/notifications/read`); mesaj ya da
  duyuru açan adımlar onu okundu yapar (`GET /api/mesajlar/<id>`); yöneticinin ay/güneş adımları tema tercihini hesaba
  yazar (`POST /api/profile`, sonunda `acik` kalır); portal geçen adımlar (velinin menüden çocuk seçmesi, çocuk kartı,
  müdürün öğrenci portalı) yeni oturum anahtarı alır. Bu yüzden tur her seferinde **yeni sıfırlanmış** veriyle (seed →
  zengin-veri → gorsel-veri) çalışmalı; aynı veriyle ikinci kez çalışırsa quiz çözme adımı başka ekran çeker, özel rol
  aynı adla yeniden kaydedilmeye çalışılır.
- **`EE_BASE`'i mutlaka ver.** Tarayıcının gittiği adres bu dosyanın `BASE`'i (yoksa 3200), ama giriş, kişilik geçişi,
  servis saatleri ve özellik yazımı `araclar/giris.js`'in `BASE`'iyle (yoksa **3000**) gider. `EE_BASE` verilmezse Node
  tarafı 3000'deki sunucuya (çoğu zaman gerçek verili sunucu) giriş denemeleri yapar, tarayıcı 3200'ü açar; hiçbir rol
  çalışmaz (yalnız dış sayfalar çekilir). `EE_LOG` da verilmeli (yoksa kökteki `sunucu.log` aranır).
- **Onay pencereleri.** Tur açılan `confirm`'e CDP üzerinden Vazgeç der ki bir şey silinmesin. Tur yazıldıktan sonra 543'te
  gelen "bir kez gösterilen şifre" koruması (`TEK_SEFER`,
  [../public/js/parcalar/03-mesaj-modal.md](../public/js/parcalar/03-mesaj-modal.md)) bazı ekranlarda sayfa değişirken
  `confirm` ile sorar; orada Vazgeç denirse `git()` durur, sayfa DEĞİŞMEZ ve sonraki adım yanlış sayfada çekilir. Bugünkü
  adımlar buna takılmıyor: aktarım sonucunun koruması sayfa değişince sormuyor (`sayfada: false`), giriş bilgisi ve hesap
  penceresi adımları şifre üretmiyor. Şifre gösteren yeni bir adım eklersen bunu düşün. Öte yandan müdürün "İçeri
  aktarma — uygulandı" adımı `window.confirm`'ü "hep evet" yapar ve bu, sayfa yeniden yüklenene kadar (müdürün kalan
  bütün adımları, koyu, telefon ve `son` dahil) geçerli kalır: o adımdan sonra müdür listesine bir silme düğmesine basan
  adım eklersen sorulmadan gerçekten siler ve raporda da görünmez. (Koddan çıkarım; tur çalıştırılarak denenmedi.)
- **`sonra` her durumda çağrılmaz.** Bir rol üç yerde atlanabilir. Giriş (`oturumAc`) başarısızsa ya da sayfa yüklendiği
  hâlde `#app` `on` olmadıysa `once` çalışmış olsa bile `sonra` ÇALIŞMAZ; yalnız sayfa hazırlığı sırasında hata fırlarsa
  ("hazırlığı takıldı") çağrılır. `ozellik-kapali` rolünde ilk iki durum, okulun ödev ve etüdünün turun geri kalanında
  (öğrenci, veli…) KAPALI kalması demektir. Ayrıca `ozellikYaz([])` eski durumu geri yüklemez, bütün bölümleri açar (`POST /api/ozellikler` kapalı
  listeyi olduğu gibi yazar; [../sunucu/bolumler/ozellikler.md](../sunucu/bolumler/ozellikler.md)).
- **Sorunlu adımın fotoğrafı da albüme girer.** Düğme bulunamasa da adım fotoğraflanır ve albümde amaçlanan başlıkla
  (ör. "Yeni etüt penceresi") görünür; albüm sorunları göstermez. Commit'lemeden önce `hata-raporu.md`'ye bak. Raporda
  bilerek yapılan hatalar da "sorun" diye çıkar: yanlış şifreyle giriş, olmayan hesap, geçersiz e-posta onay bağlantısı
  gibi adımlarda bilerek alınan 4xx cevapları.
- **Seçicilere sıkı bağlı.** Bir `data-act`, kimlik ya da sınıf adı değişirse ilgili adım sessizce "bulunamadı" olur
  (yalnız raporda). 2 Ekim'de bu dosyadaki 82 `data-act` adının, kimliklerin ve 44 `git` sayfasının hepsinin `public/`
  kaynaklarında geçtiği metin aramasıyla denetlendi (`#oz-etut` kodda `'oz-' + o.k` ile kuruluyor); tur çalıştırılmadı.
- **Sabit CDP portu (9333).** Önceki bir çalıştırmadan kalmış başsız bir tarayıcı bu portu tutuyorsa tur YENİ tarayıcıya
  değil ona bağlanır (koddan çıkarım: `/json/list` hangi tarayıcı cevap verirse onu kullanır). Hata yolunda süreç 500 ms
  sonra çıktığı için `kapat()`'ın 1,5 sn sonraki profil silmesi çalışmaz; geçici klasörde `ee-gezinti-*` kalır. Daha
  kötüsü: `tarayiciAc` 15 sn içinde bağlanamazsa ("Tarayıcıya bağlanılamadı") başlattığı süreci öldürmez ve
  `akis.tarayici` hiç kurulmadığı için hata yolu da kapatamaz; tarayıcı geç de olsa açıldıysa başsız olarak açık kalır
  ve bir sonraki turun 9333'ünü tutabilir. Ayrıca bu durumda temizlik çoktan yapılmıştır ve `akis.album` olmadığı için rapor da albüm de yazılmaz. İş bitince
  artık tarayıcı süreçlerini kapat.
- **Tarayıcı yolu sınırlı.** Linux'ta yalnız `/usr/bin/google-chrome` ve `/usr/bin/chromium` aranır (`chromium-browser`, snap
  ya da macOS yolu yok); Windows'ta Edge yalnız `Program Files (x86)` altında aranır (çoğu kurulum oradadır). Bulunamazsa
  tur hiçbir şeyi silmeden durur.
- **Zaman aşımında yeniden deneme yan etkiyi ikiler.** `degerlendir` 20 sn'de cevap gelmeyen ifadeyi bir kez daha çalıştırır;
  kaydetme düğmesine basan bir `eylem` takılıp yeniden denenirse ikinci kez basar.
- **Kayma ölçümü.** `__tikla` sentetik `click()` kullanır; tarayıcı bunu kullanıcı girdisi saymadığı için tıklamayla açılan
  içeriğin aşağıdakileri itmesi de "kayma" diye toplanabilir (koddan çıkarım). Raporda "Yüklenirken kayma" görürsen adımda
  bir tıklama var mı bak.
- **Servis saatleri gece yarısı çevresinde.** 23:30–00:30 arasında çalışan turda sabah ya da akşam yoklama adımı aralık
  dışı ekranı çeker (kodun kendi yorumu da söylüyor).
- **Nakil adımı `gorsel-nakil.json`'a bağlı.** Dosya yoksa (`gorsel-veri.js` çalışmadı ya da nakil kurulamadı) T.C. kutusu boş
  kalır ve pencerede "T.C. kimlik no gerekli" görünür; fotoğraf "doğum tarihi isteniyor" ekranını göstermez.
- **Azaltılmış hareket öykünülür.** Her adım `prefers-reduced-motion: reduce` ile çekilir. Siteye ileride giriş/üzerine gelme
  canlandırmaları eklenirse bu tercihe uymalı; uymazsa fotoğraflar canlandırmanın ortasında çekilebilir.
- **Albüm metni ham HTML'dir.** `ROL_METNI` ve `ADIM_METNI`'nin `metin`/`giris` yazıları sayfaya kaçırılmadan eklenir,
  görüntüleyicide de `innerHTML` ile basılır (kaynak depodaki dosya, güvenilir); orada `<` ya da `&` yazacaksan
  `&lt;`/`&amp;` kullan. Buna karşılık `baslik`, `bolum` ve adımın `ad`'ı `esc` ile kaçırılır: onlara düz metin yaz.
- **Albümde ayrı küçük resim yok.** Izgaradaki her `<img>` tam boy JPEG'in kendisidir (masaüstünde 2160 px genişlik, tam
  sayfa fotoğraflar binlerce piksel boyunda); CSS onu 340 px'te (telefonda 440 px) keser. `loading="lazy"` yalnız ekrana
  gelince yükletir, boyutu küçültmez: albümü baştan sona kaydıran biri bütün tam boy dosyaları indirir. Küçük resim
  (thumbnail), canlandırma ya da video eklenecekse bu dosyanın `albumYaz`/`ALBUM_CSS`/`ALBUM_JS`'i değişir.
- **Albümdeki küçük kusurlar** (koddan çıkarım): `#ekran-999` gibi sayısı aralık dışı bir adresle açılan sayfada
  görüntüleyici boş açılır (`ac` perdeyi gösterir, `goster` hiçbir şey yapmadan döner; Esc kapatır). İlk adımında
  `bolum` olan bölümlerde (müdür, öğretmen, öğrenci, veli) başlığın altında boş bir `<div class="izgara">` kalır ve alt
  başlıktan önce 16 px fazladan boşluk olur.
- **Çok portallı hesaplar.** `gec` işlevi `/api/kisilikler` cevabındaki `roller[].rol`/`okulKisaAd` ve `cocuklar[].ad`'a
  dayanır; o cevabın biçimi değişirse müdür, öğretmen ve müdür-veli rolleri "geçilecek rol bulunamadı" ile atlanır.
- **Hesap şifreleri koddadır** (test değerleri; seed ve görsel veriyle aynı olmalı). Yönetici şifresi test sunucusunun
  `EE_ADMIN_SIFRE`'siyle aynı olmalı.

## Testleri

- Bu dosyayı çalıştıran ya da denetleyen otomatik test yok; `testler/tumtest.sh` onu çağırmaz. Kendisi bir duman denetimidir:
  sonucu `testler/testdata/gezinti/hata-raporu.md`'dir. Bazı `eylem`'lerin içinde küçük denetimler de var; tutmazsa hata
  fırlatır ve raporda "Adım yapılamadı" olur: Yapımcılar düğmesi aydınlatma metni sayfasından çıkarsa "sayfa değişti",
  "Bilgilerimi kaydetme" seçildiği hâlde "Beni hatırla" işaretli kalırsa "iki kutu birden işaretli kaldı", yöneticinin "Okul
  aç"ında kod sahibi bulunamazsa "kişi bulunamadı"; ayrıca "Portallarım kartı yok", "etüt anahtarı yok", "servis saatleri
  kartı yok", "portal açılmadı", "yıl seçici yok", "önceki okul seçeneği yok", "ek kutusu yok".
- `testler/test-gizli-dosyalar.js` — turu çalıştırmaz; yalnız `.gitignore`'u dener. Örnek yolları arasında
  `testler/testdata/ayarlar.json` ve `sunucu.log` var: bunların dışarıda kalması, turun yan ürünlerini de kapsayan
  `testler/testdata/` ve `*.log` kurallarının yerinde olduğunu gösterir (rapor, `gorsel-nakil.json`, `testler/test-sunucu.log`
  bu kurallarla depoya girmez). Turun raporunun yolunu ayrıca denemez; `ekran-goruntuleri/` ise bilerek depoya girer.
- Albüm metinlerinin her adımla eşleştiği tur sonunda "anlatımı olmayan N adım" satırıyla görülür. 2 Ekim'de tur
  çalıştırılmadan, dosyalar Node'a yüklenip sayıldı: 305 adımın hepsinin metni var, kullanılmayan metin yok.
- Elle (yalnız ekran turu işinde): yukarıdaki sırayla test sunucusunu ve veriyi hazırla, `EE_OLCEK=1` ile çalıştır; konsoldaki
  `!` satırlarına ve `hata-raporu.md`'ye bak, `ekran-goruntuleri/index.html`'i tarayıcıda aç (fotoğrafa bas, ← → ve Esc
  dene, `#ekran-5` adresiyle açılış). Yalnız metinleri denemek için `node araclar/gezinti.js --album` (önceki turun
  `gezinti.json`'u gerekir). İstemediğin değişikliği `git checkout -- ekran-goruntuleri` ile geri al.

## Son durum

- `git log --follow`: 15 commit; ilk hâli `e4bf8b0 commit 403` (2026-09-26), son değişiklik `153d63d commit 522`
  (2026-09-27).
- `153d63d commit 522` (kişi kodu 16 hane): yöneticinin "Okul aç" adımında kişi kodu artık `XXXX-XXXX-XXXX-XXXX` biçiminde
  yazılıyor (önce 5'erli boşluklu).
- `276c0a0 commit 521` (gizli `/admin` + site ayarları): yönetici rolüne `yonetimAdresi: '/admin'` ve girişten sonra `/admin`'e
  tam sayfa geçişi bekleyen döngü eklendi; "Site ayarları", "yapımcı eklendi, hatalar kutuların altında", "Okul adresini
  değiştir penceresi", "Yönetici dosyası" ve "Şimdi oku" adımları; koyu ve telefon listelerine site ayarları ve yönetici
  dosyası.
- `3b8fd36 commit 519` (quiz): `QUIZ_METNI`/`QUIZ_YAPISTIR` ve öğretmenin quiz adımları (Metinden ekle, düzenleyici, önizleme,
  rozetler, ayrıntı, sekme kaydı; koyu ve telefon), öğrencinin `son` listesine quiz başlatma/çözme/sonuç, veliye quiz durumu.
- **Depodaki albüm eski:** `ekran-goruntuleri/` en son `77955e8 commit 509`'da (2026-09-26) üretildi ("273 ekran" = 267
  JPEG + 6 uygulama PNG'si; yöneticinin artık olmayan "Onay bekleyenler" ekranı, `admin/02-onaylar.jpg`, hâlâ içinde).
  510–522'deki adımlar (quiz, site ayarları, yönetici dosyası, servis saatleri…) albümde yok. Bugünkü kodla yeniden
  çekilirse albüm 311 ekran olur: turun 305 fotoğrafı + turun çekmediği ama koruyup eklediği 6 uygulama ekranı.
- Bilinen açıklar (kod değiştirilmedi): çıktı temizliğinin `.md` dosyalarını silmesi ve tarayıcı açılmadan önce yapılması,
  girişi olmayan rolde `sonra`'nın atlanması, müdürün aktarım adımından sonra `confirm`'ün hep "evet" kalması, sabit CDP
  portu ve bağlanamayınca açık kalan tarayıcı, `EE_BASE` verilmezse 3000'e giden Node istekleri, `gorsel-nakil.json`
  yoksa nakil adımının yanlış ekranı çekmesi, `EE_DIS_ISTEK=0`'lı sunucuda boş İndir ekranı, küçük resmi olmayan albüm
  (hepsi Dikkat'te).
- Planlı işlerden bu dosyayı etkileyecekler:
  - "Ekran turu + albüm + wiki güncelleme" — özellikler bitince tur BAŞTAN çalıştırılacak; temizlik `*.md`'yi ve korunması
    gereken başka klasörleri (bugün yalnız `aile-uygulamasi` korunuyor; Android'in yeni ekranları için açılacak bir
    klasör de korunmalı) korumalı; gereksiz ekranlar ayıklanacak.
  - "Kulüpler kaldırılacak" — müdür, öğretmen, öğrenci ve velinin kulüp adımları (5 adım) ve metinleri çıkacak.
  - "Paneller /panel/admin ve /panel/destek" — `yonetimAdresi: '/admin'` `/panel/admin` olacak.
  - "Sistem" (yöneticiye zorunlu doğrulama uygulaması, TOTP) — yöneticinin girişi günlükten okunan e-posta koduyla
    yapılamayacak; `araclar/giris.js` ve bu dosyanın yönetici girişi değişmeli.
  - "Üst şerit sadeleştirme" — `#btnEkle`, `#btnBildirim`, `#btnTema`, `#hamburger` gibi seçiciler ve menü adımları.
  - "Arayüz önizlemesi" (tasarım seçilirse), "Çok dil", "T.C. bütün hesaplarda zorunlu" (kayıt adımları), "Mesaj ayarları"
    (mesaja kimin dosya ekleyebileceği role göre), "Devamsızlık" (tarih aralığı ve süzgeç), "Eğitim içerikleri",
    "Toplantılar", "Mesaj etiketleri" gibi yeni ekranlar — yeni ya da değişen adımlar ve metinler.
  - Android yerel uygulama — `aile-uygulamasi/` ekranları yeniden çekilecek.
