/* Yetişkin hesabı ve okul rolleri:
   - yetişkin hesabı kaydolur; e-postaya kod (iki adımlı giriş) öğrenci dışında herkese zorunlu;
   - okul başvurusu "müdür" rol satırı açar, yönetici onaylayana kadar girilemez;
   - öğretmen eşleme kodunu verir, müdür kodu girince öğretmen rolü açılır; kod tek kullanımlık;
   - tek rolde doğrudan girilir, birden çok seçenekte seçim ekranı; başkasının rolüne geçilemez;
   - bir kişi iki okulda rol alabilir (A'da öğretmen, B'de müdür) ve veli olabilir;
   - öğretmen okuldan ayrılabilir, müdür çıkarabilir; onaylı müdür rolü bırakılamaz;
   - şifre, kişisel bilgi, telefon bildirimi aboneliği yetişkin hesabınındır;
   - hesabı silme (KVKK) şifreyle; müdürken silinemez. */
const crypto = require('crypto');
const { iste, girisYap, hesapAc, mudurYap, kisilikGec, okulHesabi, tcUret, botCevabi } = require('./giris');

let gecti = 0, kaldi = 0;
function kontrol(ad, sart, detay) {
  if (sart) { gecti++; console.log('  GECTI  ' + ad); }
  else { kaldi++; console.log('  KALDI  ' + ad + (detay ? '  -> ' + detay : '')); }
}
const J = x => JSON.stringify(x).slice(0, 240);

/* Girişin ilk adımı (kod istenip istenmediğini görmek için). */
async function ilkAdim(kimlik, sifre, okul) {
  const bot = await botCevabi();
  return iste('/api/login', 'POST', { kimlik, password: sifre, okul, challengeId: bot.challengeId, challengeAnswer: bot.challengeAnswer });
}

