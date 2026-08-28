/* Devamsizlik testleri. */
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

function gun(n) {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
}

(async () => {
  const mudur = await girisYap('mudur@test.com', 'Test1234!');
  const M = mudur.token;
  const ogretmen = await girisYap('mat@test.com', 'Test1234!');
  const O = ogretmen.token;

  /* --- hazirlik: sinif, ders, ogrenci yerlestirme --- */
  await iste('/api/school/class', 'POST', { name: 'DV-SINIF' }, M);
  const siniflar = await iste('/api/school/classes', 'GET', null, M);
  const sinif = (siniflar.body.classes || []).find(c => c.name === 'DV-SINIF');
  kontrol('test sinifi hazir', !!sinif);

  const dersEkle = await iste('/api/school/lesson', 'POST',
    { classId: sinif.id, subject: 'Matematik', weeklyHours: 4 }, M);
  const dersId = dersEkle.body.lesson ? dersEkle.body.lesson.id : '';
  kontrol('ders acildi', !!dersId, JSON.stringify(dersEkle.body).slice(0, 120));

  const ogrListe = await iste('/api/school/students', 'GET', null, M);
  const o1 = ogrListe.body.students.find(x => x.email === 'ogrenci1@test.com');
  const o2 = ogrListe.body.students.find(x => x.email === 'ogrenci2@test.com');
  await iste('/api/school/class-assign', 'POST', { studentId: o1.id, classId: sinif.id }, M);
  await iste('/api/school/class-assign', 'POST', { studentId: o2.id, classId: sinif.id }, M);

  /* derse ogretmen ata */
  const ogretmenListe = await iste('/api/school/teacher-list', 'GET', null, M);
  const mat = (ogretmenListe.body.teachers || []).find(t => t.fullName === 'Ayşe Kaya');
  await iste('/api/school/lesson-update', 'POST',
    { lessonId: dersId, teacherId: mat.id }, M);

  console.log('=== 1) OGRETMENIN DERSLERI ===');
  const derslerim = await iste('/api/devamsizlik/derslerim', 'GET', null, O);
  kontrol('ogretmen kendi dersini goruyor',
    (derslerim.body.dersler || []).some(d => d.id === dersId),
    JSON.stringify(derslerim.body).slice(0, 160));

  console.log('=== 2) YOKLAMA EKRANI ===');
  const ekran = await iste('/api/devamsizlik/yoklama?lessonId=' + dersId, 'GET', null, O);
  kontrol('yoklama ekrani acildi', ekran.status === 200, JSON.stringify(ekran.body).slice(0, 120));
  kontrol('sinifin ogrencileri listelendi', (ekran.body.ogrenciler || []).length === 2,
    'ogrenci ' + (ekran.body.ogrenciler || []).length);
  kontrol('varsayilan durum geldi',
    (ekran.body.ogrenciler || []).every(o => o.durum === 'var'));

  console.log('=== 3) YOKLAMA KAYDI ===');
  const kaydet = await iste('/api/devamsizlik/yoklama', 'POST', {
    lessonId: dersId, tarih: gun(-1),
    girisler: [
      { ogrenciId: o1.id, durum: 'yok', not: 'Haber verilmedi' },
      { ogrenciId: o2.id, durum: 'var' }
    ]
  }, O);
  kontrol('yoklama kaydedildi', kaydet.status === 200, JSON.stringify(kaydet.body));
  kontrol('sadece devamsizlik yazildi (var tutulmuyor)', kaydet.body.yazilan === 1,
    'yazilan ' + kaydet.body.yazilan);

  console.log('=== 4) OGRENCI KENDI DOKUMUNU GORUYOR ===');
  const S = (await girisYap('ogrenci1@test.com', 'Test1234!')).token;
  const benim = await iste('/api/devamsizlik/benim', 'GET', null, S);
  kontrol('ogrenci dokumu geldi', benim.status === 200 && benim.body.sayim.yok === 1,
    JSON.stringify(benim.body.sayim));
  kontrol('kayit ayrintisi dolu',
    (benim.body.kayitlar || []).length === 1 &&
    benim.body.kayitlar[0].ders === 'Matematik',
    JSON.stringify(benim.body.kayitlar).slice(0, 150));
  kontrol('kim aldigi yaziyor', benim.body.kayitlar[0].alan === 'Ayşe Kaya',
    benim.body.kayitlar[0].alan);

  const S2 = (await girisYap('ogrenci2@test.com', 'Test1234!')).token;
  const benim2 = await iste('/api/devamsizlik/benim', 'GET', null, S2);
  kontrol('derse gelen ogrencinin kaydi yok', benim2.body.sayim.yok === 0,
    JSON.stringify(benim2.body.sayim));

  console.log('=== 5) VELI COCUGUNU GORUYOR ===');
  await kayit({
    role: 'parent', fullName: 'Devam Veli', email: 'veli-devam@test.com',
    password: 'Test1234!', city: 'Ankara', district: 'Çankaya'
  });
  const V = (await girisYap('veli-devam@test.com', 'Test1234!')).token;
  await iste('/api/parent/link', 'POST', { code: o1.code }, V);
  const veliGor = await iste('/api/devamsizlik/ogrenci?studentId=' + o1.id, 'GET', null, V);
  kontrol('veli cocugunun devamsizligini goruyor',
    veliGor.status === 200 && veliGor.body.sayim.yok === 1,
    JSON.stringify(veliGor.body.sayim || veliGor.body));

  const veliBaskasi = await iste('/api/devamsizlik/ogrenci?studentId=' + o2.id, 'GET', null, V);
  kontrol('veli baskasinin cocugunu goremiyor', veliBaskasi.status === 403,
    'status ' + veliBaskasi.status);

  console.log('=== 6) OGRENCI BASKASININ KAYDINI GOREMEZ ===');
  const ogrBaskasi = await iste('/api/devamsizlik/ogrenci?studentId=' + o2.id, 'GET', null, S);
  kontrol('ogrenci baska ogrenciyi goremiyor', ogrBaskasi.status === 403,
    'status ' + ogrBaskasi.status);

  console.log('=== 7) UZERINE YAZMA ===');
  const tekrar = await iste('/api/devamsizlik/yoklama', 'POST', {
    lessonId: dersId, tarih: gun(-1),
    girisler: [
      { ogrenciId: o1.id, durum: 'izinli', not: 'Rapor getirdi' },
      { ogrenciId: o2.id, durum: 'gec' }
    ]
  }, O);
  kontrol('ayni gun tekrar alinabiliyor', tekrar.status === 200 && tekrar.body.yazilan === 2,
    JSON.stringify(tekrar.body));
  const sonra = await iste('/api/devamsizlik/benim', 'GET', null, S);
  kontrol('eski kayit ustune yazildi',
    sonra.body.sayim.yok === 0 && sonra.body.sayim.izinli === 1,
    JSON.stringify(sonra.body.sayim));
  kontrol('kayit tekrarlanmadi', sonra.body.toplam === 1, 'toplam ' + sonra.body.toplam);

  console.log('=== 8) ILERI TARIH ===');
  const ileri = await iste('/api/devamsizlik/yoklama', 'POST', {
    lessonId: dersId, tarih: gun(3),
    girisler: [{ ogrenciId: o1.id, durum: 'yok' }]
  }, O);
  kontrol('ileri tarihe yoklama alinamiyor', ileri.status === 400, JSON.stringify(ileri.body));

  console.log('=== 9) OKUL OZETI ===');
  const ozet = await iste('/api/devamsizlik/ozet', 'GET', null, M);
  kontrol('mudur okul ozetini goruyor', ozet.status === 200,
    JSON.stringify(ozet.body).slice(0, 130));
  kontrol('ozette ogrenciler var', (ozet.body.satirlar || []).length >= 2,
    'satir ' + (ozet.body.satirlar || []).length);
  kontrol('ozette sinif adi var',
    (ozet.body.satirlar || []).every(x => x.sinif === 'DV-SINIF'),
    JSON.stringify(ozet.body.satirlar).slice(0, 150));

  const ozetOgr = await iste('/api/devamsizlik/ozet', 'GET', null, S);
  kontrol('ogrenci okul ozetini goremiyor', ozetOgr.status === 403,
    'status ' + ozetOgr.status);

  console.log('=== 10) YETKISIZ YOKLAMA ===');
  const fen = await girisYap('fen@test.com', 'Test1234!');
  const yetkisiz = await iste('/api/devamsizlik/yoklama', 'POST', {
    lessonId: dersId, tarih: gun(-2),
    girisler: [{ ogrenciId: o1.id, durum: 'yok' }]
  }, fen.token);
  kontrol('baska ogretmen bu derse yoklama alamiyor', yetkisiz.status === 403,
    'status ' + yetkisiz.status);

  const ogrYoklama = await iste('/api/devamsizlik/yoklama', 'POST', {
    lessonId: dersId, tarih: gun(-2),
    girisler: [{ ogrenciId: o1.id, durum: 'var' }]
  }, S);
  kontrol('ogrenci yoklama alamiyor', ogrYoklama.status === 403,
    'status ' + ogrYoklama.status);

  console.log();
  console.log('  GECTI: ' + gecti + '   KALDI: ' + kaldi);
  process.exit(kaldi ? 1 : 0);
})().catch(e => { console.error('TEST HATASI:', e.message, e.stack); process.exit(1); });
