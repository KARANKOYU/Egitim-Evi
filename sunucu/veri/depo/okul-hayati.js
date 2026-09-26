'use strict';
/* Yemek listesi, servisler ve kulüpler. */

const { sorgu, tek, calistir, islem } = require('../baglanti');

/* ---------------- servisler ---------------- */

const SERVIS_ALANLARI =
  'SELECT s.id, s.okul_id, s.ad, s.plaka, s.sofor, s.sofor_tel, s.rehber, s.rehber_tel, s.sabah, s.aksam, s.guzergah, ' +
  '       s.sofor_id, (SELECT ad_soyad FROM kullanicilar WHERE id = s.sofor_id) AS sofor_hesap_adi, ' +
  '       (SELECT telefon FROM kullanicilar WHERE id = s.sofor_id) AS sofor_hesap_tel, ' +
  '       (SELECT count(*)::int FROM servis_ogrencileri so WHERE so.servis_id = s.id) AS ogrenci_sayisi ';

const okulunServisleri = okulId => sorgu(
  SERVIS_ALANLARI + 'FROM servisler s WHERE s.okul_id = $1 ORDER BY s.ad', [okulId]);

const servisBul = id => tek(SERVIS_ALANLARI + 'FROM servisler s WHERE s.id = $1', [id]);

const servisAdVarMi = async (okulId, ad, haricId) => !!(await tek(
  'SELECT 1 AS var FROM servisler WHERE okul_id = $1 AND lower(ad) = lower($2) AND id <> $3', [okulId, ad, haricId || '']));

const servisSil = (id, okulId) => calistir('DELETE FROM servisler WHERE id = $1 AND okul_id = $2', [id, okulId]);

/* Servisçinin servisleri. */
const soforunServisleri = soforId => sorgu(SERVIS_ALANLARI + 'FROM servisler s WHERE s.sofor_id = $1 ORDER BY s.ad', [soforId]);

/* Bir servisin öğrencileri, ev konumlarıyla (servisçi ekranı ve yaklaşma hesabı). */
const servisinOgrencileri = servisId => sorgu(
  'SELECT so.ogrenci_id, so.durak, k.ad_soyad AS ad, c.ad AS sinif, ek.enlem, ek.boylam ' +
  'FROM servis_ogrencileri so JOIN kullanicilar k ON k.id = so.ogrenci_id ' +
  'LEFT JOIN siniflar c ON c.id = k.sinif_id LEFT JOIN ogrenci_konumlari ek ON ek.ogrenci_id = so.ogrenci_id ' +
  'WHERE so.servis_id = $1', [servisId]);

/* ---------------- ev konumu ---------------- */
const evKonumu = ogrenciId => tek('SELECT ogrenci_id, enlem, boylam, guncelleme FROM ogrenci_konumlari WHERE ogrenci_id = $1', [ogrenciId]);
const evKonumuYaz = (ogrenciId, enlem, boylam, girenId) => calistir(
  'INSERT INTO ogrenci_konumlari (ogrenci_id, enlem, boylam, giren_id) VALUES ($1, $2, $3, $4) ' +
  'ON CONFLICT (ogrenci_id) DO UPDATE SET enlem = EXCLUDED.enlem, boylam = EXCLUDED.boylam, ' +
  'giren_id = EXCLUDED.giren_id, guncelleme = now()', [ogrenciId, enlem, boylam, girenId]);
const evKonumuSil = ogrenciId => calistir('DELETE FROM ogrenci_konumlari WHERE ogrenci_id = $1', [ogrenciId]);

/* ---------------- seferler ----------------
   Aracın yalnızca son konumu tutulur; geçmiş iz saklanmaz. */
const SEFER_ALANLARI = 'SELECT id, servis_id, sofor_id, yon, baslangic, bitis, son_enlem, son_boylam, son_dogruluk, son_konum ';
const acikSefer = servisId => tek(SEFER_ALANLARI + 'FROM servis_seferleri WHERE servis_id = $1 AND bitis IS NULL', [servisId]);
const seferBul = id => tek(SEFER_ALANLARI + 'FROM servis_seferleri WHERE id = $1', [id]);

/* ---------------- kulüpler ---------------- */

const KULUP_ALANLARI =
  'SELECT u.id, u.okul_id, u.ad, u.aciklama, u.danisman_id, d.ad_soyad AS danisman_adi, u.kontenjan, u.basvuru_acik, ' +
  '       u.gun_saat, (SELECT count(*)::int FROM kulup_uyeleri m WHERE m.kulup_id = u.id) AS uye_sayisi ' +
  'FROM kulupler u LEFT JOIN kullanicilar d ON d.id = u.danisman_id ';

const okulunKulupleri = okulId => sorgu(KULUP_ALANLARI + 'WHERE u.okul_id = $1 ORDER BY u.ad', [okulId]);
const kulupBul = id => tek(KULUP_ALANLARI + 'WHERE u.id = $1', [id]);

/* Öğrencilerin üye olduğu kulüpler: [{ ogrenci_id, kulup_id, ad, ... }] */
const ogrencilerinKulupleri = ogrenciIdler => sorgu(
  'SELECT m.ogrenci_id, u.id AS kulup_id, u.ad, u.gun_saat, d.ad_soyad AS danisman_adi ' +
  'FROM kulup_uyeleri m JOIN kulupler u ON u.id = m.kulup_id LEFT JOIN kullanicilar d ON d.id = u.danisman_id ' +
  'WHERE m.ogrenci_id = ANY($1::text[]) ORDER BY u.ad', [ogrenciIdler]);

const kulupUyeleri = kulupId => sorgu(
  'SELECT k.id, k.ad_soyad AS ad, c.ad AS sinif, m.tarih FROM kulup_uyeleri m ' +
  'JOIN kullanicilar k ON k.id = m.ogrenci_id LEFT JOIN siniflar c ON c.id = k.sinif_id WHERE m.kulup_id = $1', [kulupId]);

async function kulupKaydet(u, yeni) {
  const p = [u.id, u.okulId, u.ad, u.aciklama, u.danismanId || null, u.kontenjan || null, u.basvuruAcik, u.gunSaat];
  if (yeni) {
    return calistir('INSERT INTO kulupler (id, okul_id, ad, aciklama, danisman_id, kontenjan, basvuru_acik, gun_saat) ' +
      'VALUES ($1, $2, $3, $4, $5, $6, $7, $8) ON CONFLICT (okul_id, ad) DO NOTHING', p);
  }
  return calistir('UPDATE kulupler SET ad = $3, aciklama = $4, danisman_id = $5, kontenjan = $6, basvuru_acik = $7, gun_saat = $8 ' +
    'WHERE id = $1 AND okul_id = $2', p);
}

const kulupAdVarMi = async (okulId, ad, haricId) => !!(await tek(
  'SELECT 1 AS var FROM kulupler WHERE okul_id = $1 AND lower(ad) = lower($2) AND id <> $3', [okulId, ad, haricId || '']));

const kulupSil = (id, okulId) => calistir('DELETE FROM kulupler WHERE id = $1 AND okul_id = $2', [id, okulId]);

/* Üye ekler. Kulüp satırı kilitlenir; kontenjan, okul ve rol aynı işlemde
   denetlenir. sadeceAcikken: öğrenci kendisi katılıyorsa başvuru açık olmalı.
   Dönen: 'tamam' | 'zaten' | 'dolu' | 'kapali' | 'yok' */
async function uyeEkle(kulupId, ogrenciId, sadeceAcikken) {
  return islem(async () => {
    const u = await tek('SELECT id, okul_id, kontenjan, basvuru_acik FROM kulupler WHERE id = $1 FOR UPDATE', [kulupId]);
    if (!u) return 'yok';
    const ogr = await tek("SELECT id FROM kullanicilar WHERE id = $1 AND okul_id = $2 AND rol = 'student'", [ogrenciId, u.okul_id]);
    if (!ogr) return 'yok';
    if (await tek('SELECT 1 AS var FROM kulup_uyeleri WHERE kulup_id = $1 AND ogrenci_id = $2', [kulupId, ogrenciId])) return 'zaten';
    if (sadeceAcikken && !u.basvuru_acik) return 'kapali';
    if (u.kontenjan) {
      const n = (await tek('SELECT count(*)::int AS n FROM kulup_uyeleri WHERE kulup_id = $1', [kulupId])).n;
      if (n >= u.kontenjan) return 'dolu';
    }
    await calistir('INSERT INTO kulup_uyeleri (kulup_id, ogrenci_id) VALUES ($1, $2)', [kulupId, ogrenciId]);
    return 'tamam';
  });
}

/* Üyelikten çıkarır. sadeceAcikken: öğrenci kendisi ayrılıyorsa başvuru açık olmalı. */
const uyeCikar = (kulupId, ogrenciId, sadeceAcikken) => calistir(
  'DELETE FROM kulup_uyeleri m USING kulupler u WHERE m.kulup_id = u.id AND m.kulup_id = $1 AND m.ogrenci_id = $2 ' +
  'AND (NOT $3 OR u.basvuru_acik)', [kulupId, ogrenciId, !!sadeceAcikken]);

module.exports = {
  yemekler, yemekYaz,
  okulunServisleri, servisBul, servisOgrencileri, ogrencilerinServisi, servisKaydet, servisAdVarMi, servisSil,
  servisOgrenciYaz, servisOgrenciCikar, servisSoforYaz, soforunServisleri, servisinOgrencileri,
  evKonumu, evKonumuYaz, evKonumuSil, acikSefer, seferBul, seferBaslat, seferBitir, seferKonumYaz,
  seferBildirimiIsaretle, seferTemizle,
  okulunKulupleri, kulupBul, ogrencilerinKulupleri, kulupUyeleri, kulupKaydet, kulupAdVarMi, kulupSil, uyeEkle, uyeCikar
};
