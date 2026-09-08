'use strict';
/* Araçlar için ortak giriş yardımcısı.

   İki adımlı doğrulama zorunlu olduğu için araçlar da kodu girmek zorunda.
   E-posta ayarlı değilken sunucu kodu kendi penceresine yazar; bu dosya
   sunucunun günlük çıktısından okur. Bu yüzden yalnızca kendi bilgisayarında,
   sunucuyu bir dosyaya yönlendirerek çalıştırdığında işe yarar:

     node server.js > sunucu.log
     EE_LOG=sunucu.log node araclar/ekran-goruntusu.js
*/

const fs = require('fs');
const path = require('path');

const BASE = process.env.EE_BASE || 'http://localhost:3000';
const LOG = process.env.EE_LOG || path.join(__dirname, '..', 'sunucu.log');

async function iste(yol, method, body, token) {
  const h = {};
  if (body) h['Content-Type'] = 'application/json';
  if (token) h['Authorization'] = 'Bearer ' + token;
  const r = await fetch(BASE + yol, {
    method: method || 'GET',
    headers: h,
    body: body ? JSON.stringify(body) : undefined
  });
  const t = await r.text();
  let j;
  try { j = JSON.parse(t); } catch (e) { j = { raw: t.slice(0, 200) }; }
  return { status: r.status, body: j, headers: r.headers };
}

/* Düzenli ifadede özel anlamı olan karakterleri kaçırır. */
function deseneKacir(metin) {
  return String(metin).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/* Günlükteki giriş kodunu okur.

   E-posta verilirse yalnızca o kullanıcıya ait kodu döndürür. Art arda
   birkaç giriş yapıldığında günlükteki son kod başkasına ait olabiliyor;
   yanlış kod girmek de hesabı kaba kuvvet kilidine sokuyordu. */
function sonKod(eposta) {
  if (!fs.existsSync(LOG)) {
    throw new Error('Sunucu günlüğü bulunamadı: ' + LOG +
      '\n  Sunucuyu "node server.js > sunucu.log" ile başlat.');
  }
  const metin = fs.readFileSync(LOG, 'utf8');

  if (eposta) {
    const re = new RegExp(
      'Kullanici\\s*:[^\\n]*<' + deseneKacir(eposta) + '>[\\s\\S]*?KOD\\s*:\\s*(\\d{6})',
      'g');
    let son = null;
    let m;
    while ((m = re.exec(metin))) son = m[1];
    if (son) return son;
  }

  const eslesmeler = metin.match(/KOD\s*:\s*(\d{6})/g);
  if (!eslesmeler || !eslesmeler.length) {
    throw new Error('Günlükte giriş kodu yok. E-posta ayarlıysa kod ekrana yazılmaz.');
  }
  return eslesmeler[eslesmeler.length - 1].match(/(\d{6})/)[1];
}

/* Bot doğrulama sorusunu çözer. */
async function botCevabi() {
  const s = await iste('/api/challenge');
  const m = String(s.body.soru || '').match(/(\d+)\s*\+\s*(\d+)/);
  if (!m) throw new Error('Doğrulama sorusu okunamadı');
  return { challengeId: s.body.id, challengeAnswer: Number(m[1]) + Number(m[2]) };
}

/* Şifre + iki adımlı doğrulamayı birlikte yapar, oturum anahtarını döndürür. */
async function girisYap(email, sifre) {
  const bot = await botCevabi();
  const adim1 = await iste('/api/login', 'POST', {
    email: email, password: sifre,
    challengeId: bot.challengeId, challengeAnswer: bot.challengeAnswer
  });
  if (adim1.status !== 200) {
    const e = new Error('giriş 1. adım: ' + adim1.status + ' ' + (adim1.body.error || ''));
    e.status = adim1.status;
    e.body = adim1.body;
    throw e;
  }
  if (!adim1.body.twoFactor) return adim1.body;

  const kod = sonKod(email);
  const adim2 = await iste('/api/login/dogrula', 'POST', {
    challengeId: adim1.body.challengeId, code: kod
  });
  if (adim2.status !== 200) {
    throw new Error('giriş 2. adım: ' + adim2.status + ' ' + (adim2.body.error || ''));
  }
  return adim2.body;
}

module.exports = { BASE, LOG, iste, sonKod, girisYap, botCevabi };
