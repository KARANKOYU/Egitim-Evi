# public/js/parcalar/16b-okul-ayarlari.js

Müdürün "Okul Adresi ve Konumu" sayfası: okulun giriş adresini (`/school/<ad>`) değiştirme ve servis haritasındaki okul
işaretini haritaya dokunarak koyma/silme; `okul.konum` yetkili öğretmende yalnız "Okulun Konumu" kısmı.

## Bu dosya ne yapar?

Her okulun kendi giriş adresi vardır: `egitimevi.org/school/doruk-koleji` gibi (örnek ad). Öğrenci, öğretmen ve servisçi
bu adresten girer; aynı kullanıcı adı başka okulda da olabildiği için girişte okul bu adresten anlaşılır. Adresi okulu
açarken yönetici yazar; müdür burada değiştirir. Değiştirince eski adres HEMEN çalışmaz olur, bu yüzden sayfa yeni adresi
yazarken Türkçe harfleri ve boşlukları kendiliğinden düzeltir ve kaydetmeden önce onay ister.

İkinci iş okulun haritadaki yeri: servis haritalarında "Okul" işareti buraya konur. Kişi haritada okulun olduğu yere
dokunur, "Konumu kaydet"e basar; istenirse "Konumu sil". Bunu müdür ve müdürün `okul.konum` ("Okulun haritadaki yerini
ayarlar") yetkisi verdiği kişi yapabilir — hazır "Kodlayıcı" şablonunda bu yetki açıktır. Müdür olmayan yetkili sayfanın
yalnız konum kısmını görür, başlığı da "OKULUN KONUMU" olur; giriş adresine yalnız müdür dokunur.

Harita dış kütüphanesizdir: `19d-harita.js`'teki `haritaKur` OpenStreetMap döşemelerini çizer, dokunmayı ve
yakınlaştırmayı yönetir.

## İçinde neler var?

### Durum ve denetim

- `okulAyar` — `{ h, secim, veri }`: `h` haritanın denetim nesnesi (`haritaKur` dönüşü: `isaretler`, `yokEt`…), `secim`
  haritada son dokunulan nokta `{ enlem, boylam }` (yoksa `null`), `veri` son `GET /api/school/adres` cevabı.
- `okulAdresiSorunuTR(s)` — sunucudaki `kisaAdSorunu`'nun biçim kuralları ([../../../sunucu/ortak.md](../../../sunucu/ortak.md)):
  boş → "Okulun adres adını yaz."; 3'ten kısa → "Adres adı en az 3 karakter olmalı."; 40'tan uzun → "Adres adı en fazla
  40 karakter olabilir."; `^[a-z0-9][a-z0-9-]*[a-z0-9]$`'e uymuyor → "Yalnızca küçük harf (Türkçe harf olmadan), rakam ve
  tire; tireyle başlayıp bitemez."; `--` → "İki tire yan yana olamaz."; sorun yoksa `''`. Sitenin kendi sayfa adlarını
  (`api`, `admin`, `login`, `school`, `kvkk`…) yalnız sunucu reddeder. Aynı işlevi yönetim paketindeki
  `public/js/yonetim/09b-site-ayarlari.js` (yöneticinin "Okul adresleri" penceresi) de kullanır: yönetim paketi uygulama
  parçalarıyla birleşir.

### Sayfa — `SAYFALAR['okul-ayarlari']`

1. Önceki ziyaretten kalan harita varsa `yokEt()` edilir; `secim` sıfırlanır.
2. `GET /api/school/adres` → `{ kisaAd, ad, enlem, boylam }` → `okulAyar.veri`.
3. `mudur = S.user.role === 'principal'`. Başlık müdürde "OKUL ADRESİ VE KONUMU", değilse "OKULUN KONUMU"; alt yazı okulun
   adı.
4. **Yalnız müdüre** "Okulun giriş adresi" kartı:
   - açıklama: "Öğrenci, öğretmen ve servisçiler bu adresten girer. Aynı kullanıcı adı başka okulda da olabilir; girişte
     okul bu adresten anlaşılır.";
   - adres varsa `<site>/school/<ad>` (`.adres-goster`) ve "Bağlantıyı kopyala" (`data-act="kod-kopyala"`, `data-kod` =
     `location.protocol + '//' + <site>/school/<ad>`, yani canlıda `https://…`; `25-tiklama.js` `panoyaKopyala` panoya
     alır, düğmede kısa süre "Kopyalandı");
   - `.field` içinde "Adres adı" etiketi, `.adres-girdi` kutusu: solda sabit `<site>/school/`, sağda `input#oaKisa`
     (`maxlength="40"`, otomatik tamamlama, büyük harfe çevirme ve yazım denetimi kapalı, değeri bugünkü ad);
   - ipucu "Küçük harf, rakam ve tire. Değiştirirsen eski adres çalışmaz; yeni adresi herkese duyur.";
   - "Adresi kaydet" (`data-act="okul-adres-kaydet"`), ileti yeri `#oaMesaj`.
5. **Herkese** "Okulun haritadaki yeri" kartı: harita simgesi + başlık, "Servis haritasında okul işareti buraya konur.
   Haritada okulun olduğu yere dokun, sonra kaydet.", harita kabı `#oaHarita.harita-kap`, düğme satırı: "Konumu kaydet"
   (`#oaKonumKaydet`, `data-act="okul-konum-kaydet"`, başta `disabled`); konum kayıtlıysa ayrıca "Google Haritalar'da aç"
   (`googleHaritaBaglantisi`, yeni sekmede, site bilgisi gönderilmez) ve "Konumu sil" (`data-act="okul-konum-sil"`); ileti
   yeri `#oaKonumMesaj`.
6. `yaz(h)`.
7. `#oaKisa` varsa (müdürse) `input` dinleyicisi, yazılanı anında adres kuralına çevirir: tireler boşluğa, sonra
   `aramaSadeTR` (ı/İ/I → i, Türkçe harflerin işaretleri atılır, küçük harf, harf ve rakam dışındaki her dizi tek boşluk,
   baştaki ve sondaki boşluk atılır), boşluklar tireye; kişinin son yazdığı karakter tire ya da boşluksa sona bir tire
   eklenir (yazmaya devam edebilsin diye). Örnek: "Özel Doruk Koleji" → `ozel-doruk-koleji`. Değer ancak değiştiyse
   yeniden yazılır.
8. Harita: `haritaKur($('oaHarita'), { merkez, zoom, etiket: 'Okulun konumu', tiklaninca })` — konum kayıtlıysa merkez
   orası, yakınlık 16 ve "Okul" etiketli `okul` işareti; değilse Türkiye'nin ortası, yakınlık 6. `tiklaninca(k)`:
   `okulAyar.secim = k`, işaretler "Okul" etiketli tek bir `secim` işaretiyle değişir (kayıtlı işaret kalkar), "Konumu
   kaydet" açılır.

### Düğmeler

- `EYLEMLER['okul-adres-kaydet']` (düğmenin kendisini `el` olarak alır):
  1. alanın eski hatası temizlenir (`alanTemizle`); değer `trim` edilir, sondaki tireler atılır;
  2. `okulAdresiSorunuTR` bir şey derse alanın altında kırmızı hata (`alanHatasi`, [04a-form-alanlari.md](04a-form-alanlari.md)),
     istek yok;
  3. değer bugünkü adla aynıysa `#oaMesaj`'da bilgi iletisi (`msg bilgi`) "Adres zaten bu.", istek yok;
  4. okulun zaten bir adresi varsa onay: "Okulun adresi `<site>/school/<yeni>` olsun mu?\n\nEski adres (<eski>) çalışmaz
     olur." (ilk kez adres konurken onay sorulmaz);
  5. `dugmeBekle` "Kaydediliyor..." → `POST /api/school/adres { kisaAd }` → `S.user.schoolSlug = d.kisaAd`,
     `okulYolunuAyarla()` (adres çubuğu `/school/<yeni>`'ye döner, bu tarayıcının hatırladığı "son okul" da güncellenir —
     [05a-dis-sayfalar.md](05a-dis-sayfalar.md)) → `git('okul-ayarlari')` → sayfanın üstünde yeşil "Okulun adresi
     kaydedildi.";
  6. hata → düğme eski hâline döner, sunucunun iletisi alanın altına yazılır ("Bu adres başka bir okulda. Başka bir ad
     dene.", "Bu ad sitenin kendi sayfalarından biri; başka bir ad seç.", 429 "Adres bugün çok kez değişti. Yarın yeniden
     dene.").
- `EYLEMLER['okul-konum-kaydet']` — seçim yoksa hiçbir şey yapmaz; `dugmeBekle` → `POST /api/school/konum { enlem,
  boylam }` → `git('okul-ayarlari')` → yeşil "Okulun konumu kaydedildi."; hata → düğme geri, `#oaKonumMesaj`'da kırmızı
  (ör. "Konum anlaşılmadı. Haritada okulun olduğu yere dokun.").
- `EYLEMLER['okul-konum-sil']` — onay "Okulun haritadaki konumu silinsin mi?" → düğme kilitlenir → `POST
  /api/school/konum { sil: true }` → `git('okul-ayarlari')` → yeşil "Okulun konumu silindi."; hata → düğme açılır,
  tarayıcı uyarı kutusu (`hataGoster`).

## Kimle konuşur?

- Çağırdıkları:
  - `$`, `api`, `esc`, `EYLEMLER` ([01-yardimcilar.md](01-yardimcilar.md)); `ik` ([02-ikonlar.md](02-ikonlar.md));
    `mesajGoster`, `sayfaMesaji` ([03-mesaj-modal.md](03-mesaj-modal.md)); `alanHatasi`, `alanTemizle`
    ([04a-form-alanlari.md](04a-form-alanlari.md)); `aramaSadeTR`, `dugmeBekle`, `dugmeBitir` ([05-giris.md](05-giris.md));
    `okulYolu`, `okulYolunuAyarla` ([05a-dis-sayfalar.md](05a-dis-sayfalar.md)); `git`, `hero`, `yaz`
    ([07-yonlendirme.md](07-yonlendirme.md)); `SAYFALAR` ([08-ana-sayfa.md](08-ana-sayfa.md)); `S.user.role`,
    `S.user.schoolSlug` ([00-durum.md](00-durum.md)).
  - `haritaKur`, `googleHaritaBaglantisi` (`19d-harita.js`); `hataGoster` ve `kod-kopyala` → `panoyaKopyala`
    (`25-tiklama.js`). `19d-harita.js` ve `25-tiklama.js` bu dosyadan sonra birleşir; çağrılar çalışma anında olduğu
    için sorun olmaz.
- Sunucu uçları — [../../../sunucu/bolumler/hesaplar.md](../../../sunucu/bolumler/hesaplar.md) (istek önce
  [../../../sunucu/bolumler/okul.md](../../../sunucu/bolumler/okul.md)'nin `/api/school` kapısından geçer: giriş, onaylı
  hesap, rolü müdür ya da öğretmen olmalı):
  - `GET /api/school/adres` — müdür ya da `okul.konum` yetkili; değilse 403 "Okul adresini müdür belirler". Cevap
    `{ kisaAd, ad, enlem, boylam }`.
  - `POST /api/school/adres { kisaAd }` — YALNIZ müdür (403). Küçük harfe çevrilir, `kisaAdSorunu` ile denetlenir, başka
    okulda varsa 400; aynı adres yeniden gelirse "Okulun adresi zaten bu." (sayılmaz); okul başına günde en çok 10 gerçek
    değişiklik (429). Kaydedince statik sunucunun okul önbelleği boşaltılır ([../../../sunucu/http.md](../../../sunucu/http.md)):
    eski adres hemen "Okul bulunamadı" olur. İşlem kaydı `okul.adres`.
  - `POST /api/school/konum { enlem, boylam }` ya da `{ sil: true }` — `okul.konum` yetkisi (müdürde her yetki var; yoksa
    403 "Okulun konumunu müdür ya da yetki verdiği kişi belirler"). Değerler sayı olmalı (metin "36.88" reddedilir),
    sınırlar içinde ve (0, 0) değil; 6 ondalığa yuvarlanır. İşlem kaydı `okul.konum` (silmede kayıt yazılmaz).
- Tablo: `okullar` — `kisa_ad` (şema 009, tekil) ve `enlem`, `boylam` (şema 010); depo
  [../../../sunucu/veri/depo/okullar.md](../../../sunucu/veri/depo/okullar.md) (`bul`, `kisaAdVarMi`, `kisaAdYaz`,
  `konumYaz`).
- Kaydedilen konumu kullananlar: servis haritası ve servisçinin yoklama haritası okul işaretini sunucudan alır
  ([../../../sunucu/bolumler/okul-hayati.md](../../../sunucu/bolumler/okul-hayati.md); ön yüzde `19e-servis-konum.js`,
  `19i-servis-yoklama.js`). Adresi kullananlar: okulun giriş sayfası ve `S.user.schoolSlug`'ı gösteren ekranlar
  ([10a-giris-bilgisi.md](10a-giris-bilgisi.md) giriş kâğıdı, [10b-hesaplar.md](10b-hesaplar.md) hesap açılış penceresi,
  `23-veli-ayarlar.js` müdürün Ayarlar'ındaki "Okulun adresi ve konumu" kartı).
- Bu sayfaya götürenler: [06-menu.md](06-menu.md) — müdürde "Okul Düzeni" altında "Okul Adresi ve Konumu", `okul.konum`
  yetkili öğretmende ek yetkiler başlığı altında "Okulun Konumu"; `23-veli-ayarlar.js` — müdürün Ayarlar'ındaki "Değiştir"
  (`data-nav="okul-ayarlari"`). Ekran turu `araclar/gezinti.js` sayfayı "Okul adresi ve konumu" diye fotoğraflar.
- CSS (`public/css/parcalar/`): `27-harita-ortak.css` — `.adres-girdi` (sabit önekli kutu, odakta çerçeve), `.adres-goster`
  (kod yazı tipi, uzun adres kırılır), `.harita-kap` (340 px; dar ekranda 280 px), `.harita` ve işaretler (`.harita-nokta.okul`,
  `.harita-nokta.secim`), `.dugme-satir`; ortak `.kart`, `.satir`, `.buyu` (`04-kartlar.css`), `.field`, `.hint`, `.btn`,
  `.btn.kucuk`, `.btn.ghost`, `.btn.gri`, `.msg` (`02-form.css`), alan hatası `.hatali`/`.alan-hata`.
- Rol: müdür (adres + konum); `okul.konum` yetkili öğretmen (yalnız konum). Başka biri adres çubuğundan `#/okul-ayarlari`
  açarsa sunucu 403 verir ve sayfada kırmızı ileti çıkar.
- Android uygulaması bu dosyayı kullanmaz.

## Nasıl çalışır (adım adım)?

```
git('okul-ayarlari')
  eski harita yokEt, secim = null
  GET /api/school/adres ─► { kisaAd: 'doruk-koleji', ad, enlem, boylam }
  müdür mü? ── evet ─► "Okulun giriş adresi" kartı (kopyala, #oaKisa, Adresi kaydet)
  "Okulun haritadaki yeri" kartı ─► haritaKur(#oaHarita) (kayıtlıysa 'okul' işareti)

müdür yazar: "Özel Doruk "  ─► input ─► "ozel-doruk-"   (Türkçe harf düzlenir, boşluk tire)
"Adresi kaydet" ─► trim, sondaki tire atılır ─► okulAdresiSorunuTR ─► aynı mı? ─► onay (eski adres ölecek)
   ─► POST /api/school/adres { kisaAd: 'ozel-doruk' }
         sunucu: kural, başka okulda mı, günde 10 sınırı ─► okullar.kisa_ad ─► okul önbelleği boşalır
   ◄─ { kisaAd, message }
   ─► S.user.schoolSlug, okulYolunuAyarla() (adres çubuğu /school/ozel-doruk#/okul-ayarlari)
   ─► git('okul-ayarlari') ─► "Okulun adresi kaydedildi."

haritaya dokun ─► tiklaninca ─► secim = { enlem, boylam }, 'secim' işareti, "Konumu kaydet" açılır
"Konumu kaydet" ─► POST /api/school/konum { enlem, boylam } ─► okullar.enlem/boylam ─► git ─► "Okulun konumu kaydedildi."
```

## Dikkat!

- **Adres değişince eski adres hemen ölür.** Sunucu okul önbelleğini boşaltır; o okulun öteki kullanıcıları eski
  `/school/<eski>` adresinde sayfayı yenilerse "Okul bulunamadı" (404) sayfası alır; kaydedilmiş yer imleri ve daha önce
  basılmış giriş kâğıtları da eski adresi taşır. Onay penceresi bunu söyler, ama yalnız okulun zaten bir adresi varsa.
  Müdür adresi değiştirince sunucu kimseye bildirim göndermez (yönetici değiştirdiğinde müdüre bildirim gider,
  `sunucu/bolumler/site-ayarlari.js`); yeni adresi okula duyurmak müdüre kalır — ipucu yazısı da bunu söyler.
- **Aynı anda aynı adı alan iki okul.** Sunucu önce "başka okulda var mı" diye bakar, sonra yazar; iki okul aynı anda aynı
  adı kaydederse ikincisini veritabanının tekil indeksi durdurur. Yöneticinin ucu bu durumu (`23505`) yakalayıp "Bu adres
  başka bir okulda." der; müdürün ucu (`hesaplar.js`) yakalamaz, kişi alanın altında genel "Sunucu hatası" iletisini
  görür (500). Çok seyrek; kod okumasına göre. Kod değiştirilmedi.
- **Dosyanın başındaki "Yalnızca müdür." yorumu bayat.** `7a8b555 commit 504`'ten beri `okul.konum` yetkili öğretmen de
  sayfayı (yalnız konum kartını) görür. Kod değiştirilmedi.
- **Ön yüz kuralı sunucununkinin elle kopyası.** `okulAdresiSorunuTR` ile [../../../sunucu/ortak.md](../../../sunucu/ortak.md)'deki
  `kisaAdSorunu` birlikte değişmeli (yönetimdeki `09b-site-ayarlari.js` de aynı işlevi kullanır); iletilerin yazılışı
  biraz farklıdır ("Yalnızca küçük harf…" / sunucuda "Adres adında yalnızca küçük harf…"), anlamı aynı. Ayrılmış adlar
  listesi yalnız sunucuda.
- **Bütün sunucu hataları alanın altına yazılır.** 429, ağ kopması ya da oturum hataları da "Adres adı" kutusunun altında
  kırmızı görünür. Yönetimdeki pencere (`09b-site-ayarlari.js`) yalnız `alan: 'kisaAd'` taşıyan hatayı alana, ötekileri
  iletiye yazar.
- **Kutuda Enter bir şey yapmaz** (form yok); yönetimdeki pencerede Enter kaydeder. Kaydetmek için düğmeye basmak gerekir.
- **Yazarken çevirme imleci sona atar.** Değer yeniden yazıldığında (büyük harf, Türkçe harf, boşluk girilince) tarayıcı
  imleci kutunun sonuna koyar; adın ortasında düzeltme yapan kişi bunu fark eder. (Kod okumasına göre.)
- **Harita sayfadan çıkınca yok edilmez.** `okulAyar.h` yalnız bu sayfa YENİDEN açılınca `yokEt()` edilir; başka sayfaya
  geçince harita öğesi ekrandan kalkar ama `ResizeObserver` onu izlemeye devam eder (`19d-harita.js` `yokEt` bunu keser).
  Küçük bir bellek artığı; `19e-servis-konum.js` ve `19i-servis-yoklama.js` de aynı kalıbı kullanır, yalnız
  "Çocuğumun telefonu" haritası `git()` içinde kapatılır. (Kod okumasına göre.)
- **Dokunulan nokta kayıtlı işaretin yerini alır.** Kaydetmeden önce haritada yalnız yeni seçim görünür; "Google
  Haritalar'da aç" ise hâlâ KAYITLI konumu açar. Sayfadan kaydetmeden çıkılırsa seçim kaybolur (uyarı yok).
- **Sürüklemek dokunma sayılmaz.** Harita toplam 6 piksel ya da daha çok oynatılırsa bırakınca seçim yapılmaz
  (`19d-harita.js`); tek parmakla, kıpırdatmadan dokunmak gerekir (süre sınırı yok: uzun basmak da dokunma sayılır).
- **Konum klavyeyle seçilemez.** Harita kabı klavyeyle odaklanır; ok tuşları kaydırır, `+`/`-` yakınlaştırır, ama Enter
  ya da Boşluk bir nokta seçmez: `tiklaninca` yalnız fare/dokunmatik bırakışında (`pointerup`) çağrılır. Yalnız klavye
  kullanan kişi okulun konumunu koyamaz. (Kod okumasına göre.) Kod değiştirilmedi.
- **Adres kutusunda kırmızı çerçeve görünmeyebilir.** Hata olunca `.field` `hatali` sınıfı alır ve `02-form.css`
  `.field.hatali input`'un çerçeve RENGİNİ kırmızı yapar; ama `27-harita-ortak.css` `.adres-girdi input`'un çerçevesini
  sıfırlamıştır (`border: 0`) ve `.adres-girdi` kabı için bir hata kuralı yoktur. Bu yüzden kutu kırmızıya dönmez, yalnız
  altındaki hata yazısı görünür. (CSS okumasına göre; tarayıcıda denenmedi. Aynı `.adres-girdi` kutusunu kullanan
  yönetim ekranları — `public/js/yonetim/09-yonetici.js`, `public/js/yonetim/09b-site-ayarlari.js` — için de geçerli.)
  Kod değiştirilmedi.
- **Dış istek:** harita döşemeleri `tile.openstreetmap.org`'dan resim olarak gelir; bu istekler yalnız site adını taşır,
  okulun konumu dışarı gitmez (`19d-harita.js` yorumu).
- **Konum silmek işlem kaydına yazılmaz** (sunucu; kaydetmek yazılır).
- **`S.user.schoolSlug` yalnız bu tarayıcıda hemen güncellenir.** Müdürün öteki cihazlarındaki ve okulun öteki
  kişilerinin oturumlarındaki adres, oturum yenilenince (`/api/me`) gelir.

## Testleri

- Tarayıcıda bu dosyayı çalıştıran bir test yok.
- `testler/buton-denetimi.js` (sunucusuz) — `okul-adres-kaydet`, `okul-konum-kaydet`, `okul-konum-sil`, `kod-kopyala`
  eylemlerinin karşılığı ve `okul-ayarlari` sayfasına menü düğmesinin götürmesi.
- `testler/yazim-denetimi.js` (sunucusuz) — görünen Türkçe metinler.
- Sunucu tarafı (bu sayfanın çağırdığı uçlar):
  - `testler/test-yonetim.js` — müdür adresi değiştirir; başka okulun adresi ve ayrılmış ad (`api`) 400; öğretmen 403.
  - `testler/test-rol.js` — `okul.konum` yetkisi: yetkisiz öğretmen konumu yazamaz ve adresi okuyamaz (403); yetkili
    kaydeder ve görür (`enlem` aynen döner); yetkili giriş adresini değiştiremez (403); işlem kaydında `okul.konum`.
  - `testler/test-servis-konum.js` — konumu müdür koyar, yetkisiz öğretmen koyamaz, metin sayı 400.
  - `testler/test-site-ayarlari.js` — müdürün adres değiştirmesi önbelleği hemen boşaltır: yeni adres 200, eski 404.
  - `testler/yetki-denetimi.js` — `GET /api/school/adres` ve `POST /api/school/konum` yalnız müdüre açık.
  - `testler/test-cakisma.js`, `testler/test-etut.js` — adresi başka akışların içinde okur.
- Elle: `testler/seed.js`'teki müdürle "Okul Adresi ve Konumu" → kutuya "Özel Deneme Okulu" yaz (kendiliğinden
  `ozel-deneme-okulu` olmalı) → "Adresi kaydet" → onay → adres çubuğu yeni adrese döner; eski adresi yeni sekmede aç →
  "Okul bulunamadı". Haritaya dokun → "Konumu kaydet" → servis haritasında okul işareti orada.

## Son durum

- `git log`: 6 commit, hepsi 2026-09-26.
  - Son değişiklik `fe018dd commit 513`: okul adresleri `/school/` altına taşındı — gösterilen adres ve onay metni artık
    `okulYolu()` ile kuruluyor, kutunun sabit öneki `<site>/` yerine düz yazıyla `<site>/school/` oldu (önce adres
    `<site>/<ad>` idi); dosya başı yorumu da `egitimevi.org/school/<ad>` oldu. Aynı commit giriş sayfası
    (`05a-dis-sayfalar.js`), okul sayfası ve ekran turu tarafını da taşıdı.
  - `7a8b555 commit 504`: `okul.konum` yetkisi — müdür olmayan yalnız konum kartını ve "OKULUN KONUMU" başlığını görür;
    `#oaKisa` yoksa dinleyici kurulmaz. Aynı commit menüye "Okulun Konumu"nu, sunucuya yetkiyi ve `testler/test-rol.js`'e
    denemeleri ekledi.
  - `7b370a5 commit 336`: "Konumu sil" eylemi. `838e7db commit 335`: "Konumu kaydet" eylemi. `aa229c4 commit 334`:
    "Adresi kaydet" eylemi. `0d59e0f commit 333`: dosyanın ilk hâli (sayfa, `okulAdresiSorunuTR`, adres kutusu ve
    yazarken çevirme, harita); aynı commit `sunucu/veri/sema/009-okul-adresi-hesaplar.sql`'i ekledi.
- Bilinen açıklar (kod değiştirilmedi): bayat "Yalnızca müdür" yorumu, sayfadan çıkınca haritanın yok edilmemesi, bütün
  hataların alana yazılması, Enter'ın kaydetmemesi, yazarken imlecin sona atlaması, adres kutusunda kırmızı çerçevenin
  görünmemesi, konumun klavyeyle seçilememesi, aynı anda aynı adı alan okulda müdüre "Sunucu hatası" dönmesi.
- Planlı işlerden bu dosyaya dokunması beklenenler:
  - "Paneller + okul gezgini": müdürün okul ayarlarına "Okul simgesi" (PNG/JPEG/WebP, 128×128'e oranı korunarak, beyaz
    dolgulu) gelecek; en doğal yeri bu sayfa.
  - "Özel roller": yeni `okul.simge` yetkisi ve "Kodlayıcı / Tasarımcı" şablonu (`okul.sayfa`, `okul.konum`, `okul.simge`);
    ortak bilgisayar için okul ayarı ("Okul bilgisayarlarında hep ortak bilgisayar say") — öneri, onay bekliyor.
  - "Okul cihazı" (öneri; kullanıcı "sonra bakarım" dedi): "Okul ayarları → Okul cihazları → Bu bilgisayarı okul cihazı
    yap".
  - "Yıl geçişi": okul yedeklerinin ("Yedekler 1/1", yeni yedek, yükle, indir) yeri okul ayarları ya da Eğitim Yılı
    sayfası.
  - "Çok dil": sayfa metinleri çeviri işlevinden geçecek. "Ekran turu + albüm": sayfanın görüntüsü baştan çekilecek.
