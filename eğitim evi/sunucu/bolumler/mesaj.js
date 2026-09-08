'use strict';
/* Mesajlar ve duyurular (/api/mesajlar).
   Öğrenciye giden mesaj velisine de gider; öğrenci öğrenciye yazamaz. */

const { hizSinir } = require('../guvenlik');
const { bad, ok } = require('../http');
const { branchOf, sinifOgrencileri, teachersOfStudent } = require('../iliskiler');
const { clean, now, uid } = require('../ortak');
const { byId, classById, db, notify, save, userById } = require('../veri');
const { okulGerek, yetkiVarMi } = require('../yetki');

/* ============ mesajlaşma ve duyurular ============

   Tek tablo iki iş görüyor:
     duyuru — müdür/öğretmen yazar, hedef gruba düşer, cevaplanmaz
     mesaj  — kişiye yazılır, alıcının izin ayarına takılabilir

   Öğrenciye giden her şeyin bir kopyası velisine de düşer; veli
   çocuğuna ne söylendiğini görebilmeli. */

const MESAJ_KONU_SINIR = 120;
const MESAJ_GOVDE_SINIR = 4000;
const MESAJ_SAATLIK_SINIR = 30;

/* Alıcı bir öğrenciyse velilerini de listeye ekler. */
function velileriBul(ogrenciId) {
  return db.parentLinks
    .filter(l => l.studentId === ogrenciId)
    .map(l => userById(l.parentId))
    .filter(v => v && v.status === 'approved');
}

function mesajAyari(u) {
  const a = u.mesajAyar || {};
  return {
    kimden: ['herkes', 'personel', 'kapali'].indexOf(a.kimden) >= 0 ? a.kimden : 'herkes',
    engelli: Array.isArray(a.engelli) ? a.engelli : []
  };
}

/* Gönderen bu kişiye yazabilir mi?
   Duyurular ayarları aşar: kar tatili duyurusu herkese ulaşmalı. */
function mesajGidebilirMi(gonderen, alici, tur) {
  if (!alici || alici.status !== 'approved') return false;
  if (alici.id === gonderen.id) return false;
  if (tur === 'duyuru') return true;

  const ayar = mesajAyari(alici);
  if (ayar.engelli.indexOf(gonderen.id) >= 0) return false;
  if (ayar.kimden === 'kapali') return false;
  if (ayar.kimden === 'personel' &&
      gonderen.role !== 'teacher' && gonderen.role !== 'principal') return false;
  return true;
}

/* Kişi mesaj kutusunda kimleri görebilir / kime yazabilir.
   Öğrenci ve veli yalnızca ilgili öğretmenlere ve müdüre yazabilir;
   böylece okul içi rehber listesi herkese açılmıyor. */
function mesajYazilabilirler(me) {
  const okul = db.users.filter(u =>
    u.schoolId === me.schoolId && u.status === 'approved' && u.id !== me.id);

  if (me.role === 'principal' || me.role === 'teacher') return okul;

  if (me.role === 'student') {
    const ogretmenler = teachersOfStudent(me.id).map(t => t.id);
    return okul.filter(u => u.role === 'principal' || ogretmenler.indexOf(u.id) >= 0);
  }

  if (me.role === 'parent') {
    const cocuklar = db.parentLinks.filter(l => l.parentId === me.id).map(l => l.studentId);
    const ogretmenler = [];
    for (const c of cocuklar) {
      for (const t of teachersOfStudent(c)) {
        if (ogretmenler.indexOf(t.id) < 0) ogretmenler.push(t.id);
      }
    }
    return okul.filter(u => u.role === 'principal' || ogretmenler.indexOf(u.id) >= 0);
  }
  return [];
}

/* Hedef tanımını gerçek kullanıcı listesine çevirir. */
function mesajAlicilariCoz(me, hedef, tur) {
  const okul = db.users.filter(u =>
    u.schoolId === me.schoolId && u.status === 'approved');
  let secilen = [];
  let ozet = '';

  const t = clean(hedef && hedef.tur, 20);

  if (t === 'okul') {
    if (!yetkiVarMi(me, 'mesaj.herkese')) return { hata: 'Tüm okula gönderme yetkin yok' };
    secilen = okul.slice();
    ozet = 'Tüm okul';

  } else if (t === 'rol') {
    if (!yetkiVarMi(me, 'mesaj.toplu')) return { hata: 'Toplu gönderme yetkin yok' };
    const roller = (Array.isArray(hedef.roller) ? hedef.roller : [])
      .map(r => clean(r, 20))
      .filter(r => ['student', 'parent', 'teacher', 'principal'].indexOf(r) >= 0);
    if (!roller.length) return { hata: 'En az bir rol seç' };
    secilen = okul.filter(u => roller.indexOf(u.role) >= 0);
    const ROL_AD = { student: 'Öğrenciler', parent: 'Veliler',
      teacher: 'Öğretmenler', principal: 'Yöneticiler' };
    ozet = roller.map(r => ROL_AD[r]).join(', ');

  } else if (t === 'sinif') {
    if (!yetkiVarMi(me, 'mesaj.toplu')) return { hata: 'Toplu gönderme yetkin yok' };
    const idler = (Array.isArray(hedef.siniflar) ? hedef.siniflar : [])
      .map(x => clean(x, 60));
    if (!idler.length) return { hata: 'En az bir sınıf seç' };
    const adlar = [];
    for (const cid of idler) {
      const c = classById(cid);
      if (!c || c.schoolId !== me.schoolId) continue;
      adlar.push(c.name);
      for (const o of sinifOgrencileri(cid)) {
        if (secilen.indexOf(o) < 0) secilen.push(o);
      }
    }
    if (!adlar.length) return { hata: 'Sınıf bulunamadı' };
    ozet = adlar.join(', ');

  } else if (t === 'kisi') {
    const izinli = mesajYazilabilirler(me);
    const idler = (Array.isArray(hedef.kisiler) ? hedef.kisiler : [])
      .map(x => clean(x, 60));
    if (!idler.length) return { hata: 'En az bir kişi seç' };
    for (const id of idler) {
      const u = izinli.find(x => x.id === id);
      if (u && secilen.indexOf(u) < 0) secilen.push(u);
    }
    if (!secilen.length) return { hata: 'Seçtiğin kişilere yazma yetkin yok' };
    ozet = secilen.length <= 3
      ? secilen.map(u => u.fullName).join(', ')
      : secilen.length + ' kişi';

  } else {
    return { hata: 'Geçersiz hedef' };
  }

  /* İzin ayarına takılanları ele. */
  const gecenler = secilen.filter(u => mesajGidebilirMi(me, u, tur));
  const elenen = secilen.length - gecenler.length;

  /* Öğrenciye giden her şey velisine de gitsin. */
  const alicilar = gecenler.map(u => ({ id: u.id, ogrenciId: '' }));
  const eklendi = {};
  for (const u of gecenler) {
    if (u.role !== 'student') continue;
    for (const veli of velileriBul(u.id)) {
      const anahtar = veli.id + '|' + u.id;
      if (eklendi[anahtar]) continue;
      if (alicilar.some(a => a.id === veli.id && a.ogrenciId === u.id)) continue;
      eklendi[anahtar] = 1;
      alicilar.push({ id: veli.id, ogrenciId: u.id });
    }
  }

  return { alicilar, ozet, elenen };
}

function mesajOzeti(m, benimId) {
  const gonderen = userById(m.gonderenId);
  const benim = m.alicilar.filter(a => a.id === benimId);
  const cocukIcin = benim.filter(a => a.ogrenciId).map(a => {
    const o = userById(a.ogrenciId);
    return o ? o.fullName : '';
  }).filter(Boolean);

  return {
    id: m.id,
    tur: m.tur,
    konu: m.konu,
    onizleme: String(m.govde || '').slice(0, 140),
    gonderenId: m.gonderenId,
    gonderen: gonderen ? gonderen.fullName : 'Silinmiş kullanıcı',
    gonderenRol: gonderen ? gonderen.role : '',
    tarih: m.tarih,
    hedefOzet: m.hedefOzet,
    aliciSayisi: m.alicilar.length,
    okundu: (m.okuyanlar || []).indexOf(benimId) >= 0,
    cocukIcin: cocukIcin
  };
}

/* ---- uçlar ---- */
/* k: istek bağlamı (api.js kurar). Cevap yazılmadıysa yönlendirici 404 döner. */
async function uclar(k) {
  const { req, res, me, body, q, p, segs, method, need } = k;

  if (p === 'mesajlar') {
    if (!need()) return;
    if (!okulGerek(res, me)) return;
    const alt = segs[2] || '';

    /* Kime yazabilirim + hangi toplu seçenekler açık */
    if (alt === 'hedefler' && method === 'GET') {
      const kisiler = mesajYazilabilirler(me)
        .map(u => ({
          id: u.id, ad: u.fullName, rol: u.role,
          brans: u.role === 'teacher' ? branchOf(u) : '',
          kapali: !mesajGidebilirMi(me, u, 'mesaj')
        }))
        .sort((a, b) => a.ad.localeCompare(b.ad, 'tr'));

      return ok(res, {
        kisiler: kisiler,
        topluIzin: yetkiVarMi(me, 'mesaj.toplu'),
        okulIzin: yetkiVarMi(me, 'mesaj.herkese'),
        duyuruIzin: yetkiVarMi(me, 'mesaj.toplu'),
        siniflar: yetkiVarMi(me, 'mesaj.toplu')
          ? db.classes.filter(c => c.schoolId === me.schoolId)
              .map(c => ({ id: c.id, ad: c.name, sayi: sinifOgrencileri(c.id).length }))
              .sort((a, b) => a.ad.localeCompare(b.ad, 'tr'))
          : []
      });
    }

    /* Mesaj izin ayarları */
    if (alt === 'ayar' && method === 'GET') {
      const a = mesajAyari(me);
      return ok(res, {
        kimden: a.kimden,
        engelli: a.engelli.map(id => {
          const u = userById(id);
          return u ? { id: u.id, ad: u.fullName, rol: u.role } : null;
        }).filter(Boolean)
      });
    }

    if (alt === 'ayar' && method === 'POST') {
      const kimden = clean(body.kimden, 20);
      if (['herkes', 'personel', 'kapali'].indexOf(kimden) < 0) {
        return bad(res, 'Geçersiz seçim');
      }
      const engelli = (Array.isArray(body.engelli) ? body.engelli : [])
        .map(x => clean(x, 60))
        .filter(id => {
          const u = userById(id);
          return u && u.schoolId === me.schoolId && u.id !== me.id;
        })
        .slice(0, 200);
      me.mesajAyar = { kimden, engelli };
      save();
      return ok(res, { kimden, engelli: engelli.length });
    }

    /* Gelen kutusu ve gönderilenler */
    if (!alt && method === 'GET') {
      const kutu = clean(q.get('kutu'), 20) || 'gelen';
      const tur = clean(q.get('tur'), 20);   /* '' | 'duyuru' | 'mesaj' */

      let liste;
      if (kutu === 'giden') {
        liste = db.mesajlar.filter(m => m.gonderenId === me.id);
      } else {
        liste = db.mesajlar.filter(m => m.alicilar.some(a => a.id === me.id));
      }
      if (tur) liste = liste.filter(m => m.tur === tur);

      liste.sort((a, b) => String(b.tarih).localeCompare(String(a.tarih)));
      const okunmamis = db.mesajlar.filter(m =>
        m.alicilar.some(a => a.id === me.id) &&
        (m.okuyanlar || []).indexOf(me.id) < 0).length;

      return ok(res, {
        kutu: kutu,
        okunmamis: okunmamis,
        mesajlar: liste.slice(0, 200).map(m => mesajOzeti(m, me.id))
      });
    }

    /* Ana sayfada gösterilecek son duyurular */
    if (alt === 'duyurular' && method === 'GET') {
      const liste = db.mesajlar
        .filter(m => m.tur === 'duyuru' && m.alicilar.some(a => a.id === me.id))
        .sort((a, b) => String(b.tarih).localeCompare(String(a.tarih)))
        .slice(0, 5);
      return ok(res, { duyurular: liste.map(m => mesajOzeti(m, me.id)) });
    }

    /* Yeni mesaj / duyuru */
    if (!alt && method === 'POST') {
      if (!hizSinir('mesaj:' + me.id, MESAJ_SAATLIK_SINIR, 60 * 60 * 1000)) {
        return bad(res, 'Saatlik mesaj sınırına ulaştın. Biraz bekle.', 429);
      }

      const tur = clean(body.tur, 20) === 'duyuru' ? 'duyuru' : 'mesaj';
      if (tur === 'duyuru' && !yetkiVarMi(me, 'mesaj.toplu')) {
        return bad(res, 'Duyuru yayımlama yetkin yok', 403);
      }

      const konu = clean(body.konu, MESAJ_KONU_SINIR);
      if (!konu) return bad(res, 'Konu yaz');
      const govde = clean(body.govde, MESAJ_GOVDE_SINIR);
      if (!govde) return bad(res, 'Mesaj metni boş olamaz');

      const cozum = mesajAlicilariCoz(me, body.hedef || {}, tur);
      if (cozum.hata) return bad(res, cozum.hata);
      if (!cozum.alicilar.length) {
        return bad(res, 'Alıcı kalmadı. Seçtiğin kişiler mesaj almayı kapatmış olabilir.');
      }

      const m = {
        id: uid('m'), schoolId: me.schoolId, gonderenId: me.id,
        tur: tur, konu: konu, govde: govde,
        hedefOzet: cozum.ozet, alicilar: cozum.alicilar,
        okuyanlar: [], tarih: now()
      };
      db.mesajlar.push(m);

      /* Bildirim: aynı kişiye birden çok kopya gitmesin. */
      const bildirildi = {};
      for (const a of cozum.alicilar) {
        if (bildirildi[a.id]) continue;
        bildirildi[a.id] = 1;
        notify(a.id, (tur === 'duyuru' ? 'Duyuru: ' : me.fullName + ': ') + konu,
          '#/mesajlar');
      }
      save();

      return ok(res, {
        mesaj: mesajOzeti(m, me.id),
        gonderilen: cozum.alicilar.length,
        elenen: cozum.elenen || 0,
        message: (tur === 'duyuru' ? 'Duyuru yayımlandı' : 'Mesaj gönderildi') +
          ' — ' + cozum.alicilar.length + ' kişiye ulaştı.' +
          (cozum.elenen ? ' ' + cozum.elenen + ' kişi mesaj almayı kapatmış.' : '')
      });
    }

    /* Tek mesaj: okundu işaretler */
    if (alt && method === 'GET') {
      const m = byId(db.mesajlar, clean(alt, 60));
      if (!m) return bad(res, 'Mesaj bulunamadı', 404);
      const alici = m.alicilar.some(a => a.id === me.id);
      if (!alici && m.gonderenId !== me.id) return bad(res, 'Bu mesajı görme yetkin yok', 403);

      if (alici && (m.okuyanlar || []).indexOf(me.id) < 0) {
        m.okuyanlar = m.okuyanlar || [];
        m.okuyanlar.push(me.id);
        save();
      }

      const detay = mesajOzeti(m, me.id);
      detay.govde = m.govde;
      /* Gönderen kimlerin okuduğunu görebilsin. */
      if (m.gonderenId === me.id) {
        detay.okuyanSayisi = (m.okuyanlar || []).length;
        detay.alicilar = m.alicilar.slice(0, 100).map(a => {
          const u = userById(a.id);
          return {
            ad: u ? u.fullName : 'Silinmiş',
            rol: u ? u.role : '',
            okudu: (m.okuyanlar || []).indexOf(a.id) >= 0,
            ogrenciAdi: a.ogrenciId && userById(a.ogrenciId)
              ? userById(a.ogrenciId).fullName : ''
          };
        });
      }
      return ok(res, { mesaj: detay });
    }

    /* Silme: gönderen tamamen siler, alıcı yalnızca kendinden kaldırır. */
    if (alt === 'sil' && method === 'POST') {
      const m = byId(db.mesajlar, clean(body.id, 60));
      if (!m) return bad(res, 'Mesaj bulunamadı', 404);

      if (m.gonderenId === me.id) {
        db.mesajlar = db.mesajlar.filter(x => x.id !== m.id);
        save();
        return ok(res, { message: 'Mesaj silindi.' });
      }
      if (m.alicilar.some(a => a.id === me.id)) {
        m.alicilar = m.alicilar.filter(a => a.id !== me.id);
        if (!m.alicilar.length) db.mesajlar = db.mesajlar.filter(x => x.id !== m.id);
        save();
        return ok(res, { message: 'Mesaj kutundan kaldırıldı.' });
      }
      return bad(res, 'Yetkin yok', 403);
    }
  }

  return false;
}

module.exports = {
  MESAJ_KONU_SINIR,
  MESAJ_GOVDE_SINIR,
  MESAJ_SAATLIK_SINIR,
  velileriBul,
  mesajAyari,
  mesajGidebilirMi,
  mesajYazilabilirler,
  mesajAlicilariCoz,
  mesajOzeti,
  uclar
};
