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

/* ============ XML yardımcıları ============ */

const KACIS = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' };

function xmlKac(s) {
  const metin = String(s);
  let cikti = '';
  for (let i = 0; i < metin.length; i++) {
    const k = metin.charCodeAt(i);
    /* Excel kontrol karakterlerini kabul etmiyor, dosyayi bozuk sayiyor.
       Sekme, satir sonu ve satir basi gecebilir. */
    if (k < 32 && k !== 9 && k !== 10 && k !== 13) continue;
    const c = metin.charAt(i);
    cikti += KACIS[c] || c;
  }
  return cikti;
}

function xmlCoz(s) {
  return String(s)
    .replace(/&#x([0-9a-fA-F]+);/g, (m, h) => kodNoktasi(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (m, d) => kodNoktasi(Number(d)))
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    /* &amp; en sonda: önce çözersek "&amp;lt;" yanlışlıkla "<" olur. */
    .replace(/&amp;/g, '&');
}

function kodNoktasi(n) {
  try { return String.fromCodePoint(n); } catch (e) { return ''; }
}

/* Sütun harfi <-> sıra numarası: "A" = 0, "AB" = 27 */

function sutunNo(harf) {
  let n = 0;
  for (let i = 0; i < harf.length; i++) {
    const k = harf.charCodeAt(i);
    if (k < 65 || k > 90) break;
    n = n * 26 + (k - 64);
  }
  return n - 1;
}

function sutunAd(n) {
  let s = '';
  let x = n + 1;
  while (x > 0) {
    const k = (x - 1) % 26;
    s = String.fromCharCode(65 + k) + s;
    x = Math.floor((x - 1) / 26);
  }
  return s;
}

/* ============ okuma ============ */

/* <t> etiketlerini birleştirir; biçimli metinler parçalara bölünmüş olabiliyor. */
function metinTopla(ic) {
  let s = '';
  const re = /<t[^>]*>([\s\S]*?)<\/t>/g;
  let m;
  while ((m = re.exec(ic))) s += xmlCoz(m[1]);
  return s;
}

function paylasilanCoz(xml) {
  const liste = [];
  const re = /<si\b[^>]*>([\s\S]*?)<\/si>|<si\b[^>]*\/>/g;
  let m;
  while ((m = re.exec(xml))) liste.push(m[1] ? metinTopla(m[1]) : '');
  return liste;
}

/* Kötü niyetli dosyaya karşı sınırlar: tek hücreli küçük bir dosya bile
   "XFD1048576" hücresiyle milyarlarca boş hücreyi belleğe açtırabilirdi.
   Sınırı aşan hücre atlanır; dosyanın toplam hücre sayısı da bütçelidir. */
const EN_FAZLA_SATIR = 20000;
const EN_FAZLA_SUTUN = 200;
const EN_FAZLA_SAYFA = 20;
const HUCRE_BUTCESI = 2000000;     // bütün sayfalarda toplam (boşluklar dahil)

function butceHatasi() {
  return new Error('Dosya çok büyük: en fazla ' + EN_FAZLA_SATIR + ' satır, ' + EN_FAZLA_SUTUN +
    ' sütun okunur. Listeyi bölüp birkaç dosya hâlinde yükle.');
}

function sayfaCoz(xml, paylasilan, butce) {
  const satirlar = [];
  /* Satır etiketiyle uğraşmıyoruz: her hücrenin r="B7" değeri zaten
     hem sütunu hem satırı söylüyor. */
  const re = /<c\b([^>]*?)(?:\/>|>([\s\S]*?)<\/c>)/g;
  let m;
  let enBuyukSutun = -1;

  while ((m = re.exec(xml))) {
    const ozn = m[1] || '';
    const ic = m[2] || '';
    const refM = /\br="([A-Z]+)(\d+)"/.exec(ozn);
    if (!refM) continue;
    const sut = sutunNo(refM[1]);
    const sat = Number(refM[2]) - 1;
    if (sut < 0 || sat < 0 || sut >= EN_FAZLA_SUTUN || sat >= EN_FAZLA_SATIR) continue;

    const tM = /\bt="([^"]+)"/.exec(ozn);
    const tur = tM ? tM[1] : 'n';
    let deger = '';

    if (tur === 'inlineStr') {
      deger = metinTopla(ic);
    } else if (tur === 's') {
      const vM = /<v>([\s\S]*?)<\/v>/.exec(ic);
      const sira = vM ? Number(xmlCoz(vM[1])) : -1;
      deger = paylasilan[sira] !== undefined ? paylasilan[sira] : '';
    } else if (tur === 'str') {
      const vM = /<v>([\s\S]*?)<\/v>/.exec(ic);
      deger = vM ? xmlCoz(vM[1]) : '';
    } else {
      const vM = /<v>([\s\S]*?)<\/v>/.exec(ic);
      deger = vM ? xmlCoz(vM[1]) : '';
      if (tur === 'b') deger = deger === '1' ? 'EVET' : 'HAYIR';
    }

    if (!satirlar[sat]) satirlar[sat] = [];
    satirlar[sat][sut] = deger;
    if (sut > enBuyukSutun) enBuyukSutun = sut;
  }

  /* Seyrek dizideki boşlukları doldur — kullanan taraf undefined görmesin. */
  if (butce) {
    const gerek = satirlar.length * (enBuyukSutun + 1);
    if (gerek > butce.kalan) throw butceHatasi();
    butce.kalan -= gerek;
  }
  for (let i = 0; i < satirlar.length; i++) {
    if (!satirlar[i]) satirlar[i] = [];
    for (let j = 0; j <= enBuyukSutun; j++) {
      if (satirlar[i][j] === undefined) satirlar[i][j] = '';
    }
  }
  return satirlar;
}

function oku(buf) {
  const zip = zipOku(buf);

  const paylasilan = zip['xl/sharedStrings.xml']
    ? paylasilanCoz(zip['xl/sharedStrings.xml'].toString('utf8'))
    : [];

  /* Sayfa adlarını doğru eşlemek için workbook.xml ve ilişki dosyasına bakıyoruz. */
  const wb = zip['xl/workbook.xml'] ? zip['xl/workbook.xml'].toString('utf8') : '';
  const rels = zip['xl/_rels/workbook.xml.rels']
    ? zip['xl/_rels/workbook.xml.rels'].toString('utf8') : '';

  const relHarita = {};
  const relRe = /<Relationship\b([^>]*)\/?>/g;
  let m;
  while ((m = relRe.exec(rels))) {
    const idM = /\bId="([^"]+)"/.exec(m[1]);
    const hedefM = /\bTarget="([^"]+)"/.exec(m[1]);
    if (idM && hedefM) relHarita[idM[1]] = hedefM[1];
  }

  const sayfalar = [];
  const butce = { kalan: HUCRE_BUTCESI };
  const shRe = /<sheet\b([^>]*)\/?>/g;
  while ((m = shRe.exec(wb)) && sayfalar.length < EN_FAZLA_SAYFA) {
    const adM = /\bname="([^"]*)"/.exec(m[1]);
    const idM = /\br:id="([^"]+)"/.exec(m[1]);
    let yol = idM && relHarita[idM[1]] ? relHarita[idM[1]] : null;
    if (!yol) continue;
    if (yol.charAt(0) === '/') yol = yol.slice(1);
    else if (yol.indexOf('xl/') !== 0) yol = 'xl/' + yol;
    if (!zip[yol]) continue;
    sayfalar.push({
      ad: adM ? xmlCoz(adM[1]) : 'Sayfa',
      satirlar: sayfaCoz(zip[yol].toString('utf8'), paylasilan, butce)
    });
  }

  /* workbook.xml okunamadıysa sayfa dosyalarını doğrudan sırayla al. */
  if (!sayfalar.length) {
    Object.keys(zip)
      .filter(k => /^xl\/worksheets\/sheet\d+\.xml$/.test(k))
      .sort((a, b) => {
        const na = Number(a.replace(/\D+/g, ''));
        const nb = Number(b.replace(/\D+/g, ''));
        return na - nb;
      })
      .slice(0, EN_FAZLA_SAYFA)
      .forEach((k, i) => sayfalar.push({
        ad: 'Sayfa' + (i + 1),
        satirlar: sayfaCoz(zip[k].toString('utf8'), paylasilan, butce)
      }));
  }

  if (!sayfalar.length) throw new Error('Excel dosyasında okunabilir sayfa yok.');
  return sayfalar;
}

/* ============ yazma ============ */

const STILLER =
  '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
  '<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">' +
  '<fonts count="3">' +
  '<font><sz val="11"/><color theme="1"/><name val="Calibri"/><family val="2"/></font>' +
  '<font><b/><sz val="11"/><color rgb="FFFFFFFF"/><name val="Calibri"/><family val="2"/></font>' +
  '<font><i/><sz val="10"/><color rgb="FF7B6A6B"/><name val="Calibri"/><family val="2"/></font>' +
  '</fonts>' +
  '<fills count="3">' +
  '<fill><patternFill patternType="none"/></fill>' +
  '<fill><patternFill patternType="gray125"/></fill>' +
  '<fill><patternFill patternType="solid">' +
  '<fgColor rgb="FFC02B30"/><bgColor indexed="64"/></patternFill></fill>' +
  '</fills>' +
  '<borders count="2">' +
  '<border><left/><right/><top/><bottom/><diagonal/></border>' +
  '<border><left/><right/><top/>' +
  '<bottom style="thin"><color rgb="FFEEE3E2"/></bottom><diagonal/></border>' +
  '</borders>' +
  '<cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>' +
  '<cellXfs count="4">' +
  '<xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/>' +
  '<xf numFmtId="0" fontId="1" fillId="2" borderId="0" xfId="0"' +
  ' applyFont="1" applyFill="1" applyAlignment="1">' +
  '<alignment horizontal="left" vertical="center"/></xf>' +
  '<xf numFmtId="0" fontId="0" fillId="0" borderId="1" xfId="0"' +
  ' applyBorder="1" applyAlignment="1"><alignment vertical="center"/></xf>' +
  '<xf numFmtId="0" fontId="2" fillId="0" borderId="0" xfId="0"' +
  ' applyFont="1" applyAlignment="1"><alignment vertical="top" wrapText="1"/></xf>' +
  '</cellXfs>' +
  '<cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles>' +
  '</styleSheet>';

/* Excel sayfa adlarında bu karakterlere ve 31 karakterden uzuna izin vermiyor. */
function sayfaAdiTemizle(ad, sira) {
  let s = String(ad || '').replace(/[\\/?*\[\]:]/g, ' ').trim();
  if (!s) s = 'Sayfa' + sira;
  return s.slice(0, 31);
}

