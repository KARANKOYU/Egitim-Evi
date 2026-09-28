# sunucu/bolumler/cihaz.js

Telefon uygulamasının cihaz anahtarı (`/api/cihaz`): oturumla anahtar alma, listeleme ve kaldırma; anahtarla bildirim
yoklama, servisçinin sefer konumunu gönderme ve uygulamanın ayarlarını okuma.

## Bu dosya ne yapar?

Eğitim Evi'nin yerel Android uygulaması (ayrı depo `Egitim-Evi-App`) Firebase kullanmaz: bildirimleri telefon KENDİSİ
sunucuya sorarak alır ("yoklama"). Bunun için uygulama, kişi giriş yaptıktan sonra oturumla bir kez **cihaz anahtarı**
alır ve saklar. Bu anahtar yalnız iki işe yarar (dosya başı yorumu): bildirim yoklamak ve servisçinin sefer konumunu arka
planda göndermek. Hesaba giriş VERMEZ (`Authorization: Bearer` yerine kullanılamaz); sunucuda anahtarın kendisi değil
SHA-256 özeti durur.

Anahtarın sahibi yetişkinin ANA hesabıdır (okul rolleri onun altında; bir veli-öğretmenin iki rolüne gelen bildirimler
aynı telefona düşer) ya da öğrenci / servisçi hesabıdır. Hesap başına en çok 5 anahtar tutulur, fazlası en eskisini
siler. Eski "Eğitim Evi Aile" uçları (`/api/aile/cihaz/*`, `X-Aile-Cihaz`) ayrıdır: [aile.md](aile.md).

## İçinde neler var?

### Sabitler ve iç işlevler

- `ANAHTAR` — `/^[a-f0-9]{64}$/`. `EN_FAZLA_BILDIRIM` — 20 (bir yoklamada gelen en çok bildirim).
- `IMLEC` — imleç biçimi: bildirimin zamanı (UTC, mikrosaniye) ve kimliği, `"2026-09-27T05:12:33.123456Z|n_ab12…"`.
- `ozet(anahtar)` — SHA-256. `imlecYazisi(r)` — `zaman|id`.
- `imlecCoz(metin)` — biçime uyan ve takvimde var olan (30 Şubat, 24:00 değil) imleci `{ zaman, id }`'ye çevirir, yoksa
  `null` (kod yorumu: takvimde olmayan an veritabanına gitmesin).
- `servisSaatleri(u)` — telefonun yoklama sıklığını ayarlaması için okulun servis saatleri; yalnız hesabın servisle
  ilgisi varsa: servisçinin okulu, öğrencinin ya da velinin çocuklarının servisli olduğu okullar; okulda "Servis"
  kapalıysa ya da okul onaylı değilse o okul atlanır. Birden çok okulda `pencere.saatZarfi` en geniş aralıkları verir.
  İlgisi yoksa `null`.

### Dışa açılan işlevler

- `anahtarUclari(k)` — `X-Cihaz` başlıklı uçlar. `api.js` bunları gövdeyi okuduktan sonra, OTURUM KAPILARINDAN ÖNCE
  çağırır: `p === 'cihaz' && segs[2]` ve (`segs[2] !== 'sil'` ya da `X-Cihaz` başlığı var). Yani `/api/cihaz/sil` başlıksız
  gelirse oturumlu `uclar`'a düşer.
- `uclar(k)` — oturumlu uçlar.

### Anahtarlı uçlar (`X-Cihaz: <64 onaltılık>`)

Ortak kapı: biçimsiz ya da tanınmayan anahtar 401 "Uygulama anahtarı tanınmadı. Yeniden giriş yap.". Hız: `servis-konum`
için anahtar başına dakikada 60, ötekiler için saatte 240 (429 "Çok sık istek geldi. Biraz sonra dene."). Hesap
silinmiş ya da onaylı değilse, ya da aydınlatma metni onayı güncel değilse (`kayit.kvkkGuncelMi`) anahtar SİLİNİR ve 403
`{ error, anahtarGecersiz: true }` döner — metin "Aydınlatma metni güncellendi. Uygulamada onayladıktan sonra
bildirimler yeniden gelir." ya da "Hesap artık kullanılamıyor."; uygulama anahtarı unutur. Her istekte "son görülme"
yazılır.

- **`GET /api/cihaz/bildirimler?son=<imleç>`** → `{ bildirimler: [{ id, metin, baglanti, zaman }], imlec,
  servisSaatleri }`. Alıcılar: anahtarın sahibi ve (yetişkinse) okul rolü satırları, yalnız onaylılar. İlk çağrıda (ya da
  imleç bozuksa) ESKİ bildirim gelmez, yalnız güncel imleç döner (kod yorumu: telefon kurulunca geçmiş bildirimler
  yağmasın). İmleç varsa `(son, en yeni]` aralığındaki OKUNMAMIŞ bildirimlerin en yeni 20'si, eskiden yeniye gelir; imleç
  en yeni bildirime ilerler (arada 20'den fazlası birikmişse eskileri telefona hiç gelmez). `baglanti` `push.bildirimAdresi`
  ile okulun adresine ve rol satırına göre kurulur: `/school/<kısa-ad>/?k=<rol satırı>#/…`. İmleç değiştiyse cihaz
  kaydına yazılır.
- **`GET /api/cihaz/ayar`** → `{ rol, servisci, acikSefer: { id, servisId, yon } | null, servisSaatleri }`. Servisçide
  şoförü olduğu servislerden hâlâ süren ve kendisinin açtığı sefer (`okulHayati.surenSefer`).
- **`POST /api/cihaz/servis-konum`** — gövde `{ seferId, enlem, boylam, dogruluk }`. Servisçi değilse 403 "Konumu servisçi
  gönderir"; okulda Servis kapalıysa 403 `{ error: 'Servis bu okulda kapalı.', ozellikKapali: 'servis' }`; işi
  `okulHayati.seferKonumuYaz` yapar, hata durumunu ve metnini aynen döner ([okul-hayati.md](okul-hayati.md)). Cevap `{ ok: true }`.
- **`POST /api/cihaz/sil`** (başlıkla) — telefon kendi anahtarını kaldırır ("Bu telefonun bildirim anahtarı kaldırıldı.").
- Başka yol/yöntem 404 "Böyle bir adres yok".

### Oturumlu uçlar (`uclar`)

Önce `need(null)` (401/403). `cihaz` `ROLSUZ_SERBEST`'te: rolsüz yetişkin hesabı da anahtar alabilir. Sahip
`me.anaHesapId || me.id` (rol satırıyla girilse de anahtar ana hesaba yazılır).

- **`POST /api/cihaz`** — gövde `{ ad?, platform?, surum? }`. Sahip başına saatte 20 (429 "Bu saat içinde çok fazla
  telefon eklendi. Biraz sonra dene."). 32 bayt rastgele anahtar; kayıt `{ id: 'ck…', ad (80, "Telefon"), platform
  ("android"), surum }`; sahibin 6. anahtarı en eskisini siler. Cevap `{ cihazAnahtari, cihazId }` — anahtar YALNIZ burada.
- **`GET /api/cihaz`** → `{ cihazlar: [{ id, ad, platform, surum, olusturma, sonGorulme }] }` (anahtar dönmez).
- **`POST /api/cihaz/sil`** (başlıksız) — gövde `{ id }` ya da `{ cihazAnahtari }`; ikisi de yoksa 400 "Hangi telefonun
  kaldırılacağı belli değil."; yalnız SAHİBİN anahtarı silinir, bulunmazsa 404 "Telefon bulunamadı".
- Başka yol 404.

## Kimle konuşur?

- Çağırdıkları: `crypto`; `../guvenlik` (`hizSinir`); `../http` (`bad`, `ok`, `sendJSON`); `../ortak` (`clean`, `uid`);
  `../push` (`bildirimAdresi`, [push.md](../push.md)); `../veri` (`depo`); `sunucu/yardimci/servis-pencere.js`
  (`saatZarfi`); `./kayit` (`kvkkGuncelMi`, [kayit.md](kayit.md)); `./okul-hayati` (`surenSefer`, `seferKonumuYaz`).
- Depo ve tablolar:
  - `depo.cihazlar` (`sunucu/veri/depo/cihazlar.js`, şema 028) → `cihaz_anahtarlari`: `ekle` (5 sınırı), `ozetle`,
    `goruldu`, `sil`, `imlecYaz`, `sahibininSil`, `listesi`, `alicilar` (`kullanicilar` + `okullar.kisa_ad`),
    `sonImlec` ve `bildirimleri` (`bildirimler`);
  - `depo.kullanicilar` (`bul`, `cocukIdleri`), `depo.okulHayati` (`ogrencilerinServisi`, `soforunServisleri`),
    `depo.okullar.bul`, `depo.ozellikler.kapaliMi`.
- Anahtarları başka yerde silenler: `depo.oturumlar.hepsiniKapat` (şifre değişince, hesap silinince),
  `hesabinOturumlariniKapat` (şifre sıfırlanınca; ana hesap ve rol satırları), `depo.kullanicilar.topluSifreYaz` (okul öğrenci
  şifrelerini toplu yenileyince). `depo.cihazlar.hesabinkileriSil` tanımlı ama bugün hiçbir yerden
  çağrılmıyor (grep).
- Onu çağıran: `sunucu/api.js` (`BOLUM.cihaz` → `uclar`; anahtarlı yollar → `anahtarUclari`).
- Ön yüz (site) bu uçları kullanmıyor (grep).
- Android: `AnaEkran.java` (`POST /api/cihaz` giriş sonrası, `/api/cihaz/sil` çıkışta), `Bildirimler.java`
  (`/api/cihaz/bildirimler?son=`), `SeferServisi.java` (`/api/cihaz/servis-konum`). `GET /api/cihaz/ayar`'ı uygulama bugün
  çağırmıyor (grep; testler çağırıyor).

## Nasıl çalışır (adım adım)?

```
Uygulama girişten sonra:  POST /api/cihaz (Bearer) ─> anahtar (bir kez) ─> telefonda saklanır
Döngü (servis saatlerinde sık, dışında seyrek):
  GET /api/cihaz/bildirimler?son=<imleç>   (X-Cihaz)
     anahtar ─ hız ─ hesap onaylı + aydınlatma güncel? (değilse anahtar silinir, 403)
     alıcılar = ana hesap + onaylı rol satırları
     ilk çağrı: yalnız imleç ;  sonra: (imleç, en yeni] okunmamışlar, en çok 20
     ─> { bildirimler, imlec, servisSaatleri }
Servisçi seferde: POST /api/cihaz/servis-konum (dakikada en çok 60)
Çıkış: POST /api/cihaz/sil (X-Cihaz)
```

## Dikkat!

- **Anahtar oturum değildir.** `/api/me` gibi uçlar anahtarla 401 verir (test); Aile uçlarında da geçmez. Anahtarın
  özeti saklandığı için veritabanı sızsa bile anahtar elde edilemez.
- **Aydınlatma metni güncellenince** telefonların anahtarları ilk yoklamada silinir: kişi uygulamada onaylayıp yeniden
  anahtar almalı. Şifre değişince ya da sıfırlanınca anahtarlar oturumlarla birlikte silinir (kod yorumu: şifreyi bilip
  anahtar almış biri bildirimleri okumaya devam etmesin).
- İmleç iki parçalı `(zaman, id)`: aynı mikrosaniyede yazılmış iki bildirim de ayrılır. Sorgu yalnız OKUNMAMIŞ
  bildirimleri getirir: sitede okunmuş bildirim telefona gitmez ama imleç yine ilerler.
- 20'den çok bildirim biriktiyse telefon yalnız en yeni 20'yi alır, imleç en yeniye geçtiği için aradakiler telefona hiç
  düşmez (sitede durur). Test bunu "sonra yağmur yok" diye bilerek dener.
- Konum sınırı ayrı sayılır: sefer boyunca konum birkaç saniyede bir gelir (kod yorumu), öteki uçlarla aynı sayaca
  yazılsa saatlik sınır dolardı.
- `/api/cihaz/sil` iki yolla gelir: başlıklıysa anahtarlı yol (telefonun kendi anahtarı), başlıksızsa oturumlu yol
  (sahibin herhangi bir telefonu). `api.js`'teki koşul bunu ayırır.
- `servisSaatleri` her yoklamada yeniden hesaplanır (birkaç sorgu); telefon bunu yoklama sıklığını ayarlamak için kullanır.

## Testleri

- `testler/test-servis-yoklama.js` bölüm 9 "Cihaz anahtarı" — oturumla anahtar, oturumsuz alınamaz, anahtar `/api/me`'ye
  giriş vermez, oturum anahtarı/bilinmeyen/biçimsiz anahtar 401, ilk yoklamada eski bildirim yok, yeni bildirim (metin,
  `?k=` bağlantısı, zaman), aynı bildirim ikinci kez gelmez, okunmuş bildirim gitmez ama imleç ilerler, en çok 20,
  bozuk imleç, okul rolüne gelen bildirim, liste (anahtarsız), oturumla ve anahtarla silme, hesap başına 5, öğrencinin
  servis saatleri, Aile uçlarında geçmemesi, şifre değişince ve hesap silinince iptal, konumun dakikada 60 sınırı.
- `testler/test-aile.js` — Aile anahtarı bu uçlarda geçmez.
- `testler/test-ozellikler.js` — Servis açıkken konum alınır; kapalıyken `servis-konum` 403 `ozellikKapali`, bildirim
  yoklaması sürer ama `servisSaatleri` `null`.
- `testler/test-yedek.js` — yedekten geri yüklenen anahtar `/api/cihaz/ayar`'da çalışır.
- `testler/yetki-denetimi.js`, `testler/girdi-denetimi.js`.
- Elle: `POST /api/cihaz` (oturumla) → `curl -H "X-Cihaz: <anahtar>" "http://localhost:3200/api/cihaz/bildirimler"`,
  dönen `imlec`'i `?son=` ile geri ver.

## Son durum

- Tek commit: `24050a2 commit 518` (2026-09-27) — servis yoklaması işiyle dosya bütünüyle geldi (yerel uygulamanın
  bildirim yoklaması, servisçi konumu, 30 gün uygulama oturumu aynı iş). O günden beri değişmedi.
- Açık iş: `depo.cihazlar.hesabinkileriSil` kullanılmıyor (silme başka depolarda doğrudan yapılıyor). Sıradaki planlı
  değişiklikler: "Sistem: … yeni cihaz uyarısı + açık oturumlar" ve "Android yerel uygulama (bütün roller)" işleri bu
  uçlara dokunabilir.
