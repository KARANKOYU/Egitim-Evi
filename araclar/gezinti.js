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

const ROLLER = [
  {
    ad: 'mudur', baslik: 'Müdür', eposta: 'mudur@test.com', sifre: 'Test1234!', gec: okulRolu('principal', 'test-ortaokulu'),
    adimlar: [
      { ad: 'Ana sayfa', git: 'ana' },
      { ad: 'Hesap değiştir (müdür ve veli, tek hesap)', git: 'kisilikler' },
      { ad: 'Takvim (okul etkinlikleri)', git: 'takvim' },
      { ad: 'Takvime etkinlik ekleme', git: 'takvim', tam: false, eylem: `__tikla('[data-act="takvim-etkinlik-ekle"]')` },
      { ad: 'Mesajlar', git: 'mesajlar' },
      { ad: 'Gönderilenler — okundu sayıları', git: 'mesajlar', eylem: `__tikla('[data-act="mesaj-kutu"][data-kutu="giden"]')` },
      { ad: 'Duyuru okundu bilgisi', git: 'mesajlar', tam: false,
        eylem: `__tikla('[data-act="mesaj-kutu"][data-kutu="giden"]'); ${bekleJs(900)} __tikla('[data-act="mesaj-ac"]'); ${bekleJs(900)}` },
      { ad: 'Yeni duyuru penceresi', git: 'mesajlar', tam: false, eylem: `__tikla('[data-act="mesaj-yeni"]')` },
      { ad: 'Öğretmenler', git: 'ogretmenler' },
      { ad: 'Öğretmeni kodla ekleme penceresi', git: 'ogretmenler', tam: false, eylem: `__tikla('[data-act="ogretmen-kodla"]')` },
      { ad: 'Öğrenciler', git: 'okul-ogrenciler' },
      { ad: 'Yeni öğrenci hesabı penceresi', git: 'okul-ogrenciler', tam: false, eylem: `__tikla('[data-act="hesap-yeni"][data-rol="student"]')` },
      { ad: 'Öğrenci ekle — başka okulda kayıtlı T.C.: doğum tarihi isteniyor (nakil)', git: 'okul-ogrenciler', tam: false,
        eylem: `__tikla('[data-act="hesap-yeni"][data-rol="student"]'); ${bekleJs(700)} __yaz('#hfAd', 'Elif'); __yaz('#hfSoyad', 'Göçmen'); __yaz('#hfTc', '${NAKIL_TC}'); __tikla('[data-act="hesap-ac-kaydet"]'); ${bekleJs(1500)}` },
      { ad: 'Öğrenci hesabını düzenleme penceresi', git: 'okul-ogrenciler', tam: false, eylem: `__tikla('[data-act="hesap-duzenle"]')` },
      { ad: 'Bildirim paneli', git: 'ana', tam: false, eylem: `__tikla('#btnBildirim')` },
      { ad: 'Giriş bilgisi dağıt penceresi', git: 'okul-ogrenciler', tam: false, eylem: `__tikla('[data-act="giris-bilgisi-ac"]')` },
      { ad: 'Sınıflar', git: 'siniflar' },
      { ad: 'Sınıfın dersleri', git: 'siniflar', eylem: `__tikla('[data-act="sinif-dersler"]')` },
      { ad: 'Ders programı (çakışma uyarısıyla)', git: 'program' },
      { ad: 'Ders programı — haftalık', git: 'program', eylem: `__tikla('[data-act="program-gorunum"]', 'Hafta')` },
      { ad: 'Ders programı — çakışma listesi', git: 'program', eylem: `__tikla('[data-act="cakisma-ac"]')` },
      { ad: 'Ders saati ekleme penceresi', git: 'program', tam: false, eylem: `__tikla('[data-act="saat-ekle"]')` },
      { ad: 'Ders saatini düzenleme penceresi', git: 'program', tam: false,
        eylem: `var s = document.getElementById('pSinif'); if (s) { for (var i = 0; i < s.options.length; i++) if (/7-A/.test(s.options[i].text)) s.selectedIndex = i;
          s.dispatchEvent(new Event('change', { bubbles: true })); } ${bekleJs(1200)}
          __tikla('[data-act="program-gorunum"]', 'Hafta'); ${bekleJs(900)} __tikla('[data-act="saat-duzenle"]')` },
      { ad: 'Roller ve yetkiler (hazır Öğretmen rolü)', git: 'roller' },
      { ad: 'Yeni rol — hazır şablon: Kodlayıcı', git: 'roller', tam: false,
        eylem: `__tikla('[data-act="rol-yeni"]'); ${bekleJs(600)} var s = document.getElementById('rSablon'); if (s) { for (var i = 0; i < s.options.length; i++) if (/Kodlay/.test(s.options[i].text)) s.selectedIndex = i; s.dispatchEvent(new Event('change', { bubbles: true })); }` },
      { ad: 'Rolü düzenleme penceresi (yetkiler, ders/sınıf daraltması)', git: 'roller', tam: false, eylem: `__tikla('[data-act="rol-duzenle"]')` },
      { ad: 'Özel rol: Nöbetçi Öğretmen — yetkiler tek tek, yoklama yalnızca 7-A ve 7-B', git: 'roller', tam: false,
        eylem: `__tikla('[data-act="rol-yeni"]'); ${bekleJs(600)} __yaz('#rAd', 'Nöbetçi Öğretmen');
          ['devamsizlik.al', 'etut.yoklama', 'mesaj.toplu'].forEach(function (k) { var c = document.querySelector('.yetki-kutu[value="' + k + '"]'); if (c && !c.checked) c.click(); });
          ${bekleJs(300)} var t = document.querySelector('.kapsam-tumu[data-izin="devamsizlik.al"][data-tur="sinif"]'); if (t && t.checked) t.click(); ${bekleJs(200)}
          Array.prototype.forEach.call(document.querySelectorAll('.kapsam-oge[data-izin="devamsizlik.al"]'), function (o) { var y = o.parentNode.textContent; if ((/7-A|7-B/).test(y) && !o.checked) o.click(); });
          var a = document.querySelector('.kapsam-alan[data-izin="devamsizlik.al"]'); if (a) a.scrollIntoView({ block: 'center' });` },
      { ad: 'Özel rol kaydedildi (rol listesinde yetkileri ve daraltmasıyla)', git: 'roller',
        eylem: `__tikla('[data-act="rol-yeni"]'); ${bekleJs(600)} __yaz('#rAd', 'Nöbetçi Öğretmen');
          ['devamsizlik.al', 'etut.yoklama', 'mesaj.toplu'].forEach(function (k) { var c = document.querySelector('.yetki-kutu[value="' + k + '"]'); if (c && !c.checked) c.click(); });
          ${bekleJs(300)} var t = document.querySelector('.kapsam-tumu[data-izin="devamsizlik.al"][data-tur="sinif"]'); if (t && t.checked) t.click(); ${bekleJs(200)}
          Array.prototype.forEach.call(document.querySelectorAll('.kapsam-oge[data-izin="devamsizlik.al"]'), function (o) { var y = o.parentNode.textContent; if ((/7-A|7-B/).test(y) && !o.checked) o.click(); });
          __tikla('[data-act="rol-kaydet"]'); ${bekleJs(1200)}` },
      { ad: 'Eğitim yılı', git: 'egitim-yili' },
      { ad: 'Özellikler (okulda kullanılmayan bölümü kapat)', git: 'ozellikler' },
      { ad: 'Özellikler — etüt kapatılıyor (kaydetmeden önce)', git: 'ozellikler', tam: false,
        eylem: `var k = document.getElementById('oz-etut'); if (!k) throw new Error('etüt anahtarı yok'); k.click();` },
      { ad: 'Devamsızlık özeti', git: 'devamsizlik' },
      { ad: 'Etütler', git: 'etutler' },
      { ad: 'Etüt düzenleme penceresi', git: 'etutler', tam: false, eylem: `__tikla('[data-act="etut-duzenle"]')` },
      { ad: 'Yeni etüt penceresi', git: 'etutler', tam: false, eylem: `__tikla('[data-act="etut-yeni"]')` },
      { ad: 'Etüdün öğrencileri', git: 'etutler', tam: false, eylem: `__tikla('[data-act="etut-ogrenciler"]')` },
      { ad: 'Ders ödevleri', git: 'ders-odevleri' },
      { ad: 'Ders ödevleri — bir ders açık (ödevler, kim verdi)', git: 'ders-odevleri', eylem: `__tikla('[data-act="ders-dal"]')` },
      { ad: 'Sınavlar — şablonlar', git: 'ogr-sinavlar', eylem: `__tikla('[data-act="sinav-sekme"][data-val="sablonlar"]')` },
      { ad: 'Yemek listesi', git: 'yemek' },
      { ad: 'Yemek listesi — düzenleme', git: 'yemek', tam: false, eylem: `__tikla('[data-act="yemek-duzenle"]')` },
      { ad: 'Servisler', git: 'servis' },
      { ad: 'Servis düzenleme penceresi', git: 'servis', tam: false, eylem: `__tikla('[data-act="servis-duzenle"]')` },
      { ad: 'Servise öğrenci ekleme', git: 'servis', tam: false, eylem: `__tikla('[data-act="servis-ogrenci-ac"]')` },
      { ad: 'Kulüpler', git: 'kulupler' },
      { ad: 'Yeni kulüp penceresi', git: 'kulupler', tam: false, eylem: `__tikla('[data-act="kulup-duzenle"]')` },
      { ad: 'Anketler (sonuçlar)', git: 'anketler' },
      { ad: 'Yeni anket penceresi', git: 'anketler', tam: false, eylem: `__tikla('[data-act="anket-yeni"]')` },
      { ad: 'Anketin ayrıntısı (kim ne oyladı, gizliyse gizli)', git: 'anketler', tam: false, eylem: `__tikla('[data-act="anket-sonuc"]')` },
      { ad: 'Excel aktarım', git: 'aktarim' },
      { ad: 'İçeri aktarma — öğrenci listesi (.csv) seçildi', git: 'aktarim',
        eylem: `var l = document.getElementById('aktarimListe'); if (l) { l.value = 'ogrenci'; l.dispatchEvent(new Event('change', { bubbles: true })); }
          var satirlar = [['Ali', 'Demir', '7', 'A', '41', '14.03.2013'], ['Ayşe', 'Yılmaz', '7', 'B', '42', '02.11.2012'],
            ['Can', 'Öztürk', '8', 'A', '43', '21.06.2012'], ['Derin', 'Arslan', '6', 'A', '44', '09.01.2014']];
          var csv = 'Ad;Soyad;T.C. Kimlik No;Sınıf (1-12);Şube;Okul No;Doğum tarihi (gg.aa.yyyy)\\n' +
            satirlar.map(function (r) { return [r[0], r[1], __tc(), r[2], r[3], r[4], r[5]].join(';'); }).join('\\n') +
            '\\nEmre;Kaya;12345678;7;A;45;31.02.2013\\n';
          __dosyaVer('#aktarimDosya', 'yeni-ogrenciler.csv', csv, 'text/csv'); ${bekleJs(1200)}` },
      { ad: 'İçeri aktarma — kontrol: açılacak hesaplar ve hatalı satır (henüz kaydedilmedi)', git: 'aktarim',
        eylem: `__tikla('[data-act="aktarim-yukle"]'); ${bekleJs(1800)}` },
      { ad: 'İçeri aktarma — uygulandı: açılan hesaplar, kullanıcı adları ve giriş mektupları', git: 'aktarim',
        eylem: `window.confirm = function () { return true; }; __tikla('[data-act="aktarim-uygula"]'); ${bekleJs(2500)}` },
      { ad: 'Dışarı aktarma (Excel listeleri)', git: 'aktarim', eylem: `__tikla('[data-act="aktarim-yon"][data-yon="disa"]'); ${bekleJs(600)}` },
      { ad: 'İşlem kaydı', git: 'islem-kaydi' },
      { ad: 'Okul adresi ve konumu', git: 'okul-ayarlari' },
      { ad: 'Okul sayfası (düzenleme ve önizleme)', git: 'okul-sayfasi' },
      { ad: 'Okul sayfası — kısıtlı CSS, atılan kısımlar', git: 'okul-sayfasi',
        eylem: `var d = document.querySelector('.os-css'); if (d) d.open = true; __yaz('#osCss', '.os-baslik { color: #0a6f79; position: fixed; }\\n.os-kutu { background: url(https://kotu.example/x.png); }\\n.auth-card { display: none; }'); __tikla('[data-act="os-css-onizle"]'); ${bekleJs(900)}` },
      { ad: 'Ayarlar', git: 'profil' }
    ],
    son: [{ ad: 'Öğrencinin portalı — şablonlu sınav grafiği (müdür gözünden)', git: 'okul-ogrenciler',
      eylem: `__satirdaTikla('Zeynep', '[data-act="ogrenci-portal"]'); ${bekleJs(1200)} var n = document.querySelector('[data-nav="sinavlarim"]'); if (!n) throw new Error('portal açılmadı'); n.click(); ${bekleJs(1500)}` }],
    koyu: ['ana|Ana sayfa (koyu)|', 'program|Ders programı (koyu)|', 'okul-sayfasi|Okul sayfası (koyu)|', 'etutler|Etütler (koyu)|'],
    telefon: ['ana|Ana sayfa (telefon)|', 'program|Ders programı (telefon)|', 'kisilikler|Hesap değiştir (telefon)|',
      'okul-sayfasi|Okul sayfası (telefon)|', 'etutler|Etütler (telefon)|']
  },
  {
    /* Aynı hesap: Test Ortaokulu müdürü ve Burak'ın velisi. */
    ad: 'mudur-veli', baslik: 'Müdür aynı zamanda veli', eposta: 'mudur@test.com', sifre: 'Test1234!', gec: veliRolu('Burak'),
    adimlar: [
      { ad: 'Hesap değiştir: veli olarak açık', git: 'kisilikler' },
      { ad: 'Ana sayfa (veli)', git: 'ana' },
      { ad: 'Ödevler (çocuğun)', git: 'veli-odevler' },
      { ad: 'Devamsızlık', git: 'veli-devamsizlik' },
      { ad: 'İlerleyiş', git: 'veli-ilerleyis' },
      { ad: 'Etütler', git: 'etutlerim' },
      { ad: 'Servis', git: 'servis' }
    ],
    telefon: ['kisilikler|Hesap değiştir (telefon)|', 'veli-odevler|Ödevler (telefon)|']
  },
  {
    ad: 'ogretmen', baslik: 'Öğretmen', eposta: 'mat@test.com', sifre: 'Test1234!', gec: okulRolu('teacher', 'test-ortaokulu'),
    adimlar: [
      { ad: 'Ana sayfa', git: 'ana' },
      { ad: 'Hesap değiştir (iki okulda öğretmen)', git: 'kisilikler' },
      { ad: 'Öğretmen kodum (Ekle penceresi)', git: 'kisilikler', tam: false,
        eylem: `__tikla('[data-act="kisilik-ekle"]'); ${bekleJs(500)} __tikla('[data-act="ekle-sec"][data-tur="ogretmen"]')` },
      { ad: 'Takvim', git: 'takvim' },
      { ad: 'Takvim — gün ayrıntısı', git: 'takvim', eylem: `__tikla('[data-act="takvim-gun"].bugun, [data-act="takvim-gun"]')` },
      { ad: 'Mesajlar', git: 'mesajlar' },
      { ad: 'Gönderilen mesaj (düzenlendi)', git: 'mesajlar',
        eylem: `__tikla('[data-act="mesaj-kutu"][data-kutu="giden"]'); ${bekleJs(900)} __tikla('[data-act="mesaj-ac"]', 'Yarınki matematik')` },
      { ad: 'Mesajı düzeltme penceresi', git: 'mesajlar', tam: false,
        eylem: `__tikla('[data-act="mesaj-kutu"][data-kutu="giden"]'); ${bekleJs(900)} __tikla('[data-act="mesaj-ac"]', 'Yarınki matematik'); ${bekleJs(900)} __tikla('[data-act="mesaj-duzelt"]')` },
      { ad: 'Yeni mesaj', git: 'mesajlar', eylem: `__tikla('[data-act="mesaj-yeni"]')` },
      { ad: 'Ders programım (bugünün dersinde "Şu an — yoklama al")', git: 'programim' },
      { ad: 'Ders programından yoklama: Geldi · Gelmedi izinli · Gelmedi izinsiz', git: 'programim', tam: false,
        eylem: `__tikla('[data-act="program-yoklama"]'); ${bekleJs(1200)} var d = document.querySelectorAll('.py-dugme.yok'); if (d[0]) d[0].click(); var i = document.querySelectorAll('.py-dugme.izinli'); if (i[1]) i[1].click();` },
      { ad: 'Yoklama kaydedildi (gelmeyenin velisine bildirim)', git: 'programim',
        eylem: `__tikla('[data-act="program-yoklama"]'); ${bekleJs(1200)} var d = document.querySelectorAll('.py-dugme.yok'); if (d[0]) d[0].click(); ${bekleJs(200)} __tikla('[data-act="py-kaydet"]'); ${bekleJs(1200)}` },
      { ad: 'Sınıflarım (ders verdiğim sınıflar ve öğrenciler)', git: 'siniflarim',
        eylem: `${bekleJs(600)} __tikla('[data-act="snf-sinif"]', '7-B'); ${bekleJs(1000)}` },
      { ad: 'Sınıflarım — öğrencinin ödevleri (yaptı mı) ve sınav sonuçları', git: 'siniflarim', tam: false,
        eylem: `${bekleJs(600)} __tikla('[data-act="snf-sinif"]', '7-B'); ${bekleJs(1000)} __tikla('[data-act="snf-ogrenci"]', 'Zeynep'); ${bekleJs(1200)}` },
      { ad: 'Ödevler', git: 'ogr-odevler' },
      { ad: 'Ödevler — süzgeç: sonuçlananlar', git: 'ogr-odevler', eylem: `__yaz('#fDurum', 'sonuclandi')` },
      { ad: 'Yeni ödev penceresi (ekler: sürükle-bırak)', git: 'ogr-odevler', eylem: `__tikla('[data-act="odev-yeni"]')`, tam: false },
      { ad: 'Yeni ödev — son tarih takvimi (hafta numarası, Bugün · Temizle · Tamam)', git: 'ogr-odevler', tam: false,
        eylem: `__tikla('[data-act="odev-yeni"]'); ${bekleJs(1200)} __tikla('#mBitDugme'); ${bekleJs(1200)}` },
      { ad: 'Yeni mesaj — ekler kutusu', git: 'mesajlar', tam: false, eylem: `__tikla('[data-act="mesaj-yeni"]')` },
      { ad: 'Yeni mesaj — iki dosya sürükleyip bırakıldı', git: 'mesajlar', tam: false,
        eylem: `__tikla('[data-act="mesaj-yeni"]'); ${bekleJs(700)} __yaz('#mKonu', 'Müze gezisi'); var b = document.querySelector('#modalKok .ek-birak'); if (!b) throw new Error('ek kutusu yok'); var dt = new DataTransfer(); var pdf = new Uint8Array(180000); pdf.set([37, 80, 68, 70, 45, 49, 46, 52, 10]); dt.items.add(new File([pdf], 'Gezi izin formu.pdf', { type: 'application/pdf' })); var jpg = new Uint8Array(420000); jpg.set([255, 216, 255, 224]); dt.items.add(new File([jpg], 'Sınıf fotoğrafı.jpg', { type: 'image/jpeg' })); b.dispatchEvent(new DragEvent('drop', { bubbles: true, cancelable: true, dataTransfer: dt })); ${bekleJs(2500)}` },
      { ad: 'Yeni ödev — ek dosyayla', git: 'ogr-odevler', tam: false,
        eylem: `__tikla('[data-act="odev-yeni"]'); ${bekleJs(900)} var b = document.querySelector('#modalKok .ek-birak'); if (!b) throw new Error('ek kutusu yok'); var dt = new DataTransfer(); var pdf = new Uint8Array(180000); pdf.set([37, 80, 68, 70, 45, 49, 46, 52, 10]); dt.items.add(new File([pdf], 'Gezi izin formu.pdf', { type: 'application/pdf' })); var jpg = new Uint8Array(420000); jpg.set([255, 216, 255, 224]); dt.items.add(new File([jpg], 'Sınıf fotoğrafı.jpg', { type: 'image/jpeg' })); b.dispatchEvent(new DragEvent('drop', { bubbles: true, cancelable: true, dataTransfer: dt })); ${bekleJs(2500)}` },
      { ad: 'Ödev kontrolü (sonuçlanmış, 6 sonuç türü)', git: 'ogr-odevler', eylem: `__satirdaTikla('Kesirler alıştırması', '[data-act="odev-ac"]')` },
      { ad: 'Sonuçlanmış ödevi düzenleme penceresi', git: 'ogr-odevler', tam: false,
        eylem: `__satirdaTikla('Kesirler alıştırması', '[data-act="odev-ac"]'); ${bekleJs(900)} __tikla('[data-act="odev-duzelt"]')` },
      { ad: 'Ödev kontrolü (aktif, açıldı / açılmadı)', git: 'ogr-odevler', eylem: `__satirdaTikla('Geometri problemleri', '[data-act="odev-ac"]')` },
      { ad: 'Ödev kontrolü — öğrencinin altında "3 ek"', git: 'ogr-odevler', eylem: `__satirdaTikla('Oran orantı', '[data-act="odev-ac"]'); ${bekleJs(1500)}` },
      { ad: 'Öğrencinin ekleri: simge ve MB (hiçbiri kendiliğinden inmez)', git: 'ogr-odevler', tam: false,
        eylem: `__satirdaTikla('Oran orantı', '[data-act="odev-ac"]'); ${bekleJs(1500)} __tikla('[data-act="teslim-ogrenci"]'); ${bekleJs(900)}` },
      { ad: 'Fotoğrafa tıklayınca burada açılır', git: 'ogr-odevler', tam: false,
        eylem: `__satirdaTikla('Oran orantı', '[data-act="odev-ac"]'); ${bekleJs(1500)} __tikla('[data-act="teslim-ogrenci"]'); ${bekleJs(900)} __tikla('.teslim-oge.resim'); ${bekleJs(1500)}` },
      { ad: 'Videoya tıklayınca oynatıcı açılır', git: 'ogr-odevler', tam: false,
        eylem: `__satirdaTikla('Oran orantı', '[data-act="odev-ac"]'); ${bekleJs(1500)} __tikla('[data-act="teslim-ogrenci"]'); ${bekleJs(900)} __tikla('.teslim-oge.video'); ${bekleJs(1500)}` },
      { ad: 'Ödev kontrolü — seçilmemişlerin hepsi: Yaptı', git: 'ogr-odevler',
        eylem: `__satirdaTikla('Denklem çalışması', '[data-act="odev-ac"]'); ${bekleJs(900)} __yaz('.sonuc-kutu', 'gec', 1); __yaz('.sonuc-kutu', 'izinli', 2); __tikla('[data-act="sonuc-hepsi"]')` },
      { ad: 'Sınavlar', git: 'ogr-sinavlar', eylem: `__tikla('[data-act="sinav-sekme"][data-val="sinavlar"]')` },
      { ad: 'Şablondan sınav: LGS (7 alan, virgüllü)', git: 'ogr-sinavlar',
        eylem: `__tikla('[data-act="sinav-sekme"][data-val="sinavlar"]'); ${bekleJs(900)} __satirdaTikla('LGS Deneme 5', '[data-act="sinav-ac"]')` },
      { ad: 'Şablondan sınav: Test (doğru / yanlış / net)', git: 'ogr-sinavlar',
        eylem: `__tikla('[data-act="sinav-sekme"][data-val="sinavlar"]'); ${bekleJs(900)} __satirdaTikla('Üslü Sayılar Testi', '[data-act="sinav-ac"]')` },
      { ad: 'Şablondan sınav: Yazılı (0-100)', git: 'ogr-sinavlar',
        eylem: `__tikla('[data-act="sinav-sekme"][data-val="sinavlar"]'); ${bekleJs(900)} __satirdaTikla('Matematik 2. Yazılı', '[data-act="sinav-ac"]')` },
      { ad: 'Değer tablosu — hatalı değer kırmızı, değişen mavi', git: 'ogr-sinavlar',
        eylem: `__tikla('[data-act="sinav-sekme"][data-val="sinavlar"]'); ${bekleJs(900)} __satirdaTikla('LGS Deneme 5', '[data-act="sinav-ac"]'); ${bekleJs(1200)} __yaz('.deger[data-kod="LGS"]', '612'); __yaz('.deger[data-kod="TR"]', '17,5', 1); __tikla('[data-act="sinav-deger-kaydet"]')` },
      { ad: 'Değer alanları — + Yeni değer ekle', git: 'ogr-sinavlar', tam: false,
        eylem: `__tikla('[data-act="sinav-sekme"][data-val="sinavlar"]'); ${bekleJs(900)} __satirdaTikla('Üslü Sayılar Testi', '[data-act="sinav-ac"]'); ${bekleJs(1200)} __tikla('[data-act="sinav-olcum-duzenle"]'); __tikla('[data-act="olcum-ekle"]'); __yaz('#olcumListe .o-ad', 'Boş', 3)` },
      { ad: 'Yeni sınav penceresi (şablon seçimi)', git: 'ogr-sinavlar', tam: false,
        eylem: `__tikla('[data-act="sinav-sekme"][data-val="sinavlar"]'); ${bekleJs(900)} __tikla('[data-act="sinav-yeni"]')` },
      { ad: 'Sınav grupları', git: 'ogr-sinavlar', eylem: `__tikla('[data-act="sinav-sekme"][data-val="gruplar"]')` },
      { ad: 'Yeni sınav grubu penceresi', git: 'ogr-sinavlar', tam: false,
        eylem: `__tikla('[data-act="sinav-sekme"][data-val="gruplar"]'); ${bekleJs(900)} __tikla('[data-act="grup-yeni"]')` },
      { ad: 'Grup ortalamaları (100 üzerinden)', git: 'ogr-sinavlar',
        eylem: `__tikla('[data-act="sinav-sekme"][data-val="gruplar"]'); ${bekleJs(900)} __tikla('[data-act="grup-ac"]')` },
      { ad: 'Şablonlar (Yazılı, Test, LGS, kendi şablonu)', git: 'ogr-sinavlar', eylem: `__tikla('[data-act="sinav-sekme"][data-val="sablonlar"]')` },
      { ad: 'Yeni şablon penceresi', git: 'ogr-sinavlar', tam: false,
        eylem: `__tikla('[data-act="sinav-sekme"][data-val="sablonlar"]'); ${bekleJs(900)} __tikla('[data-act="sablon-yeni"]'); __tikla('[data-act="olcum-ekle"]'); __tikla('[data-act="olcum-ekle"]'); __yaz('#olcumListe .o-ad', 'Doğru', 1); __yaz('#olcumListe .o-ad', 'Yanlış', 2); __yaz('#mAd', 'Kısa Sınav (10 soru)')` },
      { ad: 'Şablonu düzenleme penceresi', git: 'ogr-sinavlar', tam: false,
        eylem: `__tikla('[data-act="sinav-sekme"][data-val="sablonlar"]'); ${bekleJs(900)} __tikla('[data-act="sablon-duzenle"]')` },
      { ad: 'Yoklama — ders seçimi', git: 'yoklama' },
      { ad: 'Yoklama ekranı', git: 'yoklama', eylem: `__tikla('[data-act="yoklama-ders"]')` },
      { ad: 'Etütler', git: 'etutler' },
      { ad: 'Etüt yoklaması (geldi / izinli / izinsiz)', git: 'etutler', eylem: `__tikla('[data-act="etut-yoklama-ac"]')` },
      { ad: 'Anketler', git: 'anketler' },
      { ad: 'Yemek listesi', git: 'yemek' },
      { ad: 'Kulüpler (danışmanı olduğu)', git: 'kulupler' },
      { ad: 'Hatırlatıcılar (öğretmen)', git: 'hatirlaticilar' },
      { ad: 'Ayarlar', git: 'profil' }
    ],
    koyu: ['ogr-odevler|Ödev kontrolü (koyu)|__satirdaTikla(\'Kesirler alıştırması\', \'[data-act="odev-ac"]\')',
      'ogr-sinavlar|Değer tablosu (koyu)|__tikla(\'[data-act="sinav-sekme"][data-val="sinavlar"]\'); ' + bekleJs(900) + ' __satirdaTikla(\'LGS Deneme 5\', \'[data-act="sinav-ac"]\')',
      'ana|Ana sayfa (koyu)|'],
    telefon: [{ git: 'ogr-odevler', ad: 'Yeni ödev — takvim (telefon)', tam: false,
        eylem: `__tikla('[data-act="odev-yeni"]'); ${bekleJs(1200)} __tikla('#mBitDugme'); ${bekleJs(1200)}` },
      'ogr-odevler|Ödev kontrolü (telefon)|__satirdaTikla(\'Kesirler alıştırması\', \'[data-act="odev-ac"]\')',
      'ogr-sinavlar|Değer tablosu (telefon)|__tikla(\'[data-act="sinav-sekme"][data-val="sinavlar"]\'); ' + bekleJs(900) + ' __satirdaTikla(\'LGS Deneme 5\', \'[data-act="sinav-ac"]\')',
      'yoklama|Yoklama (telefon)|__tikla(\'[data-act="yoklama-ders"]\')',
      'etutler|Etüt yoklaması (telefon)|__tikla(\'[data-act="etut-yoklama-ac"]\')']
  },
  {
    /* Aynı öğretmen, yöneticinin açtığı ikinci okulda. */
    ad: 'ogretmen-ikinci-okul', baslik: 'Öğretmen — ikinci okulu', eposta: 'mat@test.com', sifre: 'Test1234!',
    gec: okulRolu('teacher', 'deneme-anadolu'),
    adimlar: [
      { ad: 'Ana sayfa (Deneme Anadolu Lisesi)', git: 'ana' },
      { ad: 'Hesap değiştir: ikinci okulda', git: 'kisilikler' },
      { ad: 'Ödevler (bu okulun)', git: 'ogr-odevler' }
    ]
  },
  {
    /* Müdür ödev ve etüdü kapatınca öğretmenin gördüğü (turdan sonra yeniden açılır). */
    ad: 'ozellik-kapali', baslik: 'Okul ödev ve etüdü kapatınca (öğretmen)', eposta: 'mat@test.com', sifre: 'Test1234!',
    gec: okulRolu('teacher', 'test-ortaokulu'),
    once: () => ozellikYaz(['odev', 'etut']),
    sonra: () => ozellikYaz([]),
    adimlar: [
      { ad: 'Ana sayfa (Ödevler kutucuğu yok)', git: 'ana' },
      { ad: 'Kapalı bölümün adresi açılınca', git: 'ogr-odevler', eylem: `location.hash = '#/ogr-odevler'; ${bekleJs(600)}` }
    ],
    telefon: ['ana|Menü (telefon)|document.getElementById(\'hamburger\').click();']
  },
  {
    /* Test Ortaokulu'ndan nakil gelen öğrenci: eski okulun kayıtları yıl seçicide. */
    ad: 'nakil-ogrenci', baslik: 'Nakil gelen öğrenci', eposta: HESAPLAR.nakil.kullanici, sifre: HESAPLAR.nakil.sifre,
    okul: 'deneme-anadolu',
    adimlar: [
      { ad: 'Ana sayfa (yeni okul)', git: 'ana' },
      { ad: 'Ödevler (yeni okulda, eski okulun ödevi yok)', git: 'odevler' },
      { ad: 'Yıl seçici — önceki okullar', git: 'odevler', tam: false,
        eylem: `var s = document.getElementById('yilSec'); if (!s) throw new Error('yıl seçici yok'); s.focus(); s.size = s.options.length;` },
      { ad: 'Önceki okulun ödevleri (salt okunur)', git: 'odevler',
        eylem: `var s = document.getElementById('yilSec'); var o = s && s.querySelector('optgroup option'); if (!o) throw new Error('önceki okul seçeneği yok'); s.value = o.value; s.dispatchEvent(new Event('change', { bubbles: true })); ${bekleJs(1500)}` },
      { ad: 'Önceki okulun sınav notu', git: 'sinavlarim' },
      { ad: 'Şimdiki okula dönüş', git: 'odevler',
        eylem: `var s = document.getElementById('yilSec'); var o = s && s.querySelector('option:not(optgroup option)'); if (o) { s.value = o.value; s.dispatchEvent(new Event('change', { bubbles: true })); } ${bekleJs(1500)}` }
    ],
    telefon: ['odevler|Ödevler — yıl seçici (telefon)|']
  },
  {
    ad: 'ogrenci', baslik: 'Öğrenci', eposta: 'ogrenci1@test.com', sifre: 'Test1234!',
    adimlar: [
      { ad: 'Ana sayfa', git: 'ana' },
      { ad: 'Takvim', git: 'takvim' },
      { ad: 'Mesajlar', git: 'mesajlar' },
      { ad: 'Duyuru okuma', git: 'mesajlar', eylem: `__tikla('[data-act="mesaj-ac"]', 'Veli toplantısı')` },
      { ad: 'Düzeltilmiş mesaj (düzenlendi yazar)', git: 'mesajlar', eylem: `__tikla('[data-act="mesaj-ac"]', 'Yarınki matematik')` },
      { ad: 'Ekli mesaj (belge ve resim, silinme günü)', git: 'mesajlar', eylem: `__tikla('[data-act="mesaj-ac"]', 'Müze gezisi')` },
      { ad: 'Ders programı', git: 'programim' },
      { ad: 'Ödevler (üstte ödev serisi; açılmamışlar turuncu, yıldızlı ödev)', git: 'odevler' },
      { ad: 'Ödevler — süzgeç: yıldızlı', git: 'odevler', eylem: `__yaz('#fYildiz', 'var')` },
      { ad: 'Ödevler — süzgeç: açılmamış', git: 'odevler', eylem: `__yaz('#fDurum', 'acilmadi')` },
      { ad: 'Ödevler — süzgeç: geç yaptı', git: 'odevler', eylem: `__yaz('#fDurum', 'gec')` },
      { ad: 'Sınavlarım (grafik + şablonlu sınavlar)', git: 'sinavlarim' },
      { ad: 'Sınav grafiği — başka değer (Matematik Net)', git: 'sinavlarim', eylem: `${bekleJs(800)} __tikla('[data-act="sg-olcum"]', 'Matematik Net')` },
      { ad: 'Sınav grafiği — liste görünümü', git: 'sinavlarim', eylem: `${bekleJs(800)} __tikla('[data-act="sg-gorunum"][data-val="liste"]')` },
      { ad: 'İlerleyişim (ödev sonuç grafiği)', git: 'ilerleyisim' },
      { ad: 'İlerleyişim — derslere göre', git: 'ilerleyisim', eylem: `__tikla('[data-act="odev-grafik-sekme"][data-val="ders"]')` },
      { ad: 'Devamsızlığım', git: 'devamsizligim' },
      { ad: 'Etütlerim (yoklama sonuçları)', git: 'etutlerim' },
      { ad: 'Anketler (oy verildi)', git: 'anketler' },
      { ad: 'Hatırlatıcılar (haftalık, her gün, bir kez, ayda bir)', git: 'hatirlaticilar' },
      { ad: 'Yeni hatırlatıcı — haftanın günleri ve saat', git: 'hatirlaticilar', tam: false,
        eylem: `__tikla('[data-act="hatirlatici-yeni"]'); ${bekleJs(500)} __yaz('#hBaslik', 'Matematik etüdüne git'); document.querySelector('.h-gun[value="4"]').click();` },
      { ad: 'Yeni hatırlatıcı — ayda bir', git: 'hatirlaticilar', tam: false,
        eylem: `__tikla('[data-act="hatirlatici-yeni"]'); ${bekleJs(500)} __yaz('#hBaslik', 'Servis ücreti'); document.querySelector('input[name="hSiklik"][value="her-ay"]').click();` },
      { ad: 'Yemek listesi', git: 'yemek' },
      { ad: 'Servisim (harita, durak)', git: 'servis' },
      { ad: 'Kulüpler (üye)', git: 'kulupler' },
      { ad: 'Ayarlar (veli kodu)', git: 'profil' }
    ],
    koyu: ['ilerleyisim|İlerleyişim (koyu)|', 'odevler|Ödevler (koyu)|', 'sinavlarim|Sınavlarım (koyu)|'],
    telefon: ['ana|Ana sayfa (telefon)|', 'odevler|Ödevler (telefon, yıldızlar)|', 'ilerleyisim|İlerleyişim (telefon)|',
      'sinavlarim|Sınavlarım (telefon)|', 'etutlerim|Etütlerim (telefon)|'],
    /* En sona: ödevi açmak onu "açıldı" yapar, önceki fotoğraflarda turuncu kalsın */
    son: [{ ad: 'Ödev ayrıntısı (açılınca turuncu kalkar)', git: 'odevler', tam: false, eylem: `__tikla('.satir.acilmadi')` },
      { ad: 'Ödevler — açtıktan sonra', git: 'odevler' },
      { ad: 'Ödevin ekleri (silinme günüyle)', git: 'odevler', tam: false, eylem: `__tikla('[data-act="odev-oku"]', 'Oran orantı')` }]
  },
  {
    ad: 'veli', baslik: 'Veli (iki çocuk)', eposta: HESAPLAR.veli.eposta, sifre: HESAPLAR.veli.sifre,
    adimlar: [
      { ad: 'Hesap seçimi (iki çocuk)', git: 'kisilikler' },
      { ad: 'Çocuğumun telefonu: konum, ekran süresi, sınırlar (Eğitim Evi Aile)', git: 'aile' },
      { ad: 'Bildirimler (her bildirimin başında hangi çocuk olduğu yazar)', git: 'ana', tam: false, eylem: `__tikla('#btnBildirim'); ${bekleJs(800)}` },
      { ad: 'Ana sayfa', git: 'ana' },
      { ad: 'Çocuklarım', git: 'cocuklarim' },
      { ad: 'Ödevler (iki çocuk, kimin olduğu yazar)', git: 'veli-odevler' },
      { ad: 'Ödevler — tek çocuk', git: 'veli-odevler', eylem: `__tikla('[data-act="veli-cocuk"]', 'Zeynep')` },
      { ad: 'Devamsızlık', git: 'veli-devamsizlik', eylem: `__tikla('[data-act="veli-cocuk"]', 'Hepsi')` },
      { ad: 'İlerleyiş (çocuk çocuk grafikler)', git: 'veli-ilerleyis' },
      { ad: 'Etütler', git: 'etutlerim' },
      { ad: 'Mesajlar', git: 'mesajlar' },
      { ad: 'Takvim', git: 'takvim' },
      { ad: 'Anketler', git: 'anketler' },
      { ad: 'Yemek listesi', git: 'yemek' },
      { ad: 'Servis', git: 'servis' },
      { ad: 'Kulüpler', git: 'kulupler' },
      { ad: 'Ayarlar (hesap bilgisi, telefon ülke kodu)', git: 'profil' }
    ],
    son: [{ ad: 'Çocuğun kartına tıklayınca portalı (ödevleri, notları)', git: 'cocuklarim', eylem: `__tikla('[data-act="cocuk-ac"]'); ${bekleJs(1500)}` }],
    koyu: ['veli-ilerleyis|İlerleyiş (koyu)|'],
    telefon: ['kisilikler|Hesap seçimi (telefon)|', 'veli-odevler|Ödevler (telefon)|', 'veli-ilerleyis|İlerleyiş (telefon)|']
  },
  {
    ad: 'servisci', baslik: 'Servisçi', eposta: HESAPLAR.servisci.kullanici, sifre: HESAPLAR.servisci.sifre, okul: 'test-ortaokulu',
    adimlar: [
      { ad: 'Ana sayfa', git: 'ana' },
      { ad: 'Servisim (öğrenciler, duraklar)', git: 'servis' },
      { ad: 'Mesajlar', git: 'mesajlar' }
    ],
    telefon: ['ana|Ana sayfa (telefon)|', 'servis|Servisim (telefon)|']
  },
  {
    /* Kaydolmuş, henüz hiçbir rolü olmayan yetişkin (zengin-veri.js: Kemal Arslan). */
    ad: 'rolsuz', baslik: 'Yeni yetişkin hesabı', eposta: 'kemal.arslan', sifre: 'Ogretmen2026!',
    adimlar: [
      { ad: 'Başlangıç: nasıl devam edeceksin?', git: 'kisilikler' },
      { ad: 'Ekle penceresi', git: 'kisilikler', tam: false, eylem: `__tikla('[data-act="kisilik-ekle"]')` },
      { ad: 'Ekle — çocuğumu ekle (veli kodu)', git: 'kisilikler', tam: false,
        eylem: `__tikla('[data-act="kisilik-ekle"]'); ${bekleJs(500)} __tikla('[data-act="ekle-sec"][data-tur="cocuk"]')` },
      { ad: 'Ekle — okulumu kaydet: yazım hatalı arama', git: 'kisilikler', tam: false,
        eylem: `__tikla('[data-act="kisilik-ekle"]'); ${bekleJs(500)} __tikla('[data-act="ekle-sec"][data-tur="okul"]'); ${bekleJs(900)} __yaz('#bOkulAra', 'ataturk ortaoklu cankaya'); ${bekleJs(1500)}` },
      { ad: 'Ayarlar', git: 'profil' }
    ],
    koyu: ['kisilikler|Başlangıç (koyu)|'],
    telefon: ['kisilikler|Başlangıç (telefon)|']
  },
  {
    /* Yöneticinin açtığı okulun müdürü, ilk giriş: kendi şifresini belirlemeden giremez. */
    ad: 'yeni-mudur', baslik: 'Yöneticinin açtığı okulun müdürü', eposta: HESAPLAR.yeniMudur.eposta,
    sifre: HESAPLAR.yeniMudur.ilkSifre, pencereli: true,
    adimlar: [
      { ad: 'İlk giriş — önce aydınlatma metni onayı', tam: false, pencereKalsin: true },
      { ad: 'Onaydan sonra — kendi şifreni belirle', tam: false, pencereKalsin: true,
        eylem: `var k = document.getElementById('kvkkYeniKutu'); if (k) { k.checked = true; __tikla('[data-act="kvkk-onayla"]'); } ${bekleJs(1500)}` },
      { ad: 'Şifre kuralları işaretleniyor', tam: false, pencereKalsin: true, eylem: `__yaz('#zYeni', 'Selin2026')` }
    ]
  },
  {
    ad: 'admin', baslik: 'Yönetici', eposta: 'admin@egitimevi.com', sifre: 'admin123',
    adimlar: [
      { ad: 'Ana sayfa', git: 'ana' },
      { ad: 'Onay bekleyenler (yaş, hesap tarihi, telefon)', git: 'onaylar' },
      { ad: 'Müdürler', git: 'mudurler' },
      { ad: 'Okullar', git: 'okullar' },
      { ad: 'Okul aç penceresi', git: 'okullar', tam: false, eylem: `__tikla('[data-act="admin-okul-ac"]')` },
      { ad: 'Okul aç — okul seçildi, adres önerildi, rastgele şifre', git: 'okullar', tam: false,
        eylem: `__tikla('[data-act="admin-okul-ac"]'); ${bekleJs(700)} __yaz('#bIl', 'Ankara'); ${bekleJs(700)} __yaz('#bOkulAra', 'cumhuriyet ortaoklu'); ${bekleJs(1500)} __tikla('#bOkulSonuc [data-okul-id]'); ${bekleJs(300)} document.getElementById('aoKisa').dispatchEvent(new Event('focus')); __yaz('#aoEposta', 'yeni.mudur@okul.test'); __yaz('#aoAd', 'Deniz'); __yaz('#aoSoyad', 'Aydın'); __yaz('#aoKadi', 'deniz.aydin'); __tikla('[data-act="admin-sifre-uret"]')` },
      { ad: 'Yedekler (elle yedek alındı)', git: 'yedekler', eylem: `__tikla('[data-act="yedek-al"]')` },
      { ad: 'Açılış sayfası yorumları (gizle / göster)', git: 'yorumlar' },
      { ad: 'İşlem kaydı', git: 'islem-kaydi' },
      { ad: 'Ayarlar', git: 'profil' }
    ],
    son: [
      { ad: 'Üstteki ay düğmesi — koyu görünüme geçti', git: 'ana', tema: 'serbest', eylem: `__tikla('#btnTema')` },
      { ad: 'Güneş düğmesi — açık görünüme döndü', git: 'ana', tema: 'serbest', eylem: `__tikla('#btnTema')` }
    ],
    koyu: ['ana|Ana sayfa (koyu)|', 'okullar|Okullar (koyu)|'],
    telefon: ['onaylar|Onay bekleyenler (telefon)|']
  }
];

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
  { ad: 'İndir — Android sürümleri ve iPhone', url: '/indir', eylem: bekleJs(800) },
  { ad: "İndir — iPhone'a ekle adımları", url: '/indir', tam: false,
    eylem: `${bekleJs(600)} __tikla('#iosEkle'); ${bekleJs(400)} document.getElementById('iphone').scrollIntoView();` },
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
  { ad: 'Sık sorulan sorular (telefon)', url: '/sss' }, { ad: 'İndir (telefon)', url: '/indir' },
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

/* Albüm: ekranlarla kılavuz. Önce müdürün bölümü (okulu kuran ve yöneten),
   sonra dış sayfalar ve öteki roller. Her fotoğrafın altında ne gösterdiği
   yazar (gezinti-metin.js). Sorun ölçümleri burada değil, rapordadır. */
function albumYaz(album, tum) {
  /* İki kısım: önce bilgisayar görünümü (açık ve koyu), sonra telefon görünümü;
     ikisi karışmaz. Her kısımda sıra: müdür, dış sayfalar, öteki roller. */
  const SIRA = ['mudur', 'giris'];
  const gruplar = album.slice().sort((a, b) => {
    const x = SIRA.indexOf(a.klasor), y = SIRA.indexOf(b.klasor);
    return (x < 0 ? 99 : x) - (y < 0 ? 99 : y);
  });
  const metin = (klasor, ad) => ADIM_METNI[klasor + '|' + ad] || ADIM_METNI['*|' + ad] || null;
  /* Eğitim Evi Aile uygulamasının öykünücüde çekilmiş ekranları (varsa) telefon kısmına eklenir. */
  const uygKlasor = path.join(CIKTI, 'aile-uygulamasi');
  if (fs.existsSync(uygKlasor)) {
    const kayitlar = fs.readdirSync(uygKlasor).filter(f => /\.png$/.test(f)).sort()
      .map(f => ({ ad: (UYGULAMA_EKRANLARI[f] || f), dosya: 'aile-uygulamasi/' + f }));
    if (kayitlar.length) gruplar.push({ rol: 'Eğitim Evi Aile uygulaması', klasor: 'aile-uygulamasi', kayitlar });
  }
  const telefonMu = k => /(^|\/)\d+-(koyu-)?telefon-/.test(k.dosya) || /^aile-uygulamasi\//.test(k.dosya);
  const eksik = [];
  const KISIMLAR = [
    { k: 'bilgisayar', baslik: 'Bilgisayar görünümü', telefon: false,
      giris: ROL_METNI._bilgisayar || 'Bütün ekranlar önce bilgisayarda (1440 piksel genişlik), açık ve koyu görünümle.' },
    { k: 'telefon', baslik: 'Telefon görünümü', telefon: true,
      giris: ROL_METNI._telefon || 'Aynı ekranlar telefonda (390 piksel genişlik). Görüntüleyicide telefon ekranı boyunda açılır; fare tekerleğiyle aşağı kaydırarak okunur.' }
  ];

  /* Görüntüleyici için bütün fotoğraflar tek sırada: kısım → rol → adım. */
  const fotolar = [];
  let govde = '';
  let icindekiler = '';
  for (const kisim of KISIMLAR) {
    let kisimHtml = '';
    let kisimVar = false;
    icindekiler += '<span class="ic-kisim">' + esc(kisim.baslik) + '</span>';
    for (const g of gruplar) {
      const kayitlar = g.kayitlar.filter(k => telefonMu(k) === kisim.telefon);
      if (!kayitlar.length) continue;
      kisimVar = true;
      const r = ROL_METNI[g.klasor] || {};
      const bolumId = kisim.k + '-' + g.klasor;
      icindekiler += '<a href="#' + bolumId + '">' + esc(r.baslik || g.rol) + '</a>';
      kisimHtml += '<section class="bolum" id="' + bolumId + '"><div class="bolum-bas"><h3>' + esc(r.baslik || g.rol) + '</h3>' +
        (r.giris && !kisim.telefon ? '<p>' + r.giris + '</p>' : '') + '</div><div class="izgara' + (kisim.telefon ? ' tel' : '') + '">';
      let altBolum = '';
      kayitlar.forEach(k => {
        const m = metin(g.klasor, k.ad);
        if (!m) eksik.push(g.klasor + '|' + k.ad);
        if (m && m.bolum && !kisim.telefon) {
          altBolum = m.bolum;
          kisimHtml += '</div><h4 class="alt-bolum">' + esc(m.bolum) + '</h4><div class="izgara">';
        }
        const i = fotolar.length;
        fotolar.push({ s: k.dosya, b: k.ad, r: r.baslik || g.rol, a: altBolum, m: (m && m.metin) || '', t: kisim.telefon ? 1 : 0 });
        kisimHtml += '<figure><a class="foto" href="' + esc(k.dosya) + '" data-i="' + i + '"><img loading="lazy" src="' +
          esc(k.dosya) + '" alt="' + esc(k.ad) + '"></a><figcaption><b>' + esc(k.ad) + '</b>' +
          (m && m.metin ? '<p>' + m.metin + '</p>' : '') + '</figcaption></figure>';
      });
      kisimHtml += '</div></section>';
    }
    if (kisimVar) {
      govde += '<section class="kisim" id="' + kisim.k + '"><div class="kisim-bas"><p class="etiket">' +
        (kisim.telefon ? 'İkinci kısım' : 'Birinci kısım') + '</p><h2>' + esc(kisim.baslik) + '</h2><p>' + kisim.giris + '</p></div>' +
        kisimHtml + '</section>';
    }
  }

  const h = '<!DOCTYPE html><html lang="tr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">' +
    '<title>Eğitim Evi — ekranlarla kılavuz</title><meta name="description" content="Eğitim Evi okul portalının bütün ekranları: ' +
    'müdürün gözünden okul yönetimi, öğretmen, öğrenci, veli ve servisçi; önce bilgisayar, sonra telefon görünümü.">' +
    '<style>' + ALBUM_CSS + '</style></head><body>' +
    '<header class="ust"><div class="ic"><p class="etiket">Eğitim Evi · ekranlarla kılavuz</p>' +
    '<h1>Bir okul Eğitim Evi\'ni nasıl kullanır?</h1>' +
    '<p class="giris">' + ROL_METNI._giris + '</p>' +
    '<p class="not">' + fotolar.length + ' ekran · Fotoğraflar gerçek bir tarayıcıda çekildi; içlerindeki bütün kişiler, okullar, ' +
    'notlar ve şifreler <b>test verisidir</b>. Bir fotoğrafa tıklayınca büyük açılır: <kbd>←</kbd> <kbd>→</kbd> ile önceki ve sonraki ' +
    'ekrana geçilir, fare tekerleğiyle aşağı kaydırılır, <kbd>Esc</kbd> ile kapanır.</p></div></header>' +
    '<nav class="icindekiler" aria-label="Bölümler"><div class="ic">' + icindekiler + '</div></nav>' +
    '<main>' + govde + '</main>' +
    '<footer class="alt"><div class="ic">Eğitim Evi · açık kaynak okul portalı · ' +
    '<a href="https://github.com/KARANKOYU/Egitim-Evi">GitHub</a> · Bu sayfayı <code>araclar/gezinti.js</code> üretir.</div></footer>' +
    '<div class="gosterici" id="gosterici" role="dialog" aria-modal="true" aria-labelledby="gBaslik" hidden>' +
    '<div class="g-ust"><div class="g-bilgi"><p class="g-yer" id="gYer"></p><h2 id="gBaslik"></h2><p class="g-metin" id="gMetin"></p></div>' +
    '<div class="g-dugmeler"><span class="g-sayac" id="gSayac"></span>' +
    '<button type="button" id="gOnceki" title="Önceki (sol ok)" aria-label="Önceki ekran">&#8592;</button>' +
    '<button type="button" id="gSonraki" title="Sonraki (sağ ok)" aria-label="Sonraki ekran">&#8594;</button>' +
    '<button type="button" id="gKapat" title="Kapat (Esc)" aria-label="Kapat">&#215;</button></div></div>' +
    '<div class="g-sahne" id="gSahne" tabindex="-1"><div class="g-cerceve" id="gCerceve" tabindex="0"><img id="gResim" alt=""></div></div></div>' +
    '<script>var FOTOLAR = ' + JSON.stringify(fotolar).replace(/</g, '\\u003c') + ';\n' + ALBUM_JS + '</script>' +
    '</body></html>';
  fs.writeFileSync(path.join(CIKTI, 'index.html'), h, 'utf8');
  if (eksik.length) console.log('  ! anlatımı olmayan ' + eksik.length + ' adım: ' + eksik.slice(0, 8).join(' · ') + (eksik.length > 8 ? ' ...' : ''));
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
