/* Yetki denetimi: her API ucunu her rolle deneyip yetkisiz gecen var mi bakar.
   Amac "403/401 donmesi gerekirken 200 donen" ucu yakalamak.
   Yalniz yoneticiye ozel uclar (izinli: ['admin']) ayrica tek tek denetlenir:
   yonetici olmayana (giris yapmamis dahil) bilinmeyen bir API adresiyle AYNI
   cevap (404 {"error":"Böyle bir adres yok"}) donmeli; 401/403 degil. */
const { iste, epostaOnayla, girisYap, botCevabi, tcUret, okulHesabi } = require('./giris');

let sorun = 0, kontrolSayisi = 0;
const bulgular = [];

function bekleniyor(ad, cevap, izinliMi) {
  kontrolSayisi++;
  const gecti = cevap.status === 200 || cevap.status === 201;
  if (izinliMi && !gecti) {
    /* Izinli olmasi gerekirken engellendi — is akisini bozar ama guvenlik acigi degil */
    bulgular.push({ tur: 'ENGEL', ad, durum: cevap.status,
      mesaj: (cevap.body && cevap.body.error) || '' });
  }
  if (!izinliMi && gecti) {
    sorun++;
    bulgular.push({ tur: 'ACIK', ad, durum: cevap.status,
      mesaj: JSON.stringify(cevap.body).slice(0, 110) });
  }
}

(async () => {
  const M = (await girisYap('mudur@test.com', 'Test1234!')).token;
  const O = (await girisYap('mat@test.com', 'Test1234!')).token;
  const S = (await girisYap('ogrenci1@test.com', 'Test1234!')).token;
  const A = (await girisYap('admin@egitimevi.com', 'admin123')).token;

  /* veli olustur */
  const bot = await botCevabi();
  await iste('/api/register', 'POST', {
    kvkkOnay: true, phone: '05321234567',
    role: 'parent', fullName: 'Denetim Veli', email: 'veli-denetim@test.com',
    password: 'Test1234!', city: 'Ankara', district: 'Çankaya',
    challengeId: bot.challengeId, challengeAnswer: bot.challengeAnswer
  });
  await epostaOnayla('veli-denetim@test.com');
  const V = (await girisYap('veli-denetim@test.com', 'Test1234!')).token;

  /* Servisçi: okulun açtığı hesap, hiçbir servise atanmamış. */
  await okulHesabi(M, 'servisci', { fullName: 'Denetim Servisci', username: 'denetim.servisci', password: 'Test1234!' });
  const SV = (await girisYap('denetim.servisci', 'Test1234!')).token;

  const roller = { mudur: M, ogretmen: O, ogrenci: S, veli: V, admin: A, servisci: SV, yok: null };

  /* --- hazirlik --- */
  await iste('/api/school/class', 'POST', { name: 'DENETIM' }, M);
  const sn = await iste('/api/school/classes', 'GET', null, M);
  const sinif = (sn.body.classes || []).find(c => c.name === 'DENETIM');
  const ogr = await iste('/api/school/students', 'GET', null, M);
  const o1 = ogr.body.students[0];

  /* Veli BIRINCI ogrenciye baglaniyor; denetimde IKINCI ogrenci uzerinden
     "baskasinin verisi" kontrolu yapiliyor. */
  await iste('/api/parent/link', 'POST', { code: o1.code }, V);
  const o2 = ogr.body.students.find(x => x.id !== o1.id) || o1;
  /* Velinin kişi kodu: müdür onunla öğretmen arar, yönetici onunla kişi bulur. */
  const vKod = (await iste('/api/kisilikler', 'GET', null, V)).body.kisiKodu;

  /* Toplu giriş bilgisi yalnızca bu ayrı sınıftaki öğrencinin şifresini yeniler
     (denetimde kullanılan hesapların oturumu düşmesin). */
  await iste('/api/school/class', 'POST', { name: 'DENETIM-GB' }, M);
  const gbSinif = ((await iste('/api/school/classes', 'GET', null, M)).body.classes || []).find(c => c.name === 'DENETIM-GB');
  await iste('/api/school/student-create', 'POST', { fullName: 'Dagitim Denetim', username: 'dagitim.denetim' + Date.now(),
    password: 'Test1234!', classId: gbSinif.id, tc: tcUret() }, M);

  /* Öğrencinin bir ödevi (teslim dosyası uçları için) */
  const yarin = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
  const odevDen = await iste('/api/assignments', 'POST', { title: 'Denetim ödevi', subject: 'Matematik',
    studentIds: [o1.id, o2.id], endAt: yarin }, O);
  const odevId = odevDen.body.assignment ? odevDen.body.assignment.id : 'yok';

  /* Quizli iki ödev: biri öğrencinin çözdüğü (başlat, cevap, çıkış, bitir),
     öbürü öğretmenin yeniden yazdığı (kimse başlamadığı için kilitli değil). */
  const denQuiz = () => ({ sorular: [{ tur: 'dy', metin: 'Denetim sorusu', dogru: true }, { tur: 'acik', metin: 'Açık uçlu denetim' }] });
  const quizDen = await iste('/api/assignments', 'POST', { title: 'Denetim quizi', subject: 'Matematik',
    studentIds: [o1.id, o2.id], endAt: yarin, endTime: '23:59', quiz: denQuiz() }, O);
  const quizId = quizDen.body.assignment ? quizDen.body.assignment.id : 'yok';
  const qSoru = quizDen.body.quiz ? quizDen.body.quiz.sorular[0] : { id: 'yok', secenekler: [{ id: 'yok' }] };
  const quizYazDen = await iste('/api/assignments', 'POST', { title: 'Denetim quizi (yazılan)', subject: 'Matematik',
    studentIds: [o1.id, o2.id], endAt: yarin, quiz: denQuiz() }, O);
  const quizYazId = quizYazDen.body.assignment ? quizYazDen.body.assignment.id : 'yok';
  const Q = '/api/assignments/' + quizId + '/quiz';

  /* Veli birinci öğrencinin velisi; öğrenci bir serviste (binmeyecek işareti için). */
  const denSv = await iste('/api/servis/kaydet', 'POST', { ad: 'Denetim yoklama servisi' }, M);
  if (denSv.body.id) await iste('/api/servis/ogrenci', 'POST', { servisId: denSv.body.id, ogrenciId: o1.id }, M);

  /* Okulun disk sınırı ucu için okulun kimliği (yönetici genel bakışından). */
  const denOkulId = (((await iste('/api/admin/overview', 'GET', null, A)).body.schools || [])[0] || {}).id || 'yok';

  /* uc: [ad, yol, method, govde, izinliRoller] */
  const UCLAR = [
    /* --- okul yonetimi: sadece mudur --- */
    ['sinif ac', '/api/school/class', 'POST', { name: 'X-' + Date.now() },
      ['mudur']],
    ['sinif listesi', '/api/school/classes', 'GET', null,
      ['mudur']],  /* duz ogretmenin ders.yonet yetkisi yok */
    ['ogrenci hesabi ac', '/api/school/student-create', 'POST',
      { fullName: 'Test Ogrenci', username: 'denetim.ogr' + Date.now(), email: 'x' + Date.now() + '@t.com',
        password: 'Test1234!', tc: tcUret() }, ['mudur']],
    ['ogrenci duzenle', '/api/school/student-update', 'POST',
      { studentId: o1.id, grade: '9' }, ['mudur']],
    ['ogrenci sinifa yerlestir', '/api/school/class-assign', 'POST',
      { studentId: o1.id, classId: sinif.id }, ['mudur']],
    ['ogrenci sifresi sifirla', '/api/school/student-password', 'POST',
      { studentId: o1.id, password: 'YeniSifre123' }, ['mudur']],
    ['rol olustur', '/api/school/role', 'POST',
      { name: 'Denetim Rolu ' + Date.now(), yetkiler: ['odev.ver'], kapsam: {} },
      ['mudur']],
    ['rol listesi', '/api/school/roles', 'GET', null, ['mudur']],
    ['ogretmen listesi', '/api/school/teacher-list', 'GET', null,
      ['mudur']],
    ['kisi koduyla ogretmen bul', '/api/school/ogretmen-bul', 'POST', { kod: vKod }, ['mudur']],

    /* --- yonetici islemleri --- */
    ['kisi koduyla kisi bul', '/api/admin/kisi-bul', 'POST', { kod: vKod }, ['admin']],
    ['yedek listesi', '/api/admin/backups', 'GET', null, ['admin']],
    ['yedek al', '/api/admin/backup-now', 'POST', {}, ['admin']],
    ['yonetici genel bakis', '/api/admin/overview', 'GET', null, ['admin']],
    ['okulun disk siniri', '/api/admin/okul-disk-siniri', 'POST', { okulId: denOkulId, mb: null }, ['admin']],
    ['mudur listesi (yonetici)', '/api/admin/principals', 'GET', null, ['admin']],
    ['site ayarlari', '/api/admin/site-ayarlari', 'GET', null, ['admin']],
    ['site ayari kaydet', '/api/admin/site-ayarlari', 'POST', { anahtar: 'bildirimAralikDk', deger: 5 }, ['admin']],
    ['okul adresleri (yonetici)', '/api/admin/okul-adresleri', 'GET', null, ['admin']],
    ['yonetici dosyasi', '/api/admin/yonetici-dosyasi', 'GET', null, ['admin']],
    ['yonetici dosyasi simdi oku', '/api/admin/yonetici-dosyasi/oku', 'POST', {}, ['admin']],
    ['yorumlarin hepsi (yonetici)', '/api/yorumlar/hepsi', 'GET', null, ['admin']],

    /* --- aktarim --- */
    ['excel sablonu', '/api/school/aktarim-sablon?tur=program', 'GET', null,
      ['mudur']],
    ['kisi listesi sablonu', '/api/school/kisi-sablon', 'GET', null, ['mudur']],
    ['kisi listesi disa', '/api/school/kisi-disa', 'GET', null, ['mudur']],
    ['metinden excel', '/api/school/txt-excel', 'POST',
      { tur: 'ogrenci', dosya: Buffer.from('Ayşe Yılmaz\n').toString('base64'), dosyaAdi: 'a.txt' }, ['mudur']],
    ['excel disa aktar', '/api/school/aktarim-disa?tur=ogrenci', 'GET', null,
      ['mudur']],

    /* --- egitim yili --- */
    ['yil listesi', '/api/egitim-yili', 'GET', null,
      ['mudur', 'ogretmen', 'ogrenci', 'veli', 'servisci']],  /* admin okulsuz */
    ['yil ac', '/api/egitim-yili/ekle', 'POST', { ad: '2040-2041' }, ['mudur']],

    /* --- takvim --- */
    ['takvim gorme', '/api/takvim?yil=2026&ay=9', 'GET', null,
      ['mudur', 'ogretmen', 'ogrenci', 'veli', 'servisci']],
    ['takvime etkinlik ekle', '/api/takvim/etkinlik', 'POST',
      { baslik: 'Denetim', tur: 'etkinlik', tarih: '2026-09-15' }, ['mudur']],

    /* --- devamsizlik --- */
    ['okul devamsizlik ozeti', '/api/devamsizlik/ozet', 'GET', null, ['mudur']],
    ['yoklama alinabilir dersler', '/api/devamsizlik/derslerim', 'GET', null,
      ['mudur', 'ogretmen']],

    /* --- islem kaydi --- */
    ['islem kaydi', '/api/islem-kaydi', 'GET', null, ['mudur', 'admin']],

    /* --- mesaj --- */
    ['mesaj hedefleri', '/api/mesajlar/hedefler', 'GET', null,
      ['mudur', 'ogretmen', 'ogrenci', 'veli', 'servisci']],  /* servisçiye boş liste */
    ['tum okula duyuru', '/api/mesajlar', 'POST',
      { tur: 'duyuru', konu: 'Denetim', govde: 'x', hedef: { tur: 'okul' } },
      ['mudur']],

    /* --- ogrenci verisi --- */
    ['okul ogrencileri', '/api/school/students', 'GET', null,
      ['mudur']],
    ['baskasinin devamsizligi', '/api/devamsizlik/ogrenci?studentId=' + o2.id,
      'GET', null, ['mudur', 'ogretmen']],
    ['kendi cocugunun devamsizligi', '/api/devamsizlik/ogrenci?studentId=' + o1.id,
      'GET', null, ['mudur', 'ogretmen', 'veli']],

    /* --- toplu giriş bilgisi --- */
    ['toplu giris bilgisi', '/api/school/giris-bilgisi', 'POST',
      { classId: gbSinif.id, sadeceGirmeyen: false, onay: true }, ['mudur']],

    /* --- anket --- */
    ['anket ac', '/api/anketler', 'POST', { soru: 'Denetim?', secenekler: ['Evet', 'Hayır'],
      hedef: { tur: 'okul' }, bitisGun: yarin }, ['mudur']],
    ['anket listesi', '/api/anketler', 'GET', null, ['mudur', 'ogretmen', 'ogrenci', 'veli']],

    /* --- okul hayatı --- */
    ['yemek listesi yaz', '/api/yemek', 'POST', { gunler: [{ tarih: yarin, menu: 'Çorba' }] }, ['mudur']],
    ['yemek listesi', '/api/yemek', 'GET', null, ['mudur', 'ogretmen', 'ogrenci', 'veli']],
    ['servis ekle', '/api/servis/kaydet', 'POST', { ad: 'Denetim servisi' }, ['mudur']],
    ['servis bilgisi', '/api/servis', 'GET', null, ['mudur', 'ogretmen', 'ogrenci', 'veli', 'servisci']],
    /* Öğrenci ?ogrenci= ile başkasını açamaz: kendi haritası gelir (200). Veli o1'in velisi. */
    ['servis haritasi', '/api/servis/harita?ogrenci=' + o1.id, 'GET', null, ['mudur', 'ogrenci', 'veli']],
    ['baskasinin servis haritasi', '/api/servis/harita?ogrenci=' + o2.id, 'GET', null, ['mudur', 'ogrenci']],
    ['ev konumu yaz', '/api/servis/ev', 'POST', { ogrenciId: o2.id, enlem: 39.9, boylam: 32.8 }, ['mudur', 'ogrenci']],
    ['seferlerim', '/api/servis/seferim', 'GET', null, ['servisci']],
    ['sefer baslat (atanmamis)', '/api/servis/sefer-basla', 'POST', { servisId: 'yok', yon: 'gidis' }, []],
    ['konum gonder (sefersiz)', '/api/servis/konum', 'POST', { seferId: 'yok', enlem: 39.9, boylam: 32.8 }, []],
    /* Servis yoklaması: servisçi kendi servisinin (atanmamış: boş) yoklamasını, yönetim salt okunur görür. */
    ['servis yoklamasi', '/api/servis/yoklama', 'GET', null, ['mudur', 'servisci']],
    ['baska servisin yoklamasi', '/api/servis/yoklama?servisId=' + (denSv.body.id || 'yok'), 'GET', null, ['mudur']],
    ['yoklama isareti (atanmamis)', '/api/servis/yoklama', 'POST', { servisId: denSv.body.id || 'yok', ogrenciId: o1.id, durum: 'bindi' }, []],
    ['okula vardik (atanmamis)', '/api/servis/okula-vardik', 'POST', { servisId: denSv.body.id || 'yok' }, []],
    ['servis sirasi (atanmamis)', '/api/servis/sira', 'POST', { servisId: denSv.body.id || 'yok', donem: 'sabah', sira: [o1.id] }, []],
    ['servis notu (atanmamis)', '/api/servis/not', 'POST', { servisId: denSv.body.id || 'yok', metin: 'Denetim' }, []],
    ['servis notu sil', '/api/servis/not-sil', 'POST', { id: 'yok' }, []],
    ['binmeyecek (kendi cocugu)', '/api/servis/binmeyecek', 'POST', { ogrenciId: o1.id, sabah: true, aksam: false }, ['veli']],
    ['binmeyecek (baskasinin cocugu)', '/api/servis/binmeyecek', 'POST', { ogrenciId: o2.id, sabah: true }, []],
    ['servis saatleri', '/api/servis/saatler', 'POST', { sabahBas: '00:00', sabahBit: '11:59', aksamBas: '12:00', aksamBit: '23:59' }, ['mudur']],
    /* Telefon uygulaması: anahtarı oturumla herkes alır; anahtar uçları oturumla açılmaz. */
    ['uygulama anahtari al', '/api/cihaz', 'POST', { ad: 'Denetim', platform: 'android' }, ['mudur', 'ogretmen', 'ogrenci', 'veli', 'admin', 'servisci']],
    ['uygulama telefonlari', '/api/cihaz', 'GET', null, ['mudur', 'ogretmen', 'ogrenci', 'veli', 'admin', 'servisci']],
    ['baskasinin telefonunu sil', '/api/cihaz/sil', 'POST', { id: 'yok' }, []],
    ['anahtar ucu oturumla (bildirim)', '/api/cihaz/bildirimler', 'GET', null, []],
    ['anahtar ucu oturumla (ayar)', '/api/cihaz/ayar', 'GET', null, []],
    ['anahtar ucu oturumla (konum)', '/api/cihaz/servis-konum', 'POST', { seferId: 'yok', enlem: 39.9, boylam: 32.8 }, []],
    ['okul adresi', '/api/school/adres', 'GET', null, ['mudur']],
    ['okul konumu yaz', '/api/school/konum', 'POST', { enlem: 39.92, boylam: 32.85 }, ['mudur']],
    ['servisci listesi', '/api/school/servisciler', 'GET', null, ['mudur']],
    ['servisci hesabi ac', '/api/school/hesap-ac', 'POST',
      { rol: 'servisci', ad: 'Denetim', soyad: 'Sofor', tc: tcUret() }, ['mudur']],
    ['baska hesabi gor', '/api/school/hesap?id=' + o2.id, 'GET', null, ['mudur']],
    ['bildirim anahtari', '/api/push/anahtar', 'GET', null, ['mudur', 'ogretmen', 'ogrenci', 'veli', 'admin', 'servisci']],
    ['bildirim aboneligi durumu', '/api/push/durum', 'POST', { endpoint: 'https://fcm.googleapis.com/fcm/send/denetim' },
      ['mudur', 'ogretmen', 'ogrenci', 'veli', 'admin', 'servisci']],
    ['ic aga abonelik', '/api/push/abone', 'POST', { endpoint: 'https://127.0.0.1/x', keys: {} }, []],
    ['kulup ac', '/api/kulupler/kaydet', 'POST', { ad: 'Denetim kulübü' }, ['mudur']],
    ['kulup listesi', '/api/kulupler', 'GET', null, ['mudur', 'ogretmen', 'ogrenci', 'veli']],

    /* --- ödev teslim dosyaları --- */
    ['odev teslim listesi', '/api/odev-dosya?odev=' + odevId, 'GET', null, ['mudur', 'ogretmen', 'ogrenci']],
    ['cocugun teslim listesi', '/api/odev-dosya?odev=' + odevId + '&ogrenci=' + o1.id, 'GET', null,
      ['mudur', 'ogretmen', 'ogrenci', 'veli']],

    /* --- ödevin quizi: öğrenci uçları yalnız ödevin öğrencisine, öğretmen uçları
       yalnız ödevi verene (müdür yalnız sahipsiz ödevde); veli hiçbirine giremez
       (puanı /progress'ten görür). Sıra önemli: yazma başlatmadan, bitir cevaptan sonra. --- */
    ['quiz metin onizlemesi', '/api/assignments/quiz-metin', 'POST', { metin: '1) Soru\n*A) a\nB) b' }, ['mudur', 'ogretmen']],
    ['quiz yaz', '/api/assignments/' + quizYazId + '/quiz', 'POST', { quiz: denQuiz() }, ['ogretmen']],
    ['quiz gorunumu', Q, 'GET', null, ['ogretmen', 'ogrenci']],
    ['quiz baslat', Q + '/basla', 'POST', {}, ['ogrenci']],
    ['quiz cevap', Q + '/cevap', 'POST', { soruId: qSoru.id, secilenler: [qSoru.secenekler[0].id] }, ['ogrenci']],
    ['quiz sekme kaydi', Q + '/odak', 'POST', { sure: 3, soruId: qSoru.id }, ['ogrenci']],
    ['quiz bitir', Q + '/bitir', 'POST', {}, ['ogrenci']],
    ['quiz ogrenci ayrintisi', Q + '/ayrinti?ogrenci=' + o1.id, 'GET', null, ['ogretmen']],
    ['quiz sonuclari ac', Q + '/sonuc-ac', 'POST', {}, ['ogretmen']]
  ];

  console.log('=== HER UC x HER ROL ===');
  console.log('  ' + 'UC'.padEnd(30) + 'mudur ogretmen ogrenci veli admin servisci giris-yok');

  for (const [ad, yol, method, govde, izinli] of UCLAR) {
    const satir = [];
    for (const rol of ['mudur', 'ogretmen', 'ogrenci', 'veli', 'admin', 'servisci', 'yok']) {
      const tok = roller[rol];
      const cevap = await iste(yol, method, govde, tok);
      const olmali = rol === 'yok' ? false : izinli.indexOf(rol) >= 0;
      bekleniyor(ad + ' [' + rol + ']', cevap, olmali);
      const gecti = cevap.status === 200 || cevap.status === 201;
      /* beklenen: + ; beklenmeyen gecis: ! ; beklenen engel: . */
      satir.push(gecti === olmali ? (gecti ? '  +   ' : '  .   ')
        : (gecti ? '  !   ' : '  x   '));
    }
    console.log('  ' + ad.padEnd(30) + satir.join(''));
  }

  /* Yoneticiye ozel uclar: yonetici olmayana bilinmeyen adresle ayni cevap. */
  console.log();
  console.log('=== YONETICI UCLARI YONETICI OLMAYANA BILINMEYEN ADRES GIBI (404, ayni govde) ===');
  let yoneticiDenetimi = 0;
  for (const [ad, yol, method, govde, izinli] of UCLAR) {
    if (izinli.length !== 1 || izinli[0] !== 'admin') continue;
    for (const rol of ['mudur', 'ogretmen', 'ogrenci', 'veli', 'servisci', 'yok']) {
      const tok = roller[rol];
      const [cevap, bilinmeyen] = await Promise.all([iste(yol, method, govde, tok),
        iste('/api/boyle-bir-uc-yok-denetim', method, govde, tok)]);
      yoneticiDenetimi++;
      kontrolSayisi++;
      if (cevap.status !== 404 || cevap.status !== bilinmeyen.status ||
          JSON.stringify(cevap.body) !== JSON.stringify(bilinmeyen.body)) {
        sorun++;
        bulgular.push({ tur: 'ACIK', ad: ad + ' [' + rol + '] bilinmeyen adresten ayirt ediliyor', durum: cevap.status,
          mesaj: JSON.stringify(cevap.body).slice(0, 80) + ' / bilinmeyen: ' + bilinmeyen.status });
      }
    }
  }
  console.log('  ' + yoneticiDenetimi + ' yonetici ucu x rol denendi');

  console.log();
  console.log('  + izin verildi (dogru)   . engellendi (dogru)');
  console.log('  ! YETKISIZ GECTI         x izinli olmasi gerekirken engellendi');
  console.log();

  const acik = bulgular.filter(b => b.tur === 'ACIK');
  const engel = bulgular.filter(b => b.tur === 'ENGEL');

  if (acik.length) {
    console.log('=== GUVENLIK ACIGI (' + acik.length + ') ===');
    acik.forEach(b => console.log('  ! ' + b.ad + ' -> ' + b.durum + ' ' + b.mesaj));
  } else {
    console.log('=== GUVENLIK ACIGI YOK ===');
  }

  if (engel.length) {
    console.log();
    console.log('=== IZINLI OLMASI GEREKIRKEN ENGELLENEN (' + engel.length + ') ===');
    engel.forEach(b => console.log('  x ' + b.ad + ' -> ' + b.durum + ' ' + b.mesaj));
  }

  console.log();
  console.log('  ' + kontrolSayisi + ' kontrol yapildi, ' + acik.length + ' acik bulundu.');
  process.exit(acik.length ? 1 : 0);
})().catch(e => { console.error('DENETIM HATASI:', e.message, e.stack); process.exit(1); });
