/* Okulun açtığı hesaplar ve hesap modeli:
   - öğrenci, öğretmen ve servisçi hesabını okul açar; ad, soyad, T.C. zorunlu;
   - kullanıcı adı ve şifre boşsa T.C. no; o kişi kendi şifresini koymadan
     hiçbir bölüme giremez (şifresi T.C. no'yu içeremez);
   - kullanıcı adı okul içinde benzersiz: başka okulda aynısı olabilir, okul
     seçilmeden girilirse okul sorulur, okul adresinden girilince doğru hesap açılır;
   - öğretmen/servisçi hesabı düzenlenir, şifresi yenilenir, silinir;
   - yetkisiz öğretmen hesap açamaz, başka okulun hesabına dokunamaz;
   - rolsüz kayıt yalnızca veli / müdür adayı içindir; eski davet uçları yok. */
const { iste, girisYap, botCevabi, hesapAc, mudurYap, ogretmenYap, tcUret } = require('./giris');

let gecti = 0, kaldi = 0;
function kontrol(ad, sart, detay) {
  if (sart) { gecti++; console.log('  GECTI  ' + ad); }
  else { kaldi++; console.log('  KALDI  ' + ad + (detay ? '  -> ' + detay : '')); }
}
const J = x => JSON.stringify(x).slice(0, 160);

async function hamGiris(kimlik, sifre, okul) {
  const b = await botCevabi();
  return iste('/api/login', 'POST', { kimlik, password: sifre, okul, challengeId: b.challengeId, challengeAnswer: b.challengeAnswer });
}

