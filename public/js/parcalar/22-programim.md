# public/js/parcalar/22-programim.js

Kişinin kendi ders programı sayfası: öğretmenin verdiği dersler ve haftalık programı (bugünün dersinden telefonda tek elle
yoklama penceresiyle) ve öğrencinin ya da velinin baktığı sınıf programı.

## Bu dosya ne yapar?

Okulda herkesin sorduğu ilk soru "Bugün hangi ders, saat kaçta?"tır. Bu sayfa (`programim`) o soruyu kişinin rolüne göre
cevaplar:

- **Öğretmen** — menüsünde her zaman **Ders Programım** (yetki gerekmez). Müdürün kendisine atadığı dersleri, her dersin
  kaç öğrencisi olduğunu ve haftalık programını görür. Bugünün derslerinde bir düğme belirir: **Şu an — yoklama al**.
  Basınca sınıf listesi telefona göre büyük düğmelerle açılır (Geldi · Gelmedi — izinli · Gelmedi — izinsiz); kaydedince
  gelmeyenin velisine "Çocuğunuz … bugün saat 09:20 Matematik dersine gelmedi (izinsiz)." bildirimi gider. Böylece
  öğretmen ayrı "Yoklama" sayfasına gitmeden, dersin başında iki dokunuşla yoklama alır.
- **Öğrenci** — menüsünde **Ders Programı**: kendi sınıfının programı, her dersin öğretmeniyle.
- **Veli** — "Çocuklarım"dan bir çocuğun portalını açınca (`S.viewStudentId`), menüde çocuğun adının altında
  **Ders Programı**: o çocuğun sınıf programı, "Zeynep Şahin adına görüntülüyorsun." yazısıyla.
- **Müdür** — menüsünde bu madde yok; ders veren müdür adresle (`#/programim`) ya da `#/programim`'e bağlanan iki
  bildirimden biriyle ("Ders programına yeni ders saatlerin eklendi…" ve sabahki "Bugün 4 dersin var: 09:20 7-A
  Matematik, …") gelirse öğretmen gibi kendi derslerini görür.

Programın kendisini (Gün/Hafta görünümü, gün şeridi, ders kartları) bu dosya çizmez; [21-ders-programi.md](21-ders-programi.md)'deki
`gorunumSecici` ve `programGovdesi`'ni salt okunur çağırır. Bu dosyanın kendi işi: hangi veriyi isteyeceğine karar vermek,
kartların alt satırını ve öğretmenin yoklama düğmesini vermek, yoklama penceresini yönetmek.

## İçinde neler var?

### Sayfa: `SAYFALAR.programim`

`S.user.role` öğretmen ya da müdürse `ogretmenProgrami()`, değilse `ogrenciProgrami()`. `S.viewStudentId`'ye bakmaz
(aşağıda "Dikkat!", ilk madde).

### Öğretmenin programı: `ogretmenProgrami()`

`GET /api/teacher/schedule` → `{ gunSayisi, gunAdlari, cells, lessons }`. Çizim:

- başlık **DERS PROGRAMIM**, alt yazı "Müdürün sana atadığı dersler ve haftalık programın.";
- hücrelerden biri `cakisma` ise kırmızı kutu: "Programında çakışma var — aynı saatte birden fazla sınıf görünüyor.
  Müdürüne bildir.";
- hiç dersi yoksa boş kutu "Sana henüz ders atanmadı. Müdürün sınıflara ders atadığında burada görünecek." ve sayfa biter;
- `gorunumSecici()` + `programGovdesi(d, false, altAlan)`: kartın alt satırı **sınıf adı** (`altAlan(sp)` =
  `sp.className`);
- `altAlan.ekIslem(sp)` — Gün görünümünde salt okunur karta eklenen yoklama düğmesi. Çıkma koşulları:
  - okulda Devamsızlık bölümü açık (`ozellikAcik('devamsizlik')`), kişide `devamsizlik.al` var (`yetkim`), ders BUGÜN
    (`bugunNo()`) ve hücrede `lessonId` var;
  - ders 15 dakikadan daha uzak bir gelecekteyse düğme yok ("henüz başlamamış ders için yoklama yok");
  - ders saatindeyse (başlangıç ≤ şimdi ≤ bitiş) dolu düğme "**Şu an — yoklama al**"; 15 dakika kala ya da ders
    bittikten sonra (gün boyu) soluk (`ghost`) "**Yoklama**";
  - düğme: `button.btn.kucuk.yoklama-al`, `data-act="program-yoklama"`, `data-id` = ders, `data-saat` = başlangıç,
    `data-ad` = "7-A · Matematik", onay simgesiyle.
- Programın altında her ders bir satır (`.satir`, `data-ara` = "7-A Matematik"; üstteki arama kutusu süzer): "7-A ·
  Matematik", "28 öğrenci", etiket "3 / 4 saat" (yerleşen / haftalık; eşitse yeşil, değilse turuncu).

### Yoklama penceresi

- `PY_DURUM` — `[{ k: 'var', ad: 'Geldi' }, { k: 'izinli', ad: 'Gelmedi — izinli' }, { k: 'yok', ad: 'Gelmedi — izinsiz' }]`.
  "Geç geldi" (`gec`) burada seçenek değildir.
- `EYLEMLER['program-yoklama'](el, lessonId)` — `GET /api/devamsizlik/yoklama?lessonId=…` → `{ ders, tarih, durumlar,
  ogrenciler: [{ id, ad, durum, not }] }` (sınıfın öğrencileri; bugün kaydı olmayan `var`). `S.py = { lessonId, saat,
  tarih (sunucunun bugünü), durum: {}, onceki: {} }`. Pencere **Yoklama**:
  - üstte (`.py-ust`) "**7-A · Matematik** · bugün 09:20 · 28 öğrenci" ve **Hepsi geldi** (`data-act="py-hepsi"`);
  - her öğrenci (`.py-satir`): avatar ve ad; altında üç büyük düğme (`.py-secim`, `role="radiogroup"`; her biri
    `.py-dugme.<durum>`, `role="radio"`, `aria-checked`, `data-act="py-durum"`, `data-id` = öğrenci, `data-durum`).
    Önceki kaydı "Geç geldi" olan öğrenci "Geldi" seçili görünür; `S.py.onceki`'de `gec` olarak saklanır;
  - ileti yeri `#pyMesaj`; altta **Vazgeç** ve **Kaydet** (`data-act="py-kaydet"`).
  Pencere açılamazsa (yetki, özellik kapalı…) hata tarayıcının uyarı kutusunda (`hataGoster`).
- `pySatiriCiz(id)` — o öğrencinin üç düğmesinde `secili` sınıfını ve `aria-checked`'i günceller.
- `EYLEMLER['py-durum']` — `S.py.durum[öğrenci] = data-durum`, satırı yeniden işaretler.
- `EYLEMLER['py-hepsi']` — herkesi `var` yapar.
- `EYLEMLER['py-kaydet']` — `girisler = [{ ogrenciId, durum }]` (herkes; önceki `gec` ve şimdi `var` ise `gec` gider);
  `gelmeyen` = `yok` ya da `izinli` sayısı. "Kaydediliyor..." → `POST /api/devamsizlik/yoklama { lessonId, tarih, saat,
  girisler }`. Başarıda pencere kapanır ve sayfanın üstünde yeşil ileti: "Yoklama kaydedildi. Gelmeyen 2 öğrencinin
  velisine bildirim gitti." ya da "Yoklama kaydedildi. Herkes geldi." Hata `#pyMesaj`'a, düğme açılır.

### Öğrencinin ve velinin programı: `ogrenciProgrami()`

`GET /api/myschedule` + `hedefOgrenci()` (portala bakılıyorsa `?studentId=…`) → `{ className, gunSayisi, gunAdlari,
cells: [{ id, day, start, end, subject, teacherName }] }`:

- başlık **DERS PROGRAMI**; başkası adına bakılıyorsa alt yazı "<ad> adına görüntülüyorsun." (`S.viewStudentName`);
- sınıfı yoksa: "Henüz bir sınıfa yerleştirilmedin. Müdürün seni sınıfa eklediğinde programın burada görünecek.";
- varsa mavi kutu "Sınıf: **7-A**"; program boşsa "Sınıfının ders programı henüz oluşturulmadı.";
- `gorunumSecici()` + `programGovdesi(d, false, …)`: kartın alt satırı öğretmen adı.

### Durum

`S.py` — açık yoklama penceresinin bilgisi. [00-durum.md](00-durum.md)'deki `S` nesnesinde önceden tanımlı değildir; ilk
pencerede oluşur. Gün ve görünüm seçimi [21-ders-programi.md](21-ders-programi.md)'deki `S.programGun` /
`S.programGorunum`'dadır (gün tıklaması `programYenidenCiz` → `git('programim')` ile sayfayı sunucudan yeniden ister).

## Kimle konuşur?

- Parçalar ad sırasıyla tek bir IIFE'de birleşir (`/js/app.js`; [../../../sunucu/http.md](../../../sunucu/http.md)
  `birlesikOku`). Bu dosyanın çağırdıkları: `S` ([00-durum.md](00-durum.md)); `esc`, `api`, `EYLEMLER`
  ([01-yardimcilar.md](01-yardimcilar.md); `$` burada kullanılmaz, yoklama düğmeleri `document.querySelectorAll` ile
  bulunur); `ik`, `avatar` ([02-ikonlar.md](02-ikonlar.md)); `modalAc`, `modalKapat`,
  `mesajGoster`, `sayfaMesaji` ([03-mesaj-modal.md](03-mesaj-modal.md)); `dugmeBekle`, `dugmeBitir`
  ([05-giris.md](05-giris.md)); `ozellikAcik` ([06-menu.md](06-menu.md)); `yaz`, `hero`, `bosKutu`
  ([07-yonlendirme.md](07-yonlendirme.md)); `SAYFALAR` ([08-ana-sayfa.md](08-ana-sayfa.md)); `hedefOgrenci`
  ([13-ogrenci-veli.md](13-ogrenci-veli.md)); `yetkim`, `bugunNo`, `gorunumSecici`, `programGovdesi`
  ([21-ders-programi.md](21-ders-programi.md)); `hataGoster` (`25-tiklama.js`).
- Onu kullananlar: başka parça bu dosyanın işlevlerini doğrudan çağırmaz. [06-menu.md](06-menu.md) `programim`'i
  öğretmenin ("Ders Programım"), öğrencinin ve portal görünümünün ("Ders Programı") menüsüne koyar; `25-tiklama.js`'teki
  `program-gun` / `program-gorunum` bu sayfadayken `git('programim')` ile yeniden çizdirir. Sunucuda iki bildirim
  `#/programim`'e bağlanır: `schedule-add`'in öğretmene günde bir "Ders programına yeni ders saatlerin eklendi.
  Programından bakabilirsin." bildirimi ([../../../sunucu/bolumler/okul.md](../../../sunucu/bolumler/okul.md)) ve
  sabah 07:00–12:00 arasında dersi olan öğretmene (müdür dahil) günde bir giden "Bugün N dersin var: …" özeti
  ([../../../sunucu/hatirlatma.md](../../../sunucu/hatirlatma.md)).
- Sunucu uçları:
  - `GET /api/teacher/schedule` ([../../../sunucu/bolumler/ogretmen.md](../../../sunucu/bolumler/ogretmen.md)) — yalnız
    öğretmen ve müdür (başkası 403 "Yetkin yok"). `cells`: öğretmenin bütün sınıflardaki ders saatleri `{ id, day, start,
    end, subject, className, classId, lessonId, cakisma }`; `cakisma` öğretmenin KENDİ saatleri aynı gün kesişiyorsa.
    `lessons`: `{ id, subject, className, classId, weeklyHours, placed, studentCount }`, sınıf adı ve derse göre Türkçe
    sıralı.
  - `GET /api/myschedule[?studentId=]` ([../../../sunucu/bolumler/ilerleyis.md](../../../sunucu/bolumler/ilerleyis.md)) —
    öğrenci kendisininkini `studentId`'siz alır; başkası `studentId` vermek zorunda (yoksa 400 "Öğrenci seçmelisin") ve
    öğrenciyi görebilmeli (veli bağı; müdür aynı okul; öğretmen o öğrenciye ders veriyorsa ya da `ogrenci.portal`
    yetkisiyle — [../../../sunucu/iliskiler.md](../../../sunucu/iliskiler.md) `canSeeStudent`), yoksa 403 "Bu öğrenciyi
    görüntüleyemezsin". Sınıfsız öğrencide `className: ''`, `cells: []`.
  - `GET /api/devamsizlik/yoklama?lessonId=` ve `POST /api/devamsizlik/yoklama`
    ([../../../sunucu/bolumler/devamsizlik.md](../../../sunucu/bolumler/devamsizlik.md)). Yetki: `devamsizlik.al` (ders +
    sınıf kapsamıyla) ve öğretmen için ek şart — ders kendisinin olmalı ya da müdür o ders/sınıf için açık kapsam vermiş
    olmalı; yoksa 403 "Bu ders için yoklama yetkin yok". Kaydetmede: ileri tarih 400 "İleri tarihe yoklama alınamaz";
    boş liste 400 "Yoklama boş"; yalnız sınıfın öğrencileri ve geçerli durumlar alınır; "Geldi" kaydı tutulmaz; o dersin o
    günkü kayıtları silinip yenisi yazılır. Bildirim yalnız durumu DEĞİŞEN öğrenciye ("Bugün 09:20 Matematik dersi:
    Gelmedi") ve velilerine ("Çocuğunuz Ali Yılmaz bugün saat 09:20 Matematik dersine gelmedi (izinsiz)."; izinlide
    "gelmedi (izinli)", geç gelende "geç geldi") gider; `saat` yalnız bu metne girer. Cevap `{ yazilan, message }`
    (ön yüz `message`'ı kullanmaz, kendi iletisini yazar). Okulda Devamsızlık kapalıysa 403; geçmiş eğitim yılına bakan
    öğretmen/müdürde kaydetme 409 ([../../../sunucu/api.md](../../../sunucu/api.md)).
- Veri: [../../../sunucu/veri/depo/siniflar.md](../../../sunucu/veri/depo/siniflar.md) (`ogretmeninDersleri`,
  `ogretmeninProgrami`, `sinifinProgrami`, `ozetleri`), [../../../sunucu/veri/depo/devamsizlik.md](../../../sunucu/veri/depo/devamsizlik.md)
  (`dersGunu`, `dersGunuYaz` → `devamsizlik` tablosu).
- CSS: `public/css/parcalar/22-cesitli.css` — `.yoklama-al` (tam genişlik, en az 44 px), `.py-ust`, `.py-liste`,
  `.py-satir`, `.py-ad`, `.py-secim` (üç eşit sütun), `.py-dugme` (en az 48 px; seçiliyken Geldi yeşil, izinli mavi,
  izinsiz kırmızı); programın kendisi `14-ders-programi.css` ([21-ders-programi.md](21-ders-programi.md)); `.satir`,
  `.etiket` `04-kartlar.css`; avatar `12-ikonlar.css`.
- Rol: öğretmen, (ders veren) müdür, öğrenci; veli ve okul personeli öğrenci portalından.

## Nasıl çalışır (adım adım)?

```
öğretmen "Ders Programım" ─► GET /teacher/schedule ─► Gün görünümü (bugün)
   bugünkü 09:20 Matematik kartı, saat 09:10 ─► soluk "Yoklama"; 09:25 ─► dolu "Şu an — yoklama al"
   bas ─► GET /devamsizlik/yoklama?lessonId ─► S.py ─► pencere: 28 öğrenci, hepsi "Geldi"
        Ali ─► "Gelmedi — izinsiz", Ece ─► "Gelmedi — izinli"
        "Kaydet" ─► POST /devamsizlik/yoklama { lessonId, tarih, saat: '09:20', girisler: [28 satır] }
             sunucu: değişenler ─► öğrenciye + veliye bildirim
        ─► pencere kapanır ─► "Yoklama kaydedildi. Gelmeyen 2 öğrencinin velisine bildirim gitti."

öğrenci "Ders Programı" ─► GET /myschedule ─► "Sınıf: 7-A" + program (alt satırda öğretmen)
veli: Çocuklarım ─► çocuk kartı ─► menü "Ders Programı" ─► GET /myschedule?studentId=… ─► aynı ekran
```

## Dikkat!

- **Okul personeli öğrenci portalında öğrencinin değil kendi programını görür.** Müdür ya da öğretmen bir öğrencinin
  portalını açınca (`10-mudur.js` `ogrenciPortalAc` → `S.viewStudentId`) menüde öğrencinin adının altında "Ders Programı"
  çıkar; ama `SAYFALAR.programim` önce role bakar ve öğretmen/müdürü `ogretmenProgrami()`'ne gönderir. Ekranda kişinin
  KENDİ dersleri (ders vermeyen müdürde "Sana henüz ders atanmadı") görünür. Sunucu ucu hazırdır: müdür
  `GET /api/myschedule?studentId=` ile öğrencinin programını alabiliyor (`testler/test-yonetim.js` 7. bölüm). Veli için
  doğru çalışır (veli `ogrenciProgrami`'ne düşer). Kod okumasına göre; tarayıcıda denenmedi. Düzeltme önerisi:
  `S.viewStudentId` doluysa önce `ogrenciProgrami()`.
- **"Velisine bildirim gitti" iletisi her zaman doğru değil.** Sayı penceredeki "Gelmedi" işaretlerinden hesaplanır;
  sunucu ise yalnız durumu DEĞİŞEN öğrencinin velisine yazar. Aynı yoklamayı ikinci kez kaydedersen, ya da velisi olmayan
  öğrencide, bildirim gitmez ama ileti yine "gitti" der. Sunucunun kendi iletisi ("2 devamsızlık kaydedildi.")
  kullanılmaz.
- **"Geç geldi" bu pencereden kaldırılamaz.** Önceki kaydı `gec` olan öğrenci "Geldi" görünür; kod yorumu "dokunulmazsa
  korunur" diyor ama "Geldi"ye basılsa da, "Hepsi geldi" dense de kayıt `gec` olarak gider (`py-kaydet`'teki
  `onceki === 'gec'` kuralı). "Geç geldi"yi silmek için "Yoklama" ya da "Devamsızlık" sayfası gerekir
  ([18-devamsizlik.md](18-devamsizlik.md)).
- **Aynı dersin günde iki saati tek kayıttır.** Devamsızlık ders + gün anahtarıyla tutulur; `saat` yalnız bildirim
  metnine girer ([../../../sunucu/bolumler/devamsizlik.md](../../../sunucu/bolumler/devamsizlik.md)). Blok derste ikinci
  saatin "Yoklama" düğmesi pencereyi birinci saatin işaretleriyle açar; kaydetmek onun üzerine yazar.
- **Son kaydeden kazanır.** Kaydetme o dersin o günkü bütün kayıtlarını yeniden yazar; pencere açıkken başka biri (ya da
  aynı öğretmen "Yoklama" sayfasından) kaydederse, sonra basılan "Kaydet" öncekini ezer.
- **Düğmenin zamanı cihazın saatine göre.** "Bugün" ve "15 dakika kala" tarayıcının saatinden hesaplanır; program
  saatleri Türkiye saatidir. Kaydedilen `tarih` ise pencere açılırken sunucudan gelen gündür. Ders bittikten sonra da
  düğme gün boyu kalır (soluk "Yoklama").
- **Düğme yalnız Gün görünümünde.** Haftalık tablo `ekIslem`'i çizmez ([21-ders-programi.md](21-ders-programi.md)).
- **Düğme kapsama bakmaz.** `yetkim('devamsizlik.al')` yalnız yetkinin varlığına bakar; asıl karar sunucuda. Öğretmen
  burada yalnız kendi derslerini gördüğü için normalde sorun çıkmaz.
- **Boş sınıfta "Kaydet" hata verir:** öğrencisi olmayan derste liste boştur, sunucu 400 "Yoklama boş" der.
- **Not alanı gönderilmez.** Kayıtlar `not` boş olarak yeniden yazılır; bugün hiçbir ekran devamsızlığa not yazmadığı
  için kayıp yok, ama not eklenirse bu pencere notları silebilir.
- **Ders listesi kart içinde değil.** Öğretmen programının altındaki ders satırları bir `.kart` içine alınmamıştır ve
  sonlarında eşi olmayan bir `</div>` vardır (tarayıcı yok sayar); "fazla" yerleşmiş ders de turuncu görünür
  ([21-ders-programi.md](21-ders-programi.md)'deki müdür ekranında kırmızı).
- **Başkası adına bakarken metin "sen" der.** Velinin baktığı çocuk sınıfsızsa ekranda "Henüz bir sınıfa
  yerleştirilmedin." yazar.
- **Çocuk seçmeden gelen veli hata görür.** Velinin kendi menüsünde bu sayfa yoktur; ama adres çubuğuna `#/programim`
  yazan (ya da geri tuşuyla portal dışından dönen) veli `ogrenciProgrami()`'ne düşer, `S.viewStudentId` boş olduğu için
  `studentId`'siz istek gider ve sayfada sunucunun 400 iletisi "Öğrenci seçmelisin" kırmızı kutuda görünür. Zararsız;
  kod okumasına göre.
- **`S.py` çıkışta sıfırlanmaz** (`26-baslat.js` listesinde yok); pencere her açılışta üzerine yazdığı için başkasına
  geçmez.

## Testleri

- `testler/test-program.js` — 10) öğretmenin kendi programı (iki ders, saat bilgisi, çakışma işareti); 11) öğrencinin kendi
  sınıf programı (sınıf adı, ders saatleri); 13) silinen sınıfın dersi öğretmenin programından düşer, çakışma temizlenir.
- `testler/test-siniflarim.js` — 5) "ders programından yoklama": `saat: '09:20'` ile kaydedilen yoklamada veliye "Çocuğunuz
  … bugün saat 09:20 Matematik dersine gelmedi (izinsiz)", izinliye çevrilince "gelmedi (izinli)"; öğretmen programındaki
  her hücrede `lessonId` var (düğme için).
- `testler/test-devamsizlik.js` — yoklama ekranı (sınıfın öğrencileri, varsayılan `var`), kaydetme ("Geldi" tutulmaz),
  üzerine yazma, ileri tarih, başkasının dersine ve öğrencinin yoklama alamaması.
- `testler/test-bildirim.js` — 3) aynı yoklama yeniden kaydedilince bildirim yok, durum değişince var; 6) veliye "Çocuğunuz
  …" metni.
- `testler/test-yonetim.js` — 7) müdür öğrencinin programını `studentId` ile alabiliyor (sunucu tarafı; ön yüz bu yolu
  personelde kullanmıyor, yukarıda).
- `testler/test-okul-agi.js` (yük denemesi) — öğrenci başına istek dizisinde `GET /api/myschedule`.
- `testler/buton-denetimi.js` — `program-yoklama`, `py-durum`, `py-hepsi`, `py-kaydet`; `testler/yazim-denetimi.js`.
- Bu dosyanın tarayıcıda çalışan testi yok (ekran turu `araclar/gezinti.js` "Ders programım", yoklama penceresi ve
  "Yoklama kaydedildi" görüntülerini alır; bir şey doğrulamaz).
- Elle (sunucu 3200'de, `testler/seed.js`): müdürle bugüne, şimdiki saati içine alan bir Matematik saati ekle;
  seed'deki Matematik öğretmeniyle (kullanıcı adı `mat`) **Ders Programım** → kartta "Şu an — yoklama al" → bir öğrenciyi "Gelmedi — izinsiz" yap → Kaydet;
  o öğrencinin velisiyle girince bildirim görünür. Aynı yoklamayı yeniden kaydet: ileti yine "gitti" der, veliye ikinci
  bildirim gitmez.

## Son durum

- `git log`: 2 commit. Dosyanın ilk hâli `968311f commit 59` (2026-08-29): sayfa, `ogretmenProgrami` (yoklama düğmesiyle),
  `PY_DURUM` ve `ogrenciProgrami`; aynı commit `public/css/parcalar/11-haftalik-program-tablosu.css`'i getirdi.
- Son değişiklik `83bb53e commit 446` (2026-09-26): yoklama penceresinin kendisi eklendi — `program-yoklama` (sınıf
  listesi, üç büyük düğme, "Geç geldi"nin korunması), `pySatiriCiz`, `py-durum`, `py-hepsi`, `py-kaydet` ("Gelmeyen N
  öğrencinin velisine bildirim gitti" iletisi). Not: 59'daki düğme bu eylemi zaten üretiyordu; commit'ler dosyanın parça
  parça girişini gösterir. O günden beri değişmedi.
- Bilinen açıklar (kod değiştirilmedi): personelin öğrenci portalında kendi programını görmesi, "bildirim gitti"
  iletisinin her zaman doğru olmaması, "Geç geldi"nin bu pencereden kaldırılamaması.
- Planlı işlerden bu dosyaya dokunması beklenenler (DEVAM.md 4. bölüm):
  - "Toplantılar + sınıfın uzaktan ders bağlantısı" (iş 21, 29 Eylül'de istendi): "Şu an" dersinde öğretmene "Görüşme
    başlat"; yoklamada "Gelmedi" işaretlenene "Dersin uzaktan bağlantısı açık — Katıl" bildirimi; tanımda öneri olarak
    yoklamaya "Uzaktan katıldı" durumu (gelirse `PY_DURUM`'a yeni seçenek).
  - "Android yerel uygulama" (iş 10): öğretmen için "Program + Yoklama (Geldi / Gelmedi izinli / izinsiz, Hepsi geldi,
    Kaydet)" aynı uçlarla; ana sayfada "Şu an — yoklama al".
  - "Çalışan olarak ekleme" (iş 2): öğretmen olmayan çalışan derse atanamayacak; bundan çıkan sonuç (tanımda ayrıca
    yazmıyor): menüdeki "Ders Programım" onda gereksiz olur, bugün `teacher` rolündeki herkese çıkıyor.
  - "Yıl geçişi" (iş 9): mezun öğrencinin yeni yılda programı olmayacak ("Mezun oldun" ekranı).
  - "Çok dil" (iş 22): ekran metinleri ve bildirim metinleri kataloğa.
