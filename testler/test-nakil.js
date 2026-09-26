/* Öğrenci nakli: öğrenci hesabı kişiye ait.
   - T.C. no bütün sistemde tek öğrencide; başka okul aynı T.C. ile yeni hesap açamaz;
   - doğum tarihi de eşleşirse hesap yeni okula taşınır (kullanıcı adı, şifre, veli bağı aynı);
   - yanlış doğum tarihi reddedilir, çok deneme kilitlenir;
   - eski okulun ödev ve devamsızlığı yeni okula görünmez, eski okul da öğrenciyi artık görmez;
   - öğrenci ve velisi yıl seçicide önceki okulu seçip eski kayıtları salt okunur görür. */
const { iste, girisYap, hesapAc, kisilikGec, tcUret } = require('./giris');

let gecti = 0, kaldi = 0;
function kontrol(ad, sart, detay) {
  if (sart) { gecti++; console.log('  GECTI  ' + ad); }
  else { kaldi++; console.log('  KALDI  ' + ad + (detay ? '  -> ' + detay : '')); }
}
const J = x => JSON.stringify(x).slice(0, 220);
const gun = n => new Date(Date.now() + n * 86400000).toISOString().slice(0, 10);

(async () => {
  const z = Date.now().toString(36);
  const A = (await girisYap('admin@egitimevi.com', 'admin123')).token;
  const M = (await girisYap('mudur@test.com', 'Test1234!')).token;
  const O = (await girisYap('mat@test.com', 'Test1234!')).token;

  /* Önceki paketler eski yıla bakıyor olabilir: aktif yıla dön. */
  for (const T of [M, O]) {
    const y = await iste('/api/egitim-yili', 'GET', null, T);
    const aktif = (y.body.yillar || []).find(x => x.aktif);
    if (aktif) await iste('/api/egitim-yili/bak', 'POST', { id: aktif.id }, T);
  }

  console.log('=== 1) ESKİ OKULDA ÖĞRENCİ VE KAYITLARI ===');
  const tc = tcUret();
  const kadi = 'deniz' + z;
  const acildi = await iste('/api/school/hesap-ac', 'POST', { rol: 'student', ad: 'Deniz', soyad: 'Göçer', tc,
    dogum: '14.05.2013', kullaniciAdi: kadi, password: 'Test1234!' }, M);
  kontrol('okul A öğrenciyi açtı', acildi.status === 200 && !acildi.body.hesap.nakil, J(acildi.body));
  const st = acildi.body.hesap;
  let og = await girisYap(kadi, 'Test1234!');
  if (og.kvkkGuncel === false) await iste('/api/kvkk-onay', 'POST', { onay: true }, og.token);

  await iste('/api/school/class', 'POST', { name: 'NAKIL-' + z }, M);
  const sinif = ((await iste('/api/school/classes', 'GET', null, M)).body.classes || []).find(c => c.name === 'NAKIL-' + z);
  await iste('/api/school/lesson', 'POST', { classId: sinif.id, subject: 'Matematik', weeklyHours: 4 }, M);
  const ders = ((await iste('/api/school/schedule?classId=' + sinif.id, 'GET', null, M)).body.lessons || [])
    .find(l => l.subject === 'Matematik');
  const mat = ((await iste('/api/school/teacher-list', 'GET', null, M)).body.teachers || []).find(t => t.fullName === 'Ayşe Kaya');
  await iste('/api/school/lesson-update', 'POST', { lessonId: ders.id, teacherId: mat.id }, M);
  await iste('/api/school/class-assign', 'POST', { studentId: st.id, classId: sinif.id }, M);
  const odev = await iste('/api/assignments', 'POST', { title: 'Eski okul ödevi ' + z, description: 'A okulu',
    startAt: gun(-3), endAt: gun(3), studentIds: [st.id] }, O);
  kontrol('okul A ödev verdi', odev.status === 200, J(odev.body));
  const d = new Date();
  while (d.getDay() !== 1) d.setDate(d.getDate() - 1);
  await iste('/api/school/schedule-add', 'POST', { classId: sinif.id, lessonId: ders.id, day: 1, start: '08:00', end: '08:40' }, M);
  const yok = await iste('/api/devamsizlik/isaretle', 'POST',
    { studentId: st.id, lessonId: ders.id, tarih: d.toISOString().slice(0, 10), durum: 'yok' }, M);
  kontrol('okul A devamsızlık girdi', yok.status === 200, J(yok.body));
  const once = await iste('/api/progress', 'GET', null, og.token);
  kontrol('öğrenci eski okulda ödevini görüyor', (once.body.assignments || []).some(a => a.title === 'Eski okul ödevi ' + z),
    J(once.body.assignments));

  /* Veli nakilden önce bağlanır: bağ nakilden sonra da sürmeli. */
  const vK = 'nakilveli' + z;
  await hesapAc({ fullName: 'Nakil Veli', username: vK, email: vK + '@test.com' });
  const V = (await girisYap(vK, 'Test1234!')).token;
  const bag = await iste('/api/parent/link', 'POST', { code: st.code }, V);
  kontrol('veli çocuğa bağlandı', bag.status === 200, J(bag.body));

  console.log('=== 2) YENİ OKUL ===');
  const mb = 'nakilmudur' + z;
  const okulAc = await iste('/api/admin/okul-ac', 'POST', { schoolName: 'Nakil Deneme Ortaokulu ' + z, city: 'Ankara',
    district: 'Çankaya', kisaAd: 'nakil-' + z,
    mudur: { eposta: mb + '@test.com', ad: 'Burcu', soyad: 'Yeni', kullaniciAdi: mb, telefon: '+905321234567', sifre: 'Nakil2026!' } }, A);
  kontrol('yönetici okul B yi açtı', okulAc.status === 200, J(okulAc.body));
  let mbG = await girisYap(mb, 'Nakil2026!');
  await iste('/api/kvkk-onay', 'POST', { onay: true }, mbG.token);
  await iste('/api/password', 'POST', { old: 'Nakil2026!', new: 'Burcu2026Yeni!' }, mbG.token);
  mbG = await girisYap(mb, 'Burcu2026Yeni!');
  const roller = (await iste('/api/kisilikler', 'GET', null, mbG.token)).body.roller || [];
  const mRol = roller.find(r => r.rol === 'principal');
  const MB = (await kisilikGec(mbG.token, 'rol', mRol.id)).token;

  console.log('=== 3) AYNI T.C. İLE EKLEME ===');
  const dogumsuz = await iste('/api/school/hesap-ac', 'POST', { rol: 'student', ad: 'Deniz', soyad: 'Göçer', tc }, MB);
  kontrol('doğum tarihi yoksa yeni hesap açılmıyor, doğum isteniyor', dogumsuz.status === 409 && dogumsuz.body.nakil === 'dogum',
    J(dogumsuz.body));
  const yanlis = await iste('/api/school/hesap-ac', 'POST', { rol: 'student', ad: 'Deniz', soyad: 'Göçer', tc, dogum: '15.05.2013' }, MB);
  kontrol('yanlış doğum tarihi reddedildi', yanlis.status === 409 && /eşleşmedi/.test(yanlis.body.error || ''), J(yanlis.body));
  const hala = await iste('/api/progress', 'GET', null, og.token);
  kontrol('yanlış denemede hesap yerinde kaldı', (hala.body.assignments || []).some(a => a.title === 'Eski okul ödevi ' + z));
  const tasi = await iste('/api/school/hesap-ac', 'POST', { rol: 'student', ad: 'Deniz', soyad: 'Göçer', tc, dogum: '14.05.2013' }, MB);
  kontrol('T.C. + doğum eşleşti, hesap okul B ye taşındı', tasi.status === 200 && tasi.body.hesap.nakil === true &&
    tasi.body.hesap.id === st.id && tasi.body.hesap.username === kadi, J(tasi.body));
  const ikinci = await iste('/api/school/hesap-ac', 'POST', { rol: 'student', ad: 'Deniz', soyad: 'Göçer', tc, dogum: '14.05.2013' }, MB);
  kontrol('aynı okulda ikinci kez eklenemiyor', ikinci.status === 400 && /okulda başka bir hesapta/.test(ikinci.body.error || ''),
    J(ikinci.body));
  const geriA = await iste('/api/school/hesap-ac', 'POST', { rol: 'student', ad: 'Deniz', soyad: 'Göçer', tc }, M);
  kontrol('eski okul da aynı T.C. ile yeni hesap açamıyor', geriA.status === 409 && geriA.body.nakil === 'dogum', J(geriA.body));

  console.log('=== 4) ÖĞRENCİ YENİ OKULDA ===');
  og = await girisYap(kadi, 'Test1234!');
  kontrol('öğrenci aynı kullanıcı adı ve şifreyle giriyor', !!og.token, J(og));
  const ben = await iste('/api/me', 'GET', null, og.token);
  kontrol('öğrencinin okulu artık B', /Nakil Deneme/.test(ben.body.user.schoolName || ''), J(ben.body.user));
  const simdi = await iste('/api/progress', 'GET', null, og.token);
  kontrol('şimdiki görünümde eski okulun ödevi yok', !(simdi.body.assignments || []).some(a => a.title === 'Eski okul ödevi ' + z),
    J(simdi.body.assignments));
  const yillar = await iste('/api/egitim-yili', 'GET', null, og.token);
  const gecmis = (yillar.body.yillar || []).find(y => y.gecmis);
  kontrol('yıl listesinde önceki okul var', !!gecmis && /Nakil|Ortaokulu|Lisesi|Okul/i.test(gecmis.ad) && /NAKIL-/.test(gecmis.ad),
    J(yillar.body.yillar));
  const bak = await iste('/api/egitim-yili/bak', 'POST', { id: gecmis.id }, og.token);
  kontrol('önceki okula bakılıyor, salt okunur', bak.status === 200 && bak.body.arsiv === true, J(bak.body));
  const eski = await iste('/api/progress', 'GET', null, og.token);
  kontrol('önceki okul seçilince eski ödev görünüyor', (eski.body.assignments || []).some(a => a.title === 'Eski okul ödevi ' + z),
    J(eski.body.assignments));
  const eskiDevam = await iste('/api/devamsizlik/benim', 'GET', null, og.token);
  kontrol('önceki okulun devamsızlığı görünüyor', eskiDevam.body.sayim && eskiDevam.body.sayim.yok >= 1, J(eskiDevam.body.sayim));
  const simdiki = (yillar.body.yillar || []).find(y => y.aktif);
  await iste('/api/egitim-yili/bak', 'POST', { id: simdiki.id }, og.token);
  const donus = await iste('/api/devamsizlik/benim', 'GET', null, og.token);
  kontrol('şimdiki okula dönünce eski devamsızlık gizli', donus.body.sayim && donus.body.sayim.yok === 0, J(donus.body.sayim));

  console.log('=== 5) OKULLAR NE GÖRÜYOR ===');
  const bGor = await iste('/api/progress?studentId=' + st.id, 'GET', null, MB);
  kontrol('yeni okul öğrenciyi görüyor ama eski ödevi görmüyor', bGor.status === 200 &&
    !(bGor.body.assignments || []).some(a => a.title === 'Eski okul ödevi ' + z), J(bGor.body));
  const bDevam = await iste('/api/devamsizlik/ogrenci?studentId=' + st.id, 'GET', null, MB);
  kontrol('yeni okul eski devamsızlığı görmüyor', bDevam.status === 200 && bDevam.body.sayim.yok === 0, J(bDevam.body));
  const bYil = await iste('/api/egitim-yili/bak', 'POST', { id: gecmis.id }, MB);
  kontrol('yeni okul önceki okulun dönemini seçemiyor', bYil.status === 404, J(bYil.body));
  const aGor = await iste('/api/progress?studentId=' + st.id, 'GET', null, M);
  kontrol('eski okul öğrenciyi artık göremiyor', aGor.status === 403, 'status ' + aGor.status);
  const aListe = await iste('/api/school/students', 'GET', null, M);
  kontrol('eski okulun öğrenci listesinde yok', !(aListe.body.students || []).some(x => x.id === st.id));
  const bListe = await iste('/api/school/students', 'GET', null, MB);
  kontrol('yeni okulun öğrenci listesinde var', (bListe.body.students || []).some(x => x.id === st.id));

  console.log('=== 6) VELİ ===');
  const cocuklar = await iste('/api/parent/children', 'GET', null, V);
  kontrol('veli bağı nakilden sonra da sürüyor', (cocuklar.body.children || []).some(c => c.id === st.id), J(cocuklar.body));
  const vYil = await iste('/api/egitim-yili?ogrenci=' + st.id, 'GET', null, V);
  const vGecmis = (vYil.body.yillar || []).find(y => y.gecmis);
  kontrol('veli çocuğunun önceki okulunu yıl listesinde görüyor', vYil.status === 200 && !!vGecmis && vYil.body.yonetebilir === false,
    J(vYil.body));
  const vBak = await iste('/api/egitim-yili/bak', 'POST', { id: vGecmis.id, ogrenci: st.id }, V);
  kontrol('veli önceki okulu seçti', vBak.status === 200 && vBak.body.arsiv === true, J(vBak.body));
  const vEski = await iste('/api/progress?studentId=' + st.id, 'GET', null, V);
  kontrol('veli önceki okulun ödevini görüyor', (vEski.body.assignments || []).some(a => a.title === 'Eski okul ödevi ' + z),
    J(vEski.body.assignments));
  const vSimdi = (vYil.body.yillar || []).find(y => y.aktif);
  await iste('/api/egitim-yili/bak', 'POST', { id: vSimdi.id, ogrenci: st.id }, V);
  const vYeni = await iste('/api/progress?studentId=' + st.id, 'GET', null, V);
  kontrol('veli şimdiki okula dönünce eski ödev gizli', !(vYeni.body.assignments || []).some(a => a.title === 'Eski okul ödevi ' + z));
  const yabanci = await iste('/api/egitim-yili?ogrenci=' + st.id, 'GET', null, M);
  kontrol('ilgisiz kişi öğrencinin yıllarına bakamıyor', yabanci.status === 403, 'status ' + yabanci.status);

  console.log('=== 7) DENEME SINIRI ===');
  let kilit = false;
  for (let i = 0; i < 12; i++) {
    const r = await iste('/api/school/hesap-ac', 'POST', { rol: 'student', ad: 'Deniz', soyad: 'Göçer', tc, dogum: '0' + (i % 9 + 1) + '.01.2012' }, M);
    if (r.status === 429) { kilit = true; break; }
  }
  kontrol('yanlış doğum tarihi denemesi kilitleniyor', kilit);

  console.log();
  console.log('  GECTI: ' + gecti + '   KALDI: ' + kaldi);
  process.exit(kaldi ? 1 : 0);
})().catch(e => { console.error('TEST HATASI:', e.message, e.stack); process.exit(1); });
