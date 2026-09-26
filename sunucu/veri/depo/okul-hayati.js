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

