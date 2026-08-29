/* Odev teslim saati ve gecmis odevin sonuc duzenlemesi. */
const { iste, girisYap } = require('./giris');

let gecti = 0, kaldi = 0;
function kontrol(ad, sart, detay) {
  if (sart) { gecti++; console.log('  GECTI  ' + ad); }
  else { kaldi++; console.log('  KALDI  ' + ad + (detay ? '  -> ' + detay : '')); }
}
function gun(n) {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
}

(async () => {
  const mudur = await girisYap('mudur@test.com', 'Test1234!');
  const M = mudur.token;
  const O = (await girisYap('mat@test.com', 'Test1234!')).token;

  /* hazirlik */
  await iste('/api/school/class', 'POST', { name: 'SAAT-SINIF' }, M);
  const siniflar = await iste('/api/school/classes', 'GET', null, M);
  const sinif = (siniflar.body.classes || []).find(c => c.name === 'SAAT-SINIF');
  /* Ders zaten varsa POST hata doner; listeden bulmak daha dayanikli. */
  await iste('/api/school/lesson', 'POST',
    { classId: sinif.id, subject: 'Matematik', weeklyHours: 4 }, M);
  const program = await iste('/api/school/schedule?classId=' + sinif.id, 'GET', null, M);
  const dersKayit = (program.body.lessons || []).find(l => l.subject === 'Matematik');
  kontrol('test dersi hazir', !!dersKayit,
    JSON.stringify((program.body.lessons || []).map(l => l.subject)));
  const ogretmenler = await iste('/api/school/teacher-list', 'GET', null, M);
  const mat = (ogretmenler.body.teachers || []).find(t => t.fullName === 'Ayşe Kaya');
  await iste('/api/school/lesson-update', 'POST',
    { lessonId: dersKayit.id, teacherId: mat.id }, M);

  const ogrListe = await iste('/api/school/students', 'GET', null, M);
  const o1 = ogrListe.body.students.find(x => x.email === 'ogrenci1@test.com');
  await iste('/api/school/class-assign', 'POST', { studentId: o1.id, classId: sinif.id }, M);

  const hedefler = await iste('/api/assignments/hedefler', 'GET', null, O);
  const idler = [];
  for (const c of (hedefler.body.classes || [])) for (const st of c.students) idler.push(st.id);

  console.log('=== 1) VARSAYILAN SAAT ===');
  const saatsiz = await iste('/api/assignments', 'POST', {
    title: 'Saatsiz ödev', description: 'Deneme',
    startAt: gun(-1), endAt: gun(3), studentIds: idler
  }, O);
  kontrol('saatsiz odev kabul edildi', saatsiz.status === 200,
    JSON.stringify(saatsiz.body).slice(0, 120));

  const liste1 = await iste('/api/assignments', 'GET', null, O);
  const a1 = (liste1.body.assignments || []).find(x => x.title === 'Saatsiz ödev');
  kontrol('varsayilan saat 12:00', a1 && a1.endTime === '12:00',
    a1 ? a1.endTime : '-');

  console.log('=== 2) SAAT VERILEBILIYOR ===');
  const saatli = await iste('/api/assignments', 'POST', {
    title: 'Saatli ödev', description: 'Ders saatinde',
    startAt: gun(-1), endAt: gun(3), endTime: '09:20', studentIds: idler
  }, O);
  kontrol('saatli odev kabul edildi', saatli.status === 200);
  const liste2 = await iste('/api/assignments', 'GET', null, O);
  const a2 = (liste2.body.assignments || []).find(x => x.title === 'Saatli ödev');
  kontrol('verilen saat korundu', a2 && a2.endTime === '09:20', a2 ? a2.endTime : '-');

  console.log('=== 3) BOZUK SAAT VARSAYILANA DUSUYOR ===');
  const bozuk = await iste('/api/assignments', 'POST', {
    title: 'Bozuk saatli', description: 'x',
    startAt: gun(-1), endAt: gun(3), endTime: 'abc', studentIds: idler
  }, O);
  const liste3 = await iste('/api/assignments', 'GET', null, O);
  const a3 = (liste3.body.assignments || []).find(x => x.title === 'Bozuk saatli');
  kontrol('gecersiz saat 12:00 oluyor', a3 && a3.endTime === '12:00', a3 ? a3.endTime : '-');

  console.log('=== 4) GECIKME SAATE GORE ===');
  /* Bugun saat 00:01 -> kesin gecmis */
  const gecmis = await iste('/api/assignments', 'POST', {
    title: 'Gecmis odev', description: 'x',
    startAt: gun(-5), endAt: gun(-1), endTime: '12:00', studentIds: idler
  }, O);
  const liste4 = await iste('/api/assignments', 'GET', null, O);
  const a4 = (liste4.body.assignments || []).find(x => x.title === 'Gecmis odev');
  kontrol('gecmis odev gecikti isaretli', a4 && a4.gecikti === true,
    'gecikti ' + (a4 ? a4.gecikti : '-'));
  const a1b = (liste4.body.assignments || []).find(x => x.title === 'Saatsiz ödev');
  kontrol('gelecekteki odev gecikmedi', a1b && a1b.gecikti === false,
    'gecikti ' + (a1b ? a1b.gecikti : '-'));

  console.log('=== 5) SURESI GECMIS ODEVIN SONUCU DEGISTIRILEBILIYOR ===');
  const detay = await iste('/api/assignments/' + a4.id, 'GET', null, O);
  kontrol('gecmis odev acilabiliyor', detay.status === 200,
    JSON.stringify(detay.body).slice(0, 100));

  const sonuclar = {};
  sonuclar[o1.id] = 'yapmadi';
  const bitir = await iste('/api/assignments/' + a4.id + '/finish', 'POST',
    { results: sonuclar }, O);
  kontrol('gecmis odev sonuclandirildi', bitir.status === 200);
  kontrol('sonuc kaydedildi', bitir.body.assignment.results[o1.id] === 'yapmadi',
    JSON.stringify(bitir.body.assignment.results));

  /* Sonuclandiktan SONRA tekrar degistir */
  const sonuclar2 = {};
  sonuclar2[o1.id] = 'yapti';
  const tekrar = await iste('/api/assignments/' + a4.id + '/finish', 'POST',
    { results: sonuclar2 }, O);
  kontrol('sonuclanmis odevin sonucu degistirilebiliyor', tekrar.status === 200);
  kontrol('yeni sonuc yazildi', tekrar.body.assignment.results[o1.id] === 'yapti',
    JSON.stringify(tekrar.body.assignment.results));

  const acKontrol = await iste('/api/assignments/' + a4.id, 'GET', null, O);
  const ogrSonuc = (acKontrol.body.students || []).find(x => x.id === o1.id);
  kontrol('degisiklik detayda gorunuyor', ogrSonuc && ogrSonuc.result === 'yapti',
    JSON.stringify(ogrSonuc));

  console.log('=== 6) TEKRAR ACMA ===');
  const yeniden = await iste('/api/assignments/' + a4.id + '/reopen', 'POST', {}, O);
  kontrol('odev tekrar acilabiliyor', yeniden.status === 200 &&
    yeniden.body.assignment.status === 'active',
    yeniden.body.assignment ? yeniden.body.assignment.status : '-');

  console.log('=== 7) OGRENCI TARAFINDA SAAT ===');
  const S = (await girisYap('ogrenci1@test.com', 'Test1234!')).token;
  const ilerleme = await iste('/api/progress', 'GET', null, S);
  const ogrOdev = (ilerleme.body.assignments || []).find(x => x.title === 'Saatli ödev');
  kontrol('ogrenci odevin saatini goruyor', ogrOdev && ogrOdev.endTime === '09:20',
    ogrOdev ? ogrOdev.endTime : JSON.stringify((ilerleme.body.assignments || []).map(x => x.title)));

  console.log('=== 7b) OGRENCI ODEVI YILDIZLIYOR ===');
  kontrol('yildiz bilgisi geliyor, baslangicta yok', ogrOdev && ogrOdev.yildizli === false, JSON.stringify(ogrOdev));
  const yildiz = await iste('/api/assignments/' + ogrOdev.id + '/yildiz', 'POST', { yildiz: true }, S);
  kontrol('odev yildizlandi', yildiz.status === 200 && yildiz.body.yildiz === true, JSON.stringify(yildiz.body));
  const sonra = await iste('/api/progress', 'GET', null, S);
  kontrol('yildiz kaydedildi', (sonra.body.assignments || []).some(x => x.id === ogrOdev.id && x.yildizli === true));
  kontrol('oteki odevler yildizsiz', (sonra.body.assignments || []).filter(x => x.id !== ogrOdev.id).every(x => x.yildizli === false));
  const bozukYildiz = await iste('/api/assignments/' + ogrOdev.id + '/yildiz', 'POST', { yildiz: 'evet' }, S);
  kontrol('yildiz alani true/false olmali', bozukYildiz.status === 400, 'status ' + bozukYildiz.status);
  const baskaOdev = await iste('/api/assignments/yok_boyle/yildiz', 'POST', { yildiz: true }, S);
  kontrol('olmayan odev yildizlanamiyor', baskaOdev.status === 404, 'status ' + baskaOdev.status);
  const ogretmenYildiz = await iste('/api/assignments/' + ogrOdev.id + '/yildiz', 'POST', { yildiz: true }, O);
  kontrol('ogretmen yildizlayamiyor (yalniz ogrenci)', ogretmenYildiz.status === 403, 'status ' + ogretmenYildiz.status);
  const ogretmenBakis = await iste('/api/progress?studentId=' + o1.id, 'GET', null, O);
  kontrol('ogretmen ogrencinin yildizini gormuyor', (ogretmenBakis.body.assignments || []).every(x => x.yildizli === undefined),
    'status ' + ogretmenBakis.status);
  const kaldir = await iste('/api/assignments/' + ogrOdev.id + '/yildiz', 'POST', { yildiz: false }, S);
  const kaldirSonra = await iste('/api/progress', 'GET', null, S);
  kontrol('yildiz kaldirildi', kaldir.status === 200 &&
    (kaldirSonra.body.assignments || []).some(x => x.id === ogrOdev.id && x.yildizli === false));

  console.log('=== 8) TAKVIMDE SAAT ===');
  /* Teslim tarihi gelecek aya tasmis olabilir; o ayin takvimini sorguluyoruz. */
  const teslimTarihi = gun(3);
  const [tYil, tAy] = teslimTarihi.split('-');
  const takvim = await iste('/api/takvim?yil=' + Number(tYil) +
    '&ay=' + Number(tAy), 'GET', null, S);
  let saatliOlay = null;
  for (const g of (takvim.body.gunler || [])) {
    for (const o of g.olaylar) {
      if (o.tur === 'odev' && o.baslik === 'Saatli ödev') saatliOlay = o;
    }
  }
  kontrol('takvimde odev saati var', saatliOlay && saatliOlay.saat === '09:20',
    JSON.stringify(saatliOlay));

  const gunDetay = await iste('/api/takvim/gun?tarih=' + teslimTarihi, 'GET', null, S);
  const teslimSaatli = (gunDetay.body.teslim || []).find(x => x.baslik === 'Saatli ödev');
  kontrol('gun ayrintisinda saat var', teslimSaatli && teslimSaatli.saat === '09:20',
    JSON.stringify(teslimSaatli));

  console.log('=== 9) GELMEDI (IZINSIZ) SONUCU ===');
  /* Izinli gelmemek basari oranini dusurmez, izinsiz gelmemek dusurur. */
  const izinsiz = {};
  izinsiz[o1.id] = 'gelmedi';
  const gelmediKayit = await iste('/api/assignments/' + a4.id + '/finish', 'POST',
    { results: izinsiz }, O);
  kontrol('gelmedi sonucu kabul edildi', gelmediKayit.status === 200,
    JSON.stringify(gelmediKayit.body).slice(0, 100));
  kontrol('gelmedi sonucu yazildi',
    gelmediKayit.body.assignment.results[o1.id] === 'gelmedi',
    JSON.stringify(gelmediKayit.body.assignment.results));

  const uydurma = {};
  uydurma[o1.id] = 'kacti';
  const kotu = await iste('/api/assignments/' + a4.id + '/finish', 'POST',
    { results: uydurma }, O);
  const kotuSonra = await iste('/api/assignments/' + a4.id, 'GET', null, O);
  const kotuOgr = (kotuSonra.body.students || []).find(x => x.id === o1.id);
  kontrol('uydurma sonuc yazilmadi',
    kotu.status === 200 && kotuOgr && kotuOgr.result === 'gelmedi',
    JSON.stringify(kotuOgr));

  const S2 = (await girisYap('ogrenci1@test.com', 'Test1234!')).token;
  const ilerleme2 = await iste('/api/progress', 'GET', null, S2);
  let gelmediSayan = null;
  for (const s of (ilerleme2.body.subjects || [])) {
    if (s.gelmedi > 0) gelmediSayan = s;
  }
  kontrol('ilerleyiste gelmedi sayiliyor', !!gelmediSayan,
    JSON.stringify((ilerleme2.body.subjects || []).map(
      x => x.subject + ':' + x.gelmedi)));
  kontrol('izinsiz gelmemek orana giriyor',
    gelmediSayan && gelmediSayan.oran !== null && gelmediSayan.oran < 100,
    gelmediSayan ? 'oran ' + gelmediSayan.oran : '-');

  const ozetListe = await iste('/api/assignments', 'GET', null, O);
  const ozetOdev = (ozetListe.body.assignments || []).find(x => x.id === a4.id);
  kontrol('ogretmen ozetinde gelmedi alani var',
    ozetOdev && ozetOdev.summary && ozetOdev.summary.gelmedi === 1,
    JSON.stringify(ozetOdev ? ozetOdev.summary : null));

  console.log('=== BAŞLAMA SAATİ (08.09.2025 · 08:00 gibi) ===');
  const basli = await iste('/api/assignments', 'POST', { title: 'Başlama saatli ödev', description: 'x',
    startAt: gun(0), startTime: '08:00', endAt: gun(7), endTime: '23:00', studentIds: idler }, O);
  kontrol('başlama saatiyle ödev verildi', basli.status === 200, JSON.stringify(basli.body).slice(0, 120));
  const lb = (await iste('/api/assignments', 'GET', null, O)).body.assignments.find(x => x.title === 'Başlama saatli ödev');
  kontrol('başlama ve son saat korundu', lb && lb.startTime === '08:00' && lb.endTime === '23:00', lb && (lb.startTime + ' / ' + lb.endTime));
  const ters = await iste('/api/assignments', 'POST', { title: 'Ters saat', description: 'x',
    startAt: gun(1), startTime: '15:00', endAt: gun(1), endTime: '10:00', studentIds: idler }, O);
  kontrol('aynı gün son saat başlamadan önce olamaz', ters.status === 400, 'status ' + ters.status);
  const duz = await iste('/api/assignments/' + basli.body.assignment.id + '/update', 'POST', { title: 'Başlama saatli ödev',
    description: 'x', startAt: gun(0), startTime: '09:30', endAt: gun(7), endTime: '23:00' }, O);
  const lb2 = (await iste('/api/assignments', 'GET', null, O)).body.assignments.find(x => x.title === 'Başlama saatli ödev');
  kontrol('düzenlenince başlama saati değişti', duz.status === 200 && lb2 && lb2.startTime === '09:30', lb2 && lb2.startTime);
  const eski = (await iste('/api/assignments', 'GET', null, O)).body.assignments.find(x => x.title === 'Saatsiz ödev');
  kontrol('başlama saati verilmeyen ödevde boş', eski && eski.startTime === '', eski && JSON.stringify(eski.startTime));

  console.log();
  console.log('  GECTI: ' + gecti + '   KALDI: ' + kaldi);
  process.exit(kaldi ? 1 : 0);
})().catch(e => { console.error('TEST HATASI:', e.message, e.stack); process.exit(1); });
