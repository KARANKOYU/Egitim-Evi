# sunucu/yardimci/tablo-oku.js

Tablo dosyası okuyucusunun giriş kapısı: `.xlsx`, `.xls`, `.ods`, `.csv` ve `.txt` dosyalarını türünü anlayıp okur ve hepsini
aynı biçime çevirir: `[{ ad: sayfa adı, satirlar: [[hücre, …], …] }]`.

## Bu dosya ne yapar?

Müdür listesini hangi programla hazırladıysa onu yükleyebilmeli: Excel (yeni ya da eski), LibreOffice (`.ods`), Excel'den "CSV"
olarak kaydedilmiş dosya ya da alt alta isim yazılmış düz metin. Aktarım kodu bu farkları bilmek istemez; bu dosya dosyanın türünü
bulur, doğru okuyucuya verir ve hepsinden aynı biçimde sayfa listesi döndürür.

- `.xlsx` → [xlsx.md](xlsx.md) (`xlsx.oku`)
- `.xls` → [xls.md](xls.md) (`xlsOku`)
- `.ods`, `.csv`, `.txt` → bu dosyanın kendi okuyucuları

## İçinde neler var?

### `tabloOku(buf, dosyaAdi)`

Türü şu sırayla seçer (uzantı küçük harfe çevrilir):

1. uzantı `ods` YA DA dosya bir zip ve ilk 200 baytında `application/vnd.oasis.opendocument` geçiyor (ODS'nin `mimetype` dosyası)
   → `odsOku`;
2. uzantı `xlsx` YA DA dosya zip imzasıyla (`50 4B 03 04`) başlıyor → `xlsx.oku`;
3. uzantı `xls` YA DA birleşik belge imzası (`D0 CF 11 E0 A1 B1 1A E1`) → `xlsOku`;
4. uzantı `csv` → `csvOku`; uzantı `txt` → `txtOku`;
5. uzantı yok ya da bilinmiyor: ilk satırda `;`, sekme ya da `,` varsa `csvOku`, yoksa `txtOku`.

Uzantı imzadan ÖNCE gelir: `.xlsx` adlı ama aslında eski `.xls` olan bir dosya zip olarak okunmaya çalışılır ve "zip yapısı
bozuk" hatası verir. Hataları okuyuculardan olduğu gibi yukarı atar (Türkçe mesajlar).

### `odsOku(buf)`

ODS de bir zip'tir; hücreler `content.xml`'dedir (`xlsx.zipOku` ile açılır, aynı 60 MB bombası sınırı). Yoksa "Bu bir ODS dosyası
değil."

- Her `<table:table>` bir sayfa (adı `table:name`, yoksa `SayfaN`), en çok 20 sayfa.
- Hücre değerleri: `office:value-type` `date` → `office:date-value`'nun ilk 10 karakteri (`yyyy-aa-gg`); `float`, `percentage`,
  `currency` → `office:value` (ham sayı); `boolean` → `EVET`/`HAYIR`; diğerleri → hücrenin metni (`<text:s text:c="3"/>` en çok 50
  boşluk, `<text:tab/>` sekme, `<text:line-break/>` ve paragraf sonu satır sonu; kalan etiketler atılır, XML varlıkları çözülür,
  kırpılır). Birleştirilmiş hücrelerin (`covered-table-cell`) yeri de sayılır.
- **Tekrarlar**: ODS "bu hücre 16 000 kez tekrar", "bu satır 1 000 000 kez tekrar" diye yazabilir (LibreOffice sayfanın sonunu
  böyle doldurur). Boş hücre tekrarları belleğe açılmaz, yalnız sütun sayacı ilerler; boş satırlar ancak arkasından dolu bir satır
  gelirse eklenir; dolu satır tekrarı en çok 1000'e kadar açılır.
- Sınırlar: sayfa başına 20 000 satır, 200 sütun; bütün sayfalarda en çok 100 000 satır ("Dosya çok büyük. Listeyi bölüp birkaç
  dosya hâlinde yükle."). Hiç sayfa yoksa "ODS dosyasında okunabilir sayfa yok."

### `csvOku(buf)` → `[{ ad: 'Liste', satirlar }]`

- Metin `metinCoz` ile çözülür (UTF-8 ya da Windows-1254).
- Ayırıcı İLK SATIRDA en çok geçen `;`, sekme ya da `,` (Türkçe Excel `;` kullanır; hiçbiri yoksa `,`).
- Tırnak kuralları: hücre `"` ile BAŞLIYORSA tırnaklı hücredir; içinde `""` tek `"`, ayırıcı ve satır sonu metnin parçasıdır.
  Hücrenin ortasındaki `"` düz karakterdir.
- `\r\n`, `\n`, `\r` satır sonu sayılır. En çok 20 000 satır, satır başına 200 sütun (fazlası atlanır). Hücreler kırpılır.
- Örnek: `Ad;Soyad;Not` / `Ayşe;"Yılmaz; K";85` → `[["Ad","Soyad","Not"],["Ayşe","Yılmaz; K","85"]]`.

### `txtOku(buf)` → `[{ ad: 'Liste', satirlar }]`

Alt alta isim listesi. İlk satır her zaman başlıktır: `['Ad', 'Soyad', 'T.C. Kimlik No']`. Her dolu satır için:

- 0 ile başlamayan 11 haneli sayı (başka rakama bitişik değilse) T.C. numarası sayılır ve satırdan çıkarılır;
- baştaki sıra numarası (`1.`, `12)`, `3-`) atılır; `;`, `,`, `|` boşluğa döner;
- SON kelime soyad, öncesi ad olur (tek kelimeyse ad olur, soyad boş).

Örnek: `1. Ayşe Nur Yılmaz 12345678950` → `["Ayşe Nur", "Yılmaz", "12345678950"]`; `2) Mehmet Kaya` → `["Mehmet", "Kaya", ""]`.
En çok 20 000 kişi.

### `metinCoz(buf)`

UTF-8 olarak çözer; sonuçta bozuk karakter işareti (U+FFFD) varsa Windows-1254 (Türkçe Windows kod sayfası) ile yeniden çözer.
Baştaki BOM atılır.

### Sabitler (dışa açık değil)

`EN_FAZLA_SATIR` 20 000, `EN_FAZLA_SUTUN` 200, `EN_FAZLA_SAYFA` 20, `TOPLAM_SATIR` 100 000 (ODS, bütün sayfalar).

## Kimle konuşur?

- Çağırdıkları: [xlsx.md](xlsx.md) (`oku`, `zipOku`, `xmlCoz`), [xls.md](xls.md) (`xlsOku`); Node'un `TextDecoder`'ı.
- Onu çağıranlar:
  - [../bolumler/kisi-aktarim.md](../bolumler/kisi-aktarim.md) — öğrenci/servisçi/öğretmen listesi yükleme (`tabloOku(ham,
    dosyaAdi)` → `cozumle`) ve TXT isim listesini doldurulacak Excel şablonuna çevirme (`txtdenSablon`; dosya adı yoksa
    `liste.txt` sayılır).
  - [../bolumler/okul.md](../bolumler/okul.md) — ders programı aktarımı (`aktarim-ice`; dosya adı yoksa `program.xlsx` sayılır),
    sonra [aktarim.md](aktarim.md) `coz`.
- Veritabanı kullanmaz.

## Nasıl çalışır (adım adım)?

```
tabloOku(buf, ad)
  uzantı + imza ─┬─ ods  → zipOku → content.xml → tablo/satır/hücre (tekrarlar sınırlı) → sayfalar
                 ├─ zip  → xlsx.oku
                 ├─ CFB  → xlsOku
                 ├─ csv  → metinCoz → ayırıcı bul → tırnak farkında karakter karakter böl
                 ├─ txt  → metinCoz → satır satır: T.C. çek, sıra no at, son kelime soyad
                 └─ ?    → ilk satırda ayırıcı varsa csv, yoksa txt
```

## Dikkat!

- Dosya başındaki yorum "Hücreler metindir; tarih hücresi `yyyy-aa-gg`" diyor; bu yalnız ODS için doğru. `.xlsx` ve `.xls`
  okuyucuları tarihi Excel gün sayısı (`'41041'`) olarak verir; tarih bekleyen çağıran `sunucu/ortak.js` `tarihCoz` ile ikisini de
  çözmeli. (Yorum ile kod çelişiyor; kod değiştirilmedi.)
- Mantıksal değer ODS ve `.xlsx`'te `EVET`/`HAYIR`, `.xls`'te `DOĞRU`/`YANLIŞ`.
- Sınırlar çoğu yerde SESSİZDİR: CSV/TXT'de 20 000 satırdan sonrası, 200 sütundan sonrası, ODS'de 1000'den fazla tekrarlanan dolu
  satır uyarısız atlanır; yalnız ODS'nin 100 000 toplam satır sınırı ve Excel okuyucularının bütçeleri hata verir.
- `metinCoz`: gerçekten UTF-8 olup içinde U+FFFD karakteri bulunan bir dosya da Windows-1254 sayılır (pratikte görülmez).
- CSV ayırıcısı yalnız ilk satırdan seçilir; başlığı olmayan ve ilk satırında ayırıcı karakteri metin olarak geçen dosyalar yanlış
  bölünebilir.
- CSV'de son satırdaki son hücre eklenirken 200 sütun sınırı denetlenmez (en çok bir hücre fazla).
- ODS'de tablolar düzenli ifadeyle `</table:table>`'a kadar okunur; iç içe tablo içeren (çok nadir) belgeler yanlış bölünebilir.

## Testleri

- `testler/test-xlsx.js` (sunucusuz) — "8) ESKİ EXCEL" bölümü `tabloOku` üzerinden: `.xls` dosyaları, uzantısız dosyanın imzadan
  tanınması, bozuk `.xls` dosyalarında hata.
- `testler/test-aktarim.js` (sunucu ister) — `.xlsx`, `.ods` (müdürün kendi başlıklarıyla; sayfa adı "Sheet1" ise tür dosya
  adından), Windows-1254 `.csv` Türkçe harfleriyle, `.txt` (T.C.'li satır hazır, T.C.'siz satır hatalı), TXT'nin doldurulacak
  Excel'e çevrilmesi (ad ve soyad ayrılmış), bozuk dosya, sıkıştırma bombası.
- Sunucusuz birim testi `csvOku`/`txtOku`/`odsOku` için yok.
- Elle: `node -e "console.log(JSON.stringify(require('./sunucu/yardimci/tablo-oku').txtOku(Buffer.from('1. Ayşe Nur Yılmaz 12345678950'))))"`.

## Son durum

- Dosya parça parça eklendi (diff'e göre): `51179f4 commit 88` (2026-08-29) `metinCoz`, ODS hücre yardımcıları (`odsHucreMetni`,
  `ozellik`), `txtOku`, `tabloOku` ve `module.exports`; `8207ee3 commit 323` (2026-09-26) `csvOku`; `f2330da commit 430`
  (2026-09-26) `odsOku`. Hepsi ekleme; sonradan davranış değişikliği yok.
- Açık: baştaki yorumun tarih hakkında yanlış olması; sessiz satır sınırları; sunucusuz birim testi eksikliği (yukarıda).
- Sıradaki işlerden "Sınav … notları Excel'den yükleme/indirme", "quiz sorularını Excel'den aktarma" (Anket düzenleyici / Sınav)
  ve "Tek kişi tek hesap … Excel 'Eşleyelim mi?'" işleri bu okuyucuyu kullanacak.
