/* Öğretmen: Sınıflarım. Girdiği sınıflar → sınıfın öğrencileri → öğrencinin
   ona verdiği ödevler (yaptı mı) ve sınav sonuçları. "Girdiği sınıfların
   öğrenci sonuçlarını görür" yetkisi ister (müdür rollerden açar/kapatır). */

SAYFALAR.siniflarim = function () {
  return api('/teacher/siniflarim').then(function (d) {
    var h = hero('SINIFLARIM', 'Ders verdiğin sınıflar. Sınıfa, sonra öğrenciye dokun: verdiğin ödevler ve sınav sonuçları.');
    if (!d.siniflar.length) { yaz(h + bosKutu('sinif', 'Henüz bir sınıfa dersin yok. Müdür seni bir derse atayınca burada görünür.')); return; }
    if (!S.snfSinif || !d.siniflar.some(function (c) { return c.id === S.snfSinif; })) S.snfSinif = d.siniflar[0].id;
    h += '<div class="snf-kartlar">';
    for (var i = 0; i < d.siniflar.length; i++) {
      var c = d.siniflar[i];
      h += '<button type="button" class="snf-kart' + (c.id === S.snfSinif ? ' secili' : '') + '" data-act="snf-sinif" data-id="' + esc(c.id) + '">' +
        '<span class="snf-ad">' + esc(c.ad) + '</span>' +
        '<span class="snf-alt">' + esc(c.dersler.join(', ')) + ' · ' + c.ogrenciSayisi + ' öğrenci</span></button>';
    }
    h += '</div><div id="snfOgrenciler"><div class="hint">Yükleniyor...</div></div>';
    yaz(h);
    return snfOgrencileriCiz();
  });
};

function snfOgrencileriCiz() {
  return api('/teacher/sinif?id=' + encodeURIComponent(S.snfSinif)).then(function (d) {
    var kap = $('snfOgrenciler');
    if (!kap) return;
    if (!d.ogrenciler.length) { kap.innerHTML = bosKutu('ogrenci', 'Bu sınıfta öğrenci yok.'); return; }
    var h = '<h3 class="sb">' + esc(d.sinif.ad) + ' — ' + d.ogrenciler.length + ' öğrenci</h3><div class="kart" style="padding:0">';
    for (var i = 0; i < d.ogrenciler.length; i++) {
      var o = d.ogrenciler[i];
      h += '<button type="button" class="satir tikla snf-ogrenci" data-act="snf-ogrenci" data-id="' + esc(o.id) + '" data-ara="' + esc(o.fullName + ' ' + o.okulNo) + '">' +
        avatar(o.fullName, o.id) + '<div class="buyu"><div class="ad">' + esc(o.fullName) + '</div>' +
        (o.okulNo ? '<div class="alt">No ' + esc(o.okulNo) + '</div>' : '') + '</div><span class="snf-ok" aria-hidden="true">›</span></button>';
    }
    kap.innerHTML = h + '</div>';
  })['catch'](function (e) { var kap = $('snfOgrenciler'); if (kap) kap.innerHTML = '<div class="msg hata">' + esc(e.message) + '</div>'; });
}

EYLEMLER['snf-sinif'] = function (el, id) {
  S.snfSinif = id;
  Array.prototype.forEach.call(document.querySelectorAll('.snf-kart'), function (k) { k.classList.toggle('secili', k.getAttribute('data-id') === id); });
  var kap = $('snfOgrenciler');
  if (kap) kap.innerHTML = '<div class="hint">Yükleniyor...</div>';
  return snfOgrencileriCiz();
};

EYLEMLER['snf-ogrenci'] = function (el, id) {
  return api('/teacher/ogrenci?id=' + encodeURIComponent(id)).then(function (d) {
    var o = d.ogrenci;
    var h = '<div class="snf-kisi">' + avatar(o.fullName, o.id) + '<div><div class="ad">' + esc(o.fullName) + '</div>' +
      '<div class="alt">' + esc(o.sinif) + (o.okulNo ? ' · No ' + esc(o.okulNo) : '') + '</div></div></div>';

    /* Verdiğim ödevler ve sonuçları */
    var sayim = {};
    d.odevler.forEach(function (a) { if (a.result) sayim[a.result] = (sayim[a.result] || 0) + 1; });
    h += '<h3 class="sb">Verdiğim ödevler (' + d.odevler.length + ')</h3>';
    if (d.odevler.length) {
      h += '<div class="snf-ozet">' + Object.keys(SONUC).filter(function (k) { return sayim[k]; }).map(function (k) {
        return '<span class="etiket ' + SONUC[k].renk + '">' + SONUC[k].ad + ': ' + sayim[k] + '</span>';
      }).join(' ') + '</div><div class="snf-tablo">';
      for (var i = 0; i < d.odevler.length; i++) {
        var a = d.odevler[i];
        var sag = a.result && SONUC[a.result] ? '<span class="etiket ' + SONUC[a.result].renk + '">' + SONUC[a.result].ad + '</span>'
          : a.status === 'finished' ? '<span class="etiket gri">Değerlendirilmedi</span>' : kalanEtiketi(a);
        h += '<div class="satir"><div class="buyu"><div class="ad">' + esc(a.title) + '</div>' +
          '<div class="alt">' + esc(a.subject) + (a.endAt ? ' · son teslim ' + tarihGunSaat(a.endAt, a.endTime) : '') +
          (a.status === 'active' ? (a.acildi ? ' · açtı' : ' · <span class="soluk">açmadı</span>') : '') + '</div></div>' + sag + '</div>';
      }
      h += '</div>';
    } else h += '<div class="hint">Bu öğrenciye henüz ödev vermedin.</div>';

    /* Sınav sonuçları */
    h += '<h3 class="sb">Sınav sonuçları</h3>';
    if (!d.sinavGruplari.length && !d.sinavlar.length) h += '<div class="hint">Girilmiş sınav sonucu yok.</div>';
    for (var g = 0; g < d.sinavGruplari.length; g++) {
      var gr = d.sinavGruplari[g];
      h += '<div class="snf-sinav"><div class="ad">' + esc(gr.name) + ' <span class="soluk">(' + esc(gr.subject) + ')</span></div>' +
        '<div class="alt">' + gr.sinavlar.map(function (e) {
          return esc(e.name) + ': ' + (e.grade === null ? '—' : esc(String(e.grade).replace('.', ',')));
        }).join(' · ') + '</div>' +
        '<div class="snf-ort">Ortalama (100 üzerinden): <b>' + (gr.ortalama === null ? '—' : esc(String(gr.ortalama).replace('.', ','))) + '</b></div></div>';
    }
    for (var s = 0; s < d.sinavlar.length; s++) {
      var sv = d.sinavlar[s];
      h += '<div class="snf-sinav"><div class="ad">' + esc(sv.name) + ' <span class="soluk">(' + esc(sv.subject || '') +
        (sv.templateName ? ' · ' + esc(sv.templateName) : '') + ')</span></div>' +
        '<div class="alt">' + tarihGun(sv.tarih) + ' · ' + sv.olcumler.map(function (m) {
          return esc(m.ad) + ': <b>' + esc(String(m.deger).replace('.', ',')) + '</b>';
        }).join(' · ') + '</div></div>';
    }
    modalAc(o.fullName, h);
  })['catch'](hataGoster);
};
