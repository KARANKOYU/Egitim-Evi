/* Toplu giriş bilgisi dağıtımı:
   - şifreleri sunucu üretir, yalnızca özetini saklar; liste bir kez döner;
   - varsayılan olarak yalnızca henüz giriş yapmamış öğrenciler seçilir;
   - eski şifre ve açık oturumlar geçersiz olur, öğrenciye bildirim gider;
   - yetkisiz öğretmen ve başka okulun sınıfı reddedilir. */
const { iste, girisYap, hesapAc, mudurYap, tcUret } = require('./giris');

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

  /* Seed öğrencilerinin şifresine dokunmamak için ayrı bir sınıf açılır. */
  const snf = (await iste('/api/school/class', 'POST', { name: '9-Z' }, M)).body['class'];
  const adlar = ['dagit.bir' + z, 'dagit.iki' + z, 'dagit.uc' + z];
  for (const [i, ka] of adlar.entries()) {
    await iste('/api/school/student-create', 'POST',
      { fullName: 'Dagitim Ogrenci' + ['a', 'b', 'c'][i], username: ka, password: 'Eski2026x', classId: snf.id, tc: tcUret() }, M);
  }

  console.log('=== 1) YETKİ VE DOĞRULAMA ===');
  const mat = await girisYap('mat', 'Test1234!');
  const yetkisiz = await iste('/api/school/giris-bilgisi', 'POST', { classId: snf.id, onay: true }, mat.token);
  kontrol('yetkisiz öğretmen dağıtamıyor', yetkisiz.status === 403, 'status ' + yetkisiz.status);
  const onaysiz = await iste('/api/school/giris-bilgisi', 'POST', { classId: snf.id }, M);
  kontrol('onay olmadan çalışmıyor', onaysiz.status === 400, 'status ' + onaysiz.status);
  await hesapAc({ fullName: 'Diger Mudur', username: 'diger.mudur' + z, email: 'digermudur' + z + '@test.com' });
  const M2 = (await mudurYap('diger.mudur' + z, 'Test1234!',
    { schoolName: 'Diger Okul ' + z, city: 'Ankara', district: 'Mamak' }, A)).token;
  const yabanci = await iste('/api/school/giris-bilgisi', 'POST', { classId: snf.id, onay: true }, M2);
  kontrol('başka okulun sınıfı reddedildi', yabanci.status === 400 && /Sınıf bulunamadı/.test(yabanci.body.error || ''),
    J(yabanci.body));

  console.log('=== 2) HENÜZ GİRMEMİŞLER ===');
  const ilk = await girisYap(adlar[0], 'Eski2026x');
  kontrol('birinci öğrenci eski şifreyle girdi', !!ilk.token);
  const liste = (await iste('/api/school/students', 'GET', null, M)).body.students;
  kontrol('öğrenci listesinde giriş bilgisi var', liste.find(s => s.username === adlar[0]).girisYapti === true &&
    liste.find(s => s.username === adlar[1]).girisYapti === false);

  const d = await iste('/api/school/giris-bilgisi', 'POST', { classId: snf.id, sadeceGirmeyen: true, onay: true }, M);
  kontrol('dağıtım yapıldı', d.status === 200 && d.body.adet === 2, J(d.body));
  kontrol('cevap önbelleğe alınmıyor', /no-store/.test(d.headers.get('cache-control') || ''));
  const satirlar = d.body.satirlar || [];
  kontrol('giriş yapmış öğrenci listede yok', !satirlar.some(s => s.kullaniciAdi === adlar[0]) &&
    satirlar.some(s => s.kullaniciAdi === adlar[1]) && satirlar.some(s => s.kullaniciAdi === adlar[2]));
  kontrol('şifreler okunaklı biçimde ve hepsi farklı', satirlar.every(s => /^[A-HJ-NP-Za-km-z]{8}[2-9]{2}$/.test(s.sifre)) &&
    new Set(satirlar.map(s => s.sifre)).size === satirlar.length, satirlar.map(s => s.sifre).join(','));
  kontrol("veli kodu 5'erli gruplar, arada boşluk", satirlar.every(s =>
    /^[A-Za-z][A-Za-z0-9!?#*+-]{4} [A-Za-z0-9!?#*+-]{5} [A-Za-z0-9!?#*+-]{5}$/.test(s.veliKodu)), satirlar.map(s => s.veliKodu).join(','));
  kontrol('sınıf adı satırda', satirlar.every(s => s.sinif === '9-Z'));
  kontrol('Excel dosyası (zip) geldi', typeof d.body.xlsx === 'string' && Buffer.from(d.body.xlsx, 'base64').slice(0, 2).toString() === 'PK');
  kontrol('cevapta şifre özeti ya da kimlik yok', !/scrypt|\$|"id"/.test(JSON.stringify(satirlar)));

  const ikinci = satirlar.find(s => s.kullaniciAdi === adlar[1]);
  const eski = await iste('/api/login', 'POST', { kimlik: adlar[1], password: 'Eski2026x' });
  kontrol('eski şifre artık çalışmıyor', eski.status === 401, 'status ' + eski.status);
  const yeni = await girisYap(adlar[1], ikinci.sifre);
  kontrol('yeni şifreyle giriş oluyor, kendi şifresini koyması isteniyor', !!yeni.token && yeni.user.sifreDegismeli === true,
    J(yeni.user));
  /* Okulun açtığı hesap ilk girişte aydınlatma metnini onaylar, şifresini değiştirir. */
  if (yeni.kvkkGuncel === false) await iste('/api/kvkk-onay', 'POST', { onay: true }, yeni.token);
  const kendi = await iste('/api/password', 'POST', { old: ikinci.sifre, new: 'Kendi2026x' }, yeni.token);
  kontrol('öğrenci kendi şifresini koydu', kendi.status === 200, J(kendi.body));
  const bildirim = await iste('/api/notifications', 'GET', null, yeni.token);
  kontrol('öğrenciye bildirim gitti', (bildirim.body.notifications || []).some(n => /yenilendi/.test(n.text)));
  const ilkHala = await iste('/api/me', 'GET', null, ilk.token);
  kontrol('şifresi değişmeyen öğrencinin oturumu açık', ilkHala.status === 200, 'status ' + ilkHala.status);

  console.log('=== 3) HERKES SEÇİLİRSE ===');
  const hepsi = await iste('/api/school/giris-bilgisi', 'POST', { classId: snf.id, sadeceGirmeyen: false, onay: true }, M);
  kontrol('bütün sınıf yenilendi', hepsi.status === 200 && hepsi.body.adet === 3, J(hepsi.body));
  const ilkSonra = await iste('/api/me', 'GET', null, ilk.token);
  kontrol('giriş yapmış öğrencinin açık oturumu kapandı', ilkSonra.status === 401, 'status ' + ilkSonra.status);
  const tekrar = await iste('/api/school/giris-bilgisi', 'POST', { classId: snf.id, sadeceGirmeyen: true, onay: true }, M);
  kontrol('yeni şifreyle girmeyenler yeniden seçilebiliyor', tekrar.status === 200 && tekrar.body.adet === 3, J(tekrar.body));
  const son = tekrar.body.satirlar.find(s => s.kullaniciAdi === adlar[2]);
  await girisYap(adlar[2], son.sifre);
  const bosSecim = await iste('/api/school/giris-bilgisi', 'POST', { classId: snf.id, sadeceGirmeyen: true, onay: true }, M);
  kontrol('giren öğrenci bir sonrakinde seçilmiyor', bosSecim.status === 200 && bosSecim.body.adet === 2 &&
    !bosSecim.body.satirlar.some(s => s.kullaniciAdi === adlar[2]), J(bosSecim.body));

  const kayit = await iste('/api/islem-kaydi', 'GET', null, M);
  kontrol('işlem kaydına yazıldı', kayit.status !== 200 ||
    JSON.stringify(kayit.body).indexOf('sifre.toplu-dagitildi') >= 0 || JSON.stringify(kayit.body).indexOf('Toplu giriş') >= 0,
    'status ' + kayit.status);

  console.log('');
  console.log('GECTI: ' + gecti + '   KALDI: ' + kaldi);
  process.exit(kaldi ? 1 : 0);
})().catch(e => { console.error('TEST HATASI:', e); process.exit(1); });
