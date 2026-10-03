# testler/test-odev-saat.js

Ödevin saatlerini (son teslim saati varsayılan 12:00, bozuk saatin düzeltilmesi, gecikmenin saate göre hesaplanması, başlama
saati), süresi geçmiş ödevin sonucunun sonradan değiştirilmesini, yeniden açmayı, öğrencinin ödevi yıldızlamasını, takvimdeki
saati ve "Gelmedi (izinsiz)" sonucunu sunucu üzerinden deneyen sunuculu test paketi (38 denetim).

## Bu dosya ne yapar?

Eğitim Evi'nde ödevin son teslimi önce yalnız bir gündü. Sonra saat geldi: öğretmen "son teslim 09:20" diyebilsin (ders saatine
göre), demezse 12:00 sayılsın; eski kayıtlarda saat alanı boş olduğu için de 12:00 kabul edilsin. Saat gelince "gecikti mi?"
sorusu da gün değil an üzerinden hesaplanmaya başladı. Bu paket o kuralın her ucunu dener: öğretmenin listesinde, ödev
ayrıntısında, öğrencinin ilerleyiş ekranında ve takvimde aynı saat görünüyor mu?

Dosyanın başındaki yorum yalnız "teslim saati ve geçmiş ödevin sonuç düzenlemesi" der; paket zamanla büyümüş ve bugün şunları
da kapsar:

- Süresi geçmiş (ya da sonuçlandırılmış) bir ödevin sonucunu öğretmen sonradan değiştirebilir, ödevi yeniden açabilir.
- Öğrenci ödevi yıldızlar; yıldız yalnız onundur, öğretmen göremez.
- "Gelmedi (izinsiz)" sonucu kabul edilir, öğrencinin başarı oranına girer (izinli gelmemek girmez), öğretmenin özetinde sayılır.
- Başlama saati (ör. 08.09.2025 · 08:00): korunur, düzenlenir; aynı gün biten ödevde son saat başlamadan önce olamaz.

Bir öğretmenin gözünden düşün: "Matematik ödevini 09:20'ye kadar teslim edin" der, öğrenci Ödevler sayfasında ve takvimde
"09:20"yi görür; o an geçince ödev öğretmenin listesinde "gecikti" işaretini alır (işaret ödevin kendisinindir, öğrenci başına
değil). Bu paket o zincirin kopmadığını gösterir.

## İçinde neler var?

### Yardımcılar

- `kontrol(ad, sart, detay)` — denetimi sayar, `GECTI` / `KALDI` satırı basar (`KALDI`'da ` -> detay`).
- `gun(n)` — bugüne `n` gün ekler (`setDate`, yerel takvim) ama `toISOString()` ile yazdığı için çıkan `YYYY-AA-GG` UTC
  takvim günüdür ("Dikkat!"e bak).
- Ortak yardımcılar [giris.md](giris.md) üzerinden ([../araclar/giris.md](../araclar/giris.md)): `iste`, `girisYap`. Bu dosyada
  kendi `BASE`'i yok; adresi `araclar/giris.js`'in `BASE`'i belirler (`EE_BASE` ya da `http://localhost:3000`).

### Hesaplar ve veriler

Seed'in hesapları ([seed.md](seed.md)): müdür (`mudur@test.com`, token `M`), Matematik öğretmeni Ayşe Kaya (`mat@test.com`,
token `O`), öğrenci `ogrenci1@test.com` (token `S`, 9. bölümde yeniden girilip `S2`). Hepsi seed'in test şifresiyle girer.

**Hazırlık** (müdür eliyle, gerçek uçlardan):

1. `SAAT-SINIF` adında bir sınıf açar, listeden kimliğini bulur.
2. Bu sınıfa haftada 4 saat Matematik dersi ekler; dersi programdan (`GET /api/school/schedule`) bulur. Yorum: "Ders zaten varsa
   POST hata döner; listeden bulmak daha dayanıklı."
3. Öğretmen listesinden adıyla ("Ayşe Kaya") bulduğu öğretmeni derse bağlar.
4. `ogrenci1`'i bu sınıfa yerleştirir. `class-assign` öğrencinin tek sınıfını değiştirir: öğrenci seed'in 6-A'sından çıkar.
5. Öğretmenin `GET /api/assignments/hedefler`'inden bütün sınıfların öğrencilerini toplar (6-A'da kalan `ogrenci2` ve
   `SAAT-SINIF`'taki `ogrenci1`); paketin her ödevi bu öğrencilere gider. Ödevler ders göndermeden verilir, sunucu öğretmenin
   branşını (Matematik) alır.

Paketin açtığı ödevler:

| Ödev | Başlangıç | Son teslim | Saat | Ne için |
|---|---|---|---|---|
| Saatsiz ödev | `gun(-1)` | `gun(3)` | gönderilmez | varsayılan 12:00; başlama saati boş |
| Saatli ödev | `gun(-1)` | `gun(3)` | `09:20` | saatin korunması, öğrencide ve takvimde görünmesi, yıldız |
| Bozuk saatli | `gun(-1)` | `gun(3)` | `'abc'` | bozuk saatin 12:00'a düşmesi |
| Gecmis odev | `gun(-5)` | `gun(-1)` | `12:00` | gecikme; sonuçlandırma, sonuç değiştirme, yeniden açma, "gelmedi" |
| Başlama saatli ödev | `gun(0)` · `08:00` | `gun(7)` | `23:00` | başlama saatinin korunması ve düzenlenmesi |
| Ters saat | `gun(1)` · `15:00` | `gun(1)` | `10:00` | reddedilmeli (400), açılmaz |

### Bölümler ve denetimler

- **Hazırlık (1):** "test dersi hazir" — Matematik dersi `SAAT-SINIF`'ın programında.
- **1) Varsayılan saat (2):** saatsiz ödev 200; öğretmenin listesinde (`GET /api/assignments`) `endTime === '12:00'`.
- **2) Saat verilebiliyor (2):** `endTime: '09:20'` ile ödev 200; listede `09:20`.
- **3) Bozuk saat varsayılana düşüyor (1):** `endTime: 'abc'` ile verilen ödev listede `12:00`. (Ödev verme cevabının kendisine
  bakılmaz; ödev açılmasaydı liste aramasında bulunamaz, denetim yine `KALDI` olurdu.)
- **4) Gecikme saate göre (2):** öğretmenin listesinde "Gecmis odev" `gecikti: true`, "Saatsiz ödev" `gecikti: false`.
- **5) Süresi geçmiş ödevin sonucu değiştirilebiliyor (6):** geçmiş ödevin ayrıntısı (`GET /api/assignments/<id>`) 200;
  `POST …/finish { results: { <ogrenci1>: 'yapmadi' } }` 200 ve sonuç yazıldı; aynı ödeve ikinci kez `finish` (`'yapti'`) 200,
  yeni sonuç yazıldı; ayrıntıdaki `students[]` satırında `result: 'yapti'`.
- **6) Tekrar açma (1):** `POST …/reopen` 200 ve `status: 'active'`.
- **7) Öğrenci tarafında saat (1):** öğrencinin `GET /api/progress`'inde "Saatli ödev" `endTime: '09:20'`.
- **7b) Öğrenci ödevi yıldızlıyor (9):** başta `yildizli: false`; `POST /api/assignments/<id>/yildiz { yildiz: true }` 200 ve
  `{ yildiz: true }`; ilerleyişte o ödev yıldızlı, öbürleri değil; `yildiz: 'evet'` 400; olmayan ödev (`yok_boyle`) 404; öğretmen
  yıldızlayamaz (403); öğretmenin `GET /api/progress?studentId=<ogrenci1>` cevabında hiçbir ödevde `yildizli` alanı yok;
  `{ yildiz: false }` ile yıldız kalkar.
- **8) Takvimde saat (2):** öğrencinin `GET /api/takvim?yil=&ay=` cevabında (son teslimin ayı sorulur, ay değişmiş olabilir diye)
  `tur: 'odev'`, `baslik: 'Saatli ödev'` olayının `saat`'i `09:20`; `GET /api/takvim/gun?tarih=<son teslim>` cevabının `teslim`
  listesinde de `saat: '09:20'`.
- **9) Gelmedi (izinsiz) sonucu (6):** yeniden açılan geçmiş ödev `'gelmedi'` ile sonuçlandırılır (200, sonuç yazıldı);
  uydurma sonuç (`'kacti'`) 200 alır ama yazılmaz, ayrıntıda sonuç yine `gelmedi`; öğrenci yeniden girer, ilerleyişin
  `subjects` listesinde `gelmedi > 0` olan bir ders var ve o dersin `oran`'ı boş değil, 100'den küçük; öğretmenin listesinde
  ödevin `summary.gelmedi === 1`.
- **Başlama saati (5):** `startTime: '08:00'`, `endTime: '23:00'` ile ödev 200; listede ikisi de korundu; aynı gün 15:00
  başlayıp 10:00'da biten ödev 400; `POST …/update` ile başlama saati `09:30` oldu; başlama saati verilmeyen "Saatsiz ödev"te
  `startTime === ''`.

Sonunda boş satır ve `  GECTI: 38   KALDI: 0` (başında iki boşluk; `tumtest.sh` `GECTI: [0-9]+` aradığı için fark etmez).
`KALDI` varsa çıkış kodu 1. Beklenmeyen hata `TEST HATASI:` ile iletiyi ve yığını yazar, çıkış kodu 1.

## Kimle konuşur?

- **Modül:** yalnız [giris.md](giris.md) (`araclar/giris.js`: `iste`, `girisYap`). Sunucu kodunu doğrudan yüklemez, veritabanına
  bağlanmaz; her şey HTTP ile.
- **Sunucu uçları:**

  | Uç | Ne için | Belge |
  |---|---|---|
  | `GET /api/challenge`, `POST /api/login`, `POST /api/login/dogrula` | girişler (`girisYap`) | [../sunucu/bolumler/kayit.md](../sunucu/bolumler/kayit.md) |
  | `POST /api/school/class`, `GET /api/school/classes`, `POST /api/school/lesson`, `GET /api/school/schedule?classId=`, `GET /api/school/teacher-list`, `POST /api/school/lesson-update`, `GET /api/school/students`, `POST /api/school/class-assign` | hazırlık: sınıf, ders, öğretmen, öğrenci | [../sunucu/bolumler/okul.md](../sunucu/bolumler/okul.md) |
  | `GET /api/assignments/hedefler`, `POST /api/assignments`, `GET /api/assignments`, `GET /api/assignments/<id>`, `POST /api/assignments/<id>/finish`, `…/reopen`, `…/update`, `…/yildiz` | ödevler | [../sunucu/bolumler/odev.md](../sunucu/bolumler/odev.md) |
  | `GET /api/progress` (öğrenci; öğretmen `?studentId=`) | ilerleyiş: saat, yıldız, ders satırları | [../sunucu/bolumler/ilerleyis.md](../sunucu/bolumler/ilerleyis.md) |
  | `GET /api/takvim?yil=&ay=`, `GET /api/takvim/gun?tarih=` | takvimde ödev saati | [../sunucu/bolumler/takvim.md](../sunucu/bolumler/takvim.md) |

- **Koruduğu kod:**
  - [../sunucu/bolumler/odev.md](../sunucu/bolumler/odev.md) — `ODEV_VARSAYILAN_SAAT` (`'12:00'`), `odevSaati`, `odevGecikti`,
    `odevBitisAni`; ödev verirken ve düzeltirken `saatDuzelt(body.endTime) || '12:00'`, başlama saatinin yalnız başlangıç tarihi
    varken alınması, "Aynı gün biten ödevde son saat başlama saatinden sonra olmalı"; `finish`'in sonuçlanmış ödevde de çalışması
    ve `RESULT_TYPES` dışındaki sonucu sessizce atlaması; `reopen`; `yildiz` (yalnız öğrenci 403, `boolean` değilse 400, ödev
    yoksa 404).
  - [../sunucu/iliskiler.md](../sunucu/iliskiler.md) — `saatDuzelt` (bozuk saat `null` → varsayılan), `summarize` (`gelmedi`
    sayacı).
  - [../sunucu/bolumler/ilerleyis.md](../sunucu/bolumler/ilerleyis.md) — `progressOf`: `endTime: odevSaati(a)`, `yildizli` yalnız
    öğrencinin kendisi bakarken, ders satırlarında `gelmedi` ve `oran` (izinli sayılmaz, izinsiz sayılır).
  - [../sunucu/bolumler/takvim.md](../sunucu/bolumler/takvim.md) — ödev olayının ve gün ayrıntısındaki teslimin `saat`'i.
  - [../sunucu/veri/depo/odevler.md](../sunucu/veri/depo/odevler.md) — `yildizla` (`odev_ogrencileri.yildiz`; satır yoksa
    `false` → 404), `yildizlilari`.
  - [../sunucu/ortak.md](../sunucu/ortak.md) — `RESULT_TYPES` (`yapti`, `yapmadi`, `eksik`, `gec`, `izinli`, `gelmedi`).
  - Şema ([../sunucu/veri/sema/SEMA.md](../sunucu/veri/sema/SEMA.md)): `017-odev-yildizi.sql`, `025-odev-baslama-saati.sql`.
- **Tablolar** (uçlar üzerinden): `odevler`, `odev_ogrencileri` (yıldız ve sonuç), `siniflar`, `dersler`, `kullanicilar`;
  `finish` öğrenciye "… ödevi açıklandı / sonucu değişti" bildirimi yazar (`bildirimler`; bu paket bildirime bakmaz).
- **Ön yüz** (aynı alanları gösterir; bu pakette tarayıcı yok): öğretmenin ödev formu ve listesi
  [../public/js/parcalar/11-ogretmen-odev.md](../public/js/parcalar/11-ogretmen-odev.md), öğrencinin Ödevler sayfası ve yıldız
  düğmesi [../public/js/parcalar/14-odev-filtre.md](../public/js/parcalar/14-odev-filtre.md), takvim
  [../public/js/parcalar/17-takvim.md](../public/js/parcalar/17-takvim.md).
- **Onu çalıştıran:** `testler/tumtest.sh`, sunuculu paket döngüsünde `test-takvim`'den sonra, `test-egitim-yili`'nden önce. Her
  paketten önce sunucu sıfırlanmış test veritabanıyla açılır ve [seed.md](seed.md) çalışır.

## Nasıl çalışır (adım adım)?

```
müdür ve öğretmen girer
hazırlık: SAAT-SINIF + Matematik dersi + Ayşe Kaya + ogrenci1 bu sınıfa ─► hedefler ─► öğrenci kimlikleri
1) Saatsiz ödev ─────────────► listede 12:00
2) Saatli ödev (09:20) ──────► listede 09:20
3) Bozuk saatli ('abc') ─────► listede 12:00
4) Gecmis odev (dün 12:00) ──► gecikti: true ; Saatsiz ödev ─► gecikti: false
5) Gecmis odev: finish yapmadi ─► finish yapti ─► ayrıntıda yapti
6) reopen ─► status active
öğrenci girer
7)  progress: Saatli ödev 09:20
7b) yildiz true / 'evet' 400 / yok_boyle 404 / öğretmen 403 / öğretmen bakışında alan yok / yildiz false
8)  takvim ayı ve gün ayrıntısında 09:20
9)  Gecmis odev: finish gelmedi ─► 'kacti' yazılmaz ─► öğrenci progress: gelmedi sayılır, oran < 100 ─► öğretmen özeti gelmedi 1
başlama saati: 08:00/23:00 korunur ; aynı gün ters saat 400 ; update 09:30 ; saatsiz ödevde ''
```

Bölümler birbirine bağlıdır: 5, 6 ve 9 aynı "Gecmis odev"i kullanır (sonuçlandır → değiştir → yeniden aç → "gelmedi" ile yeniden
sonuçlandır); 7b, 2. bölümün "Saatli ödev"ini yıldızlar. Tek bir bölümü ayrı çalıştırmanın yolu yok.

## Dikkat!

- **Varsayılan adres 3000.** Bu dosyanın kendi `BASE`'i yok, `araclar/giris.js`'inkini kullanır. `EE_BASE` vermeden çalıştırırsan
  istekler kendi sunucuna gider. Orada seed'in test hesapları yoksa paket ilk girişte `TEST HATASI` ile durur; varsa (o sunucuya
  bir gün seed çalıştırıldıysa) gerçek veritabanında `SAAT-SINIF` açılır, `ogrenci1`'in sınıfı değişir, ödevler verilir. Her
  zaman `EE_BASE=http://localhost:3200` ile, sıfırlanmış test sunucusuna çalıştır.
- **"İzinsiz gelmemek orana giriyor" denetimi ayırt edici değil.** Seed, `ogrenci1`'e "Kesirler alıştırması" (Matematik)
  ödevinde zaten `yapmadi` verir ([seed.md](seed.md)); 9. bölümden sonra Matematik satırı `yapmadi: 1`, `gelmedi: 1`, `oran: 0`
  olur. `gelmedi` orana hiç girmeseydi oran `0 / 1 = 0` olacak, denetim yine geçecekti. 3 Ekim'deki koşudan hemen sonra aynı
  sunucuda ilerleyişe bakılarak görüldü (öğlen denetimde yeniden bakıldı, aynı):
  `{"subject":"Matematik","yapti":0,"yapmadi":1,…,"gelmedi":1,"toplam":2,"oran":0}`. Asıl
  kuralı (`ilerleyis.js`'teki `sayilan`'a `gelmedi`'nin girmesi) gerçekten korumak için oranın tam değerine bakmak ya da seed
  sonucu olmayan bir derste denemek gerekir (kod değiştirilmedi).
- **"Öğretmen öğrencinin yıldızını görmüyor" boş listede de geçer.** Denetim `(assignments || []).every(x => x.yildizli ===
  undefined)` diye yazılmış; öğretmen ilerleyişi göremeseydi (403) liste boş kalır, denetim yine `GECTI` derdi. Bugün sorun yok:
  3 Ekim'deki koşularda (sabah ve öğlen denetimi) öğretmenin bakışı 200 döndü ve 10 ödev geldi; hiçbirinde `yildizli` yoktu.
- **Seed'e bağlı.** Öğretmeni adıyla ("Ayşe Kaya"), öğrenciyi `ogrenci1@test.com` e-postasıyla arar; 9. bölümün oran denetimi
  seed'in Matematik sonucuna yaslanır. Seed'deki adlar ya da sonuçlar değişirse bu paket de değişmeli.
- **`ogrenci1` 6-A'dan çıkar.** Hazırlıktaki `class-assign` öğrencinin tek sınıfını `SAAT-SINIF` yapar. Paket içinde sorun
  değil (her paket sıfırlanmış veritabanıyla başlar), ama bu paketten sonra aynı veritabanında 6-A'ya bakan bir şey çalıştırırsan
  `ogrenci1`'i orada bulamazsın.
- **`gun()` UTC günü verir.** Türkiye'de 00:00–03:00 arasında `gun(0)` dünün tarihidir (seed'de de aynı kusur var, bkz.
  [seed.md](seed.md)). Bu paketin denetimleri tarihleri hep aynı `gun(...)` metinleriyle karşılaştırdığı ve "gecikti" ödevi bir
  gün önce 12:00'de bittiği için sonuç değişmemeli (koddan çıkarım; gece saatinde denenmedi).
- **4. bölümün yorumu kodla uyuşmuyor.** Yorum "Bugün saat 00:01 → kesin geçmiş" der; kod ise son teslimi dün 12:00 yapar. Davranış
  doğru, yalnız yorum eski.
- **Denetim adları karışık yazımlı.** Eski bölümlerde Türkçe harfsiz ("gecmis odev"), yeni bölümlerde Türkçe ("başlama saatiyle
  ödev verildi"). `KALDI` satırını ararken ikisini de dene.
- **Bildirim yan etkisi.** Her `finish` sonucu yeni verilen ya da değişen öğrenciye bildirim yazar; bu paket ona bakmaz
  (bildirim metinlerini `testler/test-bildirim.js` dener).

## Testleri

- Bu dosyanın kendisi testtir; `testler/tumtest.sh` her tam koşuda çalıştırır. Aynı alanda: `testler/test-takvim.js` (ödevin
  teslim gününün takvimde ve gün ayrıntısında görünmesi; saate bakmaz), `testler/test-bildirim.js` (sonuçlandırma bildirimi,
  aynı sonuçta yeniden bildirim gitmemesi), `testler/test-quiz.js` (quizin başlama anı ve son teslim + 10 dakika),
  [test-odev-dosya.md](test-odev-dosya.md) (teslim dosyasının silinme anı son teslim gün + saatinden hesaplanır),
  [yetki-denetimi.md](yetki-denetimi.md) (ödev uçlarının rol rol denenmesi).
- Elle (Git Bash, proje kökünde; 3200'de sıfırlanmış ve [seed.md](seed.md) ile tohumlanmış test sunucusu varken):

  ```
  EE_BASE=http://localhost:3200 EE_LOG=testler/test-sunucu.log node testler/test-odev-saat.js
  ```

- 3 Ekim sabahı bu belge için 3200'de, sıfırlanmış `egitimevi_test` ve seed'le koşuldu: `GECTI: 38   KALDI: 0`, yaklaşık
  1 saniye. Öğlen denetimde yeniden koşuldu (yine 38/0), hemen ardından **aynı sunucu ve veritabanında ikinci kez** de koşuldu:
  yine `GECTI: 38   KALDI: 0`. Neden tutuyor: hazırlıktaki `POST /api/school/class` ("Bu adda bir sınıf zaten var") ve
  `POST /api/school/lesson` ikinci kez hata alır ama cevaplarına bakılmaz, sınıf ve ders listeden bulunur; ödev adları aynı olsa da
  ödev listeleri yeniden eskiye sıralıdır (`sunucu/veri/depo/odevler.js` `YENI_ONCE`: `ORDER BY o.olusturma DESC`), `find` ikinci
  koşunun ödevlerini bulur.

## Son durum

- `git log`: iki commit, ikisi de 2026-08-29. `8fd8c93 commit 85` dosyayı 14 satırla açtı: başlık yorumu, `kontrol` ve `gun`.
  `23dede5 commit 86` gövdenin tamamını ekledi (217 satır): hazırlık, 1–9. bölümler, 7b yıldız bölümü ve başlama saati bölümü.
  O günden beri dosya değişmedi (bugün 231 satır).
- Açık iş yok; kod değiştirilmedi. Zayıf noktalar (ayırt edici olmayan oran denetimi, boş listede geçen yıldız denetimi) "Dikkat!"te.
- Planlı işlerden bu dosyayı etkileyebilecekler:
  - **"Özel branş / ders"** — okul kendi derslerini açacak; bugün ders sabit listeden (`Matematik`) gelir ve hazırlık
    `POST /api/school/lesson { subject: 'Matematik' }` ile kurulur. Ders listesi okula özel olunca hazırlık değişebilir.
  - **"Mesaj ayarları, … Ajanda, … ödev hatırlatma otomasyonu"** — Ajanda takvim sayfasında ay görünümünün altına gelecek,
    ödevleri de listeleyecek (filtre kutucuklarından biri "Ödev") ve kendi ucu olacak (`/api/ajanda`, tanımdan). 8. bölümün
    baktığı takvim uçları (`/api/takvim`, `/api/takvim/gun`) bu işte değişirse bu paket de güncellenmeli.
  - **"T.C. kimlik no bütün hesaplarda zorunlu"** (kod Linux'ta) — bu paket hesap açmaz. Seed'de öğrenciler bugün de T.C.'li
    açılır (`araclar/giris.js` `okulHesabi` → `tcUret()`), ama yetişkin hesapları (müdür ve öğretmenler, `hesapAc`) T.C.'siz
    kaydolur; kayıtta T.C. zorunlu olunca seed değişmek zorunda kalır, bu paketin girdiği hesaplar da onunla birlikte.
