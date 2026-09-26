'use strict';
/*
  Deneme okulu: elle denemek için aynı okula bağlı hesaplar kurar.

    Kullanıcı adı   E-posta                    Durum
    mudur           mudur@deneme.test          okulun müdürü (okul onaylı)
    ogretmen        ogretmen@deneme.test       Matematik öğretmeni (kendi hesabını açtı, müdür koduyla ekledi)
    ogrenci         ogrenci@deneme.test        öğrenci, SINIFSIZ (sınıfı müdür ekranından sen aç, yerleştir)
    veli            veli@deneme.test           öğrenciye bağlı veli (kendisi kaydoldu)
    servisci        —                          servisçi, "1. Servis"e atanmış; öğrenci bu serviste
    yeni.veli       yeni.veli@deneme.test      ROLSÜZ: kaydolmuş, henüz çocuğunu bağlamamış
    Şifre (hepsi): Deneme2026!
    (Güçlü şifre kuralından önce açılmış deneme hesaplarında: Deneme2026)

  Okulun adresi: /deneme-ortaokulu (öğretmen, öğrenci ve servisçi oradan girer).

  Hesaplar gerçek uçlardan (API) geçer: müdür, öğretmen ve veli yetişkin
  hesabı açar (aydınlatma onayı, bot sorusu aynen çalışır); müdür okulunu
  kaydeder, öğretmeni koduyla ekler, öğrenci ve servisçi hesabını açar;
  veli veli kodunu girer. Yalnızca müdürlük
  başvurusunun "yönetici onayı" adımı doğrudan veritabanında yapılır;
  yönetici şifresi bu araçta yok.

  Tekrar çalıştırılırsa var olan hesaplara dokunmaz, eksik olanı tamamlar.
  Sonunda her rol için bir oturum anahtarı yazar (tarayıcı sekmelerini
  hazır açmak için); anahtarlar 7 gün geçerlidir.

  Çalıştırma (sunucu açıkken, günlüğü sunucu.log dosyasına yazarak):
    node sunucu/index.js > sunucu.log
    EE_LOG=sunucu.log node araclar/deneme-okulu.js
*/

const { iste, girisYap, hesapAc, okulHesabi } = require('./giris');
const { ayarlariYukle } = require('../sunucu/ayarlar');
ayarlariYukle();
const baglanti = require('../sunucu/veri/baglanti');
const { depo } = require('../sunucu/veri');

/* Yetişkin hesabının şifresinde büyük/küçük harf, rakam ve özel karakter
   zorunlu; eski deneme hesapları kuraldan önce açıldığı için eski şifrede. */
const SIFRE = 'Deneme2026!';
const ESKI_SIFRE = 'Deneme2026';
const OKUL = { ad: 'Deneme Ortaokulu', il: 'Ankara', ilce: 'Çankaya' };
const HESAP = {
  mudur: { username: 'mudur', email: 'mudur@deneme.test', fullName: 'Selin Aksoy', phone: '05321110011' },
  ogretmen: { username: 'ogretmen', email: 'ogretmen@deneme.test', fullName: 'Emre Doğan', phone: '05321110022' },
  ogrenci: { username: 'ogrenci', email: 'ogrenci@deneme.test', fullName: 'Deniz Yıldırım', phone: '05321110033' },
  veli: { username: 'veli', email: 'veli@deneme.test', fullName: 'Ayten Yıldırım', phone: '05321110044' },
  yeni: { username: 'yeni.veli', email: 'yeni.veli@deneme.test', fullName: 'Ali Yıldırım', phone: '05321110055' },
  servisci: { username: 'servisci', fullName: 'Hakan Yolcu', telefon: '05321110066' }
};
const OKUL_KONUM = { enlem: 39.9208, boylam: 32.8541 };     // Kızılay çevresi (deneme)
const EV_KONUM = { enlem: 39.9030, boylam: 32.8600 };

/* Deneme hesabıyla giriş. Aydınlatma metni yenilendiyse (sürüm değişti)
   bu deneme hesapları için onay burada verilir; gerçek kullanıcı girişte
   onay penceresini görür. */
async function gir(eposta) {
  let g;
  try { g = await girisYap(eposta, SIFRE); } catch (e) {
    if (e.status !== 401 && e.status !== 400) throw e;
    g = await girisYap(eposta, ESKI_SIFRE);
  }
  if (g.kvkkGuncel === false) await iste('/api/kvkk-onay', 'POST', { onay: true }, g.token);
  return g;
}

/* Hesap yoksa rolsüz açar; varsa olduğu gibi döndürür. */
async function hesap(h) {
  const var_ = await depo.kullanicilar.epostayla(h.email);
  if (var_) return var_;
  await hesapAc(Object.assign({ password: SIFRE }, h));
  return depo.kullanicilar.epostayla(h.email);
}

(async () => {
  /* 1) Müdür: yetişkin hesabı -> okulunu kaydeder -> onay (doğrudan veritabanında).
     Müdürlük yetişkin hesabına bağlı ayrı bir satırdır; eski düzende
     açılmış deneme hesabında hesabın kendisi müdürdür. */
  const hesapMudur = await hesap(HESAP.mudur);
  const mudurRolu = async () => hesapMudur.role === 'principal' ? depo.kullanicilar.bul(hesapMudur.id)
    : (await depo.kullanicilar.rolleri(hesapMudur.id)).find(r => r.role === 'principal');
  let mudur = await mudurRolu();
  if (!mudur) {
    const g = await gir(HESAP.mudur.email);
    const b = await iste('/api/okul-basvurusu', 'POST',
      { schoolName: OKUL.ad, city: OKUL.il, district: OKUL.ilce, dogum: '1980-01-01', beyan: true }, g.token);
    if (b.status !== 200) throw new Error('müdür başvurusu: ' + (b.body.error || b.status));
    mudur = await mudurRolu();
  }
  if (mudur.status !== 'approved' || mudur._okulDurum !== 'approved') {
    await baglanti.islem(async () => {
      await depo.kullanicilar.guncelle(mudur.id, { status: 'approved' });
      await depo.okullar.durumYaz(mudur.schoolId, 'approved');
    });
  }
  const M = (await gir(HESAP.mudur.email)).token;

  /* 2) Öğretmen: yetişkin hesabı açar, müdür koduyla ekler (branş: Matematik) */
  let ogretmen = await depo.kullanicilar.epostayla(HESAP.ogretmen.email);
  if (!ogretmen) {
    await okulHesabi(M, 'teacher', { fullName: HESAP.ogretmen.fullName, username: HESAP.ogretmen.username,
      email: HESAP.ogretmen.email, password: SIFRE, brans: 'Matematik', telefon: HESAP.ogretmen.phone });
    ogretmen = await depo.kullanicilar.epostayla(HESAP.ogretmen.email);
  }

  /* 3) Öğrenci: hesabını müdür açar; sınıfsız kalır */
  let ogrenci = await depo.kullanicilar.epostayla(HESAP.ogrenci.email);
  if (!ogrenci) {
    await okulHesabi(M, 'student', { fullName: HESAP.ogrenci.fullName, username: HESAP.ogrenci.username,
      email: HESAP.ogrenci.email, password: SIFRE, dogum: '2013-04-12' });
    ogrenci = await depo.kullanicilar.epostayla(HESAP.ogrenci.email);
  }

  /* 4) Veli: yetişkin hesabı açar, öğrencinin veli koduyla bağlanır */
  await hesap(HESAP.veli);
  const V = (await gir(HESAP.veli.email)).token;
  const bagli = await iste('/api/parent/children', 'GET', null, V);
  if (!(bagli.body.children || []).some(c => c.id === ogrenci.id)) {
    const r = await iste('/api/parent/link', 'POST', { code: ogrenci.code }, V);
    if (r.status !== 200) throw new Error('veli bağlama: ' + (r.body.error || r.status));
  }

  /* 5) Servisçi, servis, okulun ve öğrencinin evinin konumu */
  let servisci = await depo.kullanicilar.kullaniciAdiyla(HESAP.servisci.username, mudur.schoolId);
  if (!servisci) {
    await okulHesabi(M, 'servisci', { fullName: HESAP.servisci.fullName, username: HESAP.servisci.username,
      password: SIFRE, telefon: HESAP.servisci.telefon });
    servisci = await depo.kullanicilar.kullaniciAdiyla(HESAP.servisci.username, mudur.schoolId);
  }
  const servisler = (await iste('/api/servis', 'GET', null, M)).body.servisler || [];
  if (!servisler.some(s => s.ad === '1. Servis')) {
    const s = await iste('/api/servis/kaydet', 'POST', { ad: '1. Servis', plaka: '06 DNM 26', soforId: servisci.id,
      sabah: '07:30', aksam: '15:40' }, M);
    if (s.status !== 200) throw new Error('servis: ' + (s.body.error || s.status));
    await iste('/api/servis/ogrenci', 'POST', { servisId: s.body.id, ogrenciId: ogrenci.id, durak: 'Kızılay' }, M);
    await iste('/api/school/konum', 'POST', OKUL_KONUM, M);
    await iste('/api/servis/ev', 'POST', Object.assign({ ogrenciId: ogrenci.id }, EV_KONUM), M);
  }

  /* 6) Rolü olmayan yetişkin hesabı: henüz hiçbir şey eklememiş */
  await hesap(HESAP.yeni);

  const O = (await gir(HESAP.ogretmen.email)).token;
  const S = (await gir(HESAP.ogrenci.email)).token;
  const Y = (await gir(HESAP.yeni.email)).token;

  const kod = String(ogrenci.code || '');
  /* Eski hesaplarda kullanıcı adı e-postadan türetilmiş olabilir: gerçeğini yaz. */
  const kadi = async h => ((await depo.kullanicilar.epostayla(h.email)) || {}).username || h.username;
  const sutun = s => (s + '              ').slice(0, 14);
  console.log('\nDeneme okulu hazır: ' + OKUL.ad + ' (' + OKUL.il + ' / ' + OKUL.ilce + ')');
  console.log('  Müdür     ' + sutun(await kadi(HESAP.mudur)) + HESAP.mudur.fullName);
  console.log('  Öğretmen  ' + sutun(await kadi(HESAP.ogretmen)) + HESAP.ogretmen.fullName + ' (Matematik)');
  console.log('  Öğrenci   ' + sutun(await kadi(HESAP.ogrenci)) + HESAP.ogrenci.fullName + ' (sınıfsız, veli kodu ' +
    kod.slice(0, 5) + '-' + kod.slice(5) + ')');
  console.log('  Veli      ' + sutun(await kadi(HESAP.veli)) + HESAP.veli.fullName + ' (öğrenciye bağlı)');
  console.log('  Servisçi  ' + sutun(HESAP.servisci.username) + HESAP.servisci.fullName + ' (1. Servis)');
  console.log('  Rolsüz    ' + sutun(await kadi(HESAP.yeni)) + HESAP.yeni.fullName + ' (veli adayı, çocuğu bağlı değil)');
  console.log('  Şifre     ' + SIFRE + '   (girişte kullanıcı adı ya da e-posta)');
  console.log('  Okul adresi: /' + ((await depo.okullar.bul(mudur.schoolId)) || {}).kisaAd);
  console.log('OTURUMLAR ' + JSON.stringify({ mudur: M, ogretmen: O, ogrenci: S, veli: V, rolsuz: Y }));
  await baglanti.kapat();
})().catch(async e => {
  console.error('HATA:', e.message);
  await baglanti.kapat().catch(() => {});
  process.exit(1);
});
