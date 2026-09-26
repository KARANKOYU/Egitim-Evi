/* Kişi kodu (öğrencide veli kodu), müdür başvurusunun kalkması, portallar:
   - biçim: 15 karakter, ilk karakter harf; büyük, küçük, rakam ve ! ? # * + -
     her birinden en az biri; karışan karakterler (I L O l o 0 1) ve Türkçe harf yok;
   - büyük/küçük harf duyarlı; yalnız boşluklar silinir (5'erli yapıştırma olur);
     eski 10 haneli kod geçmez;
   - yetişkinin kişi kodu tek kullanımlık ve yenilenebilir; öğrencinin veli
     kodu kullanınca yenilenmez (iki veli aynı kodla ekler);
   - GET /api/kisilikler yan etkisiz (kod yazmaz);
   - yönetici kişi koduyla kişi bulur (tam ad, maskeli e-posta), yalnız
     yönetici; hız sınırı; okul açarken kod yenilenir; yöneticiye ve okul
     hesabına müdürlük verilemez;
   - okul-basvurusu, admin/pending, admin/decide uçları yok;
   - portallar yalnız yetişkin hesabında ve rol satırında.
   Veritabanı biçim kısıtı ve açılıştaki kod doldurma, test veritabanına
   (adı _test ile biten) depo üzerinden bağlanılarak denenir. */
const path = require('path');
const { iste, girisYap, hesapAc, kisiKodu, okulHesabi, tcUret } = require('./giris');
const { kisiKoduUret, kisiKoduSade, kisiKoduBicim, KISI_KODU_DESENI } = require('../sunucu/ortak');

let gecti = 0, kaldi = 0;
function kontrol(ad, sart, detay) {
  if (sart) { gecti++; console.log('  GECTI  ' + ad); }
  else { kaldi++; console.log('  KALDI  ' + ad + (detay ? '  -> ' + detay : '')); }
}
const J = x => JSON.stringify(x).slice(0, 240);
const BUYUK = 'ABCDEFGHJKMNPQRSTUVWXYZ', KUCUK = 'abcdefghijkmnpqrstuvwxyz', RAKAM = '23456789', OZEL = '!?#*+-';
const ALFABE = BUYUK + KUCUK + RAKAM + OZEL;
const bosluklu = k => ' ' + k.slice(0, 5) + '  ' + k.slice(5, 10) + ' ' + k.slice(10) + ' ';
const tersHarf = k => k.replace(/[A-Za-z]/g, c => c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase());

/* Test veritabanına depo üzerinden bağlantı (yalnızca adı _test ile biterse). */
function testDeposu() {
  process.env.EE_DATA = path.join(__dirname, 'testdata');
  require('../sunucu/ayarlar').ayarlariYukle();
  const baglanti = require('../sunucu/veri/baglanti');
  if (!/_test$/.test(baglanti.veritabaniAdi() || '')) return null;
  return { baglanti, kullanicilar: require('../sunucu/veri/depo/kullanicilar') };
}

(async () => {
  console.log('=== 1) BİÇİM (sunucusuz) ===');
  const kodlar = Array.from({ length: 3000 }, kisiKoduUret);
  kontrol('3000 kod: hepsi 15 karakter, ilk karakter harf', kodlar.every(k => k.length === 15 && /^[A-Za-z]/.test(k)));
  kontrol('yalnız alfabe: I L O l o 0 1 ve Türkçe harf yok', kodlar.every(k => [...k].every(c => ALFABE.indexOf(c) >= 0)) &&
    !kodlar.some(k => /[ILOlo01çğıöşüÇĞİÖŞÜ\s]/.test(k)));
  kontrol('her kodda büyük, küçük, rakam ve özel karakter var', kodlar.every(k =>
    [BUYUK, KUCUK, RAKAM, OZEL].every(s => [...k].some(c => s.indexOf(c) >= 0))));
  kontrol('kodlar birbirinden farklı', new Set(kodlar).size === kodlar.length);
  kontrol('alfabenin her karakteri üretiliyor', [...ALFABE].every(c => kodlar.some(k => k.indexOf(c) >= 0)));
  const ornek = 'Ab3#kQx9+mPt7?z';
  kontrol('ekranda 5\'erli, arada boşluk', kisiKoduBicim(ornek) === 'Ab3#k Qx9+m Pt7?z', kisiKoduBicim(ornek));
  kontrol('sadeleştirme yalnız boşlukları siler, harf durumunu korur', kisiKoduSade(' Ab3#k Qx9+m\tPt7?z ') === ornek &&
    kisiKoduSade(tersHarf(ornek)) === tersHarf(ornek));
  kontrol('eski 10 haneli kod, tireli yazım ve alfabe dışı karakter geçersiz', kisiKoduSade('ABCDEFGH23') === '' &&
    kisiKoduSade('ABCDE-FGH23') === '' && kisiKoduSade('Ab3#kQx9+mPt7?0') === '' && kisiKoduSade('Ab3#kQx9+mPt7?ş') === '' &&
    kisiKoduSade('+b3#kQx9+mPt7?z') === '' && kisiKoduSade('Ab3#kQx9+mPt7?') === '' && kisiKoduSade({}) === '');
  kontrol('sınıf koşulu: özel karakteri olmayan kod geçersiz', !KISI_KODU_DESENI.test('Ab3kkQx9mmPt7zz'));

  const A = (await girisYap('admin@egitimevi.com', 'admin123')).token;
  const Mg = await girisYap('mudur@test.com', 'Test1234!');
  const M = Mg.token;
  const z = Date.now().toString(36);

  console.log('=== 2) VELİ KODU: İKİ VELİ AYNI KODLA, HARF DUYARLI ===');
  const ogrenciler = (await iste('/api/school/students', 'GET', null, M)).body.students || [];
  const o1 = ogrenciler.find(s => s.username === 'ogrenci1');
  kontrol('öğrencinin veli kodu geçerli biçimde', KISI_KODU_DESENI.test(o1.code || ''), o1.code);
  const ogrG = await girisYap('ogrenci1@test.com', 'Test1234!');
  kontrol('öğrenci kendi veli kodunu görüyor (/me), portalı yok', ogrG.user.code === o1.code && ogrG.portallar === undefined &&
    (await iste('/api/me', 'GET', null, ogrG.token)).body.user.code === o1.code, J(ogrG.user));
  const anne = 'anne' + z, baba = 'baba' + z;
  await hesapAc({ fullName: 'Anne Deneme', username: anne, email: anne + '@test.com' });
  await hesapAc({ fullName: 'Baba Deneme', username: baba, email: baba + '@test.com' });
  const AN = (await girisYap(anne, 'Test1234!')).token, BA = (await girisYap(baba, 'Test1234!')).token;
  const eski = await iste('/api/kisilik/cocuk', 'POST', { code: 'ABCDE-FGH23' }, AN);
  const ters = await iste('/api/kisilik/cocuk', 'POST', { code: tersHarf(o1.code) }, AN);
  kontrol('eski 10 haneli kod ve harf durumu değişmiş kod reddedildi', eski.status === 400 && ters.status === 400,
    J(eski.body) + J(ters.body));
  const anneBag = await iste('/api/kisilik/cocuk', 'POST', { code: bosluklu(o1.code) }, AN);
  const babaBag = await iste('/api/kisilik/cocuk', 'POST', { code: o1.code }, BA);
  kontrol('anne (boşluklu yapıştırarak) ve baba aynı veli koduyla ekledi', anneBag.status === 200 && babaBag.status === 200 &&
    anneBag.body.cocuklar.length === 1 && babaBag.body.cocuklar.length === 1, J(anneBag.body) + J(babaBag.body));
  const sonra = (await iste('/api/school/students', 'GET', null, M)).body.students.find(s => s.id === o1.id);
  kontrol('veli kodu kullanınca yenilenmedi', sonra.code === o1.code, sonra.code);
  const anneMe = await iste('/api/me', 'GET', null, AN);
  kontrol('velinin /me cevabında veli portalı (çocuğun adıyla)', anneMe.body.hesapAktif === true &&
    (anneMe.body.portallar || []).length === 1 && anneMe.body.portallar[0].tur === 'veli' &&
    anneMe.body.portallar[0].id === o1.id && anneMe.body.portallar[0].alt === o1.fullName, J(anneMe.body.portallar));
  /* Okul yeniler: eski kod artık çalışmaz, bağlı veliler kalır. */
  const yenile = await iste('/api/school/student-code-reset', 'POST', { studentId: o1.id }, M);
  const eskiKodla = await iste('/api/parent/link', 'POST', { code: o1.code }, (await girisYap('fen@test.com', 'Test1234!')).token);
  kontrol('okul kodu yeniledi; eski kod artık çalışmıyor', yenile.status === 200 && KISI_KODU_DESENI.test(yenile.body.code) &&
    yenile.body.code !== o1.code && eskiKodla.status === 400, J(yenile.body) + ' ' + eskiKodla.status);

  console.log('=== 3) YETİŞKİNİN KİŞİ KODU ===');
  const ogt = 'kodogt' + z;
  await hesapAc({ fullName: 'Kodlu Öğretmen', username: ogt, email: ogt + '@test.com' });
  const OG = (await girisYap(ogt, 'Test1234!')).token;
  const k1 = await iste('/api/kisilikler', 'GET', null, OG);
  const k2 = await iste('/api/kisilikler', 'GET', null, OG);
  kontrol('hesap açılınca kişi kodu hazır; GET /api/kisilikler yan etkisiz (aynı kod)', KISI_KODU_DESENI.test(k1.body.kisiKodu || '') &&
    k1.body.kisiKodu === k2.body.kisiKodu && k1.body.ogretmenKodu === undefined, J(k1.body));
  const eskiGet = await iste('/api/school/ogretmen-bul?kod=' + encodeURIComponent(k1.body.kisiKodu), 'GET', null, M);
  kontrol('öğretmen arama artık GET ile değil (kod adrese yazılmaz)', eskiGet.status === 404, String(eskiGet.status));
  const tersBul = await iste('/api/school/ogretmen-bul', 'POST', { kod: tersHarf(k1.body.kisiKodu) }, M);
  const onHane = await iste('/api/school/ogretmen-bul', 'POST', { kod: 'ABCDE-FGH23' }, M);
  kontrol('harf durumu değişmiş ve eski biçim kod bulunmuyor', tersBul.status === 404 && onHane.status === 404,
    tersBul.status + ' ' + onHane.status);
  const bul = await iste('/api/school/ogretmen-bul', 'POST', { kod: bosluklu(k1.body.kisiKodu) }, M);
  kontrol('boşluklu yazılan kod bulunuyor, ad maskeli', bul.status === 200 && /^Ko\*+ Öğ\*+$/.test(bul.body.kisi.ad), J(bul.body));
  const yeni = await iste('/api/kisilik/kod', 'POST', {}, OG);
  const eskiyle = await iste('/api/school/ogretmen-bul', 'POST', { kod: k1.body.kisiKodu }, M);
  kontrol('"Yeni kod üret": yeni kod geldi, eskisi çalışmıyor', yeni.status === 200 && KISI_KODU_DESENI.test(yeni.body.kisiKodu || '') &&
    yeni.body.kisiKodu !== k1.body.kisiKodu && eskiyle.status === 404, J(yeni.body) + ' ' + eskiyle.status);
  const ekle = await iste('/api/school/ogretmen-ekle', 'POST', { kod: yeni.body.kisiKodu, brans: 'Türkçe' }, M);
  const k3 = await iste('/api/kisilikler', 'GET', null, OG);
  const ekle2 = await iste('/api/school/ogretmen-ekle', 'POST', { kod: yeni.body.kisiKodu, brans: 'Türkçe' }, M);
  kontrol('müdür ekleyince kod aynı işlemde yenilendi; aynı kod ikinci kez çalışmıyor', ekle.status === 200 &&
    k3.body.kisiKodu !== yeni.body.kisiKodu && KISI_KODU_DESENI.test(k3.body.kisiKodu) && ekle2.status === 404,
    J(ekle.body) + ' ' + ekle2.status);
  const srv = await okulHesabi(M, 'servisci', { fullName: 'Kodsuz Servisçi', username: 'kodsuz' + z, password: 'Servis2026' });
  const srvG = await girisYap('kodsuz' + z, 'Servis2026');
  const srvKis = await iste('/api/kisilikler', 'GET', null, srvG.token);
  kontrol('servisçinin kodu ve portalı yok', !srvG.user.code && srvG.portallar === undefined && srvKis.status === 403 && !!srv.id,
    J(srvG.user) + ' ' + srvKis.status);
  kontrol('yöneticinin portalı yok', (await iste('/api/me', 'GET', null, A)).body.portallar === undefined);

  console.log('=== 4) ESKİ UÇLAR YOK ===');
  const uclar = [await iste('/api/okul-basvurusu', 'POST', { schoolName: 'X', city: 'Ankara', district: 'Mamak' }, M),
    await iste('/api/admin/pending', 'GET', null, A), await iste('/api/admin/decide', 'POST', { userId: 'x', approve: true }, A)];
  kontrol('okul-basvurusu, admin/pending, admin/decide 404', uclar.every(r => r.status === 404), uclar.map(r => r.status).join(','));

  console.log('=== 5) YÖNETİCİ KİŞİ KODUYLA KİŞİ BULUR ===');
  const md = 'kodmudur' + z;
  await hesapAc({ fullName: 'Kodlu Müdür', username: md, email: md + '@test.com' });
  const MD = (await girisYap(md, 'Test1234!')).token;
  const mdKod = await kisiKodu(MD);
  const kb = await iste('/api/admin/kisi-bul', 'POST', { kod: bosluklu(mdKod) }, A);
  kontrol('yönetici tam adı, maskeli e-postayı, kullanıcı adını ve rol sayısını görüyor', kb.status === 200 &&
    kb.body.ad === 'Kodlu Müdür' && kb.body.kullaniciAdi === md && kb.body.rolSayisi === 0 &&
    kb.body.eposta === md.slice(0, 2) + '****@test.com', J(kb.body));
  const kbMudur = await iste('/api/admin/kisi-bul', 'POST', { kod: mdKod }, M);
  const kbYetiskin = await iste('/api/admin/kisi-bul', 'POST', { kod: mdKod }, MD);
  kontrol('kişi bulmayı yalnız yönetici yapar', kbMudur.status === 403 && kbYetiskin.status === 403, kbMudur.status + ' ' + kbYetiskin.status);
  const kbYok = await iste('/api/admin/kisi-bul', 'POST', { kod: 'Zz9#zZz9#zZz9#z' }, A);
  const kbOgr = await iste('/api/admin/kisi-bul', 'POST', { kod: yenile.body.code }, A);
  const kbTers = await iste('/api/admin/kisi-bul', 'POST', { kod: tersHarf(mdKod) }, A);
  kontrol('kimsede olmayan kod, öğrencinin veli kodu ve harfi değişmiş kod: 404 "Bu kodla bir hesap yok"', kbYok.status === 404 &&
    /Bu kodla bir hesap yok/.test(kbYok.body.error || '') && kbOgr.status === 404 && kbTers.status === 404,
    J(kbYok.body) + ' ' + kbOgr.status + ' ' + kbTers.status);
  const kbKisilik = await iste('/api/kisilikler', 'GET', null, MD);
  kontrol('kişi bulmak kodu harcamıyor', kbKisilik.body.kisiKodu === mdKod);

  console.log('=== 6) OKUL AÇ: KİŞİ KODUYLA MÜDÜR ===');
  const govde = { schoolName: 'Kod Okulu ' + z, city: 'Ankara', district: 'Mamak', kisaAd: 'kod-okulu-' + z };
  const acOgr = await iste('/api/admin/okul-ac', 'POST', Object.assign({ mudurKodu: yenile.body.code }, govde), A);
  kontrol('öğrencinin veli koduyla müdür yapılamıyor (404)', acOgr.status === 404 && acOgr.body.alan === 'mudurKodu', J(acOgr.body));
  const depo = testDeposu();
  if (depo) {
    /* Yönetici ve servisçide kod yoktur; olsaydı bile müdür yapılamamalı. */
    const adminId = (await iste('/api/me', 'GET', null, A)).body.user.id;
    const adminKod = kisiKoduUret(), srvKod = kisiKoduUret();
    await depo.kullanicilar.eslesmeKoduYaz(adminId, adminKod);
    await depo.kullanicilar.eslesmeKoduYaz(srv.id, srvKod);
    const acAdmin = await iste('/api/admin/okul-ac', 'POST', Object.assign({ mudurKodu: adminKod }, govde), A);
    const kbAdmin = await iste('/api/admin/kisi-bul', 'POST', { kod: adminKod }, A);
    const acSrv = await iste('/api/admin/okul-ac', 'POST', Object.assign({ mudurKodu: srvKod }, govde), A);
    kontrol('yönetici kendini ve okul hesabını müdür yapamıyor (400)', acAdmin.status === 400 && kbAdmin.status === 400 &&
      acSrv.status === 400 && acAdmin.body.alan === 'mudurKodu', J(acAdmin.body) + J(kbAdmin.body) + J(acSrv.body));
    await depo.kullanicilar.eslesmeKoduYaz(adminId, '');
    await depo.kullanicilar.eslesmeKoduYaz(srv.id, '');
  } else {
    console.log('  ATLANDI  yönetici/servisçi kodu denemesi (test veritabanına bağlanılamadı)');
  }
  const ac = await iste('/api/admin/okul-ac', 'POST', Object.assign({ mudurKodu: mdKod }, govde), A);
  const mdSonra = await kisiKodu(MD);
  kontrol('okul açıldı; sonuçta okulun adresi ve müdürün adı var; kişinin kodu yenilendi', ac.status === 200 &&
    ac.body.okul.kisaAd === 'kod-okulu-' + z && ac.body.mudur.ad === 'Kodlu Müdür' && mdSonra !== mdKod &&
    KISI_KODU_DESENI.test(mdSonra), J(ac.body));
  const mdBil = await iste('/api/notifications', 'GET', null, MD);
  kontrol('müdüre bildirim: sol üstteki menüden okuluna geçebilir', (mdBil.body.notifications || []).some(n =>
    /Kod Okulu .* okulunun müdürü olarak eklendin\. Sol üstteki menüden okuluna geçebilirsin\./.test(n.text)), J(mdBil.body.notifications));
  const mdG = await girisYap(md, 'Test1234!');
  kontrol('tek portalı olan müdür doğrudan okuluna giriyor; portal listesinde "Müdür · Kod Okulu"', mdG.user.role === 'principal' &&
    mdG.hesapAktif === false && mdG.portallar.length === 1 && mdG.portallar[0].ad === 'Müdür' &&
    mdG.portallar[0].alt === 'Kod Okulu ' + z && mdG.portallar[0].aktif === true, J(mdG.portallar));

  console.log('=== 7) VERİTABANI: BİÇİM KISITI VE AÇILIŞTA KOD DOLDURMA ===');
  if (depo) {
    let kisit = '';
    try { await depo.kullanicilar.guncelle(o1.id, { code: 'ABCDE12345' }); } catch (e) { kisit = e.code || 'hata'; }
    let kisit2 = '';
    try { await depo.kullanicilar.eslesmeKoduYaz(anneMe.body.user.id, '1bcdefghijk#2Aa'); } catch (e) { kisit2 = e.code || 'hata'; }
    kontrol('eski biçim veli kodu ve rakamla başlayan kişi kodu veritabanına yazılamıyor', kisit === '23514' && kisit2 === '23514',
      kisit + ' ' + kisit2);
    const anneId = anneMe.body.user.id;
    await depo.kullanicilar.guncelle(o1.id, { code: '' });
    await depo.kullanicilar.eslesmeKoduYaz(anneId, '');
    await depo.kullanicilar.eslesmeKoduYaz(srv.id, '');
    const n = await depo.kullanicilar.eksikKodlariDoldur();
    const o1Sonra = await depo.kullanicilar.bul(o1.id), anneSonra = await depo.kullanicilar.bul(anneId);
    const srvSonra = await depo.kullanicilar.bul(srv.id), rolSatiri = await depo.kullanicilar.bul(mdG.user.id);
    kontrol('kodu boş öğrenciye ve yetişkine kod üretildi; servisçi ve rol satırı kodsuz kaldı', n === 2 &&
      KISI_KODU_DESENI.test(o1Sonra.code) && KISI_KODU_DESENI.test(anneSonra.eslesmeKodu) && !srvSonra.eslesmeKodu &&
      !srvSonra.code && !rolSatiri.eslesmeKodu, n + ' ' + o1Sonra.code + ' ' + anneSonra.eslesmeKodu);
    kontrol('ikinci çalıştırmada doldurulacak kod yok', await depo.kullanicilar.eksikKodlariDoldur() === 0);
    /* Eski usul bekleyen öğretmen başvurusu reddedilince kişi rolsüz yetişkin
       hesabına döner; kişi kodu aynı anda yazılır (açılışı beklemez). */
    const red = 'redogt' + z;
    await hesapAc({ fullName: 'Red Öğretmen', username: red, email: red + '@test.com' });
    const RD = await girisYap(red, 'Test1234!');
    await depo.kullanicilar.guncelle(RD.user.id, { role: 'teacher', schoolId: Mg.user.schoolId, status: 'pending', eslesmeKodu: '' });
    const redKarar = await iste('/api/school/teacher-decide', 'POST', { userId: RD.user.id, approve: false }, M);
    const redSonra = await depo.kullanicilar.bul(RD.user.id);
    const redKis = await iste('/api/kisilikler', 'GET', null, RD.token);
    kontrol('reddedilen eski usul öğretmen rolsüz kaldı ve kişi kodu hemen üretildi', redKarar.status === 200 && !redSonra.role &&
      KISI_KODU_DESENI.test(redSonra.eslesmeKodu) && redKis.status === 200 && redKis.body.kisiKodu === redSonra.eslesmeKodu,
      redKarar.status + ' ' + J(redKarar.body) + ' ' + redSonra.eslesmeKodu + ' ' + J(redKis.body));
    await depo.baglanti.kapat();
  } else {
    console.log('  ATLANDI  veritabanı denemeleri (test veritabanına bağlanılamadı)');
  }

  console.log('=== 8) HIZ SINIRLARI (en sonda: sayaçlar dolar) ===');
  /* Kişi bul: yönetici başına dakikada 30. */
  let ilk429 = 0;
  for (let i = 1; i <= 35 && !ilk429; i++) {
    const r = await iste('/api/admin/kisi-bul', 'POST', { kod: mdSonra }, A);
    if (r.status === 429) ilk429 = i;
  }
  kontrol('kişi bulma dakikada 30 ile sınırlı', ilk429 > 20 && ilk429 <= 31, 'ilk429 ' + ilk429);
  /* Yanlış kod: aynı bağlantıdan saatte 30 (bul ve aç birlikte sayılır). */
  let yanlis429 = 0;
  for (let i = 1; i <= 35 && !yanlis429; i++) {
    const r = await iste('/api/admin/okul-ac', 'POST', Object.assign({}, govde, { schoolName: 'Deneme ' + z + ' ' + i,
      kisaAd: 'deneme-' + z + '-' + i, mudurKodu: kisiKoduUret() }), A);
    if (r.status === 429 && /yanlış kod/.test(r.body.error || '')) yanlis429 = i;
  }
  kontrol('yanlış kişi kodu aynı bağlantıdan saatte 30 ile sınırlı', yanlis429 > 0 && yanlis429 <= 31, 'yanlis429 ' + yanlis429);

  console.log();
  console.log('  GECTI: ' + gecti + '   KALDI: ' + kaldi);
  process.exit(kaldi ? 1 : 0);
})().catch(e => { console.log('  TEST HATASI: ' + e.stack); process.exit(1); });
