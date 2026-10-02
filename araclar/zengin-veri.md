# araclar/zengin-veri.js

Ekran görüntüleri gerçekçi görünsün diye `testler/seed.js`'in kurduğu "Test Ortaokulu"nu gerçek uçlardan doldurur: üç sınıf
(7-A, 7-B, 8-A), dört öğrenci daha, dersler ve haftalık program, iki özel rol, ödevler ve sonuçları, yazılılar, beş LGS denemesi
ve bir test, mesaj ve duyurular, yoklamalar, takvim ve henüz portalı olmayan iki yetişkin hesabı.

## Bu dosya ne yapar?

Ekran turu ([gezinti.md](gezinti.md)) her rolün ekranlarını gerçek tarayıcıda gezip fotoğraflar. Boş listeler, tek noktalı
grafikler ve tek tür sonuç gösteren tablolar kılavuzda hiçbir şey anlatmaz; fotoğrafların bir okulun gerçekten kullanıldığı
izlenimini vermesi gerekir. Veri üç katmanda kurulur:

1. `testler/seed.js` — temel okul ("Test Ortaokulu"), müdür Mehmet Demir, Matematik öğretmeni Ayşe Kaya, Fen öğretmeni Ali
   Yıldız, öğrenciler Zeynep Şahin ve Burak Öztürk, 6-A sınıfı, beş ödev.
2. **Bu dosya** — o okulu doldurur: sınıflar, program, ödevler, sınavlar, roller, mesajlar, yoklama, takvim ve iki "yeni
   yetişkin" hesabı.
3. [gorsel-veri.md](gorsel-veri.md) — çok rollü hesaplar ve zamana bağlı, "canlı" durumlar.

Her şey gerçek bir kullanıcının yapacağı gibi, gerçek uçlardan ve o kişinin kendi oturumuyla yapılır: sınıfı müdür açar, ödevi
öğretmen verir, ödevi öğrenci açar. Veritabanına doğrudan yazılan hiçbir şey yoktur.

Bıraktığı veriye sonradan başka dosyalar dayanır: [gorsel-veri.md](gorsel-veri.md) 7-A sınıfını, Zeynep'in sınıfını ve "Geometri…"
ödevini kullanır; [gezinti.md](gezinti.md) portalı olmayan yetişkin olarak Kemal Arslan'la girer, yöneticinin "Okul aç"
penceresine Hülya Demirtaş'ın kişi kodunu yazar, "Kesirler alıştırması"nın altı sonuç türünü, "LGS Deneme 5"i ve "Üslü Sayılar
Testi"ni açar. Testler bu dosyayı kullanmaz; yalnız ekran turu işinde elle çalıştırılır.

## İçinde neler var?

Dosya tek bir adsız `async` işlevdir; yüklenince çalışır, hiçbir şey dışa açmaz (`module.exports` yok). Hata olursa
`HATA: <ileti>` yazar ve 1 koduyla çıkar. Bitince tek satır yazar:

```
zengin veri hazir: 3 sinif, 46 ders saati, 4 ödev, 5 LGS denemesi, 5 yoklama
```

(3 Ekim'deki çalıştırmanın satırı. Sayılar yalnız başarıyla eklenen ders saatlerini, açılan ödevleri, kaydedilen LGS
denemelerini ve yoklamaları sayar; "3 sinif" ise sabit listenin uzunluğudur.)

### İçindeki küçük yardımcılar

- `gun(n)` — bugünden `n` gün sonrası (`YYYY-AA-GG`; yerel tarihe gün eklenir ama metin `toISOString` ile, yani UTC'den alınır).
- `virgul(n)` — sayıyı en çok 3 ondalıkla, nokta yerine virgülle yazar (`490,161`): öğretmenin ekranda yazacağı biçim.
- `net(u, fark)` — LGS bölümünün içinde: üst sınırı `u` olan bir net değeri, öğrenciye ve denemeye göre değişen. Kod `-3` ile `u`
  arasına sıkıştırır, ama formül (`u × 0,45` + `u × 0,5`'ten küçük bir kalan) her zaman `u`'nun %45'i ile %95'i arasında bir
  değer verir; eksi net hiç çıkmaz.

### Bölümler (sırasıyla)

| # | Kim | Ne yapar | Uçlar |
|---|---|---|---|
| 1 | müdür (`mudur@test.com`) | girer; 7-A, 7-B, 8-A sınıflarını açar | `POST /api/school/class` |
| 2 | müdür | okulun öğrencilerini (seed'in ikisi) sırayla üç sınıfa dağıtır | `GET /api/school/students`, `POST /api/school/class-assign` |
| 3 | müdür | dört öğrenci hesabı açar: Deniz Kara (7-A), Elif Şahin (7-A), Mert Aydın (7-B), Sıla Yıldırım (8-A); kullanıcı adlı, e-postasız, rastgele geçerli T.C. (`tcUret`), dosyada yazılı ortak bir şifre, not "Kardeşi de okulumuzda." | `POST /api/school/hesap-ac` |
| 4 | müdür | ders planı: 7-A'da Matematik 5, Türkçe 6, Fen Bilimleri 4, İngilizce 4, Sosyal Bilgiler 3 saat; 7-B'de Matematik, Türkçe, Fen; 8-A'da Matematik, İngilizce, Müzik. `i`'nci derse listedeki `i % n`'inci "öğretmen" atanır | `GET /api/school/lessons`, `POST /api/school/lesson`, `POST /api/school/lesson-update` |
| 5 | müdür | haftalık program: her sınıf için gün gün ders sırası (`plan`) ve sınıfa özgü saat dilimleri (`saatDilimi`) | `POST /api/school/schedule-add` |
| 6 | müdür | iki özel rol: "Müdür Yardımcısı" (`sinif.yonet`, `program.duzenle`, `ogrenci.yerlestir`, `ders.yonet`, `devamsizlik.gor`) Ali Yıldız'a verilir (öğretmen listesinde ADIYLA bulunur: müdür öğretmenlerin e-postasını görmez); "Rehber Öğretmen" (`ogrenci.portal`, `devamsizlik.gor`, `mesaj.toplu`) kimseye verilmez | `POST /api/school/role`, `GET /api/school/teachers`, `POST /api/school/role-assign` |
| 7 | Ayşe Kaya (`mat@test.com`) | dört ödev ("Kesirler alıştırması" 10 gün önce → 3 gün önce, "Üslü sayılar testi", "Geometri problemleri", "Denklem çalışması" ileri tarihli) hedeflerindeki bütün öğrencilere; ilkini sonuçlandırır | `GET /api/assignments/hedefler`, `POST /api/assignments`, `GET /api/assignments/<id>`, `POST …/finish` |
| 8 | Ayşe Kaya | "Dönem 1 - Yazılılar" grubu, içinde "1. Yazılı" ve "2. Yazılı" (ağırlık 50/50); 1. Yazılı'ya notlar (85, 72, 91, 64, 78, 88 sırayla) | `POST /api/examgroups`, `POST /api/exams`, `GET /api/exams/<id>`, `POST …/grades` (`grades`) |
| 9 | müdür | "kasıtlı tek çakışma": 8-A'nın Matematik dersini Cuma 09:20–10:00'a da yazar | `GET /api/school/schedule`, `POST /api/school/schedule-add` |
| 10 | Ayşe Kaya | hazır şablonlar (LGS, Yazılı, Test) + kendi şablonu "Kazanım Testi (20 soru)" (Doğru, Yanlış, Boş, Puan); LGS şablonundan beş deneme (100, 72, 44, 16 ve 2 gün önce): her öğrencide farklı gidişat (kimi yükselir, kimi düşer), 4. denemeye bir öğrenci girmez; "Test" şablonundan "Üslü Sayılar Testi" (6 gün önce, D / Y / N); dönem grubunun 2. yazılısına virgüllü notlar | `POST /api/exams/sablonlar`, `POST /api/exams` (`templateId`, `tarih`), `GET /api/exams/<id>`, `POST …/grades` (`degerler`), `GET /api/examgroups`, `GET /api/examgroups/<id>` |
| 11 | Ayşe Kaya | "Kesirler alıştırması"nı altı sonuç türüyle (yaptı, geç, eksik, yapmadı, izinli, gelmedi) yeniden sonuçlandırır | `GET /api/assignments`, `GET …/<id>`, `POST …/finish` |
| 12 | dört öğrenci hesabı (ikisi giremez, bkz. "Dikkat!") | girer, aydınlatma metnini onaylar, aktif ödevlerin bir kısmını "açar" (Zeynep "Denklem çalışması" ve "Geometri problemleri"ni açmaz; ayrıca `(i + j) % 3 === 2` olanlar açılmaz); Zeynep listesindeki ilk öğretmene "Geometri ödevi hakkında" mesajı yazar | `POST /api/kvkk-onay`, `GET /api/progress`, `POST /api/assignments/<id>/acildi`, `GET /api/mesajlar/hedefler`, `POST /api/mesajlar` |
| 13 | müdür, Ayşe Kaya | iki duyuru: "Veli toplantısı 3 Ekim Cuma" (bütün okul), "LGS deneme sınavı takvimi" (8-A ve 7-A); öğretmenden ilk sınıfına "Kesirler ödevi sonuçlandı" | `POST /api/mesajlar`, `GET /api/mesajlar/hedefler` |
| 14 | Ayşe Kaya | ilk iki dersinde bugün ve 1, 2, 5, 8 gün önce yoklama: dörtte bire yakını yok / geç / izinli ("Doktor raporu"), kalanı var | `GET /api/devamsizlik/derslerim`, `GET` ve `POST /api/devamsizlik/yoklama` |
| 15 | müdür | okul takvimi: veli toplantısı (3 gün sonra), ara tatil (10–12 gün sonra), LGS deneme sınavı (6 gün sonra), bilim fuarı (4 gün önce) | `POST /api/takvim/etkinlik` |
| 16 | (kayıt) | portalı olmayan iki yetişkin: Kemal Arslan (kaydolmuş, henüz hiçbir okula eklenmemiş; müdür "Kodla ekle"de onun kişi kodunu girsin diye) ve Hülya Demirtaş (okulunu açtırmak isteyen; kişi kodunu yöneticiye verir, yönetici "Okul aç"ta onu müdür yapar) | `hesapAc` → `/api/challenge`, `/api/register`, `/api/eposta-onay` |

Bütün kişiler ve okullar uydurmadır (test verisi); şifreler test değerleridir ve dosyada yazılıdır, burada tekrar edilmez.

## Kimle konuşur?

- **Çağırdıkları (`require`):** [giris.md](giris.md) → `iste` (JSON isteği; HTTP hatasında fırlatmaz), `girisYap` (iki adımlı
  giriş, kod sunucu günlüğünden), `hesapAc` (yetişkin kaydı + e-posta onayı), `tcUret`. `botCevabi` de alınır ama hiç kullanılmaz.
- **Ön koşul:** `testler/seed.js` aynı veritabanında çalışmış olmalı. Bu dosya onun hesaplarıyla girer (`mudur@test.com`,
  `mat@test.com`, `ogrenci1@test.com`, `ogrenci2@test.com`) ve Ali Yıldız'ı adıyla arar. Sunucu `EE_BASE`'te, çıktısı `EE_LOG`'daki
  dosyada olmalı ([giris.md](giris.md) "Çalıştırma ön koşulu").
- **Çağırdığı uçlar ve bölümleri:**

  | Uçlar | Bölüm |
  |---|---|
  | `/api/school/class`, `class-assign`, `students`, `teachers`, `lessons`, `lesson`, `lesson-update`, `schedule`, `schedule-add`, `role`, `role-assign` | [../sunucu/bolumler/okul.md](../sunucu/bolumler/okul.md) |
  | `/api/school/hesap-ac` (`okul.js` devreder) | [../sunucu/bolumler/hesaplar.md](../sunucu/bolumler/hesaplar.md) |
  | `/api/assignments`, `/hedefler`, `/<id>`, `/<id>/finish`, `/<id>/acildi` | [../sunucu/bolumler/odev.md](../sunucu/bolumler/odev.md) |
  | `/api/examgroups`, `/api/examgroups/<id>`, `/api/exams`, `/api/exams/<id>`, `/<id>/grades`, `/api/exams/sablonlar` | [../sunucu/bolumler/sinav.md](../sunucu/bolumler/sinav.md) |
  | `/api/kvkk-onay`; giriş ve kayıt (`giris.js` üzerinden) | [../sunucu/bolumler/kayit.md](../sunucu/bolumler/kayit.md) |
  | `/api/progress` | [../sunucu/bolumler/ilerleyis.md](../sunucu/bolumler/ilerleyis.md) |
  | `/api/mesajlar`, `/api/mesajlar/hedefler` | [../sunucu/bolumler/mesaj.md](../sunucu/bolumler/mesaj.md) |
  | `/api/devamsizlik/derslerim`, `/api/devamsizlik/yoklama` | [../sunucu/bolumler/devamsizlik.md](../sunucu/bolumler/devamsizlik.md) |
  | `/api/takvim/etkinlik` | [../sunucu/bolumler/takvim.md](../sunucu/bolumler/takvim.md) |

- **Bıraktığı veriyi kullananlar:** [gorsel-veri.md](gorsel-veri.md) (hemen ardından çalışır), [gezinti.md](gezinti.md) (tur),
  [gezinti-metin.md](gezinti-metin.md) (fotoğraf metinlerinde Kemal Arslan). Çalıştırma sırası [../belge/KILAVUZ.md](../belge/KILAVUZ.md)'nin
  ekran turu bölümünde de yazar. Belgelerde adı geçer: [giris.md](giris.md), [deneme-okulu.md](deneme-okulu.md),
  [../TANITIM.md](../TANITIM.md).

## Nasıl çalışır (adım adım)?

### Çalıştırma

Yalnız test sunucusuna karşı, yeni sıfırlanmış veride, şu sırayla (proje kökünden; sunucu `testler/tumtest.sh`'teki gibi
3200'de, çıktısı `testler/test-sunucu.log`'a yazılarak açık olmalı):

```
export EE_BASE=http://localhost:3200 EE_LOG=testler/test-sunucu.log
node testler/seed.js
node araclar/zengin-veri.js     # bu dosya
node araclar/gorsel-veri.js     # sonra ekran turu
```

### Akış

```
M = girisYap(müdür)
  sınıflar (3) → öğrencileri dağıt → 4 öğrenci hesabı → dersler + öğretmen ataması → program (46 saat) → 2 rol
MAT = girisYap(Ayşe Kaya)
  4 ödev → ilkini sonuçlandır → dönem grubu + 2 yazılı → 1. yazılıya not
M: 8-A Matematik'i Cuma 09:20'ye de yaz
MAT: şablonlar → 5 LGS denemesi + değerler → "Üslü Sayılar Testi" → 2. yazılıya not → Kesirler'i 6 türle yeniden sonuçlandır
öğrenciler (4 deneme, 2'si girebiliyor): onay → aktif ödevlerin bir kısmını aç → Zeynep'ten öğretmene mesaj
M: 2 duyuru;  MAT: sınıfa mesaj (yalnız sınıf hedefi varsa)
MAT: ilk 2 dersinde 5 günlük yoklama
M: 4 takvim etkinliği
kayıt: Kemal Arslan, Hülya Demirtaş
özet satırı
```

### 3 Ekim'de kurulan veri

Yeni sıfırlanmış test veritabanında `seed.js`'ten sonra çalıştırılıp sonuç veritabanından ve uçlardan okundu:

- **Sınıflar:** 7-A (Burak, Deniz, Elif), 7-B (Zeynep, Mert), 8-A (Sıla); seed'in 6-A'sı boş kalır.
- **Dersler ve öğretmenleri:**

  | Sınıf | Matematik | Türkçe | Fen Bilimleri | İngilizce | Sosyal Bilgiler | Müzik |
  |---|---|---|---|---|---|---|
  | 7-A | Ali Yıldız | Ayşe Kaya | Mehmet Demir (müdür) | Ali Yıldız | Ayşe Kaya | |
  | 7-B | Ali Yıldız | Ayşe Kaya | Mehmet Demir (müdür) | | | |
  | 8-A | Ali Yıldız | | | Ayşe Kaya | | Mehmet Demir (müdür) |

  (Neden böyle olduğu "Dikkat!"te.) Programda 47 saat: plandan 46'sı (özet satırındaki sayı) ve 9. bölümün kasıtlı eklediği
  1 saat (özete girmez); ders başına 2–6 saat (6 saat, kasıtlı saatle birlikte 8-A Matematik).
- **Programdaki öğretmen çakışmaları** (müdürün "Çakışmalar" listesi): 7 tane — Mehmet Demir Salı 11:00 (8-A Müzik ↔ 7-B Fen),
  Ali Yıldız Salı 13:20 (7-B ↔ 8-A Matematik), Ali Yıldız Çarşamba 11:00 (7-B ↔ 7-A Matematik), Ayşe Kaya Çarşamba 13:20 (7-A ↔ 7-B
  Türkçe), Ali Yıldız Cuma 09:20 (8-A Matematik ↔ 7-A İngilizce; "kasıtlı" olan), Ayşe Kaya Cuma 10:10 (7-B Türkçe ↔ 7-A Sosyal),
  Ali Yıldız Cuma 13:20 (7-B ↔ 8-A Matematik).
- **Ödevler:** bu dosyanın dört ödevi altı öğrenciye; "Kesirler alıştırması" altı sonuç türüyle sonuçlanmış. Seed'in aynı adlı üç
  ödevi (iki öğrenciye) de durur.
- **Sınavlar:** "1. Yazılı" ve "2. Yazılı" ("Yazılı (0-100)" şablonuyla, altışar not), "LGS Deneme 1–5" (7 ölçüm; 4'üncüde 5
  öğrenci), "Üslü Sayılar Testi" (3 ölçüm).
- **Roller:** Ali Yıldız "Müdür Yardımcısı"; "Rehber Öğretmen" kimsede değil.
- **Mesajlar:** Zeynep → Ali Yıldız "Geometri ödevi hakkında"; iki duyuru (8 ve 4 alıcı). Öğretmenin sınıf mesajı **yok**.
- **Yoklama:** 5 kayıt, hepsi 7-A Sosyal Bilgiler (3 devamsızlık satırı). **Takvim:** 4 etkinlik. **Yeni yetişkinler:** Kemal Arslan
  ve Hülya Demirtaş, rolsüz.

## Dikkat!

- **`EE_BASE` vermezsen istekler 3000'e gider.** Bu dosyanın kendi adres ayarı yok; [giris.md](giris.md)'deki `BASE`'i kullanır,
  o da `EE_BASE` verilmezse `http://localhost:3000`, yani kullanıcının kendi (gerçek veritabanlı) sunucusudur. `EE_LOG`
  verilmezse kodlar proje kökündeki `sunucu.log`'da aranır. [yuk-testi.md](yuk-testi.md)'deki gibi bir "yalnız `_test`"
  koruması da yoktur: araç hangi sunucuya bağlanırsa onun verisine yazar (orada `mudur@test.com` yoksa ilk girişte
  "giriş 1. adım: 401 …" ile durur). Her zaman "Çalıştırma"daki `EE_BASE=http://localhost:3200` ve `EE_LOG` ile çalıştır.
- **Öğretmen ataması branşa bakmaz, müdürü de öğretmen sayar.** Kod müdürü ayıklamak için `t.role !== 'principal'` der, ama
  `/api/school/lessons`'ın öğretmen listesi yalnız `id`, `fullName`, `branch` döner ([../sunucu/bolumler/okul.md](../sunucu/bolumler/okul.md));
  `role` alanı olmadığı için süzgeç hiçbir şeyi ayıklamaz. Liste ad sırasıyla geldiği için (Ali Yıldız, Ayşe Kaya, Mehmet Demir)
  dersler sırayla bu üç kişiye dağılır: Matematik'i (üç sınıfta da) ve 7-A'nın İngilizce'sini Fen öğretmeni; Türkçe'yi, Sosyal
  Bilgiler'i ve 8-A'nın İngilizce'sini Matematik öğretmeni; Fen'i ve Müzik'i müdür alır (yukarıdaki tablo). Sunucu buna izin verir (müdür ders verebilir, varsayılan öğretmen rolü her derse atanabilir). Sonuç: Ayşe Kaya'nın
  "Matematik" ödevleri, Matematik'ini Ali Yıldız'ın verdiği sınıflara gider; ekranlarda branş ile ders birbirini tutmaz.
- **"Tek kasıtlı çakışma" yok, yedi çakışma var.** Yorum, program saat dilimlerinin çakışmayacak biçimde seçildiğini ve sonda tek
  bir çakışma bırakıldığını söyler. Ama yalnız üç kişiye dağılan dersler aynı saatlere düşer; 3 Ekim'de yedi öğretmen çakışması
  vardı (yukarıdaki liste). "Kasıtlı" olan da yorumdaki gibi "7-A Matematik öğretmeni" değil: 8-A Matematik'i (Ali Yıldız) aynı
  saatteki 7-A İngilizce'siyle (yine Ali Yıldız) çakışır.
- **Dört öğrenciden ikisi giremez.** 12. bölüm Deniz Kara ve Elif Şahin'le `deniz.kara@okul.com` / `elif.sahin@okul.com` e-postasıyla
  girmeye çalışır; oysa 3. bölüm bu hesapları e-postasız, yalnız kullanıcı adıyla açar. Giriş "Bu e-posta adresiyle kayıtlı bir hesap
  yok" (401) alır, `try … catch { continue; }` hatayı yutar. Ödevleri yalnız Zeynep ve Burak açar (3 Ekim'de 5 "açıldı" kaydı).
  Düzeltme kullanıcı adıyla girmek olurdu (`deniz.kara`).
- **Öğretmenin sınıf mesajı hiç gitmez.** `/api/mesajlar/hedefler` sınıf listesini yalnız `mesaj.toplu` yetkisi olana verir
  ([../sunucu/bolumler/mesaj.md](../sunucu/bolumler/mesaj.md)); varsayılan öğretmen rolünde bu yetki yok. Liste boş gelir, "Kesirler
  ödevi sonuçlandı" mesajı sessizce atlanır. ([gorsel-veri.md](gorsel-veri.md) daha sonra Ayşe Kaya'ya bu yetkiyi içeren bir rol
  verir.)
- **Zeynep'in mesajı "ilk öğretmene" gider.** Alıcı, Zeynep'in kişi listesindeki ilk öğretmendir (bugünkü veride Ali Yıldız); konu
  Ayşe Kaya'nın ödevi olsa da.
- **Seed'in ödevleriyle ad çakışması.** "Kesirler alıştırması", "Üslü sayılar testi", "Geometri problemleri" hem seed'de hem burada
  var. 11. bölüm ödevi listede adıyla bulur (`find`); 3 Ekim'de bu dosyanın altı öğrencili ödevi bulundu ve 7. bölümün verdiği
  sonuçların üstüne yazıldı. Hangi ödevin önce geleceği listenin sırasına bağlıdır; tur da "Kesirler alıştırması"nı adıyla açar.
- **Yeniden çalıştırma veriyi bozar.** Dosya tekrar çalıştırmaya göre yazılmamış. 3 Ekim'de aynı veritabanında ikinci kez
  çalıştırıldı: üç sınıf "Bu adda bir sınıf zaten var" (400) aldı, sınıf listesi boş kaldı; 2. bölüm her öğrenciyi `classId`
  olmadan `class-assign`'a gönderdi ve sunucu bunu "sınıfsız yap" diye anladı — **bütün öğrenciler sınıfsız kaldı**; dört hesap
  "Bu kullanıcı adı okulda alınmış" aldı; `/api/school/lessons?classId=undefined` 400 döndü ve araç "Cannot read properties of
  undefined (reading 'filter')" ile 1 koduyla durdu. Her zaman: sıfırlanmış veritabanı → `seed.js` → bu dosya → `gorsel-veri.js`.
- **Cevaplara çoğu yerde bakılmaz.** `iste` HTTP hatasında fırlatmaz; dosya yalnız birkaç yerde gövdede beklenen alanı denetler
  (`r.body.class`, `d.body.lesson`, `r.body.assignment`…). Bir uç değişip 400 dönerse araç çoğu zaman sessizce devam eder ve özet
  satırı yine "hazır" der. (3 Ekim'deki ilk çalıştırmada 160 isteğin hepsi 200 döndü.)
- **Tarihler UTC.** `gun()` tarihi `toISOString` ile yazdığı için Türkiye saatiyle gece 00:00–03:00 arasında bir gün geride kalır
  (3 Ekim gece 00:15 sularında `gun(0)` 2 Ekim verdi; sunucu aynı anda sınav tarihini 3 Ekim yazdı). `seed.js`'in `gun()`'ü de aynıdır.
- **Duyurudaki tarih sabit.** "Veli toplantısı 3 Ekim Cuma" metni koda yazılıdır; takvimdeki veli toplantısı ise her zaman "3 gün
  sonra"dır. 2026'da 3 Ekim cumartesiye denk gelir.
- **Adla arama.** Müdür öğretmenlerin e-postasını görmediği için (KVKK) "Müdür Yardımcısı" rolü Ali Yıldız'a adıyla bulunarak
  verilir; seed'deki ad değişirse rol sessizce kimseye verilmez.
- **`@test.com` ve `@okul.com` adresleri.** Kemal Arslan ve Hülya Demirtaş'ın e-postaları `test.com` alan adında; gerçek bir alan
  adıdır. Test sunucusunda e-posta ayarsız olduğu için kodlar günlüğe yazılır; e-postası ayarlı bir sunucuya karşı çalıştırma
  ([giris.md](giris.md) "Dikkat!").
- **[deneme-okulu.md](deneme-okulu.md) ile aynı veritabanında olmaz:** seed'in `mudur` kullanıcı adı orada da kullanılır.
- **Gerçek kişi adı yok.** Bütün adlar test verisidir; yeni kişi eklersen uydurma ad kullan (depo herkese açık).

## Testleri

- Bu dosyayı çalıştıran ya da denetleyen otomatik test yok; `tumtest.sh` onu kullanmaz. Doğruluğunun ölçüsü ekran turudur:
  tur, burada kurulan ödevleri, sınavları ve hesapları adıyla arar, bulamazsa adımı hatalı yazar ([gezinti.md](gezinti.md)).
- Kullandığı uçların kendisi test paketlerinde denenir: program ve çakışmalar `testler/test-program.js`, roller
  `testler/test-rol.js`, ödev `testler/test-odev-saat.js`, sınav ve şablonlar `testler/test-sinav.js`, mesaj
  `testler/test-mesaj.js`, yoklama `testler/test-devamsizlik.js`, takvim `testler/test-takvim.js`.
- **3 Ekim'de (gece 00:15 sularında) böyle denendi** (3200'de yeni sıfırlanmış test veritabanı, iş bitince kapatıldı): `seed.js`, sonra bu dosya;
  `iste`'yi saran ve 200 dışındaki her cevabı yazan geçici bir sarmalayıcıyla (depoya girmedi). Yaklaşık 7 sn, çıkış 0; 160
  isteğin hepsi 200; iki öğrenci girişi düştü (yukarıda); özet satırı "3 sinif, 46 ders saati, 4 ödev, 5 LGS denemesi, 5 yoklama".
  "3 Ekim'de kurulan veri" ve "Dikkat!"teki ayrıntılar bu çalıştırmadan sonra veritabanından ve uçlardan okundu. İkinci çalıştırmanın
  sonucu "Dikkat!"te.
- Elle: "Çalıştırma"daki komutlar; son satırda "zengin veri hazir: …" çıkmalı. Sonra müdürle girip Sınıflar, Program
  (Çakışmalar) ve Roller ekranlarına; Ayşe Kaya'yla Ödevler (Kesirler alıştırması) ve Sınavlar (LGS Deneme 5 grafiği) ekranlarına bak.

## Son durum

- `git log --follow`: 3 commit. `c4701e4 commit 408` (2026-09-26): ilk açıklama satırı ve `require('./giris')` satırı.
  `19490d5 commit 409` (2026-09-26): dosyanın bütün gövdesi (315 satır).
- Son değişiklik `0acca75 commit 516` (2026-09-27, kişi kodu ve portallar işi): müdür başvurusu kalktığı için Hülya Demirtaş'ın
  girip "Karşıyaka Deneme Ortaokulu" için `POST /api/okul-basvurusu` göndermesi çıkarıldı; artık yalnız hesabı açılır, okulu turda
  yönetici "Okul aç" ile açar. Bölümün yorumu da değişti ("rolsüz hesaplar ve bekleyen müdür başvurusu" → "portalı olmayan
  yetişkin hesapları"; Kemal Arslan için "Öğretmen ekle" yerine "Kodla ekle" ve kişi kodu). O günden beri değişmedi; 3 Ekim'de
  hatasız çalıştı (yukarıdaki açıklar dışında).
- Bilinen açıklar ("Dikkat!"te, kod değiştirilmedi): etkisiz müdür süzgeci ve branşa bakmayan atama, yorumdakinden fazla çakışma,
  giremeyen iki öğrenci, gitmeyen sınıf mesajı, tekrar çalıştırmanın öğrencileri sınıfsız bırakması, kullanılmayan `botCevabi`,
  `EE_BASE` verilmeyince 3000'e gitmesi ve `_test` korumasının olmaması.
- Planlı işlerden bu dosyayı etkileyecekler: "Ekran turu + albüm + wiki güncelleme" (özellikler bitince tur baştan çekilecek; yeni
  özelliklerin verisi buraya ya da [gorsel-veri.md](gorsel-veri.md)'ye eklenecek, yukarıdaki açıklar o işte düzeltilebilir);
  "T.C. kimlik no bütün hesaplarda zorunlu" (Kemal Arslan ve Hülya Demirtaş'ın kaydı T.C. göndermeli); "Güvenlik denetimi"ndeki
  "okulun verdiği her şifrede ilk girişte değiştirme" (okulun açtığı öğrenciler ilk girişte şifre değiştirmeye zorlanınca 12.
  bölümdeki ilerleyiş ve "açıldı" istekleri 403 alır; aydınlatma onayı ve şifre değiştirme bu kapıda serbest kalır,
  [../sunucu/api.md](../sunucu/api.md)); "Çalışan olarak ekleme" (seed'in kişi koduyla eklediği öğretmenler
  rolsüz gelirse ders ataması ve öğretmen girişleri değişir); öneri aşamasındaki "Özel roller: yeni yetkiler", "Sınav: formüllü
  ölçüm", "Devamsızlık: tarih aralığı" ve "Özel branş / ders" işleri buradaki yetki adlarını, sınav şablonlarını, yoklama
  gövdesini ve ders adlarını değiştirebilir. "Kulüpler kaldırılacak" bu dosyayı etkilemez (kulüp kullanmaz).
