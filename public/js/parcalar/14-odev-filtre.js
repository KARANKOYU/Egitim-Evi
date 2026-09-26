/* Ödev listesi filtreleri ve listeleme. */

/* ---- ödev filtreleri ---- */

var ODEV_DURUMLAR = {
  ogrenci: [
    ['', 'Tüm durumlar'],
    ['aktif', 'Aktif olanlar'],
    ['gecmis', 'Geçmiş olanlar'],
    ['acilmadi', 'Açılmamış'],
    ['yapti', 'Yaptı'],
    ['gec', 'Geç yaptı'],
    ['yapmadi', 'Yapmadı'],
    ['eksik', 'Eksik'],
    ['izinli', 'Gelmedi (izinli)'],
    ['gelmedi', 'Gelmedi (izinsiz)'],
    ['notlanmadi', 'Değerlendirilmedi']
  ],
  ogretmen: [
    ['', 'Tüm durumlar'],
    ['aktif', 'Aktif olanlar'],
    ['sonuclandi', 'Sonuçlananlar'],
    ['gecikti', 'Süresi dolmuş, sonuçlanmamış']
  ]
};

function odevFiltreCubugu(list) {
  var f = S.odevF, dersler = [], i;
  for (i = 0; i < list.length; i++) {
    if (list[i].subject && dersler.indexOf(list[i].subject) < 0) dersler.push(list[i].subject);
  }
  dersler.sort(function (a, b) { return a.localeCompare(b, 'tr'); });

  var dersSec = '<option value="">Tüm dersler</option>';
  for (i = 0; i < dersler.length; i++) {
    dersSec += '<option value="' + esc(dersler[i]) + '"' +
      (f.ders === dersler[i] ? ' selected' : '') + '>' + esc(dersler[i]) + '</option>';
  }
  var durumlar = ODEV_DURUMLAR[f.mod] || ODEV_DURUMLAR.ogrenci;
  var durumSec = '';
  for (i = 0; i < durumlar.length; i++) {
    durumSec += '<option value="' + durumlar[i][0] + '"' +
      (f.durum === durumlar[i][0] ? ' selected' : '') + '>' + durumlar[i][1] + '</option>';
  }

  var dersAlani = dersler.length > 1
    ? '<div class="field"><label for="fDers">Ders</label><select id="fDers">' + dersSec + '</select></div>'
    : '';
  /* Yıldız süzgeci yalnızca öğrencinin kendi listesinde (yıldız ona özel). */
  var yildizAlani = f.mod === 'ogrenci' && odevYildizliMi() ? '<div class="field"><label for="fYildiz">Yıldız</label>' +
    '<select id="fYildiz">' + [['', 'Hepsi'], ['var', 'Yıldızlı'], ['yok', 'Yıldızsız']].map(function (s) {
      return '<option value="' + s[0] + '"' + ((f.yildiz || '') === s[0] ? ' selected' : '') + '>' + s[1] + '</option>';
    }).join('') + '</select></div>' : '';

  return '<div class="kart filtre">' +
    '<div class="filtre-satir">' + dersAlani + yildizAlani +
    '<div class="field"><label for="fDurum">Durum</label><select id="fDurum">' + durumSec + '</select></div>' +
    '<div class="field"><label for="fBas">Son teslim başlangıç</label>' +
    '<input type="date" id="fBas" value="' + esc(f.bas) + '"></div>' +
    '<div class="field"><label for="fBit">Son teslim bitiş</label>' +
    '<input type="date" id="fBit" value="' + esc(f.bit) + '"></div>' +
    '<button type="button" class="btn gri kucuk" data-act="odev-filtre-temizle">Temizle</button>' +
    '</div><div class="filtre-ozet" id="fOzet"></div></div>';
}

function odevFiltrele(list) {
  var f = S.odevF;
  var t = nrm($('araKutu') && $('araKutu').value || '');
  /* Tarih kutuları yerel gün sınırlarına genişletilir, saat farkı sonucu kaydırmasın. */
  var bas = f.bas ? new Date(f.bas + 'T00:00:00') : null;
  var bit = f.bit ? new Date(f.bit + 'T23:59:59') : null;
  if (bas && isNaN(bas.getTime())) bas = null;
  if (bit && isNaN(bit.getTime())) bit = null;

  return list.filter(function (a) {
    if (f.ders && a.subject !== f.ders) return false;
    if (f.yildiz === 'var' && !a.yildizli) return false;
    if (f.yildiz === 'yok' && a.yildizli) return false;

    if (f.durum === 'aktif') { if (a.status !== 'active') return false; }
    else if (f.durum === 'gecmis') { if (a.status === 'active') return false; }
    else if (f.durum === 'sonuclandi') { if (a.status !== 'finished') return false; }
    else if (f.durum === 'gecikti') {
      if (a.status !== 'active' || !teslimGecti(a.endAt, a.endTime)) return false;
    }
    else if (f.durum === 'notlanmadi') { if (a.result) return false; }
    else if (f.durum === 'acilmadi') { if (a.acildi !== false || a.status !== 'active') return false; }
    else if (f.durum) { if (a.result !== f.durum) return false; }

    if (bas || bit) {
      var d = a.endAt ? new Date(a.endAt) : null;
      if (!d || isNaN(d.getTime())) return false;
      if (bas && d < bas) return false;
      if (bit && d > bit) return false;
    }

    if (t) {
      var metin = nrm([a.title, a.subject, a.teacherName || '', a.description || ''].join(' '));
      if (metin.indexOf(t) < 0) return false;
    }
    return true;
  });
}

function odevSonucCiz() {
  var kap = $('odevSonuc');
  if (!kap) return;
  var ham = S.odevHam || [];
  var liste = odevFiltrele(ham);

  var ozet = $('fOzet');
  if (ozet) {
    ozet.textContent = liste.length === ham.length
      ? ham.length + ' ödev'
      : ham.length + ' ödevden ' + liste.length + ' tanesi gösteriliyor';
  }

  if (!liste.length) {
    kap.innerHTML = bosKutu('ara', ham.length
      ? 'Bu filtrelere uyan ödev yok. "Temizle" ile filtreleri sıfırlayabilirsin.'
      : 'Henüz ödev yok.');
    return;
  }

  var ogretmenMi = S.odevF.mod === 'ogretmen';
  var ciz = ogretmenMi ? odevListesiOgretmen : odevListesiOgrenci;
  var aktif = liste.filter(function (a) { return a.status === 'active'; });
  var gecmis = liste.filter(function (a) { return a.status !== 'active'; });
  var h = '';
  if (aktif.length) {
    h += '<h3 class="sb">Aktif ödevler (' + aktif.length + ')</h3>' + ciz(aktif);
  }
  if (gecmis.length) {
    h += '<h3 class="sb">Geçmiş ödevler (' + gecmis.length + ')</h3>' + ciz(gecmis);
  }
  kap.innerHTML = h;
}

