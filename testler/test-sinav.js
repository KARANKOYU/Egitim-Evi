/* Sınavlar: şablonlar, grupsuz sınav, ondalıklı (virgüllü) değer, aralık
   denetimi, "+ yeni değer ekle", grafik verisi, grup ortalaması.
   Ödevin açılma zamanı ve "geç yaptı" sonucu da burada. */
const { iste, girisYap } = require('./giris');

let gecti = 0, kaldi = 0;
function kontrol(ad, sart, detay) {
  if (sart) { gecti++; console.log('  GECTI  ' + ad); }
  else { kaldi++; console.log('  KALDI  ' + ad + (detay ? '  -> ' + detay : '')); }
}
const kisa = v => JSON.stringify(v).slice(0, 160);

