# Devamsızlık ve yoklama · Ders programından yoklama

**Durum:** Kodda var; tasarımda ek olarak yoklamanın TEK girişi ders programı olur (kullanıcı 3 Ekim 19:20): haftalık tablonun her hücresi o haftanın o dersinin yoklamasını açar (geçmiş ders görülür ve düzeltilir, süren ders alınır, gelecek ders "Bu dersin yoklaması … açılır" der), saati geçmiş ve yoklaması alınmamış ders hücresi parlar ve ünlem alır, pencerede "Önceki ders / Sonraki ders" geçişi, öğrenciler işaretsiz başlar ve herkes işaretlenmeden kaydedilmez, kayıttan sonra "Yoklama kaydedildi" penceresi velilere giden bildirimleri listeler; menüdeki ayrı "Yoklama" kalkar.

Öğretmenin "Ders Programım"da dersin kartından (tasarımda tablonun hücresinden) açtığı, telefonda tek elle, üç büyük düğmeyle yoklama
aldığı pencere.

## Ne işe yarar

Kullanıcının 26 Eylül isteği: öğretmen kendi ders programında **o an girdiği derse** dokunsun, **yoklama penceresi** açılsın, her
öğrenci alt alta, seçenekler **"geldi · gelmedi - izinli · gelmedi - izinsiz"**, altta **kaydet**; gelmedi yazılırsa veliye "çocuğunuz
bugün şu derste, şu saatte gelmedi" gitsin; ekran telefondan kullanıma uygun olsun. Öğretmen ayrı "Yoklama" sayfasına gitmeden dersin
başında iki dokunuşla yoklama alır; bildirimde dersin saati de yazar.

Kullanıcı 3 Ekim 19:20'de bunu yoklamanın tek yolu yaptı: "Ders programım"da derse tıklayınca **o haftanın o dersinin yoklaması**
açılır; menüdeki ayrı "Yoklama" kalkar; saati geçmiş ve yoklaması alınmamış ders programda **parlar** ve **ünlem** alır. Kullanıcı
önizlemeyi bir öğretmene gösterdi; öğretmen "bayıldı".

Bugünkü sitede bu pencere [Ders yoklaması](ders-yoklamasi.md) ile aynı kaydı yazar (ders + gün); hangisinden kaydedersen o dersin o
günkü yoklaması odur.

## Nereden açılır

- **Öğretmen:** sol menü **"Ders Programım"** → **Gün** görünümü → bugünün dersinin kartının altındaki düğme:
  - ders şu an sürüyorsa dolu düğme **"Şu an — yoklama al"**;
  - derse 15 dakika kala ve ders bittikten sonra gün boyu soluk düğme **"Yoklama"**;
  - 15 dakikadan daha uzaktaki dersin kartında düğme yok.
- Düğmenin çıkması için: okulda "Devamsızlık" bölümü açık, sende "Yoklama alır" yetkisi var, ders **bugün**.
- **Müdür:** menüsünde "Ders Programım" yok; ders veren müdür adresle (`#/programim`) ya da programa bağlanan bildirimlerle ("Bugün N
  dersin var: …") gelirse kendi derslerini öğretmen gibi görür ve aynı düğmeyi kullanır.
- Haftalık görünümde düğme yoktur.

Tasarımda (Tasarım 1 önizlemesi, 3 Ekim akşamı):

- **Öğretmen:** **"Ders programım"** tek bir **haftalık tablo**dur; **her dolu hücre** o haftanın o dersinin yoklama penceresini açar
  (gün görünümü ve kart düğmesi yok).
- Ana sayfadaki **"Yoklama"** kutucuğu (alt yazısı **"2 dersin yoklaması alınmadı"**, rozette sayı; hepsi alındıysa **"bu hafta hepsi
  alındı"**) ders programını açar ve **o anki dersin** penceresini üstünde açar. Süren ders yoksa bugünün son biten dersi, o da yoksa
  bugünün ilk dersi açılır.
- Ana sayfanın **"Bugünkü derslerin"** kutusundaki satır (**"Yoklama al"**, **"Alındı"**) o dersin penceresini ana sayfanın üstünde
  açar. **"Yoklama alınmadı"** bildirimi ve eski **`#/yoklama`** adresi ders programına döner ve o anki dersin penceresini açar.
- Menüdeki ayrı **"Yoklama"** satırı yoktur ([Ders yoklaması](ders-yoklamasi.md)).

## Adım adım

### Öğretmen (bugünkü site)

1. **"Ders Programım"**ı aç; Gün görünümünde bugünün kartlarında **"Şu an — yoklama al"** (ya da soluk **"Yoklama"**) düğmesine bas.
2. **"Yoklama"** penceresi açılır. Üstte **"7-A · Matematik · bugün 09:20 · 28 öğrenci"** ve **"Hepsi geldi"**.
3. Öğrenciler alt alta (baş harfli yuvarlak ve ad); her birinin altında üç büyük düğme: **"Geldi"**, **"Gelmedi — izinli"**,
   **"Gelmedi — izinsiz"**. Seçili düğme renklenir: Geldi yeşil, izinli mavi, izinsiz kırmızı. Başta herkes **"Geldi"**; o derse bugün
   daha önce yazılmış "Gelmedi" kaydı varsa o seçili gelir.
4. Gelmeyenleri işaretle. **"Hepsi geldi"** herkesi "Geldi" yapar (önceki işaretlerin de).
5. **"Kaydet"**e bas (düğme **"Kaydediliyor..."** olur). Pencere kapanır ve sayfanın üstünde yeşil ileti çıkar:
   - **"Yoklama kaydedildi. Gelmeyen 2 öğrencinin velisine bildirim gitti."**
   - herkes geldiyse **"Yoklama kaydedildi. Herkes geldi."**
6. **"Vazgeç"** pencereyi kaydetmeden kapatır.
7. Hata olursa pencerenin içinde kırmızı yazar ve **"Kaydet"** yeniden basılabilir olur. Pencere hiç açılamazsa (yetki yok, bölüm
   kapalı…) hata tarayıcının uyarı kutusunda çıkar.
8. Gelmeyen (izinli ya da izinsiz) öğrenciye ve velisine, dersin saatiyle bildirim gider: **"Çocuğunuz Elif Yılmaz bugün saat 09:20
   Matematik dersine gelmedi (izinsiz)."** (["Gelmedi" bildirimi](devamsizlik-bildirimi.md)).

**"Geç geldi" bu pencerede yok.** O derste bugün "Geç geldi" yazılmış öğrenci pencerede **"Geldi"** seçili görünür ve kaydedince
**"Geç geldi" olarak kalır** — "Geldi"ye ya da "Hepsi geldi"ye basılsa da. "Geç geldi"yi kaldırmak için "Yoklama" sayfası ya da müdürün
"Devamsızlık" ekranı gerekir.

### Müdür (bugünkü site)

Ders veren müdür, `#/programim`'e gelince öğretmen gibi kendi derslerini görür; düğme ve pencere aynıdır.

### Tasarımda (Tasarım 1 önizlemesi ve kullanıcının 3 Ekim 19:20 kararı)

**Öğretmen — ders programı**

1. **"Ders programım"** (alt yazı **"Bu hafta 20 ders saati · 1 çakışma"** — sayılar öğretmenin programından). Tablonun başlığı
   haftanın tarihleriyle: **"Bu hafta · 28 Eylül – 2 Ekim"**, yanında **"ders 40 dk · teneffüs 10 dk"**. Satırlar **"1. ders 08:30–09:10"**, **"2. ders 09:20–10:00"** …; sütunlar
   günler, her günün altında tarihi (**"1 Ekim"**); bugünün sütununda **"bugün"** yazar. Boş saat **"[boş]"**.
2. Dolu hücrede sınıf adı ve altında durum:
   - süren derste **"şimdi · yoklama al"** (alındıysa **"şimdi · yoklama alındı"**);
   - saati geçmiş derste (bu haftanın önceki günleri ve bugünün biten dersleri) **"yoklama alındı"** ya da **"yoklama alınmadı"**;
   - gelecek derste ders adı (**"Matematik"**).
3. **Saati geçmiş ve yoklaması alınmamış** hücre **parlar**: kırmızı kenar, açık kırmızı zemin, yavaşça atan bir ışık (hareket azaltma
   açıksa sabit ışık); sağ üstünde turuncu, köşeli **"!"**. Üzerine gelince **"Yoklama alınmadı"** yazar. Çakışmanın ünlemi ayrıdır:
   kırmızı ve yuvarlak (**"8-B ile 7-C çakışıyor"**); ikisi aynı hücrede olursa alt alta durur.
4. Tablonun üstünde, saati geçmiş alınmamış ders varken kırmızı kutu: **"!"** **"1 dersin yoklaması alınmadı"** / **"Saati geçti;
   derse bas, yoklamasını al."** Bu kutu yalnız saati GEÇMİŞ dersleri sayar; ana sayfa kutucuğu süren dersi de sayar (önizlemede kutu
   "1", kutucuk "2 dersin yoklaması alınmadı"). Çakışma varsa onun kutusu ayrıca: **"1 çakışma var"** ve **"Salı 2. ders (09:20–10:00) ·
   8-B ile 7-C aynı saatte"**.
5. Herhangi bir dolu hücreye bas: o dersin **"Yoklama"** penceresi açılır.

**Öğretmen — yoklama penceresi**

1. Başlık **"Yoklama"**; altında kalın **"7-A · Matematik · 3. ders"** ve **"Perşembe, 1 Ekim (bugün) · 10:10–10:50"**. Sağda
   durum etiketi: **"Şu an"**, **"Alındı · 10:21"**, **"Alınmadı"** ya da **"Henüz açılmadı"**.
2. Altında iki geçiş düğmesi: **"Önceki ders"** ve **"Sonraki ders"**, her birinin altında küçük yazıyla o ders (önizlemede 3. dersin
   penceresinde **"Bugün 1. ders · 8-B"** ve **"Bugün 5. ders · 7-C"**; başka günün dersi gün adıyla, ör. **"Çarşamba 6. ders · 7-A"**).
   Haftanın derslerini sırayla gezersin (pencereyi kapatmadan).
3. **Çakışan saat** (aynı saate iki sınıf): **"8-B ile 7-C aynı saate düşmüş; ders programını müdür düzenler. Her sınıfın yoklaması
   ayrı:"** ve sınıf çipleri (**"8-B"**, **"7-C"**); çipe basınca o sınıfın listesi gelir. Hücre ancak iki sınıfın yoklaması da
   alınınca "alındı" sayılır.
4. **Gelecek ders:** saat simgesi, **"Bu dersin yoklaması bugün 11:50'de açılır."** (başka günde **"… Cuma 08:30'da açılır."**), altında
   **"27 öğrenci · 7-C"**, düğme **"Kapat"**. Liste ve kayıt yok.
5. **Süren ya da geçmiş ders:** **"28 öğrenci"** ve **"Hepsi geldi"**; öğrenciler alt alta (renkli baş harf ve ad), her birinde üç
   düğme **"Geldi"**, **"Gelmedi (izinli)"**, **"Gelmedi (izinsiz)"**.
   - Yoklaması alınmamış derste öğrenciler **işaretsiz** başlar; işaretsiz satır ayrı renkte görünür.
   - Alınmış (geçmiş) derste kaydedilen işaretler gelir: görür, istersen düzeltirsin.
   - **"Hepsi geldi"** yalnız **işaretsiz** öğrencileri "Geldi" yapar; işaretlediklerine dokunmaz.
6. Altta sabit çubuk: **"26 geldi · 1 gelmedi · 1 işaretlenmedi"** (izinli ve izinsiz birlikte sayılır), **"Vazgeç"**, **"Kaydet"**.
7. İşaretsiz öğrenci varken **"Kaydet"**: kısa ileti **"1 öğrenci işaretlenmedi; önce herkesi işaretle."**, işaretsiz satırlar
   vurgulanır, pencere ilk işaretsiz öğrenciye kayar; kayıt yapılmaz.
8. Herkes işaretliyse kaydedilir ve **"Yoklama kaydedildi"** penceresi açılır:
   - **"7-A · Matematik · 3. ders · Perşembe 10:10–10:50"** ve **"26 geldi · 1 gelmedi (izinli) · 1 gelmedi (izinsiz)"**;
   - **"Velilere giden bildirimler (2)"**, her biri **"Veli · Elif Yılmaz"** ve metni: **"Çocuğunuz Elif Yılmaz bugün saat 10:10
     Matematik dersine gelmedi (izinsiz)."**; geçmiş günde **"Çocuğunuz Elif Yılmaz 30 Eylül Çarşamba saat 12:40 Matematik dersine
     gelmedi (izinli)."**;
   - bildirim gitmediyse **"Değişiklik yok; veliye yeni bildirim gitmedi."** ya da **"Herkes geldi; veliye bildirim gitmedi."**;
   - düğmeler **"Yoklamaya dön"** (aynı dersin penceresine döner) ve **"Tamam"**.
9. **Düzeltme:** alınmış bir dersin işaretini değiştirip kaydedersen yalnız durumu değişen öğrencinin velisine bildirim gider:
   **"Yoklama düzeltildi: çocuğunuz Elif Yılmaz bugün saat 10:10 Matematik dersine geldi."** ya da **"Yoklama güncellendi: çocuğunuz
   Elif Yılmaz bugün saat 10:10 Matematik dersine gelmedi (izinli)."** Geçmiş günün dersinde bir işaret değiştiyse başlığın sonuna
   **"· düzeltildi: bugün 14:05"** eklenir, ilk kayıt saati değişmez (bugünün dersini yeniden kaydedince "Alındı" saati yenilenir).
10. Kayıttan sonra tablodaki hücre **"yoklama alındı"** olur, parlama ve ünlem kalkar; ana sayfa kutucuğunun sayısı ve "Bugünkü derslerin"
    satırı (**"Alındı"**) güncellenir ([Yoklama alınmadı uyarısı](yoklama-alinmadi-uyarisi.md)).

**Öğretmen — ana sayfa**

- **"Bugünkü derslerin"**: **"1. ders · 8-B · Matematik · 08:30–09:10 · Alındı"**, süren derste **"3. ders · 7-A · Matematik · şu an"**
  ve **"Yoklama al"**, başlamamış derste (**"5. ders · 7-C · Matematik · 11:50–12:30"**) düğme yazısı yok; satıra basınca aynı pencere
  (başlamamış derste "Bu dersin yoklaması bugün 11:50'de açılır.").

## Kurallar ve sınırlar

- **Yetki:** düğme yalnız yetkinin varlığına bakar; asıl karar sunucuda: öğretmen kendi dersine (ya da müdürün açıkça verdiği derse)
  yoklama alır, değilse **"Bu ders için yoklama yetkin yok"** ([Kim yoklama alır, kim kimi görür](yetki-ve-kapsam.md)).
- **Zaman cihazın saatine göredir:** "bugün" ve "15 dakika kala" tarayıcının saatinden hesaplanır; kaydedilen gün ise pencere
  açılırken sunucudan gelen bugündür (sunucunun kendi saati). Düğme ders bittikten sonra da gün boyu kalır.
- **Kaydetme o dersin o günkü kaydını baştan yazar** (bütün liste gider); pencere açıkken başka biri ya da "Yoklama" sayfası kaydederse
  sonra basılan **"Kaydet"** öncekini ezer.
- **Blok ders tek kayıttır:** aynı dersin günde iki saati varsa ikinci saatin düğmesi pencereyi birincinin işaretleriyle açar ve onun
  üzerine yazar; bildirimdeki saat basılan kartın saatidir.
- **İletideki sayı her zaman doğru değil:** "Gelmeyen N öğrencinin velisine bildirim gitti" penceredeki "Gelmedi" işaretlerini sayar;
  sunucu ise yalnız durumu DEĞİŞEN öğrenciye yazar. Aynı yoklamayı ikinci kez kaydedersen ya da öğrencinin velisi yoksa bildirim gitmez
  ama ileti yine "gitti" der.
- **Not silinir:** pencere not göndermez; o dersin o günkü kayıtlarının notları boşalır (bugün hiçbir ekran not yazmadığı için kayıp
  yok).
- **Öğrencisiz sınıf:** liste boştur, **"Kaydet"** **"Yoklama boş"** der.
- **Geçmiş yıl ve kapalı bölüm:** kaydetmek geçmiş yıla bakarken 409 ile reddedilir (**"Geçmiş bir eğitim yılına bakıyorsun; kayıtlar
  salt okunur. Değişiklik için üstteki yıl seçiciden aktif yıla dön."**); bölüm kapalıysa düğme hiç çıkmaz.
- **İleri gün yok:** pencere her zaman bugünü yazar.
- **Kılavuzla fark:** [Kullanıcı kılavuzu](../../belge/KILAVUZ.md) ("Yoklama (ders programından)") düğmenin "o gün başlamış" derste
  çıktığını ve pencerenin "telefonda tam ekran" açıldığını söyler; kodda düğme dersten 15 dakika önce çıkar, pencere ekran genişliğinde
  ve ekranın en çok %88'i yüksekliğinde, içi kayan bir penceredir. Kılavuz üç seçeneğin öğrencinin "yanında" durduğunu yazar; kodda
  düğmeler adın altında, üç eşit sütundadır. Kılavuz ayrıca "Yoklama alır yetkisi daraltılmamış biri" de alır der; kodda tersi
  ([Kim yoklama alır, kim kimi görür](yetki-ve-kapsam.md)).
- **Tasarımda:**
  - yoklamaya yalnız ders programından girilir; hücre her zaman açılır, ama gelecek dersin yoklaması dersin başlangıç saatinde açılır
    (önceden açılmaz; bugünkü sitedeki "15 dakika önce" yok);
  - geçmiş ders görülür ve düzeltilir (kullanıcının kararı); önizlemede yalnız **bu haftanın** programı var, önceki haftalara geçiş
    kararlaştırılmadı (geçmiş haftaların düzeltmesi bugün müdürün [Okulun devamsızlığı](okulun-devamsizligi.md) ekranında);
  - herkes işaretlenmeden kaydedilmez; "Hepsi geldi" yalnız boşları doldurur;
  - **"Geç"** seçeneği yine yok (açık nokta, [Ders yoklaması](ders-yoklamasi.md));
  - pencerede **"Görüşme başlat"** ve **"Gelmeyenlere Katıl bildirimi"** düğmeleri yok; bunlar kalkan "Yoklama" sayfasındaydı, yeni yerleri
    kararlaştırılmadı ([Görüşme başlat ve gelmeyene haber](../toplanti/gorusme-baslat-ve-ping.md)).

## Kardeşler ve ilgili

**Kardeşler** ([Devamsızlık ve yoklama](README.md)): [Ders yoklaması](ders-yoklamasi.md) (aynı kaydın sayfası) ·
["Gelmedi" bildirimi](devamsizlik-bildirimi.md) · [Kim yoklama alır, kim kimi görür](yetki-ve-kapsam.md) ·
[Yoklama alınmadı uyarısı](yoklama-alinmadi-uyarisi.md) · [Okulun devamsızlığı](okulun-devamsizligi.md) ·
[Günün durumu](gun-durumu.md) (ders ders kayıtlardan günün hesabı).

**İlgili:** [Ders programım](../ders-programi/programim.md) · [Gün ve hafta görünümü](../ders-programi/gun-ve-hafta-gorunumu.md) ·
[Okulun ders saatleri](../ders-programi/ders-saatleri.md) · [Çakışma uyarısı](../ders-programi/cakisma-uyarisi.md) ·
[Ders başlamadan öğretmene bildirim](../bildirim/ders-oncesi-bildirim.md) · [Öğretmenin ana sayfası](../ana-sayfa/ogretmen-ana-sayfasi.md) ·
[Görüşme başlat ve gelmeyene haber](../toplanti/gorusme-baslat-ve-ping.md) · [Android uygulaması](../uygulama/android-uygulamasi.md).

## Kod tarafı

- Ön yüz: [public/js/parcalar/22-programim.md](../../public/js/parcalar/22-programim.md) — `ogretmenProgrami` (`altAlan.ekIslem`:
  düğmenin koşulları, "Şu an — yoklama al" / "Yoklama"), `PY_DURUM`, `EYLEMLER['program-yoklama']` (pencere), `py-durum`, `py-hepsi`,
  `py-kaydet` ("Geç geldi"nin korunması, ileti). Programın kendisi
  [public/js/parcalar/21-ders-programi.md](../../public/js/parcalar/21-ders-programi.md) (`gorunumSecici`, `programGovdesi`,
  `dersSutunu`). Pencere [public/js/parcalar/03-mesaj-modal.md](../../public/js/parcalar/03-mesaj-modal.md) (`modalAc`), açılamayınca
  uyarı kutusu `hataGoster` ([25-tiklama.md](../../public/js/parcalar/25-tiklama.md)).
- Sunucu: [sunucu/bolumler/devamsizlik.md](../../sunucu/bolumler/devamsizlik.md) — `GET` ve `POST /api/devamsizlik/yoklama`; `saat`
  yalnız bildirim metnine girer (`yoklamaMetni`). Öğretmenin programı
  [sunucu/bolumler/ogretmen.md](../../sunucu/bolumler/ogretmen.md) (`GET /api/teacher/schedule`).
- Görünüm: `public/css/parcalar/22-cesitli.css` (`.yoklama-al` en az 44 px, `.py-dugme` en az 48 px; [CSS.md](../../public/css/parcalar/CSS.md)),
  pencere yüksekliği `06-modal.css` (en çok %88).
- Testler: [testler/test-siniflarim.md](../../testler/test-siniflarim.md) (saatli yoklama ve veliye giden metin),
  [testler/test-devamsizlik.md](../../testler/test-devamsizlik.md), [testler/test-bildirim.md](../../testler/test-bildirim.md),
  [testler/buton-denetimi.md](../../testler/buton-denetimi.md).
- Kullanıcıya dönük anlatım: [belge/KILAVUZ.md](../../belge/KILAVUZ.md) ("Yoklama (ders programından)"; farkları yukarıda).
- Tasarım: Tasarım 1 önizlemesinin öğretmen modülü ve 3 Ekim akşamı geri bildirim modülü (haftalık tablo ve tarihleri, hücreden
  yoklama, parlayan "alınmadı" hücresi, önceki/sonraki ders, çakışmada sınıf çipleri, "Yoklama kaydedildi" ve "Yoklamaya dön").
  Kodlanınca gerekenler: haftanın her dersi için yoklamanın **alınıp alınmadığını** saklamak (bugün yalnız devamsızlık saklandığı için
  "herkes geldi" ile "hiç alınmadı" ayırt edilemez), saat denetiminin sunucuda yapılması.

## Sık sorulanlar

- **Düğme görünmüyor.** Gün görünümünde misin, ders bugün mü ve başlamasına 15 dakikadan az mı kaldı? Okulda "Devamsızlık" kapalıysa ya
  da "Yoklama alır" yetkin yoksa düğme hiç çıkmaz.
- **Geç kalan öğrenciyi nasıl yazarım?** Bu pencerede "Geç geldi" yok; "Yoklama" sayfasından o dersi aç ve "Geç geldi"yi seç.
- **İleti "velisine bildirim gitti" dedi ama veli almamış.** Öğrencinin onaylı velisi yoksa ya da aynı yoklamayı ikinci kez kaydettiysen
  bildirim gitmez; ileti bunu ayırt etmez.
- **Pencere telefonda tam ekran mı?** Hayır; ekran genişliğinde, ekranın en çok %88'i yükseklikte, içi kayan bir pencere açılır; düğmeler
  parmakla basılacak büyüklüktedir (en az 48 piksel).
- **Dünkü dersin yoklamasını unuttum.** Bugün "Yoklama" sayfasında o dersi seç, tarih kutusundan dünü seç. Tasarımda ders programında
  dünkü hücre parlar ve "!" taşır; ona basıp yoklamayı alırsın.
- **Yanlış işaretledim, nasıl düzeltirim?** Tasarımda aynı hücreye bas, işareti değiştir, "Kaydet"; veliye "Yoklama düzeltildi" ya da
  "Yoklama güncellendi" gider.

## Sırada

- **Yoklamaya ders programından girilir** (kullanıcı 3 Ekim 19:20; kod Linux'ta): menüdeki "Yoklama"nın kalkması, hücreden o haftanın
  dersi, parlayan "alınmadı" hücresi, ana sayfa kutucuğunda alınmamış ders sayısı.
- **Öğretmen ekranlarının tasarımı** (Tasarım 1): işaretsiz başlama, "Yoklama kaydedildi" penceresi, düzeltme bildirimleri.
- **Okulun ders saatleri** (kullanıcı 1 Ekim): pencere ve bildirim dersi numarasıyla yazar ("3. ders · 10:10–10:50").
- **Toplantılar + sınıfın uzaktan ders bağlantısı:** "Görüşme başlat", gelmeyene "Katıl" bildirimi (yoklama penceresindeki yeri
  kararlaştırılacak), öneri olarak "Uzaktan katıldı" durumu.
- **Android yerel uygulama:** ana sayfada "Şu an — yoklama al", Program + Yoklama (Geldi / Gelmedi izinli / izinsiz, Hepsi geldi,
  Kaydet).
