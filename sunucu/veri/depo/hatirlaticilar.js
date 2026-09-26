'use strict';
/* Kişisel hatırlatıcılar (024). */

const { sorgu, tek, calistir, islem } = require('../baglanti');

const SEC = 'SELECT h.*, coalesce(array_agg(g.gun ORDER BY g.gun) FILTER (WHERE g.gun IS NOT NULL), \'{}\') AS gunler ' +
  'FROM hatirlaticilar h LEFT JOIN hatirlatici_gunleri g ON g.hatirlatici_id = h.id ';

const nesne = r => r && {
  id: r.id, kullaniciId: r.kullanici_id, baslik: r.baslik, aciklama: r.aciklama, siklik: r.siklik,
  tarih: r.tarih || '', saat: r.saat, ayGunu: r.ay_gunu || null, gunler: (r.gunler || []).map(Number),
  aktif: r.aktif, sonGonderim: r.son_gonderim || '', olusturma: r.olusturma
};

const kisinin = async kullaniciId =>
  (await sorgu(SEC + 'WHERE h.kullanici_id = $1 GROUP BY h.id ORDER BY h.olusturma', [kullaniciId])).map(nesne);

const bul = async id => nesne(await tek(SEC + 'WHERE h.id = $1 GROUP BY h.id', [id]));

const sayisi = async kullaniciId =>
  Number((await tek('SELECT count(*) AS n FROM hatirlaticilar WHERE kullanici_id = $1', [kullaniciId])).n);

/* Zamanlayıcı için: açık olanların hepsi (kişi başına en fazla 50). */
const aktifler = async () => (await sorgu(SEC + 'WHERE h.aktif GROUP BY h.id')).map(nesne);

async function gunleriYaz(id, gunler) {
  await calistir('DELETE FROM hatirlatici_gunleri WHERE hatirlatici_id = $1', [id]);
  for (const g of gunler) await calistir('INSERT INTO hatirlatici_gunleri (hatirlatici_id, gun) VALUES ($1, $2)', [id, g]);
}

async function ekle(h) {
  await islem(async () => {
    await calistir('INSERT INTO hatirlaticilar (id, kullanici_id, baslik, aciklama, siklik, tarih, saat, ay_gunu) ' +
      'VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
      [h.id, h.kullaniciId, h.baslik, h.aciklama, h.siklik, h.tarih || null, h.saat, h.ayGunu || null]);
    await gunleriYaz(h.id, h.gunler || []);
  });
  return bul(h.id);
}

/* Düzeltilince baştan sayılır: yeni saat bugün geçmişse ilk hatırlatma yarın. */
async function guncelle(id, h) {
  await islem(async () => {
    await calistir('UPDATE hatirlaticilar SET baslik = $2, aciklama = $3, siklik = $4, tarih = $5, saat = $6, ay_gunu = $7, ' +
      'aktif = true, son_gonderim = NULL, olusturma = now() WHERE id = $1',
      [id, h.baslik, h.aciklama, h.siklik, h.tarih || null, h.saat, h.ayGunu || null]);
    await gunleriYaz(id, h.gunler || []);
  });
  return bul(id);
}

/* Durdurup yeniden başlatınca da baştan sayılır (geçmiş anlar topluca gelmesin). */
const aktifYaz = (id, aktif) => calistir('UPDATE hatirlaticilar SET aktif = $2' + (aktif ? ', olusturma = now()' : '') + ' WHERE id = $1', [id, aktif]);

const sil = id => calistir('DELETE FROM hatirlaticilar WHERE id = $1', [id]);

/* Gönderildi: bir kezlik olan kapanır. */
const gonderildi = (id, zaman, bitti) =>
  calistir('UPDATE hatirlaticilar SET son_gonderim = $2' + (bitti ? ', aktif = false' : '') + ' WHERE id = $1', [id, zaman]);

module.exports = { kisinin, bul, sayisi, aktifler, ekle, guncelle, aktifYaz, sil, gonderildi };
