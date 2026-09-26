'use strict';
/* Telefon bildirimi (Web Push) abonelikleri. */

const { sorgu, tek, calistir } = require('../baglanti');

/* Abonelik yazılır; aynı cihaz (endpoint) başka hesaba geçtiyse yeni hesaba taşınır. */
const aboneYaz = (id, kullaniciId, endpoint, p256dh, auth) => calistir(
  'INSERT INTO push_abonelikleri (id, kullanici_id, endpoint, p256dh, auth) VALUES ($1, $2, $3, $4, $5) ' +
  'ON CONFLICT (endpoint) DO UPDATE SET kullanici_id = EXCLUDED.kullanici_id, p256dh = EXCLUDED.p256dh, ' +
  'auth = EXCLUDED.auth, olusturma = now()', [id, kullaniciId, endpoint, p256dh, auth]);

/* Kişinin en fazla n aboneliği kalır (eskiler silinir). */
const fazlasiniSil = (kullaniciId, n) => calistir(
  'DELETE FROM push_abonelikleri WHERE kullanici_id = $1 AND id NOT IN ' +
  '(SELECT id FROM push_abonelikleri WHERE kullanici_id = $1 ORDER BY olusturma DESC LIMIT $2)', [kullaniciId, n]);

const aboneSil = (endpoint, kullaniciId) => calistir(
  'DELETE FROM push_abonelikleri WHERE endpoint = $1 AND kullanici_id = $2', [endpoint, kullaniciId]);

const gecersizSil = id => calistir('DELETE FROM push_abonelikleri WHERE id = $1', [id]);
const basariYaz = id => calistir('UPDATE push_abonelikleri SET son_basari = now() WHERE id = $1', [id]);

/* Bildirim alıcılarının abonelikleri. Abonelik kişiye (yetişkin hesabına)
   aittir; alıcı bir okul rolü satırıysa (öğretmen@okul) bağlı olduğu
   hesabın cihazlarına gider. Bağlantı alıcının okul adresiyle kurulsun diye
   okulun kısa adı da gelir. alici: bildirimin yazıldığı kullanıcı. */
const abonelikler = kullaniciIdler => sorgu(
  'SELECT a.id, k.id AS alici, a.endpoint, a.p256dh, a.auth, o.kisa_ad ' +
  'FROM kullanicilar k JOIN push_abonelikleri a ON a.kullanici_id = coalesce(k.ana_hesap_id, k.id) ' +
  "LEFT JOIN okullar o ON o.id = k.okul_id WHERE k.id = ANY($1::text[]) AND k.durum = 'approved'",
  [kullaniciIdler]);

const kisiAbonesiMi = async (kullaniciId, endpoint) => !!(await tek(
  'SELECT 1 AS var FROM push_abonelikleri WHERE kullanici_id = $1 AND endpoint = $2', [kullaniciId, endpoint]));

module.exports = { aboneYaz, fazlasiniSil, aboneSil, gecersizSil, basariYaz, abonelikler, kisiAbonesiMi };
