'use strict';
/* Etütler: etutler + etut_ogrencileri + etut_yoklamalari (013 şema dosyası).

   Bir etüt nesnesi uygulamada şöyle görünür:
     { id, schoolId, ad, gun (1 pazartesi ... 7 pazar), baslangic 'SS:DD',
       bitis 'SS:DD', yer, ogretmenId, ogretmenAdi, ogrenciSayisi } */

const { sorgu, tek, calistir, islem, tr } = require('../baglanti');

const SEC =
  'SELECT e.id, e.okul_id, e.ad, e.gun, to_char(e.baslangic, \'HH24:MI\') AS baslangic, ' +
  '       to_char(e.bitis, \'HH24:MI\') AS bitis, e.yer, e.ogretmen_id, k.ad_soyad AS ogretmen_adi, ' +
  '       (SELECT count(*)::int FROM etut_ogrencileri eo WHERE eo.etut_id = e.id) AS ogrenci_sayisi ' +
  'FROM etutler e LEFT JOIN kullanicilar k ON k.id = e.ogretmen_id ';
const SIRA = ' ORDER BY e.gun, e.baslangic, e.ad';

function etut(r) {
  if (!r) return null;
  return {
    id: r.id, schoolId: r.okul_id, ad: r.ad, gun: r.gun, baslangic: r.baslangic, bitis: r.bitis,
    yer: r.yer || '', ogretmenId: r.ogretmen_id || '', ogretmenAdi: r.ogretmen_adi || '',
    ogrenciSayisi: r.ogrenci_sayisi || 0
  };
}

const bul = async id => id ? etut(await tek(SEC + 'WHERE e.id = $1', [id])) : null;
const okulun = async okulId => (await sorgu(SEC + 'WHERE e.okul_id = $1' + SIRA, [okulId])).map(etut);
const ogretmeninki = async ogretmenId => (await sorgu(SEC + 'WHERE e.ogretmen_id = $1' + SIRA, [ogretmenId])).map(etut);
const ogrencininki = async ogrenciId => (await sorgu(SEC +
  'WHERE e.id IN (SELECT etut_id FROM etut_ogrencileri WHERE ogrenci_id = $1)' + SIRA, [ogrenciId])).map(etut);

async function ekle(e) {
  await calistir(
    'INSERT INTO etutler (id, okul_id, ad, gun, baslangic, bitis, yer, ogretmen_id, olusturma) ' +
    'VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)',
    [e.id, e.schoolId, e.ad, e.gun, e.baslangic, e.bitis, e.yer || '', e.ogretmenId || null, e.createdAt]);
  return bul(e.id);
}

async function guncelle(e) {
  await calistir(
    'UPDATE etutler SET ad = $2, gun = $3, baslangic = $4, bitis = $5, yer = $6, ogretmen_id = $7 WHERE id = $1',
    [e.id, e.ad, e.gun, e.baslangic, e.bitis, e.yer || '', e.ogretmenId || null]);
  return bul(e.id);
}

const sil = id => calistir('DELETE FROM etutler WHERE id = $1', [id]);

/* ---------------- öğrenciler ---------------- */

/* Etüdün öğrencileri: ad ve sınıfıyla, ada göre. */
const ogrencileri = etutId => sorgu(
  'SELECT k.id, k.ad_soyad AS ad, c.ad AS sinif FROM etut_ogrencileri eo ' +
  'JOIN kullanicilar k ON k.id = eo.ogrenci_id LEFT JOIN siniflar c ON c.id = k.sinif_id ' +
  'WHERE eo.etut_id = $1 ORDER BY k.ad_soyad' + tr(), [etutId]);

/* Öğrenci listesini baştan yazar (tek işlemde). */
async function ogrencileriYaz(etutId, ogrenciIdler) {
  await islem(async () => {
    await calistir('DELETE FROM etut_ogrencileri WHERE etut_id = $1', [etutId]);
    if (ogrenciIdler.length) {
      await calistir(
        'INSERT INTO etut_ogrencileri (etut_id, ogrenci_id) SELECT $1, unnest($2::text[]) ON CONFLICT DO NOTHING',
        [etutId, ogrenciIdler]);
    }
  });
}

const ogrencisiMi = async (etutId, ogrenciId) =>
  !!(await tek('SELECT 1 FROM etut_ogrencileri WHERE etut_id = $1 AND ogrenci_id = $2', [etutId, ogrenciId]));

/* ---------------- yoklama ---------------- */

/* Bir günün yoklaması: Map(ogrenciId -> durum). */
async function yoklamasi(etutId, tarih) {
  const satirlar = await sorgu('SELECT ogrenci_id, durum FROM etut_yoklamalari WHERE etut_id = $1 AND tarih = $2',
    [etutId, tarih]);
  return new Map(satirlar.map(s => [s.ogrenci_id, s.durum]));
}

/* Yoklamayı yazar; durumu DEĞİŞEN öğrencilerin listesini döndürür (bildirim için).
   kayitlar: [{ ogrenciId, durum }] */
async function yoklamaYaz(etutId, tarih, kayitlar, alanId) {
  const degisen = [];
  await islem(async () => {
    const onceki = await yoklamasi(etutId, tarih);
    for (const k of kayitlar) {
      if (onceki.get(k.ogrenciId) === k.durum) continue;
      await calistir(
        'INSERT INTO etut_yoklamalari (etut_id, tarih, ogrenci_id, durum, alan_id, guncelleme) ' +
        'VALUES ($1, $2, $3, $4, $5, now()) ON CONFLICT (etut_id, tarih, ogrenci_id) ' +
        'DO UPDATE SET durum = EXCLUDED.durum, alan_id = EXCLUDED.alan_id, guncelleme = now()',
        [etutId, tarih, k.ogrenciId, k.durum, alanId]);
      degisen.push(k);
    }
  });
  return degisen;
}

/* Öğrencinin son yoklamaları (etüt adıyla), yeniden eskiye. */
const ogrenciYoklamalari = (ogrenciId, sinir, okulId) => sorgu(
  'SELECT y.etut_id, e.ad AS etut_adi, to_char(y.tarih, \'YYYY-MM-DD\') AS tarih, y.durum ' +
  'FROM etut_yoklamalari y JOIN etutler e ON e.id = y.etut_id ' +
  'WHERE y.ogrenci_id = $1 AND ($3::text IS NULL OR e.okul_id = $3) ORDER BY y.tarih DESC, e.ad LIMIT $2',
  [ogrenciId, sinir || 60, okulId || null]);

module.exports = {
  bul, okulun, ogretmeninki, ogrencininki, ekle, guncelle, sil,
  ogrencileri, ogrencileriYaz, ogrencisiMi, yoklamasi, yoklamaYaz, ogrenciYoklamalari
};
