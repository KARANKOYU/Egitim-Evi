/* Okulun adresi (egitimevi.org/<ad>) ve haritadaki yeri. Yalnızca müdür.
   Adres, öğrenci ve öğretmenlerin girdiği sayfadır; değişince eski adres
   çalışmaz olur. Okulun konumu servis haritasında okul işaretidir. */

var okulAyar = { h: null, secim: null, veri: null };

/* Sunucudaki kisaAdSorunu ile aynı biçim kuralı (yasak adları sunucu söyler). */
function okulAdresiSorunuTR(s) {
  if (!s) return 'Okulun adres adını yaz.';
  if (s.length < 3) return 'Adres adı en az 3 karakter olmalı.';
  if (s.length > 40) return 'Adres adı en fazla 40 karakter olabilir.';
  if (!/^[a-z0-9][a-z0-9-]*[a-z0-9]$/.test(s)) return 'Yalnızca küçük harf (Türkçe harf olmadan), rakam ve tire; tireyle başlayıp bitemez.';
  if (/--/.test(s)) return 'İki tire yan yana olamaz.';
  return '';
}

SAYFALAR['okul-ayarlari'] = function () {
  if (okulAyar.h) { okulAyar.h.yokEt(); okulAyar.h = null; }
  okulAyar.secim = null;
  return api('/school/adres').then(function (d) {
    okulAyar.veri = d;
    var tam = location.host + '/' + d.kisaAd;
    var h = hero('OKUL ADRESİ VE KONUMU', d.ad);
    h += '<div class="kart"><h3>Okulun giriş adresi</h3>' +
      '<p class="hint" style="margin-top:0">Öğrenci, öğretmen ve servisçiler bu adresten girer. Aynı kullanıcı adı başka ' +
      'okulda da olabilir; girişte okul bu adresten anlaşılır.</p>' +
      (d.kisaAd ? '<div class="satir" style="border:0;padding:0 0 12px"><div class="buyu"><div class="ad adres-goster">' + esc(tam) + '</div></div>' +
        '<button class="btn kucuk ghost" data-act="kod-kopyala" data-kod="' + esc(location.protocol + '//' + tam) + '">Bağlantıyı kopyala</button></div>' : '') +
      '<div class="field"><label for="oaKisa">Adres adı</label>' +
      '<div class="adres-girdi"><span>' + esc(location.host) + '/</span>' +
      '<input type="text" id="oaKisa" maxlength="40" autocomplete="off" autocapitalize="off" spellcheck="false" value="' + esc(d.kisaAd || '') + '"></div>' +
      '<div class="hint">Küçük harf, rakam ve tire. Değiştirirsen eski adres çalışmaz; yeni adresi herkese duyur.</div></div>' +
      '<button class="btn" data-act="okul-adres-kaydet">Adresi kaydet</button><div id="oaMesaj" style="margin-top:9px"></div></div>';

    h += '<div class="kart"><h3>' + ik('harita') + 'Okulun haritadaki yeri</h3>' +
      '<p class="hint" style="margin-top:0">Servis haritasında okul işareti buraya konur. Haritada okulun olduğu yere dokun, sonra kaydet.</p>' +
      '<div class="harita-kap" id="oaHarita"></div>' +
      '<div class="dugme-satir" style="margin-top:10px">' +
      '<button class="btn" data-act="okul-konum-kaydet" id="oaKonumKaydet" disabled>Konumu kaydet</button>' +
      (d.enlem !== null && d.enlem !== undefined ? googleHaritaBaglantisi({ enlem: d.enlem, boylam: d.boylam }) +
        '<button class="btn gri" data-act="okul-konum-sil">Konumu sil</button>' : '') + '</div>' +
      '<div id="oaKonumMesaj" style="margin-top:9px"></div></div>';
    yaz(h);

    $('oaKisa').addEventListener('input', function () {
      var y = aramaSadeTR(this.value.replace(/-/g, ' ')).replace(/ /g, '-');
      if (/[-\s]$/.test(this.value) && y) y += '-';
      if (y !== this.value) this.value = y;
    });

    var var_ = d.enlem !== null && d.enlem !== undefined;
    okulAyar.h = haritaKur($('oaHarita'), {
      merkez: var_ ? { enlem: d.enlem, boylam: d.boylam } : null,
      zoom: var_ ? 16 : 6,
      etiket: 'Okulun konumu',
      tiklaninca: function (k) {
        okulAyar.secim = k;
        okulAyar.h.isaretler([{ tur: 'secim', enlem: k.enlem, boylam: k.boylam, etiket: 'Okul' }]);
        if ($('oaKonumKaydet')) $('oaKonumKaydet').disabled = false;
      }
    });
    if (var_) okulAyar.h.isaretler([{ tur: 'okul', enlem: d.enlem, boylam: d.boylam, etiket: 'Okul' }]);
  });
};

EYLEMLER['okul-adres-kaydet'] = function (el) {
  var kutu = $('oaKisa');
  alanTemizle(kutu.closest('.field'));
  var kisa = kutu.value.trim().replace(/-+$/, '');
  var sorun = okulAdresiSorunuTR(kisa);
  if (sorun) { alanHatasi(kutu, sorun); return; }
  if (okulAyar.veri && kisa === okulAyar.veri.kisaAd) { mesajGoster('oaMesaj', 'bilgi', 'Adres zaten bu.'); return; }
  if (okulAyar.veri && okulAyar.veri.kisaAd &&
      !confirm('Okulun adresi ' + location.host + '/' + kisa + ' olsun mu?\n\nEski adres (' + okulAyar.veri.kisaAd + ') çalışmaz olur.')) return;
  dugmeBekle(el, 'Kaydediliyor...');
  return api('/school/adres', 'POST', { kisaAd: kisa }).then(function (d) {
    S.user.schoolSlug = d.kisaAd;
    okulYolunuAyarla();
    return git('okul-ayarlari').then(function () { sayfaMesaji('iyi', d.message); });
  })['catch'](function (e) { dugmeBitir(el); alanHatasi(kutu, e.message); });
};

