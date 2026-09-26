'use strict';
/*
  Gezinti: her rolün bütün ekranlarını gerçek tarayıcıda gezer, özellikleri
  kullanır (pencereleri açar, sekmeleri değiştirir, not tablosuna değer yazar,
  süzgeç seçer) ve her adımın tam sayfa fotoğrafını çeker. Aynı sırada hata
  toplar:

    - konsol hataları ve uyarıları, yakalanmamış JavaScript hataları
    - 400 ve üstü dönen ya da hiç yüklenemeyen istekler
    - yüklenirken sayfa kayması (Cumulative Layout Shift, 0,1 üstü kötü sayılır)
    - adım başına API isteği sayısı ve indirilen veri
    - düğmesi bulunamayan adımlar (ekranda olması gereken şey yok demektir)

  Açık tema, koyu tema ve telefon boyutu (390 px) ayrı ayrı çekilir; fotoğraflar
  JPEG. Birden çok rolü olan hesaplar (müdür aynı zamanda veli, iki okulda
  öğretmen) her rolüyle ayrı gezilir.

  Çıktı: ekran-goruntuleri/ (depoya girer; bütün kişiler test verisi)
    index.html        ekranlarla kılavuz: önce müdürün gözünden, sonra her rol;
                      her fotoğrafın altında ne gösterdiği (metinler gezinti-metin.js)
    <rol>/NN-ad.jpg
  Geliştirici raporu (depoya girmez): testler/testdata/gezinti/
    hata-raporu.md    bulunan her sorun, adım adım
    gezinti.json      adım başına API sayısı, kayma, süre

  Chrome DevTools Protokolü doğrudan kullanılır (Node'un yerleşik
  WebSocket'i); paket gerekmez.

  Çalıştırma (test sunucusu açıkken, sırasıyla seed, zengin-veri.js ve gorsel-veri.js'ten sonra):
    EE_BASE=http://localhost:3200 EE_LOG=testler/test-sunucu.log node araclar/gezinti.js
*/

const fs = require('fs');
const path = require('path');
const os = require('os');
const { spawn } = require('child_process');
const { iste, girisYap, kisilikGec } = require('./giris');
const { HESAPLAR } = require('./gorsel-veri');
/* Nakil öğrencisinin T.C. no'su (gorsel-veri.js yazar). */
let NAKIL_TC = '';
try { NAKIL_TC = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'testler', 'testdata', 'gorsel-nakil.json'), 'utf8')).tc; } catch (e) { /* yok */ }

const BASE = process.env.EE_BASE || 'http://localhost:3200';
const CIKTI = path.join(__dirname, '..', 'ekran-goruntuleri');
const RAPOR = path.join(__dirname, '..', 'testler', 'testdata', 'gezinti');
const { ROL_METNI, ADIM_METNI, UYGULAMA_EKRANLARI } = require('./gezinti-metin');
const HATA_AYIKLAMA_PORTU = 9333;
/* Fotoğraflar JPEG (kalite 82; depoya girdiği için boyut da önemli). Keskin görünsün diye masaüstü 1,5 kat
   (2160 px genişlik), telefon 3 kat (1170 px, gerçek telefon ekranı gibi)
   çekilir. EE_OLCEK=1 ile küçük ve hızlı çekilir. */
const OLCEK = Number(process.env.EE_OLCEK) || 0;
const MASAUSTU = { width: 1440, height: 1000, mobile: false, olcek: OLCEK || 1.5 };
const TELEFON = { width: 390, height: 844, mobile: true, olcek: OLCEK || 3 };
const JPEG_KALITE = 82;
const EN_UZUN_SAYFA = 7000;          // çok uzun sayfa fotoğrafı bu yükseklikte kesilir (css piksel)
const KAYMA_SINIRI = 0.1;            // Google'ın "iyi" sınırı

const CHROME = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  '/usr/bin/google-chrome', '/usr/bin/chromium'
].find(p => fs.existsSync(p));

const bekle = ms => new Promise(r => setTimeout(r, ms));

/* ================= tarayıcı bağlantısı ================= */
class Tarayici {
  constructor(ws) {
    this.ws = ws;
    this.no = 0;
    this.bekleyen = new Map();
    this.dinleyici = null;
    ws.addEventListener('message', ev => {
      const m = JSON.parse(ev.data);
      if (m.id && this.bekleyen.has(m.id)) {
        const { coz, reddet } = this.bekleyen.get(m.id);
        this.bekleyen.delete(m.id);
        if (m.error) reddet(new Error(m.error.message)); else coz(m.result);
      } else if (m.method && this.dinleyici) {
        this.dinleyici(m.method, m.params);
      }
    });
  }
  gonder(method, params) {
    const id = ++this.no;
    return new Promise((coz, reddet) => {
      this.bekleyen.set(id, { coz, reddet });
      this.ws.send(JSON.stringify({ id, method, params: params || {} }));
    });
  }
}

async function tarayiciAc() {
  const profil = fs.mkdtempSync(path.join(os.tmpdir(), 'ee-gezinti-'));
  const surec = spawn(CHROME, [
    '--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check', '--lang=tr-TR',
    '--hide-scrollbars', '--mute-audio', '--remote-allow-origins=*',
    /* Edge'in yerleşik eklentileri sayfa konsoluna kendi uyarılarını basıyor ve turu
       yavaşlatıyordu (MaxListenersExceededWarning): eklentisiz açılır. */
    '--disable-extensions', '--disable-component-extensions-with-background-pages',
    '--disable-background-networking', '--disable-sync',
    '--remote-debugging-port=' + HATA_AYIKLAMA_PORTU, '--user-data-dir=' + profil,
    '--window-size=' + MASAUSTU.width + ',' + MASAUSTU.height, 'about:blank'
  ], { stdio: 'ignore' });

  let hedef = null;
  for (let i = 0; i < 60 && !hedef; i++) {
    await bekle(250);
    try {
      const liste = await (await fetch('http://127.0.0.1:' + HATA_AYIKLAMA_PORTU + '/json/list')).json();
      hedef = liste.find(t => t.type === 'page');
    } catch (e) { /* henüz açılmadı */ }
  }
  if (!hedef) throw new Error('Tarayıcıya bağlanılamadı');
  const ws = new WebSocket(hedef.webSocketDebuggerUrl);
  await new Promise((coz, reddet) => { ws.addEventListener('open', coz); ws.addEventListener('error', reddet); });
  const t = new Tarayici(ws);
  t.kapat = () => {
    try { ws.close(); } catch (e) { /* yoksay */ }
    surec.kill();
    setTimeout(() => { try { fs.rmSync(profil, { recursive: true, force: true }); } catch (e) { /* yoksay */ } }, 1500);
  };
  return t;
}

/* ================= hata toplama ================= */
const akis = { istekler: new Map(), kayit: null };

function yeniKayit() {
  return { konsol: [], istisna: [], istek: [], api: 0, bayt: 0, kayma: 0, eylemHatasi: '' };
}

function olayIsle(yontem, p) {
  const k = akis.kayit;
  switch (yontem) {
    case 'Network.requestWillBeSent':
      akis.istekler.set(p.requestId, { url: p.request.url });
      if (k && p.request.url.indexOf('/api/') >= 0) k.api++;
      break;
    case 'Network.responseReceived':
      if (k && p.response.status >= 400) {
        k.istek.push(p.response.status + ' ' + kisaUrl(p.response.url));
      }
      break;
    case 'Network.loadingFinished':
      akis.istekler.delete(p.requestId);
      if (k) k.bayt += p.encodedDataLength || 0;
      break;
    case 'Network.loadingFailed': {
      const r = akis.istekler.get(p.requestId);
      akis.istekler.delete(p.requestId);
      if (k && !p.canceled) k.istek.push('YÜKLENEMEDİ ' + (r ? kisaUrl(r.url) : '?') + ' (' + p.errorText + ')');
      break;
    }
    case 'Runtime.consoleAPICalled':
      /* Tarayıcı eklentisinden gelen konsol satırı sayfanın sorunu değildir. */
      if (p.stackTrace && (p.stackTrace.callFrames || []).some(c => /^(chrome-)?extension:\/\//.test(c.url || ''))) break;
      if (k && (p.type === 'error' || p.type === 'warning' || p.type === 'assert')) {
        k.konsol.push(p.type + ': ' + (p.args || []).map(a => a.value !== undefined ? a.value : (a.description || a.type)).join(' '));
      }
      break;
    case 'Runtime.exceptionThrown':
      if (k) {
        const d = p.exceptionDetails;
        k.istisna.push((d.exception && d.exception.description) || d.text);
      }
      break;
    case 'Page.javascriptDialogOpening':
      /* alert/confirm açılırsa sayfa donar; kaydedip kapatıyoruz. confirm'e
         "Vazgeç" denir ki gezinti bir şey silmesin. */
      console.log('      uyarı penceresi (' + p.type + '): ' + p.message);
      if (k) k.konsol.push('Kullanıcıya uyarı penceresi gösterildi (' + p.type + '): ' + p.message);
      if (akis.tarayici) akis.tarayici.gonder('Page.handleJavaScriptDialog', { accept: p.type !== 'confirm' }).catch(() => {});
      break;
    case 'Log.entryAdded':
      if (k && (p.entry.level === 'error' || p.entry.level === 'warning')) {
        k.konsol.push(p.entry.level + ' [' + p.entry.source + ']: ' + p.entry.text + (p.entry.url ? ' ' + kisaUrl(p.entry.url) : ''));
      }
      break;
  }
}

function kisaUrl(u) {
  try { const x = new URL(u); return x.pathname + x.search; } catch (e) { return u; }
}

/* Ağ sessizleşene kadar bekler (en az "sakin" ms boyunca açık istek yok). */
async function sakinlesmeyiBekle(t, sakin, enCok) {
  sakin = sakin || 450; enCok = enCok || 12000;
  const bas = Date.now();
  let sessiz = null;
  while (Date.now() - bas < enCok) {
    if (akis.istekler.size === 0) {
      if (!sessiz) sessiz = Date.now();
      if (Date.now() - sessiz >= sakin) break;
    } else sessiz = null;
    await bekle(40);
  }
  /* İki kare çizilsin; sayfa kare çizmiyorsa en fazla 2 sn beklenir. */
  await degerlendir(t, 'new Promise(function (r) { setTimeout(r, 2000); ' +
    'requestAnimationFrame(function () { requestAnimationFrame(r); }); })');
}

/* Makine yoğunken (başka tarayıcılar, testler) bir çağrı gecikebilir: zaman
   aşımında bir kez daha denenir. */
async function degerlendir(t, ifade) {
  try { return await degerlendirBir(t, ifade); } catch (e) {
    if (!/zaman aşımı/.test(e.message)) throw e;
    return degerlendirBir(t, ifade);
  }
}

async function degerlendirBir(t, ifade) {
  let zamanAsimi = false;
  const r = await Promise.race([
    t.gonder('Runtime.evaluate', { expression: ifade, awaitPromise: true, returnByValue: true }),
    bekle(20000).then(() => { zamanAsimi = true; return null; })
  ]);
  if (zamanAsimi) {
    /* Açık bir alert/confirm penceresi sayfayı dondurmuş olabilir: kapat. */
    await t.gonder('Page.handleJavaScriptDialog', { accept: false }).catch(() => {});
    throw new Error('zaman aşımı (20 sn): sayfa cevap vermedi');
  }
  if (r.exceptionDetails) {
    const d = r.exceptionDetails;
    throw new Error((d.exception && d.exception.description ? d.exception.description.split('\n')[0] : d.text));
  }
  return r.result ? r.result.value : undefined;
}

/* Sayfaya en baştan eklenen yardımcılar: kayma ölçümü ve düğme tıklama. */
const YARDIMCI_BETIK = `
window.__kayma = 0;
try {
  new PerformanceObserver(function (l) {
    l.getEntries().forEach(function (e) { if (!e.hadRecentInput) window.__kayma += e.value; });
  }).observe({ type: 'layout-shift', buffered: true });
} catch (e) {}
window.__bul = function (sec, metin) {
  var l = Array.prototype.slice.call(document.querySelectorAll(sec));
  if (metin) l = l.filter(function (e) { return e.textContent.indexOf(metin) >= 0; });
  if (!l.length) throw new Error('bulunamadı: ' + sec + (metin ? ' ("' + metin + '")' : ''));
  return l[0];
};
window.__tikla = function (sec, metin) { var e = window.__bul(sec, metin); e.scrollIntoView({ block: 'center' }); e.click(); };
/* Metni içeren satırın içindeki düğmeye bas: satırdaTıkla('Kesirler', '[data-act="odev-ac"]') */
window.__satirdaTikla = function (metin, sec) {
  /* Metni ve düğmeyi içeren en içteki satır (dıştaki kart da metni içerir) */
  var l = Array.prototype.slice.call(document.querySelectorAll('.satir, tr, .kart')).filter(function (e) {
    return e.textContent.indexOf(metin) >= 0 && e.querySelector(sec);
  });
  if (!l.length) throw new Error('satır bulunamadı: "' + metin + '" / ' + sec);
  l.sort(function (a, b) { return a.textContent.length - b.textContent.length; });
  l[0].querySelector(sec).click();
};
/* Geçerli biçimde rastgele T.C. kimlik no (test verisi). */
window.__tc = function () {
  var d = [1 + Math.floor(Math.random() * 9)];
  for (var i = 1; i < 9; i++) d.push(Math.floor(Math.random() * 10));
  d.push((((d[0] + d[2] + d[4] + d[6] + d[8]) * 7 - (d[1] + d[3] + d[5] + d[7])) % 10 + 10) % 10);
  var s = 0; for (i = 0; i < 10; i++) s += d[i];
  d.push(s % 10);
  return d.join('');
};
/* Dosya kutusuna dosya ver (kişi "Dosya seç" ile seçmiş gibi). */
window.__dosyaVer = function (sec, ad, icerik, tur) {
  var k = document.querySelector(sec);
  if (!k) throw new Error('dosya kutusu yok: ' + sec);
  var dt = new DataTransfer();
  dt.items.add(new File([icerik], ad, { type: tur || '' }));
  k.files = dt.files;
  k.dispatchEvent(new Event('change', { bubbles: true }));
};
window.__yaz = function (sec, deger, sira) {
  var e = document.querySelectorAll(sec)[sira || 0];
  if (!e) throw new Error('kutu yok: ' + sec);
  e.value = deger;
  e.dispatchEvent(new Event('input', { bubbles: true }));
  e.dispatchEvent(new Event('change', { bubbles: true }));
};
`;

/* ================= fotoğraf ================= */
async function ekranBoyutu(t, boyut, yukseklik) {
  await t.gonder('Emulation.setDeviceMetricsOverride', {
    width: boyut.width, height: yukseklik || boyut.height, deviceScaleFactor: boyut.olcek || 1, mobile: boyut.mobile
  });
  await t.gonder('Emulation.setTouchEmulationEnabled', { enabled: boyut.mobile });
}

async function fotografCek(t, dosya, boyut, tam) {
  if (tam) {
    await degerlendir(t, 'window.scrollTo(0, 0)');
    let yuk = 0;
    for (let i = 0; i < 2; i++) {
      const m = await t.gonder('Page.getLayoutMetrics');
      const yeni = Math.min(EN_UZUN_SAYFA, Math.ceil((m.cssContentSize || m.contentSize).height));
      if (yeni === yuk) break;
      yuk = Math.max(yeni, boyut.height);
      await ekranBoyutu(t, boyut, yuk);
      await bekle(200);
    }
  }
  const s = await t.gonder('Page.captureScreenshot', { format: 'jpeg', quality: JPEG_KALITE });
  fs.writeFileSync(dosya, Buffer.from(s.data, 'base64'));
  if (tam) await ekranBoyutu(t, boyut);
}

/* ================= adımlar =================
   git: gidilecek sayfa (#/...), url: oturumsuz sayfa adresi (/, /login ...),
   eylem: sayfada çalışacak JavaScript, tam: false ise yalnızca görünen alan
   (açılır pencere fotoğrafları).
   Rolün girişi: eposta/sifre (+ okul: okul adresi), gec: birden çok rolü
   olan hesapta hangi role geçileceği (kisilikler listesinden seçer),
   pencereli: giriş sonrası uygulama açılmıyor, bir pencere bekliyor. */
const bekleJs = ms => `await new Promise(r => setTimeout(r, ${ms}));`;
const okulRolu = (rol, kisa) => k => { const r = k.roller.find(x => x.rol === rol && x.okulKisaAd === kisa); return r && { tur: 'rol', id: r.id }; };
const veliRolu = ad => k => { const c = k.cocuklar.find(x => x.ad.indexOf(ad) === 0); return c && { tur: 'veli', id: c.id }; };

/* Giriş yapmamış ziyaretçinin sayfaları. */
const DIS_ADIMLAR = [
  { ad: 'Açılış', url: '/' },
  { ad: 'Açılış — kullanıcı yorumları ve alt bilgi', url: '/', tam: false,
    eylem: `var y = document.getElementById('vYorumlar'); if (y) y.scrollIntoView(); ${bekleJs(600)}` },
  { ad: 'Yapımcılar listesi', url: '/', tam: false, eylem: `__tikla('#btnYapimcilar')` },
  { ad: 'Üstteki ay düğmesi — açılış koyu görünümde', url: '/', tam: false, tema: 'serbest', eylem: `__tikla('.site-tema')` },
  { ad: 'Güneş düğmesi — açık görünüme döndü', url: '/', tam: false, tema: 'serbest', eylem: `__tikla('.site-tema')` },
  { ad: 'Hakkında', url: '/hakkinda' },
  { ad: 'Sık sorulan sorular', url: '/sss' },
  { ad: 'Sık sorulan sorular — bir soru açık', url: '/sss', tam: false,
    eylem: `__tikla('.sss summary', 'okul değiştirirse'); ${bekleJs(300)}` },
  { ad: 'Kullanım koşulları (sorumluluğun sınırları)', url: '/kosullar.html' },
  { ad: 'Aydınlatma metni (KVKK)', url: '/kvkk.html' },
  { ad: 'Aydınlatma metninde Yapımcılar — önce liste açılır', url: '/kvkk.html', tam: false,
    eylem: `__tikla('#btnYapimcilar'); ${bekleJs(400)} if (location.pathname !== '/kvkk.html') throw new Error('sayfa değişti')` },
  { ad: 'Giriş ve okul arama', url: '/login' },
  { ad: 'Okul arama — büyük/küçük harf ve yazım hatası', url: '/login', eylem: `__yaz('#vOkulAra', 'TeSt ortaoklu'); ${bekleJs(1500)}` },
  { ad: 'Okul arama — harfleri yer değiştirmiş kelime', url: '/login', eylem: `__yaz('#vOkulAra', 'deenme anadlou'); ${bekleJs(1500)}` },
  { ad: 'Kayıt ol (şifre kuralları, telefon ülke kodu)', url: '/signup' },
  { ad: 'Kayıt — hatalar alanların altında', url: '/signup',
    eylem: `__yaz('#kSifre', 'deneme1'); __yaz('#kEmail', 'birisi@'); __tikla('#formKayit button[type=submit]'); ${bekleJs(700)}` },
  { ad: 'Okulun sayfası ve girişi (/test-ortaokulu)', url: '/test-ortaokulu' },
  { ad: 'Okul girişi — şifre yanlış', url: '/test-ortaokulu',
    eylem: `__yaz('#gEmail', 'fen'); __yaz('#gSifre', 'Yanlis2026'); __tikla('#formGiris button[type=submit]'); ${bekleJs(1000)}` },
  { ad: 'Giriş — böyle bir hesap yok', url: '/login',
    eylem: `__yaz('#gEmail', 'boyle.biri.yok'); __yaz('#gSifre', 'Yanlis2026'); __tikla('#formGiris button[type=submit]'); ${bekleJs(1000)}` },
  { ad: 'E-posta onay bağlantısı geçersiz', url: '/login#/eposta-onay?t=' + '0'.repeat(64), eylem: bekleJs(1200) },
  { ad: '"Bilgilerimi kaydetme" seçilince "Beni hatırla" kalkar', url: '/login',
    eylem: `__tikla('#gKaydetme'); if (document.getElementById('gHatirla').checked) throw new Error('iki kutu birden işaretli kaldı')` }
];
const DIS_KOYU = [{ ad: 'Açılış (koyu)', url: '/' }, { ad: 'Okulun sayfası (koyu)', url: '/test-ortaokulu' }];
const DIS_TELEFON = [{ ad: 'Açılış (telefon)', url: '/' }, { ad: 'Hakkında (telefon)', url: '/hakkinda' },
  { ad: 'Sık sorulan sorular (telefon)', url: '/sss' },
  { ad: 'Okulun sayfası (telefon)', url: '/test-ortaokulu' }, { ad: 'Kayıt ol (telefon)', url: '/signup' }];

/* "sayfa|ad|eylem" kısaltmasını adıma çevirir */
function kisaAdim(s, ek) {
  const p = s.split('|');
  return Object.assign({ git: p[0], ad: p[1], eylem: p.slice(2).join('|') || '' }, ek);
}

/* Müdür olarak okulun kapalı özelliklerini yazar (tur içi hazırlık). */
async function ozellikYaz(kapali) {
  const M = await oturumAc({ eposta: 'mudur@test.com', sifre: 'Test1234!', gec: okulRolu('principal', 'test-ortaokulu') });
  const r = await iste('/api/ozellikler', 'POST', { kapali }, M);
  if (r.status !== 200) throw new Error('özellikler: ' + (r.body.error || r.status));
}

/* ================= oturum =================
   Birden çok rolü olan hesap girişte rol seçim ekranına düşer; rol.gec
   hangi role geçileceğini seçer. */
async function oturumAc(rol) {
  const g = await girisYap(rol.eposta, rol.sifre, rol.okul);
  if (!rol.gec) return g.token;
  const k = (await iste('/api/kisilikler', 'GET', null, g.token)).body;
  const hedef = k && rol.gec(k);
  if (!hedef) throw new Error('geçilecek rol bulunamadı');
  return (await kisilikGec(g.token, hedef.tur, hedef.id)).token;
}

/* ================= çalıştır ================= */
async function calistir() {
  if (!CHROME) throw new Error('Chrome ya da Edge bulunamadı');
  /* Eski fotoğraflar silinir; öykünücüde çekilen uygulama ekranları (aile-uygulamasi/) kalır. */
  fs.mkdirSync(CIKTI, { recursive: true });
  for (const ad of fs.readdirSync(CIKTI)) {
    if (ad !== 'aile-uygulamasi') fs.rmSync(path.join(CIKTI, ad), { recursive: true, force: true });
  }

  const t = await tarayiciAc();
  t.dinleyici = olayIsle;
  akis.tarayici = t;
  await t.gonder('Page.enable');
  await t.gonder('Runtime.enable');
  await t.gonder('Network.enable');
  await t.gonder('Log.enable');
  await t.gonder('Page.addScriptToEvaluateOnNewDocument', { source: YARDIMCI_BETIK });

  const album = [];
  const tumKayitlar = [];
  akis.album = album;
  akis.tumKayitlar = tumKayitlar;

  async function adimCalistir(klasor, sira, adim, tema, boyut) {
    await t.gonder('Emulation.setEmulatedMedia', { features: [
      { name: 'prefers-color-scheme', value: tema === 'koyu' ? 'dark' : 'light' },
      { name: 'prefers-reduced-motion', value: 'reduce' }
    ] });
    await ekranBoyutu(t, boyut);
    akis.kayit = yeniKayit();
    const bas = Date.now();
    const dosya = String(sira).padStart(2, '0') + '-' + (tema === 'koyu' ? 'koyu-' : '') +
      (boyut.mobile ? 'telefon-' : '') + (adim.git || 'giris').replace(/[^a-z0-9-]/g, '') + '.jpg';
    try {
      return await adimIci();
    } catch (e) {
      /* Adım takıldı: kaydet, yine de fotoğrafını almayı dene, turu sürdür. */
      akis.kayit.eylemHatasi = (akis.kayit.eylemHatasi ? akis.kayit.eylemHatasi + ' · ' : '') + 'Adım tamamlanamadı: ' + e.message;
      try { await fotografCek(t, path.join(CIKTI, klasor, dosya), boyut, false); } catch (e2) { /* yoksay */ }
      const k = Object.assign({ rol: klasor, ad: adim.ad, dosya: klasor + '/' + dosya, sure: Date.now() - bas }, akis.kayit);
      tumKayitlar.push(k);
      console.log('  ! ' + dosya.padEnd(40) + adim.ad + '  [TAKILDI: ' + e.message + ']');
      return k;
    } finally {
      akis.kayit = null;
      await bekle(300);   // sunucunun hız sınırına takılmamak için
    }

    async function adimIci() {
      if (adim.tema !== 'serbest') await degerlendir(t, 'window.temaAyarla && window.temaAyarla("sistem"); 1');
      await degerlendir(t, 'window.__kayma = 0; document.activeElement && document.activeElement.blur && document.activeElement.blur(); ' +
        (adim.pencereKalsin ? '' : '(document.getElementById("modalKok") || {}).innerHTML = ""; ') + '1');
      if (adim.url) {
        await t.gonder('Page.navigate', { url: BASE + adim.url });
        await sakinlesmeyiBekle(t, 600);
      } else if (adim.git !== undefined) {
        /* Menüdeki bağlantıya tıklamak sayfayı her seferinde taze açar
           (uygulama aynı adrese yeniden gidildiğinde çizmez; bu doğru). */
        await degerlendir(t, `(function () {
          var p = '${adim.git}';
          var n = document.querySelector('[data-nav="' + p + '"]');
          if (n) n.click(); else location.hash = '#/' + p;
          return 1; })()`);
      }
      await sakinlesmeyiBekle(t);
      if (adim.eylem) {
        try {
          await degerlendir(t, '(async function () { ' + adim.eylem + ' })()');
        } catch (e) {
          akis.kayit.eylemHatasi = e.message;
        }
        await sakinlesmeyiBekle(t);
      }
      await bekle(250);
      akis.kayit.kayma = Math.round((await degerlendir(t, 'window.__kayma') || 0) * 1000) / 1000;
      await fotografCek(t, path.join(CIKTI, klasor, dosya), boyut, adim.tam !== false);
      const k = Object.assign({ rol: klasor, ad: adim.ad, dosya: klasor + '/' + dosya, sure: Date.now() - bas }, akis.kayit);
      tumKayitlar.push(k);
      const sorun = k.konsol.length + k.istisna.length + k.istek.length + (k.eylemHatasi ? 1 : 0) + (k.kayma > KAYMA_SINIRI ? 1 : 0);
      console.log('  ' + (sorun ? '!' : ' ') + ' ' + dosya.padEnd(40) + adim.ad +
        (sorun ? '  [' + sorun + ' sorun]' : '') + '  (' + k.api + ' API, ' + Math.round(k.bayt / 1024) + ' KB)');
      return k;
    }
  }

  /* ---- dış sayfalar (oturumsuz): açılış, Hakkında, giriş, kayıt, okulun sayfası ---- */
  fs.mkdirSync(path.join(CIKTI, 'giris'), { recursive: true });
  console.log('\nDış sayfalar');
  await t.gonder('Page.navigate', { url: BASE + '/' });
  await sakinlesmeyiBekle(t, 600);
  await degerlendir(t, 'localStorage.clear(); sessionStorage.clear(); 1');
  const girisler = [];
  let disSira = 0;
  for (const adim of DIS_ADIMLAR) girisler.push(await adimCalistir('giris', ++disSira, adim, 'acik', MASAUSTU));
  for (const adim of DIS_KOYU) girisler.push(await adimCalistir('giris', ++disSira, adim, 'koyu', MASAUSTU));
  for (const adim of DIS_TELEFON) girisler.push(await adimCalistir('giris', ++disSira, adim, 'acik', TELEFON));
  album.push({ rol: 'Dış sayfalar: açılış, giriş, kayıt, okul sayfası', klasor: 'giris', kayitlar: girisler });

  for (const rol of ROLLER) {
    console.log('\n' + rol.baslik);
    if (rol.once) { try { await rol.once(); } catch (e) { console.log('  ! hazırlık: ' + e.message); } }
    let token;
    try { token = await oturumAc(rol); } catch (e) {
      console.log('  ! ' + rol.baslik + ' girişi yapılamadı (' + e.message + '), rol atlandı');
      continue;
    }
    fs.mkdirSync(path.join(CIKTI, rol.ad), { recursive: true });
    /* Rolün hazırlığı takılırsa o rol atlanır, tur sürer. */
    let girdi = false;
    try {
      await t.gonder('Page.navigate', { url: BASE + '/' });
      await sakinlesmeyiBekle(t, 400);
      await degerlendir(t, 'localStorage.clear(); sessionStorage.clear(); ' +
        'localStorage.setItem("ee_token", ' + JSON.stringify(token) + '); localStorage.setItem("ee_hatirla", "kalici"); ' +
        'location.hash = "#/ana"; 1');
      /* Aynı adreste yalnızca # değişirse sayfa yeniden yüklenmez; anahtarın
         okunması için tam yükleme şart. */
      await ekranBoyutu(t, MASAUSTU);
      await t.gonder('Page.reload', {});
      await sakinlesmeyiBekle(t, 800);
      /* Uygulama girişten sonra #app'e "on" sınıfını koyar (26-baslat.js). */
      girdi = await degerlendir(t, '!!(document.getElementById("app") && document.getElementById("app").classList.contains("on"))');
    } catch (e) {
      console.log('  ! ' + rol.baslik + ' hazırlığı takıldı (' + e.message + '), rol atlandı');
      if (rol.sonra) { try { await rol.sonra(); } catch (e2) { /* yoksay */ } }
      continue;
    }
    if (!girdi && !rol.pencereli) {
      console.log('  ! ' + rol.baslik + ' oturumu açılamadı, rol atlandı');
      continue;
    }

    const kayitlar = [];
    let sira = 0;
    for (const adim of rol.adimlar) kayitlar.push(await adimCalistir(rol.ad, ++sira, adim, 'acik', MASAUSTU));
    for (const s of rol.koyu || []) kayitlar.push(await adimCalistir(rol.ad, ++sira, kisaAdim(s), 'koyu', MASAUSTU));
    for (const s of rol.telefon || []) kayitlar.push(await adimCalistir(rol.ad, ++sira, typeof s === 'string' ? kisaAdim(s) : s, 'acik', TELEFON));
    for (const adim of rol.son || []) kayitlar.push(await adimCalistir(rol.ad, ++sira, adim, 'acik', MASAUSTU));
    album.push({ rol: rol.baslik, klasor: rol.ad, kayitlar });
    if (rol.sonra) { try { await rol.sonra(); } catch (e) { console.log('  ! temizlik: ' + e.message); } }
  }

  t.kapat();
  raporYaz(album, tumKayitlar);
}

/* ================= rapor ve albüm ================= */
function sorunlari(k) {
  const l = [];
  if (k.eylemHatasi) l.push('Adım yapılamadı: ' + k.eylemHatasi);
  k.istisna.forEach(x => l.push('JavaScript hatası: ' + x));
  k.konsol.forEach(x => l.push('Konsol: ' + x));
  k.istek.forEach(x => l.push('İstek: ' + x));
  if (k.kayma > KAYMA_SINIRI) l.push('Yüklenirken kayma: ' + k.kayma + ' (sınır ' + KAYMA_SINIRI + ')');
  return l;
}

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function raporYaz(album, tum) {
  const sorunlu = tum.filter(k => sorunlari(k).length);
  const toplamApi = tum.reduce((s, k) => s + k.api, 0);
  const md = ['# Gezinti raporu', '',
    tum.length + ' adım, ' + sorunlu.length + ' adımda sorun. Toplam ' + toplamApi + ' API isteği.', ''];
  for (const k of sorunlu) {
    md.push('## ' + k.rol + ' — ' + k.ad + ' (`' + k.dosya + '`)');
    sorunlari(k).forEach(s => md.push('- ' + s));
    md.push('');
  }
  md.push('## Adım başına ölçüm', '', '| Rol | Adım | API | KB | Kayma | Süre ms |', '|---|---|---|---|---|---|');
  tum.forEach(k => md.push('| ' + k.rol + ' | ' + k.ad + ' | ' + k.api + ' | ' + Math.round(k.bayt / 1024) +
    ' | ' + k.kayma + ' | ' + k.sure + ' |'));
  fs.mkdirSync(RAPOR, { recursive: true });
  fs.writeFileSync(path.join(RAPOR, 'hata-raporu.md'), md.join('\n') + '\n', 'utf8');
  fs.writeFileSync(path.join(RAPOR, 'gezinti.json'), JSON.stringify(tum, null, 2), 'utf8');
  albumYaz(album, tum);
  console.log('\n' + tum.length + ' adım, ' + sorunlu.length + ' adımda sorun -> ' + CIKTI + '  (rapor: ' + RAPOR + ')');
}

/* Görüntüleyici: fotoğrafa tıklayınca açılır; sol/sağ ok önceki/sonraki,
   Esc kapatır; üstte rol, konu ve adımın adı ile anlatımı. Telefon
   fotoğrafı telefon ekranı boyunda bir çerçevede, tekerlekle kaydırılır. */
const ALBUM_JS = `
(function () {
  var kok = document.getElementById('gosterici'), cerceve = document.getElementById('gCerceve');
  var resim = document.getElementById('gResim'), sira = -1, donus = null;
  function goster(i) {
    if (i < 0 || i >= FOTOLAR.length) return;
    sira = i;
    var f = FOTOLAR[i];
    kok.classList.toggle('telefon', !!f.t);
    resim.src = f.s;
    resim.alt = f.b;
    document.getElementById('gYer').textContent = (f.t ? 'Telefon' : 'Bilgisayar') + ' · ' + f.r + (f.a ? ' · ' + f.a : '');
    document.getElementById('gBaslik').textContent = f.b;
    document.getElementById('gMetin').innerHTML = f.m;
    document.getElementById('gSayac').textContent = (i + 1) + ' / ' + FOTOLAR.length;
    document.getElementById('gOnceki').disabled = i === 0;
    document.getElementById('gSonraki').disabled = i === FOTOLAR.length - 1;
    cerceve.scrollTop = 0;
    document.getElementById('gSahne').scrollTop = 0;
    if (FOTOLAR[i + 1]) { var on = new Image(); on.src = FOTOLAR[i + 1].s; }
    try { history.replaceState(null, '', '#ekran-' + (i + 1)); } catch (e) {}
  }
  function ac(i, kaynak) {
    donus = kaynak || null;
    kok.hidden = false;
    document.body.classList.add('gosterici-acik');
    goster(i);
    cerceve.focus();
  }
  function kapat() {
    kok.hidden = true;
    document.body.classList.remove('gosterici-acik');
    try { history.replaceState(null, '', location.pathname); } catch (e) {}
    if (donus) donus.focus();
  }
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a.foto');
    if (!a || e.ctrlKey || e.metaKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    ac(Number(a.getAttribute('data-i')), a);
  });
  document.getElementById('gOnceki').onclick = function () { goster(sira - 1); cerceve.focus(); };
  document.getElementById('gSonraki').onclick = function () { goster(sira + 1); cerceve.focus(); };
  document.getElementById('gKapat').onclick = kapat;
  document.addEventListener('keydown', function (e) {
    if (kok.hidden) return;
    if (e.key === 'ArrowRight') { e.preventDefault(); goster(sira + 1); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); goster(sira - 1); }
    else if (e.key === 'Escape') { e.preventDefault(); kapat(); }
  });
  var m = /^#ekran-(\\d+)$/.exec(location.hash);
  if (m) ac(Number(m[1]) - 1);
})();
`;

const ALBUM_CSS = [
  ':root{--zemin:#f7f3f1;--kart:#fffdfc;--yazi:#231b1c;--soluk:#6d5f60;--cizgi:#e7dcda;--ana:#b3202f;--ana-acik:#fbe9ea;--golge:0 1px 2px rgba(60,20,24,.06),0 8px 24px rgba(60,20,24,.06);--perde:#1a1214}',
  '@media (prefers-color-scheme:dark){:root{--zemin:#141112;--kart:#1d1819;--yazi:#efe6e5;--soluk:#a89a9b;--cizgi:#342b2c;--ana:#ff7a86;--ana-acik:#34191d;--golge:none;--perde:#0b0909}}',
  '*{box-sizing:border-box}html{scroll-behavior:smooth}@media (prefers-reduced-motion:reduce){html{scroll-behavior:auto}}',
  'body{margin:0;background:var(--zemin);color:var(--yazi);font:16px/1.6 "Segoe UI",system-ui,-apple-system,sans-serif}',
  'body.gosterici-acik{overflow:hidden}',
  '.ic{max-width:1180px;margin:0 auto;padding:0 16px}',
  '.ust{padding:48px 0 28px;border-bottom:1px solid var(--cizgi)}',
  '.etiket{margin:0 0 10px;font-size:13px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--ana)}',
  'h1{margin:0 0 14px;font:700 clamp(28px,4.4vw,44px)/1.12 Georgia,"Times New Roman",serif;letter-spacing:-.01em;text-wrap:balance;max-width:22ch}',
  '.giris{margin:0 0 12px;max-width:68ch;font-size:17.5px}.not{margin:0;max-width:68ch;color:var(--soluk);font-size:14.5px}',
  'kbd{display:inline-block;min-width:1.7em;padding:0 5px;border:1px solid var(--cizgi);border-bottom-width:2px;border-radius:5px;background:var(--kart);font:600 13px/1.5 inherit;text-align:center;color:var(--yazi)}',
  '.icindekiler{position:sticky;top:0;z-index:5;background:var(--zemin);border-bottom:1px solid var(--cizgi)}',
  '.icindekiler .ic{display:flex;align-items:center;gap:6px;overflow-x:auto;padding-top:10px;padding-bottom:10px}',
  '.ic-kisim{flex:0 0 auto;margin:0 4px 0 10px;font-size:12px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:var(--soluk)}.ic-kisim:first-child{margin-left:0}',
  '.icindekiler a{flex:0 0 auto;padding:6px 12px;border:1px solid var(--cizgi);border-radius:999px;color:var(--yazi);text-decoration:none;font-size:14px;background:var(--kart)}',
  '.icindekiler a:hover,.icindekiler a:focus-visible{border-color:var(--ana);color:var(--ana);outline:none}',
  'main{max-width:1180px;margin:0 auto;padding:8px 16px 72px}',
  '.kisim{padding-top:44px}.kisim+.kisim{margin-top:40px;border-top:2px solid var(--cizgi)}',
  '.kisim-bas{max-width:72ch}.kisim-bas p:last-child{margin:0;color:var(--soluk)}',
  'h2{margin:0 0 8px;font:700 clamp(28px,3.6vw,38px)/1.15 Georgia,"Times New Roman",serif;text-wrap:balance}',
  '.bolum{padding-top:34px;scroll-margin-top:60px}.bolum-bas{max-width:72ch}',
  'h3{margin:0 0 8px;font:700 clamp(22px,2.6vw,27px)/1.2 Georgia,"Times New Roman",serif;text-wrap:balance}',
  '.bolum-bas p{margin:0 0 6px;color:var(--soluk)}',
  '.alt-bolum{margin:30px 0 4px;font-size:18px;text-wrap:balance}',
  '.izgara{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(100%,360px),1fr));gap:18px;margin-top:16px}',
  '.izgara.tel{grid-template-columns:repeat(auto-fill,minmax(min(100%,220px),1fr))}',
  'figure{margin:0;display:flex;flex-direction:column;background:var(--kart);border:1px solid var(--cizgi);border-radius:12px;overflow:hidden;box-shadow:var(--golge)}',
  '.foto{display:block;max-height:340px;overflow:hidden;border-bottom:1px solid var(--cizgi);background:var(--zemin);cursor:zoom-in}',
  '.izgara.tel .foto{max-height:440px}',
  '.foto:focus-visible{outline:3px solid var(--ana);outline-offset:-3px}',
  'figure img{width:100%;display:block}',
  'figcaption{padding:12px 14px 14px}figcaption b{display:block;font-size:15px;line-height:1.35}',
  'figcaption p{margin:6px 0 0;color:var(--soluk);font-size:14.5px;line-height:1.55}',
  '.alt{border-top:1px solid var(--cizgi);padding:20px 0 28px;color:var(--soluk);font-size:14px}.alt a{color:var(--ana)}',
  'code{font-size:13px}',
  /* görüntüleyici */
  '.gosterici{position:fixed;inset:0;z-index:50;display:flex;flex-direction:column;background:var(--perde);color:#f3ecea}',
  '.gosterici[hidden]{display:none}',
  '.g-ust{flex:0 0 auto;display:flex;align-items:flex-start;gap:16px;padding:12px 16px;border-bottom:1px solid rgba(255,255,255,.12);background:rgba(0,0,0,.35)}',
  '.g-bilgi{flex:1;min-width:0}',
  '.g-yer{margin:0;font-size:12.5px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:#ff9aa3}',
  '.g-bilgi h2{margin:2px 0 2px;font:700 clamp(18px,2.2vw,23px)/1.25 Georgia,"Times New Roman",serif;color:#fff}',
  '.g-metin{margin:0;max-width:90ch;font-size:14.5px;line-height:1.5;color:#d8cccb}',
  '.g-dugmeler{flex:0 0 auto;display:flex;align-items:center;gap:8px}',
  '.g-sayac{font-size:14px;color:#d8cccb;font-variant-numeric:tabular-nums;margin-right:4px}',
  '.g-dugmeler button{width:44px;height:44px;border-radius:10px;border:1px solid rgba(255,255,255,.22);background:rgba(255,255,255,.08);color:#fff;font-size:22px;line-height:1;cursor:pointer}',
  '.g-dugmeler button:hover:not(:disabled),.g-dugmeler button:focus-visible{background:rgba(255,255,255,.18);outline:none;border-color:#ff9aa3}',
  '.g-dugmeler button:disabled{opacity:.35;cursor:default}',
  '.g-sahne{flex:1;min-height:0;overflow:auto;display:flex;justify-content:center;padding:16px}',
  '.g-cerceve{width:100%;max-width:1440px;outline:none}',
  '.g-cerceve img{display:block;width:100%;height:auto;border-radius:6px;background:#fff}',
  /* telefon: gerçek telefon ekranı boyunda çerçeve, içinde tekerlekle kaydırılır */
  '.gosterici.telefon .g-sahne{overflow:hidden;align-items:center}',
  '.gosterici.telefon .g-cerceve{width:min(390px,100%);max-width:none;height:min(844px,100%);overflow-y:auto;overscroll-behavior:contain;' +
    'border:10px solid #050505;border-radius:38px;background:#fff;box-shadow:0 0 0 2px #3a3a3a,0 20px 60px rgba(0,0,0,.6);scrollbar-width:thin}',
  '.gosterici.telefon .g-cerceve img{border-radius:0}',
  '.gosterici.telefon .g-cerceve:focus-visible{box-shadow:0 0 0 3px #ff9aa3,0 20px 60px rgba(0,0,0,.6)}',
  '@media (max-width:700px){.g-ust{flex-direction:column;gap:8px}.g-metin{display:none}.gosterici.telefon .g-cerceve{border-width:0;border-radius:0;height:100%}}'
].join('');


/* node araclar/gezinti.js --album : tur yeniden çalışmadan, son turun kaydından
   (testler/testdata/gezinti/gezinti.json) albümü yeniden yazar; metinler
   (gezinti-metin.js) değişince yeter. */
if (process.argv.includes('--album')) {
  const tum = JSON.parse(fs.readFileSync(path.join(RAPOR, 'gezinti.json'), 'utf8'));
  const gruplar = [];
  for (const k of tum) {
    let g = gruplar.find(x => x.klasor === k.rol);
    if (!g) gruplar.push(g = { rol: k.rol, klasor: k.rol, kayitlar: [] });
    g.kayitlar.push(k);
  }
  albumYaz(gruplar, tum);
  console.log('albüm yeniden yazıldı: ' + path.join(CIKTI, 'index.html'));
} else calistir().catch(e => {
  console.error('HATA:', e.stack || e.message);
  /* Tur yarıda kalsa da o ana kadar çekilenlerin albümü ve raporu yazılsın. */
  try { if (akis.album) raporYaz(akis.album, akis.tumKayitlar); } catch (e2) { console.error('rapor yazılamadı:', e2.message); }
  if (akis.tarayici) akis.tarayici.kapat();   // gizli tarayıcı açık kalmasın
  setTimeout(() => process.exit(1), 500);
});
