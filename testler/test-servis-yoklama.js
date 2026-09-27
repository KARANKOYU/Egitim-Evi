/* Servis yoklaması, saat aralıkları, sıra, notlar, cihaz anahtarı, uygulama oturumu:
   - okulun servis saatlerini müdür seçer (doğrulama, işlem kaydı); aralık dışında
     yoklama ve sefer açılmaz, haritada sefer ve canlı bilgi dönmez;
   - sabah bindi / binmedi (ilk "bindi" seferi başlatır), "Okula vardık"; akşam
     geldi / gelmedi, "Başlat", indi (hepsi inince sefer biter);
   - veliye giden bildirimler: bir kez; bindi -> binmedi düzeltmesi bir kez;
     velisi "binmeyecek" dediyse binmedi bildirimi yok; öğrenciye gitmez;
   - sıra ve "önünde N öğrenci"; yeni öğrenci sona eklenir;
   - servisçi notu ve velinin "binmeyecek" işareti (7 gün, yoklama alınınca kilit);
   - yetkiler: başka servisçi, başka okul, velinin başka çocuğu; yönetim salt okunur;
   - aralık bitince sefer 60 dakika daha sürer, sonra kapanır;
   - telefon uygulamasının cihaz anahtarı (bildirim yoklama, imleç, en çok 20,
     servisSaatleri, servis konumu, hesaba giriş vermemesi, hesap başına 5);
   - uygulama oturumu 30 gün, tarayıcı oturumu 7 gün; portal değişince süre uzamaz;
   - aralık sonradan değişirse (aralık dışında başlamış sefer) sefer kapanır;
   - aynı anda gelen ilk "Bindi"ler ve "Başlat"lar tek sefer açar, bildirim kaybolmaz;
   - akşam serviste kalan son öğrenci "Gelmedi"ye çevrilince sefer biter.
   Saat aralığına bağlı bölümler şu anki Türkiye saatine göre aralığı kurar;
   kurulamıyorsa (gece yarısına çok yakın) o bölüm atlanır. Uzatma ve oturum
   süresi bölümleri test veritabanında zamanı geriye çeker (depo üzerinden). */
const path = require('path');
const { BASE, iste, girisYap, hesapAc, okulHesabi, mudurYap, botCevabi, sonKod, kisilikGec } = require('./giris');

let gecti = 0, kaldi = 0;
function kontrol(ad, sart, detay) {
  if (sart) { gecti++; console.log('  GECTI  ' + ad); }
  else { kaldi++; console.log('  KALDI  ' + ad + (detay ? '  -> ' + detay : '')); }
}
const atla = ad => console.log('  ATLANDI  ' + ad);
const J = x => String(JSON.stringify(x)).slice(0, 260);

/* ---- Türkiye saati ---- */
const trDk = () => { const d = new Date(Date.now() + 3 * 3600 * 1000); return d.getUTCHours() * 60 + d.getUTCMinutes(); };
const trGun = n => new Date(Date.now() + 3 * 3600 * 1000 + (n || 0) * 86400000).toISOString().slice(0, 10);
const hm = d => String(Math.floor(d / 60)).padStart(2, '0') + ':' + String(d % 60).padStart(2, '0');
const SAAT_EKLI = /^\d\d:\d\d'(de|da|te|ta)$/;

/* Şu an sabah aralığında (akşam aralığı sonra) — kurulamıyorsa null. */
function sabahAraligi(m) {
  const sb = Math.max(0, m - 30), st = Math.max(m + 20, sb + 30);
  if (st + 30 > 1439) return null;
  return [sb, st, st, Math.min(1439, st + 60)];
}
/* Şu an akşam aralığında (sabah aralığı önce). */
function aksamAraligi(m) {
  const ab = Math.max(30, m - 30);
  if (ab >= m) return null;
  const at = Math.min(1439, Math.max(m + 20, ab + 30));
  if (at - ab < 30 || at < m + 5) return null;
  return [ab - 30, ab, ab, at];
}
/* Şu an hiçbir aralıkta ve uzatmada değil. */
const disAraligi = m => m >= 240 ? [60, 90, 120, 150] : [1200, 1230, 1260, 1290];

/* Telefon uygulaması: X-Cihaz başlığıyla istek. */
async function cihaz(yol, yontem, govde, anahtar, bearer) {
  const h = { 'Content-Type': 'application/json' };
  if (anahtar !== undefined) h['X-Cihaz'] = anahtar;
  if (bearer) h.Authorization = 'Bearer ' + bearer;
  const r = await fetch(BASE + '/api/cihaz' + yol, { method: yontem || 'GET', headers: h, body: govde ? JSON.stringify(govde) : undefined });
  let body = {};
  try { body = await r.json(); } catch (e) { /* boş */ }
  return { status: r.status, body };
}

async function bildirimler(token) {
  const r = await iste('/api/notifications', 'GET', null, token);
  return (r.body.notifications || []).map(n => n.text || '');
}
const say = (liste, re) => liste.filter(t => re.test(t)).length;

/* Uygulamadan giriş: uygulama bayrağı giriş ya da doğrulama adımında. */
async function uygulamaGirisi(kimlik, sifre, asama) {
  const bot = await botCevabi();
  const g1 = await iste('/api/login', 'POST', { kimlik, password: sifre, challengeId: bot.challengeId, challengeAnswer: bot.challengeAnswer,
    uygulama: asama !== 'dogrula' });
  if (!g1.body.twoFactor) return g1.body;
  const g2 = await iste('/api/login/dogrula', 'POST', { challengeId: g1.body.challengeId, code: sonKod(kimlik), uygulama: asama === 'dogrula' });
  return g2.body;
}

/* Test veritabanına depo üzerinden bağlantı (yalnızca adı _test ile biterse). */
function testDeposu() {
  try {
    process.env.EE_DATA = path.join(__dirname, 'testdata');
    require('../sunucu/ayarlar').ayarlariYukle();
    const baglanti = require('../sunucu/veri/baglanti');
    if (!/_test$/.test(baglanti.veritabaniAdi() || '')) return null;
    return { baglanti, oturumlar: require('../sunucu/veri/depo/oturumlar'), okulHayati: require('../sunucu/veri/depo/okul-hayati'),
      servisYoklama: require('../sunucu/veri/depo/servis-yoklama') };
  } catch (e) { return null; }
}

(async () => {
  const z = Date.now().toString(36);
  const M = (await girisYap('mudur@test.com', 'Test1234!')).token;
  const A = (await girisYap('admin@egitimevi.com', 'admin123')).token;
  const o1 = await girisYap('ogrenci1', 'Test1234!');
  const o2 = await girisYap('ogrenci2', 'Test1234!');
  const mat = await girisYap('mat', 'Test1234!');
  const me1 = (await iste('/api/me', 'GET', null, o1.token)).body.user;
  const me2 = (await iste('/api/me', 'GET', null, o2.token)).body.user;

  /* Veliler: V (Zeynep'in), V2 (Burak'ın). */
  const vK = 'yveli' + z, v2K = 'yveli2' + z;
  await hesapAc({ fullName: 'Yoklama Veli', username: vK, email: vK + '@test.com' });
  await hesapAc({ fullName: 'Yoklama Veli İki', username: v2K, email: v2K + '@test.com' });
  let V = (await girisYap(vK, 'Test1234!')).token;
  let V2 = (await girisYap(v2K, 'Test1234!')).token;
  await iste('/api/parent/link', 'POST', { code: me1.code }, V);
  await iste('/api/parent/link', 'POST', { code: me2.code }, V2);
  V = (await girisYap(vK, 'Test1234!')).token;
  V2 = (await girisYap(v2K, 'Test1234!')).token;
  const vId = (await iste('/api/me', 'GET', null, V)).body.user.id;

  /* Üçüncü ve dördüncü öğrenci. */
  const o3h = await okulHesabi(M, 'student', { fullName: 'Can Yolcu', username: 'canyolcu' + z, password: 'Test1234!' });
  const o3 = await girisYap('canyolcu' + z, 'Test1234!');
  const o4h = await okulHesabi(M, 'student', { fullName: 'Ece Durak', username: 'ecedurak' + z, password: 'Test1234!' });

  /* Servisçiler ve servisler: A (S1; Zeynep, Burak, Can), B (S2; boş), başka okulda C (S3). */
  const sK = n => n + (Date.now() % 100000);
  const s1K = sK('yok1'), s2K = sK('yok2'), s3K = sK('yok3');
  await okulHesabi(M, 'servisci', { fullName: 'Yoklama Sürücü', username: s1K, password: 'Test1234!' });
  await okulHesabi(M, 'servisci', { fullName: 'İkinci Sürücü', username: s2K, password: 'Test1234!' });
  const S1 = await girisYap(s1K, 'Test1234!');
  const S2 = await girisYap(s2K, 'Test1234!');
  await hesapAc({ fullName: 'Yoklama Mudur', username: 'ymudur' + z, email: 'ymudur' + z + '@test.com' });
  const M2 = (await mudurYap('ymudur' + z, 'Test1234!', { schoolName: 'Yoklama Okulu ' + z, city: 'Ankara', district: 'Mamak' }, A)).token;
  await okulHesabi(M2, 'servisci', { fullName: 'Yabancı Sürücü', username: s3K, password: 'Test1234!' });
  const S3 = await girisYap(s3K, 'Test1234!');
  const svA = (await iste('/api/servis/kaydet', 'POST', { ad: 'Yoklama A ' + z, plaka: '06 YK 01', soforId: S1.user.id }, M)).body.id;
  const svB = (await iste('/api/servis/kaydet', 'POST', { ad: 'Yoklama B ' + z, plaka: '06 YK 02', soforId: S2.user.id }, M)).body.id;
  const svC = (await iste('/api/servis/kaydet', 'POST', { ad: 'Yoklama C ' + z, soforId: S3.user.id }, M2)).body.id;
  for (const id of [me1.id, me2.id, o3h.id]) await iste('/api/servis/ogrenci', 'POST', { servisId: svA, ogrenciId: id, durak: 'Durak' }, M);

  const saatYaz = a => iste('/api/servis/saatler', 'POST', { sabahBas: hm(a[0]), sabahBit: hm(a[1]), aksamBas: hm(a[2]), aksamBit: hm(a[3]) }, M);
  const genis = () => iste('/api/servis/saatler', 'POST', { sabahBas: '00:00', sabahBit: '11:59', aksamBas: '12:00', aksamBit: '23:59' }, M);
  const yoklama = (tok, servisId) => iste('/api/servis/yoklama' + (servisId ? '?servisId=' + servisId : ''), 'GET', null, tok);
  const isaret = (tok, ogrenciId, durum, ek) => iste('/api/servis/yoklama', 'POST', Object.assign({ servisId: svA, ogrenciId, durum }, ek || {}), tok);
  const harita = (tok, ogrenciId) => iste('/api/servis/harita' + (ogrenciId ? '?ogrenci=' + ogrenciId : ''), 'GET', null, tok);

  console.log('=== 1) SERVİS SAATLERİ ===');
  const g0 = await iste('/api/servis', 'GET', null, M);
  kontrol('müdür okulun servis saatlerini görüyor (testte 00:00-11:59 / 12:00-23:59)', g0.status === 200 && g0.body.saatDuzenleyebilir === true &&
    J(g0.body.saatler) === J({ sabahBas: '00:00', sabahBit: '11:59', aksamBas: '12:00', aksamBit: '23:59' }), J(g0.body.saatler));
  const kotuSaat = await Promise.all([
    { sabahBas: '25:00', sabahBit: '09:20', aksamBas: '16:30', aksamBit: '19:00' },
    { sabahBas: '09:20', sabahBit: '07:00', aksamBas: '16:30', aksamBit: '19:00' },
    { sabahBas: '07:00', sabahBit: '07:20', aksamBas: '16:30', aksamBit: '19:00' },
    { sabahBas: '07:00', sabahBit: '17:00', aksamBas: '16:30', aksamBit: '19:00' },
    { sabahBas: '07:00', sabahBit: '09:20', aksamBas: '16:30' },
    { sabahBas: { x: 1 }, sabahBit: [1], aksamBas: null, aksamBit: true }
  ].map(b => iste('/api/servis/saatler', 'POST', b, M)));
  kontrol('bozuk saat, ters aralık, 30 dakikadan kısa, çakışan ve eksik aralık reddediliyor', kotuSaat.every(r => r.status === 400),
    kotuSaat.map(r => r.status).join(' '));
  const yetkisiz = await Promise.all([mat.token, o1.token, S1.token, V].map(t => iste('/api/servis/saatler', 'POST',
    { sabahBas: '07:00', sabahBit: '09:20', aksamBas: '16:30', aksamBit: '19:00' }, t)));
  kontrol('öğretmen, öğrenci, servisçi, veli servis saatlerini değiştiremiyor', yetkisiz.every(r => r.status === 403), yetkisiz.map(r => r.status).join(' '));
  const kisa = await iste('/api/servis/saatler', 'POST', { sabahBas: '7:00', sabahBit: '9:20', aksamBas: '16:30', aksamBit: '19:00' }, M);
  kontrol('7:00 biçimi 07:00 olarak kaydediliyor; sabah bitişi akşam başı olabilir', kisa.status === 200 && kisa.body.saatler.sabahBas === '07:00' &&
    (await iste('/api/servis/saatler', 'POST', { sabahBas: '07:00', sabahBit: '12:00', aksamBas: '12:00', aksamBit: '19:00' }, M)).status === 200, J(kisa.body));
  const ik = await iste('/api/islem-kaydi', 'GET', null, M);
  kontrol('işlem kaydında servis.saatler var', J(ik.body).indexOf('servis.saatler') >= 0);
  await genis();

  console.log('=== 2) ARALIK DIŞI ===');
  let m = trDk();
  await saatYaz(disAraligi(m));
  const d1 = await yoklama(S1.token);
  kontrol('yoklama aralık dışında kapalı; neden ve sonraki aralık geliyor', d1.status === 200 && d1.body.donem === null && d1.body.acik === false &&
    /arasında açılır/.test(d1.body.engel) && !!d1.body.sonraki && d1.body.ogrenciler.length === 3 && d1.body.servis.id === svA, J(d1.body));
  const d2 = await isaret(S1.token, me1.id, 'bindi');
  const d3 = await iste('/api/servis/sefer-basla', 'POST', { servisId: svA }, S1.token);
  const d4 = await iste('/api/servis/okula-vardik', 'POST', { servisId: svA }, S1.token);
  kontrol('aralık dışında işaret, sefer ve "Okula vardık" 409 (aralikDisi)', d2.status === 409 && d2.body.aralikDisi === true &&
    d3.status === 409 && d3.body.aralikDisi === true && d4.status === 409, d2.status + ' ' + d3.status + ' ' + d4.status);
  const dh = await harita(V, me1.id);
  kontrol('harita aralık dışında sefer ve canlı bilgi döndürmüyor', dh.status === 200 && dh.body.sefer === null && dh.body.bugun &&
    dh.body.bugun.canli === false && dh.body.bugun.durum === null && dh.body.bugun.sira === null, J(dh.body.bugun));
  const dv = await iste('/api/servis', 'GET', null, V);
  const dvc = (dv.body.cocuklar || [])[0];
  kontrol('veli servis kartını aralık dışında da görüyor (canlı bilgi yok)', !!dvc && !!dvc.servis && dvc.servis.plaka === '06 YK 01' &&
    dvc.bugun && dvc.bugun.canli === false && dvc.bugun.binmeyecekDuzenleyebilir === true, J(dvc));
  await genis();

  console.log('=== 3) SIRA ===');
  const sira = (tok, donem, liste, servisId) => iste('/api/servis/sira', 'POST', { servisId: servisId || svA, donem, sira: liste }, tok);
  const sr = await sira(S1.token, 'sabah', [o3h.id, me1.id, me2.id]);
  const sr2 = await sira(S1.token, 'aksam', [me2.id, me1.id, o3h.id]);
  kontrol('servisçi sabah ve akşam sırasını kaydetti', sr.status === 200 && sr2.status === 200, J(sr.body) + J(sr2.body));
  const srK = await Promise.all([
    sira(S1.token, 'sabah', [me1.id, me2.id]), sira(S1.token, 'sabah', [me1.id, me2.id, o3h.id, o4h.id]),
    sira(S1.token, 'sabah', [me1.id, me1.id, me2.id]), sira(S1.token, 'gece', [o3h.id, me1.id, me2.id]),
    iste('/api/servis/sira', 'POST', { servisId: svA, donem: 'sabah', sira: 'x' }, S1.token)]);
  kontrol('eksik, fazla, tekrarlı liste ve bilinmeyen dönem 400', srK.every(r => r.status === 400), srK.map(r => r.status).join(' '));
  const srY = await Promise.all([S2.token, S3.token, M, V, o1.token].map(t => sira(t, 'sabah', [o3h.id, me1.id, me2.id])));
  kontrol('başka servisçi, başka okul, müdür, veli, öğrenci sırayı değiştiremiyor', srY.every(r => r.status === 403), srY.map(r => r.status).join(' '));
  const yon = (await iste('/api/servis', 'GET', null, M)).body.servisler.find(s => s.id === svA);
  const siraOf = id => yon.ogrenciler.find(o => o.id === id);
  kontrol('sıra kaydedildi (sabah Can 1, Zeynep 2, Burak 3; akşam Burak 1)', siraOf(o3h.id).siraSabah === 1 && siraOf(me1.id).siraSabah === 2 &&
    siraOf(me2.id).siraSabah === 3 && siraOf(me2.id).siraAksam === 1 && siraOf(o3h.id).siraAksam === 3, J(yon.ogrenciler));
  await iste('/api/servis/ogrenci', 'POST', { servisId: svA, ogrenciId: o4h.id }, M);
  let yon2 = (await iste('/api/servis', 'GET', null, M)).body.servisler.find(s => s.id === svA);
  const o4A = yon2.ogrenciler.find(o => o.id === o4h.id);
  await iste('/api/servis/ogrenci', 'POST', { servisId: svA, ogrenciId: o4h.id, durak: 'Yeni durak' }, M);
  yon2 = (await iste('/api/servis', 'GET', null, M)).body.servisler.find(s => s.id === svA);
  const o4A2 = yon2.ogrenciler.find(o => o.id === o4h.id);
  await iste('/api/servis/ogrenci', 'POST', { servisId: svB, ogrenciId: o4h.id }, M);
  const o4B = (await iste('/api/servis', 'GET', null, M)).body.servisler.find(s => s.id === svB).ogrenciler.find(o => o.id === o4h.id);
  kontrol('yeni öğrenci sıranın sonuna eklendi; durak değişince sıra korundu; taşınınca yeni serviste sona', o4A && o4A.siraSabah === 4 &&
    o4A.siraAksam === 4 && o4A2.siraSabah === 4 && o4B && o4B.siraSabah === 1, J([o4A, o4A2, o4B]));

  console.log('=== 4) SABAH YOKLAMASI ===');
  m = trDk();
  const sabah = sabahAraligi(m);
  if (!sabah) atla('sabah yoklaması (gece yarısına çok yakın)');
  else {
    await saatYaz(sabah);
    const bin2 = await iste('/api/servis/binmeyecek', 'POST', { ogrenciId: me2.id, tarih: trGun(0), sabah: true, aksam: false, not: 'Hasta' }, V2);
    const s1bil = await bildirimler(S1.token);
    kontrol('veli bugün sabah için "binmeyecek" dedi; servisçiye haber gitti', bin2.status === 200 &&
      s1bil.some(t => /^Burak Öztürk bugün sabah servise binmeyecek\. Velinin notu: Hasta\.$/.test(t)), J(bin2.body) + J(s1bil.slice(0, 2)));
    const y1 = await yoklama(S1.token);
    const ad = y1.body.ogrenciler.map(o => o.id);
    kontrol('sabah yoklaması açık, sabah sırasıyla geliyor', y1.body.donem === 'sabah' && y1.body.acik === true && y1.body.duzenleyebilir === true &&
      J(ad) === J([o3h.id, me1.id, me2.id]) && y1.body.ogrenciler[0].sira === 1, J(y1.body).slice(0, 200));
    const burak = y1.body.ogrenciler.find(o => o.id === me2.id);
    kontrol('velinin işareti listede (binmeyecek, not)', burak.binmeyecek === true && burak.veliIsareti && burak.veliIsareti.not === 'Hasta' &&
      y1.body.sayilar.binmeyecek === 1 && y1.body.sayilar.bekleyen === 2, J(burak) + J(y1.body.sayilar));
    let h = await harita(V, me1.id);
    kontrol('veli: Zeynep 2. sırada, önünde 1 öğrenci; sefer yok', h.body.bugun.canli === true && h.body.bugun.donem === 'sabah' &&
      h.body.bugun.sira === 2 && h.body.bugun.onunde === 1 && h.body.sefer === null, J(h.body.bugun));
    const hB = await harita(V2, me2.id);
    kontrol('binmeyecek öğrencide "önünde" yok', hB.body.bugun.onunde === null && hB.body.bugun.binmeyecekBugun === true, J(hB.body.bugun));
    const vOnce = await bildirimler(V), oOnce = await bildirimler(o1.token);
    const i1 = await isaret(S1.token, o3h.id, 'bindi', { donem: 'sabah' });
    kontrol('ilk "Bindi" seferi kendiliğinden başlattı', i1.status === 200 && !!i1.body.sefer && i1.body.sefer.yon === 'gidis' &&
      !!i1.body.yoklama.sefer && !!i1.body.yoklama.gun.basladi, J(i1.body).slice(0, 220));
    h = await harita(V, me1.id);
    kontrol('önündeki bindi: önünde 0; haritada sefer var', h.body.bugun.onunde === 0 && !!h.body.sefer && h.body.sefer.donem === 'sabah', J(h.body.bugun));
    const i2 = await isaret(S1.token, me1.id, 'bindi');
    let vb = await bildirimler(V);
    const bindiMetni = vb.find(t => /^Zeynep \d\d:\d\d'(de|da|te|ta) servise bindi\.$/.test(t));
    kontrol('veliye "Zeynep HH:MM\'de servise bindi." gitti', i2.status === 200 && !!bindiMetni && vb.length === vOnce.length + 1, J(vb.slice(0, 2)));
    kontrol('bildirim öğrenciye gitmedi', (await bildirimler(o1.token)).length === oOnce.length);
    await isaret(S1.token, me1.id, 'bindi');
    kontrol('aynı işaret ikinci kez bildirim göndermiyor', (await bildirimler(V)).length === vOnce.length + 1);
    h = await harita(V, me1.id);
    kontrol('veli bugünkü durumu görüyor (Bindi HH:MM)', h.body.bugun.durum === 'bindi' && /^\d\d:\d\d$/.test(h.body.bugun.bindiSaat) &&
      h.body.bugun.onunde === null, J(h.body.bugun));
    await isaret(S1.token, me1.id, 'binmedi');
    await isaret(S1.token, me1.id, 'bindi');
    await isaret(S1.token, me1.id, 'binmedi');
    vb = await bildirimler(V);
    kontrol('bindi -> binmedi: düzeltme bir kez gitti; ikinci "bindi" gitmedi', say(vb, /^Düzeltme: Zeynep bu sabah servise binmedi\.$/) === 1 &&
      say(vb, /servise bindi\./) === 1 && vb.length === vOnce.length + 2, J(vb.slice(0, 4)));
    await isaret(S1.token, me1.id, 'bindi');
    const v2Once = (await bildirimler(V2)).length;
    const i3 = await isaret(S1.token, me2.id, 'binmedi');
    kontrol('velisi "binmeyecek" dediyse binmedi bildirimi gitmiyor', i3.status === 200 && (await bildirimler(V2)).length === v2Once, J(i3.body.message));
    const kilit = await iste('/api/servis/binmeyecek', 'POST', { ogrenciId: me2.id, tarih: trGun(0), sabah: false, aksam: false }, V2);
    kontrol('yoklama alınınca o dönemin işareti değiştirilemiyor', kilit.status === 409, J(kilit.body));
    const yY = await Promise.all([isaret(S2.token, me1.id, 'bindi'), isaret(S3.token, me1.id, 'bindi'), isaret(M, me1.id, 'bindi'),
      isaret(V, me1.id, 'bindi'), isaret(o1.token, me1.id, 'bindi')]);
    kontrol('başka servisçi, başka okul, müdür, veli, öğrenci işaretleyemiyor', yY.every(r => r.status === 403), yY.map(r => r.status).join(' '));
    const yK = await Promise.all([isaret(S1.token, me1.id, 'geldi'), isaret(S1.token, me1.id, 'bindi', { donem: 'aksam' }),
      isaret(S1.token, o4h.id, 'bindi'), isaret(S1.token, 'yok', 'bindi'), isaret(S1.token, me1.id, { $ne: 1 })]);
    kontrol('sabahta "geldi" 400, dönem uyuşmazlığı 409, servisin öğrencisi olmayan 404, bozuk durum 400',
      yK[0].status === 400 && yK[1].status === 409 && yK[1].body.donemDegisti === true && yK[2].status === 404 && yK[3].status === 404 &&
      yK[4].status === 400, yK.map(r => r.status).join(' '));
    const vOnceV = (await bildirimler(V)).length;
    const vr = await iste('/api/servis/okula-vardik', 'POST', { servisId: svA }, S1.token);
    vb = await bildirimler(V);
    kontrol('"Okula vardık": sefer bitti, veliye "Zeynep HH:MM\'de okula vardı." gitti', vr.status === 200 && vr.body.bildirilen === 1 &&
      vr.body.yoklama.sefer === null && !!vr.body.yoklama.gun.bitti && say(vb, /^Zeynep \d\d:\d\d'(de|da|te|ta) okula vardı\.$/) === 1 &&
      vb.length === vOnceV + 1, J(vr.body.message) + J(vb.slice(0, 2)));
    const vr2 = await iste('/api/servis/okula-vardik', 'POST', { servisId: svA }, S1.token);
    kontrol('ikinci "Okula vardık" tekrar bildirim göndermiyor', vr2.status === 200 && (await bildirimler(V)).length === vOnceV + 1, J(vr2.body.message));
    const kap = await isaret(S1.token, o3h.id, 'binmedi');
    const kapS = await iste('/api/servis/sefer-basla', 'POST', { servisId: svA }, S1.token);
    kontrol('okula varınca sabah yoklaması ve seferi kapandı', kap.status === 409 && kap.body.kapandi === true && kapS.status === 409, kap.status + ' ' + kapS.status);
    h = await harita(V, me1.id);
    kontrol('veli "Okula vardı HH:MM" görüyor', h.body.bugun.durum === 'bindi' && /^\d\d:\d\d$/.test(h.body.bugun.vardiSaat) &&
      h.body.bugun.seferBitti === true, J(h.body.bugun));
    const yon3 = await yoklama(M, svA);
    const yonB = await yoklama(M2, svA);
    const yonT = await Promise.all([mat.token, V, o1.token].map(t => yoklama(t, svA)));
    kontrol('müdür bugünkü yoklamayı salt okunur görüyor', yon3.status === 200 && yon3.body.duzenleyebilir === false && yon3.body.acik === false &&
      yon3.body.ogrenciler.find(o => o.id === me1.id).durum === 'bindi', J(yon3.body).slice(0, 160));
    kontrol('başka okul 404; yetkisiz öğretmen, veli, öğrenci 403', yonB.status === 404 && yonT.every(r => r.status === 403),
      yonB.status + ' ' + yonT.map(r => r.status).join(' '));
    const s2y = await yoklama(S2.token, svA);
    kontrol('servisçi başkasının servisinin yoklamasını açamıyor', s2y.status === 404, String(s2y.status));
    await genis();
  }

  console.log('=== 5) AKŞAM YOKLAMASI ===');
  m = trDk();
  const aksam = aksamAraligi(m);
  if (!aksam) atla('akşam yoklaması (gece yarısına çok yakın)');
  else {
    await saatYaz(aksam);
    const y1 = await yoklama(S1.token);
    kontrol('akşam yoklaması akşam sırasıyla geliyor', y1.body.donem === 'aksam' && y1.body.acik === true &&
      J(y1.body.ogrenciler.map(o => o.id)) === J([me2.id, me1.id, o3h.id]), J(y1.body.ogrenciler.map(o => o.ad)));
    const erken = await isaret(S1.token, me1.id, 'indi');
    kontrol('"Başlat"tan önce "İndi" işaretlenmiyor', erken.status === 409 && erken.body.baslamadi === true, J(erken.body));
    const vOnce = (await bildirimler(V)).length, v2Once = (await bildirimler(V2)).length;
    await isaret(S1.token, me1.id, 'geldi');
    await isaret(S1.token, me2.id, 'gelmedi');
    await isaret(S1.token, o3h.id, 'geldi');
    let vb = await bildirimler(V), v2b = await bildirimler(V2);
    kontrol('veliye "Zeynep HH:MM\'de okuldan servise bindi." gitti', say(vb, /^Zeynep \d\d:\d\d'(de|da|te|ta) okuldan servise bindi\.$/) === 1 &&
      vb.length === vOnce + 1, J(vb.slice(0, 2)));
    kontrol('Burak\'ın velisine "akşam servise gelmedi" gitti (akşam için binmeyecek demedi)',
      say(v2b, /^Burak akşam servise gelmedi\.$/) === 1 && v2b.length === v2Once + 1, J(v2b.slice(0, 2)));
    await isaret(S1.token, me2.id, 'geldi');
    await isaret(S1.token, me2.id, 'gelmedi');
    v2b = await bildirimler(V2);
    kontrol('akşam geldi -> gelmedi düzeltmesi bir kez', say(v2b, /^Burak \d\d:\d\d'(de|da|te|ta) okuldan servise bindi\.$/) === 1 &&
      say(v2b, /^Düzeltme: Burak akşam servise gelmedi\.$/) === 1 && v2b.length === v2Once + 3, J(v2b.slice(0, 4)));
    const inmez = await isaret(S1.token, me2.id, 'indi');
    kontrol('"Geldi" olmayan öğrenciye "İndi" işaretlenmiyor', inmez.status === 409, J(inmez.body));
    let h1 = await harita(V, me1.id), h3 = await harita(o3.token);
    kontrol('akşam: Zeynep önünde 0 (Burak gelmedi), Can önünde 1', h1.body.bugun.donem === 'aksam' && h1.body.bugun.onunde === 0 &&
      h1.body.bugun.durum === 'geldi' && h3.body.bugun.onunde === 1, J(h1.body.bugun) + J(h3.body.bugun));
    /* Yaklaşma: akşam yalnız "Geldi" işaretliler (Can), gelmeyen (Burak) almaz. */
    const EV = { enlem: 39.95, boylam: 32.85 };
    await iste('/api/servis/ev', 'POST', Object.assign({ ogrenciId: me2.id }, EV), M);
    await iste('/api/servis/ev', 'POST', Object.assign({ ogrenciId: o3h.id }, EV), M);
    const bas = await iste('/api/servis/sefer-basla', 'POST', { servisId: svA, yon: 'gidis' }, S1.token);
    kontrol('akşam "Başlat": dönüş seferi başladı, bekleyen 0, serviste 2', bas.status === 200 && bas.body.sefer.yon === 'donus' && bas.body.donem === 'aksam' &&
      bas.body.bekleyen === 0 && bas.body.serviste === 2, J(bas.body));
    const bas2 = await iste('/api/servis/sefer-basla', 'POST', { servisId: svA }, S1.token);
    kontrol('ikinci "Başlat" aynı seferi döndürüyor', bas2.status === 200 && bas2.body.sefer.id === bas.body.sefer.id, J(bas2.body));
    const o3Once = (await bildirimler(o3.token)).length, o2Once = (await bildirimler(o2.token)).length;
    await iste('/api/servis/konum', 'POST', { seferId: bas.body.sefer.id, enlem: EV.enlem + 300 / 111195, boylam: EV.boylam, dogruluk: 10 }, S1.token);
    kontrol('yaklaşma bildirimi yalnız servisteki ("Geldi") öğrenciye gitti', (await bildirimler(o3.token)).length === o3Once + 1 &&
      (await bildirimler(o2.token)).length === o2Once);
    const i1 = await isaret(S1.token, me1.id, 'indi');
    vb = await bildirimler(V);
    kontrol('veliye "Zeynep HH:MM\'de eve bırakıldı." gitti; sefer sürüyor', i1.status === 200 && i1.body.bitti === false &&
      say(vb, /^Zeynep \d\d:\d\d'(de|da|te|ta) eve bırakıldı\.$/) === 1, J(i1.body.message) + J(vb.slice(0, 2)));
    h1 = await harita(V, me1.id);
    h3 = await harita(o3.token);
    kontrol('veli "Eve bırakıldı HH:MM" görüyor; Can\'ın önünde 0', h1.body.bugun.durum === 'indi' && /^\d\d:\d\d$/.test(h1.body.bugun.indiSaat) &&
      h3.body.bugun.onunde === 0, J(h1.body.bugun) + J(h3.body.bugun));
    const geri = await isaret(S1.token, me1.id, 'gelmedi');
    kontrol('eve bırakılan öğrencinin işareti değiştirilemiyor', geri.status === 409, J(geri.body));
    const i2 = await isaret(S1.token, o3h.id, 'indi');
    kontrol('son öğrenci inince sefer kendiliğinden bitti', i2.status === 200 && i2.body.bitti === true && i2.body.yoklama.sefer === null &&
      !!i2.body.yoklama.gun.bitti, J(i2.body).slice(0, 200));
    const son = await isaret(S1.token, me2.id, 'geldi');
    kontrol('sefer bitince akşam yoklaması kapandı', son.status === 409 && son.body.kapandi === true, J(son.body));
    kontrol('"Okula vardık" akşam işaretlenmiyor', (await iste('/api/servis/okula-vardik', 'POST', { servisId: svA }, S1.token)).status === 409);
    await genis();
  }

  console.log('=== 6) NOTLAR ===');
  const not = b => iste('/api/servis/not', 'POST', Object.assign({ servisId: svA }, b), S1.token);
  const vOnceN = (await bildirimler(V)).length, v2OnceN = (await bildirimler(V2)).length, o1OnceN = (await bildirimler(o1.token)).length;
  const n1 = await not({ ogrenciId: me1.id, tarih: trGun(1), metin: 'Yarın 07:35\'te hazır ol' });
  let vb = await bildirimler(V);
  kontrol('servisçi öğrenciye not yazdı; velisine "Servisçiden not: ..." gitti, öğrenciye gitmedi', n1.status === 200 && n1.body.not.tarih === trGun(1) &&
    vb.length === vOnceN + 1 && vb[0] === 'Servisçiden not: Yarın 07:35\'te hazır ol' && (await bildirimler(o1.token)).length === o1OnceN,
  J(n1.body) + J(vb.slice(0, 1)));
  const n2 = await not({ metin: 'Bugün 16:00\'da erken alacağım' });
  kontrol('bütün servise not: iki veliye de gitti', n2.status === 200 && n2.body.not.genel === true &&
    (await bildirimler(V)).length === vOnceN + 2 && (await bildirimler(V2)).length === v2OnceN + 1, J(n2.body));
  const nK = await Promise.all([not({ metin: '' }), not({ metin: 'x', tarih: trGun(-1) }), not({ metin: 'x', tarih: trGun(8) }),
    not({ metin: 'x', tarih: '2026-13-45' }), not({ metin: 'x', ogrenciId: o4h.id }), not({ metin: { a: 1 } })]);
  kontrol('boş not, geçmiş ya da 7 günden ileri tarih, bozuk tarih 400; başka servisin öğrencisi 404',
    nK[0].status === 400 && nK[1].status === 400 && nK[2].status === 400 && nK[3].status === 400 && nK[4].status === 404 && nK[5].status === 400,
    nK.map(r => r.status).join(' '));
  const uzun = await not({ metin: 'a'.repeat(260) });
  kontrol('200 harften uzun not kısaltılıyor', uzun.status === 200 && uzun.body.not.metin.length === 200, String(uzun.body.not && uzun.body.not.metin.length));
  const nY = await Promise.all([S2.token, S3.token, M, V, o1.token].map(t => iste('/api/servis/not', 'POST', { servisId: svA, metin: 'x' }, t)));
  kontrol('başka servisçi, başka okul, müdür, veli, öğrenci not yazamıyor', nY.every(r => r.status === 403), nY.map(r => r.status).join(' '));
  const vs = await iste('/api/servis', 'GET', null, V);
  const vNot = vs.body.cocuklar[0].bugun.notlar;
  const v2s = await iste('/api/servis', 'GET', null, V2);
  const v2Not = v2s.body.cocuklar[0].bugun.notlar;
  kontrol('veli çocuğunun ve servisin notlarını görüyor; başka çocuğun notunu görmüyor', vNot.some(n => /07:35/.test(n.metin)) &&
    vNot.some(n => n.genel) && v2Not.some(n => n.genel) && !v2Not.some(n => /07:35/.test(n.metin)), J(vNot) + J(v2Not));
  const oN = await iste('/api/servis', 'GET', null, o1.token);
  kontrol('öğrenci notları görüyor', oN.body.benim.bugun.notlar.some(n => /07:35/.test(n.metin)), J(oN.body.benim.bugun));
  const sy = await yoklama(S1.token);
  kontrol('servisçinin yoklama ekranında notlar', sy.body.notlar.length === 3, J(sy.body.notlar));
  const sil1 = await iste('/api/servis/not-sil', 'POST', { id: uzun.body.not.id }, S2.token);
  const sil2 = await iste('/api/servis/not-sil', 'POST', { id: uzun.body.not.id }, S1.token);
  kontrol('notu başka servisçi silemiyor, yazan siliyor', sil1.status === 404 && sil2.status === 200 &&
    (await yoklama(S1.token)).body.notlar.length === 2, sil1.status + ' ' + sil2.status);

  console.log('=== 7) BİNMEYECEK ===');
  const bm = (tok, b) => iste('/api/servis/binmeyecek', 'POST', b, tok);
  const s1Once = (await bildirimler(S1.token)).length;
  const b1 = await bm(V, { ogrenciId: me1.id, tarih: trGun(1), sabah: true, aksam: false, not: 'Dişçi' });
  let s1b = await bildirimler(S1.token);
  kontrol('veli yarın sabah için "binmeyecek" dedi; servisçiye haber gitti', b1.status === 200 && b1.body.binmeyecek.sabah === true &&
    s1b.length === s1Once + 1 && /^Zeynep Şahin yarın sabah servise binmeyecek\. Velinin notu: Dişçi\.$/.test(s1b[0]), J(b1.body) + J(s1b[0]));
  const bY = await Promise.all([bm(V, { ogrenciId: me2.id, tarih: trGun(1), sabah: true }), bm(o1.token, { ogrenciId: me1.id, tarih: trGun(1), sabah: true }),
    bm(M, { ogrenciId: me1.id, tarih: trGun(1), sabah: true }), bm(S1.token, { ogrenciId: me1.id, tarih: trGun(1), sabah: true })]);
  kontrol('veli başka çocuğa, öğrenci, müdür, servisçi işaretleyemiyor', bY.every(r => r.status === 403), bY.map(r => r.status).join(' '));
  const bK = await Promise.all([bm(V, { ogrenciId: me1.id, tarih: trGun(8), sabah: true }), bm(V, { ogrenciId: me1.id, tarih: trGun(-1), sabah: true }),
    bm(V, { ogrenciId: me1.id, tarih: 'dün', sabah: true })]);
  kontrol('7 günden ileri, geçmiş ve bozuk tarih 400', bK.every(r => r.status === 400), bK.map(r => r.status).join(' '));
  const bKal = await bm(V, { ogrenciId: me1.id, tarih: trGun(1), sabah: false, aksam: false });
  s1b = await bildirimler(S1.token);
  kontrol('işaret kaldırıldı; servisçiye haber gitti', bKal.status === 200 && bKal.body.binmeyecek === null &&
    /işareti kaldırıldı/.test(s1b[0]), J(bKal.body) + J(s1b[0]));
  await bm(V, { ogrenciId: me1.id, tarih: trGun(2), sabah: true, aksam: true });
  const vs2 = await iste('/api/servis', 'GET', null, V);
  const os2 = await iste('/api/servis', 'GET', null, o1.token);
  kontrol('veli ve öğrenci işareti görüyor (öğrenci düzenleyemez)', vs2.body.cocuklar[0].bugun.binmeyecek.some(b => b.tarih === trGun(2) && b.sabah && b.aksam) &&
    os2.body.benim.bugun.binmeyecek.length === 1 && !os2.body.benim.bugun.binmeyecekDuzenleyebilir, J(os2.body.benim.bugun.binmeyecek));
  const sy2 = await yoklama(S1.token);
  kontrol('servisçi önümüzdeki günlerin işaretlerini görüyor', sy2.body.binmeyecekler.some(b => b.ogrenciId === me1.id && b.tarih === trGun(2)),
    J(sy2.body.binmeyecekler));

  console.log('=== 8) UZATMA VE ARALIK BİTİNCE ===');
  /* Servis B (S2, Ece): şu anki dönemde sefer açılır, sonra aralık kaydırılır. */
  const cK1 = (await cihaz('', 'POST', { ad: 'Servis telefonu', platform: 'android', surum: '2.0' }, undefined, S2.token)).body.cihazAnahtari;
  const cKV = (await cihaz('', 'POST', { ad: 'Veli telefonu' }, undefined, V)).body.cihazAnahtari;
  const cKS1 = (await cihaz('', 'POST', { ad: 'Birinci servis' }, undefined, S1.token)).body.cihazAnahtari;
  m = trDk();
  const d0 = m < 720 ? 'sabah' : 'aksam';
  const uz = d0 === 'sabah' ? (m >= 100 ? [[m - 40, m - 10, m + 30, m + 60], [m - 100, m - 70, m + 30, m + 60]] : null)
    : [[m - 110, m - 80, m - 40, m - 10], [m - 170, m - 140, m - 100, m - 70]];
  const sb = await iste('/api/servis/sefer-basla', 'POST', { servisId: svB }, S2.token);
  const sfB = sb.body.sefer && sb.body.sefer.id;
  const konumB = (anahtar, ek) => cihaz('/servis-konum', 'POST', Object.assign({ seferId: sfB, enlem: 39.93, boylam: 32.86, dogruluk: 12 }, ek || {}), anahtar);
  const kc = await konumB(cK1);
  const hB1 = await harita(M, o4h.id);
  kontrol('uygulama anahtarıyla sefer konumu gönderildi; haritada görünüyor', sb.status === 200 && kc.status === 200 && !!hB1.body.sefer &&
    !!hB1.body.sefer.konum, J(kc.body) + J(hB1.body.sefer));
  const ay = await cihaz('/ayar', 'GET', null, cK1);
  kontrol('cihaz ayarı: servisçi, açık sefer, servis saatleri', ay.status === 200 && ay.body.rol === 'servisci' && ay.body.servisci === true &&
    ay.body.acikSefer && ay.body.acikSefer.id === sfB && ay.body.servisSaatleri && ay.body.servisSaatleri.sabahBas === '00:00', J(ay.body));
  const kcV = await konumB(cKV), kcS1 = await konumB(cKS1), kcY = await konumB(cK1, { seferId: 'yok' }), kcB = await konumB(cK1, { enlem: 'x' });
  kontrol('veli anahtarı 403, başkasının seferi 409, sefer yok 404, bozuk konum 400', kcV.status === 403 && kcS1.status === 409 &&
    kcY.status === 404 && kcB.status === 400, [kcV.status, kcS1.status, kcY.status, kcB.status].join(' '));
  /* Sefer yalnız aralığında başladıysa sürer: aralığı geçmişe kaydırmadan önce
     seferin ve günün "başladı" anı test veritabanında geriye çekilir. */
  const depo = testDeposu();
  const geriCek = async dakika => {
    await depo.okulHayati.seferiGeriTarihle(sfB, dakika);
    await depo.servisYoklama.gunuGeriTarihle(svB, trGun(0), d0, dakika);
  };
  if (!uz || !depo || !sfB) atla('uzatma (sabahın ilk 100 dakikası ya da test veritabanına bağlanılamadı)');
  else {
    await geriCek(25);   // sefer m-25'te başlamış: [m-40, m-10] aralığında
    await saatYaz(uz[0]);
    const hU = await harita(M, o4h.id);
    const yU = await yoklama(S2.token);
    const kU = await konumB(cK1);
    const bU = await iste('/api/servis/sefer-basla', 'POST', { servisId: svB }, S2.token);
    kontrol('aralık biteli 10 dakika: sefer sürüyor (harita, konum), yoklama uzatmada açık', !!hU.body.sefer && kU.status === 200 &&
      yU.body.donem === d0 && yU.body.uzatma === true && yU.body.acik === true, J(hU.body.sefer) + J(yU.body).slice(0, 160));
    const iU = await iste('/api/servis/yoklama', 'POST', { servisId: svB, ogrenciId: o4h.id, durum: d0 === 'sabah' ? 'bindi' : 'geldi' }, S2.token);
    kontrol('uzatmada işaret alınıyor; yeni sefer başlamıyor', iU.status === 200 && bU.status === 409 && bU.body.aralikDisi === true,
      iU.status + ' ' + bU.status);
    await geriCek(60);   // sefer m-85'te başlamış: [m-100, m-70] aralığında, uzatması m-9'da bitti
    await saatYaz(uz[1]);
    const hD = await harita(M, o4h.id);
    const kD = await konumB(cK1);
    const iD = await iste('/api/servis/yoklama', 'POST', { servisId: svB, ogrenciId: o4h.id, durum: d0 === 'sabah' ? 'binmedi' : 'gelmedi' }, S2.token);
    const sfD = await iste('/api/servis/seferim', 'GET', null, S2.token);
    kontrol('aralık biteli 70 dakika: sefer kapandı, haritada yok, konum 409, işaret 409', hD.body.sefer === null && hD.body.bugun.canli === false &&
      kD.status === 409 && iD.status === 409 && sfD.body.servisler[0].sefer === null, J(hD.body.sefer) + ' ' + kD.status + ' ' + iD.status);
    kontrol('cihaz ayarında açık sefer yok', (await cihaz('/ayar', 'GET', null, cK1)).body.acikSefer === null);
  }
  await genis();

  /* Müdür saatleri ileri alırsa (açık sefer yeni aralıktan önce başlamış) sefer
     kapanır: harita sefer ve konum göstermez, konum 409, telefonun ayarında sefer yok. */
  const sbI = await iste('/api/servis/sefer-basla', 'POST', { servisId: svB }, S2.token);
  const sfI = sbI.body.sefer && sbI.body.sefer.id;
  const kI0 = await konumB(cK1, { seferId: sfI });
  m = trDk();
  const ileri = m < 720 ? [m + 20, m + 60, m + 60, m + 120] : (m + 60 <= 1439 ? [0, 30, m + 20, m + 60] : null);
  if (!ileri || !sfI) atla('saatler ileri alınınca sefer (gece yarısına çok yakın)');
  else {
    await saatYaz(ileri);
    const hI = await harita(M, o4h.id);
    const kI = await konumB(cK1, { seferId: sfI });
    const aI = await cihaz('/ayar', 'GET', null, cK1);
    const yI = await yoklama(S2.token);
    kontrol('saatler ileri alınınca açık sefer kapandı: harita sefer ve konum yok, konum 409, cihaz ayarında sefer yok',
      kI0.status === 200 && hI.body.sefer === null && hI.body.bugun.canli === false && kI.status === 409 && aI.body.acikSefer === null &&
      yI.body.sefer === null, [kI0.status, J(hI.body.sefer), kI.status, J(aI.body.acikSefer), J(yI.body.sefer)].join(' '));
    await genis();
  }

  console.log('=== 8b) AYNI ANDA GELEN İŞARETLER VE AKŞAM KENARLARI ===');
  /* Ayrı servis (R) ve servisçi (S5): üç yeni öğrenci; Deniz'in velisi VR. */
  const s5K = sK('yok5');
  await okulHesabi(M, 'servisci', { fullName: 'Yarış Sürücü', username: s5K, password: 'Test1234!' });
  const S5 = await girisYap(s5K, 'Test1234!');
  const svR = (await iste('/api/servis/kaydet', 'POST', { ad: 'Yoklama R ' + z, soforId: S5.user.id }, M)).body.id;
  const yaris = [];
  for (const ad of ['Deniz Yarış', 'Ada Yarış', 'Mert Yarış']) {
    yaris.push(await okulHesabi(M, 'student', { fullName: ad, username: 'yaris' + yaris.length + z, password: 'Test1234!' }));
  }
  for (const o of yaris) await iste('/api/servis/ogrenci', 'POST', { servisId: svR, ogrenciId: o.id }, M);
  const vrK = 'yveli3' + z;
  await hesapAc({ fullName: 'Yarış Veli', username: vrK, email: vrK + '@test.com' });
  let VR = (await girisYap(vrK, 'Test1234!')).token;
  await iste('/api/parent/link', 'POST', { code: yaris[0].code }, VR);
  VR = (await girisYap(vrK, 'Test1234!')).token;
  const isaretR = (o, durum) => iste('/api/servis/yoklama', 'POST', { servisId: svR, ogrenciId: o.id, durum }, S5.token);
  const basR = () => iste('/api/servis/sefer-basla', 'POST', { servisId: svR }, S5.token);
  const seferId = r => (r.body && r.body.sefer && r.body.sefer.id) || '';
  m = trDk();
  const sabahR = sabahAraligi(m);
  if (!sabahR) atla('aynı anda ilk "Bindi" (gece yarısına çok yakın)');
  else {
    await saatYaz(sabahR);
    const vrOnce = (await bildirimler(VR)).length;
    const yr = await Promise.all(yaris.map(o => isaretR(o, 'bindi')));
    const acilan = [...new Set(yr.map(seferId).filter(Boolean))];
    const yR = await yoklama(S5.token);
    kontrol('aynı anda üç ilk "Bindi": hepsi kaydedildi, tek sefer açıldı ve sürüyor', yr.every(r => r.status === 200) && acilan.length === 1 &&
      !!yR.body.sefer && yR.body.sefer.id === acilan[0] && yR.body.sayilar.bindi === 3,
    yr.map(r => r.status + ':' + (seferId(r) || r.body.error)).join(' | ') + ' ' + J(yR.body.sefer));
    let vrb = await bildirimler(VR);
    kontrol('yarışta da Deniz\'in velisine "servise bindi" bir kez gitti', say(vrb, /^Deniz \d\d:\d\d'(de|da|te|ta) servise bindi\.$/) === 1 &&
      vrb.length === vrOnce + 1, J(vrb.slice(0, 2)));
    const tekrar = await isaretR(yaris[0], 'bindi');
    vrb = await bildirimler(VR);
    kontrol('aynı işaret yeniden gönderilince bildirim tekrar gitmiyor', tekrar.status === 200 && vrb.length === vrOnce + 1, J(vrb.slice(0, 2)));
    /* Aralık sonradan geçmişe kaydırılırsa (sefer ve "başladı" anı yeni aralığın
       dışında kalır) uzatma yoktur: harita sefer göstermez, işaret alınmaz. */
    const gecmis = m >= 40 && m + 60 <= 1439 ? [m - 40, m - 10, m + 30, m + 60] : null;
    if (!gecmis) atla('aralık dışında başlamış seferde uzatma');
    else {
      await saatYaz(gecmis);
      const hG = await harita(VR, yaris[0].id);
      const iG = await isaretR(yaris[1], 'binmedi');
      const yG = await yoklama(S5.token);
      kontrol('aralık dışında başlamış seferde uzatma yok: harita sefer göstermiyor, işaret 409', hG.body.sefer === null && hG.body.bugun.canli === false &&
        iG.status === 409 && yG.body.acik === false && yG.body.sefer === null, J(hG.body.sefer) + ' ' + iG.status + ' ' + J(yG.body.engel));
      await saatYaz(sabahR);
    }
    await iste('/api/servis/sefer-bitir', 'POST', { seferId: acilan[0] }, S5.token);
    const ikiBas = await Promise.all([basR(), basR()]);
    const yR2 = await yoklama(S5.token);
    kontrol('"Seferi başlat"a aynı anda iki kez basılınca tek sefer', ikiBas.every(r => r.status === 200) && !!seferId(ikiBas[0]) &&
      seferId(ikiBas[0]) === seferId(ikiBas[1]) && !!yR2.body.sefer && yR2.body.sefer.id === seferId(ikiBas[0]),
    ikiBas.map(r => r.status + ':' + (seferId(r) || r.body.error)).join(' | ') + ' ' + J(yR2.body.sefer));
    /* Saatler gün içinde değişip o günün "sefer başladı" anı aralığın dışında
       kaldıysa yeniden başlatmada an tazelenir (uzatmadaki işaretler buna bakar). */
    if (!depo) atla('"sefer başladı" anının tazelenmesi (test veritabanına bağlanılamadı)');
    else {
      await depo.servisYoklama.gunuGeriTarihle(svR, trGun(0), 'sabah', 90);
      const tazeOnce = (await yoklama(S5.token)).body.gun.basladi;
      const taze = await basR();
      const tazeSonra = (await yoklama(S5.token)).body.gun.basladi;
      kontrol('aralığın dışında kalmış "sefer başladı" anı yeniden başlatmada tazeleniyor', taze.status === 200 &&
        Date.now() - Date.parse(tazeOnce) > 80 * 60000 && Date.now() - Date.parse(tazeSonra) < 5 * 60000, tazeOnce + ' -> ' + tazeSonra);
    }
    if (seferId(ikiBas[0])) await iste('/api/servis/sefer-bitir', 'POST', { seferId: seferId(ikiBas[0]) }, S5.token);
  }
  m = trDk();
  const aksamR = aksamAraligi(m);
  if (!aksamR) atla('akşam kenarları (gece yarısına çok yakın)');
  else {
    const [deniz, ada, mert] = yaris;
    await saatYaz(aksamR);
    const bosBas = await basR();
    kontrol('"Geldi" işaretli öğrenci yokken "Başlat": sefer açılıyor ama uyarı dönüyor (kendiliğinden bitmez)', bosBas.status === 200 &&
      bosBas.body.serviste === 0 && /"Geldi"/.test(bosBas.body.message || ''), J(bosBas.body));
    if (seferId(bosBas)) await iste('/api/servis/sefer-bitir', 'POST', { seferId: seferId(bosBas) }, S5.token);
    await isaretR(deniz, 'geldi');
    await isaretR(ada, 'geldi');
    await isaretR(mert, 'gelmedi');
    const bas3 = await basR();
    const inD = await isaretR(deniz, 'indi');
    const yol = await yoklama(S5.token);
    kontrol('akşam "Başlat" serviste 2 öğrenci; biri inince sefer sürüyor', bas3.status === 200 && bas3.body.serviste === 2 && inD.status === 200 &&
      inD.body.bitti === false && !!yol.body.sefer, J(bas3.body) + ' ' + J(inD.body.message));
    const adaGelmedi = await isaretR(ada, 'gelmedi');
    const bit = await yoklama(S5.token);
    kontrol('serviste kalan son öğrenci "Gelmedi"ye çevrilince sefer kendiliğinden bitti', adaGelmedi.status === 200 && adaGelmedi.body.bitti === true &&
      !!bit.body.gun.bitti && bit.body.sefer === null && bit.body.acik === false, J(adaGelmedi.body.message) + ' ' + J(bit.body.gun) + ' ' + J(bit.body.sefer));
    await genis();
  }

  console.log('=== 9) CİHAZ ANAHTARI ===');
  const yeni = await cihaz('', 'POST', { ad: 'Pixel 8', platform: 'android', surum: '2.0.0' }, undefined, V);
  const kV = yeni.body.cihazAnahtari;
  kontrol('oturumla 64 haneli anahtar alındı', yeni.status === 200 && /^[a-f0-9]{64}$/.test(kV || '') && !!yeni.body.cihazId, J(yeni.body));
  kontrol('oturumsuz anahtar alınamıyor', (await cihaz('', 'POST', { ad: 'x' })).status === 401);
  const meB = await iste('/api/me', 'GET', null, kV);
  const meX = await fetch(BASE + '/api/me', { headers: { 'X-Cihaz': kV } });
  kontrol('anahtar hesaba giriş vermiyor (/api/me 401: Bearer ya da X-Cihaz)', meB.status === 401 && meX.status === 401, meB.status + ' ' + meX.status);
  const bO = await cihaz('/bildirimler', 'GET', null, undefined, V);
  const bB = await cihaz('/bildirimler', 'GET', null, 'b'.repeat(64));
  const bZ = await cihaz('/bildirimler', 'GET', null, "' OR 1=1 --");
  kontrol('oturum anahtarıyla, bilinmeyen ve biçimsiz anahtarla bildirim ucu 401', bO.status === 401 && bB.status === 401 && bZ.status === 401,
    [bO.status, bB.status, bZ.status].join(' '));
  const ilk = await cihaz('/bildirimler', 'GET', null, kV);
  kontrol('ilk yoklamada eski bildirimler gelmiyor, imleç ve servis saatleri geliyor', ilk.status === 200 && ilk.body.bildirimler.length === 0 &&
    /^\d{4}-\d\d-\d\dT[\d:.]+Z\|/.test(ilk.body.imlec) && ilk.body.servisSaatleri && ilk.body.servisSaatleri.aksamBit === '23:59', J(ilk.body));
  await not({ ogrenciId: me1.id, metin: 'Cihaz denemesi ' + z });
  const iki = await cihaz('/bildirimler?son=' + encodeURIComponent(ilk.body.imlec), 'GET', null, kV);
  const b0 = iki.body.bildirimler && iki.body.bildirimler[0];
  kontrol('yeni bildirim geldi (metin, bağlantı ?k= ile, zaman)', iki.status === 200 && iki.body.bildirimler.length === 1 &&
    b0.metin === 'Servisçiden not: Cihaz denemesi ' + z && b0.baglanti.endsWith('/?k=' + vId + '#/servis?c=' + me1.id) && !!b0.zaman && !!b0.id, J(iki.body));
  const uc = await cihaz('/bildirimler?son=' + encodeURIComponent(iki.body.imlec), 'GET', null, kV);
  kontrol('aynı bildirim ikinci kez gelmiyor', uc.body.bildirimler.length === 0 && uc.body.imlec === iki.body.imlec, J(uc.body));
  await not({ ogrenciId: me1.id, metin: 'Okundu denemesi' });
  await iste('/api/notifications/read', 'POST', {}, V);
  const dort = await cihaz('/bildirimler?son=' + encodeURIComponent(uc.body.imlec), 'GET', null, kV);
  kontrol('okunmuş bildirim telefona gitmiyor; imleç ilerliyor', dort.body.bildirimler.length === 0 && dort.body.imlec !== uc.body.imlec, J(dort.body));
  for (let i = 0; i < 25; i++) await not({ ogrenciId: me1.id, metin: 'Toplu ' + i });
  const bes = await cihaz('/bildirimler?son=' + encodeURIComponent(dort.body.imlec), 'GET', null, kV);
  const alti = await cihaz('/bildirimler?son=' + encodeURIComponent(bes.body.imlec), 'GET', null, kV);
  kontrol('en çok 20 bildirim (en yeniler, eskiden yeniye) geliyor; sonra yağmur yok', bes.body.bildirimler.length === 20 &&
    bes.body.bildirimler[19].metin === 'Servisçiden not: Toplu 24' && bes.body.bildirimler[0].metin === 'Servisçiden not: Toplu 5' &&
    alti.body.bildirimler.length === 0, J((bes.body.bildirimler || []).map(b => b.metin)).slice(0, 200));
  const bozukImlec = await cihaz('/bildirimler?son=abc', 'GET', null, kV);
  kontrol('bozuk imleç ilk yoklama gibi davranıyor', bozukImlec.status === 200 && bozukImlec.body.bildirimler.length === 0, J(bozukImlec.body));
  /* Yetişkinin okul rolüne (öğretmen) gelen bildirim de hesabın telefonuna gelir. */
  const kMat = (await cihaz('', 'POST', { ad: 'Öğretmen telefonu' }, undefined, mat.token)).body.cihazAnahtari;
  const mIlk = await cihaz('/bildirimler', 'GET', null, kMat);
  await iste('/api/mesajlar', 'POST', { tur: 'mesaj', konu: 'Cihaz ' + z, govde: 'Merhaba', hedef: { tur: 'kisi', kisiler: [mat.user.id] } }, M);
  const mIki = await cihaz('/bildirimler?son=' + encodeURIComponent(mIlk.body.imlec), 'GET', null, kMat);
  kontrol('okul rolüne gelen bildirim ?k=<rol> bağlantısıyla geliyor; servisle ilgisi yoksa servisSaatleri null', mIki.body.bildirimler.length === 1 &&
    mIki.body.bildirimler[0].baglanti.indexOf('/school/test-ortaokulu/?k=' + mat.user.id + '#/') === 0 && mIlk.body.servisSaatleri === null,
  J(mIki.body) + J(mIlk.body.servisSaatleri));
  const liste = await cihaz('', 'GET', null, undefined, V);
  kontrol('hesap telefonlarını listeliyor (anahtar dönmüyor)', liste.status === 200 && liste.body.cihazlar.some(c => c.ad === 'Pixel 8') &&
    J(liste.body).indexOf(kV) < 0, J(liste.body).slice(0, 160));
  const silB0 = await cihaz('/sil', 'POST', {}, undefined, V);
  const silBy = await cihaz('/sil', 'POST', { id: liste.body.cihazlar[0].id }, undefined, V2);
  kontrol('oturumla silmede hangi telefon belli değilse 400, başkasının telefonu 404', silB0.status === 400 && silBy.status === 404, silB0.status + ' ' + silBy.status);
  const silB = await cihaz('/sil', 'POST', { cihazAnahtari: cKV }, undefined, V);
  kontrol('oturumla anahtar kaldırıldı; anahtar artık 401', silB.status === 200 && (await cihaz('/ayar', 'GET', null, cKV)).status === 401, J(silB.body));
  const silK = await cihaz('/sil', 'POST', {}, kV);
  kontrol('anahtarla kaldırıldı (uygulamadan çıkış); anahtar artık 401', silK.status === 200 && (await cihaz('/bildirimler', 'GET', null, kV)).status === 401);
  const altiAnahtar = [];
  for (let i = 0; i < 6; i++) altiAnahtar.push((await cihaz('', 'POST', { ad: 'Telefon ' + i }, undefined, V2)).body.cihazAnahtari);
  kontrol('hesap başına en çok 5 anahtar: en eskisi düştü', (await cihaz('/ayar', 'GET', null, altiAnahtar[0])).status === 401 &&
    (await cihaz('/ayar', 'GET', null, altiAnahtar[5])).status === 200);
  const o1Anahtar = (await cihaz('', 'POST', { ad: 'Öğrenci telefonu' }, undefined, o1.token)).body.cihazAnahtari;
  const o1Ayar = await cihaz('/ayar', 'GET', null, o1Anahtar);
  kontrol('öğrencinin anahtarı: servisteki öğrenciye servis saatleri, açık sefer yok', o1Ayar.status === 200 && o1Ayar.body.rol === 'student' &&
    o1Ayar.body.servisci === false && o1Ayar.body.acikSefer === null && !!o1Ayar.body.servisSaatleri, J(o1Ayar.body));
  const aileAnahtar = await fetch(BASE + '/api/aile/cihaz/ayar', { headers: { 'X-Aile-Cihaz': o1Anahtar } });
  kontrol('uygulama anahtarı Aile uçlarında geçmiyor', aileAnahtar.status === 401, String(aileAnahtar.status));
  /* Şifre değişince hesabın telefon anahtarları iptal olur. */
  const v2Sifre = await iste('/api/password', 'POST', { old: 'Test1234!', new: 'Yeni2026!sifre' }, V2);
  kontrol('şifre değişince telefon anahtarları iptal oldu', v2Sifre.status === 200 && (await cihaz('/ayar', 'GET', null, altiAnahtar[5])).status === 401,
    J(v2Sifre.body));
  /* Hesap silinince anahtar da gider. */
  const sonK = 'yok4' + (Date.now() % 100000);
  const s4h = await okulHesabi(M, 'servisci', { fullName: 'Silinecek Sürücü', username: sonK, password: 'Test1234!' });
  const S4 = await girisYap(sonK, 'Test1234!');
  const k4 = (await cihaz('', 'POST', { ad: 'x' }, undefined, S4.token)).body.cihazAnahtari;
  await iste('/api/school/hesap-sil', 'POST', { id: s4h.id, onay: true }, M);
  kontrol('hesap silinince anahtar çalışmıyor', (await cihaz('/ayar', 'GET', null, k4)).status === 401);
  const hz = [];
  for (let i = 0; i < 70; i++) hz.push(konumB(cK1, { seferId: 'yok' }));
  const hzKod = (await Promise.all(hz)).map(r => r.status);
  kontrol('anahtarla konum dakikada 60 ile sınırlı', hzKod.filter(k => k === 429).length >= 5, hzKod.filter(k => k === 429).length + ' adet 429');

  console.log('=== 10) UYGULAMA OTURUMU (30 GÜN) ===');
  if (!depo) atla('uygulama oturumu (test veritabanına bağlanılamadı)');
  else {
    const web = await girisYap('ogrenci2', 'Test1234!');
    const app = await uygulamaGirisi('ogrenci2', 'Test1234!');
    const mApp = await uygulamaGirisi('mudur@test.com', 'Test1234!', 'giris');
    const mApp2 = await uygulamaGirisi('mudur@test.com', 'Test1234!', 'dogrula');
    const me = t => iste('/api/me', 'GET', null, t).then(r => r.status);
    await depo.oturumlar.geriTarihle(web.token, 8);
    await depo.oturumlar.geriTarihle(app.token, 8);
    await depo.oturumlar.geriTarihle(mApp.token, 8);
    await depo.oturumlar.geriTarihle(mApp2.token, 8);
    kontrol('8 günlük tarayıcı oturumu düştü; uygulama oturumu sürüyor (kodlu girişte bayrak iki adımda da)',
      await me(web.token) === 401 && await me(app.token) === 200 && await me(mApp.token) === 200 && await me(mApp2.token) === 200,
      [await me(web.token), await me(app.token), await me(mApp.token), await me(mApp2.token)].join(' '));
    /* Portal değişince yeni oturum da uygulama oturumu. */
    const vApp = await uygulamaGirisi(vK, 'Test1234!');
    const gec = await kisilikGec(vApp.token, 'hesap');
    await depo.oturumlar.geriTarihle(gec.token, 8);
    kontrol('portal değişince uygulama oturumu 30 gün kalıyor', await me(gec.token) === 200);
    /* Portal değişince yeni oturum eskisinin açılış anını devralır: portal
       değiştirerek süre sonsuza dek tazelenemez. */
    const vApp29 = await uygulamaGirisi(vK, 'Test1234!');
    await depo.oturumlar.geriTarihle(vApp29.token, 29);
    const gec29 = await kisilikGec(vApp29.token, 'hesap');
    const gec29Ilk = await me(gec29.token);
    await depo.oturumlar.geriTarihle(gec29.token, 1);
    kontrol('29 günlük uygulama oturumunda portal değişince yeni oturum 1 gün sonra düşüyor (süre uzamıyor)', gec29Ilk === 200 &&
      await me(gec29.token) === 401 && await me(vApp29.token) === 401, gec29Ilk + ' ' + await me(gec29.token));
    const vWeb6 = await girisYap(vK, 'Test1234!');
    await depo.oturumlar.geriTarihle(vWeb6.token, 6);
    const gec6 = await kisilikGec(vWeb6.token, 'hesap');
    const gec6Ilk = await me(gec6.token);
    await depo.oturumlar.geriTarihle(gec6.token, 1);
    kontrol('6 günlük tarayıcı oturumunda portal değişince yeni oturum 1 gün sonra düşüyor', gec6Ilk === 200 && await me(gec6.token) === 401,
      gec6Ilk + ' ' + await me(gec6.token));
    await depo.oturumlar.geriTarihle(app.token, 23);
    kontrol('31 günlük uygulama oturumu düştü', await me(app.token) === 401);
    await iste('/api/logout', 'POST', {}, mApp.token);
    kontrol('çıkışta uygulama oturumu kapanıyor', await me(mApp.token) === 401);
    const v2Web = await girisYap(v2K, 'Yeni2026!sifre');
    const v2App = await uygulamaGirisi(v2K, 'Yeni2026!sifre');
    await iste('/api/password', 'POST', { old: 'Yeni2026!sifre', new: 'Ucuncu2026!sifre' }, v2Web.token);
    kontrol('şifre değişince uygulama oturumu kapanıyor', await me(v2App.token) === 401 && await me(v2Web.token) === 200);
    await depo.baglanti.kapat();
  }

  console.log();
  console.log('  GECTI: ' + gecti + '   KALDI: ' + kaldi);
  process.exit(kaldi ? 1 : 0);
})().catch(e => { console.log('  TEST HATASI: ' + e.stack); process.exit(1); });
