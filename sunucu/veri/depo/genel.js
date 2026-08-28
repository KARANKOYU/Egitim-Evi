'use strict';
/* Küçük tablolar: takvim etkinlikleri, bildirimler, işlem kaydı, hatırlatmalar. */

const net = require('net');
const { EventEmitter } = require('events');
const { sorgu, tek, calistir } = require('../baglanti');

/* Bildirim yazılınca haber verilir: telefon bildirimi (push.js) bunu dinler.
   Veri katmanı dışarıya istek atmaz; yalnızca olay yayar. */
const olaylar = new EventEmitter();
const yay = liste => { if (liste.length) setImmediate(() => olaylar.emit('bildirim', liste)); };
const { uid, now, clean } = require('../../ortak');
const e = require('../esleme');

/* ================= takvim ================= */
async function takvimBul(id) {
  if (!id) return null;
  return e.takvim(await tek('SELECT * FROM takvim_etkinlikleri WHERE id = $1', [id]));
}

/* Verilen aralıkla kesişen okul etkinlikleri. */
async function takvimAraligi(okulId, bas, bit) {
  return (await sorgu(
    'SELECT * FROM takvim_etkinlikleri WHERE okul_id = $1 AND tarih <= $3 AND COALESCE(bitis, tarih) >= $2 ' +
    'ORDER BY tarih, olusturma', [okulId, bas, bit])).map(e.takvim);
}

async function takvimEkle(k) {
  await sorgu(
    'INSERT INTO takvim_etkinlikleri (id, okul_id, tarih, bitis, baslik, tur, aciklama, ekleyen_id, yil_id, olusturma) ' +
    'VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)',
    [k.id, k.schoolId, k.tarih, e.yokIse(k.bitis), k.baslik, k.tur, k.aciklama || '',
      e.yokIse(k.ekleyenId), e.yokIse(k.yilId), k.createdAt]);
}

function veliBaglantisi(baglanti, ogrenciId) {
  const sayfa = String(baglanti || '').replace(/^#\/?/, '');
  return '#/' + (VELI_SAYFASI[sayfa] || 'cocuklarim') + '?c=' + ogrenciId;
}

/* liste = [{ kime, metin, baglanti }] -> velilere gidecek kopyalar */
async function veliKopyalari(liste) {
  const kimler = [...new Set(liste.map(b => b.kime))];
  if (!kimler.length) return [];
  const satirlar = await sorgu(
    'SELECT o.id AS ogrenci_id, o.ad_soyad, b.veli_id FROM kullanicilar o ' +
    'JOIN veli_baglari b ON b.ogrenci_id = o.id JOIN kullanicilar v ON v.id = b.veli_id ' +
    "WHERE o.id = ANY($1::text[]) AND o.rol = 'student' AND v.durum = 'approved'", [kimler]);
  if (!satirlar.length) return [];
  const veliler = new Map();
  for (const r of satirlar) {
    if (!veliler.has(r.ogrenci_id)) veliler.set(r.ogrenci_id, { ad: r.ad_soyad, idler: [] });
    veliler.get(r.ogrenci_id).idler.push(r.veli_id);
  }
  const zatenAlan = new Set(kimler);
  const kopya = [];
  for (const b of liste) {
    const v = veliler.get(b.kime);
    if (!v) continue;
    for (const vid of v.idler) {
      if (zatenAlan.has(vid)) continue;
      kopya.push({ kime: vid, metin: v.ad + ' · ' + b.metin, baglanti: veliBaglantisi(b.baglanti, b.kime) });
    }
  }
  return kopya;
}

/* Kişiye göre değişen metinler tek sorguda (kopya eklemeden). */
async function bildirimYaz(liste) {
  const temiz = liste.filter(b => b && b.kime);
  if (!temiz.length) return;
  await sorgu(
    'INSERT INTO bildirimler (id, kullanici_id, metin, baglanti) ' +
    'SELECT $1 || md5(random()::text || k || m), k, m, b ' +
    'FROM unnest($2::text[], $3::text[], $4::text[]) AS x(k, m, b)',
    ['n_', temiz.map(b => b.kime), temiz.map(b => clean(b.metin, 300)), temiz.map(b => b.baglanti || '')]);
  yay(temiz.map(b => ({ kime: b.kime, metin: clean(b.metin, 300), baglanti: b.baglanti || '' })));
}

async function yoneticilereBildir(metin, baglanti) {
  const idler = (await sorgu("SELECT id FROM kullanicilar WHERE rol = 'admin'")).map(r => r.id);
  await topluBildir(idler, metin, baglanti);
}

