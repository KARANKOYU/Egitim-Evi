'use strict';
/* Devamsızlık (/api/devamsizlik): yoklama alma ve özetler. */

const { bad, ok } = require('../http');
const { GUN_ADLARI, sinifOgrencileri, teachersOfStudent } = require('../iliskiler');
const { clean, now, uid } = require('../ortak');
const { byId, classById, db, notify, save, userById } = require('../veri');
const { okulGerek, yetkiKapsami, yetkiVarMi } = require('../yetki');
const { yilDamgasi, yilSuz } = require('./egitim-yili');
const { velileriBul } = require('./mesaj');

/* ============ devamsızlık ============
   Yoklama ders saati bazında alınır: aynı gün farklı derslerde ayrı kayıt.
   "var" durumundakiler saklanmaz — yalnızca devamsızlıklar tutulur,
   böylece tablo gereksiz büyümez. */

const DEVAM_DURUMLAR = ['var', 'yok', 'gec', 'izinli'];
const DEVAM_AD = {
  var: 'Geldi', yok: 'Gelmedi', gec: 'Geç geldi', izinli: 'İzinli'
};

function gunBicimi(metin) {
  const s2 = clean(metin, 10);
  return /^\d{4}-\d{2}-\d{2}$/.test(s2) ? s2 : '';
}

function bugun() {
  const d = new Date();
  const i = n => (n < 10 ? '0' : '') + n;
  return d.getFullYear() + '-' + i(d.getMonth() + 1) + '-' + i(d.getDate());
}

/* Bir derse yoklama alabilir mi?

   Öğretmenlerde 'devamsizlik.al' varsayılan olarak açık ve kapsamsız gelir;
   tek başına bırakılırsa herhangi bir öğretmen, hiç girmediği bir derste
   öğrenciyi devamsız yazabilirdi. Bu yüzden öğretmen için ek şart:
   ya ders kendisinin, ya da müdür ona bu ders/sınıf için açıkça kapsam vermiş. */
function yoklamaYetkisi(u, l) {
  if (!l) return false;
  if (!yetkiVarMi(u, 'devamsizlik.al', { ders: l.subject, sinif: l.classId })) return false;
  if (u.role !== 'teacher') return true;
  if (l.teacherId === u.id) return true;
  return !!yetkiKapsami(u, 'devamsizlik.al');
}

/* Bir öğrencinin devamsızlık dökümü. */
function devamsizlikOzeti(ogrenciId, gunSayisi, bakan) {
  const kayitlar = (bakan ? yilSuz(bakan, db.devamsizlik) : db.devamsizlik)
    .filter(k => k.ogrenciId === ogrenciId)
    .sort((a, b) => String(b.tarih).localeCompare(String(a.tarih)));

  const sinir = gunSayisi ? new Date(Date.now() - gunSayisi * 86400000)
    .toISOString().slice(0, 10) : '';
  const suzulmus = sinir ? kayitlar.filter(k => k.tarih >= sinir) : kayitlar;

  const sayim = { yok: 0, gec: 0, izinli: 0 };
  for (const k of suzulmus) if (sayim[k.durum] !== undefined) sayim[k.durum]++;

  return {
    sayim: sayim,
    toplam: suzulmus.length,
    kayitlar: suzulmus.slice(0, 200).map(k => {
      const l = byId(db.lessons, k.lessonId);
      const alan = userById(k.alanId);
      return {
        id: k.id, tarih: k.tarih, durum: k.durum,
        durumAd: DEVAM_AD[k.durum] || k.durum,
        ders: l ? l.subject : '', not: k.not || '',
        alan: alan ? alan.fullName : ''
      };
    })
  };
}

/* ---- uçlar ---- */
/* k: istek bağlamı (api.js kurar). Cevap yazılmadıysa yönlendirici 404 döner. */
async function uclar(k) {
  const { req, res, me, body, q, p, segs, method, need } = k;

  if (p === 'devamsizlik') {
    if (!need()) return;
    if (!okulGerek(res, me)) return;
    const alt = segs[2] || '';

    /* Öğretmenin yoklama alabileceği dersler */
    if (alt === 'derslerim' && method === 'GET') {
      /* Boş liste dönmek yerine açıkça reddet: öğrenci ve velinin bu uçta
         işi yok, 200 dönmesi denetimde yanlış izlenim veriyordu. */
      if (!yetkiVarMi(me, 'devamsizlik.al')) {
        return bad(res, 'Yoklama yetkin yok', 403);
      }
      const dersler = db.lessons.filter(l =>
        l.schoolId === me.schoolId && yoklamaYetkisi(me, l));
      return ok(res, {
        dersler: dersler.map(l => {
          const c = classById(l.classId);
          return {
            id: l.id, ders: l.subject,
            sinif: c ? c.name : '', classId: l.classId,
            ogrenciSayisi: sinifOgrencileri(l.classId).length
          };
        }).sort((a, b) => a.sinif.localeCompare(b.sinif, 'tr') ||
                          a.ders.localeCompare(b.ders, 'tr'))
      });
    }

    /* Yoklama ekranı: sınıfın öğrencileri + o güne girilmiş kayıtlar */
    if (alt === 'yoklama' && method === 'GET') {
      const l = byId(db.lessons, clean(q.get('lessonId'), 60));
      if (!l || l.schoolId !== me.schoolId) return bad(res, 'Ders bulunamadı');
      if (!yoklamaYetkisi(me, l)) {
        return bad(res, 'Bu ders için yoklama yetkin yok', 403);
      }
      const tarih = gunBicimi(q.get('tarih')) || bugun();
      const varolan = {};
      for (const k of db.devamsizlik) {
        if (k.lessonId === l.id && k.tarih === tarih) varolan[k.ogrenciId] = k;
      }
      const c = classById(l.classId);
      return ok(res, {
        ders: { id: l.id, ad: l.subject, sinif: c ? c.name : '' },
        tarih: tarih,
        durumlar: DEVAM_DURUMLAR.map(d => ({ k: d, ad: DEVAM_AD[d] })),
        ogrenciler: sinifOgrencileri(l.classId)
          .sort((a, b) => a.fullName.localeCompare(b.fullName, 'tr'))
          .map(o => ({
            id: o.id, ad: o.fullName,
            durum: varolan[o.id] ? varolan[o.id].durum : 'var',
            not: varolan[o.id] ? (varolan[o.id].not || '') : ''
          }))
      });
    }

    /* Yoklamayı kaydet — aynı gün tekrar alınırsa üzerine yazar. */
    if (alt === 'yoklama' && method === 'POST') {
      const l = byId(db.lessons, clean(body.lessonId, 60));
      if (!l || l.schoolId !== me.schoolId) return bad(res, 'Ders bulunamadı');
      if (!yoklamaYetkisi(me, l)) {
        return bad(res, 'Bu ders için yoklama yetkin yok', 403);
      }
      const tarih = gunBicimi(body.tarih) || bugun();
      if (tarih > bugun()) return bad(res, 'İleri tarihe yoklama alınamaz');

      const girisler = Array.isArray(body.girisler) ? body.girisler : [];
      if (!girisler.length) return bad(res, 'Yoklama boş');

      const sinifOgr = sinifOgrencileri(l.classId).map(o => o.id);

      /* O derse ait o günün eski kayıtlarını temizleyip yeniden yazıyoruz. */
      db.devamsizlik = db.devamsizlik.filter(k =>
        !(k.lessonId === l.id && k.tarih === tarih));

      let yazilan = 0;
      const bildirilecek = [];
      for (const g of girisler) {
        const oid = clean(g.ogrenciId, 60);
        if (sinifOgr.indexOf(oid) < 0) continue;
        const durum = clean(g.durum, 10);
        if (DEVAM_DURUMLAR.indexOf(durum) < 0) continue;
        /* "Geldi" kaydı tutulmuyor; yokluk anlamlı olan bilgi. */
        if (durum === 'var') continue;
        db.devamsizlik.push({
          id: uid('dv'), schoolId: me.schoolId, classId: l.classId,
          lessonId: l.id, ogrenciId: oid, tarih: tarih, durum: durum,
          not: clean(g.not, 200), alanId: me.id,
          yilId: yilDamgasi(me), createdAt: now()
        });
        yazilan++;
        bildirilecek.push({ oid, durum });
      }

      /* Öğrenciye ve velisine haber ver. */
      for (const b of bildirilecek) {
        if (b.durum === 'var') continue;
        const metin = tarih + ' ' + l.subject + ' dersi: ' + (DEVAM_AD[b.durum] || b.durum);
        notify(b.oid, metin, '#/devamsizligim');
        for (const v of velileriBul(b.oid)) {
          const o = userById(b.oid);
          notify(v.id, (o ? o.fullName + ' — ' : '') + metin, '#/cocuklarim');
        }
      }

      save();
      return ok(res, {
        yazilan: yazilan,
        message: yazilan
          ? yazilan + ' devamsızlık kaydedildi.'
          : 'Yoklama kaydedildi — herkes derste.'
      });
    }

    /* Öğrencinin kendi dökümü */
    if (alt === 'benim' && method === 'GET') {
      if (me.role !== 'student') return bad(res, 'Bu ekran öğrenciler için', 403);
      return ok(res, devamsizlikOzeti(me.id, Number(q.get('gun')) || 0, me));
    }

    /* Velinin çocuğu / öğretmen ve müdürün öğrenci dökümü */
    if (alt === 'ogrenci' && method === 'GET') {
      const st = userById(clean(q.get('studentId'), 60));
      if (!st || st.role !== 'student') return bad(res, 'Öğrenci bulunamadı');

      let izin = false;
      if (me.role === 'parent') {
        izin = db.parentLinks.some(x => x.parentId === me.id && x.studentId === st.id);
      } else if (me.schoolId === st.schoolId) {
        izin = yetkiVarMi(me, 'devamsizlik.gor') ||
          yetkiVarMi(me, 'devamsizlik.al', { sinif: st.classId }) ||
          teachersOfStudent(st.id).some(t => t.id === me.id);
      }
      if (!izin) return bad(res, 'Bu öğrencinin devamsızlığını görme yetkin yok', 403);

      const ozet = devamsizlikOzeti(st.id, Number(q.get('gun')) || 0, me);
      ozet.ogrenci = { id: st.id, ad: st.fullName };
      return ok(res, ozet);
    }

    /* Bir öğrencinin belirli bir günü: o gün programda hangi dersler var,
       her birinde durumu ne. Yoklama listesini tek tek gezmek yerine
       "şu öğrenci, şu gün" diye bakmak için. */
    if (alt === 'gun' && method === 'GET') {
      const st = userById(clean(q.get('studentId'), 60));
      if (!st || st.role !== 'student') return bad(res, 'Öğrenci bulunamadı');

      let izin = false;
      if (me.role === 'parent') {
        izin = db.parentLinks.some(x => x.parentId === me.id && x.studentId === st.id);
      } else if (me.id === st.id) {
        izin = true;
      } else if (me.schoolId === st.schoolId) {
        izin = yetkiVarMi(me, 'devamsizlik.gor') ||
          teachersOfStudent(st.id).some(t => t.id === me.id);
      }
      if (!izin) return bad(res, 'Bu öğrencinin kaydını görme yetkin yok', 403);

      const tarih = gunBicimi(q.get('tarih')) || bugun();
      const d = new Date(tarih + 'T00:00:00');
      const haftaGun = ((d.getDay() + 6) % 7) + 1;

      /* O gün sınıfın programındaki ders saatleri */
      const saatler = db.schedule
        .filter(sp => sp.classId === st.classId && sp.day === haftaGun)
        .sort((a, b) => String(a.start).localeCompare(String(b.start)));

      const kayitlar = db.devamsizlik.filter(k =>
        k.ogrenciId === st.id && k.tarih === tarih);

      const dersler = saatler.map((sp, i) => {
        const l = byId(db.lessons, sp.lessonId);
        const t = l && l.teacherId ? userById(l.teacherId) : null;
        const kayit = kayitlar.find(k => k.lessonId === sp.lessonId);
        /* Kaydı yoksa derse gelmiş sayılır — yoklamada yalnızca
           devamsızlıklar saklanıyor. */
        return {
          sira: i + 1,
          lessonId: sp.lessonId,
          ders: l ? l.subject : '',
          ogretmen: t ? t.fullName : '',
          bas: sp.start, bit: sp.end,
          durum: kayit ? kayit.durum : 'var',
          not: kayit ? (kayit.not || '') : '',
          duzenlenebilir: !!(l && yoklamaYetkisi(me, l))
        };
      });

      return ok(res, {
        ogrenci: { id: st.id, ad: st.fullName, classId: st.classId },
        tarih: tarih,
        gunAdi: GUN_ADLARI[haftaGun] || '',
        durumlar: DEVAM_DURUMLAR.map(x => ({ k: x, ad: DEVAM_AD[x] })),
        dersler: dersler
      });
    }

    /* Tek bir ders saatinin durumunu değiştir. */
    if (alt === 'isaretle' && method === 'POST') {
      const st = userById(clean(body.studentId, 60));
      if (!st || st.role !== 'student') return bad(res, 'Öğrenci bulunamadı');
      const l = byId(db.lessons, clean(body.lessonId, 60));
      if (!l || l.schoolId !== me.schoolId) return bad(res, 'Ders bulunamadı');
      if (!yoklamaYetkisi(me, l)) return bad(res, 'Bu ders için yetkin yok', 403);

      const tarih = gunBicimi(body.tarih);
      if (!tarih) return bad(res, 'Tarih gerekli');
      if (tarih > bugun()) return bad(res, 'İleri tarihe yoklama alınamaz');

      const durum = clean(body.durum, 10);
      if (DEVAM_DURUMLAR.indexOf(durum) < 0) return bad(res, 'Geçersiz durum');

      /* Eski kaydı sil, gerekirse yenisini yaz. */
      db.devamsizlik = db.devamsizlik.filter(k =>
        !(k.ogrenciId === st.id && k.lessonId === l.id && k.tarih === tarih));

      if (durum !== 'var') {
        db.devamsizlik.push({
          id: uid('dv'), schoolId: me.schoolId, classId: l.classId,
          lessonId: l.id, ogrenciId: st.id, tarih: tarih, durum: durum,
          not: clean(body.not, 200), alanId: me.id,
          yilId: yilDamgasi(me), createdAt: now()
        });
        const metin = tarih + ' ' + l.subject + ' dersi: ' + (DEVAM_AD[durum] || durum);
        notify(st.id, metin, '#/devamsizligim');
        for (const v of velileriBul(st.id)) {
          notify(v.id, st.fullName + ' — ' + metin, '#/cocuklarim');
        }
      }
      save();
      return ok(res, { durum: durum, message: 'Kaydedildi.' });
    }

    /* Okul geneli özet */
    if (alt === 'ozet' && method === 'GET') {
      if (!yetkiVarMi(me, 'devamsizlik.gor')) {
        return bad(res, 'Okul geneli devamsızlığı görme yetkin yok', 403);
      }
      const gun = Number(q.get('gun')) || 30;
      const sinir = new Date(Date.now() - gun * 86400000).toISOString().slice(0, 10);
      const kayitlar = yilSuz(me, db.devamsizlik.filter(k =>
        k.schoolId === me.schoolId && k.tarih >= sinir));

      const ogrHarita = new Map();
      for (const k of kayitlar) {
        if (!ogrHarita.has(k.ogrenciId)) {
          ogrHarita.set(k.ogrenciId, { yok: 0, gec: 0, izinli: 0 });
        }
        const h = ogrHarita.get(k.ogrenciId);
        if (h[k.durum] !== undefined) h[k.durum]++;
      }

      const satirlar = [];
      for (const [oid, h] of ogrHarita) {
        const o = userById(oid);
        if (!o) continue;
        const c = classById(o.classId);
        satirlar.push({
          id: oid, ad: o.fullName, sinif: c ? c.name : '',
          yok: h.yok, gec: h.gec, izinli: h.izinli,
          toplam: h.yok + h.gec + h.izinli
        });
      }
      satirlar.sort((a, b) => b.yok - a.yok || b.toplam - a.toplam);

      return ok(res, {
        gun: gun,
        toplamKayit: kayitlar.length,
        ogrenciSayisi: satirlar.length,
        satirlar: satirlar.slice(0, 300)
      });
    }
  }

  /* ---------- mesajlar ve duyurular ---------- */

  return false;
}

module.exports = {
  DEVAM_DURUMLAR,
  DEVAM_AD,
  gunBicimi,
  bugun,
  yoklamaYetkisi,
  devamsizlikOzeti,
  uclar
};
