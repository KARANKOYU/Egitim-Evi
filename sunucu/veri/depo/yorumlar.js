'use strict';
/* Açılış sayfasındaki yorumlar (019). */

const { sorgu, tek, calistir } = require('../baglanti');

const nesne = r => (r ? {
  id: r.id, hesapId: r.hesap_id, yildiz: r.yildiz, metin: r.metin, adKisa: r.ad_kisa, rol: r.rol,
  gizli: r.gizli, olusturma: r.olusturma, guncelleme: r.guncelleme
} : null);

const hesabin = async hesapId => nesne(await tek('SELECT * FROM yorumlar WHERE hesap_id = $1', [hesapId]));
const bul = async id => nesne(await tek('SELECT * FROM yorumlar WHERE id = $1', [id]));

/* Hesabın yorumu varsa değişir, yoksa eklenir (hesap başına tek yorum). */
async function yaz(y) {
  await calistir(
    'INSERT INTO yorumlar (id, hesap_id, yildiz, metin, ad_kisa, rol) VALUES ($1, $2, $3, $4, $5, $6) ' +
    'ON CONFLICT (hesap_id) DO UPDATE SET yildiz = $3, metin = $4, ad_kisa = $5, rol = $6, guncelleme = now()',
    [y.id, y.hesapId, y.yildiz, y.metin, y.adKisa, y.rol]);
}

const hesabinkiniSil = hesapId => calistir('DELETE FROM yorumlar WHERE hesap_id = $1', [hesapId]);
const gizle = (id, gizli) => calistir('UPDATE yorumlar SET gizli = $2 WHERE id = $1', [id, !!gizli]);

/* Açılışta görünenler (en yeniler) ve bütün görünenlerin ortalaması. */
async function gorunenler(sinir) {
  const [liste, ozet] = await Promise.all([
    sorgu('SELECT * FROM yorumlar WHERE NOT gizli ORDER BY guncelleme DESC LIMIT $1', [sinir]),
    tek('SELECT count(*)::int AS sayi, coalesce(avg(yildiz), 0)::float AS ortalama FROM yorumlar WHERE NOT gizli')
  ]);
  return { yorumlar: liste.map(nesne), sayi: ozet.sayi, ortalama: ozet.ortalama };
}

/* Yönetici için hepsi (gizliler dahil). */
async function hepsi(sinir) {
  return (await sorgu('SELECT * FROM yorumlar ORDER BY guncelleme DESC LIMIT $1', [sinir])).map(nesne);
}

module.exports = { hesabin, bul, yaz, hesabinkiniSil, gizle, gorunenler, hepsi };
