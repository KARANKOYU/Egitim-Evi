/*
  MEB okul listesini (meb-okullar-master/meb-okullar.csv) uygulamanın
  kullandığı sıkıştırılmış JSON'a çevirir.

  Çalıştırma:  node araclar/okullari-hazirla.js

  Çıktı: data/okullar.json
  Biçim, 53 bin kaydı küçük tutmak için indeksli:
    { iller: [...], ilceler: [...], tipler: [...],
      okullar: [ [ilIndeksi, ilceIndeksi, tipIndeksi, "Okul Adı"], ... ] }
*/

const fs = require('fs');
const path = require('path');

const KOK = path.join(__dirname, '..');
const KAYNAK = path.join(KOK, 'meb-okullar-master', 'meb-okullar.csv');
const HEDEF = path.join(KOK, 'data', 'okullar.json');

/* Okul sayılmayan kayıtlar listeye alınmaz. */
const ATLANACAK_TIPLER = ['Milli Eğitim Müdürlüğü', 'Araştırma Merkezi'];

/* Tırnaklı alanları ve alan içindeki virgülleri doğru işleyen CSV ayrıştırıcı. */
function csvSatirlari(metin) {
  const satirlar = [];
  let alan = '';
  let satir = [];
  let tirnakta = false;

  for (let i = 0; i < metin.length; i++) {
    const c = metin[i];

    if (tirnakta) {
      if (c === '"') {
        if (metin[i + 1] === '"') { alan += '"'; i++; }   // kaçırılmış tırnak
        else tirnakta = false;
      } else alan += c;
      continue;
    }

    if (c === '"') { tirnakta = true; continue; }
    if (c === ',') { satir.push(alan); alan = ''; continue; }
    if (c === '\r') continue;
    if (c === '\n') { satir.push(alan); satirlar.push(satir); satir = []; alan = ''; continue; }
    alan += c;
  }
  if (alan.length || satir.length) { satir.push(alan); satirlar.push(satir); }
  return satirlar;
}

function calistir() {
  if (!fs.existsSync(KAYNAK)) {
    console.error('CSV bulunamadı: ' + KAYNAK);
    console.error('meb-okullar-master klasörünün proje içinde olduğundan emin ol.');
    process.exit(1);
  }

  console.log('CSV okunuyor...');
  const metin = fs.readFileSync(KAYNAK, 'utf8');
  const satirlar = csvSatirlari(metin);
  const baslik = satirlar.shift();

  const sut = {};
  baslik.forEach((ad, i) => { sut[ad.trim()] = i; });
  for (const gerekli of ['il_adi', 'ilce_adi', 'okul_adi', 'tip']) {
    if (sut[gerekli] === undefined) {
      console.error('CSV başlığında "' + gerekli + '" sütunu yok.');
      process.exit(1);
    }
  }

  const iller = [];
  const ilceler = [];
  const tipler = [];
  const ilIdx = new Map();
  const ilceIdx = new Map();
  const tipIdx = new Map();

  const sirala = (dizi, harita, deger) => {
    if (harita.has(deger)) return harita.get(deger);
    const i = dizi.length;
    dizi.push(deger);
    harita.set(deger, i);
    return i;
  };

  const okullar = [];
  let atlanan = 0, bozuk = 0;

  for (const s of satirlar) {
    if (s.length < baslik.length) { bozuk++; continue; }
    const il = (s[sut.il_adi] || '').trim();
    const ilce = (s[sut.ilce_adi] || '').trim();
    const ad = (s[sut.okul_adi] || '').trim();
    const tip = (s[sut.tip] || '').trim();

    if (!il || !ad) { bozuk++; continue; }
    if (ATLANACAK_TIPLER.indexOf(tip) >= 0) { atlanan++; continue; }

    okullar.push([
      sirala(iller, ilIdx, il),
      sirala(ilceler, ilceIdx, ilce),
      sirala(tipler, tipIdx, tip),
      ad
    ]);
  }

  /* Aynı okul birden fazla kez geçebiliyor; il+ilçe+ad üçlüsüne göre tekilleştir. */
  const gorulen = new Set();
  const tekil = [];
  for (const o of okullar) {
    const anahtar = o[0] + '|' + o[1] + '|' + o[3].toLocaleLowerCase('tr');
    if (gorulen.has(anahtar)) continue;
    gorulen.add(anahtar);
    tekil.push(o);
  }

  const cikti = {
    kaynak: 'MEB - meb-okullar-master',
    olusturma: new Date().toISOString().slice(0, 10),
    iller: iller,
    ilceler: ilceler,
    tipler: tipler,
    okullar: tekil
  };

  fs.mkdirSync(path.dirname(HEDEF), { recursive: true });
  fs.writeFileSync(HEDEF, JSON.stringify(cikti), 'utf8');

  const mb = (fs.statSync(HEDEF).size / 1048576).toFixed(2);
  console.log('');
  console.log('  Okul sayısı   : ' + tekil.length + ' (tekrar eden ' + (okullar.length - tekil.length) + ' kayıt birleştirildi)');
  console.log('  İl / ilçe     : ' + iller.length + ' il, ' + ilceler.length + ' ilçe');
  console.log('  Tipler        : ' + tipler.join(', '));
  console.log('  Atlanan       : ' + atlanan + ' (okul olmayan kayıt), ' + bozuk + ' bozuk satır');
  console.log('  Yazıldı       : data/okullar.json (' + mb + ' MB)');
  console.log('');
}

calistir();
