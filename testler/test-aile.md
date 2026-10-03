# testler/test-aile.js

"Eğitim Evi Aile" özelliğini (çocuğun telefonundan konum ve ekran süresi, velinin ayarları ve süre sınırı bildirimi)
gerçek uçlardan deneyen sunuculu test paketi (39 denetim).

## Bu dosya ne yapar?

Aile özelliğinde öğrencinin telefonundaki uygulama, öğrencinin kendi açık onayıyla bağlanır ve sonra yalnız bu iş için
verilmiş 64 haneli bir **cihaz anahtarıyla** (`X-Aile-Cihaz` başlığı) konum ve uygulama kullanım sürelerini gönderir. Veli
sitenin "Aile" sayfasında bunları görür, gönderme sıklığını ve süre sınırlarını seçer; sınır aşılınca günde bir kez haber
alır. Okul (müdür, öğretmen) bu verileri görmez. Sunucu tarafı [../sunucu/bolumler/aile.md](../sunucu/bolumler/aile.md).

Bu paket o kuralların her birini dener. Dosya başı yorumu sözünü şöyle özetliyor: telefonu yalnız öğrenci kendi açık
onayıyla bağlar; anahtar yalnız cihaz uçlarına yarar; konum ve kullanım doğrulanır (aralık, zaman, paket adı, sayı
sınırları); veli ayar ve sınır seçer; sınır aşılınca veliye günde bir kez bildirim; okul ve bağlı olmayan veli göremez;
bağlantı kaldırılınca anahtar çalışmaz.

Mahremiyet açısından en önemli denetimler: anahtarın oturum yerine geçmemesi, okulun 403 alması ve kaldırılan anahtarın
hemen işe yaramaz olması.

## İçinde neler var?

### Yardımcılar

- `kontrol(ad, sart, detay)` — `GECTI`/`KALDI` satırı. `J(x)` — kısaltılmış JSON (220 harf).
- `trBugun()` — Türkiye takvimine göre bugün: `Date.now() + 3 saat`'in UTC günü (`YYYY-AA-GG`). Sunucu da "bugün"ü
  Türkiye saatiyle hesaplar (`trGun`), ikisi aynı günü bulur.
- `cihaz(yol, yontem, govde, anahtar)` — telefonun uçlarına `fetch`: `BASE + '/api/aile/cihaz/' + yol`; `anahtar`
  verilirse `X-Aile-Cihaz` başlığına konur (verilmezse başlık hiç gönderilmez). Döner `{ status, body }` (gövde JSON
  değilse `{}`).

Ortak yardımcılar [giris.md](giris.md) üzerinden: `iste`, `girisYap`, `hesapAc`, `BASE`.

### Hazırlık

- Seed hesaplarıyla giriş ([seed.md](seed.md)): müdür (`M`), Matematik öğretmeni (`O`), öğrenci Zeynep Şahin (`S`,
  kullanıcı adı `ogrenci1`); öğrencinin `/api/me` bilgisi (`s`: kimliği ve veli kodu `s.code`).
- `aveli<zaman>` adlı yeni bir yetişkin hesabı açılır ve öğrencinin veli koduyla ona bağlanır (`POST /api/parent/link`) →
  çocuğun velisi `V`.
- `yabanci<zaman>` adlı ikinci bir yetişkin hesabı açılır ama hiçbir çocuğa bağlanmaz → `Y` ("bağlı olmayan veli"; bkz.
  "Dikkat!").

### 1) Telefonu bağlama (6 denetim)

- Öğrenci `onay` vermeden `POST /api/aile/cihaz` → 400.
- Veli kendi hesabıyla bağlamaya çalışır → 403 (telefon çocuğun kendi hesabıyla bağlanır).
- Öğrenci `{ ad: 'Samsung A51', platform: 'android', surum: '13', onay: true }` ile bağlar → 200, 64 onaltılık haneli
  `cihazAnahtari`, varsayılan ayar (Wi-Fi 5 dk, mobil 15 dk).
- Velinin bildirimlerinde "… telefonunu (Samsung A51) Eğitim Evi Aile …" var.
- Anahtar `Authorization` başlığında oturum gibi kullanılınca `/api/me` hesap vermez (401 ya da `user` yok).
- Anahtar telefon uygulamasının kendi anahtarlı ucunda (`/api/cihaz/bildirimler`, `X-Cihaz` başlığı) 401 alır: iki
  anahtar türü birbirinin yerine geçmez.

### 2) Cihaz uçları (8 denetim)

- `GET /api/aile/cihaz/ayar`: anahtarsız, yanlış (64 tane `a`) ve biçimsiz (`' OR 1=1 --`) anahtarla 401; doğru anahtarla
  200 ve `konumAcik: true`.
- `POST …/konum`: sekiz öğeli bir listeden yalnız iki geçerli konum alınır (`alinan: 2`) — atılanlar: enlem 200, 8 gün önceki
  zaman, 1 saat sonraki zaman, metin zaman ("dün"), düz metin öğe, `null`. Aynı iki konum yeniden gönderilince `alinan: 0`
  (aynı zaman damgası ikinci kez yazılmaz). 600 konumluk bir istekte `alinan: 500` (bir istekte en çok 500).
- `POST …/kullanim`: bugün için beş uygulama (YouTube 95 dk, Instagram 50 dk, boşluklu bozuk paket adı, adı
  `<img src=x onerror=alert(1)>` olan `com.oyun` 20 dk, 5000 dakikalık `com.fazla`) ve 2020'den bir gün → `alinan: 3`
  (bozuk paket adı, 1440'ı aşan dakika ve eski gün atıldı).

### 3) Veli: özet ve ayar (15 denetim)

- `GET /api/aile/ozet?studentId=` (veli): son konum en yenisi (mobil, enlem 39.93); bugünün listesi büyükten küçüğe
  (ilk YouTube, üç uygulama); 8 günlük çizelge, son gün bugün, bugün toplam **165 dk** (95 + 50 + 20); `<img…` adı olduğu
  gibi düz metin saklanmış (kaçışı ön yüz yapar); bağlı cihaz adıyla ve son görülme zamanıyla görünüyor.
- Özete bakamayanlar, hepsi 403: `Y`, müdür, öğretmen ve öğrencinin kendisi.
- `POST /api/aile/ayar` hataları: Wi-Fi aralığı 2 dk (listede yok) → 400; toplam sınır 3 dk (5'ten az) → 400; paket adı
  `a b` olan sınır → 400; `Y` yazmaya çalışır → 403.
- Geçerli ayar: Wi-Fi 1, mobil 30 dk, konum ve kullanım açık, toplam sınır 120 dk, YouTube ve Instagram için 60'ar dk →
  200, ayar ve iki sınır dönüyor. Telefon `GET …/ayar` ile yeni aralıkları (1 ve 30) alıyor.

### 4) Sınır aşılınca veliye bildirim, günde bir kez (5 denetim)

Telefon bugünün kullanımını yeniden gönderir: YouTube 100 dk, Instagram 40 dk. Sunucu satırları (gün + paket) üzerine
yazdığı için 2. bölümdeki `com.oyun`'un 20 dakikası durur; toplam 100 + 40 + 20 = **160 dk**.

- Velide tam bir tane "… telefonda toplam 2 sa 40 dk geçirdi (sınır 2 sa)" ve tam bir tane "… YouTube uygulamasında
  1 sa 40 dk geçirdi (sınır 1 sa)" bildirimi var; Instagram (40 < 60) için bildirim yok.
- YouTube 130 dk'ya çıkınca aynı gün ikinci bildirim gitmiyor (ikisi de hâlâ birer tane).
- YouTube bildiriminin bağlantısı `#/aile?c=<öğrenci kimliği>` (veliyi Aile sayfasına götürür).

### 5) Paylaşım kapalı, bağlantı kaldırma (5 denetim)

- Veli konumu kapatır (`konumAcik: false`) → telefonun konumu `{ alinan: 0, kapali: true }` alır.
- `POST /api/aile/cihaz-kaldir`: `Y` → 403; veli → 200; kaldırılan anahtarla `…/ayar` → 401.
- Öğrenci ikinci bir telefon bağlar ("Yeni telefon"), telefon kendi bağlantısını `POST /api/aile/cihaz/sil` ile kaldırır →
  200, o anahtar da artık 401.

Sonunda `GECTI: N   KALDI: M`; `KALDI` varsa çıkış kodu 1, beklenmeyen hata `TEST HATASI:` ve çıkış kodu 1.

## Kimle konuşur?

- **Modüller:** yalnız [giris.md](giris.md) (`araclar/giris.js`) ve Node'un genel `fetch`'i.
- **Sunucu uçları:**

  | Uç | Kim | Belge |
  |---|---|---|
  | `POST /api/aile/cihaz` | öğrenci (oturumla) | [../sunucu/bolumler/aile.md](../sunucu/bolumler/aile.md) |
  | `GET /api/aile/cihaz/ayar`, `POST /api/aile/cihaz/konum`, `POST /api/aile/cihaz/kullanim`, `POST /api/aile/cihaz/sil` | telefon (`X-Aile-Cihaz`) | [../sunucu/bolumler/aile.md](../sunucu/bolumler/aile.md) |
  | `GET /api/aile/ozet`, `POST /api/aile/ayar`, `POST /api/aile/cihaz-kaldir` | veli | [../sunucu/bolumler/aile.md](../sunucu/bolumler/aile.md) |
  | `GET /api/cihaz/bildirimler` | telefon uygulamasının anahtarı (`X-Cihaz`) — burada geçmemesi denenir | [../sunucu/bolumler/cihaz.md](../sunucu/bolumler/cihaz.md) |
  | `POST /api/parent/link` | veliyi çocuğa bağlama | [../sunucu/bolumler/veli.md](../sunucu/bolumler/veli.md) |
  | `GET /api/notifications` | velinin bildirimleri | [../sunucu/bolumler/kayit.md](../sunucu/bolumler/kayit.md) |
  | `GET /api/me`, `POST /api/register`, `POST /api/eposta-onay`, giriş uçları | hesaplar | [../sunucu/bolumler/kayit.md](../sunucu/bolumler/kayit.md) |

- **Gizli kapılar:** anahtarlı uçların oturum kapılarına uğramadan `aile.cihazUclari`'na gitmesi ve rolsüz hesabın
  `/api/aile`'ye 403 alması [../sunucu/api.md](../sunucu/api.md)'dedir.
- **Tablolar** (dolaylı, şema 026): `aile_cihazlari`, `aile_ayarlari`, `aile_sinirlari`, `aile_konumlari`,
  `aile_kullanim`, `aile_uyarilari` ([../sunucu/veri/depo/aile.md](../sunucu/veri/depo/aile.md)); ayrıca `bildirimler`,
  `veli_baglari`, `kullanicilar`.
- **Ön yüz:** velinin Aile sayfası [../public/js/parcalar/27b-aile.md](../public/js/parcalar/27b-aile.md) (bu pakette
  doğrudan denenmez; gösterdiği veri bu uçlardan gelir). Android tarafı (ayrı depo) aynı telefon uçlarını kullanır.
- **Onu çalıştıran:** `testler/tumtest.sh`, sunuculu paket döngüsünde (`test-siniflarim`'den sonra, `test-odev-dosya`'dan
  önce); önce sıfırlanmış veritabanı ve [seed.md](seed.md).

## Nasıl çalışır (adım adım)?

```
hazırlık: M, O, S girişleri ; V = yeni yetişkin + parent/link(öğrencinin veli kodu) ; Y = yeni yetişkin (bağsız)
1) S: aile/cihaz {onay yok} 400 ; V: 403 ; S: {onay:true} ─► anahtar (64 hex)
   V'nin bildirimi ; anahtar ≠ oturum ; anahtar ≠ X-Cihaz
2) cihaz(ayar): anahtarsız/yanlış/biçimsiz 401, doğru 200
   cihaz(konum): 8 öğe → 2 ; tekrar → 0 ; 600 → 500
   cihaz(kullanim): 5 uygulama + eski gün → 3
3) V: ozet (son konum, bugün 165 dk, 8 gün, düz metin ad, cihaz) ; Y/M/O/S: 403
   V: ayar hataları 400, Y 403 ; geçerli ayar ─► telefon yeni aralığı görür
4) cihaz(kullanim) YouTube 100, Instagram 40 (+ oyun 20) ─► V: "toplam 2 sa 40 dk", "YouTube 1 sa 40 dk"
   YouTube 130 ─► yeni bildirim yok ; bağlantı #/aile?c=<öğrenci>
5) V: konum kapalı ─► alinan 0 ; Y kaldıramaz ; V kaldırır ─► anahtar 401
   S: ikinci telefon ─► cihaz(sil) ─► o anahtar da 401
```

## Dikkat!

- **"Bağlı olmayan veli" aslında rolsüz bir hesap.** `Y` yalnız kayıt olmuş, hiçbir çocuğa bağlanmamış bir yetişkin;
  rolü boş olduğu için `/api/aile/...` isteği bölüme hiç ulaşmaz, [../sunucu/api.md](../sunucu/api.md)'deki rolsüz kapısından
  403 `rolsuz` alır. Yani "bağlı olmayan veli 403", "bağlı olmayan veli ayar yazamaz 403" ve "bağlı olmayan veli kaldıramaz
  403" denetimleri `aile.js`'in veli bağı denetimini (`bagliMi` → "Bu öğrencinin velisi değilsin") değil, rolsüz kapısını
  sınıyor. Veli bağı denetimini bu pakette müdür ve öğretmen denetimleri (ikisi de rollü) sınıyor; **başka bir çocuğun
  gerçek velisinin** (rolü `parent` olan) bu öğrencinin verisine bakamadığı ayrıca denenmiyor. Kapatmak için `Y`'yi seed'in
  ikinci öğrencisine (`ogrenci2`) bağlamak yeterli olurdu. (Kod okumasına göre; kod değiştirilmedi.)
- **Bugünün toplamı önceki bölümden taşınır.** 4. bölümdeki "2 sa 40 dk" 100 + 40 + **20** dakikadır; 20, 2. bölümde
  gönderilen `com.oyun`'dan gelir. 2. bölümdeki kullanım listesini değiştirirsen 4. bölümün beklediği metin de değişir.
- **Gün değişimi:** `bugun` 2. bölümde bir kez hesaplanır (`trBugun()`). Türkiye saatiyle tam gece yarısında (00:00
  civarı) çalışırsa sunucunun "bugün"ü paketin ortasında değişebilir; 3. bölümdeki "son gün bugün" ve 4. bölümdeki
  bildirimler (günde bir kez anahtarı) şaşar. Gece yarısını kapsayan bir koşuda tek seferlik `KALDI` görürsen yeniden
  koştur.
- **Konum zamanları test başındaki saate göredir** (`simdi - 20 dk`, `simdi - 5 dk`); sunucu 5 dakikadan ileri zamanı
  atar. Test makinesiyle sunucu aynı makinede olduğu için saat farkı yoktur; ayrı makinelerde saatler kaymışsa konum
  denetimleri şaşabilir.
- **600 konum isteği** sunucunun gövde süzgeci (dizileri 500'de keser) ve `aile.js`'in kendi 500 sınırının birlikte
  sonucudur; hangisinin kestiği bu testten anlaşılmaz.
- Paket her koşuda yeni iki yetişkin hesabı açar (`aveli…`, `yabanci…`); adlar zaman damgalı olduğu için aynı veritabanında
  tekrar koşmak çakışmaz, ama `tumtest.sh` zaten her paketten önce veritabanını sıfırlar.
- **Varsayılan adres 3000.** `EE_BASE` vermeden çalıştırırsan bu paket kendi sunucunda hesap açar, telefon bağlar; her zaman
  test sunucusunu kullan.

## Testleri

- Bu dosyanın kendisi testtir; `testler/tumtest.sh` her tam koşuda çalıştırır. Aynı alanda: `testler/test-servis-yoklama.js`
  (telefon uygulamasının `/api/cihaz` ile aldığı anahtar `X-Aile-Cihaz` başlığına konup `GET /api/aile/cihaz/ayar`'a
  gönderilince 401 — bu paketin 1. bölümündeki denetimin tersi).
  Aile uçlarını başka paket denemiyor (`testler/` altında grep, 3 Ekim); 7 günlük temizlik (`depo.aile.temizle`) hiçbir
  pakette denenmiyor.
- Elle (Git Bash, proje kökünde; 3200'de seed'lenmiş test sunucusu varken):

  ```
  EE_BASE=http://localhost:3200 EE_LOG=testler/test-sunucu.log node testler/test-aile.js
  ```

- 3 Ekim sabahı bu belge için 3200'de, sıfırlanmış `egitimevi_test` ve seed'le koşuldu: `GECTI: 39   KALDI: 0`, yaklaşık 3
  saniye; sunucu günlüğünde `API hatası` yok.

## Son durum

- `git log`: 2 commit.
  - `24050a2 commit 518` (2026-09-27, servis yoklaması ve telefon uygulamasının anahtarlı uçları): 1. bölüme bir denetim
    eklendi — Aile anahtarıyla `GET /api/cihaz/bildirimler` (`X-Cihaz`) 401 almalı (iki anahtar türü karışmasın).
  - `c7acd2d commit 463` (2026-09-26): dosya 151 satır olarak eklendi (velinin Aile sayfası `27b-aile.js` ve
    `33-aile.css` ile aynı commit'te).
- Açık iş: yukarıdaki "bağlı olmayan veli = rolsüz hesap" kapsam boşluğu (kod değiştirilmedi).
- Planlı işler: "Android yerel uygulama (bütün roller)" Aile tarafını uygulamada genişletecek; tanımda sunucu uçlarında
  değişiklik yazılı değil, yani bu paketin denediği uçlar aynı kalmalı. "Optimizasyon + saklama süreleri" genel saklama
  kuralları getirecek; Aile verisinin 7 günlük silinmesi bugün `aile.js`/depo tarafında ve bu pakette denenmiyor. "KVKK ve
  onay metinleri TAM denetimi" konum ve ekran süresinin aydınlatma metnindeki karşılığına bakacak; uçlar değişirse bu
  paket de güncellenmeli.
