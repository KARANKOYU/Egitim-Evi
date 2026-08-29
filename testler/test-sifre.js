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

