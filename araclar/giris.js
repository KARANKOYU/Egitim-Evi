'use strict';
/* Araçlar için ortak giriş yardımcısı.

   İki adımlı doğrulama zorunlu olduğu için araçlar da kodu girmek zorunda.
   E-posta ayarlı değilken sunucu kodu kendi penceresine yazar; bu dosya
   sunucunun günlük çıktısından okur. Bu yüzden yalnızca kendi bilgisayarında,
   sunucuyu bir dosyaya yönlendirerek çalıştırdığında işe yarar:

     node server.js > sunucu.log
     EE_LOG=sunucu.log node araclar/gezinti.js
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
    /* Girişte e-posta ya da kullanıcı adı yazılmış olabilir; günlük satırında
       ikisi de var: "Ad Soyad <eposta> [kullanici.adi]". Büyük/küçük harf fark etmez. */
    const k = deseneKacir(String(eposta).trim().toLowerCase());
    const re = new RegExp(
      'Kullanici\\s*:[^\\n]*(?:<' + k + '>|\\[' + k + '\\])[\\s\\S]*?KOD\\s*:\\s*(\\d{6})',
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

/* Günlükteki e-posta onay anahtarını okur (kayıt ya da e-posta değişikliği).
   E-posta ayarlı değilken sunucu bağlantıyı gönderemez, günlüğe yazar. */
function sonOnayAnahtari(eposta) {
  const metin = fs.readFileSync(LOG, 'utf8');
  const k = deseneKacir(String(eposta).trim().toLowerCase());
  const re = new RegExp('Eposta\\s*:\\s*' + k + '\\s[\\s\\S]*?ONAY ANAHTARI\\s*:\\s*([a-f0-9]{64})', 'g');
  let son = null, m;
  while ((m = re.exec(metin))) son = m[1];
  if (!son) throw new Error('Günlükte ' + eposta + ' için onay anahtarı yok.');
  return son;
}

/* Kaydın ya da e-posta değişikliğinin onay bağlantısına "tıklar". */
async function epostaOnayla(eposta) {
  const r = await iste('/api/eposta-onay', 'POST', { token: sonOnayAnahtari(eposta) });
  if (r.status !== 200) throw new Error('e-posta onayı (' + eposta + '): ' + (r.body.error || r.status));
  return r.body;
}

/* Bot doğrulama sorusunu çözer. */
async function botCevabi() {
  const s = await iste('/api/challenge');
  const m = String(s.body.soru || '').match(/(\d+)\s*\+\s*(\d+)/);
  if (!m) throw new Error('Doğrulama sorusu okunamadı');
  return { challengeId: s.body.id, challengeAnswer: Number(m[1]) + Number(m[2]) };
}

/* Şifre + iki adımlı doğrulamayı birlikte yapar, oturum anahtarını döndürür.
   okul: okul adresinin kısa adı (egitimevi.org/<kısa ad>); verilirse kullanıcı
   adı o okulun içinde aranır. */
async function girisYap(email, sifre, okul) {
  const bot = await botCevabi();
  const adim1 = await iste('/api/login', 'POST', {
    email: email, password: sifre, okul: okul || undefined,
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

/* Rolsüz yetişkin hesabı açar: kayıt olur, e-postadaki onay bağlantısına
   tıklar (hesap ancak o zaman açılır). g: { fullName, username, email, password, ... } */
async function hesapAc(g) {
  const bot = await botCevabi();
  const r = await iste('/api/register', 'POST', Object.assign({
    kvkkOnay: true, phone: '05321234567', password: 'Test1234!'
  }, g, bot));
  if (r.status !== 200) throw new Error('kayıt (' + (g.email || g.username) + '): ' + (r.body.error || r.status));
  if (r.body.onayGerekli) return Object.assign(r.body, { onay: await epostaOnayla(g.email) });
  return r.body;
}

/* Öğretmen: kendi yetişkin hesabını açar, eşleme kodunu alır; müdür (token)
   kodu girip onu okula ekler. g: { fullName, username, email, password, brans }.
   Dönen: öğretmenin bu okuldaki rol satırı { id, fullName, username }. */
async function ogretmenYap(token, g) {
  const kadi = g.username || ('ogretmen' + Date.now().toString(36) + Math.floor(Math.random() * 1000));
  const eposta = g.email || (kadi.replace(/[^a-z0-9]/g, '') + '@test.com');
  const sifre = g.password || 'Test1234!';
  await hesapAc({ fullName: g.fullName, username: kadi, email: eposta, password: sifre, phone: g.telefon || '05321234567' });
  const hesap = await girisYap(eposta, sifre);
  const k = await iste('/api/kisilikler', 'GET', null, hesap.token);
  if (k.status !== 200) throw new Error('öğretmen kodu: ' + (k.body.error || k.status));
  const r = await iste('/api/school/ogretmen-ekle', 'POST', { kod: k.body.ogretmenKodu, brans: g.brans || g.branch }, token);
  if (r.status !== 200) throw new Error('öğretmen ekleme (' + kadi + '): ' + (r.body.error || r.status));
  await iste('/api/logout', 'POST', null, hesap.token);
  return Object.assign({ email: eposta }, r.body.hesap);
}

/* Okul (müdür ya da yetkili) hesap açar. rol: 'student' | 'servisci'; 'teacher'
   verilirse öğretmen kendi hesabını açıp kodla eklenir (ogretmenYap).
   g: { fullName, username, email, password, tc, classId, brans, ... }.
   Şifre verildiği için kişi ilk girişte şifre değiştirmek zorunda kalmaz;
   hesap bir kez girilip aydınlatma metni onaylanır (testlerde her uç açık olsun). */
async function okulHesabi(token, rol, g, onaylat) {
  if (rol === 'teacher') return ogretmenYap(token, g);
  const r = await iste('/api/school/hesap-ac', 'POST',
    Object.assign({ rol, tc: tcUret(), password: 'Test1234!' }, g), token);
  if (r.status !== 200) throw new Error('hesap açma (' + (g.username || g.fullName) + '): ' + (r.body.error || r.status));
  if (onaylat !== false) {
    const kisi = await girisYap(g.email || g.username, g.password || 'Test1234!');
    if (kisi.kvkkGuncel === false) await iste('/api/kvkk-onay', 'POST', { onay: true }, kisi.token);
  }
  return r.body.hesap;
}

