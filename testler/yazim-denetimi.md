# testler/yazim-denetimi.js

Sunucu kodundaki, ön yüz ve yönetim parçalarındaki, `public/index.html` ve `public/kvkk/kvkk.html`'deki tırnak içi metinlerde
sık yapılan 32 Türkçe yazım hatasını ve Türkçe harfi hiç olmayan şüpheli cümleleri arayan sunucusuz denetim.

## Bu dosya ne yapar?

Eğitim Evi'nin bütün arayüzü Türkçe ve herkese açık. "herşey", "yalnış", "klavuz" ya da Türkçe harfi unutulmuş "ogrenci"
gibi bir hata, ekranda ya da bir hata iletisinde göze batar. Ama kodun kendisi tanımlayıcılarda bilerek ASCII kullanır
(`ogrenci`, `mudur`, `odev`); bu yüzden düz bir "ogrenci" araması işe yaramaz. Bu dosya önce kodun içinden **kullanıcıya
görünecek gibi duran metinleri** (tırnak içinde, boşluk içeren, 10 karakterden uzun) ayıklar, sonra iki şeye bakar:

1. **Yaygın yazım hataları** — 32 kalıplık bir liste. Bulunursa `tumtest.sh` bunu "DENETIM SORUNU" sayar.
2. **Türkçe karaktersiz şüpheli metinler** — dört ya da daha çok uzun sözcüğü olup hiç `ç ğ ı ö ş ü` içermeyen cümleler.
   Bunlar yalnız listelenir (ilk 12'si), sonucu etkilemez: çoğu zaman doğrudur ("Bir ders 8 saatten uzun olamaz"), bazen de
   Türkçe harfi unutulmuş bir iletiyi gösterir.

`testler/tumtest.sh` onu en sonda, sunucusuz denetimlerin ikincisi olarak çalıştırır.

## İçinde neler var?

Dışa açılan bir şey yok; yukarıdan aşağı çalışan bir betik.

### Taranan dosyalar (`DOSYALAR`)

- `sunucuDosyalari()` — `sunucu/` altındaki bütün `.js` dosyaları (alt klasörler dahil).
- `public/js/parcalar/*.js` (ad sırasıyla), `public/js/yonetim/*.js` (klasör varsa), `public/index.html`,
  `public/kvkk/kvkk.html`. Olmayan dosya sessizce atlanır.

### Metin toplama

- `metinleriTopla(icerik)` — tek ya da çift tırnak içindeki, satır sonu içermeyen, en az 10 karakterlik dizileri toplar.
  Elenenler: yalnız küçük harf ve tireden oluşanlar (CSS sınıfı, eylem adı), `/api/` ya da `./` ile başlayanlar (yol), `<`,
  `>`, `#`, `.`, `[`, `]` ile başlayanlar (seçici, HTML), boşluk içermeyenler, art arda üç harfi olmayanlar. Her metin konumuyla
  döner.
- `SQL_KELIME` / `sqlMi(metin)` — `SELECT`, `WHERE`, `ORDER BY`, `ON CONFLICT`… içeren metin SQL'dir, kullanıcıya görünmez;
  iki bölümde de atlanır.
- `satirNo(icerik, konum)` — rapor için satır numarası (dosyanın kendisinden sayılır, doğrudur).

### 1. bölüm: `HATALAR` (yanlış → doğru)

| Yanlış (düzenli ifade) | Doğru | Not |
|---|---|---|
| `yapabilirsin?z` | yapabilirsiniz | `?` önündeki `n`'yi isteğe bağlı yapar: "yapabilirsiz" ve "yapabilirsinz" yakalanır, doğru yazım "yapabilirsiniz" yakalanmaz (amaçlandığı gibi) |
| `seçin?iz` | seçiniz | aynı mantıkla "seçiiz"i yakalar ama "seçiniz"in **kendisini** de yakalar ("Dikkat!") |
| `herbir`, `hiçbirşey`, `birşey`, `herşey`, `bir kaç`, `heryer` | her bir, hiçbir şey, bir şey, her şey, birkaç, her yer | bitişik/ayrı yazım |
| `yalnış`, `yanlız`, `orjinal`, `döküman`, `klavuz`, `kordinat`, `makina`, `adress` | yanlış, yalnız, orijinal, doküman, kılavuz, koordinat, makine, adres | |
| `hiçbiri̇` (sondaki `i`'nin üstünde birleşik nokta, U+0307) | hiçbiri | büyük `İ`'nin JavaScript'te küçültülmesiyle oluşan bozuk harf |
| `dahil?i etmek`, `aksesuar` | `-` | düzeltme önerisi yok, yalnız işaretlenir |
| `e mail`, `email`, `mail adresi` | e-posta, e-posta, e-posta adresi | |
| `şifreni?z? yanlıs` | şifren yanlış | |
| `giris yap` | giriş yap | |
| `ogrenci`, `ogretmen`, `mudur`, `sinif`, `odev`, `sinav`, `basari`, `devamsizlik` | öğrenci, öğretmen, müdür, sınıf, ödev, sınav, başarı, devamsızlık | Türkçe harfi unutulmuş sözcük |

- `KOD_KELIMELERI` — `ogrenci`, `ogretmen`, `mudur`, `sinif`, `odev`, `sinav`, `basari`, `devamsizlik`, `email`: bunlar kodda
  tanımlayıcı olarak meşrudur; yalnız metnin içinde **en az bir Türkçe harf** varsa (yani metin gerçekten Türkçe bir cümleyse)
  hata sayılır.
- Eşleşme: `(^|[\s>(])` + kalıp + `([\s<).,!?:]|$)`, büyük/küçük harf duyarsız (`i`). Her metinde ilk bulunan hatada durur
  (bir metin için tek kayıt). Rapor: `  <dosya>:<satır>`, `     "<yanlış>" -> "<doğru>"`, metnin ilk 80 karakteri.

### 2. bölüm: Türkçe karaktersiz şüpheli metinler

Metindeki boşlukla ayrılmış sözcüklerden yalnız harften oluşan ve en az 4 harfli olanlar sayılır; 4 ya da daha çoksa, metinde
hiç Türkçe harf yoksa, "Büyük Harfle Başlayan Özel Ad" kalıbına uymuyorsa, `< > { } = ;` içermiyorsa ve SQL değilse şüphelidir.
İlk 12'si `  <dosya>:<satır>  <metin>` olarak yazılır, kalanı `... ve N tane daha`.

### Sonuç

Son satır: `  N yazim hatasi, M supheli metin`. Dosya `process.exit` çağırmaz: çıkış kodu **her zaman 0**'dır.

### 3 Ekim'deki çıktı

Bu belge yazılırken çalıştırıldı: `yaygin yazim hatasi bulunamadi`; 24 şüpheli metin (12'si yazıldı: ör. `islem-kaydi.js`'teki
"Uygunsuz kelimeli yorum reddedildi", `odev-dosya.js`'teki uzantı listeleri, `okul.js`'te üç kez "Bir ders 8 saatten uzun
olamaz", `index.js`'teki "Sunucu Turkiye saatinde degil" konsol uyarısı, `okullar.js`'te "TOBB Yavuz Selim Ortaokulu",
`ortak.js`'teki ayrılmış adres adları listesi); son satır `0 yazim hatasi, 24 supheli metin`.

## Kimle konuşur?

- **Çağırdıkları:** yalnız Node'un `fs` ve `path`'i; projeden hiçbir modül `require` etmez.
- **Taradığı dosyalar:** `sunucu/**/*.js` (kullanıcıya giden `bad(res, '…')` iletileri, bildirim metinleri, e-posta
  gövdeleri — ör. [../sunucu/bolumler/kayit.md](../sunucu/bolumler/kayit.md), [../sunucu/yardimci/eposta.md](../sunucu/yardimci/eposta.md)),
  ön yüz parçaları (ör. [../public/js/parcalar/03-mesaj-modal.md](../public/js/parcalar/03-mesaj-modal.md),
  [../public/js/parcalar/10b-hesaplar.md](../public/js/parcalar/10b-hesaplar.md)), yönetim parçaları
  ([../public/js/yonetim/09-yonetici.md](../public/js/yonetim/09-yonetici.md) ve öbürleri), `public/index.html`,
  `public/kvkk/kvkk.html`.
- **Onu çalıştıran:** `testler/tumtest.sh` (sunucusuz denetimler döngüsü: `buton-denetimi`, `yazim-denetimi`, `sql-denetimi`).
  Son iki satırı gösterir; çıkış kodu 0 olduğu için sorunu çıktıdan anlar: `[1-9][0-9]* yazim hatasi` geçiyorsa
  `DENETIM_SORUN`'u bir artırır.
- **Onu anan belgeler:** [../TANITIM.md](../TANITIM.md) "Testler ve denetimler"; ön yüz ve yönetim parçalarının belgelerindeki
  "Testleri" bölümleri (ör. [../public/js/parcalar/25-tiklama.md](../public/js/parcalar/25-tiklama.md),
  [../public/js/yonetim/09b-site-ayarlari.md](../public/js/yonetim/09b-site-ayarlari.md)); taranmadığını söyleyenler:
  [../public/js/belge.md](../public/js/belge.md), [../public/js/tema.md](../public/js/tema.md), [../public/js/indir.md](../public/js/indir.md),
  [../araclar/gezinti-metin.md](../araclar/gezinti-metin.md); ayrıca `belge/KILAVUZ.md`.

## Nasıl çalışır (adım adım)?

```
DOSYALAR (sunucu/**, parcalar, yonetim, index.html, kvkk.html)
  her dosya ─► metinleriTopla ─► SQL değilse
       1) HATALAR'dan her kalıp: kod sözcüğüyse ve metinde Türkçe harf yoksa geç
          eşleşti ─► rapora ekle, bu metinde dur
  rapor boş mu ─► "yaygin yazim hatasi bulunamadi" ya da dosya:satır listesi
  her dosya ─► metinleriTopla
       2) ≥4 uzun ASCII sözcük, Türkçe harf yok, özel ad değil, kod değil, SQL değil ─► şüpheli (ilk 12 yazılır)
  "N yazim hatasi, M supheli metin"   (çıkış 0)
tumtest: "[1-9]… yazim hatasi" ─► DENETIM SORUNU
```

## Dikkat!

- **Çıkış kodu hep 0.** Elle ya da başka bir betikten çalıştırırken sonucu çıkış koduna bakarak değil, son satırdaki
  `N yazim hatasi`'na bakarak anla. `tumtest.sh` öyle yapar.
- **HTML dosyalarında sayfa metni taranmaz.** Yalnız tırnak içindeki diziler toplandığı için `public/kvkk/kvkk.html`'de ve
  `public/index.html`'de etiketlerin arasındaki asıl metin (paragraflar, başlıklar) denetime girmez; yalnız `title=`,
  `aria-label=`, `content=` gibi öznitelik değerleri ve metin içinde tırnakla yazılmış bölümler girer. 3 Ekim'de ölçüldü
  (betik, stil ve etiketler atılıp boşluklar tekleştirilerek): `kvkk.html`'in sayfa metni yaklaşık 21 000 karakterken denetimin
  topladığı diziler toplam 795 karakter (43 dizi); `index.html`'de yaklaşık 24 600 karaktere karşı 3 730 karakter (235 dizi).
  Yani aydınlatma metninin gövdesi bu denetimle korunmuyor. Kod değiştirilmedi.
- **Başka kapsam dışı yerler.** `public/js/belge.js`, `indir.js`, `tema.js`, `public/sw.js`, `public/404.html`,
  `public/kosullar/kosullar.html`, `public/indir/indir.html`, `public/okul-bulunamadi.html`, `belge/KILAVUZ.md`, `araclar/`,
  `testler/` ve Android uygulaması taranmaz. Ters tırnaklı şablon metinler, 10 karakterden kısa ve tek sözcüklük metinler de
  atlanır.
- **`seçin?iz` kalıbı doğru yazımı da yakalar.** Düzenli ifadede `n?` "n olsun ya da olmasın" demektir; kalıp hem "seçiiz"
  yazım hatasını hem de "seçiniz"in kendisini yakalar ve önerdiği doğru da yine "seçiniz"dir. Bir metinde "seçiniz" geçerse rapor
  `"seçin?iz" -> "seçiniz"` der ve `tumtest` bunu DENETIM SORUNU sayar (pratikte "siz" diliyle yazılmış bir iletiyi işaretlemiş
  olur; proje "sen" dili kullanır, bugün böyle bir metin yok). Benzer görünen `yapabilirsin?z` ise doğru çalışır: orada `n?`'den
  sonra `iz` değil yalnız `z` geldiği için doğru yazım kalıba uymaz; kalıp "yapabilirsiz" ve "yapabilirsinz"i yakalar,
  "yapabilirsiniz"e dokunmaz. 3 Ekim'de düzenli ifadelerle denendi. Kod değiştirilmedi.
- **Büyük harf duyarsızlığı Türkçe `İ`'yi tanımaz.** "HERŞEY" yakalanır ama "HİÇBİRŞEY" yakalanmaz (`i` bayrağı `İ`'yi `i`
  saymaz).
- **ASCII cümledeki kod sözcükleri kaçar.** Metinde hiç Türkçe harf yoksa `ogrenci`, `odev` gibi sözcükler 1. bölümde hata
  sayılmaz; böyle bir ileti ancak 2. bölümde (yeterince uzunsa) şüpheli olarak görünür.
- **2. bölüm yalnız uyarıdır** ve doğru Türkçe cümleleri de listeler ("Bir ders 8 saatten uzun olamaz" Türkçe harf içermediği
  için). `tumtest.sh` yalnız son satırı gösterdiğinden bu liste orada görünmez.
- Rapordaki dosya yolları işletim sisteminin ayıracıyla yazılır (Windows'ta `sunucu\bolumler\okul.js`).
- **Belgeler etkilemez.** Yalnız `.js` dosyaları ve iki HTML dosyası okunur; parça klasörlerindeki `.md`'ler denetime girmez.

## Testleri

- Kendisi bir denetim. Koruduğu dosyalar: `sunucu/**/*.js`, `public/js/parcalar/*.js`, `public/js/yonetim/*.js` içindeki
  tırnaklı metinler; `public/index.html` ve `public/kvkk/kvkk.html`'in tırnaklı bölümleri.
- Elle (proje kökünde, sunucu gerekmez): `node testler/yazim-denetimi.js` → sonda `0 yazim hatasi, … supheli metin`.
  Denemek istersen bir parçadaki bir iletiye geçici olarak "herşey" yaz: `"herşey" -> "her şey"` satırı ve
  `1 yazim hatasi` görmelisin (geri al).

## Son durum

- `git log`: 5 commit. `5510e0e commit 138`, `2fbc6f7 commit 139`, `042eabc commit 140` (2026-08-29) dosyayı üç adımda
  kurdu: tarama, hata listesi ve 1. bölüm (138); raporun yazılması ve 2. bölüm (139); son özet satırı
  `N yazim hatasi, M supheli metin` (140).
- `b6bfc03 commit 517` (2026-09-27, sayfa klasörleri): aydınlatma metninin yolu `public/kvkk.html` → `public/kvkk/kvkk.html`.
- `276c0a0 commit 521` (2026-09-27, gizli `/admin`): yönetim ön yüzü parçaları (`public/js/yonetim/*.js`) taramaya eklendi.
  O günden beri değişmedi.
- Bilinen açıklar (kod değiştirilmedi): HTML sayfa metninin taranmaması, doğru yazımı da yakalayan `seçin?iz` kalıbı,
  büyük `İ`'li sözcüklerin kaçması, çıkış kodunun hep 0 olması.
- Planlı işlerden etkileyecekler: "Çok dil" — Türkçe kaynak metinler `c()` kataloğuna taşınınca denetim katalog dosyasını da
  taramalı (yoksa metinlerin çoğu kapsam dışına çıkar); "KVKK ve onay metinleri tam denetimi" — aydınlatma metninin gövdesi
  bugün bu denetimle korunmadığı için o işte ayrıca okunmalı; "Sistem" (site duyurusu, Yardım, Yenilikler) ve "Destek
  talepleri" yeni kullanıcı metinleri getirecek.
