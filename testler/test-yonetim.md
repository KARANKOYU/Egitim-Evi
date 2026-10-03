# testler/test-yonetim.js

Okulun açtığı hesapları ve hesap modelini deneyen sunuculu test paketi (84 denetim): öğrenci açma ve doğrulama kuralları, T.C. ile
varsayılan giriş ve zorunlu şifre değişimi, kullanıcı adı ve şifre değiştirme, veli kodu yenileme, öğretmen/servisçi hesapları ve
yetkiler, okul içinde tek kullanıcı adı ve okul adresinden giriş, rolsüz yetişkin, yöneticinin müdür listesi ve kişi koduyla okul
açması, aydınlatma metni onayı.

## Bu dosya ne yapar?

`tumtest.sh`'in sunuculu paketlerinden İLKİ ve en genişlerinden biridir: okulun "Hesaplar" ekranının arkasındaki kuralların neredeyse
hepsini bir müdürün gözünden dener ([../sunucu/bolumler/hesaplar.md](../sunucu/bolumler/hesaplar.md)). Dosyanın başındaki yorum
kuralları şöyle sayar:

- öğrenci, öğretmen ve servisçi hesabını okul açar; ad, soyad, T.C. zorunlu (öğretmen için bugün: öğretmen kendi hesabını açar, okul
  kişi koduyla ekler);
- kullanıcı adı ve şifre boşsa T.C. no olur; o kişi kendi şifresini koymadan hiçbir bölüme giremez, yeni şifresi T.C.'yi içeremez;
- kullanıcı adı okul içinde benzersizdir; başka okulda aynısı olabilir; okul seçilmeden girilirse okul sorulur, okulun adresinden
  girilince doğru hesap açılır;
- öğretmen/servisçi hesabı düzenlenir, şifresi yenilenir, silinir; yetkisiz öğretmen hesap açamaz, başka okulun hesabına dokunamaz;
- herkes aynı yetişkin hesabını açar; eski davet uçları yok;
- yönetici okulu açar, müdürü kişi koduyla bulur; kod aynı işlemde yenilenir.

Sonda ayrıca müdürün açtığı hesabın aydınlatma metnini (KVKK) onaylamadan hiçbir şey yapamadığı denenir.

## İçinde neler var?

### Yardımcılar

- `kontrol(ad, sart, detay)` — `GECTI`/`KALDI` satırı. `J(x)` — 160 karakterlik JSON.
- `hamGiris(kimlik, sifre, okul)` — bot sorusunu çözüp `POST /api/login { kimlik, password, okul, … }`'un ham cevabını döner (401, 400
  `okulSec` gibi cevapları görmek için).
- Ortak yardımcılar [giris.md](giris.md) üzerinden ([../araclar/giris.md](../araclar/giris.md)): `iste`, `girisYap` (üçüncü argüman okul
  adresi), `botCevabi`, `hesapAc`, `kisiKodu`, `mudurYap` (kişi koduyla okul açtırıp müdür olarak yeniden girer), `ogretmenYap` (öğretmen
  kendi hesabını açar, müdür kodla ekler), `tcUret` (algoritmaya uyan rastgele T.C.).

### Hesaplar ve veriler

Seed'den ([seed.md](seed.md)) müdür (`mudur`, oturumu `T`) ve Matematik öğretmeni (`ogrt`; yetkisiz işlemler için); sunucunun ilk sistem
yöneticisi (`A`).
`z = Date.now()` ile paketin açtıkları: öğrenci "Deniz Kara" (`yeni.ogrenci<z>`, sonra `degisti<z>`; T.C. `tc1`), T.C.'yle açılan
öğrenci "Ahmet Sami Yilmaz" (`tc2`), öğretmen "Selim Arslan" (`selim<z>`), servisçi "Hasan Usta", ikinci müdür (`ikinci.mudur<z>`) ve
okulu "Ikinci Okul <z>" (Ankara/Mamak), iki okulda aynı adlı öğrenciler (`ortak.ad<z>`: "Birinci Okullu", "Ikinci Okullu"), rolsüz
yetişkin "Rolsuz Kisi" (`rolsuz<z>`), "8-B" sınıfı, müdür adayı "Selin Kaya" (`acilan<z>`) ve onun iki okulu "Deneme Açılış Ortaokulu
<z>" (adresi `acilis-<z>`) ile "Ikinci Acilis Lisesi <z>" (`ikinci-<z>`), aydınlatma metnini onaylamamış öğrenci "Onay Bekleyen".

### 1) Müdür öğrenci hesabı açıyor (3)

`POST /api/school/student-create { fullName: 'deniz kara', username, password, tc }` (eski adlı uç; `hesap-ac`'ın öğrenci kısayolu) → 200;
veli kodu 16 karakter, harfle başlar, büyük harf, küçük harf, rakam (2–9) ve özel karakter (`! ? # * + =`) içerir; ad "Deniz Kara"
olarak düzeltilir.

### 2) Doğrulama (7)

Hepsi 400: T.C.'siz (iletide "T.C."); okulda kullanılmış T.C.; aynı kullanıcı adı BÜYÜK harfle; zayıf şifre (`abc`); tek kelimelik ad;
Türkçe harfli kullanıcı adı (`şule.ışık`, iletide "Türkçe"); kullanıcı adı olarak BAŞKA birinin T.C.'si (rakamdan oluşan ad yalnız kişinin
kendi T.C.'si olabilir).

### 3) Yeni hesapla giriş (2)

Kullanıcı adı BÜYÜK harfle yazılarak giriş olur, kod adımı yok (öğrenci, e-postasız). Rol `student`, `sifreDegismeli` yok (şifreyi
müdür yazdı).

### 3b) T.C. ile varsayılan giriş ve zorunlu şifre değişimi (7)

- `POST /api/school/hesap-ac { rol: 'student', ad: 'Ahmet Sami', soyad: 'Yilmaz', tc }` → `username` = T.C., `varsayilanSifre: true`,
  `fullName: 'Ahmet Sami Yilmaz'`.
- Kullanıcı adı ve şifre T.C. ile giriş → `sifreDegismeli: true`. Aydınlatma metni onaylanır (öbür kapı karışmasın diye), sonra
  `GET /api/progress` → 403 `sifreDegismeli: true`.
- `POST /api/password`: yeni şifre `'a' + T.C.` → 400 (T.C.'yi içeriyor); yeni şifre = T.C. → 400 (ama bkz. "Dikkat!"); `Kendi2026sifrem`
  → 200, `user.sifreDegismeli: false`; `/api/progress` artık 200.

### 4) Kullanıcı adı değiştirme (3)

`POST /api/school/student-update { studentId, username, fullName }` → 200, yeni ad; eski adla giriş 401. `GET /api/school/hesap?id=` →
müdür hesap penceresinde `tc`'yi görür.

### 5) Şifre sıfırlama (5)

`POST /api/school/student-password { studentId, password: 'YeniSifre99' }` → 200; eski şifre 401, yenisi girer; `'123'` → 400.
`POST /api/school/hesap-sifre { id }` (şifresiz) → 200; artık şifre T.C. no ve girişte `sifreDegismeli: true`.

### 6) Veli kodu yenileme (2)

`POST /api/school/student-code-reset { studentId }` → yeni kod, eskisinden farklı, 16 karakter.

### 7) Müdür öğrenci portalını açıyor (2)

Müdür `GET /api/progress?studentId=` ve `GET /api/myschedule?studentId=` → 200 (öğrencinin ilerleyişi ve programı).

### 8) Öğretmen ve servisçi hesapları (13)

- Matematik öğretmeni öğrenci açamaz, öğrencinin şifresini değiştiremez (ikisi de 403).
- Müdür `hesap-ac { rol: 'teacher' }` → 400, iletide "Kodla ekle".
- `ogretmenYap` ile "Selim Arslan" eklenir (`brans: 'matematik'`, telefon `0532 555 11 22`): hesap penceresinde branş "Matematik"
  (büyük/küçük harf fark etmez), telefon `+905325551122`, `bagli: true`, e-posta ve T.C. yok (kişisel bilgiler öğretmenin kendi
  hesabında).
- `hesap-guncelle`: branş "Türkçe" → 200; `kullaniciAdi` → 400 (okul öğretmenin adını değiştiremez); listede olmayan branş "Uydurma" → 400.
- `hesap-ac { rol: 'servisci', ad, soyad, tc, telefon }` → 200; `GET /api/school/servisciler`'de var.
- Öğretmen `hesap-sil` → 403; müdür öğrenciyi `hesap-sil` ile silmeye kalkarsa 403 (öğrencinin bu uçta silme yetkisi yok); öğretmeni
  `onay`'sız → 400, `onay: true` ile → 200. Çıkarılan öğretmen yine girer ve rolsüzdür (yetişkin hesabı durur).

### 8b) Kullanıcı adı okul içinde, okul adresi (14)

- İkinci müdür `mudurYap` ile kendi okulunu açtırır. İki okulun adresi (`GET /api/school/adres`) dolu ve farklı.
- Seed okulunda `ortak.ad<z>` adlı öğrenci açılır (`fullName`, `kullaniciAdi`, `sifre` adlarıyla). İkinci okul AYNI T.C. (`tc1`) ile öğrenci
  açmaya kalkınca 409 `nakil: 'dogum'` (öğrencinin T.C.'si sistemde tek; başka okul doğum tarihiyle nakil ister). Yeni T.C.'yle aynı
  kullanıcı adı ikinci okulda açılır: iki okulda iki ayrı hesap.
- Okul seçmeden giriş → 400 `okulSec: true`. Okul adresiyle (`girisYap(…, adres)`) her biri kendi hesabına girer (`schoolSlug` doğru);
  ikinci okulun şifresiyle birinci okulun adresinden 401; olmayan adres 400; ikinci okulun adresinde T.C. ile de girilir.
- `GET /api/okul-adres?kisa=` herkese açık: `okul.kisaAd` var, `okul.id` yok.
- `GET /api/okul-adres/ara?q=IKINICI oKuL` → okul bulunur, `duzeltme: 'ikinci okul'` (büyük harf ve yazım hatası);
  `q=ikinci okul` → ikinci okulun adresi listede.
- `POST /api/school/adres`: ikinci müdür yeni adres alır (200); seed okulunun adresi (400) ve ayrılmış ad `api` (400) reddedilir;
  öğretmen değiştiremez (403).
- İkinci müdür seed okulundaki hesabın penceresini açamaz ve şifresini değiştiremez (ikisi de 404).

### 8c) Rolsüz kayıt: portalı olmayan yetişkin (4)

- Rolsüz yetişkin girer (`role: ''`); `/api/progress` → 403 `rolsuz: true`.
- Eski davet uçları `GET /api/davetlerim` ve `GET /api/school/kisi-bul` → 404 (kaldırılmış uç rolsüz kişiye de 404).
- `POST /api/school/class { name: '8b' }` → sınıf adı "8-B".

### 9) Yöneticinin müdür listesi (3)

`GET /api/admin/principals` (yönetici) → liste dolu, ilk satırda `schoolName` ve sayı olarak `students`; müdür aynı uç → 404 (bilinmeyen
adres gibi).

### 9b) Yönetici okul açıyor, müdürün kişi koduyla (13)

"Selin Kaya" yetişkin hesabını açar, kişi kodunu alır. `POST /api/admin/okul-ac { schoolName, city, district, kisaAd, mudurKodu }`:

- müdür çağırırsa 404 (ona uç yok);
- adres `a b` → 400 `alan: 'kisaAd'`; kod boş → 400 `alan: 'mudurKodu'`; kod yerine `mudur: { eposta, … }` (eski yol) → 400
  `alan: 'mudurKodu'`; kimsede olmayan kod → 404 `alan: 'mudurKodu'`;
- kod tireli ve boşluklu yazılsa da (`" XXXX-XXXX XXXX - XXXX "`) → 200, `okul.kisaAd: 'acilis-<z>'`, `mudur.ad: 'Selin Kaya'`,
  `mudur.eposta` yok; kişinin kodu yenilenmiş;
- aynı okul (aynı ad ve il) yeni kodla ikinci kez → 400 `alan: 'okul'`; kullanılmış ESKİ kodla başka okul → 404 (tek kullanımlık);
  başka adlı okul ama aynı adres → 400 `alan: 'kisaAd'`;
- "Selin Kaya" kendi şifresiyle girer: `sifreDegismeli: false`, tek portalında doğrudan müdür (`role: 'principal'`, `rolSatiri: true`);
  `GET /api/kisilikler`'de `okulKisaAd: 'acilis-<z>'`, girilebilir müdür rolü;
- aynı kişiye yeni koduyla ikinci okul açılır → 200; yeniden girişte `kisilikSec: true` ve iki müdür portalı.

### KVKK: müdürün açtığı hesap onay vermeden kullanamaz (6)

E-postalı bir öğrenci `student-create` ile açılır (aydınlatma metnini onaylamamış). Girer: `kvkkGuncel: false`; `/api/progress` →
403 `kvkkGerek: true`; `/api/me` açık (`kvkkGuncel: false`); `POST /api/kvkk-onay { onay: 'evet' }` → 400 (gerçekten `true` olmalı);
`{ onay: true }` → 200 `kvkkGuncel: true`; `/api/progress` 200.

Sonunda boş satır ve `GECTI: 84   KALDI: 0`; `KALDI` varsa çıkış kodu 1. Beklenmeyen hata `TEST HATASI:` ile, çıkış kodu 1.

## Kimle konuşur?

- **Modüller:** yalnız [giris.md](giris.md) (`mudurYap` içinde `sunucu/ortak.js`'in `kisaAdUret`'i); sunucu modülü `require` etmez.
- **Sunucu uçları:**

  | Uç | Ne için | Belge |
  |---|---|---|
  | `POST /api/school/student-create`, `/hesap-ac`, `/student-update`, `/hesap-guncelle`, `/student-password`, `/hesap-sifre`, `/hesap-sil`, `GET /api/school/hesap?id=`, `GET /api/school/servisciler`, `GET`/`POST /api/school/adres`, `POST /api/school/ogretmen-ekle` (`ogretmenYap`) | okulun hesapları ve adresi | [../sunucu/bolumler/hesaplar.md](../sunucu/bolumler/hesaplar.md) |
  | `POST /api/school/student-code-reset`, `POST /api/school/class` | veli kodu, sınıf | [../sunucu/bolumler/okul.md](../sunucu/bolumler/okul.md) |
  | 409 `nakil` | başka okulun öğrencisi | [../sunucu/bolumler/nakil.md](../sunucu/bolumler/nakil.md) |
  | `POST /api/login`, `POST /api/register`, `POST /api/password`, `POST /api/kvkk-onay`, `GET /api/me`, `GET /api/okul-adres?kisa=`, `GET /api/okul-adres/ara?q=` | giriş, şifre, aydınlatma metni, okul adresi | [../sunucu/bolumler/kayit.md](../sunucu/bolumler/kayit.md) |
  | `GET /api/progress(?studentId=)`, `GET /api/myschedule?studentId=` | kapıları denemek, müdürün öğrenciye bakması | [../sunucu/bolumler/ilerleyis.md](../sunucu/bolumler/ilerleyis.md) |
  | `GET /api/kisilikler` | kişi kodu, portallar | [../sunucu/bolumler/kisilik.md](../sunucu/bolumler/kisilik.md) |
  | `GET /api/admin/principals` | müdür listesi | [../sunucu/bolumler/yonetici.md](../sunucu/bolumler/yonetici.md) |
  | `POST /api/admin/okul-ac` | okul açma | [../sunucu/bolumler/yonetici-okul.md](../sunucu/bolumler/yonetici-okul.md) |
  | `GET /api/davetlerim`, `GET /api/school/kisi-bul` | kaldırılmış uçlar (404) | [../sunucu/api.md](../sunucu/api.md) |

- **Koruduğu kod:**
  - [../sunucu/bolumler/hesaplar.md](../sunucu/bolumler/hesaplar.md) — `hesapDogrula` (ad-soyad, T.C. zorunlu ve okulda tek, rakamdan ad
    yalnız kendi T.C.'si, boş kullanıcı adı/şifrenin T.C. olması, okul içinde tek ad, branş listesi), `yonetilenHesap` (`YETKI`
    tablosu: öğretmen öğrenci açamaz, öğrencide silme yetkisi yok, başka okulun hesabına 404), `hesapGorunumu` (`tc`, `bagli`),
    bağlı öğretmende yalnız branş/rol, şifre sıfırlamada boş şifrenin T.C.'ye dönmesi, `hesap-sil`'in onayı ve öğretmenin yalnız rol
    satırını silmesi, adres uçları.
  - [../sunucu/bolumler/kayit.md](../sunucu/bolumler/kayit.md) — okul adresiyle giriş (`okulSec`, yanlış okul, T.C. ile giriş), zorunlu
    şifre ve aydınlatma metni kapıları, `POST /api/password`'ün T.C. kuralı, `okul-adres` ve bulanık okul araması
    ([../sunucu/yardimci/bulanik-arama.md](../sunucu/yardimci/bulanik-arama.md)); [../sunucu/api.md](../sunucu/api.md) — `kvkkGerek`,
    `sifreDegismeli`, `rolsuz` kapıları ve yönetici uçlarının 404'ü.
  - [../sunucu/bolumler/yonetici-okul.md](../sunucu/bolumler/yonetici-okul.md) — `okulAc`'ın denetim sırası (okul → adres → kod),
    kodun harcanıp yenilenmesi, ikinci okulun aynı kişiye eklenmesi; [../sunucu/ortak.md](../sunucu/ortak.md) — `kisaAdSorunu`
    (ayrılmış adlar), `kisiKoduSade` (tire ve boşluk temizliği), `adDuzelt`, `sifreSorunu`.
  - [../sunucu/bolumler/nakil.md](../sunucu/bolumler/nakil.md) — başka okuldaki T.C.'nin 409'u;
    [../sunucu/veri/depo/kullanicilar.md](../sunucu/veri/depo/kullanicilar.md) — okul içinde tek ad, iki okulda aynı ad, giriş kimliği;
    [../sunucu/bolumler/okul.md](../sunucu/bolumler/okul.md) — `sinifAdiDuzelt` ("8b" → "8-B") ve aynı adlı sınıfın reddi ("Bu adda bir
    sınıf zaten var"), `student-code-reset`.
- **Tablolar:** uçlar üzerinden `kullanicilar`, `okullar`, `siniflar`, `oturumlar`, `islem_kaydi`, `bildirimler`.
- **Ön yüz** (bu pakette tarayıcı yok): müdürün Hesaplar ekranı [../public/js/parcalar/10b-hesaplar.md](../public/js/parcalar/10b-hesaplar.md),
  Öğrenciler listesindeki "Öğrenci ekle" düğmesi [../public/js/parcalar/10-mudur.md](../public/js/parcalar/10-mudur.md), okul adresi
  [../public/js/parcalar/16b-okul-ayarlari.md](../public/js/parcalar/16b-okul-ayarlari.md), açılış sayfasında okul arama
  [../public/js/parcalar/05a-dis-sayfalar.md](../public/js/parcalar/05a-dis-sayfalar.md), zorunlu şifre ekranı
  [../public/js/parcalar/05b-sifre-zorunlu.md](../public/js/parcalar/05b-sifre-zorunlu.md), rolsüz yetişkinin ana sayfası ("+ Ekle"ye
  çağıran kart; `portalAnaSayfasi`) [../public/js/parcalar/08c-kisilikler.md](../public/js/parcalar/08c-kisilikler.md) (yönlendiren
  [../public/js/parcalar/08-ana-sayfa.md](../public/js/parcalar/08-ana-sayfa.md)), yönetim panelinin müdür listesi ve "Okul aç"
  penceresi [../public/js/yonetim/09-yonetici.md](../public/js/yonetim/09-yonetici.md) ve o penceredeki okul seçme alanı
  [../public/js/parcalar/08b-rolsuz.md](../public/js/parcalar/08b-rolsuz.md) (adındaki "rolsüz" eski bir işten kalma; rolsüz
  yetişkinle ilgisi yok).
- **Onu çalıştıran:** `testler/tumtest.sh`, sunuculu paketlerin ilki (sunucusuz paketlerden sonra, `test-program`'dan önce); sıfırlanmış
  veritabanı + seed. Ek ortam değişkeni almaz.

## Nasıl çalışır (adım adım)?

```
müdür (T), yönetici (A) girer
1–2) student-create: Deniz Kara ─► 7 bozuk istek 400
3–3b) büyük harfle giriş ; ad+soyad+T.C. ─► T.C./T.C. giriş ─► progress 403 ─► şifre koy ─► progress 200
4–6) ad değiştir ─► şifre sıfırla (ve boş şifre ─► T.C.) ─► veli kodu yenile
7) müdür: progress?studentId, myschedule?studentId
8) öğretmen 403'ler ; teacher hesap-ac 400 ; ogretmenYap(Selim) ─► branş, telefon, bağlı ; servisçi ; sil (onaylı)
8b) mudurYap(ikinci okul) ─► aynı ad iki okulda ─► okulSec / okul adresiyle giriş ─► okul-adres, ara ─► adres değiştir ─► yabancı 404
8c) rolsüz ─► 403 rolsuz ; eski uçlar 404 ; "8b" ─► "8-B"
9) principals ; müdüre 404
9b) Selin Kaya'nın kodu ─► okul-ac (bozuk, eski yol, yanlış kod) ─► aç ─► kod yenilendi ─► tekrar/eski kod/aynı adres ─► ikinci okul
KVKK) onaysız öğrenci ─► 403 kvkkGerek ─► /me açık ─► onay ─► 200
```

## Dikkat!

- **"Yeni şifre eskisiyle aynı olamaz" denetimi o kuralı kanıtlamıyor.** 3b'de öğrencinin eski şifresi T.C. no'dur (yalnız rakam); aynı
  değer yeni şifre olarak gönderilince sunucu "eskisiyle aynı" kuralına varmadan "şifre en az bir harf ve bir rakam içermeli"
  kuralından 400 döner. 3 Ekim'de 3200'deki test sunucusunda ayrı bir küçük betikle aynı adımlar denendi: cevap
  "Yeni şifre: şifre en az bir harf ve bir rakam içermeli"; `'a' + T.C.` ise "Yeni şifre T.C. kimlik numaranı ya da kullanıcı adını
  içermesin." aldı (o denetim doğru kuralı sınıyor); belge denetiminde aynı betik yeniden koşuldu, aynı iki cevap geldi. Sıra
  `kayit.js`'te de böyle: önce `sifreSorunu`, sonra `np === eski`, en son T.C./kullanıcı adı. `np === eski` dalını şu an hiçbir test denemiyor;
  kuralı gerçekten sınamak için harf içeren bir eski şifreyle (ör. önce şifresi verilmiş bir hesapla) denenmeli. Kod değiştirilmedi.
- **Müdür listesi denetimi zayıf.** 9. bölüm ilk satırda `schoolName`'in dolu olmasına bakar; sunucu okulu olmayan müdürde de
  `'(okul yok)'` döndüğü için bu kısım her zaman tutar. Kanıtladığı asıl şey `students`'ın sayı olması ve müdüre 404.
- **Aynı veritabanında ikinci koşu bir denetimde düşer.** 3 Ekim'de sıfırlanmış sunucuda arka arkaya iki koşu: ilki 84/0, ikincisi
  `GECTI: 83   KALDI: 1` — "sinif adi "8b" -> "8-B"" ("Bu adda bir sınıf zaten var"). Öteki adlar `z = Date.now()` ile her koşuda yenidir.
  Elle koşarken sunucuyu sıfırla.
- **Kapı sırası önemli.** 3b'de T.C.'yle açılan öğrenci önce aydınlatma metnini onaylar; yoksa `/api/progress` `sifreDegismeli` yerine
  `kvkkGerek` ile 403 dönerdi (sunucuda aydınlatma metni kapısı şifre kapısından önce). KVKK bölümündeki öğrencinin şifresi müdürce
  verildiği için şifre kapısına takılmaz.
- **Bellekte tutulan sınırlar.** Okul adresi okul başına günde 10 kez değişebilir; müdür saatte 120 hesap açabilir; yanlış girişler
  kaba kuvvet sayacına yazılır (bu paket birkaç bilerek yanlış giriş yapar). Hepsi sunucu yeniden başlayınca sıfırlanır; `tumtest.sh` her
  paketten önce sunucuyu yeniden başlatır.
- **Seed'e bağlı.** Seed okulunun adresi (`adres1`), Matematik öğretmeni ve "Matematik", "Türkçe" branşlarının listede olması
  seed'den ve `sunucu/ortak.js`'teki sabit ders listesinden gelir.
- **İki okulda aynı ad denetimleri birbirine yaslanır.** "okul seçmeden girilince okul soruluyor" ancak aynı kullanıcı adı TAM iki okulda
  varken anlamlıdır; önceki adımlardan biri düşerse sonraki giriş denetimleri de yanlış sebeple düşer.
- **Varsayılan adres 3000.** `EE_BASE` vermezsen istekler 3000'deki sunucuna gider; her zaman sıfırlanmış test sunucusunu ver.

## Testleri

- Bu dosyanın kendisi testtir; `testler/tumtest.sh` her tam koşuda (sunuculu paketlerin ilki olarak) çalıştırır. Aynı alanda:
  [test-yetiskin.md](test-yetiskin.md) (yetişkin hesabı ve portallar, kişi koduyla öğretmen ve müdür), [test-kisi-kodu.md](test-kisi-kodu.md)
  (kişi kodu ve veli kodunun biçimi), [test-giris-bilgisi.md](test-giris-bilgisi.md) (toplu giriş bilgisi dağıtımı),
  [test-nakil.md](test-nakil.md) (başka okuldaki öğrencinin nakli), [test-okul-sayfasi.md](test-okul-sayfasi.md) (okul adresindeki
  sayfa), [test-sifre.md](test-sifre.md) ("Şifremi unuttum" akışı), [test-cakisma.md](test-cakisma.md) (aynı anda gelen hesap
  açmaları), [yetki-denetimi.md](yetki-denetimi.md) ve [girdi-denetimi.md](girdi-denetimi.md) (her uç × her rol, bozuk gövdeler).
- Elle (Git Bash, proje kökünde): sunucu 3200'de sıfırlanmış `egitimevi_test` ve [seed.md](seed.md) ile açık olmalı:

  ```
  EE_BASE=http://localhost:3200 EE_LOG=testler/test-sunucu.log node testler/test-yonetim.js
  ```

  Tarayıcıda: müdürle **Hesaplar → Öğrenci ekle**'de yalnız ad, soyad ve T.C. yaz; o öğrenciyle T.C./T.C. gir: önce şifre belirleme
  ekranı gelmeli, şifre T.C.'yi içeriyorsa reddedilmeli.
- 3 Ekim 2026'da bu belge için 3200'de (sıfırlanmış `egitimevi_test`, seed) koşuldu: `GECTI: 84   KALDI: 0`, yaklaşık 4 saniye; sunucu
  günlüğünde `API hatası` ya da `Veritabanı hatası` yoktu. Sıfırlayıp arka arkaya iki kez koşulunca ilki 84/0, ikincisi 83/1 ("Dikkat!").
  Belge denetiminde (aynı gün) yeniden koşuldu: 84/0 (~4 sn), ardından aynı veritabanında 83/1 (yine "Bu adda bir sınıf zaten var").

## Son durum

- `git log`: 5 commit. Son üçü:
  - `153d63d commit 522` (2026-09-27, kişi kodu 16 hane) — veli kodu ve kişi kodu denetimleri 15'ten 16 karaktere (`-` yerine `=`);
    "kimsede olmayan kod" örneği 16 karakter oldu; kod artık `XXXX-XXXX XXXX - XXXX` gibi tireli ve boşluklu yazılarak gönderiliyor
    (önceden 5'erli boşluklu).
  - `276c0a0 commit 521` (2026-09-27, gizli `/admin`) — müdürün `GET /api/admin/principals` ve `POST /api/admin/okul-ac` istekleri 403
    yerine 404 bekleniyor (yönetici uçları yönetici olmayana bilinmeyen adres).
  - `0acca75 commit 516` (2026-09-27, kayıt/kişi kodu/portallar) — veli kodu 10 karakterden yeni biçime; eski davet uçlarının rolsüz
    kişiye 403 yerine 404 vermesi; 9b baştan yazıldı: yönetici artık okulu e-posta ve şifreyle yeni müdür hesabı açarak değil, kişinin
    yetişkin hesabındaki kişi koduyla (`mudurKodu`) açıyor; kodsuz/eski yol/yanlış kod/kullanılmış kod denetimleri, kodun yenilenmesi,
    müdürün kendi şifresiyle doğrudan müdür portalına girmesi eklendi; eski "zayıf şifre" ve "müdür ilk girişte şifre değiştirir"
    denetimleri kalktı.
- Öncesi: `ee035f8 commit 337` (2026-09-26) ve dosyanın ilk hâli `282c495 commit 44` (2026-08-28).
- Açık iş: 3b'deki "eskisiyle aynı" denetiminin yanlış kuraldan geçmesi ("Dikkat!"). Kod değiştirilmedi.
- Planlı işlerden bu dosyayı etkileyecekler:
  - **"Güvenlik denetimi"** — tanım: okulun verdiği HER şifre ilk girişte değişecek (yalnız T.C.'yle açılanlar değil; öğrenci ve
    servisçi, yetkilinin sıfırlaması da). 3. bölümdeki "şifre değiştirmesi gerekmiyor (şifreyi müdür yazdı)" tersine döner; 5. bölümde
    yeni şifreyle giren öğrenci de önce kendi şifresini koymalı.
  - **"Tek kişi tek hesap + portallar öğrencide de"** — kullanıcı adı SİTE GENELİNDE tek olacak, T.C. kişi başına sistem genelinde tek
    (servisçi dahil): 8b'deki "aynı kullanıcı adı iki okulda ayrı hesap", `okulSec` ve okul adresiyle iki ayrı hesaba giriş denetimleri
    yeniden yazılır.
  - **"Çalışan olarak ekleme"** — kodla eklenen kişi rolsüz çalışan olacak, Öğretmen rolünü müdür verecek; 8. bölümde `ogretmenYap` ile
    eklenen öğretmenin hemen branşlı öğretmen olması ve "Kodla ekle" iletisi değişir.
  - **"T.C. kimlik no bütün hesaplarda zorunlu"** (kod Linux'ta) — `hesapAc` ve `ogretmenYap` yetişkin hesaplarını T.C.'siz açıyor;
    kural gelince yardımcılar T.C. göndermeli.
  - **"Paneller … /duzenle okul sayfaları … birden çok müdür"** — okul ekleme `/duzenle/okul/yeni`'ye, müdür listesi okul gezginine
    taşınacak; "Müdür bekliyor" / `pending` kalıntıları "Müdürü yok" olacak: 9. ve 9b bölümünün uçları ve cevap alanları değişebilir.
  - **"Özel branş / ders"** (kod Linux'ta) — bugün sabit olan ders listesi okula göre genişleyecek; "listede olmayan branş" denetimi
    okulun listesine göre yazılmalı.
  - **"Sistem: yöneticiye ZORUNLU TOTP"** — 9. ve 9b bölümündeki yönetici girişi değişir.
