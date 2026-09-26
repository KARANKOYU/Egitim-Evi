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

(async () => {
  console.log('\n=== 1) GUVENLIK BASLIKLARI ===');
  const kok = await iste('/');
  const csp = kok.headers.get('content-security-policy');
  kontrol('CSP basligi var', !!csp);
  kontrol('CSP script-src self', !!csp && csp.indexOf("script-src 'self'") >= 0);
  kontrol('CSP frame-ancestors none', !!csp && csp.indexOf('frame-ancestors') >= 0);
  kontrol('X-Frame-Options DENY', kok.headers.get('x-frame-options') === 'DENY');
  kontrol('X-Content-Type-Options nosniff', kok.headers.get('x-content-type-options') === 'nosniff');
  kontrol('Referrer-Policy var', !!kok.headers.get('referrer-policy'));

  console.log('\n=== 2) BOT DOGRULAMASI ===');
  const botsuz = await iste('/api/register', 'POST', { kvkkOnay: true, phone: '05321234567',
    role: 'parent', fullName: 'Bot Deneme', email: 'bot' + Date.now() + '@test.com',
    password: 'Sifre1234!', city: 'Ankara'
  });
  kontrol('bot cevabi olmadan kayit reddedildi', botsuz.status === 400, JSON.stringify(botsuz.body));

  const soru = await iste('/api/challenge');
  kontrol('soru uretiliyor', soru.status === 200 && !!soru.body.id && !!soru.body.soru);
  kontrol('cevap istemciye sizmiyor', JSON.stringify(soru.body).indexOf('cevap') < 0, JSON.stringify(soru.body));

  const yanlis = await iste('/api/register', 'POST', { kvkkOnay: true, phone: '05321234567',
    role: 'parent', fullName: 'Bot Deneme', email: 'bot2' + Date.now() + '@test.com',
    password: 'Sifre1234!', city: 'Ankara', challengeId: soru.body.id, challengeAnswer: 99999
  });
  kontrol('yanlis cevap reddedildi', yanlis.status === 400, JSON.stringify(yanlis.body));

  const veliMail = 'veli' + Date.now() + '@test.com';
  const dogru = await iste('/api/register', 'POST', { kvkkOnay: true, phone: '05321234567',
    role: 'parent', fullName: 'Veli Deneme', email: veliMail,
    password: 'Sifre1234!', city: 'Ankara',
    challengeId: soru.body.id, challengeAnswer: cevapla(soru.body.soru)
  });
  kontrol('dogru cevapla kayit gecti', dogru.status === 200, JSON.stringify(dogru.body));
  if (dogru.body.onayGerekli) await epostaOnayla(veliMail);

  const tekrar = await iste('/api/register', 'POST', { kvkkOnay: true, phone: '05321234567',
    role: 'parent', fullName: 'Tekrar Deneme', email: 'tekrar' + Date.now() + '@test.com',
    password: 'Sifre1234!', city: 'Ankara',
    challengeId: soru.body.id, challengeAnswer: cevapla(soru.body.soru)
  });
  kontrol('ayni soru ikinci kez kullanilamiyor', tekrar.status === 400, JSON.stringify(tekrar.body));

  console.log('\n=== 3) SIFRE POLITIKASI ===');
  const s2 = await iste('/api/challenge');
  const zayif = await iste('/api/register', 'POST', { kvkkOnay: true, phone: '05321234567',
    role: 'parent', fullName: 'Zayif Sifre', email: 'zayif' + Date.now() + '@test.com',
    password: 'abc', city: 'Ankara', challengeId: s2.body.id, challengeAnswer: cevapla(s2.body.soru)
  });
  kontrol('kisa sifre reddedildi', zayif.status === 400, JSON.stringify(zayif.body));

  const s3 = await iste('/api/challenge');
  const rakamsiz = await iste('/api/register', 'POST', { kvkkOnay: true, phone: '05321234567',
    role: 'parent', fullName: 'Rakamsiz Sifre', email: 'rakamsiz' + Date.now() + '@test.com',
    password: 'sadeceharf', city: 'Ankara', challengeId: s3.body.id, challengeAnswer: cevapla(s3.body.soru)
  });
  kontrol('rakamsiz sifre reddedildi', rakamsiz.status === 400, JSON.stringify(rakamsiz.body));

  console.log('\n=== 4) YOL KACISI ===');
  const yollar = ['/../data/db.json', '/..%2fdata%2fdb.json', '/js/../../data/db.json', '/../server.js'];
  for (const yol of yollar) {
    const r = await iste(yol);
    const metin = JSON.stringify(r.body);
    const sizdi = metin.indexOf('scryptAsync') >= 0 || metin.indexOf('"users"') >= 0 || metin.indexOf('sessions') >= 0;
    kontrol('sizinti yok: ' + yol, !sizdi, 'status ' + r.status);
  }

  console.log('\n=== 5) PROTOTYPE POLLUTION ===');
  await iste('/api/login', 'POST', JSON.parse('{"email":"x@y.com","password":"z","__proto__":{"kirlendi":true}}'));
  kontrol('prototip kirlenmedi', {}.kirlendi === undefined && Object.prototype.kirlendi === undefined);

  console.log('\n=== 6) KABA KUVVET KILIDI ===');
  const hedef = 'admin@egitimevi.com';
  let kilitlendi = false, kacinci = 0;
  for (let i = 1; i <= 8; i++) {
    const bot = await botCevabi();
    const r = await iste('/api/login', 'POST',
      { email: hedef, password: 'yanlis' + i, challengeId: bot.challengeId, challengeAnswer: bot.challengeAnswer });
    if (r.status === 429) { kilitlendi = true; kacinci = i; break; }
  }
  kontrol('hatali denemeler sonrasi kilit devreye girdi', kilitlendi, kacinci + '. denemede');

  const botK = await botCevabi();
  const kilitliDogru = await iste('/api/login', 'POST',
    { email: hedef, password: 'admin123', challengeId: botK.challengeId, challengeAnswer: botK.challengeAnswer });
  kontrol('kilitliyken dogru sifre de kabul edilmiyor', kilitliDogru.status === 429, 'status ' + kilitliDogru.status);

  console.log('\n=== 7) NORMAL AKIS BOZULMADI ===');
  let ogr = { body: {} };
  try { ogr.body = await girisYap('ogrenci1@test.com', 'Test1234!'); } catch (e) { ogr.hata = e.message; }
  kontrol('mevcut kullanici 2FA ile giris yapabiliyor', !!ogr.body.token, ogr.hata || '');
  if (ogr.body.token) {
    const ilerleme = await iste('/api/progress', 'GET', null, ogr.body.token);
    kontrol('odevler geliyor (5 adet)',
      ilerleme.status === 200 && ilerleme.body.assignments && ilerleme.body.assignments.length === 5,
      'adet ' + ((ilerleme.body.assignments || []).length));
    const yetkisiz = await iste('/api/admin/overview', 'GET', null, ogr.body.token);
    kontrol('ogrenci admin ucuna erisemiyor', yetkisiz.status === 403, 'status ' + yetkisiz.status);
    const sahte = await iste('/api/progress', 'GET', null, 'sahtetoken123');
    kontrol('sahte token reddediliyor', sahte.status === 401, 'status ' + sahte.status);
  }

  console.log('\n=== 8) VELI KODU KABA KUVVET ===');
  let veli = { body: {} };
  try { veli.body = await girisYap(veliMail, 'Sifre1234!'); } catch (e) { veli.hata = e.message; }
  let kodKilit = false;
  if (veli.body.token) {
    for (let i = 0; i < 8; i++) {
      const r = await iste('/api/parent/link', 'POST', { code: 'YanlisKod' + i }, veli.body.token);
      if (r.status === 429) { kodKilit = true; break; }
    }
  }
  kontrol('veli kodu deneme siniri var', kodKilit);

  console.log('\n=== 8b) GIRISTE KOSULLU BOT DOGRULAMASI ===');
  /* Temiz kullanici soruyu gormez: captcha gondermeden giris 1. adimi gecmeli. */
  const temizMail = 'fen@test.com';   // yetişkin hesabı: iki adımlı giriş zorunlu
  const temizGiris = await iste('/api/login', 'POST',
    { email: temizMail, password: 'Test1234!' });
  kontrol('temiz kullanici captcha olmadan girebiliyor',
    temizGiris.status === 200 && temizGiris.body.twoFactor === true,
    'status ' + temizGiris.status);

  /* Hatali deneme sonrasi soru zorunlu olmali. */
  const hatali = await iste('/api/login', 'POST',
    { email: temizMail, password: 'YanlisSifre1' });
  kontrol('hatali giris soru gerektigini bildiriyor',
    hatali.status === 401 && hatali.body.soruGerekli === true,
    JSON.stringify(hatali.body));

  const captchasiz = await iste('/api/login', 'POST',
    { email: temizMail, password: 'Test1234!' });
  kontrol('hatadan sonra captchasiz giris reddediliyor',
    captchasiz.status === 400 && captchasiz.body.soruGerekli === true,
    JSON.stringify(captchasiz.body));

  const botY = await botCevabi();
  const yanlisCaptcha = await iste('/api/login', 'POST',
    { email: temizMail, password: 'Test1234!',
      challengeId: botY.challengeId, challengeAnswer: 99999 });
  kontrol('yanlis captcha reddediliyor', yanlisCaptcha.status === 400,
    JSON.stringify(yanlisCaptcha.body));

  const botD = await botCevabi();
  const dogruCaptcha = await iste('/api/login', 'POST',
    { email: temizMail, password: 'Test1234!',
      challengeId: botD.challengeId, challengeAnswer: botD.challengeAnswer });
  kontrol('dogru captcha ile giris devam ediyor', dogruCaptcha.status === 200,
    'status ' + dogruCaptcha.status);

  console.log('\n=== 9) IKI ADIMLI GIRIS (2FA) ===');
  /* Öğrenci dışında herkese zorunlu; öğrenci e-postası olsa da kodsuz girer. */
  const botO = await botCevabi();
  const ogrGiris = await iste('/api/login', 'POST',
    { email: 'ogrenci1@test.com', password: 'Test1234!', challengeId: botO.challengeId, challengeAnswer: botO.challengeAnswer });
  kontrol('ogrenciye kod gonderilmiyor', ogrGiris.status === 200 && !!ogrGiris.body.token && !ogrGiris.body.twoFactor,
    JSON.stringify(ogrGiris.body).slice(0, 120));
  const bot1 = await botCevabi();
  const a1 = await iste('/api/login', 'POST',
    { email: 'mat@test.com', password: 'Test1234!',
      challengeId: bot1.challengeId, challengeAnswer: bot1.challengeAnswer });
  kontrol('sifre dogruyken token VERILMIYOR',
    a1.status === 200 && !a1.body.token && a1.body.twoFactor === true,
    JSON.stringify(a1.body).slice(0, 120));
  kontrol('kod yanitta sizmiyor', JSON.stringify(a1.body).indexOf(sonKod()) < 0);
  kontrol('e-posta maskeleniyor', (a1.body.maskeliEposta || '').indexOf('*') > 0, a1.body.maskeliEposta);

  const yanlisKod = await iste('/api/login/dogrula', 'POST', { challengeId: a1.body.challengeId, code: '000000' });
  kontrol('yanlis kod reddediliyor', yanlisKod.status === 401, JSON.stringify(yanlisKod.body));

  const kod9 = sonKod();
  const dogruKod = await iste('/api/login/dogrula', 'POST', { challengeId: a1.body.challengeId, code: kod9 });
  kontrol('dogru kod token veriyor', dogruKod.status === 200 && !!dogruKod.body.token);

  const tekrarKod = await iste('/api/login/dogrula', 'POST', { challengeId: a1.body.challengeId, code: kod9 });
  kontrol('ayni kod ikinci kez kullanilamiyor', tekrarKod.status === 401, JSON.stringify(tekrarKod.body));

  const sahteOturum = await iste('/api/login/dogrula', 'POST', { challengeId: 'yokboyle', code: '123456' });
  kontrol('gecersiz oturum kimligi reddediliyor', sahteOturum.status === 401);

  /* Ön yüz parçaları tarayıcıya tek tek (yorumlarıyla) gitmez; yalnız birleşik dosyalar. */
  const TABAN = process.env.EE_BASE || 'http://localhost:3000';
  const durum = async yol => (await fetch(TABAN + yol)).status;
  kontrol('parca dosyasi 404 (/js/parcalar/06-menu.js)', await durum('/js/parcalar/06-menu.js') === 404);
  kontrol('buyuk harfle de 404 (/CSS/Parcalar/00-temel.css)', await durum('/CSS/Parcalar/00-temel.css') === 404);
  kontrol('dolambacli yolla da 404 (/js/./parcalar, /js/x/../parcalar)', await durum('/js/./parcalar/01-yardimcilar.js') === 404 &&
    await durum('/js/x/../parcalar/01-yardimcilar.js') === 404);
  kontrol('birlesik app.js ve style.css aciliyor', await durum('/js/app.js') === 200 && await durum('/css/style.css') === 200);

  console.log('\n======================================');
  console.log('  GECTI: ' + gecti + '   KALDI: ' + kaldi);
  console.log('======================================\n');
  process.exit(kaldi ? 1 : 0);
})().catch(e => { console.error('TEST HATASI:', e.message, e.stack); process.exit(1); });
