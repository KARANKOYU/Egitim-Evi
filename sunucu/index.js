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
