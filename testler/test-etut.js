/* Hazır Öğretmen rolü, etütler, ödev ve mesaj düzeltme, açılış sayfası rakamları:
   - her okulun silinmeyen, ayrıca verilmeyen bir Öğretmen rolü var; müdür
     yetkilerini kapatınca öğretmenden de kalkar;
   - yeni rol hazır şablondan başlatılabilir;
   - etüdü "etut.yonet" yetkisi olan açar; öğretmeni yalnızca etüt günü
     yoklama alır; başka öğretmen, başka gün, ileri tarih reddedilir;
   - gelmeyen öğrenciye ve velisine bildirim gider; öğrenci ve veli görür;
   - sonuçlanmış ödevin kendisi düzeltilebilir (yalnızca sahibi);
   - gönderilmiş mesajı yalnızca gönderen düzeltir; "düzenlendi" görünür;
   - /api/site girişsiz açık, yalnızca sayılar, iletişim ve yapımcılar (yapimcilar.json) döner;
   - /api/uygulama (indirme sayfasının sürüm tablosu) girişsiz açık; testte dışarı istek atılmaz. */
const { BASE, iste, girisYap, hesapAc, mudurYap, okulHesabi } = require('./giris');

let gecti = 0, kaldi = 0;
function kontrol(ad, sart, detay) {
  if (sart) { gecti++; console.log('  GECTI  ' + ad); }
  else { kaldi++; console.log('  KALDI  ' + ad + (detay ? '  -> ' + detay : '')); }
}
const J = x => JSON.stringify(x).slice(0, 240);
const iki = n => (n < 10 ? '0' : '') + n;
const gunYaz = d => d.getFullYear() + '-' + iki(d.getMonth() + 1) + '-' + iki(d.getDate());
const saatYaz = dk => iki(Math.floor(dk / 60)) + ':' + iki(dk % 60);

(async () => {
  const z = Date.now().toString(36);
  const A = (await girisYap('admin@egitimevi.com', 'admin123')).token;
  const M = (await girisYap('mudur@test.com', 'Test1234!')).token;
  const mat = await girisYap('mat@test.com', 'Test1234!');
  const fen = await girisYap('fen@test.com', 'Test1234!');
  const ogr1 = await girisYap('ogrenci1@test.com', 'Test1234!');
  const ogr2 = await girisYap('ogrenci2@test.com', 'Test1234!');

  console.log('=== 1) HAZIR ÖĞRETMEN ROLÜ ===');
  const roller = await iste('/api/school/roles', 'GET', null, M);
  const hazir = (roller.body.roles || []).find(r => r.tur === 'ogretmen');
  kontrol('okulun hazır Öğretmen rolü var, varsayılan yetkilerle', !!hazir && hazir.permissions.indexOf('devamsizlik.al') >= 0 &&
    hazir.kisiSayisi >= 2, J(roller.body));
  const izinler = await iste('/api/school/permissions', 'GET', null, M);
  kontrol('yeni rol için hazır şablonlar geliyor (Etüt Sorumlusu dahil)', (izinler.body.sablonlar || []).some(s =>
    s.ad === 'Etüt Sorumlusu' && s.yetkiler.indexOf('etut.yonet') >= 0), J(izinler.body.sablonlar));
  const silHazir = await iste('/api/school/role-delete', 'POST', { roleId: hazir.id }, M);
  kontrol('hazır rol silinemiyor', silHazir.status === 400, J(silHazir.body));
  const verHazir = await iste('/api/school/role-assign', 'POST', { userId: mat.user.id, roleId: hazir.id }, M);
  kontrol('hazır rol ayrıca verilemiyor', verHazir.status === 400, J(verHazir.body));

  const yoklamasiz = hazir.permissions.filter(y => y !== 'devamsizlik.al');
  const guncel = await iste('/api/school/role-update', 'POST', { roleId: hazir.id, name: 'Başka ad', permissions: yoklamasiz }, M);
  kontrol('müdür hazır rolün yetkisini kapattı; adı değişmedi', guncel.status === 200 &&
    guncel.body.role.permissions.indexOf('devamsizlik.al') < 0 && guncel.body.role.name === hazir.name, J(guncel.body));
  const matMe = await iste('/api/me', 'GET', null, mat.token);
  kontrol('öğretmenden de kalktı', matMe.body.user.yetkiler.indexOf('devamsizlik.al') < 0 &&
    matMe.body.user.yetkiler.indexOf('odev.ver') >= 0, J(matMe.body.user.yetkiler));
  await iste('/api/school/role-update', 'POST', { roleId: hazir.id, permissions: hazir.permissions }, M);
  const matMe2 = await iste('/api/me', 'GET', null, mat.token);
  kontrol('geri açınca öğretmende yeniden var', matMe2.body.user.yetkiler.indexOf('devamsizlik.al') >= 0, J(matMe2.body.user.yetkiler));

  console.log('=== 2) ETÜT AÇMA ===');
  const simdi = new Date();
  const bugun = gunYaz(simdi);
  const gun = ((simdi.getDay() + 6) % 7) + 1;
  const dk = simdi.getHours() * 60 + simdi.getMinutes();
  const bas = Math.max(0, dk - 60), bit = Math.min(23 * 60 + 59, bas + 120);
  const matYeni = await iste('/api/etut/kaydet', 'POST', { ad: 'Deneme', gun, baslangic: '10:00', bitis: '11:00' }, mat.token);
  kontrol('yetkisiz öğretmen etüt açamıyor', matYeni.status === 403, String(matYeni.status));
  const kotu = await iste('/api/etut/kaydet', 'POST', { ad: 'Kötü', gun: 9, baslangic: '11:00', bitis: '10:00' }, M);
  const ters = await iste('/api/etut/kaydet', 'POST', { ad: 'Ters', gun, baslangic: '11:00', bitis: '10:00' }, M);
  kontrol('geçersiz gün ve ters saat reddedildi', kotu.status === 400 && ters.status === 400, J(ters.body));
  const et = await iste('/api/etut/kaydet', 'POST', { ad: 'Matematik etüdü ' + z, gun, baslangic: saatYaz(bas),
    bitis: saatYaz(bit), yer: 'Kütüphane', ogretmenId: mat.user.id }, M);
  kontrol('müdür etüt açtı, öğretmeni atandı', et.status === 200 && et.body.etut.ogretmenId === mat.user.id, J(et.body));
  const etId = et.body.etut.id;
  const matBildirim = await iste('/api/notifications', 'GET', null, mat.token);
  kontrol('öğretmene etüt verildi bildirimi gitti', (matBildirim.body.notifications || []).some(n => /etüdü sana verildi/.test(n.metin || n.text || '')),
    J(matBildirim.body.notifications && matBildirim.body.notifications[0]));

  const ogrListe = await iste('/api/etut/ogrenciler', 'POST', { id: etId, ogrenciIdler: [ogr1.user.id, ogr2.user.id] }, M);
  kontrol('öğrenciler etüde eklendi', ogrListe.status === 200 && ogrListe.body.ogrenciler.length === 2, J(ogrListe.body));
  const yabanci = await iste('/api/etut/ogrenciler', 'POST', { id: etId, ogrenciIdler: [ogr1.user.id, mat.user.id] }, M);
  kontrol('okulun öğrencisi olmayan eklenemiyor', yabanci.status === 400, J(yabanci.body));

  const matListe = await iste('/api/etut', 'GET', null, mat.token);
  const fenListe = await iste('/api/etut', 'GET', null, fen.token);
  kontrol('öğretmen kendi etüdünü görüyor, başkası görmüyor', matListe.body.etutler.some(e => e.id === etId && e.yoklamaAlabilir) &&
    !fenListe.body.etutler.some(e => e.id === etId), J(fenListe.body));
  const fenYok = await iste('/api/etut/yoklama?id=' + etId + '&tarih=' + bugun, 'GET', null, fen.token);
  kontrol('etüdün öğretmeni olmayan yoklamayı açamıyor', fenYok.status === 403, String(fenYok.status));

  console.log('=== 3) YOKLAMA ===');
  const dun = gunYaz(new Date(simdi.getFullYear(), simdi.getMonth(), simdi.getDate() - 1));
  const ileri = gunYaz(new Date(simdi.getFullYear(), simdi.getMonth(), simdi.getDate() + 7));
  const kayitlar = [{ ogrenciId: ogr1.user.id, durum: 'var' }, { ogrenciId: ogr2.user.id, durum: 'yok' }];
  const yanlisGun = await iste('/api/etut/yoklama', 'POST', { id: etId, tarih: dun, kayitlar }, mat.token);
  const ileriGun = await iste('/api/etut/yoklama', 'POST', { id: etId, tarih: ileri, kayitlar }, mat.token);
  kontrol('başka günün ve ileri tarihin yoklaması alınmıyor', yanlisGun.status === 400 && ileriGun.status === 400,
    J(yanlisGun.body) + J(ileriGun.body));
  const kotuDurum = await iste('/api/etut/yoklama', 'POST', { id: etId, tarih: bugun,
    kayitlar: [{ ogrenciId: ogr1.user.id, durum: 'uydurma' }] }, mat.token);
  const disaridan = await iste('/api/etut/yoklama', 'POST', { id: etId, tarih: bugun,
    kayitlar: [{ ogrenciId: mat.user.id, durum: 'var' }] }, mat.token);
  kontrol('geçersiz durum ve listede olmayan kişi reddedildi', kotuDurum.status === 400 && disaridan.status === 400,
    J(disaridan.body));
  const yok = await iste('/api/etut/yoklama', 'POST', { id: etId, tarih: bugun, kayitlar }, mat.token);
  kontrol('öğretmen etüt günü yoklamayı aldı', yok.status === 200 && yok.body.degisen === 2, J(yok.body));
  const yokTekrar = await iste('/api/etut/yoklama', 'POST', { id: etId, tarih: bugun, kayitlar }, mat.token);
  kontrol('aynı yoklama yeniden kaydedilince değişiklik yok', yokTekrar.status === 200 && yokTekrar.body.degisen === 0, J(yokTekrar.body));
  const okunan = await iste('/api/etut/yoklama?id=' + etId + '&tarih=' + bugun, 'GET', null, mat.token);
  kontrol('yoklama geri okunuyor', okunan.status === 200 && okunan.body.ogrenciler.find(o => o.id === ogr2.user.id).durum === 'yok' &&
    okunan.body.engel === '', J(okunan.body));
  const ogr2Bildirim = await iste('/api/notifications', 'GET', null, ogr2.token);
  kontrol('gelmeyen öğrenciye bildirim gitti', (ogr2Bildirim.body.notifications || []).some(n => /Etüt: .*gelmedi/.test(n.metin || n.text || '')),
    J(ogr2Bildirim.body.notifications && ogr2Bildirim.body.notifications[0]));
  const ogr1Bildirim = await iste('/api/notifications', 'GET', null, ogr1.token);
  kontrol('gelen öğrenciye bildirim gitmedi', !(ogr1Bildirim.body.notifications || []).some(n => /Etüt: /.test(n.metin || n.text || '')));

  const ogrGor = await iste('/api/etut/ogrenci', 'GET', null, ogr2.token);
  kontrol('öğrenci etüdünü ve gelmediği günü görüyor', ogrGor.status === 200 && ogrGor.body.etutler.some(e => e.id === etId) &&
    ogrGor.body.yoklamalar.some(y => y.etutId === etId && y.durum === 'yok'), J(ogrGor.body));
  const ogrBaskasi = await iste('/api/etut/ogrenci?studentId=' + ogr1.user.id, 'GET', null, ogr2.token);
  kontrol('öğrenci studentId verse de yalnızca kendini görür', ogrBaskasi.status === 200 &&
    !ogrBaskasi.body.yoklamalar.some(y => y.durum === 'var'), J(ogrBaskasi.body));
  const ogrPersonel = await iste('/api/etut', 'GET', null, ogr1.token);
  kontrol('öğrenci personel listesine giremiyor', ogrPersonel.status === 403, String(ogrPersonel.status));

  /* Veli: çocuğunu bağlar, çocuğun etütlerini görür; başka çocuğu göremez. */
  const hesap = await iste('/api/school/hesap?id=' + ogr2.user.id, 'GET', null, M);
  const veliEp = 'etutveli' + z + '@test.com';
  await hesapAc({ fullName: 'Etüt Velisi', username: 'etutveli' + z, email: veliEp });
  const veli = await girisYap(veliEp, 'Test1234!');
  const bag = await iste('/api/kisilik/cocuk', 'POST', { code: hesap.body.hesap.code }, veli.token);
  const veli2 = await girisYap(veliEp, 'Test1234!');
  const veliGor = await iste('/api/etut/ogrenci?studentId=' + ogr2.user.id, 'GET', null, veli2.token);
  const veliBaska = await iste('/api/etut/ogrenci?studentId=' + ogr1.user.id, 'GET', null, veli2.token);
  kontrol('veli çocuğunun etütlerini görüyor, başka çocuğu göremiyor', bag.status === 200 && veliGor.status === 200 &&
    veliGor.body.etutler.some(e => e.id === etId) && veliBaska.status === 403, veliGor.status + ' ' + veliBaska.status);

  /* Etüt sorumlusu rolü: başka öğretmene "etut.yoklama" verilince o da alabilir. */
  const nobet = await iste('/api/school/role', 'POST', { name: 'Nöbetçi ' + z, permissions: ['etut.yoklama'] }, M);
  await iste('/api/school/role-assign', 'POST', { userId: fen.user.id, roleId: nobet.body.role.id }, M);
  const fenYeni = await iste('/api/etut/yoklama', 'POST', { id: etId, tarih: bugun,
    kayitlar: [{ ogrenciId: ogr2.user.id, durum: 'izinli' }] }, fen.token);
  kontrol('etüt yoklaması yetkisi verilen öğretmen yoklamayı düzeltebiliyor', fenYeni.status === 200 && fenYeni.body.degisen === 1,
    J(fenYeni.body));
  await iste('/api/school/role-assign', 'POST', { userId: fen.user.id, roleId: '' }, M);

  const fenSil = await iste('/api/etut/sil', 'POST', { id: etId, onay: true }, fen.token);
  const onaysiz = await iste('/api/etut/sil', 'POST', { id: etId }, M);
  kontrol('yetkisiz silemiyor, onaysız silinmiyor', fenSil.status === 403 && onaysiz.status === 400, fenSil.status + ' ' + onaysiz.status);

  console.log('=== 4) SONUÇLANMIŞ ÖDEVİ DÜZELTME ===');
  const ov = await iste('/api/assignments', 'POST', { subject: 'Matematik', title: 'Sayfa 10', description: 'ilk',
    startAt: bugun, endAt: bugun, endTime: '12:00', studentIds: [ogr1.user.id] }, mat.token);
  const odevId = ov.body.assignment && ov.body.assignment.id;
  await iste('/api/assignments/' + odevId + '/finish', 'POST', { results: { [ogr1.user.id]: 'yapti' } }, mat.token);
  const duz = await iste('/api/assignments/' + odevId + '/update', 'POST', { title: 'Sayfa 10-12', description: 'değişti',
    startAt: bugun, endAt: ileri, endTime: '17:00' }, mat.token);
  kontrol('sonuçlanmış ödevin adı ve tarihi düzeltildi; sonuç korundu', duz.status === 200 && duz.body.assignment.title === 'Sayfa 10-12' &&
    duz.body.assignment.status === 'finished' && duz.body.assignment.results[ogr1.user.id] === 'yapti', J(duz.body));
  const fenDuz = await iste('/api/assignments/' + odevId + '/update', 'POST', { title: 'Başkası' }, fen.token);
  kontrol('başka öğretmen ödevi düzeltemiyor', fenDuz.status === 403, String(fenDuz.status));
  const tersTarih = await iste('/api/assignments/' + odevId + '/update', 'POST', { title: 'X', startAt: ileri, endAt: bugun }, mat.token);
  kontrol('son tarih başlangıçtan önce olamaz', tersTarih.status === 400, J(tersTarih.body));

  console.log('=== 5) MESAJ DÜZELTME ===');
  const hedefler = await iste('/api/mesajlar/hedefler', 'GET', null, mat.token);
  const gonder = await iste('/api/mesajlar', 'POST', { konu: 'Toplantı', govde: 'Yarın saat 10', hedef: { tur: 'kisi', kisiler: [fen.user.id] } }, mat.token);
  const mid = gonder.body.mesaj && gonder.body.mesaj.id;
  kontrol('mesaj gönderildi', gonder.status === 200 && !!mid, J(gonder.body) + J(hedefler.body).slice(0, 80));
  const aliciDuz = await iste('/api/mesajlar/duzenle', 'POST', { id: mid, konu: 'X', govde: 'Y' }, fen.token);
  kontrol('alıcı mesajı düzeltemiyor', aliciDuz.status === 403, String(aliciDuz.status));
  const mDuz = await iste('/api/mesajlar/duzenle', 'POST', { id: mid, konu: 'Toplantı (saat değişti)', govde: 'Yarın saat 11' }, mat.token);
  const oku = await iste('/api/mesajlar/' + mid, 'GET', null, fen.token);
  kontrol('gönderen düzeltti; alıcı yeni metni ve "düzenlendi"yi görüyor', mDuz.status === 200 && oku.body.mesaj.govde === 'Yarın saat 11' &&
    !!oku.body.mesaj.duzenlenme, J(oku.body));
  const bosDuz = await iste('/api/mesajlar/duzenle', 'POST', { id: mid, konu: '', govde: 'a' }, mat.token);
  kontrol('boş konuyla düzeltilemiyor', bosDuz.status === 400, J(bosDuz.body));

  console.log('=== 6) AÇILIŞ SAYFASI RAKAMLARI ===');
  const site = await iste('/api/site', 'GET', null, null);
  kontrol('girişsiz açık; okul, kişi ve şu an açık sayısı', site.status === 200 && site.body.sayilar.okul >= 1 &&
    site.body.sayilar.kisi >= 4 && site.body.sayilar.cevrimici >= 1, J(site.body));
  kontrol('yalnızca sayılar, iletişim ve yapımcılar dönüyor (kişi bilgisi yok)',
    Object.keys(site.body).sort().join(',') === 'iletisim,sayilar,yapimcilar' &&
    Object.keys(site.body.iletisim).sort().join(',') === 'eposta,telefon' &&
    site.body.yapimcilar.every(y => Object.keys(y).sort().join(',') === 'ad,github,katki'), J(site.body));

  const uyg = await iste('/api/uygulama', 'GET', null, null);
  kontrol('indirme sayfasının sürüm listesi girişsiz açık (testte dışarı istek yok)', uyg.status === 200 &&
    Object.keys(uyg.body).sort().join(',') === 'alindi,playStore,sayfa,surumler' && Array.isArray(uyg.body.surumler) &&
    uyg.body.alindi === false && /^https:\/\/github\.com\//.test(uyg.body.sayfa), J(uyg.body));
  const sayfaHtml = await fetch(BASE + '/indir').then(r => r.text());
  const sayfaHtml2 = await fetch(BASE + '/download/').then(r => r.text());
  kontrol('/indir ve /download indirme sayfasını açıyor', /Eğitim Evi Android uygulaması/.test(sayfaHtml) &&
    /\/js\/indir\.js/.test(sayfaHtml) && sayfaHtml2 === sayfaHtml);

  console.log('=== 7) İNCELEMEDEN GELEN DÜZELTMELER ===');
  /* Rol vermek "rol yönetir" ister: öğretmen düzenleme yetkisi yetmez; kimse kendine rol veremez. */
  const duzenleyici = await iste('/api/school/role', 'POST', { name: 'Düzenleyici ' + z, permissions: ['ogretmen.duzenle'] }, M);
  await iste('/api/school/role-assign', 'POST', { userId: fen.user.id, roleId: duzenleyici.body.role.id }, M);
  const fen2 = await girisYap('fen@test.com', 'Test1234!');
  const rolVer = await iste('/api/school/hesap-guncelle', 'POST', { id: mat.user.id, rolId: duzenleyici.body.role.id }, fen2.token);
  const kendine = await iste('/api/school/hesap-guncelle', 'POST', { id: fen2.user.id, rolId: '' }, fen2.token);
  const brans = await iste('/api/school/hesap-guncelle', 'POST', { id: mat.user.id, brans: 'Matematik' }, fen2.token);
  kontrol('öğretmen düzenleyen rol veremiyor, kendi rolünü değiştiremiyor; branşı düzenleyebiliyor',
    rolVer.status === 400 && kendine.status === 400 && brans.status === 200, rolVer.status + ' ' + kendine.status + ' ' + brans.status);
  await iste('/api/school/role-assign', 'POST', { userId: fen.user.id, roleId: '' }, M);

  /* İlerleyiş ucu öğretmene veli kodu, adres, telefon, e-posta vermiyor. */
  const ilerle = await iste('/api/progress?studentId=' + ogr1.user.id, 'GET', null, mat.token);
  kontrol('ilerleyişteki öğrenci görünümü dar', ilerle.status === 200 && ilerle.body.student.id === ogr1.user.id &&
    ['code', 'address', 'phone', 'email', 'dogum', 'username'].every(k => ilerle.body.student[k] === undefined), J(ilerle.body.student));

  /* Müdürü kaldırılan okula yeni müdür başvurabiliyor; öğrencileri yerinde. */
  const okulAdi = 'Sahipsiz Okul ' + z;
  await hesapAc({ fullName: 'Birinci Mudur', username: 'bm' + z, email: 'bm' + z + '@test.com' });
  const bm = await mudurYap('bm' + z, 'Test1234!', { schoolName: okulAdi, city: 'Ankara', district: 'Mamak' }, A);
  const kalan = await iste('/api/school/hesap-ac', 'POST', { rol: 'student', ad: 'Kalan', soyad: 'Ogrenci', tc: '10000000078' }, bm.token);
  const eskiOkul = bm.user.schoolId;
  const kaldir = await iste('/api/admin/principal-delete', 'POST', { userId: bm.user.id }, A);
  await hesapAc({ fullName: 'Ikinci Mudur', username: 'im' + z, email: 'im' + z + '@test.com' });
  const im = await girisYap('im' + z + '@test.com', 'Test1234!');
  const yeniBas = await iste('/api/okul-basvurusu', 'POST', { dogum: '1980-01-01', beyan: true,  schoolName: okulAdi, city: 'Ankara', district: 'Mamak' }, im.token);
  kontrol('müdürü kaldırılan okula yeniden başvurulabiliyor', kalan.status === 200 && kaldir.status === 200 && yeniBas.status === 200,
    kalan.status + ' ' + kaldir.status + ' ' + J(yeniBas.body));
  const bek = await iste('/api/admin/pending', 'GET', null, A);
  const imBas = (bek.body.principals || []).find(x => x.anaHesapId === im.user.id);
  const karar = imBas ? await iste('/api/admin/decide', 'POST', { userId: imBas.id, approve: true }, A) : { status: 0 };
  const im2 = await girisYap('im' + z + '@test.com', 'Test1234!');
  const ogrListesi = await iste('/api/school/students', 'GET', null, im2.token);
  kontrol('yeni müdür aynı okulu ve öğrencilerini devraldı', !!imBas && imBas.schoolId === eskiOkul && karar.status === 200 &&
    im2.user.schoolId === eskiOkul && (ogrListesi.body.students || []).some(s => s.fullName === 'Kalan Ogrenci'),
    J(imBas) + ' ' + im2.user.schoolId + ' ' + eskiOkul);
  const ikinciKarar = imBas ? await iste('/api/admin/decide', 'POST', { userId: imBas.id, approve: true }, A) : { status: 0 };
  kontrol('karara bağlanmış başvuru ikinci kez onaylanmıyor', ikinciKarar.status === 400, String(ikinciKarar.status));

  /* Müdür başvurusu: 18 yaşından büyük olmalı, beyan şart. */
  await hesapAc({ fullName: 'Genc Aday', username: 'genc' + z, email: 'genc' + z + '@test.com' });
  const genc = await girisYap('genc' + z + '@test.com', 'Test1234!');
  const kucuk = await iste('/api/okul-basvurusu', 'POST', { dogum: '2012-05-05', beyan: true, schoolName: 'Genc Okul ' + z,
    city: 'Ankara', district: 'Mamak' }, genc.token);
  const beyansiz = await iste('/api/okul-basvurusu', 'POST', { dogum: '1990-05-05', schoolName: 'Genc Okul ' + z,
    city: 'Ankara', district: 'Mamak' }, genc.token);
  const tarihsiz = await iste('/api/okul-basvurusu', 'POST', { beyan: true, schoolName: 'Genc Okul ' + z,
    city: 'Ankara', district: 'Mamak' }, genc.token);
  kontrol('18 yaşından küçük, beyansız ve doğum tarihsiz müdür başvurusu reddediliyor',
    kucuk.status === 400 && kucuk.body.alan === 'dogum' && beyansiz.status === 400 && beyansiz.body.alan === 'beyan' &&
    tarihsiz.status === 400 && tarihsiz.body.alan === 'dogum', J(kucuk.body) + J(beyansiz.body) + J(tarihsiz.body));
  const bekleyenler = await iste('/api/admin/pending', 'GET', null, A);
  const imBekleyen = (bekleyenler.body.principals || []).length;
  kontrol('yönetici listesi başvuranın yaşını ve hesabın açılışını da görür (varsa)', bekleyenler.status === 200, String(imBekleyen));

  /* Veli çocuğunu kaldırınca hesabı eski okula bağlı kalmıyor. */
  const cocukKaldir = await iste('/api/kisilik/cocuk-kaldir', 'POST', { id: ogr2.user.id }, veli2.token);
  const veliMe = await iste('/api/me', 'GET', null, veli2.token);
  kontrol('çocuğu kalmayan velinin okulu boşaldı', cocukKaldir.status === 200 && !veliMe.body.user.schoolId, J(veliMe.body.user));

  console.log('\n  GECTI: ' + gecti + '   KALDI: ' + kaldi);
  process.exit(kaldi ? 1 : 0);
})().catch(e => { console.error('TEST HATASI:', e.message, e); process.exit(1); });
