/* Eğitim Evi Aile: çocuğun telefonu (konum, ekran süresi, sınır bildirimi).
   - telefonu yalnızca öğrenci, kendi açık onayıyla bağlar; anahtar yalnızca cihaz uçlarına yarar;
   - konum ve kullanım doğrulanır (aralık, zaman, paket adı, sayı sınırları);
   - veli ayar ve sınır seçer; sınır aşılınca veliye günde bir kez bildirim;
   - okul (müdür, öğretmen) ve bağlı olmayan veli göremez; bağlantı kaldırılınca anahtar çalışmaz. */
const { iste, girisYap, hesapAc, BASE } = require('./giris');

let gecti = 0, kaldi = 0;
function kontrol(ad, sart, detay) {
  if (sart) { gecti++; console.log('  GECTI  ' + ad); }
  else { kaldi++; console.log('  KALDI  ' + ad + (detay ? '  -> ' + detay : '')); }
}
const J = x => String(JSON.stringify(x)).slice(0, 220);
const trBugun = () => new Date(Date.now() + 3 * 3600 * 1000).toISOString().slice(0, 10);

async function cihaz(yol, yontem, govde, anahtar) {
  const r = await fetch(BASE + '/api/aile/cihaz/' + yol, {
    method: yontem, headers: Object.assign({ 'Content-Type': 'application/json' }, anahtar === undefined ? {} : { 'X-Aile-Cihaz': anahtar }),
    body: govde ? JSON.stringify(govde) : undefined
  });
  let body = {};
  try { body = await r.json(); } catch (e) { /* boş */ }
  return { status: r.status, body };
}

(async () => {
  const z = Date.now().toString(36);
  const M = (await girisYap('mudur@test.com', 'Test1234!')).token;
  const O = (await girisYap('mat@test.com', 'Test1234!')).token;
  const S = await girisYap('ogrenci1@test.com', 'Test1234!');
  const s = (await iste('/api/me', 'GET', null, S.token)).body.user;
  const vK = 'aveli' + z;
  await hesapAc({ fullName: 'Aile Veli', username: vK, email: vK + '@test.com' });
  const V = (await girisYap(vK, 'Test1234!')).token;
  await iste('/api/parent/link', 'POST', { code: s.code }, V);
  const yK = 'yabanci' + z;
  await hesapAc({ fullName: 'Yabancı Veli', username: yK, email: yK + '@test.com' });
  const Y = (await girisYap(yK, 'Test1234!')).token;

  console.log('=== 1) TELEFONU BAĞLAMA ===');
  const onaysiz = await iste('/api/aile/cihaz', 'POST', { ad: 'Deneme', platform: 'android' }, S.token);
  kontrol('onay vermeden bağlanamaz', onaysiz.status === 400, J(onaysiz));
  const veliBaglar = await iste('/api/aile/cihaz', 'POST', { ad: 'Deneme', onay: true }, V);
  kontrol('veli kendi hesabıyla telefonu bağlayamaz (çocuğun hesabı gerekir)', veliBaglar.status === 403, 'status ' + veliBaglar.status);
  const bag = await iste('/api/aile/cihaz', 'POST', { ad: 'Samsung A51', platform: 'android', surum: '13', onay: true }, S.token);
  const anahtar = bag.body.cihazAnahtari;
  kontrol('öğrenci onayla bağladı, 64 haneli anahtar ve ayar geldi', bag.status === 200 && /^[a-f0-9]{64}$/.test(anahtar || '') &&
    bag.body.ayar && bag.body.ayar.wifiDk === 5 && bag.body.ayar.mobilDk === 15, J(bag.body));
  const vb = JSON.stringify((await iste('/api/notifications', 'GET', null, V)).body);
  kontrol('veliye "telefonunu bağladı" bildirimi', /telefonunu \(Samsung A51\) Eğitim Evi Aile/.test(vb), vb.slice(0, 200));
  const hesapla = await iste('/api/me', 'GET', null, anahtar);
  kontrol('cihaz anahtarı oturum yerine geçmez (hesaba giriş vermez)', hesapla.status === 401 || !hesapla.body.user, 'status ' + hesapla.status);

  console.log('=== 2) CİHAZ UÇLARI ===');
  kontrol('anahtarsız 401', (await cihaz('ayar', 'GET')).status === 401);
  kontrol('yanlış anahtar 401', (await cihaz('ayar', 'GET', null, 'a'.repeat(64))).status === 401);
  kontrol('biçimsiz anahtar 401', (await cihaz('ayar', 'GET', null, "' OR 1=1 --")).status === 401);
  const ay = await cihaz('ayar', 'GET', null, anahtar);
  kontrol('ayar okunuyor', ay.status === 200 && ay.body.ayar.konumAcik === true, J(ay.body));
  const simdi = Date.now();
  const konumlar = [
    { enlem: 39.92, boylam: 32.85, dogruluk: 18, zaman: simdi - 20 * 60000, ag: 'wifi', pil: 80 },
    { enlem: 39.93, boylam: 32.86, dogruluk: 25, zaman: simdi - 5 * 60000, ag: 'mobil', pil: 78 },
    { enlem: 200, boylam: 32, zaman: simdi - 60000 },                              // geçersiz enlem
    { enlem: 39.9, boylam: 32.8, zaman: simdi - 8 * 24 * 3600 * 1000 },          // 7 günden eski
    { enlem: 39.9, boylam: 32.8, zaman: simdi + 60 * 60000 },                    // gelecek
    { enlem: '39.9', boylam: 32.8, zaman: 'dün' },                                // zaman bozuk
    'metin', null
  ];
  const k1 = await cihaz('konum', 'POST', { konumlar }, anahtar);
  kontrol('konum: yalnızca geçerli 2 konum alındı', k1.status === 200 && k1.body.alinan === 2, J(k1.body));
  const k2 = await cihaz('konum', 'POST', { konumlar: konumlar.slice(0, 2) }, anahtar);
  kontrol('aynı zaman damgası iki kez yazılmaz', k2.body.alinan === 0, J(k2.body));
  const cok = await cihaz('konum', 'POST', { konumlar: Array.from({ length: 600 }, (x, i) => ({ enlem: 1, boylam: 1, zaman: simdi - 60 * 60000 - i * 1000 })) }, anahtar);
  kontrol('bir istekte en fazla 500 konum işlenir', cok.status === 200 && cok.body.alinan === 500, J(cok.body));
  const bugun = trBugun();
  const ku = await cihaz('kullanim', 'POST', { gunler: [
    { gun: bugun, uygulamalar: [
      { paket: 'com.google.android.youtube', ad: 'YouTube', dakika: 95 },
      { paket: 'com.instagram.android', ad: 'Instagram', dakika: 50 },
      { paket: 'kötü paket adı', ad: 'x', dakika: 5 },
      { paket: 'com.oyun', ad: '<img src=x onerror=alert(1)>', dakika: 20 },
      { paket: 'com.fazla', ad: 'Fazla', dakika: 5000 }
    ] },
    { gun: '2020-01-01', uygulamalar: [{ paket: 'com.eski', ad: 'Eski', dakika: 10 }] }
  ] }, anahtar);
  kontrol('kullanım: bozuk paket, 1440 üstü ve eski gün atıldı', ku.status === 200 && ku.body.alinan === 3, J(ku.body));

  console.log('=== 3) VELİ: ÖZET VE AYAR ===');
  const oz = await iste('/api/aile/ozet?studentId=' + s.id, 'GET', null, V);
  kontrol('veli son konumu görüyor (en yeni, mobil)', oz.status === 200 && oz.body.sonKonum && oz.body.sonKonum.ag === 'mobil' &&
    Math.abs(oz.body.sonKonum.enlem - 39.93) < 1e-9, J(oz.body.sonKonum));
  kontrol('bugünün süreleri büyükten küçüğe', oz.body.kullanim && oz.body.kullanim.bugun[0].paket === 'com.google.android.youtube' &&
    oz.body.kullanim.bugun.length === 3, J(oz.body.kullanim && oz.body.kullanim.bugun));
  kontrol('8 günlük toplam çizelgesi (bugün 165 dk)', oz.body.kullanim.gunler.length === 8 &&
    oz.body.kullanim.gunler[7].gun === bugun && oz.body.kullanim.gunler[7].toplam === 165, J(oz.body.kullanim.gunler.slice(-2)));
  kontrol('uygulama adı düz metin olarak saklanır (ön yüz kaçışla basar)', oz.body.kullanim.bugun.some(u => u.ad.indexOf('<img') === 0));
  kontrol('bağlı cihaz görünüyor', oz.body.cihazlar.length === 1 && oz.body.cihazlar[0].ad === 'Samsung A51' && !!oz.body.cihazlar[0].sonGorulme);
  kontrol('bağlı olmayan veli 403', (await iste('/api/aile/ozet?studentId=' + s.id, 'GET', null, Y)).status === 403);
  kontrol('müdür (okul) göremez 403', (await iste('/api/aile/ozet?studentId=' + s.id, 'GET', null, M)).status === 403);
  kontrol('öğretmen göremez 403', (await iste('/api/aile/ozet?studentId=' + s.id, 'GET', null, O)).status === 403);
  kontrol('öğrenci kendi özetine bakamaz 403', (await iste('/api/aile/ozet?studentId=' + s.id, 'GET', null, S.token)).status === 403);

  const kotu1 = await iste('/api/aile/ayar', 'POST', { studentId: s.id, wifiDk: 2, mobilDk: 15 }, V);
  kontrol('geçersiz aralık 400', kotu1.status === 400, J(kotu1.body));
  const kotu2 = await iste('/api/aile/ayar', 'POST', { studentId: s.id, wifiDk: 1, mobilDk: 15, toplamSinir: 3 }, V);
  kontrol('5 dakikadan kısa sınır 400', kotu2.status === 400);
  const kotu3 = await iste('/api/aile/ayar', 'POST', { studentId: s.id, wifiDk: 1, mobilDk: 15, sinirlar: [{ paket: 'a b', dakika: 30 }] }, V);
  kontrol('bozuk paket adıyla sınır 400', kotu3.status === 400);
  const yabanci = await iste('/api/aile/ayar', 'POST', { studentId: s.id, wifiDk: 1, mobilDk: 15 }, Y);
  kontrol('bağlı olmayan veli ayar yazamaz 403', yabanci.status === 403);
  const ayar = await iste('/api/aile/ayar', 'POST', { studentId: s.id, wifiDk: 1, mobilDk: 30, konumAcik: true, kullanimAcik: true,
    toplamSinir: 120, sinirlar: [{ paket: 'com.google.android.youtube', ad: 'YouTube', dakika: 60 }, { paket: 'com.instagram.android', ad: 'Instagram', dakika: 60 }] }, V);
  kontrol('ayar ve iki sınır kaydedildi', ayar.status === 200 && ayar.body.ayar.wifiDk === 1 && ayar.body.ayar.toplamSinir === 120 &&
    ayar.body.sinirlar.length === 2, J(ayar.body));
  const ay2 = await cihaz('ayar', 'GET', null, anahtar);
  kontrol('telefon yeni aralığı alıyor (Wi-Fi 1, mobil 30 dk)', ay2.body.ayar.wifiDk === 1 && ay2.body.ayar.mobilDk === 30, J(ay2.body));

  console.log('=== 4) SINIR AŞILINCA VELİYE BİLDİRİM (GÜNDE BİR KEZ) ===');
  await cihaz('kullanim', 'POST', { gunler: [{ gun: bugun, uygulamalar: [
    { paket: 'com.google.android.youtube', ad: 'YouTube', dakika: 100 },
    { paket: 'com.instagram.android', ad: 'Instagram', dakika: 40 }] }] }, anahtar);
  let vl = ((await iste('/api/notifications', 'GET', null, V)).body.notifications || []).map(n => n.text);
  kontrol('toplam sınır bildirimi ("toplam 2 sa 40 dk ... sınır 2 sa")', vl.filter(t => /telefonda toplam 2 sa 40 dk geçirdi \(sınır 2 sa\)/.test(t)).length === 1, J(vl.slice(0, 3)));
  kontrol('uygulama sınırı bildirimi (YouTube)', vl.filter(t => /YouTube uygulamasında 1 sa 40 dk geçirdi \(sınır 1 sa\)/.test(t)).length === 1, J(vl.slice(0, 3)));
  kontrol('sınırı geçmeyen uygulama için bildirim yok (Instagram 40 dk < 60)', !vl.some(t => /Instagram uygulamasında/.test(t)));
  await cihaz('kullanim', 'POST', { gunler: [{ gun: bugun, uygulamalar: [{ paket: 'com.google.android.youtube', ad: 'YouTube', dakika: 130 }] }] }, anahtar);
  vl = ((await iste('/api/notifications', 'GET', null, V)).body.notifications || []).map(n => n.text);
  kontrol('aynı gün ikinci kez bildirim gitmez', vl.filter(t => /YouTube uygulamasında/.test(t)).length === 1 &&
    vl.filter(t => /telefonda toplam/.test(t)).length === 1);
  kontrol('bildirim veliyi Aile sayfasına götürür', ((await iste('/api/notifications', 'GET', null, V)).body.notifications || [])
    .some(n => /YouTube/.test(n.text) && n.link === '#/aile?c=' + s.id));

  console.log('=== 5) PAYLAŞIM KAPALI / BAĞLANTI KALDIRMA ===');
  await iste('/api/aile/ayar', 'POST', { studentId: s.id, wifiDk: 5, mobilDk: 15, konumAcik: false, kullanimAcik: true }, V);
  const kap = await cihaz('konum', 'POST', { konumlar: [{ enlem: 40, boylam: 30, zaman: Date.now() - 1000 }] }, anahtar);
  kontrol('veli konumu kapatınca konum alınmaz', kap.status === 200 && kap.body.alinan === 0 && kap.body.kapali === true, J(kap.body));
  const cid = (await iste('/api/aile/ozet?studentId=' + s.id, 'GET', null, V)).body.cihazlar[0].id;
  const yabKaldir = await iste('/api/aile/cihaz-kaldir', 'POST', { studentId: s.id, cihazId: cid }, Y);
  kontrol('bağlı olmayan veli kaldıramaz 403', yabKaldir.status === 403);
  const kaldir = await iste('/api/aile/cihaz-kaldir', 'POST', { studentId: s.id, cihazId: cid }, V);
  kontrol('veli telefonun bağlantısını kaldırdı', kaldir.status === 200);
  kontrol('kaldırılan anahtar artık 401', (await cihaz('ayar', 'GET', null, anahtar)).status === 401);
  const bag2 = await iste('/api/aile/cihaz', 'POST', { ad: 'Yeni telefon', onay: true }, S.token);
  const sil = await cihaz('sil', 'POST', {}, bag2.body.cihazAnahtari);
  kontrol('öğrenci uygulamadan bağlantıyı kaldırabilir', sil.status === 200 && (await cihaz('ayar', 'GET', null, bag2.body.cihazAnahtari)).status === 401);

  console.log();
  console.log('  GECTI: ' + gecti + '   KALDI: ' + kaldi);
  process.exit(kaldi ? 1 : 0);
})().catch(e => { console.error('TEST HATASI:', e.message, e.stack); process.exit(1); });
