'use strict';
/* tasarim/tema-secimi.html sayfasını farklı ayarlarla açıp PNG olarak kaydeder.
   Böylece seçenekleri tek tek tıklamadan görsellerden karşılaştırabilirsin.

   Kullanım:
     1) tasarim/ klasörünü herhangi bir statik sunucuyla aç:
          cd tasarim && python -m http.server 3210
     2) node araclar/tema-ornekleri.js
   Çıktı: tasarim/ornekler/*.png
*/

const fs = require('fs');
const path = require('path');
const { execFile } = require('child_process');

const BASE = process.env.EE_TASARIM || 'http://127.0.0.1:3210';
const HEDEF = path.join(__dirname, '..', 'tasarim', 'ornekler');
const PROFIL = path.join(__dirname, 'chrome-profil-tema');

const CHROME = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
].find(p => fs.existsSync(p));

/* Karşılaştırma için seçilmiş kombinasyonlar. Her yön için bir açık bir
   koyu; font ve köşe her yönün karakterine göre eşlendi. */
const ORNEKLER = [
  ['A1-tugla-acik-plex-orta-sade',        'yon=tugla&tema=acik&font=plex&kose=orta&hareket=hafif&kutu=sade'],
  ['A2-tugla-koyu-plex-cok-sade',         'yon=tugla&tema=koyu&font=plex&kose=cok&hareket=belirgin&kutu=sade'],
  ['A3-tugla-acik-sistem-orta-dolu',      'yon=tugla&tema=acik&font=sistem&kose=orta&hareket=hafif&kutu=dolu'],
  ['B1-murekkep-acik-source-az-cizgili',  'yon=murekkep&tema=acik&font=source&kose=az&hareket=hafif&kutu=cizgili'],
  ['B2-murekkep-koyu-source-orta-sade',   'yon=murekkep&tema=koyu&font=source&kose=orta&hareket=belirgin&kutu=sade'],
  ['C1-muhur-acik-figtree-cok-sade',      'yon=muhur&tema=acik&font=figtree&kose=cok&hareket=belirgin&kutu=sade'],
  ['C2-muhur-koyu-figtree-cok-cizgili',   'yon=muhur&tema=koyu&font=figtree&kose=cok&hareket=belirgin&kutu=cizgili'],
  ['D1-tugla-acik-public-az-cizgili',     'yon=tugla&tema=acik&font=public&kose=az&hareket=hafif&kutu=cizgili']
];

function chromeCalistir(args) {
  return new Promise((resolve) => {
    execFile(CHROME, args, { timeout: 60000, windowsHide: true }, () => resolve());
  });
}

(async () => {
  if (!CHROME) {
    console.error('Chrome ya da Edge bulunamadı.');
    process.exit(1);
  }
  fs.mkdirSync(HEDEF, { recursive: true });

  for (const [ad, sorgu] of ORNEKLER) {
    const dosya = path.join(HEDEF, ad + '.png');
    /* Kontrol çubuğu resme girmesin diye sayfa kendi başına yeterince
       yüksek çekiliyor; ilk 300 px laboratuvar başlığı, gerisi ekran. */
    await chromeCalistir([
      '--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check',
      '--user-data-dir=' + PROFIL,
      '--hide-scrollbars',
      '--virtual-time-budget=6000',      /* yazı tipleri insin */
      '--window-size=1400,1560',
      '--screenshot=' + dosya,
      BASE + '/tema-secimi.html?' + sorgu
    ]);
    const boyut = fs.existsSync(dosya) ? Math.round(fs.statSync(dosya).size / 1024) : 0;
    console.log('  ' + (boyut ? 'tamam ' : 'HATA  ') + ad + '.png' + (boyut ? '  (' + boyut + ' KB)' : ''));
  }

  try { fs.rmSync(PROFIL, { recursive: true, force: true }); } catch (e) { /* önemsiz */ }
  console.log('\n' + ORNEKLER.length + ' örnek -> ' + HEDEF);
})();
