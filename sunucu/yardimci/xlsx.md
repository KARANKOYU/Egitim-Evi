# sunucu/yardimci/xlsx.js

Excel (.xlsx) okuma ve yazma, dışarıdan hiçbir paket kullanmadan: zip kabuğunu ve içindeki XML'i elle kurar ve çözer; sıkıştırmayı
Node'un kendi `zlib`'i yapar.

## Bu dosya ne yapar?

Okul müdürü öğrenci/servisçi listesini ya da ders programını Excel'den yükler, listeleri Excel olarak indirir. Projenin tek
bağımlılığı `pg` olduğu için bir Excel paketi yok; bu dosya işi kendisi yapar.

Yeni gelen biri için: bir **.xlsx dosyası aslında bir ZIP arşividir**. Uzantısını `.zip` yapıp açarsan içinde XML dosyaları
görürsün:

```
[Content_Types].xml          hangi parça hangi tür
_rels/.rels                  kök ilişki: "asıl belge xl/workbook.xml"
xl/workbook.xml              sayfaların adları ve kimlikleri (r:id)
xl/_rels/workbook.xml.rels   r:id → sayfa dosyasının yolu
xl/worksheets/sheet1.xml     bir sayfanın hücreleri (<c r="B7" t="s"><v>3</v></c>)
xl/sharedStrings.xml         ortak metin tablosu: hücre yalnız sıra numarasını tutar
xl/styles.xml                yazı tipi, dolgu, kenarlık
```

ZIP de basit bir kaptır: her dosya için bir "yerel başlık" + (sıkıştırılmış) veri; sonda bütün dosyaları listeleyen "merkezî dizin"
ve en sonda dizinin yerini söyleyen "dizin sonu kaydı" (EOCD). Okurken sondan başlanır: EOCD bulunur, dizin okunur, her dosyanın
verisi yerel başlığından sonra açılır.

## İçinde neler var?

### Okuma

- **`oku(buf)`** → `[{ ad, satirlar: [[metin, …], …] }]`. Bütün hücre değerleri METİNDİR:
  - metin hücresi (`t="s"` ortak tablo, `t="inlineStr"`, `t="str"` formül sonucu) → metnin kendisi (boşlukları KIRPILMAZ);
  - sayı (`t="n"` ya da türsüz) → XML'deki yazılışı (`'85'`, `'3.5'`, `'12345678950'`);
  - tarih → Excel'in gün sayısı (`'41041'`); çözmek çağıranın işi (`sunucu/ortak.js` `tarihCoz` 1899-12-30'dan sayar);
  - mantıksal (`t="b"`) → `'EVET'` / `'HAYIR'`;
  - hata (`t="e"`) → `'#N/A'` gibi yazılışı;
  - boş hücre → `''`. Her satır en geniş sütuna kadar `''` ile doldurulur; tamamen boş satırlar `[]` değil, aynı genişlikte boş
    satır olarak kalır (satır numaraları kaymasın).
  - Sayfa sırası ve adı `workbook.xml` + ilişki dosyasından; bunlar okunamazsa `xl/worksheets/sheetN.xml` dosyaları numara
    sırasıyla "Sayfa1", "Sayfa2"… adıyla alınır. Gizli sayfalar da okunur.
  - Hatalar (Türkçe, kullanıcıya gösterilebilir): "Bu bir Excel dosyası değil (zip yapısı bozuk).", "Dosya açılınca çok büyüyor;
    tabloyu bölüp yükle.", "Dosya açılamadı: <parça> bölümü okunamıyor.", "Dosya çok büyük: en fazla 20000 satır, 200 sütun
    okunur. Listeyi bölüp birkaç dosya hâlinde yükle.", "Excel dosyasında okunabilir sayfa yok."
- **`zipOku(buf)`** → `{ 'yol/ad.xml': Buffer, … }`. Yalnız "saklanmış" (yöntem 0) ve "deflate" (yöntem 8) desteklenir. Tablo
  okuyucu ODS için de bunu kullanır.
- **`xmlCoz(s)`** — XML varlıklarını çözer: `&#x..;`, `&#..;` (geçersiz kod noktası → boş), `&lt;`, `&gt;`, `&quot;`, `&apos;`
  ve EN SON `&amp;` (önce çözülseydi `&amp;lt;` yanlışlıkla `<` olurdu).

### Yazma

- **`yaz(sayfalar)`** → .xlsx `Buffer`. `sayfalar`: en az bir tane `{ ad, basliklar?, satirlar, genislikler?, duz? }`; boş dizi →
  `Error('En az bir sayfa gerekli.')`.
  - `basliklar` varsa ilk satır başlıktır: koyu beyaz yazı, kırmızı (`#C02B30`) zemin, 22 birim yükseklik; başlık satırı
    DONDURULUR (aşağı inince görünür kalır) ve veri varsa bütün aralığa **süzme okları** (autoFilter) konur.
  - Veri hücrelerinin altında ince açık kenarlık.
  - `duz: true` — başlıksız, süssüz sayfa ("Nasıl doldurulur" açıklamaları): 10 punto italik gri, üste yaslı, satır kaydırmalı.
  - `genislikler`: sütun genişlikleri (Excel birimi).
  - Hücre: sonlu sayı → sayı hücresi; `null`/`undefined`/`''` → boş (stil gerekiyorsa boş stilli hücre); diğer her şey → satır içi
    metin (`inlineStr`, `xml:space="preserve"`, XML kaçışlı; 0–31 arası denetim karakterleri — sekme ve satır sonları dışında —
    atılır, çünkü Excel onları görünce dosyayı bozuk sayar).
  - Sayfa adı `sayfaAdiTemizle`: `\ / ? * [ ] :` boşluğa döner, boşsa `SayfaN`, en çok 31 karakter.
  - Zip tarihleri sabit 1980-01-01: aynı veri her seferinde bayt bayt aynı dosyayı üretir.
- **`zipYaz(dosyalar)`** — `[{ ad, veri: Buffer }]` → zip `Buffer`. Her dosya en yüksek düzeyde (9) deflate edilir; sıkıştırma
  büyütüyorsa ham konur. Dosya adları UTF-8 bayrağıyla. (Testte bozuk/bomba dosya üretmek için de kullanılır.)
- **`sutunAd(n)`** / **`sutunNo(harf)`** — `0 → 'A'`, `25 → 'Z'`, `26 → 'AA'`, `27 → 'AB'`; `sutunNo('AB') → 27`. `sutunNo` büyük
  harf dışı karakterde durur.

### Güvenlik sınırları (kötü niyetli dosyaya karşı)

- **Sıkıştırma bombası**: açılmış toplam boyut 60 MB (`inflateRawSync` `maxOutputLength` ile; aşarsa "çok büyüyor").
- **Uzak hücre bombası**: tek hücreli küçük bir dosya bile `XFD1048576` hücresiyle milyarlarca boş hücreyi belleğe açtırabilirdi.
  Bu yüzden 20 000. satırın ya da 200. sütunun ötesindeki hücreler ATLANIR; en çok 20 sayfa okunur; bütün sayfalardaki doldurulmuş
  hücre (boşluklar dahil, satır × en geniş sütun) toplamı 2 000 000'u aşarsa hata.
- EOCD en çok son 64 KB + 22 baytta aranır.

İç yardımcılar: `crc32` (zip sağlaması; tablo bir kez üretilir), `xmlKac`, `metinTopla` (biçimli metnin `<t>` parçalarını
birleştirir), `paylasilanCoz` (`sharedStrings.xml`), `sayfaCoz`, `hucre`, `sayfaYaz`, `STILLER` (4 hücre stili: 0 varsayılan,
1 başlık, 2 veri, 3 düz metin).

## Kimle konuşur?

- Çağırdığı: Node'un `zlib` modülü.
- Onu çağıranlar:
  - [tablo-oku.md](tablo-oku.md) — `.xlsx` okuma (`oku`), ODS için `zipOku` ve `xmlCoz`.
  - [aktarim.md](aktarim.md) — boş şablon ve dışa aktarım (`yaz`).
  - [../bolumler/kisi-aktarim.md](../bolumler/kisi-aktarim.md) — kişi listesi şablonu (öğrenci + servisçi sayfaları) ve TXT isim
    listesinden üretilen doldurulacak şablon (`yaz`).
  - Testler: `testler/test-xlsx.js`, `testler/test-aktarim.js`, `testler/test-cakisma.js`, `testler/test-yetiskin.js`.
- Veritabanı kullanmaz.

## Nasıl çalışır (adım adım)?

Okuma:

```
oku(buf)
  zipOku: sondan EOCD'yi bul → merkezî dizindeki her kayıt → yerel başlıktan verinin başı → inflate (60 MB bütçe)
  sharedStrings.xml → ortak metin listesi
  workbook.xml + workbook.xml.rels → [ad, sayfa yolu] (en çok 20)
  her sayfa: <c r="B7" t="…">…</c> düzenli ifadeyle taranır
             r="B7" → sütun 1, satır 6 (sınır dışıysa atla)
             türüne göre değer; satirlar[6][1] = değer
             bütçe düş, seyrek boşlukları '' ile doldur
```

Yazma:

```
yaz(sayfalar)
  [Content_Types].xml, _rels/.rels, xl/workbook.xml, xl/_rels/workbook.xml.rels, xl/styles.xml
  + her sayfa için xl/worksheets/sheetN.xml (boyut, dondurma, sütun genişlikleri, satırlar, süzgeç)
  zipYaz → Buffer
```

## Dikkat!

- Sınır dışı hücreler SESSİZCE atlanır: 25 000 satırlık bir dosyanın ilk 20 000 satırı okunur, kullanıcıya "fazlası alınmadı"
  denmez (bütçe aşımında ise hata verilir). Çağıranlar satır sayısını ayrıca denetlemiyorsa eksik aktarım fark edilmeyebilir.
- Tarihler gün sayısı olarak gelir; ODS okuyucusu ise `yyyy-aa-gg` verir (`tablo-oku.js`). Tarih bekleyen çağıran her ikisini de
  çözmeli (`tarihCoz` ikisini de çözer).
- Mantıksal değer burada `EVET`/`HAYIR`, eski `.xls` okuyucusunda `DOĞRU`/`YANLIŞ` (bkz. [xls.md](xls.md)).
- Hücre yeri YALNIZ `r="B7"` özniteliğinden okunur (satır etiketine bakılmaz). `r` özniteliği isteğe bağlıdır; bazı araçların
  ürettiği, hücrelerinde `r` olmayan dosyalarda o hücreler sessizce atlanır ve sayfa boş görünür. Excel, LibreOffice ve Google
  E-Tablolar `r` yazar.
- XML düzenli ifadelerle okunur, gerçek bir XML ayrıştırıcısı yoktur. Excel, LibreOffice ve Google E-Tablolar'ın ürettiği dosyalar
  için yeterli; ad alanı önekli (`<x:c>`) yazılmış sayfalar okunmaz.
- `zipOku` yerel başlığın konumunu sınır denetimi yapmadan okur; bozuk bir merkezî dizin kaydı Node'un İngilizce `RangeError`'unu
  (Türkçe mesaj yerine) fırlatabilir. Çağıranlar hatayı yakalayıp mesajı kullanıcıya gösterdiği için bu durumda İngilizce bir
  mesaj görünür. (Kod değiştirilmedi; not.)
- Yöntem 0 ve 8 dışındaki sıkıştırma (deflate64, şifreli zip) desteklenmez; bu parçalar ham okunur ya da "okunamıyor" hatası verir.
- Yazarken metinler `inlineStr` olarak yazılır; `=` ile başlayan bir metin FORMÜL olarak çalışmaz (Excel formül enjeksiyonuna
  kapalı).
- Aynı adlı iki sayfa yazılırsa (`yaz`'a aynı ad iki kez verilirse) Excel dosyayı onarmak ister; çağıranlar farklı adlar veriyor.

## Testleri

- `testler/test-xlsx.js` (sunucusuz; `tumtest.sh` sunucusuz paket listesinde) — yaz → oku turu (sayfa adı, satır sayısı, başlık,
  Türkçe harf, özel işaretli metin, sayı hücresi), `&`, `<`, tırnaklar ve `<script>` metninin kaçışı, baştaki/sondaki boşluğun
  korunması, iki sayfa, boş hücre ve boş satır, 500 satırlık liste (boyut < 200 KB, < 1 sn), bozuk ve boş dosyada anlaşılır hata,
  uzak hücreli küçük dosyanın belleği şişirmemesi (ve 3 sn'den kısa sürmesi), `sutunAd`/`sutunNo`. Aynı pakette eski `.xls`
  okuyucusu da denenir (bkz. [xls.md](xls.md)).
- `testler/test-aktarim.js` (sunucu ister) — şablon indirme, `.xlsx` yükleme, sıkıştırma bombası, bozuk dosya.
- `testler/test-yetiskin.js`, `testler/test-cakisma.js` — testte `.xlsx` dosyası üretmek için `yaz`, şablonu okumak için `oku`.
- Elle: `node testler/test-xlsx.js`.

## Son durum

- Dosya parça parça eklendi (diff'e göre): `51179f4 commit 88` (2026-08-29) CRC tablosu, `crc32` ve `zipOku`; `77008a0 commit 89`
  XML yardımcıları, sütun çevirileri, ortak metin okuyucusu, sınırlar, `sayfaCoz`, `oku`, `STILLER` ve `sayfaAdiTemizle`;
  `5fdde00 commit 90` `hucre`, `sayfaYaz`, `yaz` ve `module.exports`; `aced02f commit 312` (2026-09-26) `zipYaz`. Bu commit'lerin hepsi ekleme; sonradan davranış değişikliği yok.
- Açık: sınır dışı hücrelerin sessizce atlanması; `zipOku`'da yerel başlık konumunun sınır denetimi (yukarıda).
- Sıradaki işlerden "Sınav: formüllü ölçüm … notları Excel'den yükleme/indirme" ve "quiz sorularını Excel'den aktarma"
  (Anket düzenleyici / Sınav işleri) bu okuyucuyu ve yazıcıyı kullanacak; "Verilerimi indir" (destek işi) ve "Yıl geçişi …
  okul yedeği" de Excel/zip üretimi isteyebilir.
