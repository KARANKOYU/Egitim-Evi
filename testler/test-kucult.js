/* Yorum atıcı (sunucusuz):
   - dizgi ve düzenli ifade içindeki // ve /* işaretlerine dokunmuyor;
   - yorum silinince kod aynı sonucu veriyor;
   - gerçek arayüz paketi yorumsuz hâliyle derleniyor (yorumlu hâle düşmüyor). */
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { jsYorumSil, cssYorumSil, kucultKontrollu } = require(path.join(__dirname, '..', 'sunucu', 'yardimci', 'kucult.js'));

let gecti = 0, kaldi = 0;
function kontrol(ad, sart, detay) {
  if (sart) { gecti++; console.log('  GECTI  ' + ad); }
  else { kaldi++; console.log('  KALDI  ' + ad + (detay ? '  -> ' + detay : '')); }
}

console.log('=== 1) ZOR DURUMLAR ===');
const ornek = [
  "var sonuc = [];",
  "var a = 'http://x.com/*y*/'; // yorum 1",
  "var b = \"/* degil */\" + '//degil';",
  "var r = /\\/\\*[^*]*\\*\\//g; /* yorum 2 */",
  "var s = 'a/*b*/c'.replace(/\\*/g, '-');",
  "var bol = 10 / 2 / 5; // bölme",
  "var sinif = /[/*]+/.test('*/');",
  "function f() { return /x\\/y/.source; }",
  "var t = typeof /a/ === 'object';",
  "var k = { a: 1 }; /* satır",
  "   sonu */ var l = 2",
  "var m = l",
  "/* çok satır */",
  "sonuc.push(a, b, r.source, s, bol, sinif, f(), t, l, m);",
  "sonuc;"
].join('\n');
const temiz = jsYorumSil(ornek);
kontrol('yorumlar gitti', temiz.indexOf('yorum 1') < 0 && temiz.indexOf('yorum 2') < 0 && temiz.indexOf('bölme') < 0 &&
  temiz.indexOf('çok satır') < 0, temiz);
const once = vm.runInNewContext(ornek), sonra = vm.runInNewContext(temiz);
kontrol('yorumlu ve yorumsuz kod aynı sonucu veriyor', JSON.stringify(once) === JSON.stringify(sonra),
  JSON.stringify(once) + ' / ' + JSON.stringify(sonra));
kontrol('şablon dizgisi görünce kontrollü sarmalayıcı yorumlu hâli veriyor',
  kucultKontrollu('var a = `x`; // y', 'js') === 'var a = `x`; // y');
kontrol('CSS: dizgi içi korunuyor', cssYorumSil('a{content:"/*x*/"}/* y */b{c:d}') === 'a{content:"/*x*/"}b{c:d}',
  cssYorumSil('a{content:"/*x*/"}/* y */b{c:d}'));

console.log('=== 2) GERÇEK ARAYÜZ PAKETİ ===');
const kok = path.join(__dirname, '..', 'public');
function paket(klasor, uzanti, bas, son) {
  const adlar = fs.readdirSync(klasor).filter(a => a.endsWith(uzanti)).sort();
  return bas + adlar.map(a => '\n/* ==== parcalar/' + a + ' ==== */\n' + fs.readFileSync(path.join(klasor, a), 'utf8')).join('\n') + son;
}
const js = paket(path.join(kok, 'js', 'parcalar'), '.js', "(function () {\n  'use strict';\n", '\n})();\n');
let jsTemiz = '', hata = '';
try { jsTemiz = jsYorumSil(js); new vm.Script(jsTemiz); } catch (e) { hata = e.message; }
kontrol('app.js yorumsuz hâliyle derleniyor', !hata, hata);
kontrol('app.js içinde parça adı ve açıklama kalmadı', jsTemiz && jsTemiz.indexOf('==== parcalar/') < 0 &&
  !/\/\*[\s\S]*?\*\//.test(jsTemiz.replace(/'(?:[^'\\\n]|\\.)*'|"(?:[^"\\\n]|\\.)*"/g, '""').replace(/\/(?:[^/\\\n[]|\\.|\[[^\]\n]*\])+\/[a-z]*/g, '/r/')));
kontrol('app.js küçüldü', jsTemiz.length < js.length * 0.95, js.length + ' -> ' + jsTemiz.length);
const css = paket(path.join(kok, 'css', 'parcalar'), '.css', '', '');
const cssTemiz = cssYorumSil(css);
kontrol('style.css yorumsuz', cssTemiz.indexOf('/*') < 0 && cssTemiz.length < css.length, css.length + ' -> ' + cssTemiz.length);
const acilir = (cssTemiz.match(/\{/g) || []).length, kapanir = (cssTemiz.match(/\}/g) || []).length;
kontrol('style.css süslü parantezleri dengeli', acilir === kapanir, acilir + ' / ' + kapanir);

console.log();
console.log('  GECTI: ' + gecti + '   KALDI: ' + kaldi);
process.exit(kaldi ? 1 : 0);
