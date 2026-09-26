/* Veli bağları:
   - öğretmen/müdür aynı zamanda veli olabilir (çocuğunun verisini görür, rolü değişmez);
   - okul veliyi T.C. kimlik no ya da kullanıcı adıyla öğrenciye bağlar, kaldırır;
   - rolsüz hesap bağlanınca veli olur; öğrenci hesabı veli yapılamaz;
   - arama sonucunda velinin tam adı değil baş harfleri görünür;
   - başka okulun müdürü bizim öğrencimize veli bağlayamaz. */
const { iste, girisYap, hesapAc, mudurYap, okulHesabi } = require('./giris');
const { kisilikGec } = require('./giris');

let gecti = 0, kaldi = 0;
function kontrol(ad, sart, detay) {
  if (sart) { gecti++; console.log('  GECTI  ' + ad); }
  else { kaldi++; console.log('  KALDI  ' + ad + (detay ? '  -> ' + detay : '')); }
}
const J = x => JSON.stringify(x).slice(0, 160);

(async () => {
  const z = Date.now();
  const M = (await girisYap('mudur@test.com', 'Test1234!')).token;
  const A = (await girisYap('admin@egitimevi.com', 'admin123')).token;
  const ogrenciler = (await iste('/api/school/students', 'GET', null, M)).body.students || [];
  const o1 = ogrenciler.find(s => s.username === 'ogrenci1');
  const o2 = ogrenciler.find(s => s.username === 'ogrenci2');

  console.log('=== 1) ÖĞRETMEN AYNI ZAMANDA VELİ ===');
  const mat = await girisYap('mat', 'Test1234!');
  const once = await iste('/api/me', 'GET', null, mat.token);
  kontrol('öğretmenin başta çocuğu yok', (once.body.children || []).length === 0);
  /* Ekrandaki 5'erli biçim (boşluklu) yapıştırılsa da olur. */
  const bosluklu = ' ' + o2.code.slice(0, 5) + ' ' + o2.code.slice(5, 10) + ' ' + o2.code.slice(10) + ' ';
  const bag = await iste('/api/parent/link', 'POST', { code: bosluklu }, mat.token);
  kontrol('öğretmen veli koduyla (boşluklu yazılmış) çocuğunu bağladı', bag.status === 200 && (bag.body.children || []).length === 1, J(bag.body));
  /* Çocuk yetişkin hesabına bağlanır; öğretmen rolü değişmez. Velilik ayrı
     bir portaldır (menüde "Veli · çocuğun adı"). */
  const matMe = await iste('/api/me', 'GET', null, mat.token);
  const matKis = await iste('/api/kisilikler', 'GET', null, mat.token);
  kontrol('öğretmen rolü değişmedi; çocuk seçim ekranında', matMe.body.user.role === 'teacher' &&
    matKis.body.cocuklar.some(c => c.id === o2.id), J(matMe.body.user.role) + J(matKis.body.cocuklar));
  const matVeli = await kisilikGec(mat.token, 'veli', o2.id);
  const ilerleyis = await iste('/api/progress?studentId=' + o2.id, 'GET', null, matVeli.token);
  kontrol('veli olarak geçince çocuğunun ilerleyişini görüyor', ilerleyis.status === 200, 'status ' + ilerleyis.status);
  const devam = await iste('/api/devamsizlik/ogrenci?studentId=' + o2.id, 'GET', null, matVeli.token);
  kontrol('çocuğunun devamsızlığını görüyor', devam.status === 200, 'status ' + devam.status);
  const coz = await iste('/api/parent/unlink', 'POST', { studentId: o2.id }, matVeli.token);
  kontrol('bağını kaldırabiliyor', coz.status === 200 && (coz.body.children || []).length === 0, J(coz.body));

  console.log('=== 2) OKUL VELİYİ T.C. İLE BAĞLAR ===');
  const vK = 'tcveli' + z;
  await hesapAc({ fullName: 'Tc Veli', username: vK, email: vK + '@test.com', tc: '10000000146' });
  const bulTc = await iste('/api/school/veli-bul?kimlik=100 000 001 46', 'GET', null, M);
  kontrol('T.C. ile bulundu (boşluklu yazılsa da), ad maskeli', bulTc.status === 200 && bulTc.body.kisi.durum === 'uygun' &&
    bulTc.body.kisi.fullName === 'Tc* Ve**', J(bulTc.body));
  const bozukTc = await iste('/api/school/veli-bul?kimlik=12345678901', 'GET', null, M);
  kontrol('geçersiz T.C. reddedildi', bozukTc.status === 400, 'status ' + bozukTc.status);
  const yokTc = await iste('/api/school/veli-bul?kimlik=11111111110', 'GET', null, M);
  kontrol('kayıtlı olmayan T.C. 404', yokTc.status === 404, 'status ' + yokTc.status);
  const ogrBul = await iste('/api/school/veli-bul?kimlik=ogrenci2', 'GET', null, M);
  kontrol('öğrenci hesabı veli olamaz', ogrBul.status === 200 && ogrBul.body.kisi.durum === 'uygun-degil' && !ogrBul.body.kisi.id,
    J(ogrBul.body));
  const bagla = await iste('/api/school/veli-bagla', 'POST', { studentId: o1.id, veliId: bulTc.body.kisi.id }, M);
  kontrol('okul veliyi bağladı', bagla.status === 200, J(bagla.body));
  const tekrar = await iste('/api/school/veli-bagla', 'POST', { studentId: o1.id, veliId: bulTc.body.kisi.id }, M);
  kontrol('aynı bağ ikinci kez kurulmuyor', tekrar.status === 400, 'status ' + tekrar.status);
  const veliG = await girisYap(vK, 'Test1234!');
  kontrol('rolsüz hesap veli oldu, çocuğu görünüyor', veliG.user.role === 'parent' &&
    (veliG.children || []).some(c => c.id === o1.id), J(veliG.user.role));
  const bildirim = await iste('/api/notifications', 'GET', null, veliG.token);
  kontrol('veliye bildirim gitti', (bildirim.body.notifications || []).some(n => /velisi olarak ekledi/.test(n.text)));
  const liste = await iste('/api/school/ogrenci-velileri?studentId=' + o1.id, 'GET', null, M);
  kontrol('müdür öğrencinin velilerini görüyor', (liste.body.veliler || []).some(v => v.username === vK), J(liste.body));
  const velininIlerleyisi = await iste('/api/progress?studentId=' + o1.id, 'GET', null, veliG.token);
  kontrol('veli çocuğunun ilerleyişini görüyor', velininIlerleyisi.status === 200);

  console.log('=== 3) ÖĞRETMEN DE VELİ OLARAK BAĞLANIR (kullanıcı adıyla) ===');
  const fenBul = await iste('/api/school/veli-bul?kimlik=FEN', 'GET', null, M);
  const fenBagla = await iste('/api/school/veli-bagla', 'POST', { studentId: o2.id, veliId: fenBul.body.kisi.id }, M);
  const fen = await girisYap('fen', 'Test1234!');
  const fenKis = await iste('/api/kisilikler', 'GET', null, fen.token);
  kontrol('öğretmen veli olarak bağlandı: girişte seçim ekranı (öğretmen rolü + çocuk)', fenBagla.status === 200 &&
    fen.kisilikSec === true && fenKis.body.roller.some(r => r.rol === 'teacher') && fenKis.body.cocuklar.some(c => c.id === o2.id),
    J(fen) + J(fenKis.body));

  console.log('=== 4) VELİ KULLANICI ADIYLA DA BULUNUR ===');
  const vBul = await iste('/api/school/veli-bul?kimlik=' + vK, 'GET', null, M);
  kontrol('veli kullanıcı adıyla da bulunuyor', vBul.status === 200 && vBul.body.kisi.durum === 'uygun', J(vBul.body));

  console.log('=== 5) BAĞ KALDIRMA VE BAŞKA OKUL ===');
  const kaldir = await iste('/api/school/veli-coz', 'POST', { studentId: o1.id, veliId: vBul.body.kisi.id }, M);
  const artik = await iste('/api/progress?studentId=' + o1.id, 'GET', null, veliG.token);
  kontrol('okul bağı kaldırınca artık göremiyor', kaldir.status === 200 && artik.status === 403, 'status ' + artik.status);
  await hesapAc({ fullName: 'Baska Mudur', username: 'baska.mudur' + z, email: 'baskamudur' + z + '@test.com' });
  const M2 = (await mudurYap('baska.mudur' + z, 'Test1234!',
    { schoolName: 'Baska Okul ' + z, city: 'Ankara', district: 'Mamak' }, A)).token;
  const yabanci = await iste('/api/school/veli-bagla', 'POST', { studentId: o1.id, veliId: fenBul.body.kisi.id }, M2);
  kontrol('başka okulun müdürü bizim öğrencimize veli bağlayamıyor', yabanci.status === 404, 'status ' + yabanci.status);
  const baskaOgrt = await okulHesabi(M2, 'teacher', { fullName: 'Baska Ogretmen', username: 'baska.ogrt' + z,
    email: 'baskaogrt' + z + '@test.com' }, false);
  /* Başka okulun öğretmeni de bir yetişkindir: yetişkin hesabı bulunur (adı
     maskeli); öğretmen rol satırının kendisi veli yapılamaz. */
  const baskaBul = await iste('/api/school/veli-bul?kimlik=baska.ogrt' + z, 'GET', null, M);
  const baskaBagla = await iste('/api/school/veli-bagla', 'POST', { studentId: o1.id, veliId: baskaOgrt.id }, M);
  kontrol('başka okulun öğretmeninin yetişkin hesabı bulunur; rol satırı veli yapılamaz', baskaBul.status === 200 &&
    baskaBul.body.kisi.id !== baskaOgrt.id && /\*/.test(baskaBul.body.kisi.fullName) && baskaBagla.status === 400,
    baskaBul.status + ' ' + J(baskaBul.body) + ' ' + baskaBagla.status);
  /* Rol değişince eski oturum kapanır: öğretmen rolüyle yeniden gir. */
  const matOgretmen = await girisYap('mat', 'Test1234!');
  const ogrtDener = await iste('/api/school/veli-bul?kimlik=fen', 'GET', null, matOgretmen.token);
  kontrol('yetkisiz öğretmen veli arayamıyor', ogrtDener.status === 403, 'status ' + ogrtDener.status);

  console.log('');
  console.log('GECTI: ' + gecti + '   KALDI: ' + kaldi);
  process.exit(kaldi ? 1 : 0);
})().catch(e => { console.error('TEST HATASI:', e); process.exit(1); });
