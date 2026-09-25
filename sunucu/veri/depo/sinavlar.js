'use strict';
/* Sınavlar: şablonlar, gruplar, sınavlar, ölçümler ve değerler.

   Bir sınavın her ölçümü (Doğru, Yanlış, Net, Puan...) ayrı satırdır; ana
   ölçüm (ana = true) ortalamaya ve grafiğe varsayılan olarak girer. Eski API
   ile uyum için sınav nesnesinde grades = { ogrenciId: ana ölçüm değeri }. */

const { sorgu, tek, calistir, islem, tr } = require('../baglanti');
const { uid } = require('../../ortak');
const e = require('../esleme');

/* ================= şablonlar ================= */
const OLCUM_JSON =
  "json_build_object('id', x.id, 'kod', x.kod, 'ad', x.ad, 'alt', x.alt_sinir, 'ust', x.ust_sinir, " +
  "'ana', x.ana, 'sira', x.sira)";

const SABLON_SEC =
  'SELECT sb.*, ' +
  "  COALESCE((SELECT json_agg(" + OLCUM_JSON + " ORDER BY x.sira) FROM sablon_olcumleri x WHERE x.sablon_id = sb.id), '[]') AS olcumler " +
  'FROM sinav_sablonlari sb';

function sablon(r) {
  if (!r) return null;
  return { id: r.id, schoolId: r.okul_id, name: r.ad, createdBy: e.bos(r.olusturan_id),
    olcumler: r.olcumler || [], createdAt: r.olusturma };
}

async function sablonlar(okulId) {
  return (await sorgu(SABLON_SEC + ' WHERE sb.okul_id = $1 ORDER BY sb.ad' + tr(), [okulId])).map(sablon);
}

async function sablonBul(id) {
  if (!id) return null;
  return sablon(await tek(SABLON_SEC + ' WHERE sb.id = $1', [id]));
}

async function sablonOlcumleriniYaz(sablonId, olcumler) {
  await calistir('DELETE FROM sablon_olcumleri WHERE sablon_id = $1', [sablonId]);
  let sira = 0;
  for (const o of olcumler) {
    await sorgu('INSERT INTO sablon_olcumleri (id, sablon_id, sira, kod, ad, alt_sinir, ust_sinir, ana) ' +
      'VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
      [uid('so'), sablonId, ++sira, o.kod, o.ad, o.alt, o.ust, !!o.ana]);
  }
}

async function sablonEkle(s) {
  await islem(async () => {
    await sorgu('INSERT INTO sinav_sablonlari (id, okul_id, olusturan_id, ad, olusturma) VALUES ($1, $2, $3, $4, $5)',
      [s.id, s.schoolId, e.yokIse(s.createdBy), s.name, s.createdAt]);
    await sablonOlcumleriniYaz(s.id, s.olcumler);
  });
  return sablonBul(s.id);
}

/* Şablonu değiştirmek eski sınavları etkilemez: onlar ölçümlerin kopyasını taşır. */
async function sablonGuncelle(id, ad, olcumler) {
  await islem(async () => {
    await calistir('UPDATE sinav_sablonlari SET ad = $1 WHERE id = $2', [ad, id]);
    await sablonOlcumleriniYaz(id, olcumler);
  });
  return sablonBul(id);
}

/* Şablonla yapılmış sınav sayısı (kullanılan şablon silinmez). */
async function sablonunSinavSayisi(id) {
  const r = await tek('SELECT count(*) AS n FROM sinavlar WHERE sablon_id = $1', [id]);
  return r ? Number(r.n) : 0;
}

async function sablonSil(id) {
  await calistir('DELETE FROM sinav_sablonlari WHERE id = $1', [id]);   // sınavlarda sablon_id NULL olur
}

/* ================= gruplar ================= */
async function grupBul(id) {
  if (!id) return null;
  return e.sinavGrubu(await tek('SELECT * FROM sinav_gruplari WHERE id = $1', [id]));
}

/* Öğretmenin grupları, sınav sayısı ve ağırlık toplamıyla (GROUP BY). */
async function ogretmeninGruplari(ogretmenId) {
  const satirlar = await sorgu(
    'SELECT g.*, count(s.id) AS sinav_sayisi, COALESCE(sum(s.agirlik), 0) AS agirlik_toplami ' +
    'FROM sinav_gruplari g LEFT JOIN sinavlar s ON s.grup_id = g.id ' +
    'WHERE g.ogretmen_id = $1 GROUP BY g.id ORDER BY g.ad' + tr(), [ogretmenId]);
  return satirlar.map(r => Object.assign(e.sinavGrubu(r),
    { _sinavSayisi: r.sinav_sayisi, _agirlikToplami: r.agirlik_toplami }));
}

async function grupEkle(g) {
  await sorgu('INSERT INTO sinav_gruplari (id, okul_id, ogretmen_id, ders, ad, yil_id, olusturma) ' +
    'VALUES ($1, $2, $3, $4, $5, $6, $7)',
    [g.id, g.schoolId, e.yokIse(g.teacherId), g.subject || '', g.name, e.yokIse(g.yilId), g.createdAt]);
}

async function grupSil(id) {
  await calistir('DELETE FROM sinav_gruplari WHERE id = $1', [id]);   // sınavları CASCADE ile gider
}

/* ================= sınavlar ================= */
const SINAV_SEC =
  'SELECT s.*, sb.ad AS sablon_adi, ' +
  "  COALESCE((SELECT json_agg(" + OLCUM_JSON + " ORDER BY x.sira) FROM sinav_olcumleri x WHERE x.sinav_id = s.id), '[]') AS olcumler, " +
  "  COALESCE((SELECT json_object_agg(d.ogrenci_id, d.deger) FROM sinav_olcumleri x " +
  '            JOIN sinav_degerleri d ON d.olcum_id = x.id WHERE x.sinav_id = s.id AND x.ana), ' + "'{}') AS notlar " +
  'FROM sinavlar s LEFT JOIN sinav_sablonlari sb ON sb.id = s.sablon_id';

async function bul(id) {
  if (!id) return null;
  return e.sinav(await tek(SINAV_SEC + ' WHERE s.id = $1', [id]));
}

async function grubun(grupId) {
  return (await sorgu(SINAV_SEC + ' WHERE s.grup_id = $1 ORDER BY s.olusturma', [grupId])).map(e.sinav);
}

async function ogretmenin(ogretmenId) {
  return (await sorgu(SINAV_SEC + ' WHERE s.ogretmen_id = $1 ORDER BY s.tarih DESC, s.olusturma DESC',
    [ogretmenId])).map(e.sinav);
}

/* Yeni sınav; ölçümleri (şablondan kopya ya da tek "Puan") aynı işlemde. */
async function ekle(s, olcumler) {
  await islem(async () => {
    await sorgu(
      'INSERT INTO sinavlar (id, okul_id, grup_id, sablon_id, ogretmen_id, ders, ad, tarih, agirlik, yil_id, olusturma) ' +
      'VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)',
      [s.id, s.schoolId, e.yokIse(s.groupId), e.yokIse(s.templateId), e.yokIse(s.teacherId), s.subject || '',
        s.name, s.tarih, s.weight === undefined ? null : s.weight, e.yokIse(s.yilId), s.createdAt]);
    let sira = 0;
    for (const o of olcumler) {
      await sorgu('INSERT INTO sinav_olcumleri (id, sinav_id, sira, kod, ad, alt_sinir, ust_sinir, ana) ' +
        'VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
        [uid('ol'), s.id, ++sira, o.kod, o.ad, o.alt, o.ust, !!o.ana]);
    }
  });
  return bul(s.id);
}

async function sil(id) {
  await calistir('DELETE FROM sinavlar WHERE id = $1', [id]);
}

/* Sınavın ölçümlerini verilen listeyle eşitler ("+ Yeni değer ekle").
   id'si olan güncellenir, yenisi eklenir, listede olmayan silinir
   (değerleri CASCADE ile gider). Geçici kod ataması, kod benzersizliği ve
   tek ana ölçüm kuralı sıra değişirken ara adımda bozulmasın diye. */
async function olcumleriYaz(sinavId, olcumler) {
  await islem(async () => {
    const mevcut = (await sorgu('SELECT id FROM sinav_olcumleri WHERE sinav_id = $1', [sinavId])).map(r => r.id);
    const kalan = olcumler.filter(o => o.id && mevcut.indexOf(o.id) >= 0).map(o => o.id);
    await calistir('DELETE FROM sinav_olcumleri WHERE sinav_id = $1 AND NOT (id = ANY($2::text[]))', [sinavId, kalan]);
    await calistir("UPDATE sinav_olcumleri SET ana = false, kod = '~' || id WHERE sinav_id = $1", [sinavId]);
    let sira = 0;
    for (const o of olcumler) {
      sira++;
      if (o.id && kalan.indexOf(o.id) >= 0) {
        await calistir('UPDATE sinav_olcumleri SET sira = $1, kod = $2, ad = $3, alt_sinir = $4, ust_sinir = $5, ana = $6 ' +
          'WHERE id = $7 AND sinav_id = $8', [sira, o.kod, o.ad, o.alt, o.ust, !!o.ana, o.id, sinavId]);
      } else {
        await sorgu('INSERT INTO sinav_olcumleri (id, sinav_id, sira, kod, ad, alt_sinir, ust_sinir, ana) ' +
          'VALUES ($1, $2, $3, $4, $5, $6, $7, $8)', [uid('ol'), sinavId, sira, o.kod, o.ad, o.alt, o.ust, !!o.ana]);
      }
    }
  });
  return bul(sinavId);
}

/* Aralık daraltılırken dışarıda kalacak değer sayısı. */
async function aralikDisi(olcumId, alt, ust) {
  return (await tek('SELECT count(*) AS n FROM sinav_degerleri WHERE olcum_id = $1 AND (deger < $2 OR deger > $3)',
    [olcumId, alt, ust])).n;
}

/* Grafik bantları: her sınavın her ölçümünde en düşük, en yüksek ve ortalama. */
async function bantlar(sinavIdler) {
  if (!sinavIdler.length) return {};
  const satirlar = await sorgu(
    'SELECT x.sinav_id, x.kod, min(d.deger) AS en_az, max(d.deger) AS en_cok, avg(d.deger)::float8 AS ort, ' +
    '       count(*) AS sayi ' +
    'FROM sinav_olcumleri x JOIN sinav_degerleri d ON d.olcum_id = x.id ' +
    'WHERE x.sinav_id = ANY($1::text[]) GROUP BY x.sinav_id, x.kod', [sinavIdler]);
  const sonuc = {};
  for (const r of satirlar) {
    if (!sonuc[r.sinav_id]) sonuc[r.sinav_id] = {};
    sonuc[r.sinav_id][r.kod] = { alt: r.en_az, ust: r.en_cok, ort: Math.round(r.ort * 1000) / 1000, sayi: r.sayi };
  }
  return sonuc;
}

/* Değerleri yazar. degerler: [{ olcumId, ogrenciId, deger }]; deger null ise silinir.
   Tek işlemde en fazla iki sorgu: 60 öğrenci x 7 alan = 420 değer tek tek
   yazılınca 160 ms sürüyordu. */
async function degerleriYaz(degerler) {
  /* Aynı öğrenci-alan çifti iki kez geldiyse sonuncusu geçerli (toplu
     upsert aynı satırı iki kez güncelleyemez). */
  const son = new Map();
  for (const d of degerler) son.set(d.olcumId + '|' + d.ogrenciId, d);
  const tekil = Array.from(son.values());
  const silinecek = tekil.filter(d => d.deger === null);
  const yazilacak = tekil.filter(d => d.deger !== null);
  await islem(async () => {
    if (silinecek.length) {
      await calistir(
        'DELETE FROM sinav_degerleri d USING unnest($1::text[], $2::text[]) AS s(olcum, ogrenci) ' +
        'WHERE d.olcum_id = s.olcum AND d.ogrenci_id = s.ogrenci',
        [silinecek.map(d => d.olcumId), silinecek.map(d => d.ogrenciId)]);
    }
    if (yazilacak.length) {
      await sorgu(
        'INSERT INTO sinav_degerleri (olcum_id, ogrenci_id, deger) ' +
        'SELECT * FROM unnest($1::text[], $2::text[], $3::numeric[]) ' +
        'ON CONFLICT (olcum_id, ogrenci_id) DO UPDATE SET deger = EXCLUDED.deger',
        [yazilacak.map(d => d.olcumId), yazilacak.map(d => d.ogrenciId), yazilacak.map(d => d.deger)]);
    }
  });
}

