# sunucu/bolumler/kisi-aktarim.js

Öğrenci ve servisçi listelerinin toplu aktarımı (`/api/school/kisi-...`): boş şablon, TXT isim listesinden şablon,
Excel/ODS/CSV/TXT'den iki adımlı içe aktarım ve dışa aktarım.

## Bu dosya ne yapar?

Bir okulun yüzlerce öğrencisini tek tek "Öğrenci ekle" ile açmak olmaz. Müdür elindeki tabloyu (kendi Excel'i,
LibreOffice dosyası, CSV, hatta alt alta isim yazılmış bir .txt) yükler; bu dosya satırları okur,
başlıkları adlarıyla eşler (sütun sırası önemli değil), her satırı [hesaplar.md](hesaplar.md)'deki doğrulayıcıdan
geçirir, önce ne olacağını gösteren bir rapor döner, müdür onaylayınca hesapları tek işlemde açar.

Tek çalışma kitabında iki sayfa vardır: **Öğrenciler** ve **Servisçiler**. Öğretmen dosyayla EKLENMEZ: her öğretmen
kendi hesabını açar, kişi kodunu okula verir (dosyada "Öğretmenler" sayfası varsa o sayfa hata olarak raporlanır).

Kural `hesaplar.js` ile aynıdır: ad, soyad ve T.C. no zorunlu; kullanıcı adı ve şifre boşsa T.C. no olur, kişi ilk
girişte şifresini değiştirir. Öğrencinin sınıfı "Sınıf (1-12)" ve "Şube" sütunlarından kurulur (7 + Çiçek →
7-Çiçek); o sınıf yoksa açılır. Okulda aynı T.C.'li hesap varsa yenisi açılmaz; sınıfı, okul no'su, adresi
güncellenir — yıl sonunda sınıf atlatmak için listeyi yeniden yüklemek yeter.

## İçinde neler var?

### Sabitler

- `DOSYA_SINIR = 1300000` — base64 dosya en çok ~1,3 milyon karakter (~1 MB dosya).
- `SATIR_SINIR = 600` — bir uygulamada en çok 600 kişi (açılan + güncellenen).
- `TURLER` — `{ ogrenci: { rol: 'student', sayfa: 'Öğrenciler' }, servisci: { rol: 'servisci', sayfa:
  'Servisçiler' } }`.
- `OGRETMEN_SAYFASI` — öğretmen sayfasına verilen ileti ("… 'Kodla ekle' ile kodu girersin.").
- Sütun tanımları `AD`, `SOYAD`, `ADSOYAD` (gizli: şablonda yok, okunur), `TC`, `KADI`, `EPOSTA`, `SIFRE`, `DOGUM`,
  `ADRES`, `TELEFON`: her birinin `anahtar`'ı, şablondaki `baslik`'ı, eşleşen başlıkların anahtarlanmış hâlleri
  (`esler`, ör. "isim", "ogrenciadi", "tckimlikno", "ceptelefonu") ve önekleri (`onek`, ör. "tckimlik…").
- `SUTUNLAR` — dışa açık. `ogrenci`: Ad, Soyad, T.C., Kullanıcı adı, E-posta, Şifre, Doğum tarihi, Sınıf (1-12),
  Şube, Okul no, Adres. `servisci`: Ad, Soyad, Doğum tarihi, T.C., E-posta, Kullanıcı adı, Şifre, Telefon, Servis
  (adı ya da plakası), Adres.
- `ANLATIM` — şablondaki "Nasıl doldurulur" sayfasının satırları (zorunlu alanlar, kullanıcı adı ve şifre kuralı,
  doğum tarihi biçimi, sınıf/şube, okul no, servis, desteklenen dosya türleri, iki adım).

### Dışa açık işlevler

- `uclar(k, sub)` — okul.js'ten çağrılır; `sub` dört addan biri değilse `false`.
- `basliklariEsle(satir, sutunlar)` → `{ anahtar: sütun no }`. Her başlığın adayları: bütünü, parantez içi ve
  parantez öncesi ("Ahmet sami(İsim)" → `isim`). Başlıklar soldan sağa gezilir; her başlık, `sutunlar` sırasında
  henüz atanmamış ve tutan İLK tanıma gider (aynı anahtar ikinci kez atanmaz) — bu yüzden müdürün tablosundaki
  İKİNCİ "Sınıf" başlıklı sütun şube olur.
- `sinifAdi(seviye, sube)` — "7" + "a" → "7-A", "7" + "çiçek" → "7-Çiçek"; "7.0" ve "7. sınıf" düzelir; en çok 30
  karakter.
- `cozumle(sayfalar, turIpucu)` → `[{ tur, sayfa, satirlar, bas, harita }]`. Boş sayfaları ve "Nasıl doldurulur"
  sayfasını atlar; sayfanın türünü adından (`sayfaTuru`: "ogrenci", "ogretmen", "servis"/"sofor" geçiyor mu) ya da
  ipucundan alır; başlık satırı ilk dolu satırdır.

Dışa açık son üçü bugün başka dosyada kullanılmıyor (grep).

### İç işlevler

- `adaylar(baslik)`, `sayfaTuru(ad)`, `cumleler(liste)` (bir satırın sorunlarını noktalı cümlelerle birleştirir).
- `satirAlanlari(b, satir)` — satırın alanları. Ad ve soyad tek sütundaysa (ya da soyad sütunu yoksa) SON kelime
  soyaddır. Sayı hücresinden gelen T.C. ve okul no'daki ".0" silinir.
- `sablon()` — üç sayfalı boş .xlsx: Öğrenciler, Servisçiler, Nasıl doldurulur.
- `txtdenSablon(sayfalar, tur)` — isim listesini (TXT ya da başka bir tablo) doldurulmaya hazır şablona çevirir
  (ad, soyad, varsa T.C. dolu); en çok 5000 satır.
- `disa(me)` — okulun öğrenci ve servisçilerini şablonla AYNI sütunlarla verir: ad/soyad ayrılır, sınıf seviye ve
  şubeye bölünür ("7-A" → 7, A), doğum tarihi gg.aa.yyyy, servisçinin servisi, ŞİFRE BOŞ.
- `iceAktar(k)` — içe aktarımın kendisi (aşağıda).

### Uçlar (`/api/school/<alt>`, hepsi `aktarim.yap` yetkisi ister; yoksa 403)

| Alt yol | Yöntem | Gövde → cevap |
|---|---|---|
| `kisi-sablon` | GET | `{ dosya (base64), ad: 'kisi-listesi-sablon.xlsx' }` |
| `kisi-disa` | GET | `{ dosya, ad: 'kisiler.xlsx' }` (`Cache-Control: no-store`) |
| `txt-excel` | POST | `{ tur: 'ogrenci'\|'servisci', dosya, dosyaAdi }` → `{ adet, dosya, ad: '<tur>-listesi.xlsx' }` |
| `kisi-aktarim` | POST | `{ dosya, dosyaAdi, tur?, uygula }` → önizleme raporu ya da sonuç |

- **`txt-excel`** — tür seçilmemişse 400 ("Listenin kimlere ait olduğunu seç"); dosya yok/çok büyük 400; okunamayan
  dosyada tablo okuyucunun iletisi; hiç isim yoksa 400 ("Dosyada isim bulunamadı. Her satıra bir kişinin adını yaz.").
- **`kisi-aktarim`**, önizleme (`uygula` yok): `{ onizleme: true, hazir, guncel, hatali, yeniSiniflar, sinir: 600,
  rapor: [{ sayfa, tur, satir, ad, durum: 'hazir'|'guncel'|'hata', mesaj }] }`. Rapor sayfa ve satır sırasıyla.
  Uygulama (`uygula: true`): hazır ve güncel satır yoksa 400; 600'ü geçerse 400; okul başına saatte 20 uygulama
  (429). Başarıda (`Cache-Control: no-store`) `{ uygulandi: true, acilan, guncellenen, hesaplar: [{ ad, rol, sinif,
  kullaniciAdi, sifre, tcIle, veliKodu }], message }` — şifresi T.C. olan hesapta `sifre` boş, `tcIle: true`.
  Önizlemeden sonra biri aynı T.C./ad/e-posta/okul no'yu aldıysa `409 { alan, error: "… Hiçbir hesap açılmadı;
  listeyi yeniden yükle." }`. İşlem kaydı `hesap.toplu-acildi`.

## Kimle konuşur?

- Çağırdıkları:
  - [hesaplar.md](hesaplar.md) — `hesapDogrula` (her satır, `dosya` haritalarıyla), `hesapNesnesi`, `ROL_AD`, `YETKI`;
  - `../yardimci/aktarim` (`anahtarla`: Türkçe harf, boşluk ve büyük/küçük farkı olmayan anahtar), `../yardimci/xlsx`
    (`yaz`), `../yardimci/tablo-oku` (`tabloOku`: .xlsx, .xls, .ods, .csv — Windows-1254 dahil —, .txt) — belgeleri
    henüz yok: `sunucu/yardimci/aktarim.js`, `sunucu/yardimci/xlsx.js`, `sunucu/yardimci/tablo-oku.js`;
  - `../http` ([http.md](../http.md)), `../guvenlik` ([guvenlik.md](../guvenlik.md): `hizSinir`), `../ortak`
    ([ortak.md](../ortak.md): `adDuzelt`, `clean`, `metinYap`, `normTc`, `now`, `uid`; `normEmail` ve
    `normKullaniciAdi` içe alınmış, kullanılmıyor), `../sifre` ([sifre.md](../sifre.md): `hashPwToplu`), `../yetki`
    ([yetki.md](../yetki.md): `yetkiVarMi`), `../veri` (`depo`, `islem`, `cakisma`), `./islem-kaydi` (`islemYaz`).
- Veri tabloları:
  - `depo.kullanicilar` → `kullanicilar`: `okulun`, `tcIle`, `ekle`, `guncelle` (+ `hesapDogrula`'nın sorguları);
  - `depo.siniflar` → `siniflar`: `okulun`, `ekle`;
  - `depo.okulHayati` → `servisler`: `okulunServisleri`, `servisSoforYaz` (servisçiyi servise atar; servisin başka
    bir servisçiyle açık kalmış seferi varsa kapatır — `servis_seferleri`);
  - `islemYaz` → `islem_kaydi`.
- Onu çağıran: [okul.md](okul.md) (`kisiAktarim.uclar(k, sub)`; hesaplardan sonra, okulun kendi uçlarından önce).
- Ön yüz: `public/js/parcalar/15-aktarim.js` (kisi-sablon, kisi-disa, kisi-aktarim, txt-excel).
- Android uygulaması kullanmıyor.

## Nasıl çalışır (adım adım)?

```
POST kisi-aktarim { dosya, dosyaAdi, tur?, uygula }
 1. dosya var mı, ≤ 1,3 M karakter, en az 2 bayt
 2. tür ipucu: gövdedeki tur ya da dosya adı ("öğrenci.ods" → ogrenci)
 3. tabloOku → cozumle: sayfa türü (ad ya da ipucu), başlık eşleme
       hiç liste yoksa → 400 "Sayfa adı 'Öğrenciler' ya da 'Servisçiler' olmalı…"
 4. her sayfa:
       öğretmen sayfası → rapor: hata (OGRETMEN_SAYFASI)
       Ad/Soyad ya da T.C. başlığı yok → rapor: hata ("boş şablonu indir")
       rolün hesap açma yetkisi yok → rapor: hata
       her satır:
         öğrenci: sınıf var mı? yoksa sinif.yonet ve (yeni sınıfa) ogrenci.yerlestir → açılacak
         servisçi: servis adı ya da plakası var mı?
         okulda aynı T.C.:
           başka rolde         → hata
           aynı rolde          → GÜNCEL (yalnız dolu gelen doğum, adres, telefon, okul no, sınıf)
                                 düzenleme yetkisi yoksa hata
         yoksa hesapDogrula(…, dosya) → HAZIR ya da hata
 5. uygula yoksa → rapor
 6. uygula: sınırlar (600, saatte 20) → hashPwToplu
    TEK İŞLEM: yeni sınıflar → yeni hesaplar (+ servis ataması) → güncellemeler
    tekil indeks çakışması → 409, hiçbir şey açılmaz
 7. işlem kaydı → açılan hesapların listesi (şifreleriyle, bir kez)
```

## Dikkat!

- **Önizlemeye güvenilmez:** uygulama aynı dosyayı baştan çözer, bütün denetimler yeniden çalışır; arada veri
  değişmiş olabilir. Yazma tek işlemde: bir satır bile tekil indekse takılırsa HİÇBİR hesap açılmaz (409).
  `test-cakisma.js` aynı listeyi aynı anda iki kez yükler: çift hesap çıkmaz.
- **Güncellemede ad, kullanıcı adı, şifre ve e-postaya dokunulmaz;** yalnız dolu gelen yer bilgileri yazılır. Boş
  hücre var olan bilgiyi silmez.
- **Yeni açılan sınıf hiçbir rol kapsamında olamaz:** kapsamlı yerleştirme yetkisiyle (belirli sınıflarla sınırlı
  rol) yeni sınıfa öğrenci konmaz; sınıfın kendisi de `sinif.yonet` ister.
- **Başka okulun öğrencisi dosyayla eklenemez:** `hesapDogrula` "… 'Öğrenci ekle'den doğum tarihiyle birlikte tek
  tek ekle" der; nakil yalnız tek tek yapılır ([nakil.md](nakil.md)).
- **Dosya boyutu ve bomba:** base64 1,3 milyon karakter sınırı gövdenin 2 MB'ını aşmamak için; açılınca devleşen
  (sıkıştırma bombası) dosyaları `sunucu/yardimci/xlsx.js` açılmış toplam 60 MB'ta durdurur ("Dosya açılınca çok
  büyüyor…"; test-aktarim bunu dener).
- **Şifreler bir kez görünür:** uygulama cevabındaki liste yalnız o an verilir, yalnız özetler saklanır.
- Sayfa adı "Sheet1" gibi genelse tür dosya adından anlaşılır; o da tanınmazsa müdürden tür seçmesi istenir.
- İki "Sınıf" başlığı olan tablolarda (müdürün kendi tablosu) dosyadaki ilki seviye, ikincisi şube sayılır:
  başlıklar soldan sağa eşlenir, her başlık `SUTUNLAR`'da henüz atanmamış ilk tutan sütuna gider ("sinif" hem
  seviyenin hem şubenin eş adı).
- Güncelleme dalında `brans` ve `rolId` de toplanır ama öğrenci/servisçi sütunlarında bu adlar olmadığı için hiç
  dolmaz (öğretmen sayfası reddedildiğinden kalıntı).

## Testleri

- `testler/test-aktarim.js` — kişi şablonu (öğrenci ve servisçi sayfaları, anlatım; öğretmen yok), başlıkların
  müdürün tablosundaki gibi olması; önizleme (3 hazır, hatalı satırlar ve öğretmen sayfası, açılacak yeni sınıf,
  geçersiz/eksik T.C., dosyada tekrar eden T.C. ve okul no, bozuk tarih), önizlemenin hesap açmaması; uygulama
  (şifresi T.C. olanın listede şifresiz yazılması, T.C. ile giriş ve ilk girişte şifre değiştirme, 7-Çiçek sınıfı,
  var olan 9-A, servisçinin plakayla servise atanması); ikinci yüklemede güncelleme (8-Çiçek); ODS başlıkları, sayfa
  adı "Sheet1" iken türün dosya adından anlaşılması, türün sorulması, Windows-1254 CSV, TXT (T.C.'siz satır
  hatalı), TXT → Excel; dışa aktarım (iki sayfa, sınıf seviye/şubeye bölünmüş, şifre boş); bozuk, boş, başlıksız
  dosya; sıkıştırma bombası; yetkisiz öğretmen.
- `testler/test-cakisma.js` — aynı liste aynı anda iki kez: 3 hesap, çift yok.
- `testler/test-yetiskin.js` — "ogretmenler.xlsx" yüklenince öğretmen sayfası "kodla eklenir" hatası, şablonda
  öğretmen sayfası yok.
- `testler/yetki-denetimi.js` — rol × uç.
- Elle: `testler/seed.js`'teki müdürle gir, aktarım ekranında "Kişi listesi"ni seç, şablonu indir, birkaç satır
  doldur, yükle; önce raporu gör, sonra onayla.

## Son durum

- Son commit `276c0a0 commit 521` (2026-09-27, çakışmalar): uygulama `try/catch` ile sarıldı; tekil indeks
  çakışması 500 yerine `409 { alan, error }` ve "Hiçbir hesap açılmadı" iletisi veriyor.
- `0acca75 commit 516` (kişi kodu): iletilerde "eşleme kodu"/"kişisel kod" yerine "kişi kodu".
- Açık iş yok. "Yıl geçişi" işi (yeni yıl sihirbazı, mezunlar) sınıf atlatmayı bu dosyanın "yeniden yükle,
  güncellensin" yolu yerine sihirbazla yapabilir.
