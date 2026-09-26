/* Kişisel hatırlatıcılar:
   - öğrenci, öğretmen, müdür, veli ve rolsüz yetişkin kendine kurar;
   - bir kez / her gün / haftanın günleri / ayda bir; sonraki hatırlatma anı döner;
   - başlık, saat, gün, geçmiş zaman denetimleri;
   - başkasınınkini göremez, değiştiremez, silemez;
   - durdur / başlat, düzenle, sil; en fazla 50. */
const { iste, girisYap, hesapAc } = require('./giris');

let gecti = 0, kaldi = 0;
function kontrol(ad, sart, detay) {
  if (sart) { gecti++; console.log('  GECTI  ' + ad); }
  else { kaldi++; console.log('  KALDI  ' + ad + (detay ? '  -> ' + detay : '')); }
}
const J = x => JSON.stringify(x).slice(0, 220);
/* Türkiye'de yarının tarihi */
const yarin = () => new Date(Date.now() + 3 * 3600e3 + 86400e3).toISOString().slice(0, 10);

(async () => {
  const z = Date.now().toString(36);
  const o1 = (await girisYap('ogrenci1@test.com', 'Test1234!')).token;
  const o2 = (await girisYap('ogrenci2@test.com', 'Test1234!')).token;
  const mat = (await girisYap('mat@test.com', 'Test1234!')).token;
  const M = (await girisYap('mudur@test.com', 'Test1234!')).token;

  console.log('=== 1) KURMA ===');
  const bos = await iste('/api/hatirlaticilar', 'GET', null, o1);
  kontrol('öğrencinin listesi açılıyor', bos.status === 200 && Array.isArray(bos.body.hatirlaticilar) && bos.body.sinir === 50, J(bos.body));
  const haftalik = await iste('/api/hatirlaticilar', 'POST', { baslik: 'Beden eğitimi kıyafeti', aciklama: 'Eşofman ve spor ayakkabı',
    siklik: 'her-hafta', gunler: [1, 3], saat: '07:30' }, o1);
  kontrol('haftalık (Pzt, Çar 07:30) kuruldu, sonraki anı var', haftalik.status === 200 && J(haftalik.body.hatirlatici.gunler) === '[1,3]' &&
    !!haftalik.body.hatirlatici.sonraki, J(haftalik.body));
  const sonrakiGun = new Date(Date.parse(haftalik.body.hatirlatici.sonraki) + 3 * 3600e3).getUTCDay();
  kontrol('sonraki hatırlatma pazartesi ya da çarşamba 07:30 (Türkiye)', (sonrakiGun === 1 || sonrakiGun === 3) &&
    new Date(Date.parse(haftalik.body.hatirlatici.sonraki) + 3 * 3600e3).toISOString().slice(11, 16) === '07:30', haftalik.body.hatirlatici.sonraki);
  const birKez = await iste('/api/hatirlaticilar', 'POST', { baslik: 'Kütüphane kitabını iade et', siklik: 'bir-kez', tarih: yarin(), saat: '15:00' }, o1);
  kontrol('bir kezlik (yarın 15:00) kuruldu', birKez.status === 200 && birKez.body.hatirlatici.tarih === yarin(), J(birKez.body));
  const gunluk = await iste('/api/hatirlaticilar', 'POST', { baslik: 'Kitap oku', siklik: 'her-gun', saat: '21:00' }, o1);
  const aylik = await iste('/api/hatirlaticilar', 'POST', { baslik: 'Aidat', siklik: 'her-ay', ayGunu: 31, saat: '09:00' }, o1);
  kontrol('her gün ve ayda bir (31i) kuruldu', gunluk.status === 200 && aylik.status === 200 && aylik.body.hatirlatici.ayGunu === 31, J(aylik.body));
  const ogrt = await iste('/api/hatirlaticilar', 'POST', { baslik: 'Sınav kâğıtlarını oku', siklik: 'her-hafta', gunler: [5], saat: '16:00' }, mat);
  const mdr = await iste('/api/hatirlaticilar', 'POST', { baslik: 'Veli toplantısı hazırlığı', siklik: 'bir-kez', tarih: yarin(), saat: '10:00' }, M);
  kontrol('öğretmen ve müdür de kurabiliyor', ogrt.status === 200 && mdr.status === 200, J(ogrt.body) + J(mdr.body));
  const vK = 'hveli' + z;
  await hesapAc({ fullName: 'Hatırlatıcı Veli', username: vK, email: vK + '@test.com' });
  const V = (await girisYap(vK, 'Test1234!')).token;
  const veli = await iste('/api/hatirlaticilar', 'POST', { baslik: 'Okul servisi ücreti', siklik: 'her-ay', ayGunu: 1, saat: '10:00' }, V);
  kontrol('rolsüz yetişkin (veli olmadan önce) de kurabiliyor', veli.status === 200, J(veli.body));

  console.log('=== 2) DENETİMLER ===');
  const basliksiz = await iste('/api/hatirlaticilar', 'POST', { baslik: ' ', siklik: 'her-gun', saat: '08:00' }, o1);
  kontrol('başlıksız reddedildi', basliksiz.status === 400, J(basliksiz.body));
  const gunsuz = await iste('/api/hatirlaticilar', 'POST', { baslik: 'x', siklik: 'her-hafta', gunler: [], saat: '08:00' }, o1);
  kontrol('haftalıkta gün seçilmeden reddedildi', gunsuz.status === 400 && /gün/.test(gunsuz.body.error || ''), J(gunsuz.body));
  const kotuGun = await iste('/api/hatirlaticilar', 'POST', { baslik: 'x', siklik: 'her-hafta', gunler: [8, 0, 'a'], saat: '08:00' }, o1);
  kontrol('geçersiz gün (8, 0) reddedildi', kotuGun.status === 400, J(kotuGun.body));
  const kotuSaat = await iste('/api/hatirlaticilar', 'POST', { baslik: 'x', siklik: 'her-gun', saat: '25:61' }, o1);
  kontrol('geçersiz saat reddedildi', kotuSaat.status === 400, J(kotuSaat.body));
  const gecmis = await iste('/api/hatirlaticilar', 'POST', { baslik: 'x', siklik: 'bir-kez', tarih: '2020-01-01', saat: '08:00' }, o1);
  kontrol('geçmiş gün reddedildi', gecmis.status === 400 && /geçti/.test(gecmis.body.error || ''), J(gecmis.body));
  const ay32 = await iste('/api/hatirlaticilar', 'POST', { baslik: 'x', siklik: 'her-ay', ayGunu: 32, saat: '08:00' }, o1);
  kontrol('ayın 32si reddedildi', ay32.status === 400, J(ay32.body));
  const nesne = await iste('/api/hatirlaticilar', 'POST', { baslik: { a: 1 }, siklik: 'her-gun', saat: '08:00' }, o1);
  kontrol('başlık yerine nesne 500 değil 400', nesne.status === 400, 'status ' + nesne.status);

  console.log('=== 3) YALNIZCA SAHİBİ ===');
  const liste = await iste('/api/hatirlaticilar', 'GET', null, o1);
  kontrol('öğrenci kendi 4 hatırlatıcısını görüyor', liste.body.hatirlaticilar.length === 4, J(liste.body.hatirlaticilar.map(h => h.baslik)));
  const baskasi = await iste('/api/hatirlaticilar', 'GET', null, o2);
  kontrol('başka öğrenci göremiyor', !baskasi.body.hatirlaticilar.some(h => h.baslik === 'Kitap oku'), J(baskasi.body));
  const hid = haftalik.body.hatirlatici.id;
  const baskaDuzelt = await iste('/api/hatirlaticilar/' + hid, 'POST', { baslik: 'ele geçirdim', siklik: 'her-gun', saat: '08:00' }, o2);
  const baskaSil = await iste('/api/hatirlaticilar/' + hid + '/sil', 'POST', {}, o2);
  const ogretmenSil = await iste('/api/hatirlaticilar/' + hid + '/sil', 'POST', {}, mat);
  kontrol('başkası (öğretmen dahil) düzeltemiyor, silemiyor', baskaDuzelt.status === 404 && baskaSil.status === 404 && ogretmenSil.status === 404,
    baskaDuzelt.status + ' ' + baskaSil.status + ' ' + ogretmenSil.status);

  console.log('=== 4) DÜZENLE, DURDUR, SİL ===');
  const duzelt = await iste('/api/hatirlaticilar/' + hid, 'POST', { baslik: 'Beden eğitimi', aciklama: '', siklik: 'her-hafta', gunler: [2, 4], saat: '07:45' }, o1);
  kontrol('düzenlendi (Sal, Per 07:45)', duzelt.status === 200 && J(duzelt.body.hatirlatici.gunler) === '[2,4]' && duzelt.body.hatirlatici.saat === '07:45',
    J(duzelt.body));
  const dur = await iste('/api/hatirlaticilar/' + hid + '/durum', 'POST', { aktif: false }, o1);
  kontrol('durduruldu, sonraki anı yok', dur.status === 200 && dur.body.hatirlatici.aktif === false && !dur.body.hatirlatici.sonraki, J(dur.body));
  const basla = await iste('/api/hatirlaticilar/' + hid + '/durum', 'POST', { aktif: true }, o1);
  kontrol('yeniden başladı', basla.status === 200 && basla.body.hatirlatici.aktif === true && !!basla.body.hatirlatici.sonraki, J(basla.body));
  const sil = await iste('/api/hatirlaticilar/' + gunluk.body.hatirlatici.id + '/sil', 'POST', {}, o1);
  const sonra = await iste('/api/hatirlaticilar', 'GET', null, o1);
  kontrol('silindi', sil.status === 200 && sonra.body.hatirlaticilar.length === 3, 'adet ' + sonra.body.hatirlaticilar.length);

  console.log('=== 5) SINIR ===');
  let son = null;
  for (let i = 0; i < 49; i++) son = await iste('/api/hatirlaticilar', 'POST', { baslik: 'Deneme ' + i, siklik: 'her-gun', saat: '06:00' }, o2);
  const fazla = await iste('/api/hatirlaticilar', 'POST', { baslik: 'Fazla', siklik: 'her-gun', saat: '06:00' }, o2);
  const fazla2 = await iste('/api/hatirlaticilar', 'POST', { baslik: 'Fazla 2', siklik: 'her-gun', saat: '06:00' }, o2);
  kontrol('kişi başına en fazla 50', son.status === 200 && fazla.status === 200 && fazla2.status === 400 && /50/.test(fazla2.body.error || ''),
    son.status + ' ' + fazla.status + ' ' + J(fazla2.body));

  console.log();
  console.log('  GECTI: ' + gecti + '   KALDI: ' + kaldi);
  process.exit(kaldi ? 1 : 0);
})().catch(e => { console.error('TEST HATASI:', e.message, e.stack); process.exit(1); });
