# testler/test-program.js

Sınıf, ders ve haftalık ders programı uçlarını (`/api/school/class…`, `lesson…`, `schedule…`, `/api/teacher/schedule`,
`/api/myschedule`) müdür, öğretmen ve öğrenciyle deneyen sunuculu paket: sınıf açma ve silme, öğrenci yerleştirme, ders ve
öğretmen atama, saat aralığıyla yerleştirme, saat ve gün doğrulaması, aynı öğretmenin çakışan saatleri, öğretmenin ve
öğrencinin kendi programı (43 denetim).

## Bu dosya ne yapar?

Okulun ders programı müdürün elindedir: sınıfları açar, öğrencileri yerleştirir, sınıfa ders ekler, derse öğretmen atar ve
her ders saatini gün + başlangıç–bitiş saatiyle programa koyar. Saatleri müdür kendisi yazar (sabit "1. ders, 2. ders"
ızgarası yok), bu yüzden doğrulama ve çakışma uyarısı önemlidir:

- saat `SS:DD` biçiminde ve bitiş başlangıçtan sonra olmalı, gün 1–7 (Pazartesi–Pazar) arası;
- aynı öğretmenin iki sınıfta kesişen saatleri **engellenmez ama uyarılır** (`uyari: { tur: 'ogretmen' }`) ve okulun çakışma
  listesine düşer; uç uca eklenen saatler (09:00'da biten, 09:00'da başlayan) çakışma sayılmaz;
- sınıf silinince dersleri ve program satırları da gider, öğrencileri sınıfsız kalır, öğretmenin programından o ders düşer.

Bu paket bu kuralları gerçek uçlarla dener ([../sunucu/bolumler/okul.md](../sunucu/bolumler/okul.md),
[../sunucu/iliskiler.md](../sunucu/iliskiler.md)); sonra öğretmenin kendi programını ([../sunucu/bolumler/ogretmen.md](../sunucu/bolumler/ogretmen.md))
ve öğrencinin kendi sınıfının programını ([../sunucu/bolumler/ilerleyis.md](../sunucu/bolumler/ilerleyis.md)) okur, en sonda
yetkisiz denemelere ve silme temizliğine bakar.

## İçinde neler var?

### Yardımcılar ve hesaplar

- `kontrol(ad, sart, detay)`; denetim adları Türkçe harfsiz ("ayni ad reddedildi"). Dosyanın başında açıklama yorumu yok.
- Ortak yardımcılar [giris.md](giris.md) üzerinden ([../araclar/giris.md](../araclar/giris.md)): yalnız `iste` ve `girisYap`.
- **Hesaplar** ([seed.md](seed.md)): müdür `mudur@test.com` (oturumu `T`), Matematik öğretmeni `mat@test.com` (10. bölümden
  sonra), öğrenci `ogrenci1@test.com` (11. bölümden sonra). Paket hiç hesap açmaz.
- **Öğrenciler:** `GET /api/school/students` ad sırasıyla döner; 2. bölümdeki `o1` listenin ilki, yani seed'in **`ogrenci2`**'si
  (Burak Öztürk) 7-A'ya, `o2` ise **`ogrenci1`** (Zeynep Şahin) 7-B'ye konur. 11. bölümde giriş yapan `ogrenci1` bu yüzden
  7-B'dedir.

### Bölümler

| # | Ne yapılır | Denetim |
|---|---|---|
| 1) Sınıf oluşturma (4) | `POST /api/school/class` 7-A ve 7-B; sonra "7-a" ve boş ad | 7-A ve 7-B 200; "7-a" 400 (ad `7-A`'ya düzeltilip büyük/küçük harf gözetmeden karşılaştırılır: "Bu adda bir sınıf zaten var"); boş ad 400 |
| 2) Öğrenci atama (3) | iki seed öğrencisi `POST /api/school/class-assign` ile 7-A ve 7-B'ye; `GET /api/school/classes` | 7-A'nın `studentCount`'u 1; `sinifsiz` 0; `gunSayisi` 7 |
| 3) Ders ekleme (4) | `POST /api/school/lesson` iki sınıfa Matematik (haftada 5 saat); 7-A'ya ikinci Matematik; "Simya" | ilk ikisi 200; ikinci Matematik 400 ("Bu ders bu sınıfa zaten eklenmiş"); "Simya" 400 ("Geçerli bir ders seç", sabit ders listesinde yok) |
| 4) Öğretmen atama (4) | `GET /api/school/lessons?classId=<7-A>` → öğretmen listesinden adında "Ayşe" geçen; `POST /api/school/lesson-update` iki derse; `teacherId: 'u_yok'` | liste dolu; iki atama 200; uydurma öğretmen 400 ("Öğretmen bulunamadı") |
| 5) Saat aralığıyla yerleştirme (3) | `POST /api/school/schedule-add` 7-A Pazartesi (1) 09:20–10:00; 7-A Pazar (7) 11:00–11:40 | 200 ve okulun `cakismalar` listesi boş; Pazar da 200 |
| 6) Saat doğrulama (4) | 25:00–26:00; 10:00–09:00; gün 9; 7-A'ya 7-B'nin dersi | hepsi 400 |
| 7) Çakışma (3) | 7-B Pazartesi 09:40–10:20 (aynı öğretmen, 09:20–10:00 ile kesişir) | cevapta `uyari` var, `tur: 'ogretmen'`, `cakismalar` 1 tane (kayıt yine eklenir) |
| 8) Bitişik aralık (1) | 7-A Çarşamba (3) 08:00–09:00, sonra 09:00–10:00 | ikincisinde `uyari` yok |
| 9) Düzenleme ve silme (4) | Pazar kaydı `POST /api/school/schedule-update` ile 13:00–13:45; sonra `schedule-delete`; `GET /api/school/schedule?classId=<7-A>` | güncelleme 200 ve `kayit.start` `13:00`; silme 200; silinen listede yok; `cells` gün, sonra başlangıç saatine göre sıralı |
| 10) Öğretmenin kendi programı (4) | `mat` girer, `GET /api/teacher/schedule` | 200; adı "7-" ile başlayan iki dersi var; `cells[0].start` dolu; en az bir hücrede `cakisma: true` |
| 11) Öğrencinin kendi sınıf programı (3) | `ogrenci1` girer, `GET /api/myschedule` | 200; `className` dolu (7-B); en az bir ders saati |
| 12) Yetki (2) | öğrenci `POST /api/school/class`; öğretmen `schedule-add` | ikisi de 403 |
| 13) Silme temizliği (4) | müdür `POST /api/school/class-delete { classId: <7-B> }`; listeler yeniden okunur | 7-B listede yok; `sinifsiz` 1 (`ogrenci1`); öğretmende "7-" dersi 1 kaldı; hiçbir hücrede `cakisma` yok |

Toplam 4 + 3 + 4 + 4 + 3 + 4 + 3 + 1 + 4 + 4 + 3 + 2 + 4 = 43. Sonunda `GECTI: 43   KALDI: 0`; `KALDI` varsa çıkış kodu 1;
beklenmeyen hata `TEST HATASI:` ile iletiyi ve yığını yazar.

## Kimle konuşur?

- **Modüller:** yalnız [giris.md](giris.md) (`araclar/giris.js`).
- **Sunucu uçları:**

  | Uç | Ne için | Belge |
  |---|---|---|
  | `POST /api/school/class`, `GET /api/school/classes`, `POST /api/school/class-delete`, `POST /api/school/class-assign`, `GET /api/school/students` | sınıflar ve yerleştirme | [../sunucu/bolumler/okul.md](../sunucu/bolumler/okul.md) |
  | `GET /api/school/lessons`, `POST /api/school/lesson`, `POST /api/school/lesson-update` | dersler ve öğretmen atama | [../sunucu/bolumler/okul.md](../sunucu/bolumler/okul.md) |
  | `GET /api/school/schedule`, `POST /api/school/schedule-add`, `schedule-update`, `schedule-delete` | haftalık program | [../sunucu/bolumler/okul.md](../sunucu/bolumler/okul.md) |
  | `GET /api/teacher/schedule` | öğretmenin programı ve kendi çakışmaları | [../sunucu/bolumler/ogretmen.md](../sunucu/bolumler/ogretmen.md) |
  | `GET /api/myschedule` | öğrencinin sınıf programı | [../sunucu/bolumler/ilerleyis.md](../sunucu/bolumler/ilerleyis.md) |
  | `GET /api/challenge`, `POST /api/login`, `POST /api/login/dogrula` | girişler | [../sunucu/bolumler/kayit.md](../sunucu/bolumler/kayit.md) |

- **Koruduğu kod:** `sunucu/bolumler/okul.js` — `sinifAdiDuzelt`, sınıf / ders / program uçları ve `yetkiGerek` kapıları
  (`sinif.yonet`, `ogrenci.yerlestir`, `ders.yonet`, `ders.ogretmen-ata`, `program.duzenle`); `sunucu/iliskiler.js` —
  `GUN_SAYISI` (7), `saatDuzelt`, `aralikCakismasi` (uyarı, `ogretmen`/`sinif` türü), `cakismalariBul` (okulun çakışma
  listesi); `sunucu/bolumler/ogretmen.js` — kendi programında kesişen saatlerin `cakisma` işareti; `sunucu/bolumler/ilerleyis.js`
  — `myschedule`; depo [../sunucu/veri/depo/siniflar.md](../sunucu/veri/depo/siniflar.md) (`dersVarMi`, `programEkle`,
  `aralikKesisenler`, `cakismalar`, sıralı `sinifinProgrami`, sınıf silinince ders ve programı da silen yabancı anahtar
  zinciri); ders listesi `SUBJECTS` ([../sunucu/ortak.md](../sunucu/ortak.md)).
- **Tablolar:** `siniflar`, `dersler`, `ders_programi`, `kullanicilar` (öğrencinin sınıfı), `bildirimler` (yerleştirme ve
  "dersi sana atandı" bildirimleri), `hatirlatmalar` (program bildiriminin günde bir gitmesi)
  ([../sunucu/veri/sema/SEMA.md](../sunucu/veri/sema/SEMA.md)).
- **Ön yüz** (bu pakette tarayıcı yok): [../public/js/parcalar/20-siniflar.md](../public/js/parcalar/20-siniflar.md),
  [../public/js/parcalar/21-ders-programi.md](../public/js/parcalar/21-ders-programi.md),
  [../public/js/parcalar/22-programim.md](../public/js/parcalar/22-programim.md) (öğretmenin ve öğrencinin programı),
  [../public/js/parcalar/25-tiklama.md](../public/js/parcalar/25-tiklama.md).
- **Onu çalıştıran:** `testler/tumtest.sh`, sunuculu döngünün ikinci paketi (`test-yonetim`'den sonra, `test-rol`'den önce);
  her paketten önce veritabanı sıfırlanır ve [seed.md](seed.md) çalışır.

## Nasıl çalışır (adım adım)?

```
müdür girer
1)  7-A, 7-B ; "7-a" 400 ; "" 400
2)  ogrenci2 ─► 7-A , ogrenci1 ─► 7-B ; sınıfsız 0 ; 7 gün
3)  Matematik 7-A ve 7-B ; tekrar 400 ; "Simya" 400
4)  iki ders ─► Ayşe Kaya ; 'u_yok' 400
5)  7-A Pzt 09:20-10:00 (çakışma yok) ; 7-A Paz 11:00-11:40
6)  25:00 / ters aralık / gün 9 / başka sınıfın dersi ─► 400
7)  7-B Pzt 09:40-10:20 ─► uyarı: ogretmen ; çakışma listesi 1
8)  7-A Çar 08:00-09:00 + 09:00-10:00 ─► uyarı yok
9)  Paz kaydı 13:00-13:45 ─► sil ─► program sıralı
10) mat: /teacher/schedule ─► 7-A + 7-B, çakışma işaretli
11) ogrenci1: /myschedule ─► 7-B, en az bir saat
12) öğrenci sınıf açamaz, öğretmen programa ekleyemez
13) 7-B sil ─► ogrenci1 sınıfsız ; öğretmende 7-A kaldı ; çakışma yok
```

## Dikkat!

- **Taze veritabanı ister.** 7-A silinmeden kalır (7-B 13. bölümde silinir). 3 Ekim'de 3200'de aynı veritabanında ikinci kez
  çalıştırıldı (denetimde bir kez daha denendi, sonuç aynı): ilk denetim ("7-A olusturuldu") `Bu adda bir sınıf zaten var` ile
  kaldı, 1. bölümün öbür üç denetimi geçti (7-B yeniden açıldı), sonra paket 23. satırda `TEST HATASI: … reading 'id'` ile
  durdu (`s1.body.class` yok). `tumtest.sh` gibi her koşudan önce sıfırla.
- **Seed'e sıkı bağlı:** öğretmen "Ayşe" adıyla aranır (bulunamazsa 4. bölümde `mat.id` hata atar); okulda tam iki öğrenci ve
  hiç program satırı olmadığı varsayılır (5. bölümdeki "çakışma yok" okulun BÜTÜN çakışma listesine bakar; 2. ve 13. bölümdeki
  `sinifsiz` sayıları iki öğrenciye göredir). Seed'e öğrenci ya da ders saati eklenirse bu denetimler kalır.
- **Hangi öğrenci nerede:** "o1" adı yanıltıcıdır; ad sırası yüzünden 7-A'ya `ogrenci2`, 7-B'ye `ogrenci1` gider. 3 Ekim'de paket
  bittikten sonra bakıldı: `ogrenci2` 7-A'da, `ogrenci1` sınıfsız ve onun `/api/myschedule`'ı `className: ''`, sıfır saat.
- **Saat sırası metin karşılaştırmasıyla** denetlenir (`c[i].start < c[i - 1].start`); saatler hep iki haneli `SS:DD` olduğu için
  doğru çalışır.
- **Uyarı engellemez:** 7. bölümdeki çakışan saat programa yine eklenir; 10. bölümdeki `cakisma` işareti ve 13. bölümdeki
  temizlik buna dayanır.
- **Denenmeyenler:** `lesson-delete`, `schedule-update` ile gün ya da ders değiştirme, "Bir ders 8 saatten uzun olamaz",
  aynı sınıfta kesişen saat (`tur: 'sinif'` uyarısı), `GET /api/school/cakismalar`, haftalık saatin 0–20'ye kırpılması, 200
  sınıf sınırı, öğretmene giden "dersi sana atandı" ve "Ders programına yeni ders saatlerin eklendi" bildirimleri, rol
  kapsamıyla sınırlı yetkili (bkz. [test-kapsam.md](test-kapsam.md)).
- **Varsayılan adres 3000.** `EE_BASE` vermezsen istekler kendi sunucuna gider: orada bu hesaplar varsa okulun ad sırasıyla ilk
  iki öğrencisi 7-A ve 7-B'ye taşınır, 7-B silinir. Kodlar `EE_LOG`'dan okunur ([giris.md](giris.md)).

## Testleri

- Bu dosyanın kendisi testtir; `testler/tumtest.sh` her tam koşuda çalıştırır. Programı başka yönlerden kullananlar:
  [test-kapsam.md](test-kapsam.md) (sınıf kapsamlı rol), [test-egitim-yili.md](test-egitim-yili.md) (programın yıla
  damgalanması), [test-bildirim.md](test-bildirim.md), [test-nakil.md](test-nakil.md), `testler/test-takvim.js`,
  `testler/test-siniflarim.js` (`/api/teacher/schedule`), `testler/test-yonetim.js` ve [test-okul-agi.md](test-okul-agi.md)
  (`/api/myschedule`), [yetki-denetimi.md](yetki-denetimi.md) (yalnız sınıf açma, sınıf listesi ve sınıfa yerleştirme uçları
  her rolle; `schedule…` ve `lesson…` uçları orada yok, 3 Ekim'de `grep` ile bakıldı).
- Elle (Git Bash, proje kökünde; 3200'de sıfırlanmış `egitimevi_test` ile açılmış ve [seed.md](seed.md) ile tohumlanmış test
  sunucusu varken):

  ```
  EE_BASE=http://localhost:3200 EE_LOG=testler/test-sunucu.log node testler/test-program.js
  ```

- 3 Ekim'de bu belge için 3200'de, yeni sıfırlanmış test veritabanı ve seed'le iki ayrı sunucu açılışında çalıştırıldı: ikisinde
  de `GECTI: 43   KALDI: 0`, çıkış 0, 1 saniyeden az; sunucu günlüğünde `API hatası` ya da `Veritabanı hatası` yok. İkinci
  açılışta aynı veritabanında yapılan ikinci koşunun sonucu "Dikkat!"te.

## Son durum

- `git log`: 2 commit, ikisi de proje başında.
  - `514c247 commit 63` (2026-08-29): dosya 8 satırla başladı — `require('./giris')` ve `kontrol`.
  - `043e648 commit 64` (2026-08-29): asıl gövde (145 satır) eklendi: on üç bölümün hepsi. Dosya o günden beri değişmedi;
    denediği kod (`okul.js`, `iliskiler.js`, `ogretmen.js`) sonradan 7 commit'te değişti (`git log` ile sayıldı), ama cevap
    biçimleri aynı kaldığı için paket bugünkü kodla da geçiyor (3 Ekim).
- Bilinen açıklar (kod değiştirilmedi): taze veritabanı şartı, seed'e sıkı bağlılık, yanıltıcı `o1`/`o2` adları.
- Planlı işlerden bu dosyayı etkileyecekler:
  - **"ÖZEL BRANŞ / DERS"** (kod Linux'ta) — okul kendi dersini açabilecek; 3. bölümdeki "listede olmayan ders reddedildi"
    ("Simya") beklentisi okulun ders listesine göre yeniden yazılmalı.
  - **"Çalışan olarak ekleme"** — kişi koduyla eklenen öğretmen rolsüz çalışan olarak gelecek; seed ona Öğretmen rolü vermezse
    4. bölümde öğretmen listesinde "Ayşe" bulunmaz ve paket durur.
  - **"Güvenlik denetimi"** (okulun verdiği her şifrede ilk girişte değiştirme) — seed `ogrenci1`'i şifre vererek açtığı için
    bugün şifre değiştirmeden girer; bu iş gelince 11. bölümdeki `/api/myschedule` isteği `api.js`'teki `sifreDegismeli`
    kapısına takılır (403), giriş yardımcısı ya da seed önce şifreyi değiştirmeli.
