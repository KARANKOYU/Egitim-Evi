'use strict';
/* MEB okul listesi (data/okullar.json) ve okul arama.
   67 bin okul bellekte tutulur; arama büyük/küçük harfe, Türkçe harflere,
   yazım hatasına ve kısaltmalara dayanıklıdır (yardimci/bulanik-arama.js). */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { DATA } = require('./yollar');
const { AramaDizini } = require('./yardimci/bulanik-arama');

/* ============ MEB okul listesi ============
   data/okullar.json depoda yer almaz; kurulumu yapan bilgisayardan kopyalanır.
   53 bin kayit bellekte tutulur; aramayi hizlandirmak icin adlar bir kez
   sadelestirilip (Turkce harfler duzlenerek) yaninda saklanir. */

const OKUL_DOSYA = path.join(DATA, 'okullar.json');
let okulVeri = null;   // yalnızca bu dosyada kullanılır          // { iller, ilceler, tipler, okullar }
const okulAra = [];     // dışarıya verilir; yeniden yükleme içini değiştirir             // { id, ad, sade, il, ilce, tip }
let okulDizini = new AramaDizini([]);   // adlardaki kelimelerin sözlüğü (okullariYukle kurar)

/* "Ögretmen" / "ogretmen" / "ÖĞRETMEN" hepsi ayni sonuca gitsin diye
   Turkce harfleri duzler. Sunucu ve tarayici ayni kurali kullanir. */
const TR_SADE_HARF = {
  'ı': 'i', 'İ': 'i', 'I': 'i', 'ş': 's', 'Ş': 's', 'ğ': 'g', 'Ğ': 'g',
  'ü': 'u', 'Ü': 'u', 'ö': 'o', 'Ö': 'o', 'ç': 'c', 'Ç': 'c',
  'â': 'a', 'Â': 'a', 'î': 'i', 'Î': 'i', 'û': 'u', 'Û': 'u'
};

function sadelestir(metin) {
  const s = String(metin == null ? '' : metin);
  let out = '';
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    out += (TR_SADE_HARF[c] !== undefined) ? TR_SADE_HARF[c] : c;
  }
  return out.toLowerCase().trim();
}

/* Arama için daha gevşek sadeleştirme: noktalama boşluğa döner, art arda
   boşluk teke iner, şapka ve noktalar düşer. "M.Akif", "Mehmet  Âkif",
   "MEHMET AKİF" hepsi aynı kelimelere ayrılır. Okul kimliği sadelestir ile
   üretildiği için o kural değişmez; yoksa kayıtlı okulların kimliği kayardı.
   Tarayıcıdaki okul aramasında (05-giris.js) aynı kural var. */
function aramaSade(metin) {
  return String(metin == null ? '' : metin)
    .replace(/[ıİI]/g, 'i')
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

/* MEB listesinde birkaç yüz okulun adı tamamen büyük harfle yazılmış
   ("ÇAM İLKOKULU"). Aramada ve kayıtta öbürleri gibi görünsün diye kelime
   başları büyük yazılır ("Çam İlkokulu"). Yalnızca TAMAMI büyük olan adlara
   dokunulur; "TOBB Yavuz Selim Ortaokulu" gibi kısaltmalar kalır. Okul
   kimliği özgün addan üretildiği için değişmez. */
function adDuzelt(ad) {
  if (!/[A-ZÇĞİÖŞÜ]{3}/.test(ad) || ad !== ad.toLocaleUpperCase('tr')) return ad;
  return ad.split(' ').map((k, i) => {
    if (/^[IVXL]+\.?$/.test(k)) return k;                          // "II. Kademe"
    const kucuk = k.toLocaleLowerCase('tr');
    if (i > 0 && (kucuk === 've' || kucuk === 'ile')) return kucuk;
    return kucuk.replace(/(^|[.\-(/])(\p{L})/gu, (m, once, harf) => once + harf.toLocaleUpperCase('tr'));
  }).join(' ');
}

/* il|ilce|ad uclusunden sabit bir kimlik uretir. Liste yeniden olusturulsa
   bile ayni okul ayni kimligi alir, kayitli hesaplar kopmaz. */
function okulKimligi(il, ilce, ad) {
  return 'meb_' + crypto.createHash('sha1')
    .update(sadelestir(il) + '|' + sadelestir(ilce) + '|' + sadelestir(ad))
    .digest('hex').slice(0, 12);
}

function okullariYukle() {
  if (!fs.existsSync(OKUL_DOSYA)) {
    console.log('');
    console.log('  ! data/okullar.json yok - okul listesi devre disi.');
    console.log('    Dosyayi kurulumu yapan bilgisayardan data/ klasorune kopyala.');
    console.log('');
    return;
  }
  try {
    okulVeri = JSON.parse(fs.readFileSync(OKUL_DOSYA, 'utf8'));
    const { iller, ilceler, tipler, okullar } = okulVeri;
    /* Eski listelerde bu alanlar yok; olmayınca sorun çıkarmasın. */
    const resmiTurler = okulVeri.resmiTurler || [];
    okulAra.length = 0; Array.prototype.push.apply(okulAra, new Array(okullar.length));
    let ozelSayaci = 0;
    for (let i = 0; i < okullar.length; i++) {
      const o = okullar[i];
      const il = iller[o[0]] || '';
      const ilce = ilceler[o[1]] || '';
      const tip = tipler[o[2]] || '';
      const ad = adDuzelt(o[3]);
      const ozel = o[4] === 1;
      if (ozel) ozelSayaci++;
      okulAra[i] = {
        id: okulKimligi(il, ilce, o[3]),
        ad: ad, sade: sadelestir(ad), il: il, ilce: ilce,
        sadeIlce: sadelestir(ilce), tip: tip,
        ozel: ozel,
        kod: o[5] || '',
        resmiTur: (o[6] !== undefined && resmiTurler[o[6]]) ? resmiTurler[o[6]] : tip
      };
    }
    okulDizini = new AramaDizini(okulAra.map(o => ({ ad: o.ad, yer: o.il + ' ' + o.ilce })));
    console.log('  Okul listesi: ' + okulAra.length + ' okul yuklendi (' +
      iller.length + ' il, ' + ozelSayaci + ' ozel)');
  } catch (e) {
    console.error('okullar.json okunamadi:', e.message);
    okulVeri = null;
    okulAra.length = 0; Array.prototype.push.apply(okulAra, []);
    okulDizini = new AramaDizini([]);
  }
}

