'use strict';
/* Tarayıcıya giden birleşik JS ve CSS'ten yorumları atar.

   Kaynaktaki açıklamalar (hangi denetim neden var, hangi uç ne yapar)
   geliştirici için; "İncele" diyen herkesin okuması gerekmiyor. Güvenlik
   bunlara dayanmıyor (bütün kurallar sunucuda), yine de gereksiz bilgi
   verilmesin ve dosya küçülsün.

   Yorum atıcı dizgi ve düzenli ifade içindeki // ve /* işaretlerine
   dokunmaz. Sonuç JS için ayrıca derlenip denetlenir (kucultKontrollu):
   derlenemezse yorumlu hâli gönderilir, uygulama asla bozulmaz.
   EE_ACIK_KAYNAK=1 ile yorumlar korunur (geliştirirken hata ayıklamak için). */

const vm = require('vm');

/* Önceki anlamlı karakter bunlardan biriyse "/" düzenli ifade başlatır. */
const IFADE_ONCESI = new Set(['(', ',', '=', ':', '[', '!', '&', '|', '?', '{', '}', ';', '+', '-', '*', '%', '<', '>', '~', '^', '']);
const IFADE_KELIMESI = /(?:^|[^\w$])(return|typeof|instanceof|in|of|new|delete|void|throw|case|do|else|yield|await)$/;

function jsYorumSil(kaynak) {
  let cikti = '';
  let i = 0;
  const n = kaynak.length;
  let sonAnlamli = '';   // son yazılan boşluk dışı karakter
  while (i < n) {
    const c = kaynak[i], s = kaynak[i + 1];
    /* dizgi */
    if (c === '"' || c === "'") {
      let j = i + 1;
      while (j < n && kaynak[j] !== c) {
        if (kaynak[j] === '\\') j++;
        else if (kaynak[j] === '\n') break;   // kapanmamış dizgi: olduğu gibi bırak
        j++;
      }
      cikti += kaynak.slice(i, j + 1);
      sonAnlamli = c;
      i = j + 1;
      continue;
    }
    if (c === '`') throw new Error('şablon dizgisi desteklenmiyor');
    if (c === '/' && s === '/') {
      while (i < n && kaynak[i] !== '\n') i++;
      continue;
    }
    if (c === '/' && s === '*') {
      const son = kaynak.indexOf('*/', i + 2);
      const parca = son < 0 ? kaynak.slice(i) : kaynak.slice(i, son + 2);
      /* Satır sonu içeren yorum yerine satır sonu (otomatik noktalı virgül bozulmasın). */
      cikti += parca.indexOf('\n') >= 0 ? '\n' : ' ';
      i = son < 0 ? n : son + 2;
      continue;
    }
    if (c === '/') {
      const onceki = cikti.replace(/\s+$/, '');
      const regexMi = IFADE_ONCESI.has(sonAnlamli) || IFADE_KELIMESI.test(onceki);
      if (regexMi) {
        let j = i + 1, sinifta = false;
        while (j < n) {
          const d = kaynak[j];
          if (d === '\\') { j += 2; continue; }
          if (d === '\n') break;
          if (sinifta) { if (d === ']') sinifta = false; }
          else if (d === '[') sinifta = true;
          else if (d === '/') break;
          j++;
        }
        j++;
        while (j < n && /[a-z]/i.test(kaynak[j])) j++;   // bayraklar
        cikti += kaynak.slice(i, j);
        sonAnlamli = '/';
        i = j;
        continue;
      }
    }
    cikti += c;
    if (!/\s/.test(c)) sonAnlamli = c;
    i++;
  }
  /* Boşalan satırları ve satır sonu boşluklarını topla. */
  return cikti.replace(/[ \t]+$/gm, '').replace(/\n{2,}/g, '\n');
}

function cssYorumSil(kaynak) {
  let cikti = '';
  let i = 0;
  const n = kaynak.length;
  while (i < n) {
    const c = kaynak[i];
    if (c === '"' || c === "'") {
      let j = i + 1;
      while (j < n && kaynak[j] !== c) { if (kaynak[j] === '\\') j++; j++; }
      cikti += kaynak.slice(i, j + 1);
      i = j + 1;
      continue;
    }
    if (c === '/' && kaynak[i + 1] === '*') {
      const son = kaynak.indexOf('*/', i + 2);
      i = son < 0 ? n : son + 2;
      continue;
    }
    cikti += c;
    i++;
  }
  return cikti.replace(/[ \t]+$/gm, '').replace(/\n{2,}/g, '\n');
}

/* Güvenli sarmalayıcı: sonuç JS olarak derlenmiyorsa orijinal döner. */
function kucultKontrollu(kaynak, tur) {
  if (process.env.EE_ACIK_KAYNAK === '1') return kaynak;
  try {
    if (tur === 'css') return cssYorumSil(kaynak);
    const sonuc = jsYorumSil(kaynak);
    new vm.Script(sonuc);   // yalnızca derlenir, çalıştırılmaz
    return sonuc;
  } catch (e) {
    console.error('  Uyarı: ' + tur + ' yorumları atılamadı (' + e.message + '); yorumlu hâli gönderiliyor.');
    return kaynak;
  }
}

module.exports = { jsYorumSil, cssYorumSil, kucultKontrollu };
