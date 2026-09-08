'use strict';
/* Öğrencinin ilerleyişi: ödev sonuçları ve sınav ortalamaları.
   Öğrenci kendi, veli çocuğunun, öğretmen ve müdür öğrencinin ilerleyişini görür. */

const { bad, ok } = require('../http');
const { GUN_ADLARI, GUN_SAYISI, canSeeStudent, programSirali } = require('../iliskiler');
const { RESULT_TYPES, clean } = require('../ortak');
const { classById, db, lessonById, userById } = require('../veri');
const { pub } = require('../yetki');
const { yilSuz } = require('./egitim-yili');
const { odevSaati } = require('./odev');

/* ============ ilerleyiş hesabı ============ */
function progressOf(studentId, bakan) {
  const st = userById(studentId);
  if (!st) return null;

  /* --- ödevler ---
     Bakan kişi belliyse onun seçtiği eğitim yılına göre süzülür;
     geçmiş yıla bakan veli o yılın ödevlerini görür. */
  const mine = yilSuz(bakan || st, db.assignments
    .filter(a => a.studentIds.indexOf(studentId) >= 0))
    .sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));

  const bySubject = {};
  const assignmentList = [];
  for (const a of mine) {
    const t = userById(a.teacherId);
    const r = a.results ? a.results[studentId] : null;
    assignmentList.push({
      id: a.id, title: a.title, description: a.description, subject: a.subject,
      startAt: a.startAt, endAt: a.endAt, endTime: odevSaati(a), status: a.status,
      teacherName: t ? t.fullName : 'Bilinmiyor',
      result: a.status === 'finished' ? (r || null) : null
    });
    if (a.status !== 'finished') continue;
    if (!bySubject[a.subject]) {
      bySubject[a.subject] = { subject: a.subject, yapti: 0, yapmadi: 0,
        eksik: 0, izinli: 0, gelmedi: 0, toplam: 0 };
    }
    const row = bySubject[a.subject];
    if (r && RESULT_TYPES.indexOf(r) >= 0) { row[r]++; row.toplam++; }
  }
  for (const k in bySubject) {
    const r = bySubject[k];
    /* İzinli gelmemek oranı düşürmez; izinsiz gelmemek düşürür. */
    const sayilan = r.yapti + r.yapmadi + r.eksik + r.gelmedi;
    r.oran = sayilan > 0 ? Math.round((r.yapti + r.eksik * 0.5) / sayilan * 100) : null;
  }

  /* --- sınavlar --- */
  const groups = [];
  for (const g of db.examGroups) {
    const exams = db.exams.filter(e => e.groupId === g.id);
    if (!exams.length) continue;
    const linked = db.teacherStudents.some(l => l.teacherId === g.teacherId && l.studentId === studentId);
    const rows = [];
    let wsum = 0, wtot = 0, hasAny = false;
    for (const e of exams) {
      const has = e.grades && Object.prototype.hasOwnProperty.call(e.grades, studentId);
      const grade = has ? e.grades[studentId] : null;
      rows.push({ id: e.id, name: e.name, weight: e.weight, grade });
      if (has && grade !== null && !isNaN(grade)) {
        hasAny = true;
        wsum += Number(grade) * Number(e.weight);
        wtot += Number(e.weight);
      }
    }
    if (!linked && !hasAny) continue;
    const t = userById(g.teacherId);
    groups.push({
      id: g.id, name: g.name, subject: g.subject,
      teacherName: t ? t.fullName : 'Bilinmiyor',
      exams: rows,
      average: wtot > 0 ? Math.round(wsum / wtot * 100) / 100 : null
    });
  }

  return {
    student: pub(st),
    assignments: assignmentList,
    subjects: Object.keys(bySubject).map(k => bySubject[k]).sort((a, b) => a.subject.localeCompare(b.subject, 'tr')),
    examGroups: groups
  };
}

/* ---- uçlar ---- */
/* k: istek bağlamı (api.js kurar). Cevap yazılmadıysa yönlendirici 404 döner. */
async function uclar(k) {
  const { req, res, me, body, q, p, segs, method, need } = k;

  if (p === 'myschedule' && method === 'GET') {
    if (!need(null)) return;
    let hedef = me;
    const sid = clean(q.get('studentId'), 60);
    if (sid) {
      if (!canSeeStudent(me, sid)) return bad(res, 'Bu öğrenciyi görüntüleyemezsin', 403);
      hedef = userById(sid);
    } else if (me.role !== 'student') {
      return bad(res, 'Öğrenci seçmelisin', 400);
    }
    if (!hedef || hedef.role !== 'student') return bad(res, 'Öğrenci bulunamadı', 404);

    const c = hedef.classId ? classById(hedef.classId) : null;
    const dersler = !c ? [] : programSirali(db.schedule.filter(sp => sp.classId === c.id))
      .map(sp => {
        const l = lessonById(sp.lessonId);
        const t = l && l.teacherId ? userById(l.teacherId) : null;
        return {
          id: sp.id, day: sp.day, start: sp.start, end: sp.end,
          subject: l ? l.subject : '?',
          teacherName: t ? t.fullName : ''
        };
      });

    return ok(res, {
      className: c ? c.name : '',
      gunSayisi: GUN_SAYISI,
      gunAdlari: GUN_ADLARI,
      cells: dersler
    });
  }

  if (p === 'progress' && method === 'GET') {
    if (!me) return bad(res, 'Giriş yapmalısın', 401);
    const sid = clean(q.get('studentId'), 60) || me.id;
    if (!canSeeStudent(me, sid)) return bad(res, 'Bu öğrenciyi görme yetkin yok', 403);
    const data = progressOf(sid, me);
    if (!data) return bad(res, 'Öğrenci bulunamadı', 404);
    return ok(res, data);
  }

  /* ---- veli ---- */

  return false;
}

module.exports = {
  progressOf,
  uclar
};
