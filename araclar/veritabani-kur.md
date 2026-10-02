# araclar/veritabani-kur.js

PostgreSQL'in ilk kurulumu: uygulamaya özel, yetkisi kısıtlı `egitimevi` kullanıcısını rastgele 32 karakterlik bir şifreyle
açar (varsa şifresini yeniler), `egitimevi` ve `egitimevi_test` veritabanlarını açar ve bağlantı bilgisini `data/ayarlar.json`'un
`veritabani` bölümüne yazar.

## Bu dosya ne yapar?

Sunucu veritabanına bağlanmadan açılamaz. Bağlantı bilgisi (sunucu, port, kullanıcı, şifre, veritabanı adı)
`data/ayarlar.json`'daki `veritabani` bölümünden gelir ([../sunucu/veri/baglanti.md](../sunucu/veri/baglanti.md),
`baglantiAyari`) ve o bölümü yazan tek araç bu dosyadır. Kurulumu yapmadan sunucuyu açarsan pencerede "Önce veritabanını kur:
npm run veritabani-kur" yazar ([../sunucu/index.md](../sunucu/index.md)).

Aracın asıl derdi güvenlik. Uygulama PostgreSQL'e `postgres` süper kullanıcısıyla bağlansaydı, uygulamada bulunacak tek bir açık
bütün veritabanı sunucusunu (başka veritabanlarını, kullanıcıları, hatta sunucunun dosyalarını) tehlikeye atardı. Bu yüzden araç
uygulamaya kendi kullanıcısını açar: `egitimevi`. Bu kullanıcı süper kullanıcı değildir, veritabanı ya da kullanıcı açamaz,
yalnız kendi iki veritabanının sahibidir. Şifresini kimse seçmez, kimse ezberlemez: araç 32 karakterlik rastgele bir şifre üretir,
ekrana yazmaz, yalnız ayar dosyasına koyar.

İki veritabanı açılır: `egitimevi` gerçek veri içindir, `egitimevi_test` testler içindir. Projedeki "yalnız adı `_test` ile biten
veritabanı sıfırlanır" kuralının (testler her pakette test veritabanını silip baştan kurar) karşılığı bu ikinci veritabanıdır;
`testler/test-ayarlari.js` onun adını buradan (`testAd`) alır.

Bir kez çalıştırılır. Yeniden çalıştırırsan kullanıcının şifresini yeniler, var olan veritabanlarına ve içlerindeki veriye
dokunmaz; uygulamanın şifresini kaybettiğinde çözüm de budur. Tabloları bu araç kurmaz: uygulama her açılışta şema dosyalarını
kendisi uygular ([../sunucu/veri/sema.md](../sunucu/veri/sema.md)).

Kim kullanır? Kurulumu yapan kişi, elle: Windows'ta `npm run veritabani-kur`, Linux sunucuda
`sudo -u postgres node araclar/veritabani-kur.js --yerel-soket`. Sunucu, testler ve öteki araçlar bu dosyayı `require` etmez.

## İçinde neler var?

### Sabitler

- `KOK` — proje kökü (`araclar/`'ın bir üstü).
- `DATA` — veri klasörü: `EE_DATA` ortam değişkeni verilmişse onun tam yolu, yoksa `<kök>/data`. Sunucudaki
  [../sunucu/yollar.md](../sunucu/yollar.md)'deki `DATA` ile aynı kural; ama araç o modülü yüklemez, kuralı kendisi yazar.
- `AYAR_DOSYA` — `<DATA>/ayarlar.json`.
- `SUNUCU` — `PGHOST` ya da `localhost`; `PORT` — `PGPORT` ya da `5432`. İkisi hem aracın kendi bağlantısında (şifreyle girilen
  yolda) kullanılır hem de ayar dosyasına uygulamanın bağlanacağı adres olarak yazılır.
- `UYGULAMA_KULLANICI` — `'egitimevi'`; `VERITABANLARI` — `['egitimevi', 'egitimevi_test']` (ilki gerçek, ikincisi test).
- `ZAYIF` — sık kullanılan 14 zayıf şifre (`123456`, `password`, `postgres`, `admin`, `qwerty`, `sifre`, `root`…). Yalnız uyarı
  için: kurulum durmaz.

### İşlevler

- `rastgeleSifre(uzunluk)` — `crypto.randomBytes` ile, karışan karakterler (`i`, `l`, `o`, `I`, `O`, `0`, `1`) çıkarılmış 55
  karakterlik bir alfabeden (23 küçük harf, 24 büyük harf, `2`–`9`) şifre üretir. Özel karakter yoktur; şifre bağlantı
  metinlerinde ve JSON'da kaçış gerektirmez. 32 karakterle yaklaşık 185 bitlik bir şifredir. (Bayt `% 55` ile seçildiği için
  ilk 36 karakter çok az daha sık çıkar: 256'da 5'e karşı 4; pratikte önemsiz.)
- `gizliSor(soru)` — `postgres` şifresini ekrana yazmadan okur. İki yolu var:
  - **Klavyeden (TTY):** girdiyi ham kipe alır, her karakter için `*` basar. Enter bitirir; Ctrl+C satır atlayıp 1 koduyla çıkar;
    Backspace (terminale göre `\u0008` ya da `\u007f` gelir) son karakteri siler. Başka denetim tuşları (ok tuşları gibi) şifreye karakter
    olarak eklenir. Yapıştırma çalışır (gelen parçanın bütün karakterleri sırayla işlenir).
  - **Borudan (TTY değil):** otomasyon için. Girdi **kapanana kadar** okur, ilk satırı şifre sayar (`echo … | npm run
    veritabani-kur` gibi).
- `ayarlariOku()` — `AYAR_DOSYA`'yı JSON olarak okur; dosya yoksa ya da okunamıyorsa (bozuk JSON dahil) boş nesne `{}` döner.
- `ayarlariYaz(ayar)` — veri klasörünü gerekirse açar, ayarı önce `ayarlar.json.tmp`'ye yazar, sonra asıl adın üstüne taşır
  (yarım yazılmış dosya kalmasın), en sonda `chmod 600` uygular (Linux'ta yalnız dosyanın sahibi okuyabilsin; Windows'ta etkisi
  yok, hata yutulur).

### Ana akış (adsız `async` işlev)

Dosya çalıştırılınca hemen başlar; sırası "Nasıl çalışır"da. Beklenmeyen bir hata olursa `BEKLENMEYEN HATA: <ileti>` yazar ve
1 koduyla çıkar. Bağlanamazsa nedenine göre üç iletiden birini verir (ayrıntısı aşağıda) ve yine 1 koduyla çıkar. Komut satırında
tek seçenek var: `--yerel-soket`.

Dışa açılan bir şey yok (`module.exports` yok); dosya yalnız komut satırından çalışır.

### Ayar dosyasına yazılan

```
"veritabani": {
  "_aciklama": "araclar/veritabani-kur.js tarafından yazıldı. Şifre rastgele; elle değiştirme, aracı yeniden çalıştır.",
  "sunucu": "localhost",          (PGHOST verilmişse o)
  "port": 5432,                   (PGPORT verilmişse o)
  "ad": "egitimevi",
  "testAd": "egitimevi_test",
  "kullanici": "egitimevi",
  "sifre": "<32 karakter, rastgele>"
}
```

Dosyadaki öteki bölümler (`eposta`, `site`, `vekil`, `_aciklama`) okunup aynen geri yazılır; yalnız `veritabani` baştan kurulur.
Uygulama `sunucu`, `port`, `kullanici`, `sifre` ve `ad`'ı kullanır; `testAd`'ı yalnız `testler/test-ayarlari.js` okur.

### Ekran çıktısı (başarılı kurulum, Windows)

```
  ==========================================
     EĞİTİM EVİ — veritabanı kurulumu
  ==========================================

  PostgreSQL kurulurken "postgres" kullanıcısı için belirlediğin şifreyi gir.
  Şifre ekranda görünmez ve hiçbir yere kaydedilmez.

  postgres şifresi: ********
  PostgreSQL 17.x bağlandı.
  Kullanıcı "egitimevi" oluşturuldu.             (ikinci kez: güncellendi (yeni şifre).)
  Veritabanı "egitimevi" oluşturuldu.            (ikinci kez: zaten var, dokunulmadı.)
  Veritabanı "egitimevi_test" oluşturuldu.
  Türkçe sıralama (tr-x-icu): var
  Bağlantı bilgisi yazıldı: <veri klasörü>\ayarlar.json

  Kurulum bitti. Uygulama açılışta tabloları kendisi kurar.
```

Şifre zayıfsa (listede ya da 8 karakterden kısa) bağlanmadan önce "! Uyarı: bu şifre zayıf. Kendi bilgisayarında sorun değil, ama
sunucuda ASLA aynısını kullanma." uyarısı çıkar.

## Kimle konuşur?

- **Çağırdıkları:** Node'un `fs`, `path`, `crypto`'su ve `pg`'nin `Client`'ı (havuz değil, tek bağlantı). Uygulamanın kendi
  modüllerinden hiçbirini yüklemez; [../sunucu/ayarlar.md](../sunucu/ayarlar.md)'yi de kullanmaz, ayar dosyasını kendisi okuyup
  yazar.
- **PostgreSQL'de yaptıkları** (`postgres` kullanıcısıyla, `postgres` veritabanına bağlanarak):
  - `SHOW server_version` — sürümü yazmak için.
  - `pg_roles` — `egitimevi` var mı? Varsa `ALTER ROLE`, yoksa `CREATE ROLE … WITH LOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE
    PASSWORD …`.
  - `pg_database` — her veritabanı var mı? Yoksa `CREATE DATABASE … OWNER egitimevi TEMPLATE template0 ENCODING 'UTF8'` +
    `LOCALE_PROVIDER icu ICU_LOCALE 'und' LOCALE 'C'`; bu olmazsa `LC_COLLATE 'C' LC_CTYPE 'C'` ile.
  - Her iki veritabanında `REVOKE CONNECT … FROM PUBLIC`.
  - `pg_collation` — `tr-x-icu` var mı (yalnız bilgi verir).
  - Bütün DDL komutları SQL metnine elle yapıştırılmaz: önce `SELECT format('… %I … %L', $1, $2)` ile PostgreSQL'in kendisine
    güvenli tırnaklatılır, sonra dönen komut çalıştırılır (şifre DDL'e parametre olarak verilemediği için).
- **Yazdığı dosya:** `<veri klasörü>/ayarlar.json` (ve geçici `ayarlar.json.tmp`). `data/` depoya girmez.
- **Ayar dosyasını okuyanlar:**
  - [../sunucu/ayarlar.md](../sunucu/ayarlar.md) (`ayarlariYukle`) → [../sunucu/veri/baglanti.md](../sunucu/veri/baglanti.md)
    (`baglantiAyari`: `DATABASE_URL` yoksa bu bölüm; `kullanici` boşsa "Veritabanı ayarı yok" hatası).
  - `testler/test-ayarlari.js` — `data/ayarlar.json`'daki `veritabani`'yı alır, `ad`'ı `testAd` ile değiştirip test klasörüne
    (`testler/testdata/ayarlar.json`) yazar. `testAd` yoksa ya da `_test` ile bitmiyorsa "npm run veritabani-kur yeniden
    çalıştırılmalı" der ve durur; `testler/tumtest.sh` de o zaman bütün testi keser.
  - [eposta-ayarla.md](eposta-ayarla.md) aynı dosyaya `eposta` bölümünü yazar; o da `veritabani`'yı korur.
- **Onu çağıran:** `package.json`'daki `veritabani-kur` komutu (`npm run veritabani-kur`). Bu adı kullanıcıya gösteren iletiler:
  `sunucu/index.js` (veritabanı ayarı yokken), `sunucu/veri/baglanti.js` (hata metni), `testler/test-ayarlari.js`. Kurulum
  belgeleri: [../belge/KILAVUZ.md](../belge/KILAVUZ.md) ("Nasıl çalıştırılır (Linux)" → ilk kurulum),
  [../belge/SUNUCUYA-KURULUM.md](../belge/SUNUCUYA-KURULUM.md) ("Veritabanını kur" ve "PostgreSQL şifresini unuttum"),
  [../TANITIM.md](../TANITIM.md) (araçlar tablosu).
- **Veritabanını sonra kullananlar:** sunucu açılırken şema dosyalarını uygular ([../sunucu/veri/sema.md](../sunucu/veri/sema.md));
  testler `EE_DB_SIFIRLA=1` ile açılan sunucuda `egitimevi_test`'i sıfırlar (`testIcinSifirla`, yalnız `_test` ile biten ad).

## Nasıl çalışır (adım adım)?

```
başlık
--yerel-soket var mı?
  evet → Client { host: '/var/run/postgresql', user: postgres, database: postgres }   (Linux, şifresiz "peer")
  hayır → "postgres şifresi: " (gizliSor) → zayıfsa uyarı
          Client { host: SUNUCU, port: PORT, user: postgres, password, database: postgres }
connect()
  hata → "şifre yanlış" | "PostgreSQL çalışmıyor ya da <adres>:<port> adresinde değil" | "bağlanılamadı: <ileti>" → çıkış 1
SHOW server_version → "PostgreSQL 17.x bağlandı."
1) uygulamaSifre = rastgeleSifre(32)
   pg_roles'ta egitimevi var mı? → format(ALTER/CREATE ROLE %I … PASSWORD %L) → çalıştır
2) her veritabanı için (egitimevi, egitimevi_test):
     yoksa CREATE DATABASE … OWNER egitimevi, ICU 'und' (olmazsa C) ; varsa "dokunulmadı"
     REVOKE CONNECT … FROM PUBLIC   (her çalıştırmada)
3) pg_collation'da tr-x-icu var mı? → yaz
   bağlantıyı kapat
4) ayarlariOku() → veritabani bölümünü yeniden kur → ayarlariYaz() (.tmp → yeniden adlandır → chmod 600)
"Kurulum bitti."
```

### Neden bu veritabanı ayarları?

- **`OWNER egitimevi`:** PostgreSQL 15'ten beri `public` şemasında tablo açma hakkı veritabanının sahibinde. Uygulama açılışta
  tablolarını kendisi kurduğu için veritabanının sahibi olmalı.
- **ICU `und` (kök) kuralları, `LOCALE 'C'`:** büyük/küçük harf dönüşümü Unicode'a göre yapılır, Türkçe "I/ı" tuzağı yoktur
  (e-posta karşılaştırmaları bozulmaz). Türkçe alfabe sırası gereken sorgular bunu açıkça ister (`COLLATE "tr-x-icu"`,
  [../sunucu/veri/baglanti.md](../sunucu/veri/baglanti.md)'deki `tr()`). [../belge/KILAVUZ.md](../belge/KILAVUZ.md) ("Nasıl
  çalıştırılır (Linux)") de kümenin yerel ayarının Türkçe seçilmemesini bu yüzden söyler.
- **`TEMPLATE template0`:** şablon veritabanına sonradan eklenmiş bir şey yeni veritabanlarına geçmesin, yerel ayar da seçilebilsin.
- **`REVOKE CONNECT … FROM PUBLIC`:** kümede başka kullanıcılar varsa bu veritabanlarına bağlanamasınlar; yalnız sahibi (ve süper
  kullanıcı) bağlanır.
- **`NOSUPERUSER NOCREATEDB NOCREATEROLE`:** rol zaten varsa da `ALTER ROLE` bu üçünü yeniden yazar; biri `egitimevi`'yi elle süper
  kullanıcı yaptıysa araç onu geri kısıtlar.

### Çalıştırma

- **Windows (kendi bilgisayarın):** PostgreSQL 17'yi kurarken `postgres` için bir şifre belirlersin. Proje klasöründe
  `npm run veritabani-kur`, sonra o şifreyi gir. PowerShell ya da komut istemi penceresinde çalıştır (şifre `*` ile görünür).
- **Linux sunucu:** `postgres` şifresine hiç gerek yok; işletim sistemindeki `postgres` kullanıcısı yerel soketten şifresiz
  bağlanır. Veri klasörü bir süreliğine `postgres`'e verilir ki araç dosyayı yazabilsin:

  ```
  chown -R postgres data
  sudo -u postgres node araclar/veritabani-kur.js --yerel-soket
  chown -R egitimevi:egitimevi data && chmod 600 data/ayarlar.json
  ```

  (Tam sıra [../belge/SUNUCUYA-KURULUM.md](../belge/SUNUCUYA-KURULUM.md)'de; kendi bilgisayarındaki Linux için
  [../belge/KILAVUZ.md](../belge/KILAVUZ.md).)
- **İkinci kez:** aynı komut. Kullanıcı "güncellendi (yeni şifre)", veritabanları "zaten var, dokunulmadı" olur; ayar dosyasına
  yeni şifre yazılır. Ardından sunucuyu yeniden başlat (aşağıda neden).

## Dikkat!

- **Şifre önce değişir, dosya sonra yazılır.** 1. adımda `egitimevi`'nin PostgreSQL'deki şifresi yenilenir; yeni şifre ayar
  dosyasına ancak en sonda yazılır. Arada bir şey düşerse (veritabanı açılamazsa, Linux'ta veri klasörünü `postgres`'e vermeyi
  unuttuğun için dosya yazılamazsa…) PostgreSQL yeni şifreyi bilir, `ayarlar.json` eskisini: uygulama artık bağlanamaz. Çözüm
  aracı sorunu giderip yeniden çalıştırmak. (Koddan çıkarım; denenmedi.)
- **Çalışan sunucuyu yeniden başlat.** Başarılı bir yeniden çalıştırmadan sonra da açık sunucunun belleğinde eski şifre
  vardır. Açık bağlantılar çalışmaya devam eder ama havuz boşta kalan bağlantıyı 30 sn'de kapatır, yeni bağlantılar şifre
  hatası alır. Linux'ta `systemctl restart egitimevi`.
- **`EE_DATA` yalnız dosyanın yerini değiştirir, kullanıcıyı değil.** `egitimevi` rolü PostgreSQL kümesinin tamamında tektir.
  Aracı başka bir veri klasörüyle (`EE_DATA=…`) ama AYNI PostgreSQL'e karşı çalıştırırsan rolün şifresi yine değişir; yeni şifre
  yalnız o klasöre yazılır, `data/ayarlar.json`'daki eski şifre geçersiz kalır ve gerçek sunucu bağlanamaz. "Deneme için ayrı
  klasör" bu araçta güvenli değildir; denemek istiyorsan ayrı bir PostgreSQL kurulumu (başka port, `PGPORT`) kullan. Aynı nedenle
  `testler/testdata/ayarlar.json` gibi kopyalar da eskir; `testler/tumtest.sh` her pakette onu `data/ayarlar.json`'dan yeniden
  ürettiği için testler etkilenmez.
- **Bozuk `ayarlar.json` sessizce ezilir.** `ayarlariOku` okunamayan dosyada `{}` döner. Dosyayı elle düzenlerken bir virgül
  fazla kalmışsa araç hiçbir şey söylemeden yalnız `veritabani` bölümünü içeren yeni bir dosya yazar; e-posta (`eposta`), site
  adresi (`site`) ve ters vekil (`vekil`) ayarların kaybolur. Çalıştırmadan önce dosyanın geçerli JSON olduğundan emin ol ya da
  bir kopyasını al. (Koddan çıkarım; denenmedi.)
- **Borudan okuma girdinin kapanmasını bekler.** `gizliSor` girdinin bir terminal olmadığını görürse Enter'ı değil girdinin
  bitişini bekler ve yazdıkların ekranda görünür. `echo … |` ile verirsen sorun yok. Girdisi terminal sayılmayan bir pencerede
  (örneğin bazı Git Bash pencereleri) elle yazarsan araç Enter'dan sonra beklemeye devam eder (koddan çıkarım; denenmedi).
  Windows'ta PowerShell ya da komut istemi kullan. Şifreyi `echo` ile verirsen kabuğun komut geçmişine düşebileceğini unutma.
- **Hata iletileri İngilizce metne bakar.** "şifre yanlış" iletisi PostgreSQL'in `password authentication failed` metnine,
  "PostgreSQL çalışmıyor" iletisi `ECONNREFUSED`'a bakar. PostgreSQL iletileri başka dilde verecek şekilde ayarlıysa yanlış şifre
  genel "bağlanılamadı: <ileti>" satırına düşer. "Çalışmıyor" iletisindeki hizmet adı (`postgresql-x64-17`) PostgreSQL 17'nin
  Windows kurulumuna göredir.
- **"Şifreyi unuttum" bölümü yalnız sunucuyu anlatır.** Yanlış şifrede araç [../belge/SUNUCUYA-KURULUM.md](../belge/SUNUCUYA-KURULUM.md)
  içindeki "Şifreyi unuttum" bölümünü gösterir. O bölümün başlığı "PostgreSQL şifresini unuttum" ve Linux sunucuyu anlatır
  (orada `postgres` şifresine gerek yok, `--yerel-soket` kullanılır). Windows'ta `postgres` şifresi unutulunca ne yapılacağı
  belgelerde yok.
- **Yerel soket yolu sabit.** `--yerel-soket` `/var/run/postgresql`'e bağlanır (Debian/Ubuntu düzeni) ve aracın işletim
  sistemindeki `postgres` kullanıcısıyla çalışmasını ister (`sudo -u postgres`). Bu kipte de ayar dosyasına `sunucu: localhost`
  yazılır: uygulama her zaman TCP ile, kendi şifresiyle bağlanır. Bunun için PostgreSQL'in `127.0.0.1`'de şifreli girişe izin
  vermesi gerekir (Ubuntu'nun varsayılanı izin verir).
- **`PGHOST` ve `PGPORT` ayar dosyasına geçer.** Aracı bu değişkenlerle çalıştırırsan uygulama da o adrese bağlanır.
- **Var olan veritabanının içine ve ayarlarına dokunulmaz, sahibine de** (yalnız `REVOKE CONNECT` yeniden uygulanır). Örneğin `egitimevi` veritabanını daha önce elle (`postgres` sahibiyle)
  açtıysan araç "zaten var" der, sahipliğini düzeltmez; PostgreSQL 15 ve sonrasında uygulama o zaman `public` şemasında tablo
  açamayabilir. (Koddan çıkarım; denenmedi.) Yerel ayarı da sonradan değişmez: ICU'suz açılmış bir veritabanı öyle kalır.
- **ICU'dan C'ye düşüş her hatada olur.** `CREATE DATABASE … LOCALE_PROVIDER icu …` hangi nedenle düşerse düşsün (ICU'suz derleme,
  PostgreSQL 14 ve öncesinde bu sözdiziminin olmaması ya da başka bir hata) araç sessizce düz `C` ile dener; ekranda yalnız
  "oluşturuldu" görünür.
- **"Node tarafında sıralama" iddiası tam değil.** ICU ya da `tr-x-icu` yoksa araç "isim sıralaması Node tarafında yapılacak"
  der (kod yorumu da öyle). Oysa [../sunucu/veri/baglanti.md](../sunucu/veri/baglanti.md)'deki `tr()` o zaman boş döner ve
  sorgular bayt sırasıyla sıralanır; genel bir Node sıralaması yoktur (yalnız bazı listeler kendi içinde `localeCompare('tr')`
  kullanır, ör. mesaj alıcıları). Uygulama yine çalışır, yalnız "Ç, Ş, İ" ile başlayan adlar sona düşer. Ayrıca araç `tr-x-icu`'yu
  `postgres` veritabanında arar, uygulama kendi veritabanında; ikisi normalde aynı sonucu verir.
- **Geçici dosya kısa bir an herkese açık olabilir.** `ayarlar.json.tmp` ve yeni adlandırılan dosya `chmod 600`'den önce
  sistemin varsayılan izinleriyle durur (Linux'ta çoğu zaman herkes okuyabilir). Kurulum belgelerindeki ayrı `chmod 600` adımı
  yalnız son durumu güvenceye alır, bu kısa anı kapatmaz. `data/` web'den hiç sunulmaz.
- **`postgres` şifresi hiçbir yere yazılmaz,** yalnız bu bağlantıda kullanılır. Zayıf şifre uyarısı kurulumu durdurmaz.
- **Uygulamanın şifresini elle değiştirme.** `_aciklama` da söyler: şifre PostgreSQL'deki rolle aynı olmalı; değiştirmek
  gerekirse aracı yeniden çalıştır.
- **SQL kuralı bu dosyayı kapsamaz.** "SQL yalnız `sunucu/veri/` altında" kuralını denetleyen `testler/sql-denetimi.js` yalnız
  `sunucu/`'yu tarar. Buradaki komutlar kullanıcıdan değer almaz; ad ve şifre yine de `format(%I, %L)` ile tırnaklatılır.

## Testleri

- Bu aracı çalıştıran otomatik test yok: çalıştırmak gerçek kullanıcının şifresini değiştirirdi.
- Dolaylı bağımlılık: `testler/tumtest.sh` her paketten önce `testler/test-ayarlari.js` ile bu aracın yazdığı `veritabani`
  bölümünü test klasörüne kopyalar; `testAd` yoksa bütün test durur. Her paket de bu aracın açtığı `egitimevi_test`'i sıfırlayıp
  bütün şema dosyalarını yeniden uygular. Yani araç bozulursa ya da hiç çalıştırılmamışsa tam test hemen kalır.
- Belgeleme sırasında (2–3 Ekim) çalıştırılmadı: kullanıcının bilgisayarındaki PostgreSQL'de `egitimevi` rolünün şifresini yenileyip
  `data/ayarlar.json`'u değiştirirdi (yukarıdaki `EE_DATA` uyarısı). Bu belge koda bakılarak yazıldı.
- Elle güvenli deneme: ayrı bir PostgreSQL kurulumu (ör. 5433 portunda) ve geçici bir veri klasörüyle
  `PGPORT=5433 EE_DATA=<geçici klasör> npm run veritabani-kur` (PowerShell'de `$env:PGPORT='5433'; $env:EE_DATA='<geçici
  klasör>'; npm run veritabani-kur`) → "oluşturuldu" satırları ve klasörde `ayarlar.json`; ikinci
  çalıştırmada "güncellendi (yeni şifre)" ve "zaten var, dokunulmadı", dosyada yeni şifre, öteki bölümler aynen.

## Son durum

- `git log --follow`: 3 commit, hepsi 2026-08-28; o günden beri değişmedi. `f7a8d33 commit 11`: baştaki açıklama, `require`'lar,
  sabitler, `ZAYIF`, `rastgeleSifre`, `gizliSor` (aynı commit `testler/sql-denetimi.js`'i de ekledi). `0c7cc62 commit 12`:
  `ayarlariOku` ve `ayarlariYaz` (geçici dosya + yeniden adlandırma + `chmod 600`). `8f54953 commit 45`: ana akışın tamamı —
  `--yerel-soket`, bağlantı hata iletileri, rol, iki veritabanı, `REVOKE CONNECT`, `tr-x-icu` denetimi, ayar dosyasına yazma.
- Bilinen açıklar ("Dikkat!"te, kod değiştirilmedi): şifrenin dosyadan önce değişmesi, bozuk JSON'un ezilmesi, `EE_DATA` ile
  aynı kümede çalıştırmanın gerçek ayarı bozması, ICU düşüşünün her hatada sessiz olması, "Node tarafında sıralama" iletisinin
  tam doğru olmaması, Windows için "şifreyi unuttum" yolunun belgelerde olmaması.
- Planlı işlerden bu dosyayı doğrudan hedefleyen yok; tanımlarda araçtan söz edilmiyor. "Güvenlik denetimi (tam)" işi kurulum
  adımlarını da gözden geçirirse yukarıdaki açıklar oraya not edilebilir.
