# Anketler · Sonuçlar, kim oy verdi, bitirme ve silme

**Durum:** Kodda var; tasarımda ek olarak soru soru sonuçlar ve yazılı yanıt sayısı, "Sonuçları Excel'e indir", bitişi uzatma ve ilk
yanıttan sonra soruların kilitlenmesi (Tasarım 1 önizlemesi ve tanım).

Anketi açanın ve müdürün sonuç penceresi (sayılar, kim oy verdi kim vermedi, arama), anketi erken bitirme ve silme; hedefteki kişinin
anket bitince gördüğü sonuç çubukları.

## Ne işe yarar

Anketi açan kişi ve okulun müdürü sonuçları ve katılımı her an görür: kaç kişi oy verdi, kim vermedi, kim neyi seçti (gizli değilse).
Hedefteki kişiler sonucu anket bitince görür (KILAVUZ: "Anketi açan ve müdür sonuçları ve katılımı (kim oy verdi, kim vermedi) her an
görür"). Anket gerekirse erken bitirilir ya da silinir (KILAVUZ: "Anket erken bitirilebilir ya da silinebilir."). Kim oy verdi
listesi duyurulardaki okundu listesiyle aynı düzendedir ([Okundu bilgisi](../mesaj/okundu-bilgisi.md)).

## Nereden açılır

- **Anketi açan ve müdür:** Anketler → **"Açtığın anketler"** (müdürde **"Okulun anketleri"**) listesinde her satırın sağında **"Sonuç"**,
  açıksa **"Bitir"** ve **"Sil"**. Sonuç penceresinin altında da **"Sil"** vardır.
- **Hedefteki kişi:** Anketler'de bitmiş anketin kartı.
- **Tasarımda:** öğretmenin "Açtığım anketler" satırına basınca sonuç penceresi; öğrenci ve velinin listesinde **"Sonuçlar"** rozetli
  satır.

## Adım adım

### Öğretmen

Anketi açan öğretmen (yetkisiyle) için; müdür de aynı ekranı görür.

**Sonuç penceresi (bugün, kodda)**

1. Satırdaki **"Sonuç"**a bas. Pencerenin başlığı anketin sorusudur.
2. En üstte soluk satır: **"<hedef özeti> · bitiş 12.10.2026 23:59"** (bitmişse **"bitti 12.10.2026 18:30"**).
3. **Sayılar:** her seçenek için metin, sağında **"7 · %35"** (oy sayısı ve yüzde) ve altında yüzde kadar dolu bir çubuk; en altta toplam
   **"20 oy"**. Gizli ve hâlâ açık ankette sayıların yerine mavi kutu: **"Gizli ankette sayılar anket bitince görünür."**
4. **Katılım:** **"12 / 40 kişi oy verdi"** ve doluluk çubuğu. Gizli ankette altında **"Gizli anket: kimin neyi seçtiği gösterilmez."**
5. Sekmeler **"Hepsi"**, **"Oy verenler"**, **"Vermeyenler"** ve **"İsim ara"** kutusu (kişinin adında, sınıfında ve velinin
   çocuklarının adlarında arar; Türkçe harfleri sadeleştirir ve büyük-küçük harfe bakmaz: "ozturk", "ÖZTÜRK", "Öztürk" aynı sonucu verir).
6. Liste önce oy vermeyenler, sonra ada göre (Türkçe sırayla). Her satır: kişinin adı ve yanında soluk ek — velide çocuklarının adı
   **"Zeynep Şahin velisi"** (iki çocukta "… , … velisi"), öğrencide sınıfı (**"6-A"**), öbürlerinde rolü (**"Öğretmen"**, **"Müdür"**,
   **"Servisçi"**). Sağda:
   - oy vermediyse **"oy vermedi"**;
   - oy verdiyse seçtiği seçenek ve oy zamanı: **"Salı · 12.10.2026 14:02"**;
   - gizli ankette yalnız **"oy verdi"** (seçim ve zaman gelmez).
   Seçili sekmede ya da aramada kimse yoksa **"Bu seçimde kimse yok."**
7. Pencerenin altında **"Sil"** (kırmızı) ve **"Kapat"**.

**Erken bitirmek**

8. Listede açık anketin satırında **"Bitir"**e bas. Onay: **"Anket şimdi bitirilsin mi? Artık oy verilemez; sonuç oy verenlere de
   açılır."**
9. Onaylayınca anket o an biter; sayfa yeniden açılır, satırdaki etiket **"Bitti"** ve alt yazı **"bitti <şimdiki zaman>"** olur. "Bitir"
   düğmesi kalkar. Hedefteki herkesin kartında artık sonuç çubukları görünür.
10. Bitiş zamanı gelince anket kendiliğinden biter; ayrıca bir bildirim gitmez.

**Silmek**

11. Listede ya da sonuç penceresinde **"Sil"**e bas. Onay: **"Anket ve bütün oylar silinsin mi? Bu geri alınamaz."**
12. Onaylayınca anket, seçenekleri, hedef listesi ve bütün oylar silinir; pencere kapanır, sayfa yeniden açılır. Anket herkesin
    listesinden düşer.

**Tasarımda (Tasarım 1 önizlemesi):**

- "Açtığım anketler"de satıra basınca pencere: başlık anketin adı; üstte **"7-A öğrencileri · 11 / 28 yanıt · son gün 9 Ekim 2026
  Cuma"** (gizliyse sonuna **" · gizli anket"**).
- Her soru kendi başlığıyla (**"1. Dönem projesinde hangi konuyu çalışmak istersin?"**): seçimli sorularda her seçenek, çubuk ve sayı;
  kısa ya da uzun yanıtlı soruda **"8 yazılı yanıt"**.
- Yanıt geldiyse en altta **"İlk yanıt geldiği için sorular artık değişmez."**; yanıt gelmediyse **"Henüz yanıt gelmedi; ilk yanıt
  gelene kadar soruları değiştirebilirsin."** ve **"Düzenle"** düğmesi ([Anket oluştur](anket-olustur.md)). Alt düğme **"Kapat"**.
- Tanımda ayrıca: soru başına çubuk, katılım listesi ("gizli ankette kişi yok"), **"Sonuçları Excel'e indir"**; ilk yanıttan sonra
  yalnız **bitişi uzatma** ve **kapatma**. Önizlemede katılım listesi, Bitir, Sil, bitiş uzatma ve Excel düğmesi çizilmedi; bugünkü
  sitedeki ekranlar kalır, yazılı yanıtların nasıl listeleneceği kodlamadan önce belirlenmeli.

### Müdür

**Bugün (kodda):** yukarıdakinin aynısı, okulda kim açtıysa bütün anketler için ("Okulun anketleri"; satırın sonunda açanın adı).
Öğretmenin açtığı anketi de bitirir ve silersin. Başka okulun müdürü bu anketlerin sonucunu göremez (**"Bu anketi görme yetkin yok"**),
bitiremez ve silemez (**"Bu anketi yönetme yetkin yok"**).

**Tasarımda (Tasarım 1 önizlemesi):** "Okulda açılan anketler" listesinde satırlar **"öğrenciler · 268 / 412 oy"** gibi, sağda **"Sonuç"**
ya da **"Açık"**.

### Çalışan

Ek rolündeki yetkiyle açtığı anketler için öğretmen gibi. Yetkisi sonradan alınırsa sunucu açtığı anketi yönetmesine yine izin verir,
ama "Açtığın anketler" listesi ona görünmez (bilinen açık); müdür yönetmeye devam eder.

### Öğrenci

**Bugün (kodda):**

1. Anket açıkken sonuç görünmez: kartın altında **"Sonuç anket bitince görünür."**
2. Anket bitince (süresi dolunca ya da erken bitirilince) kartta seçenek düğmelerinin yerine her seçenek için metin, **"7 · %35"** ve
   çubuk; senin seçtiğinin yanında soluk **"(senin seçimin)"** ve çubuğu yeşil; en altta **"20 oy"**.
3. Oy vermediysen altında **"Bu ankete oy vermedin."** Oy vermemiş olsan da bitmiş anketin sayılarını görürsün.
4. Kimin neyi seçtiğini, katılım listesini ve kimin oy vermediğini görmezsin.

**Tasarımda (Tasarım 1 önizlemesi):** listede **"Sonuçlar"** rozetli satıra basınca pencere: **"Anket bitti · bütün okul · 412 kişi
yanıtladı"** ve seçenek başına çubuk ile yüzde (**"Çok memnunum %38"**, **"Memnunum %41"** …). Gönderdiğin açık ankette: **"Yanıtın
gönderildi. Anket 20 Ekim'de bitene kadar yanıtını değiştirebilirsin; bitince sonuçlar açılır."**

### Veli

Öğrenciyle aynı: anket bitince sayıları ve kendi seçimini görürsün; çocuğunun oyunu görmezsin. Tasarımda her çocuğun oturumunda o
çocuğun anketleri.

## Kurallar ve sınırlar

- **Kim, ne zaman:** anketi açan ve aynı okulun müdürü her an (sayılar + katılım). Hedefteki herkes (oy vermemiş olsa da) anket
  bitince yalnız sayıları görür. Hedefte olmayan **"Bu anketi görme yetkin yok"**; anket açıkken hedefteki kişi **"Sonuç anket bitince
  açılır."** (sitede bu iki ileti görünmez, çünkü düğme yalnız yönetene çıkar).
- **Yüzdeler:** o anketteki toplam oy üzerinden, her seçenek ayrı yuvarlanır; toplam 100 olmayabilir (üç eşit oy: %33 + %33 + %33).
  Geri alınan oy sayılmaz.
- **Gizli anket:** seçim ve oy zamanı hiç gönderilmez; anket açıkken sayılar da gönderilmez; yöneten yine kimin oy VERDİĞİNİ görür
  ([Gizli anket](gizli-anket.md)).
- **"Bitir":** yalnız açık ankette görünür; bitiş tarihine dokunmaz, "bittiği an"ı ayrıca yazar. Bitmiş anket yeniden açılamaz. Zaten
  bitmiş ankete "Bitir" bir şey değiştirmez.
- **Onay metni eksik:** "Bitir" onayı "sonuç oy verenlere de açılır" der; gerçekte sayılar hedefteki herkese (oy vermeyenlere de)
  açılır.
- **"Sil":** geri alınamaz; silinen anket ancak site yedeğinden dönebilir ([Saklama ve silinme](saklama-ve-silinme.md)).
- **Yetki:** katılımlı sonuç penceresi, bitirme ve silme yalnız anketi açana ve okulun müdürüne. Başkası bitirmek ya da silmek isterse
  **"Bu anketi yönetme yetkin yok"**; sonuca bakmak isterse yukarıdaki kural (hedefte değilse **"Bu anketi görme yetkin yok"**, hedefteyse
  bitince yalnız sayılar). Silinmiş ya da bulunamayan anket **"Anket bulunamadı"**.
- **Bildirim yok:** sonuç açılınca ya da anket bitince kimseye bildirim gitmez.
- **Hedef dondurulmuştur:** "12 / 40" oranı açılış anındaki listeye göredir ([Anketin kimlere gittiği](kimlere-gider.md)).

## Kardeşler ve ilgili

**Kardeşler** (aynı klasör, [Anketler](README.md)):

- [Gizli anket](gizli-anket.md) — sayıların ve seçimlerin gizlenmesi.
- [Oy verme ve oyu geri alma](oy-verme.md) — sayılan oylar.
- [Anketler sayfası](anketler-sayfasi.md) — "Açtığın anketler" / "Okulun anketleri".
- [Saklama ve silinme](saklama-ve-silinme.md) — silinen ve süresi dolan anketler.
- [Anket oluştur](anket-olustur.md) — tasarımda "Düzenle" ve soruların kilitlenmesi.

**İlgili:**

- [Okundu bilgisi](../mesaj/okundu-bilgisi.md) — aynı düzende "kim okudu" listesi.
- [Kim neyi görür](../kvkk-ve-gizlilik/kim-neyi-gorur.md) — "Anket cevapları" satırı.
- [Sık sorulan sorular](../acilis-sayfasi/sss.md) — "Anketlerde oyumu kim görür?"

## Kod tarafı

- Ön yüz: [public/js/parcalar/19b-anketler.md](../../public/js/parcalar/19b-anketler.md) (`anketCubuklari`, `EYLEMLER['anket-sonuc']`,
  `anketSekme`, `anket-filtre`, `anketListeCiz`, `anket-kapat`, `anket-sil`), [public/js/parcalar/02-ikonlar.md](../../public/js/parcalar/02-ikonlar.md)
  (`tarihSaat`, `nrm`, `ROL_AD`), [public/js/parcalar/19-mesajlar.md](../../public/js/parcalar/19-mesajlar.md) (okundu listesiyle ortak
  görünüm).
- Sunucu: [sunucu/bolumler/anket.md](../../sunucu/bolumler/anket.md) (`GET /api/anketler/sonuc`, `POST …/kapat`, `POST …/sil`,
  `yonetebilir`), [sunucu/veri/depo/anketler.md](../../sunucu/veri/depo/anketler.md) (`sayimlar`, `katilim` — velinin bu okuldaki
  çocukları, `kapat`, `sil`).
- Testler: [testler/test-anket.md](../../testler/test-anket.md) (müdürün sayıları ve katılım, geri alınan oyun sayılmaması, başka okulun
  müdürü 403, öğrenci silemez, bitirme, bitmiş ankette öğrencinin katılımsız sonucu).
- Kullanıcıya dönük anlatım: [belge/KILAVUZ.md](../../belge/KILAVUZ.md) "Anketler ve duyuru okundu bilgisi".

## Sık sorulanlar

- **Anketi yanlışlıkla bitirdim; geri açabilir miyim?** Hayır. Yeni bir anket açman gerekir.
- **Oy vermeyenlere hatırlatma gönderebilir miyim?** Bugünkü sitede ve tasarımda böyle bir düğme yok. "Doldurmayanlara hatırlat"
  (anket, quiz, ödev; günde bir) kullanıcıya öneri olarak sunuldu, onay bekliyor. Şimdilik "Vermeyenler" sekmesindeki kişilere mesaj
  yazabilirsin.
- **Sonuçları Excel'e indirebilir miyim?** Bugün hayır; tasarımda "Sonuçları Excel'e indir" var.
- **Öğretmenin açtığı anketi müdür silebilir mi?** Evet; müdür okulundaki bütün anketleri bitirip silebilir.
- **Velinin satırında neden bir öğrenci adı var?** Hangi öğrencinin velisi olduğu anlaşılsın diye ("Zeynep Şahin velisi").
- **Oy vermedim; sonucu yine görür müyüm?** Evet, anket bitince sayıları görürsün.

## Sırada

- Anket düzenleyici: soru soru sonuçlar, yazılı yanıtlar, "Sonuçları Excel'e indir", ilk yanıttan sonra yalnız bitiş uzatma ve kapatma.
- "Doldurmayanlara hatırlat" önerisi (onay bekliyor).
- Optimizasyon + saklama süreleri: anketler bitişinden 1 yıl sonra silinecek.
- Android yerel uygulama: sonuç ekranı uygulamada.
- Bilinen açıklar (kod değiştirilmedi): "Bitir" onay metninin eksik olması; yetkisi alınan öğretmenin kendi anketinin listesine
  ulaşamaması.
