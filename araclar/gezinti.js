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

