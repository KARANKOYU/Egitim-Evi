'use strict';
/* Sistem yöneticisi uçları (/api/admin).
   Okul açma ve kişi koduyla kişi bulma (yonetici-okul.js), müdürler, okullar,
   yedek alma ve geri yükleme. Müdür başvurusu yoktur: okulu yönetici açar. */

const fs = require('fs');
const path = require('path');
const { bad, baslikEkle, ok } = require('../http');
const { clean } = require('../ortak');
const {
  YEDEK_KLASOR, YEDEK_SAKLA, depo, islem, yedekAl, yedekGeriYukle, yedekListesi
} = require('../veri');
const { islemYaz } = require('./islem-kaydi');
const { kisiBul, okulAc } = require('./yonetici-okul');

/* ---- uçlar ---- */
/* k: istek bağlamı (api.js kurar). Cevap yazılmadıysa yönlendirici 404 döner. */
async function uclar(k) {
  const { req, res, me, body, q, p, segs, method, need } = k;

  if (p === 'admin') {
    if (!need(['admin'])) return;
    const sub = segs[2] || '';

    /* Yönetici okulu açar ve kişiyi kişi koduyla müdür yapar (yonetici-okul.js). */
    if (sub === 'okul-ac' && method === 'POST') return okulAc(req, res, me, body);
    if (sub === 'kisi-bul' && method === 'POST') return kisiBul(req, res, me, body);

    /* ---------- yedekleme ---------- */

    if (sub === 'backups' && method === 'GET') {
      return ok(res, {
        yedekler: yedekListesi(),
        saklanan: YEDEK_SAKLA,
        klasor: YEDEK_KLASOR
      });
    }

    if (sub === 'backup-now' && method === 'POST') {
      const r = await yedekAl(true);
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
      const r = await yedekGeriYukle(body.ad);
      if (r.hata) return bad(res, r.hata);
      console.log('  ! Yedekten geri yüklendi: ' + r.ad);
      /* Geri yüklemeden sonra yöneticinin kimliği değişmiş olabilir;
         kayıt, yüklenen verideki aynı kişiye yazılır. */
      await islemYaz(await depo.kullanicilar.bul(me.id), 'yedek.geri-yuklendi', r.ad, req);
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

    /* Tüm müdürler: görüntüleme ve gerekirse hesabı kaldırma.
       Sayılar tek sorguda (depo/kullanicilar.js mudurlerSayimli). */
    if (sub === 'principals' && method === 'GET') {
      const liste = (await depo.kullanicilar.mudurlerSayimli()).map(r => ({
        id: r.id, fullName: r.ad_soyad, username: r.kullanici_adi, email: r.eposta || '', status: r.durum,
        city: r.il, district: r.ilce,
        schoolName: r.okul_adi || '(okul yok)',
        schoolStatus: r.okul_durum || '',
        teachers: r.ogretmen,
        students: r.ogrenci,
        createdAt: r.olusturma
      }));
      return ok(res, { principals: liste });
    }

    if (sub === 'principal-delete' && method === 'POST') {
      const u = await depo.kullanicilar.bul(clean(body.userId, 60));
      if (!u || u.role !== 'principal') return bad(res, 'Müdür bulunamadı');

      /* Okulu silmiyoruz: öğretmen ve öğrenciler duruyor. Okul "beklemede"ye
         çekiliyor ki kimse giremesin. Yönetici okula yeni müdür atayabilir
         ("Okul aç" müdürsüz okulu tanır: yonetici-okul.js). Müdürün oturumları
         ve bildirimleri yabancı anahtarla birlikte silinir. */
      await islem(async () => {
        if (u.schoolId) await depo.okullar.durumYaz(u.schoolId, 'pending');
        await depo.kullanicilar.sil(u.id);
      });
      return ok(res, { silinen: u.fullName, okul: u._okulAdi || '' });
    }

    if (sub === 'overview' && method === 'GET') {
      const [sayi, okullar] = await Promise.all([depo.kullanicilar.sayimlar(), depo.okullar.genelBakis()]);
      return ok(res, {
        stats: {
          okul: sayi.okul, mudur: sayi.mudur, ogretmen: sayi.ogretmen,
          ogrenci: sayi.ogrenci, veli: sayi.veli
        },
        schools: okullar.map(s => ({
          id: s.id, name: s.name, city: s.city, district: s.district, status: s.status,
          principal: s._mudur || '-',
          students: s._ogrenci,
          teachers: s._ogretmen
        }))
      });
    }
  }

  return false;
}

module.exports = {
  uclar
};
