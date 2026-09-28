# sunucu/bolumler/odev.js

Öğretmenin ödev uçları (`/api/assignments`: ver, listele, sonuçlandır, düzelt, yeniden aç, sil) ve bütün sitenin
kullandığı "ödevin teslim anı" yardımcıları.

## Bu dosya ne yapar?

Öğretmen (ya da müdür) bir ya da birkaç sınıftaki öğrencilere ödev verir; öğrenci ödevi açar, yıldızlar; son teslimden
sonra öğretmen her öğrenciye "Yaptı / Geç yaptı / Eksik / Yapmadı / Gelmedi" sonucunu yazar ve öğrenciyle velisine
bildirim gider. Bu dosya bu akışın öğretmen tarafını ve öğrencinin iki küçük ucunu (açıldı, yıldız) sunar. Öğrencinin
ödev LİSTESİ burada değil, `/api/progress` (`sunucu/bolumler/ilerleyis.js`) içinde döner.

Ödev ile birlikte isteğe bağlı bir quiz de verilebilir; quizin işi [quiz.md](quiz.md)'de, bu dosya yalnız ilgili yolları
ona devreder. Ödeve öğretmenin eklediği dosyalar (ekler) [ekler.md](ekler.md)'de, öğrencinin yüklediği teslim dosyaları
[odev-dosya.md](odev-dosya.md)'de.

İkinci görevi: "bu ödevin son teslim anı ne, gecikti mi" sorusunu tek yerde cevaplamak. Eski kayıtlarda yalnız tarih
vardı; saati boş olan ödev 12:00'de biter sayılır. Takvim, ilerleyiş, quiz, okul ekranları ve teslim dosyası kuralları
hep bu işlevleri kullanır.

## İçinde neler var?

### Sabitler ve dışa açılan yardımcılar

- `ODEV_VARSAYILAN_SAAT` — `'12:00'`. Saat verilmemiş ya da bozuk saat yazılmış ödevin bitiş saati.
- `odevSaati(a)` — ödevin bitiş saati (`a.endTime` `saatDuzelt`'ten geçerse o, yoksa 12:00).
- `odevBitisAni(a)` — `endAt` günü + `odevSaati` birleşmiş `Date`; son tarihi olmayan ödevde `null` (süresiz).
- `odevBaslamaAni(a)` — `startAt` günü + başlama saati (yoksa 00:00); başlangıç yoksa `null` (hemen başlamış).
- `odevGecikti(a)` — şimdi son teslim anını geçti mi; son tarih yoksa `false`.
- `uclar(k)` — aşağıdaki uçlar.
- İç: `SONUC_AD` — sonuç anahtarının bildirimdeki adı (`yapti` → "Yaptı", `gec` → "Geç yaptı", `eksik`, `yapmadi`,
  `izinli` → "Gelmedi (izinli)", `gelmedi` → "Gelmedi (izinsiz)").

### Uçlar

Hepsi `p === 'assignments'` iken çalışır ve önce `need(null)`: oturum yoksa 401, hesap onaylı değilse 403. Okulda "Ödevler"
bölümü kapalıysa istek buraya gelmez (`api.js` → [ozellikler.md](ozellikler.md), `assignments → odev`). Geçmiş eğitim yılına
bakan öğretmen/müdürün ödev yazması `api.js`'in arşiv kapısında 409 alır.

**Öğrencinin uçları**

- **`POST /api/assignments/<id>/acildi`** — yalnız öğrenci; ödev ona verilmemişse 404 "Ödev bulunamadı". İlk açılış anını
  yazar (sonra değişmez). Öğretmen ödev ayrıntısında her öğrenci için `acilma` görür. Cevap `{ ok: true }`.
  Öğrenci olmayan biri bu yolu çağırırsa uç atlanır ve istek aşağıdaki öğretmen kurallarına düşer.
- **`POST /api/assignments/<id>/yildiz`** — gövde `{ yildiz: true|false }`. Öğrenci değilse 403; `yildiz` boolean değilse
  400; ödev ona verilmemişse 404. Yıldız yalnız o öğrencinin işaretidir. Cevap `{ yildiz }`.
- **`/api/assignments/<id>/quiz...`** (öğrenci) — hepsi `quiz.ogrenciUcu(k)`'ya gider (durum, başlat, cevap, sonraki,
  bitir, odak; bkz. [quiz.md](quiz.md)).

**Öğretmen/müdür kapısı:** bunlardan sonra `isTeacherLike(me)` (rol `teacher` ya da `principal`) olmayan kişinin GET
dışındaki her isteği 403 "Yetkin yok". Yönetici (`admin`) de öğretmen sayılmaz; okulu olmadığı için okul kaydı açamaz.

- **`POST /api/assignments/quiz-metin`** — "Quiz ekle > Metinden ekle" önizlemesi; `quiz.metinUcu(k)`'ya gider.
- **`GET /api/assignments/hedefler`** — ödev verme ekranı için: `{ classes: [{ id, name, students: [{ id, fullName }] }],
  lessons: [{ id, subject, classId, className }], subjects, varsayilanDers }`. Öğrenciler öğretmenin ulaşabildiği
  öğrencilerdir (`ogretmeninOgrencileri`; müdürde okulun hepsi); sınıfsız öğrenciler "Sınıfsız öğrenciler" başlığıyla
  sona eklenir. Dersler müdürde okulun bütün dersleri, öğretmende kendi dersleri; `subjects` aynı dersin sınıf kopyalarını
  tek ada indirir (hiç ders yoksa `SUBJECTS` genel listesi). `varsayilanDers` öğretmenin branşı.
- **`GET /api/assignments`** — öğretmenin verdiği ödevler, seçili eğitim yılına süzülmüş (`yilSuz`):
  `{ assignments: [{ id, title, description, subject, startAt, startTime, endAt, endTime, gecikti, status, createdAt,
  studentCount, acilan, summary, quiz }] }`. `summary` sonuç sayımı (`iliskiler.summarize`), `quiz` quizli ödevde küçük
  rozet (soru sayısı, süre, başlayan/bitiren; `quiz.listeOzetleri`).
- **`POST /api/assignments`** — yeni ödev. Gövde `{ title, subject?, description?, studentIds: [...], startAt?,
  startTime?, endAt?, endTime?, ekIdler?, quiz?, dosyaYukleme? }`. Kurallar:
  - `title` zorunlu (120); `subject` boşsa öğretmenin branşı (müdürde `branchOf`), o da yoksa 400 "Ders seç";
  - `studentIds` boşsa 400 "En az bir öğrenci seç"; yalnız öğretmenin ulaşabildiği öğrenciler kalır, hiçbiri kalmazsa 400
    "Seçtiğin öğrencilere ödev veremezsin" (fazladan gelen kimlikler sessizce atılır);
  - başlangıç günü son günden sonra olamaz; aynı gün biten ödevde başlama saati bitiş saatinden önce olmalı;
  - ders, seçilen öğrencilerin sınıflarından en az birinde okutulan bir ders olmalı ("Seçtiğin öğrencilerin sınıfında …
    dersi yok"); sınıfsız öğrencilerde ders `SUBJECTS` listesinde olmalı;
  - rol kapsamı: `odev.ver` yetkisi o ders ve o sınıflar için geçerli olmalı ("… dersine ödev verme yetkin yok",
    "6-A için ödev verme yetkin yok");
  - ekler `ekler.ekleriDogrula(me, 'odev', ekIdler)` ile (sahiplik, toplam boyut); quiz `quiz.yeniOdevQuizi(body.quiz)` ile
    denetlenir; bozuksa ödev de verilmez;
  - `dosyaYukleme` yalnız `true` gelirse açık (öğrenci teslim dosyası yükleyebilir; varsayılan kapalı).
  Ödev ve quiz TEK İŞLEMDE yazılır (`islem`), ödev eğitim yılıyla damgalanır (`yilDamgasi`), sonra ekler bağlanır ve
  öğrencilere (velilerine de kopya) "Yeni ödev: <ad> (<ders>)" bildirimi gider. Cevap `{ assignment, gonderilen, quiz }`.

**Tek ödevin uçları** (`/api/assignments/<id>/...`): ödev yoksa 404. Yalnız ödevi veren öğretmen yönetir; öğretmen
okuldan ayrıldıysa (ödev sahipsiz, `teacherId` boş) aynı okulun müdürü yönetir. Değilse 403 "Yetkin yok".

- **`/api/assignments/<id>/quiz...`** (öğretmen) — `quiz.ogretmenUcu(k, a)`'ya gider (quizi yaz/kaldır, öğrenci
  ayrıntısı, sonuçları aç).
- **`GET /api/assignments/<id>`** — `{ assignment, ekler, quiz, students: [{ id, fullName, result, acilma, quiz }] }`.
  Artık öğretmenin sınıfında olmayan öğrencinin adı ayrıca okunur; silinmiş öğrenci "(silinmiş öğrenci)". Quizli ödevde
  her öğrencinin quiz durumu (başlamadıysa `{ durum: 'baslamadi' }`), puan önerisi ve sekme kaydı gelir.
- **`POST /api/assignments/<id>/finish`** — sonuçlandır. `odev.sonuclandir` yetkisi o ders için gerekir (403). Gövde
  `{ results: { <ogrenciId>: 'yapti'|'gec'|'eksik'|'yapmadi'|'izinli'|'gelmedi'|''|null } }`. Gelen her öğrenci için
  sonuç yazılır; boş seçim eski sonucu kaldırır; listede hiç gelmeyen öğrenciye dokunulmaz; bilinmeyen değer yok sayılır.
  Ödev `finished` olur. Bildirim yalnız sonucu YENİ verilen ya da DEĞİŞEN öğrenciye gider ("Matematik dersinden "Oran
  orantı" ödevi açıklandı: Yaptı" / "sonucu değişti: …"; velisine kopya). Sonra `quiz.odevSonuclandi` quizi kapatır
  (açık denemeler biter, sonuçlar açılır). Cevap `{ assignment, bildirilen, quizBildirilen }`.
- **`POST /api/assignments/<id>/update`** — ödevin kendisini düzeltir; sonuçlandıktan sonra da olur. `odev.ver` yetkisi o
  ders için gerekir. Gövde: `title` (zorunlu), `description`, `startAt`, `startTime`, `endAt`, `endTime`,
  `dosyaYukleme` (boolean gelmezse değişmez), `ekIdler` (yeni ekler), `ekSilIdler` (kaldırılacak ekler). Tarih kuralları
  yenisiyle aynı. Ek boyutu kalan eklerle birlikte denetlenir (toplam 50 MB). Tarih değişmeden önce
  `quiz.teslimSonuclariniSabitle` çalışır. Tarih ya da ad değiştiyse ya da süren ödevde dosya yükleme yeni açıldıysa
  öğrencilere "Ödev güncellendi: … (son gün 05.10 12:00). Artık ödeve dosya yükleyebilirsin." bildirimi gider (son gün
  parçası yalnız tarih/saat değiştiyse, dosya cümlesi yalnız izin yeni açıldıysa). Tarih değiştiyse, quizin sonuçları
  açıklanmışsa ve ödev hâlâ sürüyorsa (aktif, süresi geçmemiş) mesaja "Quizin sonuçları açıklandığı için quiz yeniden
  başlatılamaz." notu eklenir. Cevap `{ assignment, message }`.
- **`POST /api/assignments/<id>/reopen`** — `odev.sonuclandir` yetkisi; ödev yeniden `active` olur. Quizin doğru cevapları
  açıklanmışsa mesaj quizin yeniden başlatılamayacağını söyler. Cevap `{ assignment, message }`.
- **`POST /api/assignments/<id>/delete`** — `odev.ver` yetkisi; ödev silinir. Cevap `{ ok: true }`.

Öğrenci ya da veli `GET /api/assignments` ve `GET /api/assignments/<id>` isteğinde 403 alır (öğretmen değil / ödevin
sahibi değil).

## Kimle konuşur?

- Çağırdıkları:
  - `../http` → `bad`, `ok`;
  - `../iliskiler` → `branchOf`, `isTeacherLike`, `ogretmeninOgrencileri`, `ogretmeninSiniflari`, `saatDuzelt`,
    `summarize`;
  - `../ortak` → `RESULT_TYPES` (geçerli sonuç anahtarları), `SUBJECTS` (genel ders listesi), `clean`, `now`, `uid`;
  - `../veri` → `depo`, `islem` (işlem), `topluBildir`; `../yetki` → `yetkiVarMi` (`odev.ver`, `odev.sonuclandir`,
    ders/sınıf kapsamıyla);
  - [egitim-yili.md](egitim-yili.md) → `yilDamgasi`, `yilSuz`;
  - [ekler.md](ekler.md) (geç yüklenir) → `ekleriDogrula`, `ekleriBagla`, `hedefinEkleri`;
  - [quiz.md](quiz.md) (geç yüklenir) → `ogrenciUcu`, `metinUcu`, `ogretmenUcu`, `listeOzetleri`, `yeniOdevQuizi`,
    `ogretmenQuizi`, `ogrenciOzetleri`, `odevSonuclandi`, `teslimSonuclariniSabitle`.
- Depo ve tablolar:
  - `depo.odevler` (`sunucu/veri/depo/odevler.js`) → `odevler`, `odev_ogrencileri` (kime verildi, sonuç, açılma, yıldız),
    `odev_siniflari`; `bul`, `ogretmenin`, `ekle`, `sonuclandir`, `duzelt`, `yenidenAc`, `sil`, `acildi`, `yildizla`;
  - `depo.quiz.yaz`, `depo.quiz.bul` → `quizler`, `quiz_sorulari`, `quiz_secenekleri` (şema 029);
  - `depo.ekler.hedefin`, `depo.ekler.sil` → `ekler` (şema 020);
  - `depo.siniflar` → `siniflar`, `dersler` (`okulunDersleri`, `ogretmeninDersleri`, `dersVarMi`, `bul`);
  - `depo.kullanicilar.bul`; `depo.genel.cokluBildir` → `bildirimler`.
- Onu çağıranlar:
  - `sunucu/api.js` — `BOLUM['assignments']`;
  - saat yardımcıları: `sunucu/bolumler/ilerleyis.js` (`odevBitisAni`, `odevSaati`), `sunucu/bolumler/okul.js`
    (`odevGecikti`, `odevSaati`), `sunucu/bolumler/takvim.js` (`odevSaati`), [odev-dosya.md](odev-dosya.md)
    (`odevBitisAni`), [quiz.md](quiz.md) (`odevBitisAni`, `odevBaslamaAni`).
- Ön yüz: `public/js/parcalar/11-ogretmen-odev.js` (liste, ayrıntı, ödev verme, düzeltme, quiz), `08-ana-sayfa.js`
  (öğretmen ana sayfası: `/assignments`, `/assignments/hedefler`), `14-odev-filtre.js` (öğrenci: `/acildi`, `/yildiz`),
  `14c-quiz.js` (quiz uçları, `/assignments/quiz-metin`), `25-tiklama.js` (ödev ver, `/finish`, `/reopen`, `/delete`).
- Android uygulaması bu uçları çağırmaz (yalnız bildirim bağlantısı `#/odevler` web sayfasını açar).

## Nasıl çalışır (adım adım)?

### Ödev verme

```
POST /api/assignments
  need(null) ─► öğretmen/müdür mü ─► title, subject
  ─► studentIds ∩ ogretmeninOgrencileri(me)          (ulaşamadığın öğrenci atılır)
  ─► tarih/saat kuralları
  ─► sınıflar = seçilen öğrencilerin sınıfları
  ─► ders bu sınıflarda var mı ─► odev.ver (ders) ─► odev.ver (her sınıf)
  ─► ekleriDogrula ─► yeniOdevQuizi
  ─► islem { odevler.ekle ; quiz.yaz }               (ikisi birden ya da hiçbiri)
  ─► ekleriBagla ─► topluBildir(öğrenciler + veli kopyası)
```

### Sonuçlandırma

1. Yetki (`odev.sonuclandir`, ödevin dersi).
2. `results`'tan yalnız bu ödevin öğrencileri ve geçerli değerler alınır.
3. `depo.odevler.sonuclandir` tek işlemde her öğrencinin sonucunu ve ödevin `finished` durumunu yazar.
4. Sonucu yeni ya da değişen öğrencilere bildirim (velisine kopya).
5. `quiz.odevSonuclandi(son)` quizi kapatır.

### Teslim anı

```
endAt = "2026-10-05", endTime = ""      → 2026-10-05 12:00
endAt = "2026-10-05", endTime = "15:40" → 2026-10-05 15:40
endAt = ""                              → null (süresiz, hiç gecikmez)
```

## Dikkat!

- **Saat, sunucunun yerel saatiyle yorumlanır.** `odevBitisAni` `new Date('YYYY-AA-GGTSS:DD:00')` kurar; saat dilimi
  yazılmadığı için Node sunucunun yerel saat dilimini kullanır. Sunucu Türkiye saatinde çalışmıyorsa (ör. UTC) teslim anı
  3 saat kayar. Servis bölümü bunun yerine `yardimci/hatirlatici-zaman.js`'teki Türkiye saatini kullanıyor; ödevde bu
  ayrım yok. Kurulumda sunucunun saat dilimi Türkiye olmalı.
- **Döngüsel yükleme:** `ekler.js` → `odev-dosya.js` → `odev.js` ve `quiz.js` → `odev.js` zinciri var. Bu yüzden
  `ekModulu()` ve `quizModulu()` işlev içinde `require` eder (geç yükleme). Dosyanın başına düz `require('./quiz')`
  yazarsan modüllerden biri yarım yüklenmiş nesne alır.
- **Ödev + quiz tek işlem:** quiz yazılamazsa ödev de yazılmaz; yoksa quizsiz yarım bir ödev öğrencilere giderdi. Ekler ise
  işlemden SONRA bağlanır (`ekleriBagla`); orada bir hata olursa ödev eksiz kalır.
- **Yalnız ulaşabildiğin öğrenci:** istenen kimlikler `ogretmeninOgrencileri` ile kesiştirilir; başka okulun ya da başka
  sınıfın öğrencisine ödev gitmez. Fazladan gelenler hata vermeden atılır (en az biri kalırsa).
- **Uydurma ders adı olmaz:** vekil öğretmen başka dersin ödevini verebilir ama ders o sınıfta okutuluyor olmalı.
- **Tekrar kaydetmek bildirim yağdırmaz:** sonuçlandırmada yalnız değişen sonuçlar bildirilir.
- **Tarih düzeltmesi teslim dosyalarını korur:** `depo.odevler.duzelt` son teslim değişince ya da kaldırılınca,
  `yenidenAc` her zaman teslim dosyalarının silinme anını en az "şimdi + 7 gün"e çeker (şema 034, `dosya_saklama`).
  Yanlışlıkla geçmişe yazılan bir tarih saatlik temizlikte bütün dosyaları sildirmesin diye.
- **Quiz sonuçları kalıcı:** tarih değişmeden önce `teslimSonuclariniSabitle` çağrılır; doğru cevapları gören olduysa son
  teslim ileri alınsa da sonuçlar kapanmaz ve quiz yeniden başlatılamaz.
- **Dosya yüklemeyi kapatmak** yüklenmiş dosyaları silmez; yalnız yeni yüklemeyi durdurur.
- **Silme:** `DELETE FROM odevler`; `odev_ogrencileri`, `odev_siniflari`, `quizler`, ödevin ekleri ve (öğrenci satırı
  üzerinden) `odev_dosyalari` satırları veritabanı zinciriyle (`ON DELETE CASCADE`) gider. Diskteki dosyaların ve okulun
  disk sayacının durumu için bkz. [odev-dosya.md](odev-dosya.md) ve [okul-disk.md](okul-disk.md).
- **Sahipsiz ödev:** öğretmen okuldan ayrılınca ödevin `teacherId`'si boşalır; o zaman yalnız aynı okulun müdürü yönetir.
- Dosyada, yöneticinin (okulu olmayan) okul kaydı açamaması gerektiğini anlatan ama altında kod olmayan bir yorum var
  ("Sistem yöneticisinin okulu yok…"). Bu dosyada bu korumayı `isTeacherLike` sağlıyor (yönetici öğretmen sayılmaz).

## Testleri

- `testler/test-odev-saat.js` — varsayılan 12:00, saat verme, bozuk saatin varsayılana düşmesi, gecikmenin saate göre
  hesabı, süresi geçmiş ödevin sonucunu değiştirme, yeniden açma, öğrenci tarafında saat, yıldız, takvimde saat,
  "Gelmedi (izinsiz)" sonucu, başlama saati.
- `testler/test-bildirim.js` — sonuçlandırma bildirimi yalnız değişenlere, velisine kopya.
- `testler/test-kapsam.js` — rol kapsamı: izinli/izinsiz ders ve sınıfa ödev, `hedefler`.
- `testler/test-quiz.js`, `testler/test-quiz-metin.js` — ödevle birlikte quiz, `quiz-metin`, sonuçlandırmada quizin kapanması.
- `testler/test-odev-dosya.js` — `dosyaYukleme` açma/kapama, bildirim.
- `testler/test-yorum-ek.js` — ödev ekleri (ekleme, kaldırma, boyut).
- `testler/test-egitim-yili.js` — yıl süzgeci ve arşiv yılında yazma 409; `testler/test-ozellikler.js` — ödev kapalı okul.
- `testler/yetki-denetimi.js`, `testler/girdi-denetimi.js`; ayrıca `test-etut.js`, `test-sinav.js`, `test-takvim.js`,
  `test-nakil.js`, `test-siniflarim.js`, `test-yedek.js` hazırlık için ödev açar.
- Elle: 3200'de sunucuyu aç, `testler/seed.js`'teki öğretmen hesabıyla gir, "Ödev ver"den iki öğrenciye bir ödev ver;
  öğrenciyle girip ödevi aç (öğretmen ekranında açılma saati görünür), sonra öğretmenle sonuçlandır.

## Son durum

- Son commit `566b917 commit 524` (2026-09-27, canlı hazırlık): ödeve `dosyaYukleme` ayarı eklendi (yeni ödevde yalnız
  `true` gelirse açık; düzeltmede boolean gelmezse değişmez); süren ödevde dosya yükleme açılınca öğrencilere "Artık ödeve
  dosya yükleyebilirsin." bildirimi; ek sınırı yorumu 150 MB'tan 50 MB'a indi.
- Ondan önce `3b8fd36 commit 519` (2026-09-27, quiz): `odevBaslamaAni` eklendi; öğrenci ve öğretmen quiz yolları
  `quiz.js`'e devredildi; `quiz-metin`; listede quiz rozeti; ödev ile quiz tek işlemde yazılır oldu; ayrıntıda öğrenci
  başına quiz durumu; sonuçlandırmada ve düzeltmede quiz kancaları.
- Daha önce `d94a53a commit 78` ve `89eb5fa commit 77` (2026-08-29).
- Açık iş: teslim anının sunucu saat dilimine bağlı olması (Dikkat'te). Sıradaki işlerden "Mesaj ayarları, …, ödev
  hatırlatma otomasyonu" bu dosyanın bildirimlerine dokunacak.
- Planlı (kullanıcının 28 Eylül akşamı kararları): "Anket düzenleyici" işi (onaylı) ödeve ek olarak anket koymayı;
  "Düzenleyiciler" işi (onaylı) ödev açıklaması için ortak yazı düzenleyiciyi (kalın, liste, bağlantı…; sunucu izinli
  biçim dışındakini siler) getirecek. Ödevin quizindeki değişiklikler [quiz.md](quiz.md)'de.
