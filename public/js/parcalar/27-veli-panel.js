/* Veli paneli: çocukların portalına tek tek girmeden hepsinin ödevi,
   devamsızlığı ve ilerleyişi bir arada. Her satırın başında hangi çocuğun
   olduğu yazar; üstteki şeritten tek çocuğa daraltılabilir.

   Sunucuda yeni uç yok: her çocuk için zaten var olan ?studentId=... uçları
   çağrılıp sonuçlar burada birleştirilir. 1-3 çocuk için bu ucuzdur ve veli
   yetkisi sunucuda zaten denetlenir. */

/* ---- VELİ: ortak yardımcılar ---- */
function veliCocuklar() { return S.children || []; }

/* Şu an seçili çocuk (şeritten). Hepsi seçiliyse null. */
function veliSeciliCocuk() {
  var c = veliCocuklar();
  /* Bildirimden gelindiyse o çocuk seçilir (07-yonlendirme.js). */
  if (S.adresCocuk) {
    for (var j = 0; j < c.length; j++) if (c[j].id === S.adresCocuk) S.veliCocuk = S.adresCocuk;
    S.adresCocuk = null;
  }
  if (!S.veliCocuk) return null;
  for (var i = 0; i < c.length; i++) if (c[i].id === S.veliCocuk) return c[i];
  S.veliCocuk = null;
  return null;
}

function cocukRozet(c) {
  return '<span class="cocuk-rozet">' + esc(c.fullName.split(' ')[0]) + '</span>';
}

/* Üst şerit: Hepsi · Zeynep · Burak */
function veliCocukSeridi() {
  var c = veliCocuklar();
  if (c.length < 2) return '';
  var h = '<div class="cocuk-seridi">' +
    '<button class="sekme kucuk' + (S.veliCocuk ? '' : ' secili') + '" data-act="veli-cocuk" data-id="">Hepsi</button>';
  for (var i = 0; i < c.length; i++) {
    h += '<button class="sekme kucuk' + (S.veliCocuk === c[i].id ? ' secili' : '') +
      '" data-act="veli-cocuk" data-id="' + esc(c[i].id) + '">' + esc(c[i].fullName) + '</button>';
  }
  return h + '</div>';
}

/* Her çocuk için aynı ucu çağırır: [{ cocuk, veri }] */
function cocuklarIcin(yol) {
  var secili = veliSeciliCocuk();
  var liste = secili ? [secili] : veliCocuklar();
  return Promise.all(liste.map(function (c) {
    return api(yol + (yol.indexOf('?') >= 0 ? '&' : '?') + 'studentId=' + encodeURIComponent(c.id))
      .then(function (d) { return { cocuk: c, veri: d }; });
  }));
}

function veliCocukYok(baslik) {
  yaz(hero(baslik, '') + bosKutu('veli',
    'Henüz çocuk eklenmedi. Çocuklarım sayfasından veli koduyla ekleyebilirsin.'));
  return Promise.resolve();
}

/* ---- VELİ: ödevler ---- */
SAYFALAR['veli-odevler'] = function () {
  if (!veliCocuklar().length) return veliCocukYok('ÖDEVLER');
  return cocuklarIcin('/progress').then(function (r) {
    var hepsi = [];
    for (var i = 0; i < r.length; i++) {
      var liste = r[i].veri.assignments || [];
      for (var j = 0; j < liste.length; j++) { liste[j].cocuk = r[i].cocuk; hepsi.push(liste[j]); }
    }
    /* Teslim saati geçmiş ama henüz sonuçlanmamış ödev "aktif" sayılmaz. */
    var aktif = hepsi.filter(function (a) { return a.status === 'active' && !teslimGecti(a.endAt, a.endTime); })
      .sort(function (a, b) { return String(a.endAt || '').localeCompare(String(b.endAt || '')); });
    var gecmis = hepsi.filter(function (a) { return a.status !== 'active' || teslimGecti(a.endAt, a.endTime); })
      .sort(function (a, b) { return String(b.endAt || '').localeCompare(String(a.endAt || '')); });

    var h = hero('ÖDEVLER', 'Çocuklarının bütün ödevleri bir arada; her satırda kimin olduğu yazar.');
    h += veliCocukSeridi();
    h += '<h3 class="sb">Aktif ödevler (' + aktif.length + ')</h3>';
    h += aktif.length ? veliOdevListesi(aktif) : bosKutu('onay', 'Şu an açık ödev yok.');
    if (gecmis.length) {
      h += '<h3 class="sb">Geçmiş ödevler (' + gecmis.length + ')</h3>';
      h += veliOdevListesi(gecmis.slice(0, 40));
    }
    yaz(h);
  });
};

function veliOdevListesi(list) {
  var h = '<div class="kart">';
  for (var i = 0; i < list.length; i++) {
    var a = list[i];
    var sag;
    if (a.result && SONUC[a.result]) {
      sag = '<span class="etiket ' + SONUC[a.result].renk + '">' + SONUC[a.result].ad + '</span>';
    } else if (a.status === 'finished') {
      sag = '<span class="etiket gri">Değerlendirilmedi</span>';
    } else sag = kalanEtiketi(a);

    /* Çocuğun henüz açmadığı aktif ödev turuncuya çalar. */
    var acilmadi = a.status === 'active' && a.acildi === false;
    /* Satıra tıklayınca çocuğun bu ödeve yüklediği dosyalar açılır. */
    h += '<div class="satir odev-satir tikla-odev' + (acilmadi ? ' acilmadi' : '') + '"' + (acilmadi ? ' title="Çocuğun bu ödevi henüz açmadı"' : '') +
      ' data-act="veli-teslim" data-id="' + esc(a.id) + '" data-ogrenci="' + esc(a.cocuk.id) + '" data-baslik="' + esc(a.title) + '"' +
      ' data-ara="' + esc(a.cocuk.fullName + ' ' + a.title + ' ' + a.subject) + '">' +
      cocukRozet(a.cocuk) +
      '<div class="buyu"><div class="ad">' + esc(a.title) + '</div>' +
      '<div class="alt">' + esc(a.subject) + ' · ' + esc(a.teacherName) +
      (a.endAt ? ' · son teslim ' + tarihGunSaat(a.endAt, a.endTime) : '') + '</div>' +
      (a.description ? '<div class="alt" style="margin-top:4px">' + esc(a.description) + '</div>' : '') +
      '</div>' + sag + '</div>';
  }
  return h + '</div>';
}

/* ---- VELİ: devamsızlık ---- */
SAYFALAR['veli-devamsizlik'] = function () {
  if (!veliCocuklar().length) return veliCocukYok('DEVAMSIZLIK');
  return cocuklarIcin('/devamsizlik/ogrenci').then(function (r) {
    var h = hero('DEVAMSIZLIK', 'Çocuklarının derse katılım kayıtları.');
    h += veliCocukSeridi();

    /* Çocuk başına özet kartı */
    h += '<div class="grid k3" style="margin-bottom:18px">';
    for (var i = 0; i < r.length; i++) {
      var d = r[i].veri;
      h += '<div class="kart" style="margin:0"><h3>' + esc(r[i].cocuk.fullName) + '</h3>' +
        '<div class="alt-sayim">' +
        '<span><b>' + d.sayim.yok + '</b> gelmedi</span>' +
        '<span><b>' + d.sayim.gec + '</b> geç geldi</span>' +
        '<span><b>' + d.sayim.izinli + '</b> izinli</span></div></div>';
    }
    h += '</div>';

    var kayitlar = [];
    for (var k = 0; k < r.length; k++) {
      var liste = r[k].veri.kayitlar || [];
      for (var j = 0; j < liste.length; j++) { liste[j].cocuk = r[k].cocuk; kayitlar.push(liste[j]); }
    }
    kayitlar.sort(function (a, b) { return String(b.tarih).localeCompare(String(a.tarih)); });

    if (!kayitlar.length) {
      h += bosKutu('onay', 'Hiç devamsızlık kaydı yok. Böyle devam.');
    } else {
      h += '<div class="kart" style="padding:0">';
      for (var m = 0; m < kayitlar.length; m++) {
        var ky = kayitlar[m];
        h += '<div class="satir">' + cocukRozet(ky.cocuk) +
          '<div class="buyu"><div class="ad">' + esc(ky.ders || 'Ders') +
          ' <span class="durum-etiket ' + esc(ky.durum) + '">' + esc(ky.durumAd) + '</span></div>' +
          '<div class="alt">' + esc(ky.tarih) +
          (ky.alan ? ' · ' + esc(ky.alan) : '') +
          (ky.not ? ' · ' + esc(ky.not) : '') + '</div></div></div>';
      }
      h += '</div>';
    }
    yaz(h);
  });
};

/* ---- VELİ: ilerleyiş ---- */
SAYFALAR['veli-ilerleyis'] = function () {
  if (!veliCocuklar().length) return veliCocukYok('İLERLEYİŞ');
  return cocuklarIcin('/progress').then(function (r) {
    var h = hero('İLERLEYİŞ', 'Çocuk çocuk ödev başarısı ve sınav ortalamaları.');
    h += veliCocukSeridi();
    for (var i = 0; i < r.length; i++) {
      h += '<h3 class="sb">' + esc(r[i].cocuk.fullName) + '</h3>';
      h += ilerleyisKartlari(r[i].veri);
    }
    yaz(h);
    ilerleyisGrafikleriniYukle(r.map(function (x) { return x.veri.student.id; }));
  });
};
