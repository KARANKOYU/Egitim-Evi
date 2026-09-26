'use strict';
/* Sayfaların adresleri (sunucu gerekir):
   - asıl adresler klasörlü: /kvkk/kvkk.html, /kosullar/kosullar.html, /indir/indir.html,
     SSS için /sss/sss.html (tek sayfalık uygulama); 200 ve text/html;
   - kısa ve eski adresler (/kvkk, /kvkk.html, /indir, /download, /sss, /faq ...) 301 ile
     asıl adrese yönlenir; büyük/küçük harf (Türkçe İ/ı dahil) ve sondaki "/" fark etmez,
     sorgu dizesi korunur;
   - adreste boş bayt (%00) 404, sunucu düşmez;
   - SSS/Hakkında'dan giriş kartına geçince sekme başlığı "Eğitim Evi" olur;
   - Location her zaman sabit yol: "//evil.com" gibi girdi başka siteye yönlendiremez,
     %0d%0a başlığa satır ekleyemez; güvenlik başlıkları yönlendirmede de var;
   - tanınmayan adres 404, ön yüz parçaları hâlâ 404;
   - sayfalardaki bağlantılar asıl adresi gösterir, varlıklar mutlak yolla yüklenir. */
const http = require('http');
const net = require('net');
const { BASE } = require('./giris');

let gecti = 0, kaldi = 0;
function kontrol(ad, sart, detay) {
  if (sart) { gecti++; console.log('  GECTI  ' + ad); }
  else { kaldi++; console.log('  KALDI  ' + ad + (detay ? '  -> ' + detay : '')); }
}

const HEDEF = new URL(BASE);

/* Yönlendirmeyi izlemeden tek istek: durum, başlıklar, gövde. Yol olduğu gibi gider. */
function istek(yol, yontem) {
  return new Promise((coz, reddet) => {
    const r = http.request({ host: HEDEF.hostname, port: HEDEF.port, path: yol, method: yontem || 'GET',
      headers: { 'Accept-Encoding': 'identity' } }, cevap => {
      const parcalar = [];
      cevap.on('data', p => parcalar.push(p));
      cevap.on('end', () => coz({ durum: cevap.statusCode, baslik: cevap.headers,
        metin: Buffer.concat(parcalar).toString('utf8') }));
    });
    r.on('error', reddet);
    r.end();
  });
}

/* Ham istek satırı (http.request'in reddettiği baytlar için): cevabın başlık bölümü. */
function hamIstek(satir) {
  return new Promise(coz => {
    const s = net.connect(Number(HEDEF.port), HEDEF.hostname, () => {
      s.write(Buffer.concat([Buffer.from(satir, 'latin1'), Buffer.from(' HTTP/1.1\r\nHost: x\r\nConnection: close\r\n\r\n')]));
    });
    const parcalar = [];
    s.on('data', p => parcalar.push(p));
    s.on('error', () => coz(''));
    s.on('close', () => coz(Buffer.concat(parcalar).toString('latin1').split('\r\n\r\n')[0]));
    s.setTimeout(5000, () => s.destroy());
  });
}

const htmlMi = c => /^text\/html/.test(c.baslik['content-type'] || '');

(async () => {
  console.log('=== 1) ASIL ADRESLER ===');
  const asil = {
    '/kvkk/kvkk.html': /Aydınlatma/,
    '/kosullar/kosullar.html': /Kullanım koşulları/,
    '/indir/indir.html': /<h1>Eğitim Evi'ni indir<\/h1>/,
    '/sss/sss.html': /id="vSss"/
  };
  const sayfalar = {};
  for (const yol of Object.keys(asil)) {
    const c = await istek(yol);
    sayfalar[yol] = c.metin;
    kontrol(yol + ' 200, text/html ve doğru sayfa', c.durum === 200 && htmlMi(c) && asil[yol].test(c.metin),
      c.durum + ' ' + c.baslik['content-type']);
  }
  kontrol('/sss/sss.html tek sayfalık uygulama (giriş kartı ve SSS aynı sayfada)',
    /id="authWrap"/.test(sayfalar['/sss/sss.html']) && /id="vSss"/.test(sayfalar['/sss/sss.html']));
  const sorgulu = await istek('/kvkk/kvkk.html?x=1');
  kontrol('/kvkk/kvkk.html?x=1 200 (yönlenmez)', sorgulu.durum === 200 && htmlMi(sorgulu), sorgulu.durum);
  const bas = await istek('/indir/indir.html', 'HEAD');
  kontrol('HEAD /indir/indir.html 200', bas.durum === 200 && htmlMi(bas), bas.durum);

  console.log('=== 2) KISA VE ESKİ ADRESLER 301 ===');
  const yonlenen = {
    '/kvkk': '/kvkk/kvkk.html', '/kvkk/': '/kvkk/kvkk.html', '/kvkk.html': '/kvkk/kvkk.html',
    '/KVKK': '/kvkk/kvkk.html', '/Kvkk.HTML': '/kvkk/kvkk.html', '/kvkk.html/': '/kvkk/kvkk.html',
    '/kosullar': '/kosullar/kosullar.html', '/kosullar/': '/kosullar/kosullar.html',
    '/kosullar.html': '/kosullar/kosullar.html',
    '/indir': '/indir/indir.html', '/indir/': '/indir/indir.html', '/indir.html': '/indir/indir.html',
    '/download': '/indir/indir.html', '/download/': '/indir/indir.html', '/DOWNLOAD': '/indir/indir.html',
    '/sss': '/sss/sss.html', '/sss/': '/sss/sss.html', '/faq': '/sss/sss.html', '/faq/': '/sss/sss.html',
    '/SSS': '/sss/sss.html',
    /* Asıl adresin yanlış yazılışı asıl yazılışa döner (Linux'ta dosya adı harf duyarlı). */
    '/KVKK/kvkk.html': '/kvkk/kvkk.html', '/kvkk/kvkk.html/': '/kvkk/kvkk.html', '/SSS/SSS.HTML': '/sss/sss.html',
    '/Indir/Indir.html': '/indir/indir.html', '/kosullar/KOSULLAR.html': '/kosullar/kosullar.html',
    /* Türkçe İ ve ı da i sayılır (Caps Lock açıkken Türkçe klavye: "İNDİR"). */
    '/%C4%B0ndir': '/indir/indir.html', '/%C4%B0ND%C4%B0R': '/indir/indir.html', '/%C4%B1nd%C4%B1r': '/indir/indir.html',
    '/%C4%B0ND%C4%B0R/%C4%B0ND%C4%B0R.HTML': '/indir/indir.html', '/%C4%B0ND%C4%B0R.HTML': '/indir/indir.html',
    /* Baştaki çift "/" başka siteye gitmez: yine sabit yol. */
    '//kvkk': '/kvkk/kvkk.html'
  };
  const yanlis = [];
  for (const yol of Object.keys(yonlenen)) {
    const c = await istek(yol);
    if (c.durum !== 301 || c.baslik.location !== yonlenen[yol]) yanlis.push(yol + ' ' + c.durum + ' ' + c.baslik.location);
  }
  kontrol('her kısa/eski adres 301 ve doğru Location (' + Object.keys(yonlenen).length + ' adres)', !yanlis.length, yanlis.join(', '));
  const basYon = await istek('/kvkk', 'HEAD');
  kontrol('HEAD /kvkk da 301', basYon.durum === 301 && basYon.baslik.location === '/kvkk/kvkk.html', basYon.durum);
  const post = await istek('/kvkk', 'POST');
  kontrol('POST /kvkk yönlenmez (405)', post.durum === 405 && !post.baslik.location, post.durum);

  const geri = await istek('/kvkk.html?geri=1');
  kontrol('/kvkk.html?geri=1 sorguyu korur', geri.durum === 301 && geri.baslik.location === '/kvkk/kvkk.html?geri=1',
    geri.baslik.location);
  const iki = await istek('/indir?a=1&b=%C3%A7');
  kontrol('/indir?a=1&b=%C3%A7 sorgu olduğu gibi', iki.baslik.location === '/indir/indir.html?a=1&b=%C3%A7', iki.baslik.location);
  const bosSorgu = await istek('/sss?');
  kontrol('boş sorgu eklenmez', bosSorgu.baslik.location === '/sss/sss.html', bosSorgu.baslik.location);

  const yon = await istek('/kvkk');
  kontrol('yönlendirmede güvenlik başlıkları var', yon.baslik['x-content-type-options'] === 'nosniff' &&
    /default-src 'self'/.test(yon.baslik['content-security-policy'] || '') && yon.baslik['x-frame-options'] === 'DENY',
    JSON.stringify(yon.baslik).slice(0, 200));

  const izle = await fetch(BASE + '/download');
  kontrol('tarayıcı gibi izleyince /download indirme sayfasına varıyor', izle.status === 200 &&
    new URL(izle.url).pathname === '/indir/indir.html' && /<h1>Eğitim Evi'ni indir<\/h1>/.test(await izle.text()), izle.url);

  console.log('=== 3) AÇIK YÖNLENDİRME VE BAŞLIK ENJEKSİYONU ===');
  const kotu = ['//evil.com', '//evil.com/', '/\\evil.com', '/%2F%2Fevil.com', '/kvkk.html%0d%0aSet-Cookie:%20a=b',
    '/kvkk%0d%0aLocation:%20//evil.com', '/kvkk.html?%0d%0aSet-Cookie:%20a=b', '/kvkk?//evil.com',
    '/kvkk.html?x=%0aLocation:%20https://evil.com'];
  const sorunlu = [];
  for (const yol of kotu) {
    const c = await istek(yol);
    const loc = c.baslik.location;
    if (loc !== undefined && (!/^\/(kvkk|kosullar|indir|sss)\//.test(loc) || /^\/\//.test(loc) || /[\r\n]/.test(loc))) sorunlu.push(yol + ' -> ' + loc);
    if (c.baslik['set-cookie']) sorunlu.push(yol + ' Set-Cookie');
    if (c.durum >= 500) sorunlu.push(yol + ' ' + c.durum);
  }
  kontrol('Location hep sabit yol; başka siteye yönlenmez, çerez eklenmez', !sorunlu.length, sorunlu.join(' | '));
  const evil = await istek('//evil.com');
  kontrol('//evil.com 404 (yönlenmez)', evil.durum === 404 && !evil.baslik.location, evil.durum + ' ' + evil.baslik.location);
  const enj = await istek('/kvkk.html%0d%0aSet-Cookie:%20a=b');
  kontrol('/kvkk.html%0d%0aSet-Cookie: 404, başlık eklenmez', enj.durum === 404 && !enj.baslik['set-cookie'] &&
    !enj.baslik.location, enj.durum);

  /* Ham baytlar: latin1 ve denetim karakteri taşıyan sorgu Location'a girmez; sunucu çökmez. */
  const ham1 = await hamIstek('GET /kvkk.html?x=ÿþ');
  kontrol('ASCII dışı sorgu atılır (Location yalnız sabit yol) ya da istek reddedilir',
    /^HTTP\/1\.1 (301|400)/.test(ham1) && !/\r\nSet-Cookie/i.test(ham1) &&
    (!/\r\nLocation:/i.test(ham1) || /\r\nLocation: \/kvkk\/kvkk\.html\r?$/im.test(ham1)), ham1.split('\r\n').slice(0, 3).join(' | '));
  const ham2 = await hamIstek('GET /kvkk.html?x=a\rSet-Cookie:b');
  kontrol('sorguda çıplak CR: Set-Cookie başlığı oluşmaz', !/\r\nSet-Cookie/i.test(ham2), ham2.split('\r\n').slice(0, 3).join(' | '));
  const hala = await istek('/kvkk/kvkk.html');
  kontrol('ham isteklerden sonra sunucu ayakta', hala.durum === 200, hala.durum);

  /* Adreste boş bayt (%00): dosya yoluna girerse fs anında hata atar; eskiden tek istek
     sunucuyu düşürüyordu. Hepsi 404 olmalı, sunucu ayakta kalmalı. */
  const bosBayt = ['/kvkk%00', '/index%00', '/js/app.js%00', '/%00', '/kvkk/kvkk.html%00', '/sss/sss.html%00',
    '/indir%00.html', '/school/test-ortaokulu%00', '/css/style.css%00?v=1'];
  const bbSorun = [];
  for (const yol of bosBayt) {
    try {
      const c = await istek(yol);
      if (c.durum !== 404 || c.baslik.location) bbSorun.push(yol + ' ' + c.durum + (c.baslik.location ? ' -> ' + c.baslik.location : ''));
    } catch (e) { bbSorun.push(yol + ' ' + (e.code || e.message)); }
  }
  kontrol('adreste boş bayt (%00) 404 verir (' + bosBayt.length + ' adres)', !bbSorun.length, bbSorun.join(', '));
  let bbSonra = null;
  try { bbSonra = await istek('/kvkk/kvkk.html'); } catch (e) { bbSonra = { durum: e.code || e.message }; }
  kontrol('boş baytlı isteklerden sonra sunucu ayakta', bbSonra.durum === 200, bbSonra.durum);

  console.log('=== 4) BULUNAMAYANLAR ===');
  const bulunamayan = ['/olmayan', '/kvkk/olmayan.html', '/sss/olmayan.html', '/indir/kvkk.html', '/kosullar/indir.html',
    '/js/parcalar/05a-dis-sayfalar.js', '/css/parcalar/00-temel.css', '/JS/Parcalar/05a-dis-sayfalar.js'];
  const acilan = [];
  for (const yol of bulunamayan) {
    const c = await istek(yol);
    if (c.durum !== 404) acilan.push(yol + ' ' + c.durum);
  }
  kontrol('tanınmayan adresler ve ön yüz parçaları 404', !acilan.length, acilan.join(', '));
  const olmayan = await istek('/olmayan');
  kontrol('/olmayan "Sayfa bulunamadı" sayfası', /Sayfa bulunamadı/.test(olmayan.metin) && htmlMi(olmayan));
  const okul = await istek('/school/test-ortaokulu');
  kontrol('/school/test-ortaokulu 200', okul.durum === 200 && /id="authWrap"/.test(okul.metin), okul.durum);
  for (const yol of ['/hakkinda', '/about', '/login', '/giris', '/signup', '/kayit', '/']) {
    const c = await istek(yol);
    if (c.durum !== 200 || !/id="authWrap"/.test(c.metin)) acilan.push(yol + ' ' + c.durum);
  }
  kontrol('/hakkinda, /about, /login, /signup ... yönlenmeden açılıyor', !acilan.length, acilan.join(', '));

  console.log('=== 5) SAYFALARIN İÇİ ===');
  const eskiBaglanti = /(href|data-site)="\/(kvkk\.html|kosullar\.html|indir|download|sss|faq)"/;
  const olu = await istek('/olmayan');
  const okulYok = await istek('/school/boyle-bir-okul-yok');
  const hepsi = Object.assign({}, sayfalar, { '/olmayan (404)': olu.metin, '/school/yok (okul bulunamadı)': okulYok.metin });
  const eskiler = Object.keys(hepsi).filter(y => eskiBaglanti.test(hepsi[y]));
  kontrol('sayfalarda eski adrese bağlantı yok', !eskiler.length, eskiler.map(y => y + ': ' + hepsi[y].match(eskiBaglanti)[0]).join(', '));
  const yeniler = Object.keys(hepsi).filter(y => !/href="\/kvkk\/kvkk\.html"/.test(hepsi[y]) ||
    !/href="\/kosullar\/kosullar\.html"/.test(hepsi[y]) || !/href="\/indir\/indir\.html"/.test(hepsi[y]) ||
    !/href="\/sss\/sss\.html"/.test(hepsi[y]));
  kontrol('her sayfanın üst şerit/alt bilgisi asıl adresleri gösteriyor', !yeniler.length, yeniler.join(', '));
  const GORELI = /(?<![\w-])(src|href)="(?!\/|#|https?:|mailto:|tel:)[^"]+"/;
  const goreli = Object.keys(hepsi).filter(y => GORELI.test(hepsi[y]));
  kontrol('varlıklar ve bağlantılar mutlak yolla (klasör altında da yüklenir)', !goreli.length,
    goreli.map(y => y + ': ' + hepsi[y].match(GORELI)[0]).join(', '));
  const varliklar = new Set();
  for (const y of Object.keys(hepsi)) {
    for (const m of hepsi[y].matchAll(/(?:src|href)="(\/(?:css|js)\/[^"?]+)(?:\?[^"]*)?"/g)) varliklar.add(m[1]);
  }
  const yuklenmeyen = [];
  for (const v of varliklar) {
    const c = await istek(v);
    if (c.durum !== 200) yuklenmeyen.push(v + ' ' + c.durum);
  }
  kontrol('sayfaların stil ve betikleri yükleniyor (' + [...varliklar].join(', ') + ')',
    varliklar.size >= 4 && !yuklenmeyen.length, yuklenmeyen.join(', '));
  const app = await istek('/js/app.js');
  kontrol('SSS uygulama içinde asıl adresle (hedef ve SITE_SAYFALARI)', /sss: '\/sss\/sss\.html'/.test(app.metin) &&
    /'sss\/sss\.html': 'sss'/.test(app.metin), app.durum);

  /* Sekme başlığı: SSS ya da Hakkında'dan uygulama içinde giriş/kayıt kartına geçilince
     önceki sayfanın adı kalmaz; okul adresinde okulun adı yazar. Sunucunun verdiği
     app.js'teki girisEkraniGoster ve okulBasligiCiz, sayfa öğeleri taklit edilerek çalışır. */
  function fonksiyonKaynagi(kaynak, ad) {
    const bas = kaynak.indexOf('function ' + ad + '(');
    if (bas < 0) return '';
    let derinlik = 0;
    for (let i = kaynak.indexOf('{', bas); i < kaynak.length; i++) {
      if (kaynak[i] === '{') derinlik++;
      else if (kaynak[i] === '}' && --derinlik === 0) return kaynak.slice(bas, i + 1);
    }
    return '';
  }
  let basliklar = [];
  try {
    const ogeler = {};
    const oge = id => ogeler[id] || (ogeler[id] = { style: {}, hidden: false, innerHTML: '',
      classList: { remove() {}, contains: () => true }, click() {} });
    const belge = { title: 'Eğitim Evi' };
    const S = { genelGiris: false, okulAdresi: null };
    let simdiki = '';
    const bos = () => {};
    const goster = new Function('S', '$', 'document', 'disSayfa', 'siteMenusuIsaretle', 'siteBilgisiYukle',
      'yorumlariYukle', 'okulSayfasiniCiz', 'girisKimlikAyarla', 'girisKimlik', 'ik', 'esc', 'sonOkulCiz',
      fonksiyonKaynagi(app.metin, 'girisEkraniGoster') + '\n' + fonksiyonKaynagi(app.metin, 'okulBasligiCiz') +
      '\nreturn girisEkraniGoster;')(S, oge, belge, () => simdiki, bos, bos, bos, bos, bos, null, () => '', String, bos);
    const git = (sayfa, okul) => { simdiki = sayfa; S.okulAdresi = okul || null; goster(); basliklar.push(belge.title); };
    git('sss'); git('giris');
    git('hakkinda'); git('kayit');
    git('okul', { ad: 'Test Ortaokulu', il: 'Ankara', ilce: 'Çankaya' }); git('giris');
  } catch (e) { basliklar = ['HATA: ' + e.message]; }
  kontrol('sekme başlığı: SSS/Hakkında -> giriş ya da kayıt "Eğitim Evi", okul adresinde okulun adı',
    JSON.stringify(basliklar) === JSON.stringify(['Sık sorulan sorular — Eğitim Evi', 'Eğitim Evi', 'Hakkında — Eğitim Evi',
      'Eğitim Evi', 'Test Ortaokulu — Eğitim Evi', 'Eğitim Evi']), JSON.stringify(basliklar));
  const sw = await istek('/sw.js');
  kontrol('hizmet çalışanının önbellek listesinde eski adres yok', sw.durum === 200 &&
    !/'\/(kvkk\.html|kosullar\.html|indir\.html|indir|sss|faq)'/.test(sw.metin), sw.durum);

  console.log();
  console.log('  GECTI: ' + gecti + '   KALDI: ' + kaldi);
  process.exit(kaldi ? 1 : 0);
})().catch(e => { console.error('TEST HATASI:', e.message, e.stack); process.exit(1); });
