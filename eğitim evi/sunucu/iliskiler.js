'use strict';
/* Kim kimin öğretmeni, hangi sınıf hangi derste.
   Sınıf, ders ve ders programı yardımcıları; çakışma kontrolü;
   öğretmen-öğrenci ilişkisinin derslerden türetilmesi. */

const { classById, db, lessonById, schoolById, userById } = require('./veri');

const isTeacherLike = u => !!u && (u.role === 'teacher' || u.role === 'principal');

/* Öğretmenin ödev verebileceği öğrenciler:
   doğrudan atanmışlar + ders verdiği sınıflardaki herkes.
   Sınıf düzeni geldiğinden beri ikincisi asıl yol. */
function ogretmeninOgrencileri(u) {
  if (!u) return [];
  if (u.role === 'principal') {
    return db.users.filter(x => x.role === 'student' && x.schoolId === u.schoolId);
  }
  const bulunan = new Map();
  for (const s of studentsOfTeacher(u.id)) bulunan.set(s.id, s);
  for (const l of db.lessons) {
    if (l.teacherId !== u.id) continue;
    for (const s of sinifOgrencileri(l.classId)) bulunan.set(s.id, s);
  }
  return Array.from(bulunan.values());
}

/* Öğretmenin ders verdiği sınıflar (müdürde okulun tamamı). */
function ogretmeninSiniflari(u) {
  if (!u) return [];
  if (u.role === 'principal') {
    return db.classes.filter(c => c.schoolId === u.schoolId);
  }
  const idler = new Set(db.lessons.filter(l => l.teacherId === u.id).map(l => l.classId));
  /* Doğrudan atanmış öğrencilerin sınıfları da girsin. */
  for (const s of studentsOfTeacher(u.id)) if (s.classId) idler.add(s.classId);
  return db.classes.filter(c => idler.has(c.id));
}

/* Öğretmenin öğrencileri ders verdiği sınıflardan geliyor. Müdür derse
   öğretmen atayınca ilişki kendiliğinden kuruluyor; ayrıca öğrenci-öğretmen
   eşleştirmesi diye bir iş yok. Eski elle atamalar da sayılır ki geçmiş
   kayıtları olan okullarda sınav notları kaybolmasın. */
function studentsOfTeacher(teacherId) {
  const bulunan = new Map();
  for (const l of db.lessons) {
    if (l.teacherId !== teacherId) continue;
    for (const s of sinifOgrencileri(l.classId)) bulunan.set(s.id, s);
  }
  for (const l of db.teacherStudents) {
    if (l.teacherId !== teacherId) continue;
    const s = userById(l.studentId);
    if (s && s.role === 'student') bulunan.set(s.id, s);
  }
  return Array.from(bulunan.values())
    .sort((a, b) => a.fullName.localeCompare(b.fullName, 'tr'));
}
/* Öğrencinin öğretmenleri sınıfındaki derslerden türetiliyor: müdür derse
   öğretmen atayınca ilişki kendiliğinden kuruluyor, ayrıca öğrenci-öğretmen
   eşleştirmesi yapmak gerekmiyor. Eski elle atamalar varsa onlar da sayılır. */
function teachersOfStudent(studentId) {
  const st = userById(studentId);
  const idler = [];

  if (st && st.classId) {
    for (const l of db.lessons) {
      if (l.classId === st.classId && l.teacherId && idler.indexOf(l.teacherId) < 0) {
        idler.push(l.teacherId);
      }
    }
  }
  for (const l of db.teacherStudents) {
    if (l.studentId === studentId && idler.indexOf(l.teacherId) < 0) {
      idler.push(l.teacherId);
    }
  }
  return idler.map(id => userById(id)).filter(u => u && u.status === 'approved');
}
function branchOf(u) { return u.role === 'principal' ? (u.branch || 'Müdür') : (u.branch || ''); }

function canSeeStudent(viewer, studentId) {
  if (!viewer) return false;
  if (viewer.role === 'admin') return true;
  if (viewer.id === studentId) return true;
  if (viewer.role === 'parent') return db.parentLinks.some(l => l.parentId === viewer.id && l.studentId === studentId);
  const st = userById(studentId);
  if (!st) return false;
  if (viewer.role === 'principal') return st.schoolId === viewer.schoolId;
  if (viewer.role === 'teacher') return teachersOfStudent(studentId).some(t => t.id === viewer.id);
  return false;
}

/* ============ sınıf / ders / program ============ */

const GUN_ADLARI = ['', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'];
const GUN_SAYISI = 7;   // program Pazartesi'den Pazar'a kadar

/* Eski sabit "ders saati" düzeninden saat aralığına geçerken kullanılan
   varsayılan zil saatleri. Sadece eski kayıtları taşımak için. */

function saatDakika(metin) {
  const m = /^([0-9]{1,2}):([0-9]{2})$/.exec(String(metin || '').trim());
  if (!m) return null;
  const sa = parseInt(m[1], 10), dk = parseInt(m[2], 10);
  if (sa < 0 || sa > 23 || dk < 0 || dk > 59) return null;
  return sa * 60 + dk;
}

function saatDuzelt(metin) {
  const d = saatDakika(metin);
  if (d === null) return null;
  const sa = Math.floor(d / 60), dk = d % 60;
  return (sa < 10 ? '0' : '') + sa + ':' + (dk < 10 ? '0' : '') + dk;
}

/* İki aralık kesişiyor mu? Bitiş anı temas ediyorsa çakışma sayılmaz
   (10:00 biten ders ile 10:00 başlayan ders çakışmaz). */
function araliklarKesisiyor(bas1, bit1, bas2, bit2) {
  return bas1 < bit2 && bas2 < bit1;
}

function sinifOgrencileri(classId) {
  return db.users.filter(u => u.role === 'student' && u.classId === classId);
}

/* Bir dersin okunabilir adı: "7-A · Matematik" */
function dersEtiketi(l) {
  const c = classById(l.classId);
  return (c ? c.name : '?') + ' · ' + l.subject;
}

/* Programı gün ve başlangıç saatine göre sıralı döner. */
function programSirali(kayitlar) {
  return kayitlar.slice().sort((a, b) =>
    (a.day - b.day) || (saatDakika(a.start) - saatDakika(b.start)));
}

/* Çakışmalar:
   - aynı öğretmen aynı gün içinde kesişen saatlerde iki derste
   - aynı sınıf aynı gün içinde kesişen saatlerde iki derste           */
function cakismalariBul(schoolId) {
  const kayitlar = db.schedule.filter(sp => sp.schoolId === schoolId);
  const cakismalar = [];

  function ekle(tur, ad, a, b) {
    const la = lessonById(a.lessonId), lb = lessonById(b.lessonId);
    cakismalar.push({
      tur: tur,
      ad: ad,
      day: a.day,
      dayName: GUN_ADLARI[a.day] || ('Gün ' + a.day),
      saat: a.start + '-' + a.end + ' ↔ ' + b.start + '-' + b.end,
      lessons: [a, b].map((x, i) => {
        const l = i === 0 ? la : lb;
        const c = classById(x.classId);
        return {
          scheduleId: x.id,
          classId: x.classId,
          className: c ? c.name : '?',
          subject: l ? l.subject : '?',
          start: x.start, end: x.end
        };
      })
    });
  }

  for (let i = 0; i < kayitlar.length; i++) {
    for (let j = i + 1; j < kayitlar.length; j++) {
      const a = kayitlar[i], b = kayitlar[j];
      if (a.day !== b.day) continue;
      const ab = saatDakika(a.start), ae = saatDakika(a.end);
      const bb = saatDakika(b.start), be = saatDakika(b.end);
      if (ab === null || ae === null || bb === null || be === null) continue;
      if (!araliklarKesisiyor(ab, ae, bb, be)) continue;

      const la = lessonById(a.lessonId), lb = lessonById(b.lessonId);
      if (la && lb && la.teacherId && la.teacherId === lb.teacherId) {
        const t = userById(la.teacherId);
        ekle('ogretmen', t ? t.fullName : '(silinmiş öğretmen)', a, b);
      } else if (a.classId === b.classId) {
        const c = classById(a.classId);
        ekle('sinif', c ? c.name : '?', a, b);
      }
    }
  }

  cakismalar.sort((a, b) => (a.day - b.day) || a.saat.localeCompare(b.saat));
  return cakismalar;
}

/* Yeni bir aralık eklenmeden önce çakışma var mı diye bakar. */
function aralikCakismasi(schoolId, classId, teacherId, day, bas, bit, hariçId) {
  for (const sp of db.schedule) {
    if (sp.schoolId !== schoolId || sp.day !== day) continue;
    if (hariçId && sp.id === hariçId) continue;
    const sb = saatDakika(sp.start), se = saatDakika(sp.end);
    if (sb === null || se === null) continue;
    if (!araliklarKesisiyor(bas, bit, sb, se)) continue;

    const l = lessonById(sp.lessonId);
    if (sp.classId === classId) {
      return { tur: 'sinif', className: (classById(sp.classId) || {}).name || '?',
               subject: l ? l.subject : '?', start: sp.start, end: sp.end };
    }
    if (teacherId && l && l.teacherId === teacherId) {
      return { tur: 'ogretmen', className: (classById(sp.classId) || {}).name || '?',
               subject: l ? l.subject : '?', start: sp.start, end: sp.end };
    }
  }
  return null;
}

function dersOzeti(l) {
  const t = l.teacherId ? userById(l.teacherId) : null;
  const yerlesen = db.schedule.filter(sp => sp.lessonId === l.id).length;
  return {
    id: l.id, classId: l.classId, subject: l.subject,
    teacherId: l.teacherId || '',
    teacherName: t ? t.fullName : '',
    weeklyHours: l.weeklyHours || 0,
    placed: yerlesen
  };
}

function sinifOzeti(c) {
  const dersler = db.lessons.filter(l => l.classId === c.id);
  return {
    id: c.id, name: c.name,
    studentCount: sinifOgrencileri(c.id).length,
    lessonCount: dersler.length,
    /* Atanmamış ders sayısı: müdürün gözünden eksik iş */
    unassigned: dersler.filter(l => !l.teacherId).length
  };
}

function summarize(a) {
  if (a.status !== 'finished') return null;
  const s = { yapti: 0, yapmadi: 0, eksik: 0, izinli: 0, gelmedi: 0 };
  for (const id of a.studentIds) {
    const r = a.results[id];
    if (r && s[r] !== undefined) s[r]++;
  }
  return s;
}

function childrenOf(u) {
  if (!u || u.role !== 'parent') return [];
  return db.parentLinks.filter(l => l.parentId === u.id).map(l => {
    const s = userById(l.studentId);
    if (!s) return null;
    const sc = schoolById(s.schoolId);
    return { id: s.id, fullName: s.fullName, schoolName: sc ? sc.name : '', code: s.code };
  }).filter(Boolean);
}


module.exports = {
  isTeacherLike,
  ogretmeninOgrencileri,
  ogretmeninSiniflari,
  studentsOfTeacher,
  teachersOfStudent,
  branchOf,
  canSeeStudent,
  GUN_ADLARI,
  GUN_SAYISI,
  saatDakika,
  saatDuzelt,
  araliklarKesisiyor,
  sinifOgrencileri,
  dersEtiketi,
  programSirali,
  cakismalariBul,
  aralikCakismasi,
  dersOzeti,
  sinifOzeti,
  summarize,
  childrenOf
};
