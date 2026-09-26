/* Girişten sonraki adımlar: aydınlatma metni onayı, ardından (okulun ya da
   sistem yöneticisinin verdiği şifreyle girildiyse) kişinin kendi şifresini
   belirlemesi. İkisi de bitmeden
   uygulama açılmaz; sunucu da bu durumdaki isteği reddeder. */

function girisSonrasi(d) {
  /* Birden çok portalı olan yetişkin önce hesabının ana sayfasını görür
     (portal kartları; soldaki menüden seçer). Tek çocuğu olan veli o çocukla
     açılır. Yeni oturumda (giriş, portal değişimi) portal dışı bilgisi
     sunucunun cevabından gelir. */
  if (d && d.token) portalDisiYaz(!!d.kisilikSec);
  if (d && d.kisilikSec) S.acilis = 'ana';
  if (d && d.cocuk) S.veliCocuk = d.cocuk;
  if (d && d.kvkkGuncel === false) { kvkkOnayIste(d); return; }
  if (S.user && S.user.sifreDegismeli) { sifreBelirleIste(); return; }
  uygulamayiBaslat();
}

function sifreBelirleIste() {
  if ($('zYeni')) return;   // pencere zaten açık
  $('dis').style.display = 'none';
  $('app').classList.remove('on');
  /* Yetişkin hesabına şifreyi sistem yöneticisi verir (okulu o açtıysa);
     öğrenci ve servisçiye okul. */
  var veren = S.user && S.user.yetiskin ? 'Sistem yöneticisinin' : 'Okulunun';
  modalAc('Kendi şifreni belirle',
    '<p>' + veren + ' verdiği şifreyle girdin. Devam etmeden önce yalnızca senin bildiğin bir şifre belirle; ' +
    'bundan sonra girişte onu kullanacaksın.</p>' +
    '<div class="field"><label for="zEski">Şu anki şifren</label>' +
    '<input type="password" id="zEski" autocomplete="current-password">' +
    '<div class="hint">' + (S.user && S.user.yetiskin ? 'Sistem yöneticisinin sana verdiği şifre.'
      : 'Okulun sana verdiği şifre (çoğu zaman T.C. kimlik numaran).') + '</div></div>' +
    '<div class="field"><label for="zYeni">Yeni şifren</label>' +
    '<input type="password" id="zYeni" autocomplete="new-password" aria-describedby="zKural">' +
    sifreKuralListesi('zKural', gucluSifreli(S.user)) +
    '<div class="hint">T.C. kimlik numaranı ya da kullanıcı adını içermesin.</div></div>' +
    '<div class="field"><label for="zYeni2">Yeni şifren (tekrar)</label>' +
    '<input type="password" id="zYeni2" autocomplete="new-password"></div>' +
    '<div id="zMesaj"></div>',
    '<button class="btn gri" data-act="cikis">Çıkış yap</button>' +
    '<button class="btn" data-act="zorunlu-sifre-kaydet">Şifremi kaydet</button>');
  var perde = document.querySelector('.perde');
  if (perde) perde.setAttribute('data-zorunlu', '1');
  $('zYeni').addEventListener('input', function () { sifreKurallariniIsaretle('zYeni', 'zKural'); });
  var gonder = function (e) { if (e.key === 'Enter') { e.preventDefault(); EYLEMLER['zorunlu-sifre-kaydet'](document.querySelector('[data-act="zorunlu-sifre-kaydet"]')); } };
  $('zYeni2').addEventListener('keydown', gonder);
  $('zEski').focus();
}

EYLEMLER['zorunlu-sifre-kaydet'] = function (el) {
  var kok = $('modalGovde');
  formHatalariniSil(kok);
  var eski = $('zEski').value, y1 = $('zYeni').value, y2 = $('zYeni2').value;
  var u = S.user || {};
  if (!eski) alanHatasi('zEski', 'Şu anki şifreni yaz.');
  var sorun = sifreSorunuTR(y1, gucluSifreli(u));
  if (sorun) alanHatasi('zYeni', sorun);
  else if (y1 === eski) alanHatasi('zYeni', 'Yeni şifre okulun verdiğiyle aynı olamaz.');
  else if ((u.tc && y1.indexOf(u.tc) >= 0) ||
           (u.username && String(u.username).length >= 4 && y1.toLowerCase().indexOf(String(u.username).toLowerCase()) >= 0)) {
    alanHatasi('zYeni', 'Şifren T.C. kimlik numaranı ya da kullanıcı adını içermesin.');
  } else if (y1 !== y2) alanHatasi('zYeni2', 'İki şifre birbirini tutmuyor.');
  if (kok.querySelector('.hatali')) { ilkHatayaGit(kok); return; }
  dugmeBekle(el, 'Kaydediliyor...');
  return api('/password', 'POST', { old: eski, 'new': y1 }).then(function (d) {
    S.user = d.user;
    modalKapat();
    uygulamayiBaslat();
  })['catch'](function (e) {
    dugmeBitir(el);
    var v = e.veri || {};
    if (v.alan === 'eski') { alanHatasi('zEski', e.message); $('zEski').focus(); }
    else if (v.alan === 'yeni') { alanHatasi('zYeni', e.message); $('zYeni').focus(); }
    else mesajGoster('zMesaj', 'hata', e.message);
  });
};
