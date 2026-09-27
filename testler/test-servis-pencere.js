/* Servis saat aralıkları (sunucusuz): Türkiye saati, bitiş dakikası dahil,
   60 dakikalık uzatma, sonraki aralık, gece yarısı, doğrulama kuralları,
   seferin sürüp sürmediği, birden çok okulun zarfı, saat eki ("07:42'de"),
   bildirimdeki ad. Sunucunun kendi saat dilimi sonucu değiştirmez. */
const p = require('../sunucu/yardimci/servis-pencere');

let gecti = 0, kaldi = 0;
function kontrol(ad, sart, detay) {
  if (sart) { gecti++; console.log('  GECTI  ' + ad); }
  else { kaldi++; console.log('  KALDI  ' + ad + (detay ? '  -> ' + detay : '')); }
}
const J = x => JSON.stringify(x);
const TR = s => Date.parse(s + '+03:00');   // "2026-09-28T08:30:00" Türkiye saatiyle
const OKUL = { servisSaatleri: { sabahBas: '07:00', sabahBit: '09:20', aksamBas: '16:30', aksamBit: '19:00' } };
const GENIS = { sabahBas: '00:00', sabahBit: '11:59', aksamBas: '12:00', aksamBit: '23:59' };
const pen = (okul, s) => p.servisPenceresi(okul, TR(s));

console.log('=== DOĞRULAMA ===');
kontrol('varsayılan aralıklar geçerli', p.saatlerSorunu(p.VARSAYILAN) === null);
kontrol('test aralıkları (00:00-11:59 / 12:00-23:59) geçerli', p.saatlerSorunu(GENIS) === null);
kontrol('sabah bitişi akşam başı olabilir', p.saatlerSorunu({ sabahBas: '07:00', sabahBit: '12:00', aksamBas: '12:00', aksamBit: '19:00' }) === null);
const kotu = [
  { sabahBas: '7:00', sabahBit: '09:20', aksamBas: '16:30', aksamBit: '19:00' },
  { sabahBas: '24:00', sabahBit: '09:20', aksamBas: '16:30', aksamBit: '19:00' },
  { sabahBas: '07:00', sabahBit: '09:60', aksamBas: '16:30', aksamBit: '19:00' },
  { sabahBas: '09:20', sabahBit: '07:00', aksamBas: '16:30', aksamBit: '19:00' },
  { sabahBas: '07:00', sabahBit: '09:20', aksamBas: '19:00', aksamBit: '19:00' },
  { sabahBas: '07:00', sabahBit: '07:29', aksamBas: '16:30', aksamBit: '19:00' },
  { sabahBas: '07:00', sabahBit: '09:20', aksamBas: '16:30', aksamBit: '16:59' },
  { sabahBas: '07:00', sabahBit: '17:00', aksamBas: '16:30', aksamBit: '19:00' },
  { sabahBas: '07:00', sabahBit: '09:20', aksamBas: '16:30' },
  null, 'x'
];
kontrol('biçim, ters aralık, 30 dakikadan kısa, çakışan ve eksik aralık reddediliyor', kotu.every(s => typeof p.saatlerSorunu(s) === 'string'),
  kotu.map(s => p.saatlerSorunu(s)).join(' | '));
kontrol('30 dakikalık aralık kabul', p.saatlerSorunu({ sabahBas: '07:00', sabahBit: '07:30', aksamBas: '16:30', aksamBit: '17:00' }) === null);
kontrol('bozuk ya da eksik okul saatinde varsayılan kullanılır', J(p.saatleri(null)) === J(p.VARSAYILAN) &&
  J(p.saatleri({ servisSaatleri: { sabahBas: 'x' } })) === J(p.VARSAYILAN) && J(p.saatleri(OKUL)) === J(OKUL.servisSaatleri) &&
  J(p.saatleri(GENIS)) === J(GENIS));
kontrol('aralık metni', p.aralikMetni(OKUL.servisSaatleri) === 'sabah 07:00–09:20 ve akşam 16:30–19:00', p.aralikMetni(OKUL.servisSaatleri));

console.log('=== HANGİ DÖNEM ===');
let w = pen(OKUL, '2026-09-28T07:00:00');
kontrol('07:00 sabah (aralığın başı dahil)', w.donem === 'sabah' && w.bas === '07:00' && w.bit === '09:20' && w.tarih === '2026-09-28', J(w));
kontrol('07:00 Türkiye = 04:00 UTC (sunucunun saat diliminden bağımsız)', p.servisPenceresi(OKUL, Date.parse('2026-09-28T04:00:00Z')).donem === 'sabah');
kontrol('07:00 sabahında sonraki aralık akşam 16:30', w.sonraki && w.sonraki.donem === 'aksam' && w.sonraki.bas === '16:30' &&
  w.sonraki.tarih === '2026-09-28', J(w.sonraki));
w = pen(OKUL, '2026-09-28T09:20:59');
kontrol('09:20:59 hâlâ sabah (bitiş dakikası dahil)', w.donem === 'sabah', J(w));
w = pen(OKUL, '2026-09-28T09:21:00');
kontrol('09:21 aralık dışı, sabah uzatmasında', w.donem === null && w.bas === null && w.uzatma && w.uzatma.donem === 'sabah' &&
  w.uzatma.tarih === '2026-09-28' && w.uzatma.bit === '09:20', J(w));
kontrol('10:20:59 uzatma sürüyor, 10:21 bitti', !!pen(OKUL, '2026-09-28T10:20:59').uzatma && pen(OKUL, '2026-09-28T10:21:00').uzatma === null);
w = pen(OKUL, '2026-09-28T06:59:00');
kontrol('06:59 aralık dışı, uzatma yok, sonraki bugün sabah', w.donem === null && w.uzatma === null && w.sonraki.donem === 'sabah' &&
  w.sonraki.tarih === '2026-09-28', J(w));
w = pen(OKUL, '2026-09-28T17:00:00');
kontrol('17:00 akşam, sonraki yarın sabah', w.donem === 'aksam' && w.bas === '16:30' && w.sonraki.donem === 'sabah' &&
  w.sonraki.tarih === '2026-09-29', J(w));
w = pen(OKUL, '2026-09-28T19:30:00');
kontrol('19:30 akşam uzatmasında', w.donem === null && w.uzatma && w.uzatma.donem === 'aksam', J(w));
w = pen(OKUL, '2026-09-28T23:30:00');
kontrol('23:30 aralık dışı, sonraki yarın 07:00', w.donem === null && w.uzatma === null && w.sonraki.tarih === '2026-09-29' &&
  w.sonraki.bas === '07:00', J(w));

console.log('=== TEST ARALIKLARI VE GECE YARISI ===');
let bos = 0;
for (let dk = 0; dk < 1440; dk += 7) {
  const s = '2026-09-28T' + String(Math.floor(dk / 60)).padStart(2, '0') + ':' + String(dk % 60).padStart(2, '0') + ':30';
  if (!pen(GENIS, s).donem) bos++;
}
kontrol('00:00-11:59 / 12:00-23:59 ile günün her dakikası bir dönemde', bos === 0 && pen(GENIS, '2026-09-28T11:59:59').donem === 'sabah' &&
  pen(GENIS, '2026-09-28T12:00:00').donem === 'aksam' && pen(GENIS, '2026-09-28T23:59:59').donem === 'aksam', String(bos));
w = pen(GENIS, '2026-09-29T00:20:00');
kontrol('gece 00:20: yeni günün sabahı; dünün akşamı uzatmada', w.donem === 'sabah' && w.tarih === '2026-09-29' && w.uzatma &&
  w.uzatma.donem === 'aksam' && w.uzatma.tarih === '2026-09-28', J(w));

console.log('=== SEFER SÜRÜYOR MU ===');
const sabahSeferi = { yon: 'gidis', baslangic: new Date(TR('2026-09-28T08:00:00')).toISOString() };
const aksamSeferi = { yon: 'donus', baslangic: new Date(TR('2026-09-28T18:50:00')).toISOString() };
kontrol('sabah seferi aralıkta ve 60 dakikalık uzatmada sürüyor', p.seferSuruyorMu(OKUL, sabahSeferi, TR('2026-09-28T09:00:00')) &&
  p.seferSuruyorMu(OKUL, sabahSeferi, TR('2026-09-28T10:20:00')));
kontrol('sabah seferi 10:21\'de kapanır', !p.seferSuruyorMu(OKUL, sabahSeferi, TR('2026-09-28T10:21:00')));
kontrol('akşam seferi 19:59\'da sürüyor, 20:01\'de kapanır', p.seferSuruyorMu(OKUL, aksamSeferi, TR('2026-09-28T19:59:00')) &&
  !p.seferSuruyorMu(OKUL, aksamSeferi, TR('2026-09-28T20:01:00')));
kontrol('dünkü sefer bugün sürmez', !p.seferSuruyorMu(OKUL, sabahSeferi, TR('2026-09-29T08:00:00')));
kontrol('gece yarısını geçen uzatma (23:59 akşamı) sürüyor', p.seferSuruyorMu(GENIS, { yon: 'donus', baslangic: new Date(TR('2026-09-28T23:40:00')).toISOString() },
  TR('2026-09-29T00:30:00')));
kontrol('sefer yönü ve dönem', p.seferDonemi('gidis') === 'sabah' && p.seferDonemi('donus') === 'aksam' && p.donemYonu('sabah') === 'gidis' &&
  p.donemYonu('aksam') === 'donus');
kontrol('başlangıcı olmayan sefer sürmez', !p.seferSuruyorMu(OKUL, { yon: 'gidis' }, TR('2026-09-28T08:00:00')) && !p.seferSuruyorMu(OKUL, null));
/* Sefer yalnız o günün kendi aralığında başladıysa sürer: aralık sonradan
   değişirse ya da eski koddan kalan sefer aralık dışında açılmışsa kapanır. */
const disSefer = { yon: 'donus', baslangic: new Date(TR('2026-09-28T13:00:00')).toISOString() };
kontrol('akşam aralığından önce (13:00) açılmış dönüş seferi akşam aralığında da sürmez', !p.seferSuruyorMu(OKUL, disSefer, TR('2026-09-28T13:05:00')) &&
  !p.seferSuruyorMu(OKUL, disSefer, TR('2026-09-28T17:00:00')));
const erkenSefer = { yon: 'gidis', baslangic: new Date(TR('2026-09-28T04:05:00')).toISOString() };
const SONRA = { sabahBas: '20:00', sabahBit: '20:30', aksamBas: '21:00', aksamBit: '21:30' };
kontrol('aralık ileri alınınca (04:05\'te açılan sefer, yeni sabah 20:00-20:30) sefer sürmez', p.seferSuruyorMu(GENIS, erkenSefer, TR('2026-09-28T04:10:00')) &&
  !p.seferSuruyorMu(SONRA, erkenSefer, TR('2026-09-28T04:10:00')) && !p.seferSuruyorMu(SONRA, erkenSefer, TR('2026-09-28T20:10:00')));
const gecSefer = { yon: 'gidis', baslangic: new Date(TR('2026-09-28T09:25:00')).toISOString() };
kontrol('sabah aralığı bittikten sonra (09:25) açılmış sefer uzatmada sürmez', !p.seferSuruyorMu(OKUL, gecSefer, TR('2026-09-28T09:30:00')));
kontrol('aralığın ucunda veritabanı saati için 2 dakikalık pay (06:59 ve 09:21:30 sürer, 06:57 sürmez)',
  p.seferSuruyorMu(OKUL, { yon: 'gidis', baslangic: new Date(TR('2026-09-28T06:59:00')).toISOString() }, TR('2026-09-28T07:05:00')) &&
  p.seferSuruyorMu(OKUL, { yon: 'gidis', baslangic: new Date(TR('2026-09-28T09:21:30')).toISOString() }, TR('2026-09-28T09:40:00')) &&
  !p.seferSuruyorMu(OKUL, { yon: 'gidis', baslangic: new Date(TR('2026-09-28T06:57:00')).toISOString() }, TR('2026-09-28T07:05:00')));
kontrol('an aralık içinde mi (uzatmadaki işaret için "sefer başladı" anı)', p.aralikIcindeMi(OKUL, '2026-09-28', 'sabah', TR('2026-09-28T08:00:00')) &&
  !p.aralikIcindeMi(OKUL, '2026-09-28', 'sabah', TR('2026-09-28T09:40:00')) && !p.aralikIcindeMi(OKUL, '2026-09-28', 'aksam', TR('2026-09-28T08:00:00')) &&
  !p.aralikIcindeMi(OKUL, '2026-09-28', 'sabah', NaN));

console.log('=== ZARF, SAAT EKİ, AD ===');
const zarf = p.saatZarfi([OKUL, { servisSaatleri: { sabahBas: '06:45', sabahBit: '09:00', aksamBas: '17:00', aksamBit: '19:30' } }]);
kontrol('iki okulun aralıklarını kapsayan zarf', J(zarf) === J({ sabahBas: '06:45', sabahBit: '09:20', aksamBas: '16:30', aksamBit: '19:30' }), J(zarf));
kontrol('boş listede zarf yok', p.saatZarfi([]) === null);
kontrol('Türkiye saati (04:42 UTC = 07:42)', p.trSaat(Date.parse('2026-09-28T04:42:10Z')) === '07:42');
const ekler = { '07:42': "'de", '08:05': "'te", '16:40': "'ta", '17:10': "'da", '09:00': "'da", '12:00': "'de", '10:00': "'da", '20:00': "'de",
  '00:00': "'da", '07:30': "'da", '08:50': "'de", '08:03': "'te", '08:04': "'te", '08:06': "'da", '08:01': "'de", '23:00': "'te" };
const yanlis = Object.keys(ekler).filter(s => p.saatEki(s) !== ekler[s]);
kontrol('saat eki: 07:42\'de, 08:05\'te, 16:40\'ta, 17:10\'da ...', !yanlis.length, yanlis.map(s => s + p.saatEki(s)).join(' '));
kontrol('bildirimde soyadı atılır', p.ilkAd('Zeynep Şahin') === 'Zeynep' && p.ilkAd('Ali Rıza Kaya') === 'Ali Rıza' && p.ilkAd('Tek') === 'Tek' &&
  p.ilkAd('') === '');

console.log();
console.log('  GECTI: ' + gecti + '   KALDI: ' + kaldi);
process.exit(kaldi ? 1 : 0);
