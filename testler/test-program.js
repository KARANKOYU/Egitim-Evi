const { iste, girisYap } = require('./giris');

let gecti = 0, kaldi = 0;
function kontrol(ad, sart, detay) {
  if (sart) { gecti++; console.log('  GECTI  ' + ad); }
  else { kaldi++; console.log('  KALDI  ' + ad + (detay ? '  -> ' + detay : '')); }
}

(async () => {
  const mudur = await girisYap('mudur@test.com', 'Test1234!');
  const T = mudur.token;

  console.log('=== 1) SINIF OLUSTURMA ===');
  const s1 = await iste('/api/school/class', 'POST', { name: '7-A' }, T);
  const s2 = await iste('/api/school/class', 'POST', { name: '7-B' }, T);
  kontrol('7-A olusturuldu', s1.status === 200, JSON.stringify(s1.body));
  kontrol('7-B olusturuldu', s2.status === 200);
  const ayni = await iste('/api/school/class', 'POST', { name: '7-a' }, T);
  kontrol('ayni ad reddedildi (buyuk/kucuk fark etmez)', ayni.status === 400);
  const bos = await iste('/api/school/class', 'POST', { name: '' }, T);
  kontrol('bos ad reddedildi', bos.status === 400);

  const sinifA = s1.body.class.id, sinifB = s2.body.class.id;

  console.log('=== 2) OGRENCI ATAMA ===');
  const ogrenciler = await iste('/api/school/students', 'GET', null, T);
  const o1 = ogrenciler.body.students[0], o2 = ogrenciler.body.students[1];
  await iste('/api/school/class-assign', 'POST', { studentId: o1.id, classId: sinifA }, T);
  await iste('/api/school/class-assign', 'POST', { studentId: o2.id, classId: sinifB }, T);
  const liste = await iste('/api/school/classes', 'GET', null, T);
  const a = liste.body.classes.find(c => c.name === '7-A');
  kontrol('sinif mevcudu dogru', a && a.studentCount === 1, 'mevcut ' + (a && a.studentCount));
  kontrol('sinifsiz kalmadi', liste.body.sinifsiz === 0, 'sinifsiz ' + liste.body.sinifsiz);
  kontrol('program 7 gun', liste.body.gunSayisi === 7, 'gun ' + liste.body.gunSayisi);

  console.log('=== 3) DERS EKLEME ===');
  const d1 = await iste('/api/school/lesson', 'POST', { classId: sinifA, subject: 'Matematik', weeklyHours: 5 }, T);
  const d2 = await iste('/api/school/lesson', 'POST', { classId: sinifB, subject: 'Matematik', weeklyHours: 5 }, T);
  kontrol('7-A Matematik eklendi', d1.status === 200, JSON.stringify(d1.body));
  kontrol('7-B Matematik eklendi', d2.status === 200);
  const tekrar = await iste('/api/school/lesson', 'POST', { classId: sinifA, subject: 'Matematik' }, T);
  kontrol('ayni ders ikinci kez eklenemez', tekrar.status === 400);
  const gecersizDers = await iste('/api/school/lesson', 'POST', { classId: sinifA, subject: 'Simya' }, T);
  kontrol('listede olmayan ders reddedildi', gecersizDers.status === 400);

  const dersA = d1.body.lesson.id, dersB = d2.body.lesson.id;

  console.log('=== 4) OGRETMEN ATAMA ===');
  const bilgi = await iste('/api/school/lessons?classId=' + sinifA, 'GET', null, T);
  const mat = bilgi.body.teachers.find(t => /Ayşe/.test(t.fullName));
  kontrol('ogretmen listesi geliyor', bilgi.body.teachers.length > 0);
  const at1 = await iste('/api/school/lesson-update', 'POST', { lessonId: dersA, teacherId: mat.id }, T);
  const at2 = await iste('/api/school/lesson-update', 'POST', { lessonId: dersB, teacherId: mat.id }, T);
  kontrol('7-A ogretmeni atandi', at1.status === 200);
  kontrol('7-B ogretmeni atandi', at2.status === 200);
  const sahteOgr = await iste('/api/school/lesson-update', 'POST', { lessonId: dersA, teacherId: 'u_yok' }, T);
  kontrol('gecersiz ogretmen reddedildi', sahteOgr.status === 400);

  console.log('=== 5) SAAT ARALIGIYLA YERLESTIRME ===');
  const y1 = await iste('/api/school/schedule-add', 'POST',
    { classId: sinifA, day: 1, lessonId: dersA, start: '09:20', end: '10:00' }, T);
  kontrol('Pazartesi 09:20-10:00 eklendi', y1.status === 200, JSON.stringify(y1.body).slice(0, 100));
  kontrol('cakisma yok', y1.body.cakismalar.length === 0);
  const y2 = await iste('/api/school/schedule-add', 'POST',
    { classId: sinifA, day: 7, lessonId: dersA, start: '11:00', end: '11:40' }, T);
  kontrol('Pazar gunune de eklenebiliyor', y2.status === 200);

  console.log('=== 6) SAAT DOGRULAMA ===');
  const h1 = await iste('/api/school/schedule-add', 'POST',
    { classId: sinifA, day: 2, lessonId: dersA, start: '25:00', end: '26:00' }, T);
  kontrol('gecersiz saat reddedildi', h1.status === 400, JSON.stringify(h1.body));
  const h2 = await iste('/api/school/schedule-add', 'POST',
    { classId: sinifA, day: 2, lessonId: dersA, start: '10:00', end: '09:00' }, T);
  kontrol('bitis baslangictan once reddedildi', h2.status === 400);
  const h3 = await iste('/api/school/schedule-add', 'POST',
    { classId: sinifA, day: 9, lessonId: dersA, start: '10:00', end: '11:00' }, T);
  kontrol('gecersiz gun reddedildi', h3.status === 400);
  const h4 = await iste('/api/school/schedule-add', 'POST',
    { classId: sinifA, day: 2, lessonId: dersB, start: '10:00', end: '11:00' }, T);
  kontrol('baska sinifin dersi eklenemez', h4.status === 400);

  console.log('=== 7) CAKISMA (ayni ogretmen, kesisen saat) ===');
  const c1 = await iste('/api/school/schedule-add', 'POST',
    { classId: sinifB, day: 1, lessonId: dersB, start: '09:40', end: '10:20' }, T);
  kontrol('kesisen saat uyari veriyor', !!c1.body.uyari, JSON.stringify(c1.body.uyari));
  kontrol('uyari turu ogretmen', c1.body.uyari && c1.body.uyari.tur === 'ogretmen',
    c1.body.uyari && c1.body.uyari.tur);
  kontrol('cakisma listesine dustu', c1.body.cakismalar.length === 1, 'adet ' + c1.body.cakismalar.length);

  console.log('=== 8) BITISIK ARALIK CAKISMA DEGIL ===');
  await iste('/api/school/schedule-add', 'POST',
    { classId: sinifA, day: 3, lessonId: dersA, start: '08:00', end: '09:00' }, T);
  const b2 = await iste('/api/school/schedule-add', 'POST',
    { classId: sinifA, day: 3, lessonId: dersA, start: '09:00', end: '10:00' }, T);
  kontrol('bitisik aralik uyari vermiyor', !b2.body.uyari, JSON.stringify(b2.body.uyari));

  console.log('=== 9) DUZENLEME VE SILME ===');
  const kayit = y2.body.kayit.id;
  const dz = await iste('/api/school/schedule-update', 'POST',
    { scheduleId: kayit, start: '13:00', end: '13:45' }, T);
  kontrol('saat guncellendi', dz.status === 200 && dz.body.kayit.start === '13:00',
    JSON.stringify(dz.body.kayit));
  const sil = await iste('/api/school/schedule-delete', 'POST', { scheduleId: kayit }, T);
  kontrol('kayit silindi', sil.status === 200);
  const son = await iste('/api/school/schedule?classId=' + sinifA, 'GET', null, T);
  kontrol('silinen kayit listede yok', !son.body.cells.some(x => x.id === kayit));
  kontrol('kayitlar gun+saat sirali', (() => {
    const c = son.body.cells;
    for (let i = 1; i < c.length; i++) {
      if (c[i].day < c[i - 1].day) return false;
      if (c[i].day === c[i - 1].day && c[i].start < c[i - 1].start) return false;
    }
    return true;
  })());

  console.log('=== 10) OGRETMEN KENDI PROGRAMI ===');
  const ogrt = await girisYap('mat@test.com', 'Test1234!');
  const prog = await iste('/api/teacher/schedule', 'GET', null, ogrt.token);
  kontrol('program geliyor', prog.status === 200);
  const buTest = (r) => (r.body.lessons || []).filter(l => /^7-/.test(l.className));
  kontrol('iki dersi gorunuyor', buTest(prog).length === 2, 'adet ' + buTest(prog).length);
  kontrol('saat bilgisi var', prog.body.cells.length > 0 && !!prog.body.cells[0].start,
    JSON.stringify(prog.body.cells[0]));
  kontrol('cakisma isaretli', prog.body.cells.some(c => c.cakisma));

  console.log('=== 11) OGRENCI KENDI SINIF PROGRAMI ===');
  const ogr = await girisYap('ogrenci1@test.com', 'Test1234!');
  const sp = await iste('/api/myschedule', 'GET', null, ogr.token);
  kontrol('program geliyor', sp.status === 200, JSON.stringify(sp.body).slice(0, 100));
  kontrol('sinif adi dolu', !!sp.body.className, sp.body.className);
  kontrol('ders saatleri var', sp.body.cells.length >= 1, 'adet ' + sp.body.cells.length);

  console.log('=== 12) YETKI ===');
  const y = await iste('/api/school/class', 'POST', { name: 'Sahte' }, ogr.token);
  kontrol('ogrenci sinif olusturamaz', y.status === 403, 'status ' + y.status);
  const z = await iste('/api/school/schedule-add', 'POST',
    { classId: sinifA, day: 1, lessonId: dersA, start: '15:00', end: '16:00' }, ogrt.token);
  kontrol('ogretmen programa ders ekleyemez', z.status === 403, 'status ' + z.status);

  console.log('=== 13) SILME TEMIZLIGI ===');
  await iste('/api/school/class-delete', 'POST', { classId: sinifB }, T);
  const sonListe = await iste('/api/school/classes', 'GET', null, T);
  kontrol('sinif listeden dustu', !sonListe.body.classes.some(c => c.name === '7-B'));
  kontrol('ogrenci sinifsiz kaldi', sonListe.body.sinifsiz === 1, 'sinifsiz ' + sonListe.body.sinifsiz);
  const prog2 = await iste('/api/teacher/schedule', 'GET', null, ogrt.token);
  kontrol('silinen sinifin dersi ogretmenden dustu', buTest(prog2).length === 1,
    'adet ' + prog2.body.lessons.length);
  kontrol('cakisma da temizlendi', !prog2.body.cells.some(c => c.cakisma));

  console.log();
  console.log('  GECTI: ' + gecti + '   KALDI: ' + kaldi);
  process.exit(kaldi ? 1 : 0);
})().catch(e => { console.error('TEST HATASI:', e.message, e.stack); process.exit(1); });
