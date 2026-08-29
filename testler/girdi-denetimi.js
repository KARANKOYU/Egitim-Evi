/* Girdi denetimi: bozuk, asiri ve kotu niyetli veriyle sunucu cokuyor mu,
   sizdiriyor mu, 500 doneriyor mu. */
const { iste, girisYap, hesapAc, mudurYap } = require('./giris');

let gecti = 0, kaldi = 0;
function kontrol(ad, sart, detay) {
  if (sart) { gecti++; console.log('  GECTI  ' + ad); }
  else { kaldi++; console.log('  KALDI  ' + ad + (detay ? '  -> ' + detay : '')); }
}

/* 500 asla gorunmemeli: sunucu hatasi demektir. */
function sunucuHatasiYok(ad, c) {
  kontrol(ad + ' 500 dondurmuyor', c.status !== 500,
    'status ' + c.status + ' ' + JSON.stringify(c.body).slice(0, 90));
}

const KOTU = [
  '', '   ', null, undefined, 0, -1, 999999999999,
  'a'.repeat(50000),
  '<script>alert(1)</script>',
  '"><img src=x onerror=alert(1)>',
  "'; DROP TABLE users; --",
  '../../../etc/passwd',
  '..\\..\\..\\windows\\system32',
  '\u0000bos',
  '{{7*7}}',
  '${process.env}',
  'ÇÖĞÜŞİıĞÜÖÇ',
  '🎓📚🏫',
  true, false, [], {}, [1, 2, 3], { a: 1 }
];

