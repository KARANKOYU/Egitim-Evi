'use strict';
/* Sunucu girişi: node sunucu/index.js
   Veriyi ve ayarları yükler, HTTP sunucusunu açar, zamanlayıcıları kurar. */

const http = require('http');
const { handleApi } = require('./api');
const { ayarlar, ayarlariYukle, epostaKurulu } = require('./ayarlar');
const { guvenlikTemizle, hizSinir, istemciIp } = require('./guvenlik');
const { HATIRLATMA_ARALIK_MS, hatirlatmalariCalistir } = require('./hatirlatma');
const { bad, baslikEkle, serveStatic } = require('./http');
const { okullariYukle } = require('./okullar');
const { YEDEK_ARALIK_MS, loadDB, saveNow, yedekKontrol } = require('./veri');
const { HOST, PORT } = require('./yollar');

loadDB();
ayarlariYukle();
okullariYukle();

const server = http.createServer((req, res) => {
  const method = req.method || 'GET';
  const urlPath = (req.url || '/').split('?')[0];
  const ip = istemciIp(req);

  /* Genel hiz siniri: tek bir IP sunucuyu istek yagmuruna tutamasin.
     Normal kullanimda bir sayfa ~10 istek atar, 300/dk fazlasiyla yeterli. */
  if (!hizSinir('genel:' + ip, 300, 60 * 1000)) {
    res.writeHead(429, baslikEkle({
      'Content-Type': 'application/json; charset=utf-8',
      'Retry-After': '60'
    }));
    return res.end(JSON.stringify({ error: 'Çok fazla istek gönderdin. Bir dakika bekle.' }));
  }

  if (urlPath.indexOf('/api/') === 0) {
    const segs = urlPath.split('/').filter(Boolean);
    Promise.resolve()
      .then(() => handleApi(req, res, segs, method))
      .catch(err => {
        const mesaj = (err && err.message) ? err.message : 'Sunucu hatası';
        /* Beklenen istemci hataları (çok büyük gövde, bozuk JSON) 500 değil:
           500 sunucunun kendi hatası demektir, günlüğü kirletmesin. */
        const kod = (err && err.kod) ? err.kod
          : (/çok büyük|Geçersiz veri/i.test(mesaj) ? 400 : 500);
        if (kod === 500) console.error('API hatası:', mesaj);
        if (!res.headersSent) bad(res, mesaj, kod);
      });
    return;
  }
  if (method !== 'GET' && method !== 'HEAD') { res.writeHead(405); return res.end(); }
  serveStatic(req, res, urlPath);
});

/* Slowloris: yavas istemci baglantilari acik tutup kaynak tuketemesin. */
server.headersTimeout = 20 * 1000;
server.requestTimeout = 30 * 1000;
server.keepAliveTimeout = 10 * 1000;
server.maxHeadersCount = 60;
server.maxConnections = 512;

/* Suresi gecmis oturumlari, hiz kayitlarini ve bot sorularini temizle. */
const temizlikSayaci = setInterval(guvenlikTemizle, 10 * 60 * 1000);
if (temizlikSayaci.unref) temizlikSayaci.unref();

/* Ders ve ödev hatırlatmaları */
const hatirlatmaSayaci = setInterval(hatirlatmalariCalistir, HATIRLATMA_ARALIK_MS);
if (hatirlatmaSayaci.unref) hatirlatmaSayaci.unref();

/* Günlük yedek */
const yedekSayaci = setInterval(yedekKontrol, YEDEK_ARALIK_MS);
if (yedekSayaci.unref) yedekSayaci.unref();
setTimeout(yedekKontrol, 20 * 1000);
setTimeout(hatirlatmalariCalistir, 10 * 1000);   // açılıştan kısa süre sonra bir kez

server.on('error', err => {
  if (err.code === 'EADDRINUSE') {
    console.error('\n  HATA: ' + PORT + ' portu kullanımda. Zaten açık olan pencereyi kapat veya');
    console.error('  farklı port ile başlat:  set PORT=3001 && node server.js\n');
  } else {
    console.error('Sunucu hatası:', err.message);
  }
  process.exit(1);
});

server.listen(PORT, HOST, () => {
  const nets = require('os').networkInterfaces();
  console.log('');
  console.log('  ==========================================');
  console.log('     EGITIM EVI calisiyor');
  console.log('     Bilgisayardan : http://localhost:' + PORT);
  for (const name in nets) {
    for (const n of nets[name]) {
      if (n.family === 'IPv4' && !n.internal) console.log('     Telefondan    : http://' + n.address + ':' + PORT);
    }
  }
  if (ayarlar.site && ayarlar.site.adres) {
    console.log('     Internetten   : ' + ayarlar.site.adres);
  }
  if (ayarlar.vekil && ayarlar.vekil.guven) {
    console.log('     Vekil guveni acik (' + ayarlar.vekil.baslik + ') - ters vekil arkasinda');
  }
  if (epostaKurulu()) {
    console.log('     Giris kodlari e-posta ile gonderilecek (' + ayarlar.eposta.sunucu + ')');
  } else {
    console.log('     ! E-posta ayarlanmamis: giris kodlari BU PENCEREYE yazilacak.');
    console.log('       Ayarlamak icin: data/ayarlar.json');
  }
  console.log('     Kapatmak icin bu pencereyi kapatin.');
  console.log('  ==========================================');
  console.log('');
});

process.on('SIGINT', () => { saveNow(); process.exit(0); });
process.on('SIGTERM', () => { saveNow(); process.exit(0); });
