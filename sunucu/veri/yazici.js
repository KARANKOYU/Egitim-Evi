'use strict';
/* Tek tabloya satır ekleme / güncelleme yardımcıları.

   Tablo ve sütun adları KODDAN gelir (esleme.js), kullanıcıdan asla; yine de
   her ad küçük harf/alt çizgi kalıbıyla doğrulanır. Değerler her zaman
   $1, $2 ... parametresiyle gider. */

const { calistir } = require('./baglanti');

const AD = /^[a-z_][a-z0-9_]*$/;
function adDogrula(ad) {
  if (!AD.test(ad)) throw new Error('Geçersiz tablo ya da sütun adı: ' + ad);
  return ad;
}

async function ekle(tablo, sutunlar) {
  const adlar = Object.keys(sutunlar).map(adDogrula);
  const yerler = adlar.map((_, i) => '$' + (i + 1));
  return calistir(
    'INSERT INTO ' + adDogrula(tablo) + ' (' + adlar.join(', ') + ') VALUES (' + yerler.join(', ') + ')',
    adlar.map(a => sutunlar[a]));
}

async function guncelle(tablo, id, sutunlar) {
  const adlar = Object.keys(sutunlar).map(adDogrula);
  if (!adlar.length) return 0;
  const atamalar = adlar.map((a, i) => a + ' = $' + (i + 1));
  return calistir(
    'UPDATE ' + adDogrula(tablo) + ' SET ' + atamalar.join(', ') + ' WHERE id = $' + (adlar.length + 1),
    adlar.map(a => sutunlar[a]).concat([id]));
}

async function sil(tablo, id) {
  return calistir('DELETE FROM ' + adDogrula(tablo) + ' WHERE id = $1', [id]);
}

module.exports = { ekle, guncelle, sil, adDogrula };
