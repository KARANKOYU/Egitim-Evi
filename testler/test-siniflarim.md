# testler/test-siniflarim.js

Öğretmenin "Sınıflarım" bölümünü (yalnız ders verdiği sınıflar ve öğrencileri, öğrencinin ödev ve sınav sonuçları, yetki
rolden kapatılınca 403), öğrencinin ödev serisini ve ders programından alınan yoklamanın veliye "Çocuğunuz … saat …
dersine gelmedi" diye gitmesini deneyen sunuculu test paketi (17 denetim).

## Bu dosya ne yapar?

Üç ayrı özelliği tek pakette, kendi kurduğu küçük bir sınıf üzerinde dener:

1. **Sınıflarım** (`/api/teacher/siniflarim`, `/sinif`, `/ogrenci`): öğretmen yalnız dersine girdiği sınıfları görür;
   sınıfın öğrenci listesini açar; bir öğrenciye tıklayınca ona verdiği ödevleri (sonuçlarıyla) ve öğrencinin sınav
   sonuçlarını görür. Dersine girmediği sınıfa ve öğrenciye bakamaz; öğrenci bu bölüme hiç giremez. Bölüm hazır Öğretmen
   rolündeki "Girdiği sınıfların öğrenci sonuçlarını görür" (`ogretmen.sonuclar`) yetkisine bağlıdır; müdür bu yetkiyi
   rolden kaldırınca bölüm 403 olur.
2. **Ödev serisi** (öğrenciyi teşvik için): sonuçlanan ödevlerinde arka arkaya kaç kez "Yaptı" aldığı. Tek bir kaçırma
   (geç, eksik, yapmadı) seriyi bozmaz, uyarı verir; arka arkaya ikinci kaçırma seriyi sıfırlar. Seri yalnız öğrencinin
   kendisine gösterilir, velisine bile gitmez.
3. **Ders programından yoklama:** öğretmen yoklamayı dersin saatiyle kaydedince veliye giden bildirim dersi ve saati söyler
   ("Çocuğunuz Seri Deneme bugün saat 09:20 Matematik dersine gelmedi (izinsiz)"); durum "izinli"ye çevrilince yeni
   bildirim de ona göre olur. Öğretmenin programındaki her hücre ders kimliğini taşımalı ki programdaki "Yoklama al" düğmesi
   doğru derse gitsin.

## İçinde neler var?

### Yardımcılar

- `kontrol(ad, sart, detay)` — `GECTI` / `KALDI` satırı, sayaçlar.
- `J(x)` — JSON'un ilk 220 karakteri.
- `gun(n)` — bugünden `n` gün sonrası, `YYYY-AA-GG`; `toISOString()` ile kurulduğu için UTC takvim günü.
- `z` — `Date.now().toString(36)`, bu koşuya özgü ek (sınıf ve kullanıcı adlarında).

Ortak yardımcılar [giris.md](giris.md) üzerinden ([../araclar/giris.md](../araclar/giris.md)): `iste`, `girisYap`, `hesapAc`,
`tcUret`.

### Hesaplar ve hazırlık

Seed'den ([seed.md](seed.md)): müdür `mudur@test.com` (`M`), Matematik öğretmeni `mat@test.com` (Ayşe Kaya), Fen öğretmeni
`fen@test.com`; şifreler `Test1234!`.

Paket kendi kurar:

- İki sınıf: `SNF-<z>` (Matematik dersi haftada 4 saat, Ayşe Kaya'ya atanır) ve `BASKA-<z>` (dersi yok).
- Öğrenci "Seri Deneme" (`seri<z>`, `SNF-<z>`'de; `POST /api/school/hesap-ac` ile, T.C. `tcUret()`); bir kez girer, aydınlatma
  metni eskiyse `POST /api/kvkk-onay`.
- Veli "Seri Veli" (`sveli<z>`, `sveli<z>@test.com`; `hesapAc` ile kayıt + onay), öğrencinin veli koduyla
  (`POST /api/parent/link`) bağlanır.

### 1) Sınıflarım (6)

- Matematik öğretmeni `GET /api/teacher/siniflarim` → 200; listede `SNF-<z>` var ve `dersler`'inde "Matematik";
  `BASKA-<z>` yok.
- `GET /api/teacher/sinif?id=<SNF>` → `ogrenciler` içinde öğrenci; `?id=<BASKA>` → 403.
- Fen öğretmeni `GET /api/teacher/ogrenci?id=<öğrenci>` → 403 (öğrencinin sınıfına dersi yok).
- Öğrenci `GET /api/teacher/siniflarim` → 403.

### 2) Ödev serisi (3)

Yedi ödev sırayla verilir (`Seri ödevi 1…7`, Matematik, yalnız bu öğrenciye; başlangıç `gun(-30 + 2i)`, son teslim
`gun(-29 + 2i)`) ve her biri hemen şu sonuçla sonuçlandırılır: yaptı, yaptı, yapmadı, yaptı, geç, yapmadı, yaptı. Her
adımdan sonra öğrenci `GET /api/progress` ile `seri`'ye bakar; beklenen:

| Adım | Sonuç | `sayi` | `uyari` | `bozuldu` |
|---|---|---|---|---|
| 1 | yaptı | 1 | hayır | hayır |
| 2 | yaptı | 2 | hayır | hayır |
| 3 | yapmadı | 2 | evet | hayır |
| 4 | yaptı | 3 | hayır | hayır |
| 5 | geç | 3 | evet | hayır |
| 6 | yapmadı | 0 | hayır | evet |
| 7 | yaptı | 1 | hayır | hayır |

- Yedi adımın hepsi tek denetimde toplanır; uymayan adım ayrıca ekrana yazılır (`N. adım (sonuç): … beklenen …`).
- Sonda `enUzun` 3.
- Veli `GET /api/progress?studentId=<öğrenci>` → 200 ama `seri` alanı hiç yok.

### 3) Öğrenci ayrıntısı (2)

- Matematik öğretmeni `GET /api/teacher/ogrenci?id=<öğrenci>` → `odevler` 7 tane, 4'ünün sonucu `yapti`.
- `POST /api/exams { name: 'Seri yazılısı', hazir: 'yazili', tarih: gun(-1) }`, öğrenciye `{ grades: { <öğrenci>: '87,5' } }`;
  yeniden açılan ayrıntıdaki `sinavlar`'da "Seri yazılısı"nın ölçümlerinden biri 87.5.

### 4) Yetki rolden kapatılınca (2)

- Müdür `GET /api/school/roles` → `tur: 'ogretmen'` olan hazır rolün `permissions`'ında `ogretmen.sonuclar` var.
- Müdür `POST /api/school/role-update { roleId, permissions: <ogretmen.sonuclar olmadan> }`; öğretmen yeniden girer,
  `GET /api/teacher/siniflarim` → 403. Ardından rolün eski yetkileri geri yazılır.

### 5) Ders programından yoklama (4)

- Öğretmen `POST /api/devamsizlik/yoklama { lessonId: <Matematik>, saat: '09:20', girisler: [{ ogrenciId, durum: 'yok' }] }`
  → 200.
- Veli `GET /api/notifications` → metinde tam olarak "Çocuğunuz Seri Deneme bugün saat 09:20 Matematik dersine gelmedi
  (izinsiz)".
- Aynı yoklama `durum: 'izinli'` ile → velinin bildirimlerinde "Matematik dersine gelmedi (izinli)".
- Öğretmen `GET /api/teacher/schedule` → 200 ve hücre listesi ya boş ya da her hücrede `lessonId` var.

Sonunda boş satır ve `  GECTI: 17   KALDI: 0`; `KALDI` varsa çıkış kodu 1. Beklenmeyen hata `TEST HATASI:` ile iletiyi ve
yığını yazar, çıkış kodu 1.

## Kimle konuşur?

- **Modüller:** yalnız [giris.md](giris.md) (`araclar/giris.js`); veritabanına doğrudan bağlanmaz.
- **Sunucu uçları:**

  | Uç | Ne için | Belge |
  |---|---|---|
  | `GET /api/teacher/siniflarim`, `GET /api/teacher/sinif`, `GET /api/teacher/ogrenci`, `GET /api/teacher/schedule` | Sınıflarım, öğretmenin programı | [../sunucu/bolumler/ogretmen.md](../sunucu/bolumler/ogretmen.md) |
  | `POST /api/school/class`, `GET /api/school/classes`, `POST /api/school/lesson`, `GET /api/school/schedule`, `GET /api/school/teacher-list`, `POST /api/school/lesson-update`, `GET /api/school/roles`, `POST /api/school/role-update` | hazırlık ve rol | [../sunucu/bolumler/okul.md](../sunucu/bolumler/okul.md) |
  | `POST /api/school/hesap-ac` | öğrenci hesabı | [../sunucu/bolumler/hesaplar.md](../sunucu/bolumler/hesaplar.md) |
  | `POST /api/parent/link` | veliyi bağlama | [../sunucu/bolumler/veli.md](../sunucu/bolumler/veli.md) |
  | `POST /api/assignments`, `POST /api/assignments/<id>/finish` | seri ödevleri | [../sunucu/bolumler/odev.md](../sunucu/bolumler/odev.md) |
  | `GET /api/progress` | seri | [../sunucu/bolumler/ilerleyis.md](../sunucu/bolumler/ilerleyis.md) |
  | `POST /api/exams`, `POST /api/exams/<id>/grades` | yazılı notu | [../sunucu/bolumler/sinav.md](../sunucu/bolumler/sinav.md) |
  | `POST /api/devamsizlik/yoklama` | yoklama | [../sunucu/bolumler/devamsizlik.md](../sunucu/bolumler/devamsizlik.md) |
  | `GET /api/notifications`, `POST /api/kvkk-onay`, `POST /api/register`, `POST /api/eposta-onay`, giriş uçları | bildirim, hesap | [../sunucu/bolumler/kayit.md](../sunucu/bolumler/kayit.md) |

- **Koruduğu kod:**
  - [../sunucu/bolumler/ogretmen.md](../sunucu/bolumler/ogretmen.md) — `girdigiSiniflar` (öğretmenin dersleri → sınıflar),
    `siniflarimUclari` (önce `isTeacherLike`, sonra `ogretmen.sonuclar` yetkisi; sınıf ve öğrenci için "dersin var mı"
    denetimi; öğrenci ayrıntısında ödevler, sınav grupları ve grupsuz sınavlar), programdaki `lessonId`.
  - [../sunucu/bolumler/ilerleyis.md](../sunucu/bolumler/ilerleyis.md) — `odevSerisi` (sıra son teslim anına göre;
    `sayi`, `enUzun`, `uyari: kacan === 1 && sayi > 0`, `bozuldu: kacan >= 2`) ve serinin yalnız öğrencinin kendisine
    eklenmesi (`kendisi`).
  - [../sunucu/bolumler/devamsizlik.md](../sunucu/bolumler/devamsizlik.md) — `yoklamaMetni` (`VELI_DURUM`: `yok` → "gelmedi
    (izinsiz)", `izinli` → "gelmedi (izinli)", `gec` → "geç geldi"; bugünse "bugün"), `devamsizlikBildir` (veliye kendi
    metni), yalnız durumu değişen öğrenciye yeniden bildirim.
  - [../sunucu/yetki.md](../sunucu/yetki.md) — `OGRETMEN_VARSAYILAN` (`ogretmen.sonuclar` hazır Öğretmen rolünde açık gelir),
    `yetkiVarMi`.
- **Tablolar** (uçlar üzerinden): `siniflar`, `dersler`, `ders_programi`, `kullanicilar`, `veli_baglari`, `odevler`,
  `odev_ogrencileri`, `sinav_*` tabloları, `roller`, `devamsizlik`, `bildirimler`.
- **Ön yüz** (bu pakette tarayıcı yok): Sınıflarım ekranı [../public/js/parcalar/11b-siniflarim.md](../public/js/parcalar/11b-siniflarim.md);
  seri şeridi [../public/js/parcalar/14-odev-filtre.md](../public/js/parcalar/14-odev-filtre.md) (ana sayfada
  [../public/js/parcalar/08-ana-sayfa.md](../public/js/parcalar/08-ana-sayfa.md)); programdaki "Yoklama al" düğmesi
  [../public/js/parcalar/22-programim.md](../public/js/parcalar/22-programim.md); yoklama ekranı
  [../public/js/parcalar/18-devamsizlik.md](../public/js/parcalar/18-devamsizlik.md).
- **Onu çalıştıran:** `testler/tumtest.sh`, sunuculu döngüde (`test-hatirlatici`'dan sonra, `test-aile`'den önce).

## Nasıl çalışır (adım adım)?

```
M, mat, fen girer
hazırlık: SNF-z (+Matematik, Ayşe Kaya'ya) ve BASKA-z ; öğrenci seri<z> (SNF-z) ; veli sveli<z> ─► parent/link
1) mat: siniflarim (SNF var, BASKA yok) ─► sinif SNF (öğrenci var) ─► sinif BASKA 403
   fen: ogrenci 403 ; öğrenci: siniflarim 403
2) i = 1..7: assignments(Seri ödevi i) ─► finish(sonuç i) ─► öğrenci /progress ─► seri beklenenle aynı mı?
   enUzun 3 ; veli /progress ─► seri yok
3) mat: teacher/ogrenci ─► 7 ödev, 4 yaptı ; exams "Seri yazılısı" ─► grades 87,5 ─► ayrıntıda 87.5
4) M: roles ─► hazır rolde ogretmen.sonuclar ─► role-update (kaldır) ─► mat yeniden girer ─► 403 ─► role-update (geri)
5) mat: yoklama 09:20 'yok' ─► veli bildirimi "… saat 09:20 Matematik dersine gelmedi (izinsiz)"
        yoklama 'izinli' ─► "… gelmedi (izinli)" ; teacher/schedule ─► hücrelerde lessonId
```

## Dikkat!

- **Son denetim bugün boşuna geçiyor.** Paket ders programına hiç saat (`schedule-add`) koymuyor, seed de koymuyor; bu
  yüzden `GET /api/teacher/schedule`'ın hücre listesi boş gelir ve "her hücrede `lessonId` var" koşulu hiçbir şey
  denetlemeden doğru olur (bu belge için 3 Ekim'de 3200'de paketten sonra bakıldı: 0 hücre, 2 ders). Denetimin anlamlı
  olması için önce `POST /api/school/schedule-add` ile bir saat eklenmeli (kod değiştirilmedi).
- **Seri adımları tek denetimde.** Yedi adımdan biri bile şaşarsa tek bir `KALDI` görürsün; hangi adım olduğu üstteki
  `N. adım (…)` satırlarında yazar.
- **Seri sırası son teslim anına göre.** Ödevler `gun()` ile UTC takvim günü olarak verilir, sunucu son teslim anını
  (saat gönderilmediği için varsayılan 12:00) kendi yerel saatiyle kurar (`odevBitisAni`); aralar iki gün olduğu için sıra
  kaymaz.
- **"Bugün" sunucunun yerel günü.** Yoklama `tarih` göndermeden kaydedilir; sunucu kendi yerel gününü alır, metne de bu
  yüzden "bugün" yazar. Paket tarihli bir yoklamanın ("03.10.2026 saat …") metnini denemez.
- **Veli bildirimi yalnız durumu değişene gider.** İkinci yoklama `izinli` olduğu için yeni bildirim üretir; aynı durumla
  yeniden kaydetmek bildirim üretmez. Paket bu ikinci kuralı denemez.
- **4. bölümde öğretmen yeniden girer.** Yetki kapatıldıktan sonra yeni bir `girisYap` ile alınan oturumla denenir; eski
  oturumun aynı istekte ne aldığı denenmez. Yetkiler sonunda geri yazılır; paket o adıma varmadan durursa hazır Öğretmen
  rolü `ogretmen.sonuclar`'sız kalır (veritabanı her pakette sıfırlandığı için `tumtest.sh`'te sorun olmaz).
- **Sınıflarım önce `isTeacherLike`'a bakar.** Öğrencinin 403'ü "Bu bölüm öğretmenler içindir"den gelir, yetkiden değil.
  Müdür de `isTeacherLike` sayılır ve listesi yalnız kendi girdiği derslerin sınıflarından kurulur (`girdigiSiniflar`);
  paket müdürü denemez.
- **Paket iz bırakır:** iki sınıf, bir öğrenci, bir veli, yedi sonuçlandırılmış ödev, bir yazılı ve "Yazılı (0-100)" hazır
  şablonu (yoksa açılır), bir devamsızlık kaydı (ikinci yoklama aynı ders ve günün kaydını silip yeniden yazar). `z` eki
  sayesinde aynı veritabanında ikinci koşunun adları çakışmaz (denenmedi).
- **Seed'e bağlı:** müdür, iki öğretmen ve "Ayşe Kaya" adı (öğretmen listesinden rol satırını bulmak için).
- **Varsayılan adres 3000.** `EE_BASE` vermezsen istekler kendi sunucuna gider (sınıf, öğrenci, veli hesabı açar, rolün
  yetkisini değiştirir). Her zaman test sunucusunu kullan.

## Testleri

- Bu dosyanın kendisi testtir; `testler/tumtest.sh` her tam koşuda çalıştırır.
- Aynı alanda: [test-devamsizlik.md](test-devamsizlik.md) (yoklama ve devamsızlık kuralları), [test-bildirim.md](test-bildirim.md)
  (yoklama ve ödev bildirimleri), [test-sinav.md](test-sinav.md) (sınav ve ilerleyiş), [test-rol.md](test-rol.md) ve
  [test-kapsam.md](test-kapsam.md) (rol yetkileri ve ders/sınıf kapsamı), [test-program.md](test-program.md) (ders programı).
- Elle (Git Bash, proje kökünde; 3200'de [seed.md](seed.md) ile tohumlanmış test sunucusu varken):

  ```
  EE_BASE=http://localhost:3200 EE_LOG=testler/test-sunucu.log node testler/test-siniflarim.js
  ```

- 3 Ekim 2026'da bu belge için 3200'de, sıfırlanmış `egitimevi_test` ve seed'le koşuldu: `GECTI: 17   KALDI: 0`, yaklaşık
  1,6 saniye; sunucu günlüğünde `API hatası` / `Veritabanı hatası` yoktu. Belge denetiminde aynı gün yeniden koşuldu:
  sonuç aynı; paketten sonra öğretmenin programında yine 0 hücre, 2 ders vardı.

## Son durum

- `git log`: tek commit. Dosya `cbc1c88 commit 449` (2026-09-26) ile 118 satır olarak eklendi; aynı commit
  `public/css/parcalar/22-cesitli.css`'e Sınıflarım ekranının kart, öğrenci listesi ve ayrıntı stillerini (`.snf-kartlar`,
  `.snf-kart`, `.snf-ogrenci`, `.snf-sinav` …) getirdi. O günden beri değişmedi.
- Açık iş yok; kod değiştirilmedi. Boşuna geçen son denetim "Dikkat!"te.
- Planlı işlerden bu dosyayı etkileyecekler:
  - **"Devamsızlık: tarih aralığı + gün gün / ders ders + filtre"** (kod Linux'ta) — yoklama ve gün durumu kuralları
    değişecek; 5. bölümdeki veli metni korunmalı ya da güncellenmeli.
  - **"Özel roller: yeni yetkiler + yeni hazır şablonlar"** (öneri) — hazır Öğretmen rolünün yetkileri ve rol düzenleme
    değişebilir; 4. bölüm `tur: 'ogretmen'` rolüne dayanıyor.
  - **"Çalışan olarak ekleme"** — öğretmenin okula ekleniş yolu değişir (seed'in öğretmenleri); **"Özel branş / ders"** —
    "Matematik" dersinin okulun kendi listesinden gelmesi.
  - **"T.C. kimlik no bütün hesaplarda zorunlu"** — hazırlıktaki veli kaydı (`hesapAc`) T.C. göndermiyor; o iş gelince
    gövdeye geçerli bir T.C. eklenmeli.
