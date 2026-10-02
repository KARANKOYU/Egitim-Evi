# araclar/tema-ornekleri.js

`tasarim/tema-secimi.html` tema laboratuvarını sekiz hazır ayar bileşimiyle başsız (ekransız) Chrome ya da Edge'de açar,
her birinin 1400×1560'lık ekran görüntüsünü `tasarim/ornekler/` altına PNG olarak kaydeder; seçenekleri tek tek tıklamadan
yan yana karşılaştırmak için.

## Bu dosya ne yapar?

Eylül başında sitenin görünüşü seçiliyordu: ana renk ne olsun, yazı tipi hangisi, köşeler ne kadar yuvarlak, kutucuklar dolu
mu çizgili mi… Bunun için `tasarim/tema-secimi.html` yazıldı: tek başına açılan bir "laboratuvar" sayfası. Üstte koyu bir
kontrol paneli (her ayar için düğmeler, altında ne anlama geldiği, en altta "Şu anki seçim" özeti), altında örnek bir okul
ekranı (yan menü, kutucuklar, sayaçlar, ödev listesi, grafik, form) durur; bir düğmeye basınca ekran canlı değişir. Sayfa
ayarları adres satırından da okur (`?yon=muhur&tema=koyu&font=figtree…`) — sayfadaki yorumun dediği gibi "hem paylaşmak için
hem de örnek görüntüleri toplu üretmek için".

Bu araç o ikinci kullanımın kendisidir: seçilmiş sekiz bileşimin her biri için sayfayı ekransız tarayıcıda açar ve bir PNG
çeker. Sonuç, kontrol panelinde seçili düğmelerin ve özet satırının da göründüğü sekiz resimdir; hangisinin hangi ayar
olduğu hem dosya adından hem resmin üstünden okunur.

Kim kullanır: tasarım seçimi yapan kişi (kullanıcı), elle. Site, sunucu, testler ve öteki araçlar bu dosyaya bağlı değildir;
`tasarim/` klasörü web'den sunulmaz. Karşılaştırma için: bugün sitenin kullandığı yazı tipleri `public/yazitipi/` altındaki
IBM Plex Sans ve Newsreader dosyalarıdır ([../public/sw.md](../public/sw.md)'nin önbellek listesi).

## İçinde neler var?

### Sabitler

- `BASE` — `EE_TASARIM` ortam değişkeni ya da `http://127.0.0.1:3210`: `tasarim/` klasörünü sunan statik sunucunun adresi.
  Sayfa `BASE + '/tema-secimi.html?' + sorgu` diye açılır.
- `HEDEF` — `tasarim/ornekler/` (çıktı klasörü; yoksa oluşturulur).
- `PROFIL` — `araclar/chrome-profil-tema/`: tarayıcının geçici profil klasörü (ilk çalıştırma ekranları, eklentiler, çerezler
  senin profilinden ayrı kalsın). İş bitince silinir.
- `CHROME` — sırayla `C:\Program Files\Google\Chrome\Application\chrome.exe` ve
  `C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe` denenir, ilk var olan alınır.
- `ORNEKLER` — sekiz `[dosya adı, sorgu]` çifti. Yorumdaki kural: her renk yönü için bir açık bir koyu; yazı tipi ve köşe her
  yönün karakterine göre eşlendi.

  | Dosya | Renk yönü | Tema | Yazı tipi | Köşe | Hareket | Kutucuk |
  |---|---|---|---|---|---|---|
  | `A1-tugla-acik-plex-orta-sade` | tuğla | açık | IBM Plex | orta | hafif | sade |
  | `A2-tugla-koyu-plex-cok-sade` | tuğla | koyu | IBM Plex | çok | belirgin | sade |
  | `A3-tugla-acik-sistem-orta-dolu` | tuğla | açık | sistem | orta | hafif | dolu |
  | `B1-murekkep-acik-source-az-cizgili` | mürekkep | açık | Source | az | hafif | çizgili |
  | `B2-murekkep-koyu-source-orta-sade` | mürekkep | koyu | Source | orta | belirgin | sade |
  | `C1-muhur-acik-figtree-cok-sade` | mühür | açık | Figtree | çok | belirgin | sade |
  | `C2-muhur-koyu-figtree-cok-cizgili` | mühür | koyu | Figtree | çok | belirgin | çizgili |
  | `D1-tugla-acik-public-az-cizgili` | tuğla | açık | Public | az | hafif | çizgili |

### Ayarların anlamı (sayfadan)

Sayfa yalnız şu değerleri kabul eder (`IZINLI`); başka bir değer sessizce yok sayılır ve o ayar sayfanın varsayılanında (ya
da `localStorage`'daki son seçimde) kalır:

- `yon` — `tugla` (bugünkü tuğla kırmızısı, biraz derinleştirilmiş), `murekkep` (lacivert ana renk, kırmızı ikincil vurgu),
  `muhur` (bordo ve pirinç).
- `tema` — `acik`, `koyu`.
- `font` — `sistem` (0 KB, makinenin yazı tipi), `plex` (IBM Plex Sans), `source` (Source Sans 3 gövde + Source Serif 4
  başlık), `figtree` (Figtree gövde + Newsreader başlık), `public` (Public Sans).
- `kose` — `az` 6 px, `orta` 14 px, `cok` 22 px.
- `hareket` — `yok` 0 ms, `hafif` 150 ms, `belirgin` 280 ms geçiş.
- `kutu` — `dolu` (renkli dolu kutucuk), `sade` (beyaz kart, renk ikonda ve ince sol çizgide), `cizgili` (renkli çerçeve).

### İşlevler

- `chromeCalistir(args)` (iç) — tarayıcıyı `execFile` ile verilen bayraklarla çalıştırır; 60 saniye zaman aşımı, Windows'ta
  pencere gizli. Sonuç ne olursa olsun (hata, zaman aşımı) söz yerine getirilir; başarı dosyanın varlığından anlaşılır.
- Ana akış (adsız `async` işlev) — aşağıda.

Dışa açılan bir şey yok; `package.json`'da komutu yok.

## Kimle konuşur?

- **Çağırdıkları:** Node'un `fs`, `path`, `child_process.execFile`'ı; diskteki Chrome ya da Edge.
- **Açtığı sayfa:** `tasarim/tema-secimi.html` (depoda izlenir, belgesi yok). Sayfa, yazı tiplerini Google Fonts'tan
  (`fonts.googleapis.com`) indirir.
- **Gerektirdiği sunucu:** `tasarim/` klasörünü sunan herhangi bir statik sunucu; dosyanın yorumu
  `cd tasarim && python -m http.server 3210` önerir. Eğitim Evi sunucusu (`server.js`) `tasarim/`'ı sunmaz.
- **Yazdıkları:** `tasarim/ornekler/*.png` ve geçici `araclar/chrome-profil-tema/`; ikisi de `.gitignore`'da (depoya girmez).
- **Onu kullanan:** yok. Adı [belge/KILAVUZ.md](../belge/KILAVUZ.md)'nin klasör ağacında ("tema seçim sayfasının örnek
  görüntüleri") geçer.
- Veritabanına, API'ye, `data/`'ya dokunmaz.

## Nasıl çalışır (adım adım)?

```
1) cd tasarim && python -m http.server 3210        (ayrı bir pencerede açık kalsın)
2) node araclar/tema-ornekleri.js                  (proje kökünden; başka adres için EE_TASARIM=…)

CHROME yok → "Chrome ya da Edge bulunamadı." → çıkış 1
tasarim/ornekler/ oluştur
her ORNEKLER satırı için:
   tarayıcı --headless=new --disable-gpu --no-first-run --no-default-browser-check
            --user-data-dir=araclar/chrome-profil-tema --hide-scrollbars
            --virtual-time-budget=6000            (sanal 6 sn: yazı tipleri insin)
            --window-size=1400,1560 --screenshot=tasarim/ornekler/<ad>.png
            http://127.0.0.1:3210/tema-secimi.html?<sorgu>
   sayfa: önce localStorage'daki son seçimi (ee_tema_deneme), sonra adres satırını uygular → adres kazanır
   dosya var mı? → "  tamam <ad>.png  (N KB)"  ya da  "  HATA  <ad>.png"
profil klasörünü sil → "8 örnek -> <tasarim/ornekler yolu>"
```

Resim pencerenin kendisidir (1400×1560, tam sayfa değil): üstteki yaklaşık 300 piksel kontrol paneli (seçili düğmeler ve
"Şu anki seçim" satırı), gerisi örnek ekran. Panel sayfada yapışkan (`position: sticky`) olduğu için kaydırılsa da üstte
kalırdı; pencere yeterince uzun tutularak örnek ekranın büyük kısmı tek resme sığdırılmış. Dosyadaki yorum "Kontrol çubuğu
resme girmesin diye sayfa kendi başına yeterince yüksek çekiliyor; ilk 300 px laboratuvar başlığı, gerisi ekran" der.
Yorumun ikinci yarısının dediği gibi panel resmin üstünde görünür (2 Ekim'de `A1-…png` açılıp bakıldı); "girmesin" sözü,
panelin örnek ekranın üstüne binmemesi diye okunmalı.

## Dikkat!

- **Eski resim "tamam" sayılabilir.** Başarı yalnız dosyanın var olmasından anlaşılır ve araç çalışmadan önce eski PNG'yi
  silmez. Tarayıcı bir örnekte hata verir ya da zaman aşımına düşerse önceki çalıştırmadan kalan resim yerinde durur ve araç
  "tamam" yazar. Yeniden üretirken önce `tasarim/ornekler/`'i boşalt.
- **İnternet gerekir.** Yazı tipleri Google Fonts'tan gelir; bağlantı yoksa ya da 6 saniyelik sanal süre yetmezse resim yedek
  yazı tipiyle çekilir ve bunu hiçbir şey söylemez. Özellikle `plex`, `source`, `figtree`, `public` örneklerinde yazının
  doğru yazı tipinde olduğuna resme bakarak emin ol. (Sitenin kendisi yazı tiplerini `public/yazitipi/`'den, dışarıya
  gitmeden yükler; laboratuvar öyle değil.)
- **Yalnız Windows.** Tarayıcı yolları sabit iki Windows yoludur (`Program Files` altındaki Chrome, `Program Files (x86)`
  altındaki Edge). `Program Files (x86)`'e ya da yalnız kullanıcı için (`AppData`) kurulmuş Chrome, başka bir sürücü ya da
  Linux/macOS'ta, Edge de yoksa, araç "Chrome ya da Edge bulunamadı" der. Linux'ta çalıştırmak için `CHROME` listesine
  (ör. `/usr/bin/google-chrome`) yol eklemek gerekir.
- **"Hareket" resimde görünmez.** Geçiş süreleri (`hareket`) durağan bir resimde fark yaratmaz; sorguda yalnız panelin özet
  satırı doğru yazsın diye var. Hareketi karşılaştırmak için sayfayı tarayıcıda açıp tıklamak gerekir.
- **Profil sırası.** Sekiz örnek aynı geçici profili kullanır ve profil ancak en sonda silinir. Sayfa, tıklanan seçimi
  `localStorage`'a yazar; ama araç tıklamaz ve sayfa adres satırını `localStorage`'dan sonra uyguladığı için her örnek yine
  kendi ayarıyla çekilir. Araç yarıda kesilirse `araclar/chrome-profil-tema/` kalır; `.gitignore`'da olduğu için depoya girmez,
  elle silebilirsin.
- **Port 3210.** Bu proje 3000'i (kullanıcının sunucusu) ve 3200'ü (test sunucusu) kullanır; 3210 bunlarla çakışmaz. Statik
  sunucu yalnız `tasarim/`'ı sunmalı (yorumdaki gibi `cd tasarim` ile), proje kökünü değil — kökte `data/` var.
- **Resimler eski olabilir.** `tasarim/ornekler/`'deki sekiz PNG'nin tarihi 8 Eylül 2026 (18:47). `tasarim/tema-secimi.html`
  depoya parça parça girdi: 8 Eylül'deki altı commit (`commit 148`–`153`) üst paneli, stilleri ve betiği getirdi; örnek okul
  ekranının kendisi (`id="on"` taşıyan "sahne": yan menü, kutucuklar, sayaçlar…, 161 satır) ancak 26 Eylül'de
  `commit 369` ile geldi. Yani 8–26 Eylül arasında depodaki sayfanın betiği `on` öğesini bulamaz, laboratuvar çalışmazdı;
  resimler o gün bilgisayardaki tam sayfadan çekilmiş. Resimlerin bugünkü sayfayla birebir aynı olduğu denetlenmedi.
  Karşılaştırma yapacaksan önce yeniden üret.

## Testleri

- Otomatik test yok; tarayıcı ve internet ister.
- Elle: (1) `cd tasarim && python -m http.server 3210`; (2) proje kökünden `node araclar/tema-ornekleri.js`; sekiz satırın
  hepsi "tamam" olmalı, sonra `tasarim/ornekler/`'deki resimleri aç; üst paneldeki seçili düğmeler dosya adındaki ayarlarla
  aynı olmalı. Bu belge yazılırken araç çalıştırılmadı; 8 Eylül'de üretilmiş `A1-tugla-acik-plex-orta-sade.png` açıldı
  (1400×1560, 8 bit RGB; panelde Tuğla · açık · IBM Plex · orta · hafif · sade seçili).

## Son durum

- `git log --follow`: tek commit, `c3952e9 commit 146` (2026-09-08). Dosya o gün `tasarim/onizleme.html` ile birlikte eklendi
  ve o günden beri değişmedi. Laboratuvar sayfası `tasarim/tema-secimi.html` depoya bu araçtan sonra (`commit 148`–`153`)
  girdi; son commit'i `9040e1a commit 369` (2026-09-26; örnek okul ekranını ekledi, yalnız ekleme). Sayfanın adres satırı kuralı (`IZINLI` listesi) aracın gönderdiği sorgularla bugün de uyumlu;
  araç yine çalışmalı (koda bakılarak; denenmedi).
- Açık iş yok.
- Planlı işlerden ilgili olan: "Arayüz önizlemesi" — kullanıcının üç tasarım arasından seçmesi bekleniyor; seçilince bir
  "tasarım dili" tanımı yazılacak. O iş tema laboratuvarının yerini alabilir; o zaman bu araç da `tasarim/` ile birlikte
  gözden geçirilmeli (kaldırılması kullanıcıya sorulmalı).
