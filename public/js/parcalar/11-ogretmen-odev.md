# public/js/parcalar/11-ogretmen-odev.js

Öğretmenin ve müdürün ödev ekranları: müdürün ders ders "Ödevler" ağacı, öğretmenin "Ödevler" listesi, "Yeni ödev"
penceresi (kime, ne zaman, ekler, dosya yükleme izni, quiz), ödev kontrol ekranı (her öğrenciye sonuç seçme) ve "Ödevi
düzenle".

## Bu dosya ne yapar?

Ödevin öğretmen tarafındaki hayatı bu dosyadadır:

1. **Ödev verme.** Öğretmen "Ödevler" sayfasında "Yeni ödev ver"e basar. Pencerede ders (öğretmenin dersleri; branşı
   seçili gelir), ödev adı, açıklama, başlama ve son tarih/saat (takvim düğmeli tarih alanı + yarım saatlik saat listesi),
   sınıf sınıf öğrenci listesi (sınıf kutusu bütün sınıfı seçer; "Tümünü seç / Tümünü kaldır"; "N öğrenci seçili" sayacı),
   dosya ekleme alanı ([04d-ekler.md](04d-ekler.md)), "Öğrenciler bu ödeve dosya yükleyebilsin" kutusu (kapalı gelir) ve
   "Quiz ekle" bölümü (`14c-quiz.js`) vardır. "Ödevi ver" düğmesi `25-tiklama.js`'teki `odev-kaydet` eylemine gider.
2. **Liste.** Öğretmenin verdiği ödevler "Aktif ödevler" / "Geçmiş ödevler" diye ayrılır (ayırma `14-odev-filtre.js`'te,
   yalnız ödevin durumuna göre: süresi dolmuş ama sonuçlandırılmamış ödev "Aktif ödevler"de "Süresi doldu" etiketiyle
   durur); her satırda ders, öğrenci sayısı, son teslim,
   durum etiketi ("Aktif · 3 gün", "bugün son gün", "Süresi doldu", "Sonuçlandı"), aktif ödevde "12 öğrenciden 9 kişi
   açtı", sonuçlanmışta altı renkli sayım (Yaptı, Geç yaptı, Eksik, Yapmadı, Gelmedi izinli/izinsiz), quizli ödevde "Quiz"
   rozeti ve "Quiz · 5 soru · 20 dk · 12 öğrenciden 3 kişi bitirdi". Düğmeler "Sonuçlandır" / "Sonuçları düzenle" ve
   "Sil". Aynı liste öğretmenin ana sayfasında "Aktif ödevler" olarak da çizilir.
3. **Ödev kontrolü.** Bir ödev açılınca üstte adı, konusu, son teslim, "kaç kişi açtı", dosya yükleme durumu ve ekler
   (quizli ödevde quiz satırı: Önizle, Quizi düzenle, Sonuçları şimdi aç). Altında öğrenciler sırayla: "Ödev 20.05.2026
   16:20 tarihinde açıldı" / "Ödev açılmadı", quiz rozeti ("Quiz: 8/10 · 2 kez çıktı (35 sn)"), yüklediği dosya sayısı
   ("3 ek", `14b-odev-teslim.js` ekler) ve sonuç kutusu (Yaptı · Geç yaptı · Eksik · Yapmadı · Gelmedi (izinli) · Gelmedi
   (izinsiz)). Kutu seçilince rengini alır, altta canlı sayım güncellenir. "Seçilmemişlerin hepsi: Yaptı" boşları
   doldurur. "Sonuçlandır ve kaydet" (sonuçlanmışta "Değişiklikleri kaydet"), "Tekrar aç", "Ödevi düzenle", "Geri dön".
   Süresi geçmiş ya da sonuçlanmış ödevde "Sonuçları yine de değiştirip yeniden kaydedebilirsin." notu çıkar (öğretmen
   ekranı salt okunur sanmasın).
4. **Ödevi düzenle.** Ad, açıklama, tarihler, ekler (var olanlar listede; kaldırılabilir), dosya yükleme izni ve quiz.
   Sonuçlanmış ödevde de çalışır; öğrenciler ve sonuçlar değişmez.
5. **Müdürün ders ödevleri** (`ders-odevleri`). Müdür ödev vermez; ders ders bakar: "6-A · Matematik — Ayşe Kaya — 2
   aktif, 5 geçmiş". Liste yalnız sayıları getirir; bir ders dalı açılınca o dersin ödevleri istenir. Sınıf seçiliyken
   "Hepsini aç" o sınıfın bütün derslerini tek istekte getirir. Öğretmeni okuldan ayrılmış (sahipsiz) ödevde müdür
   "Sonuçlandır"a basıp aynı kontrol ekranını açar.

Kim görür: öğretmen — menüde "Ödevler" `odev.ver` ya da `odev.sonuclandir` yetkisiyle çıkar ([06-menu.md](06-menu.md));
öğretmenin ana sayfasındaki "Ödevler" kutucuğu ise yetkiye bakmaz, yalnız okulun "Ödevler" bölümü açık mı diye bakar
([08-ana-sayfa.md](08-ana-sayfa.md)). Müdür — "Ödevler" menüsü `ders-odevleri`'ne gider (sunucu `ders.yonet` ister,
müdürde hep var). Okulda "Ödevler" bölümü kapalıysa sayfa açılmaz (`SAYFA_OZELLIK`, [06-menu.md](06-menu.md)).

Ön yüz parçaları ad sırasıyla tek bir IIFE'de birleşir (`/js/app.js`, [../../../sunucu/http.md](../../../sunucu/http.md)
`birlesikOku`); buradaki `function`'lar ve `var`'lar bütün parçalara açıktır.

## İçinde neler var?

### Sayfalar

- `SAYFALAR['ders-odevleri']` — müdürün ders ağacı. `GET /api/school/assignments` (`S.odevSinif` seçiliyse
  `?classId=`; sınıf seçili ve "Hepsini aç" basılmışsa `&detay=1`). `S.acikDersler` yoksa `{}` kurulur, `S.dersOdevleri`
  her açılışta sıfırlanır ve cevapta ödevleri gelen derslerle doldurulur; cevap `S.dersListesi`'ne konur, `dersOdevleriCiz`.
- `SAYFALAR['ogr-odevler']` — öğretmenin listesi. `GET /api/assignments` → `S.odevHam`; `S.odevF.mod = 'ogretmen'`;
  üst çubuktaki genel arama `S.araHook = odevSonucCiz`'e bağlanır. Başlık "ÖDEVLER — Aynı anda birden fazla ödev
  verebilirsin."; müdür değilse "Yeni ödev ver" (`data-act="odev-yeni"`); süzgeç çubuğu (`odevFiltreCubugu`), `#odevSonuc`;
  `odevFiltreBagla()`, `odevSonucCiz()` (süzgeç ve çizim `14-odev-filtre.js`'te; öğretmen kipinde satırları bu dosyadaki
  `odevListesiOgretmen` çizer).

### Müdürün ders ağacı

- `dersOdevleriCiz(d)` — "DERS ÖDEVLERİ" başlığı; sınıf seçici `select#oSinifSec` ("Tüm sınıflar" + `d.classes`), sınıf
  seçiliyse "Hepsini aç" (`ders-hepsini-ac`), her zaman "Hepsini kapat" (`ders-hepsini-kapat`). Ders yoksa "Bu sınıfa ders
  eklenmemiş.". Her ders için `div.ders-dal[data-ara]` (sınıf, ders, öğretmen adı; üst arama süzer) içinde
  `button.dal-basi[data-act="ders-dal"][data-id=<lessonId>]`: ok (▸/▾), "6-A · Matematik", öğretmen adı (yoksa kırmızı
  "öğretmen atanmadı"), sayılar ("2 aktif" mavi, "5 geçmiş" gri, ikisi de yoksa "ödev yok"). Dal açıksa: ödevler henüz
  gelmediyse "Yükleniyor...", boşsa "Bu derse henüz ödev verilmemiş.", değilse `odevGrubu('Aktif ödevler', …)` ve
  `odevGrubu('Süresi geçmiş', …)` (sonuçlanmış ya da `gecikti` olan geçmiştir; sunucu `gecikti` vermezse `teslimGecti`).
- `odevGrubu(baslik, liste)` — boş listede `''`. Her ödev: ad + quiz rozeti, "öğretmen · N öğrenci · son teslim (ya da
  süresiz)", açıklama, durum etiketi; ödev sahipsizse (`a.sahipsiz`) ve bakan müdürse "Sonuçlandır" (`odev-ac`).
- `sinifSeciciBagla()` — sınıf seçici değişince `S.odevSinif`, `S.dersHepsiAcik = false`, `git('ders-odevleri')`.
- `dersDaliAcKapa(dersId)` — `S.acikDersler[dersId]`'i çevirir; açıldıysa ve ödevleri yoksa
  `GET /api/school/assignments?lessonId=` ile bir kez ister, gelince `S.dersOdevleri`'ne yazar ve yeniden çizer (hata
  `hataGoster`). Hemen de bir kez yeniden çizer (ok döner, "Yükleniyor..." görünür). `25-tiklama.js` çağırır.
- `dersListesiniYenidenCiz()` — ağdan istemeden `S.dersListesi`'yle yeniden çizer, kaydırma yerini korur.
  `25-tiklama.js`'in "Hepsini kapat"ı da bunu çağırır.

### Öğretmenin listesi

- `odevListesiOgretmen(list)` — `div.kart` içinde her ödev bir `div.satir[data-ara]` (ad + ders): ad + `quizListeEtiketi`,
  "ders · N öğrenci · Son teslim: 4 Ekim 2026, Pazar · 12:00" (ya da "süresiz"); sonuçlanmışsa (`a.summary`) altı renkli
  sayı (başlıkları "Yaptı", "Geç yaptı", "Eksik", "Yapmadı", "Gelmedi (izinli)", "Gelmedi (izinsiz)"), değilse
  (`a.acilan`) "N öğrenciden M kişi açtı" (herkes açmadıysa `.acilmadi`); `quizOgretmenListeSatiri`; durum etiketi (aktifte
  kalan gün `gunFarki` ile: "Aktif · 3 gün", 0 ve altı "bugün son gün"); "Sonuçlandır" / "Sonuçları düzenle" (`odev-ac`)
  ve "Sil" (`odev-sil`). Kullananlar: `14-odev-filtre.js` (`odevSonucCiz`, öğretmen kipi) ve `08-ana-sayfa.js`
  (öğretmenin ana sayfasındaki "Aktif ödevler").

### "Yeni ödev" penceresi

- `odevYeniModal()` — `GET /api/assignments/hedefler` → `S.odevHedef` (yazılır ama başka yerde okunmuyor). Hiç sınıf
  yoksa pencerede "Ödev verebileceğin öğrenci yok. Müdürünün seni bir sınıfın dersine ataması gerekiyor.". Değilse form:
  - `select#mDers` — `d.subjects`, `d.varsayilanDers` (öğretmenin branşı) seçili;
  - `#mBaslik` (yer tutucu "Sayfa 42 alıştırmalar"), `#mAciklama`;
  - `.row2.odev-tarihler`: "Başlama tarihi *" `tarihAlani('mBas', bugün)` + `saatAlani('mBasSaat', tsSonrakiYarim())`
    (bir sonraki yarım saat), "Son tarih *" `tarihAlani('mBit', '', { min: 'mBas' })` + `saatAlani('mBitSaat', '12:00')`;
    ipucu "Takvimde her güne düşen tatil, etkinlik ve öteki ödevlerin görünür. Çoğu ödev için son saat 12:00 uygundur.";
  - "Ödev verilecekler": "Tümünü seç" (`odev-tumu`), "Tümünü kaldır" (`odev-hicbiri`), `#odevSayac`; `.hedef-liste` içinde
    her sınıf `.hedef-sinif`: `input.sinif-kutu[data-sinif]` + kalın "6-A" ve yanında "24 öğrenci" ve öğrenciler
    `input.ogrenci-kutu[value=<id>][data-sinif]`. Sınıfsız öğrencilerin grubu (sunucuda kimliği boş) `yok<sıra>` anahtarını
    alır;
  - `ekAlani('odev', 'odev')`, `dosyaYuklemeKutusu('mDosyaYukleme', false)`, `quizAlani('odev', null)`, `#mHata`.
  Düğmeler "Vazgeç" ve "Ödevi ver" (`odev-kaydet`). Açılınca `odevSecimBagla()`, `ekAlaniKur('odev')`.
- `dosyaYuklemeKutusu(id, acik, duzenleme)` — "Öğrenciler bu ödeve dosya yükleyebilsin" onay kutusu ve ipucu "Her öğrenci
  en fazla 10 dosya, toplam 50 MB yükler. Dosyalar son teslimden 7 gün sonra silinir."; düzenlemede ek cümle: "Kapatırsan
  yüklenmiş dosyalar silinmez; yalnız yeni yükleme durur. Son teslimi değiştirirsen yüklenmiş dosyalar en az 7 gün daha
  kalır.".
- `odevSecimBagla()` — sınıf kutusu değişince o sınıfın bütün öğrenci kutuları aynı olur; öğrenci kutusu değişince sayaç
  ve sınıf kutusu güncellenir (hepsi seçiliyse işaretli, bir kısmıysa `indeterminate`). `25-tiklama.js` "Tümünü seç /
  kaldır"dan sonra bunu yeniden çağırır.

### Ödev kontrol ekranı

- `ODEV_SONUC_SIRA` — `['yapti', 'gec', 'eksik', 'yapmadi', 'izinli', 'gelmedi']`: seçenek ve sayım sırası (adlar ve
  renkler `SONUC`'tan, [02-ikonlar.md](02-ikonlar.md)).
- `odevAc(id)` — `GET /api/assignments/<id>` → `S._acikOdev` (ödev), `S._acikOdevEkleri` (düzenleme penceresi için),
  `S._acikOdevQuiz` (önizleme/düzenleme için). Sayfanın içeriğini `yaz` ile değiştirir (adres ve `S.page` değişmez):
  - `.odev-bas`: `h1.odev-ad`, "Konusu" (açıklama yoksa ders adı), `.odev-meta` ("Matematik · son teslim … · 24 öğrenci ·
    9 kişi açtı · öğrenciler dosya yükleyebilir / dosya yükleme kapalı"), `ekListesiGoster(d.ekler,
    quizOgretmenSatiri(d.quiz, a))`;
  - sonuçlanmış ya da süresi geçmişse `msg bilgi` notu;
  - `.kart.odev-kontrol`: "Öğrenciler" + "Seçilmemişlerin hepsi: Yaptı" (`data-act="sonuc-hepsi" data-val="yapti"`); her
    öğrenci `div.satir.ok-satir[data-ara]`: sıra no, ad, açılma yazısı (`tarihSaat`), `quizOgrenciRozeti`,
    `select.sonuc-kutu[data-sid][data-deger]` ("— Seç —" + altı sonuç, kayıtlı sonuç seçili); altta `#okSayim`;
  - `.sinav-alt` düğmeleri: `yetkim('odev.sonuclandir')` ise "Sonuçlandır ve kaydet" / "Değişiklikleri kaydet"
    (`odev-bitir`) ve sonuçlanmışsa "Tekrar aç" (`odev-tekrar`); `yetkim('odev.ver')` ise "Ödevi düzenle" (`odev-duzelt`);
    her zaman "Geri dön" (`data-nav="ogr-odevler"`).
  Sonra `S._sonuclar = {}`, `odevSayimYaz()` ve `ogretmenTeslimleri(a.id, a.title)` (öğrencinin yüklediği dosyaların
  rozetleri ve "Teslimleri indir", `14b-odev-teslim.js`). Çağıranlar: `25-tiklama.js` (`odev-ac`), `14c-quiz.js` (sonuçları
  açtıktan sonra), bu dosyadaki düzenleme kaydı.
- `odevSayimYaz()` — sonuç kutularını sayar ve `#okSayim`'a renkli etiketler yazar: "Yaptı 12", "Geç yaptı 2", …,
  boş kutu varsa gri "Seçilmemiş 3" (yalnız sayısı olan sonuçlar görünür).
- Belge düzeyinde `change` dinleyicisi (dosya yüklenince bir kez kurulur) — bir `.sonuc-kutu` değişince `data-deger`'i
  günceller (CSS rengi buna bakar), `S._sonuclar[öğrenci] = değer` yazar (boş seçim de yazılır: kaydedince eski sonucu
  kaldırır), sayımı yeniler.
- `EYLEMLER['sonuc-hepsi']` — yalnız BOŞ kutulara `data-val`'ı (Yaptı) yazar, `S._sonuclar`'a ekler, sayımı yeniler.
- Kaydetme `25-tiklama.js`'te: `odev-bitir` → `POST /api/assignments/<id>/finish { results: S._sonuclar }` (yalnız
  değiştirilen kutular gider) → öğretmen `ogr-odevler`'e, müdür `ders-odevleri`'ne döner; `odev-tekrar` → (quizin doğru
  cevapları açıklandıysa `quizTekrarAcUyarisi` onayı) → `POST …/reopen`; `odev-sil` → onay "Bu ödev silinsin mi? Geri
  alınamaz." → `POST …/delete` → `ogr-odevler`.

### "Ödevi düzenle"

- `EYLEMLER['odev-duzelt']` — `S._acikOdev` yoksa hiçbir şey. "Ödevi düzenle" penceresi: `#odBaslik` (120), `#odAciklama`
  (1000), başlama tarihi/saati (saat yoksa 08:00), son tarih/saati (yoksa 12:00; `min: 'odBas'`), `ekAlani('odevDuzelt',
  'odev', S._acikOdevEkleri)`, `dosyaYuklemeKutusu('odDosyaYukleme', a.dosyaYukleme !== false, true)`,
  `quizAlani('duzelt', S._acikOdevQuiz)`, `#odMesaj`; "Vazgeç" ve "Kaydet" (`odev-duzelt-kaydet`). Sonra `ekAlaniKur`,
  `quizPencereAyari()`, odak ada. `14c-quiz.js`'teki "Quizi düzenle" de bu eylemi çağırıp pencereyi quiz bölümüne kaydırır.
- `EYLEMLER['odev-duzelt-kaydet']` — gövde `{ title, description, startAt, startTime, endAt, endTime (boşsa 12:00),
  dosyaYukleme, ekIdler (yeni ekler), ekSilIdler (kaldırılan eski ekler) }`. Sırayla:
  1. ek yükleniyorsa "Dosyalar yükleniyor; bitince kaydet."; ad boşsa "Ödevin adını yaz."; son tarih başlamadan önceyse
     "Son tarih başlangıçtan önce olamaz.";
  2. `quizGovdesi('duzelt')` bozuksa iletisi; quiz değiştiyse (`quizDegistiMi`) ÖNCE `POST /api/assignments/<id>/quiz
     { quiz }`. Sunucu 409 `{ kilitli }` derse (bu arada bir öğrenci başladı) hata atılmaz: quiz bölümü kilitli işaretlenir;
  3. "Kaydediliyor..." → `POST /api/assignments/<id>/update`;
  4. quiz kilitlendiyse: quiz sunucudaki hâliyle yeniden çizilir (`GET …/quiz` → `quizAlaniYenile`), pencere AÇIK kalır,
     turuncu "Ödevin öbür değişiklikleri kaydedildi; quiz kaydedilemedi: N öğrenci başladı; quiz artık değiştirilemez.",
     arkada kontrol ekranı yenilenir; değilse pencere kapanır, `odevAc(id)` ve üstte sunucunun iletisi ("Ödev
     güncellendi." + gerekirse quiz notu).
  Hata `#odMesaj`'a.

## Kimle konuşur?

- Çağırdıkları (hepsi aynı IIFE'de):
  - `S`, `$`, `esc`, `api`, `EYLEMLER`, `SAYFALAR` ([00-durum.md](00-durum.md), [01-yardimcilar.md](01-yardimcilar.md));
  - `teslimGecti`, `tarihGunSaat`, `tarihSaat`, `gunFarki`, `SONUC` ([02-ikonlar.md](02-ikonlar.md));
  - `modalAc`, `modalKapat`, `mesajGoster`, `sayfaMesaji` ([03-mesaj-modal.md](03-mesaj-modal.md));
  - `formHatalariniSil`, `alanHatasi`, `ilkHatayaGit` ([04a-form-alanlari.md](04a-form-alanlari.md));
  - `ekAlani`, `ekAlaniKur`, `ekIdleri`, `ekSilinecekler`, `ekYukleniyor`, `ekListesiGoster` ([04d-ekler.md](04d-ekler.md));
  - `tarihAlani`, `saatAlani`, `tsSonrakiYarim` ([04e-tarih-secici.md](04e-tarih-secici.md));
  - `dugmeBekle`, `dugmeBitir` ([05-giris.md](05-giris.md)); `git`, `yaz`, `hero`, `bosKutu`
    ([07-yonlendirme.md](07-yonlendirme.md));
  - `odevFiltreCubugu`, `odevFiltreBagla`, `odevSonucCiz` (`14-odev-filtre.js`); `ogretmenTeslimleri`
    (`14b-odev-teslim.js`); `quizListeEtiketi`, `quizOgretmenListeSatiri`, `quizOgretmenSatiri`, `quizOgrenciRozeti`,
    `quizAlani`, `quizAlaniYenile`, `quizYenidenCiz`, `quizGovdesi`, `quizDegistiMi`, `quizPencereAyari`, `QUIZ_DZ`
    (`14c-quiz.js`); `yetkim` (`21-ders-programi.js`); `hataGoster` (`25-tiklama.js`).
- Sunucu uçları:
  - [../../../sunucu/bolumler/odev.md](../../../sunucu/bolumler/odev.md): `GET /api/assignments` (öğretmen/müdürün verdiği
    ödevler, seçili eğitim yılına süzülü; `gecikti`, `acilan`, `summary`, `quiz`), `GET /api/assignments/hedefler`
    (`classes`, `lessons`, `subjects`, `varsayilanDers`), `GET /api/assignments/<id>` (`assignment`, `ekler`, `quiz`,
    `students[{ id, fullName, result, acilma, quiz }]`), `POST /api/assignments/<id>/update` (`odev.ver`, ödevin dersi
    için), ve `25-tiklama.js` üzerinden `POST /api/assignments` (yeni; `odev.ver`, dersin ve sınıfların kapsamıyla),
    `/finish` (`odev.sonuclandir`), `/reopen` (`odev.sonuclandir`), `/delete` (`odev.ver`). Yalnız ödevi veren öğretmen
    yönetir; sahipsiz ödevi okulun müdürü.
  - [../../../sunucu/bolumler/quiz.md](../../../sunucu/bolumler/quiz.md): `POST /api/assignments/<id>/quiz { quiz }`
    (öğrenci başladıysa `409 { kilitli, baslayan }`), `GET /api/assignments/<id>/quiz`.
  - [../../../sunucu/bolumler/okul.md](../../../sunucu/bolumler/okul.md): `GET /api/school/assignments` (`ders.yonet`;
    `?classId=`, `&detay=1`, `?lessonId=`). Ders ödevlerindeki öğrenci sayısı yalnız O SINIFIN öğrencilerini sayar.
  - Dolaylı: ekler [../../../sunucu/bolumler/ekler.md](../../../sunucu/bolumler/ekler.md) (`04d-ekler.js`), öğrencinin
    teslim dosyaları [../../../sunucu/bolumler/odev-dosya.md](../../../sunucu/bolumler/odev-dosya.md)
    (`14b-odev-teslim.js`).
- Onu kullananlar:
  - `25-tiklama.js` — `ders-dal` → `dersDaliAcKapa`, "Hepsini kapat" → `dersListesiniYenidenCiz`, `odev-yeni` →
    `odevYeniModal`, `odev-tumu`/`odev-hicbiri` → `odevSecimBagla`, `odev-ac` → `odevAc`; `odev-bitir` `S._sonuclar`'ı
    gönderir.
  - `14-odev-filtre.js` — öğretmen kipinde `odevListesiOgretmen`. `08-ana-sayfa.js` — öğretmenin ana sayfası
    `odevListesiOgretmen(aktif)`.
  - `14c-quiz.js` — `odevAc` (sonuçları açtıktan sonra), `EYLEMLER['odev-duzelt']` ("Quizi düzenle"), `S._acikOdev` ve
    `S._acikOdevQuiz` (önizleme, "Tekrar aç" uyarısı).
  - Menü ve ana sayfa kutucukları ([06-menu.md](06-menu.md), [08-ana-sayfa.md](08-ana-sayfa.md)) iki sayfaya gider.
  - `26-baslat.js` — `oturumDurumunuSifirla` çıkışta ve rol değişince `S._acikOdev`, `S._sonuclar`, `S.odevHam` ve
    `S.odevF`'yi sıfırlar; `S.odevSinif`, `S.acikDersler`, `S.dersOdevleri`, `S._acikOdevQuiz` sıfırlanmaz. `S.odevSinif`
    ve `S.odevHedef`'in ilk değerleri [00-durum.md](00-durum.md)'de.
- Görünüm (`public/css/parcalar/`): `22-cesitli.css` (`.ders-dal`, `.dal-basi`, `.dal-ok`, `.dal-ad`, `.dal-alt`,
  `.dal-sayi`, `.dal-icerik`, `.dal-bos`, `.dal-grup`, `.dal-grup-baslik`), `17-odev-secim.css` (`.secim-ust`,
  `.secim-sayac`, `.hedef-liste`, `.hedef-sinif`, `.hedef-baslik`, `.hedef-adet`, `.hedef-ogrenciler`, `.hedef-ogrenci`),
  `25-grafik-sinav.css` (`.acilma-yazi`, `.acilmadi`, `.odev-bas`, `.odev-ad`, `.odev-konu`, `.odev-meta`, `.ok-ust`,
  `.ok-satir`, `.ok-sira`, `.sonuc-kutu` ve `[data-deger=…]` renkleri, `.ok-sayim`, `.sinav-alt`), `32-tarih-secici.css`
  (`.odev-tarihler`, `.zorunlu`, `.gizli-etiket`, tarih alanı), `02-form.css` (`.dosya-izin`, `.onay`, `.field`, `.row2`,
  `.btn`, `.msg`), `04-kartlar.css` (`.kart`, `.satir`, `.etiket` renkleri, `bordo` dahil), `03-iskelet.css` (`h3.sb`),
  `35-quiz.css` (quiz rozetleri). `.odev-kontrol` sınıfının kendi kuralı yok; `14b-odev-teslim.js` onu seçici olarak
  kullanır.
- Rol: öğretmen (ödev yetkileriyle), müdür. Öğrenci ve veli ödevlerini `14-odev-filtre.js`'te görür.

## Nasıl çalışır (adım adım)?

### Ödev verme ve sonuçlandırma

```
"Yeni ödev ver" ─► odev-yeni ─► odevYeniModal ─► GET /assignments/hedefler
     form: ders · ad · açıklama · başlama/son tarih+saat · sınıf/öğrenci kutuları · ekler · dosya izni · quiz
"Ödevi ver" ─► 25-tiklama odev-kaydet ─► en az bir öğrenci? ek yükleniyor mu? quiz bozuk mu?
     ─► POST /assignments { subject, title, …, studentIds, ekIdler, dosyaYukleme, quiz } ─► git('ogr-odevler')
listede "Sonuçlandır" ─► odev-ac ─► odevAc ─► GET /assignments/<id> ─► kontrol ekranı
     kutu seç ─► change ─► S._sonuclar[öğrenci] = sonuç ─► odevSayimYaz
     "Seçilmemişlerin hepsi: Yaptı" ─► boş kutular = yapti
"Sonuçlandır ve kaydet" ─► 25-tiklama odev-bitir ─► POST …/finish { results: S._sonuclar } ─► liste
     (sunucu: yalnız yeni/değişen sonuca bildirim; quiz kapanır)
```

### Müdürün ders ağacı

```
menü "Ödevler" ─► ders-odevleri ─► GET /school/assignments[?classId=] ─► sayılar (2 aktif · 5 geçmiş)
  dal tıkla ─► dersDaliAcKapa ─► GET /school/assignments?lessonId= (bir kez) ─► aktif / süresi geçmiş grupları
  sınıf seç + "Hepsini aç" ─► git ─► GET /school/assignments?classId=…&detay=1 (hepsi tek istekte)
  sahipsiz ödev ─► "Sonuçlandır" ─► odevAc ─► odev-bitir ─► git('ders-odevleri')
```

### Düzenleme kaydı

```
"Kaydet" ─► istemci denetimi ─► quiz değişti mi?
   evet ─► POST …/quiz ─┬ 200 ─► QUIZ_DZ.duzelt.ilk = yeni hâl
                        └ 409 kilitli ─► quizKilidi (hata sayılmaz)
   ─► POST …/update ─► kilit varsa: quiz bölümü sunucudaki hâliyle, pencere açık, uyarı
                      yoksa: pencere kapanır ─► odevAc ─► "Ödev güncellendi."
```

## Dikkat!

- **Daha önce açılmış ders dalı "Yükleniyor..."da takılı kalabilir.** `S.acikDersler` sayfa değişince silinmez ama
  `S.dersOdevleri` her açılışta sıfırlanır; dalın ödevlerini isteyen tek yer `dersDaliAcKapa`'dır. Müdür bir dalı açıp
  başka sayfaya gidip dönünce, "Yenile"ye basınca ya da sahipsiz ödevi sonuçlandırıp geri gelince o dal açık çizilir ama
  istek gitmez: "Yükleniyor..." kalır, dala iki kez basmak gerekir (sınıf seçip "Hepsini aç" dendiyse sorun yok, ödevler
  `detay=1` ile gelir). Kod okumasına göre; tarayıcıda denenmedi, kod değiştirilmedi. Düzeltme önerisi: `dersOdevleriCiz`
  açık ama ödevsiz dal için isteği başlatsın ya da sayfa açılışında `S.acikDersler` sıfırlansın.
- **Müdürün "Geri dön"ü yanlış sayfaya gider.** Kontrol ekranındaki "Geri dön" her zaman `ogr-odevler`'e gider. Müdür
  sahipsiz bir ödevi Ders Ödevleri'nden açtıysa kendi (boş) "Ödevler" listesine düşer ("Henüz ödev yok."); oysa
  `odev-bitir` ve `odev-tekrar` müdürü doğru yere (`ders-odevleri`) döndürür.
- **Kaydedilmemiş sonuçlar sessizce kaybolur.** Öğretmen birkaç öğrencinin sonucunu seçip kaydetmeden "Ödevi düzenle"yle
  ödevi kaydederse ya da quizin "Sonuçları şimdi aç"ına basarsa `odevAc` ekranı sunucudan yeniden çizer ve
  `S._sonuclar = {}` olur; seçimler uyarısız gider. "Geri dön", menü ve üst şeritteki "Yenile" de sormaz: "Yenile"nin
  "kaydedilmedi" sorusu (`S._sayfaDegisti`, `25-tiklama.js`) yalnız yazı kutularında kurulur, sonuç kutuları ise `select`.
- **Düğmeler yetkiye tam bakmaz.** Öğretmenin listesinde "Yeni ödev ver" müdür olmayan herkese, her satırın "Sil"i
  herkese çizilir. Yalnız `odev.sonuclandir` yetkisi olan bir öğretmen "Yeni ödev ver"de formu doldurur ama "Ödevi ver"
  400 "… dersine ödev verme yetkin yok" alır (`#mHata`); "Sil" 403 "Bu ödevi silme yetkin yok" alır (tarayıcı uyarı
  kutusu). Kontrol ekranındaki "Ödevi düzenle" ve kaydetme düğmeleri ise `yetkim` ile süzülüdür.
- **Sonuç kaydı düğmesi kilitlenmez.** `odev-bitir` (`25-tiklama.js`) isteği giderken düğmeyi beklemeye almaz; iki kez
  basılırsa iki istek gider. Sunucu yalnız yeni ya da değişen sonuca bildirim gönderdiği için ikinci istek çoğunlukla
  zararsızdır.
- **Düzenlemede yarım kayıt olabilir.** Quiz ödevden ÖNCE yazılır. Quiz kaydedildikten sonra `…/update` sunucuda
  reddedilirse (ör. "Aynı gün biten ödevde son saat başlama saatinden sonra olmalı" — bu kural istemcide yok) quiz
  değişikliği kalmış, öbürleri kaydedilmemiş olur; pencere hatayı gösterir, bir sonraki "Kaydet" quizi yeniden göndermez.
- **Bilerek: kilitli quiz öbür değişiklikleri durdurmaz.** Pencere açıkken bir öğrenci quizi başlatırsa sunucu quizi
  değiştirmez (409); ödevin adı, tarihleri, ekleri yine kaydedilir ve pencere açık kalır ki öğretmen neyin kaydedilmediğini
  görsün.
- **"Son tarih *" zorunlu görünür ama değildir.** Yıldız yalnız görünüş: son tarih boş bırakılırsa ne istemci ne sunucu
  engeller, ödev "süresiz" verilir (hiç gecikmez; öğrencinin yüklediği dosyalar son teslimden değil, sonuçlandırmadan 7
  gün sonra, hiç sonuçlandırılmazsa yüklemeden 60 gün sonra silinir — [../../../sunucu/bolumler/odev-dosya.md](../../../sunucu/bolumler/odev-dosya.md)).
  "Yeni ödev"in ipucundaki "Dosyalar son teslimden 7 gün sonra silinir." bu durumda eksik kalır.
- **Başlama günü UTC'ye göre.** `odevYeniModal` bugünü `new Date().toISOString()`'ten alır; Türkiye saatiyle 00:00–03:00
  arasında "Başlama tarihi" bir önceki gün gelir (saat ise yerel saatten, `tsSonrakiYarim`).
- **Yeni ödevde uzunluk sınırı yok.** "Yeni ödev"in ad ve açıklama kutularında `maxlength` yok; sunucu adı 120,
  açıklamayı 1000 karakterde sessizce keser. Düzenleme penceresinde sınırlar var.
- **Kontrol ekranı adres değiştirmez.** `odevAc` sayfanın içeriğini değiştirir ama `S.page` ve adres (`#/ogr-odevler`,
  `#/ders-odevleri` ya da `#/ana`) aynı kalır; "Yenile" ya da tarayıcının yenilemesi kontrol ekranını değil listeyi (ya
  da ana sayfayı) açar.
- **Yetkisi olmayan da sonuç kutusunu değiştirebilir.** Sonuç kutuları ve "Seçilmemişlerin hepsi: Yaptı" herkese
  çizilir; `odev.sonuclandir` yoksa yalnız kaydetme düğmesi çıkmaz (değişiklik kaydedilemez, uyarı da yok). Sunucu zaten
  izin vermez.
- **Yalnız dokunulan kutular gider.** `S._sonuclar` yalnız değişen kutuları taşır; sunucu listede olmayan öğrencinin
  sonucuna dokunmaz. "— Seç —"e geri almak eski sonucu kaldırır.
- **Ders ödevlerindeki öğrenci sayısı sınıfa göre.** Ödev iki sınıfa verildiyse her sınıfın dalında yalnız o sınıfın
  öğrencileri sayılır; öğretmenin listesindeki sayı ödevin bütün öğrencileridir.
- **"Bu sınıfa ders eklenmemiş."** okulda hiç ders yokken "Tüm sınıflar" seçiliyken de çıkar (metin sınıf seçili varsayar).
  Aynı ileti, iki okulda müdür olan biri portal değiştirince de görünebilir: `S.odevSinif` rol değişince sıfırlanmaz,
  öbür okulun sınıf kimliğiyle istek gider, seçici "Tüm sınıflar"ı gösterir ama liste boş gelir; seçiciden bir sınıf
  seçmek düzeltir (kod okumasına göre).
- **Ekran açıldığı anı gösterir.** Kontrol ekranındaki bilgiler (kim açtı, quiz durumu, dosya sayısı) istek anının
  hâlidir; bu arada öğrenci ödevi açarsa ya da quizi bitirirse ekran yeniden açılana kadar görünmez.
- **HTML güvenliği:** ödev adları, açıklamalar, öğrenci adları `esc`'ten geçer.

## Testleri

- `testler/buton-denetimi.js` (sunucusuz) — `ders-dal`, `ders-hepsini-ac`, `ders-hepsini-kapat`, `odev-yeni`,
  `odev-tumu`, `odev-hicbiri`, `odev-kaydet`, `odev-ac`, `odev-bitir`, `odev-tekrar`, `odev-sil`, `sonuc-hepsi`,
  `odev-duzelt`, `odev-duzelt-kaydet` düğmelerinin karşılığı; `ogr-odevler`/`ders-odevleri` sayfalarının tanımlı olması.
  `testler/yazim-denetimi.js` metinleri tarar.
- Bu dosyayı tarayıcıda çalıştıran test yok; kullandığı uçlar sunucu testleriyle korunur:
  - `testler/test-kapsam.js` — 8. bölüm "MUDUR DERS ODEVLERI": `GET /api/school/assignments` yalnız sayıları getiriyor,
    ödevleri taşımıyor; `?lessonId=` ile ödevler geliyor ve sayı tutuyor; ödevi veren öğretmenin adı yazıyor. 4. bölüm
    "ODEV KAPSAMI": `hedefler` ve rolün ders/sınıf kapsamıyla ödev verme.
  - `testler/test-odev-saat.js` — teslim saati, geçmiş ödevin sonucunun düzenlenebilmesi, `…/update` (başlama saati),
    `…/reopen`.
  - `testler/test-odev-dosya.js` — `dosyaYukleme` açma/kapama (`…/update`), son teslim değişince dosyaların kalması,
    `…/reopen`, `…/delete`.
  - `testler/test-yorum-ek.js` — ödev eklerinin `…/update` ile değişmesi; `testler/test-quiz.js` — quizli ödev, kilit
    (409 `kilitli`), tarih değişiminde sonuç kalıcılığı.
  - `testler/test-sinav.js` 6. bölüm — öğrencinin ödevi açması ve öğretmenin açılma zamanını görmesi (ilk açılış
    değişmez), "geç yaptı" sonucu, boş seçimin ("— Seç —") sonucu kaldırması, tanımsız sonucun yazılmaması.
  - `testler/test-bildirim.js` (sonuçlandırma bildirimleri), `testler/test-egitim-yili.js` (yıl süzmesi),
    `testler/test-takvim.js`, `testler/test-ozellikler.js` (ödev bölümü kapalıyken), `testler/yetki-denetimi.js`,
    `testler/girdi-denetimi.js`.
- Ekran turu (`araclar/gezinti.js`; ÇALIŞTIRMA): "Ders ödevleri", "Ders ödevleri — bir ders açık", "Ödevler", "Yeni ödev
  penceresi", "Yeni ödev — son tarih takvimi", "Ödev kontrolü (sonuçlanmış, 6 sonuç türü)", "Sonuçlanmış ödevi düzenleme
  penceresi", "Ödev kontrolü — seçilmemişlerin hepsi: Yaptı" ve quiz adımları.
- Elle (3200): `testler/seed.js`'teki Matematik öğretmeniyle "Ödevler" → "Yeni ödev ver" → 6-A'nın kutusunu işaretle
  (sayaç öğrenci sayısını göstermeli), son tarihi yarın seç → "Ödevi ver"; ödevi aç → bir öğrenciye "Geç yaptı" seç,
  "Seçilmemişlerin hepsi: Yaptı" → altta "Yaptı N" ve "Geç yaptı 1" etiketleri → "Sonuçlandır ve kaydet". Müdürle
  "Ödevler" → 6-A · Matematik dalını aç → ödev "Süresi geçmiş" grubunda (sonuçlandırıldığı için).

## Son durum

- `git log`: 8 commit. Dosya `d94a53a commit 78` (2026-08-29) ile doğdu.
- Son değişiklik `566b917 commit 524` (2026-09-27, canlı hazırlık): `dosyaYuklemeKutusu` eklendi — "Yeni ödev"de
  "Öğrenciler bu ödeve dosya yükleyebilsin" kapalı gelir, "Ödevi düzenle"de ödevin durumuyla gelir ve ek açıklamalı;
  düzenleme kaydı `dosyaYukleme`'yi gönderiyor; kontrol ekranının üst satırına "dosya yükleme kapalı / öğrenciler dosya
  yükleyebilir".
- Ondan önce `3b8fd36 commit 519` (2026-09-27, quiz): listelerde `quizListeEtiketi` ve `quizOgretmenListeSatiri`, "Yeni
  ödev"e `quizAlani('odev', null)`, kontrol ekranında `S._acikOdevQuiz`, ekler listesinin başında `quizOgretmenSatiri`,
  öğrencinin altında `quizOgrenciRozeti`; "Ödevi düzenle"ye quiz bölümü ve kaydederken önce quiz, kilitliyse (409) öbür
  değişiklikleri yine kaydetme.
- `9cc4eb8 commit 458` (2026-09-26): "Ödevi düzenle" penceresi (`odev-duzelt`: ad, açıklama, tarihler, ekler). Daha
  eskiler: `73ea83a commit 176` (2026-09-08), `8226f76 commit 81` … `d94a53a commit 78` (2026-08-29).
- Bilinen açıklar (kod değiştirilmedi): takılı "Yükleniyor..." dalı, müdürün "Geri dön"ü, kaydedilmemiş sonuçların
  kaybı, düzenlemede yarım kayıt, zorunlu görünen ama zorunlu olmayan son tarih, UTC başlama günü, yetkiye bakmayan "Yeni
  ödev ver" ve "Sil" düğmeleri (Dikkat).
- Planlı işlerden bu dosyaya dokunacaklar: "Düzenleyiciler" (iş 15: ödev açıklaması ortak yazı düzenleyiciyle yazılacak,
  quiz soru düzenleyicisi — resim, matematik yazımı, soru bankası — bu dosyanın açtığı pencerelerde çalışacak); "Anket
  düzenleyici" (iş 13: anket ödeve ek olarak konabilecek, hedefi ödevin öğrencileri; quiz sorularını Excel'den aktarma);
  "Mesaj ayarları … ödev hatırlatma otomasyonu" (iş 8, öğrenci tarafı); "Çalışan olarak ekleme" (iş 2: öğretmen olmayan
  çalışan ödeve atanamaz — "Yeni ödev" hedefleri); "Optimizasyon + saklama süreleri" (iş 7: quiz 1 yıl); "Çok dil"
  (iş 22).
