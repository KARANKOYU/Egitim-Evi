'use strict';
/* Telefon bildirimi (Web Push): RFC 8030 gönderim, RFC 8291 uçtan uca
   şifreleme (aes128gcm), RFC 8292 VAPID kimliği. Paket kullanılmaz; Node'un
   crypto ve https modülleri yeter.

   - Sunucunun VAPID anahtar çifti ilk kullanımda üretilir, data/ altında
     (web'den servis edilmeyen klasör) yalnızca sunucunun okuyacağı izinle
     saklanır; gizli anahtar hiçbir yere gönderilmez.
   - Bildirim içeriği kişinin tarayıcısının anahtarıyla şifrelenir: push
     servisi (Google, Mozilla, Apple, Microsoft) içeriği okuyamaz.
   - Abonelik adresi yalnızca bilinen push servislerinden biri olabilir:
     sunucu kullanıcının verdiği rastgele bir adrese istek atmaz (SSRF).
   - Gönderim sırayla ve sınırlı eşzamanlılıkla yapılır; geçersizleşen
     abonelik (404/410) silinir. */

const crypto = require('crypto');
const fs = require('fs');
const https = require('https');
const path = require('path');
const { ayarlar } = require('./ayarlar');
const { hizSinir } = require('./guvenlik');
const { DATA } = require('./yollar');
const { depo } = require('./veri');

const ANAHTAR_DOSYASI = path.join(DATA, 'push-anahtar.json');
const PUSH_SUNUCULARI = ['fcm.googleapis.com', 'android.googleapis.com', 'push.services.mozilla.com',
  'notify.windows.com', 'push.apple.com'];
const ES_ZAMAN = 8;
const KUYRUK_SINIRI = 20000;

let anahtar = null;

/* VAPID anahtar çifti: { acik: base64url (65 bayt, sıkıştırılmamış nokta), gizli: PEM } */
function anahtarlar() {
  if (anahtar) return anahtar;
  try {
    const okunan = JSON.parse(fs.readFileSync(ANAHTAR_DOSYASI, 'utf8'));
    if (okunan && okunan.acik && okunan.gizli) anahtar = okunan;
  } catch (e) { /* yoksa üretilir */ }
  if (!anahtar) {
    const { publicKey, privateKey } = crypto.generateKeyPairSync('ec', { namedCurve: 'prime256v1' });
    const jwk = publicKey.export({ format: 'jwk' });
    anahtar = {
      acik: Buffer.concat([Buffer.from([4]), Buffer.from(jwk.x, 'base64url'), Buffer.from(jwk.y, 'base64url')]).toString('base64url'),
      gizli: privateKey.export({ format: 'pem', type: 'pkcs8' })
    };
    fs.mkdirSync(DATA, { recursive: true });
    fs.writeFileSync(ANAHTAR_DOSYASI, JSON.stringify(anahtar), { mode: 0o600 });
  }
  return anahtar;
}

/* Abonelik adresi bilinen bir push servisinde mi? */
function adresGecerli(endpoint) {
  let u;
  try { u = new URL(String(endpoint || '')); } catch (e) { return false; }
  if (u.protocol !== 'https:' || u.username || u.password || (u.port && u.port !== '443')) return false;
  const h = u.hostname.toLowerCase();
  if (/^[0-9.]+$/.test(h) || h.indexOf(':') >= 0) return false;
  return PUSH_SUNUCULARI.some(s => h === s || h.endsWith('.' + s));
}

/* Tarayıcının anahtarları: p256dh 65 bayt (0x04 ile başlar), auth 16 bayt. */
function anahtarGecerli(p256dh, auth) {
  const temiz = s => String(s || '').replace(/=+$/, '').replace(/\+/g, '-').replace(/\//g, '_');
  const p = temiz(p256dh), a = temiz(auth);
  if (!/^[A-Za-z0-9_-]{80,100}$/.test(p) || !/^[A-Za-z0-9_-]{16,30}$/.test(a)) return null;
  const pb = Buffer.from(p, 'base64url'), ab = Buffer.from(a, 'base64url');
  if (pb.length !== 65 || pb[0] !== 4 || ab.length !== 16) return null;
  /* Nokta gerçekten P-256 eğrisinin üstünde mi? */
  try {
    crypto.createPublicKey({ key: { kty: 'EC', crv: 'P-256', x: pb.subarray(1, 33).toString('base64url'),
      y: pb.subarray(33).toString('base64url') }, format: 'jwk' });
  } catch (e) { return null; }
  return { p256dh: p, auth: a };
}

/* RFC 8291: içerik şifreleme. test: { asGizli (base64url 32 bayt), tuz (base64url 16 bayt) }
   yalnızca testlerde RFC örneğini birebir üretmek için. */
function sifrele(icerik, p256dh, auth, test) {
  const uaAcik = Buffer.from(p256dh, 'base64url');
  const authSir = Buffer.from(auth, 'base64url');
  const ecdh = crypto.createECDH('prime256v1');
  if (test && test.asGizli) ecdh.setPrivateKey(Buffer.from(test.asGizli, 'base64url'));
  else ecdh.generateKeys();
  const asAcik = ecdh.getPublicKey();
  const ortak = ecdh.computeSecret(uaAcik);
  const anahtarBilgi = Buffer.concat([Buffer.from('WebPush: info\0'), uaAcik, asAcik]);
  const ikm = Buffer.from(crypto.hkdfSync('sha256', ortak, authSir, anahtarBilgi, 32));
  const tuz = test && test.tuz ? Buffer.from(test.tuz, 'base64url') : crypto.randomBytes(16);
  const cek = Buffer.from(crypto.hkdfSync('sha256', ikm, tuz, Buffer.from('Content-Encoding: aes128gcm\0'), 16));
  const nonce = Buffer.from(crypto.hkdfSync('sha256', ikm, tuz, Buffer.from('Content-Encoding: nonce\0'), 12));
  const sifreci = crypto.createCipheriv('aes-128-gcm', cek, nonce);
  const govde = Buffer.concat([sifreci.update(Buffer.concat([icerik, Buffer.from([2])])), sifreci.final(), sifreci.getAuthTag()]);
  const baslik = Buffer.alloc(21);
  tuz.copy(baslik, 0);
  baslik.writeUInt32BE(4096, 16);
  baslik.writeUInt8(asAcik.length, 20);
  return Buffer.concat([baslik, asAcik, govde]);
}

/* RFC 8292: VAPID kimliği (ES256 imzalı kısa ömürlü JWT). */
function vapidBasligi(endpoint) {
  const a = anahtarlar();
  const b64 = o => Buffer.from(JSON.stringify(o)).toString('base64url');
  const konu = (ayarlar.site && ayarlar.site.adres) || 'https://egitimevi.org';
  const girdi = b64({ typ: 'JWT', alg: 'ES256' }) + '.' +
    b64({ aud: new URL(endpoint).origin, exp: Math.floor(Date.now() / 1000) + 12 * 3600, sub: konu });
  const imza = crypto.sign('sha256', Buffer.from(girdi), { key: a.gizli, dsaEncoding: 'ieee-p1363' }).toString('base64url');
  return 'vapid t=' + girdi + '.' + imza + ', k=' + a.acik;
}

function tekGonder(abonelik, icerik) {
  return new Promise(resolve => {
    let govde;
    try { govde = sifrele(Buffer.from(JSON.stringify(icerik), 'utf8'), abonelik.p256dh, abonelik.auth); }
    catch (e) { return resolve(0); }
    const istek = https.request(abonelik.endpoint, {
      method: 'POST', timeout: 10000,
      headers: {
        'Content-Type': 'application/octet-stream', 'Content-Encoding': 'aes128gcm', 'Content-Length': govde.length,
        TTL: '86400', Urgency: 'high', Authorization: vapidBasligi(abonelik.endpoint)
      }
    }, cevap => { cevap.resume(); resolve(cevap.statusCode || 0); });
    istek.on('timeout', () => istek.destroy());
    istek.on('error', () => resolve(0));
    istek.end(govde);
  });
}

/* ---- kuyruk ---- */
const kuyruk = [];
let suren = 0;
/* Testlerde (EE_PUSH_GONDERME=0) dışarıya istek atılmaz. */
const GONDERIM_KAPALI = process.env.EE_PUSH_GONDERME === '0';
function sirayaAl(abonelik, icerik) {
  if (GONDERIM_KAPALI || kuyruk.length >= KUYRUK_SINIRI) return;
  kuyruk.push({ abonelik, icerik });
  isle();
}
function isle() {
  while (suren < ES_ZAMAN && kuyruk.length) {
    const is = kuyruk.shift();
    suren++;
    tekGonder(is.abonelik, is.icerik).then(async kod => {
      try {
        if (kod === 404 || kod === 410) await depo.push.gecersizSil(is.abonelik.id);
        else if (kod >= 200 && kod < 300) await depo.push.basariYaz(is.abonelik.id);
      } catch (e) { /* bildirim ikinci planda; hata işi durdurmaz */ }
    }).finally(() => { suren--; isle(); });
  }
}

/* Bildirim yazılınca: kişinin abonelikleri varsa telefonuna gönderilir. */
async function bildirimGeldi(liste) {
  const kisiler = [...new Set(liste.map(b => b.kime))];
  let abonelikler;
  try { abonelikler = await depo.push.abonelikler(kisiler); } catch (e) { return; }
  if (!abonelikler.length) return;
  const kisininki = new Map();
  for (const a of abonelikler) {
    if (!kisininki.has(a.alici)) kisininki.set(a.alici, []);
    kisininki.get(a.alici).push(a);
  }
  for (const b of liste) {
    /* Kişi başına dakikada en fazla 20 telefon bildirimi (toplu duyuru yağmuru olmasın). */
    const aboneler = kisininki.get(b.kime);
    if (!aboneler || !hizSinir('pushKisi:' + b.kime, 20, 60 * 1000)) continue;
    for (const a of aboneler) {
      const baglanti = String(b.baglanti || '').indexOf('#/') === 0 ? b.baglanti : '#/ana';
      /* ?k=: bildirim hangi rolüne geldiyse uygulama açılınca o role geçilir. */
      sirayaAl(a, { t: 'Eğitim Evi', b: String(b.metin || '').slice(0, 300),
        u: (a.kisa_ad ? '/' + a.kisa_ad : '') + '/?k=' + encodeURIComponent(b.kime) + baglanti });
    }
  }
}

function baslat() {
  depo.genel.olaylar.on('bildirim', liste => { bildirimGeldi(liste).catch(() => {}); });
}

module.exports = { baslat, anahtarlar, adresGecerli, anahtarGecerli, sifrele, vapidBasligi };
