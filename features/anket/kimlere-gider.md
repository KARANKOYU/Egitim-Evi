# Anketler · Anketin kimlere gittiği

**Durum:** Kodda var; tasarımda ek olarak öğretmen hedefi kendi sınıfları için "7-A öğrencileri", "7-A velileri" diye çiplerle seçer
ve ödeve ya da mesaja eklenen anketin hedefi ödevin öğrencileri ya da mesajın alıcıları olur.

Anketin kime gideceğinin ("Kime": Tüm okula, Rol grubuna, Sınıflara) nasıl çözüldüğü, velilerin nasıl eklendiği ve listenin neden
açılışta dondurulduğu.

## Ne işe yarar

Oyu kimin verebileceği anket açılırken bir kez hesaplanır ve anketin "hedef listesi" olarak saklanır. Böylece oy yalnız bu listedeki
kişiden kabul edilir (veritabanı da buna bağlıdır), sonuçta "12 / 40 kişi oy verdi" gibi bir oran çıkar ve kimin oy vermediği
görülür. Hedef, okul duyurularıyla aynı kuralla çözülür: duyuru gibi kimsenin mesaj ayarına takılmaz ve öğrencilere giden anket
onaylı velilerine de gider (KILAVUZ: "Öğrenciye açılan anket velisine de gider.").

## Nereden açılır

- **Bugün:** Anketler → "Yeni anket" penceresindeki **"Kime"** listesi ve altındaki kutucuklar ([Anket açma](anket-acma.md)).
- **Tasarımda:** "Anket oluştur" sayfasının sonundaki **"Yayınla"** kutusunda **"Kimler:"** çipleri ([Anket oluştur](anket-olustur.md));
  anket ödeve ya da mesaja eklenince ayrı hedef seçilmez ([Anketi ödeve ya da mesaja ekleme](odeve-mesaja-ekleme.md)).

## Adım adım

### Müdür

**Bugün (kodda):** "Kime" listesinde üç seçenek var:

1. **"Tüm okula"** — okulda hesabı onaylı herkes: öğrenciler, öğretmenler (ek görevliler dahil), okula kayıtlı veliler, servisçiler ve
   öbür müdürler; ayrıca her öğrencinin onaylı velileri. Listedeki özet: **"Tüm okul"**. Bu seçenek "Okuldaki herkese mesaj atar"
   yetkisi ister; müdürde her zaman vardır ve ilk seçili gelir.
2. **"Rol grubuna"** — kutucuklar **"Öğrenciler (ve velileri)"**, **"Veliler"**, **"Öğretmenler"**; birden çoğunu işaretleyebilirsin.
   Özet işaretlediklerinin adları: **"Öğrenciler, Veliler"**. Hiçbirini işaretlemezsen **"En az bir rol seç"**.
3. **"Sınıflara"** — okulun sınıfları **"7-A (28 öğrenci)"** gibi kutucuk; seçtiğin sınıfların öğrencileri ve onların onaylı velileri.
   Özet sınıf adları: **"7-A, 7-B"**. Hiç işaretlemezsen **"En az bir sınıf seç"**; en çok 100 sınıf.
4. Sonra tek tek kişi seçimi yoktur; aynı kişi listeye bir kez girer (aynı okulda iki çocuğu olan veli bir kez), anketi açan sen
   listeye girmezsin.
5. "Anketi aç"tan sonra ileti kaç kişiye gittiğini söyler: **"Anket açıldı — 40 kişiye ulaştı."** Kimse kalmadıysa (ör. öğrencisi olmayan
   sınıf) **"Seçtiğin grupta kimse yok"**.
6. Hedef özeti listede ve sonuç penceresinde "<hedef özeti> · 12 / 40 kişi oy verdi" diye görünür.

**Tasarımda:** tanıma göre "Yayınla" adımında hedef bugünkü gibi okul / rol / sınıf seçilir. Tasarım 1 önizlemesinde müdürün eski
düzenleyici penceresinde **"Kimler:"** satırında **"7. sınıf öğrencileri"** çipi ve **"+ ekle"** bağlantısı görünüyor (çizim; seçim akışı
çizilmedi).

### Öğretmen

**Bugün (kodda):** anket açma yetkin varsa seçenekler müdürünkiyle aynıdır; "Tüm okula" yalnız "Okuldaki herkese mesaj atar" yetkin de
varsa çıkar. "Sınıflara"da okulun bütün sınıfları listelenir (yalnız derse girdiğin sınıflar değil).

**Tasarımda (Tasarım 1 önizlemesi):** "Yayınla" kutusunda **"Kimler:"** — ders verdiğin her sınıf için iki çip: **"7-A öğrencileri"**,
**"7-A velileri"**, **"7-C öğrencileri"**, **"7-C velileri"**, **"8-B öğrencileri"**, **"8-B velileri"**. Çipe dokununca seçilir, yeniden
dokununca kalkar; hiçbiri seçili değilse "Yayınla" **"Kimlerin yanıtlayacağını seç."** der. Bugünkü kuraldan farkı: öğrenciler ve
velileri ayrı ayrı seçilir (bugün "Öğrenciler" seçilince velileri kendiliğinden eklenir). Anketi bir ödeve eklersen hedef ödevin
öğrencileri, bir mesaja eklersen mesajın alıcılarıdır. Kendi ödevine eklemek için toplu mesaj yetkisi gerekmez (tanım); mesaja eklemede
yetkinin ne olacağı tanımda yazılmadı.

### Çalışan

**Bugün (kodda):** ek rolünde anket açma yetkisi olan çalışan öğretmen gibi seçer. Rolün sınıf daraltması hedefi daraltmaz (rolü "6-A" ile
sınırlı kişi de bütün sınıfları ya da rol gruplarını seçebilir).

**Tasarımda:** rolüne verilen yetkiye göre öğretmen ya da müdür gibi; ayrıntı kodlamadan önce "Anket açar" yetkisiyle birlikte
belirlenecek.

### Öğrenci

Anket "Tüm okul"a, "Öğrenciler"e ya da sınıfına açıldıysa hedeftesin; Anketler'de kartını görür, oy verirsin. Anket açıldıktan sonra
okula ya da sınıfa katıldıysan o ankette yoksun. Sonradan sınıf değiştirsen ya da okuldan ayrılsan da hedef listesinde kalırsın.

### Veli

- Çocuğun hedefteyse (Tüm okul, "Öğrenciler (ve velileri)" ya da çocuğunun sınıfı) sen de doğrudan hedeftesin: anket sana bir kopya
  olarak değil, kendi oyunu vereceğin ayrı bir hedef olarak gelir. Çocuğun anket açıldıktan sonra bağlandıysa o ankette yoksun.
- **"Veliler"** rol grubu, hesabında okul olarak bu okul kayıtlı olan velileri alır. Velinin hesabında kayıtlı okul ilk bağlanan
  çocuğun okuludur; bu yüzden çocukları iki ayrı okulda olan veli, ikinci okulun yalnız "Veliler"e açtığı anketi almayabilir (o okulun
  öğrencilere ya da sınıfa açtığı anketi çocuğu üzerinden alır).
- Kardeşler aynı ankette hedefteyse tek kez hedeftesin, tek oyun vardır.
- Tasarımda her çocuğun oturumunda yalnız o çocuk için açılan anketler görünür; aynı anketin iki çocuğun oturumunda iki kez mi
  yanıtlanacağı kararlaştırılmadı ([Velide her çocuk ayrı oturum](../portallar/velide-cocuk-oturumlari.md)).

### Servisçi

"Tüm okula" açılan ankette servisçi de okulun onaylı hesabı olarak hedef listesine yazılır, **"Anket: <soru>"** bildirimini alır ve
hedef sayısına girer; ama servisçinin anket sayfası yoktur (sunucu reddeder), oy veremez. Sonuç penceresinde "oy vermedi" olarak
görünür. Rol grubunda servisçi seçeneği yoktur. Bu bir bilinen açıktır (kod değiştirilmedi).

## Kurallar ve sınırlar

- **Hedef türleri:** yalnız okul, rol, sınıf. Kişi seçimi yok (**"Anketin kime gideceğini seç"**). Bu kural sunucudadır.
- **Yetkiler:** "Tüm okula" — "Okuldaki herkese mesaj atar" (yoksa **"Tüm okula gönderme yetkin yok"**); rol ve sınıf — "Sınıfa veya
  gruba toplu mesaj atar" (yoksa **"Toplu gönderme yetkin yok"**).
- **Velileri ekleme:** hedefteki her öğrencinin onaylı velileri listeye eklenir. Veli hesabı onaylı değilse eklenmez.
- **Mesaj ayarları aşılır:** alıcının "Bana kim yazabilir?" seçimi ("Okuldaki herkes yazabilir", "Yalnızca öğretmen ve yöneticiler
  yazabilir", "Kimse yazamasın") ve engel listesi ankete bakılmaz (duyuru kuralı).
- **Dondurma:** liste açılış anında yazılır; sonradan gelen öğrenci, yeni bağlanan veli, okula yeni eklenen öğretmen ankette yoktur.
  Sınıf değiştiren ya da okuldan ayrılan kişi listede kalır. Hesabı silinen kişi listeden de oylardan da çıkar.
- **Rol grubunda "Yöneticiler" yok:** sunucu müdürleri de rol olarak kabul eder ama pencere sunmaz; müdürler yalnız "Tüm okula"
  açılan ankette hedeftedir.
- **Başka okulun sınıfı** seçilemez (listede yok; elle gönderilse sessizce atlanır, hiçbiri kalmazsa **"Sınıf bulunamadı"**).
- **Sayı:** "Anket açıldı — N kişiye ulaştı." iletisindeki N hedef listesinin uzunluğudur (veliler dahil).

## Kardeşler ve ilgili

**Kardeşler** (aynı klasör, [Anketler](README.md)):

- [Anket açma](anket-acma.md) — "Kime" listesinin bulunduğu pencere.
- [Oy verme ve oyu geri alma](oy-verme.md) — oy yalnız hedef listesindekinden kabul edilir.
- [Sonuçlar, kim oy verdi, bitirme ve silme](sonuclar.md) — hedef listesi katılım listesidir.
- [Anketi ödeve ya da mesaja ekleme](odeve-mesaja-ekleme.md) — tasarımda hedef = ödevin öğrencileri ya da mesajın alıcıları.

**İlgili:**

- [Duyuru](../mesaj/duyuru.md), [Yeni mesaj ve alıcı seçimi](../mesaj/yeni-mesaj.md) — aynı hedef çözümü.
- [Bana kim yazabilir?](../mesaj/bana-kim-yazabilir.md) — anketlere uygulanmayan ayar.
- [Velinin bildirimleri](../bildirim/velinin-bildirimleri.md) — veli de hedef olduğu için ayrıca kopya gelmez.
- [Velide her çocuk ayrı oturum](../portallar/velide-cocuk-oturumlari.md), [Çocuklarım](../portallar/cocuklarim.md).

## Kod tarafı

- Sunucu: [sunucu/bolumler/mesaj.md](../../sunucu/bolumler/mesaj.md) (`mesajAlicilariCoz(me, hedef, 'duyuru')`, `ROL_AD`,
  `mesajGidebilirMi`), [sunucu/bolumler/anket.md](../../sunucu/bolumler/anket.md) (yalnız `okul|rol|sinif`; tekilleştirme, açanın
  çıkarılması, "Seçtiğin grupta kimse yok"), [sunucu/veri/depo/kullanicilar.md](../../sunucu/veri/depo/kullanicilar.md) (`okulun`,
  `veliHaritasi`), [sunucu/veri/depo/anketler.md](../../sunucu/veri/depo/anketler.md) (`anket_hedefleri`),
  [sunucu/veri/sema/SEMA.md](../../sunucu/veri/sema/SEMA.md) (şema 006: oy satırı hedef listesine bağlı).
- Ön yüz: [public/js/parcalar/19b-anketler.md](../../public/js/parcalar/19b-anketler.md) ("Kime", rol ve sınıf kutucukları).
- Testler: [testler/test-anket.md](../../testler/test-anket.md) (6-A'ya açılan anket: iki öğrenci + bir veli = 3 kişi; veli anket açılmadan
  önce bağlanır; kişi seçimiyle açılmaz), [testler/test-servis-konum.md](../../testler/test-servis-konum.md).

## Sık sorulanlar

- **Yeni gelen öğrenci açık ankete oy veremiyor.** Hedef listesi açılışta dondurulur; yeni öğrenci o ankette yoktur. Gerekirse anketi
  silip yeniden aç (oylar gider) ya da yeni öğrenciler için ayrı anket aç.
- **"Öğrenciler"i seçtim, veliler neden oy veriyor?** Öğrencilere açılan anket onaylı velilerine de gider ("Öğrenciler (ve velileri)").
- **Yalnız öğrencilere sormak istiyorum, veliler olmasın.** Bugünkü sitede olmuyor; "Öğrenciler" ve "Sınıflar" velileri de alır.
  Tasarımda öğretmen "7-A öğrencileri" ve "7-A velileri"ni ayrı seçer.
- **Velisi olduğum iki çocuk aynı sınıfta; iki kez mi oy veririm?** Hayır, hedef listesine bir kez girersin.

## Sırada

- Anket düzenleyici: "Yayınla" adımında "Kimler:" çipleri; anket ödeve ya da mesaja eklenince hedef ödevin öğrencileri ya da mesajın
  alıcıları.
- Velide her çocuk ayrı oturum: anketin çocuk oturumlarına göre gösterilmesi.
- Tek kişi tek hesap + portallar: velinin ve öğrencinin birden çok kurumda olması hedef çözümünü etkileyecek.
- Bilinen açıklar (kod değiştirilmedi): "Tüm okula" anketinin servisçiye de gitmesi; rol grubunda "Yöneticiler" seçeneğinin olmaması.
