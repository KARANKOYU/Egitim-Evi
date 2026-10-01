# public/js/parcalar/19i-servis-yoklama.js

Servisçinin ana sayfası "Yoklama" (sabah Bindi/Binmedi ve "Okula vardık", akşam Geldi/Gelmedi → Başlat → İndi; sefer,
harita, sıra düzenleme, velilere not) ve okul yönetiminin aynı yoklamayı salt okunur gördüğü pencerenin çizimi.

## Bu dosya ne yapar?

Servisçi (şoför) telefonundan okulun adresine girer; ana sayfası bu ekrandır. Öğretmenin ders yoklaması gibi, ama araç
başında tek elle kullanılacak biçimde:

- **Sabah (okula gidiş).** Liste alma sırasıyla gelir. Servisçi her öğrencide büyük **Bindi** ya da **Binmedi**'ye basar;
  işaret anında sunucuya gider ve velisine bildirim olur ("Zeynep 07:42'de servise bindi."). İsterse önce **Seferi
  başlat**'a basar (konumu velilere görünmeye başlar); basmazsa ilk "Bindi" seferi kendiliğinden başlatır. En altta
  **Okula vardık**: sefer biter, binen öğrencilerin velilerine "okula vardı" gider, sabahın işaretleri kilitlenir.
- **Akşam (eve dönüş).** Okulda servise gelenleri **Geldi** / **Gelmedi** ile işaretler, sonra **Başlat**'a basar (sefer
  başlar). Liste "Serviste olanlar" (bırakma sırasıyla) ve "Serviste olmayanlar" diye ikiye ayrılır; her öğrenciyi evine
  bırakınca **İndi**. Serviste kimse kalmayınca sefer kendiliğinden biter.
- **Hangi dönem?** Bunu telefonun saati değil, sunucu söyler: okulun müdürün seçtiği servis saatlerine (ör. sabah
  07:00–09:20, akşam 16:30–19:00) ve Türkiye saatine bakar. Aralık dışında liste bir sonraki aralığın sırası ve velilerin
  "binmeyecek" işaretleriyle görünür ama işaret düğmeleri çıkmaz. Aralık bitince yoldaki sefer 60 dakika daha sürer
  ("uzatma"); dönemin seferi aralığın içinde başladıysa o sırada işaretleme de sürer.
- **Hata olursa.** Her işaret tek tek gider; bağlantı koparsa o satırda kırmızı ileti ve **Yeniden dene** çıkar, öteki
  satırlar beklemez.
- **Yanında.** Harita (okul, evi işaretli öğrenciler sıra numarasıyla, sefer sürerken "Sen"), her öğrenci için Google
  Haritalar'da **Yol tarifi**, velilerin "binmeyecek" işaretleri, **Sırayı düzenle** (yukarı/aşağı düğmeleriyle; dış
  kütüphane yok) ve velilere tarihli **Not yaz**.

Okul yönetimi (müdür ve `servis.yonet` yetkilisi) Servisler sayfasında bir servisin "Bugünkü yoklama"sına basınca aynı
veriyi bu dosyanın `syYonetimGorunumu`'yla salt okunur görür. Konumun telefondan gönderilmesi bu dosyada değil,
[19e-servis-konum.md](19e-servis-konum.md)'dedir; bu dosya yalnız başlatır, durdurur ve durumunu gösterir.

## İçinde neler var?

### Sabitler ve durum

- `SY_YENILE_MS = 60000` — sayfa açıkken dakikada bir sessiz tazeleme (veli işaretleri, dönem değişimi).
- `SY_DURUM_AD` — `bindi` "Bindi", `binmedi` "Binmedi", `geldi` "Geldi", `gelmedi` "Gelmedi", `indi` "İndi".
- `SY` — `{ servisId` (seçili servis; boşsa sunucu ilkini verir), `veri` (son yoklama cevabı), `gidiyor` (öğrenci → yolda
  olan işaret), `hatalar` (öğrenci → `{ durum, mesaj }`), `ucusta` (yoldaki işaret sayısı), `karisik` (aynı anda birden çok
  işaret gitti mi), `sira` (açık "Sırayı düzenle" penceresinin durumu), `harita` (`haritaKur` nesnesi), `sayac`
  (tazeleme zamanlayıcısı) `}`.
- `servisYoklamaSifirla()` — haritayı ve zamanlayıcıyı kapatır, `SY`'yi baştan kurar. `26-baslat.js`'in
  `oturumDurumunuSifirla`'sı çağırır; o da çıkışta ve portal (kişilik) değişince ([08c-kisilikler.md](08c-kisilikler.md))
  çalışır: sonraki kişi öncekinin servisini ve bekleyen işaretlerini görmez.
- `syHaritaKapat()` — `SY.harita.yokEt()` ve zamanlayıcıyı temizler.

### Küçük yardımcılar

- `syDonemAdi(donem)` — "Akşam" / "Sabah". `syDonem(d)` — `d.donem` (işaret dönemi) yoksa `d.listeDonemi` (aralık dışında
  listenin dönemi).
- `syDonemSeferi(d)` — açık sefer bu dönemin seferiyse onu, değilse `null` (sabah okula gidiş, akşam eve dönüş).
- `syNitelik(ad, deger)` — `[data-id="…"]` biçiminde, değeri `JSON.stringify` ile tırnaklayan güvenli CSS nitelik seçicisi.
- `syOgrenci(id)` — `SY.veri.ogrenciler` içinden öğrenci.
- `syVeriAl()` — `GET /api/servis/yoklama[?servisId=]`. Seçili servis artık bu servisçinin değilse (404) seçimi boşaltıp
  ilk servisle yeniden ister. Cevabı `SY.veri`'ye, servisin kimliğini `SY.servisId`'ye yazar.

### Sayfa

- `servisYoklamaSayfasi()` — [08-ana-sayfa.md](08-ana-sayfa.md)'deki `SAYFALAR.ana` servisçide bunu döner. Haritayı
  kapatır, yoldaki işaret durumunu sıfırlar, veriyi alır ve çizer:
  - başlık "YOKLAMA"; altında tek servisliyse servisin adı ve plakası, değilse okulun adı;
  - birden çok servisi varsa servis düğmeleri (`data-act="sy-servis"`, seçili olan vurgulu);
  - servisi yoksa yalnız sunucunun iletisi ("Sana henüz bir servis atanmadı. …");
  - bağlantı güvenli değilse (`isSecureContext`) turuncu "Konum yalnızca güvenli (https) bağlantıda gönderilir; yoklama
    yine de alınır…";
  - dört boş kutu `#syUst`, `#syListe`, `#syAlt`, `#syNotlar` ve "Harita" kartı (`#syHaritaAlan`).
  Sonra: telefonda bu servis için sürmekte olan konum gönderimi (`S._sefer`) sunucuda artık açık değilse durdurulur
  (`seferiDurdur`); bölümler çizilir; harita kurulur (`haritaKur(…, { etiket: 'Servis haritası' })`) ve işaretlere
  sığdırılır; dakikalık tazeleme kurulur. Okul "Servis" bölümünü kapattıysa (403 `ozellikKapali`) "Servis bölümü okulunda
  kapalı. Okul müdürü Özellikler sayfasından açabilir." kutusu; başka hata yukarı atılır (`git()` sayfaya yazar).
- `syBolumleriCiz()` — dört bölümü yeniden yazar, `seferDurumCiz()`'i çağırır; harita ve kaydırma yeri yerinde kalır.
  Klavyeyle gezen kişinin odağı (aynı `data-act`, `data-id`, `data-durum`'lu düğme) korunur.
- `sySatirYenile(id)` — tek satırı (`#sySatir_<id>`) yeniden yazar. `syOdakla(id, durum)` — sayfada başka bir öğeye odak
  yoksa odağı o satırın "Yeniden dene"sine, yoksa aynı işaret düğmesine, yoksa ilk açık düğmeye verir.
- `syTazele()` — sessiz tazeleme: veriyi alır, bölümleri ve haritayı çizer; hatayı yutar (sonraki turda yeniden dener).
- `syZamanla()` — 60 sn'lik zamanlayıcı. Zamanı gelince: sayfa artık Yoklama değilse (`S.page !== 'ana'` ya da
  `#syListe` yok) durur; sekme gizliyse, bir pencere açıksa ya da yolda işaret varsa istek atmadan yeniden kurulur;
  değilse tazeler ve yeniden kurulur.

### Çizim

- `sySayilarHtml(d)` — "12 öğrenci · 7 bindi · 1 binmedi · 3 bekliyor · 1 binmeyecek" (akşam: geldi, gelmedi, indi).
  Sıfır olanlar yazılmaz (toplam hariç). Dönemin yoklaması kapandıysa "bekliyor" yerine "işaretlenmedi".
- `syUstHtml(d)` — "Sabah yoklaması" + etiket "Bugün · 07:00–09:20" (açıksa yeşil); engel varsa sunucunun nedeni (aralık
  dışındaysa "Sıradaki: yarın sabah 07:00–09:20."); uzatmadaysa "Servis saati bitti; yoldaki sefer en çok 60 dakika daha
  sürer. İşaretlemeyi bitir."; sayılar; yoklama açıksa `sySeferHtml`.
- `sySeferHtml(d)` — bu dönemin seferi açıksa `#seferDurum_<servis>` kutusu (19e doldurur), bu telefon göndermiyorsa
  **Konum göndermeyi sürdür** (`data-act="sefer-surdur"`, `data-id` sefer, `data-servis`, `data-yon`) ve "Konum yalnızca
  bu sayfa açıkken gider: telefonu kilitleme, şarja takılı tut."; sefer yoksa sabah **Seferi başlat**
  (`sy-sefer-basla`; "Başlatmazsan ilk "Bindi" seferi kendiliğinden başlatır."), akşam sefer bir kez başlamış ama kapalıysa
  **Konum paylaşımını yeniden başlat** ("Sefer kapalı; konumun velilere görünmüyor. "İndi" işaretleri yine de gider.").
- `syListeHtml(d)` — "Öğrenciler (N)" kartı (akşam sefer başlamışsa "Serviste olanlar (N)": geldi + indi), açıklaması
  dönem ve duruma göre ("Alma sırasıyla. Her öğrencide "Bindi" ya da "Binmedi"ye bas; işaret hemen velisine gider.",
  "Bırakma sırasıyla. Öğrenciyi evine bırakınca "İndi"ye bas.", "Okulda servise gelenleri işaretle; bitince aşağıdaki
  "Başlat"a bas.", "Bugünün işaretleri.", aralık dışında "Sıradaki aralığın listesi…"); servisçi ve en az iki öğrenci
  varsa **Sırayı düzenle** (`sy-sira`). Akşam sefer başlamışsa "Geldi"/"İndi" olmayanlar ayrı "Serviste olmayanlar"
  kartına gider ("Unutulan öğrenci varsa "Geldi" işaretle; bırakma listesine girer."). Serviste öğrenci yoksa "Bu
  serviste öğrenci yok. Öğrencileri okul yönetimi ekler.".
- `syDurumEtiketi(o)` — işaretin renkli etiketi (bindi/indi yeşil, geldi mavi, binmedi/gelmedi kırmızı), işaretsizse
  "Binmeyecek" ya da "İşaretlenmedi" (gri).
- `sySatirHtml(o, d, salt)` — bir öğrenci satırı (`salt`: yönetimin salt okunur görünümü):
  - sıra numarası, ad, "7-A · Çınar durağı · ev işaretli değil" (sonuncusu yalnız servisçide);
  - "Bindi 07:42 · İndi 17:20" saatleri (akşam "Geldi …");
  - velinin "binmeyecek" işareti (turuncu): "Velisi: bugün binmeyecek · not" — işaret yalnız öbür dönem içinse dönemi de
    yazılır ("Velisi: bugün akşam binmeyecek");
  - o günün öğrenciye özel notları ("Notun: …"; yönetimde "Servisçinin notu: …");
  - servisçide ev işaretliyse **Yol tarifi** (Google Haritalar yol tarifi, yeni sekme, `noreferrer`);
  - işaret gidemediyse `role="alert"` ileti + **Yeniden dene** (`sy-yeniden`, `data-durum`);
  - yoklama açık ve öğrenci inmemişse büyük düğmeler (`button.sy-dugme`, `data-act="sy-isaret"`, `aria-pressed`): sabah
    Bindi/Binmedi; akşam sefer başlamış ve öğrenci "Geldi" ise yalnız İndi; değilse Geldi/Gelmedi. O öğrencinin işareti
    yoldayken kendi düğmeleri kilitli, gideni "Gönderiliyor..." yazar (öteki satırlara basılabilir). Düğme yoksa sağda durum
    etiketi (servisçide inen öğrenci "Eve bırakıldı").
  Satır `soluk` (velisi "binmeyecek" dedi ve işaretlenmedi) ya da `bitti` (indi) sınıfı alabilir.
- `syAltHtml(d)` — yalnız yoklama açıkken: sabah büyük **Okula vardık** (`sy-okula-vardik`) ve açıklaması; akşam sefer
  başlamadıysa büyük **Başlat** (`sy-sefer-basla`; "N öğrenci henüz işaretlenmedi."); başladıysa "N öğrenci serviste.
  Hepsi inince sefer kendiliğinden biter." ve sefer açıksa küçük **Seferi bitir** (`data-act="sefer-bitir"`, 19e).
- `syNotlarHtml(d)` — "Notlar" kartı: servisçide **Not yaz** (`sy-not-yaz`); her not "Bütün servise" ya da öğrencinin adı,
  gün etiketi, metin ve servisçide **Sil** (`sy-not-sil`). Altında varsa "Velilerin "binmeyecek" işaretleri" kartı
  (bugünden 7 gün sonrasına: ad, "Yarın sabah binmeyecek · not").
- `seferBenCiz(sigdir)` — haritaya okul (konumu girildiyse), evi işaretli öğrenciler ("3. Zeynep" — soyadsız) ve bu
  telefon bu servisin seferinde konum gönderiyorsa "Sen" işaretlerini koyar; `sigdir` doğruysa hepsini ekrana sığdırır.
  [19e-servis-konum.md](19e-servis-konum.md) her yeni konumda bunu çağırır.
- `syKonumBaslat(sf)` — güvenli bağlantı ve `navigator.geolocation` varsa `seferIzlemeyiBaslat(sf)` (19e) ve `true`;
  yoksa ya da hata atarsa `false`.

### Eylemler (`EYLEMLER`)

- `sy-servis` — `SY.servisId`'yi seçilen servise çevirip sayfayı yeniden açar.
- `syIsaretGonder(id, durum)` — `sy-isaret` ve `sy-yeniden` bunu çağırır. Aynı öğrencinin işareti yoldaysa ya da istenen
  işaret zaten konmuşsa (ve hata yoksa) hiçbir şey yapmaz. İşareti "yolda" yazar, satırı "Gönderiliyor..." çizer ve
  `POST /api/servis/yoklama { servisId, ogrenciId, durum, donem }` gönderir:
  - **Başarı:** bu arada başka servise geçildiyse dokunmaz. Cevapta yeni sefer varsa konum gönderimini başlatır
    (`syKonumBaslat`); sefer bittiyse (`bitti`) durdurur. Hâlâ yolda başka işaret varsa yalnız bu satırı yerelde günceller;
    yoksa cevaptaki tam yoklamayı (`r.yoklama`) yazar, bütün bölümleri ve haritayı çizer, aynı anda birden çok işaret
    gittiyse (`karisik`) bir kez daha sessizce tazeler. İleti: sefer bittiyse sunucununki (son işaret "İndi" ise "Herkes
    eve bırakıldı; sefer bitti.", "Gelmedi" ise "Serviste öğrenci kalmadı; sefer bitti."), sefer şimdi başladıysa "Sefer
    başladı; konumun servisteki öğrencilerin velilerine görünüyor.".
  - **409 ve `donemDegisti` / `aralikDisi` / `kapandi`:** dönem değişti ya da yoklama kapandı → Yoklama ekranı
    açıksa sayfa sunucudan yeniden açılır ve sunucunun iletisi gösterilir.
  - **Başka hata:** satıra kırmızı ileti (sunucunun iletisi; cevap hiç gelmediyse "Gönderilemedi: internet bağlantısı
    yok.") ve **Yeniden dene**; odak o satıra döner.
- `sy-sefer-basla` — sabah "Seferi başlat", akşam "Başlat" ve "Konum paylaşımını yeniden başlat":
  - akşam, sefer başlamamışken: işaretsiz öğrenci varsa adlarıyla onay ("3 öğrenci işaretlenmedi: Zeynep, Can (velisi:
    binmeyecek), Ali. "Geldi" işaretlenmeyen öğrenci bırakma listesine girmez. Yine de başlatılsın mı?"); hepsi işaretli
    ama kimse "Geldi" değilse "Servise binen ("Geldi") öğrenci yok. … Sefer kendiliğinden bitmez; bitince "Seferi bitir"e
    basarsın.";
  - sabah, güvenli bağlantı ya da konum yoksa: "Bu bağlantıda konum alınamıyor. Okulun sitesine https ile gir." (uyarı
    kutusu) ve durur.
  Sonra "Başlatılıyor..." → `POST /api/servis/sefer-basla { servisId }` → konum gönderimini başlatır, sayfayı yeniden açar
  ve sunucunun iletisini gösterir (konum başlamadıysa turuncu, "… Bu bağlantıda konum gönderilemiyor (https gerekir);
  yoklama yine de sürer." ekiyle). 409'da sayfa yeniden açılıp ileti gösterilir; başka hata uyarı kutusunda.
- `sy-okula-vardik` — işaretsiz (ve "binmeyecek" denmemiş) öğrenci sayısıyla onay ("2 öğrenci işaretlenmedi. Okula
  varıldı mı? … Sonra işaretler değiştirilemez.") → `POST /api/servis/okula-vardik { servisId }` → bu telefonun bu
  servisteki gönderimini durdurur, cevaptaki yoklamayı çizer, başa kaydırır, ileti ("Okula varıldı; sefer bitti. 5
  öğrencinin velisine haber gitti."). 409'da sayfa yeniden açılır.

### Sırayı düzenle

- `sySiraListesi(d, donem)` — öğrencileri o dönemin kayıtlı sırasına (`siraSabah` / `siraAksam`), sırası olmayanları sona
  ve ada göre (Türkçe) dizip kimlik listesi döner; sunucunun `siraliListe`'siyle aynı kural.
- `sy-sira` — `SY.sira = { servisId, donem (ekrandaki dönem), liste, degisti }` ve "Sırayı düzenle" penceresi.
- `sySiraCiz(odak)` — "Sabah (alma)" / "Akşam (bırakma)" sekmeleri (`sy-sira-donem`), "Veli "5. sırada, önünde 2 öğrenci"
  görür." ipucu ve numaralı liste: her öğrencide ad, durak, **yukarı** / **aşağı** düğmeleri (`sy-sira-yukari`,
  `sy-sira-asagi`; 44 px, ekran okuyucu için "Zeynep Şahin bir yukarı" etiketi; ilkinde yukarı, sonuncusunda aşağı kapalı).
  Taşımadan sonra odak aynı düğmede kalır; uca gelip kapandıysa öbür yöndeki düğmeye geçer.
- `sySiraTasi(id, yon, act)` — iki komşuyu yer değiştirir, `degisti` işaretler, yeniden çizer.
- `sy-sira-donem` — öbür döneme geçer; kaydedilmemiş değişiklik varsa "Bu sıradaki değişiklik kaydedilmedi. Yine de
  geçilsin mi?".
- `sy-sira-kaydet` — `POST /api/servis/sira { servisId, donem, sira: [kimlikler] }` → pencere kapanır, sessiz tazeleme,
  "Sabah sırası kaydedildi."; hata pencerede (`#sySiraMesaj`).

### Notlar

- `sy-not-yaz` — "Velilere not" penceresi: **Kime?** ("Bütün servis (bütün velilere)" ya da bir öğrenci), **Hangi gün
  için?** (bugünden 7 gün sonrasına sekiz seçenek: "Bugün · 1 Ekim Perşembe", "Yarın · …", …), **Not** (en çok 200,
  sayaçlı), "Velisine bildirim gider; not o günün listesinde de görünür.".
- `sy-not-kaydet` — boşsa "Notu yaz (en çok 200 harf)."; `POST /api/servis/not { servisId, ogrenciId?, tarih (bugünse
  ''), metin }` → pencere kapanır, tazeleme, "Not kaydedildi. Velilere haber gitti.".
- `sy-not-sil` — `confirm('Not silinsin mi? Velilerin ekranından da kalkar.')` → `POST /api/servis/not-sil { id }` →
  tazeleme + "Not silindi.".

### Yönetimin salt okunur görünümü

- `syYonetimGorunumu(d)` — HTML döner (pencerenin gövdesi). Servis yoksa sunucunun iletisi. Değilse: "Sabah yoklaması" +
  gri etiket (gün · aralık); aralık dışındaysa "Şu an servis saati değil (sabah 07:00–09:20, akşam 16:30–19:00). Aşağıda
  sıradaki aralığın listesi ve velilerin işaretleri var.", değilse "Salt okunur: işaretleri servisçi koyar. Sefer başladı:
  07:31 · Okula varış: 08:05." (akşam "Yoklama bitti: …"); sayılar; her öğrenci `sySatirHtml(…, true)` (düğme, yol tarifi,
  "ev işaretli değil", hata yok); en altta bütün servise yazılmış notlar ("Servisçinin notu (yarın): …").

## Kimle konuşur?

- Parçalar ad sırasıyla tek bir IIFE'de birleşir (`/js/app.js`; [../../../sunucu/http.md](../../../sunucu/http.md)
  `birlesikOku`). Bu dosyanın çağırdıkları (hepsi çalışma anında; tanımlayanların bir kısmı bu dosyadan önce birleşir):
  - `S.page` ([00-durum.md](00-durum.md)); `S._sefer` (bu telefonun konum gönderimi; alanı
    [19e-servis-konum.md](19e-servis-konum.md)'deki `seferIzlemeyiBaslat` kurar, `seferiDurdur` boşaltır); `$`, `esc`, `api`,
    `EYLEMLER` ([01-yardimcilar.md](01-yardimcilar.md));
    `ik` ([02-ikonlar.md](02-ikonlar.md)); `modalAc`, `modalKapat`, `mesajGoster`, `sayfaMesaji`
    ([03-mesaj-modal.md](03-mesaj-modal.md)); `dugmeBekle`, `dugmeBitir` ([05-giris.md](05-giris.md)); `yaz`, `hero`,
    `bosKutu` ([07-yonlendirme.md](07-yonlendirme.md)); `hataGoster` (`25-tiklama.js`).
  - [19c-okul-hayati.md](19c-okul-hayati.md) — `svGunEtiketi` ("bugün", "yarın", "3 Ekim Cumartesi"), `svBuyukBas`,
    `svIlkAd` (soyadsız ad), `svTrGun` (Türkiye günü, cihaz saatinden), `svGunAdi`, `svIsaretDonemi`, `servisAralikMetni`,
    `servisSonrakiMetni`.
  - [19d-harita.md](19d-harita.md) — `haritaKur` → `isaretler`, `sigdir`, `yokEt` (işaret türleri `okul`, `ev`, `ben`).
  - [19e-servis-konum.md](19e-servis-konum.md) — `seferIzlemeyiBaslat`, `seferiDurdur`, `seferDurumCiz`; düğmelerini bu
    dosyanın çizdiği `sefer-surdur` ve `sefer-bitir` eylemleri orada (ikisi de sonunda `git(S.page)` ile bu sayfayı yeniden
    açar).
- Onu kullananlar:
  - [08-ana-sayfa.md](08-ana-sayfa.md) — `SAYFALAR.ana` servisçide `servisYoklamaSayfasi()` döner.
  - [19c-okul-hayati.md](19c-okul-hayati.md) — yönetimin Servisler sayfasındaki **Bugünkü yoklama**
    (`servis-yoklama-bak`): `GET /api/servis/yoklama?servisId=` → `syYonetimGorunumu(d)` pencereye.
  - [19e-servis-konum.md](19e-servis-konum.md) — her yeni konumda `seferBenCiz()`; konum ucu 409 verince servisçi bu
    sayfadaysa `git('ana')`.
  - `26-baslat.js` — `oturumDurumunuSifirla` içinde `servisYoklamaSifirla()` (bu sıfırlamayı portal değişiminde
    [08c-kisilikler.md](08c-kisilikler.md) de çağırır); çıkışta açık sefer varsa önce `POST /api/servis/sefer-bitir`.
- Sunucu uçları ([../../../sunucu/bolumler/okul-hayati.md](../../../sunucu/bolumler/okul-hayati.md); dönem ve aralık hesabı
  [../../../sunucu/yardimci/servis-pencere.md](../../../sunucu/yardimci/servis-pencere.md); okul "Servis"i kapattıysa
  hepsi 403 `ozellikKapali`, [../../../sunucu/bolumler/ozellikler.md](../../../sunucu/bolumler/ozellikler.md)):
  - `GET /api/servis/yoklama[?servisId=]` — servisçi kendi servislerini, yönetim (`servis.yonet`) okulun servislerini
    açar; başkası 403 "Servis yoklamasını servisçi alır; okul yönetimi görür."; listede olmayan servis 404. Cevap:
    `{ tarih, donem (aralıkta ya da uzatmada; yoksa null), listeDonemi, aralikta, uzatma, acik (yalnız servisçide ve engel
    yoksa), engel, duzenleyebilir, saatler: { sabahBas, sabahBit, aksamBas, aksamBit }, aralik: { bas, bit } | null,
    sonraki: { tarih, donem, bas, bit } | null, servisler: [{ id, ad, plaka }], servis: { id, ad, plaka, sabah, aksam },
    okul: { ad, enlem, boylam }, sefer: { id, yon, donem, baslangic, sonKonum } | null, gun: { basladi, basladiSaat,
    bitti, bittiSaat }, sayilar, ogrenciler: [{ id, ad, sinif, durak, sira, siraSabah, siraAksam, ev: { enlem, boylam } |
    null, durum, bindiSaat, indiSaat, binmeyecek, veliIsareti: { tarih, sabah, aksam, not } | null }], notlar: [{ id,
    ogrenciId, ogrenciAd, genel, tarih, metin, saat }], binmeyecekler: [{ ogrenciId, ad, tarih, sabah, aksam, not }] }`.
    Servisi olmayan servisçiye aynı biçimde boş cevap.
  - `POST /api/servis/yoklama { servisId, ogrenciId, durum, donem }` — yalnız o servisin servisçisi (403); öğrenci serviste
    değilse 404; yoklama kapalıysa 409 `{ aralikDisi, kapandi }`; istemcinin dönemi sunucununkiyle uyuşmazsa 409
    `{ donemDegisti }`; sabahta `geldi` gibi yanlış durum 400; "Başlat"tan önce "İndi" 409 `{ baslamadi }`; "Geldi"
    olmayana "İndi" 409; eve bırakılanın işareti değişmez (409). Cevap `{ message, bitti, sefer: { id, yon } | null,
    yoklama }`. Veliye bildirim bir kez (bindi → binmedi olursa bir kez "Düzeltme: …"; velisi "binmeyecek" dediyse
    binmedi/gelmedi bildirimi gitmez); öğrenciye gitmez.
  - `POST /api/servis/sefer-basla { servisId }` — yalnız servisçi; aralık dışında 409 `{ aralikDisi, sonraki }`, dönem
    bittiyse 409 `{ kapandi }`; sürmekte olan sefer varsa o döner ("Sefer zaten sürüyor."); akşam "Geldi" yoksa iletiye
    "… sefer kendiliğinden bitmez. Bitince "Seferi bitir"e bas." eklenir. Cevap `{ sefer: { id, yon }, donem, bekleyen,
    serviste?, message }`.
  - `POST /api/servis/okula-vardik { servisId }` — yalnız sabah (409 `aralikDisi`); ikinci kez "Okula varış zaten
    kaydedildi."; cevap `{ message, bildirilen, yoklama }`.
  - `POST /api/servis/sira { servisId, donem, sira }` — liste servisin öğrencileriyle birebir aynı olmalı (400 "… Sayfayı
    yenileyip yeniden dene.").
  - `POST /api/servis/not { servisId, ogrenciId?, tarih, metin }` — servisçi başına saatte 60 (429); tarih bugün ile 7
    gün sonrası arası (400); metindeki her boşluk/satır sonu tek boşluğa iner, 200'de kesilir; velilere "Servisçiden not:
    …" (kardeşlerin velisine tek bildirim).
  - `POST /api/servis/not-sil { id }` — yalnız servisçi; başka servisin notu 404.
  - Konum uçları (`/api/servis/konum`, `/api/servis/sefer-bitir`) [19e-servis-konum.md](19e-servis-konum.md)'de.
- Veri: [../../../sunucu/veri/depo/servis-yoklama.md](../../../sunucu/veri/depo/servis-yoklama.md) (şema 028: yoklama,
  dönem günü, olaylar, notlar, "binmeyecek"; 30 gün saklanır),
  [../../../sunucu/veri/depo/okul-hayati.md](../../../sunucu/veri/depo/okul-hayati.md) (servisler, servis öğrencileri ve
  sırası, seferler, ev konumu).
- CSS: `public/css/parcalar/34-servis-yoklama.css` — `.sy-*` (üst kart, sayılar, satır ızgarası, numara, veli ve not
  kutuları, yol tarifi, hata kutusu, büyük işaret düğmeleri ve renkleri, `.sy-buyuk`, notlar, sıra penceresi ve
  döndürülmüş ok simgeleri `.yon-yukari`/`.yon-asagi`, yönetim görünümü; 640 px altında düğmeler adın altına iner;
  dokunmatikte her hedef en az 44 px); `27-harita-ortak.css` — `.harita-kap`, `.sefer-durum`; `24-veli.css` —
  `.cocuk-seridi` (servis düğmeleri şeridi); `19-mesajlar.css` — `.sekme`, `.sekme-satir`; `04-kartlar.css` — `.kart`,
  `.satir`, `.etiket` renkleri; `02-form.css` — `.msg`, `.hint`.
- Rol: servisçi (kendi ana sayfası); okul yönetimi — müdür ve `servis.yonet` yetkilisi — yalnız salt okunur pencere.
  Veli ve öğrenci bu ekranı görmez; onların servis kartı [19c-okul-hayati.md](19c-okul-hayati.md)'de.

## Nasıl çalışır (adım adım)?

### Sabah

```
giriş ─► SAYFALAR.ana ─► servisYoklamaSayfasi ─► GET /api/servis/yoklama
   d.donem = 'sabah', d.acik ─► [Sabah yoklaması · Bugün · 07:00–09:20] [Seferi başlat]
   liste (alma sırası) ─► [Bindi] [Binmedi] ... ─► [Okula vardık]
"Bindi" (Zeynep) ─► syIsaretGonder ─► satır "Gönderiliyor..." ─► POST /api/servis/yoklama
   sunucu: dönem aynı mı? ─► yaz ─► ilk "Bindi"yse sefer aç ─► veliye "Zeynep 07:42'de servise bindi."
   cevap: sefer ─► syKonumBaslat ─► 19e watchPosition ─► haritada "Sen"
          yoklama ─► bölümler yeniden ─► "Sefer başladı; …"
"Okula vardık" ─► onay ─► POST /okula-vardik ─► seferiDurdur ─► "Okula varıldı; sefer bitti. 5 öğrencinin velisine haber gitti."
```

### Akşam

```
liste ─► [Geldi] [Gelmedi] ... ─► [Başlat] ─► (işaretsiz varsa onay) ─► POST /sefer-basla
   ─► "Serviste olanlar" (bırakma sırası): [İndi]   "Serviste olmayanlar": [Geldi] [Gelmedi]
"İndi" (son öğrenci) ─► sunucu: serviste "Geldi" kalmadı ─► sefer biter ─► cevap bitti
   ─► seferiDurdur ─► "Herkes eve bırakıldı; sefer bitti."
```

### Aynı anda birden çok işaret

```
Bindi(A) ─► ucusta 1          Bindi(B) ─► ucusta 2, karisik
A döndü ─► ucusta 1 ─► yalnız A satırı yerelde
B döndü ─► ucusta 0 ─► SY.veri = B'nin cevabı ─► hepsi çizilir ─► karisik ─► syTazele (son durum)
```

### Arka planda

Sayfa açıkken her 60 sn: sekme görünür, pencere kapalı ve yolda işaret yoksa sessiz tazeleme (veli az önce "binmeyecek"
dediyse ya da dönem değiştiyse ekran güncellenir). Sunucu dönemi değiştirdiyse bir sonraki işaret 409 alır ve sayfa
yeniden açılır.

## Dikkat!

- **Dönem sunucunundur.** İstemci işaretle birlikte gördüğü dönemi (`donem`) yollar; sunucu kendi saatiyle başka bir dönem
  buluyorsa (ör. telefonda sayfa sabahtan beri açık, saat akşam olmuş) 409 `donemDegisti` döner ve sayfa baştan yüklenir;
  yanlış döneme işaret yazılmaz.
- **Cevapların sırası karışabilir.** Hızlı art arda basılan işaretler aynı anda gider; her cevap yalnız kendi satırını
  günceller, sonuncusu bütün listeyi yazar ve bir tazeleme daha yapılır. Bu yüzden `SY.veri` bir an için sunucuyla birebir
  aynı olmayabilir; dakikalık tazeleme yolda işaret varken bekler.
- **http'de yanıltıcı ileti (kod okumasına göre).** Güvenli olmayan bağlantıda (ya da konum desteği yokken) sabahın
  "Seferi başlat"ı reddedilir, ama ilk "Bindi" sunucuda seferi yine açar ve ekranda "Sefer başladı; konumun servisteki
  öğrencilerin velilerine görünüyor." yazar — oysa bu telefondan konum gitmez (`syKonumBaslat`'ın sonucu iletide
  kullanılmıyor). Aynı anda sefer kutusu (19e'nin `seferDurumCiz`'i) "Sefer açık ama bu telefondan konum gitmiyor." der
  ve "Konum göndermeyi sürdür" düğmesi çıkar; ekran kendi kendisiyle çelişir. Sayfanın üstündeki turuncu https uyarısı
  durumu anlatıyor; ileti de `sy-sefer-basla`'daki gibi koşullu olmalı.
- **Başka servise geçmek açık seferi durdurmaz.** `S._sefer` tektir; sayfa yalnız **gösterilen** servisin seferi sunucuda
  kapandıysa gönderimi durdurur. A servisinin seferi sürerken B'ye geçen servisçinin telefonu A için konum göndermeyi
  sürdürür; A'nın durum kutusu ekranda görünmez.
- **`sy-servis` hata verirse yalnız konsola düşer.** Eylemin döndürdüğü söz `25-tiklama.js`'te yakalanmaz; yeni servisin
  verisi alınamazsa harita çoktan kapatılmış, eski liste ekranda kalmış olur ve kişi bir ileti görmez. (409 sonrası
  sayfayı yeniden açma yollarında da aynı.)
- **Yol tarifi evin koordinatını Google'a götürür.** Servisçi **Yol tarifi**'ne basınca öğrencinin evinin enlem/boylamı
  Google Haritalar adresine konur (yeni sekme, `noreferrer`). Bu, kişinin kendi seçimiyle açılan bir bağlantı; ama
  aydınlatma metni (`public/kvkk/kvkk.html`) "iki dış hizmet" (OpenStreetMap ve telefon bildirimi) sayıyor, Google
  Haritalar bağlantılarını anmıyor. "KVKK ve onay metinleri TAM denetimi" işine.
- **Notun satır sonları kaybolur.** Not kutusu çok satırlıdır ama sunucu her boşluk ve satır sonunu tek boşluğa indirir.
  Gün seçenekleri telefonun saatinden (UTC+3) hesaplanır; telefonun saati yanlışsa seçilen gün sunucunun "bugün–7 gün"
  aralığına düşmeyebilir (400).
- **Yönetim görünümünde öğrenciye özel ileri tarihli notlar görünmez.** Satırlarda yalnız listenin gününe ait öğrenci
  notları, altta ise bütün servise yazılmış notların hepsi (tarihleriyle) gösterilir.
- **Sıra penceresi bir seferde bir dönemi kaydeder.** Sekme değiştirmek kaydedilmemiş sırayı (onayla) atar. Kaydederken
  servisin öğrenci listesi bu arada değiştiyse sunucu 400 verir; sayfayı yenileyip yeniden düzenlemek gerekir. Sıra
  aralık dışında da düzenlenebilir.
- **Akşam "Geldi" yokken "Başlat":** sefer açılır ama kendiliğinden bitmez (bitiş son "İndi"/"Gelmedi" ile olur); servisçi
  "Seferi bitir"e basmalıdır. Sayfa bunu iki ayrı onay ve iletiyle söyler.
- **"Okula vardık"tan sonra sabah işaretleri değişmez** (sunucuda dönem "bitti"); "Bindi" ↔ "Binmedi" ancak ondan önce
  düzeltilir. Akşam, eve bırakılan öğrencinin işareti değişmez.
- **Harita sayfadan çıkınca hemen kapanmaz.** `git()` bu haritayı kapatmaz; Yoklama'ya yeniden girince ya da çıkışta
  kapanır, dakikalık zamanlayıcı sayfanın değiştiğini görüp kendini durdurur.
- **Erişilebilirlik:** işaret gidip satır yeniden çizilince odak aynı öğrenciye döner; düğmelerde `aria-pressed`, hata
  kutusunda `role="alert"`, sıra oklarında okunur etiket var. Yeni bir yeniden çizim eklersen `syBolumleriCiz`'in odak
  koruma kalıbını izle.
- **Güvenlik:** bütün adlar, duraklar, notlar `esc`'li; CSS seçicileri `syNitelik` ile kurulur (kimlikteki tırnak seçiciyi
  bozamaz). İşareti kimin koyabileceğine, dönemine ve bildirimlere tamamen sunucu karar verir; bu ekran salt bir
  kumandadır.

## Testleri

- `testler/test-servis-yoklama.js` — servis saatleri (müdür seçer, bozuk saat ve yetkisiz öğretmen reddi, işlem kaydı);
  aralık dışı (yoklama kapalı, neden ve sonraki aralık, işaret ve sefer yok, haritada canlı bilgi yok); sıra (kaydetme,
  eksik/başka servisçi reddi, yeni öğrencinin sona eklenmesi); sabah yoklaması (velinin "binmeyecek"i, ilk "Bindi"nin
  seferi başlatması, "önünde N", veliye bir kez bildirim ve öğrenciye gitmemesi, bindi → binmedi düzeltmesi, sabahta
  "geldi" 400, "Okula vardık" ve tekrarlanmaması, yönetimin salt okunur görmesi, başka okul/servisçi 404/403); akşam
  yoklaması (akşam sırası, "Başlat"tan önce "İndi" yok, geldi/gelmedi bildirimleri, "Geldi" olmayana "İndi" yok, ikinci
  "Başlat" aynı sefer, yaklaşma bildirimi, eve bırakılanın değişmemesi, son "İndi"de seferin bitmesi); notlar; "binmeyecek";
  uzatma ve aralık bitince seferin kapanması; aynı anda gelen işaretler ve "Başlat"lar; cihaz anahtarı ve uygulama oturumu.
- `testler/test-servis-pencere.js` (sunucusuz) — saat aralığı hesabı (Türkiye saati, bitiş dakikası, 60 dakikalık uzatma,
  sonraki aralık, gece yarısı, saat eki "07:42'de").
- `testler/test-servis-konum.js` — sefer ve konum, harita yetkileri; `testler/test-ozellikler.js` — Servis kapalıyken
  yoklama, sıra, not ve "Okula vardık" uçlarının 403'ü; `testler/yetki-denetimi.js` — yoklamayı yalnız müdür ve servisçinin
  açabilmesi, atanmamış servisçinin işaret/sıra/not/"Okula vardık" isteklerinin reddi; `testler/girdi-denetimi.js` —
  bozuk girdilerle bu uçların 500 vermemesi.
- `testler/buton-denetimi.js` — `sy-*` eylemlerinin ve buradan çizilen `sefer-surdur`/`sefer-bitir`'in karşılığı;
  `testler/yazim-denetimi.js` ekran metinleri.
- Bu dosyanın tarayıcıda çalışan testi yok (çizim, sıra karışması, odak koruma elle denenir).
- Elle (sunucu 3200'de; `testler/seed.js` servis saatlerini sabah 00:00–11:59, akşam 12:00–23:59 kurar, yani her an bir
  dönem açıktır; servisçi hesabını müdürle **Servisler → Servisçi ekle** ile açıp bir servise ve öğrencilere bağla):
  servisçiyle gir → Yoklama; bir öğrencide "Bindi" (ilk "Bindi" seferi başlatır; bilgisayarda `localhost` güvenli sayılır,
  konum izni ister); iki öğrenciye hızlıca art arda bas; tarayıcının ağını kapatıp bir işaret dene → "Yeniden dene";
  **Sırayı düzenle** → oklarla taşı → Kaydet; **Not yaz**. Müdürle Servisler → **Bugünkü yoklama**: aynı liste salt okunur.

## Son durum

- `git log`: tek commit — `24050a2 commit 518` (2026-09-27, servis yoklaması işi). Dosya bugünkü 619 satırıyla bu
  commit'te eklendi ve o günden beri değişmedi. Aynı commit servisçinin eski "Seferlerim" sayfasını
  `19e-servis-konum.js`'ten kaldırdı (`seferBenCiz` buraya taşındı), `08-ana-sayfa.js`'te servisçinin ana sayfasını bu
  ekrana bağladı, `26-baslat.js`'e `servisYoklamaSifirla`'yı, `19c-okul-hayati.js`'e yönetimin "Bugünkü yoklama"
  penceresini ve `34-servis-yoklama.css`'i ekledi; sunucuda yoklama uçları, şema 028 ve `servis-pencere.js` geldi;
  `public/kvkk/kvkk.html` güncellendi; `testler/test-servis-yoklama.js` ve `testler/test-servis-pencere.js` eklendi.
- Kalıntı: eski "Seferlerim" sayfasının sunucu ucu `GET /api/servis/seferim` (okul-hayati.js) duruyor; web arayüzünde onu
  çağıran parça yok (bugünkü Android uygulaması da çağırmıyor), yalnız testler (`test-servis-konum.js`,
  `test-servis-yoklama.js`, `yetki-denetimi.js`) kullanıyor. Silinip silinmeyeceği ayrı bir karar.
- Bilinen açıklar (kod değiştirilmedi): http'de "Sefer başladı; konumun … görünüyor" iletisinin konum gitmese de çıkması,
  başka servise geçince eski seferin gönderiminin sürmesi, `sy-servis` hatasının sessiz kalması, yol tarifi bağlantısının
  aydınlatma metninde anılmaması.
- Planlı işlerden bu dosyaya dokunması beklenenler (DEVAM.md 4. bölüm):
  - "Optimizasyon + saklama süreleri": tanım, servisçinin yoklama sayfasının 1 dakikalık tazelemesinin **olduğu gibi
    kalacağını** söylüyor.
  - "Tek kişi tek hesap + portallar öğrencide de": servisçi de portal olacak (iki okulda tek hesap, "Servisçi · okul");
    portal değişince `servisYoklamaSifirla` (bugün rol değişiminde de çağrılıyor) ve `S._sefer` mantığı birden çok okulda
    doğru kalmalı.
  - "Android yerel uygulama": uygulamanın servisçi Yoklama ekranı aynı uçları kullanır (sabah/akşam akışı, sıra, notlar,
    arka planda konum); bu yüzden uçların cevabı ekrandan bağımsız ve eksiksiz kalmalı.
  - "KVKK ve onay metinleri TAM denetimi": Google Haritalar yol tarifi bağlantısı. "Mesaj ayarları …": bildirim panelinde
    "Servis" sekmesi. "Çok dil": ekran metinleri `c()` kataloğuna. "Ekran turu + albüm": servisçi Yoklama
    görüntüleri yeniden alınacak.
