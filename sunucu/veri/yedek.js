'use strict';
/* Yedekleme: bütün veri JSON dosyası olarak data/yedek/ altına yazılır.

   Neden pg_dump değil: JSON yedek uygulamanın kendi biçiminde, elle
   okunabiliyor, sürüm farkından etkilenmiyor ve yönetici panelinden tek
   tıkla geri yüklenebiliyor. Sunucuda ayrıca günlük pg_dump da alınır
   (belge/SUNUCUYA-KURULUM.md); ikisi birbirinin yedeği. */

const fs = require('fs');
const path = require('path');
const { DATA } = require('../yollar');
const { iceAktar, disaAktar } = require('./json-aktarim');

const YEDEK_KLASOR = path.join(DATA, 'yedek');
const YEDEK_SAKLA = 14;                       // kaç kopya tutulsun
const YEDEK_ARALIK_MS = 6 * 60 * 60 * 1000;   // 6 saatte bir kontrol

function yedekAdi(d) {
  const p2 = n => (n < 10 ? '0' : '') + n;
  return 'yedek-' + d.getFullYear() + '-' + p2(d.getMonth() + 1) + '-' + p2(d.getDate()) +
    '_' + p2(d.getHours()) + p2(d.getMinutes()) + '.json';
}

function yedekListesi() {
  if (!fs.existsSync(YEDEK_KLASOR)) return [];
  return fs.readdirSync(YEDEK_KLASOR)
    .filter(f => /^yedek-.*\.json$/.test(f))
    .map(f => {
      const st = fs.statSync(path.join(YEDEK_KLASOR, f));
      return { ad: f, boyut: st.size, tarih: st.mtime.toISOString() };
    })
    /* Yeniden eskiye, dosyanın yazıldığı ana göre (adına göre sıralanınca
       "yedek-elle-..." adları otomatik yedeklerin önüne geçiyordu). */
    .sort((a, b) => b.tarih.localeCompare(a.tarih));
}

function yedekTemizle() {
  const liste = yedekListesi();
  for (let i = YEDEK_SAKLA; i < liste.length; i++) {
    try { fs.unlinkSync(path.join(YEDEK_KLASOR, liste[i].ad)); } catch (e) { /* yoksay */ }
  }
}

