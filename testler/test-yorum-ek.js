/* Açılış sayfası yorumları ve ekler:
   - yorumu yalnızca rolü ya da çocuğu olan yetişkin yazar (öğrenci, rolsüz yetişkin yazamaz);
   - ad kısaltılır ("Ayşe Kaya" -> "Ay. Ka."), yıldız 0-5, uygunsuz kelime ve internet adresi reddedilir;
   - hesap başına tek yorum; yönetici gizler, gizli yorum açılışta görünmez;
   - ek: taslak yüklenir, mesaja/ödeve bağlanır; alıcı ve ödevin öğrencisi indirir, başkası indiremez;
   - ödeve eki yalnızca öğretmen koyar; izinsiz uzantı ve 150 MB üstü reddedilir;
   - başkasının taslağı mesaja bağlanamaz; indirme her zaman "ek" (attachment, nosniff). */
const http = require('http');
const crypto = require('crypto');
const { BASE, iste, girisYap, hesapAc } = require('./giris');

let gecti = 0, kaldi = 0;
function kontrol(ad, sart, detay) {
  if (sart) { gecti++; console.log('  GECTI  ' + ad); }
  else { kaldi++; console.log('  KALDI  ' + ad + (detay ? '  -> ' + detay : '')); }
}
const J = x => JSON.stringify(x).slice(0, 200);
const gun = n => new Date(Date.now() + n * 86400000).toISOString().slice(0, 10);

async function ekYukle(token, tur, ad, veri) {
  const h = { 'Content-Type': 'application/octet-stream', 'X-Dosya-Adi': encodeURIComponent(ad) };
  if (token) h.Authorization = 'Bearer ' + token;
  const r = await fetch(BASE + '/api/ek/yukle?tur=' + tur, { method: 'POST', headers: h, body: veri });
  let j = {};
  try { j = JSON.parse(await r.text()); } catch (e) { j = {}; }
  return { status: r.status, body: j };
}
async function indir(token, id) {
  const b = await iste('/api/ek/bilet?id=' + id, 'GET', null, token);
  if (b.status !== 200) return { status: b.status, body: b.body };
  const r = await fetch(BASE + b.body.yol);
  return { status: r.status, headers: r.headers, veri: Buffer.from(await r.arrayBuffer()) };
}
function buyukBildir(token) {
  return new Promise(resolve => {
    const u = new URL(BASE + '/api/ek/yukle?tur=mesaj');
    const req = http.request({ hostname: u.hostname, port: u.port, path: u.pathname + u.search, method: 'POST', headers: {
      Authorization: 'Bearer ' + token, 'Content-Type': 'application/octet-stream', 'X-Dosya-Adi': 'video.mp4',
      'Content-Length': String(160 * 1024 * 1024) } }, res => {
      let t = '';
      res.on('data', c => { t += c; });
      res.on('end', () => { req.destroy(); resolve({ status: res.statusCode, body: t }); });
    });
    req.on('error', () => resolve({ status: 0 }));
    req.write(Buffer.alloc(1024));
  });
}

