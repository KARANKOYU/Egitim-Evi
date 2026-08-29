'use strict';
/* Şifre özetleme (scrypt).
   Şifreler asla düz metin saklanmaz; burada özetlenir ve doğrulanır.
   Doğrulama asenkron çalışır ki uzun süren hesap sunucuyu kilitlemesin. */

const crypto = require('crypto');

const SCRYPT_AYAR = { N: 16384, r: 8, p: 1, maxmem: 72 * 1024 * 1024 };

function scryptAsync(pw, salt) {
  return new Promise((resolve, reject) => {
    crypto.scrypt(pw, salt, 64, SCRYPT_AYAR, (e, key) => e ? reject(e) : resolve(key));
  });
}

function hashPwSync(pw, salt) {
  salt = salt || crypto.randomBytes(16).toString('hex');
  return salt + ':' + crypto.scryptSync(pw, salt, 64, SCRYPT_AYAR).toString('hex');
}

async function hashPw(pw, salt) {
  salt = salt || crypto.randomBytes(16).toString('hex');
  const key = await scryptAsync(pw, salt);
  return salt + ':' + key.toString('hex');
}

/* Toplu özetleme (Excel ile yüzlerce hesap, toplu şifre dağıtımı): bütün
   toplu işler ortak iki kanalı paylaşır. Hepsi birden başlatılsaydı libuv'nin
   dört iş parçacığı saniyelerce dolar, girişler ve dosya işleri beklerdi. */
const TOPLU_KANAL = 2;
let topluSuren = 0;
const topluSira = [];
function topluKanalAl() {
  if (topluSuren < TOPLU_KANAL) { topluSuren++; return Promise.resolve(); }
  return new Promise(r => topluSira.push(r));
}
function topluKanalBirak() {
  const siradaki = topluSira.shift();
  if (siradaki) siradaki(); else topluSuren--;
}
async function hashPwToplu(sifreler) {
  const sonuc = new Array(sifreler.length);
  await Promise.all(sifreler.map(async (s, i) => {
    await topluKanalAl();
    try { sonuc[i] = await hashPw(String(s)); } finally { topluKanalBirak(); }
  }));
  return sonuc;
}

async function verifyPw(pw, stored) {
  if (!stored || stored.indexOf(':') < 0) return false;
  const parts = stored.split(':');
  let a;
  try { a = Buffer.from(parts[1], 'hex'); } catch (e) { return false; }
  if (!a.length) return false;
  const b = await scryptAsync(pw, parts[0]);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}


module.exports = {
  SCRYPT_AYAR,
  scryptAsync,
  hashPwSync,
  hashPw,
  hashPwToplu,
  verifyPw
};
