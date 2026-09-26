/* Giriş ve kayıt:
   - kayıt rolsüzdür; veli veli kodunu girer, öğretmeni ve müdürü kişi koduyla okul/yönetici ekler;
   - girişte kullanıcı adı ya da e-posta; büyük/küçük harf fark etmez;
   - "hesap yok" ile "şifre yanlış" ayrı söylenir, kalan hak yazılır, kilit
     hesaba bağlıdır (e-posta ile kullanıcı adını sırayla denemek kilidi aşmaz);
   - müdür başvurusu yoktur (uç kapalı); aynı kişi koduyla aynı anda iki okul açılmaz;
   - kayıt hataları hangi alanda olduklarını söyler; doğrulama sorusu yalnızca
     hesap açılınca harcanır;
   - T.C. kimlik no isteğe bağlı, algoritmayla denetlenir, yalnızca kişinin kendisine gider;
   - veli kodu büyük/küçük harf duyarlı; boşluklar fark etmez;
   - şifre değişince öbür oturumlar kapanır;
   - okul araması kelime sırasına, noktalamaya, büyük harfe dayanıklıdır;
   - genel istek sınırı aynı ağdaki bir sınıfı engellemez. */
const { BASE, iste, girisYap, botCevabi, hesapAc, okulHesabi, tcUret, epostaOnayla, sonOnayAnahtari } = require('./giris');

let gecti = 0, kaldi = 0;
function kontrol(ad, sart, detay) {
  if (sart) { gecti++; console.log('  GECTI  ' + ad); }
  else { kaldi++; console.log('  KALDI  ' + ad + (detay ? '  -> ' + detay : '')); }
}
const J = x => JSON.stringify(x).slice(0, 160);

async function giris(kimlik, password) {
  const bot = await botCevabi();
  return iste('/api/login', 'POST', Object.assign({ kimlik, password }, bot));
}

async function kayit(govde, bot) {
  return iste('/api/register', 'POST', Object.assign({
    kvkkOnay: true, phone: '05321234567', password: 'Deneme2026!'
  }, govde, bot || await botCevabi()));
}

(async () => {
  const M = (await girisYap('mudur@test.com', 'Test1234!')).token;
  const A = (await girisYap('admin@egitimevi.com', 'admin123')).token;
  const z = Date.now();

  console.log('=== 1) ROLSUZ KAYIT ===');
  const k1 = await kayit({ fullName: 'AYŞE YILMAZ', username: 'Ayse.Yilmaz' + z, email: 'ayse' + z + '@test.com',
    tc: '10000000146' });
  /* Hesap, e-postadaki bağlantıya tıklanınca açılır: sahibi olunmayan adresle hesap açılamaz. */
  kontrol('kayıt e-posta onayı bekliyor, hesap henüz yok', k1.status === 200 && k1.body.onayGerekli === true && !k1.body.user &&
    /\*/.test(k1.body.eposta), J(k1.body));
  const onaysizGiris = await giris('ayse' + z + '@test.com', 'Deneme2026!');
  kontrol('onaylanmadan giriş olmuyor', onaysizGiris.status === 401, J(onaysizGiris.body));
  const uydurmaOnay = await iste('/api/eposta-onay', 'POST', { token: 'a'.repeat(64) });
  kontrol('uydurma onay anahtarı geçmiyor', uydurmaOnay.status === 400, J(uydurmaOnay.body));
  const k1Anahtar = sonOnayAnahtari('ayse' + z + '@test.com');
  const k1o = await epostaOnayla('ayse' + z + '@test.com');
  kontrol('bağlantıya tıklanınca hesap açıldı; mesajda kullanıcı adı yazıyor', k1o.tur === 'kayit' &&
    /Kullanıcı adın: ayse\.yilmaz/.test(k1o.message), J(k1o));
  const ikinciTik = await iste('/api/eposta-onay', 'POST', { token: k1Anahtar });
  kontrol('onay bağlantısı ikinci kez kullanılamıyor', ikinciTik.status === 400, J(ikinciTik.body));

  console.log('=== 2) GİRİŞ: KULLANICI ADI YA DA E-POSTA ===');
  const gKadi = await girisYap('AYSE.YILMAZ' + z, 'Deneme2026!');
  kontrol('kullanıcı adıyla (büyük harfle) giriş', !!gKadi.token && gKadi.user.role === '', J(gKadi.user));
  kontrol('rolsüz, okulsuz; kullanıcı adı küçük harfle, ad düzeltilmiş (AYŞE YILMAZ -> Ayşe Yılmaz)',
    !gKadi.user.schoolId && gKadi.user.username === ('ayse.yilmaz' + z) && gKadi.user.fullName === 'Ayşe Yılmaz', J(gKadi.user));

  /* E-posta değiştirmek de yeni adrese giden bağlantıyla olur. */
  const yeniEp = 'ayse.yeni' + z + '@test.com';
  const degis = await iste('/api/hesap/bilgi', 'POST', { eposta: yeniEp, sifre: 'Deneme2026!' }, gKadi.token);
  const hemen = await iste('/api/hesap', 'GET', null, gKadi.token);
  kontrol('yeni e-posta onaylanana kadar değişmiyor', degis.status === 200 && degis.body.onayBekliyor === true &&
    hemen.body.hesap.email === 'ayse' + z + '@test.com', J(degis.body));
  const epOnay = await epostaOnayla(yeniEp);
  const sonra2 = await iste('/api/hesap', 'GET', null, gKadi.token);
  kontrol('bağlantıya tıklanınca e-posta değişti', epOnay.tur === 'eposta' && sonra2.body.hesap.email === yeniEp, J(sonra2.body));
  await iste('/api/hesap/bilgi', 'POST', { eposta: 'ayse' + z + '@test.com', sifre: 'Deneme2026!' }, gKadi.token);
  await epostaOnayla('ayse' + z + '@test.com');
  kontrol('kendi T.C. no kendisine geliyor', gKadi.user.tc === '10000000146', gKadi.user.tc);
  const gEp = await girisYap('AYSE' + z + '@TEST.COM', 'Deneme2026!');
  kontrol('e-postayla (büyük harfle) giriş', !!gEp.token);

  const bos = await iste('/api/login', 'POST', { kimlik: '', password: 'x' });
  kontrol('boş kimlik: alan kimlik', bos.status === 400 && bos.body.alan === 'kimlik', J(bos.body));
  const yokEp = await giris('yok' + z + '@test.com', 'Deneme2026!');
  kontrol('olmayan e-posta: "e-posta adresiyle ... hesap yok"', yokEp.status === 401 && yokEp.body.hesapYok &&
    /e-posta adresiyle kayıtlı bir hesap yok/.test(yokEp.body.error), J(yokEp.body));
  const yokKadi = await giris('yok.boyle' + z, 'Deneme2026!');
  kontrol('olmayan kullanıcı adı: "kullanıcı adıyla ... hesap yok"', yokKadi.status === 401 &&
    /kullanıcı adıyla kayıtlı bir hesap yok/.test(yokKadi.body.error), J(yokKadi.body));

  console.log('=== 3) YANLIŞ ŞİFRE, KALAN HAK, HESABA BAĞLI KİLİT ===');
  const kilitK = 'kilit' + z;
  await hesapAc({ fullName: 'Kilit Deneme', username: kilitK, email: kilitK + '@test.com' });
  const y1 = await giris(kilitK, 'Yanlis2026');
  kontrol('"Şifre yanlış." ve alan sifre', y1.status === 401 && y1.body.alan === 'sifre' && /^Şifre yanlış/.test(y1.body.error)
    && y1.body.kalanHak === 4, J(y1.body));
  const y2 = await giris(kilitK + '@test.com', 'Yanlis2026');
  kontrol('e-postayla deneme aynı sayaca yazılıyor (3 hak)', y2.body.kalanHak === 3 && /3 deneme hakkın kaldı/.test(y2.body.error), J(y2.body));
  await giris(kilitK, 'Yanlis2026');
  await giris(kilitK + '@test.com', 'Yanlis2026');
  const y5 = await giris(kilitK, 'Yanlis2026');
  kontrol('beşinci yanlışta kilitlendi', /kilitlendi/.test(y5.body.error || ''), J(y5.body));
  const kilitli = await giris(kilitK + '@test.com', 'Test1234!');
  kontrol('kilitliyken doğru şifre (öbür kimlikle) de geçmiyor', kilitli.status === 429 && kilitli.body.kilitli, J(kilitli.body));

  console.log('=== 4) KAYIT HATALARI ALANIYLA ===');
  const alanDene = async (ad, govde, alan) => {
    const r = await kayit(Object.assign({ fullName: 'Alan Deneme', username: 'alan' + ad.replace(/[^a-z]/g, '') + z,
      email: 'alan' + z + ad + '@test.com' }, govde));
    kontrol(ad + ' -> alan ' + alan, r.status === 400 && r.body.alan === alan, J(r.body));
  };
  await alanDene('ad', { fullName: 'Tek' }, 'ad');
  await alanDene('bos-kadi', { username: '' }, 'kullaniciAdi');
  await alanDene('turkce-kadi', { username: 'şule' + z }, 'kullaniciAdi');
  await alanDene('rakamla-kadi', { username: '1abc' }, 'kullaniciAdi');
  await alanDene('alinmis-kadi', { username: 'MAT' }, 'kullaniciAdi');
  await alanDene('eposta', { email: 'eksik@adres' }, 'email');
  await alanDene('kayitli-eposta', { email: 'mat@test.com' }, 'email');
  await alanDene('sifre', { password: 'kisa1' }, 'sifre');
  await alanDene('telefon', { phone: '123' }, 'telefon');
  await alanDene('tc-algoritma', { tc: '12345678901' }, 'tc');
  await alanDene('tc-kayitli', { tc: '10000000146' }, 'tc');
  await alanDene('kvkk', { kvkkOnay: false }, 'kvkk');
  const botYanlis = await kayit({ fullName: 'Bot Yanlış', username: 'botyanlis' + z, email: 'botyanlis' + z + '@test.com' },
    { challengeId: 'yok', challengeAnswer: 3 });
  kontrol('yanlış doğrulama -> alan bot', botYanlis.status === 400 && botYanlis.body.alan === 'bot', J(botYanlis.body));
  const rolGonder = await kayit({ fullName: 'Rol Deneme', username: 'roldeneme' + z, email: 'roldeneme' + z + '@test.com',
    role: 'principal', schoolId: 'x' });
  if (rolGonder.body.onayGerekli) await epostaOnayla('roldeneme' + z + '@test.com');
  const rolGiris = rolGonder.status === 200 ? await girisYap('roldeneme' + z, 'Deneme2026!') : { user: {} };
  kontrol('kayıtta rol gönderilse de hesap rolsüz açılır', rolGonder.status === 200 && rolGiris.user.role === '' &&
    !rolGiris.user.schoolId, J(rolGiris.user));

  console.log('=== 5) DOĞRULAMA SORUSU YALNIZCA HESAP AÇILINCA HARCANIR ===');
  const bot = await botCevabi();
  const once = await kayit({ fullName: 'Soru Deneme', username: 'soru' + z, email: 'hatali-adres' }, bot);
  kontrol('başka alan hatalı: soru harcanmadı', once.status === 400 && once.body.alan === 'email', J(once.body));
  const sonra = await kayit({ fullName: 'Soru Deneme', username: 'soru' + z, email: 'soru' + z + '@test.com' }, bot);
  kontrol('aynı soruyla düzeltilmiş kayıt geçti', sonra.status === 200, J(sonra.body));
  const ucuncu = await kayit({ fullName: 'Soru Deneme', username: 'soru.iki' + z, email: 'soru2' + z + '@test.com' }, bot);
  kontrol('hesap açılınca soru harcandı', ucuncu.status === 400 && ucuncu.body.alan === 'bot', J(ucuncu.body));

  console.log('=== 6) ROLSÜZ HESABIN SINIRI ===');
  const R = gKadi.token;
  for (const yol of ['/api/progress', '/api/mesajlar/kutu', '/api/takvim?ay=2026-09', '/api/school/students', '/api/assignments']) {
    const r = await iste(yol, 'GET', null, R);
    kontrol('rolsüz ' + yol + ' -> 403', r.status === 403, 'status ' + r.status);
  }
  const serbest = await iste('/api/notifications', 'GET', null, R);
  kontrol('rolsüz bildirimlerine bakabiliyor', serbest.status === 200);

  console.log('=== 7) VELİ KODU: BÜYÜK/KÜÇÜK HARF DUYARLI, BOŞLUK FARK ETMEZ ===');
  const ogr = ((await iste('/api/school/students', 'GET', null, M)).body.students || [])[0];
  kontrol('veli kodu yeni biçimde (15 karakter)', /^[A-Za-z][A-Za-z0-9!?#*+-]{14}$/.test(ogr.code || ''), ogr.code);
  const veliK = 'veli' + z;
  await hesapAc({ fullName: 'Veli Deneme', username: veliK, email: veliK + '@test.com' });
  const V = (await girisYap(veliK, 'Test1234!')).token;
  const yanlisKod = await iste('/api/parent/link', 'POST', { code: 'ZZZZZ-ZZZZZ' }, V);
  kontrol('yanlış kod reddedildi', yanlisKod.status === 400, J(yanlisKod.body));
  /* Harf durumu çevrilmiş kod başka bir koddur. */
  const ters = ogr.code.replace(/[A-Za-z]/g, c => c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase());
  const tersBag = await iste('/api/parent/link', 'POST', { code: ters }, V);
  kontrol('harf durumu değiştirilmiş kod kabul edilmiyor', tersBag.status === 400, J(tersBag.body));
  const yazim = ' ' + ogr.code.slice(0, 5) + ' ' + ogr.code.slice(5, 10) + '  ' + ogr.code.slice(10) + ' ';
  const bagla = await iste('/api/parent/link', 'POST', { code: yazim }, V);
  kontrol('boşluklu (5\'erli) yazılan kod kabul edildi', bagla.status === 200 && (bagla.body.children || []).length === 1,
    J(bagla.body));
  const veliMe = await iste('/api/me', 'GET', null, V);
  kontrol('kod girince rolsüz hesap veli oldu', veliMe.body.user.role === 'parent', veliMe.body.user.role);

  console.log('=== 8) ÖĞRETMEN HESABINI OKUL AÇAR ===');
  const ogrK = 'katilan' + z;
  const eklenen = await okulHesabi(M, 'teacher', { fullName: 'Katılan Öğretmen', username: ogrK, email: ogrK + '@test.com',
    brans: 'Fen Bilimleri' });
  const eklenenG = await girisYap(ogrK, 'Test1234!');
  kontrol('öğretmen hesabı açıldı, branşı müdür verdi', eklenenG.user.role === 'teacher' && eklenenG.user.branch === 'Fen Bilimleri',
    J(eklenenG.user));
  const uydurma = await iste('/api/school/hesap-ac', 'POST', { rol: 'teacher', fullName: 'Brans Deneme', tc: tcUret(), brans: 'Uydurma' }, M);
  kontrol('listede olmayan branş reddedildi', uydurma.status === 400 && !!eklenen, J(uydurma.body));
  const rolYanlis = await iste('/api/school/hesap-ac', 'POST', { rol: 'principal', fullName: 'Rol Deneme', tc: tcUret() }, M);
  kontrol('müdür hesabı bu yoldan açılamaz', rolYanlis.status === 400, J(rolYanlis.body));
  const kayitOgrenci = await iste('/api/school/kisi-ekle', 'POST', { userId: 'x', role: 'student' }, M);
  kontrol('kayıt olmuş kişiyi okula çağıran eski uç yok', kayitOgrenci.status === 404, 'status ' + kayitOgrenci.status);

  console.log('=== 9) MÜDÜR BAŞVURUSU YOK ===');
  /* Okulunu açtırmak isteyen kişi kişi kodunu yöneticiye verir; başvuru ve
     "Onay Bekleyenler" kalktı. */
  const mK = 'aday' + z;
  await hesapAc({ fullName: 'Aday Müdür', username: mK, email: mK + '@test.com' });
  const aday = await girisYap(mK, 'Test1234!');
  const adayBas = await iste('/api/okul-basvurusu', 'POST', { schoolName: 'Aday Ortaokulu ' + z, city: 'Ankara', district: 'Mamak' },
    aday.token);
  kontrol('başvuru ucu rolsüz kişiye de yok (404)', adayBas.status === 404, adayBas.status + ' ' + J(adayBas.body));
  const adayVar = await iste('/api/school/students', 'GET', null, aday.token);
  kontrol('rolsüz kişi var olan okul ucunda yine 403 (rolsuz)', adayVar.status === 403 && adayVar.body.rolsuz === true,
    adayVar.status + ' ' + J(adayVar.body));
  const eskiUclar = [await iste('/api/okul-basvurusu', 'POST', { schoolName: 'Aday Ortaokulu ' + z, city: 'Ankara', district: 'Mamak' }, A),
    await iste('/api/admin/pending', 'GET', null, A), await iste('/api/admin/decide', 'POST', { userId: 'x', approve: true }, A)];
  kontrol('okul-basvurusu, admin/pending ve admin/decide uçları yok (404)', eskiUclar.every(r => r.status === 404),
    eskiUclar.map(r => r.status).join(','));
  const adayKis = await iste('/api/kisilikler', 'GET', null, aday.token);
  kontrol('kişinin portalı yok, kişi kodu hazır', adayKis.status === 200 && !adayKis.body.roller.length &&
    /^[A-Za-z][A-Za-z0-9!?#*+-]{14}$/.test(adayKis.body.kisiKodu || ''), J(adayKis.body));

  console.log('=== 10) T.C. NO: KİŞİNİN KENDİSİ VE OKUL YÖNETİMİ ===');
  /* Okulun açtığı hesap (servisçi) T.C. ile açılır. */
  const tcOgr = 'tcsrv' + z;
  const tcHesap = await okulHesabi(M, 'servisci', { fullName: 'Tc Servisçi', username: tcOgr, tc: '11111111110' });
  const liste = (await iste('/api/school/servisciler', 'GET', null, M)).body.servisciler || [];
  const tcKisi = liste.find(t => t.username === tcOgr);
  kontrol('servisçi listesinde T.C. yok', tcKisi && tcKisi.tc === undefined, J(tcKisi));
  const yonetimGorur = await iste('/api/school/hesap?id=' + tcHesap.id, 'GET', null, M);
  kontrol('okul yönetimi hesap penceresinde T.C. görüyor', yonetimGorur.body.hesap.tc === '11111111110', J(yonetimGorur.body));
  const tcG = await girisYap(tcOgr, 'Test1234!');
  kontrol('kişi kendi T.C. numarasını görüyor', tcG.user.tc === '11111111110', J(tcG.user));
  const pr = await iste('/api/profile', 'POST', { tc: '' }, tcG.token);
  kontrol('okulun açtığı hesapta T.C. profilden değişmiyor', pr.status === 400, J(pr.body));
  const vPr = await iste('/api/profile', 'POST', { tc: '123' }, V);
  kontrol('velinin profilinde geçersiz T.C. reddediliyor', vPr.status === 400, J(vPr.body));

  console.log('=== 11) ŞİFRE DEĞİŞİNCE ÖBÜR OTURUMLAR KAPANIR ===');
  const sk = 'sifre' + z;
  await hesapAc({ fullName: 'Sifre Deneme', username: sk, email: sk + '@test.com' });
  const ot1 = await girisYap(sk, 'Test1234!');
  const ot2 = await girisYap(sk, 'Test1234!');
  const deg = await iste('/api/password', 'POST', { old: 'Test1234!', new: 'Yeni1234!' }, ot1.token);
  kontrol('şifre değişti', deg.status === 200, J(deg.body));
  const ot1Me = await iste('/api/me', 'GET', null, ot1.token);
  const ot2Me = await iste('/api/me', 'GET', null, ot2.token);
  kontrol('değiştiren oturum açık kalıyor', ot1Me.status === 200, 'status ' + ot1Me.status);
  kontrol('öbür oturum kapandı', ot2Me.status === 401, 'status ' + ot2Me.status);

  console.log('=== 12) ŞİFREMİ UNUTTUM YALNIZCA E-POSTAYLA ===');
  const sb = await botCevabi();
  const unut = await iste('/api/sifre-unuttum', 'POST', Object.assign({ email: sk }, sb));
  kontrol('kullanıcı adı yazılınca e-posta istenir', unut.status === 400 && unut.body.alan === 'email', J(unut.body));

  console.log('=== 12b) GÜVENLİK: YARIŞ, RED, T.C., VELİ KODU ===');
  /* Onaylı öğretmen/müdür "reddet" ile rolsüz bırakılamaz (eski okulun verisi sahipsiz kalırdı). */
  const ogretmenler = (await iste('/api/school/teachers', 'GET', null, M)).body.teachers || [];
  const mat = ogretmenler.find(x => x.username === 'mat');
  const matRed = await iste('/api/school/teacher-decide', 'POST', { userId: mat.id, approve: false }, M);
  kontrol('onaylı öğretmen reddedilemiyor', matRed.status === 400, 'status ' + matRed.status);
  /* Aynı kişi koduyla aynı anda 5 okul açılmak istenirse yalnızca biri geçer
     (kod tek kullanımlık); geçmeyenlerin okulu yarım kalıp başkasını engellemez. */
  const pK = 'paralel' + z;
  await hesapAc({ fullName: 'Paralel Kisi', username: pK, email: pK + '@test.com' });
  const pG = await girisYap(pK, 'Test1234!');
  const pKod = (await iste('/api/kisilikler', 'GET', null, pG.token)).body.kisiKodu;
  const pAd = i => 'Paralel Okul ' + z + ' ' + i;
  const pSonuc = await Promise.all([1, 2, 3, 4, 5].map(i => iste('/api/admin/okul-ac', 'POST',
    { schoolName: pAd(i), city: 'Ankara', district: 'Mamak', kisaAd: 'paralel-' + z + '-' + i, mudurKodu: pKod }, A)));
  const gecen = pSonuc.filter(r => r.status === 200).length;
  kontrol('aynı kodla aynı anda 5 okul açmadan yalnızca biri geçti', gecen === 1, pSonuc.map(r => r.status).join(','));
  const kaybeden = pSonuc.findIndex(r => r.status !== 200) + 1;
  const p2K = 'paralel.iki' + z;
  await hesapAc({ fullName: 'Paralel Iki', username: p2K, email: p2K + '@test.com' });
  const p2G = await girisYap(p2K, 'Test1234!');
  const p2 = await iste('/api/admin/okul-ac', 'POST', { schoolName: pAd(kaybeden), city: 'Ankara', district: 'Mamak',
    kisaAd: 'paralel-' + z + '-' + kaybeden, mudurKodu: (await iste('/api/kisilikler', 'GET', null, p2G.token)).body.kisiKodu }, A);
  kontrol('geçmeyen açılışın okulu ve adresi yarım kalıp başkasını engellemiyor', p2.status === 200, J(p2.body));

  /* T.C. çakışması: soru harcanır, cevap numaranın kime ait olduğunu söylemez. */
  const tcBot = await botCevabi();
  const tcCakis = await kayit({ fullName: 'Tc Cakisma', username: 'tccakis' + z, email: 'tccakis' + z + '@test.com',
    tc: '10000000146' }, tcBot);
  kontrol('T.C. çakışmasında soru harcanıyor', tcCakis.status === 400 && tcCakis.body.alan === 'tc' && tcCakis.body.yeniSoru === true,
    J(tcCakis.body));
  const tcAyniSoru = await kayit({ fullName: 'Tc Cakisma', username: 'tccakis' + z, email: 'tccakis' + z + '@test.com' }, tcBot);
  kontrol('harcanan soruyla ikinci deneme olmuyor', tcAyniSoru.status === 400 && tcAyniSoru.body.alan === 'bot', J(tcAyniSoru.body));

  /* Veli kodu: aynı bağlantıdan saatte en fazla 30 yanlış kod; çok hesap açıp
     her birinden 5'er denemek (hesap başına dakikada 5 sınırını aşmadan) de sayılır. */
  const kodTokenlar = [];
  for (let h = 0; h < 7; h++) {
    const vk = 'kod' + h + '.' + z;
    await hesapAc({ fullName: 'Kod Deneme', username: vk, email: vk + '@test.com' });
    kodTokenlar.push((await girisYap(vk, 'Test1234!')).token);
  }
  let ilk429 = 0;
  for (let i = 1; i <= 35 && !ilk429; i++) {
    const r = await iste('/api/parent/link', 'POST', { code: 'ZZZZZ' + String(i).padStart(5, '2') },
      kodTokenlar[Math.floor((i - 1) / 5)]);
    if (r.status === 429 && /bağlantıdan/.test(r.body.error || '')) ilk429 = i;
  }
  kontrol('yanlış veli kodu IP sınırı 30 civarında devreye giriyor', ilk429 > 0 && ilk429 <= 31, 'ilk429 ' + ilk429);

  console.log('=== 13) OKUL ARAMASI ===');
  const ara = async (q, il) => (await iste('/api/okullar/ara?limit=25&q=' + encodeURIComponent(q) +
    '&il=' + encodeURIComponent(il || ''))).body;
  const a1 = await ara('atatürk ortaokulu', 'Ankara');
  const a2 = await ara('ortaokulu   ATATÜRK', 'Ankara');
  kontrol('kelime sırası ve büyük harf fark etmiyor', a1.toplam > 0 && a1.toplam === a2.toplam &&
    a1.okullar[0].id === a2.okullar[0].id, a1.toplam + ' / ' + a2.toplam);
  const a3 = await ara('m.akif', 'Ankara');
  kontrol('noktalı kısaltma ("m.akif") buluyor', a3.okullar.some(o => /Mehmet Akif/.test(o.ad)), J(a3.okullar.map(o => o.ad)));
  const a4 = await ara('atatürk ortaokulu uydurmakelime', 'Ankara');
  kontrol('yanlış kelimede boş değil, "yakın" sonuç', a4.yakin === true && a4.okullar.length > 0, J(a4).slice(0, 100));
  const a5 = await ara('cankaya ataturk', '');
  kontrol('ilçe adı da aranıyor', a5.okullar.length > 0 && a5.okullar.every(o => o.ilce === 'Çankaya' || /Çankaya/.test(o.ad)),
    J(a5.okullar.map(o => o.ilce)));
  const a6 = await ara('çıkrık imam hatip', '');
  kontrol('tamamı büyük harfli adlar düzeltilmiş', a6.okullar.length > 0 &&
    a6.okullar.every(o => o.ad !== o.ad.toLocaleUpperCase('tr')), J(a6.okullar.map(o => o.ad)));
  /* Büyük/küçük harf, yazım hatası, kısaltma, bitişik yazım. */
  const b1 = await ara('cUmHuRiYeT oRtAoKuLu', 'Ankara');
  const b0 = await ara('cumhuriyet ortaokulu', 'Ankara');
  kontrol('karışık büyük/küçük harf aynı sonucu veriyor', b1.toplam > 0 && b1.toplam === b0.toplam && !b1.duzeltme, b1.toplam + ' / ' + b0.toplam);
  const b2 = await ara('ortaoklu cumhuriyet', 'Ankara');
  kontrol('yanlış yazılan kelime düzeltiliyor ("ortaoklu")', b2.duzeltme === 'ortaokulu cumhuriyet' &&
    b2.okullar.length > 0 && b2.okullar.every(o => /Cumhuriyet/.test(o.ad) && /Ortaokulu/.test(o.ad)), J(b2).slice(0, 160));
  kontrol('düzeltilen kelime de vurgulanıyor', b2.okullar[0] && b2.okullar[0].vurgu.length === 2, J(b2.okullar[0]));
  const b3 = await ara('tefik fikret', '');
  kontrol('harf eksik ("tefik") -> Tevfik Fikret', b3.duzeltme === 'tevfik fikret' && /Tevfik Fikret/.test(b3.okullar[0].ad), J(b3).slice(0, 160));
  const b4 = await ara('aihl', 'Ankara');
  kontrol('kısaltma: AİHL -> Anadolu İmam Hatip Lisesi', b4.okullar.length > 0 && !b4.duzeltme &&
    b4.okullar.every(o => /Anadolu İmam Hatip Lisesi/.test(o.ad)), J(b4.okullar.map(o => o.ad)).slice(0, 160));
  const b5 = await ara('ataturkortaokulu', 'Ankara');
  kontrol('bitişik yazım ayrılıyor ("ataturkortaokulu")', b5.duzeltme === 'ataturk ortaokulu' &&
    b5.okullar.length > 0 && b5.okullar.every(o => /Atatürk/.test(o.ad) && /Ortaokulu/.test(o.ad)), J(b5).slice(0, 160));
  const b6 = await ara('mtal cankaya', '');
  kontrol('kısaltma ve ilçe birlikte (MTAL Çankaya)', b6.okullar.length > 0 &&
    b6.okullar.every(o => /Mesleki ve Teknik Anadolu Lisesi/i.test(o.ad) && (o.ilce === 'Çankaya' || /Çankaya/.test(o.ad))), J(b6.okullar.map(o => o.ad)).slice(0, 160));
  const aramaBasi = Date.now();
  for (const q of ['ortaoklu', 'anadlu lisesi', 'cumhuryet', 'mehmetakifersoy', 'r']) await ara(q, '');
  kontrol('yazım hatalı aramalar da hızlı (5 arama < 1,5 sn)', Date.now() - aramaBasi < 1500, (Date.now() - aramaBasi) + ' ms');
  let sinir = 0;
  for (let i = 0; i < 150; i++) {
    const r = await iste('/api/okullar/ara?q=ata' + (i % 7) + '&il=Ankara');
    if (r.status === 429) sinir++;
  }
  kontrol('hızlı yazarken (150 arama) sınıra takılmıyor', sinir === 0, sinir + ' kez 429');

  console.log('=== 14) GENEL SINIR: AYNI AĞDAKİ SINIF ENGELLENMEZ ===');
  let dosya429 = 0, api429 = 0;
  for (let i = 0; i < 400; i++) if ((await fetch(BASE + '/css/style.css')).status === 429) dosya429++;
  for (let i = 0; i < 350; i++) if ((await iste('/api/meta')).status === 429) api429++;
  kontrol('sınıf kadar dosya isteği (400) geçiyor', dosya429 === 0, dosya429 + ' kez 429');
  kontrol('sınıf kadar API isteği (350) geçiyor', api429 === 0, api429 + ' kez 429');
  /* Tek oturum dakikada 300'ü aşamaz. En sona konuldu: bu anahtar bir dakika kilitli kalır. */
  let oturum429 = 0;
  for (let i = 0; i < 320; i++) if ((await iste('/api/me', 'GET', null, M)).status === 429) oturum429++;
  kontrol('tek oturum dakikada 300 isteği aşamıyor', oturum429 >= 15, oturum429 + ' kez 429');

  console.log('');
  console.log('GECTI: ' + gecti + '   KALDI: ' + kaldi);
  process.exit(kaldi ? 1 : 0);
})().catch(e => { console.error('TEST HATASI:', e); process.exit(1); });
