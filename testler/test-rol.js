const { iste, girisYap } = require('./giris');

let gecti = 0, kaldi = 0;
function kontrol(ad, sart, detay) {
  if (sart) { gecti++; console.log('  GECTI  ' + ad); }
  else { kaldi++; console.log('  KALDI  ' + ad + (detay ? '  -> ' + detay : '')); }
}

(async () => {
  const mudur = await girisYap('mudur@test.com', 'Test1234!');
  const T = mudur.token;

  console.log('=== 1) YETKI KATALOGU ===');
  const kat = await iste('/api/school/permissions', 'GET', null, T);
  kontrol('yetki listesi geliyor', kat.status === 200 && kat.body.gruplar.length > 0,
    'grup ' + (kat.body.gruplar || []).length);
  const tumYetki = kat.body.gruplar.reduce((a, g) => a.concat(g.liste.map(x => x.k)), []);
  kontrol('yeterince yetki tanimli', tumYetki.length >= 20, 'adet ' + tumYetki.length);
  kontrol('derse-atanabilir yetkisi var', tumYetki.indexOf('derse-atanabilir') >= 0);
  kontrol('ogretmen varsayilani donuyor', (kat.body.ogretmenVarsayilan || []).length > 0,
    JSON.stringify(kat.body.ogretmenVarsayilan));

  console.log('=== 2) ROL OLUSTURMA ===');
  const rol = await iste('/api/school/role', 'POST', {
    name: 'Müdür Yardımcısı',
    permissions: ['sinif.yonet', 'program.duzenle', 'ogrenci.yerlestir', 'ders.yonet']
  }, T);
  kontrol('rol olusturuldu', rol.status === 200, JSON.stringify(rol.body).slice(0, 120));
  kontrol('yetkiler kaydedildi', (rol.body.role.permissions || []).length === 4);
  const rolId = rol.body.role.id;

  const ayni = await iste('/api/school/role', 'POST', { name: 'müdür yardımcısı', permissions: [] }, T);
  kontrol('ayni adli rol reddedildi', ayni.status === 400, JSON.stringify(ayni.body));

  const uydurma = await iste('/api/school/role', 'POST', {
    name: 'Uydurma', permissions: ['sinif.yonet', 'yok.boyle.yetki', 'her-seyi-yap']
  }, T);
  kontrol('gecersiz yetki ayiklandi', uydurma.body.role.permissions.length === 1,
    JSON.stringify(uydurma.body.role.permissions));
  await iste('/api/school/role-delete', 'POST', { roleId: uydurma.body.role.id }, T);

  console.log('=== 3) ROLSUZ OGRETMEN ===');
  const ogrt = await girisYap('mat@test.com', 'Test1234!');
  const OT = ogrt.token;
  const sinifDener = await iste('/api/school/class', 'POST', { name: '9-Z' }, OT);
  kontrol('rolsuz ogretmen sinif acamaz', sinifDener.status === 403, 'status ' + sinifDener.status);
  const programDener = await iste('/api/school/classes', 'GET', null, OT);
  kontrol('rolsuz ogretmen sinif listesini goremez', programDener.status === 403, 'status ' + programDener.status);

  console.log('=== 4) ROL ATAMA ===');
  const ogrtListe = await iste('/api/school/teachers', 'GET', null, T);
  const hedef = ogrtListe.body.teachers.find(t => t.username === 'mat');
  const ata = await iste('/api/school/role-assign', 'POST', { userId: hedef.id, roleId: rolId }, T);
  kontrol('rol atandi', ata.status === 200, JSON.stringify(ata.body).slice(0, 100));
  kontrol('rol adi kullanicida gorunuyor', ata.body.user.customRoleName === 'Müdür Yardımcısı',
    ata.body.user.customRoleName);

  console.log('=== 5) ROLLU OGRETMEN ===');
  const ogrt2 = await girisYap('mat@test.com', 'Test1234!');
  const OT2 = ogrt2.token;
  kontrol('yetkiler /me ile geliyor', (ogrt2.user.yetkiler || []).indexOf('sinif.yonet') >= 0,
    JSON.stringify(ogrt2.user.yetkiler));

  const sinifAc = await iste('/api/school/class', 'POST', { name: '9-Z' }, OT2);
  kontrol('artik sinif acabiliyor', sinifAc.status === 200, JSON.stringify(sinifAc.body).slice(0, 100));

  const sifreDener = await iste('/api/school/student-password', 'POST',
    { studentId: 'u_yok', password: 'Deneme1234' }, OT2);
  kontrol('verilmeyen yetkiyi kullanamiyor (sifre)', sifreDener.status === 403,
    'status ' + sifreDener.status);

  const rolDener = await iste('/api/school/role', 'POST', { name: 'Kendi Rolum', permissions: [] }, OT2);
  kontrol('rol.yonet yetkisi olmadan rol acamaz', rolDener.status === 403, 'status ' + rolDener.status);

  console.log('=== 6) OGRETMEN VARSAYILAN YETKILERI ===');
  kontrol('derse atanabilir yetkisi varsayilan', (ogrt2.user.yetkiler || []).indexOf('derse-atanabilir') >= 0);
  kontrol('odev verme yetkisi varsayilan', (ogrt2.user.yetkiler || []).indexOf('odev.ver') >= 0);

  console.log('=== 7) ROL GUNCELLEME ===');
  const guncelle = await iste('/api/school/role-update', 'POST', {
    roleId: rolId, permissions: ['sinif.yonet']
  }, T);
  kontrol('yetkiler daraltildi', guncelle.body.role.permissions.length === 1);
  const ogrt3 = await girisYap('mat@test.com', 'Test1234!');
  kontrol('daraltma kullaniciya yansidi',
    (ogrt3.user.yetkiler || []).indexOf('program.duzenle') < 0,
    JSON.stringify(ogrt3.user.yetkiler));

  console.log('=== 8) ROL SILME ===');
  const kisiSayisi = await iste('/api/school/roles', 'GET', null, T);
  const r = kisiSayisi.body.roles.find(x => x.id === rolId);
  kontrol('rolde kac kisi var sayiliyor', r && r.kisiSayisi === 1, 'kisi ' + (r && r.kisiSayisi));

  const sil = await iste('/api/school/role-delete', 'POST', { roleId: rolId }, T);
  kontrol('rol silindi', sil.status === 200);
  const ogrt4 = await girisYap('mat@test.com', 'Test1234!');
  kontrol('rol silinince yetkiler dustu',
    (ogrt4.user.yetkiler || []).indexOf('sinif.yonet') < 0,
    JSON.stringify(ogrt4.user.yetkiler));
  kontrol('varsayilan yetkiler duruyor', (ogrt4.user.yetkiler || []).indexOf('odev.ver') >= 0);

  console.log('=== 8b) OKULUN KONUMU YETKISI (okul.konum) ===');
  const konumRol = await iste('/api/school/role', 'POST', { name: 'Harita Sorumlusu', permissions: ['okul.konum'] }, T);
  kontrol('okul.konum yetkili rol olusturuldu', konumRol.status === 200 && konumRol.body.role.permissions[0] === 'okul.konum',
    JSON.stringify(konumRol.body).slice(0, 120));
  const yetkisiz = await girisYap('fen@test.com', 'Test1234!');
  const kY = await iste('/api/school/konum', 'POST', { enlem: 39.9, boylam: 32.85 }, yetkisiz.token);
  const aY = await iste('/api/school/adres', 'GET', null, yetkisiz.token);
  kontrol('yetkisiz ogretmen okulun konumunu ayarlayamaz', kY.status === 403 && aY.status === 403, kY.status + ' ' + aY.status);
  await iste('/api/school/role-assign', 'POST', { userId: hedef.id, roleId: konumRol.body.role.id }, T);
  const konumcu = await girisYap('mat@test.com', 'Test1234!');
  const kK = await iste('/api/school/konum', 'POST', { enlem: 39.92077, boylam: 32.85411 }, konumcu.token);
  const aK = await iste('/api/school/adres', 'GET', null, konumcu.token);
  kontrol('yetkili ogretmen konumu kaydediyor ve goruyor', kK.status === 200 && aK.status === 200 && aK.body.enlem === 39.92077,
    kK.status + ' ' + JSON.stringify(aK.body));
  const adresDener = await iste('/api/school/adres', 'POST', { kisaAd: 'baska-adres' }, konumcu.token);
  kontrol('konum yetkisi okulun giris adresini degistirmiyor', adresDener.status === 403, 'status ' + adresDener.status);
  const kayit = await iste('/api/islem-kaydi?islem=okul.konum', 'GET', null, T);
  kontrol('konum degisikligi islem kaydina dusuyor', kayit.status === 200 && (kayit.body.kayitlar || []).length > 0,
    kayit.status + ' ' + JSON.stringify(kayit.body).slice(0, 120));
  await iste('/api/school/role-delete', 'POST', { roleId: konumRol.body.role.id }, T);

  console.log('=== 9) MUDUR HER ZAMAN TAM YETKILI ===');
  kontrol('mudurun butun yetkileri var', (mudur.user.yetkiler || []).length === tumYetki.length,
    (mudur.user.yetkiler || []).length + ' / ' + tumYetki.length);

  console.log();
  console.log('  GECTI: ' + gecti + '   KALDI: ' + kaldi);
  process.exit(kaldi ? 1 : 0);
})().catch(e => { console.error('TEST HATASI:', e.message, e.stack); process.exit(1); });
