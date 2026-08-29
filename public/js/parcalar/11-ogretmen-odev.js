/* Öğretmen ve müdürün ödev sayfaları: ders ağacı, yeni ödev, sonuçlar. */

/* ---- ÖĞRETMEN: ödevler ---- */
/* Müdür ödev vermez, ders bazlı bakar: hangi derse hangi öğretmen ne vermiş.
   Liste yalnızca ders başına sayıları getirir; bir ders açılınca yalnızca
   o dersin ödevleri istenir ve S.dersOdevleri'nde tutulur. "Hepsini aç"
   yalnızca sınıf seçiliyken çıkar (o sınıfın derslerini tek istekte getirir). */
SAYFALAR['ders-odevleri'] = function () {
  var adres = '/school/assignments' + (S.odevSinif ? '?classId=' + encodeURIComponent(S.odevSinif) : '');
  if (S.odevSinif && S.dersHepsiAcik) adres += '&detay=1';
  return api(adres).then(function (d) {
    if (!S.acikDersler) S.acikDersler = {};
    S.dersOdevleri = {};   // her açılışta taze: ödevler bu arada değişmiş olabilir
    for (var n = 0; n < d.lessons.length; n++) {
      if (d.lessons[n].assignments) S.dersOdevleri[d.lessons[n].lessonId] = d.lessons[n].assignments;
    }
    S.dersListesi = d;
    dersOdevleriCiz(d);
  });
};

function dersOdevleriCiz(d) {
  var h = hero('DERS ÖDEVLERİ', '');

  h += '<div class="kart"><div class="satir" style="border:0;padding:0">' +
    '<div class="field" style="margin:0;min-width:220px">' +
    '<select id="oSinifSec"><option value="">Tüm sınıflar</option>';
  for (var i = 0; i < d.classes.length; i++) {
    h += '<option value="' + esc(d.classes[i].id) + '"' +
      (S.odevSinif === d.classes[i].id ? ' selected' : '') + '>' +
      esc(d.classes[i].name) + '</option>';
  }
  h += '</select></div><div class="buyu"></div>' +
    (S.odevSinif ? '<button class="btn kucuk ghost" data-act="ders-hepsini-ac">Hepsini aç</button>' : '') +
    '<button class="btn kucuk ghost" data-act="ders-hepsini-kapat">Hepsini kapat</button>' +
    '</div></div>';

  if (!d.lessons.length) {
    h += bosKutu('ders', 'Bu sınıfa ders eklenmemiş.');
    yaz(h);
    sinifSeciciBagla();
    return;
  }

  h += '<div class="kart" style="padding:8px 10px">';

  for (var j = 0; j < d.lessons.length; j++) {
    var l = d.lessons[j];
    var acik = !!S.acikDersler[l.lessonId];
    var odevler = S.dersOdevleri[l.lessonId];   // açılınca gelir

    /* Ödevleri ikiye ayır: hâlâ süren ve süresi dolmuş olanlar. */
    var aktif = [], gecmis = [];
    for (var k = 0; odevler && k < odevler.length; k++) {
      var a = odevler[k];
      var bitti = a.status === 'finished' ||
        (a.gecikti !== undefined ? a.gecikti : teslimGecti(a.endAt, a.endTime));
      (bitti ? gecmis : aktif).push(a);
    }

    h += '<div class="ders-dal" data-ara="' +
      esc(l.className + ' ' + l.subject + ' ' + l.teacherName) + '">';

    h += '<button type="button" class="dal-basi' + (acik ? ' acik' : '') +
      '" data-act="ders-dal" data-id="' + esc(l.lessonId) + '">' +
      '<span class="dal-ok">' + (acik ? '▾' : '▸') + '</span>' +
      '<span class="dal-ad">' + esc(l.className) + ' · ' + esc(l.subject) + '</span>' +
      '<span class="dal-alt">' +
      (l.teacherName ? esc(l.teacherName)
        : '<span style="color:var(--kirmizi)">öğretmen atanmadı</span>') + '</span>' +
      '<span class="dal-sayi">' +
      (l.aktif ? '<span class="etiket mavi">' + l.aktif + ' aktif</span> ' : '') +
      (l.gecmis ? '<span class="etiket gri">' + l.gecmis + ' geçmiş</span>' : '') +
      (l.aktif + l.gecmis ? '' : '<span class="etiket gri">ödev yok</span>') +
      '</span></button>';

    if (acik) {
      h += '<div class="dal-icerik">';
      if (!odevler) {
        h += '<div class="dal-bos">Yükleniyor...</div>';
      } else if (!odevler.length) {
        h += '<div class="dal-bos">Bu derse henüz ödev verilmemiş.</div>';
      } else {
        h += odevGrubu('Aktif ödevler', aktif);
        h += odevGrubu('Süresi geçmiş', gecmis);
      }
      h += '</div>';
    }
    h += '</div>';
  }

  h += '</div>';
  yaz(h);
  sinifSeciciBagla();
}

/* Bir ders dalının içindeki ödev grubu (aktif / geçmiş). */
function odevGrubu(baslik, liste) {
  if (!liste.length) return '';
  var h = '<div class="dal-grup"><div class="dal-grup-baslik">' + baslik + '</div>';
  for (var i = 0; i < liste.length; i++) {
    var a = liste[i];
    var durum = a.status === 'finished'
      ? '<span class="etiket yesil">Sonuçlandı</span>'
      : ((a.gecikti !== undefined ? a.gecikti : teslimGecti(a.endAt, a.endTime))
        ? '<span class="etiket kirmizi">Süresi doldu</span>'
        : '<span class="etiket mavi">Aktif</span>');

    h += '<div class="satir">' +
      '<div class="buyu"><div class="ad">' + esc(a.title) + '</div>' +
      '<div class="alt">' + esc(a.teacherName) + ' · ' + a.studentCount + ' öğrenci · ' +
      (a.endAt ? tarihGunSaat(a.endAt, a.endTime) : 'süresiz') + '</div>' +
      (a.description ? '<div class="alt" style="margin-top:3px">' +
        esc(a.description) + '</div>' : '') +
      '</div>' + durum +
      /* Öğretmeni okuldan ayrılan ödevi müdür sonuçlandırır. */
      (a.sahipsiz && S.user.role === 'principal'
        ? '<button class="btn kucuk" data-act="odev-ac" data-id="' + esc(a.id) + '">Sonuçlandır</button>' : '') +
      '</div>';
  }
  return h + '</div>';
}

function sinifSeciciBagla() {
  var sec = $('oSinifSec');
  if (!sec) return;
  sec.onchange = function () {
    S.odevSinif = this.value;
    S.dersHepsiAcik = false;
    git('ders-odevleri');
  };
}

/* Ders dalı: açılınca o dersin ödevleri bir kez istenir. Sayfa yeniden
   çizilmez, yalnızca liste tazelenir (ağdan tekrar sayı istenmez). */
function dersDaliAcKapa(dersId) {
  S.acikDersler[dersId] = !S.acikDersler[dersId];
  if (S.acikDersler[dersId] && !S.dersOdevleri[dersId]) {
    api('/school/assignments?lessonId=' + encodeURIComponent(dersId)).then(function (r) {
      S.dersOdevleri[dersId] = r.assignments;
      dersListesiniYenidenCiz();
    })['catch'](hataGoster);
  }
  dersListesiniYenidenCiz();
}

