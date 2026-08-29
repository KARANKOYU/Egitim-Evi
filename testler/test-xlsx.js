/* xlsx modulu icin bagimsiz testler: yaz -> oku turu, ozel karakterler,
   cok sayfa, buyuk liste, bozuk dosya. */
const fs = require('fs');
const path = require('path');
const xlsx = require(path.join(__dirname, '..', 'sunucu', 'yardimci', 'xlsx.js'));

const CIKTI = __dirname;
let gecti = 0, kaldi = 0;
function kontrol(ad, sart, detay) {
  if (sart) { gecti++; console.log('  GECTI  ' + ad); }
  else { kaldi++; console.log('  KALDI  ' + ad + (detay ? '  -> ' + detay : '')); }
}

console.log('=== 1) TEMEL YAZ/OKU TURU ===');
const basliklar = ['Ad Soyad', 'E-posta', 'Sinif', 'Giris Kodu', 'Puan'];
const satirlar = [
  ['Ayşe Yılmaz', 'ayse@okul.com', '9-A', 'Kd7#mZ2p', 85],
  ['Mehmet Öztürk', 'mehmet@okul.com', '9-A', 'Xq3!vB8n', 92],
  ['Zeynep Çağlar', 'zeynep@okul.com', '10-B', 'Rt5&wY1k', 78]
];
const buf = xlsx.yaz([{ ad: 'Öğrenciler', basliklar: basliklar, satirlar: satirlar,
  genislikler: [24, 28, 10, 14, 8] }]);
fs.writeFileSync(path.join(CIKTI, 'deneme.xlsx'), buf);
kontrol('dosya uretildi', buf.length > 500, buf.length + ' bayt');
kontrol('zip imzasi dogru', buf[0] === 0x50 && buf[1] === 0x4B,
  buf.slice(0, 2).toString('hex'));

const geri = xlsx.oku(buf);
kontrol('tek sayfa okundu', geri.length === 1, 'adet ' + geri.length);
kontrol('sayfa adi korundu', geri[0].ad === 'Öğrenciler', geri[0].ad);
kontrol('satir sayisi dogru', geri[0].satirlar.length === 4,
  'satir ' + geri[0].satirlar.length);
kontrol('basliklar korundu', geri[0].satirlar[0].join('|') === basliklar.join('|'),
  geri[0].satirlar[0].join('|'));
kontrol('turkce karakterler bozulmadi', geri[0].satirlar[1][0] === 'Ayşe Yılmaz',
  geri[0].satirlar[1][0]);
kontrol('ozel isaretli sifre korundu', geri[0].satirlar[1][3] === 'Kd7#mZ2p',
  geri[0].satirlar[1][3]);
kontrol('sayi hucresi okundu', geri[0].satirlar[1][4] === '85',
  geri[0].satirlar[1][4]);

console.log('=== 2) XML KACIS KARAKTERLERI ===');
const zorlu = [
  ['A & B <okul>', 'tirnak "cift" ve \'tek\'', 'satir\nsonu'],
  ['%100 & <script>alert(1)</script>', 'sonda bosluk   ', '   basta bosluk']
];
const b2 = xlsx.yaz([{ ad: 'Zor', basliklar: ['Bir', 'Iki', 'Uc'], satirlar: zorlu }]);
const g2 = xlsx.oku(b2)[0].satirlar;
kontrol('ampersan ve kucuktur korundu', g2[1][0] === 'A & B <okul>', g2[1][0]);
kontrol('tirnaklar korundu', g2[1][1] === 'tirnak "cift" ve \'tek\'', g2[1][1]);
kontrol('script metni kacisli', g2[2][0] === '%100 & <script>alert(1)</script>', g2[2][0]);
kontrol('sondaki bosluk korundu', g2[2][1] === 'sonda bosluk   ',
  JSON.stringify(g2[2][1]));
kontrol('bastaki bosluk korundu', g2[2][2] === '   basta bosluk',
  JSON.stringify(g2[2][2]));

console.log('=== 3) COK SAYFA ===');
const b3 = xlsx.yaz([
  { ad: 'Liste', basliklar: ['A'], satirlar: [['x']] },
  { ad: 'Nasil doldurulur', duz: true, satirlar: [['Bu sayfa aciklama icindir.'], ['Ikinci satir.']] }
]);
const g3 = xlsx.oku(b3);
kontrol('iki sayfa yazildi', g3.length === 2, 'adet ' + g3.length);
kontrol('birinci sayfa adi', g3[0].ad === 'Liste', g3[0].ad);
kontrol('ikinci sayfa adi', g3[1].ad === 'Nasil doldurulur', g3[1].ad);
kontrol('ikinci sayfa icerigi', g3[1].satirlar[0][0] === 'Bu sayfa aciklama icindir.',
  g3[1].satirlar[0][0]);

console.log('=== 4) BOS HUCRELER ===');
const b4 = xlsx.yaz([{ ad: 'Bosluk', basliklar: ['A', 'B', 'C'],
  satirlar: [['dolu', '', 'dolu'], ['', '', ''], ['son', 'son', '']] }]);
const g4 = xlsx.oku(b4)[0].satirlar;
kontrol('bos hucre bos string dondu', g4[1][1] === '', JSON.stringify(g4[1][1]));
kontrol('bos hucreden sonraki dolu', g4[1][2] === 'dolu', g4[1][2]);
kontrol('tamamen bos satir atlanmadi', g4.length === 4, 'satir ' + g4.length);

console.log('=== 5) BUYUK LISTE (500 ogrenci) ===');
const buyuk = [];
for (let i = 0; i < 500; i++) {
  buyuk.push(['Öğrenci ' + i, 'ogr' + i + '@okul.com', (9 + (i % 4)) + '-' +
    'ABCD'[i % 4], 'Kod' + i]);
}
const t0 = Date.now();
const b5 = xlsx.yaz([{ ad: 'Buyuk', basliklar: ['Ad', 'Eposta', 'Sinif', 'Kod'],
  satirlar: buyuk }]);
const yazSure = Date.now() - t0;
const t1 = Date.now();
const g5 = xlsx.oku(b5)[0].satirlar;
const okuSure = Date.now() - t1;
kontrol('500 satir yazildi ve okundu', g5.length === 501, 'satir ' + g5.length);
kontrol('son satir dogru', g5[500][0] === 'Öğrenci 499', g5[500][0]);
kontrol('makul boyut (<200 KB)', b5.length < 200 * 1024,
  Math.round(b5.length / 1024) + ' KB');
kontrol('hizli (<1 sn)', yazSure + okuSure < 1000,
  'yaz ' + yazSure + 'ms oku ' + okuSure + 'ms');

console.log('=== 6) BOZUK DOSYA ===');
let hataMesaji = '';
try { xlsx.oku(Buffer.from('bu bir excel dosyasi degil, duz metin')); }
catch (e) { hataMesaji = e.message; }
kontrol('bozuk dosya anlasilir hata veriyor',
  hataMesaji.indexOf('Excel') >= 0, hataMesaji);

let hata2 = '';
try { xlsx.oku(Buffer.alloc(0)); } catch (e) { hata2 = e.message; }
kontrol('bos dosya cokertmiyor', hata2.length > 0, hata2);

