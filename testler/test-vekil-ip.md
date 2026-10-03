# testler/test-vekil-ip.js

Ters vekil (Caddy, nginx, Cloudflare) arkasında istemcinin adresini bulan `istemciIp`'i, uydurma isteklerle ve ayarı elle
değiştirerek deneyen 40 satırlık, sunucusuz test paketi (8 denetim).

## Bu dosya ne yapar?

Eğitim Evi'nin bütün hız sınırları, kaba kuvvet kilitleri ve "aynı bağlantıdan saatte en çok N" sayaçları istemcinin IP
adresine göre tutulur. Sunucu doğrudan internete açıkken bu adres bağlantının kendisinden (`req.socket.remoteAddress`)
gelir. Ama sunucu bir ters vekilin arkasındaysa her istek vekilden, yani `127.0.0.1`'den gelir; o zaman bütün ziyaretçiler
tek sayacı paylaşır ve bir okulun yaptığı birkaç hatalı giriş herkesi kilitler. Bu yüzden ayarlarda vekile güvenildiği
söylenirse (`vekil.guven: true`) gerçek adres vekilin eklediği başlıktan okunur
([../sunucu/guvenlik.md](../sunucu/guvenlik.md) → `istemciIp`; ayar [../sunucu/ayarlar.md](../sunucu/ayarlar.md)).

Burada iki tuzak var ve bu paket ikisini de dener:

1. **Vekile güvenilmiyorsa başlık yok sayılmalı.** Yoksa herkes `X-Forwarded-For` uydurup her istekte başka biri gibi
   görünür ve hız sınırını aşar.
2. **`X-Forwarded-For` zincirinin başını ziyaretçi yazabilir.** Vekil gelen başlığın SONUNA kendi gördüğü adresi ekler;
   baştaki girdiler ziyaretçinin gönderdiğidir. Bu yüzden son girdi alınmalı. (Kod eskiden ilk girdiyi alıyordu; bu
   paket o düzeltmeyle birlikte eklendi, bkz. "Son durum".)

Ayrıca IP'ye benzemeyen bir değer yok sayılmalı (sayaçlar uydurma anahtarlarla dolmasın) ve Cloudflare'in tek değer yazan
`cf-connecting-ip` başlığı seçilebilmeli.

## İçinde neler var?

### Hazırlık (dosyanın başı)

- `process.env.EE_DATA` işletim sisteminin geçici klasöründe yeni açılan boş bir `ee-vekil-XXXXXX` klasörüne çevrilir
  (`fs.mkdtempSync`). Sonra `sunucu/ayarlar.js` (→ `ayarlar` nesnesi) ve `sunucu/guvenlik.js` (→ `istemciIp`) yüklenir.
  Kodda bunun nedeni yazılı değil; etkisi şu: `guvenlik.js` yüklenirken `sunucu/veri` ve `sunucu/yollar` da yüklenir ve
  veri klasörü yüklenme anında belirlenir; böylece gerçek `data/` klasörü hiçbir şekilde işin içine girmez. `ayarlariYukle`
  çağrılmadığı için o klasöre hiçbir şey yazılmaz; `ayarlar` boş bir nesne olarak başlar, paket `ayarlar.vekil`'i elle
  doldurur.
- `kontrol(ad, sart, detay)` — `GECTI` / `KALDI` satırı, sayaçlar.
- `ip(basliklar)` — `istemciIp({ socket: { remoteAddress: '127.0.0.1' }, headers: basliklar })`: soketi hep `127.0.0.1` olan
  (yani vekilden geliyormuş gibi) uydurma bir istek.

### Denetimler (8)

| Ayar `ayarlar.vekil` | İstek başlıkları | Beklenen |
|---|---|---|
| `{ guven: false, baslik: 'x-forwarded-for' }` | `x-forwarded-for: 1.2.3.4` | `127.0.0.1` (başlık yok sayıldı) |
| `{ guven: true, baslik: 'x-forwarded-for' }` | `9.9.9.9` | `9.9.9.9` (tek girdi) |
| aynı | `1.2.3.4, 5.6.7.8` | `5.6.7.8` (vekilin eklediği son girdi) |
| aynı | `10.0.0.<i>, 5.6.7.8` (i = 0…19) | hepsi aynı tek adres (baştakini değiştirmek yeni sayaç açmaz) |
| aynı | `1.2.3.4, uydurma` | `127.0.0.1` (IP'ye benzemeyen son girdi yok sayılır, soket kalır) |
| aynı | başlık yok | `127.0.0.1` |
| aynı | `2001:db8::1` | `2001:db8::1` (IPv6) |
| `{ guven: true, baslik: 'cf-connecting-ip' }` | `cf-connecting-ip: 8.8.4.4`, `x-forwarded-for: 1.1.1.1` | `8.8.4.4` (yalnız seçilen başlık okunur) |

Sonunda boş satır ve `  GECTI: 8   KALDI: 0`; `KALDI` varsa çıkış kodu 1. Paket `async` değil; beklenmeyen hata Node'un kendi
hata çıktısıyla süreci düşürür (`TEST HATASI` satırı yok).

## Kimle konuşur?

- **Çağırdığı:** [../sunucu/guvenlik.md](../sunucu/guvenlik.md) → `istemciIp` (içinde `ipGibiMi`); [../sunucu/ayarlar.md](../sunucu/ayarlar.md)
  → `ayarlar` (yalnız `vekil` alanı elle yazılır). Yükleme sırasında dolaylı olarak `sunucu/yollar.js`
  ([../sunucu/yollar.md](../sunucu/yollar.md)) ve `sunucu/veri` de yüklenir; veritabanına bağlanılmaz.
- **Koruduğu kod:** `istemciIp` — `vekil.guven` kapalıyken soket adresi; açıkken `vekil.baslik`'taki (varsayılan
  `cf-connecting-ip`) değer virgülle bölünür, son girdi `ipGibiMi`'den geçerse alınır; `::ffff:` önekli IPv4 sadeleşir.
  Bu işlevin sonucu sunucudaki bütün IP'ye bağlı sayaçların anahtarıdır: `sunucu/index.js` ile `sunucu/bolumler/` altındaki
  `kayit`, `hesaplar`, `veli`, `okul-sayfasi`, `yonetici-okul`, `islem-kaydi` (işlem kaydındaki IP) ve `guvenlik.js`'in
  kendisi kullanır.
- **Ayarın kaynağı:** `data/ayarlar.json`'daki `vekil: { guven, baslik }` (varsayılan `guven: false`,
  `baslik: 'cf-connecting-ip'`); kurulum belgesi `belge/SUNUCUYA-KURULUM.md` Caddy arkasında nasıl açılacağını anlatır.
- **Onu çalıştıran:** `testler/tumtest.sh`'in sunucusuz paket döngüsü (`test-servis-pencere`'den sonra,
  `test-uygulama-surum`'dan önce). Sunucu, veritabanı, `EE_BASE` ya da `EE_LOG` gerekmez.

## Nasıl çalışır (adım adım)?

```
EE_DATA = <geçici klasör>/ee-vekil-XXXXXX   (boş, hiç yazılmaz)
require ayarlar.js, guvenlik.js
ayarlar.vekil = { guven: false } ─► ip(xff 1.2.3.4) == 127.0.0.1 ?
ayarlar.vekil = { guven: true, baslik: x-forwarded-for }
   ─► "9.9.9.9" ; "1.2.3.4, 5.6.7.8" → son ; 20 farklı baş → tek adres ; "…, uydurma" → soket ; boş → soket ; IPv6
ayarlar.vekil = { guven: true, baslik: cf-connecting-ip } ─► 8.8.4.4 (xff yok sayılır)
```

## Dikkat!

- **Geçici klasör geride kalır.** Paket her koşuda işletim sisteminin geçici klasöründe boş bir `ee-vekil-XXXXXX` klasörü
  açar ve silmez (bu belge için 3 Ekim'de `TEMP`/`TMP` başka bir klasöre yönlendirilerek çalıştırıldı; boş klasör orada
  kaldı). Zararsız ama birikir. Aynı yolu kullanan [test-push.md](test-push.md) ise kendi `ee-push-XXXXXX` klasörünü sonunda
  `fs.rmSync` ile siliyor; burada da paketin sonuna aynı satır eklenebilir (kod değiştirilmedi).
- **Yükleme sırası önemli.** `EE_DATA` `sunucu/` modülleri yüklenmeden ÖNCE değiştirilmeli; `yollar.js` veri klasörünü
  yüklenirken bir kez okur. Başa `sunucu/` altından bir `require` eklenirse paket gerçek `data/` klasörüne bakan
  modüllerle çalışır (bugün bir şey yazmasa da).
- **Tek vekil varsayılır.** "Son girdi" kuralı, isteğin tek bir güvenilir vekilden (Caddy) geçtiği kurulum için doğrudur
  (kod yorumu da böyle söylüyor). Önde ikinci bir vekil varsa (ör. Cloudflare + Caddy) `X-Forwarded-For`'un son girdisi
  öndeki vekilin adresi olur ve bütün ziyaretçiler yine tek sayacı paylaşır; o kurulumda başlık olarak `cf-connecting-ip`
  seçilmelidir. Bu paket zincirli kurulumu denemez.
- **`ipGibiMi` kaba bir süzgeç.** Yalnız rakam ve nokta ya da yalnız onaltılık harf, rakam, `:` ve `.` (en çok 45 karakter)
  arar; `cafe` ya da `1.2` gibi değerler de "IP gibi" sayılır. Son girdiyi güvenilen vekil yazdığı için bugün zararsız; bu
  paket yalnız açıkça bozuk bir değeri (`uydurma`) dener.
- **Denenmeyenler:** `::ffff:192.168.1.5` gibi IPv6 sarmalı IPv4 adreslerin sadeleşmesi, başlığın dizi olarak gelmesi,
  vekile güvenilirken başlığın hiç olmaması dışında boş bir değer gelmesi.
- **Ayar elle değiştirilir.** Paket `ayarlar.vekil`'i doğrudan atar; `data/ayarlar.json`'dan okuma ve varsayılanların
  birleşmesi ([../sunucu/ayarlar.md](../sunucu/ayarlar.md) → `ayarlariYukle`) burada denenmez.

## Testleri

- Bu dosyanın kendisi testtir; `testler/tumtest.sh` sunucusuz paketler arasında her tam koşuda çalıştırır.
- Aynı alanda: [test-okul-agi.md](test-okul-agi.md) — okul ağından (tek IP) gelen 300 kişilik yükü sunucuya karşı dener;
  `EE_AG_VEKIL=1` verilirse istekleri vekilden geçmiş gibi `X-Forwarded-For` başlığıyla gönderir (sunucunun kendisi
  `ayarlar.json`'da `vekil.guven` açık, başlığı `x-forwarded-for` olarak açılmış olmalı; paket sunucuyu kendisi
  ayarlamaz). `tumtest.sh` onu bu kipte değil, vekilsiz koşar;
  [guvenlik-test.md](guvenlik-test.md) — giriş kilidi, veli kodu deneme sınırı ve öbür güvenlik kuralları (IP'ye bağlı
  sayaçları gerçek uçlardan dener).
- Elle (proje kökünde; sunucu gerekmez):

  ```
  node testler/test-vekil-ip.js
  ```

  Geçici klasörün senin seçtiğin yere açılması için Git Bash'te `TEMP=<klasör> TMP=<klasör> node testler/test-vekil-ip.js`.
- 3 Ekim 2026'da bu belge için böyle (geçici klasör yönlendirilerek) çalıştırıldı: `GECTI: 8   KALDI: 0`. Belge
  denetiminde aynı gün yeniden çalıştırıldı: sonuç aynı, geride yine boş bir `ee-vekil-XXXXXX` klasörü kaldı.

## Son durum

- `git log`: tek commit. Dosya `86af98a commit 506` (2026-09-26) ile 40 satır olarak eklendi ve o günden beri değişmedi. Aynı
  commit `sunucu/guvenlik.js`'teki `istemciIp`'i değiştirdi: önceden `X-Forwarded-For` zincirinin İLK girdisi alınıyordu
  ("ilk sıradaki gerçek istemcidir" yorumuyla); artık zincir virgülle bölünüp boşlar atılıyor ve SON girdi alınıyor (ziyaretçi
  başı uydurup her istekte hız sınırını aşamasın diye). Commit kurulum belgesine ve `belge/KILAVUZ.md`'ye vekil notunu,
  `tumtest.sh`'in sunucusuz listesine bu paketi ekledi. Aynı commit'te bu paketle ilgisiz iki güvenlik düzeltmesi de var:
  ön yüz parça dosyalarının (`public/js/parcalar`, `public/css/parcalar`) tek tek sunulmaması (`sunucu/http.js`,
  `testler/guvenlik-test.js`) ve bildirim aboneliğinin başkasının anahtarıyla devralınamaması (`sunucu/veri/depo/push.js`,
  `sunucu/bolumler/push.js`, `testler/test-servis-konum.js`).
- Açık iş yok; kod değiştirilmedi.
- Planlı işlerden bu dosyayı etkileyecek olan: **"Güvenlik denetimi (tam; + IPv6 /64 anahtarı …)"** — IPv6'da bir kişinin
  elinde koca bir /64 blok olduğu için sayaç anahtarının adresin ilk 64 bitine indirilmesi planlı. Bu `istemciIp`'in
  kendisinde yapılırsa 7. denetimdeki "`2001:db8::1` aynen döner" beklentisi değişmeli; sayaç anahtarında yapılırsa bu pakete
  "/64 içindeki iki adres aynı anahtarı verir" denetimi eklenmeli.
