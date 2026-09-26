/* Portallar ve "+ Ekle".
   Yetişkin hesabı birden çok portala sahip olabilir: A okulunda öğretmen, B
   okulunda müdür, çocuğunun velisi (her çocuk ayrı satır). Portallar sol
   menünün en üstünde, "Portallarım" başlığı altında alt alta durur
   (06-menu.js); dokununca o portala geçilir. Okul rolüne geçmek yeni oturum
   demektir (eskisi kapanır); veli portalı yetişkin hesabının kendisidir, yalnız
   seçili çocuk değişir.
   Sağ üstteki "+ Ekle" üç yol açar: Veli (çocuğun veli kodu), Öğretmen (kişi
   kodunu okulun müdürüne vermek) ve Müdür (kişi kodunu sistem yöneticisine
   vermek; okulu ve adresini o açar). Kimin hangi portala geçebileceğini sunucu
   denetler. Yönetim (okuldan ayrıl, çocuğu kaldır) Ayarlar'daki "Portallarım"
   kartındadır. */

var kisilikVeri = null;   // GET /api/kisilikler (kişi kodu); Ekle penceresi açılınca tazelenir

var PORTAL_SIMGE = { teacher: 'ogretmen', principal: 'mudur', parent: 'veli' };

/* ---------------- portal durumu ---------------- */
/* Giriş, portal değişimi ve /api/me cevabındaki portallar (öğrenci, servisçi
   ve yöneticide gelmez: menüde "Portallarım" ve üstte "+ Ekle" olmaz). */
function portalDurumuAl(d) {
  S.portallar = d && d.portallar ? d.portallar : null;
  S.hesapAktif = !!(d && d.hesapAktif);
}

/* Yetişkin hesabının ana sayfasında (portal dışında) olmak bu sekmede
   hatırlanır: sayfa yenilenince kişi seçtiği yerde kalsın. */
function portalDisiYaz(v) {
  S.portalDisi = !!v;
  try {
    if (v) sessionStorage.setItem('ee_portal_disi', '1');
    else sessionStorage.removeItem('ee_portal_disi');
  } catch (e) { /* gizli sekmede yazılamaz, sorun değil */ }
}
function portalDisiOku() {
  try { return sessionStorage.getItem('ee_portal_disi') === '1'; } catch (e) { return false; }
}

/* Oturum yetişkin hesabının kendisinde ve hiçbir portalda değil mi? Rolsüz
   hesap hep portal dışındadır; velisi olduğu çocuğu olan hesap bir çocuğunu
   seçince veli portalındadır. */
function portalDisindaMi() {
  var u = S.user;
  if (!u || !u.yetiskin || u.rolSatiri) return false;
  return !u.role || !!S.portalDisi;
}

/* Kişi şu an bu portalda mı? Veli portalında yalnız seçili çocuk işaretlenir.
   Şeritte "Hepsi" seçiliyken (birden çok çocuk) hiçbiri işaretlenmez; her
   çocuğa "Geç" çıkar. Tek çocuk varsa "Hepsi" o çocuktur. */
function portalAktifMi(p) {
  var u = S.user;
  if (!u) return false;
  if (p.tur === 'rol') return u.id === p.id;
  if (u.rolSatiri || u.role !== 'parent' || portalDisindaMi()) return false;
  if (S.veliCocuk) return S.veliCocuk === p.id;
  return (S.children || []).length === 1;
}

function portalAlt(p) { return p.alt || p.okulAdi || ''; }

/* Portalları ve hesabı sunucudan tazeler: çocuk eklenip çıkarılınca, bir okul
   kişiyi ekleyince (bildirim gelince). Portal dışındaysa orada kalır. */
function portallariTazele() {
  var disi = portalDisindaMi();
  return api('/me').then(function (m) {
    S.user = m.user;
    S.children = m.children || [];
    S.kapali = m.kapaliOzellikler || [];
    portalDurumuAl(m);
    if (S.veliCocuk && !S.children.some(function (c) { return c.id === S.veliCocuk; })) S.veliCocuk = null;
    if (disi && S.user.yetiskin && !S.user.rolSatiri) portalDisiYaz(true);
    navCiz();
  })['catch'](function () { });
}

/* ---------------- sol menünün başı ---------------- */
function portalMenusu() {
  if (!S.portallar || !S.user) return '';
  var h = '<div class="nav-baslik">Portallarım</div>';
  for (var i = 0; i < S.portallar.length; i++) {
    var p = S.portallar[i];
    var on = portalAktifMi(p);
    h += '<button class="navlink portal-link' + (on ? ' on' : '') + (p.girilebilir ? '' : ' kapali') + '"' +
      ' data-act="kisilik-gec" data-tur="' + esc(p.tur) + '" data-id="' + esc(p.id) + '"' +
      (on ? ' aria-current="page"' : '') + (p.girilebilir ? '' : ' title="Okul şu an kapalı"') + '>' +
      ik(PORTAL_SIMGE[p.rol] || 'okul') +
      '<span class="portal-yazi"><span class="portal-rol">' + esc(p.ad) + '</span>' +
      '<span class="portal-alt">' + esc(portalAlt(p)) + '</span></span></button>';
  }
  h += '<button class="navlink portal-ekle" data-act="kisilik-ekle">' + ik('ekle') + '<span>Portal ekle</span></button>';
  return h + '<div class="nav-ayrac"></div>';
}

/* ---------------- yetişkin hesabının ana sayfası (portal dışı) ----------------
   Portalı olmayan: "+ Ekle"ye çağıran sade kart. Portalı olan: menüdekiyle
   aynı portal kartları (dokununca geçer). Tek portalı olan girişte doğrudan
   o portala girer (sunucu, kayit.js girisOturumu). */
function portalAnaSayfasi() {
  return portallariTazele().then(function () {
    var l = S.portallar || [];
    if (!l.length) {
      yaz('<div class="kart portal-bos">' +
        '<div class="portal-bos-cizim">' + cizim('cocuk-ekle') + cizim('kisi-kodu') + cizim('okul-ac') + '</div>' +
        '<h1>Henüz bir portalın yok</h1>' +
        '<p>Sağ üstteki <b>+ Ekle</b> ile başla: çocuğunu ekle, okuluna öğretmen olarak katıl ya da okulunu açtır.</p>' +
        '<button class="btn portal-bos-dugme" data-act="kisilik-ekle">' + ik('ekle') + '<span>Ekle</span></button></div>');
      return;
    }
    var h = hero('PORTALLARIN', 'Soldaki menüden bir portal seç.') + '<div class="portal-kartlar">';
    for (var i = 0; i < l.length; i++) {
      var p = l[i];
      h += '<button type="button" class="portal-kart' + (p.girilebilir ? '' : ' kapali') + '"' +
        ' data-act="kisilik-gec" data-tur="' + esc(p.tur) + '" data-id="' + esc(p.id) + '">' +
        cizim(PORTAL_SIMGE[p.rol] || 'okul-ac', 'portal-kart-cizim') +
        '<span class="portal-kart-rol">' + esc(p.ad) +
        (p.girilebilir ? '' : ' <span class="etiket turuncu">okul kapalı</span>') + '</span>' +
        '<span class="portal-kart-alt">' + esc(portalAlt(p)) + '</span>' +
        (p.tur === 'veli' && p.okulAdi ? '<span class="portal-kart-okul">' + esc(p.okulAdi) + '</span>' : '') +
        '</button>';
    }
    h += '<button type="button" class="portal-kart ekle" data-act="kisilik-ekle">' +
      '<span class="portal-kart-arti">' + ik('ekle') + '</span>' +
      '<span class="portal-kart-rol">Ekle</span><span class="portal-kart-alt">Çocuğunu, okulunu ya da öğretmenliğini ekle</span></button>';
    yaz(h + '</div>');
  });
}

/* ---------------- Ayarlar: "Portallarım" kartı ---------------- */
function portalYonetimKarti() {
  var l = S.portallar || [];
  var h = '<div class="kart" id="portalKart"><div class="kart-ust-satir"><h3>Portallarım</h3>' +
    '<button class="btn kucuk" data-act="kisilik-ekle">' + ik('ekle') + '<span>Ekle</span></button></div>';
  if (!l.length) {
    h += '<p class="hint">Henüz bir portalın yok. <b>+ Ekle</b> ile çocuğunu ekle, okuluna öğretmen olarak katıl ' +
      'ya da okulunu açtır.</p>';
  }
  for (var i = 0; i < l.length; i++) {
    var p = l[i];
    var on = portalAktifMi(p);
    var alt = p.tur === 'veli' ? (p.okulAdi || '')
      : p.rol === 'principal' ? 'Müdürlüğü bırakmak için sistem yöneticisiyle iletişime geç.' : '';
    h += '<div class="satir portal-satir">' + ik(PORTAL_SIMGE[p.rol] || 'okul') +
      '<div class="buyu"><div class="ad">' + esc(p.ad) + ' · ' + esc(portalAlt(p)) +
      (on ? ' <span class="etiket yesil">şu an buradasın</span>' : '') +
      (p.girilebilir ? '' : ' <span class="etiket turuncu">okul kapalı</span>') + '</div>' +
      (alt ? '<div class="alt">' + esc(alt) + '</div>' : '') + '</div>' +
      '<div class="portal-islem">' +
      (on || !p.girilebilir ? '' : '<button class="btn kucuk" data-act="kisilik-gec" data-tur="' + esc(p.tur) + '" ' +
        'data-id="' + esc(p.id) + '">Geç</button>') +
      (p.rol === 'teacher' ? '<button class="btn kucuk gri" data-act="kisilik-ayril" data-id="' + esc(p.id) + '" ' +
        'data-ad="' + esc(p.okulAdi) + '">Okuldan ayrıl</button>' : '') +
      (p.tur === 'veli' ? '<button class="btn kucuk gri" data-act="kisilik-cocuk-kaldir" data-id="' + esc(p.id) + '" ' +
        'data-ad="' + esc(p.alt) + '">Kaldır</button>' : '') +
      '</div></div>';
  }
  return h + '</div>';
}

/* ---------------- portala geç ----------------
   hedefSayfa: geçişten sonra açılacak sayfa (telefon bildiriminden gelindiyse
   bildirimin götürdüğü yer); verilmezse ana sayfa. */
function oturumuDegistir(d, hedefSayfa) {
  var eski = S.token;
  S.token = d.token;
  tokenYenile(d.token, eski);
  oturumDurumunuSifirla();
  S.user = d.user;
  S.children = d.children || [];
  S.kapali = d.kapaliOzellikler || [];
  S.veliCocuk = d.cocuk || null;
  portalDurumuAl(d);
  S.acilis = hedefSayfa && SAYFALAR[hedefSayfa] ? hedefSayfa : 'ana';
  modalKapat();
  girisSonrasi(d);
}

EYLEMLER['kisilik-gec'] = function (el, id) {
  var tur = el.getAttribute('data-tur');
  var u = S.user;
  if (tur === 'rol' && u.id === id) return git('ana');
  /* Veli portalı yetişkin hesabının kendisidir: yeni oturum gerekmez, seçili
     çocuk değişir (yıl seçici o çocuğun okuluna göre). */
  if (tur === 'veli' && u.yetiskin && !u.rolSatiri && u.role === 'parent') {
    S.veliCocuk = id;
    portalDisiYaz(false);
    return yilBilgisiYukle().then(function () { return git('ana'); });
  }
  el.disabled = true;
  return api('/kisilik/gec', 'POST', { tur: tur, id: id })
    .then(function (d) { oturumuDegistir(d); })['catch'](function (e) { el.disabled = false; hataGoster(e); });
};

EYLEMLER['kisilik-ayril'] = function (el, id) {
  if (!confirm((el.getAttribute('data-ad') || 'Bu okul') + ' okulundan ayrılmak istiyor musun?\n\nOkulun öğretmen listesinden çıkarsın; ' +
    'verdiğin ödevler ve notlar okulda kalır. Geri dönmek için okula yeni kişi kodunu vermen gerekir.')) return;
  dugmeBekle(el, 'Bekle...');
  return api('/kisilik/ayril', 'POST', { id: id, onay: true }).then(function (d) {
    /* Bıraktığı okuldaydıysa oturum yetişkin hesabına döner: ana sayfasında
       kalan portallarından birini seçer. */
    if (d.token) {
      S._acilisMesaji = { tur: 'iyi', d: { message: d.message } };
      d.kisilikSec = true;
      oturumuDegistir(d);
      return;
    }
    return portallariTazele().then(function () { return git('profil'); })
      .then(function () { sayfaMesaji('iyi', d.message); });
  })['catch'](function (e) { dugmeBitir(el); hataGoster(e); });
};

EYLEMLER['kisilik-cocuk-kaldir'] = function (el, id) {
  var ad = el.getAttribute('data-ad') || 'Bu öğrenci';
  if (!confirm(ad + ' hesabından kaldırılsın mı? Bilgilerini artık göremezsin.')) return;
  el.disabled = true;
  return api('/kisilik/cocuk-kaldir', 'POST', { id: id }).then(function () {
    if (S.veliCocuk === id) S.veliCocuk = null;
    return portallariTazele();
  }).then(function () { return git('profil'); })
    .then(function () { sayfaMesaji('iyi', ad + ' hesabından kaldırıldı.'); })
    ['catch'](function (e) { el.disabled = false; hataGoster(e); });
};

/* ---------------- + Ekle ---------------- */
var EKLE_SECENEK = [
  { tur: 'veli', cizim: 'cocuk-ekle', ad: 'Veli', alt: 'Çocuğunun veli kodunu gir; ödevini, notunu, servisini gör.' },
  { tur: 'ogretmen', cizim: 'kisi-kodu', ad: 'Öğretmen', alt: 'Kişi kodunu okulunun müdürüne ver; seni okula ekler.' },
  { tur: 'mudur', cizim: 'okul-ac', ad: 'Müdür', alt: 'Okulunu Eğitim Evi\'ne açtır.' }
];
var EKLE_BASLIK = { veli: 'Çocuğunu ekle', ogretmen: 'Öğretmen olarak katıl', mudur: 'Okulunu açtır' };

function ekleSecenekleri() {
  return '<div class="ekle-secenek">' + EKLE_SECENEK.map(function (s) {
    return '<button type="button" class="ekle-kutu" data-act="ekle-sec" data-tur="' + s.tur + '">' + cizim(s.cizim) +
      '<span class="ekle-ad">' + esc(s.ad) + '</span><span class="ekle-alt">' + esc(s.alt) + '</span></button>';
  }).join('') + '</div>';
}

/* Sistem yöneticisinin iletişim bilgisi (/api/site, data/config.yml). */
function yoneticiIletisimi() {
  if (siteBilgisi.iletisim) return Promise.resolve(siteBilgisi.iletisim);
  return api('/site').then(function (d) { return d.iletisim || {}; })['catch'](function () { return {}; });
}
function yoneticiIletisimHtml(il) {
  il = il || {};
  if (!il.eposta && !il.telefon) {
    return '<div class="hint">Yöneticimize sayfanın altındaki iletişim bilgilerinden ulaşabilirsin.</div>';
  }
  var h = '<div class="ekle-iletisim-baslik">Yöneticimize ulaş</div><div class="ekle-iletisim-bag">';
  if (il.eposta) {
    h += '<a class="site-iletisim-bag" href="mailto:' + esc(il.eposta) + '">' + ik('posta') + '<span>' + esc(il.eposta) + '</span></a>';
  }
  if (il.telefon) {
    h += '<a class="site-iletisim-bag" href="tel:' + esc(String(il.telefon).replace(/[^0-9+]/g, '')) + '">' + ik('telefon') +
      '<span>' + esc(il.telefon) + '</span></a>';
  }
  return h + '</div>';
}

var ekleIcerik = {
  veli: function () {
    return '<div class="ekle-panel">' + cizim('cocuk-ekle', 'ekle-panel-cizim') +
      '<p>Çocuğunun <b>veli kodunu</b> yaz; ödevini, notunu, servisini görürsün.</p>' +
      '<div class="field"><label for="ekVeliKod">Veli kodu</label>' +
      '<div class="rolsuz-satir">' + kisiKoduGirdisi('ekVeliKod') +
      '<button class="btn" data-act="ekle-cocuk-kaydet">Ekle</button></div>' +
      '<div class="hint">Kodu okulundan alırsın. Büyük/küçük harfe dikkat et; boşluklar önemli değil.</div></div></div>';
  },
  ogretmen: function (d) {
    return '<div class="ekle-panel">' + cizim('kisi-kodu', 'ekle-panel-cizim') +
      '<p>Bu <b>kişi kodunu</b> okulunun müdürüne ver. Müdür <b>Öğretmenler &gt; Kodla ekle</b> ekranında kodu girince ' +
      'okulun sol üstteki menüde görünür.</p>' +
      kisiKoduKutusu(d.kisiKodu, 'ekKisiKod', true, '<button class="btn gri kucuk" data-act="ekle-kod-yenile">Yeni kod üret</button>') +
      '<div class="hint">Kod bir kez kullanılır; müdür seni ekleyince yenilenir. Kodu yanlış kişiye verdiysen ' +
      '"Yeni kod üret" ile eskisini geçersiz kıl.</div></div>';
  },
  mudur: function (d) {
    return '<div class="ekle-panel">' + cizim('okul-ac', 'ekle-panel-cizim') +
      '<p>Yöneticimize okulunun adını ve bu kodu ver. Okulunu ve adresini (' + esc(location.host) + '/school/okulun-adi) ' +
      'açıp seni müdür yapar; okul sol üstteki menüde görünür.</p>' +
      kisiKoduKutusu(d.kisiKodu, 'ekKisiKod', true) +
      '<div class="ekle-iletisim">' + yoneticiIletisimHtml(d.iletisim) + '</div></div>';
  }
};

/* Öğretmen ve Müdür panelleri kişinin güncel kodunu ister (kod kullanılınca
   yenilenir: pencere her açılışta sunucudan alır). */
function ekleAc(tur) {
  if (!ekleIcerik[tur]) return;
  var hazir = tur === 'veli' ? Promise.resolve({}) : api('/kisilikler').then(function (k) {
    kisilikVeri = k;
    if (tur !== 'mudur') return { kisiKodu: k.kisiKodu };
    return yoneticiIletisimi().then(function (il) { return { kisiKodu: k.kisiKodu, iletisim: il }; });
  });
  return hazir.then(function (d) {
    modalAc(EKLE_BASLIK[tur], ekleIcerik[tur](d) + '<div id="ekleMesaj" style="margin-top:10px"></div>',
      '<button class="btn gri" data-act="kisilik-ekle">Geri</button>' +
      '<button class="btn gri" data-act="modal-kapat">Kapat</button>');
    var kutu = $('ekVeliKod');
    if (kutu) {
      kutu.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') { e.preventDefault(); EYLEMLER['ekle-cocuk-kaydet'](document.querySelector('[data-act="ekle-cocuk-kaydet"]')); }
      });
      kutu.focus();
    }
  })['catch'](hataGoster);
}

EYLEMLER['kisilik-ekle'] = function () {
  modalAc('Ne eklemek istiyorsun?', ekleSecenekleri());
};
EYLEMLER['ekle-sec'] = function (el) { return ekleAc(el.getAttribute('data-tur')); };

EYLEMLER['ekle-cocuk-kaydet'] = function (el) {
  var kutu = $('ekVeliKod');
  alanTemizle(kutu.closest('.field'));
  var sorun = kisiKoduDenetle(kutu.value, 'Veli kodu');
  if (sorun) { alanHatasi(kutu, sorun); kutu.focus(); return; }
  var onceki = (S.portallar || []).filter(function (p) { return p.tur === 'veli'; }).map(function (p) { return p.id; });
  dugmeBekle(el, 'Ekleniyor...');
  return api('/kisilik/cocuk', 'POST', { code: kisiKoduSade(kutu.value) }).then(function (d) {
    modalKapat();
    return portallariTazele().then(function () {
      var yeni = (S.portallar || []).filter(function (p) { return p.tur === 'veli' && onceki.indexOf(p.id) < 0; })[0];
      /* Yetişkin hesabındayken yeni çocuğun portalı açılır; okul rolündeyken
         orada kalınır, çocuk menüde görünür. */
      if (yeni && S.user.yetiskin && !S.user.rolSatiri) {
        S.veliCocuk = yeni.id;
        portalDisiYaz(false);
        return yilBilgisiYukle().then(function () { return git('ana'); })
          .then(function () { sayfaMesaji('iyi', d.message); });
      }
      sayfaMesaji('iyi', d.message + ' Sol üstteki menüden veli olarak geçebilirsin.');
    });
  })['catch'](function (e) { dugmeBitir(el); alanHatasi(kutu, e.message); kutu.focus(); });
};

EYLEMLER['ekle-kod-yenile'] = function (el) {
  if (!confirm('Yeni kod üretilsin mi? Eski kod artık çalışmaz.')) return;
  dugmeBekle(el, 'Üretiliyor...');
  return api('/kisilik/kod', 'POST', {}).then(function (d) {
    dugmeBitir(el);
    if (kisilikVeri) kisilikVeri.kisiKodu = d.kisiKodu;
    kisiKoduYenile('ekKisiKod', d.kisiKodu);
    mesajGoster('ekleMesaj', 'iyi', d.message);
  })['catch'](function (e) { dugmeBitir(el); mesajGoster('ekleMesaj', 'hata', e.message); });
};
