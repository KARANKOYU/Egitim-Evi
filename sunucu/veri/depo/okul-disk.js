'use strict';
/* Okulun dosya alanı (şema 035): okul başına disk sınırı ve kullanım.

   Kullanım dosya kayıtlarından toplanır (dizin gezilmez, hızlı): ödev teslim
   dosyaları (ödevin okulu), silinmemiş ekler (mesaj ve ödev ekleri, taslaklar
   dahil) ve okul sayfası fotoğrafları. Boyut kayıttaki boyuttur: dosya
   küçültülünce kayıt güncellenir, sayım da düşer. Veritabanının kendisi
   sayılmaz. Diskteki gerçekle saatlik mutabakat: sunucu/bolumler/okul-disk.js. */

const { sorgu, tek, calistir } = require('../baglanti');

/* Bir okulun (o) dosya toplamları; her biri bayt. */
const TESLIM = '(SELECT COALESCE(sum(d.boyut), 0) FROM odev_dosyalari d JOIN odevler od ON od.id = d.odev_id ' +
  'WHERE od.okul_id = o.id)::bigint';
const EK = '(SELECT COALESCE(sum(e.boyut), 0) FROM ekler e WHERE e.okul_id = o.id AND NOT e.silindi)::bigint';
const FOTO = '(SELECT COALESCE(sum(f.boyut), 0) FROM okul_fotolari f WHERE f.okul_id = o.id)::bigint';

const satir = r => ({
  okulId: r.id,
  siniriMb: r.disk_siniri_mb === null || r.disk_siniri_mb === undefined ? null : Number(r.disk_siniri_mb),
  dagilim: { teslim: Number(r.teslim), ek: Number(r.ek), foto: Number(r.foto) },
  kullanilan: Number(r.teslim) + Number(r.ek) + Number(r.foto)
});

/* Tek okul: { okulId, siniriMb (null: varsayılan), dagilim, kullanilan } ya da null. */
async function okulun(okulId) {
  if (!okulId) return null;
  const r = await tek('SELECT o.id, o.disk_siniri_mb, ' + TESLIM + ' AS teslim, ' + EK + ' AS ek, ' + FOTO + ' AS foto ' +
    'FROM okullar o WHERE o.id = $1', [okulId]);
  return r ? satir(r) : null;
}

/* Bütün okullar (kapatılanlar dahil): okul kimliği -> aynı görünüm ve okulun
   durumu. Tek sorgu, her tablo bir kez gruplanır. */
async function hepsi() {
  const liste = await sorgu(
    'SELECT o.id, o.durum, o.disk_siniri_mb, COALESCE(t.n, 0)::bigint AS teslim, COALESCE(e.n, 0)::bigint AS ek, ' +
    '  COALESCE(f.n, 0)::bigint AS foto ' +
    'FROM okullar o ' +
    'LEFT JOIN (SELECT od.okul_id, sum(d.boyut) AS n FROM odev_dosyalari d JOIN odevler od ON od.id = d.odev_id ' +
    '  GROUP BY od.okul_id) t ON t.okul_id = o.id ' +
    'LEFT JOIN (SELECT okul_id, sum(boyut) AS n FROM ekler WHERE NOT silindi AND okul_id IS NOT NULL GROUP BY okul_id) e ' +
    '  ON e.okul_id = o.id ' +
    'LEFT JOIN (SELECT okul_id, sum(boyut) AS n FROM okul_fotolari GROUP BY okul_id) f ON f.okul_id = o.id');
  return new Map(liste.map(r => [r.id, Object.assign(satir(r), { durum: r.durum })]));
}

/* Veritabanının diskteki boyutu (bayt; yaklaşık, sınıra sayılmaz). */
async function veritabaniBoyutu() {
  return Number((await tek('SELECT pg_database_size(current_database())::bigint AS n')).n);
}

/* Diskteki dosyalarla karşılaştırma için kayıtlar: kimlik -> boyut. */
async function kayitlar() {
  const [teslim, ek, foto] = await Promise.all([
    sorgu('SELECT id, boyut FROM odev_dosyalari'),
    sorgu('SELECT id, boyut FROM ekler WHERE NOT silindi'),
    sorgu('SELECT id, boyut FROM okul_fotolari')
  ]);
  const harita = liste => new Map(liste.map(r => [r.id, Number(r.boyut)]));
  return { teslim: harita(teslim), ek: harita(ek), foto: harita(foto) };
}

/* ---------------- %80 ve "doldu" uyarısı (033 okul_dosya_uyarilari) ---------------- */

/* Bu seviyedeki (80 ya da 100) uyarı daha önce verilmediyse yazar ve true
   döner; verildiyse false (bildirim bir kez gider). Aynı anda gelen iki
   yükleme ikisi birden bildirim göndermez. */
async function uyariYaz(okulId, seviye) {
  return !!(await tek('INSERT INTO okul_dosya_uyarilari (okul_id, seviye) VALUES ($1, $2) ' +
    'ON CONFLICT (okul_id) DO UPDATE SET seviye = EXCLUDED.seviye, zaman = now() ' +
    'WHERE okul_dosya_uyarilari.seviye < EXCLUDED.seviye RETURNING okul_id', [okulId, seviye]));
}

/* Kullanımı kendi sınırının orani'nın (0,7) altına inen okulların uyarısı
   silinir: alan yeniden dolarsa uyarı yeniden gider. varsayilanMb: özel
   sınırı olmayan okulların sınırı. okulId verilirse yalnız o okul. */
async function uyarilariSifirla(varsayilanMb, oran, okulId) {
  await calistir('DELETE FROM okul_dosya_uyarilari u USING okullar o WHERE o.id = u.okul_id ' +
    "AND ($3 = '' OR o.id = $3) " +
    'AND ' + TESLIM + ' + ' + EK + ' + ' + FOTO + ' < $2::float8 * COALESCE(o.disk_siniri_mb, $1::int)::float8 * 1048576',
    [varsayilanMb, oran, okulId || '']);
}

module.exports = { okulun, hepsi, veritabaniBoyutu, kayitlar, uyariYaz, uyarilariSifirla };
