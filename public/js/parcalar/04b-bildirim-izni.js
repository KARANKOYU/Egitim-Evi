/* Telefon bildirimi (Web Push): izin, abonelik, çıkışta bırakma.
   Abonelik tarayıcıya ve hesaba bağlıdır. Sunucu yalnızca bu tarayıcının
   bildirim adresini ve açık anahtarını tutar; içerik o anahtarla şifrelenip
   gönderilir. Çıkışta abonelik bırakılır: aynı cihazda başka biri girerse
   önceki kişinin bildirimleri ona gelmesin. */

function bildirimDestegi() {
  return !!(window.isSecureContext && 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window);
}

function base64UrlDiziye(s) {
  var d = String(s).replace(/-/g, '+').replace(/_/g, '/');
  while (d.length % 4) d += '=';
  var ham = atob(d), dizi = new Uint8Array(ham.length);
  for (var i = 0; i < ham.length; i++) dizi[i] = ham.charCodeAt(i);
  return dizi;
}
function diziBase64Url(tampon) {
  var b = new Uint8Array(tampon), s = '';
  for (var i = 0; i < b.length; i++) s += String.fromCharCode(b[i]);
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

/* Servis işçisi hazır olmayabilir (kayıt başarısız): sonsuza dek beklenmesin. */
function isciHazir(ms) {
  return new Promise(function (tamam, hata) {
    var sayac = setTimeout(function () { hata(new Error('Uygulama bileşeni yüklenemedi. Sayfayı yenileyip tekrar dene.')); }, ms || 8000);
    navigator.serviceWorker.ready.then(function (k) { clearTimeout(sayac); tamam(k); }, function (e) { clearTimeout(sayac); hata(e); });
  });
}

/* Kayıtlı servis işçisi yoksa beklemeden null (çıkış gecikmesin). */
function mevcutAbonelik() {
  if (!bildirimDestegi()) return Promise.resolve(null);
  return navigator.serviceWorker.getRegistration('/').then(function (k) {
    return k && k.pushManager ? k.pushManager.getSubscription() : null;
  })['catch'](function () { return null; });
}

function abonelikGovdesi(a) {
  var j = a.toJSON ? a.toJSON() : {};
  return { endpoint: j.endpoint || a.endpoint, keys: j.keys || {} };
}

function bildirimAc() {
  if (!bildirimDestegi()) {
    return Promise.reject(new Error(window.isSecureContext
      ? 'Bu tarayıcı telefon bildirimini desteklemiyor. iPhone\'da önce Paylaş > Ana Ekrana Ekle ile uygulamayı kur, oradan aç.'
      : 'Telefon bildirimi yalnızca güvenli (https) bağlantıda çalışır.'));
  }
  var anahtar;
  return Notification.requestPermission().then(function (izin) {
    if (izin !== 'granted') throw new Error('Bildirim izni verilmedi. Tarayıcının site ayarlarından izin verip tekrar dene.');
    return api('/push/anahtar');
  }).then(function (d) {
    anahtar = d.anahtar;
    return isciHazir();
  }).then(function (kayit) {
    return kayit.pushManager.getSubscription().then(function (eski) {
      /* Sunucunun anahtarı değiştiyse eski abonelik bırakılıp yenisi alınır. */
      var eskiAnahtar = eski && eski.options && eski.options.applicationServerKey
        ? diziBase64Url(eski.options.applicationServerKey) : '';
      if (eski && eskiAnahtar === anahtar) return eski;
      return (eski ? eski.unsubscribe() : Promise.resolve()).then(function () {
        return kayit.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: base64UrlDiziye(anahtar) });
      });
    });
  }).then(function (abone) {
    return api('/push/abone', 'POST', abonelikGovdesi(abone));
  });
}

function bildirimKapat() {
  return mevcutAbonelik().then(function (a) {
    if (!a) return;
    return api('/push/iptal', 'POST', { endpoint: a.endpoint })['catch'](function () { })
      .then(function () { return a.unsubscribe(); });
  });
}

/* Çıkışta: sunucudaki kaydı sil, tarayıcıdaki aboneliği bırak. Hiçbir hata
   çıkışı durdurmaz; en fazla 3 saniye beklenir. */
function bildirimAboneligiBirak() {
  var is = mevcutAbonelik().then(function (a) {
    if (!a) return;
    return api('/push/iptal', 'POST', { endpoint: a.endpoint })['catch'](function () { })
      .then(function () { return a.unsubscribe(); })['catch'](function () { });
  })['catch'](function () { });
  return Promise.race([is, new Promise(function (t) { setTimeout(t, 3000); })]);
}

/* Açılışta: bu tarayıcıdaki abonelik başka bir hesaba aitse (ortak cihaz,
   çıkış yapılmadan kapanmış oturum) bırakılır. */
function bildirimEsitle() {
  return mevcutAbonelik().then(function (a) {
    if (!a || !S.token) return;
    return api('/push/durum', 'POST', { endpoint: a.endpoint }).then(function (d) {
      if (!d.benim) return a.unsubscribe();
    });
  })['catch'](function () { });
}

/* Ayarlar sayfasındaki kutu. */
function bildirimKartiCiz() {
  var kap = $('bildirimAyar');
  if (!kap) return;
  if (!bildirimDestegi()) {
    kap.innerHTML = '<div class="hint">' + (window.isSecureContext
      ? 'Bu tarayıcı telefon bildirimini desteklemiyor. iPhone\'da önce Paylaş > Ana Ekrana Ekle ile uygulamayı kur, oradan aç.'
      : 'Telefon bildirimi yalnızca güvenli (https) bağlantıda çalışır.') + '</div>';
    return;
  }
  mevcutAbonelik().then(function (a) {
    if (!$('bildirimAyar')) return;
    var reddedildi = Notification.permission === 'denied';
    kap.innerHTML = a
      ? '<div class="satir" style="border:0;padding:0"><div class="buyu"><div class="ad">' + ik('onay') + 'Bu cihazda açık</div>' +
        '<div class="alt">Uygulama kapalıyken de bildirim gelir.</div></div>' +
        '<button class="btn kucuk gri" data-act="bildirim-kapat">Kapat</button></div>'
      : '<div class="satir" style="border:0;padding:0"><div class="buyu"><div class="ad">Bu cihazda kapalı</div>' +
        '<div class="alt">' + (reddedildi ? 'Tarayıcıda bu site için bildirim engellenmiş; site ayarlarından izin ver.'
          : 'Servis eve yaklaşınca, yeni mesaj ve ödevde telefonuna bildirim gelsin.') + '</div></div>' +
        (reddedildi ? '' : '<button class="btn kucuk" data-act="bildirim-ac">Bildirimleri aç</button>') + '</div>';
  });
}

EYLEMLER['bildirim-ac'] = function (el) {
  dugmeBekle(el, 'Açılıyor...');
  return bildirimAc().then(function () {
    bildirimKartiCiz();
    mesajGoster('bildirimAyarMesaj', 'iyi', 'Telefon bildirimleri açıldı.');
  })['catch'](function (e) {
    dugmeBitir(el);
    mesajGoster('bildirimAyarMesaj', 'hata', e.message);
  });
};

EYLEMLER['bildirim-kapat'] = function (el) {
  dugmeBekle(el, 'Kapatılıyor...');
  return bildirimKapat().then(function () { bildirimKartiCiz(); })
    ['catch'](function (e) { dugmeBitir(el); mesajGoster('bildirimAyarMesaj', 'hata', e.message); });
};
