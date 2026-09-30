# public/js/parcalar/13-ogrenci-veli.js

Öğrencinin "İlerleyişim" sayfası ve onun kartları (ödev grafiği, sınav grafiği kutusu, grupsuz sınavlar, sınav grubu
ortalamaları); ayrıca başkasının adına bakılırken isteğe `?studentId=` ekleyen `hedefOgrenci`.

## Bu dosya ne yapar?

Bir öğrencinin okulda nasıl gittiğini tek sayfada toplar: ödevlerini ne kadar yaptığı, derslere göre başarı oranı,
sınavlarda nasıl bir çizgi izlediği ve sınav gruplarındaki ortalaması. Sayfanın anahtarı `ilerleyisim`.

Bu sayfaya üç yoldan girilir:

- **Öğrenci** kendisi: menüde "İlerleyişim", ana sayfada camgöbeği "İlerleyişim" kutucuğu.
- **Veli**: "Çocuklarım"da çocuğun kartına basınca (`cocuk-ac`, kart `23-veli-ayarlar.js`'te) çocuğun portalı açılır ve
  ilk sayfa budur. Menüsünde "Velisi olduğum" bölümü olan öğretmen ya da müdür de ("Çocuklarım", `06-menu.js`
  `veliBolumu`) aynı yoldan girer. Velinin kendi menüsündeki "İlerleyiş" (`veli-ilerleyis`) ise başka bir sayfadır
  (`27-veli-panel.js`), çocukları alt alta gösterir; ama her çocuğun kartlarını yine bu dosyadaki `ilerleyisKartlari`
  çizer.
- **Müdür** ve `ogrenci.portal` yetkili öğretmen (ör. hazır "Rehber Öğretmen" şablonu): "Okul Öğrencileri" listesinde
  "Portalını aç" (`ogrenci-portal` → `ogrenciPortalAc`, [10-mudur.md](10-mudur.md)).

Başkasının adına bakılırken `S.viewStudentId` doludur (menü de o öğrencinin portal menüsüne döner, [06-menu.md](06-menu.md)).
`hedefOgrenci()` bu durumda her isteğe `?studentId=<kimlik>` ekler; aynı küçük yardımcıyı Ödevler, Sınavlar ve Ders
Programı sayfaları da kullanır.

Bu dosya grafiklerin kendisini çizmez: ödev sütun grafiği ve sınav çizgi grafiği `28-grafik.js`'tedir. Burası kartları ve
grafik kutularını yerleştirir, sayfa ekrana konduktan sonra `ilerleyisGrafikleriniYukle` ile kutuları doldurtur. Derslere
göre yığılmış sütunlar ise burada, düz HTML olarak çizilir.

## İçinde neler var?

### Kimin adına bakılıyor?

- `hedefOgrenci()` — `S.viewStudentId` doluysa `'?studentId=' + encodeURIComponent(S.viewStudentId)`, değilse `''`. Başı
  `?` ile başladığı için yalnız sorgu parametresi olmayan bir yolun sonuna eklenebilir (bugünkü çağıranların hepsi öyle).
- `kimIcin()` — `S.viewStudentName` ya da `'Senin'`. Hiçbir yerde çağrılmıyor (aşağıda "Dikkat!").

### Sayfa

- `SAYFALAR.ilerleyisim` — `api('/progress' + hedefOgrenci())` → başlık "İLERLEYİŞ", alt yazı başkası bakıyorsa
  "<Öğrencinin adı> adına görüntülüyorsun.", değilse "Ödev ve sınav durumun." → `ilerleyisKartlari(d)` → `yaz(h)` →
  `ilerleyisGrafikleriniYukle([d.student.id])`. İstek hata verirse `git()` sayfanın yerine kırmızı iletiyi yazar
  ([07-yonlendirme.md](07-yonlendirme.md)). Söz döner (sayfa çizilince biter).

### Kartlar

- `ilerleyisKartlari(d)` — `d` = `/api/progress` cevabı. HTML döner, sırası:
  1. **Tercihler.** Tarayıcıdaki iki küçük tercihi okur (`tercihOku`, `localStorage`'da `ee_` önekiyle,
     [01-yardimcilar.md](01-yardimcilar.md)): `odev_grafik_kapali` `'1'` ise `body`'ye `odev-grafik-kapali` sınıfı
     konur, değilse kaldırılır; `odev_grafik_gorunum` `'ders'` değilse görünüm `'sonuc'`.
  2. **"Ödevler" kartı** — `div.kart.odev-grafik[data-gorunum="sonuc|ders"]`. Başlık satırında (`.grafik-bas`) üç düğme:
     "Sonuçlara göre" ve "Derslere göre" (`data-act="odev-grafik-sekme" data-val="sonuc|ders"`; seçili olan `secili`),
     "Grafiği gizle" (`data-act="odev-grafik-gizle"`; düğmede hem "Grafiği gizle" hem "Grafiği göster" yazısı vardır,
     hangisinin görüneceğini CSS `body` sınıfına bakarak seçer). Gövde (`.g-govde`) iki görünümü birden taşır, CSS
     `data-gorunum`'a göre birini gizler:
     - `.g-sonuc` — ödev varsa `odevSonucGrafigi(d.assignments)` (`28-grafik.js`): sabit yükseklikli, boş bir
       `.odev-sutun[data-sayim]` kutusu; sayım Yaptı, Geç yaptı, Eksik, Yapmadı, İzinli, Gelmedi, Belirsiz (sonucu
       olmayan her ödev "Belirsiz"). Ödev yoksa "Henüz ödev yok.".
     - `.g-ders` — `d.subjects` boşsa "Henüz sonuçlanmış ödev yok."; değilse her ders bir yığılmış sütun
       (`.grafik` > `.sutun-sar`, `title` = dersin tam adı): üstte başarı oranı (`%75`; oran `null` ise `-`), ortada
       `.sutun-yigin` (yüksekliği en kalabalık derse göre, en çok 145 px: `145 × toplam / enBuyuk`; `enBuyuk` en az 1),
       içinde `cubuk` dilimleri alttan yukarı Yaptı, Geç, Eksik, Yapmadı, İzinli, Gelmedi; altta `kisalt`'ılmış ders
       adı. Altında gösterge (Yaptı yeşil, Geç yaptı mavi, Eksik turuncu, Yapmadı kırmızı, Gelmedi (izinli) soluk,
       Gelmedi (izinsiz) bordo) ve "Oran: yaptı tam, geç ve eksik yarım sayılır; izinli gelmemek oranı düşürmez.".
  3. `sinavGrafigiKutusu(d.student.id)` (`28-grafik.js`) — `div.kart.sinav-grafik#sg-<öğrenci>`, içinde yer tutucu; veri
     sonra gelir (sayfa kaymasın diye yüksekliği sabit).
  4. `sinavSonuclari(d)`.
- `sinavSonuclari(d)` — `tekSinavKarti(d) + grupOrtalamaKarti(d)`. Yalnız `ilerleyisKartlari` çağırır.
- `tekSinavKarti(d)` — gruba bağlı olmayan sınavlar (`d.exams`). Hiç yoksa `''` (kart hiç çıkmaz). Varsa "Sınavlar"
  kartı, her sınav bir `.satir`:
  - sınav adı; altında "tarih · ders · öğretmen" (`tarih()` ile `04.09.2026`; öğretmen adı boşsa yazılmaz);
  - ana ölçüm dışındaki, DEĞERİ OLAN ölçümler çip olarak (`.olcum-cipleri` > `.olcum-cip`: "**Türkçe Net** 12,5");
  - sağda etiket: ana ölçüm (`ana: true` olan; yoksa ilk ölçüm) "LGS Puanı 412,3" (mavi) ya da "Değer yok" (gri);
    etiketin `title`'ı ölçümün adı;
  - satırda `data-ara="<sınav adı> <ders>"`: üst çubuktaki arama kutusu bu satırları süzer.
  Sayılar `sayiTR` ile (en çok üç ondalık, Türkçe virgül). `14-odev-filtre.js`'teki "Sınavlar" sayfası da bu kartı
  kullanır.
- `grupOrtalamaKarti(d)` — "Sınav grubu ortalamaları" kartı HER ZAMAN çıkar; grup yoksa "Henüz gruplu sınav yok.". Her
  grup bir satır: ad; "ders · öğretmen · 100 üzerinden"; doluluk çubuğu (`.cubuk`, genişlik = ortalamanın 0–100'e
  kırpılmışı, hesap yoksa 0); sağda etiket: 50 ve üstü yeşil, altı kırmızı, ortalama yoksa gri "Değer yok"; sayı en çok
  iki ondalık (`sayiTR(ortalama, 2)`).

### Sonradan doldurma ve küçük yardımcılar

- `ilerleyisGrafikleriniYukle(ogrenciIdler)` — sayfa `yaz` ile yerleştikten SONRA çağrılır (kutuların genişliği ancak
  o zaman belli olur): önce `odevGrafikleriniCiz()` (görünen her `.odev-sutun` kutusunu kendi genişliğinde çizer; gizli
  olanlar atlanır, görününce çizilir), sonra her öğrenci için `sinavGrafigiYukle(id)` (`GET /api/exams/grafik?ogrenci=`).
  Çağıranlar: bu sayfa, `SAYFALAR.sinavlarim` (`14-odev-filtre.js`), `SAYFALAR['veli-ilerleyis']` (`27-veli-panel.js`;
  şeritte bir çocuk seçiliyse yalnız onun, "Hepsi" seçiliyse bütün çocukların kimlikleriyle).
- `cubuk(sinif, deger, toplam)` — yığının bir dilimi: `<i class="yapti" style="height:40%"></i>`; değer 0 ya da boşsa
  `''`.
- `kisalt(s)` — 13 karakter ve altıysa aynen; uzunsa yalnız ilk kelime ("Sosyal Bilgiler" → "Sosyal"). Tam ad sütunun
  `title`'ında durur.

Bu dosya hiçbir `EYLEMLER` kaydetmez: ürettiği iki düğmenin (`odev-grafik-sekme`, `odev-grafik-gizle`) karşılığı
`28-grafik.js`'tedir.

## Kimle konuşur?

- Çağırdıkları (hepsi aynı IIFE'de, ad sırasıyla birleşen parçalardan):
  - `api`, `esc`, `sayiTR`, `tercihOku` ([01-yardimcilar.md](01-yardimcilar.md)); `tarih` ([02-ikonlar.md](02-ikonlar.md));
    `hero`, `yaz` ([07-yonlendirme.md](07-yonlendirme.md)); `SAYFALAR` (`08-ana-sayfa.js`'te tanımlı,
    [08-ana-sayfa.md](08-ana-sayfa.md)); `S.viewStudentId`, `S.viewStudentName` ([00-durum.md](00-durum.md)).
  - `28-grafik.js` (bu dosyadan SONRA birleşir; çağrılar çalışma anında olduğu için sorun olmaz): `odevSonucGrafigi`,
    `sinavGrafigiKutusu`, `odevGrafikleriniCiz`, `sinavGrafigiYukle`. Aynı dosyadaki `EYLEMLER['odev-grafik-sekme']`
    kartın `data-gorunum`'unu ve seçili düğmeyi değiştirir, `tercihYaz('odev_grafik_gorunum', …)` yazar ve yeniden çizer
    (istek atmaz); `EYLEMLER['odev-grafik-gizle']` `body.odev-grafik-kapali`'yı çevirir ve `odev_grafik_kapali`'yı yazar.
- Sunucu uçları:
  - `GET /api/progress[?studentId=]` — [../../../sunucu/bolumler/ilerleyis.md](../../../sunucu/bolumler/ilerleyis.md).
    Girişsiz 401; `canSeeStudent` geçmezse 403 "Bu öğrenciyi görme yetkin yok" (görebilenler: öğrencinin kendisi, veli
    bağı olan, aynı okulun müdürü, aynı okulda `ogrenci.portal` yetkili ya da öğrencinin dersine giren öğretmen, sistem
    yöneticisi); istenen kimlik öğrenci değilse 404 "Öğrenci bulunamadı". Ödevler ve sınavlar bakanın seçtiği eğitim
    yılına süzülür, okulun kapattığı Ödevler/Sınavlar boş gelir. Bu dosyanın kullandığı alanlar: `student.id`;
    `assignments[].result`; `subjects[]` (`subject, yapti, gec, eksik, yapmadi, izinli, gelmedi, toplam, oran`);
    `exams[]` (`name, subject, tarih, teacherName, olcumler[{ ad, ana, deger }]`); `examGroups[]` (`name, subject,
    teacherName, average`). Kullanmadıkları: `kapaliOzellikler`, `seri` (ana sayfa ve Ödevler kullanır).
  - `GET /api/exams/grafik?ogrenci=` — dolaylı, `sinavGrafigiYukle` üzerinden
    ([../../../sunucu/bolumler/sinav.md](../../../sunucu/bolumler/sinav.md)).
- Onu kullananlar:
  - `hedefOgrenci` — `14-odev-filtre.js` (`SAYFALAR.odevler`, `SAYFALAR.sinavlarim`), `22-programim.js` (`/myschedule`).
  - `ilerleyisKartlari`, `ilerleyisGrafikleriniYukle` — `27-veli-panel.js` (`veli-ilerleyis`, çocuk başına bir başlık ve
    kart takımı).
  - `tekSinavKarti`, `ilerleyisGrafikleriniYukle` — `14-odev-filtre.js` (`sinavlarim`; grup kartını kendisi çizer).
  - `ilerleyisim` sayfasına götürenler: [06-menu.md](06-menu.md) (öğrencide "İlerleyişim", portal görünümünde
    "İlerleyişi"), [08-ana-sayfa.md](08-ana-sayfa.md) (öğrencinin kutucuğu, altında "Ortalama …" ya da "Not girilmedi"),
    [10-mudur.md](10-mudur.md) (`ogrenciPortalAc`), `25-tiklama.js` (`cocuk-ac`: `S.viewStudentId` + `git('ilerleyisim')`).
    Sayfa `06-menu.js`'teki `SAYFA_OZELLIK`'te yoktur: okul hangi bölümü kapatırsa kapatsın açılır.
  - Ekran turu `araclar/gezinti.js` bu sayfayı (sonuçlara ve derslere göre, koyu tema, telefon) fotoğraflar.
- CSS (`public/css/parcalar/`): `05-tablo-grafik.css` (`.grafik`, `.sutun-sar`, `.sutun-yigin` ve dilim renkleri,
  `.sutun-us`, `.sutun-ad`, `.gosterge`, `.cubuk`); `25-grafik-sinav.css` (`.grafik-bas`, `data-gorunum` ile görünüm
  gizleme, `body.odev-grafik-kapali` ve `.gizle-dugme` yazıları, `.sutun-yigin i.gec`, `.olcum-cipleri`, `.olcum-cip`,
  `.odev-sutun`, sınav grafiği kutusu); `19-mesajlar.css` (`.sekme`, `.sekme.kucuk`, `.sekme.secili`, `.sekme-satir`);
  `04-kartlar.css` (`.kart`, `.satir`, `.buyu`, `.etiket` renkleri); `02-form.css` (`.hint`).
- Rol: öğrenci, veli, müdür, `ogrenci.portal` yetkili öğretmen; "Velisi olduğum" bölümü olan öğretmen/müdür kendi
  çocuğu için. Kartları velinin "İlerleyiş" sayfası da çizer. Servisçi ve sistem yöneticisi bu sayfayı görmez.
- Android uygulaması bu dosyayı kullanmaz.

## Nasıl çalışır (adım adım)?

```
öğrenci: menü "İlerleyişim"   veli: Çocuklarım kartı (cocuk-ac)   müdür: "Portalını aç" (ogrenciPortalAc)
          │                    S.viewStudentId = çocuk               S.viewStudentId = öğrenci
          └───────────────────────────┬──────────────────────────────────┘
                                git('ilerleyisim')
SAYFALAR.ilerleyisim
  api('/progress' + hedefOgrenci())  ─►  GET /api/progress[?studentId=…]
  ilerleyisKartlari(d)
     tercihler ─► body.odev-grafik-kapali, data-gorunum
     "Ödevler": .g-sonuc (boş .odev-sutun kutusu) + .g-ders (yığılmış sütunlar, HTML)
     sinavGrafigiKutusu (yer tutucu)
     tekSinavKarti (varsa) + grupOrtalamaKarti
  yaz(h)                              ─►  #sayfa = yıl şeridi + kartlar + alt bilgi
  ilerleyisGrafikleriniYukle([id])
     odevGrafikleriniCiz()            ─►  sütun grafiği, kutunun genişliğinde
     sinavGrafigiYukle(id)            ─►  GET /api/exams/grafik?ogrenci=id ─► çizgi grafik

"Derslere göre"  ─► 28-grafik: data-gorunum="ders", tercih yazılır, istek yok
"Grafiği gizle"  ─► 28-grafik: body sınıfı çevrilir, tercih yazılır
```

Bir dersin sütunu, örnekle: Matematik'te sonuçlanmış 6 ödev — 4 Yaptı, 1 Geç, 1 Yapmadı. Sunucu oranı
(4 + 1 × 0,5) / 6 = %75 hesaplar; en kalabalık ders de 6 sonuçluysa sütun 145 px olur; dilimler alttan Yaptı %66,7,
Geç %16,7, Yapmadı %16,7.

## Dikkat!

- **Sayfa okulun kapattığı bölümleri bilmez.** `ilerleyisim` `SAYFA_OZELLIK`'te olmadığı için her zaman açılır ve
  `ilerleyisKartlari` ne `S.kapali`'ye ne cevaptaki `kapaliOzellikler`'e bakar. Ödevler kapalı okulda "Ödevler" kartı yine
  çıkar ve "Henüz ödev yok." der; Sınavlar kapalıysa "Sınav grubu ortalamaları" kartı "Henüz gruplu sınav yok." der ve
  sınav grafiği kutusu `/api/exams/grafik`'ten 403 alıp kırmızı "Sınavlar bu okulda kapalı. Okul müdürü Özellikler
  sayfasından açabilir." iletisini gösterir. (Kod okumasına göre; tarayıcıda denenmedi. Sunucu tarafı testli: ilerleyişte
  kapalı ödev gelmiyor.) Aynı kartları çizen velinin "İlerleyiş" sayfası (`veli-ilerleyis`) da `SAYFA_OZELLIK`'te yok:
  çocuklar farklı okullardaysa ödevi kapalı okuldaki çocuğun kartı "Henüz ödev yok." der. Öneri: ana sayfanın yaptığı
  gibi (`ozellikAcik('odev')`, [08-ana-sayfa.md](08-ana-sayfa.md)) ya da cevaptaki `kapaliOzellikler`'e bakarak kapalı
  bölümün kartını hiç çizmemek. Kod değiştirilmedi.
- **Portal görünümü sayfa yenilenince kaybolur.** `S.viewStudentId` yalnız bellekte durur; yenilemede sıfırlanır ama
  adres `#/ilerleyisim` kalır. Müdür, portal yetkili öğretmen ya da veli bu durumda `/api/progress`'i kendi kimliğiyle
  ister, sunucu kişi öğrenci olmadığı için 404 "Öğrenci bulunamadı" döner ve sayfada bu kırmızı ileti görünür
  ([10-mudur.md](10-mudur.md)'de de not edilmiş; kod okumasına göre).
- **`kimIcin()` ölü kod.** Hiçbir parça çağırmıyor (grep); silinebilir. Kod değiştirilmedi.
- **"Grafiği gizle" bütün ödev grafiklerini birlikte gizler.** Tercih tektir ve `body` sınıfıyla uygulanır; velinin
  "İlerleyiş" sayfasında bir çocuğunkini gizleyen hepsininkini gizlemiş olur. "Sonuçlara/Derslere göre" düğmesi yalnız
  kendi kartını değiştirir ama tercihi de tektir: bir sonraki çizimde bütün kartlar son seçilen görünümle açılır. İki
  tercih de hesaba değil tarayıcıya bağlıdır (`localStorage`, kişi adı taşımaz): aynı tarayıcıda giren başka hesap
  (ör. kardeş) da grafiği gizli bulur.
- **Çizim işlevi sayfaya dokunur.** `ilerleyisKartlari` HTML üretirken `body` sınıfını da ayarlar (yan etki). Sınıf başka
  sayfalarda da kalır ama yalnız `.odev-grafik` kartını etkilediği için zararsız.
- **Oran sunucuda hesaplanır, açıklaması burada yazılı.** "yaptı tam, geç ve eksik yarım; izinli düşürmez" metni
  [../../../sunucu/bolumler/ilerleyis.md](../../../sunucu/bolumler/ilerleyis.md)'deki formülle elle eşit tutulur; formül
  değişirse bu yazı da değişmeli.
- **Sonuçsuz ders sütunu.** Sunucu sonuçlanmış her ödevin dersini listeye koyar; öğrenciye sonuç yazılmamışsa o dersin
  `toplam`'ı 0 olur. Sütun o zaman `-` oranlı, en az 3 px'lik boş bir çubuktur (`.sutun-yigin` `min-height`).
- **`kisalt` iki dersi aynı gösterebilir.** 13 karakterden uzun, ilk kelimesi aynı iki ders (ör. "Türk Dili ve
  Edebiyatı" ile uydurma "Türk Kültürü Tarihi") sütunun altında ikisi de "Türk" yazar; ayırt etmek için sütunun üstüne
  gelip `title`'a bakmak gerekir.
- **Grup ortalaması "100 üzerinden" ve 50 eşiği sabit.** Sunucu her notu 100'lüğe çevirip ağırlıklı ortalar; burada 50 ve
  üstü yeşil, altı kırmızı. Aynı eşik `14-odev-filtre.js`'teki "Sınavlar" sayfasında da ayrı yazılı; ikisi birlikte
  değişmeli.
- **Arama yalnız "Sınavlar" kartını süzer.** Sayfada `data-ara` taşıyan tek şey grupsuz sınav satırlarıdır; üstteki
  arama kutusu grafikleri ve grup satırlarını süzmez, hiçbir sınav satırı tutmazsa sayfanın sonuna "… için sonuç
  bulunamadı." eklenir (`24-bildirim-arama-mobil.js`).
- **Sınav tarihi UTC okunur.** `tarih()` `'2026-09-04'` gibi 10 karakterlik tarihi UTC gece yarısı sayar; Türkiye'de doğru
  gün çıkar, saati UTC'nin gerisinde olan bir ülkede bir gün önce görünür ([02-ikonlar.md](02-ikonlar.md)).
- **Grafik kutuları iki aşamalı.** `ilerleyisKartlari`'nın ürettiği HTML'i `yaz`'sız bir yere koyan, ardından
  `ilerleyisGrafikleriniYukle`'yi çağırmayı unutursa ödev grafiği boş, sınav kutusu yer tutucu kalır.
- **Kılavuz bir sayfa daha vaat ediyor.** `belge/KILAVUZ.md` ("Veli tarafı" bölümü) çocuğun kartına tıklayınca açılan
  portalda "ilerleyiş, ödevler, sınavlar, başarılar" olduğunu söyler; bugün portal menüsünde "Başarılar" diye bir sayfa
  yok (planlı "Başarılarım" işi). Kılavuz ya o iş gelince doğru olur ya da şimdilik düzeltilmeli; kod değiştirilmedi.

## Testleri

- Tarayıcıda bu dosyayı çalıştıran bir test yok.
- `testler/buton-denetimi.js` (sunucusuz) — ürettiği `odev-grafik-sekme` ve `odev-grafik-gizle` eylemlerinin bir karşılığı
  olması (`28-grafik.js`), `SAYFALAR.ilerleyisim`'e bir menü düğmesinin götürmesi.
- `testler/yazim-denetimi.js` (sunucusuz) — kullanıcıya görünen Türkçe metinlerde yazım hataları.
- Beslediği uç (sunucu tarafı): `testler/test-sinav.js` (ilerleyişte grupsuz sınavlar ve grup ortalaması 80),
  `testler/test-veli-coklu.js` (veli çocuğun ilerleyişini görür, bağ kalkınca göremez), `testler/test-yonetim.js` (müdür
  öğrencinin ilerleyişini görür; rolsüz hesap giremez), `testler/test-ozellikler.js` (ödev kapalıyken `assignments` boş,
  `kapaliOzellikler` dolu), `testler/test-nakil.js` (eski okulun ödevleri yeni okulda görünmez).
- Elle: `testler/seed.js`'teki bir öğrenciyle gir → "İlerleyişim": ödev grafiği; "Derslere göre" (yığılmış sütunlar ve
  oran); "Grafiği gizle" → sayfayı yenile, gizli kalmalı; bir sınav notu girilmişse "Sınavlar"/"Sınav grubu
  ortalamaları" kartları. Müdürle "Öğrenciler" → "Portalını aç" → alt yazı "<ad> adına görüntülüyorsun.".

## Son durum

- `git log`: 3 commit. Son değişiklik `c1a66e0 commit 218` (2026-09-25): `grupOrtalamaKarti` eklendi (grup başına
  ad, ders, öğretmen, "100 üzerinden", çubuk ve renkli etiket). Hemen önce `dc70cc9 commit 217` (2026-09-25):
  `tekSinavKarti` eklendi (grupsuz sınavlar, ana ölçüm etiketi, öteki ölçümler çip). Dosyanın ilk hâli `8226f76 commit 81`
  (2026-08-29): `hedefOgrenci`, `kimIcin`, `SAYFALAR.ilerleyisim`, `ilerleyisKartlari` (ödev kartı, iki görünüm, gizle
  düğmesi, tercihler), `sinavSonuclari`, `ilerleyisGrafikleriniYukle`, `cubuk`, `kisalt`. (O ilk hâlde `sinavSonuclari`
  `tekSinavKarti` ile `grupOrtalamaKarti`'yı zaten çağırıyordu; tanımları 217 ve 218'de geldi.)
- Bilinen açıklar (kod değiştirilmedi): kapalı bölümlerin kartlarının yine çizilmesi (velinin "İlerleyiş" sayfasında
  da), yenilemede portal görünümünün kaybolması, ölü `kimIcin`, "Grafiği gizle"nin bütün kartlara (ve tarayıcıdaki
  bütün hesaplara) ortak olması; KILAVUZ'daki "başarılar" sözü.
- Planlı işlerden bu dosyaya dokunması beklenenler:
  - "Sınav: formüllü ölçüm + … sınav grubu üst değeri (ör. 125), yüzde/katkı puanı" (öneri, onay bekliyor):
    `grupOrtalamaKarti`'daki sabit "100 üzerinden", çubuğun 0–100 kırpması ve 50 eşiği grubun üst değerine göre
    değişecek; formülle hesaplanan ölçümler (ör. net) `tekSinavKarti`'nın çiplerinde görünebilir.
  - "Optimizasyon + saklama süreleri" (öğrenci/veli yalnız aktif ve bir önceki yılı görür): `/api/progress`'in yıl
    süzgeci daralır; sayfa kodu değişmeyebilir ama eski yıla bakan öğrenci/veli açık bir hata alacak.
  - "Çok dil": sayfadaki bütün Türkçe metinler (`İLERLEYİŞ`, gösterge adları, oran açıklaması…) çeviri işlevinden geçecek.
  - "Android yerel uygulama": tanımda öğrencinin "Sınavlar/İlerleyiş grafiği" ve velinin "İlerleyiş" ekranı var; büyük
    olasılıkla aynı `/api/progress` ucunu kullanacak, cevap biçimi değişirse iki yer birlikte güncellenmeli.
  - "Ekran turu + albüm": bu sayfanın ekran görüntüleri özellikler bitince baştan çekilecek.
