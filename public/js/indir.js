/* egitimevi.org/indir: Android uygulamasının sürüm tablosu.
   Sürümler sunucudan gelir (/api/uygulama; sunucu GitHub'daki sürümleri süzüp
   15 dakika saklar). İçerik Güvenlik Politikası satır içi betiğe izin vermediği
   için ayrı dosya. */
(function () {
  'use strict';

  var ISARET = '<svg class="ikon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" ' +
    'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3v12"/>' +
    '<path d="m7.5 11 4.5 4.5 4.5-4.5"/><path d="M4 20h16"/></svg>';

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function tarihYaz(iso) {
    var t = new Date(iso);
    if (isNaN(t.getTime())) return '';
    try { return t.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' }); }
    catch (e) { return iso.slice(0, 10); }
  }

  function boyutYaz(b) {
    if (b < 1024 * 1024) return Math.max(1, Math.round(b / 1024)) + ' KB';
    return (Math.round(b / 1024 / 1024 * 10) / 10).toString().replace('.', ',') + ' MB';
  }

  function indirDugmesi(s, buyuk) {
    return '<a class="btn' + (buyuk ? '' : ' kucuk ghost') + '" href="' + esc(s.apk.adres) + '" rel="noopener" ' +
      'aria-label="Sürüm ' + esc(s.surum) + ' APK dosyasını indir (' + esc(boyutYaz(s.apk.boyut)) + ')">' +
      ISARET + 'İndir' + (buyuk ? ' (APK, ' + esc(boyutYaz(s.apk.boyut)) + ')' : '') + '</a>';
  }

  function ciz(d) {
    var son = document.getElementById('indirSon');
    var tablo = document.getElementById('indirTablo');
    var liste = (d && Array.isArray(d.surumler)) ? d.surumler : [];
    var play = d && typeof d.playStore === 'string' && /^https:\/\/play\.google\.com\//.test(d.playStore) ? d.playStore : '';
    var playDugme = play ? '<a class="btn ghost" href="' + esc(play) + '" target="_blank" rel="noopener">Google Play\'den yükle</a>' : '';
    var githubSayfa = (d && /^https:\/\/github\.com\//.test(d.sayfa || '')) ? d.sayfa : 'https://github.com/KARANKOYU/Egitim-Evi-App/releases';

    if (!liste.length) {
      son.innerHTML = '<div><div class="baslik">Sürüm listesi şu an alınamadı</div>' +
        '<div class="alt">Bütün sürümler GitHub\'daki sayfada da duruyor.</div></div>' +
        '<div class="dugmeler">' + playDugme + '<a class="btn" href="' + esc(githubSayfa) + '" target="_blank" rel="noopener">' +
        'GitHub\'daki sürümler</a></div>';
      tablo.innerHTML = '';
      return;
    }

    var s0 = liste[0];
    son.innerHTML = '<div><div class="baslik">Son sürüm ' + esc(s0.surum) + '</div>' +
      '<div class="alt">' + esc(tarihYaz(s0.tarih)) + ' · Android 8.0 ve üstü</div></div>' +
      '<div class="dugmeler">' + indirDugmesi(s0, true) + playDugme + '</div>';

    var h = '<table class="indir-tablo"><thead><tr><th scope="col">Sürüm</th><th scope="col">Tarih</th>' +
      '<th scope="col">Neler değişti</th><th scope="col">Boyut</th><th scope="col">Dosya</th></tr></thead><tbody>';
    for (var i = 0; i < liste.length; i++) {
      var s = liste[i];
      h += '<tr>' +
        '<td class="surum" data-baslik="Sürüm">' + esc(s.surum) + (i === 0 ? '<span class="etiket-son">son</span>' : '') + '</td>' +
        '<td class="tarih" data-baslik="Tarih">' + esc(tarihYaz(s.tarih)) + '</td>' +
        '<td class="notlar">' + esc(s.notlar || s.ad) +
          (s.apk.sha256 ? '<span class="ozet" title="SHA-256 özeti">SHA-256: ' + esc(s.apk.sha256) + '</span>' : '') + '</td>' +
        '<td class="boyut" data-baslik="Boyut">' + esc(boyutYaz(s.apk.boyut)) + '</td>' +
        '<td>' + indirDugmesi(s, false) + '</td>' +
        '</tr>';
    }
    tablo.innerHTML = h + '</tbody></table>';
  }

  /* ---- iPhone ve iPad: ana ekrana ekleme ---- */

  /* Ana ekrandan açıldıysa (iPhone'da tam ekran) indirme sayfası değil site açılsın. */
  var tamEkran = window.navigator.standalone === true ||
    (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches);
  if (tamEkran) { location.replace('/'); return; }

  var ua = navigator.userAgent || '';
  /* iPadOS 13+ kendini Mac diye tanıtır; dokunmatik ekranından anlaşılır. */
  var ios = /iPhone|iPad|iPod/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1);
  var safariDisi = /CriOS|FxiOS|EdgiOS|OPiOS|GSA\//.test(ua);

  var dugme = document.getElementById('iosEkle');
  var adimlar = document.getElementById('iosAdimlar');
  var not = document.getElementById('iosNot');
  if (dugme && adimlar) {
    dugme.addEventListener('click', function () {
      var ac = adimlar.hidden;
      adimlar.hidden = !ac;
      dugme.setAttribute('aria-expanded', ac ? 'true' : 'false');
      if (!ac) return;
      if (!ios) {
        not.textContent = 'Bu adımlar iPhone ya da iPad içindir. Telefonunda ' + location.host + '/indir adresini aç ve bu düğmeye orada bas.';
      } else if (safariDisi) {
        not.textContent = 'Safari dışında bir tarayıcıdasın. iOS 16.4 ve üstünde Chrome ve Edge de ana ekrana ekleyebilir; ' +
          'Paylaş düğmesini bulamazsan sayfayı Safari ile aç.';
      } else {
        not.textContent = 'Aşağıdaki adımları izle; bir kez yapman yeterli.';
      }
      adimlar.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  }

  if (!window.fetch) { ciz(null); return; }
  fetch('/api/uygulama', { credentials: 'omit' })
    .then(function (r) { return r.ok ? r.json() : null; })
    .then(ciz)['catch'](function () { ciz(null); });
})();
