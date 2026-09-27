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
   yazılır ki tarayıcı hata verirse satır bulunabilsin.

   Yönetim ön yüzü (sistem yöneticisinin ekranları) public/js/yonetim/
   klasöründedir ve herkese giden /js/app.js'e GİRMEZ. Yalnız geçerli yönetici
   çereziyle /admin/yonetim.js adresinden gider: public/js/parcalar/ ile
   public/js/yonetim/ parçaları dosya adına göre tek sırada, tek IIFE içinde
   birleşir (yönetim parçaları uygulamanın bütün işlevlerini ve SAYFALAR,
   EYLEMLER tablolarını görür). İki klasörde aynı adlı parça olmamalı. */
const JS_PARCA = path.join(PUB, 'js', 'parcalar');
const YONETIM_PARCA = path.join(PUB, 'js', 'yonetim');
const JS_BAS = "(function () {\n  'use strict';\n", JS_SON = "\n})();\n";
const BIRLESIK = {
  [path.join(PUB, 'js', 'app.js')]: {
    klasorler: [{ yol: JS_PARCA, onek: 'parcalar/' }], uzanti: '.js', bas: JS_BAS, son: JS_SON
  },
  [path.join(PUB, 'css', 'style.css')]: {
    klasorler: [{ yol: path.join(PUB, 'css', 'parcalar'), onek: 'parcalar/' }], uzanti: '.css', bas: '', son: ''
  }
};
/* Yönetim paketi: public/ altında bir dosya adı değildir (statik yoldan hiç
   okunamaz); yalnız yonetimSun() verir. Yönetim klasörü henüz yoksa paket
   yalnız uygulama parçalarından oluşur. */
const YONETIM_JS_ANAHTAR = 'yonetim:/admin/yonetim.js';
const YONETIM_JS = {
  klasorler: [{ yol: JS_PARCA, onek: 'parcalar/' }, { yol: YONETIM_PARCA, onek: 'yonetim/', istege: true }],
  uzanti: '.js', bas: JS_BAS, son: JS_SON
};
const BIRLESIK_KONTROL_MS = 1000;   // parça değişti mi diye en sık bu aralıkla bakılır

function birlesikOku(anahtar, tanim, geri) {
  const eski = statikOnbellek.get(anahtar);
  if (eski && Date.now() - eski.sonKontrol < BIRLESIK_KONTROL_MS) return geri(null, eski);
  const dosyalar = [];
  for (let i = 0; i < tanim.klasorler.length; i++) {
    const k = tanim.klasorler[i];
    let adlar;
    try {
      adlar = fs.readdirSync(k.yol).filter(a => a.endsWith(tanim.uzanti));
    } catch (e) {
      if (k.istege && e.code === 'ENOENT') continue;
      return geri(e);
    }
    for (const ad of adlar) dosyalar.push({ ad, sira: i, yol: path.join(k.yol, ad), onek: k.onek });
  }
  if (!dosyalar.length) return geri(new Error('parça yok: ' + tanim.klasorler.map(k => k.yol).join(', ')));
  /* Ad sırası (klasörler arası da); aynı ad iki klasörde varsa önce uygulama parçası. */
  dosyalar.sort((a, b) => (a.ad < b.ad ? -1 : a.ad > b.ad ? 1 : a.sira - b.sira));

  const imza = dosyalar.map(d => {
    const st = fs.statSync(d.yol);
    return d.onek + d.ad + ':' + st.mtimeMs + ':' + st.size;
  }).join('|');
  if (eski && eski.imza === imza) { eski.sonKontrol = Date.now(); return geri(null, eski); }

  const parcalar = dosyalar.map(d => '\n/* ==== ' + d.onek + d.ad + ' ==== */\n' + fs.readFileSync(d.yol, 'utf8'));
  /* Tarayıcıya yorumsuz gider (bkz. yardimci/kucult.js). */
  const metin = kucultKontrollu(tanim.bas + parcalar.join('\n') + tanim.son, tanim.uzanti === '.js' ? 'js' : 'css');
  const veri = Buffer.from(metin, 'utf8');
  const kayit = onbellekKaydi(veri, MIME[tanim.uzanti], imza);
  kayit.sonKontrol = Date.now();
  statikOnbellek.set(anahtar, kayit);
  geri(null, kayit);
}

/* /admin/yonetim.js: uygulama + yönetim parçaları (yalnız yonetimSun verir). */
function yonetimJsOku(geri) { birlesikOku(YONETIM_JS_ANAHTAR, YONETIM_JS, geri); }

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
  /* Geçersiz yol (ör. içinde boş bayt) fs.stat'ta geri çağrıya değil, anında hata
     olarak atılır; yakalanmazsa süreç düşer. Burada "dosya yok" gibi geri döner. */
  try {
    fs.stat(tamYol, statBitti);
  } catch (e) {
    return geri(e);
  }
  function statBitti(hata, st) {
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
  }
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

const PARCA_KLASORLERI = [JS_PARCA, YONETIM_PARCA, path.join(PUB, 'css', 'parcalar')].map(k => k.toLowerCase());
/* Gizli yönetim paneli: /admin ve altı (bkz. yonetimSun). */
const YONETIM_KLASORU = path.join(PUB, 'admin').toLowerCase();
const YONETIM_JS_YOLU = path.join(PUB, 'admin', 'yonetim.js').toLowerCase();
/* Belge dosyası (.md) adresi; bkz. serveStatic. */
const BELGE_DOSYASI = /\.md[\s.]*(?::.*)?[\s.\\/]*$/;

/* Tek sayfalık uygulamanın (index.html) açtığı adresler: açılış, giriş (/login, /giris),
   kayıt (/signup, /kayit), Hakkında (/hakkinda, /about), SSS (/sss/sss.html) ve okul
   sayfası (/school/<okul>). Bunların dışında dosyası olmayan her adres "Sayfa bulunamadı" (404) olur. */
const UYGULAMA_YOLLARI = new Set(['', 'index.html', 'login', 'giris', 'signup', 'kayit', 'hakkinda', 'about', 'sss/sss.html']);
const OKUL_YOLU = /^school\/([a-z0-9](?:[a-z0-9-]{0,38}[a-z0-9])?)$/;

function sadeYol(rel) { return String(rel).replace(/^\/+|\/+$/g, '').toLowerCase(); }

/* Sayfaların asıl adresi klasörlüdür (egitimevi.org/kvkk/kvkk.html); kısa ve eski
   adresler oraya kalıcı olarak (301) yönlenir. Anahtar: baştaki ve sondaki "/"
   atılmış, küçük harfli yol. Asıl adresin kendisi de listede: büyük harfle ya da
   sonunda "/" ile yazılırsa asıl yazılışına döner (Linux'ta dosya adı harf duyarlı). */
const YONLENDIRMELER = {
  'kvkk': '/kvkk/kvkk.html', 'kvkk.html': '/kvkk/kvkk.html', 'kvkk/kvkk.html': '/kvkk/kvkk.html',
  'kosullar': '/kosullar/kosullar.html', 'kosullar.html': '/kosullar/kosullar.html',
  'kosullar/kosullar.html': '/kosullar/kosullar.html',
  'indir': '/indir/indir.html', 'indir.html': '/indir/indir.html', 'download': '/indir/indir.html',
  'indir/indir.html': '/indir/indir.html',
  'sss': '/sss/sss.html', 'faq': '/sss/sss.html', 'sss/sss.html': '/sss/sss.html'
};

/* Tablodaki anahtar. Harf farkı Türkçe İ/ı için de önemsiz: 'İ'.toLowerCase() "i"
   değil "i" + U+0307 (birleşik nokta) verir; Caps Lock açıkken Türkçe klavyeyle yazılan "İNDİR"
   ya da "ındır" da /indir/indir.html'e gitsin. */
function yonlendirmeAnahtari(rel) { return sadeYol(rel).replace(/i\u0307/g, 'i').replace(/ı/g, 'i'); }

/* Yönlendirilecek adres ya da ''. Location yalnız tablodaki sabit yoldur; kullanıcının
   yazdığından yalnız "?" sonrası eklenir, o da yalnız görünür ASCII ise (boşluk, CR/LF
   ya da başka denetim karakteri varsa sorgu atılır; başlığa satır eklenemez). */
function yonlendirmeAdresi(req, rel) {
  const y = yonlendirmeAnahtari(rel);
  if (!Object.prototype.hasOwnProperty.call(YONLENDIRMELER, y)) return '';
  const hedef = YONLENDIRMELER[y];
  if (rel === hedef) return '';   // zaten asıl adres
  const ham = String(req.url || '');
  const soru = ham.indexOf('?');
  const sorgu = soru >= 0 ? ham.slice(soru + 1) : '';
  return sorgu && /^[\x21-\x7e]+$/.test(sorgu) ? hedef + '?' + sorgu : hedef;
}

function yonlendir(res, hedef) {
  const govde = 'Taşındı: ' + hedef;
  res.writeHead(301, baslikEkle({
    'Location': hedef,
    'Content-Type': 'text/plain; charset=utf-8',
    'Content-Length': Buffer.byteLength(govde),
    'Cache-Control': 'public, max-age=86400'
  }));
  res.end(govde);
}

function uygulamaYoluMu(rel) {
  const y = sadeYol(rel);
  return UYGULAMA_YOLLARI.has(y) || OKUL_YOLU.test(y);
}

/* /school/<okul>: okul gerçekten var mı (yalnız onaylı okul). Sonuç 30 saniye
   bellekte kalır; veritabanına ulaşılamazsa uygulama açılır (sayfa kendisi söyler). */
const okulOnbellek = new Map();   // kısa ad -> { var, zaman }
/* Okul adresi değişince (müdür ya da yönetici) eski adres hemen "Okul bulunamadı" olsun. */
function okulOnbellekBosalt() { okulOnbellek.clear(); }
async function okulVarMi(kisa) {
  const k = okulOnbellek.get(kisa);
  if (k && Date.now() - k.zaman < 30 * 1000) return k.var;
  const { depo } = require('./veri');
  const var_ = !!(await depo.okullar.kisaAdla(kisa));
  if (okulOnbellek.size > 2000) okulOnbellek.clear();
  okulOnbellek.set(kisa, { var: var_, zaman: Date.now() });
  return var_;
}

/* "Sayfa bulunamadı" (404.html) cevabı. Bilinmeyen her adres, gizli dosyalar,
   ön yüz parçaları, belgeler (.md) ve çerezsiz /admin aynı yoldan geçer: durum, başlıklar
   (ETag dahil) ve gövde bayt bayt aynıdır; dizin tarayıcıları farkı göremez. */
function bulunamadi(req, res) {
  statikOku(path.join(PUB, '404.html'), (e, kabuk) => {
    if (e) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      return res.end('Bulunamadı');
    }
    htmlSurumle(kabuk, k => statikGonder(req, res, k, 404));
  });
}

/* Dosyadan sunulan adreslerin "bulunamadı"sı. İstek biçimi geçerli bir yönetim
   çerezi (ee_yonetim=<64 hex>) taşıyorsa, /admin'de olduğu gibi çerez veritabanında
   aranır, sonra 404 verilir: uydurma çerezle /admin veritabanına gidip bilinmeyen
   adres gitmeseydi yanıt süresi farkı /admin'i ele verirdi. Çerezsiz istek (tarayıcı,
   dizin tarayıcısı) iki yolda da veritabanına gitmez. Bkz. yonetimSun. */
function bulunamadiCerezli(req, res) {
  const cerez = require('./yonetim-cerezi');
  if (!cerez.cerezDegeri(req)) return bulunamadi(req, res);
  cerez.gecerliMi(req).catch(() => false).then(() => bulunamadi(req, res));
}

function serveStatic(req, res, urlPath) {
  let rel;
  try { rel = decodeURIComponent(urlPath.split('?')[0]); } catch (e) { rel = '/'; }
  /* Boş bayt (%00) hiçbir dosyanın adında olamaz; dosya yoluna girerse fs anında hata
     atar ve yakalanmazsa sunucu düşer. Böyle adres doğrudan "bulunamadı". */
  if (rel.indexOf('\0') >= 0) return bulunamadiCerezli(req, res);
  if (rel === '/' || rel === '') rel = '/index.html';
  /* Kısa ve eski adresler (/kvkk, /kvkk.html, /indir, /download, /sss, /faq ...) asıl
     adrese yönlenir; yalnız GET ve HEAD (öbürleri buraya zaten gelmez). */
  if (req.method === 'GET' || req.method === 'HEAD') {
    const hedef = yonlendirmeAdresi(req, rel);
    if (hedef) return yonlendir(res, hedef);
  }
  /* "_" ile başlayan geliştirme dosyaları (ör. yerel deneme sayfası) ve
     nokta ile başlayan gizli dosyalar hiç sunulmaz (.well-known hariç). */
  if (/(^|[\\/])(_|\.(?!well-known[\\/]))/.test(rel)) return bulunamadiCerezli(req, res);
  const full = path.join(PUB, path.normalize(rel).replace(/^(\.\.[\\/])+/, ''));
  /* Sadece startsWith(PUB) yetmez: "public" ile "publicgizli" de eslesirdi. */
  if (full !== PUB && !full.startsWith(PUB + path.sep)) return bad(res, 'Yasak', 403);
  /* Ön yüz parçaları (public/js/parcalar, public/css/parcalar) tarayıcıya tek tek
     gitmez: yalnızca yorumları atılmış birleşik /js/app.js ve /css/style.css gider. */
  const kucuk = full.toLowerCase();
  if (PARCA_KLASORLERI.some(k => kucuk === k || kucuk.startsWith(k + path.sep))) return bulunamadiCerezli(req, res);
  /* Gizli yönetim paneli: /admin ve altındaki hiçbir adres dosyadan okunmaz. Bilinmeyen
     adres aşağıda önce diske bakar (fs.stat, dosya yok); /admin de aynı yoklamayı yapar
     (sonucu kullanılmaz): yoksa diske hiç gitmeyen /admin, yanıt süresiyle bilinmeyen
     bir adresten ayırt edilirdi. */
  if (kucuk === YONETIM_KLASORU || kucuk.startsWith(YONETIM_KLASORU + path.sep)) {
    return fs.stat(full, () => yonetimSun(req, res, kucuk));
  }
  /* Belgeler (.md): kod dosyalarının yanındaki açıklamalar yalnız depoda okunur, web'den
     hiç sunulmaz (dosya diskte olsa da bilinmeyen adresle aynı 404). Sondaki nokta, boşluk,
     "/" ve Windows'un "::$DATA" eki de aynı dosyayı açtığı için onlar da sayılır. */
  if (BELGE_DOSYASI.test(kucuk)) return bulunamadiCerezli(req, res);
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
      return uygulamaYoluMu(rel) ? gonder('index.html', 0) : bulunamadiCerezli(req, res);
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

/* ============ gizli yönetim paneli (/admin) ============
   Geçerli yönetici çerezi (yonetim-cerezi.js) varsa:
     /admin/yonetim.js   yönetim paketi (uygulama + yönetim parçaları)
     /admin, /admin/...  yönetim kabuğu: index.html, /js/app.js yerine /admin/yonetim.js ile
   Yoksa bilinmeyen bir adresle BAYT BAYT aynı 404 (bulunamadi). Çerez yoksa
   ya da biçimsizse veritabanına gidilmez; biçimliyse bilinmeyen adres de aynı
   aramayı yapar (bulunamadiCerezli), süre farkı kalmaz. Cevaplar önbelleğe
   alınmaz ve arama motorlarına kapalıdır. */
let yonetimKabukKaydi = null;

function yonetimKabugu(geri) {
  statikOku(path.join(PUB, 'index.html'), (e, html) => {
    if (e) return geri(e);
    htmlSurumle(html, surumlu => yonetimJsOku((e2, js) => {
      if (e2) return geri(e2);
      const imza = surumlu.etag + '|' + js.etag;
      if (yonetimKabukKaydi && yonetimKabukKaydi.imza === imza) return geri(null, yonetimKabukKaydi);
      const adres = '"/admin/yonetim.js?v=' + js.etag.replace(/"/g, '') + '"';
      const metin = surumlu.veri.toString('utf8').replace(/"\/js\/app\.js(?:\?v=[^"]*)?"/g, adres);
      yonetimKabukKaydi = onbellekKaydi(Buffer.from(metin, 'utf8'), surumlu.tur, imza);
      geri(null, yonetimKabukKaydi);
    }));
  });
}

function yonetimGonder(req, res, kayit) {
  const baslik = {
    'Content-Type': kayit.tur,
    'Cache-Control': 'no-store',
    'X-Robots-Tag': 'noindex, nofollow'
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

function yonetimSun(req, res, kucukYol) {
  const cerez = require('./yonetim-cerezi');
  if (!cerez.cerezDegeri(req)) return bulunamadi(req, res);
  cerez.gecerliMi(req).then(gecerli => {
    if (!gecerli) return bulunamadi(req, res);
    const oku = kucukYol === YONETIM_JS_YOLU ? yonetimJsOku : yonetimKabugu;
    oku((e, kayit) => (e ? bulunamadi(req, res) : yonetimGonder(req, res, kayit)));
  }).catch(e => {
    console.error('Yönetim çerezi denetlenemedi:', e.message);
    bulunamadi(req, res);
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
  statikGonder,
  bulunamadi,
  okulOnbellekBosalt,
  yonetimJsOku
};
