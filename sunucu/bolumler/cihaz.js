'use strict';
/* Telefon uygulaması (Eğitim Evi, yerel Android; ayrı depo) için cihaz anahtarı.

   Uygulama girişten sonra oturumla bir kez anahtar alır ve saklar. Anahtar
   yalnız iki işe yarar: bildirim yoklamak (Firebase yok; telefon kendisi
   sorar) ve servisçinin sefer konumunu arka planda göndermek. Hesaba giriş
   vermez (Bearer yerine kullanılamaz). Anahtarın kendisi değil SHA-256 özeti
   saklanır. Sahibi yetişkinin ana hesabıdır (okul rolleri onun altında) ya da
   öğrenci / servisçi hesabı; hesap başına en çok 5 anahtar.

   Oturumla (Authorization: Bearer):
     POST /api/cihaz        { ad, platform, surum }      -> { cihazAnahtari, cihazId }
     GET  /api/cihaz                                     -> { cihazlar: [{ id, ad, platform, surum, olusturma, sonGorulme }] }
     POST /api/cihaz/sil    { id } ya da { cihazAnahtari } -> anahtar iptal
   Anahtarla (X-Cihaz: <64 hex>; oturum kapılarından önce yönlendirilir, api.js):
     GET  /api/cihaz/bildirimler[?son=<imleç>] -> { bildirimler: [{ id, metin, baglanti, zaman }], imlec, servisSaatleri }
     GET  /api/cihaz/ayar                      -> { rol, servisci, acikSefer: { id, servisId, yon } | null, servisSaatleri }
     POST /api/cihaz/servis-konum { seferId, enlem, boylam, dogruluk }
     POST /api/cihaz/sil
   Hesap onaylı değilse ya da aydınlatma metni onayı güncel değilse anahtar
   silinir ve 403 döner (uygulama anahtarı unutur). Eski Aile uçları
   (/api/aile/cihaz/*, X-Aile-Cihaz) ayrıdır ve aynen durur. */

const crypto = require('crypto');
const { hizSinir } = require('../guvenlik');
const { bad, ok, sendJSON } = require('../http');
const { clean, uid } = require('../ortak');
const push = require('../push');
const { depo } = require('../veri');
const pencere = require('../yardimci/servis-pencere');
const { kvkkGuncelMi } = require('./kayit');
const okulHayati = require('./okul-hayati');

const ANAHTAR = /^[a-f0-9]{64}$/;
const EN_FAZLA_BILDIRIM = 20;
/* İmleç: bildirimin zamanı (UTC, mikrosaniye) ve kimliği: "2026-09-27T05:12:33.123456Z|n_ab12..." */
const IMLEC = /^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{6}Z)\|([A-Za-z0-9_-]{0,80})$/;

const ozet = anahtar => crypto.createHash('sha256').update(String(anahtar)).digest('hex');
const imlecYazisi = r => r.zaman + '|' + (r.id || '');
function imlecCoz(metin) {
  const m = IMLEC.exec(String(metin || ''));
  if (!m) return null;
  /* Takvimde olmayan gün ya da saat (30 Şubat, 24:00) veritabanına gitmesin. */
  const t = Date.parse(m[1]);
  return !isNaN(t) && new Date(t).toISOString().slice(0, 19) === m[1].slice(0, 19) ? { zaman: m[1], id: m[2] } : null;
}

/* Telefonun bildirim sıklığı için okulun servis saatleri: yalnız hesabın
   servisle ilgisi varsa (servisçi, servisteki öğrenci ya da onun velisi).
   Çocukları farklı okullarda olan velide aralıkları kapsayan en geniş saatler. */
async function servisSaatleri(u) {
  const okulIdler = new Set();
  if (u.role === 'servisci' && u.schoolId) okulIdler.add(u.schoolId);
  const ogrenciler = u.role === 'student' ? [u.id] : await depo.kullanicilar.cocukIdleri(u.id);
  if (ogrenciler.length) for (const s of await depo.okulHayati.ogrencilerinServisi(ogrenciler)) okulIdler.add(s.okul_id);
  const okullar = [];
  for (const id of okulIdler) {
    if (depo.ozellikler.kapaliMi(id, 'servis')) continue;
    const o = await depo.okullar.bul(id);
    if (o && o.status === 'approved') okullar.push(o);
  }
  return okullar.length ? pencere.saatZarfi(okullar) : null;
}

/* ---------------- anahtarla (X-Cihaz) ---------------- */
async function anahtarUclari(k) {
  const { req, res, body, q, segs, method } = k;
  const anahtar = String(req.headers['x-cihaz'] || '');
  if (!ANAHTAR.test(anahtar)) return bad(res, 'Uygulama anahtarı tanınmadı. Yeniden giriş yap.', 401);
  const c = await depo.cihazlar.ozetle(ozet(anahtar));
  if (!c) return bad(res, 'Uygulama anahtarı tanınmadı. Yeniden giriş yap.', 401);
  const is = segs[2] || '';
  const konumMu = is === 'servis-konum';
  /* Konum sefer boyunca birkaç saniyede bir gelir (dakikada 60); öteki uçlar saatte 240. */
  const hizli = konumMu ? hizSinir('cihazKonum:' + c.id, 60, 60 * 1000) : hizSinir('cihaz:' + c.id, 240, 60 * 60 * 1000);
  if (!hizli) return bad(res, 'Çok sık istek geldi. Biraz sonra dene.', 429);
  const u = await depo.kullanicilar.bul(c.kullaniciId);
  if (!u || u.status !== 'approved' || !kvkkGuncelMi(u)) {
    await depo.cihazlar.sil(c.id);
    return sendJSON(res, 403, { error: u && u.status === 'approved' && !kvkkGuncelMi(u)
      ? 'Aydınlatma metni güncellendi. Uygulamada onayladıktan sonra bildirimler yeniden gelir.'
      : 'Hesap artık kullanılamıyor.', anahtarGecersiz: true });
  }
  await depo.cihazlar.goruldu(c.id);

  if (is === 'bildirimler' && method === 'GET') {
    const alicilar = await depo.cihazlar.alicilar(u.id);
    const idler = alicilar.map(a => a.id);
    const kisaAd = new Map(alicilar.map(a => [a.id, a.kisa_ad]));
    const ust = await depo.cihazlar.sonImlec(idler);
    const son = imlecCoz(q.get('son'));
    /* İlk çağrıda (ya da bozuk imleçte) eski bildirimler dönmez: telefon
       kurulunca geçmiş bildirimler yağmasın. */
    const satirlar = son ? await depo.cihazlar.bildirimleri(idler, son, ust, EN_FAZLA_BILDIRIM) : [];
    const imlec = imlecYazisi(son && imlecYazisi(son) > imlecYazisi(ust) ? son : ust);
    if (imlec !== c.sonBildirim) await depo.cihazlar.imlecYaz(c.id, imlec);
    return ok(res, {
      bildirimler: satirlar.reverse().map(b => ({ id: b.id, metin: b.metin,
        baglanti: push.bildirimAdresi(kisaAd.get(b.kullanici_id), b.kullanici_id, b.baglanti), zaman: b.olusturma })),
      imlec, servisSaatleri: await servisSaatleri(u)
    });
  }

  if (is === 'ayar' && method === 'GET') {
    let acikSefer = null;
    if (u.role === 'servisci') {
      const okul = await depo.okullar.bul(u.schoolId);
      for (const s of await depo.okulHayati.soforunServisleri(u.id)) {
        const sf = await okulHayati.surenSefer(s.id, okul);
        if (sf && sf.sofor_id === u.id) { acikSefer = { id: sf.id, servisId: s.id, yon: sf.yon }; break; }
      }
    }
    return ok(res, { rol: u.role || '', servisci: u.role === 'servisci', acikSefer, servisSaatleri: await servisSaatleri(u) });
  }

  if (method !== 'POST') return bad(res, 'Böyle bir adres yok', 404);

  if (is === 'servis-konum') {
    if (u.role !== 'servisci') return bad(res, 'Konumu servisçi gönderir', 403);
    if (depo.ozellikler.kapaliMi(u.schoolId, 'servis')) {
      return sendJSON(res, 403, { error: 'Servis bu okulda kapalı.', ozellikKapali: 'servis' });
    }
    const r = await okulHayati.seferKonumuYaz(u, body);
    if (r.durum !== 200) return bad(res, r.hata, r.durum);
    return ok(res);
  }

  if (is === 'sil') {
    await depo.cihazlar.sil(c.id);
    return ok(res, { message: 'Bu telefonun bildirim anahtarı kaldırıldı.' });
  }
  return bad(res, 'Böyle bir adres yok', 404);
}

/* ---------------- oturumla ---------------- */
async function uclar(k) {
  const { res, me, body, segs, method, need } = k;
  if (!need(null)) return;
  const sahip = me.anaHesapId || me.id;
  const is = segs[2] || '';

  if (!is && method === 'POST') {
    if (!hizSinir('cihazEkle:' + sahip, 20, 60 * 60 * 1000)) return bad(res, 'Bu saat içinde çok fazla telefon eklendi. Biraz sonra dene.', 429);
    const anahtar = crypto.randomBytes(32).toString('hex');
    const c = { id: uid('ck'), kullaniciId: sahip, ozet: ozet(anahtar), ad: clean(body.ad, 80) || 'Telefon',
      platform: clean(body.platform, 20) || 'android', surum: clean(body.surum, 20) };
    await depo.cihazlar.ekle(c);
    return ok(res, { cihazAnahtari: anahtar, cihazId: c.id });
  }

  if (!is && method === 'GET') {
    return ok(res, { cihazlar: (await depo.cihazlar.listesi(sahip)).map(c => ({ id: c.id, ad: c.ad, platform: c.platform, surum: c.surum,
      olusturma: c.olusturma, sonGorulme: c.sonGorulme })) });
  }

  if (is === 'sil' && method === 'POST') {
    const id = clean(body.id, 60);
    const anahtar = typeof body.cihazAnahtari === 'string' && ANAHTAR.test(body.cihazAnahtari) ? body.cihazAnahtari : '';
    if (!id && !anahtar) return bad(res, 'Hangi telefonun kaldırılacağı belli değil.');
    const n = await depo.cihazlar.sahibininSil(sahip, id, anahtar ? ozet(anahtar) : '');
    if (!n) return bad(res, 'Telefon bulunamadı', 404);
    return ok(res, { message: 'Telefonun bildirim anahtarı kaldırıldı.' });
  }
  return bad(res, 'Böyle bir adres yok', 404);
}

module.exports = { uclar, anahtarUclari };
