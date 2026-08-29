/* Mesajlasma ve duyuru testleri. */
const { iste, epostaOnayla, girisYap, botCevabi } = require('./giris');

let gecti = 0, kaldi = 0;
function kontrol(ad, sart, detay) {
  if (sart) { gecti++; console.log('  GECTI  ' + ad); }
  else { kaldi++; console.log('  KALDI  ' + ad + (detay ? '  -> ' + detay : '')); }
}

/* Kayıt olur ve e-postadaki onay bağlantısına tıklar (hesap ancak o zaman açılır). */
async function kayit(govde) {
  const bot = await botCevabi();
  const r = await iste('/api/register', 'POST',
    Object.assign({ kvkkOnay: true, phone: '05321234567' }, govde,
      { challengeId: bot.challengeId, challengeAnswer: bot.challengeAnswer }));
  if (r.status === 200 && r.body.onayGerekli) await epostaOnayla(govde.email);
  return r;
}

(async () => {
  const mudur = await girisYap('mudur@test.com', 'Test1234!');
  const M = mudur.token;
  const ogretmen = await girisYap('mat@test.com', 'Test1234!');
  const O = ogretmen.token;
  const ogrenci = await girisYap('ogrenci1@test.com', 'Test1234!');
  const S = ogrenci.token;

  /* --- veli hazirla: ogrenci1'in velisi olsun --- */
  const ogrListe = await iste('/api/school/students', 'GET', null, M);
  const ogr1 = ogrListe.body.students.find(x => x.email === 'ogrenci1@test.com');
  await kayit({
    role: 'parent', fullName: 'Veli Test', email: 'veli-mesaj@test.com',
    password: 'Test1234!', city: 'Ankara', district: 'Çankaya'
  });
  const veli = await girisYap('veli-mesaj@test.com', 'Test1234!');
  const V = veli.token;
  const bagla = await iste('/api/parent/link', 'POST', { code: ogr1.code }, V);
  kontrol('veli cocuguna baglandi', bagla.status === 200, JSON.stringify(bagla.body).slice(0, 120));

  console.log('=== 1) HEDEFLER ===');
  const hMudur = await iste('/api/mesajlar/hedefler', 'GET', null, M);
  kontrol('mudur toplu gonderebiliyor', hMudur.body.topluIzin === true);
  kontrol('mudur tum okula gonderebiliyor', hMudur.body.okulIzin === true);
  kontrol('mudur siniflari goruyor', Array.isArray(hMudur.body.siniflar));

  const hOgrenci = await iste('/api/mesajlar/hedefler', 'GET', null, S);
  kontrol('ogrenci toplu gonderemiyor', hOgrenci.body.topluIzin === false);
  const ogrKisiler = hOgrenci.body.kisiler || [];
  kontrol('ogrenci sadece ogretmen/mudur goruyor',
    ogrKisiler.every(k => k.rol === 'teacher' || k.rol === 'principal'),
    ogrKisiler.map(k => k.rol).join(','));
  kontrol('ogrenci baska ogrenciyi goremiyor',
    !ogrKisiler.some(k => k.rol === 'student'));

  console.log('=== 2) KISIYE MESAJ ===');
  const m1 = await iste('/api/mesajlar', 'POST', {
    tur: 'mesaj', konu: 'Deneme mesaji', govde: 'Merhaba, bu bir denemedir.',
    hedef: { tur: 'kisi', kisiler: [ogr1.id] }
  }, O);
  kontrol('ogretmen ogrenciye mesaj atti', m1.status === 200,
    JSON.stringify(m1.body).slice(0, 150));

  console.log('=== 3) VELI KOPYASI ===');
  kontrol('ogrenci + veli olmak uzere 2 aliciya gitti', m1.body.gonderilen === 2,
    'gonderilen ' + m1.body.gonderilen);

  const veliKutu = await iste('/api/mesajlar', 'GET', null, V);
  const veliMesaj = (veliKutu.body.mesajlar || []).find(x => x.konu === 'Deneme mesaji');
  kontrol('veli mesaji gordu', !!veliMesaj, JSON.stringify(veliKutu.body).slice(0, 150));
  kontrol('veliye hangi cocuk icin geldigi yaziyor',
    veliMesaj && veliMesaj.cocukIcin && veliMesaj.cocukIcin.length === 1,
    veliMesaj ? JSON.stringify(veliMesaj.cocukIcin) : '-');

  const ogrKutu = await iste('/api/mesajlar', 'GET', null, S);
  kontrol('ogrenci de mesaji gordu',
    (ogrKutu.body.mesajlar || []).some(x => x.konu === 'Deneme mesaji'));
  kontrol('okunmamis sayaci calisiyor', ogrKutu.body.okunmamis >= 1,
    'okunmamis ' + ogrKutu.body.okunmamis);

  console.log('=== 4) OKUNDU ISARETI ===');
  const mid = m1.body.mesaj.id;
  const detay = await iste('/api/mesajlar/' + mid, 'GET', null, S);
  kontrol('mesaj detayi acildi', detay.status === 200 && !!detay.body.mesaj.govde);
  const ogrKutu2 = await iste('/api/mesajlar', 'GET', null, S);
  kontrol('okunmamis sayaci dustu', ogrKutu2.body.okunmamis === ogrKutu.body.okunmamis - 1,
    ogrKutu.body.okunmamis + ' -> ' + ogrKutu2.body.okunmamis);

  const gonderenGoruntu = await iste('/api/mesajlar/' + mid, 'GET', null, O);
  kontrol('gonderen kimin okudugunu goruyor',
    gonderenGoruntu.body.mesaj.okuyanSayisi >= 1,
    'okuyan ' + gonderenGoruntu.body.mesaj.okuyanSayisi);

  console.log('=== 5) YETKISIZ HEDEF ===');
  const m2 = await iste('/api/mesajlar', 'POST', {
    tur: 'mesaj', konu: 'Izinsiz', govde: 'olmaz',
    hedef: { tur: 'okul' }
  }, S);
  kontrol('ogrenci tum okula gonderemiyor', m2.status === 400,
    JSON.stringify(m2.body).slice(0, 120));

  const m3 = await iste('/api/mesajlar', 'POST', {
    tur: 'duyuru', konu: 'Sahte duyuru', govde: 'olmaz',
    hedef: { tur: 'kisi', kisiler: [ogr1.id] }
  }, S);
  kontrol('ogrenci duyuru yayimlayamiyor', m3.status === 403,
    JSON.stringify(m3.body).slice(0, 120));

  const baskaOgr = ogrListe.body.students.find(x => x.email === 'ogrenci2@test.com');
  const m4 = await iste('/api/mesajlar', 'POST', {
    tur: 'mesaj', konu: 'Ogrenciye', govde: 'olmaz',
    hedef: { tur: 'kisi', kisiler: [baskaOgr.id] }
  }, S);
  kontrol('ogrenci baska ogrenciye yazamiyor', m4.status === 400,
    JSON.stringify(m4.body).slice(0, 120));

  console.log('=== 6) MESAJ IZIN AYARI ===');
  const ayarKapat = await iste('/api/mesajlar/ayar', 'POST',
    { kimden: 'personel', engelli: [] }, S);
  kontrol('ogrenci ayarini kaydetti', ayarKapat.status === 200, JSON.stringify(ayarKapat.body));

  /* Veli -> ogrenci yazamamali artik (veli personel degil) */
  const m5 = await iste('/api/mesajlar', 'POST', {
    tur: 'mesaj', konu: 'Veliden', govde: 'deneme',
    hedef: { tur: 'kisi', kisiler: [ogr1.id] }
  }, V);
  kontrol('sadece-personel ayari veliyi engelliyor', m5.status === 400,
    JSON.stringify(m5.body).slice(0, 130));

  /* Ogretmen hala yazabilmeli */
  const m6 = await iste('/api/mesajlar', 'POST', {
    tur: 'mesaj', konu: 'Ogretmenden', govde: 'deneme',
    hedef: { tur: 'kisi', kisiler: [ogr1.id] }
  }, O);
  kontrol('sadece-personel ayari ogretmeni engellemiyor', m6.status === 200,
    JSON.stringify(m6.body).slice(0, 120));

  console.log('=== 7) ENGELLI LISTESI ===');
  await iste('/api/mesajlar/ayar', 'POST',
    { kimden: 'herkes', engelli: [ogretmen.user.id] }, S);
  const m7 = await iste('/api/mesajlar', 'POST', {
    tur: 'mesaj', konu: 'Engelliden', govde: 'deneme',
    hedef: { tur: 'kisi', kisiler: [ogr1.id] }
  }, O);
  kontrol('engellenen kisi mesaj atamiyor', m7.status === 400,
    JSON.stringify(m7.body).slice(0, 130));

  const ayarOku = await iste('/api/mesajlar/ayar', 'GET', null, S);
  kontrol('engelli listesi geri okunuyor',
    (ayarOku.body.engelli || []).length === 1,
    JSON.stringify(ayarOku.body));

  console.log('=== 8) DUYURU AYARLARI ASIYOR ===');
  const d1 = await iste('/api/mesajlar', 'POST', {
    tur: 'duyuru', konu: 'Kar tatili', govde: 'Yarin okul tatil.',
    hedef: { tur: 'okul' }
  }, M);
  kontrol('mudur duyuru yayimladi', d1.status === 200, JSON.stringify(d1.body).slice(0, 130));

  const ogrDuyuru = await iste('/api/mesajlar/duyurular', 'GET', null, S);
  kontrol('mesaji kapatan ogrenci duyuruyu yine de aldi',
    (ogrDuyuru.body.duyurular || []).some(x => x.konu === 'Kar tatili'),
    JSON.stringify(ogrDuyuru.body).slice(0, 150));

  console.log('=== 9) SINIFA DUYURU ===');
  await iste('/api/mesajlar/ayar', 'POST', { kimden: 'herkes', engelli: [] }, S);
  /* Sinif zaten varsa hata doner; listeden bulmak daha dayanikli. */
  await iste('/api/school/class', 'POST', { name: 'MESAJ-SINIF' }, M);
  const sinifListe = await iste('/api/school/classes', 'GET', null, M);
  const sinifKayit = (sinifListe.body.classes || []).find(c => c.name === 'MESAJ-SINIF');
  kontrol('test sinifi hazir', !!sinifKayit,
    (sinifListe.body.classes || []).map(c => c.name).join(','));
  const sinifId = sinifKayit ? sinifKayit.id : '';
  const yerlestir = await iste('/api/school/class-assign', 'POST',
    { studentId: ogr1.id, classId: sinifId }, M);
  kontrol('ogrenci sinifa yerlestirildi', yerlestir.status === 200,
    JSON.stringify(yerlestir.body).slice(0, 120));

  const d2 = await iste('/api/mesajlar', 'POST', {
    tur: 'duyuru', konu: 'Sinif duyurusu', govde: 'Yarin deneme sinavi.',
    hedef: { tur: 'sinif', siniflar: [sinifId] }
  }, M);
  kontrol('sinifa duyuru gitti', d2.status === 200, JSON.stringify(d2.body).slice(0, 130));
  kontrol('sinif duyurusu veliye de gitti', d2.body.gonderilen >= 2,
    'gonderilen ' + d2.body.gonderilen);

  console.log('=== 10) UZUN METIN VE BOSLUK ===');
  const uzun = await iste('/api/mesajlar', 'POST', {
    tur: 'mesaj', konu: 'x'.repeat(500), govde: 'y'.repeat(9000),
    hedef: { tur: 'kisi', kisiler: [ogr1.id] }
  }, O);
  kontrol('cok uzun metin kirpiliyor ama patlamiyor', uzun.status === 200,
    JSON.stringify(uzun.body).slice(0, 120));
  const uzunDetay = await iste('/api/mesajlar/' + uzun.body.mesaj.id, 'GET', null, O);
  kontrol('konu 120 karaktere kirpildi',
    uzunDetay.body.mesaj.konu.length === 120,
    'uzunluk ' + uzunDetay.body.mesaj.konu.length);
  kontrol('govde 4000 karaktere kirpildi',
    uzunDetay.body.mesaj.govde.length === 4000,
    'uzunluk ' + uzunDetay.body.mesaj.govde.length);

  const bos = await iste('/api/mesajlar', 'POST', {
    tur: 'mesaj', konu: '   ', govde: 'dolu',
    hedef: { tur: 'kisi', kisiler: [ogr1.id] }
  }, O);
  kontrol('bos konu reddediliyor', bos.status === 400, JSON.stringify(bos.body));

  console.log('=== 11) SILME ===');
  const silAlici = await iste('/api/mesajlar/sil', 'POST', { id: mid }, S);
  kontrol('alici kendinden kaldirabiliyor', silAlici.status === 200,
    JSON.stringify(silAlici.body));
  const sonrasi = await iste('/api/mesajlar', 'GET', null, S);
  kontrol('kaldirilan mesaj kutuda yok',
    !(sonrasi.body.mesajlar || []).some(x => x.id === mid));
  const gonderende = await iste('/api/mesajlar/' + mid, 'GET', null, O);
  kontrol('gonderende hala duruyor', gonderende.status === 200);

  const silGonderen = await iste('/api/mesajlar/sil', 'POST', { id: mid }, O);
  kontrol('gonderen tamamen silebiliyor', silGonderen.status === 200);
  const yok = await iste('/api/mesajlar/' + mid, 'GET', null, O);
  kontrol('silinen mesaj bulunamiyor', yok.status === 404, 'status ' + yok.status);

  console.log();
  console.log('  GECTI: ' + gecti + '   KALDI: ' + kaldi);
  process.exit(kaldi ? 1 : 0);
})().catch(e => { console.error('TEST HATASI:', e.message, e.stack); process.exit(1); });
