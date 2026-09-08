const { girisYap } = require('./giris');
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

// Kayit artik bot dogrulamasi istiyor: her kayit oncesi taze soru al ve coz.
async function botCevabi() {
  const s = await api('/challenge');
  const m = s.soru.match(/(\d+)\s*\+\s*(\d+)/);
  return { challengeId: s.id, challengeAnswer: Number(m[1]) + Number(m[2]) };
}

async function kayitOl(govde) {
  const bot = await botCevabi();
  return api('/register', 'POST', Object.assign({ kvkkOnay: true, phone: '05321234567' }, govde, bot));
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

  // 2) mudur kaydi
  await kayitOl({
    role: 'principal', fullName: 'Mehmet Demir', email: 'mudur@test.com', password: 'Test1234',
    city: 'Ankara', district: 'Çankaya', schoolName: 'Test Ortaokulu'
  });
  const bekleyen = await api('/admin/pending', 'GET', null, admin.token);
  const mudurBasvuru = bekleyen.principals.find(x => x.email === 'mudur@test.com');
  await api('/admin/decide', 'POST', { userId: mudurBasvuru.id, approve: true }, admin.token);
  console.log('mudur onaylandi');

  const mudur = await girisYap('mudur@test.com', 'Test1234');
  const okullar = await api('/schools?city=Ankara');
  const okul = okullar.schools.find(s => s.name === 'Test Ortaokulu');
  console.log('okul id:', okul.id);

  // 3) ogretmenler
  const ogretmenler = [
    { ad: 'Ayşe Kaya', email: 'mat@test.com', brans: 'Matematik' },
    { ad: 'Ali Yıldız', email: 'fen@test.com', brans: 'Fen Bilimleri' }
  ];
  for (const o of ogretmenler) {
    await kayitOl({
      role: 'teacher', fullName: o.ad, email: o.email, password: 'Test1234',
      city: 'Ankara', district: 'Çankaya', schoolId: okul.id, branch: o.brans
    });
  }
  const ogrListe = await api('/school/teachers', 'GET', null, mudur.token);
  for (const t of ogrListe.teachers) {
    await api('/school/teacher-decide', 'POST', { userId: t.id, approve: true }, mudur.token);
  }
  console.log('ogretmenler onaylandi');

  // 4) ogrenciler
  const ogrenciler = [
    { ad: 'Zeynep Şahin', email: 'ogrenci1@test.com', sinif: '7-A' },
    { ad: 'Burak Öztürk', email: 'ogrenci2@test.com', sinif: '7-A' }
  ];
  const kodlar = [];
  for (const s of ogrenciler) {
    const r = await kayitOl({
      role: 'student', fullName: s.ad, email: s.email, password: 'Test1234',
      city: 'Ankara', district: 'Çankaya', schoolId: okul.id, grade: s.sinif
    });
    kodlar.push({ ad: s.ad, kod: r.user.code, mesaj: r.message });
  }
  console.log('OGRENCI KODLARI:');
  kodlar.forEach(k => console.log('   ', k.ad, '->', k.kod, '(uzunluk ' + k.kod.length + ')'));

  // 5) ogrencileri ogretmenlere ata
  const okulOgr = await api('/school/students', 'GET', null, mudur.token);
  const ogrList2 = await api('/school/teacher-list', 'GET', null, mudur.token);
  for (const st of okulOgr.students) {
    for (const t of ogrList2.teachers) {
      if (t.role !== 'teacher') continue;
      await api('/school/assign', 'POST', { studentId: st.id, teacherId: t.id }, mudur.token);
    }
  }
  console.log('ogrenciler atandi');

  // 6) odevler
  const mat = await girisYap('mat@test.com', 'Test1234');
  const fen = await girisYap('fen@test.com', 'Test1234');

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
  const ogr = await girisYap('ogrenci1@test.com', 'Test1234');
  const ilerleme = await api('/progress', 'GET', null, ogr.token);
  console.log('\nOGRENCI ODEVLERI (' + ilerleme.assignments.length + ' adet):');
  ilerleme.assignments.forEach(a => {
    console.log('  -', a.subject, '|', a.title, '| durum:', a.status, '| sonuc:', a.result || '-', '| bitis:', (a.endAt || '-'));
  });

  console.log('\nGIRIS BILGILERI');
  console.log('  admin    : admin@egitimevi.com / admin123');
  console.log('  mudur    : mudur@test.com / test123');
  console.log('  ogretmen : mat@test.com / test123');
  console.log('  ogrenci  : ogrenci1@test.com / test123');
})().catch(e => { console.error('HATA:', e.message); process.exit(1); });
