# testler/test-veli-coklu.js

Veli bağlarını deneyen sunuculu test paketi (22 denetim): öğretmen aynı zamanda veli olabilir; okul veliyi T.C. kimlik no
ya da kullanıcı adıyla bulup öğrenciye bağlar ve kaldırır; rolsüz hesap bağlanınca veli olur, öğrenci hesabı veli yapılamaz;
aramada velinin adı maskeli görünür; başka okulun müdürü bizim öğrencimize veli bağlayamaz.

## Bu dosya ne yapar?

Eğitim Evi'nde veli ayrı bir "okul hesabı" değildir: kendi kaydolduğu **yetişkin hesabına** çocuk bağlanır. Bağ iki yoldan
kurulur:

1. **Veli kodu:** öğrencinin ayarlarındaki 16 karakterlik kodu (ekranda `XXXX-XXXX-XXXX-XXXX`) veli kendisi girer
   (`POST /api/parent/link`, [../sunucu/bolumler/veli.md](../sunucu/bolumler/veli.md)).
2. **Okulun bağlaması:** müdür (ya da "öğrenci bilgilerini düzenler" yetkili biri) veliyi T.C. kimlik no'su ya da kullanıcı
   adıyla arar ve öğrenciye bağlar (`/api/school/veli-bul`, `veli-bagla`, `veli-coz`, `ogrenci-velileri`;
   [../sunucu/bolumler/hesaplar.md](../sunucu/bolumler/hesaplar.md)).

Bir öğretmen ya da müdür de kendi çocuğunun velisi olabilir; bağ onun yetişkin hesabına kurulur, öğretmen rolü değişmez,
velilik ayrı bir "portal" olarak seçim ekranında görünür. Henüz rolü olmayan bir hesap bağlanınca veli olur. Öğrenci hesabı
ve bir okulun öğretmen rol satırı ise veli yapılamaz. Aramada velinin tam adı gösterilmez (yalnız baş harfleri): yoksa
"veli bul" kutusu T.C. no'dan ad öğrenme aracına dönerdi.

Paket bu kuralların hepsini seed'in okulunda, bir de kendi açtığı ikinci bir okulla dener (dosya başı yorumu bunları
madde madde sayar).

## İçinde neler var?

### Yardımcılar

- `kontrol(ad, sart, detay)` — `GECTI` / `KALDI` satırı, sayaçlar; `J(x)` — JSON'un ilk 160 karakteri.
- `z` — `Date.now()` (ondalık milisaniye), bu koşuya özgü ek.

Ortak yardımcılar [giris.md](giris.md) üzerinden ([../araclar/giris.md](../araclar/giris.md)): `iste`, `girisYap`, `hesapAc`,
`mudurYap`, `okulHesabi`, `kisilikGec`.

### Hesaplar ve veriler

Seed'den ([seed.md](seed.md)): müdür `mudur@test.com` (`M`), yönetici `admin@egitimevi.com` / `admin123` (`A`), öğretmenler
`mat` ve `fen` (kullanıcı adıyla girilir), öğrenciler `ogrenci1` ve `ogrenci2` (veli kodları `GET /api/school/students`'tan,
`code` alanı). Paketin açtıkları:

- "Tc Veli" — `tcveli<z>`, T.C. `10000000146`, rolsüz yetişkin hesabı (`hesapAc`).
- "Baska Mudur" — `baska.mudur<z>`; yönetici onu "Baska Okul <z>" (Ankara / Mamak) okuluna müdür yapar (`mudurYap`) → `M2`.
- "Baska Ogretmen" — `baska.ogrt<z>`; kendi yetişkin hesabını açar, kişi koduyla ikinci okula öğretmen olarak eklenir
  (`okulHesabi(M2, 'teacher', …, false)`).

### 1) Öğretmen aynı zamanda veli (6)

- `mat` girer; `GET /api/me`'de çocuk yok.
- `ogrenci2`'nin veli kodu başında ve sonunda boşlukla, 4'erli tireli yazılır (` abcd-efgh-ijkl-mnop `) ve
  `POST /api/parent/link` → 200, `children` 1 tane.
- `GET /api/me`'de rol hâlâ `teacher`; `GET /api/kisilikler`'in `cocuklar`'ında `ogrenci2` var.
- `kisilikGec(token, 'veli', ogrenci2)` ile veli portalına geçilir (eski oturum kapanır, yeni anahtar gelir):
  `GET /api/progress?studentId=<ogrenci2>` → 200; `GET /api/devamsizlik/ogrenci?studentId=<ogrenci2>` → 200.
- `POST /api/parent/unlink { studentId }` → 200, `children` boş.

### 2) Okul veliyi T.C. ile bağlar (10)

- Müdür `GET /api/school/veli-bul?kimlik=100 000 001 46` (boşluklu) → 200, `durum: 'uygun'`, `fullName` `Tc* Ve**`.
- `kimlik=12345678901` (algoritmaya uymayan T.C.) → 400; `kimlik=11111111110` (geçerli ama kayıtsız) → 404.
- `kimlik=ogrenci2` → 200, `durum: 'uygun-degil'`, `id` yok (öğrenci hesabı veli olamaz).
- `POST /api/school/veli-bagla { studentId: <ogrenci1>, veliId }` → 200; aynısı ikinci kez → 400.
- Veli girer: `user.role` artık `parent`, giriş cevabının `children`'ında `ogrenci1`; bildirimlerinde "velisi olarak ekledi".
- Müdür `GET /api/school/ogrenci-velileri?studentId=<ogrenci1>` → listede `tcveli<z>`.
- Veli `GET /api/progress?studentId=<ogrenci1>` → 200.

### 3) Öğretmen de veli olarak bağlanır (kullanıcı adıyla) (1)

`veli-bul?kimlik=FEN` (büyük harfle) → Fen öğretmeni bulunur; `veli-bagla` ile `ogrenci2`'ye bağlanır. Fen öğretmeni girince
cevapta `kisilikSec: true`; `GET /api/kisilikler`'de hem `rol: 'teacher'` olan rolü hem `ogrenci2` çocuğu var (tek denetim).

### 4) Veli kullanıcı adıyla da bulunur (1)

`veli-bul?kimlik=tcveli<z>` → 200, `durum: 'uygun'`.

### 5) Bağ kaldırma ve başka okul (4)

- Müdür `POST /api/school/veli-coz { studentId: <ogrenci1>, veliId }` → 200; velinin `GET /api/progress?studentId=<ogrenci1>`'i
  artık 403.
- İkinci okulun müdürü (`M2`) `veli-bagla { studentId: <ogrenci1>, veliId: <Fen> }` → 404 (öğrenci onun okulunda değil).
- Bizim müdür `veli-bul?kimlik=baska.ogrt<z>` → 200; dönen kimlik öğretmenin rol satırınınkinden farklı (yetişkin hesabı),
  adı maskeli (`*` var). Rol satırının kimliğiyle `veli-bagla` → 400 (tek denetimde üçü birlikte).
- `mat` yeniden girer (1. bölümdeki portal geçişi eski oturumu kapatmıştı) ve `veli-bul?kimlik=fen` → 403 (hazır Öğretmen
  rolünde öğrenci düzenleme yetkisi yok).

Sonunda boş satır ve `GECTI: 22   KALDI: 0` (satır başında boşluk yok; `tumtest.sh` için fark etmez). `KALDI` varsa çıkış
kodu 1; beklenmeyen hata `TEST HATASI:` ve hata nesnesi, çıkış kodu 1.

## Kimle konuşur?

- **Modüller:** yalnız [giris.md](giris.md) (`araclar/giris.js`); veritabanına doğrudan bağlanmaz.
- **Sunucu uçları:**

  | Uç | Ne için | Belge |
  |---|---|---|
  | `POST /api/parent/link`, `POST /api/parent/unlink` | veli koduyla bağlama, bağı kaldırma | [../sunucu/bolumler/veli.md](../sunucu/bolumler/veli.md) |
  | `GET /api/school/veli-bul`, `POST /api/school/veli-bagla`, `POST /api/school/veli-coz`, `GET /api/school/ogrenci-velileri` | okulun bağlaması | [../sunucu/bolumler/hesaplar.md](../sunucu/bolumler/hesaplar.md) |
  | `GET /api/kisilikler`, `POST /api/kisilik/gec` | portallar, veli portalına geçiş, kişi kodu | [../sunucu/bolumler/kisilik.md](../sunucu/bolumler/kisilik.md) |
  | `GET /api/progress` | çocuğun ilerleyişi (görme yetkisi) | [../sunucu/bolumler/ilerleyis.md](../sunucu/bolumler/ilerleyis.md) |
  | `GET /api/devamsizlik/ogrenci` | çocuğun devamsızlığı | [../sunucu/bolumler/devamsizlik.md](../sunucu/bolumler/devamsizlik.md) |
  | `GET /api/school/students` | veli kodları | [../sunucu/bolumler/okul.md](../sunucu/bolumler/okul.md) |
  | `POST /api/admin/okul-ac`, `POST /api/school/ogretmen-ekle` | ikinci okul ve öğretmeni | [../sunucu/bolumler/yonetici-okul.md](../sunucu/bolumler/yonetici-okul.md), [../sunucu/bolumler/hesaplar.md](../sunucu/bolumler/hesaplar.md) |
  | `GET /api/me`, `GET /api/notifications`, `POST /api/register`, `POST /api/eposta-onay`, giriş uçları | hesap, bildirim | [../sunucu/bolumler/kayit.md](../sunucu/bolumler/kayit.md) |

- **Koruduğu kod:**
  - [../sunucu/bolumler/veli.md](../sunucu/bolumler/veli.md) — `cocukBagla` (hesap başına dakikada 5 deneme, kodu
    `kisiKoduSade` ile boşluk ve tirelerden arındırma, rolsüz hesabı veli yapma, velinin okulunu çocuğun okulu yapma) ve
    `uclar` (okul rolündeyken bağı `anaHesapId` ile yetişkin hesabına kurma; `link`, `unlink`).
  - [../sunucu/bolumler/hesaplar.md](../sunucu/bolumler/hesaplar.md) — `veli-bul` (`ogrenci.duzenle` yetkisi, kişi başına
    dakikada 60 arama, `normTc` ve `tcSorunu`, kullanıcı adıyla arama, `veliOlabilir`, `veliHesabi`, `adMaskele`), `veli-bagla`
    (öğrenci bu okulun mu — `okulOgrencisi`; zaten bağlı mı; rolsüzü veli yapma; bildirim; işlem kaydı), `veli-coz`,
    `ogrenci-velileri`.
  - [../sunucu/bolumler/kisilik.md](../sunucu/bolumler/kisilik.md) — `cocuklar` listesi, `gec` ile veli portalına geçiş ve eski
    oturumun kapanması.
  - `canSeeStudent` ([../sunucu/iliskiler.md](../sunucu/iliskiler.md)) — bağ kalkınca görme yetkisinin de kalkması.
- **Tablolar** (uçlar üzerinden): `veli_baglari`, `kullanicilar` (rolsüz → `parent`, velinin okulu), `bildirimler`,
  `islem_kaydi` (`veli.baglandi`, `veli.cozuldu`), `oturumlar`, `okullar` (ikinci okul).
- **Ön yüz** (bu pakette tarayıcı yok): öğrencinin hesap penceresindeki "Veliler" kutusu ve "Veli bağla" arama satırı
  [../public/js/parcalar/10b-hesaplar.md](../public/js/parcalar/10b-hesaplar.md); kutunun velileri listelemesi
  (`ogrenci-velileri`) ve `veli-bul`, `veli-bagla`, `veli-coz` eylemleri (`EYLEMLER`)
  [../public/js/parcalar/10-mudur.md](../public/js/parcalar/10-mudur.md); veli kodu girme ve çocuğu kaldırma
  [../public/js/parcalar/25-tiklama.md](../public/js/parcalar/25-tiklama.md); portal seçimi
  [../public/js/parcalar/08c-kisilikler.md](../public/js/parcalar/08c-kisilikler.md).
- **Onu çalıştıran:** `testler/tumtest.sh`, sunuculu döngüde (`test-giris-kayit`'ten sonra, `test-giris-bilgisi`'nden önce).

## Nasıl çalışır (adım adım)?

```
M, A girer ; students ─► ogrenci1, ogrenci2 (veli kodları)
1) mat: çocuk yok ─► parent/link " xxxx-xxxx-xxxx-xxxx " ─► 1 çocuk ; rol teacher ; kisilikler.cocuklar
       ─► kisilik/gec veli ─► progress 200, devamsizlik 200 ─► parent/unlink ─► 0 çocuk
2) hesapAc(Tc Veli, T.C.) ─► M veli-bul "100 000 001 46" ─► uygun, "Tc* Ve**"
   bozuk T.C. 400 ; kayıtsız T.C. 404 ; ogrenci2 ─► uygun-degil
   veli-bagla(ogrenci1) 200 ; tekrar 400 ─► veli girer: parent, çocuk, bildirim ; ogrenci-velileri ; progress 200
3) veli-bul "FEN" ─► veli-bagla(ogrenci2) ─► fen girer: kisilikSec, rol + çocuk
4) veli-bul tcveli<z> ─► uygun
5) veli-coz ─► veli progress 403
   hesapAc + mudurYap ─► M2 (Baska Okul) ─► M2 veli-bagla(ogrenci1) 404
   okulHesabi(M2, teacher) ─► M veli-bul baska.ogrt<z> ─► yetişkin hesabı (maskeli) ; rol satırıyla bagla 400
   mat yeniden girer ─► veli-bul 403
```

## Dikkat!

- **Sabit T.C. numaraları.** `10000000146` (veliye verilen, geçerli), `11111111110` ("geçerli ama kayıtsız" sayılan) ve
  `12345678901` (algoritmaya uymayan) koda gömülü. Veritabanı her pakette sıfırlandığı için çakışmaz; aynı veritabanında
  paketi ikinci kez koşarsan "Tc Veli"nin kaydı T.C. çakışmasına düşer (3 Ekim'de 3200'de denendi: ikinci koşu 2. bölümde
  `TEST HATASI: … kayıt (tcveli…@test.com): Bu T.C. kimlik numarası kullanılamıyor…` ile durdu).
- **"Başka okul" denetimi 404'e dayanır.** İkinci okulun müdürü bizim öğrencimizi hiç bulamaz (`okulOgrencisi` → 404
  "Öğrenci bulunamadı"); öğrencinin varlığı da sızmaz. Paket bunun 403 değil 404 olmasını bekler.
- **Başka okulun öğretmeni veli olarak bulunabilir.** Rol satırı veli yapılamaz, ama onun yetişkin hesabı (rolsüz) bizim
  müdürün aramasında `uygun` çıkar ve bağlanabilir: bir öğretmen başka bir okuldaki çocuğunun velisi olabilsin diye
  bilinçli. 5. bölüm yalnız kimliğin farklı ve adın maskeli olduğuna, rol satırıyla bağlamanın 400 aldığına bakar.
- **Portal geçişi eski oturumu kapatır.** `kisilik/gec` isteği gönderen anahtarı kapatır (`sunucu/bolumler/kisilik.js`);
  bu yüzden 5. bölümün sonunda `mat` yeniden girer. Paketin ortasına `mat.token`'ı kullanan bir adım eklersen bunu unutma.
- **Hız sınırları:** `veli-bul` kişi başına dakikada 60, veli kodu hesap başına dakikada 5 deneme (ve bağlantı başına
  saatte 30 yanlış kod). Paket müdürle 7 arama, `mat` ile 1 kod girişi yapar (`mat`'ın son araması hız sınırına varmadan
  yetkiden 403 alır); sınırlar uzakta.
- **Tireli kod denemesi kodun uzunluğuna bağlı.** Kod `slice(0, 4)`, `(4, 8)`, `(8, 12)`, `(12)` ile bölünür; kod 16
  karakter olduğu için ekrandaki biçimin aynısı çıkar. Kod uzunluğu değişirse (bkz. "Son durum") bu satır da değişmeli.
- **Seed'e bağlı:** `mat`, `fen`, `ogrenci1`, `ogrenci2` kullanıcı adları, öğrencilerin `code` alanı, müdürün `ogrenci.duzenle`
  yetkisi, hazır Öğretmen rolünde bu yetkinin olmaması.
- **Varsayılan adres 3000.** `EE_BASE` vermezsen istekler kendi sunucuna gider (hesap ve okul açar, veli bağlar). Her zaman
  test sunucusunu kullan.

## Testleri

- Bu dosyanın kendisi testtir; `testler/tumtest.sh` her tam koşuda çalıştırır.
- Aynı alanda: [test-cakisma.md](test-cakisma.md) (aynı veli kodunun ve aynı `veli-bagla`'nın aynı anda iki kez gelmesi →
  tek bağ; veliyi büyük harfli kullanıcı adıyla bulma), [test-kisi-kodu.md](test-kisi-kodu.md) (veli kodunun biçimi,
  sadeleştirilmesi ve veli eklemede kullanımı), [test-giris-kayit.md](test-giris-kayit.md) (veli kodu güvenliği),
  [test-aile.md](test-aile.md) (velinin "Eğitim Evi Aile" ayarları, bağlı veliye dayanır). `testler/yetki-denetimi.js`
  bu paketin uçlarını (`veli-bul`, `veli-bagla`, `veli-coz`, `ogrenci-velileri`, `parent/unlink`) her rolle denemez;
  `parent/link`'i yalnız deneme velisini bağlamak için kullanır.
- Elle (Git Bash, proje kökünde; 3200'de [seed.md](seed.md) ile tohumlanmış test sunucusu varken):

  ```
  EE_BASE=http://localhost:3200 EE_LOG=testler/test-sunucu.log node testler/test-veli-coklu.js
  ```

- 3 Ekim 2026'da bu belge için 3200'de, sıfırlanmış `egitimevi_test` ve seed'le koşuldu: `GECTI: 22   KALDI: 0`, yaklaşık
  1,6 saniye; sunucu günlüğünde `API hatası` / `Veritabanı hatası` yoktu. Belge denetiminde aynı gün yeniden koşuldu
  (sonuç aynı) ve aynı veritabanında ikinci koşu denendi ("Dikkat!"in ilk maddesi).

## Son durum

- `git log`: 5 commit. Dosya 2026-09-25'te üç parçada eklendi: `3b06239 commit 284` (9 satır: başlık yorumu ve `require`'lar),
  `a8e898b commit 285` (7 satır: `kontrol`, `J`), `dafa2c0 commit 286` (95 satır: bölümlerin hepsi).
- `0acca75 commit 516` (2026-09-27, kayıt / kişi kodu / portallar işi): 1. bölümde veli kodu küçük harfe çevrilip
  gönderilmekten vazgeçildi; yerine ekrandaki 5'erli, boşluklu biçim başında ve sonunda boşlukla gönderilmeye başlandı;
  yorumdaki "Hesap değiştir > Veli — çocuk" sözü "menüde 'Veli · çocuğun adı'" oldu (velilik ayrı bir portal).
- Son değişiklik `153d63d commit 522` (2026-09-27, kişi kodu 16 hane): kod artık `XXXX-XXXX-XXXX-XXXX` biçiminde
  gösterildiği için deneme 5'erli boşluklu biçimden 4'erli tireli biçime çevrildi (denetimin adı da "tireli yazılmış").
- Açık iş yok; kod değiştirilmedi.
- Planlı işlerden bu dosyayı etkileyecekler:
  - **"Tek kişi tek hesap + portallar öğrencide de"** (onaylı, canlıdan önce) — kullanıcı adı site genelinde tek olacak,
    öğrenci de portallı olacak; `veli-bul`'un kullanıcı adıyla aramasında `okul` ayrımı ve "öğrenci hesabı veli olamaz"
    kuralı yeniden düşünülecek.
  - **"T.C. kimlik no bütün hesaplarda zorunlu"** (kod Linux'ta) — "Baska Mudur" ve "Baska Ogretmen"in kayıtları T.C.
    göndermiyor; o iş gelince eklenmeli. `veli-bul` zaten T.C.'yi destekliyor.
  - **"Çalışan olarak ekleme"** — öğretmenin okula ekleniş yolu (`okulHesabi(…, 'teacher')`) değişecek; kodla eklenen kişi
    rolsüz "çalışan" olacak.
  - **"Özel roller: yeni yetkiler …"** — `ogrenci.duzenle` yetkisinin dağılımı ve hazır rol şablonları değişebilir; 5.
    bölümün son denetimi buna dayanır.
