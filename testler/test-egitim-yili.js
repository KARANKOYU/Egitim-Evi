/* Egitim yili: kayitlar yila baglaniyor mu, eski yil korunuyor mu. */
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
  const M = (await girisYap('mudur@test.com', 'Test1234!')).token;
  const O = (await girisYap('mat@test.com', 'Test1234!')).token;

  /* hazirlik */
  await iste('/api/school/class', 'POST', { name: 'YIL-SINIF' }, M);
  const siniflar = await iste('/api/school/classes', 'GET', null, M);
  const sinif = (siniflar.body.classes || []).find(c => c.name === 'YIL-SINIF');
  await iste('/api/school/lesson', 'POST',
    { classId: sinif.id, subject: 'Matematik', weeklyHours: 4 }, M);
  const prog = await iste('/api/school/schedule?classId=' + sinif.id, 'GET', null, M);
  const ders = (prog.body.lessons || []).find(l => l.subject === 'Matematik');
  const ogretmenler = await iste('/api/school/teacher-list', 'GET', null, M);
  const mat = (ogretmenler.body.teachers || []).find(t => t.fullName === 'Ayşe Kaya');
  await iste('/api/school/lesson-update', 'POST',
    { lessonId: ders.id, teacherId: mat.id }, M);
  const ogrListe = await iste('/api/school/students', 'GET', null, M);
  const o1 = ogrListe.body.students.find(x => x.email === 'ogrenci1@test.com');
  await iste('/api/school/class-assign', 'POST', { studentId: o1.id, classId: sinif.id }, M);

  console.log('=== 1) BASLANGICTA YIL YOK ===');
  const bos = await iste('/api/egitim-yili', 'GET', null, M);
  kontrol('yil listesi bos', bos.status === 200 && bos.body.yillar.length === 0,
    JSON.stringify(bos.body.yillar));
  kontrol('mudur yonetebiliyor', bos.body.yonetebilir === true);
  kontrol('arsivde degil', bos.body.arsiv === false);

  console.log('=== 2) ILK YILI AC ===');
  const y1 = await iste('/api/egitim-yili/ekle', 'POST', { ad: '2025-2026' }, M);
  kontrol('ilk yil acildi', y1.status === 200, JSON.stringify(y1.body).slice(0, 120));
  kontrol('yil aktif geldi', y1.body.yil.aktif === true);

  console.log('=== 3) GECERSIZ YIL ADI ===');
  const kotu1 = await iste('/api/egitim-yili/ekle', 'POST', { ad: '2026' }, M);
  kontrol('tek yil reddediliyor', kotu1.status === 400, JSON.stringify(kotu1.body));
  const kotu2 = await iste('/api/egitim-yili/ekle', 'POST', { ad: '2026-2030' }, M);
  kontrol('atlamali yil reddediliyor', kotu2.status === 400, JSON.stringify(kotu2.body));
  const kotu3 = await iste('/api/egitim-yili/ekle', 'POST', { ad: '2025-2026' }, M);
  kontrol('ayni yil iki kez acilamiyor', kotu3.status === 400, JSON.stringify(kotu3.body));

  console.log('=== 4) ESKI YILA KAYIT GIR ===');
  const hedefler = await iste('/api/assignments/hedefler', 'GET', null, O);
  const idler = [];
  for (const c of (hedefler.body.classes || [])) for (const st of c.students) idler.push(st.id);
  const odev1 = await iste('/api/assignments', 'POST', {
    title: 'Eski yıl ödevi', description: '2025-2026',
    startAt: gun(-5), endAt: gun(2), studentIds: idler
  }, O);
  kontrol('eski yilda odev verildi', odev1.status === 200);

  const d = new Date();
  while (d.getDay() !== 1) d.setDate(d.getDate() - 1);
  const pzt = d.toISOString().slice(0, 10);
  await iste('/api/school/schedule-add', 'POST',
    { classId: sinif.id, lessonId: ders.id, day: 1, start: '09:20', end: '10:00' }, M);
  const yok1 = await iste('/api/devamsizlik/isaretle', 'POST',
    { studentId: o1.id, lessonId: ders.id, tarih: pzt, durum: 'yok' }, M);
  kontrol('eski yilda devamsizlik girildi', yok1.status === 200, JSON.stringify(yok1.body));

  const liste1 = await iste('/api/assignments', 'GET', null, O);
  const eskiOdevSayisi = (liste1.body.assignments || []).length;
  kontrol('eski yilda odev goruluyor', eskiOdevSayisi >= 1, 'adet ' + eskiOdevSayisi);

  console.log('=== 5) YENI YIL AC ===');
  const y2 = await iste('/api/egitim-yili/ekle', 'POST', { ad: '2026-2027' }, M);
  kontrol('yeni yil acildi', y2.status === 200, JSON.stringify(y2.body).slice(0, 100));

  const durum = await iste('/api/egitim-yili', 'GET', null, M);
  kontrol('iki yil var', durum.body.yillar.length === 2,
    durum.body.yillar.map(y => y.ad).join(', '));
  const aktifOlan = durum.body.yillar.find(y => y.aktif);
  kontrol('yeni yil aktif', aktifOlan && aktifOlan.ad === '2026-2027',
    aktifOlan ? aktifOlan.ad : '-');

  console.log('=== 6) YENI YIL TEMIZ BASLIYOR ===');
  /* Ogretmen de yeni yila gecmeli */
  const ogrDurum = await iste('/api/egitim-yili', 'GET', null, O);
  const ogrBakilan = ogrDurum.body.yillar.find(y => y.bakilan);
  kontrol('ogretmen aktif yila bakiyor', ogrBakilan && ogrBakilan.ad === '2026-2027',
    ogrBakilan ? ogrBakilan.ad : '-');

  const liste2 = await iste('/api/assignments', 'GET', null, O);
  kontrol('yeni yilda eski odev gorunmuyor',
    !(liste2.body.assignments || []).some(a => a.title === 'Eski yıl ödevi'),
    (liste2.body.assignments || []).map(a => a.title).join(', ') || '(bos)');

  const ozet2 = await iste('/api/devamsizlik/ozet', 'GET', null, M);
  kontrol('yeni yilda eski devamsizlik yok', ozet2.body.toplamKayit === 0,
    'kayit ' + ozet2.body.toplamKayit);

  console.log('=== 7) ESKI YILA GERI BAK ===');
  const eskiYil = durum.body.yillar.find(y => y.ad === '2025-2026');
  const bak = await iste('/api/egitim-yili/bak', 'POST', { id: eskiYil.id }, O);
  kontrol('eski yila bakilabiliyor', bak.status === 200, JSON.stringify(bak.body).slice(0, 100));
  kontrol('arsiv olarak isaretlendi', bak.body.arsiv === true);

  const liste3 = await iste('/api/assignments', 'GET', null, O);
  kontrol('eski yilin odevi geri geldi',
    (liste3.body.assignments || []).some(a => a.title === 'Eski yıl ödevi'),
    (liste3.body.assignments || []).map(a => a.title).join(', ') || '(bos)');

  const arsivYaz = await iste('/api/examgroups', 'POST', { name: 'Arşivde açılan grup' }, O);
  kontrol('gecmis yila bakarken yeni kayit acilamiyor (salt okunur)', arsivYaz.status === 409 && arsivYaz.body.arsiv === true,
    JSON.stringify(arsivYaz.body));

  const bakM = await iste('/api/egitim-yili/bak', 'POST', { id: eskiYil.id }, M);
  const ozet3 = await iste('/api/devamsizlik/ozet', 'GET', null, M);
  kontrol('eski yilin devamsizligi geri geldi', ozet3.body.toplamKayit >= 1,
    'kayit ' + ozet3.body.toplamKayit);

  console.log('=== 8) YENI YILA DON ===');
  const yeniYil = durum.body.yillar.find(y => y.ad === '2026-2027');
  await iste('/api/egitim-yili/bak', 'POST', { id: yeniYil.id }, O);
  const liste4 = await iste('/api/assignments', 'GET', null, O);
  kontrol('yeni yilda yine temiz',
    !(liste4.body.assignments || []).some(a => a.title === 'Eski yıl ödevi'));

  console.log('=== 9) YETKI ===');
  const S = (await girisYap('ogrenci1@test.com', 'Test1234!')).token;
  const ogrEkle = await iste('/api/egitim-yili/ekle', 'POST', { ad: '2030-2031' }, S);
  kontrol('ogrenci yil acamiyor', ogrEkle.status === 403, 'status ' + ogrEkle.status);
  const ogrAktif = await iste('/api/egitim-yili/aktif-yap', 'POST', { id: eskiYil.id }, S);
  kontrol('ogrenci aktif yil degistiremiyor', ogrAktif.status === 403, 'status ' + ogrAktif.status);

  const ogrGor = await iste('/api/egitim-yili', 'GET', null, S);
  kontrol('ogrenci yillari gorebiliyor', ogrGor.status === 200 &&
    ogrGor.body.yillar.length === 2, 'adet ' + (ogrGor.body.yillar || []).length);
  kontrol('ogrenciye yonetim kapali', ogrGor.body.yonetebilir === false);

  const ogrBak = await iste('/api/egitim-yili/bak', 'POST', { id: eskiYil.id }, S);
  kontrol('ogrenci eski yila bakabiliyor', ogrBak.status === 200);

  console.log('=== 10) AKTIF YIL DEGISTIRME ===');
  const aktifYap = await iste('/api/egitim-yili/aktif-yap', 'POST', { id: eskiYil.id }, M);
  kontrol('mudur aktif yili degistirebiliyor', aktifYap.status === 200,
    JSON.stringify(aktifYap.body));
  const son = await iste('/api/egitim-yili', 'GET', null, M);
  const yeniAktif = son.body.yillar.find(y => y.aktif);
  kontrol('tek yil aktif kaldi',
    son.body.yillar.filter(y => y.aktif).length === 1 && yeniAktif.ad === '2025-2026',
    son.body.yillar.map(y => y.ad + (y.aktif ? '*' : '')).join(', '));

  console.log();
  console.log('  GECTI: ' + gecti + '   KALDI: ' + kaldi);
  process.exit(kaldi ? 1 : 0);
})().catch(e => { console.error('TEST HATASI:', e.message, e.stack); process.exit(1); });
