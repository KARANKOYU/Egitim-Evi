'use strict';
/* Sınavlar: şablonlar, gruplar, sınavlar, ölçümler ve değerler.

   Bir sınavın her ölçümü (Doğru, Yanlış, Net, Puan...) ayrı satırdır; ana
   ölçüm (ana = true) ortalamaya ve grafiğe varsayılan olarak girer. Eski API
   ile uyum için sınav nesnesinde grades = { ogrenciId: ana ölçüm değeri }. */

const { sorgu, tek, calistir, islem, tr } = require('../baglanti');
const { uid } = require('../../ortak');
const e = require('../esleme');

/* ================= şablonlar ================= */
const OLCUM_JSON =
  "json_build_object('id', x.id, 'kod', x.kod, 'ad', x.ad, 'alt', x.alt_sinir, 'ust', x.ust_sinir, " +
  "'ana', x.ana, 'sira', x.sira)";

const SABLON_SEC =
  'SELECT sb.*, ' +
  "  COALESCE((SELECT json_agg(" + OLCUM_JSON + " ORDER BY x.sira) FROM sablon_olcumleri x WHERE x.sablon_id = sb.id), '[]') AS olcumler " +
  'FROM sinav_sablonlari sb';

function sablon(r) {
  if (!r) return null;
  return { id: r.id, schoolId: r.okul_id, name: r.ad, createdBy: e.bos(r.olusturan_id),
    olcumler: r.olcumler || [], createdAt: r.olusturma };
}

async function sablonlar(okulId) {
  return (await sorgu(SABLON_SEC + ' WHERE sb.okul_id = $1 ORDER BY sb.ad' + tr(), [okulId])).map(sablon);
}

async function sablonBul(id) {
  if (!id) return null;
  return sablon(await tek(SABLON_SEC + ' WHERE sb.id = $1', [id]));
}

async function sablonOlcumleriniYaz(sablonId, olcumler) {
  await calistir('DELETE FROM sablon_olcumleri WHERE sablon_id = $1', [sablonId]);
  let sira = 0;
  for (const o of olcumler) {
    await sorgu('INSERT INTO sablon_olcumleri (id, sablon_id, sira, kod, ad, alt_sinir, ust_sinir, ana) ' +
      'VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
      [uid('so'), sablonId, ++sira, o.kod, o.ad, o.alt, o.ust, !!o.ana]);
  }
}

async function sablonEkle(s) {
  await islem(async () => {
    await sorgu('INSERT INTO sinav_sablonlari (id, okul_id, olusturan_id, ad, olusturma) VALUES ($1, $2, $3, $4, $5)',
      [s.id, s.schoolId, e.yokIse(s.createdBy), s.name, s.createdAt]);
    await sablonOlcumleriniYaz(s.id, s.olcumler);
  });
  return sablonBul(s.id);
}

/* Şablonu değiştirmek eski sınavları etkilemez: onlar ölçümlerin kopyasını taşır. */
async function sablonGuncelle(id, ad, olcumler) {
  await islem(async () => {
    await calistir('UPDATE sinav_sablonlari SET ad = $1 WHERE id = $2', [ad, id]);
    await sablonOlcumleriniYaz(id, olcumler);
  });
  return sablonBul(id);
}

/* Şablonla yapılmış sınav sayısı (kullanılan şablon silinmez). */
async function sablonunSinavSayisi(id) {
  const r = await tek('SELECT count(*) AS n FROM sinavlar WHERE sablon_id = $1', [id]);
  return r ? Number(r.n) : 0;
}

