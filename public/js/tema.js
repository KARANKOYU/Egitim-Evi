/* Tema (açık / koyu / sistem) — sayfa çizilmeden ÖNCE çalışır.

   Neden ayrı ve küçük bir dosya: app.js yüklenene kadar geçen sürede koyu
   temayı seçmiş kullanıcı bir an beyaz ekran görmesin. Bu dosya <head>
   içinde eş zamanlı yüklenir, localStorage'daki seçimi okur ve <html>
   etiketine data-tema="acik|koyu" yazar; "sistem" seçiliyse etiket yazılmaz,
   CSS işletim sisteminin tercihini kullanır.

   İçerik Güvenlik Politikası (CSP) satır içi betiğe izin vermediği için bu
   iş ayrı dosyada. app.js hesaptaki tercihi öğrenince window.temaAyarla ile
   günceller. */
(function () {
  'use strict';
  var ANAHTAR = 'ee_tema';
  var GECERLI = ['sistem', 'acik', 'koyu'];

  function oku() {
    try { var d = localStorage.getItem(ANAHTAR); return GECERLI.indexOf(d) >= 0 ? d : 'sistem'; }
    catch (e) { return 'sistem'; }
  }

  /* Telefon tarayıcısının adres çubuğu rengi temaya uysun. */
  function cubukRengi(koyuMu) {
    var m = document.querySelector('meta[name="theme-color"]:not([media])');
    if (m) m.setAttribute('content', koyuMu ? '#15181d' : '#d62839');
  }

  function uygula(deger) {
    var kok = document.documentElement;
    if (deger === 'sistem') kok.removeAttribute('data-tema');
    else kok.setAttribute('data-tema', deger);
    var koyu = deger === 'koyu' ||
      (deger === 'sistem' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
    cubukRengi(koyu);
  }

  /* Dışarıdan çağrı: app.js ayarlar sayfasından ve girişte hesaptaki tercihle. */
  window.temaAyarla = function (deger) {
    if (GECERLI.indexOf(deger) < 0) deger = 'sistem';
    try { localStorage.setItem(ANAHTAR, deger); } catch (e) { /* özel pencere olabilir */ }
    uygula(deger);
    return deger;
  };
  window.temaOku = oku;

  uygula(oku());

  /* "Sistem" seçiliyken işletim sistemi tema değiştirirse çubuk rengi de değişsin. */
  if (window.matchMedia) {
    try {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function () {
        if (oku() === 'sistem') uygula('sistem');
      });
    } catch (e) { /* eski tarayıcı */ }
  }
})();
