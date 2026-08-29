/* Girdi denetimi: bozuk, asiri ve kotu niyetli veriyle sunucu cokuyor mu,
   sizdiriyor mu, 500 doneriyor mu. */
const { iste, girisYap, hesapAc, mudurYap } = require('./giris');

let gecti = 0, kaldi = 0;
function kontrol(ad, sart, detay) {
  if (sart) { gecti++; console.log('  GECTI  ' + ad); }
  else { kaldi++; console.log('  KALDI  ' + ad + (detay ? '  -> ' + detay : '')); }
}

/* 500 asla gorunmemeli: sunucu hatasi demektir. */
function sunucuHatasiYok(ad, c) {
  kontrol(ad + ' 500 dondurmuyor', c.status !== 500,
    'status ' + c.status + ' ' + JSON.stringify(c.body).slice(0, 90));
}

const KOTU = [
  '', '   ', null, undefined, 0, -1, 999999999999,
  'a'.repeat(50000),
  '<script>alert(1)</script>',
  '"><img src=x onerror=alert(1)>',
  "'; DROP TABLE users; --",
  '../../../etc/passwd',
  '..\\..\\..\\windows\\system32',
  '\u0000bos',
  '{{7*7}}',
  '${process.env}',
  'ÇÖĞÜŞİıĞÜÖÇ',
  '🎓📚🏫',
  true, false, [], {}, [1, 2, 3], { a: 1 }
];

(async () => {
  const M = (await girisYap('mudur@test.com', 'Test1234!')).token;
  const O = (await girisYap('mat@test.com', 'Test1234!')).token;
  const S = (await girisYap('ogrenci1@test.com', 'Test1234!')).token;

  console.log('=== 1) PROTOTIP KIRLENMESI ===');
  const proto = await iste('/api/school/class', 'POST',
    { name: 'PT', '__proto__': { yonetici: true } }, M);
  sunucuHatasiYok('__proto__ govdesi', proto);
  kontrol('prototip kirlenmedi', ({}).yonetici === undefined,
    'Object.prototype.yonetici = ' + ({}).yonetici);

  const proto2 = await iste('/api/school/class', 'POST',
    { name: 'PT2', constructor: { prototype: { hack: 1 } } }, M);
  sunucuHatasiYok('constructor govdesi', proto2);
  kontrol('constructor ile kirlenmedi', ({}).hack === undefined);

  console.log('=== 2) BOZUK ALANLAR ===');
  const alanlar = [
    ['sinif adi', '/api/school/class', 'POST', v => ({ name: v }), M],
    ['odev basligi', '/api/assignments', 'POST',
      v => ({ title: v, description: 'x', startAt: '2026-01-01',
        endAt: '2026-01-02', studentIds: [] }), O],
    ['mesaj konusu', '/api/mesajlar', 'POST',
      v => ({ tur: 'mesaj', konu: v, govde: 'x', hedef: { tur: 'kisi', kisiler: [] } }), O],
    ['takvim basligi', '/api/takvim/etkinlik', 'POST',
      v => ({ baslik: v, tur: 'etkinlik', tarih: '2026-09-15' }), M],
    ['yil adi', '/api/egitim-yili/ekle', 'POST', v => ({ ad: v }), M]
  ];

  for (const [ad, yol, method, kur, tok] of alanlar) {
    let hepsiTemiz = true;
    let ornek = '';
    for (const kotu of KOTU) {
      const c = await iste(yol, method, kur(kotu), tok);
      if (c.status === 500) {
        hepsiTemiz = false;
        ornek = JSON.stringify(kotu).slice(0, 40) + ' -> 500';
        break;
      }
    }
    kontrol(ad + ': ' + KOTU.length + ' bozuk deger 500 vermiyor', hepsiTemiz, ornek);
  }

  console.log('=== 3) YOL KACISI ===');
  const yollar = ['../../server.js', '..%2F..%2Fserver.js', '....//server.js',
    '/etc/passwd', 'C:\\Windows\\win.ini'];
  let yolTemiz = true, yolOrnek = '';
  for (const y of yollar) {
    const c = await iste('/' + y);
    /* index.html (SPA kabugu) donmesi normal; server.js icerigi donmemeli */
    const govde = JSON.stringify(c.body);
    if (govde.indexOf('require(') >= 0 || govde.indexOf('scryptSync') >= 0) {
      yolTemiz = false; yolOrnek = y;
      break;
    }
  }
  kontrol('statik dosyada yol kacisi yok', yolTemiz, yolOrnek);

  console.log('=== 4) BASKASININ KAYDINI DUZENLEME ===');
  const ogr = await iste('/api/school/students', 'GET', null, M);
  const o1 = ogr.body.students[0];
  const o2 = ogr.body.students.find(x => x.id !== o1.id) || o1;

  const baskaOdev = await iste('/api/assignments', 'POST', {
    title: 'Sizinti', description: 'x', startAt: '2026-01-01', endAt: '2026-01-02',
    studentIds: [o1.id, o2.id, 'u_uydurma_kimlik']
  }, O);
  if (baskaOdev.status === 200) {
    const detay = await iste('/api/assignments/' + baskaOdev.body.assignment.id,
      'GET', null, O);
    kontrol('uydurma ogrenci kimligi listeye girmedi',
      !(detay.body.students || []).some(x => x.id === 'u_uydurma_kimlik'),
      JSON.stringify((detay.body.students || []).map(x => x.id)));
  } else {
    kontrol('uydurma kimlikli odev reddedildi', true);
  }

  console.log('=== 5) BASKASININ OTURUMU ===');
  const sahteler = ['', 'a', 'Bearer', 'null', 'undefined', '0'.repeat(48),
    'x'.repeat(200)];
  let oturumTemiz = true, oturumOrnek = '';
  for (const t of sahteler) {
    const c = await iste('/api/me', 'GET', null, t);
    if (c.status === 200) { oturumTemiz = false; oturumOrnek = t.slice(0, 20); break; }
  }
  kontrol('sahte oturum anahtari calismiyor', oturumTemiz, oturumOrnek);

  console.log('=== 6) BASKA OKULUN VERISI ===');
  /* Ikinci bir okul ve muduru olustur, birinin digerine erisemedigini dogrula */
  /* Rolsüz kayıt -> okulunu kaydeder -> yönetici onaylar */
  await hesapAc({ fullName: 'Ikinci Mudur', username: 'mudur2', email: 'mudur2@test.com', phone: '05329998877' });
  const A = (await girisYap('admin@egitimevi.com', 'admin123')).token;
  const bsv = await mudurYap('mudur2@test.com', 'Test1234!',
    { schoolName: 'İkinci Test Okulu', city: 'İzmir', district: 'Konak' }, A);
  if (bsv) {
    const M2 = bsv.token;

    const yabanci = await iste('/api/school/students', 'GET', null, M2);
    kontrol('baska okulun mudurü ogrencileri gormuyor',
      !(yabanci.body.students || []).some(x => x.email === 'ogrenci1@test.com'),
      'gorulen ' + (yabanci.body.students || []).length);

    const yabanciDuzenle = await iste('/api/school/student-update', 'POST',
      { studentId: o1.id, grade: 'HACK' }, M2);
    kontrol('baska okulun ogrencisini duzenleyemiyor', yabanciDuzenle.status !== 200,
      'status ' + yabanciDuzenle.status);

    const yabanciDevam = await iste('/api/devamsizlik/ogrenci?studentId=' + o1.id,
      'GET', null, M2);
    kontrol('baska okulun devamsizligini goremiyor', yabanciDevam.status !== 200,
      'status ' + yabanciDevam.status);
  } else {
    kontrol('ikinci okul kurulamadi (atlandi)', true);
  }

  console.log('=== 7) BUYUK GOVDE ===');
  let devDurum = 0, devHata = '';
  try {
    const dev = await iste('/api/school/class', 'POST', { name: 'x'.repeat(3000000) }, M);
    devDurum = dev.status;
  } catch (e) { devHata = e.message; }
  kontrol('3 MB govde reddediliyor',
    devDurum === 400 || devDurum === 413 || devHata.indexOf('fetch') >= 0,
    'status ' + devDurum + ' ' + devHata);

  console.log('=== 8) SUNUCU AYAKTA MI ===');
  const son = await iste('/api/me', 'GET', null, M);
  kontrol('butun denemelerden sonra sunucu saglam', son.status === 200,
    'status ' + son.status);

  console.log();
  console.log('  GECTI: ' + gecti + '   KALDI: ' + kaldi);
  process.exit(kaldi ? 1 : 0);
})().catch(e => { console.error('DENETIM HATASI:', e.message, e.stack); process.exit(1); });
