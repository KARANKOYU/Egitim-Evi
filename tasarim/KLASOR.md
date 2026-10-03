# tasarim/KLASOR.md

Tasarım denemelerinin klasörü: sitenin görünüşü seçilirken yazılmış, 8–26 Eylül arasında depoya giren iki tek başına HTML sayfası —
`tema-secimi.html` (renk, yazı tipi, köşe, hareket ve kutucuk seçme laboratuvarı) ve `onizleme.html` (henüz kodlanmamış
ekranların çizimi); uygulamaya girmez, sunucu bu klasörü sunmaz.

## Bu dosya ne yapar?

Eylül başında (ilk commit'ler 8 Eylül'de) iki soru vardı: site nasıl görünsün (ana renk, yazı tipi, köşeler, kutucuklar) ve sıradaki ekranlar
(giriş, devamsızlık, işlem kaydı, gün gün ders programı…) nasıl dizilsin. Kod yazmadan önce kullanıcıya göstermek ve
seçtirmek için bu klasördeki iki sayfa yazıldı:

- `tema-secimi.html` — tek başına açılan bir **tema laboratuvarı**. Üstte koyu bir kontrol paneli, altında örnek bir öğretmen
  ana sayfası; bir düğmeye basınca örnek ekran anında değişir. "Şu anki seçim" satırı seçimi tek cümleyle yazar ("— beğendiğini
  söyle, uygulamaya onu geçireyim").
- `onizleme.html` — "Tasarım Önizlemesi": on ekranın elle yazılmış, tıklanmayan çizimi; yedisinin altında kullanıcıya not
  (`.not`; ör. "Çizimindeki düzen…", "istersen kaldırırım"); 5, 7 ve 8. bölümlerde not yok.

İkisi de uygulamanın parçası değildir: sunucu yalnız `public/` klasörünü sunar ([../sunucu/yollar.md](../sunucu/yollar.md),
`PUB`), `tasarim/` hiçbir adresten açılmaz. Tarayıcıda diskten ya da ayrı bir statik sunucuyla açılır.

Klasörde depoda izlenmeyen bir alt klasör de durur: `tasarim/ornekler/` (`.gitignore`'da). Laboratuvarın sekiz hazır ayarla
çekilmiş ekran görüntüleri oradadır; [../araclar/tema-ornekleri.md](../araclar/tema-ornekleri.md)'deki araç üretir.

## İçinde neler var?

### `tema-secimi.html` (776 satır, ~36 KB)

**Dış kaynak:** yazı tipleri Google Fonts'tan çekilir (`fonts.googleapis.com`: IBM Plex Sans, Source Sans 3, Source Serif 4,
Figtree, Newsreader, Public Sans). Dosyanın yorumu da söyler: önizleme içindir; uygulamada yazı tipleri `public/yazitipi/`'de
durur, dışarıya istek gitmez. Yani sayfa internet ister.

**Kontrol paneli** (`.lab`, yapışkan, temadan bağımsız nötr gri). Altı ayar grubu (`.secenekler[data-ayar]`, düğmeler
`button[data-deger]`, seçili olan `aria-pressed="true"`), her birinin altında seçimin açıklaması:

| Ayar (`data-ayar`) | Seçenekler (`data-deger`) | Ne değişir |
|---|---|---|
| `yon` — Renk yönü | `tugla` (A · Tuğla), `murekkep` (B · Mürekkep), `muhur` (C · Mühür) | ana renk takımı: tuğla kırmızısı / lacivert + kırmızı vurgu / bordo + pirinç |
| `tema` | `acik`, `koyu` | her yönün açık ve koyu takımı (not: "Uygulamada üçüncü seçenek olarak Sistem de olacak") |
| `font` — Yazı tipi | `sistem`, `plex`, `source`, `figtree`, `public` | gövde ve başlık yazı tipi (Source'ta başlık Source Serif 4, Figtree'de başlık Newsreader) |
| `kose` — Köşe yuvarlaklığı | `az` (6 px), `orta` (14 px), `cok` (22 px) | `--r`, `--r-kucuk`, `--r-buyuk` |
| `hareket` | `yok` (0 ms), `hafif` (150 ms), `belirgin` (280 ms) | `--sure` (geçiş süresi), `--egri`, `--kalkis` (kartın üzerine gelince kalkma payı: 0, 1, 3 px); her seçimde içerik bu süreyle sırayla yeniden belirir |
| `kutu` — Kutucuk stili | `dolu`, `sade`, `cizgili` | ana sayfa kutucukları: renkli zemin / beyaz kart + ince renkli sol çizgi / renkli kenarlık |

**Örnek ekran** (`#on`, bütün ayarlar bu öğenin `data-yon`, `data-tema`, `data-font`, `data-kose`, `data-hareket`, `data-kutu`
nitelikleri; başlangıç `tugla · acik · sistem · orta · hafif · dolu`): yan menü (Ana Sayfa, Mesajlar, Takvim, Ders Programım,
Ödevler, Sınavlar, Yoklama, Ayarlar, Çıkış), üst çubuk (arama, bildirim rozeti), karşılama başlığı, dört kutucuk, üç sayaç,
"Aktif ödevler" listesi (etiketler, düğmeler), "Derslere göre ödev durumu" yığılı sütun grafiği ve göstergesi, "Yeni ödev" formu,
alt bilgi. Hepsi sayfanın kendi CSS'iyle (renk değişkenleri `--marka`, `--zemin`, `--kart`, `--yazi`, `--soluk`, `--cizgi`,
`--yesil`, `--kirmizi`, `--turuncu`, `--mavi`…) çizilir; sitenin stil dosyası yüklenmez. Simgeler sayfanın başındaki gizli SVG
`<symbol>` havuzundan (`#i-ev`, `#i-posta`, `#i-takvim`…) gelir.

**Betik** (sayfanın içinde, ES5):

- `ACIKLAMA` — her seçeneğin kısa açıklaması (ör. Plex için "kurumsal, net, rakamları çok okunaklı. ~55 KB"); `yazAciklama`
  bunları panele yazar.
- `AD` ve `ozetle` — "Şu anki seçim: Tuğla · açık · Sistem fontu · orta yuvarlak · hafif hareket · dolu kutucuk".
- `isaretle` — seçili düğmelerin `aria-pressed`'i, açıklamalar, özet.
- Tıklama — `button[data-deger]` → `#on`'un ilgili niteliği değişir, `yenile` sınıfıyla içerik yeniden belirir; seçim
  `localStorage` `ee_tema_deneme`'ye yazılır.
- Açılışta önce `ee_tema_deneme` (son bakılan ayarlar), sonra adres satırı uygulanır: `?yon=muhur&tema=koyu&font=figtree&kose=cok&hareket=belirgin&kutu=sade`.
  Yalnız `IZINLI` listesindeki değerler kabul edilir; adres satırı kazanır. Bu, hem paylaşmak hem de toplu ekran görüntüsü için.

### `onizleme.html` (830 satır, ~32 KB)

Başlık "Tasarım Önizlemesi", alt yazı "Bu ekranlar henüz kodlanmadı — nasıl görüneceğini gösteriyor." Betiği yoktur; bütün
kutular `readonly` ya da `disabled`, düğmeler bir şey yapmaz. Adlar, sınıflar ve sayılar örnektir.

Görünüşü için **sitenin stil dosyasını** ister: `<link rel="stylesheet" href="/css/style.css">` — `.field`, `.btn`, `.kart`,
`.satir`, `.etiket`, `.stat`, `.grid.k4`, `.filtre-satir`, `.tablo-sar`, `table.t`, `.msg.bilgi`, `.bot-satir`, `.onay` gibi
sınıflar oradan gelir. Üstüne yalnız bu sayfaya ait bir `<style>` koyar (`.onizleme`, `.bolum`, `.bolum-baslik`, `.cerceve`,
`.not`, giriş sekmeleri `.tabs-yeni`/`.tab-yeni`, hap düğme `.btn.hap`, ders programı `.prog-ust`, `.gun-gezgin`, `.gun-noktalar`,
`.nokta`, `.ders-sutunlar`, `.ders-sutun` ve `.cakisma`, `.simdi`, `.bos-saat`, `.ekle` hâlleri).

Bölümler (dosyadaki sırayla; numaralar sayfanın kendi numaraları):

| No | Başlık | Ne gösteriyor |
|---|---|---|
| 1 | Giriş ekranı | Kullanıcının çizimine göre: hap biçimli "Kayıt Ol / Giriş Yap" sekmeleri, "Kullanıcı Adı / gmail" ve şifre, robot sorusu, "Beni hatırla" / "Bilgilerimi bu cihaza kaydetme", yan yana "Giriş Yap" ve "Şifremi unuttum" |
| 2 | Şifremi unuttum | e-posta ile sıfırlama; okulun açtığı e-postasız hesap için "okul yönetiminden iste" |
| 3 | Öğrenci arama | müdür ve öğretmen için ad/sınıf/durum süzgeci ve sonuç satırları ("Türkçe karakter esnek") |
| 4 | Özel roller | rol adı + yetki kutuları, tanımlı roller listesi |
| 5 | Devamsızlık | öğretmenin yoklaması (Geldi, Gelmedi, İzinli, Geç) ve velinin devamsızlık görünümü |
| 6 | İşlem kaydı | kim, işlem türü, tarih süzgeci ve kayıt satırları ("Kayıtlar silinemez, sadece okunur") |
| 7 | Excel / CSV aktarım ve yedekleme | şablon indir/yükle, örnek tablo, ders programı aktarımı, otomatik yedek listesi |
| 9 | Ders programı — gün gün | `.ods` çizimine göre: gün gezgini, gün noktaları, ders sütunları, çakışma uyarısı, "Ders ekle" |
| 10 | Öğretmenin kendi programı | aynı düzen, sınıf adıyla, "şimdi" etiketi, boş saat |
| 8 | Mesajlaşma | çoklu alıcı (sınıf, rol, kişi), konu/mesaj, gelen kutusu, "Bana kim yazabilir" |

### `ornekler/` (depoda yok, yalnız bu bilgisayarda)

`.gitignore`'daki `tasarim/ornekler/` kuralıyla depoya girmez. İçinde 8 PNG (her biri yaklaşık 146–168 KB, 8 Eylül 2026 18:47
tarihli):
`A1-tugla-acik-plex-orta-sade.png`, `A2-tugla-koyu-plex-cok-sade.png`, `A3-tugla-acik-sistem-orta-dolu.png`,
`B1-murekkep-acik-source-az-cizgili.png`, `B2-murekkep-koyu-source-orta-sade.png`, `C1-muhur-acik-figtree-cok-sade.png`,
`C2-muhur-koyu-figtree-cok-cizgili.png`, `D1-tugla-acik-public-az-cizgili.png`. Ad, ayarları sırasıyla söyler (yön, tema,
yazı tipi, köşe, kutucuk). Resimler bu belge için açılmadı; ne gösterdikleri [../araclar/tema-ornekleri.md](../araclar/tema-ornekleri.md)'de.

## Kimle konuşur?

- **`tema-secimi.html`'i açan araç:** [../araclar/tema-ornekleri.md](../araclar/tema-ornekleri.md) — sayfayı
  `http://127.0.0.1:3210/tema-secimi.html?<sorgu>` adresinden (`tasarim/` klasörünü sunan ayrı bir statik sunucu; aracın yorumu
  `cd tasarim && python -m http.server 3210` önerir) sekiz ayarla ekransız Chrome/Edge'de açıp `tasarim/ornekler/<ad>.png`
  çeker. Sayfanın `IZINLI` listesi aracın sorgularıyla uyumludur.
- **`onizleme.html`'i kullanan:** depoda yok (hiçbir kod ya da araç adını anmıyor; `git grep`, 3 Ekim). Sitenin
  `/css/style.css`'ine bağlıdır, yani o adresi veren bir sunucudan açılmazsa stilsiz görünür (aşağıda "Dikkat!").
- **Eğitim Evi sunucusu:** bu klasörü sunmaz; `sunucu/http.js` yalnız `public/` altına bakar ([../sunucu/http.md](../sunucu/http.md)).
- **Sitenin bugünkü görünüşüyle bağı:** seçimin sonucu `public/css/parcalar/00-temel.css` ve `public/yazitipi/`'dedir
  ([../public/css/parcalar/CSS.md](../public/css/parcalar/CSS.md), [../public/yazitipi/KLASOR.md](../public/yazitipi/KLASOR.md)).
  Laboratuvarın seçeneklerinden birinin birebir kopyası değildir: bugün gövde IBM Plex Sans, başlık Newsreader (laboratuvarda
  Plex seçeneğinin başlığı da Plex, Newsreader yalnız Figtree seçeneğinin başlığı); köşeler laboratuvarın "Çok" değerleriyle
  aynı (`--r: 22px`, `--r-kucuk: 14px`); ana renk `--ana: #d62839` (laboratuvarın tuğlası `--marka: #B3272D`).
  `onizleme.html`'deki gün gün ders programı düzeni sonradan uygulamaya girdi: `ders-sutun`, `gun-gezgin` sınıfları bugün
  `14-ders-programi.css`'te.
- **Adı geçen belgeler:** `belge/KILAVUZ.md`'nin klasör ağacı ("tasarım denemeleri (uygulamaya girmez)"; içinde yalnız
  `tema-secimi.html` ve `ornekler/` yazılı), kök `TANITIM.md`.
- Veritabanına, API'ye, `data/`'ya dokunmaz.

## Nasıl çalışır (adım adım)?

```
tema-secimi.html (internet gerekir: Google Fonts)
   açılış ─► localStorage ee_tema_deneme varsa uygula ─► adres satırındaki ?yon=…&tema=… (IZINLI) uygula
          ─► isaretle(): düğmeler aria-pressed, açıklamalar, "Şu anki seçim"
   düğmeye bas ─► #on[data-<ayar>] = <değer> ─► CSS değişkenleri değişir (ekran anında yeni hâline geçer)
               ─► .yenile: içerik sırayla yeniden belirir ─► seçim localStorage'a

araclar/tema-ornekleri.js (toplu görüntü)
   cd tasarim && python -m http.server 3210   (ayrı pencere)
   node araclar/tema-ornekleri.js ─► 8 × ekransız tarayıcı ─► tasarim/ornekler/A1-….png … D1-….png

onizleme.html
   /css/style.css'i veren bir sunucudan açılınca: sitenin bileşenleriyle on ekranın durağan çizimi
```

## Dikkat!

- **Uygulamaya girmez, web'de yok.** Burada değiştirdiğin hiçbir şey siteyi değiştirmez; site görünüşü `public/css/parcalar/`'dadır.
- **`onizleme.html` tek başına stilsiz görünür.** `href="/css/style.css"` kök adresidir: dosyayı diskten açarsan tarayıcı diskin
  kökünde arar; `tasarim/`'ı sunan basit bir sunucuda da `/css/style.css` yoktur; Eğitim Evi sunucusu da `tasarim/`'ı sunmaz.
  Görmek için sitenin stilini aynı adresten veren bir yerden açmak gerekir. Bugün nasıl açıldığı depoda yazılı değil (koddan
  çıkarım; açılıp denenmedi).
- **İkisi de eski.** Laboratuvarın renkleri ve `onizleme.html`'deki ekranlar 8–26 Eylül'ün hâlidir; o günden beri site çok değişti
  (giriş sekmeleri `.tabs-yeni` değil `.kayan-sekme`, renkler, roller, servis…). Bugünkü görünüşün kaynağı olarak kullanma.
- **`tema-secimi.html`'de satır içi betik var.** Eğitim Evi sunucusunun güvenlik başlığı (`script-src 'self'`) bunu çalıştırmazdı;
  sayfa bu yüzden yalnız ayrı bir statik sunucuda ya da diskten çalışır. Bu sayfayı `public/`'e taşırsan betik çalışmaz,
  dışarıdan yazı tipi de yüklenmez (`font-src 'self' data:`).
- **Statik sunucu yalnız `tasarim/`'ı sunmalı.** Proje kökünü sunarsan `data/` (ayarlar, şifreler) de açılır; aracın önerdiği gibi
  `cd tasarim` ile başlat. 3000 (kullanıcının sunucusu) ve 3200 (testler) değil, 3210.
- **`ornekler/` resimleri eski olabilir ve depoda yok.** Başka bir bilgisayarda bu klasör boştur; karşılaştırma için aracı yeniden
  çalıştır (önce klasörü boşalt: araç eski resmi silmez, hata olsa da "tamam" sayabilir).
- **Dosyalar parça parça girdi.** Her iki dosyanın bütün commit'leri yalnız ekleme (silme yok); bir ara commit'te sayfa yarımdır
  (ör. `tema-secimi.html`'in örnek ekranı `#on` ancak `commit 369`'da geldi, ondan önceki commit'lerde betik `on`'u bulamaz).
  Geçmişten bir sürüm açacaksan son commit'i al.

## Testleri

- Otomatik test yok: iki sayfa da uygulamanın parçası değil; testler ve denetimler (`buton-denetimi`, `yazim-denetimi`) bu klasöre
  bakmaz.
- Klasör belgesi denetimi: `node .claude/gelistirme/betikler/belge-denetle.js --haritasiz --klasor tasarim` (yerel betik) bu
  belgede iki dosyanın da adının geçtiğine bakar.
- Elle: `tema-secimi.html`'i tarayıcıda aç (internet açık), her ayar grubunda bir düğmeye bas; örnek ekran ve "Şu anki seçim"
  değişmeli; adres satırına `?yon=muhur&tema=koyu` ekleyip yenile, panel o seçimi göstermeli. Toplu görüntü için
  [../araclar/tema-ornekleri.md](../araclar/tema-ornekleri.md)'deki iki adım. `onizleme.html` için yukarıdaki stil notuna bak.

## Son durum

- `tema-secimi.html`: 7 commit, hepsi yalnız ekleme. `9cbeff2 commit 148` (2026-09-08, 414 satır: stiller), `064f7c8 commit 149`
  (kontrol paneli ve ilk üç ayar), `4dc1888 commit 150` (köşe), `4883f82 commit 151` (hareket), `a6e651b commit 152` (kutucuk),
  `108d7ef commit 153` (betik ve sayfa sonu); son değişiklik `9040e1a commit 369` (2026-09-26): örnek ekranın kendisi (`#on`
  "sahne": yan menü, kutucuklar, sayaçlar, liste, grafik, form; 161 satır).
- `onizleme.html`: 7 commit, hepsi yalnız ekleme. `c3952e9 commit 146` (2026-09-08: baş kısmı ve stiller), `921f03b commit 147`
  (1, 2, 5, 6. bölümler), `9cbeff2 commit 148` (9 ve 10), `17c6b7e commit 196` (2026-09-25: 7), `8b33695 commit 287` (8 ve sayfa
  sonu), `d268dea commit 355` (2026-09-26: 4 "Özel roller"); son değişiklik `2742705 commit 373` (2026-09-26): 3. bölüm
  "Öğrenci arama" (süzgeç ve üç sonuç satırı, 56 satır).
- Açık işler: `belge/KILAVUZ.md`'nin klasör ağacında `onizleme.html` yok (o belgenin işi; bu klasöre dokunmaz). Kullanıcının
  bekleyen kararlarında, depo köküne grup arkadaşının yüklediği logo önerisi resminin `tasarim/logo-onerileri/` altına
  taşınması önerildi (karar bekliyor; taşınırsa bu belge o klasörü de anlatmalı).
- Planlı işlerden ilgili olan: "Arayüz önizlemesi" — yeni tasarım önizlemeleri (üç tasarım) bu klasörde değil, yerel geliştirme
  klasöründe tutuluyor; kullanıcı birini seçince bir "tasarım dili" tanımı yazılacak. O iş bu klasördeki eski laboratuvarın ve
  önizlemenin yerini alabilir; kaldırılmaları kullanıcıya sorulmalı.
