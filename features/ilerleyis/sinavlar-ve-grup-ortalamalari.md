# İlerleyiş · Sınavlar ve grup ortalamaları

**Durum:** Kodda var; tasarımda ek olarak İlerleyişim'de "Son sınavlar" listesi (her sınav bir satır, sağında sonucu, dokununca "Sınav ayrıntısı" penceresi).

İlerleyişim'in alt kısmındaki iki kart: gruba bağlı olmayan sınavların sonuçları ("Sınavlar") ve sınav gruplarının
100 üzerinden ağırlıklı ortalaması ("Sınav grubu ortalamaları").

## Ne işe yarar

Grafikler gidişi gösterir; bu iki kart sayıların kendisini. Kullanıcı ilk isteğinde (28 Ağustos) öğretmenin sınav grubu
açıp içine "dönem1 yarı 1 yazılı etkileme %50" gibi sınavlar ekleyebilmesini ve bunun "ilerleyişimde görünebilcek sınav
grubu ortalamaları" olarak çıkmasını istedi: grubun her sınavının payı alınıp grubun ortak puanına eklenir. "Sınavlar"
kartı ise bir gruba konmamış sınavları (ör. tek başına bir deneme) bütün ölçümleriyle gösterir.

## Nereden açılır

- [İlerleyişim sayfası](ilerleyisim.md)nda "Sınav grafiği"nin altında: önce **"Sınavlar"** (yalnız gruba bağlı olmayan
  sınavın varsa), sonra **"Sınav grubu ortalamaları"** (her zaman).
- Velinin [İlerleyiş sayfası](velinin-ilerleyis-sayfasi.md)nda her çocuğun kartlarının sonunda.
- "Sınavlar" kartının aynısı **"Sınavlarım"** sayfasında da var; orada gruplar ayrıca sınav sınav tabloyla gösterilir
  ([Sınavlarım](../sinav/sinavlarim.md)).

Tasarımda (Tasarım 1 önizlemesi): İlerleyişim'de (velide İlerleyiş'te) grafiklerin altında **"Son sınavlar"** listesi.
Grup sonucu önizlemede Sınavlarım sayfasında, "Sınav grupları" başlığı altında: solda sonuç ve grubun üst değeri
(önizlemenin varsayılan grubunda "82 / 100"; tanımdaki örnek "98,5 / 125"), yanında "Ayrıntı"; tıklayınca sınav sınav
"Aldığın", "Oran", "Pay", "Katkı" tablosu ([Sınav grupları](../sinav/sinav-gruplari.md)).

## Adım adım

### Kartların düzeni (bugünkü site)

**"Sınavlar"** kartı (gruba bağlı olmayan sınavlar, en yeni önce):

1. Her sınav bir satır: üstte sınavın adı (ör. "LGS Deneme 2").
2. Altında "tarih · ders · öğretmen" (ör. "20.09.2026 · Matematik · Ayşe Kaya"; ders sınav açılırken belirlenir, öğretmende kendi branşıdır);
   öğretmen adı yoksa yazılmaz.
3. Ana ölçüm dışındaki, değeri girilmiş ölçümler küçük çipler hâlinde: "**Türkçe Net** 12,5", "**Matematik Net** 15" …
4. Sağda etiket: ana ölçümün adı ve değeri (mavi; ör. "LGS Puanı 455,5"), değer yoksa gri **"Değer yok"**. Etiketin üstüne
   fareyle gelince ölçümün adı görünür.
5. Hiç grupsuz sınav yoksa kart hiç çıkmaz.

**"Sınav grubu ortalamaları"** kartı:

1. Grup yoksa "Henüz gruplu sınav yok."
2. Her grup bir satır: grubun adı (ör. "1. Dönem Matematik"); altında "ders · öğretmen · 100 üzerinden"; altında ince bir
   doluluk çubuğu (ortalama kadar dolu).
3. Sağda etiket: ortalama, en çok iki ondalıkla ("87,5"); 50 ve üstü yeşil, 50'nin altı kırmızı; hesaplanacak not yoksa
   gri "Değer yok".

Tasarımda (Tasarım 1 önizlemesi) — **"Son sınavlar"** listesi:

1. Başlık "Son sınavlar" (solunda sınav simgesi).
2. Her sınav bir satır: solda dersin kısaltması dersin renginde bir rozet içinde ("MAT", "İNG", "DNM"), ortada sınavın adı
   ("Matematik 1. yazılı"), altında "Form: Yazılı (0–100) · 23 Eylül 09:20 (2. ders)" (Form = sınavın şablonu), sağda ana ölçümün değeri
   ("82", "17,5", "488,888") ya da sonuç girilmemişse "Sonuç yok".
3. Satıra dokununca **"Sınav ayrıntısı"** penceresi: "Sınav:", "Ders:" (ders · öğretmen), "Form:", "Sınav tarihi:", "Sonuç
   tarihi:" (girilmemişse "sonuç henüz girilmedi"); altında ölçümler tablosu (sıra, Kod, Ölçüm, Değer; ana ölçüm vurgulu,
   formüllü ölçümün adının üstüne gelince formülü, ör. "N = D − Y/3"); sağ üstte **"Raporla"**. Sonucu olmayan sınavda
   tablo yerine "Sınav … tarihinde yapılacak." ([Sınav ayrıntısı](../sinav/sinav-ayrintisi.md)).

Önizlemede İlerleyişim'de sınav grubu ortalaması yok. Kullanıcı 28 Ağustos'ta grup ortalamalarını açıkça ilerleyişte
istedi; bu yüzden grup ortalamaları İlerleyişim'de kalır (önizlemenin eksiği; HTML işinde tamamlanmalı).

### Öğrenci

1. [İlerleyişim](ilerleyisim.md)de aşağı kaydır.
2. "Sınavlar"da her grupsuz sınavın ana sonucunu (sağdaki etiket) ve öbür ölçümlerini (çipler) gör.
3. "Sınav grubu ortalamaları"nda her grubun 100 üzerinden ortalamasına bak; renk 50'nin üstünde mi altında mı olduğunu
   söyler.
4. Grubun hangi sınavından ne aldığını görmek için **"Sınavlarım"** sayfasına geç (orada her grup bir tablo: "Sınav",
   "Etki", "Not" ve "Grup ortalaması").
5. Üst şeritteki **"İçerik Ara"** kutusuna sınavın adını ya da dersini yaz: "Sınavlar" kartındaki satırlar süzülür (grup
   satırları süzülmez).

Tasarımda: "Son sınavlar"da bir satıra dokun → "Sınav ayrıntısı" penceresi → istersen **"Raporla"** ile tek sayfalık
sonuç belgesi (PDF).

### Veli

1. Menüde **"İlerleyiş"** (ya da çocuğun portalında "İlerleyişi") → çocuğun kartlarının sonu.
2. Kartlar öğrencidekiyle aynı. Çocuğun eski okullarındaki grupsuz sınavlar ve gruplar, yıl şeridinde o dönem seçilince
   görünür.

Tasarımda: yalnız o oturumdaki çocuğun "Son sınavlar"ı (önizlemede Can'ın oturumunda "Türkçe 1. yazılı" 88 ve "Matematik
kısa sınavı" 13,75).

### Müdür, öğretmen ve çalışan

Öğrencinin portalında ("Portalını aç") aynı kartlar; yalnız senin okulunun kayıtları (nakil gelen öğrencinin eski okulu
görünmez). Öğretmen ders verdiği öğrencinin sınav sonuçlarını ayrıca [Sınıflarım](../siniflar-dersler/siniflarim.md)
penceresinde ("Ortalama (100 üzerinden): 87,5") görür.

## Kurallar ve sınırlar

- **Grup ortalamasının hesabı (sunucuda):** gruptaki her sınavın ana ölçüm değeri önce 100'lüğe çevrilir:
  (değer − alt) / (üst − alt) × 100. Sonra sınavların etki oranlarıyla ağırlıklı ortalama alınır ve iki ondalığa
  yuvarlanır. Notu girilmemiş sınav hesaba katılmaz (payı öbürlerine oranla dağılır). Örnek: 0–100 aralıklı yazılıdan 80
  (etki %50) ve ana ölçümü 0–500 aralıklı denemeden 400 (etki %50) → (80 × 50 + 80 × 50) / 100 = **80**. Alt sınır sıfır
  değilse hesaba girer: hazır "LGS Denemesi"nin "LGS Puanı" 100–500 aralıklıdır, 400 puan (400 − 100) / 400 × 100 = 75 sayılır.
- **Hangi gruplar:** öğrencinin grubun ana ölçümünde en az bir değeri olan gruplar, bakılan eğitim yılında. Okulda
  "Sınavlar" kapalıysa hiçbiri gelmez ("Henüz gruplu sınav yok.").
- **Hangi grupsuz sınavlar:** gruba bağlı olmayan ve öğrencinin herhangi bir ölçümde değeri olan sınavlar, en yeni önce,
  bakılan yılda. Ana ölçümde değer yoksa (yalnız öbür ölçümler girilmişse) etiket "Değer yok" olur.
- **Eşikler sabit:** "100 üzerinden" ve 50'deki renk eşiği bugün sabittir; Sınavlarım sayfasında da aynı eşik ayrıca
  yazılıdır.
- **Sayılar** Türkçe biçimde (virgüllü): sınav değerleri en çok üç, ortalama en çok iki ondalık.
- **Tarih** "04.09.2026" biçiminde (gün.ay.yıl).
- **Ana sayfadaki ortalama** (öğrencinin "İlerleyişim" kutucuğunda "Ortalama …"): grup ortalamalarının ağırlıksız düz
  ortalaması, bir ondalık; bugün noktalı yazılıyor ("Ortalama 85.5" — bilinen açık); hiç grup ortalaması yoksa "Not
  girilmedi".
- **Görme yetkisi** İlerleyişim'deki gibi ([İlerleyişim sayfası](ilerleyisim.md#kurallar-ve-sınırlar)).

## Kardeşler ve ilgili

**Kardeşler** (aynı klasör, [İlerleyiş](README.md)):

- [İlerleyişim sayfası](ilerleyisim.md), [Velinin İlerleyiş sayfası](velinin-ilerleyis-sayfasi.md).
- [Sınav grafiği](sinav-grafigi.md) — şablonlu sınavların çizgisi.
- [Sınav sonuçları sütun grafiği](sinav-sonuclari-grafigi.md) — tasarımda "Son sınavlar"ın üstündeki grafik.
- [Derslere göre ortalama](derslere-gore-ortalama.md) — tasarımda notların ders ders ortalaması.
- [Ödev sonuçları grafiği](odev-grafigi.md), [Derslere göre başarı oranı](ders-oranlari.md).

**İlgili:**

- [Sınav grupları](../sinav/sinav-gruplari.md) — grubun açılması, etki oranları; tasarımda üst değer (ör. 125) ve
  kaydırıcılar.
- [Sınavlarım](../sinav/sinavlarim.md), [Sınav ayrıntısı](../sinav/sinav-ayrintisi.md), [Not girişi](../sinav/not-girisi.md),
  [Şablonlar](../sinav/sablonlar.md), [Ölçümler ve formül](../sinav/olcumler-ve-formul.md).
- [Kutucuklar](../ana-sayfa/kutucuklar.md) — "İlerleyişim" kutucuğundaki ortalama.
- [Sayfa içi arama](../menu-ve-arama/sayfa-ici-arama.md).
- [Sınıflarım](../siniflar-dersler/siniflarim.md).

## Kod tarafı

- Sunucu: [sunucu/bolumler/ilerleyis.md](../../sunucu/bolumler/ilerleyis.md) — `progressOf`: `examGroups: [{ id, name,
  subject, teacherName, exams: [{ id, name, weight, grade, alt, ust }], average }]` (ağırlıklı yüzde), `exams` (grupsuz
  sınavlar); depo [sunucu/veri/depo/sinavlar.md](../../sunucu/veri/depo/sinavlar.md) (`ogrencininGruplari`,
  `ogrencininTekSinavlari`); yıl süzgeci [sunucu/bolumler/egitim-yili.md](../../sunucu/bolumler/egitim-yili.md) (`yilSuz`).
- Ön yüz: [public/js/parcalar/13-ogrenci-veli.md](../../public/js/parcalar/13-ogrenci-veli.md) — `sinavSonuclari`,
  `tekSinavKarti`, `grupOrtalamaKarti`; Sınavlarım'daki tablo
  [public/js/parcalar/14-odev-filtre.md](../../public/js/parcalar/14-odev-filtre.md) (`SAYFALAR.sinavlarim`); ana sayfa
  ortalaması [public/js/parcalar/08-ana-sayfa.md](../../public/js/parcalar/08-ana-sayfa.md) (`genelOrtalama`); sayı ve tarih
  [public/js/parcalar/01-yardimcilar.md](../../public/js/parcalar/01-yardimcilar.md) (`sayiTR`),
  [public/js/parcalar/02-ikonlar.md](../../public/js/parcalar/02-ikonlar.md) (`tarih`). Görünüm
  `public/css/parcalar/04-kartlar.css`, `05-tablo-grafik.css` (`.cubuk`), `25-grafik-sinav.css` (`.olcum-cipleri`)
  ([CSS.md](../../public/css/parcalar/CSS.md)).
- Testler: [testler/test-sinav.md](../../testler/test-sinav.md) (ilerleyişte iki grupsuz sınav ve ortalaması 80 olan grup;
  100'lük ve 500'lük sınavın aynı grupta birleşmesi).
- Kullanıcıya dönük anlatım: [belge/KILAVUZ.md](../../belge/KILAVUZ.md) ("Sınav grupları" örneği ve "İlerleyişim").

## Sık sorulanlar

- **Grup ortalamam neden 100 üzerinden, sınav 500'lüktü?** Her sınav önce 100'lüğe çevrilir; böylece farklı ölçekteki
  sınavlar aynı grupta birleşir.
- **Henüz girilmemiş sınav ortalamamı düşürüyor mu?** Hayır; notu girilmemiş sınav hesaba katılmaz.
- **Bir denemem "Sınavlar"da "Değer yok" diyor ama çipler dolu.** Ana ölçüm (ör. LGS Puanı) girilmemiş, öbür ölçümler
  (netler) girilmiş.
- **Ana sayfadaki ortalama ile buradakiler neden farklı?** Ana sayfadaki, grup ortalamalarının ağırlıksız düz ortalamasıdır.

## Sırada

- Sınav: sınav grubu üst değeri, yüzde/katkı puanı ve bağlı kaydırıcılar (öneri, onay bekliyor): "100 üzerinden" yerine
  grubun üst değeri ("98,5 / 125"), renk eşiği ve çubuk buna göre; girilmemiş sınavın hesaba katılıp katılmayacağı grup
  ayarı.
- Sınav ayrıntı ekranı (kullanıcının 1 Ekim kararı): sınava dokununca "Sınav", "Form", "Sınav tarihi", "Sonuç tarihi",
  sıra numaralı ölçümler tablosu ve "Raporla".
- Arayüz önizlemesi (Tasarım 1) koda geçerken: İlerleyişim'e "Son sınavlar" listesi; grup ortalamalarının İlerleyişim'de
  kalması (önizlemede eksik).
- Ana sayfa ortalamasının virgüllü yazılması (belgelemede bulunan kod bulgusu).
- Optimizasyon + saklama süreleri: öğrenci ve veli yalnız aktif ve bir önceki yılı görecek.
