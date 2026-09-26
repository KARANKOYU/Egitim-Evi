/* Öğretmenin Sınıflarım bölümü, öğrencinin ödev serisi, ders programından yoklama bildirimi:
   - öğretmen yalnızca ders verdiği sınıfları ve öğrencilerini görür; öğrencide verdiği
     ödevler (sonucuyla) ve sınav sonuçları; yetki rolden kapatılınca 403;
   - seri: arka arkaya "Yaptı"; tek kaçırma uyarı, ikinci kaçırma bozar; en uzun seri;
   - yoklama saatle kaydedilince veliye "Çocuğunuz ... saat ... dersine gelmedi". */
const { iste, girisYap, hesapAc, tcUret } = require('./giris');

let gecti = 0, kaldi = 0;
function kontrol(ad, sart, detay) {
  if (sart) { gecti++; console.log('  GECTI  ' + ad); }
  else { kaldi++; console.log('  KALDI  ' + ad + (detay ? '  -> ' + detay : '')); }
}
const J = x => String(JSON.stringify(x)).slice(0, 220);
const gun = n => new Date(Date.now() + n * 86400000).toISOString().slice(0, 10);

(async () => {
  const z = Date.now().toString(36);
  const M = (await girisYap('mudur@test.com', 'Test1234!')).token;
  const mat = (await girisYap('mat@test.com', 'Test1234!')).token;
  const fen = (await girisYap('fen@test.com', 'Test1234!')).token;

  /* Hazırlık: mat'ın Matematik dersine girdiği yeni sınıf, bir öğrenci, velisi. */
  await iste('/api/school/class', 'POST', { name: 'SNF-' + z }, M);
  await iste('/api/school/class', 'POST', { name: 'BASKA-' + z }, M);
  const siniflar = (await iste('/api/school/classes', 'GET', null, M)).body.classes;
  const sinif = siniflar.find(c => c.name === 'SNF-' + z), baska = siniflar.find(c => c.name === 'BASKA-' + z);
  await iste('/api/school/lesson', 'POST', { classId: sinif.id, subject: 'Matematik', weeklyHours: 4 }, M);
  const ders = ((await iste('/api/school/schedule?classId=' + sinif.id, 'GET', null, M)).body.lessons || []).find(l => l.subject === 'Matematik');
  const matRol = ((await iste('/api/school/teacher-list', 'GET', null, M)).body.teachers || []).find(t => t.fullName === 'Ayşe Kaya');
  await iste('/api/school/lesson-update', 'POST', { lessonId: ders.id, teacherId: matRol.id }, M);
  const ac = await iste('/api/school/hesap-ac', 'POST', { rol: 'student', ad: 'Seri', soyad: 'Deneme', tc: tcUret(), kullaniciAdi: 'seri' + z,
    password: 'Test1234!', classId: sinif.id }, M);
  const st = ac.body.hesap;
  const og = await girisYap('seri' + z, 'Test1234!');
  if (og.kvkkGuncel === false) await iste('/api/kvkk-onay', 'POST', { onay: true }, og.token);
  const vK = 'sveli' + z;
  await hesapAc({ fullName: 'Seri Veli', username: vK, email: vK + '@test.com' });
  const V = (await girisYap(vK, 'Test1234!')).token;
  await iste('/api/parent/link', 'POST', { code: st.code }, V);

  console.log('=== 1) SINIFLARIM ===');
  const liste = await iste('/api/teacher/siniflarim', 'GET', null, mat);
  kontrol('öğretmen ders verdiği sınıfı görüyor', liste.status === 200 && liste.body.siniflar.some(c => c.id === sinif.id && c.dersler.indexOf('Matematik') >= 0),
    J(liste.body));
  kontrol('ders vermediği sınıf listede yok', !liste.body.siniflar.some(c => c.id === baska.id));
  const ogr = await iste('/api/teacher/sinif?id=' + sinif.id, 'GET', null, mat);
  kontrol('sınıfın öğrencileri geliyor', ogr.status === 200 && ogr.body.ogrenciler.some(o => o.id === st.id), J(ogr.body));
  const disari = await iste('/api/teacher/sinif?id=' + baska.id, 'GET', null, mat);
  kontrol('ders vermediği sınıfı açamıyor', disari.status === 403, 'status ' + disari.status);
  const fenBakar = await iste('/api/teacher/ogrenci?id=' + st.id, 'GET', null, fen);
  kontrol('öğrencinin sınıfına dersi olmayan öğretmen öğrenciye bakamıyor', fenBakar.status === 403, 'status ' + fenBakar.status);
  const ogrenciBakar = await iste('/api/teacher/siniflarim', 'GET', null, og.token);
  kontrol('öğrenci bu bölüme giremiyor', ogrenciBakar.status === 403, 'status ' + ogrenciBakar.status);

  console.log('=== 2) ÖDEV SERİSİ ===');
  /* Sırayla: yaptı, yaptı, yapmadı (uyarı), yaptı, geç, yapmadı (bozuldu), yaptı */
  const sonuclar = ['yapti', 'yapti', 'yapmadi', 'yapti', 'gec', 'yapmadi', 'yapti'];
  const beklenen = [
    { sayi: 1, uyari: false, bozuldu: false }, { sayi: 2, uyari: false, bozuldu: false },
    { sayi: 2, uyari: true, bozuldu: false }, { sayi: 3, uyari: false, bozuldu: false },
    { sayi: 3, uyari: true, bozuldu: false }, { sayi: 0, uyari: false, bozuldu: true }, { sayi: 1, uyari: false, bozuldu: false }
  ];
  let seriDogru = true, son = null;
  for (let i = 0; i < sonuclar.length; i++) {
    const a = await iste('/api/assignments', 'POST', { title: 'Seri ödevi ' + (i + 1), subject: 'Matematik', startAt: gun(-30 + i * 2),
      endAt: gun(-29 + i * 2), studentIds: [st.id] }, mat);
    await iste('/api/assignments/' + a.body.assignment.id + '/finish', 'POST', { results: { [st.id]: sonuclar[i] } }, mat);
    son = (await iste('/api/progress', 'GET', null, og.token)).body.seri;
    const b = beklenen[i];
    if (!son || son.sayi !== b.sayi || son.uyari !== b.uyari || son.bozuldu !== b.bozuldu) {
      seriDogru = false;
      console.log('    ' + (i + 1) + '. adım (' + sonuclar[i] + '): ' + J(son) + ' beklenen ' + J(b));
    }
  }
  kontrol('seri her adımda doğru: yaptı artırır, tek kaçırma uyarır, ikinci kaçırma bozar', seriDogru);
  kontrol('en uzun seri 3', son && son.enUzun === 3, J(son));
  const veliSeri = await iste('/api/progress?studentId=' + st.id, 'GET', null, V);
  kontrol('seri yalnızca öğrencinin kendisine gider', veliSeri.status === 200 && veliSeri.body.seri === undefined, J(veliSeri.body.seri));

  console.log('=== 3) ÖĞRENCİ AYRINTISI ===');
  const kisi = await iste('/api/teacher/ogrenci?id=' + st.id, 'GET', null, mat);
  kontrol('verdiğim ödevler sonuçlarıyla geliyor', kisi.status === 200 && kisi.body.odevler.length === 7 &&
    kisi.body.odevler.filter(a => a.result === 'yapti').length === 4, J(kisi.body.odevler.map(a => a.result)));
  const sinav = await iste('/api/exams', 'POST', { name: 'Seri yazılısı', hazir: 'yazili', tarih: gun(-1) }, mat);
  await iste('/api/exams/' + sinav.body.exam.id + '/grades', 'POST', { grades: { [st.id]: '87,5' } }, mat);
  const kisi2 = await iste('/api/teacher/ogrenci?id=' + st.id, 'GET', null, mat);
  const yazili = (kisi2.body.sinavlar || []).find(s => s.name === 'Seri yazılısı');
  kontrol('öğrencinin sınav sonucu görünüyor (87,5)', !!yazili && yazili.olcumler.some(o => Number(o.deger) === 87.5), J(kisi2.body.sinavlar));

  console.log('=== 4) YETKİ ROLDEN KAPATILINCA ===');
  const roller = (await iste('/api/school/roles', 'GET', null, M)).body.roles;
  const ogretmenRolu = roller.find(r => r.tur === 'ogretmen');
  kontrol('hazır Öğretmen rolünde yetki açık geliyor', ogretmenRolu.permissions.indexOf('ogretmen.sonuclar') >= 0, J(ogretmenRolu.permissions));
  await iste('/api/school/role-update', 'POST', { roleId: ogretmenRolu.id,
    permissions: ogretmenRolu.permissions.filter(p => p !== 'ogretmen.sonuclar') }, M);
  const kapali = await iste('/api/teacher/siniflarim', 'GET', null, (await girisYap('mat@test.com', 'Test1234!')).token);
  kontrol('yetki kapanınca bölüm 403', kapali.status === 403, 'status ' + kapali.status);
  await iste('/api/school/role-update', 'POST', { roleId: ogretmenRolu.id, permissions: ogretmenRolu.permissions }, M);

  console.log('=== 5) DERS PROGRAMINDAN YOKLAMA: VELİYE DERS VE SAAT ===');
  const y = await iste('/api/devamsizlik/yoklama', 'POST', { lessonId: ders.id, saat: '09:20',
    girisler: [{ ogrenciId: st.id, durum: 'yok' }] }, mat);
  kontrol('yoklama kaydedildi', y.status === 200, J(y.body));
  const vBildirim = await iste('/api/notifications', 'GET', null, V);
  const metinler = JSON.stringify(vBildirim.body);
  kontrol('veliye "Çocuğunuz ... bugün saat 09:20 Matematik dersine gelmedi (izinsiz)"',
    /Çocuğunuz Seri Deneme bugün saat 09:20 Matematik dersine gelmedi \(izinsiz\)/.test(metinler), metinler.slice(0, 400));
  await iste('/api/devamsizlik/yoklama', 'POST', { lessonId: ders.id, saat: '09:20', girisler: [{ ogrenciId: st.id, durum: 'izinli' }] }, mat);
  const vBildirim2 = JSON.stringify((await iste('/api/notifications', 'GET', null, V)).body);
  kontrol('izinliye çevrilince "gelmedi (izinli)"', /Matematik dersine gelmedi \(izinli\)/.test(vBildirim2), vBildirim2.slice(0, 300));
  const program = await iste('/api/teacher/schedule', 'GET', null, mat);
  kontrol('ders programı hücrelerinde ders kimliği var (yoklama düğmesi için)', program.status === 200 &&
    (program.body.cells.length === 0 || program.body.cells.every(c => !!c.lessonId)), J(program.body.cells.slice(0, 1)));

  console.log();
  console.log('  GECTI: ' + gecti + '   KALDI: ' + kaldi);
  process.exit(kaldi ? 1 : 0);
})().catch(e => { console.error('TEST HATASI:', e.message, e.stack); process.exit(1); });
