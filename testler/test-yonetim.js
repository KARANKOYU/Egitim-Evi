/* Okulun açtığı hesaplar ve hesap modeli:
   - öğrenci, öğretmen ve servisçi hesabını okul açar; ad, soyad, T.C. zorunlu;
   - kullanıcı adı ve şifre boşsa T.C. no; o kişi kendi şifresini koymadan
     hiçbir bölüme giremez (şifresi T.C. no'yu içeremez);
   - kullanıcı adı okul içinde benzersiz: başka okulda aynısı olabilir, okul
     seçilmeden girilirse okul sorulur, okul adresinden girilince doğru hesap açılır;
   - öğretmen/servisçi hesabı düzenlenir, şifresi yenilenir, silinir;
   - yetkisiz öğretmen hesap açamaz, başka okulun hesabına dokunamaz;
   - rolsüz kayıt yalnızca veli / müdür adayı içindir; eski davet uçları yok. */
const { iste, girisYap, botCevabi, hesapAc, mudurYap, ogretmenYap, tcUret } = require('./giris');

let gecti = 0, kaldi = 0;
function kontrol(ad, sart, detay) {
  if (sart) { gecti++; console.log('  GECTI  ' + ad); }
  else { kaldi++; console.log('  KALDI  ' + ad + (detay ? '  -> ' + detay : '')); }
}
const J = x => JSON.stringify(x).slice(0, 160);

async function hamGiris(kimlik, sifre, okul) {
  const b = await botCevabi();
  return iste('/api/login', 'POST', { kimlik, password: sifre, okul, challengeId: b.challengeId, challengeAnswer: b.challengeAnswer });
}

(async () => {
  const z = Date.now();
  const mudur = await girisYap('mudur@test.com', 'Test1234!');
  const T = mudur.token;
  const A = (await girisYap('admin@egitimevi.com', 'admin123')).token;

  console.log('=== 1) MUDUR OGRENCI HESABI ACIYOR (e-postasız) ===');
  const kadi = 'yeni.ogrenci' + z;
  const tc1 = tcUret();
  const olustur = await iste('/api/school/student-create', 'POST', {
    fullName: 'deniz kara', username: kadi, password: 'Ogrenci2026', tc: tc1
  }, T);
  kontrol('hesap acildi', olustur.status === 200, J(olustur.body));
  kontrol('veli kodu 10 karakter, buyuk harf ve rakam', olustur.body.student &&
    /^[A-Z0-9]{10}$/.test(olustur.body.student.code || ''), olustur.body.student && olustur.body.student.code);
  kontrol('ad kucuk yazilsa da duzeltiliyor', olustur.body.student && olustur.body.student.fullName === 'Deniz Kara');
  const yeniId = olustur.body.student.id;

  console.log('=== 2) DOGRULAMA ===');
  const tcsiz = await iste('/api/school/student-create', 'POST', { fullName: 'Tcsiz Kisi', username: 'tcsiz' + z, password: 'Ogrenci2026' }, T);
  kontrol('T.C. no olmadan hesap acilmiyor', tcsiz.status === 400 && /T\.C\./.test(tcsiz.body.error || ''), J(tcsiz.body));
  const ayniTc = await iste('/api/school/student-create', 'POST', { fullName: 'Ayni Tc', username: 'aynitc' + z, tc: tc1 }, T);
  kontrol('ayni T.C. no okulda ikinci kez kullanilamiyor', ayniTc.status === 400, J(ayniTc.body));
  const ayniKadi = await iste('/api/school/student-create', 'POST', {
    fullName: 'Baska Kisi', username: kadi.toUpperCase(), password: 'Ogrenci2026', tc: tcUret() }, T);
  kontrol('ayni kullanici adi (buyuk harfle de) reddedildi', ayniKadi.status === 400, J(ayniKadi.body));
  const zayif = await iste('/api/school/student-create', 'POST', {
    fullName: 'Zayif Sifre', username: 'zayif' + z, password: 'abc', tc: tcUret() }, T);
  kontrol('zayif sifre reddedildi', zayif.status === 400, J(zayif.body));
  const tekAd = await iste('/api/school/student-create', 'POST', {
    fullName: 'Tekad', username: 'tek' + z, password: 'Ogrenci2026', tc: tcUret() }, T);
  kontrol('tek kelime ad reddedildi', tekAd.status === 400, J(tekAd.body));
  const turkce = await iste('/api/school/student-create', 'POST', {
    fullName: 'Şule Işık', username: 'şule.ışık', password: 'Ogrenci2026', tc: tcUret() }, T);
  kontrol('Turkce harfli kullanici adi reddedildi', turkce.status === 400 && /Türkçe/.test(turkce.body.error || ''), J(turkce.body));
  const baskaTcAd = await iste('/api/school/student-create', 'POST', {
    fullName: 'Rakam Ad', username: tcUret(), tc: tcUret() }, T);
  kontrol('baskasinin T.C. no\'su kullanici adi olamaz', baskaTcAd.status === 400, J(baskaTcAd.body));

  console.log('=== 3) YENI HESAPLA GIRIS (e-posta yok: kod adimi yok) ===');
  const yeniGiris = await girisYap(kadi.toUpperCase(), 'Ogrenci2026');
  kontrol('kullanici adiyla (buyuk harfle) giris yapilabiliyor', !!yeniGiris.token && !yeniGiris.twoFactor);
  kontrol('rolu ogrenci, sifre degistirmesi gerekmiyor (sifreyi mudur yazdi)', yeniGiris.user && yeniGiris.user.role === 'student' &&
    !yeniGiris.user.sifreDegismeli, J(yeniGiris.user));

  console.log('=== 3b) T.C. ILE VARSAYILAN GIRIS VE ZORUNLU SIFRE DEGISIMI ===');
  const tc2 = tcUret();
  const varsayilan = await iste('/api/school/hesap-ac', 'POST', { rol: 'student', ad: 'Ahmet Sami', soyad: 'Yilmaz', tc: tc2 }, T);
  kontrol('yalniz ad, soyad ve T.C. ile hesap acildi', varsayilan.status === 200 && varsayilan.body.hesap.username === tc2 &&
    varsayilan.body.hesap.varsayilanSifre === true && varsayilan.body.hesap.fullName === 'Ahmet Sami Yilmaz', J(varsayilan.body));
  const tcGiris = await girisYap(tc2, tc2);
  kontrol('kullanici adi ve sifre T.C. no ile giris oluyor', !!tcGiris.token && tcGiris.user.sifreDegismeli === true, J(tcGiris.user));
  await iste('/api/kvkk-onay', 'POST', { onay: true }, tcGiris.token);
  const kapali = await iste('/api/progress', 'GET', null, tcGiris.token);
  kontrol('sifresini degistirmeden bolumlere giremiyor', kapali.status === 403 && kapali.body.sifreDegismeli === true, J(kapali.body));
  const tcSifre = await iste('/api/password', 'POST', { old: tc2, new: 'a' + tc2 }, tcGiris.token);
  kontrol('yeni sifre T.C. no\'yu iceremez', tcSifre.status === 400, J(tcSifre.body));
  const ayniSifre = await iste('/api/password', 'POST', { old: tc2, new: tc2 }, tcGiris.token);
  kontrol('yeni sifre eskisiyle ayni olamaz', ayniSifre.status === 400, J(ayniSifre.body));
  const degisti = await iste('/api/password', 'POST', { old: tc2, new: 'Kendi2026sifrem' }, tcGiris.token);
  kontrol('kendi sifresini koydu', degisti.status === 200 && degisti.body.user.sifreDegismeli === false, J(degisti.body));
  const acik = await iste('/api/progress', 'GET', null, tcGiris.token);
  kontrol('sifre degisince bolumler acildi', acik.status === 200, 'status ' + acik.status);

  console.log('=== 4) KULLANICI ADI DEGISTIRME ===');
  const yeniKadi = 'degisti' + z;
  const guncelle = await iste('/api/school/student-update', 'POST', {
    studentId: yeniId, username: yeniKadi, fullName: 'Deniz Kara Yilmaz'
  }, T);
  kontrol('kullanici adi degistirildi', guncelle.status === 200 && guncelle.body.student.username === yeniKadi, J(guncelle.body));
  const eskiIle = await hamGiris(kadi, 'Ogrenci2026');
  kontrol('eski kullanici adiyla giris olmuyor', eskiIle.status === 401, 'status ' + eskiIle.status);
  const detay = await iste('/api/school/hesap?id=' + yeniId, 'GET', null, T);
  kontrol('mudur hesap penceresinde T.C. no\'yu goruyor', detay.status === 200 && detay.body.hesap.tc === tc1, J(detay.body));

  console.log('=== 5) SIFRE SIFIRLAMA ===');
  const sifre = await iste('/api/school/student-password', 'POST', { studentId: yeniId, password: 'YeniSifre99' }, T);
  kontrol('sifre degistirildi', sifre.status === 200, J(sifre.body));
  const eskiSifre = await hamGiris(yeniKadi, 'Ogrenci2026');
  kontrol('eski sifre calismiyor', eskiSifre.status === 401, 'status ' + eskiSifre.status);
  const yeniSifreGiris = await girisYap(yeniKadi, 'YeniSifre99');
  kontrol('yeni sifreyle giris yapiliyor', !!yeniSifreGiris.token);
  const zayifSifirla = await iste('/api/school/student-password', 'POST', { studentId: yeniId, password: '123' }, T);
  kontrol('zayif yeni sifre reddedildi', zayifSifirla.status === 400);
  const tcyeDon = await iste('/api/school/hesap-sifre', 'POST', { id: yeniId }, T);
  const tcyeGiris = await girisYap(yeniKadi, tc1);
  kontrol('bos sifreyle sifirlayinca sifre T.C. no oldu, degistirmesi isteniyor', tcyeDon.status === 200 &&
    tcyeGiris.user.sifreDegismeli === true, J(tcyeDon.body));

  console.log('=== 6) VELI KODU YENILEME ===');
  const eskiKod = olustur.body.student.code;
  const kodYeni = await iste('/api/school/student-code-reset', 'POST', { studentId: yeniId }, T);
  kontrol('yeni kod uretildi', kodYeni.status === 200 && kodYeni.body.code !== eskiKod, kodYeni.body.code);
  kontrol('yeni kod 10 karakter', /^[A-Z0-9]{10}$/.test(kodYeni.body.code || ''), kodYeni.body.code);

  console.log('=== 7) MUDUR OGRENCI PORTALINI ACIYOR ===');
  const ilerleme = await iste('/api/progress?studentId=' + yeniId, 'GET', null, T);
  kontrol('mudur ogrencinin ilerleyisini gorebiliyor', ilerleme.status === 200, 'status ' + ilerleme.status);
  const prog = await iste('/api/myschedule?studentId=' + yeniId, 'GET', null, T);
  kontrol('mudur ogrencinin programini gorebiliyor', prog.status === 200, 'status ' + prog.status);

  console.log('=== 8) OGRETMEN VE SERVISCI HESAPLARI ===');
  const ogrt = await girisYap('mat@test.com', 'Test1234!');
  const ogrtDener = await iste('/api/school/student-create', 'POST', {
    fullName: 'Sahte Ogrenci', username: 'sahte' + z, password: 'Sahte1234', tc: tcUret() }, ogrt.token);
  kontrol('ogretmen ogrenci hesabi acamaz', ogrtDener.status === 403, 'status ' + ogrtDener.status);
  const ogrtSifre = await iste('/api/school/student-password', 'POST', { studentId: yeniId, password: 'Hacked1234' }, ogrt.token);
  kontrol('ogretmen sifre degistiremez', ogrtSifre.status === 403, 'status ' + ogrtSifre.status);
  /* Öğretmen hesabını okul açmaz: öğretmen yetişkin hesabı açar, kodunu verir. */
  const okulAcamaz = await iste('/api/school/hesap-ac', 'POST', { rol: 'teacher', ad: 'Selim', soyad: 'Arslan', tc: tcUret() }, T);
  kontrol('okul ogretmen hesabi acamiyor, koda yonlendiriyor', okulAcamaz.status === 400 && /Kodla ekle/.test(okulAcamaz.body.error),
    J(okulAcamaz.body));
  const yeniOgrt = { body: { hesap: await ogretmenYap(T, { fullName: 'Selim Arslan', username: 'selim' + z,
    brans: 'matematik', telefon: '0532 555 11 22' }) } };
  const ogrtDetay = await iste('/api/school/hesap?id=' + yeniOgrt.body.hesap.id, 'GET', null, T);
  kontrol('kodla eklenen ogretmenin bransi (buyuk/kucuk harf fark etmez) ve telefonu', ogrtDetay.body.hesap.brans === 'Matematik' &&
    ogrtDetay.body.hesap.telefon === '+905325551122' && ogrtDetay.body.hesap.bagli === true && !ogrtDetay.body.hesap.email &&
    !ogrtDetay.body.hesap.tc, J(ogrtDetay.body));
  const ogrtGun = await iste('/api/school/hesap-guncelle', 'POST', { id: yeniOgrt.body.hesap.id, brans: 'Türkçe' }, T);
  kontrol('ogretmenin bransi guncellendi', ogrtGun.status === 200 && ogrtGun.body.hesap.brans === 'Türkçe', J(ogrtGun.body));
  const ogrtAdDegis = await iste('/api/school/hesap-guncelle', 'POST', { id: yeniOgrt.body.hesap.id,
    kullaniciAdi: 'selim.arslan' + z }, T);
  kontrol('okul ogretmenin kullanici adini degistiremiyor', ogrtAdDegis.status === 400, J(ogrtAdDegis.body));
  const uydurBrans = await iste('/api/school/hesap-guncelle', 'POST', { id: yeniOgrt.body.hesap.id, brans: 'Uydurma' }, T);
  kontrol('listede olmayan brans reddedildi', uydurBrans.status === 400, J(uydurBrans.body));
  const servisci = await iste('/api/school/hesap-ac', 'POST', { rol: 'servisci', ad: 'Hasan', soyad: 'Usta', tc: tcUret(),
    telefon: '05321112233' }, T);
  kontrol('mudur servisci hesabi acti', servisci.status === 200, J(servisci.body));
  const serviscList = await iste('/api/school/servisciler', 'GET', null, T);
  kontrol('servisci listesi', (serviscList.body.servisciler || []).some(s => s.id === servisci.body.hesap.id));
  const ogrtSil = await iste('/api/school/hesap-sil', 'POST', { id: yeniOgrt.body.hesap.id }, ogrt.token);
  kontrol('yetkisiz ogretmen baska hesabi silemiyor', ogrtSil.status === 403, 'status ' + ogrtSil.status);
  const ogrenciSil = await iste('/api/school/hesap-sil', 'POST', { id: yeniId, onay: true }, T);
  kontrol('ogrenci hesabi bu uctan silinmiyor', ogrenciSil.status === 403, 'status ' + ogrenciSil.status);
  const onaysizSil = await iste('/api/school/hesap-sil', 'POST', { id: yeniOgrt.body.hesap.id }, T);
  const sil = await iste('/api/school/hesap-sil', 'POST', { id: yeniOgrt.body.hesap.id, onay: true }, T);
  kontrol('ogretmen onayla okuldan cikarildi', onaysizSil.status === 400 && sil.status === 200, J(sil.body));
  const selimGiris = await girisYap('selim' + z, 'Test1234!');
  kontrol('okuldan cikarilan ogretmenin yetiskin hesabi duruyor', !!selimGiris.token && !selimGiris.user.role, J(selimGiris.user));

  console.log('=== 8b) KULLANICI ADI OKUL ICINDE, OKUL ADRESI ===');
  await hesapAc({ fullName: 'Ikinci Mudur', username: 'ikinci.mudur' + z, email: 'ikincimudur' + z + '@test.com' });
  const M2 = (await mudurYap('ikinci.mudur' + z, 'Test1234!', { schoolName: 'Ikinci Okul ' + z, city: 'Ankara', district: 'Mamak' }, A)).token;
  const adres1 = (await iste('/api/school/adres', 'GET', null, T)).body.kisaAd;
  const adres2 = (await iste('/api/school/adres', 'GET', null, M2)).body.kisaAd;
  kontrol('okullarin adresi var ve farkli', !!adres1 && !!adres2 && adres1 !== adres2, adres1 + ' ' + adres2);
  const ortak = 'ortak.ad' + z;
  const h1 = await iste('/api/school/hesap-ac', 'POST', { rol: 'student', fullName: 'Birinci Okullu', kullaniciAdi: ortak,
    sifre: 'Birinci2026', tc: tcUret() }, T);
  /* Öğrencinin T.C. no'su bütün sistemde tek (hesap kişiye ait): başka okul
     aynı T.C. ile yeni hesap açamaz, doğum tarihiyle nakil ister. Kullanıcı
     adı ise okul içinde tek; iki okulda aynı ad olabilir. */
  const baskaOkulAyniTc = await iste('/api/school/hesap-ac', 'POST', { rol: 'student', fullName: 'Ikinci Okullu', kullaniciAdi: ortak,
    sifre: 'Ikinci2026', tc: tc1 }, M2);
  kontrol('ayni T.C. baska okulda yeni hesap acmiyor, nakil istiyor', baskaOkulAyniTc.status === 409 && baskaOkulAyniTc.body.nakil === 'dogum', J(baskaOkulAyniTc.body));
  const tcIkinci = tcUret();
  const h2 = await iste('/api/school/hesap-ac', 'POST', { rol: 'student', fullName: 'Ikinci Okullu', kullaniciAdi: ortak,
    sifre: 'Ikinci2026', tc: tcIkinci }, M2);
  kontrol('ayni kullanici adi iki okulda ayri hesap olabiliyor', h1.status === 200 && h2.status === 200, J(h2.body));
  const belirsiz = await hamGiris(ortak, 'Birinci2026');
  kontrol('okul secmeden girilince okul soruluyor', belirsiz.status === 400 && belirsiz.body.okulSec === true, J(belirsiz.body));
  const g1 = await girisYap(ortak, 'Birinci2026', adres1);
  const g2 = await girisYap(ortak, 'Ikinci2026', adres2);
  kontrol('okul adresinden girince dogru hesap aciliyor', g1.user.fullName === 'Birinci Okullu' && g2.user.fullName === 'Ikinci Okullu' &&
    g1.user.schoolSlug === adres1, J(g1.user));
  const yanlisOkul = await hamGiris(ortak, 'Ikinci2026', adres1);
  kontrol('baska okulun sifresiyle o okuldan girilmiyor', yanlisOkul.status === 401, 'status ' + yanlisOkul.status);
  const yokOkul = await hamGiris(ortak, 'Birinci2026', 'boyle-okul-yok');
  kontrol('olmayan okul adresi reddediliyor', yokOkul.status === 400, 'status ' + yokOkul.status);
  const tcIleGiris = await girisYap(tcIkinci, 'Ikinci2026', adres2);
  kontrol('okul adresinde T.C. no ile de girilebiliyor', tcIleGiris.user && tcIleGiris.user.fullName === 'Ikinci Okullu', J(tcIleGiris.user));
  const adresBilgi = await iste('/api/okul-adres?kisa=' + adres1);
  kontrol('okul adresi herkese acik: yalnizca ad ve il', adresBilgi.status === 200 && adresBilgi.body.okul.kisaAd === adres1 &&
    !adresBilgi.body.okul.id, J(adresBilgi.body));
  const araHatali = await iste('/api/okul-adres/ara?q=' + encodeURIComponent('IKINICI oKuL'));
  kontrol('kayıtlı okul aramasında büyük harf ve yazım hatası fark etmiyor', araHatali.status === 200 &&
    (araHatali.body.okullar || []).some(o => o.ad === 'Ikinci Okul ' + z) && araHatali.body.duzeltme === 'ikinci okul', J(araHatali.body));
  const ara = await iste('/api/okul-adres/ara?q=' + encodeURIComponent('ikinci okul'));
  kontrol('ana sayfada okul araniyor', (ara.body.okullar || []).some(o => o.kisaAd === adres2), J(ara.body));
  const yeniAdres = await iste('/api/school/adres', 'POST', { kisaAd: 'ikinci-' + (z % 100000) }, M2);
  const cakisan = await iste('/api/school/adres', 'POST', { kisaAd: adres1 }, M2);
  const ayrilmis = await iste('/api/school/adres', 'POST', { kisaAd: 'api' }, M2);
  kontrol('mudur adresi degistiriyor; alinmis ve ayrilmis adlar reddediliyor', yeniAdres.status === 200 &&
    cakisan.status === 400 && ayrilmis.status === 400, [yeniAdres.status, cakisan.status, ayrilmis.status].join(','));
  const ogrtAdres = await iste('/api/school/adres', 'POST', { kisaAd: 'ogretmen-deniyor' }, ogrt.token);
  kontrol('ogretmen okul adresini degistiremiyor', ogrtAdres.status === 403, 'status ' + ogrtAdres.status);
  const yabanci = await iste('/api/school/hesap?id=' + h1.body.hesap.id, 'GET', null, M2);
  const yabanciSifre = await iste('/api/school/hesap-sifre', 'POST', { id: h1.body.hesap.id, sifre: 'Ele2026gec' }, M2);
  kontrol('baska okulun muduru hesaba dokunamiyor', yabanci.status === 404 && yabanciSifre.status === 404,
    yabanci.status + ' ' + yabanciSifre.status);

  console.log('=== 8c) ROLSUZ KAYIT: YALNIZCA VELI VE MUDUR ADAYI ===');
  const rk = 'rolsuz' + z;
  await hesapAc({ fullName: 'Rolsuz Kisi', username: rk, email: rk + '@test.com' });
  const rG = await girisYap(rk, 'Test1234!');
  kontrol('rolsuz hesap giris yapabiliyor', !!rG.token && rG.user.role === '', J(rG.user && rG.user.role));
  const rOdev = await iste('/api/progress', 'GET', null, rG.token);
  kontrol('rolsuz hesap okul bolumlerine giremiyor', rOdev.status === 403 && rOdev.body.rolsuz === true, 'status ' + rOdev.status);
  const eskiDavet = await iste('/api/davetlerim', 'GET', null, rG.token);
  const eskiBul = await iste('/api/school/kisi-bul?rol=student&ad=' + rk, 'GET', null, T);
  kontrol('eski davet uclari kaldirildi', eskiDavet.status === 403 && eskiBul.status === 404, eskiDavet.status + ' ' + eskiBul.status);
  const sinifYap = await iste('/api/school/class', 'POST', { name: '8b' }, T);
  kontrol('sinif adi "8b" -> "8-B"', sinifYap.status === 200 && sinifYap.body['class'].name === '8-B', J(sinifYap.body));

  console.log('=== 9) ADMIN MUDUR YONETIMI ===');
  const liste = await iste('/api/admin/principals', 'GET', null, A);
  kontrol('mudur listesi geliyor', liste.status === 200 && liste.body.principals.length > 0, 'adet ' + (liste.body.principals || []).length);
  const ilk = liste.body.principals[0];
  kontrol('okul ve sayilar dolu', !!ilk.schoolName && typeof ilk.students === 'number', J(ilk));
  const mudurDener = await iste('/api/admin/principals', 'GET', null, T);
  kontrol('mudur bu listeye erisemiyor', mudurDener.status === 403, 'status ' + mudurDener.status);

  console.log('=== 9b) YONETICI OKUL ACIYOR ===');
  const oa = 'acilan' + z;
  const okulGovde = { schoolName: 'Deneme Açılış Ortaokulu ' + z, city: 'Ankara', district: 'Çankaya', kisaAd: 'acilis-' + z,
    mudur: { eposta: oa + '@test.com', ad: 'Selin', soyad: 'Kaya', kullaniciAdi: oa, telefon: '+905321234567', sifre: 'Acilis2026!' } };
  const oaMudur = await iste('/api/admin/okul-ac', 'POST', okulGovde, T);
  kontrol('mudur okul acamiyor (yalniz yonetici)', oaMudur.status === 403, 'status ' + oaMudur.status);
  const oaZayif = await iste('/api/admin/okul-ac', 'POST',
    Object.assign({}, okulGovde, { mudur: Object.assign({}, okulGovde.mudur, { sifre: 'acilis2026' }) }), A);
  kontrol('zayif sifre (buyuk harf ve ozel yok) reddedildi', oaZayif.status === 400 && oaZayif.body.alan === 'sifre', J(oaZayif.body));
  const oaAdres = await iste('/api/admin/okul-ac', 'POST', Object.assign({}, okulGovde, { kisaAd: 'a b' }), A);
  kontrol('gecersiz adres reddedildi', oaAdres.status === 400 && oaAdres.body.alan === 'kisaAd', J(oaAdres.body));
  const oaAc = await iste('/api/admin/okul-ac', 'POST', okulGovde, A);
  kontrol('yonetici okulu acti, yeni mudur hesabi', oaAc.status === 200 && oaAc.body.okul.kisaAd === 'acilis-' + z &&
    oaAc.body.mudur.yeni === true, J(oaAc.body));
  const oaTekrar = await iste('/api/admin/okul-ac', 'POST', Object.assign({}, okulGovde, { kisaAd: 'acilis-iki-' + z }), A);
  kontrol('ayni okul ikinci kez acilamiyor', oaTekrar.status === 400 && oaTekrar.body.alan === 'okul', J(oaTekrar.body));
  const oaAyniAdres = await iste('/api/admin/okul-ac', 'POST',
    Object.assign({}, okulGovde, { schoolName: 'Baska Okul ' + z, mudur: { eposta: 'mudur@test.com' } }), A);
  kontrol('ayni adres ikinci okulda kullanilamiyor', oaAyniAdres.status === 400 && oaAyniAdres.body.alan === 'kisaAd', J(oaAyniAdres.body));
  const oaG = await girisYap(oa, 'Acilis2026!');
  kontrol('mudur verilen sifreyle giriyor, kendi sifresini belirlemeli', !!oaG.token && oaG.user.sifreDegismeli === true &&
    oaG.user.role === '' && oaG.kisilikSec === true, J(oaG.user));
  await iste('/api/kvkk-onay', 'POST', { onay: true }, oaG.token);
  const oaGec = await iste('/api/kisilik/gec', 'POST', { tur: 'rol', id: 'x' }, oaG.token);
  kontrol('sifresini koymadan okul rolune gecemiyor', oaGec.status === 403 && oaGec.body.sifreDegismeli === true, J(oaGec.body));
  const oaSifre = await iste('/api/password', 'POST', { old: 'Acilis2026!', new: 'Kendi2026sifre' }, oaG.token);
  kontrol('yetiskin hesabinda da guclu sifre kurali', oaSifre.status === 400, J(oaSifre.body));
  const oaSifre2 = await iste('/api/password', 'POST', { old: 'Acilis2026!', new: 'Kendi2026sifre!' }, oaG.token);
  kontrol('kendi guclu sifresini koydu', oaSifre2.status === 200, J(oaSifre2.body));
  const oaRoller = await iste('/api/kisilikler', 'GET', null, oaG.token);
  kontrol('hesapta onayli mudur rolu var', oaRoller.status === 200 && (oaRoller.body.roller || []).some(r =>
    r.rol === 'principal' && r.okulKisaAd === 'acilis-' + z && r.girilebilir), J(oaRoller.body));
  const varOlan = await iste('/api/admin/okul-ac', 'POST', { schoolName: 'Ikinci Acilis Lisesi ' + z, city: 'Ankara', district: 'Çankaya',
    kisaAd: 'ikinci-' + z, mudur: { eposta: oa + '@test.com' } }, A);
  kontrol('kayitli yetiskine ikinci okulun muduru rolu eklendi', varOlan.status === 200 && varOlan.body.mudur.yeni === false, J(varOlan.body));

  console.log('=== KVKK: MUDURUN ACTIGI HESAP ONAY VERMEDEN KULLANAMAZ ===');
  const kvkkEposta = 'kvkk.ogrenci' + z + '@okul.com';
  await iste('/api/school/student-create', 'POST',
    { fullName: 'Onay Bekleyen', username: 'kvkk.ogrenci' + z, email: kvkkEposta, password: 'Ogrenci2026', tc: tcUret() }, T);
  const onaysiz = await girisYap(kvkkEposta, 'Ogrenci2026');
  kontrol('giris yapabiliyor ama onayi guncel degil', onaysiz.kvkkGuncel === false, 'kvkkGuncel ' + onaysiz.kvkkGuncel);
  const engel = await iste('/api/progress', 'GET', null, onaysiz.token);
  kontrol('onaysiz istek 403 + kvkkGerek', engel.status === 403 && engel.body.kvkkGerek === true, 'status ' + engel.status);
  const meSerbest = await iste('/api/me', 'GET', null, onaysiz.token);
  kontrol('/me onaysizken de acik', meSerbest.status === 200 && meSerbest.body.kvkkGuncel === false);
  const sahte = await iste('/api/kvkk-onay', 'POST', { onay: 'evet' }, onaysiz.token);
  kontrol('onay alani gercekten true olmali', sahte.status === 400, 'status ' + sahte.status);
  const onay = await iste('/api/kvkk-onay', 'POST', { onay: true }, onaysiz.token);
  kontrol('onay kaydedildi', onay.status === 200 && onay.body.kvkkGuncel === true, J(onay.body));
  const artik = await iste('/api/progress', 'GET', null, onaysiz.token);
  kontrol('onaydan sonra istek gecti', artik.status === 200, 'status ' + artik.status);

  console.log();
  console.log('  GECTI: ' + gecti + '   KALDI: ' + kaldi);
  process.exit(kaldi ? 1 : 0);
})().catch(e => { console.error('TEST HATASI:', e.message, e.stack); process.exit(1); });
