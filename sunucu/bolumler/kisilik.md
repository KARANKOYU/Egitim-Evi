# sunucu/bolumler/kisilik.js

Yetişkin hesabının kendi işleri: portallar (okul rolleri ve çocuklar) arasında geçiş, kişi kodu, "+ Ekle" ile
çocuk ekleme, okuldan ayrılma, giriş bilgilerini değiştirme ve hesabı silme (`/api/kisilikler`, `/api/kisilik/...`,
`/api/hesap/...`).

## Bu dosya ne yapar?

Bir yetişkin Eğitim Evi'nde birden çok "şapka" takabilir: A okulunda öğretmen, B okulunda müdür, aynı zamanda iki
çocuğun velisi. Hepsi TEK yetişkin hesabına bağlıdır; okul rolleri bu hesaba bağlı ayrı satırlardır
(`kullanicilar.ana_hesap_id`). Bu dosya o hesabın menüsündeki "Portallarım" listesini verir, bir portala geçişi
yapar, "+ Ekle" penceresindeki kişi kodunu ve çocuk eklemeyi yönetir, Ayarlar'daki hesap bilgilerini ve hesabı
silmeyi (KVKK silme hakkı) karşılar.

Kural: bir oturum her zaman tek bir kişiliğe açılır (öğretmen@A, müdür@B ya da yetişkin hesabının kendisi).
Portal değiştirmek yeni oturum demektir: eski anahtar hemen kapanır, yenisi onun türünü (tarayıcı 7 gün / telefon
uygulaması 30 gün) ve açılış anını devralır — portal değiştirerek oturum uzatılamaz. Kişi yalnız kendi yetişkin
hesabına bağlı rollere geçebilir; her şey sunucuda denetlenir.

Kişi kodu (sütun `eslesme_kodu`, biçimi `ortak.js`'te; 16 hane, ekranda 4'erli tireli): kişi onu okulunun müdürüne
verir (öğretmen olarak eklenir, [hesaplar.md](hesaplar.md)) ya da sistem yöneticisine verir (okulu açılır, müdürü
olur, [yonetici-okul.md](yonetici-okul.md)). Kod tek kullanımlıktır: kullanılınca yenilenir. Hesap açılırken üretilir
([kayit.md](kayit.md) `epostaOnayi`); `GET /api/kisilikler` kod YAZMAZ.

## İçinde neler var?

### Dışa açık

- `uclar(k)` — `p` `kisilikler`, `kisilik` ya da `hesap` değilse `false`.
- `anaHesap(me)` — oturumdaki kişinin yetişkin hesabı: okul rolündeyse bağlı olduğu hesap, kendisiyse kendisi;
  okulun açtığı hesaplarda (öğrenci, servisçi) ve yöneticide `null`. Dışa açık ama bugün başka dosya kullanmıyor.

### İç

- `oturumSecenegi(eski)` → `{ uygulama, olusturma }`: portal değişiminde yeni oturuma eski oturumun türü ve açılış
  anı.
- `hesapGorunumu(h, yetiskin)` → `{ fullName, username, email, phone, address, city, district, tc, dogum,
  yetiskin }`.

### Kapı

Hepsi `need()` ister (giriş + onaylı hesap). `GET /api/hesap` dışındaki her uç yetişkin hesabı ister; yoksa 403:
yöneticiye "Yönetici hesabında portal seçimi yok.", öğrenci/servisçiye "Bu işlem yetişkin hesabıyla yapılır. Hesabını
okul yönetimi düzenler." Bu uçlar [api.md](../api.md)'deki rolsüz kapısından serbesttir (`kisilik`, `kisilikler`,
`hesap` `ROLSUZ_SERBEST`'te): henüz rolü olmayan yetişkin de kullanır.

### Uçlar

| Uç | Ne yapar |
|---|---|
| `GET /api/hesap` | kişisel bilgiler (okul rolündeyken yetişkin hesabınınkiler) → `{ hesap }` |
| `GET /api/kisilikler` | portallar ve kişi kodu (yan etkisiz) |
| `POST /api/kisilik/gec` | seçilen portala geç (yeni oturum) |
| `POST /api/kisilik/kod` | kişi kodunu yenile |
| `POST /api/kisilik/cocuk` | veli koduyla çocuk ekle |
| `POST /api/kisilik/cocuk-kaldir` | çocuğu hesaptan çıkar |
| `POST /api/kisilik/ayril` | okuldaki öğretmen rolünü bırak |
| `POST /api/hesap/bilgi` | kullanıcı adı, e-posta, telefon (mevcut şifreyle) |
| `POST /api/hesap/sil` | hesabı sil (mevcut şifreyle) |

Ayrıntılar:

- **`GET /api/hesap`** — yetişkin hesabı yoksa (öğrenci, servisçi, yönetici) kişinin kendi bilgileri,
  `yetiskin: false`. T.C. no da gider (yalnız kişinin kendisine).
- **`GET /api/kisilikler`** — `kisilikListesi(ana)` ([kayit.md](kayit.md)) + `{ hesap: { fullName, username },
  aktif: <bulunulan rol satırının kimliği> ya da 'hesap', kisiKodu: <ham kod, tiresiz> }`. Ekran ve "Kopyala"
  4'erli tireli biçimi kullanır.
- **`POST /api/kisilik/gec`** — gövde `{ tur: 'rol'|'veli'|'hesap', id }`. Hesap başına dakikada 60 (429 "Çok
  hızlı."). `tur: 'rol'` ve `id` yetişkin hesabının kendisiyse `hesap` sayılır (telefon bildirimindeki `?k=` böyle
  gelir). `rol`: satır bu hesaba bağlı değilse 404; okul kapalıysa (müdürü kaldırılmış) 403 "Bu okul şu an kapalı;
  sistem yöneticisi yeni müdürünü atayınca açılır."; satır onaylı değilse 403. `veli`: çocuk bu hesaba bağlı değilse
  404; oturum yetişkin hesabında, `cocuk` o çocuk olarak açılır. Başka `tur` 400. Eski oturum kapanır, cevap
  `oturumCevabi`'nın giriş cevabıdır (yeni `token` dahil).
- **`POST /api/kisilik/kod`** — hesap başına saatte 10 (429). Yeni kod üretilip yazılır → `{ kisiKodu, message:
  'Yeni kod üretildi; eskisi artık çalışmaz.' }`.
- **`POST /api/kisilik/cocuk`** — gövde `{ code }` (öğrencinin veli kodu). İş `bolumler/veli.js`'teki
  `cocukBagla`'da: hesap başına dakikada 5 deneme, IP başına saatte 30 YANLIŞ kod (429); kod büyük/küçük harf
  duyarlı, boşluk ve tireler silinir; kod bulunamazsa 400; kendini ya da zaten ekli çocuğu ekleyemezsin (400).
  Rolsüz hesap burada veli olur, bağ yazılır, velinin okulu yoksa çocuğun okulu olur (tek işlemde); öğrenciye
  bildirim. Öğrencinin veli kodu kullanılınca YENİLENMEZ (anne ve baba aynı kodla ekleyebilir). Cevap: güncel
  `kisilikListesi` + `message`.
- **`POST /api/kisilik/cocuk-kaldir`** — gövde `{ id }`; bağlı değilse 404. `bagiCoz`: bağ silinir, velinin okulu
  kalan çocuklardan yeniden hesaplanır, son çocuk da gidince hesap rolsüz olur. Cevap: güncel `kisilikListesi`.
- **`POST /api/kisilik/ayril`** — gövde `{ id, onay: true }`. Satır bu hesaba bağlı değilse 404. Müdür rolü
  BIRAKILAMAZ (400: "… sistem yöneticisiyle iletişime geç: okul yeni müdürü atanmadan sahipsiz kalmasın."). Onay
  yoksa 400. İşlem kaydı `ogretmen.ayrildi` (rol satırı adına, silmeden önce), rol satırı silinir, okulun müdürüne
  bildirim (`#/ogretmenler`). Kişi o anda bıraktığı roldeyse oturumu satırla birlikte kapandığı için yetişkin
  hesabında YENİ oturum açılır (`oturumCevabi`); değilse güncel liste + ileti.
- **`POST /api/hesap/bilgi`** — gövde `{ sifre, kullaniciAdi?, eposta?, telefon? }`. Hesap başına saatte 10 (429).
  Mevcut şifre yanlışsa `400 { alan: 'sifre' }`. Kullanıcı adı: kurala uymalı, başka hesapta olmamalı (`alan:
  'kullaniciAdi'`). E-posta: zorunlu (giriş kodu ve sıfırlama oraya gider), biçim, başka hesapta olmamalı, alan adı
  posta almalı (`alan: 'eposta'`); HEMEN DEĞİŞMEZ: hesap başına saatte 3 deneme, hesabın bekleyen eski onayları
  silinir, yeni adrese onay bağlantısı gider (24 saat), bağlantı tıklanınca [kayit.md](kayit.md)'deki
  `POST /api/eposta-onay` (`tur: 'eposta'`) değiştirir. Telefon: `telefonSorunu`. Değişen yoksa `{ hesap, message,
  onayBekliyor }`. Varsa tek işlemde yazılır; telefon okul rolü satırlarına da geçer; kullanıcı adı değişince her
  okuldaki rol satırı da yeni adı alır (okulda alınmışsa `okuldaBosAd` sonuna sayı ekler). İşlem kaydı `hesap.bilgi`
  (değişen alan adları) → `{ hesap, onayBekliyor, message }`.
- **`POST /api/hesap/sil`** — gövde `{ sifre, onay: true }`. Hesap başına saatte 5 (429). Şifre yanlışsa `400 {
  alan: 'sifre' }`; onay yoksa 400. Kişi bir okulun müdürüyse silinemez (400 "… müdürlüğü devretmek için sistem
  yöneticisiyle iletişime geç."). Tek işlemde bütün okul rolü satırları ve hesap silinir; çocuk bağları, bildirimler,
  oturumlar şema kurallarıyla gider. Sunucu konsoluna yalnız hesap kimliği yazılır → `{ message: 'Hesabın ve bütün
  bilgilerin silindi.' }`.

## Kimle konuşur?

- Çağırdıkları:
  - [kayit.md](kayit.md) — `kisilikListesi`, `oturumCevabi`;
  - [veli.md](veli.md) — `cocukBagla`;
  - `./islem-kaydi` — `islemYaz`;
  - `../guvenlik` ([guvenlik.md](../guvenlik.md)) — `hizSinir`, `istekAnahtari`, `onayBaglantisiGonder`, `kodOzeti`,
    `ONAY_OMRU_MS`, `epostaAlaniVarMi`, `epostaMaskele`;
  - `../http` ([http.md](../http.md)), `../ortak` ([ortak.md](../ortak.md)), `../sifre` ([sifre.md](../sifre.md):
    `verifyPw`), `../veri` (`depo`, `bildir`, `islem`).
- Veri tabloları:
  - `depo.kullanicilar` → `kullanicilar`: `bul`, `yetiskinMi`, `rolleri`, `guncelle`, `sil`, `yeniKisiKodu`,
    `eslesmeKoduYaz`, `kullaniciAdiBaskasinda`, `epostaVarMi`, `okuldaBosAd`, `rolSatirlariniGuncelle`,
    `rolSatiriniSil`, `okulunMuduru`; veli bağları → `veli_baglari`: `bagliMi`, `bagiCoz` (ve `cocukBagla`'da
    `bagla`, `kodlaOgrenci`, `rolsuzuVeliYap`);
  - `depo.oturumlar` → `oturumlar`: `oturumBilgisi`, `kapat` (+ `oturumCevabi`'nda `ac`);
  - `depo.onaylar` → `eposta_onaylari`: `hesabinkileriSil`, `ekle`;
  - `bildir` → `bildirimler`; `islemYaz` → `islem_kaydi`.
- Onu çağıran: `sunucu/api.js` (`'kisilik'`, `'kisilikler'`, `'hesap'` → bu dosya).
- Ön yüz (`public/js/parcalar/`): `08c-kisilikler.js` (kisilikler, kisilik/gec, kod, cocuk, cocuk-kaldir, ayril),
  `26-baslat.js` (kisilik/gec: telefon bildiriminden gelen portal geçişi), `23-veli-ayarlar.js` (hesap, hesap/bilgi,
  hesap/sil).
- Android uygulaması: `PortalSecici` (kisilikler, kisilik/gec), `EkleSayfasi` (kisilikler, kisilik/kod,
  kisilik/cocuk).

## Nasıl çalışır (adım adım)?

Portal geçişi:

```
menü "Portallarım" → POST /api/kisilik/gec { tur, id }
  ana = anaHesap(me)                      (yoksa 403)
  tur rol   → satır ana'ya bağlı mı, okul açık mı, satır onaylı mı → hedef = rol satırı
  tur veli  → çocuk ana'ya bağlı mı → hedef = ana, cocuk = id
  tur hesap → hedef = ana
  eski = oturumBilgisi(eski anahtar) ; kapat(eski anahtar)
  oturumCevabi(hedef, ek, { uygulama: eski.uygulama, olusturma: eski.olusturma })
    → yeni token (ömrü eskisininkiyle aynı yerde biter)
```

E-posta değişikliği: `hesap/bilgi { sifre, eposta }` → bağlantı yeni adrese → kişi tıklar →
`POST /api/eposta-onay` → adres değişir.

## Dikkat!

- **Yetki yalnız bağdan gelir:** bir rol satırına geçmek için satırın `anaHesapId`'si oturumdaki kişinin yetişkin
  hesabı olmalı; bir çocuğa veli olarak geçmek için `veli_baglari`'nda bağ olmalı. İstemcinin gönderdiği kimliğe
  güvenilmez.
- **Oturum uzatılamaz:** portal değişimi yeni anahtar verir ama açılış anını eskisinden alır (commit 518).
- **Kapalı okul:** müdürü kaldırılmış okulun rolleri listede görünür (`girilebilir: false`) ama girilemez.
- **Müdür bırakamaz, silinemez:** okul sahipsiz kalmasın; müdürlüğü yalnız sistem yöneticisi değiştirir.
- **E-posta hemen değişmez:** yeni adresin sahibi olduğunu bağlantıyla kanıtlamadan giriş kodları eski adrese gider.
  Kullanıcı adı, e-posta ve telefon değişikliği mevcut şifre ister; oturumu açık bırakılmış bir cihazdan hesap ele
  geçirilemesin.
- **Yarış:** aynı anda iki kişi aynı kullanıcı adını alırsa tekil indeks (`kullanicilar_kadi_genel`) ikincisini
  durdurur; işlem geri alınır, `sunucu/index.js` cevabı alanıyla (`alan`) verir.
- **Kullanıcı adı değişince** rol satırlarının adları da değişir; bir okulda o ad alınmışsa satır sonuna sayı
  eklenmiş bir ad alır (okulda giriş adı yetişkin hesabınınkinden farklı görünebilir).
- **`cocuk-kaldir` ve `hesap/sil` işlem kaydı yazmaz**; `ayril` ve `hesap/bilgi` yazar.
- **Hesap silme geri alınamaz** ve bağlı veriler şema kurallarıyla gider; bu dosya önce rol satırlarını tek tek siler
  (`rolSatiriniSil`), sonra hesabı.

## Testleri

- `testler/test-yetiskin.js` — bu dosyanın en geniş testi (`kisilikler`, `kisilik/gec`, `kisilik/cocuk`,
  `kisilik/ayril`, `hesap`, `hesap/bilgi`, `hesap/sil`): tek portalda doğrudan giriş, birden çok portalda ana sayfa;
  başkasının rolüne geçilememesi; `portallar`; iki okulda rol + velilik; öğretmenin okuldan ayrılması, müdür rolünün bırakılamaması;
  şifre ve kişisel bilgilerin yetişkin hesabınınki olması (`hesap`, `hesap/bilgi`); hesabı silme şifreyle, müdürken
  silinemez.
- `testler/test-kisi-kodu.js` — kodun biçimi, büyük/küçük harf duyarlılığı, tireli/boşluklu yapıştırma, eski
  uzunlukların geçmemesi; yetişkinin kişi kodunun tek kullanımlık ve yenilenebilir olması (`kisilik/kod`),
  öğrencinin veli kodunun kullanınca yenilenmemesi; `GET /api/kisilikler`'in yan etkisiz olması; portalların yalnız
  yetişkin hesabında ve rol satırında olması.
- `testler/test-veli-coklu.js` — bu dosyadan yalnız `GET /api/kisilikler`'i çağırır (öğretmenin çocuğu eklenince
  portallarında görünmesi). Çocuk ekleme ve bağ kaldırma orada `/api/parent/link` ve `/api/parent/unlink` ile, yani
  `sunucu/bolumler/veli.js` üzerinden yapılır; `kisilik/cocuk-kaldir`'ı deneyen tek test `test-etut.js`'tir.
- `testler/test-giris-kayit.js` — e-posta değişikliğinin onaylanana kadar değişmemesi, bağlantıyla değişmesi.
- `testler/test-cakisma.js` — `hesap/bilgi`'de aynı kullanıcı adı/e-posta yarışı.
- `testler/test-etut.js` — `kisilik/cocuk` ve `cocuk-kaldir` ile veli kurulumu.
- Elle: kayıt olup giriş yap, üstteki "+ Ekle"de kişi kodunu gör, yenile; bir öğrencinin veli koduyla çocuk ekle;
  Ayarlar'da hesap bilgilerini değiştir.

## Son durum

- Son commit `153d63d commit 522` (2026-09-27): yalnız yorum — ham kod tiresiz gider, ekran ve Kopyala 4'erli tireli
  biçimi kullanır (kod 16 haneye geçti).
- `276c0a0 commit 521`: e-posta denetimi `epostaSorunu`'na geçti; kullanıcı adı yarışının tekil indeksle durduğu
  yoruma yazıldı.
- `24050a2 commit 518`: portal değişiminde yeni oturum eski oturumun türünü (telefon uygulaması 30 gün) ve açılış
  anını devralır (`oturumSecenegi`); `ayril`'da da aynısı.
- Açık iş yok. Sıradaki "Çalışan olarak ekleme" (+ Ekle'de "Çalışan") ve "Paneller" (birden çok müdür) işleri bu
  dosyanın portal ve müdürlük kurallarına dokunacak; "Kullanıcı arama, destek talepleri" işindeki "Verilerimi
  indir" hesap sayfasıyla ilgilidir.
