'use strict';
/* Kişisel hatırlatıcılar (/api/hatirlaticilar).

   Herkes (öğrenci, veli, öğretmen, müdür, servisçi, rolsüz yetişkin) kendine
   kurar: başlık, açıklama, sıklık (bir kez · her gün · haftanın seçilen
   günleri · ayda bir) ve saat. Zamanı gelince bildirim ve telefon bildirimi
   gider. Hatırlatıcı yalnızca sahibine görünür. Zaman hesabı:
   sunucu/yardimci/hatirlatici-zaman.js (Türkiye saati). */

const { bad, ok } = require('../http');
const { hizSinir } = require('../guvenlik');
const { clean, tarihCoz, uid } = require('../ortak');
const { saatDuzelt } = require('../iliskiler');
const { depo, bildir } = require('../veri');
const zaman = require('../yardimci/hatirlatici-zaman');

const SINIR = 50;               // kişi başına
const SIKLIKLAR = ['bir-kez', 'her-gun', 'her-hafta', 'her-ay'];

/* Gelen alanları doğrular: { hata } ya da { h } */
function dogrula(body) {
  const baslik = clean(body.baslik, 120);
  if (!baslik) return { hata: 'Başlık yaz.', alan: 'baslik' };
  const aciklama = clean(body.aciklama, 1000);
  const siklik = clean(body.siklik, 12);
  if (SIKLIKLAR.indexOf(siklik) < 0) return { hata: 'Ne sıklıkla hatırlatılacağını seç.', alan: 'siklik' };
  const saat = saatDuzelt(body.saat);
  if (!saat) return { hata: 'Saati seç (ör. 08:30).', alan: 'saat' };
  const h = { baslik, aciklama, siklik, saat, tarih: '', ayGunu: null, gunler: [] };
  if (siklik === 'bir-kez') {
    const t = tarihCoz(body.tarih);
    if (!t) return { hata: 'Günü seç.', alan: 'tarih' };
    if (zaman.an(t, saat) <= Date.now()) return { hata: 'Bu gün ve saat geçti; ileri bir zaman seç.', alan: 'tarih' };
    h.tarih = t;
  }
  if (siklik === 'her-hafta') {
    const gunler = [...new Set((Array.isArray(body.gunler) ? body.gunler : []).map(Number))].filter(g => Number.isInteger(g) && g >= 1 && g <= 7).sort();
    if (!gunler.length) return { hata: 'Haftanın en az bir gününü seç.', alan: 'gunler' };
    h.gunler = gunler;
  }
  if (siklik === 'her-ay') {
    const g = Number(body.ayGunu);
    if (!Number.isInteger(g) || g < 1 || g > 31) return { hata: 'Ayın kaçında hatırlatılacağını seç (1-31).', alan: 'ayGunu' };
    h.ayGunu = g;
  }
  return { h };
}

function gorunum(h) {
  const s = zaman.sonraki(h, Date.now());
  return { id: h.id, baslik: h.baslik, aciklama: h.aciklama, siklik: h.siklik, tarih: h.tarih, saat: h.saat,
    ayGunu: h.ayGunu, gunler: h.gunler, aktif: h.aktif, sonGonderim: h.sonGonderim,
    sonraki: s ? new Date(s).toISOString() : '' };
}

/* Her dakika: zamanı gelenlere bildirim. */
let calisiyor = false;
async function hatirlaticilariGonder(simdi) {
  if (calisiyor) return 0;
  calisiyor = true;
  let n = 0;
  try {
    simdi = simdi || Date.now();
    for (const h of await depo.hatirlaticilar.aktifler()) {
      const a = zaman.zamaniGeldi(h, simdi);
      if (!a) continue;
      await depo.hatirlaticilar.gonderildi(h.id, new Date(a).toISOString(), h.siklik === 'bir-kez');
      /* Kişinin kendi kurduğu hatırlatma yalnızca ona gider (öğrenciyse velisine kopya gitmez). */
      await bildir(h.kullaniciId, 'Hatırlatma: ' + h.baslik + (h.aciklama ? ' — ' + h.aciklama : ''), '#/hatirlaticilar',
        { veliye: false });
      n++;
    }
  } finally {
    calisiyor = false;
  }
  return n;
}

async function uclar(k) {
  const { res, me, body, p, segs, method, need } = k;
  if (p !== 'hatirlaticilar') return false;
  if (!need()) return;
  const id = clean(segs[2], 60);
  const islemAdi = segs[3] || '';

  if (!id && method === 'GET') {
    return ok(res, { hatirlaticilar: (await depo.hatirlaticilar.kisinin(me.id)).map(gorunum), sinir: SINIR });
  }
  if (!hizSinir('hatirlatici:' + me.id, 120, 60 * 60 * 1000)) return bad(res, 'Çok sık değiştirdin. Biraz sonra dene.', 429);

  if (!id && method === 'POST') {
    if (await depo.hatirlaticilar.sayisi(me.id) >= SINIR) return bad(res, 'En fazla ' + SINIR + ' hatırlatıcı kurabilirsin; kullanmadığını sil.');
    const d = dogrula(body);
    if (d.hata) return bad(res, d.hata);
    const h = await depo.hatirlaticilar.ekle(Object.assign({ id: uid('h'), kullaniciId: me.id }, d.h));
    return ok(res, { hatirlatici: gorunum(h), message: 'Hatırlatıcı kuruldu.' });
  }

  /* Yalnızca sahibi görür ve değiştirir; başkasınınki "yok" sayılır. */
  const h = id ? await depo.hatirlaticilar.bul(id) : null;
  if (!h || h.kullaniciId !== me.id) return bad(res, 'Hatırlatıcı bulunamadı', 404);

  if (method === 'POST' && !islemAdi) {
    const d = dogrula(body);
    if (d.hata) return bad(res, d.hata);
    return ok(res, { hatirlatici: gorunum(await depo.hatirlaticilar.guncelle(h.id, d.h)), message: 'Kaydedildi.' });
  }
  if (method === 'POST' && islemAdi === 'durum') {
    const aktif = body.aktif === true;
    if (aktif && h.siklik === 'bir-kez' && zaman.an(h.tarih, h.saat) <= Date.now()) {
      return bad(res, 'Bu hatırlatıcının günü geçti; düzenleyip yeni bir gün seç.');
    }
    await depo.hatirlaticilar.aktifYaz(h.id, aktif);
    return ok(res, { hatirlatici: gorunum(await depo.hatirlaticilar.bul(h.id)), message: aktif ? 'Yeniden başladı.' : 'Durduruldu.' });
  }
  if (method === 'POST' && islemAdi === 'sil') {
    await depo.hatirlaticilar.sil(h.id);
    return ok(res, { message: 'Silindi.' });
  }
  return bad(res, 'Böyle bir adres yok', 404);
}

module.exports = { uclar, hatirlaticilariGonder, dogrula };
