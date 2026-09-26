/* Okulun özellikleri: müdür kullanmadığı bölümü kapatır.
   - yalnızca müdür görür ve değiştirir; bilinmeyen özellik reddedilir;
   - kapalı bölümün bütün uçları o okulun herkesine 403 (ozellikKapali) döner;
   - ilerleyiş ve takvim kapalı bölümü atlar; /api/me kapalı listeyi söyler;
   - veli çocuğunun okulunun kuralına tabidir;
   - yeniden açınca kayıtlar yerinde (silinmemiş). */
const { BASE, iste, girisYap, hesapAc } = require('./giris');

let gecti = 0, kaldi = 0;
function kontrol(ad, sart, detay) {
  if (sart) { gecti++; console.log('  GECTI  ' + ad); }
  else { kaldi++; console.log('  KALDI  ' + ad + (detay ? '  -> ' + detay : '')); }
}
const J = x => JSON.stringify(x).slice(0, 220);
const gun = n => new Date(Date.now() + n * 86400000).toISOString().slice(0, 10);

(async () => {
  const z = Date.now().toString(36);
  const M = (await girisYap('mudur@test.com', 'Test1234!')).token;
  const mat = await girisYap('mat@test.com', 'Test1234!');
  const o1 = await girisYap('ogrenci1@test.com', 'Test1234!');

  console.log('=== 1) KİM GÖRÜR ===');
  const liste = await iste('/api/ozellikler', 'GET', null, M);
  kontrol('müdür 8 özelliği açık görüyor', liste.status === 200 && liste.body.ozellikler.length === 8 &&
    liste.body.ozellikler.every(o => o.acik), J(liste.body));
  const ogretmen = await iste('/api/ozellikler', 'GET', null, mat.token);
  kontrol('öğretmen özellik sayfasına giremiyor', ogretmen.status === 403, 'status ' + ogretmen.status);
  const ogrDegis = await iste('/api/ozellikler', 'POST', { kapali: ['odev'] }, o1.token);
  kontrol('öğrenci özellik kapatamıyor', ogrDegis.status === 403, 'status ' + ogrDegis.status);
  const bilinmeyen = await iste('/api/ozellikler', 'POST', { kapali: ['mesaj'] }, M);
  kontrol('bilinmeyen özellik reddedildi', bilinmeyen.status === 400, J(bilinmeyen.body));

  /* Kapatmadan önce bir ödev: yeniden açılınca yerinde olmalı. */
  const odev = await iste('/api/assignments', 'POST', { title: 'Özellik denemesi ' + z, description: 'x', startAt: gun(0),
    endAt: gun(3), studentIds: [o1.user.id] }, mat.token);
  kontrol('ödev verildi (kapatmadan önce)', odev.status === 200, J(odev.body));

  console.log('=== 2) ÖDEV VE ETÜT KAPALI ===');
  const kapat = await iste('/api/ozellikler', 'POST', { kapali: ['odev', 'etut'] }, M);
  kontrol('müdür ödev ve etüdü kapattı', kapat.status === 200 && J(kapat.body.kapali) === J(['odev', 'etut']), J(kapat.body));
  const matOdev = await iste('/api/assignments', 'GET', null, mat.token);
  kontrol('öğretmen ödev listesine giremiyor (403, ozellikKapali)', matOdev.status === 403 && matOdev.body.ozellikKapali === 'odev',
    J(matOdev.body));
  const matYeni = await iste('/api/assignments', 'POST', { title: 'Kapalıyken', startAt: gun(0), endAt: gun(2), studentIds: [o1.user.id] }, mat.token);
  kontrol('kapalıyken yeni ödev verilemiyor', matYeni.status === 403, 'status ' + matYeni.status);
  const etut = await iste('/api/etut', 'GET', null, mat.token);
  kontrol('etüt de kapalı', etut.status === 403 && etut.body.ozellikKapali === 'etut', J(etut.body));
  const sinav = await iste('/api/exams', 'GET', null, mat.token);
  kontrol('sınavlar açık kaldı', sinav.status === 200, 'status ' + sinav.status);
  const ek = await fetch(BASE + '/api/ek/yukle?tur=odev', { method: 'POST', headers: { Authorization: 'Bearer ' + mat.token,
    'Content-Type': 'application/octet-stream', 'X-Dosya-Adi': 'kagit.pdf' }, body: Buffer.from('%PDF-1.4\n') });
  kontrol('ödeve ek yüklenemiyor', ek.status === 403, 'status ' + ek.status);
  const ben = await iste('/api/me', 'GET', null, o1.token);
  kontrol('/api/me kapalı listeyi söylüyor', J(ben.body.kapaliOzellikler) === J(['odev', 'etut']), J(ben.body.kapaliOzellikler));
  const ilerleme = await iste('/api/progress', 'GET', null, o1.token);
  kontrol('ilerleyişte ödev gelmiyor', ilerleme.status === 200 && ilerleme.body.assignments.length === 0 &&
    (ilerleme.body.kapaliOzellikler || []).indexOf('odev') >= 0, J(ilerleme.body.assignments));
  const takvim = await iste('/api/takvim?yil=' + new Date().getFullYear() + '&ay=' + (new Date().getMonth() + 1), 'GET', null, o1.token);
  const takvimOdev = (takvim.body.gunler || []).some(g => (g.odevler || []).length || (g.olaylar || []).some(x => x.tur === 'odev'));
  kontrol('takvimde ödev yok', takvim.status === 200 && !takvimOdev, 'status ' + takvim.status);
  const ogrOdevDosya = await iste('/api/odev-dosya?odev=' + (odev.body.assignment && odev.body.assignment.id), 'GET', null, o1.token);
  kontrol('öğrenci teslim dosyalarına da giremiyor', ogrOdevDosya.status === 403, 'status ' + ogrOdevDosya.status);

  console.log('=== 3) VELİ ÇOCUĞUN OKULUNA BAKAR ===');
  const vK = 'ozveli' + z;
  await hesapAc({ fullName: 'Özellik Veli', username: vK, email: vK + '@test.com' });
  const V = (await girisYap(vK, 'Test1234!')).token;
  const kod = (await iste('/api/me', 'GET', null, o1.token)).body.user.code;
  await iste('/api/parent/link', 'POST', { code: kod }, V);
  const vDevam = await iste('/api/devamsizlik/ogrenci?studentId=' + o1.user.id, 'GET', null, V);
  kontrol('devamsızlık açıkken veli görüyor', vDevam.status === 200, 'status ' + vDevam.status);
  await iste('/api/ozellikler', 'POST', { kapali: ['odev', 'etut', 'devamsizlik'] }, M);
  const vDevam2 = await iste('/api/devamsizlik/ogrenci?studentId=' + o1.user.id, 'GET', null, V);
  kontrol('devamsızlık kapanınca veli de göremiyor', vDevam2.status === 403 && vDevam2.body.ozellikKapali === 'devamsizlik',
    J(vDevam2.body));
  const vBen = await iste('/api/me', 'GET', null, V);
  kontrol('velinin menüsü çocuğun okulundaki kapalıları biliyor', (vBen.body.kapaliOzellikler || []).indexOf('devamsizlik') >= 0,
    J(vBen.body.kapaliOzellikler));

  console.log('=== 4) YENİDEN AÇ ===');
  const ac = await iste('/api/ozellikler', 'POST', { kapali: [] }, M);
  kontrol('hepsi yeniden açıldı', ac.status === 200 && ac.body.kapali.length === 0, J(ac.body));
  const matOdev2 = await iste('/api/assignments', 'GET', null, mat.token);
  kontrol('ödev yerinde (silinmemiş)', matOdev2.status === 200 &&
    (matOdev2.body.assignments || []).some(a => a.title === 'Özellik denemesi ' + z), 'status ' + matOdev2.status);
  const kayit = await iste('/api/islem-kaydi', 'GET', null, M);
  kontrol('işlem kaydında görünüyor', J(kayit.body).indexOf('okul.ozellik') >= 0, J((kayit.body.kayitlar || []).slice(0, 2)));

  console.log();
  console.log('  GECTI: ' + gecti + '   KALDI: ' + kaldi);
  process.exit(kaldi ? 1 : 0);
})().catch(e => { console.error('TEST HATASI:', e.message, e.stack); process.exit(1); });
