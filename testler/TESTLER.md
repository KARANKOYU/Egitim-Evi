# testler/TESTLER.md

`testler/` klasörünün haritası: `tumtest.sh`'in her paketi 3200 portunda, sıfırlanmış `egitimevi_test` veritabanıyla nasıl
koşturduğu, 51 test paketi, 5 denetim, hazırlık betikleri, test hesapları, örnek tablo dosyaları ve yeni bir paketin nasıl
ekleneceği.

## Bu dosya ne yapar?

`testler/` altındaki her `.js`'in yanında kendi `.md`'si var (61 kod dosyası, 61 belge). Onlar tek tek "bu paket neyi,
hangi sırayla dener" sorusunu cevaplar. Bu dosya ise bütünü anlatır: paketler nasıl bir araya geliyor, hepsini kim
çalıştırıyor, bir paket neden boş bir veritabanıyla başlıyor, çıktıda "KALDI" ya da "DENETIM SORUNU" görürsen ne anlaman
gerekiyor, yeni bir özellik yazınca testini nereye ve nasıl ekleyeceksin.

Neden bu kadar test var? Depo herkese açık, içinde çocuk verisi tutan bir okul portalı var; bir yetki hatası ya da bir
SQL hatası doğrudan öğrencinin, velinin bilgisini açığa çıkarır. Bu yüzden testlerin neredeyse hepsi **uçtan uca**: gerçek
bir sunucu açılır, gerçek HTTP istekleri gider, iki adımlı giriş bile gerçekten geçilir (e-posta ayarlı olmadığı için
sunucu giriş kodunu kendi günlüğüne yazar, test de oradan okur). Birkaç paket de sunucusuz çalışır: Excel motoru, bildirim
şifrelemesi, saat hesapları gibi saf işlevleri doğrudan `require` ederek dener.

Klasörde dört tür şey var:

1. **Test paketleri** (51): `test-*.js` (`test-ayarlari.js` hariç) ve `guvenlik-test.js`. 10'u sunucusuz, 41'i sunuculu.
2. **Denetimler** (5): `yetki-denetimi.js`, `girdi-denetimi.js` (sunuculu), `buton-denetimi.js`, `yazim-denetimi.js`,
   `sql-denetimi.js` (sunucusuz). Tek tek "geçti/kaldı" saymaktan çok bütün kodu ya da bütün uçları tarar.
3. **Hazırlık betikleri** (5, paket değil): `seed.js`, `test-ayarlari.js`, `giris.js`, `debug-hazirlik.js`,
   `hazirlik-aktarim.js`.
4. **Koşturucu ve örnek dosyalar**: `tumtest.sh` ile üç örnek tablo dosyası (`ornek-eski-liste.xls`,
   `ornek-eski-sayilar.xls`, `ornek-ogrenci-listesi.xlsx`).

Kim kullanır: geliştirici (sen). Bir şeyi değiştirdikten sonra ve commit atmadan önce `bash testler/tumtest.sh` (ya da
`npm test`, ikisi aynı şey) çalıştırılır; sonda `KALDI: 0` ve `DENETIM SORUNU: 0` görmek istersin.

## İçinde neler var?

### Klasör bir bakışta

| Ne | Dosyalar | Depoda mı? |
|---|---|---|
| Koşturucu | `tumtest.sh` | evet |
| Sunucusuz paketler | 10 `test-*.js` (aşağıda) | evet |
| Sunuculu paketler | 40 `test-*.js` + `guvenlik-test.js` | evet |
| Denetimler | `yetki-denetimi.js`, `girdi-denetimi.js`, `buton-denetimi.js`, `yazim-denetimi.js`, `sql-denetimi.js` | evet |
| Hazırlık | `seed.js`, `test-ayarlari.js`, `giris.js`, `debug-hazirlik.js`, `hazirlik-aktarim.js` | evet |
| Örnek tablolar | `ornek-eski-liste.xls`, `ornek-eski-sayilar.xls`, `ornek-ogrenci-listesi.xlsx` | evet |
| Belgeler | her `.js`'in yanındaki `.md` ve bu dosya | evet |
| Koşu sırasında oluşanlar | `testdata/`, `test-sunucu.log`, `deneme.xlsx` | **hayır** (`.gitignore`) |

### `tumtest.sh` — hepsini koşturan betik

149 satırlık bir Bash betiği. Windows'ta Git Bash için yazılmış (sunucuyu `netstat -ano` ve `taskkill` ile durdurur).
Başındaki üç değişken:

- `SP` — betiğin kendi klasörü (`testler/`), `PROJE` — proje kökü, `PORT=3200`.

Üç iç işlevi var:

- `sunucu_durdur` — `netstat -ano` çıktısında `:3200` geçen ve `LISTENING` olan ilk satırın süreç numarasını bulur,
  `taskkill //F //PID <pid>` ile öldürür, 1 saniye bekler. Portu kimin tuttuğuna bakmaz (Dikkat'e bak).
- `paket_ortami <paket>` — o pakete özel ek ortam değişkenini yazar. Bugün tek bir girdi var: `test-okul-disk` →
  `EE_OKUL_DOSYA_GB=0.001` (varsayılan okul disk sınırı 1 MB olsun; "ortam" kaynağı ve %80 / "doldu" uyarıları küçük
  dosyalarla denensin). Öteki paketlerde boş döner.
- `sunucu_baslat [ek değişken]` — proje köküne geçer, bir alt kabukta (varsa ek değişkeni `export` edip) sunucuyu arka
  planda açar ve çıktısını `testler/test-sunucu.log`'a yazar. Sonra en çok 40 kez, yarım saniye arayla `curl` ile
  `http://localhost:3200/api/meta`'ya bakar (en çok 20 saniye; şema kurulana kadar). Açılmazsa `SUNUCU ACILMADI` ve
  günlüğün son 5 satırını yazar, ama betik durmaz.

Sunucu her seferinde şu ortam değişkenleriyle açılır:

| Değişken | Değer | Ne işe yarar | Okuyan |
|---|---|---|---|
| `EE_DATA` | `testler/testdata` | Gerçek `data/` yerine ayrı bir veri klasörü | [../sunucu/yollar.md](../sunucu/yollar.md) |
| `EE_DB_SIFIRLA` | `1` | Açılışta bütün şemayı silip baştan kurar; **yalnız adı `_test` ile biten veritabanında** | [../sunucu/veri/sema.md](../sunucu/veri/sema.md) (`testIcinSifirla`) |
| `EE_ADMIN_SIFRE` | testlere özel, bilinen bir şifre (değeri betikte ve [seed.md](seed.md)'de) | Boş veritabanında açılan ilk yöneticiye bu şifre verilir; seed onunla girer | [../sunucu/veri/index.md](../sunucu/veri/index.md) |
| `EE_PUSH_GONDERME` | `0` | Telefon bildirimi dışarı gönderilmez | [../sunucu/push.md](../sunucu/push.md) |
| `EE_DIS_ISTEK` | `0` | GitHub'daki uygulama sürümlerine istek atılmaz | [../sunucu/uygulama-surum.md](../sunucu/uygulama-surum.md) |
| `PORT` | `3200` | Kendi 3000'deki sunucuna karışmasın | [../sunucu/yollar.md](../sunucu/yollar.md) |
| (paket ortamı) | `EE_OKUL_DOSYA_GB=0.001` yalnız `test-okul-disk`'te | Varsayılan okul disk sınırı | [../sunucu/site.md](../sunucu/site.md) |

Betik dört döngüden oluşur (sıra önemli):

1. **Sunucusuz paketler** (10, sırayla): `test-xlsx`, `test-push`, `test-kucult`, `test-resim-kucult`,
   `test-hatirlatici-zaman`, `test-servis-pencere`, `test-vekil-ip`, `test-uygulama-surum`, `test-quiz-metin`,
   `test-gizli-dosyalar`. Her biri `node testler/<paket>.js` ile çalışır; çıktıdan `KALDI ` ya da `HATASI` geçen ilk 5 satır
   ve son `GECTI: N` satırı gösterilir.
2. **Sunuculu paketler** (41): her paket için ayrı ayrı `sunucu_durdur` → `testler/testdata/` silinip yeniden açılır →
   `data/okullar.json` (okul arama listesi) varsa oraya kopyalanır → `node testler/test-ayarlari.js testler/testdata`
   (başarısızsa bütün koşu `exit 1` ile durur) → `sunucu_baslat` (paket ortamıyla) → `seed.js` → paket. Paket
   `EE_BASE=http://localhost:3200` ve `EE_LOG=testler/test-sunucu.log` ile (ve varsa paket ortamıyla) çalışır; çıktıdan
   `KALDI` ya da `HATASI` geçen ilk 8 satır ve son `GECTI: N` satırı gösterilir.
3. **Sunuculu denetimler**: `yetki-denetimi`, `girdi-denetimi` — her biri yine temiz bir sunucu ve seed'le. Çıktıdan
   `GUVENLIK ACIGI`, `acik bulundu`, `KALDI`, `GECTI:` geçen ilk 6 satır gösterilir.
4. Sunucu kapatılır; **sunucusuz denetimler**: `buton-denetimi`, `yazim-denetimi`, `sql-denetimi` — çıktının son iki
   satırı gösterilir.

En sonda:

```
=================================================
  TOPLAM  GECTI: <sayı>   KALDI: <sayı>
  DENETIM SORUNU: <sayı>
=================================================
```

### Sayma kuralları: GECTI, KALDI, DENETIM SORUNU

- **GECTI / KALDI** — her paketin son `GECTI: N   KALDI: M` satırından okunur ve toplanır.
- Paketin çıktısında hiç `GECTI: <sayı>` yoksa (sözdizimi hatası, çökme, `TEST HATASI`) `PAKET CALISMADI` yazılır,
  çıktının son 6 satırı gösterilir ve toplam KALDI **1** artar (o paketin içindeki denetimler hiç sayılmaz).
- `seed.js` sıfır olmayan kodla biterse `SEED BASARISIZ` yazılır, paket hiç çalışmaz, KALDI 1 artar.
- **DENETIM SORUNU** ayrı sayılır, şu durumların her biri 1 ekler:
  - iki sunuculu denetimden birinin çıktısında `GUVENLIK ACIGI (` ya da `KALDI  ` (iki boşluklu) geçmesi. Kalıp ikisine de
    aynen uygulanır; pratikte ilki `yetki-denetimi`'nin "açık bulundu" başlığı (`=== GUVENLIK ACIGI (N) ===`; açık yoksa
    `GUVENLIK ACIGI YOK` yazar, o sayılmaz), ikincisi `girdi-denetimi`'nin kalan bir denetiminin satırıdır;
  - bu iki denetim sırasında sunucu günlüğüne `API hatası` ya da `Veritabanı hatası` düşmesi (yani sunucunun bir isteğe
    500, veritabanı hatasında 500 ya da üstü vermesi; bu satırları [../sunucu/index.md](../sunucu/index.md)'deki hata
    yakalayıcı yazar) — o zaman `SUNUCU HATASI:` ve ilk 3 satır gösterilir;
  - `buton-denetimi`, `yazim-denetimi`, `sql-denetimi`'nden biri sıfır olmayan kodla biterse, ya da çıktıda
    `SORUN BULUNDU` veya `<1 ve üstü> yazim hatasi` geçerse.

### Paketlerin ortak kalıbı

Hemen her paket aynı iskeletle yazılmış (yenisini yazarken de bunu kullan):

```js
let gecti = 0, kaldi = 0;
function kontrol(ad, sart, detay) {
  if (sart) { gecti++; console.log('  GECTI  ' + ad); }
  else { kaldi++; console.log('  KALDI  ' + ad + (detay ? '  -> ' + detay : '')); }
}
(async () => {
  console.log('=== 1) BÖLÜM ===');
  kontrol('...', kosul, ayrinti);
  console.log();
  console.log('  GECTI: ' + gecti + '   KALDI: ' + kaldi);
  process.exit(kaldi ? 1 : 0);
})().catch(e => { console.error('TEST HATASI:', e.message, e.stack); process.exit(1); });
```

- Bölümler `=== N) AD ===` başlıklarıyla ayrılır; her denetim bir `GECTI  …` ya da `KALDI  … -> ayrıntı` satırı yazar.
- Son satır `GECTI: N   KALDI: M` biçiminde olmalı: `tumtest.sh` sayıları buradan okur.
- Beklenmeyen hatada sunuculu paketler `TEST HATASI: …` yazıp 1 ile çıkar.
- Bir ön koşul yoksa paket kendini atlayabilir: `test-resim-kucult` Edge ya da Chrome bulamazsa, `test-gizli-dosyalar`
  `git` bulamazsa `ATLANDI …` ve `GECTI: 0   KALDI: 0` yazar.
- Sunuculu paketler giriş işlerini `require('./giris')` ile alır; o dosya [giris.md](giris.md) üç satırlık bir köprüdür,
  asıl kod [../araclar/giris.md](../araclar/giris.md)'dedir: `iste(yol, method, body, token)` → `{ status, body, headers }`
  (HTTP hatasında fırlatmaz), `girisYap` (bot sorusu, şifre, iki adımlı kod), `sonKod` ve `sonOnayAnahtari` (kodu ve e-posta
  onay bağlantısını `EE_LOG`'daki sunucu günlüğünden okur), `hesapAc`, `okulHesabi`, `ogretmenYap`, `mudurYap`,
  `kisiKodu`, `kisilikGec`, `epostaOnayla`, `botCevabi`, `tcUret`. Adres `EE_BASE`'ten, günlük `EE_LOG`'dan gelir.

### Sunucusuz paketler (10)

Sunucu, veritabanı ve internet gerekmez. Tek başına: `node testler/<paket>.js` (proje kökünde).

| Paket | Neyi dener | Başlıca koruduğu kod | Not |
|---|---|---|---|
| [test-xlsx](test-xlsx.md) | Kendi yazdığımız Excel motoru: yaz → oku turu, Türkçe ve özel karakter, çok sayfa, büyük liste, bozuk dosya, "bellek bombası", sütun adı çevrimi; eski `.xls` okuma | [xlsx](../sunucu/yardimci/xlsx.md), [tablo-oku](../sunucu/yardimci/tablo-oku.md), [xls](../sunucu/yardimci/xls.md) | `testler/deneme.xlsx`'i yazar; iki `ornek-eski-*.xls`'i okur |
| [test-push](test-push.md) | Telefon bildiriminin şifrelemesi (RFC 8291), VAPID imzası, abonelik adresi süzgeci, tarayıcı anahtarlarının denetimi | [push](../sunucu/push.md) | `EE_DATA`'yı işletim sisteminin geçici klasörüne çevirir |
| [test-kucult](test-kucult.md) | Tarayıcıya giden JS/CSS'ten yorum atıcının zor örnekleri; gerçek parçalardan kurulan `app.js`, yönetim paketi ve `style.css`'in yorumsuz hâliyle derlenmesi | [kucult](../sunucu/yardimci/kucult.md) | ön yüz parçalarını okur |
| [test-resim-kucult](test-resim-kucult.md) | Tarayıcıda resim küçültme: ölçek ve ad kuralları, fotoğraf / ekran görüntüsü / saydam ayrımı, dosya başından tür-boyut-yön, gerçek küçültme, ekler / ödev teslimi / okul sayfası ekranları | [04f-resim-kucult](../public/js/parcalar/04f-resim-kucult.md) | başsız Edge (yoksa Chrome) ister; yol `EE_TARAYICI` ile verilir; yoksa "ATLANDI"; 180 saniyede bitmezse kendini bir `KALDI` sayıp 1 ile çıkar |
| [test-hatirlatici-zaman](test-hatirlatici-zaman.md) | Hatırlatıcıların Türkiye saatine göre ne zaman çalacağı (bir kez, her gün, haftanın günleri, ayda bir, ay sonu) | [hatirlatici-zaman](../sunucu/yardimci/hatirlatici-zaman.md) | |
| [test-servis-pencere](test-servis-pencere.md) | Servis saat aralıkları: doğrulama, "şu an hangi dönem", 60 dakikalık uzatma, gece yarısı, birden çok okul, "07:42'de" ekleri | [servis-pencere](../sunucu/yardimci/servis-pencere.md) | |
| [test-vekil-ip](test-vekil-ip.md) | Ters vekil arkasında istemcinin adresini bulan `istemciIp` | [guvenlik](../sunucu/guvenlik.md), [ayarlar](../sunucu/ayarlar.md) | `EE_DATA`'yı geçici klasöre çevirir |
| [test-uygulama-surum](test-uygulama-surum.md) | İndirme sayfasının sürüm listesi: uydurma GitHub cevabından yalnız güvenilir alanların alınması | [uygulama-surum](../sunucu/uygulama-surum.md) | internete çıkmaz |
| [test-quiz-metin](test-quiz-metin.md) | Quizin saf kuralları ("Metinden ekle" ayrıştırıcısı, doğrulama, puan, sunucudaki süre) ve ön yüzün quiz kural cümleleri | [yardimci/quiz](../sunucu/yardimci/quiz.md), [14c-quiz](../public/js/parcalar/14c-quiz.md) | `14c-quiz.js`'i `vm` ile çalıştırır |
| [test-gizli-dosyalar](test-gizli-dosyalar.md) | Gizli ve kişisel dosyaların (veri klasörü, yönetici dosyası, anahtarlar, günlükler, test veri klasörü…) git'e giremediği; örnek dosyaların girebildiği | `.gitignore` | `git` yoksa "ATLANDI" |

### Sunuculu paketler (41)

Her biri 3200'de, sıfırlanmış `egitimevi_test` ve [seed.md](seed.md)'in kurduğu okulla başlar. Sıra `tumtest.sh`'teki
sıradır. "Doğrudan veritabanı" yazanlar HTTP'nin yanında test veritabanına kendi süreçlerinden de bağlanır (bağlantıyı
`testler/testdata/ayarlar.json`'dan alırlar ve adı `_test` ile bitmeyen veritabanında çalışmazlar).

| # | Paket | Neyi dener | Başlıca koruduğu kod | Not |
|---|---|---|---|---|
| 1 | [test-yonetim](test-yonetim.md) | Okulun açtığı hesaplar: öğrenci açma, T.C. ile ilk giriş ve zorunlu şifre değişimi, kullanıcı adı ve şifre, veli kodu, öğretmen/servisçi hesabı, okul içinde tek kullanıcı adı, kişi koduyla okul açma | [hesaplar](../sunucu/bolumler/hesaplar.md), [okul](../sunucu/bolumler/okul.md), [yonetici-okul](../sunucu/bolumler/yonetici-okul.md) | |
| 2 | [test-program](test-program.md) | Sınıf, ders, haftalık program; çakışan saatler; öğretmenin ve öğrencinin kendi programı | [okul](../sunucu/bolumler/okul.md), [ogretmen](../sunucu/bolumler/ogretmen.md), [ilerleyis](../sunucu/bolumler/ilerleyis.md) | |
| 3 | [test-rol](test-rol.md) | Yetki kataloğu, özel rol açma/atama/daraltma/silme, `okul.konum`, müdürün her zaman tam yetkili olması | [okul](../sunucu/bolumler/okul.md), [yetki](../sunucu/yetki.md) | |
| 4 | [test-kapsam](test-kapsam.md) | Özel rolün ders/sınıf kapsamının programda, ödevde ve derse atanmada uygulanması | [yetki](../sunucu/yetki.md), [okul](../sunucu/bolumler/okul.md), [odev](../sunucu/bolumler/odev.md) | |
| 5 | [test-yedek](test-yedek.md) | Yönetim panelinde yedek alma, indirme, yol kaçışı, yetki, geri yükleme | [yonetici](../sunucu/bolumler/yonetici.md), [veri/yedek](../sunucu/veri/yedek.md) | yedekleri `testdata/` altına yazar |
| 6 | [test-aktarim](test-aktarim.md) | Toplu aktarım: kişi listesi şablonu, üç sayfalı liste, ODS/CSV/TXT, ders programı aktarımı, dışa aktarım, bozuk dosya, sıkıştırma bombası | [kisi-aktarim](../sunucu/bolumler/kisi-aktarim.md), [okul](../sunucu/bolumler/okul.md), [tablo-oku](../sunucu/yardimci/tablo-oku.md) | |
| 7 | [test-sifre](test-sifre.md) | "Şifremi unuttum", tek kullanımlık anahtar, eski oturumların kapanması, kayıt formunun aydınlatma onayı, MEB okul listesi araması | [kayit](../sunucu/bolumler/kayit.md), [okullar](../sunucu/okullar.md) | okul listesi (`okullar.json`) ister |
| 8 | [test-mesaj](test-mesaj.md) | Mesaj ve duyuru: kime yazılır, velinin kopyası, okundu, izin ayarı, engel listesi, silme | [mesaj](../sunucu/bolumler/mesaj.md) | |
| 9 | [test-devamsizlik](test-devamsizlik.md) | Ders yoklaması: kaydetme, üzerine yazma, ileri tarih, öğrenci/veli dökümü, okul özeti | [devamsizlik](../sunucu/bolumler/devamsizlik.md) | |
| 10 | [test-takvim](test-takvim.md) | Resmî ve dinî günler, hafta başı, okul etkinlikleri, öğrencinin ve velinin takvimi | [takvim](../sunucu/bolumler/takvim.md) | |
| 11 | [test-odev-saat](test-odev-saat.md) | Ödevin saatleri, gecikme, geçmiş ödevin sonucunu değiştirme, yeniden açma, yıldızlama | [odev](../sunucu/bolumler/odev.md), [ilerleyis](../sunucu/bolumler/ilerleyis.md) | |
| 12 | [test-egitim-yili](test-egitim-yili.md) | Eğitim yılı açma, kayıtların yıla bağlanması, geçmiş yıla salt okunur bakma, aktif yılı değiştirme | [egitim-yili](../sunucu/bolumler/egitim-yili.md) | |
| 13 | [test-sinav](test-sinav.md) | Sınav şablonları, virgüllü değer, aralık denetimi, grafik, grup ortalaması; ödevin "açıldı" ve "geç yaptı" | [sinav](../sunucu/bolumler/sinav.md) | |
| 14 | [test-bildirim](test-bildirim.md) | Bildirimlerin tekrar gitmemesi, yalnız değişene gitmesi, bildirim yoklaması, velinin çocuk adıyla tek kopya alması | [kayit](../sunucu/bolumler/kayit.md), [odev](../sunucu/bolumler/odev.md), [sinav](../sunucu/bolumler/sinav.md) | |
| 15 | [test-giris-kayit](test-giris-kayit.md) | Kayıt ve girişin bütün kapıları: e-posta onayı, kilit, alanlı hatalar, bot sorusu, veli kodu, T.C.'nin kime gittiği, okul araması, istek sınırları | [kayit](../sunucu/bolumler/kayit.md), [kisilik](../sunucu/bolumler/kisilik.md), [guvenlik](../sunucu/guvenlik.md) | okul listesi (`okullar.json`) ister |
| 16 | [test-veli-coklu](test-veli-coklu.md) | Veli bağları: öğretmen aynı zamanda veli, T.C. ya da kullanıcı adıyla bağlama, maskeli ad, başka okul | [hesaplar](../sunucu/bolumler/hesaplar.md), [veli](../sunucu/bolumler/veli.md) | |
| 17 | [test-giris-bilgisi](test-giris-bilgisi.md) | Toplu giriş bilgisi dağıtımı: üretilen şifreler, "yalnız henüz girmemişler", Excel çıktısı | [okul](../sunucu/bolumler/okul.md) | |
| 18 | [test-anket](test-anket.md) | Anketler (hedef, tek oy, sonuçların kime açıldığı, gizli anket) ve duyurunun "kim okudu" bilgisi | [anket](../sunucu/bolumler/anket.md), [mesaj](../sunucu/bolumler/mesaj.md) | |
| 19 | [test-okul-hayati](test-okul-hayati.md) | Yemek listesi, servis, kulüpler: kim görür, kim düzenler, kontenjan yarışı | [okul-hayati](../sunucu/bolumler/okul-hayati.md) | |
| 20 | [test-servis-konum](test-servis-konum.md) | Servisçi hesabı, canlı konum, yaklaşma bildirimleri, telefon bildirimi aboneliği | [okul-hayati](../sunucu/bolumler/okul-hayati.md), [push](../sunucu/bolumler/push.md) | |
| 21 | [test-servis-yoklama](test-servis-yoklama.md) | Servis yoklamasının bütünü: saatler, sıra, sabah/akşam yoklaması, notlar, "binmeyecek", uzatma, cihaz anahtarı, 30 günlük uygulama oturumu | [okul-hayati](../sunucu/bolumler/okul-hayati.md), [cihaz](../sunucu/bolumler/cihaz.md), [depo/servis-yoklama](../sunucu/veri/depo/servis-yoklama.md) | doğrudan veritabanı |
| 22 | [test-yetiskin](test-yetiskin.md) | Yetişkin hesabı ve portallar: kayıt, kişi koduyla eklenme, iki okulda iki rol + veli, ayrılma, hesabı silme | [kisilik](../sunucu/bolumler/kisilik.md), [kayit](../sunucu/bolumler/kayit.md), [hesaplar](../sunucu/bolumler/hesaplar.md) | |
| 23 | [test-kisi-kodu](test-kisi-kodu.md) | Kişi kodu ve veli kodu her katmanda: biçim, ön yüzdeki kod kutusu, ekleme, yöneticinin kişi bulması, veritabanı kısıtı, hız sınırları | [kisilik](../sunucu/bolumler/kisilik.md), [ortak](../sunucu/ortak.md), [05-giris](../public/js/parcalar/05-giris.md) | bir kısmı sunucusuz ve tarayıcısız (`vm`); doğrudan veritabanı |
| 24 | [test-etut](test-etut.md) | Hazır Öğretmen rolü, etüt ve yoklaması, sonuçlanmış ödevi ve gönderilmiş mesajı düzeltme, açılış sayfası rakamları | [etut](../sunucu/bolumler/etut.md), [okul](../sunucu/bolumler/okul.md), [site](../sunucu/site.md) | |
| 25 | [test-adresler](test-adresler.md) | Sayfa adresleri: asıl adresler, 301 yönlendirmeleri, açık yönlendirme ve başlık enjeksiyonu denemeleri, boş bayt, bulunamayanlar | [http](../sunucu/http.md) | |
| 26 | [test-okul-sayfasi](test-okul-sayfasi.md) | Okulun herkese açık sayfası: kim düzenler, CSS temizliği, fotoğraf türü ve konum silme, galeri | [okul-sayfasi](../sunucu/bolumler/okul-sayfasi.md), [css-temizle](../sunucu/yardimci/css-temizle.md), [resim](../sunucu/yardimci/resim.md) | |
| 27 | [test-yorum-ek](test-yorum-ek.md) | Açılış sayfası yorumları ve mesaj/ödev ekleri (taslak, bağlama, indirme yetkisi, 50 MB) | [yorum](../sunucu/bolumler/yorum.md), [ekler](../sunucu/bolumler/ekler.md) | |
| 28 | [test-nakil](test-nakil.md) | Öğrenci nakli: T.C. + doğum tarihiyle taşınma, eski kayıtların gizliliği, deneme kilidi | [nakil](../sunucu/bolumler/nakil.md), [hesaplar](../sunucu/bolumler/hesaplar.md) | |
| 29 | [test-ozellikler](test-ozellikler.md) | Müdürün bir bölümü kapatması: kapalı bölümün bütün uçlarının 403 `ozellikKapali` dönmesi | [ozellikler](../sunucu/bolumler/ozellikler.md) | |
| 30 | [test-hatirlatici](test-hatirlatici.md) | Kişisel hatırlatıcı uçları: kurma, doğrulama, yalnız sahibi, kişi başına 50 | [hatirlatici](../sunucu/bolumler/hatirlatici.md) | |
| 31 | [test-siniflarim](test-siniflarim.md) | Öğretmenin "Sınıflarım"ı, ödev serisi, programdan alınan yoklamanın veliye gitmesi | [ogretmen](../sunucu/bolumler/ogretmen.md), [devamsizlik](../sunucu/bolumler/devamsizlik.md) | |
| 32 | [test-aile](test-aile.md) | "Eğitim Evi Aile": çocuğun telefonundan konum ve ekran süresi, velinin ayarları ve sınır bildirimi | [aile](../sunucu/bolumler/aile.md), [cihaz](../sunucu/bolumler/cihaz.md) | |
| 33 | [test-odev-dosya](test-odev-dosya.md) | Ödev teslim dosyaları: yükleme, kimin indirdiği, zip, tarayıcıda açma, yükleme izni, 50 MB, silinme zamanı, okul disk sınırı | [odev-dosya](../sunucu/bolumler/odev-dosya.md), [okul-disk](../sunucu/bolumler/okul-disk.md) | doğrudan veritabanı |
| 34 | [test-okul-disk](test-okul-disk.md) | Okul başına disk sınırı: varsayılan ve kaynağı, okul açarken ve sonradan sınır, sayım, %80 ve "doldu", 507, saatlik mutabakat | [okul-disk](../sunucu/bolumler/okul-disk.md), [site-ayarlari](../sunucu/bolumler/site-ayarlari.md), [site](../sunucu/site.md) | `EE_OKUL_DOSYA_GB=0.001` (paket ortamı); doğrudan veritabanı |
| 35 | [test-quiz](test-quiz.md) | Ödevin quizi: oluşturma, doğru şıkkın sızmaması, kilit, tek deneme, sonuç görünürlüğü, sunucudaki süre, sekme kaydı | [quiz](../sunucu/bolumler/quiz.md), [odev](../sunucu/bolumler/odev.md) | doğrudan veritabanı |
| 36 | [test-yonetici-dosyasi](test-yonetici-dosyasi.md) | Yönetici hesaplarını açan dosya: yokluk/bozukluk, satır satır açma, "Şimdi oku", aralıkla okuma | [yonetici-dosyasi](../sunucu/yonetici-dosyasi.md), [yonetici](../sunucu/bolumler/yonetici.md) | `testdata/admins.json` yazar; doğrudan veritabanı |
| 37 | [test-admin-gizli](test-admin-gizli.md) | Gizli `/admin` panelinin dışarıdan ayırt edilemediği, yönetici çerezi, `app.js`'te yönetim kodu olmaması, `.md` belgelerinin web'den okunmaması | [http](../sunucu/http.md), [yonetim-cerezi](../sunucu/yonetim-cerezi.md) | çalışırken `public/` altına geçici dosya yazar (Dikkat); doğrudan veritabanı |
| 38 | [test-site-ayarlari](test-site-ayarlari.md) | Site ayarları: öncelik sırası, doğrulama, sıfırlama, işlem kaydı; okul adresleri | [site-ayarlari](../sunucu/bolumler/site-ayarlari.md), [site](../sunucu/site.md) | bir bölümü sunucu kodunu kendi sürecinde çağırır; kendi veri klasörü `testdata/site-ayar-deneme/` (oradaki `ayarlar.json` kopyası ve geçici `config.yml`); doğrudan veritabanı |
| 39 | [test-cakisma](test-cakisma.md) | "Aynı kişi iki hesap açamaz": yazım hileleri, aynı anda gelen istekler, kayıttan yedeğe her yol, veritabanı düzeyi | [ortak](../sunucu/ortak.md), [veri/baglanti](../sunucu/veri/baglanti.md), [kayit](../sunucu/bolumler/kayit.md) | doğrudan veritabanı |
| 40 | [test-okul-agi](test-okul-agi.md) | 300 öğrenci tek IP'den aynı anda: 429/503/kopan bağlantı olmamalı; ardından tek saldırganın durdurulması | [guvenlik](../sunucu/guvenlik.md) | `EE_AG_*` değişkenleri; doğrudan veritabanı |
| 41 | [guvenlik-test](guvenlik-test.md) | Güvenlik başlıkları, bot sorusu, şifre kuralı, yol kaçışı, prototip kirlenmesi, giriş kilidi, veli kodu sınırı, iki adımlı giriş | [guvenlik](../sunucu/guvenlik.md), [http](../sunucu/http.md), [kayit](../sunucu/bolumler/kayit.md) | seed'in tam 5 ödevine bağlı |

`test-okul-agi`'nin ek değişkenleri (koddan): `EE_AG_OLCUM=1` uzun ölçüm sürümü (`OLCUM` satırı), `EE_AG_KISI` öğrenci sayısı
(varsayılan 300), `EE_AG_YAYILMA_MS` yayılma süresi (varsayılan 5000, ölçümde 10000), `EE_AG_SALDIRI=0` saldırı bölümleri
olmadan, `EE_AG_VEKIL=1` sunucu ters vekil arkasındaymış gibi. `tumtest.sh` bunların hiçbirini vermez.

### Denetimler (5)

| Denetim | Tür | Ne arar | `tumtest.sh` neyi sorun sayar |
|---|---|---|---|
| [yetki-denetimi](yetki-denetimi.md) | sunuculu | Uçları yedi kimlikle (müdür, öğretmen, öğrenci, veli, yönetici, servisçi, giriş yapmamış) tek tek dener; izni olmayan biri 200/201 alırsa güvenlik açığı. Yalnız yöneticiye ait uçların öteki herkese bilinmeyen adresle aynı 404'ü verdiğine de bakar | `GUVENLIK ACIGI (` satırı; sunucu günlüğünde 500 izi |
| [girdi-denetimi](girdi-denetimi.md) | sunuculu | Bozuk ve kötü niyetli girdiler: prototip kirlenmesi, alan alan bozuk değerler, yol kaçışı, başkasının kaydını düzenleme, başkasının oturumu, başka okulun verisi, yöneticinin site ayarları ve okul adresi, büyük gövde; sonda sunucu ayakta mı. Sunucu 500 vermemeli, sızdırmamalı | `KALDI  ` satırı; sunucu günlüğünde 500 izi |
| [buton-denetimi](buton-denetimi.md) | sunucusuz | Her `data-act` düğmesinin karşılığı, her `data-nav` bağlantısının ve menü anahtarının `SAYFALAR` girdisi, ön yüzün çağırdığı her `/api/<ilk parça>`'nın sunucuda karşılığı | çıkış kodu ≠ 0 ya da `SORUN BULUNDU` |
| [yazim-denetimi](yazim-denetimi.md) | sunucusuz | Sunucu kodu, ön yüz ve yönetim parçaları, `public/index.html` ve `public/kvkk/kvkk.html`'deki tırnak içi metinlerde sık Türkçe yazım hataları; Türkçe harfi olmayan şüpheli cümleler | `<1 ve üstü> yazim hatasi` (şüpheli metinler sorun sayılmaz; çıkış kodu hep 0) |
| [sql-denetimi](sql-denetimi.md) | sunucusuz | SQL'in yalnız `sunucu/veri/` altında olması, veri katmanının istek nesnesini görmemesi, şablon metin kullanılmaması, sorgu metnine yalnız sabit ve izinli parçaların karışması | çıkış kodu ≠ 0 |

Tek başına: sunucusuzlar `node testler/<denetim>.js`; sunuculular aşağıdaki "Tek paketi elle koşmak" adımlarıyla.

### Hazırlık betikleri (paket değil)

- [seed.md](seed.md) — `seed.js`: her sunuculu paketten ve iki sunuculu denetimden önce test okulunu gerçek uçlardan kurar
  (aşağıda "Test hesapları"). Bir adım 2xx dışı dönerse `HATA: …` ile 1 döner; `tumtest.sh` bunu `SEED BASARISIZ` sayar.
- [test-ayarlari.md](test-ayarlari.md) — `test-ayarlari.js`: gerçek kurulumun veritabanı bağlantısını, adı test
  veritabanınınkiyle (`testAd`, `_test` ile bitmeli) değiştirerek `testler/testdata/ayarlar.json`'a yazar. Adı `test-` ile
  başlasa da paket değildir.
- [giris.md](giris.md) — `giris.js`: `module.exports = require('../araclar/giris')`; testler kısa yoldan `require('./giris')`
  yazsın diye.
- [debug-hazirlik.md](debug-hazirlik.md) — `debug-hazirlik.js`: seed'in okuluna elle hata ayıklamak için daha çok veri
  ekler ve beş rolün oturum anahtarını `AD=değer` satırlarıyla basar. `tumtest` listesinde yok; elle.
- [hazirlik-aktarim.md](hazirlik-aktarim.md) — `hazirlik-aktarim.js`: eski bir ekran görüntüsü hazırlığı; sınıf ve ders açar,
  `ornek-ogrenci-listesi.xlsx`'i yeniden yazar. `tumtest` listesinde yok; elle (Dikkat'e bak).

### Test hesapları ve test okulu

Hepsini [seed.md](seed.md) kurar; hepsi uydurma test verisidir ve yalnız test veritabanında vardır. **Şifreler ve e-posta
adresleri burada yazılmaz, [seed.md](seed.md)'deki tabloya bak.** Girişte kullanıcı adı da e-posta da kabul edilir.

| Kullanıcı adı | Kim (uydurma ad) | Rol | Nasıl doğar |
|---|---|---|---|
| `admin` | Sistem Yöneticisi | yönetici | Seed açmaz: sunucu boş veritabanında ilk açılışta kurar, şifreyi `EE_ADMIN_SIFRE`'den alır |
| `mudur` | Mehmet Demir | müdür | yetişkin hesabı + e-posta onayı → kişi kodu → yönetici okulu açıp müdür yapar |
| `mat` | Ayşe Kaya | öğretmen (Matematik) | kendi hesabını açar, müdür kişi koduyla ekler |
| `fen` | Ali Yıldız | öğretmen (Fen Bilimleri) | aynı yol |
| `ogrenci1` | Zeynep Şahin | öğrenci, 6-A | hesabını okul açar |
| `ogrenci2` | Burak Öztürk | öğrenci, 6-A | aynı yol |

Okul: **Test Ortaokulu** (Ankara / Çankaya), adresi `test-ortaokulu`. İçinde 6-A sınıfı (iki öğrenci), her öğretmenin
branşında haftada 4 saatlik ders, beş ödev (ikisi sonuçlandırılmış) ve günün her saatinde açık iki servis dönemi var.
Ayrıntı ve sayılar [seed.md](seed.md)'de.

Paketlerin çoğu bu hesaplarla girer; ama kendi senaryosu için yeni hesap da açar (`hesapAc`, `okulHesabi` ile). Birçok
pakette (`git grep` ile 20 dosya) yeni adlara `Date.now().toString(36)` gibi bir ek konur ki aynı veritabanında çakışmasın. Öğrencilerin T.C. no'su her koşuda
`tcUret()` ile rastgele üretilir; bir test onu biliyormuş gibi davranmamalı, uçtan okumalı.

Ekran görüntüsü araçları ([../araclar/zengin-veri.md](../araclar/zengin-veri.md),
[../araclar/gorsel-veri.md](../araclar/gorsel-veri.md), [../araclar/gezinti.md](../araclar/gezinti.md)) de seed'in
hesaplarıyla ve aynı 3200 test sunucusuyla çalışır.

### Örnek tablo dosyaları

Üçü de depoda ve sentetiktir (içlerinde gerçek kişi yok).

- **`ornek-eski-liste.xls`** (67 584 bayt) — eski Excel (97-2003, `.xls`) biçiminde, LibreOffice ile kaydedilmiş uydurma
  liste. İki sayfa: "Öğrenciler" (başlık + 450 satır) ve "Servisçiler". 900 farklı metin taşıdığı için ortak metin tablosu
  tek kayda sığmaz; okuyucunun devam kayıtlarını (`CONTINUE`) doğru birleştirip birleştirmediği böyle denenir. Okuyan:
  [test-xlsx](test-xlsx.md)'in 8. bölümü — iki sayfa ve Türkçe adları, 451 satır, bütün hücrelerin beklenen değerleri,
  uzantısız adla da dosya imzasından tanınma; aynı dosyanın bozulmuş kopyaları (kesilmiş, kendine dönen sektör zinciri,
  dosya dışını gösteren sektör, imzası doğru ama içi bozuk) bellekte üretilip hata vermesi beklenir. `ec9bc06 commit 396`
  (2026-09-26) ile eklendi.
- **`ornek-eski-sayilar.xls`** (6 144 bayt) — küçük bir `.xls` (veri "mini akış"ta durur). Sayı hücreleri: 11 haneli T.C.
  biçiminde bir sayı, ondalık (`3.5`), eksi (`-7`, `-0.25`) ve gün sayısıyla yazılmış iki tarih (`2012-05-12`,
  `2013-09-01` olarak çözülmeli). Okuyan: yine [test-xlsx](test-xlsx.md) 8. bölüm (`tabloOku` ve `tarihCoz`).
  `1be56c2 commit 397` (2026-09-26) ile eklendi.
- **`ornek-ogrenci-listesi.xlsx`** (2 987 bayt) — [hazirlik-aktarim.md](hazirlik-aktarim.md)'nin ürettiği, hem geçerli hem
  hatalı satırları olan 9 satırlık karışık öğrenci listesi (eski aktarım ekranının fotoğrafı için). **Bugün hiçbir test ya
  da kod okumuyor**; bugünkü kişi aktarımının istediği T.C. sütunu da yok. `12d4131 commit 94` (2026-08-29) ile eklendi,
  o günden beri değişmedi.

Depoda olmayan bir dördüncüsü: **`deneme.xlsx`** — [test-xlsx](test-xlsx.md) her koşuda `testler/` altına yazar
(1. bölümün ürettiği dosya); `.gitignore`'da açıkça yazılı.

### Koşu sırasında oluşanlar (depoya girmez)

- **`testler/testdata/`** — test sunucusunun veri klasörü (`EE_DATA`). `tumtest.sh` her sunuculu paketten önce siler ve
  yeniden açar. İçine `test-ayarlari.js` `ayarlar.json`'u (gerçek veritabanı şifresinin kopyasıyla!), `tumtest.sh`
  `okullar.json`'u koyar; sunucu da çalışırken veri klasörüne ne yazıyorsa (yedekler, teslim dosyaları, ekler, okul
  fotoğrafları…) oraya yazar. Bazı paketler ve araçlar da kendi dosyalarını oraya koyar (ör. `test-yonetici-dosyasi`
  `admins.json`'u; `test-site-ayarlari` `site-ayar-deneme/` klasörünü; `araclar/gezinti.js` `gezinti/` raporunu).
  `.gitignore`: `testler/testdata/`.
- **`testler/test-sunucu.log`** — test sunucusunun çıktısı; her `sunucu_baslat` üzerine yazar (`>`), yani tam koşudan sonra
  yalnız son açılan sunucunun (girdi denetiminin) günlüğü kalır. İçinde test hesaplarının iki adımlı giriş kodları ve
  onay bağlantıları da vardır. `.gitignore`: `*.log`.
- **`testler/deneme.xlsx`** — yukarıda.
- İşletim sisteminin geçici klasöründe: `test-push` (`ee-push-…`) ve `test-vekil-ip` (`ee-vekil-…`) veri klasörleri,
  `test-resim-kucult`'un tarayıcı profili (`ee-kucult-…`).

## Kimle konuşur?

- **`tumtest.sh`'in çağırdıkları:** `netstat`, `taskkill`, `curl`, `node`; [test-ayarlari.md](test-ayarlari.md),
  [seed.md](seed.md), bütün paketler ve denetimler; sunucu olarak kökteki `server.js` ([../server.md](../server.md) →
  [../sunucu/index.md](../sunucu/index.md)).
- **Okudukları:** gerçek `data/okullar.json` (yalnız kopyalar) ve — `test-ayarlari.js` üzerinden — gerçek `data/ayarlar.json`'un
  `veritabani` bölümü. Gerçek veritabanına hiç bağlanmaz.
- **Yazdıkları:** `testler/testdata/`, `testler/test-sunucu.log`; veritabanında yalnız `egitimevi_test` (sunucunun
  `EE_DB_SIFIRLA=1` ile sıfırlaması).
- **`tumtest.sh`'i çalıştıranlar:** `package.json`'daki `"test": "bash testler/tumtest.sh"` (yani `npm test`) ve sen.
  [../TANITIM.md](../TANITIM.md) ("8. Testler ve denetimler", "13. Nasıl çalıştırılır, nasıl test edilir?") ve
  [../belge/KILAVUZ.md](../belge/KILAVUZ.md) ("Testler ve denetimler") onu anlatır.
- **Paketlerin konuştukları:**
  - Sunuculu paketler HTTP ile `http://localhost:3200/api/...` uçlarına gider; hangi bölümü dener ise yukarıdaki tablolarda
    ve paketin kendi `.md`'sinin "Kimle konuşur?" bölümünde yazılı. Yönlendirme tablosu: [../sunucu/api.md](../sunucu/api.md).
  - Giriş ve hesap açma: [giris.md](giris.md) → [../araclar/giris.md](../araclar/giris.md); iki adımlı kodu `EE_LOG`'daki
    günlükten okur.
  - Sunucusuz paketler ve bazı sunuculu paketler sunucu modüllerini doğrudan `require` eder (ör. `sunucu/yardimci/xlsx.js`,
    `sunucu/push.js`, `sunucu/guvenlik.js`, `sunucu/veri/baglanti.js`).
  - Doğrudan veritabanına bağlanan on sunuculu paket (`test-admin-gizli`, `test-cakisma`, `test-kisi-kodu`,
    `test-odev-dosya`, `test-okul-agi`, `test-okul-disk`, `test-quiz`, `test-servis-yoklama`, `test-site-ayarlari`,
    `test-yonetici-dosyasi`) bağlantıyı `test-ayarlari.js`'in yazdığı `testler/testdata/ayarlar.json`'dan alır
    (`test-site-ayarlari` onun bir kopyasından); hepsi bağlanınca veritabanı adının `_test` ile bittiğine bakar. Bitmiyorsa
    kimi o bölümü atlar (ör. `test-kisi-kodu` `ATLANDI`, `test-okul-disk` "mutabakat denenmedi" yazar), kimi
    (`test-admin-gizli`, `test-cakisma`, `test-okul-agi`, `test-yonetici-dosyasi`) `KALDI  test veritabanı değil` yazıp 1 ile
    durur.
- **Testlerin dışından bu klasörü kullananlar:** ekran görüntüsü araçları (yukarıda) ve
  [../araclar/yuk-testi.md](../araclar/yuk-testi.md) (`EE_DATA=testler/testdata` ile aynı test veritabanına bağlanır).

## Nasıl çalışır (adım adım)?

### Tam koşu (`bash testler/tumtest.sh`)

```
==== TESTLER ====
sunucusuz paketler (10)  ─► node testler/<paket>.js  ─► "GECTI: N   KALDI: M" topla
                                                         (satır yoksa: PAKET CALISMADI, KALDI +1)
sunuculu paketler (41), her biri için:
   sunucu_durdur (3200'ü dinleyen süreci öldür)
   rm -rf testler/testdata ; mkdir ; cp data/okullar.json
   node testler/test-ayarlari.js testler/testdata ── hata ─► exit 1 (bütün koşu biter)
   ORTAM = paket_ortami(paket)            (yalnız test-okul-disk: EE_OKUL_DOSYA_GB=0.001)
   sunucu_baslat ORTAM:
       EE_DATA=testler/testdata EE_DB_SIFIRLA=1 EE_ADMIN_SIFRE=… EE_PUSH_GONDERME=0 EE_DIS_ISTEK=0 PORT=3200
       node server.js > testler/test-sunucu.log &      egitimevi_test sıfırlanır, şema kurulur
       /api/meta cevap verene kadar bekle (en çok 20 sn)
   seed.js ── hata ─► SEED BASARISIZ, KALDI +1, sıradaki pakete geç
   env ORTAM EE_BASE=http://localhost:3200 EE_LOG=testler/test-sunucu.log node testler/<paket>.js
   "GECTI: N   KALDI: M" topla        (satır yoksa: PAKET CALISMADI, KALDI +1)
sunuculu denetimler: yetki-denetimi, girdi-denetimi (her biri temiz sunucu + seed)
   GUVENLIK ACIGI ( / "KALDI  " / günlükte "API hatası" ya da "Veritabanı hatası" ─► DENETIM SORUNU +1
sunucu_durdur
sunucusuz denetimler: buton-denetimi, yazim-denetimi, sql-denetimi
   çıkış kodu ≠ 0 / SORUN BULUNDU / "N yazim hatasi" (N ≥ 1) ─► DENETIM SORUNU +1
TOPLAM GECTI / KALDI, DENETIM SORUNU
```

Her sunuculu paketin kendi sunucusu olmasının sebebi betiğin başındaki yorumda yazılı: hız sınırı ve kaba kuvvet kilidi
sayaçları bellekte tutuluyor; paketler aynı sunucuda arka arkaya koşunca birbirini kilitliyordu. Sıfırlanmış veritabanı da
her paketin aynı başlangıçtan (yalnız seed) yola çıkmasını sağlar.

Tam koşu yaklaşık 20 dakika sürer ([../TANITIM.md](../TANITIM.md)'deki tahmin; bu belge için çalıştırılmadı).

### Tek paketi elle koşmak

Sunucusuz bir paket ya da denetim (proje kökünde):

```
node testler/test-quiz-metin.js
node testler/buton-denetimi.js
```

Sunuculu bir paket için `tumtest.sh`'in bir turda yaptığını sırayla yap (Git Bash, proje kökünde):

```
rm -rf testler/testdata && mkdir -p testler/testdata
cp data/okullar.json testler/testdata/            # okul listesi isteyenler için (test-sifre, test-giris-kayit…)
node testler/test-ayarlari.js testler/testdata
EE_DATA=testler/testdata EE_DB_SIFIRLA=1 EE_ADMIN_SIFRE=<seed.md'deki yönetici şifresi> EE_PUSH_GONDERME=0 \
  EE_DIS_ISTEK=0 PORT=3200 node server.js > testler/test-sunucu.log 2>&1 &
for i in $(seq 1 40); do curl -s -o /dev/null http://localhost:3200/api/meta && break; sleep 0.5; done
EE_BASE=http://localhost:3200 EE_LOG=testler/test-sunucu.log node testler/seed.js
EE_BASE=http://localhost:3200 EE_LOG=testler/test-sunucu.log node testler/test-mesaj.js
```

`test-okul-disk` için `EE_OKUL_DOSYA_GB=0.001`'i hem sunucuya hem pakete ver. İşin bitince 3200'deki sunucuyu kapat:
`netstat -ano | grep ":3200" | grep LISTENING` ile süreç numarasını bul, `taskkill //F //PID <numara>`. Bir paketi ikinci
kez koşacaksan önce bu sunucuyu kapat, sonra yukarıdaki adımların hepsini (sunucuyu `EE_DB_SIFIRLA=1` ile yeniden açmak ve
seed dahil) baştan yap: veritabanı ancak sunucu yeniden açılınca sıfırlanır.

### Yeni bir test paketi eklemek

1. **Dosyayı aç:** `testler/test-<konu>.js`. Yukarıdaki "Paketlerin ortak kalıbı"nı kullan: `kontrol(ad, şart, ayrıntı)`,
   `=== N) BÖLÜM ===` başlıkları, sonda tam olarak `  GECTI: <n>   KALDI: <m>` satırı ve `process.exit(kaldi ? 1 : 0)`;
   beklenmeyen hatada `TEST HATASI:` ve çıkış 1.
2. **Sunucu gerekiyor mu karar ver.**
   - Sunucusuz: modülü doğrudan `require` et; veri klasörü gerekiyorsa `require`'dan **önce** `process.env.EE_DATA`'yı
     `fs.mkdtempSync(path.join(os.tmpdir(), 'ee-…'))` gibi geçici bir klasöre çevir (`test-push`, `test-vekil-ip` öyle).
     `testler/` altına dosya yazacaksan adını `.gitignore`'a ekle (`deneme.xlsx` gibi).
   - Sunuculu: `const { iste, girisYap, … } = require('./giris');` ile seed hesaplarıyla gir. Paketin, sıfırlanmış
     veritabanı + seed ile başladığını varsay; başka bir paketin bıraktığı veriye güvenme. Kendi hesaplarına benzersiz ek
     koy. Veritabanına doğrudan bağlanman gerekiyorsa sunucu modüllerini `require` etmeden önce `process.env.EE_DATA`'yı
     `testler/testdata`'ya çevir (bağlantı oradaki `ayarlar.json`'dan gelir) ve bağlandıktan sonra `veritabaniAdi()`'nin
     `_test` ile bittiğini denetle (ör. [test-admin-gizli.md](test-admin-gizli.md)'deki `testDeposu`).
3. **`tumtest.sh`'e ekle:** sunucusuzsa 48. satırdaki `for paket in …` listesine, sunuculuysa 67. satırdaki listeye
   (`guvenlik-test`'ten önce bir yere). Sunucunun ya da paketin ek bir ortam değişkenine ihtiyacı varsa `paket_ortami`'ye bir
   `test-<konu>) echo "AD=değer" ;;` satırı yaz; o değişken hem sunucuya hem pakete gider. Listede olmayan paket hiç koşmaz.
4. **Belgesini yaz:** yanına `testler/test-<konu>.md` (öteki paket belgeleriyle aynı bölümler, ilk satır
   `# testler/test-<konu>.js`); bu dosyadaki tablolara bir satır ekle; korunan kod dosyalarının `.md`'lerindeki "Testleri"
   bölümüne paketi yaz. [../TANITIM.md](../TANITIM.md)'nin belge haritasına da satır gerekir.
5. **Dene:** önce tek başına (yukarıdaki adımlar), sonra `bash testler/tumtest.sh` → `KALDI: 0`, `DENETIM SORUNU: 0`.
   Yeni bir uç eklediysen `yetki-denetimi`'ne (kim çağırabilir) ve `girdi-denetimi`'ne (bozuk gövde) de satır eklemeyi
   unutma; yeni bir düğme ya da sayfa eklediysen `buton-denetimi` onu kendiliğinden görür.

## Dikkat!

- **Gerçek veriye dokunmamak için iki kilit var, ikisini de bozma.** `test-ayarlari.js` `testAd` yoksa ya da `_test` ile
  bitmiyorsa hiçbir şey yazmaz; sunucu da `EE_DB_SIFIRLA=1` ile açılınca yalnız adı `_test` ile biten veritabanını siler,
  öbüründe hata verip açılmaz. Testleri koşacağın kabukta `DATABASE_URL` tanımlı olmasın: tanımlıysa sunucu `ayarlar.json`'a
  hiç bakmaz ve test adı boşa gider (o zaman yalnız ikinci kilit kalır). `EE_DB_SIFIRLA`'yı ve `EE_ADMIN_SIFRE`'yi gerçek
  sunucuda asla verme.
- **3200'ü dinleyen her şey öldürülür.** `sunucu_durdur` portu kimin tuttuğuna bakmaz; 3200'de başka bir iş (ör. elle açtığın
  bir test sunucusu, bir araç) varsa kapanır. Aynı anda iki `tumtest.sh` koşma: biri ötekinin sunucusunu ve veri klasörünü
  siler. Koşuyu Ctrl+C ile yarıda kesersen 3200'deki son sunucu açık kalır (bir sonraki koşu onu kendisi kapatır, ya da
  elle kapat). Arama `grep ":3200"` olduğu için 32000 gibi `:3200` ile başlayan bir portu dinleyen süreç de yakalanabilir.
- **Kendi 3000'deki sunucun güvende, ama yardımcıların varsayılanı 3000.** `araclar/giris.js` ve `seed.js` `EE_BASE`
  verilmezse `http://localhost:3000`'e gider. Bir paketi ya da seed'i elle koşarken `EE_BASE=http://localhost:3200`'ü unutursan
  gerçek veritabanına test hesapları, okul ve ödevler açılır.
- **`tumtest.sh`'in çıkış kodu sonucu söylemez.** Yalnız `test-ayarlari.js` hata verirse 1 ile çıkar; paketler kalsa da,
  denetim sorunu olsa da son komut `echo` olduğu için 0 döner. `npm test`'in "başarılı" bitmesi bir şey kanıtlamaz; sondaki
  `KALDI` ve `DENETIM SORUNU` satırlarını oku.
- **Çöken sunuculu denetim sorun sayılmaz.** `yetki-denetimi` ya da `girdi-denetimi` hazırlıkta çökerse (`DENETIM HATASI: …`)
  çıktıda aranan kalıplar geçmez ve `tumtest.sh` bu döngüde ne denetimin ne de seed'in çıkış kodunu denetler; yalnız sunucu
  günlüğündeki 500 izi yakalanır. Ayrıntı [yetki-denetimi.md](yetki-denetimi.md) ve [girdi-denetimi.md](girdi-denetimi.md)'de.
  Bu denetimlerin çıktısında hiçbir satır görmüyorsan şüphelen, tek başına çalıştır.
- **Çöken paket tek bir "kaldı" sayılır.** `PAKET CALISMADI` olan bir paketin içinde kaç denetim olursa olsun toplama yalnız
  1 eklenir; toplam `KALDI` küçük görünse de bir paketin hiç koşmamış olabileceğine bak.
- **Çıktı kırpılır.** Sunuculu bir paketin yalnız ilk 8, sunucusuz bir paketin ilk 5 `KALDI`/`HATASI` satırı gösterilir;
  gerisini görmek için paketi tek başına çalıştır. Sunuculu paketlerde özet satırı iki kez görünür (bir kez `KALDI`
  süzgecinden, bir kez özet olarak); bu bir hata değil.
- **Sessizce atlananlar.** `test-resim-kucult` Edge/Chrome bulamazsa, `test-gizli-dosyalar` `git` bulamazsa `GECTI: 0   KALDI: 0`
  ile biter; `tumtest.sh` çıktısında "ATLANDI" satırı görünmez (süzgeçten geçmez), yalnız sıfırlar görünür. Bu iki paketin
  satırında `GECTI: 0` görürsen ortamı denetle.
- **Okul listesi gerçek kurulumdan gelir.** `data/okullar.json` yoksa kopyalama sessizce atlanır; o zaman okul listesi isteyen
  denetimler (ör. `test-sifre`'nin "okul listesi yüklendi", `test-giris-kayit`'in okul araması) kalır.
- **`data/ayarlar.json`'da `testAd` yoksa hiçbir sunuculu test koşmaz:** ilk sunuculu pakette `test-ayarlari.js` hata verir,
  betik `exit 1` ile durur. Çözüm `npm run veritabani-kur` ([../araclar/veritabani-kur.md](../araclar/veritabani-kur.md)).
- **Paketler temiz veritabanı ister.** Seed aynı veritabanında ikinci kez hiç çalışmaz: `mudur` hesabını yeniden açmaya
  çalışır, kayıt "Bu e-posta zaten kayıtlı" ile reddedilir, seed `HATA: …` ile 1 döner. Paketler de sabit adlarla açtıkları
  sınıf ve hesaplarda aynı çakışmaya düşebilir. Elle koşarken her seferinde sıfırla.
- **`testler/testdata/ayarlar.json`'da gerçek veritabanı şifresi durur.** Klasör `.gitignore`'da; başka yere kopyalama,
  paylaşma. `test-sunucu.log`'da da test hesaplarının giriş kodları vardır.
- **`test-admin-gizli` çalışırken `public/` altına geçici dosya yazar.** `.md` belgelerinin web'den okunmadığını denemek için
  `public/`, `public/js/` ve `public/kvkk/` altına `zz-belge-denetimi-<süreç no>.md` (ve bir `.txt`) yazar, süreç biterken siler.
  Paket zorla öldürülürse bu dosyalar kalabilir; `git status`'ta görürsen sil.
- **`hazirlik-aktarim.js`'i rastgele çalıştırma.** Depoda izlenen `ornek-ogrenci-listesi.xlsx`'in üzerine yazar (bugün aynı
  baytları üretse de) ve `EE_BASE` verilmezse 3000'deki gerçek sunucuna sınıf açar. `debug-hazirlik.js` oturum anahtarlarını
  düz metin basar.
- **Windows'a bağlı.** `netstat -ano`, `taskkill //F //PID` ve `curl` Git Bash'te bu biçimde çalışır; Linux'ta `sunucu_durdur`
  uyarlanmalı.
- **`.gitignore`'da eski iki kural:** `testler/chrome-*/` ve `testler/*.birlesik.*`. Bugün `testler/` ve `araclar/` altında bu
  adlarla bir şey yazan kod yok (`git grep` ile bakıldı); zararsız kalıntılar.
- **`yazim-denetimi` her zaman 0 ile çıkar;** sorun sayılması `tumtest.sh`'in çıktıdaki `N yazim hatasi` satırını okumasına
  bağlıdır. Satırın biçimini değiştirirsen `tumtest.sh`'teki kalıbı da değiştir. Aynı şey paketlerin `GECTI: N   KALDI: M`
  satırı için de geçerli.

## Testleri

- `tumtest.sh`'in kendi testi yok; bozulursa ilk koşuda görünür (`SUNUCU ACILMADI`, `SEED BASARISIZ`, `PAKET CALISMADI` ya da
  `exit 1`).
- [test-gizli-dosyalar.md](test-gizli-dosyalar.md) — `testler/testdata/ayarlar.json`'un git tarafından yok sayıldığını ve izlenen
  hiçbir dosyanın gizli kurallara takılmadığını denetler.
- Seed'in bozulması her sunuculu pakette `SEED BASARISIZ` olarak görünür ([seed.md](seed.md)).
- Belgeler için planlı `testler/test-belgeler.js` (henüz yok): her `.js`'in yanında `.md` var mı, bölümler tam mı, klasör
  belgeleri (bu dosya dahil) klasördeki her kod dışı dosyayı anıyor mu.
- Elle: `bash testler/tumtest.sh` (ya da `npm test`) → her paket için `--- <paket> ---` başlığı ve `GECTI: N   KALDI: 0`;
  sonda `TOPLAM  GECTI: …   KALDI: 0` ve `DENETIM SORUNU: 0`.
- Bu belge yazılırken hiçbir test, sunucu ya da `tumtest.sh` çalıştırılmadı (paralel belgeleme kuralı: bu şeridin sunucu
  açma yetkisi yoktu). Yukarıdaki her şey `tumtest.sh`'in, paketlerin ve yardımcıların koduna bakılarak yazıldı; paketlerin
  denetim sayıları ve son koşu sonuçları her paketin kendi `.md`'sinde.

## Son durum

- **Klasör:** `git log -- testler` son commit'ler `1daa378 commit 565`, `b263bb2 commit 564`, `0b64d92 commit 563`,
  `39515a4 commit 562` ve `ea9a713 commit 560` (hepsi 2026-10-03): yalnız belge ekledi — 560 denetimlerin ve hazırlık
  betiklerinin `.md`'lerini (10 dosya), 562 `test-admin-gizli` … `test-bildirim` (7), 563 `test-cakisma` … `test-giris-kayit` (6),
  564 `test-gizli-dosyalar` … `test-nakil` (8), 565 `test-odev-dosya`, `test-odev-saat`, `test-okul-agi`, `test-okul-disk` (4).
  Böylece 35 belge depoda; kalan 26 paket belgesi ve bu dosya bu belgeleme işinde yazıldı, henüz commit'lenmedi.
- **Son kod değişikliği:** `920986f commit 526` (2026-09-27) — `test-admin-gizli.js`'e "1b) BELGELER (.md) WEB'DEN OKUNMAZ"
  bölümü eklendi (`public/` altına geçici `.md` yazıp bilinmeyen adresle bayt bayt aynı 404'ü bekler).
- **`tumtest.sh` (11 commit):**
  - `40fc7e7 commit 525` (2026-09-27): sunucusuz listeye `test-resim-kucult`, sunuculu listeye `test-okul-disk` eklendi;
    `paket_ortami`'deki `EE_OKUL_DOSYA_GB=0.001` `test-odev-dosya`'dan `test-okul-disk`'e taşındı (yorum: varsayılan okul disk
    sınırı ortam değişkeninden, "ortam" kaynağı küçük dosyalarla denensin).
  - `566b917 commit 524` (2026-09-27): `paket_ortami` işlevi doğdu (ilk girdisi `test-odev-dosya`); `sunucu_baslat` ek bir
    değişken alıp alt kabukta `export` eder oldu; paket de `env $ORTAM …` ile aynı değişkenle çalışır oldu; sunuculu listeye
    `test-okul-agi` eklendi.
  - `276c0a0 commit 521` (2026-09-27): sunuculu listeye `test-yonetici-dosyasi`, `test-admin-gizli`, `test-site-ayarlari`,
    `test-cakisma` eklendi. Ondan önce 520 `test-gizli-dosyalar`'ı, 519 `test-quiz-metin` ve `test-quiz`'i, 518
    `test-servis-pencere` ve `test-servis-yoklama`'yı ekledi.
- **Örnek dosyalar:** `ornek-ogrenci-listesi.xlsx` commit 94 (2026-08-29), `ornek-eski-liste.xls` commit 396,
  `ornek-eski-sayilar.xls` commit 397 (2026-09-26); üçü de o günden beri değişmedi.
- **Bilinen açıklar (kod değiştirilmedi):** çıkış kodunun sonuca bağlı olmaması; çöken sunuculu denetimin sorun sayılmaması;
  `ornek-ogrenci-listesi.xlsx`'in kullanılmaması ve bugünkü aktarım biçimine uymaması (ya güncellenmeli ya `hazirlik-aktarim.js`
  ile birlikte kaldırılmalı — kullanıcıya sorulacak).
- **Planlı işlerden bu klasörü etkileyecekler:**
  - "Belgeleme" son parçası: `testler/test-belgeler.js` (sunucusuz) yazılıp sunucusuz listeye eklenecek.
  - "TAM DEBUG" (Linux'ta): testler Linux'ta koşacak; `sunucu_durdur`'daki `netstat`/`taskkill` uyarlanmalı.
  - "Sistem" (yöneticiye zorunlu doğrulama uygulaması, TOTP): yöneticinin e-postasını anan 25 paket ve denetim var (`git grep`
    ile sayıldı; `seed.js` ve `debug-hazirlik.js` bunlara ek); çoğu yönetici olarak girer. Yönetici girişi doğrulama
    uygulaması isterse günlükteki e-posta koduyla girilemez; `araclar/giris.js`'in yönetici girişi ve bu paketler ona göre
    değişmeli (tanım yeni TOTP paketini RFC 6238 test vektörleriyle istiyor).
  - "T.C. kimlik no bütün hesaplarda zorunlu" (kod Linux'ta): seed'in ve `hesapAc` kullanan paketlerin kayıtları T.C. göndermeli.
  - "Çalışan olarak ekleme": kişi koduyla eklenen öğretmen rolsüz gelecek; seed ve öğretmen ekleyen paketler ona ayrıca
    Öğretmen rolü vermeli.
  - "Kulüpler kaldırılacak": `test-okul-hayati` (kulüpler bölümü), `test-yedek` ve `yetki-denetimi`'ndeki kulüp satırları
    çıkacak.
  - Yeni özelliklerin her biri (güvenlik denetimi, saklama süreleri, mesaj ayarları, toplantılar, çok dil…) yeni paket ya da
    mevcut paketlere bölüm getirecek; yukarıdaki "Yeni bir test paketi eklemek" adımları geçerli.
