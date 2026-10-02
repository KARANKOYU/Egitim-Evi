# public/js/parcalar/21-ders-programi.js

Ders programının hem düzenleme sayfası (müdürün sınıf sınıf "Ders Programı"sı) hem de bütün program ekranlarının ortak
çizimi: gün/hafta görünümü, gün şeridi, ders sıraları, çakışma ve "şimdi" işaretleri, ders saati ekleme/düzenleme
penceresi; ayrıca menülerin kullandığı `yetkim`.

## Bu dosya ne yapar?

Okulun ders programı sabit "1. ders, 2. ders" kutularından oluşmaz: müdür her gün için dersi istediği saat aralığıyla
ekler ("Pazartesi 09:20–10:00 7-A Matematik"). Program pazartesiden pazara yedi gündür, saatler okulun zil düzenine göre
serbest yazılır. Aynı öğretmenin ya da aynı sınıfın aynı gün kesişen iki dersi **çakışmadır**; sunucu bunu engellemez,
uyarır ve listeler, ekran da kırmızıyla işaretler.

Bu dosyada iki şey var:

1. **Ders Programı sayfası** (`SAYFALAR.program`) — müdür (menüde "Okul Düzeni → Ders Programı", ana sayfada "Ders
   Programı" kutucuğu) ve rolünde `program.duzenle` olan öğretmen (menünün ek bölümünde; başlık özel rolün adı ya da
   "Ek Yetkiler") sınıf seçip programı gün gün ya da haftalık görür, ders saati ekler, düzenler, siler.
2. **Ortak çizim** — `gorunumSecici`, `programGovdesi` ve altındaki gün/hafta görünümleri. [22-programim.md](22-programim.md)
   öğretmenin "Ders Programım"ını ve öğrencinin/velinin "Ders Programı"nı da bunlarla çizer (salt okunur). Yani bir
   öğrencinin telefonunda gördüğü program da buradan çıkar.

Bir de küçük ama çok kullanılan bir yardımcı burada durur: `yetkim(izin)` — menülerin ve düğmelerin "bu kişiye
göstereyim mi?" sorusu.

Düğmelerin işleri (gün seçme, görünüm değiştirme, ders saati ekleme/düzenleme/silme/kaydetme, çakışma listesini açma)
`25-tiklama.js`'teki `islem()`'dedir; aşağıda onları da anlattım.

## İçinde neler var?

### Sayfa

- `SAYFALAR.program` — `GET /api/school/classes`.
  - Sınıf yoksa: başlık "DERS PROGRAMI", alt yazı "Önce sınıf açman gerekiyor.", boş kutu "Program yapabilmek için en az
    bir sınıf gerekli." ve **Sınıflar sayfasına git** düğmesi (`data-nav="siniflar"`).
  - Varsa: `S.programSinif` hâlâ okulda varsa korunur, yoksa ilk sınıf (Türkçe ad sırasıyla) seçilir; sınıf listesi
    `S.programSiniflar`'a, `gunAdlari`/`gunSayisi` `S.gunAdlari`/`S.gunSayisi`'na yazılır (bu ikisini bugün kimse okumaz);
    sonra `programCiz()`.
- `programCiz()` — `GET /api/school/schedule?classId=<S.programSinif>`, cevabı `S.programVeri`'ye koyar ve çizer:
  - başlık "DERS PROGRAMI", alt yazı "Gün gün ya da haftalık bak. Ders ekle ile saatini kendin belirle, çakışma olursa
    uyarırım.";
  - bir kartta **Sınıf** seçimi `select#pSinif` (`.filtre-satir`);
  - `S.programUyari` doluysa (son kaydetmenin çakışma uyarısı) kırmızı kutu, sonra boşaltılır — uyarı bir kez görünür;
  - çakışma varsa kırmızı kutu "**N çakışma var**" ve liste (`ul.cakisma-liste`): "Öğretmen Ayşe Kaya — Pazartesi: 7-A
    Matematik (09:00-09:40) ↔ 7-B Matematik (09:20-10:00)" ya da "Sınıf 7-A — …". İlk beşi görünür, gerisi katlanır:
    "3 tanesini daha göster" / "Daha azını göster" (`button.baglanti`, `data-act="cakisma-ac"`);
  - `gorunumSecici()` ve `programGovdesi(d, true, …)` — düzenlenebilir program; her dersin alt satırında öğretmen adı ya da
    "öğretmen atanmadı";
  - **Bu sınıfın dersleri** kartı: her ders, öğretmeni (yoksa kırmızı "öğretmen atanmadı") ve etiket "3 / 4 saat"
    (programa yerleşen / haftalık): eşitse yeşil, eksikse turuncu, fazlaysa kırmızı. Ders yoksa "Bu sınıfa ders
    eklenmemiş. Sınıflar sayfasından ders ekleyebilirsin." (`data-nav="siniflar"`).
  - Çizdikten sonra `#pSinif` değişince `S.programSinif` güncellenir ve `programCiz()` yeniden çalışır (hata uyarı
    kutusunda).

### Yetki yardımcısı

- `yetkim(izin)` — oturum yoksa `false`; yönetici ve müdür her zaman `true`; başkasında `S.user.yetkiler` dizisinde bu
  izin var mı. **Kapsama bakmaz** (rol "yalnız 7-A" diye sınırlıysa da `true` döner); yalnız göstermek içindir, asıl
  kararı sunucu verir.

### Gün ve saat yardımcıları

- `GUN_KISA` — `['', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz']` (1 pazartesi … 7 pazar; sunucunun gün numarasıyla
  aynı).
- `bugunNo()` — cihazın saatine göre bugünün numarası (pazar 7).
- `gunlereBol(hucreler)` — `{ 1: [...], 3: [...] }`: ders saatlerini güne göre toplar, her günü başlangıç saatine göre
  sıralar.
- `dakika(s)` — `"09:20"` → 560; okunamazsa 0.
- `dersSiralari(hucreler)` — haftanın **ders sıraları**: bütün haftanın saat aralıkları sıralanır; kesişenler tek sıraya
  birleşir (`{ bas, bit }` dakika). Bitişik aralıklar (10:00'da biten, 10:00'da başlayan) ayrı sıradır. Böylece günler
  hizalanır: zil saatleri günden güne biraz farklı olsa da (cuma kısa gün) aynı sıra korunur.
- `siralaraYerlestir(siralar, liste)` — bir günün derslerini sıralara dağıtır: ders, başlangıcının düştüğü sıraya
  (`bas ≤ başlangıç < bit`) girer. Her sıra için bir dizi döner; boş dizi o gün o sırada ders yok demektir.
- `BOS_DERS` — `'[boş]'`.
- `cakisanKimlikler(d)` — `{ dersSaatiId: true }`: öğretmen ucundan gelen hücrelerin kendi `cakisma` bayrağından ve müdür
  ucunun `cakismalar[].lessons[].scheduleId`'lerinden.

### Çizim

- `gunSeridi(d, gunler, seciliGun)` — yedi küçük düğme (`.gun-nokta`, `data-act="program-gun"`, `data-gun`): gün kısaltması
  ve o günün ders sayısı (yoksa "–"); sınıflar `secili`, `dolu` / `bos`, `bugun` (kesik çizgili çerçeve).
- `dersSutunu(sp, sira, duzenlenebilir, carpisiyor, altSatir, ekIslem)` — bir dersin kartı (`.ders-sutun`): "Ders 2",
  bugün ve şu an o dersin saatindeyse "şimdi" etiketi ve `simdi` sınıfı (ana renkte çerçeve ve halka); "09:20 – 10:00";
  ders adı; alt satır
  (öğretmen ya da sınıf adı); çakışıyorsa kırmızı kart ve "Aynı saatte başka bir derse de yazılmış". Düzenlenebilirse
  **Düzenle** (`saat-duzenle`) ve **Sil** (`saat-sil`); değilse çağıranın verdiği `ekIslem` HTML'i (öğretmenin
  "Yoklama" düğmesi, [22-programim.md](22-programim.md)).
- `gunlukGorunum(d, duzenlenebilir, altAlan)` — **Gün** görünümü:
  - hangi gün: `S.programGun` seçilmişse o; değilse bugün; bugün ders yoksa dersi olan ilk gün (kimse boş ekranla
    karşılaşmasın); 1–7 dışındaysa pazartesi;
  - gün şeridi; altında gezgin (`.gun-gezgin`): "‹ önceki gün" / "sonraki gün ›" (pazardan pazartesiye döner), ortada
    "Pazartesi" ve "5 ders · 08:30 – 13:10" (ya da "ders yok") + "· bugün";
  - ders kartları haftanın sıralarına göre dizilir; o gün dersi olmayan sıra "Ders 4 [boş]" kartıdır; bir sırada iki ders
    varsa (çakışma) ikisi de aynı "Ders N" başlığıyla yan yana durur;
  - gün tümden boşsa: salt okunur görünümde "[boş] · Bu gün ders yok"; düzenlenebilirde yalnız **+ Ders ekle** kartı
    (`data-act="saat-ekle"`, `data-gun`). Düzenlenebilir görünümde bu kart her zaman en sondadır.
  - `altAlan(sp)` alt satırı verir; `altAlan.ekIslem(sp)` varsa salt okunur karta düğme ekler.
- `haftaHucresi(sp, duzenlenebilir, altAlan)` — haftalık tablodaki bir dersin içeriği: saat, ders, alt satır,
  düzenlenebilirse Düzenle/Sil.
- `haftalikGorunum(d, duzenlenebilir, altAlan)` — **Hafta** görünümü: `.hafta-sar` içinde `table.hafta` (dar ekranda yatay
  kayar). Başlık satırı "Gün", "Ders 1" … "Ders N" (N = haftanın sıra sayısı, en az 1; düzenlenebilirse sonda boş bir
  sütun). Her gün bir satır; bugünün satırı `bugun` sınıfı ve "bugün" etiketi. Dersi olmayan gün tek hücrede "[boş]";
  öbürlerinde her sıra bir hücre, o sırada ders yoksa "[boş]"; aynı hücrede birden çok ders `.hafta-ayrac` ile ayrılır;
  hücrede çakışan ders varsa hücre `cakisma`. Düzenlenebilirse satır sonunda "+" (`.hafta-ekle`, `saat-ekle`, ipucu
  "Pazartesi gününe ders ekle").
- `gorunumSecici()` — "Gün | Hafta" anahtarı (`.gorunum-secici`, `data-act="program-gorunum"`, `data-tur`); seçili olan
  `S.programGorunum`'a göre.
- `programGovdesi(d, duzenlenebilir, altAlan)` — `S.programGorunum === 'hafta'` ise haftalık, değilse günlük görünüm.
- `programYenidenCiz()` — açık sayfa `program` ise `programCiz()` (hata uyarı kutusunda); değilse `git(S.page)` (ör.
  "Ders Programım" sunucudan yeniden çizilir).

### Ders saati penceresi

- `saatModal(gun, mevcutId)` — `S.programVeri`'den çalışır. `mevcutId` verilirse o hücreyi bulur ve günü ondan alır.
  Sınıfın hiç dersi yoksa "Ders ekle" başlıklı pencerede "Bu sınıfa önce ders eklemelisin. Sınıflar sayfasından
  ekleyebilirsin." Yoksa alanlar:
  - **Gün** `select#mGun` (yedi gün, verilen gün seçili), **Ders** `select#mDers` ("Matematik — Ayşe Kaya" ya da
    "Matematik — öğretmen yok"; düzenlemede o dersin kaydı seçili);
  - **Başlangıç** `input#mBas` ve **Bitiş** `input#mBit` (`type=time`; yeni derste 09:00 ve 09:40);
  - ipucu "Saatleri okulunun zil düzenine göre serbestçe yazabilirsin.", ileti yeri `#saatMesaj`.
  Başlık "Ders ekle" ya da "Ders saatini düzenle"; düğmeler **Vazgeç** ve **Kaydet** (`data-act="saat-kaydet"`,
  `data-id` = düzenlenen ders saati ya da boş).

### Bu ekranın düğmeleri (`25-tiklama.js` içinde)

| Eylem | Ne yapar |
|---|---|
| `cakisma-ac` | `S.cakismaAcik`'ı tersine çevirir → `programYenidenCiz()`. |
| `program-gun` | `S.programGun = data-gun` (okunamazsa 1) → `programYenidenCiz()`. |
| `program-gorunum` | `S.programGorunum` = `'hafta'` ya da `'gun'`; tarayıcıda `ee_program_gorunum` olarak saklanır (açılışta `tiklamaKur` geri okur) → `programYenidenCiz()`. |
| `saat-ekle` | `saatModal(data-gun, '')`. |
| `saat-duzenle` | `saatModal(0, id)`. |
| `saat-sil` | Onay "Bu ders saati programdan silinsin mi?" → `POST /api/school/schedule-delete { scheduleId }` → `programCiz()`; hata uyarı kutusunda. |
| `saat-kaydet` | Başlangıç ya da bitiş boşsa `#saatMesaj`'a "Başlangıç ve bitiş saatini gir."; düğmeyi kilitler. `data-id` doluysa `POST /api/school/schedule-update { scheduleId, day, lessonId, start, end }`, değilse `POST /api/school/schedule-add { classId: S.programSinif, day, lessonId, start, end }`. Başarıda pencere kapanır; sunucu `uyari` döndüyse `S.programUyari` = "Bu öğretmen aynı saatte 7-B sınıfında Matematik dersinde de görünüyor (09:20-10:00)." ya da "Bu sınıfın aynı saatte başka dersi var: Müzik (09:00-09:40)."; sonra `programCiz()`. Hata `#saatMesaj`'a, düğme açılır. |
| `sinif-program` | ([20-siniflar.md](20-siniflar.md)'deki "Ders programı" düğmesi) `S.programSinif` = sınıf, `S.programGun = 0` → `git('program')`. |

### Durum alanları ([00-durum.md](00-durum.md))

`S.programSinif`, `S.programSiniflar`, `S.programVeri`, `S.programUyari`, `S.programGun` (0 = kendiliğinden seç),
`S.programGorunum` (`'gun'` | `'hafta'`), `S.cakismaAcik`. `S.gunAdlari` ve `S.gunSayisi` bu dosyada yazılır, okunmaz.

## Kimle konuşur?

- Parçalar ad sırasıyla tek bir IIFE'de birleşir (`/js/app.js`; [../../../sunucu/http.md](../../../sunucu/http.md)
  `birlesikOku`). Bu dosyanın çağırdıkları: `S` ([00-durum.md](00-durum.md)); `$`, `esc`, `api`
  ([01-yardimcilar.md](01-yardimcilar.md)); `ik` ([02-ikonlar.md](02-ikonlar.md)); `modalAc`
  ([03-mesaj-modal.md](03-mesaj-modal.md)); `git`, `yaz`, `hero`, `bosKutu` ([07-yonlendirme.md](07-yonlendirme.md));
  `SAYFALAR` ([08-ana-sayfa.md](08-ana-sayfa.md)); `hataGoster` (`25-tiklama.js`).
- Onu kullananlar:
  - [22-programim.md](22-programim.md) — `gorunumSecici`, `programGovdesi` (öğretmenin, öğrencinin, velinin programı),
    `bugunNo` ve `yetkim` (yoklama düğmesi).
  - `25-tiklama.js` — `programCiz`, `programYenidenCiz`, `saatModal` ve bütün `S.program*` alanları (yukarıdaki tablo);
    `tiklamaKur` açılışta `S.programGorunum`'u tarayıcıdan okur.
  - `yetkim`: [06-menu.md](06-menu.md) (menü maddeleri), [08-ana-sayfa.md](08-ana-sayfa.md) ("Excel Aktarım" kutucuğu),
    [10-mudur.md](10-mudur.md), [10b-hesaplar.md](10b-hesaplar.md), [11-ogretmen-odev.md](11-ogretmen-odev.md),
    [12-ogretmen-sinav.md](12-ogretmen-sinav.md), [14c-quiz.md](14c-quiz.md), [22-programim.md](22-programim.md).
  - Sayfaya yol: [06-menu.md](06-menu.md) (`program`: müdürde hep, öğretmende `program.duzenle` ile),
    [08-ana-sayfa.md](08-ana-sayfa.md) (müdürün kutucuğu), [20-siniflar.md](20-siniflar.md) ("Ders programı" düğmesi);
    Excel'den program yükleme ayrı bir yoldur ([15-aktarim.md](15-aktarim.md)).
- Sunucu uçları ([../../../sunucu/bolumler/okul.md](../../../sunucu/bolumler/okul.md); bölüme yalnız müdür ve öğretmen
  girer):
  - `GET /api/school/classes` — `sinif.yonet` (bkz. [20-siniflar.md](20-siniflar.md)).
  - `GET /api/school/schedule?classId=` — `program.duzenle`, önce kapsamsız, sonra sınıf kapsamıyla (rol 7-A ile
    sınırlıysa 7-B 403 "Bu ders ya da sınıf için yetkin yok"). Cevap `{ class: { id, name }, gunSayisi: 7, gunAdlari,
    cells: [{ id, day, start, end, lessonId, subject, teacherName }], lessons: [{ id, classId, subject, teacherId,
    teacherName, weeklyHours, placed }], cakismalar }`. `cakismalar` **okulun bütün** çakışmalarıdır: `[{ tur:
    'ogretmen'|'sinif', ad, day, dayName, saat, lessons: [{ scheduleId, classId, className, subject, start, end } × 2] }]`
    ([../../../sunucu/iliskiler.md](../../../sunucu/iliskiler.md) `cakismalariBul`).
  - `POST /api/school/schedule-add { classId, day, lessonId, start, end }` — `program.duzenle` (sınıf kapsamı).
    Denetimler (400): "Geçersiz gün" (1–7 dışı), "Başlangıç saatini SS:DD biçiminde gir (ör. 09:20)", "Bitiş saatini SS:DD
    biçiminde gir (ör. 10:00)", "Bitiş saati başlangıçtan sonra olmalı", "Bir ders 8 saatten uzun olamaz", "Bu sınıfa ait
    bir ders seç". Çakışma engellemez: cevaptaki `uyari` `{ tur: 'sinif'|'ogretmen', className, subject, start, end }`
    (`aralikCakismasi`). Kayıt o anki eğitim yılına damgalanır. Dersin öğretmenine günde en çok bir bildirim: "Ders
    programına yeni ders saatlerin eklendi. Programından bakabilirsin." (`#/programim`). Cevap `{ kayit, uyari,
    cakismalar }`.
  - `POST /api/school/schedule-update { scheduleId, day, lessonId, start, end }` — aynı denetimler ("Saatleri SS:DD
    biçiminde gir", "Ders saati bulunamadı"); öğretmene bildirim gitmez. Cevap `{ kayit, uyari, cakismalar }`.
  - `POST /api/school/schedule-delete { scheduleId }` → `{ cakismalar }`.
  - Bu üç yazma, geçmiş bir eğitim yılına bakan müdür/öğretmende 409 `{ arsiv: true }` "Geçmiş bir eğitim yılına
    bakıyorsun; kayıtlar salt okunur. …" alır ([../../../sunucu/api.md](../../../sunucu/api.md) `arsivYazmasiMi`); ileti
    pencerenin `#saatMesaj`'ına ya da (silmede) uyarı kutusuna düşer.
  - Ortak çizimin öteki veri kaynakları [22-programim.md](22-programim.md)'de: `GET /api/teacher/schedule`
    ([../../../sunucu/bolumler/ogretmen.md](../../../sunucu/bolumler/ogretmen.md)) ve `GET /api/myschedule`
    ([../../../sunucu/bolumler/ilerleyis.md](../../../sunucu/bolumler/ilerleyis.md)).
- Veri: [../../../sunucu/veri/depo/siniflar.md](../../../sunucu/veri/depo/siniflar.md) → `ders_programi` (gün 1–7, bitiş >
  başlangıç, en çok 8 saat; şema 001), `dersler`, `siniflar`. Saatler veritabanında `time`, uygulamaya "SS:DD" metni
  olarak gelir ([../../../sunucu/veri/baglanti.md](../../../sunucu/veri/baglanti.md)).
- CSS: `public/css/parcalar/14-ders-programi.css` (görünüm anahtarı, gün şeridi, gezgin, ders kartları, `.simdi`,
  `.cakisma`, `.bos-saat`, `.ekle`, haftalık tablo; 520 px altında gezgin alt alta, kartlar tek sütun),
  `16-giris-sekme.css` (`.cakisma-liste`), `09-kayit-ekrani.css` (`.baglanti`: "3 tanesini daha göster" düğmesinin
  bağlantı görünümü), `02-form.css` (`.row2`, `.field`, `.hint`), `08-menu-filtre.css`
  (`.filtre-satir`), `04-kartlar.css` (`.satir`, `.etiket` renkleri), `13-tipografi.css` (`.sutun-basi`, `.sutun-saat`
  yazıları), `23-hareket.css` (gün noktalarının geçişi). `11-haftalik-program-tablosu.css`'teki `table.program` / `.hucre`
  kuralları bu dosyanın ürettiği öğelerde kullanılmıyor.
- Rol: düzenleme — müdür ve `program.duzenle` yetkili öğretmen; ortak çizim — öğretmen, müdür (kendi dersleri),
  öğrenci, veli, öğrenci portalına bakan okul personeli.

## Nasıl çalışır (adım adım)?

```
menü "Ders Programı" ─► GET /school/classes ─► S.programSinif (korunur ya da ilk sınıf)
   ─► programCiz ─► GET /school/schedule?classId ─► S.programVeri
        sınıf seçimi · [uyarı] · "N çakışma var" · Gün|Hafta · program · "Bu sınıfın dersleri"

"+ Ders ekle" (Pzt) ─► saatModal(1, '') ─► Gün, Ders, 09:00–09:40
   "Kaydet" ─► POST /schedule-add ─► sunucu: denetim ─► aralikCakismasi ─► kaydet ─► (öğretmene günde bir bildirim)
   ─► { uyari } ─► S.programUyari ─► programCiz ─► üstte kırmızı uyarı (bir kez), kart kırmızı
```

Ders sıraları, bir örnekle:

```
haftanın saatleri : Pzt 08:30-09:10, 09:20-10:00 · Cum 08:30-09:05, 09:15-09:50
dersSiralari      : sıra 1 = 08:30-09:10, sıra 2 = 09:15-10:00   (kesişenler birleşti)
Cuma 09:15 dersi  : başlangıcı sıra 2'de ─► "Ders 2"
Salı (yalnız 09:20 dersi var) : "Ders 1 [boş]", "Ders 2 Matematik"
```

## Dikkat!

- **Sınıfla sınırlı rolde sayfa kilitlenebilir.** Sayfa açılırken `S.programSinif` boşsa okulun ilk sınıfı seçilir.
  Rolündeki `program.duzenle` kapsamı o sınıfı içermiyorsa `GET /schedule` 403 döner ve sayfada yalnız "Bu ders ya da
  sınıf için yetkin yok" yazar — sınıf seçimi çizilmediği için başka sınıfa geçilemez. Kutudan kapsam dışı bir sınıf
  seçince de uyarı çıkar, kutu o sınıfta kalır ve her gün/görünüm tıklaması uyarıyı yineler. Çıkış yolu: "Sınıflar"
  sayfasında izinli sınıfın **Ders programı** düğmesi. Kod okumasına göre; tarayıcıda denenmedi.
- **Menü ile sayfanın istediği yetki uyuşmuyor.** Menü "Ders Programı"nı `program.duzenle` olan öğretmene gösterir; sayfa
  önce `GET /api/school/classes`'ı ister, o da `sinif.yonet` ister. `sinif.yonet`'i olmayan program sorumlusu sayfa yerine
  "Bu işlem için yetkin yok" görür.
- **Çakışma listesi bütün okulundur.** Hangi sınıf seçilirse seçilsin "N çakışma var" kutusu okulun bütün çakışmalarını
  (başka sınıfların adları, dersleri, öğretmen adları) gösterir; sınıfla sınırlı roldeki öğretmen de görür. Hücrelerdeki
  kırmızı işaret ise yalnız ekrandaki derslere düşer.
- **Çakışma engellenmez ve kilitsiz denetlenir.** Uyarı yalnız kaydettikten sonra, bir kez görünür; ders yine yazılmıştır.
  Aynı anda iki kişi kesişen saat eklerse ikisi de yazılır (sunucuda kilit/kısıt yok), sonra listede görünür
  ([../../../sunucu/veri/depo/siniflar.md](../../../sunucu/veri/depo/siniflar.md)).
- **"Ders N" gerçek ders numarası değildir.** Sıralar bütün haftanın saatlerinden çıkar. Bir gün uzun bir ders (ör.
  blok 80 dakika) öbür günlerin iki ayrı sırasıyla kesişirse o iki sıra tek sıraya birleşir: o günlerde iki ders aynı
  "Ders N" altında yan yana durur. Yalnız başka bir günde var olan sıra da öbür günlerde "[boş]" görünür.
- **"Bugün" ve "şimdi" cihazın saatine göredir.** `bugunNo()` ve `dersSutunu` tarayıcının saatini ve saat dilimini
  kullanır; program saatleri Türkiye saatidir. Başka saat diliminde (ya da saati yanlış) cihazda vurgu kayar.
- **Haftalık görünümde "şimdi" vurgusu ve ek düğme yok.** `haftaHucresi` `ekIslem`'i çizmez: öğretmenin "Yoklama"
  düğmesi yalnız Gün görünümünde çıkar.
- **Her gün tıklaması sunucuya gider.** `program-gun`, `program-gorunum` ve `cakisma-ac` sayfayı sunucudan yeniden ister
  (`programCiz` her seferinde bütün okulun çakışma sorgusunu da çalıştırır); büyük okulda gün değiştirmek yavaşlayabilir.
- **Program yıla göre süzülmez.** Sunucu programı okurken eğitim yılına bakmaz (`sinifinProgrami`'nin yıl süzgeci yok,
  `okul.js` burada `yilSuz` kullanmaz); geçmiş yıla bakarken de bugünkü program görünür, yalnız yazmalar 409 alır.
  [16-egitim-yili.md](16-egitim-yili.md)'deki "ödev ve program ekranları geçen yılın kayıtlarını gösterir" cümlesi
  program için kodla uyuşmuyor.
- **Öğretmen yalnız eklemeden haberdar olur.** Saat taşıma (`schedule-update`) ve silme bildirim göndermez; ekleme
  bildirimi de öğretmen başına günde bir taneyle sınırlıdır.
- **`S.programGun` sayfalar arasında taşınır.** "Ders Programım"da seçilen gün "Ders Programı"nda da seçili gelir; yalnız
  "Sınıflar → Ders programı" düğmesi sıfırlar. Çıkışta `S.programSinif` ve `S.programVeri` silinir, `S.programGun` ve
  `S.cakismaAcik` kalır (`26-baslat.js`).
- **Tarayıcıda yalnız boş saat denetlenir.** Biçim, sıra ve 8 saat sınırını sunucu söyler; ileti pencerenin altına
  düşer.
- **Aynı kimlikler başka pencerelerde de var.** `#mDers`, `#mBas`, `#mBit` "Yeni ödev" penceresinde de kullanılır
  ([11-ogretmen-odev.md](11-ogretmen-odev.md); orada `#mBas`/`#mBit` tarih alanının gizli kutusudur), `#mDers` sınav
  penceresinde de ([12-ogretmen-sinav.md](12-ogretmen-sinav.md)). Aynı anda tek pencere açık olduğu için çakışmaz, ama
  birini değiştirirken ötekileri düşün.
- **`yetkim` kapsama bakmaz** ve yalnız gösterir; düğmenin görünmesi işin yapılabileceği anlamına gelmez.
- `GUN_KISA`, [19h-hatirlaticilar.md](19h-hatirlaticilar.md)'deki `HAFTA_KISA` ile birebir aynıdır; gün kısaltmalarını
  değiştirirsen ikisini (ve `04e-tarih-secici.js`'teki `TS_GUN_KISA`'yı) birlikte değiştir.

## Testleri

- `testler/test-program.js` (sunucu tarafı): 5) saat aralığıyla yerleştirme (Pazartesi 09:20–10:00; pazara da eklenebilir);
  6) doğrulama (bozuk saat, bitişin başlangıçtan önce olması, geçersiz gün, başka sınıfın dersi); 7) aynı öğretmenle kesişen
  saat `uyari` verir, türü `ogretmen`, `cakismalar`'a düşer; 8) bitişik aralık çakışma sayılmaz; 9) düzenleme
  (`schedule-update`), silme ve gün + saat sırası; 12) öğretmen programa ders ekleyemez (403); 13) sınıf silinince çakışma
  da temizlenir.
- `testler/test-kapsam.js` — sınıfla sınırlı rol kapsam içi sınıfın programını görür ve ders saati ekler, kapsam dışında 403;
  müdür her sınıfı görür.
- `testler/test-bildirim.js` — 4) üç ders saati eklenince öğretmene en çok bir bildirim.
- Arşiv kapısının (409) kendisi `testler/test-egitim-yili.js`'te başka bir uçla (sınav grubu) denenir; ders programı
  yazmasıyla ayrıca denenmez.
- `testler/buton-denetimi.js` — `cakisma-ac`, `program-gun`, `program-gorunum`, `saat-*` eylemlerinin karşılığı;
  `testler/yazim-denetimi.js` ekran metinleri.
- Bu dosyanın tarayıcıda çalışan testi yok (ekran turu `araclar/gezinti.js` "Ders programı", haftalık görünüm, çakışma
  listesi ve iki pencerenin görüntüsünü alır; bir şey doğrulamaz).
- Elle (sunucu 3200'de): müdürle **Ders Programı** → bir sınıf → **+ Ders ekle** → Matematik 09:00–09:40 → Kaydet; aynı
  öğretmenin başka sınıfına 09:20–10:00 ekle → üstte "Bu öğretmen aynı saatte …" ve iki kart kırmızı; **Hafta**'ya geç,
  sayfayı yenile → Hafta seçili kalır.

## Son durum

- `git log`: 4 commit. Dosya parça parça kuruldu: `81fa14e commit 56` (2026-08-29; sayfa ve `programCiz`: sınıf seçimi,
  çakışma listesi, "Bu sınıfın dersleri"; aynı commit sunucuya `api.js`'teki `arsivYazmasiMi`'yi — program yazmalarının
  409 kapısı — ve `iliskiler.js`'teki `GUN_ADLARI` / `GUN_SAYISI`'yı ekledi), `60b9983 commit 57` (2026-08-29; `yetkim`, gün yardımcıları, `gunSeridi`,
  `dersSutunu`, `gunlukGorunum`), `2dbfdd2 commit 58` (2026-08-29; haftalık görünüm, `gorunumSecici`, `programGovdesi`,
  `programYenidenCiz`, `saatModal`).
- Son değişiklik `bb20f57 commit 325` (2026-09-26): ders sıraları eklendi — `dakika`, `dersSiralari`, `siralaraYerlestir`,
  `BOS_DERS` (aynı commit `19e-servis-konum.js`, `28-grafik.js` ve `testler/seed.js`'e de ekleme yaptı). Not: 57 ve 58'deki
  görünümler bu adları zaten çağırıyordu; commit'ler dosyanın depoya parça parça girişini gösterir, 57–325 arasında dosya
  tek başına eksikti. O günden beri değişmedi.
- Bilinen açıklar (kod değiştirilmedi): sınıfla sınırlı rolde sayfanın ilk sınıfta 403 ile kilitlenmesi, menünün
  `program.duzenle`'ye açıp sayfanın `sinif.yonet` istemesi, okul geneli çakışma listesinin her sınıfta görünmesi,
  programın yıla göre süzülmemesi.
- Planlı işlerden bu dosyaya dokunması beklenenler (DEVAM.md 4. bölüm):
  - "Yıl geçişi" (iş 9): yeni yıl sihirbazında "ders programını geçen yıldan kopyala / sıfırdan başla" (sınıflar yeni
    adlarıyla eşlenir); programın yıla göre gösterilmesi de bu işte ele alınmalı.
  - "Toplantılar + sınıfın uzaktan ders bağlantısı + tahta hesabı" (iş 21, 29 Eylül'de istendi): derste ("Şu an" dersi)
    "Görüşme başlat"; tahta hesabı sınıf seçip o sınıfın bugünkü programını görecek — bu dosyanın gün görünümü ve "şimdi"
    kuralı kullanılabilir.
  - "Etüt planlama" (iş 25, öneri): canlı boş zaman ızgarası öğretmenin ve öğrencilerin dolu saatlerini ders programından
    okuyacak.
  - "Çalışan olarak ekleme" (iş 2): öğretmen olmayan çalışan ders programına atanamayacak (pencerenin ders listesi
    öğretmen adlarını gösteriyor).
  - "Özel roller" (iş 24, öneri) yeni yetkiler/şablonlar getirecek; `yetkim` aynı kalır. "Çok dil" (iş 22): gün adları,
    `GUN_KISA` ve ekran metinleri kataloğa. "Android yerel uygulama" (iş 10): uygulamada program salt okunur (düzenleme
    yok).
