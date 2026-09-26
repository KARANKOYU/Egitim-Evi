'use strict';
/* Ekran görüntüleri için ek veri. zengin-veri.js'ten SONRA, test sunucusunda
   çalışır; gezinti.js buradaki hesapları kullanır.

   Kurduğu durumlar:
     - Veli Fatma Şahin: e-posta onaylı kayıt, iki çocuk (veli koduyla).
     - Müdür Mehmet Demir aynı zamanda Burak'ın velisi: tek hesapta iki rol.
     - Matematik öğretmeni Ayşe Kaya ikinci bir okulda da öğretmen: Canan Er
       hesabını açıp kişi kodunu yöneticiye verir, yönetici "Okul aç" ile
       Deneme Anadolu Lisesi'ni açıp onu müdür yapar; Canan Er Ayşe Kaya'yı
       kişi koduyla ekler.
     - Okul sayfası (kapak, logo, galeri, tanıtım, renk, CSS), etüt ve
       yoklaması, servis ve servisçi, kulüp, anket, yemek listesi, okul
       konumu, düzeltilmiş mesaj, yıldızlı ödev, "Yazılı" şablonundan sınav.
     - Ekli mesaj ve ekli ödev (belge + resim), açılış sayfası yorumları.
     - Nakil: Elif Göçmen Test Ortaokulu'nda ödev ve sınav notu alır, sonra
       Deneme Anadolu Lisesi T.C. no + doğum tarihiyle onu kendi okuluna alır.

   Çalıştırma (test sunucusu açıkken):
     EE_BASE=http://localhost:3200 EE_LOG=testler/test-sunucu.log node araclar/gorsel-veri.js */

const zlib = require('zlib');
const { BASE, iste, girisYap, hesapAc, kisiKodu, kisilikGec, tcUret } = require('./giris');

/* gezinti.js de bu hesaplarla girer (şifreler test değerleridir). */
const HESAPLAR = {
  veli: { ad: 'Fatma Şahin', kullanici: 'fatma.sahin', eposta: 'veli.gorsel@test.com', sifre: 'Veli2026!' },
  ikinciMudur: { ad: 'Canan', soyad: 'Er', kullanici: 'canan.er', eposta: 'canan.er@test.com', sifre: 'Canan2026!' },
  servisci: { ad: 'Hakan Yolcu', kullanici: 'hakan.yolcu', sifre: 'Servis2026' },
  ikinciOkul: { ad: 'Deneme Anadolu Lisesi', kisaAd: 'deneme-anadolu' },
  /* Yöneticinin açtığı üçüncü okulun müdürü: kendi hesabını açtı, kişi kodunu
     yöneticiye verdi; okulu yeni açıldı (boş). ilkSifre onun kendi şifresidir
     (yönetici artık hesap açıp şifre vermiyor; ad gezinti.js uyumu için). */
  yeniMudur: { ad: 'Selin', soyad: 'Taş', kullanici: 'selin.tas', eposta: 'selin.tas@test.com', ilkSifre: 'Ilk2026!sifre' },
  ucuncuOkul: { ad: 'Deneme İlkokulu', kisaAd: 'deneme-ilkokulu' },
  /* Başka okuldan nakil gelen öğrenci (yeni okulunun adresinden girer). */
  nakil: { ad: 'Elif', soyad: 'Göçmen', kullanici: 'elif.gocmen', sifre: 'Elif2026x', dogum: '12.04.2013' }
};

/* Küçük ama geçerli bir PDF (ek olarak yüklenir). */
function pdfYap(baslik) {
  const govde = 'BT /F1 18 Tf 60 740 Td (' + baslik.replace(/[()\\]/g, '') + ') Tj ET';
  const nesneler = ['<< /Type /Catalog /Pages 2 0 R >>', '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
    '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>',
    '<< /Length ' + govde.length + ' >>\nstream\n' + govde + '\nendstream', '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>'];
  let metin = '%PDF-1.4\n';
  const yerler = [];
  nesneler.forEach((n, i) => { yerler.push(metin.length); metin += (i + 1) + ' 0 obj\n' + n + '\nendobj\n'; });
  const xref = metin.length;
  metin += 'xref\n0 ' + (nesneler.length + 1) + '\n0000000000 65535 f \n' +
    yerler.map(y => String(y).padStart(10, '0') + ' 00000 n \n').join('') +
    'trailer\n<< /Size ' + (nesneler.length + 1) + ' /Root 1 0 R >>\nstartxref\n' + xref + '\n%%EOF\n';
  return Buffer.from(metin, 'latin1');
}

async function ekYukle(token, tur, ad, veri) {
  const r = await fetch(BASE + '/api/ek/yukle?tur=' + tur, { method: 'POST', headers: { Authorization: 'Bearer ' + token,
    'Content-Type': 'application/octet-stream', 'X-Dosya-Adi': encodeURIComponent(ad) }, body: veri });
  const j = await r.json().catch(() => ({}));
  if (r.status !== 200) throw new Error('ek (' + ad + '): ' + r.status + ' ' + (j.error || ''));
  return j.ek.id;
}

const iki = n => (n < 10 ? '0' : '') + n;
const gun = n => { const d = new Date(); d.setDate(d.getDate() + n); return d.getFullYear() + '-' + iki(d.getMonth() + 1) + '-' + iki(d.getDate()); };
const saatYaz = dk => iki(Math.floor(dk / 60)) + ':' + iki(dk % 60);
const beklenen = (r, ne) => { if (r.status !== 200) throw new Error(ne + ': ' + r.status + ' ' + (r.body.error || '')); return r.body; };

/* ---- çizilmiş PNG (paket kullanmadan): okul sayfasının fotoğrafları ---- */
function crc32(b) {
  let crc = 0xffffffff;
  for (let n = 0; n < b.length; n++) {
    let c = (crc ^ b[n]) & 0xff;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    crc = (crc >>> 8) ^ c;
  }
  return (crc ^ 0xffffffff) >>> 0;
}
function pngParca(tur, veri) {
  const u = Buffer.alloc(4); u.writeUInt32BE(veri.length);
  const t = Buffer.from(tur, 'latin1');
  const c = Buffer.alloc(4); c.writeUInt32BE(crc32(Buffer.concat([t, veri])));
  return Buffer.concat([u, t, veri, c]);
}
function png(genislik, yukseklik, piksel) {
  const satir = genislik * 3 + 1;
  const ham = Buffer.alloc(satir * yukseklik);
  for (let y = 0; y < yukseklik; y++) {
    for (let x = 0; x < genislik; x++) {
      const [r, g, b] = piksel(x, y);
      const o = y * satir + 1 + x * 3;
      ham[o] = Math.max(0, Math.min(255, r)); ham[o + 1] = Math.max(0, Math.min(255, g)); ham[o + 2] = Math.max(0, Math.min(255, b));
    }
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(genislik, 0); ihdr.writeUInt32BE(yukseklik, 4); ihdr[8] = 8; ihdr[9] = 2;
  return Buffer.concat([Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]), pngParca('IHDR', ihdr),
    pngParca('IDAT', zlib.deflateSync(ham)), pngParca('IEND', Buffer.alloc(0))]);
}
/* Kapak: gökyüzü, tepeler ve kırmızı çatılı bir okul binası. */
function kapakCiz() {
  const G = 1200, Y = 400;
  return png(G, Y, (x, y) => {
    const bina = x > 430 && x < 770 && y > 170 && y < 330;
    const cati = y > 110 && y <= 170 && Math.abs(x - 600) < (y - 110) * 3.2;
    const pencere = bina && ((x - 450) % 60 < 30) && y > 195 && y < 300 && ((y - 195) % 55 < 30);
    const kapi = x > 575 && x < 625 && y > 262 && y < 330;
    if (kapi) return [120, 70, 40];
    if (pencere) return [180, 225, 240];
    if (bina) return [245, 236, 222];
    if (cati) return [196, 52, 58];
    const tepe = 300 + 34 * Math.sin(x / 140) + 12 * Math.sin(x / 37);
    if (y > tepe) return [70 + (y - tepe) * 0.3, 150 - (y - tepe) * 0.2, 80];
    const t = y / 300;
    return [120 + 90 * t, 190 + 30 * t, 235];
  });
}
function logoCiz() {
  return png(200, 200, (x, y) => {
    const d = Math.hypot(x - 100, y - 100);
    if (d > 92) return [255, 255, 255];
    if (d > 80) return [214, 40, 57];
    const kitap = Math.abs(x - 100) < 44 && y > 88 && y < 130 && Math.abs(x - 100) > 3;
    if (kitap) return [255, 255, 255];
    return [15, 163, 177];
  });
}
function galeriCiz(tohum) {
  const renkler = [[247, 179, 43], [15, 163, 177], [214, 40, 57], [92, 107, 192]];
  const [r, g, b] = renkler[tohum % renkler.length];
  return png(480, 360, (x, y) => {
    const halka = Math.hypot(x - 240 - tohum * 20, y - 180) % 60 < 8;
    return halka ? [255, 255, 255] : [r - y / 6, g - x / 12, b];
  });
}
async function fotoYukle(token, yer, veri) {
  const r = await fetch(BASE + '/api/okul-sayfa/foto?yer=' + yer, { method: 'POST',
    headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'image/png' }, body: veri });
  if (r.status !== 200) throw new Error('fotoğraf (' + yer + '): ' + r.status);
  return (await r.json()).foto;
}

/* Yetişkin hesapla girip istenen okul rolüne (ya da veliliğe) geçer. */
async function roleGir(kimlik, sifre, secici) {
  const g = await girisYap(kimlik, sifre);
  if (g.user && g.user.role && !g.kisilikSec) return g.token;
  const k = beklenen(await iste('/api/kisilikler', 'GET', null, g.token), 'rol listesi');
  const hedef = secici(k);
  if (!hedef) return g.token;
  return (await kisilikGec(g.token, hedef.tur, hedef.id)).token;
}

async function calistir() {
  const M = await roleGir('mudur@test.com', 'Test1234!', k => {
    const r = k.roller.find(x => x.rol === 'principal'); return r && { tur: 'rol', id: r.id };
  });
  const A = (await girisYap('admin@egitimevi.com', 'admin123')).token;
  const matOkul1 = k => { const r = k.roller.find(x => x.rol === 'teacher' && x.okulKisaAd === 'test-ortaokulu'); return r && { tur: 'rol', id: r.id }; };
  const MAT = await roleGir('mat@test.com', 'Test1234!', matOkul1);
  const FEN = (await girisYap('fen@test.com', 'Test1234!')).token;

  const ogrenciler = beklenen(await iste('/api/school/students', 'GET', null, M), 'öğrenciler').students;
  const ogr = e => ogrenciler.find(s => s.email === e);
  const zeynep = ogr('ogrenci1@test.com'), burak = ogr('ogrenci2@test.com');
  const ogretmenler = beklenen(await iste('/api/school/teachers', 'GET', null, M), 'öğretmenler').teachers;
  /* Müdür öğretmenlerin e-postasını görmez (KVKK): öğretmen adından bulunur (seed.js). */
  const matRol = ogretmenler.find(t => t.fullName === 'Ayşe Kaya') || ogretmenler[0];
  const fenRol = ogretmenler.find(t => t.fullName === 'Ali Yıldız') || ogretmenler.find(t => t !== matRol) || ogretmenler[0];
  const siniflar = beklenen(await iste('/api/school/classes', 'GET', null, M), 'sınıflar').classes || [];
  const sinif7A = siniflar.find(c => c.name === '7-A') || siniflar[0];
  /* Mesajlar 7-A'ya ve Zeynep'in sınıfına gider (Zeynep turda öğrenci olarak görür). */
  const zeynepleSiniflar = [...new Set([sinif7A && sinif7A.id, zeynep && zeynep.classId].filter(Boolean))];

  /* ---- veli: iki çocuk ---- */
  const V = HESAPLAR.veli;
  try {
    await hesapAc({ fullName: V.ad, username: V.kullanici, email: V.eposta, password: V.sifre, phone: '+905321234567' });
  } catch (e) { if (!/kayıtlı|alınmış/i.test(e.message)) throw e; }
  const veli = await girisYap(V.eposta, V.sifre);
  for (const s of [zeynep, burak]) if (s) await iste('/api/kisilik/cocuk', 'POST', { code: s.code }, veli.token);

  /* ---- müdür aynı zamanda Burak'ın velisi ---- */
  if (burak) await iste('/api/kisilik/cocuk', 'POST', { code: burak.code }, M);

  /* ---- ikinci okul: Canan Er hesabını açar, kişi kodunu yöneticiye verir;
     yönetici okulu açıp onu müdür yapar. Ayşe Kaya orada da öğretmen. ---- */
  const C = HESAPLAR.ikinciMudur;
  try {
    await hesapAc({ fullName: C.ad + ' ' + C.soyad, username: C.kullanici, email: C.eposta, password: C.sifre, phone: '+905321110077' });
  } catch (e) { if (!/kayıtlı|alınmış/i.test(e.message)) throw e; }
  const c1 = await girisYap(C.eposta, C.sifre);
  const ac = await iste('/api/admin/okul-ac', 'POST', {
    schoolName: HESAPLAR.ikinciOkul.ad, city: 'Ankara', district: 'Çankaya', kisaAd: HESAPLAR.ikinciOkul.kisaAd,
    mudurKodu: await kisiKodu(c1.token)
  }, A);
  if (ac.status === 200) {
    const CM = await roleGir(C.eposta, C.sifre, k => { const r = k.roller.find(x => x.rol === 'principal'); return r && { tur: 'rol', id: r.id }; });
    const kod = beklenen(await iste('/api/kisilikler', 'GET', null, MAT), 'kişi kodu').kisiKodu;
    beklenen(await iste('/api/school/ogretmen-ekle', 'POST', { kod, brans: 'Matematik' }, CM), 'ikinci okula öğretmen');
    await iste('/api/school/class', 'POST', { name: '9-A' }, CM);
  } else {
    console.log('  ikinci okul açılamadı (zaten var olabilir): ' + (ac.body.error || ac.status));
  }

  /* ---- üçüncü okul: Selin Taş'ın okulu yeni açıldı (henüz boş) ---- */
  const Y = HESAPLAR.yeniMudur;
  try {
    await hesapAc({ fullName: Y.ad + ' ' + Y.soyad, username: Y.kullanici, email: Y.eposta, password: Y.ilkSifre, phone: '+905321110099' });
  } catch (e) { if (!/kayıtlı|alınmış/i.test(e.message)) throw e; }
  const y1 = await girisYap(Y.eposta, Y.ilkSifre);
  await iste('/api/admin/okul-ac', 'POST', {
    schoolName: HESAPLAR.ucuncuOkul.ad, city: 'Ankara', district: 'Yenimahalle', kisaAd: HESAPLAR.ucuncuOkul.kisaAd,
    mudurKodu: await kisiKodu(y1.token)
  }, A);

  /* ---- okul sayfası ---- */
  await fotoYukle(M, 'kapak', kapakCiz());
  await fotoYukle(M, 'logo', logoCiz());
  const aciklamalar = ['Bilim fuarı', 'Kitap haftası', 'Bahar şenliği', '23 Nisan gösterisi'];
  for (let i = 0; i < 4; i++) {
    const f = await fotoYukle(M, 'galeri', galeriCiz(i));
    await iste('/api/okul-sayfa/foto-aciklama', 'POST', { id: f.id, aciklama: aciklamalar[i] }, M);
  }
  beklenen(await iste('/api/okul-sayfa', 'POST', {
    tanitim: 'Test Ortaokulu 1987\'den beri Çankaya\'da eğitim veriyor. Her yıl bilim fuarı, kitap haftası ' +
      've bahar şenliği düzenliyoruz.\n\nÖğrencilerimiz ve velilerimiz ödevleri, notları, devamsızlığı ve servisi ' +
      'buradan takip eder. Aşağıdan okul adresinle gir.',
    ayarlar: { renk: '#0a6f79', baslikBoyu: 'buyuk', kapakBoyu: 'orta', hiza: 'sol', genislik: 'genis', galeriSutun: '4' },
    css: '.os-foto { border-radius: 16px; }\n.os-baslik { letter-spacing: -0.5px; }\n.os-tanitim p:first-child { font-weight: 600; }'
  }, M), 'okul sayfası');

  /* ---- okul konumu, servis, servisçi, ev konumu ---- */
  await iste('/api/school/konum', 'POST', { enlem: 39.9208, boylam: 32.8541 }, M);
  const S = HESAPLAR.servisci;
  await iste('/api/school/hesap-ac', 'POST', { rol: 'servisci', fullName: S.ad, username: S.kullanici, password: S.sifre,
    tc: tcUret(), telefon: '+905321110066' }, M);
  /* Servisçi turda doğrudan girebilsin: aydınlatma metnini onaylar. */
  try {
    const sg = await girisYap(S.kullanici, S.sifre, 'test-ortaokulu');
    if (sg.kvkkGuncel === false) await iste('/api/kvkk-onay', 'POST', { onay: true }, sg.token);
  } catch (e) { console.log('  servisçi onayı: ' + e.message); }
  const sofor = ((await iste('/api/school/servisciler', 'GET', null, M)).body.servisciler || []).find(x => x.username === S.kullanici);
  const servis = await iste('/api/servis/kaydet', 'POST', {
    ad: '1. Servis', plaka: '06 ABC 123', sofor: S.ad, soforTel: '+905321110066', rehber: 'Nur Ak', rehberTel: '+905321110088',
    sabah: '07:30', aksam: '16:00', guzergah: 'Kızılay - Bahçelievler - Emek', soforId: sofor ? sofor.id : undefined
  }, M);
  if (servis.status === 200) {
    for (const [s, durak] of [[zeynep, 'Emek, 8. Cadde'], [burak, 'Bahçelievler, 3. Cadde']]) {
      if (s) await iste('/api/servis/ogrenci', 'POST', { servisId: servis.body.id, ogrenciId: s.id, durak }, M);
    }
    if (zeynep) await iste('/api/servis/ev', 'POST', { ogrenciId: zeynep.id, enlem: 39.9061, boylam: 32.8231 }, M);
  }

  /* ---- etüt: biri bugün (şimdi sürüyor, yoklaması alınmış), biri salı ---- */
  const simdi = new Date();
  const dk = simdi.getHours() * 60 + simdi.getMinutes();
  const bas = Math.max(0, dk - 30), bit = Math.min(23 * 60 + 59, Math.max(bas + 45, dk + 60));
  const bugunGun = ((simdi.getDay() + 6) % 7) + 1;
  const etut = await iste('/api/etut/kaydet', 'POST', { ad: 'Matematik etüdü', gun: bugunGun, baslangic: saatYaz(bas),
    bitis: saatYaz(bit), yer: 'Kütüphane', ogretmenId: matRol && matRol.id }, M);
  const etut2 = await iste('/api/etut/kaydet', 'POST', { ad: 'Fen deney etüdü', gun: 2, baslangic: '15:40',
    bitis: '17:00', yer: 'Fen laboratuvarı', ogretmenId: fenRol && fenRol.id }, M);
  const etutOgrencileri = ogrenciler.filter(s => s.classId === (sinif7A && sinif7A.id)).map(s => s.id);
  if (zeynep && etutOgrencileri.indexOf(zeynep.id) < 0) etutOgrencileri.push(zeynep.id);
  if (burak && etutOgrencileri.indexOf(burak.id) < 0) etutOgrencileri.push(burak.id);
  const etutId = etut.body.etut && etut.body.etut.id;
  const etut2Id = etut2.body.etut && etut2.body.etut.id;
  for (const id of [etutId, etut2Id]) if (id) await iste('/api/etut/ogrenciler', 'POST', { id, ogrenciIdler: etutOgrencileri }, M);
  if (etutId) {
    const durumlar = ['var', 'var', 'yok', 'izinli', 'var', 'var'];
    await iste('/api/etut/yoklama', 'POST', { id: etutId, tarih: gun(0),
      kayitlar: etutOgrencileri.map((id, i) => ({ ogrenciId: id, durum: durumlar[i % durumlar.length] })) }, MAT);
  }

  /* ---- kulüp, anket, yemek listesi ---- */
  const kulup = await iste('/api/kulupler/kaydet', 'POST', { ad: 'Satranç Kulübü', aciklama: 'Her hafta turnuva, yıl sonunda okul şampiyonası.',
    danismanId: matRol && matRol.id, kontenjan: 20, gunSaat: 'Çarşamba 15:40' }, M);
  await iste('/api/kulupler/kaydet', 'POST', { ad: 'Robotik Kulübü', aciklama: 'Arduino ile küçük projeler.',
    danismanId: fenRol && fenRol.id, kontenjan: 12, gunSaat: 'Perşembe 15:40' }, M);
  const Z = (await girisYap('ogrenci1@test.com', 'Test1234!')).token;
  if (kulup.status === 200) await iste('/api/kulupler/katil', 'POST', { id: kulup.body.id }, Z);
  const anket = await iste('/api/anketler', 'POST', { soru: 'Bahar şenliği hangi gün olsun?', aciklama: 'Veliler ve öğrenciler oylayabilir.',
    secenekler: ['Cuma öğleden sonra', 'Cumartesi', 'Pazar'], bitisGun: gun(7), hedef: { tur: 'okul' } }, M);
  if (anket.status === 200) {
    const s = await iste('/api/anketler', 'GET', null, Z);
    const a = ((s.body && s.body.gelen) || []).find(x => x.id === anket.body.id);
    if (a && a.secenekler && a.secenekler[1]) await iste('/api/anketler/oy', 'POST', { id: a.id, secenekId: a.secenekler[1].id }, Z);
  }
  const menuler = ['Mercimek çorbası\nTavuk sote\nPirinç pilavı\nAyran', 'Ezogelin çorbası\nKarnıyarık\nBulgur pilavı\nMevsim salata',
    'Yayla çorbası\nKuru fasulye\nPilav\nTurşu', 'Domates çorbası\nFırın köfte\nPatates püresi\nMeyve', 'Tarhana çorbası\nMantı\nCacık'];
  const yemekGunleri = [];
  for (let i = 0, eklenen = 0; eklenen < 5 && i < 10; i++) {
    const d = new Date(); d.setDate(d.getDate() + i);
    if (d.getDay() === 0 || d.getDay() === 6) continue;
    yemekGunleri.push({ tarih: gun(i), menu: menuler[eklenen++] });
  }
  await iste('/api/yemek', 'POST', { gunler: yemekGunleri }, M);

  /* Sınıfa toplu mesaj yetkisi hazır Öğretmen rolünde yok; müdür matematik
     öğretmenine "Zümre Başkanı" ek rolünü verir (sınıfa mesaj atabilsin). */
  const zumre = await iste('/api/school/role', 'POST', { name: 'Zümre Başkanı', permissions: ['sinav.olustur', 'mesaj.toplu'] }, M);
  if (zumre.body.role && matRol) await iste('/api/school/role-assign', 'POST', { userId: matRol.id, roleId: zumre.body.role.id }, M);

  /* ---- düzeltilmiş mesaj, yıldızlı ödev ---- */
  const mesaj = await iste('/api/mesajlar', 'POST', { tur: 'mesaj', konu: 'Yarınki matematik dersi',
    govde: 'Yarın pergel ve cetvel getirin.', hedef: { tur: 'sinif', siniflar: zeynepleSiniflar } }, MAT);
  if (mesaj.status === 200) {
    await iste('/api/mesajlar/duzenle', 'POST', { id: mesaj.body.mesaj.id, konu: 'Yarınki matematik dersi',
      govde: 'Yarın pergel, cetvel ve iletki getirin. (Düzeltme: iletki de lazım.)' }, MAT);
  }
  const ilerleme = await iste('/api/progress', 'GET', null, Z);
  const yildizlanacak = ((ilerleme.body && ilerleme.body.assignments) || []).find(a => /Geometri/.test(a.title));
  if (yildizlanacak) await iste('/api/assignments/' + yildizlanacak.id + '/yildiz', 'POST', { yildiz: true }, Z);

  /* ---- "Yazılı" şablonundan sınav, notları girilmiş ---- */
  const sablonlar = ((await iste('/api/exams/sablonlar', 'GET', null, MAT)).body.sablonlar) || [];
  const yazili = sablonlar.find(s => /Yazılı/i.test(s.name));
  if (yazili) {
    const e = (await iste('/api/exams', 'POST', { name: 'Matematik 2. Yazılı', templateId: yazili.id, tarih: gun(-5) }, MAT)).body.exam;
    if (e) {
      /* grades: öğrenci -> ana ölçümün (Puan) değeri */
      const d = await iste('/api/exams/' + e.id, 'GET', null, MAT);
      const grades = {};
      (d.body.students || []).forEach((s, i) => { grades[s.id] = String(55 + (i * 13) % 45) + ',5'; });
      await iste('/api/exams/' + e.id + '/grades', 'POST', { grades }, MAT);
    }
  }

  /* ---- ödev serisi: Zeynep'in sonuçlanmış geçmiş ödevleri (dört yaptı, geç,
     yapmadı → seri bozuldu, sonra iki yaptı: serisi 2, en uzun 4). ---- */
  if (zeynep) {
    const seriSonuclari = ['yapti', 'yapti', 'yapti', 'yapti', 'gec', 'yapmadi', 'yapti', 'yapti'];
    const seriKonulari = ['Kesirler', 'Ondalık sayılar', 'Yüzdeler', 'Üslü ifadeler', 'Kareköklü sayılar',
      'Cebirsel ifadeler', 'Doğrusal denklemler', 'Eşitsizlikler'];
    for (let i = 0; i < seriSonuclari.length; i++) {
      const a = await iste('/api/assignments', 'POST', { title: seriKonulari[i] + ' alıştırması', subject: 'Matematik',
        description: 'Ders kitabındaki alıştırmaları çöz.', startAt: gun(-40 + i * 4), endAt: gun(-38 + i * 4),
        studentIds: [zeynep.id].concat(burak ? [burak.id] : []) }, MAT);
      if (!a.body.assignment) { console.log('  seri ödevi açılamadı: ' + JSON.stringify(a.body)); break; }
      await iste('/api/assignments/' + a.body.assignment.id + '/finish', 'POST',
        { results: Object.assign({ [zeynep.id]: seriSonuclari[i] }, burak ? { [burak.id]: 'yapti' } : {}) }, MAT);
    }
  }

  /* ---- ekli mesaj ve ekli ödev ---- */
  try {
    const mesajEkleri = [await ekYukle(MAT, 'mesaj', 'Gezi izin formu.pdf', pdfYap('Gezi izin formu')),
      await ekYukle(MAT, 'mesaj', 'Gezi programi.png', galeriCiz(2))];
    await iste('/api/mesajlar', 'POST', { tur: 'mesaj', konu: 'Müze gezisi izin formu',
      govde: 'Ekteki izin formunu velinize imzalatıp cuma gününe kadar getirin. Gezi programı da ekte.',
      hedef: { tur: 'sinif', siniflar: zeynepleSiniflar }, ekIdler: mesajEkleri }, MAT);
    const odevEki = await ekYukle(MAT, 'odev', 'Oran orantı çalışma kâğıdı.pdf', pdfYap('Oran oranti calisma kagidi'));
    const hedef = ((await iste('/api/assignments/hedefler', 'GET', null, MAT)).body.classes || [])
      .find(c => sinif7A && c.id === sinif7A.id);
    /* 7-A ve Zeynep (7-B): Zeynep teslim eder, öğretmen "3 ek" görür. */
    const hedefOgrenciler = [...new Set((hedef ? hedef.students.map(s => s.id) : []).concat(zeynep ? [zeynep.id] : []))];
    const oran = await iste('/api/assignments', 'POST', { title: 'Oran orantı çalışma kâğıdı', subject: 'Matematik',
      description: 'Ekteki kâğıttaki 12 soruyu çöz, fotoğrafını yükle.', startAt: gun(0), endAt: gun(4), endTime: '17:00',
      studentIds: hedefOgrenciler, ekIdler: [odevEki] }, MAT);
    /* Zeynep teslim eder: fotoğraf, video ve belge (öğretmen "3 ek" görür). */
    const oranId = oran.body.assignment && oran.body.assignment.id;
    const teslim = async (ad, veri) => {
      const r = await fetch(BASE + '/api/odev-dosya/yukle?odev=' + encodeURIComponent(oranId), { method: 'POST',
        headers: { Authorization: 'Bearer ' + Z, 'Content-Type': 'application/octet-stream', 'X-Dosya-Adi': encodeURIComponent(ad) }, body: veri });
      if (r.status !== 200) console.log('  teslim (' + ad + '): ' + r.status);
    };
    if (oranId) {
      await teslim('Çözümler — sayfa 1.png', galeriCiz(1));
      await teslim('Soru 12 anlatımı.mp4', Buffer.concat([Buffer.from([0, 0, 0, 24, 102, 116, 121, 112, 109, 112, 52, 50]), require('crypto').randomBytes(2 * 1024 * 1024)]));
      await teslim('Çalışma kâğıdı cevapları.pdf', pdfYap('Oran oranti cevaplar'));
    }
  } catch (e) { console.log('  ekler kurulamadı: ' + e.message); }

  /* ---- bugün şu an süren bir Matematik dersi (7-A): öğretmenin programında
     "Şu an — yoklama al" düğmesi görünsün (tur hangi gün çalışırsa). ---- */
  try {
    const simdiD = new Date(), dkS = simdiD.getHours() * 60 + simdiD.getMinutes();
    /* Matematik öğretmeninin (Ayşe Kaya) kendi dersi: programındaki bir hücre. */
    const hucreler = (await iste('/api/teacher/schedule', 'GET', null, MAT)).body.cells || [];
    const hucre = hucreler.find(c => c.subject === 'Matematik') || hucreler[0];
    if (hucre) {
      const r = await iste('/api/school/schedule-add', 'POST', { classId: hucre.classId, lessonId: hucre.lessonId, day: ((simdiD.getDay() + 6) % 7) + 1,
        start: saatYaz(Math.max(0, dkS - 10)), end: saatYaz(Math.min(23 * 60 + 59, dkS + 60)) }, M);
      if (r.status !== 200) console.log('  şu anki ders: ' + r.status + ' ' + (r.body.error || ''));
    } else console.log('  şu anki ders: öğretmenin programı boş');
  } catch (e) { console.log('  şu anki ders eklenemedi: ' + e.message); }

  /* ---- Eğitim Evi Aile: Zeynep'in telefonu (deneme konumları ve ekran süreleri).
     Veli (Fatma Şahin) Wi-Fi 5, mobil 15 dk, günlük toplam 3 sa, YouTube 1 sa seçer;
     bugünkü YouTube süresi sınırı geçtiği için veliye bildirim gider. ---- */
  try {
    const bag = beklenen(await iste('/api/aile/cihaz', 'POST', { ad: 'Samsung Galaxy A54', platform: 'android', surum: '14', onay: true }, Z), 'aile bağla');
    const cihazGonder = (yol, govde) => fetch(BASE + '/api/aile/cihaz/' + yol, { method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Aile-Cihaz': bag.cihazAnahtari }, body: JSON.stringify(govde) });
    const simdi = Date.now();
    const yol = [[39.9102, 32.8612], [39.9121, 32.8598], [39.9143, 32.8583], [39.9166, 32.8569], [39.9187, 32.8553], [39.9206, 32.8541]];
    await cihazGonder('konum', { konumlar: yol.map((k, i) => ({ enlem: k[0], boylam: k[1], dogruluk: 12 + i * 3,
      zaman: simdi - (yol.length - i) * 15 * 60000 + 12 * 60000, ag: i === yol.length - 1 ? 'wifi' : 'mobil', pil: 86 - i * 3 })) });
    await iste('/api/aile/ayar', 'POST', { studentId: zeynep.id, wifiDk: 5, mobilDk: 15, konumAcik: true, kullanimAcik: true,
      toplamSinir: 180, sinirlar: [{ paket: 'com.google.android.youtube', ad: 'YouTube', dakika: 60 }] }, veli.token);
    const uygulamalar = [['com.google.android.youtube', 'YouTube'], ['com.instagram.android', 'Instagram'], ['com.whatsapp', 'WhatsApp'],
      ['com.mojang.minecraftpe', 'Minecraft'], ['com.android.chrome', 'Chrome'], ['com.spotify.music', 'Spotify'], ['org.egitimevi.aile', 'Eğitim Evi']];
    const sureler = [[48, 30, 22, 35, 12, 18, 9], [62, 25, 30, 20, 15, 10, 12], [35, 40, 18, 55, 10, 20, 6], [70, 28, 26, 15, 20, 14, 11],
      [44, 35, 20, 60, 8, 22, 7], [58, 30, 25, 25, 14, 16, 10], [85, 32, 24, 18, 11, 15, 8]];
    const gunler = sureler.map((s, i) => ({ gun: new Date(simdi + 3 * 3600000 - (6 - i) * 86400000).toISOString().slice(0, 10),
      uygulamalar: uygulamalar.map((u, j) => ({ paket: u[0], ad: u[1], dakika: s[j] })) }));
    await cihazGonder('kullanim', { gunler });
  } catch (e) { console.log('  aile kurulamadı: ' + e.message); }

  /* ---- hatırlatıcılar ---- */
  for (const [t, h] of [
    [Z, { baslik: 'Beden eğitimi kıyafeti', aciklama: 'Eşofman ve spor ayakkabı', siklik: 'her-hafta', gunler: [1, 3], saat: '07:30' }],
    [Z, { baslik: 'Kitap oku (30 dakika)', siklik: 'her-gun', saat: '21:00' }],
    [Z, { baslik: 'Kütüphane kitabını iade et', siklik: 'bir-kez', tarih: gun(2), saat: '12:30' }],
    [Z, { baslik: 'Harçlık defterini kontrol et', siklik: 'her-ay', ayGunu: 1, saat: '19:00' }],
    [MAT, { baslik: 'Yazılı kâğıtlarını oku', aciklama: '7-A ve 7-B', siklik: 'her-hafta', gunler: [5], saat: '16:00' }]
  ]) await iste('/api/hatirlaticilar', 'POST', h, t);

  /* ---- açılış sayfası yorumları (yalnızca yetişkinler) ---- */
  const yorumlar = [
    [veli.token, 5, 'İki çocuğumun ödevini ve devamsızlığını tek ekrandan görüyorum, servis yaklaşınca haber geliyor.'],
    [MAT, 5, 'Ödevi verip sonuçlandırmak birkaç dakika sürüyor; sınav şablonları çok işime yarıyor.'],
    [M, 4, 'Ders programı ve yoklama tek yerde. Excel ile öğrenci aktarımı ilk gün işimizi çözdü.'],
    [await girisYap(C.eposta, C.sifre).then(g => g.token).catch(() => null), 4, 'Okulumuzu yönetici açtı, aynı gün öğretmenleri kodla ekledik.']
  ];
  for (const [t, yildiz, metin] of yorumlar) if (t) await iste('/api/yorumlar', 'POST', { yildiz, metin }, t);

  /* ---- nakil: Elif Test Ortaokulu'ndan Deneme Anadolu Lisesi'ne geçer ---- */
  const N = HESAPLAR.nakil;
  const nakilTc = tcUret();
  const acNakil = await iste('/api/school/hesap-ac', 'POST', { rol: 'student', ad: N.ad, soyad: N.soyad, tc: nakilTc,
    dogum: N.dogum, kullaniciAdi: N.kullanici, password: N.sifre, classId: sinif7A && sinif7A.id }, M);
  if (acNakil.status === 200) {
    const elif = acNakil.body.hesap;
    const e1 = await girisYap(N.kullanici, N.sifre, 'test-ortaokulu');
    if (e1.kvkkGuncel === false) await iste('/api/kvkk-onay', 'POST', { onay: true }, e1.token);
    const eskiOdev = await iste('/api/assignments', 'POST', { title: 'Kesirlerle işlemler tekrarı', subject: 'Matematik',
      description: 'Kitaptaki 5 soruyu çöz.', startAt: gun(-12), endAt: gun(-5), studentIds: [elif.id] }, MAT);
    if (eskiOdev.status === 200) {
      await iste('/api/assignments/' + eskiOdev.body.assignment.id + '/finish', 'POST', { results: { [elif.id]: 'yapti' } }, MAT);
    }
    if (yazili) {
      const kisa = (await iste('/api/exams', 'POST', { name: 'Kesirler kısa sınavı', templateId: yazili.id, tarih: gun(-8) }, MAT)).body.exam;
      if (kisa) await iste('/api/exams/' + kisa.id + '/grades', 'POST', { grades: { [elif.id]: '88' } }, MAT);
    }
    /* Yeni okulun müdürü: T.C. no + doğum tarihi eşleşince hesap taşınır. */
    const CM2 = await roleGir(C.eposta, C.sifre, k => { const r = k.roller.find(x => x.rol === 'principal'); return r && { tur: 'rol', id: r.id }; });
    const sinif9A = ((await iste('/api/school/classes', 'GET', null, CM2)).body.classes || []).find(c => c.name === '9-A');
    const nakil = await iste('/api/school/hesap-ac', 'POST', { rol: 'student', ad: N.ad, soyad: N.soyad, tc: nakilTc,
      dogum: N.dogum, classId: sinif9A ? sinif9A.id : '' }, CM2);
    if (nakil.status !== 200 || !nakil.body.hesap.nakil) console.log('  nakil olmadı: ' + (nakil.body.error || nakil.status));
    /* Ekran turu "başka okuldaki T.C. yazılınca doğum tarihi istenir" penceresini
       bu T.C. ile çeker (test klasörü depoya girmez). */
    try {
      require('fs').writeFileSync(require('path').join(__dirname, '..', 'testler', 'testdata', 'gorsel-nakil.json'),
        JSON.stringify({ tc: nakilTc }));
    } catch (e) { /* tur bu adımı atlar */ }
  } else console.log('  nakil öğrencisi açılamadı: ' + (acNakil.body.error || acNakil.status));

  /* Tek ders kullanan kişiler için: bekleyen bildirimler gerçekçi görünsün. */
  await iste('/api/logout', 'POST', null, FEN);
  console.log('görsel veri hazır: veli (2 çocuk), müdür + veli, iki okulda öğretmen, okul sayfası, etüt, servis, kulüp, anket, yemek, ekler, yorumlar, nakil');
}

module.exports = { HESAPLAR };

if (require.main === module) {
  calistir().catch(e => { console.error('HATA:', e.message); process.exit(1); });
}
