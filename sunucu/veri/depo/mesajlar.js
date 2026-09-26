'use strict';
/* Mesajlar ve duyurular: mesajlar + mesaj_alicilari + mesaj_okumalari. */

const { sorgu, tek, calistir, islem } = require('../baglanti');
const e = require('../esleme');

/* Alıcılar ve okuyanlar mesajla birlikte json olarak toplanır; gönderenin
   ve (veli kopyasında) çocuğun adı da JOIN ile gelir. */
const SEC =
  'SELECT m.*, g.ad_soyad AS gonderen_adi, g.rol AS gonderen_rol, ' +
  "  COALESCE((SELECT json_agg(json_build_object('id', a.alici_id, 'ogrenciId', a.ogrenci_id, " +
  "          'ad', ka.ad_soyad, 'rol', ka.rol, 'ogrenciAdi', ko.ad_soyad) ORDER BY a.id) " +
  '     FROM mesaj_alicilari a JOIN kullanicilar ka ON ka.id = a.alici_id ' +
  "     LEFT JOIN kullanicilar ko ON ko.id = a.ogrenci_id WHERE a.mesaj_id = m.id), '[]') AS alicilar, " +
  "  COALESCE((SELECT json_agg(o.kullanici_id) FROM mesaj_okumalari o WHERE o.mesaj_id = m.id), '[]') AS okuyanlar " +
  'FROM mesajlar m LEFT JOIN kullanicilar g ON g.id = m.gonderen_id';
const YENI_ONCE = ' ORDER BY m.tarih DESC';

function nesne(r) {
  if (!r) return null;
  const m = e.mesaj(r);
  m._gonderenAdi = r.gonderen_adi || '';
  m._gonderenRol = r.gonderen_rol || '';
  m._alicilar = r.alicilar || [];       // ad, rol ve çocuk adıyla birlikte
  return m;
}

async function bul(id) {
  if (!id) return null;
  return nesne(await tek(SEC + ' WHERE m.id = $1', [id]));
}

/* kutu: 'gelen' | 'giden'; tur: '' | 'mesaj' | 'duyuru' */
async function kutusu(kullaniciId, kutu, tur, sinir) {
  const kosul = kutu === 'giden'
    ? 'm.gonderen_id = $1'
    : 'm.id IN (SELECT mesaj_id FROM mesaj_alicilari WHERE alici_id = $1)';
  return (await sorgu(SEC + ' WHERE ' + kosul + " AND ($2 = '' OR m.tur = $2)" + YENI_ONCE + ' LIMIT $3',
    [kullaniciId, tur || '', sinir || 200])).map(nesne);
}

/* Kutu listesi için hafif sorgu: alıcıların tamamı yerine yalnızca sayısı,
   bu kişinin okuyup okumadığı ve (veliyse) hangi çocuğu için geldiği.
   Tüm okula giden bir duyurunun 1000 alıcısı her listelemede taşınmaz. */
async function kutuOzeti(kullaniciId, kutu, tur, sinir) {
  const kosul = kutu === 'giden'
    ? 'm.gonderen_id = $1'
    : 'EXISTS (SELECT 1 FROM mesaj_alicilari a WHERE a.mesaj_id = m.id AND a.alici_id = $1)';
  return sorgu(
    'SELECT m.id, m.tur, m.konu, left(m.govde, 400) AS govde, m.gonderen_id, m.tarih, m.duzenlenme, m.hedef_ozet, ' +
    '       g.ad_soyad AS gonderen_adi, g.rol AS gonderen_rol, ' +
    '       (SELECT count(*) FROM mesaj_alicilari a WHERE a.mesaj_id = m.id) AS alici_sayisi, ' +
    '       (SELECT count(DISTINCT a.alici_id)::int FROM mesaj_alicilari a WHERE a.mesaj_id = m.id) AS kisi_sayisi, ' +
    '       (SELECT count(*)::int FROM mesaj_okumalari o WHERE o.mesaj_id = m.id AND EXISTS ' +
    '          (SELECT 1 FROM mesaj_alicilari a WHERE a.mesaj_id = m.id AND a.alici_id = o.kullanici_id)) AS okuyan_sayisi, ' +
    '       EXISTS (SELECT 1 FROM mesaj_okumalari o WHERE o.mesaj_id = m.id AND o.kullanici_id = $1) AS okundu, ' +
    "       COALESCE((SELECT json_agg(ko.ad_soyad) FROM mesaj_alicilari a JOIN kullanicilar ko ON ko.id = a.ogrenci_id " +
    "                 WHERE a.mesaj_id = m.id AND a.alici_id = $1), '[]') AS cocuk_icin " +
    'FROM mesajlar m LEFT JOIN kullanicilar g ON g.id = m.gonderen_id ' +
    'WHERE ' + kosul + " AND ($2 = '' OR m.tur = $2) ORDER BY m.tarih DESC LIMIT $3",
    [kullaniciId, tur || '', sinir || 200]);
}

async function okunmamisSayisi(kullaniciId) {
  return (await tek(
    'SELECT count(DISTINCT a.mesaj_id) AS n FROM mesaj_alicilari a ' +
    'WHERE a.alici_id = $1 AND NOT EXISTS (SELECT 1 FROM mesaj_okumalari o ' +
    '  WHERE o.mesaj_id = a.mesaj_id AND o.kullanici_id = $1)', [kullaniciId])).n;
}

/* Mesaj ve bütün alıcıları tek işlemde. Eklenen mesaj geri okunmaz:
   okula duyuruda 1360 alıcının adlarıyla yeniden toplanması gereksizdi. */
async function ekle(m) {
  await islem(async () => {
    await sorgu('INSERT INTO mesajlar (id, okul_id, gonderen_id, tur, konu, govde, hedef_ozet, tarih) ' +
      'VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
      [m.id, m.schoolId, e.yokIse(m.gonderenId), m.tur, m.konu, m.govde, m.hedefOzet, m.tarih]);
    await sorgu(
      'INSERT INTO mesaj_alicilari (mesaj_id, alici_id, ogrenci_id) ' +
      "SELECT $1, a, NULLIF(o, '') FROM unnest($2::text[], $3::text[]) AS t(a, o) ON CONFLICT DO NOTHING",
      [m.id, m.alicilar.map(a => a.id), m.alicilar.map(a => a.ogrenciId || '')]);
  });
}

/* Okundu bilgisi: her alıcı bir kez (veli birden çok çocuğu için kopya almış
   olabilir), okuduysa zamanı, öğrenciyse sınıfı, veliyse hangi çocuğu için. */
const okumaDurumu = mesajId => sorgu(
  'SELECT k.id, k.ad_soyad AS ad, k.rol, s.ad AS sinif, o.tarih AS okuma, ' +
  "       COALESCE(json_agg(DISTINCT ko.ad_soyad) FILTER (WHERE ko.ad_soyad IS NOT NULL), '[]') AS cocuklar " +
  'FROM mesaj_alicilari a JOIN kullanicilar k ON k.id = a.alici_id ' +
  'LEFT JOIN siniflar s ON s.id = k.sinif_id ' +
  'LEFT JOIN kullanicilar ko ON ko.id = a.ogrenci_id ' +
  'LEFT JOIN mesaj_okumalari o ON o.mesaj_id = a.mesaj_id AND o.kullanici_id = a.alici_id ' +
  'WHERE a.mesaj_id = $1 GROUP BY k.id, k.ad_soyad, k.rol, s.ad, o.tarih', [mesajId]);

async function okundu(mesajId, kullaniciId) {
  await sorgu('INSERT INTO mesaj_okumalari (mesaj_id, kullanici_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
    [mesajId, kullaniciId]);
}

async function sil(id) {
  await calistir('DELETE FROM mesajlar WHERE id = $1', [id]);
}

/* Alıcı mesajı yalnızca kendi kutusundan kaldırır; gönderenin
   "Gönderilenler"inde kalır. Mesaj ancak gönderenin hesabı da yoksa (silinmiş)
   ve hiç alıcı kalmadıysa silinir. */
async function alicidanKaldir(mesajId, kullaniciId) {
  await islem(async () => {
    await calistir('DELETE FROM mesaj_alicilari WHERE mesaj_id = $1 AND alici_id = $2', [mesajId, kullaniciId]);
    await calistir('DELETE FROM mesajlar WHERE id = $1 AND gonderen_id IS NULL AND NOT EXISTS ' +
      '(SELECT 1 FROM mesaj_alicilari WHERE mesaj_id = $1)', [mesajId]);
  });
}

/* Gönderenin düzeltmesi: konu ve metin değişir, düzeltme zamanı yazılır. */
const duzelt = (id, konu, govde) =>
  calistir('UPDATE mesajlar SET konu = $2, govde = $3, duzenlenme = now() WHERE id = $1', [id, konu, govde]);

module.exports = {
  duzelt, bul, kutusu, kutuOzeti, okunmamisSayisi, ekle, okumaDurumu, okundu, sil, alicidanKaldir };
