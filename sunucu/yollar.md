# sunucu/yollar.js

Proje kökü, `public/`, `data/` klasörleri, port ve dinleme adresi tek yerden burada belirlenir.

## Bu dosya ne yapar?

Sunucunun her yerinde "dosyalar nerede, hangi portu dinliyorum" sorusu çıkar. Her dosya bunu kendi hesaplasaydı
test için ayrı bir veri klasörü vermek imkânsız olurdu. `yollar.js` bu soruların cevabını bir kez hesaplar ve
dışa verir. En önemli işi `EE_DATA` ortam değişkeni: testler sunucuyu `EE_DATA=testler/testdata` ile açar, böylece
gerçek `data/` klasörüne (gerçek ayarlar, yönetici dosyası, yedekler) hiç dokunulmaz.

## İçinde neler var?

Hepsi sabit, işlev yok:

- `ROOT` — proje kökü (`sunucu/`'nun bir üstü).
- `PUB` — `ROOT/public`: tarayıcıya giden dosyalar. `http.js` statik sunucusu yalnız bunun içinden okur.
- `DATA` — veri klasörü. `EE_DATA` verilmişse onun mutlak yolu, verilmemişse `ROOT/data`. Ayarlar
  (`ayarlar.json`), `admins.json`, `config.yml`, bildirim anahtarı, yüklenen dosyalar, yedekler buradadır.
- `DBF` — `DATA/db.json`: en eski sürümün JSON veritabanı. Bugün yalnız bir kez, geçiş için okunur (bkz. aşağı).
- `PORT` — `PORT` ortam değişkeni sayıysa o, değilse `3000`.
- `HOST` — `HOST` ortam değişkeni ya da `'::'`. `'::'` hem IPv6 hem IPv4'ü dinler.

## Kimle konuşur?

- Çağırdığı: yalnız Node'un `path` modülü.
- Onu çağıranlar (grep): `sunucu/index.js` (PORT, HOST), `sunucu/http.js` (PUB), `sunucu/ayarlar.js`,
  `sunucu/okullar.js`, `sunucu/push.js`, `sunucu/site.js`, `sunucu/yonetici-dosyasi.js` (DATA),
  `sunucu/veri/index.js` (DBF ile eski `db.json` geçişi), `sunucu/veri/yedek.js`, ve bölümlerden
  `ekler.js`, `odev-dosya.js`, `okul-disk.js`, `okul-sayfasi.js` (yüklenen dosyaların klasörleri).
- Veri tablosu yok.

## Nasıl çalışır (adım adım)?

Dosya ilk `require` edildiğinde bir kez çalışır:

1. `ROOT = path.join(__dirname, '..')`.
2. `PUB` ve `DATA` hesaplanır; `EE_DATA` varsa `path.resolve` ile mutlak yola çevrilir (göreli verilse bile).
3. `PORT = Number(process.env.PORT) || 3000`.
4. `HOST = process.env.HOST || '::'`.

Değerler süreç boyunca değişmez: ortam değişkenini sonradan değiştirmek bir şey yapmaz; bir testin kendi `EE_DATA`'sını
kullanması için `require`'dan ÖNCE `process.env.EE_DATA`'yı yazması gerekir (ör. `test-push.js`, `test-vekil-ip.js`
geçici klasörle böyle yapar).

## Dikkat!

- `HOST` neden `'::'`? Yalnız `0.0.0.0` dinlenince "localhost" yazan tarayıcı önce IPv6'yı deniyor, başarısız olunca
  IPv4'e düşüyor; bu her istekte ~200 ms bekletebiliyordu. IPv6'sı kapalı makinede `index.js` hata alınca kendiliğinden
  `0.0.0.0`'a düşer.
- Ters vekil (Caddy/nginx) arkasında `HOST=127.0.0.1` ver: sunucu yalnız yerelden dinler, dışarıya açık kalmaz.
- `PORT` sayı değilse (ör. boş) sessizce 3000 olur.
- Testler 3200'ü kullanır; 3000 geliştiricinin kendi sunucusudur, testler oraya istek atmamalı.

## Testleri

- Ayrı paketi yok. Her sunuculu test, sunucuyu `EE_DATA=testler/testdata PORT=3200` ile açarak bu dosyanın ortam
  değişkeni yolunu kullanır; `test-gizli-dosyalar.js` da `data/`'nın depoya girmediğini denetler.
- Elle: `PORT=3201 node server.js` → konsolda `http://localhost:3201` yazmalı.

## Son durum

- Tek commit: `4020378 commit 3` (2026-08-28). O günden beri değişmedi.
- Açık iş yok.
