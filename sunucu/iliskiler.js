'use strict';
/* Kim kimin öğretmeni, hangi sınıf hangi derste.
   Sınıf, ders ve ders programı yardımcıları; çakışma kontrolü;
   öğretmen-öğrenci ilişkisinin derslerden türetilmesi.

   Öğretmen-öğrenci ilişkisi YALNIZCA sınıf ve ders üzerinden kurulur:
   bir öğretmen, dersine girdiği sınıfların öğrencilerinin öğretmenidir.
   Sorgular sunucu/veri/depo/kullanicilar.js içinde (JOIN ile). */

const { depo } = require('./veri');
const { yetkiVarMi } = require('./yetki');

const isTeacherLike = u => !!u && (u.role === 'teacher' || u.role === 'principal');

/* Öğretmenin ödev verebileceği öğrenciler (müdürde okulun tamamı). */
async function ogretmeninOgrencileri(u) {
  if (!u) return [];
  if (u.role === 'principal') return depo.kullanicilar.okulun(u.schoolId, { rol: 'student' });
  return depo.kullanicilar.ogretmeninOgrencileri(u.id);
}

/* Öğretmenin ders verdiği sınıflar (müdürde okulun tamamı). */
async function ogretmeninSiniflari(u) {
  if (!u) return [];
  if (u.role === 'principal') return depo.siniflar.okulun(u.schoolId);
  const dersler = await depo.siniflar.ogretmeninDersleri(u.id);
  const gorulen = new Map();
  for (const l of dersler) {
    if (!gorulen.has(l.classId)) gorulen.set(l.classId, { id: l.classId, name: l._sinifAdi, schoolId: l.schoolId });
  }
  return Array.from(gorulen.values());
}

const studentsOfTeacher = ogretmenId => depo.kullanicilar.ogretmeninOgrencileri(ogretmenId);
const teachersOfStudent = ogrenciId => depo.kullanicilar.ogrencininOgretmenleri(ogrenciId);

function branchOf(u) { return u.role === 'principal' ? (u.branch || 'Müdür') : (u.branch || ''); }

async function canSeeStudent(viewer, studentId) {
  if (!viewer) return false;
  if (viewer.role === 'admin') return true;
  if (viewer.id === studentId) return true;
  /* Veli bağı rolden bağımsız: öğretmen ya da müdür de kendi çocuğunun velisidir. */
  if (viewer.role !== 'student' && await depo.kullanicilar.bagliMi(viewer.id, studentId)) return true;
  if (viewer.role === 'parent') return false;
  const st = await depo.kullanicilar.bul(studentId);
  if (!st) return false;
  if (viewer.role === 'principal') return st.schoolId === viewer.schoolId;
  /* "Öğrenci portalına girer" yetkisi (ör. rehber öğretmen): okulun bütün öğrencileri. */
  if (viewer.role === 'teacher' && st.schoolId === viewer.schoolId && yetkiVarMi(viewer, 'ogrenci.portal')) return true;
  if (viewer.role === 'teacher') return (await teachersOfStudent(studentId)).some(t => t.id === viewer.id);
  return false;
}

function saatDakika(metin) {
  const m = /^([0-9]{1,2}):([0-9]{2})$/.exec(String(metin || '').trim());
  if (!m) return null;
  const sa = parseInt(m[1], 10), dk = parseInt(m[2], 10);
  if (sa < 0 || sa > 23 || dk < 0 || dk > 59) return null;
  return sa * 60 + dk;
}

function dakikaSaat(d) {
  const sa = Math.floor(d / 60), dk = d % 60;
  return (sa < 10 ? '0' : '') + sa + ':' + (dk < 10 ? '0' : '') + dk;
}

function saatDuzelt(metin) {
  const d = saatDakika(metin);
  return d === null ? null : dakikaSaat(d);
}

/* İki aralık kesişiyor mu? Bitiş anı temas ediyorsa çakışma sayılmaz
   (10:00 biten ders ile 10:00 başlayan ders çakışmaz). */
function araliklarKesisiyor(bas1, bit1, bas2, bit2) {
  return bas1 < bit2 && bas2 < bit1;
}

const sinifOgrencileri = sinifId => depo.kullanicilar.sinifOgrencileri(sinifId);

/* Bir dersin okunabilir adı: "7-A · Matematik" (ders depodan sınıf adıyla gelir). */
function dersEtiketi(l) {
  return (l._sinifAdi || '?') + ' · ' + l.subject;
}

/* Programı gün ve başlangıç saatine göre sıralı döner. */
function programSirali(kayitlar) {
  return kayitlar.slice().sort((a, b) =>
    (a.day - b.day) || (saatDakika(a.start) - saatDakika(b.start)));
}

/* Çakışmalar: aynı öğretmen ya da aynı sınıf, aynı gün kesişen saatlerde.
   Tespit tek SQL sorgusunda (depo.siniflar.cakismalar); burada biçimlenir. */
async function cakismalariBul(schoolId) {
  const satirlar = await depo.siniflar.cakismalar(schoolId);
  const cakismalar = satirlar.map(r => {
    const ogretmen = !!r.a_ogretmen && r.a_ogretmen === r.b_ogretmen;
    return {
      tur: ogretmen ? 'ogretmen' : 'sinif',
      ad: ogretmen ? (r.ogretmen_adi || '(silinmiş öğretmen)') : r.a_sinif_adi,
      day: r.gun,
      dayName: GUN_ADLARI[r.gun] || ('Gün ' + r.gun),
      saat: r.a_bas + '-' + r.a_bit + ' ↔ ' + r.b_bas + '-' + r.b_bit,
      lessons: [
        { scheduleId: r.a_id, classId: r.a_sinif, className: r.a_sinif_adi, subject: r.a_ders,
          start: r.a_bas, end: r.a_bit },
        { scheduleId: r.b_id, classId: r.b_sinif, className: r.b_sinif_adi, subject: r.b_ders,
          start: r.b_bas, end: r.b_bit }
      ]
    };
  });
  cakismalar.sort((a, b) => (a.day - b.day) || a.saat.localeCompare(b.saat));
  return cakismalar;
}

/* Yeni bir aralık eklenmeden önce çakışma var mı diye bakar.
   bas / bit dakika cinsinden (09:20 -> 560). */
async function aralikCakismasi(schoolId, classId, teacherId, day, bas, bit, haricId) {
  const kesisenler = await depo.siniflar.aralikKesisenler(schoolId, day, dakikaSaat(bas), dakikaSaat(bit), haricId);
  for (const sp of kesisenler) {
    if (sp.classId === classId) {
      return { tur: 'sinif', className: sp._sinifAdi || '?', subject: sp._ders || '?', start: sp.start, end: sp.end };
    }
    if (teacherId && sp._ogretmenId === teacherId) {
      return { tur: 'ogretmen', className: sp._sinifAdi || '?', subject: sp._ders || '?', start: sp.start, end: sp.end };
    }
  }
  return null;
}

/* Ders depodan öğretmen adı ve programa yerleşen saat sayısıyla gelir. */
function dersOzeti(l) {
  return {
    id: l.id, classId: l.classId, subject: l.subject,
    teacherId: l.teacherId || '',
    teacherName: l._ogretmenAdi || '',
    weeklyHours: l.weeklyHours || 0,
    placed: l._yerlesen || 0
  };
}

async function sinifOzeti(c) {
  return (await depo.siniflar.ozetleri(c.schoolId, c.id))[0] || null;
}

function summarize(a) {
  if (a.status !== 'finished') return null;
  const s = { yapti: 0, yapmadi: 0, eksik: 0, gec: 0, izinli: 0, gelmedi: 0 };
  for (const id of a.studentIds) {
    const r = a.results[id];
    if (r && s[r] !== undefined) s[r]++;
  }
  return s;
}

/* Kişinin velisi olduğu çocuklar: veli, öğretmen ve müdür için (öğrencide yok). */
/* Oturumdaki kişinin çocukları. Okul rolü satırında (öğretmen@okul) boştur:
   çocuklar yetişkin hesabındadır, velilik ayrı bir seçimdir ("Veli — Ad"). */
async function childrenOf(u) {
  if (!u || !u.role || u.role === 'student' || u.role === 'admin' || u.anaHesapId) return [];
  return depo.kullanicilar.cocuklari(u.id);
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
  dakikaSaat,
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
