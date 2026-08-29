/* Arayuzdeki her dugmenin gercekten bir karsiligi var mi?
   - data-act="X"  -> islem() icinde act === 'X' var mi
   - data-nav="X"  -> SAYFALAR.X tanimli mi
   - islem() icinde X var ama hic dugme uretmiyor mu (olu kod)
   - SAYFALAR.X var ama hic menu/nav gostermiyor mu */
const fs = require('fs');
const path = require('path');

const KOK = path.join(__dirname, '..');
/* Arayuz artik parcalar halinde; sunucunun yaptigi gibi ad sirasiyla birlestir. */
const PARCA_KLASOR = path.join(KOK, 'public', 'js', 'parcalar');
const APP = fs.readdirSync(PARCA_KLASOR).filter(a => a.endsWith('.js')).sort()
  .map(a => fs.readFileSync(path.join(PARCA_KLASOR, a), 'utf8')).join(String.fromCharCode(10));
const HTML = fs.readFileSync(path.join(KOK, 'public', 'index.html'), 'utf8');
const KAYNAK = APP + '\n' + HTML;

function benzersiz(a) { return a.filter((v, i) => a.indexOf(v) === i).sort(); }

/* --- uretilen dugmeler --- */
const uretilenAct = benzersiz(
  [...KAYNAK.matchAll(/data-act=\\?["']([a-zA-Z0-9_-]+)\\?["']/g)].map(m => m[1]));
const uretilenNav = benzersiz(
  [...KAYNAK.matchAll(/data-nav=\\?["']([a-zA-Z0-9_-]+)\\?["']/g)].map(m => m[1]));

/* Degiskenle uretilenler: data-act="' + degisken + '" */
const degiskenAct = [...KAYNAK.matchAll(/data-act="'\s*\+\s*([a-zA-Z0-9_.$\[\]]+)/g)]
  .map(m => m[1]);
const degiskenNav = [...KAYNAK.matchAll(/data-nav="'\s*\+\s*(?:esc\()?([a-zA-Z0-9_.$\[\]]+)/g)]
  .map(m => m[1]);

/* --- ele alinan eylemler --- */
const eleAlinanAct = benzersiz([
  ...[...APP.matchAll(/act === '([a-zA-Z0-9_-]+)'/g)].map(m => m[1]),
  /* Ekran dosyalarının kaydettiği eylemler: EYLEMLER['ad'] = function ... */
  ...[...APP.matchAll(/EYLEMLER\['([a-zA-Z0-9_-]+)'\]\s*=/g)].map(m => m[1])
]);

/* --- tanimli sayfalar --- */
const sayfalar = benzersiz([
  ...[...APP.matchAll(/SAYFALAR\.([a-zA-Z0-9_-]+)\s*=/g)].map(m => m[1]),
  ...[...APP.matchAll(/SAYFALAR\['([a-zA-Z0-9_-]+)'\]\s*=/g)].map(m => m[1])
]);

/* --- menude gecen sayfa anahtarlari ---
   Yalnizca menu satiri (g: ikon) ya da ana sayfa kutucugu (ikon:) sayilir.
   Excel aktarim turleri gibi baska { k: '...' } nesneleri sayfa degil. */
const menuAnahtar = benzersiz(
  [...APP.matchAll(/\{\s*k:\s*'([a-zA-Z0-9_-]+)'[^}]*?(?:g:\s*'|ikon:\s*')/g)]
    .map(m => m[1]));

console.log('=== SAYILAR ===');
console.log('  uretilen data-act :', uretilenAct.length);
console.log('  ele alinan act    :', eleAlinanAct.length);
console.log('  uretilen data-nav :', uretilenNav.length);
console.log('  tanimli SAYFALAR  :', sayfalar.length);
console.log('  menu anahtari     :', menuAnahtar.length);
if (degiskenAct.length) {
  console.log('  degiskenle uretilen act:', benzersiz(degiskenAct).join(', '));
}
if (degiskenNav.length) {
  console.log('  degiskenle uretilen nav:', benzersiz(degiskenNav).join(', '));
}

let sorun = 0;

console.log();
console.log('=== 1) KARSILIGI OLMAYAN DUGMELER (olu buton) ===');
const oluButon = uretilenAct.filter(a => eleAlinanAct.indexOf(a) < 0);
if (!oluButon.length) console.log('  yok');
else { sorun += oluButon.length; oluButon.forEach(a => console.log('  ! data-act="' + a + '" -> islem() icinde yok')); }

console.log();
console.log('=== 2) HIC URETILMEYEN EYLEM (olu kod) ===');
const oluEylem = eleAlinanAct.filter(a => uretilenAct.indexOf(a) < 0);
if (!oluEylem.length) console.log('  yok');
else oluEylem.forEach(a => console.log('  ? act === \'' + a + '\' -> hic dugme uretmiyor'));

