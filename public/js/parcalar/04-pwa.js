/* Telefona uygulama olarak kurma (PWA) yardımcıları. */

/* ================= uygulama olarak kurma (PWA) =================
   Tarayıcı "kurulabilir" dediğinde beforeinstallprompt olayı gelir,
   onu saklayıp kendi butonumuza bağlıyoruz. Servis işçisi yalnızca
   güvenli bağlamda (https:// ya da localhost) çalışır; LAN üzerinden
   http:// ile girildiğinde tarayıcı kurulum önermez, kullanıcı yine de
   menüden "Ana ekrana ekle" diyebilir. */

var kurulumOlayi = null;

function kurButonu(goster) {
  var b = $('btnKur');
  if (b) b.style.display = goster ? '' : 'none';
}

function pwaKur() {
  if ('serviceWorker' in navigator && window.isSecureContext) {
    var kaydet = function () {
      navigator.serviceWorker.register('/sw.js')['catch'](function (e) {
        /* Kayıt başarısızsa uygulama normal çalışmaya devam eder. */
        console.warn('Servis işçisi kaydedilemedi:', e && e.message);
      });
    };
    /* load olayı çoktan geçmiş olabilir; o durumda beklemeden kaydet. */
    if (document.readyState === 'complete') kaydet();
    else window.addEventListener('load', kaydet);
  }

  window.addEventListener('beforeinstallprompt', function (e) {
    e.preventDefault();
    kurulumOlayi = e;
    kurButonu(true);
  });

  window.addEventListener('appinstalled', function () {
    kurulumOlayi = null;
    kurButonu(false);
    try { localStorage.setItem('ee_kuruldu', '1'); } catch (x) {}
  });

  var b = $('btnKur');
  if (!b) return;
  b.onclick = function () {
    if (kurulumOlayi) {
      kurulumOlayi.prompt();
      kurulumOlayi.userChoice.then(function () {
        kurulumOlayi = null;
        kurButonu(false);
      });
      return;
    }
    kurulumYardimi();
  };
}

/* Tarayıcı kendiliğinden kurulum önermiyorsa elle nasıl yapılacağını anlat. */
function kurulumYardimi() {
  var ua = navigator.userAgent || '';
  var iosMu = /iPhone|iPad|iPod/i.test(ua);
  var guvenli = window.isSecureContext;

  var h = '';
  if (!guvenli) {
    h += '<div class="msg bilgi">Site <b>http://</b> üzerinden açıldığı için tarayıcı ' +
      'otomatik kurulum önermiyor. Yine de ana ekrana ekleyebilirsin.</div>';
  }
  if (iosMu) {
    h += '<p><b>iPhone / iPad (Safari):</b></p><ol style="margin:0 0 12px 18px">' +
      '<li>Alttaki <b>Paylaş</b> düğmesine bas</li>' +
      '<li><b>Ana Ekrana Ekle</b>yi seç</li>' +
      '<li><b>Ekle</b>ye bas</li></ol>';
  } else {
    h += '<p><b>Android (Chrome):</b></p><ol style="margin:0 0 12px 18px">' +
      '<li>Sağ üstteki <b>⋮</b> menüsüne bas</li>' +
      '<li><b>Uygulamayı yükle</b> ya da <b>Ana ekrana ekle</b>yi seç</li></ol>' +
      '<p><b>Bilgisayar (Chrome / Edge):</b></p><ol style="margin:0 0 12px 18px">' +
      '<li>Adres çubuğunun sağındaki <b>kurulum simgesine</b> bas</li>' +
      '<li>Ya da menüden <b>Uygulamayı yükle</b>yi seç</li></ol>';
  }
  h += '<div class="hint">Kurunca uygulama ayrı bir simgeyle açılır, tarayıcı ' +
    'çubuğu görünmez.</div>';
  modalAc('Uygulamayı yükle', h);
}
