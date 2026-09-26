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

/* ================= servis ================= */
function telBaglanti(tel) {
  return tel ? '<a href="tel:' + esc(telefonNorm(tel)) + '">' + esc(telefonGoster(tel)) + '</a>' : '';
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
