'use strict';
/* Veri katmanı: uygulamanın veriye tek giriş noktası.

     sunucu/veri/
       baglanti.js      PostgreSQL bağlantı havuzu, sorgu(), islem()
       sema.js          sema/NNN-*.sql dosyalarını sırayla uygular
       sema/            tablo tanımları (okunur SQL)
       esleme.js        satır <-> uygulama nesnesi
       yazici.js        genel INSERT / UPDATE yardımcıları
       depo/            tablo gruplarına göre sorgular
       json-aktarim.js  eski db.json ve yedekler <-> veritabanı
       yedek.js         günlük yedek, geri yükleme

   Uygulamanın geri kalanı yalnızca bu dosyadan içeri alır:
     const { depo, bildir } = require('../veri'); */

const fs = require('fs');
const crypto = require('crypto');
const { DBF } = require('../yollar');
const { hashPw } = require('../sifre');
const { uid, now, kisaAdSorunu, kisaAdUret } = require('../ortak');
const baglanti = require('./baglanti');
const { semayiGuncelle, testIcinSifirla } = require('./sema');
const { iceAktar } = require('./json-aktarim');
const yedek = require('./yedek');
const yoneticiDosyasi = require('../yonetici-dosyasi');

const depo = {
  kullanicilar: require('./depo/kullanicilar'),
  roller: require('./depo/roller'),
  oturumlar: require('./depo/oturumlar'),
  okullar: require('./depo/okullar'),
  siniflar: require('./depo/siniflar'),
  odevler: require('./depo/odevler'),
  quiz: require('./depo/quiz'),
  sinavlar: require('./depo/sinavlar'),
  mesajlar: require('./depo/mesajlar'),
  anketler: require('./depo/anketler'),
  okulHayati: require('./depo/okul-hayati'),
  servisYoklama: require('./depo/servis-yoklama'),
  cihazlar: require('./depo/cihazlar'),
  odevDosyalari: require('./depo/odev-dosyalari'),
  etutler: require('./depo/etutler'),
  onaylar: require('./depo/onaylar'),
  okulSayfalari: require('./depo/okul-sayfalari'),
  yorumlar: require('./depo/yorumlar'),
  ekler: require('./depo/ekler'),
  ogrenciGecmisi: require('./depo/ogrenci-gecmisi'),
  ozellikler: require('./depo/ozellikler'),
  hatirlaticilar: require('./depo/hatirlaticilar'),
  aile: require('./depo/aile'),
  devamsizlik: require('./depo/devamsizlik'),
  push: require('./depo/push'),
  siteAyarlari: require('./depo/site-ayarlari'),
  genel: require('./depo/genel')
};

/* 14 karakter; büyük ve küçük harf, rakam ve özel karakter (yetişkin hesabının
   güçlü şifre kuralı). Karışan karakterler (0/O, 1/l/I) yok. */
function ilkSifreUret() {
  const kucuk = 'abcdefghjkmnpqrstuvwxyz', buyuk = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  const rakam = '23456789', ozel = '!?*.#';
  const hepsi = kucuk + buyuk + rakam;
  const b = crypto.randomBytes(14);
  let s = buyuk[b[0] % buyuk.length] + kucuk[b[1] % kucuk.length] + rakam[b[2] % rakam.length] + ozel[b[3] % ozel.length];
  for (let i = 4; i < 14; i++) s += hepsi[b[i] % hepsi.length];
  return s;
}

/* Okul adresi (egitimevi.org/school/<kısa ad>) önerisi: adından; alınmışsa ilçesiyle,
   o da alınmışsa sayıyla. */
async function okulKisaAdiBul(ad, ilce, haricId) {
  const kok = kisaAdUret(ad);
  const adaylar = [kok];
  if (ilce) adaylar.push((kok.slice(0, 26) + '-' + kisaAdUret(ilce)).slice(0, 40).replace(/-+$/, ''));
  for (const a of adaylar) {
    if (!kisaAdSorunu(a) && !await depo.okullar.kisaAdVarMi(a, haricId)) return a;
  }
  for (let n = 2; n < 10000; n++) {
    const a = kok.slice(0, 34).replace(/-+$/, '') + '-' + n;
    if (!await depo.okullar.kisaAdVarMi(a, haricId)) return a;
  }
  return null;
}

/* Açılış: şemayı güncelle, eski db.json varsa bir kez içeri al, data/admins.json'daki
   yöneticileri aç, hiç yönetici yoksa ilk yöneticiyi aç. */
async function baslat() {
  if (process.env.EE_DB_SIFIRLA === '1') {
    await testIcinSifirla();   // yalnızca adı _test ile biten veritabanında çalışır
  }
  await semayiGuncelle();
  await depo.ozellikler.yukle();   // okulların kapattığı özellikler bellekte
  await depo.siteAyarlari.yukle();  // yönetim panelinden değiştirilen site ayarları bellekte
  await baglanti.turkceSiralamaKontrol();

  const kisiSayisi = (await baglanti.tek('SELECT count(*) AS n FROM kullanicilar')).n;
  if (!kisiSayisi && fs.existsSync(DBF)) {
    const eski = JSON.parse(fs.readFileSync(DBF, 'utf8'));
    const r = await iceAktar(eski);
    fs.renameSync(DBF, DBF + '.tasindi');
    const atlanan = Object.keys(r.atlanan).map(k => k + ': ' + r.atlanan[k]).join(', ');
    console.log('  Eski db.json PostgreSQL\'e taşındı (' + r.kullanici + ' kullanıcı' +
      (atlanan ? '; kopuk kayıt atlandı — ' + atlanan : '') + '). Eski dosya: db.json.tasindi');
  }

  /* Kişi kodu olmayanlara (027 ve 032'de boşaltılan eski kodlar, eski kayıtlar) kod
     üretilir: her öğrenciye veli kodu, her yetişkin hesabına kişi kodu. */
  const kodlanan = await depo.kullanicilar.eksikKodlariDoldur();
  if (kodlanan) console.log('  Kişi kodu üretildi: ' + kodlanan + ' hesap');

  /* Adresi olmayan okullara (eski kayıtlar) adres verilir. */
  for (const o of await depo.okullar.kisaAdsizlar()) {
    const kisa = await okulKisaAdiBul(o.ad, o.ilce, o.id);
    if (kisa) await depo.okullar.kisaAdYaz(o.id, kisa);
  }

  await acilisHesaplari();
  await cakismaRaporu();
}

/* Açılışta hesaplar, bu sırayla:
     1. Eski biçimde saklanmış e-postalar bugünkü biçime getirilir (bkz.
        depo/kullanicilar.js eskiEpostalariSadelestir). admins.json ve ilk yönetici
        denetimi e-postayı bugünkü biçimle arar: bu adım sonra yapılsaydı eski
        biçimli bir hesabın adresiyle (ör. "İ" ile yazılmış) dosyadan görünüşte aynı
        e-postalı ikinci bir hesap, üstelik yönetici olarak açılırdı.
     2. data/admins.json: dosyadaki yöneticiler açılır (sunucu/yonetici-dosyasi.js).
        Dosya sonra da aralıkla yoklanır (sunucu/index.js).
     3. Hâlâ hiç yönetici yoksa (dosya yok ya da dosyadan kimse açılamadı)
        varsayılan ilk yönetici kurulur.
   secenek (testler için): yonetici-dosyasi.oku seçenekleri ({ dosya, sessiz }). */
async function acilisHesaplari(secenek) {
  const sade = await depo.kullanicilar.eskiEpostalariSadelestir();
  if (sade.duzeltilen) {
    console.log('  Eski biçimde saklanmış ' + sade.duzeltilen + ' e-posta adresi bugünkü biçime getirildi (Türkçe İ, görünmez karakter).');
  }

  const dosyadan = await yoneticiDosyasi.oku(depo, Object.assign({ sifreUret: ilkSifreUret }, secenek));

  const admin = await baglanti.tek("SELECT 1 FROM kullanicilar WHERE rol = 'admin' LIMIT 1");
  if (!admin && !dosyadan.eklenen.length) {
    /* İlk yönetici şifresi koda yazılmaz: kod herkese açık depoda, sabit bir
       şifre canlı sitede herkesin bildiği bir kapı olurdu. Rastgele üretilir
       ve yalnızca bu pencereye bir kez yazılır. Testler EE_ADMIN_SIFRE ile
       bilinen bir şifre verir. */
    /* Yönetici adı hiçbir hesapla çakışmaz (031): "admin" alınmışsa admin2, admin3...
       E-posta başka bir hesaptaysa yönetici açılmaz (o hesap yönetici yapılmaz);
       sunucu yine açılır, yönetici data/admins.json ile eklenir. */
    const EPOSTA = 'admin@egitimevi.com';
    let kadi = 'admin';
    for (let n = 2; n < 100 && await depo.kullanicilar.kullaniciAdiHerhangiYerde(kadi); n++) kadi = 'admin' + n;
    if (await depo.kullanicilar.epostaVarMi(EPOSTA)) {
      console.warn('\n  ! İlk yönetici açılamadı: ' + EPOSTA + ' başka bir hesapta. Yöneticiyi data/admins.json ile ekle.\n');
    } else {
      const ilkSifre = process.env.EE_ADMIN_SIFRE || ilkSifreUret();
      await depo.kullanicilar.ekle({
        id: uid('u'), username: kadi, email: EPOSTA, pass: await hashPw(ilkSifre),
        fullName: 'Sistem Yöneticisi', role: 'admin', status: 'approved',
        city: '', district: '', address: '', createdAt: now()
      });
      console.log('\n  ! İlk yönetici hesabı oluşturuldu');
      console.log('    E-posta : ' + EPOSTA + (kadi !== 'admin' ? ' (kullanıcı adı: ' + kadi + ')' : ''));
      console.log('    Şifre   : ' + ilkSifre);
      console.log('    Bu şifre bir daha gösterilmez. Girince Ayarlar\'dan hemen değiştir.\n');
    }
  }
  return { sade, dosyadan };
}

/* Açılışta: kurallara aykırı eski kayıtlar pencereye yazılır (eski biçimli
   e-postaların düzeltilmesi acilisHesaplari'nda). Şema dosyaları bunları
   değiştirmez ve sunucuyu durdurmaz (031); çakışan kayıtları yönetici elle düzeltir. */
async function cakismaRaporu() {
  const r = await depo.kullanicilar.cakismaRaporu();
  if (r.ogrenciTcCift) {
    console.warn('  ! Aynı T.C. kimlik no ile birden çok öğrenci var (' + r.ogrenciTcCift + ' numara): ' +
      'bu yüzden veritabanındaki tekil indeks kurulamadı; uygulama yine denetler. Çiftleri düzeltip sunucuyu yeniden başlat.');
  }
  if (r.yoneticiAdCift.length) {
    console.warn('  ! Bir yöneticiyle aynı kullanıcı adını taşıyan hesap var: ' + r.yoneticiAdCift.join(', ') +
      '. O hesapların adını değiştir.');
  }
  if (r.epostaCift.length) {
    console.warn('  ! Görünüşte aynı olan e-posta adresleri (büyük/küçük harf, Türkçe İ, tam genişlikli harf farkı): ' +
      r.epostaCift.join(' | ') + '. Hesaplardan birinin adresini değiştir.');
  }
}

/* Sık kullanılan kısayollar */
/* secenek: { veliye: false } -> öğrencinin bildiriminin kopyası velisine gitmez (depo/genel.js). */
const bildir = (kimeId, metin, baglantiAdresi, secenek) => depo.genel.bildir(kimeId, metin, baglantiAdresi, secenek);
const topluBildir = (idler, metin, baglantiAdresi, secenek) => depo.genel.topluBildir(idler, metin, baglantiAdresi, secenek);
const cokluBildirim = (liste, secenek) => depo.genel.cokluBildir(liste, secenek);

module.exports = Object.assign({
  baslat,
  acilisHesaplari,
  ilkSifreUret,
  okulKisaAdiBul,
  kapat: baglanti.kapat,
  islem: baglanti.islem,
  hataCevir: baglanti.hataCevir,
  cakisma: baglanti.cakisma,
  depo,
  bildir,
  topluBildir,
  cokluBildirim
}, yedek);
