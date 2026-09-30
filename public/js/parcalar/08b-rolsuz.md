# public/js/parcalar/08b-rolsuz.js

Millî Eğitim Bakanlığı okul listesinden okul seçme alanı (il, ilçe, yazarken arama, "Okul listede yok"); bugün yalnız
sistem yöneticisinin "Okul aç" penceresi kullanır — adındaki "rolsüz" eski bir işten kalma.

## Bu dosya ne yapar?

Sistem yöneticisi yeni bir okulu Eğitim Evi'ne açarken okulu elle yazmak yerine Bakanlığın ~67 bin okulluk
listesinden seçer: il seçer (ilçe listesi kendiliğinden dolar), okulun adından bir iki kelime yazar, liste daralır,
doğru okula basar. Yazım hatası da sorun değildir: sunucu "ortaoklu" yazılanı "ortaokulu" diye düzeltip "…yerine
… diye aradık" der, hiç tutmazsa "en yakın sonuçları" verir. Yeni açılmış ya da adı değişmiş bir okul listede yoksa
"Okul listede yok" bölümüne adı elle yazılır.

Bu dosya o alanın hem HTML'ini (`okulSecimAlani`) hem davranışını (`okulSecimiKur`) taşır; seçilen okul `seciliOkul`
değişkeninde durur. Alanı açan ve seçimi okuyan yönetim paketindeki `public/js/yonetim/09-yonetici.js`'tir ("Okullar →
Okul aç"); sunucuya giden okul açma isteği (`POST /api/admin/okul-ac`) oradadır.

Adı neden "rolsuz"? Eskiden rolsüz yetişkin hesabı "Okulumu kaydet" diye müdürlük başvurusu yapardı ve bu dosya o
başvuru formuydu. 516'da başvuru kalktı (okulu artık kişi kodunu alan yönetici açar), formdan geriye yalnız okul seçme
kısmı kaldı. Dosya adı değişmedi.

Kim görür: yalnız sistem yöneticisi (yönetim paketinde). Kod herkese giden `/js/app.js`'te de vardır ama orada hiçbir
ekran çağırmaz (bkz. Dikkat).

## İçinde neler var?

### Durum değişkenleri

- `ilceHaritasi` — `{ "Ankara": ["Çankaya", …] }`; `GET /api/okullar/iller`'den dolar.
- `seciliOkul` — listeden seçilen okul `{ id, ad, il, ilce, tip }` ya da `null`. `09-yonetici.js` okul açarken bakar:
  doluysa `mebSchoolId` gönderir, boşsa "Okul listede yok"taki adı (`schoolName`).
- `okulAramaSayaci` — yazarken bekletme (debounce) zamanlayıcısı.
- `okulAramaDurum` — `{ sira, onbellek, anahtarlar }`: her aramanın sıra numarası (geç gelen eski cevap yenisinin üstüne
  yazmasın), adres → cevap önbelleği ve önbelleğe giriş sırası (en çok 60 adres; dolunca en eskisi atılır).

### Alanın HTML'i

- `okulSecimAlani()` — döner:
  - `div.row2`: İl (`select#bIl`, önce "Yükleniyor...") ve İlçe (`select#bIlce`, "Önce il seç...");
  - "Okulu bul": `div.okul-ust` içinde `input#bOkulAra` (`type="search"`, `autocomplete="off"`, `enterkeyhint="search"`,
    `aria-controls="bOkulSonuc"`, `aria-describedby="bOkulIpucu"`) ve tür seçimi `select#bOkulTip` ("Tüm türler");
    ipucu `#bOkulIpucu` ("Kelimelerin sırası önemli değil. İl seçersen yalnızca o ilde, seçmezsen Türkiye genelinde
    arar."); sonuç kutusu `#bOkulSonuc` (`aria-live="polite"`: ekran okuyucu sonuçları duyurur); seçilen okul kutusu
    `#bOkulSecili` (gizli);
  - `details.okul-elle` "Okul listede yok": `input#bOkulAd` (en çok 140 karakter) ve açıklama.

### Kurulum ve olaylar

- `okulSecimiKur()` — alan sayfaya konduktan SONRA çağrılır. `seciliOkul`'u sıfırlar; `#bIl` yoksa çıkar.
  - `GET /api/okullar/iller` → il listesi ve `ilceHaritasi`; tür listesi (`tipler`); ipucu "67.661 okul aranabilir. …"
    (`toplam`, Türkçe binlik ayraçla). İstek düşerse (sunucuda okul listesi yok: 503) il listesi `S.meta.cities`'ten
    (`/api/meta`) kurulur, tür ve ilçe listesi boş kalır.
  - İl değişince `ilceleriDoldur` + hemen arama; ilçe ya da tür değişince hemen arama; arama kutusuna yazınca 250 ms
    bekleyip arama.
  - Klavye: arama kutusunda Enter → beklemeden ara; ↓ → ilk sonuca git; Esc → sonuçları temizle. Sonuçlar arasında
    ↓/↑ gezinir, en üstte ↑ ya da Esc arama kutusuna döner. Sonuca tıklamak ya da odaktayken Enter/boşluk → `okulSec`.
- `ilceleriDoldur(il)` — il listesi yüklenemediyse (`ilceHaritasi` boş) ilçe açılır listesini bir yazı kutusuyla
  (`input#bIlce`, "İlçe adını yaz", en çok 60) değiştirir: yoksa listede olmayan okul hiç açılamazdı. Yüklendiyse: il
  seçilmemişse "Önce il seç...", ilin ilçesi yoksa tek seçenek "Merkez", varsa "Tümü / seç..." + ilçeler.

### Arama

- `okulAramaBaslat(gecikme)` — önceki bekleyeni iptal eder, `gecikme` (verilmezse 250 ms) sonra `okulAramaYap`.
- `okulAramaYap()` — bir okul zaten seçiliyse aramaz. Kelimeler `aramaSadeTR` ile sadeleşir (Türkçe harfler düzlenir,
  noktalama boşluk olur; sunucudaki `aramaSade` ile aynı kural). Kelime de il de yoksa sonuçları temizler; il yokken
  toplam iki harften azsa "En az iki harf yaz ya da önce ilini seç." İstek: `GET /api/okullar/ara?limit=25&q=…&il=…&ilce=…&tip=…`.
  Aynı adres önbellekteyse sunucuya gitmez. Beklerken eski sonuçlar silinmez, `yukleniyor` sınıfıyla soluklaşır (liste
  yanıp sönmesin); hiç sonuç yoksa "Aranıyor..." yazar. Cevap gelince yalnız hâlâ en son arama ise çizer. Hata:
  "Arama yapılamadı: <ileti>" + "Tekrar dene" (`data-act="okul-ara-tekrar"`).
- `okulSonuclari(d, sorgu, kelimeler, filtreler)` — sonuç HTML'i:
  - hiç okul yoksa: '"<sorgu>" için <il / ilçe / tür> içinde okul bulunamadı.', filtre varsa "Tüm Türkiye'de ara"
    (`data-act="okul-ara-genislet"`), ve "Okulun adından tek bir kelime yazmayı dene (ör. yalnızca "Cumhuriyet"). Yine
    çıkmazsa aşağıdaki Okul listede yok bölümüne adını yaz."
  - `d.duzeltme` varsa: '"ortaoklu" yerine "ortaokulu" diye aradık.';
  - `d.yakin` ise: "Yazdığın kelimelerin hepsini içeren okul … yok. En yakın sonuçlar:" (filtre varsa genişletme
    düğmesiyle); değilse ve `toplam` gösterilenden fazlaysa "N sonuçtan ilk 25 tanesi gösteriliyor. Bir kelime daha
    yazarak ya da il seçerek daraltabilirsin."
  - her okul bir `button.okul-satir` (`data-okul-id`, `-ad`, `-il`, `-ilce`, `-tip`): ad, aranan kelimeler
    `aramaVurgula` ile `<mark>`'lı (sunucunun `vurgu` listesi varsa o kelimeler), özel okulsa "Özel" rozeti; altında
    "il / ilçe · resmî tür".
- `EYLEMLER['okul-ara-tekrar']` — beklemeden yeniden ara.
- `EYLEMLER['okul-ara-genislet']` — il, ilçe ve tür süzgeçlerini boşaltır, yeniden arar, arama kutusuna odaklanır.

### Seçim

- `okulSec(btn)` — düğmenin `data-okul-*` değerlerinden `seciliOkul`'u kurar; yoldaki aramayı geçersiz kılar
  (`sira++`, bekleyen zamanlayıcı iptal); sonuçları ve arama kutusunu temizler; `#bOkulSecili`'de yeşil onay simgesi,
  okulun adı, "il / ilçe · tür" ve "Değiştir" düğmesi (`#bOkulKaldir`); alanın hata işaretini kaldırır
  (`alanTemizle`); il ve ilçe kutularını okulunkine çeker; "Okul listede yok"taki adı siler; arama satırını gizler;
  odağı "Değiştir"e verir.
- `okulSecimiTemizle()` — "Değiştir": seçimi siler, seçili kutusunu gizler, arama satırını geri getirir, arama kutusuna
  odaklanır.

## Kimle konuşur?

- Çağırdıkları: `S.meta` ([00-durum.md](00-durum.md); `26-baslat.js` `/api/meta` ile doldurur), `$`, `esc`, `api`,
  `EYLEMLER` ([01-yardimcilar.md](01-yardimcilar.md)); `ik('onay', …)` ([02-ikonlar.md](02-ikonlar.md)); `alanTemizle`
  ([04a-form-alanlari.md](04a-form-alanlari.md)); `aramaSadeTR`, `aramaVurgula` ([05-giris.md](05-giris.md)).
- Sunucu uçları (ikisi de girişsiz; [../../../sunucu/bolumler/kayit.md](../../../sunucu/bolumler/kayit.md) karşılar,
  veri ve arama [../../../sunucu/okullar.md](../../../sunucu/okullar.md)'de):
  - `GET /api/okullar/iller` → `{ iller: [{ ad, ilceler }], tipler, toplam }`; okul listesi yüklenmemişse 503.
  - `GET /api/okullar/ara?q=&il=&ilce=&tip=&limit=` → `{ toplam, yakin, duzeltme, okullar: [{ id, ad, il, ilce, tip,
    ozel, resmiTur, kod, vurgu }] }`; IP başına dakikada 300 arama (aşılırsa 429 "Çok fazla arama isteği. Biraz bekle.").
- Onu kullanan: `public/js/yonetim/09-yonetici.js` — `EYLEMLER['admin-okul-ac']` pencereye `okulSecimAlani()` koyar ve
  `okulSecimiKur()` çağırır; okulun adresi kutusu (`#aoKisa`) boşken odaklanınca `seciliOkul.ad`'dan (ya da `#bOkulAd`'dan)
  adres önerir; `admin-okul-ac-kaydet` `#bIl`, `#bIlce`, `seciliOkul.id` ya da `#bOkulAd`'ı
  `POST /api/admin/okul-ac`'a koyar ([../../../sunucu/bolumler/yonetici-okul.md](../../../sunucu/bolumler/yonetici-okul.md));
  sunucu `alan: 'okul' | 'il' | 'ilce'` ile dönerse hatayı bu dosyanın kutularının altına yazar. Başka kullanan yok.
- Görünüm: `public/css/parcalar/09-kayit-ekrani.css` (`.okul-ust`, `.okul-sonuc` ve `.yukleniyor` soluklaşması,
  `.okul-bilgi` / `.okul-bilgi.hata`, `.okul-satir` ve `mark`, `.okul-secili`, `.secili-ikon`, `.okul-elle`, `.baglanti`),
  `18-aktarim-kvkk.css` (`.ozel-rozet`), `02-form.css` (`.row2`, `.field`, `.hint`).
- Rol: sistem yöneticisi.

## Nasıl çalışır (adım adım)?

```
Okullar → "Okul aç" (09-yonetici.js) ─► modalAc(okulSecimAlani() + adres + müdür + disk) ─► okulSecimiKur()
   GET /okullar/iller ─► il listesi, ilçe haritası, "67.661 okul aranabilir"
yönetici "Ankara" seçer ─► ilçeler dolar ─► hemen arama (il yeter)
"ataturk anad" yazar ─► 250 ms ─► okulAramaYap: sıra=7, adres önbellekte yok
   GET /okullar/ara?limit=25&q=ataturk anad&il=Ankara&ilce=&tip=
   ... bu arada "ataturk anadolu" yazıldı → sıra=8, yeni istek
   sıra 7'nin cevabı gelir → benim(7) !== 8 → çizilmez
   sıra 8'in cevabı → okulSonuclari → düğmeler (<mark>'lı)
okula basar ─► okulSec: seciliOkul = {...}, sıra++ , il/ilçe okulunki, "Değiştir" görünür
"Okulu aç" ─► 09-yonetici.js: { city, district, mebSchoolId: seciliOkul.id, kisaAd, mudurKodu, diskMb } ─► POST /admin/okul-ac
```

## Dikkat!

- **Herkese giden pakette ama yalnız yönetici kullanıyor.** Dosya `public/js/parcalar/`'da olduğu için her öğrencinin,
  velinin indirdiği `/js/app.js`'e de girer; oradaki hiçbir ekran bu işlevleri çağırmaz. İçinde yönetici ucu ya da
  `/admin` adresi yok (yalnız herkese açık `/api/okullar/*`), bu yüzden `testler/test-admin-gizli.js`'in "app.js yönetim
  kodu taşımıyor" denetiminden geçer. `public/js/yonetim/`'e taşınması (adıyla birlikte, ör. `09e-okul-secimi.js`) önerilir;
  kod değiştirilmedi.
- **Okul türü seçimi hep boş.** Sunucudaki bilinen hata yüzünden (`sunucu/okullar.js` `okulVeri`'yi dışa `null` verir;
  [../../../sunucu/okullar.md](../../../sunucu/okullar.md) Dikkat) `/api/okullar/iller`'in `tipler`'i hep boş dizi gelir;
  `#bOkulTip`'te yalnız "Tüm türler" durur. Sunucu düzelince bu dosyada değişiklik gerekmez.
- **Okul listesi yoksa ilçe elle yazılır ama arama zaten çalışmaz.** `ilceleriDoldur` açılır listeyi yazı kutusuyla
  DEĞİŞTİRİR (`outerHTML`); `okulSecimiKur`'un eski kutuya bağladığı `onchange` yeni kutuda yoktur. Arama o durumda
  sunucuda da 503 alacağı için sonucu yok; "Okul listede yok" + elle ilçe yolu çalışır.
- **İlçesi bilinmeyen ilde "Merkez" kendiliğinden seçilir.** İlin ilçe listesi boşsa tek seçenek "Merkez"dir ve okul
  açılırken ilçe olarak o gider.
- **Önbellek oturum boyunca silinmez.** Okul listesi sunucu açılışında bir kez yüklendiği için sorun yok; sunucu yeni
  listeyle yeniden açılırsa sayfa yenilenene kadar eski sonuçlar görülebilir.
- **Arama sıra numarasıyla korunur.** Yavaş gelen eski cevap yenisini ezmez; okul seçilince de sıra artırılır ki yoldaki
  cevap seçimi silmesin. Yeni bir arama yolu eklersen aynı `benim !== okulAramaDurum.sira` denetimini koru.
- **Sunucu sınırı:** IP başına dakikada 300 arama. 250 ms bekleme ve önbellek hızlı yazan birini sınırın çok altında
  tutar (`testler/test-giris-kayit.js`: 150 hızlı arama 429 almıyor).
- **HTML güvenliği:** okul adları sunucudan gelir; `aramaVurgula` her parçayı `esc`'ten geçirip yalnız `<mark>` ekler,
  `data-okul-*` değerleri de `esc`'li.
- `okulSonuclari`'nın düzeltme satırındaki `okul-duzeltme` sınıfının CSS'te karşılığı yok (düz `.okul-bilgi` gibi görünür); zararsız.

## Testleri

Bu dosyanın ön yüz davranışını (bekleme, sıra, klavye) doğrudan deneyen bir test yok. Kullandığı uçlar:

- `testler/test-giris-kayit.js` — `/api/okullar/ara`: kelime sırası ve büyük/küçük harf, noktalı kısaltma ("m.akif"),
  yanlış kelimede `yakin`, ilçe adıyla arama, büyük harfli adların düzeltilmesi, "ortaoklu" düzeltmesi ve `vurgu`,
  "tefik" → Tevfik Fikret, "AİHL" kısaltması, bitişik yazımın ayrılması, hız (5 arama < 1,5 sn), hızlı yazarken 150
  aramanın 429 almaması.
- `testler/test-sifre.js` — `/api/okullar/iller` (60 binden çok okul, 81 il) ve özel okulun aramada bulunması.
- `testler/test-yonetim.js` — yöneticinin okul açması (`POST /api/admin/okul-ac`; bu alanın verisiyle giden istek).
- `testler/buton-denetimi.js` — `okul-ara-tekrar`, `okul-ara-genislet` eylemlerinin karşılığı.
- Elle: yönetim adresinde yöneticiyle gir → Okullar → Okul aç → il seç, "cumhuriyet ortaoklu" yaz → düzeltme satırı ve
  koyu kelimeler; bir okula bas → "Değiştir" kutusu, il/ilçe okulunki; "Tüm Türkiye'de ara"yı dene.

## Son durum

- `git log`: 4 commit. Dosya `1eae9ae commit 339` (2026-09-26) ile doğdu (rolsüz hesabın müdür başvurusu formu),
  `97cbacd commit 340` (2026-09-26) ile düzenlendi.
- Son değişiklik `0acca75 commit 516` (2026-09-27, kayıt/kişi kodu/portallar): müdür başvurusu formu
  (`okulBasvuruFormu`: doğum tarihi, "Bu okulun müdürüyüm" beyanı) ve gönderme eylemi (`rolsuz-mudur`,
  `POST /api/okul-basvurusu`) silindi; `okulBasvurusuKur` → `okulSecimiKur` oldu; metinler "Okulunu bul"/"Okulum
  listede yok" → "Okulu bul"/"Okul listede yok"; "sistem yöneticisi kontrol edip onaylar" cümlesi kalktı.
- Ondan önce `6af78fc commit 401` (2026-09-26): sonuç listesini çizen `okulSonuclari` eklendi (340'tan beri çağrılıyor
  ama tanımı yoktu); sunucunun düzeltme (`duzeltme`), yakın sonuç (`yakin`) ve vurgu (`vurgu`) bilgilerini gösterir,
  süzgeç varken "Tüm Türkiye'de ara" düğmesini koyar.
- Bilinen açıklar (kod değiştirilmedi): herkese giden pakette durması ve yanıltıcı adı; tür seçiminin sunucu hatası
  yüzünden boş kalması (Dikkat).
- Planlı işlerden bu dosyaya dokunacaklar: "Güvenlik denetimi" (iş 3: `okullar.js` `okulVeri` hatasının düzeltilmesi →
  tür seçimi dolar); "Paneller" (iş 5: `/panel/admin` ve okul gezgini — okul açma akışı yeni panele taşınacak; tanımda
  "Müdür ata"nın `/duzenle/okul/<kisa-ad>`'a gitmesi); "Çok dil" (iş 22: metinler `c()` kataloğuna).
