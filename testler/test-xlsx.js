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

console.log('=== 8) ESKI EXCEL (.xls, Excel 97-2003) ===');
{
  const { tabloOku } = require(path.join(__dirname, '..', 'sunucu', 'yardimci', 'tablo-oku.js'));
  const { tarihCoz } = require(path.join(__dirname, '..', 'sunucu', 'ortak.js'));
  /* ornek-eski-liste.xls: LibreOffice ile kaydedilmiş sentetik liste. 900 farklı
     metin, ortak metin tablosunun (SST) kayıt sınırını aşar (CONTINUE). */
  const liste = fs.readFileSync(path.join(__dirname, 'ornek-eski-liste.xls'));
  const s = tabloOku(liste, 'ornek-eski-liste.xls');
  kontrol('iki sayfa, adlari Turkce harfli', s.length === 2 && s[0].ad === 'Öğrenciler' && s[1].ad === 'Servisçiler',
    s.map(x => x.ad).join(','));
  kontrol('451 satir (baslik + 450)', s[0].satirlar.length === 451, String(s[0].satirlar.length));
  const ad = ['Ayşe', 'Mehmet', 'Çağla', 'Ömer', 'Şule', 'İpek', 'Can', 'Deniz', 'Ece', 'Gökhan'];
  const soy = ['Yıldız', 'Kaya', 'Öztürk', 'Şahin', 'Çelik', 'Doğan', 'Arslan', 'Koç', 'Aydın', 'Güneş'];
  let yanlis = 0, ilkYanlis = '';
  for (let i = 0; i < 450; i++) {
    const bek = [ad[i % 10], soy[(i * 7) % 10] + 'oğlu' + i, String(10000000000 + i * 7919), String(1 + i % 12), i % 2 ? 'Çiçek' : 'A'];
    if (JSON.stringify(s[0].satirlar[i + 1]) !== JSON.stringify(bek)) { yanlis++; if (!ilkYanlis) ilkYanlis = i + ': ' + JSON.stringify(s[0].satirlar[i + 1]); }
  }
  kontrol('butun hucreler dogru (kayit sinirini asan metinler dahil)', yanlis === 0, yanlis + ' yanlis; ' + ilkYanlis);
  kontrol('uzantisiz da taniniyor (dosya imzasindan)', tabloOku(liste, 'liste')[0].satirlar.length === 451);

  /* ornek-eski-sayilar.xls: kucuk dosya (mini akis), sayi, ondalik, eksi, tarih. */
  const sy = tabloOku(fs.readFileSync(path.join(__dirname, 'ornek-eski-sayilar.xls')), 'x.xls')[0].satirlar;
  kontrol('sayi hucreleri: T.C., ondalik, eksi', sy[1][2] === '12345678950' && sy[1][5] === '3.5' && sy[1][6] === '-7' &&
    sy[2][6] === '-0.25', JSON.stringify(sy[1]) + JSON.stringify(sy[2]));
  kontrol('tarih hucresi gun sayisindan cozuluyor', tarihCoz(sy[1][3]) === '2012-05-12' && tarihCoz(sy[2][3]) === '2013-09-01',
    sy[1][3] + ' ' + sy[2][3]);

  /* Bozuk dosyalar hata verir, cokertmez ya da donguye girmez. */
  const hataVerir = b => { try { tabloOku(b, 'x.xls'); return false; } catch (e) { return !!e.message; } };
  kontrol('kesilmis dosya hata veriyor', hataVerir(liste.subarray(0, 3000)));
  const donguEdi = Buffer.from(liste);
  /* Dizin zinciri kendine döner: dizinin ilk sektörünün FAT girişi kendisini gösterir.
     FAT sektörü başına 128 giriş (512 baytlık sektörde); hangi FAT sektörü olduğu başlıktaki listeden. */
  const dizinIlk = donguEdi.readUInt32LE(0x30);
  const fatSektoru = donguEdi.readUInt32LE(0x4C + Math.floor(dizinIlk / 128) * 4);
  donguEdi.writeUInt32LE(dizinIlk, (fatSektoru + 1) * 512 + (dizinIlk % 128) * 4);
  kontrol('dongulu sektor zinciri hata veriyor', hataVerir(donguEdi));
  const disari = Buffer.from(liste);
  disari.writeUInt32LE(0x7FFFFFF0, 0x30);
  kontrol('dosya disini gosteren sektor hata veriyor', hataVerir(disari));
  const sahte = Buffer.concat([liste.subarray(0, 8), Buffer.alloc(600, 0xAB)]);
  kontrol('imzasi dogru ama ici bozuk dosya hata veriyor', hataVerir(sahte));
}

console.log('=== 6b) KUCUK DOSYA, DEV TABLO (bellek bombasi) ===');
{
  /* Tek hucresi en uzak koseye yazilmis kucuk bir .xlsx: eskiden milyarlarca bos
     hucreyi bellege acmaya calisip sureci dusururdu. Simdi sinir disi hucre atlanir. */
  const sayfa = '<?xml version="1.0"?><worksheet><sheetData><row r="1"><c r="A1" t="str"><v>Ad</v></c></row>' +
    '<row r="1048576"><c r="XFD1048576" t="str"><v>x</v></c></row></sheetData></worksheet>';
  const bomba = xlsx.zipYaz([
    { ad: 'xl/workbook.xml', veri: Buffer.from('<workbook><sheets><sheet name="S" r:id="rId1"/></sheets></workbook>') },
    { ad: 'xl/_rels/workbook.xml.rels', veri: Buffer.from('<Relationships><Relationship Id="rId1" Target="worksheets/sheet1.xml"/></Relationships>') },
    { ad: 'xl/worksheets/sheet1.xml', veri: Buffer.from(sayfa) }
  ]);
  const bas = Date.now();
  let sonuc = null, hataMesaji = '';
  try { sonuc = xlsx.oku(bomba); } catch (e) { hataMesaji = e.message; }
  kontrol('uzak hucreli kucuk dosya bellegi sismirmiyor', (sonuc && sonuc[0].satirlar.length === 1) || !!hataMesaji,
    hataMesaji || (sonuc && sonuc[0].satirlar.length));
  kontrol('ve hizli bitiyor', Date.now() - bas < 3000, (Date.now() - bas) + ' ms');
}

console.log('=== 7) SUTUN ADI CEVRIMI ===');
kontrol('A = 0', xlsx.sutunAd(0) === 'A', xlsx.sutunAd(0));
kontrol('Z = 25', xlsx.sutunAd(25) === 'Z', xlsx.sutunAd(25));
kontrol('AA = 26', xlsx.sutunAd(26) === 'AA', xlsx.sutunAd(26));
kontrol('AB = 27', xlsx.sutunAd(27) === 'AB', xlsx.sutunAd(27));
kontrol('geri cevrim tutarli', xlsx.sutunNo('AB') === 27, String(xlsx.sutunNo('AB')));

console.log();
console.log('  GECTI: ' + gecti + '   KALDI: ' + kaldi);
console.log('  Ornek dosya: ' + path.join(CIKTI, 'deneme.xlsx'));
process.exit(kaldi ? 1 : 0);
