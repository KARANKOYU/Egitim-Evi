const { girisYap, hesapAc, okulHesabi, mudurYap } = require('./giris');
const BASE = process.env.EE_BASE || 'http://localhost:3000';

async function api(yol, method = 'GET', body = null, token = null) {
  const h = { 'Content-Type': 'application/json' };
  if (token) h['Authorization'] = 'Bearer ' + token;
  const r = await fetch(BASE + '/api' + yol, {
    method, headers: h, body: body ? JSON.stringify(body) : undefined
  });
  const t = await r.text();
  let j; try { j = JSON.parse(t); } catch (e) { j = { raw: t }; }
  if (!r.ok) throw new Error(method + ' ' + yol + ' -> ' + r.status + ' ' + (j.error || t.slice(0, 120)));
  return j;
}

