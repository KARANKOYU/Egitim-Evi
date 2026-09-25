/* Grafikler: sütun grafik (ödev sonuçları) ve çizgi grafik (sınavlar).

   Kütüphane yok; SVG metni üretilir. Renkler CSS'ten gelir
   (css/parcalar/25-grafik.css), açık ve koyu temada aynı kod çalışır.
   Eksenler "güzel" sayılara yuvarlanır: en büyük değer 174 ise eksen
   0-200, 50'şer. */

/* ================= eksen ================= */

/* Ham adımı 1, 2, 2.5, 5, 10 x 10^k biçimine yuvarlar: 43.5 -> 50 */
function guzelAdim(ham) {
  if (!(ham > 0)) return 1;
  var us = Math.pow(10, Math.floor(Math.log(ham) / Math.LN10));
  var k = ham / us;
  var carpan = k <= 1 ? 1 : k <= 2 ? 2 : k <= 2.5 ? 2.5 : k <= 5 ? 5 : 10;
  return carpan * us;
}

/* { alt, ust, adim, isaretler: [0, 50, 100, 150, 200] } */
function guzelEksen(enAz, enCok, hedefAralik) {
  hedefAralik = hedefAralik || 4;
  if (enAz === enCok) {
    if (enAz === 0) enCok = 1;
    else { enAz = enAz - Math.abs(enAz) * 0.1; enCok = enCok + Math.abs(enCok) * 0.1; }
  }
  var adim = guzelAdim((enCok - enAz) / hedefAralik);
  var alt = Math.floor(enAz / adim) * adim;
  var ust = Math.ceil(enCok / adim) * adim;
  /* Kayan nokta artığı (0.30000000000000004) etikete düşmesin. */
  var basamak = Math.max(0, -Math.floor(Math.log(adim) / Math.LN10) + 1);
  var isaretler = [];
  for (var v = alt; v <= ust + adim / 2; v += adim) isaretler.push(Number(v.toFixed(basamak)));
  return { alt: alt, ust: ust, adim: adim, isaretler: isaretler };
}

