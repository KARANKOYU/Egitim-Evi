/* Servisçi, canlı konum, yaklaşma bildirimi ve telefon bildirimi aboneliği:
   - servisçi hesabını okul açar; yalnızca kendi okulunun servisine atanır;
   - aracın konumunu yalnızca o servisteki öğrenci, velisi, servisçisi ve
     yönetim görür; başka okulun servisçisi, başka öğrencinin velisi görmez;
   - servisçi ev konumunu görür ama değiştiremez; öğrenci listesinde T.C.,
     telefon gibi bilgi gelmez;
   - konumu yalnızca seferin servisçisi, yalnızca açık seferde yazar;
     servis başka servisçiye verilince eskisinin seferi kapanır;
   - eve 500 m ve 100 m kala öğrenciye ve velisine birer kez bildirim gider;
     GPS doğruluğu kötüyse gitmez;
   - telefon bildirimi aboneliği yalnızca bilinen push servislerinden kabul
     edilir, cihaz başka hesaba geçince eskisinden düşer, kişi başı 5 cihaz. */
const crypto = require('crypto');
const { iste, girisYap, hesapAc, okulHesabi, mudurYap } = require('./giris');

let gecti = 0, kaldi = 0;
function kontrol(ad, sart, detay) {
  if (sart) { gecti++; console.log('  GECTI  ' + ad); }
  else { kaldi++; console.log('  KALDI  ' + ad + (detay ? '  -> ' + detay : '')); }
}
const J = x => JSON.stringify(x).slice(0, 220);

/* Okuldan kuzeye m metre (enlemde 1 derece ~ 111 km). */
const EV = { enlem: 36.9, boylam: 30.7 };
const kuzey = m => ({ enlem: Math.round((EV.enlem + m / 111195) * 1e6) / 1e6, boylam: EV.boylam });

async function bildirimler(token) {
  const r = await iste('/api/notifications', 'GET', null, token);
  return (r.body.notifications || []).map(n => n.text || n.metin || '');
}

(async () => {
  const z = Date.now();
  const M = (await girisYap('mudur@test.com', 'Test1234!')).token;
  const A = (await girisYap('admin@egitimevi.com', 'admin123')).token;
  const o1 = await girisYap('ogrenci1', 'Test1234!');
  const o2 = await girisYap('ogrenci2', 'Test1234!');
  const mat = await girisYap('mat', 'Test1234!');

  const vK = 'servisveli' + z;
  await hesapAc({ fullName: 'Servis Veli', username: vK, email: vK + '@test.com' });
  let veli = await girisYap(vK, 'Test1234!');
  const kod = (await iste('/api/me', 'GET', null, o1.token)).body.user.code;
  await iste('/api/parent/link', 'POST', { code: kod }, veli.token);
  veli = await girisYap(vK, 'Test1234!');

  await okulHesabi(M, 'servisci', { fullName: 'Kemal Sürücü', username: 'kemal' + (z % 100000), password: 'Test1234!' });
  await okulHesabi(M, 'servisci', { fullName: 'Nuri Sürücü', username: 'nuri' + (z % 100000), password: 'Test1234!' });
  const s1 = await girisYap('kemal' + (z % 100000), 'Test1234!');
  const s2 = await girisYap('nuri' + (z % 100000), 'Test1234!');

  await hesapAc({ fullName: 'Konum Mudur', username: 'konum.mudur' + z, email: 'konummudur' + z + '@test.com' });
  const M2 = (await mudurYap('konum.mudur' + z, 'Test1234!', { schoolName: 'Konum Okulu ' + z, city: 'Ankara', district: 'Mamak' }, A)).token;
  await okulHesabi(M2, 'servisci', { fullName: 'Yabancı Sürücü', username: 'yabanci' + (z % 100000), password: 'Test1234!' });
  const s3 = await girisYap('yabanci' + (z % 100000), 'Test1234!');

  console.log('=== 1) SERVİSÇİ HESABI VE ATAMA ===');
  kontrol('servisçi rolüyle giriyor', s1.user.role === 'servisci' && !!s1.user.schoolId, J(s1.user));
  const listeS = await iste('/api/school/servisciler', 'GET', null, M);
  kontrol('müdür okulun servisçilerini görüyor (başka okulunkini değil)', listeS.status === 200 &&
    JSON.stringify(listeS.body).indexOf('Kemal') >= 0 && JSON.stringify(listeS.body).indexOf('Yabancı') < 0, J(listeS.body));
  const yanlis1 = await iste('/api/servis/kaydet', 'POST', { ad: 'Yanlış ' + z, soforId: s3.user.id }, M);
  const yanlis2 = await iste('/api/servis/kaydet', 'POST', { ad: 'Yanlış2 ' + z, soforId: o1.user.id }, M);
  kontrol('başka okulun servisçisi ya da öğrenci servisçi yapılamıyor', yanlis1.status === 400 && yanlis2.status === 400,
    yanlis1.status + ' ' + yanlis2.status);
  const sv = await iste('/api/servis/kaydet', 'POST', { ad: 'Konyaaltı ' + z, plaka: '07 KNM 12', soforId: s1.user.id }, M);
  kontrol('servis servisçiyle açıldı', sv.status === 200 && !!sv.body.id, J(sv.body));
  const servisId = sv.body.id;
  const y1 = await iste('/api/servis/ogrenci', 'POST', { servisId, ogrenciId: o1.user.id, durak: 'Park önü' }, M);
  const y2 = await iste('/api/servis/ogrenci', 'POST', { servisId, ogrenciId: o2.user.id }, M);
  kontrol('iki öğrenci servise yazıldı', y1.status === 200 && y2.status === 200, y1.status + ' ' + y2.status);
  const baskaS = await Promise.all(['/api/anketler', '/api/yemek', '/api/school/students', '/api/devamsizlik/derslerim',
    '/api/islem-kaydi', '/api/school/classes'].map(u => iste(u, 'GET', null, s1.token)));
  kontrol('servisçi okulun başka bölümlerine giremiyor', baskaS.every(r => r.status === 403 || r.status === 404),
    baskaS.map(r => r.status).join(' '));
  const hedef = await iste('/api/mesajlar/hedefler', 'GET', null, s1.token);
  kontrol('servisçi yönetimin mesajını okur ama okul rehberini görmez', hedef.status === 200 && hedef.body.kisiler.length === 0 &&
    hedef.body.topluIzin === false, J(hedef.body));

  console.log('=== 2) OKUL VE EV KONUMU ===');
  const okK = await iste('/api/school/konum', 'POST', { enlem: 36.88, boylam: 30.7 }, M);
  const okK2 = await iste('/api/school/konum', 'POST', { enlem: 36.88, boylam: 30.7 }, mat.token);
  const okK3 = await iste('/api/school/konum', 'POST', { enlem: '36.88', boylam: 30.7 }, M);
  kontrol('okul konumunu müdür koyuyor; öğretmen koyamıyor; metin sayı kabul edilmiyor',
    okK.status === 200 && okK2.status === 403 && okK3.status === 400, okK.status + ' ' + okK2.status + ' ' + okK3.status);
  const ev1 = await iste('/api/servis/ev', 'POST', EV, o1.token);
  kontrol('öğrenci kendi evini işaretliyor', ev1.status === 200, J(ev1.body));
  const evV = await iste('/api/servis/ev', 'POST', { ogrenciId: o2.user.id, enlem: 36.8, boylam: 30.6 }, veli.token);
  const evS = await iste('/api/servis/ev', 'POST', { ogrenciId: o1.user.id, enlem: 36.8, boylam: 30.6 }, s1.token);
  const evX = await iste('/api/servis/ev', 'POST', { ogrenciId: o1.user.id, enlem: 36.8, boylam: 30.6 }, s3.token);
  kontrol('başka çocuğun velisi, servisçi, başka okul evi değiştiremiyor', evV.status === 403 && evS.status === 403 && evX.status === 403,
    evV.status + ' ' + evS.status + ' ' + evX.status);
  const bozuk = await Promise.all([{ enlem: 'abc', boylam: 30 }, { enlem: {}, boylam: 30 }, { enlem: 91, boylam: 30 },
    { enlem: 0, boylam: 0 }, { enlem: [36.9], boylam: [30.7] }, { enlem: Infinity, boylam: 30 }]
    .map(b => iste('/api/servis/ev', 'POST', b, o2.token)));
  kontrol('bozuk koordinat reddediliyor (500 yok)', bozuk.every(r => r.status === 400), bozuk.map(r => r.status).join(' '));

  console.log('=== 3) HARİTA YETKİSİ ===');
  const h1 = await iste('/api/servis/harita', 'GET', null, o1.token);
  kontrol('öğrenci: okul, ev, servis var; sefer yok', h1.status === 200 && h1.body.okul && h1.body.okul.enlem === 36.88 &&
    h1.body.ev && h1.body.ev.enlem === 36.9 && h1.body.servis && h1.body.sefer === null, J(h1.body));
  const hBaska = await iste('/api/servis/harita?ogrenci=' + o1.user.id, 'GET', null, o2.token);
  kontrol('öğrenci ?ogrenci= ile başkasının haritasını açamıyor (kendi haritası gelir)',
    hBaska.status === 200 && hBaska.body.ogrenci !== h1.body.ogrenci && !hBaska.body.ev, J(hBaska.body));
  const hV = await iste('/api/servis/harita?ogrenci=' + o1.user.id, 'GET', null, veli.token);
  const hV2 = await iste('/api/servis/harita?ogrenci=' + o2.user.id, 'GET', null, veli.token);
  kontrol('veli yalnızca kendi çocuğunun haritasını görüyor', hV.status === 200 && hV2.status === 403, hV.status + ' ' + hV2.status);
  const hS = await iste('/api/servis/harita?ogrenci=' + o1.user.id, 'GET', null, s1.token);
  const hS2 = await iste('/api/servis/harita?ogrenci=' + o1.user.id, 'GET', null, s2.token);
  const hS3 = await iste('/api/servis/harita?ogrenci=' + o1.user.id, 'GET', null, s3.token);
  const hT = await iste('/api/servis/harita?ogrenci=' + o1.user.id, 'GET', null, mat.token);
  kontrol('servisçi yalnızca kendi servisinin öğrencisini görüyor, evi düzenleyemiyor', hS.status === 200 &&
    hS.body.evDuzenleyebilir === false && hS2.status === 403 && hS3.status === 403, hS.status + ' ' + hS2.status + ' ' + hS3.status);
  kontrol('servis yetkisi olmayan öğretmen görmüyor', hT.status === 403, String(hT.status));

  console.log('=== 4) SERVİSÇİ EKRANI ===');
  const sf = await iste('/api/servis/seferim', 'GET', null, s1.token);
  const sv1 = sf.body.servisler && sf.body.servisler[0];
  kontrol('servisçi kendi servisini ve öğrencilerini görüyor', sf.status === 200 && sf.body.servisler.length === 1 &&
    sv1.ogrenciler.length === 2, J(sf.body));
  const alanlar = sv1 ? [...new Set(sv1.ogrenciler.flatMap(o => Object.keys(o)))].sort().join(',') : '';
  kontrol('öğrenci satırında yalnızca ad, sınıf, durak, ev (id, T.C., telefon yok)', alanlar === 'ad,durak,ev,sinif', alanlar);
  const sfBos = await iste('/api/servis/seferim', 'GET', null, s2.token);
  const sfO = await iste('/api/servis/seferim', 'GET', null, o1.token);
  kontrol('atanmamış servisçide liste boş; öğrenci giremiyor', sfBos.status === 200 && sfBos.body.servisler.length === 0 &&
    sfO.status === 403, sfBos.status + ' ' + sfO.status);

  console.log('=== 5) SEFER VE KONUM ===');
  const bas2 = await iste('/api/servis/sefer-basla', 'POST', { servisId, yon: 'donus' }, s2.token);
  const basO = await iste('/api/servis/sefer-basla', 'POST', { servisId, yon: 'donus' }, M);
  kontrol('başkasının servisinde sefer başlatılamıyor', bas2.status === 403 && basO.status === 403, bas2.status + ' ' + basO.status);
  const bas = await iste('/api/servis/sefer-basla', 'POST', { servisId, yon: 'donus' }, s1.token);
  const seferId = bas.body.sefer && bas.body.sefer.id;
  kontrol('servisçi seferi başlattı', bas.status === 200 && !!seferId, J(bas.body));
  const kS2 = await iste('/api/servis/konum', 'POST', Object.assign({ seferId, dogruluk: 10 }, kuzey(5000)), s2.token);
  kontrol('başka servisçi bu sefere konum yazamıyor', kS2.status === 409, String(kS2.status));
  const once = (await bildirimler(o1.token)).length;
  const k1 = await iste('/api/servis/konum', 'POST', Object.assign({ seferId, dogruluk: 12 }, kuzey(5000)), s1.token);
  const h2 = await iste('/api/servis/harita', 'GET', null, o1.token);
  kontrol('konum yazıldı; öğrenci aracı haritada görüyor', k1.status === 200 && h2.body.sefer && h2.body.sefer.konum &&
    Math.abs(h2.body.sefer.konum.enlem - kuzey(5000).enlem) < 1e-6, J(h2.body.sefer));
  const hV3 = await iste('/api/servis/harita?ogrenci=' + o1.user.id, 'GET', null, veli.token);
  kontrol('veli de aracı görüyor', hV3.status === 200 && hV3.body.sefer && !!hV3.body.sefer.konum, J(hV3.body.sefer));
  kontrol('5 km uzakta bildirim yok', (await bildirimler(o1.token)).length === once);

  await iste('/api/servis/konum', 'POST', Object.assign({ seferId, dogruluk: 15 }, kuzey(400)), s1.token);
  const b1 = await bildirimler(o1.token);
  const bV = await bildirimler(veli.token);
  kontrol('400 m: öğrenciye "yaklaşıyor" bildirimi gitti', b1.length === once + 1 && /yaklaşıyor/.test(b1[0]), J(b1.slice(0, 2)));
  kontrol('velisine de çocuğun adıyla gitti', bV.some(t => /yaklaşıyor/.test(t) && t.indexOf(o1.user.fullName) === 0), J(bV.slice(0, 2)));
  await iste('/api/servis/konum', 'POST', Object.assign({ seferId, dogruluk: 15 }, kuzey(350)), s1.token);
  kontrol('aynı eşik ikinci kez bildirilmiyor', (await bildirimler(o1.token)).length === once + 1);
  await iste('/api/servis/konum', 'POST', Object.assign({ seferId, dogruluk: 400 }, kuzey(50)), s1.token);
  kontrol('GPS doğruluğu kötüyken (400 m) 100 m bildirimi gitmiyor', (await bildirimler(o1.token)).length === once + 1);
  await iste('/api/servis/konum', 'POST', Object.assign({ seferId, dogruluk: 8 }, kuzey(50)), s1.token);
  const b3 = await bildirimler(o1.token);
  kontrol('50 m: "100 metreden yakın" bildirimi gitti', b3.length === once + 2 && /100 metreden yakın/.test(b3[0]), J(b3.slice(0, 2)));
  const o2Bil = await bildirimler(o2.token);
  kontrol('evi işaretsiz öğrenciye yaklaşma bildirimi gitmiyor', !o2Bil.some(t => /Servis evine/.test(t)), J(o2Bil.slice(0, 3)));
  const kBoz = await Promise.all([{ seferId, enlem: 'x', boylam: 1 }, { seferId: { $ne: 1 }, enlem: 36.9, boylam: 30.7 },
    { seferId: 'yok', enlem: 36.9, boylam: 30.7 }].map(b => iste('/api/servis/konum', 'POST', b, s1.token)));
  kontrol('bozuk konum ve bilinmeyen sefer reddediliyor', kBoz[0].status === 400 && kBoz[1].status === 409 && kBoz[2].status === 409,
    kBoz.map(r => r.status).join(' '));

  console.log('=== 6) SERVİSÇİ DEĞİŞİNCE ===');
  const deg = await iste('/api/servis/kaydet', 'POST', { id: servisId, ad: 'Konyaaltı ' + z, plaka: '07 KNM 12', soforId: s2.user.id }, M);
  kontrol('servis ikinci servisçiye verildi', deg.status === 200, J(deg.body));
  const kEski = await iste('/api/servis/konum', 'POST', Object.assign({ seferId, dogruluk: 8 }, kuzey(30)), s1.token);
  const h4 = await iste('/api/servis/harita', 'GET', null, o1.token);
  kontrol('eski servisçinin seferi kapandı, konum yazamıyor, haritada araç yok', kEski.status === 409 && h4.body.sefer === null,
    kEski.status + ' ' + J(h4.body.sefer));
  const sfEski = await iste('/api/servis/seferim', 'GET', null, s1.token);
  kontrol('eski servisçi artık bu servisi görmüyor', sfEski.body.servisler.length === 0, J(sfEski.body));
  const bas3 = await iste('/api/servis/sefer-basla', 'POST', { servisId, yon: 'gidis' }, s2.token);
  const sefer2 = bas3.body.sefer && bas3.body.sefer.id;
  await iste('/api/servis/konum', 'POST', Object.assign({ seferId: sefer2, dogruluk: 8 }, kuzey(3000)), s2.token);
  const bit = await iste('/api/servis/sefer-bitir', 'POST', { seferId: sefer2 }, s2.token);
  const h5 = await iste('/api/servis/harita', 'GET', null, o1.token);
  kontrol('sefer bitince konum paylaşılmıyor', bit.status === 200 && h5.body.sefer === null, J(h5.body.sefer));

  const bas4 = await iste('/api/servis/sefer-basla', 'POST', { servisId, yon: 'gidis' }, s2.token);
  await iste('/api/servis/konum', 'POST', Object.assign({ seferId: bas4.body.sefer.id, dogruluk: 8 }, kuzey(3000)), s2.token);
  const sil = await iste('/api/school/hesap-sil', 'POST', { id: s2.user.id, onay: true }, M);
  const h6 = await iste('/api/servis/harita', 'GET', null, o1.token);
  kontrol('servisçi hesabı silinince araç konumu gösterilmiyor', sil.status === 200 && (!h6.body.sefer || !h6.body.sefer.konum),
    sil.status + ' ' + J(h6.body.sefer));
  const hz = [];
  for (let i = 0; i < 70; i++) hz.push(iste('/api/servis/konum', 'POST', { seferId: 'yok', enlem: 36.9, boylam: 30.7 }, s1.token));
  const hzKod = (await Promise.all(hz)).map(r => r.status);
  kontrol('konum dakikada 60 ile sınırlı', hzKod.filter(k => k === 429).length >= 5, hzKod.filter(k => k === 429).length + ' adet 429');

  console.log('=== 7) TELEFON BİLDİRİMİ ABONELİĞİ ===');
  const an = await iste('/api/push/anahtar', 'GET', null, o1.token);
  const anY = await iste('/api/push/anahtar', 'GET', null, null);
  kontrol('açık anahtar giriş yapana veriliyor', an.status === 200 && /^[A-Za-z0-9_-]{87}$/.test(an.body.anahtar) && anY.status === 401,
    an.status + ' ' + anY.status);
  const abone = () => {
    const e = crypto.createECDH('prime256v1'); e.generateKeys();
    return { endpoint: 'https://fcm.googleapis.com/fcm/send/' + crypto.randomBytes(12).toString('hex'),
      keys: { p256dh: e.getPublicKey().toString('base64url'), auth: crypto.randomBytes(16).toString('base64url') } };
  };
  const a1 = abone();
  const ab = await iste('/api/push/abone', 'POST', a1, o1.token);
  kontrol('geçerli abonelik yazıldı', ab.status === 200, J(ab.body));
  const kotu = await Promise.all([
    Object.assign({}, a1, { endpoint: 'https://127.0.0.1/x' }),
    Object.assign({}, a1, { endpoint: 'http://fcm.googleapis.com/fcm/send/x' }),
    Object.assign({}, a1, { endpoint: 'https://fcm.googleapis.com.saldiri.net/x' }),
    Object.assign({}, a1, { endpoint: 'https://fcm.googleapis.com/' + 'x'.repeat(1100) }),
    Object.assign({}, a1, { endpoint: ['https://fcm.googleapis.com/x'] }),
    Object.assign({}, a1, { keys: { p256dh: 'kisa', auth: a1.keys.auth } }),
    Object.assign({}, a1, { keys: 'yok' })
  ].map(b => iste('/api/push/abone', 'POST', b, o1.token)));
  kontrol('iç ağ, http, sahte alan, uzun adres, bozuk anahtar reddediliyor', kotu.every(r => r.status === 400), kotu.map(r => r.status).join(' '));
  const d1 = await iste('/api/push/durum', 'POST', { endpoint: a1.endpoint }, o1.token);
  const d2 = await iste('/api/push/durum', 'POST', { endpoint: a1.endpoint }, o2.token);
  kontrol('abonelik sahibine "benim", başkasına değil', d1.body.benim === true && d2.body.benim === false, J(d1.body) + J(d2.body));
  await iste('/api/push/abone', 'POST', a1, o2.token);
  const d3 = await iste('/api/push/durum', 'POST', { endpoint: a1.endpoint }, o1.token);
  const d4 = await iste('/api/push/durum', 'POST', { endpoint: a1.endpoint }, o2.token);
  kontrol('aynı cihaz başka hesaba geçince eskisinden düşüyor', d3.body.benim === false && d4.body.benim === true, J(d3.body) + J(d4.body));
  const ip0 = await iste('/api/push/iptal', 'POST', { endpoint: a1.endpoint }, o1.token);
  const d5 = await iste('/api/push/durum', 'POST', { endpoint: a1.endpoint }, o2.token);
  kontrol('başkasının aboneliğini iptal edemiyor', ip0.status === 200 && d5.body.benim === true);
  const ip = await iste('/api/push/iptal', 'POST', { endpoint: a1.endpoint }, o2.token);
  const d6 = await iste('/api/push/durum', 'POST', { endpoint: a1.endpoint }, o2.token);
  kontrol('kendi aboneliğini iptal ediyor', ip.status === 200 && d6.body.benim === false);
  const cok = [];
  for (let i = 0; i < 6; i++) { const a = abone(); cok.push(a); await iste('/api/push/abone', 'POST', a, mat.token); }
  const ilk = await iste('/api/push/durum', 'POST', { endpoint: cok[0].endpoint }, mat.token);
  const son = await iste('/api/push/durum', 'POST', { endpoint: cok[5].endpoint }, mat.token);
  kontrol('kişi başına en fazla 5 cihaz (en eskisi düşüyor)', ilk.body.benim === false && son.body.benim === true, J(ilk.body) + J(son.body));
  const rK = 'pushrolsuz' + z;
  await hesapAc({ fullName: 'Push Rolsuz', username: rK, email: rK + '@test.com' });
  const rol0 = await girisYap(rK, 'Test1234!');
  const abR = await iste('/api/push/abone', 'POST', abone(), rol0.token);
  kontrol('okula bağlı olmayan veli adayı da abone olabiliyor', abR.status === 200, J(abR.body));
  const abS = await iste('/api/push/abone', 'POST', abone(), s1.token);
  kontrol('servisçi de abone olabiliyor', abS.status === 200, J(abS.body));

  console.log();
  console.log('  GECTI: ' + gecti + '   KALDI: ' + kaldi);
  process.exit(kaldi ? 1 : 0);
})().catch(e => { console.log('  TEST HATASI: ' + e.stack); process.exit(1); });
