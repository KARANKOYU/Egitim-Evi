/* Kişinin kendi programı (öğretmen / öğrenci / veli). */

/* ================= KENDİ PROGRAMIM (öğretmen / öğrenci / veli) ================= */

SAYFALAR.programim = function () {
  var u = S.user;
  if (u.role === 'teacher' || u.role === 'principal') return ogretmenProgrami();
  return ogrenciProgrami();
};

function ogretmenProgrami() {
  return api('/teacher/schedule').then(function (d) {
    var h = hero('DERS PROGRAMIM', 'Müdürün sana atadığı dersler ve haftalık programın.');

    var cakismaVar = d.cells.some(function (c) { return c.cakisma; });
    if (cakismaVar) {
      h += '<div class="msg hata">Programında çakışma var — aynı saatte birden fazla sınıf görünüyor. ' +
        'Müdürüne bildir.</div>';
    }

    if (!d.lessons.length) {
      h += bosKutu('takvim', 'Sana henüz ders atanmadı. Müdürün sınıflara ders atadığında burada görünecek.');
      yaz(h);
      return;
    }

    h += gorunumSecici();
    /* Öğretmende alt satırda sınıf adı; bugünün derslerinde "Yoklama al". */
    var altAlan = function (sp) { return sp.className || ''; };
    altAlan.ekIslem = function (sp) {
      if (!ozellikAcik('devamsizlik') || !yetkim('devamsizlik.al') || sp.day !== bugunNo() || !sp.lessonId) return '';
      var simdi = new Date(), dk = simdi.getHours() * 60 + simdi.getMinutes();
      var bas = Number(sp.start.slice(0, 2)) * 60 + Number(sp.start.slice(3, 5)), bit = Number(sp.end.slice(0, 2)) * 60 + Number(sp.end.slice(3, 5));
      if (bas > dk + 15) return '';   /* henüz başlamamış ders için yoklama yok */
      var suan = dk >= bas && dk <= bit;
      return '<button type="button" class="btn kucuk' + (suan ? '' : ' ghost') + ' yoklama-al" data-act="program-yoklama" data-id="' + esc(sp.lessonId) +
        '" data-saat="' + esc(sp.start) + '" data-ad="' + esc((sp.className || '') + ' · ' + (sp.subject || '')) + '">' + ik('onay') +
        (suan ? 'Şu an — yoklama al' : 'Yoklama') + '</button>';
    };
    h += programGovdesi(d, false, altAlan);
    for (var i = 0; i < d.lessons.length; i++) {
      var l = d.lessons[i];
      var eksik = l.weeklyHours - l.placed;
      h += '<div class="satir" data-ara="' + esc(l.className + ' ' + l.subject) + '">' +
        '<div class="buyu"><div class="ad">' + esc(l.className) + ' · ' + esc(l.subject) + '</div>' +
        '<div class="alt">' + l.studentCount + ' öğrenci</div></div>' +
        '<span class="etiket ' + (eksik === 0 ? 'yesil' : 'turuncu') + '">' +
        l.placed + ' / ' + l.weeklyHours + ' saat</span></div>';
    }
    h += '</div>';
    yaz(h);
  });
}

/* ---- ders programından yoklama: telefonda tek elle ----
   Her öğrenci alt alta; üç büyük düğme: Geldi · Gelmedi (izinli) · Gelmedi (izinsiz).
   Kaydedince gelmeyenin velisine "Çocuğunuz ... saat ... dersine gelmedi" gider. */
var PY_DURUM = [{ k: 'var', ad: 'Geldi' }, { k: 'izinli', ad: 'Gelmedi — izinli' }, { k: 'yok', ad: 'Gelmedi — izinsiz' }];

EYLEMLER['program-yoklama'] = function (el, lessonId) {
  var saat = el.getAttribute('data-saat'), ad = el.getAttribute('data-ad');
  return api('/devamsizlik/yoklama?lessonId=' + encodeURIComponent(lessonId)).then(function (d) {
    S.py = { lessonId: lessonId, saat: saat, tarih: d.tarih, durum: {}, onceki: {} };
    var h = '<div class="py-ust"><b>' + esc(ad) + '</b> · bugün ' + esc(saat) + ' · ' + d.ogrenciler.length + ' öğrenci' +
      '<button type="button" class="btn kucuk ghost" data-act="py-hepsi">Hepsi geldi</button></div><div class="py-liste">';
    for (var i = 0; i < d.ogrenciler.length; i++) {
      var o = d.ogrenciler[i];
      /* "Geç geldi" kaydı bu pencerede "Geldi" görünür, dokunulmazsa korunur. */
      var secili = o.durum === 'gec' ? 'var' : (o.durum || 'var');
      S.py.durum[o.id] = secili; S.py.onceki[o.id] = o.durum || 'var';
      h += '<div class="py-satir"><div class="py-ad">' + avatar(o.ad, o.id) + '<span>' + esc(o.ad) + '</span></div>' +
        '<div class="py-secim" role="radiogroup" aria-label="' + esc(o.ad) + '">';
      for (var j = 0; j < PY_DURUM.length; j++) {
        var s = PY_DURUM[j];
        h += '<button type="button" class="py-dugme ' + s.k + (secili === s.k ? ' secili' : '') + '" role="radio" aria-checked="' + (secili === s.k) +
          '" data-act="py-durum" data-id="' + esc(o.id) + '" data-durum="' + s.k + '">' + s.ad + '</button>';
      }
      h += '</div></div>';
    }
    h += '</div><div id="pyMesaj"></div>';
    modalAc('Yoklama', h, '<button class="btn gri" data-act="modal-kapat">Vazgeç</button>' +
      '<button class="btn" data-act="py-kaydet">Kaydet</button>');
  })['catch'](hataGoster);
};

function pySatiriCiz(id) {
  Array.prototype.forEach.call(document.querySelectorAll('.py-dugme[data-id="' + id + '"]'), function (b) {
    var on = b.getAttribute('data-durum') === S.py.durum[id];
    b.classList.toggle('secili', on);
    b.setAttribute('aria-checked', on ? 'true' : 'false');
  });
}
EYLEMLER['py-durum'] = function (el, id) { S.py.durum[id] = el.getAttribute('data-durum'); pySatiriCiz(id); };
EYLEMLER['py-hepsi'] = function () { for (var id in S.py.durum) { S.py.durum[id] = 'var'; pySatiriCiz(id); } };
EYLEMLER['py-kaydet'] = function (el) {
  var girisler = [];
  for (var id in S.py.durum) {
    var d = S.py.durum[id];
    if (d === 'var' && S.py.onceki[id] === 'gec') d = 'gec';
    girisler.push({ ogrenciId: id, durum: d });
  }
  var gelmeyen = girisler.filter(function (g) { return g.durum === 'yok' || g.durum === 'izinli'; }).length;
  dugmeBekle(el, 'Kaydediliyor...');
  return api('/devamsizlik/yoklama', 'POST', { lessonId: S.py.lessonId, tarih: S.py.tarih, saat: S.py.saat, girisler: girisler })
    .then(function () {
      modalKapat();
      sayfaMesaji('iyi', 'Yoklama kaydedildi.' + (gelmeyen ? ' Gelmeyen ' + gelmeyen + ' öğrencinin velisine bildirim gitti.' : ' Herkes geldi.'));
    })['catch'](function (e) { dugmeBitir(el); mesajGoster('pyMesaj', 'hata', e.message); });
};

function ogrenciProgrami() {
  return api('/myschedule' + hedefOgrenci()).then(function (d) {
    var kimin = S.viewStudentId ? S.viewStudentName + ' adına görüntülüyorsun.' : '';
    var h = hero('DERS PROGRAMI', kimin);

    if (!d.className) {
      h += bosKutu('sinif', 'Henüz bir sınıfa yerleştirilmedin. Müdürün seni sınıfa eklediğinde programın burada görünecek.');
      yaz(h);
      return;
    }
    h += '<div class="msg bilgi">Sınıf: <b>' + esc(d.className) + '</b></div>';
    if (!d.cells.length) {
      h += bosKutu('takvim', 'Sınıfının ders programı henüz oluşturulmadı.');
      yaz(h);
      return;
    }
    h += gorunumSecici();
    h += programGovdesi(d, false, function (sp) {
      return sp.teacherName || '';
    });
    yaz(h);
  });
}
