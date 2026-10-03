# testler/test-kisi-kodu.js

Kişi kodunu (öğrencide veli kodu) her katmanda deneyen paket: kodun biçimi ve sadeleştirilmesi (sunucusuz), ön yüzdeki kod
kutusunun tuş tuş davranışı (tarayıcısız taklit), veli/öğretmen/müdür eklemede kodun kullanımı, yöneticinin kişi bulması,
portallar, veritabanı kısıtı, açılışta kod doldurma ve hız sınırları (63 denetim).

## Bu dosya ne yapar?

Eğitim Evi'nde başvuru ve onay yok; insanları birbirine **kişi kodu** bağlar ([../sunucu/ortak.md](../sunucu/ortak.md)):

- Öğrencinin kodu **veli kodudur**: veli onu girince çocuğu hesabına eklenir. Kod kullanılınca yenilenmez (anne de baba da aynı
  kodla ekler); okul isterse yeniler.
- Yetişkinin kodu tek kullanımlıktır: öğretmen kodunu müdüre verir, müdür onu okula ekler; okulunu açtırmak isteyen kişi kodunu
  yöneticiye verir, yönetici okulu açıp onu müdür yapar. Her kullanımda kod aynı işlemde yenilenir; kişi "Yeni kod üret"
  diyebilir.
- Kod 16 karakterdir: büyük harf, küçük harf, rakam ve `! ? # * + =`'den her birinden en az biri; karışan karakterler
  (`I L O l o 0 1`), tire ve Türkçe harf yok; ilk karakter harf. Ekranda 4'erli dört grup ve aralarında tire görünür
  (`Ab3#-kQx9-+mPt-7?zR`); tire kodun parçası değil ayırıcıdır. Harf duyarlıdır.
- Servisçide ve sistem yöneticisinde kod yoktur; portal (rol seçimi) yalnız yetişkin hesabında ve okul rolü satırındadır.

Bu kadar kural tek bir yerde bozulursa kimse çocuğunu ekleyemez ya da biri başkasının koduyla müdür olur. Paket bu yüzden her
katmanı ayrı ayrı dener: önce sunucudaki saf işlevleri, sonra ön yüzdeki kod kutusunu (`05-giris.js`'in kişi kodu bölümünü
küçük bir taklit tarayıcıda çalıştırarak), sonra gerçek uçları, en sonda veritabanının biçim kısıtını ve hız sınırlarını.

Dosya başı yorumu sözünü şöyle özetliyor: biçim (16 karakter, sınıflar, karışan karakter yok), harf duyarlılık ve ayırıcıların
silinmesi, eski 10 ve 15 haneli kodun geçmemesi; yetişkin kodu tek kullanımlık, veli kodu yenilenmez; `GET /api/kisilikler`
yan etkisiz; yönetici kişi koduyla kişi bulur, yalnız yönetici, hız sınırlı; okul açarken kod yenilenir; yöneticiye ve okul
hesabına müdürlük verilemez; eski başvuru uçları yok; portallar yalnız yetişkinde ve rol satırında; kod kutusunda tire
kendiliğinden gelir. **Veritabanı adımları yalnız adı `_test` ile biten veritabanında çalışır.**

## İçinde neler var?

### Yardımcılar

- `kontrol(ad, sart, detay)`, `J(x)` (240 harflik JSON).
- Alfabe sabitleri: `BUYUK` (`ABCDEFGHJKMNPQRSTUVWXYZ`), `KUCUK` (`abcdefghijkmnpqrstuvwxyz`), `RAKAM` (`23456789`), `OZEL`
  (`!?#*+=`), `ALFABE` (dördü birden) — sunucudakinden bağımsız yazılmış ikinci bir kopya; ikisi ayrışırsa 1. bölüm kalır.
- Yapıştırma biçimleri: `bosluklu(k)` (4'erli, araya iki boşluk, sekme, baş ve sonda boşluk), `tireli(k)` (ekrandaki biçim),
  `karisik(k)` (boşluk ve tire karışık, sonda satır sonu), `tersHarf(k)` (harflerin büyük/küçüğü ters).
- `GORUNMEZLI` — örnek kodun karakterleri arasına serpiştirilmiş görünmez karakterler ve tire benzerleri: U+200B, U+2060,
  U+FE63 (küçük tire), U+FF0D (tam genişlikli tire), U+00AD (yumuşak tire), U+200C, U+200D, U+FEFF ve sonda U+00A0, U+202F,
  U+3000 (bölünmez, dar ve geniş boşluklar).
- `testDeposu()` — `EE_DATA`'yı `testler/testdata`'ya çevirir, ayarları yükler; bağlanılacak veritabanının adı `_test` ile
  bitmiyorsa `null`, bitiyorsa `{ baglanti, kullanicilar }` (bağlantı ve kullanıcı deposu) döner. `null`'da veritabanı
  adımları "ATLANDI" yazıp atlanır.
- `kodKutusu()` — ön yüzün kod kutusunu tarayıcısız çalıştırır (aşağıda ayrıntısı).
- Ortak yardımcılar [giris.md](giris.md) üzerinden ([../araclar/giris.md](../araclar/giris.md)): `iste`, `girisYap`, `hesapAc`,
  `kisiKodu`, `okulHesabi` (`tcUret` içe aktarılır ama kullanılmaz). Sunucudan doğrudan: `kisiKoduUret`, `kisiKoduSade`,
  `kisiKoduBicim`, `KISI_KODU_DESENI` (`sunucu/ortak.js`).

### `kodKutusu()` — taklit tarayıcıda kod kutusu

`public/js/parcalar/05-giris.js` okunur; `/* Kişi kodu (öğrencininki veli kodudur)` yorumuyla `/* Sunucudaki okul aramasıyla aynı
sadeleştirme` yorumu arasındaki bölüm `vm` içinde çalıştırılır. Bölümün gördüğü dünya bir taklittir: `document`
(`activeElement`, `addEventListener`, `createEvent`), `window`, `esc`, `$`. Tek bir sahte kutu var: `INPUT`, `kisi-kodu-girdi`
sınıfı, `value`, `selectionStart/End`, `setSelectionRange`, `dispatchEvent`. Kutunun en çok kaç karakter aldığı (`EN_COK`) ön
yüzün kendi `kisiKoduGirdisi()` HTML'indeki `maxlength`'ten okunur (19). Taklit, tarayıcının yaptığını elle yapar:

| İşlev | Ne yapar |
|---|---|
| `yaz(metin)` | karakter karakter, imleç yerine yazar; `maxlength` doluysa yazmaz; her karakterde `input` (`insertText`) |
| `geri(kez)` | geri tuşu: imleçten önceki karakteri (seçim varsa seçimi) siler, `deleteContentBackward` |
| `sil()` | Delete: imleçten sonrakini siler, `deleteContentForward` |
| `yapistir(metin)` | `paste` olayı; kod engellemezse (`preventDefault` yoksa) tarayıcı gibi `maxlength`'e sığanı yapıştırır, `insertFromPaste` |
| `birlestirerekYaz(parcalar, sira)` | telefon klavyesi gibi (IME): harf/rakam dizisi harf harf büyür, her adımda `isComposing` ile `input`; `chrome` sırası son `input`'u `compositionend`'den önce, `firefox` sonra gönderir; işaretler tek tek yazılır |
| `bosalt()`, `imlecKoy(a, b)` | kutuyu boşaltıp `focusin` gönderir; imleci (ya da seçimi) koyar |
| `deger`, `imlec`, `duyulan` | kutunun değeri, imleç yeri, kutuyu dinleyen "öteki kodların" duyduğu `input` sayısı |

### 1) Biçim — sunucusuz (10)

- `kisiKoduUret` ile 3000 kod: hepsi 16 karakter ve harfle başlıyor; yalnız alfabeden (karışan karakter, tire, Türkçe harf, boşluk
  yok); her birinde dört sınıftan en az biri; hepsi farklı; alfabenin her karakteri en az bir kodda çıkıyor.
- `kisiKoduBicim('Ab3#kQx9+mPt7?zR')` → `Ab3#-kQx9-+mPt-7?zR`.
- `kisiKoduSade`: tireli, boşluklu, karışık, düz ve U+2010 / U+2013 / U+2212 çizgili yazım aynı koda iner; harf durumu korunur.
  `GORUNMEZLI` de aynı koda iner.
- Geçersizler `''` döner: eski 10 haneli (`ABCDEFGH23`, `ABCDE-FGH23`), 15 karakterlik (bitişik ve 5'erli), içinde gerçek tire
  olan 16'lık (tire silinince 15 kalır), 17 karakterlik, `0` ya da `ş` içeren, `+` ya da `=` ile başlayan, nesne (`{}`).
- `KISI_KODU_DESENI`: özel karakteri olmayan 16'lık geçersiz; `=` özel karakter sayılır.

### 1b) Kod kutusu: tire kendiliğinden gelir (17)

Örnek kod `Ab3#kQx9+mPt7?zR` ile:

- Ön yüzün `kisiKoduBicim` ve `kisiKoduSade`'si ilk 300 üretilmiş kodda sunucununkiyle aynı sonucu veriyor.
- `kisiKoduKutusu(kod)` Kopyala düğmesine (`data-kod`) ve `<code>`'a tireli biçimi koyuyor; kutu en çok 19 karakter.
- `kisiKoduDenetle`: eksik kodda "16 karakterdir" uyarısı, tireli ve boşluklu tam kodda uyarı yok.
- Yazarken: 4. karakterde `Ab3#`, 5.'de `Ab3#-k`, 9.'da `Ab3#-kQx9-+`, sonda `Ab3#-kQx9-+mPt-7?zR`, imleç 19 (sonda tire kalmaz).
  Dolu kutuya `X` yazılmaz.
- Silerken: sondan bir geri → `…-7?z`; üç geri daha → `Ab3#-kQx9-+mPt` (grup boşalınca tire de gider), imleç 14.
- Tirenin hemen ardında (imleç 5) geri tuşu tireden önceki karakteri siler → `Ab3k-Qx9+-mPt7-?zR`, imleç 3. Tirenin hemen
  önünde (imleç 4) Delete tireden sonrakini siler → `Ab3#-Qx9+-mPt7-?zR`, imleç 4. Grup ortasında (imleç 7) geri →
  `Ab3#-kx9+-mPt7-?zR`, imleç 6.
- İlk 15 karakter yazılıyken imleç 2'ye `W` → `AbW3-#kQx-9+mP-t7?z`, imleç 3.
- Yapıştırma: tireli, tiresiz, boşluklu, karışık, başı-sonu boşluklu ve fazla uzun (`…XYZ`) metnin hepsi
  `Ab3#-kQx9-+mPt-7?zR`'ye, imleç 19'a gidiyor ve kutuyu dinleyen öteki kodlar bir `input` duyuyor.
- `Ab` yaz, `3#kQx9` yapıştır, `+m` yaz → `Ab3#-kQx9-+m`, imleç 12. Seçili kodun üstüne başka bir tam kod yapıştırınca yenisi
  geçiyor. İçinde yazı varken tam kod yapıştırınca kutuda yalnız o kalıyor.
- Metnin içinden kod ayıklama: `Veli kodu: <kod>`, `Kodun <kod> olarak görünür.`, `Kod Abcd <kod>`, satırlara bölünmüş
  bildirim, tırnak içinde kod ve `GORUNMEZLI` — hepsinden yalnız kod alınıyor.
- Ön yüzde `kisiKoduSade(GORUNMEZLI)` örnek kod; `kisiKoduAyikla` 4 karakterlik, özel karaktersiz ve fazla uzun metinde `''`.
- **Ayırıcı kümesi her karakterde aynı:** örnek kodun ortasına (8. karakterden sonra) 0–0xFFFF arasındaki her UTF-16 birimi
  tek tek konur; ön yüz ve sunucu "bu karakter ayırıcı mı?" sorusuna 65.536 durumun hepsinde aynı cevabı vermeli. (İki dosyada
  aynı küme ayrı ayrı yazılı; bu denetim ikisini birbirine bağlar.)

### 1c) Kod kutusu: telefon klavyesi birleştirerek yazınca (5)

Her iki olay sırası (`chrome`, `firefox`) için:

| Klavyenin gönderdiği parçalar | Kutuda beklenen |
|---|---|
| `Ab3`, `#`, `kQx9`, `+`, `mPt7`, `?`, `zR` | `Ab3#-kQx9-+mPt-7?zR` |
| `Abcdefgh23` | `Abcd-efgh-23` |
| `Abcd`, `2`, `#`, `efgh` | `Abcd-2#ef-gh` |
| `Abcdefghjk`, `#`, `mnpqrstu` | `Abcd-efgh-jk#m-npqr` (16'yı aşan kesilir) |

Harfler çoğalmamalı, tireler birleştirme bitince gelmeli, imleç sonda olmalı (sıra başına 1 denetim). Ayrıca `Ab3#kQx9`
yazılıyken imleç 5'e birleştirerek `ZZ` → `Ab3#-ZZkQ-x9`, imleç 7 (sıra başına 1). Son olarak `chrome` sırasıyla yazdıktan sonra
geri tuşu olağan çalışıyor → `Ab3#-kQx`, imleç 8 (1).

### 2) Veli kodu: iki veli aynı kodla, harf duyarlı (7)

- Okulun öğrenci listesinde `ogrenci1`'in kodu geçerli biçimde. Öğrenci girişte ve `GET /api/me`'de kendi kodunu görüyor,
  girişte `portallar` yok.
- Yeni iki rolsüz yetişkin (`anne<z>`, `baba<z>`). `POST /api/kisilik/cocuk` ile eski 10 haneli kod, kodun ilk 15 karakteri ve
  harfi ters çevrilmiş kod → üçü de 400.
- Anne tireli, baba boşluklu biçimle aynı kodu girer → ikisi de 200 ve ikisinin listesinde birer çocuk; kod yenilenmedi.
- Annenin `GET /api/me`'sinde `hesapAktif === true` ve tek portal: `tur: 'veli'`, çocuğun kimliği, `alt` çocuğun adı.
- Müdür `POST /api/school/student-code-reset` → yeni geçerli kod; eski kodla `POST /api/parent/link` (Fen öğretmeninin
  oturumuyla) → 400.

### 3) Yetişkinin kişi kodu (8)

- Yeni yetişkin "Kodlu Öğretmen" (`kodogt<z>`): `GET /api/kisilikler` iki kez → ikisinde aynı geçerli `kisiKodu`, `ogretmenKodu`
  alanı yok (okumak kod yazmaz).
- `GET /api/school/ogretmen-bul?kod=` → 404 (arama yalnız `POST`: kod adres satırına yazılmasın).
- `POST /api/school/ogretmen-bul`: harfi ters kod ve eski biçim → 404; boşluklu ve karışık yazım → 200, `kisi.ad` maskeli
  (her sözcüğün ilk iki harfi, gerisi yıldız: `Ko*** Öğ******`) ve ikisinde aynı.
- `POST /api/kisilik/kod` ("Yeni kod üret") → yeni geçerli kod; eskisiyle arama 404.
- Müdür `POST /api/school/ogretmen-ekle { kod: <tireli yeni kod>, brans: 'Türkçe' }` → 200; kişinin kodu aynı işlemde yenilendi;
  aynı kodla ikinci ekleme 404.
- Okulun açtığı servisçi (`okulHesabi(müdür, 'servisci', …)`, "Kodsuz Servisçi"): girişte `code` yok, `portallar` yok,
  `GET /api/kisilikler` 403.
- Yöneticinin `GET /api/me`'sinde `portallar` yok.

### 4) Eski uçlar yok (1)

`POST /api/okul-basvurusu` (müdür), `GET /api/admin/pending` ve `POST /api/admin/decide` (yönetici) → üçü de 404.

### 5) Yönetici kişi koduyla kişi bulur (4)

- Yeni yetişkin "Kodlu Müdür" (`kodmudur<z>`). Yönetici `POST /api/admin/kisi-bul { kod: <tireli> }` → 200: tam ad,
  kullanıcı adı, `rolSayisi === 0`, e-posta ilk iki harf + `****` + alan adı.
- Aynı uç müdürle ve kişinin kendisiyle → 404 (yönetici olmayana uç yokmuş gibi davranılır).
- Kimsede olmayan kod, öğrencinin (yenilenmiş) veli kodu ve harfi ters kod → 404 "Bu kodla bir hesap yok".
- Kişi bulmak kodu harcamıyor (kişinin `kisiKodu`'su aynı).

### 6) Okul aç: kişi koduyla müdür (5)

- `POST /api/admin/okul-ac` (okul "Kod Okulu <z>", Ankara / Mamak, adres `kod-okulu-<z>`) öğrencinin veli koduyla → 404,
  `alan: 'mudurKodu'`.
- (Yalnız test veritabanında) yöneticinin ve servisçinin `eslesmeKodu`'na depo üzerinden birer kod yazılır; yöneticinin koduyla
  okul açmak (`alan: 'mudurKodu'`) ve kişi bulmak, servisçinin koduyla okul açmak → üçü de 400 (yönetici ve okul hesabı müdür
  yapılamaz); kodlar sonra boşaltılır.
- Kodlu Müdür'ün boşluklu koduyla okul açılır → 200; cevapta okulun adresi ve müdürün adı; kişinin kodu yenilendi.
- Kişiye bildirim: "Kod Okulu … okulunun müdürü olarak eklendin. Sol üstteki menüden okuluna geçebilirsin."
- Kişi yeniden girince tek portalı olduğu için doğrudan müdür: `user.role === 'principal'`, `hesapAktif === false`, tek portal
  `ad: 'Müdür'`, `alt: 'Kod Okulu <z>'`, `aktif: true`.

### 7) Veritabanı: biçim kısıtı ve açılışta kod doldurma (4) — yalnız test veritabanında

- Depo üzerinden yazılmaya çalışılan eski 10 haneli veli kodu, rakamla başlayan kişi kodu, 15 karakterlik veli kodu ve tire içeren
  kişi kodu → dördü de `23514` (CHECK kısıtı, şema 032).
- `ogrenci1`'in ve annenin kodu ve servisçinin kodu boşaltılır; `eksikKodlariDoldur()` → tam 2 (öğrenci + yetişkin); ikisine
  geçerli kod geldi; servisçi ve Kodlu Müdür'ün okul rol satırı kodsuz kaldı. İkinci çağrı → 0.
- Eski usul bekleyen öğretmen başvurusu taklit edilir: yeni yetişkin `redogt<z>` depo üzerinden `teacher` / `pending` /
  kodsuz yapılır; müdür `POST /api/school/teacher-decide { approve: false }` → 200; kişi rolsüz kaldı, kişi kodu hemen
  üretildi ve `GET /api/kisilikler` aynı kodu gösteriyor. Ardından veritabanı bağlantısı kapatılır.

### 8) Hız sınırları — en sonda, sayaçlar dolduğu için (2)

- Yönetici aynı geçerli kodla en çok 35 kez kişi bulur: ilk 429, 21. ile 31. deneme arasında gelmeli (yönetici başına dakikada
  30; aynı dakikadaki önceki aramalar da sayılır).
- Yönetici en çok 35 kez rastgele (kimsede olmayan) kodla okul açmaya kalkar: iletisinde "yanlış kod" geçen 429 en geç 31.
  denemede gelmeli (aynı bağlantıdan saatte 30 yanlış kod; kişi bulma ve okul açma birlikte sayılır).

Toplam 10 + 17 + 5 + 7 + 8 + 1 + 4 + 5 + 4 + 2 = 63. Sonunda boş satır ve `GECTI: 63   KALDI: 0`; `KALDI` varsa çıkış kodu
1. Beklenmeyen hata `  TEST HATASI: <yığın>` olarak (öbür paketlerden farklı olarak `console.log` ile) yazılır, çıkış kodu 1.

## Kimle konuşur?

- **Modüller** (paket sunucu kodunu doğrudan da yükler):

  | Modül | Ne için |
  |---|---|
  | [giris.md](giris.md) (`araclar/giris.js`) | istek, giriş, kayıt, kişi kodu, okul hesabı |
  | [../sunucu/ortak.md](../sunucu/ortak.md) | `kisiKoduUret`, `kisiKoduSade`, `kisiKoduBicim`, `KISI_KODU_DESENI` |
  | [../public/js/parcalar/05-giris.md](../public/js/parcalar/05-giris.md) | kişi kodu bölümü: `kisiKoduSade`, `kisiKoduBicim`, `kisiKoduAyikla`, `kisiKoduKutusu`, `kisiKoduGirdisi`, `kisiKoduDenetle` ve kutunun `focusin` / `input` / `compositionstart` / `compositionend` / `paste` dinleyicileri |
  | [../sunucu/ayarlar.md](../sunucu/ayarlar.md) | `ayarlariYukle` (`testler/testdata/ayarlar.json`) |
  | [../sunucu/veri/baglanti.md](../sunucu/veri/baglanti.md) | `veritabaniAdi`, `kapat` |
  | [../sunucu/veri/depo/kullanicilar.md](../sunucu/veri/depo/kullanicilar.md) | `eslesmeKoduYaz`, `guncelle`, `eksikKodlariDoldur`, `bul` |

- **Sunucu uçları:**

  | Uç | Ne için | Belge |
  |---|---|---|
  | `GET /api/kisilikler`, `POST /api/kisilik/kod`, `POST /api/kisilik/cocuk` | kişi kodu, yeni kod, veli kodu girme | [../sunucu/bolumler/kisilik.md](../sunucu/bolumler/kisilik.md) |
  | `POST /api/parent/link` | eski veli kodunun reddi | [../sunucu/bolumler/veli.md](../sunucu/bolumler/veli.md) |
  | `POST /api/school/ogretmen-bul`, `POST /api/school/ogretmen-ekle`, `POST /api/school/hesap-ac` (servisçi) | öğretmeni kodla ekleme | [../sunucu/bolumler/hesaplar.md](../sunucu/bolumler/hesaplar.md) |
  | `GET /api/school/students`, `POST /api/school/student-code-reset`, `POST /api/school/teacher-decide` | veli kodu, yenileme, eski başvuru | [../sunucu/bolumler/okul.md](../sunucu/bolumler/okul.md) |
  | `POST /api/admin/kisi-bul`, `POST /api/admin/okul-ac` | yöneticinin kişi bulması, okul açma | [../sunucu/bolumler/yonetici-okul.md](../sunucu/bolumler/yonetici-okul.md) |
  | `GET /api/me`, `GET /api/notifications`, giriş ve kayıt uçları | portallar, bildirim, hesaplar | [../sunucu/bolumler/kayit.md](../sunucu/bolumler/kayit.md) |
  | `POST /api/okul-basvurusu`, `GET /api/admin/pending`, `POST /api/admin/decide` | artık olmaması gereken uçlar | [../sunucu/api.md](../sunucu/api.md) (yönetici olmayana `/api/admin/…` bilinmeyen adresle aynı 404) |

- **Koruduğu kod:** `sunucu/ortak.js`'in kişi kodu bölümü ve `public/js/parcalar/05-giris.js`'in kişi kodu bölümü (ikisinin
  ayırıcı kümesi birbirine bağlı); `kisilik.js` (`kisilikler` yan etkisiz, `kod`, `cocuk`), `veli.js`'in `cocukBagla`'sı,
  `hesaplar.js` (`ogretmen-bul` / `ogretmen-ekle`: maskeli ad, kodun aynı işlemde harcanması, hız ve yanlış kod sayacı),
  `okul.js` (`student-code-reset`, `teacher-decide`'ın reddi), `yonetici-okul.js` (`kodunSahibi`, `kisiBul`, `epostaKisalt`,
  `okulAc`), depo `kullanicilar.js` (`eslesmeKoduSahibi`, `eslesmeKoduTuket`, `yeniKisiKodu`, `eksikKodlariDoldur`), açılışta
  kod dolduran [../sunucu/veri/index.md](../sunucu/veri/index.md), şema 027 ve 032 ([../sunucu/veri/sema/SEMA.md](../sunucu/veri/sema/SEMA.md)),
  yönetici uçlarını gizleyen `api.js`, sayaçlar `hizSinir` / `hataSay` ([../sunucu/guvenlik.md](../sunucu/guvenlik.md)).
- **Tablolar:** `kullanicilar` (`veli_kodu`, `eslesme_kodu` ve CHECK kısıtları), `veli_baglari`, `okullar`, `bildirimler`,
  `oturumlar`, `eposta_onaylari`.
- **Ön yüzde kodu kullanan öbür parçalar** (bu pakette denenmez, yalnız `05-giris.js`'in bölümü çalışır):
  [../public/js/parcalar/08c-kisilikler.md](../public/js/parcalar/08c-kisilikler.md) ("+ Ekle": veli kodu kutusu, kendi kişi
  kodun ve "Yeni kod üret"), [../public/js/parcalar/10b-hesaplar.md](../public/js/parcalar/10b-hesaplar.md) (öğrencinin veli
  kodu, kodla ekleme kutusu), [../public/js/parcalar/23-veli-ayarlar.md](../public/js/parcalar/23-veli-ayarlar.md) (veli kodu
  girme, öğrencinin kendi kodu), [../public/js/yonetim/09-yonetici.md](../public/js/yonetim/09-yonetici.md) (yöneticinin okul
  açma formundaki kod kutusu).
- **Onu çalıştıran:** `testler/tumtest.sh`, sunuculu döngüde `test-yetiskin`'den sonra, `test-etut`'tan önce; her paketten önce
  [test-ayarlari.md](test-ayarlari.md) `testler/testdata/ayarlar.json`'u yazar, sunucu sıfırlanmış veritabanıyla açılır ve
  [seed.md](seed.md) çalışır.

## Nasıl çalışır (adım adım)?

```
1)  sunucusuz: 3000 kod üret ─► biçim ; Bicim / Sade / DESENI
1b) 05-giris.js kişi kodu bölümü ─► vm (taklit document + kutu)
       yaz / geri / sil / yapistir ─► tire, imleç, ayıklama ; 65.536 karakterde ayırıcı kararı = sunucu
1c) birlestirerekYaz (chrome / firefox sırası) ─► harf çoğalmıyor, tire sonra
A (yönetici), M (müdür) girer
2)  ogrenci1'in veli kodu ─► anne (tireli) + baba (boşluklu) ekler ; kod yenilenmez ; okul yeniler ─► eski kod 400
3)  kodogt: kisilikler ×2 aynı ; ogretmen-bul (POST) maskeli ; Yeni kod ; ogretmen-ekle ─► kod yenilendi ; servisçi kodsuz
4)  eski başvuru uçları 404
5)  kodmudur: kisi-bul (yalnız yönetici) ; yok / veli kodu / ters harf 404 ; kodu harcamaz
6)  okul-ac: veli koduyla 404 ; [test DB] yönetici/servisçi koduyla 400 ; doğru kodla 200 ─► bildirim ─► doğrudan müdür
7)  [test DB] CHECK 23514 ×4 ; kodları boşalt ─► eksikKodlariDoldur = 2, sonra 0 ; eski başvuru reddi ─► kod hemen ; kapat()
8)  kisi-bul ×35 ─► 429 (21..31) ; yanlış kodla okul-ac ×35 ─► "yanlış kod" 429 (≤ 31)
```

## Dikkat!

- **Paket `05-giris.js`'teki iki yoruma bağlı.** Kod kutusu bölümü dosyadan `/* Kişi kodu (öğrencininki veli kodudur)` ile
  `/* Sunucudaki okul aramasıyla aynı sadeleştirme` yorumları arasından kesilir. Bu yorumlardan biri değişir ya da yeri
  kayarsa paket "05-giris.js içinde kişi kodu bölümü bulunamadı" ile `TEST HATASI` verir. Bölüm ayrıca kendi kendine yetmeli:
  taklit dünyada yalnız `document`, `window`, `esc` ve `$` var; bölüm başka bir ön yüz işlevini (ör. `api`) çağırmaya başlarsa
  `vm` içinde `ReferenceError` olur.
- **Taklit tarayıcı gerçek tarayıcı değil.** `maxlength`, olay sırası ve telefon klavyesinin birleştirmesi elle modellenmiş
  (`addEventListener`'ın yakalama evresi bile yok sayılır: dinleyiciler eklenme sırasıyla çalışır). Gerçek bir tarayıcıda ya
  da telefonda bu kutuyu deneyen bir paket yok.
- **Android denetlenmez.** Hem `ortak.js` hem `05-giris.js` yorumu ayırıcı kümesinin Android'deki `KisiKodu.java` ile aynı
  olduğunu söyler; bu paket yalnız ön yüz ile sunucuyu birbirine bağlar.
- **Veritabanı adımları sessizce atlanabilir.** `testler/testdata/ayarlar.json` `_test` ile biten bir veritabanını göstermiyorsa
  6. bölümün depo kısmı ve 7. bölüm "ATLANDI" yazar; 5 denetim düşer ve paket `GECTI: 58` ile yine geçer. `tumtest.sh` eksik
  sayıyı fark etmez. Koruma bilinçli: paket gerçek veritabanına asla doğrudan yazmaz. Atlama yalnız adın `_test` ile
  bitmemesine bağlıdır: ad doğru ama veritabanına bağlanılamıyorsa atlanmaz, ilk depo çağrısı hata fırlatır ve paket
  `TEST HATASI` ile durur (koddan).
- **`EE_DATA` sırası kırılgan** ([test-cakisma.md](test-cakisma.md)'daki gibi): `testDeposu()` ortam değişkenini `sunucu/ayarlar`
  ilk kez yüklenmeden önce değiştirir. Dosyanın başındaki `require`'lar (`araclar/giris.js`, `sunucu/ortak.js`) bugün
  `yollar.js`'i yüklemediği için çalışıyor; başa onu yükleyen bir modül eklenirse ayarlar gerçek `data/`'dan okunur, koruma
  devreye girer ve veritabanı adımları atlanır.
- **Taze sunucu ister.** Hız sayaçları ve yanlış kod sayacı bellekte; 8. bölüm onları bilerek doldurur (bu yüzden en sonda).
  Aynı sunucuyu yeniden başlatmadan paketi ikinci kez koşarsan 5. ve 6. bölümdeki yönetici istekleri 429 alır (yanlış kod
  sayacı bir saat sürer). 3 Ekim'de aynı sunucu ve veritabanında ikinci kez koşuldu: 5. bölümde "Çok fazla deneme", 6.
  bölümde "Çok fazla yanlış kod denendi" geldi; okul açılamadığı için zincirleme 6. bölümün bildirim ve portal denetimleri,
  7. bölümün kod doldurma denetimi ve 8. bölümün kişi bulma denetimi (ilk 429 1. denemede) de kaldı: `GECTI: 54   KALDI: 9`.
  `tumtest.sh` her paketten önce sunucuyu yeniden başlatır.
- **Hız sınırı aralıkları bilerek geniş.** Kişi bulma sayacı (yönetici başına dakikada 30) ilk aramayla başlayan bir dakikalık
  penceredir; 5. ve 6. bölümdeki aramalar aynı pencereye düşerse 429 daha erken gelir. Bu yüzden 21–31 arası kabul edilir.
  Yanlış kod sayacına (bağlantı başına saatte 30) da 5. ve 6. bölümdeki yanlış kodlar eklenir. Bugün 8. bölümden önce
  yöneticinin 5 kişi bulma araması (veritabanı adımları atlanırsa 4) ve 4 yanlış kodu (kimsede olmayan kod, öğrencinin veli
  kodu iki kez, harfi ters kod) var. 3 Ekim'de paket, testi diske dokunmadan bellekte iki günlük satırı eklenerek
  çalıştırıldı: kişi bulmada ilk 429 **26.**, yanlış kodda **27.** denemede geldi (koddan beklenenle aynı).
- **Eski usul başvuru uçtan kurulamaz.** 7. bölüm "bekleyen öğretmen başvurusu"nu veritabanına doğrudan yazarak taklit eder,
  çünkü başvuru yolu artık yok; `teacher-decide`'ın yalnız eski kayıtlar için durduğunu gösterir.
- **Seed'e bağlı:** `ogrenci1` kullanıcı adı ve e-postası, `mudur@test.com`, `fen@test.com`, yönetici şifresi (sunucu
  `EE_ADMIN_SIFRE` ile açılmış olmalı).
- **Varsayılan adres 3000.** `EE_BASE` vermeden çalıştırırsan uç istekleri kendi sunucuna gider (okul açar, kod yeniler); doğrudan
  veritabanı adımları ise `testdata` ayarı `_test`'i gösterdiği sürece yalnız test veritabanına gider. İkisi ayrışır, paket
  anlamsızlaşır; her zaman 3200'deki test sunucusunu kullan. İki adımlı kodlar ve onay anahtarları `EE_LOG`'dan okunur.
- **Ölü içe aktarım:** `tcUret` içe aktarılır ama kullanılmaz (zararsız).

## Testleri

- Bu dosyanın kendisi testtir; `testler/tumtest.sh` her tam koşuda çalıştırır. Aynı alanda: [test-giris-kayit.md](test-giris-kayit.md)
  (kayıt, giriş), `testler/test-yetiskin.js` (yetişkin hesabı ve rol geçişi), `testler/test-veli-coklu.js` (birden çok çocuk),
  [test-cakisma.md](test-cakisma.md) (kişi koduyla öğretmen eklemede yarışlar).
- Elle (Git Bash, proje kökünde; 3200'de sıfırlanmış `egitimevi_test` ile, `EE_ADMIN_SIFRE` verilerek açılmış ve
  [seed.md](seed.md) ile tohumlanmış test sunucusu varken; `testler/testdata/ayarlar.json` test veritabanını göstermeli):

  ```
  EE_BASE=http://localhost:3200 EE_LOG=testler/test-sunucu.log node testler/test-kisi-kodu.js
  ```

- 3 Ekim'de bu belge için 3200'de, yeni sıfırlanmış test veritabanı ve seed'le çalıştırıldı (belgenin denetiminde bir kez
  daha): `GECTI: 63   KALDI: 0`, çıkış 0, yaklaşık 2,5 saniye; hiçbir "ATLANDI" satırı yok (veritabanı adımları çalıştı);
  sunucu günlüğünde `API hatası` ya da `Veritabanı hatası` yok. 429'ların geldiği deneme sayıları ve ikinci koşunun sonucu
  "Dikkat!"te.

## Son durum

- `git log`: 3 commit.
  - `153d63d commit 522` (2026-09-27, kişi kodu 16 hane): beklentiler 15 karakterden 16'ya geçti; `-` alfabeden çıkıp yerine `=`
    girdi; ekrandaki biçim 5'erli boşluklu yerine 4'erli tireli oldu ve sadeleştirme tireleri de siler hâle geldi;
    `tireli`, `karisik`, `GORUNMEZLI` ve tire benzerlerinin denetimi eklendi; uç çağrıları tireli ve boşluklu biçimlerle
    yapılır oldu; 15 karakterlik eski kodun reddi ve veritabanında 15'lik ve tireli kodun `23514`'ü eklendi. 1b ve 1c bölümleri
    (`kodKutusu()` taklidi, yazma, silme, yapıştırma, 65.536 karakter karşılaştırması, telefon klavyesi) bu commit'te geldi. Aynı
    commit şema `032-kisi-kodu-16.sql`'i, `sunucu/ortak.js`'teki yeni biçimi ve `05-giris.js`'in kod kutusuna kendiliğinden
    gelen tireyi, yapıştırılan metinden kod ayıklamayı (`kisiKoduAyikla`) ve telefon klavyesi desteğini getirdi.
  - `276c0a0 commit 521` (2026-09-27, gizli `/admin`): yönetici olmayanın kişi bulma denemesinde beklenti 403'ten 404'e döndü
    (yönetici uçları artık başkasına bilinmeyen adres gibi görünüyor).
  - `0acca75 commit 516` (2026-09-27, kişi kodu ve portallar): dosya 244 satır olarak eklendi; müdür başvurusunun kalkması,
    kişi koduyla okul açma ve öğretmen ekleme, portallar ve şema `027-kisi-kodu.sql` ile birlikte.
- Bilinen açıklar (kod değiştirilmedi): kod kutusunun gerçek tarayıcıda denenmemesi, Android ayırıcı kümesinin denetlenmemesi,
  veritabanı adımlarının sessizce atlanabilmesi ("Dikkat!").
- Planlı işlerden bu dosyayı etkileyecekler:
  - **"Tek kişi tek hesap + portallar öğrencide de"** (onaylı, canlıdan önce) — 2. bölümdeki "öğrencinin portalı yok" beklentisi
    tersine döner; kullanıcı adı site genelinde tek olacak.
  - **"Çalışan olarak ekleme"** — kişi koduyla eklenen kişi rolsüz çalışan olacak; 3. bölümdeki `ogretmen-ekle` (branşla
    öğretmen) değişir.
  - **"Paneller … birden çok müdür; müdür başka müdürü onaysız atar"** — kişi koduyla müdür atamanın yönetici dışında da bir
    yolu olacak; 6. bölüme eklenmeli.
  - **"Sistem: yöneticiye zorunlu TOTP"** — yöneticinin girişi günlükteki e-posta koduyla yapılamayacak; paketin yönetici girişi
    değişmeli.
  - **"T.C. kimlik no bütün hesaplarda zorunlu"** (kod Linux'ta) — `hesapAc` ile açılan anne, baba, öğretmen, müdür ve
    `redogt` hesapları T.C. no göndermeli.
  - **"Android yerel uygulama"** — `KisiKodu.java`'nın ayırıcı kümesi için Android tarafında aynı karşılaştırma yazılabilir.
  - **"Çok dil"** — "16 karakterdir", "Bu kodla bir hesap yok", "yanlış kod" aramaları ve bildirim metni katalogdan gelirse
    gözden geçirilmeli.
