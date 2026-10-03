# testler/debug-hazirlik.js

Seed'in kurduğu test okuluna elle hata ayıklamak için "dolu" bir ortam ekleyen (9-A/9-B sınıfları, dersler, ders programı,
bir veli, duyuru, mesaj, yoklama, ödev, özel rol) ve beş rolün oturum anahtarını `ADMIN=…` biçiminde ekrana basan, `tumtest`
dışında elle çalıştırılan hazırlık betiği.

## Bu dosya ne yapar?

Bir hatayı elle kovalarken (tarayıcıda ya da `curl` ile uçları tek tek denerken) iki şey gerekir: içinde biraz veri olan bir
okul ve her rol için giriş yapılmış bir oturum. [seed.md](seed.md) okulu, iki öğretmeni, iki öğrenciyi ve ödevleri kurar;
ama ders programı, veli, mesaj, yoklama, özel rol yoktur. Bu dosya onları ekler ve sonunda şunu yazar:

```
ADMIN=<oturum anahtarı>
MUDUR=<…>
OGRETMEN=<…>
OGRENCI=<…>
VELI=<…>
```

Satırlar `AD=değer` biçiminde olduğu için kabukta kolayca değişkene alınır (ör. `grep '^MUDUR=' cikti.txt`), sonra
`curl -H "Authorization: Bearer $MUDUR" http://localhost:3200/api/...` ile istediğin ucu o rolle denersin. İki adımlı giriş
kodunu her seferinde günlükten okumak zorunda kalmazsın.

İlk satırdaki yorum "Hata ayiklama turu icin her ozelligi dolu bir ortam kurar" der. Bugün hiçbir betik ya da test onu
çağırmıyor (`git grep` ile bakıldı); [../TANITIM.md](../TANITIM.md) de `tumtest` listesinde olmadığını, elle deneme için
olduğunu söyler. Ekran görüntüleri için kullanılan dolu okul artık [../araclar/zengin-veri.md](../araclar/zengin-veri.md) ve
[../araclar/gorsel-veri.md](../araclar/gorsel-veri.md)'dedir.

## İçinde neler var?

### Yardımcılar

- `kayit(govde)` — kendi kayıt yardımcısı: bot sorusunu çözer (`botCevabi`), `POST /api/register` gönderir (gövde:
  `kvkkOnay: true`, uydurma telefon ← `govde` ← bot cevabı), cevap 200 ve `onayGerekli` ise günlükteki onay anahtarıyla
  hesabı açar (`epostaOnayla`). Kayıt cevabını (`iste`'nin `{ status, body, headers }`'ı) döner; kayıt reddedilirse fırlatmaz
  (yalnız onay anahtarı günlükte bulunamazsa `epostaOnayla` fırlatır).
- `gun(n)` — bugünden `n` gün sonrası, `YYYY-AA-GG`. Metin `toISOString()` ile alınır, yani **UTC takvim günü**.

### Kurduğu veri (sırasıyla)

Hepsi seed'in hesaplarıyla yapılır: yönetici `admin@egitimevi.com`, müdür `mudur@test.com`, Matematik öğretmeni
`mat@test.com` (şifreler seed'deki test değerleri).

| # | Kim | Ne | Uç |
|---|---|---|---|
| 1 | müdür | `9-A` ve `9-B` sınıfları | `POST /api/school/class`, sonra `GET /api/school/classes` |
| 2 | müdür | her sınıfa Matematik (Ayşe Kaya) ve Fen Bilimleri (Ali Yıldız), haftada 4 saat; öğretmenler `teacher-list`'te **adlarıyla** bulunur | `GET /api/school/teacher-list`, `POST /api/school/lesson`, `POST /api/school/lesson-update` |
| 3 | müdür | okulun **bütün** öğrencilerini 9-A'ya taşır | `GET /api/school/students`, `POST /api/school/class-assign` |
| 4 | müdür | 9-A'nın her dersine pazartesi (1) ve çarşamba (3) birer saat; saatler sırayla `09:20–10:00`, `10:10–10:50`, `11:00–11:40` | `POST /api/school/schedule-add` |
| 5 | — | "Debug Veli" yetişkin hesabı (`veli-debug@test.com`), girer, öğrencilerden **ilkinin** veli koduyla çocuk bağlar | `kayit`, `girisYap`, `POST /api/parent/link { code }` |
| 6 | müdür | okula duyuru "Veli toplantısı" | `POST /api/mesajlar { tur: 'duyuru', hedef: { tur: 'okul' } }` |
| 7 | öğretmen | ilk öğrenciye mesaj "Ödev hatırlatması" | `POST /api/mesajlar { tur: 'mesaj', hedef: { tur: 'kisi', kisiler: [...] } }` |
| 8 | öğretmen | 9-A Matematik dersine `gun(-1)` tarihli yoklama: ilk öğrenci `yok` ("Haber verilmedi"), ikinci `gec` | `POST /api/devamsizlik/yoklama` |
| 9 | öğretmen | ulaşabildiği bütün öğrencilere "Kesirler alıştırması" (`gun(-3)` → `gun(4)`) | `GET /api/assignments/hedefler`, `POST /api/assignments` |
| 10 | müdür | özel rol "Zümre Başkanı" (niyet: `program.duzenle`, `ders.yonet`, `devamsizlik.gor`, `aktarim.yap`, `islem-kaydi.gor`, `mesaj.toplu`) | `POST /api/school/role` |
| 11 | — | öğrenci `ogrenci1@test.com` girer; beş anahtar yazılır | `girisYap` |

"İlk öğrenci" `GET /api/school/students` listesinin ilkidir; liste ada göre sıralıdır, bugünkü seed'le bu **Burak Öztürk**
(`ogrenci2@test.com`) olur, giriş yapılan `ogrenci1` (Zeynep Şahin) değil.

Hata olursa `HAZIRLIK HATASI: <ileti>` yazıp 1 ile çıkar.

## Kimle konuşur?

- **Çağırdıkları:** [giris.md](giris.md) üzerinden `araclar/giris.js` → `iste`, `epostaOnayla`, `girisYap`, `botCevabi`
  ([../araclar/giris.md](../araclar/giris.md)).
- **Sunucu uçları ve bölümleri:**

  | Uç | Bölüm |
  |---|---|
  | `GET /api/challenge`, `POST /api/register`, `POST /api/eposta-onay`, `POST /api/login`, `POST /api/login/dogrula` | [../sunucu/bolumler/kayit.md](../sunucu/bolumler/kayit.md) |
  | `POST /api/school/class`, `GET /api/school/classes`, `GET /api/school/teacher-list`, `POST /api/school/lesson`, `POST /api/school/lesson-update`, `GET /api/school/students`, `POST /api/school/class-assign`, `POST /api/school/schedule-add`, `POST /api/school/role` | [../sunucu/bolumler/okul.md](../sunucu/bolumler/okul.md) |
  | `POST /api/parent/link` | [../sunucu/bolumler/veli.md](../sunucu/bolumler/veli.md) |
  | `POST /api/mesajlar` | [../sunucu/bolumler/mesaj.md](../sunucu/bolumler/mesaj.md) |
  | `POST /api/devamsizlik/yoklama` | [../sunucu/bolumler/devamsizlik.md](../sunucu/bolumler/devamsizlik.md) |
  | `GET /api/assignments/hedefler`, `POST /api/assignments` | [../sunucu/bolumler/odev.md](../sunucu/bolumler/odev.md) |

- **Ön koşulu:** [seed.md](seed.md) aynı veritabanında çalışmış olmalı (hesaplar, 6-A, öğretmenlerin adları, öğrenciler).
- **Onu çağıran:** yok. `tumtest.sh`'te ve araçlarda geçmez; belgelerden [../TANITIM.md](../TANITIM.md) ("Testler ve
  denetimler" ve belge haritası) ile [../araclar/giris.md](../araclar/giris.md) (ortak yardımcıyı kullananlar listesi) anar.
- **Tablolar** (uçlar üzerinden): `siniflar`, `dersler`, `ders_programi`, `kullanicilar`, `eposta_onaylari`, `veli_baglari`,
  `mesajlar`, `mesaj_alicilari`, `devamsizlik`, `odevler`, `roller`, `bildirimler`.

## Nasıl çalışır (adım adım)?

```
(3200'de sıfırlanmış test sunucusu, çıktısı bir günlük dosyasına)
seed.js ──► temel okul
debug-hazirlik.js
  admin, müdür, mat girer
  9-A, 9-B ─► her sınıfa Matematik + Fen (6-A'da zaten var: 400, sessizce atlanır)
  bütün öğrenciler ─► 9-A          9-A dersleri ─► pzt + çrş birer saat (4 hücre)
  Debug Veli: kayıt ─► onay ─► giriş ─► veli kodu (ilk öğrenci)
  duyuru (okul) · mesaj (ilk öğrenci) · dünkü yoklama · ödev · "Zümre Başkanı" rolü
  ogrenci1 girer ─► ADMIN= / MUDUR= / OGRETMEN= / OGRENCI= / VELI=
```

Çalıştırma (Git Bash, proje kökü; test sunucusu açık ve çıktısı `testler/test-sunucu.log`'a gidiyorken):

```
EE_BASE=http://localhost:3200 EE_LOG=testler/test-sunucu.log node testler/seed.js
EE_BASE=http://localhost:3200 EE_LOG=testler/test-sunucu.log node testler/debug-hazirlik.js > anahtarlar.txt
```

## Dikkat!

- **Hatalar yutulur.** `iste` HTTP hatasında fırlatmaz ve dosya hiçbir adımın cevabına bakmaz (yalnız giriş ve e-posta onayı
  hata fırlatır). Bir adım reddedilirse, sonraki adımlar o adımın kurduğu veriye dayanmıyorsa betik yine `ADMIN=…` satırlarını
  basar ve 0 ile çıkar; neyin kurulamadığını ancak uçlara bakarak görürsün. Dayanıyorsa (aşağıdaki ikinci çalıştırma ve T.C.
  örnekleri) yarıda `HAZIRLIK HATASI` ile durur.
- **"Zümre Başkanı" rolü yetkisiz açılıyor.** Betik yetkileri `yetkiler` alanında gönderir; sunucu (`POST /api/school/role`)
  `permissions` alanını okur. Rol açılır ama yetki listesi boştur. 3 Ekim'de denendi: `GET /api/school/roles` cevabında
  "Zümre Başkanı | yetkiler: []". Sunucu bu dosya yazıldığı gün (commit 288) de `permissions` okuyordu, yani alan hiç
  çalışmadı. Aynı yanlış ad [yetki-denetimi.md](yetki-denetimi.md)'de de var (orada yalnız izin kapısı denendiği için sonucu
  etkilemez). Kod değiştirilmedi.
- **Kayıt gövdesindeki `role: 'parent'`, `city`, `district` yok sayılır.** Kayıt her zaman rolsüz bir yetişkin hesabı açar;
  hesap veli kodunu girince veli olur (`/api/parent/link`). Kullanıcı adı gönderilmediği için sunucu e-postanın `@` öncesinden
  türetir: 3 Ekim'deki denemede `velidebug` (tire atıldı).
- **Bütün öğrencileri 9-A'ya taşır.** Seed'in 6-A'sı boş kalır; 6-A'nın dersleri ve seed'in ödevleri yerinde durur. Üstüne
  bir "Kesirler alıştırması" daha eklenir: `ogrenci1`'in `/api/progress`'inde 5 değil **6** ödev olur. Bu yüzden bu betiği
  çalıştırdığın veritabanında [guvenlik-test.md](guvenlik-test.md)'yi koşarsan "odevler geliyor (5 adet)" kalır; testlerden
  önce veritabanını sıfırla.
- **Veli Burak'ın velisi olur, mesaj ve "yok" yoklaması da Burak'a gider.** "İlk öğrenci" ad sırasıyla Burak Öztürk'tür;
  `OGRENCI=` anahtarı ise Zeynep Şahin'in (`ogrenci1`). Velinin ekranında Zeynep'i değil Burak'ı görürsün.
- **Seed'deki adlara bağlı.** Öğretmenler `fullName === 'Ayşe Kaya'` / `'Ali Yıldız'` ile bulunur; seed'de ad değişirse
  `ogr.id` okunurken `TypeError` ile durur. Okulda hiç öğrenci yoksa da `ogrenciler[0].id`'de çöker. Tek öğrenci varsa ikinci
  yoklama satırı yine ilk öğrenciye yazılır (aynı öğrencinin ikinci girişi sunucuda atlanır).
- **6-A dersleri ikinci kez eklenmez.** Sınıf listesi 6-A'yı da içerir; Matematik ve Fen orada zaten olduğu için sunucu "Bu
  ders bu sınıfa zaten eklenmiş" der, cevapta `lesson` olmadığından o ikisi atlanır. Program yalnız 9-A için kurulur; 9-B'nin
  dersleri programsız kalır.
- **Tarihler UTC.** `gun()` Türkiye saatiyle gece 00:00–03:00 arasında bir gün geride kalır. 3 Ekim gecesi saat 03:00'ten önce
  yapılan denemede "dünkü" yoklama `2026-10-01` tarihine yazıldı (yerel takvime göre iki gün önce).
- **Duyuru metni sabit.** "14 Eylül Cumartesi saat 10:00da veli toplantısı…" her çalıştırmada aynıdır (gerçek bir tarih değil).
- **İkinci kez çalıştırırsan yarıda çöker.** Sınıflar 400 alır (sessizce), dersler her sınıfta zaten olduğu için hiçbiri
  `dersler` listesine girmez; veli kaydı "zaten kayıtlı" alır (onay atlanır, giriş yine olur), çocuk bağı "zaten ekli" der;
  duyuru ve mesaj **bir kez daha** gönderilir. Sonra yoklama adımında 9-A'nın Matematik dersi listede bulunamaz,
  `matDers.id` okunurken `HAZIRLIK HATASI: Cannot read properties of undefined (reading 'id')` ile 1 koduyla durur: ödev, rol
  ve anahtar satırları gelmez (koddan çıkarım). Her denemeden önce veritabanını sıfırla ve seed'i yeniden çalıştır.
- **Oturum anahtarları düz metin basılır.** Yalnız test veritabanındaki uydurma hesaplarındır, ama dosyaya yazdıysan iş
  bitince sil; anahtar oturum süresince geçerlidir.
- **Varsayılan adres 3000.** `EE_BASE` vermezsen her şey `http://localhost:3000`'e, yani kendi (gerçek veritabanlı)
  sunucuna gider ve orada sınıf, veli, duyuru açar. Her zaman `EE_BASE=http://localhost:3200` ile çalıştır.

## Testleri

- Kendi testi yok, hiçbir test de onu kullanmıyor. Dokunduğu uçları koruyan paketler: `testler/test-program.js` (ders
  programı), `testler/test-mesaj.js` (duyuru ve mesaj), `testler/test-devamsizlik.js` (yoklama), `testler/test-rol.js` (özel
  roller), `testler/test-veli-coklu.js` (veli kodu), `testler/test-giris-kayit.js` (kayıt ve onay).
- 3 Ekim gecesi (02:00–03:00 arası) 3200'de yeni sıfırlanmış test veritabanında denendi: seed → bu dosya; 2,2 saniyede çıkış 0, beş
  anahtar satırı. Sonra yalnız okuma yapan bir yoklamayla bakıldı: sınıflar 6-A (0 öğrenci, 2 ders), 9-A (2 öğrenci, 2 ders),
  9-B (0 öğrenci, 2 ders); 9-A programında 4 hücre (pzt 09:20 Matematik, pzt 11:00 Fen, çrş 09:20 Fen, çrş 10:10 Matematik);
  veli `velidebug`, rolü `parent`, çocuğu Burak Öztürk; Burak'ta 1 "Gelmedi" (not "Haber verilmedi"), Zeynep'te 1 "Geç geldi";
  velinin kutusunda mesaj ve duyuru, `ogrenci1`'de duyuru; `ogrenci1`'in 6 ödevi; "Zümre Başkanı" rolünün yetki listesi boş.
  Sunucu iş bitince kapatıldı.

## Son durum

- `git log`: tek commit. Dosya `b2eae1c commit 288` (2026-09-25) ile 127 satır olarak eklendi ve o günden beri değişmedi.
  O gün de kayıt rolsüzdü (gövdedeki `role` okunmuyordu) ve rol ucu `permissions` bekliyordu.
- Bilinen açıklar (kod değiştirilmedi): `yetkiler` → `permissions` alan adı, sessizce yutulan hatalar, `gun()`'ün UTC günü.
- Planlı işlerden etkileyecekler: "T.C. kimlik no bütün hesaplarda zorunlu" (kod Linux'ta) — 5. adımdaki veli kaydı T.C. no
  göndermediği için sessizce reddedilecek, hemen ardından velinin girişi "giriş 1. adım" hatasıyla fırlatacak ve betik
  `HAZIRLIK HATASI` ile duracak (duyuru, mesaj, yoklama, ödev, rol ve anahtar satırları gelmez); "Sistem" işindeki yöneticiye zorunlu doğrulama uygulaması (TOTP) — ilk satırdaki yönetici girişi günlükteki e-posta
  koduyla yapılamayacak; "Çalışan olarak ekleme" ve "Özel branş / ders" — öğretmenlerin ve derslerin kuruluşu değişince 2.
  adım gözden geçirilmeli.
