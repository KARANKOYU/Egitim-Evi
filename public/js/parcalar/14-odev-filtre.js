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

/* Öğrenci kendi ödevlerine bakıyor mu (veli çocuğuna bakarken yıldız yok). */
function odevYildizliMi() {
  return S.user.role === 'student' && !S.viewStudentId;
}

function odevFiltreBagla() {
  var alanlar = [['fDers', 'ders'], ['fYildiz', 'yildiz'], ['fDurum', 'durum'], ['fBas', 'bas'], ['fBit', 'bit']];
  for (var i = 0; i < alanlar.length; i++) {
    (function (id, anahtar) {
      var el = $(id);
      if (!el) return;
      el.onchange = function () { S.odevF[anahtar] = el.value; odevSonucCiz(); };
    })(alanlar[i][0], alanlar[i][1]);
  }
}

SAYFALAR.odevler = function () {
  return api('/progress' + hedefOgrenci()).then(function (d) {
    S.odevHam = d.assignments || [];
    S.araHook = odevSonucCiz;
    var h = hero('ÖDEVLER', S.viewStudentId ? S.viewStudentName + ' adına görüntülüyorsun.' : '');
    h += seriSeridi(d.seri);
    h += odevFiltreCubugu(S.odevHam);
    h += '<div id="odevSonuc"></div>';
    yaz(h);
    odevFiltreBagla();
    odevSonucCiz();
  });
};

function odevListesiOgrenci(list) {
  var h = '<div class="kart">';
  for (var i = 0; i < list.length; i++) {
    var a = list[i];
    var sag;
    if (a.result) {
      var r = SONUC[a.result];
      sag = '<span class="etiket ' + r.renk + '">' + r.ad + '</span>';
    } else if (a.status === 'finished') {
      sag = '<span class="etiket gri">Değerlendirilmedi</span>';
    } else sag = kalanEtiketi(a);

    /* Açılmamış aktif ödev turuncuya çalar; satıra tıklayınca ayrıntı açılır
       ve öğrencinin kendisiyse "açıldı" olarak işaretlenir. */
    var acilmadi = a.status === 'active' && a.acildi === false;
    /* Yıldız düğmesi satırın içinde ama ayrı bir düğme: satıra tıklamak
       ödevi açar, yıldıza tıklamak yalnızca yıldızı değiştirir. */
    var yildiz = odevYildizliMi() ? '<button type="button" class="yildiz-btn' + (a.yildizli ? ' on' : '') + '" data-act="odev-yildiz"' +
      ' data-id="' + esc(a.id) + '" aria-pressed="' + (a.yildizli ? 'true' : 'false') + '"' +
      ' aria-label="' + (a.yildizli ? 'Yıldızı kaldır' : 'Yıldızla') + '" title="' + (a.yildizli ? 'Yıldızı kaldır' : 'Yıldızla') + '">' +
      ik('yildiz') + '</button>' : '';
    h += '<div class="satir odev-satir tikla-odev' + (acilmadi ? ' acilmadi' : '') + '" data-act="odev-oku" data-id="' + esc(a.id) + '"' +
      ' data-ara="' + esc(a.title + ' ' + a.subject) + '"' + (acilmadi ? ' title="Henüz açılmadı"' : '') + '>' + yildiz +
      '<div class="buyu"><div class="ad">' + esc(a.title) + '</div>' +
      '<div class="alt">' + esc(a.subject) + ' · ' + esc(a.teacherName) +
      (a.endAt ? ' · son teslim ' + tarihGunSaat(a.endAt, a.endTime) : '') + '</div>' +
      (a.description ? '<div class="alt" style="margin-top:4px">' + esc(kisaMetin(a.description, 140)) + '</div>' : '') +
      '</div>' + sag + '</div>';
  }
  return h + '</div>';
}

EYLEMLER['odev-yildiz'] = function (el, id) {
  var a = (S.odevHam || []).filter(function (x) { return x.id === id; })[0];
  if (!a || el.disabled) return;
  var yeni = !a.yildizli;
  el.disabled = true;
  return api('/assignments/' + encodeURIComponent(id) + '/yildiz', 'POST', { yildiz: yeni }).then(function () {
    a.yildizli = yeni;
    /* Süzgeç yıldıza göreyse liste yeniden çizilir; değilse yalnızca düğme değişir. */
    if (S.odevF.yildiz) { odevSonucCiz(); return; }
    el.disabled = false;
    el.classList.toggle('on', yeni);
    el.setAttribute('aria-pressed', yeni ? 'true' : 'false');
    el.setAttribute('aria-label', yeni ? 'Yıldızı kaldır' : 'Yıldızla');
    el.title = yeni ? 'Yıldızı kaldır' : 'Yıldızla';
  })['catch'](function (e) { el.disabled = false; hataGoster(e); });
};

function kisaMetin(s, n) {
  s = String(s || '');
  return s.length > n ? s.slice(0, n - 1) + '…' : s;
}

/* Ödev ayrıntısı. Öğrenci ilk kez açınca sunucuya bildirilir; öğretmen
   "ödev 20.05.2026 16:20 tarihinde açıldı" diye görür. Veli bakınca
   işaretlenmez (sunucu da yalnızca öğrencinin kendisini kabul eder). */
EYLEMLER['odev-oku'] = function (el, id) {
  var a = (S.odevHam || []).filter(function (x) { return x.id === id; })[0];
  if (!a) return;
  var sonuc = a.result && SONUC[a.result]
    ? '<span class="etiket ' + SONUC[a.result].renk + '">' + SONUC[a.result].ad + '</span>'
    : (a.status === 'finished' ? '<span class="etiket gri">Değerlendirilmedi</span>' : '<span class="etiket mavi">Aktif</span>');
  modalAc(a.title,
    '<div class="alt" style="color:var(--soluk);margin-bottom:10px">' + esc(a.subject) + ' · ' + esc(a.teacherName) + '</div>' +
    '<div class="satir" style="padding-left:0;padding-right:0"><div class="buyu">' +
    (a.startAt ? '<div>Veriliş: ' + tarihGunSaat(a.startAt, a.startTime) + '</div>' : '') +
    (a.endAt ? '<div>Son teslim: <b>' + tarihGunSaat(a.endAt, a.endTime) + '</b></div>' : '<div>Süresiz</div>') +
    '</div>' + sonuc + '</div>' +
    (a.description ? '<div class="odev-aciklama">' + esc(a.description) + '</div>' : '') +
    ekListesiGoster(a.ekler));
  if (S.user.role === 'student' && !S.viewStudentId && a.acildi === false) {
    api('/assignments/' + id + '/acildi', 'POST').then(function () {
      a.acildi = true;
      el.classList.remove('acilmadi');
      el.removeAttribute('title');
    })['catch'](function () { /* işaretlenemezse bir dahaki açılışta yeniden denenir */ });
  }
};

