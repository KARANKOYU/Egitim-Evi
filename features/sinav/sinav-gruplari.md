# Sınavlar · Sınav grupları

**Durum:** Kodda var; tasarımda ek olarak grubun üst değeri (100, 125, 500 ya da başka), payın yüzde ve puan olarak gösterilmesi, bağlı kaydırıcılar, kilit, "Eşit dağıt", girilmemiş sınav ayarı ("Hesaba katma" / "0 say"), öğrencide grubun solunda sonucu ve tıklayınca ayrıntı tablosu.

Birkaç sınavı tek bir sonuçta birleştiren isteğe bağlı kap: her sınavın bir payı (etki oranı) olur, grup sonucu bu paylarla
hesaplanır.

## Ne işe yarar

Dönem notu gibi hesaplar için: "1. yazılı %25, 2. yazılı %25, proje %50". Kullanıcı ilk isteğinde (28 Ağustos) öğretmenin
"dönem1 yarı 1 yazılı etkileme %50" gibi gruplar açabilmesini istedi; 25 Eylül'de grubun **isteğe bağlı** olmasını ("sınav
grubu olmadan da tak diye olabilecek"). 28 Eylül'de ayrıntıyı anlattı: **"içine koyulan sonuçların yüzde kaçının alınacağını
seçebileceksin, mesela 3 sınav koydun … 25-25-50 … ve toplam yüz olur; sınav grubunun solunda orada çıkan sayı yazar, üzerine
tıklayınca ayrıntılar"**; aynı akşam üst değeri ("sonuç 125 olmalı yazarım … 2×50 1×25") ve kaydırıcıları ("slider ile, biri
diğerlerini etkileyerek, birini sabit tutup öbürüyle paylaşma") ekledi. Bugünkü sitede grup sonucu hep 100 üzerindendir ve paylar
sınav açılırken tek tek yazılır; üst değer, kaydırıcı ve kilit tasarımdadır.

## Nereden açılır

- **Öğretmen ve müdür (bugünkü site):** "Sınavlar" sayfasının **"Gruplar"** sekmesi; bir grup kartına basınca grubun ekranı.
  Sınavı gruba koymak "Yeni sınav" penceresindeki **"Grup"** ve **"Etki oranı (%)"** ile ([Yeni sınav açma](yeni-sinav.md)).
- **Öğrenci (bugünkü site):** **"Sınavlarım"** sayfasında her grup ayrı bir tablo; **"İlerleyişim"**de "Sınav grubu
  ortalamaları" kartı. **Veli:** çocuğunun portalındaki "Sınavları" ve "İlerleyiş" sayfası.
- **Tasarımda (Tasarım 1 önizlemesi):**
  - öğretmenin "Sınavlar" sayfasında **"Sınav grupları"** çipi → **"Sınav grupları"** sayfası (sağ üstte **"Sınav grubu
    aç"**);
  - müdürün "Okul düzeni → Sınavlar" sayfasında **"Sınav grubu aç"** ([Okulun sınavları](okulun-sinavlari.md));
  - "Sınav aç" penceresinde **"Sınav grubu"** seçimi;
  - öğrencinin **"Sınavlarım"** sayfasında en üstte **"Sınav grupları"** bölümü.

## Adım adım

### Öğretmen

**Gruplar sekmesi (bugünkü site)**

1. "Sınavlar" → **"Gruplar"**. Yetkin varsa **"Yeni sınav grubu"** düğmesi; altında ipucu **"Grup isteğe bağlı: dönem
   ortalaması gibi etki oranlı hesap için kullan."**
2. **"Sınav grupları (N)"** başlığı altında kartlar (adına göre sıralı): grubun adı, dersi, **"3 sınav"** etiketi ve **"Toplam
   etki %100"** etiketi — toplam tam 100 ise yeşil, değilse turuncu. Kartın tamamı tıklanır. Grup yoksa **"Henüz sınav grubu
   yok."**

**Grup açmak**

3. **"Yeni sınav grubu"** → pencere **"Yeni sınav grubu"**: **"Grup adı"** (yer tutucu "Dönem 1 - Yarıyıl 1", en çok 100
   karakter); **"Vazgeç"**, **"Oluştur"**. Grubun dersi senin branşındır (öğretmende ders sorulmaz).
4. Başarılıysa pencere kapanır, "Gruplar" sekmesi açılır.

**Gruba sınav koymak**

5. Grubun kartına bas → grubun ekranı → **"Sınav ekle"**: "Yeni sınav" penceresi bu grup seçili açılır. **"Etki oranı (%)"**
   yaz (50 dolu gelir; 0'dan büyük, en çok 100) ve **"Aç ve değer gir"**.
6. Ya da "Yeni sınav"da **"Grup"** listesinden grubu seç.

**Grubun ekranı**

7. Başlıkta grubun adı büyük harfle, altında "Matematik · sınav grubu". Düğmeler: **"Sınav ekle"** (yetkin varsa), **"Geri"**
   (Gruplar sekmesine döner), sağda kırmızı **"Grubu sil"**.
8. **"Sınavlar"**: her sınav bir satır — ad; "25.09.2026 · Yazılı (0-100) · 18 öğrencinin değeri girildi"; **"Etki %25"**
   etiketi; **"Değer gir"**; **"Sil"** (silince grup ekranına dönersin). Sınav yoksa **"Bu grupta henüz sınav yok."**
9. **"Grup ortalamaları (100 üzerinden, ağırlıklı)"**: ders verdiğin sınıfların her öğrencisi (müdürde okulun bütün öğrencileri)
   bir satır — ad, ortalama kadar dolu ince çubuk, sağda etiket: ortalama en çok iki ondalıkla ("87,5"), 50 ve üstü yeşil,
   50'nin altı kırmızı; hiç değeri yoksa gri **"Değer yok"**. Öğrenci yoksa **"Ders verdiğin sınıflarda öğrenci yok."**

**Grubu silmek**

10. **"Grubu sil"** → tarayıcı onayı **"Sınav grubu ve içindeki tüm sınavlar silinsin mi?"** → grup, içindeki bütün sınavlar
    ve değerleriyle birlikte silinir; "Gruplar" sekmesi açılır.

**Tasarımda: "Sınav grubu aç" penceresi (Tasarım 1 önizlemesi)**

1. **"Sınav grubu aç"** → pencere **"Sınav grubu aç"**.
2. **"Grubun adı"** — yer tutucu "ör. 7-A Matematik 1. dönem".
3. **"Üst değer"** — çipler **"100"** (seçili), **"125"**, **"500"** ve "başka" kutusu (1–10000). Altında: **"Hepsi tam olunca
   grubun sonucu 100 olur. Sınavın kendi aralığı (0–10, 0–500) önce oranlanır."**
4. **"Sınavlar ve payları"** — yanında **"Birini oynatınca fark kilitsiz olanlara oranla dağılır; kilitliler değişmez"**. Her
   sınav bir satır: onay kutusu, adı ve altında küçük bilgisi ("7-A · Matematik · 8 Ekim", "7. sınıflar · 15 Ekim · 500
   üzerinden"). Seçili sınavda: kaydırıcı (0–100), sayı kutusu, **"%40 · 40 puan"** (pay yüzdesi ve üst değere göre katkı
   puanı) ve kilit düğmesi. Seçili olmayan sınavda **"gruba katılmıyor"**.
5. Kaydırıcıyı ya da sayıyı değiştir: aradaki fark kilitli olmayan öbür sınavlara mevcut paylarıyla orantılı dağılır (hepsi
   0 ise eşit); kilitliler değişmez; yer kalmazsa kaydırıcı durur. Toplam hep %100'e tamamlanır.
6. Kilit düğmesi o sınavın payını sabitler (kaydırıcısı ve kutusu kapanır); yeniden basınca açılır.
7. **"Eşit dağıt"** — kilitli olmayan sınavlara kalan payı eşit böler (artan son sınava). Yanında **"Toplam %100"** (100 değilse
   kırmızı).
8. **"Girilmemiş sınav"** — **"Hesaba katma (payı öbürlerine oranla dağılır)"** (varsayılan) ya da **"0 say"**.
9. Örnek satırı: **"Örnek: [öğrenci] 1. yazılıdan 85, 2. yazılıdan 92, projeden 100 alırsa grup sonucu 90,8 / 100"** (önizleme
   burada örnek bir öğrenci adı yazar; sonuç seçili paylara ve üst değere göre değişir).
10. **"Vazgeç"** ya da **"Grubu aç"**. Hatalar: **"Grubun adını yaz."**, **"Gruba en az iki sınav koy."**, **"Payların toplamı
    %100 olmalı (şu an %90)."** Başarılıysa **"Sınav grubu açıldı: 7-A Matematik 1. dönem · 3 sınav · sonuç 100 üzerinden"**.

**Tasarımda: "Sınav grupları" sayfası**

1. Başlık **"Sınav grupları"**, sağ üstte **"Sınav grubu aç"**; altında çipler **"Sınavlar"** / **"Sınav grupları"** (seçili).
2. Her grup bir bölüm: başlıkta adı ("7-A · Matematik 1. dönem") ve sağda **"sonuç 100 üzerinden"**.
3. **"Grubun üst değeri"** — **"100"** / **"125"** çipleri; altında **"Hepsi tam olunca sonuç 100 olur"**.
4. Her sınav bir satır: adı, kaydırıcı, **"%25 · 25 puan"**, kilit. Kaydırıcılar penceredeki gibi birbirine bağlıdır.
5. Altta **"Eşit dağıt"** ve **"Kaydet"** (**"Grup ağırlıkları kaydedildi."**).
6. Tanıma göre bu sayfada ayrıca grubun öğrencileri listelenir ve her öğrencinin **solunda grup sonucu** yazar (ör. "98,5 /
   125"); dokununca ayrıntı açılır (sınav, aldığı değer, oranı, katkısı). Önizleme bu listeyi çizmedi.
7. Önizlemede aynı sayfanın altında "Ölçümler · LGS Denemesi şablonu" ve "Formül dene" de durur
   ([Ölçümler ve formül](olcumler-ve-formul.md)).

### Müdür

- Bugünkü sitede "Kendi Derslerim → Sınavlar → Gruplar". Grup açarken pencerede ayrıca **"Ders"** seçilir (Matematik, Türkçe,
  İngilizce, Din Kültürü ve Ahlak Bilgisi, Sosyal Bilgiler, Fen Bilimleri, Müzik, Resim, Beden Eğitimi). Yalnız kendi
  gruplarını görür; ortalamalarda okulun bütün öğrencileri çıkar.
- Tasarımda "Okul düzeni → Sınavlar"daki **"Sınav grubu aç"** aynı penceredir; okulun sınavlarından (ör. "LGS deneme 1 · 7.
  sınıflar · 500 üzerinden") grup kurar.

### Çalışan

- Bugünkü sitede "Yeni sınav grubu" düğmesi ve grup açmak "Sınav oluşturur" yetkisi ister (grubun dersine göre; yoksa **"Sınav
  açma yetkin yok"**). **"Grubu sil"** ise yetkiye bakmaz, yalnız grubun sahibi olmaya bakar: "Sınav oluşturur"u kaldırılmış
  biri tek bir sınavı silemez ama kendi grubunu içindeki bütün sınavlarla silebilir (bilinen açık).
- Tasarımda Öğretmen rolü olan çalışan öğretmen gibi.

### Öğrenci

**Bugünkü site**

1. **"Sınavlarım"** sayfasında, grafiğin ve "Sınavlar" kartının altında her grup bir kart: grubun adı, altında "ders · öğretmen".
2. Kartta tablo: **"Sınav"**, **"Etki"** ("%25"), **"Not"** — ana ölçümdeki değerin (aralık 0–100 değilse yanında soluk "/ 500"
   gibi üst sınır), girilmemişse soluk "-".
3. Tablonun altında **"Grup ortalaması"** ve soluk **"100 üzerinden"**, ince çubuk ve etiket (50 ve üstü yeşil, altı kırmızı;
   değer yoksa gri "Değer yok").
4. **"İlerleyişim"**de "Sınav grubu ortalamaları" kartı aynı ortalamaları satır satır gösterir
   ([Sınavlar ve grup ortalamaları](../ilerleyis/sinavlar-ve-grup-ortalamalari.md)).

**Tasarımda (Tasarım 1 önizlemesi)**

1. **"Sınavlarım"**ın en üstünde **"Sınav grupları"** bölümü. Her grup bir satır: solda büyük yazıyla grup sonucu (bir ondalık)
   ve küçük **"/ 100"** (grubun üst değeri; tanımdaki örnek "98,5 / 125"); ortada grubun adı ("7-A · Matematik 1. dönem"),
   altında "öğretmen · 3 sınav · 1 tanesi sonuçlandı"; sağda **"Ayrıntı"**.
2. Satıra dokununca pencere (başlığı grubun adı):
   - üstte grup sonucu ("82 / 100"), **"Grup sonucu"** ve "öğretmen · payların toplamı %100 · 1 / 3 sınav girildi";
   - tablo **"Sınav · Aldığın · Oran · Pay · Katkı"**: girilmiş sınavda "82 / 100", "%82", "%25", "20,5"; girilmemiş sınavda
     adın altında küçük planlanan tarihi ("12 Kasım"), "girilmedi", payı ve "—";
   - altta **"Girilen sınavların katkısı"** satırı (payların toplamı ve katkıların toplamı);
   - ipucu: **"Girilmemiş sınavlar hesaba katılmaz; payları girilenlere oranla dağılır: 20,5 / 25 → 82 / 100. Öbür sınavlar
     girildikçe sonuç değişir."**;
   - **"Kapat"**.

### Veli

- Bugünkü sitede çocuğunun portalındaki **"Sınavları"** sayfasında öğrencinin gördüğü tabloları, **"İlerleyiş"**te grup
  ortalamalarını görür (yalnız bağlı olduğu çocuk).
- Tasarımda velinin menüsünde "Sınavları" yok ve önizleme velide grup sonucunu çizmedi; tanıma göre veli çocuğunun grup sonucunu
  ve ayrıntısını öğrenci gibi görür (nerede göreceği açık nokta, [Sınavlarım](sinavlarim.md#veli)).

## Kurallar ve sınırlar

- **Bugünkü hesap (sunucuda):** her sınavın ana ölçüm değeri önce 100'lüğe çevrilir: (değer − alt) / (üst − alt) × 100.
  Grup ortalaması = Σ (100'lük değer × etki oranı) / Σ etki oranı, iki ondalık. Değeri girilmemiş sınav hesaba katılmaz (payı
  öbürlerine oranla dağılır); hiçbir değer yoksa "Değer yok". Örnek: 0–100'lük yazılıdan 80 (etki %50) ve 0–500'lük denemeden 400
  (etki %50) → (80 × 50 + 80 × 50) / 100 = **80**. Alt sınır sıfır değilse hesaba girer: 100–500 aralıklı "LGS Puanı"nda 400,
  (400 − 100) / 400 × 100 = 75 sayılır.
- **Etki toplamı 100 olmak zorunda değil:** oranlar birbirine göre ağırlıktır; kart toplam 100 değilse turuncu uyarır.
- **Etki oranı:** 0'dan büyük, en çok 100 (**"Etki oranı 0'dan büyük, en fazla 100 olmalı"**). Sınav açıldıktan sonra etki oranı
  ve sınavın grubu değiştirilemez (bugün düğme yok).
- **Grup adı:** zorunlu, en çok 100 karakter: **"Grup adı gerekli (örn: Dönem 1 - Yarıyıl 1)"**.
- **Kimin grubu:** grup açanınındır; başkası açmak isterse **"Yetkin yok"**, olmayan grup **"Sınav grubu bulunamadı"**. Müdür de
  başka öğretmenin grubunu açamaz. Grubun dersi öğretmende branşı, müdürde seçtiği ders.
- **Silme:** grup silinince içindeki **bütün sınavlar ve değerleri** de silinir; geri alınmaz.
- **Öğrencide hangi gruplar:** öğrencinin, grubun herhangi bir sınavının ana ölçümünde değeri olan gruplar; bakılan eğitim yılında.
- **Eğitim yılı:** grup açıldığı yıla damgalanır; liste seçili yıla süzülür; geçmiş yıla bakarken grup açılamaz (409).
- **Tasarımda (tanım, kullanıcının 28 Eylül isteği; öneri sunuldu, onay bekliyor):**
  - grubun **üst değeri** (varsayılan 100; ör. 125); her sınavın payı iki biçimde görünür ve girilir: yüzde (%25) ya da katkı
    puanı (31,25 / 125); katkı puanıyla girilirse ("50, 50, 25") üst değer toplamdır (125);
  - sınavın kendi aralığı ne olursa olsun (0–100, 0–500) ana ölçüm önce oranlanır: katkı = (değer − alt) / (üst − alt) × pay ×
    üst değer; hepsi tam ise sonuç üst değere eşittir;
  - kaydırıcı + sayı kutusu + kilit; biri oynatılınca fark kilitsizlere mevcut oranlarıyla paylaşılır (hepsi 0 ise eşit),
    kilitliler değişmez, yer yoksa kaydırıcı durur; toplam hep %100; "Eşit dağıt";
  - girilmemiş sınav için grup ayarı: "hesaba katma" (varsayılan) ya da "0 say";
  - gruba en az iki sınav;
  - eski gruplar bozulmaz: üst değer 100, yüzde = etki / Σ etki.

## Kardeşler ve ilgili

**Kardeşler** (aynı klasör, [Sınavlar](README.md)):

- [Yeni sınav açma](yeni-sinav.md) — sınavı gruba koymak, etki oranı.
- [Sınavlarım](sinavlarim.md) — öğrencinin grup tabloları; tasarımda grup sonucu ve ayrıntı.
- [Okulun sınavları](okulun-sinavlari.md) — tasarımda müdürün "Sınav grubu aç"ı.
- [Ölçümler ve formül](olcumler-ve-formul.md) — grup hesabına ana ölçüm girer.
- [Silme, eğitim yılı ve saklama](silme-ve-saklama.md).

**İlgili:**

- [Sınavlar ve grup ortalamaları](../ilerleyis/sinavlar-ve-grup-ortalamalari.md) — İlerleyişim'deki "Sınav grubu ortalamaları".
- [Sınıflarım](../siniflar-dersler/siniflarim.md) — öğretmenin öğrenci penceresinde "Ortalama (100 üzerinden)".
- [Kutucuklar](../ana-sayfa/kutucuklar.md) — öğrencinin "Sınavlarım" kutucuğunda "N sınav grubu", "İlerleyişim"de ortalama.

## Kod tarafı

- Ön yüz: [public/js/parcalar/12-ogretmen-sinav.md](../../public/js/parcalar/12-ogretmen-sinav.md) — `grupListesi`, `grupAc`,
  `EYLEMLER['grup-ac']`, `['grup-yeni']`, `['grup-kaydet']`, `['grup-sil']`; öğrencinin tabloları
  [public/js/parcalar/14-odev-filtre.md](../../public/js/parcalar/14-odev-filtre.md) (`SAYFALAR.sinavlarim`) ve
  [public/js/parcalar/13-ogrenci-veli.md](../../public/js/parcalar/13-ogrenci-veli.md) (`grupOrtalamaKarti`).
- Sunucu: [sunucu/bolumler/sinav.md](../../sunucu/bolumler/sinav.md) — `GET/POST /api/examgroups`, `GET /api/examgroups/<id>`
  (`averages`, `yuzluk`), `POST /api/examgroups/<id>/delete`; öğrencinin grupları
  [sunucu/bolumler/ilerleyis.md](../../sunucu/bolumler/ilerleyis.md) (`examGroups`, `average`); depo
  [sunucu/veri/depo/sinavlar.md](../../sunucu/veri/depo/sinavlar.md) (`ogretmeninGruplari`, `grupEkle`, `grupSil`, `grubun`,
  `ogrencininGruplari`).
- Testler: [testler/test-sinav.md](../../testler/test-sinav.md) (grup ortalaması 100 üzerinden; 0–100 ile 0–500 birlikte → 80;
  grupta etki oranının şart olması), [testler/test-egitim-yili.md](../../testler/test-egitim-yili.md) (arşiv yılında grup açma 409).
- Kullanıcıya dönük anlatım: [belge/KILAVUZ.md](../../belge/KILAVUZ.md) "Sınav sistemi" (grup örneği).

## Sık sorulanlar

- **Etkileri 50 + 50 + 50 yazdım, olur mu?** Olur; oranlar birbirine göre ağırlıktır (her biri üçte bir). Kart "Toplam etki %150"
  diye turuncu uyarır.
- **Henüz yapılmamış sınav ortalamayı düşürür mü?** Bugün hayır; değeri olmayan sınav hesaba katılmaz. Tasarımda bu grup ayarıdır
  ("Hesaba katma" ya da "0 say").
- **500'lük denemeyle 100'lük yazılı aynı grupta olur mu?** Olur; her biri önce 100'lüğe çevrilir.
- **Etki oranını değiştirmek istiyorum.** Bugün sınavı silip yeniden açmak gerekir. Tasarımda grup sayfasındaki kaydırıcılarla.
- **Grubu silersem sınavlar kalır mı?** Hayır; içindeki bütün sınavlar ve değerleri de silinir.

## Sırada

- Sınav: formüllü ölçüm + Excel + **sınav grubu üst değeri, yüzde/katkı puanı, bağlı kaydırıcılar + kilit** (iş 14; öneri
  sunuldu, onay bekliyor).
- Arayüz önizlemesi (Tasarım 1) koda geçerken: "Sınav grubu aç" penceresi, "Sınav grupları" sayfası, öğrencinin "Sınav grupları"
  satırı ve ayrıntı penceresi.
