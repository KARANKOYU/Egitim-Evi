# testler/hazirlik-aktarim.js

Excel aktarım ekranının fotoğrafı için ortam kuran eski hazırlık betiği: müdürle girip 9-A, 9-B, 10-A sınıflarını ve her
sınıfa Matematik, Türkçe, Fen Bilimleri derslerini açar, hem geçerli hem hatalı satırları olan örnek bir öğrenci listesini
`testler/ornek-ogrenci-listesi.xlsx` olarak yazar ve müdürün oturum anahtarıyla dosyanın base64'ünü ekrana basar.

## Bu dosya ne yapar?

Toplu aktarım ekranının fotoğrafında boş bir rapor değil, gerçekçi bir sonuç görünsün istenmiş: hem eklenecek satırlar hem
de neden eklenemeyeceği yazılı hatalı satırlar ("Ekranda hem gecerli hem hatali satirlar gorunsun diye karisik bir liste").
Bunun için iki şey gerekir: okulda satırlardaki sınıfların bir kısmı olsun, bir kısmı olmasın; ve elde karışık bir liste olsun.
Dosyanın ilk satırlarındaki yorum işi böyle özetler: "Ekran goruntusu icin ortam hazirlar: sinif, ders, ornek Excel dosyasi.
Mudur oturum anahtarini ve ornek dosyanin base64'unu basar."

Ekrana üç satır basar; anahtar ve base64, dosyayı aktarım ekranına ya da doğrudan uca yükleyecek bir sonraki adım içindir:

```
TOKEN=<müdürün oturum anahtarı>
B64=<xlsx dosyasının base64'ü, yaklaşık 4 000 karakter>
DOSYA=<…>/testler/ornek-ogrenci-listesi.xlsx
```

Bugün bu betiği hiçbir dosya çağırmıyor (`git grep` ile bakıldı); ekran görüntüleri artık [../araclar/gezinti.md](../araclar/gezinti.md)
ile çekiliyor. Üstelik yazdığı liste bugünkü öğrenci aktarımının biçimine uymuyor ("Dikkat!"e bak). [../TANITIM.md](../TANITIM.md)
onu "`tumtest` listesinde değil; elle deneme ve ekran görüntüsü için" diye anar.

## İçinde neler var?

Dışa açılan bir şey yok; tek bir `async` blok.

### Sunucuda kurdukları (müdürle, `mudur@test.com`)

1. `POST /api/school/class` ile `9-A`, `9-B`, `10-A`.
2. `GET /api/school/classes` ile **okulun bütün sınıfları** (seed'in `6-A`'sı dahil), her birine `Matematik`, `Türkçe`,
   `Fen Bilimleri` dersi, haftada 4 saat (`POST /api/school/lesson`). Öğretmen atanmaz.

### Yazdığı liste

Tek sayfa, adı `Öğrenciler`; başlıklar `Ad Soyad`, `Kullanıcı adı (e-posta)`, `Şifre`, `Sınıf`, `Müdür notu`; sütun
genişlikleri `[26, 30, 16, 12, 34]`. Dokuz satır (adlar uydurmadır):

| # | Ad Soyad | Kullanıcı adı | Şifre | Sınıf | Not | İçerikten anlaşılan amaç |
|---|---|---|---|---|---|---|
| 1 | Elif Kara | `elif.kara@okul.com` | `Okul2026x` | 9-A | Kaydı tamamlandı | geçerli |
| 2 | Can Aydın | `can.aydin@okul.com` | `Okul2026y` | 9-A | | geçerli |
| 3 | Deniz Yalçın | `deniz.yalcin@okul.com` | `Okul2026z` | 9-B | | geçerli |
| 4 | Selin Arda | `selin.arda@okul.com` | `Okul2026q` | 10-A | Nakil geldi | geçerli |
| 5 | Burak | `burak@okul.com` | `Okul2026w` | 9-A | | soyadı yok |
| 6 | Mert Aksoy | `mert-aksoy-okul` | `Okul2026e` | 9-A | | e-posta değil |
| 7 | Ece Yalın | `ece.yalin@okul.com` | `1234` | 9-B | | şifre kısa |
| 8 | Ali Vural | `ali.vural@okul.com` | `Okul2026r` | 11-C | | olmayan sınıf |
| 9 | Elif Kara | `elif.kara@okul.com` | `Okul2026x` | 9-A | | 1. satırın tekrarı |

Son sütun dosyada yazmaz; satırların içeriğinden çıkarıldı. Şifreler ve adresler uydurma test değerleridir.

Dosya [../sunucu/yardimci/xlsx.md](../sunucu/yardimci/xlsx.md)'deki `yaz` ile üretilir ve `testler/ornek-ogrenci-listesi.xlsx`
üzerine yazılır. Hata olursa `HATA: <ileti>`, çıkış 1.

## Kimle konuşur?

- **Çağırdıkları:** [giris.md](giris.md) üzerinden `araclar/giris.js` → `iste`, `girisYap`;
  [../sunucu/yardimci/xlsx.md](../sunucu/yardimci/xlsx.md) → `yaz` (sunucunun kendi xlsx yazıcısı, doğrudan `require` ile);
  Node'un `fs` ve `path`'i.
- **Sunucu uçları:** `POST /api/school/class`, `GET /api/school/classes`, `POST /api/school/lesson`
  ([../sunucu/bolumler/okul.md](../sunucu/bolumler/okul.md)); giriş için `challenge`, `login`, `login/dogrula`
  ([../sunucu/bolumler/kayit.md](../sunucu/bolumler/kayit.md)).
- **Yazdığı dosya:** `testler/ornek-ogrenci-listesi.xlsx` — depoda izlenen bir dosya (commit 94'ten beri). Bugün onu okuyan
  başka bir kod yok.
- **Bugünkü öğrenci aktarımı** (listenin yükleneceği yer): `POST /api/school/kisi-aktarim`
  ([../sunucu/bolumler/kisi-aktarim.md](../sunucu/bolumler/kisi-aktarim.md)), ön yüzü
  [../public/js/parcalar/15-aktarim.md](../public/js/parcalar/15-aktarim.md).
- **Ön koşulu:** [seed.md](seed.md) (müdür hesabı ve okul).
- **Onu çağıran:** yok.

## Nasıl çalışır (adım adım)?

```
seed.js ──► temel okul
hazirlik-aktarim.js
  müdür girer
  9-A, 9-B, 10-A açılır (varsa 400, sessizce geçilir)
  okulun her sınıfına Matematik, Türkçe, Fen Bilimleri (6-A'da Matematik ve Fen zaten var: 400, geçilir)
  9 satırlık liste ─► xlsx.yaz ─► testler/ornek-ogrenci-listesi.xlsx
  TOKEN= · B64= · DOSYA=
```

Çalıştırma (test sunucusu 3200'de açık, çıktısı `testler/test-sunucu.log`'a giderken):

```
EE_BASE=http://localhost:3200 EE_LOG=testler/test-sunucu.log node testler/hazirlik-aktarim.js
```

## Dikkat!

- **Depodaki bir dosyanın üzerine yazar.** `testler/ornek-ogrenci-listesi.xlsx` git'te izlenir. `xlsx.yaz` tekrar üretilebilir
  çıktı verir (zip başlıklarındaki tarih sabit, 1980-01-01): 3 Ekim'de aynı satırlar bellekte yeniden üretildi, sonuç izlenen
  dosyayla **bayt bayt aynı** çıktı (2987 bayt). Yani bugün çalıştırırsan `git status` değişiklik göstermez. Ama `xlsx.js`'te
  biçim, stil ya da sıkıştırma değişirse betik izlenen dosyayı değiştirir; bu değişiklik ilgisiz bir commit'e karışmasın.
- **Liste bugünkü aktarım biçimine uymuyor.** Bugünkü öğrenci aktarımı ad, soyad ve **T.C. kimlik no** ister; sütunları adıyla
  eşler (`Ad Soyad` tek sütun olarak tanınır, `Kullanıcı adı (e-posta)` `Kullanıcı adı`'na, `Sınıf` sınıf seviyesine düşer).
  Bu dosyada T.C. sütunu yok; kişi aktarımına yüklenirse satırlara hiç bakılmadan "Başlık satırında şu sütunlar bulunamadı:
  T.C. Kimlik No. Boş şablonu indirip onun üzerine yazman en kolayı." raporu döner. Eski `POST /api/school/aktarim-ice`
  `tur: 'ogrenci'` ile de "Öğrenci listesini "Kişi listesi" bölümünden yükle." der (koddan çıkarım; yükleme denenmedi). Bu
  yüzden fotoğraf için kullanılmak istenirse liste T.C. sütunuyla yeniden kurulmalı.
- **Hatalar yutulur.** `iste` HTTP hatasında fırlatmaz, dosya cevaplara bakmaz. İkinci kez çalıştırırsan sınıflar ve dersler
  400 alır, betik yine sorunsuz biter ve dosyayı yeniden yazar.
- **6-A'ya Türkçe eklenir.** Ders döngüsü yalnız yeni sınıflara değil okulun bütün sınıflarına gider; seed'in 6-A'sına
  öğretmensiz bir Türkçe dersi eklenir. Aynı veritabanında sonra test koşacaksan önce sıfırla.
- **Oturum anahtarı düz metin basılır.** Yalnız test veritabanındaki uydurma müdürün anahtarıdır; dosyaya yazdıysan iş bitince
  sil.
- **Varsayılan adres 3000.** `EE_BASE` vermezsen kendi (gerçek veritabanlı) sunucuna sınıf ve ders açar. Her zaman
  `EE_BASE=http://localhost:3200`.

## Testleri

- Kendi testi yok, hiçbir test de onu kullanmıyor. Toplu aktarımı asıl deneyen paket `testler/test-aktarim.js` (kendi
  listelerini bellekte kurar); xlsx yazıcı ve okuyucuyu `testler/test-xlsx.js` dener.
- Bu belge yazılırken betik **çalıştırılmadı** (depodaki dosyanın üzerine yazdığı için). Onun yerine aynı satırlar
  `xlsx.yaz` ile bellekte üretildi: izlenen dosyayla aynı çıktı; `xlsx.oku` ile okunan dosyada `Öğrenciler` sayfası, başlık
  satırı ve dokuz satır yukarıdaki tablodaki gibi.

## Son durum

- `git log`: tek commit. `12d4131 commit 94` (2026-08-29) bu dosyayı (48 satır), örnek listeyi
  (`testler/ornek-ogrenci-listesi.xlsx`, 2987 bayt), `public/css/parcalar/18-aktarim-kvkk.css`'e aktarım ekranı stillerini ve
  `testler/test-aktarim.js`'in ilk satırlarını birlikte ekledi. O günden beri değişmedi; bu arada öğrenci aktarımı ayrı bir
  "kişi listesi" bölümüne taşındı ve T.C. zorunlu oldu.
- Bilinen açık: listenin bugünkü biçime uymaması (yukarıda). Kod değiştirilmedi. Öneri: ya T.C. ve Ad/Soyad sütunlu
  güncel bir listeye çevrilmeli ya da ekran görüntüsü işi [../araclar/gezinti.md](../araclar/gezinti.md)'ye bırakılıp bu betik
  ve örnek dosya kaldırılmalı (kullanıcıya sorulacak).
- Planlı işlerden ilgili olanlar: "Ekran turu + albüm" (en son; ekranlar baştan çekilecek), "T.C. kimlik no bütün hesaplarda
  zorunlu" (kod Linux'ta), "Anket düzenleyici" ve "Sınav" işlerindeki Excel'den aktarma (başka listeler, bu dosyayı
  doğrudan etkilemez).
