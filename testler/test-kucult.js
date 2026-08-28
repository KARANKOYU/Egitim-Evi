/* Yorum atıcı (sunucusuz):
   - dizgi ve düzenli ifade içindeki // ve /* işaretlerine dokunmuyor;
   - yorum silinince kod aynı sonucu veriyor;
   - gerçek arayüz paketi yorumsuz hâliyle derleniyor (yorumlu hâle düşmüyor). */
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { jsYorumSil, cssYorumSil, kucultKontrollu } = require(path.join(__dirname, '..', 'sunucu', 'yardimci', 'kucult.js'));

let gecti = 0, kaldi = 0;
function kontrol(ad, sart, detay) {
  if (sart) { gecti++; console.log('  GECTI  ' + ad); }
  else { kaldi++; console.log('  KALDI  ' + ad + (detay ? '  -> ' + detay : '')); }
}

console.log();
console.log('  GECTI: ' + gecti + '   KALDI: ' + kaldi);
process.exit(kaldi ? 1 : 0);
