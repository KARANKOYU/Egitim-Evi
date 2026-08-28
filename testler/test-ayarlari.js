'use strict';
/* Testler için ayar dosyası.
   Gerçek data/ayarlar.json'daki veritabanı bilgisini alır, veritabanı adını
   test veritabanıyla (egitimevi_test) değiştirip verilen klasöre yazar.
   Testler sunucuyu EE_DB_SIFIRLA=1 ile açar; sıfırlama yalnızca adı _test
   ile biten veritabanında çalışır, gerçek veriye dokunulamaz.
   Şifre ekrana yazılmaz.

     node testler/test-ayarlari.js testler/testdata */

const fs = require('fs');
const path = require('path');

const kaynak = path.join(__dirname, '..', 'data', 'ayarlar.json');
const hedefKlasor = path.resolve(process.argv[2] || path.join(__dirname, 'testdata'));

let ayar;
try { ayar = JSON.parse(fs.readFileSync(kaynak, 'utf8')); }
catch (e) { console.error('data/ayarlar.json okunamadı: önce npm run veritabani-kur çalıştır.'); process.exit(1); }

const v = ayar.veritabani;
if (!v || !v.testAd || !/_test$/.test(v.testAd)) {
  console.error('ayarlar.json içinde test veritabanı (testAd) yok: npm run veritabani-kur yeniden çalıştırılmalı.');
  process.exit(1);
}

fs.mkdirSync(hedefKlasor, { recursive: true });
fs.writeFileSync(path.join(hedefKlasor, 'ayarlar.json'),
  JSON.stringify({ veritabani: Object.assign({}, v, { ad: v.testAd }) }, null, 2), { mode: 0o600 });
