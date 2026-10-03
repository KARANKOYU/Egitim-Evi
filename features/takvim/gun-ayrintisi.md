# Takvim ve ajanda · Gün ayrıntısı

**Durum:** Kodda var; tasarımda ek olarak liste "Bugün yetişecek ödevler" (başka günde "Bu gün yetişecek ödevler"), "Ertesi gün yetişecek · <tarih>" ve "Hatırlatıcı, toplantı ve öbürleri" bölümlerine ayrılır, başlıkta kayıt sayısı yazar, her satır kendi penceresini açar; "Önümüzdeki 7 gün" ve "O günün dersleri" tablosu yoktur (Tasarım 1 önizlemesi; kullanıcının 1 Ekim isteği).

Takvimde bir güne basınca açılan liste: o günün tatili ve okul kayıtları, o gün ve sonraki günlerde biten ödevler, o günün dersleri.

## Ne işe yarar

"Bugün ne yetiştirmem lazım, yarın ne var?" sorusunun cevabı. Kullanıcı 29 Ağustos'ta "bir güne tıklayınca o gün yetiştirilmesi gereken
ve sonraki gün olacak ödev" yazsın, ayrıca "o günün hangi gün olduğu yazsın" dedi. 1 Ekim'de seçili günün altında "o günün şeyleri:
ödev, hatırlatıcı, toplantı gibi" görünmesini istedi.

## Nereden açılır

- **Takvim** → ay görünümünde bir güne bas ([Ay görünümü](ay-gorunumu.md)). Bugünkü sitede **"Bugün"** düğmesi de bugünü seçip bu
  listeyi açar.
- Bugünkü sitede liste ızgaranın **altında** ayrı bir kartta açılır. Tasarımda geniş ekranda takvimin **sağında**, dar ekranda altında
  durur; güne basınca sayfa kaymaz.
- Seçtiğin gün hatırlanır: takvim yeniden çizilince (ör. bir kayıt ekleyince) aynı günün listesi yeniden açılır.

## Adım adım

### Bütün roller (bugünkü site)

1. Güne bas. Kartta önce **"Yükleniyor..."**, sonra başlık: **"23 Nisan 2026 · Perşembe"** (gün, ay, yıl ve günün adı).
2. **O günün kayıtları** (varsa), her satırda tür etiketi, başlık ve varsa açıklama:
   - **"Tatil"** (ör. "Ulusal Egemenlik ve Çocuk Bayramı"; dinî bayramın ilk günü "Ramazan Bayramı (arife)"),
   - **"Özel gün"** (ör. "Öğretmenler Günü"),
   - okulun eklediği **"Etkinlik"**, **"Tatil"**, **"Sınav"**, **"Toplantı"** kayıtları (ör. etiket "Toplantı", başlık "Veli
     toplantısı", yanında soluk yazıyla açıklaması "Konferans salonu, 15:30"). Yetkiliysen bu satırların sağında **"Kaldır"**
     ([Takvimden kaldırma](etkinligi-kaldirma.md)).
3. **"Bugün teslim edilecek"** başlığı (hangi güne basarsan bas bu başlık yazar; bilinen açık) ve altında o gün biten ödevler:
   - ödevin adı; altında **"Matematik · saat 12:00"**; ödev sonuçlandıysa sonuna **" · sonuçlandı"**;
   - satıra basınca Ödevler sayfası açılır ([Takvimdeki kayda basınca](kayit-pencereleri.md));
   - o gün biten ödev yoksa **"Bu gün teslim edilecek ödev yok."**
4. **"Önümüzdeki 7 gün"** (yalnız varsa): sonraki günlerde bitecek ödevler, tarihe göre sıralı, **en çok 10**:
   ödevin adı ve altında **"Matematik · 25 Nisan Cumartesi · 09:20"**. Bu satırlar tıklanmaz.
5. **"O günün dersleri"** (yalnız varsa): **Saat · Ders · Sınıf · Öğretmen** tablosu (ör. "08:30 - 09:10 · Matematik · 7-A · Ayşe
   Kaya"), saat sırasıyla.
6. Bir hata olursa kartın içinde kırmızı ileti çıkar; sayfanın geri kalanı bozulmaz.

### Tasarımda (Tasarım 1 önizlemesi; bütün takvimi olan roller)

1. Liste başlığı: takvim simgesi, **"1 Ekim 2026 Perşembe · bugün"** (seçili gün bugün değilse "· bugün" yazmaz), sağda
   **"3 kayıt"** (o günün kayıt sayısı; ertesi günün ödevleri sayılmaz).
2. **Ödevi olan rollerde** (öğrenci, veli, öğretmen) liste üç bölümdür:
   - **"Bugün yetişecek ödevler"** (seçili gün bugünse) ya da **"Bu gün yetişecek ödevler"**; yoksa **"Son günü bu gün olan ödev yok."**
   - **"Ertesi gün yetişecek · 2 Ekim Cuma"**; yoksa **"Ertesi gün yetişecek ödev yok."** Ayın son gününde ertesi gün sonraki ayın 1'idir.
   - **"Hatırlatıcı, toplantı ve öbürleri"**: o günün öbür kayıtları; yoksa **"Bu günde başka kayıt yok."** (o gün ya da ertesi gün ödev
     varsa) ya da **"Bu günde bir şey yok."**
3. **Müdür ve servisçide** ödev bölümü yoktur; liste doğrudan gelir, boşsa **"Bu günde bir şey yok."**
4. Her satır: türün renginde simge, başlık, altında **"Tür · saat · ayrıntı"**. Önizlemedeki örnekler:
   - **"Ödev · son gün 23:00 · Matematik"** (öğrenci ve veli; sonuçlandıysa sonunda "· Yaptı" gibi sonuç);
   - öğretmende başlık **"7-A · Kesirlerle toplama — alıştırma 3"**, altında **"Ödev · son gün 23:00 · Matematik · 9 / 14 teslim"**
     (teslim eden / sınıftaki öğrenci sayısı; önizlemede 7-A'nın listesi 14 kişi);
   - **"Sınav · 10:10 · Fen Bilimleri · 3. ders · Ali Yıldız"**;
   - **"Toplantı · 15:30–16:30 · Konferans salonu"** (bağlantılı toplantıda yer yerine platform: "· Google Meet");
   - **"Etüt · 15:30–16:10 · 204 nolu sınıf · Ayşe Kaya"** (öğretmenin kendi takviminde öğretmen adı yazmaz);
   - **"Etkinlik · 09:00–15:00 · Arkeoloji Müzesi · 7. sınıflar"**; bütün gün süren etkinlikte **"Etkinlik · bütün gün · Spor salonu"**;
   - **"Duyuru · 07:20 · Murat Şahin · Müdür"**;
   - **"Resmî tatil · okul kapalı"**, **"Özel gün"**;
   - **"Hatırlatıcı · 20:00 · bir kez"**.
5. Sıra: önce bütün gün süren kayıtlar (tatil, özel gün, bütün gün etkinlik), sonra saate göre.
6. Satıra bas (ya da klavyeyle odaklanıp Enter) → kaydın penceresi açılır ([Takvimdeki kayda basınca](kayit-pencereleri.md)).
7. Liste ekran okuyucuya değiştikçe okunur. Ajanda'daki süzgeç kutucukları bu listeyi **etkilemez**.

### Öğrenci

- **Bugünkü site:** kendi ödevlerin ve sınıfının o günkü dersleri. Ödev satırına basınca Ödevler sayfan açılır.
- **Tasarımda:** ödevlerin iki bölümde (o gün ve ertesi gün), sonra sınavların, etütlerin, toplantılar, duyurular, hatırlatıcıların.

### Veli

- **Bugünkü site:** seçili çocuğunun (şeritte "Hepsi"de ilk çocuğunun) ödevleri ve sınıfının dersleri. Ödev satırına basınca açılan
  Ödevler sayfası, çocuğunun öğrenci portalını (Çocuklarım → çocuğun kartı) açmadıysan hata verir; "Veli · çocuğun adı" ile
  girmiş olman yetmez (bilinen açık; aşağıda).
- **Tasarımda:** açık olduğun çocuk oturumunun ödevleri ve kayıtları.

### Öğretmen ve ek görevli çalışan

- **Bugünkü site:** o gün biten, **senin verdiğin** ödevler (her ödev bir satır, öğrenci başına değil) ve kendi programın ("Sınıf"
  sütununda girdiğin sınıf). Bir öğrencinin portalındaysan o öğrencinin ödevleri ve sınıfının programı.
- **Tasarımda:** verdiğin ödevler sınıf adıyla ve teslim sayısıyla ("9 / 14 teslim"), açtığın sınavlar, toplantılar, kendi etütlerin.

### Müdür

- **Bugünkü site:** o gün biten **okuldaki bütün ödevler**; ders tablosu yok. Okulun kayıtlarında "Kaldır".
- **Tasarımda:** ödev bölümü yok; sınavlar, toplantılar, etütler, etkinlikler, duyurular, tatiller.

### Servisçi

- **Bugünkü site:** yalnız o günün tatili, özel günü ve okulun kayıtları. Ödevi olmadığı hâlde "Bugün teslim edilecek" başlığı ve
  "Bu gün teslim edilecek ödev yok." yazar.
- **Tasarımda:** ödev bölümü yok; tatiller, etkinlikler ve sana gelen duyurular.

## Kurallar ve sınırlar

- **Tarih bozuksa** sunucu **"Tarih gerekli"** der.
- **Ödevler kayıtlardan ayrıdır:** gün ayrıntısında ödevler olay listesine girmez, kendi başlıklarının altındadır.
- **Saatsiz ödev 12:00 sayılır** ("saat 12:00").
- **"Önümüzdeki 7 gün" çoğu zaman 6 gündür:** sınır dünya saatiyle (UTC) hesaplanır; Türkiye saatinde çalışan sunucuda seçili günden
  sonraki 6 günü kapsar. Ayrıca en çok 10 ödev gösterilir, fazlası görünmez.
- **Ödev satırı her rolde doğru yere gitmez** (bugünkü site): öğrencide ve bir öğrencinin portalında Ödevler sayfası doğru açılır;
  kendi takvimine bakan öğretmen ya da müdür ve çocuğunun öğrenci portalını açmamış veli ("Veli · çocuğun adı" ile girmiş olsa da)
  o sayfada **"Öğrenci bulunamadı"** hatası görür.
- **"Kaldır"** yalnız okulun eklediği kayıtlarda ve yalnız takvim yetkilisine görünür; resmî tatillerde ve ödevlerde yoktur.
- **Okulda "Ödevler" kapalıysa** "Bugün teslim edilecek" başlığı yine yazar, altında "Bu gün teslim edilecek ödev yok."; "Önümüzdeki
  7 gün" hiç çıkmaz.
- **Tasarımda** gün listesi, ödev listesindeki verinin **aynısını** kullanır (velide yalnız o oturumun çocuğu); takvimde gördüğün ödev
  ile Ödevler sayfasındaki ödev aynı kayıttır.

## Kardeşler ve ilgili

**Kardeşler:** [Takvim sayfası](takvim-sayfasi.md) · [Ay görünümü](ay-gorunumu.md) · [Takvim kimin gözünden](kimin-takvimi.md) ·
[Takvime ekle](etkinlik-ekleme.md) · [Takvimden kaldırma](etkinligi-kaldirma.md) · [Tatiller ve özel günler](tatiller-ve-ozel-gunler.md) ·
[Ajanda](ajanda.md) · [Ajandanın süzgeç kutucukları](ajanda-suzgeci.md) · [Takvimdeki kayda basınca](kayit-pencereleri.md).

**İlgili:** [Ödev listesi](../odev/liste.md) · [Ödevin penceresi](../odev/odev-penceresi.md) ·
[Ödevin tarih ve saati](../odev/tarih-ve-saat.md) · [Ders programım](../ders-programi/programim.md) ·
[Sınav ayrıntı ekranı](../sinav/sinav-ayrintisi.md) · [Toplantının penceresi](../toplanti/toplanti-penceresi.md) ·
[Etüt ayrıntısı](../etut/etut-ayrintisi.md) · [Takvimde ve ajandada hatırlatıcılar](../hatirlatici/takvimde-ve-ajandada.md) ·
[Mesajdan ajandaya ve hatırlatıcıya ekleme](../mesaj/ajandaya-ve-hatirlaticiya-ekle.md).

## Kod tarafı

- Ön yüz: [public/js/parcalar/17-takvim.md](../../public/js/parcalar/17-takvim.md) (`takvimGunCiz`: başlık, olaylar, "Kaldır",
  "Bugün teslim edilecek", "Önümüzdeki 7 gün", "O günün dersleri", hata kartı; `OLAY_AD`),
  [public/js/parcalar/25-tiklama.md](../../public/js/parcalar/25-tiklama.md) (`takvim-gun`: seçili kutunun değişmesi).
- Sunucu: [sunucu/bolumler/takvim.md](../../sunucu/bolumler/takvim.md) (`GET /api/takvim/gun?tarih=&studentId=`: `gunAdi`, `olaylar`,
  `teslim`, `yaklasan` (en çok 10), `dersler`, `yonetebilir`; "Dikkat!" bölümünde 6 gün notu),
  [sunucu/bolumler/odev.md](../../sunucu/bolumler/odev.md) (`odevSaati`: saatsiz ödev 12:00), [sunucu/iliskiler.md](../../sunucu/iliskiler.md)
  (`GUN_ADLARI`).
- Testler: [testler/test-takvim.md](../../testler/test-takvim.md) (öğrencinin günü, ders programı),
  [testler/test-odev-saat.md](../../testler/test-odev-saat.md) (gün ayrıntısında ödevin saati).
- Tasarımdaki üç bölümlü liste Tasarım 1 önizlemesindedir; kodlanınca bu bölüm güncellenir.

## Sık sorulanlar

- **Başka bir güne bastım, başlık yine "Bugün teslim edilecek" diyor.** Bilinen açık: başlık sabit yazılmış; altındaki ödevler seçtiğin
  günündür.
- **Yarının ödevleri nerede?** Bugünkü sitede "Önümüzdeki 7 gün" listesinde. Tasarımda ayrı bir "Ertesi gün yetişecek" bölümü var.
- **Öğretmenim, ödev satırına bastım, hata çıktı.** Bilinen açık: satır öğrencinin Ödevler sayfasına gider. Kendi ödevlerin için menüdeki
  "Ödevler"i kullan.
- **Ders tablosunda "Öğretmen" sütunu boş.** Dersin öğretmeni atanmamışsa boş kalır ([Ders programım](../ders-programi/programim.md)).

## Sırada

- Arayüz önizlemesi (Tasarım 1): üç bölümlü gün listesi, her satırın kendi penceresi, takvimin yanında duran liste.
- Mesaj ayarları (çark), Bu mesajı bildir, Ajanda, sınav planlama, duyurudan ajanda+hatırlatıcı, ödev hatırlatma otomasyonu: gün
  listesine sınavlar ve duyurular girer.
- Toplantılar + sınıfın uzaktan ders bağlantısı + tahta hesabı: toplantılar gün listesine girer.
- Güvenlik denetimi: "yaklaşan" penceresinin Türkiye gününe bağlanması (6 gün sorunu).
