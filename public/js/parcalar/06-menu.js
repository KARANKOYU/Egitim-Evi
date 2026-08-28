/* Sol menü: role göre bölümler. */

/* ================= okulun kapattığı bölümler =================
   Müdür Özellikler sayfasından kapatır; sunucu da reddeder. Sayfa -> özellik. */
var SAYFA_OZELLIK = {
  'ogr-odevler': 'odev', odevler: 'odev', 'ders-odevleri': 'odev', 'veli-odevler': 'odev',
  'ogr-sinavlar': 'sinav', sinavlarim: 'sinav',
  yoklama: 'devamsizlik', devamsizlik: 'devamsizlik', devamsizligim: 'devamsizlik', 'veli-devamsizlik': 'devamsizlik',
  etutler: 'etut', etutlerim: 'etut', 'etut-yoklama': 'etut',
  servis: 'servis', seferim: 'servis',
  yemek: 'yemek', kulupler: 'kulup', anketler: 'anket'
};
function ozellikAcik(k) { return !S.kapali || S.kapali.indexOf(k) < 0; }
function sayfaAcik(sayfa) { var o = SAYFA_OZELLIK[sayfa]; return !o || ozellikAcik(o); }

/* Kapalı bölümleri atar; altında hiçbir bağlantı kalmayan başlık ve ayraç da gider. */
function menuSuz(liste) {
  var l = liste.filter(function (n) { return !n.k || sayfaAcik(n.k); });
  l = l.filter(function (n, i) {
    if (!n.baslik) return true;
    for (var j = i + 1; j < l.length; j++) { if (l[j].k) return true; if (l[j].ayrac || l[j].baslik) return false; }
    return false;
  });
  return l.filter(function (n, i) {
    if (!n.ayrac) return true;
    for (var j = i + 1; j < l.length; j++) { if (l[j].k || l[j].baslik) return true; if (l[j].ayrac) return false; }
    return false;
  });
}

function navCiz() {
  var liste = menuSuz(navTanim()), h = '';
  for (var i = 0; i < liste.length; i++) {
    var n = liste[i];
    if (n.ayrac) { h += '<div class="nav-ayrac"></div>'; continue; }
    if (n.baslik) { h += '<div class="nav-baslik">' + esc(n.baslik) + '</div>'; continue; }
    h += '<button class="navlink' + (S.page === n.k ? ' on' : '') + '" data-nav="' + esc(n.k) + '">' +
      ik(n.g) + '<span>' + esc(n.ad) + '</span></button>';
  }
  h += '<div class="nav-ayrac"></div>' +
    /* Yetişkin hesabı: roller (öğretmen@okul, müdür@okul, veli) arasında geçiş. */
    (S.user && (S.user.yetiskin || S.user.rolSatiri)
      ? '<button class="navlink' + (S.page === 'kisilikler' ? ' on' : '') + '" data-nav="kisilikler">' + ik('grup') +
        '<span>Hesap değiştir</span></button>' : '') +
    '<button class="navlink" data-nav="profil">' + ik('ayar') + '<span>Ayarlar</span></button>' +
    '<button class="navlink" data-act="cikis">' + ik('cikis') + '<span>Çıkış Yap</span></button>';
  $('navListe').innerHTML = h;
}
