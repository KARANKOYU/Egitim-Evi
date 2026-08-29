/* Toplu aktarım testleri:
   - öğrenci / öğretmen / servisçi listesi tek çalışma kitabında üç sayfa;
   - .xlsx, .ods (müdürün kendi başlıklarıyla), .csv (Windows-1254) ve .txt okunur; öğretmen dosyayla eklenmez;
   - ad, soyad, T.C. zorunlu; boş kullanıcı adı ve şifre T.C. olur;
   - "7" + "çiçek" -> 7-Çiçek sınıfı açılır; aynı T.C. yeniden gelirse güncellenir;
   - TXT isim listesi doldurulacak Excel şablonuna çevrilir;
   - ders programı aktarımı; dışa aktarım; bozuk dosya, sıkıştırma bombası, yetki. */
const zlib = require('zlib');
const { iste, girisYap, tcUret } = require('./giris');
const xlsx = require(require('path').join(__dirname, '..', 'sunucu', 'yardimci', 'xlsx.js'));

let gecti = 0, kaldi = 0;
function kontrol(ad, sart, detay) {
  if (sart) { gecti++; console.log('  GECTI  ' + ad); }
  else { kaldi++; console.log('  KALDI  ' + ad + (detay ? '  -> ' + detay : '')); }
}
const J = x => JSON.stringify(x).slice(0, 200);

/* Sunucu xlsx'i ikili gonderiyor; fetch ile ham tampon almamiz gerek. */
async function dosyaAl(yol, token) {
  const r = await fetch((process.env.EE_BASE || 'http://localhost:3000') + yol, { headers: { 'Authorization': 'Bearer ' + token } });
  if (!r.ok) return { status: r.status, hata: (await r.text()).slice(0, 200) };
  return { status: r.status, buf: Buffer.from(await r.arrayBuffer()), tur: r.headers.get('content-type'), ad: r.headers.get('content-disposition') };
}
const yukle = (satirlar, basliklar, ad) => xlsx.yaz([{ ad: ad || 'Veri', basliklar, satirlar }]).toString('base64');

/* Müdürün LibreOffice'te kaydettiği gibi bir ODS: başlıklar yapi/ tablosundaki gibi. */
function odsYap(basliklar, satirlar) {
  const hucre = v => '<table:table-cell office:value-type="string"><text:p>' + String(v).replace(/&/g, '&amp;').replace(/</g, '&lt;') +
    '</text:p></table:table-cell>';
  const satir = s => '<table:table-row>' + s.map(hucre).join('') +
    '<table:table-cell table:number-columns-repeated="16372"/></table:table-row>';
  const xml = '<?xml version="1.0" encoding="UTF-8"?><office:document-content xmlns:office="urn:oasis:names:tc:opendocument:xmlns:office:1.0" ' +
    'xmlns:table="urn:oasis:names:tc:opendocument:xmlns:table:1.0" xmlns:text="urn:oasis:names:tc:opendocument:xmlns:text:1.0">' +
    '<office:body><office:spreadsheet><table:table table:name="Sheet1">' + satir(basliklar) + satirlar.map(satir).join('') +
    '<table:table-row table:number-rows-repeated="1048570"><table:table-cell table:number-columns-repeated="16384"/></table:table-row>' +
    '</table:table></office:spreadsheet></office:body></office:document-content>';
  return xlsx.zipYaz([{ ad: 'mimetype', veri: Buffer.from('application/vnd.oasis.opendocument.spreadsheet') },
    { ad: 'content.xml', veri: Buffer.from(xml, 'utf8') }]).toString('base64');
}

(async () => {
  const mudur = await girisYap('mudur@test.com', 'Test1234!');
  const T = mudur.token;

  /* --- hazirlik: sinif, ders, servis --- */
  const sinif = await iste('/api/school/class', 'POST', { name: '9-A' }, T);
  const sinifId = sinif.body.class.id;
  await iste('/api/school/lesson', 'POST', { classId: sinifId, subject: 'Matematik', weeklyHours: 4 }, T);
  await iste('/api/servis/kaydet', 'POST', { ad: 'Mavi Servis', plaka: '06 EE 123' }, T);

  console.log('=== 1) BOS SABLONLAR ===');
  const ks = await iste('/api/school/kisi-sablon', 'GET', null, T);
  const kSayfa = xlsx.oku(Buffer.from(ks.body.dosya, 'base64'));
  kontrol('kişi şablonunda öğrenci ve servisçi listesi ve anlatım (öğretmen dosyayla eklenmez)',
    kSayfa.map(s => s.ad).join('|') === 'Öğrenciler|Servisçiler|Nasıl doldurulur',
    kSayfa.map(s => s.ad).join('|'));
  kontrol('öğrenci başlıkları müdürün tablosundaki gibi', kSayfa[0].satirlar[0].join('|') ===
    'Ad|Soyad|T.C. Kimlik No|Kullanıcı adı|E-posta|Şifre|Doğum tarihi (gg.aa.yyyy)|Sınıf (1-12)|Şube|Okul no|Adres', kSayfa[0].satirlar[0].join('|'));
  kontrol('servisçi sayfasında telefon ve servis', kSayfa[1].satirlar[0].indexOf('Telefon') >= 0 &&
    kSayfa[1].satirlar[0].some(x => /^Servis/.test(x)));
  const s2 = await dosyaAl('/api/school/aktarim-sablon?tur=program', T);
  kontrol('program şablonu indi', s2.status === 200 && (s2.tur || '').indexOf('spreadsheetml') >= 0, 'status ' + s2.status);
  kontrol('program başlıkları doğru', xlsx.oku(s2.buf)[0].satirlar[0].join('|') === 'Sınıf|Gün|Başlangıç|Bitiş|Ders|Öğretmen');

  console.log('=== 2) ÜÇ SAYFALI LİSTE - ÖNİZLEME ===');
  const tcA = tcUret(), tcB = tcUret(), tcC = tcUret(), tcO = tcUret(), tcS = tcUret();
  const ogrBaslik = ['Ad', 'Soyad', 'T.C. Kimlik No', 'Kullanıcı adı', 'E-posta', 'Şifre', 'Doğum tarihi (gg.aa.yyyy)', 'Sınıf (1-12)', 'Şube', 'Okul no', 'Adres'];
  const ogrVeri = [
    ['Ahmet Sami', 'Yılmaz', tcA, '', '', '', '12.05.2012', '7', 'çiçek', '101', 'Çallı Mah.'],   // yalnız zorunlular + yeni sınıf
    ['Elif', 'Kara', tcB, 'elif.kara', 'elif.kara@okul.com', 'Okul2026x', '', '9', 'A', '102', ''],
    ['Can', 'Aydın', '12345678901', '', '', '', '', '', '', '', ''],        // geçersiz T.C.
    ['Deniz', 'Ak', '', '', '', '', '', '', '', '', ''],                  // T.C. yok
    ['Ece', 'Yal', tcA, '', '', '', '', '', '', '', ''],                  // dosyada tekrar T.C.
    ['Ali', 'Vural', tcC, '', '', '123', '', '', '', '', ''],             // zayıf şifre
    ['Tek', '', tcUret(), '', '', '', '', '', '', '', ''],                // soyad yok
    ['Zeynep', 'Ok', tcUret(), '', '', '', '31.02.2012', '', '', '101', '']   // bozuk tarih + dosyada tekrar okul no
  ];
  const ogtBaslik = ['Ad', 'Soyad', 'Doğum tarihi (gg.aa.yyyy)', 'E-posta', 'T.C. Kimlik No', 'Kullanıcı adı', 'Şifre', 'Rol', 'Branş', 'Telefon', 'Adres'];
  const ogtVeri = [
    ['Selin', 'Ay', '', '', tcO, '', '', 'öğretmen', 'Matematik', '0532 111 22 33', ''],
    ['Kaan', 'Er', '', '', tcUret(), '', '', 'Rehberlik Birimi', '', '', '']    // olmayan rol
  ];
  const svBaslik = ['Ad', 'Soyad', 'Doğum tarihi (gg.aa.yyyy)', 'T.C. Kimlik No', 'E-posta', 'Kullanıcı adı', 'Şifre', 'Telefon', 'Servis (adı ya da plakası)', 'Adres'];
  const svVeri = [['Hasan', 'Usta', '', tcS, '', '', '', '0533 444 55 66', '06 ee 123', '']];
  const kitap = xlsx.yaz([
    { ad: 'Öğrenciler', basliklar: ogrBaslik, satirlar: ogrVeri },
    { ad: 'Öğretmenler', basliklar: ogtBaslik, satirlar: ogtVeri },
    { ad: 'Servisçiler', basliklar: svBaslik, satirlar: svVeri }
  ]).toString('base64');
  const on = await iste('/api/school/kisi-aktarim', 'POST', { dosya: kitap, dosyaAdi: 'liste.xlsx', uygula: false }, T);
  kontrol('önizleme çalıştı', on.status === 200 && on.body.onizleme === true, J(on.body));
  kontrol('3 hesap hazır (2 öğrenci, 1 servisçi); 6 öğrenci satırı ve öğretmen sayfası hatalı', on.body.hazir === 3 && on.body.hatali === 7,
    'hazir ' + on.body.hazir + ' hatali ' + on.body.hatali + ' ' + J(on.body.rapor.filter(r => r.durum === 'hata').map(r => r.mesaj)));
  kontrol('açılacak yeni sınıf bildirildi', (on.body.yeniSiniflar || []).indexOf('7-Çiçek') >= 0 &&
    (on.body.yeniSiniflar || []).indexOf('9-A') < 0, J(on.body.yeniSiniflar));
  const rapor = JSON.stringify(on.body.rapor);
  kontrol('geçersiz ve eksik T.C. bildirildi', rapor.indexOf('geçersiz') >= 0 && rapor.indexOf('T.C. kimlik no gerekli') >= 0);
  kontrol('dosyada tekrar eden T.C. ve okul no bildirildi', rapor.indexOf('dosyada') >= 0 && rapor.indexOf('okul numarası') >= 0);
  kontrol('öğretmen sayfası "kendi hesabını açar" diye reddedildi, bozuk tarih bildirildi',
    rapor.indexOf('kendi hesabını açar') >= 0 && (rapor.indexOf('Böyle bir gün yok') >= 0 || rapor.indexOf('anlaşılmadı') >= 0),
    rapor.slice(0, 400));
  kontrol('önizleme hesap açmadı', (await iste('/api/school/students', 'GET', null, T)).body.students.every(s => s.fullName !== 'Ahmet Sami Yılmaz'));

  console.log('=== 3) UYGULA ===');
  const uyg = await iste('/api/school/kisi-aktarim', 'POST', { dosya: kitap, dosyaAdi: 'liste.xlsx', uygula: true }, T);
  kontrol('3 hesap açıldı', uyg.status === 200 && uyg.body.acilan === 3, J(uyg.body));
  const ahmet = (uyg.body.hesaplar || []).find(h => h.ad === 'Ahmet Sami Yılmaz');
  kontrol('şifresi T.C. olan hesapta şifre listede yazılmıyor', !!ahmet && ahmet.tcIle === true && ahmet.sifre === '' &&
    ahmet.kullaniciAdi === tcA, J(ahmet));
  const ahmetGiris = await girisYap(tcA, tcA);
  kontrol('T.C. ile giriş, ilk girişte şifre değişmeli', !!ahmetGiris.token && ahmetGiris.user.sifreDegismeli === true);
  const liste = (await iste('/api/school/students', 'GET', null, T)).body.students;
  const ahmetKayit = liste.find(s => s.fullName === 'Ahmet Sami Yılmaz');
  kontrol('öğrenci yeni açılan 7-Çiçek sınıfında, okul no yazıldı', !!ahmetKayit && ahmetKayit.className === '7-Çiçek' &&
    ahmetKayit.okulNo === '101', J(ahmetKayit));
  kontrol('ikinci öğrenci var olan 9-A sınıfında', liste.some(s => s.username === 'elif.kara' && s.className === '9-A'));
  const ogretmenler = (await iste('/api/school/teachers', 'GET', null, T)).body.teachers;
  kontrol('öğretmen sayfasındaki kişi hesap olarak açılmadı', !ogretmenler.some(t => t.fullName === 'Selin Ay'));
  const servis = (await iste('/api/servis', 'GET', null, T)).body.servisler.find(s => s.ad === 'Mavi Servis');
  kontrol('servisçi plakasıyla eşleşen servise atandı', !!servis && servis.soforAdi === 'Hasan Usta', J(servis));

  console.log('=== 4) AYNI T.C. YENİDEN: GÜNCELLEME (sınıf atlatma) ===');
  const ikinci = xlsx.yaz([{ ad: 'Öğrenciler', basliklar: ogrBaslik,
    satirlar: [['Ahmet Sami', 'Yılmaz', tcA, '', '', '', '', '8', 'Çiçek', '', 'Yeni adres']] }]).toString('base64');
  const gOn = await iste('/api/school/kisi-aktarim', 'POST', { dosya: ikinci, uygula: false }, T);
  kontrol('var olan öğrenci güncellenecek diye gösterildi', gOn.body.guncel === 1 && gOn.body.hazir === 0 &&
    (gOn.body.yeniSiniflar || []).indexOf('8-Çiçek') >= 0, J(gOn.body));
  await iste('/api/school/kisi-aktarim', 'POST', { dosya: ikinci, uygula: true }, T);
  const sonra = (await iste('/api/school/students', 'GET', null, T)).body.students.filter(s => s.fullName === 'Ahmet Sami Yılmaz');
  kontrol('yeni hesap açılmadı, sınıfı 8-Çiçek oldu', sonra.length === 1 && sonra[0].className === '8-Çiçek', J(sonra));

  console.log('=== 5) ODS (müdürün kendi başlıklarıyla), CSV, TXT ===');
  const tcOds = tcUret();
  const ods = odsYap(['Ahmet sami(İsim)', 'Yılmaz(Soyad)', '12345678901(TC)', 'Kullanıcı adı', 'e posta', 'şifre',
    'doğum tarihi gg.mm.yyyy', 'Sınıf(1-12)', 'sınıf(a,çiçek,mavi mesela)', 'okul no', 'açıklama', 'adres'],
    [['Mert', 'Demir', tcOds, '', '', '', '01.09.2013', '6', 'b', '301', 'x', 'Merkez']]);
  const odsOn = await iste('/api/school/kisi-aktarim', 'POST', { dosya: ods, dosyaAdi: 'öğrenci.ods', tur: 'ogrenci', uygula: false }, T);
  kontrol('ODS başlıkları eşlendi, satır hazır, 6-B açılacak', odsOn.status === 200 && odsOn.body.hazir === 1 &&
    (odsOn.body.yeniSiniflar || []).indexOf('6-B') >= 0, J(odsOn.body));
  const dosyaAdindan = await iste('/api/school/kisi-aktarim', 'POST', { dosya: ods, dosyaAdi: 'öğrenci.ods', uygula: false }, T);
  kontrol('sayfa adı "Sheet1" ise tür dosya adından anlaşılıyor (öğrenci.ods)', dosyaAdindan.status === 200 &&
    dosyaAdindan.body.hazir === 1, J(dosyaAdindan.body));
  const sayfaAdsiz = await iste('/api/school/kisi-aktarim', 'POST', { dosya: ods, dosyaAdi: 'liste.ods', uygula: false }, T);
  kontrol('ne sayfa ne dosya adı tanınırsa tür sorulur', sayfaAdsiz.status === 400, J(sayfaAdsiz.body));
  const tcCsv = tcUret();
  const csv = Buffer.concat([Buffer.from('Ad;Soyad;T.C. Kimlik No\n'), Buffer.from([0xde, 0x65, 0x6e, 0x3b, 0xc7, 0x61, 0x6b, 0xfd, 0x72, 0x3b]),
    Buffer.from(tcCsv + '\n')]).toString('base64');
  const csvOn = await iste('/api/school/kisi-aktarim', 'POST', { dosya: csv, dosyaAdi: 'liste.csv', tur: 'servisci', uygula: false }, T);
  kontrol('Windows-1254 CSV Türkçe harfleriyle okundu', csvOn.body.hazir === 1 && JSON.stringify(csvOn.body.rapor).indexOf('Şen Çakır') >= 0,
    J(csvOn.body));
  const tcTxt = tcUret();
  const txt = Buffer.from('1. Ayşe Nur Kılıç ' + tcTxt + '\n2) Burak Öz\n\n').toString('base64');
  const txtOn = await iste('/api/school/kisi-aktarim', 'POST', { dosya: txt, dosyaAdi: 'isimler.txt', tur: 'ogrenci', uygula: false }, T);
  kontrol('TXT: T.C.\'li satır hazır, T.C.\'siz satır hatalı', txtOn.body.hazir === 1 && txtOn.body.hatali === 1 &&
    JSON.stringify(txtOn.body.rapor).indexOf('Ayşe Nur Kılıç') >= 0, J(txtOn.body));
  const cevir = await iste('/api/school/txt-excel', 'POST', { dosya: Buffer.from('Ali Veli Kaya\nFatma Nur Er\nOsman\n').toString('base64'),
    dosyaAdi: 'isimler.txt', tur: 'ogrenci' }, T);
  const cevrilen = cevir.body.dosya ? xlsx.oku(Buffer.from(cevir.body.dosya, 'base64'))[0] : null;
  kontrol('TXT doldurulacak Excel\'e çevrildi (ad ve soyad ayrıldı)', cevir.status === 200 && cevir.body.adet === 3 && cevrilen &&
    cevrilen.satirlar[1][0] === 'Ali Veli' && cevrilen.satirlar[1][1] === 'Kaya' && cevrilen.satirlar[0][2] === 'T.C. Kimlik No',
    J(cevrilen && cevrilen.satirlar));

  console.log('=== 6) PROGRAM İÇE AKTARIM ===');
  const pBaslik = ['Sınıf', 'Gün', 'Başlangıç', 'Bitiş', 'Ders', 'Öğretmen'];
  const pVeri = [
    ['9-A', 'Pazartesi', '09:20', '10:00', 'Matematik', ''],
    ['9-A', 'Salı', '10:10', '10:50', 'Matematik', ''],
    ['9-A', 'Çarşamba', '09:20', '10:00', 'Fizik', ''],
    ['9-B', 'Pazartesi', '09:20', '10:00', 'Matematik', ''],
    ['9-A', 'Cumaartesi', '09:20', '10:00', 'Matematik', ''],
    ['9-A', 'Cuma', '10:00', '09:00', 'Matematik', '']
  ];
  const pb64 = yukle(pVeri, pBaslik);
  const pOn = await iste('/api/school/aktarim-ice', 'POST', { tur: 'program', dosya: pb64, uygula: false }, T);
  kontrol('program: 2 hazır, 4 hatalı', pOn.status === 200 && pOn.body.hazir === 2 && pOn.body.hatali === 4, J(pOn.body));
  const pUyg = await iste('/api/school/aktarim-ice', 'POST', { tur: 'program', dosya: pb64, uygula: true }, T);
  kontrol('program uygulandı', pUyg.status === 200 && pUyg.body.eklenen === 2, J(pUyg.body));
  const saatVeri = [['9-A', '1', '0.5833333333333334', '0.625', 'Matematik', ''], ['9-A', '3', '8.30', '9.10', 'Matematik', '']];
  const sOn = await iste('/api/school/aktarim-ice', 'POST', { tur: 'program', dosya: yukle(saatVeri, pBaslik), uygula: false }, T);
  const sRapor = JSON.stringify(sOn.body.rapor);
  kontrol('excel kesir ve noktalı saat çözüldü', sRapor.indexOf('14:00-15:00') >= 0 && sRapor.indexOf('08:30-09:10') >= 0, sRapor.slice(0, 250));
  const eskiOgr = await iste('/api/school/aktarim-ice', 'POST', { tur: 'ogrenci', dosya: pb64 }, T);
  kontrol('eski öğrenci aktarımı yeni bölüme yönlendiriyor', eskiOgr.status === 400, J(eskiOgr.body));

  console.log('=== 7) DIŞA AKTARIM ===');
  const disa = await iste('/api/school/kisi-disa', 'GET', null, T);
  const dSayfa = xlsx.oku(Buffer.from(disa.body.dosya, 'base64'));
  const dOgr = dSayfa[0].satirlar;
  const dAhmet = dOgr.find(r => r[2] === tcA);
  kontrol('dışa aktarım iki sayfa; öğrenci sınıfı seviye ve şubeye bölündü, şifre boş', dSayfa.length === 2 && !!dAhmet &&
    dAhmet[7] === '8' && dAhmet[8] === 'Çiçek' && dAhmet[5] === '', J(dAhmet));
  kontrol('servisçi sayfası dolu', dSayfa[1].ad === 'Servisçiler' &&
    dSayfa[1].satirlar.some(r => r[0] === 'Hasan' && /Mavi Servis/.test(r.join('|'))), J(dSayfa[1].satirlar));
  const d3 = await dosyaAl('/api/school/aktarim-disa?tur=program', T);
  kontrol('program listesi indi', d3.status === 200 && xlsx.oku(d3.buf)[0].satirlar.length >= 3, 'status ' + d3.status);
  const d4 = await dosyaAl('/api/school/aktarim-disa?tur=uydurma', T);
  kontrol('bilinmeyen tür reddedildi', d4.status === 400, 'status ' + d4.status);

  console.log('=== 8) BOZUK DOSYA VE SIKIŞTIRMA BOMBASI ===');
  const bozuk = await iste('/api/school/kisi-aktarim', 'POST', { dosya: Buffer.from('PK\u0003\u0004bozuk').toString('base64'), dosyaAdi: 'x.xlsx' }, T);
  kontrol('bozuk dosya anlaşılır hata', bozuk.status === 400, J(bozuk.body));
  const bos = await iste('/api/school/kisi-aktarim', 'POST', { dosya: '' }, T);
  kontrol('boş dosya reddedildi', bos.status === 400, J(bos.body));
  const alakasiz = await iste('/api/school/kisi-aktarim', 'POST', { dosya: yukle([['a', 'b']], ['Alakasiz', 'Sutun'], 'Öğrenciler') }, T);
  kontrol('başlıkları tutmayan dosya yönlendirici hata veriyor', alakasiz.status === 200 && alakasiz.body.hazir === 0 &&
    JSON.stringify(alakasiz.body.rapor).indexOf('Başlık satırında') >= 0, J(alakasiz.body));
  const bomba = xlsx.zipYaz([{ ad: 'xl/workbook.xml', veri: Buffer.alloc(200 * 1024 * 1024) }]);
  const bombaCevap = await iste('/api/school/kisi-aktarim', 'POST', { dosya: bomba.toString('base64'), dosyaAdi: 'b.xlsx' }, T);
  kontrol('açılınca devleşen dosya reddedildi (' + Math.round(bomba.length / 1024) + ' KB)', bombaCevap.status === 400 &&
    /büyüyor/.test(bombaCevap.body.error || ''), J(bombaCevap.body));
  const saglik = await iste('/api/me', 'GET', null, T);
  kontrol('sunucu ayakta', saglik.status === 200);

  console.log('=== 9) YETKİ ===');
  const ogretmen = await girisYap('mat@test.com', 'Test1234!');
  const y1 = await iste('/api/school/kisi-sablon', 'GET', null, ogretmen.token);
  const y2 = await iste('/api/school/kisi-aktarim', 'POST', { dosya: kitap, uygula: true }, ogretmen.token);
  const y3 = await iste('/api/school/kisi-disa', 'GET', null, ogretmen.token);
  kontrol('yetkisiz öğretmen şablon alamıyor, aktaramıyor, dışa aktaramıyor', y1.status === 403 && y2.status === 403 && y3.status === 403,
    [y1.status, y2.status, y3.status].join(','));

  console.log();
  console.log('  GECTI: ' + gecti + '   KALDI: ' + kaldi);
  process.exit(kaldi ? 1 : 0);
})().catch(e => { console.error('TEST HATASI:', e.message, e.stack); process.exit(1); });
