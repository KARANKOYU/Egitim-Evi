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

/* Sınıfın derslerini yöneten pencere */
function sinifDersleriModal(classId, ad) {
  return api('/school/lessons?classId=' + encodeURIComponent(classId)).then(function (d) {
    S.dersBilgi = d;
    var h = '';

    var kullanilan = d.lessons.map(function (l) { return l.subject; });
    var eklenebilir = d.subjects.filter(function (x) { return kullanilan.indexOf(x) < 0; });

    if (eklenebilir.length) {
      h += '<div style="display:flex;gap:8px;flex-wrap:wrap;align-items:flex-end;margin-bottom:14px">' +
        '<div class="field" style="flex:1;min-width:150px;margin:0"><label>Ders ekle</label>' +
        '<select id="yeniDers">';
      for (var i = 0; i < eklenebilir.length; i++) {
        h += '<option value="' + esc(eklenebilir[i]) + '">' + esc(eklenebilir[i]) + '</option>';
      }
      h += '</select></div>' +
        '<div class="field" style="flex:0 0 110px;margin:0"><label>Haftalık saat</label>' +
        '<input type="number" id="yeniDersSaat" min="0" max="20" value="4"></div>' +
        '<button class="btn" data-act="ders-ekle" data-id="' + esc(classId) + '">Ekle</button></div>';
    } else {
      h += '<div class="msg bilgi">Tüm dersler eklenmiş.</div>';
    }

    if (!d.lessons.length) {
      h += bosKutu('ders', 'Bu sınıfa henüz ders eklenmedi.');
    } else {
      for (var j = 0; j < d.lessons.length; j++) {
        var l = d.lessons[j];
        h += '<div class="satir">' +
          '<div class="buyu"><div class="ad">' + esc(l.subject) + '</div>' +
          '<div class="alt">Haftada ' + l.weeklyHours + ' saat · programa ' + l.placed + ' saat yerleşti' +
          (l.placed > l.weeklyHours && l.weeklyHours ? ' <span style="color:var(--kirmizi)">(fazla)</span>' :
            (l.placed < l.weeklyHours ? ' <span style="color:var(--soluk)">(' +
              (l.weeklyHours - l.placed) + ' saat eksik)</span>' : '')) +
          '</div></div>' +
          '<select class="ders-ogretmen" data-id="' + esc(l.id) + '" ' +
          'style="padding:7px 9px;border:1.5px solid var(--cizgi);border-radius:8px;max-width:190px">' +
          '<option value="">— öğretmen seç —</option>';
        for (var k = 0; k < d.teachers.length; k++) {
          var t = d.teachers[k];
          h += '<option value="' + esc(t.id) + '"' + (l.teacherId === t.id ? ' selected' : '') + '>' +
            esc(t.fullName) + (t.branch ? ' (' + esc(t.branch) + ')' : '') + '</option>';
        }
        h += '</select>' +
          '<button class="btn kucuk tehlike" data-act="ders-sil" data-id="' + esc(l.id) + '" ' +
          'data-cid="' + esc(classId) + '">Sil</button>' +
          '</div>';
      }
    }

    modalAc(ad + ' — Dersler', h);
    dersOgretmenBagla(classId);
  });
}

function dersOgretmenBagla(classId) {
  var kutular = document.querySelectorAll('.ders-ogretmen');
  for (var i = 0; i < kutular.length; i++) {
    (function (sel) {
      sel.onchange = function () {
        api('/school/lesson-update', 'POST', {
          lessonId: sel.getAttribute('data-id'),
          teacherId: sel.value
        }).then(function () {
          sinifDersleriModal(classId, (S.dersBilgi.class || {}).name || '')['catch'](hataGoster);
        })['catch'](hataGoster);
      };
    })(kutular[i]);
  }
}

