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

async function siniflarimUclari(k) {
  const { res, me, q, segs, method } = k;
  if (method !== 'GET') return bad(res, 'Böyle bir adres yok', 404);
  if (!yetkiVarMi(me, 'ogretmen.sonuclar')) return bad(res, 'Öğrenci sonuçlarını görme yetkin yok', 403);
  const siniflar = await girdigiSiniflar(me);

  if (segs[2] === 'siniflarim') {
    const ozet = new Map((await depo.siniflar.ozetleri(me.schoolId)).map(c => [c.id, c.studentCount]));
    return ok(res, { siniflar: [...siniflar.values()].map(c => Object.assign({ ogrenciSayisi: ozet.get(c.id) || 0 }, c)) });
  }
  if (segs[2] === 'sinif') {
    const c = siniflar.get(clean(q.get('id'), 60));
    if (!c) return bad(res, 'Bu sınıfa dersin yok', 403);
    const ogrenciler = (await depo.kullanicilar.sinifOgrencileri(c.id))
      .map(s => ({ id: s.id, fullName: s.fullName, okulNo: s.okulNo || '' }))
      .sort((a, b) => (Number(a.okulNo) || 1e9) - (Number(b.okulNo) || 1e9) || a.fullName.localeCompare(b.fullName, 'tr'));
    return ok(res, { sinif: c, ogrenciler });
  }
  if (segs[2] === 'ogrenci') {
    const st = await depo.kullanicilar.bul(clean(q.get('id'), 60));
    if (!st || st.role !== 'student' || st.schoolId !== me.schoolId || !siniflar.has(st.classId)) {
      return bad(res, 'Bu öğrencinin sınıfına dersin yok', 403);
    }
    /* Verdiğim ödevler (bu öğrenciye gidenler), bakılan yıla göre. */
    const odevler = (await yilSuz(me, await depo.odevler.ogretmenin(me.id)))
      .filter(a => a.studentIds.indexOf(st.id) >= 0)
      .map(a => ({ id: a.id, title: a.title, subject: a.subject, endAt: a.endAt, endTime: a.endTime, status: a.status,
        result: a.results[st.id] || null, acildi: !!a.acilma[st.id] }));
    /* Öğrencinin sınav sonuçları (bu okulun, bakılan yılın). */
    const [gruplar, tekler] = await Promise.all([
      depo.sinavlar.ogrencininGruplari(st.id).then(l => yilSuz(me, l)),
      depo.sinavlar.ogrencininTekSinavlari(st.id).then(l => yilSuz(me, l))
    ]);
    const sinavGruplari = gruplar.map(g => {
      let t = 0, w = 0;
      for (const e of g._sinavlar) {
        if (e.grade === null) continue;
        t += (Number(e.grade) - Number(e.alt)) / (Number(e.ust) - Number(e.alt)) * 100 * Number(e.weight);
        w += Number(e.weight);
      }
      return { id: g.id, name: g.name, subject: g.subject, ortalama: w ? Math.round(t / w * 100) / 100 : null,
        sinavlar: g._sinavlar.map(e => ({ name: e.name, grade: e.grade, alt: e.alt, ust: e.ust, weight: e.weight })) };
    });
    const sinavlar = tekler.map(s => ({ name: s.name, tarih: s.tarih, subject: s.subject, templateName: s.templateName,
      olcumler: s.olcumler.filter(o => o.deger !== null) }));
    return ok(res, { ogrenci: { id: st.id, fullName: st.fullName, sinif: siniflar.get(st.classId).ad, okulNo: st.okulNo || '' },
      odevler, sinavGruplari, sinavlar });
  }
  return bad(res, 'Böyle bir adres yok', 404);
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
