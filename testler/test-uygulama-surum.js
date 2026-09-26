/* İndirme sayfasının sürüm listesi (sunucusuz): GitHub cevabından yalnızca
   güvenilir alanlar alınıyor mu?
   - taslak, ön sürüm, sürüm numarası bozuk olanlar atılıyor;
   - APK adresi yalnızca uygulamanın kendi deposunun sürüm dosyası olabilir;
   - SHA-256 özeti 64 onaltılık hane değilse boş kalıyor;
   - not Markdown'dan düz metne çevriliyor, kontrol karakterleri atılıyor, kısaltılıyor;
   - en yeni sürüm en üstte (sürüm numarasına göre). */
const path = require('path');
const { surumleriAyikla, duzMetin } = require(path.join(__dirname, '..', 'sunucu', 'uygulama-surum.js'));

let gecti = 0, kaldi = 0;
function kontrol(ad, sart, detay) {
  if (sart) { gecti++; console.log('  GECTI  ' + ad); }
  else { kaldi++; console.log('  KALDI  ' + ad + (detay ? '  -> ' + detay : '')); }
}

const DEPO = 'https://github.com/KARANKOYU/Egitim-Evi-App/releases/download/';
const OZET = 'sha256:' + 'ab'.repeat(32);
const apk = (etiket, ad, ek) => Object.assign({ name: ad, size: 30724, digest: OZET,
  browser_download_url: DEPO + etiket + '/' + ad }, ek || {});
const surum = (etiket, ek) => Object.assign({ tag_name: etiket, name: 'Sürüm ' + etiket, body: 'Not',
  published_at: '2026-09-26T17:23:37Z', draft: false, prerelease: false, assets: [apk(etiket, 'egitim-evi.apk')] }, ek || {});

const ham = [
  surum('v1.0.1', { body: '## Yenilikler\n- **Şifre** kutusu [gizli](https://x.y) yazar\n- `durum` çubuğu' }),
  surum('v1.0.10'),
  surum('v1.0.2'),
  surum('v2.0.0', { draft: true }),
  surum('v1.9.0', { prerelease: true }),
  surum('son-surum'),
  surum('v1.0.3', { assets: [apk('v1.0.3', 'egitim-evi.apk', { browser_download_url: 'https://kotu.example.com/egitim-evi.apk' })] }),
  surum('v1.0.4', { assets: [apk('v1.0.4', 'egitim-evi.aab', { browser_download_url: DEPO + 'v1.0.4/egitim-evi.aab' })] }),
  surum('v1.0.5', { assets: [apk('v1.0.5', 'x.apk', { browser_download_url: 'https://github.com/baskasi/Egitim-Evi-App/releases/download/v1.0.5/x.apk' })] }),
  surum('v1.0.6', { assets: [apk('v1.0.6', 'egitim-evi.apk', { digest: 'sha256:kisa' })] }),
  surum('v1.0.7', { published_at: 'dün' }),
  surum('v1.0.8', { assets: [apk('v1.0.8', 'egitim-evi.apk', { size: -5 })] }),
  null, 'metin', 42
];
const l = surumleriAyikla(ham);
const surumler = l.map(s => s.surum).join(',');

kontrol('taslak, ön sürüm, bozuk numara/tarih/boyut ve yabancı adresliler atıldı', surumler === '1.0.10,1.0.6,1.0.2,1.0.1', surumler);
kontrol('en yeni sürüm en üstte (1.0.10 > 1.0.2)', l[0] && l[0].surum === '1.0.10');
kontrol('yalnızca APK alındı (AAB gösterilmez)', l.every(s => /\.apk$/.test(s.apk.adres)));
kontrol('APK adresi yalnızca uygulamanın deposundan', l.every(s => s.apk.adres.indexOf(DEPO) === 0));
const s101 = l.find(s => s.surum === '1.0.1');
kontrol('SHA-256 özeti 64 hane', s101 && s101.apk.sha256 === 'ab'.repeat(32));
const s106 = l.find(s => s.surum === '1.0.6');
kontrol('bozuk özet boş kalıyor', s106 && s106.apk.sha256 === '');
kontrol('not düz metne çevrildi', s101 && s101.notlar === 'Yenilikler Şifre kutusu gizli yazar durum çubuğu', s101 && s101.notlar);
kontrol('alanlar yalnızca beklenenler', l.every(s => Object.keys(s).sort().join(',') === 'ad,apk,notlar,surum,tarih' &&
  Object.keys(s.apk).sort().join(',') === 'ad,adres,boyut,sha256'));
kontrol('dizi olmayan cevap boş liste', surumleriAyikla({ message: 'rate limit' }).length === 0 && surumleriAyikla(null).length === 0);

kontrol('kontrol ve yön karakterleri atılıyor', duzMetin('a\u0000b‮c\u0007d', 50) === 'abcd', JSON.stringify(duzMetin('a\u0000b‮c\u0007d', 50)));
kontrol('uzun not kısaltılıyor', duzMetin('x'.repeat(500), 400).length === 400 && /…$/.test(duzMetin('x'.repeat(500), 400)));
kontrol('HTML olduğu gibi metin kalır (sayfa kaçırarak basar)', duzMetin('<img src=x onerror=alert(1)>', 100) === '<img src=x onerror=alert(1)>');

const cok = [];
for (let i = 0; i < 80; i++) cok.push(surum('v1.' + i + '.0'));
kontrol('en fazla 30 sürüm', surumleriAyikla(cok).length === 30);

console.log();
console.log('  GECTI: ' + gecti + '   KALDI: ' + kaldi);
process.exit(kaldi ? 1 : 0);
