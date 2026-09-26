/* Okul sayfası: okulun giriş adresinde (egitimevi.org/<okulun-adi>) giriş
   kartının üstünde duran tanıtım, ve onu düzenleme ekranı.

   Sayfanın yapısı sabittir (kapak, logo, ad, tanıtım, galeri); yazı düz
   metindir. Görünüm ayarlarla ve kısıtlı CSS ile değişir. CSS'i sunucu
   temizler ve yalnızca sayfanın içine uygular (sunucu/yardimci/css-temizle.js);
   buraya gelen CSS temizlenmiş haldedir. */

var OKUL_SAYFA_PARCALARI = [
  ['os-kutu', 'Sayfanın tamamı (zemin, iç boşluk)'],
  ['os-kapak', 'Kapak fotoğrafı'],
  ['os-ust', 'Logo ile okul adının durduğu satır'],
  ['os-logo', 'Logo'],
  ['os-baslik', 'Okulun adı'],
  ['os-yer', 'İlçe ve il'],
  ['os-tanitim', 'Tanıtım yazısı'],
  ['os-galeri', 'Galeri (fotoğrafların dizildiği alan)'],
  ['os-foto', 'Galerideki her fotoğraf']
];

var OS_RENK = /^#[0-9a-f]{6}$/;

/* sayfa: { tanitim, ayarlar, fotolar }, okul: { ad, il, ilce } */
function okulSayfasiHtml(sayfa, okul) {
  var a = sayfa.ayarlar || {};
  var fotolar = sayfa.fotolar || [];
  var kapak = fotolar.filter(function (f) { return f.yer === 'kapak'; })[0];
  var logo = fotolar.filter(function (f) { return f.yer === 'logo'; })[0];
  var galeri = fotolar.filter(function (f) { return f.yer === 'galeri'; });
  var fotoAdresi = function (f) { return '/api/okul-foto/' + encodeURIComponent(f.id); };

  /* Renkler sunucuda da #rrggbb diye denetlenir; burada ikinci kez. */
  var stil = [];
  if (OS_RENK.test(a.renk || '')) stil.push('--os-renk:' + a.renk);
  if (OS_RENK.test(a.zemin || '')) stil.push('--os-zemin:' + a.zemin);
  if (OS_RENK.test(a.yazi || '')) stil.push('--os-yazi:' + a.yazi);
  stil.push('--os-sutun:' + (['2', '3', '4'].indexOf(String(a.galeriSutun)) >= 0 ? a.galeriSutun : '3'));

  var paragraflar = String(sayfa.tanitim || '').split(/\n{2,}/).filter(function (p) { return p.trim(); });
  return '<div class="os-kutu" data-baslik="' + esc(a.baslikBoyu || 'orta') + '" data-kapak="' + esc(a.kapakBoyu || 'orta') + '"' +
    ' data-hiza="' + esc(a.hiza || 'sol') + '" style="' + stil.join(';') + '">' +
    (kapak ? '<img class="os-kapak" src="' + fotoAdresi(kapak) + '" alt="' + esc(kapak.aciklama || '') + '">' : '') +
    '<div class="os-ust">' +
    (logo ? '<img class="os-logo" src="' + fotoAdresi(logo) + '" alt="' + esc(okul.ad) + ' logosu">' : '') +
    '<div><h1 class="os-baslik">' + esc(okul.ad) + '</h1>' +
    '<div class="os-yer">' + esc([okul.ilce, okul.il].filter(Boolean).join(', ')) + '</div></div></div>' +
    (paragraflar.length ? '<div class="os-tanitim">' + paragraflar.map(function (p) { return '<p>' + esc(p.trim()) + '</p>'; }).join('') + '</div>' : '') +
    (galeri.length ? '<div class="os-galeri">' + galeri.map(function (f) {
      return '<img class="os-foto" src="' + fotoAdresi(f) + '" alt="' + esc(f.aciklama || '') + '"' +
        (f.aciklama ? ' title="' + esc(f.aciklama) + '"' : '') + ' loading="lazy">';
    }).join('') + '</div>' : '') +
    '</div>';
}

/* Temizlenmiş CSS'i sayfaya koyar (textContent: HTML olarak okunmaz). */
function okulSayfaStiliYaz(css) {
  var el = $('okulSayfaStil');
  if (!el) {
    el = document.createElement('style');
    el.id = 'okulSayfaStil';
    document.head.appendChild(el);
  }
  el.textContent = css || '';
}

/* Giriş sayfası: okulun sayfası varsa kartın üstüne çizilir. */
function okulSayfasiniCiz() {
  var kap = $('okulSayfa');
  var o = S.okulAdresi;
  var sayfa = o && o.sayfa;
  $('authWrap').classList.toggle('okul-sayfali', !!sayfa);
  if (!sayfa) {
    kap.hidden = true;
    kap.innerHTML = '';
    okulSayfaStiliYaz('');
    return;
  }
  kap.className = 'okul-sayfa genislik-' + (sayfa.ayarlar && sayfa.ayarlar.genislik === 'dar' ? 'dar' : 'genis');
  kap.innerHTML = okulSayfasiHtml(sayfa, o);
  kap.hidden = false;
  okulSayfaStiliYaz(sayfa.css);
}

/* ================= düzenleme ekranı ================= */
var OS = { veri: null, temizCss: '', sayac: null };

SAYFALAR['okul-sayfasi'] = function () {
  return api('/okul-sayfa').then(function (d) {
    OS.veri = d;
    OS.temizCss = d.temizCss || '';
    var adres = location.host + '/' + d.okul.kisaAd;
    var a = d.ayarlar;
    var sec = function (id, deger, liste) {
      return '<select id="' + id + '">' + liste.map(function (s) {
        return '<option value="' + s[0] + '"' + (deger === s[0] ? ' selected' : '') + '>' + s[1] + '</option>';
      }).join('') + '</select>';
    };
    var renkAlani = function (anahtar, etiket, ipucu) {
      return '<div class="field os-renk-alan"><label for="osRenk-' + anahtar + '">' + etiket + '</label>' +
        '<div class="os-renk-satir"><input type="color" id="osRenk-' + anahtar + '" data-os-renk="' + anahtar + '"' +
        ' value="' + (a[anahtar] || osVarsayilanRenk(anahtar)) + '">' +
        '<span class="os-renk-durum" id="osRenkDurum-' + anahtar + '">' + (a[anahtar] ? esc(a[anahtar]) : 'Varsayılan') + '</span>' +
        '<button type="button" class="btn kucuk gri" data-act="os-renk-sifirla" data-id="' + anahtar + '">Varsayılan</button></div>' +
        '<div class="hint">' + ipucu + '</div></div>';
    };

    var h = hero('OKUL SAYFASI', 'Okulunun giriş adresinde, giriş kartının üstünde görünür. Adresi bilen herkes görebilir.');
    h += '<div class="kart os-adres-kart"><div class="satir" style="border:0;padding:0"><div class="buyu">' +
      '<div class="alt">Sayfanın adresi</div><div class="ad">' + esc(adres) + '</div></div>' +
      '<a class="btn gri kucuk" href="/' + esc(d.okul.kisaAd) + '" target="_blank" rel="noopener">Sayfayı aç</a></div></div>';

    h += '<div class="os-duzen"><div class="os-ayarlar">';
    /* ---- görünüm ---- */
    h += '<div class="kart"><h3>Görünüm</h3>' +
      '<div class="row2">' + renkAlani('renk', 'Ana renk', 'Okulun adı ve çizgiler.') +
      renkAlani('zemin', 'Zemin', 'Sayfanın arka planı.') + '</div>' +
      '<div class="row2">' + renkAlani('yazi', 'Yazı rengi', 'Koyu zeminde açık renk seç.') +
      '<div class="field"><label for="osBaslik">Okul adının boyu</label>' +
      sec('osBaslik', a.baslikBoyu, [['kucuk', 'Küçük'], ['orta', 'Orta'], ['buyuk', 'Büyük']]) + '</div></div>' +
      '<div class="row2"><div class="field"><label for="osKapak">Kapak fotoğrafının yüksekliği</label>' +
      sec('osKapak', a.kapakBoyu, [['kisa', 'Kısa'], ['orta', 'Orta'], ['uzun', 'Uzun']]) + '</div>' +
      '<div class="field"><label for="osHiza">Okul adının yeri</label>' +
      sec('osHiza', a.hiza, [['sol', 'Solda'], ['orta', 'Ortada']]) + '</div></div>' +
      '<div class="row2"><div class="field"><label for="osGenislik">Sayfanın genişliği</label>' +
      sec('osGenislik', a.genislik, [['genis', 'Geniş'], ['dar', 'Dar (giriş kartı kadar)']]) + '</div>' +
      '<div class="field"><label for="osSutun">Galeride yan yana</label>' +
      sec('osSutun', a.galeriSutun, [['2', '2 fotoğraf'], ['3', '3 fotoğraf'], ['4', '4 fotoğraf']]) + '</div></div></div>';

    /* ---- tanıtım ---- */
    h += '<div class="kart"><h3>Tanıtım yazısı</h3>' +
      '<div class="field"><label for="osTanitim">Okulunu birkaç cümleyle anlat</label>' +
      '<textarea id="osTanitim" rows="6" maxlength="1500">' + esc(d.tanitim) + '</textarea>' +
      '<div class="hint"><span id="osTanitimSayac"></span> Paragrafları boş bir satırla ayır. Bağlantı ve biçim eklenemez; ' +
      'yazı olduğu gibi görünür.</div></div></div>';

    /* ---- fotoğraflar ---- */
    h += '<div class="kart"><h3>Fotoğraflar</h3>' +
      '<p class="hint" style="margin-top:0">PNG, JPEG ya da WebP, en fazla 3 MB. Fotoğraftaki konum ve cihaz bilgisi ' +
      'kaydedilmeden önce silinir. Öğrencilerin yüzü görünen fotoğraflar için velilerin iznini almayı unutma.</p>' +
      '<div id="osFotolar"></div>' +
      '<input type="file" id="osDosya" accept="image/png,image/jpeg,image/webp" hidden>' +
      '<div id="osFotoMesaj"></div></div>';

    /* ---- CSS ---- */
    h += '<div class="kart"><details class="os-css"' + (d.css ? ' open' : '') + '><summary><h3>Kendi CSS\'in</h3>' +
      '<span class="hint">İsteğe bağlı. Kodlayıcı rolü için.</span></summary>' +
      '<p class="hint">Yalnızca sayfanın parçaları seçilebilir; dış adres (url), @import, position, z-index, ' +
      'transform ve content kullanılamaz. Kullanılamayan kısımlar atılır, nedeni aşağıda yazar.</p>' +
      '<div class="os-parcalar">' + OKUL_SAYFA_PARCALARI.map(function (p) {
        return '<div><code>.' + p[0] + '</code><span>' + esc(p[1]) + '</span></div>';
      }).join('') + '</div>' +
      '<div class="field"><label for="osCss">CSS</label>' +
      '<textarea id="osCss" class="os-css-kutu" rows="10" maxlength="8000" spellcheck="false" autocapitalize="off" ' +
      'placeholder=".os-baslik { letter-spacing: 1px; }&#10;.os-foto { border-radius: 12px; }">' + esc(d.css) + '</textarea></div>' +
      '<button type="button" class="btn gri kucuk" data-act="os-css-onizle">CSS\'i önizlemede dene</button>' +
      '<div id="osUyarilar"></div></details></div>';

    h += '<div class="os-kaydet"><button class="btn" data-act="os-kaydet">Kaydet</button><div id="osMesaj"></div></div>';
    h += '</div>';

    /* ---- önizleme ---- */
    h += '<div class="os-onizleme-kap"><h3 class="sb">Önizleme</h3>' +
      '<section class="okul-sayfa" id="osOnizleme"></section></div></div>';
    yaz(h);

    var yenile = function () { osOnizlemeCiz(); };
    ['osBaslik', 'osKapak', 'osHiza', 'osGenislik', 'osSutun'].forEach(function (id) { $(id).addEventListener('change', yenile); });
    ['renk', 'zemin', 'yazi'].forEach(function (k) {
      $('osRenk-' + k).addEventListener('input', function () {
        this.setAttribute('data-secildi', '1');
        $('osRenkDurum-' + k).textContent = this.value;
        osOnizlemeCiz();
      });
      if (a[k]) $('osRenk-' + k).setAttribute('data-secildi', '1');
    });
    $('osTanitim').addEventListener('input', function () { osTanitimSayac(); yenile(); });
    $('osDosya').addEventListener('change', osDosyaSecildi);
    osTanitimSayac();
    osFotolariCiz();
    osUyarilariCiz(d.uyarilar || []);
    osOnizlemeCiz();
  });
};

