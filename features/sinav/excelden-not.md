# Sınavlar · Excel'den not yükleme ve indirme

**Durum:** Tasarlandı — henüz kodda yok

Bir sınavın değerlerini Excel dosyasıyla (ya da Excel'den kopyalanan hücrelerle) toplu yüklemek ve sınavın bütün değerlerini
Excel olarak indirmek.

## Ne işe yarar

Optik okuyucudan, başka bir sınav uygulamasından ya da kendi çizelgesinden gelen 30 öğrencinin 7 ölçümünü tek tek yazmak
yerine öğretmen boş şablonu indirir, doldurur ve yükler; önizlemede hatalı satırları görür, sonra kaydeder. Kullanıcı 28 Eylül'de
anket konuşurken **"sınavları Excel'le olur"** dedi; tanımda (spec-sinav-formul) "Notları Excel'den yükle" ve "Notlar Excel'e
indirilebilir" diye işlendi. Bu sözün sınav **notlarını** mı yoksa yalnız quiz sorularını mı kastettiği kullanıcıya soruldu,
cevap gelmedi; tasarım ikisini de kapsar (quiz tarafı: [Soruları Excel'den aktarma](../quiz/excelden-soru-aktarma.md)).

## Nereden açılır

- **Tasarımda (Tasarım 1 önizlemesi):** bir sınavın değer girişi sayfasında, araç satırında **"Excel'den aktar"** ve **"Excel
  olarak indir"** düğmeleri ([Not (değer) girişi](not-girisi.md)). Sınav bitmeden (değer girişi kapalıyken) bu düğmeler de yok.
- **Müdür:** "Excel Aktarım" sayfasının **"Dışarı aktar"** sekmesinde, **"Ne indireceksin?"** listesindeki **"Not çizelgesi"**
  satırı (alt yazısı "sınıf ve ders seçerek, hesaplanan ölçümler dahil") ve **"Excel"** düğmesi
  ([Dışarı aktarım](../excel-aktarim/disa-aktarim.md)).
- **Bugünkü sitede yok:** değerler yalnız tabloya tek tek yazılır; Excel Aktarım sayfası öğrenci ve servisçi listeleriyle ders
  programını işler, sınav değerlerini işlemez.

## Adım adım

### Öğretmen

**Excel'den aktarmak (tasarım)**

1. Değer girişi sayfasında **"Excel'den aktar"**a bas. Pencere başlığı **"Excel'den aktar · 7-A · LGS deneme 1"** (sınıf · sınav).
2. **Adım 1:** "Boş şablonu indir: okul no, ad soyad ve D, Y, B, H, LGS sütunları." (sınavın **elle girilen** ölçümlerinin
   kodları; hesaplanan ölçümler şablonda yoktur) ve **"Boş şablonu indir"** düğmesi. Dosya "7-A-lgs-deneme-1-sablon.xlsx" gibi
   adlanır; kısa ileti **"Boş şablon indirildi: 7-A-lgs-deneme-1-sablon.xlsx."** Dosyada ilk satır başlıklar ("Okul no", "Ad
   soyad", "D", "Y" …), altında sınıfın her öğrencisi okul numarası ve adıyla, değer hücreleri boş.
3. Şablonu Excel'de doldur.
4. **Adım 2:** "Doldurduğun Excel dosyasını seç (.xlsx ya da .csv) ya da Excel'deki hücreleri kopyalayıp yapıştır."
   - dosyayı kutuya sürükle (**"Dosyayı buraya sürükle ya da"**) ya da **"Dosya seç"**e bas (.xlsx, .csv, .xls); kutuda
     dosyanın adı görünür;
   - ya da Excel'de hücreleri seçip kopyala ve altındaki metin kutusuna yapıştır (yer tutucu "Okul no;Ad soyad;D;Y;B;H;LGS").
5. Önizleme kendiliğinden çıkar:
   - özet: **"28 satır aktarılacak"**, hata varsa yanında kırmızı **"· 2 hatalı satır atlanacak"**;
   - hatalı satırların listesi, satır numarası ve nedeniyle:
     - **"5. satır: öğrenci bu sınıfta yok (215)."**
     - **'6. satır: D sayı değil ("on sekiz").'**
     - **"7. satır: D değeri 95 · 0–90 arasında olmalı."**
     - başlıkta ölçüm sütunu yoksa tek satır: **"Başlık satırında ölçüm sütunu bulunamadı (beklenen: D, Y, B, H, LGS)."**
   - aktarılacak ilk 8 satırın tablosu ("Öğrenci" ve ölçüm sütunları); fazlası için **"… ve 20 satır daha"**.
6. Dosya okunamazsa önizlemenin üstünde kırmızı: **"Bu dosya türü okunmaz; .xlsx ya da .csv seç."** ya da **"Dosya okunamadı."**
   (Önizlemede eski .xls için "Eski Excel (.xls) dosyası bu önizlemede açılamıyor (gerçek sitede sunucu okur)…" çıkar; gerçek
   sitede .xls'i sunucu okur.)
7. **"Vazgeç"** ya da **"Aktar (28)"** (aktarılacak satır yoksa düğme kapalı).
8. "Aktar" değerleri tabloya yazar, pencere kapanır: **"28 öğrencinin değerleri aktarıldı; Kaydet ile kaydet."** Hesaplanan
   ölçümler (Net …) tabloda kendiliğinden dolar. Değerler henüz kaydedilmedi: tabloyu gözden geçir, **"Kaydet"**e bas.

**Excel olarak indirmek (tasarım)**

1. Değer girişi sayfasında **"Excel olarak indir"**.
2. Dosya "7-A-lgs-deneme-1-degerler.xlsx" gibi adlanır; kısa ileti **"İndirildi: 7-A-lgs-deneme-1-degerler.xlsx."**
3. Dosyada "Okul no", "Ad soyad" ve sınavın **bütün** ölçümleri (hesaplananlar dahil) "D (Doğru Sayısı)", "N (Net Sayısı)"
   gibi başlıklarla; boş değer boş hücre, sayılar en çok 3 ondalık.

### Müdür

- Tasarımda "Excel Aktarım → Dışarı aktar → Not çizelgesi"nde **"Excel"**e basınca **"Not çizelgesi · Excel"** penceresi açılır:
  **"Sınıf"** (ör. "7-A") ve **"Ders"** (ör. "Matematik") seçilir; altında not **"Sütunlar: Okul no, ad soyad, 1. yazılı, 2. yazılı,
  performans, ortalama; en altta sınıf ortalaması. Dosya .xlsx olarak iner; Excel, LibreOffice ve Google E-Tablolar açar."**;
  düğmeler **"Vazgeç"** ve **"İndir (.xlsx)"**. İndirince kısa ileti **"not-cizelgesi-7-A-matematik.xlsx indirildi · 7-A ·
  Matematik · N öğrenci."** (N: sınıfın öğrenci sayısı) ve işlem kaydına "Excel indirdi" satırı düşer. Seçimle hiç satır
  çıkmazsa **"Bu seçimle indirilecek satır yok."** (Önizlemenin sütunları örnektir ve sabittir; satırın açıklaması "hesaplanan
  ölçümler dahil" der, hangi sınavların sütun olacağı kodlamada netleşir.)
- Müdürün açtığı bir sınavda değerleri, notu girmeye seçtiği öğretmenler aynı "Excel'den aktar" ile yükler
  ([Okulun sınavları](okulun-sinavlari.md)).

### Çalışan

- Değer girişine yetkisi olan (Öğretmen rolü olan ya da "Sınav notu girer"i bulunan) çalışan öğretmen gibi kullanır.

## Kurallar ve sınırlar

- **Hangi sütunlar:** boş şablonda okul no, ad soyad ve **elle girilen** her ölçüm; hesaplananlar şablonda yoktur, yüklenince
  hesaplanır. İndirilen dosyada hesaplananlar da vardır. Tanım sütun başlığını ölçümün sıra numarası ve adıyla da verir
  ("01.D Doğru Sayısı" biçimi, [Ölçümler ve formül](olcumler-ve-formul.md)); önizleme şablonda yalnız kodu yazar.
- **Ayırıcı:** yapıştırılan metinde sekme, noktalı virgül ya da virgül (ilk satıra bakılarak seçilir); tırnaklı hücreler açılır.
- **Başlık satırı:** ilk hücre sayı değilse ilk satır başlık sayılır; sütunlar başlıktaki **koda ya da ada** göre eşlenir
  ("D" ya da "Doğru Sayısı"; parantezli ek "D (Doğru Sayısı)" yok sayılır), "Okul no" / "No" ve "Ad …" tanınır. Başlık yoksa
  sütun sırası "okul no, ad soyad, ölçümler (şablondaki sırayla)" kabul edilir.
- **Öğrenci eşleme:** önce okul numarasıyla, bulunamazsa ad soyadla (büyük/küçük harf ve Türkçe harf farkı gözetilmeden);
  bulunamayan satır **"öğrenci bu sınıfta yok"** diye atlanır. Yalnız o sınavın sınıfı.
- **Değer:** boş hücre o ölçümü değiştirmez; sayı değilse ya da aralığın dışındaysa satırın tamamı atlanır (nedeniyle
  listelenir). Virgül ve nokta ondalık sayılır.
- **Kaydetme:** "Aktar" değerleri tabloya yazar; kalıcı kayıt **"Kaydet"**le olur (tanım: önizleme → Kaydet, tek işlem). İlk
  kayıtta öğrenciye ve veliye bildirim gider ([Sonuç bildirimi ve sonuçların görünmesi](sonuc-bildirimi.md)).
- **Dosya türleri:** sunucu .xlsx, .xls, ODS ve CSV okur (okulun var olan tablo okuyucusu); Excel'e yazma da okulun var olan
  .xlsx yazıcısıyla.
- **Kişisel veri:** indirilen dosyada öğrencilerin adı, okul numarası ve notları vardır; bilgisayarda saklarken dikkat
  ([Kim neyi görür](../kvkk-ve-gizlilik/kim-neyi-gorur.md)).

## Kardeşler ve ilgili

**Kardeşler** (aynı klasör, [Sınavlar](README.md)):

- [Not (değer) girişi](not-girisi.md) — düğmelerin olduğu sayfa ve "Kaydet".
- [Ölçümler ve formül](olcumler-ve-formul.md) — hangi ölçümün elle girildiği, hesaplananlar.
- [Şablonlar](sablonlar.md) — sütunlar sınavın ölçümleridir.
- [Okulun sınavları](okulun-sinavlari.md) — müdürün açtığı sınavda notu girecek öğretmen.

**İlgili:**

- [Dışarı aktarım](../excel-aktarim/disa-aktarim.md) — "Not çizelgesi".
- [Önizleme ve hatalı satırlar](../excel-aktarim/onizleme-ve-hatalar.md) — öğrenci listesi aktarımındaki aynı mantık.
- [Soruları Excel'den aktarma](../quiz/excelden-soru-aktarma.md) — quiz sorularının Excel'i.
- [Eklenti nedir](../eklentiler/eklenti-nedir.md) — tasarımda bir dış sınav uygulamasının sonuçlarını sınava yazan eklenti.

## Kod tarafı

- Bugün bu özelliğin kodu yok. Kullanılacak var olan parçalar: tablo okuyucu
  [sunucu/yardimci/tablo-oku.md](../../sunucu/yardimci/tablo-oku.md) (xlsx/xls/ODS/CSV), okulun .xlsx yazıcısı
  ([sunucu/bolumler/okul.md](../../sunucu/bolumler/okul.md) `xlsxGonder`), değer yazma ucu `POST /api/exams/<id>/grades`
  ([sunucu/bolumler/sinav.md](../../sunucu/bolumler/sinav.md)); ön yüzde değer tablosu
  [public/js/parcalar/12-ogretmen-sinav.md](../../public/js/parcalar/12-ogretmen-sinav.md) ve Excel aktarım ekranı
  [public/js/parcalar/15-aktarim.md](../../public/js/parcalar/15-aktarim.md).
- Kodlanınca bu belgenin "Durum" satırı ve bu bölüm güncellenir.

## Sık sorulanlar

- **Net sütununu Excel'e yazmalı mıyım?** Hayır; boş şablonda hesaplanan ölçümler yok, yüklenince hesaplanır.
- **Excel'imde okul numarası yok, yalnız adlar var.** Olur: ad soyadla eşlenir. Aynı adlı iki öğrenci varsa okul numarası yaz.
- **Aktardım ama öğrenciler görmüyor.** "Aktar" yalnız tabloyu doldurur; "Kaydet"e basman gerekir.
- **Bir satır neden atlandı?** Önizlemedeki hata listesinde satır numarası ve nedeni yazar (öğrenci sınıfta yok, sayı değil,
  aralık dışında).

## Sırada

- Sınav: formüllü ölçüm + notları Excel'den yükleme/indirme + quiz sorularını Excel'den aktarma (iş 14; öneri sunuldu, notların
  Excel'i için kullanıcının cevabı bekleniyor).
- Excel Aktarım'da müdürün "Not çizelgesi" dışa aktarımı (tasarım).
- Yıl geçişi (iş 9): yıl sonu arşivinin Excel'inde "not/sınav sonuçları" sayfası ([Okul yedeği](../egitim-yili/okul-yedegi.md)).
