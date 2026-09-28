# sunucu/bolumler/okul.js

Müdürün okul yönetimi (`/api/school/...`): sınıflar, dersler, haftalık ders programı, özel roller, öğretmen ve
öğrenci listeleri, toplu giriş bilgisi, Excel içe/dışa aktarım; hesap uçlarını `hesaplar.js`'e ve kişi listesi
aktarımını `kisi-aktarim.js`'e devreder.

## Bu dosya ne yapar?

Müdür okulunu kurarken ne yapar? Sınıfları açar (7-A, 7-B…), her sınıfa dersleri ekler, derslere öğretmen atar,
haftalık programı çizer, bazı öğretmenlere ek yetkiler veren roller tanımlar ("Müdür Yardımcısı", "Rehber
Öğretmen"), öğrencileri sınıflara yerleştirir, öğrencilere giriş bilgisi dağıtır. Bunların hepsi `/api/school/...`
altındadır ve bu dosyadan geçer.

`/api/school` yolu [api.md](../api.md)'deki `BOLUM` tablosunda bu dosyaya gider. Bu dosya önce kapıyı tutar
(yalnız müdür ve öğretmen), sonra isteği sırayla [hesaplar.md](hesaplar.md)'e (okulun açtığı hesaplar, veli
bağlama, okul adresi, nakil) ve [kisi-aktarim.md](kisi-aktarim.md)'ye (öğrenci/servisçi listelerinin toplu
aktarımı) sorar; onlar tanımazsa kendi uçlarına bakar.

Müdür her şeyi yapabilir. Öğretmen yalnız rolünün verdiği yetkiyle girer: her uç kendi yetkisini
(`yetkiVarMi`, [yetki.md](../yetki.md)) ayrıca denetler; rol belirli sınıf ya da derslerle sınırlıysa (kapsam)
yalnız onlara dokunabilir.

## İçinde neler var?

### Sabitler ve yardımcılar

- `AKTARIM_SINIR = 300` — tek dosyada eklenebilecek en çok ders saati (toplu işi sınırlamak için). Dışa açık.
- `AKTARIM_DOSYA_SINIR = 1300000` — base64 dosya en çok ~1,3 milyon karakter (gövde sınırı 2 MB; base64 dosyayı
  üçte bir büyütür). Dışa açık.
- `xlsxGonder(res, veri, ad)` — Excel dosyasını indirme başlıklarıyla (`Content-Disposition: attachment`,
  `Cache-Control: no-store`) gönderir. Dışa açık.
- `uclar(k)` — bölümün uçları; tanımadığı yolda `false` döner. Dışa açık.
- İç: `SIFRE_HARF`, `SIFRE_RAKAM`, `rastgeleSifre()` — 8 harf + 2 rakam, karışan karakterler (I/l/1, O/0) yok,
  `crypto.randomInt` ile; `sinifAdiDuzelt(ad)` — "7a", "7 - a", "7/A" → "7-A" (başka biçimdeki adlara dokunmaz:
  "Anasınıfı Papatya"); `okulOgrencisi(me, id)` — bu okulun öğrencisi mi; `uyariMetni(u)` — çakışma uyarısının okunur
  hâli.

### Kapı

`need(null)` (giriş yapmış, onaylı herkes) + `me.role` `principal` ya da `teacher` olmalı; değilse `403 "Yetkin
yok"`. Yetkisi eksik uçta `403 "Bu işlem için yetkin yok"` (kapsam dışıysa "Bu ders ya da sınıf için yetkin yok").
Başka okulun kaydı (sınıf, ders, öğrenci, rol) her uçta `schoolId` karşılaştırmasıyla "bulunamadı" olur.

### Uçlar (`/api/school/<alt>`)

| Alt yol | Yöntem | Gereken yetki | Gövde / sorgu → cevap |
|---|---|---|---|
| `aktarim-sablon` | GET | `aktarim.yap` | `?tur=program` → `ders-programi-sablon.xlsx` (başka tür 400) |
| `aktarim-disa` | GET | `aktarim.yap` | `?tur=ogrenci\|ogretmen\|program` → `ogrenciler.xlsx`, `ogretmenler.xlsx`, `ders-programi.xlsx` |
| `aktarim-ice` | POST | `aktarim.yap` (+ satır başına `program.duzenle` kapsamı) | `{ tur: 'program', dosya (base64), dosyaAdi, uygula }` → önizleme raporu ya da ekleme |
| `permissions` | GET | — | `{ gruplar, ogretmenVarsayilan, sablonlar }` (yetki kataloğu) |
| `roles` | GET | `rol.yonet` | `{ roles: [...] }`; hazır Öğretmen rolü yoksa önce kurulur |
| `role` | POST | `rol.yonet` | `{ name, permissions, kapsam }` → `{ role }` |
| `role-update` | POST | `rol.yonet` | `{ roleId, name?, permissions?, kapsam? }` → `{ role }` |
| `role-delete` | POST | `rol.yonet` | `{ roleId }` |
| `role-assign` | POST | `rol.yonet` | `{ userId, roleId }` (boş `roleId` = rolü al) → `{ user }` |
| `teachers` | GET | `ogretmen.duzenle` | `{ teachers: [pub + bagli] }` |
| `teacher-decide` | POST | `ogretmen.onayla` | `{ userId, approve }` → `{ user }` |
| `students` | GET | `ogrenci.duzenle` ya da `ogrenci.portal` | `{ students }` |
| `ozet` | GET | müdür ya da `ogrenci.duzenle`/`ogretmen.duzenle` | sayılar (+ müdüre `disk`) |
| `teacher-list` | GET | `ders.ogretmen-ata` | `{ teachers: [{ id, fullName, branch, role }] }` |
| `assignments` | GET | `ders.yonet` | ders başına ödev sayıları ya da bir dersin ödevleri |
| `giris-bilgisi` | POST | `ogrenci.sifre` | `{ onay: true, classId?, sadeceGirmeyen? }` → tek seferlik liste + Excel |
| `student-code-reset` | POST | `ogrenci.duzenle` | `{ studentId }` → `{ code }` (yeni veli kodu) |
| `classes` | GET | `sinif.yonet` | `{ classes, gunSayisi, gunAdlari, sinifsiz }` |
| `class` | POST | `sinif.yonet` | `{ name }` → `{ class }` |
| `class-delete` | POST | `sinif.yonet` | `{ classId }` |
| `class-assign` | POST | `ogrenci.yerlestir` (hedef ve şimdiki sınıf kapsamı) | `{ studentId, classId }` (boş = sınıfsız) |
| `lessons` | GET | `ders.yonet` (sınıf kapsamı) | `?classId=` → `{ class, lessons, teachers, subjects }` |
| `lesson` | POST | `ders.yonet` (sınıf) | `{ classId, subject, weeklyHours }` → `{ lesson }` |
| `lesson-update` | POST | `ders.ogretmen-ata` (ders + sınıf) | `{ lessonId, teacherId?, weeklyHours? }` → `{ lesson, cakismalar }` |
| `lesson-delete` | POST | `ders.yonet` (sınıf) | `{ lessonId }` |
| `schedule` | GET | `program.duzenle` (sınıf) | `?classId=` → `{ class, gunSayisi, gunAdlari, cells, lessons, cakismalar }` |
| `schedule-add` | POST | `program.duzenle` (sınıf) | `{ classId, day, start, end, lessonId }` → `{ kayit, uyari, cakismalar }` |
| `schedule-update` | POST | `program.duzenle` (sınıf) | `{ scheduleId, day?, start?, end?, lessonId? }` → `{ kayit, uyari, cakismalar }` |
| `schedule-delete` | POST | `program.duzenle` (sınıf) | `{ scheduleId }` → `{ cakismalar }` |
| `cakismalar` | GET | `program.duzenle` | `{ cakismalar }` |

Uçların ayrıntıları:

- **`aktarim-disa`** — öğrenci: ad, kullanıcı adı, e-posta, sınıf, veli kodu (4'erli tireli, `kisiKoduBicim`), müdür
  notu, kayıt tarihi. Öğretmen (yalnız onaylı): ad, kullanıcı adı, e-posta, branş, verdiği dersler, sınıflar, kayıt
  tarihi. Program: sınıf, gün, başlangıç, bitiş, ders, öğretmen. Bilinmeyen tür 400.
- **`aktarim-ice`** — yalnız ders programı; `tur: 'ogrenci'` "Öğrenci listesini 'Kişi listesi' bölümünden yükle."
  der (o iş [kisi-aktarim.md](kisi-aktarim.md)'de). Dosya boşsa, çok büyükse ya da okunamazsa 400. `tabloOku`
  .xlsx, eski .xls, .ods ve .csv'yi tanır; `aktarim.coz('program', ...)` satırları çözer. Her satır için: sınıf var
  mı (ad karşılaştırması `aktarim.anahtarla` ile gevşek), o sınıfın programına yetki var mı, ders o sınıfta tanımlı
  mı, bitiş başlangıçtan sonra ve en çok 8 saat mi, aynı saat programda ya da dosyada zaten var mı (`atlandi`),
  sınıf/öğretmen çakışması var mı (`uyari`, engellemez). `uygula` yoksa önizleme: `{ onizleme: true, tur, hazir,
  hatali, uyarili, sinir, rapor: [{ satir, ad, durum, mesaj }] }`. `uygula: true` → hazır satır yoksa 400, 300'den
  fazlaysa 400; hepsi tek işlemde, eğitim yılı damgasıyla (`yilDamgasi`) eklenir, işlem kaydı
  `program.toplu-eklendi` → `{ uygulandi: true, eklenen, cakismalar, message }`.
- **`roles`** — her rol `rolOzeti` biçiminde; hazır Öğretmen rolünün `kisiSayisi` okuldaki öğretmen sayısıdır.
- **`role`** — ad en çok 40 karakter, okulda aynı adda (Türkçe büyük/küçük harf fark etmeden) rol varsa 400;
  yalnız `TUM_YETKILER`'deki yetkiler alınır; kapsam `kapsamTemizle` ile okulun sınıf/derslerine göre süzülür.
  İşlem kaydı `rol.olusturuldu`.
- **`role-update`** — müdür olmayan kişi kendi taşıdığı rolü ve hazır Öğretmen rolünü değiştiremez (403 "Kendi
  taşıdığın rolü değiştiremezsin; müdürden iste."). Hazır Öğretmen rolünün adı sabittir, kapsamı olmaz (gelen ad ve
  kapsam yok sayılır). Yetkiler değişince kapsam yeni listeye göre yeniden süzülür. İşlem kaydı `rol.degistirildi`.
- **`role-delete`** — hazır Öğretmen rolü silinemez ("istemediğin yetkileri kapatabilirsin"). Rolü taşıyanların rolü
  veritabanı kuralıyla boşalır (`ON DELETE SET NULL`). İşlem kaydı `rol.silindi`.
- **`role-assign`** — yalnız bu okulun öğretmenine; kendine rol veremezsin (403); hazır Öğretmen rolü ayrıca
  verilmez. Rol verilince öğretmene bildirim ("… rolü verildi. Menünde yeni bölümler görebilirsin.") ve işlem kaydı
  `rol.atandi`; rol alınınca bildirim ve kayıt yok.
- **`teachers`** — `bagli: true` öğretmen kendi yetişkin hesabıyla (kişi koduyla) eklenmiştir; okul yalnız
  branşını düzenler.
- **`teacher-decide`** — yalnız `pending` başvuru karara bağlanır ("Bu başvuru zaten karara bağlanmış."); onaylı
  öğretmen buradan çıkarılamaz (dersleri, ödevleri sahipsiz kalırdı). Kendi başvurun olamaz. Reddedilen kişi
  kilitlenmez: rolsüz yetişkin hesabına döner (rol, okul, branş, özel rol boşalır) ve kişi kodu yoksa aynı
  güncellemede üretilir. Kişiye bildirim gider; onayda işlem kaydı `ogretmen.onaylandi`.
- **`students`** — tam liste: `{ id, fullName, username, email, code, grade, classId, className, note, dogum,
  olusturan ('okul'|'kendisi'), girisYapti, okulNo, sifreDegismeli }`. Yalnız `ogrenci.portal` yetkisi olan (ör.
  "Rehber Öğretmen") DAR liste alır: ad, sınıf, okul no; kullanıcı adı, e-posta ve veli kodu boş.
- **`ozet`** — `depo.kullanicilar.okulSayimlari`: `{ ogrenci, sinifsiz, ogretmen, bekleyen, sinif }` tek sorguda;
  müdüre ek olarak `disk` (okulun dosya alanı: `kullanilan`, `sinir`, `siniriMb`, `ozel`, `dagilim`, `oran`;
  hesabı `sunucu/bolumler/okul-disk.js` yapar).
- **`teacher-list`** — onaylı öğretmen ve müdürler, branşa göre sıralı (ders ataması için). Ön yüz bugün
  `lessons` cevabındaki `teachers`'ı kullanır; bu uç testlerde ve `testler/seed.js`'te çağrılır.
- **`assignments`** — müdürün ödevlere ders bazlı bakışı, iki kademe: `?classId=` (isteğe bağlı) → `{ lessons:
  [{ lessonId, subject, classId, className, teacherName, weeklyHours, aktif, gecmis }], classes }` (yalnız SAYILAR;
  bitmiş ya da süresi geçmiş ödev `gecmis`); `?lessonId=` → `{ lessonId, assignments }` (o dersin ödevleri,
  `endTime`, `gecikti` ve quiz özeti ile); `?classId=&detay=1` → her ders ödevleriyle ("Hepsini aç"). Geçmiş eğitim
  yılına bakılıyorsa `yilSuz` o yılın kayıtlarını bırakır.
- **`giris-bilgisi`** — seçilen öğrencilere YENİ şifre üretir. `onay !== true` → 400; okul başına saatte 30 dağıtım
  (429); `classId` başka okulunsa 400; varsayılan yalnız hiç giriş yapmamış öğrenciler (`sadeceGirmeyen: false`
  verilirse hepsi); rol kapsamı dışındaki öğrenciler atlanır (`ogrenciKapsamindaMi`); seçilen yoksa 400, 600'den
  fazlaysa 400 ("Sınıf sınıf dağıt."). Şifre özetleri toplu (`hashPwToplu`) hesaplanır; `topluSifreYaz` tek işlemde
  yazar, `sifre_degismeli`'yi açar (öğrenci ilk girişte kendi şifresini koyar), son girişi siler (yeni şifreyle girene
  kadar "henüz girmemiş" sayılır; kâğıdı kaybolana yeniden dağıtılabilsin) ve o öğrencilerin oturumlarını ve cihaz
  anahtarlarını siler. Her öğrencinin hesap kilidi kalkar (`girisBasarili`), her birine
  bildirim, işlem kaydı `sifre.toplu-dagitildi`. Cevap (`Cache-Control: no-store`): `{ adet, kapsam, okul, satirlar:
  [{ ad, sinif, kullaniciAdi, sifre, veliKodu }], xlsx (base64) }`. Veli kodu yalnız `ogrenci.duzenle` yetkisi
  olana gider. Liste bir daha üretilemez (yalnız özet saklanır).
- **`student-code-reset`** — öğrencinin veli kodunu yeniler (eski kodla artık veli bağlanamaz).
- **`classes`** — `depo.siniflar.ozetleri`: her sınıfın öğrenci, ders, öğretmensiz ders sayısı; `sinifsiz` sınıfı
  olmayan öğrenci sayısı; `gunSayisi` 7, `gunAdlari` Pazartesi–Pazar.
- **`class`** — ad en çok 30 karakter, `sinifAdiDuzelt`'ten geçer; aynı ad varsa 400; okulda en çok 200 sınıf.
- **`class-delete`** — öğrenciler sınıfsız kalır, sınıfın dersleri ve programı silinir (veritabanı kuralları:
  `SET NULL` / `CASCADE`). İşlem kaydı yazılmaz.
- **`class-assign`** — rolünde sınıf kapsamı varsa öğrencinin ŞİMDİKİ sınıfı da kapsamda olmalı (kapsam dışındaki
  öğrenci sınıfsız bırakılamaz, başka sınıfa alınamaz). Sınıfa yerleştirilen öğrenciye bildirim.
- **`lesson`** — ders adı `SUBJECTS` listesinden olmalı; aynı ders sınıfta varsa 400; haftalık saat 0–20'ye
  kırpılır; öğretmensiz açılır.
- **`lesson-update`** — atanacak kişi bu okulun onaylı öğretmeni ya da müdürü (`isTeacherLike`) olmalı ve kendi
  rolü onu bu derse atanabilir kılmalı (`derse-atanabilir` yetkisi ders/sınıf kapsamıyla); yoksa "… bu derse
  atanamaz". Yeni atanan öğretmene bildirim ("… dersi sana atandı.").
- **`lesson-delete`** — programdaki saatleri de gider.
- **`schedule-add` / `schedule-update`** — gün 1–7; saat `SS:DD` (`saatDuzelt`); bitiş başlangıçtan sonra, en çok 8
  saat; ders o sınıfın olmalı. Sınıf ya da öğretmen çakışması `uyari` olarak döner ama ENGELLEMEZ (müdür bilerek
  ekleyebilir). Eklenen saat eğitim yılıyla damgalanır. Dersin öğretmenine bildirim öğretmen başına GÜNDE BİR kez
  (`depo.genel.ilkKezOlanlar(['program:<öğretmen>:<gün>'])`).
- **`schedule`** — okumak da kapsama tabidir (rolü 7-A ile sınırlıysa 7-B'yi göremez); silinmiş dersin hücresi
  "(silinmiş ders)" yazar.

## Kimle konuşur?

- Çağırdıkları:
  - `../http` ([http.md](../http.md)) — `bad`, `ok`, `baslikEkle`;
  - `../iliskiler` ([iliskiler.md](../iliskiler.md)) — `GUN_ADLARI`, `GUN_SAYISI`, `aralikCakismasi`,
    `cakismalariBul`, `branchOf`, `dersEtiketi`, `dersOzeti`, `sinifOzeti`, `isTeacherLike`, `saatDakika`,
    `saatDuzelt`;
  - `../ortak` ([ortak.md](../ortak.md)) — `SUBJECTS`, `clean`, `gunTarih`, `kisiKoduBicim`, `now`, `uid` (ayrıca
    içe alınıp bugün kullanılmayanlar: `adDuzelt`, `dogumSorunu`, `kullaniciAdiSorunu`, `normEmail`,
    `normKullaniciAdi`, `sifreSorunu`, `tcSorunu`);
  - `../guvenlik` ([guvenlik.md](../guvenlik.md)) — `hizSinir`, `girisBasarili`;
  - `../sifre` ([sifre.md](../sifre.md)) — `hashPwToplu` (`hashPw` içe alınmış, kullanılmıyor);
  - `../yetki` ([yetki.md](../yetki.md)) — `yetkiVarMi`, `ogrenciKapsamindaMi`, `kapsamTemizle`, `roleById`,
    `rolOzeti`, `pub`, `YETKILER`, `TUM_YETKILER`, `OGRETMEN_VARSAYILAN`, `ROL_SABLONLARI`;
  - `../yardimci/tablo-oku` (`tabloOku`) ve `../yardimci/aktarim` (`sablon`, `disa`, `coz`, `anahtarla`,
    `GUNLER`) — belgeleri henüz yok: `sunucu/yardimci/tablo-oku.js`, `sunucu/yardimci/aktarim.js`;
  - bölümler: [hesaplar.md](hesaplar.md) ve [kisi-aktarim.md](kisi-aktarim.md) (`uclar(k, sub)`),
    [egitim-yili.md](egitim-yili.md) (`yilDamgasi`, `yilSuz`), `./okul-disk` (`durum`, `gorunum`), `./islem-kaydi`
    (`islemYaz`), `./odev` (`odevGecikti`, `odevSaati`), `./quiz` (`listeOzetleri`);
  - `../veri` — `depo`, `bildir`, `islem`.
- Veri tabloları:
  - `depo.siniflar` → `siniflar`, `dersler`, `ders_programi`: `okulun`, `bul`, `ozetleri`, `ekle`, `sil`,
    `okulunDersleri`, `sinifinDersleri`, `dersBul`, `dersVarMi`, `dersEkle`, `dersGuncelle`, `dersSil`,
    `okulunProgrami`, `sinifinProgrami`, `programBul`, `programVarMi`, `programEkle`, `programGuncelle`,
    `programSil`;
  - `depo.roller` → `roller`, `rol_yetkileri`, `rol_yetki_kapsamlari`: `ogretmenRolu`, `okulun`, `ekle`,
    `guncelle`, `sil`;
  - `depo.kullanicilar` → `kullanicilar`: `bul`, `okulun`, `okulSayimlari` (+ `siniflar`), `guncelle`,
    `yeniKisiKodu`, `topluSifreYaz` (+ `oturumlar`, `cihaz_anahtarlari`: oturumları kapatır);
  - `depo.odevler` → `odevler`, `odev_siniflari`, `odev_ogrencileri`, `dersler` (+ `kullanicilar`: ödevi verenin
    adı): `dersinOdevleri`, `dersBaglari`;
  - `depo.genel` → `bildirimler` (`cokluBildir`, `bildir` üzerinden) ve `hatirlatmalar` (`ilkKezOlanlar`: "bu olay
    daha önce oldu mu" defteri);
  - `islemYaz` → `islem_kaydi`.
- Onu çağıranlar: yalnız `sunucu/api.js` (`'school': okul`). Dışa açık `AKTARIM_SINIR`, `AKTARIM_DOSYA_SINIR` ve
  `xlsxGonder`'i bugün başka dosya kullanmıyor (grep).
- Ön yüz (`public/js/parcalar/`): `10-mudur.js` (students, teachers, classes), `10a-giris-bilgisi.js`
  (giris-bilgisi), `10b-hesaplar.js` (classes, student-code-reset), `08-ana-sayfa.js` (ozet), `11-ogretmen-odev.js`
  (assignments), `15-aktarim.js` (aktarim-ice, aktarim-sablon, aktarim-disa), `18-devamsizlik.js` (classes,
  students), `19f-roller.js` (permissions, roles, role, role-update, role-delete, role-assign, teachers, classes),
  `20-siniflar.js` (classes, class-assign, lessons, lesson-update, students), `21-ders-programi.js` (schedule,
  classes), `25-tiklama.js` (class, class-delete, lesson, lesson-delete, schedule-add, schedule-update,
  schedule-delete, teacher-decide). `teacher-list` ve `cakismalar` ön yüzde çağrılmıyor.
- Android uygulaması bu uçların hiçbirini çağırmıyor (grep).

## Nasıl çalışır (adım adım)?

```
/api/school/<alt>  (api.js → okul.uclar)
  1. need(null)              giriş + onaylı hesap
  2. rol müdür ya da öğretmen mi?            değilse 403
  3. hesaplar.uclar(k, alt)   tanıdıysa bitti   (hesap-ac, veli-bagla, adres, nakil…)
  4. kisiAktarim.uclar(k, alt) tanıdıysa bitti  (kisi-aktarim, kisi-sablon…)
  5. alt'a göre uç: yetkiGerek(izin, {sinif, ders})  → 403 ya da işlem
  6. tanınmayan alt → false → api.js 404
```

Ders programı ekleme:

```
schedule-add → sınıf bu okulun mu → program.duzenle (sınıf kapsamı)
   → gün 1..7, saatler SS:DD, bitiş > başlangıç, ≤ 8 saat, ders bu sınıfın mı
   → aralikCakismasi (sınıfın ya da öğretmenin o saatte başka dersi?) → uyari
   → ders_programi'ne ekle (yilId = yilDamgasi)
   → öğretmene bugün ilk kezse bildirim
   → { kayit, uyari, cakismalar (okulun bütün çakışmaları) }
```

Excel'den program: önizleme (`uygula` yok) ve uygulama aynı dosyayı BAŞTAN çözer, bütün denetimler iki kez
çalışır; arada veri değişmiş olabilir, önizlemeye güvenilmez.

## Dikkat!

- **Sıra önemli:** hesap ve kişi aktarımı uçları kendi dosyalarında; bu dosya onlara ÖNCE sorar. Yeni bir alt yol
  eklerken aynı adın o iki dosyada olmadığına bak.
- **Kimse kendi yetkisini genişletemez:** öğretmen kendi rolünü ve hazır Öğretmen rolünü değiştiremez, kendine rol
  veremez. Müdür için `yetkiVarMi` her zaman `true`.
- **Kapsam iki yönlü:** `class-assign`'da hem hedef sınıf hem öğrencinin şimdiki sınıfı kapsamda olmalı; yoksa
  kapsam dışı öğrenci "sınıfsız bırakılarak" kapsamdan kaçırılabilirdi. `giris-bilgisi` sınıfsız öğrenciyi, rol
  sınıfla sınırlıysa kapsam DIŞI sayar (`ogrenciKapsamindaMi`).
- **Çakışma uyarısı engellemez** (bilerek): bazı okullarda aynı saatte bölünmüş gruplar olabilir.
- **Öğretmene bildirim yağmuru yok:** program kurulurken her ders saati için değil, öğretmen başına günde bir.
  Anahtar `hatirlatmalar` tablosundadır.
- **`giris-bilgisi` pahalıdır:** yüzlerce şifre özeti (scrypt) hesaplanır; bu yüzden okul başına saatte 30 ve tek
  seferde 600 öğrenci sınırı var. Şifreler yalnız bu cevapta görünür; kaybedilirse yeniden dağıtılır (eskisi
  geçersiz olur, oturumlar kapanır).
- **`students` cevabı inceltildi:** eskiden her öğrenciyle sınıfın öğretmen listesi de gidiyordu (720 öğrencide
  525 KB); şimdi öğrenciler ve sınıf adları iki sorguda.
- **`assignments` iki kademeli** çünkü bir yıllık okulda bütün ödevler 1 MB'ı geçiyordu. Ödevi dersin kendi
  öğretmeni vermemiş olabilir (vekil, zümre); müdür hepsini görür.
- **Arşiv yılı:** geçmiş bir eğitim yılına bakan müdürün `schedule-add`, `schedule-update`, `schedule-delete` ve
  program `aktarim-ice` istekleri [api.md](../api.md)'deki arşiv kapısında 409 alır; sınıflar, dersler ve roller
  yıllar arası ortaktır, kapıya takılmaz.
- **Öğrenciyi tek tek öğretmene atayan uç yoktur:** öğretmen–öğrenci ilişkisi yalnız sınıf ve ders üzerinden
  kurulur.
- İşlem kaydı yalnız rol uçlarında (`rol.olusturuldu`, `rol.degistirildi`, `rol.silindi`, `rol.atandi`),
  öğretmen onayında, toplu şifre dağıtımında ve Excel'den program eklemede yazılır. Sınıf, ders, program,
  yerleştirme uçları, `student-code-reset` ve rol geri alma (`role-assign` boş `roleId`) kayıt yazmaz.
- `aktarim-ice`'de sunucu konsoluna "Excel ile N ders saati eklendi (<e-posta>)" yazılır.
- Dosyanın başında içe alınan ama kullanılmayan adlar var (`hashPw`, `adDuzelt`, `normEmail` vb.; hesap uçları
  `hesaplar.js`'e taşınırken kalmış). Zararsız; temizlik ayrı bir iş olabilir.

## Testleri

- `testler/test-program.js` — sınıf açma (aynı ad büyük/küçük harf fark etmeden reddedilir, boş ad), ders ekleme
  (aynı ders iki kez olmaz, listede olmayan ders), öğretmen atama, program ekleme (Pazar dahil 7 gün; geçersiz saat,
  gün, başka sınıfın dersi reddedilir), kesişen saatte öğretmen uyarısı ve bitişik aralıkta uyarı olmaması,
  güncelleme/silme, öğrencinin ve yetkisiz öğretmenin yazamaması, sınıf silinince öğrencilerin sınıfsız kalıp
  derslerin ve çakışmaların temizlenmesi.
- `testler/test-rol.js` — yetki kataloğu, rol açma (aynı ad, geçersiz yetki ayıklanır), atama ve kullanıcıya
  yansıması, rolsüz öğretmenin sınıf açamaması, `rol.yonet`'siz rol açılamaması, yetki daraltma, rolün kişi sayısı,
  rol silme, müdürün bütün yetkileri.
- `testler/test-etut.js` — rol vermenin `rol.yonet` istemesi; öğretmenin kendi rolünü değiştirememesi.
- `testler/test-kapsam.js` — sınıf/ders kapsamlı rolde kapsam içini görüp kapsam dışını reddetmesi: `schedule`
  (okuma), `lessons`, `schedule-add`, `lesson` (ders ekleme), `lesson-update` (kapsam dışı derse atanamama) ve
  `assignments` (ders bazlı sayılar, ders açılınca ödevler, veren öğretmen). `class-assign`'ı yalnız hazırlıkta
  (öğrenci yerleştirmek için) çağırır; `class-assign`'ın iki yönlü kapsam denetimini ("Bu öğrencinin sınıfı için
  yetkin yok") deneyen bir test YOK.
- `testler/test-aktarim.js` — program aktarımı (önizleme, uygulama), dışa aktarım, bozuk dosya, sıkıştırma bombası,
  yetki.
- `testler/test-giris-bilgisi.js` — toplu şifre: yalnız özet saklanır, varsayılan yalnız girmeyenler, eski şifre ve
  oturumlar geçersiz, bildirim, yetkisiz öğretmen ve başka okulun sınıfı reddedilir.
- `testler/test-kisi-kodu.js` — `student-code-reset`, `teacher-decide`.
- `testler/test-okul-disk.js` — müdürün `ozet`'te disk kartını görmesi.
- `testler/yetki-denetimi.js` — her uç × her rol.
- Elle: sunucuyu 3200'de aç, `testler/seed.js`'teki müdür hesabıyla (kullanıcı adı `mudur`) gir; Sınıflar ve Ders
  programı ekranları bu uçları kullanır.

## Son durum

- Son commit `40fc7e7 commit 525` (2026-09-27, okul disk sınırı): `ozet` müdüre `disk` alanını da verir
  (`okulDisk.durum` + `gorunum`).
- `566b917 commit 524`: `giris-bilgisi` yeni şifre verilen her öğrencinin hesap kilidini kaldırır (`girisBasarili`).
- `153d63d commit 522`: yalnız yorum — veli kodu kâğıtta 4'erli tireli gruplar (16 hane).
- `3b8fd36 commit 519` (quiz): `assignments` ödevlere `quiz` özetini ("Quiz" rozeti) ekler.
- Açık iş yok. Sıradaki "Çalışan olarak ekleme" işi (müdürün kodla eklenen kişiye Öğretmen/özel rol/Kodlayıcı
  ataması) `role-assign` ve `teachers` uçlarına dokunacak.
