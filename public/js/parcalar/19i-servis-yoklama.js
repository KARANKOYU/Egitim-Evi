/* Servisçinin Yoklama sayfası (servisçinin ana sayfası) ve okul yönetiminin
   salt okunur "bugünkü yoklama" görünümü.

   Bugünün dönemini (sabah / akşam) sunucu, okulun servis saatlerine ve
   Türkiye saatine göre verir; telefonun saatine güvenilmez. Aralık dışında
   liste bir sonraki aralığın sırası ve velilerin işaretleriyle görünür,
   işaret düğmeleri çıkmaz.
   - Sabah: Seferi başlat (başlatılmadıysa ilk "Bindi" kendiliğinden başlatır),
     her öğrencide Bindi / Binmedi, en altta Okula vardık (sefer biter).
   - Akşam: okulda Geldi / Gelmedi, sonra Başlat (sefer başlar), "Geldi"
     olanlarda sırayla İndi; herkes inince sefer kendiliğinden biter.
   Her işaret anında tek tek gider; gidemezse satırda "Yeniden dene" çıkar.
   Sıra yukarı / aşağı düğmeleriyle düzenlenir (dış kütüphane yok). Konum
   gönderimi 19e-servis-konum.js'tedir (tarayıcının watchPosition'ı). */

var SY_YENILE_MS = 60000;   // sayfa açıkken veli işaretleri ve dönem değişimi için
var SY_DURUM_AD = { bindi: 'Bindi', binmedi: 'Binmedi', geldi: 'Geldi', gelmedi: 'Gelmedi', indi: 'İndi' };
var SY = { servisId: '', veri: null, gidiyor: {}, hatalar: {}, ucusta: 0, karisik: false, sira: null, harita: null, sayac: null };

/* Çıkışta (26-baslat.js): sonraki kişi öncekinin servisini görmesin. */
function servisYoklamaSifirla() {
  syHaritaKapat();
  SY = { servisId: '', veri: null, gidiyor: {}, hatalar: {}, ucusta: 0, karisik: false, sira: null, harita: null, sayac: null };
}

function syHaritaKapat() {
  if (SY.harita) { SY.harita.yokEt(); SY.harita = null; }
  if (SY.sayac) { clearTimeout(SY.sayac); SY.sayac = null; }
}

function syDonemAdi(donem) { return donem === 'aksam' ? 'Akşam' : 'Sabah'; }
function syDonem(d) { return d.donem || d.listeDonemi; }
/* Açık sefer bu dönemin seferi mi (sabah okula gidiş, akşam eve dönüş)? */
function syDonemSeferi(d) { return d.sefer && d.sefer.donem === syDonem(d) ? d.sefer : null; }
/* CSS seçicisi: [ad="değer"] (değer tırnaklı ve kaçışlı). */
function syNitelik(ad, deger) { return '[' + ad + '=' + JSON.stringify(String(deger)) + ']'; }
function syOgrenci(id) {
  var l = (SY.veri && SY.veri.ogrenciler) || [];
  for (var i = 0; i < l.length; i++) if (l[i].id === id) return l[i];
  return null;
}

function syVeriAl() {
  var adres = function () { return '/servis/yoklama' + (SY.servisId ? '?servisId=' + encodeURIComponent(SY.servisId) : ''); };
  return api(adres())['catch'](function (e) {
    /* Seçili servis artık bu servisçinin değil: ilk servisine dönülür. */
    if (e.durum === 404 && SY.servisId) { SY.servisId = ''; return api(adres()); }
    throw e;
  }).then(function (d) {
    SY.veri = d;
    SY.servisId = d.servis ? d.servis.id : '';
    return d;
  });
}

function servisYoklamaSayfasi() {
  syHaritaKapat();
  SY.gidiyor = {}; SY.hatalar = {}; SY.ucusta = 0; SY.karisik = false;
  return syVeriAl().then(function (d) {
    /* Birden çok servisi olanda servis adı ve plaka aşağıdaki seçicide yazar; üstte okul. */
    var h = hero('YOKLAMA', d.servis && d.servisler.length < 2 ? d.servis.ad + (d.servis.plaka ? ' · ' + d.servis.plaka : '') : (d.okul ? d.okul.ad : ''));
    if (d.servisler.length > 1) {
      h += '<div class="cocuk-seridi sy-servisler">';
      for (var i = 0; i < d.servisler.length; i++) {
        var s = d.servisler[i];
        h += '<button class="sekme kucuk' + (d.servis && d.servis.id === s.id ? ' secili' : '') + '" data-act="sy-servis" data-id="' +
          esc(s.id) + '">' + esc(s.ad) + (s.plaka ? ' · ' + esc(s.plaka) : '') + '</button>';
      }
      h += '</div>';
    }
    if (!d.servis) { yaz(h + bosKutu('servis', d.engel)); return; }
    if (!window.isSecureContext) {
      h += '<div class="msg uyari">Konum yalnızca güvenli (https) bağlantıda gönderilir; yoklama yine de alınır. Okulun sitesine https ile gir.</div>';
    }
    h += '<div id="syUst"></div><div id="syListe"></div><div id="syAlt"></div><div id="syNotlar"></div>' +
      '<div class="kart"><h3>' + ik('harita') + 'Harita</h3><div class="harita-kap" id="syHaritaAlan"></div>' +
      '<div class="hint" style="margin-top:8px">Okul, evi işaretli öğrenciler (sıra numarasıyla) ve sefer sürerken senin yerin.</div></div>';
    yaz(h);
    /* Bu servisin seferi sunucuda kapanmışsa telefonun gönderimi de durur. Sayfa
       yenilenmiş ama sefer açıksa servisçi "sürdür" der (konum izni ister). */
    var sf = syDonemSeferi(d);
    if (S._sefer && S._sefer.servisId === d.servis.id && (!sf || sf.id !== S._sefer.id)) seferiDurdur();
    syBolumleriCiz();
    SY.harita = haritaKur($('syHaritaAlan'), { etiket: 'Servis haritası' });
    seferBenCiz(true);
    syZamanla();
  })['catch'](function (e) {
    if (e.veri && e.veri.ozellikKapali) {
      yaz(hero('YOKLAMA', '') + bosKutu('kilit', 'Servis bölümü okulunda kapalı. Okul müdürü Özellikler sayfasından açabilir.'));
      return;
    }
    throw e;
  });
}

/* Sayfanın bölümleri yeniden çizilir; harita ve kaydırma yeri yerinde kalır. */
function syBolumleriCiz() {
  var d = SY.veri;
  if (!d || !d.servis || !$('syListe')) return;
  /* Klavyeyle gezen kişinin odağı aynı düğmede kalsın. */
  var a = document.activeElement, odak = null;
  if (a && a.getAttribute && a.getAttribute('data-act') && $('sayfa').contains(a)) {
    odak = { act: a.getAttribute('data-act'), id: a.getAttribute('data-id') || '', durum: a.getAttribute('data-durum') || '' };
  }
  $('syUst').innerHTML = syUstHtml(d);
  $('syListe').innerHTML = syListeHtml(d);
  $('syAlt').innerHTML = syAltHtml(d);
  $('syNotlar').innerHTML = syNotlarHtml(d);
  seferDurumCiz();
  if (odak) {
    var b = document.querySelector('#sayfa ' + syNitelik('data-act', odak.act) + (odak.id ? syNitelik('data-id', odak.id) : '') +
      (odak.durum ? syNitelik('data-durum', odak.durum) : ''));
    if (b && !b.disabled) b.focus({ preventScroll: true });
  }
}

/* Tek satır (işaret gönderilirken ve hata gelince). */
function sySatirYenile(id) {
  var el = $('sySatir_' + id), o = syOgrenci(id);
  if (!el || !o) return;
  el.outerHTML = sySatirHtml(o, SY.veri, false);
}

/* İşaret gidip satır yeniden çizilince odak aynı öğrencinin düğmesine döner
   (klavyeyle ve ekran okuyucuyla kullanan kişi yerini kaybetmesin). */
function syOdakla(id, durum) {
  var a = document.activeElement;
  if (a && a !== document.body && $('sayfa').contains(a)) return;
  var k = '#sySatir_' + id;
  var b = document.querySelector(k + ' [data-act="sy-yeniden"]') || document.querySelector(k + ' .sy-dugme' + syNitelik('data-durum', durum) + ':not(:disabled)') ||
    document.querySelector(k + ' .sy-dugme:not(:disabled)');
  if (b) b.focus({ preventScroll: true });
}

/* Sessiz tazeleme: dakikada bir ve bazı işlerden sonra. */
function syTazele() {
  return syVeriAl().then(function () { syBolumleriCiz(); seferBenCiz(); })['catch'](function () { /* sonraki turda */ });
}
function syZamanla() {
  if (SY.sayac) clearTimeout(SY.sayac);
  SY.sayac = setTimeout(function () {
    SY.sayac = null;
    if (S.page !== 'ana' || !$('syListe')) return;
    if (document.hidden || $('modalKok').innerHTML || SY.ucusta > 0) { syZamanla(); return; }
    syTazele().then(syZamanla);
  }, SY_YENILE_MS);
}

/* ---------------- çizim ---------------- */
function sySayilarHtml(d) {
  var n = d.sayilar, donem = syDonem(d);
  /* Bu dönemin yoklaması kapandıysa (sefer bitti ya da saat geçti) işaretsizler artık beklemiyor. */
  var kapali = !!d.donem && !!(d.engel || (d.gun && d.gun.bitti));
  var parca = [[n.toplam, 'öğrenci']];
  if (donem === 'sabah') parca.push([n.bindi, 'bindi'], [n.binmedi, 'binmedi']);
  else parca.push([n.geldi, 'geldi'], [n.gelmedi, 'gelmedi'], [n.indi, 'indi']);
  parca.push([n.bekleyen, kapali ? 'işaretlenmedi' : 'bekliyor'], [n.binmeyecek, 'binmeyecek']);
  return parca.filter(function (p, i) { return i === 0 || p[0] > 0; })
    .map(function (p) { return '<span><b>' + (p[0] || 0) + '</b> ' + p[1] + '</span>'; }).join('');
}

function syUstHtml(d) {
  var donem = syDonem(d);
  var aralik = d.aralik || { bas: d.saatler[donem + 'Bas'], bit: d.saatler[donem + 'Bit'] };
  var h = '<div class="kart sy-ust"><div class="sy-ust-baslik"><b>' + syDonemAdi(donem) + ' yoklaması</b>' +
    '<span class="etiket ' + (d.acik ? 'yesil' : 'gri') + '">' + esc(svBuyukBas(svGunEtiketi(d.tarih))) + ' · ' +
    esc(aralik.bas + '–' + aralik.bit) + '</span></div>';
  if (d.engel) {
    h += '<div class="msg bilgi">' + esc(d.engel) +
      (!d.aralikta && d.sonraki && !d.gun.bitti ? ' Sıradaki: ' + esc(servisSonrakiMetni(d.sonraki)) + '.' : '') + '</div>';
  } else if (d.uzatma) {
    h += '<div class="msg uyari">Servis saati bitti; yoldaki sefer en çok 60 dakika daha sürer. İşaretlemeyi bitir.</div>';
  }
  h += '<div class="sy-sayilar">' + sySayilarHtml(d) + '</div>';
  if (d.acik) h += sySeferHtml(d);
  return h + '</div>';
}

function sySeferHtml(d) {
  var sf = syDonemSeferi(d), donem = syDonem(d);
  var h = '<div class="sy-sefer">';
  if (sf) {
    h += '<div class="sefer-durum" id="seferDurum_' + esc(d.servis.id) + '"></div>';
    if (!(S._sefer && S._sefer.id === sf.id)) {
      h += '<div class="dugme-satir"><button class="btn" data-act="sefer-surdur" data-id="' + esc(sf.id) + '" data-servis="' + esc(d.servis.id) +
        '" data-yon="' + esc(sf.yon) + '">' + ik('konum') + 'Konum göndermeyi sürdür</button></div>';
    }
    h += '<div class="hint">Konum yalnızca bu sayfa açıkken gider: telefonu kilitleme, şarja takılı tut.</div>';
  } else if (donem === 'sabah') {
    h += '<div class="dugme-satir"><button class="btn" data-act="sy-sefer-basla">' + ik('servis') + 'Seferi başlat</button></div>' +
      '<div class="hint">Başlatınca konumun servisteki öğrencilerin velilerine görünür. Başlatmazsan ilk "Bindi" seferi kendiliğinden başlatır.</div>';
  } else if (d.gun.basladi) {
    h += '<div class="dugme-satir"><button class="btn ghost" data-act="sy-sefer-basla">' + ik('konum') + 'Konum paylaşımını yeniden başlat</button></div>' +
      '<div class="hint">Sefer kapalı; konumun velilere görünmüyor. "İndi" işaretleri yine de gider.</div>';
  }
  return h + '</div>';
}

function syListeHtml(d) {
  var donem = syDonem(d);
  var yolda = donem === 'aksam' && d.acik && !!d.gun.basladi;   // kapanınca tek liste
  var aciklama = !d.donem ? 'Sıradaki aralığın listesi: velilerin işaretleri görünür, işaretleme saati gelince açılır.'
    : !d.acik ? 'Bugünün işaretleri.'
      : donem === 'sabah' ? 'Alma sırasıyla. Her öğrencide "Bindi" ya da "Binmedi"ye bas; işaret hemen velisine gider.'
        : yolda ? 'Bırakma sırasıyla. Öğrenciyi evine bırakınca "İndi"ye bas.'
          : 'Okulda servise gelenleri işaretle; bitince aşağıdaki "Başlat"a bas.';
  var h = '<div class="kart sy-liste-kart"><div class="sy-liste-ust"><h3>' + (yolda ? 'Serviste olanlar' : 'Öğrenciler') +
    ' (' + (yolda ? d.sayilar.geldi + d.sayilar.indi : d.ogrenciler.length) + ')</h3>' +
    (d.duzenleyebilir && d.ogrenciler.length > 1 ? '<button class="btn kucuk gri" data-act="sy-sira">Sırayı düzenle</button>' : '') + '</div>' +
    '<div class="sy-aciklama">' + esc(aciklama) + '</div>';
  if (!d.ogrenciler.length) return h + '<div class="hint">Bu serviste öğrenci yok. Öğrencileri okul yönetimi ekler.</div></div>';
  var binen = [], kalan = [];
  for (var i = 0; i < d.ogrenciler.length; i++) {
    var o = d.ogrenciler[i];
    if (!yolda || o.durum === 'geldi' || o.durum === 'indi') binen.push(o); else kalan.push(o);
  }
  if (!binen.length) h += '<div class="hint">Servise binen öğrenci yok.</div>';
  for (var j = 0; j < binen.length; j++) h += sySatirHtml(binen[j], d, false);
  h += '</div>';
  if (kalan.length) {
    h += '<div class="kart sy-liste-kart"><h3>Serviste olmayanlar (' + kalan.length + ')</h3>' +
      '<div class="sy-aciklama">Unutulan öğrenci varsa "Geldi" işaretle; bırakma listesine girer.</div>';
    for (var k = 0; k < kalan.length; k++) h += sySatirHtml(kalan[k], d, false);
    h += '</div>';
  }
  return h;
}

function syDurumEtiketi(o) {
  var r = { bindi: 'yesil', geldi: 'mavi', indi: 'yesil', binmedi: 'kirmizi', gelmedi: 'kirmizi' };
  if (o.durum) return { renk: r[o.durum], metin: SY_DURUM_AD[o.durum] };
  return o.binmeyecek ? { renk: 'gri', metin: 'Binmeyecek' } : { renk: 'gri', metin: 'İşaretlenmedi' };
}

/* Bir öğrenci satırı. salt: yönetimin salt okunur görünümü. */
function sySatirHtml(o, d, salt) {
  var donem = syDonem(d);
  var gidiyor = salt ? '' : SY.gidiyor[o.id] || '', hata = salt ? null : SY.hatalar[o.id];
  var gun = svGunEtiketi(d.tarih);
  var h = '<div class="sy-satir' + (o.binmeyecek && !o.durum ? ' soluk' : '') + (o.durum === 'indi' ? ' bitti' : '') + '"' +
    (salt ? '' : ' id="sySatir_' + esc(o.id) + '"') + '>' +
    '<span class="sy-no" title="Sıra">' + o.sira + '</span><div class="sy-bilgi"><div class="ad">' + esc(o.ad) + '</div>' +
    '<div class="alt">' + [esc(o.sinif), o.durak ? esc(o.durak) : '', !salt && !o.ev ? 'ev işaretli değil' : ''].filter(Boolean).join(' · ') + '</div>';
  var saat = [];
  if (o.bindiSaat && (o.durum === 'bindi' || o.durum === 'geldi' || o.durum === 'indi')) saat.push((donem === 'aksam' ? 'Geldi ' : 'Bindi ') + o.bindiSaat);
  if (o.indiSaat && o.durum === 'indi') saat.push('İndi ' + o.indiSaat);
  if (saat.length) h += '<div class="sy-saat">' + esc(saat.join(' · ')) + '</div>';
  /* Velinin "binmeyecek" işareti: bu dönem için ise satır soluk. */
  var x = o.veliIsareti;
  if (x && (x.sabah || x.aksam)) {
    var buDonem = donem === 'aksam' ? x.aksam : x.sabah;
    h += '<div class="sy-veli">' + ik('uyari') + '<span>Velisi: ' + esc(gun) + ' ' + (buDonem ? '' : (x.sabah ? 'sabah ' : 'akşam ')) +
      'binmeyecek' + (x.not ? ' · ' + esc(x.not) : '') + '</span></div>';
  }
  var notlar = (d.notlar || []).filter(function (n) { return n.ogrenciId === o.id && n.tarih === d.tarih; });
  for (var i = 0; i < notlar.length; i++) h += '<div class="sy-not">' + ik('posta') + '<span>' + (salt ? 'Servisçinin notu: ' : 'Notun: ') + esc(notlar[i].metin) + '</span></div>';
  if (!salt && o.ev) {
    h += '<a class="sy-yol" href="https://www.google.com/maps/dir/?api=1&amp;destination=' + Number(o.ev.enlem).toFixed(6) + ',' +
      Number(o.ev.boylam).toFixed(6) + '" target="_blank" rel="noopener noreferrer">' + ik('harita') + 'Yol tarifi</a>';
  }
  if (hata) {
    h += '<div class="sy-hata" role="alert"><span>' + esc(hata.mesaj) + '</span><button class="btn kucuk" data-act="sy-yeniden" data-id="' +
      esc(o.id) + '" data-durum="' + esc(hata.durum) + '">Yeniden dene</button></div>';
  }
  h += '</div>';

  /* Sağda (telefonda altta): büyük işaret düğmeleri ya da durum. */
  if (!salt && d.acik && o.durum !== 'indi') {
    var yolda = donem === 'aksam' && !!d.gun.basladi;
    var secenek = donem === 'sabah' ? ['bindi', 'binmedi'] : (yolda && o.durum === 'geldi' ? ['indi'] : ['geldi', 'gelmedi']);
    var durum = gidiyor || o.durum;
    h += '<div class="sy-islem"><div class="sy-dugmeler' + (secenek.length === 1 ? ' tek' : '') + '">';
    for (var k = 0; k < secenek.length; k++) {
      var dk = secenek[k], sec = durum === dk;
      h += '<button type="button" class="sy-dugme ' + dk + (sec ? ' secili' : '') + '" data-act="sy-isaret" data-id="' + esc(o.id) +
        '" data-durum="' + dk + '" aria-pressed="' + (sec ? 'true' : 'false') + '"' + (gidiyor ? ' disabled' : '') + '>' +
        (gidiyor === dk ? 'Gönderiliyor...' : (sec ? ik('onay') : '') + SY_DURUM_AD[dk]) + '</button>';
    }
    return h + '</div></div></div>';
  }
  var et = d.donem ? syDurumEtiketi(o) : (o.binmeyecek ? { renk: 'gri', metin: 'Binmeyecek' } : null);
  if (et && o.durum === 'indi' && !salt) et = { renk: 'yesil', metin: 'Eve bırakıldı' };
  return h + '<div class="sy-islem">' + (et ? '<span class="etiket ' + et.renk + '">' + esc(et.metin) + '</span>' : '') + '</div></div>';
}

function syAltHtml(d) {
  if (!d.acik) return '';
  if (d.donem === 'sabah') {
    return '<div class="kart sy-alt"><button class="btn sy-buyuk" data-act="sy-okula-vardik">' + ik('okul') + 'Okula vardık</button>' +
      '<div class="hint">Sefer biter; servise binen öğrencilerin velilerine "okula vardı" bildirimi gider. ' +
      'Bindi ve Binmedi buna kadar değiştirilebilir.</div></div>';
  }
  if (!d.gun.basladi) {
    var bekleyen = d.ogrenciler.filter(function (o) { return !o.durum; }).length;
    return '<div class="kart sy-alt"><button class="btn sy-buyuk" data-act="sy-sefer-basla">' + ik('servis') + 'Başlat</button>' +
      '<div class="hint">' + (bekleyen ? bekleyen + ' öğrenci henüz işaretlenmedi. ' : '') +
      'Başlatınca sefer başlar ve konumun velilere görünür; "Geldi" olanlar bırakma sırasıyla listelenir.</div></div>';
  }
  var sf = syDonemSeferi(d), serviste = d.sayilar.geldi;
  return '<div class="kart sy-alt"><div class="hint">' + (serviste ? serviste + ' öğrenci serviste. Hepsi inince sefer kendiliğinden biter.'
    : 'Serviste öğrenci kalmadı.') + '</div>' +
    (sf ? '<div class="dugme-satir" style="justify-content:center"><button class="btn kucuk gri" data-act="sefer-bitir" data-id="' +
      esc(sf.id) + '">Seferi bitir</button></div>' : '') + '</div>';
}

function syNotlarHtml(d) {
  var h = '<div class="kart sy-notlar"><div class="sy-liste-ust"><h3>' + ik('posta') + 'Notlar</h3>' +
    (d.duzenleyebilir ? '<button class="btn kucuk ghost" data-act="sy-not-yaz">Not yaz</button>' : '') + '</div>';
  if (!d.notlar.length) {
    h += '<div class="sy-aciklama">' + (d.duzenleyebilir ? 'Velilere tarihli not yazabilirsin ("Yarın 07:35\'te hazır ol."); velisine bildirim gider.'
      : 'Servisçinin notu yok.') + '</div>';
  }
  for (var i = 0; i < d.notlar.length; i++) {
    var n = d.notlar[i];
    h += '<div class="satir"><div class="buyu"><div class="ad">' + esc(n.genel ? 'Bütün servise' : n.ogrenciAd) +
      ' <span class="etiket gri">' + esc(svGunEtiketi(n.tarih)) + '</span></div><div class="sy-not-metin">' + esc(n.metin) + '</div></div>' +
      (d.duzenleyebilir ? '<button class="btn kucuk gri" data-act="sy-not-sil" data-id="' + esc(n.id) + '">Sil</button>' : '') + '</div>';
  }
  h += '</div>';
  if (d.binmeyecekler.length) {
    h += '<div class="kart"><h3>' + ik('takvim') + 'Velilerin "binmeyecek" işaretleri</h3>';
    for (var j = 0; j < d.binmeyecekler.length; j++) {
      var b = d.binmeyecekler[j];
      h += '<div class="satir"><div class="buyu"><div class="ad">' + esc(b.ad) + '</div><div class="alt">' +
        esc(svBuyukBas(svGunEtiketi(b.tarih)) + ' ' + svIsaretDonemi(b) + ' binmeyecek') + (b.not ? ' · ' + esc(b.not) : '') + '</div></div></div>';
    }
    h += '</div>';
  }
  return h;
}

/* Haritada okul, evler (sıra numarasıyla) ve sefer sürerken servisçinin yeri. */
function seferBenCiz(sigdir) {
  var d = SY.veri;
  if (!d || !d.servis || !SY.harita || !$('syHaritaAlan')) return;
  var l = [];
  if (d.okul && d.okul.enlem !== null && d.okul.enlem !== undefined) l.push({ tur: 'okul', enlem: d.okul.enlem, boylam: d.okul.boylam, etiket: 'Okul' });
  for (var i = 0; i < d.ogrenciler.length; i++) {
    var o = d.ogrenciler[i];
    if (o.ev) l.push({ tur: 'ev', enlem: o.ev.enlem, boylam: o.ev.boylam, etiket: o.sira + '. ' + svIlkAd(o.ad) });
  }
  if (S._sefer && S._sefer.son && S._sefer.servisId === d.servis.id) {
    l.push({ tur: 'ben', enlem: S._sefer.son.enlem, boylam: S._sefer.son.boylam, etiket: 'Sen' });
  }
  SY.harita.isaretler(l);
  if (sigdir) SY.harita.sigdir();
}

/* Konum gönderimini başlatır; bu bağlantıda konum yoksa false. */
function syKonumBaslat(sf) {
  if (!window.isSecureContext || !navigator.geolocation) return false;
  try { seferIzlemeyiBaslat(sf); return true; } catch (e) { return false; }
}

/* ---------------- eylemler ---------------- */
EYLEMLER['sy-servis'] = function (el, id) {
  SY.servisId = id;
  return servisYoklamaSayfasi();
};

/* Tek işaret anında gider. Aynı anda birden çok işaret gidiyorsa her cevap
   yalnız kendi satırını günceller; hepsi bitince liste sunucudan tazelenir
   (cevapların sırası karışabilir). */
function syIsaretGonder(id, durum) {
  var d = SY.veri, o = syOgrenci(id);
  if (!d || !d.servis || !o || SY.gidiyor[id]) return;
  if (o.durum === durum && !SY.hatalar[id]) return;
  var servisId = d.servis.id, donem = d.donem;
  var a = document.activeElement, odakta = !!(a && a.getAttribute && a.getAttribute('data-id') === id);
  SY.gidiyor[id] = durum;
  delete SY.hatalar[id];
  SY.ucusta++;
  if (SY.ucusta > 1) SY.karisik = true;
  sySatirYenile(id);
  var bitir = function () {
    SY.ucusta = Math.max(0, SY.ucusta - 1);
    delete SY.gidiyor[id];
  };
  return api('/servis/yoklama', 'POST', { servisId: servisId, ogrenciId: id, durum: durum, donem: donem }).then(function (r) {
    bitir();
    if (!SY.veri || !SY.veri.servis || SY.veri.servis.id !== servisId) return;   // bu arada başka servise geçildi
    if (r.sefer) syKonumBaslat({ id: r.sefer.id, servisId: servisId, yon: r.sefer.yon });
    if (r.bitti && S._sefer && S._sefer.servisId === servisId) seferiDurdur();
    if (SY.ucusta > 0) {
      o.durum = durum;
      sySatirYenile(id);
      if (odakta) syOdakla(id, durum);
      return;
    }
    SY.veri = r.yoklama;
    syBolumleriCiz();
    seferBenCiz();
    if (odakta) syOdakla(id, durum);
    if (SY.karisik) { SY.karisik = false; syTazele(); }
    if (r.bitti) sayfaMesaji('iyi', r.message);
    else if (r.sefer) sayfaMesaji('iyi', 'Sefer başladı; konumun servisteki öğrencilerin velilerine görünüyor.');
  })['catch'](function (e) {
    bitir();
    var v = e.veri || {};
    if (e.durum === 409 && (v.donemDegisti || v.aralikDisi || v.kapandi)) {
      /* Dönem değişti ya da yoklama kapandı: sayfa sunucudan yeniden gelir. */
      if (S.page === 'ana' && $('syListe')) return servisYoklamaSayfasi().then(function () { sayfaMesaji('bilgi', e.message); });
      return;
    }
    SY.hatalar[id] = { durum: durum, mesaj: e.durum ? e.message : 'Gönderilemedi: internet bağlantısı yok.' };
    sySatirYenile(id);
    if (odakta) syOdakla(id, durum);
    if (!SY.ucusta && SY.karisik) { SY.karisik = false; syTazele(); }
  });
}

EYLEMLER['sy-isaret'] = function (el, id) { return syIsaretGonder(id, el.getAttribute('data-durum')); };
EYLEMLER['sy-yeniden'] = function (el, id) { return syIsaretGonder(id, el.getAttribute('data-durum')); };

/* Sabah "Seferi başlat", akşam "Başlat" (ya da konum paylaşımını yeniden başlat). */
EYLEMLER['sy-sefer-basla'] = function (el) {
  var d = SY.veri;
  if (!d || !d.servis) return;
  if (d.donem === 'aksam' && !d.gun.basladi) {
    var eksik = d.ogrenciler.filter(function (o) { return !o.durum; })
      .map(function (o) { return svIlkAd(o.ad) + (o.binmeyecek ? ' (velisi: binmeyecek)' : ''); });
    if (eksik.length && !confirm(eksik.length + ' öğrenci işaretlenmedi: ' + eksik.join(', ') + '.\n' +
      '"Geldi" işaretlenmeyen öğrenci bırakma listesine girmez. Yine de başlatılsın mı?')) return;
    var geldi = d.ogrenciler.filter(function (o) { return o.durum === 'geldi'; }).length;
    if (!eksik.length && !geldi && d.ogrenciler.length && !confirm('Servise binen ("Geldi") öğrenci yok. Yine de başlatılsın mı?\n' +
      'Sefer kendiliğinden bitmez; bitince "Seferi bitir"e basarsın.')) return;
  } else if (d.donem === 'sabah' && (!window.isSecureContext || !navigator.geolocation)) {
    hataGoster(new Error('Bu bağlantıda konum alınamıyor. Okulun sitesine https ile gir.'));
    return;
  }
  var servisId = d.servis.id;
  dugmeBekle(el, 'Başlatılıyor...');
  return api('/servis/sefer-basla', 'POST', { servisId: servisId }).then(function (r) {
    var konum = syKonumBaslat({ id: r.sefer.id, servisId: servisId, yon: r.sefer.yon });
    return servisYoklamaSayfasi().then(function () {
      sayfaMesaji(konum ? 'iyi' : 'uyari', r.message + (konum ? '' : ' Bu bağlantıda konum gönderilemiyor (https gerekir); yoklama yine de sürer.'));
    });
  })['catch'](function (e) {
    dugmeBitir(el);
    if (e.durum === 409) return servisYoklamaSayfasi().then(function () { sayfaMesaji('bilgi', e.message); });
    hataGoster(e);
  });
};

EYLEMLER['sy-okula-vardik'] = function (el) {
  var d = SY.veri;
  if (!d || !d.servis) return;
  var bekleyen = d.ogrenciler.filter(function (o) { return !o.durum && !o.binmeyecek; }).length;
  if (!confirm((bekleyen ? bekleyen + ' öğrenci işaretlenmedi. ' : '') + 'Okula varıldı mı? Sefer biter; servise binen öğrencilerin ' +
    'velilerine "okula vardı" bildirimi gider. Sonra işaretler değiştirilemez.')) return;
  var servisId = d.servis.id;
  dugmeBekle(el, 'Kaydediliyor...');
  return api('/servis/okula-vardik', 'POST', { servisId: servisId }).then(function (r) {
    if (S._sefer && S._sefer.servisId === servisId) seferiDurdur();
    SY.veri = r.yoklama;
    syBolumleriCiz();
    seferBenCiz();
    window.scrollTo(0, 0);
    sayfaMesaji('iyi', r.message);
  })['catch'](function (e) {
    dugmeBitir(el);
    if (e.durum === 409) return servisYoklamaSayfasi().then(function () { sayfaMesaji('bilgi', e.message); });
    hataGoster(e);
  });
};

/* ---------------- sırayı düzenle ---------------- */
function sySiraListesi(d, donem) {
  var alan = donem === 'aksam' ? 'siraAksam' : 'siraSabah';
  return d.ogrenciler.slice().sort(function (a, b) {
    return (a[alan] || 1e9) - (b[alan] || 1e9) || String(a.ad).localeCompare(String(b.ad), 'tr');
  }).map(function (o) { return o.id; });
}

EYLEMLER['sy-sira'] = function () {
  var d = SY.veri;
  if (!d || !d.servis) return;
  var donem = syDonem(d);
  SY.sira = { servisId: d.servis.id, donem: donem, liste: sySiraListesi(d, donem), degisti: false };
  modalAc('Sırayı düzenle', '<div id="sySiraGovde"></div>',
    '<button class="btn gri" data-act="modal-kapat">Vazgeç</button><button class="btn" data-act="sy-sira-kaydet">Kaydet</button>');
  sySiraCiz(null);
};

function sySiraCiz(odak) {
  var s = SY.sira, d = SY.veri;
  if (!s || !d || !$('sySiraGovde')) return;
  var kim = {};
  for (var i = 0; i < d.ogrenciler.length; i++) kim[d.ogrenciler[i].id] = d.ogrenciler[i];
  var h = '<div class="sekme-satir">' +
    '<button class="sekme kucuk' + (s.donem === 'sabah' ? ' secili' : '') + '" data-act="sy-sira-donem" data-donem="sabah">Sabah (alma)</button>' +
    '<button class="sekme kucuk' + (s.donem === 'aksam' ? ' secili' : '') + '" data-act="sy-sira-donem" data-donem="aksam">Akşam (bırakma)</button></div>' +
    '<div class="hint" style="margin:10px 0 6px">Öğrenciyi okla yukarı ya da aşağı taşı, sonra kaydet. Veli "5. sırada, önünde 2 öğrenci" görür.</div>' +
    '<ol class="sy-sira-liste">';
  for (var j = 0; j < s.liste.length; j++) {
    var o = kim[s.liste[j]];
    if (!o) continue;
    h += '<li class="sy-sira-satir"><span class="sy-no">' + (j + 1) + '</span><div class="buyu"><div class="ad">' + esc(o.ad) + '</div>' +
      (o.durak ? '<div class="alt">' + esc(o.durak) + '</div>' : '') + '</div>' +
      '<button type="button" class="btn kucuk gri sy-ok" data-act="sy-sira-yukari" data-id="' + esc(o.id) + '" aria-label="' + esc(o.ad) +
      ' bir yukarı"' + (j === 0 ? ' disabled' : '') + '><span class="yon-yukari">' + ik('geri') + '</span></button>' +
      '<button type="button" class="btn kucuk gri sy-ok" data-act="sy-sira-asagi" data-id="' + esc(o.id) + '" aria-label="' + esc(o.ad) +
      ' bir aşağı"' + (j === s.liste.length - 1 ? ' disabled' : '') + '><span class="yon-asagi">' + ik('geri') + '</span></button></li>';
  }
  h += '</ol><div id="sySiraMesaj"></div>';
  $('sySiraGovde').innerHTML = h;
  if (odak) {
    var b = document.querySelector('#sySiraGovde ' + syNitelik('data-act', odak.act) + syNitelik('data-id', odak.id));
    if (b && b.disabled) {
      b = document.querySelector('#sySiraGovde ' + syNitelik('data-act', odak.act === 'sy-sira-yukari' ? 'sy-sira-asagi' : 'sy-sira-yukari') +
        syNitelik('data-id', odak.id));
    }
    if (b && !b.disabled) b.focus();
  }
}

function sySiraTasi(id, yon, act) {
  var l = SY.sira && SY.sira.liste;
  if (!l) return;
  var i = l.indexOf(id), j = i + yon;
  if (i < 0 || j < 0 || j >= l.length) return;
  l[i] = l[j];
  l[j] = id;
  SY.sira.degisti = true;
  sySiraCiz({ act: act, id: id });
}
EYLEMLER['sy-sira-yukari'] = function (el, id) { sySiraTasi(id, -1, 'sy-sira-yukari'); };
EYLEMLER['sy-sira-asagi'] = function (el, id) { sySiraTasi(id, 1, 'sy-sira-asagi'); };

EYLEMLER['sy-sira-donem'] = function (el) {
  var donem = el.getAttribute('data-donem');
  if (!SY.sira || donem === SY.sira.donem) return;
  if (SY.sira.degisti && !confirm('Bu sıradaki değişiklik kaydedilmedi. Yine de geçilsin mi?')) return;
  SY.sira = { servisId: SY.sira.servisId, donem: donem, liste: sySiraListesi(SY.veri, donem), degisti: false };
  sySiraCiz(null);
};

EYLEMLER['sy-sira-kaydet'] = function (el) {
  var s = SY.sira;
  if (!s) return;
  dugmeBekle(el, 'Kaydediliyor...');
  return api('/servis/sira', 'POST', { servisId: s.servisId, donem: s.donem, sira: s.liste }).then(function (r) {
    modalKapat();
    SY.sira = null;
    return syTazele().then(function () { sayfaMesaji('iyi', r.message); });
  })['catch'](function (e) { dugmeBitir(el); mesajGoster('sySiraMesaj', 'hata', e.message); });
};

/* ---------------- notlar ---------------- */
EYLEMLER['sy-not-yaz'] = function () {
  var d = SY.veri;
  if (!d || !d.servis) return;
  var kime = '<option value="">Bütün servis (bütün velilere)</option>';
  for (var i = 0; i < d.ogrenciler.length; i++) {
    kime += '<option value="' + esc(d.ogrenciler[i].id) + '">' + esc(d.ogrenciler[i].ad) + '</option>';
  }
  var gunler = '';
  for (var g = 0; g <= 7; g++) {
    var t = svTrGun(g);
    gunler += '<option value="' + t + '">' + esc((g === 0 ? 'Bugün · ' : g === 1 ? 'Yarın · ' : '') + svGunAdi(t)) + '</option>';
  }
  var h = '<div class="field"><label for="snKime">Kime?</label><select id="snKime">' + kime + '</select></div>' +
    '<div class="field"><label for="snTarih">Hangi gün için?</label><select id="snTarih">' + gunler + '</select></div>' +
    '<div class="field"><label for="snMetin">Not</label><textarea id="snMetin" rows="3" maxlength="200" ' +
    'placeholder="ör. Yarın 07:35\'te hazır ol."></textarea>' +
    '<div class="hint"><span id="snSayac">0</span>/200 · Velisine bildirim gider; not o günün listesinde de görünür.</div></div>' +
    '<div id="snMesaj"></div>';
  modalAc('Velilere not', h, '<button class="btn gri" data-act="modal-kapat">Vazgeç</button><button class="btn" data-act="sy-not-kaydet">Gönder</button>');
  $('snMetin').oninput = function () { $('snSayac').textContent = this.value.length; };
  $('snMetin').focus();
};

EYLEMLER['sy-not-kaydet'] = function (el) {
  var d = SY.veri;
  if (!d || !d.servis) return;
  var metin = $('snMetin').value.trim();
  if (!metin) { mesajGoster('snMesaj', 'hata', 'Notu yaz (en çok 200 harf).'); return; }
  var tarih = $('snTarih').value;
  dugmeBekle(el, 'Gönderiliyor...');
  return api('/servis/not', 'POST', { servisId: d.servis.id, ogrenciId: $('snKime').value || undefined,
    tarih: tarih === svTrGun(0) ? '' : tarih, metin: metin }).then(function (r) {
    modalKapat();
    return syTazele().then(function () { sayfaMesaji('iyi', r.message); });
  })['catch'](function (e) { dugmeBitir(el); mesajGoster('snMesaj', 'hata', e.message); });
};

EYLEMLER['sy-not-sil'] = function (el, id) {
  if (!confirm('Not silinsin mi? Velilerin ekranından da kalkar.')) return;
  el.disabled = true;
  return api('/servis/not-sil', 'POST', { id: id }).then(function (r) {
    return syTazele().then(function () { sayfaMesaji('iyi', r.message); });
  })['catch'](function (e) { el.disabled = false; hataGoster(e); });
};

/* ---------------- yönetim: salt okunur ---------------- */
function syYonetimGorunumu(d) {
  if (!d.servis) return '<div class="msg bilgi">' + esc(d.engel) + '</div>';
  var donem = syDonem(d);
  var aralik = d.aralik || { bas: d.saatler[donem + 'Bas'], bit: d.saatler[donem + 'Bit'] };
  var h = '<div class="sy-yonetim"><div class="sy-ust-baslik"><b>' + syDonemAdi(donem) + ' yoklaması</b>' +
    '<span class="etiket gri">' + esc(svBuyukBas(svGunEtiketi(d.tarih))) + ' · ' + esc(aralik.bas + '–' + aralik.bit) + '</span></div>';
  if (!d.donem) {
    h += '<div class="msg bilgi">Şu an servis saati değil (' + esc(servisAralikMetni(d.saatler)) + '). Aşağıda sıradaki aralığın listesi ve ' +
      'velilerin işaretleri var.</div>';
  } else {
    var gun = [];
    if (d.gun.basladiSaat) gun.push('Sefer başladı: ' + d.gun.basladiSaat);
    if (d.gun.bittiSaat) gun.push((donem === 'sabah' ? 'Okula varış: ' : 'Yoklama bitti: ') + d.gun.bittiSaat);
    h += '<div class="msg bilgi">Salt okunur: işaretleri servisçi koyar.' + (gun.length ? ' ' + esc(gun.join(' · ')) + '.' : '') + '</div>';
  }
  h += '<div class="sy-sayilar">' + sySayilarHtml(d) + '</div>';
  if (!d.ogrenciler.length) h += '<div class="hint" style="margin-top:10px">Bu serviste öğrenci yok.</div>';
  for (var i = 0; i < d.ogrenciler.length; i++) h += sySatirHtml(d.ogrenciler[i], d, true);
  var genel = (d.notlar || []).filter(function (n) { return n.genel; });
  for (var j = 0; j < genel.length; j++) {
    h += '<div class="sy-not">' + ik('posta') + '<span>Servisçinin notu (' + esc(svGunEtiketi(genel[j].tarih)) + '): ' + esc(genel[j].metin) + '</span></div>';
  }
  return h + '</div>';
}
