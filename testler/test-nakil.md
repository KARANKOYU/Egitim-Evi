# testler/test-nakil.js

Öğrenci naklini uçtan uca deneyen sunuculu paket: başka okulun aynı T.C. no ile yeni hesap açamaması, T.C. + doğum tarihi
eşleşince hesabın yeni okula taşınması, eski kayıtların yeni okuldan gizli, öğrenci ve velisine salt okunur açık kalması ve
yanlış doğum tarihi denemesinin kilitlenmesi (33 denetim).

## Bu dosya ne yapar?

Eğitim Evi'nde öğrenci hesabı okula değil **kişiye** aittir ([../sunucu/bolumler/nakil.md](../sunucu/bolumler/nakil.md)). Bir
öğrenci okul değiştirdiğinde yeni okul "Öğrenci ekle"de onun T.C. no'sunu yazar; sistem yeni hesap açmaz, var olan hesabı taşır.
Ama yalnız T.C. no bilmek yetmez (başkasının çocuğunu okuluna almak kolay olurdu): doğum tarihi de eşleşmeli, yanlış tahminler
saatte 10 ile sınırlı. Taşınınca öğrencinin kullanıcı adı, şifresi, veli kodu ve velileri aynı kalır; eski okulun ödev ve
devamsızlık kayıtları o okulun malı olarak kalır, yeni okul görmez. Öğrenci ve velisi eğitim yılı seçicisinde "önceki okul"
dönemini seçip eski kayıtları salt okunur görür.

Bu paket bütün bu sözleri sıfırlanmış test veritabanında, iki gerçek okulla dener: seed'in okulu (A, "Test Ortaokulu") bir
öğrenci açar, ona ödev verir, devamsızlık girer, veliyi bağlar; yönetici ikinci bir okul (B) açar; B aynı T.C. ile önce doğum
tarihsiz, sonra yanlış, sonra doğru doğum tarihiyle dener; ardından öğrencinin, iki okulun ve velinin ne gördüğüne bakar, en
sonda deneme kilidini zorlar.

## İçinde neler var?

### Yardımcılar

- `kontrol(ad, sart, detay)`, `J(x)` (220 harflik JSON), `gun(n)` — bugünden `n` gün sonrası, `YYYY-AA-GG` (UTC günü).
- `z` — `Date.now().toString(36)`: bu koşuya özgü ek.
- Ortak yardımcılar [giris.md](giris.md) üzerinden ([../araclar/giris.md](../araclar/giris.md)): `iste`, `girisYap`, `hesapAc`,
  `kisiKodu`, `kisilikGec`, `tcUret` (geçerli rastgele T.C. no).

### Hesaplar ve veri

- Seed'den ([seed.md](seed.md)): yönetici (`A`), okul A'nın müdürü `mudur@test.com` (`M`), Matematik öğretmeni Ayşe Kaya
  `mat@test.com` (`O`).
- Paketin açtıkları: öğrenci **Deniz Göçer** (rastgele T.C., doğum `14.05.2013`, kullanıcı adı `deniz<z>`) okul A'da;
  sınıf `NAKIL-<z>` (Matematik, haftada 4 saat, Ayşe Kaya'ya atanır; Pazartesi 08:00–08:40 ders saati); ödev
  "Eski okul ödevi <z>" (başlangıç `gun(-3)`, son teslim `gun(3)`); son pazartesiye `yok` devamsızlığı; rolsüz yetişkin
  `nakilveli<z>` ("Nakil Veli") — öğrencinin veli koduyla veli olur; okul B'nin müdürü olacak `nakilmudur<z>` ("Burcu Yeni",
  kendi şifresiyle kaydolur); okul B: "Nakil Deneme Ortaokulu <z>", Ankara / Çankaya, adresi `nakil-<z>`.

### 0) Hazırlık (denetimsiz)

`M` ve `O` için `GET /api/egitim-yili` → aktif yıl → `POST /api/egitim-yili/bak` (yorum: önceki paketler eski yıla bakıyor
olabilir).

### 1) Eski okulda öğrenci ve kayıtları (5)

- `M` → `POST /api/school/hesap-ac { rol: 'student', ad, soyad, tc, dogum, kullaniciAdi, password }` → 200 ve `nakil` yok.
  Öğrenci bir kez girer; aydınlatma onayı eskiyse `POST /api/kvkk-onay`.
- Sınıf, ders, öğretmen ataması, sınıfa yerleştirme; `O` ödevi verir → 200.
- Ders saati eklenir; `M` son pazartesi için `POST /api/devamsizlik/isaretle { durum: 'yok' }` → 200.
- Öğrencinin `/api/progress`'inde ödev görünüyor.
- Veli `POST /api/parent/link { code: <öğrencinin veli kodu> }` → 200 (bağ nakilden ÖNCE kurulur).

### 2) Yeni okul (1)

Burcu Yeni kendi yetişkin hesabını açar, girer, kişi kodunu alır; yönetici `POST /api/admin/okul-ac { schoolName, city,
district, kisaAd, mudurKodu }` ile okul B'yi açıp onu müdür yapar → 200. Sonra yeniden girer; tek portalı olduğu için doğrudan
müdür rolündeyse o anahtar, değilse `GET /api/kisilikler`'deki `principal` rolüne `kisilikGec` ile geçilir (`MB`).

### 3) Aynı T.C. ile ekleme (6)

| Kim, ne gönderir | Beklenen |
|---|---|
| `MB`: ad, soyad, T.C. (doğum yok) | 409 `{ nakil: 'dogum' }` — yeni hesap açılmaz, doğum tarihi istenir |
| `MB`: doğum `15.05.2013` (bir gün yanlış) | 409, iletide "eşleşmedi" |
| (öğrencinin `/api/progress`'i) | ödev hâlâ orada: yanlış denemede hesap yerinde |
| `MB`: doğum `14.05.2013` | 200, `hesap.nakil === true`, aynı `id`, aynı kullanıcı adı |
| `MB`: aynı istek bir kez daha | 400, iletide "okulda başka bir hesapta" |
| `M` (okul A): T.C., doğumsuz | 409 `{ nakil: 'dogum' }` — eski okul da aynı T.C. ile yeni hesap açamaz |

### 4) Öğrenci yeni okulda (8)

- Aynı kullanıcı adı ve şifreyle giriyor; `GET /api/me`'de okul adı "Nakil Deneme…".
- Şimdiki görünümde (`/api/progress`) eski okulun ödevi yok.
- `GET /api/egitim-yili` listesinde `gecmis` bir dönem var; adı okul adını (`/Nakil|Ortaokulu|Lisesi|Okul/i`) ve eski sınıfı
  (`NAKIL-`) taşıyor.
- O döneme `bak` → 200, `arsiv === true`; şimdi eski ödev görünüyor; `GET /api/devamsizlik/benim`'de `sayim.yok >= 1`.
- Aktif döneme dönünce `sayim.yok === 0`.

### 5) Okullar ne görüyor (6)

- `MB`: `GET /api/progress?studentId=` → 200 ama eski ödev yok; `GET /api/devamsizlik/ogrenci?studentId=` → 200 ve
  `sayim.yok === 0`; öğrencinin geçmiş dönemine `bak` → 404 (o dönem yalnız öğrencinin listesinde).
- `M`: aynı öğrencinin `/api/progress`'i → 403; okul A'nın öğrenci listesinde yok. Okul B'nin listesinde var.

### 6) Veli (6)

- `GET /api/parent/children`'da çocuk duruyor (bağ nakilden sonra sürüyor).
- `GET /api/egitim-yili?ogrenci=<id>` → 200, geçmiş dönem var, `yonetebilir === false`.
- `POST /api/egitim-yili/bak { id: <geçmiş>, ogrenci }` → 200, `arsiv === true`; `/api/progress?studentId=` eski ödevi
  gösteriyor; aktif döneme dönünce gizli.
- `M` (artık ilgisiz) `GET /api/egitim-yili?ogrenci=` → 403.

### 7) Deneme sınırı (1)

`M` en çok 12 kez yanlış doğum tarihiyle dener (`01.01.2012`'den başlayıp ocak ayının 1–9'u arasında dönerek); 429 gelince
durur. 429 gelmişse geçer.

Toplam 5 + 1 + 6 + 8 + 6 + 6 + 1 = 33. Sonunda `GECTI: 33   KALDI: 0`; `KALDI` varsa çıkış kodu 1; beklenmeyen hata
`TEST HATASI:` ile yığını yazar.

## Kimle konuşur?

- **Modüller:** yalnız [giris.md](giris.md) (`araclar/giris.js`).
- **Sunucu uçları:**

  | Uç | Ne için | Belge |
  |---|---|---|
  | `POST /api/school/hesap-ac` | öğrenci açma ve nakil (T.C. başka okuldaysa `nakil.nakilEt`'e gider) | [../sunucu/bolumler/hesaplar.md](../sunucu/bolumler/hesaplar.md), [../sunucu/bolumler/nakil.md](../sunucu/bolumler/nakil.md) |
  | `GET /api/egitim-yili` (`?ogrenci=`), `POST /api/egitim-yili/bak` | yıl ve önceki okul seçici | [../sunucu/bolumler/egitim-yili.md](../sunucu/bolumler/egitim-yili.md) |
  | `GET /api/progress` (`?studentId=`) | ödevlerin görünürlüğü | [../sunucu/bolumler/ilerleyis.md](../sunucu/bolumler/ilerleyis.md) |
  | `POST /api/devamsizlik/isaretle`, `GET /api/devamsizlik/benim`, `GET /api/devamsizlik/ogrenci` | devamsızlık | [../sunucu/bolumler/devamsizlik.md](../sunucu/bolumler/devamsizlik.md) |
  | `POST /api/assignments` | eski okulun ödevi | [../sunucu/bolumler/odev.md](../sunucu/bolumler/odev.md) |
  | `POST /api/school/class`, `GET /api/school/classes`, `POST /api/school/lesson`, `GET /api/school/schedule`, `GET /api/school/teacher-list`, `POST /api/school/lesson-update`, `POST /api/school/class-assign`, `POST /api/school/schedule-add`, `GET /api/school/students` | okul A'nın kurulumu, öğrenci listeleri | [../sunucu/bolumler/okul.md](../sunucu/bolumler/okul.md) |
  | `POST /api/parent/link`, `GET /api/parent/children` | veli bağı | [../sunucu/bolumler/veli.md](../sunucu/bolumler/veli.md) |
  | `POST /api/admin/okul-ac` | okul B | [../sunucu/bolumler/yonetici-okul.md](../sunucu/bolumler/yonetici-okul.md) |
  | `GET /api/kisilikler`, `POST /api/kisilik/gec` | yeni müdürün kişi kodu ve rolüne geçiş | [../sunucu/bolumler/kisilik.md](../sunucu/bolumler/kisilik.md) |
  | `GET /api/me`, `POST /api/kvkk-onay`, giriş ve kayıt uçları | öğrencinin okulu, onay, hesaplar | [../sunucu/bolumler/kayit.md](../sunucu/bolumler/kayit.md) |

- **Koruduğu kod:** `sunucu/bolumler/nakil.js` (`baskaOkulOgrencisi`, `nakilEt`: doğum denetimi, `nakil:<kişi>` deneme sayacı,
  geçmiş satırları, okuldan çıkarma, taşıma işlemi); `hesaplar.js`'in `hesap-ac` dalı ve `hesapDogrula`'nın T.C. denetimleri;
  `egitim-yili.js`'in `yilBilgisi` (geçmiş okul dönemleri), `bak`, `bakisKisisi`; depolar
  [../sunucu/veri/depo/ogrenci-gecmisi.md](../sunucu/veri/depo/ogrenci-gecmisi.md) (`ekle`, `listesi`, `okuldanCikar`) ve
  [../sunucu/veri/depo/kullanicilar.md](../sunucu/veri/depo/kullanicilar.md) (`ogrenciTcIle`, `tcVarMi`); yanlış deneme sayacı
  `hataSay` / `hataSiniriDoldu` ([../sunucu/guvenlik.md](../sunucu/guvenlik.md)).
- **Tablolar:** `kullanicilar`, `ogrenci_gecmisi` (şema 021, [../sunucu/veri/sema/SEMA.md](../sunucu/veri/sema/SEMA.md)),
  `okullar`, `egitim_yillari`, `odevler`, `devamsizlik`, `veli_baglari`, `siniflar`, `dersler`, `ders_programi`.
- **Ön yüz** (bu pakette tarayıcı yok): nakil sorusu ve sonucu [../public/js/parcalar/10b-hesaplar.md](../public/js/parcalar/10b-hesaplar.md)
  (409 `nakil: 'dogum'` gelince doğum tarihi alanı), yıl seçicideki "Önceki okullar" [../public/js/parcalar/16-egitim-yili.md](../public/js/parcalar/16-egitim-yili.md),
  velinin ekranları [../public/js/parcalar/27-veli-panel.md](../public/js/parcalar/27-veli-panel.md).
- **Onu çalıştıran:** `testler/tumtest.sh`, sunuculu döngüde `test-yorum-ek`'ten sonra, `test-ozellikler`'den önce; her
  paketten önce veritabanı sıfırlanır ve [seed.md](seed.md) çalışır.

## Nasıl çalışır (adım adım)?

```
A, M, O girer ; M ve O aktif yıla döner
1) M: öğrenci (T.C., 14.05.2013) ─► NAKIL-z sınıfı, Matematik, Ayşe Kaya ─► O ödev verir ─► M "yok" girer
   veli kayıt ─► parent/link (veli kodu)
2) nakilmudur kaydolur ─► kişi kodu ─► A okul-ac (okul B) ─► MB
3) MB hesap-ac aynı T.C.:  doğumsuz 409 ─► yanlış doğum 409 ─► doğru doğum 200 nakil ─► tekrar 400
   M aynı T.C. ─► 409 (doğum iste)
4) öğrenci: aynı ad/şifre, okul B ; şimdi eski ödev yok ; geçmiş dönem ─► arşivde ödev ve devamsızlık ; geri dön
5) MB eski kaydı görmez, geçmiş döneme bakamaz ; M öğrenciyi göremez (403) ; listeler
6) veli: bağ sürüyor ; ?ogrenci= ile geçmiş dönem ─► eski ödev ; geri dön ; M 403
7) M ×12 yanlış doğum ─► 429 ?
```

## Dikkat!

- **Deneme kilidi ekleyen kişiye bağlı, öğrenciye değil.** Sayaç `nakil:<me.id>`: aynı öğrenci için farklı personel hesapları
  (öğrenci açma yetkisi olan her biri) ayrı ayrı saatte 10 deneme yapabilir; sayaç bellekte durduğu için sunucu yeniden
  başlayınca sıfırlanır (koddan). Kod yorumu amacı "T.C. no'yu bilen biri doğum tarihini tahmin ederek başkasının çocuğunu
  okuluna alamasın" diye veriyor; bu sınır tek bir kişiyi yavaşlatır, kurumu değil. "Güvenlik denetimi" işine not.
- **7. bölüm yalnız 429'a bakar.** Önceki denemelerin 409 olduğunu denetlemez. Koddan: `M`'nin 3. bölümdeki doğumsuz denemesi
  sayılmaz (yalnız yanlış doğum tarihi sayılır), sayaç onuncu yanlışta dolar ve 429 on birinci denemede gelir. Bölüm `M`'nin
  sayacını doldurduğu için aynı sunucuda bir saat boyunca `M`'nin her nakil denemesi 429 alır. 3 Ekim'de belgenin denetiminde
  paket, testi diske dokunmadan bellekte bir günlük satırı ve bir ek istek eklenerek sıfırlanmış sunucuda çalıştırıldı: ilk 10
  deneme 409, 11. deneme 429 verdi; kilitten sonra `M` **doğru** doğum tarihiyle de 429 aldı.
- **Denenmeyenler:** velinin okulunun yeni okula geçmesi, öğrenciye / veliye / eski müdüre giden bildirimler, öğrencinin eski
  okulun etüt, kulüp ve servis listelerinden çıkması ve kayıtlı servis konumunun silinmesi (`okuldanCikar`), nakilde sınıf ve okul no verilmesi, kullanıcı adı yeni
  okulda alınmışsa T.C.'den ya da addan türetilmesi. Yeni okulda aynı T.C.'li başka bir hesap varken nakil reddi
  [test-cakisma.md](test-cakisma.md)'nın 7. bölümünde denenir.
- **Geçmiş dönemin adı okulun yıllarına bağlı.** Okul A'da yıl tanımlıysa ad "yıl · okul · sınıf", değilse "okul · sınıf"
  olur; test ikisini de kabul edecek biçimde yalnız okul adı ve `NAKIL-` sınıf adına bakar.
- **Tarihler UTC.** `gun()` ve "son pazartesi" `toISOString()` ile yazılır; Türkiye'de gece 00:00–03:00 arasında bir gün geri
  kayar (pazartesi yerine pazar). Devamsızlık işaretlemesi günün ders günü olup olmadığına bakmadığı için paket o saatte de
  geçmeli (koddan; gece denenmedi).
- **Seed'e bağlı:** `mudur@test.com`, `mat@test.com`, öğretmen listesinde "Ayşe Kaya" adı, okul A'nın adında "Ortaokulu" geçmesi,
  yöneticinin şifresi (sunucu `EE_ADMIN_SIFRE` ile açılmış olmalı).
- **Varsayılan adres 3000 ve günlük.** `EE_BASE` vermeden çalıştırırsan kendi sunucunda okul açar, öğrenci taşır. İki adımlı
  kodlar ve onay anahtarları `EE_LOG`'dan okunur ([giris.md](giris.md)); öğrenci girişi tek adımdır.

## Testleri

- Bu dosyanın kendisi testtir; `testler/tumtest.sh` her tam koşuda çalıştırır. Aynı alanda: [test-cakisma.md](test-cakisma.md)
  (iki okulda aynı T.C., nakil reddi), [test-egitim-yili.md](test-egitim-yili.md) (yıl seçici), [test-devamsizlik.md](test-devamsizlik.md).
- Elle (Git Bash, proje kökünde; 3200'de sıfırlanmış `egitimevi_test` ile, `EE_ADMIN_SIFRE` verilerek açılmış ve
  [seed.md](seed.md) ile tohumlanmış test sunucusu varken):

  ```
  EE_BASE=http://localhost:3200 EE_LOG=testler/test-sunucu.log node testler/test-nakil.js
  ```

- 3 Ekim'de bu belge için 3200'de, yeni sıfırlanmış test veritabanı ve seed'le çalıştırıldı (belgenin denetiminde bir kez
  daha): `GECTI: 33   KALDI: 0`, çıkış 0, yaklaşık 1,5 saniye; sunucu günlüğünde `API hatası` ya da `Veritabanı hatası` yok.
  Deneme kilidinin kaçıncı denemede geldiği "Dikkat!"te.

## Son durum

- `git log`: 2 commit.
  - `0acca75 commit 516` (2026-09-27, kişi kodu ve portallar): okul B'nin açılışı yeni yola geçti — eskiden yönetici okulu
    `mudur: { eposta, ad, soyad, kullaniciAdi, telefon, sifre }` nesnesiyle açıyor, paket o müdürle girip aydınlatmayı
    onaylıyor ve şifresini değiştiriyordu; artık müdür kendi hesabını açar, kişi kodunu verir (`mudurKodu`), yönetici okulu
    açar; paket müdür rolüne gerekirse `kisilikGec` ile geçer. `kisiKodu` içe aktarıldı.
  - `fb65e8d commit 422` (2026-09-26): dosya 168 satır olarak `sunucu/bolumler/nakil.js`, `egitim-yili.js`'in geçmiş okul
    dönemleri, `sunucu/veri/depo/ogrenci-gecmisi.js` ve şema `021-ogrenci-gecmisi.sql` ile birlikte eklendi.
- Bilinen açıklar (kod değiştirilmedi): deneme kilidinin kişiye bağlı ve bellekte olması, denenmeyen nakil yan etkileri
  ("Dikkat!").
- Planlı işlerden bu dosyayı etkileyecekler:
  - **"Tek kişi tek hesap + portallar öğrencide de"** (onaylı, canlıdan önce) — öğrenci aynı anda okul ve dershanede olabilecek,
    T.C. + doğum tarihi eşleşince portal kendiliğinden düşecek. 3. ve 5. bölümdeki "eski okul artık göremez", "aynı T.C. ile
    açamaz" beklentileri kurumun türüne göre değişecek.
  - **"Optimizasyon + saklama süreleri"** — "öğrenci/veli yalnız son 1 geçmiş yıl" kuralı 4. ve 6. bölümdeki geçmiş okul
    görünümünü sınırlayabilir.
  - **"Yıl geçişi"** (yeni yıl sihirbazı, mezunlar) — yıl listesinin biçimi değişebilir.
  - **"T.C. kimlik no bütün hesaplarda zorunlu"** (kod Linux'ta) — velinin ve yeni müdürün `hesapAc` kaydı T.C. göndermeli.
  - **"Devamsızlık: tarih aralığı + gün gün / ders ders"** — `devamsizlik/benim` ve `/ogrenci`'nin `sayim` biçimi değişirse 4. ve
    5. bölüm güncellenmeli.
  - **"Arayüz önizlemesi"** — 3 Ekim'de tasarım önizlemesinde (Tasarım 1) velide her çocuk ayrı oturum yapıldı; bu, kod
    değil önizleme. Tasarım seçilip koda geçerse velinin `?ogrenci=` ile yıl seçmesi değişebilir; 6. bölüm etkilenir.
  - **"Güvenlik denetimi"** — nakil deneme kilidinin kapsamı ("Dikkat!").
