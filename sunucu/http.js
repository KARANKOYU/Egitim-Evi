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

/* ============ http yardımcıları ============ */
/* Her yanitta gonderilen guvenlik basliklari.
   CSP: sayfa yalnizca kendi sunucusundan betik/stil yukler, disari veri gonderemez.
   Satir ici style="" nitelikleri kullanildigi icin style-src'de unsafe-inline var;
   script-src'de YOK, yani enjekte edilen bir <script> calismaz.
   Harita dosemeleri (resim) yalnizca OpenStreetMap'ten gelir. Konum izni
   yalnizca bu sitenin kendisine acik (servisci seferi); baska site ya da
   cerceve konum isteyemez. */
const GUVENLIK_BASLIKLARI = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'no-referrer',
  'Permissions-Policy': 'geolocation=(self), microphone=(), camera=(), payment=(), usb=()',
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Cross-Origin-Resource-Policy': 'same-origin',
  'Content-Security-Policy': [
    "default-src 'self'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "object-src 'none'",
    "img-src 'self' data: https://tile.openstreetmap.org",
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

/* Önbellek kaydı: ETag hesaplanır, sıkıştırılabilir türler bir kez gzip ve
   brotli ile sıkıştırılıp bellekte tutulur. */
function onbellekKaydi(veri, tur, imza) {
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
  return kayit;
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

const PARCA_KLASORLERI = [path.join(PUB, 'js', 'parcalar'), path.join(PUB, 'css', 'parcalar')].map(k => k.toLowerCase());

/* Tek sayfalık uygulamanın (index.html) açtığı adresler: açılış, giriş (/login, /giris),
   kayıt (/signup, /kayit), Hakkında (/about), SSS (/faq) ve okul sayfası (/school/<okul>).
   Bunların dışında dosyası olmayan her adres "Sayfa bulunamadı" (404) olur. */
const UYGULAMA_YOLLARI = new Set(['', 'index.html', 'login', 'giris', 'signup', 'kayit', 'hakkinda', 'about', 'sss', 'faq']);
const OKUL_YOLU = /^school\/([a-z0-9](?:[a-z0-9-]{0,38}[a-z0-9])?)$/;

function sadeYol(rel) { return String(rel).replace(/^\/+|\/+$/g, '').toLowerCase(); }

function uygulamaYoluMu(rel) {
  const y = sadeYol(rel);
  return UYGULAMA_YOLLARI.has(y) || OKUL_YOLU.test(y);
}

/* /school/<okul>: okul gerçekten var mı (yalnız onaylı okul). Sonuç 30 saniye
   bellekte kalır; veritabanına ulaşılamazsa uygulama açılır (sayfa kendisi söyler). */
const okulOnbellek = new Map();   // kısa ad -> { var, zaman }
async function okulVarMi(kisa) {
  const k = okulOnbellek.get(kisa);
  if (k && Date.now() - k.zaman < 30 * 1000) return k.var;
  const { depo } = require('./veri');
  const var_ = !!(await depo.okullar.kisaAdla(kisa));
  if (okulOnbellek.size > 2000) okulOnbellek.clear();
  okulOnbellek.set(kisa, { var: var_, zaman: Date.now() });
  return var_;
}

function serveStatic(req, res, urlPath) {
  let rel;
  try { rel = decodeURIComponent(urlPath.split('?')[0]); } catch (e) { rel = '/'; }
  if (rel === '/' || rel === '') rel = '/index.html';
  /* Android uygulamasının indirme sayfası: egitimevi.org/indir (ya da /download). */
  if (/^\/(indir|download)\/?$/i.test(rel)) rel = '/indir.html';
  /* "_" ile başlayan geliştirme dosyaları (ör. yerel deneme sayfası) ve
     nokta ile başlayan gizli dosyalar hiç sunulmaz (.well-known hariç). */
  if (/(^|[\\/])(_|\.(?!well-known[\\/]))/.test(rel)) {
    res.writeHead(404, baslikEkle({ 'Content-Type': 'text/plain; charset=utf-8' }));
    return res.end('Bulunamadı');
  }
  const full = path.join(PUB, path.normalize(rel).replace(/^(\.\.[\\/])+/, ''));
  /* Sadece startsWith(PUB) yetmez: "public" ile "publicgizli" de eslesirdi. */
  if (full !== PUB && !full.startsWith(PUB + path.sep)) return bad(res, 'Yasak', 403);
  /* Ön yüz parçaları (public/js/parcalar, public/css/parcalar) tarayıcıya tek tek
     gitmez: yalnızca yorumları atılmış birleşik /js/app.js ve /css/style.css gider. */
  const kucuk = full.toLowerCase();
  if (PARCA_KLASORLERI.some(k => kucuk === k || kucuk.startsWith(k + path.sep))) {
    res.writeHead(404, baslikEkle({ 'Content-Type': 'text/plain; charset=utf-8' }));
    return res.end('Bulunamadı');
  }
  statikOku(full, (err, kayit) => {
    /* Dosya yoksa: uygulamanın adresiyse kabuğu (index.html); okul adresi ama
       böyle bir okul yoksa "Okul bulunamadı"; başka her şey "Sayfa bulunamadı" (404). */
    if (err) {
      const gonder = (dosya, durum) => statikOku(path.join(PUB, dosya), (e2, kabuk) => {
        if (e2) {
          res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
          return res.end('Bulunamadı');
        }
        htmlSurumle(kabuk, k => statikGonder(req, res, k, durum));
      });
      const okul = OKUL_YOLU.exec(sadeYol(rel));
      if (okul) {
        return okulVarMi(okul[1])
          .then(var_ => (var_ ? gonder('index.html', 0) : gonder('okul-bulunamadi.html', 404)))
          .catch(() => gonder('index.html', 0));
      }
      return uygulamaYoluMu(rel) ? gonder('index.html', 0) : gonder('404.html', 404);
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

function htmlSurumle(kayit, geri) {
  let kalan = SURUMLU.length;
  const etagler = {};
  let hata = false;
  SURUMLU.forEach(adres => {
    statikOku(path.join(PUB, adres.replace(/^\//, '').split('/').join(path.sep)), (e, k) => {
      if (e) hata = true; else etagler[adres] = k.etag.replace(/"/g, '');
      if (--kalan) return;
      if (hata) return geri(kayit);   // bir varlık okunamadıysa sayfayı olduğu gibi ver
      const anahtar = kayit.etag + '|' + SURUMLU.map(a => etagler[a]).join('|');
      const hazir = surumluOnbellek.get(anahtar);
      if (hazir) return geri(hazir);
      let metin = kayit.veri.toString('utf8');
      for (const adres of SURUMLU) {
        metin = metin.split('"' + adres + '"').join('"' + adres + '?v=' + etagler[adres] + '"');
      }
      const yeni = onbellekKaydi(Buffer.from(metin, 'utf8'), kayit.tur, anahtar);
      surumluOnbellek.clear();          // eski sürümler birikmesin
      surumluOnbellek.set(anahtar, yeni);
      geri(yeni);
    });
  });
}

function statikGonder(req, res, kayit, durum) {
  /* Tarayıcıda aynı sürüm varsa gövdeyi hiç göndermiyoruz (404 sayfası hariç). */
  if (!durum && req.headers['if-none-match'] === kayit.etag) {
    res.writeHead(304, baslikEkle({
      'ETag': kayit.etag,
      'Cache-Control': 'no-cache'
    }));
    return res.end();
  }

  /* Yazı tipi ve simgeler bir yıl önbellekte kalır: içerikleri değişmez,
     değişirse dosya adı değişir. Betik ve stil de adresinde kendi sürümünü
     (?v=ETag) taşıyorsa aynı şekilde kalıcı: HTML her açılışta sorulur ve
     içindeki adresler güncel sürümü gösterir, dosyalar hiç sorulmaz. */
  let surum = '';
  try { surum = new URL(req.url, 'http://x').searchParams.get('v') || ''; } catch (e) { /* yoksay */ }
  const kalici = /^(font\/|image\/)/.test(kayit.tur) || (surum && '"' + surum + '"' === kayit.etag);
  const baslik = {
    'Content-Type': kayit.tur,
    'Cache-Control': kalici ? 'public, max-age=31536000, immutable' : 'no-cache',
    'ETag': kayit.etag
  };

  let govde = kayit.veri;
  const kod = kodlamaSec(req);
  if (kod === 'br' && kayit.br) { govde = kayit.br; baslik['Content-Encoding'] = 'br'; }
  else if (kod === 'gzip' && kayit.gzip) { govde = kayit.gzip; baslik['Content-Encoding'] = 'gzip'; }
  if (baslik['Content-Encoding']) baslik['Vary'] = 'Accept-Encoding';

  baslik['Content-Length'] = govde.length;
  if (durum === 404) baslik['Cache-Control'] = 'no-store';
  res.writeHead(durum || 200, baslikEkle(baslik));
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
