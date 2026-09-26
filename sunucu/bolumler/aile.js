'use strict';
/* Eğitim Evi Aile: öğrencinin telefonundaki uygulama (ayrı depo:
   github.com/KARANKOYU/Egitim-Evi-App) konumu ve uygulama kullanım sürelerini
   gönderir; veli bunları sitede görür, gönderme sıklığını ve sınırları seçer.
   Sınır aşılınca veliye bildirim gider (uygulama kapatılmaz). Okul (müdür,
   öğretmen) bu verileri görmez; konum ve kullanım 7 gün sonra silinir.

   Öğrenci (oturumla, telefonu bağlarken bir kez):
     POST /api/aile/cihaz            { ad, platform, surum, onay: true } -> { cihazAnahtari, ogrenci, ayar }
   Cihaz (X-Aile-Cihaz başlığıyla; oturum gerekmez, anahtar yalnızca bunlara yarar):
     GET  /api/aile/cihaz/ayar
     POST /api/aile/cihaz/konum      { konumlar: [{ enlem, boylam, dogruluk, zaman, ag, pil }] }
     POST /api/aile/cihaz/kullanim   { gunler: [{ gun, uygulamalar: [{ paket, ad, dakika }] }] }
     POST /api/aile/cihaz/sil
   Veli:
     GET  /api/aile/ozet?studentId=
     POST /api/aile/ayar             { studentId, wifiDk, mobilDk, konumAcik, kullanimAcik, toplamSinir, sinirlar }
     POST /api/aile/cihaz-kaldir     { studentId, cihazId } */

const crypto = require('crypto');
const { bad, ok } = require('../http');
const { hizSinir } = require('../guvenlik');
const { clean, uid } = require('../ortak');
const { depo, topluBildir } = require('../veri');
const { trGun, gunEkle } = require('../yardimci/hatirlatici-zaman');

const ARALIKLAR = [1, 5, 10, 15, 30, 60];
const EN_FAZLA_KONUM = 500;          // bir istekte
const EN_FAZLA_UYGULAMA = 300;       // bir günde
const EN_FAZLA_SINIR = 50;
const PAKET = /^[A-Za-z0-9._-]{1,200}$/;
const YEDI_GUN_MS = 7 * 24 * 60 * 60 * 1000;

const ozet = anahtar => crypto.createHash('sha256').update(String(anahtar)).digest('hex');
const bugun = () => trGun(Date.now());
/* Uygulama adı: denetim karakterleri atılır, 100 harf. */
const uygulamaAdi = (ad, paket) => clean(String(ad || '').replace(/[\u0000-\u001f\u007f‪-‮⁦-⁩]/g, ''), 100) || paket;

function sureYaz(dk) {
  const s = Math.floor(dk / 60), d = dk % 60;
  return s ? s + ' sa' + (d ? ' ' + d + ' dk' : '') : d + ' dk';
}

async function velilerineBildir(ogrenci, metin) {
  const veliler = (await depo.kullanicilar.veliHaritasi([ogrenci.id])).get(ogrenci.id) || [];
  await topluBildir(veliler, metin, '#/aile?c=' + ogrenci.id);
}

/* ---------------- cihaz uçları (X-Aile-Cihaz) ---------------- */
async function cihazUclari(k) {
  const { req, res, body, segs, method } = k;
  const anahtar = String(req.headers['x-aile-cihaz'] || '');
  if (!/^[a-f0-9]{64}$/.test(anahtar)) return bad(res, 'Cihaz tanınmadı. Uygulamadan yeniden bağlan.', 401);
  const c = await depo.aile.cihazOzetle(ozet(anahtar));
  if (!c) return bad(res, 'Cihaz tanınmadı. Uygulamadan yeniden bağlan.', 401);
  if (!hizSinir('aileCihaz:' + c.id, 240, 60 * 60 * 1000)) return bad(res, 'Çok sık istek geldi. Biraz sonra dene.', 429);
  const ogrenci = await depo.kullanicilar.bul(c.ogrenciId);
  if (!ogrenci || ogrenci.role !== 'student' || ogrenci.status !== 'approved') {
    await depo.aile.cihazSil(c.id);
    return bad(res, 'Hesap artık kullanılamıyor.', 401);
  }
  await depo.aile.cihazGoruldu(c.id);
  const ayar = await depo.aile.ayar(ogrenci.id);
  const is = segs[3];

  if (is === 'ayar' && method === 'GET') {
    return ok(res, { ayar: { wifiDk: ayar.wifiDk, mobilDk: ayar.mobilDk, konumAcik: ayar.konumAcik, kullanimAcik: ayar.kullanimAcik } });
  }
  if (method !== 'POST') return bad(res, 'Böyle bir adres yok', 404);

  if (is === 'konum') {
    /* Gövde süzgeci (ortak.govdeTemizle) dizileri zaten 500 ögede keser; uygulama 500'erli gönderir. */
    const liste = (Array.isArray(body.konumlar) ? body.konumlar : []).slice(0, EN_FAZLA_KONUM);
    if (!ayar.konumAcik) return ok(res, { alinan: 0, kapali: true });
    const simdi = Date.now();
    const temiz = [];
    for (const x of liste) {
      if (!x || typeof x !== 'object') continue;
      const enlem = Number(x.enlem), boylam = Number(x.boylam);
      const zaman = typeof x.zaman === 'number' ? x.zaman : Date.parse(String(x.zaman || ''));
      if (!Number.isFinite(enlem) || !Number.isFinite(boylam) || Math.abs(enlem) > 90 || Math.abs(boylam) > 180) continue;
      if (!Number.isFinite(zaman) || zaman < simdi - YEDI_GUN_MS || zaman > simdi + 5 * 60 * 1000) continue;
      const dogruluk = Number.isFinite(Number(x.dogruluk)) && x.dogruluk !== null ? Math.max(0, Math.min(100000, Math.round(Number(x.dogruluk)))) : null;
      const pil = Number.isInteger(x.pil) && x.pil >= 0 && x.pil <= 100 ? x.pil : null;
      temiz.push({ enlem, boylam, dogruluk, pil, ag: ['wifi', 'mobil'].indexOf(x.ag) >= 0 ? x.ag : '', zaman: new Date(zaman).toISOString() });
    }
    const alinan = await depo.aile.konumEkle(ogrenci.id, c.id, temiz);
    return ok(res, { alinan });
  }

  if (is === 'kullanim') {
    const gunler = Array.isArray(body.gunler) ? body.gunler.slice(0, 8) : [];
    if (!ayar.kullanimAcik) return ok(res, { kapali: true });
    const enEski = gunEkle(bugun(), -7), bu = bugun();
    const satirlar = [];
    for (const g of gunler) {
      const gun = clean(g && g.gun, 10);
      if (!/^\d{4}-\d{2}-\d{2}$/.test(gun) || gun < enEski || gun > bu) continue;
      const goruldu = new Set();
      for (const u of (Array.isArray(g.uygulamalar) ? g.uygulamalar : []).slice(0, EN_FAZLA_UYGULAMA)) {
        const paket = String(u && u.paket || '');
        const dakika = Number(u && u.dakika);
        if (!PAKET.test(paket) || goruldu.has(paket) || !Number.isInteger(dakika) || dakika < 0 || dakika > 1440) continue;
        goruldu.add(paket);
        satirlar.push({ gun, paket, ad: uygulamaAdi(u.ad, paket), dakika });
      }
    }
    await depo.aile.kullanimYaz(ogrenci.id, satirlar);
    await sinirlariDenetle(ogrenci, ayar);
    return ok(res, { alinan: satirlar.length });
  }

  if (is === 'sil') {
    await depo.aile.cihazSil(c.id);
    await velilerineBildir(ogrenci, ogrenci.fullName + ' telefonunun (' + (c.ad || 'telefon') + ') Eğitim Evi Aile bağlantısını kaldırdı.');
    return ok(res, { message: 'Bağlantı kaldırıldı.' });
  }
  return bad(res, 'Böyle bir adres yok', 404);
}

/* Bugünün süreleri sınırı geçtiyse velilere günde bir kez haber. */
async function sinirlariDenetle(ogrenci, ayar) {
  const gun = bugun();
  const bugunku = (await depo.aile.kullanimlari(ogrenci.id, gun)).filter(s => s.gun === gun);
  if (!bugunku.length) return;
  const toplam = bugunku.reduce((t, s) => t + s.dakika, 0);
  if (ayar.toplamSinir && toplam > ayar.toplamSinir && await depo.aile.uyariIlkMi(ogrenci.id, gun, 'toplam')) {
    await velilerineBildir(ogrenci, ogrenci.fullName + ' bugün telefonda toplam ' + sureYaz(toplam) +
      ' geçirdi (sınır ' + sureYaz(ayar.toplamSinir) + ').');
  }
  const sure = new Map(bugunku.map(s => [s.paket, s]));
  for (const s of await depo.aile.sinirlari(ogrenci.id)) {
    const u = sure.get(s.paket);
    if (!u || u.dakika <= s.dakika) continue;
    if (!await depo.aile.uyariIlkMi(ogrenci.id, gun, s.paket)) continue;
    await velilerineBildir(ogrenci, ogrenci.fullName + ' bugün ' + s.ad + ' uygulamasında ' + sureYaz(u.dakika) +
      ' geçirdi (sınır ' + sureYaz(s.dakika) + ').');
  }
}

/* ---------------- öğrenci ve veli ---------------- */
async function uclar(k) {
  const { res, me, body, q, segs, method, need } = k;
  if (!need(null)) return;
  const is = segs[2] || '';

  /* Öğrenci telefonunu bağlar: kendi açık onayıyla; anahtar bir kez gösterilir. */
  if (is === 'cihaz' && !segs[3] && method === 'POST') {
    if (me.role !== 'student') return bad(res, 'Telefonu çocuğun kendi öğrenci hesabıyla bağla.', 403);
    if (body.onay !== true) return bad(res, 'Paylaşımı kabul etmeden bağlanamaz.');
    if (!hizSinir('aileBagla:' + me.id, 10, 60 * 60 * 1000)) return bad(res, 'Bu saat içinde çok fazla bağlama denendi.', 429);
    const anahtar = crypto.randomBytes(32).toString('hex');
    const c = { id: uid('ac'), ogrenciId: me.id, ozet: ozet(anahtar), ad: clean(body.ad, 80) || 'Telefon',
      platform: clean(body.platform, 20) || 'android', surum: clean(body.surum, 20) };
    await depo.aile.cihazEkle(c);
    await velilerineBildir(me, me.fullName + ' telefonunu (' + c.ad + ') Eğitim Evi Aile\'ye bağladı. ' +
      'Konum ve ekran süresi Aile sayfasında.');
    const a = await depo.aile.ayar(me.id);
    return ok(res, { cihazAnahtari: anahtar, cihazId: c.id, ogrenci: { ad: me.fullName },
      ayar: { wifiDk: a.wifiDk, mobilDk: a.mobilDk, konumAcik: a.konumAcik, kullanimAcik: a.kullanimAcik } });
  }

  /* Buradan sonrası yalnızca çocuğa bağlı veli. */
  const ogrenciId = clean(is === 'ozet' ? q.get('studentId') : body.studentId, 60);
  const ogrenci = ogrenciId ? await depo.kullanicilar.bul(ogrenciId) : null;
  if (!ogrenci || ogrenci.role !== 'student' || me.role === 'student' || !(await depo.kullanicilar.bagliMi(me.id, ogrenci.id))) {
    return bad(res, 'Bu öğrencinin velisi değilsin', 403);
  }

  if (is === 'ozet' && method === 'GET') {
    const enEski = gunEkle(bugun(), -7);
    const [cihazlar, ayar, sinirlar, konumlar, kullanim] = await Promise.all([
      depo.aile.cihazlari(ogrenci.id), depo.aile.ayar(ogrenci.id), depo.aile.sinirlari(ogrenci.id),
      depo.aile.sonKonumlar(ogrenci.id, 30), depo.aile.kullanimlari(ogrenci.id, enEski)
    ]);
    const gunToplam = new Map(), haftalik = new Map();
    for (let g = 7; g >= 0; g--) gunToplam.set(gunEkle(bugun(), -g), 0);
    for (const s of kullanim) {
      if (gunToplam.has(s.gun)) gunToplam.set(s.gun, gunToplam.get(s.gun) + s.dakika);
      const h = haftalik.get(s.paket) || { paket: s.paket, ad: s.ad, dakika: 0 };
      h.dakika += s.dakika;
      h.ad = s.ad;
      haftalik.set(s.paket, h);
    }
    const bu = bugun();
    return ok(res, {
      ogrenci: { id: ogrenci.id, ad: ogrenci.fullName },
      cihazlar, ayar, sinirlar, saklamaGun: depo.aile.SAKLAMA_GUN,
      sonKonum: konumlar[0] || null, konumlar,
      kullanim: {
        bugun: kullanim.filter(s => s.gun === bu).sort((a, b) => b.dakika - a.dakika),
        gunler: [...gunToplam].map(([gun, toplam]) => ({ gun, toplam })),
        hafta: [...haftalik.values()].sort((a, b) => b.dakika - a.dakika).slice(0, 30)
      }
    });
  }

  if (is === 'ayar' && method === 'POST') {
    const a = {
      wifiDk: Number(body.wifiDk), mobilDk: Number(body.mobilDk),
      konumAcik: body.konumAcik !== false, kullanimAcik: body.kullanimAcik !== false,
      toplamSinir: body.toplamSinir === null || body.toplamSinir === '' || body.toplamSinir === undefined ? null : Number(body.toplamSinir)
    };
    if (ARALIKLAR.indexOf(a.wifiDk) < 0 || ARALIKLAR.indexOf(a.mobilDk) < 0) return bad(res, 'Aralık 1, 5, 10, 15, 30 ya da 60 dakika olabilir');
    if (a.toplamSinir !== null && !(Number.isInteger(a.toplamSinir) && a.toplamSinir >= 5 && a.toplamSinir <= 1440)) {
      return bad(res, 'Günlük toplam sınır 5 dakika ile 24 saat arasında olmalı');
    }
    const ham = Array.isArray(body.sinirlar) ? body.sinirlar : [];
    if (ham.length > EN_FAZLA_SINIR) return bad(res, 'En fazla ' + EN_FAZLA_SINIR + ' uygulamaya sınır konur');
    const sinirlar = [], goruldu = new Set();
    for (const s of ham) {
      const paket = String(s && s.paket || ''), dakika = Number(s && s.dakika);
      if (!PAKET.test(paket)) return bad(res, 'Uygulama geçersiz');
      if (!Number.isInteger(dakika) || dakika < 5 || dakika > 1440) return bad(res, 'Uygulama sınırı 5 dakika ile 24 saat arasında olmalı');
      if (goruldu.has(paket)) continue;
      goruldu.add(paket);
      sinirlar.push({ paket, ad: uygulamaAdi(s.ad, paket), dakika });
    }
    await depo.aile.ayarYaz(ogrenci.id, a, sinirlar, me.id);
    return ok(res, { ayar: await depo.aile.ayar(ogrenci.id), sinirlar: await depo.aile.sinirlari(ogrenci.id), message: 'Kaydedildi.' });
  }

  if (is === 'cihaz-kaldir' && method === 'POST') {
    const c = (await depo.aile.cihazlari(ogrenci.id)).find(x => x.id === clean(body.cihazId, 60));
    if (!c) return bad(res, 'Cihaz bulunamadı', 404);
    await depo.aile.cihazSil(c.id);
    return ok(res, { message: 'Telefonun bağlantısı kaldırıldı.' });
  }
  return bad(res, 'Böyle bir adres yok', 404);
}

module.exports = { uclar, cihazUclari };
