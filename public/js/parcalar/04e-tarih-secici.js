/* Tarih seçici (ajanda): tarayıcının kendi tarih kutusu dilini ve görünümünü
   değiştirmez (bazı tarayıcılarda "mm/dd/yyyy" çıkar). Bunun yerine Türkçe,
   Pazartesiyle başlayan bir ay takvimi açılır. Her günün üstünde o güne
   düşenler işaretlidir: tatil, okul etkinliği, öğretmenin o gün biten öteki
   ödevleri; altta seçilen günün ajandası (kaç ders var, hangi ödev bitiyor)
   yazar. Veri takvim ucundan gelir (/api/takvim?yil&ay), ay ay önbelleğe alınır.

   Tarih K12net'teki gibi "08.09.2025" yazar, yanında takvim düğmesi durur;
   saat ayrı bir açılır listedir (saatAlani).

   Kullanım: tarihAlani('mBit', '2026-10-02', { min: 'mBas' }) HTML döndürür;
   değer her zaman gizli <input id="mBit">'te yyyy-aa-gg olarak durur, seçilince
   o kutuda "change" olayı çıkar. Klavye: oklar gün/hafta, PageUp/PageDown ay,
   Enter seçer, Esc kapatır. */

var TS = { hedef: null, ay: '', odak: '', veri: {}, yukleniyor: {} };
var TS_GUN_KISA = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];

function tsIki(n) { return (n < 10 ? '0' : '') + n; }
function tsIso(d) { return d.getFullYear() + '-' + tsIki(d.getMonth() + 1) + '-' + tsIki(d.getDate()); }
function tsTarih(iso) { var p = String(iso).split('-'); return new Date(+p[0], +p[1] - 1, +p[2]); }
function tsGunEkle(iso, n) { var d = tsTarih(iso); d.setDate(d.getDate() + n); return tsIso(d); }
function tsBugun() { return tsIso(new Date()); }

/* "2025-09-08" -> "08.09.2025" (yanında gün adı ayrıca, soluk) */
function tsKisa(iso) { var p = String(iso).split('-'); return p[2] + '.' + p[1] + '.' + p[0]; }
function tsDugmeYazi(iso) {
  return iso ? '<span class="tarih-yazi">' + tsKisa(iso) + '</span><span class="tarih-gun">' + gunAdi(iso) + '</span>'
    : '<span class="tarih-yazi tarih-bos">gg.aa.yyyy</span>';
}

function tarihAlani(id, deger, sec) {
  sec = sec || {};
  return '<div class="tarih-alan" data-tarih-alan="' + esc(id) + '"' + (sec.min ? ' data-min="' + esc(sec.min) + '"' : '') + '>' +
    '<input type="hidden" id="' + esc(id) + '" value="' + esc(deger || '') + '">' +
    '<button type="button" class="tarih-dugme" id="' + esc(id) + 'Dugme" data-act="tarih-ac" data-id="' + esc(id) + '" ' +
    'aria-haspopup="dialog" aria-expanded="false">' + tsDugmeYazi(deger) +
    '<span class="tarih-simge" aria-hidden="true">' + ik('takvim') + '</span></button></div>';
}

/* Saat: yarım saatlik açılır liste (00:00 ... 23:30). Listede olmayan eski
   bir değer (ör. 12:10) de seçenek olarak korunur. */
function saatAlani(id, deger) {
  var h = '<select id="' + esc(id) + '" class="saat-sec">', var_ = false;
  for (var dk = 0; dk < 24 * 60; dk += 30) {
    var s = tsIki(Math.floor(dk / 60)) + ':' + tsIki(dk % 60);
    if (s === deger) var_ = true;
    h += '<option value="' + s + '"' + (s === deger ? ' selected' : '') + '>' + s + '</option>';
  }
  if (deger && !var_) h = h.replace('<select id="' + esc(id) + '" class="saat-sec">',
    '<select id="' + esc(id) + '" class="saat-sec"><option value="' + esc(deger) + '" selected>' + esc(deger) + '</option>');
  return h + '</select>';
}

/* Şimdiki saatin bir sonraki yarım saati: 18:54 -> 19:00 */
function tsSonrakiYarim() {
  var d = new Date(), dk = d.getHours() * 60 + d.getMinutes();
  dk = Math.min(23 * 60 + 30, Math.ceil(dk / 30) * 30);
  return tsIki(Math.floor(dk / 60)) + ':' + tsIki(dk % 60);
}

/* Alanın en erken seçilebilecek günü: data-min başka bir tarih alanının id'si
   ("son teslim, başlangıçtan önce olamaz") ya da yyyy-aa-gg. */
function tsEnErken(kap) {
  var m = kap && kap.getAttribute('data-min');
  if (!m) return '';
  if (/^\d{4}-\d{2}-\d{2}$/.test(m)) return m;
  return ($(m) && $(m).value) || '';
}

function tsAyVerisi(ay) {
  if (TS.veri[ay] || TS.yukleniyor[ay]) return;
  TS.yukleniyor[ay] = true;
  var p = ay.split('-');
  api('/takvim?yil=' + (+p[0]) + '&ay=' + (+p[1])).then(function (d) {
    var gunler = {};
    (d.gunler || []).forEach(function (g) { gunler[g.tarih] = g; });
    TS.veri[ay] = gunler;
    if (TS.hedef && TS.ay === ay) tsCiz();
  })['catch'](function () { TS.veri[ay] = {}; })
    .then(function () { TS.yukleniyor[ay] = false; });
}

function tsKapat(odakGeriDon) {
  var kutu = document.querySelector('.tarih-kutu');
  if (kutu) kutu.parentNode.removeChild(kutu);
  var d = TS.hedef && $(TS.hedef + 'Dugme');
  if (d) {
    d.setAttribute('aria-expanded', 'false');
    if (odakGeriDon) d.focus();
  }
  TS.hedef = null;
}

EYLEMLER['tarih-ac'] = function (el, id) {
  if (TS.hedef === id && document.querySelector('.tarih-kutu')) { tsKapat(true); return; }
  tsKapat(false);
  var deger = $(id).value;
  var enErken = tsEnErken(el.parentNode);
  TS.hedef = id;
  TS.odak = deger || (enErken && enErken > tsBugun() ? enErken : tsBugun());
  TS.ay = TS.odak.slice(0, 7);
  el.setAttribute('aria-expanded', 'true');
  var kutu = document.createElement('div');
  kutu.className = 'tarih-kutu';
  kutu.setAttribute('role', 'dialog');
  kutu.setAttribute('aria-label', 'Tarih seç');
  el.parentNode.appendChild(kutu);
  tsCiz(true);
  /* Sağda yer yoksa (ör. pencerenin sağ sütunu) takvim alanın sağ kenarına hizalanır. */
  var r = kutu.getBoundingClientRect(), sinir = el.closest('.modal') || document.documentElement;
  if (r.right > Math.min(window.innerWidth, sinir.getBoundingClientRect().right) - 8) kutu.classList.add('saga');
};

function tsHafta(d) {
  /* ISO hafta numarası (Pazartesi başlar) */
  var t = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  var g = t.getUTCDay() || 7;
  t.setUTCDate(t.getUTCDate() + 4 - g);
  var yilBasi = new Date(Date.UTC(t.getUTCFullYear(), 0, 1));
  return Math.ceil(((t - yilBasi) / 86400000 + 1) / 7);
}

/* K12net'teki gibi: ‹ Eylül 2025 ›, solda hafta numarası, altı hafta (önceki
   ve sonraki ayın günleri soluk), altta Bugün · Temizle · Tamam. Güne
   dokununca seçilir, pencere açık kalır; Tamam, Esc ya da dışarı tıklama
   kapatır. Günün altındaki noktalar: tatil, okul etkinliği, ödevin son günü. */
function tsCiz(odakla) {
  var kutu = document.querySelector('.tarih-kutu');
  var kap = TS.hedef && document.querySelector('[data-tarih-alan="' + TS.hedef + '"]');
  if (!kutu || !kap) return;
  tsAyVerisi(TS.ay);
  var veri = TS.veri[TS.ay] || {};
  var secili = $(TS.hedef).value, bugun = tsBugun(), enErken = tsEnErken(kap);
  var ilk = tsTarih(TS.ay + '-01');
  var bas = new Date(ilk.getFullYear(), ilk.getMonth(), 1 - ((ilk.getDay() + 6) % 7));

  var h = '<div class="tk-ust">' +
    '<button type="button" class="tk-ok" data-act="tarih-ay" data-id="-1" aria-label="Önceki ay">&#8249;</button>' +
    '<b>' + AY_ADI[ilk.getMonth()] + ' ' + ilk.getFullYear() + '</b>' +
    '<button type="button" class="tk-ok" data-act="tarih-ay" data-id="1" aria-label="Sonraki ay">&#8250;</button></div>' +
    '<div class="tk-izgara" role="grid"><span class="tk-bas tk-hf" aria-hidden="true"></span>';
  for (var s = 0; s < 7; s++) h += '<span class="tk-bas" aria-hidden="true">' + TS_GUN_KISA[s] + '</span>';
  for (var hafta = 0; hafta < 6; hafta++) {
    var pzt = new Date(bas.getFullYear(), bas.getMonth(), bas.getDate() + hafta * 7);
    h += '<span class="tk-hf" aria-hidden="true">' + tsHafta(pzt) + '</span>';
    for (var gn = 0; gn < 7; gn++) {
      var d = new Date(pzt.getFullYear(), pzt.getMonth(), pzt.getDate() + gn);
      var t = tsIso(d);
      var buAy = t.slice(0, 7) === TS.ay;
      var v = buAy ? (veri[t] || {}) : {};
      var olay = v.olaylar || [];
      var odev = olay.filter(function (o) { return o.tur === 'odev'; }).length;
      var etkinlik = olay.filter(function (o) { return o.tur !== 'odev' && o.tur !== 'tatil'; }).length;
      var kapali = enErken && t < enErken;
      var etiket = tarihGun(t) + (v.tatil ? ', tatil' : '') + (odev ? ', ' + odev + ' ödevin son günü' : '') +
        (etkinlik ? ', ' + etkinlik + ' etkinlik' : '');
      h += '<button type="button" role="gridcell" class="tk-gun' + (buAy ? '' : ' diger') + (t === bugun ? ' bugun' : '') +
        (t === secili ? ' secili' : '') + (gn >= 5 ? ' hs' : '') + (v.tatil ? ' tatil' : '') + (t === TS.odak ? ' odak' : '') +
        '" data-act="tarih-sec" data-id="' + t + '" tabindex="' + (t === TS.odak ? '0' : '-1') + '" aria-label="' + esc(etiket) + '"' +
        (kapali ? ' disabled' : '') + (t === secili ? ' aria-selected="true"' : '') + '>' + tsIki(d.getDate()) +
        ((odev || etkinlik || v.tatil) ? '<span class="tk-isaret">' +
          (v.tatil ? '<i class="tatil"></i>' : '') + (etkinlik ? '<i class="etkinlik"></i>' : '') + (odev ? '<i class="odev"></i>' : '') +
          '</span>' : '') + '</button>';
    }
  }
  var bugunKapali = enErken && bugun < enErken;
  h += '</div><div class="tk-ajanda" aria-live="polite">' + tsAjanda(TS.odak) + '</div>' +
    '<div class="tk-alt">' +
    '<button type="button" class="btn kucuk tk-bugun" data-act="tarih-sec" data-id="' + bugun + '"' + (bugunKapali ? ' disabled' : '') + '>Bugün</button>' +
    '<button type="button" class="btn kucuk tk-temizle" data-act="tarih-temizle">Temizle</button>' +
    '<button type="button" class="btn kucuk tk-tamam" data-act="tarih-kapat">Tamam</button></div>';
  kutu.innerHTML = h;
  if (odakla !== false) {
    var o = kutu.querySelector('.tk-gun.odak');
    if (o) o.focus();
  }
}

/* Üzerine gelinen ya da seçilen günün ajandası: tatil, etkinlik, o gün
   biten ödevler, o gün kaç ders var. Kısa tutulur. */
function tsAjanda(t) {
  var v = (TS.veri[t.slice(0, 7)] || {})[t];
  var h = '<b>' + tarihGun(t) + '</b>';
  if (!v) return h + (TS.yukleniyor[t.slice(0, 7)] ? ' <span class="soluk">· yükleniyor</span>' : '');
  var parca = [];
  if (v.dersSayisi) parca.push(v.dersSayisi + ' dersin var');
  (v.olaylar || []).forEach(function (o) {
    var tur = o.tur === 'odev' ? 'odev' : o.tur === 'tatil' ? 'tatil' : 'etkinlik';
    parca.push('<span class="tk-tur ' + tur + '">' + (tur === 'odev' ? 'Ödev' : tur === 'tatil' ? 'Tatil' : 'Etkinlik') + '</span> ' +
      esc(o.baslik) + (tur === 'odev' && o.aciklama ? ' <span class="soluk">(' + esc(o.aciklama) + ')</span>' : ''));
  });
  return h + (parca.length ? '<div class="tk-ajanda-satir">' + parca.join(' · ') + '</div>' : ' <span class="soluk">· boş gün</span>');
}

EYLEMLER['tarih-ay'] = function (el, yon) {
  var d = tsTarih(TS.ay + '-01');
  d.setMonth(d.getMonth() + Number(yon));
  TS.ay = tsIso(d).slice(0, 7);
  var gun = Math.min(tsTarih(TS.odak).getDate(), new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate());
  TS.odak = TS.ay + '-' + tsIki(gun);
  tsCiz(false);
};

function tsDegerYaz(t) {
  var kutu = $(TS.hedef);
  kutu.value = t;
  var dugme = $(TS.hedef + 'Dugme');
  if (dugme) dugme.innerHTML = tsDugmeYazi(t) + '<span class="tarih-simge" aria-hidden="true">' + ik('takvim') + '</span>';
  kutu.dispatchEvent(new Event('change', { bubbles: true }));
  kutu.dispatchEvent(new Event('input', { bubbles: true }));
}

/* Güne dokununca seçilir; pencere açık kalır (başka ayın günüyse o aya geçer). */
EYLEMLER['tarih-sec'] = function (el, t) {
  if (!TS.hedef || el.disabled) return;
  tsDegerYaz(t);
  TS.odak = t;
  TS.ay = t.slice(0, 7);
  tsCiz(true);
};

EYLEMLER['tarih-temizle'] = function () {
  if (!TS.hedef) return;
  tsDegerYaz('');
  tsCiz(false);
};

EYLEMLER['tarih-kapat'] = function () { tsKapat(true); };

/* Klavye ve dışarı tıklama (bir kez kurulur). */
document.addEventListener('keydown', function (e) {
  if (!TS.hedef || !document.querySelector('.tarih-kutu')) return;
  var adim = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 }[e.key];
  if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); tsKapat(true); return; }
  if (e.key === 'PageUp' || e.key === 'PageDown') { e.preventDefault(); EYLEMLER['tarih-ay'](null, e.key === 'PageUp' ? -1 : 1); tsCiz(true); return; }
  if (!adim || !e.target.closest || !e.target.closest('.tk-izgara')) return;
  e.preventDefault();
  TS.odak = tsGunEkle(TS.odak, adim);
  TS.ay = TS.odak.slice(0, 7);
  tsCiz(true);
}, true);

document.addEventListener('mouseover', function (e) {
  var g = TS.hedef && e.target.closest && e.target.closest('.tk-gun');
  if (!g) return;
  var a = document.querySelector('.tk-ajanda');
  if (a) a.innerHTML = tsAjanda(g.getAttribute('data-id'));
});

document.addEventListener('click', function (e) {
  if (!TS.hedef || !e.target.closest) return;
  if (!e.target.closest('.tarih-alan')) tsKapat(false);
});
