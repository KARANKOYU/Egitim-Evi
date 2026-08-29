/* Sınıf ve ders yönetimi (müdür). */

/* ================= SINIFLAR (müdür) ================= */

SAYFALAR.siniflar = function () {
  return api('/school/classes').then(function (d) {
    S.sinifBilgi = d;
    var h = hero('SINIFLAR', 'Sınıfları burada açar, öğrencileri yerleştirir ve derslerini tanımlarsın.');

    h += '<div class="kart"><h3>Yeni sınıf</h3>' +
      '<div style="display:flex;gap:9px;flex-wrap:wrap">' +
      '<input type="text" id="yeniSinif" placeholder="ör. 7-A" maxlength="30" ' +
      'autocomplete="off" style="flex:1;min-width:150px;padding:11px 12px;' +
      'border:1.5px solid var(--cizgi);border-radius:10px">' +
      '<button class="btn" data-act="sinif-ekle">Sınıf aç</button></div>' +
      '<div id="sinifMesaj" style="margin-top:9px"></div></div>';

    if (d.sinifsiz > 0) {
      h += '<div class="msg bilgi">' + ik('uyari') + '<b>' + d.sinifsiz + '</b> öğrenci henüz bir sınıfa yerleştirilmedi. ' +
        '<a href="#" data-act="sinif-yerlestir">Şimdi yerleştir</a></div>';
    }

    if (!d.classes.length) {
      h += bosKutu('sinif', 'Henüz sınıf yok. Yukarıdan ilk sınıfını aç.');
      yaz(h);
      return;
    }

    h += '<div class="kart"><h3>Sınıf listesi (' + d.classes.length + ')</h3>';
    for (var i = 0; i < d.classes.length; i++) {
      var c = d.classes[i];
      h += '<div class="satir" data-ara="' + esc(c.name) + '">' +
        '<div class="buyu"><div class="ad">' + esc(c.name) + '</div>' +
        '<div class="alt">' + c.studentCount + ' öğrenci · ' + c.lessonCount + ' ders' +
        (c.unassigned ? ' · <span style="color:var(--kirmizi)">' + c.unassigned +
          ' derste öğretmen yok</span>' : '') + '</div></div>' +
        '<button class="btn kucuk ghost" data-act="sinif-dersler" data-id="' + esc(c.id) + '" ' +
        'data-ad="' + esc(c.name) + '">Dersler</button>' +
        '<button class="btn kucuk ghost" data-act="sinif-program" data-id="' + esc(c.id) + '">Ders programı</button>' +
        '<button class="btn kucuk gri" data-act="sinif-ogrenciler" data-id="' + esc(c.id) + '" ' +
        'data-ad="' + esc(c.name) + '">Öğrenciler</button>' +
        '<button class="btn kucuk tehlike" data-act="sinif-sil" data-id="' + esc(c.id) + '" ' +
        'data-ad="' + esc(c.name) + '">Sil</button>' +
        '</div>';
    }
    h += '</div>';
    yaz(h);
  });
};

