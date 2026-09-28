# sunucu/bolumler/yonetici.js

Sistem yöneticisinin uçları (`/api/admin/...`): okul açma ve kişi bulma, müdürler, okullar ve disk sınırları,
yedek alma ve geri yükleme, site ayarları ve okul adresleri, yönetici dosyası.

## Bu dosya ne yapar?

Sistem yöneticisi bütün sitenin sahibidir: okulları açar, müdürleri atar, yedekleri yönetir, site ayarlarını
değiştirir. Onun ekranları gizli yönetim paketindedir (`public/js/yonetim/`, yalnız yönetici çereziyle inen
`/admin` sayfası) ve bütün sunucu uçları `/api/admin/...` altındadır. Bu dosya o uçların yönlendiricisidir; işin
bir kısmını kendisi yapar (yedekler, müdür listesi, okullar ekranı), bir kısmını başka dosyalara devreder:

- okul açma ve kişi koduyla kişi bulma → [yonetici-okul.md](yonetici-okul.md);
- site ayarları ve okul adresleri → [site-ayarlari.md](site-ayarlari.md);
- okulun disk sınırı → `sunucu/bolumler/okul-disk.js`;
- `data/admins.json` yönetici dosyası → [yonetici-dosyasi.md](../yonetici-dosyasi.md).

Müdür başvurusu yoktur: okulu yönetici açar. Yönetici olmayan kişi bu uçları HİÇ göremez: [api.md](../api.md)
ona bilinmeyen adresle aynı 404'ü verir (401/403 bile dönmez).

## İçinde neler var?

- `uclar(k)` — tek dışa açık ad. `p !== 'admin'` ise `false`. Sonra `need(['admin'])`: giriş, onaylı hesap ve
  `admin` rolü. (Pratikte yönetici olmayan buraya hiç gelmez; api.js onu önce 404'e çevirir.)

### Uçlar (`/api/admin/<alt>`)

| Alt yol | Yöntem | Kimde | Gövde / sorgu → cevap |
|---|---|---|---|
| `okul-ac` | POST | [yonetici-okul.md](yonetici-okul.md) `okulAc` | okul + müdürün kişi kodu → okul açılır |
| `kisi-bul` | POST | [yonetici-okul.md](yonetici-okul.md) `kisiBul` | `{ kod }` → kodun sahibi |
| `okul-disk-siniri` | POST | `okul-disk.js` `siniriDegistir` | okulun disk sınırı (MB ya da `null` = varsayılan) |
| `site-ayarlari` | GET | [site-ayarlari.md](site-ayarlari.md) `gorunum` | ayarlar ve bilgiler |
| `site-ayarlari` | POST | [site-ayarlari.md](site-ayarlari.md) `ayarKaydet` | tek ayar kaydet / varsayılana dön |
| `okul-adresleri` | GET | [site-ayarlari.md](site-ayarlari.md) `okulAdresleri` | okulların adresleri |
| `okul-adres` | POST | [site-ayarlari.md](site-ayarlari.md) `okulAdresiDegistir` | bir okulun adresini değiştir |
| `yonetici-dosyasi` | GET | bu dosya | son okumanın özeti + `aralikDk` |
| `yonetici-dosyasi/oku` | POST | bu dosya | dosyayı şimdi oku |
| `backups` | GET | bu dosya | `{ yedekler, saklanan, klasor }` |
| `backup-now` | POST | bu dosya | `{ yedek, yedekler }` |
| `backup-download` | GET | bu dosya | `?ad=` → yedek dosyası (indirme) |
| `backup-restore` | POST | bu dosya | `{ ad }` → geri yükle |
| `backup-delete` | POST | bu dosya | `{ ad }` → sil |
| `principals` | GET | bu dosya | `{ principals: [...] }` |
| `principal-delete` | POST | bu dosya | `{ userId }` → `{ silinen, okul }` |
| `overview` | GET | bu dosya | `{ stats, schools, disk }` |

Bu dosyanın kendi yaptıkları:

- **`yonetici-dosyasi`** — `GET`: `yoneticiDosyasi.gorunum()` (son okumanın sonucu; şifre ASLA yok) +
  `aralikDk` (dosyanın kaç dakikada bir okunduğu, site ayarı `adminsAralikDk`). `POST .../oku`: dosyayı hemen okur
  (`yoneticiDosyasi.oku(depo, { sifreUret: ilkSifreUret })`); işlem kaydı `yonetici.dosya-okundu` ("dosya yok",
  "dosya atlandı: …" ya da "N hesap açıldı, M satır atlandı" — "zaten yönetici" satırları atlanan sayılmaz). Cevap:
  aynı görünüm + `message`.
- **`backups`** — `yedekListesi()` (`data/yedek` klasöründeki `yedek-*.json` dosyaları), `saklanan: 14` (kaç kopya
  tutulduğu, `YEDEK_SAKLA`), `klasor` (yedek klasörünün yolu).
- **`backup-now`** — elle yedek (`yedekAl(true)`; adı `yedek-elle-…`); hata varsa 500.
- **`backup-download`** — `ad` yalnız harf, rakam, `._-` bırakılarak temizlenir, `yedek-*.json` biçiminde olmalı
  (değilse 400), yoksa 404. Dosya `Content-Disposition: attachment` ve `Cache-Control: no-store` ile gider.
- **`backup-restore`** — `yedekGeriYukle(ad)` (`sunucu/veri/yedek.js`): önce şimdiki verinin bir `yedek-geri-alma-…`
  kopyası alınır, sonra yedek içe aktarılır; yedekte kurala aykırı çift kayıt varsa işlem geri alınır, veri
  değişmez (400). Başarıda konsola "! Yedekten geri yüklendi", işlem kaydı `yedek.geri-yuklendi` — yöneticinin
  kimliği yedekte değişmiş olabileceği için kayıt yüklenen verideki aynı kişiye yazılır. `oturumKaldi`: yöneticinin
  oturumu (ve `/admin` çerezi) yedekte de varsa `true`, yoksa ön yüz girişe döner ("… yeniden giriş yapman
  gerekecek.").
- **`backup-delete`** — aynı ad denetimi; dosyayı siler, güncel listeyi döner.
- **`principals`** — `depo.kullanicilar.mudurlerSayimli()` tek sorguda: `{ id, fullName, username, email, status,
  city, district, schoolName ('(okul yok)'), schoolStatus, teachers, students, createdAt }`.
- **`principal-delete`** — müdür satırı yoksa 400. Okul SİLİNMEZ: öğretmen ve öğrenciler durur, okul `pending`'e
  çekilir (kimse giremesin) ve müdür satırı silinir — ikisi tek işlemde. Bugünkü düzende müdür, yetişkin hesabına
  bağlı bir rol satırıdır: kişinin kendi hesabı durur, yalnız müdürlüğü kalkar (rol satırının oturumları ve
  bildirimleri yabancı anahtarla gider). Kod satırın türüne bakmaz, `depo.kullanicilar.sil(u.id)` ile verilen
  satırı siler: eski düzenden kalmış, yetişkin hesabına bağlı OLMAYAN bir müdür hesabıysa hesabın kendisi silinir. Yönetici "Okul aç" ile bu sahipsiz okula yeni müdür atayabilir
  ([yonetici-okul.md](yonetici-okul.md) müdürsüz okulu tanır).
- **`overview`** — yönetim panelinin Okullar ekranı: `stats` (`okul`, `mudur`, `ogretmen`, `ogrenci`, `veli`
  sayıları), her okul için `{ id, name, city, district, status, principal, students, teachers, disk }` (`disk`:
  `okulDisk.gorunum` + `oneriMb` — öğrenci sayısına göre önerilen sınır), ve sistem geneli `disk`
  (`okulDisk.sistem`: okullara ayrılan, diskteki boş yer, veritabanı, mutabakat).

## Kimle konuşur?

- Çağırdıkları:
  - [yonetici-okul.md](yonetici-okul.md) — `okulAc`, `kisiBul`;
  - [site-ayarlari.md](site-ayarlari.md) — `gorunum`, `ayarKaydet`, `okulAdresleri`, `okulAdresiDegistir`;
  - [okul-disk.md](okul-disk.md) — `siniriDegistir`, `gorunum`, `oneriMb`, `sistem`;
  - `./islem-kaydi` — `islemYaz`;
  - `../yonetici-dosyasi` ([yonetici-dosyasi.md](../yonetici-dosyasi.md)) — `gorunum`, `oku`;
  - `../site` ([site.md](../site.md)) — `ayar('adminsAralikDk')`;
  - `../veri` — `depo`, `islem`, `yedekAl`, `yedekGeriYukle`, `yedekListesi`, `YEDEK_KLASOR`, `YEDEK_SAKLA`,
    `ilkSifreUret` (yedek işleri `sunucu/veri/yedek.js`'te);
  - `../http` ([http.md](../http.md)) — `bad`, `ok`, `baslikEkle`; `../ortak` — `clean`; `../guvenlik` —
    `istekAnahtari`; `fs`, `path`.
- Veri tabloları:
  - `depo.kullanicilar` → `kullanicilar` (+ `okullar`): `mudurlerSayimli`, `sayimlar`, `bul`, `sil`;
  - `depo.okullar` → `okullar`: `genelBakis` (+ `kullanicilar`), `durumYaz`;
  - `depo.okulDisk.hepsi` → `okullar`, `odev_dosyalari`, `odevler`, `ekler`, `okul_fotolari`;
  - `depo.oturumlar.kullaniciKimligi` → `oturumlar`;
  - geri yükleme bütün tabloları yeniden yazar (`sunucu/veri/json-aktarim.js`);
  - `islemYaz` → `islem_kaydi`.
- Onu çağıran: yalnız `sunucu/api.js` (`'admin': yonetici`; önce `yoneticiUcuMu` ile gizlilik kapısı).
- Ön yüz (`public/js/yonetim/`): `09-yonetici.js` (okul-ac, kisi-bul, backups, backup-now, backup-download,
  backup-restore, backup-delete, principals, principal-delete, overview), `09a-yonetim-paneli.js` (overview),
  `09b-site-ayarlari.js` (site-ayarlari, okul-adresleri, okul-adres), `09c-yonetici-dosyasi.js` (yonetici-dosyasi,
  yonetici-dosyasi/oku), `09d-okul-disk.js` (okul-disk-siniri).
- Android uygulaması yönetici uçlarını çağırmıyor.

## Nasıl çalışır (adım adım)?

```
/api/admin/<alt>
  api.js: yönetici değilse → bölüm yok → 404 (bilinmeyen adresle aynı)
  yonetici.uclar:
    need(['admin'])
    okul-ac / kisi-bul         → yonetici-okul.js
    okul-disk-siniri           → okul-disk.js
    site-ayarlari / okul-*     → site-ayarlari.js
    yonetici-dosyasi[/oku]     → yonetici-dosyasi.js (+ işlem kaydı)
    backup-*                   → veri/yedek.js (dosyalar data/yedek)
    principals / principal-delete / overview → depo
  tanınmayan alt → false → 404
```

Geri yükleme:

```
backup-restore { ad } → ad temizlenir, yedek-*.json mı, dosya var mı
  → şimdiki veri "yedek-geri-alma-…" olarak yedeklenir
  → yedek içe aktarılır (tek işlem; çift kayıt → geri al, 400)
  → işlem kaydı (yüklenen verideki aynı yönetici)
  → oturumKaldi? (oturum yedekte yoksa yeniden giriş)
```

## Dikkat!

- **Gizlilik bu dosyada değil, api.js'te:** yeni bir yönetici ucu `/api/admin/` altında olmalı; başka bir yola
  koyarsan `yoneticiUcuMu`'ya eklemelisin, yoksa yönetici olmayana 401/403 dönüp ucun varlığını ele verir.
- **Yedek adı yol dışına çıkamaz:** `ad` yalnız `[a-zA-Z0-9._-]` bırakılarak temizlenir ve `yedek-…json` olmalı;
  `../` ile başka dosya indirilemez ya da silinemez.
- **Geri yükleme her şeyi değiştirir:** bütün veri yedektekiyle değişir; yöneticinin oturumu yedekte yoksa kapanır.
  Öncesinde otomatik "geri alma" yedeği alınır — yanlış yedek yüklenirse o dosya geri yüklenerek dönülür.
- **Müdür silmek okulu silmez**, okulu kapatır (`pending`): öğretmen ve öğrenciler giremez ama verileri durur.
  Bu uç işlem kaydı yazmaz ve kişiye bildirim göndermez.
- **İşlem kaydı yazmayanlar:** `backup-now`, `backup-delete`, `principal-delete`. Yazanlar: `yonetici-dosyasi/oku`,
  `backup-restore` (ve devredilen okul açma, disk sınırı, site ayarı, okul adresi uçları kendi kayıtlarını yazar).
- `yonetici-dosyasi` cevabında şifre hiçbir zaman yoktur; dosyadan açılan yöneticinin ilk şifresi sunucu penceresine
  yazılır ([yonetici-dosyasi.md](../yonetici-dosyasi.md)).
- `ilkSifreUret` her `oku` isteğinde `require('../veri')` ile içeride alınır (dosyanın başında değil).

## Testleri

- `testler/test-admin-gizli.js` — yönetici uçlarının (backup-restore, okul-adresleri, okul-disk-siniri, olmayan alt
  uç…) yönetici olmayana bilinmeyen adresle aynı 404'ü vermesi; `app.js`'te yönetim uçlarının geçmemesi.
- `testler/test-yedek.js` — yedek listesi, elle yedek, indirme, geri yükleme, silme; geri yüklemeden sonra aynı
  çerezle `/admin`'in açılması (`oturumKaldi: true`) ve oturum yedekte yoksa `oturumKaldi: false` + "yeniden giriş".
- `testler/test-yonetim.js` — müdür listesi (okul adı ve sayılar dolu), okul açma, kişi bulma.
- `testler/test-etut.js` — `principal-delete` ile müdürü kaldırılan okulun yeni müdürle, eski adresiyle yeniden
  açılması.
- `testler/test-okul-disk.js` — `overview`'daki disk alanları, `okul-disk-siniri`.
- `testler/test-yonetici-dosyasi.js`, `testler/test-site-ayarlari.js` — yönetici dosyası ve site ayarı uçları.
- `testler/yetki-denetimi.js`, `testler/girdi-denetimi.js`, `testler/guvenlik-test.js` — rol × uç, bozuk girdi,
  öğrencinin `overview`'da 404 alması.
- Elle: `testler/seed.js`'teki yönetici hesabıyla gir; giriş cevabındaki `yonetimAdresi`'ne gidilir, panelde
  Okullar, Yedekler ve Site Ayarları bu uçları kullanır.

## Son durum

- Son commit `40fc7e7 commit 525` (2026-09-27, okul disk sınırı): `okul-disk-siniri` ucu eklendi; `overview` her
  okula `disk` (doluluk, sınır, dağılım, öneri) ve sistem geneli `disk` alanını ekler.
- `276c0a0 commit 521` (gizli yönetim paneli): `site-ayarlari`, `okul-adresleri`, `okul-adres`, `yonetici-dosyasi`
  ve `yonetici-dosyasi/oku` eklendi; `backup-restore` cevabına `oturumKaldi` geldi.
- `0acca75 commit 516`: müdür başvurusu kalktı (`pending`/`decide` uçları yok), okul açma `yonetici-okul.js`'e
  taşındı.
- Açık iş yok. Sıradaki işler: "Sistem" (yöneticiye zorunlu TOTP, bakım modu, site duyurusu, sistem durumu) ve
  "Paneller" (`/panel/admin`, `/panel/destek`, okul gezgini, birden çok müdür) bu dosyaya yeni uçlar ekleyecek;
  "Yıl geçişi" işindeki okul yedeği (.7z + AES) yedek uçlarını değiştirecek.
