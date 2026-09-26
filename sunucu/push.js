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

