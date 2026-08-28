/* Toplu giriş bilgisi dağıtımı:
   - şifreleri sunucu üretir, yalnızca özetini saklar; liste bir kez döner;
   - varsayılan olarak yalnızca henüz giriş yapmamış öğrenciler seçilir;
   - eski şifre ve açık oturumlar geçersiz olur, öğrenciye bildirim gider;
   - yetkisiz öğretmen ve başka okulun sınıfı reddedilir. */
const { iste, girisYap, hesapAc, mudurYap, tcUret } = require('./giris');

let gecti = 0, kaldi = 0;
function kontrol(ad, sart, detay) {
  if (sart) { gecti++; console.log('  GECTI  ' + ad); }
  else { kaldi++; console.log('  KALDI  ' + ad + (detay ? '  -> ' + detay : '')); }
}
const J = x => JSON.stringify(x).slice(0, 160);

