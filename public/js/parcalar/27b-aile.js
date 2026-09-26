/* Veli: Çocuğumun telefonu (Eğitim Evi Aile). Çocuğun telefonundaki uygulama
   konumu ve uygulama kullanım sürelerini gönderir; veli burada son konumu
   haritada, bugünün ve son 8 günün ekran süresini görür, gönderme sıklığını
   (Wi-Fi ve mobil veri ayrı) ve sınırları seçer. Sınır aşılınca bildirim
   gelir; uygulama kapatılmaz. Okul bu sayfayı görmez; veriler 7 gün sonra
   silinir. Birden çok çocukta üstteki şeritten çocuk seçilir. */

var AILE = { harita: null, veri: null };
var AILE_ARALIK = [1, 5, 10, 15, 30, 60];
var AILE_SINIR = [0, 30, 60, 90, 120, 180, 240, 300];
var AILE_APK = 'https://github.com/KARANKOYU/Egitim-Evi-App/releases/latest/download/egitim-evi.apk';

function aileSure(dk) {
  dk = Number(dk) || 0;
  var s = Math.floor(dk / 60), d = dk % 60;
  return s ? s + ' sa' + (d ? ' ' + d + ' dk' : '') : d + ' dk';
}

/* "3 dakika önce", "dün 21:40" */
function aileOnce(iso) {
  if (!iso) return 'hiç';
  var t = new Date(iso), fark = Math.round((Date.now() - t.getTime()) / 60000);
  if (fark < 1) return 'az önce';
  if (fark < 60) return fark + ' dakika önce';
  if (fark < 24 * 60 && t.getDate() === new Date().getDate()) return 'bugün ' + tsIki(t.getHours()) + ':' + tsIki(t.getMinutes());
  return tarihGun(tsIso(t)) + ' ' + tsIki(t.getHours()) + ':' + tsIki(t.getMinutes());
}

function aileHaritaKapat() {
  if (AILE.harita) { AILE.harita.yokEt(); AILE.harita = null; }
}

/* Bu sayfada "Hepsi" yok: her zaman tek çocuk. */
function aileCocugu() {
  var c = veliCocuklar();
  var s = veliSeciliCocuk();
  return s || c[0] || null;
}

SAYFALAR.aile = function () {
  aileHaritaKapat();
  var cocuk = aileCocugu();
  if (!cocuk) { veliCocukYok('ÇOCUĞUMUN TELEFONU'); return; }
  return api('/aile/ozet?studentId=' + encodeURIComponent(cocuk.id)).then(function (d) {
    AILE.veri = d;
    var c = veliCocuklar();
    var h = hero('ÇOCUĞUMUN TELEFONU', esc(d.ogrenci.ad) + ' · konum ve ekran süresi. Yalnızca sen ve öteki velisi görür; ' +
      'okul görmez. Veriler ' + d.saklamaGun + ' gün sonra silinir.');
    if (c.length > 1) {
      h += '<div class="cocuk-seridi">';
      for (var i = 0; i < c.length; i++) {
        h += '<button class="sekme kucuk' + (c[i].id === cocuk.id ? ' secili' : '') + '" data-act="aile-cocuk" data-id="' +
          esc(c[i].id) + '">' + esc(c[i].fullName) + '</button>';
      }
      h += '</div>';
    }
    h += d.cihazlar.length ? aileCihazKarti(d) : aileKurulumKarti(d);
    h += '<div class="aile-izgara">' + aileKonumKarti(d) + aileSureKarti(d) + '</div>';
    h += aileAyarKarti(d);
    yaz(h);
    if (d.sonKonum) {
      AILE.harita = haritaKur($('aileHarita'), { merkez: d.sonKonum, zoom: 15, etiket: 'Çocuğun son konumu' });
      var isaretler = d.konumlar.slice(1, 12).reverse().map(function (k) {
        return { tur: 'secim', enlem: k.enlem, boylam: k.boylam, etiket: aileOnce(k.zaman) };
      });
      isaretler.push({ tur: 'ben', enlem: d.sonKonum.enlem, boylam: d.sonKonum.boylam, etiket: 'Son konum · ' + aileOnce(d.sonKonum.zaman) });
      AILE.harita.isaretler(isaretler);
    }
  });
};

function aileKurulumKarti(d) {
  var ad = esc(d.ogrenci.ad.split(' ')[0]);
  return '<div class="kart aile-kurulum"><h3>' + ad + '\'in telefonu henüz bağlı değil</h3><ol>' +
    '<li><b>Eğitim Evi Aile</b> uygulamasını ' + ad + '\'in Android telefonuna kur ' +
    '(<a href="' + AILE_APK + '" target="_blank" rel="noopener">GitHub\'dan APK</a>).</li>' +
    '<li>Uygulamada ' + ad + '\'in <b>öğrenci hesabıyla</b> giriş yap; paylaşımı ' + ad + ' kendisi onaylar.</li>' +
    '<li>İzinleri ver: <b>Konum — Her zaman izin ver</b>, <b>Kullanım erişimi</b>, <b>Bildirimler</b> ve ' +
    '<b>arka planda çalışma</b> (uygulamanın pil ayarında <b>Kısıtlamasız</b>).</li></ol>' +
    '<p class="hint">Uygulama hiçbir uygulamayı kapatmaz ya da kilitlemez; yalnızca konumu ve süreleri gönderir. ' +
    'iPhone\'da çalışmaz (Apple buna izin vermiyor).</p></div>';
}

function aileCihazKarti(d) {
  var h = '<div class="kart aile-cihazlar"><h3>Bağlı telefon</h3>';
  for (var i = 0; i < d.cihazlar.length; i++) {
    var c = d.cihazlar[i];
    h += '<div class="satir"><span class="aile-simge">' + ik('telefon') + '</span><div class="buyu"><div class="ad">' + esc(c.ad || 'Telefon') + '</div>' +
      '<div class="alt">Son görülme: ' + aileOnce(c.sonGorulme) + ' · bağlandı ' + tarihGun(String(c.olusturma).slice(0, 10)) + '</div></div>' +
      '<button class="btn kucuk gri" data-act="aile-cihaz-kaldir" data-id="' + esc(c.id) + '">Bağlantıyı kaldır</button></div>';
  }
  return h + '</div>';
}

function aileKonumKarti(d) {
  var h = '<div class="kart aile-konum"><h3>Konum</h3>';
  if (!d.ayar.konumAcik) return h + '<p class="hint">Konum paylaşımı kapalı (aşağıdaki ayarlardan açılır).</p></div>';
  if (!d.sonKonum) return h + '<p class="hint">Henüz konum gelmedi. Telefon internete bağlanınca gelir.</p></div>';
  var k = d.sonKonum;
  h += '<div class="harita-kap" id="aileHarita"></div>' +
    '<div class="aile-konum-bilgi"><b>Son konum: ' + aileOnce(k.zaman) + '</b>' +
    '<span>' + (k.ag === 'wifi' ? 'Wi-Fi' : k.ag === 'mobil' ? 'Mobil veri' : 'Bağlantısız alındı') +
    (k.dogruluk !== null && k.dogruluk !== undefined ? ' · yaklaşık ' + k.dogruluk + ' m' : '') +
    (k.pil !== null && k.pil !== undefined ? ' · pil %' + k.pil : '') + '</span></div>' +
    '<div class="aile-dugmeler">' + googleHaritaBaglantisi(k) +
    '<button class="btn kucuk ghost" data-nav="servis">' + ik('servis') + 'Servisi</button></div>';
  return h + '</div>';
}

function aileSureKarti(d) {
  var h = '<div class="kart aile-sure"><h3>Ekran süresi</h3>';
  if (!d.ayar.kullanimAcik) return h + '<p class="hint">Ekran süresi paylaşımı kapalı.</p></div>';
  var bugun = d.kullanim.bugun, toplam = 0;
  for (var i = 0; i < bugun.length; i++) toplam += bugun[i].dakika;
  h += '<div class="aile-toplam"><b>' + aileSure(toplam) + '</b><span>bugün' +
    (d.ayar.toplamSinir ? ' · sınır ' + aileSure(d.ayar.toplamSinir) : '') + '</span></div>';
  if (d.ayar.toplamSinir && toplam > d.ayar.toplamSinir) h += '<div class="msg uyari">Bugünkü toplam sınır geçildi.</div>';

  /* son 8 gün: günlük toplam çubukları */
  var enCok = 1;
  for (var g = 0; g < d.kullanim.gunler.length; g++) enCok = Math.max(enCok, d.kullanim.gunler[g].toplam, d.ayar.toplamSinir || 0);
  h += '<div class="aile-gunler" role="img" aria-label="Son 8 günün ekran süresi">';
  for (g = 0; g < d.kullanim.gunler.length; g++) {
    var gn = d.kullanim.gunler[g];
    h += '<div class="aile-gun" title="' + esc(tarihGun(gn.gun) + ': ' + aileSure(gn.toplam)) + '">' +
      '<span class="aile-cubuk' + (d.ayar.toplamSinir && gn.toplam > d.ayar.toplamSinir ? ' asti' : '') + '" style="height:' +
      Math.round(gn.toplam / enCok * 100) + '%"></span><small>' + esc(gunAdi(gn.gun).slice(0, 3)) + '</small></div>';
  }
  h += '</div>';

  /* bugün uygulama uygulama */
  if (!bugun.length) return h + '<p class="hint">Bugün için süre gelmedi.</p></div>';
  var sinir = {};
  for (var s = 0; s < d.sinirlar.length; s++) sinir[d.sinirlar[s].paket] = d.sinirlar[s].dakika;
  var ust = bugun[0].dakika || 1;
  h += '<div class="aile-uygulamalar">';
  for (i = 0; i < Math.min(12, bugun.length); i++) {
    var u = bugun[i], sn = sinir[u.paket];
    h += '<div class="aile-uygulama"><div class="aile-uyg-ust"><span>' + esc(u.ad) + '</span><b>' + aileSure(u.dakika) +
      (sn ? ' <span class="soluk">/ ' + aileSure(sn) + '</span>' : '') + '</b></div>' +
      '<div class="aile-bar"><span class="' + (sn && u.dakika > sn ? 'asti' : '') + '" style="width:' +
      Math.max(2, Math.round(u.dakika / ust * 100)) + '%"></span></div></div>';
  }
  return h + '</div></div>';
}

function aileAyarKarti(d) {
  var a = d.ayar;
  var secim = function (id, deger, liste, yazi) {
    return '<select id="' + id + '">' + liste.map(function (v) {
      return '<option value="' + v + '"' + (Number(deger) === v ? ' selected' : '') + '>' + yazi(v) + '</option>';
    }).join('') + '</select>';
  };
  var dk = function (v) { return v + ' dakikada bir'; };
  var h = '<div class="kart aile-ayar"><h3>Ayarlar</h3>' +
    '<label class="onay"><input type="checkbox" id="aileKonum"' + (a.konumAcik ? ' checked' : '') + '><span>Konumu paylaş</span></label>' +
    '<div class="row2"><div class="field"><label for="aileWifi">Wi-Fi\'deyken</label>' + secim('aileWifi', a.wifiDk, AILE_ARALIK, dk) + '</div>' +
    '<div class="field"><label for="aileMobil">Mobil veride</label>' + secim('aileMobil', a.mobilDk, AILE_ARALIK, dk) + '</div></div>' +
    '<p class="hint">Telefon internete bağlı değilken konumlar telefonda birikir, bağlandığı ilk anda gelir. ' +
    'Sık konum pili daha çabuk bitirir; mobil veride seyrek seçmek iyi olur.</p>' +
    '<label class="onay"><input type="checkbox" id="aileKullanim"' + (a.kullanimAcik ? ' checked' : '') + '><span>Ekran süresini paylaş</span></label>' +
    '<div class="field"><label for="aileToplam">Günlük toplam sınır (ortak)</label>' +
    secim('aileToplam', a.toplamSinir || 0, AILE_SINIR, function (v) { return v ? aileSure(v) : 'Sınır yok'; }) + '</div>' +
    '<div class="field"><label>Uygulama başına sınır</label><div id="aileSinirlar">';
  for (var i = 0; i < d.sinirlar.length; i++) h += aileSinirSatiri(d.sinirlar[i]);
  h += '</div>';
  var secilebilir = d.kullanim.hafta.filter(function (u) { return !d.sinirlar.some(function (s) { return s.paket === u.paket; }); });
  if (secilebilir.length) {
    h += '<div class="aile-sinir-ekle"><select id="aileYeniUyg"><option value="">Uygulama seç...</option>' +
      secilebilir.map(function (u) {
        return '<option value="' + esc(u.paket) + '" data-ad="' + esc(u.ad) + '">' + esc(u.ad) + ' (bu hafta ' + aileSure(u.dakika) + ')</option>';
      }).join('') + '</select><button type="button" class="btn kucuk ghost" data-act="aile-sinir-ekle">Sınır ekle</button></div>';
  } else {
    h += '<p class="hint">Telefondan süre geldikçe uygulamalar burada seçilebilir.</p>';
  }
  h += '<p class="hint">Sınır geçilince sana bildirim gelir (günde bir kez). Uygulama kapatılmaz.</p></div>' +
    '<div id="aileMesaj"></div><button class="btn" data-act="aile-kaydet">Kaydet</button></div>';
  return h;
}

function aileSinirSatiri(s) {
  var dakikalar = [15, 30, 45, 60, 90, 120, 180, 240];
  if (dakikalar.indexOf(s.dakika) < 0) dakikalar.push(s.dakika);
  dakikalar.sort(function (a, b) { return a - b; });
  return '<div class="aile-sinir" data-paket="' + esc(s.paket) + '" data-ad="' + esc(s.ad) + '"><span>' + esc(s.ad) + '</span>' +
    '<select aria-label="' + esc(s.ad) + ' için günlük sınır">' + dakikalar.map(function (v) {
      return '<option value="' + v + '"' + (v === s.dakika ? ' selected' : '') + '>' + aileSure(v) + '</option>';
    }).join('') + '</select><button type="button" class="btn kucuk gri" data-act="aile-sinir-sil">Kaldır</button></div>';
}

EYLEMLER['aile-cocuk'] = function (el, id) {
  S.veliCocuk = id;
  return git('aile');
};

EYLEMLER['aile-sinir-ekle'] = function () {
  var s = $('aileYeniUyg');
  if (!s || !s.value) return;
  var o = s.options[s.selectedIndex];
  $('aileSinirlar').insertAdjacentHTML('beforeend', aileSinirSatiri({ paket: s.value, ad: o.getAttribute('data-ad'), dakika: 60 }));
  s.removeChild(o);
  s.value = '';
};

EYLEMLER['aile-sinir-sil'] = function (el) {
  var satir = el.closest('.aile-sinir');
  if (satir) satir.parentNode.removeChild(satir);
};

EYLEMLER['aile-kaydet'] = function (el) {
  var d = AILE.veri;
  if (!d) return;
  var sinirlar = Array.prototype.map.call(document.querySelectorAll('#aileSinirlar .aile-sinir'), function (x) {
    return { paket: x.getAttribute('data-paket'), ad: x.getAttribute('data-ad'), dakika: Number(x.querySelector('select').value) };
  });
  var toplam = Number($('aileToplam').value);
  dugmeBekle(el, 'Kaydediliyor...');
  return api('/aile/ayar', 'POST', {
    studentId: d.ogrenci.id, wifiDk: Number($('aileWifi').value), mobilDk: Number($('aileMobil').value),
    konumAcik: $('aileKonum').checked, kullanimAcik: $('aileKullanim').checked,
    toplamSinir: toplam || null, sinirlar: sinirlar
  }).then(function () {
    return git('aile').then(function () { sayfaMesaji('iyi', 'Kaydedildi. Telefon yeni ayarı en geç yarım saat içinde alır.'); });
  })['catch'](function (e) { dugmeBitir(el); mesajGoster('aileMesaj', 'hata', e.message); });
};

EYLEMLER['aile-cihaz-kaldir'] = function (el, id) {
  if (!confirm('Bu telefonun bağlantısı kaldırılsın mı? Uygulama konum ve süre göndermeyi bırakır.')) return;
  var d = AILE.veri;
  return api('/aile/cihaz-kaldir', 'POST', { studentId: d.ogrenci.id, cihazId: id })
    .then(function () { return git('aile'); })['catch'](hataGoster);
};
