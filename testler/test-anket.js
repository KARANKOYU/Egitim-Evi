/* Anketler ve duyuru okundu bilgisi:
   - anketi yalnızca toplu mesaj yetkisi olan açar; hedef açılışta çözülür;
   - hedefte olmayan, kapanmış ankete ya da başka anketin seçeneğine oy yazılmaz;
   - kişi başına tek oy (değiştirilebilir, geri alınabilir);
   - sonuç: yöneten her an, oy veren anket bitince; gizli ankette seçim gitmez;
   - duyuruyu gönderen kimin ne zaman okuduğunu tam listeyle görür, alıcı göremez. */
const { iste, girisYap, hesapAc, mudurYap } = require('./giris');

let gecti = 0, kaldi = 0;
function kontrol(ad, sart, detay) {
  if (sart) { gecti++; console.log('  GECTI  ' + ad); }
  else { kaldi++; console.log('  KALDI  ' + ad + (detay ? '  -> ' + detay : '')); }
}
const J = x => JSON.stringify(x).slice(0, 180);
const gun = n => { const d = new Date(Date.now() + n * 86400000); return d.toISOString().slice(0, 10); };

(async () => {
  const z = Date.now();
  const M = (await girisYap('mudur@test.com', 'Test1234!')).token;
  const A = (await girisYap('admin@egitimevi.com', 'admin123')).token;
  const o1 = await girisYap('ogrenci1', 'Test1234!');
  const o2 = await girisYap('ogrenci2', 'Test1234!');
  const mat = await girisYap('mat', 'Test1234!');
  const fen = await girisYap('fen', 'Test1234!');
  const sinif = (await iste('/api/school/classes', 'GET', null, M)).body.classes.find(c => c.name === '6-A');

  /* Zeynep'in velisi */
  const vK = 'anketveli' + z;
  await hesapAc({ fullName: 'Anket Veli', username: vK, email: vK + '@test.com' });
  const veli = await girisYap(vK, 'Test1234!');
  const kod = (await iste('/api/me', 'GET', null, o1.token)).body.user.code;
  await iste('/api/parent/link', 'POST', { code: kod }, veli.token);

  console.log('=== 1) ANKET AÇMA ===');
  const temel = { soru: 'Gezi hangi gün olsun?', secenekler: ['Pazartesi', 'Salı', ' pazartesi '],
    hedef: { tur: 'sinif', siniflar: [sinif.id] }, bitisGun: gun(3), bitisSaat: '17:00' };
  const yetkisiz = await iste('/api/anketler', 'POST', temel, mat.token);
  kontrol('yetkisiz öğretmen anket açamıyor', yetkisiz.status === 403, 'status ' + yetkisiz.status);
  const ogrenciAcar = await iste('/api/anketler', 'POST', temel, o1.token);
  kontrol('öğrenci anket açamıyor', ogrenciAcar.status === 403, 'status ' + ogrenciAcar.status);
  const tekSecenek = await iste('/api/anketler', 'POST', Object.assign({}, temel, { secenekler: ['Evet', 'evet'] }), M);
  kontrol('aynı seçenek iki kez sayılmıyor (en az iki farklı)', tekSecenek.status === 400, J(tekSecenek.body));
  const gecmis = await iste('/api/anketler', 'POST', Object.assign({}, temel, { bitisGun: gun(-1) }), M);
  kontrol('geçmiş bitiş reddedildi', gecmis.status === 400, J(gecmis.body));
  const uzun = await iste('/api/anketler', 'POST', Object.assign({}, temel, { bitisGun: gun(120) }), M);
  kontrol('çok uzun süre reddedildi', uzun.status === 400, J(uzun.body));
  const kisi = await iste('/api/anketler', 'POST', Object.assign({}, temel, { hedef: { tur: 'kisi', kisiler: [o1.user.id] } }), M);
  kontrol('kişi seçimiyle anket açılmıyor', kisi.status === 400, J(kisi.body));

  const acildi = await iste('/api/anketler', 'POST', temel, M);
  kontrol('anket açıldı (2 öğrenci + 1 veli)', acildi.status === 200 && acildi.body.hedefSayisi === 3, J(acildi.body));
  const anketId = acildi.body.id;
  const ikinci = await iste('/api/anketler', 'POST', Object.assign({}, temel, { soru: 'Servis saati', secenekler: ['07:30', '08:00'],
    gizli: true }), M);
  kontrol('gizli anket açıldı', ikinci.status === 200, J(ikinci.body));

  console.log('=== 2) OY ===');
  const liste = await iste('/api/anketler', 'GET', null, o1.token);
  const bana = (liste.body.gelen || []).find(a => a.id === anketId);
  kontrol('öğrenci anketi görüyor, iki seçenek var', !!bana && bana.acik && bana.secenekler.length === 2 && !bana.sayimlar, J(bana));
  kontrol('öğrenci yönetilen listesi görmüyor', (liste.body.yonetilen || []).length === 0 && liste.body.olusturabilir === false);
  const pazartesi = bana.secenekler[0].id, sali = bana.secenekler[1].id;
  const baskaSecenek = (await iste('/api/anketler', 'GET', null, o1.token)).body.gelen.find(a => a.id === ikinci.body.id).secenekler[0].id;
  const yanlis = await iste('/api/anketler/oy', 'POST', { id: anketId, secenekId: baskaSecenek }, o1.token);
  kontrol('başka anketin seçeneğine oy yazılmıyor', yanlis.status === 400, J(yanlis.body));
  const hedefDisi = await iste('/api/anketler/oy', 'POST', { id: anketId, secenekId: pazartesi }, fen.token);
  kontrol('hedefte olmayan öğretmen oy veremiyor', hedefDisi.status === 403, 'status ' + hedefDisi.status);
  const oy1 = await iste('/api/anketler/oy', 'POST', { id: anketId, secenekId: pazartesi }, o1.token);
  const oy2 = await iste('/api/anketler/oy', 'POST', { id: anketId, secenekId: sali }, o1.token);
  kontrol('öğrenci oy verdi ve değiştirdi', oy1.status === 200 && oy2.status === 200);
  const sonra = (await iste('/api/anketler', 'GET', null, o1.token)).body.gelen.find(a => a.id === anketId);
  kontrol('kendi oyu görünüyor', sonra.benimOyum === sali, J(sonra));
  const erkenSonuc = await iste('/api/anketler/sonuc?id=' + anketId, 'GET', null, o1.token);
  kontrol('anket bitmeden öğrenci sonucu göremiyor', erkenSonuc.status === 403, 'status ' + erkenSonuc.status);
  const veliOy = await iste('/api/anketler/oy', 'POST', { id: anketId, secenekId: sali }, veli.token);
  kontrol('veli oy verdi', veliOy.status === 200, J(veliOy.body));
  await iste('/api/anketler/oy', 'POST', { id: anketId, secenekId: pazartesi }, o2.token);
  const geriAl = await iste('/api/anketler/oy', 'POST', { id: anketId, secenekId: '' }, o2.token);
  kontrol('oy geri alındı', geriAl.status === 200);

  const sonuc = await iste('/api/anketler/sonuc?id=' + anketId, 'GET', null, M);
  kontrol('müdür sayıları görüyor (Salı 2, Pazartesi 0)', sonuc.status === 200 && sonuc.body.sayimlar[sali] === 2 &&
    !sonuc.body.sayimlar[pazartesi], J(sonuc.body.sayimlar));
  const vSatir = (sonuc.body.katilim || []).find(k => k.ad === 'Anket Veli');
  kontrol('katılımda veli çocuğuyla görünüyor, seçimi var', !!vSatir && vSatir.oyVerdi && vSatir.secim === sali &&
    vSatir.cocuklar.indexOf('Zeynep Şahin') >= 0, J(vSatir));
  const o2Satir = sonuc.body.katilim.find(k => k.ad === 'Burak Öztürk');
  kontrol('geri alan öğrenci oy vermemiş görünüyor, sınıfı yazıyor', !!o2Satir && !o2Satir.oyVerdi && o2Satir.sinif === '6-A', J(o2Satir));

  await iste('/api/anketler/oy', 'POST', { id: ikinci.body.id, secenekId: baskaSecenek }, o1.token);
  const gizli = await iste('/api/anketler/sonuc?id=' + ikinci.body.id, 'GET', null, M);
  kontrol('gizli ankette kimin neyi seçtiği ve oy zamanı gelmiyor', gizli.status === 200 && gizli.body.katilim.some(k => k.oyVerdi) &&
    gizli.body.katilim.every(k => k.secim === '' && k.tarih === null), J(gizli.body.katilim));
  kontrol('gizli anket açıkken sayılar da gelmiyor (yeni oyla eşleştirilemesin)', gizli.body.sayimlar === null, J(gizli.body.sayimlar));
  await iste('/api/anketler/kapat', 'POST', { id: ikinci.body.id }, M);
  const gizliBitti = await iste('/api/anketler/sonuc?id=' + ikinci.body.id, 'GET', null, M);
  kontrol('gizli anket bitince sayılar açılıyor', gizliBitti.body.sayimlar && gizliBitti.body.sayimlar[baskaSecenek] === 1,
    J(gizliBitti.body.sayimlar));

  console.log('=== 3) YÖNETİM ===');
  await hesapAc({ fullName: 'Baska Mudur', username: 'anket.mudur' + z, email: 'anketmudur' + z + '@test.com' });
  const M2 = (await mudurYap('anket.mudur' + z, 'Test1234!', { schoolName: 'Anket Okulu ' + z, city: 'Ankara', district: 'Mamak' }, A)).token;
  const yabanciSonuc = await iste('/api/anketler/sonuc?id=' + anketId, 'GET', null, M2);
  const yabanciKapat = await iste('/api/anketler/kapat', 'POST', { id: anketId }, M2);
  kontrol('başka okulun müdürü sonucu göremiyor, kapatamıyor', yabanciSonuc.status === 403 && yabanciKapat.status === 403,
    yabanciSonuc.status + ' ' + yabanciKapat.status);
  const ogrenciSil = await iste('/api/anketler/sil', 'POST', { id: anketId }, o1.token);
  kontrol('öğrenci anketi silemiyor', ogrenciSil.status === 403, 'status ' + ogrenciSil.status);

  const kapat = await iste('/api/anketler/kapat', 'POST', { id: anketId }, M);
  kontrol('müdür anketi bitirdi', kapat.status === 200, J(kapat.body));
  const gec = await iste('/api/anketler/oy', 'POST', { id: anketId, secenekId: pazartesi }, o2.token);
  kontrol('bitmiş ankete oy yazılmıyor', gec.status === 400 && /kapandı/.test(gec.body.error || ''), J(gec.body));
  const bitmis = (await iste('/api/anketler', 'GET', null, o1.token)).body.gelen.find(a => a.id === anketId);
  kontrol('bitince oy verene sonuç açıldı', !bitmis.acik && bitmis.sayimlar && bitmis.sayimlar[sali] === 2, J(bitmis));
  const acikSonuc = await iste('/api/anketler/sonuc?id=' + anketId, 'GET', null, o1.token);
  kontrol('öğrenci bitmiş anketin sonucunu görüyor ama katılım listesini değil', acikSonuc.status === 200 && !acikSonuc.body.katilim,
    J(acikSonuc.body));
  const sil = await iste('/api/anketler/sil', 'POST', { id: ikinci.body.id }, M);
  const silindi = (await iste('/api/anketler', 'GET', null, o1.token)).body.gelen.some(a => a.id === ikinci.body.id);
  kontrol('müdür anketi sildi, listeden düştü', sil.status === 200 && !silindi);

  console.log('=== 4) DUYURU OKUNDU BİLGİSİ ===');
  const duyuru = await iste('/api/mesajlar', 'POST', { tur: 'duyuru', konu: 'Veli toplantısı ' + z, govde: 'Cuma 15:00',
    hedef: { tur: 'sinif', siniflar: [sinif.id] } }, M);
  kontrol('duyuru gönderildi', duyuru.status === 200, J(duyuru.body));
  const mId = duyuru.body.mesaj.id;
  let giden = (await iste('/api/mesajlar?kutu=giden', 'GET', null, M)).body.mesajlar.find(m => m.id === mId);
  kontrol('gönderilenlerde 0 / 3 okudu', giden.kisiSayisi === 3 && giden.okuyanSayisi === 0, J(giden));
  await iste('/api/mesajlar/' + mId, 'GET', null, o1.token);
  await iste('/api/mesajlar/' + mId, 'GET', null, veli.token);
  giden = (await iste('/api/mesajlar?kutu=giden', 'GET', null, M)).body.mesajlar.find(m => m.id === mId);
  kontrol('iki kişi okuyunca 2 / 3', giden.okuyanSayisi === 2, J(giden));
  const okuma = await iste('/api/mesajlar/okuma?id=' + mId, 'GET', null, M);
  const z1 = (okuma.body.alicilar || []).find(a => a.ad === 'Zeynep Şahin');
  const b2 = (okuma.body.alicilar || []).find(a => a.ad === 'Burak Öztürk');
  const vv = (okuma.body.alicilar || []).find(a => a.ad === 'Anket Veli');
  kontrol('okuyanın okuma zamanı var, sınıfı yazıyor', !!z1 && !!z1.okuma && z1.sinif === '6-A', J(z1));
  kontrol('okumayanın zamanı yok', !!b2 && !b2.okuma, J(b2));
  kontrol('velinin hangi çocuğun velisi olduğu yazıyor', !!vv && vv.cocuklar[0] === 'Zeynep Şahin' && !!vv.okuma, J(vv));
  kontrol('listede kimlik ya da iletişim bilgisi yok', !/"id"|email|eposta|telefon/.test(JSON.stringify(okuma.body)));
  const ogrGoremez = await iste('/api/mesajlar/okuma?id=' + mId, 'GET', null, o1.token);
  kontrol('alıcı okundu bilgisini göremiyor', ogrGoremez.status === 403, 'status ' + ogrGoremez.status);
  const detay = await iste('/api/mesajlar/' + mId, 'GET', null, M);
  kontrol('gönderen detayında okuma özeti var', detay.body.mesaj.okumaGorur === true && detay.body.mesaj.okuyanSayisi === 2 &&
    detay.body.mesaj.kisiSayisi === 3 && !detay.body.mesaj.alicilar, J(detay.body.mesaj));
  const ogrDetay = await iste('/api/mesajlar/' + mId, 'GET', null, o2.token);
  kontrol('alıcı detayında okuma özeti yok', ogrDetay.status === 200 && !ogrDetay.body.mesaj.okumaGorur);

  console.log('');
  console.log('GECTI: ' + gecti + '   KALDI: ' + kaldi);
  process.exit(kaldi ? 1 : 0);
})().catch(e => { console.error('TEST HATASI:', e); process.exit(1); });
