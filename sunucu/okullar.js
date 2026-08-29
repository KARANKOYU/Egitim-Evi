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

