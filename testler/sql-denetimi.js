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

