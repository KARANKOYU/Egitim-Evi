# Eğitim içerikleri · Süzgeç mantığı

**Durum:** Tasarlandı — henüz kodda yok

Sınıf, ders, arama ve bölüm süzgeçlerinin birbirleriyle nasıl birleştiği: aynı süzgecin seçenekleri "ya da", farklı süzgeçler
"ve" ile bağlanır; ders sayıları öbür süzgeçlere göre canlı hesaplanır; sınıf seçilince yalnız o kademelerin dersleri kalır.

## Ne işe yarar

Kullanıcının 1 Ekim sözü: "eğitim içerikleri gerçek filtrelemeli olacak 1-12 ve inkılap var fizik var lisede, hani bir yere
sınırlamayacağız; filtreler de derslerde lise ortaokul altında olacak". 29 Eylül'de: "ararken filtre: 1. sınıf videoları, 2.
sınıf videoları gibi". 3 Ekim'de: "features/egitim-icerikleri'nde onun filtre mantığı … eksiksiz". Bu belge süzgeçlerin
KURALINI anlatır; her süzgecin ekranı kendi belgesindedir.

## Nereden açılır

Eğitim içerikleri sayfası ([Video listesi](video-listesi.md)): soldaki süzgeç sütunu (dar ekranda **"Süzgeçler"** düğmesi),
üstteki arama kutusu ve **"Sırala:"** seçicisi, giriş yapmışta bölüm çipleri.

## Adım adım

### Herkes (ziyaretçi dahil; bölüm çipleri yalnız giriş yapmışta)

Bir video sonuçta görünür, ancak ŞU DÖRT KOŞULUN HEPSİ tutarsa:

1. **Sınıf** ([Sınıf süzgeci](sinif-ve-kademe-suzgeci.md)): hiç sınıf seçili değilse her sınıf geçer. Bir ya da birkaç sınıf
   seçiliyse videonun sınıfı seçilenlerden BİRİ olmalı ("7. sınıf YA DA 8. sınıf").
2. **Ders** ([Ders süzgeci](ders-suzgeci.md)): hiç ders seçili değilse her ders geçer. Seçiliyse videonun "kademe + ders" ikilisi
   seçilenlerden biri olmalı. Ders kademesiyle birlikte seçilir: "Matematik · Ortaokul" ile "Matematik · Lise" ayrı
   seçeneklerdir; 6. sınıf Matematik videosu "Matematik · Ortaokul"a girer, 10. sınıfınki "Matematik · Lise"ye.
3. **Arama** ([Arama](arama.md)): kutu boşsa her şey geçer; doluysa yazılan, videonun başlığında, dersinde, eğitmeninin
   @kullanıcı adında, etiketlerinde ya da "N. sınıf" yazısında geçmeli (Tasarım 1 eğitmenin tam adında da arıyor; tanıma göre ad
   gösterilmediği için aranmaz).
4. **Bölüm** (yalnız giriş yapmışta): "Bütün videolar"da her şey geçer; "Kaydettiklerim"de yalnız kaydettiklerin,
   "İndirdiklerim"de yalnız bu cihaza indirdiklerin, "İzleme geçmişim"de yalnız izlediklerin, bir listede yalnız o listedekiler.

Sonra kalanlar **Sırala**'ya göre dizilir ([Sıralama](siralama.md)). Tek istisna: "İzleme geçmişim"de sıra her zaman en son
izlediğin en üstte.

### Örnek

7 ve 8. sınıfı seçtin, Ders'te "Matematik · Ortaokul" ile "Fen Bilimleri · Ortaokul"u işaretledin, aramaya "lgs" yazdın:
sonuçta yalnız 7. ya da 8. sınıfın, Ortaokul Matematik ya da Fen Bilimleri dersinden olan ve başlığında, etiketinde … "lgs"
geçen videolar kalır. Özet satırında "N video" ve çipler: "7. sınıf", "8. sınıf", "Matematik · Ortaokul", "Fen Bilimleri ·
Ortaokul", "“lgs”" ([Etkin süzgeç çipleri](etkin-suzgecler.md)).

## Kurallar ve sınırlar

- **Aynı süzgeç içinde "ya da", süzgeçler arasında "ve".** Sınıf × Ders × Arama × Bölüm.
- **Ders sayıları canlıdır:** Ders listesindeki her dersin yanındaki sayı, o kademede o dersten kaç videonun ŞU AN geçeceğini
  söyler; hesaplarken ders süzgecinin kendisi dışarıda tutulur, sınıf, arama ve bölüm hesaba katılır. Böylece bir ders
  seçtiğinde öbür derslerin sayısı sıfırlanmaz; "bunu da eklersem kaç video gelir" görünür.
- **Sayısı 0 olan ders** soluk görünür (seçili değilse); yine de işaretlenebilir.
- **Sınıf seçilince yalnız o kademelerin dersleri görünür:** 7. sınıf seçiliyse Ders sütununda yalnız "Ortaokul" grubu kalır;
  sütunun altında "Seçtiğin sınıfların dersleri görünüyor." yazar. Sınıf seçilmemişse üç grup (İlkokul, Ortaokul, Lise) da
  görünür.
- **Görünmez kalan ders seçimi düşer:** "Fizik · Lise" seçiliyken yalnız 7. sınıfı seçersen Lise grubu gizlenir ve "Fizik ·
  Lise" seçimi kendiliğinden kalkar (gizli bir seçim sonucu sessizce boşaltmasın diye).
- **Kademe düğmesi** (İlkokul / Ortaokul / Lise) o kademenin dört sınıfını birden seçer; dördü zaten seçiliyse dördünü bırakır.
- **Arama harf duyarsızdır ve Türkçe harfleri eşler:** "İ/i/ı" → "i", "ş" → "s", "ğ" → "g", "ü" → "u", "ö" → "o", "ç" → "c";
  büyük/küçük harf fark etmez; baştaki ve sondaki boşluk atılır. "inkilap" yazsan "T.C. İnkılap Tarihi" bulunur. Her tuşta
  sonuç yenilenir.
- **Temizleme:** Sınıf başlığındaki "Temizle" yalnız sınıfları, Ders başlığındaki "Temizle" yalnız dersleri, "Hepsini temizle"
  ve "Süzgeçleri temizle" sınıf + ders + arama + bölümün hepsini sıfırlar. Sıralama temizlenmez.
- **Ziyaretçide bölüm yoktur;** giriş yapmamışken bir bölüm seçili kalmışsa (ör. çıkış yaptın) "Bütün videolar"a döner. Silinen
  bir liste seçiliyse yine "Bütün videolar"a döner.
- **Süzgeç değişince sayfa zıplamaz:** (kullanıcı 2 Ekim: "eğitim içerikleri scrolling biraz bug'lı") sonuçlar yenilenirken
  süzgeç sütununun kendi kaydırma yeri ve basılan kutucuğun odağı korunur; sonuçların başı ekranın üstünde kaldıysa sayfa
  yumuşakça sonuçların başına kayar.
- **Süzgeçlerin saklanması:** tanımda yazmıyor. Tasarım 1'de seçimler sayfada kalır (başka sayfaya gidip dönünce yerinde durur,
  sayfa yenilenince sıfırlanır); adrese ya da hesaba yazılmaz.

**Tanımda olup Tasarım 1'de olmayanlar:** tanımda (29 Eylül) etiket süzgeci ve süre süzgeci de vardı; Tasarım 1'de etiket
süzgeci ayrı değildir (etiket aramayla bulunur, [Etiketler](etiketler.md)), süre süzgeci yerine "En kısa" sıralaması var.
Tanımdaki "Genel/Yetişkin" sınıf seçeneği de Tasarım 1'in süzgecinde yok.

## Kardeşler ve ilgili

**Kardeşler** (aynı klasör, [Eğitim içerikleri](README.md)):

- [Sınıf süzgeci](sinif-ve-kademe-suzgeci.md), [Ders süzgeci](ders-suzgeci.md), [Arama](arama.md), [Sıralama](siralama.md),
  [Etkin süzgeç çipleri](etkin-suzgecler.md), [Etiketler](etiketler.md) — süzgeçlerin ekranları.
- [Kaydet ve Kaydettiklerim](kaydedilenler.md), [İndir ve İndirdiklerim](indirdiklerim.md), [İzleme geçmişi](izleme-gecmisi.md),
  [Oynatma listeleri](oynatma-listeleri.md) — bölüm çipleri.
- [Video listesi](video-listesi.md) — sonuçların görünüşü.

**İlgili:**

- [Ödev süzgeçleri](../odev/suzgecler.md) — ödevlerin açılır süzgeçleri (ayrı kural).

## Kod tarafı

Bugün kodda yok. Kodlanınca kullanacağı ya da örnek alacağı bugünkü parçalar:

- Türkçe harf eşleyen arama: [sunucu/yardimci/bulanik-arama.md](../../sunucu/yardimci/bulanik-arama.md) (okul arama motoru; harf
  kuralı aynı).
- Süzgeç çubuğu kalıbı: [public/js/parcalar/14-odev-filtre.md](../../public/js/parcalar/14-odev-filtre.md).
- Bugünkü okul ders listesi (`SUBJECTS`, 9 ders, lise dersi yok): [sunucu/ortak.md](../../sunucu/ortak.md) — eğitim içeriklerinin
  kademeli ders listesi bundan ayrıdır ([Ders süzgeci](ders-suzgeci.md)).

## Sık sorulanlar

- **İki ders seçtim, ikisinin videoları da geliyor; doğru mu?** Evet; aynı süzgeç içinde seçenekler "ya da" ile birleşir.
- **Sınıf seçince bazı dersler kayboldu.** Yalnız seçtiğin sınıfların kademesindeki dersler görünür; o kademede olmayan ders
  seçimin de kalkar.
- **Dersin yanındaki sayı ne?** O dersi de seçersen öbür süzgeçlerinle birlikte kaç video geleceği.
- **Her şeyi nasıl sıfırlarım?** Özet satırındaki "Hepsini temizle" ya da sonuç yoksa "Süzgeçleri temizle".

## Sırada

- Eğitim içerikleri (iş 17): süzgeç mantığı sunucuda (sayfalı sorgu) ve ön yüzde.
- Tanımdaki etiket ve süre süzgeci ile "Genel/Yetişkin" seçeneği Tasarım 1'de yok; kodlamadan önce kullanıcıya sorulmalı
  (önerim: etiket aramayla yeter, süre için "En kısa" sıralaması yeter).
