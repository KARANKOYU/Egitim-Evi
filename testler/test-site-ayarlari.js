/* Yönetim paneli > Site ayarları (/api/admin/site-ayarlari) ve okul adresleri:
   - öncelik: veritabanı > data/config.yml > varsayılan (sunucu içinden, geçici config.yml ile);
   - iletişim, yapımcılar, Play Store, bildirim yoklama aralığı, çevrimiçi sayma süresi, admins.json
     okuma aralığı: kaydetme, doğrulama ve hata alanları, "sıfırla";
   - değişiklik sunucu yeniden başlamadan /api/site, /api/me, /api/uygulama'da görünür;
   - çevrimiçi sayma süresi yoklama aralığından kısa olamaz (en az yoklama + 1 dk);
   - işlem kaydına okulsuz yazılır (müdür görmez);
   - okul adresi değiştirme: doğrulama, eski adres hemen "Okul bulunamadı", müdüre bildirim,
     müdürün kendi değiştirmesi aynen çalışır;
   - yönetici olmayana uçlar bilinmeyen adres gibi 404. Yalnız test veritabanında (_test) çalışır. */
const fs = require('fs');
const path = require('path');
const { iste, girisYap, hesapAc, mudurYap } = require('./giris');

let gecti = 0, kaldi = 0;
function kontrol(ad, sart, detay) {
  if (sart) { gecti++; console.log('  GECTI  ' + ad); }
  else { kaldi++; console.log('  KALDI  ' + ad + (detay ? '  -> ' + detay : '')); }
}
const J = x => JSON.stringify(x).slice(0, 300);

/* Sunucu içinden öncelik denetimi: config.yml'i olan ayrı bir veri klasörü
   (veritabanı bağlantısı testdata/ayarlar.json'dan). */
const DENEME = path.join(__dirname, 'testdata', 'site-ayar-deneme');
function testDeposu() {
  fs.mkdirSync(DENEME, { recursive: true });
  fs.copyFileSync(path.join(__dirname, 'testdata', 'ayarlar.json'), path.join(DENEME, 'ayarlar.json'));
  fs.writeFileSync(path.join(DENEME, 'config.yml'), [
    'iletisim:', '  eposta: "dosya@egitimevi.org"', '  telefon: "0312 123 45 67"',
    'uygulama:', '  playstore: "https://play.google.com/store/apps/details?id=org.dosya"',
    'araliklar:', '  bildirim_dk: 7', '  cevrimici_dk: 12', '  admins_dk: 99   # sınır dışı: yok sayılır', ''
  ].join('\n'), 'utf8');
  process.env.EE_DATA = DENEME;
  require('../sunucu/ayarlar').ayarlariYukle();
  const baglanti = require('../sunucu/veri/baglanti');
  if (!/_test$/.test(baglanti.veritabaniAdi() || '')) return null;
  return { baglanti, veri: require('../sunucu/veri'), site: require('../sunucu/site') };
}

(async () => {
  const d = testDeposu();
  if (!d) { console.log('  KALDI  test veritabanı değil (adı _test ile bitmeli)'); process.exit(1); }
  const A = (await girisYap('admin@egitimevi.com', 'admin123')).token;
  const M = (await girisYap('mudur@test.com', 'Test1234!')).token;
  const O = (await girisYap('mat@test.com', 'Test1234!')).token;
  const kaydet = (anahtar, deger, tok) => iste('/api/admin/site-ayarlari', 'POST', { anahtar, deger }, tok || A);
  const sifirla = anahtar => iste('/api/admin/site-ayarlari', 'POST', { anahtar, sifirla: true }, A);

  console.log('=== 1) ÖNCELİK: VERİTABANI > config.yml > VARSAYILAN ===');
  const { depo } = d.veri;
  await depo.siteAyarlari.yukle();
  const k0 = d.site.ayarKaynakli('iletisim');
  kontrol('veritabanında yokken config.yml okunuyor', k0.kaynak === 'config' && k0.deger.eposta === 'dosya@egitimevi.org' &&
    k0.deger.telefon === '0312 123 45 67', J(k0));
  kontrol('config.yml aralıkları okunuyor, sınır dışı olan yok sayılıyor', d.site.ayar('bildirimAralikDk') === 7 &&
    d.site.ayar('cevrimiciDk') === 12 && d.site.ayarKaynakli('adminsAralikDk').kaynak === 'varsayilan' && d.site.ayar('adminsAralikDk') === 1,
    [d.site.ayar('bildirimAralikDk'), d.site.ayar('cevrimiciDk'), d.site.ayar('adminsAralikDk')].join(','));
  kontrol('Play Store config.yml\'den', d.site.ayar('playStore') === 'https://play.google.com/store/apps/details?id=org.dosya');
  kontrol('yapımcılar veritabanında yokken yapimcilar.json\'dan', d.site.ayarKaynakli('yapimcilar').kaynak === 'dosya');
  await depo.siteAyarlari.yaz('iletisim', { eposta: 'db@egitimevi.org', telefon: '' }, { id: null, fullName: 'Deneme' });
  await depo.siteAyarlari.yaz('bildirimAralikDk', 3, { id: null, fullName: 'Deneme' });
  const k1 = d.site.ayarKaynakli('iletisim');
  kontrol('veritabanındaki değer config.yml\'i geçiyor', k1.kaynak === 'veritabani' && k1.deger.eposta === 'db@egitimevi.org' &&
    k1.deger.telefon === '' && k1.guncelleyen === 'Deneme', J(k1));
  kontrol('çevrimiçi süresi yoklama aralığından uzun olduğunda olduğu gibi', d.site.cevrimiciEtkinDk() === 12, d.site.cevrimiciEtkinDk());
  await depo.siteAyarlari.sil('iletisim');
  await depo.siteAyarlari.sil('bildirimAralikDk');
  kontrol('veritabanındaki silinince config.yml\'e dönüyor', d.site.ayarKaynakli('iletisim').kaynak === 'config' &&
    d.site.ayar('bildirimAralikDk') === 7);

  console.log('=== 2) VARSAYILANLAR (SUNUCU) ===');
  const g0 = await iste('/api/admin/site-ayarlari', 'GET', null, A);
  const a0 = g0.body.ayarlar || {};
  kontrol('ayarlar geliyor', g0.status === 200 && !!a0.iletisim && !!a0.yapimcilar && !!a0.playStore && !!a0.bildirimAralikDk &&
    !!a0.cevrimiciDk && !!a0.adminsAralikDk, g0.status + ' ' + J(g0.body));
  kontrol('aralık varsayılanları 5, 5, 1 ve sınırları', a0.bildirimAralikDk.deger === 5 && a0.bildirimAralikDk.en === 1 &&
    a0.bildirimAralikDk.cok === 30 && a0.cevrimiciDk.deger === 5 && a0.cevrimiciDk.cok === 60 && a0.adminsAralikDk.deger === 1 &&
    a0.adminsAralikDk.cok === 60 && a0.bildirimAralikDk.kaynak === 'varsayilan', J(a0.bildirimAralikDk));
  kontrol('çevrimiçi süresi yoklama + 1 dk kullanılıyor; varsayılanlarla uyarı kutusu yok, notta söyleniyor', a0.cevrimiciDk.etkin === 6 &&
    a0.cevrimiciDk.uyari === '' && /Kullanılan: 6 dakika/.test(a0.cevrimiciDk.not) && /5 dakika/.test(a0.cevrimiciDk.not), J(a0.cevrimiciDk));
  kontrol('yapımcılar dosyadan', a0.yapimcilar.kaynak === 'dosya' && Array.isArray(a0.yapimcilar.deger));

  console.log('=== 3) İLETİŞİM ===');
  const i1 = await kaydet('iletisim', { eposta: ' iletisim@egitimevi.org ', telefon: '+90 (312) 555 12 34' });
  kontrol('iletişim kaydedildi', i1.status === 200 && i1.body.ayarlar.iletisim.kaynak === 'veritabani' &&
    i1.body.ayarlar.iletisim.deger.eposta === 'iletisim@egitimevi.org' && i1.body.ayarlar.iletisim.guncelleyen === 'Sistem Yöneticisi',
    i1.status + ' ' + J(i1.body));
  const site1 = await iste('/api/site');
  kontrol('/api/site hemen yeni iletişimi veriyor', site1.body.iletisim.eposta === 'iletisim@egitimevi.org' &&
    site1.body.iletisim.telefon === '+90 (312) 555 12 34', J(site1.body.iletisim));
  const iBoz = await kaydet('iletisim', { eposta: 'bozuk-adres', telefon: '' });
  kontrol('bozuk e-posta: 400, alan eposta', iBoz.status === 400 && iBoz.body.alan === 'eposta', J(iBoz.body));
  const iTr = await kaydet('iletisim', { eposta: 'ayşe@örnek.com', telefon: '' });
  const siteTr = await iste('/api/site');
  kontrol('Türkçe harfli e-posta hesaplardaki gibi reddediliyor (400, alan eposta), yazılmadı', iTr.status === 400 &&
    iTr.body.alan === 'eposta' && /Türkçe/.test(iTr.body.error) && siteTr.body.iletisim.eposta === 'iletisim@egitimevi.org', J(iTr.body));
  const iTel = await kaydet('iletisim', { eposta: '', telefon: 'ara beni' });
  kontrol('harfli telefon: 400, alan telefon', iTel.status === 400 && iTel.body.alan === 'telefon', J(iTel.body));
  const iKisa = await kaydet('iletisim', { eposta: '', telefon: '0532 12' });
  kontrol('eksik haneli telefon: 400, alan telefon (telefonSorunu)', iKisa.status === 400 && iKisa.body.alan === 'telefon' &&
    /10 haneli/.test(iKisa.body.error), J(iKisa.body));
  const iNesne = await kaydet('iletisim', 'metin');
  kontrol('iletişim nesne değilse 400', iNesne.status === 400, J(iNesne.body));
  const iBos = await kaydet('iletisim', { eposta: '', telefon: '' });
  const site2 = await iste('/api/site');
  kontrol('ikisi de boş olabilir (veritabanındaki boş değer config.yml\'i de gizler)', iBos.status === 200 &&
    site2.body.iletisim.eposta === '' && site2.body.iletisim.telefon === '' && iBos.body.ayarlar.iletisim.kaynak === 'veritabani');
  const iAyni = await kaydet('iletisim', { eposta: '', telefon: '' });
  kontrol('aynı değer yeniden kaydedilince "zaten böyle"', iAyni.status === 200 && /zaten/.test(iAyni.body.message), J(iAyni.body.message));

  console.log('=== 4) YAPIMCILAR ===');
  const liste = [{ ad: 'Ayşe Yılmaz', github: 'ayse-y', katki: 'Arayüz' }, { ad: 'Mehmet Kaya', github: '', katki: '' },
    { ad: 'KARANKOYU', github: 'KARANKOYU', katki: 'Proje sahibi' }];
  const y1 = await kaydet('yapimcilar', liste);
  const site3 = await iste('/api/site');
  kontrol('yapımcılar kaydedildi ve /api/site sırasıyla veriyor', y1.status === 200 && J(site3.body.yapimcilar) === J(liste),
    J(site3.body.yapimcilar));
  const y2 = await kaydet('yapimcilar', [liste[2], liste[0], liste[1]]);
  const site4 = await iste('/api/site');
  kontrol('sıralama değişti', y2.status === 200 && site4.body.yapimcilar[0].ad === 'KARANKOYU' && site4.body.yapimcilar[2].ad === 'Mehmet Kaya');
  const yGit = await kaydet('yapimcilar', [liste[0], { ad: 'Kötü', github: '-kotu-ad-' }]);
  kontrol('bozuk GitHub adı: alan yapimcilar, sira 1, altAlan github', yGit.status === 400 && yGit.body.alan === 'yapimcilar' &&
    yGit.body.sira === 1 && yGit.body.altAlan === 'github', J(yGit.body));
  const yAd = await kaydet('yapimcilar', [{ ad: '   ', github: 'x' }]);
  kontrol('adsız yapımcı: altAlan ad', yAd.status === 400 && yAd.body.sira === 0 && yAd.body.altAlan === 'ad', J(yAd.body));
  const yUzun = await kaydet('yapimcilar', [{ ad: 'a'.repeat(61) }]);
  kontrol('61 karakterli ad reddediliyor', yUzun.status === 400 && yUzun.body.altAlan === 'ad', J(yUzun.body));
  const yKatki = await kaydet('yapimcilar', [{ ad: 'Katkılı', katki: 'k'.repeat(81) }]);
  kontrol('81 karakterli katkı reddediliyor', yKatki.status === 400 && yKatki.body.altAlan === 'katki', J(yKatki.body));
  const yCok = await kaydet('yapimcilar', Array.from({ length: 51 }, (_, i) => ({ ad: 'Kişi ' + i })));
  kontrol('51 yapımcı reddediliyor (en çok 50)', yCok.status === 400 && yCok.body.alan === 'yapimcilar' && /50/.test(yCok.body.error), J(yCok.body));
  const yElli = await kaydet('yapimcilar', Array.from({ length: 50 }, (_, i) => ({ ad: 'Kişi ' + i })));
  kontrol('50 yapımcı kabul', yElli.status === 200 && yElli.body.ayarlar.yapimcilar.deger.length === 50);
  const yDizi = await kaydet('yapimcilar', { ad: 'tek' });
  kontrol('liste değilse 400', yDizi.status === 400 && yDizi.body.alan === 'yapimcilar');
  const ySif = await sifirla('yapimcilar');
  const site5 = await iste('/api/site');
  kontrol('sıfırlayınca yapimcilar.json\'a dönüyor', ySif.status === 200 && ySif.body.ayarlar.yapimcilar.kaynak === 'dosya' &&
    site5.body.yapimcilar.some(y => y.github === 'KARANKOYU'), J(site5.body.yapimcilar));

  console.log('=== 5) PLAY STORE ===');
  const ps = 'https://play.google.com/store/apps/details?id=org.egitimevi.aile';
  const p1 = await kaydet('playStore', ps);
  const u1 = await iste('/api/uygulama');
  kontrol('Play Store bağlantısı kaydedildi, /api/uygulama veriyor', p1.status === 200 && u1.body.playStore === ps, J(u1.body.playStore));
  const siteOnbellek = (await iste('/api/site')).headers.get('cache-control');
  kontrol('/api/site ve /api/uygulama tarayıcıda saklanmıyor (değişiklik sayfa yenilenince hemen görünür)',
    siteOnbellek === 'no-store' && u1.headers.get('cache-control') === 'no-store', siteOnbellek + ' / ' + u1.headers.get('cache-control'));
  const pHttp = await kaydet('playStore', 'http://play.google.com/store/apps/details?id=x');
  const pBaska = await kaydet('playStore', 'https://play.google.com.kotu.site/x');
  const pDis = await kaydet('playStore', 'https://ornek.com/store');
  kontrol('https://play.google.com/ dışı reddediliyor (alan playStore)', pHttp.status === 400 && pBaska.status === 400 &&
    pDis.status === 400 && pHttp.body.alan === 'playStore', [pHttp.status, pBaska.status, pDis.status].join(','));
  const pBos = await kaydet('playStore', '');
  const u2 = await iste('/api/uygulama');
  kontrol('boş bırakılabilir', pBos.status === 200 && u2.body.playStore === '');

  console.log('=== 6) ARALIKLAR ===');
  const b10 = await kaydet('bildirimAralikDk', 10);
  const me = await iste('/api/me', 'GET', null, O);
  const site6 = await iste('/api/site');
  kontrol('bildirim yoklama aralığı /api/me ve /api/site\'da', b10.status === 200 && me.body.bildirimAralikDk === 10 &&
    site6.body.bildirimAralikDk === 10, me.body.bildirimAralikDk + ' ' + site6.body.bildirimAralikDk);
  kontrol('çevrimiçi sayma süresi yoklama + 1 = 11 dk (süre varsayılan: not, uyarı kutusu yok)', site6.body.cevrimiciDk === 11 &&
    b10.body.ayarlar.cevrimiciDk.etkin === 11 && b10.body.ayarlar.cevrimiciDk.uyari === '' &&
    /Kullanılan: 11 dakika/.test(b10.body.ayarlar.cevrimiciDk.not) && /10 dakika/.test(b10.body.ayarlar.cevrimiciDk.not),
    J(b10.body.ayarlar.cevrimiciDk));
  const c3 = await kaydet('cevrimiciDk', 3);
  kontrol('kaydedilen süre (3) yoklama aralığından kısa: uyarı kutusu kaydedileni ve kullanılanı söylüyor', c3.status === 200 &&
    c3.body.ayarlar.cevrimiciDk.etkin === 11 && /Kaydettiğin 3 dakika/.test(c3.body.ayarlar.cevrimiciDk.uyari) &&
    /11 dakika/.test(c3.body.ayarlar.cevrimiciDk.uyari), J(c3.body.ayarlar && c3.body.ayarlar.cevrimiciDk));
  const c20 = await kaydet('cevrimiciDk', '20');
  const site7 = await iste('/api/site');
  kontrol('çevrimiçi sayma süresi 20 (metin olarak gelen tam sayı da kabul)', c20.status === 200 && site7.body.cevrimiciDk === 20 &&
    c20.body.ayarlar.cevrimiciDk.uyari === '' && c20.body.ayarlar.cevrimiciDk.not === '', J(c20.body.ayarlar && c20.body.ayarlar.cevrimiciDk));
  const kotuler = [['bildirimAralikDk', 0], ['bildirimAralikDk', 31], ['bildirimAralikDk', 2.5], ['bildirimAralikDk', 'abc'],
    ['cevrimiciDk', 61], ['cevrimiciDk', -1], ['adminsAralikDk', 0], ['adminsAralikDk', 61], ['adminsAralikDk', null]];
  const gecen = [];
  for (const [k, v] of kotuler) {
    const r = await kaydet(k, v);
    if (r.status !== 400 || r.body.alan !== k) gecen.push(k + '=' + J(v) + ' ' + r.status);
  }
  kontrol('sınır dışı ve tam sayı olmayan aralıklar reddediliyor (alan = ayar adı)', !gecen.length, gecen.join(', '));
  const a60 = await kaydet('adminsAralikDk', 60);
  const dosya = await iste('/api/admin/yonetici-dosyasi', 'GET', null, A);
  kontrol('admins.json okuma aralığı 60 dk, yönetici dosyası kartında görünüyor', a60.status === 200 && dosya.body.aralikDk === 60,
    J(dosya.body.aralikDk));
  const a1 = await kaydet('adminsAralikDk', 1);
  kontrol('admins.json okuma aralığı 1 dk', a1.status === 200 && a1.body.ayarlar.adminsAralikDk.deger === 1);

  console.log('=== 7) HATALI İSTEK, SIFIRLAMA ===');
  const yok = await kaydet('boyleBirAyar', 1);
  kontrol('bilinmeyen ayar: 400, alan anahtar', yok.status === 400 && yok.body.alan === 'anahtar', J(yok.body));
  const degersiz = await iste('/api/admin/site-ayarlari', 'POST', { anahtar: 'playStore' }, A);
  kontrol('değer yoksa 400', degersiz.status === 400, J(degersiz.body));
  for (const k of ['iletisim', 'playStore', 'bildirimAralikDk', 'cevrimiciDk', 'adminsAralikDk']) await sifirla(k);
  const g1 = await iste('/api/admin/site-ayarlari', 'GET', null, A);
  const kaynaklar = ['iletisim', 'playStore', 'bildirimAralikDk', 'cevrimiciDk', 'adminsAralikDk'].map(k => g1.body.ayarlar[k].kaynak);
  kontrol('sıfırlanınca varsayılana dönüyor (test sunucusunda config.yml yok)', kaynaklar.every(k => k === 'varsayilan') &&
    g1.body.ayarlar.bildirimAralikDk.deger === 5, kaynaklar.join(','));
  const me2 = await iste('/api/me', 'GET', null, O);
  kontrol('/api/me yeniden 5 dk', me2.body.bildirimAralikDk === 5);
  /* Varsayılanla aynı değer panelden kaydedilince: "1 → 1 dk" değil, "sabitlendi". */
  const sabit = await kaydet('adminsAralikDk', 1);
  const sabitKayit = ((await iste('/api/islem-kaydi?islem=site.aralik', 'GET', null, A)).body.kayitlar || [])
    .filter(k => /admins\.json okuma aralığı/.test(k.detay)).map(k => k.detay);
  kontrol('varsayılanla aynı değer kaydedilince: kaynak panel, iletide "değer aynı", işlem kaydında "sabitlendi" (1 → 1 yok)',
    sabit.status === 200 && sabit.body.ayarlar.adminsAralikDk.kaynak === 'veritabani' && /değer aynı/.test(sabit.body.message) &&
    sabitKayit.some(d => /: 1 dk \(varsayılan değeri panelden sabitlendi\)$/.test(d)) && !sabitKayit.some(d => /1 → 1/.test(d)),
    J([sabit.body.message, sabitKayit.slice(0, 3)]));
  await sifirla('adminsAralikDk');

  console.log('=== 8) İŞLEM KAYDI (OKULSUZ) ===');
  const ik = await iste('/api/islem-kaydi', 'GET', null, A);
  const turler = (ik.body.turler || []).map(t => t.k);
  kontrol('ayar değişiklikleri yöneticinin işlem kaydında', ['site.iletisim', 'site.yapimcilar', 'site.playstore', 'site.aralik']
    .every(t => turler.indexOf(t) >= 0), turler.join(','));
  const aralikKaydi = (ik.body.kayitlar || []).find(k => k.islem === 'site.aralik' && /Bildirim yoklama aralığı: 5 → 10 dk/.test(k.detay));
  kontrol('aralık kaydında eski ve yeni değer', !!aralikKaydi, J((ik.body.kayitlar || []).filter(k => k.islem === 'site.aralik').map(k => k.detay)));
  const ikM = await iste('/api/islem-kaydi', 'GET', null, M);
  kontrol('müdür site ayarı kayıtlarını görmüyor', ikM.status === 200 && !(ikM.body.kayitlar || []).some(k => /^site\./.test(k.islem)),
    J((ikM.body.turler || []).map(t => t.k)));

  console.log('=== 9) OKUL ADRESLERİ ===');
  const ol = await iste('/api/admin/okul-adresleri', 'GET', null, A);
  const okul = (ol.body.okullar || []).find(o => o.kisaAd === 'test-ortaokulu');
  kontrol('okul adresleri listesi', ol.status === 200 && !!okul && okul.adres === '/school/test-ortaokulu' && okul.ad === 'Test Ortaokulu',
    J(ol.body));
  const once = await fetch(process.env.EE_BASE + '/school/test-ortaokulu');
  kontrol('eski adres değişiklikten önce açık (önbelleğe girdi)', once.status === 200);
  const z = Date.now().toString(36).slice(-5);
  const yeniAd = 'yeni-test-okulu-' + z;
  const deg = await iste('/api/admin/okul-adres', 'POST', { okulId: okul.id, kisaAd: yeniAd }, A);
  kontrol('yönetici okulun adresini değiştirdi, eski adres uyarısı', deg.status === 200 && deg.body.okul.kisaAd === yeniAd &&
    deg.body.eskiKisaAd === 'test-ortaokulu' && /artık açılmıyor/.test(deg.body.message), J(deg.body));
  const eski = await fetch(process.env.EE_BASE + '/school/test-ortaokulu');
  const eskiMetin = await eski.text();
  const yeniA = await fetch(process.env.EE_BASE + '/school/' + yeniAd);
  kontrol('eski adres HEMEN "Okul bulunamadı" (önbellek boşaldı)', eski.status === 404 && /bulunamad/i.test(eskiMetin), eski.status);
  kontrol('yeni adres açılıyor', yeniA.status === 200);
  const okulBilgi = await iste('/api/okul-adres?kisa=' + yeniAd);
  kontrol('okul yeni adresiyle bulunuyor', okulBilgi.status === 200 && okulBilgi.body.okul && okulBilgi.body.okul.kisaAd === yeniAd, J(okulBilgi.body));
  const bil = await iste('/api/notifications', 'GET', null, M);
  kontrol('müdüre bildirim gitti', (bil.body.notifications || []).some(n => /sistem yöneticisi tarafından değiştirildi/.test(n.metin || n.text || n.message || JSON.stringify(n))),
    J((bil.body.notifications || []).slice(0, 2)));
  const yasak = await iste('/api/admin/okul-adres', 'POST', { okulId: okul.id, kisaAd: 'admin' }, A);
  const bosluk = await iste('/api/admin/okul-adres', 'POST', { okulId: okul.id, kisaAd: 'a b' }, A);
  const kisaAd = await iste('/api/admin/okul-adres', 'POST', { okulId: okul.id, kisaAd: 'ab' }, A);
  kontrol('kısa ad kuralları (yasak ad, boşluk, kısa): 400 alan kisaAd', [yasak, bosluk, kisaAd].every(r => r.status === 400 && r.body.alan === 'kisaAd'),
    [yasak, bosluk, kisaAd].map(r => r.status + ' ' + r.body.alan).join(', '));
  /* Adresin kendi öneki (/school/) de ayrılmış: /school/school olmasın. */
  const onekler = await Promise.all(['school', 'SCHOOL', 'schools'].map(ad => iste('/api/admin/okul-adres', 'POST', { okulId: okul.id, kisaAd: ad }, A)));
  kontrol('"school" ve "schools" ayrılmış ad: 400 alan kisaAd', onekler.every(r => r.status === 400 && r.body.alan === 'kisaAd' &&
    /sitenin kendi/.test(r.body.error)), onekler.map(r => r.status + ' ' + J(r.body)).join(', '));
  /* İkinci okul: kişi kodunu veren yetişkini yönetici müdür yapar (okul-ac). */
  const md2 = 'adresmudur' + z;
  await hesapAc({ fullName: 'Adres Müdürü', username: md2, email: md2 + '@test.com', password: 'Test1234!' });
  await mudurYap(md2 + '@test.com', 'Test1234!', { schoolName: 'Adres Deneme Okulu ' + z, city: 'Ankara', district: 'Mamak',
    kisaAd: 'adres-deneme-' + z }, A);
  const alinmis = await iste('/api/admin/okul-adres', 'POST', { okulId: okul.id, kisaAd: 'adres-deneme-' + z }, A);
  kontrol('başka okulun adresi alınamıyor: 400 alan kisaAd', alinmis.status === 400 && alinmis.body.alan === 'kisaAd' &&
    /başka bir okulda/.test(alinmis.body.error), J(alinmis.body));
  const okulYok = await iste('/api/admin/okul-adres', 'POST', { okulId: 'yok-boyle', kisaAd: 'baska-bir-ad' }, A);
  kontrol('olmayan okul: 404 alan okulId', okulYok.status === 404 && okulYok.body.alan === 'okulId', J(okulYok.body));
  const ayni = await iste('/api/admin/okul-adres', 'POST', { okulId: okul.id, kisaAd: yeniAd }, A);
  kontrol('aynı adres: değişiklik yok', ayni.status === 200 && /zaten/.test(ayni.body.message));
  const kayitOkul = await iste('/api/islem-kaydi?islem=okul.adres-yonetici', 'GET', null, A);
  kontrol('adres değişikliği işlem kaydında', (kayitOkul.body.kayitlar || []).some(k => k.detay.indexOf(yeniAd) >= 0), J(kayitOkul.body.kayitlar));
  /* Müdürün kendi değiştirmesi aynen çalışır; eski (yöneticinin verdiği) adres de hemen kapanır. */
  const mudurDeg = await iste('/api/school/adres', 'POST', { kisaAd: 'test-ortaokulu' }, M);
  const geriYeni = await fetch(process.env.EE_BASE + '/school/' + yeniAd);
  const geriEski = await fetch(process.env.EE_BASE + '/school/test-ortaokulu');
  kontrol('müdür adresi kendisi geri aldı; önbellek yine boşaldı', mudurDeg.status === 200 && geriYeni.status === 404 && geriEski.status === 200,
    mudurDeg.status + ' ' + geriYeni.status + ' ' + geriEski.status);

  console.log('=== 10) YÖNETİCİ OLMAYANA UÇ YOK ===');
  const ayri = [];
  for (const [ad, tok] of [['giriş yok', null], ['müdür', M], ['öğretmen', O]]) {
    for (const [yontem, yol, govde] of [['GET', '/api/admin/site-ayarlari'], ['POST', '/api/admin/site-ayarlari', { anahtar: 'iletisim', deger: {} }],
      ['GET', '/api/admin/okul-adresleri'], ['POST', '/api/admin/okul-adres', { okulId: okul.id, kisaAd: 'ele-gecir' }]]) {
      const [a, b] = await Promise.all([iste(yol, yontem, govde || null, tok), iste('/api/boyle-bir-uc-yok', yontem, govde || null, tok)]);
      if (a.status !== 404 || JSON.stringify(a.body) !== JSON.stringify(b.body)) ayri.push(ad + ' ' + yontem + ' ' + yol + ' ' + a.status);
    }
  }
  kontrol('site ayarı ve okul adresi uçları yönetici olmayana bilinmeyen adres gibi 404', !ayri.length, ayri.join(' | '));
  const sonra = await iste('/api/okul-adres?kisa=ele-gecir');
  kontrol('yönetici olmayanın isteği adresi değiştirmedi', sonra.status !== 200 || !sonra.body.okul, J(sonra.body));

  try { fs.rmSync(DENEME, { recursive: true, force: true }); } catch (e) { /* önemsiz */ }
  await d.baglanti.kapat();
  console.log();
  console.log('  GECTI: ' + gecti + '   KALDI: ' + kaldi);
  process.exit(kaldi ? 1 : 0);
})().catch(e => { console.error('TEST HATASI:', e.message, e.stack); process.exit(1); });
