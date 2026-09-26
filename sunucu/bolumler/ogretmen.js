'use strict';
/* Öğretmen uçları (/api/teacher): kendi programı ve öğrencileri. */

const { bad, ok } = require('../http');
const {
  GUN_ADLARI, GUN_SAYISI, araliklarKesisiyor, isTeacherLike, saatDakika, studentsOfTeacher
} = require('../iliskiler');
const { clean } = require('../ortak');
const { depo } = require('../veri');
const { yetkiVarMi } = require('../yetki');
const { yilSuz } = require('./egitim-yili');

/* ---- Sınıflarım: öğretmenin girdiği sınıflar, öğrencileri ve sonuçları ----
   "Girdiği sınıfların öğrenci sonuçlarını görür" yetkisi ister (hazır
   Öğretmen rolünde açık gelir; müdür kapatabilir ya da ek rolle verebilir).
   Öğretmen yalnızca kendi dersinin olduğu sınıfları görür. */
async function girdigiSiniflar(me) {
  const dersler = await depo.siniflar.ogretmeninDersleri(me.id);
  const siniflar = new Map();
  for (const l of dersler) {
    if (!siniflar.has(l.classId)) siniflar.set(l.classId, { id: l.classId, ad: l._sinifAdi || '?', dersler: [] });
    siniflar.get(l.classId).dersler.push(l.subject);
  }
  return siniflar;
}

/* ---- uçlar ---- */
/* k: istek bağlamı (api.js kurar). Cevap yazılmadıysa yönlendirici 404 döner. */
async function uclar(k) {
  const { res, me, p, segs, method, need } = k;

  if (p === 'teacher') {
    if (!need(null)) return;
    if (segs[2] === 'siniflarim' || segs[2] === 'sinif' || segs[2] === 'ogrenci') {
      if (!isTeacherLike(me)) return bad(res, 'Bu bölüm öğretmenler içindir', 403);
      return siniflarimUclari(k);
    }
    if (!isTeacherLike(me)) return bad(res, 'Yetkin yok', 403);
    if (segs[2] === 'students' && method === 'GET') {
      return ok(res, {
        students: (await studentsOfTeacher(me.id)).map(s => ({ id: s.id, fullName: s.fullName, email: s.email }))
      });
    }

    /* Öğretmenin kendi haftalık programı ve dersleri. */
    if (segs[2] === 'schedule' && method === 'GET') {
      const derslerim = await depo.siniflar.ogretmeninDersleri(me.id);

      const dersSaatleri = (await depo.siniflar.ogretmeninProgrami(me.id)).map(sp => ({
        id: sp.id, day: sp.day, start: sp.start, end: sp.end,
        subject: sp._ders || '?',
        className: sp._sinifAdi || '?',
        classId: sp.classId,
        lessonId: sp.lessonId   // ders programından yoklama almak için
      }));

      /* Kendi programında kesişen saatler çakışmadır. */
      dersSaatleri.forEach(h => {
        const hb = saatDakika(h.start), he = saatDakika(h.end);
        h.cakisma = dersSaatleri.some(d =>
          d !== h && d.day === h.day &&
          araliklarKesisiyor(hb, he, saatDakika(d.start), saatDakika(d.end)));
      });

      /* Sınıf başına öğrenci sayısı tek sorguda. */
      const ozetler = new Map((await depo.siniflar.ozetleri(me.schoolId)).map(c => [c.id, c.studentCount]));

      return ok(res, {
        gunSayisi: GUN_SAYISI,
        gunAdlari: GUN_ADLARI,
        cells: dersSaatleri,
        /* Depo sınıf adı ve derse göre Türkçe sıralı döndürür. */
        lessons: derslerim.map(l => ({
          id: l.id, subject: l.subject,
          className: l._sinifAdi || '?',
          classId: l.classId,
          weeklyHours: l.weeklyHours || 0,
          placed: l._yerlesen || 0,
          studentCount: ozetler.get(l.classId) || 0
        }))
      });
    }
  }

  return false;
}

module.exports = {
  uclar
};
