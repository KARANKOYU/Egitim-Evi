# sunucu/bolumler/veli.js

Veli uçları (`/api/parent`): çocuğun veli koduyla yetişkin hesabına bağlanması, bağlı çocukların listesi ve bağın
kaldırılması; kişilik bölümünün de kullandığı `cocukBagla` işlevi.

## Bu dosya ne yapar?

Her öğrencinin 16 karakterlik bir **veli kodu** vardır (öğrencinin Ayarlar sayfasında görünür, ör. biçim
`Ab3#-kQx9-+mPt-7?zR`). Anne ya da baba bu kodu kendi hesabına girince çocuğu hesabına bağlanır: çocuğun ödevlerini,
devamsızlığını, mesajlarını görmeye başlar. Kod kullanılınca YENİLENMEZ: anne ve baba aynı kodla ekleyebilir (kod
yorumu).

Çocuk her zaman YETİŞKİN (ana) hesabına bağlanır. Kişi okulda öğretmen ya da müdür rolüyle girmişken istek gelirse, bağ o
rolün bağlı olduğu yetişkin hesabına kurulur (dosya başı yorumu). Henüz rolü olmayan yetişkin hesabı doğru kodu girince
**veli olur** (rolsüz → `parent`) ve çocuğunun okuluna bağlanır. Aynı bağlama işini "+ Ekle > Çocuk" ekranı da
kullanır: [kisilik.md](kisilik.md) (`/api/kisilik/cocuk`).

## İçinde neler var?

### Dışa açılan işlevler

- `cocukBagla(hesap, kodHam, req)` → `{ hesap, ogrenci }` ya da `{ hata, kod }`. Sıra:
  1. hesap başına dakikada 5 deneme (`kod:<hesap>`; aşılırsa 429 "Çok fazla kod denemesi. Bir dakika bekleyip tekrar
     dene.") — kod yorumu: veli kodu tahmin saldırısına karşı;
  2. aynı IP'den saatte 30 YANLIŞ kod (`veliKodHata:<ip>`; `hataSiniriDoldu`/`hataSay`; 429 "Bu bağlantıdan çok fazla
     yanlış kod denendi. Bir saat sonra tekrar dene.") — kod yorumu: çok hesap açıp her birinden kod denemek de sınırlı;
  3. kod `kisiKoduSade` ile sadeleşir: büyük/küçük harf DUYARLI; boşluklar ve tireler silinir (ekrandaki 4'erli biçim
     yapıştırılınca da olur); eski 10 ve 15 haneli kodlar geçmez;
  4. öğrenci bulunamazsa yanlış sayılır, 400 "Bu koda sahip bir öğrenci bulunamadı. Kodu öğrencinin Ayarlar sayfasından
     kontrol et."; kendi hesabı 400 "Kendi hesabını veli olarak ekleyemezsin."; zaten bağlıysa 400 "Bu öğrenci zaten
     ekli";
  5. TEK İŞLEMDE: rolsüz hesap veli yapılır (`rolsuzuVeliYap`), bağ yazılır (`pl` önekli kimlik), hesabın okulu yoksa
     çocuğun okulu yazılır (kod yorumu: veli kayıtta okul seçmiyor; takvim, mesaj ve duyurular buna dayanıyor);
  6. öğrenciye "<velinin adı> veli olarak hesabına bağlandı." bildirimi (veli kopyası kapalı).
- `uclar(k)` — aşağıdaki uçlar.

### Uçlar

`p === 'parent'`. Kapı: rolsüz hesabın `POST /api/parent/link` isteği için yalnız `need()` (giriş ve onay); öteki her
durumda `need(['parent', 'teacher', 'principal'])` (öğrenci ve servisçi 403). `parent` `api.js`'in `ROLSUZ_SERBEST`
listesinde olduğu için rolsüz hesap buraya kadar gelir. Sonra çocuk bağlarının tutulduğu hesap bulunur: `me.anaHesapId`
varsa ana hesap (yoksa 404 "Hesap bulunamadı"), yoksa kişinin kendisi.

- **`GET /api/parent/children`** → `{ children: [{ id, fullName, schoolId, schoolName, code }] }` — bağlanma sırasıyla.
  `code` çocuğun veli kodudur (öteki ebeveynle paylaşılabilsin).
- **`POST /api/parent/link`** — gövde `{ code }`; `cocukBagla` hatası kendi durum koduyla. Cevap `{ children }`.
- **`POST /api/parent/unlink`** — gövde `{ studentId }`. Bağ silinir (hiç yoksa da hata vermez); yetişkin (veli ya da
  rolsüz) hesabın okulu kalan ilk çocuğunun okuluna yeniden hesaplanır, çocuk kalmadıysa boşalır; son çocuk da gidince
  hesap rolsüz yetişkine döner (depo yorumu: yoksa eski okulun "Veliler" mesajlarını almaya, takvimini görmeye devam
  ederdi). Öğretmen ya da müdür rol satırının okuluna dokunulmaz. Cevap `{ children }`.

## Kimle konuşur?

- Çağırdıkları: `../guvenlik` (`hataSay`, `hataSiniriDoldu`, `hizSinir`, `istemciIp`); `../http` (`bad`, `ok`);
  `../iliskiler` (`childrenOf`); `../ortak` (`clean`, `kisiKoduSade`, `now`, `uid`); `../veri` (`depo`, `bildir`, `islem`).
- Depo ve tablolar: `depo.kullanicilar` → `kullanicilar`, `veli_baglari`, `okullar`: `kodlaOgrenci`, `bagliMi`,
  `rolsuzuVeliYap`, `bagla`, `guncelle`, `bul`, `cocuklari`, `bagiCoz`. Bildirim → `bildirimler`.
- Onu çağıranlar: `sunucu/api.js` (`BOLUM.parent`); `sunucu/bolumler/kisilik.js` (`cocukBagla`, `/api/kisilik/cocuk`).
- Ön yüz: `public/js/parcalar/25-tiklama.js` (link, unlink), `08-ana-sayfa.js` ve `23-veli-ayarlar.js` (children).
- Android uygulaması `/api/parent`'ı çağırmıyor; çocuğu `/api/kisilik/cocuk` ile ekler (grep).

## Nasıl çalışır (adım adım)?

```
POST /api/parent/link { code }
  rolsüz mü? need() : need(parent|teacher|principal)
  hesap = ana hesap (rol satırıyla girildiyse)
  cocukBagla:
     5/dk (hesap) ─ 30 yanlış/saat (IP) ─ kisiKoduSade ─ kodlaOgrenci
     kendisi mi? zaten bağlı mı?
     islem { rolsüzse veli yap ; veli_baglari ekle ; okulu yoksa çocuğun okulu }
     öğrenciye bildirim
  -> { children }
```

## Dikkat!

- **Kod tahminine karşı iki sınır**: hesap başına dakikada 5 deneme (hepsi sayılır) ve IP başına saatte 30 YANLIŞ kod
  (yalnız başarısızlar sayılır). 16 karakterlik, büyük/küçük harf duyarlı ve özel karakterli kod bu sınırlarla tahmin
  edilemez hâle getirildi (kişi kodu işi, [kisilik.md](kisilik.md)).
- Bağ yetişkin hesabına kurulur: öğretmen rolüyle girip çocuk ekleyen kişinin çocuğu, veli portalında da görünür.
- `unlink` hangi öğrenci verilirse verilsin yalnız bu hesabın bağını siler; olmayan bağ için de başarı döner.
- Öğrenciye bağlanma bildirimi gider ama bağ kaldırılınca bildirim gitmez.
- `children` cevabındaki `code` çocuğun veli kodudur; velinin ekranında görünür (ikinci ebeveyn için).
- `link` cevabında rol satırıyla girildiyse `cocuklari(ana)`, değilse `childrenOf(r.hesap)` kullanılır; ikisi de ana
  hesabın çocuklarını döner.

## Testleri

- `testler/test-giris-kayit.js` — veli kodu biçimi (16 karakter), yanlış kod reddi, harf durumu değiştirilmiş kodun
  reddi, boşluklu ve tireli yazılan kodun kabulü, kod girince rolsüz hesabın veli olması.
- `testler/test-kisi-kodu.js` — kod üretimi ve `kisiKoduSade` (eski 10 ve 15 haneli kodlar geçersiz).
- `testler/test-veli-coklu.js` — öğretmen veli koduyla (tireli yazılmış) kendi çocuğunu bağlar, öğretmen rolü değişmez,
  veli portalında çocuğun ilerleyişini ve devamsızlığını görür, bağını kaldırır (`unlink`); paketin geri kalanı okulun
  veli bağlamasını dener ([hesaplar.md](hesaplar.md)).
- `testler/test-nakil.js` (`children` nakilden sonra), `guvenlik-test.js`, `girdi-denetimi.js`, `yetki-denetimi.js`.
- Başka birçok paket (`test-mesaj.js`, `test-devamsizlik.js`, `test-aile.js`, `test-takvim.js`…) hazırlıkta
  `/api/parent/link` ile veli bağlar.
- Elle: öğrenci hesabıyla (`testler/seed.js`) Ayarlar'dan veli kodunu al; veli hesabıyla `POST /api/parent/link`
  `{ "code": "<kod>" }`.

## Son durum

- Son commit `153d63d commit 522` (2026-09-27): yalnız yorum — kişi kodu 16 haneye çıktı; yorum "4'erli biçim, boşluk ve
  tire silinir, eski 10 ve 15 haneli kod geçmez" oldu.
- `0acca75 commit 516` (2026-09-27): kişi kodu işi — `kodSade` yerine `kisiKoduSade` (büyük/küçük harf duyarlı), "kod
  kullanılınca yenilenmez" notu. Daha eski: `da5e50c commit 257`, `95cf29b commit 256` (2026-09-25).
- Açık iş yok. Sıradaki işlerden "Kullanıcı arama… Verilerimi indir" ve "Yıl geçişi… mezunlar" veli bağlarına dokunabilir;
  bu dosya için yazılı bir değişiklik yok.
