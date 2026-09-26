'use strict';
/* Roller: roller + rol_yetkileri + rol_yetki_kapsamlari.

   İki tür rol vardır (013 şema dosyası):
     'ogretmen'  okulun hazır Öğretmen rolü; okuldaki her öğretmen bu rolün
                 yetkilerine sahiptir. Okul başına bir tane, silinmez.
     'ozel'      müdürün tanımladığı rol (Müdür Yardımcısı, Etüt Sorumlusu...);
                 öğretmene tek tek verilir.

   Bir rol nesnesi uygulamada şöyle görünür:
     { id, schoolId, name, tur, permissions: ['odev.ver', ...],
       kapsam: { 'odev.ver': { dersler: ['Matematik'], siniflar: ['*'] } } } */

const { sorgu, islem, tr } = require('../baglanti');
const e = require('../esleme');

/* Verilen rol kimliklerini yetki ve kapsamlarıyla birlikte yükler: Map(id -> rol). */
async function haritasi(idler, kisiSayisiyla) {
  const harita = new Map();
  if (!idler.length) return harita;
  const satirlar = await sorgu(
    'SELECT r.*' +
    (kisiSayisiyla ? ', (SELECT count(*) FROM kullanicilar k WHERE k.ozel_rol_id = r.id) AS kisi_sayisi' : '') +
    ' FROM roller r WHERE r.id = ANY($1::text[])', [idler]);
  const yetkiler = await sorgu('SELECT rol_id, yetki FROM rol_yetkileri WHERE rol_id = ANY($1::text[]) ORDER BY yetki', [idler]);
  const kapsamlar = await sorgu(
    'SELECT rol_id, yetki, tur, deger FROM rol_yetki_kapsamlari WHERE rol_id = ANY($1::text[]) ORDER BY deger', [idler]);
  for (const r of satirlar) {
    harita.set(r.id, e.rol(r,
      yetkiler.filter(y => y.rol_id === r.id).map(y => y.yetki),
      kapsamlar.filter(k => k.rol_id === r.id)));
  }
  return harita;
}

async function bul(id) {
  if (!id) return null;
  return (await haritasi([id], true)).get(id) || null;
}

/* Okulun rolleri: önce hazır Öğretmen rolü, sonra özel roller ada göre. */
async function okulun(okulId) {
  const idler = (await sorgu("SELECT id FROM roller WHERE okul_id = $1 ORDER BY (tur = 'ogretmen') DESC, ad" + tr(),
    [okulId])).map(r => r.id);
  const harita = await haritasi(idler, true);
  return idler.map(id => harita.get(id));
}

/* Yetki ve kapsam satırlarını baştan yazar (işlem içinde çağrılır). */
async function yetkileriYaz(rolId, izinler, kapsam) {
  await sorgu('DELETE FROM rol_yetkileri WHERE rol_id = $1', [rolId]);   // kapsamlar da CASCADE ile gider
  for (const izin of izinler) {
    await sorgu('INSERT INTO rol_yetkileri (rol_id, yetki) VALUES ($1, $2)', [rolId, izin]);
    const k = kapsam && kapsam[izin];
    if (!k) continue;
    for (const d of new Set(k.dersler || [])) {
      await sorgu('INSERT INTO rol_yetki_kapsamlari (rol_id, yetki, tur, deger) VALUES ($1, $2, $3, $4)',
        [rolId, izin, 'ders', d]);
    }
    for (const s of new Set(k.siniflar || [])) {
      await sorgu('INSERT INTO rol_yetki_kapsamlari (rol_id, yetki, tur, deger) VALUES ($1, $2, $3, $4)',
        [rolId, izin, 'sinif', s]);
    }
  }
}

/* Okulların hazır Öğretmen rolünün yetkileri: Map(okulId -> ['odev.ver', ...]).
   Rolü henüz kurulmamış okul haritada yoktur (varsayılan yetkiler geçerli). */
async function ogretmenYetkileri(okulIdler) {
  const harita = new Map();
  if (!okulIdler.length) return harita;
  const satirlar = await sorgu(
    "SELECT r.okul_id, y.yetki FROM roller r LEFT JOIN rol_yetkileri y ON y.rol_id = r.id " +
    "WHERE r.tur = 'ogretmen' AND r.okul_id = ANY($1::text[])", [okulIdler]);
  for (const s of satirlar) {
    if (!harita.has(s.okul_id)) harita.set(s.okul_id, []);
    if (s.yetki) harita.get(s.okul_id).push(s.yetki);
  }
  return harita;
}

/* Okulun hazır Öğretmen rolü; yoksa verilen yetkilerle kurulur. */
async function ogretmenRolu(okulId, varsayilanYetkiler, yeniId, zaman) {
  const var_ = await sorgu("SELECT id FROM roller WHERE okul_id = $1 AND tur = 'ogretmen'", [okulId]);
  if (var_.length) return bul(var_[0].id);
  /* Okulun "Öğretmen" adlı özel bir rolü zaten olabilir (ad okul içinde tek):
     o zaman hazır rol "Öğretmen (hazır)" adıyla kurulur. Aynı anda iki istek
     gelirse ikincisi çakışmayı sessizce geçer. */
  for (const ad of ['Öğretmen', 'Öğretmen (hazır)']) {
    let kuruldu = false;
    await islem(async () => {
      const r = await sorgu(
        "INSERT INTO roller (id, okul_id, ad, tur, olusturma) VALUES ($1, $2, $3, 'ogretmen', $4) " +
        'ON CONFLICT DO NOTHING RETURNING id', [yeniId, okulId, ad, zaman]);
      if (r.length) { await yetkileriYaz(yeniId, varsayilanYetkiler, {}); kuruldu = true; }
    });
    const son = await sorgu("SELECT id FROM roller WHERE okul_id = $1 AND tur = 'ogretmen'", [okulId]);
    if (son.length) return bul(son[0].id);
    if (kuruldu) break;
  }
  throw new Error('Öğretmen rolü kurulamadı');
}

async function ekle(r) {
  await islem(async () => {
    await sorgu('INSERT INTO roller (id, okul_id, ad, olusturma) VALUES ($1, $2, $3, $4)',
      [r.id, r.schoolId, r.name, r.createdAt]);
    await yetkileriYaz(r.id, r.permissions || [], r.kapsam || {});
  });
  return bul(r.id);
}

async function guncelle(r) {
  await islem(async () => {
    await sorgu('UPDATE roller SET ad = $1 WHERE id = $2', [r.name, r.id]);
    await yetkileriYaz(r.id, r.permissions || [], r.kapsam || {});
  });
  return bul(r.id);
}

/* Rol silinince o role sahip kullanıcıların ozel_rol_id'si NULL olur (ON DELETE SET NULL). */
async function sil(id) {
  await sorgu('DELETE FROM roller WHERE id = $1', [id]);
}

module.exports = { haritasi, bul, okulun, ogretmenYetkileri, ogretmenRolu, ekle, guncelle, sil, yetkileriYaz };
