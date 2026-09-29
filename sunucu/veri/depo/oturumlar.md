# sunucu/veri/depo/oturumlar.js

Oturumlar: anahtarın kendisi değil SHA-256 özeti saklanır; tarayıcıda 7, telefon uygulamasında 30 günlük mutlak süre;
açma, doğrulama, kapatma (tek, kişinin hepsi, yetişkin hesabının bütün rolleri), süresi dolanların temizliği ve gizli
yönetim sayfasının (`/admin`) oturuma bağlı çerezleri.

## Bu dosya ne yapar?

Giriş başarılı olunca sunucu rastgele bir anahtar üretir (`crypto.randomBytes(24)`,
[../../bolumler/kayit.md](../../bolumler/kayit.md)'deki `oturumCevabi`) ve tarayıcıya verir. Veritabanına bu anahtarın
kendisi değil SHA-256 özeti yazılır: veritabanı sızsa bile açık oturumlar kullanılamaz. Her istekte
[../../guvenlik.md](../../guvenlik.md) gelen anahtarı `kullaniciKimligi` ile kişiye çevirir.

Süre kuralları:

- Tarayıcıdaki oturum **7 gün** (`OTURUM_OMRU_GUN`), telefon uygulamasından açılan oturum (girişte `uygulama: true`)
  **30 gün** (`UYGULAMA_OMRU_GUN`). İkisi de MUTLAK süredir: kullandıkça uzamaz.
- Portal değişince (öğretmen → veli gibi) açılan yeni oturum eskisinin türünü ve açılış anını devralır; portal değiştirerek
  süre uzatılamaz ([../../bolumler/kisilik.md](../../bolumler/kisilik.md)).
- Şifre değişince ve çıkışta oturumlar bu dosyanın işlevleriyle kapanır; hesap silinince yabancı anahtar (`ON DELETE
  CASCADE`) siler. Şifre değişince telefonun cihaz anahtarları da silinir.

İkinci bölüm (`030`): yöneticinin gizli `/admin` sayfası, oturum anahtarından AYRI, oturuma bağlı rastgele bir çerezle
açılır ([../../yonetim-cerezi.md](../../yonetim-cerezi.md)). Çerezin de yalnız özeti saklanır; oturum silinince çerez de
silinir (yabancı anahtar `CASCADE`).

## İçinde neler var?

### Sabitler ve özet

- `OTURUM_OMRU_GUN` = 7, `UYGULAMA_OMRU_GUN` = 30 — [../../yonetim-cerezi.md](../../yonetim-cerezi.md) de kullanır.
- `ozet(anahtar)` — `sha256(String(anahtar))` onaltılık. Dışa açık ama dışarıdan çağıran yok.
- `YONETIM_CEREZ_SAKLA` = 3 — bir oturumun en yeni kaç `/admin` çerezi geçerli kalır.

### Oturum

- `ac(anahtar, kullaniciId, uygulama, olusturma)` — `INSERT (anahtar_ozeti, kullanici_id, uygulama, olusturma)`;
  `olusturma` verilmezse `now()` (portal değişiminde eski oturumun anı verilir).
- `kullaniciKimligi(anahtar)` — anahtarın özeti var VE süresi dolmamışsa (`olusturma > now() - 7 ya da 30 gün`, türe göre)
  kullanıcı kimliği; değilse `null`. Boş anahtarda sorgu atmaz.
- `oturumBilgisi(anahtar)` — `{ uygulama, olusturma }` ya da `null`. Süreye bakmaz (çağıran oturumu zaten doğrulamıştır).
- `kapat(anahtar)` — tek oturumu siler (çıkış, portal değişiminde eskisi); dönüş silinen satır sayısı.
- `hepsiniKapat(kullaniciId)` — kişinin bütün oturumları ve telefon cihaz anahtarları (`cihaz_anahtarlari`) silinir; iki
  ayrı `DELETE`, işlemi çağıran açar. Bugün tek çağıranı müdürün/yetkilinin bir hesabın şifresini değiştirmesi
  ([../../bolumler/hesaplar.md](../../bolumler/hesaplar.md), işlem içinde). Hesap silinince bu işlev çağrılmaz: oturumlar ve
  cihaz anahtarları `kullanicilar`'a `ON DELETE CASCADE` bağlı olduğu için satırla birlikte gider.
- `digerleriniKapat(kullaniciId, anahtar)` — bu oturum dışındakiler. Bugün çağıran yok (yerine
  `hesabinOturumlariniKapat` kullanılıyor).
- `hesabinOturumlariniKapat(anaId, haricAnahtar)` — yetişkin hesabının VE okul rolü satırlarının (`id = $1 OR ana_hesap_id
  = $1`) bütün oturumları; `haricAnahtar` verilirse o oturum kalır (şifreyi değiştiren kişi). Cihaz anahtarları HEP
  silinir: şifreyi bilip anahtar almış biri bildirimleri okumaya devam etmesin (uygulama yeniden anahtar alır). Dönüş
  kapanan oturum sayısı.
- `geriTarihle(anahtar, gun)` — açılış anını gün kadar geri çeker (süre dolumunu denemek için; testler).
- `temizle(ustSinir)` — süresi dolanları siler; sonra tablo `ustSinir`'dan büyükse EN ESKİ oturumlardan fazlasını siler
  (beklenmedik birikmeye karşı; [../../guvenlik.md](../../guvenlik.md) `EN_FAZLA_OTURUM` = 20000 ile periyodik çağırır).
  Dönüş toplam silinen.

### `/admin` çerezleri (`yonetim_cerezleri`)

- `yonetimCereziEkle(anahtar, cerez)` — çerezin özetini, oturum HÂLÂ VARSA ona bağlayarak yazar (`INSERT ... SELECT ...
  FROM oturumlar WHERE anahtar_ozeti = $2`); sonra o oturumun en yeni 3 çerezi dışındakileri siler (aynı anda açık iki
  sekmenin yenilemesi birbirini düşürmesin). Oturum az önce kapandıysa hiçbir şey yazılmaz: `false`.
- `yonetimCereziSahibi(cerez)` — çerez geçerli bir yönetici oturumuna mı ait: çerez → oturum (süresi dolmamış) →
  kullanıcı `rol = 'admin'`, `durum = 'approved'` ve `NOT sifre_degismeli` (kendi şifresini koymuş). Kullanıcı kimliği ya
  da `null`.
- `yonetimCerezleriniSil(kullaniciId)` — kişinin bütün oturumlarının `/admin` çerezleri (yönetici şifresini değiştirince;
  bu oturumunki dahil).

### Tablolar ve şema

| Tablo / sütun | Şema dosyası |
|---|---|
| `oturumlar (anahtar_ozeti PK, kullanici_id → kullanicilar CASCADE, olusturma)`; indeksler `oturumlar_kullanici`, `oturumlar_olusturma` | `001-ilk.sql` |
| eski hesaplara `son_giris` = en yeni oturum (oturumdan okur) | `005-son-giris.sql` |
| `oturumlar.uygulama` (30 günlük uygulama oturumu); `cihaz_anahtarlari` | `028-servis-yoklama.sql` |
| `yonetim_cerezleri (ozet PK, 64 onaltılık; oturum_ozeti → oturumlar CASCADE; olusturma clock_timestamp())`; indeks `yonetim_cerezleri_oturum (oturum_ozeti, olusturma DESC)` | `030-yonetim-paneli.sql` |

## Kimle konuşur?

- Çağırdıkları: Node'un `crypto`'su, [../baglanti.md](../baglanti.md) (`sorgu`, `tek`, `calistir`).
- Çağıranlar ([../index.md](../index.md)'deki `depo.oturumlar`):
  - [../../guvenlik.md](../../guvenlik.md) — her istekte `kullaniciKimligi`; periyodik `temizle`.
  - [../../bolumler/kayit.md](../../bolumler/kayit.md) — giriş (`ac`), çıkış (`kapat`), şifremi unuttum ve şifre değiştirme
    (`hesabinOturumlariniKapat`, `yonetimCerezleriniSil`).
  - [../../bolumler/kisilik.md](../../bolumler/kisilik.md) — portal değişimi (`oturumBilgisi`, `kapat`).
  - [../../bolumler/hesaplar.md](../../bolumler/hesaplar.md) — okul yönetimi okulun açtığı bir hesabın (öğrenci, servisçi, yetişkin
    hesabına bağlı olmayan eski usul öğretmen) şifresini değiştirince `hepsiniKapat` (`hesap-sifre`, `student-password`).
  - [../../bolumler/yonetici.md](../../bolumler/yonetici.md) — yedek geri yüklendikten sonra oturum hâlâ var mı
    (`kullaniciKimligi`).
  - [../../yonetim-cerezi.md](../../yonetim-cerezi.md) — `yonetimCereziEkle`, `yonetimCereziSahibi`, `oturumBilgisi`, süre
    sabitleri.
  - Araç: `araclar/yuk-testi.js` (`ac`). Testler doğrudan `require` ile: `testler/test-admin-gizli.js` (`geriTarihle`,
    `yonetimCereziSahibi`), `testler/test-servis-yoklama.js` (`geriTarihle`: 30 günlük uygulama oturumu).

## Nasıl çalışır (adım adım)?

### Bir isteğin kimliği

```
çerez/başlıktaki anahtar → sha256 → oturumlar'da var mı ve
   olusturma > şimdi − (uygulama ? 30 : 7) gün?  → kullanici_id → kullanicilar.bul
```

### Şifre değişince

```
islem {
  kullanicilar.guncelle(pass, sifreDegismeli: false)
  hesabinOturumlariniKapat(anaId, buOturum)   → cihaz anahtarları + öbür oturumlar (rol satırları dahil)
  yönetici ise yonetimCerezleriniSil(id)       → /admin çerezleri (bu oturumunki dahil)
}
```

"Şifremi unuttum"da `haricAnahtar` yoktur: hesabın bütün oturumları kapanır.

## Dikkat!

- **Özet tuzsuzdur, bilerek:** anahtar 24 bayt (çerez 32 bayt) rastgeledir; tahmin edilemez, bu yüzden tuz gerekmez ve
  arama doğrudan birincil anahtarla yapılır.
- **`oturumBilgisi` süreye bakmaz;** yalnız doğrulanmış bir oturum için çağır.
- **`temizle`'nin üst sınırı kişi başına değil, bütün tablo için.** 20000'i aşan birikmede kimin oturumu olduğuna
  bakmadan en eskiler silinir (bir saldırgan çok oturum açarsa başkalarının eski oturumları düşebilir). Giriş hız sınırları
  ([../../guvenlik.md](../../guvenlik.md)) bunu zorlaştırır. Planlı "yeni cihaz uyarısı + açık oturumlar" işi kişi başı
  sınırı da düşünmeli.
- **`hepsiniKapat` yalnız o satırı kapatır;** yetişkin hesabının rol satırlarını da kapatmak için
  `hesabinOturumlariniKapat` kullan.
- **Çerez yenileme sırası:** `yonetimCereziEkle`'deki "en yeni 3" silmesi `olusturma`'ya göre sıralar; sütunun
  varsayılanı `clock_timestamp()`'tir (`now()`'ın aksine işlem içinde bile her satır kendi anını alır). Aynı ana düşen iki
  çerezde hangisinin kalacağı belirsizdir (pratikte önemsiz).
- **Saat:** süreler `now()` ile (UTC, mutlak) hesaplanır; saat dilimi etkisi yok.
- **Kullanılmayan dışa açık işlevler:** `digerleriniKapat`, dışarıdan `ozet`.
- **Test kancası:** `geriTarihle` yalnız testler ve bakım içindir.

## Testleri

- `testler/test-admin-gizli.js` — `/admin` çerezinin oturuma bağlılığı, en yeni 3 çerez, şifre değişince çerezlerin
  düşmesi, süresi dolmuş oturumun çerezi (`geriTarihle`, `yonetimCereziSahibi`).
- `testler/test-servis-yoklama.js` — telefon uygulaması oturumunun 30 gün, tarayıcı oturumunun 7 gün sürmesi ve portal
  değişince sürenin uzamaması (`geriTarihle`).
- `testler/test-sifre.js` (şifremi unuttum: eski oturum kapanır, 401); çıkışı (`POST /api/logout` → `kapat`)
  `testler/test-admin-gizli.js` ve `testler/test-servis-yoklama.js` dener; girişi (`ac`) oturum açan her test paketi.
- Elle: iki tarayıcıda gir, birinde şifreni değiştir → öbür tarayıcı bir sonraki istekte girişe dönmeli; değiştirdiğin
  tarayıcı açık kalmalı.

## Son durum

- Son değişiklik `276c0a0 commit 521` (2026-09-27): `/admin` çerezleri (`YONETIM_CEREZ_SAKLA`, `yonetimCereziEkle`,
  `yonetimCereziSahibi`, `yonetimCerezleriniSil`; 030). Öncesi `24050a2 commit 518`: uygulama oturumu 30 gün, portal
  değişiminde türün ve açılış anının devralınması, `oturumBilgisi`, `geriTarihle`, cihaz anahtarlarının silinmesi. İlk hâli
  `d655dd8 commit 13` (2026-08-28); toplam 3 commit.
- Bilinen açıklar (kod değiştirilmedi): üst sınırın kişi başına olmaması, kullanılmayan `digerleriniKapat`.
- Sıradaki planlı işler (DEVAM.md 4. bölüm): "Sistem" işi — yöneticiye ZORUNLU TOTP, "yeni cihaz uyarısı + açık
  oturumlar" (oturum satırına cihaz/IP/son görülme sütunları ve tek tek kapatma gelir; bu dosya büyür); "Güvenlik
  denetimi" (IPv6 /64 anahtarı) giriş sınırlarını değiştirir.
