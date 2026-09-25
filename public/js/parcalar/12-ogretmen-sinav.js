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

