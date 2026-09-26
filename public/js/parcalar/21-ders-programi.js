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

/* Haftanın ders sıraları. Saatleri kesişen dersler aynı sıraya düşer; böylece
   günler hizalanır, o sırada dersi olmayan gün "[boş]" gösterir. Günlerin zil
   saatleri biraz farklı olsa da (cuma kısa gün gibi) aynı sıra korunur. */
function dakika(s) {
  var p = String(s || '').split(':');
  return (+p[0] || 0) * 60 + (+p[1] || 0);
}
function dersSiralari(hucreler) {
  var aralik = [];
  for (var i = 0; i < hucreler.length; i++) aralik.push([dakika(hucreler[i].start), dakika(hucreler[i].end)]);
  aralik.sort(function (a, b) { return a[0] - b[0] || a[1] - b[1]; });
  var siralar = [];
  for (var j = 0; j < aralik.length; j++) {
    var son = siralar[siralar.length - 1];
    if (son && aralik[j][0] < son.bit) son.bit = Math.max(son.bit, aralik[j][1]);
    else siralar.push({ bas: aralik[j][0], bit: aralik[j][1] });
  }
  return siralar;
}
/* Bir günün derslerini sıralara yerleştirir: her sıra için ders listesi. */
function siralaraYerlestir(siralar, liste) {
  var yer = [];
  for (var i = 0; i < siralar.length; i++) yer.push([]);
  for (var j = 0; j < liste.length; j++) {
    var b = dakika(liste[j].start);
    for (var k = 0; k < siralar.length; k++) {
      if (b >= siralar[k].bas && b < siralar[k].bit) { yer[k].push(liste[j]); break; }
    }
  }
  return yer;
}
var BOS_DERS = '[boş]';

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

/* --- HAFTALIK GÖRÜNÜM ---
   Günler satır, ders sıraları sütun. Her hücrede tam detay var; o sırada
   dersi olmayan hücre "[boş]" yazar. */
function haftaHucresi(sp, duzenlenebilir, altAlan) {
  return '<div class="hafta-saat">' + esc(sp.start) + ' – ' + esc(sp.end) + '</div>' +
    '<div class="hafta-ders">' + esc(sp.subject) + '</div>' +
    '<div class="hafta-kisi">' + esc(altAlan(sp) || '') + '</div>' +
    (duzenlenebilir
      ? '<div class="hafta-islem">' +
        '<button class="btn kucuk gri" data-act="saat-duzenle" data-id="' + esc(sp.id) + '">Düzenle</button>' +
        '<button class="btn kucuk tehlike" data-act="saat-sil" data-id="' + esc(sp.id) + '">Sil</button>' +
        '</div>'
      : '');
}

function haftalikGorunum(d, duzenlenebilir, altAlan) {
  var gunler = gunlereBol(d.cells);
  var carp = cakisanKimlikler(d);
  var siralar = dersSiralari(d.cells);
  var sutun = Math.max(1, siralar.length);

  var h = '<div class="hafta-sar"><table class="hafta"><thead><tr><th class="gun-sutun">Gün</th>';
  for (var i = 1; i <= sutun; i++) h += '<th>Ders ' + i + '</th>';
  if (duzenlenebilir) h += '<th class="ekle-sutun"></th>';
  h += '</tr></thead><tbody>';

  for (var gu = 1; gu <= (d.gunSayisi || 7); gu++) {
    var liste = gunler[gu] || [];
    h += '<tr' + (gu === bugunNo() ? ' class="bugun"' : '') + '>' +
      '<th class="gun-sutun">' + esc(d.gunAdlari[gu] || ('Gün ' + gu)) +
      (gu === bugunNo() ? '<span class="bugun-etiket">bugün</span>' : '') + '</th>';

    if (!liste.length) {
      h += '<td class="bos-hucre" colspan="' + sutun + '"><span class="bos-ders">' + BOS_DERS + '</span></td>';
    } else {
      var yer = siralaraYerlestir(siralar, liste);
      for (var j = 0; j < yer.length; j++) {
        if (!yer[j].length) { h += '<td class="bos-hucre"><span class="bos-ders">' + BOS_DERS + '</span></td>'; continue; }
        var cakisiyor = false;
        for (var c = 0; c < yer[j].length; c++) if (carp[yer[j][c].id]) cakisiyor = true;
        h += '<td' + (cakisiyor ? ' class="cakisma"' : '') + '>';
        for (var y = 0; y < yer[j].length; y++) {
          h += (y ? '<div class="hafta-ayrac"></div>' : '') + haftaHucresi(yer[j][y], duzenlenebilir, altAlan);
        }
        h += '</td>';
      }
    }
    if (duzenlenebilir) {
      h += '<td class="ekle-sutun">' +
        '<button type="button" class="hafta-ekle" data-act="saat-ekle" data-gun="' + gu + '" ' +
        'title="' + esc(d.gunAdlari[gu]) + ' gününe ders ekle">+</button></td>';
    }
    h += '</tr>';
  }
  return h + '</tbody></table></div>';
}

/* Gün / Hafta düğmesi */
function gorunumSecici() {
  var hafta = S.programGorunum === 'hafta';
  return '<div class="gorunum-secici">' +
    '<button type="button" class="gorunum-dugme' + (hafta ? '' : ' secili') + '" ' +
    'data-act="program-gorunum" data-tur="gun">Gün</button>' +
    '<button type="button" class="gorunum-dugme' + (hafta ? ' secili' : '') + '" ' +
    'data-act="program-gorunum" data-tur="hafta">Hafta</button>' +
    '</div>';
}

/* Seçili görünüme göre çizer. */
function programGovdesi(d, duzenlenebilir, altAlan) {
  return S.programGorunum === 'hafta'
    ? haftalikGorunum(d, duzenlenebilir, altAlan)
    : gunlukGorunum(d, duzenlenebilir, altAlan);
}

/* Program hangi sayfada açıksa onu yeniden çizer. */
function programYenidenCiz() {
  if (S.page === 'program') return programCiz()['catch'](hataGoster);
  return git(S.page);
}

/* Ders saati ekleme / düzenleme penceresi */
function saatModal(gun, mevcutId) {
  var d = S.programVeri;
  var mevcut = null;
  if (mevcutId) {
    for (var i = 0; i < d.cells.length; i++) if (d.cells[i].id === mevcutId) mevcut = d.cells[i];
    if (mevcut) gun = mevcut.day;
  }

  if (!d.lessons.length) {
    modalAc('Ders ekle', bosKutu('ders', 'Bu sınıfa önce ders eklemelisin. Sınıflar sayfasından ekleyebilirsin.'));
    return;
  }

  var h = '<div class="field"><label for="mGun">Gün</label><select id="mGun">';
  for (var g = 1; g <= (d.gunSayisi || 7); g++) {
    h += '<option value="' + g + '"' + (g === gun ? ' selected' : '') + '>' +
      esc(d.gunAdlari[g]) + '</option>';
  }
  h += '</select></div>';

  h += '<div class="field"><label for="mDers">Ders</label><select id="mDers">';
  for (var j = 0; j < d.lessons.length; j++) {
    var l = d.lessons[j];
    h += '<option value="' + esc(l.id) + '"' +
      (mevcut && mevcut.lessonId === l.id ? ' selected' : '') + '>' +
      esc(l.subject) + (l.teacherName ? ' — ' + esc(l.teacherName) : ' — öğretmen yok') + '</option>';
  }
  h += '</select></div>';

  h += '<div class="row2">' +
    '<div class="field"><label for="mBas">Başlangıç</label>' +
    '<input type="time" id="mBas" value="' + esc(mevcut ? mevcut.start : '09:00') + '"></div>' +
    '<div class="field"><label for="mBit">Bitiş</label>' +
    '<input type="time" id="mBit" value="' + esc(mevcut ? mevcut.end : '09:40') + '"></div>' +
    '</div>' +
    '<div class="hint">Saatleri okulunun zil düzenine göre serbestçe yazabilirsin.</div>' +
    '<div id="saatMesaj" style="margin-top:9px"></div>';

  modalAc(mevcut ? 'Ders saatini düzenle' : 'Ders ekle', h,
    '<button class="btn gri" data-act="modal-kapat">Vazgeç</button>' +
    '<button class="btn" data-act="saat-kaydet" data-id="' + esc(mevcutId || '') + '">Kaydet</button>');
}
