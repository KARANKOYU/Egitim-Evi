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

