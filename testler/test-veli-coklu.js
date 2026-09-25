/* Veli bağları:
   - öğretmen/müdür aynı zamanda veli olabilir (çocuğunun verisini görür, rolü değişmez);
   - okul veliyi T.C. kimlik no ya da kullanıcı adıyla öğrenciye bağlar, kaldırır;
   - rolsüz hesap bağlanınca veli olur; öğrenci hesabı veli yapılamaz;
   - arama sonucunda velinin tam adı değil baş harfleri görünür;
   - başka okulun müdürü bizim öğrencimize veli bağlayamaz. */
const { iste, girisYap, hesapAc, mudurYap, okulHesabi } = require('./giris');
const { kisilikGec } = require('./giris');

let gecti = 0, kaldi = 0;
function kontrol(ad, sart, detay) {
  if (sart) { gecti++; console.log('  GECTI  ' + ad); }
  else { kaldi++; console.log('  KALDI  ' + ad + (detay ? '  -> ' + detay : '')); }
}
const J = x => JSON.stringify(x).slice(0, 160);

