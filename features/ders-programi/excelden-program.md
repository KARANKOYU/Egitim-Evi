# Ders programı · Programı Excel'den kurma

**Durum:** Kodda var; tasarımda ek olarak program sayfasındaki "Excel'den" düğmesiyle açılan "Ders programı yükle" penceresi, "Geçerli" tarihi, "Öğretmen" sütununun kullanılması, "Saat" sütununa "1. ders" ya da "08:30–09:10" yazılabilmesi ve dosyadaki sınıfların programının dosyadakiyle DEĞİŞTİRİLMESİ (bugün üzerine eklenir).

Bütün okulun ders programını tek tek girmek yerine bir Excel (ya da LibreOffice, CSV) dosyasından toplu yüklemek: önce ne olacağı
gösterilir, onaylayınca eklenir.

## Ne işe yarar

Okulun 20 sınıfı ve haftada 30'ar ders saati varsa program 600 satırdır; elle girmek günler sürer. Okulların çoğunda program zaten bir
tabloda durur. Kullanıcı 29 Ağustos'ta istedi: ders programı Excel'den okunup kurulabilsin, CSV de olabilsin.

Her satır bir ders saatidir: **Sınıf, Gün, Başlangıç, Bitiş, Ders** (ve isteğe bağlı **Öğretmen**). Yükleme iki adımlıdır: "Kontrol et"
her satırın ne olacağını gösterir, onaylarsan eklenir. Hiçbir şey habersiz değişmez.

## Nereden açılır

Bugünkü site:

- Menü **"Excel Aktarım"** (müdürde "Okul Düzeni" başlığının altında; öğretmende "Excel ile içe ve dışa aktarım yapar" yetkisiyle ek
  bölümde) ya da müdürün ana sayfasındaki **"Excel Aktarım"** kutucuğu (alt yazısı "Toplu öğrenci ve program"). Adres `#/aktarim`.
- Sayfanın başlığı **"EXCEL AKTARIM"**, alt yazı "Listeleri dosyayla topluca al ya da ver. Excel, LibreOffice (ODS), CSV ve düz metin
  olur."; sekmeler **"İçeri aktar"**, **"Dışarı aktar"**, **"Metinden Excel'e"**.
- **"İçeri aktar"** → **"Ne yükleyeceksin?"** → **"Ders programı"** ("Ders saatlerini programa toplu ekle").

Tasarımda (Tasarım 1 önizlemesi): iki yol aynı pencereyi açar —

- Ders programı sayfasında "Dersler" kutusunun altındaki **"Excel'den"** düğmesi;
- Excel aktarım → "İçeri aktar" → **"Ders programı"** kartı ("Sütunlar: Sınıf, Gün, Başlangıç, Bitiş, Ders, Öğretmen.") →
  **"Dosya seç (.xlsx .xls .ods .csv)"**. Kartta ayrıca **"Örnek dosyayı indir (.xlsx)"**.

## Adım adım

### Müdür

1. Excel Aktarım → **"İçeri aktar"** → **"Ders programı"**. Altında **"Ders programı yükleme"** kartı üç adımdır.
2. **1 · Boş şablonu indir** — "Sütun başlıkları hazır gelir; ikinci sayfada nasıl doldurulacağı yazar." → **"Şablonu indir"**.
   `ders-programi-sablon.xlsx` iner: **"Ders programı"** sayfasında başlıklar (Sınıf, Gün, Başlangıç, Bitiş, Ders, Öğretmen), **"Nasıl
   doldurulur"** sayfasında anlatım ([Boş şablon](../excel-aktarim/bos-sablon.md)). Önceden sınıfları açıp derslerini eklemiş ol: program
   yalnız var olan sınıflara ve sınıfta tanımlı derslere eklenir ([Sınıfa ders ve öğretmen atama](../siniflar-dersler/ders-atama.md)).
3. **2 · Doldur** — "Her satır bir ders saati. Sınıf, gün, saat ve ders zorunlu. Gün Pazartesi'den Pazar'a olabilir." Sütunlar:
   - **Sınıf** (zorunlu) — okulda açılmış sınıfın adı. Büyük/küçük harf, Türkçe harfler, boşluk ve tire fark etmez: "7a", "7 A", "7-A"
     aynı sınıftır.
   - **Gün** (zorunlu) — "Pazartesi" … "Pazar"; 1–7 arası sayı (1 Pazartesi, 7 Pazar); kısaltmalar Pzt / Pts, Sal, Çar / Çrş, Per /
     Prş, Cum, Cmt / Cts, Paz / Pzr; ya da günün tek bir güne uyan baş kısmı (en az 3 harf, ör. "çarş"). "Paz" Pazar'dır.
   - **Başlangıç** ve **Bitiş** (zorunlu) — "09:20", "9:20", "9.20", "9,20", "9 20", "0920"; hücre Excel'de saat olarak biçimlendirildiyse
     de okunur.
   - **Ders** (zorunlu) — o sınıfta tanımlı dersin adı (ör. Matematik); yazımdaki büyük/küçük harf ve Türkçe harf farkı önemsizdir.
   - **Öğretmen** (isteğe bağlı) — bugün okunur ama **kullanılmaz**: ders saati her zaman dersin kayıtlı öğretmeniyle gelir.
   Sütunların sırası serbesttir; başlıklar şu adlarla da tanınır: "Şube" (Sınıf), "Günü", "Hangi gün" (Gün), "Başlangıç saati",
   "Başlama", "Başlar", "Saat" (Başlangıç), "Bitiş saati", "Biter" (Bitiş), "Ders adı", "Dersin", "Branş" (Ders), "Öğretmeni", "Öğretmen
   adı", "Ders öğretmeni" (Öğretmen). Fazladan sütunlar ve tamamen boş satırlar atlanır. Başlıkları uyan ilk sayfa okunur (anlatım
   sayfası atlanır). Örnek satır:
   ```
   Sınıf  Gün        Başlangıç  Bitiş  Ders       Öğretmen
   7-A    Pazartesi  09:20      10:00  Matematik  Ayşe Kaya
   7-A    Pzt        10:10      10:50  Türkçe
   ```
4. **3 · Dosyayı yükle** — **"Dosya seç"** (.xlsx, .xls, .ods, .csv). Seçince dosyanın adı görünür ("Henüz dosya seçilmedi" yerine) ve
   **"Kontrol et"** düğmesi çıkar. Altındaki not: "Excel (.xlsx ya da eski .xls), LibreOffice (.ods) ya da düz metin olabilir. Önce ne
   olacağını gösteririz, sen onaylayınca uygulanır. Hiçbir şey habersiz değişmez."
5. **"Kontrol et"**e bas ("Kontrol ediliyor..."). Sayfanın altında **"Kontrol sonucu"** kartı:
   - sayılar: **"Ders eklenecek"**, **"Hatalı satır"** ve varsa **"Uyarılı"**;
   - tablo: **"Satır"** (Excel'deki satır numarası), **"Kayıt"** (sınıf), **"Durum"**, **"Açıklama"**. Durumlar:
     - **"Açılacak"** — eklenecek (bu etiket hesap aktarımı için yazılmış; ders saatinde de aynısı çıkar); açıklama "Pazartesi
       09:20-10:00 Matematik";
     - **"Dikkat"** — eklenecek ama çakışıyor: "Pazartesi 09:20-10:00 Matematik — dikkat: öğretmenin 7-B Matematik dersiyle çakışıyor
       (09:20-10:00)" ya da "… — dikkat: sınıfın 7-A Müzik dersiyle çakışıyor (…)" ([Çakışma uyarısı](cakisma-uyarisi.md));
     - **"Atlandı"** — "Bu ders saati zaten programda var" ya da "Dosyada 5. satırda aynısı var";
     - **"Hata"** — eklenmez; nedeni açıklamada (aşağıda "Kurallar ve sınırlar").
   - Eklenecek satır yoksa kırmızı "İşlenecek geçerli satır yok. Yukarıdaki hataları düzeltip dosyayı yeniden yükle."; dosyada hiç satır
     yoksa "Dosyada işlenecek satır bulunamadı."
6. Hataları düzeltmek istersen dosyayı düzelt ve yeniden seç; ya da hatalı satırları bırakıp devam et.
7. **"Vazgeç"** raporu ve seçili dosyayı siler; **"12 ders saatini ekle"** (sayı eklenecek satırlar kadar) onay sorar:
   **"12 ders saati programa eklenecek. Var olan program silinmez, üzerine eklenir. Onaylıyor musun?"**
8. Onaylarsan ("Uygulanıyor...") dosya **baştan yeniden denetlenir** ve satırlar tek işlemde eklenir. Üstte **"İşlem tamamlandı"** kartı
   ve yeşil **"12 ders saati programa eklendi."**; **"Tamam"** kartı kapatır.
9. **Ders Programı** sayfasında sınıfları aç, sonucu ve varsa çakışma listesini denetle ([Ders programı kurma](program-kurma.md)).

### Öğretmen

Rolünde **"Excel ile içe ve dışa aktarım yapar"** ve **"Ders programını düzenler"** varsa adımlar aynı. Program yetkisi sınıfla
daraltıldıysa kapsam dışındaki sınıfların satırları hata alır: "7-B sınıfının programını düzenleme yetkin yok". Bugünkü hazır "Müdür
Yardımcısı" şablonunda aktarım yetkisi yoktur; müdür ayrıca eklemeli ([Hazır rol şablonları](../roller-yetkiler/hazir-sablonlar.md)).

### Çalışan

Bugün kodda öğretmeninki gibi (öğretmen hesabı + özel rol). Tasarımda öğretmen olmayan çalışan da özel rolündeki iki yetkiyle yükler;
Tasarım 1'deki "Müdür yardımcısı" hazır rolü ikisini de taşır.

### Tasarımda (Tasarım 1 önizlemesi)

1. **"Excel'den"** (ya da Excel aktarım kartındaki "Dosya seç") → pencere **"Ders programı yükle"**. Üstte üç adım:
   1. "Örnek dosyayı indir; her satıra sınıf, gün, başlangıç ve bitiş saati, ders ve öğretmeni yaz."
   2. "Dosyayı seç; okunan satırlar aşağıda görünür, hatalı ya da çakışan satırlar kırmızıdır."
   3. ""Programa aktar" ile doğru satırlar sınıfların programına konur."
2. **"Dosya seç"** (".xlsx .xls .ods .csv") ve **"Örnek dosyayı indir (.xlsx)"** → `ders-programi-ornek.xlsx` örnek satırlarla iner
   ("ders-programi-ornek.xlsx indirildi (örnek satırlarla)."). Örnek: "7-A · Pazartesi · 08:30 · 09:10 · Matematik · Ayşe Kaya",
   "7-A · Cumartesi · 10:00 · 10:40 · Bilişim · …", "8-B · Pazartesi · 08:30 · 09:10 · Fen Bilimleri · …".
3. **"Geçerli"** tarihi: programın hangi günden geçerli olacağı (eğitim yılının içinde bir gün; önizlemede 5 Ekim gelir).
4. Dosya seçilince "Dosya okunuyor…", sonra özet: **"12 satır okundu · 10 doğru · 2 hatalı ya da çakışan"** ve tablo **"Satır"**,
   **"Sınıf"**, **"Gün"**, **"Saat"**, **"Ders"**, **"Öğretmen"**, **"Durum"** ("Tamam" ya da kırmızı hata). Öğretmen sütunu boşsa dersin
   öğretmeni yazılır.
5. Altında ipucu: ""Programa aktar"da dosyadaki sınıfların programı (7-A, 8-B) dosyadaki doğru satırlarla değiştirilir; hatalı satırlar
   alınmaz."
6. **"Vazgeç"** / **"Programa aktar (10 satır)"** (doğru satır yoksa düğme kapalı). Aktarınca pencere kapanır, Ders programı sayfası
   dosyadaki ilk sınıfla açılır ve "10 ders 2 sınıfın programına aktarıldı · 5 Ekim 2026 tarihinden geçerli." İşlem kaydına "… ders
   programını dosyadan yükledi" ("7-A, 8-B · 10 ders") yazılır.
7. Dosyanın okunması:
   - başlıklar "Sınıf", "Gün", "Başlangıç", "Bitiş", "Saat", "Ders", "Öğretmen" (ve "Ders saati", "Ders adı") ile tanınır;
     "Sınıf", "Gün" ya da "Ders" başlığı yoksa sütun sırası Sınıf, Gün, Başlangıç, Bitiş, Ders, Öğretmen sayılır (ilk satır bir sınıf
     adıyla başlıyorsa o da veri sayılır);
   - **"Saat"** sütununa "08:30–09:10" ya da **"1. ders"** yazılabilir ([Okulun ders saatleri](ders-saatleri.md));
   - ders adı okulun "Dersler ve branşlar" listesinden ve kısaltmalarından tanınır.
8. Satır hataları (kırmızı, alınmaz): "Sınıf tanınmadı: 9-Z" (boşsa "Sınıf tanınmadı: boş"), "Gün tanınmadı: …", "Saat okunamadı",
   "Bitiş başlangıçtan önce", "Ders boş", "\"Astronomi\" ders listesinde yok (Dersler ve branşlar'dan ekle)", "Öğretmen okulda yok: …",
   "Çakışma: 3. satırla aynı saatte", "Öğretmen çakışması: Ayşe Kaya, 3. satırda 7-B'de".
9. Dosya hataları: "Bu dosya türü okunmaz; .xlsx, .xls, .ods ya da .csv seç.", "Bu Excel dosyası şifreli; Excel'de şifresini kaldırıp
   yeniden kaydet.", "Bu .xls dosyası okunamadı; bozuk olabilir. Excel'de açıp ".xlsx" olarak yeniden kaydet ve onu seç.", "Dosya
   okunamadı.", "Dosyada satır yok." — penceredeki "Dosya okunamadı" kutusunda.

## Kurallar ve sınırlar

Bugünkü site:

- **Kim:** "Excel ile içe ve dışa aktarım yapar" (müdür her zaman) VE her satırın sınıfı için "Ders programını düzenler". Aktarım yetkisi
  yoksa "Bu işlem için yetkin yok".
- **Dosya türü:** .xlsx, eski .xls, .ods, .csv (Windows-1254 Türkçe CSV de). Dosya kutusu .txt kabul etmez; altındaki "ya da düz metin
  olabilir" yazısı kişi aktarımı içindir. Şifreli .xls reddedilir.
- **Boyut:** tarayıcıda en çok 950 KB: "Dosya çok büyük (en fazla 950 KB). Listeyi ikiye bölüp iki kez yükle."; sunucuda
  "Dosya çok büyük. Listeyi bölüp iki dosya hâlinde yükle."; açılmış hâli en çok 60 MB, 20 000 satır, 200 sütun
  ([Önizleme ve hatalar](../excel-aktarim/onizleme-ve-hatalar.md)). Boş dosya "Dosya boş", dosyasız istek "Dosya seçilmedi".
- **Başlık bulunamazsa:** "Başlık satırı bulunamadı. İlk satırda şu sütunlar olmalı: Sınıf, Gün, Başlangıç, Bitiş, Ders. Boş şablonu
  indirip onun üzerine yazman en kolayı."
- **Satır hataları** (o satır eklenmez, öbürleri eklenir):
  - zorunlu alan boş: "Ders boş", "Bitiş ve Ders boş" (boş alanlar sütun sırasıyla sayılır);
  - '"Pazartesii" bir gün adı değil';
  - 'Başlangıç saati anlaşılmadı: "25:00"', 'Bitiş saati anlaşılmadı: "…"';
  - '"9-Z" adında bir sınıf yok' (sınıf aktarımla açılmaz);
  - "7-B sınıfının programını düzenleme yetkin yok";
  - '7-A sınıfında "Fizik" dersi tanımlı değil';
  - "Bitiş saati başlangıçtan sonra olmalı", "Bir ders 8 saatten uzun olamaz".
- **Atlananlar:** aynı sınıf + gün + başlangıç + ders programda zaten varsa "Bu ders saati zaten programda var"; dosyada aynısı daha önce
  geçtiyse "Dosyada 5. satırda aynısı var". Aynı dosyayı iki kez yüklemek bu yüzden ikinci kez bir şey eklemez.
- **Çakışma engellemez:** "Dikkat" satırları da eklenir. Önizleme satırları yalnız kayıtlı programla karşılaştırır; aynı dosyadaki iki
  satırın birbiriyle çakışması önizlemede görünmez, yükledikten sonra Ders Programı'nın listesine düşer.
- **Üzerine ekler:** var olan program silinmez. Silmek için Ders Programı sayfasında tek tek "Sil" (ya da dersi Sınıflar'dan silmek).
- **Sınır:** bir seferde en çok 300 ders saati eklenir: "Tek seferde en fazla 300 ders saati eklenebilir." (bu sınır önizlemede
  gösterilmez, onayda çıkar). Eklenecek satır yoksa "Eklenecek ders saati yok."
- **Hepsi ya da hiçbiri:** onaydan sonra satırlar tek işlemde yazılır; arada bir sorun olursa hiçbiri yazılmaz.
- **Eğitim yılı:** eklenenler o anki yıla damgalanır. Yıl seçicide geçmiş bir yıla bakarken "Kontrol et" bile reddedilir: "Geçmiş bir
  eğitim yılına bakıyorsun; kayıtlar salt okunur. Değişiklik için üstteki yıl seçiciden aktif yıla dön."
- **İşlem kaydı:** "Excel ile ders programı eklendi", ayrıntı "36 ders saati" ([Neler kaydedilir](../islem-kaydi/neler-kaydedilir.md)).
- **Bildirim:** Excel'den eklenen saatler için öğretmene bildirim gitmez (elle eklemedekinin aksine).
- **Dosya saklanmaz:** yalnız okunur; sunucuda kalmaz.
- **İletinin yeri:** dosya ve uygulama hataları 3. adımın altına yazılır; rapor kartı onun altındadır.

Şablonun anlatım sayfasıyla ayrılıklar (rapor edildi): "Öğretmen — Boş bırakırsan dersin kayıtlı öğretmeni kullanılır." yazar, oysa
dolu olsa da kullanılmaz; örnekteki "9-A · Salı · Fizik" satırı hata alır (Fizik sabit ders listesinde yok); "Sınıf … birebir aynı" der,
oysa harf ve tire farkı önemsizdir.

Tasarımda (Tasarım 1 önizlemesi) değişenler: dosyadaki sınıfların programı **değiştirilir** (bugün üzerine eklenir); "Geçerli" tarihi;
öğretmen sütunu kullanılır; aynı dosyadaki çakışmalar yakalanır ve alınmaz; ders adları okulun kendi listesinden; hata tablosu
pencerenin içinde.

## Kardeşler ve ilgili

**Kardeşler** (aynı klasör, [Ders programı](README.md)):

- [Ders programı kurma](program-kurma.md) — yükledikten sonra düzeltme; tasarımdaki "Excel'den" düğmesi.
- [Programı Excel olarak indirme](programi-indirme.md) — indirilen dosya aynı sütunlarla geri yüklenebilir.
- [Çakışma uyarısı](cakisma-uyarisi.md) — "Dikkat" satırları.
- [Okulun ders saatleri](ders-saatleri.md) — tasarımda "Saat" sütununa "1. ders".
- [Gün ve hafta görünümü](gun-ve-hafta-gorunumu.md), [Ders programım](programim.md),
  [Programı yayımlama ve haber verme](yayimlama-ve-bildirim.md).

**İlgili:**

- [Excel aktarım](../excel-aktarim/README.md): [İçeri aktarım](../excel-aktarim/ice-aktarim.md), [Boş şablon](../excel-aktarim/bos-sablon.md),
  [Önizleme ve hatalar](../excel-aktarim/onizleme-ve-hatalar.md), [Sütun eşleştirme](../excel-aktarim/eslestirme.md).
- [Sınıfa ders ve öğretmen atama](../siniflar-dersler/ders-atama.md), [Okulun kendi branşı ve dersi](../siniflar-dersler/ozel-brans-ve-ders.md).
- [Neler kaydedilir](../islem-kaydi/neler-kaydedilir.md), [Geçmiş yıla bakma](../egitim-yili/gecmis-yil.md).

## Kod tarafı

- Ön yüz: [public/js/parcalar/15-aktarim.md](../../public/js/parcalar/15-aktarim.md) — `AKTARIM_ADLARI.program`, üç adımlı kart,
  `aktarimDosyaBagla` (950 KB), `aktarim-sablon` (`GET /api/school/aktarim-sablon?tur=program`), `aktarim-yukle` (önizleme),
  `raporKarti` ("Ders eklenecek", `DURUM_AD`), `aktarim-uygula` (onay metni), `sonucKarti`.
- Sunucu: [sunucu/bolumler/okul.md](../../sunucu/bolumler/okul.md) — `POST /api/school/aktarim-ice { tur: 'program', dosya, dosyaAdi,
  uygula }`: sınıf, kapsam, ders, saat sırası, 8 saat, "zaten var", dosyada yinelenen, `aralikCakismasi` → `uyariMetni`; onayda
  `AKTARIM_SINIR` = 300, tek işlem, yıl damgası, işlem kaydı `program.toplu-eklendi`.
- Ayrıştırma: [sunucu/yardimci/aktarim.md](../../sunucu/yardimci/aktarim.md) — `SUTUNLAR.program` (başlık eşleri), `gune`, `saate`, `coz`,
  `sablon` ve "Nasıl doldurulur" anlatımı; dosya okuma: [sunucu/yardimci/tablo-oku.md](../../sunucu/yardimci/tablo-oku.md).
- Geçmiş yıl kapısı: [sunucu/api.md](../../sunucu/api.md) (`arsivYazmasiMi`: `aktarim-ice` + `tur: 'program'`).
- Testler: [testler/test-aktarim.md](../../testler/test-aktarim.md) (şablon, başlık eşleme, gün ve saat biçimleri, hatalı satırlar, bozuk
  dosya, yetki).

## Sık sorulanlar

- **Programı baştan yüklemek istiyorum; eski program silinsin.** Bugün yükleme yalnız ekler. Eski saatleri Ders Programı sayfasından
  tek tek sil (ya da dersi Sınıflar'dan silip yeniden ekle), sonra yükle.
- **Aynı dosyayı yanlışlıkla iki kez yükledim.** İkinci yüklemede bütün satırlar "Atlandı" olur; çift kayıt oluşmaz.
- **Öğretmen sütununa yazdığım öğretmen görünmüyor.** Öğretmen dersten gelir; Sınıflar → "Dersler" penceresinde dersin öğretmenini
  seç.
- **'7-A sınıfında "Fizik" dersi tanımlı değil' diyor.** Ders önce sınıfa eklenmeli; bugün eklenebilen dersler sabit dokuz derstir.
- **Excel'de saatler "0,3888" gibi görünüyor.** .xlsx, .xls ve .ods dosyasında sorun değil; saat biçimli hücreler de okunur. Ama
  saatleri "0,3888" diye virgüllü kesir olarak yazılmış bir CSV okunmaz ("Başlangıç saati anlaşılmadı"); hücreleri "09:20" biçimine
  çevir.
- **CSV'de Türkçe harfler bozuk çıkıyor mu?** UTF-8 ve Windows-1254 (Türkçe Excel'in CSV'si) okunur.

## Sırada

- Tasarım 1'deki "Ders programı yükle" penceresi: "Geçerli" tarihi, öğretmen sütunu, "1. ders" saat yazımı, dosyadaki sınıfların
  programını değiştirme.
- Özel branş ve ders: ders adları okulun kendi listesinden tanınacak.
- Yıl geçişi: yeni yılda programı geçen yıldan kopyalama (dosyasız yol).
- Şablon anlatımının düzeltilmesi (öğretmen sütunu, örnekteki ders adı).
