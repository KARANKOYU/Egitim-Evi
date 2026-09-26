/* Ters vekil arkasında istemci adresi (sunucusuz):
   - vekile güvenilmiyorsa başlık yok sayılır, soket adresi kullanılır;
   - x-forwarded-for zincirinde baştaki girdiyi ziyaretçi kendisi yazabilir,
     bu yüzden vekilin eklediği SON girdi alınır;
   - IP'ye benzemeyen değer yok sayılır. */
const fs = require('fs');
const os = require('os');
const path = require('path');

process.env.EE_DATA = fs.mkdtempSync(path.join(os.tmpdir(), 'ee-vekil-'));
const { ayarlar } = require(path.join(__dirname, '..', 'sunucu', 'ayarlar.js'));
const { istemciIp } = require(path.join(__dirname, '..', 'sunucu', 'guvenlik.js'));

let gecti = 0, kaldi = 0;
function kontrol(ad, sart, detay) {
  if (sart) { gecti++; console.log('  GECTI  ' + ad); }
  else { kaldi++; console.log('  KALDI  ' + ad + (detay ? '  -> ' + detay : '')); }
}
const ip = basliklar => istemciIp({ socket: { remoteAddress: '127.0.0.1' }, headers: basliklar });

ayarlar.vekil = { guven: false, baslik: 'x-forwarded-for' };
kontrol('vekile güvenilmiyorsa başlık yok sayılıyor', ip({ 'x-forwarded-for': '1.2.3.4' }) === '127.0.0.1');

ayarlar.vekil = { guven: true, baslik: 'x-forwarded-for' };
kontrol('tek girdi alınıyor', ip({ 'x-forwarded-for': '9.9.9.9' }) === '9.9.9.9');
kontrol('uydurulan baştaki girdi değil vekilin eklediği son girdi alınıyor',
  ip({ 'x-forwarded-for': '1.2.3.4, 5.6.7.8' }) === '5.6.7.8', ip({ 'x-forwarded-for': '1.2.3.4, 5.6.7.8' }));
const farkli = new Set();
for (let i = 0; i < 20; i++) farkli.add(ip({ 'x-forwarded-for': '10.0.0.' + i + ', 5.6.7.8' }));
kontrol('baştaki girdiyi değiştirmek yeni sayaç açmıyor', farkli.size === 1, [...farkli].join(' '));
kontrol('IP olmayan son girdi yok sayılıyor', ip({ 'x-forwarded-for': '1.2.3.4, uydurma' }) === '127.0.0.1');
kontrol('başlık yoksa soket adresi', ip({}) === '127.0.0.1');
kontrol('IPv6 kabul ediliyor', ip({ 'x-forwarded-for': '2001:db8::1' }) === '2001:db8::1');

ayarlar.vekil = { guven: true, baslik: 'cf-connecting-ip' };
kontrol('cf-connecting-ip okunuyor', ip({ 'cf-connecting-ip': '8.8.4.4', 'x-forwarded-for': '1.1.1.1' }) === '8.8.4.4');

console.log();
console.log('  GECTI: ' + gecti + '   KALDI: ' + kaldi);
process.exit(kaldi ? 1 : 0);
