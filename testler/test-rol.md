# testler/test-rol.js

Okulun yetki kataloğunu, müdürün özel rol açmasını, öğretmene atamasını, daraltıp silmesini ve `okul.konum` yetkisini uçtan uca
deneyen sunuculu test paketi (30 denetim); müdürün her zaman bütün yetkilere sahip olduğunu da doğrular.

## Bu dosya ne yapar?

Eğitim Evi'nde öğretmenin neyi yapabileceği iki rolün birleşimidir: okulun hazır "Öğretmen" rolü (her öğretmende; ilk hâli
`OGRETMEN_VARSAYILAN`) ve müdürün ona ayrıca verdiği bir özel rol ("Müdür Yardımcısı", "Harita Sorumlusu"…). Müdürün kendisi her
zaman bütün yetkilere sahiptir; bu değiştirilemez ki okulda her şeyi yapabilen en az bir kişi kalsın
([../sunucu/yetki.md](../sunucu/yetki.md)).

Bu paket o düzeni gerçek bir test sunucusunda adım adım dener: katalog geliyor mu, rol açılıyor mu, aynı adlı rol ve uydurma yetki
ne oluyor, rolsüz öğretmen neyi yapamıyor, rol verilince yapabiliyor mu, verilmeyen yetki kapalı mı kalıyor, rol daraltılınca ya da
silinince öğretmenin yetkileri hemen değişiyor mu, varsayılan öğretmen yetkileri yerinde mi. 26 Eylül'de eklenen `okul.konum`
yetkisi için ayrı bir bölüm var: bu yetkiyle öğretmen okulun haritadaki yerini koyabilir ama okulun giriş adresini (kısa adını)
değiştiremez.

Paket kısa ve doğrudandır: başında açıklama yorumu yok, bütün akış tek bir `async` işlevde sırayla yürür; her bölüm
`=== N) ... ===` başlığıyla ekrana yazılır.

## İçinde neler var?

### Yardımcılar, hesaplar ve veriler

- `iste`, `girisYap` — [giris.md](giris.md) üzerinden `araclar/giris.js`'ten ([../araclar/giris.md](../araclar/giris.md)).
  `girisYap` bot sorusunu çözer, iki adımlı kodu sunucu günlüğünden okur ve oturum cevabını döner; paket yetkileri bu cevabın
  `user.yetkiler` alanından okur.
- `kontrol(ad, sart, detay)` — `GECTI`/`KALDI` satırı basar, sayar.
- Hesaplar (hepsi [seed.md](seed.md)'den, şifre `Test1234!`): müdür `mudur@test.com` (`T`), Matematik öğretmeni `mat@test.com`
  (rol verilen öğretmen; okulun öğretmen listesinde kullanıcı adı `mat`), Fen öğretmeni `fen@test.com` (hiç rol verilmeyen
  karşılaştırma öğretmeni). Okul "Test Ortaokulu".
- Paketin açtıkları: "Müdür Yardımcısı" rolü (`sinif.yonet`, `program.duzenle`, `ogrenci.yerlestir`, `ders.yonet`), "Uydurma" rolü
  (hemen silinir), "9-Z" sınıfı (silinmez), "Harita Sorumlusu" rolü (`okul.konum`; sonda silinir); okulun konumu 39.92077, 32.85411
  olarak kaydedilir.

### 1) YETKİ KATALOĞU (4)

`GET /api/school/permissions` (müdürle):

- 200 ve `gruplar` boş değil. Detayda grup sayısı (bugün 9).
- Bütün grupların `liste[].k` değerleri düz listeye (`tumYetki`) toplanır; en az 20 yetki var (bugün 34).
- `derse-atanabilir` listede.
- `ogretmenVarsayilan` boş değil.

`tumYetki` 9. bölümde yeniden kullanılır.

### 2) ROL OLUŞTURMA (4)

- `POST /api/school/role { name: 'Müdür Yardımcısı', permissions: [4 yetki] }` → 200, cevaptaki `role.permissions` 4 öğeli. Rolün
  kimliği (`rolId`) sonraki bölümlerde kullanılır.
- Aynı ad küçük harfle (`'müdür yardımcısı'`) → 400 (sunucu adları Türkçe küçük harfe çevirip karşılaştırır: "Bu adda bir rol zaten var").
- `permissions: ['sinif.yonet', 'yok.boyle.yetki', 'her-seyi-yap']` → rol yine açılır ama yalnız `sinif.yonet` kalır (tanınmayan
  yetkiler sessizce atılır, hata dönmez). Bu "Uydurma" rolü hemen `POST /api/school/role-delete` ile silinir.

### 3) ROLSÜZ ÖĞRETMEN (2)

`mat` henüz yalnız hazır Öğretmen rolündeyken:

- `POST /api/school/class { name: '9-Z' }` → 403 (`sinif.yonet` yok).
- `GET /api/school/classes` → 403 (sınıf listesi de `sinif.yonet` ister; değişkenin adı `programDener` ama denenen sınıf listesi).

### 4) ROL ATAMA (2)

- Müdür `GET /api/school/teachers` ile öğretmen listesini alır, kullanıcı adı `mat` olanı bulur.
- `POST /api/school/role-assign { userId, roleId: rolId }` → 200; cevaptaki `user.customRoleName` "Müdür Yardımcısı".

### 5) ROLLÜ ÖĞRETMEN (4)

`mat` yeniden girer (`ogrt2`):

- Giriş cevabının `user.yetkiler`'inde `sinif.yonet` var. (Denetimin adı "yetkiler /me ile geliyor" diyor ama okunan alan girişin
  cevabıdır; `/api/me` çağrılmaz.)
- `POST /api/school/class { name: '9-Z' }` → 200: artık sınıf açabiliyor.
- `POST /api/school/student-password { studentId: 'u_yok', password: 'Deneme1234' }` → 403: role `ogrenci.sifre` verilmedi. Sunucu
  yetkiye öğrencinin var olup olmadığından önce baktığı için uydurma kimlik 404 değil 403 alır.
- `POST /api/school/role { name: 'Kendi Rolum', permissions: [] }` → 403: `rol.yonet` yok, kimse kendine rol açamaz.

### 6) ÖĞRETMEN VARSAYILAN YETKİLERİ (2)

Aynı giriş cevabında `derse-atanabilir` ve `odev.ver` var (hazır Öğretmen rolünden; özel rolde yok).

### 7) ROL GÜNCELLEME (2)

- `POST /api/school/role-update { roleId: rolId, permissions: ['sinif.yonet'] }` → cevapta tek yetki.
- `mat` yeniden girince `program.duzenle` artık yok: daraltma rolü taşıyana hemen yansır.

### 8) ROL SİLME (4)

- `GET /api/school/roles` → bu rolün `kisiSayisi` 1.
- `POST /api/school/role-delete { roleId: rolId }` → 200.
- `mat` yeniden girince `sinif.yonet` yok (rol silinince öğretmenin rol bağı boşalır), ama `odev.ver` duruyor.

### 8b) OKULUN KONUMU YETKİSİ — `okul.konum` (5)

- `POST /api/school/role { name: 'Harita Sorumlusu', permissions: ['okul.konum'] }` → 200 ve ilk yetki `okul.konum`.
- `fen` (rolsüz) için `POST /api/school/konum { enlem: 39.9, boylam: 32.85 }` ve `GET /api/school/adres` ikisi de 403.
- Rol `mat`'a atanır (önceki rolü silindiği için tek özel rolü bu olur), `mat` yeniden girer: `POST /api/school/konum { enlem: 39.92077,
  boylam: 32.85411 }` → 200 ve `GET /api/school/adres` → 200, cevapta `enlem: 39.92077`.
- `POST /api/school/adres { kisaAd: 'baska-adres' }` → 403: konum yetkisi okulun giriş adresini değiştirmeye yetmez (o yalnız
  müdürün).
- Müdür `GET /api/islem-kaydi?islem=okul.konum` → 200 ve en az bir kayıt.
- Sonda "Harita Sorumlusu" rolü silinir.

### 9) MÜDÜR HER ZAMAN TAM YETKİLİ (1)

Paketin en başındaki müdür girişinin `user.yetkiler` sayısı katalogdaki bütün yetkilerin sayısına eşit (bugün 34 / 34).

Toplam 4 + 4 + 2 + 2 + 4 + 2 + 2 + 4 + 5 + 1 = 30. Sonunda boş satır ve `  GECTI: 30   KALDI: 0`; `KALDI` varsa çıkış kodu 1.
Beklenmeyen bir hata `TEST HATASI: <ileti> <yığın>` ile (stderr'e) basılır, çıkış kodu 1.

## Kimle konuşur?

- **Modüller:** [giris.md](giris.md) → `iste`, `girisYap` (onlar da `GET /api/challenge`, `POST /api/login`,
  `POST /api/login/dogrula`; [../sunucu/bolumler/kayit.md](../sunucu/bolumler/kayit.md)). Başka `require` yok; veritabanına doğrudan
  bağlanmaz.
- **Sunucu uçları:**

  | Uç | Ne için | Belge |
  |---|---|---|
  | `GET /api/school/permissions` | yetki kataloğu (`gruplar`, `ogretmenVarsayilan`, `sablonlar`) | [../sunucu/bolumler/okul.md](../sunucu/bolumler/okul.md) |
  | `POST /api/school/role`, `role-update`, `role-delete`, `role-assign`, `GET /api/school/roles` | rol işleri (`rol.yonet`) | [../sunucu/bolumler/okul.md](../sunucu/bolumler/okul.md) |
  | `GET /api/school/teachers` | öğretmen listesi (`ogretmen.duzenle`) | [../sunucu/bolumler/okul.md](../sunucu/bolumler/okul.md) |
  | `POST /api/school/class`, `GET /api/school/classes` | sınıf (`sinif.yonet`) | [../sunucu/bolumler/okul.md](../sunucu/bolumler/okul.md) |
  | `POST /api/school/student-password` | öğrenci şifresi (`ogrenci.sifre`) | [../sunucu/bolumler/hesaplar.md](../sunucu/bolumler/hesaplar.md) |
  | `POST /api/school/konum`, `GET`/`POST /api/school/adres` | okulun haritadaki yeri, okulun adresi | [../sunucu/bolumler/hesaplar.md](../sunucu/bolumler/hesaplar.md) |
  | `GET /api/islem-kaydi?islem=okul.konum` | işlem kaydı | [../sunucu/bolumler/islem-kaydi.md](../sunucu/bolumler/islem-kaydi.md) |

- **Koruduğu kod:**
  - [../sunucu/yetki.md](../sunucu/yetki.md) — `YETKILER` (9 grup, 34 yetki), `TUM_YETKILER`, `OGRETMEN_VARSAYILAN`,
    `kullaniciYetkileri` (müdüre hepsi; öğretmene hazır rol + özel rolün birleşimi), `yetkiVarMi`, `pub` (`customRoleName`, `yetkiler`),
    `rolOzeti` (`kisiSayisi`).
  - [../sunucu/bolumler/okul.md](../sunucu/bolumler/okul.md) — `/api/school` kapısı (yalnız müdür ve öğretmen), `yetkiGerek`, rol uçları
    (adın Türkçe küçük harfle tekilliği, tanınmayan yetkilerin süzülmesi, daraltma, silme, kişi sayısı), `teachers`, `class`, `classes`.
    Aynı uçların "Kendine rol veremezsin", "Öğretmen rolü her öğretmende zaten var; ayrıca verilmez", "Hazır Öğretmen rolü silinemez"
    ve "Kendi taşıdığın rolü değiştiremezsin" kuralları bu pakette denenmez.
  - [../sunucu/bolumler/hesaplar.md](../sunucu/bolumler/hesaplar.md) — `yonetilenHesap` (yetki, kimlikten önce denetlenir),
    `adres` (GET müdür ya da `okul.konum`; POST yalnız müdür), `konum` (`okul.konum`; işlem kaydı `okul.konum`).
  - [../sunucu/veri/depo/roller.md](../sunucu/veri/depo/roller.md) — rol satırı, kişi sayısı, silme; şemadaki
    `kullanicilar.ozel_rol_id … ON DELETE SET NULL` (rol silinince taşıyanların bağı boşalır;
    [../sunucu/veri/sema/SEMA.md](../sunucu/veri/sema/SEMA.md)). [../sunucu/veri/depo/kullanicilar.md](../sunucu/veri/depo/kullanicilar.md)
    — öğretmene okulun hazır rol yetkilerinin iliştirilmesi.
  - [../sunucu/bolumler/islem-kaydi.md](../sunucu/bolumler/islem-kaydi.md) — `okul.konum` kaydı ve `?islem=` süzgeci.
- **Ön yüz** (bu pakette tarayıcı yok): rol ekranı [../public/js/parcalar/19f-roller.md](../public/js/parcalar/19f-roller.md)
  (`/school/roles`, `/school/permissions`, `role`, `role-update`, `role-delete`, `role-assign`), okul ayarlarındaki adres ve harita
  kartı [../public/js/parcalar/16b-okul-ayarlari.md](../public/js/parcalar/16b-okul-ayarlari.md) (`/school/adres`, `/school/konum`).
- **Tablolar** (uçlar üzerinden): `roller`, `rol_yetkileri` (rolün yetki listesi), `kullanicilar` (`ozel_rol_id`), `siniflar`, `okullar`
  (konum), `islem_kaydi`, `bildirimler`
  (rol atanınca öğretmene giden "Sana … rolü verildi" bildirimi; paket bunu denetlemez).
- **Onu çalıştıran:** `testler/tumtest.sh` — sunuculu paketler döngüsünde üçüncü (`test-yonetim` ve `test-program`'dan sonra,
  `test-kapsam`'tan önce). Her paketten önce sunucu `egitimevi_test` sıfırlanarak açılır ve [seed.md](seed.md) çalışır.

## Nasıl çalışır (adım adım)?

```
mudur girer (T)
1) GET permissions ─► gruplar, tumYetki (34), derse-atanabilir, ogretmenVarsayilan
2) POST role "Müdür Yardımcısı" (4 yetki) ─► rolId
   POST role "müdür yardımcısı" ─► 400
   POST role "Uydurma" (1 gerçek + 2 uydurma) ─► 1 yetki ─► role-delete
3) mat (rolsüz): POST class 9-Z ─► 403 ; GET classes ─► 403
4) GET teachers ─► mat ─► POST role-assign(mat, rolId) ─► customRoleName
5) mat yeniden girer: yetkiler ∋ sinif.yonet ; POST class 9-Z ─► 200
   student-password ─► 403 ; POST role ─► 403
6) yetkiler ∋ derse-atanabilir, odev.ver
7) role-update(rolId, [sinif.yonet]) ─► mat yeniden girer ─► program.duzenle yok
8) GET roles ─► kisiSayisi 1 ─► role-delete ─► mat yeniden girer ─► sinif.yonet yok, odev.ver var
8b) "Harita Sorumlusu" [okul.konum] ; fen: konum 403, adres GET 403
    role-assign(mat) ─► konum 200, adres GET 200 (enlem) ; adres POST 403 ; islem-kaydi okul.konum ─► role-delete
9) mudur.yetkiler.length === tumYetki.length
GECTI: n   KALDI: m
```

Her yetki değişikliğinden sonra `mat`'ın yeniden girmesi şart değil (sunucu her istekte kullanıcıyı ve rolünü yeniden okur); paket
bunu, güncel `user.yetkiler` listesini giriş cevabından okumak için yapar.

## Dikkat!

- **Aynı veritabanında ikinci koşu kalır.** "9-Z" sınıfı silinmez; aynı sunucuda paketi hemen bir kez daha koşunca 5. bölümdeki
  "artik sinif acabiliyor" `KALDI` olur (`{"error":"Bu adda bir sınıf zaten var"}`), geri kalan 29 denetim geçer (3 Ekim'de
  denendi: `GECTI: 29   KALDI: 1`). `tumtest.sh` her paketten önce veritabanını sıfırladığı için orada sorun yok; elle koşarken
  sunucuyu sıfırlayıp yeniden aç.
- **Seed'e sıkı bağlı.** `mat` kullanıcı adı, `fen@test.com`'un rolsüz olması ve hazır Öğretmen rolünde `derse-atanabilir` ile
  `odev.ver`'in açık olması seed'den ve varsayılandan gelir. Bir paket hazır rolü değiştirip veritabanını sıfırlamadan bu paket
  koşulursa 6. ve 8. bölüm kalabilir. Örneğin [test-kapsam.md](test-kapsam.md) hazır rolden `odev.ver`'i ve `derse-atanabilir`'i
  geçici olarak kapatır, sonunda geri koyar ("hazir Ogretmen rolu eski yetkilerine dondu"); yalnız yarıda düşerse hazır rol daraltılmış
  kalır. `tumtest.sh`'te bu paket `test-kapsam`'tan önce koşar ve her paketten önce veritabanı sıfırlanır, o yüzden orada etkilenmez.
- **Uydurma yetki sessizce atılır.** Sunucu tanınmayan yetki için hata vermez; bu paket de bunu "doğru davranış" diye dener. Ön yüz
  yalnız katalogdakileri gönderdiği için kişi bir şey kaybetmez; ama dışarıdan çağıran bir betik yanlış alan adıyla rolü
  **yetkisiz** açabilir. Gerçekten de [yetki-denetimi.md](yetki-denetimi.md) ve [debug-hazirlik.md](debug-hazirlik.md) rol açarken
  gövdeye `permissions` yerine `yetkiler` yazıyor; sunucu `permissions` okuduğu için o roller yetkisiz açılıyor (iki belgenin
  "Dikkat!"inde ayrıntısı var). Bu paket doğru alanı (`permissions`) kullanır.
- **`rol.yonet`'li öğretmen bu pakette denenmez.** Bölüm 5 yalnız `rol.yonet`'i OLMAYAN öğretmenin rol açamadığını dener.
  `rol.yonet` verilmiş bir öğretmen, kendisinde olmayan yetkilerle rol açıp başka bir öğretmene verebilir: `POST /api/school/role`
  istenen yetkilerin açanda olup olmadığına bakmaz. Katalog bunu yalnız uyarır ("Bu yetkiyi verdiğin kişi başkalarına yetki
  dağıtabilir."); bilinen bir güvenlik bulgusudur ve "Güvenlik denetimi" işinde ele alınacak. Burada ne o açık ne de "kendi taşıdığın
  rolü değiştiremezsin" (403) kuralı sınanır.
- **Sayılar sabit değil.** "yeterince yetki" en az 20 ister, 9. bölüm ise eşitlik ister; yeni yetki eklenince ikisi de kendiliğinden
  uyar. Ama müdürün yetkileri paketin EN BAŞINDAKİ girişten okunur; paket sürerken katalog değişmez, sorun yok.
- **Konum değeri okulda kalır.** 8b okulun konumunu 39.92077, 32.85411 yapar ve geri almaz; adres GET'i 200 + `enlem` ister. Aynı
  veritabanında servis haritasına bakan bir paket okul işaretini burada görür (`tumtest.sh`'te sıfırlama var).
- **`adres` POST'unun günlük sınırı:** okul adresi değişikliği günde 10 ile sınırlı (bellekte sayılır); bu paketin denemesi 403 ile
  kapıda döndüğü için sayaca girmez.
- **Varsayılan adres 3000.** `EE_BASE` vermezsen istekler `http://localhost:3000`'deki kendi sunucuna gider ve seed hesapları orada
  yoksa ilk girişte durur; her zaman test sunucusunu kullan.

## Testleri

- Bu dosyanın kendisi testtir; `testler/tumtest.sh` her tam koşuda çalıştırır.
- Elle (Git Bash, proje kökünde): sunucu 3200'de sıfırlanmış `egitimevi_test` ve [seed.md](seed.md) ile açık olmalı, sonra
  `EE_BASE=http://localhost:3200 EE_LOG=testler/test-sunucu.log node testler/test-rol.js`.
- 3 Ekim'de bu belge için 3200'de, sıfırlanmış ve tohumlanmış `egitimevi_test` üzerinde koşuldu: `GECTI: 30   KALDI: 0`, çıkış 0,
  1 saniyeden kısa; sunucu günlüğünde `API hatası` ya da `Veritabanı hatası` yoktu. Hemen ardından aynı sunucuda ikinci koşu 29/1
  ("Dikkat!"e bak). Belge denetlenirken (13:56) yeni bir test sunucusunda yeniden koşuldu: yine 30/0 (0,9 sn), ikinci koşu yine 29/1.
- Aynı alanda: [test-kapsam.md](test-kapsam.md) (rolün ders/sınıf kapsamı, hazır Öğretmen rolü ile özel rolün birleşimi),
  [yetki-denetimi.md](yetki-denetimi.md) (rol uçları yalnız müdüre), [test-okul-hayati.md](test-okul-hayati.md) (`yemek.yonet` ve
  `kulup.yonet` verilmiş rol), [test-okul-sayfasi.md](test-okul-sayfasi.md) (`okul.sayfa` verilmiş rol; Kodlayıcı şablonu),
  [test-etut.md](test-etut.md) (hazır Öğretmen rolünün silinemediği ve ayrıca verilemediği, rol şablonları, `etut.yoklama` ve
  `ogretmen.duzenle` verilmiş roller), `testler/test-siniflarim.js` (hazır Öğretmen rolünde `ogretmen.sonuclar`'ı
  kapatıp açma), [test-servis-konum.md](test-servis-konum.md) (okul konumunu öğretmenin koyamaması, müdürün koyması).

## Son durum

- `git log`: 2 commit.
  - `7a8b555 commit 504` (2026-09-26): 8b bölümü eklendi (21 satır). Aynı commit `sunucu/yetki.js`'e `okul.konum` yetkisini
    ("Okulun haritadaki yerini ayarlar") koydu ve "Kodlayıcı" şablonuna ekledi; `hesaplar.js`'te `POST /api/school/konum` "yalnız
    müdür"den `okul.konum` yetkisine, `GET /api/school/adres` "müdür ya da `okul.konum`"a geçti, konum değişikliği işlem kaydına
    (`okul.konum`, "Okulun haritadaki yeri değişti") yazılmaya başladı; ön yüzde `19e-servis-konum.js` ve `16b-okul-ayarlari.js`
    değişti, `06-menu.js` `okul.konum`'lu öğretmenin menüsüne "Okulun Konumu"nu ekledi; `test-okul-sayfasi.js`'teki Kodlayıcı şablonu
    denetimi "yalnız `okul.sayfa`"dan "`okul.sayfa` ve `okul.konum`"a geçti.
  - `3b18755 commit 352` (2026-09-26): dosya 109 satır olarak eklendi (1–8 ve 9. bölüm), `test-kapsam.js` ve `test-yetiskin.js` ile
    birlikte.
  - Paketin adı `tumtest.sh`'in sunuculu listesinde `f0556ca commit 137`'den (2026-08-29) beri var; ama dosya depoya 352'de geldi
    (git'e göre 137 ile 352 arasında depodan alınan bir kopyada bu paket "PAKET CALISMADI" verirdi).
- Açık iş yok; kod değiştirilmedi. Zayıf noktalar (ikinci koşuda "9-Z", `rol.yonet`'li öğretmenin denenmemesi) "Dikkat!"te.
- Planlı işlerden bu dosyayı etkileyecekler:
  - **"Özel roller: yeni yetkiler + yeni hazır şablonlar"** (öneri, onay bekliyor) — `okul.simge`, `tahta.yonet`, `toplanti.ac`,
    `basari.ekle`, `anket.olustur`, `okul.yedek` gibi yetkiler kataloğa girecek; 1. ve 9. bölüm sayıya değil kurala baktığı için
    kendiliğinden uyar, ama yeni yetkilerin ayrı ayrı denenmesi buraya ya da yeni bir pakete eklenmeli. Aynı işte "özel rollerde gruplu
    yetki" ("EKLENTİLER" tanımında da geçiyor) katalog biçimini değiştirirse `gruplar[].liste[].k` okuması bozulur.
  - **"Güvenlik denetimi"** — `rol.yonet`'li öğretmenin yetki dağıtma açığı kapatılınca bunu deneyen bir bölüm buraya eklenmeli.
  - **"Çalışan olarak ekleme"** — müdürün çalışana Öğretmen, özel rol ya da Kodlayıcı ataması; bugün `role-assign` yalnız öğretmeni
    kabul ediyor ("Öğretmen bulunamadı"), bu değişince 4. bölüme çalışan ataması da girmeli.
