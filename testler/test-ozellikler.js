/* Okulun özellikleri: müdür kullanmadığı bölümü kapatır.
   - yalnızca müdür görür ve değiştirir; bilinmeyen özellik reddedilir;
   - kapalı bölümün bütün uçları o okulun herkesine 403 (ozellikKapali) döner;
   - ilerleyiş ve takvim kapalı bölümü atlar; /api/me kapalı listeyi söyler;
   - veli çocuğunun okulunun kuralına tabidir; başka okulun öğrencisinin
     kimliğini isteğe eklemek kapıyı açmaz (yalnız bağlı olduğu çocuk sayılır);
   - yeniden açınca kayıtlar yerinde (silinmemiş). */
const { BASE, iste, girisYap, hesapAc, okulHesabi, mudurYap } = require('./giris');

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

  console.log('=== 5) SERVİS KAPALI: YOKLAMA, SIRA, NOT, BİNMEYECEK, SAATLER, TELEFON ===');
  const sK = 'ozsrv' + (Date.now() % 100000);
  await okulHesabi(M, 'servisci', { fullName: 'Özellik Sürücü', username: sK, password: 'Test1234!' });
  const S = await girisYap(sK, 'Test1234!');
  const sv = (await iste('/api/servis/kaydet', 'POST', { ad: 'Özellik servisi ' + z, soforId: S.user.id }, M)).body.id;
  await iste('/api/servis/ogrenci', 'POST', { servisId: sv, ogrenciId: o1.user.id }, M);
  const basla = await iste('/api/servis/sefer-basla', 'POST', { servisId: sv }, S.token);
  const anahtar = (await iste('/api/cihaz', 'POST', { ad: 'Servis telefonu' }, S.token)).body.cihazAnahtari;
  const konum = () => fetch(BASE + '/api/cihaz/servis-konum', { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Cihaz': anahtar },
    body: JSON.stringify({ seferId: basla.body.sefer && basla.body.sefer.id, enlem: 39.9, boylam: 32.8, dogruluk: 10 }) });
  kontrol('servis açıkken telefon konumu alınıyor', (await konum()).status === 200);
  /* Servisi açık ikinci okul ve onun öğrencisi (kimliği kapıyı atlatmaya denenecek). */
  const A = (await girisYap('admin@egitimevi.com', 'admin123')).token;
  await hesapAc({ fullName: 'Özellik Müdür', username: 'ozmudur' + z, email: 'ozmudur' + z + '@test.com' });
  const M2 = (await mudurYap('ozmudur' + z, 'Test1234!', { schoolName: 'Özellik Okulu ' + z, city: 'Ankara', district: 'Mamak' }, A)).token;
  const yabanci = await okulHesabi(M2, 'student', { fullName: 'Yabancı Öğrenci', username: 'ozogr' + z, password: 'Test1234!' });
  await iste('/api/ozellikler', 'POST', { kapali: ['servis'] }, M);
  const kapali = await Promise.all([
    iste('/api/servis/yoklama', 'GET', null, S.token),
    iste('/api/servis/yoklama', 'POST', { servisId: sv, ogrenciId: o1.user.id, durum: 'bindi' }, S.token),
    iste('/api/servis/sira', 'POST', { servisId: sv, donem: 'sabah', sira: [o1.user.id] }, S.token),
    iste('/api/servis/not', 'POST', { servisId: sv, metin: 'Kapalıyken' }, S.token),
    iste('/api/servis/binmeyecek', 'POST', { ogrenciId: o1.user.id, sabah: true }, V),
    iste('/api/servis/saatler', 'POST', { sabahBas: '07:00', sabahBit: '09:20', aksamBas: '16:30', aksamBit: '19:00' }, M),
    iste('/api/servis/okula-vardik', 'POST', { servisId: sv }, S.token)]);
  kontrol('servis kapalıyken yeni servis uçları 403 (ozellikKapali)', kapali.every(r => r.status === 403 && r.body.ozellikKapali === 'servis'),
    kapali.map(r => r.status).join(' '));
  const atlatma = await Promise.all([
    iste('/api/servis/yoklama?ogrenci=' + yabanci.id, 'GET', null, S.token),
    iste('/api/servis/sira', 'POST', { servisId: sv, donem: 'sabah', sira: [o1.user.id], ogrenciId: yabanci.id }, S.token),
    iste('/api/servis/sefer-basla', 'POST', { servisId: sv, ogrenciId: yabanci.id }, S.token),
    iste('/api/servis/okula-vardik', 'POST', { servisId: sv, ogrenciId: yabanci.id }, S.token),
    iste('/api/servis/saatler', 'POST', { sabahBas: '07:00', sabahBit: '09:20', aksamBas: '16:30', aksamBit: '19:00', ogrenciId: yabanci.id }, M),
    iste('/api/servis/harita?ogrenci=' + yabanci.id, 'GET', null, S.token)]);
  kontrol('başka okulun (servisi açık) öğrenci kimliğini eklemek kapalı servisin kapısını açmıyor (403)',
    atlatma.every(r => r.status === 403 && r.body.ozellikKapali === 'servis'), atlatma.map(r => r.status + ':' + (r.body.ozellikKapali || '')).join(' '));
  /* İki okulda çocuğu olan veli: ilk çocuğun okulunda servis kapalı, öteki okulda açık.
     Servis sayfası açılır (menüdeki kural), kapalı okuldaki çocuğun servisi gelmez. */
  await iste('/api/parent/link', 'POST', { code: yabanci.code }, V);
  const vServis = await iste('/api/servis', 'GET', null, V);
  const vO1 = (vServis.body.cocuklar || []).find(c => c.id === o1.user.id);
  const vYab = (vServis.body.cocuklar || []).find(c => c.id === yabanci.id);
  kontrol('iki okullu veli: bir okulda servis kapalıyken sayfa açılıyor, o okuldaki çocuğun servisi gelmiyor',
    vServis.status === 200 && vO1 && vO1.servis === null && vO1.bugun === null && !!vYab,
    vServis.status + ' ' + J(vServis.body.cocuklar || vServis.body));
  const vHarita = await iste('/api/servis/harita?ogrenci=' + o1.user.id, 'GET', null, V);
  kontrol('kapalı okuldaki çocuğun haritası yine 403', vHarita.status === 403 && vHarita.body.ozellikKapali === 'servis',
    vHarita.status + ' ' + J(vHarita.body));
  const kk = await konum();
  const kkBody = await kk.json().catch(() => ({}));
  kontrol('servis kapalıyken telefonun sefer konumu 403 (ozellikKapali)', kk.status === 403 && kkBody.ozellikKapali === 'servis', kk.status + ' ' + J(kkBody));
  const bil = await fetch(BASE + '/api/cihaz/bildirimler', { headers: { 'X-Cihaz': anahtar } });
  const bilBody = await bil.json().catch(() => ({}));
  kontrol('telefonun bildirim yoklaması sürüyor; servis saatleri gelmiyor', bil.status === 200 && bilBody.servisSaatleri === null, J(bilBody));
  await iste('/api/ozellikler', 'POST', { kapali: [] }, M);
  kontrol('servis yeniden açılınca yoklama açılıyor', (await iste('/api/servis/yoklama', 'GET', null, S.token)).status === 200);

  console.log();
  console.log('  GECTI: ' + gecti + '   KALDI: ' + kaldi);
  process.exit(kaldi ? 1 : 0);
})().catch(e => { console.error('TEST HATASI:', e.message, e.stack); process.exit(1); });
