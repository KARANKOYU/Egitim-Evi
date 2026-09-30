# public/js/parcalar/08c-kisilikler.js

Yetişkin hesabının portalları ve "+ Ekle": sol menünün başındaki "Portallarım", portal dışındaki ana sayfa, Ayarlar'daki
"Portallarım" kartı, portallar arası geçiş (yeni oturum ya da yalnız seçili çocuk), okuldan ayrılma, çocuğu kaldırma ve
"Ne eklemek istiyorsun?" penceresi (Veli · Öğretmen · Müdür).

## Bu dosya ne yapar?

Eğitim Evi'nde bir yetişkin tek bir hesapla birden çok "şapka" takabilir: A okulunda öğretmen, B okulunda müdür, aynı
zamanda iki çocuğun velisi. Her biri bir **portaldır**. Bu dosya yetişkinin bu portalları görmesini, aralarında
geçmesini ve yenisini eklemesini sağlar:

- **Sol menünün en üstü:** "Portallarım" başlığı altında *Öğretmen · Test Ortaokulu*, *Müdür · Deneme Lisesi*,
  *Veli · Elif Yılmaz* gibi satırlar; bulunulan portal işaretli; müdürü kaldırılmış (kapalı) okul soluk; en altta
  "Portal ekle".
- **Portal dışındaki ana sayfa:** birden çok portalı olan kişi girişte önce hesabının ana sayfasını görür: "PORTALLARIN —
  Soldaki menüden bir portal seç." ve portal kartları. Hiç portalı yoksa "Henüz bir portalın yok" kartı ve büyük "+ Ekle".
- **Portala geçmek:** okul rolüne geçmek YENİ oturum demektir (sunucu eski anahtarı kapatır, yenisini verir); veli
  portalı ise yetişkin hesabının kendisidir, geçişte yalnız seçili çocuk değişir (sunucuya gidilmez).
- **"+ Ekle"** (üst çubukta; menüde "Portal ekle"): üç yol. *Veli*: çocuğun veli kodunu yazıp ekle. *Öğretmen*: kendi
  kişi kodunu gör, kopyala, okulun müdürüne ver (müdür "Öğretmenler → Kodla ekle"den girer). *Müdür*: kişi kodunu ve
  sitenin yönetici iletişim bilgilerini gör; okulu ve adresini sistem yöneticisi açar.
- **Ayarlar'daki "Portallarım" kartı:** her portal için "Geç", öğretmenlikte "Okuldan ayrıl", velilikte "Kaldır";
  müdürlükte "Müdürlüğü bırakmak için sistem yöneticisiyle iletişime geç."

Kimin hangi portala geçebileceğini, kodların doğruluğunu, her şeyi sunucu denetler
([../../../sunucu/bolumler/kisilik.md](../../../sunucu/bolumler/kisilik.md)); bu dosya görünüş ve akıştır.

Kim görür: yetişkin hesabı (rolsüz, veli) ve ona bağlı okul rolü satırındaki öğretmen/müdür. Öğrenci, servisçi ve
yöneticide portal listesi gelmez: menüde "Portallarım", üstte "+ Ekle" yoktur.

## İçinde neler var?

### Durum

- `kisilikVeri` — son `GET /api/kisilikler` cevabı; "+ Ekle"nin Öğretmen/Müdür paneli açılınca yazılır, "Yeni kod üret"te
  kodu güncellenir, çıkışta (`26-baslat.js` `oturumDurumunuSifirla`) silinir. Bugün hiçbir yer OKUMAZ (bkz. Dikkat).
- `PORTAL_SIMGE` — rol → simge/çizim adı: `teacher` → `ogretmen`, `principal` → `mudur`, `parent` → `veli`.
- `S` üzerindeki alanlar ([00-durum.md](00-durum.md)): `S.portallar` (sunucunun portal listesi ya da `null`),
  `S.hesapAktif`, `S.portalDisi`, `S.veliCocuk` (veli portalında seçili çocuk; `null` = hepsi).
- Portal nesnesi (sunucu `portalBilgisi`, [../../../sunucu/bolumler/kayit.md](../../../sunucu/bolumler/kayit.md)):
  `{ tur: 'rol'|'veli', id, rol: 'teacher'|'principal'|'parent', ad: 'Öğretmen'|'Müdür'|'Veli', alt, okulAdi,
  girilebilir, aktif }` (tanınmayan bir rolde `ad` "Okul" olur). Rol satırında `id` rol satırının, veli satırında
  çocuğun kimliğidir; `alt` rolde okul adı, velide çocuğun adı. `girilebilir` rolde "satır onaylı VE okul açık",
  velide her zaman doğrudur.

### Portal durumu

- `portalDurumuAl(d)` — giriş, portal geçişi ve `/api/me` cevabından `S.portallar` (yoksa `null`) ve `S.hesapAktif`'i alır.
- `portalDisiYaz(v)` / `portalDisiOku()` — "portal dışındayım" bilgisi `S.portalDisi`'de ve bu SEKMENİN
  `sessionStorage`'ında (`ee_portal_disi`) durur: sayfa yenilenince kişi seçtiği yerde kalır. Gizli sekmede yazılamazsa
  sessizce geçer.
- `portalDisindaMi()` — oturum yetişkin hesabının kendisinde (rol satırında değil) ve hiçbir portalda değil mi: rolsüz
  hesap her zaman; rolü olan yetişkin hesabı (bugünkü düzende `parent`) `S.portalDisi` doğruysa. Öğrenci, servisçi,
  yönetici ve rol satırı → `false`.
- `portalAktifMi(p)` — bu portal işaretlensin mi: rolde `S.user.id === p.id`; velide yalnız kişi veli portalındaysa
  (rol satırında değil, rolü `parent`, portal dışında değil) ve `S.veliCocuk` o çocuksa; hiçbir çocuk seçili değilse
  ("Hepsi") yalnız tek çocuk varken o çocuk. Sunucunun gönderdiği `p.aktif` KULLANILMAZ; seçili çocuğu yalnız tarayıcı bilir.
- `portalAlt(p)` — satırın ikinci yazısı: `p.alt`, yoksa `p.okulAdi`.
- `portallariTazele()` — `GET /api/me` → `S.user`, `S.children`, `S.kapali`, portallar; seçili çocuk artık listede
  yoksa `S.veliCocuk = null`; kişi portal dışındaydıysa orada kalır; `navCiz()`. Hata sessizce yutulur. Çağrıldığı
  anlar: portal dışındaki ana sayfa her açıldığında, çocuk eklenip kaldırılınca, okuldan ayrılınca, yeni bildirim
  gelince (bir okul kişiyi eklemiş olabilir).

### Görünümler

- `portalMenusu()` — `navCiz` ([06-menu.md](06-menu.md)) menünün başına koyar. `S.portallar` yoksa `''`. Varsa
  `div.nav-baslik` "Portallarım", her portal için `button.navlink.portal-link` (`data-act="kisilik-gec"`, `data-tur`,
  `data-id`; işaretliyse `on` ve `aria-current="page"`; girilemiyorsa `kapali` ve `title="Okul şu an kapalı"`): simge,
  `p.ad` ve `portalAlt(p)`. Sonra "Portal ekle" (`data-act="kisilik-ekle"`) ve ayraç. Liste boşsa da başlık ve "Portal
  ekle" çıkar.
- `portalAnaSayfasi()` — [08-ana-sayfa.md](08-ana-sayfa.md) `SAYFALAR.ana` portal dışındayken (ya da rolsüzken) çağırır.
  Önce `portallariTazele()`. Portal yoksa `div.kart.portal-bos`: üç çizim (çocuk ekle, kişi kodu, okul aç), "Henüz bir
  portalın yok", "Sağ üstteki + Ekle ile başla: çocuğunu ekle, okuluna öğretmen olarak katıl ya da okulunu açtır." ve
  "Ekle" düğmesi. Varsa `hero('PORTALLARIN', 'Soldaki menüden bir portal seç.')` ve her portal için büyük kart
  (`button.portal-kart`, `data-act="kisilik-gec"`): çizim, ad (+ girilemiyorsa turuncu "okul kapalı" etiketi), alt yazı,
  velide ayrıca çocuğun okulu; sonunda kesik çizgili "Ekle" kartı ("Çocuğunu, okulunu ya da öğretmenliğini ekle").
- `portalYonetimKarti()` — `23-veli-ayarlar.js` Ayarlar sayfasına koyar (`S.portallar` varsa). `div.kart#portalKart`:
  başlık "Portallarım" + "Ekle" düğmesi; portal yoksa kısa açıklama; her portal bir satır: simge, "Öğretmen · Okul
  adı", işaretliyse yeşil "şu an buradasın", girilemiyorsa turuncu "okul kapalı"; alt satırda velide çocuğun okulu,
  müdürde "Müdürlüğü bırakmak için sistem yöneticisiyle iletişime geç."; düğmeler: "Geç" (işaretli ya da girilemez
  değilse), öğretmende "Okuldan ayrıl" (`kisilik-ayril`, `data-ad` okul adı), velide "Kaldır" (`kisilik-cocuk-kaldir`,
  `data-ad` çocuğun adı).

### Geçiş ve yönetim

- `oturumuDegistir(d, hedefSayfa)` — sunucu yeni oturum verdiğinde (portal geçişi, okuldan ayrılınca, telefon
  bildiriminden gelen geçiş): `S.token = d.token`, `tokenYenile(yeni, eski)` (anahtar bu sekmenin seçtiği saklama
  biçimiyle yazılır, [05-giris.md](05-giris.md)), `oturumDurumunuSifirla()` (önceki kişiliğin ekran durumu silinir,
  `26-baslat.js`), `S.user`, `S.children`, `S.kapali`, `S.veliCocuk = d.cocuk`, portallar; açılış sayfası
  `hedefSayfa` (`SAYFALAR`'da varsa) ya da `ana`; açık pencere kapanır; `girisSonrasi(d)`
  ([05b-sifre-zorunlu.md](05b-sifre-zorunlu.md)) — aydınlatma onayı, zorunlu şifre, sonra uygulama baştan açılır.
- `EYLEMLER['kisilik-gec']` — `25-tiklama.js` onu `(düğme, id)` ile çağırır; `id` düğmenin `data-id`'si (rol satırı ya
  da çocuk kimliği). `data-tur`'a göre:
  - zaten bu rol satırındaysan (`tur === 'rol'` ve `S.user.id === id`) → yalnız `git('ana')`;
  - yetişkin hesabındaysan, rolün `parent` ve `tur === 'veli'` ise → sunucuya gitmez: `S.veliCocuk = id`,
    `portalDisiYaz(false)`, `yilBilgisiYukle()` (yıl seçici o çocuğun okuluna göre), `git('ana')`;
  - değilse önce `tekSeferAyrilabilir('oturum')` ([03-mesaj-modal.md](03-mesaj-modal.md) `TEK_SEFER`): bir kez
    gösterilen şifreler (giriş bilgisi listesi, aktarım sonucu, yeni hesabın şifresi) açıksa "Ayrılınsın mı?" sorulur,
    "İptal" → hiçbir şey olmaz (yeni oturum ekran durumunu sileceği için). Sonra düğme kilitlenir,
    `POST /api/kisilik/gec { tur, id }` → `oturumuDegistir(d)`; hata → düğme açılır,
    `hataGoster` (tarayıcı uyarısı; ör. "Bu okul şu an kapalı; sistem yöneticisi yeni müdürünü atayınca açılır.").
- `EYLEMLER['kisilik-ayril']` — onay: "<Okul> okulundan ayrılmak istiyor musun? Okulun öğretmen listesinden
  çıkarsın; verdiğin ödevler ve notlar okulda kalır. Geri dönmek için okula yeni kişi kodunu vermen gerekir."
  → içinde bulunduğu okuldan ayrılıyorsa (`S.user.id === id`; oturum değişecek) `tekSeferAyrilabilir('oturum')` →
  `POST /api/kisilik/ayril { id, onay: true }`. Cevapta `token` varsa (kişi tam o roldeydi, oturumu satırla kapandı)
  ileti açılışa bırakılır, `kisilikSec = true` ile `oturumuDegistir` → yetişkin hesabının ana sayfası. Yoksa
  `portallariTazele()` → `git('profil')` → yeşil ileti. Hata: düğme eski hâline, uyarı.
- `EYLEMLER['kisilik-cocuk-kaldir']` — onay: "<Çocuk> hesabından kaldırılsın mı? Bilgilerini artık
  göremezsin." → `POST /api/kisilik/cocuk-kaldir { id }` → seçili çocuksa seçim kalkar → `portallariTazele()` →
  `git('profil')` → "<Çocuk> hesabından kaldırıldı."

### "+ Ekle" penceresi

- `EKLE_SECENEK` — üç kutu: `veli` (çizim `cocuk-ekle`, "Çocuğunun veli kodunu gir; ödevini, notunu, servisini gör."),
  `ogretmen` (`kisi-kodu`, "Kişi kodunu okulunun müdürüne ver; seni okula ekler."), `mudur` (`okul-ac`, "Okulunu
  Eğitim Evi'ne açtır.").
- `EKLE_BASLIK` — panellerin başlığı: "Çocuğunu ekle", "Öğretmen olarak katıl", "Okulunu açtır".
- `ekleSecenekleri()` — üç `button.ekle-kutu` (`data-act="ekle-sec"`, `data-tur`).
- `EYLEMLER['kisilik-ekle']` — `modalAc('Ne eklemek istiyorsun?', ekleSecenekleri())`. Üst çubuktaki `#btnEkle`,
  menüdeki "Portal ekle", portal kartlarındaki ve Ayarlar kartındaki "Ekle", panellerin "Geri" düğmesi hep bunu açar.
- `EYLEMLER['ekle-sec']` — `ekleAc(data-tur)`.
- `ekleAc(tur)` — Veli paneli sunucuya sormadan açılır. Öğretmen ve Müdür panelleri kişinin GÜNCEL kodunu ister (kod
  kullanılınca yenilenir): `GET /api/kisilikler` → `kisilikVeri`; Müdürde ayrıca `yoneticiIletisimi()`. Sonra
  `modalAc(EKLE_BASLIK[tur], panel + #ekleMesaj, "Geri" + "Kapat")` ("Geri" `data-act="kisilik-ekle"` ile seçim
  penceresine döner, "Kapat" `data-act="modal-kapat"`). Veli panelinde kod kutusuna odaklanır ve Enter
  "Ekle"ye basar. Hata → `hataGoster`.
- `ekleIcerik` — panel HTML'leri:
  - `veli()` — çizim, "Çocuğunun veli kodunu yaz; ödevini, notunu, servisini görürsün.", `kisiKoduGirdisi('ekVeliKod')`
    (tireler yazarken gelir) + "Ekle" (`ekle-cocuk-kaydet`), ipucu "Kodu okulundan alırsın. Büyük/küçük harfe dikkat
    et; tireler kendiliğinden gelir."
  - `ogretmen(d)` — "Bu kişi kodunu okulunun müdürüne ver. Müdür Öğretmenler > Kodla ekle ekranında kodu girince okulun
    sol üstteki menüde görünür."; `kisiKoduKutusu(d.kisiKodu, 'ekKisiKod', true, "Yeni kod üret")` (kod, "Kopyala");
    "Kod bir kez kullanılır; müdür seni ekleyince yenilenir. Kodu yanlış kişiye verdiysen "Yeni kod üret" ile eskisini
    geçersiz kıl."
  - `mudur(d)` — "Yöneticimize okulunun adını ve bu kodu ver. Okulunu ve adresini (<site>/school/okulun-adi) açıp seni
    müdür yapar; okul sol üstteki menüde görünür."; kod kutusu (Yeni kod üret YOK); altında `yoneticiIletisimHtml`.
- `yoneticiIletisimi()` — sitenin iletişim bilgisi: açılışta yüklenmişse `siteBilgisi.iletisim`
  ([05a-dis-sayfalar.md](05a-dis-sayfalar.md)), değilse `GET /api/site` → `iletisim`; hata → `{}`.
- `yoneticiIletisimHtml(il)` — e-posta da telefon da yoksa "Yöneticimize sayfanın altındaki iletişim bilgilerinden
  ulaşabilirsin."; varsa "Yöneticimize ulaş" + `mailto:` ve `tel:` (yalnız rakam ve `+`) bağlantıları.
- `EYLEMLER['ekle-cocuk-kaydet']` — kutu `kisiKoduDenetle(…, 'Veli kodu')`'ndan geçmezse kutunun altında hata
  ("Veli kodunu yaz.", "Veli kodu 16 karakterdir."). Eklemeden önceki veli portallarını hatırlar →
  `POST /api/kisilik/cocuk { code: kisiKoduSade(kod) }` → pencere kapanır → `portallariTazele()` → yeni veli portalını
  bulur. Kişi yetişkin hesabındaysa o çocuğun portalına geçer (`S.veliCocuk`, `portalDisiYaz(false)`,
  `yilBilgisiYukle`, `git('ana')`) ve sunucunun iletisini gösterir; okul rolündeyse orada kalır, ileti "… Sol üstteki
  menüden veli olarak geçebilirsin." ile biter. Hata (yanlış kod, zaten ekli, çok deneme) kutunun altına yazılır.
- `EYLEMLER['ekle-kod-yenile']` — onay "Yeni kod üretilsin mi? Eski kod artık çalışmaz." → `POST /api/kisilik/kod`
  → kutudaki kod ve "Kopyala"nın verisi yenilenir (`kisiKoduYenile`), `#ekleMesaj`'da "Yeni kod üretildi; eskisi artık
  çalışmaz.".

## Kimle konuşur?

- Çağırdıkları:
  - `S`, `$`, `esc`, `api`, `EYLEMLER` ([00-durum.md](00-durum.md), [01-yardimcilar.md](01-yardimcilar.md)); `ik`
    ([02-ikonlar.md](02-ikonlar.md)); `cizim` ([02b-cizimler.md](02b-cizimler.md): `cocuk-ekle`, `kisi-kodu`, `okul-ac`,
    `ogretmen`, `mudur`, `veli`); `modalAc`, `modalKapat`, `sayfaMesaji`, `mesajGoster` ([03-mesaj-modal.md](03-mesaj-modal.md));
    `alanHatasi`, `alanTemizle` ([04a-form-alanlari.md](04a-form-alanlari.md));
  - [05-giris.md](05-giris.md): `tokenYenile`, `kisiKoduGirdisi`, `kisiKoduKutusu`, `kisiKoduYenile`, `kisiKoduDenetle`,
    `kisiKoduSade`, `dugmeBekle`, `dugmeBitir`; [05a-dis-sayfalar.md](05a-dis-sayfalar.md): `siteBilgisi`;
    [05b-sifre-zorunlu.md](05b-sifre-zorunlu.md): `girisSonrasi`;
  - `navCiz` ([06-menu.md](06-menu.md)); `git`, `yaz`, `hero` ([07-yonlendirme.md](07-yonlendirme.md)); `SAYFALAR`
    ([08-ana-sayfa.md](08-ana-sayfa.md)); `yilBilgisiYukle` (`16-egitim-yili.js`); `hataGoster` (`25-tiklama.js`);
    `oturumDurumunuSifirla` (`26-baslat.js`).
- Sunucu uçları ([../../../sunucu/bolumler/kisilik.md](../../../sunucu/bolumler/kisilik.md); hepsi yetişkin hesabı ister):
  - `GET /api/kisilikler` → `{ roller, cocuklar, hesap, aktif, kisiKodu }` (yan etkisiz; kod ham, tiresiz).
  - `POST /api/kisilik/gec { tur, id }` → giriş cevabıyla aynı (yeni `token`, `user`, `children`, `portallar`, `cocuk`…);
    dakikada 60; başkasının rolü/çocuğu 404, kapalı okul ya da onaysız satır 403.
  - `POST /api/kisilik/ayril { id, onay: true }` — müdürlük bırakılamaz (400); kişi o roldeyse yeni oturum döner.
  - `POST /api/kisilik/cocuk-kaldir { id }`; `POST /api/kisilik/cocuk { code }` (iş `veli.js` `cocukBagla`'da: kod
    büyük/küçük harf duyarlı, dakikada 5 deneme, IP başına saatte 30 yanlış kod); `POST /api/kisilik/kod` (saatte 10).
  - `GET /api/me` ([../../../sunucu/bolumler/kayit.md](../../../sunucu/bolumler/kayit.md)): `portallar`, `hesapAktif`,
    `children`, `kapaliOzellikler`.
  - `GET /api/site` ([../../../sunucu/site.md](../../../sunucu/site.md)) → `iletisim: { eposta, telefon }`.
- Onu kullananlar:
  - [06-menu.md](06-menu.md) — `portalMenusu` (`navCiz`), `portalDisindaMi` (`navTanim`).
  - [08-ana-sayfa.md](08-ana-sayfa.md) — `portalDisindaMi`, `portalAnaSayfasi`.
  - [05-giris.md](05-giris.md) — girişte `portalDurumuAl`; [05b-sifre-zorunlu.md](05b-sifre-zorunlu.md) — `portalDisiYaz`
    (`kisilikSec` gelirse portal dışı açılır).
  - `26-baslat.js` — açılışta `portalDurumuAl`, `portalDisiOku`; telefon bildiriminden (`?k=`) gelen portal geçişinde
    `POST /api/kisilik/gec` + `oturumuDegistir(y, hedef)`; çıkışta `portalDisiYaz(false)`, `kisilikVeri = null`;
    `portalDisindaMi` ile açılış sayfası kısıtı.
  - `23-veli-ayarlar.js` — Ayarlar'da `portalYonetimKarti`; okul rolündeyken "Çocuklarım" sayfasındaki
    "Veli · <çocuk>" düğmeleri `data-act="kisilik-gec"`.
  - `24-bildirim-arama-mobil.js` — yeni bildirim gelince `portallariTazele`; `25-tiklama.js` — "Çocuklarım"
    sayfasındaki çocuk ekle/kaldır (`cocuk-ekle` → `/api/parent/link`, `cocuk-sil` → `/api/parent/unlink`) sonrasında
    `portallariTazele`.
  - `public/index.html` — `#btnEkle` (`data-act="kisilik-ekle"`).
- Görünüm: `public/css/parcalar/28-yetiskin-hesap.css` (`.portal-link`, `.portal-yazi`, `.portal-rol`, `.portal-alt`,
  `.portal-ekle`, `.portal-kartlar`, `.portal-kart` / `.kapali` / `.ekle`, `.portal-kart-*`, `.portal-bos*`,
  `.portal-satir`, `.portal-islem`, `.ekle-secenek`, `.ekle-kutu`, `.ekle-ad`, `.ekle-alt`, `.ekle-panel*`,
  `.ekle-iletisim*`, `.kisi-kodu*`, `.iconbtn.ekle-dugme`), `09-kayit-ekrani.css` (`.rolsuz-satir`: kod kutusu + düğme),
  `29-dis-sayfalar.css` (`.site-iletisim-bag`), `04-kartlar.css` (`.etiket`).
- Android uygulamasında aynı işi yerel ekranlar yapar (`PortalSecici`, `EkleSayfasi`; ayrı depo).

## Nasıl çalışır (adım adım)?

### Girişten portala

```
giriş (05-giris.js) ─► sunucu girisOturumu:
   tek girilebilir okul rolü, çocuk yok → oturum o rol satırında
   rol yok, tek çocuk                  → oturum hesabın kendisinde, cocuk = o çocuk (veli portalı)
   birden çok portal                   → oturum hesabın kendisinde, kisilikSec: true
 ─► portalDurumuAl(d) ─► girisSonrasi(d): kisilikSec → portalDisiYaz(true), açılış 'ana'
 ─► SAYFALAR.ana ─► portalDisindaMi() ─► portalAnaSayfasi() ─► kartlar
kişi "Öğretmen · Test Ortaokulu" kartına basar
 ─► kisilik-gec: tur 'rol' ─► POST /kisilik/gec ─► yeni token (eski kapandı)
 ─► oturumuDegistir: tokenYenile, oturumDurumunuSifirla, S.user = rol satırı ─► girisSonrasi ─► öğretmen ana sayfası
kişi menüden "Veli · Elif" satırına basar (okul rolündeyken)
 ─► POST /kisilik/gec { tur: 'veli' } ─► oturum hesabın kendisinde, cocuk = Elif ─► veli ana sayfası (yalnız Elif)
aynı kişi veli portalındayken "Veli · Can" satırına basar
 ─► sunucuya gitmez: S.veliCocuk = Can, yılBilgisiYukle, git('ana')
```

### Çocuk ekleme

```
+ Ekle ─► "Ne eklemek istiyorsun?" ─► Veli ─► kod yaz, Enter
 ─► kisiKoduDenetle (16 karakter?) ─► POST /kisilik/cocuk { code }
 ─► portallariTazele (/me) ─► yeni "Veli · …" satırı bulundu
      yetişkin hesabındaysa ─► o çocuğun portalı açılır + ileti
      okul rolündeyse      ─► yerinde kalınır, ileti "Sol üstteki menüden veli olarak geçebilirsin."
```

## Dikkat!

- **Okul rolüne geçiş yeni oturumdur.** Eski anahtar sunucuda hemen kapanır; `oturumuDegistir` anahtarı bu sekmenin
  saklama biçimiyle yazar (`tokenYenile`) ve önceki kişiliğin ekran durumunu siler (`oturumDurumunuSifirla`): öğretmenken
  açılan bir şifre listesi müdürlükte görünmesin. Yeni bir ekran durumu eklersen `oturumDurumunuSifirla`'ya da ekle.
- **Veli portalı geçişi yereldir.** Veli portalları arasında sunucuya gidilmez; hangi çocuğun seçili olduğunu yalnız
  tarayıcı bilir. Sunucu her istekte veli yetkisini çocuk kimliğiyle ayrıca denetler; seçim yalnız görünüştür.
- **"okul kapalı" etiketi her girilemez satırda çıkar.** `girilebilir` yanlışsa sebep ne olursa olsun (okulun müdürü
  kaldırılmış ya da rol satırı onaylı değil — eski usul `pending` başvuru) etiket ve `title` "okul kapalı" der. Eski
  usul bekleyen başvurusu olan kişide yanıltıcıdır; basınca sunucu 403 "Bu role şu an girilemez." der (okul kapalıysa
  "Bu okul şu an kapalı; …"), tarayıcı uyarısıyla.
  Planlı "onay bekleme kalıntıları" temizliğiyle `pending` satırlar kalkacak.
- **Kapalı portala basılabilir.** Menüdeki ve ana sayfadaki kapalı satır/kart tıklanabilir durumdadır; sonuç sunucunun
  403 iletisiyle `alert` olur. Ayarlar kartında "Geç" düğmesi girilemeyen satırda hiç çıkmaz.
- **`kisilikVeri` ve `S.hesapAktif` okunmuyor.** İkisi de yazılıyor, sıfırlanıyor ama hiçbir yer değerlerini
  kullanmıyor (eski "Hesap değiştir" sayfasından kalma). Zararsız; "çok gerekli olmayanlar" listesine aday.
- **Hatalar farklı yerlere yazılır.** Portal geçişi, okuldan ayrılma, çocuğu kaldırma ve panelin açılamaması
  tarayıcının `alert` kutusuyla (`hataGoster`); veli kodu hatası kutunun altında (`alanHatasi`); "Yeni kod üret" hatası
  penceredeki `#ekleMesaj`'da görünür.
- **`portallariTazele` hatayı yutar.** `/api/me` düşerse menü eski listeyle kalır; çocuk ekledikten sonra yeni portal
  bulunamazsa kişi yetişkin hesabında olsa da "Sol üstteki menüden veli olarak geçebilirsin." iletisini görür.
- **Kod kutusu ham kod gönderir.** Ekranda ve "Kopyala"da kod 4'erli tirelidir; sunucuya `kisiKoduSade` ile tiresiz,
  boşluksuz gider. Büyük/küçük harf korunur (kod harf duyarlı).
- **Yönetici e-postası pencerede düz `mailto:` bağlantısıdır.** Açılış sayfası ve alt bilgi e-postayı bot toplamasın
  diye HTML'e yazmadan sonradan koyar (`iletisimleriDoldur`); bu pencere girişten sonra açıldığı için adresi doğrudan
  `href`'e yazıyor. Bilinçli bir fark olarak not edildi.
- **`yoneticiIletisimi`'nin yorumu `data/config.yml` der;** iletişim bilgisi bugün yönetim panelindeki site
  ayarlarından da gelir ([../../../sunucu/site.md](../../../sunucu/site.md)). Yorum eskidi, davranış doğru.
- **Müdürlük bırakılamaz.** Ayarlar kartında müdür satırında "Okuldan ayrıl" yoktur; sunucu da 400 verir: okul yeni
  müdürü atanmadan sahipsiz kalmasın.
- **Portal dışı bilgisi sekmeye özeldir.** `ee_portal_disi` `sessionStorage`'da: aynı tarayıcıda bir sekme portal
  dışında, öbürü veli portalında kalabilir. Çıkışta silinir.

## Testleri

- `testler/test-yetiskin.js` — rolsüz yetişkinin kendi hesabına girmesi ve boş portal listesi; öğrenci/yöneticinin portal
  uçlarını kullanamaması; müdürün kodla öğretmen eklemesi ve kodun tek kullanımlık olup yenilenmesi; portallarda
  "Öğretmen · okul"; tek rolde doğrudan o role girilmesi; iki portal varken `kisilikSec`; rol ve veli portalına geçiş,
  eski oturumun kapanması, `hesapAktif`, başkasının rolüne/çocuğuna geçilememesi; yöneticinin okulu kişi koduyla
  açması; müdürlüğün bırakılamaması; öğretmenin okuldan ayrılıp yetişkin hesabına dönmesi ve müdüre bildirim.
- `testler/test-veli-coklu.js` — öğretmenin veli koduyla (tireli yazılmış) çocuğunu bağlaması, girişte seçim ekranı
  (`kisilikSec`: öğretmen rolü + çocuk), veli olarak geçince çocuğunun ilerleyişini ve devamsızlığını görmesi, bağı
  kaldırması.
- `testler/test-kisi-kodu.js` — kodun biçimi (16 karakter, 4'erli tire), `kisiKoduKutusu`'nun "Kopyala"sının tireli
  biçimi vermesi, `kisiKoduDenetle`'nin "16 karakterdir" uyarısı, kod kutusunun yazarken tire koyması (05-giris.js
  kaynağını sunucusuz çalıştırarak), anne ve babanın aynı veli koduyla eklemesi, velinin `/me`'sinde veli portalı ve
  `hesapAktif`, `POST /api/kisilik/kod` ile yenileme.
- `testler/test-yonetim.js` — okul açınca kişinin müdür portalının gelmesi (`kisilikSec`, iki müdür portalı).
- `testler/buton-denetimi.js` — `kisilik-gec`, `kisilik-ayril`, `kisilik-cocuk-kaldir`, `kisilik-ekle`, `ekle-sec`,
  `ekle-cocuk-kaydet`, `ekle-kod-yenile` eylemlerinin karşılığı.
- Elle: yeni bir yetişkin hesabıyla gir → "Henüz bir portalın yok"; "+ Ekle → Öğretmen" → kodu kopyala; müdürle
  "Öğretmenler → Kodla ekle"ye yaz; yetişkinle sayfayı yenile ya da bildirimi bekle → menüde "Öğretmen · okul";
  "+ Ekle → Veli" ile bir öğrencinin veli kodunu gir → iki portal, menüden geçiş.

## Son durum

- `git log`: 5 commit. Son değişiklik `commit 543` (2026-09-30): `kisilik-gec` (yeni oturuma geçerken) ve içinde
  bulunulan okuldan `kisilik-ayril` önce `tekSeferAyrilabilir('oturum')` ile sorar; bir kez gösterilen şifreler portal
  değiştirince uyarısız siliniyordu.
- Dosya `97cbacd commit 340` (2026-09-26) ile doğdu ("Hesap değiştir" rol seçim sayfası);
  `e881271 commit 341` (2026-09-26) rol geçişini (`kisilik-gec`), okuldan ayrılmayı/başvuruyu geri çekmeyi ve
  `cocuklariTazele`'yi ekledi.
- Ondan önce `153d63d commit 522` (2026-09-27, kişi kodu 16 hane): Veli panelindeki ipucu "boşluklar önemli değil"
  → "tireler kendiliğinden gelir" (kod kutusu artık tireleri kendisi koyuyor).
- Ondan önce `0acca75 commit 516` (2026-09-27, kayıt/kişi kodu/portallar) dosyayı baştan yazdı: ayrı "Nasıl devam
  edeceksin?" sayfası (`SAYFALAR.kisilikler`) kalktı; yerine sol menünün başında `portalMenusu`, portal dışı ana sayfa
  (`portalAnaSayfasi`), Ayarlar kartı (`portalYonetimKarti`), `portalDurumuAl`/`portalDisiYaz`/`portalDisindaMi`/
  `portalAktifMi`/`portallariTazele` geldi; "Müdür" seçeneği başvuru formu yerine kişi kodu + yönetici iletişimi oldu;
  "Başvuruyu geri çek" düğmesi kalktı.
- Bilinen açıklar (kod değiştirilmedi): "okul kapalı" etiketinin onaysız satırda da çıkması, okunmayan `kisilikVeri` /
  `S.hesapAktif`, eskimiş yorum (Dikkat).
- Planlı işlerden bu dosyaya dokunacaklar: "Çalışan olarak ekleme" (iş 2: "+ Ekle"deki "Öğretmen" seçeneği "Çalışan"
  olacak — "Kişi kodunu okulunun müdürüne ver; seni okula çalışan olarak ekler."; portal adı "Çalışan · <okul>");
  "Tek kişi tek hesap + portallar öğrencide de" (iş 19: öğrencide de Portallarım, "Öğrenci · Dershane B"); "Paneller"
  (iş 5: birden çok müdür, müdürün başka müdürü onaysız ataması, `pending` kalıntılarının temizliği); "Toplantılar"
  (iş 21: tahta hesabı); "Üst şerit" (iş 29: "+ Ekle" ve Portallarım'ın profil menüsüne/dar ekranda menüye alınması);
  "Çok dil" (iş 22).
