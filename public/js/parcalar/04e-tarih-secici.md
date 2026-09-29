# public/js/parcalar/04e-tarih-secici.js

Ödev tarihleri için Türkçe, Pazartesiyle başlayan açılır ay takvimi (`tarihAlani`) ve yarım saatlik saat listesi
(`saatAlani`); günlerin üstünde tatil, okul etkinliği ve öteki ödevlerin son günü işaretli, altta o günün kısa ajandası.

## Bu dosya ne yapar?

Tarayıcının kendi `<input type="date">` kutusu dile göre "mm/dd/yyyy" gösterebiliyor, görünümü tarayıcıdan tarayıcıya
değişiyor ve öğretmene "o gün ne var" demiyor. Bu dosya onun yerine şunu verir (tasarımda örnek alınan, okulların
bildiği K12net düzeni):

- Kutuda tarih `08.09.2025` biçiminde, yanında soluk gün adı ("Pazartesi") ve takvim simgesi.
- Basınca bir ay takvimi açılır: ‹ Eylül 2025 ›, solda ISO hafta numarası, altı hafta (önceki/sonraki ayın günleri soluk),
  tatil günü marka renginde ve kalın (hafta sonu günleri `hs` sınıfı alır ama bugün CSS'te bu sınıfın kuralı yok, ayrı
  renkte görünmez).
- Her günün altında küçük noktalar: tatil, okul etkinliği, o gün biten öteki ödevler.
- Takvimin altında üzerine gelinen ya da seçilen günün ajandası: "4 Eylül 2026, Cuma · 3 dersin var · Ödev Oran orantı
  (Matematik) · Etkinlik Veli toplantısı".
- "Son teslim başlangıçtan önce olamaz" gibi bir alt sınır verilebilir; önceki günler basılamaz.
- Klavye: oklar gün/hafta, PageUp/PageDown ay, Enter seçer, Esc kapatır.

Veri takvim ucundan ay ay gelir (`GET /api/takvim?yil=&ay=`) ve bellekte saklanır.

Bugün bu seçiciyi yalnız öğretmenin/müdürün "Yeni ödev" ve "Ödevi düzenle" pencereleri kullanıyor. Doğum tarihi için ayrı,
gün/ay/yıl açılır listeli seçici var: [04a-form-alanlari.md](04a-form-alanlari.md).

## İçinde neler var?

### Durum ve küçük yardımcılar

- `TS` — `{ hedef, ay, odak, veri, yukleniyor }`: açık takvimin bağlı olduğu gizli kutunun kimliği (yoksa `null`),
  gösterilen ay (`YYYY-AA`), klavye odağındaki gün (`YYYY-AA-GG`), ay → gün → takvim verisi önbelleği, yüklenmekte olan
  aylar.
- `TS_GUN_KISA` — `Pzt Sal Çar Per Cum Cmt Paz`.
- `tsIki`, `tsIso(d)` (yerel tarihten `YYYY-AA-GG`), `tsTarih(iso)` (yerel gece yarısı `Date`), `tsGunEkle(iso, n)`,
  `tsBugun()`, `tsKisa(iso)` (`GG.AA.YYYY`), `tsDugmeYazi(iso)` (kutudaki yazı; boşsa soluk `gg.aa.yyyy`), `tsHafta(d)` (ISO
  hafta numarası).

### Alanlar

- `tarihAlani(id, deger, sec)` — HTML döner:
  `<div class="tarih-alan" data-tarih-alan="<id>" [data-min="…"]>` + gizli `<input id="<id>" value="YYYY-AA-GG">` +
  `<button class="tarih-dugme" id="<id>Dugme" data-act="tarih-ac" data-id="<id>" aria-haspopup="dialog"
  aria-expanded="false">`. `sec.min` ya başka bir tarih alanının kimliği ("son teslim, başlangıçtan önce olamaz":
  `{ min: 'mBas' }`) ya da sabit bir `YYYY-AA-GG`. Okuyan kod değeri yine `$('mBit').value` ile alır.
- `saatAlani(id, deger)` — `<select class="saat-sec">`, 00:00'dan 23:30'a yarım saatlik 48 seçenek. Listede olmayan eski
  bir değer (ör. `12:10`) en başa seçili seçenek olarak eklenir, kaybolmaz.
- `tsSonrakiYarim()` — şimdiki saatin bir sonraki yarım saati (18:54 → 19:00; en çok 23:30). Yeni ödevin başlama saati
  varsayılanı.
- `tsEnErken(kap)` — alanın en erken seçilebilir günü (`data-min`'den), yoksa `''`.

### Takvim kutusu

- `tsAyVerisi(ay)` — o ayın verisi yoksa ve yüklenmiyorsa `api('/takvim?yil=…&ay=…')`; gelen `gunler` dizisini tarihe göre
  saklar, takvim hâlâ o aydaysa yeniden çizer. Hata olursa ayı boş (`{}`) sayar.
- `EYLEMLER['tarih-ac']` — aynı alanın takvimi açıksa kapatır (aç/kapa). Değilse açık başka takvimi kapatır; odak günü:
  kutudaki değer, yoksa bugün (alt sınır bugünden sonraysa alt sınır). Alanın içine `<div class="tarih-kutu" role="dialog"
  aria-label="Tarih seç">` ekler, çizer, günü odaklar. Kutu pencerenin (ya da ekranın) sağ kenarından taşıyorsa `saga`
  sınıfıyla sağa hizalanır.
- `tsCiz(odakla)` — ayın verisini ister (`tsAyVerisi`), başlığı, 6×7 gün ızgarasını, ajandayı ve alt düğmeleri (Bugün ·
  Temizle · Tamam) çizer. Her gün bir `<button class="tk-gun" data-act="tarih-sec" data-id="YYYY-AA-GG">`; sınıflar:
  `diger` (başka ay), `bugun`, `secili` (+ `aria-selected`), `hs` (Cumartesi/Pazar), `tatil`, `odak`; alt sınırdan önceki
  günler `disabled`. Erişilebilir ad: "4 Eylül 2026, Cuma, tatil, 2 ödevin son günü, 1 etkinlik". Noktalar yalnız gösterilen
  ayın günlerinde. Klavye için yalnız odak günü sekme sırasında (`tabindex="0"`), öteki günler `-1`. "Bugün" düğmesi alt
  sınırdan önceyse devre dışı.
- `tsAjanda(t)` — günün başlığı + ders sayısı ("3 dersin var") + olaylar (`Ödev` başlık (ders), `Tatil` ad, `Etkinlik` ad);
  boş gün "· boş gün", veri yükleniyorsa "· yükleniyor".
- `EYLEMLER['tarih-ay']` — ‹ › ile ay değiştirir; odak günü yeni ayda aynı gün (ay kısaysa son gün).
- `tsDegerYaz(t)` — gizli kutuya yazar, düğmenin yazısını günceller, kutuda `change` ve `input` olaylarını (kabarcıklı)
  tetikler.
- `EYLEMLER['tarih-sec']` — güne ya da "Bugün"e basınca değeri yazar, o güne ve ayına geçer; kutu AÇIK kalır.
- `EYLEMLER['tarih-temizle']` — değeri boşaltır, kutu açık kalır.
- `EYLEMLER['tarih-kapat']` ("Tamam") ve `tsKapat(odakGeriDon)` — kutuyu kaldırır, `aria-expanded="false"`, istenirse odağı
  tarih düğmesine geri verir, `TS.hedef = null`.

### Belge düzeyinde dinleyiciler (dosya yüklenince bir kez)

- `keydown` (yakalama evresinde): takvim açıkken Esc kapatır (olayın başka dinleyicilere gitmesini durdurur), PageUp/
  PageDown ay değiştirir; odak ızgaradaysa oklar ±1 gün / ±7 gün.
- `mouseover`: takvimde bir günün üstüne gelince ajanda o günü gösterir.
- `click`: takvim açıkken `.tarih-alan` dışına tıklanırsa kapanır.

## Kimle konuşur?

- Çağırdıkları: `$`, `esc`, `api`, `EYLEMLER` ([01-yardimcilar.md](01-yardimcilar.md)); `ik('takvim')`, `AY_ADI`,
  `tarihGun`, `gunAdi` ([02-ikonlar.md](02-ikonlar.md)).
- Sunucu: `GET /api/takvim?yil=&ay=` ([../../../sunucu/bolumler/takvim.md](../../../sunucu/bolumler/takvim.md)) → `gunler:
  [{ tarih, tatil, dersSayisi, olaylar: [{ tur: 'tatil'|'ozel'|'odev'|<okul kaydı türü>, baslik, aciklama }] }]`. Ödevde
  `aciklama` dersin adıdır. Öğretmen kendi verdiği ödevleri ve kendi programını, müdür okulun bütün ödevlerini görür;
  `dersSayisi` kişinin ders programından o haftanın gününe düşen ders sayısıdır. Bu dosya `tur`'u üçe ayırır: `odev`, `tatil`, geri kalan her şey
  (özel gün, sınav, toplantı, etkinlik) "Etkinlik".
- Onu kullananlar: yalnız `11-ogretmen-odev.js` — "Yeni ödev" (`tarihAlani('mBas', bugün)` + `saatAlani('mBasSaat',
  tsSonrakiYarim())`, `tarihAlani('mBit', '', { min: 'mBas' })` + `saatAlani('mBitSaat', '12:00')`) ve "Ödevi düzenle"
  (`odBas`/`odBasSaat`, `odBit` + `{ min: 'odBas' }`/`odSaat`). Değerleri `25-tiklama.js` ve `11-ogretmen-odev.js` okuyup
  `/api/assignments`'a gönderir ([../../../sunucu/bolumler/odev.md](../../../sunucu/bolumler/odev.md): başlangıç günü son
  günden sonra olamaz, aynı gün biten ödevde başlama saati bitişten önce olmalı — asıl denetim orada). Ayrıca
  `27b-aile.js` küçük yardımcılar `tsIki` ve `tsIso`'yu kullanır.
- Tıklamalar: `data-act`'lar `25-tiklama.js`'teki `islem()` üzerinden `EYLEMLER`'e gelir. Bu dosyanın belge `click`
  dinleyicisi paket yüklenirken, `tiklamaKur`'unkinden önce kurulur; bu yüzden bir güne basınca önce "dışarı mı tıklandı"
  denetimi (gün hâlâ kutunun içinde), sonra `tarih-sec` çalışır.
- Değer yazılınca tetiklenen `input`/`change` olayları [04a-form-alanlari.md](04a-form-alanlari.md)'deki "düzeltmeye
  başlayınca hatayı kaldır" dinleyicisini de çalıştırır.
- CSS: `public/css/parcalar/32-tarih-secici.css` — `.tarih-alan`, `.tarih-dugme`, `.tarih-yazi`, `.tarih-bos`, `.tarih-gun`,
  `.tarih-simge`, `.tarih-kutu` (+ `.saga`), `.tk-ust`, `.tk-ok`, `.tk-izgara`, `.tk-bas`, `.tk-hf`, `.tk-gun` (`.diger`,
  `.tatil`, `.bugun`, `.secili`, `.odak`, `:disabled`), `.tk-isaret` (noktaların renkleri
  `.tarih-kutu i.tatil/.etkinlik/.odev` kuralında, yani `.tarih-kutu` sınıfına bağlı), `.tk-ajanda`, `.tk-tur`, `.tk-alt`,
  `.saat-sec`, `.odev-tarihler`, `.gizli-etiket`, `.zorunlu`; 560 px ve altında takvim ekranın altından açılan bir panel
  olur (`position: fixed; bottom: 0`). `.tk-gun.hs` (hafta sonu) için kural yok; CSS'teki `.tk-anahtar` kuralını da hiçbir
  kod kullanmıyor.
- Rol: ödev verme yetkisi olan öğretmen ve müdür.

## Nasıl çalışır (adım adım)?

```
"Yeni ödev" ─► tarihAlani('mBit', '', { min: 'mBas' })
  [ gg.aa.yyyy   (takvim) ]  <input type="hidden" id="mBit" value="">
tıklama ─► islem ─► EYLEMLER['tarih-ac'](el, 'mBit')
   TS.hedef = 'mBit', TS.odak = max(bugün, mBas), TS.ay = '2026-10'
   <div class="tarih-kutu" role="dialog"> ─► tsCiz(true)
        tsAyVerisi('2026-10') ─► GET /api/takvim?yil=2026&ay=10 ─► TS.veri['2026-10'] ─► tsCiz yeniden
   ‹ Ekim 2026 ›
       Pzt Sal Çar Per Cum Cmt Paz      (ilk sütun hafta numarası, başlığı boş)
   40  28  29  30  01  02  03  04       (Eylül günleri soluk; mBas'tan önceki günler basılamaz)
   …                   •           •    (nokta: tatil / etkinlik / ödev)
   [ 5 Ekim 2026, Pazartesi · 3 dersin var · Ödev Oran orantı (Matematik) ]
   [Bugün] [Temizle] [Tamam]
güne basma ─► EYLEMLER['tarih-sec'] ─► tsDegerYaz: mBit = '2026-10-05', düğme "05.10.2026 Pazartesi",
              change + input olayları ─► kutu açık kalır
Tamam / Esc / dışarı tıklama ─► tsKapat
kaydet ─► $('mBit').value + $('mBitSaat').value ─► POST /api/assignments
```

## Dikkat!

- **`tarih-kutu` sınıf adı başka iki ekranla çakışıyor (görünür hata).** `17-takvim.js` Takvim sayfasının yıl seçimini
  (`<select id="takvimYilSec" class="tarih-kutu">`) ve `18-devamsizlik.js` yoklama tarih kutusunu (`<input type="date"
  id="yoklamaTarih" class="tarih-kutu">`) aynı sınıfla çiziyor; biçimleri `20-devamsizlik.css`'teki `.tarih-kutu` kuralında.
  Birleşik `style.css`'te `32-tarih-secici.css` daha sonra geldiği için bu dosyanın açılır kutusuna ait kural
  (`position: absolute; width: 328px; top: calc(100% + 6px); z-index: 60`; 560 px altında `position: fixed; bottom: 0`) o
  iki kutuya da uygulanıyor. Parça CSS'leri sırayla birleştirip başsız Edge'de ölçüldü: iki kutu da masaüstünde
  `position: absolute`, 328 px; telefon genişliğinde `position: fixed`, `bottom: 0` — yani Takvim'deki yıl seçimi ve
  yoklamadaki tarih kutusu telefonda ekranın altına yapışır, masaüstünde yerinden kayar. Aynı çakışma JavaScript'te de
  var: bu dosya kutusunu `document.querySelector('.tarih-kutu')` ile arıyor; tarih seçici bir gün Takvim ya da yoklama
  sayfasındayken açılırsa ilk bulunan öğe o sayfanın kutusu olur ve `tsKapat` onu SİLER (bugün seçici yalnız ödev
  pencerelerinde olduğu için bu ikinci kısım yaşanmıyor). Kod değiştirilmedi; düzeltme: bu dosyadaki sınıfı (JS + CSS)
  örneğin `tk-kutu` yapmak. `commit 502` benzer bir çakışmayı (`bos` → `tarih-bos`) zaten düzeltmişti.
- **Ay önbelleği çıkışta ve portal değişiminde silinmiyor.** `TS.veri` sayfa yenilenene kadar yaşar; `cikisYap` ve
  `oturumDurumunuSifirla` (`26-baslat.js`) ona dokunmaz, çıkışta sayfa da yenilenmez. Aynı sekmede bir öğretmen çıkıp
  başka bir öğretmen girerse, öncekinin baktığı ayların noktaları ve ajandası (ödev başlıkları, ders adları, ders
  sayısı, okulun etkinlikleri) sonrakinin takviminde görünür. Aynı kişi başka okuldaki portala geçtiğinde de eski okulun
  tatil/etkinlikleri kalır. Kod değiştirilmedi; düzeltme: `oturumDurumunuSifirla`'da `TS.veri = {}; TS.yukleniyor = {};`.
- **Önbellek oturum içinde de tazelenmez.** Takvimde yeni bir etkinlik ya da yeni verilen ödev, sayfa yenilenene kadar
  noktalarda görünmez; bir ay bir kez hata verdiyse boş kalır, yeniden denenmez.
- **Klavyeyle alt sınırın öncesine gidilince odak kaybolur (kod okumasına göre).** Oklar `TS.odak`'ı alt sınıra bakmadan
  kaydırır; odaklanacak gün `disabled` ise `focus()` çalışmaz, eski düğme de yeniden çizimde silindiği için odak sayfaya
  düşer ve sonraki ok tuşları ızgaraya ulaşmaz (fareyle bir güne basmak ya da PageDown ile açık bir aya geçmek odağı geri
  getirir). Aynı şey ‹ › ve "Temizle" düğmelerinde de olur: onlar `tsCiz(false)` ile çizer, basılan düğme silinir ve
  odak belgeye düşer; klavyeyle gezen kişi yeniden takvime sekmelidir. Tarayıcıda denenmedi.
- **Alt sınır yalnız görünümdedir.** Önce son teslimi seçip sonra başlangıcı ileri alan kişi ters sıralı tarih gönderebilir;
  sunucu bunu reddeder ("Son tarih başlangıçtan önce olamaz").
- **Yıldızlı (zorunlu) tarihler aslında zorunlu değil.** "Yeni ödev" penceresinde "Başlama tarihi *" ve "Son tarih *"
  yazar, ama ne `25-tiklama.js` (`odev-kaydet`) ne "Ödevi düzenle" (`odev-duzelt-kaydet`) ne de sunucu boş tarihi
  reddeder. `Temizle` ile boşaltılan son tarih ödevi "süresiz" kaydeder (sunucuda `odevBitisAni` `null`, ödev hiç
  gecikmez; [../../../sunucu/bolumler/odev.md](../../../sunucu/bolumler/odev.md)). Kod değiştirilmedi; yıldız istenen
  davranışsa kaydetmeden önce boşluk denetimi eklenmeli, süresiz ödev isteniyorsa yıldız kaldırılmalı.
- **Aynı anda tek takvim.** `TS` tek bir hedef tutar; yeni açılan takvim öncekini kapatır.
- **Esc yakalama evresinde durdurulur** (`stopPropagation`). Takvim açıkken Esc'e basınca olay başka dinleyicilere gitmez;
  ileride pencereye Esc ile kapanma eklenirse ilk Esc yalnız takvimi kapatır, pencere açık kalır.
- **Üzerine gelme ajandası dokunmatik ekranda yoktur**; telefonda ajanda odaklanan/seçilen günü gösterir.
- **Saat ve gün cihazın yerel saatine göre** (`new Date()`); "bugün" ve `tsSonrakiYarim` telefonun saatiyle hesaplanır.
  Takvimin `bugun` alanı ise sunucudan gelir; bu dosya onu kullanmaz.
- PageUp/PageDown ay değiştirirken takvim iki kez çizilir (`tarih-ay` + `tsCiz(true)`); zararsız, odak için.

## Testleri

- Bu dosyanın doğrudan (tarayıcılı) testi yok.
- `testler/test-takvim.js` — takvim ucunun ay görünümü: resmî ve dinî tatiller (23 Nisan, bayramın günlere yayılması,
  arife), özel gün (18 Mart tatil değil), hafta sonları, okul etkinlikleri (çok günlü, sınav haftası, toplantı), ödevin
  teslim tarihinin takvimde görünmesi, Pazartesi ders sayısı, veli ve öğrencinin kapsamı. Seçicinin noktaları ve ajandası
  bu cevaptan gelir.
- `testler/test-odev-saat.js` — ödevin saati: saatsiz ödev 12:00, verilen saat korunur, geçersiz saat 12:00 olur, geçmiş
  ödevin "gecikti" işareti (seçicinin gönderdiği değerlerin sunucudaki karşılığı).
- `testler/buton-denetimi.js` — `tarih-ac`, `tarih-ay`, `tarih-sec`, `tarih-temizle`, `tarih-kapat` eylemlerinin karşılığı.
- `testler/test-kucult.js` (paket derleniyor mu), `testler/yazim-denetimi.js`.
- Elle: öğretmenle "Yeni ödev ver" → "Son tarih" düğmesi → takvim açılmalı, başlangıçtan önceki günler soluk ve basılamaz;
  bir tatil gününde marka renginde (kırmızı) nokta, ajandada "Tatil"; oklarla gezin, Enter ile seç, Esc ile kapat. Telefon genişliğinde
  takvim alttan açılmalı. (Çakışmayı görmek için: telefon genişliğinde Takvim sayfasını aç — yıl seçimi ekranın altına
  yapışır.)

## Son durum

- `git log`: 4 commit, hepsi 2026-09-26. Son değişiklik `8d203dd commit 502`: boş tarih yazısının sınıfı `bos` →
  `tarih-bos` (genel `.bos` boş-durum kutusu kuralıyla çakışıyordu) ve sağ kenardan taşan takvimin `saga` sınıfıyla sağa
  hizalanması (CSS'te `.tarih-kutu.saga`). Ondan önce `9cc4eb8 commit 458`: ay değiştirme, değer yazma, `tarih-sec`,
  `tarih-temizle`, `tarih-kapat`, klavye/üzerine gelme/dışarı tıklama dinleyicileri; `5b77c52 commit 457`: `tsKapat`,
  `tarih-ac`, `tsHafta`, `tsCiz`, `tsAjanda`. İlk hâl `cfe3da0 commit 456` (ödevin başlama saati şema dosyası
  `025-odev-baslama-saati.sql` ile birlikte): `TS`, yardımcılar, `tarihAlani`, `saatAlani`, `tsSonrakiYarim`, `tsEnErken`,
  `tsAyVerisi`. `commit 458` tarih alanlarını `11-ogretmen-odev.js`'in formlarına da bağladı ve `32-tarih-secici.css`'i
  başlattı (21 satır); CSS'in geri kalanı (takvim kutusu, ızgara, ajanda, telefon düzeni) `4a44753 commit 459`'da geldi.
  `.tarih-kutu` çakışması o committe doğdu: yoklama ve Takvim sayfaları bu sınıfı `commit 38`/`39`'dan (2026-08-28) ve
  `commit 120`'den (2026-08-29) beri kullanıyordu.
- Bilinen açıklar (kod değiştirilmedi): `tarih-kutu` sınıf çakışması (görünür), çıkışta silinmeyen ay önbelleği, klavye
  odağının alt sınırda ve yeniden çizimde kaybolması, yıldızlı ama zorunlu olmayan tarihler, CSS'i olmayan `hs` (hafta
  sonu) sınıfı.
- Planlı işlerden bu dosyaya dokunması beklenenler: "Mesaj ayarları, … Ajanda, sınav planlama, duyurudan ajanda +
  hatırlatıcı, ödev hatırlatma otomasyonu" — sınav açarken tarih/başlangıç saati, duyurudan "ajandaya ekle" (tarih, saat)
  ve hatırlatıcı zamanı seçimi isteyecek; bu seçicinin yeni kullanıcıları olurlar (tarih seçiciyi Takvim sayfasına taşımak
  yukarıdaki sınıf çakışmasını JavaScript'te de ortaya çıkarır — önce düzeltilmeli). "Toplantılar" (toplantı tarihi,
  ajandaya girer) ve "Düzenleyiciler … ileri tarihli gönderim" de tarih/saat seçimi getiriyor. "Çok dil" ay/gün adlarını ve
  `gg.aa.yyyy` biçimini dile göre değiştirecek.
