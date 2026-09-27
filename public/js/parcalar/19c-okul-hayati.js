/* Okul hayatı: yemek listesi, servis, kulüpler.
   Kim neyi görür ve düzenler sunucuda belirlenir; buradaki düğmeler yalnızca
   sunucunun "yapabilirsin" dediği kişiye çizilir. */

/* ================= yemek listesi ================= */
var YEMEK_GUN = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'];

function gunEkleYerel(gun, n) {
  var d = new Date(gun + 'T12:00:00Z');
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}
function gunKisa(gun) {
  var d = new Date(gun + 'T12:00:00Z');
  return d.getUTCDate() + ' ' + AY_ADI[d.getUTCMonth()];
}
function bugunYerel() {
  var d = new Date(), p = function (n) { return n < 10 ? '0' + n : '' + n; };
  return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate());
}

SAYFALAR.yemek = function () {
  return api('/yemek' + (S.yemekBas ? '?bas=' + S.yemekBas : '')).then(function (d) {
    S.yemekVeri = d;
    var h = hero('YEMEK LİSTESİ', 'Okulun haftalık menüsü.');
    h += '<div class="kart hafta-gezgin">' +
      '<button class="btn kucuk gri" data-act="yemek-hafta" data-bas="' + gunEkleYerel(d.bas, -7) + '">' + ik('geri') + 'Önceki<span class="genis"> hafta</span></button>' +
      '<b>' + gunKisa(d.bas) + ' – ' + gunKisa(d.bit) + '</b>' +
      '<button class="btn kucuk gri" data-act="yemek-hafta" data-bas="' + gunEkleYerel(d.bas, 7) + '">Sonraki<span class="genis"> hafta</span></button></div>';

    if (!d.okullar.length) { yaz(h + bosKutu('yemek', 'Bağlı olduğun bir okul yok.')); return; }

    var bugun = bugunYerel();
    for (var o = 0; o < d.okullar.length; o++) {
      var okul = d.okullar[o], gunler = {};
      for (var g = 0; g < okul.gunler.length; g++) gunler[okul.gunler[g].tarih] = okul.gunler[g];
      if (d.okullar.length > 1 || !S.user.schoolId) h += '<h3 class="sb">' + esc(okul.ad) + '</h3>';
      h += '<div class="yemek-hafta">';
      for (var i = 0; i < 7; i++) {
        var tarih = gunEkleYerel(d.bas, i), y = gunler[tarih];
        if (i >= 5 && !y) continue;   // hafta sonu menü yoksa gösterme
        h += '<div class="yemek-gun' + (tarih === bugun ? ' bugun' : '') + '">' +
          '<div class="yemek-gun-ust"><b>' + YEMEK_GUN[i] + '</b><span>' + gunKisa(tarih) + '</span></div>' +
          (y ? '<ul>' + y.menu.split('\n').map(function (s) { return '<li>' + esc(s) + '</li>'; }).join('') + '</ul>' +
            (y.kalori ? '<div class="alt">' + y.kalori + ' kcal</div>' : '')
            : '<div class="alt">Menü girilmedi</div>') + '</div>';
      }
      h += '</div>';
    }
    if (d.duzenleyebilir) {
      h += '<div style="margin-top:14px"><button class="btn" data-act="yemek-duzenle">Bu haftayı düzenle</button></div>';
    }
    yaz(h);
  });
};

EYLEMLER['yemek-hafta'] = function (el) { S.yemekBas = el.getAttribute('data-bas'); return SAYFALAR.yemek(); };

EYLEMLER['yemek-duzenle'] = function () {
  var d = S.yemekVeri, okul = d.okullar[0], gunler = {};
  for (var g = 0; g < okul.gunler.length; g++) gunler[okul.gunler[g].tarih] = okul.gunler[g];
  var h = '<div class="hint" style="margin-bottom:10px">Her satıra bir yemek yaz. Boş bırakılan günün menüsü silinir.</div>';
  for (var i = 0; i < 7; i++) {
    var tarih = gunEkleYerel(d.bas, i), y = gunler[tarih] || { menu: '', kalori: '' };
    h += '<div class="yemek-duzen"><div class="field"><label for="ym' + i + '">' + YEMEK_GUN[i] + ' · ' + gunKisa(tarih) + '</label>' +
      '<textarea id="ym' + i + '" class="yMenu" data-tarih="' + tarih + '" rows="' + (i >= 5 ? 1 : 3) + '" maxlength="500" ' +
      'placeholder="' + (i >= 5 ? 'Hafta sonu (isteğe bağlı)' : 'Mercimek çorbası\nTavuk sote\nPirinç pilavı\nAyran') + '">' + esc(y.menu) + '</textarea></div>' +
      '<div class="field"><label for="yk' + i + '">Kalori</label><input type="number" id="yk' + i + '" class="yKalori" min="1" max="5000" ' +
      'value="' + (y.kalori || '') + '" placeholder="kcal"></div></div>';
  }
  h += '<div id="yMesaj"></div>';
  modalAc(gunKisa(d.bas) + ' – ' + gunKisa(d.bit) + ' menüsü', h,
    '<button class="btn gri" data-act="modal-kapat">Vazgeç</button><button class="btn" data-act="yemek-kaydet">Kaydet</button>');
};

EYLEMLER['yemek-kaydet'] = function (el) {
  var menuler = document.querySelectorAll('.yMenu'), kaloriler = document.querySelectorAll('.yKalori'), gunler = [];
  for (var i = 0; i < menuler.length; i++) {
    gunler.push({ tarih: menuler[i].getAttribute('data-tarih'), menu: menuler[i].value, kalori: kaloriler[i].value });
  }
  dugmeBekle(el, 'Kaydediliyor...');
  return api('/yemek', 'POST', { gunler: gunler }).then(function () { modalKapat(); return SAYFALAR.yemek(); })
    ['catch'](function (e) { dugmeBitir(el); mesajGoster('yMesaj', 'hata', e.message); });
};

/* ================= servis ================= */
/* Canlı bilgi (aracın yeri, sıra, bugünkü bindi / indi) yalnız okulun servis
   saatlerinde gelir; açık mı kapalı mı kararını sunucu verir (Türkiye saati).
   Buradaki tarih hesabı yalnız "bugün / yarın" yazısı içindir. */
var SV_GUN_ADI = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];

function svTrGun(n) { return new Date(Date.now() + 3 * 3600000 + (n || 0) * 86400000).toISOString().slice(0, 10); }
function svGunAdi(t) {
  var d = new Date(t + 'T12:00:00Z');
  return d.getUTCDate() + ' ' + AY_ADI[d.getUTCMonth()] + ' ' + SV_GUN_ADI[d.getUTCDay()];
}
/* "bugün", "yarın" ya da "29 Eylül Salı" */
function svGunEtiketi(t, bugun) {
  var b = bugun || svTrGun(0);
  if (t === b) return 'bugün';
  if (t === gunEkleYerel(b, 1)) return 'yarın';
  return svGunAdi(t);
}
function svBuyukBas(s) { s = String(s || ''); return s.charAt(0).toLocaleUpperCase('tr') + s.slice(1); }
/* Soyadı atılır: "Zeynep Şahin" -> "Zeynep" (bildirimlerdeki gibi). */
function svIlkAd(ad) {
  var p = String(ad || '').trim().split(/\s+/);
  return p.length > 1 ? p.slice(0, -1).join(' ') : p[0] || '';
}
/* "sabah 07:00–09:20, akşam 16:30–19:00" */
function servisAralikMetni(s) {
  return s ? 'sabah ' + s.sabahBas + '–' + s.sabahBit + ', akşam ' + s.aksamBas + '–' + s.aksamBit : '';
}
/* Bir sonraki aralık: "yarın sabah 07:00–09:20" */
function servisSonrakiMetni(s) {
  return s ? svGunEtiketi(s.tarih) + ' ' + (s.donem === 'aksam' ? 'akşam' : 'sabah') + ' ' + s.bas + '–' + s.bit : '';
}
function svIsaretDonemi(x) { return x.sabah && x.aksam ? 'sabah ve akşam' : x.sabah ? 'sabah' : 'akşam'; }

/* "Zeynep 5. sırada, önünde 2 öğrenci kaldı": servis saatinde ve sırası
   henüz gelmemişse (sabah binmemiş, akşam serviste ve inmemiş). */
function servisSiraYazisi(b, ad, kaldi) {
  if (!b || !b.canli || !b.sira || b.onunde === null || b.onunde === undefined) return '';
  return (ad ? ad + ' ' : '') + b.sira + '. sırada, ' +
    (b.onunde ? 'önünde ' + b.onunde + ' öğrenci' + (kaldi ? ' kaldı' : '') : 'önünde öğrenci kalmadı');
}

/* Bugünkü durum: "Bindi 07:42", "Okula vardı 08:05", "Eve bırakıldı 17:10". */
function servisDurumu(b) {
  if (b.donem === 'sabah') {
    if (b.durum === 'bindi') {
      return b.vardiSaat ? { renk: 'yesil', metin: 'Okula vardı ' + b.vardiSaat, ek: b.bindiSaat ? 'Bindi ' + b.bindiSaat : '' }
        : { renk: 'yesil', metin: 'Bindi ' + (b.bindiSaat || '') };
    }
    if (b.durum === 'binmedi') return { renk: 'kirmizi', metin: 'Bu sabah binmedi' };
    if (b.binmeyecekBugun) return { renk: 'gri', metin: 'Bu sabah binmeyecek' };
    return { renk: 'gri', metin: b.seferBitti ? 'Servis okula vardı' : 'Henüz binmedi' };
  }
  if (b.durum === 'indi') return { renk: 'yesil', metin: 'Eve bırakıldı ' + (b.indiSaat || '') };
  if (b.durum === 'geldi') {
    return { renk: 'mavi', metin: 'Okuldan servise bindi ' + (b.bindiSaat || ''), ek: b.seferBasladi ? 'Servis yolda' : 'Servis henüz yola çıkmadı' };
  }
  if (b.durum === 'gelmedi') return { renk: 'kirmizi', metin: 'Akşam servise gelmedi' };
  if (b.binmeyecekBugun) return { renk: 'gri', metin: 'Bu akşam binmeyecek' };
  return { renk: 'gri', metin: b.seferBitti ? 'Akşam seferi bitti' : 'Henüz servise binmedi' };
}

/* Servis kartının "bugün" bölümü: durum, sıra, servisçinin notları ve
   velinin "binmeyecek" işaretleri; velide Binmeyecek düğmesi. */
function servisBugunIc(b, ogrenciId, ad, veli) {
  var h = '';
  if (b.canli) {
    var du = servisDurumu(b);
    h += '<div class="servis-bugun-ust"><span class="servis-bugun-baslik">' + (b.donem === 'aksam' ? 'Bu akşam' : 'Bu sabah') + '</span>' +
      '<span class="etiket ' + du.renk + '">' + esc(du.metin) + '</span>' + (du.ek ? '<span class="alt">' + esc(du.ek) + '</span>' : '') + '</div>';
    var sira = servisSiraYazisi(b, ad, true);
    if (sira) h += '<div class="servis-bugun-satir">' + ik('servis') + '<span>' + esc(sira) + '</span></div>';
  } else {
    h += '<div class="servis-bugun-satir soluk">' + ik('saat') + '<span>Servisin yeri, sırası ve bugünkü durumu yalnız servis saatlerinde görünür (' +
      esc(servisAralikMetni(b.saatler)) + ').' + (b.sonraki ? ' Sıradaki: ' + esc(servisSonrakiMetni(b.sonraki)) + '.' : '') + '</span></div>';
  }
  var notlar = b.notlar || [];
  for (var i = 0; i < notlar.length; i++) {
    var n = notlar[i];
    h += '<div class="servis-not">' + ik('posta') + '<span><b>Servisçinin notu · ' + esc(svGunEtiketi(n.tarih)) + '</b>' +
      (n.genel ? ' <span class="alt">(bütün servise)</span>' : '') + '<br>' + esc(n.metin) + '</span></div>';
  }
  var isaretler = b.binmeyecek || [];
  for (var j = 0; j < isaretler.length; j++) {
    var x = isaretler[j];
    h += '<div class="servis-not binmez">' + ik('takvim') + '<span><b>' + esc(svBuyukBas(svGunEtiketi(x.tarih))) + ' ' + svIsaretDonemi(x) +
      ' binmeyecek</b>' + (x.not ? '<br>' + esc(x.not) : '') + '</span></div>';
  }
  if (veli) {
    h += '<div class="dugme-satir"><button class="btn kucuk ghost" data-act="servis-binmeyecek" data-id="' + esc(ogrenciId) + '">' +
      ik('takvim') + 'Binmeyecek</button>' +
      '<span class="alt">Servise binmeyeceği günü servisçiye bildir.</span></div>';
  }
  return h;
}

function telBaglanti(tel) {
  return tel ? '<a class="servis-tel" href="tel:' + esc(telefonNorm(tel)) + '">' + esc(telefonGoster(tel)) + '</a>' : '';
}

/* s: servis; bugun: sunucunun "bugün" nesnesi (öğrenci ve veli için). */
function servisBilgiKarti(s, baslik, bugun, ogrenciId, veli) {
  var satir = function (ad, deger) { return deger ? '<div class="bilgi-satir"><span>' + ad + '</span><div>' + deger + '</div></div>' : ''; };
  return '<div class="kart servis-kart" id="servisKart_' + esc(ogrenciId || 'ben') + '"><h3>' + ik('servis') + esc(baslik || s.ad) + '</h3>' +
    satir('Servis', baslik ? esc(s.ad) : '') +
    satir('Plaka', esc(s.plaka)) +
    satir('Şoför', esc(s.sofor) + (s.soforTel ? ' · ' + telBaglanti(s.soforTel) : '')) +
    satir('Rehber', esc(s.rehber) + (s.rehberTel ? ' · ' + telBaglanti(s.rehberTel) : '')) +
    satir('Sabah kalkış', esc(s.sabah)) + satir('Akşam kalkış', esc(s.aksam)) +
    satir('Durak', esc(s.durak)) +
    satir('Güzergâh', esc(s.guzergah).replace(/\n/g, '<br>')) +
    (bugun ? '<div class="servis-bugun" id="servisBugun_' + esc(ogrenciId || 'ben') + '">' +
      servisBugunIc(bugun, ogrenciId, baslik ? svIlkAd(baslik) : '', veli) + '</div>' : '') + '</div>';
}

/* Harita yenilenince (30 sn / 5 sn) kartın "bugün" bölümü de tazelenir. */
function servisBugunGuncelle(ogrenciId, bugun) {
  var d = S.servisVeri;
  var kutu = $('servisBugun_' + (ogrenciId || 'ben'));
  if (!d || !kutu) return;
  if (!ogrenciId) {
    if (!d.benim) return;
    d.benim.bugun = bugun;
    kutu.innerHTML = servisBugunIc(bugun, '', '', false);
    return;
  }
  var c = svCocukBul(ogrenciId);
  if (!c || !c.bugun) return;
  bugun.binmeyecekDuzenleyebilir = c.bugun.binmeyecekDuzenleyebilir;
  c.bugun = bugun;
  kutu.innerHTML = servisBugunIc(bugun, c.id, svIlkAd(c.ad), !!bugun.binmeyecekDuzenleyebilir);
}

function svCocukBul(id) {
  var l = (S.servisVeri && S.servisVeri.cocuklar) || [];
  for (var i = 0; i < l.length; i++) if (l[i].id === id) return l[i];
  return null;
}

SAYFALAR.servis = function () {
  servisHaritasiDurdur();
  var servisciler = function (d) {
    return d.yonetir ? api('/school/servisciler').then(function (r) { return r.servisciler; })['catch'](function () { return []; })
      : Promise.resolve([]);
  };
  return api('/servis').then(function (d) {
    return Promise.all([servisciler(d), servisBildirimOnerisi()]).then(function (r) { servisSayfasi(d, r[0], r[1]); });
  });
};

/* Okulun servis saatleri (yönetim): veli canlı bilgiyi, servisçi yoklamayı
   yalnız bu aralıklarda görür. */
function servisSaatKarti(s) {
  var alan = function (id, etiket, deger) {
    return '<label class="servis-saat-alan" for="' + id + '"><span>' + etiket + '</span>' +
      '<input type="time" id="' + id + '" value="' + esc(deger) + '" required></label>';
  };
  return '<div class="kart" id="servisSaatleriKart"><h3>' + ik('saat') + 'Servis saatleri</h3>' +
    '<div class="alt servis-saat-aciklama">Veli ve öğrenci servisin yerini, sırasını ve bugünkü durumunu yalnız bu saatlerde görür; ' +
    'servisçi yoklamayı ve seferi yalnız bu saatlerde açar. Saat bitince yoldaki sefer en çok 60 dakika daha sürer. Her gün geçerlidir.</div>' +
    '<div class="servis-saat-izgara">' +
    '<fieldset class="servis-saat-grup"><legend>Sabah (evden okula)</legend><div class="servis-saat-cift">' +
    alan('ssSabahBas', 'Başlangıç', s.sabahBas) + alan('ssSabahBit', 'Bitiş', s.sabahBit) + '</div></fieldset>' +
    '<fieldset class="servis-saat-grup"><legend>Akşam (okuldan eve)</legend><div class="servis-saat-cift">' +
    alan('ssAksamBas', 'Başlangıç', s.aksamBas) + alan('ssAksamBit', 'Bitiş', s.aksamBit) + '</div></fieldset>' +
    '</div><div id="ssMesaj"></div>' +
    '<div class="dugme-satir"><button class="btn" data-act="servis-saat-kaydet">Saatleri kaydet</button></div></div>';
}

function servisSayfasi(d, servisciler, bildirimOneri) {
  S.servisVeri = d;
  S.servisciListe = servisciler;
  var h = hero('SERVİS', d.yonetir ? 'Okulun servisleri, servis saatleri, servisçiler ve servisteki öğrenciler.'
    : 'Servis ve şoför bilgileri, bugünkü durum ve servisin haritası.');
  var haritaIlk = null;   // haritası açılacak öğrenci (veli için seçili ya da ilk çocuk)
  var kaydir = '';        // bildirimden gelindiyse o çocuğun kartı

  if (S.user.role === 'student') {
    if (d.benim) {
      h += servisBilgiKarti(d.benim, '', d.benim.bugun, '', false) + bildirimOneri +
        '<div class="kart"><h3>' + ik('harita') + 'Servisin nerede?</h3><div id="servisHaritaKart"></div></div>';
      haritaIlk = { id: '' };
    } else {
      h += bosKutu('servis', 'Servis kaydın yok. Servise biniyorsan okul yönetimine söyle.');
    }
  }
  var servisliCocuk = [];
  for (var c = 0; c < d.cocuklar.length; c++) {
    var cc = d.cocuklar[c];
    h += cc.servis ? servisBilgiKarti(cc.servis, cc.ad, cc.bugun, cc.id, !!(cc.bugun && cc.bugun.binmeyecekDuzenleyebilir))
      : '<div class="kart"><h3>' + esc(cc.ad) + '</h3><div class="hint">Servis kaydı yok.</div></div>';
    if (cc.servis) servisliCocuk.push(cc);
  }
  if (servisliCocuk.length) {
    /* Bildirimden (#/servis?c=<çocuk>) gelindiyse o çocuk, yoksa son bakılan ya da ilk çocuk. */
    var adrestenGeldi = !!S.adresCocuk;
    var secili = S.user.role !== 'student' ? veliSeciliCocuk() : null;
    var hedefId = (secili && secili.id) || S.servisHaritaCocuk || '';
    var ilk = servisliCocuk[0];
    for (var s0 = 0; s0 < servisliCocuk.length; s0++) if (servisliCocuk[s0].id === hedefId) ilk = servisliCocuk[s0];
    if (adrestenGeldi && secili && ilk.id === secili.id && d.cocuklar.length > 1) kaydir = ilk.id;
    h += bildirimOneri + '<div class="kart"><h3>' + ik('harita') + 'Servis haritası</h3>';
    if (servisliCocuk.length > 1) {
      h += '<div class="dugme-satir">';
      for (var k = 0; k < servisliCocuk.length; k++) {
        h += '<button class="btn kucuk' + (servisliCocuk[k] === ilk ? '' : ' gri') + '" data-act="servis-harita-cocuk" data-id="' +
          esc(servisliCocuk[k].id) + '">' + esc(svIlkAd(servisliCocuk[k].ad)) + '</button>';
      }
      h += '</div>';
    }
    h += '<div id="servisHaritaKart"></div></div>';
    haritaIlk = { id: ilk.id };
  }

  if (d.yonetir) {
    if (d.saatDuzenleyebilir && d.saatler) h += servisSaatKarti(d.saatler);
    h += '<div class="kart"><div class="satir" style="border:0;padding:0"><div class="buyu"><div class="ad">' +
      (d.servisler.length ? d.servisler.length + ' servis' : 'Henüz servis eklenmedi') + '</div>' +
      '<div class="alt">Şoför ve rehber telefonu yalnızca o servisteki öğrenciye ve velisine görünür.</div></div>' +
      '<button class="btn" data-act="servis-duzenle" data-id="">Yeni servis</button></div></div>';
    for (var i = 0; i < d.servisler.length; i++) {
      var s = d.servisler[i];
      h += '<div class="kart servis-yonetim"><div class="satir"><div class="buyu"><div class="ad">' + ik('servis') + esc(s.ad) +
        (s.plaka ? ' <span class="etiket gri">' + esc(s.plaka) + '</span>' : '') + '</div>' +
        '<div class="alt">' + [s.soforAdi ? 'Servisçi ' + esc(s.soforAdi) : (s.sofor ? 'Şoför ' + esc(s.sofor) : 'Servisçi atanmadı'),
          s.sabah ? 'sabah kalkış ' + esc(s.sabah) : '', s.aksam ? 'akşam kalkış ' + esc(s.aksam) : '',
          s.ogrenciSayisi + ' öğrenci'].filter(Boolean).join(' · ') + '</div></div>' +
        '<button class="btn kucuk ghost" data-act="servis-yoklama-bak" data-id="' + esc(s.id) + '">Bugünkü yoklama</button>' +
        '<button class="btn kucuk ghost" data-act="servis-ogrenci-ac" data-id="' + esc(s.id) + '">Öğrenci ekle</button>' +
        '<button class="btn kucuk gri" data-act="servis-duzenle" data-id="' + esc(s.id) + '">Düzenle</button></div>';
      for (var j = 0; j < s.ogrenciler.length; j++) {
        var o = s.ogrenciler[j];
        h += '<div class="satir alt-satir"><div class="buyu">' + esc(o.ad) + ' <span class="alt">' + esc(o.sinif) +
          (o.durak ? ' · ' + esc(o.durak) : '') + '</span></div>' +
          '<button class="btn kucuk ghost" data-act="servis-harita-modal" data-id="' + esc(o.id) + '" data-ad="' + esc(o.ad) + '">Harita</button>' +
          '<button class="btn kucuk gri" data-act="servis-cikar" data-id="' + esc(o.id) + '">Çıkar</button></div>';
      }
      h += '</div>';
    }

    h += '<h3 class="sb">Servisçiler (' + servisciler.length + ')</h3>' +
      '<div class="kart"><div class="satir" style="border:0;padding:0"><div class="buyu">' +
      '<div class="alt">Servisçi hesabını okul açar. Servisçi telefonundan girip Yoklama sayfasında öğrencileri işaretler; ' +
      'sefer sürerken aracın yeri o servisteki öğrencilere ve velilerine görünür.</div></div>' +
      '<button class="btn" data-act="hesap-yeni" data-rol="servisci">Servisçi ekle</button></div>';
    for (var v = 0; v < servisciler.length; v++) {
      var sv = servisciler[v];
      var atandigi = d.servisler.filter(function (x) { return x.soforId === sv.id; }).map(function (x) { return x.ad; });
      h += '<div class="satir"><div class="buyu"><div class="ad">' + esc(sv.fullName) + '</div>' +
        '<div class="alt">' + [esc(sv.username), atandigi.length ? esc(atandigi.join(', ')) : 'servise atanmadı',
          sv.girisYapti ? '' : 'henüz giriş yapmadı'].filter(Boolean).join(' · ') + '</div></div>' +
        '<button class="btn kucuk ghost" data-act="hesap-duzenle" data-id="' + esc(sv.id) + '">Hesap</button></div>';
    }
    h += '</div>';
  } else if (S.user.role !== 'student' && !d.cocuklar.length) {
    h += bosKutu('servis', 'Servis bilgileri okul yönetimindedir.');
  }
  yaz(h);
  if (kaydir && $('servisKart_' + kaydir)) $('servisKart_' + kaydir).scrollIntoView({ block: 'start' });
  if (haritaIlk) servisHaritasiAc('servisHaritaKart', haritaIlk.id);
}

EYLEMLER['servis-saat-kaydet'] = function (el) {
  var v = function (id) { return $(id) ? $(id).value : ''; };
  dugmeBekle(el, 'Kaydediliyor...');
  return api('/servis/saatler', 'POST', { sabahBas: v('ssSabahBas'), sabahBit: v('ssSabahBit'), aksamBas: v('ssAksamBas'), aksamBit: v('ssAksamBit') })
    .then(function (r) {
      dugmeBitir(el);
      if (S.servisVeri) S.servisVeri.saatler = r.saatler;
      mesajGoster('ssMesaj', 'iyi', r.message + ' Yeni aralıklar: ' + servisAralikMetni(r.saatler) + '.');
    })['catch'](function (e) { dugmeBitir(el); mesajGoster('ssMesaj', 'hata', e.message); });
};

/* Yönetim: servisin bugünkü yoklaması, salt okunur (19i-servis-yoklama.js çizer). */
EYLEMLER['servis-yoklama-bak'] = function (el, id) {
  var s = null, l = (S.servisVeri && S.servisVeri.servisler) || [];
  for (var i = 0; i < l.length; i++) if (l[i].id === id) s = l[i];
  modalAc((s ? s.ad : 'Servis') + ' — bugünkü yoklama', '<div class="yukleniyor">Yükleniyor...</div>');
  return api('/servis/yoklama?servisId=' + encodeURIComponent(id)).then(function (d) {
    if ($('modalGovde')) $('modalGovde').innerHTML = syYonetimGorunumu(d);
  })['catch'](function (e) {
    if ($('modalGovde')) $('modalGovde').innerHTML = '<div class="msg hata">' + esc(e.message) + '</div>';
  });
};

/* Veli: "binmeyecek" (bugün ve 7 gün sonrasına kadar; sabah, akşam ya da
   ikisi). O dönemin yoklaması alınınca değiştirilemez; servisçiye haber gider. */
EYLEMLER['servis-binmeyecek'] = function (el, id) {
  var c = svCocukBul(id);
  if (!c || !c.bugun) return;
  var b = c.bugun, bugun = b.tarih || svTrGun(0), isaretler = {};
  for (var i = 0; i < (b.binmeyecek || []).length; i++) isaretler[b.binmeyecek[i].tarih] = b.binmeyecek[i];
  S.svBinmez = { id: id, isaretler: isaretler };
  /* Bugün için servis saati kaldıysa bugün, yoksa yarın seçili gelir. */
  var secili = (b.canli || (b.sonraki && b.sonraki.tarih === bugun)) ? bugun : gunEkleYerel(bugun, 1);
  var sec = '';
  for (var g = 0; g <= 7; g++) {
    var t = gunEkleYerel(bugun, g), x = isaretler[t];
    sec += '<option value="' + t + '"' + (t === secili ? ' selected' : '') + '>' +
      esc((g === 0 ? 'Bugün · ' : g === 1 ? 'Yarın · ' : '') + svGunAdi(t) + (x ? ' (işaretli: ' + svIsaretDonemi(x) + ')' : '')) + '</option>';
  }
  var secim = function (deger, ad) {
    return '<label class="secim-dugme"><input type="radio" name="bmDonem" value="' + deger + '"><span>' + ad + '</span></label>';
  };
  var h = '<div class="hint" style="margin:0 0 12px">Servisçinin listesinde görünür ve ona bildirim gider. ' +
    'O servisin yoklaması alınınca işaret değiştirilemez.</div>' +
    '<div class="field"><label for="bmTarih">Hangi gün?</label><select id="bmTarih">' + sec + '</select></div>' +
    '<div class="field"><span class="etiket-baslik">Hangi servise binmeyecek?</span><div class="secim-dugmeler">' +
    secim('sabah', 'Sabah') + secim('aksam', 'Akşam') + secim('ikisi', 'İkisi') + '</div></div>' +
    '<div class="field"><label for="bmNot">Kısa not (isteğe bağlı)</label>' +
    '<input type="text" id="bmNot" maxlength="200" placeholder="ör. Doktor randevusu var." autocomplete="off"></div>' +
    '<div id="bmMesaj"></div>';
  modalAc(svIlkAd(c.ad) + ' servise binmeyecek', h,
    '<button class="btn gri" data-act="servis-binmeyecek-kaldir" id="bmKaldir" hidden>İşareti kaldır</button>' +
    '<button class="btn gri" data-act="modal-kapat">Vazgeç</button>' +
    '<button class="btn" data-act="servis-binmeyecek-kaydet">Kaydet</button>');
  $('bmTarih').onchange = svBinmezDoldur;
  svBinmezDoldur();
};

/* Seçilen günün işareti varsa pencereye gelir. */
function svBinmezDoldur() {
  var x = S.svBinmez && S.svBinmez.isaretler[$('bmTarih').value];
  var deger = x ? (x.sabah && x.aksam ? 'ikisi' : x.sabah ? 'sabah' : 'aksam') : 'ikisi';
  var r = document.querySelectorAll('input[name="bmDonem"]');
  for (var i = 0; i < r.length; i++) r[i].checked = r[i].value === deger;
  $('bmNot').value = x ? x.not || '' : '';
  $('bmKaldir').hidden = !x;
}

function svBinmezGonder(el, sabah, aksam) {
  var id = S.svBinmez.id;
  dugmeBekle(el, 'Kaydediliyor...');
  return api('/servis/binmeyecek', 'POST', { ogrenciId: id, tarih: $('bmTarih').value, sabah: sabah, aksam: aksam, not: $('bmNot').value })
    .then(function (r) {
      modalKapat();
      S.servisHaritaCocuk = id;
      return SAYFALAR.servis().then(function () { sayfaMesaji('iyi', r.message); });
    })['catch'](function (e) { dugmeBitir(el); mesajGoster('bmMesaj', 'hata', e.message); });
}
EYLEMLER['servis-binmeyecek-kaydet'] = function (el) {
  var r = document.querySelector('input[name="bmDonem"]:checked');
  var d = r ? r.value : 'ikisi';
  return svBinmezGonder(el, d !== 'aksam', d !== 'sabah');
};
EYLEMLER['servis-binmeyecek-kaldir'] = function (el) { return svBinmezGonder(el, false, false); };

EYLEMLER['servis-duzenle'] = function (el, id) {
  var s = null;
  for (var i = 0; i < S.servisVeri.servisler.length; i++) if (S.servisVeri.servisler[i].id === id) s = S.servisVeri.servisler[i];
  s = s || { ad: '', plaka: '', sofor: '', soforTel: '', rehber: '', rehberTel: '', sabah: '', aksam: '', guzergah: '', soforId: '' };
  var alan = function (k, ad, tip, ph) {
    return '<div class="field"><label for="sv_' + k + '">' + ad + '</label><input type="' + (tip || 'text') + '" id="sv_' + k + '" value="' +
      esc(s[k]) + '" placeholder="' + (ph || '') + '" autocomplete="off"></div>';
  };
  var liste = S.servisciListe || [];
  var secenek = '<option value="">— atanmadı —</option>';
  for (var j = 0; j < liste.length; j++) {
    secenek += '<option value="' + esc(liste[j].id) + '"' + (s.soforId === liste[j].id ? ' selected' : '') + '>' + esc(liste[j].fullName) + '</option>';
  }
  var h = alan('ad', 'Servis adı', '', '1. Servis') +
    '<div class="row2">' + alan('plaka', 'Plaka', '', '07 ABC 123') +
    '<div class="field"><label for="sv_soforId">Servisçi hesabı</label><select id="sv_soforId">' + secenek + '</select></div></div>' +
    (liste.length ? '' : '<div class="hint" style="margin:-4px 0 10px">Servisçi hesabı yoksa önce aşağıdan "Servisçi ekle" ile aç.</div>') +
    '<div class="row2">' + alan('sofor', 'Şoför adı (hesabı yoksa)') + alan('soforTel', 'Şoför telefonu', 'tel') + '</div>' +
    '<div class="row2">' + alan('rehber', 'Rehber personel') + alan('rehberTel', 'Rehber telefonu', 'tel') + '</div>' +
    '<div class="row2">' + alan('sabah', 'Sabah kalkış', 'time') + alan('aksam', 'Akşam kalkış', 'time') + '</div>' +
    '<div class="field"><label for="sv_guzergah">Güzergâh</label><textarea id="sv_guzergah" rows="2" maxlength="500">' + esc(s.guzergah) + '</textarea></div>' +
    '<div id="svMesaj"></div>';
  modalAc(id ? s.ad : 'Yeni servis', h,
    (id ? '<button class="btn tehlike" data-act="servis-sil" data-id="' + esc(id) + '">Sil</button>' : '') +
    '<button class="btn gri" data-act="modal-kapat">Vazgeç</button>' +
    '<button class="btn" data-act="servis-kaydet" data-id="' + esc(id || '') + '">Kaydet</button>');
};

EYLEMLER['servis-kaydet'] = function (el, id) {
  var v = function (k) { return $('sv_' + k).value; };
  dugmeBekle(el, 'Kaydediliyor...');
  return api('/servis/kaydet', 'POST', { id: id, ad: v('ad'), plaka: v('plaka'), sofor: v('sofor'), soforTel: telefonOku($('sv_soforTel')),
    rehber: v('rehber'), rehberTel: telefonOku($('sv_rehberTel')), sabah: v('sabah'), aksam: v('aksam'), guzergah: v('guzergah'),
    soforId: v('soforId') })
    .then(function () { modalKapat(); return SAYFALAR.servis(); })
    ['catch'](function (e) { dugmeBitir(el); mesajGoster('svMesaj', 'hata', e.message); });
};

EYLEMLER['servis-sil'] = function (el, id) {
  if (!confirm('Servis silinsin mi? İçindeki öğrencilerin servis kaydı da kalkar.')) return;
  el.disabled = true;
  return api('/servis/sil', 'POST', { id: id }).then(function () { modalKapat(); return SAYFALAR.servis(); })
    ['catch'](function (e) { el.disabled = false; hataGoster(e); });
};

EYLEMLER['servis-cikar'] = function (el, id) {
  el.disabled = true;
  return api('/servis/ogrenci-cikar', 'POST', { ogrenciId: id }).then(function () { return SAYFALAR.servis(); })
    ['catch'](function (e) { el.disabled = false; hataGoster(e); });
};

/* Öğrenci seçme penceresi: ara, seç, durak yaz. Başka serviste olan
   öğrenci seçilirse bu servise taşınır. */
function servisHaritasi() {
  var servisAdi = {};
  for (var i = 0; i < S.servisVeri.servisler.length; i++) {
    var s = S.servisVeri.servisler[i];
    for (var j = 0; j < s.ogrenciler.length; j++) servisAdi[s.ogrenciler[j].id] = s.ad;
  }
  return servisAdi;
}

EYLEMLER['servis-ogrenci-ac'] = function (el, id) {
  S.servisSecim = { servisId: id, servisAdi: servisHaritasi() };
  /* Durak önce yazılır, sonra öğrencinin yanındaki Ekle'ye basılır. */
  var h = '<div class="field"><label for="svDurak">Durak (isteğe bağlı)</label><input type="text" id="svDurak" maxlength="120" ' +
    'placeholder="ör. Çallı kavşağı, market önü"></div>' +
    '<div class="field"><label for="svAra">Öğrenci ara</label>' +
    '<input type="text" id="svAra" class="ara-kutu" placeholder="Ad ya da sınıf" autocomplete="off"></div>' +
    '<div class="secim-kutu" id="svListe"></div><div id="svoMesaj"></div>';
  modalAc('Servise öğrenci ekle', h,
    '<button class="btn gri" data-act="modal-kapat">Kapat</button>');
  $('svAra').oninput = servisAdayCiz;
  servisAdayCiz();
  $('svAra').focus();
};

function servisAdayCiz() {
  var q = nrm($('svAra').value), liste = S.servisVeri.okulOgrencileri || [], h = '', n = 0;
  for (var i = 0; i < liste.length && n < 60; i++) {
    var o = liste[i];
    if (q && nrm(o.ad + ' ' + o.sinif).indexOf(q) < 0) continue;
    n++;
    var nerede = S.servisSecim.servisAdi[o.id];
    var buServis = nerede && S.servisVeri.servisler.some(function (s) {
      return s.id === S.servisSecim.servisId && s.ad === nerede;
    });
    h += '<div class="satir"><div class="buyu">' + esc(o.ad) + ' <span class="alt">' + esc(o.sinif) +
      (nerede ? ' · ' + (buServis ? 'bu serviste' : 'şu an ' + esc(nerede)) : '') + '</span></div>' +
      (buServis ? '' : '<button class="btn kucuk" data-act="servis-ogrenci-ekle" data-id="' + esc(o.id) + '">' + (nerede ? 'Taşı' : 'Ekle') + '</button>') +
      '</div>';
  }
  $('svListe').innerHTML = h || '<div class="hint">Eşleşen öğrenci yok.</div>';
}

/* Pencere açık kalır (arka arkaya ekleme); arkadaki sayfa ve liste tazelenir,
   arama kutusu olduğu gibi kalır. */
EYLEMLER['servis-ogrenci-ekle'] = function (el, id) {
  el.disabled = true;
  return api('/servis/ogrenci', 'POST', { servisId: S.servisSecim.servisId, ogrenciId: id, durak: $('svDurak').value })
    .then(function (r) {
      return SAYFALAR.servis().then(function () {
        if (!$('svListe')) return;
        S.servisSecim.servisAdi = servisHaritasi();
        servisAdayCiz();
        mesajGoster('svoMesaj', 'iyi', r.message);
      });
    })['catch'](function (e) { el.disabled = false; mesajGoster('svoMesaj', 'hata', e.message); });
};

/* ================= kulüpler ================= */
SAYFALAR.kulupler = function () {
  return api('/kulupler').then(function (d) {
    S.kulupVeri = d;
    var h = hero('KULÜPLER', S.user.role === 'student' ? 'Okulun kulüpleri. Başvurusu açık kulübe katılabilirsin.' : 'Okulun kulüpleri ve danışman öğretmenleri.');

    for (var c = 0; c < d.cocuklar.length; c++) {
      var cc = d.cocuklar[c];
      h += '<div class="kart"><h3>' + esc(cc.ad) + '</h3>' + (cc.kulupler.length
        ? cc.kulupler.map(function (k) {
          return '<div class="satir"><div class="buyu"><div class="ad">' + ik('kulup') + esc(k.ad) + '</div><div class="alt">' +
            [k.danisman ? 'Danışman: ' + esc(k.danisman) : '', esc(k.gunSaat)].filter(Boolean).join(' · ') + '</div></div></div>';
        }).join('') : '<div class="hint">Bir kulübe üye değil.</div>') + '</div>';
    }

    if (d.yonetir) {
      h += '<div class="kart"><div class="satir" style="border:0;padding:0"><div class="buyu"><div class="ad">' +
        (d.kulupler.length ? d.kulupler.length + ' kulüp' : 'Henüz kulüp yok') + '</div>' +
        '<div class="alt">Başvuruyu kapatınca öğrenciler kendileri katılamaz ve ayrılamaz; danışman ya da yönetim düzenler.</div></div>' +
        '<button class="btn" data-act="kulup-duzenle" data-id="">Yeni kulüp</button></div></div>';
    }

    if (!d.kulupler.length && !d.cocuklar.length && !d.yonetir) h += bosKutu('kulup', 'Okulda henüz kulüp yok.');

    for (var i = 0; i < d.kulupler.length; i++) {
      var k = d.kulupler[i];
      var dolu = k.kontenjan && k.uyeSayisi >= k.kontenjan;
      h += '<div class="kart kulup-kart"><div class="anket-ust"><div class="buyu">' +
        '<div class="anket-soru">' + esc(k.ad) + (k.uyesin ? ' <span class="etiket yesil">Üyesin</span>' : '') + '</div>' +
        '<div class="alt">' + [k.danisman ? 'Danışman: ' + esc(k.danisman) : 'Danışman atanmadı', esc(k.gunSaat),
          k.uyeSayisi + (k.kontenjan ? ' / ' + k.kontenjan : '') + ' üye'].filter(Boolean).join(' · ') + '</div></div>' +
        (!k.basvuruAcik ? '<span class="etiket gri">Başvuru kapalı</span>' : (dolu ? '<span class="etiket turuncu">Dolu</span>' : '')) + '</div>' +
        (k.aciklama ? '<div class="anket-aciklama">' + esc(k.aciklama).replace(/\n/g, '<br>') + '</div>' : '') +
        '<div class="kulup-dugmeler">';
      if (S.user.role === 'student' && k.basvuruAcik) {
        h += k.uyesin ? '<button class="btn kucuk gri" data-act="kulup-ayril" data-id="' + esc(k.id) + '">Ayrıl</button>'
          : (dolu ? '' : '<button class="btn kucuk" data-act="kulup-katil" data-id="' + esc(k.id) + '">Katıl</button>');
      }
      if (k.uyeleriGorur) h += '<button class="btn kucuk ghost" data-act="kulup-uyeler" data-id="' + esc(k.id) + '">Üyeler</button>';
      if (d.yonetir) h += '<button class="btn kucuk gri" data-act="kulup-duzenle" data-id="' + esc(k.id) + '">Düzenle</button>';
      h += '</div></div>';
    }
    yaz(h);
  });
};

EYLEMLER['kulup-katil'] = function (el, id) {
  el.disabled = true;
  return api('/kulupler/katil', 'POST', { id: id }).then(function (r) {
    return SAYFALAR.kulupler().then(function () { sayfaMesaji('iyi', r.message); });
  })['catch'](function (e) { el.disabled = false; hataGoster(e); });
};

EYLEMLER['kulup-ayril'] = function (el, id) {
  if (!confirm('Kulüpten ayrılmak istiyor musun?')) return;
  el.disabled = true;
  return api('/kulupler/ayril', 'POST', { id: id }).then(function () { return SAYFALAR.kulupler(); })
    ['catch'](function (e) { el.disabled = false; hataGoster(e); });
};

EYLEMLER['kulup-duzenle'] = function (el, id) {
  var d = S.kulupVeri, k = null;
  for (var i = 0; i < d.kulupler.length; i++) if (d.kulupler[i].id === id) k = d.kulupler[i];
  k = k || { ad: '', aciklama: '', danismanId: '', kontenjan: 0, basvuruAcik: true, gunSaat: '' };
  var secenek = '<option value="">— danışman yok —</option>';
  for (var j = 0; j < (d.ogretmenler || []).length; j++) {
    var t = d.ogretmenler[j];
    secenek += '<option value="' + esc(t.id) + '"' + (t.id === k.danismanId ? ' selected' : '') + '>' + esc(t.ad) + '</option>';
  }
  var h = '<div class="field"><label for="kuAd">Kulüp adı</label><input type="text" id="kuAd" maxlength="80" value="' + esc(k.ad) +
    '" placeholder="ör. Satranç Kulübü"></div>' +
    '<div class="field"><label for="kuAciklama">Açıklama (isteğe bağlı)</label><textarea id="kuAciklama" rows="2" maxlength="1000">' +
    esc(k.aciklama) + '</textarea></div>' +
    '<div class="field"><label for="kuDanisman">Danışman öğretmen</label><select id="kuDanisman">' + secenek + '</select>' +
    '<div class="hint">Danışman üye listesini görür, üye ekleyip çıkarabilir.</div></div>' +
    '<div class="row2"><div class="field"><label for="kuKontenjan">Kontenjan</label><input type="number" id="kuKontenjan" min="1" max="1000" value="' +
    (k.kontenjan || '') + '" placeholder="Boş: sınırsız"></div>' +
    '<div class="field"><label for="kuGunSaat">Gün ve saat</label><input type="text" id="kuGunSaat" maxlength="60" value="' + esc(k.gunSaat) +
    '" placeholder="ör. Çarşamba 15.00"></div></div>' +
    '<label class="onay" style="margin-bottom:10px"><input type="checkbox" id="kuAcik"' + (k.basvuruAcik ? ' checked' : '') + '>' +
    '<span>Başvuru açık (öğrenci kendisi katılıp ayrılabilir)</span></label><div id="kuMesaj"></div>';
  modalAc(id ? k.ad : 'Yeni kulüp', h,
    (id ? '<button class="btn tehlike" data-act="kulup-sil" data-id="' + esc(id) + '">Sil</button>' : '') +
    '<button class="btn gri" data-act="modal-kapat">Vazgeç</button>' +
    '<button class="btn" data-act="kulup-kaydet" data-id="' + esc(id || '') + '">Kaydet</button>');
};

EYLEMLER['kulup-kaydet'] = function (el, id) {
  dugmeBekle(el, 'Kaydediliyor...');
  return api('/kulupler/kaydet', 'POST', { id: id, ad: $('kuAd').value, aciklama: $('kuAciklama').value,
    danismanId: $('kuDanisman').value, kontenjan: $('kuKontenjan').value, gunSaat: $('kuGunSaat').value, basvuruAcik: $('kuAcik').checked })
    .then(function () { modalKapat(); return SAYFALAR.kulupler(); })
    ['catch'](function (e) { dugmeBitir(el); mesajGoster('kuMesaj', 'hata', e.message); });
};

EYLEMLER['kulup-sil'] = function (el, id) {
  if (!confirm('Kulüp ve üyelik kayıtları silinsin mi?')) return;
  el.disabled = true;
  return api('/kulupler/sil', 'POST', { id: id }).then(function () { modalKapat(); return SAYFALAR.kulupler(); })
    ['catch'](function (e) { el.disabled = false; hataGoster(e); });
};

/* Üye listesi: danışman ve yönetim; çıkar ve ara-ekle. */
EYLEMLER['kulup-uyeler'] = function (el, id) { return kulupUyeleriAc(id, ''); };

function kulupUyeleriAc(id, ara) {
  return api('/kulupler/uyeler?id=' + encodeURIComponent(id)).then(function (d) {
    S.kulupUye = { id: id, adaylar: d.adaylar };
    var h = '<div class="alt" style="margin-bottom:8px">' + d.uyeler.length + (d.kulup.kontenjan ? ' / ' + d.kulup.kontenjan : '') + ' üye</div>' +
      '<div class="okuma-liste" style="max-height:220px">';
    for (var i = 0; i < d.uyeler.length; i++) {
      var u = d.uyeler[i];
      h += '<div class="alici-satir"><div class="buyu">' + esc(u.ad) + ' <span class="alt">' + esc(u.sinif) + '</span></div>' +
        '<button class="btn kucuk gri" data-act="kulup-uye-cikar" data-id="' + esc(u.id) + '">Çıkar</button></div>';
    }
    if (!d.uyeler.length) h += '<div class="hint" style="padding:8px 0">Henüz üye yok.</div>';
    h += '</div><div class="field" style="margin-top:14px"><label for="kuAra">Üye ekle</label>' +
      '<input type="text" id="kuAra" class="ara-kutu" placeholder="Öğrenci adı ya da sınıf" autocomplete="off"></div>' +
      '<div class="secim-kutu" id="kuAdaylar"></div><div id="kuuMesaj"></div>';
    modalAc(d.kulup.ad + ' — Üyeler', h, '<button class="btn gri" data-act="modal-kapat">Kapat</button>');
    $('kuAra').value = ara || '';
    $('kuAra').oninput = kulupAdayCiz;
    kulupAdayCiz();
    if (ara) $('kuAra').focus();
  })['catch'](hataGoster);
}

function kulupAdayCiz() {
  var q = nrm($('kuAra').value), h = '', n = 0;
  if (!q) { $('kuAdaylar').innerHTML = '<div class="hint">Eklemek için ad yaz.</div>'; return; }
  for (var i = 0; i < S.kulupUye.adaylar.length && n < 40; i++) {
    var o = S.kulupUye.adaylar[i];
    if (nrm(o.ad + ' ' + o.sinif).indexOf(q) < 0) continue;
    n++;
    h += '<div class="satir"><div class="buyu">' + esc(o.ad) + ' <span class="alt">' + esc(o.sinif) + '</span></div>' +
      '<button class="btn kucuk" data-act="kulup-uye-ekle" data-id="' + esc(o.id) + '">Ekle</button></div>';
  }
  $('kuAdaylar').innerHTML = h || '<div class="hint">Eşleşen öğrenci yok.</div>';
}

/* Ekle / çıkar: pencere yenilenir (arama korunur), arkadaki sayfa da tazelenir. */
function kulupUyeIslem(el, yol, ogrenciId) {
  el.disabled = true;
  var ara = $('kuAra') ? $('kuAra').value : '';
  return api(yol, 'POST', { id: S.kulupUye.id, ogrenciId: ogrenciId })
    .then(function () {
      SAYFALAR.kulupler()['catch'](function () { /* sayfa sonra tazelenir */ });
      return kulupUyeleriAc(S.kulupUye.id, ara);
    })['catch'](function (e) { el.disabled = false; mesajGoster('kuuMesaj', 'hata', e.message); });
}
EYLEMLER['kulup-uye-ekle'] = function (el, ogrenciId) { return kulupUyeIslem(el, '/kulupler/uye-ekle', ogrenciId); };
EYLEMLER['kulup-uye-cikar'] = function (el, ogrenciId) { return kulupUyeIslem(el, '/kulupler/uye-cikar', ogrenciId); };
