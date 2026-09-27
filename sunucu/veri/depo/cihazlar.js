'use strict';
/* Telefon uygulamasının cihaz anahtarları (şema 028). Anahtarın kendisi
   değil SHA-256 özeti saklanır. Anahtar yalnız bildirim yoklamaya ve
   servisçinin sefer konumunu göndermeye yarar; hesaba giriş vermez.
   Sahibi yetişkinin ana hesabı (okul rolleri onun altında) ya da öğrenci /
   servisçi hesabıdır. Hesap başına en çok 5 anahtar: fazlası en eskiyi siler. */

const { sorgu, tek, calistir } = require('../baglanti');

const HESAP_BASINA = 5;

const cihaz = r => r && ({
  id: r.id, kullaniciId: r.kullanici_id, ad: r.ad, platform: r.platform, surum: r.surum,
  olusturma: r.olusturma, sonGorulme: r.son_gorulme, sonBildirim: r.son_bildirim
});

async function ekle(c) {
  await calistir('INSERT INTO cihaz_anahtarlari (id, kullanici_id, anahtar_ozeti, ad, platform, surum) VALUES ($1, $2, $3, $4, $5, $6)',
    [c.id, c.kullaniciId, c.ozet, c.ad, c.platform, c.surum]);
  await calistir('DELETE FROM cihaz_anahtarlari WHERE kullanici_id = $1 AND id NOT IN ' +
    '(SELECT id FROM cihaz_anahtarlari WHERE kullanici_id = $1 ORDER BY olusturma DESC, id DESC LIMIT $2)', [c.kullaniciId, HESAP_BASINA]);
}

const ozetle = async ozet => cihaz(await tek('SELECT * FROM cihaz_anahtarlari WHERE anahtar_ozeti = $1', [ozet]));
const goruldu = id => calistir('UPDATE cihaz_anahtarlari SET son_gorulme = now() WHERE id = $1', [id]);
const sil = id => calistir('DELETE FROM cihaz_anahtarlari WHERE id = $1', [id]);
const imlecYaz = (id, imlec) => calistir('UPDATE cihaz_anahtarlari SET son_bildirim = $2 WHERE id = $1', [id, imlec]);

/* Sahibin anahtarını siler (kimliği ya da özetiyle); başkasınınkine dokunmaz. */
const sahibininSil = (kullaniciId, id, ozet) => calistir(
  'DELETE FROM cihaz_anahtarlari WHERE kullanici_id = $1 AND (id = $2 OR anahtar_ozeti = $3)', [kullaniciId, id || '', ozet || '']);

const listesi = async kullaniciId => (await sorgu(
  'SELECT * FROM cihaz_anahtarlari WHERE kullanici_id = $1 ORDER BY olusturma DESC', [kullaniciId])).map(cihaz);

/* Yetişkin hesabının (ve okul rolü satırlarının) ya da verilen kişilerin
   bütün anahtarları silinir: şifre değişince, okul şifreyi yenileyince. */
const hesabinkileriSil = kullaniciIdler => calistir(
  'DELETE FROM cihaz_anahtarlari WHERE kullanici_id IN ' +
  '(SELECT id FROM kullanicilar WHERE id = ANY($1::text[]) OR ana_hesap_id = ANY($1::text[]))', [kullaniciIdler]);

/* Anahtarın bildirim alıcıları: sahibi ve (yetişkinse) okul rolü satırları;
   yalnız onaylı olanlar (Web Push'taki kural). Bağlantı okul adresiyle
   kurulsun diye okulun kısa adı da gelir. */
const alicilar = anaId => sorgu(
  'SELECT k.id, o.kisa_ad FROM kullanicilar k LEFT JOIN okullar o ON o.id = k.okul_id ' +
  "WHERE (k.id = $1 OR k.ana_hesap_id = $1) AND k.durum = 'approved'", [anaId]);

/* İmleç: bildirimin zamanı (mikrosaniyeye kadar, UTC) ve kimliği. */
const IMLEC_ZAMANI = "to_char(olusturma AT TIME ZONE 'UTC', 'YYYY-MM-DD\"T\"HH24:MI:SS.US\"Z\"')";

/* Alıcıların en son bildiriminin imleci; hiç bildirim yoksa şimdiki an. */
async function sonImlec(aliciIdler) {
  const r = aliciIdler.length ? await tek(
    'SELECT ' + IMLEC_ZAMANI + ' AS zaman, id FROM bildirimler WHERE kullanici_id = ANY($1::text[]) ' +
    'ORDER BY olusturma DESC, id DESC LIMIT 1', [aliciIdler]) : null;
  if (r) return r;
  return tek("SELECT to_char(now() AT TIME ZONE 'UTC', 'YYYY-MM-DD\"T\"HH24:MI:SS.US\"Z\"') AS zaman, '' AS id");
}

/* (son, ust] aralığındaki okunmamış bildirimler, en yeniden en eskiye, en çok adet. */
const bildirimleri = (aliciIdler, son, ust, adet) => sorgu(
  'SELECT id, kullanici_id, metin, baglanti, olusturma FROM bildirimler ' +
  'WHERE kullanici_id = ANY($1::text[]) AND NOT okundu AND (olusturma, id) > ($2::timestamptz, $3::text) ' +
  'AND (olusturma, id) <= ($4::timestamptz, $5::text) ORDER BY olusturma DESC, id DESC LIMIT $6',
  [aliciIdler, son.zaman, son.id, ust.zaman, ust.id, adet]);

module.exports = {
  HESAP_BASINA, ekle, ozetle, goruldu, sil, imlecYaz, sahibininSil, listesi, hesabinkileriSil, alicilar, sonImlec, bildirimleri
};
