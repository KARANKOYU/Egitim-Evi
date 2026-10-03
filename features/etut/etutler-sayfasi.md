# Etütler · Etütler sayfası (personelin listesi)

**Durum:** Kodda var; tasarımda ek olarak etütler "Bu hafta" grubunda gün rozetiyle ve durum rozetiyle ("Planlı", "Yoklama alındı", "Bitti") listelenir, satıra basınca [etüt ayrıntısı](etut-ayrintisi.md) açılır ve yeni etüt düğmesinin adı "Etüt ekle" olur.

Öğretmenin, müdürün ve etüt görevi olan çalışanın etütleri gördüğü, yoklamaya, öğrenci seçimine ve düzenlemeye buradan geçtiği sayfa.

## Ne işe yarar

Okul personeli için etütle ilgili her iş bu listeden başlar: yeni etüt açmak, öğrencilerini seçmek, düzenlemek, silmek ve
yoklama almak. Sayfayı kim açarsa kendi yetkisi kadar görür:

- etüt düzenleme yetkisi olan (müdür her zaman) okulun **bütün** etütlerini ve her satırda bütün düğmeleri görür;
- "Bütün etütlerde yoklama alır" yetkisi olan (ör. "Nöbetçi Öğretmen") okulun bütün etütlerini görür, her satırda yalnız
  **"Yoklama"** vardır;
- öbür öğretmenler yalnız **öğretmeni olarak seçildikleri** etütleri görür.

Öğrenci ve veli bu sayfayı görmez; onların sayfası [Etütlerim](etutlerim.md).

## Nereden açılır

- **Müdür:** sol menüde "Okul Düzeni" grubunda saat simgeli **"Etütler"** ("Devamsızlık"ın altında, "Ödevler"in üstünde).
  Adres `#/etutler`.
- **Öğretmen:** sol menüde her zaman saat simgeli **"Etütler"** ("Yemek Listesi"nin üstünde; Ödevler, Sınavlar, Yoklama ve
  Sınıflarım satırlarından sonra). Hiç etüdün olmasa ya da hiçbir etüt yetkin olmasa da satır durur.
- **Çalışan:** bugün ek görevli kişi öğretmen hesabıyla çalıştığı için menüsü öğretmeninkiyle aynı; etüt yetkisi ek rolün
  bölümüne ayrı satır eklemez, aynı "Etütler" satırı kullanılır.
- Bildirimden: "… etüdü sana verildi …" bildirimine basınca bu sayfa açılır ([Etüt bildirimleri](etut-bildirimleri.md)).
- Okul "Etütler" bölümünü kapattıysa satır menüde yoktur; adres elle yazılırsa sayfada "Bu bölüm okulunda kapalı. Okul müdürü
  Özellikler sayfasından açabilir." yazar.

Tasarımda (Tasarım 1 önizlemesi): müdürde "Okul düzeni" grubunda "Devamsızlık"ın altında, öğretmende "Sınıflarım"ın altında
"Etütler"; sayfanın sağ üstünde **"Etüt ekle"** düğmesi.

## Adım adım

### Ne görürsün (bugünkü site)

- Başlık **"ETÜTLER"**. Alt yazı etüt düzenleme yetkin varsa "Etüt aç, öğretmenini ve öğrencilerini seç; yoklamaları buradan
  alınır.", yoksa "Sana verilen etütler. Yoklamayı etüt günü alırsın."
- Etüt düzenleme yetkin varsa üstte bir kart: kalın **"Yeni etüt"**, altında "Gün, saat ve yer; sonra öğretmenini ve öğrencilerini
  seç." ve sağda **"Etüt aç"** düğmesi ([Etüt açma](etut-acma.md)).
- Hiç etüt yoksa boş kutu: yetkiliye **"Henüz etüt yok."**, öbürlerine **"Sana verilmiş bir etüt yok."**
- Her etüt bir satır:
  - kalın etüt adı (ör. "8. sınıf Matematik etüdü");
  - altında gün ve saat, yer varsa noktayla: "Salı 15:40–16:20 · Kütüphane" (yer yazılmadıysa yalnız "Salı 15:40–16:20");
  - altında öğretmen ve öğrenci sayısı: "Ayşe Kaya · 12 öğrenci"; öğretmen seçilmediyse "Öğretmen seçilmedi · 12 öğrenci".
- Satırın sağındaki düğmeler:
  - **"Yoklama"** — o etütte yoklama alabiliyorsan ([Etüt yoklaması](etut-yoklamasi.md));
  - **"Öğrenciler"** ([Öğrenci seçme](ogrenci-secme.md)), **"Düzenle"** ve kırmızı **"Sil"**
    ([Düzenleme ve silme](etudu-duzenleme-ve-silme.md)) — yalnız etüt düzenleme yetkisinde.
- Sıra: haftanın gününe göre (Pazartesi'den Pazar'a), aynı günde başlangıç saatine, sonra ada göre.
- Üst şeritteki **"İçerik Ara"** kutusu satırları etüdün adına, öğretmenin adına ve gün adına göre süzer (ör. "salı" yazınca
  yalnız Salı etütleri kalır); hiçbiri tutmazsa ""fen" için sonuç bulunamadı." "Yeni etüt" kartı süzülmez.

### Müdür

1. Menüden "Okul Düzeni" → **"Etütler"**.
2. Okulun bütün etütlerini gün gün görürsün; her satırda dört düğme.
3. Yeni etüt için **"Etüt aç"** → [Etüt açma](etut-acma.md).
4. Etüde öğrenci eklemek için satırdaki **"Öğrenciler"** → [Öğrenci seçme](ogrenci-secme.md).
5. Gün, saat, yer ya da öğretmen değişecekse **"Düzenle"**; etüt kalkıyorsa **"Sil"** →
   [Düzenleme ve silme](etudu-duzenleme-ve-silme.md).
6. Herhangi bir etüdün yoklamasını almak ya da düzeltmek için **"Yoklama"** → [Etüt yoklaması](etut-yoklamasi.md).
7. Bir işten sonra sayfa kendiliğinden yeniden çizilir ve üstte yeşil ileti çıkar ("Etüt kaydedildi.", "12 öğrenci kaydedildi."
   gibi; 6 saniye sonra kaybolur).

### Öğretmen

1. Menüden **"Etütler"**.
2. Yalnız öğretmeni olarak seçildiğin etütleri görürsün; her satırda yalnız **"Yoklama"**. Hiç etüdün yoksa "Sana verilmiş bir etüt
   yok." yazar.
3. Etüt günü **"Yoklama"**ya bas ([Etüt yoklaması](etut-yoklamasi.md)).
4. Müdür sana ek rolle **"Bütün etütlerde yoklama alır"** yetkisini verdiyse okulun bütün etütleri listelenir ve her birinde
   "Yoklama" çıkar; **"Etüt açar; gününü, saatini, öğretmenini ve öğrencilerini düzenler"** yetkisini verdiyse sayfa müdürünkiyle
   aynıdır (bkz. [Etüt yetkileri](etut-yetkileri.md)). Yetki yeni verildiyse sayfayı yeniden aç.

### Çalışan

Bugün kodda: "Müdür Yardımcısı", "Etüt Sorumlusu", "Nöbetçi Öğretmen" gibi görevler öğretmen hesabına ek rol olarak verilir.
Sayfayı öğretmen gibi açarsın; ne gördüğün rolündeki etüt yetkisine bağlıdır:

- "Etüt Sorumlusu" ya da "Müdür Yardımcısı" şablonundan gelen rol → müdürün gördüğü sayfa (bütün etütler, dört düğme, "Etüt aç");
- "Nöbetçi Öğretmen" şablonundan gelen rol → bütün etütler, her satırda yalnız "Yoklama".

Tasarımda (çalışan tanımı): kişi okula **"çalışan"** olarak eklenir; müdür görev vermedikçe rolsüzdür ve menüsünde "Etütler" yoktur
(rolsüz çalışan yalnız duyuruları, Mesajlar'ı, Takvim'i, Hatırlatıcılar'ı ve Ayarlar'ı görür). Özel rolünde etüt yetkisi varsa
öğretmen olmasa da bu sayfayı yukarıdaki gibi kullanır.

### Tasarımda (Tasarım 1 önizlemesi)

- **Müdür:** başlık "Etütler", alt yazı "Bu hafta 12 etüt", sağ üstte **"Etüt ekle"** ("Etüt planla" penceresini açar —
  [Boş zaman ızgarası](bos-zaman-izgarasi.md)). Etütler **"Bu hafta"** grubunda; her satırda solda gün rozeti ("Cum", "Sal"),
  ad ("Matematik etüdü"), altında "15:30 · Ayşe Kaya · 14 öğrenci" ya da yoklaması alınmış etütte "15:30 · Ali Yıldız · 9 / 10
  geldi", sağda durum rozeti: mavi **"Planlı"** ya da yeşil **"Bitti"**. Yeni planlanan etüt listenin en üstüne "Planlı" diye
  girer.
- **Öğretmen:** başlık "Etütler", alt yazı "Senin verdiğin etütler", grup **"Etütlerin"**; satır "Cuma 2 Ekim · 15:30–16:10 · 204
  nolu sınıf · 14 öğrenci", yoklaması alınmışsa "… · 9 / 10 geldi"; rozet **"Planlı"**, **"Yoklama alındı"** ya da **"Bitti"**.
  Önizlemede öğretmenin sayfasında da sağ üstte "Etüt ekle" vardır; önizleme yetkiyi denemez, örnek öğretmen rol listesinde zaten
  "Etüt sorumlusu"dur. Gerçekte düğme yalnız etüt yetkisi olana çıkmalı ([Etüt yetkileri](etut-yetkileri.md)).
- Satıra basınca [etüt ayrıntısı](etut-ayrintisi.md) açılır; yoklama oradaki **"Etüt yoklaması"** düğmesiyle alınır.
- Önizlemede satırlarda "Öğrenciler", "Düzenle", "Sil" düğmeleri yoktur ve etüt tarihli (ör. "Cuma 2 Ekim") gösterilir. Kullanıcı
  bu düğmeler için bir şey söylemedi; 2 Ekim'de onayladığı kurala göre üzerine yorum yapılmamış ekranlar bugünkü site gibi kalır.
  Kesinleşen kısım etüt planlamanın kendisidir (kullanıcı 29 Eylül; [Boş zaman ızgarası](bos-zaman-izgarasi.md)).

## Kurallar ve sınırlar

- **Kim açar:** yalnız okul personeli (öğretmen ve müdür). Öğrenci, veli ve servisçinin menüsünde yoktur; elle istek gönderen
  öğrenci ya da veli sunucudan **"Bu bölüm okul personeli içindir"** alır. Yönetici ve destek bu sayfayı kullanmaz (okulun içindeki
  bir bölümdür).
- **Kim neyi görür:**
  - "Etüt açar; gününü, saatini, öğretmenini ve öğrencilerini düzenler" ya da "Bütün etütlerde yoklama alır" yetkisi olan: okulun
    bütün etütleri;
  - öbür öğretmen: yalnız öğretmeni olduğu etütler.
- **Düğmeler sunucunun cevabına göre** çizilir (satırda "Yoklama" yalnız yoklama alabiliyorsan, düzenleme düğmeleri yalnız yetkiliye).
  Gizli düğmenin işi elle istenirse sunucu yine reddeder: **"Etüt düzenleme yetkin yok"**, **"Bu etütte yoklama alma yetkin yok"**.
- **Başka okulun etüdü** hiçbir uçta açılmaz; kimlik başka okulunsa **"Etüt bulunamadı"**.
- **Tek liste:** sayfalama yok; okulun bütün etütleri tek sayfada.
- **Öğretmen okuldan çıkarılırsa** ya da hesabı silinirse etüt kalır, satırda "Öğretmen seçilmedi" yazar; "Düzenle"den yeni öğretmen
  seçilir.
- **Eğitim yılı:** etütler yıla bağlı değildir; yıl seçicide geçmiş bir yıla bakarken de aynı liste görünür ve değişiklik yapılabilir
  (geçmiş yılın salt okunur kuralı ödev, sınav, ders yoklaması, takvim ve ders programı içindir).
- **Bölüm kapalıysa:** menüden ve sayfadan kalkar; sunucu **"Etütler bu okulda kapalı. Okul müdürü Özellikler sayfasından
  açabilir."** der. Etütler ve yoklamalar silinmez; bölüm açılınca geri gelir ([Kapalı bölüm](../ozellikler/kapali-bolum.md)).
- **Güncellik:** liste her açılışta sunucudan gelir; başka biri bu arada etüt açtıysa üst şeritteki "Yenile" ile görürsün.

## Kardeşler ve ilgili

**Kardeşler** (aynı klasör, [Etütler](README.md)):

- [Etüt açma](etut-acma.md) — "Etüt aç" penceresi.
- [Etüdün öğrencilerini seçme](ogrenci-secme.md) — "Öğrenciler" penceresi.
- [Etüdü düzenleme ve silme](etudu-duzenleme-ve-silme.md) — "Düzenle" ve "Sil".
- [Etüt yoklaması](etut-yoklamasi.md) — "Yoklama".
- [Boş zaman ızgarası](bos-zaman-izgarasi.md) — tasarımdaki "Etüt ekle" → "Etüt planla".
- [Etüt ayrıntısı](etut-ayrintisi.md) — tasarımda satıra basınca açılan pencere.
- [Etüt yetkileri ve hazır roller](etut-yetkileri.md) — kimin ne gördüğünü belirleyen yetkiler.
- [Etütlerim](etutlerim.md) — öğrencinin ve velinin sayfası.
- [Etüt bildirimleri](etut-bildirimleri.md).

**İlgili:**

- [Sol menü](../menu-ve-arama/sol-menu.md), [Sayfa içi arama](../menu-ve-arama/sayfa-ici-arama.md) — "Etütler" satırı ve "İçerik Ara".
- [Bölüm aç / kapat](../ozellikler/bolum-ac-kapat.md), [Kapalı bölüm](../ozellikler/kapali-bolum.md).
- [Geçmiş yıla bakma](../egitim-yili/gecmis-yil.md).
- [Rolsüz çalışan](../ogretmenler-calisanlar/rolsuz-calisan.md), [Rol atama](../ogretmenler-calisanlar/rol-atama.md).
- [İşlem kaydı sayfası](../islem-kaydi/islem-kaydi-sayfasi.md).

## Kod tarafı

- Ön yüz: [public/js/parcalar/18b-etut.md](../../public/js/parcalar/18b-etut.md) — `SAYFALAR.etutler` (başlık, "Yeni etüt" kartı,
  boş kutular, satır ve düğmeler; satırın `data-ara`sı = ad + öğretmen + gün adı), `ETUT` durumu (`liste`, `yonetebilir`, `bugun`;
  çıkışta ve portal değişince [26-baslat.md](../../public/js/parcalar/26-baslat.md) `oturumDurumunuSifirla` baştan kurar).
  [public/js/parcalar/06-menu.md](../../public/js/parcalar/06-menu.md) — menü satırları (`etutler`), `SAYFA_OZELLIK` (`etutler`,
  `etutlerim`, `etut-yoklama` → `etut`). [public/js/parcalar/24-bildirim-arama-mobil.md](../../public/js/parcalar/24-bildirim-arama-mobil.md)
  — `araUygula` (üst şeritteki arama).
- Sunucu: [sunucu/bolumler/etut.md](../../sunucu/bolumler/etut.md) — `GET /api/etut` (`herYoklama` olana `depo.etutler.okulun`,
  öğretmene `ogretmeninki`; cevap `{ etutler, yonetebilir, herYoklama, bugun }`, her etütte `gunAdi` ve `yoklamaAlabilir`).
  [sunucu/bolumler/ozellikler.md](../../sunucu/bolumler/ozellikler.md) — kapalı bölüm kapısı.
- Depo: [sunucu/veri/depo/etutler.md](../../sunucu/veri/depo/etutler.md) — sıra `ORDER BY gun, baslangic, ad`, `ogrenciSayisi`
  alt sorgusu, öğretmen adı `LEFT JOIN` (silinen öğretmende boş). Tablo `etutler` (şema 013,
  [SEMA.md](../../sunucu/veri/sema/SEMA.md)).
- Testler: [testler/test-etut.md](../../testler/test-etut.md) (öğretmen yalnız kendi etüdünü görür, öğrenci personel listesine
  giremez), [testler/test-ozellikler.md](../../testler/test-ozellikler.md) (bölüm kapalıyken `GET /api/etut` 403).
- Kullanıcıya dönük anlatım: [belge/KILAVUZ.md](../../belge/KILAVUZ.md) ("Etütler" bölümü).

## Sık sorulanlar

- **Menümde "Etütler" var ama sayfa boş.** Henüz hiçbir etüde öğretmen olarak seçilmedin. Etüt sorumlusu seni bir etüdün öğretmeni
  yaptığında bildirim gelir ve etüt burada görünür.
- **Öbür öğretmenlerin etütlerini nasıl görürüm?** "Bütün etütlerde yoklama alır" ya da etüt düzenleme yetkisi gerekir; müdürden
  iste ([Etüt yetkileri](etut-yetkileri.md)).
- **Çok etüt var, aradığımı nasıl bulurum?** Üst şeritteki "İçerik Ara"ya etüdün adını, öğretmenin adını ya da günü yaz.
- **"Etüt aç" düğmesi yok.** Etüt düzenleme yetkin yok; yalnız müdür ve bu yetkiyi rolüyle alan kişi etüt açar.
- **Öğrencim bu sayfayı görebilir mi?** Hayır; öğrenci kendi etütlerini [Etütlerim](etutlerim.md)'de görür.

## Sırada

- Etüt planlama (öneri, 29 Eylül): "Etüt ekle" ile ders, öğretmen ve öğrenci seçilen, canlı boş zaman ızgaralı planlama penceresi;
  listede tarihli satırlar ve durum rozetleri.
- Çalışan olarak ekleme: etüt görevleri öğretmen olmayan çalışana da verilebilecek; rolsüz çalışan bu sayfayı görmeyecek.
- Mesaj ayarları, Ajanda: etütler takvimin altındaki ajandada da listelenecek.
- Çok dil: başlık, alt yazılar ve boş kutu metinleri çeviri kataloğuna girecek.
