/* Gizli yönetim paneli (/admin):
   - çerezsiz (ya da geçersiz çerezli) /admin ve altı, bilinmeyen bir adresle BAYT
     BAYT aynı 404 (durum, başlıklar, ETag, gövde; GET/HEAD, sıkıştırmalı/sıkıştırmasız);
     ön yüz parça klasörleri ve .md belgeleri (diskte olsa da) de aynı 404; uydurma ama biçimli çerezle /admin de bilinmeyen adres de
     çerezi bir kez veritabanında arar (süre farkı yok), çerezsiz ikisi de hiç aramaz; /admin
     bilinmeyen adres kadar diske bakar (fs.stat);
   - yönetici girişinde HttpOnly, SameSite=Strict, Path=/admin çerezi; yönetici olmayana çerez
     ve /admin adresi hiç gitmez;
   - geçerli çerezle yönetim kabuğu ve /admin/yonetim.js (derlenir), önbelleğe alınmaz;
   - çıkış, şifre değişimi ve oturum süresinin dolması çerezi geçersiz yapar; /api/me çerezi yeniler
     (oturumun en yeni 3 çerezi geçerli);
   - çerez /api için hiçbir şey değildir (yalnız Authorization);
   - herkese giden /js/app.js yönetim kodu ve uç listesi taşımaz (yönetim parçaları ayrı klasördeyse);
   - yönetici uçları yönetici olmayana bilinmeyen API adresiyle aynı 404;
   - robots.txt /admin'i ele vermez. Yalnız test veritabanında (_test) çalışır. */
const fs = require('fs');
const path = require('path');
const http = require('http');
const vm = require('vm');
const { iste, girisYap, botCevabi, sonKod, hesapAc } = require('./giris');

let gecti = 0, kaldi = 0;
function kontrol(ad, sart, detay) {
  if (sart) { gecti++; console.log('  GECTI  ' + ad); }
  else { kaldi++; console.log('  KALDI  ' + ad + (detay ? '  -> ' + detay : '')); }
}
const J = x => JSON.stringify(x).slice(0, 260);
const TABAN = new URL(process.env.EE_BASE || 'http://localhost:3000');

/* Ham istek: başlıklar sırasıyla (rawHeaders) ve gövde bayt olarak. */
function ham(yol, yontem, baslik) {
  return new Promise((ok, red) => {
    const r = http.request({ host: TABAN.hostname, port: TABAN.port, path: yol, method: yontem || 'GET', headers: baslik || {} }, c => {
      const p = [];
      c.on('data', d => p.push(d));
      c.on('end', () => ok({ durum: c.statusCode, ham: c.rawHeaders, baslik: c.headers, govde: Buffer.concat(p) }));
    });
    r.on('error', red);
    r.end();
  });
}
/* Karşılaştırmada Date (saniye) ve bağlantı başlıkları dışarıda; sıra dahil. */
function basliklar(h) {
  const o = [];
  for (let i = 0; i < h.length; i += 2) if (!/^(date|connection|keep-alive)$/i.test(h[i])) o.push(h[i] + ': ' + h[i + 1]);
  return o.join('\n');
}
async function ayniMi(a, b) {
  return a.durum === b.durum && basliklar(a.ham) === basliklar(b.ham) && a.govde.equals(b.govde);
}
function farkAnlat(a, b) {
  if (a.durum !== b.durum) return 'durum ' + a.durum + ' / ' + b.durum;
  if (basliklar(a.ham) !== basliklar(b.ham)) return 'başlık: ' + basliklar(a.ham).slice(0, 200) + ' || ' + basliklar(b.ham).slice(0, 200);
  return 'gövde ' + a.govde.length + ' / ' + b.govde.length;
}

function testDeposu() {
  process.env.EE_DATA = path.join(__dirname, 'testdata');
  require('../sunucu/ayarlar').ayarlariYukle();
  const baglanti = require('../sunucu/veri/baglanti');
  if (!/_test$/.test(baglanti.veritabaniAdi() || '')) return null;
  return { baglanti, oturumlar: require('../sunucu/veri/depo/oturumlar') };
}

/* Yöneticinin iki adımlı girişi: ikinci adımın başlıkları da gerekir. */
async function yoneticiGirisi(eposta, sifre) {
  const bot = await botCevabi();
  const a1 = await iste('/api/login', 'POST', { email: eposta, password: sifre, challengeId: bot.challengeId, challengeAnswer: bot.challengeAnswer });
  if (!a1.body.twoFactor) return { a1, a2: a1 };
  const a2 = await iste('/api/login/dogrula', 'POST', { challengeId: a1.body.challengeId, code: sonKod(eposta) });
  return { a1, a2 };
}
const cerezAl = r => {
  const sc = r.headers.get('set-cookie') || '';
  const m = /ee_yonetim=([a-f0-9]*)/.exec(sc);
  return { ham: sc, deger: m ? m[1] : null, cerez: m ? 'ee_yonetim=' + m[1] : '' };
};

(async () => {
  const depo = testDeposu();
  if (!depo) { console.log('  KALDI  test veritabanı değil (adı _test ile bitmeli)'); process.exit(1); }

  console.log('=== 1) ÇEREZSİZ /admin = BİLİNMEYEN ADRES (BAYT BAYT) ===');
  const ciftler = [
    ['/admin', '/olmayan-sayfa'], ['/admin/', '/olmayan-sayfa/'], ['/admin/yonetim.js', '/olmayan-klasor/yonetim.js'],
    ['/admin/site-ayarlari', '/olmayan-klasor/site-ayarlari'], ['/ADMIN', '/OLMAYAN'], ['/admin?x=1', '/olmayan-sayfa?x=1'],
    ['/admin/a/b/c.html', '/olmayan-klasor/a/b/c.html'], ['/admin/.env', '/olmayan-klasor/.env'],
    ['/js/yonetim/09-yonetici.js', '/js/olmayan/09-yonetici.js'], ['/js/parcalar/06-menu.js', '/js/olmayan/06-menu.js'],
    ['/admin%00', '/olmayan%00']
  ];
  const kodlamalar = [{}, { 'accept-encoding': 'gzip' }, { 'accept-encoding': 'br' }, { 'accept-encoding': 'gzip, deflate, br' }];
  const farklar = [];
  let denenen = 0;
  for (const [adm, bil] of ciftler) {
    for (const k of kodlamalar) {
      for (const yontem of ['GET', 'HEAD']) {
        const [a, b] = await Promise.all([ham(adm, yontem, k), ham(bil, yontem, k)]);
        denenen++;
        if (a.durum !== 404 || !(await ayniMi(a, b))) farklar.push(yontem + ' ' + adm + ' ' + J(k) + ': ' + farkAnlat(a, b));
      }
    }
  }
  kontrol('çerezsiz /admin, /admin/..., /js/yonetim/... bilinmeyen adresle aynı 404 (' + denenen + ' deneme)', !farklar.length,
    farklar.slice(0, 3).join(' | '));
  const ornek = await ham('/admin', 'GET', {});
  kontrol('404 "Sayfa bulunamadı" sayfası, önbelleğe alınmaz, ETag var', ornek.durum === 404 && /Sayfa bulunamadı/.test(ornek.govde.toString()) &&
    ornek.baslik['cache-control'] === 'no-store' && !!ornek.baslik.etag, ornek.durum + ' ' + ornek.baslik['cache-control']);
  const [p1, p2] = await Promise.all([ham('/admin', 'POST', {}), ham('/olmayan-sayfa', 'POST', {})]);
  kontrol('POST /admin bilinmeyen adresle aynı (405)', p1.durum === 405 && await ayniMi(p1, p2), farkAnlat(p1, p2));
  const sahte = 'ee_yonetim=' + 'ab'.repeat(32);
  const [s1, s2] = await Promise.all([ham('/admin', 'GET', { cookie: sahte }), ham('/olmayan-sayfa', 'GET', { cookie: sahte })]);
  kontrol('uydurma çerezle de aynı 404', s1.durum === 404 && await ayniMi(s1, s2), farkAnlat(s1, s2));
  const [b1, b2] = await Promise.all([ham('/admin', 'GET', { cookie: 'ee_yonetim=xyz' }), ham('/olmayan-sayfa', 'GET', { cookie: 'ee_yonetim=xyz' })]);
  kontrol('biçimsiz çerezle de aynı 404', b1.durum === 404 && await ayniMi(b1, b2), farkAnlat(b1, b2));

  /* Süre farkı olmasın: uydurma ama biçimli çerezle /admin çerezi veritabanında arar;
     bilinmeyen adres de aynı aramayı yapmalı. Sunucunun kodu bu süreçte sahte istek ve
     cevapla çalıştırılır, veritabanı araması sayılır (süre ölçülmez: makineye bağlı). */
  const httpKodu = require('../sunucu/http');
  const asilArama = depo.oturumlar.yonetimCereziSahibi;
  let arama = 0;
  depo.oturumlar.yonetimCereziSahibi = c => { arama++; return asilArama(c); };
  /* Disk yoklaması da sayılır: bilinmeyen adres önce dosyaya bakar (fs.stat); /admin de bakmalı. */
  const asilStat = fs.stat;
  let diskYoklama = 0;
  fs.stat = function () { diskYoklama++; return asilStat.apply(this, arguments); };
  const sahteIstek = (yol, cerez) => new Promise(bitti => {
    const req = { method: 'GET', url: yol, headers: cerez ? { host: 'x', cookie: cerez } : { host: 'x' }, socket: {} };
    const res = { req, basliklar: {}, setHeader(k, v) { this.basliklar[k] = v; }, getHeader(k) { return this.basliklar[k]; },
      writeHead(d) { this.durum = d; return this; }, end() { bitti(this.durum); } };
    httpKodu.serveStatic(req, res, yol);
  });
  const disk = {};
  const sayilan = async (yol, cerez) => {
    const once = arama, diskOnce = diskYoklama;
    const d = await sahteIstek(yol, cerez);
    disk[yol + (cerez ? ' ' + cerez.slice(0, 14) : '')] = diskYoklama - diskOnce;
    return d + ':' + (arama - once);
  };
  const olcum = {
    adminSahte: await sayilan('/admin', sahte), bilinmeyenSahte: await sayilan('/olmayan-sayfa', sahte),
    gizliSahte: await sayilan('/.env', sahte), parcaSahte: await sayilan('/js/parcalar/06-menu.js', sahte),
    adminCerezsiz: await sayilan('/admin'), bilinmeyenCerezsiz: await sayilan('/olmayan-sayfa'),
    adminBicimsiz: await sayilan('/admin', 'ee_yonetim=xyz'), bilinmeyenBicimsiz: await sayilan('/olmayan-sayfa', 'ee_yonetim=xyz'),
    adminAlt: await sayilan('/admin/site-ayarlari'), bilinmeyenAlt: await sayilan('/olmayan-klasor/site-ayarlari')
  };
  depo.oturumlar.yonetimCereziSahibi = asilArama;
  fs.stat = asilStat;
  kontrol('uydurma biçimli çerezle /admin de bilinmeyen adres de çerezi bir kez arıyor (süre farkı yok)',
    olcum.adminSahte === '404:1' && olcum.bilinmeyenSahte === '404:1' && olcum.gizliSahte === '404:1' && olcum.parcaSahte === '404:1',
    J(olcum));
  kontrol('çerezsiz ya da biçimsiz çerezle iki yol da veritabanına hiç gitmiyor', olcum.adminCerezsiz === '404:0' &&
    olcum.bilinmeyenCerezsiz === '404:0' && olcum.adminBicimsiz === '404:0' && olcum.bilinmeyenBicimsiz === '404:0', J(olcum));
  const dk = k => disk[k];
  kontrol('/admin bilinmeyen adres kadar diske bakıyor (fs.stat; süre farkı yok)', dk('/admin') > 0 &&
    dk('/admin') === dk('/olmayan-sayfa') && dk('/admin/site-ayarlari') === dk('/olmayan-klasor/site-ayarlari') &&
    dk('/admin ' + sahte.slice(0, 14)) === dk('/olmayan-sayfa ' + sahte.slice(0, 14)), J(disk));

  console.log('=== 1b) BELGELER (.md) WEB\'DEN OKUNMAZ ===');
  /* Kod dosyalarının yanındaki .md belgeleri public/ altında da durabilir; statik sunucu
     onları hiç vermez: dosya diskte olsa da bilinmeyen adresle bayt bayt aynı 404. Deneme
     için public/ altına geçici .md (ve karşılaştırma için .txt) yazılır, sonunda silinir. */
  const PUB = path.join(__dirname, '..', 'public');
  const gecici = 'zz-belge-denetimi-' + process.pid;
  const geciciDosyalar = [path.join(PUB, gecici + '.md'), path.join(PUB, 'js', gecici + '.md'),
    path.join(PUB, 'kvkk', gecici + '.md'), path.join(PUB, gecici + '.txt')];
  const geciciSil = () => { for (const d of geciciDosyalar) { try { fs.unlinkSync(d); } catch (e) { /* yok */ } } };
  process.on('exit', geciciSil);
  try {
    for (const d of geciciDosyalar) fs.writeFileSync(d, '# gizli olmayan deneme belgesi\n');
    const txt = await ham('/' + gecici + '.txt', 'GET', {});
    kontrol('aynı yerdeki deneme .txt 200 (sunucu bu public/ klasöründen okuyor)', txt.durum === 200, txt.durum);
    const belgeler = ['/js/belge.md', '/js/parcalar/05-giris.md', '/TANITIM.md', '/tanitim.md', '/kvkk/x.md', '/sunucu/api.md',
      '/' + gecici + '.md', '/' + gecici + '.MD', '/js/' + gecici + '.md', '/kvkk/' + gecici + '.md', '/' + gecici + '.md.',
      '/' + gecici + '.md%20', '/' + gecici + '.md::$DATA', '/js/' + gecici + '.md/', '/js/' + gecici + '%2Emd',
      '/' + gecici + '.md?v=1'];
    const mdFark = [];
    let mdDenenen = 0;
    for (const yol of belgeler) {
      for (const k of kodlamalar) {
        for (const yontem of ['GET', 'HEAD']) {
          const [a, b] = await Promise.all([ham(yol, yontem, k), ham('/olmayan-belge-sayfasi', yontem, k)]);
          mdDenenen++;
          if (a.durum !== 404 || !(await ayniMi(a, b))) mdFark.push(yontem + ' ' + yol + ' ' + J(k) + ': ' + farkAnlat(a, b));
        }
      }
    }
    kontrol('.md adresleri (diskte olan dahil) bilinmeyen adresle aynı 404 (' + mdDenenen + ' deneme)', !mdFark.length,
      mdFark.slice(0, 3).join(' | '));
    const [m1, m2] = await Promise.all([ham('/' + gecici + '.md', 'GET', { cookie: sahte }), ham('/olmayan-belge-sayfasi', 'GET', { cookie: sahte })]);
    kontrol('uydurma çerezle .md de aynı 404', m1.durum === 404 && await ayniMi(m1, m2), farkAnlat(m1, m2));
  } finally {
    geciciSil();
  }
  kontrol('geçici deneme dosyaları silindi', geciciDosyalar.every(d => !fs.existsSync(d)));

  console.log('=== 2) YÖNETİCİ GİRİŞİ: ÇEREZ ===');
  const g = await yoneticiGirisi('admin@egitimevi.com', 'admin123');
  const c1 = cerezAl(g.a2);
  kontrol('şifre adımında çerez yok (iki adımlı giriş bitmeden)', !(g.a1.headers.get('set-cookie') || ''), g.a1.headers.get('set-cookie'));
  kontrol('kod adımında /admin çerezi yazılıyor', !!c1.deger && c1.deger.length === 64, c1.ham);
  kontrol('çerez HttpOnly, SameSite=Strict, Path=/admin, süreli', /;\s*HttpOnly/i.test(c1.ham) && /;\s*SameSite=Strict/i.test(c1.ham) &&
    /;\s*Path=\/admin(;|$)/.test(c1.ham) && /Max-Age=\d+/.test(c1.ham), c1.ham);
  kontrol('http sitede Secure yok (https sitede olur)', !/Secure/i.test(c1.ham), c1.ham);
  kontrol('giriş cevabında yonetimAdresi /admin', g.a2.body.yonetimAdresi === '/admin', J(g.a2.body.yonetimAdresi));
  const A = g.a2.body.token;

  const og = await yoneticiGirisi('mat@test.com', 'Test1234!');
  kontrol('öğretmen girişinde çerez ve yonetimAdresi yok', !(og.a2.headers.get('set-cookie') || '') && og.a2.body.yonetimAdresi === undefined &&
    JSON.stringify(og.a2.body).indexOf('/admin') < 0, og.a2.headers.get('set-cookie'));
  const ogrBot = await botCevabi();
  const ogr = await iste('/api/login', 'POST', { email: 'ogrenci1@test.com', password: 'Test1234!', challengeId: ogrBot.challengeId,
    challengeAnswer: ogrBot.challengeAnswer });
  kontrol('öğrenci girişinde çerez yok', ogr.status === 200 && !(ogr.headers.get('set-cookie') || '') && !ogr.body.yonetimAdresi);
  const ogMe = await iste('/api/me', 'GET', null, og.a2.body.token);
  kontrol('öğretmenin /api/me cevabında çerez ve /admin yok', ogMe.status === 200 && !(ogMe.headers.get('set-cookie') || '') &&
    JSON.stringify(ogMe.body).indexOf('/admin') < 0);
  const ogCikis = await iste('/api/logout', 'POST', null, og.a2.body.token);
  kontrol('öğretmenin çıkışında çerez silme başlığı yok', ogCikis.status === 200 && !(ogCikis.headers.get('set-cookie') || ''));

  console.log('=== 3) GEÇERLİ ÇEREZLE PANEL ===');
  const k1 = await ham('/admin', 'GET', { cookie: c1.cerez });
  const kabuk = k1.govde.toString();
  kontrol('/admin yönetim kabuğunu açıyor', k1.durum === 200 && /text\/html/.test(k1.baslik['content-type']) &&
    /id="authWrap"/.test(kabuk), k1.durum + ' ' + k1.baslik['content-type']);
  kontrol('kabuk /js/app.js yerine /admin/yonetim.js yüklüyor', /"\/admin\/yonetim\.js\?v=[a-f0-9]+"/.test(kabuk) &&
    kabuk.indexOf('"/js/app.js') < 0);
  kontrol('kabuk önbelleğe alınmıyor, arama motoruna kapalı', k1.baslik['cache-control'] === 'no-store' &&
    /noindex/.test(k1.baslik['x-robots-tag'] || '') && !k1.baslik.etag, J(k1.baslik));
  const k2 = await ham('/admin/site-ayarlari/alt', 'GET', { cookie: c1.cerez });
  kontrol('/admin/<herhangi> de kabuk', k2.durum === 200 && k2.govde.equals(k1.govde));
  const kh = await ham('/admin', 'HEAD', { cookie: c1.cerez });
  kontrol('HEAD /admin 200, gövdesiz', kh.durum === 200 && kh.govde.length === 0);
  const js = await ham('/admin/yonetim.js', 'GET', { cookie: c1.cerez });
  let derleme = '';
  try { new vm.Script(js.govde.toString()); } catch (e) { derleme = e.message; }
  kontrol('/admin/yonetim.js veriliyor ve derleniyor', js.durum === 200 && /javascript/.test(js.baslik['content-type']) && !derleme &&
    js.govde.length > 1000, js.durum + ' ' + derleme);
  kontrol('/admin/yonetim.js önbelleğe alınmıyor', js.baslik['cache-control'] === 'no-store');
  const jsGz = await ham('/admin/yonetim.js', 'GET', { cookie: c1.cerez, 'accept-encoding': 'gzip' });
  kontrol('/admin/yonetim.js sıkıştırılıyor', jsGz.durum === 200 && jsGz.baslik['content-encoding'] === 'gzip' && jsGz.govde.length < js.govde.length);
  const apiCerezle = await fetch(TABAN.origin + '/api/me', { headers: { cookie: c1.cerez } });
  kontrol('çerez /api için hiçbir şey değil (Authorization yoksa 401)', apiCerezle.status === 401, apiCerezle.status);
  const cerezleAdmin = await fetch(TABAN.origin + '/api/admin/overview', { headers: { cookie: c1.cerez } });
  const cerezleAdminGovde = await cerezleAdmin.json();
  kontrol('çerezle yönetici ucu da bilinmeyen adres (404)', cerezleAdmin.status === 404 && cerezleAdminGovde.error === 'Böyle bir adres yok');

  console.log('=== 4) HERKESE GİDEN app.js YÖNETİM KODU TAŞIMIYOR ===');
  const app = (await ham('/js/app.js', 'GET', {})).govde.toString();
  const yonetimKlasoru = path.join(__dirname, '..', 'public', 'js', 'yonetim');
  if (fs.existsSync(yonetimKlasoru)) {
    const yasakli = ['/admin', 'yorumlar/hepsi', 'yorumlar/gizle', 'backup-restore', 'site-ayarlari', 'yonetici-dosyasi', 'okul-adresleri',
      'okul-disk-siniri']
      .filter(x => app.indexOf(x) >= 0);
    kontrol('app.js\'te yönetim ucu ve /admin adresi yok', !yasakli.length, yasakli.join(', '));
    kontrol('yönetim kodu /admin/yonetim.js\'te', js.govde.toString().indexOf('/admin/') >= 0);
    kontrol('yönetim paketi app.js\'ten büyük (uygulama + yönetim parçaları)', js.govde.length > app.length, js.govde.length + ' / ' + app.length);
  } else {
    console.log('  ATLANDI  app.js\'te yönetim kodu yok: public/js/yonetim/ henüz yok (yönetim parçaları ön yüzde taşınınca denenir)');
  }
  const robots = await ham('/robots.txt', 'GET', {});
  kontrol('robots.txt /admin adresini ele vermiyor', robots.durum === 404 || robots.govde.toString().indexOf('admin') < 0, robots.durum);
  const siteBilgi = await iste('/api/site');
  kontrol('/api/site /admin adresini ele vermiyor', JSON.stringify(siteBilgi.body).indexOf('admin') < 0);

  console.log('=== 5) /api/me ÇEREZİ YENİLER (EN YENİ 3 GEÇERLİ) ===');
  const yeni = [];
  for (let i = 0; i < 4; i++) {
    const m = await iste('/api/me', 'GET', null, A);
    yeni.push(cerezAl(m));
    if (i === 0) kontrol('/api/me yöneticiye yonetimAdresi ve yeni çerez veriyor', m.body.yonetimAdresi === '/admin' && !!yeni[0].deger);
  }
  const gecerli = async c => (await ham('/admin', 'GET', { cookie: c.cerez })).durum === 200;
  kontrol('en yeni çerez geçerli', await gecerli(yeni[3]));
  kontrol('ondan önceki iki çerez de geçerli (iki sekme birbirini düşürmez)', await gecerli(yeni[2]) && await gecerli(yeni[1]));
  kontrol('daha eskiler geçersiz', !(await gecerli(yeni[0])) && !(await gecerli(c1)));

  console.log('=== 6) ÇIKIŞ ÇEREZİ GEÇERSİZ YAPAR ===');
  const cikis = await iste('/api/logout', 'POST', null, A);
  const silme = cikis.headers.get('set-cookie') || '';
  kontrol('yöneticinin çıkışında çerez siliniyor (Max-Age=0)', /ee_yonetim=;/.test(silme) && /Max-Age=0/.test(silme) && /Path=\/admin/.test(silme), silme);
  const [ck1, ck2] = await Promise.all([ham('/admin', 'GET', { cookie: yeni[3].cerez }), ham('/olmayan-sayfa', 'GET', { cookie: yeni[3].cerez })]);
  kontrol('çıkıştan sonra eski çerezle /admin bilinmeyen adresle aynı 404', ck1.durum === 404 && await ayniMi(ck1, ck2), farkAnlat(ck1, ck2));

  console.log('=== 7) ŞİFRE DEĞİŞİNCE ESKİ ÇEREZ GEÇERSİZ ===');
  const g2 = await yoneticiGirisi('admin@egitimevi.com', 'admin123');
  const c2 = cerezAl(g2.a2);
  kontrol('yeniden girişte yeni çerez', !!c2.deger && await gecerli(c2));
  const sd = await iste('/api/password', 'POST', { old: 'admin123', new: 'Yeni-Sifre-2026!' }, g2.a2.body.token);
  const c3 = cerezAl(sd);
  kontrol('şifre değişti; cevapta yeni çerez ve yonetimAdresi', sd.status === 200 && !!c3.deger && sd.body.yonetimAdresi === '/admin',
    sd.status + ' ' + J(sd.body));
  kontrol('eski çerez geçersiz, yenisi geçerli', !(await gecerli(c2)) && await gecerli(c3));
  const geriAl = await iste('/api/password', 'POST', { old: 'Yeni-Sifre-2026!', new: 'Eski-Sifre-2026!' }, g2.a2.body.token);
  kontrol('şifre yeniden değişti', geriAl.status === 200, J(geriAl.body));

  console.log('=== 8) OTURUM SÜRESİ DOLUNCA ÇEREZ GEÇERSİZ ===');
  const c4 = cerezAl(geriAl);
  kontrol('son çerez geçerli', await gecerli(c4));
  await depo.oturumlar.geriTarihle(g2.a2.body.token, 8);
  kontrol('oturumun süresi dolunca çerez geçersiz (404)', !(await gecerli(c4)));

  console.log('=== 9) YÖNETİCİ UÇLARI YÖNETİCİ OLMAYANA BİLİNMEYEN ADRES ===');
  const z = Date.now().toString(36);
  await hesapAc({ fullName: 'Rolsüz Deneme', username: 'rolsuz' + z, email: 'rolsuz' + z + '@test.com', password: 'Test1234!' });
  const kisiler = {
    'giriş yok': null,
    'öğrenci': ogr.body.token,
    'öğretmen': (await girisYap('mat@test.com', 'Test1234!')).token,
    'müdür': (await girisYap('mudur@test.com', 'Test1234!')).token,
    'rolsüz yetişkin': (await girisYap('rolsuz' + z + '@test.com', 'Test1234!')).token
  };
  const uclar = [['GET', '/api/admin/overview'], ['GET', '/api/admin/site-ayarlari'], ['POST', '/api/admin/site-ayarlari'],
    ['GET', '/api/admin/yonetici-dosyasi'], ['POST', '/api/admin/yonetici-dosyasi/oku'], ['POST', '/api/admin/okul-adres'],
    ['GET', '/api/admin/okul-adresleri'], ['POST', '/api/admin/backup-restore'], ['POST', '/api/admin/okul-disk-siniri'], ['GET', '/api/admin/olmayan-alt-uc'],
    ['GET', '/api/yorumlar/hepsi'], ['POST', '/api/yorumlar/gizle'], ['GET', '/api/admin']];
  const ayrilan = [];
  for (const kisi of Object.keys(kisiler)) {
    for (const [yontem, yol] of uclar) {
      const govde = yontem === 'POST' ? { anahtar: 'iletisim', deger: {} } : null;
      const [a, b] = await Promise.all([iste(yol, yontem, govde, kisiler[kisi]), iste('/api/boyle-bir-uc-yok', yontem, govde, kisiler[kisi])]);
      /* Bilinmeyen adresin aldığı cevabın aynısı (şifresini değiştirmesi gereken kişi ikisinde de 403 alır). */
      if (a.status !== b.status || JSON.stringify(a.body) !== JSON.stringify(b.body) ||
          a.headers.get('content-type') !== b.headers.get('content-type') || (b.status === 404 && a.status !== 404)) {
        ayrilan.push(kisi + ' ' + yontem + ' ' + yol + ' ' + a.status + ' ' + J(a.body));
      }
    }
  }
  kontrol('yönetici uçları yönetici olmayan herkese bilinmeyen adresle aynı cevap (' + Object.keys(kisiler).length * uclar.length + ')',
    !ayrilan.length, ayrilan.slice(0, 3).join(' | '));
  const bilinmeyen = await iste('/api/boyle-bir-uc-yok', 'GET', null, null);
  kontrol('bilinmeyen adresin cevabı 404 {"error":"Böyle bir adres yok"}', bilinmeyen.status === 404 &&
    JSON.stringify(bilinmeyen.body) === JSON.stringify({ error: 'Böyle bir adres yok' }), J(bilinmeyen.body));
  const rolsuzOkul = await iste('/api/school/students', 'GET', null, kisiler['rolsüz yetişkin']);
  kontrol('rolsüz kişinin var olan okul ucu yine 403 rolsuz (kapı değişmedi)', rolsuzOkul.status === 403 && rolsuzOkul.body.rolsuz === true);

  /* Aynı sunucuda sonra çalışacak paketler için yöneticinin şifresi eski hâline döner. */
  const { hashPw } = require('../sunucu/sifre');
  await require('../sunucu/veri/depo/kullanicilar').guncelle(g.a2.body.user.id, { pass: await hashPw('admin123') });
  const tekrar = await yoneticiGirisi('admin@egitimevi.com', 'admin123');
  kontrol('yönetici şifresi eski hâline döndü', !!tekrar.a2.body.token);

  await depo.baglanti.kapat();
  console.log();
  console.log('  GECTI: ' + gecti + '   KALDI: ' + kaldi);
  process.exit(kaldi ? 1 : 0);
})().catch(e => { console.error('TEST HATASI:', e.message, e.stack); process.exit(1); });
