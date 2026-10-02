# public/js/parcalar/23-veli-ayarlar.js

Velinin "Çocuklarım" sayfası (veli koduyla çocuk ekleme, çocuk kartları) ve herkesin "Ayarlar" sayfası (hesap
bilgileri, giriş bilgileri, kişisel bilgiler, telefon bildirimleri, görünüm, şifre, açılış sayfasına yorum, hesabı
silme) ile girişten sonra bir kez gelen "E-posta eklemek ister misin?" önerisi.

## Bu dosya ne yapar?

İki ayrı ama komşu iş:

1. **Çocuklarım** (`cocuklarim`) — velinin çocuklarını eklediği ve açtığı yer. Veli, okulun verdiği 16 karakterlik
   **veli kodunu** yazar; kod doğruysa çocuk hesabına bağlanır. Her çocuk bir kart olur; karta basınca o çocuğun portalı
   (ilerleyişi, ödevleri, programı…) açılır, "Kaldır" bağı çözer. Menüde velinin en altındaki **Çocuklarım**, ana
   sayfasındaki "Çocuklarım" kutucuğu ve çocuğu bağlı (eski düzendeki) öğretmen/müdürün "Velisi olduğum" bölümü buraya
   gelir. Okul rolündeki bir yetişkin (öğretmen@okul) bu sayfayı açarsa çocuk listesi yerine "veli olarak geç"
   düğmeleri görür: çocuklar yetişkin hesabındadır, velilik ayrı bir portaldır.
2. **Ayarlar** (`profil`) — herkesin hesabı. Sağ üstteki "Ayarlar" (`#btnAyarlar`) ve profil (avatar, `#btnProfil`)
   düğmeleri, sol menünün altındaki "Ayarlar" ve ana sayfa kutucukları buraya gelir. Ekranda hangi kartların görüneceği hesabın türüne bağlıdır:
   - **Yetişkin hesabı** (veli, rolsüz yetişkin) ya da ona bağlı **okul rolü** (öğretmen@okul, müdür@okul): kişisel
     bilgiler, giriş bilgileri ve şifre YETİŞKİN HESABININDIR, bütün rollerde aynıdır. Bu yüzden sayfa önce
     `GET /api/hesap` ile yetişkin hesabının bilgilerini ister; portallar, giriş bilgileri (kullanıcı adı, e-posta,
     telefon), açılış sayfasına yorum ve "Hesabımı sil" yalnız bu hesaplarda vardır.
   - **Okulun açtığı hesap** (öğrenci, servisçi) ve eski düzendeki öğretmen/müdür hesabı: bilgiler oturumdaki
     kişidendir; T.C. kimlik no'yu okul yönetir (salt okunur); öğrencide veli kodu görünür ve doğum tarihi zorunludur.
   - **Sistem yöneticisi** de aynı sayfayı kullanır (yönetim menüsündeki "Ayarlar").

Ayrıca `epostaOnerisi()` girişten sonra bir kez çalışır: e-postası olmayan yetişkin hesabına "E-posta eklemek ister
misin?" penceresini açar (iki adımlı giriş kodu ve şifre sıfırlama e-postaya gider).

Kaydetme düğmelerinin bir kısmı (`profil-kaydet`, `sifre-kaydet`, `tema-sec`, `cocuk-ekle`, `cocuk-ac`, `cocuk-sil`,
`cikis`) `25-tiklama.js`'tedir; yorum, giriş bilgileri, hesap silme ve e-posta önerisi düğmeleri bu dosyanın
`EYLEMLER`'indedir. İkisini de aşağıda anlattım.

## İçinde neler var?

### Çocuklarım

- `SAYFALAR.cocuklarim`:
  - **Okul rolündeyken** (`S.user.rolSatiri`): sunucuya sormaz. Başlık "ÇOCUKLARIM" ve bilgi kutusu "Şu an Öğretmen
    olarak girdin. Çocuğunun ödevlerini, devamsızlığını ve notlarını görmek için sol üstteki menüden veli olarak geç.";
    `S.portallar`'daki her veli portalı için bir düğme "Veli · Zeynep Şahin" (`data-act="kisilik-gec"`,
    `data-tur="veli"`, `data-id` = çocuk; [08c-kisilikler.md](08c-kisilikler.md)).
  - **Değilse**: `GET /api/parent/children` → `S.children`. Başlık "ÇOCUKLARIM", alt yazı "Çocuğunun kartına tıklayarak
    portalını aç."; **Çocuk ekle** kartı: ipucu "Çocuğunun **veli kodunu** gir. Kodu okulundan alırsın. Büyük/küçük harfe
    dikkat et; tireler kendiliğinden gelir.", kod kutusu `kisiKoduGirdisi('veliKod', 'Veli kodu')` ([05-giris.md](05-giris.md);
    tireler yazarken gelir, en çok 19 karakter), **Ekle** (`data-act="cocuk-ekle"`), ileti yeri `#veliMesaj`; altında
    `cocukKartlari`.
- `cocukKartlari(list)` — liste boşsa boş kutu "Henüz çocuk eklemedin. Çocuğunun veli koduyla ekleyebilirsin."; değilse
  iki sütunlu ızgara (`.grid.k2`), her çocuk bir tıklanır kart (`.kart.tikla`, `data-act="cocuk-ac"`, `data-id`,
  `data-ad`, `data-ara` = ad): ad, okul adı, "Portalını aç" etiketi ve **Kaldır** (`data-act="cocuk-sil"`).

### Ayarlar

- `SAYFALAR.profil` — yetişkin hesabında ya da okul rolündeyse `GET /api/hesap` → `profilCiz(d.hesap.yetiskin ?
  d.hesap : null)`; öbür hesaplarda doğrudan `profilCiz(null)`.
- `profilCiz(hs)` — `hs`: yetişkin hesabının bilgileri ya da `null`; gösterilen bilgi `k = hs || S.user`. Kartlar
  sırasıyla:
  1. Başlık **AYARLAR**; alt yazı okul rolünde "Öğretmen · Test Ortaokulu", öğrenci/öğretmen/müdür/servisçi/yönetici
     hesabında "Öğrenci hesabı" gibi, yetişkin hesabında (veli ya da rolsüz) "Yetişkin hesabı"; yetişkin hesabı olmayan
     eski düzendeki veli hesabında "Hesabın".
  2. **Hesap bilgilerin** (`satirBilgi` satırları): Ad Soyad, Kullanıcı adı, E-posta (varsa), okul ("Şu anki okulun" okul
     rolünde, "Okul" yetişkin hesabı olmayan okul hesaplarında; yetişkin hesabının kendisinde gösterilmez), Doğum tarihi (`dogumMetni`), Branş (varsa), öğrencide **Veli kodun (velinle
     paylaş)** — `kisiKoduKutusu(u.code)` (tireli kod + **Kopyala**) ve ipucu "Velin bu kodu Eğitim Evi'nde **+ Ekle > Veli**
     ekranına yazınca hesabına bağlanır. Büyük/küçük harf fark eder."; yetişkinde "Bu bilgiler yetişkin hesabınındır;
     öğretmen, müdür ya da veli olarak girdiğinde de aynıdır."
  3. `S.portallar` varsa **Portallarım** kartı (`portalYonetimKarti`, [08c-kisilikler.md](08c-kisilikler.md)).
  4. Yetişkinde **Giriş bilgileri** (`girisBilgileriKarti(hs)`, aşağıda).
  5. **Bilgileri güncelle**: Ad Soyad `#pAd` (en çok 80), İl `select#pIl` (çizildikten sonra `S.meta.cities`'ten doldurulur,
     kayıtlı il seçili), İlçe `#pIlce` (60), Adres `#pAdres` (200); T.C. kimlik no — okulun açtığı hesapta salt okunur
     (`.salt-okunur`, "Yalnızca sen ve okul yönetimi görür. Yanlışsa okul yönetimine söyle."), başkasında `#pTc`
     ("T.C. kimlik no (isteğe bağlı)", 11 hane, "Yalnızca sen görürsün. Boş bırakabilirsin."); Doğum tarihi — öğrencide
     her zaman, başkasında yalnız daha önce girilmişse (silebilsin diye) "Doğum tarihi (isteğe bağlı)":
     `tarihSecici('pDogum', …, { enKucukYas: öğrenci 3 / başkası 16 })` ([04a-form-alanlari.md](04a-form-alanlari.md));
     **Kaydet** (`data-act="profil-kaydet"`), `#pMesaj`.
  6. Eski düzendeki öğretmen/müdür hesabında (yetişkin hesabı ve okul rolü değil) **Veli olarak çocuğunu ekle**: ipucu
     "… Menüne "Velisi olduğum" bölümü eklenir; okul yönetimi de seni veli olarak bağlayabilir. …", aynı kod kutusu ve
     **Ekle** (`cocuk-ekle`), bağlı çocuk varsa "Bağlı çocuğun: …". Yetişkin hesabında bu iş "+ Ekle > Veli"dedir.
  7. **Telefon bildirimleri** — `#bildirimAyar` kutusunu `bildirimKartiCiz()` doldurur ([04b-bildirim-izni.md](04b-bildirim-izni.md)),
     iletiler `#bildirimAyarMesaj`.
  8. Müdürde **Okulun adresi ve konumu**: `<site>/school/<kısa ad>` (`okulYolu`, [05a-dis-sayfalar.md](05a-dis-sayfalar.md))
     ya da "Henüz seçilmedi", "Öğrenci ve öğretmenler okulun bu adresinden girer.", **Değiştir** (`data-nav="okul-ayarlari"`).
  9. **Görünüm**: "Koyu tema akşam gözü yormaz. "Sistem" seçilirse bilgisayarın ya da telefonun kendi ayarına uyar." ve
     üç düğme Sistem · Açık · Koyu (`data-act="tema-sec"`, `data-deger`; seçili olan dolu, öbürleri gri; şimdiki değer
     `window.temaOku()`, `public/js/tema.js`).
  10. **Şifre değiştir**: `#sEski`, `#sYeni` (yanında kural listesi `sifreKuralListesi('sKural', gucluSifreli(u))`; yazdıkça
      `sifreKurallariniIsaretle` işaretler — öğrenci ve servisçide kurallar daha hafif, [05-giris.md](05-giris.md)),
      `#sYeni2`, **Şifreyi değiştir** (`data-act="sifre-kaydet"`), `#sMesaj`.
  11. Yetişkin hesabında ya da okul rolünde **Eğitim Evi hakkında yorumun** (`#yorumKart`; içi `yorumKartiniDoldur`).
  12. Yetişkin hesabında **Hesabımı sil**: "Hesabın, çocuklarınla bağın, öğretmeni olduğun okullardaki yerin ve
      bildirimlerin silinir; geri alınamaz. Verdiğin ödevler ve notlar okulda kalır. Bir okulun müdürüysen önce müdürlüğü
      devretmelisin.", `#silSifre`, kırmızı **Hesabımı sil** (`data-act="benim-hesap-sil"`), `#silMesaj`.
  13. Kırmızı **Çıkış yap** (`data-act="cikis"`).
  Çizdikten sonra: il listesi doldurulur, `bildirimKartiCiz()`, şifre kutusuna kural işaretleyici, yorum kartı varsa
  `yorumKartiniDoldur()`.
- `satirBilgi(etiket, deger)` — tek bilgi satırı; `deger` çağıranın kaçırdığı (`esc`) HTML'dir.
- `dogumMetni(iso)` — "2011-03-12" → "12 Mart 2011 (15 yaşında)"; yaş cihazın bugünüyle hesaplanır, biçim tutmazsa metin
  olduğu gibi. Ay adları `AY_ADLARI` ([17-takvim.md](17-takvim.md)).

### Açılış sayfasına yorum

- `YORUM` — `{ yildiz }`: penceredeki seçili yıldız.
- `yorumKartiniDoldur()` — `GET /api/yorumlar/benim`. Yazamıyorsa kartta sunucunun nedeni (ör. "Yorum yazmak için bir
  okulda öğretmen ya da müdür olman ya da çocuğunu eklemiş olman gerekiyor."). Yazabiliyorsa: "Açılış sayfasında
  **Ay. Ka. · Öğretmen, veli** olarak görünür; adın tam yazılmaz. Küfür, hakaret ve internet adresi kabul edilmez.";
  yönetici gizlediyse sarı kutu "Yorumun sistem yöneticisi tarafından gizlendi; açılışta görünmüyor."; **Yıldız** — 0'dan
  5'e altı yuvarlak düğme (`.yildiz-sec-btn`, `role="radio"`, `data-act="yorum-yildiz"`, `data-id` = sayı; 0 "0" yazar,
  öbürleri yıldız simgesi), yorumu yoksa 5 seçili başlar; **Yorumun** `textarea#yorumMetin` (en çok 500) ve sayaç "123 /
  500"; **Yorumu gönder** ya da **Yorumu güncelle** (`yorum-kaydet`), varsa **Yorumu sil** (`yorum-sil`); `#yorumMesaj`.
  Hata kartın içine düz metin olarak yazılır.
- `yorumYildizCiz()` — 1…seçili yıldızları `dolu`, seçili düğmeyi `secili` yapar, `aria-checked`'i günceller.
- `EYLEMLER['yorum-yildiz']` — `YORUM.yildiz = data-id`.
- `EYLEMLER['yorum-kaydet']` — "Gönderiliyor..." → `POST /api/yorumlar { yildiz, metin }` → sunucunun iletisi
  `#yorumMesaj`'a ("Yorumun açılış sayfasında görünüyor. Teşekkürler!"); hata da oraya.
- `EYLEMLER['yorum-sil']` — onay "Yorumun silinsin mi?" → `POST /api/yorumlar/sil` → kart yeniden doldurulur; hata uyarı
  kutusunda.

### Giriş bilgileri (yalnız yetişkin hesabı)

- `girisBilgileriKarti(hs)` — `#girisBilgiKart`: e-posta yoksa sarı kutu "Hesabında e-posta yok. Ekle: giriş kodu ve şifre
  sıfırlama bağlantısı oraya gelir."; **Kullanıcı adı** `#hKadi` (30), **E-posta** `#hEposta` (120; ipucu "İki adımlı
  giriş: her girişte bu adrese bir kod gelir. Yetişkin hesaplarında hep açıktır."), **Telefon** `#hTelefon`
  (`type=tel`; [04c-telefon.md](04c-telefon.md) ülke kodlu kutuya çevirir), **Mevcut şifren** `#hSifre` ("Değişikliği
  onaylamak için."), **Kaydet** (`data-act="benim-bilgi-kaydet"`), `#hMesaj`. Üç kutunun ilk değeri `data-ilk`'te durur.
- `HESAP_ALAN` — sunucunun `alan` adı → kutu: `kullaniciAdi` → `hKadi`, `eposta` → `hEposta`, `telefon` → `hTelefon`,
  `sifre` → `hSifre`.
- `EYLEMLER['benim-bilgi-kaydet']` — eski kırmızıları siler; yalnız DEĞİŞEN alanları gövdeye koyar (telefon `telefonOku`
  ile "+90…" biçiminde; kullanıcı adı `İ`→`i` ve küçük harf). Hiçbiri değişmediyse "Değişiklik yok.". Tarayıcı denetimi:
  `kullaniciAdiSorunuTR`, `EPOSTA_DESENI` ("Geçerli bir e-posta adresi yaz."), `telefonSorunuTR`, şifre boşsa "Mevcut
  şifreni yaz." — hatalar kutunun altında, ilk hatalıya gidilir. Sonra "Kaydediliyor..." → `POST /api/hesap/bilgi
  { sifre, kullaniciAdi?, eposta?, telefon? }` → okul rolünde değilse `S.user`'ın kullanıcı adı/e-posta/telefonu
  güncellenir → sayfa yeniden çizilir ve sunucunun iletisi `#hMesaj`'a. Sunucu hatası `alan` taşıyorsa o kutunun altına,
  yoksa `#hMesaj`'a.

### Hesabı silme

- `EYLEMLER['benim-hesap-sil']` — şifre boşsa "Mevcut şifreni yaz."; onay "Hesabın ve bütün bilgilerin kalıcı olarak
  silinsin mi? Bu geri alınamaz." → "Siliniyor..." → `POST /api/hesap/sil { sifre, onay: true }` → bu cihazın telefon
  bildirimi aboneliği bırakılır (`bildirimAboneligiBirak`, [04b-bildirim-izni.md](04b-bildirim-izni.md)) → sessiz çıkış
  (`cikisYap(true)`) → giriş ekranında yeşil ileti "Hesabın ve bütün bilgilerin silindi." Şifre hatası kutunun altına,
  başkası `#silMesaj`'a.

### E-posta önerisi

- `epostaOnerisi()` — `26-baslat.js` sayfa çizildikten sonra çağırır. Yalnız yetişkin hesabı ya da okul rolünde, bu
  sekmede ilk kez (`S._epostaSoruldu`) ve bu tarayıcıda bu kişi için "Bir daha sorma" denmemişse (`tercihOku
  ('eposta_sorma')` → `localStorage` `ee_eposta_sorma`). `GET /api/hesap`; hesap yetişkin, e-postası yok ve oturum hâlâ
  aynı kişininse pencere: "E-posta eklemek ister misin?" — "Hesabında e-posta adresi yok. Eklersen girişte sana bir kod
  gelir (iki adımlı giriş) ve şifreni unutursan e-postanla sıfırlarsın." Düğmeler **Bir daha sorma** (`eposta-sorma`),
  **Sonra** (pencereyi kapatır), **E-posta ekle** (`eposta-ekle-git`). Hata sessizce yutulur.
- `EYLEMLER['eposta-sorma']` — bu kişinin kimliğini `ee_eposta_sorma`'ya yazar, pencereyi kapatır.
- `EYLEMLER['eposta-ekle-git']` — pencereyi kapatır, Ayarlar'ı açar, E-posta kutusunu ortaya kaydırıp odaklar.

### Bu ekranın `25-tiklama.js`'teki düğmeleri

| Eylem | Ne yapar |
|---|---|
| `cocuk-ekle` | `kisiKoduDenetle` (boş: "Veli kodunu yaz.", 16 değil: "Veli kodu 16 karakterdir.") → `POST /api/parent/link { code }` (tiresiz) → `S.children` → `portallariTazele()` → Ayarlar'daysa Ayarlar, değilse Çocuklarım yeniden. Hata `#veliMesaj`'a. |
| `cocuk-ac` | `S.viewStudentId`/`S.viewStudentName` = çocuk → `git('ilerleyisim')` (menü çocuğun portalına döner, [06-menu.md](06-menu.md)). |
| `cocuk-sil` | Onay "Bu çocuk hesabından kaldırılsın mı?" → `POST /api/parent/unlink { studentId }` → `S.children`; seçili çocuksa `S.veliCocuk` boşalır → `portallariTazele()` → çocuk kaldıysa ya da veliyse Çocuklarım, değilse ana sayfa. |
| `profil-kaydet` | Doğum tarihi yarım seçildiyse "Doğum tarihinde gün, ay ve yılın üçünü de seç." → `POST /api/profile { fullName, city, district, address, tc (kutu varsa), dogum }` → `S.user`, üst şeritteki ad ve avatar güncellenir, "Bilgilerin kaydedildi."; T.C. hatası kutunun altına, başkası `#pMesaj`'a. |
| `tema-sec` | `window.temaAyarla(değer)` (tarayıcı) + sessizce `POST /api/profile { tema }` (hesap) → Ayarlar yeniden. |
| `sifre-kaydet` | Mevcut boş → "Mevcut şifreni gir."; iki yeni farklı → "Yeni şifreler birbirini tutmuyor."; eskisiyle aynı → "Yeni şifre eskisiyle aynı olamaz."; kural (`sifreSorunuTR`) → `POST /api/password { old, new }` → yönetici ise yönetim adresine geçiş (`yonetimeGec`), değilse "Şifren değiştirildi." ve kutular boşalır. |
| `kisilik-gec` | (okul rolündeki Çocuklarım düğmeleri) [08c-kisilikler.md](08c-kisilikler.md). |
| `kod-kopyala` | Veli kodunun **Kopyala** düğmesi: panoya tireli kod. |
| `cikis` | `cikisYap()` (`26-baslat.js`). |

## Kimle konuşur?

- Parçalar ad sırasıyla tek bir IIFE'de birleşir (`/js/app.js`; [../../../sunucu/http.md](../../../sunucu/http.md)
  `birlesikOku`). Bu dosyanın çağırdıkları: `S` ([00-durum.md](00-durum.md)); `$`, `esc`, `api`, `EYLEMLER`, `tercihOku`,
  `tercihYaz` ([01-yardimcilar.md](01-yardimcilar.md)); `ik`, `ROL_AD` ([02-ikonlar.md](02-ikonlar.md)); `modalAc`,
  `modalKapat`, `mesajGoster` ([03-mesaj-modal.md](03-mesaj-modal.md)); `alanHatasi`, `alanTemizle`,
  `formHatalariniSil`, `ilkHatayaGit`, `tarihSecici` ([04a-form-alanlari.md](04a-form-alanlari.md));
  `bildirimKartiCiz`, `bildirimAboneligiBirak` ([04b-bildirim-izni.md](04b-bildirim-izni.md)); `telefonOku`,
  `telefonSorunuTR` ([04c-telefon.md](04c-telefon.md)); `kisiKoduGirdisi`, `kisiKoduKutusu`, `kullaniciAdiSorunuTR`,
  `EPOSTA_DESENI`, `sifreKuralListesi`, `sifreKurallariniIsaretle`, `gucluSifreli`, `dugmeBekle`, `dugmeBitir`
  ([05-giris.md](05-giris.md)); `okulYolu` ([05a-dis-sayfalar.md](05a-dis-sayfalar.md)); `git`, `yaz`, `hero`,
  `bosKutu` ([07-yonlendirme.md](07-yonlendirme.md)); `SAYFALAR` ([08-ana-sayfa.md](08-ana-sayfa.md));
  `portalYonetimKarti` ([08c-kisilikler.md](08c-kisilikler.md)); `AY_ADLARI` ([17-takvim.md](17-takvim.md)); `hataGoster`
  (`25-tiklama.js`); `cikisYap` (`26-baslat.js`); `window.temaOku` (`public/js/tema.js`).
- Onu kullananlar:
  - `26-baslat.js` — `epostaOnerisi()` (girişten sonra) ve çıkışta `S._epostaSoruldu = false`.
  - `25-tiklama.js` — üst şeritteki `#btnAyarlar` ve `#btnProfil` düğmeleri `git('profil')`; yukarıdaki tablo; `tema-degis` (üstteki
    ay/güneş) Ayarlar açıksa sayfayı yeniden çizer.
  - `25-tiklama.js`'teki `data-nav="geri-veli"` (öğrenci portalındaki "Çocuk Listesi"): velide `S.viewStudentId`'yi
    boşaltıp `git('cocuklarim')`.
  - [06-menu.md](06-menu.md) — menünün altındaki "Ayarlar", velinin "Çocuklarım"ı ve "Velisi olduğum" bölümü;
    [08-ana-sayfa.md](08-ana-sayfa.md) — "Ayarlar" ve velinin "Çocuklarım" kutucukları;
    [08c-kisilikler.md](08c-kisilikler.md) — okuldan ayrılınca (`kisilik-ayril`, oturum değişmediyse) ve çocuk portalı
    kaldırılınca (`kisilik-cocuk-kaldir`) `git('profil')`; yönetim paketindeki
    `public/js/yonetim/09a-yonetim-paneli.js` — yöneticinin "Ayarlar" kutucuğu.
  - Sunucunun bildirim bağlantıları: veliye giden devamsızlık bildirimleri
    ([../../../sunucu/bolumler/devamsizlik.md](../../../sunucu/bolumler/devamsizlik.md)), okulun veliyi bağladığını
    söyleyen bildirim ([../../../sunucu/bolumler/hesaplar.md](../../../sunucu/bolumler/hesaplar.md)) ve nakil bildirimi
    ([../../../sunucu/bolumler/nakil.md](../../../sunucu/bolumler/nakil.md)) `#/cocuklarim`'e; toplu giriş bilgisi
    dağıtılınca öğrenciye giden "Giriş bilgilerin okul yönetimi tarafından yenilendi…" bildirimi
    ([../../../sunucu/bolumler/okul.md](../../../sunucu/bolumler/okul.md)) `#/profil`'e gider.
  - `SAYFALAR.profil`'i bu dosyanın kendi `benim-bilgi-kaydet` eylemi de çağırır; başka parça doğrudan çağırmaz.
- Sunucu uçları:
  - `GET /api/parent/children`, `POST /api/parent/link { code }`, `POST /api/parent/unlink { studentId }`
    ([../../../sunucu/bolumler/veli.md](../../../sunucu/bolumler/veli.md)) — veli, öğretmen, müdür (bağlamada rolsüz
    yetişkin de: kod doğruysa veli olur); okul rolündeyken bağlar yetişkin hesabındadır. `children`: `[{ id, fullName,
    schoolId, schoolName, code }]`. Bağlama sınırları: hesap başına dakikada 5 deneme (429 "Çok fazla kod denemesi. Bir
    dakika bekleyip tekrar dene."), aynı bağlantıdan saatte 30 yanlış kod; yanlış kod "Bu koda sahip bir öğrenci
    bulunamadı. Kodu öğrencinin Ayarlar sayfasından kontrol et."; "Kendi hesabını veli olarak ekleyemezsin."; "Bu öğrenci
    zaten ekli". Kod kullanılınca yenilenmez (anne ve baba aynı kodla ekler); öğrenciye "<ad> veli olarak hesabına
    bağlandı." bildirimi gider. Kaldırma bağ yoksa sessizce hiçbir şey yapmaz.
  - `GET /api/hesap`, `POST /api/hesap/bilgi`, `POST /api/hesap/sil`
    ([../../../sunucu/bolumler/kisilik.md](../../../sunucu/bolumler/kisilik.md)):
    - `GET /api/hesap` → `{ hesap: { fullName, username, email, phone, address, city, district, tc, dogum, yetiskin } }`;
      okul rolündeyse bağlı olduğu yetişkin hesabınınki.
    - `POST /api/hesap/bilgi` — yalnız yetişkin hesabı (başkası 403 "Bu işlem yetişkin hesabıyla yapılır. Hesabını okul
      yönetimi düzenler."); saatte 10 (429 "Çok sık değiştirdin. Biraz sonra dene."); yanlış şifre 400 `alan: 'sifre'`
      "Mevcut şifre yanlış."; kullanıcı adı sorunları ve "Bu kullanıcı adı alınmış. Başka bir ad dene." (`alan:
      'kullaniciAdi'`); e-posta zorunlu ve geçerli, "Bu e-posta başka bir hesapta kayıtlı.", alan adı posta almıyorsa
      ""ornek.com.tr" alan adı e-posta almıyor." (`alan: 'eposta'`). Yeni e-posta HEMEN değişmez: yeni adrese onay
      bağlantısı gider (saatte 3), ileti "… a***@… adresine bir bağlantı gönderdik; tıklayınca e-postan değişir."
      Kullanıcı adı ve telefon okul rol satırlarına da yazılır (okulda ad alınmışsa sonuna sayı eklenir); işlem kaydına
      `hesap.bilgi`.
    - `POST /api/hesap/sil` — saatte 5; şifre ve `onay: true` ister; okulda müdürse 400 "Bir okulun müdürüsün. Hesabını
      silmeden önce müdürlüğü devretmek için sistem yöneticisiyle iletişime geç."; öğretmen rolleri okuldan çıkar,
      hesap silinir (çocuk bağları, bildirimler, oturumlar, telefon bildirimi abonelikleri şema kurallarıyla gider).
  - `POST /api/profile`, `POST /api/password` ([../../../sunucu/bolumler/kayit.md](../../../sunucu/bolumler/kayit.md)):
    - profil: okul rolündeyken yetişkin hesabına yazar (ad, rol satırlarına da geçer); ad en az iki sözcük ("Ad ve
      soyad gerekli"); T.C. — okulun açtığı hesapta 400 "T.C. kimlik numaranı okul yönetimi düzenler.", hesap başına
      günde 5 değişiklik, başka hesaptaysa "Bu T.C. kimlik numarası kullanılamıyor. Yanlış yazmadıysan okul yönetimine
      başvur." (hepsi `alan: 'tc'`); il listede yoksa yok sayılır; doğum tarihi öğrencide zorunlu ("Doğum tarihi
      gerekli", "Böyle bir gün yok", "Doğum tarihi gelecekte olamaz", 1920'den eski olamaz); `tema` yalnız `sistem`,
      `acik`, `koyu`. Cevap `{ user }`.
    - şifre: okul rolündeyken yetişkin hesabının şifresi; 15 dakikada 10 deneme; "Mevcut şifre yanlış"; yeni şifre
      kuralı, eskisiyle aynı olamaz, T.C. no'yu ya da kullanıcı adını içeremez; değişince bu oturum DIŞINDAKİ bütün
      oturumlar (okul rolleri dahil) kapanır.
  - `GET /api/yorumlar/benim`, `POST /api/yorumlar`, `POST /api/yorumlar/sil`
    ([../../../sunucu/bolumler/yorum.md](../../../sunucu/bolumler/yorum.md)) — yazabilen: onaylı öğretmen ya da müdür
    rolü olan ya da çocuğu bağlı yetişkin (öğrenci, servisçi, yönetici yazamaz); hesap başına tek yorum; saatte 10
    değişiklik; yıldız 0–5 tam sayı; metin boşluklar sadeleştirilince 3–500 karakter; internet adresi ve uygunsuz kelime
    reddedilir; ad kısaltılır ("Ay. Ka."). Açılış listesi bir dakika önbellekte durur.
  - Telefon bildirimleri kartının uçları [../../../sunucu/bolumler/push.md](../../../sunucu/bolumler/push.md)'de
    (`04b-bildirim-izni.js` üzerinden).
- Veri: [../../../sunucu/veri/depo/kullanicilar.md](../../../sunucu/veri/depo/kullanicilar.md) (`kullanicilar`,
  `veli_baglari`), [../../../sunucu/veri/depo/yorumlar.md](../../../sunucu/veri/depo/yorumlar.md),
  [../../../sunucu/veri/depo/onaylar.md](../../../sunucu/veri/depo/onaylar.md) (e-posta değişikliği onayı).
- CSS: `public/css/parcalar/04-kartlar.css` (`.kart`, `.kart.tikla`, `.grid.k2`, `.satir`, `.etiket`, `.bos`),
  `02-form.css` (`.field`, `.row2`, `.hint`, `.btn`, `.msg`; telefonun ülke kodlu kutusu `.tel-kutu`, `.tel-ulke`),
  `09-kayit-ekrani.css` (`.rolsuz-satir`: kod kutusu ve düğme yan yana), `27-harita-ortak.css` (`.dugme-satir`,
  `.salt-okunur`), `28-yetiskin-hesap.css` (`.kisi-kodu`, `.kisi-kodu-satir`, `.kisi-kodu-girdi`, `.yildiz-sec`,
  `.yildiz-sec-btn` — `dolu` sarı, `secili` odak halkası), doğum tarihinin üç açılır
  listesi `.tarih-secici` yine `02-form.css`'te, `06-modal.css` (e-posta önerisi penceresi). `.tema-secim`'in kendi
  kuralı yok.
- Rol: Çocuklarım — veli, çocuğu bağlı öğretmen/müdür; Ayarlar — herkes (öğrenci, veli, öğretmen, müdür, servisçi,
  rolsüz yetişkin, yönetici).

## Nasıl çalışır (adım adım)?

```
veli "Çocuklarım" ─► GET /parent/children ─► kod kutusu + çocuk kartları
   kodu yazar (tireler kendiliğinden) ─► "Ekle" ─► 16 karakter mi ─► POST /parent/link { code }
        ─► S.children ─► portallariTazele (menü) ─► Çocuklarım yeniden: yeni kart
   karta basar ─► S.viewStudentId ─► git('ilerleyisim') ─► menü: çocuğun portalı

"Ayarlar" ─► yetişkin/okul rolü mü? ─► evet: GET /api/hesap ─► profilCiz(hesap)   hayır: profilCiz(null)
   ─► kartlar ─► il listesi, telefon bildirimi kartı, yorum kartı (GET /yorumlar/benim)
   "Giriş bilgileri › Kaydet" ─► yalnız değişenler + şifre ─► POST /hesap/bilgi
        e-posta değiştiyse ─► onay bağlantısı ─► ekranda eski adres + "bağlantı gönderdik"
   "Hesabımı sil" ─► şifre + onay ─► POST /hesap/sil ─► abonelik bırak ─► çıkış ─► "Hesabın … silindi."

giriş ─► 26-baslat ─► epostaOnerisi ─► (e-postasız yetişkin) "E-posta eklemek ister misin?"
   "E-posta ekle" ─► Ayarlar ─► E-posta kutusu odakta
```

## Dikkat!

- **Ad kutusunu boşaltmak hiçbir şey yapmaz ama "kaydedildi" der.** `profil-kaydet` boş adı da gönderir; sunucu
  `fullName` boşsa adı hiç değiştirmez ve hata da vermez, ekranda "Bilgilerin kaydedildi." çıkar. (Tek sözcüklük ad
  ise "Ad ve soyad gerekli" ile reddedilir.)
- **E-posta değişikliği onay bekler.** Kaydettikten sonra sayfa yeniden çizilir ve kutuda ESKİ adres görünür; değişiklik
  yeni adrese giden bağlantıya tıklanınca olur. İleti bunu söyler.
- **Telefon numarası silinemez, yalnız değiştirilir.** Kutu boşaltılınca tarayıcı "Telefon numaranı yaz." der
  (`telefonSorunuTR`).
- **Yorum kartı ilk gönderimden sonra tazelenmez.** "Yorumu gönder" yazısı kalır, "Yorumu sil" çıkmaz, yöneticinin
  gizleme uyarısı güncellenmez; Ayarlar'a yeniden girince doğru görünür.
- **Çocuk kartı klavyeyle açılmaz.** Kart bir `div`'dir (`tabindex` ve `role` yok); yalnız fare ya da dokunmayla
  açılır. İçindeki "Kaldır" gerçek düğmedir. Karta basmak ile "Kaldır"a basmak karışmaz: tıklama dağıtıcısı en yakın
  `data-act`'i alır.
- **Çocuk listesi veli kodunu da taşır.** `GET /api/parent/children` her çocuğun `code`'unu (veli kodu) gönderir; bu ekran
  kullanmaz. Okul bir öğrencinin veli kodunu yenilediğinde (ör. kod yanlış ele geçti) bağlı kalan herkes yeni kodu bu
  cevaptan görebilir. Veri azaltma açısından gereksiz; kod okumasına göre.
- **"Bir daha sorma" tarayıcıda tek kişiyi hatırlar.** `ee_eposta_sorma` yalnız son basan kişinin kimliğini tutar; okul
  rolündeyken basılırsa rol satırının kimliği yazılır ve yetişkin hesabıyla girince öneri yeniden çıkar. Öneri portal
  değişiminde değil, yalnız çıkışta yeniden sorulabilir olur (`S._epostaSoruldu`).
- **Hesap silinince telefon bildirimini bırakma isteği 401 alır.** Bu tarayıcıda telefon bildirimi açıksa
  `bildirimAboneligiBirak` sunucuya `POST /api/push/iptal` gönderir; hesap artık silinmiş olduğu için istek yetkisiz döner,
  `api` 401'de zaten sessiz çıkış yapar, ardından bu eylemin kendi `cikisYap(true)`'su bir kez daha çalışır. Tarayıcıdaki
  abonelik yine bırakılır; sunucudaki abonelik satırı hesapla birlikte `ON DELETE CASCADE` ile silinmiştir (şema 011).
  Zararsız; kod okumasına göre.
- **Hesap silme yalnız yetişkin hesabında.** Öğrenci, servisçi ve eski düzendeki okul hesaplarında kart yoktur; sunucu
  da 403 verir (bu hesapları okul siler).
- **T.C. "Yalnızca sen görürsün"** yetişkin hesabı için doğrudur: okul rol satırlarına T.C. kopyalanmaz
  ([../../../sunucu/bolumler/hesaplar.md](../../../sunucu/bolumler/hesaplar.md)). Okulun açtığı hesapta ise okul yönetimi
  görür ve yalnız o düzenler; kutu salt okunurdur.
- **İl listesi sayfa çizildikten sonra dolar.** `S.meta.cities` açılışta yüklenir; henüz gelmediyse kutuda yalnız
  "Seç..." olur ve kaydedince sunucu boş ili yok sayar (eski il korunur).
- **Okul rolünde `S.user` güncellenmez.** `benim-bilgi-kaydet` okul rolündeyken kullanıcı adı/e-posta/telefonu oturumdaki
  nesneye yazmaz (rol satırının bilgisi ayrı); sayfa `GET /api/hesap`'tan yeniden çizildiği için ekranda doğru görünür.
- **Şifre değişince öteki cihazlar ve roller düşer.** Bu oturum kalır; aynı kişinin başka sekmelerdeki ya da başka
  roldeki oturumları kapanır (sunucu kuralı).
- **Doğum tarihi yetişkinde ancak önceden girilmişse görünür** (KVKK veri azaltma; DEVAM.md'de "yetişkin doğum tarihi"
  sorusu açık). Öğrencide zorunludur.
- **Kişisel veri.** Bu sayfa T.C., adres, telefon, doğum tarihi gösterir ve düzenler; yeni bir alan eklenirse KVKK kuralı
  geçerlidir (aydınlatma metni ve `KVKK_SURUM` aynı commit'te; DEVAM.md 2. bölüm).
- `S.children`, `S.portallar` ve öteki oturum alanları çıkışta `26-baslat.js`'te sıfırlanır; bu dosyanın `YORUM` nesnesi
  sıfırlanmaz (yalnız yıldız sayısı; kart açılınca yeniden yazılır).

## Testleri

- `testler/test-yetiskin.js` — müdürken hesap silinemez; müdür rolündeyken şifre değişir ve yetişkin hesabında geçerli
  olur; `hesap/bilgi` mevcut şifre ister (`alan: 'sifre'`), alınmış kullanıcı adı verilmez (`alan: 'kullaniciAdi'`),
  yetişkinin e-postası boşaltılamaz, kullanıcı adı ve telefon değişir; müdür rolündeyken `GET /api/hesap` yetişkin
  hesabının bilgilerini verir; ad değişince okulun öğretmen listesinde de güncel (`/api/profile`); silme şifre ve onay
  ister, silinen hesap giremez, öğrenci kendi hesabını silemez (403).
- `testler/test-giris-kayit.js` — e-posta değişikliğinin onay bağlantısıyla olması; 7) veli kodu: yanlış kod 400, harf
  durumu çevrilmiş kod kabul edilmez, boşluklu ve 4'erli tireli yazılan kod kabul edilir, kodu giren rolsüz hesap veli
  olur; 10) okulun açtığı hesapta T.C. profilden değişmez (400), velinin geçersiz T.C.'si reddedilir; 11) şifre
  değişince değiştiren oturum açık kalır, öbür oturum kapanır; 12b) aynı bağlantıdan yanlış veli kodu sınırı 30
  civarında 429 verir.
- `testler/test-yonetim.js` — 3b) `POST /api/password`: yeni şifre T.C. no'yu içeremez, eskisiyle aynı olamaz (zorunlu
  şifre değişimi üzerinden; Ayarlar'daki `sifre-kaydet` aynı ucu kullanır).
- `testler/test-cakisma.js` — `hesap/bilgi`'de büyük harfle yazılmış var olan e-posta/kullanıcı adı, ayrılmış ad
  ("ADMIN"), aynı anda iki hesabın aynı adı ya da e-postayı istemesi (`alan`'lı 400, 500 değil).
- `testler/test-veli-coklu.js` — öğretmen tireli yazılmış veli koduyla çocuğunu bağlar, rolü değişmez, bağı kaldırabilir
  (`parent/unlink`); okul veliyi bağlar ve kaldırır.
- `testler/guvenlik-test.js` — 8) veli kodu kaba kuvvet: art arda yanlış kodda 429. `testler/test-kisi-kodu.js` — anne
  ve baba aynı veli koduyla ekler, kod kullanılınca yenilenmez; okul veli kodunu yenileyince eski kodla bağlanılamaz.
- `testler/test-yorum-ek.js` — yorum: girişsiz liste, öğrenci ve rolsüz yazamaz, `benim`, uygunsuz kelime, bağlantı,
  yıldız 6, kısa metin, yazma/güncelleme, açılışta kısaltılmış ad.
- `testler/buton-denetimi.js` — `yorum-*`, `benim-*`, `eposta-*`, `cocuk-*`, `profil-kaydet`, `sifre-kaydet`, `tema-sec`;
  `testler/yazim-denetimi.js` ekran metinleri.
- Bu dosyanın tarayıcıda çalışan testi yok (ekran turu `araclar/gezinti.js` farklı rollerde "Ayarlar" ve "Portallarım"
  görüntülerini alır; bir şey doğrulamaz).
- Elle (sunucu 3200'de): veliyle **Çocuklarım** → bir öğrencinin Ayarlar'daki veli kodunu yaz → kart görünür → karta bas →
  menü çocuğun portalına döner. **Ayarlar** → Giriş bilgileri'nde telefonu değiştir, şifreyi yaz → Kaydet → "Bilgilerin
  kaydedildi."; e-postayı değiştir → ekranda eski adres ve "bağlantı gönderdik" iletisi.

## Son durum

- `git log`: 13 commit. Dosya 2026-09-25'te parça parça kuruldu: `2f8bbd4 commit 261` (Çocuklarım), `e2c56f6 commit 262`
  (`cocukKartlari`), `046c83b commit 263` (`dogumMetni`), `ae20b91 commit 264` (`satirBilgi`), `86f1fa2 commit 265`
  (`profilCiz` ve bütün kartları), `6698e93 commit 266` (`yorum-sil`), `53bb53a commit 267` (`girisBilgileriKarti`),
  `6f6fd06 commit 268` (`benim-hesap-sil`). 2026-09-26: `e881271 commit 341` (`SAYFALAR.profil`, `epostaOnerisi`,
  `eposta-sorma`, `eposta-ekle-git`), `dea6f4b commit 372` (`YORUM`, `yorumKartiniDoldur`, `yorumYildizCiz`,
  `yorum-yildiz`, `yorum-kaydet`), `37f867d commit 385` (`HESAP_ALAN`, `benim-bilgi-kaydet`).
- `0acca75 commit 516` (2026-09-27, kayıt / kişi kodu / portallar): okul rolündeki Çocuklarım "Hesap değiştir" yerine
  her veli portalı için "Veli · <çocuk>" düğmesi (`kisilik-gec`); veli kodu kutusu ortak `kisiKoduGirdisi`'ye, gösterimi
  `kisiKoduKutusu`'na geçti ("+ Ekle > Veli" ipucu); Ayarlar'a `portalYonetimKarti`; "Rollerin ve çocukların" düğmesi
  kalktı; "Veli olarak çocuğunu ekle" kartı okul rolünde gösterilmez oldu; okul adresi `okulYolu` ile.
- Son değişiklik `153d63d commit 522` (2026-09-27, kişi kodu 16 hane): iki ipucunda "boşluklar önemli değil" yerine
  "tireler kendiliğinden gelir". O günden beri değişmedi.
- Bilinen açıklar (kod değiştirilmedi): boş adla "kaydedildi" iletisi, yorum kartının ilk gönderimden sonra
  tazelenmemesi, klavyeyle açılmayan çocuk kartı, çocuk listesinde gereksiz veli kodu.
- Planlı işlerden bu dosyaya dokunması beklenenler (DEVAM.md 4. bölüm):
  - "Kullanıcı arama + hesap penceresi … Verilerimi indir" (iş 6): Ayarlar'a "Verilerimi indir" (şifre yeniden sorulur,
    saklanan HER ŞEY tek dosya); destek/yönetici kişinin adını, kullanıcı adını, e-postasını değiştirebilecek.
  - "Sistem" (iş 4): Ayarlar > Güvenlik — doğrulama uygulaması (TOTP; yetişkinler isterse açar), "Açık oturumlarım" (cihaz,
    son görülme, tek tek kapatma), yeni cihaz uyarısı; "Yenilikler" penceresi Ayarlar'dan yeniden açılabilecek.
  - "Üst şerit sadeleştirme" (iş 29, öneri): Ayarlar, Portallarım ve Çıkış profil menüsüne taşınacak; Çıkış'a simge.
  - "Tek kişi tek hesap + portallar öğrencide de" (iş 19): öğrenci hesabı da ana hesap + kurum portalları olacak; Ayarlar'daki
    "okulun açtığı hesap" dalları (salt okunur T.C., veli kodu) değişecek; tanımın 29 Eylül kararıyla öğrenci de Ayarlar →
    Güvenlik'ten isteğe bağlı iki adımlı doğrulama (e-posta kodu ya da doğrulama uygulaması) açabilecek.
  - Aynı tanımdaki "yaş kuralı tamamen kaldırıldı" kararı (29 Eylül): koddaki iki yaş izinden biri bu dosyadadır —
    doğum tarihi seçicisi yetişkinde `enKucukYas: 16` (yıl listesi 16 yaştan başlar; öğrencide 3); öbürü
    [10b-hesaplar.md](10b-hesaplar.md)'deki `enKucukYas: 17`. Bunlar kural değil seçici aralığıdır; kaldırılıp
    kaldırılmayacağı kullanıcıya soruldu, kalkarsa `profilCiz`'deki değer değişir.
  - "Toplantılar …" (iş 21): tanımın ilk taslağındaki "veli izni (bir kez, Ayarlar)" maddesi kullanıcının 29 Eylül 20:40
    kararıyla düştü — öğrenci başına ayrı veli izni denetimi olmayacak, konu aydınlatma metnine yazılacak. Yani bu iş
    Ayarlar'a yeni bir kart getirmez.
  - "Çok dil" (iş 22): dil seçimi (TR ▾) ve metinler; "Arayüz önizlemesi" (iş 31): kullanıcının seçeceği tasarım dili
    Ayarlar'ı "Hesap ayarları" olarak yeniden düzenleyebilir.
  - DEVAM.md 7. bölümdeki açık soru: yetişkin kaydına doğum tarihi (ve il/ilçe seçimi) eklenecek mi — eklenirse bu
    sayfanın doğum tarihi ve il/ilçe alanları değişir.
