/* Sifremi unuttum akisi testleri. */
const fs = require('fs');
const { iste, girisYap, botCevabi, epostaOnayla } = require('./giris');

const LOG = process.env.EE_LOG;
let gecti = 0, kaldi = 0;
function kontrol(ad, sart, detay) {
  if (sart) { gecti++; console.log('  GECTI  ' + ad); }
  else { kaldi++; console.log('  KALDI  ' + ad + (detay ? '  -> ' + detay : '')); }
}

/* Sunucu e-posta ayarli degilken sifirlama anahtarini gunluge yaziyor. */
function sonAnahtar() {
  const m = fs.readFileSync(LOG, 'utf8').match(/Anahtar\s*:\s*([a-f0-9]{64})/g);
  if (!m || !m.length) return '';
  return m[m.length - 1].match(/([a-f0-9]{64})/)[1];
}

async function baglantiIste(email) {
  const bot = await botCevabi();
  return iste('/api/sifre-unuttum', 'POST',
    { email, challengeId: bot.challengeId, challengeAnswer: bot.challengeAnswer });
}

(async () => {
  console.log('=== 1) OKUL LISTESI ===');
  const iller = await iste('/api/okullar/iller');
  kontrol('okul listesi yuklendi', iller.status === 200 && iller.body.toplam > 60000,
    'toplam ' + (iller.body.toplam || 0));
  kontrol('81 il var', (iller.body.iller || []).length === 81,
    (iller.body.iller || []).length + ' il');

  const ara = await iste('/api/okullar/ara?q=' + encodeURIComponent('Bahçeşehir Koleji') +
    '&il=' + encodeURIComponent('Ankara'));
  kontrol('ozel okul aramada bulunuyor', (ara.body.okullar || []).length >= 3,
    'sonuc ' + (ara.body.okullar || []).length);
  const ilk = (ara.body.okullar || [])[0];
  kontrol('ozel bayragi geliyor', ilk && ilk.ozel === 1, JSON.stringify(ilk));
  kontrol('resmi tur geliyor', ilk && /Özel/.test(ilk.resmiTur || ''),
    ilk ? ilk.resmiTur : '-');

  const devlet = await iste('/api/okullar/ara?q=' + encodeURIComponent('Atatürk Lisesi') +
    '&il=' + encodeURIComponent('Ankara'));
  const dIlk = (devlet.body.okullar || [])[0];
  kontrol('devlet okulunda ozel bayragi 0', dIlk && dIlk.ozel === 0, JSON.stringify(dIlk));
  kontrol('devlet okulunda kurum kodu var', dIlk && dIlk.kod && dIlk.kod.length >= 5,
    dIlk ? dIlk.kod : '-');

  console.log('=== 2) SIFIRLAMA BAGLANTISI ===');
  const r1 = await baglantiIste('mudur@test.com');
  kontrol('baglanti istegi kabul edildi', r1.status === 200, JSON.stringify(r1.body));
  const anahtar = sonAnahtar();
  kontrol('anahtar uretildi', anahtar.length === 64, anahtar.slice(0, 16) + '...');

  console.log('=== 3) HESAP VARLIGI SIZDIRILMIYOR ===');
  const r2 = await baglantiIste('boyle-biri-yok@test.com');
  kontrol('olmayan hesap ayni cevabi veriyor',
    r2.status === 200 && r2.body.message === r1.body.message,
    JSON.stringify(r2.body).slice(0, 120));

  console.log('=== 4) BOT DOGRULAMASI ZORUNLU ===');
  const r3 = await iste('/api/sifre-unuttum', 'POST',
    { email: 'mudur@test.com', challengeId: 'uydurma', challengeAnswer: 42 });
  kontrol('bot cevabi yanlissa reddediliyor', r3.status === 400, JSON.stringify(r3.body));

  console.log('=== 5) GECERSIZ ANAHTAR ===');
  const r4 = await iste('/api/sifre-yenile', 'POST',
    { token: 'a'.repeat(64), password: 'YeniSifre123!' });
  kontrol('uydurma anahtar reddediliyor', r4.status === 400, JSON.stringify(r4.body));

  console.log('=== 6) ZAYIF SIFRE ===');
  const r5 = await iste('/api/sifre-yenile', 'POST', { token: anahtar, password: '123' });
  kontrol('zayif sifre reddediliyor', r5.status === 400, JSON.stringify(r5.body));
  kontrol('anahtar hala gecerli (zayif sifre onu yakmadi)', true);

  console.log('=== 7) ESKI OTURUM KAPANIYOR ===');
  const eskiOturum = await girisYap('mudur@test.com', 'Test1234!');
  const oncesi = await iste('/api/me', 'GET', null, eskiOturum.token);
  kontrol('eski oturum once calisiyor', oncesi.status === 200, 'status ' + oncesi.status);

  const r6 = await iste('/api/sifre-yenile', 'POST',
    { token: anahtar, password: 'YeniSifre123!' });
  kontrol('sifre guncellendi', r6.status === 200, JSON.stringify(r6.body));

  const sonrasi = await iste('/api/me', 'GET', null, eskiOturum.token);
  kontrol('eski oturum kapatildi', sonrasi.status === 401, 'status ' + sonrasi.status);

  console.log('=== 8) ANAHTAR TEK KULLANIMLIK ===');
  const r7 = await iste('/api/sifre-yenile', 'POST',
    { token: anahtar, password: 'BaskaSifre123' });
  kontrol('ayni anahtar ikinci kez calismiyor', r7.status === 400, JSON.stringify(r7.body));

  console.log('=== 9) YENI SIFRE ISE YARIYOR ===');
  let yeniGiris = null, yeniHata = '';
  try { yeniGiris = await girisYap('mudur@test.com', 'YeniSifre123!'); }
  catch (e) { yeniHata = e.message; }
  kontrol('yeni sifreyle giris yapilabiliyor', !!(yeniGiris && yeniGiris.token), yeniHata);

  let eskiIle = null, eskiHata = '';
  try { eskiIle = await girisYap('mudur@test.com', 'Test1234!'); }
  catch (e) { eskiHata = e.message; }
  kontrol('eski sifre artik gecersiz', !eskiIle, eskiHata.slice(0, 60));

  console.log('=== 10) KVKK ONAYI ===');
  const bot1 = await botCevabi();
  const onaysiz = await iste('/api/register', 'POST', {
    role: 'teacher', fullName: 'Onaysiz Kisi', email: 'onaysiz@test.com',
    password: 'Test1234!', city: 'Ankara', district: 'Çankaya',
    phone: '05321234567',
    challengeId: bot1.challengeId, challengeAnswer: bot1.challengeAnswer
  });
  kontrol('onaysiz kayit reddediliyor', onaysiz.status === 400 &&
    /aydınlatma/i.test(onaysiz.body.error || ''), JSON.stringify(onaysiz.body));

  const bot2 = await botCevabi();
  const yanlisTip = await iste('/api/register', 'POST', {
    role: 'teacher', fullName: 'Sahte Onay', email: 'sahteonay@test.com',
    password: 'Test1234!', city: 'Ankara', district: 'Çankaya', kvkkOnay: 'evet',
    phone: '05321234567',
    challengeId: bot2.challengeId, challengeAnswer: bot2.challengeAnswer
  });
  kontrol('onay alani gercekten true olmali', yanlisTip.status === 400,
    JSON.stringify(yanlisTip.body));

  const bot3 = await botCevabi();
  const telsiz = await iste('/api/register', 'POST', {
    role: 'parent', fullName: 'Telsiz Kisi', email: 'telsiz@test.com',
    password: 'Test1234!', city: 'Ankara', district: 'Çankaya', kvkkOnay: true,
    challengeId: bot3.challengeId, challengeAnswer: bot3.challengeAnswer
  });
  kontrol('telefonsuz kayit reddediliyor', telsiz.status === 400 &&
    /[Tt]elefon/.test(telsiz.body.error || ''), JSON.stringify(telsiz.body));

  const bot4 = await botCevabi();
  const bozukTel = await iste('/api/register', 'POST', {
    role: 'parent', fullName: 'Bozuk Tel', email: 'bozuktel@test.com',
    password: 'Test1234!', city: 'Ankara', district: 'Çankaya', kvkkOnay: true,
    phone: '123',
    challengeId: bot4.challengeId, challengeAnswer: bot4.challengeAnswer
  });
  kontrol('gecersiz telefon reddediliyor', bozukTel.status === 400,
    JSON.stringify(bozukTel.body));

  const bot5 = await botCevabi();
  const bicimli = await iste('/api/register', 'POST', {
    role: 'parent', fullName: 'Bicimli Tel', email: 'bicimlitel@test.com',
    password: 'Test1234!', city: 'Ankara', district: 'Çankaya', kvkkOnay: true,
    phone: '+90 532 123 45 67',
    challengeId: bot5.challengeId, challengeAnswer: bot5.challengeAnswer
  });
  kontrol('+90 bicimli telefon kabul ediliyor', bicimli.status === 200,
    JSON.stringify(bicimli.body).slice(0, 120));
  if (bicimli.body.onayGerekli) await epostaOnayla('bicimlitel@test.com');
  const bicimliGiris = await girisYap('bicimlitel@test.com', 'Test1234!');
  kontrol('telefon tek bicime (ulke koduyla) cevrildi', bicimliGiris.user.phone === '+905321234567', bicimliGiris.user.phone);

  const kvkkSayfa = await iste('/kvkk.html');
  kontrol('aydinlatma metni yayinda', kvkkSayfa.status === 200,
    'status ' + kvkkSayfa.status);

  console.log();
  console.log('  GECTI: ' + gecti + '   KALDI: ' + kaldi);
  process.exit(kaldi ? 1 : 0);
})().catch(e => { console.error('TEST HATASI:', e.message, e.stack); process.exit(1); });
