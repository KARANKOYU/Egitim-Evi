/* Yetişkin hesabı ve okul rolleri:
   - yetişkin hesabı kaydolur; e-postaya kod (iki adımlı giriş) öğrenci dışında herkese zorunlu;
   - okul başvurusu "müdür" rol satırı açar, yönetici onaylayana kadar girilemez;
   - öğretmen eşleme kodunu verir, müdür kodu girince öğretmen rolü açılır; kod tek kullanımlık;
   - tek rolde doğrudan girilir, birden çok seçenekte seçim ekranı; başkasının rolüne geçilemez;
   - bir kişi iki okulda rol alabilir (A'da öğretmen, B'de müdür) ve veli olabilir;
   - öğretmen okuldan ayrılabilir, müdür çıkarabilir; onaylı müdür rolü bırakılamaz;
   - şifre, kişisel bilgi, telefon bildirimi aboneliği yetişkin hesabınındır;
   - hesabı silme (KVKK) şifreyle; müdürken silinemez. */
const crypto = require('crypto');
const { iste, girisYap, hesapAc, mudurYap, kisilikGec, okulHesabi, tcUret, botCevabi } = require('./giris');

let gecti = 0, kaldi = 0;
function kontrol(ad, sart, detay) {
  if (sart) { gecti++; console.log('  GECTI  ' + ad); }
  else { kaldi++; console.log('  KALDI  ' + ad + (detay ? '  -> ' + detay : '')); }
}
const J = x => JSON.stringify(x).slice(0, 240);

/* Girişin ilk adımı (kod istenip istenmediğini görmek için). */
async function ilkAdim(kimlik, sifre, okul) {
  const bot = await botCevabi();
  return iste('/api/login', 'POST', { kimlik, password: sifre, okul, challengeId: bot.challengeId, challengeAnswer: bot.challengeAnswer });
}

(async () => {
  const z = Date.now().toString(36);
  const A = (await girisYap('admin@egitimevi.com', 'admin123')).token;
  const M = (await girisYap('mudur@test.com', 'Test1234!')).token;
  const okulA = (await iste('/api/me', 'GET', null, M)).body.user;

  console.log('=== 1) KAYIT VE İKİ ADIMLI GİRİŞ ===');
  const ep = 'yet' + z + '@test.com', kadi = 'yet' + z;
  await hesapAc({ fullName: 'Yeter Ekin', username: kadi, email: ep });
  const ilk = await ilkAdim(ep, 'Test1234!');
  kontrol('yetişkin hesabına e-postayla kod gidiyor', ilk.status === 200 && ilk.body.twoFactor === true, J(ilk.body));
  const ogrIlk = await ilkAdim('ogrenci1@test.com', 'Test1234!');
  kontrol('öğrenci e-postası olsa da kodsuz giriyor', ogrIlk.status === 200 && !!ogrIlk.body.token && !ogrIlk.body.twoFactor, J(ogrIlk.body));
  const H1 = await girisYap(ep, 'Test1234!');
  kontrol('rolü olmayan yetişkin kendi hesabına giriyor, seçim ekranı yok',
    H1.user.yetiskin === true && !H1.user.role && !H1.kisilikSec, J(H1.user));
  const k1 = await iste('/api/kisilikler', 'GET', null, H1.token);
  kontrol('seçim ekranı: rol yok, çocuk yok, öğretmen kodu var', k1.status === 200 && !k1.body.roller.length &&
    !k1.body.cocuklar.length && /^[A-Z0-9]{5}-[A-Z0-9]{5}$/.test(k1.body.ogretmenKodu), J(k1.body));
  const ogrKis = await iste('/api/kisilikler', 'GET', null, ogrIlk.body.token);
  kontrol('öğrenci ve yönetici seçim ekranını kullanamıyor', ogrKis.status === 403 &&
    (await iste('/api/kisilikler', 'GET', null, A)).status === 403, String(ogrKis.status));
  const ogrOgt = await iste('/api/school/hesap-ac', 'POST', { rol: 'teacher', ad: 'Ad', soyad: 'Soyad', tc: tcUret() }, M);
  kontrol('okul öğretmen hesabı açamıyor (öğretmen kendisi açar)', ogrOgt.status === 400, J(ogrOgt.body));

  console.log('=== 2) ÖĞRETMEN KODLA EKLENİYOR ===');
  const bul = await iste('/api/school/ogretmen-bul?kod=' + encodeURIComponent(k1.body.ogretmenKodu), 'GET', null, M);
  kontrol('müdür kodu girince yalnızca maskeli ad görüyor', bul.status === 200 && bul.body.kisi.ad === 'Ye*** Ek**' &&
    bul.body.kisi.zatenOkulda === false, J(bul.body));
  const O1 = await girisYap('mat@test.com', 'Test1234!');
  const ogtBul = await iste('/api/school/ogretmen-bul?kod=' + encodeURIComponent(k1.body.ogretmenKodu), 'GET', null, O1.token);
  kontrol('yetkisiz öğretmen kod arayamıyor', ogtBul.status === 403, String(ogtBul.status));
  const ekle = await iste('/api/school/ogretmen-ekle', 'POST', { kod: k1.body.ogretmenKodu, brans: 'Matematik' }, M);
  kontrol('öğretmen okula eklendi', ekle.status === 200 && !!ekle.body.hesap.id, J(ekle.body));
  const tekrar = await iste('/api/school/ogretmen-ekle', 'POST', { kod: k1.body.ogretmenKodu, brans: 'Matematik' }, M);
  kontrol('kod tek kullanımlık: aynı kod ikinci kez çalışmıyor', tekrar.status === 404, J(tekrar.body));
  const k2 = await iste('/api/kisilikler', 'GET', null, H1.token);
  kontrol('kod yenilendi, seçim ekranında "Öğretmen — okul" var', k2.body.ogretmenKodu !== k1.body.ogretmenKodu &&
    k2.body.roller.length === 1 && k2.body.roller[0].rol === 'teacher' && k2.body.roller[0].girilebilir &&
    k2.body.roller[0].okulAdi === okulA.schoolName, J(k2.body));
  const bil = await iste('/api/notifications', 'GET', null, H1.token);
  kontrol('öğretmene "okul seni ekledi" bildirimi gitti', (bil.body.notifications || []).some(n => /öğretmen olarak ekledi/.test(n.text)),
    J(bil.body.notifications));
  const H2 = await girisYap(kadi, 'Test1234!');
  kontrol('tek rolde doğrudan o role giriliyor', H2.user.role === 'teacher' && H2.user.rolSatiri === true &&
    H2.user.schoolId === okulA.schoolId && H2.user.fullName === 'Yeter Ekin', J(H2.user));
  const ogretmenRolId = H2.user.id;
  kontrol('rol satırında e-posta ve T.C. yok', !H2.user.email && !H2.user.tc, J(H2.user));

  console.log('=== 3) OKUL ROLÜ SATIRI: KİM NEYİ DEĞİŞTİRİR ===');
  const adDeg = await iste('/api/school/hesap-guncelle', 'POST', { id: ogretmenRolId, ad: 'Baska', soyad: 'Ad' }, M);
  const bransDeg = await iste('/api/school/hesap-guncelle', 'POST', { id: ogretmenRolId, brans: 'Fen Bilimleri' }, M);
  const sifreDeg = await iste('/api/school/hesap-sifre', 'POST', { id: ogretmenRolId, password: 'Yeni12345' }, M);
  kontrol('müdür öğretmenin adını ve şifresini değiştiremez, branşını değiştirir',
    adDeg.status === 400 && bransDeg.status === 200 && sifreDeg.status === 400,
    adDeg.status + ' ' + bransDeg.status + ' ' + sifreDeg.status);
  const hesapG = await iste('/api/school/hesap?id=' + ogretmenRolId, 'GET', null, M);
  kontrol('hesap penceresinde "bağlı" işareti var', hesapG.status === 200 && hesapG.body.hesap.bagli === true, J(hesapG.body));
  const girisRol = await ilkAdim(H2.user.username, 'Test1234!', okulA.schoolSlug);
  kontrol('okul sayfasından kullanıcı adıyla giriş yetişkin hesabına gider', girisRol.status === 200 && girisRol.body.twoFactor === true,
    J(girisRol.body));

  console.log('=== 4) İKİNCİ ROL: VELİ ===');
  const ogr1 = (await iste('/api/school/students', 'GET', null, M)).body.students.find(s => s.username === 'ogrenci1');
  const cocuk = await iste('/api/kisilik/cocuk', 'POST', { code: ogr1.code }, H2.token);
  kontrol('öğretmen rolündeyken çocuk yetişkin hesabına ekleniyor', cocuk.status === 200 && cocuk.body.cocuklar.length === 1, J(cocuk.body));
  const H3 = await girisYap(kadi, 'Test1234!');
  kontrol('iki seçenek varken seçim ekranı açılıyor', H3.kisilikSec === true && H3.user.yetiskin === true, J(H3));
  const gecRol = await kisilikGec(H3.token, 'rol', ogretmenRolId);
  kontrol('öğretmen rolüne geçildi', gecRol.user.role === 'teacher' && gecRol.user.id === ogretmenRolId, J(gecRol.user));
  const eskiAnahtar = await iste('/api/me', 'GET', null, H3.token);
  kontrol('geçişte eski oturum kapandı', eskiAnahtar.status === 401, String(eskiAnahtar.status));
  const gecVeli = await kisilikGec(gecRol.token, 'veli', ogr1.id);
  kontrol('veli olarak geçildi (çocuk seçili)', gecVeli.user.role === 'parent' && gecVeli.cocuk === ogr1.id &&
    gecVeli.children.length === 1, J(gecVeli));
  const V = gecVeli.token;

  console.log('=== 5) BAŞKASININ ROLÜ ===');
  const baskaRol = (await iste('/api/me', 'GET', null, M)).body.user.id;
  const r1 = await iste('/api/kisilik/gec', 'POST', { tur: 'rol', id: baskaRol }, V);
  const r2 = await iste('/api/kisilik/gec', 'POST', { tur: 'veli', id: (await iste('/api/school/students', 'GET', null, M)).body.students
    .find(s => s.username === 'ogrenci2').id }, V);
  const r3 = await iste('/api/kisilik/gec', 'POST', { tur: 'rol', id: { $ne: 1 } }, V);
  kontrol('başkasının rolüne, bağlı olmayan çocuğa, bozuk kimliğe geçilemiyor', r1.status === 404 && r2.status === 404 && r3.status === 404,
    r1.status + ' ' + r2.status + ' ' + r3.status);

  console.log('=== 6) İKİ OKUL: A\'DA ÖĞRETMEN, B\'DE MÜDÜR ===');
  const bas = await iste('/api/okul-basvurusu', 'POST', { dogum: '1980-01-01', beyan: true,  schoolName: 'Yetişkin Koleji ' + z, city: 'Ankara', district: 'Mamak' }, V);
  kontrol('okul başvurusu yetişkin hesabından yapılıyor, oturum düşmüyor', bas.status === 200 &&
    (await iste('/api/me', 'GET', null, V)).status === 200, J(bas.body));
  const bas2 = await iste('/api/okul-basvurusu', 'POST', { dogum: '1980-01-01', beyan: true,  schoolName: 'İkinci Okul ' + z, city: 'Ankara', district: 'Mamak' }, V);
  kontrol('bekleyen başvuru varken ikincisi yapılamıyor', bas2.status === 400, J(bas2.body));
  const k3 = await iste('/api/kisilikler', 'GET', null, V);
  const mudurRol = k3.body.roller.find(r => r.rol === 'principal');
  kontrol('müdür rolü "onay bekliyor", girilemez', mudurRol && mudurRol.durum === 'pending' && !mudurRol.girilebilir, J(k3.body.roller));
  const bekGec = await iste('/api/kisilik/gec', 'POST', { tur: 'rol', id: mudurRol.id }, V);
  kontrol('onay bekleyen role geçilemiyor', bekGec.status === 403, J(bekGec.body));
  const bek = await iste('/api/admin/pending', 'GET', null, A);
  const benim = (bek.body.principals || []).find(p => p.id === mudurRol.id);
  kontrol('yönetici başvuruyu yetişkin hesabının e-postasıyla görüyor', benim && benim.email === ep, J(benim));
  await iste('/api/admin/decide', 'POST', { userId: mudurRol.id, approve: true }, A);
  const k4 = await iste('/api/kisilikler', 'GET', null, V);
  kontrol('onaydan sonra iki okul rolü ve bir çocuk', k4.body.roller.filter(r => r.girilebilir).length === 2 &&
    k4.body.cocuklar.length === 1, J(k4.body));
  const MB = await kisilikGec(V, 'rol', mudurRol.id);
  kontrol('B okulunun müdürü olarak girildi', MB.user.role === 'principal' && MB.user.schoolId !== okulA.schoolId, J(MB.user));
  const ogrAdanB = await iste('/api/school/students', 'GET', null, MB.token);
  kontrol('B müdürü A okulunun öğrencilerini görmüyor', ogrAdanB.status === 200 && !ogrAdanB.body.students.length, J(ogrAdanB.body));
  const ayrilMudur = await iste('/api/kisilik/ayril', 'POST', { id: mudurRol.id, onay: true }, MB.token);
  kontrol('onaylı müdür rolü bırakılamıyor', ayrilMudur.status === 400, J(ayrilMudur.body));
  const silMudur = await iste('/api/hesap/sil', 'POST', { sifre: 'Test1234!', onay: true }, MB.token);
  kontrol('müdürken hesap silinemiyor', silMudur.status === 400, J(silMudur.body));

  console.log('=== 7) ŞİFRE VE KİŞİSEL BİLGİLER YETİŞKİN HESABININ ===');
  const sifre = await iste('/api/password', 'POST', { old: 'Test1234!', new: 'YeniSifre77!' }, MB.token);
  kontrol('müdür rolündeyken şifre değişti', sifre.status === 200, J(sifre.body));
  const eskiyle = await ilkAdim(kadi, 'Test1234!');
  const yeniyle = await ilkAdim(kadi, 'YeniSifre77!');
  kontrol('yeni şifre yetişkin hesabında geçerli, eskisi değil', eskiyle.status === 401 && yeniyle.status === 200, eskiyle.status + ' ' + yeniyle.status);
  const yanlisSifre = await iste('/api/hesap/bilgi', 'POST', { kullaniciAdi: 'yeniad' + z, sifre: 'yanlis123' }, MB.token);
  kontrol('kullanıcı adı değişikliği mevcut şifre ister', yanlisSifre.status === 400 && yanlisSifre.body.alan === 'sifre', J(yanlisSifre.body));
  const alinmis = await iste('/api/hesap/bilgi', 'POST', { kullaniciAdi: 'mudur', sifre: 'YeniSifre77!' }, MB.token);
  kontrol('alınmış kullanıcı adı verilmiyor', alinmis.status === 400 && alinmis.body.alan === 'kullaniciAdi', J(alinmis.body));
  const bosEposta = await iste('/api/hesap/bilgi', 'POST', { eposta: '', sifre: 'YeniSifre77!' }, MB.token);
  kontrol('yetişkin hesabının e-postası boşaltılamıyor', bosEposta.status === 400, J(bosEposta.body));
  const yeniAd = 'yeniad' + z;
  const bilgi = await iste('/api/hesap/bilgi', 'POST', { kullaniciAdi: yeniAd, telefon: '0533 111 22 33', sifre: 'YeniSifre77!' }, MB.token);
  kontrol('kullanıcı adı ve telefon değişti', bilgi.status === 200 && bilgi.body.hesap.username === yeniAd &&
    bilgi.body.hesap.phone === '+905331112233', J(bilgi.body));
  const hesapBilgi = await iste('/api/hesap', 'GET', null, MB.token);
  kontrol('müdür rolündeyken Ayarlar yetişkin hesabının bilgilerini gösteriyor', hesapBilgi.body.hesap.username === yeniAd &&
    hesapBilgi.body.hesap.email === ep && hesapBilgi.body.hesap.yetiskin === true, J(hesapBilgi.body));
  const prof = await iste('/api/profile', 'POST', { fullName: 'Yeter Ekinci' }, MB.token);
  const ogtListe = (await iste('/api/school/teachers', 'GET', null, M)).body.teachers.find(t => t.id === ogretmenRolId);
  kontrol('ad değişince A okulunun öğretmen listesinde de güncel', prof.status === 200 && ogtListe && ogtListe.fullName === 'Yeter Ekinci',
    J(ogtListe));
  const abone = (() => {
    const e = crypto.createECDH('prime256v1'); e.generateKeys();
    return { endpoint: 'https://fcm.googleapis.com/fcm/send/' + crypto.randomBytes(8).toString('hex'),
      keys: { p256dh: e.getPublicKey().toString('base64url'), auth: crypto.randomBytes(16).toString('base64url') } };
  })();
  await iste('/api/push/abone', 'POST', abone, MB.token);
  const VV = await kisilikGec(MB.token, 'hesap');
  const durum = await iste('/api/push/durum', 'POST', { endpoint: abone.endpoint }, VV.token);
  kontrol('telefon bildirimi aboneliği kişinin (her rolünden aynı)', durum.body.benim === true, J(durum.body));

  console.log('=== 8) OKULDAN AYRILMA VE ÇIKARILMA ===');
  const OA = await kisilikGec(VV.token, 'rol', ogretmenRolId);
  const ayril = await iste('/api/kisilik/ayril', 'POST', { id: ogretmenRolId, onay: true }, OA.token);
  kontrol('öğretmen A okulundan ayrıldı; bulunduğu rol kapandı, yetişkin hesabına döndü', ayril.status === 200 &&
    !!ayril.body.token && ayril.body.user.yetiskin === true, J(ayril.body));
  const mBil = await iste('/api/notifications', 'GET', null, M);
  kontrol('A müdürüne "okuldan ayrıldı" bildirimi', (mBil.body.notifications || []).some(n => /ayrıldı/.test(n.text)), J(mBil.body.notifications));
  const eskiRol = await iste('/api/me', 'GET', null, OA.token);
  kontrol('ayrılan rolün oturumu geçersiz', eskiRol.status === 401, String(eskiRol.status));

  const ep2 = 'cik' + z + '@test.com';
  const cik = await okulHesabi(M, 'teacher', { fullName: 'Çıkan Öğretmen', username: 'cik' + z, email: ep2, brans: 'Türkçe' });
  const sil = await iste('/api/school/hesap-sil', 'POST', { id: cik.id, onay: true }, M);
  const cikGiris = await girisYap(ep2, 'Test1234!');
  kontrol('müdür öğretmeni çıkarınca öğretmenin kendi hesabı duruyor', sil.status === 200 && cikGiris.user.yetiskin === true &&
    !cikGiris.user.role, J(cikGiris.user));

  console.log('=== 9) HESABI SİLME ===');
  const silYanlis = await iste('/api/hesap/sil', 'POST', { sifre: 'yanlis123', onay: true }, cikGiris.token);
  const silOnaysiz = await iste('/api/hesap/sil', 'POST', { sifre: 'Test1234!' }, cikGiris.token);
  kontrol('silme şifre ve onay istiyor', silYanlis.status === 400 && silOnaysiz.status === 400, silYanlis.status + ' ' + silOnaysiz.status);
  const silOk = await iste('/api/hesap/sil', 'POST', { sifre: 'Test1234!', onay: true }, cikGiris.token);
  const sonra = await ilkAdim(ep2, 'Test1234!');
  kontrol('hesap silindi, artık giriş yok', silOk.status === 200 && sonra.status === 401 && sonra.body.hesapYok === true, J(sonra.body));
  const ogrSil = await iste('/api/hesap/sil', 'POST', { sifre: 'Test1234!', onay: true }, ogrIlk.body.token);
  kontrol('öğrenci kendi hesabını silemiyor (okul siler)', ogrSil.status === 403, String(ogrSil.status));

  console.log('=== 10) AYNI AD: OKULDA ÖĞRENCİ, YETİŞKİN HESABI ===');
  const ortak = 'ortak' + z;
  await okulHesabi(M, 'student', { fullName: 'Ortak Ogrenci', username: ortak, password: 'Ogrenci123', tc: tcUret() });
  const ep3 = ortak + '@test.com';
  const kayitCakisma = await (async () => {
    const b = await botCevabi();
    return iste('/api/register', 'POST', Object.assign({ kvkkOnay: true, phone: '05321234567', fullName: 'Ortak Yetiskin', username: ortak,
      email: ep3, password: 'Yetiskin123!' }, b));
  })();
  kontrol('okulda kullanılan ad yeni yetişkin hesabına verilmiyor', kayitCakisma.status === 400, J(kayitCakisma.body));
  const kadi4 = 'dort' + z;
  await hesapAc({ fullName: 'Dört Yetişkin', username: kadi4, email: kadi4 + '@test.com', password: 'Yetiskin123!' });
  /* Okul kendi ad alanında aynı adı öğrenciye verebilir (yetişkin hesabı okuldan bağımsız). */
  await okulHesabi(M, 'student', { fullName: 'Ayni Adli', username: kadi4, password: 'Ogrenci123', tc: tcUret() });
  const ogrAd = await ilkAdim(kadi4, 'Ogrenci123', okulA.schoolSlug);
  const yetAd = await ilkAdim(kadi4, 'Yetiskin123!', okulA.schoolSlug);
  kontrol('okul sayfasında öğrenci de yetişkin de kendi adıyla giriyor', ogrAd.status === 200 && !!ogrAd.body.token &&
    yetAd.status === 200 && yetAd.body.twoFactor === true, ogrAd.status + ' ' + yetAd.status);

  console.log('=== 11) DOSYAYLA ÖĞRETMEN EKLENMEZ ===');
  const xlsx = require('../sunucu/yardimci/xlsx');
  const dosya = xlsx.yaz([{ ad: 'Öğretmenler', basliklar: ['Ad', 'Soyad', 'T.C. Kimlik No'], satirlar: [['Oya', 'Tan', tcUret()]] }])
    .toString('base64');
  const akt = await iste('/api/school/kisi-aktarim', 'POST', { dosya, dosyaAdi: 'ogretmenler.xlsx', uygula: false }, M);
  kontrol('öğretmen sayfası "kodla eklenir" hatası veriyor, hesap açılmıyor', akt.status === 200 && akt.body.hazir === 0 &&
    akt.body.rapor.some(r => /kendi hesabını açar/.test(r.mesaj)), J(akt.body));
  const sablon = await iste('/api/school/kisi-sablon', 'GET', null, M);
  const sayfalar = xlsx.oku(Buffer.from(sablon.body.dosya, 'base64')).map(s => s.ad);
  kontrol('şablonda öğretmen sayfası yok', sayfalar.indexOf('Öğretmenler') < 0 && sayfalar.indexOf('Öğrenciler') >= 0, sayfalar.join(','));

  console.log();
  console.log('  GECTI: ' + gecti + '   KALDI: ' + kaldi);
  process.exit(kaldi ? 1 : 0);
})().catch(e => { console.log('  TEST HATASI: ' + e.stack); process.exit(1); });
