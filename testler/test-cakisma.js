/* Aynı T.C., aynı e-posta, aynı kullanıcı adı (çakışmalar):
   - normEmail / normKullaniciAdi / normTc: büyük/küçük harf, baştaki/sondaki boşluk,
     Türkçe İ/ı, tam genişlikli harf, birleşik aksan ve görünmez karakter ayrı hesap
     açtırmaz (ya aynı hesaba iner ya reddedilir);
   - veritabanında her kuralın tekil indeksi (ve yönetici adı için tetikleyicisi) var;
   - kayıt ve e-posta onayı, e-posta ve kullanıcı adı değiştirme, okulun açtığı
     öğrenci/servisçi, Excel ile toplu açma, nakil, kişi koduyla öğretmen ekleme,
     veli bağlama, admins.json ve yedekten geri yükleme yollarında çift denemesi;
   - aynı anda gelen istekler (Promise.all) çift hesap açamaz; kaybeden açık bir
     ileti ve doğru alan bayrağı (alan) alır, sunucu 500 vermez;
   - aynı kullanıcı adı iki okulda olabilir, giriş okul adresinden ayrılır;
   - yöneticinin kullanıcı adı hiçbir hesapla çakışmaz (veritabanı tetikleyicisi,
     yarış dahil);
   - eski sürümde saklanmış (yalnız kırpılıp küçültülmüş, "İ" -> "i̇") e-posta açılışta bugünkü
     biçime getirilir (admins.json uygulanmadan önce); aynı biçimde başka hesap varsa dokunulmaz,
     raporlanır.
   Yalnız test veritabanında (_test) çalışır. */
const fs = require('fs');
const path = require('path');
const { iste, girisYap, botCevabi, hesapAc, kisiKodu, kisilikGec, sonKod, tcUret, LOG } = require('./giris');
const o = require('../sunucu/ortak');
const xlsx = require('../sunucu/yardimci/xlsx');

let gecti = 0, kaldi = 0;
function kontrol(ad, sart, detay) {
  if (sart) { gecti++; console.log('  GECTI  ' + ad); }
  else { kaldi++; console.log('  KALDI  ' + ad + (detay ? '  -> ' + detay : '')); }
}
const J = x => JSON.stringify(x).slice(0, 260);
const bekle = ms => new Promise(r => setTimeout(r, ms));

function testDeposu() {
  process.env.EE_DATA = path.join(__dirname, 'testdata');
  require('../sunucu/ayarlar').ayarlariYukle();
  const baglanti = require('../sunucu/veri/baglanti');
  if (!/_test$/.test(baglanti.veritabaniAdi() || '')) return null;
  return {
    baglanti,
    kullanicilar: require('../sunucu/veri/depo/kullanicilar'),
    genel: require('../sunucu/veri/depo/genel')
  };
}

/* Kayıt formu (onaylamadan). */
async function kayit(g) {
  const bot = await botCevabi();
  return iste('/api/register', 'POST', Object.assign({ kvkkOnay: true, phone: '05321234567', password: 'Test1234!' }, g, bot));
}
/* Günlükteki bütün onay anahtarları (sırayla) — aynı adrese giden iki bağlantı için. */
function onayAnahtarlari(eposta) {
  const metin = fs.readFileSync(LOG, 'utf8');
  const k = String(eposta).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp('Eposta\\s*:\\s*' + k + '\\s[\\s\\S]*?ONAY ANAHTARI\\s*:\\s*([a-f0-9]{64})', 'g');
  const liste = [];
  let m;
  while ((m = re.exec(metin))) liste.push(m[1]);
  return liste;
}
const onayla = anahtar => iste('/api/eposta-onay', 'POST', { token: anahtar });
const sonAnahtar = eposta => { const l = onayAnahtarlari(eposta); return l[l.length - 1]; };

/* İki adımlı giriş; kod günlükte kodEposta (ya da kullanıcı adı) için aranır. */
async function giris(kimlik, sifre, kodKimlik, okul) {
  const bot = await botCevabi();
  const a = await iste('/api/login', 'POST', { email: kimlik, password: sifre, okul: okul || undefined,
    challengeId: bot.challengeId, challengeAnswer: bot.challengeAnswer });
  if (a.status !== 200 || !a.body.twoFactor) return a;
  return iste('/api/login/dogrula', 'POST', { challengeId: a.body.challengeId, code: sonKod(kodKimlik) });
}

(async () => {
  const depo = testDeposu();
  if (!depo) { console.log('  KALDI  test veritabanı değil (adı _test ile bitmeli)'); process.exit(1); }
  const { sorgu, tek } = depo.baglanti;
  const say = async (sql, p) => Number((await tek(sql, p)).n);
  const z = Date.now().toString(36);
  const logBas = fs.statSync(LOG).size;

  const A = (await girisYap('admin@egitimevi.com', 'admin123')).token;
  const M = (await girisYap('mudur@test.com', 'Test1234!')).token;
  const okulA = (await tek("SELECT k.okul_id FROM kullanicilar k JOIN kullanicilar a ON a.id = k.ana_hesap_id " +
    "WHERE a.eposta = 'mudur@test.com' AND k.rol = 'principal'")).okul_id;
  const kisaA = (await iste('/api/school/adres', 'GET', null, M)).body.kisaAd;

  console.log('=== 1) NORMALLEŞTİRME (normEmail, normKullaniciAdi, normTc) ===');
  kontrol('e-posta: büyük harf ve baştaki/sondaki boşluk aynı adres', o.normEmail('  Ayse@X.com ') === 'ayse@x.com');
  kontrol('e-posta: Türkçe büyük İ küçük i olur ("AYSE.İNCE" = "ayse.ince")', o.normEmail('AYSE.İNCE@X.COM') === 'ayse.ince@x.com',
    J(o.normEmail('AYSE.İNCE@X.COM')));
  kontrol('e-posta: tarayıcıda küçültülmüş "i\u0307" (i + nokta) da i olur', o.normEmail('ayse.i\u0307nce@x.com') === 'ayse.ince@x.com');
  kontrol('e-posta: tam genişlikli harfler ASCII olur', o.normEmail('ＡＹＳＥ＠ｘ．ｃｏｍ') === 'ayse@x.com',
    J(o.normEmail('ＡＹＳＥ＠ｘ．ｃｏｍ')));
  kontrol('e-posta: sıfır genişlikli boşluk ve yumuşak tire silinir', o.normEmail('ay\u200bse\u00ad@x.com') === 'ayse@x.com');
  kontrol('e-posta: küçük ı reddedilir (ayrı hesap açılmaz)', /Türkçe/.test(o.epostaSorunu(o.normEmail('aylın@x.com'))));
  kontrol('e-posta: Kiril "\u0430" (Latin a gibi görünen) reddedilir', o.epostaSorunu(o.normEmail('\u0430yse@x.com')) !== '');
  kontrol('e-posta: birleşik aksan tek harfe iner ve reddedilir', o.normEmail('ayse\u0301@x.com') === 'aysé@x.com' &&
    o.epostaSorunu('aysé@x.com') !== '');
  kontrol('e-posta: ASCII adres (+ ve . ile) geçer', o.epostaSorunu(o.normEmail('Ayse.Ince+okul@X.com')) === '');
  kontrol('kullanıcı adı: büyük harf ve boşluk aynı ad', o.normKullaniciAdi(' Ayse.Kaya ') === 'ayse.kaya');
  kontrol('kullanıcı adı: "İSMAİL" = "ismail" ve geçerli', o.normKullaniciAdi('İSMAİL') === 'ismail' && !o.kullaniciAdiSorunu('İSMAİL'));
  kontrol('kullanıcı adı: tam genişlikli ve Kelvin işareti ASCII olur', o.normKullaniciAdi('ａｙｓｅ') === 'ayse' &&
    o.normKullaniciAdi('\u212aemal') === 'kemal');
  kontrol('kullanıcı adı: ı ve Kiril harf reddedilir', /Türkçe/.test(o.kullaniciAdiSorunu('ısmail')) && !!o.kullaniciAdiSorunu('\u0430yse'));
  kontrol('T.C.: tam genişlikli rakam ve boşluk', o.normTc(' １２３ ４５６\u200b７８９０１ ') === '12345678901');

  console.log('=== 2) VERİTABANI: TEKİL İNDEKSLER VE TETİKLEYİCİ ===');
  const indeksler = (await sorgu("SELECT indexname FROM pg_indexes WHERE tablename = 'kullanicilar'")).map(r => r.indexname);
  for (const ad of ['kullanicilar_eposta_key', 'kullanicilar_kadi_okul', 'kullanicilar_kadi_genel', 'kullanicilar_tc_okul',
    'kullanicilar_tc_genel', 'kullanicilar_tc_ogrenci', 'kullanicilar_okul_no', 'kullanicilar_ana_okul', 'kullanicilar_yonetici_adi']) {
    kontrol('indeks var: ' + ad, indeksler.indexOf(ad) >= 0);
  }
  kontrol('yönetici adı tetikleyicisi var', !!(await tek("SELECT 1 FROM pg_trigger WHERE tgname = 'kullanicilar_yonetici_adi'")));

  console.log('=== 3) KAYIT VE E-POSTA ONAYI ===');
  const aK = 'cakA' + z, aE = 'Cak.A' + z + '@Test.com';
  const aTc = tcUret();
  const r1 = await kayit({ fullName: 'Cak Birinci', username: aK.toUpperCase(), email: '  ' + aE + ' ', tc: aTc });
  kontrol('kayıt: büyük harfli ve boşluklu adres kabul', r1.status === 200 && r1.body.onayGerekli === true, J(r1.body));
  const on1 = await onayla(sonAnahtar(o.normEmail(aE)));
  kontrol('onay: hesap açıldı', on1.status === 200 && on1.body.kullaniciAdi === aK.toLowerCase(), J(on1.body));
  const aSatir = await tek('SELECT eposta, kullanici_adi FROM kullanicilar WHERE kullanici_adi = $1', [aK.toLowerCase()]);
  kontrol('e-posta ve kullanıcı adı küçük harfle, boşluksuz saklandı', !!aSatir && aSatir.eposta === aE.toLowerCase(), J(aSatir));
  for (const [ad, ep] of [['büyük harf', aE.toUpperCase()], ['tam genişlikli', 'ｃａｋ．ａ' + z + '＠ｔｅｓｔ．ｃｏｍ'],
    ['sıfır genişlikli boşluk', 'cak.\u200ba' + z + '@test.com']]) {
    const r = await kayit({ fullName: 'Cak Kopya', username: 'cakkopya' + z, email: ep });
    kontrol('aynı e-posta (' + ad + ') ikinci kez kayıt olamaz, alan email', r.status === 400 && r.body.alan === 'email' &&
      /kayıtlı/.test(r.body.error), J(r.body));
  }
  const iE = 'ilker' + z + '@test.com';
  await hesapAc({ fullName: 'İlker Cak', username: 'ilkercak' + z, email: iE });
  const rI = await kayit({ fullName: 'İlker Kopya', username: 'ilkerkopya' + z, email: 'İLKER' + z.toUpperCase() + '@TEST.COM' });
  kontrol('Türkçe büyük İ ile yazılan aynı adres ikinci hesap açamaz', rI.status === 400 && rI.body.alan === 'email', J(rI.body));
  const rTr = await kayit({ fullName: 'Aylin Cak', username: 'aylincak' + z, email: 'aylın' + z + '@test.com' });
  kontrol('ı içeren adres reddedildi (alan email)', rTr.status === 400 && rTr.body.alan === 'email' && /Türkçe/.test(rTr.body.error), J(rTr.body));
  const rKi = await kayit({ fullName: 'Kiril Cak', username: 'kirilcak' + z, email: '\u0430yse' + z + '@test.com' });
  kontrol('Kiril harfli adres reddedildi', rKi.status === 400 && rKi.body.alan === 'email', J(rKi.body));
  for (const [ad, k] of [['büyük harf', aK.toUpperCase()], ['tam genişlikli', 'ｃａｋａ' + z], ['boşluklu', '  ' + aK + '  ']]) {
    const r = await kayit({ fullName: 'Cak Kopya', username: k, email: 'kadikopya' + z + '@test.com' });
    kontrol('aynı kullanıcı adı (' + ad + ') alınamaz, alan kullaniciAdi', r.status === 400 && r.body.alan === 'kullaniciAdi', J(r.body));
  }
  const rOk = await kayit({ fullName: 'Okul Adli', username: 'OGRENCI1', email: 'okuladli' + z + '@test.com' });
  kontrol('okuldaki bir öğrencinin adıyla kaydolunamaz', rOk.status === 400 && rOk.body.alan === 'kullaniciAdi', J(rOk.body));
  const rYon = await kayit({ fullName: 'Admin Adli', username: 'Admin', email: 'adminadli' + z + '@test.com' });
  kontrol('yöneticinin adıyla kaydolunamaz', rYon.status === 400 && rYon.body.alan === 'kullaniciAdi', J(rYon.body));
  const rTc = await kayit({ fullName: 'Tc Kopya', username: 'tckopya' + z, email: 'tckopya' + z + '@test.com',
    tc: aTc.slice(0, 3) + ' ' + aTc.slice(3) });
  kontrol('aynı T.C. (boşluklu yazılmış) ikinci yetişkin hesabına yazılamaz, alan tc', rTc.status === 400 && rTc.body.alan === 'tc', J(rTc.body));
  const gA = await giris('  ' + aE.toUpperCase() + ' ', 'Test1234!', aE.toLowerCase());
  kontrol('girişte büyük harfli/boşluklu e-posta aynı hesabı buluyor', gA.status === 200 && !!gA.body.token &&
    gA.body.user.username === aK.toLowerCase(), J(gA.body));
  const gI = await giris('İLKERCAK' + z.toUpperCase(), 'Test1234!', iE);
  kontrol('girişte "İ" ile yazılan kullanıcı adı aynı hesabı buluyor', gI.status === 200 && !!gI.body.token, J(gI.body));

  /* Aynı anda: iki bekleyen kayıt aynı kullanıcı adıyla / aynı T.C. ile onaylanır. */
  const yK = 'yarisad' + z;
  const y1 = 'yaris1' + z + '@test.com', y2 = 'yaris2' + z + '@test.com';
  const ky1 = await kayit({ fullName: 'Yaris Bir', username: yK, email: y1 });
  const ky2 = await kayit({ fullName: 'Yaris Iki', username: yK, email: y2 });
  kontrol('aynı adla iki kayıt bekliyor (hesap henüz yok)', ky1.status === 200 && ky2.status === 200, J([ky1.body, ky2.body]));
  const yo = await Promise.all([onayla(sonAnahtar(y1)), onayla(sonAnahtar(y2))]);
  kontrol('aynı anda onay: yalnız biri açıldı, öteki alan kullaniciAdi', yo.filter(r => r.status === 200).length === 1 &&
    yo.some(r => r.status === 400 && r.body.alan === 'kullaniciAdi'), J(yo.map(r => [r.status, r.body])));
  kontrol('veritabanında bu adla tek hesap', await say('SELECT count(*) AS n FROM kullanicilar WHERE kullanici_adi = $1', [yK]) === 1);
  const tT = tcUret();
  const t1 = 'yaristc1' + z + '@test.com', t2 = 'yaristc2' + z + '@test.com';
  await kayit({ fullName: 'Tc Bir', username: 'yaristc1' + z, email: t1, tc: tT });
  await kayit({ fullName: 'Tc Iki', username: 'yaristc2' + z, email: t2, tc: tT });
  const to = await Promise.all([onayla(sonAnahtar(t1)), onayla(sonAnahtar(t2))]);
  kontrol('aynı T.C. ile iki onay: biri açıldı, öteki alan tc', to.filter(r => r.status === 200).length === 1 &&
    to.some(r => r.status === 400 && r.body.alan === 'tc'), J(to.map(r => [r.status, r.body])));
  kontrol('veritabanında bu T.C. ile tek yetişkin', await say('SELECT count(*) AS n FROM kullanicilar WHERE tc_kimlik = $1', [tT]) === 1);
  const cE = 'cift' + z + '@test.com';
  await kayit({ fullName: 'Cift Tik', username: 'cifttik' + z, email: cE });
  const cA = sonAnahtar(cE);
  const co = await Promise.all([onayla(cA), onayla(cA), onayla(cA)]);
  kontrol('aynı bağlantıya aynı anda üç tıklama: bir hesap', co.filter(r => r.status === 200).length === 1 &&
    await say('SELECT count(*) AS n FROM kullanicilar WHERE eposta = $1', [cE]) === 1, J(co.map(r => r.status)));

  console.log('=== 4) E-POSTA VE KULLANICI ADI DEĞİŞTİRME ===');
  const bK = 'cakb' + z, cK = 'cakc' + z;
  await hesapAc({ fullName: 'Cak Bee', username: bK, email: bK + '@test.com' });
  await hesapAc({ fullName: 'Cak Cee', username: cK, email: cK + '@test.com' });
  const B = (await girisYap(bK, 'Test1234!')).token;
  const C = (await girisYap(cK, 'Test1234!')).token;
  const eb1 = await iste('/api/hesap/bilgi', 'POST', { sifre: 'Test1234!', eposta: ' ' + aE.toUpperCase() }, B);
  kontrol('başkasının e-postasına (büyük harfle) geçilemez, alan eposta', eb1.status === 400 && eb1.body.alan === 'eposta', J(eb1.body));
  const eb2 = await iste('/api/hesap/bilgi', 'POST', { sifre: 'Test1234!', eposta: 'yeni' + z + '@tëst.com' }, B);
  kontrol('Türkçe/aksanlı harfli e-postaya geçilemez', eb2.status === 400 && eb2.body.alan === 'eposta', J(eb2.body));
  const kb1 = await iste('/api/hesap/bilgi', 'POST', { sifre: 'Test1234!', kullaniciAdi: aK.toUpperCase() }, B);
  kontrol('başkasının kullanıcı adına (büyük harfle) geçilemez', kb1.status === 400 && kb1.body.alan === 'kullaniciAdi', J(kb1.body));
  const kb2 = await iste('/api/hesap/bilgi', 'POST', { sifre: 'Test1234!', kullaniciAdi: 'ADMIN' }, B);
  kontrol('yöneticinin kullanıcı adına geçilemez', kb2.status === 400 && kb2.body.alan === 'kullaniciAdi', J(kb2.body));
  const kb3 = await iste('/api/hesap/bilgi', 'POST', { sifre: 'Test1234!', kullaniciAdi: 'Ogrenci1' }, B);
  kontrol('bir okuldaki öğrencinin adına geçilemez', kb3.status === 400 && kb3.body.alan === 'kullaniciAdi', J(kb3.body));
  const yeniAd = 'ortakad' + z;
  const ka = await Promise.all([
    iste('/api/hesap/bilgi', 'POST', { sifre: 'Test1234!', kullaniciAdi: yeniAd }, B),
    iste('/api/hesap/bilgi', 'POST', { sifre: 'Test1234!', kullaniciAdi: yeniAd.toUpperCase() }, C)]);
  kontrol('iki kişi aynı anda aynı ada geçer: biri alır, öteki alan kullaniciAdi', ka.filter(r => r.status === 200).length === 1 &&
    ka.some(r => r.status === 400 && r.body.alan === 'kullaniciAdi'), J(ka.map(r => [r.status, r.body])));
  kontrol('veritabanında bu adla tek hesap', await say('SELECT count(*) AS n FROM kullanicilar WHERE kullanici_adi = $1', [yeniAd]) === 1);
  const ortakE = 'ortak' + z + '@test.com';
  const eo1 = await iste('/api/hesap/bilgi', 'POST', { sifre: 'Test1234!', eposta: ortakE }, B);
  const eo2 = await iste('/api/hesap/bilgi', 'POST', { sifre: 'Test1234!', eposta: ortakE.toUpperCase() }, C);
  kontrol('iki kişi aynı yeni adrese bağlantı istedi', eo1.status === 200 && eo2.status === 200 && eo1.body.onayBekliyor &&
    eo2.body.onayBekliyor, J([eo1.body, eo2.body]));
  const ortakAnahtarlar = onayAnahtarlari(ortakE);
  const eo = await Promise.all(ortakAnahtarlar.slice(-2).map(onayla));
  kontrol('iki bağlantı aynı anda tıklanır: adres birinde, öteki alan email', ortakAnahtarlar.length >= 2 &&
    eo.filter(r => r.status === 200).length === 1 && eo.some(r => r.status === 400 && r.body.alan === 'email'),
  J(eo.map(r => [r.status, r.body])));
  kontrol('veritabanında bu adres tek hesapta', await say('SELECT count(*) AS n FROM kullanicilar WHERE eposta = $1', [ortakE]) === 1);

  console.log('=== 5) OKULUN AÇTIĞI HESAPLAR (öğrenci, servisçi) ===');
  const hesapAcOkul = (T, g) => iste('/api/school/hesap-ac', 'POST', Object.assign({ rol: 'student', password: 'Test1234!' }, g), T);
  const ogr1 = await tek("SELECT id, tc_kimlik FROM kullanicilar WHERE kullanici_adi = 'ogrenci1' AND okul_id = $1", [okulA]);
  const h1 = await hesapAcOkul(M, { ad: 'Kopya', soyad: 'Ogrenci', tc: tcUret(), kullaniciAdi: ' OGRENCI1 ' });
  kontrol('okulda aynı kullanıcı adı (büyük harf, boşluk) açılamaz, alan kullaniciAdi', h1.status === 400 && h1.body.alan === 'kullaniciAdi', J(h1.body));
  const h2 = await hesapAcOkul(M, { ad: 'Kopya', soyad: 'Tc', tc: ogr1.tc_kimlik, kullaniciAdi: 'kopyatc' + z });
  kontrol('okulda aynı T.C. açılamaz, alan tc', h2.status === 400 && h2.body.alan === 'tc', J(h2.body));
  const h3 = await hesapAcOkul(M, { ad: 'Kopya', soyad: 'Eposta', tc: tcUret(), kullaniciAdi: 'kopyaep' + z, eposta: 'MUDUR@TEST.COM ' });
  kontrol('başka hesabın e-postası (büyük harf) verilemez, alan eposta', h3.status === 400 && h3.body.alan === 'eposta', J(h3.body));
  const h4 = await hesapAcOkul(M, { ad: 'Kopya', soyad: 'Turkce', tc: tcUret(), kullaniciAdi: 'kopyatr' + z, eposta: 'öğrenci' + z + '@test.com' });
  kontrol('Türkçe harfli e-posta reddedildi, alan eposta', h4.status === 400 && h4.body.alan === 'eposta', J(h4.body));
  const h5 = await hesapAcOkul(M, { rol: 'servisci', ad: 'Kopya', soyad: 'Servis', tc: ogr1.tc_kimlik, kullaniciAdi: 'kopyasv' + z });
  kontrol('servisçi okuldaki öğrencinin T.C. sini alamaz, alan tc', h5.status === 400 && h5.body.alan === 'tc', J(h5.body));
  const h6 = await hesapAcOkul(M, { ad: 'Admin', soyad: 'Adli', tc: tcUret(), kullaniciAdi: 'ADMIN' });
  kontrol('öğrenciye yöneticinin kullanıcı adı verilemez', h6.status === 400 && h6.body.alan === 'kullaniciAdi', J(h6.body));
  const h7 = await hesapAcOkul(M, { ad: 'Yetiskin', soyad: 'Adli', tc: tcUret(), kullaniciAdi: aK });
  kontrol('öğrenci bir yetişkinin adını alabilir (ayrı ad alanı, 009)', h7.status === 200, J(h7.body));

  const ayniAd = 'yarisogr' + z;
  const p1 = await Promise.all([0, 1, 2, 3].map(() => hesapAcOkul(M, { ad: 'Yaris', soyad: 'Ad', tc: tcUret(), kullaniciAdi: ayniAd })));
  kontrol('aynı adla aynı anda 4 öğrenci: 1 açıldı, 3 alan kullaniciAdi', p1.filter(r => r.status === 200).length === 1 &&
    p1.filter(r => r.status === 400 && r.body.alan === 'kullaniciAdi').length === 3, J(p1.map(r => [r.status, r.body.alan, r.body.error])));
  const ayniTc = tcUret();
  const p2 = await Promise.all([0, 1, 2, 3].map(i => hesapAcOkul(M, { ad: 'Yaris', soyad: 'Tc', tc: ayniTc, kullaniciAdi: 'yaristco' + i + z })));
  kontrol('aynı T.C. ile aynı anda 4 öğrenci: 1 açıldı, 3 alan tc', p2.filter(r => r.status === 200).length === 1 &&
    p2.filter(r => r.status === 400 && r.body.alan === 'tc').length === 3, J(p2.map(r => [r.status, r.body.alan, r.body.error])));
  const ayniEp = 'yarisep' + z + '@test.com';
  const p3 = await Promise.all([0, 1, 2].map(i => hesapAcOkul(M, { ad: 'Yaris', soyad: 'Ep', tc: tcUret(), kullaniciAdi: 'yarisep' + i + z,
    eposta: i ? ayniEp.toUpperCase() : ayniEp })));
  kontrol('aynı e-postayla aynı anda 3 öğrenci: 1 açıldı, 2 alan eposta', p3.filter(r => r.status === 200).length === 1 &&
    p3.filter(r => r.status === 400 && r.body.alan === 'eposta').length === 2, J(p3.map(r => [r.status, r.body.alan, r.body.error])));
  kontrol('veritabanında: adla 1, T.C. ile 1, e-postayla 1 hesap',
    await say('SELECT count(*) AS n FROM kullanicilar WHERE kullanici_adi = $1', [ayniAd]) === 1 &&
    await say('SELECT count(*) AS n FROM kullanicilar WHERE tc_kimlik = $1', [ayniTc]) === 1 &&
    await say('SELECT count(*) AS n FROM kullanicilar WHERE eposta = $1', [ayniEp]) === 1);
  const d1 = (await hesapAcOkul(M, { ad: 'Duzen', soyad: 'Bir', tc: tcUret(), kullaniciAdi: 'duzen1' + z })).body.hesap;
  const d2 = (await hesapAcOkul(M, { ad: 'Duzen', soyad: 'Iki', tc: tcUret(), kullaniciAdi: 'duzen2' + z })).body.hesap;
  const du = await iste('/api/school/hesap-guncelle', 'POST', { id: d2.id, kullaniciAdi: 'DUZEN1' + z }, M);
  kontrol('düzenlemede başka öğrencinin adı (büyük harf) verilemez', du.status === 400 && du.body.alan === 'kullaniciAdi', J(du.body));
  const dAd = 'duzenyeni' + z;
  const dp = await Promise.all([d1, d2].map(d => iste('/api/school/hesap-guncelle', 'POST', { id: d.id, kullaniciAdi: dAd }, M)));
  kontrol('iki öğrenci aynı anda aynı ada: biri alır, öteki alan kullaniciAdi', dp.filter(r => r.status === 200).length === 1 &&
    dp.some(r => r.status === 400 && r.body.alan === 'kullaniciAdi'), J(dp.map(r => [r.status, r.body])));

  console.log('=== 6) EXCEL İLE TOPLU AÇMA ===');
  const baslik = ['Ad', 'Soyad', 'T.C. Kimlik No', 'Kullanıcı adı', 'E-posta', 'Şifre'];
  const exAd = 'cak.excel' + z;
  const kitap = satirlar => xlsx.yaz([{ ad: 'Öğrenciler', basliklar: baslik, satirlar }]).toString('base64');
  const on = await iste('/api/school/kisi-aktarim', 'POST', { dosya: kitap([
    ['Ali', 'Excel', tcUret(), exAd.toUpperCase(), 'Cak.Excel' + z + '@Test.com', 'Test1234!'],
    ['Can', 'Excel', tcUret(), exAd, ' cak.excel' + z + '@test.com', 'Test1234!'],
    ['Cem', 'Excel', tcUret(), 'Ogrenci1', '', 'Test1234!'],
    ['Cey', 'Excel', tcUret(), 'kopyaexcel' + z, 'MUDUR@test.com', 'Test1234!'],
    ['Adm', 'Excel', tcUret(), 'admin', '', 'Test1234!'],
    ['Tc', 'Excel', ogr1.tc_kimlik, 'tcexcel' + z, '', 'Test1234!']
  ]), dosyaAdi: 'liste.xlsx', uygula: false }, M);
  const rapor = (on.body.rapor || []).map(r => r.durum + ':' + r.mesaj);
  kontrol('önizleme: yalnız ilk satır hazır', on.status === 200 && on.body.hazir === 1, J(on.body));
  kontrol('dosyada aynı ad / e-posta (harf ve boşluk farkıyla) ikinci satırda yakalandı', /dosyada 2\. satırda da var/.test(rapor[1] || ''), J(rapor[1]));
  kontrol('okuldaki öğrencinin adı, başka hesabın e-postası, yönetici adı reddedildi',
    /alınmış/.test(rapor[2] || '') && /başka bir hesapta/.test(rapor[3] || '') && /alınmış/.test(rapor[4] || ''), J(rapor.slice(2, 5)));
  kontrol('okulda kayıtlı T.C. yeni hesap açmıyor (güncelleme sayılıyor)', /^guncel/.test(rapor[5] || ''), J(rapor[5]));
  const exSatirlar = [0, 1, 2].map(i => ['Yaris' + i, 'Excel', tcUret(), 'yarisexcel' + i + z, '', 'Test1234!']);
  const ex = await Promise.all([0, 1].map(() => iste('/api/school/kisi-aktarim', 'POST',
    { dosya: kitap(exSatirlar), dosyaAdi: 'liste.xlsx', uygula: true }, M)));
  const exSay = await say('SELECT count(*) AS n FROM kullanicilar WHERE tc_kimlik = ANY($1::text[])', [exSatirlar.map(s => s[2])]);
  kontrol('aynı liste aynı anda iki kez yüklendi: 3 hesap (çift yok)', exSay === 3, 'hesap sayısı ' + exSay);
  kontrol('ikinci yükleme ya güncelleme oldu ya açık bir iletiyle durdu',
    ex.some(r => r.status === 200 && r.body.acilan === 3) && ex.every(r => r.status === 200 ||
      (r.status === 409 && !!r.body.alan && /Hiçbir hesap açılmadı/.test(r.body.error))), J(ex.map(r => [r.status, r.body.acilan, r.body.error])));

  console.log('=== 7) İKİNCİ OKUL: AYNI AD, AYNI T.C., NAKİL, GİRİŞ ===');
  const mb = 'cakmudur' + z;
  await hesapAc({ fullName: 'Cak Mudur', username: mb, email: mb + '@test.com' });
  const mbIlk = await girisYap(mb, 'Test1234!');
  const kisaB = 'cakisma-' + z;
  const okAc = await iste('/api/admin/okul-ac', 'POST', { schoolName: 'Çakışma Ortaokulu ' + z, city: 'Ankara', district: 'Çankaya',
    kisaAd: kisaB, mudurKodu: await kisiKodu(mbIlk.token) }, A);
  kontrol('ikinci okul açıldı', okAc.status === 200, J(okAc.body));
  const mbG = await girisYap(mb, 'Test1234!');
  const MB = mbG.user.role === 'principal' ? mbG.token
    : (await kisilikGec(mbG.token, 'rol', ((await iste('/api/kisilikler', 'GET', null, mbG.token)).body.roller || [])
      .find(r => r.rol === 'principal').id)).token;
  const okulB = okAc.body.okul.id;
  const ortakOgr = 'ayniogr' + z;
  const oa = await hesapAcOkul(M, { ad: 'Ayni', soyad: 'Aa', tc: tcUret(), kullaniciAdi: ortakOgr, password: 'Okul-A-2026' });
  const ob = await hesapAcOkul(MB, { ad: 'Ayni', soyad: 'Bb', tc: tcUret(), kullaniciAdi: ortakOgr.toUpperCase(), password: 'Okul-B-2026' });
  kontrol('aynı kullanıcı adı iki okulda açılabildi', oa.status === 200 && ob.status === 200, J([oa.body, ob.body]));
  const ga = await giris(ortakOgr, 'Okul-A-2026', ortakOgr, kisaA);
  const gb = await giris(ortakOgr, 'Okul-B-2026', ortakOgr, kisaB);
  kontrol('okul adresinden giriş doğru hesabı buluyor', ga.status === 200 && gb.status === 200 &&
    ga.body.user.schoolId === okulA && gb.body.user.schoolId === okulB, J([ga.body.user && ga.body.user.schoolId, gb.body.user && gb.body.user.schoolId]));
  const gc = await giris(ortakOgr, 'Okul-A-2026', ortakOgr);
  kontrol('okul seçilmeden yazılan ortak ad okul sorar', gc.status === 400 && gc.body.okulSec === true, J(gc.body));

  const yeniTc = tcUret();
  const cs = await Promise.all([
    hesapAcOkul(M, { ad: 'Iki', soyad: 'Okul', tc: yeniTc, kullaniciAdi: 'ikiokula' + z }),
    hesapAcOkul(MB, { ad: 'Iki', soyad: 'Okul', tc: yeniTc, kullaniciAdi: 'ikiokulb' + z })]);
  kontrol('aynı T.C. iki okulda aynı anda: tek öğrenci hesabı',
    await say("SELECT count(*) AS n FROM kullanicilar WHERE tc_kimlik = $1 AND rol = 'student'", [yeniTc]) === 1, J(cs.map(r => r.status)));
  kontrol('kaybeden okul "T.C. başka okulda" (alan tc) ya da nakil sorusu aldı', cs.filter(r => r.status === 200).length === 1 &&
    cs.some(r => (r.status === 400 && r.body.alan === 'tc') || (r.status === 409 && r.body.nakil === 'dogum')), J(cs.map(r => [r.status, r.body])));

  const nTc = tcUret();
  const nOgr = await hesapAcOkul(M, { ad: 'Nakil', soyad: 'Cak', tc: nTc, kullaniciAdi: 'nakilcak' + z, dogum: '04.03.2013' });
  const sv = await hesapAcOkul(MB, { rol: 'servisci', ad: 'Servis', soyad: 'Cak', tc: nTc, kullaniciAdi: 'servisnakil' + z });
  kontrol('öğrenci A okulunda, B okulunda aynı T.C. ile servisçi var', nOgr.status === 200 && sv.status === 200, J([nOgr.body, sv.body]));
  const nk = await hesapAcOkul(MB, { ad: 'Nakil', soyad: 'Cak', tc: nTc, dogum: '04.03.2013' });
  kontrol('nakil: yeni okulda aynı T.C. başka hesapta, öğrenci taşınmadı (alan tc)', nk.status === 400 && nk.body.alan === 'tc', J(nk.body));
  kontrol('öğrenci eski okulunda kaldı', (await tek('SELECT okul_id FROM kullanicilar WHERE id = $1', [nOgr.body.hesap.id])).okul_id === okulA);

  console.log('=== 8) KİŞİ KODUYLA ÖĞRETMEN, VELİ BAĞLAMA ===');
  const tK = 'tcak' + z;
  await hesapAc({ fullName: 'Tcak Ogretmen', username: tK, email: tK + '@test.com' });
  const ta = await hesapAcOkul(M, { ad: 'Tcak', soyad: 'Ogrenci', tc: tcUret(), kullaniciAdi: tK });
  const tG = await girisYap(tK + '@test.com', 'Test1234!');
  const te = await iste('/api/school/ogretmen-ekle', 'POST', { kod: await kisiKodu(tG.token), brans: 'Matematik' }, M);
  kontrol('öğretmenin adı okulda bir öğrencide: rol satırı başka ad aldı', ta.status === 200 && te.status === 200 &&
    te.body.hesap.username !== tK && te.body.hesap.username.indexOf(tK) === 0, J(te.body));
  const t2K = 'tcakiki' + z;
  await hesapAc({ fullName: 'Tcak Iki', username: t2K, email: t2K + '@test.com' });
  const t2G = await girisYap(t2K, 'Test1234!');
  const kod2 = await kisiKodu(t2G.token);
  const tp = await Promise.all([0, 1].map(() => iste('/api/school/ogretmen-ekle', 'POST', { kod: kod2, brans: 'Türkçe' }, M)));
  const anaId = (await tek('SELECT id FROM kullanicilar WHERE kullanici_adi = $1 AND ana_hesap_id IS NULL', [t2K])).id;
  kontrol('aynı kodla aynı anda iki ekleme: tek öğretmen rolü', tp.filter(r => r.status === 200).length === 1 &&
    await say('SELECT count(*) AS n FROM kullanicilar WHERE ana_hesap_id = $1 AND okul_id = $2', [anaId, okulA]) === 1,
  J(tp.map(r => [r.status, r.body.error])));

  const vK = 'vcak' + z;
  await hesapAc({ fullName: 'Vcak Veli', username: vK, email: vK + '@test.com' });
  const V = (await girisYap(vK, 'Test1234!')).token;
  const ogrKod = (await tek('SELECT veli_kodu FROM kullanicilar WHERE id = $1', [d1.id])).veli_kodu;
  const vp = await Promise.all([0, 1].map(() => iste('/api/parent/link', 'POST', { code: ogrKod }, V)));
  const vId = (await tek('SELECT id FROM kullanicilar WHERE kullanici_adi = $1', [vK])).id;
  kontrol('veli aynı kodu aynı anda iki kez girdi: tek bağ', vp.some(r => r.status === 200) &&
    await say('SELECT count(*) AS n FROM veli_baglari WHERE veli_id = $1 AND ogrenci_id = $2', [vId, d1.id]) === 1, J(vp.map(r => r.status)));
  const v2K = 'vcakiki' + z;
  await hesapAc({ fullName: 'Vcak Iki', username: v2K, email: v2K + '@test.com' });
  const vb = await iste('/api/school/veli-bul?kimlik=' + encodeURIComponent(v2K.toUpperCase()), 'GET', null, M);
  kontrol('okul veliyi büyük harfle yazılan adıyla buldu', vb.status === 200 && !!vb.body.kisi && !!vb.body.kisi.id, J(vb.body));
  const vbp = await Promise.all([0, 1].map(() => iste('/api/school/veli-bagla', 'POST', { studentId: d1.id, veliId: vb.body.kisi.id }, M)));
  kontrol('okul aynı veliyi aynı anda iki kez bağladı: tek bağ', vbp.some(r => r.status === 200) &&
    await say('SELECT count(*) AS n FROM veli_baglari WHERE veli_id = $1 AND ogrenci_id = $2', [vb.body.kisi.id, d1.id]) === 1,
  J(vbp.map(r => [r.status, r.body.error])));

  console.log('=== 9) admins.json ===');
  const yd = require('../sunucu/yonetici-dosyasi');
  const dosya = path.join(__dirname, 'testdata', 'admins-cakisma-' + z + '.json');
  const yonE = 'Cak.Yonetici' + z + '@Test.com', yonK = 'cakyon' + z;
  fs.writeFileSync(dosya, JSON.stringify({ yoneticiler: [
    { ad: 'Buyuk Harf', eposta: ' MUDUR@TEST.COM ' },
    { ad: 'Tam Genislik', eposta: 'ｍａｔ＠ｔｅｓｔ．ｃｏｍ' },
    { ad: 'Okul Adi', eposta: 'okuladi' + z + '@test.com', kullaniciAdi: 'OGRENCI1', sifre: 'Guclu-Sifre-1!' },
    { ad: 'Turkce Harf', eposta: 'yönetici' + z + '@test.com' },
    { ad: 'Cak Yonetici', eposta: yonE, kullaniciAdi: yonK.toUpperCase(), sifre: 'Guclu-Sifre-1!' }
  ] }));
  const ys = await yd.uygula(depo, { dosya, sifreUret: () => 'Uretilen-Sifre-9!' });
  fs.unlinkSync(dosya);
  const neden = i => ((ys.atlanan.find(a => a.sira === i) || {}).neden) || '';
  kontrol('büyük harfli / tam genişlikli yazılan başka hesabın e-postası yönetici yapılmadı',
    /yönetici olmayan/.test(neden(1)) && /yönetici olmayan/.test(neden(2)), J(ys.atlanan));
  kontrol('okuldaki bir hesabın kullanıcı adı yöneticiye verilmedi', /kullanıcı adı başka bir hesapta/.test(neden(3)), neden(3));
  kontrol('Türkçe harfli e-posta atlandı', /Türkçe/.test(neden(4)), neden(4));
  const yonSatir = await tek("SELECT id, eposta, kullanici_adi FROM kullanicilar WHERE rol = 'admin' AND kullanici_adi = $1", [yonK]);
  kontrol('geçerli satır açıldı, e-posta ve ad küçük harfle', ys.eklenen.length === 1 && !!yonSatir && yonSatir.eposta === yonE.toLowerCase(),
    J([ys.eklenen, yonSatir]));
  const yo1 = await hesapAcOkul(M, { ad: 'Yon', soyad: 'Adli', tc: tcUret(), kullaniciAdi: yonK.toUpperCase() });
  kontrol('okul yeni yöneticinin adını öğrenciye veremez', yo1.status === 400 && yo1.body.alan === 'kullaniciAdi', J(yo1.body));
  const yo2 = await kayit({ fullName: 'Yon Adli', username: yonK, email: 'yonadli' + z + '@test.com' });
  kontrol('yöneticinin adıyla kaydolunamaz', yo2.status === 400 && yo2.body.alan === 'kullaniciAdi', J(yo2.body));

  console.log('=== 10) VERİTABANI DÜZEYİ (uygulama denetimi atlanarak) ===');
  const { uid, now } = o;
  const ham = (g) => Object.assign({ id: uid('u'), pass: 'kullanilmaz', fullName: 'Ham Kayit', status: 'approved',
    city: '', district: '', address: '', createdAt: now() }, g);
  const hata = async fn => { try { await fn(); return null; } catch (e) { return e; } };
  const e1 = await hata(() => depo.kullanicilar.ekle(ham({ username: 'hamveli' + z, email: 'mudur@test.com', role: 'parent' })));
  const c1 = depo.baglanti.hataCevir(e1);
  kontrol('aynı e-posta: 23505, alan eposta', !!e1 && e1.code === '23505' && c1 && c1.kod === 400 && c1.alan === 'eposta', J([e1 && e1.constraint, c1]));
  const e2 = await hata(() => depo.kullanicilar.ekle(ham({ username: 'ogrenci1', role: 'student', schoolId: okulA })));
  kontrol('okulda aynı kullanıcı adı: 23505 (kullanicilar_kadi_okul), alan kullaniciAdi', !!e2 && e2.constraint === 'kullanicilar_kadi_okul' &&
    depo.baglanti.hataCevir(e2).alan === 'kullaniciAdi', J(e2 && e2.constraint));
  const e3 = await hata(() => depo.kullanicilar.ekle(ham({ username: 'hamogr' + z, role: 'student', schoolId: okulB, tc: ogr1.tc_kimlik })));
  kontrol('öğrenci T.C. si başka okulda: 23505 (kullanicilar_tc_ogrenci), alan tc', !!e3 && e3.constraint === 'kullanicilar_tc_ogrenci' &&
    depo.baglanti.hataCevir(e3).alan === 'tc', J(e3 && e3.constraint));
  const e4 = await hata(() => depo.kullanicilar.ekle(ham({ username: 'hamyon' + z, email: 'hamyon' + z + '@test.com', role: 'parent', tc: aTc })));
  kontrol('yetişkinde aynı T.C.: 23505 (kullanicilar_tc_genel)', !!e4 && e4.constraint === 'kullanicilar_tc_genel', J(e4 && e4.constraint));
  const e5 = await hata(() => depo.kullanicilar.ekle(ham({ username: 'ogrenci1', email: 'hamadmin' + z + '@test.com', role: 'admin' })));
  kontrol('yöneticiye okuldaki bir hesabın adı: tetikleyici durdurdu (kullanicilar_kadi_yonetici)', !!e5 && e5.code === '23505' &&
    e5.constraint === 'kullanicilar_kadi_yonetici' && depo.baglanti.hataCevir(e5).alan === 'kullaniciAdi', J(e5 && [e5.code, e5.constraint]));
  const e6 = await hata(() => depo.kullanicilar.ekle(ham({ username: 'admin', role: 'servisci', schoolId: okulB })));
  kontrol('okul hesabına yöneticinin adı: tetikleyici durdurdu', !!e6 && e6.constraint === 'kullanicilar_kadi_yonetici', J(e6 && e6.constraint));
  const e7 = await hata(() => depo.kullanicilar.guncelle(d1.id, { username: 'admin' }));
  kontrol('var olan öğrencinin adı yöneticininkine çevrilemez (UPDATE)', !!e7 && e7.constraint === 'kullanicilar_kadi_yonetici', J(e7 && e7.constraint));

  /* Yarış 1: yönetici işlemi açıkken aynı adla okul hesabı yazılır: yönetici bitince durur. */
  const r1Ad = 'yarisyon' + z;
  let birak1;
  const kapi1 = new Promise(r => { birak1 = r; });
  const yonIs = depo.baglanti.islem(async () => {
    await depo.kullanicilar.ekle(ham({ username: r1Ad, email: r1Ad + '@test.com', role: 'admin' }));
    await kapi1;
  });
  await bekle(300);
  let ogrBitti = false;
  const ogrIs = depo.kullanicilar.ekle(ham({ username: r1Ad, role: 'student', schoolId: okulA }))
    .then(() => null, e => e).then(e => { ogrBitti = true; return e; });
  await bekle(500);
  const beklediMi = !ogrBitti;
  birak1();
  await yonIs;
  const ogrHata = await ogrIs;
  kontrol('yarış 1: okul hesabı yönetici işlemini bekledi, sonra tetikleyiciye takıldı', beklediMi && !!ogrHata &&
    ogrHata.constraint === 'kullanicilar_kadi_yonetici', J([beklediMi, ogrHata && ogrHata.constraint, ogrHata && ogrHata.message]));
  /* Yarış 2: okul hesabı işlemi açıkken aynı adla yönetici yazılır: tablo kilidi bekler, sonra durur. */
  const r2Ad = 'yarisogr' + z + 'b';
  let birak2;
  const kapi2 = new Promise(r => { birak2 = r; });
  const ogrIs2 = depo.baglanti.islem(async () => {
    await depo.kullanicilar.ekle(ham({ username: r2Ad, role: 'student', schoolId: okulA }));
    await kapi2;
  });
  await bekle(300);
  let yonBitti = false;
  const yonIs2 = depo.kullanicilar.ekle(ham({ username: r2Ad, email: r2Ad + '@test.com', role: 'admin' }))
    .then(() => null, e => e).then(e => { yonBitti = true; return e; });
  await bekle(500);
  const bekledi2 = !yonBitti;
  birak2();
  await ogrIs2;
  const yonHata = await yonIs2;
  kontrol('yarış 2: yönetici okul hesabının işlemini bekledi, sonra tetikleyiciye takıldı', bekledi2 && !!yonHata &&
    yonHata.constraint === 'kullanicilar_kadi_yonetici', J([bekledi2, yonHata && yonHata.constraint, yonHata && yonHata.message]));
  kontrol('iki yarışta da ad tek hesapta', await say('SELECT count(*) AS n FROM kullanicilar WHERE kullanici_adi = ANY($1::text[])',
    [[r1Ad, r2Ad]]) === 2);
  const raporu = await depo.kullanicilar.cakismaRaporu();
  kontrol('açılış raporu: yöneticiyle aynı adlı hesap yok, e-posta çifti yok', !raporu.yoneticiAdCift.length &&
    !raporu.epostaCift.length && !raporu.ogrenciTcCift, J(raporu));
  for (const ad of [yonK, r1Ad]) {
    const s = await tek("SELECT id FROM kullanicilar WHERE rol = 'admin' AND kullanici_adi = $1", [ad]);
    if (s) await depo.kullanicilar.sil(s.id);
  }

  console.log('=== 10b) ESKİ SÜRÜMDE SAKLANMIŞ E-POSTA (yalnız kırpılıp küçültülmüş) ===');
  /* Eski normEmail "İ"yi "i̇" (i + birleşik nokta) yapardı. Açılışta (veri/index.js) bu
     adresler bugünkü biçime getirilir; aynı biçimde başka hesap varsa dokunulmaz. */
  const eskiNorm = s => String(s).trim().toLowerCase();
  const eskiYazim = 'ESKI' + z.toUpperCase() + '.İNCE@TEST.COM';
  const eskiSakli = eskiNorm(eskiYazim);
  const { hashPw } = require('../sunucu/sifre');
  const eskiSifre = 'Test1234!';
  const kvkk = { onay: true, tarih: now(), surum: '1.10' };
  const eskiHesap = ham({ username: 'eskiince' + z, email: eskiSakli, role: null, pass: await hashPw(eskiSifre), kvkk });
  await depo.kullanicilar.ekle(eskiHesap);
  const cakisE = 'cakis' + z + '.ince@test.com';
  const cakisYeni = ham({ username: 'cakisyeni' + z, email: cakisE, role: null, kvkk });
  const cakisEski = ham({ username: 'cakiseski' + z, email: eskiNorm('CAKIS' + z.toUpperCase() + '.İNCE@TEST.COM'), role: null, kvkk });
  await depo.kullanicilar.ekle(cakisYeni);
  await depo.kullanicilar.ekle(cakisEski);
  const adim1 = async kimlik => {
    const bot = await botCevabi();
    return iste('/api/login', 'POST', { email: kimlik, password: eskiSifre, challengeId: bot.challengeId, challengeAnswer: bot.challengeAnswer });
  };
  const onceGiris = await adim1(eskiYazim);
  kontrol('ön koşul: eski biçimli adres bugünkünden farklı ve düzeltmeden önce girişte bulunamıyor',
    eskiSakli !== o.normEmail(eskiYazim) && onceGiris.status === 401, onceGiris.status + ' ' + J(eskiSakli));
  const sade = await depo.kullanicilar.eskiEpostalariSadelestir();
  const eskiSonra = await tek('SELECT eposta FROM kullanicilar WHERE id = $1', [eskiHesap.id]);
  kontrol('açılış düzeltmesi: eski adres bugünkü biçime getirildi', sade.duzeltilen >= 1 && !!eskiSonra &&
    eskiSonra.eposta === o.normEmail(eskiYazim), J([sade, eskiSonra]));
  const [gBuyuk, gKucuk] = [await adim1(eskiYazim), await adim1(o.normEmail(eskiYazim))];
  kontrol('büyük İ ile de düz i ile de e-postayla giriş bulunuyor', gBuyuk.status === 200 && gKucuk.status === 200,
    gBuyuk.status + ' ' + gKucuk.status + ' ' + J(gBuyuk.body));
  const eskiKopya = await kayit({ fullName: 'Eski Kopya', username: 'eskikopya' + z, email: 'eski' + z + '.ince@test.com' });
  kontrol('aynı adresle (düz i) ikinci hesap açılamıyor, alan email', eskiKopya.status === 400 && eskiKopya.body.alan === 'email',
    J(eskiKopya.body));
  const cakisSonra = await tek('SELECT eposta FROM kullanicilar WHERE id = $1', [cakisEski.id]);
  const rapor2 = await depo.kullanicilar.cakismaRaporu();
  kontrol('aynı biçimde başka hesap varsa eski adrese dokunulmadı, açılış raporunda görünüyor', !!cakisSonra &&
    cakisSonra.eposta === cakisEski.email && sade.cakisan.indexOf(cakisEski.email) >= 0 &&
    rapor2.epostaCift.some(x => x.indexOf(cakisE) >= 0), J([cakisSonra, sade.cakisan, rapor2.epostaCift]));
  const ikinci = await depo.kullanicilar.eskiEpostalariSadelestir();
  kontrol('ikinci açılışta düzeltilecek adres kalmıyor', ikinci.duzeltilen === 0, J(ikinci));

  /* Açılış sırası (veri/index.js acilisHesaplari): eski biçimli adresler admins.json'dan
     ÖNCE düzeltilir. Sıra ters olsaydı aynı adres (büyük İ ile) dosyadan görünüşte aynı
     e-postalı ikinci bir hesap, üstelik yönetici olarak açılırdı. */
  const siraYazim = 'SIRA' + z.toUpperCase() + '.İNCE@TEST.COM';
  const siraHesap = ham({ username: 'siraince' + z, email: eskiNorm(siraYazim), role: null, kvkk });
  await depo.kullanicilar.ekle(siraHesap);
  const siraDosya = path.join(__dirname, 'testdata', 'admins-sira-' + z + '.json');
  fs.writeFileSync(siraDosya, JSON.stringify({ yoneticiler: [
    { ad: 'Sıra Yönetici', eposta: siraYazim, kullaniciAdi: 'sirayon' + z, sifre: 'Guclu-Sifre-1!' }] }));
  const acilis = await require('../sunucu/veri').acilisHesaplari({ dosya: siraDosya, sessiz: true });
  const siraSonra = await tek('SELECT eposta, rol FROM kullanicilar WHERE id = $1', [siraHesap.id]);
  const siraYonetici = await tek('SELECT id FROM kullanicilar WHERE kullanici_adi = $1', ['sirayon' + z]);
  const siraAyni = await say('SELECT count(*) AS n FROM kullanicilar WHERE eposta = $1', [o.normEmail(siraYazim)]);
  kontrol('açılışta eski biçimli adres admins.json\'dan önce düzeltiliyor: aynı adresle dosyadan yönetici açılmıyor',
    !!siraSonra && siraSonra.eposta === o.normEmail(siraYazim) && siraSonra.rol === null && !siraYonetici && siraAyni === 1 &&
    acilis.dosyadan.eklenen.length === 0 && acilis.dosyadan.atlanan.some(a => /yönetici olmayan bir hesapta/.test(a.neden)),
    J([siraSonra, !!siraYonetici, siraAyni, acilis.dosyadan.atlanan]));
  if (siraYonetici) await depo.kullanicilar.sil(siraYonetici.id);
  fs.unlinkSync(siraDosya);
  for (const h of [eskiHesap, cakisYeni, cakisEski, siraHesap]) await depo.kullanicilar.sil(h.id);

  const gunluk = fs.readFileSync(LOG, 'utf8').slice(logBas);
  kontrol('sunucu bu pakette 500 vermedi', !/API hatası|Veritabanı hatası/.test(gunluk),
    (gunluk.match(/(API hatası|Veritabanı hatası)[^\n]*/) || [''])[0]);

  console.log('=== 11) YEDEKTEN GERİ YÜKLEME (son adım: veriyi yeniden yazar) ===');
  const ja = require('../sunucu/veri/json-aktarim');
  const veri = await ja.disaAktar();
  const svTc = ogr1.tc_kimlik;
  veri.users.unshift({ id: 'u_cak_adminadli', role: 'student', schoolId: okulA, username: 'ADMIN', fullName: 'Admin Adli Ogrenci',
    pass: 'x', status: 'approved' });
  veri.users.push({ id: 'u_cak_servis', role: 'servisci', schoolId: okulA, username: 'cakservis' + z, fullName: 'Cak Servis',
    tc: svTc, pass: 'x', status: 'approved' });
  veri.users.push({ id: 'u_cak_ogrb', role: 'student', schoolId: okulB, username: 'cakogrb' + z, fullName: 'Cak Ogr B',
    tc: svTc, pass: 'x', status: 'approved' });
  veri.users.push({ id: 'u_cak_ep', role: 'parent', username: 'cakepveli' + z, email: '  MUDUR@TEST.COM', fullName: 'Cift Eposta',
    pass: 'x', status: 'approved' });
  let geriHata = null;
  try { await ja.iceAktar(veri); } catch (e) { geriHata = e; }
  kontrol('çiftli yedek geri yüklendi (23505 yok)', !geriHata, geriHata && (geriHata.constraint || geriHata.message));
  const adminAdli = await tek("SELECT kullanici_adi FROM kullanicilar WHERE id = 'u_cak_adminadli'");
  kontrol('yöneticinin adını taşıyan öğrenci başka ad aldı; yönetici "admin" kaldı', !!adminAdli && adminAdli.kullanici_adi !== 'admin' &&
    !!(await tek("SELECT 1 FROM kullanicilar WHERE rol = 'admin' AND kullanici_adi = 'admin'")), J(adminAdli));
  const svS = await tek("SELECT tc_kimlik FROM kullanicilar WHERE id = 'u_cak_servis'");
  const obS = await tek("SELECT tc_kimlik FROM kullanicilar WHERE id = 'u_cak_ogrb'");
  kontrol('okulda öğrencinin T.C. sini taşıyan servisçi ve başka okuldaki aynı T.C. li öğrenci T.C. siz yüklendi',
    !!svS && svS.tc_kimlik === null && !!obS && obS.tc_kimlik === null, J([svS, obS]));
  kontrol('büyük harfle yazılmış çift e-postalı hesap atlandı', !(await tek("SELECT 1 FROM kullanicilar WHERE id = 'u_cak_ep'")) &&
    await say("SELECT count(*) AS n FROM kullanicilar WHERE eposta = 'mudur@test.com'") === 1);
  kontrol('geri yüklemeden sonra da öğrenci T.C. si tek', await say("SELECT count(*) AS n FROM kullanicilar WHERE tc_kimlik = $1 AND rol = 'student'", [svTc]) === 1);

  await depo.baglanti.kapat();
  console.log('\nGECTI: ' + gecti + '  KALDI: ' + kaldi);
  process.exit(kaldi ? 1 : 0);
})().catch(async e => { console.error('TEST HATASI:', e.stack || e.message); process.exit(1); });
