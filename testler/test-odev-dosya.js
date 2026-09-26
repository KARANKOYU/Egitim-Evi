/* Ödev teslim dosyaları:
   - yalnızca ödevdeki öğrenci, teslim açıkken, izinli türde ve sınır içinde yükler;
   - dosya adı temizlenir (yol parçası kalmaz); içerik bayt bayt geri gelir;
   - indirme her zaman ek (attachment, nosniff, sandbox) olarak gider;
   - başka öğrenci, başka öğretmen, bağsız veli dosyaya erişemez;
   - öğretmenin zip'i geçerli: adlar öğrenci klasörlerinde, CRC32'ler doğru;
   - sayı sınırı, sonuçlandırılmış ve süresi geçmiş ödev, büyük dosya reddedilir. */
const http = require('http');
const zlib = require('zlib');
const crypto = require('crypto');
const { iste, girisYap, hesapAc } = require('./giris');

const BASE = process.env.EE_BASE || 'http://localhost:3000';
let gecti = 0, kaldi = 0;
function kontrol(ad, sart, detay) {
  if (sart) { gecti++; console.log('  GECTI  ' + ad); }
  else { kaldi++; console.log('  KALDI  ' + ad + (detay ? '  -> ' + detay : '')); }
}
const J = x => JSON.stringify(x).slice(0, 180);
const gun = n => new Date(Date.now() + n * 86400000).toISOString().slice(0, 10);

async function yukle(token, odevId, ad, veri) {
  const h = { 'Content-Type': 'application/octet-stream', 'X-Dosya-Adi': encodeURIComponent(ad) };
  if (token) h.Authorization = 'Bearer ' + token;
  const r = await fetch(BASE + '/api/odev-dosya/yukle?odev=' + encodeURIComponent(odevId), { method: 'POST', headers: h, body: veri });
  let j = {};
  try { j = JSON.parse(await r.text()); } catch (e) { j = {}; }
  return { status: r.status, body: j };
}

async function indir(token, yol) {
  const r = await fetch(BASE + yol, { headers: { Authorization: 'Bearer ' + token } });
  return { status: r.status, headers: r.headers, veri: Buffer.from(await r.arrayBuffer()) };
}

/* Gövdeyi göndermeden büyük boyut bildir: sunucu okumadan reddetmeli. */
function buyukBildir(token, odevId) {
  return new Promise(resolve => {
    const u = new URL(BASE + '/api/odev-dosya/yukle?odev=' + encodeURIComponent(odevId));
    const req = http.request({ hostname: u.hostname, port: u.port, path: u.pathname + u.search, method: 'POST', headers: {
      Authorization: 'Bearer ' + token, 'Content-Type': 'application/octet-stream', 'X-Dosya-Adi': 'video.mp4',
      'Content-Length': String(300 * 1024 * 1024) } }, res => {
      let t = '';
      res.on('data', c => { t += c; });
      res.on('end', () => { req.destroy(); resolve({ status: res.statusCode, body: t }); });
    });
    req.on('error', () => resolve({ status: 0 }));
    req.write(Buffer.alloc(1024));
  });
}

function zipOku(buf) {
  const girdiler = [];
  let i = 0;
  while (i + 30 <= buf.length && buf.readUInt32LE(i) === 0x04034b50) {
    const crc = buf.readUInt32LE(i + 14), boyut = buf.readUInt32LE(i + 18);
    const adUz = buf.readUInt16LE(i + 26), ekUz = buf.readUInt16LE(i + 28);
    const ad = buf.slice(i + 30, i + 30 + adUz).toString('utf8');
    const veri = buf.slice(i + 30 + adUz + ekUz, i + 30 + adUz + ekUz + boyut);
    girdiler.push({ ad, veri, crcDogru: (zlib.crc32(veri) >>> 0) === crc });
    i += 30 + adUz + ekUz + boyut;
  }
  const e = buf.length - 22;
  return { girdiler, sonDogru: e > 0 && buf.readUInt32LE(e) === 0x06054b50 && buf.readUInt16LE(e + 10) === girdiler.length };
}

