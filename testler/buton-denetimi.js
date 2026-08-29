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

console.log();
console.log('=== 3) OLMAYAN SAYFAYA GIDEN BAGLANTI ===');
/* data-nav degerleri sayfa anahtari olmali; birkac ozel deger disinda */
const OZEL_NAV = ['geri-veli'];
const oluNav = uretilenNav.filter(n =>
  sayfalar.indexOf(n) < 0 && OZEL_NAV.indexOf(n) < 0);
if (!oluNav.length) console.log('  yok');
else { sorun += oluNav.length; oluNav.forEach(n => console.log('  ! data-nav="' + n + '" -> SAYFALAR.' + n + ' tanimsiz')); }

console.log();
console.log('=== 4) MENUDE OLUP SAYFASI OLMAYAN ===');
/* geri-veli sayfa degil, tiklama dagiticisinda ele aliniyor. */
const menuOlu = menuAnahtar.filter(k =>
  sayfalar.indexOf(k) < 0 && OZEL_NAV.indexOf(k) < 0);
if (!menuOlu.length) console.log('  yok');
else { sorun += menuOlu.length; menuOlu.forEach(k => console.log('  ! menu "' + k + '" -> SAYFALAR.' + k + ' tanimsiz')); }

console.log();
console.log('=== 5) SAYFASI OLUP HIC ULASILAMAYAN ===');
const ulasilmaz = sayfalar.filter(k =>
  menuAnahtar.indexOf(k) < 0 && uretilenNav.indexOf(k) < 0 &&
  !new RegExp("git\\('" + k + "'\\)").test(APP));
if (!ulasilmaz.length) console.log('  yok');
else ulasilmaz.forEach(k => console.log('  ? SAYFALAR.' + k + ' -> menude yok, git() ile de cagrilmiyor'));

console.log();
console.log('=== 6) API YOLU / SUNUCU UCU KARSILASTIRMASI ===');
/* Sunucu artik sunucu/ altinda modullere bolunmus; hepsini birlestirip tara. */
function sunucuMetni(k) { let m = ''; for (const ad of fs.readdirSync(path.join(KOK, k))) {
  const p = path.join(k, ad); if (fs.statSync(path.join(KOK, p)).isDirectory()) m += sunucuMetni(p);
  else if (ad.endsWith('.js')) m += fs.readFileSync(path.join(KOK, p), 'utf8') + String.fromCharCode(10); } return m; }
const SRV = sunucuMetni('sunucu');
/* Arayuzun cagirdigi api('/...') yollari */
const cagrilan = benzersiz(
  [...APP.matchAll(/api\('\/([a-zA-Z0-9_\-\/]+)/g)].map(m => m[1].split('/')[0]));
/* Sunucunun tanidigi ust seviye yollar */
const tanimli = benzersiz(
  [...SRV.matchAll(/p [!=]== '([a-zA-Z0-9_-]+)'/g)].map(m => m[1]));   // "p === 'x'" ya da "if (p !== 'x') return false"
const eksikUc = cagrilan.filter(y => tanimli.indexOf(y) < 0);
if (!eksikUc.length) console.log('  tum api yollari sunucuda tanimli (' + cagrilan.length + ' yol)');
else { sorun += eksikUc.length; eksikUc.forEach(y => console.log('  ! api(\'/' + y + '...\') -> sunucuda p === \'' + y + '\' yok')); }

console.log();
console.log(sorun ? '  ' + sorun + ' SORUN BULUNDU' : '  SORUN YOK');
process.exit(sorun ? 1 : 0);
