'use strict';
/* Öğretmen uçları (/api/teacher): kendi programı ve öğrencileri. */

const { bad, ok } = require('../http');
const {
  GUN_ADLARI, GUN_SAYISI, araliklarKesisiyor, isTeacherLike, programSirali, saatDakika,
  sinifOgrencileri, studentsOfTeacher
} = require('../iliskiler');
const { classById, db, lessonById } = require('../veri');

/* ---- uçlar ---- */
/* k: istek bağlamı (api.js kurar). Cevap yazılmadıysa yönlendirici 404 döner. */
async function uclar(k) {
  const { req, res, me, body, q, p, segs, method, need } = k;

  if (p === 'teacher') {
    if (!need(null)) return;
    if (!isTeacherLike(me)) return bad(res, 'Yetkin yok', 403);
    if (segs[2] === 'students' && method === 'GET') {
      return ok(res, {
        students: studentsOfTeacher(me.id).map(s => ({ id: s.id, fullName: s.fullName, email: s.email }))
      });
    }

    /* Öğretmenin kendi haftalık programı ve dersleri. */
    if (segs[2] === 'schedule' && method === 'GET') {
      const derslerim = db.lessons.filter(l => l.teacherId === me.id);
      const dersIdler = derslerim.map(l => l.id);

      const dersSaatleri = programSirali(db.schedule.filter(sp => dersIdler.indexOf(sp.lessonId) >= 0))
        .map(sp => {
          const l = lessonById(sp.lessonId);
          const c = classById(sp.classId);
          return {
            id: sp.id, day: sp.day, start: sp.start, end: sp.end,
            subject: l ? l.subject : '?',
            className: c ? c.name : '?',
            classId: sp.classId
          };
        });

      /* Kendi programında kesişen saatler çakışmadır. */
      dersSaatleri.forEach(h => {
        const hb = saatDakika(h.start), he = saatDakika(h.end);
        h.cakisma = dersSaatleri.some(d =>
          d !== h && d.day === h.day &&
          araliklarKesisiyor(hb, he, saatDakika(d.start), saatDakika(d.end)));
      });

      return ok(res, {
        gunSayisi: GUN_SAYISI,
        gunAdlari: GUN_ADLARI,
        cells: dersSaatleri,
        lessons: derslerim
          .map(l => {
            const c = classById(l.classId);
            return {
              id: l.id, subject: l.subject,
              className: c ? c.name : '?',
              classId: l.classId,
              weeklyHours: l.weeklyHours || 0,
              placed: db.schedule.filter(sp => sp.lessonId === l.id).length,
              studentCount: sinifOgrencileri(l.classId).length
            };
          })
          .sort((a, b) => (a.className.localeCompare(b.className, 'tr')) ||
                          (a.subject.localeCompare(b.subject, 'tr')))
      });
    }
  }

  /* ---------- eğitim yılı ---------- */

  return false;
}

module.exports = {
  uclar
};
