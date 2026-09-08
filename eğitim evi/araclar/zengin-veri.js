/* Ekran görüntüleri gerçekçi görünsün diye dolu bir okul kurar. */
const { iste, girisYap } = require('./giris');

(async () => {
  const m = await girisYap('mudur@test.com', 'Test1234');
  const T = m.token;

  /* Sınıflar */
  const sinifAdlari = ['7-A', '7-B', '8-A'];
  const siniflar = {};
  for (const ad of sinifAdlari) {
    const r = await iste('/api/school/class', 'POST', { name: ad }, T);
    if (r.body.class) siniflar[ad] = r.body.class.id;
  }

  /* Öğrencileri sınıflara dağıt */
  const ogr = await iste('/api/school/students', 'GET', null, T);
  const dizi = Object.values(siniflar);
  for (let i = 0; i < ogr.body.students.length; i++) {
    await iste('/api/school/class-assign', 'POST',
      { studentId: ogr.body.students[i].id, classId: dizi[i % dizi.length] }, T);
  }

  /* Birkaç öğrenci hesabı daha aç ki liste dolu görünsün */
  const yeniler = [
    ['Deniz Kara', 'deniz.kara', '7-A'],
    ['Elif Şahin', 'elif.sahin', '7-A'],
    ['Mert Aydın', 'mert.aydin', '7-B'],
    ['Sıla Yıldırım', 'sila.yildirim', '8-A']
  ];
  for (const [ad, kul, sinif] of yeniler) {
    await iste('/api/school/student-create', 'POST', {
      fullName: ad, email: kul + '@okul.com', password: 'Ogrenci2026',
      classId: siniflar[sinif], grade: sinif,
      note: 'Hesabın okul tarafından açıldı, şifreni sınıf öğretmeninden al.'
    }, T);
  }

  /* Dersler ve öğretmen atamaları */
  const bilgi = await iste('/api/school/lessons?classId=' + siniflar['7-A'], 'GET', null, T);
  const ogretmenler = bilgi.body.teachers.filter(t => t.role !== 'principal');
  const dersPlani = {
    '7-A': [['Matematik', 5], ['Türkçe', 6], ['Fen Bilimleri', 4], ['İngilizce', 4], ['Sosyal Bilgiler', 3]],
    '7-B': [['Matematik', 5], ['Türkçe', 6], ['Fen Bilimleri', 4]],
    '8-A': [['Matematik', 5], ['İngilizce', 4], ['Müzik', 2]]
  };
  const dersId = {};
  for (const sinif of sinifAdlari) {
    dersId[sinif] = [];
    const liste = dersPlani[sinif];
    for (let i = 0; i < liste.length; i++) {
      const d = await iste('/api/school/lesson', 'POST',
        { classId: siniflar[sinif], subject: liste[i][0], weeklyHours: liste[i][1] }, T);
      if (!d.body.lesson) continue;
      const t = ogretmenler[i % ogretmenler.length];
      await iste('/api/school/lesson-update', 'POST',
        { lessonId: d.body.lesson.id, teacherId: t.id }, T);
      dersId[sinif].push(d.body.lesson.id);
    }
  }

  /* Haftalık program */
  /* Her sınıf farklı saat diliminden başlar; gerçek okulda aynı öğretmen
     aynı saatte iki sınıfta olamaz. Sonda tek bir kasıtlı çakışma bırakılıyor
     ki uyarı özelliği ekranda görünsün. */
  const saatDilimi = {
    '7-A': [['09:20', '10:00'], ['10:10', '10:50'], ['11:00', '11:40'], ['13:20', '14:00'], ['14:10', '14:50']],
    '7-B': [['10:10', '10:50'], ['11:00', '11:40'], ['13:20', '14:00'], ['14:10', '14:50'], ['15:00', '15:40']],
    '8-A': [['11:00', '11:40'], ['13:20', '14:00'], ['14:10', '14:50'], ['15:00', '15:40'], ['09:20', '10:00']]
  };
  const plan = {
    '7-A': { 1: [0, 1, 2, 3], 2: [1, 0, 4, 2], 3: [2, 3, 0, 1, 4], 4: [0, 1, 2], 5: [3, 4, 0, 1] },
    '7-B': { 1: [0, 1, 2], 2: [1, 2, 0], 3: [2, 0, 1], 4: [0, 1], 5: [1, 2, 0] },
    '8-A': { 1: [0, 1], 2: [2, 0, 1], 3: [1, 0], 4: [0, 2, 1], 5: [1, 0] }
  };
  let sayac = 0;
  for (const sinif of sinifAdlari) {
    for (const gun of Object.keys(plan[sinif])) {
      const dizi = plan[sinif][gun];
      for (let i = 0; i < dizi.length; i++) {
        const lid = dersId[sinif][dizi[i]];
        if (!lid) continue;
        const dilim = saatDilimi[sinif][i % saatDilimi[sinif].length];
        const r = await iste('/api/school/schedule-add', 'POST', {
          classId: siniflar[sinif], day: Number(gun), lessonId: lid,
          start: dilim[0], end: dilim[1]
        }, T);
        if (r.status === 200) sayac++;
      }
    }
  }

  /* Bir rol tanımla ve öğretmene ver */
  const rol = await iste('/api/school/role', 'POST', {
    name: 'Müdür Yardımcısı',
    permissions: ['sinif.yonet', 'program.duzenle', 'ogrenci.yerlestir', 'ders.yonet', 'devamsizlik.gor']
  }, T);
  await iste('/api/school/role', 'POST', {
    name: 'Rehber Öğretmen',
    permissions: ['ogrenci.portal', 'devamsizlik.gor', 'mesaj.toplu']
  }, T);
  const ogrtListe = await iste('/api/school/teachers', 'GET', null, T);
  const fen = ogrtListe.body.teachers.find(t => /fen@test/.test(t.email));
  if (fen && rol.body.role) {
    await iste('/api/school/role-assign', 'POST', { userId: fen.id, roleId: rol.body.role.id }, T);
  }

  /* Ödevler: bir kısmı sonuçlanmış olsun */
  const mat = await girisYap('mat@test.com', 'Test1234');
  const gun = n => { const d = new Date(); d.setDate(d.getDate() + n); return d.toISOString().slice(0, 10); };
  const odevler = [
    ['Kesirler alıştırması', 'Sayfa 42-45 arası tüm sorular', gun(-10), gun(-3)],
    ['Üslü sayılar testi', 'Testi çözüp getir', gun(-2), gun(1)],
    ['Geometri problemleri', 'Üçgenler konusu, defterinize', gun(0), gun(6)],
    ['Denklem çalışması', 'Çalışma kitabı 60-64', gun(1), gun(9)]
  ];
  const acilan = [];
  const hedefler = await iste('/api/assignments/hedefler', 'GET', null, mat.token);
  const tumIdler = [];
  for (const c of hedefler.body.classes) for (const st of c.students) tumIdler.push(st.id);
  for (const [b, a, bas, bit] of odevler) {
    const r = await iste('/api/assignments', 'POST',
      { title: b, description: a, startAt: bas, endAt: bit, studentIds: tumIdler }, mat.token);
    if (r.body.assignment) acilan.push(r.body.assignment.id);
  }
  if (acilan.length) {
    const detay = await iste('/api/assignments/' + acilan[0], 'GET', null, mat.token);
    const sonuclar = {};
    const secenek = ['yapti', 'yapti', 'eksik', 'yapmadi', 'yapti', 'izinli'];
    detay.body.students.forEach((s, i) => { sonuclar[s.id] = secenek[i % secenek.length]; });
    await iste('/api/assignments/' + acilan[0] + '/finish', 'POST', { results: sonuclar }, mat.token);
  }

  /* Sınav grubu ve notlar */
  const grup = await iste('/api/examgroups', 'POST', { name: 'Dönem 1 - Yazılılar' }, mat.token);
  if (grup.body.group) {
    const gid = grup.body.group.id;
    const s1 = await iste('/api/exams', 'POST', { groupId: gid, name: '1. Yazılı', weight: 50 }, mat.token);
    await iste('/api/exams', 'POST', { groupId: gid, name: '2. Yazılı', weight: 50 }, mat.token);
    if (s1.body.exam) {
      const d = await iste('/api/exams/' + s1.body.exam.id, 'GET', null, mat.token);
      const notlar = {};
      const puanlar = [85, 72, 91, 64, 78, 88];
      (d.body.students || []).forEach((s, i) => { notlar[s.id] = puanlar[i % puanlar.length]; });
      await iste('/api/exams/' + s1.body.exam.id + '/grades', 'POST', { grades: notlar }, mat.token);
    }
  }

  /* Kasıtlı tek çakışma: 7-A Matematik öğretmenini Cuma 09:20'de 8-A'ya da yaz. */
  const cuma = await iste('/api/school/schedule?classId=' + siniflar['8-A'], 'GET', null, T);
  const matDers = (cuma.body.lessons || []).find(l => l.subject === 'Matematik');
  if (matDers) {
    await iste('/api/school/schedule-add', 'POST', {
      classId: siniflar['8-A'], day: 5, lessonId: matDers.id, start: '09:20', end: '10:00'
    }, T);
  }

  console.log('zengin veri hazir: ' + sinifAdlari.length + ' sinif, ' + sayac + ' ders saati, ' +
    acilan.length + ' ödev');
})().catch(e => { console.error('HATA:', e.message); process.exit(1); });
