'use strict';
/* HTTP yardımcıları.
   JSON cevap (ok/bad), istek gövdesi okuma, güvenlik başlıkları,
   gzip/brotli sıkıştırma, statik dosya servisi ve bellek önbelleği. */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const zlib = require('zlib');
const { govdeTemizle } = require('./ortak');
const { kucultKontrollu } = require('./yardimci/kucult');
const { PUB } = require('./yollar');

function baslikEkle(hedef) {
  for (const k in GUVENLIK_BASLIKLARI) hedef[k] = GUVENLIK_BASLIKLARI[k];
  return hedef;
}

/* ============ sıkıştırma ve önbellek ============

   Arayüz dosyaları toplam ~300 KB; gzip ile ~70 KB'a iniyor. Telefon
   bağlantısında bu, açılışın saniyelerce beklemesiyle anında açılması
   arasındaki fark. Statik dosyalar çalışma sırasında değişmediği için
   bir kez sıkıştırılıp bellekte tutuluyor. */

const SIKISTIRMA_ESIGI = 1024;   // bu boyutun altını sıkıştırmaya değmez
const SIKISTIRILABILIR = /^(text\/|application\/(javascript|json|manifest))/;

/* Tarayıcı hangi sıkıştırmayı kabul ediyor? */
function kodlamaSec(req) {
  const kabul = String((req && req.headers && req.headers['accept-encoding']) || '')
    .toLowerCase();
  if (kabul.indexOf('br') >= 0) return 'br';
  if (kabul.indexOf('gzip') >= 0) return 'gzip';
  return '';
}

/* ============ birleşik dosyalar ============
   Arayüz kodu geliştirirken parçalar hâlinde durur (public/js/parcalar/,
   public/css/parcalar/); tarayıcıya tek dosya gider. Derleyici yok: sunucu
   parçaları ad sırasıyla (00-, 01-, ...) birleştirir, biri değişince
   yeniden okur. Hangi parçanın nerede başladığı çıktıya yorum olarak
   yazılır ki tarayıcı hata verirse satır bulunabilsin. */
const BIRLESIK = {
  [path.join(PUB, 'js', 'app.js')]: {
    klasor: path.join(PUB, 'js', 'parcalar'), uzanti: '.js',
    bas: "(function () {\n  'use strict';\n", son: "\n})();\n",
    ayrac: ad => '\n/* ==== parcalar/' + ad + ' ==== */\n'
  },
  [path.join(PUB, 'css', 'style.css')]: {
    klasor: path.join(PUB, 'css', 'parcalar'), uzanti: '.css',
    bas: '', son: '',
    ayrac: ad => '\n/* ==== parcalar/' + ad + ' ==== */\n'
  }
};
const BIRLESIK_KONTROL_MS = 1000;   // parça değişti mi diye en sık bu aralıkla bakılır

function birlesikOku(tamYol, tanim, geri) {
  const eski = statikOnbellek.get(tamYol);
  if (eski && Date.now() - eski.sonKontrol < BIRLESIK_KONTROL_MS) return geri(null, eski);
  let adlar;
  try {
    adlar = fs.readdirSync(tanim.klasor).filter(a => a.endsWith(tanim.uzanti)).sort();
  } catch (e) { return geri(e); }
  if (!adlar.length) return geri(new Error('parça yok: ' + tanim.klasor));

  const imza = adlar.map(a => {
    const st = fs.statSync(path.join(tanim.klasor, a));
    return a + ':' + st.mtimeMs + ':' + st.size;
  }).join('|');
  if (eski && eski.imza === imza) { eski.sonKontrol = Date.now(); return geri(null, eski); }

  const parcalar = adlar.map(a => tanim.ayrac(a) + fs.readFileSync(path.join(tanim.klasor, a), 'utf8'));
  /* Tarayıcıya yorumsuz gider (bkz. yardimci/kucult.js). */
  const metin = kucultKontrollu(tanim.bas + parcalar.join('\n') + tanim.son, tanim.uzanti === '.js' ? 'js' : 'css');
  const veri = Buffer.from(metin, 'utf8');
  const kayit = onbellekKaydi(veri, MIME[tanim.uzanti], imza);
  kayit.sonKontrol = Date.now();
  statikOnbellek.set(tamYol, kayit);
  geri(null, kayit);
}

function statikOku(tamYol, geri) {
  if (BIRLESIK[tamYol]) {
    /* Parça klasörü yoksa (eski düzen, tek dosya) düz dosyaya düşülür. */
    return birlesikOku(tamYol, BIRLESIK[tamYol], (hata, kayit) => {
      if (!hata) return geri(null, kayit);
      duzDosyaOku(tamYol, geri);
    });
  }
  duzDosyaOku(tamYol, geri);
}

function duzDosyaOku(tamYol, geri) {
  fs.stat(tamYol, (hata, st) => {
    if (hata) return geri(hata);
    const imza = st.mtimeMs + ':' + st.size;
    const eski = statikOnbellek.get(tamYol);
    if (eski && eski.imza === imza) return geri(null, eski);

    fs.readFile(tamYol, (hata2, veri) => {
      if (hata2) return geri(hata2);
      const tur = MIME[path.extname(tamYol).toLowerCase()] || 'application/octet-stream';
      const kayit = onbellekKaydi(veri, tur, imza);
      statikOnbellek.set(tamYol, kayit);
      geri(null, kayit);
    });
  });
}

function sendJSON(res, code, obj) {
  let body = Buffer.from(JSON.stringify(obj), 'utf8');
  const baslik = {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store'
  };

  /* Küçük yanıtlarda sıkıştırma kazançtan çok işlemci harcar. */
  if (body.length > SIKISTIRMA_ESIGI) {
    const kod = kodlamaSec(res.req);
    try {
      if (kod === 'br') {
        body = zlib.brotliCompressSync(body, {
          params: { [zlib.constants.BROTLI_PARAM_QUALITY]: 4 }
        });
        baslik['Content-Encoding'] = 'br';
      } else if (kod === 'gzip') {
        body = zlib.gzipSync(body, { level: 6 });
        baslik['Content-Encoding'] = 'gzip';
      }
      if (baslik['Content-Encoding']) baslik['Vary'] = 'Accept-Encoding';
    } catch (e) {
      /* Sıkıştırılamadıysa ham gönder. */
    }
  }

  baslik['Content-Length'] = body.length;
  res.writeHead(code, baslikEkle(baslik));
  res.end(body);
}
const ok = (res, obj) => sendJSON(res, 200, obj === undefined ? { ok: true } : obj);
const bad = (res, msg, code) => sendJSON(res, code || 400, { error: msg });

