/*
  Uygulama simgelerini (PNG) üretir — dışarıdan paket kullanmadan.

  Çalıştırma:  node araclar/simge-uret.js
  Çıktı: public/simge-192.png, public/simge-512.png, public/simge-maskeli-512.png

  PNG'yi elle kuruyoruz: imza + IHDR + IDAT (zlib ile sıkıştırılmış tarama
  satırları) + IEND. Node'un kendi zlib modülü yeterli.
*/

const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const CIKTI = path.join(__dirname, '..', 'public');

/* ---- PNG yazımı ---- */

function crc32(buf) {
  let c, tablo = crc32.tablo;
  if (!tablo) {
    tablo = crc32.tablo = [];
    for (let n = 0; n < 256; n++) {
      c = n;
      for (let k = 0; k < 8; k++) c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
      tablo[n] = c >>> 0;
    }
  }
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) crc = tablo[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

function chunk(tur, veri) {
  const uzunluk = Buffer.alloc(4);
  uzunluk.writeUInt32BE(veri.length, 0);
  const turBuf = Buffer.from(tur, 'ascii');
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(Buffer.concat([turBuf, veri])), 0);
  return Buffer.concat([uzunluk, turBuf, veri, crcBuf]);
}

/* piksel: (x, y) -> [r, g, b, a] */
function pngYaz(boyut, piksel) {
  const satirlar = [];
  for (let y = 0; y < boyut; y++) {
    const satir = Buffer.alloc(1 + boyut * 4);
    satir[0] = 0;                       // filtre yok
    for (let x = 0; x < boyut; x++) {
      const p = piksel(x, y);
      const i = 1 + x * 4;
      satir[i] = p[0]; satir[i + 1] = p[1]; satir[i + 2] = p[2]; satir[i + 3] = p[3];
    }
    satirlar.push(satir);
  }

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(boyut, 0);
  ihdr.writeUInt32BE(boyut, 4);
  ihdr[8] = 8;    // bit derinliği
  ihdr[9] = 6;    // renk tipi: RGBA
  ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;

  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', zlib.deflateSync(Buffer.concat(satirlar), { level: 9 })),
    chunk('IEND', Buffer.alloc(0))
  ]);
}

/* ---- simge çizimi ---- */

const ANA = [192, 43, 48];
const ANA_KOYU = [143, 29, 33];
const BEYAZ = [255, 255, 255];

/* Bir noktanın üçgenin içinde olup olmadığı (baryasentrik işaret testi) */
function ucgendeMi(px, py, ax, ay, bx, by, cx, cy) {
  const d1 = (px - bx) * (ay - by) - (ax - bx) * (py - by);
  const d2 = (px - cx) * (by - cy) - (bx - cx) * (py - cy);
  const d3 = (px - ax) * (cy - ay) - (cx - ax) * (py - ay);
  const negatif = (d1 < 0) || (d2 < 0) || (d3 < 0);
  const pozitif = (d1 > 0) || (d2 > 0) || (d3 > 0);
  return !(negatif && pozitif);
}

/* kenarPay: kenarlardan ne kadar boşluk bırakılacağı (maskeli simge için gerekli) */
function okulSimgesi(boyut, kenarPay, yuvarlak) {
  const r = boyut * 0.22;   // köşe yuvarlaklığı

  return function (x, y) {
    /* Arka plan: yuvarlatılmış kare (maskeli sürümde tam kare) */
    if (yuvarlak) {
      const kx = Math.min(x, boyut - 1 - x);
      const ky = Math.min(y, boyut - 1 - y);
      if (kx < r && ky < r) {
        const dx = r - kx, dy = r - ky;
        if (dx * dx + dy * dy > r * r) return [0, 0, 0, 0];
      }
    }

    /* Üstten alta hafif koyulaşan kırmızı */
    const t = y / boyut;
    const zemin = [
      Math.round(ANA[0] + (ANA_KOYU[0] - ANA[0]) * t),
      Math.round(ANA[1] + (ANA_KOYU[1] - ANA[1]) * t),
      Math.round(ANA[2] + (ANA_KOYU[2] - ANA[2]) * t),
      255
    ];

    /* Çizim alanı: kenar payı bırakılmış iç kare */
    const ic = boyut - kenarPay * 2;
    const cx = (x - kenarPay) / ic;    // 0..1
    const cy = (y - kenarPay) / ic;
    if (cx < 0 || cx > 1 || cy < 0 || cy > 1) return zemin;

    /* Çatı üçgeni */
    if (ucgendeMi(cx, cy, 0.50, 0.16, 0.10, 0.46, 0.90, 0.46)) return [BEYAZ[0], BEYAZ[1], BEYAZ[2], 255];

    /* Bina gövdesi */
    if (cx >= 0.20 && cx <= 0.80 && cy >= 0.46 && cy <= 0.84) {
      /* Kapı (zemin rengiyle boşluk) */
      if (cx >= 0.42 && cx <= 0.58 && cy >= 0.60 && cy <= 0.84) return zemin;
      /* Pencereler */
      if (cy >= 0.54 && cy <= 0.64) {
        if (cx >= 0.27 && cx <= 0.37) return zemin;
        if (cx >= 0.63 && cx <= 0.73) return zemin;
      }
      return [BEYAZ[0], BEYAZ[1], BEYAZ[2], 255];
    }

    return zemin;
  };
}

function uret(dosya, boyut, kenarPay, yuvarlak) {
  const veri = pngYaz(boyut, okulSimgesi(boyut, kenarPay, yuvarlak));
  fs.writeFileSync(path.join(CIKTI, dosya), veri);
  console.log('  ' + dosya + '  (' + boyut + 'x' + boyut + ', ' + (veri.length / 1024).toFixed(1) + ' KB)');
}

console.log('');
console.log('Simgeler üretiliyor...');
uret('simge-192.png', 192, 18, true);
uret('simge-512.png', 512, 48, true);
/* Maskeli simge: Android simgeyi daire/kare kırpar, kenarda pay bırakmak gerekir. */
uret('simge-maskeli-512.png', 512, 96, false);
console.log('');
