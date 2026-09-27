'use strict';
/* Servis yoklaması (şema 028): günlük bindi / binmedi (sabah), geldi /
   gelmedi / indi (akşam); o günün seferinin başlama ve bitiş anı; veliye
   giden bildirimlerin tekilliği; servisçinin notları ve velinin "binmeyecek"
   işareti. Hepsi 30 gün sonra silinir (temizle). Tarih Türkiye günüdür
   ('YYYY-AA-GG'); çağıran taraf hesaplar. */

const { sorgu, tek, calistir } = require('../baglanti');

/* ---------------- yoklama ---------------- */
const YOKLAMA_ALANLARI = "SELECT to_char(tarih, 'YYYY-MM-DD') AS tarih, donem, ogrenci_id, servis_id, durum, bindi_zaman, indi_zaman, alan_id ";

/* Öğrencilerin o günkü o dönem yoklaması: Map(ogrenciId -> satır). */
async function yoklamalar(ogrenciIdler, tarih, donem) {
  const h = new Map();
  if (!ogrenciIdler.length) return h;
  const satirlar = await sorgu(YOKLAMA_ALANLARI + 'FROM servis_yoklamalari WHERE ogrenci_id = ANY($1::text[]) AND tarih = $2 AND donem = $3',
    [ogrenciIdler, tarih, donem]);
  for (const r of satirlar) h.set(r.ogrenci_id, r);
  return h;
}

const yoklamaBul = (tarih, donem, ogrenciId) => tek(YOKLAMA_ALANLARI +
  'FROM servis_yoklamalari WHERE tarih = $1 AND donem = $2 AND ogrenci_id = $3', [tarih, donem, ogrenciId]);

/* Tek öğrencinin işareti yazılır (varsa üzerine). y: { tarih, donem, ogrenciId, servisId, durum, bindiZaman, indiZaman, alanId } */
const yoklamaYaz = y => calistir(
  'INSERT INTO servis_yoklamalari (tarih, donem, ogrenci_id, servis_id, durum, bindi_zaman, indi_zaman, alan_id, guncelleme) ' +
  'VALUES ($1, $2, $3, $4, $5, $6, $7, $8, now()) ON CONFLICT (tarih, donem, ogrenci_id) DO UPDATE SET ' +
  'servis_id = EXCLUDED.servis_id, durum = EXCLUDED.durum, bindi_zaman = EXCLUDED.bindi_zaman, ' +
  'indi_zaman = EXCLUDED.indi_zaman, alan_id = EXCLUDED.alan_id, guncelleme = now()',
  [y.tarih, y.donem, y.ogrenciId, y.servisId, y.durum, y.bindiZaman || null, y.indiZaman || null, y.alanId || null]);

/* ---------------- günün seferi ---------------- */
const GUN_ALANLARI = 'SELECT servis_id, basladi, bitti FROM servis_gunleri ';

const gun = (servisId, tarih, donem) => tek(GUN_ALANLARI + 'WHERE servis_id = $1 AND tarih = $2 AND donem = $3',
  [servisId, tarih, donem]);

/* Birden çok servisin o günkü o dönemi: Map(servisId -> satır). */
async function gunler(servisIdler, tarih, donem) {
  const h = new Map();
  if (!servisIdler.length) return h;
  for (const r of await sorgu(GUN_ALANLARI + 'WHERE servis_id = ANY($1::text[]) AND tarih = $2 AND donem = $3',
    [servisIdler, tarih, donem])) h.set(r.servis_id, r);
  return h;
}

/* Sefer başladı (ilk kez başladıysa anı yazılır, sonrakiler değiştirmez).
   yenile: kayıtlı an bu dönemin aralığının dışında kaldıysa (saatler gün
   içinde değişti) yeniden başlatmada şimdiki an yazılır. */
const gunBasladi = (servisId, tarih, donem, yenile) => calistir(
  'INSERT INTO servis_gunleri (servis_id, tarih, donem, basladi) VALUES ($1, $2, $3, now()) ' +
  'ON CONFLICT (servis_id, tarih, donem) DO UPDATE SET basladi = CASE WHEN $4::boolean THEN now() ELSE coalesce(servis_gunleri.basladi, now()) END',
  [servisId, tarih, donem, !!yenile]);

/* Bakım ve testler için: günün "sefer başladı" anını dakika kadar geriye çeker. */
const gunuGeriTarihle = (servisId, tarih, donem, dakika) => calistir(
  'UPDATE servis_gunleri SET basladi = basladi - make_interval(mins => $4::int) WHERE servis_id = $1 AND tarih = $2 AND donem = $3',
  [servisId, tarih, donem, dakika]);

/* Sefer bitti. İlk kez bittiyse true (bildirim bir kez gitsin). */
const gunBitti = async (servisId, tarih, donem) => (await sorgu(
  'INSERT INTO servis_gunleri (servis_id, tarih, donem, bitti) VALUES ($1, $2, $3, now()) ' +
  'ON CONFLICT (servis_id, tarih, donem) DO UPDATE SET bitti = now() WHERE servis_gunleri.bitti IS NULL RETURNING bitti',
  [servisId, tarih, donem])).length > 0;

/* ---------------- bildirim tekilliği ---------------- */
/* Olay daha önce bildirilmediyse işaretler ve true döner. */
const olayIlkMi = async (tarih, donem, ogrenciId, olay) => (await sorgu(
  'INSERT INTO servis_olaylari (tarih, donem, ogrenci_id, olay) VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING RETURNING olay',
  [tarih, donem, ogrenciId, olay])).length > 0;

const olayVarMi = async (tarih, donem, ogrenciId, olay) => !!(await tek(
  'SELECT 1 AS var FROM servis_olaylari WHERE tarih = $1 AND donem = $2 AND ogrenci_id = $3 AND olay = $4',
  [tarih, donem, ogrenciId, olay]));

/* ---------------- servisçinin notları ---------------- */
const NOT_ALANLARI = "SELECT n.id, n.servis_id, n.ogrenci_id, to_char(n.tarih, 'YYYY-MM-DD') AS tarih, n.metin, n.yazan_id, n.olusturma, " +
  'k.ad_soyad AS ogrenci_adi FROM servis_notlari n LEFT JOIN kullanicilar k ON k.id = n.ogrenci_id ';

const notEkle = n => calistir(
  'INSERT INTO servis_notlari (id, servis_id, ogrenci_id, tarih, metin, yazan_id) VALUES ($1, $2, $3, $4, $5, $6)',
  [n.id, n.servisId, n.ogrenciId || null, n.tarih, n.metin, n.yazanId]);

const notBul = id => tek(NOT_ALANLARI + 'WHERE n.id = $1', [id]);
const notSil = id => calistir('DELETE FROM servis_notlari WHERE id = $1', [id]);

/* Servisin verilen günden sonraki (o gün dahil) notları. */
const servisinNotlari = (servisId, basTarih) => sorgu(NOT_ALANLARI +
  'WHERE n.servis_id = $1 AND n.tarih >= $2 ORDER BY n.tarih, n.olusturma', [servisId, basTarih]);

/* Öğrencilerin (kendi servislerinde) kendilerine ya da bütün servise yazılmış
   notları: [{ ...not, hedef_id }] (hedef_id: notun ilgilendirdiği öğrenci). */
const ogrencilerinNotlari = (ogrenciIdler, basTarih) => ogrenciIdler.length ? sorgu(
  "SELECT n.id, n.servis_id, n.ogrenci_id, to_char(n.tarih, 'YYYY-MM-DD') AS tarih, n.metin, n.olusturma, so.ogrenci_id AS hedef_id " +
  'FROM servis_notlari n JOIN servis_ogrencileri so ON so.servis_id = n.servis_id AND (n.ogrenci_id IS NULL OR n.ogrenci_id = so.ogrenci_id) ' +
  'WHERE so.ogrenci_id = ANY($1::text[]) AND n.tarih >= $2 ORDER BY n.tarih, n.olusturma', [ogrenciIdler, basTarih]) : Promise.resolve([]);

/* ---------------- velinin "binmeyecek" işareti ---------------- */
const BINMEYECEK_ALANLARI = "SELECT ogrenci_id, to_char(tarih, 'YYYY-MM-DD') AS tarih, sabah, aksam, aciklama, yazan_id, guncelleme " +
  'FROM servis_binmeyecek ';

/* Öğrencilerin [bas, bit] günleri arasındaki işaretleri. */
const binmeyecekler = (ogrenciIdler, basTarih, bitTarih) => ogrenciIdler.length ? sorgu(BINMEYECEK_ALANLARI +
  'WHERE ogrenci_id = ANY($1::text[]) AND tarih BETWEEN $2 AND $3 ORDER BY tarih', [ogrenciIdler, basTarih, bitTarih]) : Promise.resolve([]);

const binmeyecekBul = (ogrenciId, tarih) => tek(BINMEYECEK_ALANLARI + 'WHERE ogrenci_id = $1 AND tarih = $2', [ogrenciId, tarih]);

/* İşaret yazılır; sabah da akşam da kalkmışsa satır silinir. */
async function binmeyecekYaz(b) {
  if (!b.sabah && !b.aksam) {
    return calistir('DELETE FROM servis_binmeyecek WHERE ogrenci_id = $1 AND tarih = $2', [b.ogrenciId, b.tarih]);
  }
  return calistir(
    'INSERT INTO servis_binmeyecek (ogrenci_id, tarih, sabah, aksam, aciklama, yazan_id, guncelleme) ' +
    'VALUES ($1, $2, $3, $4, $5, $6, now()) ON CONFLICT (ogrenci_id, tarih) DO UPDATE SET sabah = EXCLUDED.sabah, ' +
    'aksam = EXCLUDED.aksam, aciklama = EXCLUDED.aciklama, yazan_id = EXCLUDED.yazan_id, guncelleme = now()',
    [b.ogrenciId, b.tarih, !!b.sabah, !!b.aksam, b.aciklama || '', b.yazanId]);
}

/* ---------------- saklama ---------------- */
/* sinirTarih'ten eski (30 günü geçen) yoklama, sefer günü, olay, not ve işaretler silinir. */
async function temizle(sinirTarih) {
  let n = 0;
  n += await calistir('DELETE FROM servis_yoklamalari WHERE tarih < $1', [sinirTarih]);
  n += await calistir('DELETE FROM servis_gunleri WHERE tarih < $1', [sinirTarih]);
  n += await calistir('DELETE FROM servis_olaylari WHERE tarih < $1', [sinirTarih]);
  n += await calistir('DELETE FROM servis_notlari WHERE tarih < $1', [sinirTarih]);
  n += await calistir('DELETE FROM servis_binmeyecek WHERE tarih < $1', [sinirTarih]);
  return n;
}

module.exports = {
  yoklamalar, yoklamaBul, yoklamaYaz,
  gun, gunler, gunBasladi, gunBitti, gunuGeriTarihle,
  olayIlkMi, olayVarMi,
  notEkle, notBul, notSil, servisinNotlari, ogrencilerinNotlari,
  binmeyecekler, binmeyecekBul, binmeyecekYaz,
  temizle
};
