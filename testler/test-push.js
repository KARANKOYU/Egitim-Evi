/* Telefon bildirimi (sunucusuz):
   - RFC 8291 örneği birebir üretiliyor; rastgele anahtarla şifrelenen
     içerik tarayıcı tarafının hesabıyla geri açılıyor;
   - VAPID imzası sunucunun açık anahtarıyla doğrulanıyor;
   - abonelik adresi yalnızca bilinen push servislerinden kabul ediliyor
     (sunucu rastgele adrese istek atmaz);
   - tarayıcı anahtarları boyut ve biçimce denetleniyor. */
const crypto = require('crypto');
const fs = require('fs');
const os = require('os');
const path = require('path');

const GECICI = fs.mkdtempSync(path.join(os.tmpdir(), 'ee-push-'));
process.env.EE_DATA = GECICI;
const push = require(path.join(__dirname, '..', 'sunucu', 'push.js'));

let gecti = 0, kaldi = 0;
function kontrol(ad, sart, detay) {
  if (sart) { gecti++; console.log('  GECTI  ' + ad); }
  else { kaldi++; console.log('  KALDI  ' + ad + (detay ? '  -> ' + detay : '')); }
}

/* Tarayıcının yapacağı çözme (RFC 8291 3.4 + RFC 8188). */
function coz(govde, uaEcdh, authSir) {
  const tuz = govde.subarray(0, 16);
  const rs = govde.readUInt32BE(16);
  const idlen = govde[20];
  const asAcik = govde.subarray(21, 21 + idlen);
  const sifreli = govde.subarray(21 + idlen);
  const ortak = uaEcdh.computeSecret(asAcik);
  const bilgi = Buffer.concat([Buffer.from('WebPush: info\0'), uaEcdh.getPublicKey(), asAcik]);
  const ikm = Buffer.from(crypto.hkdfSync('sha256', ortak, authSir, bilgi, 32));
  const cek = Buffer.from(crypto.hkdfSync('sha256', ikm, tuz, Buffer.from('Content-Encoding: aes128gcm\0'), 16));
  const nonce = Buffer.from(crypto.hkdfSync('sha256', ikm, tuz, Buffer.from('Content-Encoding: nonce\0'), 12));
  const d = crypto.createDecipheriv('aes-128-gcm', cek, nonce);
  d.setAuthTag(sifreli.subarray(sifreli.length - 16));
  const acik = Buffer.concat([d.update(sifreli.subarray(0, sifreli.length - 16)), d.final()]);
  let son = acik.length - 1;
  while (son >= 0 && acik[son] === 0) son--;
  return { rs, ayrac: acik[son], icerik: acik.subarray(0, son) };
}

console.log('=== 1) RFC 8291 ÖRNEĞİ ===');
const rfc = push.sifrele(Buffer.from('When I grow up, I want to be a watermelon'),
  'BCVxsr7N_eNgVRqvHtD0zTZsEc6-VV-JvLexhqUzORcxaOzi6-AYWXvTBHm4bjyPjs7Vd8pZGH6SRpkNtoIAiw4',
  'BTBZMqHH6r4Tts7J_aSIgg', { asGizli: 'yfWPiYE-n46HLnH0KqZOF1fJJU3MYrct3AELtAQ-oRw', tuz: 'DGv6ra1nlYgDCS1FRnbzlw' });
kontrol('RFC 8291 Ek A çıktısı birebir aynı', rfc.toString('base64url') ===
  'DGv6ra1nlYgDCS1FRnbzlwAAEABBBP4z9KsN6nGRTbVYI_c7VJSPQTBtkgcy27mlmlMoZIIgDll6e3vCYLocInmYWAmS6TlzAC8wEqKK6PBru3jl7A_' +
  'yl95bQpu6cVPTpK4Mqgkf1CXztLVBSt2Ks3oZwbuwXPXLWyouBWLVWGNWQexSgSxsj_Qulcy4a-fN', rfc.toString('base64url'));

console.log('=== 2) ŞİFRELE / ÇÖZ TURU ===');
const ua = crypto.createECDH('prime256v1');
ua.generateKeys();
const authSir = crypto.randomBytes(16);
const mesaj = JSON.stringify({ t: 'Eğitim Evi', b: 'Servis eve 100 m kaldı. Çağla, ş, ı, ö', u: '/doruk/#/servis' });
const govde = push.sifrele(Buffer.from(mesaj), ua.getPublicKey().toString('base64url'), authSir.toString('base64url'));
const acilan = coz(govde, ua, authSir);
kontrol('tarayıcı tarafı içeriği geri açıyor', acilan.icerik.toString('utf8') === mesaj, acilan.icerik.toString('utf8'));
kontrol('son kayıt ayracı 2, kayıt boyu 4096', acilan.ayrac === 2 && acilan.rs === 4096, acilan.ayrac + ' ' + acilan.rs);
const govde2 = push.sifrele(Buffer.from(mesaj), ua.getPublicKey().toString('base64url'), authSir.toString('base64url'));
kontrol('her gönderimde tuz ve geçici anahtar yeni', !govde.subarray(0, 16).equals(govde2.subarray(0, 16)) &&
  !govde.subarray(21, 86).equals(govde2.subarray(21, 86)));
const bozuk = Buffer.from(govde); bozuk[bozuk.length - 20] ^= 1;
let bozukAcildi = true;
try { coz(bozuk, ua, authSir); } catch (e) { bozukAcildi = false; }
kontrol('tek bit değişen içerik açılmıyor (bütünlük)', !bozukAcildi);
const baska = crypto.createECDH('prime256v1'); baska.generateKeys();
let baskaActi = true;
try { coz(govde, baska, authSir); } catch (e) { baskaActi = false; }
kontrol('başka cihazın anahtarıyla açılmıyor', !baskaActi);

console.log('=== 3) VAPID ===');
const bas = push.vapidBasligi('https://fcm.googleapis.com/fcm/send/abc');
const m = /^vapid t=([A-Za-z0-9_-]+)\.([A-Za-z0-9_-]+)\.([A-Za-z0-9_-]+), k=([A-Za-z0-9_-]+)$/.exec(bas);
kontrol('başlık biçimi doğru', !!m, bas.slice(0, 60));
if (m) {
  const baslik = JSON.parse(Buffer.from(m[1], 'base64url').toString());
  const yuk = JSON.parse(Buffer.from(m[2], 'base64url').toString());
  kontrol('ES256, hedef yalnızca push servisinin kökü', baslik.alg === 'ES256' && yuk.aud === 'https://fcm.googleapis.com', JSON.stringify(yuk));
  const kalan = yuk.exp - Math.floor(Date.now() / 1000);
  kontrol('süre 24 saati geçmiyor', kalan > 0 && kalan <= 24 * 3600, String(kalan));
  kontrol('iletişim adresi https', /^https:\/\//.test(yuk.sub) || /^mailto:/.test(yuk.sub), yuk.sub);
  const acik = Buffer.from(m[4], 'base64url');
  const anahtarNesnesi = crypto.createPublicKey({ key: { kty: 'EC', crv: 'P-256',
    x: acik.subarray(1, 33).toString('base64url'), y: acik.subarray(33, 65).toString('base64url') }, format: 'jwk' });
  const dogru = crypto.verify('sha256', Buffer.from(m[1] + '.' + m[2]), { key: anahtarNesnesi, dsaEncoding: 'ieee-p1363' },
    Buffer.from(m[3], 'base64url'));
  kontrol('imza sunucunun açık anahtarıyla doğrulanıyor', dogru);
  kontrol('açık anahtar /api/push/anahtar ile aynı', m[4] === push.anahtarlar().acik);
}
const dosya = path.join(GECICI, 'push-anahtar.json');
kontrol('anahtar veri klasörüne yazıldı', fs.existsSync(dosya));
const kayitli = JSON.parse(fs.readFileSync(dosya, 'utf8'));
kontrol('kayıtlı anahtar kullanılanla aynı (yeniden açılışta değişmez)', kayitli.acik === push.anahtarlar().acik);

console.log('=== 4) ABONELİK ADRESİ SÜZGECİ ===');
const kabul = ['https://fcm.googleapis.com/fcm/send/aBc:12', 'https://updates.push.services.mozilla.com/wpush/v2/gAAA',
  'https://wns2-db5p.notify.windows.com/w/?token=AAA', 'https://web.push.apple.com/QGx', 'https://android.googleapis.com/gcm/send/x'];
const ret = ['http://fcm.googleapis.com/fcm/send/x', 'https://localhost/x', 'https://127.0.0.1/x', 'https://[::1]/x',
  'https://fcm.googleapis.com.saldiri.com/x', 'https://sahtefcm.googleapis.com/x', 'https://fcm.googleapis.com:8443/x',
  'https://kullanici:sifre@fcm.googleapis.com/x', 'https://fcm.googleapis.com@saldiri.com/x', 'https://169.254.169.254/latest',
  'file:///etc/passwd', 'javascript:alert(1)', '', null, 42, { toString: () => 'https://fcm.googleapis.com/x' + '' }];
kontrol('bilinen servisler kabul', kabul.every(a => push.adresGecerli(a)), kabul.filter(a => !push.adresGecerli(a)).join(' '));
const gecenler = ret.slice(0, -1).filter(a => push.adresGecerli(a));
kontrol('iç ağ, başka alan adı, başka port, parolalı adres reddediliyor', gecenler.length === 0, gecenler.join(' '));

console.log('=== 5) TARAYICI ANAHTARLARI ===');
const p = ua.getPublicKey().toString('base64url'), a = authSir.toString('base64url');
kontrol('geçerli anahtar kabul', !!push.anahtarGecerli(p, a));
kontrol('dolgulu standart base64 düzeltilip kabul', !!push.anahtarGecerli(ua.getPublicKey().toString('base64'), authSir.toString('base64')));
const kisa = crypto.randomBytes(64).toString('base64url');
const sikistirilmis = ua.getPublicKey('base64url', 'compressed');
kontrol('yanlış boy, sıkıştırılmış nokta, kısa auth, nesne reddediliyor',
  !push.anahtarGecerli(kisa, a) && !push.anahtarGecerli(sikistirilmis, a) && !push.anahtarGecerli(p, 'abc') &&
  !push.anahtarGecerli({}, a) && !push.anahtarGecerli(p, ['x']));
const noktaDisi = Buffer.alloc(65, 7); noktaDisi[0] = 4;
let patladi = false, sonuc = null;
try { sonuc = push.sifrele(Buffer.from('x'), noktaDisi.toString('base64url'), a); } catch (e) { patladi = true; }
kontrol('eğri dışı nokta şifrelemede hata veriyor (gönderim sessizce atlanır)', patladi && sonuc === null);
kontrol('eğri dışı nokta abonelikte reddediliyor', !push.anahtarGecerli(noktaDisi.toString('base64url'), a));

fs.rmSync(GECICI, { recursive: true, force: true });
console.log();
console.log('  GECTI: ' + gecti + '   KALDI: ' + kaldi);
process.exit(kaldi ? 1 : 0);
