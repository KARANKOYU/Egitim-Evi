# sunucu/bolumler/kayit.js

Kapıdaki bölüm: kayıt ve e-posta onayı, giriş (iki adımlı kod), şifremi unuttum, şifre ve profil değiştirme,
aydınlatma metni onayı, `/api/me`, bildirim kutusu ve kayıt ekranının okul aramaları.

## Bu dosya ne yapar?

Siteye gelen biri ilk olarak bu dosyayla konuşur. Hesap açmak, giriş yapmak, şifresini unutmak, profilini
düzeltmek, "ben kimim" diye sormak (`/api/me`) ve bildirim zilini yoklamak buradan geçer.

Önemli fikir şu: **kendi kendine kaydolan tek hesap türü yetişkin hesabıdır.** Veli, öğretmen ve müdür aynı
formu doldurur; hesap rolsüz açılır. Rol sonra gelir ("+ Ekle", [kisilik.md](kisilik.md)): çocuğunun veli kodunu
giren veli olur, kişi kodunu okulunun müdürüne veren öğretmen olarak eklenir, kişi kodunu sistem yöneticisine
veren okulu açılınca müdür olur ([yonetici-okul.md](yonetici-okul.md)). Öğrenci ve servisçi kaydolmaz; hesaplarını
okul açar ([hesaplar.md](hesaplar.md)).

Kayıt da hemen hesap açmaz: bilgiler `eposta_onaylari` tablosunda bekler, adrese bir bağlantı gider; bağlantıya
tıklanınca hesap açılır. Böylece kimse sahibi olmadığı bir adresle hesap açamaz.

Giriş iki adımlıdır: e-posta/kullanıcı adı + şifre doğruysa 6 haneli kod e-postaya gider, oturum anahtarı kod
doğrulanınca verilir. Öğrencide ve e-postası olmayan hesapta kod adımı yoktur.

Dosyanın üst kısmındaki `KVKK_SURUM` bütün sitenin aydınlatma metni sürümüdür; metin değişince burası artırılır
ve herkesin onayı yeniden istenir (kapı [api.md](../api.md)'de).

## İçinde neler var?

### Sabitler

- `KVKK_SURUM` — bugün `'1.15'`. Yanındaki yorum her sürümde metne ne eklendiğini sayar (1.2 doğum tarihi … 1.12
  ödevin quizi, 1.13 ödev teslim dosyalarının 50 MB sınırı ve saklama süreleri, 1.14 verilerin tutulduğu yerin
  düzeltilmesi: okulun kendi sunucusu değil, Eğitim Evi'nin sunucusu; 1.15 T.C. kimlik numarasının bütün hesaplarda zorunlu
  olması ve amacı). Dışa açık.
- `PORTAL_AD` (iç) — `{ teacher: 'Öğretmen', principal: 'Müdür' }`: "Portallarım" satırlarının adı.

### Dışa açık işlevler

- `kvkkGuncelMi(u)` — kişinin onayı yürürlükteki metne mi: `u.kvkk.onay` ve `u.kvkk.surum === KVKK_SURUM`.
  Sistem yöneticisi (`role === 'admin'`) her zaman `true` (kayıt formundan geçmez; ilk açılışta kendini
  kilitlemesin). Okulun açtığı hesapta hiç onay yoktur, ilk girişte sorulur.
- `benimGorunum(u)` — kişinin KENDİSİNE giden görünüm: `pub(u)` ([yetki.md](../yetki.md)) + `tc`,
  `sifreDegismeli`, `okulActi`, `yetiskin` (yetişkin hesabı mı; menüde "Portallarım" ve "+ Ekle" bunun için),
  `rolSatiri` (oturum yetişkin hesabına bağlı bir okul rolünde mi). T.C. no başka hiçbir cevaba girmez.
- `kisilikListesi(ana)` → `{ roller: [{ id, rol, okulAdi, okulKisaAd, durum, girilebilir }], cocuklar: [{ id, ad,
  okulAdi }] }`. `girilebilir`: rol satırı da okul da `approved`. Okulu kapalı (müdürü kaldırılmış) rol listede
  görünür ama girilemez.
- `oturumCevabi(res, u, ek, secenek)` — yeni oturum açar ve giriş cevabını yazar. 24 rastgele bayttan (48 hane)
  anahtar üretir, `depo.oturumlar.ac` ile özetini yazar, son girişi işler. `secenek.uygulama` → oturum 30 gün
  (tarayıcıda 7 gün); `secenek.olusturma` → portal değişiminde eski oturumun açılış anı (süre uzamaz). Cevap:
  `{ token, user, children, kapaliOzellikler, kvkkGuncel, kvkkSurum, bildirimAralikDk, portallar?, hesapAktif?,
  yonetimAdresi? (yalnız yönetici), ...ek }`.
- `register(res, body, req)` — kayıt formunun işi (aşağıda `POST /api/register`). Dışa açık ama bugün yalnız bu
  dosyada çağrılıyor.
- `uclar(k)` — bölümün uçları; tanımadığı yolda `false` döner, 404'ü [api.md](../api.md) verir.

### İç işlevler

- `portalBilgisi(u, cocuk)` — yetişkin hesabında (ya da ona bağlı rol satırında) `{ portallar, hesapAktif }`;
  öteki hesaplarda `null`. Her okul rolü (`tur: 'rol'`) ve velisi olunan her çocuk (`tur: 'veli'`) ayrı satır:
  `{ tur, id, rol, ad, alt, okulAdi, girilebilir, aktif }`. Veli satırında `aktif`, oturum o çocuğa açılırken
  bilinir; sonra hangi çocuğun seçili olduğu tarayıcıdadır (`S.veliCocuk`). Yan etkisizdir.
- `yonetimAlanlari(res, anahtar, u)` — kişi sistem yöneticisiyse `/admin` çerezini yazar ve
  `{ yonetimAdresi }` döner ([yonetim-cerezi.md](../yonetim-cerezi.md)); değilse `{}`. Yönetici olmayan hiçbir
  cevapta bu alan ya da çerez yoktur.
- `girisOturumu(res, u, secenek)` — şifre (ve gerekirse kod) doğrulandıktan sonra oturumu NEREDE açacağını seçer:
  - öğrenci, servisçi, yönetici: kendisi;
  - yetişkin hesabı, `sifreDegismeli`: yetişkin hesabında (önce şifresini koysun), `kisilikSec` portalı varsa `true`;
  - tek girilebilir okul rolü, çocuk yok: doğrudan o rol satırında (yetişkinin de son girişi yazılır);
  - rol yok, tek çocuk: yetişkin hesabında, `cocuk` o çocuk (veli portalı açılır);
  - öteki durumlar: yetişkin hesabında, birden çok portal varsa `kisilikSec: true`.
- `epostaOnayi(res, body, req)` — onay bağlantısı tıklanınca (aşağıda `POST /api/eposta-onay`).

### Uçlar

Hepsi `/api/<p>` biçiminde; hangi `p`'nin bu dosyaya geldiği [api.md](../api.md)'deki `BOLUM` tablosunda.
"Girişsiz" uçlar aydınlatma, şifre ve rolsüz kapılarından serbesttir (`KVKK_SERBEST`). O listede ayrıca `me`,
`kvkk-onay` ve `logout` da vardır: onayı eski kalmış kişi onay penceresini açabilsin, onaylayabilsin ya da
çıkabilsin. `password`, `profile` ve `notifications` o listede YOKTUR: onayı eski olan kişi bunlarda önce
`403 kvkkGerek` alır. `password` şifre kapısından (`SIFRE_SERBEST`: şifresini okul vermiş kişi kendi şifresini
koyabilsin), `profile` ve `notifications` rolsüz kapısından (`ROLSUZ_SERBEST`) serbesttir.

| Uç | Kim | Ne yapar |
|---|---|---|
| `GET /api/meta` | herkes | `{ cities, subjects }` (il listesi ve branşlar, `ortak.js`) |
| `GET /api/okullar/iller` | herkes | MEB listesinden il → ilçeler, `tipler`, `toplam` |
| `GET /api/okullar/ara` | herkes | MEB okul araması |
| `GET /api/okul-adres?kisa=` | herkes | okul adresinden okulun adı ve giriş sayfası |
| `GET /api/okul-adres/ara?q=` | herkes | adresi olan okullarda arama |
| `GET /api/schools?q=&city=` | herkes | onaylı ve müdürlü okullar (eski liste) |
| `POST /api/register` | herkes | kayıt: onay bağlantısı gönderir |
| `POST /api/eposta-onay` | herkes | bağlantı: hesabı açar ya da e-postayı değiştirir |
| `GET /api/challenge` | herkes | bot doğrulama sorusu |
| `POST /api/sifre-unuttum` | herkes | sıfırlama bağlantısı ister |
| `POST /api/sifre-yenile` | herkes | bağlantıdaki anahtarla yeni şifre |
| `POST /api/login` | herkes | 1. adım: kimlik + şifre |
| `POST /api/login/dogrula` | herkes | 2. adım: 6 haneli kod → oturum |
| `POST /api/login/tekrar` | herkes | kodu yeniden gönder |
| `POST /api/logout` | herkes | oturumu kapatır |
| `GET /api/me` | giriş | kişinin kendisi |
| `POST /api/kvkk-onay` | giriş | aydınlatma metnini onaylar |
| `POST /api/password` | giriş | şifre değiştirir |
| `POST /api/profile` | giriş | kişisel bilgiler ve tema |
| `GET /api/notifications` | giriş | bildirim kutusu |
| `POST /api/notifications/read` | giriş | hepsini okundu yapar |

Ayrıntılar:

- **`GET /api/okullar/...`** — MEB listesi yüklenmemişse `503 "Okul listesi yüklenmemiş"`.
  - `iller` → `{ iller: [{ ad, ilceler: [...] }], tipler: [...], toplam }`; Türkçe sıralı.
  - `ara?q=&il=&ilce=&tip=&limit=` → IP başına dakikada 300 arama (aşılırsa 429). `q` en çok 80, `il`/`ilce` 60,
    `tip` 40 karakter. Sorgu da il de yoksa `{ toplam: 0, okullar: [], mesaj: 'İl seç ya da okul adı yaz.' }`;
    varsa `okulArama(...)` sonucu, `limit` varsayılanı 30 ([okullar.md](../okullar.md)).
- **`GET /api/okul-adres`** — IP başına dakikada 3000 istek (okul ağında yüzlerce öğrenci aynı dakikada tek
  IP'den gelir). `?kisa=` → yalnız onaylı, adresi olan okul: `{ okul: { ad, il, ilce, kisaAd }, sayfa }`
  (`sayfa` = okulun giriş sayfası, `okulSayfasiGorunumu`; düzenlenmemişse `null`); yoksa `404 "Bu adreste bir okul
  yok."`. `/ara?q=` → sadeleştirilmiş sorgu 2 harften kısaysa boş liste; yoksa adresli okullar üzerinde bulanık
  arama (ad + il + ilçe + kısa ad), en çok 20: `{ yakin, duzeltme, okullar: [{ ad, il, ilce, kisaAd, vurgu }] }`.
- **`GET /api/schools`** — `depo.okullar.kayitIcin(city)`: onaylı ve müdürü olan okullar (müdürsüz okul görünmez ki
  boşa kayıt denenmesin); `q` ile ad süzgeci; en çok 300: `{ schools: [{ id, name, city, district }] }`. Bugün ön
  yüzde çağıran yok; `testler/seed.js` okul kimliğini bulmak için kullanır.
- **`POST /api/register`** — gövde: `challengeId`, `challengeAnswer`, `fullName`, `email`, `username`,
  `password`, `phone`, `tc` (isteğe bağlı), `address`, `kvkkOnay: true`. Sınırlar: IP başına saatte 100 deneme
  (form hataları dahil), aynı IP'den saatte en çok 60 açılan hesap (bir sınıf tek ağdan kaydolabilsin), aynı
  adrese saatte 3 onay postası, T.C. çakışması IP başına saatte 10. Sırasıyla denetler (hatada
  `400 { error, alan }`; `alan` formdaki kutuyu kırmızıya boyar):
  1. doğrulama sorusu (`alan: 'bot'`) — soru burada HARCANMAZ;
  2. ad-soyad en az iki kelime (`adDuzelt` ile "AYŞE YILMAZ" → "Ayşe Yılmaz");
  3. e-posta biçimi (`epostaSorunu`), kayıtlı mı ("Bu e-posta zaten kayıtlı. Giriş yapmayı dene."), alan adı posta
     alıyor mu (`epostaAlaniVarMi`, DNS);
  4. kullanıcı adı: gövdede hiç yoksa e-postanın @ öncesinden boş bir ad türetilir; kurala uymalı ve HİÇBİR yerde
     (okul hesapları dahil) kullanılmamış olmalı;
  5. şifre (`sifreSorunu(pw, true)`: yetişkin kuralı), telefon;
  6. T.C. (isteğe bağlı): geçerli olmalı; kayıtlıysa soru harcanır, sayaç artar ve cevap `yeniSoru: true` taşır;
  7. `kvkkOnay === true`.
  Geçerse o adresin bekleyen eski kayıtları silinir, bağlantı gönderilir (`onayBaglantisiGonder`), bilgiler
  (şifrenin özeti dahil, 24 saat geçerli) `eposta_onaylari`'na yazılır, soru harcanır. Cevap:
  `{ onayGerekli: true, eposta: <maskeli>, message }`. Hesap henüz YOKTUR.
- **`POST /api/eposta-onay`** — gövde `{ token }` (64 onaltılık hane). IP başına 15 dakikada 30 HATALI denemede 429
  (doğrular sayılmaz; okul ağından çok kişi onay verebilir). Satır bulunamaz ya da silinemezse (iki kez tıklama)
  `400 "Bağlantı geçersiz ya da süresi dolmuş…"`. Adres bu arada başkasına geçtiyse `alan: 'email'`.
  - `tur: 'eposta'` (e-posta değişikliği, [kisilik.md](kisilik.md)): hesabın adresi değişir, işlem kaydına
    `hesap.eposta` yazılır → `{ tur: 'eposta', message }`.
  - `tur: 'kayit'`: kullanıcı adı ya da T.C. bu arada alındıysa `alan` ile söylenir; yoksa hesap açılır: rolsüz,
    `approved`, yeni kişi kodu (`yeniKisiKodu`), onay tarihi ve metin sürümü kaydedilir → `{ tur: 'kayit',
    kullaniciAdi, message }`. Tekil indekse takılırsa (aynı anda iki onay) `cakisma(e)` alanına göre açık ileti;
    tanınmayan hata yukarı atılır.
- **`GET /api/challenge`** — IP başına 10 dakikada 1500 → `botSoruUret()` sonucu (soru kimliği ve metni,
  [guvenlik.md](../guvenlik.md)).
- **`POST /api/sifre-unuttum`** — gövde `{ email, challengeId, challengeAnswer }`. IP başına 15 dakikada 20; soru
  yanlışsa 400. Kutuya kullanıcı adı yazılmışsa (`@` yok) `400 { alan: 'email' }` ("bağlantı e-postaya gider…").
  Öteki her durumda AYNI cevap: "Bu adres kayıtlıysa şifre sıfırlama bağlantısı gönderildi…" — adres yoksa, biçim
  bozuksa, aynı adrese saatte 3'ten fazla istendiyse de. Hesap onaylıysa `sifirlamaGonder(u)`.
- **`POST /api/sifre-yenile`** — gövde `{ token, password }`. IP başına 15 dakikada 30. Anahtar bellekteki
  `sifirlamaKayit`'ta aranır (1 saat geçerli); yoksa "Bağlantı geçersiz ya da süresi dolmuş…". Şifre hesabın
  kuralına uymalı (`gucluSifreli`). Anahtar hemen düşer; şifre yazılması ve BÜTÜN oturumların (cihaz anahtarları
  dahil) kapanması tek işlemde. Sonra hesabın hata kilidi kalkar ve bu bağlantı "tanıdık" olur (hesabı başkaları
  kilitlediyse sahibi hemen girebilsin). İşlem kaydı `sifre.sifirlandi`.
- **`POST /api/login`** — gövde `{ kimlik (ya da eski ad email), password, okul?, challengeId?, challengeAnswer?,
  uygulama? }`. Adım adım "Nasıl çalışır"da. Olası cevaplar:
  - `400 { alan: 'kimlik' }` boş kimlik; `400 { alan: 'sifre' }` boş şifre (ikisi hatalı deneme sayılmaz);
  - `400 { alan: 'kimlik' }` "Bu okul adresi bulunamadı…" (`okul` verilmiş ama yok);
  - `429` bağlantı engeli; `429 { kilitli: true }` hesap/bağlantı kilidi (kalan süre saniye ya da dakika);
  - `400 { alan: 'kimlik', okulSec: true }` kullanıcı adı birden çok okulda var;
  - `400 { alan: 'bot', soruGerekli: true }` soru lazım (hiç gösterilmediyse "Devam etmek için doğrulama sorusunu
    cevapla.");
  - `401 { alan: 'kimlik', hesapYok: true, soruGerekli: true }` böyle hesap yok (e-posta, okul ya da kullanıcı adı
    için ayrı cümle);
  - `401 { alan: 'sifre', kalanHak, soruGerekli: true }` "Şifre yanlış." (+ kalan 3 ve altındaysa "N deneme hakkın
    kaldı." ya da "Giriş 15 dakika kilitlendi.");
  - `403` "Bu hesap kapatılmış…" (`rejected`); `403 { bekliyor: true }` onay bekleyen hesap;
  - öğrenci ya da e-postasız hesap: doğrudan oturum (`girisOturumu`);
  - ötekiler: `{ twoFactor: true, challengeId, maskeliEposta, yontem, mesaj }` (`yontem` `'eposta'` değilse kod
    sunucu penceresine yazılmıştır: e-posta ayarlı değil ya da deneme adresi).
- **`POST /api/login/dogrula`** — gövde `{ challengeId, code, uygulama? }`. IP başına 5 dakikada 25 YANLIŞ kodda
  429 (doğrular sayılmaz; her kodun ayrıca kendi 5 deneme hakkı var). Yanlışsa `401` ve `girisKoduDogrula`'nın
  iletisi. Doğruysa `girisOturumu`; `uygulama` bayrağı bu adımda ya da birinci adımda gelmiş olabilir.
- **`POST /api/login/tekrar`** — gövde `{ challengeId }`. Bekleyen kod yoksa `400 "Giriş oturumu bulunamadı, baştan
  giriş yap"`; son gönderimden 60 saniye geçmediyse `429 "N saniye sonra…"`. Eski kod silinir, yenisi gider
  (uygulama bayrağı taşınır) → `{ challengeId, yontem, mesaj }`.
- **`POST /api/logout`** — `Authorization`'daki oturumu siler (varsa); kişi yöneticiyse `/admin` çerezini de
  tarayıcıdan sildirir → `{ ok: true }`.
- **`GET /api/me`** — girişsizse 401. `{ user, children, kapaliOzellikler, kvkkGuncel, kvkkSurum,
  bildirimAralikDk, portallar?, hesapAktif?, yonetimAdresi? }`. Yöneticinin `/admin` çerezi her çağrıda yenilenir
  (tarayıcı çerezi kaybetmiş olabilir).
- **`POST /api/kvkk-onay`** — gövde `{ onay: true }` (değilse 400). Onay kişinindir: bulunduğu satıra, yetişkin
  hesabına ve bütün okul rolü satırlarına yazılır → `{ user, kvkkGuncel: true, kvkkSurum }`.
- **`POST /api/password`** — gövde `{ old, new }`. Okul rolündeyken şifre yetişkin hesabınındır. Hesap başına 15
  dakikada 10 deneme. `400 { alan: 'eski' }` mevcut şifre yanlış; `400 { alan: 'yeni' }`: kurala uymuyor, eskisiyle
  aynı, ya da T.C. no'yu / (4+ harfli) kullanıcı adını içeriyor. Geçerse tek işlemde: şifre yazılır,
  `sifreDegismeli` kalkar, BU oturum dışındaki bütün oturumlar (okul rolleri ve cihaz anahtarları dahil) kapanır,
  yöneticiyse bütün `/admin` çerezleri silinir. Cevap `{ user, yonetimAdresi? }` — şifresini başkası vermiş
  yönetici çerezini ilk kez burada alır.
- **`POST /api/profile`** — gövde alanları hepsi isteğe bağlı: `fullName` (en az iki kelime), `tc`, `address`
  (200), `district` (60), `city` (yalnız `CITIES` içindeyse; değilse sessizce yok sayılır), `dogum`
  (`dogumSorunu`), `tema` (`sistem`/`acik`/`koyu`). Okul rolündeyken yetişkin hesabına yazılır; ad değişince okul
  rolü satırları da güncellenir, tema bulunulan rol satırına da yazılır. T.C.: okulun açtığı okul hesabında
  değiştirilemez ("okul yönetimi düzenler"); hesap başına günde 5 değişiklik (429); başkasında varsa "kullanılamıyor"
  (`alan: 'tc'`). Önce hepsi doğrulanır, sonra tek işlemde yazılır → `{ user }`.
- **`GET /api/notifications?surum=`** — 30 saniyede bir yoklanır. Kutu değişmediyse (`surum` aynı)
  `{ ayni: true, surum, unread }`; değiştiyse son 100 bildirim: `{ notifications, unread, surum }`.
- **`POST /api/notifications/read`** — kişinin bütün bildirimlerini okundu yapar.

## Kimle konuşur?

- Çağırdıkları:
  - `../guvenlik` ([guvenlik.md](../guvenlik.md)) — bot sorusu (`botSoruUret`, `botCevapDogru`, `botSoruTuket`), hız
    ve hata sayaçları (`hizSinir`, `hataSay`, `hataSiniriDoldu`, `kayitSayaci`), giriş sınırları (`girisIpEngeli`,
    `girisKilitSn`, `girisSoruLazim`, `girisHatasi`, `girisBasarili`, `girisTanidik`, `kalanDeneme`), iki adımlı kod
    (`girisKodlari`, `girisKoduGonder`, `girisKoduDogrula`), şifre sıfırlama (`sifirlamaGonder`, `sifirlamaKayit`,
    `sifirlamaTemizle`), e-posta onayı (`onayBaglantisiGonder`, `kodOzeti`, `ONAY_OMRU_MS`, `epostaAlaniVarMi`,
    `epostaMaskele`), `istemciIp`, `istekAnahtari`;
  - `../http` ([http.md](../http.md)) — `bad`, `ok`, `sendJSON`;
  - `../iliskiler` ([iliskiler.md](../iliskiler.md)) — `childrenOf`;
  - `../okullar` ([okullar.md](../okullar.md)) — `okulAra`, `okulArama`, `okulVeri`;
  - `../ortak` ([ortak.md](../ortak.md)) — doğrulayıcılar ve düzleyiciler (`normEmail`, `normKullaniciAdi`,
    `normTc`, `normTelefon`, `sifreSorunu`, `tcSorunu`, `telefonSorunu`, `epostaSorunu`, `kullaniciAdiSorunu`,
    `dogumSorunu`, `gucluSifreli`, `okulHesabiMi`, `adDuzelt`, `clean`, `uid`, `now`, `CITIES`, `SUBJECTS`,
    `EPOSTA_DESENI`);
  - `../sifre` ([sifre.md](../sifre.md)) — `hashPw`, `verifyPw`;
  - `../yetki` ([yetki.md](../yetki.md)) — `pub`;
  - `../site` ([site.md](../site.md)) — `istemciAyarlari` (`bildirimAralikDk`);
  - `../yonetim-cerezi` ([yonetim-cerezi.md](../yonetim-cerezi.md)) — `yoneticiMi`, `cerezVer`, `cerezSil`,
    `YONETIM_ADRESI`;
  - `../yardimci/bulanik-arama` — `AramaDizini`, `sade` (okul adresi araması; belgesi henüz yok:
    `sunucu/yardimci/bulanik-arama.js`);
  - bölümler: `./islem-kaydi` (`islemYaz`), `./ozellikler` (`kullanicininKapalilari`), `./okul-sayfasi`
    (`okulSayfasiGorunumu`);
  - `../veri` — `depo`, `islem`, `cakisma`.
- Veri tabloları (depo işlevleri, `sunucu/veri/depo/*.js`):
  - `depo.kullanicilar` → `kullanicilar` (okumalar `okullar` ile birleşir, özel rol için `roller`,
    `rol_yetkileri`, `rol_yetki_kapsamlari`; `cocuklari` → `veli_baglari`): `bul`, `epostayla`, `girisKimligiyle`,
    `epostaVarMi`, `kullaniciAdiHerhangiYerde`, `bosKullaniciAdi`, `tcVarMi`, `ogrenciTcIle`, `yeniKisiKodu`,
    `ekle`, `guncelle`, `girisYazildi`, `rolleri`, `cocuklari`, `yetiskinMi`, `rolSatirlarinaKvkk`,
    `rolSatirlariniGuncelle`;
  - `depo.onaylar` → `eposta_onaylari`: `ekle`, `bul`, `sil`, `adresinkileriSil`;
  - `depo.okullar` → `okullar`: `adresliOkullar`, `kisaAdla`, `kayitIcin` (+ `kullanicilar`, müdürü var mı);
  - `depo.oturumlar` → `oturumlar`, `cihaz_anahtarlari`, `yonetim_cerezleri`: `ac`, `kapat`,
    `hesabinOturumlariniKapat`, `yonetimCerezleriniSil`;
  - `depo.genel` → `bildirimler`: `bildirimSurumu`, `bildirimleri`, `bildirimleriOkundu`;
  - `islemYaz` → `islem_kaydi`.
- Onu çağıranlar:
  - `sunucu/api.js` — `BOLUM` tablosunda `meta`, `okullar`, `okul-adres`, `schools`, `register`, `eposta-onay`,
    `challenge`, `sifre-unuttum`, `sifre-yenile`, `login`, `logout`, `me`, `kvkk-onay`, `password`, `profile`,
    `notifications` bu dosyaya gider; aydınlatma kapısı `kayit.kvkkGuncelMi`'yi kullanır;
  - [kisilik.md](kisilik.md) — `kisilikListesi`, `oturumCevabi` (portala geçiş, çocuk ekleme);
  - `sunucu/bolumler/cihaz.js` — `kvkkGuncelMi` (cihaz anahtarlı uçlar oturum kapılarından geçmediği için kendisi
    bakar).
- Ön yüz (`public/js/parcalar/`): `05-giris.js` (challenge, register, login, login/dogrula, login/tekrar,
  sifre-unuttum, sifre-yenile, meta), `05a-dis-sayfalar.js` (okul-adres, okul-adres/ara), `08b-rolsuz.js`
  (okullar/iller, okullar/ara), `05b-sifre-zorunlu.js` ve `25-tiklama.js` (password; ikincisi kvkk-onay ve profile
  de), `24-bildirim-arama-mobil.js` (notifications), `26-baslat.js` (me, meta, logout, eposta-onay),
  `08c-kisilikler.js` (me), `19f-roller.js` (meta).
- Android uygulaması (`Egitim-Evi-App`): `GirisSayfasi` (login, okul-adres/ara), `KodSayfasi` (login/dogrula,
  login/tekrar), `KayitSayfasi` (register), `DogrulamaSorusu` ve `AileEkrani` (challenge), `SifremiUnuttumSayfasi`,
  `SifreSayfasi` (password), `KvkkSayfasi` (kvkk-onay), `EkleSayfasi` (me), `BildirimlerSayfasi`, `Sayfa`,
  `AnaEkran` (notifications), `AnaEkran`/`AileEkrani` (logout). Uygulama girişte `uygulama: true` gönderir.
  `AileEkrani` (çocuğun telefonunu bağlayan ekran) da `POST /api/login` çağırır ve kimliği hâlâ ESKİ adla,
  `email` alanında gönderir; iki adımlı cevap (`twoFactor`) gelirse "öğrenci hesabıyla girilir" der. Bu yüzden
  girişteki `body.email` yedeği kaldırılmamalı.

## Nasıl çalışır (adım adım)?

Kayıt:

```
POST /api/register ─ soru, ad, e-posta, kullanıcı adı, şifre, telefon, T.C., onay denetimi
      │  (hata: 400 { error, alan }, soru harcanmaz)
      ▼
eposta_onaylari'na bekleyen kayıt (şifre özeti, 24 saat) + adrese bağlantı
      │  kişi postadaki bağlantıya tıklar (26-baslat.js)
      ▼
POST /api/eposta-onay { token } → satır silinir (tek kullanım) → çakışma yoksa kullanicilar'a
rolsüz, onaylı hesap + kişi kodu → "Hesabın açıldı. Kullanıcı adın: ..."
```

Giriş (`POST /api/login`):

```
1. kimlik ve şifre boş mu?                           → 400 (sayılmaz)
2. body.okul (okul adresi) → okulId
3. girisIpEngeli(ip)                                 → 429
4. girisKimligiyle(kimlik, okulId)
     e-posta: yalnız e-postayla; kullanıcı adı: önce yetişkin/veli/yönetici,
     okul adresinden gelindiyse o okulun hesabı (11 haneli sayıysa T.C.'den de);
     tutan birden çok okulda ve okul seçilmemişse   → 400 okulSec
5. kilit anahtarı 'giris:<ip>:<hesap>' → girisKilitSn  → 429 kilitli
6. girisSoruLazim → soru cevabı yanlış/eksik          → 400 soruGerekli
7. şifre asıl hesapta, tutmazsa "yedek" hesapta denenir
     tutmadı → girisHatasi, 401 (hesapYok ya da kalanHak)
8. asıl hesapla girdiyse sayaç sıfırlanır (yedekle girdiyse sıfırlanmaz)
9. rejected → 403; pending → 403 bekliyor
10. girisTanidik(ip, hesap)  (bu bağlantı artık hesabın tanıdığı)
11. öğrenci ya da e-postasız → girisOturumu (oturum hemen)
    öteki → girisKoduGonder → { twoFactor, challengeId } → 2. adım /login/dogrula
```

Oturum yeri (`girisOturumu`) yukarıda "İç işlevler"de. Açılan oturumun anahtarı cevaba, SHA-256 özeti
`oturumlar` tablosuna gider.

Şifremi unuttum: `sifre-unuttum` (her zaman aynı cevap) → postadaki bağlantı → `sifre-yenile` (bellekteki anahtar,
tek kullanım, bütün oturumlar kapanır).

## Dikkat!

- **Hesap yok / şifre yanlış ayrı söylenir.** Bilerek: kayıt formu zaten "bu e-posta kayıtlı" diyor, yani hesabın
  varlığı gizli değil. Tahmine karşı koruma kilitler ve doğrulama sorusudur. Buna karşılık `sifre-unuttum` her
  durumda aynı cevabı verir; yoksa kullanıcı adı/adres doğrulama aracına dönerdi.
- **Kilit anahtarı hesabın kendisi** (`giris:<ip>:<hesap kimliği>`): e-posta ile kullanıcı adını sırayla deneyerek
  5 hatalık kilit ikiye katlanamaz. Hesap bulunamazsa anahtar `okulId:kimlik`'tir.
- **Yedek hesap.** Kullanıcı adı hem bir yetişkin hesabında hem bir okulda varsa şifre ikisinde de denenir. Yedekle
  girildiyse asıl hesabın hata sayacı sıfırlanmaz: yoksa biri yedeği bilerek öteki hesabın kilidini
  sıfırlayabilirdi.
- **Okul ağı.** Bir okulun bütün öğrencileri tek IP'den gelir; bu yüzden bağlantı sınırları bol (okul-adres 3000/dk,
  challenge 1500/10 dk, sifre-yenile 30/15 dk, kayıtta 60 hesap/saat) ve asıl koruma hesap başınadır. Sınırlar
  commit 524'te büyütüldü; `testler/test-okul-agi.js` 300 öğrenciyle dener. Sınırı küçültmeden önce o testi oku.
- **Doğrulama sorusu kayıtta yalnız hesap açılınca harcanır**; başka bir alan hatalıysa aynı soru geçerli kalır. T.C.
  çakışmasında ise harcanır (`yeniSoru: true`), IP başına saatte 10 çakışma: "bu numara kayıtlı mı" diye deneme
  yapılamasın.
- **E-posta onay anahtarı tek kullanımlık**: satırı silen istek devam eder; aynı anda iki tık gelirse ikincisi
  "geçersiz" alır. Aynı adla bekleyen iki kayıt aynı anda onaylanırsa tekil indeks birini durdurur (`23505` →
  `cakisma`), kullanıcı açık bir ileti alır, 500 çıkmaz.
- **Bellekte duranlar.** Giriş kodları (`girisKodlari`, 5 dakika) ve şifre sıfırlama anahtarları (`sifirlamaKayit`,
  1 saat) `guvenlik.js`'te bellekte tutulur: sunucu yeniden başlarsa bekleyen kodlar ve sıfırlama bağlantıları
  geçersiz olur. E-posta onayları ise veritabanında (`eposta_onaylari`, 24 saat), yeniden başlatmaya dayanır.
- **Şifre değişince** (`password`) bu oturum dışındaki her şey kapanır; `sifre-yenile`'de bu oturum dahil hepsi.
  İkisinde de `hesabinOturumlariniKapat` telefonun cihaz anahtarlarını (`cihaz_anahtarlari`) da siler: uygulama
  yeniden girip anahtar almalıdır.
- **`sifre-yenile` sunucu konsoluna** "Şifre sıfırlandı: <e-posta> (N oturum kapatıldı)" yazar; sunucu günlüğü bu
  yüzden kişisel veri taşır.
- **`sifreDegismeli`** (şifresini okul ya da yönetici vermiş) yetişkin hesabında oturum her zaman yetişkin
  hesabında açılır; kişi kendi şifresini koymadan portala geçemez (kapı [api.md](../api.md)'de).
- **İki adımlı giriş öğrenciye ve e-postası olmayan hesaba uygulanmaz** (okulun açtığı servisçi, eski hesaplar):
  şifre doğruysa oturum hemen açılır.
- **Bilinen hata:** `GET /api/okullar/iller` cevabında `tipler` hep boş gelir, çünkü `okullar.js` `okulVeri`'yi
  `null` iken dışa verir (ayrıntı [okullar.md](../okullar.md)). Ön yüzdeki (`08b-rolsuz.js`) okul türü seçimi bu
  yüzden boş kalır.
- `okullar/ara`'daki yorum "53 bin kayıt" der; güncel liste ~67 bin okul.
- `GET /api/schools` bugün ön yüzde kullanılmıyor (yalnız `testler/seed.js`); kaldırmadan önce seed'i değiştir.
- `register` dışa açık ama başka dosya çağırmıyor; `benimGorunum` ve `KVKK_SURUM` da dışa açık, bugün yalnız bu
  dosyada kullanılıyor.
- `KVKK_SURUM`'u artırırsan giriş yapmış herkes (yönetici hariç) bir sonraki istekte `403 kvkkGerek` alır ve onay
  penceresini görür; aydınlatma metnini (`public/kvkk/`) aynı işte güncelle.

## Testleri

- `testler/test-giris-kayit.js` — kaydın e-posta onayı beklemesi, onaysız girişin olmaması, uydurma ve ikinci kez
  kullanılan onay anahtarı, kullanıcı adı ya da e-postayla (büyük harfle) giriş, boş kimlik, "hesap yok" ile "şifre
  yanlış" iletileri, kalan hak, beşinci yanlışta kilit (öbür kimlikle de), doğrulama sorusunun yalnız hesap açılınca
  harcanması, kayıtta gönderilen rolün yok sayılması, T.C. no'nun yalnız kişiye gitmesi ve okulun açtığı hesapta
  profilden değişmemesi, şifre değişince öbür oturumun kapanması, `sifre-unuttum`'da kullanıcı adı → `alan: email`,
  kayıtta T.C. çakışmasının soruyu harcaması (aynı soruyla ikinci deneme olmaz), e-posta değişikliğinin bağlantıya
  tıklanana kadar beklemesi (`eposta-onay`'ın `tur: 'eposta'` kolu), okul araması.
- `testler/test-sifre.js` — şifremi unuttum akışı uçtan uca (sunucu e-posta ayarlı değilken sıfırlama anahtarını
  günlüğe yazar, test oradan okur).
- `testler/test-cakisma.js` — aynı e-posta/kullanıcı adı/T.C.'nin kayıt ve e-posta onayında yarışla (Promise.all)
  bile çift hesap açamaması, doğru `alan` bayrağı, 500 çıkmaması.
- `testler/guvenlik-test.js` — doğrulama sorusu (cevap istemciye sızmıyor, soru ikinci kez kullanılamıyor), kısa ve
  rakamsız şifrenin kayıtta reddi, hatalı denemelerden sonra kilit (kilitliyken doğru şifre de 429), iki adımlı
  kodla giriş.
- `testler/test-okul-agi.js` — 300 öğrencinin tek IP'den sayfa açılışı (okul-adres, login, me, notifications…)
  429/503 almadan; tek kötü niyetli kişinin (şifre taraması, sel) yine durması.
- `testler/test-yetiskin.js` — portallar (`portallar`, `hesapAktif`), tek portalda doğrudan giriş, şifre ve
  kişisel bilgilerin yetişkin hesabına yazılması.
- `testler/test-bildirim.js` — `notifications` sürüm yoklaması (değişiklik yoksa liste gitmez).
- `testler/test-admin-gizli.js` — yöneticinin girişte, `/api/me`'de ve şifre değişiminde `yonetimAdresi` ve yeni
  çerez alması (şifre değişince eski çerezin geçersiz olması), öğretmen ve öğrencinin almaması; yöneticinin çıkışında
  çerezin silinmesi (`Max-Age=0`), öğretmenin çıkışında silme başlığı olmaması.
- `testler/yetki-denetimi.js`, `testler/girdi-denetimi.js` — rol × uç ve bozuk girdi.
- Elle: sunucuyu 3200'de aç, `curl http://localhost:3200/api/challenge`; tarayıcıda kayıt ol. E-posta ayarlı değilse
  onay bağlantısı ve giriş kodu sunucu penceresine yazılır. Hazır hesaplar `testler/seed.js`'te (ör. kullanıcı adı
  `mudur`).

## Son durum

- 2026-10-02: `KVKK_SURUM` 1.14 → 1.15. Aydınlatma metni T.C. kimlik numarasını bütün hesaplarda zorunlu yazıyor (amacı:
  tek kişi tek hesap, veli–çocuk bağı, okul değişikliği; her yerde geçerlilik kuralı). Kod henüz değişmedi: kayıtta ve
  Ayarlar'da yetişkin için alan hâlâ "isteğe bağlı". Zorunlu hâle getiren kod Linux oturumunda yazılacak
  (tanımı: `.claude/gelistirme/tanimlar/spec-ogrenci-portal.md` sonu, git dışında). Herkes yeniden onaylar.
- Önceki commit `commit 543` (2026-09-30): `KVKK_SURUM` 1.13 → 1.14. Aydınlatma metni (1. bölüm ve telefon bildirimi
  maddesi), giriş ekranındaki gizlilik notu ve "Bu sistem hakkında" penceresi verilerin "okulun (kendi) sunucusunda"
  durduğunu söylüyordu; doğrusu Eğitim Evi'nin sunucusu, her okulun verisi ayrı. Herkes yeniden onaylar.
- Ondan önce `566b917 commit 524` (2026-09-27, canlı hazırlık): `KVKK_SURUM` 1.12 → 1.13 (ödev teslim dosyaları,
  50 MB, saklama süreleri). Okul ağı için sınırlar büyüdü: okul-adres 300 → 3000/dk, challenge 300 → 1500/10 dk,
  sifre-unuttum 5 → 20/15 dk, sifre-yenile 10 → 30/15 dk. Girişteki eski `kilitliMi`/`basarisizDeneme`/
  `soruGerekliMi` yerine `guvenlik.js`'in yeni giriş sınırları (`girisIpEngeli`, `girisKilitSn`, `girisSoruLazim`,
  `girisHatasi`, `girisBasarili`, `girisTanidik`) geldi: hesaba her yerden 20 hatada hesap tanımadığı bağlantılara
  kilitlenir, sahibi tanıdık bağlantısından girer; şifre sıfırlanınca kilit kalkar. Soru hiç gösterilmediyse
  "yanlış" yerine "cevapla" denir.
- `153d63d commit 522`: yalnız sürüm yorumunda kişi kodunun uzunluğu ("15 karakter") silindi (kod 16 haneye geçti).
- `276c0a0 commit 521`: `yonetimAlanlari` (yöneticinin `/admin` çerezi girişte, `/api/me`'de ve şifre
  değişiminde), çıkışta çerez silme, `istemciAyarlari` cevaplara eklendi; e-posta onayında çakışmalar alanlı ileti
  aldı ve anahtar "silen devam eder" kuralıyla tek kullanımlık oldu.
- Açık iş: `tipler` hatası (asıl düzeltme `okullar.js`'te; DEVAM'daki 3. iş "Güvenlik denetimi" sırasında
  düzeltilecek). Sıradaki işlerden "Güvenlik denetimi" (IPv6 /64 anahtarı, okulun verdiği her şifrede ilk girişte
  değiştirme) ve "Sistem" (yöneticiye zorunlu TOTP, yeni cihaz uyarısı, açık oturumlar) bu dosyanın giriş akışına
  dokunacak.
