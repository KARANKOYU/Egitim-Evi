# testler/test-aktarim.js

Müdürün toplu aktarımlarını gerçek uçlardan deneyen sunuculu test paketi (41 denetim): kişi listesi şablonu, üç sayfalı
listenin önizlemesi ve uygulanması, aynı T.C.'nin güncelleme sayılması, ODS/CSV/TXT okuma, TXT'den Excel şablonu, ders
programı aktarımı, dışa aktarım, bozuk dosya, sıkıştırma bombası ve yetki.

## Bu dosya ne yapar?

Bir okul yüzlerce öğrencisini tek tek eklemez; müdür elindeki tabloyu yükler. Kişi aktarımı
([../sunucu/bolumler/kisi-aktarim.md](../sunucu/bolumler/kisi-aktarim.md)) dosyayı okur, başlıkları adlarıyla eşler,
her satırı denetler, önce "ne olacak" raporunu gösterir, müdür onaylayınca hesapları tek işlemde açar. Ders programı
aktarımı ve "dışarı aktar" ise okulun kendi uçlarındadır ([../sunucu/bolumler/okul.md](../sunucu/bolumler/okul.md)).

Bu paket o yolun bütün önemli kurallarını tek koşuda dener (dosya başı yorumunun sözü):

- Öğrenci ve servisçi listesi tek çalışma kitabında; öğretmen dosyayla EKLENMEZ (her öğretmen kendi hesabını açar).
- `.xlsx`, müdürün kendi başlıklarıyla `.ods`, Windows-1254 kodlu `.csv` ve `.txt` okunur.
- Ad, soyad ve T.C. zorunlu; boş kullanıcı adı ve şifre T.C. olur.
- "7" + "çiçek" → 7-Çiçek sınıfı açılır; aynı T.C. yeniden gelirse yeni hesap açılmaz, güncellenir (sınıf atlatma).
- TXT isim listesi doldurulacak Excel şablonuna çevrilir.
- Ders programı aktarımı, dışa aktarım, bozuk dosya, sıkıştırma bombası, yetki.

Dosyaları test kendisi üretir: `.xlsx`'leri sunucunun kendi yazıcısıyla (`sunucu/yardimci/xlsx.js` → `yaz`, `zipYaz`),
ODS'yi elle kurduğu XML'den, CSV ve TXT'yi bayt bayt. Depodaki örnek dosyalar (`testler/ornek-*.xls*`) bu pakette
kullanılmaz.

## İçinde neler var?

### Yardımcılar

- `kontrol(ad, sart, detay)`, `J(x)` (200 harflik JSON).
- `xlsx` — `sunucu/yardimci/xlsx.js` doğrudan yüklenir ([../sunucu/yardimci/xlsx.md](../sunucu/yardimci/xlsx.md)):
  `yaz` (sayfalardan .xlsx), `oku` (gelen .xlsx'i okumak için), `zipYaz` (ham zip; ODS ve bomba için).
- `dosyaAl(yol, token)` — ikili cevap veren uçlar için `fetch`; `{ status, buf, tur, ad }` ya da hata durumunda
  `{ status, hata }`. Adresi kendisi kurar: `EE_BASE` ya da `http://localhost:3000`.
- `yukle(satirlar, basliklar, ad)` — tek sayfalı .xlsx'in base64'ü (sayfa adı varsayılan `Veri`).
- `odsYap(basliklar, satirlar)` — LibreOffice'in kaydettiği gibi bir ODS: `mimetype` + `content.xml`, sayfa adı `Sheet1`,
  her satırın sonunda `number-columns-repeated="16372"` boş hücre ve en sonda `number-rows-repeated="1048570"` boş satır
  (LibreOffice sayfanın geri kalanını böyle yazar). Kod yorumu başlıkların git dışındaki `yapi/` klasöründeki bir tablodan
  alındığını söyler. Okuyucu bu tekrarları belleğe açsaydı milyonlarca hücre üretirdi; satırın 200 ile dönmesi okuyucunun
  boş tekrarları açmadığını da dolaylı olarak gösterir ([../sunucu/yardimci/tablo-oku.md](../sunucu/yardimci/tablo-oku.md)).
- `zlib` yüklenir ama hiç kullanılmaz (kalıntı).

Ortak yardımcılar [giris.md](giris.md) üzerinden: `iste`, `girisYap`, `tcUret` (algoritmaya uyan rastgele T.C.).

### Hazırlık

Seed'in müdürüyle giriş (`T`); `POST /api/school/class` ile `9-A` sınıfı, ona `Matematik` dersi (haftada 4 saat),
`POST /api/servis/kaydet` ile "Mavi Servis" (plaka `06 EE 123`).

### 1) Boş şablonlar (5 denetim)

- `GET /api/school/kisi-sablon` → base64 .xlsx; sayfalar tam olarak `Öğrenciler | Servisçiler | Nasıl doldurulur`
  (öğretmen sayfası yok).
- Öğrenci başlıkları tam olarak: `Ad | Soyad | T.C. Kimlik No | Kullanıcı adı | E-posta | Şifre | Doğum tarihi
  (gg.aa.yyyy) | Sınıf (1-12) | Şube | Okul no | Adres`.
- Servisçi sayfasında `Telefon` ve `Servis…` ile başlayan bir başlık var.
- `GET /api/school/aktarim-sablon?tur=program` ikili .xlsx olarak iniyor (`spreadsheetml` türü); başlıklar
  `Sınıf | Gün | Başlangıç | Bitiş | Ders | Öğretmen`.

### 2) Üç sayfalı liste, önizleme (7 denetim)

Tek kitapta üç sayfa: **Öğrenciler** (8 satır), **Öğretmenler** (2 satır), **Servisçiler** (1 satır).

| Satır | Ne denenir | Beklenen |
|---|---|---|
| Ahmet Sami Yılmaz, yalnız zorunlular + doğum, sınıf `7` / şube `çiçek`, okul no 101, adres | yeni sınıf, T.C. ile kullanıcı adı/şifre | hazır; 7-Çiçek açılacak |
| Elif Kara, kendi kullanıcı adı, e-postası ve şifresi, `9` / `A`, okul no 102 | var olan sınıf | hazır |
| Can Aydın, T.C. `12345678901` | geçersiz T.C. | hata ("geçersiz") |
| Deniz Ak, T.C. yok | eksik T.C. | hata ("T.C. kimlik no gerekli") |
| Ece Yal, Ahmet'in T.C.'si | dosyada tekrar eden T.C. | hata ("dosyada") |
| Ali Vural, şifre `123` | zayıf şifre | hata |
| Tek, soyad boş | eksik soyad | hata |
| Zeynep Ok, doğum `31.02.2012`, okul no 101 | bozuk tarih + dosyada tekrar okul no | hata ("Böyle bir gün yok" ya da "anlaşılmadı"; "okul numarası") |
| Öğretmenler sayfası (Selin Ay, Kaan Er) | öğretmen dosyayla eklenmez | sayfa için tek hata ("kendi hesabını açar") |
| Hasan Usta, servis `06 ee 123` | plakayla servis eşleme (harf farkı önemsiz) | hazır |

`POST /api/school/kisi-aktarim { dosya, dosyaAdi: 'liste.xlsx', uygula: false }` → `onizleme: true`, `hazir: 3`,
`hatali: 7` (altı öğrenci satırı + öğretmen sayfası), `yeniSiniflar` içinde `7-Çiçek` var, `9-A` yok; rapor iletileri
yukarıdaki gibi; önizleme hiçbir hesap açmamış (öğrenci listesinde Ahmet yok).

### 3) Uygula (7 denetim)

Aynı dosya `uygula: true` ile → `acilan: 3`. Ahmet'in satırında `tcIle: true`, `sifre: ''` (şifre T.C. olduğu için listede
yazılmaz), kullanıcı adı T.C.; Ahmet T.C.'siyle (kullanıcı adı ve şifre) girebiliyor ve `sifreDegismeli: true` (ilk
girişte şifresini değiştirmeli). Ahmet 7-Çiçek'te, okul no 101; Elif (`elif.kara`) 9-A'da; Selin Ay öğretmen listesinde
YOK; "Mavi Servis"in sürücüsü (`soforAdi`) "Hasan Usta".

### 4) Aynı T.C. yeniden: güncelleme (2 denetim)

Yalnız Ahmet'in satırı, bu kez `8` / `Çiçek` ve yeni adresle (dosya adı verilmez; tür sayfa adından): önizlemede
`guncel: 1`, `hazir: 0`, `yeniSiniflar` içinde `8-Çiçek`. Uygulanınca okulda tek bir Ahmet Sami Yılmaz var ve sınıfı
8-Çiçek.

### 5) ODS, CSV, TXT (6 denetim) — hepsi yalnız önizleme

- **ODS**, müdürün kendi başlıklarıyla: `Ahmet sami(İsim)`, `Yılmaz(Soyad)`, `12345678901(TC)`, `Kullanıcı adı`,
  `e posta`, `şifre`, `doğum tarihi gg.mm.yyyy`, `Sınıf(1-12)`, `sınıf(a,çiçek,mavi mesela)`, `okul no`, `açıklama`,
  `adres`; satır Mert Demir, `6` / `b`. Başlıklar eşleniyor (parantez içi/öncesi; ikinci "sınıf" şube oluyor), satır hazır,
  `6-B` açılacak.
  - `tur: 'ogrenci'` verilerek bir kez, sonra `tur` verilmeden dosya adı `öğrenci.ods` ile bir kez: sayfa adı `Sheet1`
    tanınmadığı için tür dosya adından anlaşılıyor (hazır 1).
  - Dosya adı `liste.ods` ve `tur` yok: tür anlaşılamıyor → 400 (müdürden tür seçmesi istenir).
- **CSV**: `Ad;Soyad;T.C. Kimlik No` başlığı ve Windows-1254 baytlarıyla (`0xDE` Ş, `0xC7` Ç, `0xFD` ı) "Şen;Çakır;<T.C.>",
  `tur: 'servisci'` → hazır 1 ve raporda "Şen Çakır" (Türkçe harfler doğru çözülmüş).
- **TXT**: `1. Ayşe Nur Kılıç <T.C.>` ve `2) Burak Öz` (T.C.'siz) satırları, `tur: 'ogrenci'` → hazır 1, hatalı 1, raporda
  "Ayşe Nur Kılıç" (baştaki sıra numaraları atılmış).
- **TXT → Excel** (`POST /api/school/txt-excel`): `Ali Veli Kaya`, `Fatma Nur Er`, `Osman` → `adet: 3`; dönen şablonun
  ilk veri satırı `Ali Veli` / `Kaya` (son kelime soyad), başlık satırının üçüncü sütunu `T.C. Kimlik No`.

### 6) Ders programı içe aktarımı (4 denetim)

`POST /api/school/aktarim-ice { tur: 'program', dosya, uygula }`, altı satır:

| Satır | Sonuç |
|---|---|
| 9-A Pazartesi 09:20–10:00 Matematik | hazır |
| 9-A Salı 10:10–10:50 Matematik | hazır |
| 9-A Çarşamba Fizik | hata: sınıfta böyle ders yok |
| 9-B Pazartesi Matematik | hata: böyle sınıf yok |
| 9-A "Cumaartesi" | hata: gün tanınmıyor |
| 9-A Cuma 10:00–09:00 | hata: bitiş başlangıçtan önce |

Önizleme `hazir: 2`, `hatali: 4`; uygulama `eklenen: 2`. Ayrı bir önizlemede Excel'in kesirli saati (`0.5833…`–`0.625`)
`14:00-15:00`, noktalı saat (`8.30`–`9.10`) `08:30-09:10` olarak çözülüyor; gün sütununda `1` ve `3` sayıları da gün
sayılıyor. Eski yolla `tur: 'ogrenci'` gönderilirse 400 (öğrenci listesi artık "Kişi listesi" bölümünden).

### 7) Dışa aktarım (4 denetim)

- `GET /api/school/kisi-disa` → iki sayfa (öğrenciler, servisçiler). Ahmet'in satırında sınıf seviye ve şubeye bölünmüş
  (`8`, `Çiçek`), şifre sütunu boş. İkinci sayfa `Servisçiler`, içinde Hasan ve "Mavi Servis".
- `GET /api/school/aktarim-disa?tur=program` → .xlsx, en az 3 satır (başlık + iki ders saati).
- `GET /api/school/aktarim-disa?tur=uydurma` → 400.

### 8) Bozuk dosya ve sıkıştırma bombası (5 denetim)

- `PK\x03\x04bozuk` (zip imzası, ardından çöp), `x.xlsx` → 400.
- Boş `dosya` → 400.
- Sayfa adı `Öğrenciler` ama başlıkları `Alakasiz | Sutun` → 200, `hazir: 0`, raporda "Başlık satırında …" (yönlendirici
  ileti: boş şablonu indir).
- **Sıkıştırma bombası:** içinde 200 MB'lık sıfırlardan oluşan `xl/workbook.xml` bulunan, sıkıştırılmış hâli yaklaşık
  200 KB olan bir zip (3 Ekim koşusunda 199 KB) → 400 ve iletide "büyüyor" (okuyucu açılmış toplam 60 MB'ta durur).
- Ardından `GET /api/me` 200: sunucu ayakta.

### 9) Yetki (1 denetim)

Seed'in Matematik öğretmeni (`aktarim.yap` yetkisi yok) `kisi-sablon`, `kisi-aktarim` (`uygula: true`) ve `kisi-disa`'da
üçünde de 403 alır.

Sonunda `GECTI: N   KALDI: M`; `KALDI` varsa çıkış kodu 1, beklenmeyen hata `TEST HATASI:` ve çıkış kodu 1.

## Kimle konuşur?

- **Modüller:** [giris.md](giris.md); `sunucu/yardimci/xlsx.js` doğrudan (testin kendi sürecinde dosya üretmek ve
  okumak için); `zlib` (kullanılmıyor); Node'un genel `fetch`'i.
- **Sunucu uçları** (9. bölüm dışında hepsi müdürün oturumuyla; ilk iki satırdaki aktarım uçları `aktarim.yap` yetkisi
  ister):

  | Uç | Belge |
  |---|---|
  | `GET /api/school/kisi-sablon`, `GET /api/school/kisi-disa`, `POST /api/school/kisi-aktarim`, `POST /api/school/txt-excel` | [../sunucu/bolumler/kisi-aktarim.md](../sunucu/bolumler/kisi-aktarim.md) |
  | `GET /api/school/aktarim-sablon`, `GET /api/school/aktarim-disa`, `POST /api/school/aktarim-ice` | [../sunucu/bolumler/okul.md](../sunucu/bolumler/okul.md) |
  | `POST /api/school/class`, `POST /api/school/lesson`, `GET /api/school/students`, `GET /api/school/teachers` | [../sunucu/bolumler/okul.md](../sunucu/bolumler/okul.md) |
  | `POST /api/servis/kaydet`, `GET /api/servis` | [../sunucu/bolumler/okul-hayati.md](../sunucu/bolumler/okul-hayati.md) |
  | `GET /api/me`, giriş uçları | [../sunucu/bolumler/kayit.md](../sunucu/bolumler/kayit.md) |

- **Arkadaki okuyucular ve doğrulayıcı:** [../sunucu/yardimci/tablo-oku.md](../sunucu/yardimci/tablo-oku.md) (`.xlsx`,
  `.ods`, `.csv` — Windows-1254 —, `.txt`), [../sunucu/yardimci/xlsx.md](../sunucu/yardimci/xlsx.md) (zip ve 60 MB bomba
  sınırı), [../sunucu/yardimci/aktarim.md](../sunucu/yardimci/aktarim.md) (program çözümü, Excel kesirli saat, `anahtarla`),
  [../sunucu/bolumler/hesaplar.md](../sunucu/bolumler/hesaplar.md) (`hesapDogrula`: T.C., şifre, tarih kuralları).
- **Tablolar** (dolaylı): `kullanicilar`, `siniflar`, `dersler`, `ders_programi`, `servisler`, `islem_kaydi`.
- **Ön yüz:** müdürün aktarım ekranı [../public/js/parcalar/15-aktarim.md](../public/js/parcalar/15-aktarim.md) (bu
  pakette doğrudan denenmez; aynı uçları çağırır).
- **Onu çalıştıran:** `testler/tumtest.sh`, sunuculu paket döngüsünde (`test-yedek`'ten sonra, `test-sifre`'den önce);
  önce sıfırlanmış veritabanı ve [seed.md](seed.md).

## Nasıl çalışır (adım adım)?

```
hazırlık: müdür girer ─► 9-A + Matematik ─► "Mavi Servis" (06 EE 123)
1) kisi-sablon (JSON base64) ─► sayfa adları, başlıklar ; aktarim-sablon?tur=program (ikili) ─► başlıklar
2) xlsx.yaz(Öğrenciler 8 satır, Öğretmenler 2, Servisçiler 1) ─► kisi-aktarim uygula:false
      hazir 3, hatali 7, yeniSiniflar [7-Çiçek], iletiler ; hesap açılmadı
3) aynı dosya uygula:true ─► acilan 3 ─► T.C. ile giriş (sifreDegismeli) ─► sınıflar, servis ataması
4) Ahmet 8/Çiçek ─► guncel 1 ─► uygula ─► tek Ahmet, 8-Çiçek
5) ODS (Sheet1, müdür başlıkları, dev tekrarlar) ─► tür: gövdeden / dosya adından / yok → 400
   CSV (1254) ─► "Şen Çakır" ; TXT ─► 1 hazır 1 hatalı ; txt-excel ─► 3 satırlık şablon
6) aktarim-ice program: 2 hazır 4 hatalı ─► uygula 2 ; kesirli/noktalı saat ; tur=ogrenci → 400
7) kisi-disa (2 sayfa, şifre boş) ; aktarim-disa program / uydurma 400
8) bozuk zip 400 ; boş 400 ; başlıksız 200 + yönlendirici ileti ; 200 MB'lık bomba 400 ; /api/me 200
9) öğretmen: kisi-sablon / kisi-aktarim / kisi-disa → 403
```

## Dikkat!

- **Bomba test sürecinde de bellek ister.** `Buffer.alloc(200 * 1024 * 1024)` 200 MB'lık sıfır tamponu testin kendi
  belleğinde açılır ve sıkıştırılır; zayıf bir makinede bu adım belirgin bellek ve birkaç saniye işlemci harcar. Sunucuya
  giden yalnız ~200 KB'lık zip'tir.
- **Paket aynı veritabanında iki kez koşulamaz.** Hazırlık 9-A'yı, 2–4. bölümler hesapları (Ahmet, Elif, Hasan) ve
  7-Çiçek, 8-Çiçek sınıflarını açıp bırakır. Aynı veritabanında yeniden çalıştırınca 9-A zaten olduğu için sınıf açma 400
  döner, `sinif.body.class.id` okunamaz ve paket daha ilk satırlarda `TEST HATASI` ile durur. `tumtest.sh` her paketten
  önce veritabanını sıfırladığı için sorun yok; elle koşacaksan önce sıfırla.
- **T.C.'ler her koşuda rastgele** (`tcUret`). Rastgele bir T.C. çok küçük bir olasılıkla seed hesaplarının T.C.'siyle
  çakışabilir (seed öğretmen ve öğrencileri `okulHesabi` ile açar, o da T.C.'yi `tcUret`'ten alır); o zaman satır "hazır"
  yerine "güncellenecek" ya da hata sayılır ve sayılar tutmaz. Tek seferlik bir `KALDI` görürsen yeniden koştur.
- **Hata sayıları satır satır sayılır, sorun sayısıyla değil.** Zeynep Ok'un satırında iki sorun (bozuk tarih ve tekrar
  okul no) var ama bir hatalı satır sayılır; öğretmen sayfası iki satırlı olsa da tek hata kaydıdır. `hatali: 7` bu
  sayımın sonucudur; satır eklerken buna göre güncelle.
- **İleti metinleri aranıyor:** "geçersiz", "T.C. kimlik no gerekli", "dosyada", "okul numarası", "kendi hesabını açar",
  "Böyle bir gün yok"/"anlaşılmadı", "Başlık satırında", "büyüyor". Sunucudaki iletileri değiştirirsen bu paket kalır.
- **ODS satırı Sınıf ve Şube'nin sırasına bağlı:** müdürün tablosunda iki "sınıf" başlığı var; ilki seviye, ikincisi şube
  sayılır (başlıklar soldan sağa eşlenir). Sütun sırası değişirse 6-B yerine başka bir ad çıkar.
- **Seed'e bağlı:** müdür hesabı ve yetkileri, öğretmenin `aktarim.yap` yetkisinin olmaması. `9-A` seed'de yok (seed'in
  sınıfı 6-A); bu paket kendisi açar.
- **`.xls` bu pakette denenmez.** Dosya başı yorumu `.xlsx`, `.ods`, `.csv`, `.txt` der; eski Excel (`.xls`) okuyucusu
  sunucusuz `testler/test-xlsx.js`'te depodaki `ornek-eski-*.xls` dosyalarıyla denenir.
- **Varsayılan adres 3000.** `EE_BASE` vermeden çalıştırırsan kendi sunucunda sınıf, ders, servis ve hesaplar açar; her
  zaman test sunucusunu kullan.

## Testleri

- Bu dosyanın kendisi testtir; `testler/tumtest.sh` her tam koşuda çalıştırır. Aynı alanı tamamlayanlar:
  `testler/test-cakisma.js` (aynı liste aynı anda iki kez yüklenince çift hesap çıkmaz), `testler/test-yetiskin.js`
  (`ogretmenler.xlsx` yüklenince öğretmen sayfası hatası, şablonda öğretmen sayfası yok), `testler/test-xlsx.js` (sunucusuz:
  xlsx yazıcı/okuyucu, `.xls`), [yetki-denetimi.md](yetki-denetimi.md) (aktarım uçları × roller). Ekran görüntüsü için
  eski hazırlık betiği: [hazirlik-aktarim.md](hazirlik-aktarim.md).
- Elle (Git Bash, proje kökünde; 3200'de seed'lenmiş, yeni sıfırlanmış test sunucusu varken):

  ```
  EE_BASE=http://localhost:3200 EE_LOG=testler/test-sunucu.log node testler/test-aktarim.js
  ```

- 3 Ekim sabahı bu belge için 3200'de, sıfırlanmış `egitimevi_test` ve seed'le koşuldu: `GECTI: 41   KALDI: 0`, yaklaşık 3
  saniye; bomba zip'i 199 KB; sunucu günlüğünde `API hatası` yok.

## Son durum

- `git log`: 2 commit, ikisi de aynı gün.
  - `fc375d6 commit 95` (2026-08-29): paketin gövdesi eklendi (215 satır: yardımcılar, `odsYap`, 1–9. bölümler).
  - `12d4131 commit 94` (2026-08-29): dosyanın ilk 11 satırı (başlık yorumu ve `require`'lar); aynı commit
    `testler/hazirlik-aktarim.js`, `testler/ornek-ogrenci-listesi.xlsx` ve `public/css/parcalar/18-aktarim-kvkk.css`'i
    getirdi.
  - O günden beri test değişmedi; ama denediği kod değişti (kişi aktarımında çakışmanın 409 olması, "kişi kodu"
    iletileri) ve paket bugünkü kodla geçiyor.
- Açık iş yok; küçük kalıntı: kullanılmayan `zlib`.
- Planlı işlerden bu dosyayı etkileyecekler:
  - **"T.C. kimlik no bütün hesaplarda zorunlu + her yerde geçerlilik kuralı (site, Excel, Android)"** — Excel'deki T.C.
    kuralı değişirse 2. bölümün hata iletileri ve sayıları gözden geçirilmeli.
  - **"Tek kişi tek hesap + portallar öğrencide de"** — Excel yüklemesinde "Eşleyelim mi?" adımı (T.C. + doğum tarihiyle
    eşleşen öğrenci) gelecek; bugün başka okulun öğrencisi dosyayla eklenemiyor, 3–4. bölümlerin "aynı T.C. → güncelle"
    akışına yeni bir dal eklenecek.
  - **"Çalışan olarak ekleme"** — öğretmen sayfasının reddi (`kendi hesabını açar`) iletisi değişebilir.
  - **"Özel branş / ders"** — ders adları sabit listeden çıkınca 6. bölümdeki "Fizik dersi yok" ve "Matematik" eşlemesi
    yeni kurala göre denetlenmeli.
  - **"Anket düzenleyici … + quiz sorularını Excel'den aktarma"** ve **"Sınav: … notları Excel'den yükleme/indirme"** —
    yeni aktarım türleri; aynı okuyucuyu kullanacakları için bu paketin bomba/bozuk dosya denetimleri onlara da
    genişletilmeli.
  - **"Yıl geçişi"** — sınıf atlatma bugün bu paketin 4. bölümündeki "listeyi yeniden yükle" yoluyla; sihirbaz gelince o
    yolun yeri değişebilir.
