/* Okulun disk sınırı (okul başına; sunucu/bolumler/okul-disk.js):
   - varsayılan sınır site ayarından ("Varsayılan okul disk sınırı"); panelden
     kaydedilmediyse EE_OKUL_DOSYA_GB (tumtest bu pakete 0.001 = 1 MB verir,
     kaynak "ortam"), kaydedilince veritabanı, "Varsayılana dön" ile yine ortam;
     doğrulama ve işlem kaydı (site.okul-disk-siniri);
   - yönetici okul açarken sınırı verir (diskMb), vermezse varsayılan; bozuk
     değer 400 (alan diskMb);
   - okul ekranı: sınırı değiştirme (MB ya da null = varsayılan), doğrulama,
     işlem kaydı (okul.disk-siniri), yönetici olmayana bilinmeyen adres (404);
   - sayım: teslim dosyası, ek (taslak dahil) ve okul sayfası fotoğrafı okulun
     kullanımına girer, silinince düşer; müdür /school/ozet'te görür;
   - %80 bildirimi bir kez (ek yüklemesiyle); dolunca ek, fotoğraf ve teslim
     yüklemesi 507 { okulDolu } ve açık ileti; "doldu" bildirimi bir kez;
   - sınır küçülünce var olan dosyalar silinmez; sınır büyüyünce uyarı yeniden kurulur;
   - sistem geneli: okullara ayrılan toplam, okulların kullandığı, diskteki boş
     yer, veritabanı; ayrılan alan boş yerden fazlaysa uyarı (izin verilir);
   - saatlik mutabakat (sunucu içinden, yalnız test veritabanında): sahipsiz
     dosya raporlanır, kayıtlı dosyalar tutarlı. */
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const crypto = require('crypto');
const { iste, girisYap, hesapAc, kisiKodu, mudurYap } = require('./giris');

const BASE = process.env.EE_BASE || 'http://localhost:3000';
const MB = 1024 * 1024, GB = 1024 * MB;
const ORTAM_MB = Number(process.env.EE_OKUL_DOSYA_GB) > 0 ? Math.max(1, Math.round(Number(process.env.EE_OKUL_DOSYA_GB) * 1024)) : 0;
const DOLU = 'Okulunun dosya alanı doldu. Okul yönetimi eski dosyaları sildirebilir ya da yöneticiden alan isteyebilir.';
let gecti = 0, kaldi = 0;
function kontrol(ad, sart, detay) {
  if (sart) { gecti++; console.log('  GECTI  ' + ad); }
  else { kaldi++; console.log('  KALDI  ' + ad + (detay ? '  -> ' + detay : '')); }
}
const J = x => JSON.stringify(x === undefined ? null : x).slice(0, 220);
const gun = n => new Date(Date.now() + n * 86400000).toISOString().slice(0, 10);
const bekle = ms => new Promise(r => setTimeout(r, ms));

/* Ham gövdeli yükleme: ödev teslimi, ek ya da okul sayfası fotoğrafı. */
async function hamYukle(token, yol, ad, veri, tur) {
  const h = { 'Content-Type': tur || 'application/octet-stream' };
  if (ad) h['X-Dosya-Adi'] = encodeURIComponent(ad);
  if (token) h.Authorization = 'Bearer ' + token;
  const r = await fetch(BASE + yol, { method: 'POST', headers: h, body: veri });
  let j = {};
  try { j = JSON.parse(await r.text()); } catch (e) { j = {}; }
  return { status: r.status, body: j };
}
const teslimYukle = (tok, odev, ad, veri) => hamYukle(tok, '/api/odev-dosya/yukle?odev=' + encodeURIComponent(odev), ad, veri);
const ekYukle = (tok, ad, veri) => hamYukle(tok, '/api/ek/yukle?tur=mesaj', ad, veri);
const fotoYukle = (tok, veri) => hamYukle(tok, '/api/okul-sayfa/foto?yer=galeri', '', veri, 'image/png');

/* Gerçek (çözülebilen) PNG: w x h rastgele renkli, sıkıştırılmamış (boyutu belli). */
function pngUret(w, h) {
  const parca = (tur, veri) => {
    const b = Buffer.alloc(12 + veri.length);
    b.writeUInt32BE(veri.length, 0);
    b.write(tur, 4, 'latin1');
    veri.copy(b, 8);
    b.writeUInt32BE(zlib.crc32(b.subarray(4, 8 + veri.length)) >>> 0, 8 + veri.length);
    return b;
  };
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0); ihdr.writeUInt32BE(h, 4); ihdr[8] = 8; ihdr[9] = 2;
  const satirlar = [];
  for (let y = 0; y < h; y++) satirlar.push(Buffer.from([0]), crypto.randomBytes(w * 3));
  return Buffer.concat([Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]), parca('IHDR', ihdr),
    parca('IDAT', zlib.deflateSync(Buffer.concat(satirlar), { level: 0 })), parca('IEND', Buffer.alloc(0))]);
}

(async () => {
  const z = Date.now().toString(36);
  const A = (await girisYap('admin@egitimevi.com', 'admin123')).token;
  const M = (await girisYap('mudur@test.com', 'Test1234!')).token;
  const mat = await girisYap('mat@test.com', 'Test1234!');
  const o1 = await girisYap('ogrenci1', 'Test1234!');
  const okulId = mat.user.schoolId;

  const genel = async () => (await iste('/api/admin/overview', 'GET', null, A)).body;
  const okulum = async id => ((await genel()).schools || []).find(s => s.id === (id || okulId)) || { disk: {} };
  const sinirYaz = (id, mb, tok) => iste('/api/admin/okul-disk-siniri', 'POST', { okulId: id, mb }, tok || A);
  const kayitlar = async islem => ((await iste('/api/islem-kaydi?islem=' + islem, 'GET', null, A)).body.kayitlar || []);
  const say = async (tok, parca) => ((await iste('/api/notifications', 'GET', null, tok)).body.notifications || [])
    .filter(n => n.text.indexOf(parca) >= 0).length;
  /* "doldu" bildirimi yüklemeyi bekletmeden gider: biraz beklenir. */
  const sayBekle = async (tok, parca, n) => {
    let s = 0;
    for (let i = 0; i < 20; i++) { s = await say(tok, parca); if (s >= n) break; await bekle(150); }
    return s;
  };

  console.log('=== 1) VARSAYILAN OKUL DİSK SINIRI (SİTE AYARI) ===');
  const sa0 = (await iste('/api/admin/site-ayarlari', 'GET', null, A)).body.ayarlar.okulDiskMb;
  if (ORTAM_MB) {
    kontrol('panelden kaydedilmemişken EE_OKUL_DOSYA_GB geçerli (kaynak "ortam")', sa0.deger === ORTAM_MB && sa0.kaynak === 'ortam', J(sa0));
  } else {
    kontrol('EE_OKUL_DOSYA_GB yokken varsayılan 5 GB', sa0.deger === 5120 && sa0.kaynak === 'varsayilan', J(sa0));
  }
  kontrol('ayarın sınırları ve kodun varsayılanı (1 MB - 10 TB, 5 GB)', sa0.en === 1 && sa0.cok === 10485760 && sa0.varsayilan === 5120, J(sa0));
  const t0 = await okulum();
  kontrol('özel sınırı olmayan okul varsayılanı kullanıyor', t0.disk.ozel === false && t0.disk.siniriMb === null &&
    t0.disk.sinir === sa0.deger * MB, J(t0.disk));
  let bozukAyar = '';
  for (const v of [0, -5, 2.5, 10485761, 'abc', '', {}, [1], null, true]) {
    const r = await iste('/api/admin/site-ayarlari', 'POST', { anahtar: 'okulDiskMb', deger: v }, A);
    if (r.status !== 400 || r.body.alan !== 'okulDiskMb') { bozukAyar = J(v) + ' -> ' + r.status + ' ' + J(r.body); break; }
  }
  kontrol('bozuk varsayılan sınır 400 ve alan okulDiskMb', !bozukAyar, bozukAyar);
  const saKaydet = await iste('/api/admin/site-ayarlari', 'POST', { anahtar: 'okulDiskMb', deger: 2048 }, A);
  kontrol('varsayılan sınır kaydedildi (veritabanı)', saKaydet.status === 200 && saKaydet.body.ayarlar.okulDiskMb.deger === 2048 &&
    saKaydet.body.ayarlar.okulDiskMb.kaynak === 'veritabani', J(saKaydet.body));
  kontrol('varsayılanı kullanan okulun sınırı hemen değişti (2 GB)', (await okulum()).disk.sinir === 2 * GB);
  const saKayit = (await kayitlar('site.okul-disk-siniri'))[0] || {};
  kontrol('işlem kaydında site.okul-disk-siniri (eski → yeni)', saKayit.islemAd === 'Varsayılan okul disk sınırı değişti' &&
    /→ 2 GB$/.test(saKayit.detay || ''), J(saKayit));
  const saSifirla = await iste('/api/admin/site-ayarlari', 'POST', { anahtar: 'okulDiskMb', sifirla: true }, A);
  kontrol('"Varsayılana dön" ile yine ortam değişkeni (ya da 5 GB)', saSifirla.status === 200 &&
    saSifirla.body.ayarlar.okulDiskMb.kaynak === (ORTAM_MB ? 'ortam' : 'varsayilan'), J(saSifirla.body.ayarlar && saSifirla.body.ayarlar.okulDiskMb));
  const VARSAYILAN_MB = saSifirla.body.ayarlar.okulDiskMb.deger;

  console.log('=== 2) OKUL AÇARKEN DİSK SINIRI ===');
  const k1 = 'diskmudur' + z;
  await hesapAc({ fullName: 'Disk Müdürü', username: k1, email: k1 + '@test.com' });
  const aday = await girisYap(k1 + '@test.com', 'Test1234!');
  const adayKod = await kisiKodu(aday.token);
  let bozukAcma = '';
  for (const v of [0, -1, 2.5, 'abc', 10485761, {}, true]) {
    const r = await iste('/api/admin/okul-ac', 'POST', { schoolName: 'Bozuk Disk Okulu ' + z, city: 'Ankara', district: 'Çankaya',
      kisaAd: 'bozuk-disk-' + z, mudurKodu: adayKod, diskMb: v }, A);
    if (r.status !== 400 || r.body.alan !== 'diskMb') { bozukAcma = J(v) + ' -> ' + r.status + ' ' + J(r.body); break; }
  }
  kontrol('bozuk disk sınırıyla okul açılmıyor (400, alan diskMb)', !bozukAcma, bozukAcma);
  const diskOkulAd = 'Disk Okulu ' + z;
  await mudurYap(k1 + '@test.com', 'Test1234!', { schoolName: diskOkulAd, city: 'Ankara', district: 'Çankaya', diskMb: 3072 }, A);
  const dOkul = ((await genel()).schools || []).find(s => s.name === diskOkulAd) || { disk: {} };
  kontrol('okul verilen sınırla açıldı (3 GB, özel)', dOkul.disk.siniriMb === 3072 && dOkul.disk.ozel === true &&
    dOkul.disk.sinir === 3 * GB && dOkul.disk.kullanilan === 0, J(dOkul.disk));
  const acKayit = (await kayitlar('okul.acildi')).find(k => (k.detay || '').indexOf(diskOkulAd) === 0) || {};
  kontrol('işlem kaydında açılan okulun disk sınırı', /disk sınırı 3 GB$/.test(acKayit.detay || ''), J(acKayit));
  const k2 = 'disksiz' + z;
  await hesapAc({ fullName: 'Varsayılan Müdür', username: k2, email: k2 + '@test.com' });
  const vOkulAd = 'Varsayılan Okulu ' + z;
  await mudurYap(k2 + '@test.com', 'Test1234!', { schoolName: vOkulAd, city: 'Ankara', district: 'Çankaya' }, A);
  const vOkul = ((await genel()).schools || []).find(s => s.name === vOkulAd) || { disk: {} };
  kontrol('sınır verilmeden açılan okul varsayılanı kullanıyor', vOkul.disk.siniriMb === null && vOkul.disk.ozel === false &&
    vOkul.disk.sinir === VARSAYILAN_MB * MB, J(vOkul.disk));
  kontrol('öneri: öğrenci sayısı × 10 MB, en az 2 GB; öğrencisiz okulda yok (varsayılan)',
    t0.disk.oneriMb === (Number(t0.students) > 0 ? Math.max(2048, Number(t0.students) * 10) : null) && dOkul.disk.oneriMb === null, J([t0.students, t0.disk.oneriMb, dOkul.disk.oneriMb]));

  console.log('=== 3) OKUL EKRANI: SINIRI DEĞİŞTİRME ===');
  const mudurDener = await sinirYaz(dOkul.id, 100, M);
  kontrol('müdür okul sınırını değiştiremez (bilinmeyen adres, 404)', mudurDener.status === 404 && mudurDener.body.error === 'Böyle bir adres yok',
    mudurDener.status + ' ' + J(mudurDener.body));
  const yokOkul = await sinirYaz('yok-boyle-okul', 100);
  kontrol('olmayan okul 404 (alan okulId)', yokOkul.status === 404 && yokOkul.body.alan === 'okulId', J(yokOkul.body));
  let bozukSinir = '';
  for (const v of [0, -1, 2.5, 'x', 10485761, {}, [], true, undefined, '']) {
    const r = await iste('/api/admin/okul-disk-siniri', 'POST', v === undefined ? { okulId: dOkul.id } : { okulId: dOkul.id, mb: v }, A);
    if (r.status !== 400 || r.body.alan !== 'mb') { bozukSinir = J(v) + ' -> ' + r.status + ' ' + J(r.body); break; }
  }
  kontrol('bozuk sınır 400 (alan mb)', !bozukSinir, bozukSinir);
  const kayitOnce = (await kayitlar('okul.disk-siniri')).length;
  const s2 = await sinirYaz(dOkul.id, 2048);
  kontrol('sınır 3 GB → 2 GB', s2.status === 200 && s2.body.okul.disk.siniriMb === 2048 && /kaydedildi: 2 GB\./.test(s2.body.message),
    J(s2.body));
  const dKayit = (await kayitlar('okul.disk-siniri'))[0] || {};
  kontrol('işlem kaydında okul.disk-siniri (okul: eski → yeni)', dKayit.detay === diskOkulAd + ': 3 GB → 2 GB' &&
    dKayit.islemAd === 'Okulun disk sınırı değişti', J(dKayit));
  const s2b = await sinirYaz(dOkul.id, '2048');
  kontrol('aynı sınır yeniden: "zaten böyle", işlem kaydı yazılmaz', s2b.status === 200 && /zaten böyle/.test(s2b.body.message) &&
    (await kayitlar('okul.disk-siniri')).length === kayitOnce + 1, J(s2b.body));
  const s3 = await sinirYaz(dOkul.id, null);
  const dKayit2 = (await kayitlar('okul.disk-siniri'))[0] || {};
  kontrol('null ile varsayılana döner', s3.status === 200 && s3.body.okul.disk.ozel === false && s3.body.okul.disk.siniriMb === null &&
    /: 2 GB → varsayılan \(/.test(dKayit2.detay || ''), J(s3.body.okul) + ' ' + J(dKayit2));

  console.log('=== 4) SAYIM: TESLİM, EK, FOTOĞRAF ===');
  await sinirYaz(okulId, 50);
  const b0 = (await okulum()).disk;
  const odev = (await iste('/api/assignments', 'POST', { title: 'Disk ödevi ' + z, subject: 'Matematik', studentIds: [o1.user.id],
    startAt: gun(-1), endAt: gun(3), endTime: '23:59', dosyaYukleme: true }, mat.token)).body.assignment.id;
  const t1 = await teslimYukle(o1.token, odev, 'disk.pdf', crypto.randomBytes(100000));
  const e1 = await ekYukle(mat.token, 'ek.pdf', crypto.randomBytes(50000));
  const png = pngUret(80, 80);
  const f1 = await fotoYukle(M, png);
  const fotolar = (await iste('/api/okul-sayfa', 'GET', null, M)).body.fotolar || [];
  const fBoyut = Number((fotolar.find(f => f.id === (f1.body.foto && f1.body.foto.id)) || {}).boyut || 0);
  const b1 = (await okulum()).disk;
  kontrol('teslim dosyası, ek taslağı ve fotoğraf yüklendi', t1.status === 200 && e1.status === 200 && f1.status === 200 && fBoyut > 0,
    J([t1.body, e1.body, f1.body]));
  kontrol('dağılım: teslim +100000, ek +50000, fotoğraf + kayıttaki boyut', b1.dagilim.teslim - b0.dagilim.teslim === 100000 &&
    b1.dagilim.ek - b0.dagilim.ek === 50000 && b1.dagilim.foto - b0.dagilim.foto === fBoyut, J([b0.dagilim, b1.dagilim, fBoyut]));
  kontrol('kullanılan = teslim + ek + fotoğraf; sınır 50 MB', b1.kullanilan === b1.dagilim.teslim + b1.dagilim.ek + b1.dagilim.foto &&
    b1.sinir === 50 * MB && b1.ozel === true, J(b1));
  const oz = (await iste('/api/school/ozet', 'GET', null, M)).body;
  kontrol('müdür okulunun doluluğunu görüyor (/school/ozet)', oz.disk && oz.disk.kullanilan === b1.kullanilan &&
    oz.disk.sinir === b1.sinir && oz.disk.dagilim.ek === b1.dagilim.ek, J(oz.disk));
  const ozO = await iste('/api/school/ozet', 'GET', null, mat.token);
  kontrol('öğretmen okulun doluluğunu görmüyor', !(ozO.body && ozO.body.disk), ozO.status + ' ' + J(ozO.body));
  await iste('/api/ek/sil', 'POST', { id: e1.body.ek.id }, mat.token);
  await iste('/api/odev-dosya/sil', 'POST', { id: t1.body.dosya.id }, o1.token);
  const b2 = (await okulum()).disk;
  kontrol('silinen ek ve teslim dosyası sayımdan düştü', b2.dagilim.ek === b0.dagilim.ek && b2.dagilim.teslim === b0.dagilim.teslim &&
    b2.kullanilan === b1.kullanilan - 150000, J([b1.kullanilan, b2.kullanilan]));

  console.log('=== 5) %80 VE DOLU: EK, FOTOĞRAF, TESLİM ===');
  const s1 = await sinirYaz(okulId, 1);
  const U = s1.body.okul.disk.kullanilan;
  kontrol('okulun sınırı 1 MB; kullanım %80 altında', s1.status === 200 && s1.body.okul.disk.sinir === MB && U < 0.8 * MB - 20000, J(s1.body.okul));
  const e80a = await ekYukle(mat.token, 'yuzde1.pdf', crypto.randomBytes(Math.ceil(0.8 * MB) - U - 1000));
  kontrol('%80 altında bildirim yok', e80a.status === 200 && await say(M, "dosya alanının %80'i doldu") === 0 &&
    await say(A, "dosya alanının %80'i doldu") === 0, J(e80a.body));
  const e80b = await ekYukle(mat.token, 'yuzde2.pdf', crypto.randomBytes(2000));
  kontrol("ek yüklemesi %80'i geçince müdüre ve yöneticiye bildirim", e80b.status === 200 &&
    await say(M, "Okulun dosya alanının %80'i doldu") === 1 && await say(A, "Test Ortaokulu: dosya alanının %80'i doldu") === 1, J(e80b.body));
  const e80c = await ekYukle(mat.token, 'yuzde3.pdf', crypto.randomBytes(1000));
  kontrol('%80 bildirimi bir kez gider', e80c.status === 200 && await say(M, "dosya alanının %80'i doldu") === 1 &&
    await say(A, "dosya alanının %80'i doldu") === 1, J(e80c.body));
  const kalan = MB - (await okulum()).disk.kullanilan;
  const eDolu = await ekYukle(mat.token, 'buyuk.pdf', crypto.randomBytes(kalan + 1000));
  kontrol('sığmayan ek 507, okulDolu ve açık ileti', eDolu.status === 507 && eDolu.body.okulDolu === true && eDolu.body.error === DOLU,
    eDolu.status + ' ' + J(eDolu.body));
  kontrol('dolunca müdüre ve yöneticiye "doldu" bildirimi', await sayBekle(M, 'Okulun dosya alanı doldu (', 1) === 1 &&
    await sayBekle(A, 'Test Ortaokulu: dosya alanı doldu (', 1) === 1);
  const eSon = await ekYukle(mat.token, 'son.pdf', crypto.randomBytes(kalan - 5000));
  const fDolu = await fotoYukle(M, png);
  const tDolu = await teslimYukle(o1.token, odev, 'dolu.pdf', crypto.randomBytes(20000));
  kontrol('alan dolunca fotoğraf ve teslim de 507 okulDolu', eSon.status === 200 && fDolu.status === 507 && fDolu.body.okulDolu === true &&
    fDolu.body.error === DOLU && tDolu.status === 507 && tDolu.body.okulDolu === true, [eSon.status, fDolu.status, tDolu.status].join(' '));
  await bekle(300);
  kontrol('"doldu" bildirimi bir kez gider', await say(M, 'Okulun dosya alanı doldu (') === 1 &&
    await say(A, 'Test Ortaokulu: dosya alanı doldu (') === 1);

  console.log('=== 6) SINIR BÜYÜYÜNCE UYARI YENİDEN KURULUR, KÜÇÜLÜNCE DOSYA SİLİNMEZ ===');
  const buyut = await sinirYaz(okulId, 2);
  const U2 = buyut.body.okul.disk.kullanilan;
  kontrol('sınır 2 MB (kullanım %70 altında)', buyut.status === 200 && U2 < 0.7 * 2 * MB, J(buyut.body.okul));
  const y80 = await ekYukle(mat.token, 'yeniden.pdf', crypto.randomBytes(Math.ceil(0.8 * 2 * MB) - U2 + 1000));
  kontrol('%80 yeniden geçilince bildirim yeniden gider', y80.status === 200 && await say(M, "Okulun dosya alanının %80'i doldu") === 2,
    J(y80.body));
  const kucult = await sinirYaz(okulId, 1);
  const kD = kucult.body.okul.disk;
  kontrol('sınır kullanımın altına küçülebiliyor; cevap bunu söylüyor', kucult.status === 200 && kD.kullanilan > kD.sinir && kD.oran > 100 &&
    /aşıyor: var olan dosyalar silinmez, yalnız yeni yükleme durur/.test(kucult.body.message), J(kucult.body));
  const bilet = await iste('/api/ek/bilet?id=' + e80a.body.ek.id, 'GET', null, mat.token);
  const fotoVar = await fetch(BASE + '/api/okul-foto/' + f1.body.foto.id);
  kontrol('var olan ek ve fotoğraf duruyor', bilet.status === 200 && fotoVar.status === 200, bilet.status + ' ' + fotoVar.status);
  const kucukEk = await ekYukle(mat.token, 'kucuk.txt', Buffer.from('bir satır'));
  kontrol('küçük ek bile yüklenemiyor (507)', kucukEk.status === 507 && kucukEk.body.okulDolu === true, J(kucukEk.body));
  const dagilimOnce = (await okulum()).disk.kullanilan;
  kontrol('sınır küçülünce kullanım değişmedi (hiçbir dosya silinmedi)', dagilimOnce === kD.kullanilan, dagilimOnce + ' ' + kD.kullanilan);

  console.log('=== 7) SİSTEM GENELİ ===');
  const g = await genel();
  const sis = g.disk || {};
  const ayrilan = (g.schools || []).filter(s => s.status !== 'rejected').reduce((t, s) => t + s.disk.sinir, 0);
  const kullanilan = (g.schools || []).reduce((t, s) => t + s.disk.kullanilan, 0);
  kontrol('okullara ayrılan toplam ve okulların kullandığı', sis.ayrilan === ayrilan && sis.kullanilan === kullanilan &&
    sis.okul === (g.schools || []).filter(s => s.status !== 'rejected').length, J(sis));
  kontrol('diskteki boş yer ve veritabanı boyutu okunuyor', (sis.bos === null || sis.bos > 0) && sis.veritabani > 0 &&
    sis.varsayilanMb === VARSAYILAN_MB, J(sis));
  const cokBuyuk = await sinirYaz(dOkul.id, 10485760);
  kontrol('ayrılan alan diskteki boş yerden fazlaysa izin verilir ama uyarılır', cokBuyuk.status === 200 &&
    (cokBuyuk.body.sistem.bos === null || (cokBuyuk.body.sistem.asim === true && /diskteki boş yerden/.test(cokBuyuk.body.uyari))),
    J(cokBuyuk.body.sistem));
  const geri = await sinirYaz(dOkul.id, null);
  kontrol('sınır geri alınınca uyarı kalkıyor', geri.status === 200 && (geri.body.sistem.bos === null ||
    geri.body.sistem.ayrilan > geri.body.sistem.bos || (geri.body.sistem.asim === false && !geri.body.uyari)), J(geri.body.sistem));

  console.log('=== 8) SAATLİK MUTABAKAT (SUNUCU İÇİNDEN) ===');
  process.env.EE_DATA = path.join(__dirname, 'testdata');
  require('../sunucu/ayarlar').ayarlariYukle();
  const baglanti = require('../sunucu/veri/baglanti');
  if (!/_test$/.test(baglanti.veritabaniAdi() || '')) {
    console.log('  (test veritabanı değil: mutabakat denenmedi)');
  } else {
    try {
      const sahipsiz = path.join(process.env.EE_DATA, 'ekler', crypto.randomBytes(16).toString('hex'));
      fs.mkdirSync(path.dirname(sahipsiz), { recursive: true });
      fs.writeFileSync(sahipsiz, crypto.randomBytes(1234));
      await require('../sunucu/veri').depo.siteAyarlari.yukle();
      const r = await require('../sunucu/bolumler/okul-disk').mutabakat();
      fs.unlinkSync(sahipsiz);
      kontrol('sahipsiz dosya raporlanıyor', r.sahipsiz.adet === 1 && r.sahipsiz.bayt === 1234, J(r));
      kontrol('kayıtlı dosyaların hepsi diskte, boyutları tutuyor', r.kayip === 0 && r.boyutFarki === 0 && r.kayitli.adet > 0 &&
        r.diskte.bayt === r.kayitli.bayt + r.sahipsiz.bayt + r.yarim.bayt, J(r));
    } finally { await baglanti.kapat(); }
  }

  console.log('');
  console.log('GECTI: ' + gecti + '   KALDI: ' + kaldi);
  process.exit(kaldi ? 1 : 0);
})().catch(e => { console.error('TEST HATASI:', e); process.exit(1); });
