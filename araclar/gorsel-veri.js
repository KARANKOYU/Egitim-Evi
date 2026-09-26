'use strict';
/* Ekran görüntüleri için ek veri. zengin-veri.js'ten SONRA, test sunucusunda
   çalışır; gezinti.js buradaki hesapları kullanır.

   Kurduğu durumlar:
     - Veli Fatma Şahin: e-posta onaylı kayıt, iki çocuk (veli koduyla).
     - Müdür Mehmet Demir aynı zamanda Burak'ın velisi: tek hesapta iki rol.
     - Matematik öğretmeni Ayşe Kaya ikinci bir okulda da öğretmen: yönetici
       "Okul aç" ile Deneme Anadolu Lisesi'ni açar, müdürü Canan Er ilk
       girişte şifresini değiştirir, Ayşe Kaya'yı öğretmen koduyla ekler.
     - Okul sayfası (kapak, logo, galeri, tanıtım, renk, CSS), etüt ve
       yoklaması, servis ve servisçi, kulüp, anket, yemek listesi, okul
       konumu, düzeltilmiş mesaj, yıldızlı ödev, "Yazılı" şablonundan sınav.
     - Ekli mesaj ve ekli ödev (belge + resim), açılış sayfası yorumları.
     - Nakil: Elif Göçmen Test Ortaokulu'nda ödev ve sınav notu alır, sonra
       Deneme Anadolu Lisesi T.C. no + doğum tarihiyle onu kendi okuluna alır.

   Çalıştırma (test sunucusu açıkken):
     EE_BASE=http://localhost:3200 EE_LOG=testler/test-sunucu.log node araclar/gorsel-veri.js */

const zlib = require('zlib');
const { BASE, iste, girisYap, hesapAc, kisilikGec, tcUret } = require('./giris');

/* gezinti.js de bu hesaplarla girer (şifreler test değerleridir). */
const HESAPLAR = {
  veli: { ad: 'Fatma Şahin', kullanici: 'fatma.sahin', eposta: 'veli.gorsel@test.com', sifre: 'Veli2026!' },
  ikinciMudur: { ad: 'Canan', soyad: 'Er', kullanici: 'canan.er', eposta: 'canan.er@test.com', ilkSifre: 'Ilk2026!sifre', sifre: 'Canan2026!' },
  servisci: { ad: 'Hakan Yolcu', kullanici: 'hakan.yolcu', sifre: 'Servis2026' },
  ikinciOkul: { ad: 'Deneme Anadolu Lisesi', kisaAd: 'deneme-anadolu' },
  /* Yöneticinin açtığı üçüncü okulun müdürü: şifresini hiç değiştirmedi,
     ilk girişte "kendi şifreni belirle" penceresi çıkar. */
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

module.exports = { HESAPLAR };

if (require.main === module) {
  calistir().catch(e => { console.error('HATA:', e.message); process.exit(1); });
}
