# Eğitim içerikleri · Sınıf süzgeci

**Durum:** Tasarlandı — henüz kodda yok

Süzgeç sütununun "Sınıf" bölümü: 1'den 12'ye on iki sınıf düğmesi, üç kademe satırında (İlkokul 1–4, Ortaokul 5–8, Lise 9–12);
kademenin adına basınca o kademenin bütün sınıfları birden seçilir.

## Ne işe yarar

Kullanıcının 29 Eylül isteği: videoyu koyan "hangi sınıflara hitap ediyorsa 1'den 12'ye koyacak" ve "ararken filtre: 1. sınıf
videoları, 2. sınıf videoları gibi". 1 Ekim'de: "gerçek filtrelemeli olacak 1-12 … bir yere sınırlamayacağız". Öğrenci kendi
sınıfını, LGS'ye hazırlanan 8. sınıfı, lise öğrencisi 9–12'yi tek dokunuşla seçer.

## Nereden açılır

Eğitim içerikleri sayfasında soldaki süzgeç sütununun en üstü, başlığı **"Sınıf"**. Dar ekranda (860 px ve altı) önce üstteki
**"Süzgeçler"** düğmesine basılır ([Video listesi](video-listesi.md)).

## Adım adım

### Herkes (ziyaretçi dahil)

1. Süzgeç sütununda **"Sınıf"** başlığının altında üç satır var. Her satırın solunda kademe düğmesi, sağında o kademenin sınıf
   düğmeleri:
   - **İlkokul** — 1 2 3 4
   - **Ortaokul** — 5 6 7 8
   - **Lise** — 9 10 11 12
2. Bir sınıf düğmesine bas (ör. **7**): düğme dolar, sonuçlar yalnız 7. sınıf videolarına iner, özet satırına **"7. sınıf"**
   çipi gelir. Aynı düğmeye yeniden basarsan seçim kalkar.
3. Birden çok sınıf seçebilirsin (ör. 7 ve 8): videolar "7. sınıf ya da 8. sınıf" olur.
4. Kademe düğmesine bas (ör. **Ortaokul**): 5, 6, 7, 8 birden seçilir ve kademe düğmesi de dolar. Dördü seçiliyken kademe
   düğmesine yeniden basarsan dördü birden bırakılır. Dördünden biri eksikse kademe düğmesi dolu görünmez.
5. Sınıf seçince aşağıdaki **"Ders"** bölümünde yalnız seçtiğin sınıfların kademesi kalır ve altta "Seçtiğin sınıfların
   dersleri görünüyor." yazar ([Ders süzgeci](ders-suzgeci.md)).
6. Sınıf seçimi varken **"Sınıf"** başlığının sağında **"Temizle"** belirir; basınca bütün sınıf seçimleri kalkar (ders
   seçimleri kalır).

### Eğitmen (video yüklerken)

Video yüklerken ve düzenlerken aynı düzen sınıf seçimi olarak çıkar: kademe düğmeleri "İlkokul 1–4", "Ortaokul 5–8", "Lise
9–12" ve 1–12 düğmeleri, birden çok seçilir ([Video bilgileri](video-bilgileri.md)). Video süzgeçte, seçilen HER sınıfta görünür
(tanımdaki çoklu seçimin anlamı: 5–8'e seçilen video "5. sınıf videoları"nda da "8. sınıf videoları"nda da çıkar).

**Tasarımda (Tasarım 1 önizlemesi):** eğitmenin yüklediği video Eğitim içeriklerine yalnız seçtiği İLK sınıfla giriyor (5–8 seçilen
video yalnız 5. sınıfta çıkıyor); örnek videoların da tek sınıfı var. HTML işinde her sınıfta görünecek biçimde düzeltilecek.

## Kurallar ve sınırlar

- **12 sınıf, sınır yok:** 1'den 12'ye hepsi her zaman görünür (kullanıcı: "bir yere sınırlamayacağız").
- **Kademeler sabit:** 1–4 İlkokul, 5–8 Ortaokul, 9–12 Lise.
- **Seçimler "ya da":** birden çok sınıf seçilince bunlardan birine uyan videolar gelir; ders, arama ve bölümle "ve" ile
  birleşir ([Süzgeç mantığı](suzgec-mantigi.md)).
- **Görünmez kalan ders seçimi düşer:** sınıf seçimi bir kademeyi gizlerse o kademedeki ders seçimleri kendiliğinden kalkar.
- **Erişilebilirlik:** sınıf düğmesinin sesli adı "7. sınıf", basılı mı bilgisini taşır; kademe düğmesinin ipucu
  "İlkokulun bütün sınıflarını seç" (Ortaokulun, Lisenin).
- **Etkin çipler sıralı:** özet satırında sınıf çipleri küçükten büyüğe dizilir ("5. sınıf", "7. sınıf", "8. sınıf").
- **Tanımdaki "Genel/Yetişkin"** seçeneği (sınıfa bağlı olmayan videolar için; 29 Eylül tanımı) Tasarım 1'de yok.

**Tasarımda:** Tasarım 1 önizlemesinde kademe düğmesinin ipucu "İlkokulnun / Ortaokulnun / Lisenun bütün sınıflarını seç"
diye yanlış ekleniyor; doğrusu yukarıdaki gibi ("İlkokulun", "Ortaokulun", "Lisenin").

## Kardeşler ve ilgili

**Kardeşler** (aynı klasör, [Eğitim içerikleri](README.md)):

- [Süzgeç mantığı](suzgec-mantigi.md) — sınıfın öbür süzgeçlerle birleşmesi.
- [Ders süzgeci](ders-suzgeci.md) — sınıf seçimine göre daralan ders listesi.
- [Etkin süzgeç çipleri](etkin-suzgecler.md) — "7. sınıf" çipi.
- [Video bilgileri](video-bilgileri.md) — eğitmenin videoya sınıf seçmesi.
- [Ana sayfadaki öneri şeridi](ana-sayfa-seridi.md) — öğrencinin sınıfına göre öneri.

**İlgili:**

- [Sınıflar ve dersler](../siniflar-dersler/README.md) — okulun kendi sınıfları (ayrı şey: eğitim içerikleri site genelidir,
  okul sınıflarına bağlı değildir).

## Kod tarafı

Bugün kodda yok. Kodlanınca örnek alacağı bugünkü parçalar:

- Süzgeç çubuğu: [public/js/parcalar/14-odev-filtre.md](../../public/js/parcalar/14-odev-filtre.md).
- Biçim (çipler, düğmeler): [public/css/parcalar/CSS.md](../../public/css/parcalar/CSS.md).

## Sık sorulanlar

- **Okulumdaki sınıfım (7-A) ile bu süzgeç aynı mı?** Hayır. Burada yalnız sınıf düzeyi (1–12) var; şube yok, okula bağlı değil.
- **Bir video hem 7. hem 8. sınıfta çıkıyor.** Eğitmen videoyu birden çok sınıfa seçmiş; seçtiği her sınıfta görünür.
- **Kademe düğmesi neden dolu değil?** O kademenin dört sınıfının hepsi seçili değil.

## Sırada

- Eğitim içerikleri (iş 17): sınıf süzgeci.
- "Genel/Yetişkin" seçeneği eklensin mi — kullanıcıya sorulmalı (tanımda var, tasarımda yok).
- Önizlemedeki ipucu eki hatası ("İlkokulnun") ve yüklenen videonun yalnız ilk sınıfta çıkması HTML işinde düzeltilecek.
