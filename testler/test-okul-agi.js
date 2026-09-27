'use strict';
/* Okul ağı: aynı anda 300 kişi, tek IP.
   Okulda bütün öğrenciler okulun ağından (NAT, tek IP) aynı dakikalarda
   girer. Bu paket bir sayfa açılışının gerçek isteklerini 300 öğrenciyle,
   birkaç saniyeye yayarak yapar; hiçbirinin "çok fazla istek" (429) ya da
   "sunucu yoğun" (503) almadığını, bağlantısının kesilmediğini denetler.
   Ardından tek kötü niyetli kişinin yine durduğunu ayrı ayrı gösterir:
   tek oturumdan sel, tek hesaba şifre denemesi, bir hesaba birçok
   bağlantıdan deneme (hesap tanımadığı bağlantılardan kilitlenir, sahibi
   tanıdık bağlantısından girer; müdürün verdiği yeni şifre kilidi kaldırır),
   çok hesaba şifre taraması (hiç kimsenin girmediği bağlantı 50 hatada,
   10 öğrencinin girdiği bağlantı 70'te durur; kendi açtığı yetişkin
   hesaplarıyla girmek sınırı büyütmez), oturumsuz sel; sınırların kendisi
   de sunucusuz (bellekte) denenir.

   Öğrenci başına istek dizisi (tarayıcıda ölçüldü; okul adresinden ilk açılış):
     dosya  /school/<kısa ad>, tema.js, style.css, app.js, 4 yazı tipi, manifest,
            simge, sw.js ve servis çalışanının önbelleğe aldığı 7 dosya (19)
     API    meta, okul-adres, site, okul sayfasının 6 fotoğrafı; giriş; eğitim
            yılı, site, ilerleyiş, bildirimler (ana sayfa); ilerleyiş (Ödevler);
            myschedule (Program)
     Her onuncu öğrenci (30 kişi) şifresini önce yanlış yazar: soru gelir,
     soruyu çözüp doğru şifreyle girer.
   Her öğrenci kendi bağlantılarını kullanır (tarayıcı gibi en çok 6, açık tutulan).

   Okul ağı ::1 (localhost), dışarıdaki başka bir bağlantı 127.0.0.1; öbür
   bağlantılar 127.0.0.N kaynak adresinden gelir (bütün 127/8 geri döngüdür).
   Hesaplar test veritabanına doğrudan yazılır (adı _test ile bitmeli).
   EE_AG_VEKIL=1: sunucu ters vekil arkasında (ayarlar.json vekil.guven, başlık
   x-forwarded-for); okul 85.105.1.1, öbür bağlantı 85.105.9.9, 127.0.0.N
   85.105.50.N diye gelir ve öğrenciler Caddy gibi ortak bir bağlantı
   havuzundan geçer.

   Kısa sürüm (tumtest):  300 kişi 5 saniyeye yayılır.
   Ölçüm:  EE_AG_OLCUM=1 node testler/test-okul-agi.js
           10 saniyeye yayılır, kişi başı gerçekçi bekleme; sonuç tablosu ve
           OLCUM satırı (JSON). EE_AG_YAYILMA_MS ile yayılma, EE_AG_SALDIRI=0
           ile saldırı bölümü kapatılır. */

const http = require('http');
const path = require('path');
const zlib = require('zlib');
const { girisYap, hesapAc, BASE } = require('./giris');

let gecti = 0, kaldi = 0;
function kontrol(ad, sart, detay) {
  if (sart) { gecti++; console.log('  GECTI  ' + ad); }
  else { kaldi++; console.log('  KALDI  ' + ad + (detay ? '  -> ' + detay : '')); }
}
const J = x => JSON.stringify(x).slice(0, 300);
const bekle = ms => new Promise(r => setTimeout(r, ms));

const OLCUM = process.env.EE_AG_OLCUM === '1';
const KISI = Number(process.env.EE_AG_KISI) || 300;
const YAYILMA_MS = Number(process.env.EE_AG_YAYILMA_MS) || (OLCUM ? 10000 : 5000);
const SALDIRI = process.env.EE_AG_SALDIRI !== '0';
const PORT = Number(new URL(BASE).port) || 80;
const OKUL_IP = '::1';          // okulun ağı: bütün öğrenciler
const DIS_IP = '127.0.0.1';     // başka bir bağlantı
const SIFRE = 'Okul2026x';
const VEKIL = process.env.EE_AG_VEKIL === '1';
const VEKIL_IP = { [OKUL_IP]: '85.105.1.1', [DIS_IP]: '85.105.9.9' };

/* Yeniden üretilebilir rastgele (aynı yayılma, aynı bekleme). */
let tohum = 20260927;
const rastgele = () => { tohum = (tohum * 1103515245 + 12345) % 2147483648; return tohum / 2147483648; };
const aralik = (a, b) => Math.round(a + rastgele() * (b - a));

function testDeposu() {
  process.env.EE_DATA = path.join(__dirname, 'testdata');
  require('../sunucu/ayarlar').ayarlariYukle();
  const baglanti = require('../sunucu/veri/baglanti');
  if (!/_test$/.test(baglanti.veritabaniAdi() || '')) return null;
  return baglanti;
}

/* ---------------- istek ve ölçüm ---------------- */
function yeniOlcum() {
  return { istek: 0, api: 0, dosya: 0, durum: {}, sinir: {}, hata: {}, suren: 0, enCokSuren: 0,
    soket: 0, enCokSoket: 0, sure: { giris: [], api: [], dosya: [] } };
}

/* 429'u hangi sınırın verdiği: sunucu "sinir" alanını yazıyorsa o, yoksa iletiden. */
function sinirAdi(yol, govde) {
  const j = govde || {};
  if (j.sinir) return 'genel ' + j.sinir;
  const m = String(j.error || '');
  if (j.kilitli) return 'hesap kilidi';
  if (/^Çok fazla istek gönderdin/.test(m)) return yol.indexOf('/api/') === 0 ? 'genel API (IP ya da oturum)' : 'genel dosya (IP)';
  if (/bağlantıdan çok fazla giriş/.test(m)) return 'giriş (IP)';
  if (yol.indexOf('/api/okul-adres') === 0) return 'okul adresi (IP)';
  if (yol.indexOf('/api/okul-foto/') === 0) return 'okul fotoğrafı (IP)';
  if (yol.indexOf('/api/challenge') === 0) return 'doğrulama sorusu (IP)';
  return yol.split('?')[0] + ': ' + m.slice(0, 40);
}

/* Bağlantının adresi: 127.0.0.N (N >= 2) kaynak adresinden 127.0.0.1'e bağlanılır;
   vekil arkasında vekilin başlığına yazılan adres. */
function adres(host) {
  const m = /^127\.0\.0\.(\d+)$/.exec(host);
  if (m && host !== DIS_IP) return { host: DIS_IP, yerel: host, vekil: '85.105.50.' + m[1] };
  return { host, yerel: undefined, vekil: VEKIL_IP[host] };
}

const gorulenSoket = new WeakSet();
function istek(ajan, host, yol, sec, olcum) {
  sec = sec || {};
  return new Promise(resolve => {
    const govde = sec.json ? Buffer.from(JSON.stringify(sec.json)) : null;
    const basliklar = { 'Accept-Encoding': 'br, gzip', 'User-Agent': 'okul-agi-testi' };
    if (govde) { basliklar['Content-Type'] = 'application/json'; basliklar['Content-Length'] = govde.length; }
    if (sec.token) basliklar.Authorization = 'Bearer ' + sec.token;
    const a = adres(host);
    if (VEKIL) basliklar['X-Forwarded-For'] = a.vekil;
    const tur = yol.indexOf('/api/') === 0 && yol.indexOf('/api/okul-foto/') !== 0 ? 'api' : 'dosya';
    const bas = Date.now();
    if (olcum) {
      olcum.istek++; olcum[tur]++;
      if (tur === 'api') { olcum.suren++; olcum.enCokSuren = Math.max(olcum.enCokSuren, olcum.suren); }
    }
    let bitti = false;
    const son = sonuc => {
      if (bitti) return;
      bitti = true;
      if (olcum) {
        if (tur === 'api') olcum.suren--;
        if (sonuc.durum) olcum.durum[sonuc.durum] = (olcum.durum[sonuc.durum] || 0) + 1;
        else olcum.hata[sonuc.hata] = (olcum.hata[sonuc.hata] || 0) + 1;
        if (sonuc.durum === 429) { const s = sinirAdi(yol, sonuc.json); olcum.sinir[s] = (olcum.sinir[s] || 0) + 1; }
        if (sonuc.durum && sonuc.durum < 400) olcum.sure[sec.giris ? 'giris' : tur].push(Date.now() - bas);
      }
      resolve(sonuc);
    };
    const req = http.request({ host: a.host, localAddress: a.yerel, port: PORT, path: yol, method: sec.method || 'GET',
      headers: basliklar, agent: ajan }, res => {
      const parcalar = [];
      res.on('data', d => parcalar.push(d));
      res.on('error', e => son({ durum: 0, hata: e.code || e.message, metin: '', json: {} }));
      res.on('end', () => {
        let ham = Buffer.concat(parcalar);
        const kod = res.headers['content-encoding'];
        let metin = '';
        const oku = sec.oku || res.statusCode >= 400 || /json/.test(res.headers['content-type'] || '');
        if (oku) {
          try {
            if (kod === 'br') ham = zlib.brotliDecompressSync(ham);
            else if (kod === 'gzip') ham = zlib.gunzipSync(ham);
            metin = ham.toString('utf8');
          } catch (e) { metin = ''; }
        }
        let json = null;
        try { json = JSON.parse(metin); } catch (e) { /* JSON değil */ }
        son({ durum: res.statusCode, metin, json: json || {} });
      });
    });
    req.on('socket', s => {
      if (!olcum || gorulenSoket.has(s)) return;
      gorulenSoket.add(s);
      olcum.soket++; olcum.enCokSoket = Math.max(olcum.enCokSoket, olcum.soket);
      s.once('close', () => { olcum.soket--; });
    });
    req.on('error', e => son({ durum: 0, hata: e.code || e.message, metin: '', json: {} }));
    req.setTimeout(30000, () => req.destroy(Object.assign(new Error('zaman aşımı'), { code: 'ZAMAN_ASIMI' })));
    if (govde) req.write(govde);
    req.end();
  });
}

function soruCevabi(soru) {
  const m = String(soru || '').match(/(\d+)\s*\+\s*(\d+)/);
  return m ? Number(m[1]) + Number(m[2]) : -1;
}

/* ---------------- bir öğrencinin sayfa açılışı ---------------- */
async function ogrenci(i, o) {
  /* Tarayıcı gibi: kendi bağlantıları, en çok 6, açık tutulur. Vekil arkasında
     tarayıcı vekile bağlanır; sunucuya vekilin ortak havuzundan gelinir. */
  let ajan = o.ortakAjan;
  if (!ajan) { ajan = new http.Agent({ keepAlive: true, maxSockets: 6 }); o.ajanlar.push(ajan); }
  const g = (yol, sec) => istek(ajan, OKUL_IP, yol, sec, o.olcum);
  const kadi = 'agogr' + (i + 1);
  const yanlis = i % 10 === 5;

  /* 1) Okulun adresi: sayfa ve dosyaları (ilk açılış, tarayıcı önbelleği boş). */
  const sayfa = await g('/school/' + o.kisa, { oku: true });
  const surum = ad => { const m = String(sayfa.metin || '').match(new RegExp('"' + ad.replace(/[./]/g, '\\$&') + '\\?v=([^"]+)"')); return m ? ad + '?v=' + m[1] : ad; };
  await Promise.all([surum('/js/tema.js'), surum('/css/style.css'), surum('/js/app.js'),
    '/yazitipi/plex-sans-400-700-latin.woff2', '/yazitipi/plex-sans-400-700-latin-ext.woff2'].map(y => g(y)));
  /* app.js çalıştı: açılış istekleri, geri kalan yazı tipleri, simge. */
  const [, adres] = await Promise.all([g('/api/meta'), g('/api/okul-adres?kisa=' + o.kisa), g('/api/site'),
    g('/yazitipi/newsreader-700-latin.woff2'), g('/yazitipi/newsreader-700-latin-ext.woff2'),
    g('/manifest.json'), g('/simge-192.png?v=2')]);
  const fotolar = ((adres.json.sayfa || {}).fotolar || []);
  await Promise.all(fotolar.map(f => g('/api/okul-foto/' + f.id)));
  /* Servis çalışanı kurulur ve kabuğu önbelleğe alır (tarayıcı önbelleğinde olmayanlar). */
  await g('/sw.js');
  await Promise.all(['/', '/index.html', '/css/style.css', '/js/tema.js', '/js/app.js', '/manifest.json',
    '/simge-512.png?v=2'].map(y => g(y)));

  /* 2) Kullanıcı adını ve şifresini yazar. */
  await bekle(o.yazma());
  let giris = await g('/api/login', { method: 'POST', json: { kimlik: kadi, password: yanlis ? 'Yanlis2026x' : SIFRE, okul: o.kisa }, giris: !yanlis });
  if (yanlis) {
    if (giris.durum === 401 || (giris.durum === 400 && giris.json.soruGerekli)) o.yanlisGoruldu++;
    const s = await g('/api/challenge');
    await bekle(o.yazma());
    giris = await g('/api/login', { method: 'POST', giris: true, json: { kimlik: kadi, password: SIFRE, okul: o.kisa,
      challengeId: s.json.id, challengeAnswer: soruCevabi(s.json.soru) } });
  }
  const token = giris.durum === 200 && giris.json.token;
  if (!token) { o.girisHatasi.push(kadi + ' ' + giris.durum + ' ' + (giris.json.error || giris.hata || '')); return; }
  o.girenler.push({ kadi, token });

  /* 3) Ana sayfa, sonra Ödevler, sonra Program. */
  const ana = await Promise.all([g('/api/egitim-yili', { token }), g('/api/site'), g('/api/progress', { token }),
    g('/api/notifications', { token })]);
  await bekle(o.gezinme());
  const odevler = await g('/api/progress', { token });
  await bekle(o.gezinme());
  const program = await g('/api/myschedule', { token });
  if (ana.every(r => r.durum === 200) && odevler.durum === 200 && program.durum === 200) o.sayfaTamam++;
}

const yuzdelik = (dizi, p) => {
  if (!dizi.length) return 0;
  const s = dizi.slice().sort((a, b) => a - b);
  return s[Math.min(s.length - 1, Math.floor(s.length * p))];
};

async function senaryo(kisa, yayilmaMs) {
  const o = {
    kisa, olcum: yeniOlcum(), ajanlar: [], ortakAjan: VEKIL ? new http.Agent({ keepAlive: true, maxSockets: 512 }) : null, girenler: [], girisHatasi: [], sayfaTamam: 0, yanlisGoruldu: 0,
    yazma: () => OLCUM ? aralik(2000, 4000) : aralik(800, 1600),
    gezinme: () => OLCUM ? aralik(1000, 2000) : aralik(400, 800)
  };
  const bas = Date.now();
  const isler = [];
  for (let i = 0; i < KISI; i++) {
    const baslangic = Math.round(i * yayilmaMs / KISI + rastgele() * yayilmaMs / KISI);
    isler.push(bekle(baslangic).then(() => ogrenci(i, o)).catch(e => { o.girisHatasi.push('agogr' + (i + 1) + ' ' + e.message); }));
  }
  await Promise.all(isler);
  o.sure = Date.now() - bas;
  if (o.ortakAjan) o.ajanlar.push(o.ortakAjan);
  const m = o.olcum;
  o.ozet = {
    kisi: KISI, yayilmaSn: yayilmaMs / 1000, sureSn: Math.round(o.sure / 100) / 10,
    istek: m.istek, api: m.api, dosya: m.dosya,
    d429: m.durum[429] || 0, d503: m.durum[503] || 0,
    baglantiHatasi: Object.values(m.hata).reduce((a, b) => a + b, 0),
    giren: o.girenler.length, sayfaTamam: o.sayfaTamam, yanlisSifre: o.yanlisGoruldu,
    sinir: m.sinir, hata: m.hata, durum: m.durum,
    enCokSoket: m.enCokSoket, enCokSurenApi: m.enCokSuren,
    girisMs: [yuzdelik(m.sure.giris, 0.5), yuzdelik(m.sure.giris, 0.95), yuzdelik(m.sure.giris, 1)],
    apiMs: [yuzdelik(m.sure.api, 0.5), yuzdelik(m.sure.api, 0.95), yuzdelik(m.sure.api, 1)]
  };
  return o;
}

function senaryoYaz(ad, o) {
  const z = o.ozet;
  console.log('  ' + ad + (VEKIL ? ' (vekil arkasında)' : ' (vekilsiz, doğrudan)') + ': ' + z.kisi + ' öğrenci, ' + z.yanlisSifre + "'u önce yanlış şifre; " + z.yayilmaSn + ' sn\'ye yayıldı, ' +
    'hepsi ' + z.sureSn + ' sn sürdü');
  console.log('    istek ' + z.istek + ' (API ' + z.api + ', dosya ' + z.dosya + ')   giren ' + z.giren + '/' + z.kisi +
    '   ana sayfa + Ödevler + Program açılan ' + z.sayfaTamam + '/' + z.kisi);
  console.log('    429: ' + z.d429 + '   503: ' + z.d503 + '   bağlantı hatası: ' + z.baglantiHatasi +
    (z.baglantiHatasi ? ' ' + J(z.hata) : ''));
  console.log('    tetiklenen sınır: ' + (Object.keys(z.sinir).length ? J(z.sinir) : '-'));
  console.log('    en çok açık bağlantı (okul IP) ' + z.enCokSoket + ', en çok aynı anda süren API isteği ' + z.enCokSurenApi);
  console.log('    süre (ms, ortanca / %95 / en kötü): giriş ' + z.girisMs.join(' / ') + ', API ' + z.apiMs.join(' / '));
  if (o.girisHatasi.length) console.log('    girilemeyen örnek: ' + J(o.girisHatasi.slice(0, 3)));
  console.log('OLCUM ' + JSON.stringify(Object.assign({ ad, vekil: VEKIL }, z)));
}

/* ---------------- saldırılar ---------------- */
async function ogrenciGiris(host, kadi, kisa, sifre, soru) {
  const ajan = new http.Agent({ keepAlive: false });
  let s = null;
  if (soru) s = await istek(ajan, host, '/api/challenge');
  return istek(ajan, host, '/api/login', { method: 'POST', json: Object.assign({ kimlik: kadi, password: sifre, okul: kisa },
    s ? { challengeId: s.json.id, challengeAnswer: soruCevabi(s.json.soru) } : {}) });
}

async function saldirilar(kisa, girenler) {
  console.log('\n=== TEK OTURUMDAN SEL (okul ağından) ===');
  /* Bir öğrenci oturumuyla dakikada 300'den fazla istek: yalnızca o oturum durur,
     aynı ağdaki öbür öğrenciler etkilenmez. */
  const kotu = girenler[0].token;
  const ajan = new http.Agent({ keepAlive: true, maxSockets: 20 });
  let sel429 = 0, oturumSiniri = false;
  for (let parti = 0; parti < 18; parti++) {
    const r = await Promise.all(Array.from({ length: 20 }, () => istek(ajan, OKUL_IP, '/api/me', { token: kotu })));
    for (const x of r) if (x.durum === 429) { sel429++; if (x.json.sinir === 'oturum') oturumSiniri = true; }
  }
  const obur = await Promise.all(girenler.slice(1, 11).map(g => istek(ajan, OKUL_IP, '/api/progress', { token: g.token })));
  kontrol('360 istek atan tek oturum durduruldu (' + sel429 + ' kez 429)', sel429 >= 50, sel429 + ' kez 429');
  kontrol('durduran oturum başına sınır (sinir: oturum)', oturumSiniri);
  kontrol('aynı ağdaki öbür 10 öğrenci etkilenmedi', obur.every(r => r.durum === 200), J(obur.map(r => r.durum)));
  ajan.destroy();

  console.log('\n=== TEK HESABA ŞİFRE DENEMESİ ===');
  const hedef = 'agogr8';
  const denemeler = [];
  for (let i = 0; i < 5; i++) denemeler.push(await ogrenciGiris(OKUL_IP, hedef, kisa, 'Tahmin' + i + 'x', i > 0));
  const son = denemeler[4];
  kontrol('beşinci yanlışta hesap bu bağlantıdan kilitlendi', son.durum === 401 && /kilitlendi/.test(son.json.error || ''), J(son.json));
  const kilitli = await ogrenciGiris(OKUL_IP, hedef, kisa, SIFRE, true);
  kontrol('kilitliyken doğru şifre de geçmiyor (429 kilitli)', kilitli.durum === 429 && kilitli.json.kilitli === true, J(kilitli.json));
  const baskaYerSorusuz = await ogrenciGiris(DIS_IP, hedef, kisa, SIFRE, false);
  kontrol('hesaba çok hata denendi: başka bağlantıdan da soru isteniyor', baskaYerSorusuz.durum === 400 &&
    baskaYerSorusuz.json.soruGerekli === true, baskaYerSorusuz.durum + ' ' + J(baskaYerSorusuz.json));
  const baskaYer = await ogrenciGiris(DIS_IP, hedef, kisa, SIFRE, true);
  kontrol('sahibi başka bağlantıdan soruyu çözüp girebiliyor', baskaYer.durum === 200 && !!baskaYer.json.token, baskaYer.durum + ' ' + J(baskaYer.json));

  console.log('\n=== HESABA BİRÇOK BAĞLANTIDAN 20 HATA (hedefli kilit denemesi) ===');
  /* Kullanıcı adını bilen biri hesaba 5 ayrı bağlantıdan 4'er yanlış şifre dener
     (20 hata). Hesap tanımadığı bağlantılardan kilitlenir; sahibi daha önce
     girdiği bağlantıdan (okulun ağı) doğru şifreyle girer, dışarıda kalmaz. */
  const hedef2 = 'agogr9';
  let dagitik = 0;
  for (let n = 11; n <= 15; n++) {
    for (let j = 0; j < 4; j++) {
      const r = await ogrenciGiris('127.0.0.' + n, hedef2, kisa, 'Dagitik' + n + j + 'x', true);
      if (r.durum === 401) dagitik++;
    }
  }
  kontrol('5 bağlantıdan 4\'er yanlış: 20 hatalı deneme sayıldı', dagitik === 20, 'hata ' + dagitik);
  const yabanci = await ogrenciGiris('127.0.0.16', hedef2, kisa, SIFRE, true);
  kontrol('hesap tanımadığı bağlantıdan kilitli: doğru şifre de 429', yabanci.durum === 429 && yabanci.json.kilitli === true,
    yabanci.durum + ' ' + J(yabanci.json));
  const sahibi = await ogrenciGiris(OKUL_IP, hedef2, kisa, SIFRE, true);
  kontrol('sahibi daha önce girdiği bağlantıdan (okulun ağı) doğru şifreyle giriyor', sahibi.durum === 200 && !!sahibi.json.token,
    sahibi.durum + ' ' + J(sahibi.json));
  const sonraYabanci = await ogrenciGiris('127.0.0.16', hedef2, kisa, SIFRE, true);
  kontrol('sahibi girince hesabın kilidi kalktı: yeni bağlantıdan da giriyor', sonraYabanci.durum === 200 && !!sonraYabanci.json.token,
    sonraYabanci.durum + ' ' + J(sonraYabanci.json));

  /* E-postası olmayan öğrencinin "Şifremi unuttum"u: müdürün verdiği yeni şifre
     hesabın toplam hata kilidini kaldırır (sunucu yeniden başlayınca tanıdık
     bağlantılar boşalır; o zaman sahibi de her yerden kilitli kalırdı). */
  const hedef3 = 'agogr10';
  let dagitik3 = 0;
  for (let n = 21; n <= 25; n++) {
    for (let j = 0; j < 4; j++) {
      const r = await ogrenciGiris('127.0.0.' + n, hedef3, kisa, 'Dagitik' + n + j + 'y', true);
      if (r.durum === 401) dagitik3++;
    }
  }
  const kilitli3 = await ogrenciGiris('127.0.0.26', hedef3, kisa, SIFRE, true);
  kontrol('öğrenci hesabı 20 hatadan sonra tanımadığı bağlantıdan kilitli', dagitik3 === 20 && kilitli3.durum === 429,
    dagitik3 + ' hata, ' + kilitli3.durum);
  const M = (await girisYap('mudur@test.com', 'Test1234!')).token;
  const yeni = await istek(new http.Agent(), OKUL_IP, '/api/school/student-password', { method: 'POST', token: M,
    json: { studentId: 'u_ag10', password: 'Yeni2026ab' } });
  const yeniGiris = await ogrenciGiris('127.0.0.26', hedef3, kisa, 'Yeni2026ab', true);
  kontrol('müdür yeni şifre verince öğrenci yeni bağlantıdan da giriyor (toplam kilit kalktı)',
    yeni.durum === 200 && yeniGiris.durum === 200 && !!yeniGiris.json.token, yeni.durum + ' / ' + yeniGiris.durum + ' ' + J(yeniGiris.json));

  /* Şifre taraması: her hesaba bir yanlış şifre. Bağlantının durduğu hata sayısı
     o bağlantıdan girmiş hesap sayısıyla büyür (50 + hesap başına 2, en çok 300). */
  async function tara(ip, ilkHesap) {
    let hata = 0, ilkSoru = 0, ilk429 = 0;
    for (let n = 1; n <= 330 && !ilk429; n++) {
      const kadi = 'agogr' + (((ilkHesap + n - 2) % KISI) + 1);
      let r = await ogrenciGiris(ip, kadi, kisa, 'Tarama' + n + 'x', false);
      if (r.durum === 400 && r.json.soruGerekli) {
        if (!ilkSoru) ilkSoru = hata + 1;
        r = await ogrenciGiris(ip, kadi, kisa, 'Tarama' + n + 'x', true);
      }
      if (r.durum === 401) hata++;
      else if (r.durum === 429) ilk429 = hata + 1;
      else { console.log('    beklenmeyen cevap: ' + r.durum + ' ' + J(r.json)); break; }
    }
    console.log('    ' + ip + ': ' + hata + ' hatalı deneme; ' + (ilkSoru ? 'soru ' + ilkSoru + '. denemede zorunlu oldu' : 'soru istenmedi') +
      ', bağlantı ' + (ilk429 ? ilk429 + '. denemede durdu' : 'durmadı'));
    return { hata, ilkSoru, ilk429 };
  }

  console.log('\n=== ŞİFRE TARAMASI: HİÇ KİMSENİN GİRMEDİĞİ BAĞLANTI ===');
  /* Doğrulama sorusu betikle çözülür; taramayı durduran bağlantının hata sınırıdır. */
  const soguk = await tara('127.0.0.3', 100);
  kontrol('kimsenin girmediği bağlantı 50 hatada duruyor (429)', soguk.ilk429 >= 50 && soguk.ilk429 <= 52, J(soguk));
  const durmus = await ogrenciGiris('127.0.0.3', 'ogrenci2@test.com', '', 'Test1234!', true);
  kontrol('durdurulan bağlantıdan doğru şifre de geçmiyor', durmus.durum === 429 && /bağlantıdan/.test(durmus.json.error || ''), J(durmus.json));
  const okuldan = await ogrenciGiris(OKUL_IP, 'ogrenci2@test.com', '', 'Test1234!', false);
  kontrol('okul ağı etkilenmedi: temiz hesap sorusuz giriyor', okuldan.durum === 200 && !!okuldan.json.token, okuldan.durum + ' ' + J(okuldan.json));

  console.log('\n=== ŞİFRE TARAMASI: 10 HESABIN GİRDİĞİ BAĞLANTI ===');
  let isinma = 0;
  for (let n = 0; n < 10; n++) {
    const r = await ogrenciGiris('127.0.0.4', 'agogr' + (((199 + n) % KISI) + 1), kisa, SIFRE, false);
    if (r.durum === 200) isinma++;
  }
  kontrol('bağlantıdan 10 hesap doğru şifreyle girdi', isinma === 10, 'giren ' + isinma);
  const ilik = await tara('127.0.0.4', 150);
  kontrol('50 hatadan sonra o bağlantıdan her girişte soru isteniyor', ilik.ilkSoru >= 49 && ilik.ilkSoru <= 52, J(ilik));
  kontrol('10 hesabın girdiği bağlantı 70 hatada duruyor (50 + 10 x 2)', ilik.ilk429 >= 69 && ilik.ilk429 <= 72, J(ilik));

  console.log('\n=== ŞİFRE TARAMASI: KENDİ AÇTIĞI HESAPLARLA SINIRI BÜYÜTME DENEMESİ ===');
  /* Yetişkin hesabını herkes kendisi açar: tarayan biri 5 hesap açıp bağlantısından
     girer. Bağlantının hata sınırını yalnızca okulun açtığı hesaplar büyütür. */
  let kendi = 0;
  for (let n = 0; n < 5; n++) {
    const ad = 'sisir' + n + Date.now().toString(36);
    await hesapAc({ fullName: 'Deneme Hesap', username: ad, email: ad + '@test.com', password: 'Test1234!' });
    const r = await ogrenciGiris('127.0.0.5', ad, '', 'Test1234!', false);
    if (r.durum === 200) kendi++;
  }
  kontrol('bağlantıdan kendi açtığı 5 yetişkin hesabıyla doğru şifre girildi', kendi === 5, 'giren ' + kendi);
  const sisik = await tara('127.0.0.5', 250);
  kontrol('kendi açtığı hesaplar bağlantının sınırını büyütmüyor: 50 hatada duruyor', sisik.ilk429 >= 50 && sisik.ilk429 <= 52, J(sisik));

  console.log('\n=== OTURUMSUZ SEL (başka bağlantıdan) ===');
  const selAjan = new http.Agent({ keepAlive: true, maxSockets: 25 });
  let ilkIp429 = 0, sinir = '', gonderilen = 0;
  while (!ilkIp429 && gonderilen < 7000) {
    const r = await Promise.all(Array.from({ length: 25 }, () => istek(selAjan, DIS_IP, '/api/meta')));
    for (const x of r) {
      gonderilen++;
      if (x.durum === 429 && !ilkIp429) { ilkIp429 = gonderilen; sinir = x.json.sinir || ''; }
    }
  }
  selAjan.destroy();
  const okulMeta = await istek(new http.Agent(), OKUL_IP, '/api/meta');
  console.log('    ' + gonderilen + ' istek; ilk 429 ' + (ilkIp429 || 'yok') + '. istekte (sinir: ' + (sinir || '-') + ')');
  kontrol('oturumsuz sel IP sınırında duruyor', ilkIp429 > 0 && sinir === 'ip', 'ilk429 ' + ilkIp429 + ' sinir ' + sinir);
  kontrol('IP sınırı okul ölçeğinde (ilk 429 4000. istekten sonra)', ilkIp429 > 4000, 'ilk429 ' + ilkIp429);
  kontrol('okul ağı bu arada etkilenmedi', okulMeta.durum === 200, 'durum ' + okulMeta.durum);
}

/* ---------------- sınırların kendisi (sunucusuz, bellekte) ---------------- */
function hesapSiniriSunucusuz() {
  console.log('\n=== GİRİŞ SINIRLARI, BİRÇOK IP (sunucusuz) ===');
  const g = require('../sunucu/guvenlik');
  if (typeof g.girisHatasi !== 'function' || typeof g.girisTanidik !== 'function') {
    kontrol('giriş sınırı işlevleri (guvenlik.js) var', false); return;
  }
  const anahtar = (ip, id) => 'giris:' + ip + ':' + id;
  /* Okul ağı: 300 hesap, 30'u bir kez yanlış; doğru şifreyle girenler tanıdık olur. */
  let engel = 0, kilit = 0, soru = 0;
  for (let i = 0; i < 300; i++) {
    const ip = '10.9.9.9', id = 'okul' + i, k = anahtar(ip, id);
    if (g.girisIpEngeli(ip)) engel++;
    if (i % 10 === 5) { g.girisHatasi(ip, k, id); if (g.girisIpEngeli(ip)) engel++; }
    if (g.girisKilitSn(k, id, ip)) kilit++;
    if (g.girisSoruLazim(ip, k, id)) soru++;
    g.girisBasarili(k, id);
    g.girisTanidik(ip, id, true);   // öğrenci: okulun açtığı hesap
  }
  kontrol('okul ağı: 300 giriş, 30 hata: engel ve kilit yok', engel === 0 && kilit === 0, 'engel ' + engel + ' kilit ' + kilit);
  kontrol('okul ağı: soruyu yalnızca yanlış yazan 30 kişi görüyor', soru === 30, 'soru ' + soru);
  kontrol('okulun ağı (300 hesap girdi): bağlantının hata sınırı 300', g.ipHataSiniri('10.9.9.9') === 300, g.ipHataSiniri('10.9.9.9'));

  /* Dağıtık deneme: sahibi 60.0.0.1'den girmiş hesaba 5 farklı IP'den 4'er yanlış. */
  const hedef = 'hedef';
  g.girisTanidik('60.0.0.1', hedef);
  for (let ipNo = 1; ipNo <= 5; ipNo++) {
    for (let j = 0; j < 4; j++) g.girisHatasi('20.0.0.' + ipNo, anahtar('20.0.0.' + ipNo, hedef), hedef);
    if (ipNo === 1) {
      kontrol('hesaba 3 hata sonrası yeni IP\'de de soru', g.girisSoruLazim('30.0.0.1', anahtar('30.0.0.1', hedef), hedef));
      kontrol('4 hata: hesap henüz kilitli değil', !g.girisKilitSn(anahtar('30.0.0.1', hedef), hedef, '30.0.0.1'));
    }
  }
  kontrol('5 IP x 4 hata = 20: hesap tanımadığı IP\'den kilitli', g.girisKilitSn(anahtar('30.0.0.9', hedef), hedef, '30.0.0.9') > 0);
  kontrol('saldıran IP\'lerden de kilitli', g.girisKilitSn(anahtar('20.0.0.3', hedef), hedef, '20.0.0.3') > 0);
  kontrol('sahibinin girdiği IP\'den kilitli değil (hedefli kilit sahibini dışarıda bırakmaz)',
    !g.girisKilitSn(anahtar('60.0.0.1', hedef), hedef, '60.0.0.1'));
  kontrol('başka hesap etkilenmedi', !g.girisKilitSn(anahtar('30.0.0.9', 'baska'), 'baska', '30.0.0.9') &&
    !g.girisSoruLazim('30.0.0.9', anahtar('30.0.0.9', 'baska'), 'baska'));
  g.girisBasarili(anahtar('60.0.0.1', hedef), hedef);
  kontrol('sahibi girince hesabın toplam hatası silindi: yeni IP\'den de kilit yok',
    !g.girisKilitSn(anahtar('30.0.0.9', hedef), hedef, '30.0.0.9'));
  /* Şifre sıfırlama (kayit.js sifre-yenile) girisBasarili('', id) çağırır. */
  for (let j = 0; j < 20; j++) g.girisHatasi('20.0.0.' + (j % 5 + 1), anahtar('20.0.0.' + (j % 5 + 1), hedef), hedef);
  kontrol('yeniden 20 hata: tanımadığı IP\'den kilitli', g.girisKilitSn(anahtar('30.0.0.8', hedef), hedef, '30.0.0.8') > 0);
  g.girisBasarili('', hedef);
  kontrol('şifre sıfırlanınca hesabın toplam hata kilidi kalkıyor', !g.girisKilitSn(anahtar('30.0.0.8', hedef), hedef, '30.0.0.8'));

  /* Tek IP'den şifre taraması: kimsenin girmediği IP 50 hatada durur. */
  const ip = '40.0.0.1';
  for (let i = 0; i < 49; i++) g.girisHatasi(ip, anahtar(ip, 't' + i), 't' + i);
  kontrol('49 hata: tanıdıksız IP henüz durmadı', !g.girisIpEngeli(ip));
  g.girisHatasi(ip, anahtar(ip, 't49'), 't49');
  kontrol('50 hata: tanıdıksız IP durdu', g.girisIpEngeli(ip));
  /* 10 hesabın girdiği IP: 50 hatada soru, 70 hatada durur. */
  const ip2 = '40.0.0.2';
  for (let i = 0; i < 10; i++) g.girisTanidik(ip2, 'girdi' + i, true);
  kontrol('10 hesabın girdiği IP: sınır 70', g.ipHataSiniri(ip2) === 70, g.ipHataSiniri(ip2));
  /* Herkesin kendisi açabildiği yetişkin hesabı sınırı büyütmez (ama o hesap
     için bağlantı tanıdık olur). */
  for (let i = 0; i < 40; i++) g.girisTanidik(ip2, 'yetiskin' + i, false);
  kontrol('40 yetişkin hesabı daha girdi: sınır yine 70', g.ipHataSiniri(ip2) === 70, g.ipHataSiniri(ip2));
  kontrol('yetişkin hesabı için bağlantı tanıdık', g.tanidikMi(ip2, 'yetiskin3') && !g.tanidikMi(ip2, 'yetiskin99'));
  for (let i = 0; i < 50; i++) g.girisHatasi(ip2, anahtar(ip2, 't' + i), 't' + i);
  kontrol('50 hata: o IP\'deki temiz hesaba da soru', g.girisSoruLazim(ip2, anahtar(ip2, 'temiz'), 'temiz'));
  kontrol('50 hata: 10 hesabın girdiği IP henüz durmadı', !g.girisIpEngeli(ip2));
  for (let i = 50; i < 70; i++) g.girisHatasi(ip2, anahtar(ip2, 't' + i), 't' + i);
  kontrol('70 hata: durdu', g.girisIpEngeli(ip2));

  console.log('\n=== GENEL İSTEK SINIRI (sunucusuz) ===');
  const G = g.GENEL_SINIR;
  const rastgeleAnahtar = () => require('crypto').randomBytes(24).toString('hex');
  /* Oturumsuz sel: IP sınırında durur. Ardından uydurma oturum anahtarları
     yeni sayaç açmaz (eskiden her biri belleğe bir kayıt ekliyordu). */
  const selIp = '50.0.0.1';
  let gecen = 0;
  for (let i = 0; i < G.ip; i++) if (!g.genelIstekSiniri(selIp, false, '')) gecen++;
  kontrol('IP başına ' + G.ip + ' API isteği geçiyor', gecen === G.ip, 'geçen ' + gecen);
  kontrol('sonraki istek IP sınırında duruyor', g.genelIstekSiniri(selIp, false, '') === 'ip');
  const once = g.genelKayit.size;
  let ipSiniri = 0;
  for (let i = 0; i < 2000; i++) if (g.genelIstekSiniri(selIp, false, rastgeleAnahtar()) === 'ip') ipSiniri++;
  kontrol('IP sınırı dolunca 2000 uydurma oturum anahtarı sayaç açmıyor', ipSiniri === 2000 && g.genelKayit.size === once,
    'ip ' + ipSiniri + ', sayaç ' + once + ' -> ' + g.genelKayit.size);
  /* Tek oturumun seli: oturum sınırında durur, IP payını yemez. */
  const agIp = '50.0.0.2', tok = rastgeleAnahtar();
  const sonuc = {};
  for (let i = 0; i < 1000; i++) { const s = g.genelIstekSiniri(agIp, false, tok) || 'gecti'; sonuc[s] = (sonuc[s] || 0) + 1; }
  const ipSayac = (g.genelKayit.get('genelApi:' + agIp) || {}).sayac;
  kontrol('tek oturum ' + G.oturum + ' istekten sonra "oturum" sınırında duruyor', sonuc.gecti === G.oturum && sonuc.oturum === 1000 - G.oturum, J(sonuc));
  kontrol('durdurulan istekler IP sayacından düşüldü (IP sayacı ' + G.oturum + ')', ipSayac === G.oturum, 'IP sayacı ' + ipSayac);
  /* Sayaç haritası üst sınırda: yeni anahtar sayılmaz, harita büyümez. */
  for (let i = 0; g.genelKayit.size < g.EN_FAZLA_GENEL_SAYAC; i++) {
    g.genelIstekSiniri('51.' + (i >> 16 & 255) + '.' + (i >> 8 & 255) + '.' + (i & 255), true, '');
  }
  const dolu = g.genelKayit.size;
  const dolunca = g.genelIstekSiniri('52.0.0.1', false, rastgeleAnahtar());
  kontrol('sayaç haritası ' + g.EN_FAZLA_GENEL_SAYAC + ' kayıtta büyümüyor', dolunca === '' && g.genelKayit.size === dolu &&
    dolu === g.EN_FAZLA_GENEL_SAYAC, 'sonuç ' + dolunca + ', boyut ' + g.genelKayit.size);
  g.genelKayit.clear();
}

(async () => {
  const baglanti = testDeposu();
  if (!baglanti) { console.log('  KALDI  test veritabanı değil (adı _test ile bitmeli)'); process.exit(1); }
  const { sorgu, tek } = baglanti;

  console.log('=== HAZIRLIK: ' + KISI + ' ÖĞRENCİ HESABI ===');
  const okul = await tek("SELECT o.kisa_ad, s.sinif_id FROM kullanicilar s JOIN okullar o ON o.id = s.okul_id WHERE s.eposta = 'ogrenci1@test.com'");
  kontrol('seed okulu ve kısa adı var', !!(okul && okul.kisa_ad), J(okul));
  const kisa = okul.kisa_ad;
  const ozet = await require('../sunucu/sifre').hashPw(SIFRE);
  await sorgu(
    'INSERT INTO kullanicilar (id, kullanici_adi, sifre_ozeti, ad_soyad, rol, durum, okul_id, sinif_id, kvkk_onay, kvkk_tarih, kvkk_surum) ' +
    "SELECT 'u_ag' || n, 'agogr' || n, $1, 'Ağ Öğrencisi ' || n, 'student', 'approved', s.okul_id, s.sinif_id, true, now(), s.kvkk_surum " +
    "FROM kullanicilar s CROSS JOIN generate_series(1, $2::int) n WHERE s.eposta = 'ogrenci1@test.com' ON CONFLICT (id) DO NOTHING",
    [ozet, KISI]);
  await sorgu(
    'INSERT INTO odev_ogrencileri (odev_id, ogrenci_id) SELECT oo.odev_id, k.id FROM odev_ogrencileri oo ' +
    "JOIN kullanicilar s ON s.id = oo.ogrenci_id AND s.eposta = 'ogrenci1@test.com' " +
    "CROSS JOIN kullanicilar k WHERE k.kullanici_adi LIKE 'agogr%' ON CONFLICT DO NOTHING");
  const n = Number((await tek("SELECT count(*) AS n FROM kullanicilar WHERE kullanici_adi LIKE 'agogr%'")).n);
  kontrol(KISI + ' öğrenci hesabı hazır (ödevleriyle)', n >= KISI, 'hesap ' + n);

  /* Okulun sayfası: kapak, logo ve 4 galeri fotoğrafı (giriş sayfasında görünür). */
  const PNG = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==', 'base64');
  const mevcut = await istek(new http.Agent(), OKUL_IP, '/api/okul-adres?kisa=' + kisa);
  if (!(((mevcut.json || {}).sayfa || {}).fotolar || []).length) {
    const M = (await girisYap('mudur@test.com', 'Test1234!')).token;
    for (const yer of ['kapak', 'logo', 'galeri', 'galeri', 'galeri', 'galeri']) {
      await fetch(BASE + '/api/okul-sayfa/foto?yer=' + yer, { method: 'POST', body: PNG,
        headers: { 'Content-Type': 'image/png', Authorization: 'Bearer ' + M } });
    }
  }
  const sonra = await istek(new http.Agent(), OKUL_IP, '/api/okul-adres?kisa=' + kisa);
  kontrol('okul sayfasında 6 fotoğraf var', ((sonra.json.sayfa || {}).fotolar || []).length === 6, J(sonra.json).slice(0, 120));

  console.log('\n=== OKUL AĞI: ' + KISI + ' ÖĞRENCİ AYNI ANDA (tek IP) ===');
  const o = await senaryo(kisa, YAYILMA_MS);
  senaryoYaz(YAYILMA_MS <= 2000 ? 'ani yük' : 'kademeli', o);
  const z = o.ozet;
  kontrol('hiçbir istek 429 almadı', z.d429 === 0, z.d429 + ' kez 429: ' + J(z.sinir));
  kontrol('hiçbir istek 503 almadı', z.d503 === 0, z.d503 + ' kez 503');
  kontrol('hiçbir bağlantı kesilmedi', z.baglantiHatasi === 0, J(z.hata));
  kontrol('yanlış şifre yazan ' + Math.floor(KISI / 10) + ' kişi soru aldı', z.yanlisSifre === Math.floor(KISI / 10), 'gören ' + z.yanlisSifre);
  kontrol('herkes girdi (' + z.giren + '/' + KISI + ')', z.giren === KISI, J(o.girisHatasi.slice(0, 3)));
  kontrol('herkesin ana sayfası, Ödevler ve Program açıldı', z.sayfaTamam === KISI, z.sayfaTamam + '/' + KISI);
  o.ajanlar.forEach(a => a.destroy());

  if (SALDIRI) await saldirilar(kisa, o.girenler);
  hesapSiniriSunucusuz();

  await baglanti.kapat();
  console.log('');
  console.log('GECTI: ' + gecti + '   KALDI: ' + kaldi);
  process.exit(kaldi ? 1 : 0);
})().catch(e => { console.error('TEST HATASI:', e); process.exit(1); });
