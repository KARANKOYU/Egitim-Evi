'use strict';
/* HTTP yardımcıları.
   JSON cevap (ok/bad), istek gövdesi okuma, güvenlik başlıkları,
   gzip/brotli sıkıştırma, statik dosya servisi ve bellek önbelleği. */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const zlib = require('zlib');
const { govdeTemizle } = require('./ortak');
const { PUB } = require('./yollar');

/* ============ http yardımcıları ============ */
/* Her yanitta gonderilen guvenlik basliklari.
   CSP: sayfa yalnizca kendi sunucusundan betik/stil yukler, disari veri gonderemez.
   Satir ici style="" nitelikleri kullanildigi icin style-src'de unsafe-inline var;
   script-src'de YOK, yani enjekte edilen bir <script> calismaz. */
const GUVENLIK_BASLIKLARI = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'no-referrer',
  'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Cross-Origin-Resource-Policy': 'same-origin',
  'Content-Security-Policy': [
    "default-src 'self'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "object-src 'none'",
    "img-src 'self' data:",
    "font-src 'self' data:",
    "style-src 'self' 'unsafe-inline'",
    "script-src 'self'",
    "worker-src 'self'",
    "manifest-src 'self'",
    "connect-src 'self'"
  ].join('; ')
};

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

/* Statik dosya önbelleği: dosya yolu -> { veri, gzip, br, etag, tur } */
const statikOnbellek = new Map();

function statikOku(tamYol, geri) {
  fs.stat(tamYol, (hata, st) => {
    if (hata) return geri(hata);
    const imza = st.mtimeMs + ':' + st.size;
    const eski = statikOnbellek.get(tamYol);
    if (eski && eski.imza === imza) return geri(null, eski);

    fs.readFile(tamYol, (hata2, veri) => {
      if (hata2) return geri(hata2);
      const tur = MIME[path.extname(tamYol).toLowerCase()] || 'application/octet-stream';
      const kayit = {
        imza: imza, veri: veri, tur: tur,
        etag: '"' + crypto.createHash('sha1').update(veri).digest('hex').slice(0, 20) + '"',
        gzip: null, br: null
      };
      if (SIKISTIRILABILIR.test(tur) && veri.length > SIKISTIRMA_ESIGI) {
        try {
          kayit.gzip = zlib.gzipSync(veri, { level: 6 });
          kayit.br = zlib.brotliCompressSync(veri, {
            params: { [zlib.constants.BROTLI_PARAM_QUALITY]: 5 }
          });
        } catch (e) {
          /* Sıkıştırma başarısız olursa ham hâli gönderilir, sorun değil. */
        }
      }
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

function readBody(req) {
  return new Promise((resolve, reject) => {
    let size = 0; const chunks = [];
    req.on('data', c => {
      size += c.length;
      if (size > 2e6) {
        /* Bağlantıyı hemen koparırsak istemci "413" yanıtını göremeden
           ağ hatası alıyor. Akışı durdurup yanıtın yazılmasına fırsat
           veriyoruz, sonra kapatıyoruz. */
        const e = new Error('İstek çok büyük');
        e.kod = 413;
        reject(e);
        try { req.pause(); } catch (x) { /* yoksay */ }
        setTimeout(() => { try { req.destroy(); } catch (x) { /* yoksay */ } }, 1500);
        return;
      }
      chunks.push(c);
    });
    req.on('end', () => {
      const raw = Buffer.concat(chunks).toString('utf8');
      if (!raw) return resolve({});
      try { resolve(govdeTemizle(JSON.parse(raw))); } catch (e) { reject(new Error('Geçersiz veri gönderildi')); }
    });
    req.on('error', reject);
  });
}

const MIME = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.webp': 'image/webp', '.ico': 'image/x-icon', '.woff2': 'font/woff2',
  '.webmanifest': 'application/manifest+json'
};

function serveStatic(req, res, urlPath) {
  let rel;
  try { rel = decodeURIComponent(urlPath.split('?')[0]); } catch (e) { rel = '/'; }
  if (rel === '/' || rel === '') rel = '/index.html';
  const full = path.join(PUB, path.normalize(rel).replace(/^(\.\.[\\/])+/, ''));
  /* Sadece startsWith(PUB) yetmez: "public" ile "publicgizli" de eslesirdi. */
  if (full !== PUB && !full.startsWith(PUB + path.sep)) return bad(res, 'Yasak', 403);
  statikOku(full, (err, kayit) => {
    /* Dosya yoksa tek sayfalık uygulamanın kabuğunu döndür — adres
       çubuğuna doğrudan #/sayfa yazılınca da açılsın. */
    if (err) {
      return statikOku(path.join(PUB, 'index.html'), (e2, kabuk) => {
        if (e2) {
          res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
          return res.end('Bulunamadı');
        }
        statikGonder(req, res, kabuk);
      });
    }
    statikGonder(req, res, kayit);
  });
}

function statikGonder(req, res, kayit) {
  /* Tarayıcıda aynı sürüm varsa gövdeyi hiç göndermiyoruz. */
  if (req.headers['if-none-match'] === kayit.etag) {
    res.writeHead(304, baslikEkle({
      'ETag': kayit.etag,
      'Cache-Control': 'no-cache'
    }));
    return res.end();
  }

  const baslik = {
    'Content-Type': kayit.tur,
    'Cache-Control': 'no-cache',
    'ETag': kayit.etag
  };

  let govde = kayit.veri;
  const kod = kodlamaSec(req);
  if (kod === 'br' && kayit.br) { govde = kayit.br; baslik['Content-Encoding'] = 'br'; }
  else if (kod === 'gzip' && kayit.gzip) { govde = kayit.gzip; baslik['Content-Encoding'] = 'gzip'; }
  if (baslik['Content-Encoding']) baslik['Vary'] = 'Accept-Encoding';

  baslik['Content-Length'] = govde.length;
  res.writeHead(200, baslikEkle(baslik));
  res.end(govde);
}


module.exports = {
  GUVENLIK_BASLIKLARI,
  baslikEkle,
  SIKISTIRMA_ESIGI,
  SIKISTIRILABILIR,
  kodlamaSec,
  statikOnbellek,
  statikOku,
  sendJSON,
  ok,
  bad,
  readBody,
  MIME,
  serveStatic,
  statikGonder
};
