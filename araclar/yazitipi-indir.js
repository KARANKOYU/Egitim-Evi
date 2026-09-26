'use strict';
/* Yazı tiplerini Google Fonts'tan bir kez indirir ve public/yazitipi/ altına koyar.

   Neden: uygulama dışarıdan yazı tipi çekmez (okul ağında internet olmayabilir,
   ayrıca üçüncü tarafa istek gitmesin). Dosyalar projede durur, sunucu kendi
   verir. Bu araç yalnızca yazı tipi değiştirilmek istenince çalıştırılır.

   Kullanım: node araclar/yazitipi-indir.js
   Çıktı:    public/yazitipi/*.woff2  ve  public/css/parcalar/00a-yazitipi.css */

const fs = require('fs');
const path = require('path');
const https = require('https');

const HEDEF = path.join(__dirname, '..', 'public', 'yazitipi');
const CSS_CIKTI = path.join(__dirname, '..', 'public', 'css', 'parcalar', '00a-yazitipi.css');

/* Hangi aileler, hangi kalınlıklar. Türkçe için latin + latin-ext yeterli.
   600 kalınlığı bilerek yok: tarayıcı 600 isteyince 700'ü kullanır, dosya
   sayısı ve indirme yarı yarıya düşer (652 KB -> 248 KB). */
const AILELER = [
  { ad: 'IBM Plex Sans', dosya: 'plex-sans', sorgu: 'IBM+Plex+Sans:wght@400;700' },
  { ad: 'Newsreader',    dosya: 'newsreader', sorgu: 'Newsreader:opsz,wght@6..72,700' }
];
const ALT_KUMELER = ['latin', 'latin-ext'];

/* Google, tarayıcıya göre biçim seçer; woff2 almak için modern tarayıcı gibi görünmek gerekir. */
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36';

function indir(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': UA } }, res => {
      if (res.statusCode !== 200) return reject(new Error(url + ' -> ' + res.statusCode));
      const parcalar = [];
      res.on('data', d => parcalar.push(d));
      res.on('end', () => resolve(Buffer.concat(parcalar)));
    }).on('error', reject);
  });
}

(async () => {
  fs.mkdirSync(HEDEF, { recursive: true });
  const cssParcalari = [
    '/* Yazı tipleri — kendi sunucumuzdan gelir, dışarıya istek gitmez.',
    '   Dosyalar araclar/yazitipi-indir.js ile üretildi; elle düzenlenmez.',
    '   font-display: swap -> yazı önce sistem fontuyla anında görünür, dosya',
    '   gelince değişir; yavaş bağlantıda boş ekran olmaz. */',
    ''
  ];
  let toplam = 0;

  for (const aile of AILELER) {
    const css = (await indir('https://fonts.googleapis.com/css2?family=' + aile.sorgu + '&display=swap')).toString('utf8');
    /* Her @font-face bloğunu ayrıştır: alt küme yorumu, kalınlık, adres, unicode-range.
       Değişken yazı tipinde Google 400 ve 700 için AYNI dosyayı verir; o dosya
       bir kez indirilir ve tek @font-face'e kalınlık aralığı (400 700) yazılır.
       Yoksa tarayıcı aynı dosyayı iki farklı adla iki kez indirir. */
    const dosyalar = new Map();   // url -> { altKume, kalinliklar, aralik }
    const bloklar = css.split('/* ').slice(1);
    for (const blok of bloklar) {
      const altKume = blok.slice(0, blok.indexOf(' */')).trim();
      if (ALT_KUMELER.indexOf(altKume) < 0) continue;
      const kalinlik = (blok.match(/font-weight:\s*([^;]+);/) || [])[1].trim();
      const stil = (blok.match(/font-style:\s*([^;]+);/) || [])[1].trim();
      const url = (blok.match(/url\(([^)]+)\)/) || [])[1];
      const aralik = (blok.match(/unicode-range:\s*([^;]+);/) || [])[1].trim();
      if (stil !== 'normal' || !url) continue;
      if (!dosyalar.has(url)) dosyalar.set(url, { altKume, kalinliklar: [], aralik });
      dosyalar.get(url).kalinliklar.push(...kalinlik.split(/\s+/).map(Number));
    }

    for (const [url, d] of dosyalar) {
      const enAz = Math.min(...d.kalinliklar), enCok = Math.max(...d.kalinliklar);
      const kalinlik = enAz === enCok ? String(enAz) : enAz + ' ' + enCok;
      const dosyaAdi = aile.dosya + '-' + kalinlik.replace(/\s+/g, '-') + '-' + d.altKume + '.woff2';
      const veri = await indir(url);
      fs.writeFileSync(path.join(HEDEF, dosyaAdi), veri);
      toplam += veri.length;
      console.log('  ' + dosyaAdi.padEnd(40) + Math.round(veri.length / 1024) + ' KB');

      cssParcalari.push(
        '@font-face {',
        "  font-family: '" + aile.ad + "';",
        '  font-style: normal;',
        '  font-weight: ' + kalinlik + ';',
        '  font-display: swap;',
        "  src: url('/yazitipi/" + dosyaAdi + "') format('woff2');",
        '  unicode-range: ' + d.aralik + ';',
        '}', ''
      );
    }
  }

  fs.writeFileSync(CSS_CIKTI, cssParcalari.join('\n'), 'utf8');
  console.log('\n  toplam ' + Math.round(toplam / 1024) + ' KB -> ' + HEDEF);
  console.log('  CSS -> ' + CSS_CIKTI);
})().catch(e => { console.error('HATA:', e.message); process.exit(1); });
