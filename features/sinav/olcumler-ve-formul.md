# Sınavlar · Ölçümler ve formül

**Durum:** Kodda var; tasarımda ek olarak sıra numaralı ve kodlu ölçümler ("01.D Doğru Sayısı"), "Elle girilir / Hesaplanır" türü, kodlarla yazılan formül (ör. `D - Y/4`), "Örnek" sütunu ve "Formül dene".

Bir sınavın değer alanları (ölçümleri): her birinin adı, aralığı ve hangisinin "ana" olduğu; tasarımda bir de kodu, sırası ve
hesaplanan ölçümün formülü.

## Ne işe yarar

Eğitim Evi'nde bir sınav tek bir not değildir. Yazılıda tek "Puan" vardır; testte doğru, yanlış ve net; denemede her dersin
neti ve LGS Puanı. Her ölçümün kendi aralığı olur (0–100, 0–500, −10–20) ve değerler ondalıklı yazılabilir ("490,161"). Bir
ölçüm **ana** ölçümdür: sınavın "sonucu" odur; ortalamaya, grup hesabına ve grafiğe o girer.

Bugünkü düzen kullanıcının 25 Eylül isteğinden gelir: **"sınavlar istediğimiz aralık 0-1000 bile olabilir, sınır (-10000)-(10.000)
… hoca sınavı girerken yeni değer ekle+ ekleyince ad: doğru, yanında değer kutusu"** (bugünkü "+ Yeni değer ekle" ve ±10000
sınırı). Kullanıcı 28 Eylül'de **"sınav notları doğrulu yanlışlı ve şey olabilsin; yeni değer ekleyip toplam(d(id) - değeri, a(id'nin
ismi) değeri gibi, nasıl?"** diye sordu: bugün Net gibi değerler elle girilir, tasarımda hesaplanır (`N = D - Y/4`). 1 Ekim'de
de **"benim gibi 1, 2, 3, 4 diye girilen isimlendirilmiş değerler"** istedi: tasarımda her ölçüm sıra numaralı ve adlıdır
("01.D Doğru Sayısı", "02.Y Yanlış Sayısı").

## Nereden açılır

- **Bugünkü site:**
  - açık bir sınavın değer tablosunun üstünde **"+ Yeni değer ekle / alanları düzenle"** → pencere **"Değer alanları"**
    ([Not (değer) girişi](not-girisi.md));
  - "Şablonlar" sekmesinde **"Yeni şablon"** ve **"Düzenle"** pencereleri ([Şablonlar](sablonlar.md)).
  - Ölçümler ayrıca çip olarak görünür: şablon kartlarında ve açık sınavın üstünde "**Doğru** 0 – 100" (ana olan vurgulu).
- **Tasarımda (Tasarım 1 önizlemesi):** **"Sınav aç"** penceresinin **"3. Ölçümler"** adımı ([Yeni sınav açma](yeni-sinav.md));
  öğretmenin "Sınav grupları" sayfasında **"Ölçümler · LGS Denemesi şablonu"** bölümü ve **"Formül dene"** kutusu; değer
  tablosunun sütun başlıkları; "Sınav ayrıntısı" penceresindeki ölçümler tablosu ([Sınav ayrıntısı](sinav-ayrintisi.md)).

## Adım adım

### Öğretmen

**Değer alanları düzenleyicisi (bugünkü site)**

1. Düzenleyicinin başında **"Değer adı · Alt · Üst"** başlık satırı, altında her alan için bir satır:
   - **ad** kutusu (en çok 60 karakter, boş satırda yer tutucu "Doğru");
   - **alt** ve **üst** sınır kutuları (virgüllü yazılabilir);
   - **"Ana"** seçeneği (bütün satırlarda tek seçim);
   - **"Sil"**.
2. **"+ Yeni değer ekle"** sona boş bir satır ekler (ad boş, 0–100, ana değil) ve imleç adına gider.
3. Satır **"Sil"**i onay sormaz, satırı hemen kaldırır; asıl silme "Kaydet"te olur. Tek satır kaldıysa silinmez: **"En az bir
   değer alanı kalmalı."**
4. Düzenleyicinin altında ipucu: **"Ana değer ortalamaya ve grafiğe girer. Sınırlar -10000 ile 10000 arası; ondalık için
   virgül kullanabilirsin (ör. 490,161)."**
5. Açık bir sınavın penceresinde ("Değer alanları") ek ipucu: **"Bir alanı silersen o alana girilmiş değerler de silinir."**;
   düğmeler **"Vazgeç"**, **"Kaydet"**. Kaydedince pencere kapanır, tablo yeni alanlarla yeniden çizilir (sınavın alanları
   şablondan kopyalandığı için şablon değişmez).

Ekranda **kod** yazılmaz: her alanın bir kodu vardır (P, D, Y, N, LGS …) ama kutusu yoktur. Yeni alanın kodunu sunucu adından
üretir: kelimelerin baş harfleri ("Doğru Sayısı" → "DS", en çok 6 harf), aynısı varsa sonuna sayı ("DS2"). Var olan alanın kodu
korunur.

**Tasarımda: "3. Ölçümler" tablosu (Tasarım 1 önizlemesi)**

1. Başlık **"3. Ölçümler"**, yanında **"Sıra · kod · ad; hesaplanan ölçüm formülle (kodlarla) yazılır"**.
2. Tablo sütunları: **"Sıra · Kod · Ad · Tür · Formül · Aralık · Ana · Örnek"** ve satır sonunda silme (çarpı) düğmesi.
   - **Sıra:** "01.", "02." … — satırın yeri; kendiliğinden verilir.
   - **Kod:** büyük harfe çevrilir; harfle başlar, en çok 6 karakter (harf, rakam ve "%"): D, Y, N, N%, LGS, TR.
   - **Ad:** "Doğru Sayısı" gibi.
   - **Tür:** **"Elle girilir"** ya da **"Hesaplanır"**.
   - **Formül:** yalnız "Hesaplanır"da yazılır (yer tutucu "ör. D - Y/4"); "Elle girilir"de kapalı ve boş.
   - **Aralık:** "en az – en çok" iki sayı kutusu.
   - **Ana:** tek seçim; sonuç olarak görünen ölçüm.
   - **Örnek:** örnek değerlerle formülün sonucu (ör. D=18, Y=4 → N=17); elle ölçümde örnek değerin kendisi.
3. Hatalı satır kırmızı olur ve "Örnek" sütununda hata yazar:
   - **"Kod büyük harfle başlamalı"**, **"Kod tekrar ediyor"**;
   - formülde **"Bilinmeyen kod: X"**, **"Parantez kapanmamış"**, **"Beklenmeyen: …"**, **"Formül eksik"**, **"Formül boş"**,
     **"Sıfıra bölme"**.
4. Tablonun altında **"Ölçüm ekle"** (yeni satır: kod "K" + sıra, ad "Yeni ölçüm", elle, 0–100; ilk ölçümse ana) ve
   **"Örnek sütunu, örnek değerlerle (D=18, Y=4…) formülün sonucunu gösterir."**
5. Satır silmek onay ister: **"N ölçümü silinsin mi?"** (kodla). Ana ölçüm silinirse ana son ölçüme geçer.
6. Kırmızı satır varken sınav açılmaz: **"Kırmızı satırlardaki ölçümleri düzelt."**; ana seçilmemişse **'Bir ölçümü "Ana" seç
   (sonuç olarak görünen).'**

**Tasarımda: formülü yazmak**

1. Ölçümün türünü **"Hesaplanır"** yap, **"Formül"**e yaz: `D - Y/4`, `D - Y/3`, `TR + MAT + FEN`, `Y1*0.4 + Y2*0.6`,
   `N / 90 * 100`.
2. İzinli olanlar: sayılar (ondalık nokta ya da virgülle), ölçüm **kodları**, `+ - * /` ve parantez. Çarpma ve bölme toplama ve
   çıkarmadan önce yapılır; başa eksi yazılabilir.
3. Formül **kodla** yazılır, sıra numarasıyla değil: ölçümlerin sırası değişse de formül bozulmaz.
4. Yazarken "Örnek" sütunu canlı sonucu gösterir; bilinmeyen kod, döngü (ölçümün kendisine dayanması) ve sıfıra bölme uyarılır.
5. Sonuç iki ondalığa yuvarlanır; aralığın dışına çıkarsa uyarı verilir.

**Tasarımda: "Formül dene" (öğretmenin "Sınav grupları" sayfası)**

1. **"Ölçümler · LGS Denemesi şablonu"** bölümünde her ölçüm: kod rozeti ("01.D"), ad ("Doğru Sayısı") ve sağda **"elle
   girilir"** ya da formülü (**"= D - Y/3"**, **"= N / 90 * 100"**).
2. En altta **"Formül dene"** kutusu (içinde `D - Y/3`); altında sonucu: **"D=87, Y=2 → 86,33"**.
3. Kutuya yazdıkça sonuç değişir; hatada **"Bilinmeyen kod ya da işaret (izinli: D Y B H, + - * / ve parantez)"**, **"Sıfıra
   bölme"** ya da **"Formül tamamlanmadı"**.

### Müdür

- Bugünkü sitede kendi sınavlarında ve okulun bütün şablonlarında öğretmenle aynı düzenleyiciyi kullanır.
- Tasarımda "Sınav aç" penceresinin "3. Ölçümler" adımı müdürde de aynıdır.

### Çalışan

- Bugünkü sitede açık bir sınavın alanlarını değiştirmek **"Sınav oluşturur"** yetkisi ister (sınavın dersine göre); yetkin
  yoksa düğme yine görünür ama "Kaydet" **"Sınav düzenleme yetkin yok"** der. Yeni şablon açmak yetki istemez.
- Tasarımda Öğretmen rolü olan çalışan öğretmen gibi.

### Öğrenci

- Ölçümleri sonuçlarında görür: bugün Sınavlarım ve İlerleyişim'de ana değer etikette, öbürleri çip olarak
  ([Sınavlarım](sinavlarim.md)).
- Tasarımda "Sınav ayrıntısı" penceresinde sıra, kod, ad ve değer tablosu; hesaplanan ölçümün adının üstüne gelince formülü
  ("N = D − Y/3").

### Veli

- Çocuğunun sonuçlarında öğrenciyle aynısını görür.

## Kurallar ve sınırlar

- **Sayı:** bir sınavda ya da şablonda en az 1, en çok 30 ölçüm: **"En az bir değer alanı gerekli"**, **"En fazla 30 değer
  alanı olabilir"**.
- **Ad:** zorunlu, en çok 60 karakter: **"Her değer alanının bir adı olmalı"**. Okunamayan satır: **"Değer alanı okunamadı"**.
- **Aralık:** alt boşsa 0, üst boşsa 100 sayılır. İkisi de sayı olmalı (virgül kabul): **'"Doğru" için alt ve üst sınır sayı
  olmalı'**; −10000 ile 10000 arası: **"Sınırlar -10000 ile 10000 arasında olmalı"**; alt üstten küçük olmalı: **'"Doğru" için
  alt sınır üst sınırdan küçük olmalı'**.
- **Ana:** her sınavda tam bir ana ölçüm. Hiç seçilmezse ilki, birden çok seçilirse ilk seçilen ana olur.
- **Kod:** sınav içinde tek. Bugün en çok 12 karakter, boşluksuz, büyük harf; boşsa ya da çakışıyorsa sunucu üretir.
- **Aralığı daraltmak:** girilmiş bir değeri dışarıda bırakacak daraltma reddedilir: **'"Net" için girilmiş 3 değer yeni
  aralığın dışında kalıyor'**.
- **Alan silmek:** o alana girilmiş bütün değerler de silinir (geri alınmaz).
- **Sıra:** bugün satırların sırası alanların sırasıdır; yeni alan sona eklenir, sıra ekranda değiştirilemez.
- **Yetki:** açık bir sınavın alanlarını değiştirmek "Sınav oluşturur" ister (**"Sınav düzenleme yetkin yok"**); sınav yalnız
  açanınındır.
- **Formül bugün yok:** Net gibi değerler elle girilir; hesap yapılmaz.
- **Tasarımda (tanım, kullanıcının 28 Eylül ve 1 Ekim istekleri):**
  - ölçüm türü "Elle girilir" ya da "Hesaplanır"; hesaplanan ölçüm elle girilemez, girilen değer değişince kendiliğinden
    güncellenir;
  - formül için **kendi küçük hesaplayıcımız** kullanılır: sunucuda ve tarayıcıda aynı kurallar, kod çalıştırma (eval) yok;
  - sonuç 2 ondalığa yuvarlanır; aralık dışı, bilinmeyen kod, döngü ve sıfıra bölme uyarılır;
  - her ölçüm ekranda ve Excel'de "01.D Doğru Sayısı" biçiminde görünür (sıra iki haneli, nokta, kod, ad); sıra ölçüm
    eklenirken verilir, sürükleyerek değiştirilebilir (önizlemede sürükleme yok); kod sınav içinde tek;
  - ondalık virgülle gösterilir ("488,888").

## Kardeşler ve ilgili

**Kardeşler** (aynı klasör, [Sınavlar](README.md)):

- [Şablonlar](sablonlar.md) — ölçümlerin hazır listeleri.
- [Yeni sınav açma](yeni-sinav.md) — "3. Ölçümler" adımı.
- [Not (değer) girişi](not-girisi.md) — değerlerin yazıldığı tablo; tasarımda hesaplanan sütunlar.
- [Excel'den not yükleme ve indirme](excelden-not.md) — Excel'de elle girilen ölçümler sütun olur.
- [Sınav ayrıntısı](sinav-ayrintisi.md) — tasarımda ölçümler tablosu ve formül ipucu.
- [Sınav grupları](sinav-gruplari.md) — grup hesabına ana ölçüm girer.

**İlgili:**

- [Sınav grafiği](../ilerleyis/sinav-grafigi.md) — ölçüm ölçüm çizgi grafik.
- [Sınavlar ve grup ortalamaları](../ilerleyis/sinavlar-ve-grup-ortalamalari.md) — ana değer etiketi ve öbür ölçümlerin çipleri.

## Kod tarafı

- Ön yüz: [public/js/parcalar/12-ogretmen-sinav.md](../../public/js/parcalar/12-ogretmen-sinav.md) — `olcumCipleri`,
  `olcumSatiri`, `olcumDuzenleyici`, `olcumleriTopla`, `EYLEMLER['olcum-ekle']`, `['olcum-sil']`, `['sinav-olcum-duzenle']`,
  `['sinav-olcum-kaydet']`.
- Sunucu: [sunucu/bolumler/sinav.md](../../sunucu/bolumler/sinav.md) — `olcumleriDogrula` (1–30, ad, aralık, kod, tek ana),
  `kodUret`, `DEGER_SINIR`, `EN_FAZLA_OLCUM`, `POST /api/exams/<id>/olcumler` (daraltma denetimi `aralikDisi`); depo
  [sunucu/veri/depo/sinavlar.md](../../sunucu/veri/depo/sinavlar.md) (`olcumleriYaz`: var olan güncellenir, yenisi eklenir,
  listede olmayan değerleriyle silinir); virgüllü sayı [sunucu/ortak.md](../../sunucu/ortak.md) (`ondalik`).
- Testler: [testler/test-sinav.md](../../testler/test-sinav.md) (kod üretimi, alt > üst ve ±10000 reddi, "+ yeni değer ekle"de
  eski değerlerin korunması, dışarıda bırakan daraltmanın reddi).

## Sık sorulanlar

- **Net'i elle mi yazacağım?** Bugün evet. Tasarımda Net "Hesaplanır" türünde, `D - Y/4` gibi formülle kendiliğinden dolar.
- **Bir alanı sildim, değerler nereye gitti?** Alanla birlikte silindi; geri gelmez.
- **Aralığı daraltamıyorum.** O alana girilmiş bazı değerler yeni aralığın dışında kalıyor; önce o değerleri düzelt.
- **Ana değer ne işe yarar?** Sınavın sonucu odur: grup ortalamasına ve ilerleyişteki etikete o girer; sınav grafiği de
  ilk açıldığında ana ölçümü çizer.
- **Formüle sıra numarası yazabilir miyim?** Hayır; formül kodlarla yazılır (`D`, `Y`), böylece sıra değişince bozulmaz.

## Sırada

- Sınav: formüllü ölçüm + Excel + grup üst değeri (iş 14): ölçüm türü, formül, kendi hesaplayıcımız, sıra numaralı kodlar,
  sürükleyerek sıralama.
- Arayüz önizlemesi (Tasarım 1) koda geçerken: "3. Ölçümler" tablosu, "Örnek" sütunu, "Formül dene".
