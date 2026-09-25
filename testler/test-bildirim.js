/* Fazladan bildirim gitmiyor mu? Öğrencinin bildirimi velisine de gidiyor mu?
   Aynı olay ikinci kez kaydedilince (ödev sonucu, sınav notu, yoklama,
   ders programı) bildirim tekrar gitmemeli; yalnızca değişen kişiye gitmeli.
   Bildirim yoklaması değişiklik yoksa listeyi göndermemeli.
   Veli: öğrencinin her bildiriminin kopyası, başında çocuğun adıyla; iki
   çocukta karışmaz; devamsızlık gibi veliye zaten kendi metniyle gidenler
   ikinci kez gitmez. */
const { iste, girisYap, hesapAc } = require('./giris');

let gecti = 0, kaldi = 0;
function kontrol(ad, sart, detay) {
  if (sart) { gecti++; console.log('  GECTI  ' + ad); }
  else { kaldi++; console.log('  KALDI  ' + ad + (detay ? '  -> ' + detay : '')); }
}
const gun = n => { const d = new Date(); d.setDate(d.getDate() + n); return d.toISOString().slice(0, 10); };

/* Kişinin bildirimlerinde metni içeren kaç tane var? */
async function sayi(token, parca) {
  const r = await iste('/api/notifications', 'GET', null, token);
  return (r.body.notifications || []).filter(n => n.text.indexOf(parca) >= 0).length;
}

(async () => {
  const M = (await girisYap('mudur@test.com', 'Test1234!')).token;
  const O = (await girisYap('mat@test.com', 'Test1234!')).token;
  const S1 = (await girisYap('ogrenci1@test.com', 'Test1234!')).token;
  const S2 = (await girisYap('ogrenci2@test.com', 'Test1234!')).token;
  const s1 = (await iste('/api/me', 'GET', null, S1)).body.user;
  const s2 = (await iste('/api/me', 'GET', null, S2)).body.user;

  console.log('=== 1) ÖDEV SONUCU YALNIZCA DEĞİŞENE ===');
  const odev = await iste('/api/assignments', 'POST', { title: 'Bildirim deneme ödevi', description: 'x',
    startAt: gun(0), endAt: gun(3), studentIds: [s1.id, s2.id] }, O);
  const aid = odev.body.assignment.id;
  kontrol('yeni ödev bildirimi bir kez', await sayi(S1, 'Bildirim deneme ödevi') === 1);
  const ilk = await iste('/api/assignments/' + aid + '/finish', 'POST', { results: { [s1.id]: 'yapti', [s2.id]: 'gec' } }, O);
  kontrol('ilk sonuçlandırmada iki öğrenciye', ilk.body.bildirilen === 2, JSON.stringify(ilk.body.bildirilen));
  kontrol('bildirim ders, ödev ve sonucu yazıyor ("... dersinden "..." ödevi açıklandı: Geç yaptı")',
    ((await iste('/api/notifications', 'GET', null, S2)).body.notifications || [])
      .some(n => / dersinden "Bildirim deneme ödevi" ödevi açıklandı: Geç yaptı$/.test(n.text)));
  const ayni = await iste('/api/assignments/' + aid + '/finish', 'POST', { results: { [s1.id]: 'yapti', [s2.id]: 'gec' } }, O);
  kontrol('aynı sonuçlar yeniden kaydedilince bildirim yok', ayni.body.bildirilen === 0, JSON.stringify(ayni.body.bildirilen));
  const degisen = await iste('/api/assignments/' + aid + '/finish', 'POST', { results: { [s1.id]: 'yapti', [s2.id]: 'yapti' } }, O);
  kontrol('yalnızca sonucu değişen tek öğrenciye', degisen.body.bildirilen === 1, JSON.stringify(degisen.body.bildirilen));
  kontrol('ilk öğrenci toplam bir sonuç bildirimi aldı', await sayi(S1, '"Bildirim deneme ödevi" ödevi açıklandı') === 1);
  kontrol('sonucu değişen öğrenciye "sonucu değişti"', await sayi(S2, '"Bildirim deneme ödevi" ödevi sonucu değişti: Yaptı') === 1);

  console.log('=== 2) SINAV NOTU YALNIZCA İLK GİRİŞTE ===');
  const sinav = await iste('/api/exams', 'POST', { name: 'Bildirim deneme sınavı' }, O);
  const eid = sinav.body.exam.id;
  await iste('/api/exams/' + eid + '/grades', 'POST', { grades: { [s1.id]: '80' } }, O);
  kontrol('ilk not bildirildi', await sayi(S1, '"Bildirim deneme sınavı" sınavının sonucu') === 1);
  await iste('/api/exams/' + eid + '/grades', 'POST', { grades: { [s1.id]: '85,5' } }, O);
  kontrol('not düzeltilince yeni bildirim yok', await sayi(S1, '"Bildirim deneme sınavı" sınavının sonucu') === 1);
  const cift = await iste('/api/exams/' + eid + '/grades', 'POST',
    { grades: { [s2.id]: '70' }, degerler: { [s2.id]: { P: '75' } } }, O);
  const okunan = await iste('/api/exams/' + eid, 'GET', null, O);
  kontrol('aynı değer iki biçimde gelince hata yok, sonuncusu yazıldı', cift.status === 200 &&
    (okunan.body.students.find(s => s.id === s2.id) || {}).grade === 75, JSON.stringify(cift.body).slice(0, 100));

  console.log('=== 3) YOKLAMA YALNIZCA DEĞİŞENE ===');
  const dersler = (await iste('/api/devamsizlik/derslerim', 'GET', null, O)).body.dersler || [];
  const ders = dersler[0];
  kontrol('öğretmenin yoklama dersi var', !!ders);
  const tarih = gun(-1);
  const yoklama = durum => iste('/api/devamsizlik/yoklama', 'POST', { lessonId: ders.id, tarih,
    girisler: [{ ogrenciId: s1.id, durum }, { ogrenciId: s2.id, durum: 'var' }] }, O);
  const once = await sayi(S1, ders.ders + ' dersi');
  await yoklama('yok');
  kontrol('devamsızlık bildirildi', await sayi(S1, ders.ders + ' dersi') === once + 1);
  await yoklama('yok');
  kontrol('aynı yoklama yeniden kaydedilince bildirim yok', await sayi(S1, ders.ders + ' dersi') === once + 1);
  await yoklama('gec');
  kontrol('durum değişince yeni bildirim', await sayi(S1, ders.ders + ' dersi') === once + 2);
  const isaretle = durum => iste('/api/devamsizlik/isaretle', 'POST', { studentId: s1.id, lessonId: ders.id, tarih, durum }, O);
  await isaretle('gec');
  kontrol('tek işarette de aynı durum bildirilmiyor', await sayi(S1, ders.ders + ' dersi') === once + 2);

  console.log('=== 4) DERS PROGRAMI: ÖĞRETMENE GÜNDE BİR ===');
  const siniflar = (await iste('/api/school/classes', 'GET', null, M)).body.classes;
  const program = await iste('/api/school/schedule?classId=' + siniflar[0].id, 'GET', null, M);
  const matDersi = (program.body.lessons || []).find(l => l.subject === 'Matematik');
  const programOnce = await sayi(O, 'Ders programına yeni ders saatlerin eklendi');
  for (const [bas, bit] of [['08:00', '08:40'], ['08:50', '09:30'], ['09:40', '10:20']]) {
    await iste('/api/school/schedule-add', 'POST', { classId: siniflar[0].id, day: 6, lessonId: matDersi.id, start: bas, end: bit }, M);
  }
  kontrol('üç ders saati eklendi, öğretmene en fazla bir bildirim',
    await sayi(O, 'Ders programına yeni ders saatlerin eklendi') <= programOnce + 1);

  console.log('=== 5) BİLDİRİM YOKLAMASI ===');
  const b1 = await iste('/api/notifications', 'GET', null, S1);
  kontrol('ilk yoklamada liste ve sürüm geliyor', Array.isArray(b1.body.notifications) && !!b1.body.surum);
  const b2 = await iste('/api/notifications?surum=' + encodeURIComponent(b1.body.surum), 'GET', null, S1);
  kontrol('değişiklik yoksa liste gönderilmiyor', b2.body.ayni === true && !b2.body.notifications,
    JSON.stringify(b2.body).slice(0, 80));
  kontrol('değişiklik yokken cevap çok küçük', JSON.stringify(b2.body).length < 120);
  await iste('/api/notifications/read', 'POST', {}, S1);
  const b3 = await iste('/api/notifications?surum=' + encodeURIComponent(b1.body.surum), 'GET', null, S1);
  kontrol('okununca sürüm değişiyor, liste yeniden geliyor', !b3.body.ayni && b3.body.unread === 0);

  console.log('=== 6) VELİYE ÇOCUĞUN ADIYLA ===');
  const vK = 'bveli' + Date.now().toString(36);
  await hesapAc({ fullName: 'Bildirim Veli', username: vK, email: vK + '@test.com' });
  const V = (await girisYap(vK, 'Test1234!')).token;
  const v = (await iste('/api/me', 'GET', null, V)).body.user;
  await iste('/api/parent/link', 'POST', { code: s1.code }, V);
  await iste('/api/parent/link', 'POST', { code: s2.code }, V);
  const veliListe = async () => (await iste('/api/notifications', 'GET', null, V)).body.notifications || [];
  const odev2 = await iste('/api/assignments', 'POST', { title: 'Veli kopyası ödevi', description: 'x',
    startAt: gun(0), endAt: gun(3), studentIds: [s1.id, s2.id] }, O);
  let vl = await veliListe();
  kontrol('iki çocuğun yeni ödevi veliye ayrı ayrı, başında çocuğun adı',
    vl.filter(n => n.text === s1.fullName + ' · Yeni ödev: ' + odev2.body.assignment.title + ' (' + odev2.body.assignment.subject + ')').length === 1 &&
    vl.filter(n => n.text.indexOf(s2.fullName + ' · Yeni ödev: Veli kopyası ödevi') === 0).length === 1, JSON.stringify(vl.slice(0, 3).map(n => n.text)));
  await iste('/api/assignments/' + odev2.body.assignment.id + '/finish', 'POST', { results: { [s1.id]: 'yapti' } }, O);
  vl = await veliListe();
  const sonucKopya = vl.find(n => n.text.indexOf(s1.fullName + ' · ') === 0 && / dersinden "Veli kopyası ödevi" ödevi açıklandı: Yaptı$/.test(n.text));
  kontrol('ödev sonucu veliye çocuğun adıyla', !!sonucKopya, JSON.stringify(vl.slice(0, 3).map(n => n.text)));
  kontrol('velinin bildirimi o çocuğun ödevlerini açar (#/veli-odevler?c=)', sonucKopya && sonucKopya.link === '#/veli-odevler?c=' + s1.id,
    sonucKopya && sonucKopya.link);
  kontrol('öteki çocuğa sonuç girilmediği için onun adıyla sonuç yok',
    !vl.some(n => n.text.indexOf(s2.fullName + ' · ') === 0 && /Veli kopyası ödevi" ödevi açıklandı/.test(n.text)));
  const devOnce = (await veliListe()).length;
  await iste('/api/devamsizlik/yoklama', 'POST', { lessonId: ders.id, tarih: gun(-2), saat: '10:10',
    girisler: [{ ogrenciId: s1.id, durum: 'yok' }, { ogrenciId: s2.id, durum: 'var' }] }, O);
  vl = await veliListe();
  kontrol('devamsızlık veliye bir kez ("Çocuğunuz ... gelmedi"), ikinci kopya yok',
    vl.length === devOnce + 1 && /^Çocuğunuz /.test(vl[0].text), JSON.stringify(vl.slice(0, 2).map(n => n.text)));
  const kendisi = await sayi(S1, 'Veli kopyası ödevi');
  kontrol('öğrencinin kendi bildirimi değişmedi (adsız)', kendisi === 2, 'sayı ' + kendisi);
  kontrol('veli kendi hesabında başka öğrencinin bildirimini görmez', v && !vl.some(n => / · /.test(n.text) &&
    n.text.indexOf(s1.fullName) !== 0 && n.text.indexOf(s2.fullName) !== 0));

  console.log('');
  console.log('GECTI: ' + gecti + '   KALDI: ' + kaldi);
  process.exit(kaldi ? 1 : 0);
})().catch(e => { console.error('TEST HATASI:', e); process.exit(1); });
