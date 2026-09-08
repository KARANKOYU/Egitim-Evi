'use strict';
/* Ödevler (/api/assignments) ve teslim saati yardımcıları. */

const { bad, ok } = require('../http');
const {
  branchOf, isTeacherLike, ogretmeninOgrencileri, ogretmeninSiniflari, saatDuzelt, sinifOgrencileri,
  summarize
} = require('../iliskiler');
const { RESULT_TYPES, SUBJECTS, clean, now, uid } = require('../ortak');
const { byId, classById, db, notify, save, userById } = require('../veri');
const { yetkiVarMi } = require('../yetki');
const { yilDamgasi, yilSuz } = require('./egitim-yili');

/* ============ ödev teslim saati ============
   Eski kayıtlarda yalnızca tarih vardı; saat alanı boşsa 12:00 sayılıyor.
   Çoğu öğretmen saati değiştirmiyor ama ders saatine göre ayarlayabilmeli. */

const ODEV_VARSAYILAN_SAAT = '12:00';

function odevSaati(a) {
  return saatDuzelt(a && a.endTime) || ODEV_VARSAYILAN_SAAT;
}

/* Ödevin son teslim anı — tarih + saat birleşmiş hâli. */
function odevBitisAni(a) {
  const t = clean(a && a.endAt, 10);
  if (!t) return null;
  const d = new Date(t + 'T' + odevSaati(a) + ':00');
  return isNaN(d.getTime()) ? null : d;
}

function odevGecikti(a) {
  const an = odevBitisAni(a);
  return an ? Date.now() > an.getTime() : false;
}

/* Sistem yöneticisinin okulu yok: schoolId'si boş. yetkiVarMi() admini
   her yetkiden geçirdiği için okul işlemleri de ona açık kalıyordu ve
   boş okula ait çöp kayıtlar oluşabiliyordu. Okula bağlı uçlar bunu
   açıkça reddetmeli. */

/* ---- uçlar ---- */
/* k: istek bağlamı (api.js kurar). Cevap yazılmadıysa yönlendirici 404 döner. */
async function uclar(k) {
  const { req, res, me, body, q, p, segs, method, need } = k;

  if (p === 'assignments') {
    if (!need(null)) return;
    if (!isTeacherLike(me) && method !== 'GET') return bad(res, 'Yetkin yok', 403);

    /* Ödev verirken kime gideceğini seçmek için: sınıflar ve öğrencileri. */
    if (method === 'GET' && segs[2] === 'hedefler') {
      if (!isTeacherLike(me)) return bad(res, 'Yetkin yok', 403);
      const siniflar = ogretmeninSiniflari(me)
        .sort((a, b) => a.name.localeCompare(b.name, 'tr'))
        .map(c => ({
          id: c.id, name: c.name,
          students: sinifOgrencileri(c.id)
            .sort((a, b) => a.fullName.localeCompare(b.fullName, 'tr'))
            .map(s => ({ id: s.id, fullName: s.fullName }))
        }));

      /* Sınıfsız öğrenciler de kaybolmasın */
      const ulasilan = ogretmeninOgrencileri(me);
      const sinifsiz = ulasilan.filter(s => !s.classId)
        .sort((a, b) => a.fullName.localeCompare(b.fullName, 'tr'))
        .map(s => ({ id: s.id, fullName: s.fullName }));
      if (sinifsiz.length) siniflar.push({ id: '', name: 'Sınıfsız öğrenciler', students: sinifsiz });

      /* Ödev hangi ders için veriliyor? */
      const dersler = db.lessons
        .filter(l => me.role === 'principal' ? l.schoolId === me.schoolId : l.teacherId === me.id)
        .map(l => {
          const c = classById(l.classId);
          return { id: l.id, subject: l.subject, classId: l.classId, className: c ? c.name : '' };
        })
        .sort((a, b) => (a.subject.localeCompare(b.subject, 'tr')) ||
                        (a.className.localeCompare(b.className, 'tr')));

      /* Aynı dersin farklı sınıflardaki kopyalarını tek başlıkta topla */
      const dersAdlari = [];
      for (const d of dersler) if (dersAdlari.indexOf(d.subject) < 0) dersAdlari.push(d.subject);

      return ok(res, {
        classes: siniflar,
        lessons: dersler,
        subjects: dersAdlari.length ? dersAdlari : SUBJECTS,
        varsayilanDers: me.role === 'teacher' ? (me.branch || '') : ''
      });
    }

    if (method === 'GET' && !segs[2]) {
      if (!isTeacherLike(me)) return bad(res, 'Yetkin yok', 403);
      const list = yilSuz(me, db.assignments.filter(a => a.teacherId === me.id))
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
        .map(a => ({
          id: a.id, title: a.title, description: a.description, subject: a.subject,
          startAt: a.startAt, endAt: a.endAt, endTime: odevSaati(a),
          gecikti: odevGecikti(a),
          status: a.status, createdAt: a.createdAt,
          studentCount: a.studentIds.length, summary: summarize(a)
        }));
      return ok(res, { assignments: list });
    }

    if (method === 'POST' && !segs[2]) {
      const title = clean(body.title, 120);
      if (!title) return bad(res, 'Ödev adı gerekli');

      const subject = clean(body.subject, 60) ||
        (me.role === 'teacher' ? me.branch : branchOf(me));
      if (!subject) return bad(res, 'Ders seç');

      /* Kime gideceği artık açıkça seçiliyor. Sadece ulaşabildiğin
         öğrencilere ödev verilebilir. */
      const ulasilan = ogretmeninOgrencileri(me);
      const izinli = new Set(ulasilan.map(s => s.id));
      const istenen = Array.isArray(body.studentIds) ? body.studentIds.map(x => String(x)) : [];
      const secilen = istenen.filter(id => izinli.has(id));

      if (!istenen.length) return bad(res, 'En az bir öğrenci seç');
      if (!secilen.length) return bad(res, 'Seçtiğin öğrencilere ödev veremezsin');

      /* Hangi sınıflara gittiğini de sakla: müdür ders bazlı bakabilsin. */
      const sinifIdler = [];
      for (const id of secilen) {
        const st = userById(id);
        if (st && st.classId && sinifIdler.indexOf(st.classId) < 0) sinifIdler.push(st.classId);
      }

      /* Rolünde ders/sınıf kapsamı varsa ona uymalı. */
      if (!yetkiVarMi(me, 'odev.ver', { ders: subject })) {
        return bad(res, subject + ' dersine ödev verme yetkin yok');
      }
      for (const cid of sinifIdler) {
        if (!yetkiVarMi(me, 'odev.ver', { sinif: cid })) {
          const c = classById(cid);
          return bad(res, (c ? c.name : 'Bu sınıf') + ' için ödev verme yetkin yok');
        }
      }

      const a = {
        id: uid('a'), teacherId: me.id, schoolId: me.schoolId, subject,
        title, description: clean(body.description, 1000),
        startAt: clean(body.startAt, 30), endAt: clean(body.endAt, 30),
        endTime: saatDuzelt(body.endTime) || ODEV_VARSAYILAN_SAAT,
        studentIds: secilen, classIds: sinifIdler,
        status: 'active', results: {}, yilId: yilDamgasi(me), createdAt: now()
      };
      db.assignments.push(a);
      secilen.forEach(id => notify(id, 'Yeni ödev: ' + title + ' (' + subject + ')'));
      save();
      return ok(res, { assignment: a, gonderilen: secilen.length });
    }

    const a = byId(db.assignments, segs[2] || '');
    if (!a) return bad(res, 'Ödev bulunamadı', 404);
    if (a.teacherId !== me.id) return bad(res, 'Yetkin yok', 403);

    if (method === 'GET') {
      return ok(res, {
        assignment: a,
        students: a.studentIds.map(id => {
          const s = userById(id);
          return { id, fullName: s ? s.fullName : '(silinmiş öğrenci)', result: a.results[id] || null };
        })
      });
    }
    if (method === 'POST' && segs[3] === 'finish') {
      const results = body.results || {};
      for (const id of a.studentIds) {
        const r = results[id];
        if (r && RESULT_TYPES.indexOf(r) >= 0) a.results[id] = r;
      }
      a.status = 'finished';
      a.finishedAt = now();
      a.studentIds.forEach(id => notify(id, '"' + a.title + '" ödevi sonuçlandı.'));
      save();
      return ok(res, { assignment: a });
    }
    if (method === 'POST' && segs[3] === 'reopen') {
      a.status = 'active';
      save();
      return ok(res, { assignment: a });
    }
    if (method === 'POST' && segs[3] === 'delete') {
      db.assignments = db.assignments.filter(x => x.id !== a.id);
      save();
      return ok(res);
    }
  }

  /* ---- sınav grupları ---- */

  return false;
}

module.exports = {
  ODEV_VARSAYILAN_SAAT,
  odevSaati,
  odevBitisAni,
  odevGecikti,
  uclar
};
