'use strict';
/* SQL denetimi: kullanıcıdan gelen bir değer SQL metnine karışabilir mi?

   Kurallar:
     1. SQL yalnızca sunucu/veri/ altında yazılır. Bölümler (bolumler/) ve
        diğer sunucu dosyaları veritabanına yalnızca depo işlevleriyle gider.
     2. sunucu/veri/ istek nesnesini hiç görmez: req, body, q.get yok.
     3. sorgu / tek / calistir / metinCalistir çağrılarının ilk argümanı
        (SQL metni) yalnızca şunlardan birleştirilebilir:
          - tırnak içindeki sabit metin
          - BÜYÜK_HARFLİ sabitler (SEC, PROGRAM_SIRA, TABLOLAR.join(...))
          - tr() (Türkçe sıralama eki), AD_SIRASI()
          - kosul (depo içinde sabit parçalardan kurulan WHERE)
          - adDogrula(...) ile doğrulanmış tablo/sütun adları
        Değerler her zaman $1, $2 ... parametresiyle gider.
     4. Ters tırnaklı şablon metin (`...${x}...`) SQL dosyalarında yok.

   Çalıştırma:  node testler/sql-denetimi.js */

const fs = require('fs');
const path = require('path');

const KOK = path.join(__dirname, '..');
const SUNUCU = path.join(KOK, 'sunucu');
const VERI = path.join(SUNUCU, 'veri');

let gecti = 0, kaldi = 0;
function sonuc(ad, tamam, ayrinti) {
  if (tamam) { gecti++; return; }
  kaldi++;
  console.log('  KALDI ' + ad + (ayrinti ? '\n        ' + ayrinti : ''));
}

function dosyalar(klasor) {
  const liste = [];
  for (const ad of fs.readdirSync(klasor)) {
    const tam = path.join(klasor, ad);
    if (fs.statSync(tam).isDirectory()) liste.push(...dosyalar(tam));
    else if (ad.endsWith('.js')) liste.push(tam);
  }
  return liste;
}

/* Yorumları ve metin içeriklerini ayırmadan önce yorumları at
   (yorumdaki "SELECT" kelimesi kural 1'i yanıltmasın). */
function yorumsuz(kod) {
  let cikti = '', i = 0, tirnak = null;
  while (i < kod.length) {
    const c = kod[i], s = kod[i + 1];
    if (tirnak) {
      cikti += c;
      if (c === '\\') { cikti += s; i += 2; continue; }
      if (c === tirnak) tirnak = null;
      i++; continue;
    }
    if (c === '/' && s === '/') { while (i < kod.length && kod[i] !== '\n') i++; continue; }
    if (c === '/' && s === '*') { i = kod.indexOf('*/', i + 2); i = i < 0 ? kod.length : i + 2; continue; }
    /* Düzenli ifade: kaba tespit (önceki anlamlı karakter operatörse) */
    if (c === '/' && /[=(,:!&|?{};]\s*$/.test(cikti)) {
      cikti += c; i++;
      while (i < kod.length && kod[i] !== '/') { if (kod[i] === '\\') { cikti += kod[i]; i++; } cikti += kod[i]; i++; }
      cikti += '/'; i++; continue;
    }
    if (c === '\'' || c === '"' || c === '`') tirnak = c;
    cikti += c; i++;
  }
  return cikti;
}

/* Açılan parantezden sonraki ilk argümanı (üst düzey virgüle ya da
   kapanan paranteze kadar) döndürür. */
function ilkArguman(kod, bas) {
  let derinlik = 0, tirnak = null, i = bas;
  for (; i < kod.length; i++) {
    const c = kod[i];
    if (tirnak) {
      if (c === '\\') { i++; continue; }
      if (c === tirnak) tirnak = null;
      continue;
    }
    if (c === '\'' || c === '"' || c === '`') { tirnak = c; continue; }
    if (c === '(' || c === '[' || c === '{') derinlik++;
    else if (c === ')' || c === ']' || c === '}') {
      if (derinlik === 0) break;
      derinlik--;
    } else if (c === ',' && derinlik === 0) break;
  }
  return kod.slice(bas, i);
}

/* "a + 'b' + c(d + e)" -> ['a', "'b'", 'c(d + e)'] */
function toplamParcalari(ifade) {
  const parca = [];
  let derinlik = 0, tirnak = null, son = 0;
  for (let i = 0; i < ifade.length; i++) {
    const c = ifade[i];
    if (tirnak) {
      if (c === '\\') { i++; continue; }
      if (c === tirnak) tirnak = null;
      continue;
    }
    if (c === '\'' || c === '"' || c === '`') { tirnak = c; continue; }
    if (c === '(' || c === '[') derinlik++;
    else if (c === ')' || c === ']') derinlik--;
    else if (c === '+' && derinlik === 0) { parca.push(ifade.slice(son, i).trim()); son = i + 1; }
  }
  parca.push(ifade.slice(son).trim());
  return parca.filter(Boolean);
}

const SABIT_METIN = /^(['"])(?:\\.|(?!\1).)*\1$/s;
const IZINLI = [
  /^[A-Z][A-Z0-9_]*$/,                                  // SEC, YENI_ONCE
  /^[A-Z][A-Z0-9_]*\.join\((['"])[^'"]*\1\)$/,          // TABLOLAR.join(', ')
  /^\(\s*[a-zA-Z_]+\s*\?\s*'(?:\\.|[^'])*'\s*:\s*'(?:\\.|[^'])*'\s*\)$/s,   // (secim ? 'sabit' : 'sabit')
  /^tr\(\)$/,
  /^AD_SIRASI\(\)$/,
  /^\(sira \|\| AD_SIRASI\(\)\)$/,
  /^kosul$/,
  /^kosul\.join\((['"])[^'"]*\1\)$/,
  /^adDogrula\([a-z]+\)$/,
  /^yaz\.adDogrula\([a-z]+\)$/
];
/* Dosyaya özel izin: yazici.js adları adDogrula'dan geçirip birleştirir,
   yer tutucular ('$1', '$2') sayıdan üretilir. */
const DOSYA_IZNI = {
  'yazici.js': [/^adlar\.join\(', '\)$/, /^yerler\.join\(', '\)$/, /^atamalar\.join\(', '\)$/, /^\(adlar\.length \+ 1\)$/]
};

console.log('');
console.log('--- SQL denetimi ---');

/* 1. SQL yalnızca sunucu/veri/ altında */
const SQL_KALIBI = /(['"`])\s*(SELECT\s|INSERT\s+INTO\s|UPDATE\s+[a-z_]+\s+SET\s|DELETE\s+FROM\s|TRUNCATE\s|DROP\s)/i;
for (const d of dosyalar(SUNUCU)) {
  if (d.startsWith(VERI)) continue;
  const kod = yorumsuz(fs.readFileSync(d, 'utf8'));
  const m = SQL_KALIBI.exec(kod);
  sonuc('SQL yalnızca veri katmanında: ' + path.relative(KOK, d), !m, m ? m[0] : '');
}

/* 2-4. veri katmanı */
let cagriSayisi = 0;
for (const d of dosyalar(VERI)) {
  const ad = path.basename(d);
  const kod = yorumsuz(fs.readFileSync(d, 'utf8'));
  const goreli = path.relative(KOK, d);

  const istek = /\breq\b|\bbody\.|\bq\.get\(/.exec(kod);
  sonuc('İstek nesnesi veri katmanında yok: ' + goreli, !istek, istek ? istek[0] : '');

  const sablon = /`[^`]*\$\{/.exec(kod);
  sonuc('Şablon metin yok: ' + goreli, !sablon, sablon ? sablon[0].slice(0, 60) : '');

  const cagri = /\b(sorgu|tek|calistir|metinCalistir)\(/g;
  let m;
  while ((m = cagri.exec(kod))) {
    /* Tanımın kendisi (async function sorgu(metin, ...)) çağrı değildir. */
    const once = kod.slice(Math.max(0, m.index - 16), m.index);
    if (/function\s+$/.test(once)) continue;
    const arg = ilkArguman(kod, m.index + m[0].length);
    if (!arg.trim() || /^(metin|sql)$/.test(arg.trim())) continue;   // baglanti.js içindeki iletme
    cagriSayisi++;
    const izinler = IZINLI.concat(DOSYA_IZNI[ad] || []);
    const kotu = toplamParcalari(arg).filter(p => !SABIT_METIN.test(p) && !izinler.some(r => r.test(p)));
    const satir = kod.slice(0, m.index).split('\n').length;
    sonuc('Parametreli sorgu: ' + goreli + ':' + satir, !kotu.length,
      kotu.length ? 'SQL metnine karışan: ' + kotu.join(' | ') : '');
  }
}
sonuc('Veri katmanında sorgu bulundu (' + cagriSayisi + ' çağrı)', cagriSayisi > 50);

console.log('  ' + cagriSayisi + ' sorgu çağrısı incelendi');
console.log('GECTI: ' + gecti + '  KALDI: ' + kaldi);
process.exit(kaldi ? 1 : 0);
