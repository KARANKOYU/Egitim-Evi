# public/js/parcalar/26-baslat.js

Uygulamanın açılış ve kapanış kapısı: sayfa yüklenince kurulumları başlatır, şifre sıfırlama ve e-posta onayı
bağlantılarını yakalar, saklı oturumu `/api/me` ile doğrular, gerekirse aydınlatma metni onayını ister, uygulamayı başlatır
(`uygulamayiBaslat`), çıkışta oturumu kapatıp kişiye bağlı ekran durumunu siler (`cikisYap`, `oturumDurumunuSifirla`).

## Bu dosya ne yapar?

Ön yüzün bütün parçaları tek bir paket hâlinde gelir ([00-durum.md](00-durum.md) "Paketteki yeri"). Parçaların neredeyse
hepsi yalnız tanım yapar: işlevler, `SAYFALAR[...]`, `EYLEMLER[...]`. Bir şeyi **başlatan** kod bu dosyanın sonundadır;
paket tarayıcıda çalışınca sıra buraya gelir ve:

1. Form alanlarını (`formAlanlariKur`), giriş/kayıt ekranını (`authKur`), tıklama yönetimini (`tiklamaKur`) ve telefona
   kurulma düğmesini (`pwaKur`) kurar; tarayıcı konsoluna "Dur!" uyarısını yazar.
2. Adres çubuğunda bir **şifre sıfırlama** (`#/yeni-sifre?t=<64 hane>`) ya da **e-posta onayı** (`#/eposta-onay?t=…`)
   anahtarı var mı bakar. Onay anahtarı varsa hemen sunucuya gönderir ve anahtarı adres çubuğundan siler.
3. Bu sekmede ya da tarayıcıda saklı bir oturum anahtarı varsa `GET /api/me` ile doğrular; geçerliyse kişiyi uygulamaya
   alır, değilse giriş ekranını gösterir.

Girişin kendisi [05-giris.md](05-giris.md)'dedir; giriş ya da portal değişimi sonrasında [05b-sifre-zorunlu.md](05b-sifre-zorunlu.md)
`girisSonrasi` aydınlatma metni onayı (bu dosyadaki `kvkkOnayIste`), şifre belirleme ve en sonunda bu dosyadaki
`uygulamayiBaslat`'ı çağırır. Uygulamanın başlaması: üst şeritte ad ve renkli harf, hesaptaki tema, yıl bilgisi, ilk sayfa,
bildirimler ve bildirim yoklaması.

Çıkış (`cikisYap`) sayfayı yeniden yüklemez: aynı sekmede başka biri girebilir. Bu yüzden çıkışta ve portal değişiminde
"bu kişinin ekranına ait" ne varsa (`oturumDurumunuSifirla`) silinir — bir öncekinin açtığı hesapların şifre listesi,
seçtiği dosya, yoklama dersi, bildirim paneli sonrakine kalmasın.

Herkesin her açılışında çalışır; yönetim adresinde (`/admin/yonetim.js` paketi) de aynı dosya kullanılır.

## İçinde neler var?

### `oturumDurumunuSifirla()`

Kişiye bağlı ekran durumunu siler. Çağıranlar: `cikisYap` (çıkış) ve [08c-kisilikler.md](08c-kisilikler.md)
`oturumuDegistir` (portal değişimi, telefon bildiriminden gelen rol geçişi). Sıfırladıkları:

| Alan | Neyi tutuyordu | Sahibi |
|---|---|---|
| `S.viewStudentId` | bakılan öğrencinin portalı | [10-mudur.md](10-mudur.md), [25-tiklama.md](25-tiklama.md) |
| `S.bildirimSurum`, `S._bildirimler` | bildirim kutusunun sürümü ve listesi | [24-bildirim-arama-mobil.md](24-bildirim-arama-mobil.md) |
| `S.yilBilgi` | eğitim yılı seçici | [16-egitim-yili.md](16-egitim-yili.md) |
| `S.aktarim`, `S.metinDosya` | Excel aktarımının seçili dosyası/sonucu | [15-aktarim.md](15-aktarim.md) |
| `S.yoklamaDers`, `S.yoklamaTarih`, `S.yoklamaDurum` | yoklama ekranı | [18-devamsizlik.md](18-devamsizlik.md) |
| `S.programSinif`, `S.programVeri` | ders programında seçili sınıf | [21-ders-programi.md](21-ders-programi.md) |
| `S.odevF` (kip `ogrenci`), `S.odevHam` | ödev süzgeçleri ve ham liste | [14-odev-filtre.md](14-odev-filtre.md) |
| `S._sinifListe`, `S._ogrListe`, `S._duzenlenen`, `S._sonuclar` | hesap pencereleri, ödev sonuçları | [10b-hesaplar.md](10b-hesaplar.md), [11-ogretmen-odev.md](11-ogretmen-odev.md) |
| `S._acikMesaj`, `S._acikOdev` | açık mesaj / ödev | [19-mesajlar.md](19-mesajlar.md), [11-ogretmen-odev.md](11-ogretmen-odev.md) |
| `ETUT` (baştan kurulur) | etüt listesi ve seçim | [18b-etut.md](18b-etut.md) |
| `ROL.liste` | özel roller | [19f-roller.md](19f-roller.md) |
| `S.servisHaritaCocuk`, `S.servisVeri`, `S.svBinmez` + `servisYoklamaSifirla()` | servis sayfası; servisçinin seçili servisi, haritası, bekleyen işaretleri | [19c-okul-hayati.md](19c-okul-hayati.md), [19i-servis-yoklama.md](19i-servis-yoklama.md) |
| `kisilikVeri` | portallar / kişi kodu paneli | [08c-kisilikler.md](08c-kisilikler.md) |
| `girisListesi`, `TEK_SEFER = {}` | bir kez gösterilen giriş bilgileri listesi ve "kaybolacak şifre" kayıtları | [10a-giris-bilgisi.md](10a-giris-bilgisi.md), [03-mesaj-modal.md](03-mesaj-modal.md) |

Ayrıca `#bildirimPanel` boşalır ve okunmamış rozeti (`#bildirimRozet`) gizlenir. Sıfırlanmayan alanlar "Dikkat!"te.

### `kvkkOnayIste(d)`

Aydınlatma metni yenilenmişse (sunucunun `KVKK_SURUM`'u kişinin onayladığından yeniyse) ya da hesabı okul açmış ve kişi
metni hiç onaylamamışsa uygulama açılmadan bu pencere çıkar; sunucu da bu durumda istekleri 403 `kvkkGerek` ile reddeder
([../../../sunucu/api.md](../../../sunucu/api.md)). Çağıran: `girisSonrasi`, cevapta `kvkkGuncel === false` iken.

- Giriş öncesi sayfa (`#dis`) gizlenir, uygulama (`#app`) kapatılır.
- Başlık: kişinin kayıtlı onayı hiç yoksa (`d.user.kvkkSurum` boş) "Aydınlatma metni" ve "Hoş geldin. Devam etmeden önce
  kişisel verilerinin nasıl işlendiğini anlatan metni okuyup onaylaman gerekiyor."; varsa "Aydınlatma metni güncellendi"
  ve "Kişisel verilerin korunması aydınlatma metni yenilendi (sürüm …). Devam etmek için…" (sürüm `d.kvkkSurum`'dan,
  `esc`'li; bugün sunucudaki `KVKK_SURUM` 1.15).
- "Aydınlatma metnini yeni sekmede aç" (`/kvkk/kvkk.html`), onay kutusu `#kvkkYeniKutu` ("Aydınlatma metnini okudum,
  anladım ve kişisel verilerimin bu kapsamda işlenmesini kabul ediyorum. Kullanım koşullarını kabul ediyorum." —
  koşullar bağlantısı `/kosullar/kosullar.html`), ileti yeri `#kvkkYeniMesaj`.
- Alt düğmeler: "Çıkış yap" (`data-act="cikis"`) ve "Onaylıyorum" (`data-act="kvkk-onayla"`, karşılığı
  [25-tiklama.md](25-tiklama.md)).
- Perdeye `data-zorunlu="1"` konur: dışına basmak pencereyi kapatmaz.

### `uygulamayiBaslat()`

Çağıranlar: `girisSonrasi` ve zorunlu şifre kaydı ([05b-sifre-zorunlu.md](05b-sifre-zorunlu.md)). Sırayla:

1. `#dis` gizlenir, `#app` açılır (`on`); `okulYolunuAyarla()` ([05a-dis-sayfalar.md](05a-dis-sayfalar.md)): okul rolündeki
   kişide (öğrenci, öğretmen, müdür, servisçi) adres `/school/<okul>` + `#/sayfa` olur, okulsuz hesapta `/login`,
   `/signup` gibi site yolları köke (`/` + `#/sayfa`) döner.
2. Üst şeritte ad (`#profilEtiket`, ilk kelime) ve renkli harf (`#profilAvatar`, `avatar(ad, anaHesapId || id)` — yetişkinin
   bütün portallarında aynı renk).
3. **Tema:** hesapta kayıtlı tema `acik` ya da `koyu` ise ve bu tarayıcıdakinden farklıysa hesaptaki uygulanır
   (`window.temaAyarla`, `public/js/tema.js`). Hesapta `sistem` kayıtlıysa tarayıcının seçimi kalır.
4. `S.viewStudentId = null`; il listesi (`S.meta.cities`) boşsa `GET /api/meta` (hata yutulur).
5. **İlk sayfa:** `adrestekiCocuguAl()` (adresteki `?c=<çocuk>`); hedef `S.acilis` (girişten ya da portal değişiminden
   gelen) ya da adresteki sayfa; `S.acilis` silinir. Portal dışındaki yetişkin hesabı (rolsüz ya da portal seçmemiş,
   `portalDisindaMi()`) yalnız `profil` ve `hatirlaticilar`'a gidebilir, başka her hedef `ana` olur; servisçi yalnız `ana`,
   `mesajlar`, `takvim`, `hatirlaticilar`, `profil`.
6. `yilBilgisiYukle()` bitince (şerit ilk çizimde görünsün) `git(hedef)` — hedef `SAYFALAR`'da yoksa `ana`. Sayfa çizilince:
   e-posta onayından kalan bir ileti varsa (`S._acilisMesaji`) sayfanın üstüne yazılır; sonra `epostaOnerisi()`
   ([23-veli-ayarlar.md](23-veli-ayarlar.md): e-postasız yetişkine bir kez "E-posta eklemek ister misin?").
7. Aynı anda: `bildirimleriYenile()`, `bildirimEsitle()` ([04b-bildirim-izni.md](04b-bildirim-izni.md): bu tarayıcıdaki
   telefon bildirimi aboneliği başka bir hesabınsa bırakılır), `siteBilgisiYukle()` (alt bilgideki iletişim bilgileri),
   `bildirimSayaciKur()` (sitenin yoklama aralığıyla, varsayılan 5 dakika).

### `cikisYap(sessiz)`

İki türlü çağrılır:

- **Kişi çıkıyor** (`sessiz` yok) — sol menüdeki "Çıkış Yap", Ayarlar'daki "Çıkış yap", zorunlu şifre ve KVKK
  pencerelerindeki "Çıkış yap" (hepsi `data-act="cikis"`). Önce `tekSeferAyrilabilir('oturum')`: ekranda bir kez
  gösterilen şifreler (giriş bilgileri listesi, aktarım sonucu, hesap penceresindeki yeni şifre) varsa sorulur; vazgeçerse
  hiçbir şey olmaz. Sonra sırayla: servisçinin açık seferi varsa (`S._sefer`) `POST /api/servis/sefer-bitir { seferId }`
  (hata yutulur); `bildirimAboneligiBirak()` (bu cihazın telefon bildirimi aboneliği sunucudan ve tarayıcıdan silinir; en
  çok 3 saniye beklenir); `POST /api/logout`; ardından yerel temizlik (`bitir`). Sunucu isteklerinden biri başarısız
  olsa da yerel temizlik yapılır.
- **Sessiz** (`sessiz = true`) — sunucuya hiçbir şey gönderilmeden doğrudan yerel temizlik. Çağıranlar: `api()` 401
  aldığında ([01-yardimcilar.md](01-yardimcilar.md): oturum düşmüş), açılışta `/api/me` başarısız olduğunda ya da hesap
  onaylı değilse (bu dosya), hesap silindikten sonra ([23-veli-ayarlar.md](23-veli-ayarlar.md); o kendi
  `bildirimAboneligiBirak`'ını önce çağırır).

Yerel temizlik (`bitir`):

1. `S.token`, `S.user`, `S.children`, `S.veliCocuk`, `S.kapali`, `S.portallar`, `S.hesapAktif` sıfırlanır,
   `portalDisiYaz(false)`; `oturumDurumunuSifirla()`; `S._epostaSoruldu = false` (sonraki hesaba da e-posta önerilsin).
2. Açık pencere kapanır (KVKK onay penceresinden çıkılıyorsa o da); `tokenSil(eskiAnahtar)` ([05-giris.md](05-giris.md):
   bu sekmenin anahtarı silinir; "Beni hatırla" ile saklanan anahtar yalnız bu hesabınsa silinir, başka sekmede
   hatırlanan başka hesap kalır); `seferiDurdur()` ([19e-servis-konum.md](19e-servis-konum.md): servisçinin konum
   gönderimi ve ekran kilidi biter).
3. `#app` kapanır, `#sayfa` boşalır, bildirim yoklaması (`S._bildirimSayac`) durur.
4. **Yönetim adresindeysek** (`YONETIM` dolu): `location.replace('/login')` — yönetim paketi sayfada kalmasın, giriş
   sayfası herkese giden paketle baştan açılsın. Burada biter.
5. Değilse: sessiz değilse giriş kartındaki ileti (`#authMesaj`) silinir; adres şifre sıfırlama adresi değilse
   `history.replaceState` ile okul adresinden girildiyse o okulun yoluna (`/school/<okul>`), değilse `/login`'e çevrilir
   (sonraki kişi öncekinin açık bıraktığı sayfaya düşmesin); `okulAdresiniYenile()` → `girisEkraniGoster()`
   ([05a-dis-sayfalar.md](05a-dis-sayfalar.md)).

### Açılış kodu (dosyanın üst düzeyi, paket yüklenince bir kez)

1. `formAlanlariKur()` ([04a-form-alanlari.md](04a-form-alanlari.md)), `authKur()` ([05-giris.md](05-giris.md)),
   `tiklamaKur()` ([25-tiklama.md](25-tiklama.md)), `konsolUyarisi()`, `pwaKur()` ([04-pwa.md](04-pwa.md); kurulum
   girişten bağımsız, giriş ekranında da çalışır).
2. `sifirlamaAnahtari` — adresin `#` kısmında `t=` + 64 onaltılık hane VE `yeni-sifre` geçiyorsa anahtar, değilse `''`.
   Anahtar `#` kısmında olduğu için sunucuya istek olarak hiç gitmez.
3. `onayAnahtari` — aynı kalıp, `eposta-onay` geçiyorsa. `onaySonucu`: anahtar varsa hemen `POST /api/eposta-onay
   { token }` → başarıda `{ tur: 'iyi', d }`, hatada `{ tur: 'hata', d: { message, alan } }` (alan `kullaniciAdi`, `tc`
   ya da `email` olabilir); yoksa `null`. Anahtar varsa adres çubuğu `location.pathname`'e indirilir (anahtar görünmesin,
   geçmişte kalmasın).
4. `kayitli` — sıfırlama bağlantısıyla gelindiyse `null`; değilse önce yönetim adresine tam sayfa geçişte bırakılan
   anahtar (`gecisAnahtari()`, [05b-sifre-zorunlu.md](05b-sifre-zorunlu.md): bir kez okunur, silinir), o yoksa saklı
   anahtar (`tokenOku()`: önce sekmeninki, sonra hatırlanan).
5. `disSayfalariKur()` ([05a-dis-sayfalar.md](05a-dis-sayfalar.md)) bitince `onaySonucu` beklenir, sonra:
   - **Onay sonucu**: oturum varsa ileti uygulama açılınca gösterilmek üzere `S._acilisMesaji`'na; oturum yoksa ve
     hata kullanıcı adı ya da T.C. çakışmasıysa (`alan` `kullaniciAdi`/`tc`; hesap açılırken bu bilgi bu arada başkasına
     geçmiş) ileti kayıt kartında ilgili kutunun altına gidecek (`kayitAlanHatasi`); başka her sonuçta giriş kartının
     üstüne (`#authMesaj`). Başarılı kayıt onayında giriş kutusu "kullanıcı adı" kipine alınır ve yeni kullanıcı adı
     yazılır (`girisKimlikAyarla('kadi', false)`, `#gEmail`).
   - **Sıfırlama bağlantısı**: hatırlanan anahtar (`localStorage` `ee_token`) silinir, `S.genelGiris = true`, giriş
     ekranı ve hemen ardından "Yeni şifre" ekranı (`yeniSifreEkraniAcDisaridan(anahtar)`, köprüsü
     [25-tiklama.md](25-tiklama.md)'de tanımlı, [05-giris.md](05-giris.md) doldurur).
   - **Anahtar yoksa**: giriş ekranı (ve varsa kayıt kartındaki alan hatası).
   - **Anahtar varsa**: `S.token = kayitli` → `GET /api/me`:
     - hesap onaylı değilse (`status !== 'approved'`) sessiz çıkış;
     - `S.user`, `S.children`, `S.kapali` (okulun kapattığı bölümler), `portalDurumuAl(d)`; `S.portalDisi =
       portalDisiOku()` (sayfa yenilendi: bu sekmede portal dışındaydıysa orada kalır, [08c-kisilikler.md](08c-kisilikler.md));
     - adreste `?k=<kimlik>` varsa (telefon bildiriminden gelindi; bağlantıyı `sunucu/push.js` kurar) önce adres
       çubuğundan `?k=` silinir; kimlik kişinin kendisi değilse ve kişi yetişkin hesabı ya da okul rolündeyse
       `POST /api/kisilik/gec { tur: 'rol', id: k }` ile bildirimin geldiği role geçilir ve adresteki sayfa korunarak
       `oturumuDegistir` ([08c-kisilikler.md](08c-kisilikler.md)); geçiş başarısız olursa bulunulan rolde devam;
     - sonra `girisSonrasi(d)`;
     - `/api/me` herhangi bir nedenle başarısız olursa sessiz çıkış ("Dikkat!"). 401'de `cikisYap(true)` iki kez çalışır:
       önce `api()`'nin kendisi ([01-yardimcilar.md](01-yardimcilar.md)), sonra bu `catch`. İkincisinde `S.token` zaten boş
       olduğu için `tokenSil(null)` hatırlanan anahtara dokunmaz; giriş ekranı iki kez çizilir, görünür bir zararı yok.

### `konsolUyarisi()`

Tarayıcının geliştirici konsoluna büyük kırmızı "Dur!" ve altına: "Bu pencere geliştiriciler içindir. Biri sana buraya bir
şey yapıştırmanı söylediyse bu bir dolandırıcılıktır: hesabına ve okulundaki bilgilere erişmeye çalışıyordur.
Yapıştırma, pencereyi kapat." Konsol yoksa sessizce geçer. Amaç "şunu konsola yapıştır" diye kandırılan öğrenciyi/veliyi
uyarmak.

## Kimle konuşur?

- Paketteki yeri: parçalar ad sırasıyla tek bir IIFE'de birleşir ([../../../sunucu/http.md](../../../sunucu/http.md)
  `birlesikOku`). Bu dosyadan SONRA yalnız [27-veli-panel.md](27-veli-panel.md), [27b-aile.md](27b-aile.md) ve
  [28-grafik.md](28-grafik.md) gelir; açılış kodu çalıştığında onların üst düzey satırları (ör. `SAYFALAR.aile`,
  `var AILE = …`, `S.sg = …`) henüz çalışmamıştır ("Dikkat!").
- Çağırdıkları:
  - [00-durum.md](00-durum.md) — `S`, `YONETIM`; [01-yardimcilar.md](01-yardimcilar.md) — `$`, `esc`, `api`;
    [02-ikonlar.md](02-ikonlar.md) — `avatar`; [03-mesaj-modal.md](03-mesaj-modal.md) — `modalAc`, `modalKapat`,
    `mesajGoster`, `sayfaMesaji`, `tekSeferAyrilabilir`, `TEK_SEFER`.
  - [04-pwa.md](04-pwa.md) — `pwaKur`; [04a-form-alanlari.md](04a-form-alanlari.md) — `formAlanlariKur`;
    [04b-bildirim-izni.md](04b-bildirim-izni.md) — `bildirimEsitle`, `bildirimAboneligiBirak`.
  - [05-giris.md](05-giris.md) — `authKur`, `tokenOku`, `tokenSil`, `girisKimlikAyarla`, `kayitAlanHatasi`;
    [05a-dis-sayfalar.md](05a-dis-sayfalar.md) — `disSayfalariKur`, `girisEkraniGoster`, `okulYolunuAyarla`,
    `okulAdresiniYenile`, `adrestenOkul`, `siteBilgisiYukle`; [05b-sifre-zorunlu.md](05b-sifre-zorunlu.md) —
    `girisSonrasi`, `gecisAnahtari`.
  - [07-yonlendirme.md](07-yonlendirme.md) — `git`, `adrestenSayfa`, `adrestekiCocuguAl`; [08c-kisilikler.md](08c-kisilikler.md)
    — `portalDisindaMi`, `portalDisiYaz`, `portalDisiOku`, `portalDurumuAl`, `oturumuDegistir`, `kisilikVeri`.
  - [10a-giris-bilgisi.md](10a-giris-bilgisi.md) — `girisListesi`; [16-egitim-yili.md](16-egitim-yili.md) —
    `yilBilgisiYukle`; [18b-etut.md](18b-etut.md) — `ETUT`; [19e-servis-konum.md](19e-servis-konum.md) — `seferiDurdur`,
    `S._sefer`; [19f-roller.md](19f-roller.md) — `ROL`; [19i-servis-yoklama.md](19i-servis-yoklama.md) —
    `servisYoklamaSifirla`; [23-veli-ayarlar.md](23-veli-ayarlar.md) — `epostaOnerisi`;
    [24-bildirim-arama-mobil.md](24-bildirim-arama-mobil.md) — `bildirimleriYenile`, `bildirimSayaciKur`;
    [25-tiklama.md](25-tiklama.md) — `tiklamaKur`, `yeniSifreEkraniAcDisaridan`.
  - `window.temaAyarla`, `window.temaOku` — `public/js/tema.js`.
- Sunucu uçları:
  - `GET /api/me`, `GET /api/meta`, `POST /api/logout`, `POST /api/eposta-onay`
    ([../../../sunucu/bolumler/kayit.md](../../../sunucu/bolumler/kayit.md));
  - `POST /api/kisilik/gec` ([../../../sunucu/bolumler/kisilik.md](../../../sunucu/bolumler/kisilik.md));
  - `POST /api/servis/sefer-bitir` ([../../../sunucu/bolumler/okul-hayati.md](../../../sunucu/bolumler/okul-hayati.md));
  - dolaylı: `POST /api/push/iptal` (`bildirimAboneligiBirak`, [../../../sunucu/bolumler/push.md](../../../sunucu/bolumler/push.md)),
    `GET /api/egitim-yili` (`yilBilgisiYukle`), `GET /api/notifications` (`bildirimleriYenile`), `GET /api/site`,
    `GET /api/okul-adres`, `GET /api/hesap` (`epostaOnerisi`).
- Onu kullananlar:
  - `cikisYap` — `data-act="cikis"` ([25-tiklama.md](25-tiklama.md)); `api()` 401'de
    ([01-yardimcilar.md](01-yardimcilar.md)); [23-veli-ayarlar.md](23-veli-ayarlar.md) hesap silindikten sonra.
  - `uygulamayiBaslat`, `kvkkOnayIste` — [05b-sifre-zorunlu.md](05b-sifre-zorunlu.md).
  - `oturumDurumunuSifirla` — [08c-kisilikler.md](08c-kisilikler.md) `oturumuDegistir`.
  - `konsolUyarisi` yalnız burada.
- Sayfa iskeleti (`public/index.html`): `#dis`, `#app`, `#sayfa`, `#authMesaj`, `#gEmail`, `#profilEtiket`,
  `#profilAvatar`, `#bildirimPanel`, `#bildirimRozet`.
- CSS: KVKK penceresindeki onay satırı `.onay-satiri` (`27-harita-ortak.css`, `30-dokunmatik.css`); perde ve pencere
  `06-modal.css`; uygulama kabuğu `.app` / `.app.on` (`03-iskelet.css`); giriş öncesi sayfa `29-dis-sayfalar.css`.

## Nasıl çalışır (adım adım)?

### Sayfa açılışı

```
paket çalışır (00 … 25 tanımlar) ─► 26: formAlanlariKur, authKur, tiklamaKur, konsolUyarisi, pwaKur
   adres: #/eposta-onay?t=…  ─► POST /api/eposta-onay (arka planda), adres çubuğu temizlenir
   adres: #/yeni-sifre?t=…   ─► kayitli = null
   kayitli = gecisAnahtari() || tokenOku()
   (27, 27b, 28'in tanımları da çalışır; paket biter)
disSayfalariKur() ─► onaySonucu ─►
   sıfırlama? ─► giriş ekranı + "Yeni şifre" ekranı
   anahtar yok? ─► giriş ekranı (+ onay iletisi)
   anahtar var ─► GET /api/me ─► onaylı değil / hata ─► cikisYap(true) ─► giriş ekranı
                              └► ?k= başka rol? ─► POST /api/kisilik/gec ─► oturumuDegistir ─► girisSonrasi
                              └► girisSonrasi(d)
                                    kvkkGuncel false ─► kvkkOnayIste (zorunlu pencere)
                                    sifreDegismeli   ─► "Kendi şifreni belirle" (05b)
                                    değilse          ─► uygulamayiBaslat
```

### Uygulamanın başlaması

```
uygulamayiBaslat ─► #app açık, adres okul yoluna, ad + renkli harf, hesabın teması
   hedef = S.acilis || #/sayfa  (portal dışı yetişkin / servisçi süzgeci)
   yilBilgisiYukle() ─► git(hedef) ─► açılış iletisi ─► e-posta önerisi
   bildirimleriYenile · bildirimEsitle · siteBilgisiYukle · bildirimSayaciKur
```

### Çıkış

```
"Çıkış Yap" ─► cikisYap()
   TEK_SEFER: kaybolacak şifre var mı? ─► vazgeç ─► dur
   açık sefer? ─► POST /api/servis/sefer-bitir
   bildirimAboneligiBirak() (≤3 sn) ─► POST /api/logout ─► bitir (hata olsa da)
bitir ─► S temizlenir, oturumDurumunuSifirla, pencere kapanır, tokenSil, seferiDurdur, #app kapanır
   yönetim adresi? ─► location.replace('/login')
   değilse ─► adres /school/<okul> ya da /login ─► okulAdresiniYenile ─► girisEkraniGoster
```

## Dikkat!

- **Açılışta `/api/me` başarısız olursa oturum yerelde silinir** (kod okumasına göre; denenmedi). `api('/me')`'nin
  `catch`'i hangi hata olursa olsun `cikisYap(true)` der; bu da `tokenSil` ile sekmenin ve "Beni hatırla"nın anahtarını
  siler. Yani yalnız geçersiz oturumda değil, internet yokken (servis çalışanı uygulama kabuğunu önbellekten açar ama
  `/api` her zaman ağdan gider, `public/sw.js`), sunucu 500/503 verirken (veritabanı kısa süre ulaşılamaz) ya da
  `girisSonrasi` içinde bir hata atılırsa da kişi çıkarılır ve yeniden (gerekirse e-posta koduyla) girmesi gerekir.
  Sunucudaki oturum ise yaşamaya devam eder. Planlı "bakım modu" (API 503 `{ bakim: true }`) gelince bu kapı ayrıca ele
  alınmalı; yoksa bakım sırasında sayfayı yenileyen herkes oturumunu kaybeder. Düzeltme önerisi: yalnız 401'de (ve
  `status !== 'approved'`'da) çıkmak, ağ ve 5xx hatasında "Bağlanılamadı, yeniden dene" göstermek.
- **Onaylı olmayan hesap sessizce çıkarılır.** `/api/me` `status !== 'approved'` derse kişiye bir ileti gösterilmeden
  giriş ekranı açılır.
- **Sessiz çıkış sunucuya bir şey söylemez.** 401, onaysız hesap ve açılış hatasında `/api/logout`,
  `/api/servis/sefer-bitir` ve `bildirimAboneligiBirak` çağrılmaz: bu cihazın telefon bildirimi aboneliği sunucuda kalır
  ve bildirimler gelmeye devam edebilir; sonraki açılışta başka bir hesap girerse `bildirimEsitle` onu yalnız tarayıcıda
  bırakır. Servisçinin seferi sunucuda açık kalır (konum gönderimi `seferiDurdur` ile tarayıcıda durur).
- **Çıkış düğmesi beklemeye alınmaz.** Sefer kapatma, abonelik bırakma (en çok 3 sn) ve `/api/logout` sırayla beklenir;
  yavaş bağlantıda düğme birkaç saniye "bir şey yapmıyor" görünür, ikinci basış ikinci bir çıkış dizisi başlatır (yerel
  temizlik iki kez çalışır, zararsız). Sıra bilinçli: anahtar `/api/logout`'tan sonra geçersiz olacağı için öteki iki
  istek önce gider.
- **`/api/logout` başarısız olsa da yerelde çıkılır.** Ağ yokken çıkan kişinin oturumu sunucuda süresi dolana kadar
  geçerli kalır (anahtar tarayıcıdan silindiği için pratikte kullanılamaz).
- **Sıfırlanmayan kişiye bağlı alanlar.** `oturumDurumunuSifirla` bugün şunlara dokunmuyor: `S.sg` (son bakılan
  öğrencilerin sınav grafiği verisi, [28-grafik.md](28-grafik.md)), `S.veliOdevHam` ([27-veli-panel.md](27-veli-panel.md)),
  `AILE.veri` (çocuğun konum ve ekran süresi özeti, [27b-aile.md](27b-aile.md)), `S.dersOdevleri`/`S.dersListesi`
  ([11-ogretmen-odev.md](11-ogretmen-odev.md)), `S.mesajAyarGecici` ([19-mesajlar.md](19-mesajlar.md)), takvimin ay
  önbelleği `TS.veri` ([04e-tarih-secici.md](04e-tarih-secici.md)), quiz durumu `QZ` ([14c-quiz.md](14c-quiz.md)),
  `S.odevSinif`, `S.sinifBilgi`/`S.dersBilgi` ([00-durum.md](00-durum.md) listesi), `S._hatirlaticilar`
  ([19h-hatirlaticilar.md](19h-hatirlaticilar.md)), `S.py` ([22-programim.md](22-programim.md)). Çoğu, sayfa açılınca
  sunucudan yeniden doldurulduğu için ekranda görünmez; ama aynı sekmede giren sonraki kişinin belleğinde öncekinin
  verisi durur, bazıları ekrana sızar (takvim noktaları, quiz "Kaydedildi" yazıları — oralarda anlatıldı). Seçim ve
  süzgeç durumları da kalır: `S.islemSuz`, `S.mesajKutu`/`S.mesajTur`, `S.takvimAy`/`S.takvimYil`/`S.takvimSecili`,
  `S.acikDersler`/`S.dersHepsiAcik`, `S.dvTarih`, `S.page` ve `S._acilisMesaji` (aşağıda). Kişiye bağlı yeni bir alan
  eklersen buraya da ekle.
- **E-posta onayının sonucu eski bir oturum anahtarıyla kaybolabilir** (kod okumasına göre; denenmedi). Onay
  bağlantısı, tarayıcıda süresi dolmuş ya da geçersiz bir anahtar saklıyken açılırsa `kayitli` dolu olduğu için sonuç
  giriş kartına yazılmaz, `S._acilisMesaji`'na konur; ardından `/api/me` 401 alır ve kişi giriş ekranına düşer, "hesabın
  açıldı" iletisini görmez. Aynı nedenle kullanıcı adı / T.C. çakışması da kayıt kartının kutusuna (`kayitAlanHatasi`)
  gitmez. `S._acilisMesaji` çıkışta silinmediği için ileti, o sekmede bir sonraki girişte (başka bir hesap girse bile)
  sayfanın üstünde çıkar. Düzeltme önerisi: `/api/me` başarısız olunca `S._acilisMesaji`'nı giriş kartına taşımak ve
  `oturumDurumunuSifirla`'da silmek.
- **Açılış kodu, sonra birleşen üç parçadan önce çalışır.** `27-veli-panel.js`, `27b-aile.js`, `28-grafik.js`'teki
  `SAYFALAR[...]`, `EYLEMLER[...]`, `var AILE = {…}`, `S.sg = …` satırları bu dosyanın üst düzey kodu bittikten sonra
  çalışır. Bugün sorun yok çünkü ilk `git()` hep bir sözün içinde (önce `disSayfalariKur`, sonra `/api/me`). Açılış koduna
  eşzamanlı bir `git()` eklersen `git` içindeki `aileHaritaKapat()` tanımsız `AILE` yüzünden hata atar ve o sayfalar
  bulunamaz.
- **Hesaptaki tema yalnız `acik`/`koyu` ise kazanır.** Yorum "hesaptaki kazanır" der; hesapta `sistem` kayıtlıyken bu
  tarayıcıda koyu seçilmişse koyu kalır.
- **`?k=` geçişi yalnız yetişkin hesabında ve okul rolünde.** Sunucu her bildirim bağlantısına alıcının kimliğini `?k=`
  ile ekler; öğrenci ve servisçide bu kendi kimlikleri olduğu (ve koşul da yetişkin/okul rolü istediği) için geçiş
  denenmez, yalnız adres temizlenir.
- **Sıfırlama bağlantısı hatırlanan oturumu unutturur.** Bağlantı açılınca `localStorage` `ee_token` kimin olursa olsun
  silinir (aynı bilgisayarda "Beni hatırla" ile açık kalan başka bir hesap da). Bu yolda `gecisAnahtari()` hiç çağrılmaz;
  sekmede yönetim geçişinden kalmış bir anahtar (çok nadir) bir sonraki açılışa kalır.
- **E-posta onayı, oturum açıkken de gönderilir.** Onay bağlantısı oturumu açık bir tarayıcıda tıklanırsa (e-posta
  değişikliği için olağan) sonuç uygulama açıldıktan sonra sayfanın üstünde gösterilir.
- **Yönetim adresinden çıkış tam sayfa geçiştir.** `location.replace('/login')` geçmişe kayıt bırakmaz; geri tuşu
  yönetim adresine dönmez.
- Üst düzey `var` adları (`sifirlamaAnahtari`, `onayAnahtari`, `onaySonucu`, `kayitli`) bütün paketin ortak alanındadır;
  başka parçada aynı adla değişken açma.

## Testleri

- Ön yüzün açılış/çıkış akışını tarayıcıda deneyen otomatik test YOK; aşağıdakiler kullandığı uçları ve yan yolları korur.
- `testler/buton-denetimi.js` (sunucusuz) — `kvkk-onayla` ve `cikis` düğmelerinin karşılığı var mı.
- `testler/test-yonetim.js` — onayı güncel olmayan hesap girebiliyor ama istekleri 403 `kvkkGerek`, `/api/me` açık,
  `POST /api/kvkk-onay` sahte değeri reddediyor, `{ onay: true }`'yu kaydediyor.
- `testler/test-giris-kayit.js` — `POST /api/eposta-onay`: uydurma anahtar ve ikinci tıklama reddediliyor;
  `testler/test-cakisma.js` — hesap açılırken kullanıcı adı / T.C. bu arada alındıysa `alan` ile söylenmesi (bu dosyanın
  `kayitAlanHatasi` yolu).
- `testler/test-admin-gizli.js` — yönetici ve yönetici olmayan için `/api/logout`, yöneticinin çıkışında yönetim çerezinin
  silinmesi; herkese giden paket yerine yönetim adresinde `/admin/yonetim.js` (bu dosyanın `YONETIM` dalı orada çalışır).
- `testler/test-yetiskin.js` — `POST /api/kisilik/gec` (rol, veli, bozuk kimlik); `testler/test-servis-yoklama.js` —
  bildirim bağlantısının `?k=<rol>` taşıması; `testler/test-servis-konum.js` — `sefer-bitir`, telefon bildirimi
  aboneliğinin `/api/push/durum` ile "bu cihaz benim mi" sorusu.
- `testler/test-kucult.js` (sunucusuz) — paketin yorumsuz hâliyle derlenmesi.
- Elle: (1) "Beni hatırla" ile gir, sekmeyi kapat-aç → doğrudan uygulama; (2) giriş bilgileri listesi açıkken "Çıkış Yap"
  → soru; "İptal" → hiçbir şey olmaz; (3) çık, aynı sekmede başka hesapla gir → bildirim paneli boş, yoklama/aktarım
  ekranları sıfır; (4) tarayıcı konsolunu aç → "Dur!" uyarısı; (5) sunucunun `KVKK_SURUM`'u artırılmış bir deneme
  kurulumunda gir → "Aydınlatma metni güncellendi" penceresi, dışına basınca kapanmamalı.

## Son durum

- `git log`: 9 commit; ilk dördü dosyanın depoya parça parça girişidir. `5ed0db3 commit 16` (2026-08-28):
  `oturumDurumunuSifirla`, `kvkkOnayIste`, `cikisYap`, açılıştaki kurulum çağrıları ve `konsolUyarisi`. `2b2105a commit 144`
  (2026-09-08): `uygulamayiBaslat` eklendi (okul yolu, tema, yıl bilgisi, servisçinin sayfaları; o gün rolsüz hesap
  süzgeci `!S.user.role`'du). `e881271 commit 341` (2026-09-26): açılışın alt yarısı — `kayitli` → `disSayfalariKur` →
  onay sonucunun gösterilmesi, sıfırlama bağlantısı dalı, `/api/me` ve `?k=` rol geçişi. `3f22fbe commit 382`
  (2026-09-26): `sifirlamaAnahtari`, `onayAnahtari`, `onaySonucu` tanımları (bağlantılardaki anahtarın okunması ve
  `POST /api/eposta-onay`).
- `0acca75 commit 516` (2026-09-27, portallar): rolsüz hesabın açılış süzgeci "portal dışındaki yetişkin hesabı" oldu
  (`portalDisindaMi`, yalnız `profil` ve `hatirlaticilar`); çıkışta `S.portallar`, `S.hesapAktif`, `portalDisiYaz(false)`;
  açılışta `portalDurumuAl` ve `portalDisiOku`. `b6bfc03 commit 517` (2026-09-27, sayfa klasörleri): KVKK penceresindeki
  bağlantılar `/kvkk/kvkk.html` ve `/kosullar/kosullar.html` oldu.
- `24050a2 commit 518` (2026-09-27, servis yoklaması): `oturumDurumunuSifirla` servis alanlarını (`servisHaritaCocuk`,
  `servisVeri`, `svBinmez`) ve `servisYoklamaSifirla()`'yı sıfırlıyor; servisçinin açılışta gidebileceği sayfalara
  `hatirlaticilar` eklendi.
- `276c0a0 commit 521` (2026-09-27, gizli /admin): sabit 30 saniyelik bildirim sayacı yerine `bildirimSayaciKur()`
  (sitenin ayarı); yönetim adresinden çıkışta `location.replace('/login')`; e-posta onayı hatasında `alan` taşınıyor ve
  kullanıcı adı/T.C. çakışması kayıt kartında gösteriliyor; açılışta önce `gecisAnahtari()`.
- Son değişiklik `7fda2ee commit 543` (2026-09-30): çıkışta önce `tekSeferAyrilabilir('oturum')` sorusu;
  `oturumDurumunuSifirla` `girisListesi` ve `TEK_SEFER`'i de siliyor. O günden beri değişmedi.
- Bilinen açıklar (kod değiştirilmedi): açılışta her `/api/me` hatasında oturumun silinmesi, onaysız hesabın iletisiz
  çıkarılması, sessiz çıkışta abonelik ve seferin sunucuda kalması, sıfırlanmayan alanlar, eski anahtarla açılan e-posta
  onayı bağlantısında sonucun giriş ekranında görünmemesi.
- Planlı işlerden bu dosyaya dokunması beklenenler (DEVAM.md 4. bölüm):
  - "Sistem" (iş 4): bakım modu (API 503 `{ bakim: true }` — yukarıdaki açılış kapısı), yeni cihaz uyarısı ve açık
    oturumlar, tarayıcı hata günlüğü (`window.onerror` ve `unhandledrejection` dinleyicisi büyük olasılıkla açılış koduna
    girecek), site duyurusu.
  - "Üst şerit sadeleştirme" (iş 29): çıkıştan sonra geri/ileri tuşu (oturum kimliği, `pageshow` → `/api/me`), atlanamayan
    ekranlarda (KVKK onayı, zorunlu şifre) sol üstte "← Çıkış yap", çıkış düğmesinin simgesi.
  - "Tek kişi tek hesap + portallar öğrencide de" (iş 19): öğrencinin de portalları olunca `?k=` geçişinin koşulu
    (yalnız yetişkin/okul rolü) ve açılış süzgeci değişecek.
  - "KVKK ve onay metinleri tam denetimi" (iş 18) ve KVKK kuralı: kişisel veri işleyen her yeni özellik `KVKK_SURUM`'u
    artırır; herkes bu dosyadaki pencereyle yeniden onaylar.
  - "Çok dil" (iş 22): pencere ve konsol metinleri dil kataloğuna.
