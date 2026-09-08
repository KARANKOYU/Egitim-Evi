'use strict';
/* Sınav grupları ve sınav notları (/api/examgroups, /api/exams). */

const { bad, ok } = require('../http');
const { branchOf, isTeacherLike, studentsOfTeacher } = require('../iliskiler');
const { clean, now, uid } = require('../ortak');
const { byId, db, notify, save } = require('../veri');
const { yilDamgasi, yilSuz } = require('./egitim-yili');

/* ---- uçlar ---- */
/* k: istek bağlamı (api.js kurar). Cevap yazılmadıysa yönlendirici 404 döner. */
async function uclar(k) {
  const { req, res, me, body, q, p, segs, method, need } = k;

  if (p === 'examgroups') {
    if (!need(null)) return;
    if (!isTeacherLike(me)) return bad(res, 'Yetkin yok', 403);

    if (method === 'GET' && !segs[2]) {
      const list = yilSuz(me, db.examGroups.filter(g => g.teacherId === me.id))
        .sort((a, b) => a.name.localeCompare(b.name, 'tr'))
        .map(g => {
          const exams = db.exams.filter(e => e.groupId === g.id);
          return {
            id: g.id, name: g.name, subject: g.subject, createdAt: g.createdAt,
            examCount: exams.length,
            weightTotal: exams.reduce((s, e) => s + Number(e.weight), 0)
          };
        });
      return ok(res, { groups: list });
    }
    if (method === 'POST' && !segs[2]) {
      const name = clean(body.name, 100);
      if (!name) return bad(res, 'Grup adı gerekli (örn: Dönem 1 - Yarıyıl 1)');
      const g = {
        id: uid('g'), teacherId: me.id, schoolId: me.schoolId,
        subject: me.role === 'teacher' ? me.branch : (clean(body.subject, 60) || branchOf(me)),
        name, yilId: yilDamgasi(me), createdAt: now()
      };
      db.examGroups.push(g);
      save();
      return ok(res, { group: g });
    }

    const g = byId(db.examGroups, segs[2] || '');
    if (!g) return bad(res, 'Sınav grubu bulunamadı', 404);
    if (g.teacherId !== me.id) return bad(res, 'Yetkin yok', 403);

    if (method === 'GET') {
      const students = studentsOfTeacher(me.id);
      const gExams = db.exams.filter(e => e.groupId === g.id);
      const exams = gExams.map(e => ({
        id: e.id, name: e.name, weight: e.weight, graded: Object.keys(e.grades || {}).length
      }));
      const averages = students.map(s => {
        let ws = 0, wt = 0;
        gExams.forEach(e => {
          const v = e.grades ? e.grades[s.id] : undefined;
          if (v !== null && v !== undefined) { ws += Number(v) * Number(e.weight); wt += Number(e.weight); }
        });
        return { id: s.id, fullName: s.fullName, average: wt > 0 ? Math.round(ws / wt * 100) / 100 : null };
      });
      return ok(res, { group: g, exams, averages });
    }
    if (method === 'POST' && segs[3] === 'delete') {
      db.exams = db.exams.filter(e => e.groupId !== g.id);
      db.examGroups = db.examGroups.filter(x => x.id !== g.id);
      save();
      return ok(res);
    }
  }

  /* ---- sınavlar ---- */
  if (p === 'exams') {
    if (!need(null)) return;
    if (!isTeacherLike(me)) return bad(res, 'Yetkin yok', 403);

    if (method === 'POST' && !segs[2]) {
      const g = byId(db.examGroups, clean(body.groupId, 60));
      if (!g || g.teacherId !== me.id) return bad(res, 'Sınav grubu bulunamadı');
      const name = clean(body.name, 100);
      if (!name) return bad(res, 'Sınav adı gerekli');
      const w = Number(body.weight);
      if (!isFinite(w) || w <= 0 || w > 100) return bad(res, 'Etki oranı 1 ile 100 arasında olmalı');
      const e = { id: uid('e'), groupId: g.id, teacherId: me.id, name, weight: w, grades: {}, createdAt: now() };
      db.exams.push(e);
      save();
      return ok(res, { exam: e });
    }

    const e = byId(db.exams, segs[2] || '');
    if (!e) return bad(res, 'Sınav bulunamadı', 404);
    if (e.teacherId !== me.id) return bad(res, 'Yetkin yok', 403);

    if (method === 'GET') {
      return ok(res, {
        exam: e,
        students: studentsOfTeacher(me.id).map(s => ({
          id: s.id, fullName: s.fullName,
          grade: e.grades && e.grades[s.id] !== undefined ? e.grades[s.id] : null
        }))
      });
    }
    if (method === 'POST' && segs[3] === 'grades') {
      const grades = body.grades || {};
      const allowed = studentsOfTeacher(me.id).map(s => s.id);
      const changed = [];
      for (const id in grades) {
        if (allowed.indexOf(id) < 0) continue;
        const v = grades[id];
        if (v === null || v === '' || v === undefined) { delete e.grades[id]; continue; }
        const n = Number(v);
        if (!isFinite(n) || n < 0 || n > 100) continue;
        e.grades[id] = Math.round(n * 100) / 100;
        changed.push(id);
      }
      changed.forEach(id => notify(id, '"' + e.name + '" sınavının notu girildi.'));
      save();
      return ok(res, { exam: e });
    }
    if (method === 'POST' && segs[3] === 'delete') {
      db.exams = db.exams.filter(x => x.id !== e.id);
      save();
      return ok(res);
    }
  }

  /* ---- ilerleyiş (öğrenci / veli / öğretmen / müdür) ---- */
  /* Öğrenci (ve velisi) kendi sınıfının ders programını görür. */

  return false;
}

module.exports = {
  uclar
};
