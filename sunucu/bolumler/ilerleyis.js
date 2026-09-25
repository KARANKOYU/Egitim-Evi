'use strict';
/* Öğrencinin ilerleyişi: ödev sonuçları ve sınavlar.
   Öğrenci kendi, veli çocuğunun, öğretmen ve müdür öğrencinin ilerleyişini görür. */

const { bad, ok } = require('../http');
const { GUN_ADLARI, GUN_SAYISI, canSeeStudent } = require('../iliskiler');
const { RESULT_TYPES, clean } = require('../ortak');
const { depo } = require('../veri');
const { yilSuz, bakisKisisi } = require('./egitim-yili');
const { odevBitisAni, odevSaati } = require('./odev');
const { ekGorunumu } = require('./ekler');

/* ============ ilerleyiş hesabı ============ */
async function progressOf(studentId, bakan) {
  const st = await depo.kullanicilar.bul(studentId);
  if (!st || st.role !== 'student') return null;

  /* --- ödevler ---
     Bakan kişi belliyse onun seçtiği eğitim yılına göre süzülür;
     geçmiş yıla bakan veli o yılın ödevlerini görür. Depo yeniden eskiye sıralı. */
  /* Yıldızlar öğrencinin kendisi içindir: yalnızca kendisi bakarken gelir. */
  const kendisi = !!bakan && bakan.id === studentId;
  /* Okulun kapattığı bölümler (ödev, sınav) gelmez. */
  const odevKapali = depo.ozellikler.kapaliMi(st.schoolId, 'odev');
  const sinavKapali = depo.ozellikler.kapaliMi(st.schoolId, 'sinav');
  const [odevler, ogretmenler, yildizli] = await Promise.all([
    odevKapali ? [] : depo.odevler.ogrencinin(studentId),
    st.schoolId ? depo.kullanicilar.okulun(st.schoolId, { roller: ['teacher', 'principal'] }) : [],
    kendisi ? depo.odevler.yildizlilari(studentId) : null
  ]);
  /* Veli çocuğunun gözünden bakar (çocuğun okulu ve geçmiş okulları);
     öğretmen ve müdür kendi okulunun kayıtlarını görür — nakil gelen
     öğrencinin eski okulundaki ödev ve notlar yeni okula görünmez. */
  const bakis = bakisKisisi(bakan || st, st);
  const mine = await yilSuz(bakis, odevler);
  const ekHaritasi = await depo.ekler.odevlerin(mine.map(a => a.id));
  const ogretmenAdi = new Map(ogretmenler.map(t => [t.id, t.fullName]));

  const bySubject = {};
  const assignmentList = [];
  for (const a of mine) {
    const r = a.results[studentId] || null;
    assignmentList.push({
      id: a.id, title: a.title, description: a.description, subject: a.subject,
      startAt: a.startAt, endAt: a.endAt, endTime: odevSaati(a), status: a.status,
      teacherName: ogretmenAdi.get(a.teacherId) || 'Bilinmiyor',
      acildi: !!a.acilma[studentId],
      result: a.status === 'finished' ? r : null,
      ekler: (ekHaritasi.get(a.id) || []).map(ekGorunumu)
    });
    if (yildizli) assignmentList[assignmentList.length - 1].yildizli = yildizli.has(a.id);
    if (a.status !== 'finished') continue;
    if (!bySubject[a.subject]) {
      bySubject[a.subject] = { subject: a.subject, yapti: 0, yapmadi: 0,
        eksik: 0, gec: 0, izinli: 0, gelmedi: 0, toplam: 0 };
    }
    const row = bySubject[a.subject];
    if (r && RESULT_TYPES.indexOf(r) >= 0) { row[r]++; row.toplam++; }
  }
  for (const k in bySubject) {
    const r = bySubject[k];
    /* İzinli gelmemek oranı düşürmez; izinsiz gelmemek düşürür.
       Geç ya da eksik yapılan ödev yarım sayılır. */
    const sayilan = r.yapti + r.yapmadi + r.eksik + r.gec + r.gelmedi;
    r.oran = sayilan > 0 ? Math.round((r.yapti + (r.eksik + r.gec) * 0.5) / sayilan * 100) : null;
  }

  /* --- sınavlar ---
     Gruptakiler: ağırlıklı ortalama (100 üzerinden). Grupsuz sınavlar ayrı listede. */
  const [gruplar, tekSinavlar] = await Promise.all([
    sinavKapali ? [] : depo.sinavlar.ogrencininGruplari(studentId).then(l => yilSuz(bakis, l)),
    sinavKapali ? [] : depo.sinavlar.ogrencininTekSinavlari(studentId).then(l => yilSuz(bakis, l))
  ]);
  const groups = gruplar.map(g => {
    let wsum = 0, wtot = 0;
    for (const e of g._sinavlar) {
      if (e.grade === null) continue;
      const yuzde = (Number(e.grade) - Number(e.alt)) / (Number(e.ust) - Number(e.alt)) * 100;
      wsum += yuzde * Number(e.weight);
      wtot += Number(e.weight);
    }
    return {
      id: g.id, name: g.name, subject: g.subject,
      teacherName: g._ogretmenAdi || 'Bilinmiyor',
      exams: g._sinavlar.map(e => ({ id: e.id, name: e.name, weight: e.weight, grade: e.grade, alt: e.alt, ust: e.ust })),
      average: wtot > 0 ? yuvarla(wsum / wtot) : null
    };
  });

  /* Öğrenci görünümü dar tutulur: bu uç öğrencinin dersine giren her
     öğretmene de açık; veli kodu, adres, telefon, e-posta, doğum tarihi gitmez. */
  return {
    student: { id: st.id, fullName: st.fullName, grade: st.grade || '', schoolName: st._okulAdi || '' },
    assignments: assignmentList,
    subjects: Object.keys(bySubject).map(k => bySubject[k]).sort((a, b) => a.subject.localeCompare(b.subject, 'tr')),
    examGroups: groups,
    exams: tekSinavlar.map(s => { delete s.schoolId; delete s.yilId; return s; }),
    kapaliOzellikler: depo.ozellikler.kapalilar(st.schoolId),
    /* Seri yalnızca öğrencinin kendisine (teşvik; kimseyle karşılaştırılmaz). */
    seri: kendisi ? odevSerisi(mine, studentId) : undefined
  };
}

/* ---- uçlar ---- */
/* k: istek bağlamı (api.js kurar). Cevap yazılmadıysa yönlendirici 404 döner. */
async function uclar(k) {
  const { res, me, q, p, method, need } = k;

  /* Öğrenci (ve velisi) kendi sınıfının ders programını görür. */
  if (p === 'myschedule' && method === 'GET') {
    if (!need(null)) return;
    let hedef = me;
    const sid = clean(q.get('studentId'), 60);
    if (sid) {
      if (!await canSeeStudent(me, sid)) return bad(res, 'Bu öğrenciyi görüntüleyemezsin', 403);
      hedef = await depo.kullanicilar.bul(sid);
    } else if (me.role !== 'student') {
      return bad(res, 'Öğrenci seçmelisin', 400);
    }
    if (!hedef || hedef.role !== 'student') return bad(res, 'Öğrenci bulunamadı', 404);

    const c = hedef.classId ? await depo.siniflar.bul(hedef.classId) : null;
    const dersler = !c ? [] : (await depo.siniflar.sinifinProgrami(c.id)).map(sp => ({
      id: sp.id, day: sp.day, start: sp.start, end: sp.end,
      subject: sp._ders || '?',
      teacherName: sp._ogretmenAdi || ''
    }));

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
    if (!await canSeeStudent(me, sid)) return bad(res, 'Bu öğrenciyi görme yetkin yok', 403);
    const data = await progressOf(sid, me);
    if (!data) return bad(res, 'Öğrenci bulunamadı', 404);
    return ok(res, data);
  }

  return false;
}

module.exports = {
  odevSerisi,
  progressOf,
  uclar
};
