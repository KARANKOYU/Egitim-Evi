/* Takvim testleri. */
const { iste, epostaOnayla, girisYap, botCevabi } = require('./giris');

let gecti = 0, kaldi = 0;
function kontrol(ad, sart, detay) {
  if (sart) { gecti++; console.log('  GECTI  ' + ad); }
  else { kaldi++; console.log('  KALDI  ' + ad + (detay ? '  -> ' + detay : '')); }
}
/* Kayıt olur ve e-postadaki onay bağlantısına tıklar (hesap ancak o zaman açılır). */
async function kayit(govde) {
  const bot = await botCevabi();
  const r = await iste('/api/register', 'POST',
    Object.assign({ kvkkOnay: true, phone: '05321234567' }, govde,
      { challengeId: bot.challengeId, challengeAnswer: bot.challengeAnswer }));
  if (r.status === 200 && r.body.onayGerekli) await epostaOnayla(govde.email);
  return r;
}
const iki = n => (n < 10 ? '0' : '') + n;

(async () => {
  const mudur = await girisYap('mudur@test.com', 'Test1234!');
  const M = mudur.token;
  const ogretmen = await girisYap('mat@test.com', 'Test1234!');
  const O = ogretmen.token;

  /* hazirlik: sinif, ders, ogrenci, program, odev */
  await iste('/api/school/class', 'POST', { name: 'TK-SINIF' }, M);
  const siniflar = await iste('/api/school/classes', 'GET', null, M);
  const sinif = (siniflar.body.classes || []).find(c => c.name === 'TK-SINIF');
  const dersEkle = await iste('/api/school/lesson', 'POST',
    { classId: sinif.id, subject: 'Matematik', weeklyHours: 4 }, M);
  const dersId = dersEkle.body.lesson.id;
  const ogretmenler = await iste('/api/school/teacher-list', 'GET', null, M);
  const mat = (ogretmenler.body.teachers || []).find(t => t.fullName === 'Ayşe Kaya');
  await iste('/api/school/lesson-update', 'POST',
    { lessonId: dersId, teacherId: mat.id }, M);

  const ogrListe = await iste('/api/school/students', 'GET', null, M);
  const o1 = ogrListe.body.students.find(x => x.email === 'ogrenci1@test.com');
  await iste('/api/school/class-assign', 'POST', { studentId: o1.id, classId: sinif.id }, M);

  /* Pazartesi'ye ders koy */
  await iste('/api/school/schedule-add', 'POST',
    { classId: sinif.id, lessonId: dersId, day: 1, start: '09:20', end: '10:00' }, M);

  console.log('=== 1) NISAN 2026 — SABIT OZEL GUNLER ===');
  const nisan = await iste('/api/takvim?yil=2026&ay=4', 'GET', null, M);
  kontrol('nisan ayi geldi', nisan.status === 200 && nisan.body.gunler.length === 30,
    'gun ' + (nisan.body.gunler || []).length);
  const n23 = nisan.body.gunler.find(g => g.gun === 23);
  kontrol('23 Nisan tatil isaretli', n23 && n23.tatil === true, JSON.stringify(n23));
  kontrol('23 Nisan adi dogru',
    n23 && n23.olaylar.some(o => /Çocuk Bayramı/.test(o.baslik)),
    JSON.stringify(n23 && n23.olaylar));

  console.log('=== 2) TEMMUZ — 15 TEMMUZ ===');
  const temmuz = await iste('/api/takvim?yil=2026&ay=7', 'GET', null, M);
  const t15 = temmuz.body.gunler.find(g => g.gun === 15);
  kontrol('15 Temmuz tatil', t15 && t15.tatil === true);
  kontrol('15 Temmuz adi dogru',
    t15 && t15.olaylar.some(o => /Demokrasi/.test(o.baslik)),
    JSON.stringify(t15 && t15.olaylar));

  console.log('=== 3) DINI BAYRAM (Mart 2026 Ramazan) ===');
  const mart = await iste('/api/takvim?yil=2026&ay=3', 'GET', null, M);
  const ramazanGun = (mart.body.gunler || []).filter(g =>
    g.olaylar.some(o => /Ramazan/.test(o.baslik)));
  kontrol('ramazan bayrami 4 gune yayildi', ramazanGun.length === 4,
    'gun ' + ramazanGun.length + ' -> ' + ramazanGun.map(g => g.gun).join(','));
  kontrol('arife isaretlendi',
    ramazanGun.some(g => g.olaylar.some(o => /arife/.test(o.baslik))));
  const m18 = mart.body.gunler.find(g => g.gun === 18);
  kontrol('18 Mart ozel gun ama tatil degil',
    m18 && m18.tatil === false && m18.olaylar.some(o => /Çanakkale/.test(o.baslik)),
    JSON.stringify(m18 && m18.olaylar));

  console.log('=== 4) HAFTA BASLANGICI ===');
  /* 1 Ocak 2026 Persembe -> Pazartesi basli izgarada 3 bos sutun */
  const ocak = await iste('/api/takvim?yil=2026&ay=1', 'GET', null, M);
  kontrol('ilk gun sutunu dogru hesaplandi', ocak.body.basSutun === 3,
    'basSutun ' + ocak.body.basSutun);
  /* Ocak 2026: 1 Ocak Persembe -> haftasonlari 3,4,10,11,17,18,24,25,31 = 9 gun */
  kontrol('haftasonlari isaretli',
    ocak.body.gunler.filter(g => g.haftaSonu).length === 9,
    'haftasonu ' + ocak.body.gunler.filter(g => g.haftaSonu).length);

  console.log('=== 5) OKUL ETKINLIGI ===');
  const bugunD = new Date();
  const yil = bugunD.getFullYear(), ay = bugunD.getMonth() + 1;
  const t = d => yil + '-' + iki(ay) + '-' + iki(d);

  const ekle = await iste('/api/takvim/etkinlik', 'POST',
    { baslik: 'Veli toplantısı', tur: 'toplanti', tarih: t(14) }, M);
  kontrol('etkinlik eklendi', ekle.status === 200, JSON.stringify(ekle.body).slice(0, 120));

  const araligi = await iste('/api/takvim/etkinlik', 'POST',
    { baslik: 'Sınav haftası', tur: 'sinav', tarih: t(20), bitis: t(24) }, M);
  kontrol('cok gunlu etkinlik eklendi', araligi.status === 200);

  const buAy = await iste('/api/takvim?yil=' + yil + '&ay=' + ay, 'GET', null, M);
  const sinavGunleri = buAy.body.gunler.filter(g =>
    g.olaylar.some(o => o.baslik === 'Sınav haftası'));
  kontrol('sinav haftasi 5 gune yayildi', sinavGunleri.length === 5,
    'gun ' + sinavGunleri.length);

  const g14 = buAy.body.gunler.find(g => g.gun === 14);
  kontrol('toplanti gorunuyor',
    g14 && g14.olaylar.some(o => o.tur === 'toplanti'), JSON.stringify(g14 && g14.olaylar));

  console.log('=== 6) TERS TARIH ARALIGI ===');
  const ters = await iste('/api/takvim/etkinlik', 'POST',
    { baslik: 'Hatali', tur: 'etkinlik', tarih: t(20), bitis: t(10) }, M);
  kontrol('bitis baslangictan once reddediliyor', ters.status === 400,
    JSON.stringify(ters.body));

  const bosBaslik = await iste('/api/takvim/etkinlik', 'POST',
    { baslik: '  ', tur: 'etkinlik', tarih: t(10) }, M);
  kontrol('bos baslik reddediliyor', bosBaslik.status === 400, JSON.stringify(bosBaslik.body));

  console.log('=== 7) YETKI ===');
  const S = (await girisYap('ogrenci1@test.com', 'Test1234!')).token;
  const ogrEkle = await iste('/api/takvim/etkinlik', 'POST',
    { baslik: 'Olmaz', tur: 'tatil', tarih: t(5) }, S);
  kontrol('ogrenci etkinlik ekleyemiyor', ogrEkle.status === 403, 'status ' + ogrEkle.status);

  const ogrGorus = await iste('/api/takvim?yil=' + yil + '&ay=' + ay, 'GET', null, S);
  kontrol('ogrenci takvimi gorebiliyor', ogrGorus.status === 200);
  kontrol('ogrenciye yonetim yetkisi kapali', ogrGorus.body.yonetebilir === false);

  console.log('=== 8) OGRENCININ GUNU ===');
  /* Odev ver */
  const hedefler = await iste('/api/assignments/hedefler', 'GET', null, O);
  const idler = [];
  for (const c of (hedefler.body.classes || [])) for (const st of c.students) idler.push(st.id);
  const teslimGun = t(Math.min(28, bugunD.getDate() + 1));
  await iste('/api/assignments', 'POST', {
    title: 'Takvim ödevi', description: 'Deneme',
    startAt: t(1), endAt: teslimGun, studentIds: idler
  }, O);

  const ogrAy = await iste('/api/takvim?yil=' + yil + '&ay=' + ay, 'GET', null, S);
  const odevGun = ogrAy.body.gunler.find(g => g.tarih === teslimGun);
  kontrol('odev teslim tarihi takvimde',
    odevGun && odevGun.olaylar.some(o => o.tur === 'odev' && o.baslik === 'Takvim ödevi'),
    JSON.stringify(odevGun && odevGun.olaylar));

  const gunDetay = await iste('/api/takvim/gun?tarih=' + teslimGun, 'GET', null, S);
  kontrol('gun ayrintisi acildi', gunDetay.status === 200, JSON.stringify(gunDetay.body).slice(0, 120));
  kontrol('bugun teslim listesinde',
    (gunDetay.body.teslim || []).some(x => x.baslik === 'Takvim ödevi'),
    JSON.stringify(gunDetay.body.teslim));
  kontrol('gun adi turkce', /Pazartesi|Salı|Çarşamba|Perşembe|Cuma|Cumartesi|Pazar/
    .test(gunDetay.body.gunAdi || ''), gunDetay.body.gunAdi);

  console.log('=== 9) DERS PROGRAMI TAKVIMDE ===');
  /* Bu ayin ilk Pazartesi'sini bul */
  let ilkPzt = 0;
  for (let d = 1; d <= 28; d++) {
    if (new Date(yil, ay - 1, d).getDay() === 1) { ilkPzt = d; break; }
  }
  const pztGun = ogrAy.body.gunler.find(g => g.gun === ilkPzt);
  kontrol('pazartesi ders sayisi gorunuyor', pztGun && pztGun.dersSayisi >= 1,
    'ders ' + (pztGun ? pztGun.dersSayisi : '-'));

  const pztDetay = await iste('/api/takvim/gun?tarih=' + t(ilkPzt), 'GET', null, S);
  kontrol('gun ayrintisinda ders listeleniyor',
    (pztDetay.body.dersler || []).some(x => x.ders === 'Matematik'),
    JSON.stringify(pztDetay.body.dersler));
  kontrol('derste ogretmen adi var',
    (pztDetay.body.dersler || []).some(x => x.ogretmen === 'Ayşe Kaya'));

  console.log('=== 10) VELI COCUGUNUN TAKVIMINI GORUR ===');
  await kayit({
    role: 'parent', fullName: 'Takvim Veli', email: 'veli-takvim@test.com',
    password: 'Test1234!', city: 'Ankara', district: 'Çankaya'
  });
  const V = (await girisYap('veli-takvim@test.com', 'Test1234!')).token;
  await iste('/api/parent/link', 'POST', { code: o1.code }, V);

  const veliAy = await iste('/api/takvim?yil=' + yil + '&ay=' + ay +
    '&studentId=' + o1.id, 'GET', null, V);
  kontrol('veli cocugunun takvimini goruyor',
    veliAy.status === 200 && veliAy.body.ogrenci && veliAy.body.ogrenci.id === o1.id,
    JSON.stringify(veliAy.body.ogrenci || veliAy.body).slice(0, 120));
  const veliOdevGun = veliAy.body.gunler.find(g => g.tarih === teslimGun);
  kontrol('veli cocugunun odevini goruyor',
    veliOdevGun && veliOdevGun.olaylar.some(o => o.tur === 'odev'));

  const o2 = ogrListe.body.students.find(x => x.email === 'ogrenci2@test.com');
  const veliBaskasi = await iste('/api/takvim?yil=' + yil + '&ay=' + ay +
    '&studentId=' + o2.id, 'GET', null, V);
  kontrol('veli baskasinin cocugunu goremiyor',
    veliBaskasi.body.ogrenci === null,
    JSON.stringify(veliBaskasi.body.ogrenci));

  console.log('=== 11) SILME ===');
  const sil = await iste('/api/takvim/etkinlik-sil', 'POST',
    { id: ekle.body.etkinlik.id }, M);
  kontrol('etkinlik silindi', sil.status === 200, JSON.stringify(sil.body));
  const sonra = await iste('/api/takvim?yil=' + yil + '&ay=' + ay, 'GET', null, M);
  kontrol('silinen etkinlik takvimde yok',
    !sonra.body.gunler.some(g => g.olaylar.some(o => o.baslik === 'Veli toplantısı')));

  console.log('=== 12) GECERSIZ GIRDI ===');
  const kotuAy = await iste('/api/takvim?yil=2026&ay=13', 'GET', null, M);
  kontrol('gecersiz ay reddediliyor', kotuAy.status === 400 || kotuAy.body.ay === 12,
    'status ' + kotuAy.status);
  const kotuTarih = await iste('/api/takvim/gun?tarih=abc', 'GET', null, M);
  kontrol('gecersiz tarih reddediliyor', kotuTarih.status === 400, JSON.stringify(kotuTarih.body));

  console.log();
  console.log('  GECTI: ' + gecti + '   KALDI: ' + kaldi);
  process.exit(kaldi ? 1 : 0);
})().catch(e => { console.error('TEST HATASI:', e.message, e.stack); process.exit(1); });
