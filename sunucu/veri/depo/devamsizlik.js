'use strict';
/* Devamsızlık kayıtları. Yalnızca "var" dışındaki durumlar saklanır. */

const { sorgu, calistir, islem } = require('../baglanti');
const e = require('../esleme');

const SEC =
  'SELECT v.*, d.konu AS ders_konu, a.ad_soyad AS alan_adi ' +
  'FROM devamsizlik v LEFT JOIN dersler d ON d.id = v.ders_id LEFT JOIN kullanicilar a ON a.id = v.alan_id';

function nesne(r) {
  const k = e.devamsizlik(r);
  k._ders = e.bos(r.ders_konu);
  k._alanAdi = e.bos(r.alan_adi);
  return k;
}

async function dersGunu(dersId, tarih) {
  return (await sorgu(SEC + ' WHERE v.ders_id = $1 AND v.tarih = $2', [dersId, tarih])).map(nesne);
}

async function ogrencinin(ogrenciId) {
  return (await sorgu(SEC + ' WHERE v.ogrenci_id = $1 ORDER BY v.tarih DESC, v.olusturma DESC', [ogrenciId]))
    .map(nesne);
}

async function ogrenciGunu(ogrenciId, tarih) {
  return (await sorgu(SEC + ' WHERE v.ogrenci_id = $1 AND v.tarih = $2', [ogrenciId, tarih])).map(nesne);
}

/* Okul özeti için: verilen tarihten bu yana bütün kayıtlar. */
async function okulunSonKayitlari(okulId, sinirTarih) {
  return (await sorgu(SEC + ' WHERE v.okul_id = $1 AND v.tarih >= $2', [okulId, sinirTarih])).map(nesne);
}

async function kayitEkle(k) {
  await sorgu(
    'INSERT INTO devamsizlik (id, okul_id, sinif_id, ders_id, ogrenci_id, tarih, durum, aciklama, alan_id, yil_id, olusturma) ' +
    'VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)',
    [k.id, k.schoolId, e.yokIse(k.classId), e.yokIse(k.lessonId), k.ogrenciId, k.tarih, k.durum,
      k.not || '', e.yokIse(k.alanId), e.yokIse(k.yilId), k.createdAt]);
}

/* Bir dersin bir günlük yoklaması: eskisini silip yenisini yazar (tek işlem). */
async function dersGunuYaz(dersId, tarih, kayitlar) {
  await islem(async () => {
    await calistir('DELETE FROM devamsizlik WHERE ders_id = $1 AND tarih = $2', [dersId, tarih]);
    for (const k of kayitlar) await kayitEkle(k);
  });
}

/* Tek öğrencinin tek ders saatini değiştirir; kayit null ise "geldi" (silinir). */
async function ogrenciDersGunuYaz(ogrenciId, dersId, tarih, kayit) {
  await islem(async () => {
    await calistir('DELETE FROM devamsizlik WHERE ogrenci_id = $1 AND ders_id = $2 AND tarih = $3',
      [ogrenciId, dersId, tarih]);
    if (kayit) await kayitEkle(kayit);
  });
}

module.exports = { dersGunu, ogrencinin, ogrenciGunu, okulunSonKayitlari, dersGunuYaz, ogrenciDersGunuYaz };
