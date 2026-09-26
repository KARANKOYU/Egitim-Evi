'use strict';
/* Okul sayfası (018): okul_sayfalari ve okul_fotolari. */

const { sorgu, tek, calistir } = require('../baglanti');

const sayfaNesnesi = r => (r ? {
  okulId: r.okul_id, tanitim: r.tanitim, ayarlar: r.ayarlar || {}, css: r.css,
  guncelleyenId: r.guncelleyen_id || '', guncelleme: r.guncelleme
} : null);

const fotoNesnesi = r => ({
  id: r.id, okulId: r.okul_id, yer: r.yer, tur: r.tur, boyut: r.boyut, aciklama: r.aciklama, olusturma: r.olusturma
});

async function bul(okulId) {
  return sayfaNesnesi(await tek('SELECT * FROM okul_sayfalari WHERE okul_id = $1', [okulId]));
}

async function yaz(okulId, s, kisiId) {
  await calistir(
    'INSERT INTO okul_sayfalari (okul_id, tanitim, ayarlar, css, guncelleyen_id, guncelleme) ' +
    'VALUES ($1, $2, $3, $4, $5, now()) ' +
    'ON CONFLICT (okul_id) DO UPDATE SET tanitim = $2, ayarlar = $3, css = $4, guncelleyen_id = $5, guncelleme = now()',
    [okulId, s.tanitim, JSON.stringify(s.ayarlar || {}), s.css, kisiId || null]);
}

/* Okulun fotoğrafları: kapak, logo, sonra galeri (yükleniş sırasıyla). */
async function fotolari(okulId) {
  const satirlar = await sorgu(
    "SELECT * FROM okul_fotolari WHERE okul_id = $1 ORDER BY CASE yer WHEN 'kapak' THEN 0 WHEN 'logo' THEN 1 ELSE 2 END, olusturma",
    [okulId]);
  return satirlar.map(fotoNesnesi);
}

async function foto(id) {
  const r = await tek('SELECT * FROM okul_fotolari WHERE id = $1', [id]);
  return r ? fotoNesnesi(r) : null;
}

async function fotoEkle(f) {
  await calistir('INSERT INTO okul_fotolari (id, okul_id, yer, tur, boyut, aciklama) VALUES ($1, $2, $3, $4, $5, $6)',
    [f.id, f.okulId, f.yer, f.tur, f.boyut, f.aciklama || '']);
}

const fotoSil = id => calistir('DELETE FROM okul_fotolari WHERE id = $1', [id]);

const fotoAciklamasi = (id, aciklama) => calistir('UPDATE okul_fotolari SET aciklama = $2 WHERE id = $1', [id, aciklama]);

/* Diskteki dosyalardan hangilerinin kaydı var (temizlik için). */
async function kayitlilar(idler) {
  if (!idler.length) return new Set();
  const satirlar = await sorgu('SELECT id FROM okul_fotolari WHERE id = ANY($1)', [idler]);
  return new Set(satirlar.map(r => r.id));
}

module.exports = { bul, yaz, fotolari, foto, fotoEkle, fotoSil, fotoAciklamasi, kayitlilar };
