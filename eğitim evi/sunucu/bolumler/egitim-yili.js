'use strict';
/* Eğitim yılı (/api/egitim-yili).
   Müdür yıl açar; kayıtlar yıl damgası taşır; geçmiş yıla salt okunur bakılır. */

const { bad, ok } = require('../http');
const { clean, now, uid } = require('../ortak');
const { byId, db, save } = require('../veri');
const { okulGerek, yetkiVarMi } = require('../yetki');
const { islemYaz } = require('./islem-kaydi');

/* ============ eğitim yılı ============

   Okul her yıl sıfırdan başlıyor: yeni sınıflar, yeni program, yeni ödevler.
   Ama eski yılın kaydı kaybolmamalı — veli geçen yılın devamsızlığına,
   müdür geçen yılın programına bakabilmeli.

   Çözüm: kayıtlar açıldıkları yıla damgalanıyor. Yılı olmayan eski
   kayıtlar okulun ilk yılına aitmiş gibi davranıyor. */

function okulYillari(schoolId) {
  return db.egitimYillari
    .filter(y => y.schoolId === schoolId)
    .sort((a, b) => String(b.ad).localeCompare(String(a.ad)));
}

function aktifYil(schoolId) {
  const liste = okulYillari(schoolId);
  return liste.find(y => y.aktif) || liste[0] || null;
}

/* Kullanıcının şu an baktığı yıl. Seçim yapmadıysa aktif yıl. */
function bakilanYil(me) {
  if (!me || !me.schoolId) return null;
  const liste = okulYillari(me.schoolId);
  if (!liste.length) return null;
  if (me.seciliYil) {
    const secili = liste.find(y => y.id === me.seciliYil);
    if (secili) return secili;
  }
  return aktifYil(me.schoolId);
}

/* Kayıt bu yıla ait mi? Damgasız kayıtlar en eski yıla sayılır. */
function yilaAitMi(kayit, yil, enEskiId) {
  if (!yil) return true;                       /* okulda yıl tanımlı değilse hepsi */
  const k = kayit && kayit.yilId;
  if (!k) return yil.id === enEskiId;
  return k === yil.id;
}

/* Bir listeyi bakılan yıla göre süzer. */
function yilSuz(me, liste) {
  const yil = bakilanYil(me);
  if (!yil) return liste;
  const hepsi = okulYillari(me.schoolId);
  const enEski = hepsi.length ? hepsi[hepsi.length - 1].id : null;
  return liste.filter(k => yilaAitMi(k, yil, enEski));
}

/* Yeni kayda basılacak yıl damgası. */
function yilDamgasi(me) {
  const y = bakilanYil(me);
  return y ? y.id : '';
}

/* Geçmiş yıla bakılırken yazma işlemleri kapalı — arşiv değiştirilmemeli. */
function arsivdeMi(me) {
  const bakilan = bakilanYil(me);
  const aktif = aktifYil(me.schoolId);
  return !!(bakilan && aktif && bakilan.id !== aktif.id);
}

/* ---- uçlar ---- */
/* k: istek bağlamı (api.js kurar). Cevap yazılmadıysa yönlendirici 404 döner. */
async function uclar(k) {
  const { req, res, me, body, q, p, segs, method, need } = k;

  if (p === 'egitim-yili') {
    if (!need()) return;
    if (!okulGerek(res, me)) return;
    const alt = segs[2] || '';

    if (!alt && method === 'GET') {
      const liste = okulYillari(me.schoolId);
      const aktif = aktifYil(me.schoolId);
      const bakilan = bakilanYil(me);
      return ok(res, {
        yillar: liste.map(y => ({
          id: y.id, ad: y.ad, bas: y.bas, bit: y.bit,
          aktif: !!(aktif && y.id === aktif.id),
          bakilan: !!(bakilan && y.id === bakilan.id)
        })),
        yonetebilir: yetkiVarMi(me, 'yil.yonet'),
        arsiv: arsivdeMi(me)
      });
    }

    if (alt === 'ekle' && method === 'POST') {
      if (!yetkiVarMi(me, 'yil.yonet')) return bad(res, 'Eğitim yılı açma yetkin yok', 403);
      const ad = clean(body.ad, 20);
      if (!/^\d{4}-\d{4}$/.test(ad)) {
        return bad(res, 'Yıl adını 2026-2027 biçiminde yaz');
      }
      const [b, t] = ad.split('-').map(Number);
      if (t !== b + 1) return bad(res, 'İkinci yıl birincinin bir fazlası olmalı');
      if (okulYillari(me.schoolId).some(y => y.ad === ad)) {
        return bad(res, 'Bu eğitim yılı zaten var');
      }

      const yeni = {
        id: uid('y'), schoolId: me.schoolId, ad: ad,
        bas: b + '-09-01', bit: t + '-06-30',
        aktif: body.aktifYap !== false, createdAt: now()
      };
      /* Tek yıl aktif olabilir. */
      if (yeni.aktif) {
        for (const y of db.egitimYillari) {
          if (y.schoolId === me.schoolId) y.aktif = false;
        }
      }
      db.egitimYillari.push(yeni);
      me.seciliYil = yeni.id;
      islemYaz(me, 'yil.acildi', ad, req);
      save();
      return ok(res, { yil: yeni, message: ad + ' eğitim yılı açıldı.' });
    }

    /* Hangi yıla bakılacağını seç — kişiye özel, veriyi değiştirmez. */
    if (alt === 'bak' && method === 'POST') {
      const y = byId(db.egitimYillari, clean(body.id, 60));
      if (!y || y.schoolId !== me.schoolId) return bad(res, 'Yıl bulunamadı', 404);
      me.seciliYil = y.id;
      save();
      return ok(res, { yil: y, arsiv: arsivdeMi(me), message: y.ad + ' yılına bakıyorsun.' });
    }

    /* Aktif yılı değiştir — yeni kayıtlar bu yıla yazılır. */
    if (alt === 'aktif-yap' && method === 'POST') {
      if (!yetkiVarMi(me, 'yil.yonet')) return bad(res, 'Yetkin yok', 403);
      const y = byId(db.egitimYillari, clean(body.id, 60));
      if (!y || y.schoolId !== me.schoolId) return bad(res, 'Yıl bulunamadı', 404);
      for (const x of db.egitimYillari) {
        if (x.schoolId === me.schoolId) x.aktif = false;
      }
      y.aktif = true;
      me.seciliYil = y.id;
      islemYaz(me, 'yil.aktif-degisti', y.ad, req);
      save();
      return ok(res, { message: y.ad + ' artık aktif eğitim yılı.' });
    }
  }

  /* ---------- takvim ---------- */

  return false;
}

module.exports = {
  okulYillari,
  aktifYil,
  bakilanYil,
  yilaAitMi,
  yilSuz,
  yilDamgasi,
  arsivdeMi,
  uclar
};
