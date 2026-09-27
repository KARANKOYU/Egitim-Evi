'use strict';
/* Oturumlar. Tarayıcıya verilen anahtarın kendisi değil SHA-256 özeti
   saklanır: veritabanı sızsa bile açık oturumlar kullanılamaz.

   Tarayıcıdaki oturum 7 gün, telefon uygulamasından açılan oturum
   (girişte uygulama: true) 30 gün geçerlidir; ikisi de mutlak süredir
   (kullandıkça uzamaz). Portal değişince açılan yeni oturum eskisinin türünü
   ve açılış anını devralır: portal değiştirerek süre uzatılamaz. Şifre
   değişince, çıkışta ve hesap silinince ikisi de kapanır. Şifre değişince
   telefonun cihaz anahtarları da silinir. */

const crypto = require('crypto');
const { sorgu, tek, calistir } = require('../baglanti');

const OTURUM_OMRU_GUN = 7;
const UYGULAMA_OMRU_GUN = 30;

const ozet = anahtar => crypto.createHash('sha256').update(String(anahtar)).digest('hex');

/* olusturma verilirse (portal değişimi) yeni oturum o andan sayılır. */
async function ac(anahtar, kullaniciId, uygulama, olusturma) {
  await sorgu('INSERT INTO oturumlar (anahtar_ozeti, kullanici_id, uygulama, olusturma) VALUES ($1, $2, $3, coalesce($4::timestamptz, now()))',
    [ozet(anahtar), kullaniciId, !!uygulama, olusturma || null]);
}

/* Geçerli oturumun kullanıcı kimliği (süresi dolmuşsa null). */
async function kullaniciKimligi(anahtar) {
  if (!anahtar) return null;
  const r = await tek(
    'SELECT kullanici_id FROM oturumlar WHERE anahtar_ozeti = $1 ' +
    'AND olusturma > now() - make_interval(days => CASE WHEN uygulama THEN $3::int ELSE $2::int END)',
    [ozet(anahtar), OTURUM_OMRU_GUN, UYGULAMA_OMRU_GUN]);
  return r ? r.kullanici_id : null;
}

/* Oturumun türü ve açılış anı: { uygulama, olusturma } ya da null. Portal
   değişince yeni oturum bunları devralır (telefon oturumu telefon oturumu
   kalır, süre baştan başlamaz). */
async function oturumBilgisi(anahtar) {
  if (!anahtar) return null;
  const r = await tek('SELECT uygulama, olusturma FROM oturumlar WHERE anahtar_ozeti = $1', [ozet(anahtar)]);
  return r ? { uygulama: !!r.uygulama, olusturma: r.olusturma } : null;
}

/* Bakım ve testler için: oturumun açılış anını gün kadar geriye çeker
   (süre dolumu denenir). */
const geriTarihle = (anahtar, gun) => calistir(
  'UPDATE oturumlar SET olusturma = olusturma - make_interval(days => $2::int) WHERE anahtar_ozeti = $1', [ozet(anahtar), gun]);

async function kapat(anahtar) {
  return calistir('DELETE FROM oturumlar WHERE anahtar_ozeti = $1', [ozet(anahtar)]);
}

/* Kişinin bütün oturumlarını kapatır (şifre değişince, hesap silinince);
   telefonun cihaz anahtarları da silinir. */
async function hepsiniKapat(kullaniciId) {
  await calistir('DELETE FROM cihaz_anahtarlari WHERE kullanici_id = $1', [kullaniciId]);
  return calistir('DELETE FROM oturumlar WHERE kullanici_id = $1', [kullaniciId]);
}

/* Şifre değişince: bu oturum kalır, kişinin öbür oturumları kapanır. */
async function digerleriniKapat(kullaniciId, anahtar) {
  return calistir('DELETE FROM oturumlar WHERE kullanici_id = $1 AND anahtar_ozeti <> $2',
    [kullaniciId, ozet(anahtar || '')]);
}

/* Yetişkin hesabının ve okul rolü satırlarının bütün oturumları (şifre
   sıfırlanınca). haricAnahtar verilirse o oturum kalır (şifre değiştiren kişi).
   Telefonların cihaz anahtarları hep silinir: şifreyi bilip anahtar almış
   biri bildirimleri okumaya devam etmesin (uygulama yeniden anahtar alır). */
async function hesabinOturumlariniKapat(anaId, haricAnahtar) {
  await calistir('DELETE FROM cihaz_anahtarlari WHERE kullanici_id IN ' +
    '(SELECT id FROM kullanicilar WHERE id = $1 OR ana_hesap_id = $1)', [anaId]);
  return calistir(
    'DELETE FROM oturumlar WHERE kullanici_id IN (SELECT id FROM kullanicilar WHERE id = $1 OR ana_hesap_id = $1) ' +
    'AND anahtar_ozeti <> $2', [anaId, ozet(haricAnahtar || '')]);
}

/* Süresi dolanları ve üst sınırı aşanları (en eskiler) siler. */
async function temizle(ustSinir) {
  const eski = await calistir(
    'DELETE FROM oturumlar WHERE olusturma <= now() - make_interval(days => CASE WHEN uygulama THEN $2::int ELSE $1::int END)',
    [OTURUM_OMRU_GUN, UYGULAMA_OMRU_GUN]);
  const fazla = await calistir(
    'DELETE FROM oturumlar WHERE anahtar_ozeti IN (' +
    '  SELECT anahtar_ozeti FROM oturumlar ORDER BY olusturma DESC OFFSET $1)', [ustSinir]);
  return eski + fazla;
}

module.exports = { OTURUM_OMRU_GUN, UYGULAMA_OMRU_GUN, ozet, ac, kullaniciKimligi, oturumBilgisi, geriTarihle, kapat, hepsiniKapat,
  digerleriniKapat, hesabinOturumlariniKapat, temizle };
