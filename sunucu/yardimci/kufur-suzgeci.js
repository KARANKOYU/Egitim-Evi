'use strict';
/* Yorumlar için küfür ve hakaret süzgeci.

   Kelime listesi depodaki badwordsfilter.json dosyasındadır; dosya değişince
   en geç 30 saniyede yeniden okunur. Karşılaştırma öncesi hem metin hem
   liste aynı biçime getirilir:
     - büyük/küçük harf ve Türkçe harfler düzlenir (Ş=ş=s, İ=ı=i ...),
     - rakamla yazılan harfler çevrilir (4=a, 3=e, 1=i, 0=o, 5=s, 7=t, @=a, $=s),
     - uzatılmış harf teke iner (salaaak -> salak, yarrak -> yarak),
     - harf harf aralıklı yazılan kelime birleştirilir ("s a l a k").
   4 harf ve uzun kelimeler ekiyle de yakalanır (salak -> salaklar); kısa
   kelimeler ("aq", "göt") yalnızca tek başına yazılınca, yoksa masum
   kelimelerin içinde de bulunurdu. */

const fs = require('fs');
const path = require('path');

const DOSYA = path.join(__dirname, '..', '..', 'badwordsfilter.json');
const RAKAM = { 0: 'o', 1: 'i', 3: 'e', 4: 'a', 5: 's', 7: 't', '@': 'a', $: 's' };

function sadelestir(metin) {
  return String(metin || '')
    .replace(/[0-9@$]/g, c => (RAKAM[c] !== undefined ? RAKAM[c] : c))
    .replace(/[ıİI]/g, 'i')
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/([a-z])\1+/g, '$1')
    .trim();
}

let liste = { tek: new Set(), onek: [], ikili: [] };
let zaman = -1, yoklama = 0;

function listeGuncel() {
  const simdi = Date.now();
  if (simdi - yoklama < 30 * 1000) return liste;
  yoklama = simdi;
  let z = 0;
  try { z = fs.statSync(DOSYA).mtimeMs; } catch (e) { z = 0; }
  if (z === zaman) return liste;
  zaman = z;
  let ham = [];
  try {
    const j = z ? JSON.parse(fs.readFileSync(DOSYA, 'utf8')) : {};
    ham = Array.isArray(j) ? j : (Array.isArray(j.kelimeler) ? j.kelimeler : []);
  } catch (e) {
    console.error('badwordsfilter.json okunamadı:', e.message);
    return liste;   // bozuk dosya: eski liste kalır
  }
  const yeni = { tek: new Set(), onek: [], ikili: [] };
  for (const k of ham) {
    const s = sadelestir(k);
    if (!s) continue;
    if (s.indexOf(' ') >= 0) yeni.ikili.push(s);
    else if (s.length >= 4) yeni.onek.push(s);
    else yeni.tek.add(s);
  }
  liste = yeni;
  return liste;
}

/* Metinde listedeki bir kelime var mı? Varsa ilk bulunanı döndürür (günlük
   için), yoksa ''. */
function uygunsuzKelime(metin) {
  const l = listeGuncel();
  const sade = sadelestir(metin);
  if (!sade) return '';
  const kelimeler = sade.split(' ');
  /* Harf harf aralıklı yazılmış kısımlar birleşik hâliyle de denenir. */
  const ekler = [];
  for (let i = 0; i < kelimeler.length;) {
    let j = i;
    while (j < kelimeler.length && kelimeler[j].length === 1) j++;
    if (j - i >= 3) ekler.push(kelimeler.slice(i, j).join(''));
    i = j > i ? j : i + 1;
  }
  for (const k of kelimeler.concat(ekler)) {
    if (l.tek.has(k)) return k;
    for (const o of l.onek) if (k.startsWith(o)) return o;
  }
  const bitisik = ' ' + sade + ' ';
  for (const i of l.ikili) if (bitisik.indexOf(' ' + i) >= 0) return i;
  return '';
}

module.exports = { uygunsuzKelime, sadelestir };
