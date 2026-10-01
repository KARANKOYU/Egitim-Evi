# public/js/parcalar/19b-anketler.js

"Anketler" sayfasının ön yüzü: kişiye gelen tek soruluk anketlerde oy verme, değiştirme ve geri alma; bitmiş ankette
sonuç çubukları; anketi açanın ve müdürün listesi, sonuç ve katılım penceresi, bitirme, silme ve "Yeni anket" penceresi.

## Bu dosya ne yapar?

Okul bazen herkese tek bir soru sorar: "Veli toplantısı hangi gün olsun? Pazartesi / Salı". Toplu mesaj yetkisi olan
kişi (müdür ya da `mesaj.toplu` verilmiş öğretmen) okula, bir rol grubuna ya da sınıflara böyle bir anket açar;
öğrencilere açılan anket velilerine de gider. Hedefteki herkes bitişe kadar oy verir, fikrini değiştirir ya da oyunu
geri alır; sonuç anket bitince açılır. "Gizli" ankette kimin neyi seçtiği hiç kimseye gösterilmez — anketi açana bile.

Bu dosya iki tarafın ekranını taşır (dosya başı yorumu: oy, sonuç ve kimin oy verebileceği sunucuda denetlenir; burada
yalnızca gösterilir — [../../../sunucu/bolumler/anket.md](../../../sunucu/bolumler/anket.md)):

1. **Oy veren** (öğrenci, veli, öğretmen, müdür): sayfada kendine açılmış her anket bir kart. Açıksa seçenekler büyük
   düğmeler; basınca oy kaydedilir, seçilen düğme işaretlenir, "Oyumu geri al" çıkar. Bittiyse her seçeneğin oy sayısı,
   yüzdesi ve çubuğu; kendi seçiminin çubuğu yeşil, adının yanında soluk "(senin seçimin)".
2. **Anketi açan ve müdür**: "Yeni anket" penceresi; "Açtığın anketler" (müdürde "Okulun anketleri") listesi: kaç kişinin
   oy verdiği, "Sonuç", "Bitir", "Sil". "Sonuç" penceresinde sayılar (gizli ankette yalnız bitince), kim oy verdi kim
   vermedi listesi, arama ve süzgeç.

Bütün düğmelerin karşılığı bu dosyanın `EYLEMLER`'inde.

## İçinde neler var?

### Liste (`SAYFALAR.anketler`)

- `GET /api/anketler` → `{ gelen, yonetilen, olusturabilir }`. Başlık "ANKETLER", alt yazı "Okulun sana sorduğu sorular.
  Anket bitene kadar oyunu değiştirebilirsin.".
- `olusturabilir` ise kart: "Okula, rol grubuna ya da sınıflara soru sor" / "Öğrencilere açılan anket velilerine de
  gider." ve "Yeni anket" (`anket-yeni`).
- Ne gelen ne yönetilen varsa boş kutu: "Şu an sana açılmış bir anket yok.".
- Her gelen anket için `anketKarti`.
- Yönetilen varsa `h3.sb` "Okulun anketleri" (müdür) ya da "Açtığın anketler", sonra her anket bir satır: soru + durum
  etiketi; altında "<hedef özeti> · 12 / 40 kişi oy verdi · bitiş 12.10.2026 23:59" (bittiyse "bitti <zaman>"), müdürde
  sonuna açanın adı. Sağda "Sonuç" (`anket-sonuc`), açıksa "Bitir" (`anket-kapat`), "Sil" (`anket-sil`).

### Kart ve sonuç çubukları

- `anketDurumEtiketi(a)` — açıksa yeşil "Açık", değilse gri "Bitti" (`span.etiket`).
- `anketKarti(a)` — `div.kart.anket-kart`: soru, "<açan> · bitiş <zaman>" (ya da "bitti <zaman>"), gizliyse "· kimin
  neyi seçtiği görünmez", durum etiketi; açıklama varsa (`esc` + satır sonu `<br>`). Açıksa her seçenek
  `button.anket-secenek[.secili]` (`data-act="anket-oy" data-id=<anket> data-secenek=<seçenek>`, `aria-pressed`), seçilende
  onay simgesi; altında oy verdiysen "Oyun kaydedildi. Bitişe kadar değiştirebilirsin." + "Oyumu geri al"
  (`button.baglanti`, aynı eylem, `data-secenek=""`), vermediysen "Henüz oy vermedin.", ikisinde de "Sonuç anket bitince
  görünür.". Bittiyse `anketCubuklari(...)` ve oy vermediysen "Bu ankete oy vermedin.".
- `anketCubuklari(secenekler, sayim, benim)` — toplam oy üzerinden her seçenek: metin, (seninse) "(senin seçimin)",
  "7 · %35" ve `.cubuk` (genişlik yüzde); en altta "20 oy". Yüzdeler `Math.round` ile ayrı ayrı yuvarlanır.

### Oy, bitirme, silme

- `EYLEMLER['anket-oy']` — karttaki bütün oy düğmeleri kapanır; `POST /api/anketler/oy { id, secenekId }` (boş
  `secenekId` oyu geri alır). Başarıda sayfa işlevi doğrudan yeniden çağrılır (`SAYFALAR.anketler()`; `git` değil:
  adres ve menü yerinde kalır). Hatada düğmeler açılır, ileti tarayıcının uyarı kutusuyla ("Bu anket kapandı." gibi).
- `EYLEMLER['anket-kapat']` — onay: "Anket şimdi bitirilsin mi? Artık oy verilemez; sonuç oy verenlere de açılır.";
  `POST /api/anketler/kapat { id }` → `git('anketler')`.
- `EYLEMLER['anket-sil']` — onay: "Anket ve bütün oylar silinsin mi? Bu geri alınamaz."; `POST /api/anketler/sil { id }`
  → pencere (açıksa) kapanır, `git('anketler')`.

### Sonuç penceresi (anketi açan ve müdür)

- `anketKatilim` — `{ veri: katılım listesi, secenekler: seçenek kimliği → metin, filtre: 'hepsi'|'verdi'|'vermedi',
  ara }`.
- `EYLEMLER['anket-sonuc']` — `GET /api/anketler/sonuc?id=` → pencere başlığı soru. İçinde: "<hedef özeti> · bitiş/bitti
  <zaman>"; sayılar geldiyse çubuklar, gelmediyse (gizli ve açık) mavi bilgi "Gizli ankette sayılar anket bitince
  görünür."; "**12 / 40** kişi oy verdi" ve çubuk; gizliyse "Gizli anket: kimin neyi seçtiği gösterilmez."; Hepsi /
  Oy verenler / Vermeyenler sekmeleri, "İsim ara" (`#anketAra`) ve `#anketListe`. Alt düğmeler: "Sil" (`anket-sil`),
  "Kapat".
- `anketSekme(k, ad)` — `button.sekme.kucuk[.secili]` (`data-act="anket-filtre" data-filtre`).
- `EYLEMLER['anket-filtre']` — süzgeci yazar, aynı satırdaki sekmelerin `secili`'sini yerinde değiştirir (pencere yeniden
  çizilmez), listeyi çizer.
- `anketListeCiz()` — süzgeç (oy verdi/vermedi) ve arama (`nrm`, şapkasız: ad + sınıf + çocuk adları); önce oy
  vermeyenler, sonra Türkçe ada göre. Her satır `.alici-satir`: ad, yanında "Ayşe velisi" ya da sınıf ya da rol adı;
  sağda oy vermediyse "oy vermedi", verdiyse seçtiği seçenek ve zamanı ("Salı · 12.10.2026 14:02"); gizli ankette
  (seçim ve zaman gelmediği için) yalnız "oy verdi". Boşsa "Bu seçimde kimse yok.".

### Yeni anket

- `EYLEMLER['anket-yeni']` — `GET /api/mesajlar/hedefler` (sınıf listesi ve "Tüm okula" izni için). Varsayılan bitiş
  günü bugünden 7 gün sonrası (yerel tarih; değişkenin adı `yarin` ama değeri bir hafta sonra). Pencere "Yeni anket":
  - Soru (`#aSoru`, 200, "ör. Okul gezisi için hangi gün uygun?"), Açıklama (`#aAciklama`, isteğe bağlı, 1000);
  - Seçenekler (`#aSecenekler`): iki kutu ve "Seçenek ekle" (`anket-secenek-ekle`);
  - Kime (`#aHedefTur`): `okulIzin` ise ilk seçenek "Tüm okula", sonra "Rol grubuna" ve "Sınıflara";
  - rol paneli (`#aHedefRol`): "Öğrenciler (ve velileri)", "Veliler", "Öğretmenler" (`.aRol`) — "Tüm okula" yoksa
    açılışta görünür;
  - sınıf paneli (`#aHedefSinif`): "7-A (28 öğrenci)" onay kutuları (`.aSinif`); sınıf yoksa "Sınıf yok.";
  - Bitiş günü (`#aBitis`) ve saati (`#aBitisSaat`, 23:59); "Gizli anket (kimin neyi seçtiğini ben de görmeyeyim)"
    (`#aGizli`); `#aMesaj`;
  - "Vazgeç" / "Anketi aç" (`anket-ac`). "Kime" değişince yalnız ilgili panel görünür. Soruya odaklanır.
- `anketSecenekKutusu(n)` — `input.aSecenek` (120 harf, "3. seçenek").
- `EYLEMLER['anket-secenek-ekle']` — en çok 10 kutu; 10'a ulaşınca düğme kapanır; yeni kutuya odaklanır.
- `EYLEMLER['anket-ac']` — dolu seçenekleri (kırpılmış) toplar; hedef: rolde `secililer('.aRol')`, sınıfta
  `secililer('.aSinif')`, okulda yalnız `{ tur: 'okul' }`. Düğme "Açılıyor..."; `POST /api/anketler { soru, aciklama,
  secenekler, hedef, bitisGun, bitisSaat, gizli }`. Başarıda pencere kapanır, sayfa yeniden açılır, üstte "Anket açıldı —
  40 kişiye ulaştı."; hatada düğme geri gelir, ileti `#aMesaj`'a.

## Kimle konuşur?

- Parçalar ad sırasıyla tek bir IIFE'de birleşir (`/js/app.js`; [../../../sunucu/http.md](../../../sunucu/http.md)
  `birlesikOku`). Çağırdıkları:
  - `S` ([00-durum.md](00-durum.md)); `$`, `esc`, `api`, `EYLEMLER` ([01-yardimcilar.md](01-yardimcilar.md)); `ik`,
    `tarihSaat`, `nrm`, `ROL_AD` ([02-ikonlar.md](02-ikonlar.md)); `modalAc`, `modalKapat`, `mesajGoster`, `sayfaMesaji`
    ([03-mesaj-modal.md](03-mesaj-modal.md)); `dugmeBekle`, `dugmeBitir` ([05-giris.md](05-giris.md)); `hero`, `yaz`,
    `git`, `bosKutu` ([07-yonlendirme.md](07-yonlendirme.md)); `SAYFALAR` ([08-ana-sayfa.md](08-ana-sayfa.md));
  - `secililer` ([19-mesajlar.md](19-mesajlar.md)); `hataGoster` (`25-tiklama.js`).
- Sunucu uçları ([../../../sunucu/bolumler/anket.md](../../../sunucu/bolumler/anket.md)); hepsi öğrenci, veli, öğretmen
  ve müdüre açık (servisçi ve yönetici 403):
  - `GET /api/anketler` → `{ gelen (hangi okuldan olursa olsun, açıklar önce, en çok 80; benimOyum, bitenlerde sayimlar),
    yonetilen (açtıkların; müdürde okulun en yeni 100 anketi), olusturabilir (mesaj.toplu) }`.
  - `POST /api/anketler` — `mesaj.toplu` (okul hedefi için `mesaj.herkese`); saatte 20; 2–10 farklı seçenek; bitiş en az
    5 dakika, en çok 90 gün sonra (sunucu saatiyle); hedef `okul|rol|sinif`, kişi seçimi yok. Hedef, mesajlardaki duyuru
    kuralıyla çözülür ([../../../sunucu/bolumler/mesaj.md](../../../sunucu/bolumler/mesaj.md) `mesajAlicilariCoz`);
    hedefe "Anket: <soru>" bildirimi.
  - `POST /api/anketler/oy { id, secenekId }` — dakikada 120; kapalıysa 400, hedefte değilse 403.
  - `POST /api/anketler/kapat`, `POST /api/anketler/sil` — açan ya da okulun müdürü.
  - `GET /api/anketler/sonuc?id=` — yönetene `{ anket, sayimlar, katilim }` (gizlide seçim ve zaman yok; gizli ve
    açıkken sayım da yok).
  - `GET /api/mesajlar/hedefler` — yalnız yeni anket penceresinin sınıf listesi ve `okulIzin`'i için.
  - Okul "Anket"i kapattıysa uçlar 403 `ozellikKapali`
    ([../../../sunucu/bolumler/ozellikler.md](../../../sunucu/bolumler/ozellikler.md)).
- Onu kullananlar: düğmeler bu dosyanın `EYLEMLER`'inde (`25-tiklama.js` önce oraya bakar). Menü
  ([06-menu.md](06-menu.md)): öğrenci, veli, öğretmen ve müdür menüsünde "Anketler"; okulun kapatabileceği "Anket"
  bölümüne bağlı (`SAYFA_OZELLIK`: `anketler`). Bildirim `#/anketler`'e bağlanır. Bu dosyanın işlevlerini başka parça
  çağırmıyor.
- CSS: `public/css/parcalar/26-anket-okul-hayati.css` — `.anket-ust`, `.anket-soru`, `.anket-aciklama`,
  `.anket-secenekler`, `.anket-secenek` (`.secili`, `:disabled`), `.anket-isaret`, `.anket-alt`, `.anket-sonuclar`,
  `.anket-sonuc` (`.benim` yeşil çubuk), `.anket-sonuc-ust`; okundu listesiyle ortak `19-mesajlar.css` —
  `.okuma-ozet`, `.okuma-arac`, `.okuma-liste`, `.alici-satir`, `.okudu`, `.okumadi`, `.sekme`, `.secim-kutu`;
  `05-tablo-grafik.css` — `.cubuk`; `03-iskelet.css` — `h3.sb`; `09-kayit-ekrani.css` — `.baglanti`;
  `04-kartlar.css` — `.etiket`.
- Rol: oy — hedefteki öğrenci, veli, öğretmen, müdür; açma — `mesaj.toplu` (müdürde her zaman); bütün okula açma —
  `mesaj.herkese`; sonuç, bitirme, silme — açan ve okulun müdürü.

## Nasıl çalışır (adım adım)?

```
Anketler ─► GET /api/anketler
   olusturabilir? ─► [Yeni anket]
   gelen:   ┌ Veli toplantısı hangi gün olsun?   Açık ┐
            │ [ Pazartesi ] [✓ Salı ]                 │  ◄─ anket-oy ─► POST oy ─► SAYFALAR.anketler()
            └ Oyun kaydedildi… · Oyumu geri al        ┘
   yönetilen: soru · 7-A · 12 / 40 kişi oy verdi · bitiş …   [Sonuç] [Bitir] [Sil]

Yeni anket ─► GET mesajlar/hedefler ─► pencere (soru, 2–10 seçenek, Kime, bitiş, gizli)
   Anketi aç ─► POST /api/anketler ─► "Anket açıldı — 40 kişiye ulaştı." (hedefe bildirim)

Sonuç ─► GET sonuc?id ─► çubuklar (gizli+açık: yok) · 12/40 oy verdi · Hepsi|Oy verenler|Vermeyenler · ara
Bitir ─► onay ─► POST kapat ─► kartlarda çubuklar görünür
```

## Dikkat!

- **"Bitir" onayı eksik anlatıyor.** Metin "sonuç oy verenlere de açılır" der; sunucu bitmiş anketin sayılarını
  hedefteki HERKESE (oy vermemiş olsa da) açar (hem listede hem `sonuc` ucunda;
  [../../../sunucu/bolumler/anket.md](../../../sunucu/bolumler/anket.md) "Dikkat!").
- **Yeni anket penceresi bütün rehberi indirir.** `GET /api/mesajlar/hedefler` yalnız `siniflar` ve `okulIzin` için
  çağrılır, ama cevabın `kisiler` listesi (müdürde okulun bütün onaylı kişileri) de iner ve kullanılmaz; büyük okulda
  gereksiz bir yük.
- **Rol grubunda "Yöneticiler" yok.** Sunucunun hedef çözücüsü müdürleri de kabul eder; pencere yalnız öğrenci (ve
  velileri), veli ve öğretmen sunar.
- **Gizlilik sunucuda.** Gizli ankette seçim ve oy zamanı hiç gelmez; açıkken sayılar da gelmez (sık bakıp artan seçenekten
  kimin ne seçtiğini çıkarmak olmasın). Ekran bu boşlukları "oy verdi" ve mavi bilgi kutusuyla doldurur; yöneten yine
  kimin oy VERDİĞİNİ görür. Bu ekrana yeni bir görünüm eklerken gelmeyen alanı başka yoldan tamamlamaya çalışma.
- **İstemci denetimi yok.** Boş soru, tek seçenek, aynı iki seçenek, geçmiş ya da 90 günden uzak bitiş, seçimsiz rol/sınıf
  sunucudan Türkçe hatayla döner ("Soruyu yaz", "En az iki farklı seçenek yaz", "Bitiş en az birkaç dakika sonrası
  olmalı"…). Bitiş günü ve saati sunucunun saatiyle yorumlanır.
- **Oy verince bütün sayfa yeniden çizilir.** `SAYFALAR.anketler()` doğrudan çağrılır: istek sürerken karttaki düğmeler
  kapalıdır, sonra kartlar sunucudan taze gelir.
- **Hedef açılışta dondurulur.** Sonradan okula katılan öğrenci ya da yeni bağlanan veli o ankette yok (sunucu kuralı);
  ekranda bunu söyleyen bir not yok.
- **Yetkisi alınan öğretmen kendi anketine ulaşamaz.** Sunucu, anketi açanın onu yönetmesine izin vermeye devam eder,
  ama `yonetilen` listesi yalnız `olusturabilir` ya da müdür olana dolu gelir; öğretmenin `mesaj.toplu`'su kaldırılırsa
  "Sonuç", "Bitir", "Sil" düğmelerinin olduğu liste ona görünmez (müdür hâlâ yönetebilir).
- **Yüzdeler toplamı 100 olmayabilir.** Her seçenek ayrı yuvarlanır (ör. üç eşit oy: %33 + %33 + %33).
- `anket-filtre` sekmeleri yerinde değiştirir; okundu listesindeki `okuma-filtre` ise paneli yeniden çizer
  ([19-mesajlar.md](19-mesajlar.md)). İkisi aynı görünür, davranışları farklı yazılmış.
- Velide `gelen` listesi bütün çocuklarının okullarından gelir; kartta hangi okulun anketi olduğu yazmaz (açanın adı
  yazar).
- `anketKatilim` (son açılan sonuç penceresinin katılım listesi: adlar, sınıflar, veli-çocuk adları) çıkışta ve portal
  değişiminde sıfırlanmaz (`26-baslat.js` `oturumDurumunuSifirla` ona dokunmaz). Ekrana gelmez — pencere her açılışta
  listeyi sunucudan yeniden kurar — ama aynı sekmede sonraki kişinin oturumunda da bellekte durur.

## Testleri

- Bu dosyanın tarayıcıda çalışan bir testi yok. Sunucu tarafı:
  - `testler/test-anket.js` — açma yetkisi, aynı seçeneğin bir kez sayılması, geçmiş ve çok uzun bitiş reddi, kişi
    seçimiyle açılmaması, hedef (öğrenciler + veli), gizli anket; oy (başka anketin seçeneği ve hedefte olmayanın reddi,
    değiştirme, geri alma); müdürün sayıları ve katılım listesi (veli çocuğuyla); gizli ankette seçim/zaman ve açıkken
    sayının gelmemesi, bitince açılması; başka okulun müdürü; silme ve bitirme; bitmiş ankete oy yazılmaması.
  - `testler/test-yedek.js` (gizli anket ve oyu yedekten geri gelir), `testler/yetki-denetimi.js` (anketi yalnız müdür
    açar; listeyi müdür, öğretmen, öğrenci, veli alır), `testler/test-servis-konum.js` (servisçi `/api/anketler`'e
    giremez).
- `testler/buton-denetimi.js` — `anket-yeni`, `anket-oy`, `anket-kapat`, `anket-sil`, `anket-sonuc`, `anket-filtre`,
  `anket-secenek-ekle`, `anket-ac` karşılıkları ve `/api/anketler` yolu.
- `testler/yazim-denetimi.js`, `testler/test-kucult.js` — ekran metinleri ve birleşik paketin derlenmesi.
- `araclar/gezinti.js` ekran turu (test değil) "Anketler (sonuçlar)", "Yeni anket penceresi", "Anketin ayrıntısı" ve
  öğrencinin "Anketler (oy verildi)" görüntülerini alır.
- Elle: `testler/seed.js`'teki müdürle gir → Anketler → "Yeni anket" → soru ve iki seçenek, Kime "Rol grubuna" →
  Öğrenciler, bitiş yarın → "Anketi aç": "Anket açıldı — N kişiye ulaştı.". Öğrenciyle gir → bir seçeneğe bas: "Oyun
  kaydedildi…" ve "Oyumu geri al". Müdürle "Sonuç": "1 / N kişi oy verdi", öğrencinin seçimi ve zamanı; "Bitir"den sonra
  öğrencinin kartında çubuklar ve "(senin seçimin)".

## Son durum

- `git log`: 4 commit. Son değişiklik `dea6f4b commit 372` (2026-09-26; 11 satır): `anketSekme` ve `anket-filtre` eklendi
  (sonuç penceresindeki Hepsi / Oy verenler / Vermeyenler sekmeleri); ondan önceki hâlde pencere `anketSekme`'yi
  çağırıyordu ama tanımlı değildi. Aynı commit `19-mesajlar.js`'e `okumaSekme`'yi ekledi.
- `c4cc6b7 commit 300` (2026-09-26; 27 satır): `anket-secenek-ekle` ve `anket-ac`; aynı commit
  `26-anket-okul-hayati.css`'i ve `testler/test-anket.js`'i getirdi. `849f116 commit 299` (173 satır): kart, sonuç
  çubukları, oy, bitirme, silme, sonuç penceresi, yeni anket penceresi. Dosyanın ilk hâli `60a5a49 commit 298`
  (2026-09-26; 41 satır: sayfa ve yönetilen listesi); aynı commit sunucu bölümünün uçlarını (`sunucu/bolumler/anket.js`)
  ve `04a-form-alanlari.js`'e gün/ay/yıl seçicisini (`tarihSecici`) getirdi.
- Bilinen açıklar (kod değiştirilmedi): "Bitir" onay metninin eksik olması, yeni anket penceresinin bütün rehberi
  indirmesi, rol grubunda "Yöneticiler"in olmaması, yetkisi alınan öğretmenin kendi anketine ulaşamaması.
- Planlı işlerden bu dosyaya dokunacak olanlar:
  - "Anket düzenleyici" (kullanıcı 28 Eylül'de onayladı): tek soruluk anket çok sorulu forma dönüşecek. Anketler →
    "Anket oluştur" tam sayfa düzenleyici (pencere değil): soru kartları; türler Tek seçim, Birden çok seçim, Açılır
    liste, Kısa yanıt, Uzun yanıt; "Zorunlu" anahtarı, soruyu kopyala/sil/taşı, katılımcı gözüyle önizleme; "Taslağı
    kaydet" ("Taslaklarım"); "Yayınla" adımında hedef, bitiş, gizli — ya da anketi bir mesaja/ödeve ek olarak koyma;
    ilk cevaptan sonra sorular değişmez; doldururken "kaydet, sonra devam et"; sonuçları Excel'e indirme. Eski tek
    soruluk anketler tek soruluk form olarak korunacak. Bu dosyanın büyük kısmı yeniden yazılacak.
  - "Özel roller" (öneri): anket açma ayrı bir `anket.olustur` yetkisine geçecek (bugün `mesaj.toplu`'ya bağlı;
    `olusturabilir` ona göre değişir).
  - "Düzenleyiciler" (onaylı): anket açıklaması için ortak yazı düzenleyici ve ileri tarihli gönderim.
  - "Optimizasyon + saklama süreleri": anketler bitişinden 1 yıl sonra silinecek.
