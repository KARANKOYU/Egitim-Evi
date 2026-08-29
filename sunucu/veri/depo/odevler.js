'use strict';
/* Ödevler: odevler + odev_ogrencileri (kime verildi, sonucu ne) + odev_siniflari.

   Uygulama ödevi tek nesne olarak kullanır:
     { id, title, ..., studentIds: [...], results: { ogrenciId: 'yapti' }, classIds: [...] }
   Bu nesne sorguda json_agg / json_object_agg ile toplanarak kurulur. */

const { sorgu, tek, calistir, islem } = require('../baglanti');
const e = require('../esleme');

const SEC =
  'SELECT o.*, ' +
  "  COALESCE((SELECT json_agg(oo.ogrenci_id ORDER BY oo.ogrenci_id) FROM odev_ogrencileri oo WHERE oo.odev_id = o.id), '[]') AS ogrenci_idler, " +
  "  COALESCE((SELECT json_object_agg(oo.ogrenci_id, oo.sonuc) FROM odev_ogrencileri oo WHERE oo.odev_id = o.id AND oo.sonuc IS NOT NULL), '{}') AS sonuclar, " +
  "  COALESCE((SELECT json_object_agg(oo.ogrenci_id, oo.acilma) FROM odev_ogrencileri oo WHERE oo.odev_id = o.id AND oo.acilma IS NOT NULL), '{}') AS acilmalar, " +
  "  COALESCE((SELECT json_agg(os.sinif_id) FROM odev_siniflari os WHERE os.odev_id = o.id), '[]') AS sinif_idler " +
  'FROM odevler o';
const YENI_ONCE = ' ORDER BY o.olusturma DESC';

const liste = async (kosul, p) => (await sorgu(SEC + ' WHERE ' + kosul + YENI_ONCE, p)).map(e.odev);

async function bul(id) {
  if (!id) return null;
  return e.odev(await tek(SEC + ' WHERE o.id = $1', [id]));
}

const ogretmenin = ogretmenId => liste('o.ogretmen_id = $1', [ogretmenId]);
const okulun = okulId => liste('o.okul_id = $1', [okulId]);
const ogrencinin = ogrenciId =>
  liste('o.id IN (SELECT odev_id FROM odev_ogrencileri WHERE ogrenci_id = $1)', [ogrenciId]);

/* Hatırlatma için: son günü verilen tarih olan aktif ödevler. */
const bitisiOlanlar = tarih => liste("o.durum = 'active' AND o.bitis = $1::date", [tarih]);

/* Yeni ödev: ödev, öğrencileri ve sınıfları tek işlemde yazılır —
   30 öğrenciden birinde hata olursa hiçbiri yazılmaz. */
async function ekle(a) {
  await islem(async () => {
    await sorgu(
      'INSERT INTO odevler (id, okul_id, ogretmen_id, ders, baslik, aciklama, baslangic, baslangic_saati, bitis, bitis_saati, ' +
      'durum, yil_id, olusturma) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)',
      [a.id, a.schoolId, e.yokIse(a.teacherId), a.subject, a.title, a.description || '',
        tarihVeyaNull(a.startAt), a.startTime || null, tarihVeyaNull(a.endAt), a.endTime, a.status, e.yokIse(a.yilId), a.createdAt]);
    await sorgu('INSERT INTO odev_ogrencileri (odev_id, ogrenci_id) SELECT $1, unnest($2::text[])',
      [a.id, a.studentIds]);
    if (a.classIds && a.classIds.length) {
      await sorgu('INSERT INTO odev_siniflari (odev_id, sinif_id) SELECT $1, unnest($2::text[])',
        [a.id, a.classIds]);
    }
  });
  return bul(a.id);
}

/* Tarih alanı: "2026-09-25" gibi geçerli bir gün değilse NULL (süresiz). */
function tarihVeyaNull(v) {
  const s = String(v || '').slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return null;
  return isNaN(Date.parse(s + 'T00:00:00Z')) ? null : s;
}

/* Sonuçları yazar ve ödevi "sonuçlandı" yapar. sonuclar: { ogrenciId: 'yapti' } */
async function sonuclandir(id, sonuclar, zaman) {
  await islem(async () => {
    for (const ogrenciId of Object.keys(sonuclar)) {
      await calistir('UPDATE odev_ogrencileri SET sonuc = $1 WHERE odev_id = $2 AND ogrenci_id = $3',
        [sonuclar[ogrenciId], id, ogrenciId]);
    }
    await calistir("UPDATE odevler SET durum = 'finished', sonuclanma = $1 WHERE id = $2", [zaman, id]);
  });
  return bul(id);
}

/* Ödevin kendisini düzeltir (ad, açıklama, tarihler). Sonuçlanmış ödevde de
   çalışır; öğrenci listesi ve sonuçlar değişmez. */
async function duzelt(id, d) {
  await calistir('UPDATE odevler SET baslik = $2, aciklama = $3, baslangic = $4, bitis = $5, bitis_saati = $6, ' +
    'baslangic_saati = $7 WHERE id = $1',
    [id, d.title, d.description || '', tarihVeyaNull(d.startAt), tarihVeyaNull(d.endAt), d.endTime, d.startTime || null]);
  return bul(id);
}

async function yenidenAc(id) {
  await calistir("UPDATE odevler SET durum = 'active' WHERE id = $1", [id]);
  return bul(id);
}

async function sil(id) {
  await calistir('DELETE FROM odevler WHERE id = $1', [id]);
}

/* Öğrenci ödevi ilk açtığında zamanı yazılır (sonradan değişmez). */
async function acildi(id, ogrenciId) {
  await calistir('UPDATE odev_ogrencileri SET acilma = now() WHERE odev_id = $1 AND ogrenci_id = $2 AND acilma IS NULL',
    [id, ogrenciId]);
}

/* Öğrencinin yıldızladığı ödevlerin kimlikleri. */
async function yildizlilari(ogrenciId) {
  const satirlar = await sorgu('SELECT odev_id FROM odev_ogrencileri WHERE ogrenci_id = $1 AND yildiz', [ogrenciId]);
  return new Set(satirlar.map(s => s.odev_id));
}

/* Müdürün "Ders ödevleri" listesi: her ders için ödevlerin yalnızca durumu
   (sayılar istemcide değil sunucuda çıkarılır). Ödev, verildiği sınıfla
   (odev_siniflari) ve ders adıyla derse bağlanır. */
async function dersBaglari(okulId, sinifId) {
  return (await sorgu(
    'SELECT d.id AS ders_id, o.durum, o.bitis, o.bitis_saati, o.yil_id FROM dersler d ' +
    'JOIN odev_siniflari os ON os.sinif_id = d.sinif_id ' +
    'JOIN odevler o ON o.id = os.odev_id AND o.ders = d.konu ' +
    "WHERE d.okul_id = $1 AND ($2 = '' OR d.sinif_id = $2)", [okulId, sinifId || ''])).map(r => ({
    dersId: r.ders_id, status: r.durum, endAt: e.bos(r.bitis), endTime: r.bitis_saati, yilId: e.bos(r.yil_id)
  }));
}

/* Bir dersin (sınıf + konu) ödevleri, o sınıftan kaç öğrenciye gittiğiyle. */
async function dersinOdevleri(okulId, sinifId, konu) {
  return (await sorgu(
    'SELECT o.id, o.ogretmen_id, o.baslik, o.aciklama, o.baslangic, o.bitis, o.bitis_saati, o.durum, o.yil_id, ' +
    '       t.ad_soyad AS ogretmen_adi, ' +
    '       (SELECT count(*) FROM odev_ogrencileri oo JOIN kullanicilar k ON k.id = oo.ogrenci_id ' +
    '        WHERE oo.odev_id = o.id AND k.sinif_id = $2) AS ogrenci_sayisi ' +
    'FROM odevler o JOIN odev_siniflari os ON os.odev_id = o.id AND os.sinif_id = $2 ' +
    'LEFT JOIN kullanicilar t ON t.id = o.ogretmen_id ' +
    'WHERE o.okul_id = $1 AND o.ders = $3 ORDER BY o.olusturma DESC', [okulId, sinifId, konu])).map(r => ({
    id: r.id, title: r.baslik, description: r.aciklama, startAt: e.bos(r.baslangic), endAt: e.bos(r.bitis),
    endTime: r.bitis_saati, status: r.durum, yilId: e.bos(r.yil_id),
    teacherName: r.ogretmen_adi || '(okuldan ayrıldı)', studentCount: r.ogrenci_sayisi,
    sahipsiz: !r.ogretmen_id   // öğretmeni ayrıldı: müdür sonuçlandırır
  }));
}

module.exports = {
  duzelt,
  bul, ogretmenin, okulun, ogrencinin, bitisiOlanlar, ekle, sonuclandir, yenidenAc, sil, acildi, yildizla, yildizlilari,
  tarihVeyaNull,
  takvimIcin, dersBaglari, dersinOdevleri
};
