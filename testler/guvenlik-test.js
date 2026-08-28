const { girisYap, sonKod, botCevabi, epostaOnayla } = require('./giris');
const BASE = process.env.EE_BASE || 'http://localhost:3000';
let gecti = 0, kaldi = 0;

function kontrol(ad, sart, detay) {
  if (sart) { gecti++; console.log('  GECTI  ' + ad); }
  else { kaldi++; console.log('  KALDI  ' + ad + (detay ? '  -> ' + detay : '')); }
}

async function iste(yol, method, body, token) {
  const h = {};
  if (body) h['Content-Type'] = 'application/json';
  if (token) h['Authorization'] = 'Bearer ' + token;
  const r = await fetch(BASE + yol, {
    method: method || 'GET', headers: h,
    body: body ? JSON.stringify(body) : undefined
  });
  const t = await r.text();
  let j;
  try { j = JSON.parse(t); } catch (e) { j = { raw: t.slice(0, 200) }; }
  return { status: r.status, body: j, headers: r.headers };
}

function cevapla(soruMetni) {
  const m = soruMetni.match(/(\d+)\s*\+\s*(\d+)/);
  return Number(m[1]) + Number(m[2]);
}

