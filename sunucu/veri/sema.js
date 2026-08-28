'use strict';
/* Şema sürümleri: sunucu/veri/sema/ klasöründeki numaralı .sql dosyalarını
   sırayla uygular.

   Her dosya bir kez çalışır; hangilerinin uygulandığı sema_surumleri
   tablosunda tutulur. Tabloya yeni bir sütun eklemek gerekince eski dosya
   değiştirilmez, yeni bir dosya yazılır (002-sinav-alanlari.sql gibi).
   Böylece canlı sunucudaki veri kaybolmadan yapı güncellenir.

   Her dosya kendi işleminde (transaction) çalışır: yarısı uygulanıp
   yarısı kalmış bir şema olmaz. */

const fs = require('fs');
const path = require('path');
const { sorgu, islem, metinCalistir, veritabaniAdi } = require('./baglanti');

const KLASOR = path.join(__dirname, 'sema');

function dosyalar() {
  return fs.readdirSync(KLASOR)
    .filter(ad => /^\d{3}-[a-z0-9-]+\.sql$/.test(ad))
    .sort()
    .map(ad => ({ surum: Number(ad.slice(0, 3)), ad, yol: path.join(KLASOR, ad) }));
}

/* Yalnızca test veritabanı için: şemayı tamamen silip baştan kurar.
   Adı _test ile bitmeyen veritabanında ASLA çalışmaz. */
async function testIcinSifirla() {
  const ad = veritabaniAdi();
  if (!/_test$/.test(ad)) {
    throw new Error('Sıfırlama yalnızca test veritabanında yapılabilir (şu an: ' + ad + ')');
  }
  await metinCalistir('DROP SCHEMA public CASCADE; CREATE SCHEMA public;');
}

module.exports = { semayiGuncelle, testIcinSifirla };
