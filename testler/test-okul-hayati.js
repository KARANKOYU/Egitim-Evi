/* Yemek listesi, servis, kulüpler:
   - okuldaki herkes yemek listesini görür, yalnızca yetkili düzenler;
   - servis bilgisi (şoför telefonu) yalnızca o servisteki öğrenciye, velisine
     ve yönetime gider; başka okul servisine öğrenci yazılamaz;
   - kulüp kontenjanı aynı anda gelen isteklerde de aşılmaz; başvuru kapalıyken
     öğrenci katılamaz/ayrılamaz; üye listesini yalnızca yönetim ve danışman görür;
   - özel rol yetkileri (yemek.yonet, kulup.yonet) öğretmene bu işleri açar. */
const { iste, girisYap, hesapAc, mudurYap } = require('./giris');

let gecti = 0, kaldi = 0;
function kontrol(ad, sart, detay) {
  if (sart) { gecti++; console.log('  GECTI  ' + ad); }
  else { kaldi++; console.log('  KALDI  ' + ad + (detay ? '  -> ' + detay : '')); }
}
const J = x => JSON.stringify(x).slice(0, 180);

/* Bu haftanın pazartesisi (sunucunun hesabıyla aynı). */
function pazartesi(n) {
  const d = new Date(new Date().toISOString().slice(0, 10) + 'T12:00:00Z');
  d.setUTCDate(d.getUTCDate() - (d.getUTCDay() + 6) % 7 + (n || 0));
  return d.toISOString().slice(0, 10);
}

