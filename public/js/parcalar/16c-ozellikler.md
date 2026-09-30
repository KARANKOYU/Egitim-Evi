# public/js/parcalar/16c-ozellikler.js

Müdürün "Özellikler" sayfası: okulda kullanılmayan bölümleri (ödev, sınav, devamsızlık, etüt, servis, yemek listesi,
kulüp, anket) açma/kapama anahtarları ve kaydedince müdürün kendi menüsünün hemen yenilenmesi.

## Bu dosya ne yapar?

Her okul her bölümü kullanmaz: servisi olmayan okul "Servis"i, anket yapmayan okul "Anketler"i menüde görmek istemez.
Müdür bu sayfada bölümleri tek tek açar ya da kapatır ve "Kaydet"e basar. Kapalı bölüm:

- o okuldaki herkesin menüsünden ve ana sayfa kutucuklarından kalkar (ön yüz `S.kapali` listesine bakar,
  [06-menu.md](06-menu.md); çocukları farklı okullarda olan velide bölüm ancak hepsinin okulunda kapalıysa kalkar);
- sunucuda da kapanır: o bölümün her isteği 403 `{ ozellikKapali }` alır
  ([../../../sunucu/bolumler/ozellikler.md](../../../sunucu/bolumler/ozellikler.md));
- ama kayıtları SİLİNMEZ: yeniden açılınca ödevler, notlar, yoklamalar eskisi gibi görünür.

Bu dosya yalnız ekrandır: listeyi sunucudan alıp anahtarları çizer, anahtar çevrilince yanındaki "Açık/Kapalı" yazısını
anında değiştirir, "Kaydet"te kapalıların listesini yollar ve cevaptaki listeyle müdürün menüsünü yeniden çizer. Hangi
bölümlerin olduğu, adları ve açıklamaları sunucudan gelir; burada bölüm listesi yazılı değildir.

## İçinde neler var?

- `SAYFALAR.ozellikler` — `GET /api/ozellikler` → `{ ozellikler: [{ k, ad, aciklama, acik }] }`: sekiz bölüm, sunucunun
  sırasıyla — Ödevler, Sınavlar, Devamsızlık, Etütler, Servis, Yemek listesi, Kulüpler, Anketler; açıklamalar da
  sunucudan (ör. Ödevler: "Ödev verme ve sonuçlandırma, teslim dosyaları, ödev ekleri, ödev hatırlatmaları."). Çizim:
  - başlık "ÖZELLİKLER", alt yazı "Okulunda kullanmadığın bölümleri kapat. Kapalı bölüm öğretmen, öğrenci ve velilerin
    menüsünde görünmez.";
  - `div.kart.ozellik-liste` içinde her bölüm bir `label.satir.ozellik-satir[for="oz-<k>"]` — satırın her yerine basmak
    anahtarı çevirir: solda ad (kalın) ve açıklama; ortada `span.anahtar` içinde gerçek onay kutusu
    `input[type=checkbox][role=switch].oz-kutu#oz-<k>[data-k="<k>"]` (açıksa `checked`) ve onun görsel izi
    `span.anahtar-iz` (`aria-hidden`); sağda `span.oz-durum` "Açık" ya da "Kapalı";
  - ikinci kart: "Kapatınca kayıtlar silinmez; yeniden açtığında ödevler, notlar ve yoklamalar eskisi gibi görünür.",
    "Kaydet" (`data-act="ozellik-kaydet"`), ileti yeri `#ozMesaj`;
  - `yaz(h)`'den sonra her `.oz-kutu`'ya `change` dinleyicisi: yalnız aynı satırın `.oz-durum` yazısını günceller.
    Sunucuya bir şey gitmez.
- `EYLEMLER['ozellik-kaydet']` — sayfadaki bütün `.oz-kutu`'lardan İŞARETSİZ olanların `data-k`'sini toplar (ör.
  `['servis', 'anket']`) → `dugmeBekle` "Kaydediliyor..." → `POST /api/ozellikler { kapali }` → cevapta
  `S.kapali = d.kapali || []` ve `navCiz()` (müdürün menüsü o an süzülür) → düğme geri → `#ozMesaj`'da yeşil sunucu iletisi:
  "Kaydedildi." ya da bir bölüm kapandıysa "Kaydedildi. Kapanan bölümler okulda kimseye görünmez; kayıtları silinmedi."
  (yeşil ileti 6 saniye sonra kendiliğinden silinir). Hata → düğme geri, `#ozMesaj`'da kırmızı sunucu iletisi.

Dosyada başka işlev ya da değişken yoktur.

## Kimle konuşur?

- Çağırdıkları: `api`, `esc`, `EYLEMLER` ([01-yardimcilar.md](01-yardimcilar.md)); `mesajGoster`
  ([03-mesaj-modal.md](03-mesaj-modal.md)); `dugmeBekle`, `dugmeBitir` ([05-giris.md](05-giris.md)); `navCiz`
  ([06-menu.md](06-menu.md)); `hero`, `yaz` ([07-yonlendirme.md](07-yonlendirme.md)); `SAYFALAR`
  ([08-ana-sayfa.md](08-ana-sayfa.md)); `S.kapali` ([00-durum.md](00-durum.md)).
- Sunucu uçları — [../../../sunucu/bolumler/ozellikler.md](../../../sunucu/bolumler/ozellikler.md):
  - `GET /api/ozellikler` — yalnız müdür (`need(['principal'])`: girişsiz 401, öteki roller 403); okulsuz müdür 404
    "Okul bulunamadı". Cevap yukarıda.
  - `POST /api/ozellikler { kapali: [...] }` — yalnız müdür. Gövde okulun kapalı listesinin TAMAMIDIR (listede olmayan
    açılır). Dizi değilse 400 "Kapalı özellik listesi gerekli"; bilinmeyen anahtar 400 "Bilinmeyen özellik: …". Liste
    baştan yazılır (`depo.ozellikler.yaz`, tablo `okul_kapali_ozellikler`, şema 022; sunucu belleğindeki kopya da
    güncellenir — [../../../sunucu/veri/depo/ozellikler.md](../../../sunucu/veri/depo/ozellikler.md)); bir şey değiştiyse
    işlem kaydına `okul.ozellik` ("kapandı: Servis, Anketler; açıldı: Kulüpler"). Cevap `{ kapali, message }`.
- Kapalı listenin ön yüzdeki öteki okurları (bu sayfanın yazdığı `S.kapali`'yi kullananlar):
  - [06-menu.md](06-menu.md) — `SAYFA_OZELLIK` (sayfa → bölüm), `ozellikAcik`, `sayfaAcik`, `menuSuz` (kapalı bölümün
    menü satırları, altı boşalan başlık ve ayraç kalkar);
  - [07-yonlendirme.md](07-yonlendirme.md) — `git()` kapalı sayfaya adres çubuğundan gelene "Bu bölüm okulunda kapalı.
    Okul müdürü Özellikler sayfasından açabilir." der;
  - [08-ana-sayfa.md](08-ana-sayfa.md) — kutucuklar (`kutucuklar` `sayfaAcik`'a bakar), öğrencinin ödev serisi şeridi.
  - `S.kapali` girişte ve portal geçişinde sunucunun `kapaliOzellikler`'inden dolar ([05-giris.md](05-giris.md),
    `26-baslat.js`, [08c-kisilikler.md](08c-kisilikler.md)); bu sayfa onu yalnız müdürün kendi tarayıcısında hemen
    günceller.
- Menü: müdürde "Okul Düzeni" altında "Özellikler" (ayar simgesi). Sayfa `SAYFA_OZELLIK`'te yoktur (kendisi kapatılamaz).
  Öğretmenin menüsünde yoktur. Ekran turu `araclar/gezinti.js` sayfayı iki kez fotoğraflar: "Özellikler" ve "etüt
  kapatılıyor (kaydetmeden önce)".
- CSS: `public/css/parcalar/22-cesitli.css` — `.ozellik-satir` (el imleci, aralık), `.ozellik-satir .ad` (kalın),
  `.anahtar` (48×28 px), `.anahtar input` (şeffaf, bütün anahtarı kaplar, üstte: tıklamayı ve klavyeyi o alır),
  `.anahtar-iz` ve `::after` (yuvarlak düğmeli iz), `input:checked + .anahtar-iz` (yeşil, düğme sağa kayar),
  `input:focus-visible + .anahtar-iz` (klavye odağında çerçeve), `.oz-durum`, hareket azaltma tercihinde geçiş yok.
  `.ozellik-liste`'nin kendi kuralı yoktur (yalnız kanca). Ortak sınıflar: `.kart`, `.satir`, `.buyu` (`04-kartlar.css`),
  `.hint`, `.btn`, `.msg` (`02-form.css`).
- Rol: yalnız müdür.
- Android uygulaması bu dosyayı kullanmaz.

## Nasıl çalışır (adım adım)?

```
müdür menü "Özellikler" ─► git('ozellikler') ─► GET /api/ozellikler
   [Ödevler        (━━●) Açık  ]      (açıkta iz yeşil, yuvarlak düğme sağda)
   [Sınavlar       (━━●) Açık  ]
   …
   [Anketler       (○━━) Kapalı]      (kapalıda iz gri, düğme solda)
   anahtara bas ─► change ─► yalnız "Açık/Kapalı" yazısı (sunucuya gitmez)

"Kaydet" ─► kapali = işaretsizlerin data-k'si            ör. ['servis', 'anket']
        ─► POST /api/ozellikler { kapali }
              sunucu: doğrula ─► okul_kapali_ozellikler baştan yazılır ─► bellek ─► işlem kaydı (değiştiyse)
        ◄─ { kapali: ['servis', 'anket'], message }
        ─► S.kapali = kapali ─► navCiz(): müdürün menüsünden "Servisler" ve "Anketler" kalkar
        ─► #ozMesaj "Kaydedildi. Kapanan bölümler okulda kimseye görünmez; kayıtları silinmedi."

okulun öteki kişileri ─► menüleri girişte / sayfayı yenileyince (/api/me) güncellenir;
                         o arada kapalı bölüme basarlarsa sunucu 403 { ozellikKapali } → sayfada kırmızı ileti
```

## Dikkat!

- **Kaydetmeden çıkarsan değişiklik kaybolur.** Anahtarlar yalnız ekranda değişir; sayfadan ayrılınca sorulmaz
  (`S._sayfaDegisti` kullanılmaz).
- **Kapatmak onay sormaz ve herkes için hemen geçerlidir.** Sunucu kapısı kaydeder kaydetmez işler. Ödevler kapatılınca
  quizler, teslim dosyası ve ödev eki yüklemeleri, ödev hatırlatmaları da durur; Servis kapatılınca yoklama ve konum
  paylaşımı da reddedilir ([../../../sunucu/bolumler/ozellikler.md](../../../sunucu/bolumler/ozellikler.md)). Kayıtlar
  silinmez.
- **Öteki kişilerin ekranı hemen değişmez.** Açık sekmelerinde eski menü kalır; kapalı bölüme basınca `git()` sayfayı
  açmaya çalışır (onların `S.kapali`'si eski), sunucu 403 verir ve sayfada "… bu okulda kapalı. Okul müdürü Özellikler
  sayfasından açabilir." iletisi çıkar.
- **"Kaydet" her basışta listenin tamamını yollar.** Hiçbir şey değişmese de istek gider ve ileti "Kaydedildi." der;
  sunucu işlem kaydını yalnız değişiklik varsa yazar.
- **Kaydettikten sonra sayfa yeniden çizilmez.** Anahtarlar kişinin bıraktığı gibi kalır; sunucu listeyi olduğu gibi
  yazdığı için cevaptaki `kapali` ekrandakiyle aynıdır.
- **Aynı anda iki müdür** (bugün tek müdür; "birden çok müdür" planlı) kaydederse sonuncunun listesi geçerli olur ve
  öbürünün ekranı bunu göstermez: liste baştan yazılır.
- **Bölüm listesi sunucudan gelir.** Yeni bir kapatılabilir bölüm eklemek için bu dosyaya değil, sunucudaki
  `OZELLIKLER` (`sunucu/veri/depo/ozellikler.js`) ve `YOL` (`sunucu/bolumler/ozellikler.js`) listelerine ve
  `06-menu.js`'teki `SAYFA_OZELLIK`'e bakılır; sayfa yeni satırı kendiliğinden çizer. Veritabanı da izin vermeli:
  `okul_kapali_ozellikler.ozellik` sütunu şema 022'de sekiz anahtarlık bir `CHECK` ile sınırlı; yeni anahtar için yeni
  numaralı bir şema dosyası gerekir (022 değişmez), yoksa kaydetme veritabanında reddedilir.
- **Velide kural "hepsinde kapalı".** Sunucunun `/api/me`'de verdiği `kapaliOzellikler` velide çocuklarının okullarının
  HEPSİNDE kapalı olan bölümlerdir (`kullanicininKapalilari`): çocuklar iki okuldaysa ve bölüm yalnız birinde
  kapalıysa velinin menüsünde kalır, kapalı okuldaki çocuğun verisi o bölümde gelmez (bölüm kendisi atlar ya da 403).
- **Müdürün kendi veli satırları da gider.** Bu sayfa kaydedince `S.kapali`'ye müdürün kendi okulunun listesini yazar;
  menüsünde "Velisi olduğum" bölümü varsa (`06-menu.js` `veliBolumu`) oradaki "Ödevleri", "Devamsızlığı" gibi satırlar
  da aynı listeye göre süzülür. Çocuğu başka (bölümü açık) bir okuldaysa bile satır kalkar; sunucu o çocuğun isteğini
  çocuğun okuluna göre geçirirdi. (Kod okumasına göre; denenmedi.)
- **Karışık sayfalar kapalı bölümü kendileri atlamalı.** İlerleyiş, takvim ve ana sayfa bu listeye göre kendi içlerinde
  süzer; "İlerleyişim" sayfası ön yüzde bunu yapmıyor ([13-ogrenci-veli.md](13-ogrenci-veli.md)).
- **Erişilebilirlik:** gerçek onay kutusu şeffaftır ama görünmez değildir; klavyeyle (Tab, Boşluk) ve ekran okuyucuyla
  `role="switch"` olarak çalışır; `label[for]` bütün satırı tıklanabilir yapar. Satırın içinde `div`'ler `label`'ın
  içindedir (HTML kuralına göre `label` yalnız satır içi öğe almalı); tarayıcılar sorunsuz gösterir, yalnız biçimsel bir
  pürüz.

## Testleri

- Tarayıcıda bu dosyayı çalıştıran bir test yok.
- `testler/buton-denetimi.js` (sunucusuz) — `ozellik-kaydet` eyleminin karşılığı ve `ozellikler` sayfasına menü
  düğmesinin götürmesi.
- `testler/yazim-denetimi.js` (sunucusuz) — görünen Türkçe metinler.
- `testler/test-ozellikler.js` (sunucu tarafı) — müdür sekiz bölümü açık görür; öğretmen sayfanın ucuna giremez, öğrenci
  kapatamaz (403); bilinmeyen bölüm 400; ödev ve etüt kapatılınca bütün uçları 403 `ozellikKapali` (quiz, teslim dosyası,
  ek yükleme dahil); `/api/me` kapalı listeyi söyler (bu sayfanın `S.kapali`'ye yazdığıyla aynı biçim); ilerleyiş ve
  takvim kapalı bölümü atlar; velinin çocuğun okuluna bakması; yeniden açınca ödev ve quiz yerinde; işlem kaydında
  `okul.ozellik`; servis kapalıyken yoklama, sıra, not, binmeyecek, saatler ve telefon konumu reddi.
- Elle: `testler/seed.js`'teki müdürle "Özellikler" → "Yemek listesi"ni kapat → "Kaydet" → müdürün menüsünden "Yemek
  Listesi" hemen kalkar; öğrenciyle gir → menüde yok, adres çubuğuna `#/yemek` yazınca "Bu bölüm okulunda kapalı…";
  yeniden aç → yemek listesi eskisi gibi.

## Son durum

- `git log`: tek commit, `8a275f9 commit 431` (2026-09-26): dosya bugünkü hâliyle (48 satır) eklendi. Aynı commit
  özelliğin öbür parçalarını da getirdi: `sunucu/bolumler/ozellikler.js`, anahtarın görünüşü (`22-cesitli.css`) ve
  `testler/test-ozellikler.js`. O günden beri değişmedi (sunucu kapısı sonradan, `24050a2 commit 518`'de güçlendi; bu
  dosyaya dokunmadı).
- Bilinen açıklar (kod değiştirilmedi): kaydedilmemiş değişiklik uyarısının olmaması; öteki kişilerin menüsünün ancak
  yenilemede güncellenmesi; müdürün başka okuldaki çocuğu için "Velisi olduğum" satırlarının da kalkması; `label`
  içindeki `div`'ler.
- Planlı işlerden bu dosyaya dokunması beklenenler:
  - "Paneller + okul gezgini" (birden çok müdür): aynı anda iki müdürün kaydetmesi olası hâle gelir (yukarıda).
  - "Mesaj ayarları": okulun mesaj kuralları, bölüm Özellikler'den kapatılmışsa geçerli olmayacak (tanım); iki ayar yan
    yana düşünülmeli.
  - "Android yerel uygulama": müdürün uygulamadaki ekranlarında "Özellikler" var; aynı `/api/ozellikler` ucunu
    kullanacak.
  - "Çok dil": sayfa metinleri çeviri işlevinden geçecek; bölüm adları ve açıklamaları sunucudan geldiği için onların
    çevirisi sunucu tarafında.
  - "Ekran turu + albüm": sayfanın görüntüleri baştan çekilecek.
