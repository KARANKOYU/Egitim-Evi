const { iste, girisYap } = require('./giris');

let gecti = 0, kaldi = 0;
function kontrol(ad, sart, detay) {
  if (sart) { gecti++; console.log('  GECTI  ' + ad); }
  else { kaldi++; console.log('  KALDI  ' + ad + (detay ? '  -> ' + detay : '')); }
}

(async () => {
  const admin = await girisYap('admin@egitimevi.com', 'admin123');
  const T = admin.token;

  /* Yeni tablolar da yedeğe girsin: anket (oyla), yemek, servis, kulüp, teslim dosyası. */
  const M0 = (await girisYap('mudur@test.com', 'Test1234!')).token;
  const mat = await girisYap('mat', 'Test1234!');
  const o1 = await girisYap('ogrenci1', 'Test1234!');
  const yarin = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
  const anket = await iste('/api/anketler', 'POST', { soru: 'Yedek anketi', secenekler: ['Bir', 'İki'],
    hedef: { tur: 'rol', roller: ['student'] }, bitisGun: yarin, gizli: true }, M0);
  const anketSec = (await iste('/api/anketler', 'GET', null, o1.token)).body.gelen.find(a => a.id === anket.body.id).secenekler[1].id;
  await iste('/api/anketler/oy', 'POST', { id: anket.body.id, secenekId: anketSec }, o1.token);
  await iste('/api/yemek', 'POST', { gunler: [{ tarih: yarin, menu: 'Yedek çorbası\nPilav', kalori: 700 }] }, M0);
  const servis = await iste('/api/servis/kaydet', 'POST', { ad: 'Yedek servisi', soforTel: '0532 000 11 22', sabah: '07:15' }, M0);
  await iste('/api/servis/ogrenci', 'POST', { servisId: servis.body.id, ogrenciId: o1.user.id, durak: 'Köşe' }, M0);
  const kulup = await iste('/api/kulupler/kaydet', 'POST', { ad: 'Yedek kulübü', danismanId: mat.user.id, kontenjan: 12 }, M0);
  await iste('/api/kulupler/katil', 'POST', { id: kulup.body.id }, o1.token);
  const odev = (await iste('/api/assignments', 'POST', { title: 'Yedek ödevi', subject: 'Matematik',
    studentIds: [o1.user.id], endAt: yarin }, mat.token)).body.assignment.id;
  const yukle = await fetch((process.env.EE_BASE || 'http://localhost:3000') + '/api/odev-dosya/yukle?odev=' + odev, {
    method: 'POST', body: Buffer.from('yedek dosyası'),
    headers: { Authorization: 'Bearer ' + o1.token, 'Content-Type': 'application/octet-stream', 'X-Dosya-Adi': 'yedek.txt' } });
  const dosyaId = (await yukle.json()).dosya.id;

  console.log('=== 1) YEDEK ALMA ===');
  const al = await iste('/api/admin/backup-now', 'POST', {}, T);
  kontrol('elle yedek alindi', al.status === 200 && !!al.body.yedek.ad,
    JSON.stringify(al.body.yedek));
  kontrol('yedek bos degil', al.body.yedek.boyut > 100, 'boyut ' + al.body.yedek.boyut);
  const yedekAd = al.body.yedek.ad;

  const liste = await iste('/api/admin/backups', 'GET', null, T);
  kontrol('liste geliyor', liste.status === 200 && liste.body.yedekler.length > 0,
    'adet ' + (liste.body.yedekler || []).length);
  kontrol('yeni yedek listede', liste.body.yedekler.some(y => y.ad === yedekAd));

  console.log('=== 2) INDIRME ===');
  const indir = await iste('/api/admin/backup-download?ad=' + encodeURIComponent(yedekAd), 'GET', null, T);
  kontrol('yedek indirilebiliyor', indir.status === 200, 'status ' + indir.status);
  kontrol('icerik gecerli JSON', Array.isArray(indir.body.users), 'kullanici ' +
    ((indir.body.users || []).length));

  console.log('=== 3) YOL KACISI ===');
  const kotu = await iste('/api/admin/backup-download?ad=' +
    encodeURIComponent('../../server.js'), 'GET', null, T);
  kontrol('yol kacisi engellendi', kotu.status === 400 || kotu.status === 404,
    'status ' + kotu.status);
  const kotu2 = await iste('/api/admin/backup-delete', 'POST', { ad: '../db.json' }, T);
  kontrol('silmede yol kacisi engellendi', kotu2.status === 400 || kotu2.status === 404,
    'status ' + kotu2.status);

  console.log('=== 4) YETKI ===');
  const mudur = await girisYap('mudur@test.com', 'Test1234!');
  const yasak = await iste('/api/admin/backups', 'GET', null, mudur.token);
  kontrol('mudur yedeklere erisemiyor', yasak.status === 403, 'status ' + yasak.status);
  const yasak2 = await iste('/api/admin/backup-now', 'POST', {}, mudur.token);
  kontrol('mudur yedek alamiyor', yasak2.status === 403, 'status ' + yasak2.status);

  console.log('=== 5) GERI YUKLEME ===');
  /* Once bir degisiklik yap: yeni sinif ac */
  const yeniSinif = await iste('/api/school/class', 'POST', { name: 'YEDEK-DENEME' }, mudur.token);
  kontrol('gecici sinif acildi', yeniSinif.status === 200);

  const geri = await iste('/api/admin/backup-restore', 'POST', { ad: yedekAd }, T);
  kontrol('geri yukleme calisti', geri.status === 200, JSON.stringify(geri.body).slice(0, 100));

  /* Geri yukleme sonrasi o sinif olmamali */
  const mudur2 = await girisYap('mudur@test.com', 'Test1234!');
  const siniflar = await iste('/api/school/classes', 'GET', null, mudur2.token);
  kontrol('yedekten sonraki degisiklik geri alindi',
    !siniflar.body.classes.some(c => c.name === 'YEDEK-DENEME'),
    (siniflar.body.classes || []).map(c => c.name).join(','));

  /* Geri alma kopyasi olusmus olmali */
  const liste2 = await iste('/api/admin/backups', 'GET', null, T);
  kontrol('geri-alma kopyasi olustu',
    liste2.body.yedekler.some(y => y.ad.indexOf('yedek-geri-alma-') === 0),
    liste2.body.yedekler.map(y => y.ad).join(' | ').slice(0, 120));

  console.log('=== 5b) YENİ TABLOLAR GERİ GELDİ ===');
  const M3 = (await girisYap('mudur@test.com', 'Test1234!')).token;
  const o1b = await girisYap('ogrenci1', 'Test1234!');
  const anketGeri = await iste('/api/anketler/sonuc?id=' + anket.body.id, 'GET', null, M3);
  kontrol('anket, gizliliği ve oyu geri geldi', anketGeri.status === 200 && anketGeri.body.anket.gizli === true &&
    anketGeri.body.anket.oySayisi === 1 && anketGeri.body.sayimlar === null, JSON.stringify(anketGeri.body).slice(0, 160));
  const yemekGeri = await iste('/api/yemek?bas=' + yarin, 'GET', null, o1b.token);
  kontrol('yemek listesi geri geldi', yemekGeri.body.okullar[0].gunler.some(g => g.menu === 'Yedek çorbası\nPilav' && g.kalori === 700),
    JSON.stringify(yemekGeri.body.okullar).slice(0, 160));
  const servisGeri = await iste('/api/servis', 'GET', null, o1b.token);
  kontrol('servis ve öğrencinin durağı geri geldi', !!servisGeri.body.benim && servisGeri.body.benim.durak === 'Köşe' &&
    servisGeri.body.benim.soforTel === '+905320001122' && servisGeri.body.benim.sabah === '07:15', JSON.stringify(servisGeri.body.benim));
  const kulupGeri = (await iste('/api/kulupler', 'GET', null, o1b.token)).body.kulupler.find(k => k.id === kulup.body.id);
  kontrol('kulüp, danışmanı ve üyeliği geri geldi', !!kulupGeri && kulupGeri.uyesin && kulupGeri.kontenjan === 12 &&
    kulupGeri.danisman === 'Ayşe Kaya', JSON.stringify(kulupGeri));
  const dosyaGeri = await iste('/api/odev-dosya?odev=' + odev, 'GET', null, o1b.token);
  kontrol('teslim dosyasının kaydı geri geldi', (dosyaGeri.body.dosyalar || []).some(d => d.id === dosyaId && d.ad === 'yedek.txt'),
    JSON.stringify(dosyaGeri.body).slice(0, 160));

  console.log('=== 6) BOZUK YEDEK ===');
  const sahte = await iste('/api/admin/backup-restore', 'POST', { ad: 'yedek-yok-boyle.json' }, T);
  kontrol('olmayan yedek reddedildi', sahte.status === 400, JSON.stringify(sahte.body));

  console.log('=== 7) SILME ===');
  const sil = await iste('/api/admin/backup-delete', 'POST', { ad: yedekAd }, T);
  kontrol('yedek silindi', sil.status === 200);
  kontrol('listeden dustu', !sil.body.yedekler.some(y => y.ad === yedekAd));

  console.log();
  console.log('  GECTI: ' + gecti + '   KALDI: ' + kaldi);
  process.exit(kaldi ? 1 : 0);
})().catch(e => { console.error('TEST HATASI:', e.message, e.stack); process.exit(1); });
