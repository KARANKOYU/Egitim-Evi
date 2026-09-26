'use strict';
/* Anketler: anketler + anket_secenekleri + anket_hedefleri + anket_oylari.
   Oy verme kuralları (açık mı, hedefte mi, seçenek bu ankete mi ait) tek
   sorguda uygulanır; araya başka bir istek girip durumu değiştiremez. */

const { sorgu, tek, calistir, islem } = require('../baglanti');

/* Her listede aynı alanlar: açık mı, kaç kişiye gitti, kaç oy var, seçenekler. */
const ALANLAR =
  'SELECT a.id, a.okul_id, a.olusturan_id, a.soru, a.aciklama, a.hedef_ozet, a.gizli, a.bitis, a.kapandi, ' +
  '       a.olusturma, g.ad_soyad AS olusturan_adi, (a.kapandi IS NULL AND a.bitis > now()) AS acik, ' +
  '       (SELECT count(*)::int FROM anket_hedefleri h WHERE h.anket_id = a.id) AS hedef_sayisi, ' +
  '       (SELECT count(*)::int FROM anket_oylari o WHERE o.anket_id = a.id) AS oy_sayisi, ' +
  "       COALESCE((SELECT json_agg(json_build_object('id', s.id, 'metin', s.metin) ORDER BY s.sira) " +
  "                 FROM anket_secenekleri s WHERE s.anket_id = a.id), '[]') AS secenekler ";

/* Anket, seçenekleri ve hedef listesi tek işlemde. */
async function ekle(a) {
  await islem(async () => {
    await sorgu('INSERT INTO anketler (id, okul_id, olusturan_id, soru, aciklama, hedef_ozet, gizli, bitis) ' +
      'VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
      [a.id, a.okulId, a.olusturanId, a.soru, a.aciklama, a.hedefOzet, a.gizli, a.bitis]);
    await sorgu('INSERT INTO anket_secenekleri (id, anket_id, sira, metin) ' +
      'SELECT x.id, $1, x.sira, x.metin FROM unnest($2::text[], $3::int[], $4::text[]) AS x(id, sira, metin)',
      [a.id, a.secenekler.map(s => s.id), a.secenekler.map((s, i) => i + 1), a.secenekler.map(s => s.metin)]);
    await sorgu('INSERT INTO anket_hedefleri (anket_id, kullanici_id) ' +
      'SELECT $1, k FROM unnest($2::text[]) AS k ON CONFLICT DO NOTHING', [a.id, a.hedefler]);
  });
}

const bul = id => tek(ALANLAR + 'FROM anketler a LEFT JOIN kullanicilar g ON g.id = a.olusturan_id WHERE a.id = $1', [id]);

/* Kişiye açılmış anketler (hangi okuldan olursa olsun) ve onun oyu.
   Açıklar önce, sonra yakın bitiş; kapanmışlardan son 50. */
const kisiyeGelenler = kullaniciId => sorgu(
  ALANLAR + ', o.secenek_id AS benim_oyum ' +
  'FROM anket_hedefleri h JOIN anketler a ON a.id = h.anket_id ' +
  'LEFT JOIN kullanicilar g ON g.id = a.olusturan_id ' +
  'LEFT JOIN anket_oylari o ON o.anket_id = a.id AND o.kullanici_id = h.kullanici_id ' +
  'WHERE h.kullanici_id = $1 ' +
  'ORDER BY (a.kapandi IS NULL AND a.bitis > now()) DESC, a.bitis DESC LIMIT 80', [kullaniciId]);

/* Yönetilen anketler: kişinin açtıkları; müdür okulun bütün anketlerini görür. */
const yonetilenler = (kullaniciId, okulId, hepsi) => sorgu(
  ALANLAR + 'FROM anketler a LEFT JOIN kullanicilar g ON g.id = a.olusturan_id ' +
  'WHERE a.okul_id = $2 AND ($3 OR a.olusturan_id = $1) ORDER BY a.olusturma DESC LIMIT 100',
  [kullaniciId, okulId, !!hepsi]);

/* Seçenek başına oy sayısı, birden çok anket için tek sorguda:
   Map(anketId -> { secenekId: n }) */
async function sayimlar(anketIdler) {
  const h = new Map(anketIdler.map(id => [id, {}]));
  if (!anketIdler.length) return h;
  for (const r of await sorgu('SELECT anket_id, secenek_id, count(*)::int AS n FROM anket_oylari ' +
    'WHERE anket_id = ANY($1::text[]) GROUP BY anket_id, secenek_id', [anketIdler])) {
    h.get(r.anket_id)[r.secenek_id] = r.n;
  }
  return h;
}

const hedefteMi = async (anketId, kullaniciId) => !!(await tek(
  'SELECT 1 AS var FROM anket_hedefleri WHERE anket_id = $1 AND kullanici_id = $2', [anketId, kullaniciId]));

/* Hedefteki herkes: oy verdi mi, neyi seçti, ne zaman. Velinin bu okuldaki
   çocukları da gelir (hangi öğrencinin velisi olduğu anlaşılsın). */
const katilim = anketId => sorgu(
  'SELECT k.id, k.ad_soyad AS ad, k.rol, s.ad AS sinif, o.secenek_id, o.tarih, ' +
  '       COALESCE((SELECT json_agg(c.ad_soyad) FROM veli_baglari vb JOIN kullanicilar c ON c.id = vb.ogrenci_id ' +
  "                 WHERE vb.veli_id = k.id AND c.okul_id = a.okul_id), '[]') AS cocuklar " +
  'FROM anket_hedefleri h JOIN anketler a ON a.id = h.anket_id JOIN kullanicilar k ON k.id = h.kullanici_id ' +
  'LEFT JOIN siniflar s ON s.id = k.sinif_id ' +
  'LEFT JOIN anket_oylari o ON o.anket_id = h.anket_id AND o.kullanici_id = h.kullanici_id ' +
  'WHERE h.anket_id = $1', [anketId]);

/* Oy: yalnızca anket açıksa, kişi hedefteyse ve seçenek bu ankete aitse
   yazılır. Önceki oy varsa değişir. Dönen: yazılan satır sayısı (0 = reddedildi). */
const oyVer = (anketId, kullaniciId, secenekId) => calistir(
  'INSERT INTO anket_oylari (anket_id, kullanici_id, secenek_id) ' +
  'SELECT a.id, $2, $3 FROM anketler a ' +
  'WHERE a.id = $1 AND a.kapandi IS NULL AND a.bitis > now() ' +
  '  AND EXISTS (SELECT 1 FROM anket_hedefleri h WHERE h.anket_id = a.id AND h.kullanici_id = $2) ' +
  '  AND EXISTS (SELECT 1 FROM anket_secenekleri s WHERE s.anket_id = a.id AND s.id = $3) ' +
  'ON CONFLICT (anket_id, kullanici_id) DO UPDATE SET secenek_id = EXCLUDED.secenek_id, tarih = now()',
  [anketId, kullaniciId, secenekId]);

/* Oyunu geri çeker (anket açıkken). */
const oyGeriAl = (anketId, kullaniciId) => calistir(
  'DELETE FROM anket_oylari o USING anketler a WHERE o.anket_id = $1 AND o.kullanici_id = $2 ' +
  'AND a.id = o.anket_id AND a.kapandi IS NULL AND a.bitis > now()', [anketId, kullaniciId]);

const kapat = id => calistir('UPDATE anketler SET kapandi = now() WHERE id = $1 AND kapandi IS NULL AND bitis > now()', [id]);
const sil = id => calistir('DELETE FROM anketler WHERE id = $1', [id]);

module.exports = { ekle, bul, kisiyeGelenler, yonetilenler, sayimlar, hedefteMi, katilim, oyVer, oyGeriAl, kapat, sil };
