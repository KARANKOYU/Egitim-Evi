# sunucu/iliskiler.js

"Kim kimin öğretmeni, hangi sınıf hangi derste" sorularının yardımcıları: öğretmenin öğrencileri ve sınıfları, bir
öğrenciyi kimin görebileceği, ders programı saat hesapları ve çakışmalar, ödev özeti, velinin çocukları.

## Bu dosya ne yapar?

Eğitim Evi'nde öğretmen ile öğrenci arasında elle kurulan bir bağ yoktur. Bağ YALNIZ sınıf ve ders üzerinden türetilir:
bir öğretmen, dersine girdiği sınıfların öğrencilerinin öğretmenidir. Müdür okulun hepsini görür. Bu kural birçok
bölümde (ödev, sınav, etüt, devamsızlık, ilerleyiş, mesaj…) gerekiyor; her biri kendi yazmasın diye burada toplandı.
Sorguların kendisi `sunucu/veri/depo/kullanicilar.js` ve `siniflar.js`'te (JOIN ile); bu dosya onları çağırıp
biçimler.

Ayrıca ders programının saat işleri (metin "09:20" ↔ dakika 560), iki dersin çakışıp çakışmadığı ve çakışma raporu
burada.

## İçinde neler var?

Kişiler ve görme hakkı:

- `isTeacherLike(u)` — öğretmen ya da müdür mü.
- `ogretmeninOgrencileri(u)` — müdürde okulun bütün öğrencileri, öğretmende derslerine girdiği sınıfların öğrencileri.
- `ogretmeninSiniflari(u)` — müdürde okulun sınıfları; öğretmende ders verdiği sınıflar `{ id, name, schoolId }`
  (tekrarsız).
- `studentsOfTeacher(id)`, `teachersOfStudent(id)` — depodaki JOIN'lere kısa ad.
- `branchOf(u)` — branş; müdürde branş boşsa "Müdür".
- `canSeeStudent(viewer, studentId)` → `Promise<boolean>` — kural sırası: yönetici evet; kendisi evet; öğrenci
  olmayan biri o öğrencinin velisiyse (veli bağı rolden bağımsız — öğretmen de kendi çocuğunun velisidir) evet; veli
  rolündeyse (bağı yoksa) hayır; müdür aynı okulsa evet; öğretmen aynı okulda ve `ogrenci.portal` ("Öğrenci portalına
  girer", ör. rehber öğretmen) yetkisi varsa evet; öğretmen o öğrencinin öğretmenlerindense evet; gerisi hayır.
- `childrenOf(u)` — kişinin velisi olduğu çocuklar. Öğrenci, yönetici, rolsüz ve **okul rolü satırında** (`anaHesapId`
  dolu: "öğretmen@okul" oturumu) boş: çocuklar yetişkin hesabındadır, velilik ayrı bir portal seçimidir.

Sınıf, ders, program:

- `GUN_ADLARI` (`['', 'Pazartesi', …, 'Pazar']`, 1 = Pazartesi), `GUN_SAYISI = 7`.
- `saatDakika('09:20')` → 560 (biçim `S:DD` ya da `SS:DD`, 0–23 / 0–59; bozuksa `null`); `dakikaSaat(560)` → "09:20";
  `saatDuzelt('9:20')` → "09:20" ya da `null`.
- `araliklarKesisiyor(bas1, bit1, bas2, bit2)` — kesişme; uçların teması çakışma sayılmaz (10:00'da biten ile
  10:00'da başlayan çakışmaz).
- `sinifOgrencileri(sinifId)`, `dersEtiketi(l)` ("7-A · Matematik"), `programSirali(kayitlar)` (gün, sonra saat).
- `cakismalariBul(schoolId)` — okulun bütün çakışmaları (aynı öğretmen ya da aynı sınıf, aynı gün, kesişen saat); tespit
  tek SQL'de (`depo.siniflar.cakismalar`), burada `{ tur: 'ogretmen'|'sinif', ad, day, dayName, saat, lessons[2] }`
  biçimine getirilir, güne ve saate göre sıralanır.
- `aralikCakismasi(schoolId, classId, teacherId, day, bas, bit, haricId)` — yeni/değişen bir program satırı eklenmeden
  önce: önce sınıf, sonra öğretmen çakışması; ilk çakışanı `{ tur, className, subject, start, end }` döndürür, yoksa
  `null`. `haricId` düzenlenen satırın kendisidir.
- `dersOzeti(l)` — `{ id, classId, subject, teacherId, teacherName, weeklyHours, placed }` (placed = programa yerleşen
  saat); `sinifOzeti(c)` — `depo.siniflar.ozetleri`'nin tek sınıflık hâli.

Ödev:

- `summarize(a)` — bitmiş (`finished`) ödevde sonuç sayıları `{ yapti, yapmadi, eksik, gec, izinli, gelmedi }`; bitmemişse
  `null`.

## Kimle konuşur?

- Çağırdıkları: `./veri` (`depo.kullanicilar`: `okulun`, `ogretmeninOgrencileri`, `ogrencininOgretmenleri`, `bagliMi`,
  `bul`, `sinifOgrencileri`, `cocuklari`; `depo.siniflar`: `okulun`, `ogretmeninDersleri`, `cakismalar`,
  `aralikKesisenler`, `ozetleri`), `./yetki` (`yetkiVarMi`).
- Onu çağıranlar (grep, `sunucu/bolumler/`): `anket`, `devamsizlik`, `egitim-yili`, `etut`, `hatirlatici`, `ilerleyis`,
  `kayit`, `mesaj`, `odev`, `ogretmen`, `okul-hayati`, `okul`, `sinav`, `takvim`, `veli`. Örnekler: `canSeeStudent` →
  `egitim-yili`, `etut`, `ilerleyis`, `sinav`; `cakismalariBul`, `aralikCakismasi`, `dersOzeti`, `sinifOzeti` → `okul`;
  `childrenOf` → `kayit`, `veli`; `summarize` → `odev`; `araliklarKesisiyor` → `ogretmen`.
- Tablolar (depo üzerinden, okuma): kullanıcılar, sınıflar, dersler, ders programı, veli bağları.

## Nasıl çalışır (adım adım)?

Öğretmen-öğrenci bağının türetilmesi:

```
öğretmen ──(ders: teacherId)──> ders ──(classId)──> sınıf ──> sınıfın öğrencileri
müdür    ──(schoolId)────────────────────────────────────────> okulun bütün öğrencileri
```

Program satırı eklerken (`bolumler/okul.js`): saatler `saatDakika` ile dakikaya çevrilir → `aralikCakismasi` → çakışan
varsa uyarı/ret, yoksa kayıt; okulun çakışma listesi ise `cakismalariBul` ile.

## Dikkat!

- Bağ elle kurulamaz; bir öğretmenin bir öğrenciyi görmesi için ya o sınıfın dersine girmesi ya da `ogrenci.portal`
  yetkisi gerekir. Yeni bir "öğretmen öğrenciyi görür mü" kuralı gerekiyorsa `canSeeStudent`'e ekle, bölümde ayrı yazma.
- `canSeeStudent`'te veli denetimi rol denetiminden ÖNCE: öğretmen olan bir veli kendi çocuğunu okulun öğrencisi
  olmasa da görür. Öğrencinin velisi olamaz (`viewer.role !== 'student'`).
- Gün numarası JS'ten farklı: JS'te 0 = Pazar, burada 1 = Pazartesi … 7 = Pazar (`hatirlatma.js` çeviriyor).
- Çakışma "temas" sayılmaz; teneffüssüz arka arkaya dersler serbest.
- `childrenOf` okul rolü satırında boş döner — bu bilerek: bir kişinin "öğretmen" portalı ile "veli" portalı ayrıdır.

## Testleri

- `testler/test-program.js` — sınıf, öğrenci atama, 7 günlük program, ders ekleme, çakışmalar.
- `testler/test-kapsam.js` — öğretmenin yalnız kendi sınıflarını/öğrencilerini görmesi.
- `testler/test-rol.js` — yetkiler (ör. öğrenci portalı yetkisi).
- `testler/test-veli-coklu.js`, `test-yetiskin.js` — velinin çocukları, portallar.
- `testler/test-siniflarim.js` — öğretmenin sınıfları.
- Elle: müdürle aynı sınıfa aynı gün kesişen iki ders koy → program ekranında çakışma uyarısı.

## Son durum

- Son commit `81fa14e commit 56` (2026-08-29): "sınıf / ders / program" bölüm başlığı ile `GUN_ADLARI`, `GUN_SAYISI`
  eklendi (7 günlük program). Önceki: `b5d8dc2 commit 33`, `39260a5 commit 32` (dosyanın ilk hâlleri).
- Açık iş yok. Sıradaki "Çalışan olarak ekleme" işi (rolsüz çalışan, müdürün rol ataması) `canSeeStudent`'in öğretmen
  koluna dokunabilir.
