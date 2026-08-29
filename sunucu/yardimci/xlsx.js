'use strict';
/* Excel (.xlsx) okuma ve yazma — dışarıdan hiçbir paket kullanmadan.

   .xlsx dosyası aslında içinde XML dosyaları bulunan bir zip arşivi.
   Node'un yerleşik zlib'i sıkıştırmayı hallediyor; zip kabuğunu ve
   içindeki XML'i burada elle yazıyoruz.

   Kullanım:
     const xlsx = require('./xlsx');
     const sayfalar = xlsx.oku(fs.readFileSync('liste.xlsx'));
     const tampon  = xlsx.yaz([{ ad: 'Öğrenciler', basliklar: [...], satirlar: [...] }]);
*/

const zlib = require('zlib');

/* ============ CRC32 ============
   Zip her dosya için sağlama istiyor. Tabloyu bir kez üretip saklıyoruz. */

const CRC_TABLO = (function () {
  const t = new Int32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let j = 0; j < 8; j++) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
    t[i] = c;
  }
  return t;
})();

function crc32(buf) {
  let c = -1;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLO[(c ^ buf[i]) & 0xFF] ^ (c >>> 8);
  return (c ^ -1) >>> 0;
}

/* ============ zip okuma ============ */

function zipOku(buf) {
  /* Zip'in sonundaki dizin kaydını sondan geriye tarayarak buluyoruz. */
  let e = -1;
  const alt = Math.max(0, buf.length - 22 - 65535);
  for (let i = buf.length - 22; i >= alt; i--) {
    if (buf.readUInt32LE(i) === 0x06054b50) { e = i; break; }
  }
  if (e < 0) throw new Error('Bu bir Excel dosyası değil (zip yapısı bozuk).');

  const adet = buf.readUInt16LE(e + 10);
  let p = buf.readUInt32LE(e + 16);
  const cikti = {};
  /* Sıkıştırma bombasına karşı: açılmış toplam boyut sınırlı (1 MB'lık bir
     zip içinden gigabaytlarca veri çıkıp belleği doldurmasın). */
  const SINIR = 60 * 1024 * 1024;
  let toplam = 0;

  for (let i = 0; i < adet; i++) {
    if (p + 46 > buf.length || buf.readUInt32LE(p) !== 0x02014b50) break;
    const yontem = buf.readUInt16LE(p + 10);
    const sikisBoy = buf.readUInt32LE(p + 20);
    const adBoy = buf.readUInt16LE(p + 28);
    const ekBoy = buf.readUInt16LE(p + 30);
    const yorumBoy = buf.readUInt16LE(p + 32);
    const yerelKonum = buf.readUInt32LE(p + 42);
    const ad = buf.toString('utf8', p + 46, p + 46 + adBoy);

    /* Yerel başlıktaki alan boyutları merkezdekinden farklı olabilir;
       verinin gerçek başlangıcını oradan hesaplıyoruz. */
    const yAdBoy = buf.readUInt16LE(yerelKonum + 26);
    const yEkBoy = buf.readUInt16LE(yerelKonum + 28);
    const veriBas = yerelKonum + 30 + yAdBoy + yEkBoy;
    const dilim = buf.slice(veriBas, veriBas + sikisBoy);

    try {
      cikti[ad] = yontem === 8 ? zlib.inflateRawSync(dilim, { maxOutputLength: SINIR - toplam }) : dilim;
    } catch (err) {
      throw new Error(err && err.code === 'ERR_BUFFER_TOO_LARGE'
        ? 'Dosya açılınca çok büyüyor; tabloyu bölüp yükle.'
        : 'Dosya açılamadı: ' + ad + ' bölümü okunamıyor.');
    }
    toplam += cikti[ad].length;
    if (toplam > SINIR) throw new Error('Dosya açılınca çok büyüyor; tabloyu bölüp yükle.');

    p += 46 + adBoy + ekBoy + yorumBoy;
  }
  return cikti;
}

