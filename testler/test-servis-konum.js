/* Servisçi, canlı konum, yaklaşma bildirimi ve telefon bildirimi aboneliği:
   - servisçi hesabını okul açar; yalnızca kendi okulunun servisine atanır;
   - aracın konumunu yalnızca o servisteki öğrenci, velisi, servisçisi ve
     yönetim görür; başka okulun servisçisi, başka öğrencinin velisi görmez;
   - servisçi ev konumunu görür ama değiştiremez; öğrenci listesinde T.C.,
     telefon gibi bilgi gelmez;
   - konumu yalnızca seferin servisçisi, yalnızca açık seferde yazar;
     servis başka servisçiye verilince eskisinin seferi kapanır;
   - eve 500 m ve 100 m kala öğrenciye ve velisine birer kez bildirim gider;
     GPS doğruluğu kötüyse gitmez;
   - telefon bildirimi aboneliği yalnızca bilinen push servislerinden kabul
     edilir, cihaz başka hesaba geçince eskisinden düşer, kişi başı 5 cihaz. */
const crypto = require('crypto');
const { iste, girisYap, hesapAc, okulHesabi, mudurYap } = require('./giris');

let gecti = 0, kaldi = 0;
function kontrol(ad, sart, detay) {
  if (sart) { gecti++; console.log('  GECTI  ' + ad); }
  else { kaldi++; console.log('  KALDI  ' + ad + (detay ? '  -> ' + detay : '')); }
}
const J = x => JSON.stringify(x).slice(0, 220);

/* Okuldan kuzeye m metre (enlemde 1 derece ~ 111 km). */
const EV = { enlem: 36.9, boylam: 30.7 };
const kuzey = m => ({ enlem: Math.round((EV.enlem + m / 111195) * 1e6) / 1e6, boylam: EV.boylam });

async function bildirimler(token) {
  const r = await iste('/api/notifications', 'GET', null, token);
  return (r.body.notifications || []).map(n => n.text || n.metin || '');
}

