/* Ödev teslim dosyaları:
   - yalnızca ödevdeki öğrenci, teslim açıkken, izinli türde ve sınır içinde yükler;
   - dosya adı temizlenir (yol parçası kalmaz); içerik bayt bayt geri gelir;
   - indirme her zaman ek (attachment, nosniff, sandbox) olarak gider;
   - başka öğrenci, başka öğretmen, bağsız veli dosyaya erişemez;
   - öğretmenin zip'i geçerli: adlar öğrenci klasörlerinde, CRC32'ler doğru;
   - sayı sınırı, sonuçlandırılmış ve süresi geçmiş ödev, büyük dosya reddedilir;
   - "Öğrenciler bu ödeve dosya yükleyebilsin" varsayılan kapalı: kapalıyken 403
     (dosyaKapali), açılınca yüklenir, kapatılınca yüklenmiş dosya silinmez;
   - tek dosya ve öğrencinin bir ödevdeki toplamı 50 MB (gövde okunmadan
     reddedilir), liste doluluğu (kullanilan) verir; ekler de 50 MB;
   - silinme anı: son teslim + 7 gün (son teslim ileri alınınca değişir); son
     teslimsiz ödevde yüklemeden 60 gün, sonuçlandırılınca + 7 gün; son teslim
     yanlışlıkla geçmişe yazılınca en erken düzenlemeden 7 gün sonra (saatlik
     temizliğin silme sorgusu test veritabanında doğrudan denenir);
   - okulun dosya alanı (tumtest EE_OKUL_DOSYA_GB=0.001 verir): %80'i geçince
     müdüre ve yöneticiye bir kez bildirim, dolunca 507 ve bir kez "doldu". */
const http = require('http');
const zlib = require('zlib');
const crypto = require('crypto');
const { iste, girisYap, hesapAc } = require('./giris');

const BASE = process.env.EE_BASE || 'http://localhost:3000';
const MB = 1024 * 1024;
const OKUL_GB = Number(process.env.EE_OKUL_DOSYA_GB) || 0;   // sunucuya da aynısı verilmiş olmalı
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

/* Saatlik temizliğin silme sorgusu (depo eskileriSil), test veritabanında doğrudan.
   Dönen: silinen kayıtların kimlikleri; veritabanı test veritabanı değilse null. */
async function supurmeDene() {
  process.env.EE_DATA = require('path').join(__dirname, 'testdata');
  require('../sunucu/ayarlar').ayarlariYukle();
  const baglanti = require('../sunucu/veri/baglanti');
  if (!/_test$/.test(baglanti.veritabaniAdi() || '')) return null;
  try { return await require('../sunucu/veri/depo/odev-dosyalari').eskileriSil(); } finally { await baglanti.kapat(); }
}

/* Gövdeyi göndermeden büyük boyut bildir: sunucu okumadan reddetmeli.
   yol: yükleme adresi (varsayılan ödev teslimi), boyut: bildirilen bayt. */
function buyukBildir(token, odevId, boyut, yol) {
  return new Promise(resolve => {
    const u = new URL(BASE + (yol || '/api/odev-dosya/yukle?odev=' + encodeURIComponent(odevId)));
    const req = http.request({ hostname: u.hostname, port: u.port, path: u.pathname + u.search, method: 'POST', headers: {
      Authorization: 'Bearer ' + token, 'Content-Type': 'application/octet-stream', 'X-Dosya-Adi': 'video.mp4',
      'Content-Length': String(boyut || 300 * 1024 * 1024) } }, res => {
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

  /* Testteki ödevlerde öğrenci dosya yükleyebilir (varsayılan kapalı; 5. bölüm). */
  const odevAc = async (baslik, bitis) => (await iste('/api/assignments', 'POST', { title: baslik, subject: 'Matematik',
    studentIds: [o1.user.id, o2.user.id], startAt: gun(-1), endAt: bitis, endTime: '23:59', dosyaYukleme: true }, mat.token)).body.assignment.id;
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
  kontrol('300 MB gövde okunmadan reddedildi', buyuk.status === 413, 'status ' + buyuk.status);
  const elliBir = await buyukBildir(o1.token, odev, 50 * MB + 1);
  kontrol('tek dosya en fazla 50 MB: 50 MB + 1 bayt okunmadan reddedildi', elliBir.status === 413 && /50 MB/.test(elliBir.body),
    elliBir.status + ' ' + elliBir.body);
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

  console.log('=== 5) DOSYA YÜKLEME İZNİ (YENİ ÖDEVDE KAPALI) ===');
  const izinGovde = (ek) => Object.assign({ title: 'İzin ödevi ' + z, subject: 'Matematik', startAt: gun(-1), endAt: gun(3), endTime: '23:59' }, ek);
  const izinYeni = await iste('/api/assignments', 'POST', Object.assign(izinGovde({}), { studentIds: [o1.user.id, o2.user.id] }), mat.token);
  const izin = izinYeni.body.assignment || {};
  kontrol('yeni ödevde "dosya yükleyebilsin" varsayılan kapalı', izinYeni.status === 200 && izin.dosyaYukleme === false, J(izinYeni.body));
  const kapaliYukle = await yukle(o1.token, izin.id, 'kapali.pdf', Buffer.from('x'));
  kontrol('kapalıyken yükleme 403 ve dosyaKapali', kapaliYukle.status === 403 && kapaliYukle.body.dosyaKapali === true &&
    kapaliYukle.body.error === 'Bu ödev için dosya yüklenmiyor.', J(kapaliYukle));
  const kapaliListe = (await iste('/api/odev-dosya?odev=' + izin.id, 'GET', null, o1.token)).body;
  kontrol('liste: yükleme yok, "Bu ödev için dosya yüklenmiyor."', kapaliListe.dosyaYukleme === false &&
    kapaliListe.yukleyebilir === false && kapaliListe.kapali === 'Bu ödev için dosya yüklenmiyor.', J(kapaliListe));
  const acildi = await iste('/api/assignments/' + izin.id + '/update', 'POST', izinGovde({ dosyaYukleme: true }), mat.token);
  kontrol('Ödevi düzenle ile açıldı', acildi.status === 200 && acildi.body.assignment.dosyaYukleme === true, J(acildi.body));
  const acikBildirim = (await iste('/api/notifications', 'GET', null, o1.token)).body.notifications || [];
  kontrol('öğrenciye "artık dosya yükleyebilirsin" bildirimi gitti',
    acikBildirim.some(n => n.text.indexOf('İzin ödevi ' + z) >= 0 && n.text.indexOf('dosya yükleyebilirsin') >= 0), J(acikBildirim.slice(0, 3)));
  const acikYukle = await yukle(o1.token, izin.id, 'acik.pdf', Buffer.from('açıkken yüklendi'));
  kontrol('açılınca yüklendi', acikYukle.status === 200, J(acikYukle.body));
  const ayniKalir = await iste('/api/assignments/' + izin.id + '/update', 'POST', izinGovde({ description: 'değişti' }), mat.token);
  kontrol('alan gönderilmezse izin değişmez', ayniKalir.body.assignment && ayniKalir.body.assignment.dosyaYukleme === true, J(ayniKalir.body));
  const kapandi = await iste('/api/assignments/' + izin.id + '/update', 'POST', izinGovde({ dosyaYukleme: false }), mat.token);
  const kapandiYukle = await yukle(o1.token, izin.id, 'sonra.pdf', Buffer.from('x'));
  kontrol('kapatılınca yeni yükleme 403', kapandi.body.assignment.dosyaYukleme === false && kapandiYukle.status === 403 &&
    kapandiYukle.body.dosyaKapali === true, J(kapandiYukle));
  const kapandiOgretmen = (await iste('/api/odev-dosya?odev=' + izin.id, 'GET', null, mat.token)).body;
  const kapandiOgrenci = (await iste('/api/odev-dosya?odev=' + izin.id, 'GET', null, o1.token)).body;
  kontrol('kapatılınca yüklenmiş dosya silinmedi: öğretmen de öğrenci de görüyor', kapandiOgretmen.dosyalar.length === 1 &&
    kapandiOgretmen.dosyaYukleme === false && kapandiOgrenci.dosyalar.length === 1 && kapandiOgrenci.yukleyebilir === false &&
    kapandiOgrenci.silebilir === false, J(kapandiOgrenci));
  const kapaliSil = await iste('/api/odev-dosya/sil', 'POST', { id: acikYukle.body.dosya.id }, o1.token);
  kontrol('yükleme kapatılınca teslim donar: öğrenci yüklediği dosyayı silemez (403 dosyaKapali)', kapaliSil.status === 403 &&
    kapaliSil.body.dosyaKapali === true, J(kapaliSil.body));
  const dizgi = await iste('/api/assignments', 'POST', Object.assign(izinGovde({ title: 'Dizgi izin ' + z, dosyaYukleme: 'true' }),
    { studentIds: [o1.user.id] }), mat.token);
  kontrol('izin yalnız true ile açılır ("true" metni kapalı sayılır)', dizgi.body.assignment && dizgi.body.assignment.dosyaYukleme === false,
    J(dizgi.body));

  console.log('=== 6) 50 MB SINIRI VE DOLULUK ===');
  const sinirOdev = await odevAc('Sınır ödevi ' + z, gun(3));
  const s1 = await yukle(o1.token, sinirOdev, 'bir.pdf', crypto.randomBytes(20000));
  const sListe = (await iste('/api/odev-dosya?odev=' + sinirOdev, 'GET', null, o1.token)).body;
  kontrol('liste doluluğu veriyor: kullanılan 20000, sınır 50 MB', s1.status === 200 && sListe.kullanilan === 20000 &&
    sListe.sinir.toplam === 50 * MB && sListe.sinir.dosya === 50 * MB && sListe.sinir.adet === 10, J(sListe.sinir) + ' ' + sListe.kullanilan);
  const sigmaz = await buyukBildir(o1.token, sinirOdev, 50 * MB - 10000);
  kontrol('toplamı 50 MB\'ı geçen dosya okunmadan reddedildi: "sığmıyor", kalan yer yazıyor', sigmaz.status === 413 &&
    /sığmıyor/.test(sigmaz.body) && /boş yerin kaldı/.test(sigmaz.body) && /50 MB/.test(sigmaz.body), sigmaz.status + ' ' + sigmaz.body);
  const ekBuyuk = await buyukBildir(mat.token, null, 50 * MB + 1, '/api/ek/yukle?tur=mesaj');
  kontrol('mesaj eki de en fazla 50 MB', ekBuyuk.status === 413 && /50 MB/.test(ekBuyuk.body), ekBuyuk.status + ' ' + ekBuyuk.body);

  console.log('=== 7) SİLİNME ZAMANI ===');
  const an = (g, saat) => new Date(g + 'T' + saat + ':00').getTime();
  const yakin = (iso, ms) => !!iso && Math.abs(new Date(iso).getTime() - ms) < 3 * 60 * 1000;
  const GUN = 86400000;
  const tOdev = await odevAc('Silinme ödevi ' + z, gun(10));
  const tY = await yukle(o1.token, tOdev, 'silinme.pdf', Buffer.from('silinme'));
  const tOgr = (await iste('/api/odev-dosya?odev=' + tOdev, 'GET', null, o1.token)).body;
  const tOgrt = (await iste('/api/odev-dosya?odev=' + tOdev, 'GET', null, mat.token)).body;
  kontrol('son teslimli ödevde silinme = son teslim + 7 gün (öğrenci ve öğretmen)', tY.status === 200 &&
    yakin(tOgr.dosyalar[0].bitis, an(gun(10), '23:59') + 7 * GUN) && yakin(tOgrt.dosyalar[0].bitis, an(gun(10), '23:59') + 7 * GUN) &&
    tOgr.saklama === 'Dosyalar son teslimden 7 gün sonra silinir.', J(tOgr.dosyalar[0]) + ' ' + tOgr.saklama);
  await iste('/api/assignments/' + tOdev + '/update', 'POST', { title: 'Silinme ödevi ' + z, startAt: gun(-1), endAt: gun(20), endTime: '10:00' }, mat.token);
  const tIleri = (await iste('/api/odev-dosya?odev=' + tOdev, 'GET', null, o1.token)).body;
  kontrol('son teslim ileri alınınca silinme yeniden hesaplandı', yakin(tIleri.dosyalar[0].bitis, an(gun(20), '10:00') + 7 * GUN),
    J(tIleri.dosyalar[0]));
  const suresiz = (await iste('/api/assignments', 'POST', { title: 'Süresiz ödev ' + z, subject: 'Matematik', studentIds: [o1.user.id],
    startAt: gun(-1), dosyaYukleme: true }, mat.token)).body.assignment;
  const sY = await yukle(o1.token, suresiz.id, 'suresiz.pdf', Buffer.from('süresiz'));
  const sL = (await iste('/api/odev-dosya?odev=' + suresiz.id, 'GET', null, o1.token)).body;
  kontrol('son teslimsiz ödevde silinme = yüklemeden 60 gün sonra', sY.status === 200 && !suresiz.endAt &&
    yakin(sL.dosyalar[0].bitis, new Date(sL.dosyalar[0].yuklenme).getTime() + 60 * GUN), J(sL.dosyalar[0]));
  await iste('/api/assignments/' + suresiz.id + '/finish', 'POST', { results: {} }, mat.token);
  const sBitti = (await iste('/api/odev-dosya?odev=' + suresiz.id, 'GET', null, o1.token)).body;
  kontrol('sonuçlandırılınca silinme = sonuçlanma + 7 gün', yakin(sBitti.dosyalar[0].bitis, Date.now() + 7 * GUN), J(sBitti.dosyalar[0]));
  await iste('/api/assignments/' + suresiz.id + '/reopen', 'POST', {}, mat.token);
  const sAcik = (await iste('/api/odev-dosya?odev=' + suresiz.id, 'GET', null, o1.token)).body;
  kontrol('yeniden açılınca silinme yeniden hesaplandı (yüklemeden 60 gün)',
    yakin(sAcik.dosyalar[0].bitis, new Date(sAcik.dosyalar[0].yuklenme).getTime() + 60 * GUN), J(sAcik.dosyalar[0]));
  /* Öğretmen son teslimi yanlışlıkla geçmişe yazarsa (yılı eksik gibi) dosyalar
     saatlik temizlikte hemen silinmez: silinme en erken düzenlemeden 7 gün sonra (034). */
  const gOdev = await odevAc('Geçmiş tarih ödevi ' + z, gun(5));
  const gY = await yukle(o1.token, gOdev, 'gecmis.pdf', Buffer.from('geçmiş tarih'));
  const gDuz = await iste('/api/assignments/' + gOdev + '/update', 'POST', { title: 'Geçmiş tarih ödevi ' + z, startAt: gun(-400),
    endAt: gun(-365), endTime: '10:00' }, mat.token);
  const gL = (await iste('/api/odev-dosya?odev=' + gOdev, 'GET', null, mat.token)).body;
  kontrol('son teslim geçmişe alınınca silinme şimdi + 7 gün (hemen silinmez)', gY.status === 200 && gDuz.status === 200 &&
    gL.dosyalar.length === 1 && yakin(gL.dosyalar[0].bitis, Date.now() + 7 * GUN), J(gL.dosyalar && gL.dosyalar[0]));
  const supurulen = await supurmeDene();
  if (supurulen === null) console.log('  (test veritabanı değil: temizlik sorgusu denenmedi)');
  else {
    const gSonra = (await iste('/api/odev-dosya?odev=' + gOdev, 'GET', null, mat.token)).body;
    kontrol('saatlik temizliğin silme sorgusu bu dosyayı silmedi', supurulen.indexOf(gY.body.dosya.id) < 0 &&
      gSonra.dosyalar.length === 1, J(supurulen) + ' ' + J(gSonra.dosyalar));
  }
  await iste('/api/assignments/' + gOdev + '/update', 'POST', { title: 'Geçmiş tarih ödevi ' + z, startAt: gun(-1),
    endAt: gun(20), endTime: '10:00' }, mat.token);
  const gDuzelt = (await iste('/api/odev-dosya?odev=' + gOdev, 'GET', null, o1.token)).body;
  kontrol('tarih düzeltilince silinme yine son teslim + 7 gün', yakin(gDuzelt.dosyalar[0].bitis, an(gun(20), '10:00') + 7 * GUN),
    J(gDuzelt.dosyalar[0]));

  console.log('=== 8) OKULUN DOSYA ALANI (%80 VE DOLU) ===');
  if (!OKUL_GB) {
    console.log('  (EE_OKUL_DOSYA_GB verilmedi: okul alanı bölümü atlandı; tumtest.sh 0.001 verir)');
  } else {
    const KOTA = Math.round(OKUL_GB * 1024 * MB);
    const M = (await girisYap('mudur@test.com', 'Test1234!')).token;
    const A = (await girisYap('admin@egitimevi.com', 'admin123')).token;
    const say = async (tok, parca) => ((await iste('/api/notifications', 'GET', null, tok)).body.notifications || [])
      .filter(n => n.text.indexOf(parca) >= 0).length;
    /* Okulda bu testin yüklediklerinden başka teslim dosyası yok: kullanım öğretmenin ödevlerinden. */
    let kullanim = 0;
    for (const a of (await iste('/api/assignments', 'GET', null, mat.token)).body.assignments || []) {
      kullanim += (await iste('/api/odev-dosya?odev=' + a.id, 'GET', null, mat.token)).body.toplam || 0;
    }
    const kotaOdev = await odevAc('Kota ödevi ' + z, gun(3));
    const esik = Math.ceil(0.8 * KOTA);
    const alt = esik - kullanim - 1000;
    const k1 = await yukle(o2.token, kotaOdev, 'kota1.pdf', crypto.randomBytes(alt));
    kontrol('%80 altında bildirim yok', k1.status === 200 && await say(M, "dosya alanının %80'i doldu") === 0 &&
      await say(A, "dosya alanının %80'i doldu") === 0, 'kota ' + KOTA + ' kullanım ' + kullanim + ' ' + J(k1.body));
    const k2 = await yukle(o2.token, kotaOdev, 'kota2.pdf', crypto.randomBytes(2000));
    kontrol("%80'i geçince müdüre ve sistem yöneticisine bildirim", k2.status === 200 &&
      await say(M, "Okulun dosya alanının %80'i doldu") === 1 && await say(A, "dosya alanının %80'i doldu") === 1, J(k2.body));
    const k3 = await yukle(o2.token, kotaOdev, 'kota3.pdf', crypto.randomBytes(1000));
    kontrol('%80 bildirimi bir kez gider (sonraki yüklemede yeniden gitmez)', k3.status === 200 &&
      await say(M, "dosya alanının %80'i doldu") === 1 && await say(A, "dosya alanının %80'i doldu") === 1, J(k3.body));
    const kalan = KOTA - (kullanim + alt + 3000);
    const dolu = await buyukBildir(o1.token, kotaOdev, kalan + 1000);
    kontrol('okulun alanı dolunca yükleme açık hatayla durur (507)', dolu.status === 507 && /Okulun dosya alanı doldu/.test(dolu.body),
      dolu.status + ' ' + dolu.body);
    let mDolu = 0, aDolu = 0;
    for (let i = 0; i < 20 && !(mDolu && aDolu); i++) {
      await new Promise(r => setTimeout(r, 150));
      mDolu = await say(M, 'Okulun dosya alanı doldu'); aDolu = await say(A, 'dosya alanı doldu (');
    }
    kontrol('dolunca müdüre ve sistem yöneticisine bildirim', mDolu === 1 && aDolu === 1, mDolu + ' ' + aDolu);
    const dolu2 = await buyukBildir(o1.token, kotaOdev, kalan + 1000);
    await new Promise(r => setTimeout(r, 400));
    kontrol('"doldu" bildirimi de bir kez gider', dolu2.status === 507 && await say(M, 'Okulun dosya alanı doldu') === 1 &&
      await say(A, 'dosya alanı doldu (') === 1, dolu2.status);
  }

  console.log('');
  console.log('GECTI: ' + gecti + '   KALDI: ' + kaldi);
  process.exit(kaldi ? 1 : 0);
})().catch(e => { console.error('TEST HATASI:', e); process.exit(1); });
