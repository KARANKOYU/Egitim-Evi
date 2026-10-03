# Ödevler · Ödev verme

**Durum:** Kodda var; tasarımda ek olarak açıklama ortak yazı düzenleyiciyle yazılır, ödeve anket eklenebilir, başlama ve son tarih zorunlu olur ve pencere yeni bir düzene geçer (Tasarım 1 önizlemesi).

Öğretmenin bir ya da birkaç sınıftaki öğrencilere adı, açıklaması, tarihleri, ekleri, dosya izni ve isteğe bağlı quiziyle ödev verdiği "Yeni ödev" penceresi.

## Ne işe yarar

Ödevin doğduğu yer burası. Tek pencerede dersi, adı, açıklamayı, başlama ve son teslim tarihini (saatiyle), ödevin kime
gideceğini, ödeve eklediğin dosyaları, öğrencilerin dosya yükleyip yükleyemeyeceğini ve istersen bir quizi seçersin.
"Ödevi ver"e basınca ödev seçtiğin öğrencilerin listesine düşer, öğrencilere ve velilerine bildirim gider. Aynı anda
istediğin kadar aktif ödevin olabilir (kullanıcının ilk isteği: "aynı anda birden fazla ödev").

Pencerenin her parçasının ayrıntısı kendi belgesinde:
[tarihler](tarih-ve-saat.md) · [kime](alicilar.md) · [ekler](dosya-ekleme.md) ·
[dosya yükleme izni](dosya-yukleme-izni.md) · [quiz](../quiz/quiz-ekleme.md).

## Nereden açılır

- **Öğretmen:** menüde **"Ödevler"** (`#/ogr-odevler`) → sayfanın üstündeki **"Yeni ödev ver"** düğmesi. Sayfanın başlığı
  "ÖDEVLER", altında "Aynı anda birden fazla ödev verebilirsin." yazar. Menüdeki "Ödevler" satırı ancak "Ödev verir" ya da
  "Ödev sonuçlandırır" yetkilerinden biri varsa çıkar ([Yetki listesi](../roller-yetkiler/yetki-listesi.md)). Ana sayfadaki
  turuncu **"Ödevler"** kutucuğu da aynı sayfaya götürür.
- Açılan pencerenin başlığı **"Yeni ödev"**, alt düğmeleri **"Vazgeç"** ve **"Ödevi ver"**.
- **Müdür:** düğme yok; müdür ödev vermez ([Müdürün ödev görünümü](mudurun-odev-gorunumu.md)).

Tasarımda (Tasarım 1 önizlemesi): sayfanın altyazısı "Aynı anda birden fazla sınıfa ödev verebilirsin", düğme yine
"Yeni ödev ver"; pencere başlığı "Yeni ödev", alt düğmeler "Vazgeç" ve "Ödevi ver" (pencere uzunsa alt düğmeler yapışık
durur, pencere kendi içinde kayar — kullanıcı 1 Ekim: "her şeyde bir kaydırma olsun").

## Adım adım

### Pencerede ne var (bugünkü site)

Yukarıdan aşağıya:

1. **"Ders"** — açılır liste: senin derslerin (aynı dersin farklı sınıflardaki kopyaları tek ad). Branşın seçili gelir.
2. **"Ödev adı"** — yer tutucu "Sayfa 42 alıştırmalar".
3. **"Açıklama"** — iki satırlık düz yazı kutusu, yer tutucu "Ödevin detayları...".
4. **"Başlama tarihi \*"** (takvim düğmeli tarih kutusu + saat listesi) ve **"Son tarih \*"** (aynısı). Altında ipucu:
   "Takvimde her güne düşen tatil, etkinlik ve öteki ödevlerin görünür. Çoğu ödev için son saat 12:00 uygundur."
   → [Başlama ve son teslim](tarih-ve-saat.md)
5. **"Ödev verilecekler"** — "Tümünü seç", "Tümünü kaldır", "0 öğrenci seçili" sayacı ve sınıf sınıf öğrenci kutucukları.
   → [Kime verilecek](alicilar.md)
6. **"Dosya ekle"** alanı ("buraya sürükle ya da basıp seç"). → [Ödeve dosya ekleme](dosya-ekleme.md)
7. **"Öğrenciler bu ödeve dosya yükleyebilsin"** onay kutusu (kapalı gelir). → [Dosya yükleme izni](dosya-yukleme-izni.md)
8. **"Quiz ekle"** bölümü. → [Quiz ekleme](../quiz/quiz-ekleme.md)
9. Hata ve uyarıların çıktığı satır, en altta **"Vazgeç"** ve **"Ödevi ver"**.

### Öğretmen

1. Menüden **"Ödevler"**e gir, **"Yeni ödev ver"**e bas.
2. **"Ders"**ten ödevin dersini seç. Vekil girdiğin başka bir dersin ödevini de verebilirsin, yeter ki seçtiğin öğrencilerin
   sınıfında o ders okutuluyor olsun.
3. **"Ödev adı"**nı yaz (ör. "Oran orantı çalışma kâğıdı").
4. İstersen **"Açıklama"** yaz (bugün düz metin; satır sonları korunur).
5. **Başlama** ve **son teslim** tarihini takvimden, saatini listeden seç. Çoğu ödevde son saati 12:00'de bırakırsın.
6. **"Ödev verilecekler"**de sınıf kutusunu işaretleyerek bütün sınıfı ya da tek tek öğrencileri seç. Birden çok sınıf
   seçebilirsin; üstteki sayaç kaç öğrenci seçtiğini söyler.
7. İstersen **"Dosya ekle"** ile çalışma kâğıdı, fotoğraf, video gibi dosyalar ekle (yüklenmeleri bitmeden "Ödevi ver"
   beklemeni ister).
8. Öğrencilerin ödeve dosya teslim etmesini istiyorsan **"Öğrenciler bu ödeve dosya yükleyebilsin"** kutusunu işaretle.
9. İstersen **"Quiz ekle"** ile ödeve bir quiz koy.
10. **"Ödevi ver"**e bas. Düğme isteğe kadar kilitlenir (iki kez basılmaz). Kayıt bitince pencere kapanır ve "Ödevler"
    sayfası yeniden açılır; yeni ödev "Aktif ödevler"in en üstündedir. Ayrıca "verildi" iletisi çıkmaz.
11. Bir sorun varsa pencere açık kalır, ileti pencerenin altında kırmızı (yüklenen dosya için turuncu) çıkar; düzeltip
    yeniden "Ödevi ver".
12. Ödev verilir verilmez seçtiğin her öğrenciye **"Yeni ödev: Oran orantı çalışma kâğıdı (Matematik)"** bildirimi gider;
    velisine aynı bildirim çocuğun adıyla: **"Elif Yılmaz · Yeni ödev: Oran orantı çalışma kâğıdı (Matematik)"**.
    Bildirime dokunan öğrenci "Ödevler" sayfasına, veli çocuğunun ödevlerine gider. Telefon bildirimi açıksa telefona da
    gelir ([Otomatik bildirimler](../bildirim/otomatik-bildirimler.md)).

Tasarımda (Tasarım 1 önizlemesi) pencerenin düzeni şöyle:

- **"Başlık:"** (yer tutucu "Ödevin adı", en çok 120 karakter);
- **"Başlama:"** ve **"Son tarih:"** satırları — her birinde takvim düğmesi ("gg.aa.yyyy · takvimden seç") ve yanında ayrı
  saat listesi ([Başlama ve son teslim](tarih-ve-saat.md));
- **"Açıklama:"** — [ortak yazı düzenleyicisi](../yazi-yazma/README.md) (kalın, italik, liste, bağlantı, fotoğraf…; öğretmende
  HTML görünümü düğmesi de var);
- **"Ödev verilecekler"** — açılır kapanır düğme, üzerinde "N öğrenci seçili" ([Kime verilecek](alicilar.md));
- **"Ekler:"** — "Dosyaları buraya sürükle ya da [Dosya seç]" alanı ve doluluk çubuğu ([Ödeve dosya ekleme](dosya-ekleme.md));
- **"Öğrenciler bu ödeve dosya yükleyebilsin"** (ipucu: "her öğrenci en çok 10 dosya, toplam 50 MB · son teslimden 7 gün
  sonra silinir");
- **"Anket:"** — "Anket ekle" düğmesi; basınca öğretmenin anketleri ("taslak" ya da "yayında" · soru sayısı) listelenir,
  seçilen anket "×" ile kaldırılabilen bir çip olur; anketi yoksa "Henüz anketin yok; Anketler sayfasında Anket oluştur."
  ([Anketi ödeve ekleme](../anket/odeve-mesaja-ekleme.md));
- **"Quiz:"** — "Quiz ekle"; eklenince "Quiz · 10 soru · 20 dakika", "Quizi düzenle" ve çöp kutusu ([Quiz ekleme](../quiz/quiz-ekleme.md)).

Başarıda pencere kapanır ve **"Ödev verildi: 7-A, 7-C · 52 öğrenci · quizli."** gibi kısa bir ileti çıkar. Önizlemede ders
seçimi görünmez (örnek öğretmenin tek dersi var); ders kuralları bugünkü site gibidir. Önizlemede birden çok sınıfa verilen
ödev öğretmenin listesinde sınıf başına ayrı satır olur (her satırda "7-A · son … · 18 / 28 teslim"); kullanıcı bunun
için ayrıca bir şey söylemedi.

### Çalışan

Bugün kodda ek görevli kişi öğretmen hesabıyla bir ek rol taşır. Ödev verebilmesi için "Ödev verir" yetkisi hazır Öğretmen
rolünde ya da ek rolünde açık olmalı. Yetki **ek rolden** geliyorsa rolün ders ve sınıf daraltması uygulanır: rol yalnız
"Matematik" ve "6-A" ile sınırlıysa başka ders ya da sınıf için "Ödevi ver" hata verir
([Ders ve sınıf daraltması](../roller-yetkiler/ders-ve-sinif-daraltmasi.md)). Hazır Öğretmen rolünden gelen yetkiyi ek rol
daraltmaz.

Tasarımda (çalışan tanımı): öğretmen olmayan çalışan ödeve atanamaz ve ödev vermez; ödev yalnız Öğretmen rolü olanların
işidir ([Rolsüz çalışan](../ogretmenler-calisanlar/rolsuz-calisan.md)).

### Müdür

Müdürün ekranında "Yeni ödev ver" yoktur; müdürün menüsündeki "Ödevler" ders ders bakılan salt bir görünümdür. Kullanıcı
29 Ağustos'ta "müdür ödev verme tuşu da ana ekranda olmasın" dedi; tasarımda da müdürün "Kendi derslerim"i ve ödev verme
düğmesi yok. (Sunucu müdürden gelen ödev isteğini öğretmeninki gibi kabul ederdi; ama ekranda bunu yapan bir yol yok.)

## Kurallar ve sınırlar

- **Yetki.** "Ödev verir" (`odev.ver`, ders ve sınıf kapsamlı). Hazır Öğretmen rolünde açık gelir; müdür kapatırsa menüden
  de kalkar. Kapsam dışı ders: **"Fen Bilimleri dersine ödev verme yetkin yok"**; kapsam dışı sınıf: **"6-A için ödev verme
  yetkin yok"**. Bilinen açık: yalnız "Ödev sonuçlandırır" yetkisi olan öğretmen "Yeni ödev ver" düğmesini görür, formu
  doldurur ama "Ödevi ver" bu iletiyle reddedilir.
- **Ödev adı zorunlu.** Boşsa sunucu **"Ödev adı gerekli"** der (pencere önceden denetlemez). Ad 120, açıklama 1000
  karakterde sunucuda uyarısız kesilir (bu pencerede uzunluk sınırı yok; "Ödevi düzenle"de var).
- **Ders.** Boş gelirse öğretmenin branşı kullanılır, o da yoksa **"Ders seç"**. Ders, seçilen öğrencilerin sınıflarından en
  az birinde okutulan bir ders olmalı: **"Seçtiğin öğrencilerin sınıfında Matematik dersi yok"**. Sınıfsız öğrencide ders
  genel ders listesinde olmalı, değilse **"Ders bulunamadı"**.
- **Öğrenci.** Hiç öğrenci seçmezsen pencere **"En az bir öğrenci seç."** der. Yalnız ulaşabildiğin (ders verdiğin
  sınıflardaki) öğrencilere ödev gider; hiçbiri kalmazsa **"Seçtiğin öğrencilere ödev veremezsin"**.
- **Hiç sınıfın yoksa** pencere form yerine **"Ödev verebileceğin öğrenci yok. Müdürünün seni bir sınıfın dersine ataması
  gerekiyor."** gösterir.
- **Tarihler.** **"Son tarih başlangıçtan önce olamaz"**, **"Aynı gün biten ödevde son saat başlama saatinden sonra
  olmalı"** ([Başlama ve son teslim](tarih-ve-saat.md)).
- **Ekler.** Yükleme sürerken **"Dosyalar yükleniyor; bitince kaydet."** (turuncu). En çok 20 dosya, toplam 50 MB:
  **"En fazla 20 dosya eklenebilir."**, **"Eklerin toplamı en fazla 50 MB olabilir. Bir dosyayı kaldır."**, **"Eklerden biri
  bulunamadı ya da süresi doldu. Yeniden ekle."** ([Ödeve dosya ekleme](dosya-ekleme.md)).
- **Quiz.** Quiz bozuksa (ör. sorusuz) quizin iletisi çıkar ve ödev de verilmez; ödev ile quiz tek işlemde yazılır, biri
  yazılamazsa ikisi de yazılmaz ([Quiz ekleme](../quiz/quiz-ekleme.md)). Ekler bu işlemden sonra bağlanır.
- **Eğitim yılı.** Ödev aktif eğitim yılına damgalanır. Yıl seçicide geçmiş bir yıla bakarken ödev verilemez: **"Geçmiş bir
  eğitim yılına bakıyorsun; kayıtlar salt okunur. Değişiklik için üstteki yıl seçiciden aktif yıla dön."**
  ([Geçmiş yıla bakma](../egitim-yili/gecmis-yil.md)).
- **Okulda Ödevler kapalıysa** sayfa açılmaz: **"Bu bölüm okulunda kapalı. Okul müdürü Özellikler sayfasından açabilir."**;
  sunucu da **"Ödevler bu okulda kapalı. Okul müdürü Özellikler sayfasından açabilir."** der ([Kapalı bölüm](../ozellikler/kapali-bolum.md)).
- **Görünürlük.** Ödev, başlama tarihi ileride olsa bile verildiği anda öğrencinin listesinde görünür ve "Yeni ödev"
  bildirimi hemen gider; yalnız dosya yükleme başlama gününe kadar ("Ödev henüz başlamadı."; saate bakılmaz) ve quiz başlama
  anına (gün + saat) kadar kapalıdır ([Başlama ve son teslim](tarih-ve-saat.md)).
- **İşlem kaydı.** Ödev verme okulun işlem kaydına yazılmaz ([Neler kaydedilir](../islem-kaydi/neler-kaydedilir.md)).
- **Tasarımda** pencere kendi denetimini yapar ve şu iletileri verir: **"Ödevin adını yaz."**, **"Başlama tarihini
  takvimden seç."**, **"Son tarihi takvimden seç."**, **"Son tarih başlamadan önce olamaz."** (tarih ve saat birlikte),
  **"Ödevin gideceği en az bir öğrenci seç."** (seçim bölümünü açar), **"Quiz: …"** (quizin kendi iletisi; quiz bölümünü
  açar). Açıklamada yalnız düzenleyicinin araç çubuğunun üretebildiği biçimler kalır, öbürleri düz metne döner
  ([İzinli ve izinsiz kod](../yazi-yazma/izinli-ve-izinsiz-kod.md)).

## Kardeşler ve ilgili

**Kardeşler** (aynı klasör, [Ödevler](README.md)):

- [Başlama ve son teslim](tarih-ve-saat.md), [Kime verilecek](alicilar.md), [Ödeve dosya ekleme](dosya-ekleme.md),
  [Dosya yükleme izni](dosya-yukleme-izni.md) — pencerenin parçaları.
- [Ödev listesi](liste.md) — verdiğin ödevin düştüğü yer.
- [Sonuçlandırma](sonuclandirma.md) — süre dolunca yapacağın iş.
- [Ödevi düzenleme ve silme](odevi-duzenleme-ve-silme.md) — verdikten sonra değiştirmek.
- [Ödev hatırlatmaları](hatirlatmalar.md) — son günden önce öğrenciye giden bildirim.

**İlgili:**

- [Quiz ekleme](../quiz/quiz-ekleme.md), [Anketi ödeve ekleme](../anket/odeve-mesaja-ekleme.md).
- [Yazı düzenleyici nerelerde var](../yazi-yazma/nerelerde-var.md).
- [Otomatik bildirimler](../bildirim/otomatik-bildirimler.md), [Velinin bildirimleri](../bildirim/velinin-bildirimleri.md).
- [Yetki listesi](../roller-yetkiler/yetki-listesi.md), [Ders ve sınıf daraltması](../roller-yetkiler/ders-ve-sinif-daraltmasi.md).
- [Ders atama](../siniflar-dersler/ders-atama.md) — "Müdürünün seni bir sınıfın dersine ataması gerekiyor."
- [Takvim: gün ayrıntısı](../takvim/gun-ayrintisi.md) — verilen ödev son gününde takvimde görünür.

## Kod tarafı

- Ön yüz: [public/js/parcalar/11-ogretmen-odev.md](../../public/js/parcalar/11-ogretmen-odev.md) — `SAYFALAR['ogr-odevler']`
  (sayfa ve "Yeni ödev ver"), `odevYeniModal` (pencere; `GET /api/assignments/hedefler`), `odevSecimBagla`, `dosyaYuklemeKutusu`.
  Kaydetme [public/js/parcalar/25-tiklama.md](../../public/js/parcalar/25-tiklama.md) — `odev-kaydet` (en az bir öğrenci,
  ek yükleniyor mu, quiz bozuk mu → `POST /api/assignments` → `git('ogr-odevler')`).
- Parçalar: [04e-tarih-secici.md](../../public/js/parcalar/04e-tarih-secici.md) (`tarihAlani`, `saatAlani`, `tsSonrakiYarim`),
  [04d-ekler.md](../../public/js/parcalar/04d-ekler.md) (`ekAlani`), [14c-quiz.md](../../public/js/parcalar/14c-quiz.md)
  (`quizAlani`, `quizGovdesi`).
- Sunucu: [sunucu/bolumler/odev.md](../../sunucu/bolumler/odev.md) — `POST /api/assignments` (ad, ders, öğrenci kesişimi,
  tarih kuralları, ders o sınıfta var mı, `odev.ver` ders + sınıf kapsamı, `ekleriDogrula`, `yeniOdevQuizi`, tek işlem,
  `yilDamgasi`, `topluBildir` "Yeni ödev: …"); `GET /api/assignments/hedefler`.
  [sunucu/bolumler/ekler.md](../../sunucu/bolumler/ekler.md) (`ekleriDogrula`, `ekleriBagla`),
  [sunucu/bolumler/quiz.md](../../sunucu/bolumler/quiz.md), [sunucu/yetki.md](../../sunucu/yetki.md) (`odev.ver`),
  [sunucu/iliskiler.md](../../sunucu/iliskiler.md) (`ogretmeninOgrencileri`, `ogretmeninSiniflari`),
  [sunucu/api.md](../../sunucu/api.md) (özellik kapısı, arşiv yılı kapısı).
- Depo: [sunucu/veri/depo/odevler.md](../../sunucu/veri/depo/odevler.md) — `ekle` (ödev, öğrencileri ve sınıfları tek
  işlemde; tablolar `odevler`, `odev_ogrencileri`, `odev_siniflari`), [sunucu/veri/depo/genel.md](../../sunucu/veri/depo/genel.md)
  (`topluBildir`, veli kopyası).
- Testler: [testler/test-kapsam.md](../../testler/test-kapsam.md) (rol kapsamıyla ödev verme, `hedefler`),
  [testler/test-odev-saat.md](../../testler/test-odev-saat.md), [testler/test-quiz.md](../../testler/test-quiz.md),
  [testler/test-egitim-yili.md](../../testler/test-egitim-yili.md), [testler/test-ozellikler.md](../../testler/test-ozellikler.md),
  [testler/buton-denetimi.md](../../testler/buton-denetimi.md).
- Kullanıcıya dönük anlatım: [belge/KILAVUZ.md](../../belge/KILAVUZ.md) ("Ödev sistemi").

## Sık sorulanlar

- **Ödevi verdim, öğrenci ne zaman görür?** Hemen. Başlama tarihini ileri bir güne koysan da ödev listesinde görünür ve
  bildirim hemen gider; quiz ancak başlama anında, dosya yükleme başlama gününün başında açılır.
- **Aynı ödevi iki sınıfa verebilir miyim?** Evet; "Ödev verilecekler"de iki sınıfın kutusunu işaretle. Ödev tek kayıttır,
  iki sınıfın öğrencilerine birden gider.
- **"Ödevi ver"e bastım, hiçbir şey olmadı gibi.** Pencere kapanıp liste açıldıysa ödev verilmiştir; ayrı bir "verildi"
  iletisi yok. Pencere açık kaldıysa altındaki iletiye bak.
- **Müdür neden ödev veremiyor?** Kullanıcının kararı: ödev öğretmenin işi; müdür ödevlere ders ders bakar.
- **Yanlış ödev verdim.** "Ödevi düzenle" ile düzelt ya da listeden "Sil" ([Ödevi düzenleme ve silme](odevi-duzenleme-ve-silme.md)).

## Sırada

- Düzenleyiciler: ödev açıklaması ortak yazı düzenleyiciyle yazılacak (onaylı).
- Anket düzenleyici: ödeve anket eklenecek; anketin hedefi ödevin öğrencileri.
- Çalışan olarak ekleme: öğretmen olmayan çalışan ödeve atanamayacak.
- Özel branş / ders: "Ders" listesi okulun kendi açtığı derslerden gelecek.
- Ödev listesi düzeni: pencereden dönülen liste tek kutu, 15'erli olacak ([Ödev listesi](liste.md)).
- Android uygulaması: öğretmenin ödev verme ekranı uygulamaya da gelecek.
- Çok dil: pencere metinleri çeviri kataloğuna girecek (ödevin kendi metni çevrilmez).
