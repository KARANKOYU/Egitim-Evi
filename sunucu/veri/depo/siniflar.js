'use strict';
/* Sınıflar, dersler ve haftalık ders programı. */

const { sorgu, tek, calistir, tr } = require('../baglanti');
const e = require('../esleme');

/* ---------------- sınıflar ---------------- */
async function bul(id) {
  if (!id) return null;
  return e.sinif(await tek('SELECT * FROM siniflar WHERE id = $1', [id]));
}

async function okulun(okulId) {
  return (await sorgu('SELECT * FROM siniflar WHERE okul_id = $1 ORDER BY ad' + tr(), [okulId])).map(e.sinif);
}

/* Sınıf listesi ve özetleri (öğrenci, ders, öğretmensiz ders sayısı) tek sorguda. */
async function ozetleri(okulId, sinifId) {
  const satirlar = await sorgu(
    'SELECT s.id, s.ad, ' +
    "  (SELECT count(*) FROM kullanicilar k WHERE k.sinif_id = s.id AND k.rol = 'student') AS ogrenci, " +
    '  (SELECT count(*) FROM dersler d WHERE d.sinif_id = s.id) AS ders, ' +
    '  (SELECT count(*) FROM dersler d WHERE d.sinif_id = s.id AND d.ogretmen_id IS NULL) AS atanmamis ' +
    'FROM siniflar s WHERE s.okul_id = $1 AND ($2 = \'\' OR s.id = $2) ORDER BY s.ad' + tr(),
    [okulId, sinifId || '']);
  return satirlar.map(r => ({
    id: r.id, name: r.ad, studentCount: r.ogrenci, lessonCount: r.ders, unassigned: r.atanmamis
  }));
}

async function sayisi(okulId) {
  return (await tek('SELECT count(*) AS n FROM siniflar WHERE okul_id = $1', [okulId])).n;
}

async function ekle(c) {
  await sorgu('INSERT INTO siniflar (id, okul_id, ad, olusturma) VALUES ($1, $2, $3, $4)',
    [c.id, c.schoolId, c.name, c.createdAt]);
}

/* Silinince: dersleri ve programı CASCADE ile gider, öğrencilerin sınıfı NULL olur. */
async function sil(id) {
  await calistir('DELETE FROM siniflar WHERE id = $1', [id]);
}

/* ---------------- dersler ---------------- */
const DERS_SEC =
  'SELECT d.*, s.ad AS sinif_adi, k.ad_soyad AS ogretmen_adi, ' +
  '  (SELECT count(*) FROM ders_programi p WHERE p.ders_id = d.id) AS yerlesen ' +
  'FROM dersler d JOIN siniflar s ON s.id = d.sinif_id LEFT JOIN kullanicilar k ON k.id = d.ogretmen_id';

async function dersBul(id) {
  if (!id) return null;
  return e.ders(await tek(DERS_SEC + ' WHERE d.id = $1', [id]));
}

async function sinifinDersleri(sinifId) {
  return (await sorgu(DERS_SEC + ' WHERE d.sinif_id = $1 ORDER BY d.konu' + tr(), [sinifId])).map(e.ders);
}

async function okulunDersleri(okulId) {
  return (await sorgu(DERS_SEC + ' WHERE d.okul_id = $1 ORDER BY s.ad' + tr() + ', d.konu' + tr(), [okulId]))
    .map(e.ders);
}

async function ogretmeninDersleri(ogretmenId) {
  return (await sorgu(DERS_SEC + ' WHERE d.ogretmen_id = $1 ORDER BY s.ad' + tr() + ', d.konu' + tr(), [ogretmenId]))
    .map(e.ders);
}

async function dersVarMi(sinifId, konu) {
  return !!(await tek('SELECT 1 FROM dersler WHERE sinif_id = $1 AND konu = $2', [sinifId, konu]));
}

async function dersEkle(l) {
  await sorgu('INSERT INTO dersler (id, okul_id, sinif_id, konu, ogretmen_id, haftalik_saat, olusturma) ' +
    'VALUES ($1, $2, $3, $4, $5, $6, $7)',
    [l.id, l.schoolId, l.classId, l.subject, e.yokIse(l.teacherId), l.weeklyHours || 0, l.createdAt]);
}

async function dersGuncelle(id, degisiklik) {
  if (degisiklik.teacherId !== undefined) {
    await calistir('UPDATE dersler SET ogretmen_id = $1 WHERE id = $2', [e.yokIse(degisiklik.teacherId), id]);
  }
  if (degisiklik.weeklyHours !== undefined) {
    await calistir('UPDATE dersler SET haftalik_saat = $1 WHERE id = $2', [degisiklik.weeklyHours, id]);
  }
}

async function dersSil(id) {
  await calistir('DELETE FROM dersler WHERE id = $1', [id]);   // programı CASCADE ile gider
}

/* ---------------- ders programı ---------------- */
const PROGRAM_SEC =
  'SELECT p.*, d.konu AS ders_konu, d.ogretmen_id, s.ad AS sinif_adi, k.ad_soyad AS ogretmen_adi ' +
  'FROM ders_programi p JOIN dersler d ON d.id = p.ders_id JOIN siniflar s ON s.id = p.sinif_id ' +
  'LEFT JOIN kullanicilar k ON k.id = d.ogretmen_id';
const PROGRAM_SIRA = ' ORDER BY p.gun, p.baslangic';

function programNesnesi(r) {
  const p = e.program(r);
  p._ogretmenAdi = e.bos(r.ogretmen_adi);
  return p;
}

async function programBul(id) {
  if (!id) return null;
  const r = await tek(PROGRAM_SEC + ' WHERE p.id = $1', [id]);
  return r ? programNesnesi(r) : null;
}

/* gun verilirse yalnızca o gün (1 = Pazartesi) */
async function sinifinProgrami(sinifId, gun) {
  return (await sorgu(PROGRAM_SEC + ' WHERE p.sinif_id = $1 AND ($2::int IS NULL OR p.gun = $2)' + PROGRAM_SIRA,
    [sinifId, gun || null])).map(programNesnesi);
}

async function ogretmeninProgrami(ogretmenId, gun) {
  return (await sorgu(PROGRAM_SEC + ' WHERE d.ogretmen_id = $1 AND ($2::int IS NULL OR p.gun = $2)' + PROGRAM_SIRA,
    [ogretmenId, gun || null])).map(programNesnesi);
}

async function okulunProgrami(okulId) {
  return (await sorgu(PROGRAM_SEC + ' WHERE p.okul_id = $1 ORDER BY s.ad' + tr() + ', p.gun, p.baslangic',
    [okulId])).map(programNesnesi);
}

/* Hatırlatmalar için: bugün, verilen saat aralığında başlayan dersler (bütün okullar). */
async function baslamakUzereOlanlar(gun, bas, bit) {
  return (await sorgu(PROGRAM_SEC +
    ' WHERE p.gun = $1 AND p.baslangic >= $2::time AND p.baslangic <= $3::time AND d.ogretmen_id IS NOT NULL',
    [gun, bas, bit])).map(programNesnesi);
}

async function programVarMi(sinifId, dersId, gun, bas) {
  return !!(await tek(
    'SELECT 1 FROM ders_programi WHERE sinif_id = $1 AND ders_id = $2 AND gun = $3 AND baslangic = $4::time',
    [sinifId, dersId, gun, bas]));
}

async function programEkle(k) {
  await sorgu('INSERT INTO ders_programi (id, okul_id, sinif_id, ders_id, gun, baslangic, bitis, yil_id, olusturma) ' +
    'VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)',
    [k.id, k.schoolId, k.classId, k.lessonId, k.day, k.start, k.end, e.yokIse(k.yilId), k.createdAt]);
}

async function programGuncelle(id, k) {
  await calistir('UPDATE ders_programi SET ders_id = $1, gun = $2, baslangic = $3, bitis = $4 WHERE id = $5',
    [k.lessonId, k.day, k.start, k.end, id]);
}

