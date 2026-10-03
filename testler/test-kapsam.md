# testler/test-kapsam.js

Müdürün özel rollere koyduğu ders/sınıf "kapsamının" (ör. "yalnız 9-A'da, yalnız Matematik") ders programı, ders listesi,
ödev verme ve derse atanmada gerçekten uygulandığını, müdürün bundan etkilenmediğini ve ders bazlı ödev listesini deneyen
sunuculu paket (24 denetim).

## Bu dosya ne yapar?

Okulda yetkiler rollerle dağıtılır. Her öğretmen okulun hazır "Öğretmen" rolünün yetkilerini taşır; müdür ayrıca özel roller
tanımlayıp (ör. "Zümre Başkanı", "Müdür Yardımcısı") öğretmenlere verebilir. Özel rolde bir yetki **daraltılabilir**: "ödev
verir — ama yalnız Matematik dersine ve yalnız 9-A'ya". Bu daraltmaya "kapsam" denir ([../sunucu/yetki.md](../sunucu/yetki.md)).
Kapsam tutmazsa bir zümre başkanı bütün okulun programını değiştirir ya da başka dersin ödevini verir; tutmuyor olması da
hata iletisiyle kendini göstermez. Bu paket bunu gerçek uçlarla dener.

Bir incelik var: öğretmenin yetkileri iki rolün **birleşimidir** ve hazır Öğretmen rolünde açık olan bir yetkiyi ek rolün
kapsamı daraltmaz. Seed'deki okulda "ödev verir" ve "derse atanabilir" hazır rolde açık olduğu için kapsam bunlarda hiç
devreye girmezdi. Paket bu yüzden önce bu iki yetkiyi hazır rolden geçici olarak kaldırır, sonunda geri koyar (dosyadaki
yorum).

Sonuna eklenmiş bir bölüm de müdürün "Ders ödevleri" ekranının iki kademeli cevabını dener: liste yalnız sayıları verir,
ödevlerin kendisi ders açılınca gelir.

## İçinde neler var?

### Yardımcılar ve veri

- `kontrol(ad, sart, detay)`; ortak yardımcılar [giris.md](giris.md) üzerinden ([../araclar/giris.md](../araclar/giris.md)):
  `iste`, `girisYap`. Denetim adları Türkçe harfsiz yazılmış ("kapsam ici", "odev").
- **Hesaplar** ([seed.md](seed.md)): müdür `mudur@test.com` (`T`) ve Fen öğretmeni Ali Yıldız — okulun öğretmen listesinde
  (`GET /api/school/teachers`) onaylı ve kullanıcı adı `fen` olan rol satırı. Paket ona `zumre` der. Rol satırının kendi
  e-postası olmadığı için (giriş e-postası yetişkin hesabında) paket `zumre.email = 'fen@test.com'` diye elle yazar ve onunla
  girer.
- **Kurduğu veri:** sınıflar `9-A` (`a`) ve `9-B` (`b`); dersler 9-A Matematik (haftada 5, `dMat`), 9-A Türkçe (6, `dTur`),
  9-B Matematik (5). Okulun öğrenci listesinden ilk dört öğrenci alınır, ilk ikisi 9-A'ya, kalanı 9-B'ye konur — seed'de iki
  öğrenci olduğu için ikisi de 9-A'ya gider, 9-B boş kalır.
- **Hazır rolün daraltılması:** `GET /api/school/roles`'tan `tur === 'ogretmen'` olan rol bulunur, yetkileri (`temelYetkiler`)
  saklanır ve `POST /api/school/role-update` ile `odev.ver` ve `derse-atanabilir` çıkarılmış hâli yazılır.

### 0) Birleşim (1)

"Birleşim Deneme" adlı rol, `sinav.not-gir` yetkisi ve `{ dersler: ['Türkçe'], siniflar: ['*'] }` kapsamıyla açılır → 200.
(Rol kimseye verilmez; "Dikkat!"e bak.)

### 1) Kapsamlı rol (4)

"Zümre Başkanı Test" rolü açılır:

| Yetki | Kapsam |
|---|---|
| `derse-atanabilir` | dersler `['Matematik']`, sınıflar `['*']` |
| `odev.ver` | dersler `['Matematik']`, sınıflar `[9-A]` |
| `program.duzenle` | dersler `['*']`, sınıflar `[9-A]` |
| `ders.yonet` | dersler `['*']`, sınıflar `[9-A]` |

Denetimler: 200; cevaptaki `role.kapsam['odev.ver']` var; onun dersleri `Matematik`, sınıfları 9-A'nın kimliği. Sonra rol
`POST /api/school/role-assign` ile Ali Yıldız'a verilir ve müdür 9-A Matematik dersini ona atar (`lesson-update`; ödev
hedefleri öğretmenin derslerinden türüyor).

### 2) Kapsam içi erişim (3) — Ali Yıldız'ın oturumuyla

- `GET /api/school/schedule?classId=<9-A>` → 200 (`program.duzenle`).
- `GET /api/school/lessons?classId=<9-A>` → 200 (`ders.yonet`).
- `POST /api/school/schedule-add` — 9-A, gün 6 (Cumartesi), Matematik, 16:00–16:40 → 200.

### 3) Kapsam dışı engelleniyor (3)

- 9-B'nin programı → 403, 9-B'nin dersleri → 403, 9-B'ye "Müzik" dersi eklemek (`POST /api/school/lesson`) → 403
  ("Bu ders ya da sınıf için yetkin yok").

### 4) Ödev kapsamı (3)

- `GET /api/assignments/hedefler` → 9-A ve öğrencileri geliyor (en az bir öğrenci).
- 9-A öğrencilerine Matematik ödevi (`POST /api/assignments`, son teslim `2026-12-31`) → 200.
- Aynı öğrencilere Türkçe ödevi → 400 ("Türkçe dersine ödev verme yetkin yok").

### 5) Derse atanma kapsamı (2)

- Müdür 9-A Türkçe dersini Ali Yıldız'a atamaya kalkar → 400 ("… bu derse atanamaz — rolündeki ders kapsamı izin vermiyor").
- 9-A Matematik'e yeniden atar → 200.

### 6) Kapsam genişletme (1)

Rol `{ 'odev.ver': { dersler: ['*'], siniflar: ['*'] } }` kapsamıyla güncellenir; Ali Yıldız yeniden girer ve Türkçe ödevi
verir → 200 (9-A'da Türkçe dersi var; vekil öğretmen gibi başka dersin ödevini verebilir).

### 7) Müdür kapsamdan etkilenmiyor (1)

Müdür 9-B'nin programına bakar → 200.

### 8) Müdürün ders ödevleri (5)

- `GET /api/school/assignments` → 200 ve `lessons` boş değil.
- Ödev sayısı (`aktif + gecmis`) sıfırdan büyük ilk ders bulunuyor; liste satırında `assignments` alanı YOK (yalnız sayılar).
- `GET /api/school/assignments?lessonId=<o ders>` → gelen ödev sayısı listedeki sayıya eşit; ilk ödevde `teacherName` dolu.

Son olarak hazır Öğretmen rolü `temelYetkiler` ile eski hâline döner → 200 (1 denetim).

Toplam 1 + 4 + 3 + 3 + 3 + 2 + 1 + 1 + 5 + 1 = 24. Sonunda `GECTI: 24   KALDI: 0`; `KALDI` varsa çıkış kodu 1; beklenmeyen
hata `TEST HATASI:` ile yığını yazar.

## Kimle konuşur?

- **Modüller:** yalnız [giris.md](giris.md) (`araclar/giris.js`): `iste`, `girisYap`.
- **Sunucu uçları:**

  | Uç | Ne için | Belge |
  |---|---|---|
  | `GET /api/school/roles`, `POST /api/school/role`, `POST /api/school/role-update`, `POST /api/school/role-assign` | roller ve kapsam | [../sunucu/bolumler/okul.md](../sunucu/bolumler/okul.md) |
  | `GET /api/school/teachers`, `GET /api/school/students`, `POST /api/school/class`, `POST /api/school/class-assign` | öğretmeni bulmak, sınıf kurmak | [../sunucu/bolumler/okul.md](../sunucu/bolumler/okul.md) |
  | `POST /api/school/lesson`, `POST /api/school/lesson-update`, `GET /api/school/lessons`, `GET /api/school/schedule`, `POST /api/school/schedule-add` | ders ve program | [../sunucu/bolumler/okul.md](../sunucu/bolumler/okul.md) |
  | `GET /api/school/assignments` (`?lessonId=`) | müdürün ders bazlı ödev listesi | [../sunucu/bolumler/okul.md](../sunucu/bolumler/okul.md) |
  | `GET /api/assignments/hedefler`, `POST /api/assignments` | ödev verme | [../sunucu/bolumler/odev.md](../sunucu/bolumler/odev.md) |
  | `GET /api/challenge`, `POST /api/login`, `POST /api/login/dogrula` | giriş | [../sunucu/bolumler/kayit.md](../sunucu/bolumler/kayit.md) |

- **Koruduğu kod:** `sunucu/yetki.js` — `kapsamTemizle` (gelen kapsamı süzer; "hepsi" seçiliyse hiç yazmaz),
  `kullaniciYetkileri` (iki rolün birleşimi), `yetkiKapsami`, `kapsamUyar`, `yetkiVarMi` (hazır roldeki yetkide kapsama
  bakmaz) ([../sunucu/yetki.md](../sunucu/yetki.md)); `sunucu/bolumler/okul.js`'teki `yetkiGerek(izin, { sinif })` çağrıları ve
  `lesson-update`'in atanan öğretmen için `derse-atanabilir` denetimi; `sunucu/bolumler/odev.js`'teki ödev verirken ders ve sınıf
  kapsamı; depolar [../sunucu/veri/depo/roller.md](../sunucu/veri/depo/roller.md) (rol, yetki ve kapsam satırları),
  [../sunucu/veri/depo/siniflar.md](../sunucu/veri/depo/siniflar.md), [../sunucu/veri/depo/odevler.md](../sunucu/veri/depo/odevler.md).
- **Tablolar:** `roller`, `rol_yetkileri`, `rol_yetki_kapsamlari` ([../sunucu/veri/sema/SEMA.md](../sunucu/veri/sema/SEMA.md)),
  `siniflar`, `dersler`, `ders_programi`, `kullanicilar` (`ozel_rol_id` — kodda `customRoleId` —, `sinif_id`), `odevler`,
  `odev_ogrencileri`, `odev_siniflari`.
- **Ön yüz** (bu pakette tarayıcı yok): rol ve kapsam ekranı [../public/js/parcalar/19f-roller.md](../public/js/parcalar/19f-roller.md),
  sınıflar [../public/js/parcalar/20-siniflar.md](../public/js/parcalar/20-siniflar.md), ders programı
  [../public/js/parcalar/21-ders-programi.md](../public/js/parcalar/21-ders-programi.md), ödev verme
  [../public/js/parcalar/11-ogretmen-odev.md](../public/js/parcalar/11-ogretmen-odev.md).
- **Onu çalıştıran:** `testler/tumtest.sh`, sunuculu döngüde `test-rol`'den sonra, `test-yedek`'ten önce; her paketten önce
  veritabanı sıfırlanır ve [seed.md](seed.md) çalışır.

## Nasıl çalışır (adım adım)?

```
müdür: 9-A, 9-B ; teachers ─► zumre = 'fen' (Ali Yıldız) ; dersler ; öğrenciler ─► 9-A
       roles ─► hazır Öğretmen rolünden odev.ver + derse-atanabilir çıkar
0) "Birleşim Deneme" rolü açılır
1) "Zümre Başkanı Test" (4 yetki, 4 kapsam) ─► role-assign ─► 9-A Matematik ona atanır
2) zumre girer: 9-A program / dersler / ders saati ─► 200
3)              9-B program / dersler / ders ekleme ─► 403
4)              hedefler ─► Matematik ödevi 200, Türkçe ödevi 400
5) müdür: Türkçe'ye atama 400, Matematik'e atama 200
6) rol: odev.ver kapsamı "hepsi" ─► zumre yeniden girer ─► Türkçe ödevi 200
7) müdür 9-B programı ─► 200
8) müdür ders ödevleri: liste (yalnız sayılar) ─► ?lessonId= (ödevler, veren öğretmen)
hazır rol eski yetkilerine ─► 200
```

## Dikkat!

- **0. bölüm adının söylediğini denemiyor.** "Hazır roldeki yetkiyi ek rol daraltmaz" başlığının altında yalnız bir rol açılır
  (200); rol kimseye verilmez, `sinav.not-gir`'in Türkçe kapsamının hazır roldeki yetkiyi daraltmadığı hiç sınanmaz. `testler/`
  altında bu birleşim kuralını davranışıyla deneyen başka bir paket de yok (arandı). Kod değiştirilmedi; öneri: rolü bir
  öğretmene verip kapsam dışı bir derste not girebildiğini denetlemek.
- **Sınıf kapsamının olumsuz yönü ödevde denenmez.** Kod dört öğrenci varsayar (`slice(0, 4)`, ilk ikisi 9-A'ya, kalanı
  9-B'ye); seed'de iki öğrenci var, ikisi de 9-A'ya gider, 9-B boş kalır. `odev.ver`'in "yalnız 9-A" kapsamı bu yüzden yalnız
  olumlu yönden görülür: sınıf kapsamının reddi ("<sınıf> için ödev verme yetkin yok") hiç denenmez (ders kapsamının reddi
  denenir). 9-B'de öğrenci olsaydı bile yetmezdi: Ali Yıldız 9-B'de ders vermediği için o öğrenci onun ulaşabildiği öğrenciler
  (`ogretmeninOgrencileri`) arasında olmaz ve ödev kapsam denetiminden önce "Seçtiğin öğrencilere ödev veremezsin" ile
  reddedilir. Sınıf kapsamını sınamak için öğretmenin kapsam dışındaki bir sınıfta da dersi olmalı.
- **"Genişletme" bütün kapsamı siler.** 6. bölümde gönderilen kapsamda yalnız `odev.ver` var ve o da "hepsi"; `kapsamTemizle`
  "hepsi"yi hiç yazmadığı ve kapsamı yeni gövdeyle baştan kurduğu için rolün öbür üç yetkisinin kapsamı da gider. Paket bundan
  sonra yalnız ödevi denetler.
- **Hazır rol testin ortasında daraltılmış durur.** Paket `TEST HATASI` ile yarıda kalırsa son adım çalışmaz ve o veritabanında
  okulun bütün öğretmenleri ödev veremez, derse atanamaz. `tumtest.sh` her paketten önce veritabanını sıfırladığı için sonraki
  paketler etkilenmez; elle çalıştırırken dikkat.
- **Taze veritabanı ister.** Sınıf adları (`9-A`, `9-B`) ve rol adları okulda tektir; aynı veritabanında ikinci koşuda
  `POST /api/school/class` 400 ("Bu adda bir sınıf zaten var") döner, `s1.body.class` olmadığı için paket `TEST HATASI` ile
  durur. 3 Ekim'de denendi: ikinci koşu hiçbir bölüm başlığı yazmadan `TEST HATASI: Cannot read properties of undefined` ile
  durdu. Hazır role dokunmadan durduğu için veritabanı bozulmaz.
- **Durum kodları farklı.** Program ve ders uçları kapsam dışında 403 verir; ödev verme ve derse atama aynı durumda 400 verir
  (iletide nedeni yazar). Paket bu farkı bekler; birini değiştirirsen burayı da değiştir.
- **Sabit tarih.** Ödevlerin son teslimi `2026-12-31`; sunucu geçmiş son teslimi reddetmediği için o tarihten sonra da paket
  çalışır, yalnız bu ödevler 8. bölümde "geçmiş" sayılır (toplam değişmez).
- **Seed'e bağlı:** `fen` kullanıcı adı, `fen@test.com`, seed'in 6-A ödevleri (8. bölümdeki "ödevli ilk ders" onlardan biri
  olabilir) ve öğretmenlerin onaylı gelmesi.
- **Varsayılan adres 3000 ve günlük.** `EE_BASE` vermeden çalıştırırsan kendi sunucunda rol açar, hazır Öğretmen rolünü
  değiştirir; müdürün ve öğretmenin iki adımlı kodu `EE_LOG`'dan okunur ([giris.md](giris.md)).

## Testleri

- Bu dosyanın kendisi testtir; `testler/tumtest.sh` her tam koşuda çalıştırır. Aynı alanda: `testler/test-rol.js` (rol
  oluşturma, şablonlar), [yetki-denetimi.md](yetki-denetimi.md) (her uç her rolle), [test-etut.md](test-etut.md).
- Elle (Git Bash, proje kökünde; 3200'de sıfırlanmış `egitimevi_test` ile açılmış ve [seed.md](seed.md) ile tohumlanmış test
  sunucusu varken):

  ```
  EE_BASE=http://localhost:3200 EE_LOG=testler/test-sunucu.log node testler/test-kapsam.js
  ```

- 3 Ekim'de bu belge için 3200'de, yeni sıfırlanmış test veritabanı ve seed'le çalıştırıldı (belgenin denetiminde bir kez
  daha): `GECTI: 24   KALDI: 0`, çıkış 0, 1 saniyeden kısa; sunucu günlüğünde `API hatası` ya da `Veritabanı hatası` yok.

## Son durum

- `git log`: tek commit. Dosya `3b18755 commit 352` (2026-09-26) ile 165 satır olarak, `testler/test-rol.js` ve
  `testler/test-yetiskin.js` ile aynı commit'te eklendi; o günden beri değişmedi.
- Bilinen açıklar (kod değiştirilmedi): birleşim kuralının davranışıyla denenmemesi, ödevde sınıf kapsamının olumsuz yönünün
  denenmemesi ("Dikkat!").
- Planlı işlerden bu dosyayı etkileyecekler:
  - **"Güvenlik denetimi"** — rol işindeki bulgu: `rol.yonet` yetkili bir öğretmen kendisinde olmayan yetkileri
    dağıtabiliyor. Düzeltilince "öğretmen rol açarken kapsamı kendi kapsamını aşamaz" gibi bir denetim bu pakete eklenebilir
    (paket bugün rolleri yalnız müdürle açar).
  - **"Özel roller: yeni yetkiler + yeni hazır şablonlar"** ve **"EKLENTİLER … özel rollerde gruplu yetki"** — yetki listesi
    ve kapsamın biçimi değişirse 1. bölümdeki kapsam tablosu güncellenmeli.
  - **"Özel branş / ders"** — ders adları sabit listeden çıkacak; paket `Matematik`, `Türkçe`, `Müzik` adlarına dayanıyor.
  - **"Çalışan olarak ekleme"** — kişi koduyla eklenen kişi rolsüz çalışan olarak gelecek; `GET /api/school/teachers`'ta onaylı
    `fen` öğretmenini bulmaya ve hazır Öğretmen rolüne dayanan kurulum gözden geçirilmeli.
