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

function dersListesiniYenidenCiz() {
  var kaydir = window.scrollY;
  if (S.dersListesi) dersOdevleriCiz(S.dersListesi);
  window.scrollTo(0, kaydir);
}

SAYFALAR['ogr-odevler'] = function () {
  return api('/assignments').then(function (d) {
    S.odevHam = d.assignments || [];
    S.odevF.mod = 'ogretmen';
    S.araHook = odevSonucCiz;
    var h = hero('ÖDEVLER', 'Aynı anda birden fazla ödev verebilirsin.');
    /* Müdür ödev vermez; ödev öğretmenin işi. Müdür ders bazlı bakar. */
    if (S.user.role !== 'principal') {
      h += '<button class="btn" data-act="odev-yeni">Yeni ödev ver</button>';
    }
    h += odevFiltreCubugu(S.odevHam);
    h += '<div id="odevSonuc"></div>';
    yaz(h);
    odevFiltreBagla();
    odevSonucCiz();
  });
};

function odevListesiOgretmen(list) {
  var h = '<div class="kart">';
  for (var i = 0; i < list.length; i++) {
    var a = list[i];
    var kalan = gunFarki(a.endAt);
    var gecti = a.gecikti !== undefined ? a.gecikti : teslimGecti(a.endAt, a.endTime);
    var durum = a.status === 'finished'
      ? '<span class="etiket yesil">Sonuçlandı</span>'
      : (gecti ? '<span class="etiket kirmizi">Süresi doldu</span>'
        : '<span class="etiket mavi">Aktif' + (kalan !== null ? ' · ' + (kalan <= 0 ? 'bugün son gün' : kalan + ' gün') : '') + '</span>');
    var ozet = '';
    if (a.summary) {
      ozet = '<div style="margin-top:5px">' +
        '<span class="etiket yesil" title="Yaptı">' + a.summary.yapti + '</span> ' +
        '<span class="etiket mavi" title="Geç yaptı">' + (a.summary.gec || 0) + '</span> ' +
        '<span class="etiket turuncu" title="Eksik">' + a.summary.eksik + '</span> ' +
        '<span class="etiket kirmizi" title="Yapmadı">' + a.summary.yapmadi + '</span> ' +
        '<span class="etiket gri" title="Gelmedi (izinli)">' + a.summary.izinli + '</span> ' +
        '<span class="etiket bordo" title="Gelmedi (izinsiz)">' + a.summary.gelmedi + '</span></div>';
    } else if (a.acilan !== undefined) {
      /* Aktif ödevde kaç öğrencinin açtığı */
      ozet = '<div class="acilma-yazi' + (a.acilan < a.studentCount ? ' acilmadi' : '') + '">' +
        a.studentCount + ' öğrenciden ' + a.acilan + ' kişi açtı</div>';
    }
    h += '<div class="satir" data-ara="' + esc(a.title + ' ' + a.subject) + '">' +
      '<div class="buyu"><div class="ad">' + esc(a.title) + '</div>' +
      '<div class="alt">' + esc(a.subject) + ' · ' + a.studentCount + ' öğrenci · ' +
      (a.endAt ? 'Son teslim: ' + tarihGunSaat(a.endAt, a.endTime) : 'süresiz') +
      '</div>' + ozet + '</div>' +
      durum +
      '<button class="btn kucuk ' + (a.status === 'finished' ? 'gri' : '') + '" data-act="odev-ac" data-id="' + esc(a.id) + '">' +
      (a.status === 'finished' ? 'Sonuçları düzenle' : 'Sonuçlandır') + '</button>' +
      '<button class="btn kucuk tehlike" data-act="odev-sil" data-id="' + esc(a.id) + '">Sil</button>' +
      '</div>';
  }
  return h + '</div>';
}

function odevYeniModal() {
  return api('/assignments/hedefler').then(function (d) {
    S.odevHedef = d;

    if (!d.classes.length) {
      modalAc('Yeni ödev', bosKutu('ogrenci',
        'Ödev verebileceğin öğrenci yok. Müdürünün seni bir sınıfın dersine ataması gerekiyor.'));
      return;
    }

    var bugun = new Date().toISOString().slice(0, 10);

    var h = '<div class="field"><label for="mDers">Ders</label><select id="mDers">';
    for (var i = 0; i < d.subjects.length; i++) {
      h += '<option value="' + esc(d.subjects[i]) + '"' +
        (d.subjects[i] === d.varsayilanDers ? ' selected' : '') + '>' +
        esc(d.subjects[i]) + '</option>';
    }
    h += '</select></div>';

    h += '<div class="field"><label for="mBaslik">Ödev adı</label>' +
      '<input type="text" id="mBaslik" placeholder="Sayfa 42 alıştırmalar"></div>' +
      '<div class="field"><label for="mAciklama">Açıklama</label>' +
      '<textarea id="mAciklama" rows="2" placeholder="Ödevin detayları..."></textarea></div>' +
      '<div class="row2 odev-tarihler">' +
      '<div class="field"><label for="mBasDugme">Başlama tarihi <span class="zorunlu">*</span></label>' +
      tarihAlani('mBas', bugun) + '<label class="gizli-etiket" for="mBasSaat">Başlama saati</label>' + saatAlani('mBasSaat', tsSonrakiYarim()) + '</div>' +
      '<div class="field"><label for="mBitDugme">Son tarih <span class="zorunlu">*</span></label>' +
      tarihAlani('mBit', '', { min: 'mBas' }) + '<label class="gizli-etiket" for="mBitSaat">Son saat</label>' + saatAlani('mBitSaat', '12:00') +
      '</div></div>' +
      '<div class="hint" style="margin:-4px 0 12px">Takvimde her güne düşen tatil, etkinlik ve öteki ödevlerin görünür. ' +
      'Çoğu ödev için son saat 12:00 uygundur.</div>';

    /* Kime gidecek */
    h += '<div class="field" style="margin-bottom:6px">' +
      '<label>Ödev verilecekler</label>' +
      '<div class="secim-ust">' +
      '<button type="button" class="btn gri kucuk" data-act="odev-tumu">Tümünü seç</button>' +
      '<button type="button" class="btn gri kucuk" data-act="odev-hicbiri">Tümünü kaldır</button>' +
      '<span class="secim-sayac" id="odevSayac">0 öğrenci seçili</span>' +
      '</div></div>';

    h += '<div class="hedef-liste">';
    for (var c = 0; c < d.classes.length; c++) {
      var sinif = d.classes[c];
      h += '<div class="hedef-sinif">' +
        '<label class="onay hedef-baslik">' +
        '<input type="checkbox" class="sinif-kutu" data-sinif="' + esc(sinif.id || ('yok' + c)) + '">' +
        '<span><b>' + esc(sinif.name) + '</b> ' +
        '<span class="hedef-adet">' + sinif.students.length + ' öğrenci</span></span></label>' +
        '<div class="hedef-ogrenciler">';
      for (var j = 0; j < sinif.students.length; j++) {
        var o = sinif.students[j];
        h += '<label class="onay hedef-ogrenci">' +
          '<input type="checkbox" class="ogrenci-kutu" value="' + esc(o.id) + '" ' +
          'data-sinif="' + esc(sinif.id || ('yok' + c)) + '">' +
          '<span>' + esc(o.fullName) + '</span></label>';
      }
      h += '</div></div>';
    }
    h += '</div>' + ekAlani('odev', 'odev') + '<div id="mHata" style="margin-top:9px"></div>';

    modalAc('Yeni ödev', h,
      '<button class="btn gri" data-act="modal-kapat">Vazgeç</button>' +
      '<button class="btn" data-act="odev-kaydet">Ödevi ver</button>');

    odevSecimBagla();
    ekAlaniKur('odev');
  });
}

