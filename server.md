# server.js

Dört satırlık kabuk: `node server.js` yazınca asıl sunucuyu (`sunucu/index.js`) başlatır.

## Bu dosya ne yapar?

Bu dosyanın tek işi, eski başlatma komutunun çalışmaya devam etmesi. Proje ilk yazıldığında bütün sunucu tek bir
`server.js` içindeydi; sonra kod `sunucu/` klasörüne bölündü ve asıl giriş noktası `sunucu/index.js` oldu. `package.json`'daki `start` betiği ve
kurulum belgesindeki hizmet (`belge/SUNUCUYA-KURULUM.md`, `ExecStart=/usr/bin/node sunucu/index.js`) artık doğrudan
`sunucu/index.js`'i çalıştırıyor; ama `node server.js` alışkanlığı test betiklerinde ve araçlarda sürüyor. Onları
bozmamak için bu kabuk bırakıldı: `require('./sunucu/index.js')` der ve çekilir. Sunucunun ne yaptığını
öğrenmek istiyorsan doğrudan `sunucu/index.md`'ye geç.

## İçinde neler var?

- Dışa açık hiçbir şey yok (`module.exports` yok).
- Tek satır iş: `require('./sunucu/index.js');` — bu satır yüklenir yüklenmez `sunucu/index.js` çalışır; ayarları
  okur, veritabanını açar, HTTP sunucusunu dinlemeye başlatır.
- `'use strict';` ve ne işe yaradığını anlatan bir yorum.

## Kimle konuşur?

- Çağırdığı: `sunucu/index.js` (yalnız o).
- Onu çağıranlar: insanlar ve betikler. `testler/tumtest.sh` her paket için sunucuyu `PORT=3200 ... node server.js`
  ile açar; `araclar/giris.js` ("Sunucuyu `node server.js > sunucu.log` ile başlat" uyarısı) ve `araclar/yuk-testi.js`
  bu komutu anlatır; `sunucu/index.js` de port doluyken "`set PORT=3001 && node server.js`" önerir.
- Veri tablosuna doğrudan dokunmaz.

## Nasıl çalışır (adım adım)?

```
node server.js
   └─ require('./sunucu/index.js')
         ├─ ayarlar (data/ayarlar.json), okul listesi
         ├─ veritabanı açılışı (şema dosyaları)
         └─ HTTP sunucusu dinlemeye başlar (PORT, HOST)
```

Ortam değişkenleri (`PORT`, `HOST`, `EE_DATA`, `EE_DB_SIFIRLA`, `EE_ADMIN_SIFRE`, `EE_PUSH_GONDERME`, `EE_DIS_ISTEK`,
`EE_ACIK_KAYNAK`…) bu dosyada değil, `sunucu/` altındaki dosyalarda okunur; kabuk onları olduğu gibi geçirir çünkü
aynı süreçtir.

## Dikkat!

- Buraya kod ekleme. Başlangıçta yapılacak her şeyin yeri `sunucu/index.js`. Bu dosyada bir şey çalıştırırsan
  `node sunucu/index.js` ile açılan sunucu onu yapmaz, iki yol birbirinden ayrılır.
- Dosya adını değiştirme ya da silme: `testler/tumtest.sh`, araçlar ve konsol iletileri bu adı kullanıyor.

## Testleri

- Ayrı bir testi yok; ama her sunuculu test paketi (`testler/tumtest.sh` ile koşan `test-*.js`'lerin hepsi) sunucuyu
  bu dosyayla açtığı için dolaylı olarak her test onu da dener.
- Elle: proje kökünde `node server.js` → konsolda "EGITIM EVI calisiyor" kutusu çıkmalı. Test için ayrı veriyle:
  `EE_DATA=testler/testdata PORT=3200 node server.js`.

## Son durum

- `git log` bu dosyada tek commit gösteriyor: `acefabc commit 1` (2026-08-28) — sunucu bölündüğünde yazılan hâli, o
  günden beri değişmedi.
- Yarım kalan iş yok. Belgeleme işinin ilk parçasında bu `.md` eklendi (kod değişmedi).
