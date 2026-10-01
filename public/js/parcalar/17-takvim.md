# public/js/parcalar/17-takvim.js

"Takvim" sayfasının ön yüzü: ay ızgarası (tatil, özel gün, ödev teslimi, okul etkinliği, sınav, toplantı işaretleri ve
günün ders sayısı), bir güne basınca açılan gün ayrıntısı ve yetkilinin "Takvime ekle" penceresi.

## Bu dosya ne yapar?

Okulda herkes "bu ay neler var?" diye sorar: 23 Nisan tatil mi, matematik ödevi ne zaman teslim, veli toplantısı hangi
gün? Bu dosya o soruların cevabını tek bir ay tablosunda gösterir. Takvimin kendisi (hangi gün tatil, hangi ödev kime
görünür, kim etkinlik ekleyebilir) sunucuda hazırlanır
([../../../sunucu/bolumler/takvim.md](../../../sunucu/bolumler/takvim.md)); bu dosya yalnız çizer ve düğmeleri bağlar.

Üç parçası var:

1. **Ay görünümü** (`SAYFALAR.takvim`): üstte ay adı, ‹ › ile ay değiştirme, "Bugün", yıl seçici ve (yetkiliyse)
   "Etkinlik ekle"; altında Pazartesi'yle başlayan 7 sütunlu ızgara. Her gün bir düğmedir: gün numarası, o gün kaç ders
   olduğu ("6 ders"), en çok 4 renkli nokta (her olay için bir nokta, üstüne gelince başlığı) ve tatil ya da özel günse adı
   ("Ulusal Egemenlik ve Çocuk Bayramı"). Haftasonu, tatil, bugün ve seçili gün ayrı renkte.
2. **Gün ayrıntısı** (`takvimGunCiz`): bir güne basınca ızgaranın altında o günün olayları (tatil, özel gün, okul
   kayıtları; yetkiliye "Kaldır" düğmesiyle), o gün teslim edilecek ödevler, sonraki günlerde bitecek ödevler ve o günün
   ders programı tablosu.
3. **"Takvime ekle" penceresi** (`takvimEtkinlikModal`): müdür ya da `takvim.yonet` yetkilisi başlık, tür (Etkinlik,
   Tatil, Sınav, Toplantı), başlangıç, isteğe bağlı bitiş ve açıklamayla okulun takvimine kayıt ekler.

Takvim kimin gözünden? Öğrenci kendininkini görür. Veli (portala girmeden) şeritten seçtiği çocuğun, seçmediyse ilk
çocuğunun takvimini görür. Öğretmen ya da müdür bir öğrencinin portalını açtıysa o öğrencinin takvimini ("Takvimi"),
açmadıysa kendi takvimini (kendi verdiği ödevler, kendi programı; müdürde okulun bütün ödevleri, ders sayısı yok) görür.
Servisçi de menüsünden takvimi açar; ona yalnız özel günler, tatiller ve okulun kayıtları gelir (ödev ve ders yok).

Bu dosyanın düğmelerinin (‹ ›, Bugün, güne basma, Ekle, Kaldır) karşılığı kendi içinde değil, ortak tıklama dosyası
`25-tiklama.js`'teki `islem()` işlevindedir; aşağıda onları da anlatıyorum.

## İçinde neler var?

### Sabitler

- `AY_ADLARI` — `['Ocak', …, 'Aralık']`. Ay başlığında ("Nisan 2026") ve gün ayrıntısında kullanılır; `23-veli-ayarlar.js`
  de doğum tarihini yazarken ("12 Mart 2011 (15 yaşında)") bunu kullanır. ([02-ikonlar.md](02-ikonlar.md)'deki `AY_ADI`
  ile aynı liste; iki ayrı kopya.)
- `GUN_BASLIK` — ızgaranın sütun başlıkları: `Pzt Sal Çar Per Cum Cmt Paz`.
- `OLAY_AD` — gün ayrıntısındaki tür etiketleri: `tatil` "Tatil", `ozel` "Özel gün", `odev` "Ödev", `etkinlik`
  "Etkinlik", `sinav` "Sınav", `toplanti` "Toplantı". (`odev` bugün kullanılmıyor: sunucu gün ayrıntısında ödevleri
  olaylara değil ayrı listelere koyar.)

### Durum (`S` üzerinde, [00-durum.md](00-durum.md))

- `S.takvimYil`, `S.takvimAy` — gösterilen ay. İlk açılışta tarayıcının yerel saatine göre bugünün yılı ve ayı yazılır.
- `S.takvimSecili` — seçili gün (`'2026-04-23'`) ya da boş. Doluysa sayfa her çizilişte o günün ayrıntısını da açar.

Üçü de `S`'nin ilk tanımında yok, ilk kullanımda oluşur; çıkışta ve portal değişiminde sıfırlanmaz (`26-baslat.js`
`oturumDurumunuSifirla` bunlara dokunmaz). Aynı sekmede sonra giren kişi takvimi kaldığı ayda açar; veriler zaten
sunucudan yeniden gelir.

### İşlevler

- `takvimOgrenciParam()` — istek adresine eklenecek `&studentId=<kimlik>` ya da `''`. Kural (dosyadaki yorum):
  öğrenci olmayan biri bir öğrencinin portalındaysa (`S.viewStudentId`) o öğrenci; rolü `parent` ise şeritte seçili
  çocuk (`veliSeciliCocuk()`), o da yoksa ilk çocuk (`S.children[0]`); başka durumda boş (kişinin kendi takvimi).
  Öğrencide hiçbir zaman parametre eklenmez.
- `SAYFALAR.takvim()` — ay görünümü (aşağıda adım adım). `GET /api/takvim?yil=&ay=` + `takvimOgrenciParam()`;
  cevabı (`{ yil, ay, basSutun, bugun, yonetebilir, ogrenci, gunler }`) çizer. Başlık "TAKVIM"; alt yazı, cevapta
  `ogrenci` varsa ve kişi öğrenci değilse (portalda ya da veliyse) "<ad> adına görüntülüyorsun.", değilse "Ödev teslim
  tarihleri, dersler, tatiller ve okul etkinlikleri.". Veli portalda değilse başlığın altına çocuk şeridi
  (`veliCocukSeridi()`, iki ve daha çok çocukta görünür) gelir.
  - Üst çubuk: `‹` (`data-act="takvim-ay" data-yon="-1"`), ay başlığı, `›` (`data-yon="1"`), "Bugün"
    (`takvim-bugun`), yıl seçici `select#takvimYilSec` (gösterilen yılın 3 öncesi ile 3 sonrası) ve `yonetebilir` ise
    "Etkinlik ekle" (`takvim-etkinlik-ekle`). Yıl seçici değişince `S.takvimYil` yazılır ve sayfa yeniden açılır
    (`git('takvim')`); ay aynı kalır.
  - Izgara: 7 başlık (Cmt ve Paz `haftasonu`), ayın ilk gününe kadar `basSutun` kadar boş hücre
    (`.takvim-hucre.bos`), sonra her gün için `<button class="takvim-hucre [haftasonu] [tatil] [bugun] [secili]"
    data-act="takvim-gun" data-tarih="YYYY-AA-GG">`: `gun-no`, `dersSayisi` varsa `gun-ders` ("3 ders"), `gun-isaretler`
    içinde olayların ilk 4'ü için `span.isaret.<tür>` (`title` = başlık), ve olaylardan ilk tatil ya da özel günün adı
    (`gun-etiket`).
  - Açıklama satırı (lejant): Ödev teslimi, Tatil, Özel gün, Etkinlik, Sınav.
  - Sonda `div#takvimGun` (gün ayrıntısının yeri); `S.takvimSecili` doluysa `takvimGunCiz` hemen çağrılır.
- `takvimGunCiz(tarih)` — `#takvimGun` yoksa hiçbir şey yapmaz. Önce "Yükleniyor..." kartı; sonra
  `GET /api/takvim/gun?tarih=` + `takvimOgrenciParam()`. Kart başlığı "23 Nisan 2026 · Perşembe" (gün adı sunucudan).
  İçerik sırasıyla:
  - **Olaylar** (`d.olaylar`: o günün sabit özel günleri, dinî bayram günleri ve okulun kayıtları; ödevler burada
    değil): her satırda tür etiketi (`OLAY_AD`), başlık, varsa açıklama; olay `silinebilir` (okulun kendi kaydı) ve
    `d.yonetebilir` ise "Kaldır" (`data-act="takvim-etkinlik-sil" data-id`).
  - **"Bugün teslim edilecek"** (`d.teslim`): ödev başlığı, ders, "saat 12:00", ödev sonuçlandıysa "· sonuçlandı". Satır
    `data-nav="odevler"` taşır, basınca Ödevler sayfası açılır. Ödev yoksa "Bu gün teslim edilecek ödev yok.".
  - **"Önümüzdeki 7 gün"** (`d.yaklasan`, varsa): başlık, ders, "25 Nisan Cumartesi · 09:20". Sunucu tarihe göre
    sıralı en çok 10 ödev gönderir; fazlası görünmez. Bu satırlar tıklanmaz.
  - **"O günün dersleri"** (`d.dersler`, varsa): Saat / Ders / Sınıf / Öğretmen tablosu.
  - Hata olursa kartın içinde kırmızı ileti (sayfa bozulmaz). İşlev `api` sözünü döner (`25-tiklama.js` bunu döndürür).
- `takvimEtkinlikModal()` — "Takvime ekle" penceresi: `#tkBaslik` (100 harf, örnek "Veli toplantısı"), `#tkTur`
  (`etkinlik`, `tatil`, `sinav`, `toplanti`), `#tkTarih` (varsayılan seçili gün, yoksa bugün), `#tkBitis` (isteğe
  bağlı), `#tkAciklama` (300 harf), ileti yeri `#tkMesaj`; altta "Vazgeç" (`modal-kapat`) ve "Ekle"
  (`takvim-etkinlik-kaydet`). Tarih kutuları tarayıcının `type="date"` kutusudur.

### Düğmelerin karşılığı (`25-tiklama.js` → `islem()`)

- `takvim-ay` — `S.takvimAy`'a `data-yon` eklenir; 0 olursa önceki yılın Aralık'ı, 13 olursa sonraki yılın Ocak'ı.
  Seçili gün temizlenir, `git('takvim')`.
- `takvim-bugun` — yıl ve ay yerel saatle bugüne, seçili gün `new Date().toISOString().slice(0, 10)` (UTC'ye göre
  bugün; "Dikkat!"e bak), `git('takvim')`.
- `takvim-gun` — `S.takvimSecili = data-tarih`; ızgara yeniden çizilmez, yalnız eski hücrenin `secili` sınıfı alınıp
  basılana verilir; `takvimGunCiz` çağrılır.
- `takvim-etkinlik-ekle` — `takvimEtkinlikModal()`.
- `takvim-etkinlik-kaydet` — düğme kapanır; `POST /api/takvim/etkinlik { baslik, tur, tarih, bitis, aciklama }`
  (kutuların değerleri olduğu gibi; denetim sunucuda). Başarıda pencere kapanır, sayfa yeniden açılır ve üstte yeşil
  "<başlık> takvime eklendi."; hatada düğme açılır, ileti pencerede (`#tkMesaj`).
- `takvim-etkinlik-sil` — tarayıcı onayı "Bu kayıt takvimden kaldırılsın mı?"; `POST /api/takvim/etkinlik-sil { id }`,
  sonra `git('takvim')` (seçili gün korunduğu için ayrıntı da yenilenir). Hata tarayıcının uyarı kutusuyla
  (`hataGoster`).

## Kimle konuşur?

- Parçalar ad sırasıyla tek bir IIFE'de birleşir (`/js/app.js`; [../../../sunucu/http.md](../../../sunucu/http.md)
  `birlesikOku`); bu dosyadaki adlar bütün parçaların ortak alanındadır. Çağırdıkları:
  - `S` ([00-durum.md](00-durum.md)); `$`, `esc`, `api` ([01-yardimcilar.md](01-yardimcilar.md)); `gunAdi`
    ([02-ikonlar.md](02-ikonlar.md)); `modalAc` ([03-mesaj-modal.md](03-mesaj-modal.md)); `hero`, `yaz`, `git`
    ([07-yonlendirme.md](07-yonlendirme.md)); `SAYFALAR` ([08-ana-sayfa.md](08-ana-sayfa.md) tanımlar);
    `veliSeciliCocuk`, `veliCocukSeridi` (`27-veli-panel.js`; bu dosyadan sonra birleşir ama sayfa açılırken çağrıldığı
    için sorun yok).
- Sunucu uçları ([../../../sunucu/bolumler/takvim.md](../../../sunucu/bolumler/takvim.md)):
  - `GET /api/takvim?yil=&ay=&studentId=` — ay görünümü; `yonetebilir` = `takvim.yonet`.
  - `GET /api/takvim/gun?tarih=&studentId=` — gün ayrıntısı (`olaylar`, `teslim`, `yaklasan`, `dersler`, `gunAdi`).
  - `POST /api/takvim/etkinlik` — yalnız `takvim.yonet` (müdürde her zaman); `tarih` `YYYY-AA-GG`, başlık zorunlu, bitiş
    başlangıçtan önce olamaz. Geçmiş eğitim yılına bakan personel 409 alır ([../../../sunucu/api.md](../../../sunucu/api.md)
    arşiv kapısı).
  - `POST /api/takvim/etkinlik-sil { id }` — aynı yetki; başka okulun kaydı 404. Arşiv kapısı (409) bu uca da uygulanır.
  - Geçersiz ya da izinsiz `studentId` hata vermez: sunucu kişinin kendi takvimini döner.
- Onu kullananlar:
  - `25-tiklama.js` — `takvimGunCiz`, `takvimEtkinlikModal`, `S.takvimYil/Ay/Secili` (düğmeler yukarıda).
  - `23-veli-ayarlar.js` — `AY_ADLARI` (`dogumMetni`).
  - Menü ([06-menu.md](06-menu.md)): öğrenci, veli, öğretmen, müdür ve servisçi menüsünde "Takvim"; bir öğrencinin
    portalında "Takvimi". Rolsüz yetişkin hesabının menüsünde yok (sunucu da ona 403 verir). `26-baslat.js` servisçinin
    açılış sayfası olarak `takvim`'e izin verir. Takvim okulun kapatabileceği bir bölüm değildir (`SAYFA_OZELLIK`'te
    yok).
  - [04e-tarih-secici.md](04e-tarih-secici.md) aynı `/api/takvim` ucunu kendi başına çağırır; bu dosyaya bağlı değildir.
- CSS: `public/css/parcalar/21-takvim.css` — `.takvim-ust`, `.takvim-baslik`, `.takvim-izgara` (7 sütunlu ızgara),
  `.takvim-gun-basligi` (`.haftasonu`), `.takvim-hucre` (`.bos`, `.haftasonu`, `.tatil`, `.bugun`, `.secili`), `.gun-no`,
  `.gun-ders`, `.gun-etiket`, `.gun-isaretler`, `.isaret` (`.odev` turuncu, `.tatil` ana renk, `.ozel` mavi, `.etkinlik`
  yeşil, `.sinav` kırmızı, `.toplanti` mor), `.takvim-lejant`, `.gun-olaylar`, `.olay-satir` / `.olay-tur` (tatil, özel
  gün, sınav, etkinlik renkli), `.alt-baslik`; 720 px altında hücreler küçülür, gün etiketi ve ders sayısı gizlenir.
  Yıl seçicinin `.tarih-kutu`'su ve tıklanır satır `.satir.tiklanir` `20-devamsizlik.css`'te; ders tablosunun
  `.rapor-kaydir` / `.rapor-tablo`'su `18-aktarim-kvkk.css`'te.
- Rol: görüntüleme — öğrenci, veli, öğretmen, müdür, servisçi; ekleme ve kaldırma — müdür ve `takvim.yonet` verilmiş
  öğretmen (hazır şablonlardan "Müdür Yardımcısı"nda var).

## Nasıl çalışır (adım adım)?

```
menü "Takvim" ─► git('takvim') ─► SAYFALAR.takvim
   S.takvimYil/Ay boşsa bugünün yılı/ayı
   GET /api/takvim?yil=2026&ay=4[&studentId=…]   ◄─ takvimOgrenciParam (portal / velinin çocuğu)
   hero + (veliyse çocuk şeridi) + üst çubuk + ızgara + lejant + #takvimGun ─► yaz()
   S.takvimSecili varsa ─► takvimGunCiz

kişi 23'e basar ─► 25-tiklama: takvim-gun ─► S.takvimSecili='2026-04-23', hücre "secili"
   takvimGunCiz ─► GET /api/takvim/gun?tarih=2026-04-23 ─► olaylar · teslim · yaklaşan · dersler

‹ / › ─► takvim-ay ─► ay ±1 (yıl taşar), seçili gün silinir ─► git('takvim')
Bugün ─► takvim-bugun ─► yıl/ay = bugün, seçili gün = bugün ─► git('takvim')

yetkili "Etkinlik ekle" ─► takvimEtkinlikModal ─► "Ekle"
   POST /api/takvim/etkinlik ─► pencere kapanır ─► git('takvim') ─► "Veli toplantısı takvime eklendi."
gün ayrıntısında "Kaldır" ─► onay ─► POST /api/takvim/etkinlik-sil ─► git('takvim')
```

## Dikkat!

- **"Bugün" düğmesi gece yarısından sonraki üç saatte dünü seçer.** `takvim-bugun` seçili günü
  `new Date().toISOString().slice(0, 10)` ile yazar; bu UTC tarihidir. Türkiye saatiyle (UTC+3) 00:00–02:59 arasında
  dünün tarihi seçilir; ayın 1'inde bu saatlerde ızgara yeni ayı gösterirken seçili gün önceki ayın son günü olur
  (hücresi ekranda yok, ayrıntı kartı o günü anlatır). "Takvime ekle" penceresinin varsayılan tarihi de aynı yolla
  yazılır. Yıl ve ay ise yerel saatle doğru. Kod okumasına göre; denenmedi.
- **Öğretmen, müdür ve portalsız veli için ödev satırı hataya götürür.** "Bugün teslim edilecek" satırları
  `data-nav="odevler"` taşır; Ödevler sayfası (`SAYFALAR.odevler`, [14-odev-filtre.md](14-odev-filtre.md))
  `GET /api/progress`'i `studentId`'siz çağırır. Öğrencide ve bir öğrencinin portalında doğru çalışır; ama kendi
  takvimine bakan öğretmen ya da müdür ve portala girmemiş veli o sayfada "Öğrenci bulunamadı" hatası görür (sunucu
  bakanın kendisini öğrenci sanar, [../../../sunucu/bolumler/ilerleyis.md](../../../sunucu/bolumler/ilerleyis.md)).
  Kod okumasına göre; denenmedi. Düzeltme önerisi: satırı role göre öğretmenin "Ödevler"ine (`ogr-odevler`), müdürün
  "Ödevler"ine (`ders-odevleri`), velinin "Ödevler"ine (`veli-odevler`) yönlendirmek.
- **Velide "Hepsi" seçiliyken takvim yalnız ilk çocuğundur.** Çocuk şeridinde "Hepsi" seçili görünür ama
  `takvimOgrenciParam` seçili çocuk yoksa `S.children[0]`'ı gönderir; başlık "<ilk çocuğun adı> adına görüntülüyorsun."
  der. Öbür çocuğun takvimi için şeritten onu seçmek gerekir.
- **Yıl seçici seçili günü silmez.** `takvim-ay` seçili günü temizler, yıl seçici temizlemez: yıl değişince ızgara yeni
  yılı gösterir ama altta eski yılın seçili gününün ayrıntısı yeniden açılır.
- **"Bugün teslim edilecek" başlığı sabit.** Hangi güne basılırsa basılsın başlık "Bugün" der; içerik seçilen günün
  teslimleridir. "Önümüzdeki 7 gün" listesi de sunucunun saat dilimine göre 6 gün olabilir (sunucu Türkiye saatindeyse;
  [../../../sunucu/bolumler/takvim.md](../../../sunucu/bolumler/takvim.md) "Dikkat!") ve en çok 10 satırdır.
- **Lejantta "Toplantı" yok.** Toplantı kaydı ızgarada mor noktayla çizilir (`.isaret.toplanti`), ama açıklama
  satırında karşılığı yazmaz; gün ayrıntısında da "Toplantı" etiketi renksiz (gri) kalır, çünkü `21-takvim.css`'te
  `.olay-satir.toplanti` yok.
- **Başlık "TAKVIM".** `hero('TAKVIM', …)` noktalı büyük İ olmadan yazılmış ("TAKVİM" olmalı); öteki sayfalar
  ("DEVAMSIZLIĞIM", "ETÜTLER") Türkçe büyük harf kullanır. Yalnız görünüş.
- **Tür etiketi kaçırılmadan basılıyor.** Gün ayrıntısında `OLAY_AD[o.tur] || o.tur` doğrudan HTML'e girer (sınıf
  adındaki `esc(o.tur)` dışında). Sunucu okul kaydının türünü dört değerle sınırladığı için bugün tehlikesiz; yeni bir
  tür eklenirse `OLAY_AD`'a da eklenmeli ya da `esc` konmalı.
- **Çok günlük kayıt tek kayıttır.** "Kaldır" o kaydın bütün günlerini birden kaldırır (tek `id`).
- **Ödevler ay görünümünde nokta, gün ayrıntısında ayrı listede.** Sunucunun `gun` ucu ödevleri `olaylar`'a koymaz;
  `teslim`/`yaklasan` olarak verir. Ay görünümünde ise ödev de bir olaydır (turuncu nokta) ve dört nokta sınırına girer:
  çok kalabalık bir günde bazı olaylar yalnız gün ayrıntısında görünür.
- Etkinlik penceresinde istemci denetimi yok; boş başlık, ters tarih gibi hatalar sunucudan Türkçe iletiyle döner
  ("Başlık yaz", "Bitiş tarihi başlangıçtan önce olamaz").
- `takvimOgrenciParam` velide `S.children` ve şeridi kullanır; veli yetkisi sunucuda denetlenir, adres elle
  değiştirilse de başkasının çocuğu açılmaz.
- Çıkışta takvim durumu sıfırlanmaz (yukarıda "Durum"); bir güvenlik sorunu değil, yalnız görünüm hatırlanır.

## Testleri

- Bu dosyanın tarayıcıda çalışan bir testi yok. Sunucu tarafı:
  - `testler/test-takvim.js` — ay görünümündeki sabit özel günler ve dinî bayram, Pazartesi'yle başlayan hafta, okul
    etkinliği ekleme/silme ve yetki, ters tarih aralığı, öğrencinin günü, ders programının takvime düşmesi, velinin
    çocuğunun takvimi, geçersiz girdi.
  - `testler/test-odev-saat.js` — takvimde ve gün ayrıntısında ödevin saati.
  - `testler/test-ozellikler.js` — okulda ödev kapalıyken takvimde ödev yok.
  - `testler/yetki-denetimi.js` — takvimi müdür, öğretmen, öğrenci, veli ve servisçi görür; etkinliği yalnız müdür ekler.
    `testler/girdi-denetimi.js` — etkinlik başlığına bozuk/kötü niyetli girdi (500 ya da sızıntı yok).
    `testler/test-giris-kayit.js` 6. bölüm — rolsüz hesap `/api/takvim`'den 403 alır.
- `testler/buton-denetimi.js` (sunucusuz, `tumtest.sh` sonunda) — bu dosyanın ürettiği `takvim-ay`, `takvim-bugun`,
  `takvim-gun`, `takvim-etkinlik-ekle`, `takvim-etkinlik-kaydet`, `takvim-etkinlik-sil` eylemlerinin `25-tiklama.js`'te
  karşılığı, `data-nav="odevler"`'in tanımlı bir sayfaya gitmesi ve `/api/takvim` yolunun sunucuda olması. (Bu dosya
  adresi değişkenle kurar — `api(yol)` —; denetçi yalnız düz yazılmış `api('/…')` çağrılarını gördüğü için `takvim`
  yolunu `25-tiklama.js`'teki `api('/takvim/etkinlik', …)`'ten ve `04e-tarih-secici.js`'ten tanır.)
- `testler/yazim-denetimi.js` — ekrandaki Türkçe metinler; `testler/test-kucult.js` — birleşik `app.js`'in (bu dosya
  dahil) yorumsuz hâliyle derlenmesi.
- `araclar/gezinti.js` ekran turu (test değil) takvim sayfasının, "Takvime ekle" penceresinin ve gün ayrıntısının
  görüntüsünü alır.
- Elle: `testler/seed.js`'in kurduğu müdür hesabıyla gir → Takvim → "Etkinlik ekle" → "Veli toplantısı", tür
  Toplantı → Ekle; ızgarada o güne mor nokta düşmeli, güne basınca satırda "Kaldır" görünmeli. Öğrenci hesabıyla aynı
  güne bas: kayıt görünür, "Kaldır" görünmez. Nisan 2026'ya git: 23 Nisan hücresi tatil renginde ve adıyla.

## Son durum

- `git log`: 2 commit. Son değişiklik `5540278 commit 366` (2026-09-26): `takvimGunCiz` eklendi (80 satır) — gün
  ayrıntısı kartının bütünü (olaylar ve "Kaldır", "Bugün teslim edilecek", "Önümüzdeki 7 gün", "O günün dersleri",
  hata kartı). Ondan önceki hâlde hem sayfa işlevi hem `25-tiklama.js`'teki `takvim-gun` eylemi bu işlevi çağırıyordu ama
  hiçbir parçada tanımlı değildi. Aynı commit `14b-odev-teslim.js`'e de ekleme yaptı.
- Dosyanın ilk hâli `8d01607 commit 120` (2026-08-29; 143 satır): sabitler, `takvimOgrenciParam`, ay görünümü,
  `takvimEtkinlikModal`. Aynı commit `25-tiklama.js`'i (543 satır) getirdi.
- Bilinen açıklar (kod değiştirilmedi): UTC'ye göre "bugün", öğretmen/müdür/portalsız velide ödev satırının hataya
  götürmesi, velide "Hepsi"nin ilk çocuğu göstermesi, yıl seçicinin seçili günü silmemesi, lejantta toplantının olmaması,
  "TAKVIM" yazımı.
- Planlı işlerden bu dosyaya dokunacak olanlar:
  - "Mesaj ayarları (çark), Bu mesajı bildir, Ajanda, sınav planlama, duyurudan ajanda+hatırlatıcı, ödev hatırlatma
    otomasyonu": Takvim sayfasında ay görünümünün ALTINA bir Ajanda gelecek (Bugün / Bu hafta / Sonra; Ödev · Sınav ·
    Duyuru · Özel gün/tatil · Toplantı · Etkinlik · Hatırlatıcılarım süzgeç kutucukları); planlanan sınavlar ızgaraya
    "Sınav" türüyle düşecek; duyurudan alıcıların ajandasına kayıt eklenebilecek.
  - "Toplantılar" (veli toplantısı ajandaya girer) ve "Düzenleyiciler" (takvim etkinliği açıklaması ortak yazı
    düzenleyiciyle yazılacak) bu sayfanın penceresini ve listesini değiştirecek.
  - "Çalışan olarak ekleme": rolsüz çalışanın portalında da Takvim olacak; `takvimOgrenciParam` ve başlıktaki rol
    koşulları yeni role göre gözden geçirilmeli.
  - "Optimizasyon + saklama süreleri": öğrenci ve veli eski eğitim yılını (takvim dahil yıl parametreli uçlarda)
    isteyemeyecek; öğretmen ve müdür isteyebilecek.
