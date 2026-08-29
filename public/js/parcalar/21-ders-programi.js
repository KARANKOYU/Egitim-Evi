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

/* ================= program çizimi =================
   İki görünüm var:
     gün   — tek gün, dersler yan yana sütunlar (varsayılan)
     hafta — günler satır, ders sıraları sütun
   İkisi de aynı detayı gösterir: saat, ders adı, öğretmen ya da sınıf. */

/* Kullanıcının bir yetkisi var mı? Müdür ve yönetici her zaman yetkilidir. */
function yetkim(izin) {
  var u = S.user;
  if (!u) return false;
  if (u.role === 'admin' || u.role === 'principal') return true;
  return (u.yetkiler || []).indexOf(izin) >= 0;
}

var GUN_KISA = ['', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];

function bugunNo() {
  var g = new Date().getDay();      /* 0 Pazar */
  return g === 0 ? 7 : g;
}

/* Kayıtları güne göre grupla ve saate göre sırala. */
function gunlereBol(hucreler) {
  var gunler = {};
  for (var i = 0; i < hucreler.length; i++) {
    var g = hucreler[i].day;
    if (!gunler[g]) gunler[g] = [];
    gunler[g].push(hucreler[i]);
  }
  for (var k in gunler) {
    gunler[k].sort(function (a, b) { return String(a.start).localeCompare(String(b.start)); });
  }
  return gunler;
}

/* Çakışan kayıtların kimlik listesi */
function cakisanKimlikler(d) {
  var carp = {};
  /* Öğretmen ucunda çakışma bayrağı hücrenin kendisinde geliyor. */
  for (var i = 0; i < (d.cells || []).length; i++) {
    if (d.cells[i].cakisma) carp[d.cells[i].id] = true;
  }
  if (d.cakismalar) {
    for (var c = 0; c < d.cakismalar.length; c++) {
      var l = d.cakismalar[c].lessons || [];
      for (var m = 0; m < l.length; m++) if (l[m].scheduleId) carp[l[m].scheduleId] = true;
    }
  }
  return carp;
}

/* Gün seçici şerit: hangi günde kaç ders var, tek bakışta. */
function gunSeridi(d, gunler, seciliGun) {
  var h = '<div class="gun-seridi">';
  for (var g = 1; g <= (d.gunSayisi || 7); g++) {
    var adet = (gunler[g] || []).length;
    h += '<button type="button" class="gun-nokta' +
      (g === seciliGun ? ' secili' : '') + (adet ? ' dolu' : ' bos') +
      (g === bugunNo() ? ' bugun' : '') + '" data-act="program-gun" data-gun="' + g + '">' +
      '<span class="nokta-ad">' + esc(GUN_KISA[g] || g) + '</span>' +
      '<span class="nokta-adet">' + (adet ? adet : '–') + '</span>' +
      '</button>';
  }
  return h + '</div>';
}

/* Bir dersin kartı. altSatir: öğretmen adı ya da sınıf adı. */
function dersSutunu(sp, sira, duzenlenebilir, carpisiyor, altSatir, ekIslem) {
  var simdi = false;
  if (sp.day === bugunNo()) {
    var d = new Date();
    var su = d.getHours() * 60 + d.getMinutes();
    var b = String(sp.start).split(':'), t = String(sp.end).split(':');
    var bd = (+b[0]) * 60 + (+b[1]), td = (+t[0]) * 60 + (+t[1]);
    simdi = su >= bd && su < td;
  }

  return '<div class="ders-sutun' + (carpisiyor ? ' cakisma' : '') + (simdi ? ' simdi' : '') + '">' +
    '<div class="sutun-basi">Ders ' + sira +
    (simdi ? ' <span class="simdi-etiket">şimdi</span>' : '') + '</div>' +
    '<div class="sutun-saat">' + esc(sp.start) + ' – ' + esc(sp.end) + '</div>' +
    '<div class="sutun-ders">' + esc(sp.subject) + '</div>' +
    '<div class="sutun-kisi">' + esc(altSatir || '') + '</div>' +
    (carpisiyor ? '<div class="sutun-uyari">Aynı saatte başka bir derse de yazılmış</div>' : '') +
    (duzenlenebilir
      ? '<div class="sutun-islem">' +
        '<button class="btn kucuk gri" data-act="saat-duzenle" data-id="' + esc(sp.id) + '">Düzenle</button>' +
        '<button class="btn kucuk tehlike" data-act="saat-sil" data-id="' + esc(sp.id) + '">Sil</button>' +
        '</div>'
      : (ekIslem || '')) +
    '</div>';
}

/* --- GÜNLÜK GÖRÜNÜM --- */
function gunlukGorunum(d, duzenlenebilir, altAlan) {
  var gunler = gunlereBol(d.cells);
  var carp = cakisanKimlikler(d);
  /* Kullanıcı gün seçmediyse bugünü aç; bugün boşsa ders olan ilk güne düş,
     yoksa kimse boş bir ekranla karşılaşmasın. */
  var gun = S.programGun;
  if (!gun) {
    gun = bugunNo();
    if (!(gunler[gun] || []).length) {
      for (var ara = 1; ara <= (d.gunSayisi || 7); ara++) {
        if ((gunler[ara] || []).length) { gun = ara; break; }
      }
    }
  }
  if (gun < 1 || gun > (d.gunSayisi || 7)) gun = 1;
  var liste = gunler[gun] || [];

  var h = gunSeridi(d, gunler, gun);

  h += '<div class="gun-gezgin">' +
    '<button type="button" class="gun-ok" data-act="program-gun" data-gun="' +
    (gun === 1 ? (d.gunSayisi || 7) : gun - 1) + '">‹ önceki gün</button>' +
    '<div class="gun-orta">' +
    '<div class="gun-buyuk">' + esc(d.gunAdlari[gun] || ('Gün ' + gun)) + '</div>' +
    '<div class="gun-kucuk">' +
    (liste.length ? liste.length + ' ders · ' + esc(liste[0].start) + ' – ' + esc(liste[liste.length - 1].end)
      : 'ders yok') +
    (gun === bugunNo() ? ' · bugün' : '') + '</div>' +
    '</div>' +
    '<button type="button" class="gun-ok" data-act="program-gun" data-gun="' +
    (gun === (d.gunSayisi || 7) ? 1 : gun + 1) + '">sonraki gün ›</button>' +
    '</div>';

  /* Dersler haftanın sıralarına göre dizilir; dersi olmayan sıra "[boş]". */
  h += '<div class="ders-sutunlar">';
  if (liste.length) {
    var yer = siralaraYerlestir(dersSiralari(d.cells), liste);
    for (var i = 0; i < yer.length; i++) {
      if (!yer[i].length) {
        h += '<div class="ders-sutun bos-saat"><div class="sutun-basi">Ders ' + (i + 1) + '</div>' +
          '<div class="bos-ders">' + BOS_DERS + '</div></div>';
        continue;
      }
      for (var y = 0; y < yer[i].length; y++) {
        var sp = yer[i][y];
        h += dersSutunu(sp, i + 1, duzenlenebilir, carp[sp.id], altAlan(sp), altAlan.ekIslem ? altAlan.ekIslem(sp) : '');
      }
    }
  } else if (!duzenlenebilir) {
    h += '<div class="ders-sutun bos-saat"><div class="bos-ders">' + BOS_DERS + '</div>' +
      '<div class="bos-yazi">Bu gün ders yok</div></div>';
  }
  if (duzenlenebilir) {
    h += '<button type="button" class="ders-sutun ekle" data-act="saat-ekle" data-gun="' + gun + '">' +
      '<span class="ekle-arti">+</span><span class="ekle-yazi">Ders ekle</span></button>';
  }
  h += '</div>';
  return h;
}

