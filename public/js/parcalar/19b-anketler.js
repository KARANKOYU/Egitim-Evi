/* Anketler: okulun açtığı tek soruluk anketler.
   Oy, sonuç ve kimin oy verebileceği sunucuda denetlenir; burada yalnızca
   gösterilir. */

SAYFALAR.anketler = function () {
  return api('/anketler').then(function (d) {
    var h = hero('ANKETLER', 'Okulun sana sorduğu sorular. Anket bitene kadar oyunu değiştirebilirsin.');

    if (d.olusturabilir) {
      h += '<div class="kart"><div class="satir" style="border:0;padding:0"><div class="buyu">' +
        '<div class="ad">Okula, rol grubuna ya da sınıflara soru sor</div>' +
        '<div class="alt">Öğrencilere açılan anket velilerine de gider.</div></div>' +
        '<button class="btn" data-act="anket-yeni">Yeni anket</button></div></div>';
    }

    if (!d.gelen.length && !d.yonetilen.length) {
      yaz(h + bosKutu('anket', 'Şu an sana açılmış bir anket yok.'));
      return;
    }

    for (var i = 0; i < d.gelen.length; i++) h += anketKarti(d.gelen[i]);

    if (d.yonetilen.length) {
      h += '<h3 class="sb">' + (S.user.role === 'principal' ? 'Okulun anketleri' : 'Açtığın anketler') + '</h3>' +
        '<div class="kart" style="padding:0">';
      for (var j = 0; j < d.yonetilen.length; j++) {
        var a = d.yonetilen[j];
        h += '<div class="satir"><div class="buyu"><div class="ad">' + esc(a.soru) + ' ' + anketDurumEtiketi(a) + '</div>' +
          '<div class="alt">' + esc(a.hedefOzet) + ' · ' + a.oySayisi + ' / ' + a.hedefSayisi + ' kişi oy verdi · ' +
          (a.acik ? 'bitiş ' : 'bitti ') + tarihSaat(a.kapandi || a.bitis) +
          (S.user.role === 'principal' ? ' · ' + esc(a.olusturan) : '') + '</div></div>' +
          '<button class="btn kucuk ghost" data-act="anket-sonuc" data-id="' + esc(a.id) + '">Sonuç</button>' +
          (a.acik ? '<button class="btn kucuk gri" data-act="anket-kapat" data-id="' + esc(a.id) + '">Bitir</button>' : '') +
          '<button class="btn kucuk gri" data-act="anket-sil" data-id="' + esc(a.id) + '">Sil</button></div>';
      }
      h += '</div>';
    }
    yaz(h);
  });
};

function anketDurumEtiketi(a) {
  return a.acik ? '<span class="etiket yesil">Açık</span>' : '<span class="etiket gri">Bitti</span>';
}

/* Bana gelen anket: açıksa seçenekler düğme, bittiyse sonuç çubukları. */
function anketKarti(a) {
  var h = '<div class="kart anket-kart"><div class="anket-ust"><div class="buyu">' +
    '<div class="anket-soru">' + esc(a.soru) + '</div>' +
    '<div class="alt">' + esc(a.olusturan) + ' · ' + (a.acik ? 'bitiş ' + tarihSaat(a.bitis) : 'bitti ' + tarihSaat(a.kapandi || a.bitis)) +
    (a.gizli ? ' · kimin neyi seçtiği görünmez' : '') + '</div></div>' + anketDurumEtiketi(a) + '</div>';
  if (a.aciklama) h += '<div class="anket-aciklama">' + esc(a.aciklama).replace(/\n/g, '<br>') + '</div>';

  if (a.acik) {
    h += '<div class="anket-secenekler">';
    for (var i = 0; i < a.secenekler.length; i++) {
      var s = a.secenekler[i], secili = a.benimOyum === s.id;
      h += '<button class="anket-secenek' + (secili ? ' secili' : '') + '" data-act="anket-oy" data-id="' + esc(a.id) + '" ' +
        'data-secenek="' + esc(s.id) + '" aria-pressed="' + (secili ? 'true' : 'false') + '">' +
        '<span class="anket-isaret">' + (secili ? ik('onay') : '') + '</span>' + esc(s.metin) + '</button>';
    }
    h += '</div><div class="anket-alt">' +
      (a.benimOyum
        ? 'Oyun kaydedildi. Bitişe kadar değiştirebilirsin. <button class="baglanti" data-act="anket-oy" data-id="' +
          esc(a.id) + '" data-secenek="">Oyumu geri al</button>'
        : 'Henüz oy vermedin.') +
      ' Sonuç anket bitince görünür.</div>';
  } else {
    h += anketCubuklari(a.secenekler, a.sayimlar || {}, a.benimOyum);
    if (!a.benimOyum) h += '<div class="anket-alt">Bu ankete oy vermedin.</div>';
  }
  return h + '</div>';
}

function anketCubuklari(secenekler, sayim, benim) {
  var toplam = 0;
  for (var i = 0; i < secenekler.length; i++) toplam += sayim[secenekler[i].id] || 0;
  var h = '<div class="anket-sonuclar">';
  for (var j = 0; j < secenekler.length; j++) {
    var s = secenekler[j], n = sayim[s.id] || 0, yuzde = toplam ? Math.round(100 * n / toplam) : 0;
    h += '<div class="anket-sonuc' + (benim === s.id ? ' benim' : '') + '">' +
      '<div class="anket-sonuc-ust"><span>' + esc(s.metin) + (benim === s.id ? ' <span class="alt">(senin seçimin)</span>' : '') + '</span>' +
      '<b>' + n + ' · %' + yuzde + '</b></div>' +
      '<div class="cubuk"><i style="width:' + yuzde + '%"></i></div></div>';
  }
  return h + '<div class="alt">' + toplam + ' oy</div></div>';
}

EYLEMLER['anket-oy'] = function (el, id) {
  var kart = el.closest('.anket-kart');
  var dugmeler = kart ? kart.querySelectorAll('[data-act="anket-oy"]') : [];
  for (var i = 0; i < dugmeler.length; i++) dugmeler[i].disabled = true;
  return api('/anketler/oy', 'POST', { id: id, secenekId: el.getAttribute('data-secenek') })
    .then(function () { return SAYFALAR.anketler(); })
    ['catch'](function (e) {
      for (var i = 0; i < dugmeler.length; i++) dugmeler[i].disabled = false;
      hataGoster(e);
    });
};

EYLEMLER['anket-kapat'] = function (el, id) {
  if (!confirm('Anket şimdi bitirilsin mi? Artık oy verilemez; sonuç oy verenlere de açılır.')) return;
  el.disabled = true;
  return api('/anketler/kapat', 'POST', { id: id }).then(function () { git('anketler'); })
    ['catch'](function (e) { el.disabled = false; hataGoster(e); });
};

EYLEMLER['anket-sil'] = function (el, id) {
  if (!confirm('Anket ve bütün oylar silinsin mi? Bu geri alınamaz.')) return;
  el.disabled = true;
  return api('/anketler/sil', 'POST', { id: id }).then(function () { modalKapat(); git('anketler'); })
    ['catch'](function (e) { el.disabled = false; hataGoster(e); });
};

/* ---- sonuç penceresi (anketi açan ve müdür) ---- */
var anketKatilim = { veri: [], secenekler: {}, filtre: 'hepsi', ara: '' };

EYLEMLER['anket-sonuc'] = function (el, id) {
  return api('/anketler/sonuc?id=' + encodeURIComponent(id)).then(function (d) {
    var a = d.anket;
    var ad = {};
    for (var i = 0; i < a.secenekler.length; i++) ad[a.secenekler[i].id] = a.secenekler[i].metin;
    anketKatilim = { veri: d.katilim || [], secenekler: ad, filtre: 'hepsi', ara: '' };
    var verdi = anketKatilim.veri.filter(function (k) { return k.oyVerdi; }).length;

    var h = '<div class="alt" style="margin-bottom:10px">' + esc(a.hedefOzet) + ' · ' +
      (a.acik ? 'bitiş ' + tarihSaat(a.bitis) : 'bitti ' + tarihSaat(a.kapandi || a.bitis)) + '</div>' +
      (d.sayimlar ? anketCubuklari(a.secenekler, d.sayimlar, '')
        : '<div class="msg bilgi">Gizli ankette sayılar anket bitince görünür.</div>') +
      '<div class="okuma-ozet" style="margin-top:14px"><b>' + verdi + ' / ' + anketKatilim.veri.length + '</b> kişi oy verdi' +
      '<div class="cubuk"><i style="width:' + (anketKatilim.veri.length ? Math.round(100 * verdi / anketKatilim.veri.length) : 0) + '%"></i></div></div>' +
      (a.gizli ? '<div class="hint" style="margin-bottom:8px">Gizli anket: kimin neyi seçtiği gösterilmez.</div>' : '') +
      '<div class="okuma-arac"><div class="sekme-satir">' +
      anketSekme('hepsi', 'Hepsi') + anketSekme('verdi', 'Oy verenler') + anketSekme('vermedi', 'Vermeyenler') +
      '</div><input type="text" id="anketAra" class="ara-kutu" placeholder="İsim ara" autocomplete="off"></div>' +
      '<div class="okuma-liste" id="anketListe"></div>';

    modalAc(a.soru, h,
      '<button class="btn tehlike" data-act="anket-sil" data-id="' + esc(a.id) + '">Sil</button>' +
      '<button class="btn gri" data-act="modal-kapat">Kapat</button>');
    $('anketAra').oninput = function () { anketKatilim.ara = this.value; anketListeCiz(); };
    anketListeCiz();
  })['catch'](hataGoster);
};

function anketListeCiz() {
  var q = nrm(anketKatilim.ara);
  var liste = anketKatilim.veri.filter(function (k) {
    if (anketKatilim.filtre === 'verdi' && !k.oyVerdi) return false;
    if (anketKatilim.filtre === 'vermedi' && k.oyVerdi) return false;
    return !q || nrm(k.ad + ' ' + k.sinif + ' ' + k.cocuklar.join(' ')).indexOf(q) >= 0;
  });
  liste.sort(function (a, b) { return (a.oyVerdi ? 1 : 0) - (b.oyVerdi ? 1 : 0) || a.ad.localeCompare(b.ad, 'tr'); });
  var h = liste.length ? '' : '<div class="hint" style="padding:8px 0">Bu seçimde kimse yok.</div>';
  for (var i = 0; i < liste.length; i++) {
    var k = liste[i];
    var ek = k.cocuklar.length ? esc(k.cocuklar.join(', ')) + ' velisi' : (k.sinif ? esc(k.sinif) : (ROL_AD[k.rol] || ''));
    var sag = !k.oyVerdi ? '<span class="okumadi">oy vermedi</span>'
      : '<span class="okudu">' + (k.secim ? esc(anketKatilim.secenekler[k.secim] || '') + (k.tarih ? ' · ' : '') : '') +
        (k.tarih ? tarihSaat(k.tarih) : (k.secim ? '' : 'oy verdi')) + '</span>';
    h += '<div class="alici-satir"><div class="buyu">' + esc(k.ad) + ' <span class="alt">' + ek + '</span></div>' + sag + '</div>';
  }
  $('anketListe').innerHTML = h;
}

/* ---- yeni anket ---- */
EYLEMLER['anket-yeni'] = function () {
  return api('/mesajlar/hedefler').then(function (d) {
    var yarin = new Date(Date.now() + 7 * 86400000);
    var p = function (n) { return n < 10 ? '0' + n : '' + n; };
    var gun = yarin.getFullYear() + '-' + p(yarin.getMonth() + 1) + '-' + p(yarin.getDate());

    var siniflar = '';
    for (var i = 0; i < d.siniflar.length; i++) {
      siniflar += '<label class="onay"><input type="checkbox" class="aSinif" value="' + esc(d.siniflar[i].id) + '"><span>' +
        esc(d.siniflar[i].ad) + ' <span class="alt">(' + d.siniflar[i].sayi + ' öğrenci)</span></span></label>';
    }

    var h = '<div class="field"><label for="aSoru">Soru</label>' +
      '<input type="text" id="aSoru" maxlength="200" placeholder="ör. Okul gezisi için hangi gün uygun?"></div>' +
      '<div class="field"><label for="aAciklama">Açıklama (isteğe bağlı)</label>' +
      '<textarea id="aAciklama" rows="2" maxlength="1000"></textarea></div>' +
      '<div class="field"><label>Seçenekler</label><div id="aSecenekler">' + anketSecenekKutusu(1) + anketSecenekKutusu(2) + '</div>' +
      '<button class="btn kucuk ghost" data-act="anket-secenek-ekle" style="margin-top:6px">' + ik('ekle') + 'Seçenek ekle</button></div>' +
      '<div class="field"><label for="aHedefTur">Kime</label><select id="aHedefTur">' +
      (d.okulIzin ? '<option value="okul">Tüm okula</option>' : '') +
      '<option value="rol">Rol grubuna</option><option value="sinif">Sınıflara</option></select></div>' +
      '<div id="aHedefRol" class="secim-kutu"' + (d.okulIzin ? ' style="display:none"' : '') + '>' +
      '<label class="onay"><input type="checkbox" class="aRol" value="student"><span>Öğrenciler (ve velileri)</span></label>' +
      '<label class="onay"><input type="checkbox" class="aRol" value="parent"><span>Veliler</span></label>' +
      '<label class="onay"><input type="checkbox" class="aRol" value="teacher"><span>Öğretmenler</span></label></div>' +
      '<div id="aHedefSinif" class="secim-kutu" style="display:none">' + (siniflar || '<div class="hint">Sınıf yok.</div>') + '</div>' +
      '<div class="row2"><div class="field"><label for="aBitis">Bitiş günü</label><input type="date" id="aBitis" value="' + gun + '"></div>' +
      '<div class="field"><label for="aBitisSaat">Bitiş saati</label><input type="time" id="aBitisSaat" value="23:59"></div></div>' +
      '<label class="onay" style="margin-bottom:10px"><input type="checkbox" id="aGizli">' +
      '<span>Gizli anket (kimin neyi seçtiğini ben de görmeyeyim)</span></label>' +
      '<div id="aMesaj"></div>';

    modalAc('Yeni anket', h,
      '<button class="btn gri" data-act="modal-kapat">Vazgeç</button>' +
      '<button class="btn" data-act="anket-ac">Anketi aç</button>');

    $('aHedefTur').onchange = function () {
      $('aHedefRol').style.display = this.value === 'rol' ? '' : 'none';
      $('aHedefSinif').style.display = this.value === 'sinif' ? '' : 'none';
    };
    $('aSoru').focus();
  })['catch'](hataGoster);
};

function anketSecenekKutusu(n) {
  return '<input type="text" class="aSecenek" maxlength="120" placeholder="' + n + '. seçenek" style="margin-bottom:6px">';
}

