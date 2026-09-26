'use strict';
/* Ekler (020): mesaja ve öğretmenin verdiği ödeve eklenen dosyaların bilgisi. */

const { sorgu, tek, calistir } = require('../baglanti');

const nesne = r => ({
  id: r.id, yukleyenId: r.yukleyen_id, okulId: r.okul_id || '', tur: r.tur, mesajId: r.mesaj_id || '',
  odevId: r.odev_id || '', ad: r.ad, boyut: Number(r.boyut), yuklenme: r.yuklenme, bitis: r.bitis, silindi: r.silindi
});

async function bul(id) {
  const r = await tek('SELECT * FROM ekler WHERE id = $1', [id]);
  return r ? nesne(r) : null;
}

async function ekle(e) {
  await calistir('INSERT INTO ekler (id, yukleyen_id, okul_id, tur, ad, boyut, sha256, bitis) ' +
    "VALUES ($1, $2, $3, $4, $5, $6, $7, now() + interval '7 days')",
    [e.id, e.yukleyenId, e.okulId || null, e.tur, e.ad, e.boyut, e.sha256]);
}

/* Kişinin henüz bağlanmamış taslaklarının toplam boyutu. */
async function taslakToplami(yukleyenId) {
  return Number((await tek('SELECT COALESCE(sum(boyut), 0)::bigint AS n FROM ekler ' +
    'WHERE yukleyen_id = $1 AND mesaj_id IS NULL AND odev_id IS NULL AND NOT silindi', [yukleyenId])).n);
}

/* Kişinin istenen taslakları (başkasınınki, bağlanmışı, süresi dolanı gelmez). */
async function taslaklari(yukleyenId, tur, idler) {
  if (!idler.length) return [];
  return (await sorgu('SELECT * FROM ekler WHERE id = ANY($1::text[]) AND yukleyen_id = $2 AND tur = $3 ' +
    'AND mesaj_id IS NULL AND odev_id IS NULL AND NOT silindi AND bitis > now()', [idler, yukleyenId, tur])).map(nesne);
}

/* Taslakları mesaja/ödeve bağlar. */
async function bagla(tur, hedefId, idler) {
  if (!idler.length) return;
  const mesajMi = tur === 'mesaj';
  await calistir('UPDATE ekler SET ' + (mesajMi ? 'mesaj_id' : 'odev_id') + ' = $1 ' +
    'WHERE id = ANY($2::text[]) AND mesaj_id IS NULL AND odev_id IS NULL', [hedefId, idler]);
}

/* Bir mesajın ya da ödevin ekleri (silinenler dahil; "süresi doldu" yazılır). */
async function hedefin(tur, hedefId) {
  const mesajMi = tur === 'mesaj';
  return (await sorgu('SELECT * FROM ekler WHERE ' + (mesajMi ? 'mesaj_id' : 'odev_id') + ' = $1 ORDER BY yuklenme',
    [hedefId])).map(nesne);
}

/* Birçok ödevin ekleri tek sorguda: ödev id -> ekler. */
async function odevlerin(odevIdler) {
  const harita = new Map();
  if (!odevIdler.length) return harita;
  for (const r of await sorgu('SELECT * FROM ekler WHERE odev_id = ANY($1::text[]) ORDER BY yuklenme', [odevIdler])) {
    if (!harita.has(r.odev_id)) harita.set(r.odev_id, []);
    harita.get(r.odev_id).push(nesne(r));
  }
  return harita;
}

const sil = id => calistir('DELETE FROM ekler WHERE id = $1', [id]);

/* Temizlik: süresi dolanlar "silindi" olur (dosyaları çağıran siler), bağlanmayan
   eski taslaklar tümden silinir. Dönen: diskten silinecek dosya kimlikleri. */
async function suresiDolanlar() {
  const bitenler = await sorgu("UPDATE ekler SET silindi = true WHERE NOT silindi AND bitis <= now() RETURNING id");
  const taslaklar = await sorgu("DELETE FROM ekler WHERE mesaj_id IS NULL AND odev_id IS NULL AND yuklenme < now() - interval '6 hours' RETURNING id");
  return bitenler.concat(taslaklar).map(r => r.id);
}

/* Diskteki dosyalardan hâlâ kaydı olan ve silinmemiş olanlar. */
async function yasayanlar(idler) {
  if (!idler.length) return new Set();
  return new Set((await sorgu('SELECT id FROM ekler WHERE id = ANY($1::text[]) AND NOT silindi', [idler])).map(r => r.id));
}

module.exports = { bul, ekle, taslakToplami, taslaklari, bagla, hedefin, odevlerin, sil, suresiDolanlar, yasayanlar };
