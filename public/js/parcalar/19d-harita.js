/* Küçük harita: OpenStreetMap döşemeleri, işaretler, sürükleme ve yakınlaştırma.
   Dış kütüphane yok. Döşemeler (256 px resimler) Web Mercator düzeninde
   tile.openstreetmap.org'dan gelir; resim isteği yalnızca site adını
   (origin) gönderir, sayfanın adresini göndermez. Harita üstünde konum
   verisi dışarı gitmez: işaretler bu sayfada çizilir.

   Kullanım:
     var h = haritaKur(kap, { merkez: { enlem, boylam }, zoom: 15, tiklaninca: fn });
     h.isaretler([{ tur: 'okul' | 'ev' | 'servis' | 'secim', enlem, boylam, etiket }]);
     h.sigdir();     // bütün işaretler görünsün
     h.yokEt();      // sayfadan çıkarken */

var HARITA_DOSEME = 'https://tile.openstreetmap.org/';
var HARITA_EN_AZ = 3, HARITA_EN_COK = 19;
var TURKIYE = { enlem: 39.0, boylam: 35.2 };

function haritaPiksel(enlem, boylam, z) {
  var olcek = 256 * Math.pow(2, z);
  var s = Math.sin(Math.max(-85.05, Math.min(85.05, enlem)) * Math.PI / 180);
  return {
    x: (boylam + 180) / 360 * olcek,
    y: (0.5 - Math.log((1 + s) / (1 - s)) / (4 * Math.PI)) * olcek
  };
}
function haritaKonum(x, y, z) {
  var olcek = 256 * Math.pow(2, z);
  var boy = x / olcek * 360 - 180;
  var n = Math.PI * (1 - 2 * y / olcek);
  return { enlem: Math.atan((Math.exp(n) - Math.exp(-n)) / 2) * 180 / Math.PI, boylam: ((boy + 540) % 360) - 180 };
}

/* Google Haritalar bağlantısı (yeni sekmede; site bilgisi gönderilmez). */
function googleHaritaAdresi(k) {
  return 'https://www.google.com/maps/search/?api=1&query=' + Number(k.enlem).toFixed(6) + ',' + Number(k.boylam).toFixed(6);
}
function googleHaritaBaglantisi(k, yazi) {
  return '<a class="btn kucuk ghost" href="' + esc(googleHaritaAdresi(k)) + '" target="_blank" rel="noopener noreferrer">' +
    ik('harita') + esc(yazi || 'Google Haritalar\'da aç') + '</a>';
}

var HARITA_ISARET = {
  okul: { ikon: 'okul', sinif: 'okul' },
  ev: { ikon: 'ev', sinif: 'ev' },
  servis: { ikon: 'servis', sinif: 'servis' },
  secim: { ikon: 'konum', sinif: 'secim' },
  ben: { ikon: 'hedef', sinif: 'ben' }
};

function haritaKur(kap, ayar) {
  ayar = ayar || {};
  var m = ayar.merkez && isFinite(ayar.merkez.enlem) ? { enlem: +ayar.merkez.enlem, boylam: +ayar.merkez.boylam } : TURKIYE;
  var z = ayar.zoom || (ayar.merkez ? 15 : 6);
  var isaretListesi = [];
  var dosemeler = {};           // "z/x/y" -> img
  var cizimBekliyor = false;
  var bitti = false;

  kap.classList.add('harita');
  kap.setAttribute('tabindex', '0');
  kap.setAttribute('role', 'application');
  kap.setAttribute('aria-label', ayar.etiket || 'Harita. Ok tuşlarıyla kaydır, artı ve eksiyle yakınlaştır.');
  kap.innerHTML = '<div class="harita-doseme"></div><div class="harita-isaret"></div>' +
    '<div class="harita-dugmeler">' +
    '<button type="button" class="harita-dugme" data-harita="art" aria-label="Yakınlaştır">+</button>' +
    '<button type="button" class="harita-dugme" data-harita="azal" aria-label="Uzaklaştır">−</button>' +
    '<button type="button" class="harita-dugme" data-harita="sigdir" aria-label="Hepsini göster">' + ik('hedef') + '</button>' +
    '</div>' +
    '<div class="harita-atif">© <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> katkıda bulunanlar</div>';
  var katDoseme = kap.querySelector('.harita-doseme');
  var katIsaret = kap.querySelector('.harita-isaret');

  function boyut() { return { w: kap.clientWidth || 300, h: kap.clientHeight || 240 }; }

  function ciz() {
    cizimBekliyor = false;
    if (bitti) return;
    var b = boyut();
    var p = haritaPiksel(m.enlem, m.boylam, z);
    var solUst = { x: p.x - b.w / 2, y: p.y - b.h / 2 };
    var n = Math.pow(2, z);
    var kullanilan = {};
    var x0 = Math.floor(solUst.x / 256), x1 = Math.floor((solUst.x + b.w) / 256);
    var y0 = Math.max(0, Math.floor(solUst.y / 256)), y1 = Math.min(n - 1, Math.floor((solUst.y + b.h) / 256));
    for (var tx = x0; tx <= x1; tx++) {
      for (var ty = y0; ty <= y1; ty++) {
        var gx = ((tx % n) + n) % n;
        var anahtar = z + '/' + gx + '/' + ty + '/' + tx;
        var img = dosemeler[anahtar];
        if (!img) {
          img = document.createElement('img');
          img.alt = '';
          img.draggable = false;
          img.decoding = 'async';
          img.referrerPolicy = 'strict-origin-when-cross-origin';
          img.src = HARITA_DOSEME + z + '/' + gx + '/' + ty + '.png';
          dosemeler[anahtar] = img;
          katDoseme.appendChild(img);
        }
        img.style.transform = 'translate(' + Math.round(tx * 256 - solUst.x) + 'px,' + Math.round(ty * 256 - solUst.y) + 'px)';
        kullanilan[anahtar] = true;
      }
    }
    for (var k in dosemeler) {
      if (!kullanilan[k]) { if (dosemeler[k].parentNode) dosemeler[k].parentNode.removeChild(dosemeler[k]); delete dosemeler[k]; }
    }
    var isaretler = katIsaret.children;
    for (var i = 0; i < isaretListesi.length; i++) {
      var ip = haritaPiksel(isaretListesi[i].enlem, isaretListesi[i].boylam, z);
      if (isaretler[i]) isaretler[i].style.transform = 'translate(' + Math.round(ip.x - solUst.x) + 'px,' + Math.round(ip.y - solUst.y) + 'px)';
    }
  }
  function yenidenCiz() {
    if (cizimBekliyor) return;
    cizimBekliyor = true;
    (window.requestAnimationFrame || setTimeout)(ciz);
  }

  /* Ekrandaki bir noktayı sabit tutarak yakınlaştır. */
  function yakinlas(yeniZ, ekranX, ekranY) {
    yeniZ = Math.max(HARITA_EN_AZ, Math.min(HARITA_EN_COK, yeniZ));
    if (yeniZ === z) return;
    var b = boyut();
    if (ekranX === undefined) { ekranX = b.w / 2; ekranY = b.h / 2; }
    var p = haritaPiksel(m.enlem, m.boylam, z);
    var nokta = haritaKonum(p.x - b.w / 2 + ekranX, p.y - b.h / 2 + ekranY, z);
    var yp = haritaPiksel(nokta.enlem, nokta.boylam, yeniZ);
    m = haritaKonum(yp.x - ekranX + b.w / 2, yp.y - ekranY + b.h / 2, yeniZ);
    z = yeniZ;
    yenidenCiz();
  }
  function kaydir(dx, dy) {
    var p = haritaPiksel(m.enlem, m.boylam, z);
    m = haritaKonum(p.x - dx, p.y - dy, z);
    yenidenCiz();
  }
  function ekranKonumu(ev) {
    var r = kap.getBoundingClientRect();
    var b = boyut();
    var p = haritaPiksel(m.enlem, m.boylam, z);
    return haritaKonum(p.x - b.w / 2 + (ev.clientX - r.left), p.y - b.h / 2 + (ev.clientY - r.top), z);
  }

  /* ---- sürükleme, iki parmakla yakınlaştırma, dokunarak seçme ---- */
  var parmaklar = {};
  var surukle = null;
  var cimdik = null;
  function parmakSayisi() { var n = 0; for (var k in parmaklar) n++; return n; }
  function ikiParmakAraligi() {
    var l = []; for (var k in parmaklar) l.push(parmaklar[k]);
    return Math.hypot(l[0].x - l[1].x, l[0].y - l[1].y);
  }
  kap.addEventListener('pointerdown', function (ev) {
    if (ev.target.closest('.harita-dugmeler, .harita-atif')) return;
    parmaklar[ev.pointerId] = { x: ev.clientX, y: ev.clientY };
    try { kap.setPointerCapture(ev.pointerId); } catch (e) { /* eski tarayıcı */ }
    if (parmakSayisi() === 1) surukle = { x: ev.clientX, y: ev.clientY, oynadi: 0 };
    else if (parmakSayisi() === 2) { cimdik = { aralik: ikiParmakAraligi() }; surukle = null; }
  });
  kap.addEventListener('pointermove', function (ev) {
    if (!parmaklar[ev.pointerId]) return;
    parmaklar[ev.pointerId] = { x: ev.clientX, y: ev.clientY };
    if (cimdik && parmakSayisi() === 2) {
      var a = ikiParmakAraligi();
      if (a / cimdik.aralik > 1.6) { yakinlas(z + 1); cimdik.aralik = a; }
      else if (a / cimdik.aralik < 0.62) { yakinlas(z - 1); cimdik.aralik = a; }
      return;
    }
    if (!surukle) return;
    var dx = ev.clientX - surukle.x, dy = ev.clientY - surukle.y;
    surukle.oynadi += Math.abs(dx) + Math.abs(dy);
    surukle.x = ev.clientX; surukle.y = ev.clientY;
    kaydir(dx, dy);
  });
  function birak(ev) {
    var tik = surukle && surukle.oynadi < 6 && parmakSayisi() === 1;
    delete parmaklar[ev.pointerId];
    if (parmakSayisi() < 2) cimdik = null;
    if (tik && ev.type === 'pointerup' && ayar.tiklaninca) ayar.tiklaninca(ekranKonumu(ev));
    if (!parmakSayisi()) surukle = null;
  }
  kap.addEventListener('pointerup', birak);
  kap.addEventListener('pointercancel', birak);

  var sonTeker = 0;
  kap.addEventListener('wheel', function (ev) {
    ev.preventDefault();
    var simdi = Date.now();
    if (simdi - sonTeker < 220) return;
    sonTeker = simdi;
    var r = kap.getBoundingClientRect();
    yakinlas(z + (ev.deltaY < 0 ? 1 : -1), ev.clientX - r.left, ev.clientY - r.top);
  }, { passive: false });
  kap.addEventListener('dblclick', function (ev) {
    if (ev.target.closest('.harita-dugmeler')) return;
    var r = kap.getBoundingClientRect();
    yakinlas(z + 1, ev.clientX - r.left, ev.clientY - r.top);
  });
  kap.addEventListener('keydown', function (ev) {
    var adim = 80;
    if (ev.key === 'ArrowLeft') kaydir(adim, 0);
    else if (ev.key === 'ArrowRight') kaydir(-adim, 0);
    else if (ev.key === 'ArrowUp') kaydir(0, adim);
    else if (ev.key === 'ArrowDown') kaydir(0, -adim);
    else if (ev.key === '+' || ev.key === '=') yakinlas(z + 1);
    else if (ev.key === '-') yakinlas(z - 1);
    else return;
    ev.preventDefault();
  });
  kap.querySelector('.harita-dugmeler').addEventListener('click', function (ev) {
    var d = ev.target.closest('[data-harita]');
    if (!d) return;
    ev.preventDefault();
    ev.stopPropagation();
    var ne = d.getAttribute('data-harita');
    if (ne === 'art') yakinlas(z + 1);
    else if (ne === 'azal') yakinlas(z - 1);
    else sigdir();
  });

  var izleyici = null;
  if (window.ResizeObserver) { izleyici = new ResizeObserver(yenidenCiz); izleyici.observe(kap); }

  function isaretler(liste) {
    isaretListesi = (liste || []).filter(function (i) { return i && isFinite(i.enlem) && isFinite(i.boylam); });
    var h = '';
    for (var i = 0; i < isaretListesi.length; i++) {
      var t = HARITA_ISARET[isaretListesi[i].tur] || HARITA_ISARET.secim;
      h += '<div class="harita-nokta ' + t.sinif + '"><span class="harita-igne">' + ik(t.ikon) + '</span>' +
        (isaretListesi[i].etiket ? '<span class="harita-etiket">' + esc(isaretListesi[i].etiket) + '</span>' : '') + '</div>';
    }
    katIsaret.innerHTML = h;
    ciz();
  }

  /* Bütün işaretler ekrana sığsın (tek işaretse ona yakınlaş). */
  function sigdir() {
    if (!isaretListesi.length) { ciz(); return; }
    if (isaretListesi.length === 1) {
      m = { enlem: isaretListesi[0].enlem, boylam: isaretListesi[0].boylam };
      z = Math.max(z, 15);
      ciz();
      return;
    }
    var b = boyut();
    for (var yz = 18; yz >= HARITA_EN_AZ; yz--) {
      var x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
      for (var i = 0; i < isaretListesi.length; i++) {
        var p = haritaPiksel(isaretListesi[i].enlem, isaretListesi[i].boylam, yz);
        x0 = Math.min(x0, p.x); x1 = Math.max(x1, p.x); y0 = Math.min(y0, p.y); y1 = Math.max(y1, p.y);
      }
      if (x1 - x0 <= b.w - 80 && y1 - y0 <= b.h - 90) {
        z = yz;
        m = haritaKonum((x0 + x1) / 2, (y0 + y1) / 2, yz);
        break;
      }
    }
    ciz();
  }

  ciz();
  return {
    isaretler: isaretler,
    sigdir: sigdir,
    merkezle: function (k, yz) { m = { enlem: +k.enlem, boylam: +k.boylam }; if (yz) z = yz; ciz(); },
    merkez: function () { return { enlem: m.enlem, boylam: m.boylam }; },
    yokEt: function () { bitti = true; if (izleyici) izleyici.disconnect(); kap.innerHTML = ''; }
  };
}
