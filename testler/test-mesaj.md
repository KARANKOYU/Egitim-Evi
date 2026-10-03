# testler/test-mesaj.js

Mesajlaşma ve duyuruları (`/api/mesajlar`) müdür, öğretmen, öğrenci ve yeni açılan bir veliyle deneyen sunuculu paket: kime
yazılabildiği, velinin kopyası, okundu bilgisi, yetkisiz hedefler, izin ayarı ve engel listesi, duyurular, uzun metin ve
silme (39 denetim).

## Bu dosya ne yapar?

Okulun mesaj kutusunun birkaç değişmez kuralı var ([../sunucu/bolumler/mesaj.md](../sunucu/bolumler/mesaj.md)):

- Öğrenci ve veli yalnız ilgili öğretmenlere ve müdüre yazabilir; öğrenci öğrenciye yazamaz, okulun rehberi herkese açılmaz.
- Öğrenciye giden her şeyin bir kopyası velisine de düşer ve velinin kutusunda "hangi çocuk için" yazar.
- Herkes "bana kimler yazabilsin" (herkes / yalnız personel / kimse) ve "şu kişiler bana yazamasın" (engel listesi) seçebilir;
  ama **duyurular bu ayarları aşar** (kar tatili duyurusu herkese ulaşmalı).
- Toplu gönderim ve duyuru yetki ister; alıcı mesajı yalnız kendi kutusundan kaldırır, gönderen tamamen siler.

Bu paket bunları gerçek uçlarla, sıfırlanmış test veritabanında dener. Önce bir veli hesabı kurar (kayıt, e-posta onayı,
çocuğun veli koduyla bağlanma), sonra hedef listelerine, kişiye mesaja, velinin kopyasına, okundu sayacına, yetkisiz
denemelere, izin ayarına, engel listesine, duyurulara, kırpılan uzun metne ve silmeye bakar.

## İçinde neler var?

### Yardımcılar ve hesaplar

- `kontrol(ad, sart, detay)`; denetim adları Türkçe harfsiz ("ogrenci", "veli cocuguna baglandi").
- `kayit(govde)` — paketin kendi kayıt yardımcısı: bot sorusunu çözer (`botCevabi`), `POST /api/register` gönderir
  (`kvkkOnay: true`, telefon `05321234567` + gövde), cevap `onayGerekli` ise e-postadaki onay bağlantısına "tıklar"
  (`epostaOnayla`). Hata durumunda fırlatmaz, cevabı döner.
- Ortak yardımcılar [giris.md](giris.md) üzerinden ([../araclar/giris.md](../araclar/giris.md)): `iste`, `epostaOnayla`,
  `girisYap`, `botCevabi`.
- **Hesaplar** ([seed.md](seed.md)): müdür `mudur@test.com` (`M`), Matematik öğretmeni `mat@test.com` (`O`), öğrenci
  `ogrenci1@test.com` (`S`); `ogrenci2@test.com`'un yalnız kimliği kullanılır. Paketin açtığı: "Veli Test",
  `veli-mesaj@test.com`, şifre `Test1234!`. Gövdedeki `role: 'parent'`, `city`, `district` alanlarını bugünkü kayıt okumaz;
  hesap rolsüz yetişkin açılır ve `POST /api/parent/link { code: <ogrenci1'in veli kodu> }` ile veli olur.

### Hazırlık (1)

Velinin `ogrenci1`'e bağlanması → 200.

### 1) Hedefler — `GET /api/mesajlar/hedefler` (6)

- Müdür: `topluIzin === true`, `okulIzin === true`, `siniflar` dizi.
- Öğrenci: `topluIzin === false`; `kisiler`'in hepsi `teacher` ya da `principal` rolünde; içinde `student` yok.

### 2) Kişiye mesaj (1) ve 3) velinin kopyası (5)

- Öğretmen öğrenciye "Deneme mesaji" yazar (`tur: 'mesaj'`, `hedef: { tur: 'kisi', kisiler: [ogrenci1] }`) → 200.
- `gonderilen === 2` (öğrenci + velisi).
- Velinin kutusunda (`GET /api/mesajlar`) mesaj var ve `cocukIcin` tek elemanlı (hangi çocuk için geldiği).
- Öğrencinin kutusunda da var; `okunmamis >= 1`.

### 4) Okundu işareti (3)

- Öğrenci `GET /api/mesajlar/<id>` ile açar → 200, `govde` dolu (açmak okundu yazar).
- Öğrencinin `okunmamis` sayısı tam bir azaldı.
- Gönderen aynı mesajı açınca `okuyanSayisi >= 1` (okundu bilgisini yalnız gönderen ve duyuruda müdür görür).

### 5) Yetkisiz hedef (3) — öğrenciyle

| Deneme | Cevap |
|---|---|
| `hedef: { tur: 'okul' }` | 400 "Tüm okula gönderme yetkin yok" |
| `tur: 'duyuru'` | 403 "Duyuru yayımlama yetkin yok" |
| `ogrenci2`'ye kişi mesajı | 400 "Seçtiğin kişilere yazma yetkin yok" |

### 6) Mesaj izin ayarı (3)

- Öğrenci `POST /api/mesajlar/ayar { kimden: 'personel', engelli: [] }` → 200.
- Veli öğrencisine yazar → 400 (denetim adı "sadece-personel ayari veliyi engelliyor"; "Dikkat!"e bak).
- Öğretmen yazar → 200.

### 7) Engel listesi (2)

- Öğrenci `{ kimden: 'herkes', engelli: [öğretmenin kimliği] }` kaydeder; öğretmen yazar → 400 (öğrenci elenince velisinin
  kopyası da eklenmez, alıcı kalmaz: "Alıcı kalmadı. Seçtiğin kişiler mesaj almayı kapatmış olabilir.").
- `GET /api/mesajlar/ayar` → `engelli` listesinde 1 kişi.

### 8) Duyuru ayarları aşıyor (2)

- Müdür okula "Kar tatili" duyurusu yayımlar → 200.
- Öğrencinin `GET /api/mesajlar/duyurular` listesinde "Kar tatili" var.

### 9) Sınıfa duyuru (4)

- Öğrencinin ayarı `herkes`'e, engel listesi boşa döner. Müdür `MESAJ-SINIF` sınıfını açar (zaten varsa hatası yok sayılır;
  sınıf `GET /api/school/classes` listesinden bulunur) → "test sinifi hazir".
- `ogrenci1` o sınıfa konur (`POST /api/school/class-assign`) → 200 (öğrenci 6-A'dan çıkar).
- Müdür sınıfa duyuru yayımlar (`hedef: { tur: 'sinif', siniflar: [...] }`) → 200 ve `gonderilen >= 2` (öğrenci + veli).

### 10) Uzun metin ve boşluk (4)

- Öğretmen 500 harflik konu ve 9000 harflik metin gönderir → 200 (patlamaz).
- Mesaj açılınca konu 120, metin 4000 harfe kırpılmış (`MESAJ_KONU_SINIR`, `MESAJ_GOVDE_SINIR`).
- Yalnız boşluktan konu (`'   '`) → 400 "Konu yaz".

### 11) Silme (5)

- Öğrenci 2. bölümdeki mesajı `POST /api/mesajlar/sil { id }` ile siler → 200 ("kutundan kaldırıldı"); kutusunda yok.
- Gönderen hâlâ açabiliyor → 200.
- Gönderen siler → 200 (tamamen); sonra açmaya kalkınca 404.

Toplam 1 + 6 + 1 + 5 + 3 + 3 + 3 + 2 + 2 + 4 + 4 + 5 = 39. Sonunda `GECTI: 39   KALDI: 0`; `KALDI` varsa çıkış kodu 1;
beklenmeyen hata `TEST HATASI:` ile yığını yazar.

## Kimle konuşur?

- **Modüller:** yalnız [giris.md](giris.md) (`araclar/giris.js`).
- **Sunucu uçları:**

  | Uç | Ne için | Belge |
  |---|---|---|
  | `GET /api/mesajlar/hedefler`, `GET/POST /api/mesajlar/ayar`, `GET /api/mesajlar`, `GET /api/mesajlar/duyurular`, `POST /api/mesajlar`, `GET /api/mesajlar/<id>`, `POST /api/mesajlar/sil` | denenen bölüm | [../sunucu/bolumler/mesaj.md](../sunucu/bolumler/mesaj.md) |
  | `GET /api/challenge`, `POST /api/register`, `POST /api/eposta-onay`, `POST /api/login`, `POST /api/login/dogrula` | velinin kaydı, girişler | [../sunucu/bolumler/kayit.md](../sunucu/bolumler/kayit.md) |
  | `POST /api/parent/link` | velinin çocuğa bağlanması | [../sunucu/bolumler/veli.md](../sunucu/bolumler/veli.md) |
  | `GET /api/school/students`, `POST /api/school/class`, `GET /api/school/classes`, `POST /api/school/class-assign` | öğrenci kimlikleri, test sınıfı | [../sunucu/bolumler/okul.md](../sunucu/bolumler/okul.md) |

- **Koruduğu kod:** `sunucu/bolumler/mesaj.js` — `mesajYazilabilirler` (kim kime yazabilir), `mesajAlicilariCoz` (hedef →
  alıcılar, velinin kopyası), `mesajGidebilirMi` (izin ayarı, engel, duyuru istisnası), `kutuSatiri` / `mesajOzeti`, uçlar;
  depolar [../sunucu/veri/depo/mesajlar.md](../sunucu/veri/depo/mesajlar.md) (`kutuOzeti`, `okunmamisSayisi`, `okundu`,
  `alicidanKaldir`, `sil`) ve [../sunucu/veri/depo/kullanicilar.md](../sunucu/veri/depo/kullanicilar.md) (`engelHaritasi`,
  `engelleriYaz`, `engelliler`, `veliHaritasi`, `mesajAyar`); yetkiler `mesaj.toplu`, `mesaj.herkese`
  ([../sunucu/yetki.md](../sunucu/yetki.md)); öğrencinin öğretmenleri ve sınıf öğrencileri ([../sunucu/iliskiler.md](../sunucu/iliskiler.md)).
- **Tablolar:** `mesajlar`, `mesaj_alicilari`, `mesaj_okumalari`, `mesaj_engelleri`, `kullanicilar` (`mesaj_kimden`),
  `veli_baglari`, `bildirimler` ([../sunucu/veri/sema/SEMA.md](../sunucu/veri/sema/SEMA.md)).
- **Ön yüz** (bu pakette tarayıcı yok): [../public/js/parcalar/19-mesajlar.md](../public/js/parcalar/19-mesajlar.md).
- **Onu çalıştıran:** `testler/tumtest.sh`, sunuculu döngüde `test-sifre`'den sonra, `test-devamsizlik`'ten önce; her paketten
  önce veritabanı sıfırlanır ve [seed.md](seed.md) çalışır.

## Nasıl çalışır (adım adım)?

```
M, O, S girer ; kayit(veli-mesaj) ─► e-posta onayı ─► veli girer ─► parent/link (ogrenci1'in veli kodu)
1)  hedefler: M toplu/okul/sınıf ; S yalnız öğretmen + müdür
2-3) O ─► S "Deneme mesaji" ─► 2 alıcı (S + veli) ; veli "kimin için" görür ; S okunmamış ≥ 1
4)  S açar ─► okunmamış −1 ; O okuyan sayısını görür
5)  S: okula / duyuru / başka öğrenciye ─► 400 / 403 / 400
6)  S ayar "personel" ─► veli 400, O 200
7)  S ayar "herkes" + O engelli ─► O 400 ; ayar geri okunur
8)  M okula duyuru ─► S'nin duyurularında
9)  S ayar sıfır ; MESAJ-SINIF ─► S oraya ─► M sınıfa duyuru ─► ≥ 2 alıcı
10) O uzun mesaj ─► 120 / 4000 kırpma ; boş konu 400
11) S kendinden kaldırır ─► O hâlâ görür ─► O siler ─► 404
```

## Dikkat!

- **6. bölümün "veliyi engelliyor" denetimi ayarı sınamıyor.** Veli öğrenciye hiçbir zaman yazamaz: `mesajYazilabilirler`
  velinin listesine yalnız müdürü ve çocuğunun öğretmenlerini koyar, istek ayara gelmeden "Seçtiğin kişilere yazma yetkin yok"
  ile 400 alır. 3 Ekim'de 3200'de paket bittikten sonra (öğrencinin ayarı yeniden `herkes`, engel listesi boş iken) aynı
  veliyle (rolü `parent`) aynı istek gönderildi — belgenin denetiminde bir kez daha: yine 400 ve aynı ileti; velinin hedef
  listesinde yalnız müdür vardı (öğrenci 9. bölümde dersi olmayan sınıfa taşındığı için öğretmen de yok). Aslında bugün bir
  öğrenciye yalnız öğretmen ve müdür ulaşabildiği için "yalnız personel" ayarı öğrencide hiçbir kişiyi elemiyor. Ayarın gerçek
  etkisi (ör. "yalnız personel" seçmiş bir öğretmene velinin yazamaması) bir öğretmen alıcıyla denenmeli. Kod değiştirilmedi.
- **8. bölüm duyurunun ayarı aştığını göstermiyor.** Başlık "mesajı kapatan öğrenci" der ama 7. bölüm ayarı `herkes`'e çekmiştir;
  `kapali` hiç denenmez ve engel listesinde müdür yoktur. Duyuru sıradan bir mesaj olsa da öğrenciye ulaşırdı. Kod tarafında
  istisna var (duyuruda ayar ve engel listesine bakılmıyor), ama bu paket onu kanıtlamıyor; öneri: duyurudan önce öğrencinin
  ayarını `kapali` yapıp müdürü engellemek.
- **Bu pakette denenmeyenler:** `kapali` ayarı, saatte 30 mesaj sınırı, `rol` hedefi ve `?tur=` süzgeci (bu dördü `testler/`
  altında hiçbir pakette yok); velinin öğretmene yazması. Başka pakette denenenler: gönderilenler kutusu `?kutu=giden`
  (okuyan / kişi sayısıyla) ve okundu listesi `GET /api/mesajlar/okuma` `testler/test-anket.js`'te, ekler
  `testler/test-yorum-ek.js`'te, mesaj düzeltme `testler/test-etut.js`'te.
- **Kırpma sessizdir.** Uzun konu ve metin hata vermeden 120 / 4000 harfe kesilir; kişiye "kısaltıldı" denmez. Paket bunu
  "patlamıyor" diye bekler.
- **Taze veritabanı ister.** Veli e-postası sabit (`veli-mesaj@test.com`); aynı veritabanında ikinci koşuda kayıt 400 alır
  (`kayit` fırlatmadığı için paket sürer, eski hesapla girilir) ve sonraki adımlar önceki koşunun mesajlarıyla karışır. 3 Ekim'de
  denendi: ikinci koşuda yalnız hazırlık denetimi kaldı ("Bu öğrenci zaten ekli"), öbürleri eski mesajlara rağmen geçti:
  `GECTI: 38   KALDI: 1`.
- **Seed'e bağlı:** `ogrenci1`'in 6-A dersleri üzerinden öğretmenleri olması (1. bölümdeki öğrenci hedefleri), seed hesapları.
  9. bölüm `ogrenci1`'i 6-A'dan çıkarır; ondan sonra öğrencinin öğretmeni kalmaz (sonraki adımlar etkilenmez, çünkü öğretmen ve
  müdür her öğrenciye yazabilir).
- **Varsayılan adres 3000 ve günlük.** `EE_BASE` vermeden çalıştırırsan kendi sunucunda veli hesabı açar, sınıf kurar, okula
  "Kar tatili" duyurusu yayımlar. Onay anahtarı ve iki adımlı kodlar `EE_LOG`'dan okunur ([giris.md](giris.md)).
- **Hız sınırları bellekte:** gönderen başına saatte 30 mesaj; bu paket en çok öğretmenle 5 gönderir.

## Testleri

- Bu dosyanın kendisi testtir; `testler/tumtest.sh` her tam koşuda çalıştırır. Aynı bölümün başka yönleri:
  `testler/test-etut.js` (düzeltme), `testler/test-anket.js` (okundu listesi), `testler/test-yorum-ek.js` (ekler),
  [yetki-denetimi.md](yetki-denetimi.md) ve [girdi-denetimi.md](girdi-denetimi.md) (yetkisiz ve bozuk istekler).
- Elle (Git Bash, proje kökünde; 3200'de sıfırlanmış `egitimevi_test` ile açılmış ve [seed.md](seed.md) ile tohumlanmış test
  sunucusu varken):

  ```
  EE_BASE=http://localhost:3200 EE_LOG=testler/test-sunucu.log node testler/test-mesaj.js
  ```

- 3 Ekim'de bu belge için 3200'de, yeni sıfırlanmış test veritabanı ve seed'le çalıştırıldı (belgenin denetiminde bir kez
  daha): `GECTI: 39   KALDI: 0`, çıkış 0, yaklaşık 1 saniye; sunucu günlüğünde `API hatası` ya da `Veritabanı hatası` yok.
  Ardından "Dikkat!"teki veli denemesi ve ikinci koşu yapıldı.

## Son durum

- `git log`: tek commit. Dosya `7f766ff commit 107` (2026-08-29) ile 225 satır olarak, mesaj ekranının CSS'i
  (`public/css/parcalar/19-mesajlar.css`) ile birlikte eklendi; o günden beri değişmedi.
- Bilinen açıklar (kod değiştirilmedi): 6. ve 8. bölümün denetimleri adlarının söylediğini kanıtlamıyor ("Dikkat!").
- Planlı işlerden bu dosyayı etkileyecekler:
  - **"Mesaj ayarları (çark), Bu mesajı bildir, …"** — tanıma göre okulun ayarı belirleyecek: öğrenci ve veli kime yazabilir
    (müdür ve yönetim, kendi öğretmenleri, okuldaki bütün öğretmenler; öğrencide "sınıf arkadaşları" varsayılan kapalı), öğrenci
    ve veli için günlük mesaj sınırı (varsayılan 20), mesaja dosya ekleyebilenler; kişinin kendi ayarı okulunkini yalnız
    daraltır. 1. ve 5. bölümdeki "öğrenci öğrenciye yazamaz" beklentisi okulun ayarına bağlanacak, 6.–7. bölüm yeniden
    yazılmalı (o sırada personel ayarı öğretmen alıcıyla denenebilir). "Bu mesajı bildir" de yeni uçlar getirecek.
  - **"MESAJ ETİKETLERİ (Şikâyet, Önemli, Durum)"** — etiketli mesajın silinme kuralları (çözülünce 1 gün, bakılmazsa 1 hafta)
    11. bölümün silme davranışına eklenir.
  - **"Düzenleyiciler"** — hazır mesaj şablonları (`{öğrenci}`, `{sınıf}`) ve ileri tarihli gönderim yeni gönderme yolları
    getirecek.
  - **"Optimizasyon + saklama süreleri"** — mesajlar 1 yıl saklanacak.
  - **"T.C. kimlik no bütün hesaplarda zorunlu"** (kod Linux'ta) — `kayit` gövdesine T.C. no eklenmeli.
  - **"Arayüz önizlemesi"** — 3 Ekim'de tasarım önizlemesinde (Tasarım 1) velide her çocuk ayrı oturum yapıldı; bu, kod
    değil önizleme. Tasarım seçilip koda geçerse velinin kutusundaki "hangi çocuk için" (`cocukIcin`) gösterimi ve 3. bölümdeki
    beklenti değişebilir.
