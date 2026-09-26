/* Okul hayatı: yemek listesi, servis, kulüpler.
   Kim neyi görür ve düzenler sunucuda belirlenir; buradaki düğmeler yalnızca
   sunucunun "yapabilirsin" dediği kişiye çizilir. */

/* ================= yemek listesi ================= */
var YEMEK_GUN = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'];

function gunEkleYerel(gun, n) {
  var d = new Date(gun + 'T12:00:00Z');
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}
function gunKisa(gun) {
  var d = new Date(gun + 'T12:00:00Z');
  return d.getUTCDate() + ' ' + AY_ADI[d.getUTCMonth()];
}
function bugunYerel() {
  var d = new Date(), p = function (n) { return n < 10 ? '0' + n : '' + n; };
  return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate());
}

/* ================= servis ================= */
function telBaglanti(tel) {
  return tel ? '<a href="tel:' + esc(telefonNorm(tel)) + '">' + esc(telefonGoster(tel)) + '</a>' : '';
}

SAYFALAR.servis = function () {
  servisHaritasiDurdur();
  var servisciler = function (d) {
    return d.yonetir ? api('/school/servisciler').then(function (r) { return r.servisciler; })['catch'](function () { return []; })
      : Promise.resolve([]);
  };
  return api('/servis').then(function (d) {
    return Promise.all([servisciler(d), servisBildirimOnerisi()]).then(function (r) { servisSayfasi(d, r[0], r[1]); });
  });
};

/* Öğrenci seçme penceresi: ara, seç, durak yaz. Başka serviste olan
   öğrenci seçilirse bu servise taşınır. */
function servisHaritasi() {
  var servisAdi = {};
  for (var i = 0; i < S.servisVeri.servisler.length; i++) {
    var s = S.servisVeri.servisler[i];
    for (var j = 0; j < s.ogrenciler.length; j++) servisAdi[s.ogrenciler[j].id] = s.ad;
  }
  return servisAdi;
}

function servisAdayCiz() {
  var q = nrm($('svAra').value), liste = S.servisVeri.okulOgrencileri || [], h = '', n = 0;
  for (var i = 0; i < liste.length && n < 60; i++) {
    var o = liste[i];
    if (q && nrm(o.ad + ' ' + o.sinif).indexOf(q) < 0) continue;
    n++;
    var nerede = S.servisSecim.servisAdi[o.id];
    var buServis = nerede && S.servisVeri.servisler.some(function (s) {
      return s.id === S.servisSecim.servisId && s.ad === nerede;
    });
    h += '<div class="satir"><div class="buyu">' + esc(o.ad) + ' <span class="alt">' + esc(o.sinif) +
      (nerede ? ' · ' + (buServis ? 'bu serviste' : 'şu an ' + esc(nerede)) : '') + '</span></div>' +
      (buServis ? '' : '<button class="btn kucuk" data-act="servis-ogrenci-ekle" data-id="' + esc(o.id) + '">' + (nerede ? 'Taşı' : 'Ekle') + '</button>') +
      '</div>';
  }
  $('svListe').innerHTML = h || '<div class="hint">Eşleşen öğrenci yok.</div>';
}

