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

const depo = {
  kullanicilar: require('./depo/kullanicilar'),
  roller: require('./depo/roller'),
  oturumlar: require('./depo/oturumlar'),
  okullar: require('./depo/okullar'),
  siniflar: require('./depo/siniflar'),
  odevler: require('./depo/odevler'),
  sinavlar: require('./depo/sinavlar'),
  mesajlar: require('./depo/mesajlar'),
  anketler: require('./depo/anketler'),
  okulHayati: require('./depo/okul-hayati'),
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

/* Okul adresi (egitimevi.org/<kısa ad>) önerisi: adından; alınmışsa ilçesiyle,
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

/* Açılış: şemayı güncelle, eski db.json varsa bir kez içeri al, ilk yöneticiyi aç. */
async function baslat() {
  if (process.env.EE_DB_SIFIRLA === '1') {
    await testIcinSifirla();   // yalnızca adı _test ile biten veritabanında çalışır
  }
  await semayiGuncelle();
  await depo.ozellikler.yukle();   // okulların kapattığı özellikler bellekte
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

  /* Adresi olmayan okullara (eski kayıtlar) adres verilir. */
  for (const o of await depo.okullar.kisaAdsizlar()) {
    const kisa = await okulKisaAdiBul(o.ad, o.ilce, o.id);
    if (kisa) await depo.okullar.kisaAdYaz(o.id, kisa);
  }

  const admin = await baglanti.tek("SELECT 1 FROM kullanicilar WHERE rol = 'admin' LIMIT 1");
  if (!admin) {
    /* İlk yönetici şifresi koda yazılmaz: kod herkese açık depoda, sabit bir
       şifre canlı sitede herkesin bildiği bir kapı olurdu. Rastgele üretilir
       ve yalnızca bu pencereye bir kez yazılır. Testler EE_ADMIN_SIFRE ile
       bilinen bir şifre verir. */
    const ilkSifre = process.env.EE_ADMIN_SIFRE || ilkSifreUret();
    await depo.kullanicilar.ekle({
      id: uid('u'), username: 'admin', email: 'admin@egitimevi.com', pass: await hashPw(ilkSifre),
      fullName: 'Sistem Yöneticisi', role: 'admin', status: 'approved',
      city: '', district: '', address: '', createdAt: now()
    });
    console.log('\n  ! İlk yönetici hesabı oluşturuldu');
    console.log('    E-posta : admin@egitimevi.com');
    console.log('    Şifre   : ' + ilkSifre);
    console.log('    Bu şifre bir daha gösterilmez. Girince Ayarlar\'dan hemen değiştir.\n');
  }
}

module.exports = Object.assign({
  baslat,
  okulKisaAdiBul,
  kapat: baglanti.kapat,
  islem: baglanti.islem,
  hataCevir: baglanti.hataCevir,
  depo,
  bildir,
  topluBildir,
  cokluBildirim
}, yedek);
