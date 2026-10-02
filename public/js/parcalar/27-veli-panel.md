# public/js/parcalar/27-veli-panel.js

Veli paneli: velinin bütün çocuklarının ödevlerini, devamsızlığını ve ilerleyişini tek sayfada birleştiren üç sayfa
(`veli-odevler`, `veli-devamsizlik`, `veli-ilerleyis`) ve başka veli sayfalarının da kullandığı çocuk yardımcıları
(çocuk listesi, seçili çocuk, "Hepsi · Zeynep · Burak" şeridi, her çocuk için aynı ucu çağırma).

## Bu dosya ne yapar?

İki çocuğu olan bir veli, eskiden her çocuğun portalına ayrı ayrı girip ödevlere bakardı. Veli paneli bunu tek ekrana
indirir: **Ödevler**, **Devamsızlık** ve **İlerleyiş** sayfalarında bütün çocukların kayıtları bir arada gelir, her
satırın başında küçük bir rozetle **kimin** olduğu yazar ("Zeynep"). İki ya da daha çok çocuk varsa sayfanın üstünde
"Hepsi · Zeynep Örnek · Burak Örnek" şeridi çıkar; bir çocuğa basınca sayfa yalnız onun kayıtlarına daralır.

Sunucuda bu iş için yeni bir uç yok (dosya başı yorumu): her çocuk için zaten var olan uç (`/api/progress?studentId=…`,
`/api/devamsizlik/ogrenci?studentId=…`) ayrı ayrı çağrılır, sonuçlar burada birleştirilir. Bir-üç çocuk için bu ucuzdur
ve velinin o çocuğu görme yetkisi her istekte sunucuda denetlenir.

Dosyanın başındaki küçük yardımcılar (`veliCocuklar`, `veliSeciliCocuk`, `veliCocukSeridi`, `cocuklarIcin`,
`veliCocukYok`) başka veli ekranlarının da ortak aracıdır: Takvim, Etütler, Servis, Eğitim yılı seçici, "Çocuğumun
telefonu" ve velinin ana sayfası bunları kullanır.

Kim görür: rolü **veli** olan hesap (menüde Ödevler, Devamsızlık, İlerleyiş). Yetişkin hesabı çocuğunu bağlayınca rolü
veli olur; aynı kişi bir okulda öğretmense o okul rolünde çocuk yoktur (`sunucu/iliskiler.js` `childrenOf`), çocuğunu
görmek için sol menüdeki "Portallarım"dan veli portalına geçer. Okulun eski düzende açtığı ve çocuğu doğrudan bağlı
**öğretmen/müdür** hesabı ise bu üç sayfayı kendi menüsünün "Velisi olduğum" bölümünde görür ([06-menu.md](06-menu.md)
`veliBolumu`). Rolsüz yetişkin hesabı bu sayfalara giremez (açılış süzgeci [26-baslat.md](26-baslat.md); sunucu da
`/api/progress`'i ona kapatır).

## İçinde neler var?

### Ortak yardımcılar

- `veliCocuklar()` — `S.children || []` (`/api/me` ve `/api/parent/children`'dan gelen çocuklar: `{ id, fullName,
  schoolId, schoolName, code }`).
- `veliSeciliCocuk()` — şeritte seçili çocuk ya da "Hepsi" için `null`. Önce adreste gelen çocuğa bakar: bildirimden ya da
  geri tuşundan gelindiyse (`S.adresCocuk`, [07-yonlendirme.md](07-yonlendirme.md) `?c=<öğrenci>`) ve o çocuk velinin
  listesindeyse `S.veliCocuk` ona çevrilir; `S.adresCocuk` her durumda boşaltılır (bir kez kullanılır). `S.veliCocuk`
  listede yoksa (çocuk bu arada kaldırıldı) `null`'a çekilir. Yani bu işlev okumakla kalmaz, `S.veliCocuk`'u da düzeltir.
- `cocukRozet(c)` — `<span class="cocuk-rozet">Zeynep</span>` (adın ilk kelimesi, `esc`'li). Yalnız bu dosyada kullanılır.
- `veliCocukSeridi()` — iki ya da daha çok çocuk varsa `div.cocuk-seridi`: "Hepsi" (`data-act="veli-cocuk" data-id=""`)
  ve her çocuk için tam adıyla bir düğme (`data-act="veli-cocuk" data-id="<öğrenci>"`); seçili olan `secili`. Tek çocukta
  `''`. Düğmelerin karşılığı [25-tiklama.md](25-tiklama.md) `veli-cocuk`: `S.veliCocuk` yazılır, yıl bilgisi seçilen
  çocuğun okuluna göre yeniden alınır, sayfa yeniden açılır.
- `cocuklarIcin(yol)` — seçili çocuk varsa yalnız onun, yoksa bütün çocukların her biri için aynı yolu ister; yola
  (içinde `?` varsa `&`, yoksa `?` ile) `studentId=<kimlik>` eklenir. Hepsini birlikte bekler (`Promise.all`) ve
  `[{ cocuk, veri }]` döner. İsteklerden biri hata verirse söz bütünüyle reddedilir (bkz. "Dikkat!").
- `veliCocukYok(baslik)` — çocuk yoksa sayfa: büyük başlık ve "Henüz çocuk eklenmedi. Çocuklarım sayfasından veli koduyla
  ekleyebilirsin." Çözülmüş bir söz döner.

### `SAYFALAR['veli-odevler']` — Ödevler

1. Çocuk yoksa `veliCocukYok('ÖDEVLER')`.
2. `cocuklarIcin('/progress')` → her çocuğun `assignments` listesi birleştirilir, her ödeve `cocuk` eklenir. Birleşik
   liste `S.veliOdevHam`'a yazılır: satır penceresindeki quiz kutusu buradan okur ([14c-quiz.md](14c-quiz.md)).
3. **Aktif** = durumu `active` ve teslim anı geçmemiş (`teslimGecti(endAt, endTime)`, saat dahil; [02-ikonlar.md](02-ikonlar.md)),
   son güne göre yakından uzağa. **Geçmiş** = sonuçlanmış ya da teslim anı geçmiş, yeniden eskiye.
4. Sayfa: "ÖDEVLER" / "Çocuklarının bütün ödevleri bir arada; her satırda kimin olduğu yazar.", şerit, "Aktif ödevler (N)"
   ve liste ya da "Şu an açık ödev yok."; geçmiş varsa "Geçmiş ödevler (N)" ve ilk 40'ı.

### `veliOdevListesi(list)` — ödev satırları

`div.kart` içinde her ödev için `div.satir.odev-satir.tikla-odev`:

- Solda çocuk rozeti; ortada ödevin adı + quiz rozeti (`quizListeEtiketi(a.quiz)`), altında "Matematik · <öğretmen> · son
  teslim 4 Ekim 2026, Pazar · 12:00" (`tarihGunSaat`), açıklama varsa tamamı, quiz varsa durumu (`quizListeDurumu(a.quiz,
  false)`: puan yalnız sonuç açılınca; sorular ve sekme kaydı veliye hiç gelmez).
- Sağda etiket: sonuç varsa `SONUC`'taki ad ve renk ("Yaptı" yeşil, "Geç yaptı" mavi, "Eksik" turuncu, "Yapmadı" kırmızı,
  "Gelmedi (izinli)" gri, "Gelmedi (izinsiz)" bordo); sonuçlanmış ama sonuç girilmemişse gri "Değerlendirilmedi"; değilse
  `kalanEtiketi(a)` ("Süresi doldu", "Bugün 12:00'e kadar", "3 gün kaldı").
- Çocuğun henüz açmadığı aktif ödev (`acildi === false`) turuncu zeminle (`acilmadi`) ve "Çocuğun bu ödevi henüz açmadı"
  ipucuyla.
- Satır `data-act="veli-teslim" data-id="<ödev>" data-ogrenci="<çocuk>" data-baslik="<ödev adı>"`: basınca pencerede
  çocuğun bu ödeve yüklediği teslim dosyaları açılır ([14b-odev-teslim.md](14b-odev-teslim.md)); quizli ödevde pencerenin
  başına quiz satırı eklenir ([14c-quiz.md](14c-quiz.md) eylemi sarar). `data-ara` "çocuğun adı + ödev adı + ders":
  üstteki "İçerik Ara" kutusu satırları buna göre süzer.

Velinin ana sayfasındaki "Yaklaşan ödevler" de bu işlevi kullanır ([08-ana-sayfa.md](08-ana-sayfa.md); ilk 6 aktif ödev).
Ama ana sayfa "aktif"i başka seçer: yalnız `status === 'active'`'e bakar, teslim saatine bakmaz (bkz. "Dikkat!").

### `SAYFALAR['veli-devamsizlik']` — Devamsızlık

1. Çocuk yoksa `veliCocukYok('DEVAMSIZLIK')`.
2. `cocuklarIcin('/devamsizlik/ogrenci')` → her çocuk için `{ sayim: { yok, gec, izinli }, toplam, kayitlar }`.
3. Sayfa: "DEVAMSIZLIK" / "Çocuklarının derse katılım kayıtları.", şerit; üç sütunlu ızgarada çocuk başına bir kart (ad,
   "N gelmedi · N geç geldi · N izinli"); altında bütün çocukların kayıtları birleşik, tarihe göre yeniden eskiye: rozet,
   ders adı (yoksa "Ders") ve durum etiketi (`durum-etiket <durum>`, metni sunucunun `durumAd`'ı), altında tarih, yoklamayı
   alan kişi ve not. Kayıt yoksa "Hiç devamsızlık kaydı yok. Böyle devam.".

Sunucu yalnız "var" olmayan durumları kaydeder; liste çocuk başına en çok 200 kayıt, sayılar hepsinden
([../../../sunucu/bolumler/devamsizlik.md](../../../sunucu/bolumler/devamsizlik.md) `devamsizlikOzeti`). İkisi de velinin
baktığı eğitim yılına göre süzülür.

### `SAYFALAR['veli-ilerleyis']` — İlerleyiş

1. Çocuk yoksa `veliCocukYok('İLERLEYİŞ')`.
2. `cocuklarIcin('/progress')` → "İLERLEYİŞ" / "Çocuk çocuk ödev başarısı ve sınav ortalamaları.", şerit; her çocuk için
   adıyla bir başlık ve altında öğrencinin kendi İlerleyişim sayfasının aynı kartları (`ilerleyisKartlari`,
   [13-ogrenci-veli.md](13-ogrenci-veli.md)): ödev grafiği (sonuçlara/derslere göre), sınav grafiği kutusu, grupsuz
   sınavlar, sınav grubu ortalamaları.
3. Sayfa yazıldıktan sonra `ilerleyisGrafikleriniYukle([çocuk kimlikleri])`: ödev sütun grafikleri kutularının
   genişliğinde çizilir, her çocuğun sınav grafiği ayrı istekle gelir ([28-grafik.md](28-grafik.md)).

## Kimle konuşur?

- Parçalar ad sırasıyla tek bir IIFE'de birleşir (`/js/app.js`; [../../../sunucu/http.md](../../../sunucu/http.md)
  `birlesikOku`). Bu dosya [26-baslat.md](26-baslat.md)'in açılış kodundan SONRA eklenir; `SAYFALAR[...]` kayıtları ilk
  sayfa açılmadan önce (açılış eşzamansız olduğu için) hazır olur.
- Çağırdıkları:
  - [00-durum.md](00-durum.md) — `S.children`, `S.veliCocuk`, `S.adresCocuk`, `S.veliOdevHam`.
  - [01-yardimcilar.md](01-yardimcilar.md) — `esc`, `api`.
  - [02-ikonlar.md](02-ikonlar.md) — `SONUC`, `kalanEtiketi`, `teslimGecti`, `tarihGunSaat`.
  - [07-yonlendirme.md](07-yonlendirme.md) — `yaz` (sayfanın üstüne yıl şeridini, altına alt bilgiyi ekler, aramayı
    uygular), `hero`, `bosKutu`.
  - [13-ogrenci-veli.md](13-ogrenci-veli.md) — `ilerleyisKartlari`, `ilerleyisGrafikleriniYukle`.
  - [14c-quiz.md](14c-quiz.md) — `quizListeEtiketi`, `quizListeDurumu`.
- Sunucu uçları:
  - `GET /api/progress?studentId=` ([../../../sunucu/bolumler/ilerleyis.md](../../../sunucu/bolumler/ilerleyis.md)) —
    velinin bağlı olduğu çocukta açık; cevabın `assignments`, `subjects`, `examGroups`, `exams`, `student` alanları.
  - `GET /api/devamsizlik/ogrenci?studentId=` ([../../../sunucu/bolumler/devamsizlik.md](../../../sunucu/bolumler/devamsizlik.md))
    — veli bağı olan görür.
  - Dolaylı: satır penceresinin teslim dosyaları ([../../../sunucu/bolumler/odev-dosya.md](../../../sunucu/bolumler/odev-dosya.md),
    [14b-odev-teslim.md](14b-odev-teslim.md)); sınav grafiği `GET /api/exams/grafik`
    ([../../../sunucu/bolumler/sinav.md](../../../sunucu/bolumler/sinav.md), [28-grafik.md](28-grafik.md)).
- Onu kullananlar:
  - [06-menu.md](06-menu.md) — veli menüsünde ve "Velisi olduğum" bölümünde üç sayfa; `SAYFA_OZELLIK`: `veli-odevler` →
    `odev`, `veli-devamsizlik` → `devamsizlik` (okulun kapattığı bölüm menüden kalkar). [08-ana-sayfa.md](08-ana-sayfa.md)
    — velinin ana sayfasındaki kutucuklar üç sayfaya gider; `cocuklarIcin('/progress')` ve `veliOdevListesi`.
  - [16-egitim-yili.md](16-egitim-yili.md) — `veliSeciliCocuk` (`yilOgrencisi`); `VELI_YIL_SAYFALARI` bu üç sayfa: yıl
    şeridi velide yalnız bunlarda görünür.
  - [17-takvim.md](17-takvim.md) — `veliSeciliCocuk`, `veliCocukSeridi`; [18b-etut.md](18b-etut.md) — `veliCocuklar`,
    `veliCocukYok`, `cocuklarIcin('/etut/ogrenci')`, `veliCocukSeridi`; [19c-okul-hayati.md](19c-okul-hayati.md) —
    `veliSeciliCocuk` (servis sayfası); [27b-aile.md](27b-aile.md) — `veliCocuklar`, `veliSeciliCocuk`, `veliCocukYok`.
  - [25-tiklama.md](25-tiklama.md) — `veli-cocuk` eylemi (şerit); [14b-odev-teslim.md](14b-odev-teslim.md) ve
    [14c-quiz.md](14c-quiz.md) — `veli-teslim` eylemi (satır).
  - [24-bildirim-arama-mobil.md](24-bildirim-arama-mobil.md) — velinin bildirimi `#/veli-odevler?c=<çocuk>` gibi bir
    adresle gelince `S.adresCocuk`'u yazar; bu dosya o çocuğu seçer.
- CSS: `24-veli.css` (`.cocuk-rozet`, `.cocuk-seridi`, `.alt-sayim`); `25-grafik-sinav.css` (`.satir.odev-satir`,
  `.tikla-odev`, `.acilmadi` turuncu zemin ve nokta); `20-devamsizlik.css` (`.durum-etiket`); `04-kartlar.css` (`.kart`,
  `.satir`, `.grid.k3`, `.etiket`); `35-quiz.css` (quiz rozeti ve durum).

## Nasıl çalışır (adım adım)?

```
veli menüden "Ödevler" ─► git('veli-odevler')
   çocuk var mı? ─ hayır ─► "Henüz çocuk eklenmedi…"
   veliSeciliCocuk(): S.adresCocuk? → S.veliCocuk;  seçili yoksa hepsi
   cocuklarIcin('/progress'):  GET /api/progress?studentId=Z  ┐
                               GET /api/progress?studentId=B  ┘ Promise.all
   birleşik liste → S.veliOdevHam; aktif / geçmiş ayrılır
   yaz(hero + şerit + listeler)   (yaz yıl şeridini ve alt bilgiyi ekler)
şeritte "Burak" ─► 25-tiklama veli-cocuk ─► S.veliCocuk = B ─► yıl bilgisi ─► git('veli-odevler') (yalnız Burak)
satıra basınca ─► veli-teslim ─► pencere: teslim dosyaları (+ quiz satırı)
```

## Dikkat!

- **Bir çocuğun isteği düşerse bütün sayfa düşer.** `cocuklarIcin` `Promise.all` kullanır; çocuklardan birinin isteği
  hata verirse sayfa listesi yerine yalnız o hatanın iletisi görünür (`git`'in hata yolu). Bilinen bir örnek (kod
  okumasına göre; denenmedi): çocukları farklı okullarda olan velide okullardan biri **Devamsızlık** bölümünü kapattıysa
  menüde Devamsızlık yine görünür (sunucu velinin menüsünden yalnız BÜTÜN çocukların okulunda kapalı olanı kaldırır), ama
  "Hepsi" seçiliyken o çocuğun `/api/devamsizlik/ogrenci?studentId=…` isteği 403 "Devamsızlık bu okulda kapalı…" alır ve
  öteki çocuğun kayıtları da gösterilmez; şeritten öteki çocuğu seçince sayfa açılır. Aynı kalıp
  [18b-etut.md](18b-etut.md)'deki velinin Etütler sayfasında da var. Düzeltme önerisi: `Promise.all` yerine her çocuğun
  hatasını kendi kartında göstermek. `/api/progress` okulun kapatabileceği bir yol olmadığı için Ödevler ve İlerleyiş bu
  sorunu yaşamaz (sınav grafiği kutusu hatayı kendi içinde gösterir).
- **Ana sayfadaki ödev satırında quiz kutusu çıkmayabilir.** `S.veliOdevHam`'ı yalnız bu dosyanın Ödevler sayfası yazar;
  velinin ana sayfası ([08-ana-sayfa.md](08-ana-sayfa.md)) aynı `veliOdevListesi`'ni kullanır ama listeyi yazmaz. Ana
  sayfadaki quizli bir ödeve basınca teslim penceresi açılır, quiz satırı ise ancak Ödevler sayfası bu oturumda daha önce
  açıldıysa (ve o eski listeye göre) görünür (kod okumasına göre).
- **Ana sayfa ile Ödevler sayfası "aktif"te ayrışır.** Bu dosyanın Ödevler sayfası teslim saati geçmiş ama henüz
  sonuçlanmamış ödevi "Geçmiş"e koyar; velinin ana sayfası ([08-ana-sayfa.md](08-ana-sayfa.md), aynı `veliOdevListesi`'ni
  çağırır) ise yalnız `status === 'active'`'e baktığı için o ödevi "Yaklaşan ödevler"de kırmızı "Süresi doldu"
  etiketiyle gösterir ve Ödevler kutucuğundaki "N aktif ödev" sayısına katar. Öğretmen sonuçlandırana kadar iki ekran
  farklı sayı söyler (kod okumasına göre; kod 08'de, değiştirilmedi).
- **`veliSeciliCocuk` yan etkili.** Okurken `S.adresCocuk`'u tüketir ve `S.veliCocuk`'u değiştirir. Bir sayfada iki kez
  çağrılsa ikincisi adres çocuğunu görmez (ilk çağrı zaten seçmiştir). Bu yüzden adresle gelen çocuk, onu ilk soran
  sayfada seçilir.
- **Geçmiş ödevler 40'la kesilir, bunu söyleyen bir yazı yok.** Başlıktaki sayı bütün geçmişi sayar ("Geçmiş ödevler
  (57)") ama yalnız en yeni 40 satır çizilir.
- **Devamsızlık tarihi ham biçimde.** Satırın alt yazısı sunucudan gelen `2026-09-25`'i olduğu gibi yazar; öteki ekranlar
  "25 Eylül 2026, Cuma" ya da "25.09.2026" kullanır.
- **Açıklama kısaltılmaz.** Ödev açıklaması listede tamamıyla görünür; uzun açıklamalı ödevler listeyi uzatır.
- **Yetki sunucuda.** Buradaki `studentId`'yi değiştiren biri yalnız bağlı olduğu çocuğu görebilir (`canSeeStudent`,
  veli bağı); bu dosya ayrıca bir denetim yapmaz.
- **Okulun kapattığı bölüm.** `veli-odevler` ve `veli-devamsizlik` menüde okulun Özellikler ayarına bağlıdır; velide bu
  ayar çocukların okullarının hepsinde kapalı olan bölümleri gizler ([../../../sunucu/bolumler/ozellikler.md](../../../sunucu/bolumler/ozellikler.md)).
  `veli-ilerleyis` kapatılamaz.

## Testleri

- Bu dosyanın çizimini tarayıcıda deneyen otomatik test yok.
- `testler/buton-denetimi.js` (sunucusuz) — `veli-cocuk` ve `veli-teslim` eylemlerinin karşılığı, üç sayfanın `SAYFALAR`'da
  ve menüde olması, `/progress` ve `/devamsizlik` yollarının sunucuda olması.
- Uçları koruyan sunucu testleri: `testler/test-veli-coklu.js` (veli olan öğretmenin çocuğunun ilerleyişini ve
  devamsızlığını görmesi, bağ kaldırılınca 403), `testler/test-devamsizlik.js` (veli `/api/devamsizlik/ogrenci`),
  `testler/test-ozellikler.js` (çocuğun okulu Devamsızlık'ı kapatınca velinin `/api/devamsizlik/ogrenci?studentId=…`
  isteği 403 `ozellikKapali: 'devamsizlik'` — "Dikkat!"teki sayfa düşmesinin sunucu yarısı; iki okullu veli yalnız servis
  için deneniyor), `testler/test-quiz.js`
  (veliye doğru şık bilgisinin gitmemesi), `testler/test-nakil.js` (veli yıl seçicide çocuğun önceki okulunu seçince
  `/api/progress`'te eski okulun ödevini görüyor, şimdiki yıla dönünce görmüyor).
- Elle (deneme kurulumunda): bir veli hesabına iki öğrencinin veli kodunu ekle (Çocuklarım → Çocuk ekle; kod öğrencinin
  Ayarlar'ında) → Ödevler'de iki rozet, şeritte "Hepsi" ve iki ad; bir çocuğa bas → liste daralır, adres değişmez;
  Devamsızlık'ta çocuk başına sayım kartları; İlerleyiş'te her çocuğun grafikleri ayrı başlık altında.

## Son durum

- `git log`: 10 commit; ilk dokuzu (hepsi 2026-09-25) dosyanın depoya parça parça girişi: `2acc607 commit 269`
  (dosya başı yorumu ve `veliCocuklar`), 270 (`veliSeciliCocuk`), 271 (`cocukRozet`, `veliCocukSeridi`), 272
  (`cocuklarIcin`), 273 (`veliCocukYok`), 274 (Ödevler sayfası), 275 (`veliOdevListesi`), `cae41a7 commit 276`
  (Devamsızlık sayfası), `e251fbd commit 277` (İlerleyiş sayfası).
- Son değişiklik `3b8fd36 commit 519` (2026-09-27, quiz): ödev listesi `S.veliOdevHam`'a yazılıyor (quiz penceresi için);
  satırlara quiz rozeti (`quizListeEtiketi`) ve quiz durumu (`quizListeDurumu(a.quiz, false)` — puan yalnız sonuç açılınca)
  eklendi. O günden beri değişmedi.
- Bilinen açıklar (kod değiştirilmedi): bir çocuğun hatasının bütün sayfayı düşürmesi (kapalı Devamsızlık örneği), ana
  sayfadaki quiz kutusu, ana sayfa ile Ödevler sayfasının "aktif" tanımının ayrışması, sessizce 40'a kesilen geçmiş,
  ham devamsızlık tarihi.
- Planlı işlerden bu dosyaya dokunması beklenenler (DEVAM.md 4. bölüm):
  - "Tek kişi tek hesap + portallar öğrencide de" (iş 19): veli panelinin portal düzeniyle ilişkisi (bugün veli portalı
    yetişkin hesabının kendisi, seçili çocuk `S.veliCocuk`).
  - "Android yerel uygulama" (iş 10): uygulamadaki veli ekranları (Ödevler, Devamsızlık, İlerleyiş) aynı uçları kullanacak;
    birleştirme ve rozet mantığı buradakiyle aynı olmalı.
  - "Optimizasyon + saklama süreleri" (iş 7): öğrenci/veli yalnız son 1 geçmiş yılı görecek; yıl şeridi ve listeler kısalır.
  - "Başarılarım" (iş 16) ve "Sınav: formüllü ölçüm" (iş 14): İlerleyiş kartlarına (13 ve 28) yeni bölüm ve ölçümler.
  - "Çok dil" (iş 22) ve "Arayüz önizlemesi" (iş 31): ekran metinleri ve görünüm.
