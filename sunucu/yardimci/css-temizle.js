'use strict';
/* Okul sayfasının kısıtlı CSS'i.

   Okulun "Kodlayıcı" rolündeki kişisi (ya da müdür) okul sayfasının
   görünümünü CSS ile ayarlayabilir. Serbest CSS tehlikelidir: dış bir
   adrese istek attırabilir (url, @import), giriş kartının üstünü örtebilir
   (position, z-index, transform), sahte yazı gösterebilir (content). Bu
   yüzden yazılan metin kurallarına ayrılır; yalnızca izin verilen seçici,
   özellik ve değerler geçer, geri kalanı atılır ve kişiye neyin neden
   atıldığı söylenir.

   Seçici: yalnızca okul sayfasının parçaları (SAYFA_PARCALARI), yanlarında
   :hover, :first-child, :last-child, :nth-child(...) olabilir; boşluk ve
   ">" ile birleşir, virgülle çoğalır. Etiket adı, #kimlik, [öznitelik],
   ::before/::after geçmez.

   Çıktıda her seçicinin başına ".okul-sayfa " eklenir: kurallar yalnızca
   sayfanın içine uygulanır. Sayfanın kutusu (.okul-sayfa) seçilemez; ona
   uygulamanın kendi CSS'i "contain: paint" verir, içindeki hiçbir şey kutunun
   dışına çizilemez. */

const EN_UZUN = 8000;        // karakter
const EN_FAZLA_KURAL = 200;
const EN_FAZLA_UYARI = 30;

const SAYFA_PARCALARI = ['os-kutu', 'os-kapak', 'os-ust', 'os-logo', 'os-baslik', 'os-yer', 'os-tanitim',
  'os-galeri', 'os-foto'];

/* ---------------- seçiciler ---------------- */
const PARCA = '\\.(?:' + SAYFA_PARCALARI.join('|') + ')' +
  '(?::hover|:first-child|:last-child|:nth-child\\((?:odd|even|\\d{1,2}|\\d{0,2}n(?:\\+\\d{1,2})?)\\))*';
const SECICI = new RegExp('^' + PARCA + '(?:\\s*>\\s*' + PARCA + '|\\s+' + PARCA + ')*$');

function seciciTemizle(ham) {
  const parcalar = ham.split(',').map(s => s.trim().replace(/\s+/g, ' ').toLowerCase());
  if (!parcalar.length || parcalar.some(s => !SECICI.test(s))) return null;
  return parcalar.map(s => '.okul-sayfa ' + s.replace(/\s*>\s*/g, ' > ')).join(', ');
}

/* ---------------- değerler ---------------- */
const ADLI_RENKLER = ['transparent', 'currentcolor', 'white', 'black', 'red', 'green', 'blue', 'yellow', 'orange',
  'purple', 'pink', 'brown', 'gray', 'grey', 'navy', 'teal', 'maroon', 'olive', 'silver', 'gold', 'crimson',
  'tomato', 'coral', 'salmon', 'turquoise', 'indigo', 'violet', 'beige', 'ivory', 'khaki', 'lavender',
  'darkred', 'darkgreen', 'darkblue', 'lightgray', 'lightgrey', 'whitesmoke'];

const HEX = /^#(?:[0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})$/;
const SAYI = '\\d{1,3}(?:\\.\\d+)?';
const RGB = new RegExp('^rgba?\\(\\s*' + SAYI + '%?\\s*,\\s*' + SAYI + '%?\\s*,\\s*' + SAYI + '%?' +
  '(?:\\s*,\\s*(?:0|1|0?\\.\\d+|' + SAYI + '%))?\\s*\\)$');
const HSL = new RegExp('^hsla?\\(\\s*' + SAYI + '(?:deg)?\\s*,\\s*' + SAYI + '%\\s*,\\s*' + SAYI + '%' +
  '(?:\\s*,\\s*(?:0|1|0?\\.\\d+|' + SAYI + '%))?\\s*\\)$');

const renkMi = v => HEX.test(v) || RGB.test(v) || HSL.test(v) || ADLI_RENKLER.indexOf(v) >= 0;

/* Uzunluk: px, rem, em ya da %; sınırlar px cinsinden (1rem = 16px sayılır). */
function uzunlukMu(v, enAz, enCok, yuzdeOlur) {
  if (v === '0') return true;
  const m = /^(-?\d{1,4}(?:\.\d{1,3})?)(px|rem|em|%)$/.exec(v);
  if (!m) return false;
  const n = Number(m[1]);
  if (m[2] === '%') return !!yuzdeOlur && n >= Math.min(0, enAz) && n <= 100;
  const px = m[2] === 'px' ? n : n * 16;
  return px >= enAz && px <= enCok;
}

/* "a b c" gibi boşlukla ayrılmış 1–4 uzunluk (padding, margin, border-radius). */
const uzunluklar = (enAz, enCok, yuzde) => v => {
  const p = v.split(' ');
  return p.length >= 1 && p.length <= 4 && p.every(x => uzunlukMu(x, enAz, enCok, yuzde) || (x === 'auto' && enAz >= 0));
};
const uzunluk = (enAz, enCok, yuzde) => v => uzunlukMu(v, enAz, enCok, yuzde);
const secenek = liste => v => liste.indexOf(v) >= 0;

/* Virgülle ayrılmış parçalar (parantez içindeki virgüller bölmez). */
function virgulleBol(v) {
  const parcalar = [];
  let derinlik = 0, bas = 0;
  for (let i = 0; i < v.length; i++) {
    if (v[i] === '(') derinlik++;
    else if (v[i] === ')') derinlik--;
    else if (v[i] === ',' && derinlik === 0) { parcalar.push(v.slice(bas, i).trim()); bas = i + 1; }
  }
  parcalar.push(v.slice(bas).trim());
  return parcalar;
}

/* Boşlukla ayrılmış parçalar (rgb(1, 2, 3) bölünmez). */
function boslukluBol(v) {
  const parcalar = [];
  let derinlik = 0, bas = 0;
  for (let i = 0; i < v.length; i++) {
    if (v[i] === '(') derinlik++;
    else if (v[i] === ')') derinlik--;
    else if (v[i] === ' ' && derinlik === 0) { if (i > bas) parcalar.push(v.slice(bas, i)); bas = i + 1; }
  }
  if (bas < v.length) parcalar.push(v.slice(bas));
  return parcalar;
}

/* linear-gradient(yön?, renk [yüzde]?, renk [yüzde]? ...) — 2 ile 5 renk. */
function gecisMi(v) {
  const m = /^linear-gradient\((.*)\)$/.exec(v);
  if (!m) return false;
  const p = virgulleBol(m[1]);
  if (/^(?:to (?:top|bottom|left|right)(?: (?:top|bottom|left|right))?|-?\d{1,3}deg)$/.test(p[0])) p.shift();
  if (p.length < 2 || p.length > 5) return false;
  return p.every(dur => {
    const q = boslukluBol(dur);
    return q.length >= 1 && q.length <= 2 && renkMi(q[0]) && (q.length === 1 || uzunlukMu(q[1], 0, 0, true));
  });
}

const CERCEVE_TURU = ['solid', 'dashed', 'dotted', 'double', 'none'];
function cerceveMi(v) {
  if (v === 'none' || v === '0') return true;
  const p = boslukluBol(v);
  if (p.length < 1 || p.length > 3) return false;
  let kalinlik = 0, tur = 0, renk = 0;
  for (const x of p) {
    if (uzunlukMu(x, 0, 20)) kalinlik++;
    else if (CERCEVE_TURU.indexOf(x) >= 0) tur++;
    else if (renkMi(x)) renk++;
    else return false;
  }
  return kalinlik <= 1 && tur <= 1 && renk <= 1;
}

/* Gölge: en fazla 2 tane; her biri [inset] x y [bulanıklık [yayılma]] renk. */
function golgeMi(v, icerOlur) {
  if (v === 'none') return true;
  const liste = virgulleBol(v);
  if (liste.length > 2) return false;
  return liste.every(g => {
    const p = boslukluBol(g);
    if (icerOlur && p[0] === 'inset') p.shift();
    if (!p.length || !renkMi(p[p.length - 1])) return false;
    const u = p.slice(0, -1);
    if (u.length < 2 || u.length > (icerOlur ? 4 : 3)) return false;
    return u.every((x, i) => uzunlukMu(x, i < 2 ? -50 : 0, i === 2 ? 100 : 50));
  });
}

const FONT_AILELERI = ['sans-serif', 'serif', 'monospace', 'system-ui', 'cursive',
  '"ibm plex sans"', "'ibm plex sans'", 'newsreader', 'georgia', 'arial', 'verdana', 'tahoma'];
function fontAilesiMi(v) {
  const p = virgulleBol(v);
  return p.length <= 3 && p.every(x => FONT_AILELERI.indexOf(x) >= 0);
}

const IZGARA = /^(?:repeat\([1-6], ?1fr\)|repeat\(auto-(?:fill|fit), ?minmax\(\d{2,3}px, ?1fr\)\)|(?:[1-4]fr ?){1,6})$/;

/* Özellik -> değer denetçisi. Listede olmayan özellik geçmez. */
const OZELLIKLER = {
  'color': renkMi,
  'background-color': renkMi,
  'background': v => renkMi(v) || gecisMi(v),
  'background-image': gecisMi,
  'opacity': v => /^(?:0|1|0?\.\d{1,3})$/.test(v),

  'font-size': uzunluk(8, 72),
  'font-weight': secenek(['normal', 'bold', 'bolder', 'lighter', '100', '200', '300', '400', '500', '600', '700', '800', '900']),
  'font-style': secenek(['normal', 'italic']),
  'font-family': fontAilesiMi,
  'line-height': v => /^(?:[0-2](?:\.\d{1,2})?|3)$/.test(v) || uzunlukMu(v, 8, 96),
  'letter-spacing': uzunluk(-2, 12),
  'text-align': secenek(['left', 'right', 'center', 'justify', 'start', 'end']),
  'text-transform': secenek(['none', 'uppercase', 'lowercase', 'capitalize']),
  'text-decoration': secenek(['none', 'underline', 'line-through']),
  'text-shadow': v => golgeMi(v, false),

  'padding': uzunluklar(0, 120, true),
  'padding-top': uzunluk(0, 120, true), 'padding-right': uzunluk(0, 120, true),
  'padding-bottom': uzunluk(0, 120, true), 'padding-left': uzunluk(0, 120, true),
  'margin': uzunluklar(0, 120, true),
  'margin-top': uzunluk(0, 120, true), 'margin-right': uzunluk(0, 120, true),
  'margin-bottom': uzunluk(0, 120, true), 'margin-left': uzunluk(0, 120, true),

  'border': cerceveMi,
  'border-top': cerceveMi, 'border-right': cerceveMi, 'border-bottom': cerceveMi, 'border-left': cerceveMi,
  'border-color': renkMi,
  'border-width': uzunluk(0, 20),
  'border-style': secenek(CERCEVE_TURU),
  'border-radius': uzunluklar(0, 200, true),
  'box-shadow': v => golgeMi(v, true),

  'width': uzunluk(0, 1200, true), 'max-width': uzunluk(0, 1200, true), 'min-width': uzunluk(0, 1200, true),
  'height': uzunluk(0, 800), 'max-height': uzunluk(0, 800), 'min-height': uzunluk(0, 800),
  'aspect-ratio': v => v === 'auto' || /^\d{1,2} ?\/ ?\d{1,2}$/.test(v),

  'display': secenek(['block', 'inline', 'inline-block', 'flex', 'inline-flex', 'grid', 'none']),
  'flex-direction': secenek(['row', 'column', 'row-reverse', 'column-reverse']),
  'flex-wrap': secenek(['wrap', 'nowrap']),
  'flex': v => /^(?:none|auto|\d{1,2}(?: \d{1,2})?)$/.test(v),
  'justify-content': secenek(['flex-start', 'flex-end', 'center', 'space-between', 'space-around', 'space-evenly', 'start', 'end']),
  'align-items': secenek(['stretch', 'flex-start', 'flex-end', 'center', 'baseline', 'start', 'end']),
  'gap': uzunluklar(0, 80), 'row-gap': uzunluk(0, 80), 'column-gap': uzunluk(0, 80),
  'grid-template-columns': v => IZGARA.test(v),

  'object-fit': secenek(['cover', 'contain', 'fill', 'none', 'scale-down']),
  'object-position': v => /^(?:center|top|bottom|left|right)(?: (?:center|top|bottom|left|right))?$/.test(v)
};

/* Kişiye nedeniyle söylenen, bilerek kapatılmış özellikler. */
const YASAK_NEDEN = {
  'position': 'sayfanın dışına, giriş kartının üstüne taşınabilir',
  'z-index': 'sayfanın dışına, giriş kartının üstüne taşınabilir',
  'transform': 'sayfanın dışına, giriş kartının üstüne taşınabilir',
  'content': 'sayfaya yazı ekler; yazıyı "Tanıtım" kutusuna yaz',
  'behavior': 'kod çalıştırabilir',
  '-moz-binding': 'kod çalıştırabilir'
};

/* ---------------- ayrıştırma ---------------- */

/* css: kişinin yazdığı metin.
   Dönen: { css: '.okul-sayfa ... { ... }' (temizlenmiş), uyarilar: [...] } */
function cssTemizle(css) {
  const uyarilar = [];
  const uyar = m => { if (uyarilar.length < EN_FAZLA_UYARI) uyarilar.push(m); };
  let metin = String(css || '');
  if (metin.length > EN_UZUN) {
    uyar('CSS en fazla ' + EN_UZUN + ' karakter olabilir; fazlası atıldı.');
    metin = metin.slice(0, EN_UZUN);
  }
  metin = metin.replace(/\/\*[\s\S]*?(\*\/|$)/g, ' ');
  if (/[\\<]/.test(metin)) {
    uyar('Ters bölü (\\) ve "<" kullanılamaz; bu karakterleri içeren kurallar atıldı.');
  }

  const kurallar = [];
  let parcalarSoylendi = false;
  let i = 0;
  while (i < metin.length && kurallar.length < EN_FAZLA_KURAL) {
    /* Bloksuz @ kuralı (@import ...;) noktalı virgüle kadar atlanır. */
    const bas = metin.slice(i).search(/\S/);
    if (bas < 0) break;
    i += bas;
    const noktaliVirgul = metin.indexOf(';', i);
    const ac = metin.indexOf('{', i);
    if (metin[i] === '@' && noktaliVirgul >= 0 && (ac < 0 || noktaliVirgul < ac)) {
      uyar('"' + kisalt(metin.slice(i, noktaliVirgul)) + '": @ kuralları (@import, @media, @font-face...) kullanılamaz.');
      i = noktaliVirgul + 1;
      continue;
    }
    if (ac < 0) {
      if (metin.slice(i).trim()) uyar('Süslü parantezi olmayan metin atıldı: "' + kisalt(metin.slice(i)) + '"');
      break;
    }
    /* Bloğun sonunu bul (iç içe süslü parantez varsa hepsini atla). */
    let derinlik = 0, kapa = -1;
    for (let j = ac; j < metin.length; j++) {
      if (metin[j] === '{') derinlik++;
      else if (metin[j] === '}' && --derinlik === 0) { kapa = j; break; }
    }
    if (kapa < 0) { uyar('Kapanmayan süslü parantez; sondaki kural atıldı.'); break; }
    const seciciHam = metin.slice(i, ac).trim();
    const govde = metin.slice(ac + 1, kapa);
    i = kapa + 1;

    if (seciciHam.indexOf('@') >= 0) { uyar('"' + kisalt(seciciHam) + '": @ kuralları (@import, @media, @font-face...) kullanılamaz.'); continue; }
    if (/[\\<]/.test(seciciHam + govde)) continue;
    if (govde.indexOf('{') >= 0) { uyar('"' + kisalt(seciciHam) + '": iç içe kural yazılamaz.'); continue; }
    const secici = seciciTemizle(seciciHam);
    if (!secici) {
      uyar('"' + kisalt(seciciHam) + '": bu seçici kullanılamaz.' + (parcalarSoylendi ? ''
        : ' Yalnızca sayfanın parçaları seçilebilir: ' + SAYFA_PARCALARI.map(p => '.' + p).join(', ') + '.'));
      parcalarSoylendi = true;
      continue;
    }

    const bildirimler = [];
    for (const ham of govde.split(';')) {
      if (!ham.trim()) continue;
      const iki = ham.indexOf(':');
      if (iki < 0) { uyar(seciciHam + ': "' + kisalt(ham) + '" anlaşılamadı.'); continue; }
      const ozellik = ham.slice(0, iki).trim().toLowerCase();
      const deger = ham.slice(iki + 1).trim().replace(/\s*!important$/i, '').replace(/\s+/g, ' ').toLowerCase();
      const denetci = OZELLIKLER[ozellik];
      if (!denetci) {
        uyar(seciciHam + ' { ' + kisalt(ozellik) + ' }: ' + (YASAK_NEDEN[ozellik]
          ? 'kullanılamaz, ' + YASAK_NEDEN[ozellik] + '.' : 'bu özellik kullanılamaz.'));
        continue;
      }
      if (/url\s*\(|expression|javascript:|image-set|attr\s*\(|var\s*\(|env\s*\(/.test(deger)) {
        uyar(seciciHam + ' { ' + ozellik + ' }: dış adres, değişken ve işlev kullanılamaz; fotoğrafı "Fotoğraflar" bölümünden ekle.');
        continue;
      }
      if (!deger || deger.length > 200 || !denetci(deger)) {
        uyar(seciciHam + ' { ' + ozellik + ': ' + kisalt(deger) + ' }: değer kabul edilmedi (sınırların dışında ya da biçimi tanınmadı).');
        continue;
      }
      bildirimler.push(ozellik + ': ' + deger);
    }
    if (bildirimler.length) kurallar.push(secici + ' { ' + bildirimler.join('; ') + '; }');
  }
  if (kurallar.length >= EN_FAZLA_KURAL && i < metin.length) uyar('En fazla ' + EN_FAZLA_KURAL + ' kural yazılabilir; fazlası atıldı.');
  return { css: kurallar.join('\n'), uyarilar };
}

function kisalt(s) {
  s = String(s).replace(/\s+/g, ' ').trim();
  return s.length > 60 ? s.slice(0, 57) + '...' : s;
}

module.exports = { cssTemizle, SAYFA_PARCALARI };
