'use strict';
/* Okul listesini MEB'in kendi kaynaklarından baştan çeker.

   İki kaynak var:
     1. Devlet okulları  — meb.gov.tr/baglantilar/okullar (DataTables ucu)
        İl başına tek istek; kurum kodunu da veriyor.
     2. Özel okullar     — ookgm.meb.gov.tr/kurumlar.php
        İl başına sayfalı; ilçe, tür, adres, telefon veriyor.

   Sonuç data/okullar.json dosyasına yazılır. Biçim eskisiyle aynı,
   sonuna iki alan eklendi: özel mi, kurum kodu.

   Kullanım:  node araclar/okullari-cek.js
              node araclar/okullari-cek.js --il 7      (tek il, deneme icin)
*/

const fs = require('fs');
const path = require('path');

const PROJE = path.join(__dirname, '..');
const CIKTI = path.join(PROJE, 'data', 'okullar.json');

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
  '(KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36';

/* MEB'in sunucusunu yormayalım: istekler arası bekleme ve tek iş parçacığı. */
const BEKLE_MS = 350;
const DENEME = 3;

const bekle = ms => new Promise(r => setTimeout(r, ms));

function log(s) { process.stdout.write(s + '\n'); }

/* ============ ortak ============ */

async function sabirla(isim, fn) {
  let sonHata;
  for (let i = 1; i <= DENEME; i++) {
    try {
      return await fn();
    } catch (e) {
      sonHata = e;
      if (i < DENEME) {
        log('    ' + isim + ' basarisiz (' + e.message + '), ' + (i * 3) + ' sn sonra tekrar');
        await bekle(i * 3000);
      }
    }
  }
  throw sonHata;
}

/* Türkçe kurallarıyla ilk harf büyük: "ÖZEL RENK ORTAOKULU" -> "Özel Renk Ortaokulu" */
function basHarfBuyuk(metin) {
  return String(metin || '')
    .toLocaleLowerCase('tr')
    .replace(/(^|[\s\-\/(.])([\p{L}])/gu,
      (t, onek, harf) => onek + harf.toLocaleUpperCase('tr'))
    .replace(/\s+/g, ' ')
    .trim();
}

/* İki kaynak bazı illeri farklı adlandırıyor; aynı il iki kez listelenmesin. */
const IL_ESANLAM = {
  'Afyon': 'Afyonkarahisar',
  'İçel': 'Mersin',
  'Antep': 'Gaziantep',
  'Maraş': 'Kahramanmaraş',
  'Urfa': 'Şanlıurfa'
};

function ilDuzelt(ad) {
  return IL_ESANLAM[ad] || ad;
}

function temiz(s) {
  return String(s == null ? '' : s).replace(/\s+/g, ' ').trim();
}

/* ============ 1) devlet okulları ============ */

async function devletIl(ilKodu) {
  const g = new URLSearchParams();
  g.set('draw', '1');
  g.set('columns[0][data]', 'OKUL_ADI');
  g.set('columns[0][searchable]', 'true');
  g.set('columns[0][orderable]', 'true');
  g.set('order[0][column]', '0');
  g.set('order[0][dir]', 'asc');
  g.set('start', '0');
  g.set('length', '100000');
  g.set('search[value]', '');
  g.set('search[regex]', 'false');
  g.set('il', String(ilKodu));
  g.set('ilce', '0');

  const r = await fetch('https://www.meb.gov.tr/baglantilar/okullar/okullar_ajax.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      'X-Requested-With': 'XMLHttpRequest',
      'User-Agent': UA,
      'Accept': 'application/json, text/javascript, */*; q=0.01',
      'Referer': 'https://www.meb.gov.tr/baglantilar/okullar/index.php',
      'Origin': 'https://www.meb.gov.tr'
    },
    body: g.toString()
  });
  if (!r.ok) throw new Error('HTTP ' + r.status);
  const metin = await r.text();
  if (!metin) throw new Error('bos cevap');
  const j = JSON.parse(metin);
  return j.data || [];
}

/* "ANTALYA - AKSEKİ - Akseki Anadolu Lisesi" -> il / ilce / ad
   Okul adının içinde de " - " geçebilir; ilk iki parça il ve ilçe,
   kalanı okul adı sayılıyor. */
function devletAyristir(kayit) {
  const parcalar = String(kayit.OKUL_ADI || '').split(' - ');
  if (parcalar.length < 3) return null;
  const il = temiz(parcalar[0]);
  const ilce = temiz(parcalar[1]);
  const ad = temiz(parcalar.slice(2).join(' - '));
  if (!il || !ad) return null;

  /* YOL: "07/02/700420" — sonuncusu kurum kodu */
  let kod = '';
  const yol = String(kayit.YOL || '').split('/');
  if (yol.length) kod = temiz(yol[yol.length - 1]);

  return { il: ilDuzelt(basHarfBuyuk(il)), ilce: basHarfBuyuk(ilce), ad: ad, kod: kod, ozel: 0 };
}

/* Devlet okullarının türü adından çıkarılıyor; kaynakta ayrı alan yok. */
function turBul(ad) {
  const a = ad.toLocaleLowerCase('tr');
  if (/bilim ve sanat|sanat merkezi|akşam sanat/.test(a)) return 'Sanat Okulu';
  if (/halk eğitim|hem\b|olgunlaşma/.test(a)) return 'Halk Eğitim Merkezi';
  if (/mesleki eğitim merkezi|mesem/.test(a)) return 'Mesleki Eğitim Merkezi';
  if (/anaokul|ana okul|okul öncesi|kreş/.test(a)) return 'Anaokulu';
  if (/rehberlik|ram\b/.test(a)) return 'Rehberlik Araştırma Merkezi';
  if (/özel eğitim/.test(a) && /uygulama|iş uygulama/.test(a)) return 'Özel Eğitim Okulu';
  if (/mesleki ve teknik|meslek lisesi|ticaret meslek|teknik anadolu|çok programlı/.test(a)) return 'Meslek Lisesi';
  if (/imam hatip/.test(a)) return 'İmam Hatip';
  if (/lise|lisesi/.test(a)) return 'Lise';
  if (/ortaokul|orta okul|imam-hatip ortaokulu/.test(a)) return 'Ortaokul';
  if (/ilkokul|ilk okul|ilköğretim/.test(a)) return 'İlkokul';
  return 'Diğer';
}

/* Özel okulların resmî türü çok ayrıntılı ("Özel Fen ve Teknoloji Lisesi"
   gibi). Arama filtresinde devlet okullarıyla aynı kovalara düşsün diye
   sadeleştiriyoruz; resmî tür ayrı alanda saklanıyor. */
function basitTur(resmi, ad) {
  const r = String(resmi || '').toLocaleLowerCase('tr');
  if (/okul öncesi|anaokul|oyun evi|çocuk etkinlik/.test(r)) return 'Anaokulu';
  if (/ilkokul/.test(r)) return 'İlkokul';
  if (/ortaokul/.test(r)) return 'Ortaokul';
  if (/mesleki ve teknik|meslek/.test(r)) return 'Meslek Lisesi';
  if (/özel eğitim/.test(r)) return 'Özel Eğitim Okulu';
  if (/imam hatip/.test(r)) return 'İmam Hatip';
  if (/lise/.test(r)) return 'Lise';
  if (/milletlerarası/.test(r)) return 'Milletlerarası Okul';
  /* Tanımadıysak okul adından çıkarmayı dene. */
  const t = turBul(ad);
  return t === 'Diğer' ? 'Diğer' : t;
}

/* ============ 2) özel okullar ============ */

async function ookgmIlleri() {
  const r = await fetch('https://ookgm.meb.gov.tr/kurumlar.php?tur=okul', {
    headers: { 'User-Agent': UA }
  });
  const h = await r.text();
  const blok = h.match(/<select[^>]*name=["']il["'][\s\S]*?<\/select>/);
  if (!blok) throw new Error('il listesi bulunamadi');
  const iller = [];
  const re = /<option[^>]*value=["']([^"']+)["'][^>]*>/g;
  let m;
  while ((m = re.exec(blok[0]))) {
    const v = temiz(m[1]);
    if (v && v !== '0') iller.push(v);
  }
  return iller;
}

/* Tablodaki satırları çıkarır: sıra, ilçe, kurum adı, tür, adres, telefon */
function tabloAyristir(html) {
  const tablo = html.match(/<table[\s\S]*?<\/table>/);
  if (!tablo) return [];
  const satirlar = [];
  const trRe = /<tr[^>]*>([\s\S]*?)<\/tr>/g;
  let m;
  while ((m = trRe.exec(tablo[0]))) {
    const hucreler = [];
    const tdRe = /<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/g;
    let h;
    while ((h = tdRe.exec(m[1]))) {
      hucreler.push(temiz(
        h[1].replace(/<select[\s\S]*?<\/select>/g, '')
          .replace(/<[^>]+>/g, ' ')
          .replace(/&nbsp;/g, ' ')
          .replace(/&amp;/g, '&')
          .replace(/&#(\d+);/g, (x, d) => String.fromCharCode(Number(d)))
      ));
    }
    if (hucreler.length >= 4) satirlar.push(hucreler);
  }
  return satirlar;
}

async function ozelIl(ilAdi) {
  const cikti = [];
  for (let sayfa = 1; sayfa <= 60; sayfa++) {
    const adres = 'https://ookgm.meb.gov.tr/kurumlar.php?sayfa=' + sayfa +
      '&tur=okul&il=' + encodeURIComponent(ilAdi) + '&tur2=0';
    const html = await sabirla(ilAdi + ' s' + sayfa, async () => {
      const r = await fetch(adres, { headers: { 'User-Agent': UA } });
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r.text();
    });

    const satirlar = tabloAyristir(html).filter(s => /^\d+$/.test(s[0]));
    if (!satirlar.length) break;

    for (const s of satirlar) {
      const ad = temiz(s[2]);
      if (!ad) continue;
      const resmi = temiz(s[3]) || 'Özel Okul';
      cikti.push({
        il: ilDuzelt(basHarfBuyuk(ilAdi)),
        ilce: basHarfBuyuk(s[1]),
        ad: basHarfBuyuk(ad),
        tip: basitTur(resmi, ad),
        resmiTur: resmi,
        kod: '',
        ozel: 1
      });
    }
    if (satirlar.length < 250) break;
    await bekle(BEKLE_MS);
  }
  return cikti;
}

/* ============ birleştir ve yaz ============ */

function derle(kayitlar) {
  const iller = [], ilceler = [], tipler = [], resmiTurler = [];
  const ilH = new Map(), ilceH = new Map(), tipH = new Map(), resmiH = new Map();
  const sira = (liste, harita, deger) => {
    if (harita.has(deger)) return harita.get(deger);
    const i = liste.length;
    liste.push(deger);
    harita.set(deger, i);
    return i;
  };

  const gorulen = new Set();
  const okullar = [];
  for (const k of kayitlar) {
    /* Aynı okul iki kaynakta da varsa bir kez alsın. */
    const anahtar = (k.il + '|' + k.ilce + '|' + k.ad).toLocaleLowerCase('tr');
    if (gorulen.has(anahtar)) continue;
    gorulen.add(anahtar);

    okullar.push([
      sira(iller, ilH, k.il),
      sira(ilceler, ilceH, k.ilce),
      sira(tipler, tipH, k.tip),
      k.ad,
      k.ozel,
      k.kod,
      sira(resmiTurler, resmiH, k.resmiTur || k.tip)
    ]);
  }

  okullar.sort((a, b) =>
    iller[a[0]].localeCompare(iller[b[0]], 'tr') ||
    ilceler[a[1]].localeCompare(ilceler[b[1]], 'tr') ||
    a[3].localeCompare(b[3], 'tr'));

  return {
    kaynak: 'MEB - meb.gov.tr/baglantilar/okullar + ookgm.meb.gov.tr',
    olusturma: new Date().toISOString().slice(0, 10),
    iller, ilceler, tipler, resmiTurler, okullar
  };
}

/* ============ ana akış ============ */

(async () => {
  const argv = process.argv.slice(2);
  const tekIlIdx = argv.indexOf('--il');
  const tekIl = tekIlIdx >= 0 ? Number(argv[tekIlIdx + 1]) : 0;

  const hepsi = [];

  log('');
  log('=============== DEVLET OKULLARI ===============');
  const ilKodlari = tekIl ? [tekIl] : Array.from({ length: 81 }, (_, i) => i + 1);
  let devletSayi = 0;
  for (const kod of ilKodlari) {
    try {
      const veri = await sabirla('il ' + kod, () => devletIl(kod));
      let n = 0;
      for (const kayit of veri) {
        const o = devletAyristir(kayit);
        if (!o) continue;
        o.tip = turBul(o.ad);
        hepsi.push(o);
        n++;
      }
      devletSayi += n;
      const ilAd = veri.length ? String(veri[0].OKUL_ADI).split(' - ')[0] : '?';
      log('  ' + String(kod).padStart(2) + '  ' + ilAd.padEnd(20) + String(n).padStart(5) + ' okul');
    } catch (e) {
      log('  ' + String(kod).padStart(2) + '  ALINAMADI: ' + e.message);
    }
    await bekle(BEKLE_MS);
  }
  log('  --> devlet toplam: ' + devletSayi);

  log('');
  log('=============== OZEL OKULLAR ===============');
  let ozelSayi = 0;
  try {
    const iller = await ookgmIlleri();
    log('  ' + iller.length + ' il bulundu');
    const hedef = tekIl ? iller.filter(x => /ANTALYA/i.test(x)) : iller;
    for (const ilAdi of hedef) {
      try {
        const veri = await ozelIl(ilAdi);
        hepsi.push(...veri);
        ozelSayi += veri.length;
        log('  ' + ilAdi.padEnd(22) + String(veri.length).padStart(5) + ' ozel okul');
      } catch (e) {
        log('  ' + ilAdi.padEnd(22) + ' ALINAMADI: ' + e.message);
      }
      await bekle(BEKLE_MS);
    }
  } catch (e) {
    log('  ozel okul kaynagina ulasilamadi: ' + e.message);
  }
  log('  --> ozel toplam: ' + ozelSayi);

  log('');
  log('=============== YAZILIYOR ===============');
  const veri = derle(hepsi);
  log('  benzersiz okul : ' + veri.okullar.length);
  log('  il             : ' + veri.iller.length);
  log('  ilce           : ' + veri.ilceler.length);
  log('  tur            : ' + veri.tipler.length);
  const dagilim = {};
  for (const o of veri.okullar) {
    const t = veri.tipler[o[2]];
    dagilim[t] = (dagilim[t] || 0) + 1;
  }
  Object.entries(dagilim).sort((a, b) => b[1] - a[1])
    .forEach(([t, n]) => log('      ' + t.padEnd(30) + String(n).padStart(7)));
  const ozelAdet = veri.okullar.filter(o => o[4] === 1).length;
  log('  ozel okul      : ' + ozelAdet);
  log('  devlet okulu   : ' + (veri.okullar.length - ozelAdet));

  if (!tekIl) {
    if (fs.existsSync(CIKTI)) {
      const yedek = CIKTI.replace(/\.json$/, '-onceki.json');
      fs.copyFileSync(CIKTI, yedek);
      log('  eski liste yedeklendi: ' + path.basename(yedek));
    }
    fs.writeFileSync(CIKTI, JSON.stringify(veri));
    log('  yazildi: ' + CIKTI + '  (' +
      (fs.statSync(CIKTI).size / 1024 / 1024).toFixed(1) + ' MB)');
  } else {
    log('  (--il deneme kipi: dosya yazilmadi)');
  }
  log('');
})().catch(e => { console.error('HATA:', e.message, e.stack); process.exit(1); });
