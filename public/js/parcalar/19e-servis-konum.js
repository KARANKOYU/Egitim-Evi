/* Servis haritası ve servisçinin seferleri.
   - Öğrenci ve velisi: okul, ev ve (sefer sürerken) servis aracı haritada;
     5 saniyede bir yenilenir. Evini işaretleyen öğrencinin kendisine ve
     velisine servis 500 m ve 100 m kala bildirim gider (sunucu hesaplar).
   - Servisçi: seferi başlatır; telefonun konumu sefer boyunca birkaç
     saniyede bir gönderilir, seferi bitirince kesilir. Konum yalnızca bu
     sayfa açıkken gider (tarayıcı arka planda konum vermez).
   Kimin neyi göreceği sunucuda belirlenir; burası yalnızca çizer. */

/* ================= öğrenci / veli / yönetim: harita ================= */
var SERVIS_YENILE_MS = 5000;
var servisHarita = { h: null, kap: '', ogrenciId: '', veri: null, sayac: null, secim: null, secimAcik: false };

function mesafeMetre(a, b) {
  var r = 6371000, rad = function (x) { return x * Math.PI / 180; };
  var dEn = rad(b.enlem - a.enlem), dBoy = rad(b.boylam - a.boylam);
  var h = Math.pow(Math.sin(dEn / 2), 2) + Math.cos(rad(a.enlem)) * Math.cos(rad(b.enlem)) * Math.pow(Math.sin(dBoy / 2), 2);
  return 2 * r * Math.asin(Math.min(1, Math.sqrt(h)));
}
function mesafeYaz(m) {
  return m < 1000 ? Math.round(m / 10) * 10 + ' m' : sayiTR(Math.round(m / 100) / 10, 1) + ' km';
}
function kacSaniyeOnce(iso) {
  var s = Math.max(0, Math.round((Date.now() - Date.parse(iso)) / 1000));
  return s < 60 ? s + ' sn önce' : Math.round(s / 60) + ' dk önce';
}

function servisHaritasiDurdur() {
  if (servisHarita.sayac) { clearTimeout(servisHarita.sayac); servisHarita.sayac = null; }
  if (servisHarita.h) { servisHarita.h.yokEt(); servisHarita.h = null; }
  servisHarita.veri = null;
  servisHarita.secimAcik = false;
  servisHarita.secim = null;
}

/* kapId: haritanın çizileceği kutu. ogrenciId: veli ve yönetim için. */
function servisHaritasiAc(kapId, ogrenciId) {
  servisHaritasiDurdur();
  servisHarita.kap = kapId;
  servisHarita.ogrenciId = ogrenciId || '';
  var kap = $(kapId);
  if (!kap) return Promise.resolve();
  kap.innerHTML = '<div class="harita-kap" id="' + kapId + 'Alan"></div><div id="' + kapId + 'Bilgi" class="harita-bilgi"></div>' +
    '<div id="' + kapId + 'Mesaj"></div>';
  servisHarita.h = haritaKur($(kapId + 'Alan'), {
    etiket: 'Servis haritası',
    tiklaninca: function (k) {
      if (!servisHarita.secimAcik) return;
      servisHarita.secim = k;
      servisHaritasiCiz(false);
    }
  });
  return servisHaritasiYenile(true);
}

function servisHaritasiYenile(ilk) {
  var kapId = servisHarita.kap;
  var adres = '/servis/harita' + (servisHarita.ogrenciId ? '?ogrenci=' + encodeURIComponent(servisHarita.ogrenciId) : '');
  return api(adres).then(function (d) {
    if (!servisHarita.h || servisHarita.kap !== kapId) return;
    servisHarita.veri = d;
    servisHaritasiCiz(ilk);
    servisHaritasiZamanla();
  })['catch'](function (e) {
    if (!$(kapId + 'Bilgi')) return;
    $(kapId + 'Bilgi').innerHTML = '<div class="msg hata">' + esc(e.message) + '</div>';
    servisHaritasiZamanla();
  });
}

/* Sefer varken 5 sn, yokken 30 sn'de bir bakılır; sayfa değişince ya da
   sekme arka plandayken durur. */
function servisHaritasiZamanla() {
  if (servisHarita.sayac) clearTimeout(servisHarita.sayac);
  var kapId = servisHarita.kap;
  var sefer = servisHarita.veri && servisHarita.veri.sefer;
  servisHarita.sayac = setTimeout(function () {
    servisHarita.sayac = null;
    if (!$(kapId) || servisHarita.kap !== kapId) { servisHaritasiDurdur(); return; }
    if (document.hidden || servisHarita.secimAcik) { servisHaritasiZamanla(); return; }
    servisHaritasiYenile(false);
  }, sefer ? SERVIS_YENILE_MS : 30000);
}

function servisHaritasiCiz(sigdir) {
  var d = servisHarita.veri, kapId = servisHarita.kap;
  if (!d || !servisHarita.h || !$(kapId + 'Bilgi')) return;
  var isaretler = [];
  if (d.okul && d.okul.enlem !== null && d.okul.enlem !== undefined) {
    isaretler.push({ tur: 'okul', enlem: d.okul.enlem, boylam: d.okul.boylam, etiket: 'Okul' });
  }
  var ev = servisHarita.secimAcik && servisHarita.secim ? servisHarita.secim : d.ev;
  if (ev) isaretler.push({ tur: servisHarita.secimAcik ? 'secim' : 'ev', enlem: ev.enlem, boylam: ev.boylam, etiket: 'Ev' });
  var arac = d.sefer && d.sefer.konum;
  if (arac) isaretler.push({ tur: 'servis', enlem: arac.enlem, boylam: arac.boylam, etiket: (d.servis && d.servis.plaka) || 'Servis' });
  servisHarita.h.isaretler(isaretler);
  if (sigdir) servisHarita.h.sigdir();

  var h = '';
  if (servisHarita.secimAcik) {
    h += '<div class="harita-secim-bilgi">' + ik('konum') +
      '<span>' + (servisHarita.secim ? 'Seçtiğin yer işaretlendi. Doğruysa kaydet.' : 'Haritada evinin olduğu yere dokun.') + '</span></div>' +
      '<div class="dugme-satir">' +
      '<button class="btn kucuk" data-act="ev-kaydet"' + (servisHarita.secim ? '' : ' disabled') + '>Kaydet</button>' +
      '<button class="btn kucuk ghost" data-act="ev-buradayim">Bulunduğum yeri kullan</button>' +
      '<button class="btn kucuk gri" data-act="ev-vazgec">Vazgeç</button></div>';
    $(kapId + 'Bilgi').innerHTML = h;
    return;
  }

  if (!d.servis) {
    h += '<div class="hint">' + esc(d.ogrenci) + ' bir servise kayıtlı değil.</div>';
  } else if (d.sefer && arac) {
    var uzak = d.ev ? ' · eve yaklaşık ' + mesafeYaz(mesafeMetre(arac, d.ev)) : '';
    h += '<div class="harita-durum canli"><span class="canli-nokta"></span><span><b>Servis yolda</b> (' +
      (d.sefer.yon === 'donus' ? 'eve dönüş' : 'okula gidiş') + ') · konum ' + esc(kacSaniyeOnce(d.sefer.sonKonum)) + esc(uzak) + '</span></div>';
  } else if (d.sefer) {
    h += '<div class="harita-durum"><span>Sefer başladı; aracın konumu birkaç dakikadır gelmiyor.</span></div>';
  } else {
    h += '<div class="harita-durum"><span>Şu an sefer yok. Servis yola çıkınca aracın yeri burada görünür.</span></div>';
  }

  h += '<div class="dugme-satir">';
  if (arac) h += googleHaritaBaglantisi(arac, 'Servisi Google Haritalar\'da aç');
  if (d.ev) h += googleHaritaBaglantisi(d.ev, 'Evi Google Haritalar\'da aç');
  if (d.evDuzenleyebilir) {
    h += '<button class="btn kucuk ghost" data-act="ev-sec">' + (d.ev ? 'Evin yerini değiştir' : 'Evimi işaretle') + '</button>';
    if (d.ev) h += '<button class="btn kucuk gri" data-act="ev-sil">Ev işaretini sil</button>';
  }
  h += '</div>';
  if (!d.ev && d.evDuzenleyebilir) {
    h += '<div class="hint">Ev işaretli değil. İşaretlersen servis eve 500 m ve 100 m kala bildirim gelir.</div>';
  }
  if (!d.okul || d.okul.enlem === null || d.okul.enlem === undefined) {
    h += '<div class="hint">Okulun konumu henüz girilmedi (okul yönetimi Ayarlar\'dan girer).</div>';
  }
  $(kapId + 'Bilgi').innerHTML = h;
}

EYLEMLER['ev-sec'] = function () {
  servisHarita.secimAcik = true;
  servisHarita.secim = null;
  servisHaritasiCiz(false);
};
EYLEMLER['ev-vazgec'] = function () {
  servisHarita.secimAcik = false;
  servisHarita.secim = null;
  servisHaritasiCiz(false);
};
EYLEMLER['ev-buradayim'] = function (el) {
  var mesaj = servisHarita.kap + 'Mesaj';
  if (!navigator.geolocation || !window.isSecureContext) {
    mesajGoster(mesaj, 'hata', 'Bu tarayıcı konumu veremiyor (güvenli bağlantı gerekir). Haritada dokunarak seç.');
    return;
  }
  dugmeBekle(el, 'Konum alınıyor...');
  navigator.geolocation.getCurrentPosition(function (p) {
    dugmeBitir(el);
    servisHarita.secim = { enlem: p.coords.latitude, boylam: p.coords.longitude };
    servisHaritasiCiz(false);
    if (servisHarita.h) servisHarita.h.merkezle(servisHarita.secim, 17);
    if (p.coords.accuracy > 100) mesajGoster(mesaj, 'bilgi', 'Konum yaklaşık ' + Math.round(p.coords.accuracy) + ' m hassas; gerekirse haritada düzelt.');
  }, function () {
    dugmeBitir(el);
    mesajGoster(mesaj, 'hata', 'Konum alınamadı. Konum iznini ver ya da haritada dokunarak seç.');
  }, { enableHighAccuracy: true, timeout: 15000, maximumAge: 30000 });
};
EYLEMLER['ev-kaydet'] = function (el) {
  var k = servisHarita.secim;
  if (!k) return;
  dugmeBekle(el, 'Kaydediliyor...');
  return api('/servis/ev', 'POST', { ogrenciId: servisHarita.ogrenciId || undefined, enlem: k.enlem, boylam: k.boylam }).then(function (d) {
    servisHarita.secimAcik = false;
    servisHarita.secim = null;
    mesajGoster(servisHarita.kap + 'Mesaj', 'iyi', d.message);
    return servisHaritasiYenile(false);
  })['catch'](function (e) { dugmeBitir(el); mesajGoster(servisHarita.kap + 'Mesaj', 'hata', e.message); });
};
EYLEMLER['ev-sil'] = function (el) {
  if (!confirm('Ev işareti silinsin mi? Servis yaklaşma bildirimi gelmez olur.')) return;
  el.disabled = true;
  return api('/servis/ev', 'POST', { ogrenciId: servisHarita.ogrenciId || undefined, sil: true }).then(function (d) {
    mesajGoster(servisHarita.kap + 'Mesaj', 'iyi', d.message);
    return servisHaritasiYenile(false);
  })['catch'](function (e) { el.disabled = false; mesajGoster(servisHarita.kap + 'Mesaj', 'hata', e.message); });
};

/* Veli birden çok çocuğun haritası arasında geçer. */
EYLEMLER['servis-harita-cocuk'] = function (el, id) {
  var dugmeler = document.querySelectorAll('[data-act="servis-harita-cocuk"]');
  for (var i = 0; i < dugmeler.length; i++) dugmeler[i].classList.toggle('gri', dugmeler[i] !== el);
  return servisHaritasiAc('servisHaritaKart', id);
};

/* Yönetim: öğrencinin haritası pencerede (ev konumu düzenlenebilir). */
EYLEMLER['servis-harita-modal'] = function (el, id) {
  modalAc((el.getAttribute('data-ad') || 'Öğrenci') + ' — servis haritası', '<div id="servisHaritaModal"></div>');
  return servisHaritasiAc('servisHaritaModal', id);
};

/* Servis sayfasında telefon bildirimini önermek için. */
function servisBildirimOnerisi() {
  if (!bildirimDestegi() || Notification.permission === 'denied') return Promise.resolve('');
  return mevcutAbonelik().then(function (a) {
    return a ? '' : '<div class="kart bildirim-oneri"><div class="satir" style="border:0;padding:0"><div class="buyu">' +
      '<div class="ad">' + ik('bildirim') + 'Servis yaklaşınca haber al</div>' +
      '<div class="alt">Telefon bildirimlerini açarsan uygulama kapalıyken de bildirim gelir.</div></div>' +
      '<button class="btn kucuk" data-act="bildirim-ac">Bildirimleri aç</button></div>' +
      '<div id="bildirimAyarMesaj"></div></div>';
  });
}

/* ================= servisçi: seferler ================= */
var SEFER_GONDER_MS = 5000;        // en sık bu aralıkla gönderilir
var SEFER_NABIZ_MS = 20000;        // araç dursa da bu aralıkla son konum yeniden gider

function seferiDurdur() {
  var sf = S._sefer;
  if (!sf) return;
  if (sf.izle !== null && navigator.geolocation) navigator.geolocation.clearWatch(sf.izle);
  if (sf.nabiz) clearInterval(sf.nabiz);
  if (sf.kilit) { try { sf.kilit.release(); } catch (e) { } }
  document.removeEventListener('visibilitychange', seferKilitTazele);
  S._sefer = null;
}

/* Ekran kararmasın: kararırsa tarayıcı konum vermeyi keser. */
function seferKilitAl() {
  var sf = S._sefer;
  if (!sf || !navigator.wakeLock || document.hidden) return;
  navigator.wakeLock.request('screen').then(function (k) { if (S._sefer === sf) sf.kilit = k; else k.release(); })['catch'](function () { });
}
function seferKilitTazele() { if (!document.hidden) seferKilitAl(); }

function seferKonumGonder(zorla) {
  var sf = S._sefer;
  if (!sf || !sf.son || sf.gonderiliyor) return;
  var simdi = Date.now();
  if (!zorla && simdi - sf.sonGonderim < SEFER_GONDER_MS) return;
  sf.gonderiliyor = true;
  sf.sonGonderim = simdi;
  api('/servis/konum', 'POST', { seferId: sf.id, enlem: sf.son.enlem, boylam: sf.son.boylam, dogruluk: sf.son.dogruluk })
    .then(function () {
      sf.gonderiliyor = false;
      sf.hata = '';
      sf.basariZaman = Date.now();
      seferDurumCiz();
    })['catch'](function (e) {
      sf.gonderiliyor = false;
      if (e.durum === 409) {
        /* Sefer sunucuda kapanmış (bitirildi, servis başkasına verildi). */
        seferiDurdur();
        if (S.page === 'ana' || S.page === 'seferim') git(S.page).then(function () { sayfaMesaji('bilgi', e.message); });
        return;
      }
      sf.hata = e.durum === 429 ? '' : (e.message || 'Konum gönderilemedi');
      seferDurumCiz();
    });
}

function seferIzlemeyiBaslat(sefer) {
  seferiDurdur();
  if (!navigator.geolocation) throw new Error('Bu telefon ya da tarayıcı konum veremiyor.');
  var sf = { id: sefer.id, servisId: sefer.servisId, yon: sefer.yon, izle: null, nabiz: null, kilit: null, son: null,
    sonGonderim: 0, basariZaman: 0, gonderiliyor: false, hata: '' };
  S._sefer = sf;
  sf.izle = navigator.geolocation.watchPosition(function (p) {
    if (S._sefer !== sf) return;
    var onceki = sf.son;
    sf.son = { enlem: p.coords.latitude, boylam: p.coords.longitude, dogruluk: Math.round(p.coords.accuracy || 0) };
    /* 30 m'den fazla yer değiştirdiyse beklemeden gönder (en az 2 sn arayla). */
    var uzak = onceki && mesafeMetre(onceki, sf.son) > 30 && Date.now() - sf.sonGonderim > 2000;
    seferKonumGonder(!!uzak);
    seferBenCiz();
  }, function (hata) {
    if (S._sefer !== sf) return;
    sf.hata = hata.code === 1 ? 'Konum izni verilmedi. Telefonun ayarlarından bu siteye konum izni ver.'
      : 'Konum alınamıyor (GPS kapalı ya da sinyal yok).';
    seferDurumCiz();
  }, { enableHighAccuracy: true, maximumAge: 5000, timeout: 20000 });
  sf.nabiz = setInterval(function () {
    if (S._sefer !== sf) return;
    if (Date.now() - sf.sonGonderim >= SEFER_NABIZ_MS) seferKonumGonder(true);
  }, 5000);
  document.addEventListener('visibilitychange', seferKilitTazele);
  seferKilitAl();
}

var seferHarita = { h: null, veri: null };

SAYFALAR.seferim = function () {
  if (seferHarita.h) { seferHarita.h.yokEt(); seferHarita.h = null; }
  return api('/servis/seferim').then(function (d) {
    seferHarita.veri = d;
    var h = hero('SEFERLERİM', d.okul ? d.okul.ad : '');
    if (!window.isSecureContext) {
      h += '<div class="msg hata">Konum yalnızca güvenli (https) bağlantıda gönderilebilir. Okulun sitesine https ile gir.</div>';
    }
    if (!d.servisler.length) {
      yaz(h + bosKutu('servis', 'Sana atanmış bir servis yok. Okul yönetimi seni bir servise atayınca burada görünür.'));
      return;
    }
    h += '<div class="msg bilgi">Sefere başlayınca konumun servisteki öğrencilere ve velilerine görünür; seferi bitirince kesilir. ' +
      'Konum yalnızca bu uygulama açıkken gider: telefonu kilitleme, şarja takılı tut.</div>';
    var acikSefer = null;
    for (var i = 0; i < d.servisler.length; i++) {
      var s = d.servisler[i];
      if (s.sefer) acikSefer = { id: s.sefer.id, servisId: s.id, yon: s.sefer.yon };
      var buSefer = S._sefer && S._sefer.servisId === s.id;
      h += '<div class="kart sefer-kart"><div class="satir" style="border:0;padding:0"><div class="buyu">' +
        '<div class="ad">' + ik('servis') + esc(s.ad) + (s.plaka ? ' <span class="etiket gri">' + esc(s.plaka) + '</span>' : '') + '</div>' +
        '<div class="alt">' + [s.sabah ? 'sabah ' + esc(s.sabah) : '', s.aksam ? 'akşam ' + esc(s.aksam) : '',
          s.ogrenciler.length + ' öğrenci'].filter(Boolean).join(' · ') + '</div></div></div>';
      if (s.sefer) {
        h += '<div class="sefer-durum" id="seferDurum_' + esc(s.id) + '"></div><div class="dugme-satir">' +
          (buSefer ? '' : '<button class="btn" data-act="sefer-surdur" data-id="' + esc(s.sefer.id) + '" data-servis="' + esc(s.id) +
            '" data-yon="' + esc(s.sefer.yon) + '">Konum göndermeyi sürdür</button>') +
          '<button class="btn tehlike" data-act="sefer-bitir" data-id="' + esc(s.sefer.id) + '">Seferi bitir</button></div>';
      } else {
        h += '<div class="dugme-satir">' +
          '<button class="btn" data-act="sefer-basla" data-id="' + esc(s.id) + '" data-yon="gidis">Okula gidiş seferini başlat</button>' +
          '<button class="btn ghost" data-act="sefer-basla" data-id="' + esc(s.id) + '" data-yon="donus">Eve dönüş seferini başlat</button></div>';
      }
      h += '<details class="sefer-ogrenciler"><summary>Öğrenciler (' + s.ogrenciler.length + ')</summary>';
      for (var j = 0; j < s.ogrenciler.length; j++) {
        var o = s.ogrenciler[j];
        h += '<div class="satir"><div class="buyu"><div class="ad">' + esc(o.ad) + '</div>' +
          '<div class="alt">' + [esc(o.sinif), o.durak ? esc(o.durak) : '', o.ev ? '' : 'ev işaretli değil'].filter(Boolean).join(' · ') + '</div></div>' +
          (o.ev ? '<a class="btn kucuk ghost" href="https://www.google.com/maps/dir/?api=1&destination=' +
            Number(o.ev.enlem).toFixed(6) + ',' + Number(o.ev.boylam).toFixed(6) + '" target="_blank" rel="noopener noreferrer">Yol tarifi</a>' : '') +
          '</div>';
      }
      h += '</details></div>';
    }
    h += '<div class="kart"><h3>' + ik('harita') + 'Harita</h3><div class="harita-kap" id="seferHaritaAlan"></div></div>';
    yaz(h);

    /* Sayfa yenilenmiş ama sefer sunucuda açık: kişi "sürdür" der (konum izni ister). */
    if (S._sefer && (!acikSefer || acikSefer.id !== S._sefer.id)) seferiDurdur();

    seferHarita.h = haritaKur($('seferHaritaAlan'), { etiket: 'Sefer haritası' });
    seferBenCiz(true);
    seferDurumCiz();
  });
};

