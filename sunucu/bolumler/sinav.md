# sunucu/bolumler/sinav.js

Öğretmenin sınavları (`/api/exams`), sınav grupları (`/api/examgroups`), okulun ölçüm şablonları ve öğrencinin sınav
grafiği (`/api/exams/grafik`).

## Bu dosya ne yapar?

Öğretmen bir sınav açar, öğrencilerin sonucunu girer; öğrenci ve velisi sonucu görür, zaman içindeki gidişi grafikte izler.
Buradaki fikir "bir sınav = bir not" değil: bir sınavın bir ya da birden çok **ölçümü** olabilir. Yazılıda tek "Puan"
(0–100), testte "Doğru / Yanlış / Net", LGS denemesinde her dersin neti ve "LGS Puanı" (100–500). Her ölçümün kendi aralığı
vardır (−10000 ile 10000 arası); değerler ondalıklı olabilir ve virgülle yazılabilir ("490,161").

- **Şablon**: okulun hazır ölçüm listesi ("Yazılı (0-100)", "LGS Denemesi"). Sınav şablondan açılınca ölçümleri
  KOPYALANIR; şablon sonradan değişse eski sınav bozulmaz. Grafik aynı şablonla yapılmış sınavları yan yana koyar.
- **Grup** (isteğe bağlı): "Dönem 1 - Yazılılar" gibi. Gruptaki sınavların etki oranı (ağırlık) olur; grup ortalaması her
  sınavın ana ölçümü 100 üzerinden alınarak hesaplanır.

Öğrencinin kendi sınav listesi burada değil, `/api/progress` (`sunucu/bolumler/ilerleyis.js`) içinde döner; bu dosya
öğrenciye yalnız grafiği verir.

## İçinde neler var?

### Sabitler

- `DEGER_SINIR` — 10000: ölçüm sınırları −10000 ile 10000 arasında olmalı.
- `EN_FAZLA_OLCUM` — 30: bir sınavda/şablonda en çok 30 ölçüm.
- `HAZIR_SABLONLAR` (dışa açık) — okulda henüz yoksa önerilen hazır şablonlar:
  - `yazili`: "Yazılı (0-100)" — `P` Puan 0–100 (ana);
  - `test`: "Test (Doğru / Yanlış / Net)" — `D` 0–100, `Y` 0–100, `N` Net −100–100 (ana);
  - `lgs`: "LGS Denemesi" — `TR`, `MAT`, `FEN` Net −10–20; `INK`, `DIN`, `ING` Net −5–10; `LGS` Puanı 100–500 (ana).

### Dışa açılan yardımcılar

- `olcumleriDogrula(gelen)` — ölçüm listesini doğrular ve temizler: `{ olcumler: [{ id, kod, ad, alt, ust, ana }] }` ya da
  `{ hata }`. Kurallar: en az 1, en çok 30; her birinin adı olmalı (60); `alt` boşsa 0, `ust` boşsa 100; ikisi de sayı
  (`ondalik`, virgül kabul); sınırlar ±10000 içinde; `alt < ust`; kod büyük harfe çevrilir, boşluklar atılır (12), boşsa ya
  da çakışıyorsa `kodUret` ile üretilir; tam bir ölçüm "ana" olur (işaretli yoksa ilki, birden çoksa ilk işaretli). `id`'ler
  korunur (düzenleme için).
- `kodUret(ad, kullanilan)` — adın kelimelerinin baş harfleri ("Doğru Sayısı" → "DS", en çok 6); çakışırsa sonuna sayı
  ("DS2").
- `uclar(k)`.

`HAZIR_SABLONLAR`, `olcumleriDogrula` ve `kodUret` bugün başka bir dosyadan çağrılmıyor (grep); dışa açık duruyorlar.

### Sınav grubu uçları (`/api/examgroups`)

Hepsinde `need(null)` (oturum, onaylı hesap) ve `isTeacherLike` (öğretmen ya da müdür); değilse 403 "Yetkin yok". Okulda
"Sınavlar" bölümü kapalıysa istek buraya gelmez (`examgroups → sinav`, [ozellikler.md](ozellikler.md)); geçmiş yılda grup
açmak `api.js`'in arşiv kapısında 409.

- **`GET /api/examgroups`** — öğretmenin grupları, seçili yıla süzülmüş: `{ groups: [{ id, name, subject, createdAt,
  examCount, weightTotal }] }`.
- **`POST /api/examgroups`** — gövde `{ name, subject? }`. Ad zorunlu (100). Ders öğretmende branşı, müdürde `subject` ya da
  `branchOf`. `sinav.olustur` yetkisi o ders için gerekir (403). Yıl damgası basılır. Cevap `{ group }`.
- **`GET /api/examgroups/<id>`** — yalnız grubun sahibi (değilse 403; yoksa 404). `{ group, exams: [{ id, name, weight, tarih,
  templateName, graded }], averages: [{ id, fullName, average }] }`. `average` öğretmenin ulaşabildiği her öğrenci için:
  her sınavın ana ölçümü 100 üzerinden (`yuzluk`: 0–500 aralığında 400 → 80), etki oranıyla ağırlıklı, iki basamak; hiç
  değeri yoksa `null`.
- **`POST /api/examgroups/<id>/delete`** — yalnız sahibi; grup ve içindeki sınavlar (veritabanı zinciriyle) silinir.

### Sınav uçları (`/api/exams`)

Hepsinde `need(null)`. Okulda "Sınavlar" kapalıysa istek buraya gelmez (`exams → sinav`). Geçmiş eğitim yılına bakan
öğretmen/müdürün `/api/exams` altındaki her POST'u `api.js`'in arşiv kapısında 409 alır; yalnız şablonlar
(`/api/exams/sablonlar...`) bu kapıdan muaftır (şablon okulundur, yıla bağlı değil).

- **`GET /api/exams/grafik?ogrenci=<id>&sablon=<id>`** — öğrencinin grafiği. Öğrencide `ogrenci` boşsa kendisi; öteki
  rollerde zorunlu ("Öğrenci seçmelisin"). `canSeeStudent` ile yetki: öğrenci kendisi, bağlı veli (öğretmen/müdür de kendi
  çocuğunun velisi olabilir), aynı okulun müdürü, öğrencinin öğretmeni, "öğrenci portalına girer" (`ogrenci.portal`)
  yetkili aynı okulun öğretmeni, sistem yöneticisi; değilse 403. Okul personeli yalnız KENDİ okulunda yapılan sınavları
  görür; öğrenci, velisi ve okulu olmayan sistem yöneticisi (nakil öncesi okullar dahil) hepsini. Cevap `{ sablonlar: [{ id, name }], sablonId, olcumler, sinavlar: [{ …, bant }] }`; `bant` her sınavın her
  ölçümünde o sınava girenlerin en düşük, en yüksek ve ortalama değeri ile değer sayısı. Şablon seçilmezse ilki.

Buradan sonrası yalnız öğretmen ve müdür (`isTeacherLike`), değilse 403.

**Şablonlar** (`/api/exams/sablonlar`)

- **`GET /api/exams/sablonlar`** — `{ sablonlar: [{ id, name, olcumler, createdAt, duzenleyebilir }], hazir: [{ anahtar,
  name, olcumler }] }`. `hazir` okulda aynı adla şablon yoksa önerilir.
- **`POST /api/exams/sablonlar`** — `{ hazir: 'yazili'|'test'|'lgs' }` hazır şablonu okulda bulur ya da açar (açan kişisiz:
  okulun ortak şablonu, yalnız müdür değiştirir; bilinmeyen anahtar 400 "Hazır şablon bulunamadı"); ya da `{ name,
  olcumler }` yeni şablon (ad zorunlu, 60; okulda tekil, değilse 400 "Bu adla bir şablon zaten var"). Cevap `{ sablon }`.
- **`GET /api/exams/sablonlar/<id>`** — başka okulun şablonu 404. Cevap `{ sablon }`.
- **`POST /api/exams/sablonlar/<id>`** — `{ name?, olcumler }` günceller; yalnız açan kişi ya da müdür (403). Ad değişiyorsa
  okulda tekil olmalı. Şablonu değiştirmek eski sınavları etkilemez.
- **`POST /api/exams/sablonlar/<id>/delete`** — yalnız açan ya da müdür; şablonla yapılmış sınav varsa 400 ("… öğrenci
  grafikleri bozulmasın diye silinemez. Adını ya da değer alanlarını değiştirebilirsin.").

**Sınavlar**

- **`GET /api/exams`** — öğretmenin sınavları, seçili yıla süzülmüş: `{ exams: [{ id, name, tarih, subject, groupId,
  groupName, templateId, templateName, olcumSayisi, graded }] }`.
- **`POST /api/exams`** — yeni sınav. Gövde `{ name, groupId?, weight?, templateId? | olcumler? | hazir?, tarih?, subject? }`.
  - ad zorunlu (100); `sinav.olustur` yetkisi (önce genel, sonra dersle) gerekir;
  - `groupId` varsa grup kişinin olmalı (değilse 400 "Sınav grubu bulunamadı") ve `weight` 0'dan büyük, en çok 100 olmalı
    ("Etki oranı 0'dan büyük, en fazla 100 olmalı");
  - ölçümler şu sırayla: `templateId` (bu okulun şablonu; değilse 400 "Şablon bulunamadı"), `olcumler` (elle;
    `olcumleriDogrula`), hiçbiri yoksa `hazir` (varsayılan `yazili`; bilinmeyen anahtar 400);
  - `tarih` verilmezse bugün (sunucunun yerel günü), verilirse geçerli `YYYY-AA-GG` (değilse 400 "Tarih geçersiz");
  - ders grubunki, yoksa öğretmenin branşı, müdürde `subject`/`branchOf`.
  Sınav ve ölçümleri tek işlemde yazılır, yıl damgası basılır. Cevap `{ exam }`.
- **`GET /api/exams/<id>`** — yalnız sınavın sahibi (403; yoksa 404). `{ exam (groupName ile), students: [{ id, fullName,
  classId, className, grade, degerler: { <kod>: değer|null } }] }`; `grade` ana ölçümün değeri (eski biçim). `students`
  öğretmenin bugün ulaşabildiği BÜTÜN öğrencilerdir (`ogretmeninOgrencileri`; müdürde okulun hepsi), yalnız değeri
  girilenler değil; sınıfı değişen ya da ayrılan öğrencinin girilmiş değeri bu listede görünmez.
- **`POST /api/exams/<id>/grades`** — değer girişi; `sinav.not-gir` yetkisi o ders için (403). İki biçim birlikte gelebilir:
  `{ grades: { <ogrenciId>: 85 } }` (ana ölçüm) ve `{ degerler: { <ogrenciId>: { D: 18, Y: 2 } } }` (ölçüm koduyla). Yalnız
  öğretmenin ulaşabildiği ve rol kapsamındaki sınıfların öğrencileri işlenir (öbürleri sessizce atlanır). Boş değer kaydı
  siler; sayı olmayan ya da aralık dışı değer yazılmaz. Değerler 3 basamağa yuvarlanır. Sonuç, değeri İLK KEZ girilen
  öğrenciye bildirilir (velisine kopya): "Matematik dersinden "1. Yazılı" sınavının sonucu açıklandı.". Cevap `{ exam,
  atlanan, hatalar }` (`hatalar` ilk 5: "Net: 25 (-100 ile 100 arası olmalı)").
- **`POST /api/exams/<id>/olcumler`** — "+ Yeni değer ekle", ad/aralık değiştirme, silme; `sinav.olustur` yetkisi. Gövde
  `{ olcumler }` (`olcumleriDogrula`); bu sınavda olmayan `id` yeni sayılır. Var olan bir ölçümün aralığı daraltılıyorsa ve
  girilmiş değer dışarıda kalacaksa 400 ("… N değer yeni aralığın dışında kalıyor"). Cevap `{ exam }`.
- **`POST /api/exams/<id>/delete`** — `sinav.olustur` yetkisi; sınav (ölçümleri ve değerleriyle) silinir.

Tanınmayan yol/yöntemde uç hiçbir şey yazmaz; `api.js` 404 verir.

### İç işlevler

- `hazirSablon(me, anahtar)` — hazır şablonu okulda adıyla bulur, yoksa açar (`createdBy: ''`).
- `sablonDuzenleyebilir(me, s)` — müdür ya da şablonu açan kişi; `sablonCevabi(me, s)`.
- `anaOlcum(e)`, `yuzluk(deger, o)`, `yuvarla(n, basamak)`, `tarihDogrula(v)`, `bugun()`.
- `sinavUclari(k)` — `/api/exams` uçları.

## Kimle konuşur?

- Çağırdıkları: `../http` → `bad`, `ok`; `../iliskiler` → `branchOf`, `canSeeStudent`, `isTeacherLike`,
  `ogretmeninOgrencileri`, `ogretmeninSiniflari`; `../ortak` → `clean`, `now`, `ondalik` (virgüllü sayı), `uid`; `../veri` →
  `depo`, `topluBildir`; `../yetki` → `yetkiVarMi` (`sinav.olustur`, `sinav.not-gir`, ders/sınıf kapsamıyla);
  [egitim-yili.md](egitim-yili.md) → `yilDamgasi`, `yilSuz`.
- Depo ve tablolar: `depo.sinavlar` (`sunucu/veri/depo/sinavlar.js`) → `sinav_sablonlari`, `sablon_olcumleri`,
  `sinav_gruplari`, `sinavlar`, `sinav_olcumleri`, `sinav_degerleri` (`kullanicilar` ile birleşir): `sablonlar`, `sablonBul`,
  `sablonEkle`, `sablonGuncelle`, `sablonunSinavSayisi`, `sablonSil`, `grupBul`, `ogretmeninGruplari`, `grupEkle`, `grupSil`,
  `bul`, `grubun`, `ogretmenin`, `ekle`, `sil`, `olcumleriYaz`, `aralikDisi`, `bantlar`, `degerleriYaz`, `degerleri`,
  `ogrencininSerisi`, `ogrencininSablonlari`. Bildirim tekilliği `depo.genel.ilkKezOlanlar` → `hatirlatmalar` tablosu
  (anahtar `sinav:<sınav>:<öğrenci>`).
- Onu çağıran: yalnız `sunucu/api.js` (`BOLUM['exams']`, `BOLUM['examgroups']`). Öğrencinin sınavları `ilerleyis.js` ve
  öğretmenin öğrenci ekranı `ogretmen.js` aynı depoyu (`ogrencininGruplari`, `ogrencininTekSinavlari`) doğrudan kullanır.
- Ön yüz: `public/js/parcalar/12-ogretmen-sinav.js` (öğretmenin sınav ve grup ekranları, şablonlar, değer girişi, ölçüm
  düzenleme), `public/js/parcalar/28-grafik.js` (`/exams/grafik`).
- Android uygulaması kullanmaz.

## Nasıl çalışır (adım adım)?

### Sınav açma ve değer girme

```
POST /api/exams { name, templateId }
   ─► sinav.olustur ─► (grup? sahiplik + etki oranı) ─► ölçümler: şablon | elle | hazır "Yazılı"
   ─► tarih ─► ders ─► sinav.olustur(ders) ─► depo.ekle (sınav + ölçüm KOPYASI) + yıl damgası

POST /api/exams/<id>/grades { degerler: { ö1: { D: 18, Y: 2, N: 17,5 } } }
   ─► sinav.not-gir(ders) ─► izinli öğrenciler (ulaşılabilen ∩ rol kapsamındaki sınıflar)
   ─► her değer: boş → sil | sayı ve aralıkta → yaz | değilse hatalar[]
   ─► degerleriYaz ─► ilkKezOlanlar("sinav:e:ö") ─► yalnız ilk kez girilenlere bildirim
```

### Grup ortalaması

```
average(ö) = Σ ( yüzlük(ana ölçüm değeri) × ağırlık ) / Σ ağırlık     (değeri olmayan sınav sayılmaz)
yüzlük(v)  = (v − alt) / (üst − alt) × 100
```

## Dikkat!

- **Şablon kopyalanır:** sınav açılırken ölçümler şablondan kopyalanır; şablonu değiştirmek eski sınavları bozmaz. Ama
  kullanılmış şablon SİLİNEMEZ, çünkü grafik sınavları şablona göre yan yana koyar; silinirse öğrencilerin grafiği boşalır.
- **Hazır şablon okulun ortağıdır:** ilk kullanan öğretmenin olmaz (`createdBy` boş); yalnız müdür değiştirir/siler.
- **Aralık daraltma:** girilmiş değeri dışarıda bırakacak daraltma reddedilir; yoksa kayıtlı not aralık dışında kalırdı.
- **Bildirim yalnız ilk girişte:** öğretmen bir değeri düzeltince ya da yeni ölçüm ekleyince öğrenciye yeniden bildirim
  gitmez (`hatirlatmalar` tablosunda anahtar).
- **Sessiz atlamalar:** değer girişinde yetki kapsamı dışındaki öğrenci ya da bilinmeyen ölçüm kodu hata vermeden atlanır;
  yalnız sayı/aralık hataları `hatalar`'a girer.
- **Grafikte okul sınırı:** personel yalnız kendi okulundaki sınavları görür (nakil gelen öğrencinin eski okul notları
  görünmez); öğrenci ve veli hepsini görür.
- **Tarih:** "bugün" sunucunun yerel günüdür (`bugun()`); sunucu Türkiye saatinde çalışmalı.
- **Sınav yalnız açanındır:** müdür bile başka öğretmenin sınavını bu uçlardan açamaz (`e.teacherId !== me.id` → 403);
  ödevdeki "sahipsiz ödevi müdür yönetir" kuralı sınavlarda yok.
- Grup silme ucu `sinav.olustur` yetkisine bakmaz; yalnız sahiplik yeter (sınav silme ise yetki ister).

## Testleri

- `testler/test-sinav.js` — şablonlar (hazır şablon önerisi ve bir kez açılması, elle şablon ve kod üretimi, alt > üst,
  ±10000 sınırı, aynı ad, başka öğretmenin değiştirememesi, okulun tamamına görünmesi), grupsuz sınav ve virgüllü
  ondalık değer, aralık denetimi, "+ yeni değer ekle", grafik verisi, grup ortalaması (100 üzerinden); ayrıca ödevin açılma
  zamanı ve "geç yaptı" sonucu.
- `testler/test-bildirim.js` — sınav sonucu bildirimi yalnız ilk girişte (düzeltmede yeniden gitmez), velisine kopya.
- `testler/test-egitim-yili.js` — arşiv yılında grup açma 409; `testler/test-ozellikler.js` — sınav kapalı okulda 403.
- `testler/test-siniflarim.js` — öğretmenin öğrenci ekranında sınav sonucunun (87,5) görünmesi.
- Elle: öğretmenle Sınavlar sayfasında "LGS Denemesi" şablonuyla bir sınav aç, iki öğrenciye netleri gir (virgülle);
  öğrenciyle Grafik sayfasında sınavı gör.

## Son durum

- Son commit `79ed25d commit 205` (2026-09-25): dosyanın sonuna `module.exports` eklendi. Dosya dört commit'te parça
  parça kuruldu: ondan önce `9dc240f commit 204` (255 satır), `436c794 commit 203` (114 satır) ve `cde6f4f commit 202`
  (88 satır: dosyanın açılışı).
- O günden beri bu dosya değişmedi. Açık iş yok. Sıradaki işlerden "Mesaj ayarları, …, sınav planlama (salon/koltuk)"
  sınavlara yeni bir katman ekleyecek; "Yıl geçişi" arşiv yıllarına dokunacak.
- Planlı: "Sınav: formüllü ölçüm + Excel" işi (kullanıcı 28 Eylül akşamı istedi; öneri sunuldu, onay bekliyor). Ölçüm
  "elle girilir" ya da "hesaplanır" olacak; hesaplanan ölçümün formülü ölçüm kodlarıyla yazılır (`D - Y/4`,
  `TR + MAT + FEN`; yalnız sayılar, kodlar, dört işlem ve parantez) ve KENDİ küçük hesaplayıcımızla, `eval` olmadan
  hesaplanır. Aynı iş notları Excel'den yüklemeyi ve Excel'e indirmeyi getirecek. Bugün bu dosyada formül yok: Net gibi
  değerler elle girilir, notlar tek tek girilir.
