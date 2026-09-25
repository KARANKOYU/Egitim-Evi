/* Sınavlar: şablonlar, grupsuz sınav, ondalıklı (virgüllü) değer, aralık
   denetimi, "+ yeni değer ekle", grafik verisi, grup ortalaması.
   Ödevin açılma zamanı ve "geç yaptı" sonucu da burada. */
const { iste, girisYap } = require('./giris');

let gecti = 0, kaldi = 0;
function kontrol(ad, sart, detay) {
  if (sart) { gecti++; console.log('  GECTI  ' + ad); }
  else { kaldi++; console.log('  KALDI  ' + ad + (detay ? '  -> ' + detay : '')); }
}
const kisa = v => JSON.stringify(v).slice(0, 160);

(async () => {
  const O = (await girisYap('mat@test.com', 'Test1234!')).token;
  const F = (await girisYap('fen@test.com', 'Test1234!')).token;
  const S = (await girisYap('ogrenci1@test.com', 'Test1234!')).token;
  const ben = (await iste('/api/me', 'GET', null, S)).body.user;

  console.log('=== 1) ŞABLONLAR ===');
  const ilk = await iste('/api/exams/sablonlar', 'GET', null, O);
  kontrol('hazır şablonlar önerildi', ilk.status === 200 && ilk.body.hazir.length === 3, kisa(ilk.body));

  const lgs = await iste('/api/exams/sablonlar', 'POST', { hazir: 'lgs' }, O);
  kontrol('hazır LGS şablonu okula eklendi', lgs.status === 200 && lgs.body.sablon.olcumler.length === 7, kisa(lgs.body));
  const ikinci = await iste('/api/exams/sablonlar', 'POST', { hazir: 'lgs' }, O);
  kontrol('aynı hazır şablon ikinci kez açılmaz', ikinci.body.sablon && ikinci.body.sablon.id === lgs.body.sablon.id);

  const ozel = await iste('/api/exams/sablonlar', 'POST', {
    name: 'Deneme 0-500',
    olcumler: [{ ad: 'Doğru', alt: 0, ust: 90 }, { ad: 'Puan', alt: '0', ust: '500', ana: true }]
  }, O);
  kontrol('elle şablon açıldı, kod üretildi', ozel.status === 200 &&
    ozel.body.sablon.olcumler[0].kod === 'D' && ozel.body.sablon.olcumler[1].ana === true, kisa(ozel.body));

  const kotuAralik = await iste('/api/exams/sablonlar', 'POST',
    { name: 'Bozuk', olcumler: [{ ad: 'X', alt: 50, ust: 10 }] }, O);
  kontrol('alt > üst reddedildi', kotuAralik.status === 400, kisa(kotuAralik.body));
  const sinirDisi = await iste('/api/exams/sablonlar', 'POST',
    { name: 'Bozuk2', olcumler: [{ ad: 'X', alt: -20000, ust: 10 }] }, O);
  kontrol('-10000 altı reddedildi', sinirDisi.status === 400, kisa(sinirDisi.body));
  const ayniAd = await iste('/api/exams/sablonlar', 'POST',
    { name: 'Deneme 0-500', olcumler: [{ ad: 'P' }] }, O);
  kontrol('aynı adlı şablon reddedildi', ayniAd.status === 400, kisa(ayniAd.body));

  const baskasi = await iste('/api/exams/sablonlar/' + ozel.body.sablon.id, 'POST',
    { name: 'Değişti', olcumler: [{ ad: 'P' }] }, F);
  kontrol('başka öğretmen şablonu değiştiremez', baskasi.status === 403, kisa(baskasi.body));
  const okuyabilir = await iste('/api/exams/sablonlar', 'GET', null, F);
  kontrol('şablon okulun tamamına görünür', okuyabilir.body.sablonlar.some(s => s.id === ozel.body.sablon.id));

  console.log('=== 2) GRUPSUZ SINAV VE ONDALIK DEĞER ===');
  const sinav1 = await iste('/api/exams', 'POST',
    { name: 'LGS Deneme 1', templateId: lgs.body.sablon.id, tarih: '2026-09-10' }, O);
  kontrol('grupsuz sınav açıldı', sinav1.status === 200 && !sinav1.body.exam.groupId, kisa(sinav1.body));
  const e1 = sinav1.body.exam.id;

  const detay = await iste('/api/exams/' + e1, 'GET', null, O);
  kontrol('öğrenciler sınıf adıyla geldi', detay.body.students.some(s => s.id === ben.id && s.className), kisa(detay.body.students));

  const yaz = await iste('/api/exams/' + e1 + '/grades', 'POST', {
    degerler: { [ben.id]: { TR: '15,5', MAT: '12', LGS: '490,161' } }
  }, O);
  kontrol('virgüllü değer kabul edildi', yaz.status === 200 && yaz.body.atlanan === 0, kisa(yaz.body));
  const oku = await iste('/api/exams/' + e1, 'GET', null, O);
  const satir = oku.body.students.find(s => s.id === ben.id);
  kontrol('490,161 -> 490.161 saklandı', satir && satir.degerler.LGS === 490.161 && satir.degerler.TR === 15.5, kisa(satir));
  kontrol('ana ölçüm grade alanında', satir && satir.grade === 490.161);

  const disari = await iste('/api/exams/' + e1 + '/grades', 'POST',
    { degerler: { [ben.id]: { LGS: '600', MAT: 'abc' } } }, O);
  kontrol('aralık dışı ve sayı olmayan atlandı', disari.body.atlanan === 2, kisa(disari.body));
  const oku2 = await iste('/api/exams/' + e1, 'GET', null, O);
  kontrol('atlanan değer eskisini bozmadı', oku2.body.students.find(s => s.id === ben.id).degerler.LGS === 490.161);

  const baskaOgretmen = await iste('/api/exams/' + e1 + '/grades', 'POST',
    { degerler: { [ben.id]: { LGS: '300' } } }, F);
  kontrol('başka öğretmen not giremez', baskaOgretmen.status === 403);

  console.log('=== 3) + YENİ DEĞER EKLE ===');
  const mevcut = oku2.body.exam.olcumler;
  const yeniListe = mevcut.concat([{ ad: 'Doğru Sayısı', alt: 0, ust: 90 }]);
  const ekle = await iste('/api/exams/' + e1 + '/olcumler', 'POST', { olcumler: yeniListe }, O);
  kontrol('yeni değer alanı eklendi', ekle.status === 200 && ekle.body.exam.olcumler.length === 8, kisa(ekle.body));
  const oku3 = await iste('/api/exams/' + e1, 'GET', null, O);
  kontrol('eski değerler korundu', oku3.body.students.find(s => s.id === ben.id).degerler.LGS === 490.161);

  const daralt = oku3.body.exam.olcumler.map(o => o.kod === 'LGS' ? Object.assign({}, o, { ust: 400 }) : o);
  const dar = await iste('/api/exams/' + e1 + '/olcumler', 'POST', { olcumler: daralt }, O);
  kontrol('girilmiş değeri dışarıda bırakan daraltma reddedildi', dar.status === 400, kisa(dar.body));

  console.log('=== 4) GRAFİK ===');
  const sinav2 = await iste('/api/exams', 'POST',
    { name: 'LGS Deneme 2', templateId: lgs.body.sablon.id, tarih: '2026-09-20' }, O);
  await iste('/api/exams/' + sinav2.body.exam.id + '/grades', 'POST',
    { degerler: { [ben.id]: { LGS: '455,5' } } }, O);
  const grafik = await iste('/api/exams/grafik', 'GET', null, S);
  kontrol('öğrenci kendi grafiğini görür', grafik.status === 200 && grafik.body.sablonlar.length === 1, kisa(grafik.body));
  kontrol('sınavlar tarih sırasıyla', grafik.body.sinavlar.length === 2 &&
    grafik.body.sinavlar[0].tarih === '2026-09-10', kisa(grafik.body.sinavlar));
  kontrol('bant bilgisi var', grafik.body.sinavlar[0].bant && grafik.body.sinavlar[0].bant.LGS &&
    grafik.body.sinavlar[0].bant.LGS.ust === 490.161, kisa(grafik.body.sinavlar[0].bant));
  const yabanci = await iste('/api/exams/grafik?ogrenci=' + ben.id, 'GET', null,
    (await girisYap('ogrenci2@test.com', 'Test1234!')).token);
  kontrol('başka öğrencinin grafiği görülemez', yabanci.status === 403);

  console.log('=== 5) GRUP ORTALAMASI (100 ÜZERİNDEN) ===');
  const grup = await iste('/api/examgroups', 'POST', { name: 'Dönem 1' }, O);
  const g = grup.body.group.id;
  const yazili = await iste('/api/exams', 'POST', { name: 'Yazılı 1', groupId: g, weight: 50 }, O);
  const deneme = await iste('/api/exams', 'POST', { name: 'Deneme', groupId: g, weight: 50, templateId: ozel.body.sablon.id }, O);
  kontrol('grupta etki oranı şart', (await iste('/api/exams', 'POST', { name: 'X', groupId: g }, O)).status === 400);
  await iste('/api/exams/' + yazili.body.exam.id + '/grades', 'POST', { grades: { [ben.id]: 80 } }, O);
  await iste('/api/exams/' + deneme.body.exam.id + '/grades', 'POST', { grades: { [ben.id]: '400' } }, O);
  const gd = await iste('/api/examgroups/' + g, 'GET', null, O);
  const ort = gd.body.averages.find(a => a.id === ben.id);
  kontrol('0-100 ile 0-500 birlikte: (80 + 80) / 2 = 80', ort && ort.average === 80, kisa(ort));

  const ilerleyis = await iste('/api/progress', 'GET', null, S);
  kontrol('ilerleyişte grupsuz sınavlar listelendi', (ilerleyis.body.exams || []).length === 2, kisa(ilerleyis.body.exams));
  kontrol('ilerleyişte grup ortalaması', ilerleyis.body.examGroups.some(x => x.average === 80));

  console.log('=== 6) ÖDEV AÇILDI VE GEÇ YAPTI ===');
  const liste = await iste('/api/progress', 'GET', null, S);
  const odev = liste.body.assignments.find(a => a.status === 'active');
  kontrol('açılmamış ödev işaretli', odev && odev.acildi === false, kisa(odev));
  const ac = await iste('/api/assignments/' + odev.id + '/acildi', 'POST', {}, S);
  kontrol('öğrenci ödevi açtı', ac.status === 200, kisa(ac.body));
  const ogretmenGoru = await iste('/api/assignments/' + odev.id, 'GET', null,
    odev.teacherName === 'Ali Yıldız' ? F : O);
  const bende = (ogretmenGoru.body.students || []).find(s => s.id === ben.id);
  kontrol('öğretmen açılma zamanını görür', bende && !!bende.acilma, kisa(ogretmenGoru.body));
  await iste('/api/assignments/' + odev.id + '/acildi', 'POST', {}, S);
  const ikinciAcilis = await iste('/api/assignments/' + odev.id, 'GET', null, odev.teacherName === 'Ali Yıldız' ? F : O);
  kontrol('ilk açılış zamanı değişmez', ikinciAcilis.body.students.find(s => s.id === ben.id).acilma === bende.acilma);
  const baskaAcma = await iste('/api/assignments/' + odev.id + '/acildi', 'POST', {},
    (await girisYap('mudur@test.com', 'Test1234!')).token);
  kontrol('öğrenci olmayan "açıldı" diyemez', baskaAcma.status === 403, kisa(baskaAcma.body));

  const gecSonuc = await iste('/api/assignments/' + odev.id + '/finish', 'POST',
    { results: { [ben.id]: 'gec' } }, odev.teacherName === 'Ali Yıldız' ? F : O);
  kontrol('"geç yaptı" sonucu kaydedildi', gecSonuc.status === 200 && gecSonuc.body.assignment.results[ben.id] === 'gec', kisa(gecSonuc.body));
  const bosalt = await iste('/api/assignments/' + odev.id + '/finish', 'POST',
    { results: { [ben.id]: '' } }, odev.teacherName === 'Ali Yıldız' ? F : O);
  kontrol('boş seçim ("— Seç —") sonucu kaldırır', bosalt.status === 200 && !bosalt.body.assignment.results[ben.id], kisa(bosalt.body));
  const kotuSonuc = await iste('/api/assignments/' + odev.id + '/finish', 'POST',
    { results: { [ben.id]: 'uydurma' } }, odev.teacherName === 'Ali Yıldız' ? F : O);
  kontrol('tanımsız sonuç yazılmaz', kotuSonuc.status === 200 && !kotuSonuc.body.assignment.results[ben.id], kisa(kotuSonuc.body));

  console.log('');
  console.log('GECTI: ' + gecti + '   KALDI: ' + kaldi);
  process.exit(kaldi ? 1 : 0);
})().catch(e => { console.error('TEST HATASI:', e); process.exit(1); });
