'use strict';
/* Oturumlar. Tarayıcıya verilen anahtarın kendisi değil SHA-256 özeti
   saklanır: veritabanı sızsa bile açık oturumlar kullanılamaz. */

const crypto = require('crypto');
const { sorgu, tek, calistir } = require('../baglanti');

const OTURUM_OMRU_GUN = 7;

const ozet = anahtar => crypto.createHash('sha256').update(String(anahtar)).digest('hex');

async function ac(anahtar, kullaniciId) {
  await sorgu('INSERT INTO oturumlar (anahtar_ozeti, kullanici_id) VALUES ($1, $2)', [ozet(anahtar), kullaniciId]);
}

/* Geçerli oturumun kullanıcı kimliği (süresi dolmuşsa null). */
async function kullaniciKimligi(anahtar) {
  if (!anahtar) return null;
  const r = await tek(
    'SELECT kullanici_id FROM oturumlar WHERE anahtar_ozeti = $1 ' +
    "AND olusturma > now() - make_interval(days => $2)", [ozet(anahtar), OTURUM_OMRU_GUN]);
  return r ? r.kullanici_id : null;
}

async function kapat(anahtar) {
  return calistir('DELETE FROM oturumlar WHERE anahtar_ozeti = $1', [ozet(anahtar)]);
}

/* Kişinin bütün oturumlarını kapatır (şifre değişince, hesap silinince). */
async function hepsiniKapat(kullaniciId) {
  return calistir('DELETE FROM oturumlar WHERE kullanici_id = $1', [kullaniciId]);
}

/* Şifre değişince: bu oturum kalır, kişinin öbür oturumları kapanır. */
async function digerleriniKapat(kullaniciId, anahtar) {
  return calistir('DELETE FROM oturumlar WHERE kullanici_id = $1 AND anahtar_ozeti <> $2',
    [kullaniciId, ozet(anahtar || '')]);
}

/* Yetişkin hesabının ve okul rolü satırlarının bütün oturumları (şifre
   sıfırlanınca). haricAnahtar verilirse o oturum kalır (şifre değiştiren kişi). */
async function hesabinOturumlariniKapat(anaId, haricAnahtar) {
  return calistir(
    'DELETE FROM oturumlar WHERE kullanici_id IN (SELECT id FROM kullanicilar WHERE id = $1 OR ana_hesap_id = $1) ' +
    'AND anahtar_ozeti <> $2', [anaId, ozet(haricAnahtar || '')]);
}

/* Süresi dolanları ve üst sınırı aşanları (en eskiler) siler. */
async function temizle(ustSinir) {
  const eski = await calistir("DELETE FROM oturumlar WHERE olusturma <= now() - make_interval(days => $1)",
    [OTURUM_OMRU_GUN]);
  const fazla = await calistir(
    'DELETE FROM oturumlar WHERE anahtar_ozeti IN (' +
    '  SELECT anahtar_ozeti FROM oturumlar ORDER BY olusturma DESC OFFSET $1)', [ustSinir]);
  return eski + fazla;
}

module.exports = { OTURUM_OMRU_GUN, ozet, ac, kullaniciKimligi, kapat, hepsiniKapat, digerleriniKapat,
  hesabinOturumlariniKapat, temizle };
