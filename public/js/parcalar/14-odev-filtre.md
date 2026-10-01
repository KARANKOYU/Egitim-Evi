# public/js/parcalar/14-odev-filtre.js

Öğrencinin (ve onun portalına bakanın) "Ödevler" ve "Sınavlar" sayfaları; öğretmenin listesiyle ortak ödev süzgeç çubuğu,
ödev serisi şeridi, yıldız, açılmamış ödev işareti ve ödev ayrıntı penceresi.

## Bu dosya ne yapar?

Bir öğrenci menüde "Ödevler"e bastığında gördüğü her şeyin iskeleti burada: üstte ödev serisi ("Arka arkaya 4 ödevi
yaptın"), altında süzgeç çubuğu (ders, yıldız, durum, son teslim aralığı), en altta "Aktif ödevler" ve "Geçmiş ödevler"
diye ayrılmış liste. Satıra basınca ödevin penceresi açılır: veriliş ve son teslim, sonuç etiketi, açıklama, öğretmenin
ekleri ve (varsa) quiz satırı. Öğrenci ödevi ilk kez açtığında sunucuya "açıldı" denir; öğretmen kontrol ekranında
"Ödev 20.05.2026 16:20 tarihinde açıldı" görür. Henüz açılmamış aktif ödev listede turuncuya çalar.

Dosyanın ikinci sayfası "Sınavlar" (`sinavlarim`): sınav grafiği, gruba bağlı olmayan sınavlar ve her sınav grubunun
tablosu (sınav, etki yüzdesi, not) ile grup ortalaması.

İki sayfa da `/api/progress`'ten beslenir ve başkasının adına da açılabilir: veli "Çocuklarım"dan çocuğunun portalına
girince, müdür ya da `ogrenci.portal` yetkili öğretmen "Portalını aç" deyince `S.viewStudentId` dolar, menüde "Ödevleri" ve
"Sınavları" çıkar, başlığın altında "<öğrencinin adı> adına görüntülüyorsun." yazar. Yıldız ve seri yalnız öğrencinin
kendisine özeldir; başkası bakarken görünmez.

Süzgeç çubuğu ve liste çizimi öğretmenle ortaktır: öğretmenin "Ödevler" sayfası (`ogr-odevler`,
[11-ogretmen-odev.md](11-ogretmen-odev.md)) aynı `odevFiltreCubugu` / `odevSonucCiz` ikilisini kullanır; yalnız `S.odevF.mod`
`'ogretmen'` olur, durum seçenekleri değişir ve satırları `odevListesiOgretmen` çizer. Öğrencinin ana sayfasındaki ödev
serisi ve "Yaklaşan ödevler" listesi de bu dosyanın işlevleriyle çizilir ([08-ana-sayfa.md](08-ana-sayfa.md)).

Ön yüz parçaları ad sırasıyla tek bir IIFE'de birleşir (`/js/app.js`, [../../../sunucu/http.md](../../../sunucu/http.md)
`birlesikOku`); buradaki `function`'lar ve `var`'lar bütün parçalara açıktır. Bu dosya yüklenirken yalnız tanım yapar
(olay dinleyicisi kurmaz).

## İçinde neler var?

### Sabit

- `ODEV_DURUMLAR` — "Durum" kutusunun seçenekleri, kipe göre:
  - `ogrenci`: Tüm durumlar, Aktif olanlar (`aktif`), Geçmiş olanlar (`gecmis`), Açılmamış (`acilmadi`), Yaptı, Geç yaptı,
    Yapmadı, Eksik, Gelmedi (izinli), Gelmedi (izinsiz) (sonuç anahtarları `yapti`, `gec`, `yapmadi`, `eksik`, `izinli`,
    `gelmedi`), Değerlendirilmedi (`notlanmadi`).
  - `ogretmen`: Tüm durumlar, Aktif olanlar, Sonuçlananlar (`sonuclandi`), Süresi dolmuş, sonuçlanmamış (`gecikti`).
  Bilinmeyen kipte öğrenci listesi kullanılır.

### Süzgeç çubuğu ve liste (öğretmenle ortak)

- `odevFiltreCubugu(list)` — `div.kart.filtre` HTML'i döner. İçinde, sırasıyla:
  - **Ders** (`select#fDers`, "Tüm dersler" + listedeki derslerin Türkçe sıralı tekil adları) — yalnız listede birden çok
    ders varsa çıkar;
  - **Yıldız** (`select#fYildiz`: Hepsi / Yıldızlı `var` / Yıldızsız `yok`) — yalnız öğrenci kipinde ve
    `odevYildizliMi()` doğruysa;
  - **Durum** (`select#fDurum`, `ODEV_DURUMLAR[S.odevF.mod]`);
  - **Son teslim başlangıç** / **Son teslim bitiş** (`input[type=date]#fBas`, `#fBit`; tarayıcının kendi tarih kutusu);
  - "Temizle" (`data-act="odev-filtre-temizle"`, karşılığı `25-tiklama.js`'te);
  - altında özet satırı `#fOzet`.
  Seçili değerler `S.odevF`'den gelir (yeniden çizimde seçimler kalır).
- `odevFiltrele(list)` — `S.odevF` ve üst çubuktaki arama kutusuna (`#araKutu`) göre süzer; liste sırasına dokunmaz:
  - ders tam eşleşme; yıldız `var` → yalnız `yildizli`, `yok` → yalnız yıldızsızlar;
  - durum: `aktif` → `status === 'active'`; `gecmis` → aktif olmayan; `sonuclandi` → `finished`; `gecikti` → aktif ve
    `teslimGecti(endAt, endTime)` (tarayıcının saatiyle); `notlanmadi` → sonucu boş olan her ödev; `acilmadi` → aktif ve
    `acildi === false`; geri kalanlar → `result` o anahtara eşit;
  - tarih: başlangıç günü yerel 00:00'a, bitiş günü yerel 23:59:59'a genişletilir; ödevin son teslim GÜNÜ (`endAt`)
    aralıkta olmalı; tarih seçiliyken son teslimi olmayan (süresiz) ödev elenir;
  - arama: ad, ders, öğretmen adı ve açıklama `nrm` ile sadeleştirilip içinde aranır ("gunes" "Güneş"i bulur).
- `odevSonucCiz()` — `#odevSonuc` yoksa hiçbir şey yapmaz. `S.odevHam`'ı süzer; `#fOzet`'e "12 ödev" ya da "12 ödevden 3
  tanesi gösteriliyor" yazar. Sonuç boşsa `bosKutu('ara', …)`: ham liste doluysa "Bu filtrelere uyan ödev yok. "Temizle"
  ile filtreleri sıfırlayabilirsin.", boşsa "Henüz ödev yok.". Değilse "Aktif ödevler (N)" ve "Geçmiş ödevler (N)"
  başlıkları (`h3.sb`) altında, kipe göre `odevListesiOgrenci` ya da `odevListesiOgretmen` ile çizer. Aktif/geçmiş ayrımı
  yalnız `status`'a bakar: süresi dolmuş ama sonuçlanmamış ödev "Aktif ödevler"de kalır.
- `odevFiltreBagla()` — `#fDers`, `#fYildiz`, `#fDurum`, `#fBas`, `#fBit` kutularının `onchange`'ini bağlar: değeri
  `S.odevF`'ye yazar, `odevSonucCiz()`. İstek atmaz; süzme tamamen tarayıcıda.
- `odevYildizliMi()` — `S.user.role === 'student' && !S.viewStudentId`: "öğrenci kendi listesine mi bakıyor". Adına
  rağmen yalnız yıldız için değil, `quizListeDurumu`'nun "kendisi mi" bilgisi için de kullanılır.

### Öğrencinin listesi

- `odevListesiOgrenci(list)` — `div.kart` içinde her ödev bir `div.satir.odev-satir.tikla-odev[data-act="odev-oku"]
  [data-id][data-ara]` (`data-ara` = ad + ders). Satırın içi:
  - kendisi bakıyorsa solda yıldız düğmesi (`button.yildiz-btn[data-act="odev-yildiz"]`, yıldızlıysa `on`;
    `aria-pressed`, `aria-label` ve `title` "Yıldızla" / "Yıldızı kaldır");
  - ad + `quizListeEtiketi(a.quiz)` ("Quiz" rozeti);
  - "Matematik · <öğretmen> · son teslim 4 Ekim 2026, Pazar · 12:00" (`tarihGunSaat`; süresiz ödevde son teslim yazmaz);
  - açıklama varsa `kisaMetin(…, 140)` ile kısaltılmış hâli;
  - `quizListeDurumu(a.quiz, odevYildizliMi())` ("Quiz: bitirdin · 8/10 (%80)" gibi);
  - sağda etiket: sonuç varsa `SONUC`'taki renk ve ad (Yaptı yeşil, Geç yaptı mavi, Eksik turuncu, Yapmadı kırmızı,
    Gelmedi (izinli) gri, Gelmedi (izinsiz) bordo); sonuçlanmış ama sonuçsuzsa gri "Değerlendirilmedi"; aktifse
    `kalanEtiketi` ("3 gün kaldı", "Bugün 12:00'e kadar", "Süresi doldu", süresizde "Aktif").
  Aktif ve `acildi === false` ise satır `.acilmadi` (turuncu zemin, adın önünde turuncu nokta) ve `title="Henüz açılmadı"`.
- `kisaMetin(s, n)` — `n`'den uzunsa ilk `n - 1` karakter + "…".

### Eylemler (`EYLEMLER`)

- `odev-yildiz` — `S.odevHam`'da ödevi bulur (bulamazsa ya da düğme zaten kilitliyse hiçbir şey); düğmeyi kilitler,
  `POST /api/assignments/<id>/yildiz { yildiz: !eski }`. Başarıda `a.yildizli` güncellenir; süzgeçte yıldız seçiliyse
  liste yeniden çizilir (satır listeden düşebilir), değilse yalnız düğmenin `on`, `aria-pressed`, `aria-label`, `title`'ı
  değişir. Hata → düğme açılır, `hataGoster` (tarayıcı uyarı kutusu). Tıklama dağıtıcısı en içteki `data-act`'ı aldığı için
  yıldıza basmak ödevi AÇMAZ.
- `odev-oku` — `S.odevHam`'da ödevi bulur (yoksa hiçbir şey) ve `modalAc(a.title, …)` ile pencereyi açar:
  - soluk satırda "ders · öğretmen";
  - "Veriliş: …" (başlangıç günü varsa), "Son teslim: **…**" ya da "Süresiz"; sağda sonuç etiketi (sonuç / gri
    "Değerlendirilmedi" / mavi "Aktif");
  - açıklama (`div.odev-aciklama`, satır sonları korunur, kısaltılmaz);
  - `ekListesiGoster(a.ekler, quizOdevSatiri(a, null))` — öğretmenin ekleri, başında quiz satırı
    ([04d-ekler.md](04d-ekler.md), [14c-quiz.md](14c-quiz.md)).
  Bakan öğrencinin kendisiyse ve ödev açılmamışsa `POST /api/assignments/<id>/acildi`; başarıda `a.acildi = true`, satırın
  turuncusu ve `title`'ı kalkar. Hata yutulur (bir dahaki açılışta yeniden denenir). Veli/müdür bakarken işaretlenmez.
  Bu eylem iki kez sarılır: önce `14b-odev-teslim.js` pencerenin altına teslim bölümünü ekler, sonra `14c-quiz.js` quiz
  satırını güncel durumla tazeler (aşağıda "Nasıl çalışır").

### Ödev serisi

- `seriSeridi(seri)` — `seri` yoksa ya da `seri.toplam` 0 ise `''`. Değilse `div.seri-serit.<iyi|uyari|bozuk>`
  (`role="status"`): alev ikonu, büyük sayı + "ödev serin", yazı:
  - bozuk: "Serin bozuldu: arka arkaya iki ödevden "Yaptı" alamadın. Bir sonraki ödevi yaparak yeniden başla.";
  - uyarı: "Dikkat! Son ödevin "Yaptı" olmadı. Bir sonrakini de yapmazsan serin bozulur.";
  - iyi: "Arka arkaya N ödevi yaptın. Böyle devam!";
  en uzun seri şimdikinden büyükse altında "En uzun serin: N". Hesap sunucuda (`odevSerisi`,
  [../../../sunucu/bolumler/ilerleyis.md](../../../sunucu/bolumler/ilerleyis.md)): sonuçlanmış ödevler son teslim sırasıyla;
  "Yaptı" seriyi artırır, başka sonuç bir kez uyarı, arka arkaya ikincisi seriyi sıfırlar.

### Sayfalar (`SAYFALAR`)

- `SAYFALAR.odevler` (adres `#/odevler`) — `api('/progress' + hedefOgrenci())` → `S.odevHam = d.assignments`,
  `S.araHook = odevSonucCiz` (üst arama kutusu bu sayfada satır gizlemek yerine listeyi yeniden süzer); başlık "ÖDEVLER"
  (başkası bakıyorsa "<ad> adına görüntülüyorsun."); `seriSeridi(d.seri)`; `odevFiltreCubugu`; boş `#odevSonuc`;
  `yaz(h)`; `odevFiltreBagla()`; `odevSonucCiz()`. Kip (`S.odevF.mod`) hep `'ogrenci'`dır (`git()` her sayfa geçişinde
  sıfırlar). İstek hata verirse `git()` sayfanın yerine kırmızı iletiyi yazar.
- `SAYFALAR.sinavlarim` (adres `#/sinavlarim`) — aynı uçtan; başlık "SINAVLAR", alt yazı başkası bakıyorsa "<ad> adına
  görüntülüyorsun.", değilse "Sınav sonuçların, grafiğin ve ortalamaların.". Ne sınav grubu ne grupsuz sınav varsa yalnız
  "Henüz sınav sonucun yok.". Değilse sırasıyla:
  - `sinavGrafigiKutusu(d.student.id)` (`28-grafik.js`) — çizgi grafiğin yer tutucusu;
  - `tekSinavKarti(d)` — grupsuz sınavlar ([13-ogrenci-veli.md](13-ogrenci-veli.md));
  - her sınav grubu için bir `div.kart[data-ara="<grup> <ders>"]`: grup adı, "ders · öğretmen", `table.t` (Sınav · Etki
    `%40` · Not; not yoksa soluk "-"; sınavın ölçeği 0–100 değilse notun yanında soluk "/ 125" gibi üst değer); altta
    "Grup ortalaması" + "100 üzerinden" ipucu, doluluk çubuğu (`.cubuk`, ortalama 0–100'e kırpılır) ve etiket (50 ve üstü
    yeşil, altı kırmızı, ortalama yoksa gri "Değer yok"; en çok iki ondalık).
  Sonra `yaz(h)` ve `ilerleyisGrafikleriniYukle([id])` (grafik `GET /api/exams/grafik?ogrenci=` ile dolar). Bu sayfa
  `S.araHook` kurmaz: üst arama kutusu `data-ara` taşıyan grup kartlarını ve grupsuz sınav satırlarını gizler/gösterir.

## Kimle konuşur?

- Çağırdıkları (hepsi aynı IIFE'de):
  - `S` (`odevF`, `odevHam`, `araHook`, `user`, `viewStudentId`, `viewStudentName`; [00-durum.md](00-durum.md));
  - `$`, `esc`, `api`, `sayiTR`, `EYLEMLER` ([01-yardimcilar.md](01-yardimcilar.md));
  - `ik` (`alev`, `yildiz`), `nrm`, `SONUC`, `teslimGecti`, `tarihGunSaat`, `kalanEtiketi` ([02-ikonlar.md](02-ikonlar.md));
  - `modalAc` ([03-mesaj-modal.md](03-mesaj-modal.md)); `ekListesiGoster` ([04d-ekler.md](04d-ekler.md));
  - `hero`, `yaz`, `bosKutu` ([07-yonlendirme.md](07-yonlendirme.md)); `SAYFALAR` (tanımı `08-ana-sayfa.js`'te);
  - `hedefOgrenci`, `tekSinavKarti`, `ilerleyisGrafikleriniYukle` ([13-ogrenci-veli.md](13-ogrenci-veli.md));
  - `quizListeEtiketi`, `quizListeDurumu`, `quizOdevSatiri` ([14c-quiz.md](14c-quiz.md)) ve `sinavGrafigiKutusu`
    (`28-grafik.js`) — bu dosyadan SONRA birleşirler; çağrılar çalışma anında olduğu için sorun olmaz;
  - `odevListesiOgretmen` (öğretmen kipinde, [11-ogretmen-odev.md](11-ogretmen-odev.md)); `hataGoster` (`25-tiklama.js`).
- Sunucu uçları:
  - `GET /api/progress[?studentId=]` — [../../../sunucu/bolumler/ilerleyis.md](../../../sunucu/bolumler/ilerleyis.md).
    Girişsiz 401; görme yetkisi yoksa 403 "Bu öğrenciyi görme yetkin yok"; istenen kişi öğrenci değilse 404 "Öğrenci
    bulunamadı". Ödev ve sınavlar bakanın seçtiği eğitim yılına süzülür; okulun kapattığı Ödevler/Sınavlar boş gelir. Bu
    dosyanın kullandığı alanlar: `assignments[]` (`id, title, description, subject, startAt, endAt, endTime, status,
    teacherName, acildi, result` — yalnız sonuçlanmışta —, `ekler, quiz`, yalnız öğrencinin kendisine `yildizli`);
    `seri` (yalnız öğrencinin kendisine: `sayi, enUzun, uyari, bozuldu, toplam`); `student.id`; `examGroups[]` (`name,
    subject, teacherName, exams[{ name, weight, grade, alt, ust }], average`); `exams`. `startTime` bu cevapta YOK.
  - `POST /api/assignments/<id>/yildiz { yildiz: true|false }` ve `POST /api/assignments/<id>/acildi` —
    [../../../sunucu/bolumler/odev.md](../../../sunucu/bolumler/odev.md). Yıldız: öğrenci değilse 403, `yildiz` boolean
    değilse 400, ödev ona verilmemişse 404. Açıldı: yalnız öğrenci, ödev ona verilmemişse 404; ilk açılış anı bir kez
    yazılır. Öğrenci olmayanın isteği öğretmen kurallarına düşer ve reddedilir (403; ödevin sahibi öğretmene 404).
  - Dolaylı: ödev penceresindeki "İndir" `GET /api/ek/bilet` ([../../../sunucu/bolumler/ekler.md](../../../sunucu/bolumler/ekler.md));
    quiz satırı `GET /api/assignments/<id>/quiz` ([../../../sunucu/bolumler/quiz.md](../../../sunucu/bolumler/quiz.md));
    teslim bölümü `/api/odev-dosya` ([../../../sunucu/bolumler/odev-dosya.md](../../../sunucu/bolumler/odev-dosya.md));
    sınav grafiği `GET /api/exams/grafik` ([../../../sunucu/bolumler/sinav.md](../../../sunucu/bolumler/sinav.md)).
- Onu kullananlar:
  - [11-ogretmen-odev.md](11-ogretmen-odev.md) — `SAYFALAR['ogr-odevler']`: `S.odevF.mod = 'ogretmen'`, `odevFiltreCubugu`,
    `S.araHook = odevSonucCiz`, `odevFiltreBagla`, `odevSonucCiz`.
  - [08-ana-sayfa.md](08-ana-sayfa.md) — öğrencinin ana sayfası: ödev bölümü açıksa `seriSeridi(d.seri)`, "Yaklaşan
    ödevler"de `odevListesiOgrenci(aktif)`.
  - [14b-odev-teslim.md](14b-odev-teslim.md) (`odevOkuIlk`) ve [14c-quiz.md](14c-quiz.md) (`quizOdevOkuOnceki`) —
    `odev-oku`'yu sarar; 14c ayrıca `S.odevHam`'daki quiz özetini günceller ve quiz sayfasındaki "Ödevlere dön" ile
    buraya döner.
  - `25-tiklama.js` — `odev-filtre-temizle`: `S.odevF`'yi kipi koruyarak boşaltır, arama kutusunu temizler, `git(S.page)`.
  - `24-bildirim-arama-mobil.js` — `araUygula`: `S.araHook` işlevse onu çağırır, değilse `[data-ara]` öğelerini gizler.
  - [07-yonlendirme.md](07-yonlendirme.md) — `git()` her geçişte `S.araHook = null`, `S.odevF` boş ve kip `'ogrenci'`;
    `sayfayiYenile()` süzgeçleri, arama kutusunu ve kaydırma yerini korur. `26-baslat.js` — `oturumDurumunuSifirla` çıkışta
    ve rol değişince `S.odevF` ve `S.odevHam`'ı sıfırlar.
  - Sayfalara götürenler: [06-menu.md](06-menu.md) (öğrencide "Ödevler" ve "Sınavlarım", portal görünümünde "Ödevleri" ve
    "Sınavları"; `SAYFA_OZELLIK`: `odevler → odev`, `sinavlarim → sinav`, okul o bölümü kapattıysa sayfa açılmaz),
    [08-ana-sayfa.md](08-ana-sayfa.md) (öğrencinin "Ödevler" ve "Sınavlarım" kutucukları), `17-takvim.js` ("Bugün teslim
    edilecek" satırı `data-nav="odevler"`), sunucunun bildirim bağlantıları (`#/odevler`: yeni ödev, sonuç, ödev güncellendi /
    dosya yükleme açıldı, quiz sonucu, "Yarın … ödevin var" hatırlatması; `#/sinavlarim`: sınav sonucu; veliye giden bağlantıyı sunucu
    `veli-odevler` / `veli-ilerleyis`'e çevirir).
  - Ekran turu `araclar/gezinti.js` (ÇALIŞTIRMA): "Ödevler (üstte ödev serisi; açılmamışlar turuncu, yıldızlı ödev)",
    süzgeç adımları (yıldızlı, açılmamış, geç yaptı), "Ödev ayrıntısı", "Ödevin ekleri", "Sınavlarım", koyu tema ve
    telefon görünümleri; öğretmen tarafında "Ödevler — süzgeç: sonuçlananlar".
- Görünüm (`public/css/parcalar/`): `08-menu-filtre.css` (`.kart.filtre`, `.filtre-satir`, `.filtre-ozet`; 640 px altında
  her kutu tam satır); `30-dokunmatik.css` (`pointer: coarse` ekranda süzgeç kutularının yazısı 16 px, iPhone odaklanınca
  sayfayı büyütmesin; küçük "Temizle" düğmesi en az 40 px yüksek); `22-cesitli.css` (`.seri-serit` ve
  `.iyi/.uyari/.bozuk`, `.seri-ikon`, `.seri-sayi`, `.seri-yazi`);
  `25-grafik-sinav.css` (`.satir.odev-satir`, `.tikla-odev`, `.satir.acilmadi` ve turuncu nokta, `.yildiz-btn` ve `.on`,
  `.odev-aciklama`); `05-tablo-grafik.css` (`.tablo-sar`, `table.t`, `.cubuk`); `04-kartlar.css` (`.kart`, `.satir`,
  `.etiket` renkleri, `.bos`); `03-iskelet.css` (`.hero`, `h3.sb`); `02-form.css` (`.field`, `.btn`, `.hint`);
  `35-quiz.css` (quiz rozetleri ve satırları).
- Rol: öğrenci (kendi ödev ve sınavları); veli (çocuğunun portalında; "Velisi olduğum" bölümü olan öğretmen ve müdür de);
  müdür ve `ogrenci.portal` yetkili öğretmen (öğrenci portalında). Süzgeç çubuğu ayrıca öğretmenin (ve müdürün) "Ödevler"
  listesinde. Velinin kendi "Ödevler" sayfası (`veli-odevler`) başka dosyadadır (`27-veli-panel.js`). Android uygulaması
  bu dosyayı kullanmaz.

## Nasıl çalışır (adım adım)?

### Sayfanın açılışı ve süzme

```
menü "Ödevler" ─► git('odevler')   (S.odevF boş, kip 'ogrenci', S.araHook null, arama kutusu boş)
SAYFALAR.odevler
  GET /api/progress[?studentId=…] ─► S.odevHam = assignments ; S.araHook = odevSonucCiz
  h = hero + seriSeridi(seri) + odevFiltreCubugu(S.odevHam) + <div id="odevSonuc">
  yaz(h) ─► araUygula ─► S.araHook() ─► odevSonucCiz   (ilk çizim)
  odevFiltreBagla()                                     (kutuların onchange'i)
  odevSonucCiz()                                        (ikinci çizim, aynı sonuç)

kutu değişti ─► S.odevF[alan] = değer ─► odevSonucCiz ─► odevFiltrele(S.odevHam) ─► "Aktif" / "Geçmiş" grupları
arama kutusuna yazıldı ─► araUygula ─► odevSonucCiz   (istek yok)
"Temizle" ─► 25-tiklama: S.odevF boşalır, arama boşalır ─► git(S.page) ─► sunucudan yeniden
```

### Satıra basınca (sarma zinciri)

```
tık .satir[data-act="odev-oku"] ─► EYLEMLER['odev-oku']  (14c'nin sarması)
   └► 14b'nin sarması
        └► bu dosya: S.odevHam'da ödevi bul ─► modalAc(başlık, tarih + sonuç + açıklama + ekler/quiz satırı)
                     öğrencinin kendisi ve açılmamışsa ─► POST /assignments/<id>/acildi ─► turuncu kalkar
        ◄ 14b: #modalGovde'ye "Teslim dosyaları" bölümü ─► GET /api/odev-dosya?odev=…
   ◄ 14c: öğrencinin kendisi + quizli ödev ─► GET /assignments/<id>/quiz ─► quiz satırı tazelenir
```

Örnek: bir öğrenci "Durum: Açılmamış" seçer. `odevFiltrele` yalnız aktif ve `acildi === false` ödevleri bırakır, özet
"9 ödevden 2 tanesi gösteriliyor" olur. Birine basınca pencere açılır, sunucuya "açıldı" gider; süzgeç kendiliğinden
yenilenmez, satır turuncusunu kaybeder ama listede kalır (bir sonraki çizime kadar).

## Dikkat!

- **Ana sayfadaki "Yaklaşan ödevler" satırları ve yıldızları çoğu zaman çalışmaz.** Öğrencinin ana sayfası listeyi
  `odevListesiOgrenci(aktif)` ile çizer ama `S.odevHam`'ı doldurmaz (`08-ana-sayfa.js`). `odev-oku` ve `odev-yildiz` ödevi
  yalnız `S.odevHam`'da arar, bulamazsa sessizce çıkar. Girişten sonra "Ödevler" sayfası henüz açılmadıysa (`S.odevHam`
  boş) satıra basmak pencere açmaz, yıldız değişmez; sayfa daha önce açıldıysa o anki (eski olabilen) veriyle çalışır,
  o arada gelen yeni ödevde yine hiçbir şey olmaz. Kod okumasına göre; tarayıcıda denenmedi, kod değiştirilmedi. Öneri:
  ana sayfa `S.odevHam = d.assignments` yazsın (ya da eylemler ödevi bulamayınca `git('odevler')` desin).
- **"Değerlendirilmedi" süzgeci aktif ödevleri de gösterir.** `notlanmadi` yalnız `!a.result`'a bakar; aktif ödevin sonucu
  da boş geldiği için süzgeç, sonuçlanmış ama sonuçsuz ödevlerin yanında bütün aktif ödevleri de listeler. Kılavuz bu
  seçeneği "Değerlendirilmedi" diye anlatıyor; büyük olasılıkla kastedilen yalnız sonuçlanmış olanlar
  (`a.status === 'finished' && !a.result`). Kod değiştirilmedi.
- **Serinin ilk sonucu "Yaptı" değilse şerit yanlış konuşur.** Öğrencinin ilk (ya da tek) sonuçlanmış ödevi Yaptı dışında
  bir sonuçsa sunucu `{ sayi: 0, uyari: false, bozuldu: false, toplam: 1 }` döner (uyarı ancak `sayi > 0` iken verilir).
  `seriSeridi` bunu "iyi" sayar: yeşil şeritte "0 ödev serin — Arka arkaya 0 ödevi yaptın. Böyle devam!" yazar.
  `testler/test-siniflarim.js` diziye "Yaptı" ile başladığı için bu durumu denemiyor. Kod okumasına göre; düzeltme
  önerisi: `seri.sayi === 0` iken şeridi hiç çizmemek ya da "Bir ödevi yaparak serine başla" demek. Kod değiştirilmedi.
- **"Veriliş" saati hiç görünmez.** Pencere `tarihGunSaat(a.startAt, a.startTime)` diyor ama `/api/progress` ödev
  nesnesinde `startTime` göndermiyor; yalnız gün yazılır. Saatli başlayan ödevde (ör. 14:00'te açılan) öğrenci saati
  göremez.
- **Pencerede süresi geçmiş ödev "Aktif" görünür.** Listedeki etiket `kalanEtiketi` ile "Süresi doldu" derken pencere,
  sonuçlanmamış her ödeve mavi "Aktif" etiketi koyar.
- **Tarih süzgeci son teslim saatine bakmaz ve tarihi UTC okur.** `new Date(a.endAt)` `'2026-10-05'` gibi bir günü UTC gece
  yarısı sayar; Türkiye'de (UTC+3) doğru gün çıkar, saati UTC'nin gerisinde olan bir ülkede bir gün önceye kayar.
  Başlangıç bitişten sonra seçilirse uyarı yok, liste boş kalır.
- **`odevler` sayfası yalnız öğrenci ya da portal görünümü içindir.** Öğrenci olmayan biri `S.viewStudentId` boşken bu
  sayfaya gelirse `/api/progress` kendi kimliğiyle gider ve sunucu 404 "Öğrenci bulunamadı" döner (sayfada kırmızı ileti).
  Bunun bilinen bir yolu: Takvim'in gün ayrıntısındaki "Bugün teslim edilecek" satırları `data-nav="odevler"` taşır
  (`17-takvim.js`). Sunucu bu listeye öğretmene kendi ödevlerini, müdüre okulun ödevlerini, veliye de şeritte seçtiği
  çocuğun ödevlerini koyuyor. Üçü de satıra basınca bu sayfaya düşer. Veli portala girmeden (`S.viewStudentId` boş)
  takvime baktığı için istek çocuğun değil velinin kimliğiyle gider ve 404 alır. Portal görünümü de sayfa yenilenince
  kaybolur (`S.viewStudentId` bellekte), aynı 404 görünür ([13-ogrenci-veli.md](13-ogrenci-veli.md)). Kod okumasına göre;
  düzeltme `17-takvim.js`'te olmalı: satır öğrencide `odevler`'e, velide `veli-odevler`'e, öğretmen ve müdürde
  `ogr-odevler`'e götürmeli.
- **Liste ilk açılışta iki kez çizilir.** `S.araHook` `yaz`'dan ÖNCE kurulduğu için `yaz` → `araUygula` listeyi bir kez
  çizer, sayfa işlevi bir kez daha. Sonuç aynıdır, yalnız boşa iş; araya bir şey eklerken sırayı bil.
- **"Temizle" sunucuya yeniden gider.** Süzgeçleri sıfırlamak için `git(S.page)` kullanılır; `25-tiklama.js`'in kipi koruması
  gereksizdir (`git` kipi zaten sıfırlar, öğretmen sayfası yeniden `'ogretmen'` yapar).
- **Yıldız ve "açıldı" yalnız öğrencinin kendisinde.** Sunucu da öyle ister (yıldızda başkasına 403; `yildizli` başkasına
  hiç gelmez). Veli/müdür bakarken açılmamış ödev yine turuncudur ("çocuk henüz açmadı" bilgisi) ama pencereyi açmak onu
  işaretlemez.
- **Ödev satırı klavyeyle açılamaz.** Satır bir `div`; `tabindex` ya da `role="button"` yok, yalnız fareyle/dokunarak açılır.
  Yıldız gerçek bir düğme olduğu için klavyeyle erişilir.
- **Liste satırında `SONUC` korumasız.** `odevListesiOgrenci` `SONUC[a.result]`'ın var olduğunu varsayar (`r.renk`); pencere
  ise önce bakar. Sunucu yalnız bilinen altı sonucu gönderdiği için bugün sorun yok; yeni bir sonuç türü eklenirse liste
  çöker.
- **Eşik ve ölçek sabit.** "Sınavlar"daki grup kartında "100 üzerinden", 0–100 kırpma ve 50 eşiği elle yazılı; aynı kural
  [13-ogrenci-veli.md](13-ogrenci-veli.md)'deki `grupOrtalamaKarti`'nda da ayrı yazılı. Sınavın alt değeri 0 değilse yalnız
  üst değer ("/ 125") gösterilir, alt değer görünmez. Sınav sonucu olmayan sayfada "Henüz sınav sonucun yok." başkası
  bakarken de "sonucun" der.
- **HTML güvenliği:** ödev adı, ders, öğretmen, açıklama, sınav ve grup adları `esc`'ten geçer; pencere başlığını `modalAc`
  kaçırır. `ODEV_DURUMLAR` ve yıldız seçeneklerinin yazıları sabit olduğu için kaçırılmadan yazılır.

## Testleri

- Bu dosyayı tarayıcıda çalıştıran bir test yok.
- `testler/buton-denetimi.js` (sunucusuz) — `odev-oku`, `odev-yildiz`, `odev-filtre-temizle` düğmelerinin karşılığı olması,
  `odevler` ve `sinavlarim` sayfalarına bir menü/kutucuk düğmesinin götürmesi. `testler/yazim-denetimi.js` metinleri tarar;
  `testler/test-kucult.js` parçaların birleşik paketinin derlendiğini denetler.
- Beslediği uçlar (sunucu tarafı, `testler/tumtest.sh` 3200'de açar):
  - `testler/test-odev-saat.js` 7b — yıldız: `/progress`'te `yildizli` gelir, yıldızlanır ve kalır, öbürleri yıldızsız,
    bozuk değer 400, olmayan ödev 404, öğretmen yıldızlayamaz (403) ve öğrencinin yıldızını görmez, yıldız kaldırılır;
    7. bölüm — öğrenci tarafında son teslim saati (`endTime`). Aynı dosyanın "BAŞLAMA SAATİ" bölümü başlama saatini
    (`startTime`) yalnız öğretmenin `GET /api/assignments` listesinde dener; `/api/progress`'te olmadığı denenmiyor
    (Dikkat'teki "Veriliş saati").
  - `testler/test-sinav.js` 6. bölüm — açılmamış ödev `acildi === false`, öğrenci açınca öğretmen açılma anını görür, ilk
    açılış değişmez, öğrenci olmayan "açıldı" diyemez (403); 5. bölüm — `/progress`'te grupsuz sınavlar ve grup ortalaması.
  - `testler/test-siniflarim.js` 2. bölüm — seri adım adım (Yaptı artırır, tek kaçırma uyarır, ikinci kaçırma bozar), en uzun
    seri, seri veliye gitmez.
  - `testler/test-quiz.js` (doğru şık `/progress`'e sızmaz), `testler/test-ozellikler.js` (ödev kapalıyken `assignments`
    boş), `testler/test-veli-coklu.js`, `testler/test-yonetim.js`, `testler/test-nakil.js` (kim kimin ilerleyişini görür).
- Elle (3200): `testler/seed.js`'teki bir öğrenciyle gir → "Ödevler": açılmamış ödev turuncu; birine bas, pencereyi kapat,
  turuncu kalkmış olmalı; bir ödevi yıldızla, "Yıldız: Yıldızlı" seç; üst arama kutusuna dersin adını Türkçe harfsiz yaz;
  "Temizle". "Sınavlarım"da grafik ve grup tablosu. Müdürle "Öğrenciler" → "Portalını aç" → "Ödevleri": yıldız ve seri
  görünmemeli.

## Son durum

- `git log`: 5 commit. Dosya 26 Eylül'de art arda üç commit'le kuruldu: `fc44576 commit 370` (2026-09-26; aynı commit'te
  `sunucu/veri/sema/017-odev-yildizi.sql` ve depo değişikliğiyle ödev yıldızı): `ODEV_DURUMLAR`, `odevFiltreCubugu` (yıldız
  süzgeci dahil), `odevFiltrele`, `odevSonucCiz`; `84a262a commit 371`: `odevYildizliMi`, `odevFiltreBagla`,
  `SAYFALAR.odevler`, `odevListesiOgrenci` (yıldız düğmesi, turuncu açılmamış satır), `odev-yildiz`, `kisaMetin`, `odev-oku`
  (açıldı işareti); `dea6f4b commit 372`: `SAYFALAR.sinavlarim`.
- `98e66b2 commit 445` (2026-09-26): yalnız `seriSeridi` işlevi eklendi (17 satır; ödev serisi şeridi: iyi / uyarı / bozuk,
  en uzun seri). `SAYFALAR.odevler`'deki `h += seriSeridi(d.seri)` çağrısı commit 371'den beri vardı.
- Son değişiklik `3b8fd36 commit 519` (2026-09-27, quiz): listede ödev adının yanına `quizListeEtiketi`, satırın altına
  `quizListeDurumu(a.quiz, odevYildizliMi())`; pencerede `ekListesiGoster(a.ekler, quizOdevSatiri(a, null))` (ekler
  listesinin başında quiz satırı).
- Bilinen açıklar (kod değiştirilmedi): ana sayfadaki "Yaklaşan ödevler"in `S.odevHam`'a bağlı kalması, "Değerlendirilmedi"
  süzgecinin aktifleri de alması, ilk sonucu "Yaptı" olmayan öğrencide "0 ödev — Böyle devam!", görünmeyen veriliş saati,
  pencerede süresi geçmiş ödevin "Aktif" etiketi, Takvim'den öğretmenin, müdürün ve portal dışındaki velinin bu sayfaya
  düşüp 404 alması (Dikkat).
- Planlı işlerden bu dosyaya dokunması beklenenler (`.claude/gelistirme/DEVAM.md` 4. bölüm):
  - "Optimizasyon + saklama süreleri" — öğrenci/veli yalnız aktif ve bir önceki yılı görür (`/api/progress` daha eski yıl
    için açık hata döner); quiz 1 yıl sonra silinir, ödevde "Quiz 1 yıl sonra silindi" gibi bir iz görünecek (liste ve
    pencerenin quiz satırı).
  - "Mesaj ayarları … ödev hatırlatma otomasyonu" — ödevin penceresine "Hatırlat" (varsayılan kural + ödev başına seçenek)
    gelecek; `odev-oku`'nun açtığı pencere değişir.
  - "Düzenleyiciler" — ödev açıklaması ortak yazı düzenleyicisiyle (izinli HTML) yazılacak: pencerede `esc` + düz metin
    gösterimi ve listedeki `kisaMetin` kısaltması HTML'e göre yeniden yazılmalı.
  - "Anket düzenleyici" — taslak anket ödeve eklenebilecek (hedef ödevin öğrencileri); pencerede quiz satırı gibi bir anket
    satırı beklenir.
  - "Sınav: formüllü ölçüm … sınav grubu üst değeri (ör. 125), yüzde/katkı puanı" (öneri, onay bekliyor) — "Sınavlar"daki
    sabit "100 üzerinden", 0–100 kırpma ve 50 eşiği gruba göre değişecek.
  - "Tek kişi tek hesap + portallar öğrencide de" — öğrenci birden çok kurumda portal sahibi olacak; `odevYildizliMi`'nin
    "rol öğrenci mi" denetimi ve `/api/progress`'in kurum seçimi gözden geçirilmeli.
  - "Çok dil" (bütün metinler), "Üst şerit sadeleştirme" (arama kutusu portalda kalıyor; `S.araHook` düzeni korunmalı),
    "Android yerel uygulama" (öğrencinin ödev listesi aynı `/api/progress`'i kullanacak), "Ekran turu + albüm" (bu
    sayfaların görüntüleri baştan çekilecek).
