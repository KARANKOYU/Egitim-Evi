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

/* Grafik, kutusunun gerçek genişliğinde çizilir (o.genislik, piksel):
   SVG ölçeklenmez, yazılar telefonda da masaüstünde de 11-12 px kalır.
   Genişlik bilinmiyorsa 640 varsayılır. */
function grafikGenisligi(o) {
  return Math.max(260, Math.round(o.genislik || 640));
}

/* Etiketi iki satıra böler (dar sütunlarda "Geç yaptı" -> "Geç" / "yaptı"). */
function ikiSatir(x, y, metin, sinif, dar) {
  var p = String(metin).split(' ');
  if (!dar || p.length < 2) {
    return '<text class="' + sinif + '" x="' + x + '" y="' + y + '" text-anchor="middle">' + esc(metin) + '</text>';
  }
  return '<text class="' + sinif + '" x="' + x + '" y="' + y + '" text-anchor="middle">' +
    '<tspan x="' + x + '">' + esc(p[0]) + '</tspan>' +
    '<tspan x="' + x + '" dy="13">' + esc(p.slice(1).join(' ')) + '</tspan></text>';
}

/* ================= sütun grafik =================
   o = { kategoriler: [{ ad, deger, sinif }], baslik, genislik } */
function sutunGrafik(o) {
  var G = grafikGenisligi(o), Y = 250, sol = 40, sag = 8, ust = 24, alt = 44;
  var liste = o.kategoriler;
  var enCok = 0;
  for (var i = 0; i < liste.length; i++) if (liste[i].deger > enCok) enCok = liste[i].deger;
  var eksen = guzelEksen(0, Math.max(enCok, 1));
  var cizimG = G - sol - sag, cizimY = Y - ust - alt;
  var yKonum = function (v) { return ust + cizimY - (v - eksen.alt) / (eksen.ust - eksen.alt) * cizimY; };

  var s = '<svg class="svg-grafik" viewBox="0 0 ' + G + ' ' + Y + '" role="img" aria-label="' +
    esc(o.baslik || 'Sütun grafik') + ': ' +
    esc(liste.map(function (k) { return k.ad + ' ' + k.deger; }).join(', ')) + '">';

  for (var j = 0; j < eksen.isaretler.length; j++) {
    var yv = yKonum(eksen.isaretler[j]);
    s += '<line class="izgara" x1="' + sol + '" x2="' + (G - sag) + '" y1="' + yv + '" y2="' + yv + '"/>' +
      '<text class="eksen-yazi" x="' + (sol - 8) + '" y="' + (yv + 4) + '" text-anchor="end">' +
      sayiTR(eksen.isaretler[j]) + '</text>';
  }

  var bolme = cizimG / liste.length;
  var genislik = Math.min(56, bolme * 0.62);
  var dar = bolme < 78;   // telefonda iki kelimelik etiket iki satıra iner
  for (var k = 0; k < liste.length; k++) {
    var c = liste[k];
    var x = sol + bolme * k + (bolme - genislik) / 2;
    var orta = (x + genislik / 2).toFixed(1);
    var yTepe = yKonum(c.deger);
    var yuk = Math.max(0, ust + cizimY - yTepe);
    s += '<g class="sutun-grup">' +
      '<rect class="sutun ' + esc(c.sinif || '') + '" x="' + x.toFixed(1) + '" y="' + yTepe.toFixed(1) +
      '" width="' + genislik.toFixed(1) + '" height="' + yuk.toFixed(1) + '" rx="5">' +
      '<title>' + esc(c.ad) + ': ' + c.deger + '</title></rect>' +
      '<text class="deger-yazi" x="' + orta + '" y="' + (yTepe - 6).toFixed(1) +
      '" text-anchor="middle">' + c.deger + '</text>' +
      ikiSatir(orta, Y - alt + 17, c.ad, 'eksen-yazi' + (bolme < 54 ? ' kucuk' : ''), dar) + '</g>';
  }
  return s + '</svg>';
}

/* ================= çizgi grafik =================
   o = {
     etiketler: [{ ust: '10.09.2026', alt: 'LGS Deneme 1' }],
     degerler: [490.161, null, 455.5],          // öğrencinin değeri (yoksa null)
     bant: [{ alt, ust, ort }] | null,          // aynı sınavdaki en düşük / en yüksek
     baslik, genislik
   } */
function cizgiGrafik(o) {
  var G = grafikGenisligi(o), Y = 290, sol = 48, sag = 10, ust = 26, alt = 52;
  var n = o.etiketler.length;
  var tum = [];
  for (var i = 0; i < n; i++) {
    if (o.degerler[i] !== null && o.degerler[i] !== undefined) tum.push(Number(o.degerler[i]));
    if (o.bant && o.bant[i]) { tum.push(Number(o.bant[i].alt)); tum.push(Number(o.bant[i].ust)); }
  }
  if (!tum.length) tum = [0, 1];
  var enAz = Math.min.apply(null, tum), enCok = Math.max.apply(null, tum);
  /* Üstte değer yazısına yer kalsın: en büyük değer eksenin tepesine yapışmasın. */
  var eksen = guzelEksen(enAz, enCok + (enCok - enAz || Math.abs(enCok) || 1) * 0.08, 5);
  var cizimG = G - sol - sag, cizimY = Y - ust - alt;
  /* Noktalar kenardan içeride: ilk değer sol eksen yazısına, son tarih sağ kenara taşmasın. */
  var ic = Math.min(44, cizimG * 0.09);
  var aralik = n > 1 ? (cizimG - 2 * ic) / (n - 1) : cizimG;
  var xKonum = function (i) { return n === 1 ? sol + cizimG / 2 : sol + ic + aralik * i; };
  var yKonum = function (v) { return ust + cizimY - (v - eksen.alt) / (eksen.ust - eksen.alt) * cizimY; };
  /* Dar ekranda: tarih "17.06" olur, ad sığacak kadar kısalır, sıkışırsa bir atlanır. */
  var kisaTarih = aralik < 84;
  var adSiniri = Math.max(4, Math.floor(aralik / 7));
  var atla = aralik < 40 ? 2 : 1;

  var s = '<svg class="svg-grafik" viewBox="0 0 ' + G + ' ' + Y + '" role="img" aria-label="' +
    esc(o.baslik || 'Çizgi grafik') + '">';

  for (var j = 0; j < eksen.isaretler.length; j++) {
    var yv = yKonum(eksen.isaretler[j]);
    s += '<line class="izgara" x1="' + sol + '" x2="' + (G - sag) + '" y1="' + yv + '" y2="' + yv + '"/>' +
      '<text class="eksen-yazi" x="' + (sol - 8) + '" y="' + (yv + 4) + '" text-anchor="end">' +
      sayiTR(eksen.isaretler[j]) + '</text>';
  }

  /* Bant: en düşük ile en yüksek arası gölgeli alan, ortası kesik çizgi */
  if (o.bant) {
    var ustKenar = [], altKenar = [], ortCizgi = [];
    for (var b = 0; b < n; b++) {
      var bt = o.bant[b];
      if (!bt) continue;
      ustKenar.push(xKonum(b).toFixed(1) + ',' + yKonum(bt.ust).toFixed(1));
      altKenar.unshift(xKonum(b).toFixed(1) + ',' + yKonum(bt.alt).toFixed(1));
      ortCizgi.push(xKonum(b).toFixed(1) + ',' + yKonum(bt.ort).toFixed(1));
    }
    if (ustKenar.length > 1) {
      s += '<polygon class="bant" points="' + ustKenar.concat(altKenar).join(' ') + '"/>' +
        '<polyline class="bant-ort" points="' + ortCizgi.join(' ') + '"/>';
    } else if (ustKenar.length === 1) {
      var tek = ustKenar[0].split(','), tekAlt = altKenar[0].split(',');
      s += '<line class="bant-tek" x1="' + tek[0] + '" x2="' + tek[0] + '" y1="' + tek[1] + '" y2="' + tekAlt[1] + '"/>';
    }
  }

  /* Öğrencinin çizgisi: değeri olmayan sınavda kesilir */
  var parca = [], yol = '';
  for (var k = 0; k <= n; k++) {
    var v = k < n ? o.degerler[k] : null;
    if (v !== null && v !== undefined) { parca.push(xKonum(k).toFixed(1) + ',' + yKonum(Number(v)).toFixed(1)); continue; }
    if (parca.length > 1) yol += '<polyline class="cizgi" points="' + parca.join(' ') + '"/>';
    parca = [];
  }
  s += yol;

  for (var m = 0; m < n; m++) {
    var x = xKonum(m);
    var e = o.etiketler[m];
    if (m % atla === 0 || m === n - 1) {
      var tarihYazi = kisaTarih ? String(e.ust).slice(0, 5) : e.ust;
      var adYazi = e.alt.length > adSiniri ? e.alt.slice(0, adSiniri - 1) + '…' : e.alt;
      s += '<text class="eksen-yazi" x="' + x.toFixed(1) + '" y="' + (Y - alt + 18) + '" text-anchor="middle">' +
        esc(tarihYazi) + '</text>' +
        '<text class="eksen-yazi soluk" x="' + x.toFixed(1) + '" y="' + (Y - alt + 33) + '" text-anchor="middle">' +
        esc(adYazi) + '</text>';
    }
    var dv = o.degerler[m];
    if (dv === null || dv === undefined) continue;
    var yNok = yKonum(Number(dv));
    /* Değer yazısı noktanın üstünde; tepeye çok yakınsa altına iner. */
    var yYazi = yNok - 11 < ust - 6 ? yNok + 20 : yNok - 11;
    s += '<circle class="nokta" cx="' + x.toFixed(1) + '" cy="' + yNok.toFixed(1) + '" r="4.5">' +
      '<title>' + esc(e.alt) + ' (' + esc(e.ust) + '): ' + sayiTR(dv) +
      (o.bant && o.bant[m] ? ' · en düşük ' + sayiTR(o.bant[m].alt) + ', en yüksek ' + sayiTR(o.bant[m].ust) : '') +
      '</title></circle>' +
      '<text class="deger-yazi" x="' + x.toFixed(1) + '" y="' + yYazi.toFixed(1) + '" text-anchor="middle">' +
      sayiTR(dv, aralik < 60 ? 1 : 2) + '</text>';
  }
  return s + '</svg>';
}

/* ================= ödev sonuç grafiği =================
   Öğrencinin bütün ödevleri sonuca göre sayılır. Sonucu olmayanlar
   (aktif ya da henüz değerlendirilmemiş) "Belirsiz". */
var ODEV_GRAFIK_SIRA = ['yapti', 'gec', 'eksik', 'yapmadi', 'izinli', 'gelmedi', 'belirsiz'];
var ODEV_GRAFIK_AD = {
  yapti: 'Yaptı', gec: 'Geç yaptı', eksik: 'Eksik', yapmadi: 'Yapmadı',
  izinli: 'İzinli', gelmedi: 'Gelmedi', belirsiz: 'Belirsiz'
};

/* Sayfaya önce sabit yükseklikte boş bir kutu konur; grafik, kutu sayfaya
   yerleşip genişliği belli olunca odevGrafikleriniCiz() ile çizilir. */
function odevSonucGrafigi(odevler) {
  var sayim = {};
  for (var i = 0; i < ODEV_GRAFIK_SIRA.length; i++) sayim[ODEV_GRAFIK_SIRA[i]] = 0;
  for (var j = 0; j < odevler.length; j++) {
    var r = odevler[j].result;
    sayim[r && sayim[r] !== undefined ? r : 'belirsiz']++;
  }
  return '<div class="odev-sutun" data-sayim="' + esc(JSON.stringify(sayim)) + '"></div>';
}

/* Görünür her ödev grafiğini kutusunun genişliğinde çizer. Gizli kutu
   (öbür sekmede ya da "Grafiği gizle") atlanır, görününce çizilir. */
function odevGrafikleriniCiz() {
  var kutular = document.querySelectorAll('.odev-sutun[data-sayim]');
  for (var i = 0; i < kutular.length; i++) {
    var k = kutular[i];
    var w = Math.floor(k.clientWidth);
    if (!w || String(w) === k.getAttribute('data-cizilen')) continue;
    var sayim = JSON.parse(k.getAttribute('data-sayim'));
    k.innerHTML = sutunGrafik({
      baslik: 'Ödev sonuçları', genislik: w,
      kategoriler: ODEV_GRAFIK_SIRA.map(function (a) { return { ad: ODEV_GRAFIK_AD[a], deger: sayim[a], sinif: a }; })
    });
    k.setAttribute('data-cizilen', String(w));
  }
}

/* Pencere boyu değişince (telefon yan çevrilince) grafikler yeni genişlikte. */
var grafikBoyutZamani = null;
window.addEventListener('resize', function () {
  clearTimeout(grafikBoyutZamani);
  grafikBoyutZamani = setTimeout(function () {
    odevGrafikleriniCiz();
    for (var id in S.sg) if ($('sg-' + id)) sinavGrafigiCiz(id);
  }, 180);
});

/* ================= sınav grafiği kutusu =================
   İlerleyiş ve sınavlar sayfasında öğrenci başına bir kutu. Sayfa önce
   yer tutucuyla çizilir (yükseklik sabit, sayfa kaymaz), veri sonra gelir. */
S.sg = S.sg || {};

function sinavGrafigiKutusu(ogrenciId) {
  return '<div class="kart sinav-grafik" id="sg-' + esc(ogrenciId) + '" data-ogrenci="' + esc(ogrenciId) + '">' +
    '<h3>Sınav grafiği</h3><div class="sg-govde yer-tutucu"></div></div>';
}

function sinavGrafigiYukle(ogrenciId) {
  var durum = S.sg[ogrenciId] || (S.sg[ogrenciId] = { bant: tercihOku('sg_bant', '1') === '1', gorunum: 'grafik' });
  var yol = '/exams/grafik?ogrenci=' + encodeURIComponent(ogrenciId) +
    (durum.sablon ? '&sablon=' + encodeURIComponent(durum.sablon) : '');
  return api(yol).then(function (d) {
    durum.veri = d;
    durum.sablon = d.sablonId;
    if (!durum.olcum || !d.olcumler.some(function (o) { return o.kod === durum.olcum; })) {
      var ana = d.olcumler.filter(function (o) { return o.ana; })[0] || d.olcumler[0];
      durum.olcum = ana ? ana.kod : '';
    }
    sinavGrafigiCiz(ogrenciId);
  })['catch'](function (e) {
    var kutu = $('sg-' + ogrenciId);
    if (kutu) kutu.querySelector('.sg-govde').innerHTML = '<div class="msg hata">' + esc(e.message) + '</div>';
  });
}

function sinavGrafigiCiz(ogrenciId) {
  var kutu = $('sg-' + ogrenciId);
  var durum = S.sg[ogrenciId];
  if (!kutu || !durum || !durum.veri) return;
  var d = durum.veri;
  var govde = kutu.querySelector('.sg-govde');
  govde.classList.remove('yer-tutucu');

  if (!d.sablonlar.length) {
    govde.innerHTML = '<div class="sg-bos">Grafik, aynı şablonla yapılmış sınavları yan yana koyar. ' +
      'Henüz şablonlu bir sınav sonucu yok.</div>';
    return;
  }

  var ogr = ' data-id="' + esc(ogrenciId) + '"';
  var h = '<div class="sg-araclar">';
  /* Şablon seçimi: "Yazılı (0-100)", "LGS Denemesi" */
  if (d.sablonlar.length > 1) {
    h += '<div class="sekme-satir">';
    for (var i = 0; i < d.sablonlar.length; i++) {
      var sb = d.sablonlar[i];
      h += '<button class="sekme kucuk' + (sb.id === d.sablonId ? ' secili' : '') + '" data-act="sg-sablon"' + ogr +
        ' data-val="' + esc(sb.id) + '">' + esc(sb.name) + '</button>';
    }
    h += '</div>';
  } else {
    h += '<span class="sg-sablon-ad">' + esc(d.sablonlar[0].name) + '</span>';
  }
  h += '<div class="sekme-satir">' +
    '<button class="sekme kucuk' + (durum.gorunum === 'grafik' ? ' secili' : '') + '" data-act="sg-gorunum"' + ogr + ' data-val="grafik">Grafik</button>' +
    '<button class="sekme kucuk' + (durum.gorunum === 'liste' ? ' secili' : '') + '" data-act="sg-gorunum"' + ogr + ' data-val="liste">Liste</button>' +
    '</div></div>';

  var secili = d.olcumler.filter(function (o) { return o.kod === durum.olcum; })[0] || d.olcumler[0];

  if (durum.gorunum === 'liste') {
    h += '<div class="tablo-sar"><table class="t sg-tablo"><thead><tr><th>Tarih</th><th>Sınav</th>';
    for (var a = 0; a < d.olcumler.length; a++) h += '<th class="sayi">' + esc(d.olcumler[a].ad) + '</th>';
    h += '</tr></thead><tbody>';
    for (var b = 0; b < d.sinavlar.length; b++) {
      var sn = d.sinavlar[b];
      h += '<tr><td>' + tarih(sn.tarih) + '</td><td>' + esc(sn.name) + '</td>';
      for (var c = 0; c < d.olcumler.length; c++) {
        var dv = sn.degerler[d.olcumler[c].kod];
        h += '<td class="sayi' + (d.olcumler[c].ana ? ' ana' : '') + '">' + (dv === null || dv === undefined ? '-' : sayiTR(dv)) + '</td>';
      }
      h += '</tr>';
    }
    h += '</tbody></table></div>';
  } else {
    h += '<div class="sg-cizim">' + cizgiGrafik({
      baslik: secili.ad + ' grafiği',
      genislik: govde.clientWidth,
      etiketler: d.sinavlar.map(function (s) { return { ust: tarih(s.tarih), alt: s.name }; }),
      degerler: d.sinavlar.map(function (s) {
        var v = s.degerler[secili.kod];
        return v === undefined ? null : v;
      }),
      bant: durum.bant ? d.sinavlar.map(function (s) { return s.bant[secili.kod] || null; }) : null
    }) + '</div>';
    /* Ölçüm seçimi ve bant düğmesi grafiğin altında */
    h += '<div class="sg-alt"><div class="sekme-satir">';
    for (var k = 0; k < d.olcumler.length; k++) {
      var o = d.olcumler[k];
      h += '<button class="sekme kucuk' + (o.kod === secili.kod ? ' secili' : '') + '" data-act="sg-olcum"' + ogr +
        ' data-val="' + esc(o.kod) + '">' + esc(o.ad) + '</button>';
    }
    h += '</div><button class="sekme kucuk' + (durum.bant ? ' secili' : '') + '" data-act="sg-bant"' + ogr + '>' +
      'En düşük / en yüksek bandı</button></div>';
    if (durum.bant) {
      h += '<div class="gosterge"><span><i class="g-cizgi"></i>' + (S.viewStudentId || S.user.role !== 'student' ? 'Öğrencinin değeri' : 'Senin değerin') +
        '</span><span><i class="g-bant"></i>Sınavı girenlerin en düşük - en yüksek aralığı</span>' +
        '<span><i class="g-ort"></i>Ortalama</span></div>';
    }
  }
  govde.innerHTML = h;
}

EYLEMLER['sg-sablon'] = function (el, id) {
  S.sg[id].sablon = el.getAttribute('data-val');
  S.sg[id].olcum = '';
  return sinavGrafigiYukle(id);
};
EYLEMLER['sg-olcum'] = function (el, id) {
  S.sg[id].olcum = el.getAttribute('data-val');
  sinavGrafigiCiz(id);
};
EYLEMLER['sg-bant'] = function (el, id) {
  S.sg[id].bant = !S.sg[id].bant;
  tercihYaz('sg_bant', S.sg[id].bant ? '1' : '0');
  sinavGrafigiCiz(id);
};
EYLEMLER['sg-gorunum'] = function (el, id) {
  S.sg[id].gorunum = el.getAttribute('data-val');
  sinavGrafigiCiz(id);
};

/* ================= ödev grafiği kartı =================
   İki görünüm: sonuçlara göre (sütunlar) ve derslere göre (yığılmış).
   Görünüm değişimi yeniden istek atmaz; ikisi de sayfada hazırdır. */
EYLEMLER['odev-grafik-sekme'] = function (el) {
  var kart = el.closest('.odev-grafik');
  var deger = el.getAttribute('data-val');
  kart.setAttribute('data-gorunum', deger);
  var dugmeler = kart.querySelectorAll('[data-act="odev-grafik-sekme"]');
  for (var i = 0; i < dugmeler.length; i++) dugmeler[i].classList.toggle('secili', dugmeler[i] === el);
  tercihYaz('odev_grafik_gorunum', deger);
  odevGrafikleriniCiz();   // gizliyken çizilmemiş olabilir
};
EYLEMLER['odev-grafik-gizle'] = function (el) {
  var kapali = !document.body.classList.contains('odev-grafik-kapali');
  document.body.classList.toggle('odev-grafik-kapali', kapali);
  tercihYaz('odev_grafik_kapali', kapali ? '1' : '0');
  if (!kapali) odevGrafikleriniCiz();
};
