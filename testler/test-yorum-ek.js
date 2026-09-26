/* Açılış sayfası yorumları ve ekler:
   - yorumu yalnızca rolü ya da çocuğu olan yetişkin yazar (öğrenci, rolsüz yetişkin yazamaz);
   - ad kısaltılır ("Ayşe Kaya" -> "Ay. Ka."), yıldız 0-5, uygunsuz kelime ve internet adresi reddedilir;
   - hesap başına tek yorum; yönetici gizler, gizli yorum açılışta görünmez;
   - ek: taslak yüklenir, mesaja/ödeve bağlanır; alıcı ve ödevin öğrencisi indirir, başkası indiremez;
   - ödeve eki yalnızca öğretmen koyar; izinsiz uzantı ve 150 MB üstü reddedilir;
   - başkasının taslağı mesaja bağlanamaz; indirme her zaman "ek" (attachment, nosniff). */
const http = require('http');
const crypto = require('crypto');
const { BASE, iste, girisYap, hesapAc } = require('./giris');

let gecti = 0, kaldi = 0;
function kontrol(ad, sart, detay) {
  if (sart) { gecti++; console.log('  GECTI  ' + ad); }
  else { kaldi++; console.log('  KALDI  ' + ad + (detay ? '  -> ' + detay : '')); }
}
const J = x => JSON.stringify(x).slice(0, 200);
const gun = n => new Date(Date.now() + n * 86400000).toISOString().slice(0, 10);

async function ekYukle(token, tur, ad, veri) {
  const h = { 'Content-Type': 'application/octet-stream', 'X-Dosya-Adi': encodeURIComponent(ad) };
  if (token) h.Authorization = 'Bearer ' + token;
  const r = await fetch(BASE + '/api/ek/yukle?tur=' + tur, { method: 'POST', headers: h, body: veri });
  let j = {};
  try { j = JSON.parse(await r.text()); } catch (e) { j = {}; }
  return { status: r.status, body: j };
}
async function indir(token, id) {
  const b = await iste('/api/ek/bilet?id=' + id, 'GET', null, token);
  if (b.status !== 200) return { status: b.status, body: b.body };
  const r = await fetch(BASE + b.body.yol);
  return { status: r.status, headers: r.headers, veri: Buffer.from(await r.arrayBuffer()) };
}
function buyukBildir(token) {
  return new Promise(resolve => {
    const u = new URL(BASE + '/api/ek/yukle?tur=mesaj');
    const req = http.request({ hostname: u.hostname, port: u.port, path: u.pathname + u.search, method: 'POST', headers: {
      Authorization: 'Bearer ' + token, 'Content-Type': 'application/octet-stream', 'X-Dosya-Adi': 'video.mp4',
      'Content-Length': String(160 * 1024 * 1024) } }, res => {
      let t = '';
      res.on('data', c => { t += c; });
      res.on('end', () => { req.destroy(); resolve({ status: res.statusCode, body: t }); });
    });
    req.on('error', () => resolve({ status: 0 }));
    req.write(Buffer.alloc(1024));
  });
}

(async () => {
  const z = Date.now().toString(36);
  const A = (await girisYap('admin@egitimevi.com', 'admin123')).token;
  const M = (await girisYap('mudur@test.com', 'Test1234!')).token;
  const mat = await girisYap('mat@test.com', 'Test1234!');
  const o1 = await girisYap('ogrenci1@test.com', 'Test1234!');
  const o2 = await girisYap('ogrenci2@test.com', 'Test1234!');

  console.log('=== 1) YORUM: KİM YAZAR ===');
  const bos = await iste('/api/yorumlar');
  kontrol('açılış yorumları girişsiz açık', bos.status === 200 && typeof bos.body.sayi === 'number', J(bos.body));
  const ogrDener = await iste('/api/yorumlar', 'POST', { yildiz: 5, metin: 'Çok güzel' }, o1.token);
  kontrol('öğrenci yorum yazamıyor', ogrDener.status === 403, 'status ' + ogrDener.status);
  await hesapAc({ fullName: 'Rolsuz Yorumcu', username: 'yorumcu' + z, email: 'yorumcu' + z + '@test.com' });
  const rolsuz = await girisYap('yorumcu' + z, 'Test1234!');
  const rolsuzBenim = await iste('/api/yorumlar/benim', 'GET', null, rolsuz.token);
  const rolsuzDener = await iste('/api/yorumlar', 'POST', { yildiz: 5, metin: 'Deneme yorumu' }, rolsuz.token);
  kontrol('rolü ve çocuğu olmayan yetişkin yazamıyor, nedeni söyleniyor', rolsuzBenim.body.yazabilir === false &&
    rolsuzDener.status === 403, J(rolsuzBenim.body));

  console.log('=== 2) YORUM: YAZMA VE SÜZGEÇ ===');
  const benim = await iste('/api/yorumlar/benim', 'GET', null, mat.token);
  kontrol('öğretmen yazabilir, adı kısaltılmış', benim.body.yazabilir === true && benim.body.adKisa === 'Ay. Ka.' &&
    /Öğretmen/.test(benim.body.rol), J(benim.body));
  const kufur = await iste('/api/yorumlar', 'POST', { yildiz: 1, metin: 'Bu sistem SALAAAK işi' }, mat.token);
  kontrol('uygunsuz kelime (büyük harf, uzatılmış) reddedildi', kufur.status === 400 && /uygun olmayan/.test(kufur.body.error || ''), J(kufur.body));
  const harfHarf = await iste('/api/yorumlar', 'POST', { yildiz: 1, metin: 'tam bir a p t a l programı' }, mat.token);
  kontrol('harf harf yazılan kelime de yakalandı', harfHarf.status === 400, J(harfHarf.body));
  const masum = await iste('/api/yorumlar/benim', 'GET', null, mat.token);
  kontrol('reddedilen yorum kaydedilmedi', masum.body.yorum === null, J(masum.body));
  const link = await iste('/api/yorumlar', 'POST', { yildiz: 5, metin: 'Harika, bakın: www.reklam.com' }, mat.token);
  kontrol('internet adresi reddedildi', link.status === 400, J(link.body));
  const fazlaYildiz = await iste('/api/yorumlar', 'POST', { yildiz: 6, metin: 'Güzel bir uygulama' }, mat.token);
  kontrol('6 yıldız reddedildi', fazlaYildiz.status === 400, J(fazlaYildiz.body));
  const kisa = await iste('/api/yorumlar', 'POST', { yildiz: 3, metin: 'ok' }, mat.token);
  kontrol('çok kısa yorum reddedildi', kisa.status === 400, J(kisa.body));
  const yaz = await iste('/api/yorumlar', 'POST', { yildiz: 5, metin: 'Sıkıntısız çalışıyor, ödevleri sık sık buradan veriyorum.' }, mat.token);
  kontrol('öğretmen yorum yazdı ("sık", "sıkıntı" masum sayıldı)', yaz.status === 200, J(yaz.body));
  const mudurYaz = await iste('/api/yorumlar', 'POST', { yildiz: 3, metin: 'Ders programı ekranı çok işime yarıyor.' }, M);
  kontrol('müdür yorum yazdı', mudurYaz.status === 200, J(mudurYaz.body));
  const guncelle = await iste('/api/yorumlar', 'POST', { yildiz: 4, metin: 'Ders programı ve yoklama çok işime yarıyor.' }, M);
  const liste = await iste('/api/yorumlar');
  kontrol('hesap başına tek yorum: güncelleme yeni satır açmadı', guncelle.status === 200 && liste.body.sayi === 2 &&
    liste.body.ortalama === 4.5, J(liste.body));
  kontrol('açılışta ad kısaltması var, kişi kimliği yok', liste.body.yorumlar.every(y => y.adKisa && !y.id && !y.hesapId) &&
    liste.body.yorumlar.some(y => y.adKisa === 'Me. De.' && /Müdür/.test(y.rol)), J(liste.body.yorumlar));

  console.log('=== 3) YORUM: YÖNETİCİ GİZLER ===');
  const hepsi = await iste('/api/yorumlar/hepsi', 'GET', null, A);
  const mudurunki = (hepsi.body.yorumlar || []).find(y => y.adKisa === 'Me. De.');
  const ogretmenGizle = await iste('/api/yorumlar/gizle', 'POST', { id: mudurunki && mudurunki.id, gizli: true }, mat.token);
  kontrol('yönetici olmayan gizleyemez', ogretmenGizle.status === 403, 'status ' + ogretmenGizle.status);
  const gizle = await iste('/api/yorumlar/gizle', 'POST', { id: mudurunki.id, gizli: true }, A);
  const gizliSonra = await iste('/api/yorumlar');
  kontrol('gizlenen yorum açılışta görünmüyor', gizle.status === 200 && gizliSonra.body.sayi === 1 &&
    !gizliSonra.body.yorumlar.some(y => y.adKisa === 'Me. De.'), J(gizliSonra.body));
  const sil = await iste('/api/yorumlar/sil', 'POST', {}, mat.token);
  const silSonra = await iste('/api/yorumlar');
  kontrol('kendi yorumunu siliyor', sil.status === 200 && silSonra.body.sayi === 0, J(silSonra.body));

  console.log('=== 4) EK: ÖDEVE DOSYA ===');
  const icerik = crypto.randomBytes(4000);
  const ogrOdevEki = await ekYukle(o1.token, 'odev', 'odev.pdf', icerik);
  kontrol('öğrenci ödeve ek koyamıyor', ogrOdevEki.status === 403, J(ogrOdevEki.body));
  const exe = await ekYukle(mat.token, 'odev', 'virus.exe', Buffer.from('MZ'));
  kontrol('izinsiz uzantı reddedildi', exe.status === 415, J(exe.body));
  const buyuk = await buyukBildir(mat.token);
  kontrol('150 MB üstü okunmadan reddedildi', buyuk.status === 413, 'status ' + buyuk.status);
  const taslak = await ekYukle(mat.token, 'odev', 'Çalışma kâğıdı.pdf', icerik);
  kontrol('öğretmen taslak ek yükledi', taslak.status === 200 && /^[0-9a-f]{32}$/.test(taslak.body.ek.id), J(taslak.body));
  const taslakBaskasi = await indir(o1.token, taslak.body.ek.id);
  kontrol('taslağı yükleyenden başkası indiremiyor', taslakBaskasi.status === 404, 'status ' + taslakBaskasi.status);

  const hedefler = await iste('/api/assignments/hedefler', 'GET', null, mat.token);
  const o1Id = o1.user.id;
  const odev = await iste('/api/assignments', 'POST', { title: 'Ekli ödev ' + z, description: 'Ekteki kâğıdı çöz.', startAt: gun(0),
    endAt: gun(5), studentIds: [o1Id], ekIdler: [taslak.body.ek.id] }, mat.token);
  kontrol('ödev ekiyle verildi', odev.status === 200, J(odev.body));
  const odevId = odev.body.assignment && odev.body.assignment.id;
  const ogrenciGorur = await iste('/api/progress', 'GET', null, o1.token);
  const ogrOdev = (ogrenciGorur.body.assignments || []).find(a => a.id === odevId);
  kontrol('öğrenci ödevin ekini görüyor, silinme tarihi var', ogrOdev && ogrOdev.ekler.length === 1 && ogrOdev.ekler[0].ad === 'Çalışma kâğıdı.pdf' &&
    ogrOdev.ekler[0].suresiDoldu === false && new Date(ogrOdev.ekler[0].bitis) > new Date(Date.now() + 6 * 86400000), J(ogrOdev && ogrOdev.ekler));
  const iner = await indir(o1.token, taslak.body.ek.id);
  kontrol('öğrenci indiriyor: içerik aynı, ek olarak iniyor', iner.status === 200 && iner.veri.equals(icerik) &&
    /attachment/.test(iner.headers.get('content-disposition') || '') && iner.headers.get('x-content-type-options') === 'nosniff',
    iner.status + ' ' + (iner.headers && iner.headers.get('content-disposition')));
  const ikinciOgrenci = await indir(o2.token, taslak.body.ek.id);
  kontrol('ödevde olmayan öğrenci indiremiyor', ikinciOgrenci.status === 404, 'status ' + ikinciOgrenci.status);
  const ogretmenDetay = await iste('/api/assignments/' + odevId, 'GET', null, mat.token);
  kontrol('öğretmen ödev ekranında ekleri görüyor', (ogretmenDetay.body.ekler || []).length === 1, J(ogretmenDetay.body.ekler));
  const ikinciTaslak = await ekYukle(mat.token, 'odev', 'ek2.png', Buffer.from('ikinci'));
  const duzelt = await iste('/api/assignments/' + odevId + '/update', 'POST', { title: 'Ekli ödev ' + z, startAt: gun(0), endAt: gun(5),
    ekIdler: [ikinciTaslak.body.ek.id], ekSilIdler: [taslak.body.ek.id] }, mat.token);
  const duzeltSonra = await iste('/api/assignments/' + odevId, 'GET', null, mat.token);
  kontrol('düzeltmede ek eklendi ve eskisi kaldırıldı', duzelt.status === 200 && duzeltSonra.body.ekler.length === 1 &&
    duzeltSonra.body.ekler[0].ad === 'ek2.png', J(duzeltSonra.body.ekler));

  console.log('=== 5) EK: MESAJA DOSYA ===');
  const mesajEki = await ekYukle(o1.token, 'mesaj', 'soru.jpg', Buffer.from('fotograf'));
  kontrol('öğrenci mesaja ek yükledi', mesajEki.status === 200, J(mesajEki.body));
  const kisiler = await iste('/api/mesajlar/hedefler', 'GET', null, o1.token);
  const matKisi = (kisiler.body.kisiler || []).find(k => k.ad === 'Ayşe Kaya');
  const baskasininTaslagi = await ekYukle(mat.token, 'mesaj', 'baska.txt', Buffer.from('baska'));
  const calinti = await iste('/api/mesajlar', 'POST', { tur: 'mesaj', konu: 'Soru', govde: 'Ekte', hedef: { tur: 'kisi', kisiler: [matKisi && matKisi.id] },
    ekIdler: [baskasininTaslagi.body.ek.id] }, o1.token);
  kontrol('başkasının taslağı mesaja bağlanamıyor', calinti.status === 400, J(calinti.body));
  const gonder = await iste('/api/mesajlar', 'POST', { tur: 'mesaj', konu: 'Ödev sorusu ' + z, govde: 'Ekteki soruyu anlamadım.',
    hedef: { tur: 'kisi', kisiler: [matKisi && matKisi.id] }, ekIdler: [mesajEki.body.ek.id] }, o1.token);
  kontrol('mesaj ekiyle gönderildi', gonder.status === 200, J(gonder.body));
  const mesajId = gonder.body.mesaj && gonder.body.mesaj.id;
  const oku = await iste('/api/mesajlar/' + mesajId, 'GET', null, mat.token);
  kontrol('alıcı mesajın ekini görüyor', oku.status === 200 && (oku.body.mesaj.ekler || []).length === 1 &&
    oku.body.mesaj.ekler[0].ad === 'soru.jpg', J(oku.body.mesaj && oku.body.mesaj.ekler));
  const aliciIndir = await indir(mat.token, mesajEki.body.ek.id);
  kontrol('alıcı eki indiriyor', aliciIndir.status === 200 && aliciIndir.veri.toString() === 'fotograf', 'status ' + aliciIndir.status);
  const yabanciIndir = await indir(o2.token, mesajEki.body.ek.id);
  kontrol('mesajın dışındaki kişi indiremiyor', yabanciIndir.status === 404, 'status ' + yabanciIndir.status);
  const tekrarBagla = await iste('/api/mesajlar', 'POST', { tur: 'mesaj', konu: 'Tekrar', govde: 'Aynı ek',
    hedef: { tur: 'kisi', kisiler: [matKisi && matKisi.id] }, ekIdler: [mesajEki.body.ek.id] }, o1.token);
  kontrol('bağlanmış ek ikinci mesaja bağlanamıyor', tekrarBagla.status === 400, J(tekrarBagla.body));
  const bilgesiz = await fetch(BASE + '/api/ek/indir?bilet=uydurma');
  kontrol('biletsiz indirme yok', bilgesiz.status === 410, 'status ' + bilgesiz.status);

  console.log();
  console.log('  GECTI: ' + gecti + '   KALDI: ' + kaldi);
  process.exit(kaldi ? 1 : 0);
})().catch(e => { console.error('TEST HATASI:', e.message, e.stack); process.exit(1); });
