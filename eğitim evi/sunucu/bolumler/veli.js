'use strict';
/* Veli uçları (/api/parent): çocuk bağlama ve çıkarma. */

const { hizSinir } = require('../guvenlik');
const { bad, ok } = require('../http');
const { childrenOf } = require('../iliskiler');
const { clean, now, uid } = require('../ortak');
const { db, notify, save } = require('../veri');

/* ---- uçlar ---- */
/* k: istek bağlamı (api.js kurar). Cevap yazılmadıysa yönlendirici 404 döner. */
async function uclar(k) {
  const { req, res, me, body, q, p, segs, method, need } = k;

  if (p === 'parent') {
    if (!need(['parent'])) return;
    if (segs[2] === 'children' && method === 'GET') return ok(res, { children: childrenOf(me) });
    if (segs[2] === 'link' && method === 'POST') {
      /* Veli kodu tahmin saldırısına karşı: hesap başına dakikada 5 deneme. */
      const kodAnahtar = 'kod:' + me.id;
      if (!hizSinir(kodAnahtar, 5, 60 * 1000)) {
        return bad(res, 'Çok fazla kod denemesi. Bir dakika bekleyip tekrar dene.', 429);
      }
      const code = clean(body.code, 40);
      const st = db.users.find(u => u.role === 'student' && u.code === code);
      if (!st) return bad(res, 'Bu koda sahip bir öğrenci bulunamadı');
      if (db.parentLinks.some(l => l.parentId === me.id && l.studentId === st.id)) return bad(res, 'Bu öğrenci zaten ekli');
      db.parentLinks.push({ id: uid('pl'), parentId: me.id, studentId: st.id, createdAt: now() });
      /* Veli kayıtta okul seçmiyor; çocuğuna bağlanınca onun okuluna
         bağlanmış oluyor. Takvim, mesaj ve duyurular buna dayanıyor. */
      if (!me.schoolId && st.schoolId) me.schoolId = st.schoolId;
      notify(st.id, me.fullName + ' veli olarak hesabına bağlandı.');
      save();
      return ok(res, { children: childrenOf(me) });
    }
    if (segs[2] === 'unlink' && method === 'POST') {
      const sid = clean(body.studentId, 60);
      db.parentLinks = db.parentLinks.filter(l => !(l.parentId === me.id && l.studentId === sid));
      save();
      return ok(res, { children: childrenOf(me) });
    }
  }

  /* ---- öğretmenin öğrencileri ---- */

  return false;
}

module.exports = {
  uclar
};
