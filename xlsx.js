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

/* ============ zip yazma ============ */

function zipYaz(dosyalar) {
  const parcalar = [];
  const merkez = [];
  let konum = 0;

  for (const d of dosyalar) {
    const ad = Buffer.from(d.ad, 'utf8');
    const ham = d.veri;
    const sikis = zlib.deflateRawSync(ham, { level: 9 });
    /* Sıkıştırma büyütüyorsa ham hâliyle koy. */
    const kucuk = sikis.length < ham.length;
    const govde = kucuk ? sikis : ham;
    const yontem = kucuk ? 8 : 0;
    const crc = crc32(ham);

    const yerel = Buffer.alloc(30);
    yerel.writeUInt32LE(0x04034b50, 0);   // yerel başlık imzası
    yerel.writeUInt16LE(20, 4);           // gereken sürüm (2.0)
    yerel.writeUInt16LE(0x0800, 6);       // bayrak: dosya adları UTF-8
    yerel.writeUInt16LE(yontem, 8);
    yerel.writeUInt16LE(0, 10);           // saat
    yerel.writeUInt16LE(0x21, 12);        // tarih: 1980-01-01 (sabit, tekrar üretilebilir olsun)
    yerel.writeUInt32LE(crc, 14);
    yerel.writeUInt32LE(govde.length, 18);
    yerel.writeUInt32LE(ham.length, 22);
    yerel.writeUInt16LE(ad.length, 26);
    yerel.writeUInt16LE(0, 28);           // ek alan yok
    parcalar.push(yerel, ad, govde);

    const mrk = Buffer.alloc(46);
    mrk.writeUInt32LE(0x02014b50, 0);     // merkezî dizin imzası
    mrk.writeUInt16LE(20, 4);             // üreten sürüm
    mrk.writeUInt16LE(20, 6);             // gereken sürüm
    mrk.writeUInt16LE(0x0800, 8);
    mrk.writeUInt16LE(yontem, 10);
    mrk.writeUInt16LE(0, 12);
    mrk.writeUInt16LE(0x21, 14);
    mrk.writeUInt32LE(crc, 16);
    mrk.writeUInt32LE(govde.length, 20);
    mrk.writeUInt32LE(ham.length, 24);
    mrk.writeUInt16LE(ad.length, 28);
    mrk.writeUInt16LE(0, 30);             // ek alan
    mrk.writeUInt16LE(0, 32);             // yorum
    mrk.writeUInt16LE(0, 34);             // disk numarası
    mrk.writeUInt16LE(0, 36);             // iç öznitelik
    mrk.writeUInt32LE(0, 38);             // dış öznitelik
    mrk.writeUInt32LE(konum, 42);         // yerel başlığın konumu
    merkez.push(mrk, ad);

    konum += yerel.length + ad.length + govde.length;
  }

  const merkezBuf = Buffer.concat(merkez);
  const son = Buffer.alloc(22);
  son.writeUInt32LE(0x06054b50, 0);
  son.writeUInt16LE(0, 4);
  son.writeUInt16LE(0, 6);
  son.writeUInt16LE(dosyalar.length, 8);
  son.writeUInt16LE(dosyalar.length, 10);
  son.writeUInt32LE(merkezBuf.length, 12);
  son.writeUInt32LE(konum, 16);
  son.writeUInt16LE(0, 20);

  return Buffer.concat(parcalar.concat([merkezBuf, son]));
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
      cikti[ad] = yontem === 8 ? zlib.inflateRawSync(dilim) : dilim;
    } catch (err) {
      throw new Error('Excel dosyası açılamadı: ' + ad + ' bölümü okunamıyor.');
    }

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

function sayfaCoz(xml, paylasilan) {
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
    if (sut < 0 || sat < 0) continue;

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
  const shRe = /<sheet\b([^>]*)\/?>/g;
  while ((m = shRe.exec(wb))) {
    const adM = /\bname="([^"]*)"/.exec(m[1]);
    const idM = /\br:id="([^"]+)"/.exec(m[1]);
    let yol = idM && relHarita[idM[1]] ? relHarita[idM[1]] : null;
    if (!yol) continue;
    if (yol.charAt(0) === '/') yol = yol.slice(1);
    else if (yol.indexOf('xl/') !== 0) yol = 'xl/' + yol;
    if (!zip[yol]) continue;
    sayfalar.push({
      ad: adM ? xmlCoz(adM[1]) : 'Sayfa',
      satirlar: sayfaCoz(zip[yol].toString('utf8'), paylasilan)
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
      .forEach((k, i) => sayfalar.push({
        ad: 'Sayfa' + (i + 1),
        satirlar: sayfaCoz(zip[k].toString('utf8'), paylasilan)
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

function hucre(ref, deger, stil) {
  const st = stil ? ' s="' + stil + '"' : '';
  if (deger === null || deger === undefined || deger === '') {
    return st ? '<c r="' + ref + '"' + st + '/>' : '';
  }
  if (typeof deger === 'number' && isFinite(deger)) {
    return '<c r="' + ref + '"' + st + '><v>' + deger + '</v></c>';
  }
  /* Metinleri satır içi yazıyoruz: paylaşılan metin tablosu tutmaya gerek kalmıyor. */
  return '<c r="' + ref + '"' + st + ' t="inlineStr"><is><t xml:space="preserve">' +
    xmlKac(deger) + '</t></is></c>';
}

function sayfaYaz(sayfa) {
  const basliklar = sayfa.basliklar || null;
  const satirlar = sayfa.satirlar || [];
  const genislikler = sayfa.genislikler || [];
  const duz = sayfa.duz === true;   /* başlıksız, süssüz sayfa (açıklama metinleri) */

  const tumSatirlar = basliklar ? [basliklar].concat(satirlar) : satirlar;
  let enGenis = 0;
  for (const s of tumSatirlar) if (s && s.length > enGenis) enGenis = s.length;
  const sonSutun = sutunAd(Math.max(0, enGenis - 1));
  const sonSatir = Math.max(1, tumSatirlar.length);

  let x = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
    '<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"' +
    ' xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">' +
    '<dimension ref="A1:' + sonSutun + sonSatir + '"/>';

  /* Başlık satırını dondur: uzun listelerde aşağı inince başlıklar görünür kalsın. */
  x += '<sheetViews><sheetView workbookViewId="0">';
  if (basliklar && !duz) {
    x += '<pane ySplit="1" topLeftCell="A2" activePane="bottomLeft" state="frozen"/>' +
      '<selection pane="bottomLeft" activeCell="A2" sqref="A2"/>';
  }
  x += '</sheetView></sheetViews>';
  x += '<sheetFormatPr defaultRowHeight="15"/>';

  if (genislikler.length) {
    x += '<cols>';
    for (let i = 0; i < genislikler.length; i++) {
      x += '<col min="' + (i + 1) + '" max="' + (i + 1) +
        '" width="' + genislikler[i] + '" customWidth="1"/>';
    }
    x += '</cols>';
  }

  x += '<sheetData>';
  for (let i = 0; i < tumSatirlar.length; i++) {
    const satir = tumSatirlar[i] || [];
    const no = i + 1;
    const baslikMi = !!basliklar && i === 0 && !duz;
    const stil = duz ? 3 : (baslikMi ? 1 : 2);
    let hucreler = '';
    for (let j = 0; j < satir.length; j++) {
      hucreler += hucre(sutunAd(j) + no, satir[j], stil);
    }
    if (!hucreler) continue;
    x += '<row r="' + no + '"' + (baslikMi ? ' ht="22" customHeight="1"' : '') + '>' +
      hucreler + '</row>';
  }
  x += '</sheetData>';

  /* Süzme okları: müdür 500 öğrenci içinden sınıfa göre eleyebilsin. */
  if (basliklar && !duz && tumSatirlar.length > 1) {
    x += '<autoFilter ref="A1:' + sonSutun + sonSatir + '"/>';
  }

  x += '</worksheet>';
  return x;
}

function yaz(sayfalar) {
  if (!Array.isArray(sayfalar) || !sayfalar.length) {
    throw new Error('En az bir sayfa gerekli.');
  }
  const adlar = sayfalar.map((s, i) => sayfaAdiTemizle(s.ad, i + 1));

  let tipler = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
    '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">' +
    '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>' +
    '<Default Extension="xml" ContentType="application/xml"/>' +
    '<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>' +
    '<Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>';
  for (let i = 0; i < sayfalar.length; i++) {
    tipler += '<Override PartName="/xl/worksheets/sheet' + (i + 1) + '.xml"' +
      ' ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>';
  }
  tipler += '</Types>';

  const kokRels = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
    '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' +
    '<Relationship Id="rId1"' +
    ' Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument"' +
    ' Target="xl/workbook.xml"/></Relationships>';

  let kitap = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
    '<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"' +
    ' xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets>';
  for (let i = 0; i < adlar.length; i++) {
    kitap += '<sheet name="' + xmlKac(adlar[i]) + '" sheetId="' + (i + 1) +
      '" r:id="rId' + (i + 1) + '"/>';
  }
  kitap += '</sheets></workbook>';

  let kitapRels = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
    '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">';
  for (let i = 0; i < sayfalar.length; i++) {
    kitapRels += '<Relationship Id="rId' + (i + 1) + '"' +
      ' Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet"' +
      ' Target="worksheets/sheet' + (i + 1) + '.xml"/>';
  }
  kitapRels += '<Relationship Id="rId' + (sayfalar.length + 1) + '"' +
    ' Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles"' +
    ' Target="styles.xml"/></Relationships>';

  const dosyalar = [
    { ad: '[Content_Types].xml', veri: Buffer.from(tipler, 'utf8') },
    { ad: '_rels/.rels', veri: Buffer.from(kokRels, 'utf8') },
    { ad: 'xl/workbook.xml', veri: Buffer.from(kitap, 'utf8') },
    { ad: 'xl/_rels/workbook.xml.rels', veri: Buffer.from(kitapRels, 'utf8') },
    { ad: 'xl/styles.xml', veri: Buffer.from(STILLER, 'utf8') }
  ];
  for (let i = 0; i < sayfalar.length; i++) {
    dosyalar.push({
      ad: 'xl/worksheets/sheet' + (i + 1) + '.xml',
      veri: Buffer.from(sayfaYaz(sayfalar[i]), 'utf8')
    });
  }

  return zipYaz(dosyalar);
}

module.exports = { oku, yaz, sutunAd, sutunNo };
