/* Sifremi unuttum akisi testleri. */
const fs = require('fs');
const { iste, girisYap, botCevabi, epostaOnayla } = require('./giris');

const LOG = process.env.EE_LOG;
let gecti = 0, kaldi = 0;
function kontrol(ad, sart, detay) {
  if (sart) { gecti++; console.log('  GECTI  ' + ad); }
  else { kaldi++; console.log('  KALDI  ' + ad + (detay ? '  -> ' + detay : '')); }
}

