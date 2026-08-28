'use strict';
/* Okullar ve eğitim yılları. */

const { sorgu, tek, calistir, islem, tr } = require('../baglanti');
const e = require('../esleme');

/* ---------------- okullar ---------------- */
async function bul(id) {
  if (!id) return null;
  return e.okul(await tek('SELECT * FROM okullar WHERE id = $1', [id]));
}

async function ekle(s) {
  await sorgu('INSERT INTO okullar (id, meb_kodu, ad, il, ilce, tur, durum, olusturma, kisa_ad) ' +
    'VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)',
    [s.id, s.mebId || '', s.name, s.city, s.district || '', s.type || '', s.status, s.createdAt, s.kisaAd || null]);
}

async function durumYaz(id, durum) {
  await calistir('UPDATE okullar SET durum = $1 WHERE id = $2', [durum, id]);
}

/* Aynı okula ikinci başvuru var mı? (MEB koduyla ya da aynı ildeki aynı adla)
   Ad karşılaştırması Türkçe büyük/küçük harfe duyarsız, JS tarafında. */
async function cakisan(mebKodu, il, ad) {
  const adaylar = await sorgu(
    "SELECT * FROM okullar WHERE durum <> 'rejected' AND (($1 <> '' AND meb_kodu = $1) OR il = $2)",
    [mebKodu || '', il]);
  const kucuk = ad.toLocaleLowerCase('tr');
  const r = adaylar.find(s => (mebKodu && s.meb_kodu === mebKodu) || s.ad.toLocaleLowerCase('tr') === kucuk);
  return e.okul(r || null);
}

/* Kayıt formu: onaylı ve onaylı müdürü olan okullar. */
async function kayitIcin(il) {
  const satirlar = await sorgu(
    "SELECT o.* FROM okullar o WHERE o.durum = 'approved' " +
    "AND EXISTS (SELECT 1 FROM kullanicilar k WHERE k.okul_id = o.id AND k.rol = 'principal' AND k.durum = 'approved') " +
    "AND ($1 = '' OR o.il = $1) ORDER BY o.ad" + tr(), [il || '']);
  return satirlar.map(e.okul);
}

/* ---------------- okul adresi (kısa ad) ---------------- */

/* Adresten okul: yalnızca onaylı okul. */
async function kisaAdla(kisa) {
  if (!kisa) return null;
  return e.okul(await tek("SELECT * FROM okullar WHERE kisa_ad = $1 AND durum = 'approved'", [kisa]));
}

async function kisaAdVarMi(kisa, haricId) {
  return !!(await tek('SELECT 1 FROM okullar WHERE kisa_ad = $1 AND id <> $2', [kisa, haricId || '']));
}

/* Kısa ad yazılır; aynı anda başka okul aldıysa benzersizlik kuralı yakalar. */
const kisaAdYaz = (id, kisa) => calistir('UPDATE okullar SET kisa_ad = $2 WHERE id = $1', [id, kisa]);

const kisaAdsizlar = () => sorgu("SELECT id, ad, ilce FROM okullar WHERE kisa_ad IS NULL AND durum <> 'rejected' ORDER BY olusturma");

/* ---------------- eğitim yılları ---------------- */
async function yillari(okulId) {
  return (await sorgu('SELECT * FROM egitim_yillari WHERE okul_id = $1 ORDER BY ad DESC', [okulId])).map(e.yil);
}

async function yilBul(id) {
  if (!id) return null;
  return e.yil(await tek('SELECT * FROM egitim_yillari WHERE id = $1', [id]));
}

/* Yeni yıl; aktifse okulun diğer yılları pasife çekilir (tek aktif yıl kuralı). */
async function yilEkle(y) {
  await islem(async () => {
    if (y.aktif) await calistir('UPDATE egitim_yillari SET aktif = false WHERE okul_id = $1', [y.schoolId]);
    await sorgu('INSERT INTO egitim_yillari (id, okul_id, ad, baslangic, bitis, aktif, olusturma) ' +
      'VALUES ($1, $2, $3, $4, $5, $6, $7)', [y.id, y.schoolId, y.ad, y.bas, y.bit, !!y.aktif, y.createdAt]);
  });
}

async function yilAktifYap(okulId, id) {
  await islem(async () => {
    await calistir('UPDATE egitim_yillari SET aktif = false WHERE okul_id = $1', [okulId]);
    await calistir('UPDATE egitim_yillari SET aktif = true WHERE id = $1 AND okul_id = $2', [id, okulId]);
  });
}

module.exports = {
  bul, ekle, durumYaz, cakisan, kayitIcin, genelBakis,
  kisaAdla, kisaAdVarMi, kisaAdYaz, kisaAdsizlar, adresliOkullar, konumYaz,
  yillari, yilBul, yilEkle, yilAktifYap
};
