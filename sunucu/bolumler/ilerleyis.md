# sunucu/bolumler/ilerleyis.js

Öğrencinin ilerleyişi (`/api/progress`) ve haftalık ders programı (`/api/myschedule`): ödevleri ve sonuçları, ders
başına başarı oranı, sınav grupları ve ortalamalar, ödev serisi.

## Bu dosya ne yapar?

Öğrencinin "Ödevlerim", "İlerleyişim", ana sayfa kutucukları; velinin çocuğunun ödev ve sınav ekranları; öğretmenin ve
müdürün bir öğrencinin ilerleyişine bakması — hepsi aynı uçtan beslenir: `GET /api/progress`. Öğrencinin ödev LİSTESİ de
buradadır (ödev bölümü, [odev.md](odev.md), öğretmen tarafını tutar). Cevap, bakan kişiye göre biraz değişir: yıldızlar ve
"ödev serisi" yalnız öğrencinin kendisine gider; ödevler ve sınavlar bakanın seçtiği eğitim yılına süzülür; okulun
kapattığı "Ödevler" ya da "Sınavlar" bölümü hiç gelmez.

İkinci uç `GET /api/myschedule` öğrencinin sınıfının haftalık programını verir ("Programım").

## İçinde neler var?

### Dışa açılan işlevler

- `odevSerisi(odevler, ogrenciId)` → `{ sayi, enUzun, uyari, bozuldu, toplam }`. Sonuçlanmış (`status === 'finished'`) ve
  bu öğrenciye sonuç yazılmış ödevler son teslim anına göre (`odevBitisAni`; o yoksa ödevin oluşturulma anı
  `createdAt`) sıralanır. Her "Yaptı" seriyi 1 artırır
  ve kaçırma sayacını sıfırlar; başka bir sonuç kaçırma sayar, arka arkaya İKİNCİ kaçırmada seri 0'a düşer. `uyari` = son
  sonuç tek bir kaçırma ve seri hâlâ ayakta; `bozuldu` = son iki (ya da daha çok) sonuç kaçırma; `enUzun` = görülen en uzun
  seri; `toplam` = sayılan ödev.
- `progressOf(studentId, bakan)` → ilerleyiş nesnesi ya da öğrenci yoksa `null`:
  - `student: { id, fullName, grade, schoolName }` — bilerek dar (kod yorumu: bu uç öğrencinin dersine giren her
    öğretmene açık; veli kodu, adres, telefon, e-posta, doğum tarihi gitmez);
  - `assignments: [{ id, title, description, subject, startAt, endAt, endTime, status, teacherName, acildi, result,
    ekler, quiz, yildizli? }]` — yeniden eskiye; `result` yalnız sonuçlanmış ödevde; `teacherName` okulun
    öğretmen/müdürlerinden (ayrılmışsa "Bilinmiyor"); `ekler` `ekGorunumu` ile ([ekler.md](ekler.md)); `quiz`
    `ilerleyisOzetleri`'nden kısa özet (durum; puan yalnız sonuç açılınca; soru, şık, doğru cevap, sekme kaydı ASLA —
    [quiz.md](quiz.md)); `yildizli` yalnız öğrencinin kendisi bakarken;
  - `subjects: [{ subject, yapti, yapmadi, eksik, gec, izinli, gelmedi, toplam, oran }]` — ders adına göre Türkçe sıralı;
    `oran` = (Yaptı + (Eksik + Geç) × 0,5) / (Yaptı + Yapmadı + Eksik + Geç + Gelmedi) × 100, yuvarlanmış; "izinli"
    paydaya girmez (kod yorumu: izinli gelmemek oranı düşürmez, izinsiz gelmemek düşürür); hiç sayılan yoksa `null`;
  - `examGroups: [{ id, name, subject, teacherName, exams: [{ id, name, weight, grade, alt, ust }], average }]` —
    `average` notu girilmiş sınavların ağırlıklı ortalaması, her not önce `(not − alt) / (üst − alt) × 100`'e çevrilir,
    iki haneye yuvarlanır; hiç not yoksa `null`;
  - `exams` — gruba bağlı olmayan sınavlar (`schoolId` ve `yilId` alanları silinerek);
  - `kapaliOzellikler` — öğrencinin okulunun kapalı bölümleri;
  - `seri` — yalnız öğrencinin kendisi bakarken `odevSerisi(...)` (kod yorumu: teşvik; kimseyle karşılaştırılmaz).
- `uclar(k)` — aşağıdaki iki uç.
- İç: `yuvarla(n)` — iki ondalık.

### Uçlar

- **`GET /api/progress?studentId=`** — girişsiz 401 "Giriş yapmalısın" (burada `need()` çağrılmaz; hesap onayı
  ve kapılar `api.js`'te). `studentId` yoksa bakanın kendisi. `canSeeStudent(me, sid)` geçmezse 403 "Bu öğrenciyi görme
  yetkin yok"; `progressOf` `null` dönerse (öğrenci değil) 404 "Öğrenci bulunamadı". Kim görür (`canSeeStudent`,
  `sunucu/iliskiler.js`): yönetici; öğrencinin kendisi; veli bağı olan (rolü ne olursa olsun, öğrenci hariç); aynı okulun
  müdürü; aynı okulda `ogrenci.portal` yetkisi olan öğretmen (ör. rehber öğretmen); öğrencinin derslerine giren öğretmen.
  Servisçi göremez.
- **`GET /api/myschedule?studentId=`** — `need(null)` (401/403). Öğrenci `studentId`'siz kendi programını alır; başkası
  `studentId` vermezse 400 "Öğrenci seçmelisin"; verip `canSeeStudent`'ten geçemezse 403 "Bu öğrenciyi
  görüntüleyemezsin"; hedef öğrenci değilse 404. Cevap `{ className, gunSayisi: 7, gunAdlari: ['', 'Pazartesi', …,
  'Pazar'], cells: [{ id, day, start, end, subject, teacherName }] }`; sınıfı yoksa boş.

`/api/progress` ve `/api/myschedule` okulun kapatabileceği yollar değildir (`ozellikler.js`: "ilerleyiş… karışıktır:
kendi içinde kapalı bölümü atlar"); kapalı bölümü `progressOf` kendisi atlar. İkisi de rolsüz yetişkin hesabına kapalıdır
(`ROLSUZ_SERBEST`'te yoklar).

## Kimle konuşur?

- Çağırdıkları:
  - `../http` → `bad`, `ok`; `../iliskiler` → `GUN_ADLARI`, `GUN_SAYISI`, `canSeeStudent`; `../ortak` →
    `RESULT_TYPES` (`yapti`, `yapmadi`, `eksik`, `gec`, `izinli`, `gelmedi`), `clean`; `../veri` → `depo`;
  - `./egitim-yili` → `yilSuz`, `bakisKisisi` ([egitim-yili.md](egitim-yili.md));
  - `./odev` → `odevBitisAni`, `odevSaati`; `./ekler` → `ekGorunumu`; `./quiz` → `ilerleyisOzetleri`.
- Depo ve tablolar:
  - `depo.odevler` → `odevler`, `odev_ogrencileri` (sonuç, açılma, `yildiz` sütunu): `ogrencinin`, `yildizlilari`;
  - `depo.sinavlar` → `sinav_gruplari`, `sinavlar`, `sinav_olcumleri`, `sinav_degerleri`: `ogrencininGruplari`,
    `ogrencininTekSinavlari`;
  - `depo.ekler.odevlerin` → `ekler`; `depo.kullanicilar` → `bul`, `okulun`; `depo.siniflar` → `bul`,
    `sinifinProgrami` (`siniflar`, `ders_programi`, `dersler`); `depo.ozellikler` → `kapaliMi`, `kapalilar` (bellekten).
- Onu çağıran: yalnız `sunucu/api.js` (`BOLUM.progress`, `BOLUM.myschedule`); dışa açılan işlevleri başka dosya
  kullanmıyor (grep). `uclar` `p`'ye bakarak iki yolu ayırır; başka yolda `false` döner.
- Ön yüz: `public/js/parcalar/08-ana-sayfa.js` (kutucuklar), `13-ogrenci-veli.js`, `14-odev-filtre.js` (Ödevlerim),
  `14c-quiz.js` (sekme yeniden açılınca süren quizi `/progress`'ten bulur), `27-veli-panel.js` (velinin çocuk ekranları), `22-programim.js`
  (`/myschedule`). `testler/seed.js` de örnek veri kurarken `/progress`'e bakar.
- Android uygulaması bu uçları bugün çağırmıyor (grep).

## Nasıl çalışır (adım adım)?

```
GET /api/progress?studentId=S   (bakan = me)
  canSeeStudent(me, S) ?                     hayır -> 403
  progressOf(S, me):
    okulda ödev/sınav kapalı mı?  -> o kısım boş
    ödevler (yeniden eskiye) + okulun öğretmen adları + (kendisiyse) yıldızlar
    bakis = bakisKisisi(me, öğrenci) -> yilSuz   (veli çocuğun gözünden; personel kendi okulundan)
    ekler + quiz özetleri
    ders başına sayım -> oran
    sınav grupları (ağırlıklı yüzde ortalama) + grupsuz sınavlar  (yıla süzülü)
    kendisiyse seri
```

## Dikkat!

- **Seri ile oran "izinli"yi farklı sayar.** Başarı oranında "Gelmedi (izinli)" paydaya girmez; ama `odevSerisi` "Yaptı"
  dışındaki HER sonucu kaçırma sayar — izinli de seriyi uyarıya düşürür. Serinin yorumu "geç, eksik, yapmadı, gelmedi"
  diye sayıyor, izinliyi ayrıca anmıyor.
- Nakil gelen öğrencinin eski okulundaki ödev ve notları yeni okulun personeline görünmez (kod yorumu); veli çocuğun
  gözünden (`bakisKisisi`) baktığı için geçmiş yılları seçerek görebilir.
- `teacherName` yalnız öğrencinin ŞİMDİKİ okulunun öğretmen ve müdürlerinden bulunur; okuldan ayrılmış öğretmenin ya da
  eski okulun ödevinde "Bilinmiyor" yazar.
- Quiz özeti bu uca soru, şık, doğru cevap ve sekme kaydı sokmaz: uç veliye ve öğretmenlere de açık (kod yorumu; test).
- `progress` ucu `need()` yerine yalnız `me`'ye bakar; `canSeeStudent` yöneticiye de `true` döner (okulsuz yönetici
  öğrencinin ilerleyişini görebilir). Kapalı bölüm kontrolü `st.schoolId`'ye göredir, bakanın okuluna göre değil.
- `exams` öğelerinden `schoolId` ve `yilId` silinir (dışarı gitmesin diye); nesneler depodan her istekte yeni geldiği için
  bu değiştirme güvenli.
- Grup ortalamasında `ust === alt` olan bir sınav sıfıra bölme yapar; bu değerleri doğrulamak sınav bölümünün işi
  ([sinav.md](sinav.md)).

## Testleri

- `testler/test-siniflarim.js` — ödev serisi: arka arkaya "Yaptı", tek kaçırma uyarı, ikinci kaçırma bozar, en uzun seri.
- `testler/test-quiz.js` — `/progress`'te quiz özeti; soru ve doğru bilgisi yok (deneme sürerken de); veliye yalnız durum,
  sonuç açılınca yalnız puan.
- `testler/test-sinav.js` — ilerleyişte grupsuz sınavlar ve grup ortalaması; açılmamış ödev işareti.
- `testler/test-nakil.js` — öğrencinin eski okul ödevini önceki okul seçilince görmesi, yeni okulun eski ödevi görmemesi.
- `testler/test-odev-saat.js` — ödevin saati; yıldızlar yalnız öğrencinin kendisine.
- `testler/test-veli-coklu.js` — veli çocuğunun ilerleyişini görür; bağ kalkınca göremez.
- `testler/test-yonetim.js` — müdür öğrencinin ilerleyişini ve programını görür; şifresini değiştirmeyen ve rolsüz hesap
  giremez. `testler/test-program.js` — `/api/myschedule` (sınıf adı, ders saatleri).
- `testler/guvenlik-test.js` (sahte oturum reddi), `test-ozellikler.js`, `test-okul-agi.js` (yük), `test-giris-kayit.js`,
  `test-etut.js`, `test-yorum-ek.js`.
- Elle: öğrenci hesabıyla (`testler/seed.js`) `GET /api/progress`; veliyle `GET /api/progress?studentId=<çocuk>`.

## Son durum

- Son commit `3b8fd36 commit 519` (2026-09-27): quiz — `ilerleyisOzetleri` ile her ödeve `quiz` özeti eklendi.
- `6550821 commit 444` (2026-09-26): `odevSerisi` ve `yuvarla` eklendi, `seri` alanı geldi.
- `e544270 commit 201` (2026-09-25): `progressOf` (ödevler, ders oranları, sınav grupları; yıl süzgeci, kapalı bölümler).
  Daha eski: `fec16a6 commit 143`, `059e0b8 commit 142` (2026-08-31).
- Açık iş yok. Sıradaki planlı değişiklik: "Optimizasyon + saklama süreleri (… öğrenci/veli yalnız son 1 geçmiş yıl)" işi
  bu uçta yıl süzgecini daraltacak.
