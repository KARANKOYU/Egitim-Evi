'use strict';
/* /api yönlendiricisi.
   İsteği çözer (kullanıcı, gövde, sorgu), ortak bağlamı kurar ve yolun
   ilk parçasına göre ilgili bölüme (bolumler/) devreder. */

const http = require('http');
const { currentUser } = require('./guvenlik');
const { bad, readBody } = require('./http');

/* Bölümler: her biri kendi uçlarını `uclar(k)` ile sunar. */
const devamsizlik = require('./bolumler/devamsizlik');
const egitim_yili = require('./bolumler/egitim-yili');
const ilerleyis = require('./bolumler/ilerleyis');
const islem_kaydi = require('./bolumler/islem-kaydi');
const kayit = require('./bolumler/kayit');
const mesaj = require('./bolumler/mesaj');
const odev = require('./bolumler/odev');
const ogretmen = require('./bolumler/ogretmen');
const okul = require('./bolumler/okul');
const sinav = require('./bolumler/sinav');
const takvim = require('./bolumler/takvim');
const veli = require('./bolumler/veli');
const yonetici = require('./bolumler/yonetici');

/* Yolun ilk parçası -> bölüm. Bir yol yalnızca bir bölüme gider. */
const BOLUM = {
  'admin': yonetici,
  'assignments': odev,
  'challenge': kayit,
  'devamsizlik': devamsizlik,
  'egitim-yili': egitim_yili,
  'examgroups': sinav,
  'exams': sinav,
  'islem-kaydi': islem_kaydi,
  'login': kayit,
  'logout': kayit,
  'me': kayit,
  'mesajlar': mesaj,
  'meta': kayit,
  'myschedule': ilerleyis,
  'notifications': kayit,
  'okullar': kayit,
  'parent': veli,
  'password': kayit,
  'profile': kayit,
  'progress': ilerleyis,
  'register': kayit,
  'school': okul,
  'schools': kayit,
  'sifre-unuttum': kayit,
  'sifre-yenile': kayit,
  'takvim': takvim,
  'teacher': ogretmen,
};

async function handleApi(req, res, segs, method) {
  const me = currentUser(req);
  const body = (method === 'POST') ? await readBody(req) : {};
  const q = new URL(req.url, 'http://x').searchParams;
  const p = segs[1] || '';

  /* Giriş ve rol şartı. Bölümler içinde `if (!need(['admin'])) return;` diye kullanılır. */
  const need = roles => {
    if (!me) { bad(res, 'Giriş yapmalısın', 401); return false; }
    if (me.status !== 'approved') { bad(res, 'Hesabın henüz onaylanmadı', 403); return false; }
    if (roles && roles.indexOf(me.role) < 0) { bad(res, 'Bu işlem için yetkin yok', 403); return false; }
    return true;
  };

  const bolum = BOLUM[p];
  if (bolum) {
    await bolum.uclar({ req, res, me, body, q, p, segs, method, need });
    if (res.writableEnded || res.headersSent) return;
  }
  return bad(res, 'Böyle bir adres yok', 404);
}

module.exports = {
  handleApi
};
