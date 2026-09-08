'use strict';
/* Takvim (/api/takvim): resmî tatiller, okul etkinlikleri, ödev teslimleri. */

const { bad, ok } = require('../http');
const { GUN_ADLARI } = require('../iliskiler');
const { clean, now, uid } = require('../ortak');
const { byId, classById, db, save, userById } = require('../veri');
const { okulGerek, yetkiVarMi } = require('../yetki');
const { bugun, gunBicimi } = require('./devamsizlik');
const { yilDamgasi, yilSuz } = require('./egitim-yili');
const { odevSaati } = require('./odev');

/* ============ takvim ============

   Takvim üç kaynaktan besleniyor:
     1. Sabit özel günler  — her yıl aynı tarihte (23 Nisan, 29 Ekim...)
     2. Dinî bayramlar     — ay takvimine göre kaydığı için tablodan
     3. Okulun kendi kaydı — müdürün eklediği tatil, toplantı, etkinlik
   Üstüne ödev teslim tarihleri ve haftalık ders programı bindiriliyor. */

const SABIT_GUNLER = [
  { ay: 1, gun: 1, ad: 'Yılbaşı', tatil: true },
  { ay: 3, gun: 18, ad: 'Çanakkale Zaferi', tatil: false },
  { ay: 4, gun: 23, ad: 'Ulusal Egemenlik ve Çocuk Bayramı', tatil: true },
  { ay: 5, gun: 1, ad: 'Emek ve Dayanışma Günü', tatil: true },
  { ay: 5, gun: 19, ad: 'Atatürk\'ü Anma, Gençlik ve Spor Bayramı', tatil: true },
  { ay: 7, gun: 15, ad: 'Demokrasi ve Millî Birlik Günü', tatil: true },
  { ay: 8, gun: 30, ad: 'Zafer Bayramı', tatil: true },
  { ay: 10, gun: 29, ad: 'Cumhuriyet Bayramı', tatil: true },
  { ay: 11, gun: 10, ad: 'Atatürk\'ü Anma Günü', tatil: false },
  { ay: 11, gun: 24, ad: 'Öğretmenler Günü', tatil: false }
];

/* Dinî bayramlar her yıl 10-11 gün kayıyor; hesaplanmıyor, tablodan okunuyor.
   Yeni yıl eklerken Diyanet takvimine bakıp buraya yaz. */
const DINI_BAYRAMLAR = {
  2026: [
    { bas: '2026-03-19', bit: '2026-03-22', ad: 'Ramazan Bayramı' },
    { bas: '2026-05-26', bit: '2026-05-30', ad: 'Kurban Bayramı' }
  ]
};

function tarihEkle(harita, tarih, kayit) {
  if (!harita[tarih]) harita[tarih] = [];
  harita[tarih].push(kayit);
}

/* Verilen ay için özel günleri tarih->liste haritası olarak döndürür. */
function ozelGunler(yil, ay) {
  const harita = {};
  const iki = n => (n < 10 ? '0' : '') + n;

  for (const g of SABIT_GUNLER) {
    if (g.ay !== ay) continue;
    tarihEkle(harita, yil + '-' + iki(g.ay) + '-' + iki(g.gun), {
      tur: g.tatil ? 'tatil' : 'ozel', baslik: g.ad
    });
  }

  for (const b of (DINI_BAYRAMLAR[yil] || [])) {
    const bas = new Date(b.bas + 'T00:00:00');
    const bit = new Date(b.bit + 'T00:00:00');
    for (let d = new Date(bas); d <= bit; d.setDate(d.getDate() + 1)) {
      if (d.getMonth() + 1 !== ay) continue;
      const t = d.getFullYear() + '-' + iki(d.getMonth() + 1) + '-' + iki(d.getDate());
      tarihEkle(harita, t, {
        tur: 'tatil',
        baslik: b.ad + (t === b.bas ? ' (arife)' : '')
      });
    }
  }
  return harita;
}

/* Takvimde hangi öğrencinin gözünden bakılıyor? */
function takvimHedefi(me, istenenId) {
  if (me.role === 'student') return me;
  if (!istenenId) return null;
  const st = userById(clean(istenenId, 60));
  if (!st || st.role !== 'student') return null;
  if (me.role === 'parent') {
    return db.parentLinks.some(l => l.parentId === me.id && l.studentId === st.id)
      ? st : null;
  }
  if (me.schoolId !== st.schoolId) return null;
  return st;
}

/* ---- uçlar ---- */
/* k: istek bağlamı (api.js kurar). Cevap yazılmadıysa yönlendirici 404 döner. */
async function uclar(k) {
  const { req, res, me, body, q, p, segs, method, need } = k;

  if (p === 'takvim') {
    if (!need()) return;
    if (!okulGerek(res, me)) return;
    const alt = segs[2] || '';

    /* Okul etkinliği ekle */
    if (alt === 'etkinlik' && method === 'POST') {
      if (!yetkiVarMi(me, 'takvim.yonet')) {
        return bad(res, 'Takvime ekleme yetkin yok', 403);
      }
      const tarih = gunBicimi(body.tarih);
      if (!tarih) return bad(res, 'Tarihi GG.AA.YYYY biçiminde seç');
      const baslik = clean(body.baslik, 100);
      if (!baslik) return bad(res, 'Başlık yaz');
      const tur = ['tatil', 'etkinlik', 'sinav', 'toplanti'].indexOf(clean(body.tur, 20)) >= 0
        ? clean(body.tur, 20) : 'etkinlik';
      const bitis = gunBicimi(body.bitis) || tarih;
      if (bitis < tarih) return bad(res, 'Bitiş tarihi başlangıçtan önce olamaz');

      const kayit = {
        id: uid('tk'), schoolId: me.schoolId, tarih: tarih, bitis: bitis,
        baslik: baslik, tur: tur, aciklama: clean(body.aciklama, 300),
        ekleyenId: me.id, yilId: yilDamgasi(me), createdAt: now()
      };
      db.takvim.push(kayit);
      save();
      return ok(res, { etkinlik: kayit, message: baslik + ' takvime eklendi.' });
    }

    /* Silme de POST: projenin geri kalanı GET/POST kullanıyor,
       DELETE için ayrı gövde okuma yolu açmaya değmez. */
    if (alt === 'etkinlik-sil' && method === 'POST') {
      if (!yetkiVarMi(me, 'takvim.yonet')) return bad(res, 'Yetkin yok', 403);
      const k = byId(db.takvim, clean(body.id, 60));
      if (!k || k.schoolId !== me.schoolId) return bad(res, 'Kayıt bulunamadı', 404);
      db.takvim = db.takvim.filter(x => x.id !== k.id);
      save();
      return ok(res, { message: 'Silindi.' });
    }

    /* Ay görünümü */
    if (!alt && method === 'GET') {
      const yil = Math.min(2100, Math.max(2000, parseInt(q.get('yil'), 10) || 0));
      const ay = Math.min(12, Math.max(1, parseInt(q.get('ay'), 10) || 0));
      if (!yil || !ay) return bad(res, 'Yıl ve ay gerekli');

      const iki = n => (n < 10 ? '0' : '') + n;
      const gunSayisi = new Date(yil, ay, 0).getDate();
      const ilkGun = new Date(yil, ay - 1, 1).getDay();      /* 0 = Pazar */
      const basSutun = (ilkGun + 6) % 7;                      /* Pazartesi = 0 */

      const harita = ozelGunler(yil, ay);
      const ayBas = yil + '-' + iki(ay) + '-01';
      const ayBit = yil + '-' + iki(ay) + '-' + iki(gunSayisi);

      /* --- okulun kendi kayıtları --- */
      for (const k of db.takvim) {
        if (k.schoolId !== me.schoolId) continue;
        const bas = k.tarih, bit = k.bitis || k.tarih;
        if (bit < ayBas || bas > ayBit) continue;
        for (let g = 1; g <= gunSayisi; g++) {
          const t = yil + '-' + iki(ay) + '-' + iki(g);
          if (t >= bas && t <= bit) {
            tarihEkle(harita, t, {
              tur: k.tur, baslik: k.baslik, aciklama: k.aciklama, id: k.id, silinebilir: true
            });
          }
        }
      }

      /* --- ödev teslim tarihleri --- */
      const hedef = takvimHedefi(me, q.get('studentId'));
      let odevler;
      if (hedef) {
        odevler = yilSuz(me, db.assignments.filter(a => a.studentIds.indexOf(hedef.id) >= 0));
      } else if (me.role === 'teacher' || me.role === 'principal') {
        odevler = yilSuz(me, db.assignments.filter(a => a.schoolId === me.schoolId &&
          (me.role === 'principal' || a.teacherId === me.id)));
      } else {
        odevler = [];
      }
      for (const a of odevler) {
        const t = clean(a.endAt, 10);
        if (t < ayBas || t > ayBit) continue;
        tarihEkle(harita, t, {
          tur: 'odev', baslik: a.title, aciklama: a.subject,
          saat: odevSaati(a), durum: a.status, id: a.id
        });
      }

      /* --- haftalık ders programı --- */
      let programKayit = [];
      if (hedef && hedef.classId) {
        programKayit = db.schedule.filter(sp => sp.classId === hedef.classId);
      } else if (me.role === 'teacher') {
        const benimDersler = db.lessons.filter(l => l.teacherId === me.id).map(l => l.id);
        programKayit = db.schedule.filter(sp => benimDersler.indexOf(sp.lessonId) >= 0);
      }
      const dersSayisi = {};
      for (const sp of programKayit) {
        for (let g = 1; g <= gunSayisi; g++) {
          const d = new Date(yil, ay - 1, g);
          const haftaGun = ((d.getDay() + 6) % 7) + 1;   /* Pazartesi = 1 */
          if (haftaGun !== sp.day) continue;
          const t = yil + '-' + iki(ay) + '-' + iki(g);
          dersSayisi[t] = (dersSayisi[t] || 0) + 1;
        }
      }

      /* --- günleri derle --- */
      const bugunT = bugun();
      const gunler = [];
      for (let g = 1; g <= gunSayisi; g++) {
        const t = yil + '-' + iki(ay) + '-' + iki(g);
        const d = new Date(yil, ay - 1, g);
        const haftaGun = ((d.getDay() + 6) % 7) + 1;
        const olaylar = harita[t] || [];
        gunler.push({
          tarih: t, gun: g, haftaGun: haftaGun,
          haftaSonu: haftaGun >= 6,
          bugun: t === bugunT,
          tatil: olaylar.some(o => o.tur === 'tatil'),
          dersSayisi: dersSayisi[t] || 0,
          olaylar: olaylar
        });
      }

      return ok(res, {
        yil: yil, ay: ay, basSutun: basSutun,
        bugun: bugunT,
        yonetebilir: yetkiVarMi(me, 'takvim.yonet'),
        ogrenci: hedef ? { id: hedef.id, ad: hedef.fullName } : null,
        gunler: gunler
      });
    }

    /* Tek günün ayrıntısı: o gün hangi dersler var, hangi ödev teslim */
    if (alt === 'gun' && method === 'GET') {
      const tarih = gunBicimi(q.get('tarih'));
      if (!tarih) return bad(res, 'Tarih gerekli');
      const d = new Date(tarih + 'T00:00:00');
      const haftaGun = ((d.getDay() + 6) % 7) + 1;

      const hedef = takvimHedefi(me, q.get('studentId'));
      let programKayit = [];
      if (hedef && hedef.classId) {
        programKayit = db.schedule.filter(sp =>
          sp.classId === hedef.classId && sp.day === haftaGun);
      } else if (me.role === 'teacher') {
        const benim = db.lessons.filter(l => l.teacherId === me.id).map(l => l.id);
        programKayit = db.schedule.filter(sp =>
          benim.indexOf(sp.lessonId) >= 0 && sp.day === haftaGun);
      }

      const dersler = programKayit
        .sort((a, b) => String(a.start).localeCompare(String(b.start)))
        .map(sp => {
          const l = byId(db.lessons, sp.lessonId);
          const c = classById(sp.classId);
          const t = l && l.teacherId ? userById(l.teacherId) : null;
          return {
            ders: l ? l.subject : '', sinif: c ? c.name : '',
            bas: sp.start, bit: sp.end, ogretmen: t ? t.fullName : ''
          };
        });

      /* Bu gün teslim edilecekler ve yaklaşanlar */
      let odevler;
      if (hedef) {
        odevler = yilSuz(me, db.assignments.filter(a => a.studentIds.indexOf(hedef.id) >= 0));
      } else if (me.role === 'teacher' || me.role === 'principal') {
        odevler = yilSuz(me, db.assignments.filter(a => a.schoolId === me.schoolId &&
          (me.role === 'principal' || a.teacherId === me.id)));
      } else {
        odevler = [];
      }

      const sonrakiSinir = new Date(d.getTime() + 7 * 86400000)
        .toISOString().slice(0, 10);

      const bugunkuler = [];
      const yaklasan = [];
      for (const a of odevler) {
        const t = clean(a.endAt, 10);
        const kayit = {
          id: a.id, baslik: a.title, ders: a.subject,
          tarih: t, saat: odevSaati(a), durum: a.status, aciklama: a.description
        };
        if (t === tarih) bugunkuler.push(kayit);
        else if (t > tarih && t <= sonrakiSinir) yaklasan.push(kayit);
      }
      yaklasan.sort((a, b) => a.tarih.localeCompare(b.tarih));

      const harita = ozelGunler(d.getFullYear(), d.getMonth() + 1);
      const olaylar = (harita[tarih] || []).slice();
      for (const k of db.takvim) {
        if (k.schoolId !== me.schoolId) continue;
        if (tarih >= k.tarih && tarih <= (k.bitis || k.tarih)) {
          olaylar.push({ tur: k.tur, baslik: k.baslik, aciklama: k.aciklama,
            id: k.id, silinebilir: true });
        }
      }

      return ok(res, {
        tarih: tarih,
        haftaGun: haftaGun,
        gunAdi: GUN_ADLARI[haftaGun] || '',
        olaylar: olaylar,
        dersler: dersler,
        teslim: bugunkuler,
        yaklasan: yaklasan.slice(0, 10),
        yonetebilir: yetkiVarMi(me, 'takvim.yonet')
      });
    }
  }

  /* ---------- işlem kaydı ---------- */

  return false;
}

module.exports = {
  SABIT_GUNLER,
  DINI_BAYRAMLAR,
  tarihEkle,
  ozelGunler,
  takvimHedefi,
  uclar
};
