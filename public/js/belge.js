/* Düz belge sayfaları (aydınlatma metni, kullanım koşulları) için küçük betik.
   Bu sayfalarda app.js yüklenmez; üst şeritteki ay/güneş düğmesi ve
   Yapımcılar listesi index.html'dekiyle aynı çalışsın diye burada kurulur.
   İçerik Güvenlik Politikası satır içi betiğe izin vermediği için ayrı dosya. */
(function () {
  'use strict';

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  /* Yapımcılar: düğmeye basınca liste açılır; dışarı tıklayınca ya da Esc ile kapanır. */
  var dugme = document.getElementById('btnYapimcilar');
  var liste = document.getElementById('yapimciListe');
  function acKapa(ac) {
    liste.hidden = !ac;
    dugme.setAttribute('aria-expanded', ac ? 'true' : 'false');
  }
  if (dugme && liste) {
    dugme.addEventListener('click', function () { acKapa(liste.hidden); });
    document.addEventListener('click', function (e) {
      if (!liste.hidden && !(e.target.closest && e.target.closest('.yapimci-kutu'))) acKapa(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !liste.hidden) { acKapa(false); dugme.focus(); }
    });
  }

  /* Ay/güneş: açık ve koyu görünüm arasında geçiş (seçim bu tarayıcıda kalır). */
  var tema = document.querySelector('[data-act="tema-degis"]');
  if (tema) {
    tema.addEventListener('click', function () {
      var kok = document.documentElement.getAttribute('data-tema');
      var koyu = kok === 'koyu' || (!kok && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
      if (window.temaAyarla) window.temaAyarla(koyu ? 'acik' : 'koyu');
    });
  }

  /* Yapımcı listesi sunucudaki yapimcilar.json'dan gelir; gelmezse sayfadaki
     hazır satır (proje sahibi) kalır. */
  var yerler = document.querySelectorAll('[data-yapimcilar]');
  if (!yerler.length || !window.fetch) return;
  fetch('/api/site', { credentials: 'omit' }).then(function (r) { return r.ok ? r.json() : null; }).then(function (d) {
    var l = d && Array.isArray(d.yapimcilar) ? d.yapimcilar : [];
    if (!l.length) return;
    var gh = document.querySelector('#btnYapimcilar .gh');
    gh = gh ? gh.outerHTML : '';
    var html = l.map(function (y) {
      var ad = '<span>' + esc(y.ad) + '</span>' + (y.katki ? '<small>' + esc(y.katki) + '</small>' : '');
      return '<li>' + (y.github
        ? '<a href="https://github.com/' + encodeURIComponent(y.github) + '" target="_blank" rel="noopener">' + gh +
          '<span class="yapimci-ad">' + ad + '</span></a>'
        : '<div class="yapimci-satir"><span class="yapimci-ad">' + ad + '</span></div>') + '</li>';
    }).join('');
    for (var i = 0; i < yerler.length; i++) yerler[i].innerHTML = html;
  })['catch'](function () { /* liste gelmezse hazır satır kalır */ });
})();
