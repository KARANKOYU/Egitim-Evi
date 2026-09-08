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

