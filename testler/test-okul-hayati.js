/* Yemek listesi, servis, kulüpler:
   - okuldaki herkes yemek listesini görür, yalnızca yetkili düzenler;
   - servis bilgisi (şoför telefonu) yalnızca o servisteki öğrenciye, velisine
     ve yönetime gider; başka okul servisine öğrenci yazılamaz;
   - kulüp kontenjanı aynı anda gelen isteklerde de aşılmaz; başvuru kapalıyken
     öğrenci katılamaz/ayrılamaz; üye listesini yalnızca yönetim ve danışman görür;
   - özel rol yetkileri (yemek.yonet, kulup.yonet) öğretmene bu işleri açar. */
const { iste, girisYap, hesapAc, mudurYap } = require('./giris');

let gecti = 0, kaldi = 0;
function kontrol(ad, sart, detay) {
  if (sart) { gecti++; console.log('  GECTI  ' + ad); }
  else { kaldi++; console.log('  KALDI  ' + ad + (detay ? '  -> ' + detay : '')); }
}
const J = x => JSON.stringify(x).slice(0, 180);

/* Bu haftanın pazartesisi (sunucunun hesabıyla aynı). */
function pazartesi(n) {
  const d = new Date(new Date().toISOString().slice(0, 10) + 'T12:00:00Z');
  d.setUTCDate(d.getUTCDate() - (d.getUTCDay() + 6) % 7 + (n || 0));
  return d.toISOString().slice(0, 10);
}

(async () => {
  const z = Date.now();
  const M = (await girisYap('mudur@test.com', 'Test1234!')).token;
  const A = (await girisYap('admin@egitimevi.com', 'admin123')).token;
  const o1 = await girisYap('ogrenci1', 'Test1234!');
  const o2 = await girisYap('ogrenci2', 'Test1234!');
  const mat = await girisYap('mat', 'Test1234!');
  const fen = await girisYap('fen', 'Test1234!');

  const vK = 'hayatveli' + z;
  await hesapAc({ fullName: 'Hayat Veli', username: vK, email: vK + '@test.com' });
  const veli = await girisYap(vK, 'Test1234!');
  const kod = (await iste('/api/me', 'GET', null, o1.token)).body.user.code;
  await iste('/api/parent/link', 'POST', { code: kod }, veli.token);

  await hesapAc({ fullName: 'Hayat Mudur', username: 'hayat.mudur' + z, email: 'hayatmudur' + z + '@test.com' });
  const M2 = (await mudurYap('hayat.mudur' + z, 'Test1234!', { schoolName: 'Hayat Okulu ' + z, city: 'Ankara', district: 'Mamak' }, A)).token;

  console.log('=== 1) YEMEK LİSTESİ ===');
  const pzt = pazartesi(), sal = pazartesi(1);
  const ilk = await iste('/api/yemek', 'GET', null, o1.token);
  kontrol('öğrenci kendi okulunun listesini alıyor, düzenleyemiyor', ilk.status === 200 && ilk.body.okullar.length === 1 &&
    ilk.body.duzenleyebilir === false && ilk.body.bas === pzt, J(ilk.body));
  const ogrYazar = await iste('/api/yemek', 'POST', { gunler: [{ tarih: pzt, menu: 'Çorba' }] }, o1.token);
  const ogrtYazar = await iste('/api/yemek', 'POST', { gunler: [{ tarih: pzt, menu: 'Çorba' }] }, mat.token);
  kontrol('öğrenci ve yetkisiz öğretmen yazamıyor', ogrYazar.status === 403 && ogrtYazar.status === 403,
    ogrYazar.status + ' ' + ogrtYazar.status);
  const yaz = await iste('/api/yemek', 'POST', { gunler: [
    { tarih: pzt, menu: 'Mercimek çorbası\n\n  Tavuk sote \nPilav\n', kalori: '650' }, { tarih: sal, menu: 'Makarna' }] }, M);
  kontrol('müdür haftayı yazdı', yaz.status === 200, J(yaz.body));
  const gor = await iste('/api/yemek?bas=' + sal, 'GET', null, o1.token);
  const gunler = gor.body.okullar[0].gunler;
  kontrol('boş satırlar atıldı, kalori kaydedildi, hafta pazartesiden başlıyor', gor.body.bas === pzt && gunler.length === 2 &&
    gunler[0].menu === 'Mercimek çorbası\nTavuk sote\nPilav' && gunler[0].kalori === 650, J(gunler));
  const veliGor = await iste('/api/yemek', 'GET', null, veli.token);
  kontrol('veli çocuğunun okulunun menüsünü görüyor', veliGor.status === 200 && veliGor.body.okullar.length === 1 &&
    veliGor.body.okullar[0].gunler.length === 2 && veliGor.body.duzenleyebilir === false, J(veliGor.body));
  const baskaOkul = await iste('/api/yemek', 'GET', null, M2);
  kontrol('başka okul bizim menümüzü görmüyor', baskaOkul.status === 200 && baskaOkul.body.okullar[0].gunler.length === 0);
  await iste('/api/yemek', 'POST', { gunler: [{ tarih: sal, menu: '' }] }, M);
  const silindi = await iste('/api/yemek', 'GET', null, o1.token);
  kontrol('boş menü o günü sildi', silindi.body.okullar[0].gunler.length === 1);
  const bozuk = await iste('/api/yemek', 'POST', { gunler: [{ tarih: '2026-13-45', menu: 'x' }] }, M);
  const cok = await iste('/api/yemek', 'POST', { gunler: Array.from({ length: 32 }, (_, i) => ({ tarih: pazartesi(i), menu: 'x' })) }, M);
  kontrol('bozuk tarih ve 31 günden fazlası reddedildi', bozuk.status === 400 && cok.status === 400, bozuk.status + ' ' + cok.status);

  /* Özel rol: yemek.yonet + kulup.yonet verilen öğretmen */
  const rol = await iste('/api/school/role', 'POST', { name: 'Okul hayatı ' + z, permissions: ['yemek.yonet', 'kulup.yonet'] }, M);
  kontrol('yeni yetkiler rolde kaydedildi', rol.status === 200 && rol.body.role.permissions.length === 2, J(rol.body));
  await iste('/api/school/role-assign', 'POST', { userId: fen.user.id, roleId: rol.body.role.id }, M);
  const fenYazar = await iste('/api/yemek', 'POST', { gunler: [{ tarih: sal, menu: 'Kuru fasulye' }] }, fen.token);
  kontrol('yemek yetkisi verilen öğretmen yazabiliyor', fenYazar.status === 200, J(fenYazar.body));

  console.log('=== 2) SERVİS ===');
  const bos = await iste('/api/servis', 'GET', null, o1.token);
  kontrol('öğrencinin servisi yok, yönetim listesi gelmiyor', bos.status === 200 && bos.body.benim === null && !bos.body.servisler);
  const ogrServis = await iste('/api/servis/kaydet', 'POST', { ad: 'Kaçak' }, o1.token);
  const matServis = await iste('/api/servis/kaydet', 'POST', { ad: 'Kaçak' }, mat.token);
  kontrol('öğrenci ve yetkisiz öğretmen servis açamıyor', ogrServis.status === 403 && matServis.status === 403);
  const s1 = await iste('/api/servis/kaydet', 'POST', { ad: '1. Servis', plaka: '07 abc 123', sofor: 'Hasan Usta',
    soforTel: '0532 111 22 33', sabah: '7:30', aksam: '16:10', guzergah: 'Çallı - Otogar' }, M);
  kontrol('servis eklendi', s1.status === 200, J(s1.body));
  const ayniAd = await iste('/api/servis/kaydet', 'POST', { ad: '1. servis' }, M);
  const kotuTel = await iste('/api/servis/kaydet', 'POST', { ad: '2. Servis', soforTel: '12345' }, M);
  kontrol('aynı ad ve bozuk telefon reddedildi', ayniAd.status === 400 && kotuTel.status === 400, ayniAd.status + ' ' + kotuTel.status);
  const s2 = await iste('/api/servis/kaydet', 'POST', { ad: '2. Servis' }, M);

  const yazildi = await iste('/api/servis/ogrenci', 'POST', { servisId: s1.body.id, ogrenciId: o1.user.id, durak: 'Market önü' }, M);
  kontrol('öğrenci servise yazıldı', yazildi.status === 200, J(yazildi.body));
  const benim = (await iste('/api/servis', 'GET', null, o1.token)).body.benim;
  kontrol('öğrenci servisini, şoför telefonunu ve durağını görüyor', !!benim && benim.soforTel === '+905321112233' &&
    benim.plaka === '07 ABC 123' && benim.sabah === '07:30' && benim.durak === 'Market önü', J(benim));
  const veliServis = await iste('/api/servis', 'GET', null, veli.token);
  kontrol('veli çocuğunun servisini görüyor', veliServis.body.cocuklar.length === 1 &&
    veliServis.body.cocuklar[0].servis && veliServis.body.cocuklar[0].servis.soforTel === '+905321112233', J(veliServis.body));
  const o2Servis = await iste('/api/servis', 'GET', null, o2.token);
  const matGor = await iste('/api/servis', 'GET', null, mat.token);
  kontrol('servisi olmayan öğrenci ve öğretmen şoför telefonunu göremiyor',
    JSON.stringify(o2Servis.body).indexOf('5321112233') < 0 && JSON.stringify(matGor.body).indexOf('5321112233') < 0);

  const yabanciServis = await iste('/api/servis/kaydet', 'POST', { ad: 'Yabancı' }, M2);
  const yabanciYaz = await iste('/api/servis/ogrenci', 'POST', { servisId: yabanciServis.body.id, ogrenciId: o2.user.id }, M2);
  kontrol('başka okul kendi servisine bizim öğrencimizi yazamıyor', yabanciYaz.status === 404, 'status ' + yabanciYaz.status);
  const yabanciBizim = await iste('/api/servis/ogrenci', 'POST', { servisId: s1.body.id, ogrenciId: o2.user.id }, M2);
  kontrol('başka okul bizim servisimize dokunamıyor', yabanciBizim.status === 404, 'status ' + yabanciBizim.status);
  const yabanciSil = await iste('/api/servis/sil', 'POST', { id: s1.body.id }, M2);
  kontrol('başka okul bizim servisimizi silemiyor', yabanciSil.status === 404, 'status ' + yabanciSil.status);

  const yonetim = await iste('/api/servis', 'GET', null, M);
  const bir = yonetim.body.servisler.find(s => s.id === s1.body.id);
  kontrol('müdür servisleri öğrencileriyle görüyor', !!bir && bir.ogrenciler.length === 1 && bir.ogrenciler[0].sinif === '6-A' &&
    yonetim.body.okulOgrencileri.some(o => o.id === o2.user.id), J(bir));
  await iste('/api/servis/ogrenci', 'POST', { servisId: s2.body.id, ogrenciId: o1.user.id }, M);
  const tasindi = (await iste('/api/servis', 'GET', null, M)).body.servisler;
  kontrol('öğrenci ikinci servise taşındı (tek serviste)', tasindi.find(s => s.id === s1.body.id).ogrenciler.length === 0 &&
    tasindi.find(s => s.id === s2.body.id).ogrenciler.length === 1);
  const cikar = await iste('/api/servis/ogrenci-cikar', 'POST', { ogrenciId: o1.user.id }, M);
  const tekrarCikar = await iste('/api/servis/ogrenci-cikar', 'POST', { ogrenciId: o1.user.id }, M);
  kontrol('öğrenci servisten çıkarıldı', cikar.status === 200 && tekrarCikar.status === 404);
  const servisSil = await iste('/api/servis/sil', 'POST', { id: s1.body.id }, M);
  kontrol('servis silindi', servisSil.status === 200);

  console.log('=== 3) KULÜPLER ===');
  const kotuDanisman = await iste('/api/kulupler/kaydet', 'POST', { ad: 'Satranç', danismanId: o1.user.id }, M);
  kontrol('öğrenci danışman olamıyor', kotuDanisman.status === 400, J(kotuDanisman.body));
  const k1 = await iste('/api/kulupler/kaydet', 'POST', { ad: 'Satranç', danismanId: mat.user.id, kontenjan: 1, gunSaat: 'Çarşamba 15.00' }, M);
  kontrol('kulüp açıldı', k1.status === 200, J(k1.body));
  const ayniKulup = await iste('/api/kulupler/kaydet', 'POST', { ad: 'satranç' }, M);
  kontrol('aynı adda ikinci kulüp açılmıyor', ayniKulup.status === 400);
  const ogrListe = await iste('/api/kulupler', 'GET', null, o1.token);
  const sat = ogrListe.body.kulupler.find(k => k.id === k1.body.id);
  kontrol('öğrenci kulübü görüyor, üye listesini göremiyor', !!sat && !sat.uyesin && !sat.uyeleriGorur && sat.danisman === 'Ayşe Kaya', J(sat));
  const katil = await iste('/api/kulupler/katil', 'POST', { id: k1.body.id }, o1.token);
  const dolu = await iste('/api/kulupler/katil', 'POST', { id: k1.body.id }, o2.token);
  kontrol('kontenjan dolunca katılamıyor', katil.status === 200 && dolu.status === 400 && /dolu/.test(dolu.body.error), J(dolu.body));

  const k2 = await iste('/api/kulupler/kaydet', 'POST', { ad: 'Resim', kontenjan: 1 }, M);
  const ayniAnda = await Promise.all([
    iste('/api/kulupler/katil', 'POST', { id: k2.body.id }, o1.token),
    iste('/api/kulupler/katil', 'POST', { id: k2.body.id }, o2.token)]);
  kontrol('aynı anda iki istek kontenjanı aşmıyor', ayniAnda.filter(r => r.status === 200).length === 1,
    ayniAnda.map(r => r.status).join(','));

  const ogrUye = await iste('/api/kulupler/uyeler?id=' + k1.body.id, 'GET', null, o1.token);
  const fenUye = await iste('/api/kulupler/uyeler?id=' + k1.body.id, 'GET', null, mat.token);
  kontrol('öğrenci üye listesini göremiyor, danışman görüyor', ogrUye.status === 403 && fenUye.status === 200 &&
    fenUye.body.uyeler.length === 1 && fenUye.body.uyeler[0].ad === 'Zeynep Şahin', ogrUye.status + ' ' + J(fenUye.body));
  const danismanCikar = await iste('/api/kulupler/uye-cikar', 'POST', { id: k1.body.id, ogrenciId: o1.user.id }, mat.token);
  const danismanEkle = await iste('/api/kulupler/uye-ekle', 'POST', { id: k1.body.id, ogrenciId: o2.user.id }, mat.token);
  kontrol('danışman üye çıkarıp ekleyebiliyor', danismanCikar.status === 200 && danismanEkle.status === 200, J(danismanEkle.body));
  const danismanDolu = await iste('/api/kulupler/uye-ekle', 'POST', { id: k1.body.id, ogrenciId: o1.user.id }, mat.token);
  kontrol('danışman da kontenjanı aşamıyor', danismanDolu.status === 400, J(danismanDolu.body));

  await iste('/api/kulupler/kaydet', 'POST', { id: k1.body.id, ad: 'Satranç', danismanId: mat.user.id, kontenjan: 5, basvuruAcik: false }, M);
  const kapaliAyril = await iste('/api/kulupler/ayril', 'POST', { id: k1.body.id }, o2.token);
  const kapaliKatil = await iste('/api/kulupler/katil', 'POST', { id: k1.body.id }, o1.token);
  kontrol('başvuru kapalıyken öğrenci ayrılamıyor ve katılamıyor', kapaliAyril.status === 400 && kapaliKatil.status === 400,
    kapaliAyril.status + ' ' + kapaliKatil.status);
  const k3 = await iste('/api/kulupler/kaydet', 'POST', { ad: 'Müzik', gunSaat: 'Cuma 14.00' }, M);
  await iste('/api/kulupler/uye-ekle', 'POST', { id: k3.body.id, ogrenciId: o1.user.id }, M);
  const veliKulup = await iste('/api/kulupler', 'GET', null, veli.token);
  kontrol('veli çocuğunun kulüplerini görüyor, okulun listesini görmüyor', veliKulup.body.cocuklar.length === 1 &&
    veliKulup.body.cocuklar[0].kulupler.some(k => k.ad === 'Müzik' && k.gunSaat === 'Cuma 14.00') &&
    veliKulup.body.kulupler.length === 0, J(veliKulup.body));
  const veliKatil = await iste('/api/kulupler/katil', 'POST', { id: k2.body.id }, veli.token);
  kontrol('veli kulübe katılamıyor', veliKatil.status === 403, 'status ' + veliKatil.status);

  const yabanciUye = await iste('/api/kulupler/uyeler?id=' + k1.body.id, 'GET', null, M2);
  const yabanciKaydet = await iste('/api/kulupler/kaydet', 'POST', { id: k1.body.id, ad: 'Ele geçti' }, M2);
  kontrol('başka okul kulübümüzü göremiyor, değiştiremiyor', yabanciUye.status === 404 && yabanciKaydet.status === 404,
    yabanciUye.status + ' ' + yabanciKaydet.status);
  const fenKulup = await iste('/api/kulupler/kaydet', 'POST', { ad: 'Bilim Kulübü ' + z, danismanId: fen.user.id }, fen.token);
  kontrol('kulüp yetkisi verilen öğretmen kulüp açabiliyor', fenKulup.status === 200, J(fenKulup.body));
  const matKulup = await iste('/api/kulupler/kaydet', 'POST', { ad: 'Yetkisiz Kulüp' }, mat.token);
  kontrol('yetkisiz öğretmen kulüp açamıyor', matKulup.status === 403, 'status ' + matKulup.status);
  const kulupSil = await iste('/api/kulupler/sil', 'POST', { id: k2.body.id }, M);
  kontrol('kulüp silindi', kulupSil.status === 200);

  console.log('');
  console.log('GECTI: ' + gecti + '   KALDI: ' + kaldi);
  process.exit(kaldi ? 1 : 0);
})().catch(e => { console.error('TEST HATASI:', e); process.exit(1); });
