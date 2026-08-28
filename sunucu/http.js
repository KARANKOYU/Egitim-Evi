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

/* JSON gövdesi en fazla 2 MB ve 30 saniyede gelmeli. Sunucunun genel istek
   süresi dosya yüklemeleri için uzun tutuldu; yavaş gönderilen JSON bağlantıyı
   o kadar meşgul etmesin. */
const GOVDE_SURESI_MS = 30 * 1000;

function readBody(req) {
  return new Promise((resolve, reject) => {
    let size = 0; const chunks = [];
    const sure = setTimeout(() => {
      const e = new Error('İstek zaman aşımına uğradı');
      e.kod = 408;
      reject(e);
      setTimeout(() => { try { req.destroy(); } catch (x) { /* yoksay */ } }, 1500);
    }, GOVDE_SURESI_MS);
    req.on('end', () => clearTimeout(sure));
    req.on('error', () => clearTimeout(sure));
    req.on('close', () => clearTimeout(sure));
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
  /* "_" ile başlayan geliştirme dosyaları (ör. yerel deneme sayfası) ve
     nokta ile başlayan gizli dosyalar hiç sunulmaz (.well-known hariç). */
  if (/(^|[\\/])(_|\.(?!well-known[\\/]))/.test(rel)) {
    res.writeHead(404, baslikEkle({ 'Content-Type': 'text/plain; charset=utf-8' }));
    return res.end('Bulunamadı');
  }
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
        htmlSurumle(kabuk, k => statikGonder(req, res, k));
      });
    }
    if (kayit.tur.indexOf('text/html') === 0) return htmlSurumle(kayit, k => statikGonder(req, res, k));
    statikGonder(req, res, kayit);
  });
}

/* ============ sürümlü adresler ============
   HTML içindeki /css/style.css, /js/app.js, /js/tema.js adreslerine o
   dosyanın ETag'i eklenir: /js/app.js?v=abc123. Tarayıcı bu adresi bir yıl
   saklar; dosya değişince ETag değişir, adres değişir, yenisi iner. Böylece
   ikinci açılışta yalnızca HTML sorulur (304), betik ve stil hiç sorulmaz. */
const SURUMLU = ['/css/style.css', '/js/app.js', '/js/tema.js'];
const surumluOnbellek = new Map();   // html etag + varlık etag'leri -> kayıt

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
