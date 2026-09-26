'use strict';
/* Yüklenen fotoğraf: türü ve içindeki gizli bilgiler.

   Tür, dosyanın adına ya da tarayıcının söylediğine değil ilk baytlarına
   bakılarak bulunur; yalnızca PNG, JPEG ve WebP kabul edilir (SVG içinde kod
   çalışabildiği için hiç kabul edilmez).

   Telefonla çekilen fotoğrafın içinde çekildiği yerin konumu, tarih ve cihaz
   bilgisi (EXIF/XMP) durur. Okul sayfası herkese açık olduğu için bunlar
   kaydetmeden önce silinir. JPEG'de yalnızca fotoğrafın yönü (dik/yatık)
   korunur; o da silinirse telefondaki dik fotoğraf yan yatık görünür. */

const PNG_IMZA = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

function resimTuru(b) {
  if (b.length >= 8 && b.subarray(0, 8).equals(PNG_IMZA)) return 'image/png';
  if (b.length >= 3 && b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return 'image/jpeg';
  if (b.length >= 16 && b.toString('latin1', 0, 4) === 'RIFF' && b.toString('latin1', 8, 12) === 'WEBP') return 'image/webp';
  return '';
}

/* ---- PNG: parça parça; yazı ve EXIF parçaları atılır ---- */
const PNG_ATILAN = ['tEXt', 'iTXt', 'zTXt', 'eXIf', 'tIME'];

function pngTemizle(b) {
  const parcalar = [b.subarray(0, 8)];
  let i = 8;
  while (i + 12 <= b.length) {
    const uzunluk = b.readUInt32BE(i);
    const tur = b.toString('latin1', i + 4, i + 8);
    const son = i + 12 + uzunluk;
    if (son > b.length) return null;
    if (PNG_ATILAN.indexOf(tur) < 0) parcalar.push(b.subarray(i, son));
    i = son;
    if (tur === 'IEND') return Buffer.concat(parcalar);
  }
  return null;   // IEND yok: dosya bozuk ya da yarım
}

/* ---- JPEG: bölüm bölüm ----
   APP1 (EXIF/XMP), APP13 (IPTC) ve yorum bölümleri atılır; renk profili
   (APP2) ve JFIF (APP0) kalır. Görüntü verisi (SOS'tan sonrası) olduğu gibi. */
function exifYonu(veri) {
  if (veri.length < 14 || veri.toString('latin1', 0, 6) !== 'Exif\0\0') return 0;
  const t = veri.subarray(6);
  const kucukUclu = t.toString('latin1', 0, 2) === 'II';
  const u16 = o => (kucukUclu ? t.readUInt16LE(o) : t.readUInt16BE(o));
  const u32 = o => (kucukUclu ? t.readUInt32LE(o) : t.readUInt32BE(o));
  const ifd = u32(4);
  if (ifd + 2 > t.length) return 0;
  const adet = u16(ifd);
  for (let k = 0; k < adet; k++) {
    const g = ifd + 2 + k * 12;
    if (g + 12 > t.length) return 0;
    if (u16(g) === 0x0112) {
      const yon = u16(g + 8);
      return yon >= 1 && yon <= 8 ? yon : 0;
    }
  }
  return 0;
}

/* Yalnızca yön bilgisini taşıyan küçük bir EXIF bölümü. */
function yonBolumu(yon) {
  const t = Buffer.alloc(26);
  t.write('II*\0', 0, 'latin1');
  t.writeUInt32LE(8, 4);            // ilk dizin
  t.writeUInt16LE(1, 8);            // tek kayıt
  t.writeUInt16LE(0x0112, 10);      // yön
  t.writeUInt16LE(3, 12);           // SHORT
  t.writeUInt32LE(1, 14);
  t.writeUInt16LE(yon, 18);
  t.writeUInt32LE(0, 22);           // başka dizin yok
  const veri = Buffer.concat([Buffer.from('Exif\0\0', 'latin1'), t]);
  const bas = Buffer.from([0xff, 0xe1, 0, 0]);
  bas.writeUInt16BE(veri.length + 2, 2);
  return Buffer.concat([bas, veri]);
}

function jpegTemizle(b) {
  const parcalar = [b.subarray(0, 2)];
  let yonYazildi = false;
  let i = 2;
  while (i + 4 <= b.length) {
    if (b[i] !== 0xff) return null;
    const isaret = b[i + 1];
    if (isaret === 0xff) { i++; continue; }                     // dolgu baytı
    if (isaret === 0xda) {                                      // görüntü verisi başlıyor
      parcalar.push(b.subarray(i));
      return Buffer.concat(parcalar);
    }
    if ((isaret >= 0xd0 && isaret <= 0xd7) || isaret === 0x01) { parcalar.push(b.subarray(i, i + 2)); i += 2; continue; }
    const uzunluk = b.readUInt16BE(i + 2);
    const son = i + 2 + uzunluk;
    if (uzunluk < 2 || son > b.length) return null;
    if (isaret === 0xe1) {
      const yon = exifYonu(b.subarray(i + 4, son));
      if (yon > 1 && !yonYazildi) { parcalar.push(yonBolumu(yon)); yonYazildi = true; }
    } else if (isaret !== 0xed && isaret !== 0xfe) {
      parcalar.push(b.subarray(i, son));
    }
    i = son;
  }
  return null;
}

/* ---- WebP: RIFF parçaları; EXIF ve XMP parçaları atılır ---- */
function webpTemizle(b) {
  const parcalar = [];
  let i = 12;
  while (i + 8 <= b.length) {
    const tur = b.toString('latin1', i, i + 4);
    const uzunluk = b.readUInt32LE(i + 4);
    const son = i + 8 + uzunluk + (uzunluk % 2);
    if (i + 8 + uzunluk > b.length) return null;
    if (tur !== 'EXIF' && tur !== 'XMP ') {
      const parca = Buffer.from(b.subarray(i, Math.min(son, b.length)));
      if (tur === 'VP8X' && parca.length > 8) parca[8] &= ~0x0c;   // "EXIF ve XMP var" işaretlerini kaldır
      parcalar.push(parca);
    }
    i = son;
  }
  if (!parcalar.length) return null;
  const govde = Buffer.concat(parcalar);
  const bas = Buffer.alloc(12);
  bas.write('RIFF', 0, 'latin1');
  bas.writeUInt32LE(govde.length + 4, 4);
  bas.write('WEBP', 8, 'latin1');
  return Buffer.concat([bas, govde]);
}

/* Dönen: { tur, veri } ya da tanınmayan/bozuk dosyada null. */
function resmiTemizle(b) {
  const tur = resimTuru(b);
  let veri = null;
  try {
    if (tur === 'image/png') veri = pngTemizle(b);
    else if (tur === 'image/jpeg') veri = jpegTemizle(b);
    else if (tur === 'image/webp') veri = webpTemizle(b);
  } catch (e) { veri = null; }
  return veri ? { tur, veri } : null;
}

module.exports = { resimTuru, resmiTemizle };
