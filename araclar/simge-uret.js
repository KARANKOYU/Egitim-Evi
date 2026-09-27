/*
  Uygulama simgesini üretir — dışarıdan paket kullanmadan.

  Çalıştırma:  node araclar/simge-uret.js
  Çıktı: public/simge.svg (vektör), public/simge-192.png, public/simge-512.png,
         public/simge-maskeli-512.png, public/simge-rozet.png (bildirim rozeti)

  Çizim: kırmızı zeminde beyaz ev. Bacası var, kapısı hafif aralık; aralıktan
  içerideki sarı ışık görünüyor ve zemine düşüyor ("kapımız herkese açık").

  Tarayıcı resimleri bir yıl önbellekte tutar (sunucu/http.js). Çizim değişince
  sayfalardaki (index.html dahil bütün .html'ler), manifest.json'daki ve sw.js'teki
  (bildirim rozeti simge-rozet.png dahil) "?v=" sayısını bir artır ki eski simge
  takılı kalmasın; sw.js'te SURUM da artar. Hepsi aynı sayıyı taşır; ?v'siz simge
  bağlantısı kalmamalı:  grep -rn "simge-[a-z0-9-]*\.png\"\|simge-[a-z0-9-]*\.png'" public

  Ev 0..100'lük bir iç alanda tanımlı (aşağıdaki EV listesi). SVG de PNG'ler de
  bu tek listeden çizilir; biri değişip öbürü eski kalamaz. Android'deki simgeler
  (Egitim-Evi-App: simge_on, simge_tek, simge_marka, bildirim_simge) aynı
  sayılarla elle yazılmıştır; burada ölçü değişirse onlar da güncellenmeli.

  PNG'yi elle kuruyoruz: her pikseli 8x8 noktadan örnekleyip (kenar yumuşatma)
  boyuyoruz, sonra imza + IHDR + IDAT (zlib ile sıkıştırılmış tarama satırları)
  + IEND yazıyoruz. Node'un kendi zlib modülü yeterli.
*/

const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const CIKTI = path.join(__dirname, '..', 'public');

/* ---- PNG yazımı ---- */

function crc32(buf) {
  let c, tablo = crc32.tablo;
  if (!tablo) {
    tablo = crc32.tablo = [];
    for (let n = 0; n < 256; n++) {
      c = n;
      for (let k = 0; k < 8; k++) c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
      tablo[n] = c >>> 0;
    }
  }
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) crc = tablo[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

function chunk(tur, veri) {
  const uzunluk = Buffer.alloc(4);
  uzunluk.writeUInt32BE(veri.length, 0);
  const turBuf = Buffer.from(tur, 'ascii');
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(Buffer.concat([turBuf, veri])), 0);
  return Buffer.concat([uzunluk, turBuf, veri, crcBuf]);
}

/* piksel: (x, y) -> [r, g, b, a] */
function pngYaz(boyut, piksel) {
  const satirlar = [];
  for (let y = 0; y < boyut; y++) {
    const satir = Buffer.alloc(1 + boyut * 4);
    satir[0] = 0;                       // filtre yok
    for (let x = 0; x < boyut; x++) {
      const p = piksel(x, y);
      const i = 1 + x * 4;
      satir[i] = p[0]; satir[i + 1] = p[1]; satir[i + 2] = p[2]; satir[i + 3] = p[3];
    }
    satirlar.push(satir);
  }

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(boyut, 0);
  ihdr.writeUInt32BE(boyut, 4);
  ihdr[8] = 8;    // bit derinliği
  ihdr[9] = 6;    // renk tipi: RGBA
  ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;

  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', zlib.deflateSync(Buffer.concat(satirlar), { level: 9 })),
    chunk('IEND', Buffer.alloc(0))
  ]);
}

/* ---- çizim ---- */

const RENK = {
  zeminUst: [214, 40, 57],     // #d62839 (sitenin ana rengi)
  zeminAlt: [165, 29, 44],     // #a51d2c
  beyaz: [255, 255, 255],
  isik: [255, 211, 90],        // #ffd35a — içerideki ışık, kulp
  kanat: [165, 29, 44]         // #a51d2c — aralık duran kapı kanadı
};

const KOSE = 0.22;             // köşe yuvarlaklığı (kenarın oranı)

/* Ev, 0..100'lük iç alanda; sıra boyama sırasıdır (sonraki üstte kalır).
   Ölçüler: çatı 50,16 / 10,46 / 90,46; gövde 20..80 x 46..84; baca 66..76 x 20..38
   (alt ucu çatının içinde kalır); pencereler 27..37 ve 63..73 x 54..64; kapı 42..58 x 60..84.
   Ev (çatı + baca + gövde) tek dış çizgidir, kapı ve pencereler onda delik: ayrı parçalar
   yan yana çizilince tarayıcıda ve Android'de birleşim yerinde ince çizgi kalıyor.
   Kapıdaki ışık duvarın ARKASINDA, kapıdan biraz taşkın çizilir; kenarı duvarın altında kalır.
   "saydamlik: [üst, alt]" şeklin kendi yüksekliği boyunca yukarıdan aşağı değişir.
   "siluet: true" olanlar tek renkli bildirim rozetine de girer: kapı kanadı dolu, aralık
   (kanatla kasa arasındaki yarık) boş kalır; ışık ve kulp rozette yok. */
const EV = [
  { ad: 'kapı aralığındaki ışık', tur: 'dortgen', kutu: [41.5, 59.5, 58.5, 84], renk: 'isik' },
  { ad: 'ev', tur: 'delikli', renk: 'beyaz', siluet: true,
    noktalar: [[50, 16], [66, 28], [66, 20], [76, 20], [76, 35.5], [90, 46], [80, 46],
      [80, 84], [20, 84], [20, 46], [10, 46]],
    delikler: [[42, 60, 58, 84], [27, 54, 37, 64], [63, 54, 73, 64]] },  // kapı, iki pencere
  { ad: 'zemine düşen ışık', tur: 'cokgen', noktalar: [[52.3, 84], [58, 84], [68, 96], [50.5, 96]],
    renk: 'isik', saydamlik: [0.75, 0] },
  { ad: 'kapı kanadı', tur: 'cokgen', noktalar: [[42, 60], [52.3, 62], [52.3, 84], [42, 84]], renk: 'kanat', siluet: true },
  { ad: 'kulp', tur: 'daire', merkez: [50.3, 73.5], r: 1, renk: 'isik' }
];

function kutuda(u, v, k) { return u >= k[0] && u <= k[2] && v >= k[1] && v <= k[3]; }

/* Çift-tek kuralıyla çokgen içi testi (ışın sayma). */
function cokgende(u, v, n) {
  let ic = false;
  for (let i = 0, j = n.length - 1; i < n.length; j = i++) {
    const [xi, yi] = n[i], [xj, yj] = n[j];
    if ((yi > v) !== (yj > v) && u < (xj - xi) * (v - yi) / (yj - yi) + xi) ic = !ic;
  }
  return ic;
}

/* Şeklin sınır kutusu [sol, üst, sağ, alt]; saydamlık geçişi dikey aralığı kullanır. */
function sinirKutusu(s) {
  if (s.noktalar) {
    const xs = s.noktalar.map(n => n[0]), ys = s.noktalar.map(n => n[1]);
    return [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)];
  }
  if (s.tur === 'daire') return [s.merkez[0] - s.r, s.merkez[1] - s.r, s.merkez[0] + s.r, s.merkez[1] + s.r];
  return s.kutu;
}

const SEKILLER = EV.map(s => ({ s, kutu: sinirKutusu(s), renk: RENK[s.renk] }));
const EV_KUTUSU = SEKILLER.reduce((k, h) => [Math.min(k[0], h.kutu[0]), Math.min(k[1], h.kutu[1]),
  Math.max(k[2], h.kutu[2]), Math.max(k[3], h.kutu[3])], [Infinity, Infinity, -Infinity, -Infinity]);

function sekildeMi(s, u, v) {
  switch (s.tur) {
    case 'dortgen': return kutuda(u, v, s.kutu);
    case 'cokgen': return cokgende(u, v, s.noktalar);
    case 'daire': { const dx = u - s.merkez[0], dy = v - s.merkez[1]; return dx * dx + dy * dy <= s.r * s.r; }
    case 'delikli': return cokgende(u, v, s.noktalar) && !s.delikler.some(d => kutuda(u, v, d));
  }
  return false;
}

/* Bir örnek noktasının rengi, önceden çarpılmış alfayla: [r*a, g*a, b*a, a].
   X, Y: 0..boyut arası sürekli koordinat. */
function noktaRengi(X, Y, boyut, kenarPay, yuvarlak) {
  if (yuvarlak) {
    const r = boyut * KOSE;
    const kx = Math.min(X, boyut - X), ky = Math.min(Y, boyut - Y);
    if (kx < r && ky < r) {
      const dx = r - kx, dy = r - ky;
      if (dx * dx + dy * dy > r * r) return [0, 0, 0, 0];
    }
  }

  /* Üstten alta hafif koyulaşan kırmızı */
  let [r, g, b] = zeminRengi(Y / boyut);

  const ic = boyut - kenarPay * 2;
  const u = (X - kenarPay) / ic * 100;
  const v = (Y - kenarPay) / ic * 100;
  for (const h of SEKILLER) {
    const k = h.kutu;
    if (u < k[0] || u > k[2] || v < k[1] || v > k[3] || !sekildeMi(h.s, u, v)) continue;
    let a = 1;
    if (h.s.saydamlik) {
      const oran = Math.min(1, Math.max(0, (v - k[1]) / (k[3] - k[1])));
      a = h.s.saydamlik[0] + (h.s.saydamlik[1] - h.s.saydamlik[0]) * oran;
    }
    const c = h.renk;
    r = c[0] * a + r * (1 - a);
    g = c[1] * a + g * (1 - a);
    b = c[2] * a + b * (1 - a);
  }
  return [r, g, b, 1];
}

function zeminRengi(t) {
  const u = RENK.zeminUst, a = RENK.zeminAlt;
  return [u[0] + (a[0] - u[0]) * t, u[1] + (a[1] - u[1]) * t, u[2] + (a[2] - u[2]) * t];
}

/* kenarPay: evin çevresinde bırakılan boşluk (piksel). yuvarlak: köşeler yuvarlak mı
   (maskeli sürümde tam kare; kırpmayı telefon yapar). */
function simgeCiz(boyut, kenarPay, yuvarlak) {
  const S = 8;                      // piksel başına 8x8 örnek
  const olcek = 100 / (boyut - kenarPay * 2);
  const kose = boyut * KOSE + 1;
  return function (x, y) {
    /* Evden ve yuvarlak köşelerden uzak piksel düz zemindir: geçiş doğrusal
       olduğu için ortalaması piksel ortasındaki renktir, örneklemeye gerek yok. */
    const koseyeYakin = yuvarlak && Math.min(x, boyut - 1 - x) < kose && Math.min(y, boyut - 1 - y) < kose;
    const u0 = (x - kenarPay) * olcek, u1 = (x + 1 - kenarPay) * olcek;
    const v0 = (y - kenarPay) * olcek, v1 = (y + 1 - kenarPay) * olcek;
    if (!koseyeYakin && (u1 < EV_KUTUSU[0] || u0 > EV_KUTUSU[2] || v1 < EV_KUTUSU[1] || v0 > EV_KUTUSU[3])) {
      const z = zeminRengi((y + 0.5) / boyut);
      return [Math.round(z[0]), Math.round(z[1]), Math.round(z[2]), 255];
    }
    let r = 0, g = 0, b = 0, a = 0;
    for (let j = 0; j < S; j++) {
      for (let i = 0; i < S; i++) {
        const p = noktaRengi(x + (i + 0.5) / S, y + (j + 0.5) / S, boyut, kenarPay, yuvarlak);
        r += p[0] * p[3]; g += p[1] * p[3]; b += p[2] * p[3]; a += p[3];
      }
    }
    if (a === 0) return [0, 0, 0, 0];
    return [Math.round(r / a), Math.round(g / a), Math.round(b / a), Math.round(a / (S * S) * 255)];
  };
}

/* Bildirim rozeti: şeffaf zeminde beyaz siluet. Telefon rozetin yalnızca saydamlığını
   kullanır (renkli simge verilirse bildirim çubuğunda düz beyaz kare görünür). */
function rozetCiz(boyut, kenarPay) {
  const S = 8, ic = boyut - kenarPay * 2;
  const siluet = SEKILLER.filter(h => h.s.siluet);
  return function (x, y) {
    let dolu = 0;
    for (let j = 0; j < S; j++) {
      for (let i = 0; i < S; i++) {
        const u = (x + (i + 0.5) / S - kenarPay) / ic * 100, v = (y + (j + 0.5) / S - kenarPay) / ic * 100;
        if (siluet.some(h => sekildeMi(h.s, u, v))) dolu++;
      }
    }
    return [255, 255, 255, Math.round(dolu / (S * S) * 255)];
  };
}

/* ---- SVG ---- */

function onalti(c) { return '#' + c.map(n => n.toString(16).padStart(2, '0')).join(''); }
function sayi(n) { return String(Math.round(n * 100) / 100); }

function svgUret() {
  const B = 192, PAY = 18, OLCEK = (B - PAY * 2) / 100;
  const r = sayi(B * KOSE);
  const tanimlar = [
    '<linearGradient id="zemin" x1="0" y1="0" x2="0" y2="1">' +
      '<stop offset="0" stop-color="' + onalti(RENK.zeminUst) + '"/>' +
      '<stop offset="1" stop-color="' + onalti(RENK.zeminAlt) + '"/></linearGradient>'
  ];
  const govde = [];
  EV.forEach((s, n) => {
    let dolgu = onalti(RENK[s.renk]);
    if (s.saydamlik) {
      const id = 'gecis' + n;
      tanimlar.push('<linearGradient id="' + id + '" x1="0" y1="0" x2="0" y2="1">' +
        '<stop offset="0" stop-color="' + dolgu + '" stop-opacity="' + s.saydamlik[0] + '"/>' +
        '<stop offset="1" stop-color="' + dolgu + '" stop-opacity="' + s.saydamlik[1] + '"/></linearGradient>');
      dolgu = 'url(#' + id + ')';
    }
    const k = s.kutu;
    if (s.tur === 'dortgen') {
      govde.push('<rect x="' + k[0] + '" y="' + k[1] + '" width="' + sayi(k[2] - k[0]) + '" height="' + sayi(k[3] - k[1]) + '" fill="' + dolgu + '"/>');
    } else if (s.tur === 'cokgen') {
      govde.push('<polygon points="' + s.noktalar.map(p => p.join(',')).join(' ') + '" fill="' + dolgu + '"/>');
    } else if (s.tur === 'daire') {
      govde.push('<circle cx="' + s.merkez[0] + '" cy="' + s.merkez[1] + '" r="' + s.r + '" fill="' + dolgu + '"/>');
    } else if (s.tur === 'delikli') {
      const d = ['M' + s.noktalar.map(p => p.join(' ')).join(' L') + 'Z']
        .concat(s.delikler.map(q => 'M' + q[0] + ' ' + q[1] + 'H' + q[2] + 'V' + q[3] + 'H' + q[0] + 'Z')).join(' ');
      govde.push('<path fill="' + dolgu + '" fill-rule="evenodd" d="' + d + '"/>');
    }
  });
  return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + B + ' ' + B + '" width="' + B + '" height="' + B + '">\n' +
    '  <!-- araclar/simge-uret.js üretir; elle değiştirme -->\n' +
    '  <title>Eğitim Evi</title>\n' +
    '  <defs>\n    ' + tanimlar.join('\n    ') + '\n  </defs>\n' +
    '  <rect width="' + B + '" height="' + B + '" rx="' + r + '" fill="url(#zemin)"/>\n' +
    '  <g transform="translate(' + PAY + ' ' + PAY + ') scale(' + sayi(OLCEK) + ')">\n    ' +
    govde.join('\n    ') + '\n  </g>\n</svg>\n';
}

/* ---- dosyalar ---- */

/* Kenar payı boyutla orantılı: 192'de 18 (iç alan %81). Maskeli sürümde 512'de 96:
   ev ortadaki %62,5'e sığar, Android'in daire maskesi (ortadaki %80) evi kesmez. */
function pngUret(boyut, kenarPay, yuvarlak) {
  return pngYaz(boyut, simgeCiz(boyut, kenarPay, yuvarlak));
}

function rozetUret(boyut) {
  return pngYaz(boyut, rozetCiz(boyut, 0));   // ev genişliğin %80'i: bildirim simgesi payı
}

function uret(dosya, boyut, kenarPay, yuvarlak) {
  const veri = yuvarlak === 'rozet' ? rozetUret(boyut) : pngUret(boyut, kenarPay, yuvarlak);
  fs.writeFileSync(path.join(CIKTI, dosya), veri);
  console.log('  ' + dosya + '  (' + boyut + 'x' + boyut + ', ' + (veri.length / 1024).toFixed(1) + ' KB)');
}

if (require.main === module) {
  console.log('');
  console.log('Simgeler üretiliyor...');
  fs.writeFileSync(path.join(CIKTI, 'simge.svg'), svgUret());
  console.log('  simge.svg');
  uret('simge-192.png', 192, 18, true);
  uret('simge-512.png', 512, 48, true);
  /* Maskeli simge: Android simgeyi daire/kare kırpar, kenarda pay bırakmak gerekir. */
  uret('simge-maskeli-512.png', 512, 96, false);
  /* Telefon bildiriminin küçük simgesi (sw.js "badge"): 24 dp'de gösterilir, 96 px = 4x. */
  uret('simge-rozet.png', 96, 0, 'rozet');
  console.log('');
}

module.exports = { EV, RENK, KOSE, pngUret, rozetUret, svgUret };
