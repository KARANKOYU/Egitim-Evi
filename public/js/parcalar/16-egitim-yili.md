# public/js/parcalar/16-egitim-yili.js

Eğitim yılının ön yüz tarafı: her sayfanın başındaki yıl şeridi (geçmiş yıla ya da nakil öğrencinin eski okuluna
bakış), yıl bilgisini bir kez çekip `S.yilBilgi`'de saklama ve müdürün "Eğitim Yılı" sayfası (yıl listesi, yıla bakma,
aktif yapma, yeni yıl açma).

## Bu dosya ne yapar?

Okul her yıl yeni ödevler, yeni ders programı, yeni yoklamalarla başlar; ama geçen yılın kaydı kaybolmamalı. Sunucu bunu
kayıtları açıldıkları yıla damgalayarak çözer
([../../../sunucu/bolumler/egitim-yili.md](../../../sunucu/bolumler/egitim-yili.md)).
"Aktif yıl" okulundur (yeni kayıtlar ona yazılır), "bakılan yıl" kişinindir (kimse seçmediyse aktif yıl). Bakılan yıl
aktif yıldan farklıysa kişi "arşivde"dir.

Bu dosya üç şey yapar:

1. **Yıl bilgisini tutar.** `yilBilgisiYukle()` girişten sonra ve yıl değişince `GET /api/egitim-yili`'yi bir kez çağırıp
   cevabı `S.yilBilgi`'ye koyar; her sayfada yeniden sorulmaz.
2. **Yıl şeridini üretir.** `yaz()` ([07-yonlendirme.md](07-yonlendirme.md)) her sayfanın en başına `yilSeridi()`'ni koyar:
   seçilebilecek en az iki dönem varsa (okulun yılları, öğrencide ve velisinde ayrıca önceki okul dönemleri) "Eğitim yılı"
   etiketli (CSS büyük harfle gösterir) bir açılır liste; geçmiş bir yıla bakılıyorsa şerit turuncu olur ve "Geçmiş yıla
   bakıyorsun — kayıtlar salt okunur." der. Nakil gelen öğrencide (ve
   velisinde) listenin sonunda "Önceki okullar" grubu çıkar: eski okulun dönemleri "2025-2026 · Eski Okul · 6-A" gibi.
3. **"Eğitim Yılı" sayfasını çizer** (`SAYFALAR['egitim-yili']`): müdür ve `yil.yonet` yetkili öğretmen yılları görür,
   birine bakar, aktif yılı değiştirir, yeni yıl açar.

Velinin işi biraz farklı: velinin yılı çocuğun okuluna göredir. `yilOgrencisi()` hangi çocuğun yıllarına bakılacağını
söyler; şerit de veliye yalnız üç veli sayfasında görünür.

Açılır listenin değişme olayı `07-yonlendirme.js`'te (`yilSeciciBagla`), sayfadaki düğmelerin karşılığı `25-tiklama.js`'te
(`yil-bak`, `yil-aktif`, `yil-ekle`); ikisi de aşağıda anlatıldı.

## İçinde neler var?

### Değişken ve yardımcılar

- `VELI_YIL_SAYFALARI` — `['veli-odevler', 'veli-ilerleyis', 'veli-devamsizlik']`. Rolü `parent` olan kişide şerit
  yalnız bu üç sayfada görünür.
- `yilOgrencisi()` — yalnız rolü `parent` olan kişide anlamlıdır: seçili çocuk (`veliSeciliCocuk()`, `27-veli-panel.js`;
  çocuk şeridinden, veli portalından ya da bildirim adresinden seçilmiş) varsa onun kimliği; yoksa tek çocuğu varsa o;
  değilse `''`. Öteki rollerde her zaman `''`. Çağıranlar: `yilBilgisiYukle`, `yilSeciciBagla` (07) ve `yil-bak` (25)
  isteğin gövdesine `ogrenci` olarak koyar.
- `yilSeridi()` — `S.yilBilgi`'den şerit HTML'i ya da `''`. Boş döndüğü durumlar: yıl bilgisi yok; listede ikiden az
  öğe var (öğeler okulun yılları ve öğrencinin önceki okul dönemleri; yeni okulunda yıl tanımlı değilse sunucu başa
  "Şimdiki okul" öğesini koyar); kişi veli ve sayfa `VELI_YIL_SAYFALARI`'nda değil; listede `bakilan` işaretli öğe
  yok. Şerit:
  - `div.yil-seridi` (arşivdeyse ayrıca `.arsiv`) > `span.yil-etiket` "Eğitim yılı" + `select#yilSec`;
  - her yıl bir `option` (değer yılın kimliği, `esc`'li), bakılan `selected`, aktif olanın adının yanında " (aktif)";
  - listede ilk `gecmis: true` öğeye gelince `optgroup label="Önceki okullar"` açılır ve sona kadar sürer (sunucu geçmiş
    dönemleri listenin sonuna koyar);
  - arşivdeyse (`arsiv: true`) `span.yil-not`: bakılan geçmiş bir okul dönemiyse "Önceki okulunun kaydına bakıyorsun —
    kayıtlar salt okunur.", değilse "Geçmiş yıla bakıyorsun — kayıtlar salt okunur.".
- `yilBilgisiYukle()` — söz döner. Oturum yoksa ya da kişinin okulu yok ve `yilOgrencisi()` de boşsa `S.yilBilgi = null`
  (istek atılmaz). Değilse `GET /api/egitim-yili` (veli için `?ogrenci=<çocuk>`) → `S.yilBilgi = d`. Hata sessizce
  yutulur, `S.yilBilgi = null` olur: şerit görünmez, sayfa yine açılır. Çağıranlar: `26-baslat.js` (girişten sonra, ilk
  sayfa çizilmeden — şerit ilk açılışta da görünsün diye), `07-yonlendirme.js` (seçici değişince),
  [08c-kisilikler.md](08c-kisilikler.md) (veli portalına geçiş, yeni çocuk), `25-tiklama.js` (`yil-bak`, `yil-aktif`,
  `yil-ekle`, veli çocuk şeridi `veli-cocuk`).

### "Eğitim Yılı" sayfası — `SAYFALAR['egitim-yili']`

`GET /api/egitim-yili` (`?ogrenci=`'siz: kişinin kendi gözü) → `S.yilBilgi = d` (sayfa çizilirken şerit de tazelensin) →

- başlık "EĞİTİM YILI" (alt yazısız);
- bir kart: "Her eğitim yılı kendi programını, ödevlerini ve devamsızlık kaydını tutar. Yeni yıl açtığında eskisi
  silinmez — istediğin zaman geri dönüp bakabilirsin." Altında:
  - hiç yıl yoksa bilgi iletisi (`msg bilgi`, sitenin ana renginin açık tonu): "Henüz eğitim yılı tanımlamadın.
    Şimdiye kadarki tüm kayıtlar açacağın ilk yıla ait sayılacak." (sunucu yılı olmayan eski kayıtları okulun ilk yılına
    sayar);
  - varsa her yıl bir satır: ad + yeşil "Aktif" etiketi ya da (aktif değil ama bakılansa) mavi "Bakılan"; altında
    başlangıç ve bitiş (`tarihGun`: "1 Eylül 2026, Salı — 30 Haziran 2027, Çarşamba"); bakılan değilse "Bu yıla bak"
    (`data-act="yil-bak" data-id`), `yonetebilir` ve aktif değilse "Aktif yap" (`data-act="yil-aktif" data-id`).
- `d.yonetebilir` ise "Yeni eğitim yılı aç" kartı: `input#yilAd` (`maxlength="9"`; yer tutucu yazı ağustos ve sonrasında
  "<bu yıl>-<gelecek yıl>", öncesinde "<geçen yıl>-<bu yıl>" — 30 Eylül 2026'da "2026-2027"), "Aç ve aktif yap"
  (`data-act="yil-ekle"`), açıklama "Yeni yıl aktif olur; bundan sonra açılan ödev, program ve yoklama kayıtları bu yıla
  yazılır. Sınıflar ve öğrenciler ortak kalır.", ileti yeri `#yilMesaj`.
- `yaz(h)`.

### Başka dosyalardaki karşılıklar (bu dosyanın ürettiği öğeler için)

- `select#yilSec` değişince (`07-yonlendirme.js` `yilSeciciBagla`): `POST /api/egitim-yili/bak { id, ogrenci:
  yilOgrencisi() }` → `yilBilgisiYukle()` → `git(S.page)` (aynı sayfa o yılın kayıtlarıyla yeniden açılır); hata tarayıcı
  uyarısıyla (`hataGoster`).
- `yil-bak` (`25-tiklama.js`): aynı `bak` isteği → `yilBilgisiYukle()` → `git(S.page)`; hata `hataGoster`.
- `yil-aktif` (`25-tiklama.js`): onay "Bu yıl aktif yapılsın mı?\n\nBundan sonra açılan ödev, program ve yoklama
  kayıtları bu yıla yazılır." → `POST /api/egitim-yili/aktif-yap { id }` → `yilBilgisiYukle()` → `git('egitim-yili')`;
  başarı iletisi gösterilmez; hata `hataGoster`.
- `yil-ekle` (`25-tiklama.js`): düğme kilitlenir → `POST /api/egitim-yili/ekle { ad: #yilAd'ın değeri }` →
  `yilBilgisiYukle()` → `git('egitim-yili')` → sayfanın üstünde yeşil "2026-2027 eğitim yılı açıldı."; hata `#yilMesaj`'a
  kırmızı ("Yıl adını 2026-2027 biçiminde yaz", "İkinci yıl birincinin bir fazlası olmalı", "Bu eğitim yılı zaten var",
  403 "Eğitim yılı açma yetkin yok").

## Kimle konuşur?

- Çağırdıkları: `S.user`, `S.children`, `S.page`, `S.yilBilgi` ([00-durum.md](00-durum.md)); `api`, `esc`
  ([01-yardimcilar.md](01-yardimcilar.md)); `tarihGun` ([02-ikonlar.md](02-ikonlar.md)); `hero`, `yaz`
  ([07-yonlendirme.md](07-yonlendirme.md)); `SAYFALAR` ([08-ana-sayfa.md](08-ana-sayfa.md)); `veliSeciliCocuk`
  (`27-veli-panel.js`; bu dosyadan sonra birleşir, çağrı çalışma anında).
- Sunucu uçları — [../../../sunucu/bolumler/egitim-yili.md](../../../sunucu/bolumler/egitim-yili.md), hepsi `need()`
  (giriş + onaylı hesap). `?ogrenci=` (ya da gövdede `ogrenci`) verilmiş ve kişi öğrenci değilse o öğrenciyi görebilmeli
  (403 "Bu öğrenciyi görme yetkin yok") ve çocuğun gözünden bakılır; verilmemişse kişinin bir okulu olmalı (velinin okulu
  yoksa ilk çocuğunun okulu yazılır; yöneticiye 403):
  - `GET /api/egitim-yili[?ogrenci=]` → `{ yillar: [{ id, ad, bas, bit, gecmis, aktif, bakilan }], yonetebilir, arsiv }`
    (`yonetebilir`: kişi kendi gözünden bakıyor ve `yil.yonet` yetkisi var; `arsiv`: bakılan dönem geçmiş okul dönemi ya
    da aktif yıldan farklı bir yıl).
  - `POST /api/egitim-yili/bak { id, ogrenci? }` — seçim kişiye özeldir, veriyi değiştirmez (velinin seçimi velinin
    hesabına yazılır).
  - `POST /api/egitim-yili/aktif-yap { id }` — `yil.yonet`; işlem kaydı `yil.aktif-degisti`.
  - `POST /api/egitim-yili/ekle { ad }` — `yil.yonet`; başlangıç `<ilk yıl>-09-01`, bitiş `<ikinci yıl>-06-30` (sabit);
    yeni yıl aktif olur, açanın bakılan yılı yeni yıl olur; işlem kaydı `yil.acildi`.
- Onu kullananlar:
  - [07-yonlendirme.md](07-yonlendirme.md) — `yaz` her sayfada `yilSeridi()`; `yilSeciciBagla` `yilOgrencisi`,
    `yilBilgisiYukle`.
  - `26-baslat.js` — `yilBilgisiYukle` (açılışta); [08c-kisilikler.md](08c-kisilikler.md) — `yilBilgisiYukle`;
    `25-tiklama.js` — `yilOgrencisi`, `yilBilgisiYukle`.
  - Menü ([06-menu.md](06-menu.md)): müdürde "Okul Düzeni" altında "Eğitim Yılı"; `yil.yonet` yetkili öğretmende ek yetkiler
    başlığı altında. `SAYFA_OZELLIK`'te yoktur (kapatılamaz).
  - Ekran turu `araclar/gezinti.js`: "Eğitim yılı" sayfası, açılmış yıl seçici ve "Önceki okullar" seçeneği.
- CSS: `public/css/parcalar/22-cesitli.css` — `.yil-seridi` (kart zeminli esnek satır), `.yil-seridi.arsiv` (turuncu zemin
  ve çerçeve), `.yil-etiket` (küçük, büyük harfli, soluk), `.yil-seridi select`, `.yil-not` (turuncu, kalın). Sayfanın
  kartları ortak sınıflarla: `04-kartlar.css` (`.kart`, `.satir`, `.buyu`, `.etiket.yesil`, `.etiket.mavi`), `02-form.css`
  (`.hint`, `.msg.bilgi`, `.field`, `.btn`, `.btn.kucuk`, `.btn.ghost`, `.btn.gri`).
- Rol: şerit — okulu olan her hesap (öğretmen, müdür, öğrenci, servisçi; veli yalnız üç veli sayfasında), listede en az
  iki dönem varsa; sayfa — müdür ve `yil.yonet` yetkili öğretmen (menüden). Başka biri adres çubuğundan `#/egitim-yili` açarsa
  yıl listesini ve "Bu yıla bak"ı görür, yönetim düğmeleri çıkmaz. Sistem yöneticisinin okulu olmadığı için şeridi yoktur.
- Android uygulaması bu dosyayı kullanmaz.

## Nasıl çalışır (adım adım)?

```
giriş ─► 26-baslat: yilBilgisiYukle() ─► GET /api/egitim-yili[?ogrenci=çocuk] ─► S.yilBilgi
      ─► git(sayfa) ─► SAYFALAR[sayfa]() ─► yaz(h)
                                            #sayfa = yilSeridi() + h + altBilgi()
                                            ┌──────────────────────────────────────────────────────────────┐
                                            │ EĞİTİM YILI [2025-2026 ▾]  Geçmiş yıla bakıyorsun — kayıtlar │  (turuncu: arşiv)
                                            │                            salt okunur.                      │
                                            └──────────────────────────────────────────────────────────────┘
seçici değişir ─► POST /api/egitim-yili/bak { id, ogrenci } ─► yilBilgisiYukle() ─► git(S.page)
                   (sunucu: kullanicilar.secili_yil_id / secili_gecmis)   (aynı sayfa, o yılın kayıtları)

müdür "Eğitim Yılı" ─► GET /api/egitim-yili ─► yıl satırları + "Yeni eğitim yılı aç"
   "Aç ve aktif yap" ─► POST /ekle { ad } ─► yilBilgisiYukle ─► git('egitim-yili') ─► "… eğitim yılı açıldı."
   "Aktif yap"       ─► onay ─► POST /aktif-yap { id } ─► yilBilgisiYukle ─► git('egitim-yili')
```

Örnek: okulda 2025-2026 ve 2026-2027 var, 2026-2027 aktif. Müdür seçiciden 2025-2026'yı seçer → şerit turuncu olur;
ödev ve program ekranları geçen yılın kayıtlarını gösterir; bu hâlde yeni ödev vermeye kalkarsa sunucu 409 ile durdurur.
Seçiciden 2026-2027'ye dönünce şerit normale döner.

## Dikkat!

- **"Salt okunur" yazısını sunucu yalnız öğretmen ve müdür için uygular.** Arşivdeki öğretmen/müdürün yıla bağlı
  yazmaları (ödev, sınav, yoklama, takvim etkinliği, ders programı) 409 `{ arsiv: true }` alır
  ([../../../sunucu/api.md](../../../sunucu/api.md)). Öğrenci ve veli için `arsiv` yalnız ekrandaki işarettir; sunucu
  onların isteklerini bu yüzden durdurmaz.
- **Seçim kalıcıdır.** Bir kez seçiciden ya da "Bu yıla bak"tan yıl seçen kişinin seçimi hesabına yazılır. Müdür sonradan
  yeni yıl açarsa, eski yılı açıkça seçmiş olan kişi o eski yılda kalır: sayfa yenilenince şeridi turuncu olur, öğretmense
  yeni yıla geçene kadar kayıt açamaz (409). Kimse seçmediyse kişi kendiliğinden aktif yıla bakar. (Sunucudaki
  `yilBilgisi` kuralından; tarayıcıda denenmedi.)
- **`S.yilBilgi` bayatlayabilir.** Bilgi girişte ve bu kişinin yıl işlemlerinden sonra çekilir; başka biri (müdür) yıl
  açar ya da aktif yılı değiştirirse öteki kişilerin şeridi sayfa yenilenene kadar eski hâlini gösterir.
- **Velide şerit ile veri ayrışabilir.** Şerit veliye yalnız `VELI_YIL_SAYFALARI`'nda görünür; ama velinin seçtiği yıl
  sunucuda başka ekranlara da uygulanır: velinin Ana Sayfası (yaklaşan ödevler ve sayıları `/api/progress`'ten gelir),
  çocuğun portal görünümündeki Ödevleri/Sınavları/İlerleyişi (`/api/progress`) ve Devamsızlığı, takvimdeki ödevler de
  `bakisKisisi` ile velinin seçtiği yıla süzülür. Veli bir veli sayfasında geçmiş yılı seçip sonra bu ekranlara giderse
  geçen yılın verisini şeritsiz, uyarısız görür. (Kod okumasına göre; denenmedi.) Öneri: şeridi velide de her sayfada
  göstermek ya da ana sayfa/portal/takvim sayfalarını listeye eklemek. Kod değiştirilmedi.
- **Velide "Hepsi" seçiliyken.** İki ya da daha çok çocuğu olan veli çocuk seçmemişse `yilOgrencisi()` boş döner; istek
  `?ogrenci=`'siz gider ve velinin hesabındaki okulun (genelde ilk bağlanan çocuğun okulu) yılları gelir; önceki okul
  dönemleri çıkmaz. Velinin hesabında okul hiç yazılı değilse (`S.user.schoolId` boş) istek hiç atılmaz, şerit çıkmaz.
  İki çocuk farklı okullardaysa birinin okulunda seçilen yıl ötekinin okulunda bulunmaz, orada aktif yıl kullanılır
  ([../../../sunucu/bolumler/egitim-yili.md](../../../sunucu/bolumler/egitim-yili.md)).
- **Velisi olduğu çocuğa bakan öğretmen/müdür** için `yilOgrencisi()` boştur (rolü `parent` değil): şerit her sayfada
  kendi okulunun yıllarını gösterir.
- **"Önceki okulunun kaydına bakıyorsun"** yazısı velide de aynıdır; velinin değil çocuğunun önceki okulu kastedilir.
- **`optgroup` sıraya güvenir.** Grup, ilk geçmiş dönemden listenin sonuna kadar sürer; sunucu okulun yıllarını geçmiş
  dönemlerden sonra verirse okul yılları da "Önceki okullar" altına düşer.
- **Tek seçenekte şerit yok.** Listede tek öğe (ya da hiç öğe) varken seçecek bir şey olmadığı için şerit hiç çıkmaz.
  Nakil gelen öğrencide sayı okulun yıllarıyla değil listeyle ölçülür: okulunda tek yıl (ya da hiç yıl) olsa da önceki
  okul dönemi olduğu için şerit çıkar. Önceki dönemlerin başlangıç/bitiş tarihi yoktur; öğrenci adres çubuğundan
  "Eğitim Yılı" sayfasını açarsa bu satırların tarihi "- — -" görünür.
- **Yeni yıl adını ön yüz denetlemez.** Yer tutucu yalnız ipucudur; kutu boşken "Aç ve aktif yap"a basılırsa sunucu
  "Yıl adını 2026-2027 biçiminde yaz" der. Yılın tarihleri sunucuda sabittir (1 Eylül – 30 Haziran), formda seçilemez.
- **"Aktif yap" sonrası ileti yok.** Sunucunun "… artık aktif eğitim yılı." iletisi kullanılmaz; sayfa yeniden çizilir,
  "Aktif" etiketi yer değiştirir.
- **Yıl bilgisi hatası sessizdir.** `yilBilgisiYukle` hatayı yutar; sunucu yıl bilgisi veremezse kişi yalnız şeridi
  görmez, bir hata iletisi almaz.

## Testleri

- Tarayıcıda bu dosyayı çalıştıran bir test yok.
- `testler/buton-denetimi.js` (sunucusuz) — `yil-bak`, `yil-aktif`, `yil-ekle` eylemlerinin karşılığı (`25-tiklama.js`) ve
  `egitim-yili` sayfasına bir menü düğmesinin götürmesi.
- `testler/yazim-denetimi.js` (sunucusuz) — görünen Türkçe metinler.
- Sunucu tarafı (bu dosyanın çağırdığı uçlar): `testler/test-egitim-yili.js` (boş liste, müdürün `yonetebilir`'i, ilk yıl,
  biçim denetimleri, eski yıla bakınca `arsiv`, geçmiş yıla bakarken yeni kayıt 409, öğrencinin yıllara bakabilip
  açamaması, aktif yılı değiştirme), `testler/test-nakil.js` (öğrencinin ve velinin listesinde önceki okul, "Şimdiki okul"
  seçeneği, veli `?ogrenci=`, ilgisiz kişi 403), `testler/yetki-denetimi.js` (liste: müdür, öğretmen, öğrenci, veli,
  servisçi; yıl açma yalnız müdür), `testler/girdi-denetimi.js` (bozuk yıl adı), `testler/test-quiz.js` (arşiv yılında
  quiz), `testler/test-okul-agi.js` (ana sayfa yükünde `/api/egitim-yili`).
- Elle: `testler/seed.js`'teki müdürle "Eğitim Yılı" → "2025-2026" aç, sonra "2026-2027" aç: şerit belirir; seçiciden
  2025-2026 → turuncu şerit ve "Geçmiş yıla bakıyorsun — kayıtlar salt okunur."; bu hâlde ödev vermeyi dene (409);
  "Bu yıla bak" ile geri dön; eski yılda "Aktif yap" onayını dene.

## Son durum

- `git log`: tek commit, `ca7b9b8 commit 357` (2026-09-26): dosya bugünkü hâliyle (104 satır) eklendi — veli yıl sayfaları,
  `yilOgrencisi`, "Önceki okullar" gruplu `yilSeridi`, `yilBilgisiYukle`, "Eğitim Yılı" sayfası. Aynı commit sunucu
  tarafında `sunucu/bolumler/egitim-yili.js` ve `sunucu/bolumler/ogretmen.js`'e de dokundu. O günden beri değişmedi.
- Bilinen açıklar (kod değiştirilmedi): velide şeridin yalnız üç sayfada görünüp seçimin başka ekranlara da uygulanması;
  açıkça seçilen yılın yeni yıl açılınca da kalması (öğretmen arşivde kalır, 409 alır); "Aktif yap" sonrası iletinin
  gösterilmemesi; `yilBilgisiYukle` hatasının sessiz yutulması; "Önceki okulunun kaydına bakıyorsun" yazısının velide de
  aynı çıkması.
- Planlı işlerden bu dosyaya dokunması beklenenler:
  - "Yıl geçişi" (yeni yıl sihirbazı): Eğitim Yılı sayfasında adım adım sihirbaz — yeni yılın adı VE başlangıç/bitiş
    tarihleri, yıl sonu arşivi/okul yedeği, sınıf atlatma önizlemesi, mezunlar, taşıma seçenekleri, 24 saat içinde geri
    alma, eylül başında müdüre bildirim; "Yedekler" bölümü bu sayfada ya da okul ayarlarında. Sihirbaz bugünkü "Yeni
    eğitim yılı aç" kartının yerine geçecek.
  - "Optimizasyon + saklama süreleri": öğrenci ve velisi seçicide yalnız aktif yılı ve bir önceki yılı görecek (önceki
    okul dönemleri de bu kurala tabi); sunucu daha eskisini "Eski yıllar yalnız okul yönetimine açık" diye reddedecek,
    şeridin listesi kısalacak.
  - "Tek kişi tek hesap + portallar öğrencide de": nakil artık hesabı taşımayacak, eski okul "geçmiş" portal olacak; bugün
    yıl seçicideki "Önceki okullar" grubunun yolu değişebilir.
  - "Çok dil": şerit ve sayfa metinleri çeviri işlevinden geçecek.
  - "Ekran turu + albüm": sayfa ve yıl seçici görüntüleri baştan çekilecek.
