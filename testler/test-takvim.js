/* Takvim testleri. */
const { iste, epostaOnayla, girisYap, botCevabi } = require('./giris');

let gecti = 0, kaldi = 0;
function kontrol(ad, sart, detay) {
  if (sart) { gecti++; console.log('  GECTI  ' + ad); }
  else { kaldi++; console.log('  KALDI  ' + ad + (detay ? '  -> ' + detay : '')); }
}
/* Kayıt olur ve e-postadaki onay bağlantısına tıklar (hesap ancak o zaman açılır). */
async function kayit(govde) {
  const bot = await botCevabi();
  const r = await iste('/api/register', 'POST',
    Object.assign({ kvkkOnay: true, phone: '05321234567' }, govde,
      { challengeId: bot.challengeId, challengeAnswer: bot.challengeAnswer }));
  if (r.status === 200 && r.body.onayGerekli) await epostaOnayla(govde.email);
  return r;
}
const iki = n => (n < 10 ? '0' : '') + n;

