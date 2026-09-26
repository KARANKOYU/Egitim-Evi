'use strict';
/* Telefon bildirimi aboneliği (/api/push).
   Tarayıcı bildirim izni verince aboneliğini buraya yazar; sunucu kişiye
   bildirim düştüğünde (servis yaklaştı, yeni mesaj...) telefonuna gönderir.
   Abonelik adresi yalnızca bilinen push servislerinden kabul edilir; adres
   URL'ye değil gövdeye yazılır (günlüklere düşmesin). */

const { hizSinir } = require('../guvenlik');
const { bad, ok } = require('../http');
const { uid } = require('../ortak');
const push = require('../push');
const { depo } = require('../veri');

const KISI_BASINA = 5;

async function uclar(k) {
  if (k.p === 'push') return pushUclari(k);
  return false;
}

async function pushUclari(k) {
  const { res, me, body, segs, method, need } = k;
  if (!need()) return;
  const alt = segs[2] || '';
  /* Abonelik kişinindir: okul rolündeyken bağlı olduğu yetişkin hesabına yazılır. */
  const sahip = me.anaHesapId || me.id;

  if (alt === 'anahtar' && method === 'GET') return ok(res, { anahtar: push.anahtarlar().acik });

  if (method !== 'POST') return;
  const endpoint = typeof body.endpoint === 'string' ? body.endpoint : '';
  if (endpoint.length < 10 || endpoint.length > 1000 || !push.adresGecerli(endpoint)) {
    return bad(res, 'Bu tarayıcının bildirim adresi tanınmadı.');
  }

  if (alt === 'abone') {
    if (!hizSinir('pushAbone:' + me.id, 20, 60 * 60 * 1000)) return bad(res, 'Çok sık denedin. Biraz sonra tekrar dene.', 429);
    const keys = body.keys && typeof body.keys === 'object' ? body.keys : {};
    const anahtar = push.anahtarGecerli(keys.p256dh, keys.auth);
    if (!anahtar) return bad(res, 'Bu tarayıcının bildirim anahtarı geçersiz.');
    await depo.push.aboneYaz(uid(), sahip, endpoint, anahtar.p256dh, anahtar.auth);
    await depo.push.fazlasiniSil(sahip, KISI_BASINA);
    return ok(res, { ok: true });
  }

  /* Bu cihazdaki abonelik bu hesabın mı? Ortak cihazda başka hesaba ait
     kalmış abonelik tarayıcıda kapatılır. */
  if (alt === 'durum') return ok(res, { benim: await depo.push.kisiAbonesiMi(sahip, endpoint) });

  if (alt === 'iptal') {
    await depo.push.aboneSil(endpoint, sahip);
    return ok(res, { ok: true });
  }
}

module.exports = { uclar };
