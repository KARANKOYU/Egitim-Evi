# public/js/parcalar/19h-hatirlaticilar.js

Kişisel "Hatırlatıcılar" sayfası: herkesin kendine kurduğu bir kezlik, günlük, haftalık ya da aylık hatırlatmaların
listesi, ekleme/düzenleme penceresi, durdurma/başlatma ve silme.

## Bu dosya ne yapar?

"Her pazartesi 08:00 beden eğitimi kıyafeti", "30 Eylül 15:00 kütüphane kitabını iade et", "her ayın 1'i servis ücreti"
gibi kişisel hatırlatmalar için. Öğrenci, veli, öğretmen, müdür, servisçi, henüz okula bağlı olmayan yetişkin ve yönetici
— herkes menüsündeki **Hatırlatıcılar**'dan kendine kurar; hatırlatıcıyı yalnız sahibi görür. Zamanı gelince sunucu
dakikalık işinde sahibine bir bildirim gönderir ("Hatırlatma: Beden eğitimi kıyafeti — çantaya koy"; telefon bildirimi
açıksa telefona da). Öğrencinin kendi hatırlatması velisine kopyalanmaz.

Bu dosya yalnız ekranı çizer ve formu toplar. Doğrulama, "sonraki hatırlatma ne zaman" hesabı ve gönderim sunucudadır;
saatler her zaman **Türkiye saatidir** (sunucu başka saat diliminde çalışsa da).

## İçinde neler var?

### Sabitler

- `HATIRLATICI_SIKLIK` — sıklık seçenekleri: `bir-kez` "Bir kez", `her-gun` "Her gün", `her-hafta` "Her hafta", `her-ay`
  "Her ay". Sunucudaki `SIKLIKLAR` ile aynı anahtarlar.
- `HAFTA_KISA` — `['', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz']`: 1 pazartesi … 7 pazar (sunucudaki gün
  numarasıyla aynı; 0 boş).

### Biçim yardımcıları

- `hatirlaticiOzeti(h)` — satırdaki özet: "4 Eylül 2026, Cuma · 15:00" (bir kez; `tarihGun`), "Her gün · 21:00",
  "Her hafta Pzt, Çar · 07:30", "Her ayın 31. günü · 10:00". Saat sunucudan geldiği gibi (Türkiye saati) yazılır.
- `hatirlaticiDurumu(h)` — sağdaki etiket:
  - kapalı ve bir kezlik + gönderilmiş → gri **Hatırlatıldı**; kapalı başka her durumda → gri **Durduruldu**;
  - açık ama `sonraki` boş → gri **Günü geçti** (aşağıda "Dikkat!");
  - açık → mavi **Sonraki: 06.10.2026 08:00** (`tarihSaat(h.sonraki)`).

### Sayfa

- `SAYFALAR.hatirlaticilar` — `GET /api/hatirlaticilar` → listeyi `S._hatirlaticilar`'a koyar (Düzenle penceresi buradan
  okur) ve çizer: "HATIRLATICILAR" başlığı ve açıklaması; üst kartta "3 / 50 hatırlatıcı. Yalnızca sen görürsün." ve
  **Yeni hatırlatıcı** (`data-act="hatirlatici-yeni"`). Liste boşsa "Henüz hatırlatıcın yok. … ör. her pazartesi 08:00
  "Beden eğitimi kıyafeti"." kutusu. Değilse her hatırlatıcı bir satır (`data-ara` = başlık + açıklama, üst arama kutusuna
  açık; kapalıysa `soluk-satir`): zil simgesi, başlık, varsa açıklama, özet, durum etiketi ve üç düğme — **Düzenle**
  (`hatirlatici-duzenle`), **Durdur** / **Başlat** (`hatirlatici-durum`, `data-aktif` istenen yeni durum: açıksa `0`,
  kapalıysa `1`), kırmızı **Sil** (`hatirlatici-sil`).

### Pencere

- `hatirlaticiPenceresi(x)` — `x` yoksa yeni hatırlatıcı, varsayılanları: her hafta, 08:00, pazartesi, ayın 1'i. Alanlar:
  - **Başlık** `#hBaslik` (en çok 120, "ör. Beden eğitimi kıyafeti"), **Açıklama (isteğe bağlı)** `#hAciklama` (en çok 1000);
  - **Ne sıklıkla?** — dört `input[name=hSiklik]` radyo düğmesi (`.secim-dugme`);
  - sıklığa göre yalnız biri görünen üç alan (`.h-alan[data-siklik]`, `style.display` ile): "Gün" `#hTarih`
    (`type=date`, en erken bugün), "Hangi günler?" yedi `input.h-gun` kutusu, "Ayın kaçı?" `#hAyGunu` (1–31; "Ay o kadar
    çekmiyorsa ayın son günü hatırlatılır."); "Her gün"de hiçbiri görünmez;
  - **Saat** `#hSaat` (`type=time`), ileti alanı `#hMesaj`.
  Başlık "Yeni hatırlatıcı" ya da "Hatırlatıcıyı düzenle"; düğmeler **Vazgeç** ve **Kaydet** (`hatirlatici-kaydet`,
  `data-id`). Açılınca odak başlıkta.

### Eylemler (`EYLEMLER`)

- `hatirlatici-yeni` → boş pencere; `hatirlatici-duzenle` → `S._hatirlaticilar`'dan o kayıtla pencere.
- `hatirlatici-kaydet` — formdaki **bütün** alanları toplar (`baslik`, `aciklama`, `siklik`, `tarih`, `saat`, sayı
  olarak `ayGunu`, sayı dizisi olarak `gunler`). Tarayıcıda yalnız iki denetim: başlık boşsa "Başlık yaz.", haftalıkta gün
  yoksa "Haftanın en az bir gününü seç.". Sonra "Kaydediliyor..." → `POST /api/hatirlaticilar` (yeni) ya da
  `POST /api/hatirlaticilar/<id>` (düzenleme). Başarıda pencere kapanır, sayfa yeniden çizilir ve üstte sunucunun iletisi +
  "İlk hatırlatma: 06.10.2026 08:00." çıkar. Hata `#hMesaj`'a.
- `hatirlatici-durum` — düğmeyi kilitler → `POST /api/hatirlaticilar/<id>/durum { aktif }` → sayfa yeniden + "Durduruldu."
  ya da "Yeniden başladı."; hata uyarı kutusunda (`hataGoster`), düğme açılır.
- `hatirlatici-sil` — `confirm('Hatırlatıcı silinsin mi?')` → `POST /api/hatirlaticilar/<id>/sil` → sayfa yeniden çizilir
  (ileti yok); hata uyarı kutusunda.

## Kimle konuşur?

- Parçalar ad sırasıyla tek bir IIFE'de birleşir (`/js/app.js`; [../../../sunucu/http.md](../../../sunucu/http.md)
  `birlesikOku`). Bu dosyanın çağırdıkları: `S._hatirlaticilar` ([00-durum.md](00-durum.md)'deki `S` nesnesine yazılır);
  `$`, `esc`, `api`, `EYLEMLER` ([01-yardimcilar.md](01-yardimcilar.md)); `ik`, `tarihGun`, `tarihSaat`
  ([02-ikonlar.md](02-ikonlar.md)); `modalAc`, `modalKapat`, `mesajGoster`, `sayfaMesaji`
  ([03-mesaj-modal.md](03-mesaj-modal.md)); `dugmeBekle`, `dugmeBitir` ([05-giris.md](05-giris.md)); `git`, `yaz`, `hero`,
  `bosKutu` ([07-yonlendirme.md](07-yonlendirme.md)); `SAYFALAR` ([08-ana-sayfa.md](08-ana-sayfa.md)); `hataGoster`
  (`25-tiklama.js`).
- Onu kullananlar: başka parça bu dosyanın adlarını çağırmaz. [06-menu.md](06-menu.md) "Hatırlatıcılar"ı her rolün
  menüsüne (rolsüz yetişkinde "Başlangıç"ın yanına, servisçide dört maddenin biri olarak) koyar; yöneticinin menüsünde de var
  (`public/js/yonetim/09a-yonetim-paneli.js`). `26-baslat.js` açılışta portal dışındaki yetişkin hesabını ve servisçiyi
  gidebilecekleri sayfalarla sınırlarken `hatirlaticilar`'ı izinli sayar. Bildirimin bağlantısı `#/hatirlaticilar` bu sayfayı açar.
- Sunucu uçları ([../../../sunucu/bolumler/hatirlatici.md](../../../sunucu/bolumler/hatirlatici.md)); giriş yapmış ve
  onaylı herkes (rolsüz yetişkin de: `hatirlaticilar` rolsüz kapısından serbest, [../../../sunucu/api.md](../../../sunucu/api.md)):
  - `GET /api/hatirlaticilar` → `{ hatirlaticilar: [{ id, baslik, aciklama, siklik, tarih, saat, ayGunu, gunler, aktif,
    sonGonderim, sonraki }], sinir: 50 }` (kuruluş anına göre eskiden yeniye — düzenlenen ya da yeniden başlatılan kayıt
    bu an yenilendiği için listenin sonuna geçer; `sonraki` ISO ya da `''`).
  - `POST /api/hatirlaticilar` — kişi başına en çok 50 (400 "En fazla 50 hatırlatıcı kurabilirsin; kullanmadığını sil.").
    Doğrulama hataları (400): "Başlık yaz.", "Ne sıklıkla hatırlatılacağını seç.", "Saati seç (ör. 08:30).", "Günü seç.",
    "Bu gün ve saat geçti; ileri bir zaman seç.", "Haftanın en az bir gününü seç.", "Ayın kaçında hatırlatılacağını seç
    (1-31).". Sıklığa ait olmayan alanlar yok sayılır. Cevap `{ hatirlatici, message: 'Hatırlatıcı kuruldu.' }`.
  - `POST /api/hatirlaticilar/<id>` — aynı doğrulama; cevap `{ hatirlatici, message: 'Kaydedildi.' }`. Kayıt baştan
    sayılır: açılır, "son gönderim" silinir, kuruluş anı şimdi olur.
  - `POST /api/hatirlaticilar/<id>/durum { aktif }` — günü geçmiş bir kezlik başlatılamaz (400 "Bu hatırlatıcının günü
    geçti; düzenleyip yeni bir gün seç."); başlatınca da baştan sayılır.
  - `POST /api/hatirlaticilar/<id>/sil` → `{ message: 'Silindi.' }`.
  - Başkasının hatırlatıcısı (öğretmen dahil) 404 "Hatırlatıcı bulunamadı". Yazan uçlar kişi başına saatte 120 (429 "Çok
    sık değiştirdin. Biraz sonra dene.").
- Zaman hesabı: [../../../sunucu/yardimci/hatirlatici-zaman.md](../../../sunucu/yardimci/hatirlatici-zaman.md) (`sonraki`,
  `zamaniGeldi`; ayın 31'i kısa ayda son gün). Gönderim: `hatirlaticilariGonder` her dakika
  ([../../../sunucu/index.md](../../../sunucu/index.md)'deki zamanlayıcı) → `bildir` (site bildirimi + telefon bildirimi).
- Veri: [../../../sunucu/veri/depo/hatirlaticilar.md](../../../sunucu/veri/depo/hatirlaticilar.md) → `hatirlaticilar`,
  `hatirlatici_gunleri` (şema 024).
- CSS: `public/css/parcalar/22-cesitli.css` — `.hatirlatici-ikon` (40 px yuvarlak zil), `.secim-dugmeler` / `.secim-dugme`
  (radyo ve kutuları düğme gibi gösterir; seçilince ana renk), `.etiket-baslik`, `.soluk-satir`; `04-kartlar.css` —
  `.satir`, `.etiket.gri`, `.etiket.mavi`; `34-servis-yoklama.css` dokunmatik ekranda ya da 640 px altında
  (`(pointer: coarse), (max-width: 640px)`) `.secim-dugme`'yi en az 44 px yapar. `.h-alan`'ın
  kuralı yok (gösterme/gizleme satır içi `display` ile).
- Rol: herkes kendi hatırlatıcıları için (öğrenci, veli, öğretmen, müdür, servisçi, rolsüz yetişkin, yönetici).

## Nasıl çalışır (adım adım)?

```
menü "Hatırlatıcılar" ─► GET /api/hatirlaticilar ─► S._hatirlaticilar ─► liste (özet + durum etiketi)
"Yeni hatırlatıcı" ─► hatirlaticiPenceresi(null): her hafta · Pzt · 08:00
   "Her hafta" seç ─► goster(): yalnız "Hangi günler?" görünür
   "Kaydet" ─► başlık var mı, gün var mı ─► POST /api/hatirlaticilar { … bütün alanlar … }
        sunucu: dogrula ─► kaydet ─► sonraki = ilk uygun gün + saat (Türkiye)
   ─► modalKapat ─► git('hatirlaticilar') ─► "Hatırlatıcı kuruldu. İlk hatırlatma: 06.10.2026 08:00."

sunucuda her dakika ─► zamanı gelen açık hatırlatıcı (en çok 6 saat gecikmeyle)
   ─► bildirim "Hatırlatma: <başlık> — <açıklama>" (#/hatirlaticilar)
   ─► bir kezlikse kapanır ─► listede "Hatırlatıldı"
```

## Dikkat!

- **Düzenle → Kaydet, durdurulmuş hatırlatıcıyı yeniden başlatır.** Sunucu düzeltmede kaydı her zaman açar ve baştan sayar;
  pencere bunu söylemez. Durdurduğun bir hatırlatıcının yalnız başlığını düzeltmek istersen, kaydettikten sonra yeniden
  **Durdur**'a basman gerekir.
- **"Sonraki" tarihi telefonun saat dilimiyle yazılır, özet Türkiye saatiyle (kod okumasına göre).** `tarihSaat` ISO anı
  cihazın yerel saatine çevirir; özetteki "08:00" ise sunucunun Türkiye saatidir. Telefonu başka saat diliminde olan
  biri (yurt dışındaki veli) "· 08:00" yanında "Sonraki: … 06:00" gibi farklı bir saat görür. Pencerenin "en erken bugün"
  sınırı (`min`) da cihazın tarihiyle hesaplanır; asıl denetim sunucuda ("Bu gün ve saat geçti").
- **"Günü geçti" kendiliğinden temizlenmez.** Bir kezlik hatırlatıcının anı geçtiği hâlde gönderilmemişse (ör. sunucu o sırada
  6 saatten uzun kapalı kaldıysa) kayıt açık kalır, `sonraki` boştur ve etiket "Günü geçti" olur; bir daha gönderilmez ama
  50 sınırına sayılır. Düzenleyip yeni gün seçmek ya da silmek gerekir. (Gönderim dakikalık olduğu için anı yeni geçmiş bir
  hatırlatıcı da sayfa o dakikada açılırsa kısa süre böyle görünebilir.)
- **Gizli alanlar da gönderilir.** Pencere görünmeyen tarih, gün ve ay günü alanlarını da yollar; sunucu yalnız seçilen
  sıklığa ait olanı kullanır. Düzenlemede eski sıklığın değerleri bu yüzden pencerede kalır, zararsızdır.
- **Tarayıcı yalnız iki şeye bakar** (başlık, haftalık gün); geçmiş gün, saat biçimi, ay günü sınırı gibi her şeyi sunucu
  söyler, ileti pencerenin altındaki `#hMesaj`'a düşer.
- **`S._hatirlaticilar` çıkışta silinmez** (`26-baslat.js`'in sıfırlama listesinde yok). Düzenle düğmeleri yalnız yeni
  çizilmiş listeden basılabildiği için başkasının kaydı ekrana gelmez; yalnız bellekte bir süre durur.
- Bildirim yalnız sahibine gider (`veliye: false`): öğrencinin hatırlatması veliye kopyalanmaz.
- Silmede ve "Durdur/Başlat"ta hata pencere içinde değil, tarayıcının uyarı kutusunda çıkar; silme başarısında ileti yok.
- `HAFTA_KISA`, `21-ders-programi.js`'teki `GUN_KISA` ile birebir aynı dizidir (`04e-tarih-secici.js`'teki
  `TS_GUN_KISA` da aynı kısaltmalar, baştaki boşluk olmadan); her parça kendi kopyasını tutar. Gün kısaltmalarını
  değiştirirsen (ör. "Çok dil" işinde) üçünü birlikte değiştir.

## Testleri

- `testler/test-hatirlatici.js` — kurma (öğrencinin listesi ve `sinir: 50`; haftalık Pzt-Çar 07:30 ve sonraki anın Türkiye
  saatiyle pazartesi ya da çarşamba olması; yarın 15:00 bir kez; her gün; ayın 31'i; öğretmen, müdür ve rolsüz yetişkin de
  kurabiliyor), denetimler (başlıksız, günsüz haftalık, 8 ve 0. gün, bozuk saat, geçmiş gün, ayın 32'si, başlık yerine nesne
  500 değil 400), yalnız sahibi (başkası göremez, düzeltemez, silemez — öğretmen dahil 404), düzenle/durdur/başlat/sil,
  kişi başına 50 sınırı.
- `testler/test-hatirlatici-zaman.js` (sunucusuz) — zaman hesabı: Türkiye saati (08:30 TR = 05:30 UTC, gece 01:00 hâlâ o
  gün), haftanın günleri, ayın 31'inin kısa ayda ve şubatta son güne düşmesi, sonraki an (kuruluştan sonra, geçmiş bir
  kezliğin ve durdurulmuşun sonrakisinin olmaması), gönderilmişin yeniden gönderilmemesi, 6 saate kadar gecikmenin gitmesi
  ve daha eskisinin gitmemesi, gece yarısını geçen gönderim.
- `testler/buton-denetimi.js` — `hatirlatici-yeni`, `-duzenle`, `-kaydet`, `-durum`, `-sil` eylemlerinin karşılığı;
  `testler/yazim-denetimi.js` ekran metinleri.
- Bu dosyanın tarayıcıda çalışan testi yok.
- Elle (sunucu 3200'de, `testler/seed.js` hesapları): öğrenciyle **Hatırlatıcılar** → **Yeni hatırlatıcı** → "Bir kez",
  bugün ve iki dakika sonrası → Kaydet: "İlk hatırlatma: …"; birkaç dakika içinde bildirim gelir, sayfayı yenileyince satır
  "Hatırlatıldı" olur (liste kendiliğinden tazelenmez).
  Bir haftalığı **Durdur** → "Durduruldu"; **Düzenle** → Kaydet → yeniden açık (yukarıdaki not).

## Son durum

- `git log`: 2 commit. Son değişiklik `6f68597 commit 438` (2026-09-26): eylemler eklendi — `hatirlatici-yeni`,
  `-duzenle` (`S._hatirlaticilar`'dan), `-kaydet` (iki tarayıcı denetimi, "İlk hatırlatma: …" iletisi), `-durum` ve `-sil`;
  aynı commit `testler/test-hatirlatici.js` ile `testler/test-hatirlatici-zaman.js`'i getirdi.
- Dosyanın ilk hâli `630d9f2 commit 437` (2026-09-26): sabitler, `hatirlaticiOzeti`, `hatirlaticiDurumu`, sayfa ve pencere;
  aynı commit sunucunun `hatirlatici.js` ve `hatirlatici-zaman.js` dosyalarını getirdi. O günden beri değişmedi.
- Bilinen açıklar (kod değiştirilmedi): düzenlemenin durdurulmuş kaydı açması (pencere söylemiyor), "Sonraki"nin cihazın
  saat dilimiyle yazılması, "Günü geçti" kayıtlarının kendiliğinden kalkmaması.
- Planlı işlerden bu dosyaya dokunması beklenenler (DEVAM.md 4. bölüm):
  - "Mesaj ayarları, … Ajanda, … duyurudan ajanda + hatırlatıcı, ödev hatırlatma otomasyonu": duyuru/toplu mesajla gelen
    "Hatırlatıcı kur" kayıtları alıcının hatırlatıcılarına ayrı bir tür olarak düşecek (50 sınırına sayılmaz, alıcı yalnız
    kendisi için kapatabilir, gönderen tarihi değiştirirse güncellenir, duyuru silinince kalkar); Ajanda'da "Hatırlatıcılarım"
    süzgeci olacak; ödev hatırlatmaları aynı dakikalık altyapıyı kullanacak. Bu sayfa o kayıtları ayırt edip göstermek
    zorunda kalacak.
  - "Optimizasyon + saklama süreleri": gönderilmiş ve kapanmış bir kezlik hatırlatıcılar 30 gün sonra silinecek ("Hatırlatıldı"
    satırları kendiliğinden kalkar).
  - "Kullanıcı arama … Verilerimi indir": hatırlatıcılar indirilen veriye girecek. "Android yerel uygulama": aynı uçlarla
    uygulamada Hatırlatıcılar ekranı. "Çalışan olarak ekleme": rolsüz çalışanın menüsünde de Hatırlatıcılar. "Çok dil":
    ekran metinleri ve gün kısaltmaları kataloğa.
