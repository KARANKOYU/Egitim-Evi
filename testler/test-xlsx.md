# testler/test-xlsx.js

Paketsiz yazılmış Excel motorunu (`sunucu/yardimci/xlsx.js`) ve eski `.xls` okuyucusunu (`tablo-oku.js` → `xls.js`) yaz → oku
turu, kaçış karakterleri, çok sayfa, boş hücre, 500 satırlık liste, bozuk dosya, bellek bombası ve sütun adı çevrimiyle
deneyen sunucusuz test paketi (44 denetim).

## Bu dosya ne yapar?

Eğitim Evi'nin tek npm bağımlılığı `pg`; Excel dosyaları için paket kullanılmaz. `.xlsx` bir zip arşividir ve içindeki
XML'ler elle yazılıp okunur ([../sunucu/yardimci/xlsx.md](../sunucu/yardimci/xlsx.md)); Excel 97-2003'ün `.xls`'i ise
"birleşik belge" (sektörlü bir dosya sistemi) içinde BIFF8 kayıtlarıdır ([../sunucu/yardimci/xls.md](../sunucu/yardimci/xls.md)).
Müdürün öğrenci listesini Excel'den yüklemesi, şablon indirmesi ve okul verisinin dışa aktarımı bu iki okuyucuya/yazıcıya
dayanır. Elle yazılmış bir dosya biçimi okuyucusu kolay bozulur ve kötü niyetli bir dosyayla sunucuyu düşürebilir; bu
paket ikisini sunucu açmadan, doğrudan işlevleri çağırarak dener:

- yazdığını aynen okuyabiliyor mu (Türkçe harf, özel işaretli şifre, sayı, sayfa adı);
- XML'de anlamı olan karakterler (`&`, `<`, tırnaklar, `<script>`) ve baştaki/sondaki boşluklar bozulmuyor mu;
- birden çok sayfa, boş hücre ve tamamen boş satır;
- 500 satırlık liste küçük ve hızlı mı;
- bozuk ya da boş dosya anlaşılır bir hatayla mı reddediliyor (çökmeden);
- eski `.xls`: Türkçe sayfa adları, 451 satır, kayıt sınırını aşan metin tablosu, sayı ve tarih hücreleri, bozuk / kendine
  dönen / dosya dışını gösteren sektör zincirleri;
- tek hücresi en uzak köşeye yazılmış küçük bir `.xlsx` belleği şişirmiyor mu;
- sütun harfi ↔ numara çevrimi.

## İçinde neler var?

### Yardımcılar ve dosyalar

- `CIKTI` — `__dirname` (`testler/`); 1. bölümün ürettiği dosya `testler/deneme.xlsx` olarak buraya yazılır (sonda yolu da
  ekrana basılır).
- `kontrol(ad, sart, detay)` — `GECTI` / `KALDI` satırı, sayaçlar.
- Kullanılan modüller: `sunucu/yardimci/xlsx.js` (`yaz`, `oku`, `zipYaz`, `sutunAd`, `sutunNo`), 8. bölümde
  `sunucu/yardimci/tablo-oku.js` (`tabloOku`) ve `sunucu/ortak.js` (`tarihCoz`).
- Okunan örnek dosyalar (depoda, sentetik): `testler/ornek-eski-liste.xls` (LibreOffice ile kaydedilmiş; "Öğrenciler" ve
  "Servisçiler" sayfaları, 450 satırlık uydurma liste, 900 farklı metin) ve `testler/ornek-eski-sayilar.xls` (küçük dosya:
  T.C. no, ondalık, eksi sayı, tarih).

### 1) Temel yaz/oku turu (9)

"Öğrenciler" sayfası (başlıklar: Ad Soyad, E-posta, Sinif, Giris Kodu, Puan; üç uydurma satır; sütun genişlikleri) yazılır
ve `deneme.xlsx`'e kaydedilir. Dosya 500 bayttan büyük, ilk iki baytı `PK` (zip imzası). `oku` ile geri okunur: tek sayfa,
ad "Öğrenciler", 4 satır (başlık + 3), başlıklar aynı, "Ayşe Yılmaz" bozulmamış, `Kd7#mZ2p` aynen, sayı `85` metin olarak
`'85'`.

### 2) XML kaçış karakterleri (5)

`'A & B <okul>'`, `tirnak "cift" ve 'tek'`, `'%100 & <script>alert(1)</script>'`, `'sonda bosluk   '`,
`'   basta bosluk'` yazılıp okununca aynen dönüyor. (Aynı satırdaki `'satir\nsonu'` hücresi yazılır ama denetlenmez.)

### 3) Çok sayfa (4)

"Liste" (başlıklı) ve "Nasil doldurulur" (`duz: true`, başlıksız açıklama sayfası) — iki sayfa, adlar ve ikinci sayfanın ilk
hücresi doğru.

### 4) Boş hücreler (3)

`['dolu', '', 'dolu']`, `['', '', '']`, `['son', 'son', '']` → boş hücre `''` dönüyor, boş hücreden sonraki dolu hücre yerinde,
tamamen boş satır atlanmamış (başlıkla birlikte 4 satır).

### 5) Büyük liste (4)

500 satır ("Öğrenci 0…499", e-posta, sınıf, kod): yazılıp okununca 501 satır, son satır "Öğrenci 499", dosya 200 KB'tan
küçük, yazma + okuma toplamı 1 saniyeden kısa.

### 6) Bozuk dosya (2)

Düz metin bir tampon → hata iletisinde "Excel" geçiyor (`zipOku`: "Bu bir Excel dosyası değil (zip yapısı bozuk)."); boş
tampon → çökmeden bir hata iletisi.

### 8) Eski Excel (.xls, Excel 97-2003) (10)

Bu bölüm dosyada 6'dan hemen sonra gelir (sonradan eklendi, numarası 8 kaldı):

- `tabloOku(<ornek-eski-liste.xls>, 'ornek-eski-liste.xls')` → iki sayfa, adları "Öğrenciler" ve "Servisçiler"; ilk sayfada
  451 satır.
- 450 veri satırının her biri koddaki formülle üretilen beklenen satıra birebir eşit (ad, "…oğlu<i>" soyadı, `10000000000 +
  i·7919`, `1 + i % 12`, "Çiçek"/"A"). Metinler 900 farklı olduğu için `.xls`'in ortak metin tablosu tek kayda sığmaz,
  `CONTINUE` kayıtlarına bölünür; okuyucu bunu doğru birleştirmeli.
- Aynı dosya uzantısız adla (`'liste'`) verilince de dosya imzasından tanınıyor (451 satır).
- `ornek-eski-sayilar.xls` (`'x.xls'`): ilk veri satırında T.C. `12345678950`, `3.5`, `-7`; ikincide `-0.25`; tarih hücreleri
  gün sayısından `tarihCoz` ile `2012-05-12` ve `2013-09-01`.
- Bozuk dosyalar hata verir (çökmez, döngüye girmez): ilk 3000 baytı kesilmiş dosya; dizinin ilk sektörünün FAT girişi
  kendini gösterecek biçimde değiştirilmiş dosya (kendine dönen zincir); başlıktaki dizin başlangıcı `0x7FFFFFF0` yapılmış
  dosya (dosya dışı); imzası doğru ama arkası 600 bayt `0xAB` olan dosya.

### 6b) Küçük dosya, dev tablo — bellek bombası (2)

`zipYaz` ile elle kurulan en küçük `.xlsx`: A1'de "Ad", `XFD1048576`'da (Excel'in en uzak hücresi) "x". `oku` ya tek satır
döndürmeli ya da hata vermeli (ikisi de kabul) ve 3 saniyeden kısa sürmeli. (Eskiden milyarlarca boş hücreyi belleğe açmaya
çalışıp süreci düşürüyordu; bugün sınır dışı hücre atlanıyor: en çok 20.000 satır, 200 sütun.)

### 7) Sütun adı çevrimi (5)

`sutunAd(0)` `A`, `(25)` `Z`, `(26)` `AA`, `(27)` `AB`; `sutunNo('AB')` 27.

Sonunda boş satır, `  GECTI: 44   KALDI: 0` ve `  Ornek dosya: <testler/deneme.xlsx'in tam yolu>`; `KALDI` varsa çıkış kodu 1.
Paket `async` değil; beklenmeyen hata Node'un kendi hata çıktısıyla süreci düşürür (`TEST HATASI` satırı yok).

## Kimle konuşur?

- **Çağırdıkları:** [../sunucu/yardimci/xlsx.md](../sunucu/yardimci/xlsx.md) (`yaz`, `oku`, `zipYaz`, `sutunAd`, `sutunNo`;
  içeride `zipOku`, `xmlKac`, `xmlCoz`, `sayfaCoz`), [../sunucu/yardimci/tablo-oku.md](../sunucu/yardimci/tablo-oku.md)
  (`tabloOku`: uzantı ya da imzaya göre `.xlsx`/`.xls`/`.ods`/`.csv`/`.txt` seçimi) → [../sunucu/yardimci/xls.md](../sunucu/yardimci/xls.md)
  (`xlsOku`: birleşik belge ve BIFF8), [../sunucu/ortak.md](../sunucu/ortak.md) (`tarihCoz`). Node'un `fs` ve `path`'i.
- **Koruduğu kod:** yukarıdaki üç modülün okuma ve yazma yolları, özellikle güvenlik sınırları: `zipOku`'nun açılmış toplam
  boyut sınırı (60 MB), `sayfaCoz`'un satır/sütun sınırı (20.000 / 200) ve hücre bütçesi, `xls.js`'in sektör zinciri
  denetimleri (döngü ve dosya dışı).
- **Bu modülleri kullananlar** (paket onları dolaylı korur): Excel ile kişi aktarımı [../sunucu/bolumler/kisi-aktarim.md](../sunucu/bolumler/kisi-aktarim.md),
  okulun dışa aktarımı ve ders programının Excel'le aktarımı [../sunucu/bolumler/okul.md](../sunucu/bolumler/okul.md)
  (sayfaları [../sunucu/yardimci/aktarim.md](../sunucu/yardimci/aktarim.md) kurar); testlerde `test-cakisma.js`, `test-yetiskin.js` ve
  [hazirlik-aktarim.md](hazirlik-aktarim.md) bellekte `.xlsx` üretmek için `yaz`'ı kullanır.
- **Yazdığı dosya:** `testler/deneme.xlsx` (`.gitignore`'da açıkça yazılı, depoda izlenmez). Bu yolu
  [test-gizli-dosyalar.md](test-gizli-dosyalar.md) ayrıca denemez: onun "depoya giremez" listesinde yok; yalnız izlenen
  hiçbir dosyanın gizli kurallara takılmadığına bakar. `.gitignore`'daki satır silinirse bunu yakalayan bir test yok.
- **Onu çalıştıran:** `testler/tumtest.sh`'in sunucusuz paket döngüsü (listenin ilki, `test-push`'tan önce). Sunucu,
  veritabanı ya da `EE_*` değişkeni gerekmez.

## Nasıl çalışır (adım adım)?

```
1) yaz("Öğrenciler") ─► testler/deneme.xlsx ─► PK? ─► oku ─► ad, satırlar, Türkçe, şifre, '85'
2) zor metinler ─► yaz ─► oku ─► aynen mi?
3) iki sayfa (biri düz) ─► oku ─► 2 sayfa, adlar, içerik
4) boş hücre / boş satır ─► '' ve 4 satır
5) 500 satır ─► 501 satır, < 200 KB, < 1 sn
6) düz metin ve boş tampon ─► anlaşılır hata
8) tabloOku(.xls) ─► 2 sayfa, 451 satır, 450 satır birebir ; uzantısız ; sayılar ve tarih
   bozuk .xls (kesik, döngülü, dosya dışı, sahte) ─► hata (çökme/döngü yok)
6b) zipYaz(A1 + XFD1048576) ─► oku ─► 1 satır ya da hata, < 3 sn
7) sutunAd / sutunNo
```

## Dikkat!

- **Depodaki klasöre dosya yazar.** Her koşuda `testler/deneme.xlsx`'in üstüne yazar. Dosya `.gitignore`'da olduğu için
  depoya girmez; ama paketi salt okunur bir klasörden ya da başkasının çalışma kopyasından koşarken bunu bil. (Bu belge
  için paket, `CIKTI` satırı geçici bir klasöre çevrilmiş bir kopyayla çalıştırıldı; depodaki `deneme.xlsx`'e
  dokunulmadı. Kopya ile asıl dosya arasındaki fark yalnız çıktı klasörü ile `__dirname`'e bağlı modül ve örnek `.xls`
  yollarının mutlak yazılmasıydı: 6 satır.)
- **İki denetim süreye bağlı.** "hizli (<1 sn)" ve "ve hizli bitiyor" (< 3 sn) çok yavaş ya da çok meşgul bir makinede
  kalabilir; bugün bütün paket 0,2 saniyenin altında bitiyor.
- **Bölüm numaraları sırasız.** Dosyada sıra 1, 2, 3, 4, 5, 6, 8, 6b, 7: "8) ESKİ EXCEL" sonradan 6'nın arkasına eklendi.
  Çıktıda bir `KALDI` görünce bölümü başlığından bul, numarasından değil.
- **6b iki sonucu da kabul eder.** "Tek satır" ya da "hata" ikisi de geçer; bellek şişmesinin ölçüsü yalnız süredir. Bugün
  sınır dışı hücre sessizce atlandığı için tek satır döner.
- **Örnek `.xls` dosyalarına bağlı.** 8. bölüm `testler/ornek-eski-liste.xls` ve `ornek-eski-sayilar.xls`'i okur; beklenen
  değerler bu dosyalara göre yazılmıştır. Dosyalar yeniden kaydedilirse (ör. başka bir programla) denetimler değişebilir.
  İçlerindeki adlar ve numaralar uydurmadır (T.C. no'lar `10000000000 + i·7919` dizisi, gerçek kişi yok).
- **Bozuk `.xls` denemeleri dosyanın iç yapısına göre kurulur.** Döngülü zincir denemesi başlıktaki dizin başlangıcını
  (`0x30`) ve FAT sektör listesini (`0x4C`) okuyup 512 baytlık sektör varsayımıyla bir FAT girişini değiştirir; örnek dosya
  4096 baytlık sektörlü bir sürümle değiştirilirse bu denemenin anlamı kayar (koddan çıkarım).
- **Denenmeyenler:** `xmlKac`'ın kontrol karakterlerini atması, `xmlCoz`'un `&#x…;` sayısal karakterleri, mantıksal (`b`)
  hücrelerin "EVET/HAYIR"a çevrilmesi, 20.000 satır / 200 sütun / 20 sayfa sınırları ve hücre bütçesi hatası, zip
  sıkıştırma bombası (60 MB sınırı; [test-aktarim.md](test-aktarim.md) dener), `.ods`, `.csv`, `.txt` okuma (onlar da
  `test-aktarim`'da), satır içindeki `\n`.

## Testleri

- Bu dosyanın kendisi testtir; `testler/tumtest.sh` sunucusuz paketler arasında her tam koşuda (ilk sırada) çalıştırır.
- Aynı alanda: [test-aktarim.md](test-aktarim.md) (sunuculu: şablon indirme, `.xlsx`/`.ods`/`.csv`/`.txt` yükleme, sıkıştırma
  bombası, bozuk dosya), [test-cakisma.md](test-cakisma.md) (bellekte `.xlsx` üretip kişi aktarımında çift deneme),
  `testler/test-yetiskin.js`.
- Elle (proje kökünde; sunucu gerekmez; `testler/deneme.xlsx`'i yeniden yazar):

  ```
  node testler/test-xlsx.js
  ```

- 3 Ekim 2026'da bu belge için (çıktı klasörü geçici bir klasöre çevrilmiş kopyayla, yukarıya bak) çalıştırıldı:
  `GECTI: 44   KALDI: 0`, yaklaşık 0,2 saniye; üretilen örnek dosya 2746 bayt. Belge denetiminde aynı gün aynı yolla
  yeniden çalıştırıldı: sonuç ve boyut aynı, depodaki `testler/deneme.xlsx`'in tarihi değişmedi.

## Son durum

- `git log`: 5 commit. Dosya 2026-08-29'da dört parçada eklendi: `7804565 commit 96` (107 satır: 1–6. bölümler), `3dc704f
  commit 97` (19 satır: "6b) bellek bombası"), `9e08f32 commit 98` (7 satır: "7) sütun adı çevrimi"), `53fd704 commit 99`
  (4 satır: özet ve çıkış).
- Son değişiklik `62e782e commit 398` (2026-09-26): "8) ESKİ EXCEL (.xls, Excel 97-2003)" bölümü (45 satır) 6. bölümün hemen
  arkasına eklendi — `tabloOku` ile iki örnek `.xls` dosyasının okunması, sayı ve tarih hücreleri, dört bozuk dosya denemesi.
  `.xls` okuyucusu (`sunucu/yardimci/xls.js`) aynı gün `commit 395` ve `commit 396` ile gelmişti.
- Açık iş yok; kod değiştirilmedi.
- Planlı işlerden bu dosyayı etkileyecekler:
  - **"Sınav: … notları Excel'den yükleme/indirme + quiz sorularını Excel'den aktarma"** ve **"Anket düzenleyici … + quiz
    sorularını Excel'den aktarma"** — Excel motoru yeni yerlerde kullanılacak; yeni bir biçim gereği (ör. formül hücresi,
    birleşik hücre, tarih yazma) çıkarsa bu pakete yaz → oku denetimi eklenmeli.
  - **"T.C. kimlik no bütün hesaplarda zorunlu + her yerde geçerlilik kuralı (site, Excel, Android)"** — Excel tarafındaki
    T.C. kuralı aktarım bölümündedir (`test-aktarim`); bu paket yalnız hücrenin sayı olarak doğru okunduğuna bakar.
