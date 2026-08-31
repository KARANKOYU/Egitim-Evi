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
