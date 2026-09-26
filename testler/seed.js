const { girisYap, hesapAc, okulHesabi, mudurYap } = require('./giris');
const BASE = process.env.EE_BASE || 'http://localhost:3000';

async function api(yol, method = 'GET', body = null, token = null) {
  const h = { 'Content-Type': 'application/json' };
  if (token) h['Authorization'] = 'Bearer ' + token;
  const r = await fetch(BASE + '/api' + yol, {
    method, headers: h, body: body ? JSON.stringify(body) : undefined
  });
  const t = await r.text();
  let j; try { j = JSON.parse(t); } catch (e) { j = { raw: t }; }
  if (!r.ok) throw new Error(method + ' ' + yol + ' -> ' + r.status + ' ' + (j.error || t.slice(0, 120)));
  return j;
}

function gun(n) {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
}

(async () => {
  // 1) admin
  const admin = await girisYap('admin@egitimevi.com', 'admin123');
  console.log('admin girisi OK');

  // 2) mudur: yetişkin hesabı -> kişi kodu -> yönetici okulu açıp onu müdür yapar (admin/okul-ac)
  await hesapAc({ fullName: 'Mehmet Demir', username: 'mudur', email: 'mudur@test.com', password: 'Test1234!' });
  const mudur = await mudurYap('mudur@test.com', 'Test1234!',
    { schoolName: 'Test Ortaokulu', city: 'Ankara', district: 'Çankaya' }, admin.token);
  console.log('mudur atandi');

  const okullar = await api('/schools?city=Ankara');
  const okul = okullar.schools.find(s => s.name === 'Test Ortaokulu');
  console.log('okul id:', okul.id);

  // 3) ogretmenler
  const ogretmenler = [
    { ad: 'Ayşe Kaya', email: 'mat@test.com', brans: 'Matematik' },
    { ad: 'Ali Yıldız', email: 'fen@test.com', brans: 'Fen Bilimleri' }
  ];
  /* Öğretmen kendi hesabını açar, kişi kodunu verir; müdür kodu girip branşını seçer. */
  for (const o of ogretmenler) {
    const kadi = o.email.split('@')[0];
    await okulHesabi(mudur.token, 'teacher', { fullName: o.ad, username: kadi, email: o.email, password: 'Test1234!',
      brans: o.brans });
  }
  console.log('ogretmenler eklendi');

  // 4) ogrenciler
  const ogrenciler = [
    { ad: 'Zeynep Şahin', email: 'ogrenci1@test.com', sinif: '6-A' },
    { ad: 'Burak Öztürk', email: 'ogrenci2@test.com', sinif: '6-A' }
  ];
  const kodlar = [];
  /* Öğrenci kaydolmaz; hesabını müdür açar (sınıfı sonra yerleştirilir). */
  for (const s of ogrenciler) {
    const kadi = s.email.split('@')[0];
    const h = await okulHesabi(mudur.token, 'student', { fullName: s.ad, username: kadi, email: s.email,
      password: 'Test1234!', dogum: '2011-05-10' });
    kodlar.push({ ad: s.ad, kod: h.code });
  }
  console.log('OGRENCI KODLARI:');
  kodlar.forEach(k => console.log('   ', k.ad, '->', k.kod, '(uzunluk ' + k.kod.length + ')'));

  // 5) sinif, dersler ve ogretmen atamalari
  //    Ogrenci-ogretmen iliskisi yalnizca sinif ve ders uzerinden kuruluyor;
  //    ogrenciyi tek tek ogretmene atama diye bir is yok.
  const snf = await api('/school/class', 'POST', { name: '6-A' }, mudur.token);
  const sinifId = snf['class'].id;
  const ogrList2 = await api('/school/teacher-list', 'GET', null, mudur.token);
  for (const t of ogrList2.teachers) {
    if (t.role !== 'teacher') continue;
    const ders = await api('/school/lesson', 'POST',
      { classId: sinifId, subject: t.branch, weeklyHours: 4 }, mudur.token);
    await api('/school/lesson-update', 'POST',
      { lessonId: ders.lesson.id, teacherId: t.id }, mudur.token);
  }
  const okulOgr = await api('/school/students', 'GET', null, mudur.token);
  for (const st of okulOgr.students) {
    await api('/school/class-assign', 'POST',
      { studentId: st.id, classId: sinifId }, mudur.token);
  }
  console.log('sinif 7-A kuruldu, dersler ogretmenlere baglandi');

  // 6) odevler
  const mat = await girisYap('mat@test.com', 'Test1234!');
  const fen = await girisYap('fen@test.com', 'Test1234!');

  const odevler = [
    { t: mat.token, title: 'Kesirler alıştırması', desc: 'Sayfa 42-45 arası tüm sorular', bas: gun(-10), bit: gun(-3) },
    { t: mat.token, title: 'Üslü sayılar testi', desc: 'Testi çözüp getir', bas: gun(-2), bit: gun(5) },
    { t: mat.token, title: 'Geometri problemleri', desc: 'Üçgenler konusu', bas: gun(0), bit: gun(12) },
    { t: fen.token, title: 'Bitki hücresi çizimi', desc: 'A4 kağıda renkli çizim', bas: gun(-8), bit: gun(-1) },
    { t: fen.token, title: 'Güneş sistemi maketi', desc: 'Grup çalışması', bas: gun(-1), bit: gun(20) }
  ];
  const olusan = [];
  for (const o of odevler) {
    // Odev artik kime gidecegi acikca secilerek veriliyor
    const hedef = await api('/assignments/hedefler', 'GET', null, o.t);
    const idler = [];
    for (const c of hedef.classes) for (const st of c.students) idler.push(st.id);
    const r = await api('/assignments', 'POST', {
      title: o.title, description: o.desc, startAt: o.bas, endAt: o.bit,
      studentIds: idler
    }, o.t);
    olusan.push({ id: r.assignment.id, token: o.t, title: o.title });
  }
  console.log(olusan.length + ' odev olusturuldu');

  // 7) bazilarini sonuclandir (farkli durumlar olsun)
  const sonuclar = ['yapti', 'yapmadi', 'eksik', 'izinli'];
  for (let i = 0; i < 2; i++) {
    const o = olusan[i === 0 ? 0 : 3];
    const detay = await api('/assignments/' + o.id, 'GET', null, o.token);
    const results = {};
    detay.students.forEach((s, j) => { results[s.id] = sonuclar[(i + j) % sonuclar.length]; });
    await api('/assignments/' + o.id + '/finish', 'POST', { results }, o.token);
    console.log('sonuclandi:', o.title, JSON.stringify(results));
  }

  // 8) ogrenci gorunumu
  const ogr = await girisYap('ogrenci1@test.com', 'Test1234!');
  const ilerleme = await api('/progress', 'GET', null, ogr.token);
  console.log('\nOGRENCI ODEVLERI (' + ilerleme.assignments.length + ' adet):');
  ilerleme.assignments.forEach(a => {
    console.log('  -', a.subject, '|', a.title, '| durum:', a.status, '| sonuc:', a.result || '-', '| bitis:', (a.endAt || '-'));
  });

  console.log('\nGIRIS BILGILERI');
  console.log('  admin    : admin@egitimevi.com / admin123');
  console.log('  mudur    : mudur@test.com / Test1234!');
  console.log('  ogretmen : mat@test.com / Test1234!');
  console.log('  ogrenci  : ogrenci1@test.com / Test1234!');
})().catch(e => { console.error('HATA:', e.message); process.exit(1); });
