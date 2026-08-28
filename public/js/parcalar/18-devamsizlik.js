/* Devamsızlık: yoklama alma, öğrenci görünümü, müdür görünümü. */

/* ================= devamsızlık ================= */

var DURUM_RENK = { var: 'var', yok: 'yok', gec: 'gec', izinli: 'izinli' };

/* --- öğretmen: yoklama --- */
SAYFALAR.yoklama = function () {
  return api('/devamsizlik/derslerim').then(function (d) {
    var h = hero('YOKLAMA', 'Ders seç, günü işaretle, kaydet.');

    if (!d.dersler.length) {
      h += bosKutu('onay', 'Yoklama alabileceğin ders yok. ' +
        'Müdürün seni bir derse ataması gerekiyor.');
      yaz(h);
      return;
    }

    h += '<div class="kart"><h3>Ders seç</h3><div class="grid k3">';
    for (var i = 0; i < d.dersler.length; i++) {
      var l = d.dersler[i];
      h += '<button class="tur-sec' + (S.yoklamaDers === l.id ? ' secili' : '') +
        '" data-act="yoklama-ders" data-id="' + esc(l.id) + '">' +
        '<div class="ad">' + esc(l.sinif) + ' · ' + esc(l.ders) + '</div>' +
        '<div class="alt">' + l.ogrenciSayisi + ' öğrenci</div></button>';
    }
    h += '</div></div><div id="yoklamaAlan"></div>';
    yaz(h);

    if (S.yoklamaDers) yoklamaCiz();
  });
};

function yoklamaCiz() {
  var alan = $('yoklamaAlan');
  if (!alan) return;
  alan.innerHTML = '<div class="kart"><div class="hint">Yükleniyor...</div></div>';

  var yol = '/devamsizlik/yoklama?lessonId=' + encodeURIComponent(S.yoklamaDers) +
    (S.yoklamaTarih ? '&tarih=' + S.yoklamaTarih : '');

  return api(yol).then(function (d) {
    S.yoklamaTarih = d.tarih;
    S.yoklamaDurum = {};
    for (var i = 0; i < d.ogrenciler.length; i++) {
      S.yoklamaDurum[d.ogrenciler[i].id] = d.ogrenciler[i].durum;
    }

    var h = '<div class="kart"><div class="satir" style="border:0;padding:0 0 14px">' +
      '<div class="buyu"><h3 style="margin:0">' + esc(d.ders.sinif) + ' · ' +
      esc(d.ders.ad) + '</h3></div>' +
      '<input type="date" id="yoklamaTarih" value="' + esc(d.tarih) + '" class="tarih-kutu">' +
      '</div>';

    h += '<div class="satir" style="padding:0 0 12px">' +
      '<div class="buyu hint">Gelmeyenleri işaretle. İşaretlemediklerin derste sayılır.</div>' +
      '<button class="btn kucuk ghost" data-act="yoklama-hepsi-var">Hepsi geldi</button>' +
      '</div>';

    for (var j = 0; j < d.ogrenciler.length; j++) {
      var o = d.ogrenciler[j];
      h += '<div class="yoklama-satir">' +
        '<div class="buyu"><div class="ad">' + esc(o.ad) + '</div></div>' +
        '<div class="durum-secim" data-ogrenci="' + esc(o.id) + '">';
      for (var k = 0; k < d.durumlar.length; k++) {
        var du = d.durumlar[k];
        h += '<button class="durum-dugme ' + du.k + (o.durum === du.k ? ' secili' : '') +
          '" data-act="yoklama-durum" data-ogrenci="' + esc(o.id) +
          '" data-durum="' + du.k + '">' + du.ad + '</button>';
      }
      h += '</div></div>';
    }

    h += '<div id="yoklamaMesaj" style="margin:14px 0"></div>' +
      '<button class="btn" data-act="yoklama-kaydet">Yoklamayı kaydet</button></div>';

    alan.innerHTML = h;
    var tar = $('yoklamaTarih');
    if (tar) tar.onchange = function () {
      S.yoklamaTarih = this.value;
      yoklamaCiz();
    };
  })['catch'](function (e) {
    alan.innerHTML = '<div class="kart"><div class="msg hata">' + esc(e.message) + '</div></div>';
  });
}

/* --- öğrenci: kendi devamsızlığı --- */
SAYFALAR.devamsizligim = function () {
  /* Veli ya da müdür bir öğrencinin portalını açtıysa onun kaydını göster. */
  var baskasi = S.viewStudentId && S.user.role !== 'student';
  var yol = baskasi
    ? '/devamsizlik/ogrenci?studentId=' + encodeURIComponent(S.viewStudentId)
    : '/devamsizlik/benim';
  return api(yol).then(function (d) {
    yaz(devamsizlikGovdesi(
      baskasi ? 'DEVAMSIZLIK' : 'DEVAMSIZLIĞIM',
      baskasi ? S.viewStudentName + ' adına görüntülüyorsun.' : 'Derslere katılım kaydın.',
      d, baskasi));
  });
};

function devamsizlikGovdesi(baslik, alt, d, adGoster) {
  var h = hero(baslik, alt);
  h += '<div class="grid k4" style="margin-bottom:18px">' +
    stat(d.sayim.yok, 'Gelmedi') +
    stat(d.sayim.gec, 'Geç geldi') +
    stat(d.sayim.izinli, 'İzinli') +
    stat(d.toplam, 'Toplam kayıt') + '</div>';

  if (!d.kayitlar.length) {
    h += bosKutu('onay', 'Hiç devamsızlık kaydın yok. Böyle devam.');
    return h;
  }

  h += '<div class="kart" style="padding:0">';
  for (var i = 0; i < d.kayitlar.length; i++) {
    var k = d.kayitlar[i];
    h += '<div class="satir">' +
      '<div class="buyu"><div class="ad">' + esc(k.ders || 'Ders') +
      ' <span class="durum-etiket ' + esc(k.durum) + '">' + esc(k.durumAd) + '</span></div>' +
      '<div class="alt">' + esc(k.tarih) +
      (k.alan ? ' · ' + esc(k.alan) : '') +
      (k.not ? ' · ' + esc(k.not) : '') + '</div></div></div>';
  }
  h += '</div>';
  return h;
}

function devamsizlikBagla(siniflar) {
  var sinifSec = $('dvSinif');
  var ogrSec = $('dvOgrenci');
  var tarihKutu = $('dvTarih');
  if (!sinifSec || !ogrSec || !tarihKutu) return;

  function ogrencileriYukle() {
    S.dvSinif = sinifSec.value;
    ogrSec.innerHTML = '<option value="">Yükleniyor...</option>';
    return api('/school/students').then(function (d) {
      var liste = (d.students || []).filter(function (x) {
        return x.classId === S.dvSinif;
      }).sort(function (a, b) { return a.fullName.localeCompare(b.fullName, 'tr'); });

      if (!liste.length) {
        ogrSec.innerHTML = '<option value="">Bu sınıfta öğrenci yok</option>';
        $('dvAlan').innerHTML = bosKutu('ogrenci', 'Bu sınıfa öğrenci yerleştirilmemiş.');
        return;
      }
      var h = '';
      for (var i = 0; i < liste.length; i++) {
        h += '<option value="' + esc(liste[i].id) + '"' +
          (S.dvOgrenci === liste[i].id ? ' selected' : '') + '>' +
          esc(liste[i].fullName) + '</option>';
      }
      ogrSec.innerHTML = h;
      if (!S.dvOgrenci || !liste.some(function (x) { return x.id === S.dvOgrenci; })) {
        S.dvOgrenci = liste[0].id;
        ogrSec.value = S.dvOgrenci;
      }
      gunuCiz();
      ozetiCiz();
    });
  }

  function gunuCiz() {
    var alan = $('dvAlan');
    if (!alan || !S.dvOgrenci) return;
    alan.innerHTML = '<div class="kart"><div class="hint">Yükleniyor...</div></div>';

    return api('/devamsizlik/gun?studentId=' + encodeURIComponent(S.dvOgrenci) +
      '&tarih=' + encodeURIComponent(S.dvTarih)).then(function (d) {
      var not = $('dvGunAdi');
      if (not) not.textContent = tarihGun(d.tarih);

      if (!d.dersler.length) {
        alan.innerHTML = '<div class="kart">' +
          bosKutu('takvim', d.gunAdi + ' günü bu sınıfın programında ders yok.') +
          '</div>';
        return;
      }

      var h = '<div class="kart"><h3>' + esc(d.ogrenci.ad) + ' · ' +
        tarihGun(d.tarih) + '</h3>' +
        '<div class="hint" style="margin-bottom:12px">' +
        'O gün programdaki dersler. Sağdaki kutudan durumu değiştirebilirsin.</div>';

      for (var i = 0; i < d.dersler.length; i++) {
        var l = d.dersler[i];
        h += '<div class="ders-satir">' +
          '<div class="ders-sira">Ders ' + l.sira + '</div>' +
          '<div class="buyu"><div class="ad">' + esc(l.ders) + '</div>' +
          '<div class="alt">' + esc(l.bas) + ' – ' + esc(l.bit) +
          (l.ogretmen ? ' · ' + esc(l.ogretmen) : '') + '</div></div>';

        if (l.duzenlenebilir) {
          /* data-act koymuyoruz: tıklama dağıtıcısı preventDefault çağırıp
             açılır kutuyu bozuyor. Kutu aşağıda kendi olayına bağlanıyor. */
          h += '<select class="durum-kutu" data-ders="' + esc(l.lessonId) + '">';
          for (var j = 0; j < d.durumlar.length; j++) {
            h += '<option value="' + d.durumlar[j].k + '"' +
              (l.durum === d.durumlar[j].k ? ' selected' : '') + '>' +
              d.durumlar[j].ad + '</option>';
          }
          h += '</select>';
        } else {
          h += '<span class="durum-etiket ' + esc(l.durum) + '">' +
            esc(DEVAM_ADLARI[l.durum] || l.durum) + '</span>';
        }
        h += '</div>';
      }
      h += '<div id="dvMesaj" style="margin-top:12px"></div></div>';
      alan.innerHTML = h;

      /* Açılır kutular tıklama dağıtıcısına değil kendi olayına bağlı. */
      var kutular = alan.querySelectorAll('.durum-kutu');
      for (var k = 0; k < kutular.length; k++) {
        kutular[k].onchange = function () {
          var kutu = this;
          kutu.disabled = true;
          api('/devamsizlik/isaretle', 'POST', {
            studentId: S.dvOgrenci,
            lessonId: kutu.getAttribute('data-ders'),
            tarih: S.dvTarih,
            durum: kutu.value
          }).then(function () {
            kutu.disabled = false;
            mesajGoster('dvMesaj', 'iyi', 'Kaydedildi.');
            ozetiCiz();
          })['catch'](function (e) {
            kutu.disabled = false;
            mesajGoster('dvMesaj', 'hata', e.message);
            gunuCiz();
          });
        };
      }
    })['catch'](function (e) {
      alan.innerHTML = '<div class="kart"><div class="msg hata">' +
        esc(e.message) + '</div></div>';
    });
  }

  function ozetiCiz() {
    var kap = $('dvOzet');
    if (!kap || !S.dvOgrenci) return;
    return api('/devamsizlik/ogrenci?studentId=' + encodeURIComponent(S.dvOgrenci))
      .then(function (d) {
        var h = '<div class="grid k4" style="margin-bottom:14px">' +
          stat(d.sayim.yok, 'Gelmedi') + stat(d.sayim.gec, 'Geç geldi') +
          stat(d.sayim.izinli, 'İzinli') + stat(d.toplam, 'Toplam') + '</div>';
        if (!d.kayitlar.length) {
          h += '<div class="hint">Hiç devamsızlık kaydı yok.</div>';
        } else {
          h += '<div class="rapor-kaydir"><table class="rapor-tablo"><thead><tr>' +
            '<th>Tarih</th><th>Ders</th><th>Durum</th><th>Not</th>' +
            '</tr></thead><tbody>';
          for (var i = 0; i < d.kayitlar.length; i++) {
            var k = d.kayitlar[i];
            h += '<tr><td>' + tarihGun(k.tarih) + '</td><td>' + esc(k.ders) + '</td>' +
              '<td><span class="durum-etiket ' + esc(k.durum) + '">' +
              esc(k.durumAd) + '</span></td><td>' + esc(k.not || '') + '</td></tr>';
          }
          h += '</tbody></table></div>';
        }
        kap.innerHTML = h;
      })['catch'](function () { kap.innerHTML = ''; });
  }

  sinifSec.onchange = ogrencileriYukle;
  ogrSec.onchange = function () {
    S.dvOgrenci = this.value;
    gunuCiz();
    ozetiCiz();
  };
  tarihKutu.onchange = function () {
    S.dvTarih = this.value;
    gunuCiz();
  };

  S.dvBugunGit = function () {
    S.dvTarih = new Date().toISOString().slice(0, 10);
    tarihKutu.value = S.dvTarih;
    gunuCiz();
  };

  ogrencileriYukle();
}

var DEVAM_ADLARI = {
  var: 'Geldi', yok: 'Gelmedi', gec: 'Geç geldi', izinli: 'İzinli'
};
