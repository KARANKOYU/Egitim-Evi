/* Mesajlar ve duyurular. */

/* ================= mesajlar ve duyurular ================= */

var MESAJ_KUTU_AD = { gelen: 'Gelen kutusu', giden: 'Gönderilenler' };
var IZIN_AD = {
  herkes: 'Okuldaki herkes yazabilir',
  personel: 'Yalnızca öğretmen ve yöneticiler yazabilir',
  kapali: 'Kimse yazamasın'
};

SAYFALAR.mesajlar = function () {
  if (!S.mesajKutu) S.mesajKutu = 'gelen';
  if (!S.mesajTur) S.mesajTur = '';

  var yol = '/mesajlar?kutu=' + S.mesajKutu + (S.mesajTur ? '&tur=' + S.mesajTur : '');
  return Promise.all([api(yol), api('/mesajlar/ayar')]).then(function (r) {
    var d = r[0], ayar = r[1];
    var h = hero('MESAJLAR', 'Okul içi mesajlar ve duyurular.');

    h += '<div class="kart"><div class="satir" style="border:0;padding:0">' +
      '<div class="buyu"><div class="sekme-satir">' +
      kutuDugme('gelen', 'Gelen kutusu', d.okunmamis) +
      kutuDugme('giden', 'Gönderilenler', 0) +
      '</div></div>' +
      '<button class="btn" data-act="mesaj-yeni">Yeni mesaj</button>' +
      '</div>';

    h += '<div class="sekme-satir alt" style="margin-top:12px">' +
      turDugme2('', 'Hepsi') + turDugme2('duyuru', 'Duyurular') +
      turDugme2('mesaj', 'Kişisel') + '</div></div>';

    if (!d.mesajlar.length) {
      h += bosKutu('posta', S.mesajKutu === 'gelen'
        ? 'Kutun boş. Sana bir mesaj geldiğinde burada görünür.'
        : 'Henüz mesaj göndermedin.');
    } else {
      h += '<div class="kart" style="padding:0">';
      for (var i = 0; i < d.mesajlar.length; i++) {
        h += mesajSatiri(d.mesajlar[i]);
      }
      h += '</div>';
    }

    /* --- izin ayarları ---
       Öğrencilerde bu ayar yok: okulda herkes öğrenciye yazabilmeli.
       Öğrencinin başka öğrenciye yazamaması zaten sunucuda sabit kural. */
    if (S.user.role === 'student') {
      yaz(h);
      S.mesajAyarGecici = ayar;
      return;
    }

    h += '<div class="kart"><h3>Bana kim yazabilir?</h3>' +
      '<div class="hint" style="margin-bottom:12px">' +
      'Duyurular bu ayardan etkilenmez — okul duyuruları her hâlükârda ulaşır.</div>' +
      '<div class="secenekler">';
    var secenekler = ['herkes', 'personel', 'kapali'];
    for (var j = 0; j < secenekler.length; j++) {
      var k = secenekler[j];
      h += '<label class="onay"><input type="radio" name="mesajIzin" value="' + k + '"' +
        (ayar.kimden === k ? ' checked' : '') + '>' +
        '<span>' + IZIN_AD[k] + '</span></label>';
    }
    h += '</div>';

    if (ayar.engelli.length) {
      h += '<div style="margin-top:14px"><div class="alt" style="margin-bottom:8px">' +
        'Engellediklerin</div>';
      for (var e = 0; e < ayar.engelli.length; e++) {
        var kisi = ayar.engelli[e];
        h += '<div class="satir"><div class="buyu"><div class="ad">' + esc(kisi.ad) +
          '</div><div class="alt">' + (ROL_AD[kisi.rol] || '') + '</div></div>' +
          '<button class="btn kucuk ghost" data-act="mesaj-engel-kaldir" data-id="' +
          esc(kisi.id) + '">Engeli kaldır</button></div>';
      }
      h += '</div>';
    }
    h += '<div id="mesajAyarMesaj" style="margin-top:10px"></div>' +
      '<button class="btn gri" data-act="mesaj-ayar-kaydet" style="margin-top:12px">' +
      'Ayarı kaydet</button></div>';

    yaz(h);
    S.mesajAyarGecici = ayar;
  });
};

function kutuDugme(k, ad, rozet) {
  return '<button class="sekme' + (S.mesajKutu === k ? ' secili' : '') +
    '" data-act="mesaj-kutu" data-kutu="' + k + '">' + ad +
    (rozet ? '<span class="sekme-rozet">' + rozet + '</span>' : '') + '</button>';
}

function turDugme2(t, ad) {
  return '<button class="sekme kucuk' + (S.mesajTur === t ? ' secili' : '') +
    '" data-act="mesaj-tur" data-tur="' + t + '">' + ad + '</button>';
}

function mesajSatiri(m) {
  var duyuru = m.tur === 'duyuru';
  var cocuk = (m.cocukIcin && m.cocukIcin.length)
    ? '<span class="cocuk-not">' + esc(m.cocukIcin.join(', ')) + ' için</span>' : '';
  return '<div class="mesaj-satir' + (m.okundu || S.mesajKutu === 'giden' ? '' : ' yeni') +
    '" data-act="mesaj-ac" data-id="' + esc(m.id) + '">' +
    (S.mesajKutu === 'giden' ? '' : avatar(m.gonderen, m.gonderenId, 'mesaj-avatar')) +
    '<div class="mesaj-govde-kutu">' +
    '<div class="mesaj-ust">' +
    '<span class="mesaj-kim">' +
    (S.mesajKutu === 'giden' ? 'Alıcı: ' + esc(m.hedefOzet) : esc(m.gonderen)) +
    '</span>' +
    (duyuru ? '<span class="duyuru-rozet">Duyuru</span>' : '') + cocuk +
    (S.mesajKutu === 'giden' && m.kisiSayisi
      ? '<span class="okuma-rozet' + (m.okuyanSayisi >= m.kisiSayisi ? ' tam' : '') + '">' +
        m.okuyanSayisi + ' / ' + m.kisiSayisi + ' okudu</span>' : '') +
    '<span class="mesaj-tarih">' + tarihSaat(m.tarih) + (m.duzenlenme ? ' · düzenlendi' : '') + '</span></div>' +
    '<div class="mesaj-konu">' + esc(m.konu) + '</div>' +
    '<div class="mesaj-onizleme">' + esc(m.onizleme) + '</div>' +
    '</div></div>';
}

function mesajAc(id) {
  return api('/mesajlar/' + id).then(function (d) {
    var m = d.mesaj;
    var govde = '<div class="mesaj-detay">' +
      '<div class="mesaj-detay-ust">' +
      '<div class="mesaj-kimden">' + avatar(m.gonderen, m.gonderenId) + '<div><b>' + esc(m.gonderen) + '</b>' +
      '<span class="alt"> · ' + (ROL_AD[m.gonderenRol] || '') + '</span></div></div>' +
      '<div class="alt">' + tarihSaat(m.tarih) +
      (m.duzenlenme ? ' · düzenlendi ' + tarihSaat(m.duzenlenme) : '') + '</div></div>';

    if (m.cocukIcin && m.cocukIcin.length) {
      govde += '<div class="msg bilgi">Bu mesaj çocuğun <b>' +
        esc(m.cocukIcin.join(', ')) + '</b> için gönderildi.</div>';
    }
    govde += '<div class="mesaj-govde">' + esc(m.govde).replace(/\n/g, '<br>') + '</div>' + ekListesiGoster(m.ekler);

    if (m.okumaGorur) {
      govde += '<div class="mesaj-alicilar okuma-bolum" id="okumaKap">' +
        '<div class="okuma-ozet"><b>' + m.okuyanSayisi + ' / ' + m.kisiSayisi + '</b> kişi okudu' +
        '<div class="cubuk"><i style="width:' + (m.kisiSayisi ? Math.round(100 * m.okuyanSayisi / m.kisiSayisi) : 0) + '%"></i></div></div>' +
        '<div class="okuma-bilgi"><div class="hint">Yükleniyor...</div></div></div>';
    }
    govde += '</div>';

    S._acikMesaj = m;
    modalAc(m.konu, govde,
      '<button class="btn tehlike" data-act="mesaj-sil" data-id="' + esc(m.id) + '">' +
      (m.gonderenId === S.user.id ? 'Mesajı sil' : 'Kutumdan kaldır') + '</button>' +
      (m.gonderenId === S.user.id ? '<button class="btn ghost" data-act="mesaj-duzelt" data-id="' + esc(m.id) + '">Düzelt</button>' : '') +
      '<button class="btn gri" data-act="modal-kapat">Kapat</button>');
    bildirimleriYenile();
    if (m.okumaGorur) okumaYukle(m.id);
  })['catch'](hataGoster);
}

/* ---- gönderilmiş mesajı düzeltme (yalnızca gönderen) ---- */
EYLEMLER['mesaj-duzelt'] = function () {
  var m = S._acikMesaj;
  if (!m) return;
  modalAc('Mesajı düzelt',
    '<div class="field"><label for="mdKonu">Konu</label><input type="text" id="mdKonu" maxlength="120" value="' + esc(m.konu) + '"></div>' +
    '<div class="field"><label for="mdGovde">Mesaj</label><textarea id="mdGovde" rows="8" maxlength="4000">' + esc(m.govde) + '</textarea>' +
    '<div class="hint">Alıcılara yeniden bildirim gitmez; mesajın altında "düzenlendi" ve saati görünür.</div></div>' +
    '<div id="mdMesaj"></div>',
    '<button class="btn gri" data-act="mesaj-ac" data-id="' + esc(m.id) + '">Vazgeç</button>' +
    '<button class="btn" data-act="mesaj-duzelt-kaydet" data-id="' + esc(m.id) + '">Kaydet</button>');
  $('mdGovde').focus();
};

EYLEMLER['mesaj-duzelt-kaydet'] = function (el, id) {
  var konu = $('mdKonu').value.trim(), govde = $('mdGovde').value.trim();
  if (!konu) { alanHatasi('mdKonu', 'Konu yaz.'); return; }
  if (!govde) { alanHatasi('mdGovde', 'Mesaj boş olamaz.'); return; }
  dugmeBekle(el, 'Kaydediliyor...');
  return api('/mesajlar/duzenle', 'POST', { id: id, konu: konu, govde: govde }).then(function () {
    return mesajAc(id);
  }).then(function () { if (S.page === 'mesajlar') git('mesajlar'); })
    ['catch'](function (e) { dugmeBitir(el); mesajGoster('mdMesaj', 'hata', e.message); });
};

/* ---- okundu bilgisi: kim okudu, kim okumadı, ne zaman ---- */
var okumaDurum = { veri: [], filtre: 'hepsi', rol: '', ara: '' };
var OKUMA_ROL_AD = { student: 'Öğrenciler', parent: 'Veliler', teacher: 'Öğretmenler', principal: 'Yöneticiler' };

function okumaYukle(id) {
  return api('/mesajlar/okuma?id=' + encodeURIComponent(id)).then(function (d) {
    okumaDurum = { veri: d.alicilar, filtre: 'hepsi', rol: '', ara: '' };
    okumaCiz();
  })['catch'](function (e) {
    var kap = $('okumaKap');
    if (kap) kap.querySelector('.okuma-bilgi').innerHTML = '<div class="hint">' + esc(e.message) + '</div>';
  });
}

/* ---- yeni mesaj ---- */
function mesajYeniModal() {
  return api('/mesajlar/hedefler').then(function (d) {
    S.mesajHedef = d;
    var duyuruSecim = d.duyuruIzin
      ? '<div class="secenekler" style="margin-bottom:14px">' +
        '<label class="onay"><input type="radio" name="mTur" value="mesaj" checked>' +
        '<span>Kişisel mesaj</span></label>' +
        '<label class="onay"><input type="radio" name="mTur" value="duyuru">' +
        '<span>Duyuru (cevaplanmaz, herkese ulaşır)</span></label></div>'
      : '';

    var hedefSecim = '<div class="field"><label>Kime</label>' +
      '<select id="mHedefTur">' +
      '<option value="kisi">Seçtiğim kişilere</option>' +
      (d.topluIzin ? '<option value="sinif">Sınıflara</option>' : '') +
      (d.topluIzin ? '<option value="rol">Rol grubuna</option>' : '') +
      (d.okulIzin ? '<option value="okul">Tüm okula</option>' : '') +
      '</select></div>';

    var kisiListe = '<div id="mHedefKisi"><div class="field">' +
      '<label for="mKisiAra">Kişi ara</label>' +
      '<input type="text" id="mKisiAra" placeholder="Ad yaz" autocomplete="off">' +
      '</div><div class="secim-kutu" id="mKisiKutu"></div></div>';

    var sinifListe = '<div id="mHedefSinif" style="display:none"><div class="secim-kutu">';
    for (var i = 0; i < d.siniflar.length; i++) {
      sinifListe += '<label class="onay"><input type="checkbox" class="mSinif" value="' +
        esc(d.siniflar[i].id) + '"><span>' + esc(d.siniflar[i].ad) +
        ' <span class="alt">(' + d.siniflar[i].sayi + ' öğrenci)</span></span></label>';
    }
    sinifListe += '</div></div>';

    var rolListe = '<div id="mHedefRol" style="display:none"><div class="secim-kutu">' +
      '<label class="onay"><input type="checkbox" class="mRol" value="student">' +
      '<span>Öğrenciler</span></label>' +
      '<label class="onay"><input type="checkbox" class="mRol" value="parent">' +
      '<span>Veliler</span></label>' +
      '<label class="onay"><input type="checkbox" class="mRol" value="teacher">' +
      '<span>Öğretmenler</span></label>' +
      '</div></div>';

    var okulNot = '<div id="mHedefOkul" style="display:none">' +
      '<div class="msg bilgi">Mesaj okuldaki herkese gidecek.</div></div>';

    var govde = duyuruSecim + hedefSecim + kisiListe + sinifListe + rolListe + okulNot +
      '<div class="field"><label for="mKonu">Konu</label>' +
      '<input type="text" id="mKonu" maxlength="120" placeholder="Kısa bir başlık"></div>' +
      '<div class="field"><label for="mGovde">Mesaj</label>' +
      '<textarea id="mGovde" rows="7" maxlength="4000" placeholder="Yazmak istediklerin"></textarea>' +
      '<div class="hint"><span id="mSayac">0</span> / 4000</div></div>' +
      ekAlani('mesaj', 'mesaj') +
      '<div id="mMesaj"></div>';

    modalAc('Yeni mesaj', govde,
      '<button class="btn gri" data-act="modal-kapat">Vazgeç</button>' +
      '<button class="btn" data-act="mesaj-gonder">Gönder</button>');

    mesajModalBagla();
    ekAlaniKur('mesaj');
  })['catch'](hataGoster);
}

function mesajModalBagla() {
  var d = S.mesajHedef;
  var secili = {};

  function kisileriCiz() {
    var q = ($('mKisiAra').value || '').toLocaleLowerCase('tr');
    var h = '';
    var n = 0;
    for (var i = 0; i < d.kisiler.length; i++) {
      var k = d.kisiler[i];
      if (q && k.ad.toLocaleLowerCase('tr').indexOf(q) < 0) continue;
      if (++n > 60) break;
      h += '<label class="onay' + (k.kapali ? ' pasif' : '') + '">' +
        '<input type="checkbox" class="mKisi" value="' + esc(k.id) + '"' +
        (secili[k.id] ? ' checked' : '') + (k.kapali ? ' disabled' : '') + '>' +
        '<span>' + esc(k.ad) + ' <span class="alt">' + (ROL_AD[k.rol] || '') +
        (k.brans ? ' · ' + esc(k.brans) : '') +
        (k.kapali ? ' · mesaj almıyor' : '') + '</span></span></label>';
    }
    $('mKisiKutu').innerHTML = h || '<div class="hint">Eşleşen kişi yok.</div>';
    var kutular = $('mKisiKutu').querySelectorAll('.mKisi');
    for (var j = 0; j < kutular.length; j++) {
      kutular[j].onchange = function () { secili[this.value] = this.checked; };
    }
  }

  $('mKisiAra').oninput = kisileriCiz;
  kisileriCiz();
  S.mesajSecili = secili;

  $('mHedefTur').onchange = function () {
    var t = this.value;
    $('mHedefKisi').style.display = t === 'kisi' ? '' : 'none';
    $('mHedefSinif').style.display = t === 'sinif' ? '' : 'none';
    $('mHedefRol').style.display = t === 'rol' ? '' : 'none';
    $('mHedefOkul').style.display = t === 'okul' ? '' : 'none';
  };

  $('mGovde').oninput = function () {
    $('mSayac').textContent = this.value.length;
  };
}

function mesajGonderIslemi(btn) {
  var t = $('mHedefTur').value;
  var hedef = { tur: t };
  if (t === 'kisi') {
    hedef.kisiler = Object.keys(S.mesajSecili || {}).filter(function (k) {
      return S.mesajSecili[k];
    });
  } else if (t === 'sinif') {
    hedef.siniflar = secililer('.mSinif');
  } else if (t === 'rol') {
    hedef.roller = secililer('.mRol');
  }

  var turSecim = document.querySelector('input[name=mTur]:checked');
  if (ekYukleniyor('mesaj')) { mesajGoster('mMesaj', 'uyari', 'Dosyalar yükleniyor; bitince gönder.'); return; }
  btn.disabled = true;
  api('/mesajlar', 'POST', {
    tur: turSecim ? turSecim.value : 'mesaj',
    konu: $('mKonu').value,
    govde: $('mGovde').value,
    hedef: hedef,
    ekIdler: ekIdleri('mesaj')
  }).then(function (r) {
    modalKapat();
    git('mesajlar').then(function () { sayfaMesaji('iyi', r.message); });
    bildirimleriYenile();
  })['catch'](function (e) {
    btn.disabled = false;
    mesajGoster('mMesaj', 'hata', e.message);
  });
}

function secililer(secici) {
  var out = [];
  var el = document.querySelectorAll(secici);
  for (var i = 0; i < el.length; i++) if (el[i].checked) out.push(el[i].value);
  return out;
}
