/* Öğretmenin sınav ekranı: sınavlar, gruplar, şablonlar ve değer girişi.

   Üç sekme:
     Sınavlarım  bütün sınavlar (grupta olsun olmasın), en yeni üstte
     Gruplar     etki oranlı sınav grupları ve ağırlıklı ortalamalar
     Şablonlar   okulun hazır değer listeleri ("Yazılı (0-100)", "LGS Denemesi")
   Bir sınav açılınca öğrenciler satır, değer alanları (Puan, Doğru, Net...)
   sütun olur. Değerler ondalıklı ve virgüllü yazılabilir: 490,161 */

/* ---- ÖĞRETMEN: sınavlar ---- */
SAYFALAR['ogr-sinavlar'] = function () {
  var sekme = S.sinavSekme || 'sinavlar';
  var istek = sekme === 'gruplar' ? api('/examgroups')
    : sekme === 'sablonlar' ? api('/exams/sablonlar') : api('/exams');
  return istek.then(function (d) {
    var h = hero('SINAVLAR', 'Sınav aç, değerleri gir. Şablon seçersen alanları her sınavda yeniden yazmazsın.');
    h += '<div class="sekme-satir" style="margin-bottom:14px">' +
      sinavSekmeDugmesi('sinavlar', 'Sınavlarım', sekme) +
      sinavSekmeDugmesi('gruplar', 'Gruplar', sekme) +
      sinavSekmeDugmesi('sablonlar', 'Şablonlar', sekme) + '</div>';
    if (sekme === 'gruplar') h += grupListesi(d.groups);
    else if (sekme === 'sablonlar') { S.sablonlar = d.sablonlar; h += sablonListesi(d); }
    else h += sinavListesi(d.exams);
    yaz(h);
  });
};

function sinavSekmeDugmesi(k, ad, secili) {
  return '<button class="sekme' + (k === secili ? ' secili' : '') + '" data-act="sinav-sekme" data-val="' + k + '">' + ad + '</button>';
}

EYLEMLER['sinav-sekme'] = function (el) {
  S.sinavSekme = el.getAttribute('data-val');
  return SAYFALAR['ogr-sinavlar']()['catch'](hataGoster);
};

/* ---------- Sınavlarım ---------- */
function sinavListesi(sinavlar) {
  /* Rolde sınav açma kapalıysa düğme yok (sunucu da 403 verir). */
  var h = yetkim('sinav.olustur') ? '<button class="btn" data-act="sinav-yeni">Yeni sınav</button>' : '';
  h += '<h3 class="sb">Sınavlar (' + sinavlar.length + ')</h3>';
  if (!sinavlar.length) return h + bosKutu('sinav', 'Henüz sınav yok. "Yeni sınav" ile başla.');
  h += '<div class="kart">';
  for (var i = 0; i < sinavlar.length; i++) {
    var e = sinavlar[i];
    h += '<div class="satir" data-ara="' + esc(e.name + ' ' + e.templateName + ' ' + e.groupName) + '">' +
      '<div class="buyu"><div class="ad">' + esc(e.name) + '</div>' +
      '<div class="alt">' + tarih(e.tarih) + ' · ' + esc(e.subject) +
      (e.templateName ? ' · ' + esc(e.templateName) : ' · ' + e.olcumSayisi + ' değer alanı') +
      ' · ' + e.graded + ' öğrencinin değeri girildi</div></div>' +
      (e.groupName ? '<span class="etiket mavi">' + esc(e.groupName) + '</span>' : '<span class="etiket gri">Grupsuz</span>') +
      '<button class="btn kucuk" data-act="sinav-ac" data-id="' + esc(e.id) + '">Değer gir</button>' +
      '<button class="btn kucuk tehlike" data-act="sinav-sil" data-id="' + esc(e.id) + '">Sil</button>' +
      '</div>';
  }
  return h + '</div>';
}

/* ---------- Gruplar ---------- */
function grupListesi(gruplar) {
  var h = (yetkim('sinav.olustur') ? '<button class="btn" data-act="grup-yeni">Yeni sınav grubu</button>' : '') +
    '<div class="hint" style="margin-top:8px">Grup isteğe bağlı: dönem ortalaması gibi etki oranlı hesap için kullan.</div>';
  h += '<h3 class="sb">Sınav grupları (' + gruplar.length + ')</h3>';
  if (!gruplar.length) return h + bosKutu('sinav', 'Henüz sınav grubu yok.');
  h += '<div class="grid k2">';
  for (var i = 0; i < gruplar.length; i++) {
    var g = gruplar[i];
    h += '<div class="kart tikla" data-act="grup-ac" data-id="' + esc(g.id) + '" data-ara="' + esc(g.name) + '">' +
      '<h3>' + esc(g.name) + '</h3>' +
      '<div class="alt" style="color:var(--soluk);font-size:13px">' + esc(g.subject) + '</div>' +
      '<div style="margin-top:9px">' +
      '<span class="etiket">' + g.examCount + ' sınav</span> ' +
      '<span class="etiket ' + (g.weightTotal === 100 ? 'yesil' : 'turuncu') + '">Toplam etki %' + sayiTR(g.weightTotal) + '</span>' +
      '</div></div>';
  }
  return h + '</div>';
}

function grupAc(id) {
  return api('/examgroups/' + id).then(function (d) {
    var g = d.group;
    var h = hero(g.name.toLocaleUpperCase('tr'), g.subject + ' · sınav grubu');
    h += (yetkim('sinav.olustur') ? '<button class="btn" data-act="sinav-yeni" data-id="' + esc(g.id) + '">Sınav ekle</button> ' : '') +
      '<button class="btn gri" data-act="sinav-sekme" data-val="gruplar">Geri</button>' +
      '<button class="btn tehlike" style="float:right" data-act="grup-sil" data-id="' + esc(g.id) + '">Grubu sil</button>';

    h += '<h3 class="sb">Sınavlar</h3>';
    if (!d.exams.length) h += bosKutu('kutu', 'Bu grupta henüz sınav yok.');
    else {
      h += '<div class="kart">';
      for (var i = 0; i < d.exams.length; i++) {
        var e = d.exams[i];
        h += '<div class="satir" data-ara="' + esc(e.name) + '">' +
          '<div class="buyu"><div class="ad">' + esc(e.name) + '</div>' +
          '<div class="alt">' + tarih(e.tarih) + (e.templateName ? ' · ' + esc(e.templateName) : '') +
          ' · ' + e.graded + ' öğrencinin değeri girildi</div></div>' +
          '<span class="etiket">Etki %' + sayiTR(e.weight) + '</span>' +
          '<button class="btn kucuk" data-act="sinav-ac" data-id="' + esc(e.id) + '">Değer gir</button>' +
          '<button class="btn kucuk tehlike" data-act="sinav-sil" data-id="' + esc(e.id) + '" data-gid="' + esc(g.id) + '">Sil</button>' +
          '</div>';
      }
      h += '</div>';
    }

    h += '<h3 class="sb">Grup ortalamaları (100 üzerinden, ağırlıklı)</h3>';
    if (!d.averages.length) h += bosKutu('kutu', 'Ders verdiğin sınıflarda öğrenci yok.');
    else {
      h += '<div class="kart">';
      for (var j = 0; j < d.averages.length; j++) {
        var a = d.averages[j];
        h += '<div class="satir" data-ara="' + esc(a.fullName) + '">' +
          '<div class="buyu"><div class="ad">' + esc(a.fullName) + '</div>' +
          '<div class="cubuk"><i style="width:' + (a.average === null ? 0 : Math.max(0, Math.min(100, a.average))) + '%"></i></div></div>' +
          '<span class="etiket ' + (a.average === null ? 'gri' : a.average >= 50 ? 'yesil' : 'kirmizi') + '">' +
          (a.average === null ? 'Değer yok' : sayiTR(a.average, 2)) + '</span></div>';
      }
      h += '</div>';
    }
    yaz(h);
  });
}

EYLEMLER['grup-ac'] = function (el, id) { return grupAc(id)['catch'](hataGoster); };

EYLEMLER['grup-yeni'] = function () {
  var ds = '';
  if (S.user.role === 'principal') {
    ds = '<div class="field"><label for="mDers">Ders</label><select id="mDers">';
    for (var j = 0; j < S.meta.subjects.length; j++) {
      ds += '<option value="' + esc(S.meta.subjects[j]) + '">' + esc(S.meta.subjects[j]) + '</option>';
    }
    ds += '</select></div>';
  }
  return modalAc('Yeni sınav grubu', ds +
    '<div class="field"><label for="mAd">Grup adı</label><input type="text" id="mAd" placeholder="Dönem 1 - Yarıyıl 1"></div><div id="mHata"></div>',
    '<button class="btn gri" data-act="modal-kapat">Vazgeç</button>' +
    '<button class="btn" data-act="grup-kaydet">Oluştur</button>');
};

EYLEMLER['grup-kaydet'] = function () {
  var gb = { name: $('mAd').value };
  if ($('mDers')) gb.subject = $('mDers').value;
  return api('/examgroups', 'POST', gb).then(function () {
    modalKapat();
    S.sinavSekme = 'gruplar';
    git('ogr-sinavlar');
  })['catch'](function (e) { mesajGoster('mHata', 'hata', e.message); });
};

EYLEMLER['grup-sil'] = function (el, id) {
  if (!confirm('Sınav grubu ve içindeki tüm sınavlar silinsin mi?')) return;
  return api('/examgroups/' + id + '/delete', 'POST').then(function () {
    S.sinavSekme = 'gruplar';
    git('ogr-sinavlar');
  })['catch'](hataGoster);
};

/* ---------- Şablonlar ---------- */
function olcumCipleri(olcumler) {
  var h = '<div class="olcum-cipleri">';
  for (var i = 0; i < olcumler.length; i++) {
    var o = olcumler[i];
    h += '<span class="olcum-cip' + (o.ana ? ' ana' : '') + '" title="' + (o.ana ? 'Ana değer: ortalamaya ve grafiğe girer' : '') + '">' +
      '<b>' + esc(o.ad) + '</b> ' + sayiTR(o.alt) + ' – ' + sayiTR(o.ust) + '</span>';
  }
  return h + '</div>';
}

function sablonListesi(d) {
  var h = '<button class="btn" data-act="sablon-yeni">Yeni şablon</button>' +
    '<div class="hint" style="margin-top:8px">Şablon, bir sınavın değer alanlarıdır (Puan, Doğru, Yanlış, Net...). ' +
    'Okuldaki bütün öğretmenler kullanabilir; yalnızca açan kişi ve müdür değiştirir.</div>';

  if (d.hazir.length) {
    h += '<h3 class="sb">Hazır şablonlar</h3><div class="grid k2">';
    for (var i = 0; i < d.hazir.length; i++) {
      var hz = d.hazir[i];
      h += '<div class="kart sablon-kart hazir-sablon"><h3>' + esc(hz.name) + '</h3>' + olcumCipleri(hz.olcumler) +
        '<button class="btn kucuk" data-act="sablon-hazir" data-val="' + esc(hz.anahtar) + '">Okula ekle</button></div>';
    }
    h += '</div>';
  }

  h += '<h3 class="sb">Okulun şablonları (' + d.sablonlar.length + ')</h3>';
  if (!d.sablonlar.length) return h + bosKutu('sinav', 'Henüz şablon yok. Hazırlardan birini ekle ya da yenisini aç.');
  h += '<div class="grid k2">';
  for (var j = 0; j < d.sablonlar.length; j++) {
    var s = d.sablonlar[j];
    h += '<div class="kart sablon-kart" data-ara="' + esc(s.name) + '"><h3>' + esc(s.name) + '</h3>' + olcumCipleri(s.olcumler) +
      (s.duzenleyebilir
        ? '<button class="btn kucuk gri" data-act="sablon-duzenle" data-id="' + esc(s.id) + '">Düzenle</button> ' +
          '<button class="btn kucuk tehlike" data-act="sablon-sil" data-id="' + esc(s.id) + '">Sil</button>'
        : '<span class="hint">Açan öğretmen ya da müdür değiştirebilir.</span>') +
      '</div>';
  }
  return h + '</div>';
}

