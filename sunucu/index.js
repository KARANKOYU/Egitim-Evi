'use strict';
/* Sunucu girişi: node sunucu/index.js
   Veriyi ve ayarları yükler, HTTP sunucusunu açar, zamanlayıcıları kurar. */

const http = require('http');
const { monitorEventLoopDelay } = require('perf_hooks');
const { handleApi } = require('./api');
const { ayarlar, ayarlariYukle, epostaKurulu } = require('./ayarlar');
const { guvenlikTemizle, hizSinir, istekAnahtari, istemciIp } = require('./guvenlik');
const { HATIRLATMA_ARALIK_MS, hatirlatmalariCalistir } = require('./hatirlatma');
const { bad, baslikEkle, serveStatic } = require('./http');
const { okullariYukle } = require('./okullar');
const { YEDEK_ARALIK_MS, baslat, hataCevir, kapat, yedekKontrol } = require('./veri');
const { HOST, PORT } = require('./yollar');

/* Önce ayarlar (veritabanı bağlantı bilgisi orada), sonra okul listesi.
   Veritabanı açılışı aşağıda: hazır olmadan istek kabul edilmez. */
ayarlariYukle();
okullariYukle();

/* ============ aşırı yük koruması ============
   Uygulama katında üç önlem (asıl DDoS koruması önündeki vekil/CDN'dedir,
   bkz. belge/SUNUCUYA-KURULUM.md):
     - Olay döngüsü gecikmesi ölçülür; sunucu boğulmaya başlayınca yeni API
       istekleri kuyruğa girip her şeyi yavaşlatmak yerine hemen 503 alır.
     - Aynı anda işlenen API isteği sayısı sınırlıdır.
     - Vekil yoksa tek IP'nin açık tutabileceği bağlantı sayısı sınırlıdır. */
const gecikmeOlcer = monitorEventLoopDelay({ resolution: 20 });
gecikmeOlcer.enable();
let yogun = false;
const yukSayaci = setInterval(() => {
  yogun = gecikmeOlcer.mean / 1e6 > 150;   // ms; normalde birkaç ms
  gecikmeOlcer.reset();
}, 1000);
if (yukSayaci.unref) yukSayaci.unref();
const EN_FAZLA_SUREN_API = 400;
let surenApi = 0;
const IP_BAGLANTI_SINIRI = 256;
const ipBaglanti = new Map();

const server = http.createServer((req, res) => {
  const method = req.method || 'GET';
  const urlPath = (req.url || '/').split('?')[0];
  const ip = istemciIp(req);

  /* Gövde süresi: dosya yüklemesi dışındaki her istek 30 sn içinde tamamlanmalı.
     Genel istek süresi yüklemeler için uzun tutuldu; gövdesi hiç okunmayan
     (GET, reddedilen) istekte yavaş damlatılan gövde bağlantıyı tutamasın. */
  if (!(method === 'POST' && urlPath === '/api/odev-dosya/yukle')) {
    const sure = setTimeout(() => { if (!req.complete) req.destroy(); }, 30 * 1000);
    res.on('finish', () => {
      clearTimeout(sure);
      /* Cevap gitti ama gövde hâlâ geliyorsa beklenmez. */
      if (!req.complete) setTimeout(() => req.destroy(), 1500);
    });
    res.on('close', () => clearTimeout(sure));
  }

  /* Genel hız sınırı: tek kaynak sunucuyu istek yağmuruna tutamasın.
     Okulda bütün sınıf aynı ağdan (tek IP) girer; eskiden IP başına
     dakikada 300 istek vardı ve dosyalar da sayılıyordu: 30 öğrenci sayfayı
     birlikte açınca hepsi "çok fazla istek" alıyordu. Şimdi:
       - dosyalar (bellekten, tarayıcıda önbellekli) ayrı ve bol sınırla,
       - API IP başına dakikada 1500 ile,
       - ayrıca her oturum kendi başına dakikada 300 ile sınırlı: tek hesap
         sınırı zorlasa bile aynı ağdaki öbürleri etkilenmez. */
  const apiMi = urlPath.indexOf('/api/') === 0;
  const oturum = apiMi ? istekAnahtari(req) : '';
  const asildi = apiMi
    ? !hizSinir('genelApi:' + ip, 1500, 60 * 1000) ||
      (oturum && !hizSinir('genelOturum:' + oturum.slice(0, 24), 300, 60 * 1000))
    : !hizSinir('genelDosya:' + ip, 3000, 60 * 1000);
  if (asildi) {
    res.writeHead(429, baslikEkle({
      'Content-Type': 'application/json; charset=utf-8',
      'Retry-After': '60'
    }));
    return res.end(JSON.stringify({ error: 'Çok fazla istek gönderdin. Bir dakika bekle.' }));
  }

  if (urlPath.indexOf('/api/') === 0) {
    if (yogun || surenApi >= EN_FAZLA_SUREN_API) {
      res.writeHead(503, baslikEkle({
        'Content-Type': 'application/json; charset=utf-8',
        'Retry-After': '5'
      }));
      return res.end(JSON.stringify({ error: 'Sunucu şu an çok yoğun. Birkaç saniye sonra yeniden dene.' }));
    }
    surenApi++;
    let bitti = false;
    const birak = () => { if (!bitti) { bitti = true; surenApi--; } };
    res.on('finish', birak);
    res.on('close', birak);
    const segs = urlPath.split('/').filter(Boolean);
    Promise.resolve()
      .then(() => handleApi(req, res, segs, method))
      .catch(err => {
        if (res.headersSent) return;
        /* Veritabanı hatası: kısıt ihlali 400, bağlantı sorunu 503.
           Tablo ve kısıt adları istemciye gitmez, günlüğe yazılır. */
        const vt = hataCevir(err);
        if (vt) {
          if (vt.kod >= 500) console.error('Veritabanı hatası [' + err.code + ']:', err.message, urlPath);
          return bad(res, vt.mesaj, vt.kod);
        }
        const mesaj = (err && err.message) ? err.message : 'Sunucu hatası';
        /* Beklenen istemci hataları (çok büyük gövde, bozuk JSON) 500 değil:
           500 sunucunun kendi hatası demektir, günlüğü kirletmesin. Beklenmeyen
           hatanın ayrıntısı istemciye değil günlüğe gider. */
        const kod = (err && err.kod) ? err.kod
          : (/çok büyük|Geçersiz veri/i.test(mesaj) ? 400 : 500);
        if (kod === 500) console.error('API hatası:', urlPath, (err && err.stack) || mesaj);
        bad(res, kod === 500 ? 'Sunucu hatası' : mesaj, kod);
      });
    return;
  }
  if (method !== 'GET' && method !== 'HEAD') { res.writeHead(405); return res.end(); }
  serveStatic(req, res, urlPath);
});

/* Slowloris: yavas istemci baglantilari acik tutup kaynak tuketemesin. */
server.headersTimeout = 20 * 1000;
/* Dosya yüklemesi (200 MB'a kadar, okul ağında) dakikalar sürebilir. JSON
   gövdeleri kendi 30 saniyelik sınırına sahip (http.js readBody); yükleme de
   60 saniye veri gelmezse kesilir (odev-dosya.js). */
server.requestTimeout = 65 * 60 * 1000;
server.keepAliveTimeout = 10 * 1000;
server.maxHeadersCount = 60;
server.maxConnections = 1024;

/* Vekil arkasında bütün bağlantılar vekilden gelir; IP sınırı yalnızca
   sunucu doğrudan internete açıkken uygulanır. Okul ağında bütün sınıf tek
   IP'den gelebildiği için sınır bol tutuldu. */
server.on('connection', soket => {
  if (ayarlar.vekil && ayarlar.vekil.guven) return;
  const ip = soket.remoteAddress || '';
  const n = (ipBaglanti.get(ip) || 0) + 1;
  if (n > IP_BAGLANTI_SINIRI) { soket.destroy(); return; }
  ipBaglanti.set(ip, n);
  soket.on('close', () => {
    const k = (ipBaglanti.get(ip) || 1) - 1;
    if (k > 0) ipBaglanti.set(ip, k); else ipBaglanti.delete(ip);
  });
});

/* Suresi gecmis oturumlari, hiz kayitlarini ve bot sorularini temizle. */
const temizlikSayaci = setInterval(guvenlikTemizle, 10 * 60 * 1000);
if (temizlikSayaci.unref) temizlikSayaci.unref();

/* Ders ve ödev hatırlatmaları */
const hatirlatmaSayaci = setInterval(hatirlatmalariCalistir, HATIRLATMA_ARALIK_MS);
/* Kişisel hatırlatıcılar dakikada bir: "08:30" dendiyse 08:30'da gitsin. */
const { hatirlaticilariGonder } = require('./bolumler/hatirlatici');
const hatirlaticiSayaci = setInterval(() => { hatirlaticilariGonder().catch(e => console.error('Hatırlatıcı:', e.message)); }, 60 * 1000);
if (hatirlaticiSayaci.unref) hatirlaticiSayaci.unref();
if (hatirlatmaSayaci.unref) hatirlatmaSayaci.unref();

/* Konum gelmeyen açık servis seferleri kapanır, eski seferler silinir (10 dakikada bir). */
const { depo: veriDeposu } = require('./veri');
const seferSayaci = setInterval(() => { veriDeposu.okulHayati.seferTemizle().catch(() => {}); }, 10 * 60 * 1000);
if (seferSayaci.unref) seferSayaci.unref();
/* Eğitim Evi Aile: 7 günden eski konum ve ekran süresi saatte bir silinir. */
const aileSayaci = setInterval(() => { veriDeposu.aile.temizle().catch(() => {}); }, 60 * 60 * 1000);
if (aileSayaci.unref) aileSayaci.unref();

/* Bildirim yazılınca aboneliği olan kişinin telefonuna da gider. */
require('./push').baslat();

/* Ödev teslim dosyaları ve ekler 7 gün sonra silinir; artıklar da temizlenir:
   açılıştan sonra ve saatte bir. */
const { dosyaSupur } = require('./bolumler/odev-dosya');
const { ekSupur } = require('./bolumler/ekler');
const supurSayaci = setInterval(() => { dosyaSupur().catch(() => {}); ekSupur().catch(() => {}); }, 60 * 60 * 1000);
if (supurSayaci.unref) supurSayaci.unref();
setTimeout(() => { dosyaSupur().catch(() => {}); ekSupur().catch(() => {}); }, 60 * 1000);

/* Okul sayfası fotoğraflarının artıkları: aynı düzenle. */
const { fotoSupur } = require('./bolumler/okul-sayfasi');
const fotoSupurSayaci = setInterval(() => { fotoSupur().catch(() => {}); }, 6 * 60 * 60 * 1000);
if (fotoSupurSayaci.unref) fotoSupurSayaci.unref();
setTimeout(() => { fotoSupur().catch(() => {}); }, 90 * 1000);

/* Günlük yedek */
const yedekSayaci = setInterval(yedekKontrol, YEDEK_ARALIK_MS);
if (yedekSayaci.unref) yedekSayaci.unref();
setTimeout(yedekKontrol, 20 * 1000);
setTimeout(hatirlatmalariCalistir, 10 * 1000);   // açılıştan kısa süre sonra bir kez

server.on('error', err => {
  /* IPv6 yoksa IPv4'e düş (yollar.js'teki varsayılan '::' için). */
  if (HOST === '::' && !server.listening && (err.code === 'EAFNOSUPPORT' || err.code === 'EADDRNOTAVAIL')) {
    console.log('  IPv6 yok, yalnızca IPv4 dinleniyor.');
    return server.listen(PORT, '0.0.0.0');
  }
  if (err.code === 'EADDRINUSE') {
    console.error('\n  HATA: ' + PORT + ' portu kullanımda. Zaten açık olan pencereyi kapat veya');
    console.error('  farklı port ile başlat:  set PORT=3001 && node server.js\n');
  } else {
    console.error('Sunucu hatası:', err.message);
  }
  process.exit(1);
});

function dinlemeyeBasla() {
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
}

baslat()
  .then(dinlemeyeBasla)
  .catch(e => {
    console.error('\n  HATA: veritabanı açılamadı: ' + e.message);
    if (/Veritabanı ayarı yok/.test(e.message)) {
      console.error('  Önce veritabanını kur:  npm run veritabani-kur\n');
    } else if (/ECONNREFUSED/.test(e.message)) {
      console.error('  PostgreSQL çalışmıyor. Windows: services.msc > postgresql-x64-17 > Başlat.\n');
    }
    process.exit(1);
  });

/* Kapanışta bağlantı havuzunu düzgün kapat. */
function kapan() { kapat().catch(() => {}).then(() => process.exit(0)); }
process.on('SIGINT', kapan);
process.on('SIGTERM', kapan);
