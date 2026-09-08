'use strict';
/* Sistem yöneticisi uçları (/api/admin).
   Müdür başvurularını onaylama, okullar, yedek alma ve geri yükleme. */

const fs = require('fs');
const path = require('path');
const { bad, baslikEkle, ok } = require('../http');
const { clean } = require('../ortak');
const {
  YEDEK_KLASOR, YEDEK_SAKLA, db, notify, save, schoolById,
  userById, yedekAl, yedekGeriYukle, yedekListesi
} = require('../veri');
const { pub } = require('../yetki');
const { islemYaz } = require('./islem-kaydi');

/* ---- uçlar ---- */
/* k: istek bağlamı (api.js kurar). Cevap yazılmadıysa yönlendirici 404 döner. */
async function uclar(k) {
  const { req, res, me, body, q, p, segs, method, need } = k;

  if (p === 'admin') {
    if (!need(['admin'])) return;
    const sub = segs[2] || '';
    if (sub === 'pending' && method === 'GET') {
      const list = db.users.filter(u => u.role === 'principal' && u.status === 'pending').map(u => {
        const s = schoolById(u.schoolId);
        return Object.assign(pub(u), { schoolName: s ? s.name : '' });
      });
      return ok(res, { principals: list });
    }
    if (sub === 'decide' && method === 'POST') {
      const u = userById(clean(body.userId, 60));
      if (!u || u.role !== 'principal') return bad(res, 'Müdür bulunamadı');
      const approve = !!body.approve;
      u.status = approve ? 'approved' : 'rejected';
      const s = schoolById(u.schoolId);
      if (s) s.status = approve ? 'approved' : 'rejected';
      notify(u.id, approve
        ? 'Müdürlük başvurun onaylandı. Artık okulunu yönetebilirsin.'
        : 'Müdürlük başvurun reddedildi.');
      save();
      return ok(res, { user: pub(u) });
    }
    /* ---------- yedekleme ---------- */

    if (sub === 'backups' && method === 'GET') {
      return ok(res, {
        yedekler: yedekListesi(),
        saklanan: YEDEK_SAKLA,
        klasor: YEDEK_KLASOR
      });
    }

    if (sub === 'backup-now' && method === 'POST') {
      const r = yedekAl(true);
      if (r.hata) return bad(res, r.hata, 500);
      return ok(res, { yedek: r, yedekler: yedekListesi() });
    }

    if (sub === 'backup-download' && method === 'GET') {
      const ad = String(q.get('ad') || '').replace(/[^a-zA-Z0-9._-]/g, '');
      if (!/^yedek-.*\.json$/.test(ad)) return bad(res, 'Geçersiz yedek adı');
      const dosya = path.join(YEDEK_KLASOR, ad);
      if (!fs.existsSync(dosya)) return bad(res, 'Yedek bulunamadı', 404);
      const veri = fs.readFileSync(dosya);
      res.writeHead(200, baslikEkle({
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Length': veri.length,
        'Content-Disposition': 'attachment; filename="' + ad + '"',
        'Cache-Control': 'no-store'
      }));
      return res.end(veri);
    }

    if (sub === 'backup-restore' && method === 'POST') {
      const r = yedekGeriYukle(body.ad);
      if (r.hata) return bad(res, r.hata);
      console.log('  ! Yedekten geri yüklendi: ' + r.ad);
      islemYaz(me, 'yedek.geri-yuklendi', r.ad, req);
      return ok(res, {
        message: r.ad + ' geri yüklendi. ' + r.kullanici + ' kullanıcı okundu.',
        yedekler: yedekListesi()
      });
    }

    if (sub === 'backup-delete' && method === 'POST') {
      const ad = String(body.ad || '').replace(/[^a-zA-Z0-9._-]/g, '');
      if (!/^yedek-.*\.json$/.test(ad)) return bad(res, 'Geçersiz yedek adı');
      const dosya = path.join(YEDEK_KLASOR, ad);
      if (!fs.existsSync(dosya)) return bad(res, 'Yedek bulunamadı', 404);
      fs.unlinkSync(dosya);
      return ok(res, { yedekler: yedekListesi() });
    }

    /* Tüm müdürler: görüntüleme ve gerekirse hesabı kaldırma. */
    if (sub === 'principals' && method === 'GET') {
      const liste = db.users
        .filter(u => u.role === 'principal')
        .map(u => {
          const sc = schoolById(u.schoolId);
          return {
            id: u.id, fullName: u.fullName, email: u.email, status: u.status,
            city: u.city, district: u.district,
            schoolName: sc ? sc.name : '(okul yok)',
            schoolStatus: sc ? sc.status : '',
            teachers: db.users.filter(x => x.role === 'teacher' && x.schoolId === u.schoolId).length,
            students: db.users.filter(x => x.role === 'student' && x.schoolId === u.schoolId).length,
            createdAt: u.createdAt
          };
        })
        .sort((a, b) => a.fullName.localeCompare(b.fullName, 'tr'));
      return ok(res, { principals: liste });
    }

    if (sub === 'principal-delete' && method === 'POST') {
      const u = userById(clean(body.userId, 60));
      if (!u || u.role !== 'principal') return bad(res, 'Müdür bulunamadı');

      /* Okulu silmiyoruz: öğretmen ve öğrenciler duruyor. Okul "beklemede"ye
         çekiliyor ki yeni kayıt alınmasın, sonra yeni müdür başvurabilsin. */
      const sc = schoolById(u.schoolId);
      if (sc) sc.status = 'pending';

      for (const tok of Object.keys(db.sessions)) {
        if (db.sessions[tok].userId === u.id) delete db.sessions[tok];
      }
      db.users = db.users.filter(x => x.id !== u.id);
      db.notifications = db.notifications.filter(n => n.userId !== u.id);
      save();
      return ok(res, { silinen: u.fullName, okul: sc ? sc.name : '' });
    }

    if (sub === 'overview' && method === 'GET') {
      return ok(res, {
        stats: {
          okul: db.schools.filter(s => s.status === 'approved').length,
          mudur: db.users.filter(u => u.role === 'principal' && u.status === 'approved').length,
          ogretmen: db.users.filter(u => u.role === 'teacher' && u.status === 'approved').length,
          ogrenci: db.users.filter(u => u.role === 'student').length,
          veli: db.users.filter(u => u.role === 'parent').length,
          bekleyen: db.users.filter(u => u.role === 'principal' && u.status === 'pending').length
        },
        schools: db.schools.map(s => {
          const pr = db.users.find(u => u.role === 'principal' && u.schoolId === s.id);
          return {
            id: s.id, name: s.name, city: s.city, district: s.district, status: s.status,
            principal: pr ? pr.fullName : '-',
            students: db.users.filter(u => u.role === 'student' && u.schoolId === s.id).length,
            teachers: db.users.filter(u => u.role === 'teacher' && u.schoolId === s.id && u.status === 'approved').length
          };
        })
      });
    }
  }

  /* ---- müdür ---- */

  return false;
}

module.exports = {
  uclar
};
