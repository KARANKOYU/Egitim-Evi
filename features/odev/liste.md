# Ödevler · Ödev listesi

**Durum:** Kodda var; tasarımda ek olarak liste tek kutu olur ("Aktif" / "Geçmiş" bölümleri kalkar), sayfada 15 ödev gelir ve altta "…" ile devamı yüklenir, sıra yaklaşanlar → sonuç bekleyenler → sonuçlananlar olur (kullanıcı 2 Ekim; Tasarım 1 önizlemesi).

Öğrencinin, velinin ve öğretmenin ödevlerini gördüğü liste: her satırda ödevin adı, dersi, öğretmeni ya da sınıfı, son teslimi ve durumu; satıra basınca ödev açılır.

## Ne işe yarar

Ödevin bütün hayatı bu listeden izlenir: hangi ödev yeni geldi, hangisi açılmadı, kaç gün kaldı, hangisi sonuçlandı ve ne
sonuç aldı. Süzgeçler ve arama ayrı belgelerde: [Süzgeçler](suzgecler.md), [Ödevlerde arama](arama.md).

Kullanıcının 2 Ekim kararı (Tasarım 1'in ödev ekranına bakarak; "tasarım bu şekilde yap, hepsinde bu düzen"): liste
**yalnız bir kutuda** olacak ("geçmiş ve bu hafta değil"), **hepsi aynı anda yüklenmeyecek**, **bir sayfada 15**, devamı
**altta "…" ile**; açılır süzgeçler (durum, açılma, yıldız, sonuç).

## Nereden açılır

| Kim | Menü | Adres | Başlık |
|---|---|---|---|
| Öğrenci | "Ödevler" | `#/odevler` | "ÖDEVLER" (üstünde [ödev serisi](seri.md) şeridi) |
| Veli | "Ödevler" | `#/veli-odevler` | "ÖDEVLER — Çocuklarının bütün ödevleri bir arada; her satırda kimin olduğu yazar." |
| Veli, çocuğun portalında | "Ödevleri" | `#/odevler` | "ÖDEVLER — Elif Yılmaz adına görüntülüyorsun." |
| Öğretmen | "Ödevler" | `#/ogr-odevler` | "ÖDEVLER — Aynı anda birden fazla ödev verebilirsin." |
| Öğretmen ya da müdür olan veli | "Velisi olduğum" altında "Ödevleri" | `#/veli-odevler` | velininkiyle aynı |

Ana sayfalarda da kısa listeler var (aşağıda "Ana sayfada"). Müdürün ödev ekranı ayrı: [Müdürün ödev görünümü](mudurun-odev-gorunumu.md).

## Adım adım

### Öğrenci (bugünkü site)

1. Menüden **"Ödevler"**e gir. En üstte ödev serisi şeridi, altında süzgeç kartı; kartın altında **"12 ödev"** gibi bir özet
   (süzgeç varsa **"12 ödevden 4 tanesi gösteriliyor"**).
2. Liste iki bölüm: **"Aktif ödevler (5)"** (sonuçlanmamış ödevler; süresi dolmuş olanlar da burada) ve **"Geçmiş ödevler
   (7)"** (sonuçlananlar). Her bölümde en son verilen ödev üstte.
3. Her satırda:
   - solda **yıldız** düğmesi ([Yıldızlama](yildizlama.md));
   - ödevin adı (quizliyse yanında **"Quiz"** etiketi);
   - altında **"Matematik · Ayşe Kaya · son teslim 4 Ekim 2026, Pazar · 12:00"**;
   - açıklamanın ilk 140 harfi (uzunsa "…" ile);
   - quizli ödevde quiz durumu: **"Quiz: çözmedin"**, **"Quiz: devam ediyor"**, **"Quiz: bitirdin · sonuç henüz
     açılmadı"** ([Quiz çözme](../quiz/quiz-cozme.md));
   - sağda etiket: sonuçlanmışsa sonucun kendisi (**"Yaptı"** yeşil, **"Geç yaptı"** mavi, **"Eksik"** turuncu,
     **"Yapmadı"** kırmızı, **"Gelmedi (izinli)"** gri, **"Gelmedi (izinsiz)"** bordo); sonuçlanmış ama sana sonuç
     girilmemişse **"Değerlendirilmedi"**; sürüyorsa kalan süre: **"3 gün kaldı"**, **"Bugün 12:00'e kadar"**,
     **"Süresi doldu"**, son tarihsiz ödevde **"Aktif"**.
4. Henüz açmadığın aktif ödev **turuncu zeminli** ve adının önünde turuncu bir nokta; üzerine gelince "Henüz açılmadı"
   ([Açıldı / açılmadı](acilma-bilgisi.md)).
5. Satıra basınca ödevin penceresi açılır ([Ödevin penceresi](odev-penceresi.md)); yıldıza basmak yalnız yıldızı değiştirir.
6. Hiç ödevin yoksa **"Henüz ödev yok."**; süzgece uyan yoksa **"Bu filtrelere uyan ödev yok. "Temizle" ile filtreleri
   sıfırlayabilirsin."**

### Veli (bugünkü site)

1. Menüden **"Ödevler"**e gir. Birden çok çocuğun varsa üstte çocuk şeridi: **"Hepsi · Elif Yılmaz · Can Yılmaz"**; birine
   basınca liste yalnız o çocuğa daralır. Bildirime dokunarak geldiysen o çocuk seçili gelir.
2. **"Aktif ödevler (3)"** — sonuçlanmamış **ve** süresi geçmemiş ödevler, son teslimi en yakın olan üstte; yoksa
   **"Şu an açık ödev yok."**
3. **"Geçmiş ödevler (21)"** — sonuçlananlar ve süresi geçenler, en yeni üstte; en çok 40 satır gösterilir.
4. Her satırın başında çocuğun adı (ilk adı) rozet olarak; sonra ödevin adı, ders · öğretmen · son teslim, açıklamanın
   tamamı, quiz durumu ("Quiz: başlamadı", "Quiz: bitirdi · …") ve sağda sonuç ya da kalan etiketi.
5. Çocuğunun henüz açmadığı aktif ödev turuncu; üzerine gelince "Çocuğun bu ödevi henüz açmadı".
6. Satıra basınca çocuğunun o ödeve yüklediği dosyalar açılır ([Teslim](teslim.md)). Ödevin açıklaması ve ekleri için
   çocuğunun portalına girip "Ödevleri"ne bakarsın.
7. Bu sayfada süzgeç çubuğu yok; üst şeritteki **"İçerik Ara"** kutusu satırları çocuğun adına, ödevin adına ve dersine göre
   süzer ([Ödevlerde arama](arama.md)).
8. Hiç çocuk bağlı değilse: **"Henüz çocuk eklenmedi. Çocuklarım sayfasından veli koduyla ekleyebilirsin."**

### Öğretmen (bugünkü site)

1. Menüden **"Ödevler"**e gir; üstte **"Yeni ödev ver"**, süzgeç çubuğu (öğretmen durumlarıyla) ve özet.
2. **"Aktif ödevler"** (sonuçlanmamış) ve **"Geçmiş ödevler"** (sonuçlanmış); en son verdiğin üstte.
3. Her satırda: ödevin adı (+ "Quiz"), **"Matematik · 24 öğrenci · Son teslim: 4 Ekim 2026, Pazar · 12:00"** (ya da
   "süresiz"); aktif ödevde **"24 öğrenciden 9 kişi açtı"** (herkes açmadıysa turuncu), sonuçlanmış ödevde altı renkli sayı
   (Yaptı, Geç yaptı, Eksik, Yapmadı, Gelmedi (izinli), Gelmedi (izinsiz) — üzerine gelince adı); quizli ödevde **"Quiz ·
   5 soru · 20 dk · 24 öğrenciden 3 kişi bitirdi, 2 kişi çözüyor"**.
4. Sağda durum: **"Aktif · 3 gün"**, **"Aktif · bugün son gün"**, **"Süresi doldu"** (kırmızı), **"Sonuçlandı"** (yeşil);
   düğmeler **"Sonuçlandır"** (sonuçlanmışta gri **"Sonuçları düzenle"**) ve kırmızı **"Sil"**.
5. "Sonuçlandır"a basınca ödevin kontrol ekranı açılır ([Sonuçlandırma](sonuclandirma.md)).
6. Hiç ödev vermediysen **"Henüz ödev yok."**

### Çalışan

Bugün kodda ek görevli öğretmen kendi verdiği ödevleri öğretmen listesinde görür. "Öğrenci portalına girer" yetkisi olan
(ör. Rehber Öğretmen) bir öğrencinin portalını açıp onun "Ödevleri"ni öğrencinin gördüğü gibi görür
([Öğrenci portalını açma](../hesaplar/ogrenci-portalini-acma.md)). Tasarımda öğretmen olmayan çalışanın ödev listesi yok.

### Müdür

Müdür öğrencinin portalını **"Portalını aç"** ile açıp "Ödevleri"ne bakabilir (öğrencinin gördüğünün aynısı; yıldız yok,
açmak "açıldı" saymaz). Okulun ödevlerine ders ders bakış için: [Müdürün ödev görünümü](mudurun-odev-gorunumu.md).

### Ana sayfada

- **Öğrenci:** turuncu **"Ödevler"** kutucuğu ("5 aktif ödev" ya da "Aktif ödev yok", rozetle sayı), ödev serisi şeridi ve
  **"Yaklaşan ödevler"** (bütün aktif ödevler; yoksa **"Aktif ödevin yok. Harika!"**).
- **Veli:** "Ödevler" kutucuğu ve **"Yaklaşan ödevler"** (çocukların aktif ödevlerinden son teslimi en yakın 6'sı; yoksa
  **"Şu an açık ödev yok."**).
- **Öğretmen:** "Ödevler" kutucuğu, **"Aktif ödev"** ve **"Sonuçlanan ödev"** sayıları, **"Aktif ödevler"** listesi (yoksa
  **"Aktif ödev yok. Ödevler sayfasından yeni ödev verebilirsin."**).
- **Müdür:** ödev yok.

### Tasarımda (Tasarım 1 önizlemesi ve kullanıcının 2 Ekim kararı)

- **Tek kutu:** "Ödevler" başlıklı tek bir kutu, sağında **"28 ödev"**; içinde süzgeçler ve satırlar. "Aktif / Geçmiş",
  "Bu hafta" gibi bölümler yok.
- **15'erli:** ilk 15 ödev gelir; altta **"…"** düğmesi: **"Devamı · 13 ödev daha"** ve **"15 / 28"**. Basınca sonraki 15
  eklenir. Hepsi gösterildiyse ve 15'ten çoksa **"28 ödevin hepsi gösteriliyor"**. Süzgeç değişince yine ilk 15'ten başlar.
  Ödevler sunucudan da 15'erli gelir (sayfalı uç).
- **Sıra:** önce süren ödevler (son teslimi en yakın olan üstte), sonra süresi geçmiş ama sonuç bekleyenler, en sonda
  sonuçlananlar (en yeni üstte).
- **Satır:** solda dersin renkli kısaltması ("MAT"), adı (açılmamışsa kalın, önünde turuncu nokta, satır turuncumsu),
  altında **"Matematik · Ayşe Kaya · son 1 Ekim 23:00"**, sağda yıldız ve durum etiketi: sonuç adı ("Yaptı" yeşil, "Geç
  yaptı" / "Eksik" turuncu, "Gelmedi (izinli)" gri, öbürleri kırmızı), **"Bugün 23:00'e kadar"**, **"Yarın 15:00'e kadar"**,
  **"4 gün kaldı"**, süresi geçmiş sonuçsuz ödevde **"Kontrol bekliyor"**.
- **Öğretmende** satır: **"7-A · son 1 Ekim 23:00 · 18 / 28 teslim · quiz"**; süresi geçmiş sonuçlanmamış ödevde **"Kontrol
  et"**, sonuçlanmışta **"Sonuçlandı"**. Satıra basınca **"Ödev kontrolü"** sayfası açılır. Sayfanın altyazısı "Aynı anda
  birden fazla sınıfa ödev verebilirsin", sağ üstte "Yeni ödev ver". Öğretmenin ana sayfasında **"Kontrol bekleyen
  ödevler"** listesi ve kutucukta **"2 kontrol bekliyor"**.
- **Öğrencide** sayfanın altyazısı **"7-A · bu dönem 28 ödev"**, üstte seri şeridi.
- **Velide** her çocuk ayrı oturum (kullanıcı 3 Ekim): liste yalnız o oturumun çocuğunun ödevleri; "Hepsi" ve çocuk
  süzgeci yok; altyazı **"Elif · 7-A"**. Satıra basınca ödevin penceresinin tamamı açılır (açıklama, ekler, teslim
  dosyaları, quiz durumu) ([Velide çocuk oturumları](../portallar/velide-cocuk-oturumlari.md)).
- **Müdürün ana sayfasında ödev yok** (kullanıcı 29 Ağustos: "ödevler müdürün front page'de olmayacak").

## Kurallar ve sınırlar

- **Kim ne görür:** öğrenci yalnız kendisine verilen ödevleri; veli bağlı çocuklarınınkileri; öğretmen yalnız kendi
  verdiklerini (başka öğretmenin ödevi listesinde yok); müdür okulun hepsini ders ders. Servisçi, sistem yöneticisi ve giriş
  yapmamış ziyaretçinin ödev listesi yok.
- **Eğitim yılı:** liste yıl seçicide seçili yılın ödevlerini gösterir; geçmiş yıla bakarken öğretmen değişiklik yapamaz
  ([Geçmiş yıla bakma](../egitim-yili/gecmis-yil.md)). Nakil gelen öğrencinin eski okulundaki ödevleri yeni okulun
  öğretmenine görünmez; veli çocuğunun eski okullarını da görür.
- **Okulun özellikleri:** okulda "Ödevler" kapalıysa menüden ve kutucuklardan kalkar, adres yazılırsa **"Bu bölüm okulunda
  kapalı. Okul müdürü Özellikler sayfasından açabilir."**; öğrencinin ve velinin listesi boş gelir.
- **Aktif'in anlamı ekranlara göre değişir:** öğrencinin ve öğretmenin sayfasında "Aktif" = sonuçlanmamış (süresi dolmuşlar
  dahil); velinin Ödevler sayfasında = sonuçlanmamış ve süresi geçmemiş; velinin ana sayfasındaki kutucuk ve "Yaklaşan
  ödevler" ise süresi dolmuş sonuçsuz ödevi de "aktif" sayar. Öğretmen sonuçlandırana kadar iki veli ekranı farklı sayı
  söyleyebilir.
- **Bilinen açıklar:** öğrencinin ana sayfasındaki "Yaklaşan ödevler" satırları ve yıldızları, "Ödevler" sayfası o oturumda
  hiç açılmadıysa tepki vermez (velinin ana sayfasındaki satırlar çalışır); öğrenci satırı klavyeyle açılamaz (yalnız fare/dokunma); velinin geçmiş listesi 40'ta kesilir ve bunu
  söyleyen bir yazı yok; velinin listesinde açıklama kısaltılmaz.
- **Ekran açıldığı anı gösterir.** Sen sayfadayken gelen yeni ödev ya da sonuç, sayfayı yeniden açınca ya da üst şeritteki
  "Yenile"ye basınca görünür ([Yenile düğmesi](../menu-ve-arama/yenile-dugmesi.md)).
- **Tasarımda** ödevler sunucudan 15'erli gelir (sayfalı uç); süzgeçlerin ve aramanın bu uçta mı tarayıcıda mı
  uygulanacağı tanımda yazmıyor (kodlanırken karar verilecek).

## Kardeşler ve ilgili

**Kardeşler:** [Süzgeçler](suzgecler.md) · [Ödevlerde arama](arama.md) · [Açıldı / açılmadı](acilma-bilgisi.md) ·
[Yıldızlama](yildizlama.md) · [Ödev serisi](seri.md) · [Ödevin penceresi](odev-penceresi.md) ·
[Sonuçlandırma](sonuclandirma.md) · [Müdürün ödev görünümü](mudurun-odev-gorunumu.md) · [Başlama ve son teslim](tarih-ve-saat.md).

**İlgili:** [Öğrencinin ana sayfası](../ana-sayfa/ogrenci-ana-sayfasi.md), [Velinin ana sayfası](../ana-sayfa/veli-ana-sayfasi.md),
[Öğretmenin ana sayfası](../ana-sayfa/ogretmen-ana-sayfasi.md), [Kutucuklar](../ana-sayfa/kutucuklar.md),
[Velide çocuk oturumları](../portallar/velide-cocuk-oturumlari.md), [Çocuklarım](../portallar/cocuklarim.md),
[Sol menü](../menu-ve-arama/sol-menu.md), [Kapalı bölüm](../ozellikler/kapali-bolum.md),
[Takvim: gün ayrıntısı](../takvim/gun-ayrintisi.md), [Sınıflarım](../siniflar-dersler/siniflarim.md) (öğretmenin öğrenci
öğrenci verdiği ödevler), [İlerleyiş: ödev grafiği](../ilerleyis/odev-grafigi.md).

## Kod tarafı

- Öğrenci ve portal görünümü: [public/js/parcalar/14-odev-filtre.md](../../public/js/parcalar/14-odev-filtre.md) —
  `SAYFALAR.odevler` (`GET /api/progress[?studentId=]`), `odevSonucCiz` (iki bölüm, özet, boş kutu), `odevListesiOgrenci`.
- Öğretmen: [public/js/parcalar/11-ogretmen-odev.md](../../public/js/parcalar/11-ogretmen-odev.md) — `SAYFALAR['ogr-odevler']`
  (`GET /api/assignments`), `odevListesiOgretmen`.
- Veli: [public/js/parcalar/27-veli-panel.md](../../public/js/parcalar/27-veli-panel.md) — `SAYFALAR['veli-odevler']`,
  `veliOdevListesi`, `veliCocukSeridi`, `cocuklarIcin`.
- Ana sayfalar: [public/js/parcalar/08-ana-sayfa.md](../../public/js/parcalar/08-ana-sayfa.md). Menü satırları:
  [public/js/parcalar/06-menu.md](../../public/js/parcalar/06-menu.md). Etiketler ve tarih biçimi:
  [public/js/parcalar/02-ikonlar.md](../../public/js/parcalar/02-ikonlar.md) (`kalanEtiketi`, `SONUC`, `tarihGunSaat`).
  Quiz satırları: [public/js/parcalar/14c-quiz.md](../../public/js/parcalar/14c-quiz.md) (`quizListeEtiketi`,
  `quizListeDurumu`, `quizOgretmenListeSatiri`).
- Sunucu: [sunucu/bolumler/ilerleyis.md](../../sunucu/bolumler/ilerleyis.md) — `/api/progress` öğrencinin ödev listesini
  (yıl süzgeci, `acildi`, `yildizli` yalnız kendisine, `result` yalnız sonuçlanınca, ekler, quiz özeti) döndürür;
  [sunucu/bolumler/odev.md](../../sunucu/bolumler/odev.md) — `GET /api/assignments` (öğretmenin listesi: `gecikti`,
  `acilan`, `summary`, `quiz`).
- Depo: [sunucu/veri/depo/odevler.md](../../sunucu/veri/depo/odevler.md) — `ogretmenin`, `ogrencinin` (yeniden eskiye).
- Görünüm: `public/css/parcalar/25-grafik-sinav.css` (`.satir.acilmadi`, `.acilma-yazi`), `04-kartlar.css` (etiket renkleri)
  ([CSS.md](../../public/css/parcalar/CSS.md)).
- Testler: [testler/test-egitim-yili.md](../../testler/test-egitim-yili.md) (yıl süzgeci),
  [testler/test-ozellikler.md](../../testler/test-ozellikler.md), [testler/buton-denetimi.md](../../testler/buton-denetimi.md).

## Sık sorulanlar

- **Süresi geçen ödev neden hâlâ "Aktif ödevler"de?** Öğretmen sonuçlandırana kadar ödev aktiftir; etiketi "Süresi doldu"
  olur. Sonuçlanınca "Geçmiş ödevler"e geçer.
- **"Değerlendirilmedi" ne demek?** Ödev sonuçlandırıldı ama öğretmen sana bir sonuç seçmedi.
- **Ödev listemde başka öğretmenin ödevini göremiyorum (öğretmen).** Öğretmen listesi yalnız senin verdiklerindir; sınıfın
  bütün ödevlerine müdür bakar.
- **Velide iki çocuğun ödevleri karışır mı?** Hayır; her satırda çocuğun adı yazar. Tasarımda her çocuk zaten ayrı oturumdur.
- **Bütün ödevleri neden aynı anda görmüyorum (tasarım)?** Liste 15'erli gelir; altta "…" ile devamını aç.

## Sırada

- Ödev listesi düzeni (kullanıcı 2 Ekim): tek kutu, sunucudan 15'erli, "…" ile devamı, yeni sıra; bugünkü sitenin süzgeç
  çubuğu ve "Aktif / Geçmiş" bölümleri bu düzene çevrilecek.
- Velide her çocuk ayrı oturum (kullanıcı 3 Ekim): "Hepsi" ve çocuk şeridi kalkacak.
- Android uygulaması: ödev listesi uygulamaya gelecek (süzgeçler, ayrıntı, teslim, quiz).
- Optimizasyon ve saklama: öğrenci ve velisi yıl seçicide yalnız aktif yılı ve bir önceki yılı görecek.
