/* Okul sayfası (egitimevi.org/<okulun-adi>):
   - müdür ve "okul.sayfa" yetkisi olan (Kodlayıcı şablonu) düzenler; öteki öğretmen giremez;
   - ayarlar yalnızca izin verilen değerleri alır, bozuk renk varsayılana döner;
   - CSS temizlenir: url, @import, position, content, başka seçici, ters bölü atılır ve nedeni söylenir;
     kalan kurallar yalnızca .okul-sayfa'nın içine uygulanır;
   - okul adresi (girişsiz) sayfayı temizlenmiş CSS ile verir;
   - fotoğraf: türü baytlarından denetlenir (uzantıya güvenilmez), 3 MB sınırı,
     konum/yorum bilgisi silinir, JPEG'in yönü korunur; kapak tektir, galeri en fazla 8;
   - başka okulun müdürü fotoğrafa dokunamaz. */
const { BASE, iste, girisYap, hesapAc, mudurYap } = require('./giris');

let gecti = 0, kaldi = 0;
function kontrol(ad, sart, detay) {
  if (sart) { gecti++; console.log('  GECTI  ' + ad); }
  else { kaldi++; console.log('  KALDI  ' + ad + (detay ? '  -> ' + detay : '')); }
}
const J = x => JSON.stringify(x).slice(0, 240);

/* Ham gövdeli yükleme (JSON değil, dosyanın kendisi). */
async function yukle(token, yer, veri, tur) {
  const h = { 'Content-Type': tur || 'image/png' };
  if (token) h.Authorization = 'Bearer ' + token;
  const r = await fetch(BASE + '/api/okul-sayfa/foto?yer=' + yer, { method: 'POST', headers: h, body: veri });
  let j = {};
  try { j = await r.json(); } catch (e) { j = {}; }
  return { status: r.status, body: j };
}

/* 1x1 PNG, araya bir yazı parçası (tEXt) eklenmiş: silinmeli. */
const PNG = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==', 'base64');
function pngYaziyla(yazi) {
  const veri = Buffer.from('Comment\0' + yazi, 'latin1');
  const parca = Buffer.alloc(12 + veri.length);
  parca.writeUInt32BE(veri.length, 0);
  parca.write('tEXt', 4, 'latin1');
  veri.copy(parca, 8);
  return Buffer.concat([PNG.subarray(0, 33), parca, PNG.subarray(33)]);
}

/* En küçük JPEG'in başına konum bilgisi taşıyan bir EXIF bölümü (yön = 6). */
const JPEG = Buffer.from('/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP//////////////////////////////////////////////////////////////////' +
  '////////////////////wgALCAABAAEBAREA/8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABPxA=', 'base64');
function jpegExifli(gizli) {
  const t = Buffer.alloc(26);
  t.write('II*\0', 0, 'latin1'); t.writeUInt32LE(8, 4); t.writeUInt16LE(1, 8);
  t.writeUInt16LE(0x0112, 10); t.writeUInt16LE(3, 12); t.writeUInt32LE(1, 14); t.writeUInt16LE(6, 18); t.writeUInt32LE(0, 22);
  const veri = Buffer.concat([Buffer.from('Exif\0\0', 'latin1'), t, Buffer.from(gizli, 'latin1')]);
  const bas = Buffer.from([0xff, 0xe1, 0, 0]);
  bas.writeUInt16BE(veri.length + 2, 2);
  return Buffer.concat([JPEG.subarray(0, 2), bas, veri, JPEG.subarray(2)]);
}

(async () => {
  const z = Date.now().toString(36);
  const A = (await girisYap('admin@egitimevi.com', 'admin123')).token;
  const M = (await girisYap('mudur@test.com', 'Test1234!')).token;
  const mat = await girisYap('mat@test.com', 'Test1234!');
  const fen = await girisYap('fen@test.com', 'Test1234!');

  console.log('=== 1) KIM DUZENLER ===');
  const ilk = await iste('/api/okul-sayfa', 'GET', null, M);
  kontrol('mudur duzenleme ekranini aciyor', ilk.status === 200 && !!ilk.body.okul.kisaAd && Array.isArray(ilk.body.fotolar), J(ilk.body));
  const kisa = ilk.body.okul.kisaAd;
  const ogretmenDener = await iste('/api/okul-sayfa', 'POST', { tanitim: 'x' }, mat.token);
  kontrol('yetkisiz ogretmen duzenleyemiyor', ogretmenDener.status === 403, 'status ' + ogretmenDener.status);
  const girissiz = await iste('/api/okul-sayfa', 'GET');
  kontrol('girissiz duzenleme ekrani yok', girissiz.status === 401, 'status ' + girissiz.status);

  const yetkiler = await iste('/api/school/permissions', 'GET', null, M);
  const sablon = (yetkiler.body.sablonlar || []).find(s => s.ad === 'Kodlayıcı');
  kontrol('Kodlayici sablonu var, yalnizca okul.sayfa ve okul.konum', !!sablon &&
    sablon.yetkiler.slice().sort().join(',') === 'okul.konum,okul.sayfa', J(sablon));
  const rol = await iste('/api/school/role', 'POST', { name: 'Kodlayıcı ' + z, permissions: ['okul.sayfa'] }, M);
  const ata = await iste('/api/school/role-assign', 'POST', { userId: mat.user.id, roleId: rol.body.role && rol.body.role.id }, M);
  kontrol('mudur Kodlayici rolunu ogretmene verdi', rol.status === 200 && ata.status === 200, J(ata.body));
  const kodlayici = await iste('/api/okul-sayfa', 'GET', null, mat.token);
  kontrol('Kodlayici rolundeki ogretmen duzenleme ekranini aciyor', kodlayici.status === 200, 'status ' + kodlayici.status);
  const fenDener = await iste('/api/okul-sayfa', 'GET', null, fen.token);
  kontrol('rolsuz ogretmen hala giremiyor', fenDener.status === 403, 'status ' + fenDener.status);

  console.log('=== 2) KAYDETME VE CSS TEMIZLIGI ===');
  const css = [
    '.os-baslik { color: #c0392b; font-size: 32px; position: fixed; z-index: 99999; }',
    '.os-kutu { background: url(https://kotu.example/iz.png); padding: 20px; }',
    '@import url(https://kotu.example/a.css);',
    '.auth-card { display: none; }',
    'body, .os-yer { display: none; }',
    '.os-baslik::after { content: "Şifreni buraya yaz"; }',
    '.os-tanitim { color: r\\65 d; }',
    '.os-foto:hover { opacity: .8; border-radius: 12px; }',
    '.os-galeri { margin-top: -900px; }',
    '.os-ust > .os-logo { width: 90px; transform: translate(0, 900px); }'
  ].join('\n');
  const kaydet = await iste('/api/okul-sayfa', 'POST', {
    tanitim: '<script>alert(1)</script>\n\nİkinci paragraf.',
    ayarlar: { renk: '#AABBCC', zemin: 'red; background:url(x)', baslikBoyu: 'buyuk', hiza: 'yan', galeriSutun: 4 },
    css
  }, mat.token);
  const tc = kaydet.body.temizCss || '';
  kontrol('kaydedildi', kaydet.status === 200, J(kaydet.body));
  kontrol('renk kucuk harfe dondu, bozuk zemin varsayilana dondu', kaydet.body.ayarlar && kaydet.body.ayarlar.renk === '#aabbcc' &&
    kaydet.body.ayarlar.zemin === '' && kaydet.body.ayarlar.baslikBoyu === 'buyuk' && kaydet.body.ayarlar.hiza === 'sol' &&
    kaydet.body.ayarlar.galeriSutun === '4', J(kaydet.body.ayarlar));
  kontrol('izinli kurallar kaldi ve sayfanin icine baglandi', /\.okul-sayfa \.os-baslik \{ color: #c0392b; font-size: 32px; \}/.test(tc) &&
    /\.okul-sayfa \.os-foto:hover \{ opacity: \.8; border-radius: 12px; \}/.test(tc), tc);
  kontrol('url, @import, position, z-index, transform, content yok', !/url|@import|position|z-index|transform|content|kotu/.test(tc), tc);
  kontrol('baska secici ve body yok', !/auth-card|body|os-yer/.test(tc), tc);
  kontrol('eksi bosluk ve ters bolu atildi', !/-900|\\/.test(tc), tc);
  kontrol('her kural .okul-sayfa ile basliyor', tc.split('\n').every(s => s.indexOf('.okul-sayfa ') === 0), tc);
  kontrol('atilan kisimlarin nedeni soylendi', (kaydet.body.uyarilar || []).length >= 6, J(kaydet.body.uyarilar));
  const cokUzun = await iste('/api/okul-sayfa', 'POST', { css: 'a'.repeat(8001) }, M);
  kontrol('8000 karakterden uzun CSS reddedildi', cokUzun.status === 400, 'status ' + cokUzun.status);
  const onizle = await iste('/api/okul-sayfa/onizle', 'POST', { css: '.os-baslik { color: blue; background: url(x) }' }, M);
  kontrol('onizleme kaydetmeden temizliyor', onizle.status === 200 && /color: blue/.test(onizle.body.css) && !/url/.test(onizle.body.css) &&
    onizle.body.uyarilar.length === 1, J(onizle.body));

  console.log('=== 3) HERKESE ACIK GORUNUM ===');
  const acik = await iste('/api/okul-adres?kisa=' + encodeURIComponent(kisa));
  const s = acik.body.sayfa || {};
  kontrol('okul adresi sayfayi veriyor (girissiz)', acik.status === 200 && !!acik.body.sayfa, J(acik.body));
  kontrol('disari yalnizca temizlenmis CSS gidiyor', s.css === tc, J(s.css));
  kontrol('tanitim duz metin olarak saklaniyor (cizerken kacirilir)', s.tanitim === '<script>alert(1)</script>\n\nİkinci paragraf.', J(s.tanitim));

  console.log('=== 4) FOTOGRAFLAR ===');
  const sahte = await yukle(M, 'kapak', Buffer.from('<html><script>alert(1)</script></html>'), 'image/png');
  kontrol('PNG diye gonderilen HTML reddedildi', sahte.status === 400, J(sahte.body));
  const svg = await yukle(M, 'kapak', Buffer.from('<svg xmlns="http://www.w3.org/2000/svg"><script>alert(1)</script></svg>'), 'image/svg+xml');
  kontrol('SVG reddedildi', svg.status === 400, J(svg.body));
  const buyuk = await yukle(M, 'galeri', Buffer.concat([PNG, Buffer.alloc(3 * 1024 * 1024)]), 'image/png');
  kontrol('3 MB ustu reddedildi', buyuk.status === 413, 'status ' + buyuk.status);
  const yersiz = await yukle(M, 'arka', PNG);
  kontrol('bilinmeyen yer reddedildi', yersiz.status === 400, J(yersiz.body));
  const girissizYukle = await yukle(null, 'kapak', PNG);
  kontrol('girissiz yukleme yok', girissizYukle.status === 401, 'status ' + girissizYukle.status);
  const fenYukle = await yukle(fen.token, 'kapak', PNG);
  kontrol('yetkisiz ogretmen yukleyemiyor', fenYukle.status === 403, 'status ' + fenYukle.status);

  const kapak1 = await yukle(M, 'kapak', pngYaziyla('GIZLI-KONUM-41.0082'));
  kontrol('PNG kapak yuklendi', kapak1.status === 200 && /^[0-9a-f]{32}$/.test(kapak1.body.foto && kapak1.body.foto.id), J(kapak1.body));
  const oku = await fetch(BASE + '/api/okul-foto/' + kapak1.body.foto.id);
  const okunan = Buffer.from(await oku.arrayBuffer());
  kontrol('fotograf girissiz aciliyor, turu dogru', oku.status === 200 && oku.headers.get('content-type') === 'image/png' &&
    oku.headers.get('x-content-type-options') === 'nosniff', oku.status + ' ' + oku.headers.get('content-type'));
  kontrol('PNG icindeki yazi (konum) silindi', okunan.indexOf('GIZLI-KONUM') < 0 && okunan.subarray(0, 8).equals(PNG.subarray(0, 8)) &&
    okunan.length === PNG.length, 'boyut ' + okunan.length);

  const jpeg = await yukle(M, 'logo', jpegExifli('GPS-GIZLI-KONUM'), 'image/jpeg');
  const jOku = Buffer.from(await (await fetch(BASE + '/api/okul-foto/' + jpeg.body.foto.id)).arrayBuffer());
  kontrol('JPEG yuklendi, EXIF konumu silindi', jpeg.status === 200 && jOku.indexOf('GPS-GIZLI') < 0, J(jpeg.body));
  kontrol('JPEG yonu (6) korundu', jOku.indexOf(Buffer.from([0x12, 0x01, 0x03, 0x00, 0x01, 0x00, 0x00, 0x00, 0x06, 0x00])) > 0, jOku.subarray(0, 40).toString('hex'));

  const kapak2 = await yukle(M, 'kapak', PNG);
  const sonra = await iste('/api/okul-sayfa', 'GET', null, M);
  const kapaklar = (sonra.body.fotolar || []).filter(f => f.yer === 'kapak');
  kontrol('kapak tek: yenisi eskisinin yerini aldi', kapak2.status === 200 && kapaklar.length === 1 && kapaklar[0].id === kapak2.body.foto.id, J(kapaklar));
  const eskiKapak = await fetch(BASE + '/api/okul-foto/' + kapak1.body.foto.id);
  kontrol('eski kapak artik acilmiyor', eskiKapak.status === 404, 'status ' + eskiKapak.status);

  let galeriSon = null;
  for (let i = 0; i < 8; i++) galeriSon = await yukle(M, 'galeri', PNG);
  const dokuzuncu = await yukle(M, 'galeri', PNG);
  kontrol('galeriye 8 fotograf, 9. reddedildi', galeriSon.status === 200 && dokuzuncu.status === 400, galeriSon.status + ' ' + J(dokuzuncu.body));
  const aciklama = await iste('/api/okul-sayfa/foto-aciklama', 'POST', { id: galeriSon.body.foto.id, aciklama: 'Bilim fuarı' }, M);
  kontrol('fotografa aciklama yazildi', aciklama.status === 200);

  const acik2 = await iste('/api/okul-adres?kisa=' + encodeURIComponent(kisa));
  kontrol('okul adresi fotograflari veriyor (kapak, logo, 8 galeri)', (acik2.body.sayfa.fotolar || []).length === 10 &&
    acik2.body.sayfa.fotolar[0].yer === 'kapak' && acik2.body.sayfa.fotolar.some(f => f.aciklama === 'Bilim fuarı'), J(acik2.body.sayfa.fotolar));

  console.log('=== 5) BASKA OKUL ===');
  await hesapAc({ fullName: 'Sayfa Mudur', username: 'sayfa.mudur' + z, email: 'sayfamudur' + z + '@test.com' });
  const M2 = (await mudurYap('sayfa.mudur' + z, 'Test1234!', { schoolName: 'Sayfa Okulu ' + z, city: 'Ankara', district: 'Mamak' }, A)).token;
  const yabanciSil = await iste('/api/okul-sayfa/foto-sil', 'POST', { id: galeriSon.body.foto.id }, M2);
  const yabanciAciklama = await iste('/api/okul-sayfa/foto-aciklama', 'POST', { id: galeriSon.body.foto.id, aciklama: 'ele gecti' }, M2);
  kontrol('baska okulun muduru fotografa dokunamiyor', yabanciSil.status === 404 && yabanciAciklama.status === 404,
    yabanciSil.status + ' ' + yabanciAciklama.status);
  const kendi = await iste('/api/okul-sayfa', 'GET', null, M2);
  kontrol('ikinci okulun sayfasi bos ve ayri', kendi.status === 200 && kendi.body.fotolar.length === 0 && kendi.body.tanitim === '', J(kendi.body));
  const sil = await iste('/api/okul-sayfa/foto-sil', 'POST', { id: galeriSon.body.foto.id }, M);
  const silindi = await fetch(BASE + '/api/okul-foto/' + galeriSon.body.foto.id);
  kontrol('kendi muduru siliyor, dosya artik acilmiyor', sil.status === 200 && silindi.status === 404, sil.status + ' ' + silindi.status);
  const bozukId = await fetch(BASE + '/api/okul-foto/..%2F..%2Fayarlar.json');
  kontrol('bozuk fotograf kimligi 404', bozukId.status === 404, 'status ' + bozukId.status);

  console.log('=== 6) ISLEM KAYDI ===');
  const kayit = await iste('/api/islem-kaydi', 'GET', null, M);
  const satirlar = (kayit.body.kayitlar || kayit.body.islemler || kayit.body.items || []).map(x => x.islem || x.tur || '');
  kontrol('sayfa degisiklikleri islem kaydinda', satirlar.some(x => /okul-sayfa/.test(x)), J(satirlar.slice(0, 8)));

  console.log();
  console.log('  GECTI: ' + gecti + '   KALDI: ' + kaldi);
  process.exit(kaldi ? 1 : 0);
})().catch(e => { console.error('TEST HATASI:', e.message, e.stack); process.exit(1); });
