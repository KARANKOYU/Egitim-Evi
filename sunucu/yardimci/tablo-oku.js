'use strict';
/* Tablo dosyası okuma: .xlsx ve .xls (Excel), .ods (LibreOffice), .csv ve .txt.
   Hepsi aynı biçime çevrilir: [{ ad: sayfa adı, satirlar: [[hücre, ...], ...] }]
   Hücreler metindir; tarih hücresi "yyyy-aa-gg", sayı hücresi sayının kendisi.

   Sınırlar (bozuk ya da kötü niyetli dosyaya karşı): en fazla 20 bin satır,
   200 sütun; ODS'de "şu hücre 16 bin kez tekrar" gibi boş tekrarlar
   belleğe açılmaz. Zip açarken toplam boyut xlsx.zipOku'da sınırlı. */

const xlsx = require('./xlsx');
const { xlsOku } = require('./xls');

const EN_FAZLA_SATIR = 20000;
const EN_FAZLA_SUTUN = 200;
const EN_FAZLA_SAYFA = 20;
const TOPLAM_SATIR = 100000;      // bütün sayfalarda

/* Metin dosyası: UTF-8 (BOM'lu ya da BOM'suz). Türkçe Excel'in CSV'si çoğu
   zaman Windows-1254'tür; UTF-8 olarak çözülemiyorsa onunla okunur. */
function metinCoz(buf) {
  let s = buf.toString('utf8');
  if (s.indexOf('�') >= 0) {
    try { s = new TextDecoder('windows-1254').decode(buf); } catch (e) { /* UTF-8 kalır */ }
  }
  if (s.charCodeAt(0) === 0xFEFF) s = s.slice(1);
  return s;
}

/* ---------------- ODS ---------------- */

function odsHucreMetni(ic) {
  return xlsx.xmlCoz(String(ic || '')
    .replace(/<text:s\b[^>]*text:c="(\d+)"[^>]*\/>/g, (m, n) => ' '.repeat(Math.min(Number(n) || 1, 50)))
    .replace(/<text:s\b[^>]*\/>/g, ' ')
    .replace(/<text:tab\b[^>]*\/>/g, '\t')
    .replace(/<text:line-break\b[^>]*\/>/g, '\n')
    .replace(/<\/text:p>/g, '\n')
    .replace(/<[^>]+>/g, '')).trim();
}

function ozellik(ozn, ad) {
  const m = new RegExp('\\b' + ad + '="([^"]*)"').exec(ozn);
  return m ? xlsx.xmlCoz(m[1]) : '';
}

function odsOku(buf) {
  const zip = xlsx.zipOku(buf);
  if (!zip['content.xml']) throw new Error('Bu bir ODS dosyası değil.');
  const xml = zip['content.xml'].toString('utf8');
  const sayfalar = [];
  let toplam = 0;
  const tabloRe = /<table:table\b([^>]*)>([\s\S]*?)<\/table:table>/g;
  let t;
  while ((t = tabloRe.exec(xml)) && sayfalar.length < EN_FAZLA_SAYFA) {
    const satirlar = [];
    let bosBekleyen = 0;   // araya giren boş satırlar: ancak sonra dolu satır gelirse eklenir
    const satirRe = /<table:table-row\b([^>]*?)(?:\/>|>([\s\S]*?)<\/table:table-row>)/g;
    let r;
    while ((r = satirRe.exec(t[2]))) {
      const tekrarSatir = Math.max(1, Number(ozellik(r[1], 'table:number-rows-repeated')) || 1);
      const hucreler = [];
      let sutun = 0;
      const hucreRe = /<table:(?:covered-)?table-cell\b([^>]*?)(?:\/>|>([\s\S]*?)<\/table:(?:covered-)?table-cell>)/g;
      let c;
      while ((c = hucreRe.exec(r[2] || '')) && sutun < EN_FAZLA_SUTUN) {
        const tekrar = Math.max(1, Number(ozellik(c[1], 'table:number-columns-repeated')) || 1);
        const tur = ozellik(c[1], 'office:value-type');
        let deger;
        if (tur === 'date') deger = ozellik(c[1], 'office:date-value').slice(0, 10);
        else if (tur === 'float' || tur === 'percentage' || tur === 'currency') deger = ozellik(c[1], 'office:value');
        else if (tur === 'boolean') deger = ozellik(c[1], 'office:boolean-value') === 'true' ? 'EVET' : 'HAYIR';
        else deger = odsHucreMetni(c[2]);
        if (deger === '') { sutun += tekrar; continue; }
        for (let i = 0; i < tekrar && sutun < EN_FAZLA_SUTUN; i++) hucreler[sutun++] = deger;
      }
      for (let i = 0; i < hucreler.length; i++) if (hucreler[i] === undefined) hucreler[i] = '';
      if (!hucreler.length) { bosBekleyen += tekrarSatir; continue; }
      for (let i = 0; i < bosBekleyen && satirlar.length < EN_FAZLA_SATIR; i++) satirlar.push([]);
      bosBekleyen = 0;
      for (let i = 0; i < Math.min(tekrarSatir, 1000) && satirlar.length < EN_FAZLA_SATIR; i++) satirlar.push(hucreler.slice());
      if (satirlar.length >= EN_FAZLA_SATIR) break;
    }
    toplam += satirlar.length;
    if (toplam > TOPLAM_SATIR) throw new Error('Dosya çok büyük. Listeyi bölüp birkaç dosya hâlinde yükle.');
    sayfalar.push({ ad: ozellik(t[1], 'table:name') || 'Sayfa' + (sayfalar.length + 1), satirlar });
  }
  if (!sayfalar.length) throw new Error('ODS dosyasında okunabilir sayfa yok.');
  return sayfalar;
}

/* ---------------- CSV ---------------- */

function csvOku(buf) {
  const s = metinCoz(buf);
  const ilk = s.split(/\r?\n/, 1)[0] || '';
  /* Ayırıcı: başlık satırında en çok geçen (Türkçe Excel ";" kullanır). */
  const say = ch => ilk.split(ch).length - 1;
  const ayirici = [';', '\t', ','].reduce((a, b) => (say(b) > say(a) ? b : a), ',');
  const satirlar = [];
  let satir = [], hucre = '', tirnak = false;
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    if (tirnak) {
      if (ch === '"') {
        if (s[i + 1] === '"') { hucre += '"'; i++; } else tirnak = false;
      } else hucre += ch;
      continue;
    }
    if (ch === '"' && hucre === '') { tirnak = true; continue; }
    if (ch === ayirici) { if (satir.length < EN_FAZLA_SUTUN) satir.push(hucre); hucre = ''; continue; }
    if (ch === '\n' || ch === '\r') {
      if (ch === '\r' && s[i + 1] === '\n') i++;
      if (satir.length < EN_FAZLA_SUTUN) satir.push(hucre);
      satirlar.push(satir);
      satir = []; hucre = '';
      if (satirlar.length >= EN_FAZLA_SATIR) break;
      continue;
    }
    hucre += ch;
  }
  if (hucre !== '' || satir.length) { satir.push(hucre); satirlar.push(satir); }
  return [{ ad: 'Liste', satirlar: satirlar.map(r => r.map(x => x.trim())) }];
}

/* ---------------- TXT: alt alta isim listesi ----------------
   Her satır bir kişi: "Ahmet Sami Yılmaz" ya da "Ahmet Yılmaz 12345678901".
   Baştaki sıra numarası ("1." "12)") atılır, satırdaki 11 haneli sayı T.C.
   no sayılır. Son kelime soyad, öncesi ad olur. */
function txtOku(buf) {
  const satirlar = [['Ad', 'Soyad', 'T.C. Kimlik No']];
  for (const ham of metinCoz(buf).split(/\r?\n/)) {
    let s = ham.replace(/\t/g, ' ').trim();
    if (!s) continue;
    let tc = '';
    const m = /(^|\D)([1-9]\d{10})(?!\d)/.exec(s);
    if (m) {
      tc = m[2];
      const bas = m.index + m[1].length;
      s = s.slice(0, bas) + ' ' + s.slice(bas + 11);
    }
    s = s.replace(/^\s*\d{1,4}\s*[.)\-]\s*/, '').replace(/[;,|]+/g, ' ').replace(/\s+/g, ' ').trim();
    const kelimeler = s.split(' ').filter(Boolean);
    if (!kelimeler.length && !tc) continue;
    const soyad = kelimeler.length > 1 ? kelimeler.pop() : '';
    satirlar.push([kelimeler.join(' '), soyad, tc]);
    if (satirlar.length > EN_FAZLA_SATIR) break;
  }
  return [{ ad: 'Liste', satirlar }];
}

/* Dosyayı uzantısına (yoksa içeriğine) göre okur. */
function tabloOku(buf, dosyaAdi) {
  const u = String(dosyaAdi || '').toLowerCase().split('.').pop();
  const zipMi = buf.length > 4 && buf.readUInt32LE(0) === 0x04034b50;
  if (u === 'ods' || (zipMi && buf.indexOf('application/vnd.oasis.opendocument') >= 0 && buf.indexOf('application/vnd.oasis.opendocument') < 200)) {
    return odsOku(buf);
  }
  if (u === 'xlsx' || zipMi) return xlsx.oku(buf);
  /* Eski Excel (97-2003): birleşik belge imzasıyla tanınır. */
  const cfbMi = buf.length > 8 && buf.readUInt32LE(0) === 0xE011CFD0 && buf.readUInt32LE(4) === 0xE11AB1A1;
  if (u === 'xls' || cfbMi) return xlsOku(buf);
  if (u === 'csv') return csvOku(buf);
  if (u === 'txt') return txtOku(buf);
  /* Uzantı yok ya da bilinmiyor: ilk satırda ayırıcı varsa CSV, yoksa isim listesi. */
  const ilk = metinCoz(buf.slice(0, 2000)).split(/\r?\n/, 1)[0] || '';
  return /[;\t,]/.test(ilk) ? csvOku(buf) : txtOku(buf);
}

module.exports = { tabloOku, odsOku, csvOku, txtOku, metinCoz };
