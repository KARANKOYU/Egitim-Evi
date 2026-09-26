/* Ödev teslim dosyaları:
   - yalnızca ödevdeki öğrenci, teslim açıkken, izinli türde ve sınır içinde yükler;
   - dosya adı temizlenir (yol parçası kalmaz); içerik bayt bayt geri gelir;
   - indirme her zaman ek (attachment, nosniff, sandbox) olarak gider;
   - başka öğrenci, başka öğretmen, bağsız veli dosyaya erişemez;
   - öğretmenin zip'i geçerli: adlar öğrenci klasörlerinde, CRC32'ler doğru;
   - sayı sınırı, sonuçlandırılmış ve süresi geçmiş ödev, büyük dosya reddedilir. */
const http = require('http');
const zlib = require('zlib');
const crypto = require('crypto');
const { iste, girisYap, hesapAc } = require('./giris');

const BASE = process.env.EE_BASE || 'http://localhost:3000';
let gecti = 0, kaldi = 0;
function kontrol(ad, sart, detay) {
  if (sart) { gecti++; console.log('  GECTI  ' + ad); }
  else { kaldi++; console.log('  KALDI  ' + ad + (detay ? '  -> ' + detay : '')); }
}
const J = x => JSON.stringify(x).slice(0, 180);
const gun = n => new Date(Date.now() + n * 86400000).toISOString().slice(0, 10);

async function yukle(token, odevId, ad, veri) {
  const h = { 'Content-Type': 'application/octet-stream', 'X-Dosya-Adi': encodeURIComponent(ad) };
  if (token) h.Authorization = 'Bearer ' + token;
  const r = await fetch(BASE + '/api/odev-dosya/yukle?odev=' + encodeURIComponent(odevId), { method: 'POST', headers: h, body: veri });
  let j = {};
  try { j = JSON.parse(await r.text()); } catch (e) { j = {}; }
  return { status: r.status, body: j };
}

async function indir(token, yol) {
  const r = await fetch(BASE + yol, { headers: { Authorization: 'Bearer ' + token } });
  return { status: r.status, headers: r.headers, veri: Buffer.from(await r.arrayBuffer()) };
}

/* Gövdeyi göndermeden büyük boyut bildir: sunucu okumadan reddetmeli. */
function buyukBildir(token, odevId) {
  return new Promise(resolve => {
    const u = new URL(BASE + '/api/odev-dosya/yukle?odev=' + encodeURIComponent(odevId));
    const req = http.request({ hostname: u.hostname, port: u.port, path: u.pathname + u.search, method: 'POST', headers: {
      Authorization: 'Bearer ' + token, 'Content-Type': 'application/octet-stream', 'X-Dosya-Adi': 'video.mp4',
      'Content-Length': String(300 * 1024 * 1024) } }, res => {
      let t = '';
      res.on('data', c => { t += c; });
      res.on('end', () => { req.destroy(); resolve({ status: res.statusCode, body: t }); });
    });
    req.on('error', () => resolve({ status: 0 }));
    req.write(Buffer.alloc(1024));
  });
}

function zipOku(buf) {
  const girdiler = [];
  let i = 0;
  while (i + 30 <= buf.length && buf.readUInt32LE(i) === 0x04034b50) {
    const crc = buf.readUInt32LE(i + 14), boyut = buf.readUInt32LE(i + 18);
    const adUz = buf.readUInt16LE(i + 26), ekUz = buf.readUInt16LE(i + 28);
    const ad = buf.slice(i + 30, i + 30 + adUz).toString('utf8');
    const veri = buf.slice(i + 30 + adUz + ekUz, i + 30 + adUz + ekUz + boyut);
    girdiler.push({ ad, veri, crcDogru: (zlib.crc32(veri) >>> 0) === crc });
    i += 30 + adUz + ekUz + boyut;
  }
  const e = buf.length - 22;
  return { girdiler, sonDogru: e > 0 && buf.readUInt32LE(e) === 0x06054b50 && buf.readUInt16LE(e + 10) === girdiler.length };
}

(async () => {
  const z = Date.now();
  const mat = await girisYap('mat', 'Test1234!');
  const fen = await girisYap('fen', 'Test1234!');
  const o1 = await girisYap('ogrenci1', 'Test1234!');
  const o2 = await girisYap('ogrenci2', 'Test1234!');

  const vK = 'dosyaveli' + z;
  await hesapAc({ fullName: 'Dosya Veli', username: vK, email: vK + '@test.com' });
  const veli = await girisYap(vK, 'Test1234!');
  await iste('/api/parent/link', 'POST', { code: (await iste('/api/me', 'GET', null, o1.token)).body.user.code }, veli.token);

  const odevAc = async (baslik, bitis) => (await iste('/api/assignments', 'POST', { title: baslik, subject: 'Matematik',
    studentIds: [o1.user.id, o2.user.id], startAt: gun(-1), endAt: bitis, endTime: '23:59' }, mat.token)).body.assignment.id;
  const odev = await odevAc('Proje ödevi ' + z, gun(3));

  console.log('=== 1) YÜKLEME ===');
  const icerik = crypto.randomBytes(5000);
  const y1 = await yukle(o1.token, odev, 'Ödev 1.pdf', icerik);
  kontrol('öğrenci dosya yükledi', y1.status === 200 && /^[0-9a-f]{32}$/.test(y1.body.dosya.id) && y1.body.dosya.boyut === 5000, J(y1.body));
  const yol = await yukle(o1.token, odev, '../../windows\\system32\\gizli.pdf', Buffer.from('x'));
  kontrol('dosya adındaki yol parçaları atıldı', yol.status === 200 && yol.body.dosya.ad === 'gizli.pdf', J(yol.body));
  const exe = await yukle(o1.token, odev, 'oyun.exe', Buffer.from('MZ'));
  kontrol('izinsiz tür reddedildi', exe.status === 415, 'status ' + exe.status);
  const bos = await yukle(o1.token, odev, 'bos.txt', Buffer.alloc(0));
  kontrol('boş dosya reddedildi', bos.status === 411 || bos.status === 400, 'status ' + bos.status);
  const girissiz = await yukle('', odev, 'a.pdf', Buffer.from('x'));
  kontrol('giriş yapmadan yüklenemiyor', girissiz.status === 401, 'status ' + girissiz.status);
  const ogretmen = await yukle(mat.token, odev, 'a.pdf', Buffer.from('x'));
  kontrol('öğretmen öğrenci yerine yükleyemiyor', ogretmen.status === 403, 'status ' + ogretmen.status);
  const buyuk = await buyukBildir(o1.token, odev);
  kontrol('200 MB üstü gövde okunmadan reddedildi', buyuk.status === 413, 'status ' + buyuk.status);
  const y2 = await yukle(o2.token, odev, 'burak.docx', Buffer.from('burak'));
  kontrol('ikinci öğrenci yükledi', y2.status === 200, J(y2.body));

  console.log('=== 2) GÖRME VE İNDİRME ===');
  const o1Liste = await iste('/api/odev-dosya?odev=' + odev, 'GET', null, o1.token);
  kontrol('öğrenci yalnızca kendi dosyalarını görüyor', o1Liste.body.dosyalar.length === 2 &&
    o1Liste.body.dosyalar.every(d => d.ogrenciId === o1.user.id) && o1Liste.body.yukleyebilir === true, J(o1Liste.body));
  const kendi = await indir(o1.token, '/api/odev-dosya/indir?id=' + y1.body.dosya.id);
  kontrol('indirilen içerik bayt bayt aynı', kendi.status === 200 && kendi.veri.equals(icerik), 'status ' + kendi.status);
  kontrol('ek olarak iniyor (attachment, octet-stream, nosniff, sandbox)',
    /^attachment;/.test(kendi.headers.get('content-disposition') || '') &&
    /filename\*=UTF-8''%C3%96dev%201\.pdf/.test(kendi.headers.get('content-disposition') || '') &&
    kendi.headers.get('content-type') === 'application/octet-stream' && kendi.headers.get('x-content-type-options') === 'nosniff' &&
    /sandbox/.test(kendi.headers.get('content-security-policy') || ''), kendi.headers.get('content-disposition'));
  const baskasi = await indir(o2.token, '/api/odev-dosya/indir?id=' + y1.body.dosya.id);
  kontrol('başka öğrenci indiremiyor', baskasi.status === 403, 'status ' + baskasi.status);
  const fenListe = await iste('/api/odev-dosya?odev=' + odev, 'GET', null, fen.token);
  const fenIndir = await indir(fen.token, '/api/odev-dosya/indir?id=' + y1.body.dosya.id);
  kontrol('ödevi vermeyen öğretmen göremiyor', fenListe.status === 403 && fenIndir.status === 403, fenListe.status + ' ' + fenIndir.status);
  const veliListe = await iste('/api/odev-dosya?odev=' + odev + '&ogrenci=' + o1.user.id, 'GET', null, veli.token);
  const veliIndir = await indir(veli.token, '/api/odev-dosya/indir?id=' + y1.body.dosya.id);
  kontrol('veli çocuğunun dosyalarını görüp indiriyor, yükleyemiyor', veliListe.status === 200 && veliListe.body.dosyalar.length === 2 &&
    veliListe.body.yukleyebilir === false && veliIndir.status === 200, J(veliListe.body));
  const veliBaska = await iste('/api/odev-dosya?odev=' + odev + '&ogrenci=' + o2.user.id, 'GET', null, veli.token);
  const veliBaskaIndir = await indir(veli.token, '/api/odev-dosya/indir?id=' + y2.body.dosya.id);
  kontrol('veli başka çocuğun dosyasına erişemiyor', veliBaska.status === 403 && veliBaskaIndir.status === 403,
    veliBaska.status + ' ' + veliBaskaIndir.status);
  const uydurma = await indir(o1.token, '/api/odev-dosya/indir?id=../../ayarlar.json');
  kontrol('uydurma kimlikle dosya yolu açılmıyor', uydurma.status === 404, 'status ' + uydurma.status);

  const ogrtListe = await iste('/api/odev-dosya?odev=' + odev, 'GET', null, mat.token);
  kontrol('öğretmen bütün teslimleri görüyor', ogrtListe.body.yonetir === true && ogrtListe.body.dosyalar.length === 3 &&
    ogrtListe.body.dosyalar.some(d => d.ogrenci === 'Burak Öztürk'), J(ogrtListe.body));
  const zip = await indir(mat.token, '/api/odev-dosya/zip?odev=' + odev);
  const z1 = zipOku(zip.veri);
  const zAd = z1.girdiler.map(g => g.ad);
  kontrol('zip geçerli: 3 girdi, CRC32 doğru, sonu yerinde', zip.status === 200 && z1.girdiler.length === 3 &&
    z1.girdiler.every(g => g.crcDogru) && z1.sonDogru && zip.veri.length === Number(zip.headers.get('content-length')), J(zAd));
  kontrol('zip içinde öğrenci klasörleri', zAd.indexOf('Zeynep Şahin/Ödev 1.pdf') >= 0 && zAd.indexOf('Burak Öztürk/burak.docx') >= 0 &&
    z1.girdiler.find(g => g.ad === 'Zeynep Şahin/Ödev 1.pdf').veri.equals(icerik), J(zAd));
  const ogrZip = await indir(o1.token, '/api/odev-dosya/zip?odev=' + odev);
  kontrol('öğrenci zip alamıyor', ogrZip.status === 403, 'status ' + ogrZip.status);

  console.log('=== 3) SINIRLAR VE SİLME ===');
  for (let i = 0; i < 8; i++) await yukle(o1.token, odev, 'parca' + i + '.txt', Buffer.from('parça ' + i));
  const onbirinci = await yukle(o1.token, odev, 'fazla.txt', Buffer.from('fazla'));
  kontrol('bir ödeve en fazla 10 dosya', onbirinci.status === 400 && /10 dosya/.test(onbirinci.body.error || ''), J(onbirinci.body));
  const sil = await iste('/api/odev-dosya/sil', 'POST', { id: yol.body.dosya.id }, o1.token);
  const silinmis = await indir(o1.token, '/api/odev-dosya/indir?id=' + yol.body.dosya.id);
  kontrol('öğrenci kendi dosyasını sildi', sil.status === 200 && silinmis.status === 404, sil.status + ' ' + silinmis.status);
  const baskasiniSil = await iste('/api/odev-dosya/sil', 'POST', { id: y2.body.dosya.id }, o1.token);
  kontrol('başkasının dosyasını silemiyor', baskasiniSil.status === 403, 'status ' + baskasiniSil.status);
  const ogretmenSil = await iste('/api/odev-dosya/sil', 'POST', { id: y2.body.dosya.id }, mat.token);
  kontrol('öğretmen uygunsuz dosyayı silebiliyor', ogretmenSil.status === 200, J(ogretmenSil.body));

  await iste('/api/assignments/' + odev + '/finish', 'POST', { results: {} }, mat.token);
  const sonuclanmis = await yukle(o1.token, odev, 'gec.pdf', Buffer.from('x'));
  const sonuclanmisSil = await iste('/api/odev-dosya/sil', 'POST', { id: y1.body.dosya.id }, o1.token);
  kontrol('sonuçlandırılmış ödeve yükleme ve silme kapalı', sonuclanmis.status === 400 && sonuclanmisSil.status === 400,
    J(sonuclanmis.body) + ' ' + sonuclanmisSil.status);

  const gecmis = await odevAc('Eski ödev ' + z, gun(-1));
  const gec = await yukle(o1.token, gecmis, 'gec.pdf', Buffer.from('x'));
  kontrol('süresi geçmiş ödeve yüklenemiyor', gec.status === 400 && /süresi doldu/.test(gec.body.error || ''), J(gec.body));

  console.log('=== 4) FOTOĞRAF, VİDEO, SES: TARAYICIDA AÇMA ===');
  const medyaOdev = await odevAc('Medya ödevi ' + z, gun(3));
  const resim = await yukle(o1.token, medyaOdev, 'deney.png', Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), crypto.randomBytes(3000)]));
  const video = await yukle(o1.token, medyaOdev, 'sunum.mp4', crypto.randomBytes(50000));
  const belge = await yukle(o1.token, medyaOdev, 'rapor.pdf', Buffer.from('%PDF-1.4 deneme'));
  kontrol('fotoğraf, video ve belge yüklendi', resim.status === 200 && video.status === 200 && belge.status === 200, J(video.body));
  const gb = await iste('/api/odev-dosya/bilet?tur=goster&id=' + resim.body.dosya.id, 'GET', null, mat.token);
  kontrol('öğretmen fotoğraf için açma bileti aldı', gb.status === 200 && gb.body.tur === 'resim' && /goster\?bilet=/.test(gb.body.yol || ''), J(gb.body));
  const gr = await fetch(BASE + gb.body.yol);
  kontrol('fotoğraf tarayıcıda açılır: image/png, inline, nosniff, sandbox', gr.status === 200 && gr.headers.get('content-type') === 'image/png' &&
    /^inline/.test(gr.headers.get('content-disposition') || '') && gr.headers.get('x-content-type-options') === 'nosniff' &&
    /sandbox/.test(gr.headers.get('content-security-policy') || ''), gr.status + ' ' + gr.headers.get('content-type'));
  const vb = await iste('/api/odev-dosya/bilet?tur=goster&id=' + video.body.dosya.id, 'GET', null, mat.token);
  const parca = await fetch(BASE + vb.body.yol, { headers: { Range: 'bytes=100-199' } });
  const pv = Buffer.from(await parca.arrayBuffer());
  kontrol('video ileri sarılır: 206 ve istenen parça', parca.status === 206 && pv.length === 100 &&
    parca.headers.get('content-range') === 'bytes 100-199/50000' && parca.headers.get('content-type') === 'video/mp4',
    parca.status + ' ' + parca.headers.get('content-range'));
  const tekrar = await fetch(BASE + vb.body.yol, { headers: { Range: 'bytes=0-9' } });
  kontrol('açma bileti video parça parça inerken yeniden kullanılır', tekrar.status === 206, 'status ' + tekrar.status);
  const belgeGoster = await iste('/api/odev-dosya/bilet?tur=goster&id=' + belge.body.dosya.id, 'GET', null, mat.token);
  kontrol('belge tarayıcıda açılmaz (indir)', belgeGoster.status === 400, J(belgeGoster.body));
  const yabanci = await iste('/api/odev-dosya/bilet?tur=goster&id=' + resim.body.dosya.id, 'GET', null, o2.token);
  kontrol('başka öğrenci açamaz', yabanci.status === 403, 'status ' + yabanci.status);
  const ib = await iste('/api/odev-dosya/bilet?tur=dosya&id=' + resim.body.dosya.id, 'GET', null, mat.token);
  const ind1 = await fetch(BASE + ib.body.yol), ind2 = await fetch(BASE + ib.body.yol);
  kontrol('indirme bileti yine tek kullanımlık, ek olarak iner', ind1.status === 200 && ind2.status === 410 &&
    /^attachment/.test(ind1.headers.get('content-disposition') || ''), ind1.status + ' ' + ind2.status);

  await iste('/api/assignments/' + odev + '/delete', 'POST', {}, mat.token);
  const odevSilindi = await indir(mat.token, '/api/odev-dosya/indir?id=' + y1.body.dosya.id);
  kontrol('ödev silinince dosyaları da erişilemez', odevSilindi.status === 404, 'status ' + odevSilindi.status);

  console.log('');
  console.log('GECTI: ' + gecti + '   KALDI: ' + kaldi);
  process.exit(kaldi ? 1 : 0);
})().catch(e => { console.error('TEST HATASI:', e); process.exit(1); });
