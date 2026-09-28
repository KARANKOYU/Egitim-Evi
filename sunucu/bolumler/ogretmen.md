# sunucu/bolumler/ogretmen.js

Öğretmen uçları (`/api/teacher`): öğretmenin haftalık programı ve dersleri, öğrencileri, ve "Sınıflarım" bölümü (girdiği
sınıflar, sınıfın öğrencileri, bir öğrencinin ödev ve sınav sonuçları).

## Bu dosya ne yapar?

Öğretmen "Programım"ı açınca haftalık ders saatlerini, her dersin haftalık saatini ve kaçının programa yerleştiğini, kendi
programındaki çakışmaları görür; bu dosyanın `schedule` ucu verir. Programdaki her hücrede ders kimliği (`lessonId`) de
gelir: öğretmen programdan doğrudan yoklama alabilir ([devamsizlik.md](devamsizlik.md)).

"Sınıflarım" bölümü öğretmenin yalnız DERS VERDİĞİ sınıfları, o sınıfların öğrencilerini ve bir öğrencinin — kendi
verdiği ödevlerdeki sonuçlarını ve sınav sonuçlarını — gösterir. Bunun için `ogretmen.sonuclar` yetkisi gerekir (hazır
Öğretmen rolünde açık gelir; müdür kapatabilir ya da ek bir rolle verebilir — kod yorumu).

## İçinde neler var?

### Dışa açılan

- `uclar(k)` — tek dışa açılan işlev.

### İç işlevler

- `girdigiSiniflar(me)` → `Map(sınıfId → { id, ad, dersler: [ders adı…] })` — öğretmenin derslerinden (`ogretmeninDersleri`)
  çıkarılır. Müdür de yalnız kendi DERS VERDİĞİ sınıfları görür (okulun hepsini değil).
- `siniflarimUclari(k)` — Sınıflarım uçları: yalnız GET (başka yöntem 404 "Böyle bir adres yok"); `ogretmen.sonuclar`
  yoksa 403 "Öğrenci sonuçlarını görme yetkin yok".

### Uçlar

Hepsi `p === 'teacher'`; önce `need(null)` (401/403). Sonra rol `teacher` ya da `principal` olmalı (`isTeacherLike`):
Sınıflarım yollarında değilse 403 "Bu bölüm öğretmenler içindir", ötekilerde 403 "Yetkin yok".

**Sınıflarım** (`ogretmen.sonuclar` gerekir):

- **`GET /api/teacher/siniflarim`** → `{ siniflar: [{ ogrenciSayisi, id, ad, dersler }] }`.
- **`GET /api/teacher/sinif?id=`** — sınıf öğretmenin girdiği sınıflardan değilse 403 "Bu sınıfa dersin yok". Cevap
  `{ sinif: { id, ad, dersler }, ogrenciler: [{ id, fullName, okulNo }] }` — okul numarasına göre (numarasızlar sonda),
  sonra ada göre Türkçe sıralı.
- **`GET /api/teacher/ogrenci?id=`** — öğrenci yoksa, başka okuldaysa ya da sınıfı öğretmenin girdiği sınıflardan değilse
  403 "Bu öğrencinin sınıfına dersin yok". Cevap `{ ogrenci: { id, fullName, sinif, okulNo }, odevler: [{ id, title,
  subject, endAt, endTime, status, result, acildi }], sinavGruplari: [{ id, name, subject, ortalama, sinavlar: [{ name,
  grade, alt, ust, weight }] }], sinavlar: [{ name, tarih, subject, templateName, olcumler }] }`.
  - `odevler` — YALNIZ bu öğretmenin verdiği ve bu öğrenciye giden ödevler, bakılan eğitim yılına süzülü (`yilSuz`).
  - `sinavGruplari` — öğrencinin bütün sınav grupları (yalnız bu öğretmeninkiler değil), yıla süzülü; `ortalama` notu
    girilmiş sınavların ağırlıklı yüzde ortalaması (iki ondalık) — [ilerleyis.md](ilerleyis.md)'deki hesapla aynı.
  - `sinavlar` — gruba bağlı olmayan sınavlar; `olcumler`'den değeri boş olanlar atılır.

**Program ve öğrenciler:**

- **`GET /api/teacher/schedule`** → `{ gunSayisi: 7, gunAdlari, cells: [{ id, day, start, end, subject, className,
  classId, lessonId, cakisma }], lessons: [{ id, subject, className, classId, weeklyHours, placed, studentCount }] }`.
  `cakisma` — aynı gün kendi programındaki başka bir saatle kesişiyor mu. `placed` — dersin programa yerleşmiş saat
  sayısı. `lessons` depo sırasıyla (sınıf adı ve ders, Türkçe).
- **`GET /api/teacher/students`** → `{ students: [{ id, fullName, email }] }` — öğretmenin derslerine giren öğrenciler
  (`studentsOfTeacher`). Ön yüz bugün bu ucu çağırmıyor (grep).

Başka alt yol ya da yöntem `false` döner, yönlendirici 404 verir.

## Kimle konuşur?

- Çağırdıkları: `../http` (`bad`, `ok`); `../iliskiler` (`GUN_ADLARI`, `GUN_SAYISI`, `araliklarKesisiyor`,
  `isTeacherLike`, `saatDakika`, `studentsOfTeacher`); `../ortak` (`clean`); `../veri` (`depo`); `../yetki`
  (`yetkiVarMi`); `./egitim-yili` (`yilSuz`, [egitim-yili.md](egitim-yili.md)).
- Depo ve tablolar: `depo.siniflar` → `dersler`, `ders_programi`, `siniflar` (`ogretmeninDersleri`, `ogretmeninProgrami`,
  `ozetleri`); `depo.kullanicilar` → `kullanicilar` (`sinifOgrencileri`, `bul`, `ogretmeninOgrencileri`);
  `depo.odevler.ogretmenin` → `odevler`, `odev_ogrencileri`; `depo.sinavlar` → `sinav_gruplari`, `sinavlar`,
  `sinav_olcumleri`, `sinav_degerleri` (`ogrencininGruplari`, `ogrencininTekSinavlari`).
- Onu çağıran: yalnız `sunucu/api.js` (`BOLUM.teacher`).
- Ön yüz: `public/js/parcalar/11b-siniflarim.js` (Sınıflarım), `22-programim.js` (öğretmenin programı).
- Android uygulaması bu uçları çağırmıyor (grep).

## Nasıl çalışır (adım adım)?

```
/api/teacher/<alt>
  need ─ rol öğretmen/müdür mü
  siniflarim | sinif | ogrenci ─> ogretmen.sonuclar ─> girdigiSiniflar(me) ile sınırla
        ogrenci: öğrencinin sınıfı girdiğim sınıflardan mı?
                 verdiğim ödevler (yıla süzülü) + sınav grupları ve tekler (yıla süzülü)
  schedule ─> programım + çakışma işareti + derslerim (haftalık saat, yerleşen, öğrenci sayısı)
  students ─> derslerime giren öğrenciler
```

## Dikkat!

- **`students` ucu e-posta döndürür.** Uç öğretmene derslerindeki öğrencilerin e-posta alanını verir; ön yüz bu ucu
  kullanmıyor. Bu, "öğrenci görünümü dar tutulur" kuralıyla
  ([ilerleyis.md](ilerleyis.md)) çelişebilir; kaldırmak ya da alanı atmak güvenlik denetimi işine önerilir.
- `ogrenci` ucunda sınav grupları öğrencinin BÜTÜN gruplarıdır (başka öğretmenlerin derslerindeki notlar da görünür).
  Ödevler ise yalnız bu öğretmenin verdikleri. Yetkinin adı da "girdiği sınıfların öğrenci sonuçlarını görür".
- Nakil gelen öğrencinin eski okulundaki kayıtlar `yilSuz(me, …)` ile öğretmenin okulu ve yılına süzüldüğü için görünmez.
- Müdür `isTeacherLike` olduğu için bu uçlara girer, ama Sınıflarım'da yalnız kendi ders verdiği sınıfları görür; okulun
  bütününe bakmak için okul uçları ([okul.md](okul.md)) ve ilerleyiş var.
- Çakışma yalnız öğretmenin KENDİ programında hesaplanır (aynı günde kesişen iki saat); sınıf çakışmaları okul
  bölümünün işi.
- Grup ortalamasında `ust === alt` olan bir sınav sıfıra bölme yapar (ilerleyişteki gibi); değer denetimi sınav
  bölümünde ([sinav.md](sinav.md)).

## Testleri

- `testler/test-siniflarim.js` — öğretmen ders verdiği sınıfı görür, vermediği listede yok ve açılamaz; sınıfın
  öğrencileri; öğrencinin sınıfına dersi olmayan öğretmen bakamaz; öğrenci bu bölüme giremez; verdiğim ödevler
  sonuçlarıyla; öğrencinin sınav sonucu (87,5); hazır Öğretmen rolünde yetki açık, kapanınca 403; programda ders kimliği
  (yoklama düğmesi için). Aynı paket ödev serisini ve yoklama bildirimini de dener.
- `testler/test-program.js` — `/api/teacher/schedule`: program geliyor, iki ders, saat bilgisi, çakışma işaretli; sınıf
  silinince dersin öğretmenden ve çakışmanın programdan düşmesi.
- `GET /api/teacher/students` hiçbir testte çağrılmıyor (grep: `api/teacher` yalnız yukarıdaki iki pakette geçer;
  `yetki-denetimi.js` ve `girdi-denetimi.js` bu yolları denemez).
- Elle: öğretmen hesabıyla (`testler/seed.js`) `GET /api/teacher/schedule`, sonra `GET /api/teacher/siniflarim`.

## Son durum

- Son commit `ca7b9b8 commit 357` (2026-09-26): `siniflarimUclari` eklendi (Sınıflarım: sınıflar, sınıf, öğrenci; 51
  satır). Aynı commit `egitim-yili.js`'e ve ön yüzün `16-egitim-yili.js`'ine de dokundu.
- `1eae9ae commit 339` (2026-09-26): dosyanın ilk hâli (90 satır; program ve öğrenciler).
- Açık iş: `students` ucunun e-posta döndürmesi (yukarıda). Sıradaki planlı değişiklik: "Güvenlik denetimi (tam; …)" işi
  bu tür alan sızıntılarını tarayacak; "Çalışan olarak ekleme" işi öğretmen rolünü atama biçimini değiştirecek.
