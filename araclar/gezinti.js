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

