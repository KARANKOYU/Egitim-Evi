# İlerleyiş · Sınav sonuçları sütun grafiği

**Durum:** Tasarlandı — henüz kodda yok

İlerleyişim'de her sınavın bir sütun olduğu grafik: sütunun üstünde sınavın sonucu yazar, boyu sonucun tam puana oranı
kadardır.

## Ne işe yarar

Kullanıcı 28 Ağustos'ta ilerleyişte sonuçların "grafik olarak her birinin üstünde sütun grafiği olarak" yazmasını istedi.
Bugünkü sitede ödev sonuçları böyle bir sütun grafiğinde ([Ödev sonuçları grafiği](odev-grafigi.md)), sınavlar ise çizgi
grafikte ([Sınav grafiği](sinav-grafigi.md)). İstek denetimi Tasarım 1 önizlemesinde sınavların sütun olarak gösterilmediğini
buldu ("Sınav sonuçları sınav sınav sütun olarak gösterilmiyor"); önizlemeye bu grafik eklendi. Böylece öğrenci son
sınavlarını ders ders, farklı türden sınavları (100'lük yazılı, net, 500'lük deneme) aynı boyda karşılaştırarak görür.

## Nereden açılır

Tasarımda (Tasarım 1 önizlemesi):

- Öğrencinin **"İlerleyişim"** sayfasında, "Derslere göre ortalama" kutusunun altında, "Ödev sonuçları" grafiğinin solunda.
- Velinin her çocuk oturumundaki **"İlerleyiş"** sayfasında aynı yerde ([Velinin İlerleyiş sayfası](velinin-ilerleyis-sayfasi.md)).

## Adım adım

### Grafiğin düzeni (tasarım)

1. Kutunun başlığı **"Sınav sonuçları"**, solunda mavi zeminde sınav simgesi; sağında küçük açıklama **"sütun: tam puana
   oranı"**.
2. Her sınav bir sütun, eskiden yeniye soldan sağa (önizlemede: LGS Deneme 1 · 10 Eylül, Unit 2 quiz · 19 Eylül,
   Matematik 1. yazılı · 23 Eylül).
3. Sütunun **üstünde** sınavın ana ölçümünün değeri, girildiği gibi: "488,888" (LGS puanı), "17,5" (net), "82" (puan).
4. Sütunun **boyu** değerin tam puana oranı: önizlemede yazılıda 100, LGS denemesinde 500, testte doğru + yanlış + boş
   (soru sayısı) üzerinden; oran 0 ile %100 arasına kırpılır, sıfırdan büyük değer en az %2'lik bir çubuk olur.
5. Sütunun **rengi** dersin rengi (önizlemede Matematik kırmızı, Türkçe turuncu, Fen yeşil, İngilizce mavi, Sosyal mor,
   deneme gri).
6. Sütunun **altında** dersin kısaltması kalın ("MAT", "İNG", "DNM") ve sınavın kısa tarihi ("23 Eyl").
7. Fareyle sütunun üstüne gelince ipucu: "Matematik 1. yazılı · Puan 82 / 100 (%82)".
8. Kutu "Ödev sonuçları" grafiğiyle yan yana; her biri en az 320 piksel, dar ekranda alt alta. Sütun alanı 220 piksel
   yüksekliğinde.

### Öğrenci

1. Menüden **"İlerleyişim"**.
2. "Sınav sonuçları" grafiğinde son sınavlarına bak; sütunun üstündeki sayı aldığın sonuç, boyu tam puana göre ne kadar
   yaklaştığın.
3. Bir sınavın ayrıntısı için aşağıdaki **"Son sınavlar"** listesinde satırına dokun: "Sınav ayrıntısı" penceresi açılır
   ([Sınavlar ve grup ortalamaları](sinavlar-ve-grup-ortalamalari.md), [Sınav ayrıntısı](../sinav/sinav-ayrintisi.md)).
   Önizlemede sütunun kendisine dokunmak bir şey açmaz.

### Veli

1. Çocuğun oturumunda menüden **"İlerleyiş"**.
2. Grafik yalnız o çocuğun sınavlarını gösterir (önizlemede Can'ın oturumunda "Matematik kısa sınavı" 13,75 net ve
   "Türkçe 1. yazılı" 88).

### Müdür, öğretmen ve çalışan

Öğrencinin portalını açan müdür ve "Portalına bakar" yetkili kişi aynı sayfayı öğrencinin gözünden görür (önizlemede
"Portalını aç" yalnız bir bildirim gösteriyor; [Öğrencinin portalını açma](../hesaplar/ogrenci-portalini-acma.md)).

## Kurallar ve sınırlar

Tasarımda yazılı olanlar:

- Yalnız sonucu girilmiş (ana ölçümünde değeri olan) sınav sütun olur; sonucu henüz girilmemiş sınav grafikte yer almaz
  ("Son sınavlar" listesinde "Sonuç yok" diye durur).
- Değer ekranda girildiği gibi yazılır (ondalık virgülle); boy yalnız karşılaştırma içindir.
- Velide her çocuk ayrı oturum: grafikte yalnız o çocuğun sınavları.

Kodlanırken karar verilecekler (tasarımda yazmıyor; öneri, kullanıcıya sorulmadı):

- **Tam puan:** önizleme şablonun adına bakıyor (yazılı 100, LGS 500, test soru sayısı). Kodda her ölçümün bir aralığı
  var (alt–üst; ör. LGS Puanı 100–500, Net −100–100); sınav grubu ortalamasıyla aynı kural, (değer − alt) / (üst − alt),
  doğal karşılık olur. Önizlemedeki "17,5 / 20" gibi soru sayısına göre oran ise ancak şablona soru sayısı girilince
  (sınav ayrıntı ekranı kararındaki "N% = N / soru sayısı × 100") hesaplanabilir.
- **Kaç sınav:** önizlemede iki-üç sınav var. Çok sınavda son N sınav mı gösterilsin, alan yatay mı kaysın, bakılan eğitim
  yılının bütün sınavları mı gelsin — açık.
- **Çizgi grafikle ilişkisi:** bugünkü [Sınav grafiği](sinav-grafigi.md) (aynı şablonlu sınavların çizgisi, bant, Liste)
  önizlemede yok; kullanıcı kalkmasını söylemedi. Bu belge ikisinin birlikte duracağını varsayar.
- **Veri:** bugünkü `/api/progress` cevabında grupsuz sınavlar (`exams`) bütün ölçümleriyle, gruplu sınavlar
  (`examGroups[].exams`) ana ölçümün değeri ve aralığıyla geliyor; grafik bu ikisinden kurulabilir. Okul sınırı ve yıl
  süzgeci bugünkü ilerleyişteki gibi kalır: bakılan eğitim dönemi gelir; öğrenci ve veli önceki okulların dönemlerini yıl
  seçiciden seçebilir, okul personeli yalnız kendi okulunun kayıtlarını görür. (Bugünkü çizgi [Sınav grafiği](sinav-grafigi.md)
  ise yıla bakmaz; bu grafik onun kuralıyla mı ilerleyişin kuralıyla mı çalışacak, kodlanırken seçilmeli.)

## Kardeşler ve ilgili

**Kardeşler** (aynı klasör, [İlerleyiş](README.md)):

- [Sınav grafiği](sinav-grafigi.md) — bugünkü çizgi grafik.
- [Ödev sonuçları grafiği](odev-grafigi.md) — yanındaki grafik.
- [Sınavlar ve grup ortalamaları](sinavlar-ve-grup-ortalamalari.md) — altındaki "Son sınavlar" listesi.
- [Derslere göre ortalama](derslere-gore-ortalama.md) — üstündeki kutu.
- [İlerleyişim sayfası](ilerleyisim.md), [Velinin İlerleyiş sayfası](velinin-ilerleyis-sayfasi.md),
  [Derslere göre başarı oranı](ders-oranlari.md).

**İlgili:**

- [Sınav ayrıntısı](../sinav/sinav-ayrintisi.md), [Şablonlar](../sinav/sablonlar.md),
  [Ölçümler ve formül](../sinav/olcumler-ve-formul.md), [Sınavlarım](../sinav/sinavlarim.md).
- [Velide her çocuk ayrı oturum](../portallar/velide-cocuk-oturumlari.md).
- [Özel branş ve ders](../siniflar-dersler/ozel-brans-ve-ders.md) — ders renkleri ve kısaltmaları.

## Kod tarafı

Bugün kodda yok. Kodlanınca dokunulacak yerler (bugünkü karşılıklar):

- Ön yüz: [public/js/parcalar/13-ogrenci-veli.md](../../public/js/parcalar/13-ogrenci-veli.md) (`ilerleyisKartlari`,
  kartların sırası) ve [public/js/parcalar/28-grafik.md](../../public/js/parcalar/28-grafik.md) (`sutunGrafik`, kutunun
  genişliğinde çizim); velide [public/js/parcalar/27-veli-panel.md](../../public/js/parcalar/27-veli-panel.md).
- Sunucu: [sunucu/bolumler/ilerleyis.md](../../sunucu/bolumler/ilerleyis.md) (`exams`, `examGroups`); ölçüm aralıkları
  [sunucu/bolumler/sinav.md](../../sunucu/bolumler/sinav.md).
- Tasarım kaynağı: Tasarım 1 önizlemesi, öğrenci-veli modülü (`ovIlerleyisHtml`, `ovSutunlarHtml`, `ovSinavDeger`).

## Sık sorulanlar

- **Sütunu kısa ama puanım yüksek görünüyor.** Sütunun boyu sonucun tam puana oranıdır; 500 üzerinden 300 almak ile 100
  üzerinden 60 almak aynı boydadır.
- **Bu grafik bugün sitede var mı?** Hayır; tasarımda. Bugün sınavlar [Sınav grafiği](sinav-grafigi.md)nde çizgi olarak
  görünür.

## Sırada

- Arayüz önizlemesi (Tasarım 1) koda geçerken: İlerleyişim'e ve velinin İlerleyiş sayfasına "Sınav sonuçları" sütun
  grafiği; tam puan kuralı ve gösterilecek sınav sayısı kullanıcıya sorulacak.
- Sınav ayrıntı ekranı (kullanıcının 1 Ekim kararı): ölçümlerin soru sayısı ve net yüzdesi gelince oran ona göre hesaplanabilir.
- Velide her çocuk ayrı oturum.
- Android yerel uygulama: İlerleyiş ekranı.
