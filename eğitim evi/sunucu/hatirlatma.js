'use strict';
/* Otomatik hatırlatmalar.
   Ders başlamadan önce ve ödev teslimi yaklaşınca bildirim üretir;
   aynı bildirimi iki kez göndermez. */

const { saatDakika } = require('./iliskiler');
const { classById, db, lessonById, notify, save } = require('./veri');
const { bugun } = require('./bolumler/devamsizlik');

/* ============ otomatik hatırlatmalar ============
   Belirli aralıklarla çalışır:
     - dersten kısa süre önce öğretmene haber
     - ödevin son gününe bir gün kala öğrenciye haber
   Aynı hatırlatma iki kez gitmesin diye gönderilenler db.hatirlatmalar'da
   anahtarla işaretlenir, eskiyenler temizlenir. */

const DERS_ONCESI_DK = 15;        // ders başlamadan kaç dakika önce
const HATIRLATMA_ARALIK_MS = 5 * 60 * 1000;

function yerelTarihAnahtari(d) {
  const p = n => (n < 10 ? '0' : '') + n;
  return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate());
}

function hatirlatildiMi(anahtar) { return !!db.hatirlatmalar[anahtar]; }
function hatirlatildi(anahtar) { db.hatirlatmalar[anahtar] = Date.now(); }

function dersHatirlatmalari(simdi) {
  /* JS'te 0 Pazar; bizde 1 Pazartesi .. 7 Pazar */
  const gun = simdi.getDay() === 0 ? 7 : simdi.getDay();
  const suAn = simdi.getHours() * 60 + simdi.getMinutes();
  const bugun = yerelTarihAnahtari(simdi);
  let sayi = 0;

  for (const sp of db.schedule) {
    if (sp.day !== gun) continue;
    const bas = saatDakika(sp.start);
    if (bas === null) continue;

    const kalan = bas - suAn;
    if (kalan < 0 || kalan > DERS_ONCESI_DK) continue;

    const l = lessonById(sp.lessonId);
    if (!l || !l.teacherId) continue;

    const anahtar = 'ders:' + sp.id + ':' + bugun;
    if (hatirlatildiMi(anahtar)) continue;

    const c = classById(sp.classId);
    notify(l.teacherId,
      '' + (c ? c.name : '') + ' ' + l.subject + ' dersin ' + sp.start + '\'te başlıyor.');
    hatirlatildi(anahtar);
    sayi++;
  }
  return sayi;
}

function odevHatirlatmalari(simdi) {
  const yarin = new Date(simdi.getTime() + 24 * 60 * 60 * 1000);
  const yarinAnahtar = yerelTarihAnahtari(yarin);
  let sayi = 0;

  for (const a of db.assignments) {
    if (a.status !== 'active' || !a.endAt) continue;
    /* endAt "YYYY-MM-DD" ya da tam tarih olabilir; ilk 10 karakter yeterli. */
    if (String(a.endAt).slice(0, 10) !== yarinAnahtar) continue;

    for (const sid of a.studentIds) {
      /* Ödevi zaten sonuçlanmış öğrenciye hatırlatma gitmesin. */
      if (a.results && a.results[sid]) continue;
      const anahtar = 'odev:' + a.id + ':' + sid;
      if (hatirlatildiMi(anahtar)) continue;
      notify(sid, '"' + a.title + '" ödevinin son günü yarın.');
      hatirlatildi(anahtar);
      sayi++;
    }
  }
  return sayi;
}

function hatirlatmalariCalistir() {
  try {
    const simdi = new Date();
    const a = dersHatirlatmalari(simdi);
    const b = odevHatirlatmalari(simdi);

    /* 30 günden eski işaretleri at, sözlük şişmesin. */
    const sinir = Date.now() - 30 * 24 * 60 * 60 * 1000;
    let temizlenen = 0;
    for (const k of Object.keys(db.hatirlatmalar)) {
      if (db.hatirlatmalar[k] < sinir) { delete db.hatirlatmalar[k]; temizlenen++; }
    }
    if (a || b || temizlenen) save();
  } catch (e) {
    console.error('Hatırlatma hatası:', e.message);
  }
}


module.exports = {
  DERS_ONCESI_DK,
  HATIRLATMA_ARALIK_MS,
  yerelTarihAnahtari,
  hatirlatildiMi,
  hatirlatildi,
  dersHatirlatmalari,
  odevHatirlatmalari,
  hatirlatmalariCalistir
};
