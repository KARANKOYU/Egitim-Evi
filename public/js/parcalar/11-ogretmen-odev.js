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

/* Sınıf kutusu tüm öğrencilerini seçer; öğrenciler değişince sınıf kutusu güncellenir. */
function odevSecimBagla() {
  var sinifKutulari = document.querySelectorAll('.sinif-kutu');
  var ogrenciKutulari = document.querySelectorAll('.ogrenci-kutu');

  function sayaciYenile() {
    var n = document.querySelectorAll('.ogrenci-kutu:checked').length;
    var e = $('odevSayac');
    if (e) e.textContent = n + ' öğrenci seçili';

    /* Sınıf kutusu: hepsi seçiliyse dolu, bir kısmı seçiliyse belirsiz */
    for (var i = 0; i < sinifKutulari.length; i++) {
      var sid = sinifKutulari[i].getAttribute('data-sinif');
      var hepsi = document.querySelectorAll('.ogrenci-kutu[data-sinif="' + sid + '"]');
      var secili = document.querySelectorAll('.ogrenci-kutu[data-sinif="' + sid + '"]:checked');
      sinifKutulari[i].checked = hepsi.length > 0 && secili.length === hepsi.length;
      sinifKutulari[i].indeterminate = secili.length > 0 && secili.length < hepsi.length;
    }
  }

  for (var i = 0; i < sinifKutulari.length; i++) {
    (function (kutu) {
      kutu.onchange = function () {
        var sid = kutu.getAttribute('data-sinif');
        var liste = document.querySelectorAll('.ogrenci-kutu[data-sinif="' + sid + '"]');
        for (var j = 0; j < liste.length; j++) liste[j].checked = kutu.checked;
        sayaciYenile();
      };
    })(sinifKutulari[i]);
  }
  for (var k = 0; k < ogrenciKutulari.length; k++) {
    ogrenciKutulari[k].onchange = sayaciYenile;
  }
  sayaciYenile();
}

/* Ödev kontrolü: üstte ödevin adı, altında konusu, altında ödevin
   verildiği öğrenciler alt alta. Her öğrencinin yanındaki kutuya
   tıklayınca sonuç seçilir: Yaptı, Geç yaptı, Eksik, Yapmadı,
   Gelmedi (izinli), Gelmedi (izinsiz). */
var ODEV_SONUC_SIRA = ['yapti', 'gec', 'eksik', 'yapmadi', 'izinli', 'gelmedi'];

function odevAc(id) {
  return api('/assignments/' + id).then(function (d) {
    var a = d.assignment;
    S._acikOdev = a;
    S._acikOdevEkleri = d.ekler || [];
    var acan = d.students.filter(function (s) { return s.acilma; }).length;

    var h = '<div class="odev-bas">' +
      '<h1 class="odev-ad">' + esc(a.title) + '</h1>' +
      '<div class="odev-konu"><span>Konusu</span>' + (a.description ? esc(a.description) : esc(a.subject)) + '</div>' +
      '<div class="odev-meta">' + esc(a.subject) + ' · ' +
      (a.endAt ? 'son teslim ' + tarihGunSaat(a.endAt, a.endTime) : 'süresiz') + ' · ' +
      d.students.length + ' öğrenci · ' + acan + ' kişi açtı</div>' + ekListesiGoster(d.ekler) + '</div>';

    /* Teslim tarihi geçmiş ya da sonuçlanmış olsa da sonuçlar değiştirilebilir;
       öğretmen bunu bilmezse ekranı salt okunur sanıyor. */
    if (a.status === 'finished' || teslimGecti(a.endAt, a.endTime)) {
      h += '<div class="msg bilgi">Bu ödevin süresi doldu' +
        (a.status === 'finished' ? ' ve sonuçlandırıldı' : '') +
        '. Sonuçları yine de değiştirip yeniden kaydedebilirsin.</div>';
    }

    h += '<div class="kart odev-kontrol">' +
      '<div class="ok-ust"><h3>Öğrenciler</h3>' +
      '<button class="btn kucuk gri" data-act="sonuc-hepsi" data-val="yapti">Seçilmemişlerin hepsi: Yaptı</button></div>';
    for (var i = 0; i < d.students.length; i++) {
      var s = d.students[i];
      /* "Ödev 20.05.2026 16:20 tarihinde açıldı" ya da "Ödev açılmadı" */
      var acilma = s.acilma
        ? '<div class="acilma-yazi">Ödev ' + tarihSaat(s.acilma) + ' tarihinde açıldı</div>'
        : '<div class="acilma-yazi acilmadi">Ödev açılmadı</div>';
      var secenek = '<option value="">— Seç —</option>';
      for (var j = 0; j < ODEV_SONUC_SIRA.length; j++) {
        var k = ODEV_SONUC_SIRA[j];
        secenek += '<option value="' + k + '"' + (s.result === k ? ' selected' : '') + '>' + SONUC[k].ad + '</option>';
      }
      h += '<div class="satir ok-satir" data-ara="' + esc(s.fullName) + '">' +
        '<span class="ok-sira">' + (i + 1) + '</span>' +
        '<div class="buyu"><div class="ad">' + esc(s.fullName) + '</div>' + acilma + '</div>' +
        '<select class="sonuc-kutu" data-sid="' + esc(s.id) + '" data-deger="' + esc(s.result || '') + '" ' +
        'aria-label="' + esc(s.fullName) + ' sonucu">' + secenek + '</select></div>';
    }
    h += '<div class="ok-sayim" id="okSayim"></div></div>';

    var sonuclar = yetkim('odev.sonuclandir');
    h += '<div class="sinav-alt">' +
      (sonuclar ? '<button class="btn" data-act="odev-bitir" data-id="' + esc(a.id) + '">' +
        (a.status === 'finished' ? 'Değişiklikleri kaydet' : 'Sonuçlandır ve kaydet') + '</button>' : '') +
      (sonuclar && a.status === 'finished' ? '<button class="btn gri" data-act="odev-tekrar" data-id="' + esc(a.id) + '">Tekrar aç</button>' : '') +
      (yetkim('odev.ver') ? '<button class="btn ghost" data-act="odev-duzelt">Ödevi düzenle</button>' : '') +
      '<button class="btn gri" data-nav="ogr-odevler">Geri dön</button></div>';

    S._sonuclar = {};
    yaz(h);
    odevSayimYaz();
    ogretmenTeslimleri(a.id, a.title);
  });
}

/* Altta canlı sayım: "Yaptı 12 · Geç yaptı 2 · ... · Seçilmemiş 3" */
function odevSayimYaz() {
  var kutular = document.querySelectorAll('.sonuc-kutu');
  var sayim = {}, bos = 0;
  for (var i = 0; i < kutular.length; i++) {
    var v = kutular[i].value;
    if (v) sayim[v] = (sayim[v] || 0) + 1; else bos++;
  }
  var parca = [];
  for (var j = 0; j < ODEV_SONUC_SIRA.length; j++) {
    var k = ODEV_SONUC_SIRA[j];
    if (sayim[k]) parca.push('<span class="etiket ' + SONUC[k].renk + '">' + SONUC[k].ad + ' ' + sayim[k] + '</span>');
  }
  if (bos) parca.push('<span class="etiket gri">Seçilmemiş ' + bos + '</span>');
  var kap = $('okSayim');
  if (kap) kap.innerHTML = parca.join(' ');
}

/* Kutu değişince: rengi güncellenir, kaydedilecekler listesine yazılır.
   Boş seçim ("— Seç —") kaydedilince eski sonucu kaldırır. */
document.addEventListener('change', function (ev) {
  var t = ev.target;
  if (!t.classList || !t.classList.contains('sonuc-kutu')) return;
  t.setAttribute('data-deger', t.value);
  S._sonuclar = S._sonuclar || {};
  S._sonuclar[t.getAttribute('data-sid')] = t.value;
  odevSayimYaz();
});

EYLEMLER['sonuc-hepsi'] = function (el) {
  var deger = el.getAttribute('data-val');
  var kutular = document.querySelectorAll('.sonuc-kutu');
  S._sonuclar = S._sonuclar || {};
  for (var i = 0; i < kutular.length; i++) {
    if (kutular[i].value) continue;
    kutular[i].value = deger;
    kutular[i].setAttribute('data-deger', deger);
    S._sonuclar[kutular[i].getAttribute('data-sid')] = deger;
  }
  odevSayimYaz();
};

EYLEMLER['odev-duzelt-kaydet'] = function (el, id) {
  var kok = $('modalGovde');
  formHatalariniSil(kok);
  var g = { title: $('odBaslik').value.trim(), description: $('odAciklama').value.trim(),
    startAt: $('odBas').value, startTime: $('odBasSaat').value, endAt: $('odBit').value, endTime: $('odSaat').value || '12:00',
    ekIdler: ekIdleri('odevDuzelt'), ekSilIdler: ekSilinecekler('odevDuzelt') };
  if (ekYukleniyor('odevDuzelt')) { mesajGoster('odMesaj', 'uyari', 'Dosyalar yükleniyor; bitince kaydet.'); return; }
  if (!g.title) alanHatasi('odBaslik', 'Ödevin adını yaz.');
  if (g.startAt && g.endAt && g.endAt < g.startAt) alanHatasi('odBit', 'Son tarih başlangıçtan önce olamaz.');
  if (kok.querySelector('.hatali')) { ilkHatayaGit(kok); return; }
  dugmeBekle(el, 'Kaydediliyor...');
  return api('/assignments/' + id + '/update', 'POST', g).then(function (d) {
    modalKapat();
    return odevAc(id).then(function () { sayfaMesaji('iyi', d.message); });
  })['catch'](function (e) { dugmeBitir(el); mesajGoster('odMesaj', 'hata', e.message); });
};
