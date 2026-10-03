# testler/test-yetiskin.js

Yetişkin hesabı ile okul rollerinin (portalların) bütün yaşam döngüsünü deneyen sunuculu test paketi (55 denetim): kayıt ve iki
adımlı giriş, öğretmenin kişi koduyla okula eklenmesi, portallar ve portal değiştirme, iki okulda iki rol + veli olmak, şifrenin ve
kişisel bilgilerin yetişkin hesabına ait olması, okuldan ayrılma/çıkarılma, hesabı silme, aynı kullanıcı adının okulda ve dışarıda
kullanılması, dosyayla öğretmen eklenememesi.

## Bu dosya ne yapar?

Eğitim Evi'nde kendisi kaydolan TEK hesap türü **yetişkin hesabıdır**. Öğretmen de, müdür de, veli de önce bu hesabı açar; okuldaki
her görev bu hesabın altında ayrı bir **rol satırı** (portal) olur ("Öğretmen · Test Ortaokulu", "Müdür · B Okulu", "Veli · Zeynep
Şahin"). Öğretmen kişi kodunu müdüre verir, müdür kodu girince öğretmen olur; okulunu açtırmak isteyen kişi kodunu sistem
yöneticisine verir, yönetici okulu açıp onu müdür yapar; veli çocuğunun veli koduyla çocuğunu ekler
([../sunucu/bolumler/kisilik.md](../sunucu/bolumler/kisilik.md), [../sunucu/bolumler/kayit.md](../sunucu/bolumler/kayit.md)).

Bu modelde yanlış gidebilecek çok şey var: bir kişi başkasının rolüne geçebilir mi, müdür öğretmenin şifresini değiştirebilir mi,
şifre değişince hangi hesabın şifresi değişir, öğretmen okuldan ayrılınca kendi hesabı kalır mı, müdür hesabını silip okulu sahipsiz
bırakabilir mi... Dosyanın başındaki yorum maddeleri paketin kanıtladığı kuralları sayar: yetişkin hesabına (öğrenci dışında)
e-postayla kod; müdür başvurusu yok, yönetici okulu açar; öğretmen kodu tek kullanımlık; tek portalda doğrudan giriş, çok portalda
yetişkin hesabının ana sayfası; oturum cevabında ve `/api/me`'de `portallar`; iki okulda rol + veli; okuldan ayrılma/çıkarılma,
onaylı müdürün rolünü bırakamaması; şifre, kişisel bilgi ve telefon bildirimi aboneliğinin yetişkin hesabına ait olması; şifreyle,
müdürken yapılamayan hesap silme.

## İçinde neler var?

### Yardımcılar

- `kontrol(ad, sart, detay)` — `GECTI`/`KALDI` satırı, sayaçlar `gecti`/`kaldi`. `J(x)` — 240 karakterlik JSON.
- `ilkAdim(kimlik, sifre, okul)` — girişin yalnız İLK adımı: bot sorusunu çözer, `POST /api/login { kimlik, password, okul,
  challengeId, challengeAnswer }`'ın ham cevabını döner. Kod istenip istenmediğini (`twoFactor`) ve 401'i görmek için.
- Ortak yardımcılar [giris.md](giris.md) üzerinden ([../araclar/giris.md](../araclar/giris.md)): `iste`, `girisYap` (iki adımı
  da yapar; kodu `EE_LOG` günlüğünden okur), `hesapAc` (kayıt + e-posta onay bağlantısı), `kisiKodu`, `kisilikGec`, `okulHesabi`
  (`teacher` için `ogretmenYap`), `tcUret`, `botCevabi`.
- 11. bölümde [../sunucu/yardimci/xlsx.md](../sunucu/yardimci/xlsx.md) (`yaz`, `oku`) — Excel dosyası üretmek ve şablonu okumak için;
  7. bölümde Node'un `crypto`'su (telefon bildirimi aboneliği için geçerli bir P-256 genel anahtarı).

### Hesaplar ve veriler

Sunucunun ilk sistem yöneticisi (`A`) ve seed'den ([seed.md](seed.md)): "Test Ortaokulu"nun müdürü (`M`; okulun adı, kimliği ve adresi `okulA`'dan),
Matematik öğretmeni (`O1`), öğrenciler `ogrenci1` (veli kodu bu paketteki çocuğu bağlamak için) ve `ogrenci2`. Paketin açtıkları
(`z = Date.now().toString(36)`): "Yeter Ekin" (`yet<z>`) yetişkin hesabı — paketin baş kişisi; "Yetişkin Koleji <z>" (Ankara/Mamak,
adresi `yetiskin-koleji-<z>`); müdürün kodla eklediği öğretmen "Çıkan Öğretmen" (`cik<z>`; kendi hesabını `ogretmenYap` açar);
okulun açtığı öğrenci "Ortak Ogrenci" (`ortak<z>`), "Dört Yetişkin" (`dort<z>`) yetişkin hesabı ve okulun ona aynı adla açtığı öğrenci
"Ayni Adli".

### 1) Kayıt ve iki adımlı giriş (7)

- "Yeter Ekin" kaydolur (`hesapAc`). İlk adımda `twoFactor: true` (yetişkine e-postayla kod gider); seed öğrencisi e-postasıyla girince
  kod istenmez, anahtar doğrudan gelir.
- Rolü olmayan yetişkin kendi hesabına girer: `user.yetiskin: true`, `role` boş, `kisilikSec` yok.
- `GET /api/kisilikler` → `roller` ve `cocuklar` boş, `kisiKodu` 16 karakterlik ham kod (`/^[A-Za-z][A-Za-z0-9!?#*+=]{15}$/`).
- Giriş cevabında `portallar` boş dizi ve `hesapAktif: true`.
- Öğrenci ve yönetici `GET /api/kisilikler` → 403 (yetişkin hesabı değiller).
- Müdür `POST /api/school/hesap-ac { rol: 'teacher', … }` → 400 (öğretmen hesabını okul açamaz; kendisi açar).

### 2) Öğretmen kodla ekleniyor (8)

- Müdür `POST /api/school/ogretmen-bul { kod }` → yalnız maskeli ad `"Ye*** Ek**"` ve `zatenOkulda: false`.
- Matematik öğretmeni (yetkisiz) aynı uç → 403.
- `POST /api/school/ogretmen-ekle { kod, brans: 'Matematik' }` → 200, `hesap.id` (rol satırının kimliği). Aynı kodla ikinci kez → 404
  (kod tek kullanımlık, eklenince yenilenir).
- Kişinin `kisilikler`'inde yeni bir kod ve tek rol: `teacher`, `girilebilir`, `okulAdi` seed okulunun adı. Bildirimlerinde "öğretmen
  olarak ekledi".
- Kişi kullanıcı adıyla yeniden girince TEK portalı olduğu için doğrudan öğretmen rolüne girer: `role: 'teacher'`,
  `rolSatiri: true`, `schoolId` seed okulu, `fullName` "Yeter Ekin". Rol satırında `email` ve `tc` yok.

### 3) Okul rolü satırı: kim neyi değiştirir (3)

- Müdür `POST /api/school/hesap-guncelle`'de adı değiştiremez (400), branşı "Fen Bilimleri" yapabilir (200);
  `POST /api/school/hesap-sifre` ile şifreyi değiştiremez (400): kişisel bilgiler öğretmenin kendi hesabındadır.
- `GET /api/school/hesap?id=` → `hesap.bagli: true`.
- Okul sayfasından (`okul` = seed okulunun adresi) rol satırının kullanıcı adıyla giriş → `twoFactor: true`: yetişkin hesabına gider.
  Nedeni: rol satırları girişte hiç aranmaz (`depo/kullanicilar.js` `girisKimligiyle`, `ana_hesap_id IS NULL`); rol satırı yetişkin
  hesabının adını taşıdığı için aynı adlı yetişkin hesabı bulunur.

### 4) İkinci rol: veli (8)

- Öğretmen rolündeyken `POST /api/kisilik/cocuk { code }` (`ogrenci1`'in veli kodu) → çocuk yetişkin hesabına eklenir.
- Yeniden giriş: iki portal var, `kisilikSec: true`, `user.yetiskin: true` (yetişkin hesabının ana sayfası).
- `portallar`: öğretmen satırı (`tur: 'rol'`, `ad: 'Öğretmen'`, `alt` ve `okulAdi` okul adı) ve veli satırı (`tur: 'veli'`, `id`
  çocuğun kimliği, `ad: 'Veli'`, `alt` çocuğun adı); ikisi de `girilebilir`, hesabın kendisindeyken hiçbiri `aktif` değil,
  `hesapAktif: true`.
- `kisilikGec(… 'rol', öğretmenRolü)` → öğretmen olunur. Geçiş cevabında ve `GET /api/me`'de `hesapAktif: false`, iki portal,
  öğretmen portalı `aktif`. Eski anahtarla `GET /api/me` → 401 (geçişte eski oturum kapanır).
- `kisilikGec(… 'veli', çocuk)` → `role: 'parent'`, `cocuk` çocuğun kimliği, `children` tek; `hesapAktif: true` ve o çocuğun veli
  portalı `aktif`. Bu oturum (`V`) sonraki bölümlerde kullanılır.

### 5) Başkasının rolü (1)

`POST /api/kisilik/gec` ile müdürün rol satırına, bağlı olmayan `ogrenci2`'ye ve bozuk kimliğe (`{ $ne: 1 }`) geçiş: üçü de 404.

### 6) İki okul: A'da öğretmen, B'de müdür (8)

- Eski müdür başvurusu ucu `POST /api/okul-basvurusu` → 404 (kaldırıldı; rolsüz kişiye de 404).
- Kişi kodunu (`kisiKodu(V)`) yöneticiye verir; yönetici `POST /api/admin/okul-ac { schoolName, city, district, kisaAd, mudurKodu }`
  → 200, `mudur.ad` "Yeter Ekin"; kişinin `V` oturumu düşmez (`/api/me` 200). Kişiye "müdürü olarak eklendin" bildirimi.
- `kisilikler`: iki girilebilir rol, bir çocuk, kişi kodu yine yenilenmiş.
- Müdür rolüne geçilir (`MB`): `role: 'principal'`, `schoolId` A okulu değil; `GET /api/school/students` boş (A'nın öğrencileri
  görünmez).
- `POST /api/kisilik/ayril { id: müdürRolü, onay: true }` → 400 (onaylı müdür rolü bırakılamaz; okul sahipsiz kalmasın).
  `POST /api/hesap/sil { sifre, onay: true }` → 400 (müdürken hesap silinemez).

### 7) Şifre ve kişisel bilgiler yetişkin hesabının (9)

- Müdür rolündeyken `POST /api/password` → 200; ilk adımda eski şifre 401, yeni şifre 200: şifre yetişkin hesabınındır.
- `POST /api/hesap/bilgi`: yanlış mevcut şifre → 400 `alan: 'sifre'`; alınmış kullanıcı adı (`mudur`) → 400 `alan: 'kullaniciAdi'`;
  boş e-posta → 400 (yetişkinde e-posta zorunlu); yeni kullanıcı adı + telefon `0533 111 22 33` → 200, `username` yeni,
  `phone: '+905331112233'`.
- Müdür rolündeyken `GET /api/hesap` yetişkin hesabının bilgilerini verir (yeni kullanıcı adı, kayıttaki e-posta, `yetiskin: true`).
- `POST /api/profile { fullName: 'Yeter Ekinci' }` → A okulunun öğretmen listesinde (`GET /api/school/teachers`, müdür `M`) ad
  güncel.
- Müdür rolündeyken `POST /api/push/abone`; hesaba geçilip (`kisilikGec(… 'hesap')`, `VV`) `POST /api/push/durum { endpoint }` →
  `benim: true`: abonelik kişinindir, her rolünden aynıdır.

### 8) Okuldan ayrılma ve çıkarılma (4)

- Öğretmen rolüne geçilir (`OA`), `POST /api/kisilik/ayril { id, onay: true }` → 200, yeni `token`, `user.yetiskin: true` (bulunduğu
  rol kapandı, yetişkin hesabına döndü). A müdürüne "ayrıldı" bildirimi. Eski `OA` anahtarı 401.
- Müdür `okulHesabi(M, 'teacher', …)` ile "Çıkan Öğretmen"i ekler (kişi kendi hesabını açar, kodunu verir), sonra
  `POST /api/school/hesap-sil { id, onay: true }` ile çıkarır: kişi yine girebilir, `yetiskin: true`, rolsüz.

### 9) Hesabı silme (3)

- "Çıkan Öğretmen": yanlış şifreyle ya da `onay`'sız `POST /api/hesap/sil` → 400. Doğrusuyla 200; sonra ilk adım 401 ve
  `hesapYok: true`.
- Öğrenci `POST /api/hesap/sil` → 403 (öğrenci hesabını okul siler).

### 10) Aynı ad: okulda öğrenci, yetişkin hesabı (2)

- Okul `ortak<z>` adlı öğrenci açar; aynı adla `POST /api/register` → 400 (kaydolan hesabın adı hiçbir yerde kullanılmamış olmalı).
- Tersi serbest: önce `dort<z>` yetişkin hesabı açılır, sonra okul aynı adı bir öğrenciye verir (okulun kendi ad alanı). Okul sayfasından
  (`okul` = seed okulunun adresi) aynı adla öğrencinin şifresiyle girilince anahtar gelir; yetişkinin şifresiyle girilince
  `twoFactor: true` (sunucu şifreyi yetişkin hesabında da dener).

### 11) Dosyayla öğretmen eklenmez (2)

- "Öğretmenler" sayfalı bir `.xlsx` (`Ad`, `Soyad`, `T.C. Kimlik No`) `POST /api/school/kisi-aktarim { dosya, dosyaAdi, uygula: false }`
  ile önizlenir: 200, `hazir: 0`, raporda "kendi hesabını açar".
- `GET /api/school/kisi-sablon` şablonunda "Öğretmenler" sayfası yok, "Öğrenciler" var.

Sonunda boş satır ve `GECTI: 55   KALDI: 0`; `KALDI` varsa çıkış kodu 1. Beklenmeyen hata `  TEST HATASI: <yığın>` olarak yazılır
(bu paket `console.log` kullanır), çıkış kodu 1.

## Kimle konuşur?

- **Modüller:** [giris.md](giris.md); [../sunucu/yardimci/xlsx.md](../sunucu/yardimci/xlsx.md) (test sürecinde, yalnız dosya
  üretip okumak için); Node'un `crypto`'su.
- **Sunucu uçları:**

  | Uç | Ne için | Belge |
  |---|---|---|
  | `POST /api/register`, `POST /api/eposta-onay`, `POST /api/login`, `POST /api/login/dogrula`, `GET /api/me`, `POST /api/password`, `POST /api/profile`, `GET /api/notifications` | kayıt, giriş, portallar, şifre, ad | [../sunucu/bolumler/kayit.md](../sunucu/bolumler/kayit.md) |
  | `GET /api/kisilikler`, `POST /api/kisilik/gec`, `/kisilik/cocuk`, `/kisilik/ayril`, `GET /api/hesap`, `POST /api/hesap/bilgi`, `POST /api/hesap/sil` | portallar ve yetişkin hesabı | [../sunucu/bolumler/kisilik.md](../sunucu/bolumler/kisilik.md) |
  | `POST /api/school/ogretmen-bul`, `/ogretmen-ekle`, `/hesap-ac`, `/hesap-guncelle`, `/hesap-sifre`, `/hesap-sil`, `GET /api/school/hesap?id=` | okulun hesapları | [../sunucu/bolumler/hesaplar.md](../sunucu/bolumler/hesaplar.md) |
  | `GET /api/school/students`, `GET /api/school/teachers` | listeler | [../sunucu/bolumler/okul.md](../sunucu/bolumler/okul.md) |
  | `POST /api/admin/okul-ac` | okul açma, kişi koduyla müdür | [../sunucu/bolumler/yonetici-okul.md](../sunucu/bolumler/yonetici-okul.md) |
  | `POST /api/push/abone`, `POST /api/push/durum` | telefon bildirimi aboneliği | [../sunucu/bolumler/push.md](../sunucu/bolumler/push.md) |
  | `POST /api/school/kisi-aktarim`, `GET /api/school/kisi-sablon` | Excel ile kişi aktarımı | [../sunucu/bolumler/kisi-aktarim.md](../sunucu/bolumler/kisi-aktarim.md) |
  | `POST /api/okul-basvurusu` | kaldırılmış uç (404) | [../sunucu/api.md](../sunucu/api.md) |

- **Koruduğu kod:**
  - [../sunucu/bolumler/kisilik.md](../sunucu/bolumler/kisilik.md) — bu dosyanın en geniş testi: `anaHesap` (öğrenci ve yöneticiye 403),
    `kisilikler` (kişi kodu ham), `kisilik/gec` (yalnız kendi rol satırına ve bağlı çocuğa; eski anahtar kapanır), `kisilik/cocuk`,
    `kisilik/ayril` (müdür bırakamaz; bulunduğu rolü bırakan yetişkin hesabına döner; müdüre bildirim), `hesap/bilgi` (mevcut şifre,
    alınmış ad, zorunlu e-posta, rol satırlarına yayılan telefon), `hesap/sil` (şifre, onay, müdürken yok).
  - [../sunucu/bolumler/kayit.md](../sunucu/bolumler/kayit.md) — `girisOturumu` (tek portal → doğrudan rol; çok portal → `kisilikSec`),
    `portalBilgisi` (`portallar`, `hesapAktif`, `aktif`), iki adımlı girişin kimlere istendiği, okul sayfasında aynı adlı öğrenci varken
    yetişkin şifresinin de denenmesi, kayıtta adın hiçbir yerde kullanılmamış olması, şifre ve profilin yetişkin hesabına yazılması.
  - [../sunucu/bolumler/hesaplar.md](../sunucu/bolumler/hesaplar.md) — `ogretmen-bul` (`adMaskele`, `ogretmen.onayla` yetkisi),
    `ogretmen-ekle` (kodun aynı işlemde harcanıp yenilenmesi, bildirim), bağlı öğretmende yalnız branş/rol düzenlenmesi ve şifre
    değiştirilememesi, `hesap-ac`'ın öğretmeni reddetmesi, `hesap-sil`'in yalnız rol satırını silmesi.
  - [../sunucu/bolumler/yonetici-okul.md](../sunucu/bolumler/yonetici-okul.md) — kişi koduyla müdür yapma, bildirim, kodun yenilenmesi.
  - [../sunucu/bolumler/kisi-aktarim.md](../sunucu/bolumler/kisi-aktarim.md) — öğretmen sayfasının reddi ve şablon.
  - [../sunucu/bolumler/push.md](../sunucu/bolumler/push.md) — aboneliğin ana hesaba yazılması.
  - [../sunucu/veri/depo/kullanicilar.md](../sunucu/veri/depo/kullanicilar.md) — `rolleri`, `cocuklari`, `kullaniciAdiHerhangiYerde`,
    `kullaniciAdiBaskasinda`, `okuldaBosAd`, `rolSatiriniSil`, giriş kimliği (`girisKimligiyle`'in `yedek`'i).
- **Tablolar:** uçlar üzerinden `kullanicilar` (yetişkin hesabı ve rol satırları), `veli_baglari`, `okullar`, `oturumlar`,
  `bildirimler`, `push_abonelikleri`, `eposta_onaylari` (kaydın e-posta onay bağlantısı; kodda `depo.onaylar`).
- **Ön yüz** (bu pakette tarayıcı yok): Portallarım ve "+ Ekle" [../public/js/parcalar/08c-kisilikler.md](../public/js/parcalar/08c-kisilikler.md),
  menü [../public/js/parcalar/06-menu.md](../public/js/parcalar/06-menu.md), giriş [../public/js/parcalar/05-giris.md](../public/js/parcalar/05-giris.md),
  yetişkinin ana sayfası [../public/js/parcalar/08-ana-sayfa.md](../public/js/parcalar/08-ana-sayfa.md), Ayarlar (hesap bilgileri,
  hesabı silme) [../public/js/parcalar/23-veli-ayarlar.md](../public/js/parcalar/23-veli-ayarlar.md), müdürün "Kodla ekle"si (düğme
  Öğretmenler listesinde [../public/js/parcalar/10-mudur.md](../public/js/parcalar/10-mudur.md), `ogretmen-kodla` eylemi ve
  `ogretmen-bul` isteği [../public/js/parcalar/10b-hesaplar.md](../public/js/parcalar/10b-hesaplar.md)), Excel aktarımı
  [../public/js/parcalar/15-aktarim.md](../public/js/parcalar/15-aktarim.md), telefon bildirimi izni
  [../public/js/parcalar/04b-bildirim-izni.md](../public/js/parcalar/04b-bildirim-izni.md).
- **Onu çalıştıran:** `testler/tumtest.sh`, sunuculu paketlerde `test-servis-yoklama`'dan sonra, `test-kisi-kodu`'dan önce (sıfırlanmış
  veritabanı + seed). Ek ortam değişkeni almaz.

## Nasıl çalışır (adım adım)?

```
"Yeter Ekin" kaydolur ─► kod ister ; öğrenci kodsuz ; kisilikler: boş, kişi kodu
müdür: ogretmen-bul (maskeli) ─► ogretmen-ekle ─► kod yenilendi ─► tek portal: doğrudan öğretmen
müdür: ad ✗, şifre ✗, branş ✓
öğretmenken çocuk ekle ─► iki portal: hesabın ana sayfası (kisilikSec)
   gec rol ─► öğretmen (eski anahtar 401) ─► gec veli ─► V
başkasının rolü / bağsız çocuk / bozuk kimlik ─► 404
yönetici: okul-ac(mudurKodu) ─► B okulunun müdürü ─► ayrıl ✗, sil ✗
müdürken: şifre, hesap/bilgi, profile, push ─► hepsi yetişkin hesabına
öğretmenken ayrıl ─► yetişkin hesabı ; müdür öğretmeni çıkarır ─► hesabı durur
hesap/sil: şifre + onay ; öğrenci 403
aynı ad: kayıt ✗ / okul öğrenciye ✓ ; Excel'le öğretmen ✗
```

## Dikkat!

- **Zincir paket.** Bölümler aynı kişinin durumunu adım adım değiştirir: 4. bölümün veli oturumu `V` 5–6. bölümde, 6. bölümün müdür
  oturumu `MB` 7. bölümde kullanılır. Bir adım düşerse sonrakiler yanlış oturumla koşar; `kisilikGec` 200 almazsa paket `TEST HATASI`
  ile durur. Ortadan bir bölümü çıkarırken önce hangi oturumu kullandığına bak.
- **İki adımlı kod günlükten okunur.** `girisYap` kodu `EE_LOG` dosyasındaki sunucu çıktısından alır; sunucu e-posta ayarsız ve çıktısı
  o dosyaya yönlendirilmiş olmalı (test sunucusu öyle açılır). `ilkAdim` yalnız ilk adımı yapar, kod girmez.
- **Kodsuz giriş kuralı "öğrenci dışında herkes" değil, tam olarak: e-postası olan ve öğrenci olmayan hesaba kod gider.** Sunucu
  e-postası olmayan hesapta (ör. okulun e-postasız açtığı öğrenci, servisçi) da kod istemez (`kayit.js`: `!u.email || u.role ===
  'student'`). Bu paket kodsuz girişi yalnız öğrencilerle dener: 1. bölümde e-postalı `ogrenci1`, 10. bölümde e-postasız "Ayni Adli".
  E-postası olmayan öğrenci-dışı hesap (servisçi) burada denenmez.
- **Şifre değiştirme öteki oturumları kapatır.** 7. bölümdeki `POST /api/password` bu oturum dışındaki bütün oturumları (okul rolleri
  dahil) kapatır; paket sonra yalnız `MB` ve ondan türeyen oturumlarla devam ettiği için etkilenmez. Yeni bir adım eklersen eski bir
  anahtarı kullanma.
- **Hız sınırları bellekte.** `hesap/bilgi` yetişkin hesabı başına saatte 10 (bu paket 4 kez çağırır), `hesap/sil` saatte 5, portal
  değiştirme dakikada 60. 3 Ekim'de aynı sunucuda arka arkaya iki koşu sorunsuz geçti (her koşu yeni adlarla yeni kişiler açar);
  çok sayıda koşuda sınırlar dolabilir, sunucuyu yeniden başlatmak sıfırlar.
- **Seed'e bağlı.** Okul adı ve adresi, öğretmen listesi, `ogrenci1`'in veli kodu ve "alınmış kullanıcı adı" denetiminin `mudur` adı
  seed'den gelir.
- **Bildirim denetimleri metin arar** ("öğretmen olarak ekledi", "müdürü olarak eklendin", "ayrıldı"): sunucudaki cümle değişirse bu
  denetimler de güncellenmeli.
- **Varsayılan adres 3000.** `EE_BASE` vermezsen istekler 3000'deki sunucuna gider; her zaman sıfırlanmış test sunucusunu ver.

## Testleri

- Bu dosyanın kendisi testtir; `testler/tumtest.sh` her tam koşuda çalıştırır. Aynı alanda: [test-kisi-kodu.md](test-kisi-kodu.md)
  (kişi kodunun biçimi; tireli, tiresiz, boşluklu yazım; tek kullanımlık olması; yöneticinin kodla kişi bulması ve hız sınırı),
  [test-giris-kayit.md](test-giris-kayit.md) (kayıt formu, e-posta onayı, giriş), [test-veli-coklu.md](test-veli-coklu.md)
  (öğretmen/müdürün aynı zamanda veli olması, okulun veliyi öğrenciye bağlaması), [test-yonetim.md](test-yonetim.md) (okulun açtığı
  hesaplar, yöneticinin okul açması), [test-cakisma.md](test-cakisma.md) (aynı anda gelen kayıt ve eklemeler),
  [yetki-denetimi.md](yetki-denetimi.md).
- Elle (Git Bash, proje kökünde): sunucu 3200'de sıfırlanmış `egitimevi_test` ve [seed.md](seed.md) ile açık olmalı:

  ```
  EE_BASE=http://localhost:3200 EE_LOG=testler/test-sunucu.log node testler/test-yetiskin.js
  ```

  Tarayıcıda: yeni bir yetişkin hesabı aç, "+ Ekle → Öğretmen"deki kodu müdüre ver ("Öğretmenler → Kodla ekle"), yeniden gir:
  doğrudan öğretmen portalına girmelisin; bir çocuk ekleyince girişte yetişkin hesabının ana sayfası ve iki portal görünmeli.
- 3 Ekim 2026'da bu belge için 3200'de (sıfırlanmış `egitimevi_test`, seed) koşuldu: `GECTI: 55   KALDI: 0`, yaklaşık 2 saniye; sunucu
  günlüğünde `API hatası` ya da `Veritabanı hatası` yoktu. Sıfırlayıp arka arkaya iki kez koşulunca ikisi de 55/0. Belge
  denetiminde (aynı gün) yeniden koşuldu: yine 55/0 ve 55/0 (~3 sn), günlükte hata yok.

## Son durum

- `git log`: 5 commit. Son üçü:
  - `153d63d commit 522` (2026-09-27, kişi kodu 16 hane) — kişi kodu denetimi 15 karakterden 16 karaktere (`[A-Za-z0-9!?#*+=]{15}`,
    `-` yerine `=`) geçti.
  - `0acca75 commit 516` (2026-09-27, kayıt/kişi kodu/portallar) — paket yeni modele taşındı: "öğretmen kodu" (`ogretmenKodu`, `GET`
    ile arama) yerine `kisiKodu` ve `POST /api/school/ogretmen-bul|ogretmen-ekle { kod }`; "seçim ekranı" yerine `portallar` /
    `hesapAktif` / `aktif` denetimleri (giriş, geçiş ve `/api/me`); müdür başvurusu (`/api/okul-basvurusu`, onay bekleyen rol,
    `/api/admin/decide`) kaldırıldı, yerine "başvuru ucu yok" (404) ve yöneticinin `okul-ac { mudurKodu }` ile okulu açması geldi.
  - `3b18755 commit 352` (2026-09-26) — paketin asıl gövdesi (207 satır): o günkü modelle (5'erli "öğretmen kodu", "seçim ekranı",
    yöneticinin onayladığı müdür başvurusu) kayıt, kodla öğretmen, veli rolü, başkasının rolü, iki okul, şifre ve kişisel bilgiler,
    ayrılma, hesap silme, aynı ad ve dosyayla öğretmen bölümleri.
- Öncesi (2026-09-26): `c0a5908 commit 343` (`ilkAdim` yardımcısı) ve ilk hâli `db0e307 commit 342` (dosya başı yorumu ve `kontrol`).
- Açık iş yok; kod değiştirilmedi.
- Planlı işlerden bu dosyayı etkileyecekler:
  - **"Çalışan olarak ekleme"** — "+ Ekle → Öğretmen" "Çalışan" olacak, kodla eklenen kişi okula ROLSÜZ çalışan olarak girecek; rolü
    (Öğretmen, özel rol) müdür atayacak. 2. bölümdeki "kodla eklenince doğrudan öğretmen rolü" ve "öğretmen olarak ekledi" bildirimi
    değişir (tanım: "X okuluna çalışan olarak eklendin").
  - **"Tek kişi tek hesap + portallar öğrencide de"** — kullanıcı adı SİTE GENELİNDE tek olacak: 10. bölümdeki "okul aynı adı öğrenciye
    verebilir" ve okul sayfasında aynı adla iki ayrı hesaba giriş kalkar; kullanıcı adının yalnız ana hesapta tutulması (rol
    satırlarının ayrı adı) 3. bölümdeki rol satırı adıyla girişi etkiler.
  - **"T.C. kimlik no bütün hesaplarda zorunlu"** (kod Linux'ta) — `hesapAc` ve 10. bölümdeki doğrudan `POST /api/register` T.C.
    göndermiyor; kural gelince kayıtlar reddedilir, yardımcı ve paket T.C. göndermeli.
  - **"Paneller … birden çok müdür"** — okul ekleme ve müdür atama yönetici/destek için `/duzenle` okul sayfalarına taşınacak (uç
    değişirse 6. bölümdeki `okul-ac` çağrısı da değişir); bir okulda birden çok müdür olabilecek, müdüre giden bildirimler hepsine
    gidecek. Tanımın ilk hâlindeki "müdür kendini müdürlükten çıkaramaz" kuralı kullanıcının 29 Eylül kararlarıyla DEĞİŞTİ: müdür, son
    müdür değilse kendi isteğiyle ayrılabilir (doğrulama koduyla); son müdür hiçbir yolla çıkarılamaz; müdürler birbirini tek başına
    değil "ortak kararla" çıkarır. Bu paketteki "Yetişkin Koleji"nin tek müdürü olduğu için 6. bölümdeki "onaylı müdür rolü
    bırakılamıyor" sonucu sürer (nedeni "son müdür" olur, iletisi değişir); iki müdürlü okulda ayrılma ve ortak karar ayrıca denenmeli.
    Aynı kararlarda (mantık 28) kişi kendi hesabını HER ZAMAN silebilir: `kisilik.js`'teki "müdürken silinemez" engeli kalkacak, son
    müdür silerse okul "Müdürü yok" olur. 6. bölümdeki "müdürken hesap silinemiyor" denetimi o zaman tersine döner.
  - **"Sistem: yöneticiye ZORUNLU TOTP"** — 6. bölümdeki yönetici girişi değişir.
