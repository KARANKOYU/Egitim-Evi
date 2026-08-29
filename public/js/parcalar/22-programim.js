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
