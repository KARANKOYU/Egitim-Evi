# public/js/parcalar/19e-servis-konum.js

Servisin canlı haritası (öğrenci, veli ve yönetim için: okul, ev, sefer sürerken araç; kendiliğinden yenilenir; evin
yerini işaretleme; okula/eve git, servisi takip et) ve servisçinin telefonundan sefer konumu gönderimi (izleme, nabız,
ekran kilidi, durum kutusu, sürdür/bitir).

## Bu dosya ne yapar?

İki tarafı olan tek bir iş: servisçinin telefonu konumunu yollar, veli de aracı haritada görür.

- **Görenler (öğrenci, veli, yönetim).** Servis sayfasındaki "Servisin nerede?" / "Servis haritası" kartı ve yönetimin
  öğrenci başına "Harita" penceresi bu dosyadan çizilir. Harita `GET /api/servis/harita`'dan okulu, öğrencinin evini ve
  sefer sürüyorsa aracın son konumunu alır, [19d-harita.md](19d-harita.md)'deki `haritaKur` ile çizer ve kendini
  tazeler: sefer varken 5 saniyede, servis saatindeyken 30 saniyede, saat dışında 2 dakikada bir. Altında durum satırı
  ("Servis yolda (okula gidiş) · konum 12 sn önce · eve yaklaşık 850 m · 3. sırada, önünde 1 öğrenci"), Google Haritalar
  bağlantıları, "Okula git / Eve git / Servisi takip et" düğmeleri ve evin yerini işaretleme durur. Ev işaretliyse
  sunucu, araç eve 500 m ve 100 m kala öğrencinin kendisine ve velilerine birer bildirim gönderir (sabah henüz binmemiş
  ve "binmeyecek" denmemiş, akşam "Geldi" işaretli öğrenci için; GPS doğruluğu 150 m'den kötüyse gitmez). Neyin
  görüneceğine (aracın konumu yalnız servis saatinde ve son 3 dakikada geldiyse) sunucu karar verir; bu dosya yalnız
  çizer.
- **Servisçi.** Sefer, servisçinin Yoklama sayfasından başlar (`19i-servis-yoklama.js`: sabah "Seferi başlat" ya da ilk
  "Bindi", akşam "Başlat"). O sayfa `seferIzlemeyiBaslat`'ı çağırır; bu dosya telefonun konumunu izler, en sık 5
  saniyede bir, araç dursa da 20 saniyede bir `POST /api/servis/konum`'a yollar, ekran kararmasın diye ekran kilidi
  ister ve sayfadaki "sefer durumu" kutusunu yazar. Sunucu seferi kapatınca (409) gönderim durur. Tarayıcı arka planda
  konum vermez: sayfa açık ve ekran açık kalmalı (telefon uygulaması bunu arka planda ayrıca yapar).

## İçinde neler var?

### Görenlerin haritası

- `SERVIS_YENILE_MS = 5000` — sefer sürerken yenileme aralığı.
- `servisHarita` — tek açık haritanın durumu: `{ h` (haritaKur nesnesi), `kap` (kutunun kimliği), `ogrenciId` (veli ve
  yönetim için; öğrencide `''`), `veri` (son harita cevabı), `sayac` (zamanlayıcı), `secim` (işaretlenmekte olan ev),
  `secimAcik` (ev seçme kipi) `}`; ayrıca sonradan eklenen `takip` ("Servisi takip et" açık mı).
- `mesafeMetre(a, b)` — iki nokta arası metre (haversine, Dünya yarıçapı 6.371 km). Servisçi tarafındaki "30 m kıpırdadı
  mı" hesabı da bunu kullanır.
- `mesafeYaz(m)` — 1 km altı 10 metreye yuvarlanır ("850 m"), üstü bir ondalık ("1,2 km"; `sayiTR`).
- `kacSaniyeOnce(iso)` — "12 sn önce", "3 dk önce".
- `servisHaritasiDurdur()` — zamanlayıcıyı durdurur, haritayı `yokEt`'ler, `veri`, `secim`, `secimAcik`'ı sıfırlar
  (`kap`, `ogrenciId` ve `takip` kalır). Servis sayfası her açılışta önce bunu çağırır.
- `servisHaritasiAc(kapId, ogrenciId)` — önce durdurur; `#kapId` içine üç kutu yazar: `#<kapId>Alan` (`.harita-kap`,
  haritanın kendisi), `#<kapId>Bilgi` (`.harita-bilgi`, durum ve düğmeler), `#<kapId>Mesaj` (iletiler). `haritaKur`'u
  `etiket: 'Servis haritası'` ve ev seçme kipinde dokunulan yeri `secim`'e yazan `tiklaninca` ile kurar, ilk veriyi ister
  (`servisHaritasiYenile(true)`). Kutu yoksa eski haritayı durdurmuş ve `kap`/`ogrenciId`'yi yazmış olarak başka bir
  şey yapmadan döner. Kullanılan kimlikler: sayfada `servisHaritaKart`,
  yönetim penceresinde `servisHaritaModal`.
- `servisHaritasiYenile(ilk)` — `GET /api/servis/harita[?ogrenci=<id>]`. Cevap gelince harita hâlâ aynı kutudaysa
  `veri`'yi yazar, `servisHaritasiCiz(ilk)` (ilk açılışta işaretlere sığdırır), cevapta `bugun` varsa servis kartının
  "bugün" bölümünü de tazeler (`servisBugunGuncelle`, [19c-okul-hayati.md](19c-okul-hayati.md)) ve sonraki yenilemeyi
  kurar. Hata `#<kapId>Bilgi`'de kırmızı ileti olur, yenileme yine kurulur (bilgi kutusu sayfadan gittiyse hiçbir şey
  yapılmaz, yenileme de kurulmaz).
- `servisHaritasiZamanla()` — süre `servisHarita.veri`'ye (son BAŞARILI cevaba) göre: `sefer` varsa 5 sn; `bugun` var ve
  canlı değilse 120 sn; öteki durumlarda (canlı ama sefer yok, servis yok, henüz hiç cevap yok) 30 sn. Hata `veri`'yi
  silmez: bir yenileme hata verirse sonraki deneme önceki cevaba göre 5 sn / 30 sn / 2 dk sonra olur; ilk istek hata
  verdiyse 30 sn. Zaman gelince: kutu sayfadan gittiyse ya da başka kutuya geçildiyse haritayı durdurur; sekme arka
  plandaysa (`document.hidden`) ya da ev seçiliyorsa istek atmadan yeniden kurar; değilse yeniler.
- `servisHaritasiCiz(sigdir)` — işaretler: okul (konumu girildiyse, "Okul"), ev ("Ev"; ev seçme kipinde seçilen nokta
  `secim` türüyle), sefer sürüyor ve konum tazeyse araç (`servis`, etiketi plaka ya da "Servis"). "Takip" açıksa araca
  ortalar, değilse ilk açılışta `sigdir`. Sonra bilgi kutusu:
  - **Ev seçme kipi:** "Haritada evinin olduğu yere dokun." / "Seçtiğin yer işaretlendi. Doğruysa kaydet." + **Kaydet**
    (seçim yokken kapalı), **Bulunduğum yeri kullan**, **Vazgeç**.
  - **Normal:** "Okula git" (okul konumu varsa), "Eve git" (ev varsa), araç varsa "Servisi takip et" / "Servis takipte"
    (`aria-pressed`); durum satırı (öğrencinin servisi yoksa "<ad> bir servise kayıtlı değil."; sefer + araç: canlı nokta,
    "Servis yolda (okula gidiş|eve dönüş) · konum 12 sn önce · eve yaklaşık 850 m" + sıra; sefer var ama konum yok:
    "Sefer başladı; aracın konumu birkaç dakikadır gelmiyor."; servis saati dışında: "Aracın yeri yalnız servis
    saatlerinde görünür: sabah …, akşam …."; canlı ama sefer yok: "Şu an sefer yok. Servis yola çıkınca aracın yeri burada
    görünür."); Google Haritalar bağlantıları ("Servisi …", "Evi …"); `evDuzenleyebilir` ise "Evimi işaretle" ya da
    "Evin yerini değiştir" ve "Ev işaretini sil"; ev yoksa "İşaretlersen servis eve 500 m ve 100 m kala bildirim gelir.";
    okulun konumu yoksa "Okulun konumu henüz girilmedi (okul yönetimi Ayarlar'dan girer)." Sıra yazısı
    `servisSiraYazisi(b, '', false)` ile ([19c-okul-hayati.md](19c-okul-hayati.md)).
- `EYLEMLER['ev-sec']` / `['ev-vazgec']` — ev seçme kipini açar/kapatır (seçimi siler), bilgi kutusunu yeniden çizer.
  Kip açıkken otomatik yenileme istek atmaz.
- `EYLEMLER['ev-buradayim']` — tarayıcı konum veremiyorsa ya da bağlantı güvenli değilse (`isSecureContext`) "Bu tarayıcı
  konumu veremiyor (güvenli bağlantı gerekir). Haritada dokunarak seç."; değilse `getCurrentPosition` (yüksek doğruluk,
  15 sn, 30 sn'lik önbellek). Gelen nokta seçim olur, harita oraya 17. düzeyde ortalanır; doğruluk 100 m'den kötüyse "Konum
  yaklaşık 240 m hassas; gerekirse haritada düzelt."; hata/izin yoksa "Konum alınamadı. Konum iznini ver ya da haritada
  dokunarak seç."
- `EYLEMLER['ev-kaydet']` — `POST /api/servis/ev { ogrenciId?, enlem, boylam }` (öğrencide `ogrenciId` gönderilmez,
  sunucu kendi kimliğini kullanır); başarıda kip kapanır, "Ev konumu kaydedildi." ve harita yeniden okunur.
- `EYLEMLER['ev-sil']` — `confirm('Ev işareti silinsin mi? Servis yaklaşma bildirimi gelmez olur.')` →
  `POST /api/servis/ev { ogrenciId?, sil: true }` → "Ev konumu silindi." ve yeniden okuma.
- `EYLEMLER['servis-harita-cocuk']` — velinin çocuk düğmeleri: basılanı öne alır (öbürlerine `gri`),
  `S.servisHaritaCocuk = id` (sayfa yeniden çizilince aynı çocuk kalsın) ve haritayı o çocukla yeniden açar.
- `EYLEMLER['servis-harita-modal']` — yönetim: "<öğrenci adı> — servis haritası" penceresi, `#servisHaritaModal` içinde
  aynı harita (yönetim evi işaretleyebilir).
- `servisBildirimOnerisi()` — Servis sayfası için söz döner: telefon bildirimi destekleniyor, izin reddedilmemiş ve bu
  cihazda abonelik yoksa "Servis yaklaşınca haber al" kartı (`.bildirim-oneri`; açıklama "uygulama kapalıyken de bildirim
  gelir"; **Bildirimleri aç** `data-act="bildirim-ac"`, ileti kutusu `#bildirimAyarMesaj`), yoksa `''`. `bildirimDestegi`,
  `mevcutAbonelik` ve düğmenin eylemi [04b-bildirim-izni.md](04b-bildirim-izni.md)'de.

### Servisçinin konum gönderimi

- `SEFER_GONDER_MS = 5000` — iki gönderim arasında en az bu kadar (zorlanmadıkça).
- `SEFER_NABIZ_MS = 20000` — araç dursa da en geç bu aralıkla son konum yeniden gider (sunucu 3 dakikadan eski konumu
  haritada göstermez, 45 dakika konum gelmeyen seferi kapatır).
- `S._sefer` — süren gönderimin durumu: `{ id, servisId, yon, izle (watchPosition kimliği), nabiz (setInterval), kilit
  (ekran kilidi), son: { enlem, boylam, dogruluk }, sonGonderim, basariZaman, gonderiliyor, hata }`.
- `seferIzlemeyiBaslat(sefer)` — `{ id, servisId, yon }` alır. Önce varsa eskisini durdurur; tarayıcıda konum yoksa
  `Error('Bu telefon ya da tarayıcı konum veremiyor.')` fırlatır. `navigator.geolocation.watchPosition` (yüksek doğruluk,
  `maximumAge` 5 sn, `timeout` 20 sn): her yeni konumda `son` yazılır; önceki konumdan 30 metreden fazla uzaklaşıldıysa ve
  son gönderimden 2 sn geçtiyse beklemeden (zorla) gönderilir, değilse normal (5 sn kuralıyla) denenir; ardından
  servisçinin sayfasındaki "Sen" işareti yeniden çizilir (`seferBenCiz`, `19i`). Konum hatasında: izin yoksa (kod 1)
  "Konum izni verilmedi. Telefonun ayarlarından bu siteye konum izni ver.", değilse "Konum alınamıyor (GPS kapalı ya da
  sinyal yok)."; durum kutusu yazılır. 5 saniyelik nabız son gönderimden 20 sn geçtiyse zorla gönderir. Ayrıca sayfa
  görünür olunca ekran kilidini yenileyen dinleyiciyi ekler ve ilk kilidi ister.
- `seferKonumGonder(zorla)` — son konum yoksa, gönderim sürüyorsa ya da (zorlanmadıysa) 5 sn dolmadıysa hiçbir şey
  yapmaz. `POST /api/servis/konum { seferId, enlem, boylam, dogruluk }`. Başarı: hata temizlenir, `basariZaman`, durum
  kutusu. 409 (sefer bitti, saat bitti, servis başkasına verildi, bilinmeyen sefer): `seferiDurdur()`; servisçi ana
  sayfadaysa (Yoklama) sayfayı yeniden açar ve sunucunun iletisini gösterir. 429 sessizce geçilir; öteki hatalar durum
  kutusuna yazılır.
- `seferiDurdur()` — konum izlemeyi, nabzı, ekran kilidini ve görünürlük dinleyicisini bırakır, `S._sefer = null`.
- `seferKilitAl()` / `seferKilitTazele()` — `navigator.wakeLock.request('screen')` (destek varsa ve sayfa görünürse).
  Tarayıcı kilidi sayfa gizlenince kendisi bırakır; sayfa yeniden görünür olunca yeniden istenir. Sefer bu arada
  değiştiyse alınan kilit hemen bırakılır.
- `seferDurumCiz()` — sayfadaki her `.sefer-durum` kutusunu yazar (`19i` `#seferDurum_<servis>` olarak koyar): bu
  telefonun seferi değilse "Sefer açık ama bu telefondan konum gitmiyor."; hata varsa kırmızı (`.hata-yazi`); konum henüz
  yoksa "Konum bekleniyor..."; değilse canlı nokta + "Konum gönderiliyor · okula gidiş · son gönderim 3 sn önce · ±8 m"
  ve kutuya `canli` sınıfı.
- `EYLEMLER['sefer-surdur']` — sayfa yenilenmiş ya da telefon değişmişken sunucuda açık kalan sefer için ("Konum
  göndermeyi sürdür", `19i` çizer; `data-id` sefer, `data-servis`, `data-yon`): izlemeyi başlatır, hata olursa
  `hataGoster`; sonra sayfayı yeniden açar.
- `EYLEMLER['sefer-bitir']` — `confirm('Sefer bitsin mi? Konumun artık paylaşılmaz.')` →
  `POST /api/servis/sefer-bitir { seferId }`; bu telefonun seferiyse gönderimi durdurur, sayfayı yeniden açar ve
  sunucunun iletisini ("Sefer bitti; konumun artık paylaşılmıyor." ya da "Sefer zaten bitmiş.") gösterir.

### Haritada gezinme düğmeleri

- `EYLEMLER['harita-okula']` — takibi kapatır, okula 17. düzeyde ortalar.
- `EYLEMLER['harita-eve']` — takibi kapatır, eve 17. düzeyde ortalar.
- `EYLEMLER['harita-servis']` — takibi açar/kapatır; açılınca araca 16. düzeyde ortalar. Açıkken her yenilemede harita
  araca yeniden ortalanır (düzey korunur).

## Kimle konuşur?

- Parçalar ad sırasıyla tek bir IIFE'de birleşir (`/js/app.js`; [../../../sunucu/http.md](../../../sunucu/http.md)
  `birlesikOku`); bu dosya `19d-harita.js`'ten sonra, `19i-servis-yoklama.js`'ten önce gelir (`19i`'nin işlevleri
  yalnız çalışma anında çağrılır). Çağırdıkları:
  - `S` ([00-durum.md](00-durum.md)); `$`, `esc`, `api`, `sayiTR`, `EYLEMLER` ([01-yardimcilar.md](01-yardimcilar.md));
    `ik` ([02-ikonlar.md](02-ikonlar.md)); `modalAc`, `mesajGoster`, `sayfaMesaji` ([03-mesaj-modal.md](03-mesaj-modal.md));
    `bildirimDestegi`, `mevcutAbonelik` ([04b-bildirim-izni.md](04b-bildirim-izni.md)); `dugmeBekle`, `dugmeBitir`
    ([05-giris.md](05-giris.md)); `git` ([07-yonlendirme.md](07-yonlendirme.md));
  - [19d-harita.md](19d-harita.md) — `haritaKur`, `googleHaritaBaglantisi`;
  - [19c-okul-hayati.md](19c-okul-hayati.md) — `servisSiraYazisi`, `servisAralikMetni`, `servisBugunGuncelle`;
  - `19i-servis-yoklama.js` — `seferBenCiz` (servisçinin haritasındaki "Sen" işareti); `25-tiklama.js` — `hataGoster`.
  - Tarayıcı: `navigator.geolocation` (`getCurrentPosition`, `watchPosition`, `clearWatch`), `navigator.wakeLock`,
    `document.hidden` / `visibilitychange`, `window.isSecureContext`. Sunucu `Permissions-Policy: geolocation=(self)`
    gönderir: konumu yalnız sitenin kendisi isteyebilir ([../../../sunucu/http.md](../../../sunucu/http.md)).
- Sunucu uçları ([../../../sunucu/bolumler/okul-hayati.md](../../../sunucu/bolumler/okul-hayati.md)):
  - `GET /api/servis/harita?ogrenci=<id>` — öğrencinin kendisi (kendi kimliği kullanılır), bağlı velisi, aynı okulun
    servis yönetimi ya da o servisin servisçisi; değilse 403. Cevap `{ ogrenci (ad), okul: { ad, enlem, boylam },
    ev: { enlem, boylam } | null, servis, sefer: { yon: 'gidis'|'donus', donem, baslangic, sonKonum, konum: { enlem,
    boylam, dogruluk } | null } | null, bugun, evDuzenleyebilir }`. `sefer` yalnız servis saatinde (ve 60 dakikalık
    uzatmada) süren seferde, `konum` yalnız son 3 dakikada geldiyse.
  - `POST /api/servis/ev` — öğrenci, velisi ya da yönetim (servisçi değiştiremez, 403); kişi başına saatte 30 (429);
    koordinat anlaşılmazsa 400 "Konum anlaşılmadı. Haritada evin olduğu yere dokun."
  - `POST /api/servis/konum` — yalnız servisçi; dakikada 60 (429 "Konum çok sık gönderiliyor."); sefer bitmiş,
    başkasının, bilinmeyen ya da servis saati (uzatmasıyla) dolmuşsa 409.
  - `POST /api/servis/sefer-bitir` — yalnız servisçi, yalnız kendi seferini kapatır.
  - Okul "Servis"i kapattıysa uçlar 403 `ozellikKapali` ([../../../sunucu/bolumler/ozellikler.md](../../../sunucu/bolumler/ozellikler.md)).
  - Telefon uygulaması aynı konumu arka planda `POST /api/cihaz/servis-konum` ile gönderir
    ([../../../sunucu/bolumler/cihaz.md](../../../sunucu/bolumler/cihaz.md)); bu dosya o ucu kullanmaz.
- Onu kullananlar:
  - [19c-okul-hayati.md](19c-okul-hayati.md) — `SAYFALAR.servis` (`servisHaritasiDurdur`, `servisBildirimOnerisi`),
    `servisSayfasi` (`servisHaritasiAc('servisHaritaKart', id)`); düğmeler `servis-harita-cocuk` ve `servis-harita-modal`
    orada çizilir, eylemleri burada.
  - `19i-servis-yoklama.js` — `seferIzlemeyiBaslat` (sefer açılınca, `syKonumBaslat` üstünden; güvenli bağlantı yoksa
    hiç çağırmaz), `seferiDurdur` (sayfa açılırken seferin sunucuda kapandığı görülürse, son "İndi" günü bitirince,
    "Okula vardık"), `seferDurumCiz`, `S._sefer`;
    "Konum göndermeyi sürdür" (`sefer-surdur`) ve "Seferi bitir" (`sefer-bitir`) düğmelerini çizer.
  - `26-baslat.js` — `cikisYap`: çıkışta açık sefer varsa önce `POST /api/servis/sefer-bitir` (hatası yutulur), sonra
    `seferiDurdur()`; sessiz çıkışta (`cikisYap(true)`: sunucu 401 döndürünce, açılışta hesap onaysızsa ya da oturum
    doğrulanamayınca, kişi kendi hesabını silince) istek atılmaz, yalnız `seferiDurdur()`.
- CSS: `public/css/parcalar/27-harita-ortak.css` — `.harita-kap` (340 px), `.harita-bilgi`, `.harita-durum` (`.canli`
  yeşil), `.canli-nokta` (nabız animasyonu; "azaltılmış hareket"te durur), `.harita-secim-bilgi` (turuncu), `.dugme-satir`,
  `.bildirim-oneri`, `.sefer-durum` (`.canli`), `.hata-yazi`; `34-servis-yoklama.css` — `.harita-sira`, servisçi
  sayfasındaki `.sefer-durum` eki. `.harita-git` için ayrı kural yok. İşaret görünümü [19d-harita.md](19d-harita.md)'de.
- Rol: harita — öğrenci (kendi), veli (çocukları), servis yönetimi (pencerede, her öğrenci), servisçi bu haritayı değil
  `19i`'ninkini görür (ev konumunu görür, değiştiremez). Ev işaretleme — öğrenci, veli, yönetim. Konum gönderme — yalnız
  servisçi.

## Nasıl çalışır (adım adım)?

### Velinin haritası

```
servisSayfasi ─► servisHaritasiAc('servisHaritaKart', çocukId)
   servisHaritasiDurdur ─► kutular (Alan / Bilgi / Mesaj) ─► haritaKur
   servisHaritasiYenile(true) ─► GET /api/servis/harita?ogrenci=…
        ├─ servisHaritasiCiz(true): okul + ev + (araç) işaretleri, sigdir, durum satırı
        ├─ servisBugunGuncelle ─► servis kartının "bugün" bölümü
        └─ servisHaritasiZamanla: sefer 5 sn · canlı 30 sn · saat dışı 120 sn
              zaman geldi ─► kutu yok? durdur │ sekme gizli / ev seçiliyor? bekle │ değilse yenile
```

### Ev işaretleme

```
[Evimi işaretle] ─► secimAcik ─► "Haritada evinin olduğu yere dokun."
   dokunuş (haritaKur.tiklaninca) ─► secim = nokta ─► turuncu iğne, [Kaydet] açılır
   ya da [Bulunduğum yeri kullan] ─► getCurrentPosition ─► secim, 17. düzey
   [Kaydet] ─► POST /api/servis/ev ─► "Ev konumu kaydedildi." ─► yeniden oku
```

### Servisçinin konumu

```
19i: "Seferi başlat" / ilk "Bindi" / akşam "Başlat" ─► sunucu seferi açar ─► seferIzlemeyiBaslat({ id, servisId, yon })
   watchPosition ─► son konum ─► 30 m'den çok kıpırdadı mı? ─► seferKonumGonder(zorla?)
   her 5 sn nabız ─► 20 sn'dir gitmediyse zorla gönder
   POST /api/servis/konum ─┬─ 200 ─► "Konum gönderiliyor · … · son gönderim 3 sn önce · ±8 m"
                           ├─ 409 ─► seferiDurdur ─► (Yoklama'daysa) sayfa yeniden + sunucunun iletisi
                           ├─ 429 ─► sessiz
                           └─ başka ─► kırmızı ileti
   ekran kilidi (wakeLock): sayfa gizlenince düşer, görünür olunca yeniden alınır
"Okula vardık" / son "İndi" / "Seferi bitir" / çıkış ─► seferiDurdur
```

## Dikkat!

- **Çocuk değiştirirken eski cevap yeni haritaya çizilebilir (kod okumasına göre; denenmedi).** `servisHaritasiYenile`
  cevap geldiğinde yalnız "harita var mı ve kutu kimliği aynı mı" diye bakar. Velinin iki çocuğu arasında geçerken kutu
  kimliği aynı (`servisHaritaKart`) kaldığı için, birinci çocuk için yolda olan bir istek (ör. hızlı art arda iki tıklama
  ya da tam o anda başlamış bir yenileme) ikinci çocuğun cevabından SONRA gelirse birinci çocuğun evi, aracı ve durum
  satırı yeni haritada görünür; bir sonraki yenilemeye (5 sn – 2 dk) kadar öyle kalır. Bu arada "Ev konumu kaydet" doğru
  çocuğa (`servisHarita.ogrenciId`) gider. Düzeltme önerisi: istekte `ogrenciId`'yi de karşılaştırmak ya da bir sayaçla
  yalnız son isteğin cevabını kabul etmek.
- **"Takip" durumu sıfırlanmıyor.** `servisHarita.takip` başlangıç nesnesinde yok ve `servisHaritasiDurdur` onu
  silmez: "Servisi takip et" bir kez açıldıysa başka çocuğa, yönetim penceresine, hatta çıkış yapıp aynı sekmede giren
  başka hesabın haritasına geçince de açık kalır (araç görününce harita ona ortalanır). Zararsız ama beklenmedik.
- **Sayfadan çıkınca harita hemen durmaz.** `git()` servis haritasını kapatmaz (yalnız `aileHaritaKapat` çağırır);
  zamanlayıcı bir sonraki turda (en çok 2 dakika) kutunun gittiğini görüp durur. Bu arada istek atılmaz; yolda olan
  bir cevap ise kutu olmadığı için hiçbir şey çizmez.
- **Tek harita.** `servisHarita` tek bir nesne: yönetim penceresinde harita açılınca `servisHaritasiAc` önce
  `servisHaritasiDurdur`'u çağırır; bu, sayfadaki haritanın (varsa) sayacını durdurur ve `yokEt` ile içini boşaltır
  (döşemeler ve işaretler gider, yalnız gri kutu ve altındaki eski durum yazısı kalır). Pencere kapanınca sayfadaki
  harita yeniden kurulmaz; sayfa yeniden çizilene kadar (sayfaya yeniden girince ya da bir kayıttan sonra) boş kalır.
  Bugün yönetimin sayfasında harita yalnız kendisinin servisli çocuğu varsa olur (çocuğu olan müdür ya da
  `servis.yonet` yetkili öğretmen).
- **Hata alınca da yenilemeye devam eder.** Harita ucu 403 verse (ör. veli bağı kaldırıldı) ileti yazılır ve yeniden
  denenir: ilk istek hata verdiyse her 30 saniyede, daha önce başarılı bir cevap varsa o cevabın kademesiyle (sefer
  sürüyorduysa her 5 saniyede). Haritada son başarılı cevabın işaretleri kalır, yalnız durum satırının yerine kırmızı
  ileti gelir.
- **`sefer-surdur` güvenli bağlantıya bakmıyor.** `19i`'nin kendi başlatması (`syKonumBaslat`) `isSecureContext`'e bakar
  ve http'de hiç başlatmaz; "Konum göndermeyi sürdür" düğmesi bakmadan `seferIzlemeyiBaslat`'ı çağırır. http'de tarayıcı
  konumu reddeder ve kişi yanıltıcı biçimde "Konum izni verilmedi. Telefonun ayarlarından bu siteye konum izni ver." görür;
  asıl neden https olmaması. Konum yalnız HTTPS'te (ya da `localhost`'ta) alınır.
- **Konum yalnız sayfa açıkken.** Telefon kilitlenir ya da sekme arka plana giderse tarayıcı konum vermez; bu yüzden
  ekran kilidi istenir ve sayfada "telefonu kilitleme, şarja takılı tut" yazar. Arka plan gönderimi yalnız telefon
  uygulamasında (Android `SeferServisi`) var.
- **Gönderim zamanlaması:** `sonGonderim` isteğin denendiği anda yazılır (başarıya bakılmaz); ağ hatasından sonra bir
  sonraki deneme ancak 5 sn sonra (yeni konumla) ya da 20 sn'lik nabızda olur. Hareketliyken 30 m kuralıyla en sık 2 sn'de
  bir gidebilir; sunucunun sınırı dakikada 60 olduğu için 429 gelirse sessizce yutulur.
- **409 iki işi birden yapar:** gönderim durur ve servisçi Yoklama sayfasındaysa (`S.page === 'ana'` ve rol `servisci`)
  sayfa yeniden açılıp "Servis saati bitti; sefer kapandı." gibi ileti gösterilir; başka bir sayfadaysa ileti görmez,
  yalnız gönderim kesilir.
- **Ev seçme kipinde** daha önce kaydedilmiş ev, kişi dokunana kadar seçim (turuncu) iğnesiyle gösterilir; yenileme
  durur. Kipten çıkmadan sayfada kalan kişinin haritası bayatlar (kasıtlı: seçim kaybolmasın).
- **Metin küçükleri:** "Evimi işaretle" yazısı veliye ve yönetime de aynen çıkar (çocuğun/öğrencinin evi); "okul
  yönetimi Ayarlar'dan girer" denen yer menüde "Okul Adresi ve Konumu" / "Okulun Konumu" sayfasıdır.
- **Bildirim önerisi kartında "Bildirimleri aç"** başarıdan sonra "Açılıyor..." yazısıyla kapalı kalır: `04b`'nin
  eylemi yalnız ayarlar sayfasındaki `#bildirimAyar` kartını yeniden çizer, bu sayfada o kart yok; "Telefon bildirimleri
  açıldı." iletisi yine görünür. Yalnız görünüş.
- **Gizlilik:** aracın konumu yalnız sefer sürerken ve son 3 dakikada geldiyse döner; geçmiş iz saklanmaz. Ev konumu
  yalnız öğrenciye, velisine, servisçisine ve yönetime gider (aydınlatma metninde "Öğrencinin evinin haritadaki yeri"
  satırı). Harita döşemelerinin OSM'ye gitmesi için [19d-harita.md](19d-harita.md).
- `kacSaniyeOnce` boş tarihle "NaN dk önce" yazar; bugün sunucu `konum` doluyken `sonKonum`'u hep gönderdiği için
  görülmez.
- **Baş yorum eksik söylüyor:** dosyanın baş yorumu yaklaşma bildiriminin "öğrencinin velisine" gittiğini yazar; sunucu
  (`yaklasmaBildir`) öğrencinin kendisine de gönderir (`testler/test-servis-konum.js` "400 m: öğrenciye 'yaklaşıyor'
  bildirimi gitti"). Yalnız yorum; davranış doğru.

## Testleri

- Bu dosyanın tarayıcıda çalışan bir testi yok. Sunucu tarafı:
  - `testler/test-servis-konum.js` — okul ve ev konumu (öğrenci kendi evini işaretler; başka çocuğun velisi, servisçi,
    başka okul değiştiremez; bozuk koordinat 400), harita yetkisi (öğrenci `?ogrenci=` ile başkasınınkini açamaz, veli
    yalnız çocuğununkini, servisçi kendi servisinin öğrencisini görür ama evi düzenleyemez, yetkisiz öğretmen görmez),
    sefer ve konum (başkası bu sefere konum yazamaz, öğrenci ve veli aracı görür), 500/100 m bildirimi ve GPS doğruluğu,
    servis başka servisçiye verilince ya da hesap silinince aracın kaybolması, sefer bitince konumun paylaşılmaması,
    dakikada 60 sınırı.
  - `testler/test-servis-yoklama.js` — harita aralık dışında sefer ve canlı bilgi döndürmez; uzatmada sefer sürer;
    aralık biteli 70 dakika olunca sefer kapanır ve konum 409; ilk "Bindi" seferi açar; uygulama anahtarıyla konum.
  - `testler/test-ozellikler.js` — servis kapalıyken kapalı okuldaki çocuğun haritası 403.
- `testler/buton-denetimi.js` — `ev-sec`, `ev-vazgec`, `ev-buradayim`, `ev-kaydet`, `ev-sil`, `harita-okula`,
  `harita-eve`, `harita-servis`, `servis-harita-cocuk`, `servis-harita-modal`, `sefer-surdur`, `sefer-bitir` karşılıkları.
- `testler/yazim-denetimi.js`, `testler/test-kucult.js` — ekran metinleri ve birleşik paketin derlenmesi.
- Elle (sunucu 3200'de, `testler/seed.js` hesapları; seed'de servis saatleri her an açık): servisçiyle telefondan
  (https gerekir; bilgisayarda `localhost` olur) Yoklama → "Seferi başlat" → konum izni ver: "Konum gönderiliyor · …";
  öğrenciyle Servisim → haritada araç ve "Servis yolda"; "Servisi takip et"; "Evimi işaretle" → haritaya dokun → Kaydet.
  Veliyle iki çocuk arasında geç; müdürle Servisler → bir öğrencinin "Harita" düğmesi.

## Son durum

- `git log`: 5 commit. Son değişiklik `24050a2 commit 518` (2026-09-27, servis yoklaması işi): servisçinin ayrı
  "Seferlerim" sayfası (`SAYFALAR.seferim`, `seferHarita`, `seferBenCiz`, `sefer-basla`) bu dosyadan KALDIRILDI — sefer
  artık `19i-servis-yoklama.js`'in Yoklama ekranından başlıyor, `seferBenCiz` oraya taşındı; 409'da yeniden açılan sayfa
  yalnız servisçinin ana sayfası oldu; harita yenilemesi üç kademeye çıktı (5 sn / 30 sn / 2 dk); cevaptaki `bugun` ile
  servis kartının tazelenmesi (`servisBugunGuncelle`); durum satırına sıra ("önünde N öğrenci") ve "Aracın yeri yalnız
  servis saatlerinde görünür"; çocuk düğmesinin `S.servisHaritaCocuk`'u yazması.
- Ondan önce: `7a8b555 commit 504` (2026-09-26) "Okula git", "Eve git", "Servisi takip et" düğmeleri ve
  `harita-okula`/`harita-eve`/`harita-servis` eylemleri; `bb20f57 commit 325` eski sefer sayfasına `seferBenCiz`;
  `1a7f41b commit 316` `seferDurumCiz` ve sefer başlat/sürdür/bitir eylemleri; dosyanın ilk hâli `52d7bca commit 315`
  (görenlerin haritası ve yenilemesi, ev işaretleme eylemleri, çocuk ve yönetim haritası, bildirim önerisi, konum
  izleme/gönderme/ekran kilidi ve eski "Seferlerim" sayfası).
- Bilinen açıklar (kod değiştirilmedi): çocuk değiştirirken eski cevabın çizilebilmesi, sıfırlanmayan `takip`,
  `sefer-surdur`'un https'e bakmaması, bildirim önerisi düğmesinin "Açılıyor..."da kalması, yönetim penceresindeki
  haritanın sayfadaki haritayı boşaltması.
- Planlı işlerden bu dosyaya dokunması beklenenler (DEVAM.md 4. bölüm):
  - "Optimizasyon + saklama süreleri" — tanım, servisin canlı haritasının (sefer sürerken 5 sn) ve servisçinin yoklama
    sayfasının yenileme aralığının **olduğu gibi kalacağını** söylüyor; yalnız genel bildirim yoklaması 5 dakikaya çıkacak.
  - "Android yerel uygulama" — servisçinin konumu uygulamada bugün de arka planda gidiyor (`SeferServisi`,
    `/api/cihaz/servis-konum`); tanımdaki uygulama içi servis haritası (`Harita.java`, henüz yazılmadı) bu dosyanın
    görenler tarafının eşi olacak.
  - "Tek kişi tek hesap + portallar öğrencide de" — servisçi de portal olacak (iki okulda tek hesap): `S._sefer` ve
    `seferDurumCiz`'in servis başına mantığı birden çok okulun servisinde de doğru kalmalı.
  - "Mesaj ayarları, …" — bildirim panelinde "Servis" sekmesi; yaklaşma bildirimleri oraya düşecek.
  - "Çok dil" — bütün ekran metinleri `c()` kataloğuna; "KVKK ve onay metinleri TAM denetimi" — ev konumu ve canlı konum.
  - "Ekran turu + albüm" — servis sayfalarının görüntüleri yeniden alınacak.
