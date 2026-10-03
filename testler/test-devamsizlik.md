# testler/test-devamsizlik.js

Ders yoklamasının temel yolunu (öğretmenin dersleri, yoklama ekranı, kaydetme, üzerine yazma, ileri tarih, öğrencinin ve
velinin dökümü, müdürün okul özeti, yetkisiz yoklama) gerçek uçlardan deneyen sunuculu test paketi (25 denetim).

## Bu dosya ne yapar?

Öğretmen derste yoklama alır: gelmeyeni "Gelmedi", geç geleni "Geç geldi", raporlu olanı "İzinli" işaretler (sunucudaki
adlar: `yok`, `gec`, `izinli`; gelen `var` = "Geldi").
Öğrenci kendi devamsızlığını, veli çocuğununkini, müdür bütün okulun özetini görür. Bu paket o temel akışı uçtan uca dener:
sunucu tarafı [../sunucu/bolumler/devamsizlik.md](../sunucu/bolumler/devamsizlik.md), ön yüz
[../public/js/parcalar/18-devamsizlik.md](../public/js/parcalar/18-devamsizlik.md).

Paketin dayandığı üç kural var, hepsi sunucudaki koddan:

1. **"Geldi" saklanmaz.** Yoklamada yalnız devamsızlıklar (`yok`, `gec`, `izinli`) satır olur; `var` hiç yazılmaz.
   Böylece tablo gereksiz büyümez. Kaydın cevabındaki `yazilan` sayısı bu yüzden "işaretlenen öğrenci" değil
   "yazılan devamsızlık" sayısıdır.
2. **Aynı dersin aynı günü yeniden kaydedilirse üzerine yazılır.** O derse ait o günün eski kayıtları silinip yenileri
   yazılır (tek işlemde); ikinci kayıt tekrar değil düzeltmedir.
3. **Kim neyi görür:** öğretmen yalnız kendi dersine yoklama alır (ya da müdür ona o ders/sınıf için açıkça kapsam
   vermiştir); öğrenci yalnız kendini, veli yalnız bağlı çocuğunu görür; okul özetini `devamsizlik.gor` yetkisi olan görür.

Dosya başı yorumu yalnız "Devamsizlik testleri." der; çıktı iletileri de eski düzende Türkçe harfsizdir ("ogretmen kendi
dersini goruyor").

## İçinde neler var?

### Yardımcılar

- `kontrol(ad, sart, detay)` — `GECTI`/`KALDI` satırı yazar, sayaçları artırır.
- `kayit(govde)` — kendi kayıt yardımcısı: bot sorusunu çözer (`botCevabi`), `POST /api/register`'a `kvkkOnay: true` ve
  bir telefonla gönderir; cevap `onayGerekli` ise e-posta onay bağlantısına "tıklar" (`epostaOnayla`). Dönen cevaba
  bakılmaz.
- `gun(n)` — bugünden `n` gün sonrası (eksiyse öncesi), `YYYY-AA-GG`; `toISOString()` ile yazıldığı için UTC takvim
  günüdür ("Dikkat!"e bak).

Giriş işleri [giris.md](giris.md) üzerinden `araclar/giris.js`'ten gelir ([../araclar/giris.md](../araclar/giris.md)):
`iste`, `girisYap`, `botCevabi`, `epostaOnayla`.

### Hesaplar ve hazırlık

Seed hesaplarıyla ([seed.md](seed.md)) girer: müdür (`mudur@test.com`, `M`), Matematik öğretmeni Ayşe Kaya
(`mat@test.com`, `O`), sonra öğrenciler `ogrenci1@test.com` (Zeynep Şahin, `S`) ve `ogrenci2@test.com` (Burak Öztürk,
`S2`), en sonda Fen öğretmeni (`fen@test.com`).

Hazırlıkta (sonuçlarının çoğu ayrıca denetlenmez):

- Müdür `DV-SINIF` adlı yeni bir sınıf açar (`POST /api/school/class`) ve `GET /api/school/classes`'tan bulur.
- Bu sınıfa haftada 4 saatlik **Matematik** dersi açar (`POST /api/school/lesson`); dersin kimliği `dersId`.
- `GET /api/school/students`'tan iki seed öğrencisini e-postalarıyla bulur (`o1`, `o2`) ve ikisini de `DV-SINIF`'a
  koyar (`POST /api/school/class-assign`). Bu, onları seed'in `6-A` sınıfından çıkarır.
- `GET /api/school/teacher-list`'te adı "Ayşe Kaya" olan öğretmeni bulup derse atar (`POST /api/school/lesson-update`).

### Denetimler (bölüm bölüm, 25)

**Hazırlık (2):** sınıf bulundu; ders açıldı (`lesson.id` geldi).

**1) Öğretmenin dersleri (1):** `GET /api/devamsizlik/derslerim` (öğretmen) listesinde yeni ders var.

**2) Yoklama ekranı (3):** `GET /api/devamsizlik/yoklama?lessonId=…` (tarih verilmez, sunucu bugünü alır) → 200;
sınıfın tam **2** öğrencisi listelenir; hepsinin durumu varsayılan `var`.

**3) Yoklama kaydı (2):** dün için (`gun(-1)`) `o1` → `yok` (not: "Haber verilmedi"), `o2` → `var` gönderilir →
200 ve `yazilan === 1` (`var` yazılmadı).

**4) Öğrenci kendi dökümünü görüyor (4):** `S` ile `GET /api/devamsizlik/benim` → `sayim.yok === 1`; tek kayıt, dersi
`Matematik`; kaydı alan (`alan`) "Ayşe Kaya". `S2`'nin dökümünde `sayim.yok === 0`.

**5) Veli çocuğunu görüyor (2):** `veli-devam@test.com` adresiyle "Devam Veli" kaydolur (yardımcı `kayit`), girer,
`o1`'in veli koduyla (`o1.code`) `POST /api/parent/link` yapar. `GET /api/devamsizlik/ogrenci?studentId=<o1>` → 200
ve `sayim.yok === 1`; `o2` için → 403.

**6) Öğrenci başkasının kaydını göremez (1):** `S` ile `GET /api/devamsizlik/ogrenci?studentId=<o2>` → 403.

**7) Üzerine yazma (3):** aynı gün yeniden: `o1` → `izinli` ("Rapor getirdi"), `o2` → `gec` → 200 ve `yazilan === 2`.
`S`'nin dökümünde artık `yok: 0`, `izinli: 1` ve `toplam === 1` (kayıt ikiye çıkmadı, yenisi eskisinin yerine geçti).

**8) İleri tarih (1):** `gun(3)` için yoklama → 400 ("İleri tarihe yoklama alınamaz").

**9) Okul özeti (4):** `GET /api/devamsizlik/ozet` (müdür) → 200; `satirlar` en az 2; her satırın sınıfı `DV-SINIF`.
Öğrenci aynı ucu isteyince 403.

**10) Yetkisiz yoklama (2):** Fen öğretmeni bu Matematik dersine `gun(-2)` yoklaması gönderir → 403; öğrenci
gönderir → 403.

Sonunda boş bir satır ve `  GECTI: 25   KALDI: 0` (başında iki boşluk). `KALDI` varsa çıkış kodu 1. Beklenmeyen hata
`TEST HATASI:` ile iletiyi ve yığını yazar, çıkış kodu 1.

## Kimle konuşur?

- **Modüller:** yalnız [giris.md](giris.md) (`araclar/giris.js`).
- **Sunucu uçları:**

  | Uç | Ne için | Belge |
  |---|---|---|
  | `GET /api/devamsizlik/derslerim`, `GET` ve `POST /api/devamsizlik/yoklama`, `GET /api/devamsizlik/benim`, `GET /api/devamsizlik/ogrenci`, `GET /api/devamsizlik/ozet` | paketin asıl konusu | [../sunucu/bolumler/devamsizlik.md](../sunucu/bolumler/devamsizlik.md) |
  | `POST /api/school/class`, `GET /api/school/classes`, `POST /api/school/lesson`, `POST /api/school/lesson-update`, `GET /api/school/students`, `POST /api/school/class-assign`, `GET /api/school/teacher-list` | hazırlık | [../sunucu/bolumler/okul.md](../sunucu/bolumler/okul.md) |
  | `GET /api/challenge`, `POST /api/register`, `POST /api/eposta-onay`, `POST /api/login`, `POST /api/login/dogrula` | giriş ve velinin kaydı | [../sunucu/bolumler/kayit.md](../sunucu/bolumler/kayit.md) |
  | `POST /api/parent/link` | veliyi çocuğa bağlama | [../sunucu/bolumler/veli.md](../sunucu/bolumler/veli.md) |

- **Koruduğu kod:** en çok [../sunucu/bolumler/devamsizlik.md](../sunucu/bolumler/devamsizlik.md) (`yoklamaYetkisi`,
  `devamsizlikOzeti`, `var`'ın yazılmaması, üzerine yazma, ileri tarih); [../sunucu/veri/depo/devamsizlik.md](../sunucu/veri/depo/devamsizlik.md)
  (`dersGunu`, `dersGunuYaz`, `ogrencinin`, `okulunSonKayitlari`); yetkiler için [../sunucu/yetki.md](../sunucu/yetki.md)
  (`devamsizlik.al` öğretmende varsayılan açık, `devamsizlik.gor` müdürde); öğrenci–öğretmen ilişkisi için
  [../sunucu/iliskiler.md](../sunucu/iliskiler.md) (`sinifOgrencileri`, `teachersOfStudent`); özet yıla göre süzüldüğü
  için [../sunucu/bolumler/egitim-yili.md](../sunucu/bolumler/egitim-yili.md) (`yilSuz`, `yilDamgasi`).
- **Tablolar** (dolaylı): `devamsizlik`, `siniflar`, `dersler`, `kullanicilar`, `veli_baglari`, `eposta_onaylari`,
  `bildirimler`.
- **Rol:** öğretmen yoklama alır; öğrenci, veli, müdür görür. Ön yüzde aynı uçları
  [../public/js/parcalar/18-devamsizlik.md](../public/js/parcalar/18-devamsizlik.md) çağırır; bu pakette tarayıcı yok.
- **Onu çalıştıran:** `testler/tumtest.sh`, sunuculu paket döngüsünde (`test-mesaj`'dan sonra, `test-takvim`'den önce);
  her paketten önce sunucu sıfırlanmış veritabanıyla yeniden açılır ve [seed.md](seed.md) çalışır. Başka hiçbir kod bu
  dosyayı çağırmaz.

## Nasıl çalışır (adım adım)?

```
M (müdür), O (Ayşe Kaya) girer
hazırlık: DV-SINIF ─► Matematik dersi (4 saat) ─► o1, o2 DV-SINIF'a ─► ders Ayşe Kaya'ya
1) O: derslerim ─► yeni ders listede
2) O: yoklama ekranı ─► 2 öğrenci, ikisi de "var"
3) O: dün  o1=yok, o2=var ─► yazilan 1
4) S (o1): benim ─► yok 1, ders Matematik, alan Ayşe Kaya ;  S2 (o2): yok 0
5) "Devam Veli" kaydolur ─► o1'e bağlanır ─► o1'i görür (yok 1), o2'yi göremez (403)
6) S: o2'nin dökümü ─► 403
7) O: dün yeniden  o1=izinli, o2=gec ─► yazilan 2 ;  S: yok 0, izinli 1, toplam 1
8) O: 3 gün sonrası ─► 400
9) M: özet ─► ≥2 satır, hepsi DV-SINIF ;  S: özet ─► 403
10) fen: bu derse yoklama ─► 403 ;  S: yoklama ─► 403
```

Her adım bir öncekinin sonucuna dayanır: 7. bölüm 3. bölümün kaydını düzeltir, 9. bölümün iki satırı 7. bölümdeki `izinli`
ve `gec` kayıtlarıdır.

## Dikkat!

- **Taze seed ister.** Velinin adresi (`veli-devam@test.com`) ve sınıf adı (`DV-SINIF`) sabit, zaman damgasız. Aynı
  veritabanında ikinci kez çalıştırırsan (3 Ekim denetiminde denendi) paket çökmez ama `GECTI: 14   KALDI: 11` verir:
  sınıf zaten vardır (paket onu yine bulur), `POST /api/school/lesson` "Bu ders bu sınıfa zaten eklenmiş" ile 400 döner,
  `dersId` boş kalır ve derse bağlı her istek 400 "Ders bulunamadı" alır. Kalanlar: "ders acildi", "ogretmen kendi dersini
  goruyor", yoklama ekranının ilk iki denetimi, iki kayıt denetimi, "ogrenci dokumu geldi" ve "veli cocugunun
  devamsizligini goruyor" (ilk koşudan kalan kayıt artık `izinli`, `yok` değil), "ayni gun tekrar alinabiliyor" ve
  10. bölümün iki 403 denetimi (400 gelir). Dördü ise **yanlış nedenle geçer**: "varsayilan durum geldi" (boş listede
  `every` doğru döner), "ileri tarihe yoklama alinamiyor" (400'ün nedeni tarih değil, ders yok), "eski kayit ustune
  yazildi" ve "kayit tekrarlanmadi" (ilk koşunun kaydına bakarlar). Velinin kaydı da 400 alır (e-posta kayıtlı;
  yardımcı cevaba bakmaz) ama ilk koşudan kalan hesapla giriş olur. `tumtest.sh` her pakette veritabanını sıfırladığı için
  sorun olmaz.
- **Seed'e bağlı:** öğrenciler e-postalarıyla (`ogrenci1@test.com`, `ogrenci2@test.com`), öğretmen adıyla ("Ayşe Kaya")
  aranır; yoklama ekranının **tam 2** öğrenci beklemesi `DV-SINIF`'a yalnız bu ikisinin konmasına dayanır.
- **Velinin kaydında gönderilen `role: 'parent'`, `city`, `district` sunucuda kullanılmaz.** Kayıt her zaman rolsüz
  yetişkin hesabı açar; hesap veli koduyla `POST /api/parent/link` yapınca veli olur. Kullanıcı adı gönderilmediği için
  sunucu onu e-postanın `@` öncesinden türetir (`bosKullaniciAdi`). Bunlar eski düzenden kalan alanlar; test yine geçer.
- **Bağlama sonucu ayrıca denetlenmez.** `POST /api/parent/link` başarısız olursa bunu "veli cocugunun devamsizligini
  goruyor" denetiminin 403 ile kalmasından anlarsın.
- **Hazırlık öğrencileri 6-A'dan çıkarır** (`class-assign` taşır). Bu paketten sonra aynı veritabanında 6-A'ya bakan bir
  test çalışacak olsaydı boş sınıf bulurdu; `tumtest.sh` her paketi taze veritabanıyla açtığı için bugün etkisi yok.
- **`gun()` UTC günü verir.** Türkiye'de 00:00–03:00 arasında `gun(-1)` iki gün öncesini, `gun(3)` iki gün sonrasını
  verir. Sunucu "ileri tarih"i kendi yerel günüyle karşılaştırdığı için denetimler yine doğru sonuç verir (geçmiş geçmişte,
  gelecek gelecekte kalır); yalnız yazılan tarih bir gün kayar.
- **Bu paketin denemedikleri:** yoklamada durumu değişen öğrenciye ve velisine giden bildirim (yeni velinin bağlantısı
  yoklamadan sonra yapıldığı için burada görünmez), tek ders saatini işaretleme (`POST /api/devamsizlik/isaretle`), bir
  öğrencinin bir günü (`GET /api/devamsizlik/gun`), `gun` süzgeci, öğretmene ek rolle başka ders/sınıf için kapsam
  verilmesi. Bunların bir kısmı başka paketlerde ("Testleri"ne bak).
- **Varsayılan adres 3000.** `EE_BASE` vermeden çalıştırırsan kendi sunucunda sınıf, ders ve yoklama açar, seed
  öğrencilerini taşır; her zaman test sunucusunu kullan.

## Testleri

- Bu dosyanın kendisi testtir; `testler/tumtest.sh` her tam koşuda çalıştırır. Aynı alanda: `testler/test-bildirim.js`
  (yoklamanın ve `isaretle`'nin öğrenciye ve veliye bildirimi), `testler/test-egitim-yili.js`
  ([test-egitim-yili.md](test-egitim-yili.md); `isaretle` ve özetin yıla göre süzülmesi), `testler/test-siniflarim.js`,
  `testler/test-veli-coklu.js`, `testler/test-nakil.js`, `testler/test-ozellikler.js` (bölüm kapalıyken),
  [yetki-denetimi.md](yetki-denetimi.md) ve [girdi-denetimi.md](girdi-denetimi.md) (her uç her rolle, bozuk girdiyle).
- Elle (Git Bash, proje kökünde; 3200'de `tumtest.sh`'deki gibi açılmış ve [seed.md](seed.md) ile tohumlanmış test
  sunucusu varken):

  ```
  EE_BASE=http://localhost:3200 EE_LOG=testler/test-sunucu.log node testler/test-devamsizlik.js
  ```

- 3 Ekim sabahı bu belge için 3200'de, sıfırlanmış `egitimevi_test` ve seed'le koşuldu: `GECTI: 25   KALDI: 0`,
  yaklaşık 1 saniye; sunucu günlüğünde `API hatası` ya da `Veritabanı hatası` yok. Belgenin denetiminde yeniden koşuldu,
  sonuç aynı; ardından aynı veritabanındaki ikinci koşu "Dikkat!"teki sonucu verdi (günlükte yine hata yok).

## Son durum

- `git log`: tek commit. Dosya `31cb5f2 commit 39` (2026-08-28) ile 175 satır olarak eklendi (aynı commit ön yüzün
  `18-devamsizlik.js` parçasına 3 satır, `20-devamsizlik.css`'e 39 satır ve bir ekran görüntüsü ekledi); o günden beri
  değişmedi.
- Açık iş yok. Kod değiştirilmedi; "Dikkat!"teki kapsam boşlukları (bildirim, `isaretle`, `gun`) başka paketlerde.
- Planlı işlerden bu dosyayı etkileyecekler:
  - **"Devamsızlık: tarih aralığı + gün gün / ders ders + filtre"** (kod Linux'ta) — `benim`, `ogrenci` ve `ozet`
    cevaplarının biçimi (`sayim`, `toplam`, `satirlar`) değişebilir; 4., 5., 7. ve 9. bölümlerin beklentileri gözden
    geçirilmeli.
  - **"T.C. kimlik no bütün hesaplarda zorunlu"** — 5. bölümdeki velinin kaydı T.C. no göndermiyor; zorunlu olunca
    kayıt 400 alır ve veli adımı kalır.
  - **"Çalışan olarak ekleme"** — seed'in öğretmeni kişi koduyla eklenince rolsüz çalışan olarak gelecek;
    `teacher-list`'te "Ayşe Kaya" bulunamazsa hazırlık çöker ([seed.md](seed.md) "Son durum").
  - **"Optimizasyon + saklama süreleri"** (öğrenci/veli yalnız son 1 geçmiş yıl) ve **"Özel branş / ders"** (ders adı
    sabit listeden çıkarsa `Matematik` dersinin açılışı) dolaylı olarak dokunabilir.
