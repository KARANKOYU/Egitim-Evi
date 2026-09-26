'use strict';
/* Öğrencinin geçmiş okulları (021): nakilde eski okulun yılları. */

const { sorgu, calistir } = require('../baglanti');

const nesne = r => ({
  id: r.id, ogrenciId: r.ogrenci_id, okulId: r.okul_id, yilId: r.yil_id || '', okulAdi: r.okul_adi,
  yilAdi: r.yil_adi, sinifAdi: r.sinif_adi, ayrilis: r.ayrilis
});

/* Yeniden eskiye: son ayrılınan okul ve onun en yeni yılı önce. */
async function listesi(ogrenciId) {
  return (await sorgu('SELECT * FROM ogrenci_gecmisi WHERE ogrenci_id = $1 ORDER BY ayrilis DESC, yil_adi DESC',
    [ogrenciId])).map(nesne);
}

/* Aynı okul ve yıl ikinci kez yazılmaz (öğrenci geri dönüp yeniden ayrılabilir). */
async function ekle(g) {
  await calistir('INSERT INTO ogrenci_gecmisi (id, ogrenci_id, okul_id, yil_id, okul_adi, yil_adi, sinif_adi) ' +
    "VALUES ($1, $2, $3, $4, $5, $6, $7) ON CONFLICT (ogrenci_id, okul_id, COALESCE(yil_id, '')) DO UPDATE " +
    'SET sinif_adi = CASE WHEN EXCLUDED.sinif_adi <> \'\' THEN EXCLUDED.sinif_adi ELSE ogrenci_gecmisi.sinif_adi END, ayrilis = now()',
    [g.id, g.ogrenciId, g.okulId, g.yilId || null, g.okulAdi, g.yilAdi || '', g.sinifAdi || '']);
}

/* Nakilde öğrenci eski okulun etüt, kulüp ve servis listelerinden çıkar
   (yoklamaları ve notları o okulda kayıt olarak kalır). */
async function okuldanCikar(ogrenciId, okulId) {
  await calistir('DELETE FROM etut_ogrencileri WHERE ogrenci_id = $1 AND etut_id IN (SELECT id FROM etutler WHERE okul_id = $2)',
    [ogrenciId, okulId]);
  await calistir('DELETE FROM kulup_uyeleri WHERE ogrenci_id = $1 AND kulup_id IN (SELECT id FROM kulupler WHERE okul_id = $2)',
    [ogrenciId, okulId]);
  await calistir('DELETE FROM servis_ogrencileri WHERE ogrenci_id = $1 AND servis_id IN (SELECT id FROM servisler WHERE okul_id = $2)',
    [ogrenciId, okulId]);
  await calistir('DELETE FROM ogrenci_konumlari WHERE ogrenci_id = $1', [ogrenciId]);
}

/* Bütün satırlar (yedek için). */
const hepsi = async () => (await sorgu('SELECT * FROM ogrenci_gecmisi ORDER BY ogrenci_id, ayrilis')).map(nesne);

module.exports = { listesi, ekle, okuldanCikar, hepsi };
