# araclar/deneme-okulu.js

Elle denemek için tek komutla hazır bir okul kurar: "Deneme Ortaokulu", aynı okula bağlı müdür, öğretmen, öğrenci, veli,
servisçi ve henüz rolü olmayan bir yetişkin; sonunda kimin hangi kullanıcı adıyla gireceğini ve her rolün oturum anahtarını yazar.

## Bu dosya ne yapar?

Siteyi kendi ellerinle tıklayarak denemek istediğinde (ör. müdür bir öğrenciyi sınıfa koysun, veli servis kartına baksın,
rolsüz biri "Veli kodu gir" ekranını görsün) önce bir okul ve birbirine bağlı hesaplar gerekir. Bunları formlardan tek tek
açmak uzun sürer: yetişkin kaydı, e-posta onay bağlantısı, yöneticinin okulu açıp kişiyi kişi koduyla müdür yapması, müdürün
öğretmeni kişi koduyla eklemesi, öğrenci ve servisçi hesapları, velinin veli koduyla bağlanması, servis… Bu araç hepsini
iki saniyede yapar.

Önemli olan, hesapların **gerçek uçlardan** (API) geçmesi: bot sorusu, aydınlatma metni onayı, e-posta onay bağlantısı ve iki
adımlı giriş kodu gerçek bir kullanıcıda nasıl işliyorsa burada da öyle işler. Tek kestirme yöneticinin "Okul aç" adımıdır:
araçta yönetici şifresi olmadığı için okul ve müdür rol satırı doğrudan veritabanına yazılır.

Araç ikinci kez çalıştırılınca var olan hesaplara dokunmaz, eksik olanı tamamlamaya çalışır ("Dikkat!"te bunun sınırları var).
Testler ve öteki araçlar bu dosyayı kullanmaz; yalnız elle çalıştırılır. Benzer görünen ama başka işe yarayan dosyalar:
`testler/seed.js` (test paketlerinin "Test Ortaokulu" verisi), `araclar/zengin-veri.js` ve [gorsel-veri.md](gorsel-veri.md)
(ekran turunun verisi). Bu araç onlardan bağımsızdır; hatta aynı veritabanında onlarla birlikte çalışamaz (bkz. "Dikkat!").

## İçinde neler var?

### Sabitler

- `SIFRE` — bütün deneme hesaplarının ortak şifresi. Yetişkin hesabındaki güçlü şifre kuralına uyar (büyük ve küçük harf,
  rakam, özel karakter). Değeri dosyanın başındaki yorumda ve sabitte yazılı; araç sonunda ekrana da basar.
- `ESKI_SIFRE` — güçlü şifre kuralı gelmeden önce açılmış eski deneme hesaplarının şifresi. `gir` önce `SIFRE`'yi, olmazsa
  bunu dener.
- `OKUL` — `{ ad: 'Deneme Ortaokulu', il: 'Ankara', ilce: 'Çankaya' }`. Okulun kısa adı (adresi) buradan türetilir:
  normalde `deneme-ortaokulu`, yani okul sayfası `/school/deneme-ortaokulu`.
- `HESAP` — altı uydurma kişi (adlar ve `0532111…` telefonları test verisidir):

  | Anahtar | Kullanıcı adı | Ne olur | E-posta |
  |---|---|---|---|
  | `mudur` | `mudur` | yetişkin hesabı + okulun müdür rol satırı (okul onaylı) | var |
  | `ogretmen` | `ogretmen` | yetişkin hesabı; müdür kişi koduyla Matematik öğretmeni olarak ekler | var |
  | `ogrenci` | `ogrenci` | müdürün açtığı öğrenci hesabı, **sınıfsız**, doğum tarihi 2013-04-12 | var |
  | `veli` | `veli` | yetişkin hesabı; öğrencinin veli koduyla ona bağlanır | var |
  | `yeni` | `yeni.veli` | yetişkin hesabı, **rolsüz** (çocuğunu henüz bağlamamış) | var |
  | `servisci` | `servisci` | müdürün açtığı servisçi hesabı, "1. Servis"in şoförü | yok |

  E-posta adresleri `deneme.test` uzantılıdır. Bu bilinçli bir seçim: `.test` uzantısına sunucu hiçbir zaman e-posta göndermez
  (`TESLIMSIZ_UZANTI`, [../sunucu/guvenlik.md](../sunucu/guvenlik.md)), giriş kodu ve onay anahtarı her zaman sunucu
  günlüğüne yazılır. Böylece araç, e-postası ayarlı bir sunucuda bile kodu günlükten okuyabilir.
- `OKUL_KONUM` (Kızılay çevresi) ve `EV_KONUM` — okulun ve öğrencinin evinin deneme koordinatları (servis haritası için).

### İşlevler

- `gir(eposta)` — [giris.md](giris.md)'deki `girisYap` ile `SIFRE`'yle girer; 401 ya da 400 alırsa `ESKI_SIFRE`'yle bir kez
  daha dener (başka bir hata aynen yukarı atılır). Cevapta `kvkkGuncel === false` ise `POST /api/kvkk-onay { onay: true }`
  gönderir: aydınlatma metni yenilendiyse deneme hesabının onayını araç verir (gerçek kullanıcı girişte onay penceresini
  görür). Dönen: giriş cevabı (`token`, `user`…).
- `hesap(h)` — e-postasıyla veritabanında arar (`depo.kullanicilar.epostayla`); varsa olduğu gibi döner. Yoksa
  `hesapAc` ile rolsüz yetişkin hesabı açar (kayıt + günlükteki onay anahtarıyla e-posta onayı) ve yeni satırı döner.
- Ana akış (adsız `async` işlev, dosya yüklenince çalışır) — altı adım; ayrıntısı "Nasıl çalışır"da. Hata olursa
  `HATA: <ileti>` yazar, veritabanı havuzunu kapatır ve `process.exit(1)` çağırır. (Bu bilgisayarda — Windows, Node
  24.19.0 — çıkış 1 değil 127 oluyor; bkz. "Dikkat!".)

Dışa açılan bir şey yok (`module.exports` yok); dosya yalnız komut satırından çalışır.

### Çıktı

```
Deneme okulu hazır: Deneme Ortaokulu (Ankara / Çankaya)
  Müdür     mudur         <ad soyad>
  Öğretmen  ogretmen      <ad soyad> (Matematik)
  Öğrenci   ogrenci       <ad soyad> (sınıfsız, veli kodu XXXX-XXXX-XXXX-XXXX)
  Veli      veli          <ad soyad> (öğrenciye bağlı)
  Servisçi  servisci      <ad soyad> (1. Servis)
  Rolsüz    yeni.veli     <ad soyad> (veli adayı, çocuğu bağlı değil)
  Şifre     <ortak şifre>   (girişte kullanıcı adı ya da e-posta)
  Okul adresi: /school/deneme-ortaokulu
OTURUMLAR {"mudur":"…","ogretmen":"…","ogrenci":"…","veli":"…","rolsuz":"…"}
```

Kullanıcı adları sabitten değil veritabanından okunur (`kadi`): eski düzende açılmış hesaplarda kullanıcı adı e-postadan
türetilmiş olabilir, ekrana gerçeği yazılsın diye. Servisçinin satırı ise sabitten yazılır. `OTURUMLAR` satırı tarayıcı
sekmelerini hazır açmak için düşünülmüş; depoda onu okuyan bir betik yok. Servisçinin anahtarı bu satırda yoktur.

## Kimle konuşur?

- **Çağırdıkları (`require`):**
  - [giris.md](giris.md) — `iste` (JSON isteği), `girisYap` (iki adımlı giriş, kod günlükten), `hesapAc` (yetişkin kaydı +
    e-posta onayı), `okulHesabi` (öğretmeni kişi koduyla ekletir; öğrenci ve servisçi hesabını açar).
  - [../sunucu/ayarlar.md](../sunucu/ayarlar.md) — `ayarlariYukle()`: `ayarlar.json`'u okur (veri klasörü `EE_DATA` ile
    değişir); veritabanı ayarı buradan gelir.
  - [../sunucu/veri/baglanti.md](../sunucu/veri/baglanti.md) — `islem` (okul + müdür satırı birlikte yazılsın), `kapat`.
  - [../sunucu/veri/index.md](../sunucu/veri/index.md) — `depo` ve `okulKisaAdiBul` (okulun kısa adı: `deneme-ortaokulu`,
    alınmışsa ilçeli ya da sayılı biçim).
  - [../sunucu/ortak.md](../sunucu/ortak.md) — `kisiKoduBicim` (veli kodunu 4'erli tireli yazar), `now`, `uid`.
- **Doğrudan kullandığı depo işlevleri:** [../sunucu/veri/depo/kullanicilar.md](../sunucu/veri/depo/kullanicilar.md)
  (`epostayla`, `bul`, `rolleri`, `yeniKisiKodu`, `ekle`, `okuldaBosAd`, `eslesmeKoduYaz`, `guncelle`, `kullaniciAdiyla`) ve
  [../sunucu/veri/depo/okullar.md](../sunucu/veri/depo/okullar.md) (`cakisan`, `ekle`, `durumYaz`, `bul`). Dokunduğu tablolar:
  `okullar` ve `kullanicilar`; geri kalan her şey API üzerinden yazılır.
- **Çağırdığı uçlar** (kendisi ve `giris.js` üzerinden):

  | Uç | Ne için | Bölüm |
  |---|---|---|
  | `GET /api/challenge`, `POST /api/register`, `POST /api/eposta-onay` | yetişkin kaydı ve onayı | [../sunucu/bolumler/kayit.md](../sunucu/bolumler/kayit.md) |
  | `POST /api/login`, `POST /api/login/dogrula`, `POST /api/kvkk-onay`, `POST /api/logout` | giriş, aydınlatma onayı | [../sunucu/bolumler/kayit.md](../sunucu/bolumler/kayit.md) |
  | `GET /api/kisilikler` | öğretmenin kendi kişi kodu | [../sunucu/bolumler/kisilik.md](../sunucu/bolumler/kisilik.md) |
  | `POST /api/school/ogretmen-ekle`, `POST /api/school/hesap-ac`, `POST /api/school/konum` | öğretmen ekleme, öğrenci/servisçi hesabı, okulun konumu | [../sunucu/bolumler/hesaplar.md](../sunucu/bolumler/hesaplar.md) (`okul.js` devreder) |
  | `GET /api/parent/children`, `POST /api/parent/link` | velinin çocuğu var mı, veli koduyla bağlama | [../sunucu/bolumler/veli.md](../sunucu/bolumler/veli.md) |
  | `GET /api/servis`, `POST /api/servis/kaydet`, `POST /api/servis/ogrenci`, `POST /api/servis/ev` | servis, öğrencinin durağı, ev konumu | [../sunucu/bolumler/okul-hayati.md](../sunucu/bolumler/okul-hayati.md) |

- **Onu kullanan:** yok. Hiçbir dosya `require` etmez, `package.json`'da komutu yok. Başka belgelerde adı geçer:
  [../sunucu/bolumler/yonetici-okul.md](../sunucu/bolumler/yonetici-okul.md) ("aynı işi doğrudan veritabanında yapar"),
  [../sunucu/veri/depo/okullar.md](../sunucu/veri/depo/okullar.md), [../sunucu/veri/depo/kullanicilar.md](../sunucu/veri/depo/kullanicilar.md),
  [../sunucu/veri/baglanti.md](../sunucu/veri/baglanti.md), [../sunucu/veri/index.md](../sunucu/veri/index.md),
  [../sunucu/ayarlar.md](../sunucu/ayarlar.md), [../sunucu/ortak.md](../sunucu/ortak.md), [giris.md](giris.md) ve
  [../TANITIM.md](../TANITIM.md)'nin araçlar listesi.

## Nasıl çalışır (adım adım)?

```
ayarlariYukle() → veritabanı ayarı (EE_DATA/ayarlar.json ya da DATABASE_URL)
1) Müdür     hesap(mudur)  ── yoksa /api/register + /api/eposta-onay
             müdür rol satırı var mı? (eski düzende hesabın kendisi müdür olabilir)
               yoksa VERİTABANINDA, tek işlemde:
                 okul yoksa ekle (kısa ad okulKisaAdiBul ile, durum 'approved'), varsa durumu 'approved'
                 müdür rol satırı (anaHesapId = yetişkin hesabı, okulda boş kullanıcı adı, branş 'Müdür')
                 yetişkinin kişi kodunu yenile (eslesmeKoduYaz)
             satır ya da okul onaylı değilse onaylı yap
             M = gir(müdür)                     → müdür rolünde oturum
2) Öğretmen  e-postayla yoksa okulHesabi(M, 'teacher') → kendi kaydı, kişi kodu, /api/school/ogretmen-ekle (Matematik)
3) Öğrenci   e-postayla yoksa okulHesabi(M, 'student') → /api/school/hesap-ac (sınıfsız, rastgele geçerli T.C.)
4) Veli      hesap(veli); V = gir(veli); çocuğu yoksa /api/parent/link { code: öğrencinin veli kodu }
5) Servisçi  okulda kullanıcı adıyla yoksa okulHesabi(M, 'servisci')
             "1. Servis" yoksa: servis (plaka, şoför = servisçi, 07:30 / 15:40) → öğrenciyi "Kızılay" durağıyla ekle
                                → okulun konumu → öğrencinin ev konumu
6) Rolsüz    hesap(yeni)
O, S, Y = gir(öğretmen / öğrenci / rolsüz) → özet tablo + OTURUMLAR → havuzu kapat
```

### Çalıştırma

Dosyanın başındaki yorum aracı varsayılan ayarlarla (`node sunucu/index.js > sunucu.log`, sonra
`EE_LOG=sunucu.log node araclar/deneme-okulu.js`) çalıştırmayı anlatır. O yol **3000 portuna** ve `data/` klasörünün
gösterdiği **gerçek veritabanına** gider; bu projede ikisine de dokunulmaz. Güvenli yol, boş bir test veritabanıyla açılmış
3200 sunucusu ve aynı veri klasörü (proje kökünden; sunucu satırı `testler/tumtest.sh`'teki `sunucu_baslat`'ın benzeri):

```
# 1) Boş test veritabanıyla sunucu (seed.js'i ÇALIŞTIRMA)
EE_DATA=testler/testdata EE_DB_SIFIRLA=1 EE_PUSH_GONDERME=0 EE_DIS_ISTEK=0 PORT=3200 node server.js > testler/test-sunucu.log 2>&1 &
# 2) Araç: AYNI veri klasörü, aynı sunucu, aynı günlük
EE_DATA=testler/testdata EE_BASE=http://localhost:3200 EE_LOG=testler/test-sunucu.log node araclar/deneme-okulu.js
# 3) Tarayıcıda http://localhost:3200/school/deneme-ortaokulu ya da /login; işin bitince sunucuyu kapat
```

Yetişkinler (müdür, öğretmen, veli, rolsüz) girişte iki adımlı kod ister; kod e-postaya değil sunucu günlüğüne
("GIRIS KODU" bloğu) yazılır. Öğrenci ve servisçi kod istemez (öğrencide ve e-postası olmayan hesapta iki adımlı giriş yok).
`testler/testdata/` depoya girmez; bir sonraki tam test her paketten önce test veritabanını zaten sıfırlar.

## Dikkat!

- **İki kanal, aynı hedef olmalı.** Araç hem HTTP ile sunucuya (`EE_BASE`; verilmezse `http://localhost:3000`) hem de
  doğrudan veritabanına (`EE_DATA` altındaki `ayarlar.json` ya da `DATABASE_URL`; verilmezse `data/`) gider. İkisi aynı
  sunucunun veritabanını göstermezse müdür satırı bir veritabanına, öteki hesaplar başka birine yazılır ve araç müdür
  girişinde ya da öğretmen eklemede düşer. Araçta `yuk-testi.js`'teki gibi bir "yalnız `_test`" koruması yok; varsayılanlarla
  kullanıcının gerçek veritabanına yazar. Bu projede her zaman yukarıdaki `EE_DATA` + `EE_BASE` ikilisiyle çalıştır.
- **`seed.js`'in verisiyle aynı veritabanında çalışmaz.** Yetişkin hesaplarının kullanıcı adı bütün sitede tektir
  (`kullanicilar_kadi_genel`). `seed.js` de `mudur` kullanıcı adlı bir yetişkin açtığı için bu araç ilk adımda
  "kayıt (…): Bu kullanıcı adı alınmış" diye durur. 2 Ekim'de iki yönden denendi: aracın açtığı `mudur` dururken başka bir
  e-postayla `mudur` adı kaydedilemedi; `seed.js` + `zengin-veri.js` + `gorsel-veri.js` çalışmış test veritabanında araç
  ilk adımda "HATA: kayıt (mudur@deneme.test): Bu kullanıcı adı alınmış. Başka bir ad dene." yazıp durdu. Yani ya boş bir
  veritabanı ya da seed çalışmamış bir veritabanı gerekir.
- **Hata yolunda çıkış kodu 127.** 2 Ekim'de bu bilgisayarda (Windows, Node 24.19.0) yukarıdaki hatada `HATA:` satırından
  sonra `Assertion failed: !(handle->flags & UV_HANDLE_CLOSING), file src\win\async.c, line 94` satırı düştü ve süreç 1 değil
  127 koduyla bitti; iki kez denendi, ikisinde de aynı. `catch` havuzu kapatıp hemen `process.exit(1)` çağırıyor; süreç
  kapanırken Node'un alt katmanındaki (libuv) bir iç denetim tetikleniyor. Nedeni denetlenmedi. Kod yine sıfırdan farklı
  olduğu için hata anlaşılır; ama çıkışı tam olarak `1` diye denetleyen bir betik yazma. Başarılı çalışmada çıkış 0'dır.
- **Okul açma, yöneticinin `/api/admin/okul-ac`'ı ile birebir aynı değil** ([../sunucu/bolumler/yonetici-okul.md](../sunucu/bolumler/yonetici-okul.md)):
  kişi kodu sorulmaz ve denetlenmez, yalnız yetişkine yenisi yazılır (uç eski kodu tüketip yenisini yazar); işlem kaydına
  `okul.acildi` düşmez; müdüre "okulunun müdürü olarak eklendin" bildirimi gitmez; disk sınırı verilemez (boş kalır, site
  varsayılanı geçerli olur — uç da `diskMb` verilmezse aynısını yapar); sunucunun 30 saniyelik okul adresi önbelleği boşaltılmaz (adres az önce tarayıcıda denendiyse en çok 30 sn "Okul bulunamadı" görünebilir). Aynı il ve adla bir okul
  zaten varsa (`cakisan`) o okul onaylanıp kullanılır ve **müdürü olup olmadığına bakılmadan** ikinci bir müdür rol satırı
  eklenir; uç bunu "Bu okul zaten kayıtlı ve müdürü var" diye reddederdi.
- **"Eksik olanı tamamlar" her durumda doğru değil.**
  - Öğretmen adımı yalnız yetişkin hesabının e-postasına bakar. Önceki çalışma hesap açıldıktan sonra ama `ogretmen-ekle`'den
    önce düştüyse hesap vardır, adım atlanır, öğretmen okula hiç eklenmez; özet yine "(Matematik)" yazar.
  - Servis adımında öğrencinin servise eklenmesi, okulun konumu ve ev konumu yalnız "1. Servis" o çalışmada yeni açıldıysa
    yapılır; ayrıca bu üç isteğin cevabına bakılmaz (hata sessiz kalır).
- **Servisçinin onay girişi okul adresi vermeden yapılır.** `okulHesabi` hesabı açtıktan sonra servisçiyle `servisci`
  kullanıcı adı üzerinden girip aydınlatma metnini onaylatır, ama okulun kısa adını göndermez. Başka bir okulda da `servisci`
  adlı bir okul hesabı varsa giriş "Bu kullanıcı adı birden çok okulda var" (400) alır ve araç durur (koda bakılarak; boş
  veritabanında sorun çıkmadı).
- **Müdür tek rollü kalmalı.** Müdür uçları `M` oturumuyla çağrılır; bu, yetişkin hesabının tek portalı olduğu için girişin
  doğrudan müdür rolüne inmesine dayanır. Aynı hesaba elle başka bir rol ya da velilik eklersen girişte rol seçimi çıkar;
  araç rol seçmez ([gorsel-veri.md](gorsel-veri.md)'deki `roleGir` gibi bir adımı yok) ve okul uçları reddedebilir.
  (Koddan çıkarım; denenmedi.)
- **Oturum anahtarları ve şifre ekrana düz yazılır.** `OTURUMLAR` satırındaki her anahtar 7 gün geçerlidir
  (`OTURUM_OMRU_MS`); onu bilen o hesaba girer. Çıktıyı bir yere yapıştırma, commit'leme.
- **Öğrenci bilerek sınıfsız.** "Sınıf aç → öğrenciyi yerleştir" akışını kendin deneyebilesin diye. T.C. kimlik numarası
  rastgele ama algoritmaya uyan bir sayıdır (`tcUret`), gerçek bir kişiye ait değildir.
- **Eski şifre denemesi bir hatalı giriş sayılır.** Eski şifreli hesapta önce yeni şifre denenir; sunucu bunu hatalı deneme
  olarak sayar, ardından eski şifreyle başarılı giriş sayacı sıfırlar. Normal kullanımda kilide yol açmaz.
- **Gerçek kişi adı yok.** `HESAP`'taki adlar ve telefonlar uydurmadır; depo herkese açık, öyle kalmalı.

## Testleri

- Bu aracı çalıştıran ya da yükleyen otomatik test yok; `tumtest.sh` ona dokunmaz.
- Kullandığı uçlar test paketlerinde ayrı ayrı denenir: kayıt ve e-posta onayı `testler/test-giris-kayit.js`; kişi koduyla
  öğretmen ekleme ve yetişkin hesabı `testler/test-yetiskin.js`, `testler/test-kisi-kodu.js`; veli bağları
  `testler/test-veli-coklu.js`; servis `testler/test-okul-hayati.js`, `testler/test-servis-yoklama.js`; okulun ve evin
  konumu (`/api/school/konum`, `/api/servis/ev`) `testler/test-servis-konum.js`; yöneticinin okul açması (bu aracın
  veritabanında taklit ettiği) `testler/test-kisi-kodu.js`, `testler/test-yetiskin.js` ve `testler/seed.js`'in `mudurYap` adımı.
- Elle (2 Ekim'de böyle denendi): "Çalıştırma"daki gibi boş test veritabanıyla 3200'ü aç, aracı çalıştır → yaklaşık 2 sn'de
  özet tablo çıkmalı ve çıkış kodu 0 olmalı; aracı ikinci kez çalıştır → yine hatasız aynı tablo (yeni hesap açılmaz). Sonra
  tarayıcıda `/school/deneme-ortaokulu`'dan `ogrenci` ile gir; müdürle girip öğrenciyi bir sınıfa yerleştir; `yeni.veli` ile
  girip veli kodu ekranını gör. Bitince sunucuyu kapat.

## Son durum

- `git log --follow`: 4 commit. Dosya parça parça yazıldı: `0c178e3 commit 289` (2026-09-25; yalnız baştaki açıklama
  yorumu), `af957d0 commit 290` (2026-09-25; `require`'lar, sabitler, `gir`, `hesap`), `db1bf80 commit 321` (2026-09-26;
  ana akışın altı adımı ve özet).
- Son değişiklik `0acca75 commit 516` (2026-09-27, kişi kodu ve portallar işi): müdür başvurusu kalktığı için 1. adım
  `POST /api/okul-basvurusu` + yönetici onayı yerine okulu ve müdür rol satırını doğrudan veritabanında yazar hâle geldi
  (`okulKisaAdiBul`, `yeniKisiKodu`, `eslesmeKoduYaz` ile); okul adresi `/deneme-ortaokulu`'dan `/school/deneme-ortaokulu`'ya;
  özetteki veli kodu elle bölünmek yerine `kisiKoduBicim` ile yazılır oldu; yorumlarda "eşleme kodu/müdür koduyla" →
  "kişi koduyla". O günden beri değişmedi; 2 Ekim'de boş test veritabanında iki kez hatasız çalıştı.
- Bilinen açıklar ("Dikkat!"te, kod değiştirilmedi): öğretmen ve servis adımlarındaki tamamlama boşlukları, var olan okula
  ikinci müdür eklenebilmesi, okul adresi olmadan yapılan servisçi girişi, `_test` korumasının olmaması, hata yolunda
  çıkış kodunun 127 olması.
- Planlı işlerden bu dosyayı etkileyecekler: "T.C. kimlik no bütün hesaplarda zorunlu" (yetişkin kaydı T.C. isteyince
  `hesapAc` çağrıları değişmeli); "Tek kişi tek hesap + portallar öğrencide de" (kullanıcı adı ve e-posta kuralları, öğrenci
  portalı); "Çalışan olarak ekleme" (kişi koduyla eklenen kişi rolsüz gelecek, öğretmen rolünü müdür ayrıca verecek: 2. adım
  değişir); "Güvenlik denetimi" içindeki "okulun verdiği her şifrede ilk girişte değiştirme" (öğrenci ve servisçi ilk girişte
  şifre değiştirmeye zorlanırsa `okulHesabi`'nin onay girişi ve bu aracın `gir` çağrıları buna göre değişmeli).
