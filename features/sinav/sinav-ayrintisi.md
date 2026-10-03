# Sınavlar · Sınav ayrıntısı

**Durum:** Tasarlandı — henüz kodda yok

Bir sınava dokununca açılan pencere: sınavın adı, dersi, formu (şablonu), sınav tarihi, sonuç tarihi, sıra numaralı ölçümler
tablosu ve **"Raporla"** (tek sayfalık sonuç belgesi).

## Ne işe yarar

Kullanıcı 1 Ekim'de başka bir okul sisteminin "Sınav Detay" ekranını gösterip bizdekini istedi: **"burada form belirtilen
preset olacak; bizde ilk tarih bizim sınav olmadan önce kaydını girdiğimiz, ikincisi yazılan."** İkinci tarihin adı için
önerilen **"Sonuç tarihi"**ni onayladı (örnekteki "Gözlem Tarihi" yerine). Öğrenci ve veli bir sınavın bütün ölçümlerini
(ör. LGS puanı, doğru, yanlış, boş, net, net yüzdesi) tek bakışta görür, sonucun ne zaman girildiğini bilir ve isterse
yazdırır ya da PDF'e kaydeder.

## Nereden açılır

Tanıma göre öğrenci, veli, öğretmen ve müdür bir sınava dokununca. Tasarım 1 önizlemesinde şu yerlerden açılır:

- **Öğrenci:** "Sınavlarım"da bir sınav satırı ([Sınavlarım](sinavlarim.md)); İlerleyişim'de "Son sınavlar" listesi
  ([Sınavlar ve grup ortalamaları](../ilerleyis/sinavlar-ve-grup-ortalamalari.md)); sınav sonucu bildirimi; takvimde ve
  ajandada sınav satırı ([Ajanda](../takvim/ajanda.md)). (Öğrencinin ana sayfasında önizlemede sınav satırı yok.)
- **Veli:** İlerleyiş'te "Son sınavlar"; ana sayfada "Bugün olanlar"daki sonuç satırı ("Matematik 1. yazılı · sonuç açıklandı ·
  82") ve "Yaklaşanlar"; bildirim ("Elif'in sınav sonucu açıklandı").
- **Müdür:** "Okul düzeni → Sınavlar"da bir sınav satırı ([Okulun sınavları](okulun-sinavlari.md)).
- **Öğretmen:** tanımda var; önizlemede öğretmenin sınav listesindeki satırlar pencere açmaz (yalnız "Değer gir", "Düzenle",
  "Sil" düğmeleri vardır).

Bugünkü sitede böyle bir pencere yok: öğrenci sınav sonucunu "Sınavlarım" ve "İlerleyişim" kartlarında görür, sınav satırına
dokunulmaz.

## Adım adım

### Öğrenci

1. Bir sınava dokun. Pencere başlığı **"Sınav ayrıntısı"**; sağ üstte (sonuç varsa) **"Raporla"** düğmesi ve kapatma.
2. Üstte bilgi listesi:
   - **"Sınav:"** — sınavın adı, kalın ("LGS Deneme 1").
   - **"Ders:"** — "ders · öğretmen" ("Matematik · Ayşe Kaya"; ortak denemede "Deneme · Murat Şahin").
   - **"Form:"** — sınavın **hazır şablonunun** adı: "LGS Denemesi", "Test (D/Y/N)", "Yazılı (0–100)" ya da okulun kendi
     şablonu; şablonsuz sınavda **"Serbest"**.
   - **"Sınav tarihi:"** — sınav açılırken girilen gün ve saat: "10 Eylül 2026 Perşembe 10:00"; ders saatine denk geliyorsa
     sonunda "(2. ders)" gibi ders numarası. Saati olmayan eski sınavlarda yalnız gün.
   - **"Sonuç tarihi:"** — **senin** değerlerinin sisteme ilk yazıldığı an: "14 Eylül 2026 Pazartesi 11:52"; sonradan
     düzeltildiyse altında küçük **"son düzeltme: …"** (tanımda; önizleme bu satırı çizmedi). Tanımdaki metin
     "Sonuç girildi: 14 Eylül 2026 11:52" biçimindedir; önizleme etiketi "Sonuç tarihi:" yapıp tarihi yanına yazar. Sonuç
     henüz girilmediyse soluk **"sonuç henüz girilmedi"**.
3. Altında ölçümler tablosu (sonuç varsa): başlıkta ölçüm sayısı, **"Kod"**, **"Ölçüm"**, **"Değer"**. Satırlar:
   - **ana ölçüm en üstte**, vurgulu ("LGS · LGS Puanı · 488,888");
   - sonra şablondaki sırayla: "01.D · Doğru Sayısı · 87", "02.Y · Yanlış Sayısı · 2", "03.B · Boş Sayısı · 1", "04.H · Hatalı
     Sayısı · 0", "05.N · Net Sayısı · 86,330", "06.N% · Net Yüzdesi · 95,920";
   - hesaplanan ölçümün adının altı noktalı çizgili; üstüne gelince formülü: **"N = D − Y/3"**, **"N% = N / 90 × 100"**;
   - ondalıklar virgülle.
4. Sınav henüz yapılmadıysa (sonuç yok) tablo yerine: **"Sınav 15 Ekim 2026 Perşembe 10:10 (3. ders) tarihinde yapılacak."**
5. **"Raporla"**ya bas: tarayıcının yazdırma penceresi açılır (yazıcı ya da "PDF olarak kaydet"). Tek sayfalık belge:
   - başlık **"Test Ortaokulu · Sınav sonuç belgesi"** (okulun adı);
   - altında öğrencinin adı ve sınıfı ("Deniz Aydın · 7-A");
   - **"Sınav"**, **"Form"**, **"Sınav tarihi"**, **"Sonuç tarihi"** satırları;
   - **"# · Kod · Ölçüm · Değer"** tablosu.
   Yazdırma bitince sayfa eski hâline döner.

### Veli

- Çocuğunun sınavına dokununca aynı pencere; "Raporla" belgesinde çocuğun adı ve sınıfı yazar. Velide her çocuk ayrı oturum
  olduğu için pencere o oturumdaki çocuğun sonucunu gösterir ([Velide her çocuk ayrı oturum](../portallar/velide-cocuk-oturumlari.md)).

### Öğretmen

- Tanıma göre bir öğrencinin sınavına dokununca aynı pencere (o öğrencinin değerleriyle). Önizlemede öğretmenin listesinde
  pencereye giden satır yok; öğretmen değerleri tabloda görür ([Not (değer) girişi](not-girisi.md)). Nereden açılacağı
  kodlamada netleşecek (ör. öğrencinin portalından ya da Sınıflarım penceresinden).

### Müdür

- "Okul düzeni → Sınavlar"da bir satıra dokununca pencere açılır (önizlemede örnek sınavla). Tanımda pencere tek öğrencinin
  sonucudur; müdürün listesinden açılınca hangi öğrencinin değerlerinin gösterileceği (ya da sınavın özetinin) açık nokta.

## Kurallar ve sınırlar

- **Form = şablon:** sınav bir şablondan açıldıysa şablonun adı; şablonsuzsa "Serbest". (Bugün her sınav şablonunun kimliğini
  tutuyor ama ekranda göstermiyor.)
- **İki tarih:**
  - **Sınav tarihi** — sınav olmadan önce, sınav açılırken girilen gün **ve saat** (Türkiye saati). Bugün sınavın yalnız günü
    tutulur; saat için yeni alan gerekir; eski kayıtlar saatsiz gösterilir.
  - **Sonuç tarihi** — o öğrencinin değerlerinin sisteme **yazıldığı** an; sistem kendisi koyar, elle girilmez. Öğrenci başına
    "ilk yazılma" ve "son değişiklik" zamanı tutulur. Bugün değerlerin zamanı tutulmuyor.
- **Sıra:** ana ölçüm en üstte, sonra şablondaki sıra. Ölçümler "01.D" biçiminde sıra numaralı ve kodlu
  ([Ölçümler ve formül](olcumler-ve-formul.md)).
- **Hesaplanan ölçümler** de tabloda görünür; formül ipucu ölçümün adının üstünde.
- **Raporla:** tarayıcının yazdır / PDF'i kullanılır; sunucuda PDF üretilmez, dosya Eğitim Evi'ne kaydedilmez. Sonucu olmayan
  sınavda düğme çıkmaz.
- **LGS şablonuna eklenecekler** (tanım): D (Doğru), Y (Yanlış), B (Boş), N (Net = D − Y/3, hesaplanır), N% (Net yüzdesi =
  N / soru sayısı × 100, hesaplanır; soru sayısı şablonun sabiti), H (Hatalı), LGS puanı (elle; ana). Ders ders netler (TR,
  MAT, FEN …) bugünkü gibi kalır. Yeni şablonlar eski sınavları bozmaz.
- **KVKK:** kişisel veri değişmez ama sınav sonucunun **ne zaman girildiği** görünür olur; aydınlatma metnindeki sınav maddesine
  tek cümle eklenir ve sürümü artar (KVKK kuralı) ([Aydınlatma metni](../kvkk-ve-gizlilik/aydinlatma-metni.md)).
- **Görme yetkisi:** öğrenci kendi sonucunu, veli bağlı olduğu çocuğunkini, öğretmen ders verdiği öğrencininkini, müdür okulun
  öğrencisininkini görür (bugünkü sonuç görme kuralları).

## Kardeşler ve ilgili

**Kardeşler** (aynı klasör, [Sınavlar](README.md)):

- [Sınavlarım](sinavlarim.md) — pencerenin açıldığı liste.
- [Şablonlar](sablonlar.md) — "Form:" satırı.
- [Ölçümler ve formül](olcumler-ve-formul.md) — sıra numaralı ölçümler, formül ipucu.
- [Not (değer) girişi](not-girisi.md) — sonuç tarihinin yazıldığı an.
- [Sınav planlama](sinav-planlama.md) — sınav tarihi, saat, ders numarası.
- [Okulun sınavları](okulun-sinavlari.md) — müdürün listesi.
- [Sonuç bildirimi ve sonuçların görünmesi](sonuc-bildirimi.md) — bildirime dokununca pencere.

**İlgili:**

- [Sınavlar ve grup ortalamaları](../ilerleyis/sinavlar-ve-grup-ortalamalari.md) — "Son sınavlar" listesi.
- [Bildirim paneli](../bildirim/bildirim-paneli.md), [Ajanda](../takvim/ajanda.md).
- [Aydınlatma metni](../kvkk-ve-gizlilik/aydinlatma-metni.md).

## Kod tarafı

- Bugün bu pencerenin kodu yok. Dayanacağı parçalar: sınavın şablon kimliği (`sinavlar.sablon_id`) ve şablon adı
  ([sunucu/veri/depo/sinavlar.md](../../sunucu/veri/depo/sinavlar.md)), öğrencinin grupsuz sınavları ve ölçümleri
  ([sunucu/bolumler/ilerleyis.md](../../sunucu/bolumler/ilerleyis.md) `exams`), görme yetkisi
  ([sunucu/iliskiler.md](../../sunucu/iliskiler.md) `canSeeStudent`). Yeni gereken: sınav tarihine saat, `sinav_degerleri`'ne
  öğrenci başına ilk yazılma ve son değişiklik zamanı (yeni şema dosyası; [sunucu/veri/sema/SEMA.md](../../sunucu/veri/sema/SEMA.md)).
- Ön yüzde bugünkü sınav kartları [public/js/parcalar/13-ogrenci-veli.md](../../public/js/parcalar/13-ogrenci-veli.md)
  (`tekSinavKarti`) ve [public/js/parcalar/14-odev-filtre.md](../../public/js/parcalar/14-odev-filtre.md) (`SAYFALAR.sinavlarim`).
- KVKK: [public/kvkk/kvkk.html](../../public/kvkk/kvkk.html) (sınav maddesi).
- Kodlanınca bu belgenin "Durum" satırı ve bu bölüm güncellenir.

## Sık sorulanlar

- **"Form" ne demek?** Sınavın hangi hazır şablonla açıldığı: "LGS Denemesi", "Yazılı (0–100)" …; şablonsuzsa "Serbest".
- **İki tarih neden farklı?** "Sınav tarihi" sınavın yapıldığı (planlanan) gün ve saat; "Sonuç tarihi" senin notunun sisteme
  yazıldığı an.
- **Raporla PDF'i nereye kaydeder?** Tarayıcının yazdırma penceresinde "PDF olarak kaydet"i seçersen bilgisayarına ya da
  telefonuna; Eğitim Evi'ne bir şey kaydedilmez.
- **Net neden virgülden sonra üç basamak?** Önizlemedeki "86,330", kullanıcının gösterdiği örnek ekrandan alınmış gösterimdir.
  Tanıma göre elle girilen değerler en çok üç ondalıkla tutulur ("488,888"); hesaplanan ölçümler (Net) iki ondalığa yuvarlanır
  ("86,33").

## Sırada

- Sınav ayrıntı ekranı (kullanıcının 1 Ekim kararı): pencere, "Form", saatli sınav tarihi, sonuç tarihi (ilk yazılma + son
  düzeltme), "Raporla", KVKK cümlesi.
- Sınav: formüllü ölçüm (iş 14): hesaplanan ölçümler ve formül ipucu; LGS şablonuna D, Y, B, H, N, N%.
- Arayüz önizlemesi (Tasarım 1) koda geçerken: öğretmenin pencereye ulaşacağı yer.
