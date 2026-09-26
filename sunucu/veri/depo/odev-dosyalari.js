'use strict';
/* Ödev teslim dosyalarının bilgisi (dosyanın kendisi diskte). */

const { sorgu, tek, calistir, islem } = require('../baglanti');

const ALANLAR = 'SELECT d.id, d.odev_id, d.ogrenci_id, d.ad, d.boyut, d.crc32, d.sha256, d.yuklenme ';

const bul = id => tek(ALANLAR + 'FROM odev_dosyalari d WHERE d.id = $1', [id]);

/* Bir ödevin dosyaları; ogrenciId verilirse yalnızca onunkiler. */
const odevin = (odevId, ogrenciId) => sorgu(
  ALANLAR + ', k.ad_soyad AS ogrenci_adi FROM odev_dosyalari d JOIN kullanicilar k ON k.id = d.ogrenci_id ' +
  "WHERE d.odev_id = $1 AND ($2 = '' OR d.ogrenci_id = $2) ORDER BY k.ad_soyad, d.yuklenme",
  [odevId, ogrenciId || '']);

/* Okulun diskte tuttuğu toplam (okul kotası için). */
async function okulToplami(okulId) {
  return (await tek('SELECT COALESCE(sum(d.boyut), 0)::bigint AS n FROM odev_dosyalari d ' +
    'JOIN odevler o ON o.id = d.odev_id WHERE o.okul_id = $1', [okulId])).n;
}

/* Dosya kaydı: öğrencinin ödev satırı kilitlenir, dosya sayısı ve toplam
   boyut aynı işlemde denetlenir (aynı anda gelen iki yükleme sınırı aşamaz).
   Dönen: 'tamam' | 'yok' (öğrenci ödevde değil) | 'sayi' | 'boyut' */
async function ekle(d, sinir) {
  return islem(async () => {
    const satir = await tek('SELECT 1 AS var FROM odev_ogrencileri WHERE odev_id = $1 AND ogrenci_id = $2 FOR UPDATE',
      [d.odevId, d.ogrenciId]);
    if (!satir) return 'yok';
    const t = await tek('SELECT count(*)::int AS adet, COALESCE(sum(boyut), 0)::bigint AS toplam FROM odev_dosyalari ' +
      'WHERE odev_id = $1 AND ogrenci_id = $2', [d.odevId, d.ogrenciId]);
    if (t.adet >= sinir.adet) return 'sayi';
    if (Number(t.toplam) + d.boyut > sinir.toplam) return 'boyut';
    await calistir('INSERT INTO odev_dosyalari (id, odev_id, ogrenci_id, ad, boyut, crc32, sha256) VALUES ($1, $2, $3, $4, $5, $6, $7)',
      [d.id, d.odevId, d.ogrenciId, d.ad, d.boyut, d.crc32, d.sha256]);
    return 'tamam';
  });
}

const sil = id => calistir('DELETE FROM odev_dosyalari WHERE id = $1', [id]);

/* Diskteki dosyalardan hangileri hâlâ kayıtlı (artık temizliği için). */
async function kayitlilar(idler) {
  if (!idler.length) return new Set();
  return new Set((await sorgu('SELECT id FROM odev_dosyalari WHERE id = ANY($1::text[])', [idler])).map(r => r.id));
}

/* Saklama süresi dolan teslim dosyalarının kaydı silinir; dönen kimliklerin
   dosyasını çağıran siler. */
async function eskileriSil(gun) {
  return (await sorgu("DELETE FROM odev_dosyalari WHERE yuklenme < now() - make_interval(days => $1) RETURNING id", [gun]))
    .map(r => r.id);
}

module.exports = { bul, odevin, okulToplami, ekle, sil, kayitlilar, eskileriSil };
