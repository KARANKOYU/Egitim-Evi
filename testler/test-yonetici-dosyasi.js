/* Yönetici hesapları dosyası (data/admins.json -> sunucu/yonetici-dosyasi.js):
   - dosyadaki yönetici açılır, ilk girişte şifresini değiştirmesi istenir;
   - şifre yazılmadıysa üretilir; kullanıcı adı yazılmadıysa e-postadan türetilir;
   - var olan yöneticiye dokunulmaz (dosya şifre sıfırlama yolu değildir);
   - başka (yönetici olmayan) hesabın e-postası ya da kullanıcı adı yönetici YAPILMAZ;
   - zayıf şifre, bozuk e-posta, eksik ya da tek harfli ad, tekrarlanan satır atlanır; nedenler
     doğal Türkçe ("şifre en az 8 karakter olmalı"), bozuk JSON iletisi Türkçe ve satırlı;
   - kart dosyanın şu anki hâlini (var/yok) ve son okumadan sonra değiştiğini söyler;
   - bozuk JSON sunucuyu düşürmez; dosya yoksa hiçbir şey olmaz;
   - işlem kaydına yazılır;
   - şifresini değiştirmemiş yönetici /admin çerezi almaz, değiştirince alır;
   - canlı okuma: sunucu çalışırken yazılan data/admins.json "Şimdi oku" ile hemen
     uygulanır, kart son okumayı şifresiz gösterir; değişme zamanı/boyutu yoklaması
     değişmeyen dosyayı yeniden okumaz, değişeni okur; aralıkla yoklama (zamanla)
     yeni satırı kendiliğinden açar. Yalnız test veritabanında (_test) çalışır. */
const fs = require('fs');
const path = require('path');
const { iste, girisYap } = require('./giris');

let gecti = 0, kaldi = 0;
function kontrol(ad, sart, detay) {
  if (sart) { gecti++; console.log('  GECTI  ' + ad); }
  else { kaldi++; console.log('  KALDI  ' + ad + (detay ? '  -> ' + detay : '')); }
}
const J = x => JSON.stringify(x).slice(0, 260);

function testDeposu() {
  process.env.EE_DATA = path.join(__dirname, 'testdata');
  require('../sunucu/ayarlar').ayarlariYukle();
  const baglanti = require('../sunucu/veri/baglanti');
  if (!/_test$/.test(baglanti.veritabaniAdi() || '')) return null;
  return {
    baglanti,
    kullanicilar: require('../sunucu/veri/depo/kullanicilar'),
    genel: require('../sunucu/veri/depo/genel')
  };
}

(async () => {
  const depo = testDeposu();
  if (!depo) { console.log('  KALDI  test veritabanı değil (adı _test ile bitmeli)'); process.exit(1); }
  const yd = require('../sunucu/yonetici-dosyasi');
  const z = Date.now().toString(36);
  const dosya = path.join(__dirname, 'testdata', 'admins-deneme-' + z + '.json');
  const yaz = v => fs.writeFileSync(dosya, typeof v === 'string' ? v : JSON.stringify(v), 'utf8');
  const URETILEN = 'Uretilen-Sifre-9!';
  const uygula = () => yd.uygula(depo, { dosya, sifreUret: () => URETILEN });

  console.log('=== 1) DOSYA YOK / BOZUK ===');
  const yok = await uygula();
  kontrol('dosya yoksa hiçbir şey yapılmıyor', yok.dosyaVar === false && !yok.hata && !yok.eklenen.length, J(yok));
  yaz('{ "yoneticiler": [ { "ad": "Eksik" ');
  const bozuk = await uygula();
  kontrol('bozuk JSON: hata söyleniyor, atılmıyor', bozuk.dosyaVar && /JSON/.test(bozuk.hata) && !bozuk.eklenen.length, J(bozuk));
  kontrol('bozuk JSON iletisi Türkçe (ayrıştırıcının İngilizce iletisi panele gitmiyor)',
    !/Unexpected|Expected|position|token|input/i.test(bozuk.hata) && /virgül|yarıda/.test(bozuk.hata), bozuk.hata);
  yaz('{\n  "yoneticiler": [\n    { "ad": "Virgülsüz" "eposta": "a@b.com" }\n  ]\n}');
  const satirli = await uygula();
  kontrol('bozuk JSON: hatanın dosyadaki satırı söyleniyor', /dosyanın 3\. satırı/.test(satirli.hata), satirli.hata);
  yaz('   ');
  const bos = await uygula();
  kontrol('boş dosya: "dosya boş"', bos.hata === 'dosya boş', bos.hata);
  yaz({ baska: [] });
  const listesiz = await uygula();
  kontrol('yoneticiler listesi yoksa hata', /yoneticiler/.test(listesiz.hata), J(listesiz));
  yaz({ yoneticiler: Array.from({ length: 51 }, (_, i) => ({ ad: 'Çok ' + i, eposta: 'cok' + i + z + '@test.com' })) });
  const cok = await uygula();
  kontrol('50\'den fazla satır reddediliyor', /en fazla/.test(cok.hata) && !cok.eklenen.length, J(cok));

  console.log('=== 2) AÇMA VE ATLAMA ===');
  const e1 = 'yon1' + z + '@test.com', e2 = 'yon2' + z + '@test.com';
  const mat = await depo.kullanicilar.epostayla('mat@test.com');
  yaz({ yoneticiler: [
    { ad: 'Deneme Yönetici', eposta: e1.toUpperCase(), kullaniciAdi: 'yon1' + z, sifre: 'Guclu-Sifre-1!' },
    { ad: 'ikinci yönetici', eposta: e2 },
    { ad: 'Zaten', eposta: 'admin@egitimevi.com' },
    { ad: 'Öğretmen', eposta: 'mat@test.com', sifre: 'Guclu-Sifre-1!' },
    { ad: 'Zayıf', eposta: 'yon3' + z + '@test.com', sifre: 'abc12345' },
    { ad: '', eposta: 'yon4' + z + '@test.com' },
    { ad: 'Kötü E-posta', eposta: 'bozuk-adres' },
    { ad: 'Tekrar', eposta: e1 },
    { ad: 'Alınmış Ad', eposta: 'yon5' + z + '@test.com', kullaniciAdi: 'admin' },
    { ad: 'Kötü Ad', eposta: 'yon6' + z + '@test.com', kullaniciAdi: 'çağla' },
    'metin satırı',
    { ad: 'x', eposta: 'yon7' + z + '@test.com' },
    { ad: 'Kısa Şifre', eposta: 'yon8' + z + '@test.com', sifre: 'Ab1!' }
  ] });
  const s = await uygula();
  kontrol('iki yönetici açıldı', s.eklenen.length === 2 && s.eklenen[0].eposta === e1 && s.eklenen[1].eposta === e2, J(s.eklenen));
  kontrol('dosyadaki şifre sonuçta hiç görünmüyor, yalnız üretilen', s.eklenen[0].uretilenSifre === '' &&
    s.eklenen[1].uretilenSifre === URETILEN && J(s).indexOf('Guclu-Sifre-1!') < 0, J(s.eklenen));
  kontrol('kullanıcı adı verilmeyince e-postadan türetildi', s.eklenen[1].kullaniciAdi === 'yon2' + z, J(s.eklenen[1]));
  const neden = e => (s.atlanan.find(a => a.eposta === e) || {}).neden || '';
  kontrol('var olan yönetici atlandı', /zaten yönetici/.test(neden('admin@egitimevi.com')), J(s.atlanan));
  kontrol('öğretmenin e-postası yönetici YAPILMADI', /yönetici olmayan/.test(neden('mat@test.com')), neden('mat@test.com'));
  const matSonra = await depo.kullanicilar.epostayla('mat@test.com');
  kontrol('öğretmen hesabı aynen duruyor (rol ve şifre)', matSonra && matSonra.role === mat.role && matSonra.pass === mat.pass,
    matSonra && matSonra.role);
  kontrol('zayıf şifre atlandı', /şifre/.test(neden('yon3' + z + '@test.com')), neden('yon3' + z + '@test.com'));
  kontrol('adı olmayan satır atlandı', /ad yazılmamış/.test(neden('yon4' + z + '@test.com')));
  kontrol('bozuk e-posta atlandı', s.atlanan.some(a => /geçerli bir e-posta/.test(a.neden)));
  kontrol('aynı e-posta ikinci kez atlandı', s.atlanan.some(a => a.eposta === e1 && /iki kez/.test(a.neden)), J(s.atlanan));
  kontrol('başka hesabın kullanıcı adı alınmadı', /başka bir hesapta/.test(neden('yon5' + z + '@test.com')));
  kontrol('geçersiz kullanıcı adı atlandı', /kullanıcı adı/.test(neden('yon6' + z + '@test.com')));
  kontrol('nesne olmayan satır atlandı', s.atlanan.some(a => /nesne değil/.test(a.neden)));
  kontrol('tek harfli ad: "ad en az 2 harf olmalı" (ad yazılmamış değil)', neden('yon7' + z + '@test.com') === 'ad en az 2 harf olmalı',
    neden('yon7' + z + '@test.com'));
  const kisaNeden = neden('yon8' + z + '@test.com'), zayifNeden = neden('yon3' + z + '@test.com');
  kontrol('şifre nedeni doğal: "şifre" bir kez geçiyor, kuralın iletisi olduğu gibi', kisaNeden === 'şifre en az 8 karakter olmalı' &&
    /^şifrede bir büyük harf/.test(zayifNeden) && (zayifNeden.match(/şifre/gi) || []).length === 1, kisaNeden + ' | ' + zayifNeden);
  const adNeden = neden('yon6' + z + '@test.com');
  kontrol('kullanıcı adı nedeni doğal ("kullanıcı adı: Kullanıcı adında" değil)', /^kullanıcı adında Türkçe harf/.test(adNeden) &&
    (adNeden.match(/kullanıcı ad/gi) || []).length === 1, adNeden);

  const y1 = await depo.kullanicilar.epostayla(e1);
  kontrol('açılan hesap onaylı yönetici, ilk girişte şifre değişecek', y1 && y1.role === 'admin' && y1.status === 'approved' &&
    y1.sifreDegismeli === true && !y1.schoolId, J(y1 && { role: y1.role, status: y1.status, sd: y1.sifreDegismeli }));

  console.log('=== 3) GİRİŞ ===');
  const g1 = await girisYap(e1, 'Guclu-Sifre-1!');
  kontrol('dosyadaki şifreyle iki adımlı giriş; şifre değiştirmesi isteniyor', g1.token && g1.user && g1.user.role === 'admin' &&
    g1.user.sifreDegismeli === true, J(g1.user));
  const g2 = await girisYap(e2, URETILEN);
  kontrol('üretilen şifreyle giriş', g2.token && g2.user && g2.user.role === 'admin', J(g2.user));
  kontrol('şifresini değiştirmemiş yönetici /admin adresini ve çerezini almıyor', g1.yonetimAdresi === undefined &&
    g2.yonetimAdresi === undefined, String(g1.yonetimAdresi) + ' ' + String(g2.yonetimAdresi));
  const sd2 = await iste('/api/password', 'POST', { old: URETILEN, new: 'Kendi-Sifresi-7!' }, g2.token);
  kontrol('şifresini değiştirince /admin çerezi ve adresi geliyor', sd2.status === 200 && sd2.body.yonetimAdresi === '/admin' &&
    /ee_yonetim=[a-f0-9]{64}/.test(sd2.headers.get('set-cookie') || ''), sd2.status + ' ' + J(sd2.body));

  console.log('=== 4) İKİNCİ OKUMA: VAR OLANA DOKUNULMAZ ===');
  yaz({ yoneticiler: [{ ad: 'Deneme Yönetici', eposta: e1, sifre: 'Baska-Sifre-2!' }] });
  const t = await uygula();
  kontrol('ikinci okumada yeni hesap açılmadı', t.eklenen.length === 0 && /zaten yönetici/.test((t.atlanan[0] || {}).neden), J(t));
  let eskiGecer = false, yeniGecer = false;
  try { eskiGecer = !!(await girisYap(e1, 'Guclu-Sifre-1!')).token; } catch (e) { eskiGecer = false; }
  try { yeniGecer = !!(await girisYap(e1, 'Baska-Sifre-2!')).token; } catch (e) { yeniGecer = false; }
  kontrol('dosyadaki şifre değişse de hesabın şifresi değişmedi', eskiGecer && !yeniGecer, 'eski ' + eskiGecer + ', yeni ' + yeniGecer);

  console.log('=== 5) İŞLEM KAYDI ===');
  const A = (await girisYap('admin@egitimevi.com', 'admin123')).token;
  const kayit = await iste('/api/islem-kaydi?islem=yonetici.eklendi', 'GET', null, A);
  kontrol('yönetici açılışı işlem kaydında', kayit.status === 200 && (kayit.body.kayitlar || []).some(k => (k.detay || '').indexOf(e1) >= 0),
    J(kayit.body.kayitlar));

  console.log('=== 6) CANLI OKUMA: SUNUCU ÇALIŞIRKEN "ŞİMDİ OKU" ===');
  /* Test sunucusu EE_DATA=testler/testdata ile açılır: onun data/admins.json'u budur. */
  const sunucuDosyasi = path.join(__dirname, 'testdata', 'admins.json');
  const e5 = 'canli' + z + '@test.com', e6 = 'canli2' + z + '@test.com', DOSYA_SIFRE = 'Canli-Sifre-5!';
  fs.writeFileSync(sunucuDosyasi, JSON.stringify({ yoneticiler: [
    { ad: 'Canlı Yönetici', eposta: e5, sifre: DOSYA_SIFRE },
    { ad: 'Üretilen Canlı', eposta: e6 },
    { ad: 'Zayıf Canlı', eposta: 'canli3' + z + '@test.com', sifre: 'zayif' }
  ] }), 'utf8');
  const oku = await iste('/api/admin/yonetici-dosyasi/oku', 'POST', {}, A);
  const metin = JSON.stringify(oku.body);
  /* Aralık yoklaması (1 dk) "Şimdi oku"dan hemen önce davranmış olabilir: o zaman satır "zaten yönetici" görünür. */
  const acilmis = e => (oku.body.eklenen || []).some(x => x.eposta === e) ||
    (oku.body.atlanan || []).some(x => x.eposta === e && /zaten yönetici/.test(x.neden));
  kontrol('"Şimdi oku" dosyayı hemen uyguladı', oku.status === 200 && oku.body.dosyaVar === true && acilmis(e5) && acilmis(e6) &&
    !!oku.body.sonOkuma, oku.status + ' ' + metin.slice(0, 300));
  kontrol('atlanan satır nedeniyle görünüyor', (oku.body.atlanan || []).some(x => /şifre/.test(x.neden)), metin.slice(0, 300));
  kontrol('cevapta hiçbir şifre yok (dosyadaki de üretilen de)', metin.indexOf(DOSYA_SIFRE) < 0 && metin.indexOf('uretilenSifre') < 0 &&
    metin.indexOf('"sifre"') < 0 && metin.indexOf('zayif') < 0);
  const kart = await iste('/api/admin/yonetici-dosyasi', 'GET', null, A);
  kontrol('kart son okumayı veriyor (dosya adı, zamanlar, aralık)', kart.status === 200 && kart.body.dosya === 'data/admins.json' &&
    kart.body.sonOkuma === oku.body.sonOkuma && !!kart.body.dosyaDegisme && kart.body.aralikDk === 1 &&
    JSON.stringify(kart.body).indexOf(DOSYA_SIFRE) < 0, J(kart.body));
  const gc = await girisYap(e5, DOSYA_SIFRE);
  kontrol('sunucu çalışırken açılan yönetici giriyor (şifre değiştirmesi isteniyor)', gc.token && gc.user.role === 'admin' &&
    gc.user.sifreDegismeli === true, J(gc.user));
  const okuKaydi = await iste('/api/islem-kaydi?islem=yonetici.dosya-okundu', 'GET', null, A);
  kontrol('"Şimdi oku" işlem kaydında', (okuKaydi.body.kayitlar || []).length >= 1, J(okuKaydi.body.kayitlar));
  const ogretmen = (await girisYap('mat@test.com', 'Test1234!')).token;
  const [ogrKart, bilinmeyen] = await Promise.all([iste('/api/admin/yonetici-dosyasi', 'GET', null, ogretmen),
    iste('/api/boyle-bir-uc-yok', 'GET', null, ogretmen)]);
  const [ogrOku, bilinmeyenPost] = await Promise.all([iste('/api/admin/yonetici-dosyasi/oku', 'POST', {}, ogretmen),
    iste('/api/boyle-bir-uc-yok', 'POST', {}, ogretmen)]);
  kontrol('öğretmen kartı ve "Şimdi oku"yu göremiyor (bilinmeyen adres gibi 404)', ogrKart.status === 404 && ogrOku.status === 404 &&
    J(ogrKart.body) === J(bilinmeyen.body) && J(ogrOku.body) === J(bilinmeyenPost.body), ogrKart.status + ' ' + ogrOku.status);
  fs.unlinkSync(sunucuDosyasi);
  const yokOku = await iste('/api/admin/yonetici-dosyasi/oku', 'POST', {}, A);
  kontrol('dosya silinince: "dosya yok", açılan yönetici yerinde', yokOku.status === 200 && yokOku.body.dosyaVar === false &&
    !!(await depo.kullanicilar.epostayla(e5)), J(yokOku.body));

  console.log('=== 7) DEĞİŞME ZAMANI/BOYUT YOKLAMASI VE ARALIK ===');
  const izlenen = path.join(__dirname, 'testdata', 'admins-izlenen-' + z + '.json');
  const e7 = 'izlenen' + z + '@test.com', e8 = 'aralik' + z + '@test.com';
  fs.writeFileSync(izlenen, JSON.stringify({ yoneticiler: [{ ad: 'İzlenen Yönetici', eposta: e7, sifre: 'Izlenen-Sifre-7!' }] }), 'utf8');
  const secenek = { dosya: izlenen, sifreUret: () => URETILEN, sessiz: true };
  const ilk = await yd.denetle(depo, secenek);
  kontrol('ilk yoklamada dosya okunuyor', ilk && ilk.eklenen.length === 1 && ilk.eklenen[0].eposta === e7, J(ilk));
  const ikinci = await yd.denetle(depo, secenek);
  kontrol('değişmeyen dosya yeniden okunmuyor', ikinci === null, J(ikinci));
  kontrol('kart: okunduktan sonra değişmeyen dosya "okunmadan değişti" demiyor', yd.gorunum(izlenen).okunmadanDegisti === false &&
    yd.gorunum(izlenen).simdiVar === true, J(yd.gorunum(izlenen)));
  fs.writeFileSync(izlenen, JSON.stringify({ yoneticiler: [{ ad: 'İzlenen Yönetici', eposta: e7, sifre: 'Izlenen-Sifre-7!' }] }, null, 2), 'utf8');
  const arada = yd.gorunum(izlenen);
  kontrol('kart: son okumadan sonra değişen dosya için "okunmadan değişti" (sonuç son okumanın)', arada.okunmadanDegisti === true &&
    arada.simdiVar === true && arada.dosyaVar === true && arada.eklenen.length === 1, J(arada));
  const ucuncu = await yd.denetle(depo, secenek);
  kontrol('okununca "okunmadan değişti" kalkıyor', yd.gorunum(izlenen).okunmadanDegisti === false);
  /* Dosya yokken okunmuş, sonra yazılmış: kart "dosya yok" ile "son değişiklik" bilgisini yan yana vermez. */
  const sonradan = path.join(__dirname, 'testdata', 'admins-sonradan-' + z + '.json');
  await yd.oku(depo, { dosya: sonradan, sessiz: true });
  const yokken = yd.gorunum(sonradan);
  fs.writeFileSync(sonradan, JSON.stringify({ yoneticiler: [] }), 'utf8');
  const yazilinca = yd.gorunum(sonradan);
  kontrol('kart: dosya yokken okundu, sonra yazıldı -> şu an var, okunmadan değişti (son okuma "yok" diyor)',
    yokken.simdiVar === false && yokken.okunmadanDegisti === false && yazilinca.simdiVar === true && yazilinca.dosyaVar === false &&
    yazilinca.okunmadanDegisti === true && !!yazilinca.dosyaDegisme, J([yokken, yazilinca]));
  try { fs.unlinkSync(sonradan); } catch (e) { /* önemsiz */ }
  kontrol('değişen dosya yeniden okunuyor (var olana dokunulmuyor)', ucuncu && ucuncu.eklenen.length === 0 &&
    /zaten yönetici/.test((ucuncu.atlanan[0] || {}).neden), J(ucuncu));
  kontrol('görünümde şifre yok', JSON.stringify(yd.gorunum(izlenen)).indexOf('Izlenen-Sifre-7!') < 0 &&
    JSON.stringify(yd.gorunum(izlenen)).indexOf(URETILEN) < 0);
  /* Aralıkla yoklama: 1 saniyelik aralıkla, dosyaya yeni satır yazılınca kendiliğinden açılır. */
  yd.zamanla(depo, Object.assign({ aralikMs: () => 1000 }, secenek));
  fs.writeFileSync(izlenen, JSON.stringify({ yoneticiler: [{ ad: 'İzlenen Yönetici', eposta: e7 },
    { ad: 'Aralıkla Açılan', eposta: e8, sifre: 'Aralik-Sifre-8!' }] }), 'utf8');
  let aralikla = null;
  for (let i = 0; i < 40 && !aralikla; i++) {
    await new Promise(r => setTimeout(r, 250));
    aralikla = await depo.kullanicilar.epostayla(e8);
  }
  kontrol('aralıkla yoklama yeni satırı kendiliğinden açtı', aralikla && aralikla.role === 'admin', J(aralikla && aralikla.role));
  kontrol('kart son okumayı gösteriyor', yd.gorunum(izlenen).eklenen.some(x => x.eposta === e8));
  try { fs.unlinkSync(izlenen); } catch (e) { /* önemsiz */ }

  try { fs.unlinkSync(dosya); } catch (e) { /* önemsiz */ }
  await depo.baglanti.kapat();
  console.log();
  console.log('  GECTI: ' + gecti + '   KALDI: ' + kaldi);
  process.exit(kaldi ? 1 : 0);
})().catch(e => { console.error('TEST HATASI:', e.message, e.stack); process.exit(1); });
