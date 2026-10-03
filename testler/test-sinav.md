# testler/test-sinav.js

Sınavları (şablonlar, grupsuz sınav, virgüllü ondalık değer, aralık denetimi, "+ yeni değer ekle", öğrenci grafiği, 100
üzerinden grup ortalaması) ve ödevin "açıldı" zamanı ile "geç yaptı" sonucunu deneyen sunuculu test paketi (36 denetim).

## Bu dosya ne yapar?

Eğitim Evi'nde bir sınav "tek not" değildir: bir sınavın birden çok **ölçümü** olabilir (LGS denemesinde her dersin neti
ve "LGS Puanı", testte Doğru / Yanlış / Net). Her ölçümün kendi aralığı vardır ve değerler ondalıklı, virgülle yazılmış
olabilir ("490,161"). Okul bu ölçüm listelerini **şablon** olarak saklar; sınav şablondan açılınca ölçümler kopyalanır.
Sınavlar isteğe bağlı bir **grupta** toplanır, grup ortalaması her sınavın ana ölçümü 100 üzerinden alınarak hesaplanır.
Bu kuralların hepsi [../sunucu/bolumler/sinav.md](../sunucu/bolumler/sinav.md)'de anlatılıyor; bu paket onları bir
öğretmenin gözünden, sırayla dener:

1. Şablonlar: hazır şablon önerisi, aynı hazır şablonun bir kez açılması, elle şablon ve kodun kendiliğinden üretilmesi,
   bozuk aralıkların ve aynı adın reddi, başka öğretmenin şablonu değiştirememesi ama görebilmesi.
2. Grupsuz bir LGS denemesi: virgüllü değerlerin sayıya çevrilip saklanması, aralık dışı ve sayı olmayan değerlerin
   atlanması (eskisi bozulmadan), başka öğretmenin not girememesi.
3. Sınava sonradan yeni ölçüm eklemek ve girilmiş değeri dışarıda bırakacak daraltmanın reddi.
4. Öğrencinin grafiği: aynı şablonla yapılmış sınavlar tarih sırasıyla, her sınavın "bandı" (sınıfın en düşük/en yüksek
   değeri), başka öğrencinin grafiğinin görülememesi.
5. Grup ortalaması: 0–100'lük yazılıda 80 ile 0–500'lük denemede 400 aynı ağırlıkla 80 eder; öğrencinin ilerleyiş
   sayfasında da görünür.

Dosyanın başındaki yorumun dediği gibi, paketin sonunda sınavla ilgisi olmayan iki ödev kuralı da var: öğrenci ödevi ilk
açtığında zamanın yazılması (öğretmen "ödev şu tarihte açıldı" görür) ve "Geç yaptı" sonucu.

## İçinde neler var?

### Yardımcılar

- `kontrol(ad, sart, detay)` — `GECTI` / `KALDI` satırı, sayaçlar.
- `kisa(v)` — JSON'un ilk 160 karakteri (hata ayrıntısı için).

Ortak yardımcılar [giris.md](giris.md) üzerinden ([../araclar/giris.md](../araclar/giris.md)): `iste`, `girisYap`.

### Hesaplar ve veriler

Seed'den ([seed.md](seed.md)): Matematik öğretmeni `mat@test.com` (`O`), Fen öğretmeni `fen@test.com` (`F`), öğrenci
`ogrenci1@test.com` (`S`; kimliği `GET /api/me`'den, adı paket içinde `ben`), bir yerde `ogrenci2@test.com` ve
`mudur@test.com`; hepsinin şifresi `Test1234!`. 6-A sınıfı ve seed'in verdiği açık ödevler. Paketin açtıkları: "LGS
Denemesi" (hazır), "Deneme 0-500" (elle) şablonları; "LGS Deneme 1" (2026-09-10), "LGS Deneme 2" (2026-09-20) sınavları;
"Dönem 1" grubu ve içinde "Yazılı 1" ile "Deneme".

### 1) Şablonlar (9)

- `GET /api/exams/sablonlar` (öğretmen) → 200 ve `hazir` dizisinde 3 öneri (okulda henüz şablon yok).
- `POST /api/exams/sablonlar { hazir: 'lgs' }` → şablonda 7 ölçüm; aynı istek ikinci kez → **aynı** şablon kimliği.
- `POST /api/exams/sablonlar { name: 'Deneme 0-500', olcumler: [{ ad: 'Doğru', alt: 0, ust: 90 }, { ad: 'Puan', alt: '0',
  ust: '500', ana: true }] }` → ilk ölçümün kodu `D` (adın baş harfi), ikincisi ana ölçüm.
- Reddedilenler (400): `alt: 50, ust: 10` (alt > üst); `alt: -20000` (±10000 sınırı dışı); aynı adla ("Deneme 0-500")
  ikinci şablon.
- Fen öğretmeni `POST /api/exams/sablonlar/<id>` ile Matematikçinin şablonunu değiştiremez → 403; ama `GET` listesinde
  görür (şablon okulundur).

### 2) Grupsuz sınav ve ondalık değer (8)

- `POST /api/exams { name: 'LGS Deneme 1', templateId: <LGS>, tarih: '2026-09-10' }` → 200, `groupId` boş.
- `GET /api/exams/<id>` → `students` içinde öğrenci, sınıf adıyla (`className`).
- `POST /api/exams/<id>/grades { degerler: { <öğrenci>: { TR: '15,5', MAT: '12', LGS: '490,161' } } }` → `atlanan: 0`;
  okununca `LGS` 490.161, `TR` 15.5 ve `grade` (ana ölçüm) 490.161.
- `{ LGS: '600', MAT: 'abc' }` → `atlanan: 2`; `LGS` hâlâ 490.161.
- Fen öğretmeni aynı sınava not girmeye kalkar → 403.

### 3) + Yeni değer ekle (3)

- `POST /api/exams/<id>/olcumler` mevcut 7 ölçüm + `{ ad: 'Doğru Sayısı', alt: 0, ust: 90 }` → 8 ölçüm; girilmiş `LGS`
  değeri korunuyor.
- `LGS`'nin üst sınırı 400'e indirilmek istenir (girilmiş 490,161 dışarıda kalır) → 400.

### 4) Grafik (4)

- İkinci sınav "LGS Deneme 2" (2026-09-20), öğrenciye `LGS: '455,5'`.
- Öğrenci `GET /api/exams/grafik` → 200, `sablonlar` tek (LGS), `sinavlar` iki ve ilki 2026-09-10; ilk sınavın
  `bant.LGS.ust` değeri 490.161.
- `ogrenci2` `GET /api/exams/grafik?ogrenci=<ogrenci1>` → 403.

### 5) Grup ortalaması (4)

- `POST /api/examgroups { name: 'Dönem 1' }`; içine `{ name: 'Yazılı 1', groupId, weight: 50 }` (şablonsuz: sunucu hazır
  "Yazılı (0-100)"u kullanır) ve `{ name: 'Deneme', groupId, weight: 50, templateId: <Deneme 0-500> }`.
- Etki oranı verilmeden gruba sınav → 400.
- Eski biçimle not: yazılıya `{ grades: { <öğrenci>: 80 } }`, denemeye `{ grades: { <öğrenci>: '400' } }` (ana ölçüm "Puan",
  0–500).
- `GET /api/examgroups/<id>` → öğrencinin `average`'ı tam 80 ((80 + 400/500·100) / 2).
- Öğrenci `GET /api/progress` → `exams` (grupsuz sınavlar) 2 tane; `examGroups`'ta ortalaması 80 olan grup var.

### 6) Ödev açıldı ve geç yaptı (8)

- Öğrencinin ilerleyişindeki ilk `status: 'active'` ödev (seed'in ödevlerinden biri) `acildi: false`.
- Öğrenci `POST /api/assignments/<id>/acildi` → 200. Ödevin öğretmeni (ödevi veren `teacherName` "Ali Yıldız" ise Fen, değilse
  Matematik öğretmeni) `GET /api/assignments/<id>` → öğrencinin satırında `acilma` dolu.
- Öğrenci bir kez daha "açıldı" der; öğretmenin gördüğü `acilma` değişmiyor (ilk açılış kalır).
- Müdür aynı uca `POST` atar → 403.
- Öğretmen `POST /api/assignments/<id>/finish { results: { <öğrenci>: 'gec' } }` → 200, sonuç `gec`; `''` gönderince sonuç
  kalkıyor; `'uydurma'` gönderince 200 ama sonuç yazılmıyor.

Sonunda boş satır ve `GECTI: 36   KALDI: 0` (bu pakette satır başında boşluk yok; `tumtest.sh` `GECTI: [0-9]+` aradığı için
fark etmez). `KALDI` varsa çıkış kodu 1; beklenmeyen hata `TEST HATASI:` ve hata nesnesi, çıkış kodu 1.

## Kimle konuşur?

- **Modüller:** yalnız [giris.md](giris.md) (`araclar/giris.js`); veritabanına doğrudan bağlanmaz.
- **Sunucu uçları:**

  | Uç | Ne için | Belge |
  |---|---|---|
  | `GET/POST /api/exams/sablonlar`, `POST /api/exams/sablonlar/<id>` | şablonlar | [../sunucu/bolumler/sinav.md](../sunucu/bolumler/sinav.md) |
  | `POST /api/exams`, `GET /api/exams/<id>`, `POST /api/exams/<id>/grades`, `POST /api/exams/<id>/olcumler` | sınav, değer, ölçüm | [../sunucu/bolumler/sinav.md](../sunucu/bolumler/sinav.md) |
  | `GET /api/exams/grafik` | öğrencinin grafiği | [../sunucu/bolumler/sinav.md](../sunucu/bolumler/sinav.md) |
  | `POST /api/examgroups`, `GET /api/examgroups/<id>` | grup ve ortalama | [../sunucu/bolumler/sinav.md](../sunucu/bolumler/sinav.md) |
  | `GET /api/progress` | öğrencinin sınavları, grup ortalaması, ödev listesi | [../sunucu/bolumler/ilerleyis.md](../sunucu/bolumler/ilerleyis.md) |
  | `POST /api/assignments/<id>/acildi`, `GET /api/assignments/<id>`, `POST /api/assignments/<id>/finish` | açılma zamanı, sonuç | [../sunucu/bolumler/odev.md](../sunucu/bolumler/odev.md) |
  | `GET /api/challenge`, `POST /api/login`, `POST /api/login/dogrula`, `GET /api/me` | giriş | [../sunucu/bolumler/kayit.md](../sunucu/bolumler/kayit.md) |

- **Koruduğu kod:** `sunucu/bolumler/sinav.js` (`HAZIR_SABLONLAR`, `olcumleriDogrula`, `kodUret`, `hazirSablon`,
  `sablonDuzenleyebilir`, `yuzluk`, değer girişi ve aralık daraltma); [../sunucu/veri/depo/sinavlar.md](../sunucu/veri/depo/sinavlar.md)
  (`degerleriYaz`, `aralikDisi`, `bantlar`, `ogrencininSerisi`, `ogrencininSablonlari`, `ogrencininTekSinavlari`,
  `ogrencininGruplari`); `ondalik` ([../sunucu/ortak.md](../sunucu/ortak.md), virgüllü sayı); `canSeeStudent`
  ([../sunucu/iliskiler.md](../sunucu/iliskiler.md)); `progressOf` ([../sunucu/bolumler/ilerleyis.md](../sunucu/bolumler/ilerleyis.md));
  ödevin `acildi` ve `finish` uçları ile [../sunucu/veri/depo/odevler.md](../sunucu/veri/depo/odevler.md)'deki `acildi`
  (yalnız `acilma IS NULL` iken yazar) ve `sonuclandir`; `RESULT_TYPES` (`gec` dahil).
- **Tablolar** (uçlar üzerinden): `sinav_sablonlari`, `sablon_olcumleri`, `sinav_gruplari`, `sinavlar`, `sinav_olcumleri`,
  `sinav_degerleri`, `hatirlatmalar` (sınav bildiriminin "ilk kez" anahtarı), `bildirimler`, `odevler`,
  `odev_ogrencileri` (`acilma`, `sonuc`).
- **Ön yüz** (bu pakette tarayıcı yok): öğretmenin sınav, grup, şablon ve değer ekranları
  [../public/js/parcalar/12-ogretmen-sinav.md](../public/js/parcalar/12-ogretmen-sinav.md); grafik
  [../public/js/parcalar/28-grafik.md](../public/js/parcalar/28-grafik.md); öğrencinin ödevi açınca "açıldı" bildirmesi
  [../public/js/parcalar/14-odev-filtre.md](../public/js/parcalar/14-odev-filtre.md); öğretmenin sonuç seçimi ("Geç yaptı")
  [../public/js/parcalar/11-ogretmen-odev.md](../public/js/parcalar/11-ogretmen-odev.md).
- **Onu çalıştıran:** `testler/tumtest.sh`, sunuculu döngüde (`test-egitim-yili`'nden sonra, `test-bildirim`'den önce).

## Nasıl çalışır (adım adım)?

```
O=mat, F=fen, S=ogrenci1 girer ; ben = /api/me
1) sablonlar: hazir 3 öneri ─► LGS (7 ölçüm, ikinci istek aynı id) ─► "Deneme 0-500" (D, Puan ana)
   red: alt>üst, -20000, aynı ad ; F değiştiremez (403) ama görür
2) exams "LGS Deneme 1" (LGS şablonu, 2026-09-10) ─► grades { TR '15,5', MAT '12', LGS '490,161' }
   ─► 490.161 saklandı ─► { LGS '600', MAT 'abc' } atlanan 2 ─► F not giremez (403)
3) olcumler + "Doğru Sayısı" (8) ─► LGS üst 400 ─► 400 (girilmiş değer dışarıda kalır)
4) "LGS Deneme 2" (2026-09-20, LGS 455,5) ─► S grafik: 1 şablon, 2 sınav, bant ; ogrenci2 ─► 403
5) examgroups "Dönem 1" ─► Yazılı 1 (0-100, %50) + Deneme (0-500, %50) ─► 80 ve 400 ─► ortalama 80
   S progress: exams 2, examGroups ortalama 80
6) S progress ─► ilk açık ödev ─► acildi ─► öğretmen acilma'yı görür ─► ikinci acildi değiştirmez
   müdür acildi ─► 403 ; finish 'gec' ─► '' (kalkar) ─► 'uydurma' (yazılmaz)
```

## Dikkat!

- **"Öğrenci olmayan 'açıldı' diyemez" aslında "ödevin sahibi olmayan" denetimi.** `acildi` ucu yalnız `me.role ===
  'student'` iken işler; öğrenci değilsen istek ödev uçlarının geri kalanına düşer. Müdür ödevin sahibi olmadığı için
  sahiplik denetiminde 403 "Yetkin yok" alır. Ödevi veren öğretmen aynı isteği atarsa 404 "Böyle bir adres yok" alır
  (bu belge için 3 Ekim'de 3200'de denendi). Yani paket "öğrenci dışındakiler açılma zamanı yazamaz" kuralını yalnız
  sahibi olmayan biriyle dener.
- **"Tanımsız sonuç yazılmaz" bir önceki adıma dayanıyor.** `'uydurma'` gönderilmeden hemen önce sonuç `''` ile
  silinmişti; sunucu `'uydurma'`'yı sessizce atlasa da sonucu silse de denetim geçer. Daha sağlam olması için önce geçerli
  bir sonuç yazılıp sonra `'uydurma'` gönderilmeli (kod değiştirilmedi).
- **"Başka öğretmen not giremez" yetkiden değil sahiplikten 403 alır.** Sınav yalnız açanındır (`e.teacherId !== me.id`);
  `sinav.not-gir` yetkisinin ders kapsamı bu pakette denenmez.
- **Bölümlerin sırası önemli.** 4. bölümdeki "grafikte tek şablon" denetimi 5. bölümden önce koştuğu için tutar; 5.
  bölüm öğrenciye "Deneme 0-500" ve "Yazılı (0-100)" şablonlarıyla da değer girer (3 Ekim'de paketten sonra bakıldı:
  öğrencinin grafiğinde 3 şablon). Yeni bir bölümü 4'ten önceye eklerken bunu hesaba kat.
- **Şablonsuz sınav okulda şablon açar.** "Yazılı 1" ne `templateId` ne `olcumler` taşıdığı için sunucu hazır
  `yazili` şablonunu okulda bulur, yoksa açar; paket bundan sonra okulda "Yazılı (0-100)" şablonu bırakır.
- **`bant` alanlarının adı yanıltıcı olabilir.** `bant.LGS.ust` ölçümün üst sınırı değil, o sınavda girilmiş EN YÜKSEK
  değerdir (`alt` en düşük, `ort` ortalama, `sayi` adet). Sınava yalnız bu öğrenci girdiği için 490.161'dir.
- **Sabit tarihler.** Sınav tarihleri 2026-09-10 ve 2026-09-20 olarak gömülü. İlerleyiş sınavları tarihle değil yıl
  damgasıyla (açıldıkları eğitim yılı) süzer, grafik hiç süzmez; tarih yalnız sıralamayı belirler. Bu yüzden paket başka
  yıllarda da çalışır.
- **Seed'in ödevini sonuçlandırır.** 6. bölüm seed'in açık ödevlerinden ilkini `finish` ile `finished` durumuna getirir;
  sonucu sonunda silinse de ödev "sonuçlandırılmış" kalır. Aynı sunucuda arkasından koşulan bir paket o ödevi açık
  sanmasın (`tumtest.sh` her pakette sıfırladığı için sorun yok).
- **Bildirim üretir.** Bir öğrenciye bir sınavda ilk kez değer girilince öğrenciye (velisine kopya) bildirim gider; `finish`
  de "açıklandı: Geç yaptı" bildirimi gönderir. Bu paket bildirimleri denetlemez ([test-bildirim.md](test-bildirim.md) bakar).
- **Seed'e bağlı:** iki öğretmenin branşı (Matematik, Fen Bilimleri), öğrencinin 6-A'da olması (`className`), seed'in açık
  ödevleri ve öğretmen adı "Ali Yıldız".
- **Varsayılan adres 3000.** `EE_BASE` vermezsen istekler kendi sunucuna gider (şablon, sınav açar, not girer). Her zaman
  test sunucusunu kullan.

## Testleri

- Bu dosyanın kendisi testtir; `testler/tumtest.sh` her tam koşuda çalıştırır.
- Aynı alanda: [test-bildirim.md](test-bildirim.md) — sınav sonucu bildirimi yalnız ilk girişte gider, düzeltmede yeniden
  gitmez; [test-siniflarim.md](test-siniflarim.md) — öğretmenin öğrenci ekranında sınav sonucunun (87,5) görünmesi;
  [test-egitim-yili.md](test-egitim-yili.md) — arşiv yılında sınav grubu açmanın reddi (409, `arsiv: true`);
  [test-ozellikler.md](test-ozellikler.md) — okul ödev ve etüdü kapatınca sınavların açık kalması. `testler/yetki-denetimi.js`
  ve `testler/girdi-denetimi.js` `/api/exams` ve `/api/examgroups` uçlarını denemez (listelerinde yoklar); sınav uçlarının
  yetkisiz ve bozuk istekle denenmesi bugün eksik.
- Elle (Git Bash, proje kökünde; 3200'de [seed.md](seed.md) ile tohumlanmış test sunucusu varken):

  ```
  EE_BASE=http://localhost:3200 EE_LOG=testler/test-sunucu.log node testler/test-sinav.js
  ```

- 3 Ekim 2026'da bu belge için 3200'de, sıfırlanmış `egitimevi_test` ve seed'le koşuldu: `GECTI: 36   KALDI: 0`, yaklaşık
  1 saniye; sunucu günlüğünde `API hatası` / `Veritabanı hatası` yoktu. Aynı sunucuda ayrıca ödevin sahibi öğretmenin
  `acildi` isteğinin 404 aldığı denendi ("Dikkat!"in ilk maddesi).

## Son durum

- `git log`: 3 commit, üçü de 2026-09-25 (sınav bölümünün yazıldığı gün; `sunucu/bolumler/sinav.js` aynı gün `commit 202`–`205`
  ile kuruldu). `e1cadc7 commit 228` (5 satır: başlık yorumu ve `require`), `0a61324 commit 229` (7 satır: `kontrol`, `kisa`),
  `734f47d commit 230` (140 satır: altı bölümün hepsi). O günden beri değişmedi.
- Açık iş yok; kod değiştirilmedi. Zayıf denetimler (sahiplikten gelen 403'ler, `'uydurma'` sonucu) "Dikkat!"te.
- Planlı işlerden bu dosyayı etkileyecekler:
  - **"Sınav: formüllü ölçüm + notları Excel'den yükleme/indirme + sınav grubu üst değeri"** (öneri sunuldu, onay bekliyor)
    — ölçümler "elle girilen" ve "hesaplanan" diye ayrılacak (ör. `N = D - Y/4`); 2. ve 3. bölümdeki ölçüm ve değer
    denetimlerine hesaplanan ölçüm denemeleri, 5. bölüme grubun üst değeri (ör. 125) eklenmeli.
  - **"Mesaj ayarları, … sınav planlama (salon/koltuk)"** — sınavlara yeni bir katman ekler.
  - **"Özel branş / ders"** — öğretmenin branşı ve dersler okulun kendi listesinden gelecek; paketteki Matematik/Fen
    varsayımı seed'e bağlı kalır.
  - **"Yıl geçişi"** — arşiv yıllarını değiştirir; yıl damgasıyla süzülen ilerleyiş ve grup listelerine dokunur.
