/* Hata ayiklama turu icin her ozelligi dolu bir ortam kurar
   ve her rolun oturum anahtarini basar. */
const { iste, epostaOnayla, girisYap, botCevabi } = require('./giris');

/* Kayıt olur ve e-postadaki onay bağlantısına tıklar (hesap ancak o zaman açılır). */
async function kayit(govde) {
  const bot = await botCevabi();
  const r = await iste('/api/register', 'POST',
    Object.assign({ kvkkOnay: true, phone: '05321234567' }, govde,
      { challengeId: bot.challengeId, challengeAnswer: bot.challengeAnswer }));
  if (r.status === 200 && r.body.onayGerekli) await epostaOnayla(govde.email);
  return r;
}

function gun(n) {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
}

(async () => {
  const admin = await girisYap('admin@egitimevi.com', 'admin123');
  const mudur = await girisYap('mudur@test.com', 'Test1234!');
  const M = mudur.token;
  const mat = await girisYap('mat@test.com', 'Test1234!');
  const O = mat.token;

  /* --- siniflar ve dersler --- */
  for (const ad of ['9-A', '9-B']) {
    await iste('/api/school/class', 'POST', { name: ad }, M);
  }
  const siniflar = (await iste('/api/school/classes', 'GET', null, M)).body.classes;
  const s9a = siniflar.find(c => c.name === '9-A');

  const ogretmenler = (await iste('/api/school/teacher-list', 'GET', null, M)).body.teachers;
  const matOgr = ogretmenler.find(t => t.fullName === 'Ayşe Kaya');
  const fenOgr = ogretmenler.find(t => t.fullName === 'Ali Yıldız');

  const dersler = [];
  for (const c of siniflar) {
    for (const [konu, ogr] of [['Matematik', matOgr], ['Fen Bilimleri', fenOgr]]) {
      const r = await iste('/api/school/lesson', 'POST',
        { classId: c.id, subject: konu, weeklyHours: 4 }, M);
      if (r.body.lesson) {
        await iste('/api/school/lesson-update', 'POST',
          { lessonId: r.body.lesson.id, teacherId: ogr.id }, M);
        dersler.push({ id: r.body.lesson.id, classId: c.id, konu });
      }
    }
  }

  /* --- ogrencileri sinifa yerlestir --- */
  const ogrenciler = (await iste('/api/school/students', 'GET', null, M)).body.students;
  for (const o of ogrenciler) {
    await iste('/api/school/class-assign', 'POST',
      { studentId: o.id, classId: s9a.id }, M);
  }

  /* --- ders programi --- */
  const saatler = [['09:20', '10:00'], ['10:10', '10:50'], ['11:00', '11:40']];
  let si = 0;
  for (const d of dersler.filter(x => x.classId === s9a.id)) {
    for (const g of [1, 3]) {
      const [bas, bit] = saatler[si % saatler.length];
      await iste('/api/school/schedule-add', 'POST',
        { classId: d.classId, lessonId: d.id, day: g, start: bas, end: bit }, M);
      si++;
    }
  }

  /* --- veli --- */
  await kayit({
    role: 'parent', fullName: 'Debug Veli', email: 'veli-debug@test.com',
    password: 'Test1234!', city: 'Ankara', district: 'Çankaya'
  });
  const veli = await girisYap('veli-debug@test.com', 'Test1234!');
  await iste('/api/parent/link', 'POST', { code: ogrenciler[0].code }, veli.token);

  /* --- duyuru ve mesajlar --- */
  await iste('/api/mesajlar', 'POST', {
    tur: 'duyuru', konu: 'Veli toplantısı',
    govde: '14 Eylül Cumartesi saat 10:00da veli toplantısı yapılacaktır.',
    hedef: { tur: 'okul' }
  }, M);
  await iste('/api/mesajlar', 'POST', {
    tur: 'mesaj', konu: 'Ödev hatırlatması',
    govde: 'Kesirler alıştırmasını unutma.',
    hedef: { tur: 'kisi', kisiler: [ogrenciler[0].id] }
  }, O);

  /* --- yoklama --- */
  const matDers = dersler.find(d => d.classId === s9a.id && d.konu === 'Matematik');
  await iste('/api/devamsizlik/yoklama', 'POST', {
    lessonId: matDers.id, tarih: gun(-1),
    girisler: [
      { ogrenciId: ogrenciler[0].id, durum: 'yok', not: 'Haber verilmedi' },
      { ogrenciId: ogrenciler[1] ? ogrenciler[1].id : ogrenciler[0].id, durum: 'gec' }
    ]
  }, O);

  /* --- odev --- */
  const hedef = await iste('/api/assignments/hedefler', 'GET', null, O);
  const idler = [];
  for (const c of (hedef.body.classes || [])) for (const st of c.students) idler.push(st.id);
  if (idler.length) {
    await iste('/api/assignments', 'POST', {
      title: 'Kesirler alıştırması', description: 'Sayfa 42-45',
      startAt: gun(-3), endAt: gun(4), studentIds: idler
    }, O);
  }

  /* --- ozel rol --- */
  await iste('/api/school/role', 'POST', {
    name: 'Zümre Başkanı',
    yetkiler: ['program.duzenle', 'ders.yonet', 'devamsizlik.gor',
      'aktarim.yap', 'islem-kaydi.gor', 'mesaj.toplu'],
    kapsam: {}
  }, M);

  const ogr = await girisYap('ogrenci1@test.com', 'Test1234!');

  console.log('ADMIN=' + admin.token);
  console.log('MUDUR=' + M);
  console.log('OGRETMEN=' + O);
  console.log('OGRENCI=' + ogr.token);
  console.log('VELI=' + veli.token);
})().catch(e => { console.error('HAZIRLIK HATASI:', e.message); process.exit(1); });
