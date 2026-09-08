'use strict';
/* MEB okul listesi (data/okullar.json) ve kayıt ekranındaki okul arama.
   67 bin okul bellekte sadeleştirilmiş adla tutulur; arama Türkçe
   karakterlere ve yazım farklarına dayanıklıdır. */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { DATA } = require('./yollar');

/* ============ MEB okul listesi ============
   data/okullar.json, araclar/okullari-hazirla.js ile CSV'den uretilir.
   53 bin kayit bellekte tutulur; aramayi hizlandirmak icin adlar bir kez
   sadelestirilip (Turkce harfler duzlenerek) yaninda saklanir. */

const OKUL_DOSYA = path.join(DATA, 'okullar.json');
let okulVeri = null;   // yalnızca bu dosyada kullanılır          // { iller, ilceler, tipler, okullar }
const okulAra = [];     // dışarıya verilir; yeniden yükleme içini değiştirir             // { id, ad, sade, il, ilce, tip }

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
    console.log('    Olusturmak icin:  node araclar/okullari-hazirla.js');
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
      const ad = o[3];
      const ozel = o[4] === 1;
      if (ozel) ozelSayaci++;
      okulAra[i] = {
        id: okulKimligi(il, ilce, ad),
        ad: ad, sade: sadelestir(ad), il: il, ilce: ilce,
        sadeIlce: sadelestir(ilce), tip: tip,
        ozel: ozel,
        kod: o[5] || '',
        resmiTur: (o[6] !== undefined && resmiTurler[o[6]]) ? resmiTurler[o[6]] : tip
      };
    }
    console.log('  Okul listesi: ' + okulAra.length + ' okul yuklendi (' +
      iller.length + ' il, ' + ozelSayaci + ' ozel)');
  } catch (e) {
    console.error('okullar.json okunamadi:', e.message);
    okulVeri = null;
    okulAra.length = 0; Array.prototype.push.apply(okulAra, []);
  }
}

/* Arama: il / ilce / tip ile daraltilabilir, ad icinde gecen metne gore suzer.
   Once adin basindan eslesenler gelir, sonra icinde gecenler. */
function okulArama(sorgu, il, ilce, tip, limit) {
  const q = sadelestir(sorgu);
  const qIlce = sadelestir(ilce);
  const bastan = [];
  const icinde = [];
  const enFazla = Math.min(Math.max(limit || 30, 1), 100);
  let toplam = 0;

  for (let i = 0; i < okulAra.length; i++) {
    const o = okulAra[i];
    if (il && o.il !== il) continue;
    if (qIlce && o.sadeIlce !== qIlce) continue;
    if (tip && o.tip !== tip) continue;

    if (q) {
      const yer = o.sade.indexOf(q);
      if (yer < 0) continue;
      toplam++;
      if (bastan.length + icinde.length < enFazla * 3) {
        (yer === 0 ? bastan : icinde).push(o);
      }
    } else {
      toplam++;
      if (bastan.length < enFazla * 3) bastan.push(o);
    }
  }

  const sonuc = bastan.concat(icinde).slice(0, enFazla);
  return {
    toplam: toplam,
    okullar: sonuc.map(o => ({
      id: o.id, ad: o.ad, il: o.il, ilce: o.ilce, tip: o.tip,
      ozel: o.ozel ? 1 : 0, resmiTur: o.resmiTur, kod: o.kod
    }))
  };
}

function okulKimlikBul(id) {
  const hedef = String(id || '');
  for (let i = 0; i < okulAra.length; i++) if (okulAra[i].id === hedef) return okulAra[i];
  return null;
}


module.exports = {
  OKUL_DOSYA,
  okulVeri,
  okulAra,
  TR_SADE_HARF,
  sadelestir,
  okulKimligi,
  okullariYukle,
  okulArama,
  okulKimlikBul
};
