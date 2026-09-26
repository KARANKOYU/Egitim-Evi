const { iste, girisYap } = require('./giris');

let gecti = 0, kaldi = 0;
function kontrol(ad, sart, detay) {
  if (sart) { gecti++; console.log('  GECTI  ' + ad); }
  else { kaldi++; console.log('  KALDI  ' + ad + (detay ? '  -> ' + detay : '')); }
}

(async () => {
  const mudur = await girisYap('mudur@test.com', 'Test1234!');
  const T = mudur.token;

  /* Sınıf ve ders kur */
  const s1 = await iste('/api/school/class', 'POST', { name: '9-A' }, T);
  const s2 = await iste('/api/school/class', 'POST', { name: '9-B' }, T);
  const a = s1.body.class.id, b = s2.body.class.id;

  /* Ogretmen listesini e-postasiyla birlikte /school/teachers ucundan al */
  const ogrtL = await iste('/api/school/teachers', 'GET', null, T);
  const onayli = ogrtL.body.teachers.filter(t => t.status === 'approved');
  const zumre = onayli.find(t => t.username === 'fen');
  zumre.email = 'fen@test.com';   // öğretmenin giriş e-postası kendi yetişkin hesabında

  const dMat = await iste('/api/school/lesson', 'POST',
    { classId: a, subject: 'Matematik', weeklyHours: 5 }, T);
  const dTur = await iste('/api/school/lesson', 'POST',
    { classId: a, subject: 'Türkçe', weeklyHours: 6 }, T);
  await iste('/api/school/lesson', 'POST', { classId: b, subject: 'Matematik', weeklyHours: 5 }, T);

  /* Öğrencileri yerleştir */
  const ogr = await iste('/api/school/students', 'GET', null, T);
  const ogrenciler = ogr.body.students.slice(0, 4);
  for (let i = 0; i < ogrenciler.length; i++) {
    await iste('/api/school/class-assign', 'POST',
      { studentId: ogrenciler[i].id, classId: i < 2 ? a : b }, T);
  }

  /* Yetkiler iki rolün birleşimi: hazır Öğretmen rolünde açık olan yetkiyi ek
     rolün kapsamı daraltmaz. Kapsamı sınamak için ödev verme ve derse atanma
     önce hazır rolden kaldırılır (testin sonunda geri konur). */
  const roller0 = await iste('/api/school/roles', 'GET', null, T);
  const ogretmenRolu = (roller0.body.roles || []).find(r => r.tur === 'ogretmen');
  const temelYetkiler = ogretmenRolu.permissions.slice();
  await iste('/api/school/role-update', 'POST', { roleId: ogretmenRolu.id,
    permissions: temelYetkiler.filter(p => p !== 'odev.ver' && p !== 'derse-atanabilir') }, T);

  console.log('=== 0) BIRLESIM: HAZIR ROLDEKI YETKIYI EK ROL DARALTMAZ ===');
  const birlesimRol = await iste('/api/school/role', 'POST', { name: 'Birleşim Deneme', permissions: ['sinav.not-gir'],
    kapsam: { 'sinav.not-gir': { dersler: ['Türkçe'], siniflar: ['*'] } } }, T);
  kontrol('hazir rolde de olan yetkiyle ek rol acildi', birlesimRol.status === 200, JSON.stringify(birlesimRol.body).slice(0, 100));

  console.log('=== 1) KAPSAMLI ROL OLUSTURMA ===');
  const rol = await iste('/api/school/role', 'POST', {
    name: 'Zümre Başkanı Test',
    permissions: ['derse-atanabilir', 'odev.ver', 'program.duzenle', 'ders.yonet'],
    kapsam: {
      'derse-atanabilir': { dersler: ['Matematik'], siniflar: ['*'] },
      'odev.ver': { dersler: ['Matematik'], siniflar: [a] },
      'program.duzenle': { dersler: ['*'], siniflar: [a] },
      'ders.yonet': { dersler: ['*'], siniflar: [a] }
    }
  }, T);
  kontrol('kapsamli rol olusturuldu', rol.status === 200, JSON.stringify(rol.body).slice(0, 120));
  kontrol('kapsam kaydedildi', !!(rol.body.role.kapsam && rol.body.role.kapsam['odev.ver']),
    JSON.stringify(rol.body.role.kapsam));
  kontrol('ders kapsami dogru', rol.body.role.kapsam['odev.ver'].dersler.join() === 'Matematik');
  kontrol('sinif kapsami dogru', rol.body.role.kapsam['odev.ver'].siniflar.join() === a);

  const rolId = rol.body.role.id;
  await iste('/api/school/role-assign', 'POST', { userId: zumre.id, roleId: rolId }, T);
  /* Odev hedefleri ogretmenin derslerinden turuyor: 9-A Matematik'e ata. */
  await iste('/api/school/lesson-update', 'POST',
    { lessonId: dMat.body.lesson.id, teacherId: zumre.id }, T);

  console.log('=== 2) KAPSAM ICI ERISIM ===');
  const z = await girisYap(zumre.email, 'Test1234!');
  const ZT = z.token;

  const icProgram = await iste('/api/school/schedule?classId=' + a, 'GET', null, ZT);
  kontrol('kapsam ici sinifin programini goruyor', icProgram.status === 200, 'status ' + icProgram.status);

  const icDersler = await iste('/api/school/lessons?classId=' + a, 'GET', null, ZT);
  kontrol('kapsam ici sinifin derslerini goruyor', icDersler.status === 200, 'status ' + icDersler.status);

  const ekle = await iste('/api/school/schedule-add', 'POST',
    { classId: a, day: 6, lessonId: dMat.body.lesson.id, start: '16:00', end: '16:40' }, ZT);
  kontrol('kapsam ici sinifa ders saati ekliyor', ekle.status === 200,
    JSON.stringify(ekle.body).slice(0, 80));

  console.log('=== 3) KAPSAM DISI ENGELLENIYOR ===');
  const disProgram = await iste('/api/school/schedule?classId=' + b, 'GET', null, ZT);
  kontrol('kapsam disi sinifin programini goremiyor', disProgram.status === 403, 'status ' + disProgram.status);

  const disDersler = await iste('/api/school/lessons?classId=' + b, 'GET', null, ZT);
  kontrol('kapsam disi sinifin derslerini goremiyor', disDersler.status === 403, 'status ' + disDersler.status);

  const disEkle = await iste('/api/school/lesson', 'POST',
    { classId: b, subject: 'Müzik', weeklyHours: 2 }, ZT);
  kontrol('kapsam disi sinifa ders ekleyemiyor', disEkle.status === 403, 'status ' + disEkle.status);

  console.log('=== 4) ODEV KAPSAMI ===');
  const hedef = await iste('/api/assignments/hedefler', 'GET', null, ZT);
  const aSinif = hedef.body.classes.find(c => c.name === '9-A');
  const idler = aSinif ? aSinif.students.map(s => s.id) : [];
  kontrol('hedef listesi geliyor', idler.length > 0, 'ogrenci ' + idler.length);

  const odevIzinli = await iste('/api/assignments', 'POST',
    { subject: 'Matematik', title: 'Kapsam ici odev', studentIds: idler, endAt: '2026-12-31' }, ZT);
  kontrol('kapsam ici derse odev veriyor', odevIzinli.status === 200,
    JSON.stringify(odevIzinli.body).slice(0, 80));

  const odevYasak = await iste('/api/assignments', 'POST',
    { subject: 'Türkçe', title: 'Kapsam disi odev', studentIds: idler, endAt: '2026-12-31' }, ZT);
  kontrol('kapsam disi derse odev veremiyor', odevYasak.status === 400, JSON.stringify(odevYasak.body));

  console.log('=== 5) DERSE ATANMA KAPSAMI ===');
  const ataYasak = await iste('/api/school/lesson-update', 'POST',
    { lessonId: dTur.body.lesson.id, teacherId: zumre.id }, T);
  kontrol('kapsam disi derse atanamiyor', ataYasak.status === 400, JSON.stringify(ataYasak.body));

  const ataIzinli = await iste('/api/school/lesson-update', 'POST',
    { lessonId: dMat.body.lesson.id, teacherId: zumre.id }, T);
  kontrol('kapsam ici derse atanabiliyor', ataIzinli.status === 200,
    JSON.stringify(ataIzinli.body).slice(0, 80));

  console.log('=== 6) KAPSAM GENISLETME ===');
  await iste('/api/school/role-update', 'POST', {
    roleId: rolId,
    permissions: ['derse-atanabilir', 'odev.ver', 'program.duzenle', 'ders.yonet'],
    kapsam: { 'odev.ver': { dersler: ['*'], siniflar: ['*'] } }
  }, T);
  const z2 = await girisYap(zumre.email, 'Test1234!');
  const odevArtik = await iste('/api/assignments', 'POST',
    { subject: 'Türkçe', title: 'Artik serbest', studentIds: idler, endAt: '2026-12-31' }, z2.token);
  kontrol('kapsam genisleyince odev verebiliyor', odevArtik.status === 200,
    JSON.stringify(odevArtik.body).slice(0, 80));

  console.log('=== 7) MUDUR KAPSAMDAN ETKILENMIYOR ===');
  const mudurProgram = await iste('/api/school/schedule?classId=' + b, 'GET', null, T);
  kontrol('mudur her sinifi goruyor', mudurProgram.status === 200, 'status ' + mudurProgram.status);

  console.log('=== 8) MUDUR DERS ODEVLERI ===');
  const dersOdev = await iste('/api/school/assignments', 'GET', null, T);
  kontrol('ders bazli odev listesi geliyor', dersOdev.status === 200 && dersOdev.body.lessons.length > 0,
    'ders ' + (dersOdev.body.lessons || []).length);
  /* Liste yalnızca sayıları verir; ödevler ders açılınca (?lessonId=) gelir. */
  const dolu = (dersOdev.body.lessons || []).find(l => l.aktif + l.gecmis > 0);
  kontrol('derslerin odev sayilari geliyor', !!dolu,
    dolu ? dolu.subject + ' -> ' + (dolu.aktif + dolu.gecmis) : 'yok');
  kontrol('liste odevlerin kendisini tasimiyor', !(dolu && dolu.assignments));
  const dersDetay = dolu ? await iste('/api/school/assignments?lessonId=' + dolu.lessonId, 'GET', null, T) : { body: {} };
  const detayOdev = dersDetay.body.assignments || [];
  kontrol('ders acilinca odevleri geliyor, sayi tutuyor', detayOdev.length === (dolu ? dolu.aktif + dolu.gecmis : -1),
    detayOdev.length + ' / ' + (dolu ? dolu.aktif + dolu.gecmis : '-'));
  kontrol('odevi veren ogretmen yaziyor', !!(detayOdev[0] && detayOdev[0].teacherName),
    detayOdev[0] && detayOdev[0].teacherName);

  /* Hazır rol eski hâline döner. */
  const geri = await iste('/api/school/role-update', 'POST', { roleId: ogretmenRolu.id, permissions: temelYetkiler }, T);
  kontrol('hazir Ogretmen rolu eski yetkilerine dondu', geri.status === 200, JSON.stringify(geri.body).slice(0, 80));

  console.log();
  console.log('  GECTI: ' + gecti + '   KALDI: ' + kaldi);
  process.exit(kaldi ? 1 : 0);
})().catch(e => { console.error('TEST HATASI:', e.message, e.stack); process.exit(1); });
