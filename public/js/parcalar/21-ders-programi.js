/* Ders programı düzenleme ve çizimi: günlük/haftalık görünüm. */

/* ================= DERS PROGRAMI (müdür) =================
   Program artık sabit ders saati kutuları değil: her gün için istenen
   saat aralıklarıyla ders eklenir. Pazartesi'den Pazar'a 7 gün. */

SAYFALAR.program = function () {
  return api('/school/classes').then(function (d) {
    if (!d.classes.length) {
      yaz(hero('DERS PROGRAMI', 'Önce sınıf açman gerekiyor.') +
        bosKutu('takvim', 'Program yapabilmek için en az bir sınıf gerekli.') +
        '<div class="kart"><button class="btn" data-nav="siniflar">Sınıflar sayfasına git</button></div>');
      return;
    }
    if (!S.programSinif || !d.classes.some(function (c) { return c.id === S.programSinif; })) {
      S.programSinif = d.classes[0].id;
    }
    S.programSiniflar = d.classes;
    S.gunAdlari = d.gunAdlari;
    S.gunSayisi = d.gunSayisi;
    return programCiz();
  });
};

function programCiz() {
  return api('/school/schedule?classId=' + encodeURIComponent(S.programSinif)).then(function (d) {
    S.programVeri = d;
    var h = hero('DERS PROGRAMI',
      'Gün gün ya da haftalık bak. Ders ekle ile saatini kendin belirle, çakışma olursa uyarırım.');

    h += '<div class="kart"><div class="filtre-satir">' +
      '<div class="field"><label for="pSinif">Sınıf</label><select id="pSinif">';
    for (var i = 0; i < S.programSiniflar.length; i++) {
      var c = S.programSiniflar[i];
      h += '<option value="' + esc(c.id) + '"' + (c.id === S.programSinif ? ' selected' : '') + '>' +
        esc(c.name) + '</option>';
    }
    h += '</select></div></div></div>';

    if (S.programUyari) {
      h += '<div class="msg hata">' + ik('uyari') + esc(S.programUyari) + '</div>';
      S.programUyari = '';
    }

    if (d.cakismalar.length) {
      /* Uzun liste sayfayı boğuyor: ilk beşi göster, gerisini katla. */
      var GOSTER = 5;
      var acik = S.cakismaAcik;
      var gosterilecek = acik ? d.cakismalar.length : Math.min(GOSTER, d.cakismalar.length);

      h += '<div class="msg hata"><b>' + ik('uyari') + d.cakismalar.length +
        ' çakışma var</b><ul class="cakisma-liste">';
      for (var j = 0; j < gosterilecek; j++) {
        var ck = d.cakismalar[j];
        h += '<li>' + (ck.tur === 'ogretmen' ? 'Öğretmen ' : 'Sınıf ') + esc(ck.ad) +
          ' — ' + esc(ck.dayName) + ': ' +
          esc(ck.lessons.map(function (x) {
            return x.className + ' ' + x.subject + ' (' + x.start + '-' + x.end + ')';
          }).join(' ↔ ')) + '</li>';
      }
      h += '</ul>';
      if (d.cakismalar.length > GOSTER) {
        h += '<button type="button" class="baglanti" data-act="cakisma-ac">' +
          (acik ? 'Daha azını göster' : (d.cakismalar.length - GOSTER) + ' tanesini daha göster') +
          '</button>';
      }
      h += '</div>';
    }

    h += gorunumSecici();
    h += programGovdesi(d, true, function (sp) {
      return sp.teacherName || 'öğretmen atanmadı';
    });

    if (d.lessons.length) {
      h += '<div class="kart"><h3>Bu sınıfın dersleri</h3>';
      for (var k = 0; k < d.lessons.length; k++) {
        var l = d.lessons[k];
        var eksik = l.weeklyHours - l.placed;
        h += '<div class="satir"><div class="buyu"><div class="ad">' + esc(l.subject) + '</div>' +
          '<div class="alt">' + (l.teacherName ? esc(l.teacherName) :
            '<span style="color:var(--kirmizi)">öğretmen atanmadı</span>') + '</div></div>' +
          '<span class="etiket ' + (eksik === 0 ? 'yesil' : eksik > 0 ? 'turuncu' : 'kirmizi') + '">' +
          l.placed + ' / ' + l.weeklyHours + ' saat</span></div>';
      }
      h += '</div>';
    } else {
      h += '<div class="msg bilgi">Bu sınıfa ders eklenmemiş. ' +
        '<a href="#" data-nav="siniflar">Sınıflar sayfasından</a> ders ekleyebilirsin.</div>';
    }

    yaz(h);
    var sinifSec = $('pSinif');
    if (sinifSec) {
      sinifSec.onchange = function () {
        S.programSinif = this.value;
        programCiz()['catch'](hataGoster);
      };
    }
  });
}

