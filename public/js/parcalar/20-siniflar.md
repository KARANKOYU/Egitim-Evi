# public/js/parcalar/20-siniflar.js

Okulun "Sınıflar" sayfası: sınıf açma ve sınıf listesi, bir sınıfın derslerini ekleyip öğretmen atayan "Dersler"
penceresi ve öğrencileri sınıflara yerleştiren "Öğrenci yerleştirme" penceresi.

## Bu dosya ne yapar?

Okulun iskeleti burada kurulur. "7-A" bir sınıftır; "7-A Matematik" bir derstir, haftalık saati ve öğretmeni vardır;
her öğrencinin bir sınıfı olur. Bu üçü küçük görünür ama uygulamanın geri kalanı ona dayanır: öğretmen–öğrenci ilişkisi
YALNIZ derslerden türer (öğretmen, ders verdiği sınıfların öğrencilerinin öğretmenidir; öğrenciyi tek tek öğretmene
bağlayan bir uç yoktur). Ödev kime verilebilir, yoklama kime alınır, mesaj kime yazılır — hepsi burada yapılan
yerleştirmelere ve atamalara bakar.

Sayfayı kim görür:

- **Müdür** — menüde "Okul Düzeni" başlığının altında **Sınıflar**, ana sayfada "Sınıflar · N sınıf" kutucuğu.
- **Öğretmen** — rolünde `sinif.yonet` ya da `ders.yonet` varsa menüsünün ek bölümünde **Sınıflar** (bölümün başlığı
  özel rolün adıdır, rol adı yoksa "Ek Yetkiler"; [06-menu.md](06-menu.md)). Hazır şablonlardan yalnız "Müdür Yardımcısı"
  ikisini de taşır.

Dosya yalnız ekranı çizer ve iki penceredeki açılır kutuların (`select`) değişince ne yapacağını bağlar. Düğmelerin işi
(sınıf aç, sil, ders ekle, ders sil, pencereleri açmak) `25-tiklama.js`'teki `islem()` içindedir; aşağıda onları da tek tek
anlattım, çünkü bu ekranı anlamak için ikisini birlikte okuman gerekir.

## İçinde neler var?

### Sayfa: `SAYFALAR.siniflar`

`GET /api/school/classes` ister, cevabı `S.sinifBilgi`'ye koyar ve çizer:

- Başlık **SINIFLAR**, alt yazı "Sınıfları burada açar, öğrencileri yerleştirir ve derslerini tanımlarsın."
- **Yeni sınıf** kartı: `input#yeniSinif` (yer tutucu "ör. 7-A", en çok 30 karakter, biçimi satır içi `style` ile),
  **Sınıf aç** düğmesi (`data-act="sinif-ekle"`) ve ileti yeri `#sinifMesaj`.
- Sınıfsız öğrenci varsa (`d.sinifsiz > 0`) mavi bilgi kutusu: "**N** öğrenci henüz bir sınıfa yerleştirilmedi. Şimdi
  yerleştir" — bağlantı `data-act="sinif-yerlestir"`.
- Hiç sınıf yoksa boş kutu: "Henüz sınıf yok. Yukarıdan ilk sınıfını aç." ve sayfa burada biter.
- **Sınıf listesi (N)** kartı: sınıflar sunucunun verdiği Türkçe ad sırasıyla. Her satır (`.satir`, `data-ara` = sınıf
  adı; üstteki arama kutusu bu satırları süzer):
  - sınıf adı, altında "28 öğrenci · 9 ders"; öğretmeni atanmamış ders varsa kırmızı "· 2 derste öğretmen yok";
  - **Dersler** (`sinif-dersler`, `data-id` + `data-ad`), **Ders programı** (`sinif-program`), **Öğrenciler**
    (`sinif-ogrenciler`, `data-id` + `data-ad`), kırmızı **Sil** (`sinif-sil`, `data-id` + `data-ad`).

### "Dersler" penceresi: `sinifDersleriModal(classId, ad)`

`GET /api/school/lessons?classId=…` ister, cevabı (`{ class, lessons, teachers, subjects }`) `S.dersBilgi`'ye koyar ve
`modalAc('7-A — Dersler', …)` ile açar (altta yalnız **Kapat**):

- **Ders ekle**: okulun ders listesinden (`subjects`) bu sınıfta henüz olmayanlar `select#yeniDers`'te; yanında
  **Haftalık saat** `input#yeniDersSaat` (`type=number`, 0–20, varsayılan 4) ve **Ekle** (`data-act="ders-ekle"`,
  `data-id` = sınıf). Eklenecek ders kalmadıysa "Tüm dersler eklenmiş."
- Ders yoksa boş kutu "Bu sınıfa henüz ders eklenmedi."
- Her ders bir satır: ders adı; altında "Haftada 4 saat · programa 3 saat yerleşti" ve gerekirse soluk "(1 saat eksik)"
  ya da (haftalık saat 0 değilse) kırmızı "(fazla)"; öğretmen seçimi `select.ders-ogretmen` (`data-id` = ders; ilk seçenek
  "— öğretmen seç —", sonra okulun öğretmen ve müdürleri "Ad Soyad (Branş)"); kırmızı **Sil** (`data-act="ders-sil"`,
  `data-id` = ders, `data-cid` = sınıf).
- Pencere açılınca `dersOgretmenBagla(classId)` çağrılır. İşlev bir söz (Promise) döner; hatayı çağıran yakalar
  (`25-tiklama.js` → `hataGoster`, yani tarayıcının uyarı kutusu).

### `dersOgretmenBagla(classId)`

Penceredeki her `.ders-ogretmen` kutusuna `onchange` bağlar: seçim değişince `POST /api/school/lesson-update
{ lessonId, teacherId }` (boş seçim = öğretmeni kaldır). Başarıda pencere sunucudan yeniden çizilir
(`sinifDersleriModal(classId, S.dersBilgi.class.name)`), böylece "derste öğretmen yok" bilgisi tazelenir; hata uyarı
kutusunda (`hataGoster`).

### "Öğrenci yerleştirme" penceresi: `sinifOgrencileriModal(classId, ad)`

`GET /api/school/students` ile `GET /api/school/classes`'ı birlikte ister (`Promise.all`). `classId` parametresi
**kullanılmaz**: pencere okulun BÜTÜN öğrencilerini listeler (aşağıda "Dikkat!"). Başlık `ad` verilmişse "7-A — Öğrenci
yerleştirme", değilse "Öğrenci yerleştirme". İçerik:

- ipucu "Her öğrencinin sınıfını buradan değiştirebilirsin.";
- öğrenci yoksa "Okulda kayıtlı öğrenci yok.";
- her öğrenci: ad, altında kullanıcı adı, sağda `select.ogrenci-sinif` (`data-id` = öğrenci; "— sınıfsız —" ve okulun
  bütün sınıfları, şimdiki sınıfı seçili).

Kutu değişince kutu kilitlenir (`disabled`), `POST /api/school/class-assign { studentId, classId }` gider (boş =
sınıfsız), bitince kilit açılır; hata olursa kilit açılır ve uyarı kutusu çıkar.

### Bu ekranın düğmeleri (`25-tiklama.js` içinde)

| Eylem | Ne yapar |
|---|---|
| `sinif-ekle` | Kutudaki adı kırpar; boşsa `#sinifMesaj`'a "Sınıf adı yaz (ör. 7-A)". Düğmeyi kilitler → `POST /api/school/class { name }` → `git('siniflar')`. Hata `#sinifMesaj`'a, düğme açılır. |
| `sinif-sil` | Onay: "7-A silinsin mi? Öğrenciler sınıfsız kalır, sınıfın dersleri ve ders programı silinir. Öğrenci hesapları silinmez." → `POST /api/school/class-delete { classId }` → `git('siniflar')`; hata uyarı kutusunda. |
| `sinif-program` | `S.programSinif` = bu sınıf, `S.programGun = 0` (bugünden başla) → `git('program')` ([21-ders-programi.md](21-ders-programi.md)). |
| `sinif-dersler` | `sinifDersleriModal(id, data-ad)`. |
| `sinif-ogrenciler` | `sinifOgrencileriModal(id, data-ad)`. |
| `sinif-yerlestir` | `sinifOgrencileriModal('', '')` — aynı pencere, başlıksız. |
| `ders-ekle` | `#yeniDers` ve `#yeniDersSaat`'i okur, düğmeyi kilitler → `POST /api/school/lesson { classId, subject, weeklyHours }` → pencere yeniden çizilir (başlık `S.dersBilgi['class'].name`'den); hata uyarı kutusunda, düğme açılır. |
| `ders-sil` | Onay: "Ders silinsin mi? Bu dersin ders programındaki saatleri de silinir." → `POST /api/school/lesson-delete { lessonId }` → pencere yeniden çizilir; hata uyarı kutusunda. |

### Durum alanları

- `S.sinifBilgi` — sayfanın son `classes` cevabı. Yazılır ama bugün hiçbir parça okumaz.
- `S.dersBilgi` — açık "Dersler" penceresinin cevabı; `25-tiklama.js` ders ekleyip silince pencere başlığını buradan alır.
- İkisi de [00-durum.md](00-durum.md)'deki `S` nesnesinde `null` olarak başlar.

## Kimle konuşur?

- Parçalar ad sırasıyla tek bir IIFE'de birleşir (`/js/app.js`; [../../../sunucu/http.md](../../../sunucu/http.md)
  `birlesikOku`); bu yüzden adlar dosyalar arasında doğrudan görünür. Bu dosyanın çağırdıkları: `S`
  ([00-durum.md](00-durum.md)); `esc`, `api` ([01-yardimcilar.md](01-yardimcilar.md); `$` bu dosyada hiç kullanılmaz,
  penceredeki kutular `document.querySelectorAll` ile bulunur); `ik`
  ([02-ikonlar.md](02-ikonlar.md)); `modalAc` ([03-mesaj-modal.md](03-mesaj-modal.md)); `yaz`, `hero`, `bosKutu`
  ([07-yonlendirme.md](07-yonlendirme.md)); `SAYFALAR` ([08-ana-sayfa.md](08-ana-sayfa.md)); `hataGoster`
  (`25-tiklama.js`).
- Onu kullananlar:
  - `25-tiklama.js` — `sinifDersleriModal` (`sinif-dersler`, `ders-ekle`, `ders-sil`), `sinifOgrencileriModal`
    (`sinif-ogrenciler`, `sinif-yerlestir`); bütün düğme eylemleri orada.
  - [06-menu.md](06-menu.md) — menü maddesi `siniflar` (müdürde hep; öğretmende `sinif.yonet` ya da `ders.yonet` ile);
    [08-ana-sayfa.md](08-ana-sayfa.md) — müdürün "Sınıflar" kutucuğu.
  - [21-ders-programi.md](21-ders-programi.md) — sınıf yokken "Sınıflar sayfasına git" ve ders yokken "Sınıflar
    sayfasından ders ekleyebilirsin" bağlantıları (`data-nav="siniflar"`).
- Sunucu uçları ([../../../sunucu/bolumler/okul.md](../../../sunucu/bolumler/okul.md)). `/api/school` bölümüne yalnız
  müdür ve öğretmen girer (başkası 403 "Yetkin yok"); her uç kendi yetkisine ayrıca bakar ([../../../sunucu/yetki.md](../../../sunucu/yetki.md)
  `yetkiVarMi`; müdür her şeye yetkilidir). Yetki yoksa 403 "Bu işlem için yetkin yok" ya da (kapsamlı yetkide) "Bu ders
  ya da sınıf için yetkin yok"; başka okulun sınıfı/dersi 400 "Sınıf bulunamadı" / "Ders bulunamadı".
  - `GET /api/school/classes` — `sinif.yonet` → `{ classes: [{ id, name, studentCount, lessonCount, unassigned }],
    gunSayisi: 7, gunAdlari, sinifsiz }` (özetler tek sorguda).
  - `POST /api/school/class { name }` — `sinif.yonet`. Ad sunucuda düzeltilir: "7a", "7 - a", "7/A" → "7-A" (seviye +
    tek şube harfi; "Anasınıfı Papatya" gibi adlara dokunulmaz). Boş → "Sınıf adı gerekli (ör. 7-A)"; aynı ad (büyük/küçük
    harf Türkçe kuralıyla fark etmez) → "Bu adda bir sınıf zaten var"; okul başına 200 sınıf → "Sınıf sayısı sınırına
    ulaşıldı". Cevap `{ class }`.
  - `POST /api/school/class-delete { classId }` — `sinif.yonet`. Öğrenciler sınıfsız kalır, dersler ve program silinir
    ([../../../sunucu/veri/depo/siniflar.md](../../../sunucu/veri/depo/siniflar.md) `sil`).
  - `POST /api/school/class-assign { studentId, classId }` — `ogrenci.yerlestir`; rol sınıfla sınırlıysa hem hedef sınıf
    hem öğrencinin şimdiki sınıfı kapsamda olmalı (403 "Bu öğrencinin sınıfı için yetkin yok"). Başka okulun öğrencisi
    "Öğrenci bulunamadı". Bir sınıfa konan öğrenciye "7-A sınıfına yerleştirildin." bildirimi gider (sınıfsız yapınca
    gitmez).
  - `GET /api/school/students` — `ogrenci.duzenle` (tam liste) ya da yalnız `ogrenci.portal` (dar liste: kullanıcı adı,
    e-posta, kod boş gelir).
  - `GET /api/school/lessons?classId=` — `ders.yonet` (sınıf kapsamıyla) → `{ class: { id, name }, lessons: [{ id,
    classId, subject, teacherId, teacherName, weeklyHours, placed }], teachers: [{ id, fullName, branch }], subjects }`.
    `teachers` okulun onaylı öğretmenleri VE müdürleridir; müdürün branşı boşsa "Müdür" yazılır
    ([../../../sunucu/iliskiler.md](../../../sunucu/iliskiler.md) `branchOf`). `subjects` sunucudaki sabit ders listesi
    (`SUBJECTS`, [../../../sunucu/ortak.md](../../../sunucu/ortak.md)): Matematik, Türkçe, İngilizce, Din Kültürü ve
    Ahlak Bilgisi, Sosyal Bilgiler, Fen Bilimleri, Müzik, Resim, Beden Eğitimi.
  - `POST /api/school/lesson { classId, subject, weeklyHours }` — `ders.yonet`. Listede olmayan ders "Geçerli bir ders
    seç"; aynı ders ikinci kez "Bu ders bu sınıfa zaten eklenmiş"; haftalık saat `parseInt` edilip 0–20'ye sıkıştırılır.
  - `POST /api/school/lesson-update { lessonId, teacherId }` — `ders.ogretmen-ata` (ders + sınıf kapsamı). Öğretmen bu
    okulun onaylı öğretmeni/müdürü değilse "Öğretmen bulunamadı"; öğretmenin rolü onu bu derse atanabilir kılmıyorsa
    (`derse-atanabilir` kapsamı) "Ayşe Kaya bu derse atanamaz — rolündeki ders kapsamı izin vermiyor". Yeni atanan
    öğretmene "7-A · Matematik dersi sana atandı." bildirimi gider. Cevap `{ lesson, cakismalar }`.
  - `POST /api/school/lesson-delete { lessonId }` — `ders.yonet`; programdaki saatleri de gider.
- Veri: [../../../sunucu/veri/depo/siniflar.md](../../../sunucu/veri/depo/siniflar.md) → `siniflar`, `dersler`,
  `ders_programi`; öğrencinin sınıfı `kullanicilar.sinif_id`
  ([../../../sunucu/veri/depo/kullanicilar.md](../../../sunucu/veri/depo/kullanicilar.md)).
- CSS: `public/css/parcalar/04-kartlar.css` (`.kart`, `.satir`, `.buyu`, `.ad`, `.alt`, `.bos`),
  `public/css/parcalar/02-form.css` (`.btn` ve `.kucuk`, `.ghost`, `.gri`, `.tehlike`; `.msg.bilgi`, `.field`, `.hint`),
  `public/css/parcalar/06-modal.css` (pencere). Yeni sınıf kutusu ve iki açılır kutu biçimlerini satır içi `style` ile
  alır (`var(--cizgi)`, `var(--kirmizi)`, `var(--soluk)` renk değişkenleriyle; koyu temaya uyar).
- Rol: müdür; `sinif.yonet` / `ders.yonet` / `ders.ogretmen-ata` / `ogrenci.yerlestir` yetkili öğretmen (her düğme
  kendi yetkisini sunucuda ister).

## Nasıl çalışır (adım adım)?

```
menü "Sınıflar" ─► GET /api/school/classes ─► liste: "7-A · 28 öğrenci · 9 ders · 2 derste öğretmen yok"
"Sınıf aç" ("7a") ─► POST /class ─► sunucu "7-A" yapar ─► git('siniflar')

"Dersler" ─► GET /lessons?classId ─► pencere
   "Ekle" (Müzik, 2 saat) ─► POST /lesson ─► pencere yeniden
   öğretmen kutusu: Ayşe Kaya ─► POST /lesson-update ─► (öğretmene "… dersi sana atandı") ─► pencere yeniden
   "Sil" ─► onay ─► POST /lesson-delete (program saatleri de gider) ─► pencere yeniden

"Öğrenciler" / "Şimdi yerleştir" ─► GET /students + GET /classes ─► okulun bütün öğrencileri
   kutu: 7-B ─► kutu kilitli ─► POST /class-assign ─► (öğrenciye "7-B sınıfına yerleştirildin.") ─► kilit açık

"Ders programı" ─► S.programSinif = sınıf ─► git('program')
```

## Dikkat!

- **Menü ile sayfanın istediği yetki uyuşmuyor.** Menü "Sınıflar"ı `sinif.yonet` YA DA `ders.yonet` olan öğretmene
  gösterir; sayfa ise `GET /api/school/classes`'la açılır ve bu uç `sinif.yonet` ister. Rolünde yalnız `ders.yonet` olan
  öğretmen menüye basınca sayfa yerine "Bu işlem için yetkin yok" görür. Hazır şablonlarda bu durum yok (Müdür
  Yardımcısı ikisini de taşır), müdürün elle kurduğu özel rolde olur. Kod okumasına göre; tarayıcıda denenmedi.
- **Düğmeler yetkiye bakmaz.** Her satırda dört düğme de herkese çizilir. `sinif.yonet` olup `ders.yonet` olmayan biri
  "Dersler"e basınca, `ogrenci.duzenle`/`ogrenci.portal` olmayan biri "Öğrenciler"e basınca uyarı kutusunda 403 iletisi
  görür. Yerleştirme ayrıca `ogrenci.yerlestir`, öğretmen atama `ders.ogretmen-ata` ister.
- **"Öğrenciler" penceresi o sınıfın değil, okulun bütün öğrencilerini listeler.** `sinifOgrencileriModal` kendisine
  verilen `classId`'yi kullanmaz; başlık "7-A — Öğrenci yerleştirme" dese de liste aynıdır. "Şimdi yerleştir" de yalnız
  sınıfsızları değil herkesi açar. Üstteki arama kutusu pencereyi süzmez (`araUygula` yalnız `#sayfa` içine bakar,
  pencere `#modalKok`'tadır). Büyük okulda pencere ağırlaşır: her öğrenci satırında okulun bütün sınıfları birer seçenek
  olarak yazılır (720 öğrenci × 30 sınıf ≈ 21 600 `<option>`).
- **Başarısız değişiklikte açılır kutu eski hâline dönmez.** `class-assign` (ör. kapsam dışı sınıf) ya da
  `lesson-update` (ör. "bu derse atanamaz") hata verince uyarı çıkar ama kutu yeni seçimi göstermeye devam eder; sunucuda
  bir şey değişmemiştir. Pencereyi kapatıp yeniden açınca doğrusu görünür. (Öğretmen atamada başarıda pencere yeniden
  çizildiği için orada sorun yalnız hatada.)
- **Arkadaki sayfa tazelenmez.** Pencerede ders eklemek/silmek, öğretmen atamak ya da öğrenci yerleştirmek "Sınıf
  listesi"ndeki sayıları ("28 öğrenci · 9 ders · 2 derste öğretmen yok") ve sınıfsız öğrenci uyarısını değiştirmez; sayfaya
  yeniden girmek gerekir.
- **Silme onayı her şeyi söylemez.** Onay metni öğrencilerin sınıfsız kalacağını, derslerin ve programın silineceğini
  söyler; ödevlerin sınıf bağının da gittiğini (`odev_siniflari` `CASCADE`), geçmiş devamsızlık kayıtlarının hangi
  sınıfa/derse ait olduğunun kaybolduğunu ve bekleyen okul davetlerindeki sınıf bilgisinin boşaldığını (ikisi de
  `SET NULL`; şema 001 ve 004) söylemez ([../../../sunucu/veri/depo/siniflar.md](../../../sunucu/veri/depo/siniflar.md)).
  Geri alma yoktur.
- **Haftalık saat sessizce düzeltilir.** Kutunun `max="20"`'si yalnız oklarla sınırlar; elle 25 yazılırsa sunucu 20
  kaydeder, boş ya da sayı olmayan değer 0 olur; ekranda uyarı çıkmaz.
- **Ders listesi sabittir.** Eklenebilecek dersler sunucudaki dokuz derslik `SUBJECTS` listesidir; "Bilişim Teknolojileri",
  "Teknoloji ve Tasarım" ya da lise dersleri gibi başka bir ders bugün eklenemez.
- **Öğretmen kutusunda müdür de var, uygun olmayan öğretmen de.** Liste derse atanabilirliği süzmez; rolünün ders
  kapsamı izin vermeyen öğretmen seçilirse sunucu reddeder (bir önceki madde: kutu yanlış seçimi göstermeye devam eder).
- **Sınıf ve ders yıllar arası ortaktır.** Yıl seçiciden geçmiş bir yıla bakan müdür burada değişiklik yaparsa bugünkü
  okulu değiştirir; arşiv yılı kapısı (409) yalnız ders programı yazmalarına uygulanır, sınıf/ders uçlarına değil
  ([../../../sunucu/api.md](../../../sunucu/api.md) `arsivYazmasiMi`).
- **`S.sinifBilgi` ve `S.dersBilgi` çıkışta sıfırlanmaz** (`26-baslat.js` `oturumDurumunuSifirla` listesinde yoklar).
  İkisi de her açılışta sunucudan yeniden yazıldığı için başka birinin verisi ekrana gelmez; yalnız bellekte durur.
- Yerleştirme her seçimde ayrı istektir ve öğrenciye bildirim gönderir; bir öğrenciyi yanlışlıkla iki kez taşırsan iki
  bildirim gider.

## Testleri

- `testler/test-program.js` (sunucu tarafı, müdür hesabıyla): 1) sınıf açma (7-A, 7-B; aynı adın küçük harfle
  reddi, boş adın reddi); 2) öğrenci yerleştirme (sınıf mevcudu, `sinifsiz` 0, `gunSayisi` 7); 3) ders ekleme (aynı ders
  ikinci kez ve listede olmayan ders reddedilir); 4) öğretmen atama (öğretmen listesi geliyor, geçersiz öğretmen
  reddedilir); 12) öğrenci sınıf açamaz; 13) sınıf silinince listeden düşer, öğrencisi sınıfsız kalır, dersi öğretmenin
  programından düşer.
- `testler/test-kapsam.js` — 9-A ile sınırlı `ders.yonet` rolünde: kapsam içi sınıfın dersleri görülür, kapsam dışı
  sınıfın dersleri 403 ve oraya ders eklemek 403. Ayrıca öğretmen atamada hedef öğretmenin `derse-atanabilir` kapsamı:
  rolü yalnız Matematik'e izin veren öğretmen Türkçe dersine atanamaz (400 "… bu derse atanamaz …"), Matematik'e atanır.
- `testler/yetki-denetimi.js` — "sinif ac", "sinif listesi", "ogrenci sinifa yerlestir" uçlarını her rolle dener;
  yalnız müdür geçmeli.
- `testler/buton-denetimi.js` — bu ekrandaki `data-act`'lerin (`sinif-*`, `ders-ekle`, `ders-sil`) `islem()`'de
  karşılığı var mı; `testler/yazim-denetimi.js` — ekran metinlerinin yazımı.
- Dolaylı: `test-devamsizlik`, `test-takvim`, `test-nakil`, `test-odev-saat`, `test-egitim-yili` gibi paketler
  hazırlıkta aynı uçlarla sınıf açar, ders ekler, öğretmen atar ve öğrenci yerleştirir.
- Bu dosyanın tarayıcıda çalışan testi yok. (Ekran turu `araclar/gezinti.js` "Sınıflar" ve "Sınıfın dersleri"
  ekranlarının görüntüsünü alır; bir şey doğrulamaz.)
- Elle (sunucu 3200'de, `testler/seed.js` hesapları): müdürle **Sınıflar** → "7c" yaz → **Sınıf aç** → listede "7-C";
  **Dersler** → Müzik, 2 saat → **Ekle**; öğretmen kutusundan bir öğretmen seç → satır yenilenir; **Öğrenciler** → bir
  öğrenciyi 7-C'ye al → o öğrenciyle girince bildirim "7-C sınıfına yerleştirildin." görünür.

## Son durum

- `git log`: 4 commit, hepsi 2026-08-29. Dosya parça parça kuruldu: `0cf7562 commit 52` (sayfa: yeni sınıf kartı,
  sınıfsız uyarısı, sınıf listesi ve dört düğme), `f413168 commit 53` (`sinifDersleriModal`: ders ekleme, haftalık saat,
  yerleşen/eksik saat, öğretmen kutusu), `52e637e commit 54` (`dersOgretmenBagla`: öğretmen seçilince
  `lesson-update` ve pencereyi yeniden çizme), `982c9ec commit 55` (`sinifOgrencileriModal`: okulun öğrencileri ve sınıf
  kutuları, `class-assign`). O günden beri dosya değişmedi.
- Bilinen açıklar (kod değiştirilmedi): menünün `ders.yonet`'e açıp sayfanın `sinif.yonet` istemesi, yetkiye bakmayan
  düğmeler, yerleştirme penceresinin sınıfa göre süzmemesi ve büyük okulda ağırlaşması, hatada kutunun geri dönmemesi,
  arka sayfanın tazelenmemesi, silme onayının eksik anlatması.
- Planlı işlerden bu dosyaya dokunması beklenenler (DEVAM.md 4. bölüm):
  - "Çalışan olarak ekleme" (iş 2): öğretmen olmayan çalışan derse atanamayacak; ders penceresindeki öğretmen kutusu
    yalnız öğretmen rolü olanları göstermeli.
  - "Yıl geçişi" (iş 9): sınıf atlatma sihirbazı (5-A → 6-A, en üst sınıf "Mezun"; öğrenciler tek işlemde taşınır) ve
    "ders programını geçen yıldan kopyala" — sınıf adları ve öğrencilerin sınıfları buradan değil sihirbazdan değişecek.
  - "Özel roller" (iş 24, öneri): yeni "Okul Sekreteri / Memur" şablonu `ogrenci.yerlestir` taşıyor ama `sinif.yonet`
    taşımıyor; bugünkü kodla bu kişi "Sınıflar"ı göremez, yerleştirme penceresine de giremez — şablon gelirse bu sayfanın
    yetki koşulları ele alınmalı.
  - "Toplantılar + sınıfın uzaktan ders bağlantısı" (iş 21, 29 Eylül'de istendi): her sınıfın ayarlarında "Uzaktan ders
    bağlantısı" olacak; sınıf satırına ya da ders penceresine yeni bir alan gelebilir.
  - "Optimizasyon + … ölçek raporu" (iş 7): büyük okulda yerleştirme penceresinin boyutu bu işte ele alınabilir.
  - "Çok dil" (iş 22): ekran metinleri kataloğa; ders adları (`SUBJECTS`) de çeviri ister.
