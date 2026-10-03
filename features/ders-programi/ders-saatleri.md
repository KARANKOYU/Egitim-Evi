# Ders programı · Okulun ders saatleri

**Durum:** Tasarlandı — henüz kodda yok.

Okulun zil düzeni: "1. ders 08:30–09:10, 2. ders 09:20–10:00 …"; program tablosu, bugünkü dersler, yoklama ve sınav tarihi dersin
numarasını bu saatlerle birlikte yazar.

## Ne işe yarar

Okulda herkes dersi numarasıyla konuşur: "3. derste yoklama", "sınav 4. derste". Kullanıcı 1 Ekim'de istedi: ders programı dersleri
**"1. ders, 2. ders"** diye göstersin ve bitiş saatini de yazsın; örnek düzen 40 dakika ders, 10 dakika teneffüs. Kararın kaydı:
sitede ders saatleri **okulun ayarıdır**; ekranlar (program tablosu, bugünkü dersler, yoklama, sınav tarihi) ders numarasını ve saat
aralığını birlikte yazar.

Bugünkü sitede böyle bir ayar yok. Her ders saatinin başlangıcını ve bitişini müdür tek tek yazar; ekrandaki "Ders 1, Ders 2"
numaraları haftanın saatlerinden hesaplanır ve okulun gerçek ders numarası olmayabilir
([Gün ve hafta görünümü](gun-ve-hafta-gorunumu.md)).

## Nereden açılır

Ayarın hangi sayfada, kim tarafından düzenleneceği henüz kararlaştırılmadı; Tasarım 1 önizlemesinde ayarın kendi ekranı yok, yalnız
kullanıldığı yerler var ve örnek saatler sabittir. Kullanıldığı yerler aşağıda rol rol.

Önizlemedeki örnek (ortaokul, hafta içi):

| Ders | Saat |
|---|---|
| 1. ders | 08:30–09:10 |
| 2. ders | 09:20–10:00 |
| 3. ders | 10:10–10:50 |
| 4. ders | 11:00–11:40 |
| 5. ders | 11:50–12:30 |
| 6. ders | 12:40–13:20 |

Dershane örneği (hafta sonu, Cumartesi ve Pazar): 1. ders 09:00–09:40, 2. ders 09:50–10:30, 3. ders 10:40–11:20, 4. ders 11:30–12:10.

## Adım adım

### Müdür

Tasarımda (Tasarım 1 önizlemesi):

1. **Ders programı** ızgarasında satırlar okulun ders saatleridir: ilk sütunda **"1. ders"** ve altında "08:30–09:10"
   ([Ders programı kurma](program-kurma.md)).
2. Günün yanındaki "+" ile açılan pencerede **"Saat"** alanının altında okulun ders saatleri çip olarak durur: **"1. ders · 08:30"**,
   **"2. ders · 09:20"** … Çipe basınca başlangıç ve bitiş birlikte dolar; saatleri elle değiştirirsen çipin seçimi kalkar.
3. Ders saatlerinin dışında bir saate ders koyabilirsin (ör. 14:00–14:40); o saat için ızgarada **"Ek saat"** satırı açılır.
4. Yeni ders penceresi o günün ilk boş ders saatiyle gelir.
5. Excel'den yüklerken **"Saat"** sütununa "08:30–09:10" ya da **"1. ders"** yazılabilir; "1. ders" okulun 1. ders saatine çevrilir
   ([Programı Excel'den kurma](excelden-program.md)).
6. Programı Excel olarak indirirken sınıf dosyasının ilk sütunu "1. ders 08:30–09:10" biçimindedir
   ([Programı Excel olarak indirme](programi-indirme.md)).
7. Müdürün ana sayfası okulun o günkü derslerini numarayla gösterir: **"Bugünün dersleri"** kutusunda her satır "1. ders" ve
   "08:30–09:10", yanında o saatte dersi olan sınıflar ("7-A Mat"); **"Gün seç"** ile başka güne bakılır (kullanıcı 29 Ağustos: "sadece
   o günkü dersler ders 1 ders 2 … 9-a mat gibi"; [Müdürün ana sayfası](../ana-sayfa/mudur-ana-sayfasi.md)).

### Çalışan

Programı kurma yetkisi olan çalışan ızgarayı ve çipleri müdür gibi kullanır.

### Öğretmen

Tasarımda:

- **Ders programım** tablosunun satırları "1. ders 08:30–09:10" …; başlığın yanında "ders 40 dk · teneffüs 10 dk".
- Ana sayfada **"Bugünkü derslerin"**: "1. ders · 7-A · Matematik · 08:30–09:10", süren derste "· şu an"
  ([Öğretmenin ana sayfası](../ana-sayfa/ogretmen-ana-sayfasi.md)).
- Yoklama sayfasında ders düğmeleri "3. ders · 8-B · şu an", başlamamış derste "5. ders · 7-C · başlamadı (11:50)"
  ([Ders programından yoklama](../devamsizlik/programdan-yoklama.md)).
- Dersten önce bildirim: **"3. ders 10 dakika sonra başlıyor"** ([Ders başlamadan öğretmene bildirim](../bildirim/ders-oncesi-bildirim.md)).
- Sınav tarihinde ders: "15 Ekim · 3. ders (10:10)" ([Sınav planlama](../sinav/sinav-planlama.md)).

### Öğrenci

Tasarımda:

- **Ders programı** Günlük'te her satır "1. ders" + ders + "08:30–09:10 · Ayşe Kaya"; Haftalık'ta satırlar "1. ders 08:30–09:10"
  ([Gün ve hafta görünümü](gun-ve-hafta-gorunumu.md)).
- Ana sayfa: alt başlıkta "şu an 3. ders: Matematik (10:10–10:50)", yan kutuda **"Bugünkü dersler"**
  ([Öğrencinin ana sayfası](../ana-sayfa/ogrenci-ana-sayfasi.md)).
- Devamsızlıkta "Ders ders" görünüm: "1. ders · Türkçe · 08:30–09:10".

### Veli

Çocuğun programında ve devamsızlığında öğrencininkiyle aynı numaralar ve saatler.

### Tahta

Tasarımda tahta hesabı sınıf seçince o sınıfın **"Bugünkü dersler"** listesini numarayla görür: "1. ders · Türkçe · 08:30–09:10",
süren derste "· şu an"; dersi yoksa "Bugün bu sınıfın dersi yok." ([Sınıf seçme](../tahta/sinif-secme.md)).

## Kurallar ve sınırlar

- **Ayarın kendisi:** her ders saati bir numara, başlangıç ve bitişten oluşur. Örnek düzen 40 dakika ders, 10 dakika teneffüs; okul
  kendi zil düzenini yazar.
- **Program serbest kalır:** ders saatlerinin dışına da ders konabilir ("Ek saat").
- **Devamsızlığın gün durumu** o günün ilk ve son dersine bakar ("okulun ders saatleri ve o günkü program"; kullanıcı 2 Ekim) —
  [Günün durumu](../devamsizlik/gun-durumu.md).
- **Kararlaştırılmayanlar:** ayarın ekranı ve yetkisi; günden güne farklı zil (ör. Cuma kısa gün) olup olmayacağı; öğle arası gibi uzun
  aranın nasıl gösterileceği; ders saati değişince programdaki eski saatlerin ne olacağı. Önizlemede bunların örneği yok.
- **Bugünkü kodla ilişkisi:** bugün programdaki her kayıt kendi saatini taşır; ayar gelince numaralar bu kayıtların saatleri okulun ders
  saatleriyle eşleştirilerek verilecek (eşleşmeyen "Ek saat").

## Kardeşler ve ilgili

**Kardeşler** (aynı klasör, [Ders programı](README.md)):

- [Ders programı kurma](program-kurma.md) — ızgaranın satırları ve saat çipleri.
- [Gün ve hafta görünümü](gun-ve-hafta-gorunumu.md) — bugünkü "Ders N" hesabı.
- [Programı Excel'den kurma](excelden-program.md) — "Saat" sütununa "1. ders".
- [Programı Excel olarak indirme](programi-indirme.md) — sınıf dosyasının "Saat" sütunu.
- [Ders programım](programim.md), [Çakışma uyarısı](cakisma-uyarisi.md), [Programı yayımlama ve haber verme](yayimlama-ve-bildirim.md).

**İlgili:**

- [Ders başlamadan öğretmene bildirim](../bildirim/ders-oncesi-bildirim.md), [Ders programından yoklama](../devamsizlik/programdan-yoklama.md),
  [Günün durumu](../devamsizlik/gun-durumu.md), [Sınav planlama](../sinav/sinav-planlama.md).
- [Öğrencinin ana sayfası](../ana-sayfa/ogrenci-ana-sayfasi.md), [Öğretmenin ana sayfası](../ana-sayfa/ogretmen-ana-sayfasi.md),
  [Müdürün ana sayfası](../ana-sayfa/mudur-ana-sayfasi.md), [Tahta: sınıf seçme](../tahta/sinif-secme.md).

## Kod tarafı

Henüz kod yok. Bugün yerine geçen hesap: [public/js/parcalar/21-ders-programi.md](../../public/js/parcalar/21-ders-programi.md)
(`dersSiralari`, `siralaraYerlestir`: haftanın saatlerinden "Ders N"). Programın saat alanları:
[sunucu/veri/depo/siniflar.md](../../sunucu/veri/depo/siniflar.md) (`ders_programi.baslangic`, `bitis`). Kodlanınca okulun ayarının
saklandığı yer ve ekranı bu bölüme eklenir.

## Sık sorulanlar

- **Bugün "1. ders" yazdırabilir miyim?** Hayır; bugün "Ders 1, Ders 2" haftanın saatlerinden hesaplanır.
- **Okulumuzda Cuma dersleri daha kısa.** Bugünkü sitede sorun değil (her saat serbest yazılır, aynı sıraya düşer). Ders saatleri
  ayarında günlere göre fark olup olmayacağı henüz kararlaştırılmadı.
- **40/10 zorunlu mu?** Hayır; önizlemedeki örnek düzen. Okul kendi saatlerini yazacak.

## Sırada

- Okulun ders saatleri ayarı ve bütün ekranlarda "N. ders · başlangıç–bitiş" yazımı (kullanıcı 1 Ekim; Tasarım 1).
- Devamsızlık: tarih aralığı, gün gün / ders ders ve günün durumu (ilk ve son derse göre).
- Etüt planlama: canlı boş zaman ızgarası ders saatlerini ve programı kullanacak.
